"use client";

import * as React from "react";
import {
  Check,
  Clock,
  Copy,
  Eraser,
  MoreHorizontal,
  Pencil,
  Plus,
  Save,
  Trash2,
  Undo2,
  X,
} from "lucide-react";

import { fitnessClasses, schedule } from "@/lib/data/placeholders";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
/*                                Types & config                              */
/* -------------------------------------------------------------------------- */

const DAYS = [
  { key: "mon", label: "Mon", full: "Monday" },
  { key: "tue", label: "Tue", full: "Tuesday" },
  { key: "wed", label: "Wed", full: "Wednesday" },
  { key: "thu", label: "Thu", full: "Thursday" },
  { key: "fri", label: "Fri", full: "Friday" },
  { key: "sat", label: "Sat", full: "Saturday" },
  { key: "sun", label: "Sun", full: "Sunday" },
] as const;

type DayKey = (typeof DAYS)[number]["key"];

// One row of the weekly timetable. Cells hold a class name (or null = empty).
type Slot = {
  id: string;
  time: string; // 24h "HH:mm" so rows sort naturally
  cells: Record<DayKey, string | null>;
};

type FitnessClass = (typeof fitnessClasses)[number];

const CLASS_BY_NAME = new Map<string, FitnessClass>(
  fitnessClasses.map((c) => [c.name, c]),
);
const LOCATIONS = Array.from(new Set(fitnessClasses.map((c) => c.location)));

const CATEGORY_STYLES: Record<string, { chip: string; dot: string }> = {
  HIIT: {
    chip: "border-violet-500/30 bg-violet-500/10 text-violet-900 dark:text-violet-200",
    dot: "bg-violet-500",
  },
  Yoga: {
    chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200",
    dot: "bg-emerald-500",
  },
  Strength: {
    chip: "border-red-500/30 bg-red-500/10 text-red-900 dark:text-red-200",
    dot: "bg-red-500",
  },
  Dance: {
    chip: "border-pink-500/30 bg-pink-500/10 text-pink-900 dark:text-pink-200",
    dot: "bg-pink-500",
  },
  Cardio: {
    chip: "border-sky-500/30 bg-sky-500/10 text-sky-900 dark:text-sky-200",
    dot: "bg-sky-500",
  },
  Core: {
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
    dot: "bg-amber-500",
  },
};
const FALLBACK_STYLE = {
  chip: "border-border bg-muted",
  dot: "bg-muted-foreground",
};
const styleFor = (category: string) =>
  CATEGORY_STYLES[category] ?? FALLBACK_STYLE;

/* -------------------------------------------------------------------------- */
/*                                Time helpers                                */
/* -------------------------------------------------------------------------- */

// "6:00 AM" -> "06:00"
const to24 = (t: string) => {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(t.trim());
  if (!m) return t;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
};

// "17:30" -> "5:30 PM"
const fmt12 = (t: string) => {
  const [H, M] = t.split(":").map(Number);
  const h = H % 12 || 12;
  return `${h}:${String(M).padStart(2, "0")} ${H >= 12 ? "PM" : "AM"}`;
};

const sortSlots = (slots: Slot[]) =>
  [...slots].sort((a, b) => a.time.localeCompare(b.time));

const emptyCells = (): Record<DayKey, string | null> => ({
  mon: null,
  tue: null,
  wed: null,
  thu: null,
  fri: null,
  sat: null,
  sun: null,
});

/* -------------------------------------------------------------------------- */
/*                         Seed data from placeholders.ts                     */
/* -------------------------------------------------------------------------- */

const initialSlots: Slot[] = sortSlots(
  schedule.map((row, i) => ({
    id: `slot-${i + 1}`,
    time: to24(row.time),
    cells: Object.fromEntries(
      DAYS.map((d) => [d.key, row[d.key] === "—" ? null : row[d.key]]),
    ) as Record<DayKey, string | null>,
  })),
);

/* -------------------------------------------------------------------------- */
/*                            Single timetable cell                           */
/* -------------------------------------------------------------------------- */

