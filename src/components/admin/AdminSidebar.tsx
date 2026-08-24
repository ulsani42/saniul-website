"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  User,
  Briefcase,
  Building2,
  Images,
  FileText,
  Settings,
  Phone,
  Search,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const contentLinks: NavItem[] = [
  { label: "Homepage", href: "/admin/homepage", icon: <Home size={18} /> },
  { label: "About", href: "/admin/about", icon: <User size={18} /> },
  { label: "Experience", href: "/admin/experience", icon: <Briefcase size={18} /> },
  { label: "Businesses", href: "/admin/businesses", icon: <Building2 size={18} /> },
  { label: "Gallery", href: "/admin/gallery", icon: <Images size={18} /> },
  { label: "Blog", href: "/admin/blog", icon: <FileText size={18} /> },
];

const settingsLinks: NavItem[] = [
  { label: "Site Settings", href: "/admin/settings", icon: <Settings size={18} /> },
  { label: "SEO", href: "/admin/seo", icon: <Search size={18} /> },
  { label: "Contact Info", href: "/admin/contact-info", icon: <Phone size={18} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const sidebarContent = (
    <div className="flex h-full flex-col bg-ink">
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Link href="/admin" className="flex items-center gap-2">
          <img
            src="/images/navbar.png"
            alt="Sani Ul"
            className="h-8 w-auto"
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <Link
          href="/admin"
          className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname === "/admin"
              ? "bg-white/10 text-white"
              : "text-white/60 hover:bg-white/5 hover:text-white/80"
          }`}
          onClick={() => setMobileOpen(false)}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <div className="mt-4">
          <button
            onClick={() => setContentOpen(!contentOpen)}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/40"
          >
            Content
            <ChevronRight
              size={14}
              className={`transition-transform ${contentOpen ? "rotate-90" : ""}`}
            />
          </button>
          {contentOpen && (
            <div className="mt-1 space-y-0.5">
              {contentLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive(link.href)
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white/80"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/40"
          >
            Settings
            <ChevronRight
              size={14}
              className={`transition-transform ${settingsOpen ? "rotate-90" : ""}`}
            />
          </button>
          {settingsOpen && (
            <div className="mt-1 space-y-0.5">
              {settingsLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive(link.href)
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white/80"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/40">
            Messages
          </p>
          <Link
            href="/admin/messages"
            className={`mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive("/admin/messages")
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white/80"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            <MessageSquare size={18} />
            Messages
          </Link>
        </div>
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={async () => {
            await fetch("/api/admin/auth/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white/80"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white shadow-lg lg:hidden"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md text-white/60 hover:text-white lg:hidden"
        >
          <X size={18} />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
