import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { SiteSettings } from "@/types";

const defaults: SiteSettings = {
  siteName: "Sani Ul",
  tagline: "",
  description: "",
  contact: {
    email: "",
    phone: "",
    whatsapp: "",
    location: "",
  },
  social: {
    linkedin: "",
    facebook: "",
    instagram: "",
  },
  seo: {
    siteTitle: "",
    siteDescription: "",
    ogImage: "",
  },
  updatedAt: new Date(),
};

export async function GET() {
  try {
    await requireAdmin();
    const db = await getDb();
    const settings = await db.collection("siteSettings").findOne({});
    return NextResponse.json(settings || defaults);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Site settings GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const db = await getDb();
    const { _id, ...updateData } = body as SiteSettings;
    updateData.updatedAt = new Date();

    const result = await db.collection("siteSettings").updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({ success: true, upsertedId: result.upsertedId });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Site settings PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
