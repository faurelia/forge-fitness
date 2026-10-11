"use client";

import * as React from "react";
import {
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  classCategories,
  fitnessClasses,
  trainers,
} from "@/lib/data/placeholders";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type Instructor = { name: string; avatar?: string };

type ClassItem = {
  id: string;
  name: string;
  category: string;
  level: string;
  duration: string;
  location: string;
  description: string;
  img: string;
  instructors: Instructor[]; // one or many
};

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];
const LOCATIONS = ["Downtown", "Midtown", "Westside"];
const CATEGORIES = classCategories.filter((c) => c !== "All");

const levelStyles: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Intermediate: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
  "All Levels": "bg-sky-500/10 text-sky-700 dark:text-sky-400",
};

/* -------------------------------------------------------------------------- */
/*                         Seed data from placeholders.ts                     */
/* -------------------------------------------------------------------------- */

// Instructors available to assign (name + avatar from the trainers list)
const INSTRUCTOR_OPTIONS: Instructor[] = trainers.map((t) => ({
  name: t.name,
  avatar: t.img,
}));

const findInstructor = (name: string): Instructor =>
  INSTRUCTOR_OPTIONS.find((i) => i.name === name) ?? { name };

const initialClasses: ClassItem[] = fitnessClasses.map((c, i) => ({
  id: `class-${i + 1}`,
  name: c.name,
  category: c.category,
  level: c.level,
  duration: c.duration,
  location: c.location,
  description: c.description,
  img: c.img,
  // placeholder data has a single instructor string; the UI supports many
  instructors: [findInstructor(c.instructor)],
}));

