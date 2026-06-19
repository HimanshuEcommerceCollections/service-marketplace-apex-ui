export interface Service {
  id: string;
  iconLetter: string;
  name: string;
  description: string;
  price: string;
}

export const services: Service[] = [
  { id: 'cleaning', iconLetter: 'H', name: 'House Cleaning', description: 'Recurring or one-time. Beds × baths pricing matrix.', price: 'From $89 DRAFT' },
  { id: 'lawn', iconLetter: 'L', name: 'Lawn Care', description: 'Mowing, edging, fertilizing and seasonal care.', price: 'From $45 DRAFT' },
  { id: 'pool', iconLetter: 'P', name: 'Pool Service', description: 'Weekly chemical balancing and equipment checks.', price: 'From $120 DRAFT' },
  { id: 'pest', iconLetter: 'P', name: 'Pest Control', description: 'Certified interior and exterior treatments.', price: 'From $79 DRAFT' },
  { id: 'junk', iconLetter: 'J', name: 'Junk Removal', description: 'Same-day haul-away — priced by visual load estimate.', price: 'From $99 DRAFT' },
  { id: 'painting', iconLetter: 'P', name: 'Painting', description: 'Interior and exterior. Custom quote required.', price: 'Quote DRAFT' },
  { id: 'handyman', iconLetter: 'H', name: 'Handyman', description: 'Repairs, installs, and small projects.', price: 'From $65 DRAFT' },
  { id: 'pressure', iconLetter: 'P', name: 'Pressure Washing', description: 'Driveways, decks, patios, exterior surfaces.', price: 'From $99 DRAFT' },
  { id: 'windows', iconLetter: 'W', name: 'Window Cleaning', description: 'Interior and exterior, priced per window.', price: 'From $75 DRAFT' },
  { id: 'smart', iconLetter: 'S', name: 'Smart Home', description: 'Device setup — 3 devices saves 15%.', price: 'From $49 DRAFT' },
  { id: 'moving', iconLetter: 'M', name: 'Moving Help', description: 'Loading, unloading, and packing labor.', price: 'From $99 DRAFT' },
];
