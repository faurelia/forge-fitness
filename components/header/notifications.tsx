import {
  Bell,
  Dumbbell,
  ShoppingCart,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import Link from "next/link";

export function Notifications() {
  const notifs = [
    {
      icon: Dumbbell,
      title: "New class scheduled",
      description: "Morning Yoga is now available for booking.",
    },
    {
      icon: ShoppingCart,
      title: "New order received",
      description: "Order #1043 has been placed.",
    },
    {
      icon: CreditCard,
      title: "Subscription updated",
      description: "Premium membership was renewed for John Doe.",
    },
  ];

  return (
    <DropdownMenu>
      <Button variant="ghost" size="icon" render={<DropdownMenuTrigger />}>
        <Bell className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Notifications</span>
      </Button>

      <DropdownMenuContent className="w-86" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between gap-2 py-3">
            <span className="font-semibold text-base">Notifications</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs"
            >
              Mark all as read
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifs.map((notif) => (
            <DropdownMenuItem key={notif.title}>
              <Item className="p-2 w-full">
                <ItemMedia className="bg-accent p-2 rounded-md" variant="icon">
                  <notif.icon className="size-4 text-foreground" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{notif.title}</ItemTitle>
                  <ItemDescription className="text-xs">
                    {notif.description}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href="/admin/notifications" />}
          className="justify-center py-3 font-medium"
        >
          View All Notifications <ArrowRight className="ml-1 size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
