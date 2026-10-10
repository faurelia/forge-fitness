import { SidebarTrigger } from "../ui/sidebar";
import { ModeToggle } from "../header/mode-toggle";
import { AppBreadcrumbs } from "../header/breadcrumbs";
import { Notifications } from "../header/notifications";

export function Header() {
  return (
    <header className="px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <AppBreadcrumbs />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Notifications />
        <ModeToggle />
      </div>
    </header>
  );
}
