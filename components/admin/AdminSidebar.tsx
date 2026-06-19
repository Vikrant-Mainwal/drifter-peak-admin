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
} from "lucide-react";

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

  return (
    <aside
      className={cn(
        // Base
        "fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r bg-white transition-transform duration-300",

        // Mobile
        open ? "translate-x-0" : "-translate-x-full",

        // Desktop
        "md:static md:translate-x-0 md:z-auto"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-5">
        <Link href="/" className="flex items-center gap-1">
          <p className="font-display text-xl tracking-[0.12em]">
            DRIFTER<span>.</span>PEAK
          </p>
        </Link>

        <button
          onClick={onClose}
          className="md:hidden opacity-50 hover:opacity-100"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
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
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 font-mono text-[10px] tracking-[0.2em] transition-all",

                active
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-100"
              )}
            >
              {Icon && <Icon size={13} />}

              {item.name.toUpperCase()}

              {item.badge !== undefined && (
                <span
                  className={cn(
                    "ml-auto rounded-full px-1.5 py-0.5 text-[9px]",
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
      <div className="border-t px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 font-mono text-[10px] tracking-[0.2em] text-black hover:opacity-70"
        >
          <Store size={13} />
          VIEW STORE
        </Link>
      </div>
    </aside>
  );
}