/* -------------------------------------------------------------------------- */
/*                              Stacked avatars                               */
/* -------------------------------------------------------------------------- */

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function InstructorStack({
  instructors,
  max = 3,
}: {
  instructors: Instructor[];
  max?: number;
}) {
  if (instructors.length === 0) {
    return <span className="text-muted-foreground text-sm">Unassigned</span>;
  }

  const visible = instructors.slice(0, max);
  const extra = instructors.length - visible.length;
  const label =
    instructors.length === 1
      ? instructors[0].name
      : `${instructors[0].name} +${instructors.length - 1}`;

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {visible.map((p) => (
          <Avatar
            key={p.name}
            className="ring-background size-8 ring-2"
            title={p.name}
          >
            <AvatarImage src={p.avatar} alt={p.name} className="object-cover" />
            <AvatarFallback className="text-xs">
              {initials(p.name)}
            </AvatarFallback>
          </Avatar>
        ))}
        {extra > 0 && (
          <Avatar className="ring-background size-8 ring-2">
            <AvatarFallback className="bg-muted text-xs font-medium">
              +{extra}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <span className="text-sm whitespace-nowrap">{label}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Add / Edit dialog                             */
/* -------------------------------------------------------------------------- */

type FormValues = Omit<ClassItem, "id">;

const emptyForm: FormValues = {
  name: "",
  category: CATEGORIES[0],
  level: "All Levels",
  duration: "45 min",
  location: LOCATIONS[0],
  description: "",
  img: "",
  instructors: [],
};

function ClassFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ClassItem | null;
  onSubmit: (values: FormValues) => void;
}) {
  const [form, setForm] = React.useState<FormValues>(emptyForm);

  // reset the form whenever the dialog opens
  React.useEffect(() => {
    if (open) {
      const { id: _id, ...rest } =
        initial ?? ({ id: "", ...emptyForm } as ClassItem);
      setForm(rest);
    }
  }, [open, initial]);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleInstructor = (person: Instructor, checked: boolean) =>
    set(
      "instructors",
      checked
        ? [...form.instructors, person]
        : form.instructors.filter((i) => i.name !== person.name),
    );

  const canSave = form.name.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit class" : "Add class"}</DialogTitle>
          <DialogDescription>
            {initial
              ? "Update the details of this class."
              : "Create a new class for your schedule."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="class-form"
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSave) onSubmit({ ...form, name: form.name.trim() });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="HIIT Blast"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => set("category", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Level</Label>
              <Select value={form.level} onValueChange={(v) => set("level", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Location</Label>
              <Select
                value={form.location}
                onValueChange={(v) => set("location", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
                placeholder="45 min"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Instructors</Label>
            <DropdownMenu>
              <Button
                type="button"
                variant="outline"
                className="justify-between"
                render={<DropdownMenuTrigger />}
              >
                {form.instructors.length === 0
                  ? "Select instructors"
                  : form.instructors.map((i) => i.name).join(", ")}
                <ChevronDown className="size-4 opacity-50" />
              </Button>
              <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                {INSTRUCTOR_OPTIONS.map((p) => (
                  <DropdownMenuCheckboxItem
                    key={p.name}
                    checked={form.instructors.some((i) => i.name === p.name)}
                    onCheckedChange={(checked) =>
                      toggleInstructor(p, !!checked)
                    }
                    onSelect={(e) => e.preventDefault()} // keep menu open
                  >
                    {p.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="img">Image URL</Label>
            <Input
              id="img"
              value={form.img}
              onChange={(e) => set("img", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="class-form" disabled={!canSave}>
            {initial ? "Save changes" : "Add class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Main component                              */
/* -------------------------------------------------------------------------- */

export default function ClassesAdmin() {
  const [classes, setClasses] = React.useState<ClassItem[]>(initialClasses);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("All");
  const [level, setLevel] = React.useState("All");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ClassItem | null>(null);

  // ids pending deletion (single row or bulk); null = dialog closed
  const [pendingDelete, setPendingDelete] = React.useState<string[] | null>(
    null,
  );

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return classes.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.instructors.some((i) => i.name.toLowerCase().includes(q));
      const matchesCategory = category === "All" || c.category === category;
      const matchesLevel = level === "All" || c.level === level;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [classes, search, category, level]);

  const filtersActive = search !== "" || category !== "All" || level !== "All";

  /* ------------------------------- selection ------------------------------ */

  const filteredIds = filtered.map((c) => c.id);
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

  /* -------------------------------- actions ------------------------------- */

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (item: ClassItem) => {
    setEditing(item);
    setFormOpen(true);
  };

  const handleSubmit = (values: FormValues) => {
    if (editing) {
      setClasses((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, ...values } : c)),
      );
    } else {
      setClasses((prev) => [{ id: crypto.randomUUID(), ...values }, ...prev]);
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const ids = new Set(pendingDelete);
    setClasses((prev) => prev.filter((c) => !ids.has(c.id)));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setPendingDelete(null);
  };

  const pendingNames =
    pendingDelete?.length === 1
      ? classes.find((c) => c.id === pendingDelete[0])?.name
      : null;

  /* --------------------------------- render ------------------------------- */

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Classes</h1>
          <p className="text-muted-foreground text-sm">
            Manage your class catalog, instructors and locations.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="size-4" />
          Add class
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by class, instructor or location..."
            className="pl-9"
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All levels</SelectItem>
            {LEVELS.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filtersActive && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setCategory("All");
              setLevel("All");
            }}
          >
            <X className="size-4" />
            Reset
          </Button>
        )}

        {/* Bulk actions */}
        <div className="lg:ml-auto">
          <DropdownMenu>
            <Button
              variant="outline"
              disabled={selected.size === 0}
              render={<DropdownMenuTrigger />}
            >
              Bulk actions
              {selected.size > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selected.size}
                </Badge>
              )}
              <ChevronDown className="size-4" />
            </Button>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{selected.size} selected</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelected(new Set())}>
                <X className="size-4" />
                Clear selection
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setPendingDelete(Array.from(selected))}
              >
                <Trash2 className="size-4" />
                Delete selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  checked={
                    allSelected ? true : someSelected ? "indeterminate" : false
                  }
                  onCheckedChange={(v) => toggleAll(v === true)}
                />
              </TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-12 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground h-32 text-center"
                >
                  No classes found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow
                  key={c.id}
                  data-state={selected.has(c.id) ? "selected" : undefined}
                >
                  <TableCell>
                    <Checkbox
                      aria-label={`Select ${c.name}`}
                      checked={selected.has(c.id)}
                      onCheckedChange={(v) => toggleOne(c.id, v === true)}
                    />
                  </TableCell>

                  {/* image + name */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.img}
                        alt={c.name}
                        className="bg-muted h-10 w-14 shrink-0 rounded-md object-cover"
                      />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{c.name}</div>
                        <div className="text-muted-foreground text-xs">
                          {c.duration}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{c.category}</Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn("border-transparent", levelStyles[c.level])}
                    >
                      {c.level}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <InstructorStack instructors={c.instructors} />
                  </TableCell>

                  <TableCell>{c.location}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        render={<DropdownMenuTrigger />}
                      >
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open menu for {c.name}</span>
                      </Button>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(c)}>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setPendingDelete([c.id])}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-muted-foreground text-sm">
        Showing {filtered.length} of {classes.length} classes
        {selected.size > 0 && ` · ${selected.size} selected`}
      </p>

      {/* Add / edit dialog */}
      <ClassFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        onSubmit={handleSubmit}
      />

      {/* Delete confirmation (single + bulk) */}
      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingNames
                ? `Delete “${pendingNames}”?`
                : `Delete ${pendingDelete?.length ?? 0} classes?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The class
              {pendingDelete && pendingDelete.length > 1 ? "es" : ""} will be
              permanently removed from the schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
