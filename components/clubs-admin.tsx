"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
  ChevronDown,
  ImagePlus,
  Loader2,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  clubs as clubPlaceholders,
  clubsDetails,
} from "@/lib/data/placeholders";
import type { LatLng } from "@/components/location-picker";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Leaflet touches `window`, so the map only loads in the browser.
const LocationPicker = dynamic(() => import("@/components/location-picker"), {
  ssr: false,
  loading: () => (
    <div className="bg-muted h-72 w-full animate-pulse rounded-lg border" />
  ),
});

/* -------------------------------------------------------------------------- */
/*                                Types & config                              */
/* -------------------------------------------------------------------------- */

type Hours = { open: string; close: string }; // 24h "HH:mm"

type Club = {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: { weekday: Hours; weekend: Hours };
  img: string;
  gallery: string[];
  amenities: string[];
  members: number | null;
  trainers: number;
  classes: number;
  sqft: string;
  lat: number | null;
  lng: number | null;
  // relations managed on the Classes / Trainers pages; kept so merged data isn't lost
  classesList: string[];
  trainersList: string[];
};

const MAX_IMAGE_MB = 5;
const MAX_GALLERY = 6;

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

const pad = (n: number) => String(n).padStart(2, "0");

// "5:00 AM" / "5AM" -> "05:00"
function parseTimes(text: string): string[] {
  return [...text.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi)].map((m) => {
    let h = Number(m[1]) % 12;
    if (m[3].toUpperCase() === "PM") h += 12;
    return `${pad(h)}:${m[2] ?? "00"}`;
  });
}

// "05:00" -> "5 AM", "17:30" -> "5:30 PM"
const fmtShort = (t: string) => {
  const [H, M] = t.split(":").map(Number);
  return `${H % 12 || 12}${M ? `:${pad(M)}` : ""} ${H >= 12 ? "PM" : "AM"}`;
};

const stripCount = (a: string) => a.replace(/\s*\(\d+\)\s*$/, ""); // "Group Studios (3)" -> "Group Studios"

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const parseCoords = (lat: string, lng: string): LatLng | null => {
  if (lat.trim() === "" || lng.trim() === "") return null;
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;
  if (Math.abs(la) > 90 || Math.abs(ln) > 180) return null;
  return { lat: la, lng: ln };
};

/* -------------------------------------------------------------------------- */
/*                  Merge `clubs` + `clubsDetails` from placeholders          */
/* -------------------------------------------------------------------------- */

// Sample pins (approximate neighborhood centers) because the placeholder
// addresses are fictional. Real pins come from the map picker.
const SAMPLE_COORDS: Record<string, [number, number]> = {
  downtown: [40.7075, -74.0113],
  midtown: [40.7549, -73.984],
  westside: [40.799, -73.968],
  brooklyn: [40.6928, -73.9903],
  uptown: [40.84, -73.94],
  queens: [40.7447, -73.9485],
};

const detailByName = new Map<string, (typeof clubsDetails)[number]>(
  clubsDetails.map((c) => [c.name, c]),
);

const initialClubs: Club[] = clubPlaceholders.map((c) => {
  const det = detailByName.get(c.name);
  const id = det?.id ?? slugify(c.name.replace(/^Forge\s+/i, ""));

  // hours: prefer the structured details, fall back to parsing "Mon-Fri: 5AM-11PM, Sat-Sun: 7AM-9PM"
  const fromString = parseTimes(c.hours);
  const weekday = det ? parseTimes(det.hours.weekday) : fromString.slice(0, 2);
  const weekend = det ? parseTimes(det.hours.weekend) : fromString.slice(2, 4);

  const coords = SAMPLE_COORDS[id];

  return {
    id,
    name: c.name,
    description: det?.description ?? "",
    address: c.address,
    phone: c.phone,
    email: det?.email ?? "",
    hours: {
      weekday: { open: weekday[0] ?? "06:00", close: weekday[1] ?? "22:00" },
      weekend: { open: weekend[0] ?? "07:00", close: weekend[1] ?? "20:00" },
    },
    img: c.img,
    gallery: det?.gallery ?? [],
    amenities: (det?.amenities ?? c.amenities).map(stripCount),
    members: det ? Number(det.members.replace(/[^0-9]/g, "")) : null, // "2,500+" -> 2500
    trainers: c.trainers,
    classes: c.classes,
    sqft: det?.sqft ?? "",
    lat: coords?.[0] ?? null,
    lng: coords?.[1] ?? null,
    classesList: det?.classesList ?? [],
    trainersList: det?.trainersList ?? [],
  };
});

