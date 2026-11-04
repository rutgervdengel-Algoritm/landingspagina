import { BRAND } from '@/lib/brand';

/** Woordmerk met een klein volgnummer-ticket in de accentkleur van de pagina. */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="30" height="22" viewBox="0 0 30 22" aria-hidden="true">
        <path
          d="M4 0h22a4 4 0 0 1 4 4v4.2a2.8 2.8 0 0 0 0 5.6V18a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-4.2a2.8 2.8 0 0 0 0-5.6V4a4 4 0 0 1 4-4Z"
          style={{ fill: 'var(--l-accent, #FFC93C)' }}
        />
        <text x="15" y="15.5" textAnchor="middle" fontFamily="Bricolage Grotesque, system-ui, sans-serif" fontWeight="800" fontSize="12" style={{ fill: 'var(--l-accent-tekst, #14213D)' }}>
          1
        </text>
      </svg>
      <span className="font-display text-xl font-extrabold tracking-tight">{BRAND.name}</span>
    </span>
  );
}
