"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type CartItem = {
  id: string;
  title: string;
  price?: number;
  checked: boolean;
};

type AddItemForm = {
  title: string;
  price?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function Page() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: crypto.randomUUID(),
      title: "Bottled Water (1.5L)",
      price: 1.25,
      checked: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Eggs (1 dozen)",
      price: 3.99,
      checked: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Rice (5 lb)",
      price: 6.5,
      checked: true,
    },
    { id: crypto.randomUUID(), title: "Milk", price: 2.75, checked: false },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const totals = useMemo(() => {
    const all = items.reduce(
      (sum, i) => sum + (typeof i.price === "number" ? i.price : 0),
      0,
    );
    const remaining = items.reduce(
      (sum, i) =>
        sum + (!i.checked && typeof i.price === "number" ? i.price : 0),
      0,
    );
    const checked = items.reduce(
      (sum, i) =>
        sum + (i.checked && typeof i.price === "number" ? i.price : 0),
      0,
    );
    return { all, remaining, checked };
  }, [items]);

  function toggleChecked(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function addItem(payload: { title: string; price?: number }) {
    const trimmed = payload.title.trim();
    if (!trimmed) return;
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: trimmed,
        price: payload.price,
        checked: false,
      },
    ]);
  }

  return (
    <main className="min-h-dvh  bg-background text-text-primary">
      {/* top glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-2xl -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-xl px-4 pb-28 pt-8 sm:pt-10">
        {/* Header */}
        <header className="mb-5 sm:mb-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Cart
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Check items off as you shop. Add new items anytime.
              </p>
            </div>

            <div className="hidden sm:block text-right">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Remaining
              </div>
              <div className="mt-0.5 text-lg font-semibold">
                {formatCurrency(totals.remaining)}
              </div>
            </div>
          </div>

          {/* Mobile totals */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden">
            <Stat label="Remaining" value={formatCurrency(totals.remaining)} />
            <Stat label="Checked" value={formatCurrency(totals.checked)} />
            <Stat label="Total" value={formatCurrency(totals.all)} />
          </div>

          {/* Desktop totals */}
          <div className="mt-4 hidden sm:grid grid-cols-3 gap-3">
            <Stat label="Remaining" value={formatCurrency(totals.remaining)} />
            <Stat label="Checked" value={formatCurrency(totals.checked)} />
            <Stat label="Total" value={formatCurrency(totals.all)} />
          </div>
        </header>

        {/* List */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div className="text-sm font-medium text-slate-200">
              Items ({items.length})
            </div>
            <div className="text-xs text-slate-400">Tap an item to toggle</div>
          </div>

          <ul className="divide-y divide-slate-800">
            {items.map((item) => (
              <li key={item.id} className="group">
                <div className="w-full px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Toggle button (single button, not wrapping everything) */}
                    <button
                      type="button"
                      onClick={() => toggleChecked(item.id)}
                      className="flex items-center gap-3 rounded-lg outline-none transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      aria-pressed={item.checked}
                      aria-label={
                        item.checked
                          ? `Uncheck ${item.title}`
                          : `Check ${item.title}`
                      }
                    >
                      <Checkbox checked={item.checked} />
                    </button>

                    {/* Text/content clickable area (not a button) */}
                    <div
                      className="min-w-0 flex-1 cursor-pointer select-none"
                      onClick={() => toggleChecked(item.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          toggleChecked(item.id);
                      }}
                      aria-label={
                        item.checked
                          ? `Uncheck ${item.title}`
                          : `Check ${item.title}`
                      }
                    >
                      <div
                        className={[
                          "truncate text-sm font-medium",
                          item.checked
                            ? "text-slate-400 line-through"
                            : "text-slate-100",
                        ].join(" ")}
                      >
                        {item.title}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        {typeof item.price === "number"
                          ? `Price: ${formatCurrency(item.price)}`
                          : "No price yet"}
                      </div>
                    </div>

                    {/* Price chip */}
                    {typeof item.price === "number" ? (
                      <span className="rounded-full border border-slate-800 bg-slate-950/40 px-2 py-1 text-xs font-semibold text-slate-200">
                        {formatCurrency(item.price)}
                      </span>
                    ) : (
                      <span className="rounded-full border border-slate-800 bg-slate-950/30 px-2 py-1 text-xs text-slate-400">
                        —
                      </span>
                    )}

                    {/* Remove button (separate, not nested) */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 rounded-lg border border-slate-800 bg-slate-950/30 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-950/60 active:scale-[0.98]"
                      aria-label={`Remove ${item.title}`}
                      title="Remove"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}

            {items.length === 0 && (
              <li className="px-4 py-10 text-center">
                <div className="text-sm font-medium text-slate-200">
                  Your cart is empty
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  Add your first item below.
                </div>
              </li>
            )}
          </ul>
        </section>

        {/* Floating Add button (mobile-first) */}
        <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-xl px-4 pb-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              + Add item
            </button>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
              <span>
                Remaining:{" "}
                <span className="font-semibold text-slate-100">
                  {formatCurrency(totals.remaining)}
                </span>
              </span>
              <span className="text-slate-400">
                Total: {formatCurrency(totals.all)}
              </span>
            </div>
          </div>
        </div>

        <AddItemModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={(data) => {
            addItem(data);
            setIsOpen(false);
          }}
        />
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-slate-100">{value}</div>
    </div>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={[
        "grid h-5 w-5 place-items-center rounded-md border transition",
        checked
          ? "border-indigo-400 bg-indigo-500/20"
          : "border-slate-700 bg-slate-950/30",
      ].join(" ")}
      aria-hidden="true"
    >
      {checked ? (
        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-indigo-300">
          <path d="M7.629 13.314 4.2 9.885l-1.2 1.2 4.629 4.629L17 6.343l-1.2-1.2z" />
        </svg>
      ) : null}
    </div>
  );
}

function AddItemModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; price?: number }) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddItemForm>({
    defaultValues: { title: "", price: "" },
    mode: "onSubmit",
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Add item"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          reset();
          onClose();
        }
      }}
    >
      {/* overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        onClick={() => {
          reset();
          onClose();
        }}
        aria-label="Close modal"
      />

      {/* panel */}
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-xl px-4 pb-5 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:pb-0">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)] sm:max-w-md sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-semibold text-slate-100">
                Add item
              </div>
              <div className="mt-1 text-sm text-slate-400">
                Add a title and an optional price.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="rounded-lg border border-slate-800 bg-slate-900/40 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-900/70 active:scale-[0.98]"
            >
              Close
            </button>
          </div>

          <form
            className="mt-4 space-y-3"
            onSubmit={handleSubmit((values) => {
              const title = values.title.trim();
              const raw = (values.price ?? "").trim();

              let price: number | undefined = undefined;
              if (raw.length > 0) {
                const parsed = Number(raw);
                if (
                  !Number.isNaN(parsed) &&
                  Number.isFinite(parsed) &&
                  parsed >= 0
                ) {
                  price = parsed;
                }
              }

              onSubmit({ title, price });
              reset();
            })}
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Item name <span className="text-indigo-300">*</span>
              </label>
              <input
                autoFocus
                {...register("title", {
                  required: "Item name is required",
                  minLength: { value: 2, message: "Use at least 2 characters" },
                })}
                placeholder="e.g., Lasco iCool Water 1.5L"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-rose-300">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Price (optional)
              </label>
              <input
                {...register("price", {
                  validate: (v) => {
                    const raw = (v ?? "").trim();
                    if (!raw) return true;
                    const n = Number(raw);
                    if (Number.isNaN(n) || !Number.isFinite(n))
                      return "Enter a valid number";
                    if (n < 0) return "Price must be 0 or higher";
                    return true;
                  },
                })}
                inputMode="decimal"
                placeholder="e.g., 2.75"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20"
              />
              {errors.price && (
                <p className="mt-1 text-xs text-rose-300">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Add to cart
              </button>

              <button
                type="button"
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-900/70 active:scale-[0.99]"
              >
                Cancel
              </button>
            </div>
          </form>

          <p className="mt-4 text-xs text-slate-500">
            Tip: prices are optional in v0.1 — you can add them later.
          </p>
        </div>
      </div>
    </div>
  );
}
