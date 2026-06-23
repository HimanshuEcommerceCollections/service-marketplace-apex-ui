export interface ProtectionPlan {
  icon: string;
  title: string;
  body: string;
}

export const protectionPlans: ProtectionPlan[] = [
  {
    icon: "clipboard",
    title: "Clear next steps",
    body: "Tell us your situation and get a clear next step — no guesswork about what happens.",
  },
  {
    icon: "map",
    title: "Local service area",
    body: "Serving Wake County, Raleigh NC. Independent professionals across the area.",
  },
  {
    icon: "check",
    title: "Coordinator confirmed",
    body: "A coordinator confirms every request and matches an independent professional.",
  },
];
