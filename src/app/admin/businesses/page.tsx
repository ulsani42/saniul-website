"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, ArrowUp, ArrowDown, ArrowLeft } from "lucide-react";
import AlertDialog from "@/components/ui/AlertDialog";
import type { Business } from "@/types";
import ImageUploader from "@/components/ui/ImageUploader";

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
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-sand/50" />
      ))}
    </div>
  );
}

export default function BusinessesManager() {
  const [items, setItems] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [dialog, setDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  useEffect(() => {
    fetch("/api/admin/businesses")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setToast({ type: "error", message: "Unable to load businesses." }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const editingItem = items.find((i) => i._id === editingId);

  const updateEditing = (field: keyof Business, value: Business[keyof Business]) => {
    if (!editingId) return;
    setItems((prev) =>
      prev.map((item) => (item._id === editingId ? { ...item, [field]: value } : item))
    );
  };

  const addResponsibility = () => {
    if (!editingId) return;
    setItems((prev) =>
      prev.map((item) =>
        item._id === editingId
          ? { ...item, responsibilities: [...item.responsibilities, ""] }
          : item
      )
    );
  };

  const removeResponsibility = (index: number) => {
    if (!editingId) return;
    setItems((prev) =>
      prev.map((item) =>
        item._id === editingId
          ? { ...item, responsibilities: item.responsibilities.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  const updateResponsibility = (index: number, value: string) => {
    if (!editingId) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item._id !== editingId) return item;
        const resp = [...item.responsibilities];
        resp[index] = value;
        return { ...item, responsibilities: resp };
      })
    );
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const updated = [...items];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    const reordered = updated.map((item, i) => ({ ...item, order: i }));
    setItems(reordered);
    fetch("/api/admin/businesses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reordered),
    }).catch(() => {});
  };

  const handleAdd = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "",
          role: "",
          industry: "",
          shortDescription: "",
          fullDescription: "",
          location: "",
          responsibilities: [],
          galleryImages: [],
          order: items.length,
          featured: false,
          published: false,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error();
      const now = new Date();
      setItems((prev) => [
        ...prev,
        {
          _id: json._id,
          name: "",
          role: "",
          industry: "",
          shortDescription: "",
          fullDescription: "",
          location: "",
          responsibilities: [],
          galleryImages: [],
          order: items.length,
          featured: false,
          published: false,
          createdAt: now,
          updatedAt: now,
        },
      ]);
      setEditingId(json._id);
    } catch {
      setToast({ type: "error", message: "Unable to add business." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch(`/api/admin/businesses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((item) => item._id !== id));
      if (editingId === id) setEditingId(null);
      setToast({ type: "success", message: "Business deleted" });
    } catch {
      setToast({ type: "error", message: "Unable to delete business." });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/businesses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
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

  return (
    <div className="space-y-6 pb-12">
      <AlertDialog
        open={dialog.open}
        title="Delete business"
        description="Are you sure you want to delete this business? This action cannot be undone."
        onConfirm={() => {
          if (dialog.id) handleDelete(dialog.id);
          setDialog({ open: false, id: null });
        }}
        onCancel={() => setDialog({ open: false, id: null })}
      />
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
          <h1 className="font-serif text-2xl font-semibold text-ink">Businesses</h1>
          <p className="mt-1 text-sm text-muted">Manage your businesses</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAdd}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-sand bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-sand/30 disabled:opacity-50"
          >
            <Plus size={16} /> Add Business
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {editingItem ? (
        <div className="space-y-6">
          <button
            onClick={() => setEditingId(null)}
            className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} /> Back to list
          </button>

          <Section title="Business Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input
                  value={editingItem.name}
                  onChange={(e) => updateEditing("name", e.target.value)}
                  className={inputClass}
                  placeholder="Business name"
                />
              </Field>
              <Field label="Role">
                <input
                  value={editingItem.role}
                  onChange={(e) => updateEditing("role", e.target.value)}
                  className={inputClass}
                  placeholder="Your role"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Industry">
                <input
                  value={editingItem.industry}
                  onChange={(e) => updateEditing("industry", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Technology, Healthcare"
                />
              </Field>
              <Field label="Location">
                <input
                  value={editingItem.location}
                  onChange={(e) => updateEditing("location", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Dubai, UAE"
                />
              </Field>
            </div>
            <Field label="Short Description">
              <textarea
                value={editingItem.shortDescription}
                onChange={(e) => updateEditing("shortDescription", e.target.value)}
                rows={2}
                className={inputClass}
              />
            </Field>
            <Field label="Full Description">
              <textarea
                value={editingItem.fullDescription}
                onChange={(e) => updateEditing("fullDescription", e.target.value)}
                rows={6}
                className={inputClass}
              />
            </Field>
          </Section>

          <Section title="Additional Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Established">
                <input
                  value={editingItem.established || ""}
                  onChange={(e) => updateEditing("established", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 2015"
                />
              </Field>
              <Field label="Website">
                <input
                  value={editingItem.website || ""}
                  onChange={(e) => updateEditing("website", e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone">
                <input
                  value={editingItem.phone || ""}
                  onChange={(e) => updateEditing("phone", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Email">
                <input
                  value={editingItem.email || ""}
                  onChange={(e) => updateEditing("email", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <ImageUploader
              value={editingItem.image || ""}
              onChange={(url) => updateEditing("image", url)}
              label="Business Image"
            />
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-charcoal">
                <input
                  type="checkbox"
                  checked={editingItem.featured}
                  onChange={(e) => updateEditing("featured", e.target.checked)}
                  className="h-4 w-4 rounded border-sand text-accent focus:ring-accent/10"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-charcoal">
                <input
                  type="checkbox"
                  checked={editingItem.published}
                  onChange={(e) => updateEditing("published", e.target.checked)}
                  className="h-4 w-4 rounded border-sand text-accent focus:ring-accent/10"
                />
                Published
              </label>
            </div>
          </Section>

          <Section title="Responsibilities">
            {editingItem.responsibilities.map((resp, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={resp}
                  onChange={(e) => updateResponsibility(i, e.target.value)}
                  className={inputClass}
                  placeholder="Responsibility"
                />
                <button
                  onClick={() => removeResponsibility(i)}
                  className="shrink-0 rounded-lg p-2 text-muted transition-colors hover:bg-error/10 hover:text-error"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addResponsibility}
              className="flex items-center gap-2 rounded-lg border border-dashed border-sand px-4 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Plus size={16} /> Add Responsibility
            </button>
          </Section>
        </div>
      ) : (
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="rounded-xl border border-sand bg-white p-12 text-center text-muted">
              No businesses yet. Click &quot;Add Business&quot; to get started.
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-sand bg-white p-4 transition-colors hover:border-sand/80 gap-3"
              >
                <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-ink">{item.name || "Untitled Business"}</p>
                    {item.featured && (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted">
                    {item.role} {item.industry && `\u00B7 ${item.industry}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.published
                        ? "bg-success/10 text-success"
                        : "bg-sand/50 text-muted"
                    }`}
                  >
                    {item.published ? "Published" : "Draft"}
                  </span>
                  <button
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-sand/50 disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveItem(index, "down")}
                    disabled={index === items.length - 1}
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-sand/50 disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => setEditingId(item._id!)}
                    className="rounded-lg bg-sand/30 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-sand/50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDialog({ open: true, id: item._id! })}
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-error/10 hover:text-error"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
