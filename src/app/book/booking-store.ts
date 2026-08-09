"use client";

// Persisted booking-wizard state. The wizard is open to anonymous visitors and
// sign-in happens at the final confirm — which navigates to /login and unmounts
// the page. Everything the visitor has configured therefore lives here,
// persisted to sessionStorage (per-tab), so the redirect round-trip restores
// the wizard exactly where they left it.
//
// Only the visitor's INPUT is persisted. Server-derived state (the fetched
// config, the price preview, recurring options) and submit lifecycle stay in
// the component: on restore, BookingFlow refetches the config for `slug` and
// the debounced pricing effect recomputes the estimate — a saved wizard can
// never present a stale price.

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SelectionValue = string | number | boolean | string[];
export type ContactEdits = Partial<Record<"first" | "last" | "email" | "phone", string>>;
export interface WizardAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface WizardData {
  step: number;
  /** Chosen service slug; the component refetches its config on restore. */
  slug: string | null;
  cadenceKey: string;
  selections: Record<string, SelectionValue>;
  description: string;
  edits: ContactEdits;
  address: WizardAddress;
  propType: string;
  date: string;
  slot: string;
  agree: boolean;
}

/** React-style setter payload: a value, or an updater over the previous one. */
type Updater<T> = T | ((prev: T) => T);
const resolve = <T,>(v: Updater<T>, prev: T): T =>
  typeof v === "function" ? (v as (p: T) => T)(prev) : v;

interface WizardActions {
  setStep: (n: number) => void;
  setSlug: (slug: string | null) => void;
  setCadenceKey: (key: string) => void;
  setSelections: (v: Updater<Record<string, SelectionValue>>) => void;
  setDescription: (v: string) => void;
  setEdits: (v: Updater<ContactEdits>) => void;
  setAddress: (v: WizardAddress) => void;
  setPropType: (v: string) => void;
  setDate: (v: string) => void;
  setSlot: (v: string) => void;
  setAgree: (v: Updater<boolean>) => void;
  reset: () => void;
}

const initial: WizardData = {
  step: 1,
  slug: null,
  cadenceKey: "one-time",
  selections: {},
  description: "",
  edits: {},
  address: { street: "", city: "", state: "NC", zip: "" },
  propType: "House", // PROP_TYPES[0] in BookingFlow
  date: "",
  slot: "",
  agree: false,
};

export const useBookingStore = create<WizardData & WizardActions>()(
  persist(
    (set) => ({
      ...initial,
      setStep: (step) => set({ step }),
      setSlug: (slug) => set({ slug }),
      setCadenceKey: (cadenceKey) => set({ cadenceKey }),
      setSelections: (v) => set((s) => ({ selections: resolve(v, s.selections) })),
      setDescription: (description) => set({ description }),
      setEdits: (v) => set((s) => ({ edits: resolve(v, s.edits) })),
      setAddress: (address) => set({ address }),
      setPropType: (propType) => set({ propType }),
      setDate: (date) => set({ date }),
      setSlot: (slot) => set({ slot }),
      setAgree: (v) => set((s) => ({ agree: resolve(v, s.agree) })),
      reset: () => set(initial),
    }),
    {
      name: "apex-booking-wizard",
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
      // SSR (and the first client render) use the defaults above; BookingFlow
      // calls persist.rehydrate() after mount so hydration never mismatches.
      skipHydration: true,
    },
  ),
);
