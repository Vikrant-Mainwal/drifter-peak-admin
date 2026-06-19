"use client";

import { useState } from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-white text-black">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-white md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onMenuClick={() =>
            setSidebarOpen((o) => !o)
          }
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}