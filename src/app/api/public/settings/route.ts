import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/data";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({
      siteName: settings.siteName,
      tagline: settings.tagline,
      social: settings.social,
      contact: settings.contact,
    });
  } catch {
    return NextResponse.json({ social: {}, contact: {} });
  }
}
