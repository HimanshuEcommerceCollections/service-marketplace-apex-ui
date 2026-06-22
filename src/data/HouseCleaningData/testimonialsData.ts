export interface Testimonial {
  id: string;
  rating: number;
  quote: string;
  attribution: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 't1',
    rating: 5,
    quote: '[Sample] The pricing was clear before requesting service.',
    attribution: 'Anonymous · House Cleaning · [Sample]',
  },
  {
    id: 't2',
    rating: 5,
    quote: '[Sample] I set up recurring cleaning and the arrangement stayed consistent.',
    attribution: 'Anonymous · House Cleaning · [Sample]',
  },
  {
    id: 't3',
    rating: 5,
    quote: '[Sample] A coordinator confirmed everything before any work began.',
    attribution: 'Anonymous · House Cleaning · [Sample]',
  },
];
