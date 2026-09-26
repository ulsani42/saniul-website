import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    await requireAdmin();
    const db = await getDb();

    const [
      galleryCount,
      businessesCount,
      experienceCount,
      blogDrafts,
      blogPublished,
      unreadMessages,
    ] = await Promise.all([
      db.collection("gallery").countDocuments(),
      db.collection("businesses").countDocuments(),
      db.collection("experiences").countDocuments(),
      db.collection("blog").countDocuments({ published: false }),
      db.collection("blog").countDocuments({ published: true }),
      db.collection("messages").countDocuments({ read: false }),
    ]);

    const recentActivity: { action: string; section: string; time: string; timestamp: number }[] = [];

    const recentGallery = await db
      .collection("gallery")
      .find()
      .sort({ updatedAt: -1 })
      .limit(1)
      .toArray();
    if (recentGallery.length > 0) {
      const item = recentGallery[0];
      const ts = new Date(item.updatedAt).getTime();
      recentActivity.push({
        action: `Gallery image "${item.title || "Untitled"}" updated`,
        section: "Gallery",
        time: formatTimeAgo(Date.now() - ts),
        timestamp: ts,
      });
    }

    const recentBlog = await db
      .collection("blog")
      .find()
      .sort({ updatedAt: -1 })
      .limit(1)
      .toArray();
    if (recentBlog.length > 0) {
      const item = recentBlog[0];
      const ts = new Date(item.updatedAt).getTime();
      recentActivity.push({
        action: `Blog post "${item.title || "Untitled"}" ${item.published ? "published" : "saved as draft"}`,
        section: "Blog",
        time: formatTimeAgo(Date.now() - ts),
        timestamp: ts,
      });
    }

    const recentBusiness = await db
      .collection("businesses")
      .find()
      .sort({ updatedAt: -1 })
      .limit(1)
      .toArray();
    if (recentBusiness.length > 0) {
      const item = recentBusiness[0];
      const ts = new Date(item.updatedAt).getTime();
      recentActivity.push({
        action: `Business "${item.name || "Untitled"}" updated`,
        section: "Businesses",
        time: formatTimeAgo(Date.now() - ts),
        timestamp: ts,
      });
    }

    const recentExperience = await db
      .collection("experiences")
      .find()
      .sort({ updatedAt: -1 })
      .limit(1)
      .toArray();
    if (recentExperience.length > 0) {
      const item = recentExperience[0];
      const ts = new Date(item.updatedAt).getTime();
      recentActivity.push({
        action: `Experience "${item.role || "Untitled"}" updated`,
        section: "Experience",
        time: formatTimeAgo(Date.now() - ts),
        timestamp: ts,
      });
    }

    const recentMessage = await db
      .collection("messages")
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();
    if (recentMessage.length > 0) {
      const item = recentMessage[0];
      const ts = new Date(item.createdAt).getTime();
      recentActivity.push({
        action: `New message from ${item.name || "Unknown"}`,
        section: "Messages",
        time: formatTimeAgo(Date.now() - ts),
        timestamp: ts,
      });
    }

    recentActivity.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({
      galleryCount,
      businessesCount,
      experienceCount,
      blogDrafts,
      blogPublished,
      unreadMessages,
      recentActivity: recentActivity.slice(0, 5),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function formatTimeAgo(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}
