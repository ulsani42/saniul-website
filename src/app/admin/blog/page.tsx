"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, ArrowLeft } from "lucide-react";
import AlertDialog from "@/components/ui/AlertDialog";
import type { BlogPost } from "@/types";
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
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-sand/50" />
      ))}
    </div>
  );
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [dialog, setDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then(setPosts)
      .catch(() => setToast({ type: "error", message: "Unable to load posts." }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const editingPost = posts.find((p) => p._id === editingId);

  const canSave = editingPost
    ? editingPost.title.trim() !== "" &&
      editingPost.category.trim() !== "" &&
      editingPost.excerpt.trim() !== "" &&
      editingPost.content.trim() !== "" &&
      editingPost.tags.length > 0
    : false;

  const updateEditing = (field: keyof BlogPost, value: BlogPost[keyof BlogPost]) => {
    if (!editingId) return;
    setPosts((prev) =>
      prev.map((p) => (p._id === editingId ? { ...p, [field]: value } : p))
    );
  };

  const handleAdd = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          featuredImage: "",
          author: "Sani Ul",
          category: "",
          tags: [],
          published: false,
          seo: { title: "", description: "" },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error();
      const now = new Date();
      setPosts((prev) => [
        {
          _id: json._id,
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          featuredImage: "",
          author: "Sani Ul",
          category: "",
          tags: [],
          published: false,
          seo: { title: "", description: "" },
          createdAt: now,
          updatedAt: now,
        },
        ...prev,
      ]);
      setEditingId(json._id);
    } catch {
      setToast({ type: "error", message: "Unable to create post." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.filter((p) => p._id !== id));
      if (editingId === id) setEditingId(null);
      setToast({ type: "success", message: "Post deleted" });
    } catch {
      setToast({ type: "error", message: "Unable to delete post." });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (publishState?: boolean) => {
    if (!editingId || !editingPost) return;
    if (!editingPost.title.trim()) {
      setToast({ type: "error", message: "Title is required." });
      return;
    }
    if (!editingPost.category.trim()) {
      setToast({ type: "error", message: "Category is required." });
      return;
    }
    if (!editingPost.excerpt.trim()) {
      setToast({ type: "error", message: "Excerpt is required." });
      return;
    }
    if (!editingPost.content.trim()) {
      setToast({ type: "error", message: "Content is required." });
      return;
    }
    if (editingPost.tags.length === 0) {
      setToast({ type: "error", message: "At least one tag is required." });
      return;
    }
    setSaving(true);
    setToast(null);
    try {
      const body = { ...editingPost };
      body.slug = generateSlug(editingPost.title);
      if (publishState !== undefined) {
        body.published = publishState;
        if (publishState && !editingPost.published) {
          body.publishedAt = new Date();
        }
      }
      const res = await fetch(`/api/admin/blog/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setPosts((prev) =>
        prev.map((p) => (p._id === editingId ? { ...body, _id: editingId } : p))
      );
      setEditingId(null);
      setToast({ type: "success", message: "Changes saved successfully" });
    } catch {
      setToast({ type: "error", message: "Unable to save changes. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const formatCategoryDate = (post: BlogPost) => {
    const parts: string[] = [];
    if (post.category) parts.push(post.category);
    parts.push(
      new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
    return parts.join(" - ");
  };

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-6 pb-12">
      <AlertDialog
        open={dialog.open}
        title="Delete post"
        description="Are you sure you want to delete this post? This action cannot be undone."
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
          <h1 className="font-serif text-2xl font-semibold text-ink">Blog</h1>
          <p className="mt-1 text-sm text-muted">Manage blog posts</p>
        </div>
        <button
          onClick={handleAdd}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      {editingPost ? (
        <div className="space-y-6">
          <button
            onClick={() => setEditingId(null)}
            className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} /> Back to posts
          </button>

          <Section title="Post Content">
            <Field label="Title">
              <input
                value={editingPost.title}
                onChange={(e) => updateEditing("title", e.target.value)}
                className={inputClass}
                placeholder="Post title"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <input
                  value={editingPost.category}
                  onChange={(e) => updateEditing("category", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Business, Leadership"
                />
              </Field>
              <Field label="URL Slug (auto-generated)">
                <input
                  value={generateSlug(editingPost.title)}
                  readOnly
                  className={inputClass + " bg-sand/20 text-muted cursor-not-allowed"}
                />
              </Field>
            </div>
            <Field label="Excerpt">
              <textarea
                value={editingPost.excerpt}
                onChange={(e) => updateEditing("excerpt", e.target.value)}
                rows={2}
                className={inputClass}
                placeholder="Brief summary of the post"
              />
            </Field>
            <Field label="Content">
              <textarea
                value={editingPost.content}
                onChange={(e) => updateEditing("content", e.target.value)}
                rows={14}
                className={inputClass + " font-mono text-xs leading-relaxed"}
                placeholder="Write your post content here..."
              />
            </Field>
            <ImageUploader
              value={editingPost.featuredImage || ""}
              onChange={(url) => updateEditing("featuredImage", url)}
              label="Featured Image"
            />
            <Field label="Tags (comma-separated)">
              <input
                value={editingPost.tags.join(", ")}
                onChange={(e) =>
                  updateEditing(
                    "tags",
                    e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                  )
                }
                className={inputClass}
                placeholder="leadership, business, growth"
              />
            </Field>
          </Section>

          <Section title="Search Engine Optimization">
            <Field label="SEO Title">
              <input
                value={editingPost.seo.title}
                onChange={(e) =>
                  updateEditing("seo", { ...editingPost.seo, title: e.target.value })
                }
                className={inputClass}
                placeholder="Title for search engines"
              />
            </Field>
            <Field label="SEO Description">
              <textarea
                value={editingPost.seo.description}
                onChange={(e) =>
                  updateEditing("seo", { ...editingPost.seo, description: e.target.value })
                }
                rows={2}
                className={inputClass}
                placeholder="Description for search engines"
              />
            </Field>
          </Section>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                checked={editingPost.published}
                onChange={(e) => updateEditing("published", e.target.checked)}
                disabled={!canSave}
                className="h-4 w-4 rounded border-sand text-accent focus:ring-accent/10 disabled:opacity-50"
              />
              Published
            </label>
            {!canSave && (
              <p className="text-xs text-muted">Fill in all required fields (title, category, excerpt, content, tags) to enable publishing</p>
            )}
            <div className="sm:ml-auto flex flex-wrap gap-3">
              <button
                onClick={() => handleSave(false)}
                disabled={saving || !canSave}
                className="flex items-center gap-2 rounded-lg border border-sand bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-sand/30 disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Draft
              </button>
              {editingPost.published ? (
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving || !canSave}
                  className="flex items-center gap-2 rounded-lg border border-sand bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-sand/30 disabled:opacity-50"
                >
                  Unpublish
                </button>
              ) : (
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving || !canSave}
                  className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
                >
                  Publish
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="rounded-xl border border-sand bg-white p-12 text-center text-muted">
              No posts yet. Click &quot;New Post&quot; to get started.
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="flex items-center justify-between rounded-xl border border-sand bg-white p-4 transition-colors hover:border-sand/80"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{post.title}</p>
                  <p className="text-sm text-muted">{formatCategoryDate(post)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.published
                        ? "bg-success/10 text-success"
                        : "bg-sand/50 text-muted"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <button
                    onClick={() => setEditingId(post._id!)}
                    className="rounded-lg bg-sand/30 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-sand/50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDialog({ open: true, id: post._id! })}
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
