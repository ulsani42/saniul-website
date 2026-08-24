import { NextRequest, NextResponse } from "next/server";
import { ObjectId, type Document } from "mongodb";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { BlogPost } from "@/types";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    await requireAdmin();
    const db = await getDb();
    const posts = await db
      .collection("blog")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      posts.map((p) => ({ ...p, _id: String(p._id) }))
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Blog GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const db = await getDb();

    let slug = body.slug || generateSlug(body.title);

    const existing = await db
      .collection("blog")
      .findOne({ slug });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const newObjectId = new ObjectId();
    const result = await db.collection("blog").insertOne({
      ...body,
      slug,
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
    console.error("Blog POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
