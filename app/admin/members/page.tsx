"use client";

import * as React from "react";
import {
  BadgeCheck,
  CalendarX2,
  ChevronDown,
  DollarSign,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";

import { clubs } from "@/lib/data/placeholders";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                Types & config                              */
/* -------------------------------------------------------------------------- */

type Role = "admin" | "member";
type AccountStatus = "active" | "inactive";
type SubStatus = "active" | "expired" | "frozen" | "cancelled";
type Plan = "Standard" | "Premium" | "Elite";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus; // account: can the person sign in?
  plan: Plan | null; // members only
  subStatus: SubStatus | null; // members only
  club: string | null; // members only
  renewsAt: string | null; // ISO date, members only
  joinedAt: string; // ISO date
};

// Prices come from the FAQ in placeholders.ts (Standard $29, Premium $59, Elite $99)
const PLAN_PRICE: Record<Plan, number> = {
  Standard: 29,
  Premium: 59,
  Elite: 99,
};
const PLANS = Object.keys(PLAN_PRICE) as Plan[];
const SUB_STATUSES: SubStatus[] = ["active", "expired", "frozen", "cancelled"];
const CLUBS = clubs.map((c) => c.name);

// Pretend this is the signed-in admin (replace with your session user)
const CURRENT_USER_ID = "u-1";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const subStyles: Record<SubStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  expired: "bg-red-500/10 text-red-700 dark:text-red-400",
  frozen: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  cancelled: "bg-muted text-muted-foreground",
};

const planStyles: Record<Plan, string> = {
  Standard: "",
  Premium: "border-violet-500/40 text-violet-700 dark:text-violet-400",
  Elite: "border-amber-500/50 text-amber-700 dark:text-amber-400",
};

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

// ISO date (yyyy-mm-dd) relative to today
const d = (offsetDays: number) => {
  const x = new Date();
  x.setUTCDate(x.getUTCDate() + offsetDays);
  return x.toISOString().slice(0, 10);
};

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const renewalText = (u: User) => {
  if (!u.renewsAt || !u.subStatus) return "—";
  const date = fmt(u.renewsAt);
  switch (u.subStatus) {
    case "active":
      return `Renews ${date}`;
    case "expired":
      return `Expired ${date}`;
    case "cancelled":
      return `Ends ${date}`;
    case "frozen":
      return `Resumes ${date}`;
  }
};

/* -------------------------------------------------------------------------- */
/*                                 Sample data                                */
/* -------------------------------------------------------------------------- */

const admin = (
  id: string,
  name: string,
  status: AccountStatus,
  joined: number,
): User => ({
  id,
  name,
  email: `${name.toLowerCase().replace(" ", ".")}@forgefitness.com`,
  role: "admin",
  status,
  plan: null,
  subStatus: null,
  club: null,
  renewsAt: null,
  joinedAt: d(joined),
});

const member = (
  id: string,
  name: string,
  plan: Plan,
  subStatus: SubStatus,
  club: string,
  renews: number,
  joined: number,
  status: AccountStatus = "active",
): User => ({
  id,
  name,
  email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
  role: "member",
  status,
  plan,
  subStatus,
  club,
  renewsAt: d(renews),
  joinedAt: d(joined),
});

const initialUsers: User[] = [
  admin("u-1", "Alex Morgan", "active", -700),
  admin("u-2", "Priya Nair", "active", -520),
  admin("u-3", "Tom Becker", "inactive", -900), // previous admin
  admin("u-4", "Lena Fischer", "active", -140),
  member("m-1", "Jordan Lee", "Elite", "active", "Forge Downtown", 12, -420),
  member("m-2", "Sam Rivera", "Premium", "active", "Forge Midtown", 5, -210),
  member(
    "m-3",
    "Chloe Dubois",
    "Standard",
    "active",
    "Forge Westside",
    21,
    -95,
  ),
  member(
    "m-4",
    "Marcus Webb",
    "Standard",
    "expired",
    "Forge Brooklyn",
    -9,
    -300,
  ),
  member("m-5", "Hannah Kim", "Premium", "frozen", "Forge Uptown", 34, -150),
  member("m-6", "Diego Alvarez", "Elite", "active", "Forge Queens", 18, -60),
  member(
    "m-7",
    "Olivia Brooks",
    "Standard",
    "cancelled",
    "Forge Downtown",
    4,
    -380,
  ),
  member("m-8", "Noah Patel", "Premium", "active", "Forge Midtown", 27, -12),
  member(
    "m-9",
    "Isabella Rossi",
    "Standard",
    "active",
    "Forge Brooklyn",
    9,
    -8,
  ),
  member(
    "m-10",
    "Ethan Walker",
    "Premium",
    "expired",
    "Forge Westside",
    -21,
    -500,
  ),
  member("m-11", "Mia Johansson", "Elite", "active", "Forge Uptown", 15, -33),
  member("m-12", "Lucas Meyer", "Standard", "active", "Forge Queens", 2, -270),
  member(
    "m-13",
    "Ava Thompson",
    "Standard",
    "expired",
    "Forge Downtown",
    -60,
    -600,
    "inactive",
  ),
];

