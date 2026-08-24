"use client";

import { useEffect, useState } from "react";
import {
  Globe,
  Images,
  Building2,
  Briefcase,
  FileText,
  MessageSquare,
  Clock,
} from "lucide-react";

interface DashboardData {
  galleryCount: number;
  businessesCount: number;
  experienceCount: number;
  blogDrafts: number;
  blogPublished: number;
  unreadMessages: number;
  recentActivity: { action: string; section: string; time: string }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) throw new Error("Failed to load dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-error/20 bg-error/5 p-4 text-error">
        {error}
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      label: "Website Status",
      value: "Live",
      icon: <Globe size={20} />,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Gallery Images",
      value: data.galleryCount,
      icon: <Images size={20} />,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Businesses",
      value: data.businessesCount,
      icon: <Building2 size={20} />,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Experience",
      value: data.experienceCount,
      icon: <Briefcase size={20} />,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Blog Posts",
      value: `${data.blogPublished} published`,
      sub: `${data.blogDrafts} drafts`,
      icon: <FileText size={20} />,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Unread Messages",
      value: data.unreadMessages,
      icon: <MessageSquare size={20} />,
      color: data.unreadMessages > 0 ? "text-error" : "text-muted",
      bg: data.unreadMessages > 0 ? "bg-error/10" : "bg-sand/30",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Welcome back, Sani
        </h1>
        <p className="mt-1 text-sm text-muted">
          Here&apos;s an overview of your website.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-sand bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted">
                {stat.label}
              </span>
              <div className={`rounded-lg p-2 ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-semibold text-ink">{stat.value}</p>
              {stat.sub && (
                <p className="mt-0.5 text-xs text-muted">{stat.sub}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-sand bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
          <Clock size={16} />
          Recent Activity
        </h2>
        {data.recentActivity.length > 0 ? (
          <ul className="space-y-3">
            {data.recentActivity.map((item, i) => (
              <li
                key={i}
                className="flex items-center justify-between border-b border-sand/50 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{item.action}</p>
                  <p className="text-xs text-muted">{item.section}</p>
                </div>
                <span className="text-xs text-muted whitespace-nowrap">
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
