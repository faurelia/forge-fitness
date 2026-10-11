"use client";

import * as React from "react";
import {
  ChevronDown,
  Copy,
  FolderInput,
  FolderPlus,
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
  categories as categoryPlaceholders,
  products as productPlaceholders,
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
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                Types & config                              */
/* -------------------------------------------------------------------------- */

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  img: string;
  description: string;
  sizes: string[]; // empty = no variations
};

const SIZES = ["S", "M", "L", "XL"];
const MAX_IMAGE_MB = 5;
const NEW_CATEGORY = "__new_category__"; // sentinel for the "Add new category" select item

const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

// placeholders.ts has no size data, so apparel gets S-XL and everything else has none
const SIZED_CATEGORIES = ["Shirts", "Shorts"];

const initialProducts: Product[] = productPlaceholders.map((p) => ({
  ...p,
  id: String(p.id),
  sizes: SIZED_CATEGORIES.includes(p.category) ? [...SIZES] : [],
}));

const initialCategories = categoryPlaceholders.filter((c) => c !== "All");

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
          e.target.value = "";
        }}
      />

      {value ? (
        <div className="flex items-center gap-4 rounded-lg border p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Product preview"
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
/*                             Add category popup                             */
/* -------------------------------------------------------------------------- */

function AddCategoryDialog({
  open,
  onOpenChange,
  existing,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing: string[];
  onAdd: (name: string) => void;
}) {
  const [name, setName] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName("");
      setTouched(false);
    }
  }, [open]);

  const trimmed = name.trim();
  const duplicate = existing.some(
    (c) => c.toLowerCase() === trimmed.toLowerCase(),
  );
  const error = !touched
    ? null
    : trimmed === ""
      ? "Category name is required."
      : duplicate
        ? "That category already exists."
        : null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTouched(true);
    if (trimmed && !duplicate) {
      onAdd(trimmed);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New category</DialogTitle>
          <DialogDescription>
            Create a category you can use right away on products.
          </DialogDescription>
        </DialogHeader>

        <form id="category-form" onSubmit={submit} className="grid gap-2">
          <Label htmlFor="category-name">Name</Label>
          <Input
            id="category-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Supplements"
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
          <Button type="submit" form="category-form">
            Add category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Add / Edit dialog                             */
/* -------------------------------------------------------------------------- */

type FormValues = {
  name: string;
  category: string;
  price: string;
  img: string;
  description: string;
  sizes: string[];
};

const toForm = (p: Product | null, fallbackCategory: string): FormValues => ({
  name: p?.name ?? "",
  category: p?.category ?? fallbackCategory,
  price: p ? String(p.price) : "",
  img: p?.img ?? "",
  description: p?.description ?? "",
  sizes: p?.sizes ?? [],
});

function ProductFormDialog({
  open,
  onOpenChange,
  initial,
  categories,
  onAddCategory,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: Product | null;
  categories: string[];
  onAddCategory: (name: string) => void;
  onSubmit: (values: FormValues) => void;
}) {
  const [form, setForm] = React.useState<FormValues>(
    toForm(null, categories[0] ?? ""),
  );
  const [touched, setTouched] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setForm(toForm(initial, categories[0] ?? ""));
      setTouched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleSize = (size: string) =>
    set(
      "sizes",
      SIZES.filter((s) =>
        s === size ? !form.sizes.includes(s) : form.sizes.includes(s),
      ),
    );

  const priceNum = Number(form.price);
  const nameValid = form.name.trim() !== "";
  const categoryValid = form.category !== "";
  const priceValid =
    form.price.trim() !== "" && Number.isFinite(priceNum) && priceNum >= 0;

  const categoryItems = [
    ...categories.map((c) => ({ value: c, label: c })),
    { value: NEW_CATEGORY, label: "Add new category..." },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>
            {initial
              ? "Update this product's details."
              : "Add a new product to your shop."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="product-form"
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (nameValid && categoryValid && priceValid) onSubmit(form);
          }}
        >
          <div className="grid gap-2">
            <Label>Image</Label>
            <ImageUpload value={form.img} onChange={(url) => set("img", url)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Forge Performance Tee"
            />
            {touched && !nameValid && (
              <p className="text-destructive text-sm">Name is required.</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                items={categoryItems}
                onValueChange={(v) => {
                  if (v === NEW_CATEGORY) setCategoryOpen(true);
                  else if (v) set("category", v);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                  <SelectSeparator />
                  <SelectItem value={NEW_CATEGORY}>
                    <Plus className="size-4" />
                    Add new category...
                  </SelectItem>
                </SelectContent>
              </Select>
              {touched && !categoryValid && (
                <p className="text-destructive text-sm">Choose a category.</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  className="pl-7"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="0.00"
                />
              </div>
              {touched && !priceValid && (
                <p className="text-destructive text-sm">Enter a valid price.</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Sizes</Label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => {
                const on = form.sizes.includes(size);
                return (
                  <Button
                    key={size}
                    type="button"
                    size="sm"
                    variant={on ? "default" : "outline"}
                    aria-pressed={on}
                    className="w-12"
                    onClick={() => toggleSize(size)}
                  >
                    {size}
                  </Button>
                );
              })}
            </div>
            <p className="text-muted-foreground text-xs">
              Leave empty if the product has no size options.
            </p>
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
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="product-form">
            {initial ? "Save changes" : "Add product"}
          </Button>
        </DialogFooter>

        {/* Nested inside this dialog so the two stack correctly. Rendered outside the <form>. */}
        <AddCategoryDialog
          open={categoryOpen}
          onOpenChange={setCategoryOpen}
          existing={categories}
          onAdd={(name) => {
            onAddCategory(name);
            set("category", name); // select the new category straight away
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Main component                              */
/* -------------------------------------------------------------------------- */

export function ProductsAdmin() {
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [categories, setCategories] =
    React.useState<string[]>(initialCategories);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("All");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<string[] | null>(
    null,
  );

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchesCategory = category === "All" || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const filtersActive = search !== "" || category !== "All";

  const categoryItems = [
    { value: "All", label: "All categories" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  /* ------------------------------- selection ------------------------------ */

  const filteredIds = filtered.map((p) => p.id);
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

  const openEdit = (p: Product) => {
    setEditing(p);
    setFormOpen(true);
  };

  const addCategory = (name: string) =>
    setCategories((prev) =>
      prev.some((c) => c.toLowerCase() === name.toLowerCase())
        ? prev
        : [...prev, name],
    );

  const handleSubmit = (v: FormValues) => {
    const patch = {
      name: v.name.trim(),
      category: v.category,
      price: Number(v.price),
      img: v.img,
      description: v.description.trim(),
      sizes: v.sizes,
    };
    if (editing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...patch } : p)),
      );
    } else {
      setProducts((prev) => [
        { id: crypto.randomUUID(), rating: 0, reviews: 0, ...patch },
        ...prev,
      ]);
    }
    setFormOpen(false);
  };

  const duplicate = (p: Product) =>
    setProducts((prev) => {
      const copy: Product = {
        ...p,
        id: crypto.randomUUID(),
        name: `${p.name} (copy)`,
        rating: 0,
        reviews: 0,
      };
      const i = prev.findIndex((x) => x.id === p.id);
      return [...prev.slice(0, i + 1), copy, ...prev.slice(i + 1)];
    });

  const moveSelected = (target: string) =>
    setProducts((prev) =>
      prev.map((p) => (selected.has(p.id) ? { ...p, category: target } : p)),
    );

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const ids = new Set(pendingDelete);
    setProducts((prev) => prev.filter((p) => !ids.has(p.id)));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setPendingDelete(null);
  };

  const pendingName =
    pendingDelete?.length === 1
      ? products.find((p) => p.id === pendingDelete[0])?.name
      : null;

  /* --------------------------------- render ------------------------------- */

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm">
            Manage your shop catalog, categories and size options.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="size-4" />
          Add product
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>

        <Select
          value={category}
          items={categoryItems}
          onValueChange={(v) => v && setCategory(v)}
        >
          <SelectTrigger className="w-full lg:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryItems.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => setCategoryOpen(true)}>
          <FolderPlus className="size-4" />
          New category
        </Button>

        {filtersActive && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setCategory("All");
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
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{selected.size} selected</DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FolderInput className="size-4" />
                  Move to category
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {categories.map((c) => (
                    <DropdownMenuItem key={c} onClick={() => moveSelected(c)}>
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

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
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Rating</TableHead>
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
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow
                  key={p.id}
                  data-state={selected.has(p.id) ? "selected" : undefined}
                >
                  <TableCell>
                    <Checkbox
                      aria-label={`Select ${p.name}`}
                      checked={selected.has(p.id)}
                      onCheckedChange={(v) => toggleOne(p.id, v === true)}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      {p.img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.img}
                          alt={p.name}
                          className="bg-muted size-12 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <div className="bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-md">
                          <ImagePlus className="size-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="truncate font-medium">{p.name}</div>
                        <div className="text-muted-foreground line-clamp-1 max-w-xs text-xs">
                          {p.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{p.category}</Badge>
                  </TableCell>

                  <TableCell className="font-medium tabular-nums">
                    {money(p.price)}
                  </TableCell>

                  <TableCell>
                    {p.sizes.length > 0 ? (
                      <div className="flex gap-1">
                        {p.sizes.map((s) => (
                          <Badge key={s} variant="secondary" className="px-1.5">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        One size
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-sm whitespace-nowrap">
                      <Star className="size-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{p.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">
                        ({p.reviews})
                      </span>
                    </div>
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
                        <span className="sr-only">Open menu for {p.name}</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(p)}>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicate(p)}>
                          <Copy className="size-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setPendingDelete([p.id])}
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
        Showing {filtered.length} of {products.length} products
        {selected.size > 0 && ` · ${selected.size} selected`}
      </p>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        categories={categories}
        onAddCategory={addCategory}
        onSubmit={handleSubmit}
      />

      {/* Standalone popup from the toolbar button */}
      <AddCategoryDialog
        open={categoryOpen}
        onOpenChange={setCategoryOpen}
        existing={categories}
        onAdd={addCategory}
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
                : `Delete ${pendingDelete?.length ?? 0} products?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product
              {pendingDelete && pendingDelete.length > 1 ? "s" : ""} will be
              permanently removed from your shop.
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