/* -------------------------------------------------------------------------- */
/*                                Small pieces                                */
/* -------------------------------------------------------------------------- */

type Option = { value: string; label: string };

function FilterSelect({
  value,
  onChange,
  options,
  allLabel,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  allLabel: string;
  className?: string;
}) {
  const items = [{ value: "All", label: allLabel }, ...options];
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v)} items={items}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((i) => (
          <SelectItem key={i.value} value={i.value}>
            {i.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: string;
  hint: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription>{title}</CardDescription>
        <Icon className="text-muted-foreground size-4" />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
        <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Add / Edit dialog                             */
/* -------------------------------------------------------------------------- */

type FormValues = {
  name: string;
  email: string;
  role: Role;
  plan: Plan;
  subStatus: SubStatus;
  club: string;
  renewsAt: string;
};

const toForm = (u: User | null): FormValues => ({
  name: u?.name ?? "",
  email: u?.email ?? "",
  role: u?.role ?? "member",
  plan: u?.plan ?? "Standard",
  subStatus: u?.subStatus ?? "active",
  club: u?.club ?? CLUBS[0],
  renewsAt: u?.renewsAt ?? d(30),
});

function UserFormDialog({
  open,
  onOpenChange,
  initial,
  users,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: User | null;
  users: User[];
  onSubmit: (values: FormValues) => void;
}) {
  const [form, setForm] = React.useState<FormValues>(toForm(null));
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setForm(toForm(initial));
      setTouched(false);
    }
  }, [open, initial]);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const email = form.email.trim().toLowerCase();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailTaken = users.some(
    (u) => u.email === email && u.id !== initial?.id,
  );
  const nameValid = form.name.trim() !== "";

  const emailError = !touched
    ? null
    : !emailValid
      ? "Enter a valid email address."
      : emailTaken
        ? "A user with this email already exists."
        : null;

  const isMember = form.role === "member";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit user" : "Add user"}</DialogTitle>
          <DialogDescription>
            {initial
              ? "Update this user's details. Use the row menu to change their role."
              : "Create a new member or admin account."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="user-form"
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (nameValid && emailValid && !emailTaken) onSubmit(form);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Jordan Lee"
              />
              {touched && !nameValid && (
                <p className="text-destructive text-sm">Name is required.</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="jordan@example.com"
              />
              {emailError && (
                <p className="text-destructive text-sm">{emailError}</p>
              )}
            </div>
          </div>

          {!initial && (
            <div className="grid gap-2">
              <Label>Role</Label>
              <FilterSelect
                value={form.role}
                onChange={(v) => set("role", v as Role)}
                allLabel=""
                options={[
                  { value: "member", label: "Member" },
                  { value: "admin", label: "Admin" },
                ]}
                className="w-full"
              />
            </div>
          )}

          {isMember && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Plan</Label>
                  <Select
                    value={form.plan}
                    onValueChange={(v) => v && set("plan", v as Plan)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLANS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p} · ${PLAN_PRICE[p]}/mo
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Subscription</Label>
                  <Select
                    value={form.subStatus}
                    onValueChange={(v) => v && set("subStatus", v as SubStatus)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUB_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {cap(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Home club</Label>
                  <Select
                    value={form.club}
                    onValueChange={(v) => v && set("club", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CLUBS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="renewsAt">Renewal / end date</Label>
                  <Input
                    id="renewsAt"
                    type="date"
                    value={form.renewsAt}
                    onChange={(e) => set("renewsAt", e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="user-form">
            {initial ? "Save changes" : "Add user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Main component                              */
/* -------------------------------------------------------------------------- */

type RoleTab = "all" | Role;
type PendingKind = "role" | "deactivate" | "delete";

export default function UsersAdmin() {
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [tab, setTab] = React.useState<RoleTab>("all");
  const [search, setSearch] = React.useState("");
  const [plan, setPlan] = React.useState("All");
  const [sub, setSub] = React.useState("All");
  const [status, setStatus] = React.useState("All");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<User | null>(null);
  const [pending, setPending] = React.useState<{
    kind: PendingKind;
    ids: string[];
  } | null>(null);

  /* --------------------------------- stats -------------------------------- */

  const stats = React.useMemo(() => {
    const members = users.filter((u) => u.role === "member");
    const admins = users.filter((u) => u.role === "admin");
    const activeSubs = members.filter((m) => m.subStatus === "active");
    const expired = members.filter((m) => m.subStatus === "expired");
    const in7 = d(7);
    const today = d(0);
    const endingSoon = members.filter(
      (m) =>
        m.subStatus === "cancelled" &&
        m.renewsAt &&
        m.renewsAt >= today &&
        m.renewsAt <= in7,
    );
    const mrr = activeSubs.reduce(
      (sum, m) => sum + (m.plan ? PLAN_PRICE[m.plan] : 0),
      0,
    );
    const byPlan = PLANS.map((p) => ({
      plan: p,
      count: activeSubs.filter((m) => m.plan === p).length,
    }));
    return {
      total: users.length,
      members: members.length,
      admins: admins.filter((a) => a.status === "active").length,
      inactive: users.filter((u) => u.status === "inactive").length,
      active: activeSubs.length,
      activePct: members.length
        ? Math.round((activeSubs.length / members.length) * 100)
        : 0,
      expired: expired.length,
      endingSoon: endingSoon.length,
      mrr,
      byPlan,
    };
  }, [users]);

  const roleCounts = {
    all: users.length,
    member: users.filter((u) => u.role === "member").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  /* -------------------------------- filtering ----------------------------- */

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (tab !== "all" && u.role !== tab) return false;
      if (
        q &&
        !u.name.toLowerCase().includes(q) &&
        !u.email.toLowerCase().includes(q)
      ) {
        return false;
      }
      // plan / subscription only exist on members
      if (plan !== "All" && !(u.role === "member" && u.plan === plan))
        return false;
      if (sub !== "All" && !(u.role === "member" && u.subStatus === sub))
        return false;
      if (status !== "All" && u.status !== status) return false;
      return true;
    });
  }, [users, tab, search, plan, sub, status]);

  const filtersActive =
    search !== "" || plan !== "All" || sub !== "All" || status !== "All";

  /* ------------------------------- selection ------------------------------ */

  const filteredIds = filtered.map((u) => u.id);
  const selectedInView = filteredIds.filter((id) => selected.has(id));
  const allSelected =
    filtered.length > 0 && selectedInView.length === filtered.length;
  const someSelected = selectedInView.length > 0 && !allSelected;

  const toggleAll = (checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      filteredIds.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });

  const toggleOne = (id: string, checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

  /* ------------------------------- safeguards ----------------------------- */

  const activeAdminCount = users.filter(
    (u) => u.role === "admin" && u.status === "active",
  ).length;

  // Why can't this user be demoted / deactivated / deleted? (null = they can)
  const protect = (u: User): string | null => {
    if (u.id === CURRENT_USER_ID)
      return "You can't demote, deactivate or delete your own account.";
    if (u.role === "admin" && u.status === "active" && activeAdminCount <= 1) {
      return "This is the only active admin.";
    }
    return null;
  };

  const bulkBlock = React.useMemo(() => {
    if (selected.size === 0) return null;
    if (selected.has(CURRENT_USER_ID)) return "Your own account is selected.";
    const remaining = users.filter(
      (u) => u.role === "admin" && u.status === "active" && !selected.has(u.id),
    ).length;
    const removingAdmin = users.some(
      (u) => selected.has(u.id) && u.role === "admin" && u.status === "active",
    );
    if (removingAdmin && remaining === 0)
      return "This would leave no active admins.";
    return null;
  }, [users, selected]);

  /* -------------------------------- actions ------------------------------- */

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setFormOpen(true);
  };

  const handleSubmit = (v: FormValues) => {
    const base = { name: v.name.trim(), email: v.email.trim().toLowerCase() };
    if (editing) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== editing.id) return u;
          return u.role === "member"
            ? {
                ...u,
                ...base,
                plan: v.plan,
                subStatus: v.subStatus,
                club: v.club,
                renewsAt: v.renewsAt || null,
              }
            : { ...u, ...base };
        }),
      );
    } else {
      const isMember = v.role === "member";
      setUsers((prev) => [
        {
          id: crypto.randomUUID(),
          ...base,
          role: v.role,
          status: "active",
          plan: isMember ? v.plan : null,
          subStatus: isMember ? v.subStatus : null,
          club: isMember ? v.club : null,
          renewsAt: isMember ? v.renewsAt || null : null,
          joinedAt: d(0),
        },
        ...prev,
      ]);
    }
    setFormOpen(false);
  };

  const reactivate = (id: string) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "active" } : u)),
    );

  const applyPending = () => {
    if (!pending) return;
    const ids = new Set(pending.ids);
    if (pending.kind === "role") {
      setUsers((prev) =>
        prev.map((u) =>
          ids.has(u.id)
            ? { ...u, role: u.role === "admin" ? "member" : "admin" }
            : u,
        ),
      );
    } else if (pending.kind === "deactivate") {
      setUsers((prev) =>
        prev.map((u) => (ids.has(u.id) ? { ...u, status: "inactive" } : u)),
      );
    } else {
      setUsers((prev) => prev.filter((u) => !ids.has(u.id)));
      setSelected((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }
    setPending(null);
  };

  /* ----------------------------- confirm dialog --------------------------- */

  const confirmCopy = (() => {
    if (!pending) return null;
    const targets = users.filter((u) => pending.ids.includes(u.id));
    const single = targets.length === 1 ? targets[0] : null;
    const many = `${targets.length} users`;

    if (pending.kind === "role" && single) {
      const toAdmin = single.role === "member";
      return {
        title: toAdmin
          ? `Make ${single.name} an admin?`
          : `Make ${single.name} a member?`,
        description: toAdmin
          ? "They'll get full access to the admin dashboard, including managing users, classes and trainers."
          : "They'll lose access to the admin dashboard right away and be treated as a regular member.",
        action: toAdmin ? "Make admin" : "Make member",
        destructive: false,
      };
    }
    if (pending.kind === "deactivate") {
      return {
        title: single ? `Deactivate ${single.name}?` : `Deactivate ${many}?`,
        description:
          "They won't be able to sign in. Their data and history are kept, and you can reactivate them at any time.",
        action: "Deactivate",
        destructive: false,
      };
    }
    return {
      title: single ? `Delete ${single.name}?` : `Delete ${many}?`,
      description:
        "This permanently removes the account and cannot be undone. If you only want to block access, deactivate instead.",
      action: "Delete",
      destructive: true,
    };
  })();

  /* --------------------------------- render ------------------------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm">
            Manage members, admins and their subscriptions.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="size-4" />
          Add user
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total users"
          value={stats.total.toLocaleString()}
          icon={Users}
          hint={`${stats.members} members · ${stats.admins} active admins`}
        />
        <StatCard
          title="Active subscriptions"
          value={String(stats.active)}
          icon={BadgeCheck}
          hint={
            <>
              {stats.activePct}% of members ·{" "}
              {stats.byPlan.map((p) => `${p.plan[0]} ${p.count}`).join(" / ")}
            </>
          }
        />
        <StatCard
          title="Expired subscriptions"
          value={String(stats.expired)}
          icon={CalendarX2}
          hint={`${stats.endingSoon} ending within 7 days`}
        />
        <StatCard
          title="Monthly revenue"
          value={money(stats.mrr)}
          icon={DollarSign}
          hint={`From ${stats.active} active plans`}
        />
      </div>

      {/* Role tabs + toolbar */}
      <div className="space-y-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as RoleTab)}>
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-1.5">
                {roleCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="member">
              Members
              <Badge variant="secondary" className="ml-1.5">
                {roleCounts.member}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="admin">
              Admins
              <Badge variant="secondary" className="ml-1.5">
                {roleCounts.admin}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-9"
            />
          </div>

          <FilterSelect
            value={plan}
            onChange={setPlan}
            allLabel="All plans"
            options={PLANS.map((p) => ({ value: p, label: p }))}
            className="w-full lg:w-36"
          />
          <FilterSelect
            value={sub}
            onChange={setSub}
            allLabel="All subscriptions"
            options={SUB_STATUSES.map((s) => ({ value: s, label: cap(s) }))}
            className="w-full lg:w-44"
          />
          <FilterSelect
            value={status}
            onChange={setStatus}
            allLabel="All accounts"
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Deactivated" },
            ]}
            className="w-full lg:w-36"
          />

          {filtersActive && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearch("");
                setPlan("All");
                setSub("All");
                setStatus("All");
              }}
            >
              <X className="size-4" />
              Reset
            </Button>
          )}

          {/* Bulk actions */}
          <div className="lg:ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" disabled={selected.size === 0} />
                }
              >
                Bulk actions
                {selected.size > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selected.size}
                  </Badge>
                )}
                <ChevronDown className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    {selected.size} selected
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setSelected(new Set())}>
                  <X className="size-4" />
                  Clear selection
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={bulkBlock !== null}
                  onClick={() =>
                    setPending({
                      kind: "deactivate",
                      ids: Array.from(selected),
                    })
                  }
                >
                  <UserX className="size-4" />
                  Deactivate selected
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={bulkBlock !== null}
                  onClick={() =>
                    setPending({ kind: "delete", ids: Array.from(selected) })
                  }
                >
                  <Trash2 className="size-4" />
                  Delete selected
                </DropdownMenuItem>
                {bulkBlock && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs font-normal whitespace-normal">
                        {bulkBlock}
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  aria-label="Select all"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={(v) => toggleAll(v === true)}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Home club</TableHead>
              <TableHead>Renewal</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="w-12 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-muted-foreground h-32 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => {
                const reason = protect(u);
                const inactive = u.status === "inactive";
                const isMember = u.role === "member";
                return (
                  <TableRow
                    key={u.id}
                    data-state={selected.has(u.id) ? "selected" : undefined}
                    className={cn(inactive && "bg-muted/30")}
                  >
                    <TableCell>
                      <Checkbox
                        aria-label={`Select ${u.name}`}
                        checked={selected.has(u.id)}
                        onCheckedChange={(v) => toggleOne(u.id, v === true)}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          className={cn("size-9", inactive && "opacity-60")}
                        >
                          <AvatarFallback className="text-xs">
                            {initials(u.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div
                            className={cn(
                              "flex items-center gap-1.5 font-medium whitespace-nowrap",
                              inactive && "text-muted-foreground",
                            )}
                          >
                            {u.name}
                            {u.id === CURRENT_USER_ID && (
                              <span className="text-muted-foreground text-xs font-normal">
                                (you)
                              </span>
                            )}
                          </div>
                          <div className="text-muted-foreground truncate text-xs">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {u.role === "admin" ? (
                        <Badge>
                          <ShieldCheck className="size-3" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline">Member</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {isMember && u.plan ? (
                        <Badge variant="outline" className={planStyles[u.plan]}>
                          {u.plan}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {isMember && u.subStatus ? (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "border-transparent",
                            subStyles[u.subStatus],
                          )}
                        >
                          {cap(u.subStatus)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {isMember && u.club ? (
                        u.club
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {isMember ? renewalText(u) : "—"}
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm whitespace-nowrap">
                        <span
                          className={cn(
                            "size-2 rounded-full",
                            inactive
                              ? "bg-muted-foreground/50"
                              : "bg-emerald-500",
                          )}
                        />
                        {inactive ? "Deactivated" : "Active"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            />
                          }
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">
                            Open menu for {u.name}
                          </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem onClick={() => openEdit(u)}>
                            <Pencil className="size-4" />
                            Edit details
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {u.role === "member" ? (
                            <DropdownMenuItem
                              onClick={() =>
                                setPending({ kind: "role", ids: [u.id] })
                              }
                            >
                              <ShieldCheck className="size-4" />
                              Make admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              disabled={reason !== null}
                              onClick={() =>
                                setPending({ kind: "role", ids: [u.id] })
                              }
                            >
                              <ShieldOff className="size-4" />
                              Make member
                            </DropdownMenuItem>
                          )}

                          {inactive ? (
                            <DropdownMenuItem onClick={() => reactivate(u.id)}>
                              <UserCheck className="size-4" />
                              Reactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              disabled={reason !== null}
                              onClick={() =>
                                setPending({ kind: "deactivate", ids: [u.id] })
                              }
                            >
                              <UserX className="size-4" />
                              Deactivate
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            variant="destructive"
                            disabled={reason !== null}
                            onClick={() =>
                              setPending({ kind: "delete", ids: [u.id] })
                            }
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>

                          {reason && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-xs font-normal whitespace-normal">
                                  {reason}
                                </DropdownMenuLabel>
                              </DropdownMenuGroup>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-muted-foreground text-sm">
        Showing {filtered.length} of {users.length} users
        {stats.inactive > 0 && ` · ${stats.inactive} deactivated`}
        {selected.size > 0 && ` · ${selected.size} selected`}
      </p>

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        users={users}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
      >
        <AlertDialogContent>
          {confirmCopy && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{confirmCopy.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmCopy.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant={confirmCopy.destructive ? "destructive" : "default"}
                  onClick={applyPending}
                >
                  {confirmCopy.action}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
