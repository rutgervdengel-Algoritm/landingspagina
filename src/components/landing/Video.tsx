'use client';

import { useEffect, useRef } from 'react';

/**
 * Productvideo zonder geluid. Met `vanzelf` speelt hij af zodra hij in beeld komt en
 * pauzeert hij erbuiten, behalve bij "beperk beweging": dan start de bezoeker hem zelf.
 */
export default function Video({ src, poster, label, staand = false, vanzelf = false }: { src: string; poster: string; label: string; staand?: boolean; vanzelf?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!vanzelf || !v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.4 },
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, [vanzelf]);

  return (
    <video
      ref={ref}
      className={`block w-full bg-l-vlak ${staand ? 'aspect-[9/16]' : 'aspect-video'}`}
      src={src}
      poster={poster}
      muted
      playsInline
      loop={vanzelf}
      controls
      preload={vanzelf ? 'metadata' : 'none'}
      aria-label={label}
    />
  );
}
