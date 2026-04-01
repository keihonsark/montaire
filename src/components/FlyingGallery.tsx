'use client';

import dynamic from 'next/dynamic';

const InfiniteGallery = dynamic(
  () => import('@/components/ui/3d-gallery-photography'),
  { ssr: false }
);

const jewelryImages = [
  { src: '/images/gallery/ring1.jpg', alt: 'Diamond ring' },
  { src: '/images/gallery/necklace1.jpg', alt: 'Gold necklace' },
  { src: '/images/gallery/ring2.jpg', alt: 'Engagement ring' },
  { src: '/images/gallery/jewelry1.jpg', alt: 'Jewelry collection' },
  { src: '/images/gallery/earrings1.jpg', alt: 'Diamond earrings' },
  { src: '/images/gallery/bracelet1.jpg', alt: 'Luxury bracelet' },
  { src: '/images/gallery/rings3.jpg', alt: 'Wedding rings' },
  { src: '/images/gallery/necklace2.jpg', alt: 'Pearl necklace' },
];

export default function FlyingGallery() {
  return (
    <section id="gallery-experience" className="relative w-full h-screen bg-[#0A0A0A]">
      <InfiniteGallery
        images={jewelryImages}
        speed={0.8}
        visibleCount={10}
        className="h-screen w-full"
        fadeSettings={{
          fadeIn: { start: 0.05, end: 0.2 },
          fadeOut: { start: 0.45, end: 0.5 },
        }}
        blurSettings={{
          blurIn: { start: 0.0, end: 0.1 },
          blurOut: { start: 0.4, end: 0.5 },
          maxBlur: 6.0,
        }}
      />
      {/* Overlay text */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center mix-blend-exclusion">
        <h2 className="font-bodoni text-5xl md:text-7xl text-white tracking-wide opacity-80">
          The Collection
        </h2>
      </div>
    </section>
  );
}
