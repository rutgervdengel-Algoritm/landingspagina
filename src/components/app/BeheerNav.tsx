'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BeheerNav({ deelnemers, groepen }: { deelnemers: string; groepen: string }) {
  const path = usePathname();
  const items = [
    { href: '/beheer', label: 'Overzicht' },
    { href: '/beheer/plek', label: 'Plek vrijgekomen' },
    { href: '/beheer/inschrijvingen', label: `Wachtende ${deelnemers}` },
    { href: '/beheer/instellingen', label: `${groepen[0].toUpperCase()}${groepen.slice(1)} en regels` },
    { href: '/beheer/log', label: 'Beslissingslog' },
  ];
  return (
    <nav aria-label="Beheer" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
      {items.map((i) => {
        const actief = i.href === '/beheer' ? path === '/beheer' : path.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={actief ? 'page' : undefined}
            className={`whitespace-nowrap rounded-md px-3 py-2 font-bold ${actief ? 'bg-inkt text-papier' : 'text-inkt hover:bg-kalk-lichter'} ${i.href === '/beheer/plek' && !actief ? 'lg:bg-signaal-licht' : ''}`}
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
