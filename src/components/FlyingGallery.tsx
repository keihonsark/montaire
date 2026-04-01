'use client';

import dynamic from 'next/dynamic';

const InfiniteGallery = dynamic(
  () => import('@/components/ui/3d-gallery-photography'),
  { ssr: false }
);

const jewelryImages = [
  { src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', alt: 'Diamond ring' },
  { src: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=800&auto=format&fit=crop&q=80', alt: 'Gold necklace' },
  { src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80', alt: 'Engagement ring' },
  { src: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80', alt: 'Jewelry collection' },
  { src: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80', alt: 'Diamond earrings' },
  { src: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80', alt: 'Luxury bracelet' },
  { src: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80', alt: 'Wedding rings' },
  { src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80', alt: 'Pearl necklace' },
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
