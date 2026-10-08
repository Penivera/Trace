import {
  FileImage,
  FolderKanban,
  GraduationCap,
  House,
  TextSearch,
  type LucideIcon,
} from "lucide-react";
import type { Route } from "next";

export type NavItem = { label: string; href: Route };
export type IconNavItem = NavItem & { icon: LucideIcon };

/** Signed-in game navigation (dashboard sidebar). */
export const dashboardNav: IconNavItem[] = [
  { label: "Home", href: "/dashboard" as Route, icon: House },
  { label: "Cases", href: "/cases" as Route, icon: FolderKanban },
  { label: "Investigation", href: "/investigation" as Route, icon: TextSearch },
  { label: "Evidence", href: "/evidence" as Route, icon: FileImage },
  { label: "Academy", href: "/academy" as Route, icon: GraduationCap },
];

// Routes are typed against the app/ directory once those pages exist;
// casts keep links to not-yet-built pages compiling in the meantime.
export const mainNav: NavItem[] = [
  { label: "Pick Character", href: "/characters" as Route },
  { label: "Investigation", href: "/investigation" as Route },
  { label: "Cases", href: "/cases" as Route },
];

export const authNav = {
  login: { label: "Login", href: "/login" as Route },
  signUp: { label: "Sign up", href: "/signup" as Route },
} satisfies Record<string, NavItem>;
