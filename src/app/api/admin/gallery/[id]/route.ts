import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { deleteImage } from "@/lib/cloudinary";
import type { GalleryImage } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const db = await getDb();
    let image = await db.collection("gallery").findOne({ _id: id } as Record<string, unknown>);
    if (!image) {
      try { image = await db.collection("gallery").findOne({ _id: new ObjectId(id) }); } catch {}
    }
    if (!image) {
      return NextResponse.json({ error: "Gallery image not found" }, { status: 404 });
    }
    return NextResponse.json({ ...image, _id: String(image._id) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Gallery [id] GET error:", error);
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
    const { _id, ...updateData } = body as GalleryImage;
    updateData.updatedAt = new Date();

    let result = await db.collection("gallery").updateOne(
      { _id: id } as Record<string, unknown>,
      { $set: updateData as Record<string, unknown> }
    );
    if (result.matchedCount === 0) {
      try {
        result = await db.collection("gallery").updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData as Record<string, unknown> }
        );
      } catch {}
    }
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Gallery image not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Gallery [id] PUT error:", error);
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

    let image = await db.collection("gallery").findOne({ _id: id } as Record<string, unknown>);
    if (!image) {
      try { image = await db.collection("gallery").findOne({ _id: new ObjectId(id) }); } catch {}
    }
    if (!image) {
      return NextResponse.json({ error: "Gallery image not found" }, { status: 404 });
    }

    if (image.publicId) {
      await deleteImage(image.publicId as string);
    }

    let result = await db.collection("gallery").deleteOne({ _id: id } as Record<string, unknown>);
    if (result.deletedCount === 0) {
      try { await db.collection("gallery").deleteOne({ _id: new ObjectId(id) }); } catch {}
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Gallery [id] DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
