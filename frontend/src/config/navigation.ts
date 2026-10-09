import type { Route } from "next";
import type { ComponentType, SVGProps } from "react";

import {
  AcademyIcon,
  CasesIcon,
  EvidenceIcon,
  HomeIcon,
  InvestigationIcon,
} from "@/components/icons/nav-icons";

export type NavItem = { label: string; href: Route };
export type IconNavItem = NavItem & {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/** Signed-in game navigation (dashboard sidebar). Icons from Figma. */
export const dashboardNav: IconNavItem[] = [
  { label: "Home", href: "/dashboard" as Route, icon: HomeIcon },
  { label: "Cases", href: "/cases" as Route, icon: CasesIcon },
  { label: "Investigation", href: "/investigation" as Route, icon: InvestigationIcon },
  { label: "Evidence", href: "/evidence" as Route, icon: EvidenceIcon },
  { label: "Academy", href: "/academy" as Route, icon: AcademyIcon },
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
