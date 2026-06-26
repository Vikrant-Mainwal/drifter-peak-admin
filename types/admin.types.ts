export interface SidebarItem {
  name: string;
  path: string;
  icon: string;         // lucide icon name as string
  badge?: number;       // optional notification count
}

// Change menu without touching Sidebar component
export const ADMIN_SIDEBAR_MENU: SidebarItem[] = [
  { name: "Dashboard",  path: "/",          icon: "LayoutDashboard" },
  { name: "Products",   path: "/products", icon: "Package" },
  { name: "Orders",     path: "/orders",   icon: "ShoppingBag" },
  { name: "Users",      path: "/all-users",    icon: "Users" },
];