function SlotCell({
  dayFull,
  time,
  value,
  dimmed,
  open,
  onOpenChange,
  onPick,
}: {
  dayFull: string;
  time: string;
  value: string | null;
  dimmed: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPick: (className: string | null) => void;
}) {
  const current = value ? CLASS_BY_NAME.get(value) : undefined;
  const style = current ? styleFor(current.category) : null;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label={
              value
                ? `${dayFull} ${fmt12(time)}: ${value}. Click to change.`
                : `${dayFull} ${fmt12(time)}: empty. Click to add a class.`
            }
            className={cn(
              "group focus-visible:ring-ring flex h-full min-h-16 w-full flex-col justify-center rounded-md border p-2 text-left text-xs transition outline-none focus-visible:ring-2",
              value
                ? cn(
                    "hover:brightness-95 dark:hover:brightness-110",
                    style?.chip ?? FALLBACK_STYLE.chip,
                  )
                : "text-muted-foreground hover:bg-muted/60 border-dashed",
              dimmed && "opacity-30",
            )}
          />
        }
      >
        {current ? (
          <>
            <span className="truncate text-sm font-medium">{current.name}</span>
            <span className="truncate opacity-80">
              {current.instructor.split(" ").slice(-1)[0]} · {current.location}
            </span>
          </>
        ) : value ? (
          <span className="truncate text-sm font-medium">{value}</span>
        ) : (
          <Plus className="mx-auto size-4 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100" />
        )}
      </PopoverTrigger>

      <PopoverContent align="start" className="w-72 gap-0 p-0">
        <div className="border-b px-3 py-2">
          <p className="text-sm font-medium">
            {dayFull} · {fmt12(time)}
          </p>
          <p className="text-muted-foreground text-xs">
            Choose a class for this slot
          </p>
        </div>

        <div className="max-h-64 overflow-y-auto p-1">
          {fitnessClasses.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => onPick(c.name)}
              className="hover:bg-accent focus-visible:bg-accent flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none"
            >
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  styleFor(c.category).dot,
                )}
              />
              <span className="flex-1 truncate">{c.name}</span>
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                {c.duration} · {c.location}
              </span>
              {c.name === value && <Check className="size-4 shrink-0" />}
            </button>
          ))}
        </div>

        {value && (
          <div className="border-t p-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive w-full justify-start"
              onClick={() => onPick(null)}
            >
              <X className="size-4" />
              Clear slot
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/* -------------------------------------------------------------------------- */
/*                           Add / edit time-slot dialog                      */
/* -------------------------------------------------------------------------- */

function TimeSlotDialog({
  open,
  onOpenChange,
  initialTime,
  takenTimes,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTime: string | null;
  takenTimes: string[];
  onSubmit: (time: string) => void;
}) {
  const [time, setTime] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setTime(initialTime ?? "");
      setTouched(false);
    }
  }, [open, initialTime]);

  const error = !touched
    ? null
    : !time
      ? "Pick a time."
      : takenTimes.includes(time)
        ? "There is already a row at this time."
        : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {initialTime ? "Edit time" : "Add time slot"}
          </DialogTitle>
          <DialogDescription>
            {initialTime
              ? "Changing the time moves every class in this row."
              : "Adds a new empty row to the weekly schedule."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="time-form"
          className="grid gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (time && !takenTimes.includes(time)) onSubmit(time);
          }}
        >
          <Label htmlFor="slot-time">Start time</Label>
          <Input
            id="slot-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            autoFocus
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="time-form">
            {initialTime ? "Save time" : "Add slot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Main component                              */
/* -------------------------------------------------------------------------- */

export function ScheduleAdmin() {
  const [slots, setSlots] = React.useState<Slot[]>(initialSlots); // working draft
  const [saved, setSaved] = React.useState<Slot[]>(initialSlots); // what's live
  const [location, setLocation] = React.useState("All");
  const [openCell, setOpenCell] = React.useState<string | null>(null);

  const [timeDialog, setTimeDialog] = React.useState<{
    open: boolean;
    slot: Slot | null;
  }>({
    open: false,
    slot: null,
  });
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null);

  const dirty = React.useMemo(
    () => JSON.stringify(slots) !== JSON.stringify(saved),
    [slots, saved],
  );

  // warn before leaving with unsaved changes
  React.useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const stats = React.useMemo(() => {
    const total = slots.length * DAYS.length;
    const scheduled = slots.reduce(
      (n, s) => n + DAYS.filter((d) => s.cells[d.key] !== null).length,
      0,
    );
    return { scheduled, open: total - scheduled };
  }, [slots]);

  const locationItems = [
    { value: "All", label: "All locations" },
    ...LOCATIONS.map((l) => ({ value: l, label: l })),
  ];

  /* -------------------------------- actions ------------------------------- */

  const setCell = (slotId: string, day: DayKey, className: string | null) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId ? { ...s, cells: { ...s.cells, [day]: className } } : s,
      ),
    );
    setOpenCell(null);
  };

  const clearRow = (slotId: string) =>
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, cells: emptyCells() } : s)),
    );

  const clearDay = (day: DayKey) =>
    setSlots((prev) =>
      prev.map((s) => ({ ...s, cells: { ...s.cells, [day]: null } })),
    );

  const copyDay = (from: DayKey, to: DayKey) =>
    setSlots((prev) =>
      prev.map((s) => ({ ...s, cells: { ...s.cells, [to]: s.cells[from] } })),
    );

  const submitTime = (time: string) => {
    const editing = timeDialog.slot;
    setSlots((prev) =>
      sortSlots(
        editing
          ? prev.map((s) => (s.id === editing.id ? { ...s, time } : s))
          : [...prev, { id: crypto.randomUUID(), time, cells: emptyCells() }],
      ),
    );
    setTimeDialog({ open: false, slot: null });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setSlots((prev) => prev.filter((s) => s.id !== pendingDelete));
    setPendingDelete(null);
  };

  const save = () => {
    // TODO: persist `slots` (API call / server action), then mark as saved
    setSaved(slots);
  };

  const discard = () => {
    setSlots(saved);
    setOpenCell(null);
  };

  const deleting = slots.find((s) => s.id === pendingDelete);
  const deletingCount = deleting
    ? DAYS.filter((d) => deleting.cells[d.key] !== null).length
    : 0;

  /* --------------------------------- render ------------------------------- */

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Class schedule
            </h1>
            {dirty && <Badge variant="secondary">Unsaved changes</Badge>}
          </div>
          <p className="text-muted-foreground text-sm">
            This is your weekly timetable. It repeats every week and is what
            members see on the website.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setTimeDialog({ open: true, slot: null })}
          >
            <Clock className="size-4" />
            Add time slot
          </Button>
          <Button variant="ghost" disabled={!dirty} onClick={discard}>
            <Undo2 className="size-4" />
            Discard
          </Button>
          <Button disabled={!dirty} onClick={save}>
            <Save className="size-4" />
            Save changes
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Select
          value={location}
          items={locationItems}
          onValueChange={(v) => v && setLocation(v)}
        >
          <SelectTrigger className="w-full lg:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locationItems.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {location !== "All" && (
          <Button variant="ghost" onClick={() => setLocation("All")}>
            <X className="size-4" />
            Reset
          </Button>
        )}

        {/* Legend */}
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs lg:ml-auto">
          {Object.entries(CATEGORY_STYLES).map(([name, s]) => (
            <span key={name} className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", s.dot)} />
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Timetable */}
      <div className="rounded-lg border">
        <Table className="min-w-[980px] table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-36">Time</TableHead>
              {DAYS.map((d) => (
                <TableHead key={d.key}>
                  <div className="flex items-center justify-between">
                    <span>{d.label}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                          />
                        }
                      >
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Options for {d.full}</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>{d.full}</DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Copy className="size-4" />
                            Copy to...
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {DAYS.filter((o) => o.key !== d.key).map((o) => (
                              <DropdownMenuItem
                                key={o.key}
                                onClick={() => copyDay(d.key, o.key)}
                              >
                                {o.full}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => clearDay(d.key)}
                        >
                          <Eraser className="size-4" />
                          Clear day
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {slots.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-muted-foreground h-32 text-center"
                >
                  No time slots yet. Add one to start building the schedule.
                </TableCell>
              </TableRow>
            ) : (
              slots.map((slot) => (
                <TableRow key={slot.id} className="hover:bg-transparent">
                  <TableCell className="p-1.5 align-top">
                    <div className="flex items-center justify-between gap-1 pt-2 pl-2">
                      <span className="font-medium whitespace-nowrap">
                        {fmt12(slot.time)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                            />
                          }
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">
                            Options for {fmt12(slot.time)} row
                          </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem
                            onClick={() => setTimeDialog({ open: true, slot })}
                          >
                            <Pencil className="size-4" />
                            Edit time
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => clearRow(slot.id)}>
                            <Eraser className="size-4" />
                            Clear row
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setPendingDelete(slot.id)}
                          >
                            <Trash2 className="size-4" />
                            Delete row
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>

                  {DAYS.map((d) => {
                    const value = slot.cells[d.key];
                    const cls = value ? CLASS_BY_NAME.get(value) : undefined;
                    const key = `${slot.id}:${d.key}`;
                    return (
                      <TableCell key={d.key} className="p-1.5 align-top">
                        <SlotCell
                          dayFull={d.full}
                          time={slot.time}
                          value={value}
                          dimmed={
                            location !== "All" &&
                            !!cls &&
                            cls.location !== location
                          }
                          open={openCell === key}
                          onOpenChange={(o) => setOpenCell(o ? key : null)}
                          onPick={(name) => setCell(slot.id, d.key, name)}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-muted-foreground text-sm">
        {stats.scheduled} classes per week · {stats.open} open slots
      </p>

      <TimeSlotDialog
        open={timeDialog.open}
        onOpenChange={(open) => setTimeDialog((s) => ({ ...s, open }))}
        initialTime={timeDialog.slot?.time ?? null}
        takenTimes={slots
          .filter((s) => s.id !== timeDialog.slot?.id)
          .map((s) => s.time)}
        onSubmit={submitTime}
      />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete the {deleting ? fmt12(deleting.time) : ""} row?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deletingCount > 0
                ? `This removes the row and the ${deletingCount} class${deletingCount > 1 ? "es" : ""} scheduled in it. `
                : "This removes the empty row. "}
              Nothing goes live until you save, and you can still discard your
              changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete row
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
