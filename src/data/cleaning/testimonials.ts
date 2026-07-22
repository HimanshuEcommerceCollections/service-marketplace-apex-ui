// Testimonial carousel data for the cleaning service page.
// Ported verbatim from the inline DATA array in
// apex-service-cleaning-preview_extracted.html. The five portraits were inline
// base64 (one per .tcard); they now live as files and are referenced by path.
// The order is preserved so the carousel's default index (3 = Aisha) matches
// the source markup.

export interface CleaningTestimonial {
  id: string;
  name: string;
  tag: string;
  quote: string;
  portrait: string;
}

export const testimonials: CleaningTestimonial[] = [
  {
    id: 'marisol',
    name: 'Marisol Vega',
    tag: 'Recurring Cleaning · Cary',
    quote:
      'Same two-person crew every visit, and they actually remember how I like things done. Worth every dollar.',
    portrait: '/assets/cleaning/images/testimonial-marisol.jpg',
  },
  {
    id: 'dana',
    name: 'Dana Whitfield',
    tag: 'Handyman · Apex',
    quote:
      'I booked one visit for six odd jobs around the house and every single one was done right. No callbacks needed.',
    portrait: '/assets/cleaning/images/testimonial-dana.jpg',
  },
  {
    id: 'marcus',
    name: 'Marcus Boone',
    tag: 'Lawn Care · Wake Forest',
    quote:
      'My lawn has never looked this sharp. They show up on schedule and the edging is razor clean every time.',
    portrait: '/assets/cleaning/images/testimonial-marcus.jpg',
  },
  {
    id: 'aisha',
    name: 'Aisha Kapoor',
    tag: 'Home Cleaning · Holly Springs',
    quote:
      'Spotless every time and so easy to reschedule — the most reliable service we have ever used.',
    portrait: '/assets/cleaning/images/testimonial-aisha.jpg',
  },
  {
    id: 'elena',
    name: 'Elena Ruiz',
    tag: 'Interior Painting · North Hills',
    quote:
      'Two rooms repainted over a weekend, edges perfect, zero mess left behind. Booking the hallway next.',
    portrait: '/assets/cleaning/images/testimonial-elena.jpg',
  },
];
