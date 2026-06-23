export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const featuresData: Feature[] = [
  {
    id: 'pricing',
    icon: 'Tag',
    title: 'Transparent pricing',
    description: 'See your estimated price before you request service — no hidden fees, no surprises.',
  },
  {
    id: 'recurring',
    icon: 'CalendarDays',
    title: 'Recurring options',
    description: 'Set up weekly, bi-weekly, or monthly cleaning and keep the same arrangement.',
  },
  {
    id: 'coordinator',
    icon: 'CheckSquare',
    title: 'Coordinator confirmed',
    description: 'A coordinator confirms every booking and matches an independent professional.',
  },
];
