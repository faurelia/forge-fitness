"use client";

import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LogoutMenu() {
  const router = useRouter();
  return (
    <DropdownMenuItem
      variant="destructive"
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => router.push("/sign-in"),
          },
        })
      }
    >
      <LogOut /> Logout
    </DropdownMenuItem>
  );
}
