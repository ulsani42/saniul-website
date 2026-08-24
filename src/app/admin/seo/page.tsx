"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import type { SiteSettings } from "@/types";
import ImageUploader from "@/components/ui/ImageUploader";

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

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-charcoal">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-sand" />
      <div className="rounded-xl border border-sand bg-white p-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-sand" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-sand/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SEOEditor() {
  const [data, setData] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((r) => r.json())
      .then((raw) => setData(merge(defaults as unknown as Record<string, unknown>, raw as Record<string, unknown>) as unknown as SiteSettings))
      .catch(() => setToast({ type: "error", message: "Unable to load SEO settings." }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const updateNested = (field: string, value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, seo: { ...prev.seo, [field]: value } };
    });
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
      setToast({ type: "success", message: "SEO settings saved successfully" });
    } catch {
      setToast({ type: "error", message: "Unable to save changes. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton />;
  if (!data) return <div className="text-error">Failed to load SEO settings</div>;

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
          <h1 className="font-serif text-2xl font-semibold text-ink">SEO Settings</h1>
          <p className="mt-1 text-sm text-muted">Control how your site appears in search engines</p>
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

      <Section title="Search Engine Results">
        <Field
          label="Site Title"
          hint="This appears as the clickable headline in search results (50-60 characters recommended)"
        >
          <input
            value={data.seo.siteTitle}
            onChange={(e) => updateNested("siteTitle", e.target.value)}
            className={inputClass}
            placeholder="Sani Ul — Business Professional & Entrepreneur"
            maxLength={70}
          />
        </Field>
        <Field
          label="Site Description"
          hint="This appears below the title in search results (150-160 characters recommended)"
        >
          <textarea
            value={data.seo.siteDescription}
            onChange={(e) => updateNested("siteDescription", e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="Sani Ul is a business professional, entrepreneur, and Operations Manager at Ayan Trading House in Bangladesh."
            maxLength={200}
          />
        </Field>
      </Section>

      <Section title="Social Media Preview">
        <Field
          label="OG Image"
          hint="This image appears when your website link is shared on Facebook, LinkedIn, Twitter, etc. Recommended size: 1200x630 pixels."
        >
          <ImageUploader
            value={data.seo.ogImage}
            onChange={(url) => setData({ ...data, seo: { ...data.seo, ogImage: url } })}
            label="OG Image"
          />
        </Field>
      </Section>
    </div>
  );
}
