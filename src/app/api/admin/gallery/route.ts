import { NextRequest, NextResponse } from "next/server";
import { ObjectId, type Document } from "mongodb";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { GalleryImage } from "@/types";

export async function GET() {
  try {
    await requireAdmin();
    const db = await getDb();
    const images = await db
      .collection("gallery")
      .find()
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return NextResponse.json(
      images.map((img) => ({ ...img, _id: String(img._id) }))
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Gallery GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const db = await getDb();

    if (Array.isArray(body)) {
      const updates = body.map((item: { _id: string; order: number }) => {
        const filter: Record<string, unknown> = {};
        try { filter._id = new ObjectId(item._id); } catch { filter._id = item._id; }
        return db.collection("gallery").updateOne(filter, { $set: { order: item.order, updatedAt: new Date() } });
      });
      await Promise.all(updates);
      return NextResponse.json({ success: true });
    }

    const newObjectId = new ObjectId();
    const result = await db.collection("gallery").insertOne({
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
    console.error("Gallery POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
