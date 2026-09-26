import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { ContactMessage } from "@/types";

export async function GET() {
  try {
    await requireAdmin();
    const db = await getDb();
    const messages = await db
      .collection("messages")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      messages.map((m) => ({ ...m, _id: String(m._id) }))
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Messages GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
