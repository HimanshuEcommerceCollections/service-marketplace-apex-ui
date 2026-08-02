import type { Role } from "./auth-context";

export interface NavItem {
  href: string;
  label: string;
  roles: Role[];
}

/** Sidebar items, gated by role (mirrors the server capability map for nav). */
export const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", roles: ["COORDINATOR", "ADMIN"] },
  { href: "/admin/bookings", label: "Bookings", roles: ["COORDINATOR", "ADMIN"] },
  { href: "/admin/quotes", label: "Quotes", roles: ["COORDINATOR", "ADMIN"] },
  { href: "/admin/pm-requests", label: "Property managers", roles: ["COORDINATOR", "ADMIN"] },
  { href: "/admin/pro-applications", label: "Pro applications", roles: ["COORDINATOR", "ADMIN"] },
  { href: "/admin/services", label: "Catalog & pricing", roles: ["COORDINATOR", "ADMIN"] },
  { href: "/admin/catalog", label: "Edit pricing", roles: ["ADMIN"] },
  { href: "/admin/membership-plans", label: "Membership plans", roles: ["ADMIN"] },
  { href: "/admin/recurring-plans", label: "Recurring plans", roles: ["ADMIN"] },
  { href: "/admin/areas", label: "Areas", roles: ["COORDINATOR", "ADMIN"] },
  { href: "/admin/zip-codes", label: "ZIP codes", roles: ["COORDINATOR", "ADMIN"] },
  { href: "/admin/coverage", label: "Service coverage", roles: ["COORDINATOR", "ADMIN"] },
  { href: "/admin/staff", label: "Staff", roles: ["ADMIN"] },
];

export const STAFF_ROLES: Role[] = ["COORDINATOR", "ADMIN"];
