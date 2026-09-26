"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, X, Save, Loader2 } from "lucide-react";
import type { AboutContent } from "@/types";
import ImageUploader from "@/components/ui/ImageUploader";

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-sand" />
      <div className="rounded-xl border border-sand bg-white p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-sand" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-sand/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-sand bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/10";

const defaults: AboutContent = {
  hero: { heading: "", headingAccent: "", text: "" },
  portrait: { image: "" },
  professionalIdentity: { title: "", text: "", additionalText: "" },
  philosophy: { quote: "" },
  leadership: { title: "", items: [] },
  personal: { title: "", content: "" },
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

export default function AboutEditor() {
  const [data, setData] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/about")
      .then((r) => r.json())
      .then((raw) => setData(merge(defaults as unknown as Record<string, unknown>, raw as Record<string, unknown>) as unknown as AboutContent))
      .catch(() => setToast({ type: "error", message: "Unable to load about content." }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const updateNested = useCallback(
    <T,>(parent: keyof AboutContent, field: keyof T, value: T[keyof T]) => {
      setData((prev) => {
        if (!prev) return prev;
        const section = (prev[parent] ?? {}) as Record<string, unknown>;
        return { ...prev, [parent]: { ...section, [field]: value } };
      });
    },
    []
  );

  const addLeadershipItem = () => {
    if (!data) return;
    const updated = { ...data.leadership, items: [...(data.leadership.items ?? []), ""] };
    setData({ ...data, leadership: updated });
  };

  const removeLeadershipItem = (index: number) => {
    if (!data) return;
    const updated = { ...data.leadership, items: (data.leadership.items ?? []).filter((_, i) => i !== index) };
    setData({ ...data, leadership: updated });
  };

  const updateLeadershipItem = (index: number, value: string) => {
    if (!data) return;
    const items = [...(data.leadership.items ?? [])];
    items[index] = value;
    setData({ ...data, leadership: { ...data.leadership, items } });
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/about", {
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
          <h1 className="font-serif text-2xl font-semibold text-ink">About</h1>
          <p className="mt-1 text-sm text-muted">Edit the about page content</p>
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
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Heading">
            <input value={data.hero.heading} onChange={(e) => updateNested("hero", "heading", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Heading Accent">
            <input value={data.hero.headingAccent} onChange={(e) => updateNested("hero", "headingAccent", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Text">
          <textarea value={data.hero.text} onChange={(e) => updateNested("hero", "text", e.target.value)} rows={3} className={inputClass} />
        </Field>
      </Section>

      <Section title="Portrait">
        <ImageUploader
          value={data.portrait.image}
          onChange={(url) => setData({ ...data, portrait: { ...data.portrait, image: url } })}
          label="Portrait Image"
        />
      </Section>

      <Section title="Professional Identity">
        <Field label="Title">
          <input value={data.professionalIdentity.title} onChange={(e) => updateNested("professionalIdentity", "title", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Text">
          <textarea value={data.professionalIdentity.text} onChange={(e) => updateNested("professionalIdentity", "text", e.target.value)} rows={4} className={inputClass} />
        </Field>
        <Field label="Additional Text">
          <textarea value={data.professionalIdentity.additionalText} onChange={(e) => updateNested("professionalIdentity", "additionalText", e.target.value)} rows={3} className={inputClass} />
        </Field>
      </Section>

      <Section title="Philosophy">
        <Field label="Quote">
          <textarea value={data.philosophy.quote} onChange={(e) => updateNested("philosophy", "quote", e.target.value)} rows={3} className={inputClass} />
        </Field>
      </Section>

      <Section title="Leadership">
        <Field label="Section Title">
          <input value={data.leadership.title} onChange={(e) => updateNested("leadership", "title", e.target.value)} className={inputClass} />
        </Field>
        <div className="space-y-2">
          {(data.leadership.items ?? []).map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                value={item}
                onChange={(e) => updateLeadershipItem(i, e.target.value)}
                className={inputClass}
                placeholder="Leadership item"
              />
              <button
                onClick={() => removeLeadershipItem(i)}
                className="mb-0.5 shrink-0 rounded-lg p-2 text-muted transition-colors hover:bg-error/10 hover:text-error"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addLeadershipItem}
          className="flex items-center gap-2 rounded-lg border border-dashed border-sand px-4 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <Plus size={16} /> Add Item
        </button>
      </Section>

      <Section title="Personal">
        <Field label="Title">
          <input value={data.personal.title} onChange={(e) => updateNested("personal", "title", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Content">
          <textarea value={data.personal.content} onChange={(e) => updateNested("personal", "content", e.target.value)} rows={6} className={inputClass} />
        </Field>
      </Section>
    </div>
  );
}
