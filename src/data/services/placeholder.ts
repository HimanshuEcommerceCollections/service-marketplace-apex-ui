// Shared PLACEHOLDER media + testimonials for service pages that don't have their
// own design/assets yet. Reuses existing cleaning assets so the pages render with
// no broken images. Each new service's content.ts references these until the design
// team delivers real copy + assets.
//
// TODO(design): replace per-service with real hero media, cta video, and testimonials.
import type { MediaTile, HeroBigMedia, ServiceTestimonial } from '../serviceContent';

export const placeholderTiles: MediaTile[] = [
  { src: '/assets/cleaning/images/hero-m1.webp', alt: 'Apex home service' },
  { src: '/assets/cleaning/images/hero-m2.webp', alt: 'Apex home service' },
  { src: '/assets/cleaning/images/hero-m3.webp', alt: 'Apex home service' },
  { src: '/assets/cleaning/images/hero-m4.webp', alt: 'Apex home service' },
  { src: '/assets/cleaning/images/hero-m5.webp', alt: 'Apex home service' },
  { src: '/assets/cleaning/images/hero-l1.webp', alt: 'Apex home service' },
  { src: '/assets/cleaning/images/hero-l2.webp', alt: 'Apex home service' },
];

export const placeholderBigMedia: HeroBigMedia = {
  type: 'image',
  src: '/assets/cleaning/images/hero-m1.webp',
  alt: 'Apex home service',
};

export const placeholderTestimonials: ServiceTestimonial[] = [
  { name: 'Priya Anand', role: 'North Hills', quote: 'Booked in minutes and the same trusted team every time — exactly what I hoped for.', portrait: '/assets/images/portrait-priya.webp' },
  { name: 'Maya Chen', role: 'Cary', quote: 'Clean, professional and no surprises. They treated my home like their own.', portrait: '/assets/images/portrait-maya.webp' },
  { name: 'Daniel Reyes', role: 'Apex', quote: 'Fair price up front and done right the first time. I will use Apex again.', portrait: '/assets/images/portrait-daniel.webp' },
  { name: 'Aisha Kapoor', role: 'Holly Springs', quote: 'So easy to schedule and reschedule — the most reliable service we have used.', portrait: '/assets/images/portrait-aisha.webp' },
  { name: 'Neha Sharma', role: 'Wake Forest', quote: 'Reliable, tidy and friendly. My go-to for anything around the house.', portrait: '/assets/images/portrait-neha.webp' },
];
