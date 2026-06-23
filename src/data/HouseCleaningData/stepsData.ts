export interface Step {
  id: string;
  number: string;
  icon: string;
  title: string;
  description: string;
}

export const stepsData: Step[] = [
  {
    id: 'step-1',
    number: '01',
    icon: 'ClipboardList',
    title: 'Select cleaning details',
    description: 'Choose your cleaning type, bedrooms, and bathrooms to build your service.',
  },
  {
    id: 'step-2',
    number: '02',
    icon: 'CalendarDays',
    title: 'Review pricing',
    description: 'See your transparent estimated price and pick a preferred time window.',
  },
  {
    id: 'step-3',
    number: '03',
    icon: 'CheckSquare',
    title: 'Coordinator confirms',
    description: 'A coordinator confirms the booking with an independent professional.',
  },
];
