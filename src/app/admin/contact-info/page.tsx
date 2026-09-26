"use client";

import { useEffect, useState } from "react";
import { Save, Phone, Mail, MapPin, MessageCircle } from "lucide-react";

interface SiteSettings {
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    location: string;
  };
  social: {
    linkedin: string;
    facebook: string;
    instagram: string;
  };
}

const defaults = {
  contact: { email: "", phone: "", whatsapp: "", location: "" },
  social: { linkedin: "", facebook: "", instagram: "" },
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

export default function ContactInfoPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((r) => r.json())
      .then((raw) => {
        setSettings(merge(defaults, raw as Record<string, unknown>));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setToast({ type: "success", message: "Contact information saved successfully." });
      } else {
        setToast({ type: "error", message: "Failed to save. Please try again." });
      }
    } catch {
      setToast({ type: "error", message: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-sand" />
        <div className="h-64 animate-pulse rounded-lg bg-sand" />
      </div>
    );
  }

  if (!settings) {
    return <p className="text-muted">Failed to load settings.</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-serif text-2xl font-semibold text-ink">Contact Information</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-charcoal disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-sand bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
            <Phone size={16} />
            Contact Details
          </h2>
          <div className="space-y-4">
            <Field
              label="Email"
              value={settings.contact.email}
              onChange={(v) => setSettings({ ...settings, contact: { ...settings.contact, email: v } })}
              placeholder="ulsani42@gmail.com"
            />
            <Field
              label="Phone"
              value={settings.contact.phone}
              onChange={(v) => setSettings({ ...settings, contact: { ...settings.contact, phone: v } })}
              placeholder="+880 1XXX XXX XXX"
            />
            <Field
              label="WhatsApp"
              value={settings.contact.whatsapp}
              onChange={(v) => setSettings({ ...settings, contact: { ...settings.contact, whatsapp: v } })}
              placeholder="+880 1XXX XXX XXX"
            />
            <Field
              label="Location"
              value={settings.contact.location}
              onChange={(v) => setSettings({ ...settings, contact: { ...settings.contact, location: v } })}
              placeholder="Bangladesh"
            />
          </div>
        </div>

        <div className="rounded-xl border border-sand bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
            <MessageCircle size={16} />
            Social Links
          </h2>
          <div className="space-y-4">
            <Field
              label="LinkedIn URL"
              value={settings.social.linkedin}
              onChange={(v) => setSettings({ ...settings, social: { ...settings.social, linkedin: v } })}
              placeholder="https://linkedin.com/in/your-profile"
            />
            <Field
              label="Facebook URL"
              value={settings.social.facebook}
              onChange={(v) => setSettings({ ...settings, social: { ...settings.social, facebook: v } })}
              placeholder="https://facebook.com/your-page"
            />
            <Field
              label="Instagram URL"
              value={settings.social.instagram}
              onChange={(v) => setSettings({ ...settings, social: { ...settings.social, instagram: v } })}
              placeholder="https://instagram.com/your-profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-charcoal">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-sand bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-stone focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}
