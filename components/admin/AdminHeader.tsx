"use client";

import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { ADMIN_SIDEBAR_MENU } from "../../types/admin.types";
import Link from "next/link";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();

  const current = ADMIN_SIDEBAR_MENU.find((item) =>
    item.path === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.path),
  );

  const pageTitle = current?.name ?? "Dashboard";

  const handleLogout = () => {
    console.log("Logout later");
  };

  return (
    <header className="flex shrink-0 items-center justify-between border-neutral-200 border-b bg-white px-6 py-4 sticky top-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="text-black opacity-60 transition-opacity hover:opacity-100 md:hidden"
        >
          <Menu size={18} />
        </button>

        <h4 className="font-display text-2xl uppercase tracking-wide text-black md:text-3xl">
          {pageTitle}
        </h4>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* User info */}
        <div className="hidden text-right md:block">
          <p className="font-mono text-[9px] tracking-[0.2em] text-gray-500">
            ADMIN
          </p>

          <p className="font-mono text-[10px] text-black">Admin</p>
        </div>

        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-gray-100 font-mono text-xs text-black">
          <Link href="/profile">A</Link>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-black opacity-50 transition-opacity hover:opacity-100"
        >
          <LogOut size={13} />

          <span className="hidden md:inline">LOGOUT</span>
        </button>
      </div>
    </header>
  );
}
