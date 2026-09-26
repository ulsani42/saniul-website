import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { Experience } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const db = await getDb();
    const experience = await db
      .collection("experiences")
      .findOne({ _id: id } as Record<string, unknown>);

    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json({ ...experience, _id: String(experience._id) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Experience [id] GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const db = await getDb();
    const { _id, ...updateData } = body as Experience;
    updateData.updatedAt = new Date();

    const result = await db
      .collection("experiences")
      .updateOne({ _id: id } as Record<string, unknown>, { $set: updateData as Record<string, unknown> });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Experience [id] PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const db = await getDb();

    let result = await db.collection("experiences").deleteOne({ _id: id } as Record<string, unknown>);

    if (result.deletedCount === 0) {
      try {
        result = await db.collection("experiences").deleteOne({ _id: new ObjectId(id) });
      } catch {
        // id is not a valid ObjectId, string match already failed above
      }
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Experience [id] DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
