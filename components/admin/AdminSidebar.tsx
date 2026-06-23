"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_SIDEBAR_MENU } from "@/types/admin.types";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LucideIcon,
  X,
  Store,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useEffect, useState } from "react";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
};

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Always expand when switching to mobile
      if (mobile) setCollapsed(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        // Sticky on desktop, fixed overlay on mobile
        "sticky top-0 h-dvh shrink-0",
        "flex flex-col border-r border-neutral-200 bg-white",
        "transition-all duration-300 ease-in-out",
        // Desktop width: collapsed vs expanded
        !isMobile && (collapsed ? "w-16" : "w-64"),
        // Mobile: fixed overlay driven by `open` prop
        isMobile && [
          "fixed top-0 left-0 z-50 w-[85vw] max-w-70",
          open ? "translate-x-0" : "-translate-x-full",
        ]
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center border-b border-neutral-200 py-5",
          collapsed && !isMobile ? "justify-center px-0" : "justify-between px-5"
        )}
      >
        {/* Logo — hidden when collapsed on desktop */}
        {(!collapsed || isMobile) && (
          <Link href="/" className="flex items-center gap-1 min-w-0">
            <p className="font-display text-xl tracking-[0.12em] truncate">
              DRIFTER PEAK
            </p>
          </Link>
        )}

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={onClose}
            className="opacity-50 hover:opacity-100 transition-opacity ml-auto"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        )}

        {/* Desktop collapse toggle */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "opacity-40 hover:opacity-100 transition-opacity",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
        {ADMIN_SIDEBAR_MENU.map((item) => {
          const Icon = ICONS[item.icon];

          const active =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => {
                if (isMobile) onClose();
              }}
              title={collapsed && !isMobile ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5",
                "font-mono text-[10px] tracking-[0.2em] transition-all",
                // When collapsed on desktop, center the icon
                collapsed && !isMobile && "justify-center px-0",
                active
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-100"
              )}
            >
              {Icon && <Icon size={13} className="shrink-0" />}

              {/* Label — hidden when collapsed on desktop */}
              {(!collapsed || isMobile) && (
                <span className="truncate">{item.name.toUpperCase()}</span>
              )}

              {/* Badge — hidden when collapsed */}
              {(!collapsed || isMobile) && item.badge !== undefined && (
                <span
                  className={cn(
                    "ml-auto rounded-full px-1.5 py-0.5 text-[9px] shrink-0",
                    active ? "bg-white text-black" : "bg-gray-200"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-200 px-2 py-4">
        <Link
          href="/"
          title={collapsed && !isMobile ? "View Store" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5",
            "font-mono text-[10px] tracking-[0.2em] text-black hover:bg-gray-100 transition-colors",
            collapsed && !isMobile && "justify-center px-0"
          )}
        >
          <Store size={13} className="shrink-0" />
          {(!collapsed || isMobile) && <span>VIEW STORE</span>}
        </Link>
      </div>
    </aside>
  );
}