// How It Works — testimonial carousel data, ported verbatim from the inline DATA
// array in apex-how-it-works_extracted.html. Fed to the shared <Testimonials/>
// via mountTestimonials (maps tag → role). Portraits were inline base64 in the
// source; they now live as files under public/assets/how-it-works/images.

export interface HiwTestimonial {
  id: string;
  name: string;
  tag: string;
  quote: string;
  portrait: string;
}

export const testimonials: HiwTestimonial[] = [
  {
    id: 'marisol',
    name: 'Marisol Vega',
    tag: 'Recurring Cleaning · Cary',
    quote:
      'Same two-person crew every visit, and they actually remember how I like things done. Worth every dollar.',
    portrait: '/assets/how-it-works/images/testimonial-marisol.jpg',
  },
  {
    id: 'dana',
    name: 'Dana Whitfield',
    tag: 'Handyman · Apex',
    quote:
      'I booked one visit for six odd jobs around the house and every single one was done right. No callbacks needed.',
    portrait: '/assets/how-it-works/images/testimonial-dana.jpg',
  },
  {
    id: 'marcus',
    name: 'Marcus Boone',
    tag: 'Lawn Care · Wake Forest',
    quote:
      'My lawn has never looked this sharp. They show up on schedule and the edging is razor clean every time.',
    portrait: '/assets/how-it-works/images/testimonial-marcus.jpg',
  },
  {
    id: 'aisha',
    name: 'Aisha Kapoor',
    tag: 'Home Cleaning · Holly Springs',
    quote:
      'Spotless every time and so easy to reschedule — the most reliable service we have ever used.',
    portrait: '/assets/how-it-works/images/testimonial-aisha.jpg',
  },
  {
    id: 'elena',
    name: 'Elena Ruiz',
    tag: 'Interior Painting · North Hills',
    quote:
      'Two rooms repainted over a weekend, edges perfect, zero mess left behind. Booking the hallway next.',
    portrait: '/assets/how-it-works/images/testimonial-elena.jpg',
  },
];
