"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen, ChevronDown } from "lucide-react";
import AlertDialog from "@/components/ui/AlertDialog";
import type { ContactMessage } from "@/types";

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-sand" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-sand/50" />
      ))}
    </div>
  );
}

function formatDate(dateStr: string | Date) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessagesInbox() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [dialog, setDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  useEffect(() => {
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then(setMessages)
      .catch(() => setToast({ type: "error", message: "Unable to load messages." }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const toggleRead = async (msg: ContactMessage) => {
    const newReadState = !msg.read;
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch(`/api/admin/messages/${msg._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...msg, read: newReadState }),
      });
      if (!res.ok) throw new Error();
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, read: newReadState } : m))
      );
    } catch {
      setToast({ type: "error", message: "Unable to update message." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (expandedId === id) setExpandedId(null);
      setToast({ type: "success", message: "Message deleted" });
    } catch {
      setToast({ type: "error", message: "Unable to delete message." });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (msg: ContactMessage) => {
    if (expandedId === msg._id) {
      setExpandedId(null);
    } else {
      setExpandedId(msg._id!);
      if (!msg.read) toggleRead(msg);
    }
  };

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-6 pb-12">
      <AlertDialog
        open={dialog.open}
        title="Delete message"
        description="Are you sure you want to delete this message? This action cannot be undone."
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
          <h1 className="font-serif text-2xl font-semibold text-ink">Messages</h1>
          <p className="mt-1 text-sm text-muted">
            Contact form submissions
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-error px-1.5 text-xs font-medium text-white">
                {unreadCount}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-sand bg-white p-12 text-center text-muted">
            No messages yet.
          </div>
        ) : (
          messages.map((msg) => {
            const isExpanded = expandedId === msg._id;
            return (
              <div
                key={msg._id}
                className={`rounded-xl border bg-white transition-colors ${
                  msg.read ? "border-sand" : "border-accent/30"
                }`}
              >
                {/* Header row - always visible */}
                <div
                  className={`flex items-center justify-between p-4 cursor-pointer ${
                    isExpanded ? "border-b border-sand" : ""
                  }`}
                  onClick={() => handleToggle(msg)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        msg.read
                          ? "bg-sand/50 text-muted"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {msg.read ? <Mail size={18} /> : <MailOpen size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`truncate ${
                            msg.read ? "text-sm text-ink" : "text-sm font-semibold text-ink"
                          }`}
                        >
                          {msg.name}
                        </p>
                        {!msg.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                        )}
                      </div>
                      <p className="truncate text-sm text-muted">
                        {msg.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline whitespace-nowrap text-xs text-muted">
                      {formatDate(msg.createdAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRead(msg);
                      }}
                      disabled={saving}
                      className="rounded-lg p-1.5 text-muted transition-colors hover:bg-sand/50 disabled:opacity-50"
                      title={msg.read ? "Mark as unread" : "Mark as read"}
                    >
                      {msg.read ? <Mail size={14} /> : <MailOpen size={14} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDialog({ open: true, id: msg._id! });
                      }}
                      disabled={saving}
                      className="rounded-lg p-1.5 text-muted transition-colors hover:bg-error/10 hover:text-error disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ChevronDown
                      size={16}
                      className={`text-muted transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="p-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted mb-3">
                      <span className="font-medium text-ink">{msg.email}</span>
                      {msg.phone && <span>{msg.phone}</span>}
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                      {msg.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
