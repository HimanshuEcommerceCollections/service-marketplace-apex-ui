// Media for the Tree & Stump page. Assets live under
// public/assets/tree-stump/images/ and are named by their slot/role.
import type { MediaTile, HeroBigMedia } from '../../serviceContent';

export const heroBig: HeroBigMedia = {
  type: 'image',
  src: '/assets/tree-stump/images/hero-big.jpg',
  alt: 'Grinding out a stump with professional equipment in a backyard',
};

export const heroTiles: MediaTile[] = [
  { src: '/assets/tree-stump/images/hero-m1.jpg', alt: 'An arborist working a tree beside the chipper crew' },
  { src: '/assets/tree-stump/images/hero-m2.jpg', alt: 'Removing a large limb with a crane truck' },
  { src: '/assets/tree-stump/images/hero-m3.jpg', alt: 'A climber high in a mature tree during a removal' },
  { src: '/assets/tree-stump/images/hero-m4.jpg', alt: 'The crew grinding a stump and clearing debris' },
  { src: '/assets/tree-stump/images/hero-m5.jpg', alt: 'Cutting down a trunk section at golden hour' },
  { src: '/assets/tree-stump/images/hero-l1.jpg', alt: 'A tree-service crew and truck on a residential job' },
  { src: '/assets/tree-stump/images/hero-l2.jpg', alt: 'Coordinated tree removal in a backyard' },
];