const initialAmenityOptions = Array.from(
  new Set(initialClubs.flatMap((c) => c.amenities)),
).sort((a, b) => a.localeCompare(b));

/* -------------------------------------------------------------------------- */
/*                                Image uploads                               */
/* -------------------------------------------------------------------------- */

function validateImage(file: File): string | null {
  if (!file.type.startsWith("image/"))
    return "Please choose image files (PNG, JPG, WebP).";
  if (file.size > MAX_IMAGE_MB * 1024 * 1024)
    return `Images must be smaller than ${MAX_IMAGE_MB}MB.`;
  return null;
}

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

  React.useEffect(() => {
    return () => {
      if (createdUrl.current) URL.revokeObjectURL(createdUrl.current);
    };
  }, []);

  const handleFile = (file?: File) => {
    if (!file) return;
    const problem = validateImage(file);
    if (problem) {
      setError(problem);
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
          e.target.value = "";
        }}
      />

      {value ? (
        <div className="flex items-center gap-4 rounded-lg border p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Club cover"
            className="bg-muted h-20 w-32 rounded-lg object-cover"
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

function GalleryUpload({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string | null>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const room = MAX_GALLERY - value.length;
    const accepted: string[] = [];
    let problem: string | null = null;

    Array.from(files).forEach((file) => {
      const bad = validateImage(file);
      if (bad) problem = bad;
      else if (accepted.length < room) accepted.push(URL.createObjectURL(file)); // TODO: real upload
    });

    if (files.length > room && !problem)
      problem = `You can add up to ${MAX_GALLERY} photos.`;
    setError(problem);
    if (accepted.length) onChange([...value, ...accepted]);
  };

  return (
    <div className="grid gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((url, i) => (
          <div
            key={url}
            className="group relative aspect-[4/3] overflow-hidden rounded-md border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Gallery ${i + 1}`}
              className="size-full object-cover"
            />
            <button
              type="button"
              aria-label={`Remove photo ${i + 1}`}
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="bg-background/90 absolute top-1 right-1 rounded-full p-1 opacity-0 shadow transition group-hover:opacity-100 focus-visible:opacity-100"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {value.length < MAX_GALLERY && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-muted-foreground hover:bg-muted/50 flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs transition-colors"
          >
            <Plus className="size-5" />
            Add photos
          </button>
        )}
      </div>
      <p className="text-muted-foreground text-xs">
        Up to {MAX_GALLERY} photos, {MAX_IMAGE_MB}MB each.
      </p>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Add / Edit dialog                             */
/* -------------------------------------------------------------------------- */

type FormValues = {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  sqft: string;
  weekdayOpen: string;
  weekdayClose: string;
  weekendOpen: string;
  weekendClose: string;
  img: string;
  gallery: string[];
  amenities: string[];
  lat: string;
  lng: string;
};

const toForm = (c: Club | null): FormValues => ({
  name: c?.name ?? "",
  description: c?.description ?? "",
  address: c?.address ?? "",
  phone: c?.phone ?? "",
  email: c?.email ?? "",
  sqft: c?.sqft ?? "",
  weekdayOpen: c?.hours.weekday.open ?? "06:00",
  weekdayClose: c?.hours.weekday.close ?? "22:00",
  weekendOpen: c?.hours.weekend.open ?? "07:00",
  weekendClose: c?.hours.weekend.close ?? "20:00",
  img: c?.img ?? "",
  gallery: c?.gallery ?? [],
  amenities: c?.amenities ?? [],
  lat: c?.lat != null ? c.lat.toFixed(6) : "",
  lng: c?.lng != null ? c.lng.toFixed(6) : "",
});

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-3">
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function ClubFormDialog({
  open,
  onOpenChange,
  initial,
  amenityOptions,
  onAddAmenity,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: Club | null;
  amenityOptions: string[];
  onAddAmenity: (name: string) => void;
  onSubmit: (values: FormValues) => void;
}) {
  const [form, setForm] = React.useState<FormValues>(toForm(null));
  const [touched, setTouched] = React.useState(false);
  const [focusToken, setFocusToken] = React.useState(0);
  const [newAmenity, setNewAmenity] = React.useState("");
  const [geo, setGeo] = React.useState<{
    status: "idle" | "loading" | "ok" | "error";
    message?: string;
  }>({
    status: "idle",
  });

  React.useEffect(() => {
    if (open) {
      setForm(toForm(initial));
      setTouched(false);
      setNewAmenity("");
      setGeo({ status: "idle" });
      setFocusToken((t) => t + 1); // center the map on the club being edited
    }
  }, [open, initial]);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const pin = parseCoords(form.lat, form.lng);
  const hasAnyCoord = form.lat.trim() !== "" || form.lng.trim() !== "";

  const nameValid = form.name.trim() !== "";
  const addressValid = form.address.trim() !== "";
  const emailValid =
    form.email.trim() === "" ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const coordsValid = !hasAnyCoord || pin !== null;

  const toggleAmenity = (a: string) =>
    set(
      "amenities",
      form.amenities.includes(a)
        ? form.amenities.filter((x) => x !== a)
        : [...form.amenities, a],
    );

  const addAmenity = () => {
    const name = newAmenity.trim();
    if (!name) return;
    const existing = amenityOptions.find(
      (a) => a.toLowerCase() === name.toLowerCase(),
    );
    if (!existing) onAddAmenity(name);
    const final = existing ?? name;
    if (!form.amenities.includes(final))
      set("amenities", [...form.amenities, final]);
    setNewAmenity("");
  };

  // Address -> coordinates (OpenStreetMap Nominatim). Only runs when the admin
  // clicks the button, never while typing. See notes on usage limits.
  const findOnMap = async () => {
    const q = form.address.trim();
    if (!q) return;
    setGeo({ status: "loading" });
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
        { headers: { Accept: "application/json" } },
      );
      const data: { lat: string; lon: string }[] = await res.json();
      if (!data.length) {
        setGeo({
          status: "error",
          message:
            "Couldn't find that address. Click the map to place the pin yourself.",
        });
        return;
      }
      setForm((f) => ({
        ...f,
        lat: Number(data[0].lat).toFixed(6),
        lng: Number(data[0].lon).toFixed(6),
      }));
      setFocusToken((t) => t + 1);
      setGeo({
        status: "ok",
        message: "Pin moved to the best match. Drag it to fine-tune.",
      });
    } catch {
      setGeo({
        status: "error",
        message: "Lookup failed. Click the map to place the pin yourself.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit club" : "Add club"}</DialogTitle>
          <DialogDescription>
            {initial
              ? "Update this club's details."
              : "Add a new club location."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="club-form"
          className="grid gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (nameValid && addressValid && emailValid && coordsValid)
              onSubmit(form);
          }}
        >
          {/* Basics */}
          <Section title="Basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Forge Downtown"
                />
                {touched && !nameValid && (
                  <p className="text-destructive text-sm">Name is required.</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sqft">Size (sq ft)</Label>
                <Input
                  id="sqft"
                  value={form.sqft}
                  onChange={(e) => set("sqft", e.target.value)}
                  placeholder="25,000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="downtown@forgefitness.com"
                />
                {touched && !emailValid && (
                  <p className="text-destructive text-sm">
                    Enter a valid email address.
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </Section>

          <Separator />

          {/* Photos */}
          <Section title="Photos">
            <div className="grid gap-2">
              <Label>Cover image</Label>
              <ImageUpload
                value={form.img}
                onChange={(url) => set("img", url)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Gallery</Label>
              <GalleryUpload
                value={form.gallery}
                onChange={(urls) => set("gallery", urls)}
              />
            </div>
          </Section>

          <Separator />

          {/* Hours */}
          <Section title="Opening hours">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Mon–Fri</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    aria-label="Weekday opens"
                    value={form.weekdayOpen}
                    onChange={(e) => set("weekdayOpen", e.target.value)}
                  />
                  <span className="text-muted-foreground text-sm">to</span>
                  <Input
                    type="time"
                    aria-label="Weekday closes"
                    value={form.weekdayClose}
                    onChange={(e) => set("weekdayClose", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Sat–Sun</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    aria-label="Weekend opens"
                    value={form.weekendOpen}
                    onChange={(e) => set("weekendOpen", e.target.value)}
                  />
                  <span className="text-muted-foreground text-sm">to</span>
                  <Input
                    type="time"
                    aria-label="Weekend closes"
                    value={form.weekendClose}
                    onChange={(e) => set("weekendClose", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Section>

          <Separator />

          {/* Amenities */}
          <Section
            title="Amenities"
            description="Select everything this club offers."
          >
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((a) => {
                const on = form.amenities.includes(a);
                return (
                  <Button
                    key={a}
                    type="button"
                    size="sm"
                    variant={on ? "default" : "outline"}
                    aria-pressed={on}
                    onClick={() => toggleAmenity(a)}
                  >
                    {a}
                  </Button>
                );
              })}
            </div>
            <div className="flex gap-2 sm:max-w-sm">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // don't submit the whole form
                    addAmenity();
                  }
                }}
                placeholder="Add another amenity..."
              />
              <Button
                type="button"
                variant="outline"
                onClick={addAmenity}
                disabled={!newAmenity.trim()}
              >
                <Plus className="size-4" />
                Add
              </Button>
            </div>
          </Section>

          <Separator />

          {/* Location */}
          <Section
            title="Map location"
            description="Addresses alone aren't precise enough for the map. Find the address, then click the map or drag the pin to the exact entrance."
          >
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <div className="flex gap-2">
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="123 Fitness Ave, New York, NY 10001"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={findOnMap}
                  disabled={!form.address.trim() || geo.status === "loading"}
                >
                  {geo.status === "loading" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <MapPin className="size-4" />
                  )}
                  Find on map
                </Button>
              </div>
              {touched && !addressValid && (
                <p className="text-destructive text-sm">Address is required.</p>
              )}
              {geo.message && (
                <p
                  className={cn(
                    "text-sm",
                    geo.status === "error"
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {geo.message}
                </p>
              )}
            </div>

            <LocationPicker
              value={pin}
              focusToken={focusToken}
              onChange={(p) => {
                setForm((f) => ({
                  ...f,
                  lat: p.lat.toFixed(6),
                  lng: p.lng.toFixed(6),
                }));
                setGeo({ status: "idle" });
              }}
            />

            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div className="grid gap-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  inputMode="decimal"
                  value={form.lat}
                  onChange={(e) => set("lat", e.target.value)}
                  onBlur={() => setFocusToken((t) => t + 1)}
                  placeholder="40.712800"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  inputMode="decimal"
                  value={form.lng}
                  onChange={(e) => set("lng", e.target.value)}
                  onBlur={() => setFocusToken((t) => t + 1)}
                  placeholder="-74.006000"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                disabled={!hasAnyCoord}
                onClick={() => setForm((f) => ({ ...f, lat: "", lng: "" }))}
              >
                <X className="size-4" />
                Remove pin
              </Button>
            </div>

            {!coordsValid && (
              <p className="text-destructive text-sm">
                Enter a valid latitude (−90 to 90) and longitude (−180 to 180),
                or remove the pin.
              </p>
            )}
            {coordsValid && !pin && (
              <p className="text-muted-foreground text-sm">
                No pin yet. The website map won&apos;t show this club until you
                set one.
              </p>
            )}
          </Section>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="club-form">
            {initial ? "Save changes" : "Add club"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Main component                              */
/* -------------------------------------------------------------------------- */

export function ClubsAdmin() {
  const [clubs, setClubs] = React.useState<Club[]>(initialClubs);
  const [amenityOptions, setAmenityOptions] = React.useState<string[]>(
    initialAmenityOptions,
  );
  const [search, setSearch] = React.useState("");
  const [amenityFilter, setAmenityFilter] = React.useState<string[]>([]);
  const [pinFilter, setPinFilter] = React.useState("All");

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Club | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return clubs.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      // must offer ALL of the selected amenities
      const matchesAmenities = amenityFilter.every((a) =>
        c.amenities.includes(a),
      );
      const pinned = c.lat !== null && c.lng !== null;
      const matchesPin =
        pinFilter === "All" || (pinFilter === "pinned" ? pinned : !pinned);
      return matchesSearch && matchesAmenities && matchesPin;
    });
  }, [clubs, search, amenityFilter, pinFilter]);

  const filtersActive =
    search !== "" || amenityFilter.length > 0 || pinFilter !== "All";

  const pinItems = [
    { value: "All", label: "All locations" },
    { value: "pinned", label: "Pin set" },
    { value: "missing", label: "No pin" },
  ];

  /* -------------------------------- actions ------------------------------- */

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (c: Club) => {
    setEditing(c);
    setFormOpen(true);
  };

  const addAmenity = (name: string) =>
    setAmenityOptions((prev) =>
      prev.some((a) => a.toLowerCase() === name.toLowerCase())
        ? prev
        : [...prev, name].sort((a, b) => a.localeCompare(b)),
    );

  const handleSubmit = (v: FormValues) => {
    const pin = parseCoords(v.lat, v.lng);
    const patch = {
      name: v.name.trim(),
      description: v.description.trim(),
      address: v.address.trim(),
      phone: v.phone.trim(),
      email: v.email.trim(),
      sqft: v.sqft.trim(),
      hours: {
        weekday: { open: v.weekdayOpen, close: v.weekdayClose },
        weekend: { open: v.weekendOpen, close: v.weekendClose },
      },
      img: v.img,
      gallery: v.gallery,
      amenities: v.amenities,
      lat: pin?.lat ?? null,
      lng: pin?.lng ?? null,
    };

    if (editing) {
      setClubs((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, ...patch } : c)),
      );
    } else {
      const base = slugify(patch.name.replace(/^Forge\s+/i, "")) || "club";
      setClubs((prev) => [
        {
          id: prev.some((c) => c.id === base)
            ? `${base}-${crypto.randomUUID().slice(0, 4)}`
            : base,
          members: 0,
          trainers: 0,
          classes: 0,
          classesList: [],
          trainersList: [],
          ...patch,
        },
        ...prev,
      ]);
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setClubs((prev) => prev.filter((c) => c.id !== pendingDelete));
    setPendingDelete(null);
  };

  const deleting = clubs.find((c) => c.id === pendingDelete);

  /* --------------------------------- render ------------------------------- */

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clubs</h1>
          <p className="text-muted-foreground text-sm">
            Manage club locations, opening hours, amenities and map pins.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="size-4" />
          Add club
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, address, phone or email..."
            className="pl-9"
          />
        </div>

        {/* Amenities filter (club must have all selected) */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Amenities
            {amenityFilter.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {amenityFilter.length}
              </Badge>
            )}
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="max-h-80 w-56 overflow-y-auto"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Has all of</DropdownMenuLabel>
            </DropdownMenuGroup>
            {amenityOptions.map((a) => (
              <DropdownMenuCheckboxItem
                key={a}
                checked={amenityFilter.includes(a)}
                closeOnClick={false}
                onCheckedChange={(checked) =>
                  setAmenityFilter((prev) =>
                    checked ? [...prev, a] : prev.filter((x) => x !== a),
                  )
                }
              >
                {a}
              </DropdownMenuCheckboxItem>
            ))}
            {amenityFilter.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  closeOnClick={false}
                  onClick={() => setAmenityFilter([])}
                >
                  <X className="size-4" />
                  Clear amenities
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Select
          value={pinFilter}
          items={pinItems}
          onValueChange={(v) => v && setPinFilter(v)}
        >
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pinItems.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filtersActive && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setAmenityFilter([]);
              setPinFilter("All");
            }}
          >
            <X className="size-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Club</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Amenities</TableHead>
              <TableHead className="text-right">Members</TableHead>
              <TableHead className="text-right">Trainers</TableHead>
              <TableHead className="text-right">Classes</TableHead>
              <TableHead>Map</TableHead>
              <TableHead className="w-12 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-muted-foreground h-32 text-center"
                >
                  No clubs found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => {
                const pinned = c.lat !== null && c.lng !== null;
                const shown = c.amenities.slice(0, 2);
                const extra = c.amenities.length - shown.length;
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {c.img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.img}
                            alt={c.name}
                            className="bg-muted h-12 w-16 shrink-0 rounded-md object-cover"
                          />
                        ) : (
                          <div className="bg-muted text-muted-foreground flex h-12 w-16 shrink-0 items-center justify-center rounded-md">
                            <ImagePlus className="size-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="truncate font-medium">{c.name}</div>
                          <div className="text-muted-foreground line-clamp-1 max-w-[15rem] text-xs">
                            {c.address}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm whitespace-nowrap">
                      <div>
                        <span className="text-muted-foreground">Mon–Fri </span>
                        {fmtShort(c.hours.weekday.open)} –{" "}
                        {fmtShort(c.hours.weekday.close)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sat–Sun </span>
                        {fmtShort(c.hours.weekend.open)} –{" "}
                        {fmtShort(c.hours.weekend.close)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {shown.map((a) => (
                          <Badge
                            key={a}
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            {a}
                          </Badge>
                        ))}
                        {extra > 0 && (
                          <Badge variant="secondary">+{extra}</Badge>
                        )}
                        {c.amenities.length === 0 && (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right tabular-nums">
                      {c.members !== null ? c.members.toLocaleString() : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {c.trainers}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {c.classes}
                    </TableCell>

                    <TableCell>
                      {pinned ? (
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}#map=16/${c.lat}/${c.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs whitespace-nowrap underline-offset-4 hover:underline"
                        >
                          <MapPin className="size-3.5 text-red-500" />
                          {c.lat!.toFixed(4)}, {c.lng!.toFixed(4)}
                        </a>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          No pin
                        </Badge>
                      )}
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
                            Open menu for {c.name}
                          </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(c)}>
                            <Pencil className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setPendingDelete(c.id)}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
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
        Showing {filtered.length} of {clubs.length} clubs
      </p>

      <ClubFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        amenityOptions={amenityOptions}
        onAddAmenity={addAmenity}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The club will be permanently
              removed, along with its map pin and photos.
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
