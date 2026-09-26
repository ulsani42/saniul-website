import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { Experience } from "@/types";

export async function GET() {
  try {
    await requireAdmin();
    const db = await getDb();
    const experiences = await db
      .collection("experiences")
      .find()
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(
      experiences.map((e) => ({ ...e, _id: String(e._id) }))
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Experience GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const db = await getDb();

    const newObjectId = new ObjectId();
    const result = await db.collection("experiences").insertOne({
      ...body,
      _id: newObjectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Document);

    return NextResponse.json({
      success: true,
      _id: newObjectId.toString(),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Experience POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const db = await getDb();
    const items = body as Experience[];

    for (const item of items) {
      const { _id, ...updateData } = item;
      updateData.updatedAt = new Date();

      let result = await db.collection("experiences").updateOne(
        { _id } as Record<string, unknown>,
        { $set: updateData as Record<string, unknown> }
      );
      if (result.matchedCount === 0) {
        try {
          await db.collection("experiences").updateOne(
            { _id: new ObjectId(_id) },
            { $set: updateData as Record<string, unknown> }
          );
        } catch {}
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Experience PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
