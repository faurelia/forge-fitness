"use client";

import { ChevronRight } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { navItems } from "@/lib/data/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebarMenu() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((navItem) => (
        <Collapsible key={navItem.title} className="group/collapsible">
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<CollapsibleTrigger />}
              tooltip={navItem.title}
              isActive={navItem.url === pathname}
            >
              {navItem?.icon && <navItem.icon />}
              <span>{navItem.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
            </SidebarMenuButton>

            <CollapsibleContent>
              <SidebarMenuSub>
                {navItem.items.map((menu) => (
                  <SidebarMenuSubItem key={menu.title}>
                    <SidebarMenuButton
                      render={<Link href={menu.url} />}
                      isActive={menu.url === pathname}
                    >
                      {menu.title}
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ))}
    </SidebarMenu>
  );
}
