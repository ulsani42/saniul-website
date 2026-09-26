"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import type { SiteSettings } from "@/types";

const defaults: SiteSettings = {
  siteName: "Sani Ul",
  tagline: "Business Professional • Entrepreneur • Operations Manager",
  description: "Sani Ul is a business professional, entrepreneur, and Operations Manager at Ayan Trading House.",
  contact: { email: "", phone: "", whatsapp: "", location: "" },
  social: { linkedin: "", facebook: "", instagram: "" },
  seo: { siteTitle: "", siteDescription: "", ogImage: "" },
  updatedAt: new Date(),
};

function merge<T extends Record<string, unknown>>(base: T, incoming: Record<string, unknown>): T {
  if (!incoming) return base;
  const result = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(incoming)) {
    const val = incoming[key];
    if (val !== undefined && val !== null) {
      if (typeof val === "object" && !Array.isArray(val) && typeof base[key] === "object" && base[key] !== null && !Array.isArray(base[key])) {
        result[key] = merge(base[key] as Record<string, unknown>, val as Record<string, unknown>);
      } else {
        result[key] = val;
      }
    }
  }
  return result as T;
}

const inputClass =
  "w-full rounded-lg border border-sand bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/10";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-sand bg-white p-6">
      <h2 className="mb-4 font-serif text-lg font-semibold text-ink">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-charcoal">{label}</label>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-sand" />
      <div className="rounded-xl border border-sand bg-white p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-sand" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-sand/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsEditor() {
  const [data, setData] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((r) => r.json())
      .then((raw) => setData(merge(defaults as unknown as Record<string, unknown>, raw as Record<string, unknown>) as unknown as SiteSettings))
      .catch(() => setToast({ type: "error", message: "Unable to load settings." }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const updateField = (field: keyof SiteSettings, value: SiteSettings[keyof SiteSettings]) => {
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setToast({ type: "success", message: "Changes saved successfully" });
    } catch {
      setToast({ type: "error", message: "Unable to save changes. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton />;
  if (!data) return <div className="text-error">Failed to load settings</div>;

  return (
    <div className="space-y-6 pb-12">
      {toast && (
        <div
          className={`fixed left-4 right-4 sm:left-auto sm:right-6 top-16 sm:top-6 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.type === "success" ? "bg-success text-white" : "bg-error text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Site Settings</h1>
          <p className="mt-1 text-sm text-muted">Configure general website settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <Section title="General Settings">
        <Field label="Site Name">
          <input
            value={data.siteName}
            onChange={(e) => updateField("siteName", e.target.value)}
            className={inputClass}
            placeholder="Your site name"
          />
        </Field>
        <Field label="Tagline">
          <input
            value={data.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            className={inputClass}
            placeholder="Brief tagline"
          />
        </Field>
        <Field label="Description">
          <textarea
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="About your website"
          />
        </Field>
      </Section>
    </div>
  );
}
