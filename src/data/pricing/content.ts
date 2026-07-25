// Pricing page — static content for the pricing-models, what's-included,
// trust-stats and FAQ sections, plus the cost-estimator configuration.
// All copy ported verbatim from apex-pricing_extracted.html.
import type { IconKey } from '../../components/pricing/icons';

// ── Section 5: pricing models ────────────────────────────────────────────────
export interface PricingModel {
  icon: IconKey;
  title: string;
  body: string;
  items: string[];
}

export const models: PricingModel[] = [
  {
    icon: 'cleaning',
    title: 'Fixed pricing',
    body: 'A set price you see upfront — same every visit.',
    items: ['Home Cleaning', 'Pool Service', 'Pest Control'],
  },
  {
    icon: 'lawn',
    title: 'Variable pricing',
    body: 'Scales with lot size, devices, or load — always shown live.',
    items: ['Lawn Care', 'Junk Removal', 'Smart Home'],
  },
  {
    icon: 'paint',
    title: 'Custom quote',
    body: 'A fast, free on-site estimate for bigger projects.',
    items: ['Painting', 'Handyman', 'Tree & Stump', 'Home Security'],
  },
];

// ── Section 6: what's included ───────────────────────────────────────────────
export interface IncludedItem {
  icon: IconKey;
  title: string;
  body: string;
}

export const included: IncludedItem[] = [
  { icon: 'handyman', title: 'Professional equipment', body: 'Commercial-grade tools on every job.' },
  { icon: 'security', title: 'Insured team', body: 'Fully insured for total peace of mind.' },
  { icon: 'userCheck', title: 'Background-checked pros', body: 'Every professional is vetted and verified.' },
  { icon: 'star', title: 'Quality guarantee', body: 'Not happy? We re-do it within 24 hours, free.' },
  { icon: 'refresh', title: 'Easy rescheduling', body: 'Move or skip a visit anytime, no fees.' },
  { icon: 'dollar', title: 'Transparent pricing', body: 'See the full breakdown before you book.' },
];

// ── Section 7: trust stats (count-up) ────────────────────────────────────────
export interface Stat {
  value: number;
  dec: number; // decimal places for the count-up
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 12000, dec: 0, suffix: '+', label: 'Homes served' },
  { value: 4.9, dec: 1, suffix: '', label: 'Average rating' },
  { value: 90, dec: 0, suffix: '', label: 'Min. avg response' },
  { value: 3400, dec: 0, suffix: '+', label: 'Recurring members' },
];

// ── Section 8: FAQ ───────────────────────────────────────────────────────────
export const faqs: { q: string; a: string }[] = [
  {
    q: 'Why do some services require quotes?',
    a: 'Bigger or highly custom projects — like whole-home painting, tree removal, or security installs — vary too much to price sight unseen. We give a fast, free on-site estimate so the number is accurate.',
  },
  {
    q: 'How is recurring pricing calculated?',
    a: 'We start from the one-time price for your configuration, then apply a member discount (up to 15%) based on how often we visit. Your per-visit rate is locked in for as long as you stay a member.',
  },
  {
    q: 'Can I change my booking later?',
    a: 'Yes. Reschedule, skip, or switch services anytime from your account — there are no change fees and no lock-in contracts.',
  },
  {
    q: 'Are taxes included?',
    a: 'Prices shown are pre-tax estimates. Applicable sales tax (about 7%) is added at checkout and always itemized before you confirm.',
  },
];

// ── Section 4: cost-estimator configuration ──────────────────────────────────
// ⚠️ PLACEHOLDER PRICING — the values below are lifted straight from the design.
// Swap `base`, `freqDiscount`, `addons[].price` and `taxRate` for the real Apex
// numbers when they're ready. The Estimator component renders the segmented
// controls from `services`/`sizes`/`freqs`/`addons`; the runtime (mountPricing)
// reads `base`/`freqDiscount`/`addons`/`taxRate` to compute the live total.
export interface EstimatorOption {
  v: string;
  label: string;
  on?: boolean;
}
export interface EstimatorAddon extends EstimatorOption {
  price: number;
}

export interface EstimatorConfig {
  taxRate: number;
  services: EstimatorOption[];
  sizes: EstimatorOption[];
  freqs: EstimatorOption[];
  addons: EstimatorAddon[];
  base: Record<string, Record<string, number>>;
  freqDiscount: Record<string, number>;
}

export const estimatorConfig: EstimatorConfig = {
  taxRate: 0.07,
  services: [
    { v: 'cleaning', label: 'Cleaning', on: true },
    { v: 'lawn', label: 'Lawn' },
    { v: 'pool', label: 'Pool' },
    { v: 'pest', label: 'Pest' },
    { v: 'power', label: 'Power Wash' },
  ],
  sizes: [
    { v: 's', label: 'Small' },
    { v: 'm', label: 'Medium', on: true },
    { v: 'l', label: 'Large' },
  ],
  freqs: [
    { v: 'once', label: 'One-time' },
    { v: 'weekly', label: 'Weekly' },
    { v: 'biweekly', label: 'Bi-weekly', on: true },
    { v: 'monthly', label: 'Monthly' },
  ],
  addons: [
    { v: 'windows', label: 'Interior windows', price: 40 },
    { v: 'fridge', label: 'Inside fridge/oven', price: 35 },
    { v: 'eco', label: 'Eco products', price: 15 },
    { v: 'garage', label: 'Garage/patio', price: 30 },
  ],
  base: {
    cleaning: { s: 129, m: 169, l: 219 },
    lawn: { s: 39, m: 59, l: 89 },
    pool: { s: 119, m: 139, l: 169 },
    pest: { s: 89, m: 109, l: 139 },
    power: { s: 149, m: 199, l: 279 },
  },
  freqDiscount: { once: 0, weekly: 0.15, biweekly: 0.12, monthly: 0.08 },
};
