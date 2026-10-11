import { ChevronsUpDown, Dumbbell, LogOut, Settings, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { AppSidebarMenu } from "../sidebar/menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogoutMenu } from "../sidebar/logout-menu";
import { AccountMenu } from "../sidebar/account-menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/admin/dashboard" />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary  text-sidebar-primary-foreground">
                <Dumbbell className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="text-lg font-medium uppercase">
                  Forge Fitness
                </span>
                {/* <span className="text-sm text-muted-foreground">Admin</span> */}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <AppSidebarMenu />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <AccountMenu />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
