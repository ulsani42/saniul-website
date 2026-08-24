import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { AboutContent } from "@/types";

const defaults: AboutContent = {
  hero: {
    heading: "",
    headingAccent: "",
    text: "",
  },
  portrait: {
    image: "",
  },
  professionalIdentity: {
    title: "",
    text: "",
    additionalText: "",
  },
  philosophy: {
    quote: "",
  },
  leadership: {
    title: "",
    items: [],
  },
  personal: {
    title: "",
    content: "",
  },
  updatedAt: new Date(),
};

export async function GET() {
  try {
    await requireAdmin();
    const db = await getDb();
    const content = await db.collection("about").findOne({});
    return NextResponse.json(content || defaults);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("About GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const db = await getDb();
    const { _id, ...updateData } = body as AboutContent;
    updateData.updatedAt = new Date();

    await db.collection("about").updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("About PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
