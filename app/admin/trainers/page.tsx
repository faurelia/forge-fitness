"use client";

import * as React from "react";
import {
  ChevronDown,
  Columns3,
  Eye,
  ImagePlus,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  specialties as specialtyFilters,
  trainerDetails,
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
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type Trainer = (typeof trainerDetails)[number];

type FormValues = {
  name: string;
  specialty: string;
  location: string;
  experience: string;
  bio: string;
  philosophy: string;
  img: string;
  certifications: string; // comma separated in the form
  specialties: string; // comma separated in the form
  availability: string; // comma separated in the form
};

const LOCATIONS = Array.from(new Set(trainerDetails.map((t) => t.location)));
const MAX_IMAGE_MB = 5;

/* -------------------------------------------------------------------------- */
/*                              Column visibility                             */
/* -------------------------------------------------------------------------- */

// "Trainer" is always visible; everything below can be toggled.
const COLUMNS = [
  { key: "specialty", label: "Specialty", defaultVisible: true },
  { key: "location", label: "Location", defaultVisible: true },
  { key: "rating", label: "Rating", defaultVisible: true },
  { key: "experience", label: "Experience", defaultVisible: true },
  { key: "certifications", label: "Certifications", defaultVisible: false },
  { key: "specialties", label: "Focus areas", defaultVisible: false },
  { key: "availability", label: "Availability", defaultVisible: false },
] as const;

type ColumnKey = (typeof COLUMNS)[number]["key"];

const defaultVisibility = Object.fromEntries(
  COLUMNS.map((c) => [c.key, c.defaultVisible]),
) as Record<ColumnKey, boolean>;

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const splitList = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const toForm = (t?: Trainer | null): FormValues => ({
  name: t?.name ?? "",
  specialty: t?.specialty ?? "",
  location: t?.location ?? LOCATIONS[0],
  experience: t?.experience ?? "",
  bio: t?.bio ?? "",
  philosophy: t?.philosophy ?? "",
  img: t?.img ?? "",
  certifications: t?.certifications.join(", ") ?? "",
  specialties: t?.specialties.join(", ") ?? "",
  availability: t?.availability.join(", ") ?? "",
});

function Rating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1 text-sm whitespace-nowrap">
      <Star className="size-4 fill-amber-400 text-amber-400" />
      <span className="font-medium">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground">({reviews})</span>
    </div>
  );
}

