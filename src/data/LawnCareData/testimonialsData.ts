export interface LawnTestimonial {
  stars: number;
  quote: string;
  name: string;
  location: string;
}

export const testimonials: LawnTestimonial[] = [
  {
    stars: 5,
    quote: "[Sample] Apex made recurring lawn care easier to understand.",
    name: "J. M.",
    location: "Raleigh, NC",
  },
  {
    stars: 5,
    quote: "[Sample] I appreciated knowing the starting price before committing.",
    name: "P. K.",
    location: "Cary, NC",
  },
  {
    stars: 5,
    quote: "[Sample] The coordinator kept me updated throughout the process.",
    name: "M. T.",
    location: "Wake Forest, NC",
  },
];
