export interface PestFAQ {
  q: string;
  a: string;
  defaultOpen: boolean;
}

export const faqs: PestFAQ[] = [
  {
    q: "How does pest pricing work?",
    a: "Pest control pricing depends on the treatment needed and your property details, so it starts with a custom review. Tell us your situation and a coordinator confirms a clear next step. Independent professionals complete the work, coordinator-confirmed.",
    defaultOpen: true,
  },
  {
    q: "Why does pricing vary?",
    a: "Every pest situation is different — treatment approach, product type, and property size all affect cost. That's why we start with a review rather than a fixed price list.",
    defaultOpen: false,
  },
  {
    q: "What areas do you serve?",
    a: "Apex currently serves Wake County including Raleigh, Cary, Apex, Wake Forest, and surrounding areas.",
    defaultOpen: false,
  },
  {
    q: "Are the professionals vetted?",
    a: "Yes. Every independent professional is background-checked and insured before they work with customers.",
    defaultOpen: false,
  },
  {
    q: "What does 'DRAFT' mean on this page?",
    a: "This is an internal sprint prototype. All content, pricing, and features shown are illustrative and not final.",
    defaultOpen: false,
  },
];
