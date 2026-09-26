import { NextResponse } from "next/server";
import { removeAuthCookie, requireAdmin } from "@/lib/auth";

export async function POST() {
  try {
    await requireAdmin();
    await removeAuthCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    await removeAuthCookie();
    return NextResponse.json({ success: true });
  }
}
