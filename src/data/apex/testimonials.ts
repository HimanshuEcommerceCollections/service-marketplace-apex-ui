// Testimonials data — transcribed verbatim from apex-hero-extracted.html.
// The original embedded the portraits as inline base64 in an `IMG` object; here
// they are externalized to files and referenced by path.

export interface Testimonial {
  id: string;
  /** name */
  n: string;
  /** role · location */
  r: string;
  /** quote */
  q: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 'priya',
    n: 'Priya Anand',
    r: 'Cleaning · North Hills',
    q: 'The same team every two weeks and my house has never looked better. Booking took literally 90 seconds.',
  },
  {
    id: 'maya',
    n: 'Maya Chen',
    r: 'Painting · Cary',
    q: 'Clean lines, zero mess, and the colour is exactly what I picked. They treated my home like their own.',
  },
  {
    id: 'daniel',
    n: 'Daniel Reyes',
    r: 'Handyman · Apex',
    q: 'One visit cleared a to-do list I had ignored for a year. Fair price up front, no surprises.',
  },
  {
    id: 'aisha',
    n: 'Aisha Kapoor',
    r: 'Home Cleaning · Holly Springs',
    q: 'Spotless every time and so easy to reschedule. The most reliable service we have ever used.',
  },
  {
    id: 'neha',
    n: 'Neha Sharma',
    r: 'Lawn Care · Wake Forest',
    q: 'Crisp stripes every single visit. My lawn is the best on the street and I never lift a finger.',
  },
];

/** id -> externalized portrait path (was inline base64 in the original). */
export const portraits: Record<string, string> = {
  priya: '/assets/images/portrait-priya.webp',
  maya: '/assets/images/portrait-maya.webp',
  daniel: '/assets/images/portrait-daniel.webp',
  aisha: '/assets/images/portrait-aisha.webp',
  neha: '/assets/images/portrait-neha.webp',
};
