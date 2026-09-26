"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, Trash2, Save, Loader2, ArrowUp, ArrowDown, X, ImagePlus } from "lucide-react";
import AlertDialog from "@/components/ui/AlertDialog";
import type { GalleryImage } from "@/types";

const inputClass =
  "w-full rounded-lg border border-sand bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/10";

const GALLERY_CATEGORIES = ["business", "portrait", "event", "travel", "personal"] as const;

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-xl bg-sand/50" />
        ))}
      </div>
    </div>
  );
}

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [dialog, setDialog] = useState<{ open: boolean; id: string | null; title: string; description: string }>({
    open: false,
    id: null,
    title: "",
    description: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setToast({ type: "error", message: "Unable to load gallery." }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const editingItem = items.find((i) => i._id === editingId);

  const updateEditing = (field: keyof GalleryImage, value: GalleryImage[keyof GalleryImage]) => {
    if (!editingId) return;
    setItems((prev) =>
      prev.map((item) => (item._id === editingId ? { ...item, [field]: value } : item))
    );
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setToast(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error();
      const uploadData = await uploadRes.json();

      const createRes = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: uploadData.url,
          publicId: uploadData.publicId,
          title: "",
          caption: "",
          altText: "",
          category: "business",
          order: items.length,
          published: false,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error();

      const now = new Date();
      setItems((prev) => [
        ...prev,
        {
          _id: createData._id,
          url: uploadData.url,
          publicId: uploadData.publicId,
          title: "",
          caption: "",
          altText: "",
          category: "business",
          order: items.length,
          published: false,
          createdAt: now,
          updatedAt: now,
        },
      ]);
      setEditingId(createData._id);
      setToast({ type: "success", message: "Image uploaded successfully" });
    } catch {
      setToast({ type: "error", message: "Unable to upload image." });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((item) => item._id !== id));
      if (editingId === id) setEditingId(null);
      setToast({ type: "success", message: "Image deleted" });
    } catch {
      setToast({ type: "error", message: "Unable to delete image." });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!editingId || !editingItem) return;
    if (editingItem.published && (!editingItem.title || !editingItem.caption)) {
      setToast({ type: "error", message: "Title and caption are required to publish." });
      return;
    }
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch(`/api/admin/gallery/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      if (!res.ok) throw new Error();
      setEditingId(null);
      setToast({ type: "success", message: "Changes saved successfully" });
    } catch {
      setToast({ type: "error", message: "Unable to save changes. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const updated = [...items];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    const reordered = updated.map((item, i) => ({ ...item, order: i }));
    setItems(reordered);
    fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reordered),
    }).catch(() => {});
  };

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-6 pb-12">
      <AlertDialog
        open={dialog.open}
        title={dialog.title}
        description={dialog.description}
        onConfirm={() => {
          if (dialog.id) handleDelete(dialog.id);
          setDialog({ open: false, id: null, title: "", description: "" });
        }}
        onCancel={() => setDialog({ open: false, id: null, title: "", description: "" })}
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
          <h1 className="font-serif text-2xl font-semibold text-ink">Gallery</h1>
          <p className="mt-1 text-sm text-muted">Manage gallery images</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg border border-sand bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-sand/30 disabled:opacity-50"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>

      {editingItem ? (
        <div className="space-y-6">
          <button
            onClick={() => setEditingId(null)}
            className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <X size={16} /> Back to gallery
          </button>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-sand bg-white p-4">
              <img
                src={editingItem.url}
                alt={editingItem.altText || "Gallery image"}
                className="w-full max-h-[360px] rounded-lg object-contain"
              />
            </div>

            <div className="space-y-6">
              <Section title="Image Details">
                <Field label="Title">
                  <input
                    value={editingItem.title}
                    onChange={(e) => updateEditing("title", e.target.value)}
                    className={inputClass}
                    placeholder="Image title"
                  />
                </Field>
                <Field label="Caption">
                  <textarea
                    value={editingItem.caption}
                    onChange={(e) => updateEditing("caption", e.target.value)}
                    rows={2}
                    className={inputClass}
                  />
                </Field>
                <Field label="Alt Text">
                  <input
                    value={editingItem.altText}
                    onChange={(e) => updateEditing("altText", e.target.value)}
                    className={inputClass}
                    placeholder="Describe the image"
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={editingItem.category}
                    onChange={(e) => updateEditing("category", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select category</option>
                    {GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </Field>
                <div>
                  <label className="flex items-center gap-2 text-sm text-charcoal">
                    <input
                      type="checkbox"
                      checked={editingItem.published}
                      onChange={(e) => updateEditing("published", e.target.checked)}
                      disabled={!editingItem.title || !editingItem.caption}
                      className="h-4 w-4 rounded border-sand text-accent focus:ring-accent/10 disabled:opacity-50"
                    />
                    Published
                  </label>
                  {(!editingItem.title || !editingItem.caption) && (
                    <p className="mt-1 text-xs text-muted">Add title and caption to enable publishing</p>
                  )}
                </div>
              </Section>

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
        </div>
      ) : (
        <>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sand bg-white p-16 text-center">
              <ImagePlus size={48} className="mb-4 text-sand" />
              <p className="text-muted">No images yet. Upload your first image to get started.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item, index) => (
                <div
                  key={item._id}
                  className="group relative overflow-hidden rounded-xl border border-sand bg-white transition-all hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.altText || item.title || "Gallery image"}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {item.title || "Untitled"}
                        </p>
                        {item.category && (
                          <p className="truncate text-xs text-muted">{item.category}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            item.published
                              ? "bg-success/10 text-success"
                              : "bg-sand/50 text-muted"
                          }`}
                        >
                          {item.published ? "Live" : "Draft"}
                        </span>
                        <button
                          onClick={() => moveItem(index, "up")}
                          disabled={index === 0}
                          className="rounded p-1 text-muted transition-colors hover:bg-sand/50 disabled:opacity-30"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => moveItem(index, "down")}
                          disabled={index === items.length - 1}
                          className="rounded p-1 text-muted transition-colors hover:bg-sand/50 disabled:opacity-30"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setEditingId(item._id!)}
                        className="flex-1 rounded-lg bg-sand/30 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-sand/50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDialog({
                            open: true,
                            id: item._id!,
                            title: "Delete image",
                            description:
                              "Are you sure you want to delete this image? This will also remove it from Cloudinary.",
                          })
                        }
                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-error/10 hover:text-error"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
