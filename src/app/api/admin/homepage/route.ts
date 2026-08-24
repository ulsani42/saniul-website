import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { HomepageContent } from "@/types";

const defaults: HomepageContent = {
  hero: {
    eyebrow: "",
    title: "",
    titleAccent: "",
    description: "",
    image: "",
    cta1Text: "",
    cta1Link: "",
    cta2Text: "",
    cta2Link: "",
  },
  credibility: [],
  introduction: {
    heading: "",
    headingAccent: "",
    text: "",
    image: "",
    ctaText: "",
    ctaLink: "",
  },
  journey: {
    heading: "",
    subtitle: "",
  },
  businesses: {
    heading: "",
    subtitle: "",
  },
  cta: {
    heading: "",
    text: "",
    ctaText: "",
    ctaLink: "",
  },
  updatedAt: new Date(),
};

export async function GET() {
  try {
    await requireAdmin();
    const db = await getDb();
    const content = await db.collection("homepage").findOne({});
    return NextResponse.json(content || defaults);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Homepage GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const db = await getDb();
    const { _id, ...updateData } = body as HomepageContent;
    updateData.updatedAt = new Date();

    await db.collection("homepage").updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Homepage PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
