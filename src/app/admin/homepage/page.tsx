"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, X, Save, Loader2 } from "lucide-react";
import type { HomepageContent } from "@/types";
import ImageUploader from "@/components/ui/ImageUploader";

const defaults: HomepageContent = {
  hero: { eyebrow: "", title: "", titleAccent: "", description: "", image: "", cta1Text: "", cta1Link: "", cta2Text: "", cta2Link: "" },
  credibility: [],
  introduction: { heading: "", headingAccent: "", text: "", image: "", ctaText: "", ctaLink: "" },
  journey: { heading: "", subtitle: "" },
  businesses: { heading: "", subtitle: "" },
  cta: { heading: "", text: "", ctaText: "", ctaLink: "" },
  updatedAt: new Date(),
};

function merge<T>(base: T, incoming: Partial<T>): T {
  if (!incoming) return base;
  const result = { ...base };
  for (const key of Object.keys(incoming) as (keyof T)[]) {
    const val = incoming[key];
    if (val !== undefined && val !== null) {
      if (typeof val === "object" && !Array.isArray(val) && typeof base[key] === "object" && base[key] !== null) {
        (result as Record<string, unknown>)[key as string] = merge(base[key] as Record<string, unknown>, val as Record<string, unknown>);
      } else {
        (result as Record<string, unknown>)[key as string] = val;
      }
    }
  }
  return result;
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-sand" />
      <div className="rounded-xl border border-sand bg-white p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-sand" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-sand/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomepageEditor() {
  const [data, setData] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((r) => r.json())
      .then((raw) => setData(merge(defaults, raw)))
      .catch(() => setToast({ type: "error", message: "Unable to load homepage content." }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const updateField = useCallback(
    <K extends keyof HomepageContent>(key: K, value: HomepageContent[K]) => {
      setData((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    []
  );

  const updateNested = useCallback(
    <T,>(parent: keyof HomepageContent, field: keyof T, value: T[keyof T]) => {
      setData((prev) => {
        if (!prev) return prev;
        const section = (prev[parent] ?? {}) as Record<string, unknown>;
        return { ...prev, [parent]: { ...section, [field]: value } };
      });
    },
    []
  );

  const addCredibility = () => {
    if (!data) return;
    updateField("credibility", [...(data.credibility ?? []), { label: "", value: "" }]);
  };

  const removeCredibility = (index: number) => {
    if (!data) return;
    updateField("credibility", (data.credibility ?? []).filter((_, i) => i !== index));
  };

  const updateCredibility = (index: number, field: "label" | "value", value: string) => {
    if (!data) return;
    const updated = [...(data.credibility ?? [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField("credibility", updated);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/homepage", {
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
  if (!data) return <div className="text-error">Failed to load content</div>;

  return (
    <div className="space-y-6 pb-12">
      {toast && (
        <div
          className={`fixed left-4 right-4 sm:left-auto sm:right-6 top-16 sm:top-6 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-success text-white"
              : "bg-error text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Homepage</h1>
          <p className="mt-1 text-sm text-muted">Edit the homepage content</p>
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

      <Section title="Hero">
        <Field label="Eyebrow">
          <input value={data.hero.eyebrow} onChange={(e) => updateNested("hero", "eyebrow", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Title">
          <input value={data.hero.title} onChange={(e) => updateNested("hero", "title", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Title Accent">
          <input value={data.hero.titleAccent} onChange={(e) => updateNested("hero", "titleAccent", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Description">
          <textarea value={data.hero.description} onChange={(e) => updateNested("hero", "description", e.target.value)} rows={3} className={inputClass} />
        </Field>
        <ImageUploader
          value={data.hero.image}
          onChange={(url) => setData({ ...data, hero: { ...data.hero, image: url } })}
          label="Hero Image"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary Button Text">
            <input value={data.hero.cta1Text} onChange={(e) => updateNested("hero", "cta1Text", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Primary Button Link">
            <input value={data.hero.cta1Link} onChange={(e) => updateNested("hero", "cta1Link", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Secondary Button Text">
            <input value={data.hero.cta2Text} onChange={(e) => updateNested("hero", "cta2Text", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Secondary Button Link">
            <input value={data.hero.cta2Link} onChange={(e) => updateNested("hero", "cta2Link", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Credibility">
        {(data.credibility ?? []).map((item, i) => (
          <div key={i} className="flex items-end gap-3">
            <div className="flex-1 grid gap-4 sm:grid-cols-2">
              <Field label="Label">
                <input value={item.label} onChange={(e) => updateCredibility(i, "label", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Value">
                <input value={item.value} onChange={(e) => updateCredibility(i, "value", e.target.value)} className={inputClass} />
              </Field>
            </div>
            <button onClick={() => removeCredibility(i)} className="mb-0.5 rounded-lg p-2 text-muted transition-colors hover:bg-error/10 hover:text-error">
              <X size={16} />
            </button>
          </div>
        ))}
        <button onClick={addCredibility} className="flex items-center gap-2 rounded-lg border border-dashed border-sand px-4 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent">
          <Plus size={16} /> Add Item
        </button>
      </Section>

      <Section title="Introduction">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Heading">
            <input value={data.introduction.heading} onChange={(e) => updateNested("introduction", "heading", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Heading Accent">
            <input value={data.introduction.headingAccent} onChange={(e) => updateNested("introduction", "headingAccent", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Text">
          <textarea value={data.introduction.text} onChange={(e) => updateNested("introduction", "text", e.target.value)} rows={4} className={inputClass} />
        </Field>
        <ImageUploader
          value={data.introduction.image}
          onChange={(url) => setData({ ...data, introduction: { ...data.introduction, image: url } })}
          label="Introduction Image"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button Text">
            <input value={data.introduction.ctaText} onChange={(e) => updateNested("introduction", "ctaText", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Button Link">
            <input value={data.introduction.ctaLink} onChange={(e) => updateNested("introduction", "ctaLink", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Journey">
        <Field label="Heading">
          <input value={data.journey.heading} onChange={(e) => updateNested("journey", "heading", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Subtitle">
          <textarea value={data.journey.subtitle} onChange={(e) => updateNested("journey", "subtitle", e.target.value)} rows={2} className={inputClass} />
        </Field>
      </Section>

      <Section title="Businesses Section">
        <Field label="Heading">
          <input value={data.businesses.heading} onChange={(e) => updateNested("businesses", "heading", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Subtitle">
          <textarea value={data.businesses.subtitle} onChange={(e) => updateNested("businesses", "subtitle", e.target.value)} rows={2} className={inputClass} />
        </Field>
      </Section>

      <Section title="Call to Action">
        <Field label="Heading">
          <input value={data.cta.heading} onChange={(e) => updateNested("cta", "heading", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Text">
          <textarea value={data.cta.text} onChange={(e) => updateNested("cta", "text", e.target.value)} rows={2} className={inputClass} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button Text">
            <input value={data.cta.ctaText} onChange={(e) => updateNested("cta", "ctaText", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Button Link">
            <input value={data.cta.ctaLink} onChange={(e) => updateNested("cta", "ctaLink", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </Section>
    </div>
  );
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
