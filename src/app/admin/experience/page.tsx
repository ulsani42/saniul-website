"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, ArrowUp, ArrowDown, ArrowLeft } from "lucide-react";
import AlertDialog from "@/components/ui/AlertDialog";
import type { Experience } from "@/types";

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

export default function ExperienceManager() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [dialog, setDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  useEffect(() => {
    fetch("/api/admin/experience")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setToast({ type: "error", message: "Unable to load experiences." }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const editingItem = items.find((i) => i._id === editingId);

  const updateEditing = (field: keyof Experience, value: Experience[keyof Experience]) => {
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
    fetch("/api/admin/experience", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reordered),
    }).catch(() => {});
  };

  const handleAdd = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "",
          organization: "",
          period: "",
          current: false,
          type: "past",
          description: "",
          responsibilities: [],
          order: items.length,
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
          role: "",
          organization: "",
          period: "",
          current: false,
          type: "past",
          description: "",
          responsibilities: [],
          order: items.length,
          published: false,
          createdAt: now,
          updatedAt: now,
        },
      ]);
      setEditingId(json._id);
    } catch {
      setToast({ type: "error", message: "Unable to add experience." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((item) => item._id !== id));
      if (editingId === id) setEditingId(null);
      setToast({ type: "success", message: "Experience deleted" });
    } catch {
      setToast({ type: "error", message: "Unable to delete experience." });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/experience", {
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
        title="Delete experience"
        description="Are you sure you want to delete this experience? This action cannot be undone."
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
          <h1 className="font-serif text-2xl font-semibold text-ink">Experience</h1>
          <p className="mt-1 text-sm text-muted">Manage work experience entries</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAdd}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-sand bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-sand/30 disabled:opacity-50"
          >
            <Plus size={16} /> Add Experience
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

          <Section title="Edit Experience">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Role">
                <input
                  value={editingItem.role}
                  onChange={(e) => updateEditing("role", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Chief Executive Officer"
                />
              </Field>
              <Field label="Organization">
                <input
                  value={editingItem.organization}
                  onChange={(e) => updateEditing("organization", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Company Name"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Period">
                <input
                  value={editingItem.period}
                  onChange={(e) => updateEditing("period", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 2020 - Present"
                />
              </Field>
              <Field label="Start Date">
                <input
                  type="date"
                  value={editingItem.startDate || ""}
                  onChange={(e) => updateEditing("startDate", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="End Date">
                <input
                  type="date"
                  value={editingItem.endDate || ""}
                  onChange={(e) => updateEditing("endDate", e.target.value)}
                  className={inputClass}
                  disabled={editingItem.current}
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Type">
                <select
                  value={editingItem.type}
                  onChange={(e) => updateEditing("type", e.target.value)}
                  className={inputClass}
                >
                  <option value="current">Current</option>
                  <option value="past">Past</option>
                  <option value="entrepreneurial">Entrepreneurial</option>
                </select>
              </Field>
              <div className="flex flex-wrap items-end gap-4 sm:gap-6">
                <label className="flex items-center gap-2 text-sm text-charcoal">
                  <input
                    type="checkbox"
                    checked={editingItem.current}
                    onChange={(e) => updateEditing("current", e.target.checked)}
                    className="h-4 w-4 rounded border-sand text-accent focus:ring-accent/10"
                  />
                  Current position
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
            </div>
            <Field label="Description">
              <textarea
                value={editingItem.description}
                onChange={(e) => updateEditing("description", e.target.value)}
                rows={3}
                className={inputClass}
              />
            </Field>
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
              No experiences yet. Click &quot;Add Experience&quot; to get started.
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-sand bg-white p-4 transition-colors hover:border-sand/80 gap-3"
              >
                <div className="flex-1">
                  <p className="font-medium text-ink">{item.role || "Untitled Role"}</p>
                  <p className="text-sm text-muted">{item.organization}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
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
