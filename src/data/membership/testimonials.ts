// Testimonial carousel data for the membership plans page. Ported from the inline
// DATA array in apex-membership-plans_extracted.html (portraits were inline base64,
// now files). Order preserved so the default index (3 = Aisha) matches the source
// markup and the shared carousel logic.

export interface MembershipTestimonial {
  id: string;
  name: string;
  tag: string;
  quote: string;
  portrait: string;
}

export const testimonials: MembershipTestimonial[] = [
  {
    id: 'marisol',
    name: 'Marisol Vega',
    tag: 'Recurring Cleaning · Cary',
    quote:
      'Same two-person crew every visit, and they actually remember how I like things done. Worth every dollar.',
    portrait: '/assets/membership/images/testimonial-marisol.jpg',
  },
  {
    id: 'dana',
    name: 'Dana Whitfield',
    tag: 'Handyman · Apex',
    quote:
      'I booked one visit for six odd jobs around the house and every single one was done right. No callbacks needed.',
    portrait: '/assets/membership/images/testimonial-dana.jpg',
  },
  {
    id: 'marcus',
    name: 'Marcus Boone',
    tag: 'Lawn Care · Wake Forest',
    quote:
      'My lawn has never looked this sharp. They show up on schedule and the edging is razor clean every time.',
    portrait: '/assets/membership/images/testimonial-marcus.jpg',
  },
  {
    id: 'aisha',
    name: 'Aisha Kapoor',
    tag: 'Home Cleaning · Holly Springs',
    quote:
      'Spotless every time and so easy to reschedule — the most reliable service we have ever used.',
    portrait: '/assets/membership/images/testimonial-aisha.jpg',
  },
  {
    id: 'elena',
    name: 'Elena Ruiz',
    tag: 'Interior Painting · North Hills',
    quote:
      'Two rooms repainted over a weekend, edges perfect, zero mess left behind. Booking the hallway next.',
    portrait: '/assets/membership/images/testimonial-elena.jpg',
  },
];
