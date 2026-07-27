// Media for the Home Security page. Assets live under
// public/assets/home-security/images/ and are named by their slot/role.
import type { MediaTile, HeroBigMedia } from '../../serviceContent';

export const heroBig: HeroBigMedia = {
  type: 'image',
  src: '/assets/home-security/images/hero-big.jpg',
  alt: 'A smart doorbell and camera with a live view on a phone',
};

export const heroTiles: MediaTile[] = [
  { src: '/assets/home-security/images/hero-m1.jpg', alt: 'A family checking their home security app from the couch' },
  { src: '/assets/home-security/images/hero-m2.jpg', alt: 'A security camera and smart lock installed at a doorway' },
  { src: '/assets/home-security/images/hero-m3.jpg', alt: 'Motion-activated lighting across a home exterior at dusk' },
  { src: '/assets/home-security/images/hero-m4.jpg', alt: 'Keypad entry and a camera at a modern front entrance' },
  { src: '/assets/home-security/images/hero-m5.jpg', alt: 'Cameras keeping watch over a home after dark' },
  { src: '/assets/home-security/images/hero-l1.jpg', alt: 'Outdoor cameras covering the property at dusk' },
  { src: '/assets/home-security/images/hero-l2.jpg', alt: 'A close-up of installed security hardware' },
];
