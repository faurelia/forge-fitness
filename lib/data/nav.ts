import {
  BuildingComplex,
  ChartNoAxesCombined,
  Dumbbell,
  Store,
  Users,
  UserStar,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export const navItems = [
  {
    title: "Overview",
    url: "/admin",
    icon: ChartNoAxesCombined,
    isActive: true,
    items: [
      {
        title: "Dashboard",
        url: "/admin",
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
      },
      {
        title: "Activity Log",
        url: "/admin/activity",
      },
    ],
  },
  {
    title: "Members",
    url: "/admin/members",
    icon: Users,
    isActive: true,
    items: [
      {
        title: "All Members",
        url: "/admin/members",
      },
      {
        title: "Memberships",
        url: "/admin/memberships",
      },
      {
        title: "Subscriptions",
        url: "/admin/subscriptions",
      },
    ],
  },
  {
    title: "Clubs",
    url: "/admin/clubs",
    icon: BuildingComplex,
    isActive: false,
    items: [
      {
        title: "All Clubs",
        url: "/admin/clubs",
      },
      {
        title: "Add New Club",
        url: "/admin/clubs/new",
      },
      {
        title: "Amenities",
        url: "/admin/amenities",
      },
    ],
  },
  {
    title: "Classes",
    url: "/admin/classes",
    icon: Dumbbell,
    isActive: false,
    items: [
      {
        title: "Class Library",
        url: "/admin/classes",
      },
      {
        title: "Schedule",
        url: "/admin/schedule",
      },
      {
        title: "Bookings",
        url: "/admin/bookings",
      },
      {
        title: "Categories",
        url: "/admin/classes/categories",
      },
    ],
  },
  {
    title: "Trainers",
    url: "/admin/trainers",
    icon: UserStar,
    isActive: false,
    items: [
      {
        title: "All Trainers",
        url: "/admin/trainers",
      },
      {
        title: "Availability",
        url: "/admin/trainers/availability",
      },
      {
        title: "Certifications",
        url: "/admin/trainers/certifications",
      },
      {
        title: "Performance",
        url: "/admin/trainers/performance",
      },
    ],
  },
  {
    title: "Shop",
    url: "/admin/products",
    icon: Store,
    isActive: false,
    items: [
      {
        title: "Products",
        url: "/admin/products",
      },
      {
        title: "Inventory",
        url: "/admin/inventory",
      },
      {
        title: "Orders",
        url: "/admin/orders",
      },
      {
        title: "Categories",
        url: "/admin/products/categories",
      },
    ],
  },
];

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: NavItem[];
};

export function findBreadcrumbs(
  items: NavItem[],
  pathname: string,
  parents: NavItem[] = [],
): NavItem[] | null {
  for (const item of items) {
    const trail = [...parents, item];

    if (item.url === pathname) {
      return trail;
    }

    if (item.items) {
      const result = findBreadcrumbs(item.items, pathname, trail);
      if (result) return result;
    }
  }

  return null;
}