function BadgeList({ items, max = 2 }: { items: string[]; max?: number }) {
  const visible = items.slice(0, max);
  const extra = items.length - visible.length;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((i) => (
        <Badge key={i} variant="outline" className="whitespace-nowrap">
          {i}
        </Badge>
      ))}
      {extra > 0 && <Badge variant="secondary">+{extra}</Badge>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Image upload                                */
/* -------------------------------------------------------------------------- */

function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const createdUrl = React.useRef<string | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // free the temporary preview URL if the component unmounts
  React.useEffect(() => {
    return () => {
      if (createdUrl.current) URL.revokeObjectURL(createdUrl.current);
    };
  }, []);

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_IMAGE_MB}MB.`);
      return;
    }
    setError(null);
    if (createdUrl.current) URL.revokeObjectURL(createdUrl.current);
    // TODO: replace with a real upload (S3, Supabase, UploadThing...) and
    // store the returned URL instead of this temporary blob URL.
    const url = URL.createObjectURL(file);
    createdUrl.current = url;
    onChange(url);
  };

  return (
    <div className="grid gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = ""; // allow re-selecting the same file
        }}
      />

      {value ? (
        <div className="flex items-center gap-4 rounded-lg border p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Trainer preview"
            className="bg-muted size-20 rounded-lg object-cover"
          />
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="size-4" />
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange("");
                  setError(null);
                }}
              >
                <X className="size-4" />
                Remove
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              PNG, JPG or WebP, up to {MAX_IMAGE_MB}MB.
            </p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "text-muted-foreground hover:bg-muted/50 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-sm transition-colors",
            dragging && "border-primary bg-muted/50",
          )}
        >
          <ImagePlus className="size-8" />
          <span>
            <span className="text-foreground font-medium">Click to upload</span>{" "}
            or drag and drop
          </span>
          <span className="text-xs">
            PNG, JPG or WebP, up to {MAX_IMAGE_MB}MB
          </span>
        </button>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Add / Edit dialog                             */
/* -------------------------------------------------------------------------- */

function TrainerFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: Trainer | null;
  onSubmit: (values: FormValues) => void;
}) {
  const [form, setForm] = React.useState<FormValues>(toForm(null));

  React.useEffect(() => {
    if (open) setForm(toForm(initial));
  }, [open, initial]);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canSave = form.name.trim() !== "" && form.specialty.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit trainer" : "Add trainer"}</DialogTitle>
          <DialogDescription>
            {initial
              ? "Update this trainer's profile."
              : "Create a new trainer profile."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="trainer-form"
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSave) onSubmit(form);
          }}
        >
          <div className="grid gap-2">
            <Label>Photo</Label>
            <ImageUpload value={form.img} onChange={(url) => set("img", url)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Marcus Johnson"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                value={form.specialty}
                onChange={(e) => set("specialty", e.target.value)}
                placeholder="Strength & Conditioning"
              />
            </div>
            <div className="grid gap-2">
              <Label>Location</Label>
              <Select
                value={form.location}
                onValueChange={(v) => v && set("location", v)}
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
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={form.experience}
                onChange={(e) => set("experience", e.target.value)}
                placeholder="8 years"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={3}
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="philosophy">Philosophy</Label>
            <Textarea
              id="philosophy"
              rows={2}
              value={form.philosophy}
              onChange={(e) => set("philosophy", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="certifications">Certifications</Label>
              <Input
                id="certifications"
                value={form.certifications}
                onChange={(e) => set("certifications", e.target.value)}
                placeholder="NSCA-CSCS, ACE-CPT"
              />
              <p className="text-muted-foreground text-xs">
                Separate with commas.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specialties">Focus areas</Label>
              <Input
                id="specialties"
                value={form.specialties}
                onChange={(e) => set("specialties", e.target.value)}
                placeholder="Powerlifting, Mobility"
              />
              <p className="text-muted-foreground text-xs">
                Separate with commas.
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              value={form.availability}
              onChange={(e) => set("availability", e.target.value)}
              placeholder="Mon 6AM-12PM, Wed 3PM-8PM"
            />
            <p className="text-muted-foreground text-xs">
              Separate slots with commas.
            </p>
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
          <Button type="submit" form="trainer-form" disabled={!canSave}>
            {initial ? "Save changes" : "Add trainer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*                            View (all data) sheet                           */
/* -------------------------------------------------------------------------- */

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

function TrainerViewSheet({
  trainer,
  onOpenChange,
  onEdit,
}: {
  trainer: Trainer | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (t: Trainer) => void;
}) {
  return (
    <Sheet open={trainer !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {trainer && (
          <>
            <SheetHeader>
              <SheetTitle>{trainer.name}</SheetTitle>
              <SheetDescription>{trainer.specialty}</SheetDescription>
            </SheetHeader>

            <div className="grid gap-5 px-4 pb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trainer.img}
                alt={trainer.name}
                className="bg-muted aspect-[4/3] w-full rounded-lg object-cover"
              />

              <dl className="grid gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <Detail label="Location">{trainer.location}</Detail>
                  <Detail label="Experience">
                    {trainer.experience || "—"}
                  </Detail>
                  <Detail label="Rating">
                    <Rating rating={trainer.rating} reviews={trainer.reviews} />
                  </Detail>
                  <Detail label="ID">
                    <span className="font-mono text-xs">{trainer.id}</span>
                  </Detail>
                </div>

                <Separator />

                <Detail label="Bio">{trainer.bio || "—"}</Detail>
                <Detail label="Philosophy">
                  <span className="italic">{trainer.philosophy || "—"}</span>
                </Detail>

                <Separator />

                <Detail label="Certifications">
                  <BadgeList items={trainer.certifications} max={99} />
                </Detail>
                <Detail label="Focus areas">
                  <BadgeList items={trainer.specialties} max={99} />
                </Detail>
                <Detail label="Availability">
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {trainer.availability.map((slot) => (
                      <li key={slot}>{slot}</li>
                    ))}
                  </ul>
                </Detail>
              </dl>

              <Button variant="outline" onClick={() => onEdit(trainer)}>
                <Pencil className="size-4" />
                Edit trainer
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Main component                              */
/* -------------------------------------------------------------------------- */

export default function TrainersAdmin() {
  const [trainers, setTrainers] = React.useState<Trainer[]>(trainerDetails);
  const [search, setSearch] = React.useState("");
  const [specialty, setSpecialty] = React.useState("All");
  const [location, setLocation] = React.useState("All");
  const [visible, setVisible] = React.useState(defaultVisibility);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Trainer | null>(null);
  const [viewing, setViewing] = React.useState<Trainer | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<string[] | null>(
    null,
  );

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const s = specialty.toLowerCase();
    return trainers.filter((t) => {
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.specialty.toLowerCase().includes(q) ||
        t.certifications.some((c) => c.toLowerCase().includes(q));
      const matchesSpecialty =
        specialty === "All" ||
        t.specialty.toLowerCase().includes(s) ||
        t.specialties.some((x) => x.toLowerCase().includes(s));
      const matchesLocation = location === "All" || t.location === location;
      return matchesSearch && matchesSpecialty && matchesLocation;
    });
  }, [trainers, search, specialty, location]);

  const filtersActive =
    search !== "" || specialty !== "All" || location !== "All";
  const visibleCount = COLUMNS.filter((c) => visible[c.key]).length;
  const hiddenCount = COLUMNS.length - visibleCount;

  /* ------------------------------- selection ------------------------------ */

  const filteredIds = filtered.map((t) => t.id);
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

  const openEdit = (t: Trainer) => {
    setViewing(null);
    setEditing(t);
    setFormOpen(true);
  };

  const handleSubmit = (v: FormValues) => {
    const patch = {
      name: v.name.trim(),
      specialty: v.specialty.trim(),
      location: v.location,
      experience: v.experience.trim(),
      bio: v.bio.trim(),
      philosophy: v.philosophy.trim(),
      img: v.img,
      certifications: splitList(v.certifications),
      specialties: splitList(v.specialties),
      availability: splitList(v.availability),
    };

    if (editing) {
      setTrainers((prev) =>
        prev.map((t) => (t.id === editing.id ? { ...t, ...patch } : t)),
      );
    } else {
      setTrainers((prev) => [
        { id: crypto.randomUUID(), rating: 0, reviews: 0, ...patch },
        ...prev,
      ]);
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const ids = new Set(pendingDelete);
    setTrainers((prev) => prev.filter((t) => !ids.has(t.id)));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setPendingDelete(null);
  };

  const pendingName =
    pendingDelete?.length === 1
      ? trainers.find((t) => t.id === pendingDelete[0])?.name
      : null;

  /* --------------------------------- render ------------------------------- */

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trainers</h1>
          <p className="text-muted-foreground text-sm">
            Manage trainer profiles, specialties and availability.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="size-4" />
          Add trainer
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, specialty or certification..."
            className="pl-9"
          />
        </div>

        <Select
          value={specialty}
          onValueChange={(v) => v && setSpecialty(v)}
          items={specialtyFilters.map((s) => ({
            value: s,
            label: s === "All" ? "All specialties" : s,
          }))}
        >
          <SelectTrigger className="w-full lg:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {specialtyFilters.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "All" ? "All specialties" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={location}
          onValueChange={(v) => v && setLocation(v)}
          items={[
            { value: "All", label: "All locations" },
            ...LOCATIONS.map((l) => ({ value: l, label: l })),
          ]}
        >
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All locations</SelectItem>
            {LOCATIONS.map((l) => (
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
              setSpecialty("All");
              setLocation("All");
            }}
          >
            <X className="size-4" />
            Reset
          </Button>
        )}

        <div className="flex gap-2 lg:ml-auto">
          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              <Columns3 className="size-4" />
              Columns
              {hiddenCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {hiddenCount} hidden
                </Badge>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {COLUMNS.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.key}
                  checked={visible[c.key]}
                  closeOnClick={false} // keep the menu open while toggling
                  onCheckedChange={(checked) =>
                    setVisible((prev) => ({ ...prev, [c.key]: checked }))
                  }
                >
                  {c.label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                closeOnClick={false}
                onClick={() => setVisible(defaultVisibility)}
              >
                Reset to default
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bulk actions */}
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
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{selected.size} selected</DropdownMenuLabel>
              </DropdownMenuGroup>
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
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={(v) => toggleAll(v === true)}
                />
              </TableHead>
              <TableHead>Trainer</TableHead>
              {visible.specialty && <TableHead>Specialty</TableHead>}
              {visible.location && <TableHead>Location</TableHead>}
              {visible.rating && <TableHead>Rating</TableHead>}
              {visible.experience && <TableHead>Experience</TableHead>}
              {visible.certifications && <TableHead>Certifications</TableHead>}
              {visible.specialties && <TableHead>Focus areas</TableHead>}
              {visible.availability && <TableHead>Availability</TableHead>}
              <TableHead className="w-12 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3 + visibleCount}
                  className="text-muted-foreground h-32 text-center"
                >
                  No trainers found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((t) => (
                <TableRow
                  key={t.id}
                  data-state={selected.has(t.id) ? "selected" : undefined}
                >
                  <TableCell>
                    <Checkbox
                      aria-label={`Select ${t.name}`}
                      checked={selected.has(t.id)}
                      onCheckedChange={(v) => toggleOne(t.id, v === true)}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={t.img}
                          alt={t.name}
                          className="object-cover"
                        />
                        <AvatarFallback>{initials(t.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium whitespace-nowrap">
                        {t.name}
                      </span>
                    </div>
                  </TableCell>

                  {visible.specialty && (
                    <TableCell className="whitespace-nowrap">
                      {t.specialty}
                    </TableCell>
                  )}
                  {visible.location && <TableCell>{t.location}</TableCell>}
                  {visible.rating && (
                    <TableCell>
                      <Rating rating={t.rating} reviews={t.reviews} />
                    </TableCell>
                  )}
                  {visible.experience && (
                    <TableCell className="whitespace-nowrap">
                      {t.experience || "—"}
                    </TableCell>
                  )}
                  {visible.certifications && (
                    <TableCell>
                      <BadgeList items={t.certifications} />
                    </TableCell>
                  )}
                  {visible.specialties && (
                    <TableCell>
                      <BadgeList items={t.specialties} />
                    </TableCell>
                  )}
                  {visible.availability && (
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {t.availability.length} slots/week
                    </TableCell>
                  )}

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
                        <span className="sr-only">Open menu for {t.name}</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewing(t)}>
                          <Eye className="size-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(t)}>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setPendingDelete([t.id])}
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
        Showing {filtered.length} of {trainers.length} trainers
        {selected.size > 0 && ` · ${selected.size} selected`}
      </p>

      <TrainerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        onSubmit={handleSubmit}
      />

      <TrainerViewSheet
        trainer={viewing}
        onOpenChange={(open) => !open && setViewing(null)}
        onEdit={openEdit}
      />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingName
                ? `Delete ${pendingName}?`
                : `Delete ${pendingDelete?.length ?? 0} trainers?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The trainer
              {pendingDelete && pendingDelete.length > 1 ? "s" : ""} will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
