import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { BlogPost } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const db = await getDb();
    let post = await db.collection("blog").findOne({ _id: id } as Record<string, unknown>);
    if (!post) {
      try { post = await db.collection("blog").findOne({ _id: new ObjectId(id) }); } catch {}
    }
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json({ ...post, _id: String(post._id) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Blog [id] GET error:", error);
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
    const { _id, ...updateData } = body as BlogPost;
    updateData.updatedAt = new Date();

    let result = await db.collection("blog").updateOne(
      { _id: id } as Record<string, unknown>,
      { $set: updateData as Record<string, unknown> }
    );
    if (result.matchedCount === 0) {
      try {
        result = await db.collection("blog").updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData as Record<string, unknown> }
        );
      } catch {}
    }
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Blog [id] PUT error:", error);
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

    let result = await db.collection("blog").deleteOne({ _id: id } as Record<string, unknown>);
    if (result.deletedCount === 0) {
      try { result = await db.collection("blog").deleteOne({ _id: new ObjectId(id) }); } catch {}
    }
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Blog [id] DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
