import Link from 'next/link';
import Logo from './Logo';
import { LANDING, type LandingSector } from './content';

const KAART_KLEUR: Record<LandingSector, { bg: string; tekst: string; accent: string }> = {
  zwemles: { bg: '#E3F5F9', tekst: '#08344F', accent: '#57D3E8' },
  sport: { bg: '#E8F0E6', tekst: '#10281C', accent: '#FF7A33' },
  kinderopvang: { bg: '#F0EADF', tekst: '#2D5A4A', accent: '#C67B4B' },
};

/** Startpagina: kies je branche. Elke branche heeft een eigen pagina met eigen toon. */
export default function Keuze() {
  return (
    <div className="landing min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo />
        <Link href="/login" className="rounded-md px-3 py-2 font-bold hover:bg-l-zacht2">Inloggen</Link>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16">
        <h1 className="max-w-3xl text-[clamp(2.4rem,6.5vw,4.25rem)] font-extrabold leading-[1.02]">Iedereen op de wachtlijst ziet waar hij staat.</h1>
        <p className="mt-6 max-w-2xl text-lg text-l-zacht sm:text-xl">
          Eenplekje is een wachtlijst waarop ouders hun plek in de rij zien, met uitleg. Organisaties zien bij elke vrije plek direct wie aan de beurt is. Voor wie is het?
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {(Object.keys(LANDING) as LandingSector[]).map((k) => {
            const c = KAART_KLEUR[k];
            return (
              <li key={k}>
                <Link
                  href={LANDING[k].pad}
                  className="group flex h-full flex-col rounded-2xl p-6 transition-transform hover:-translate-y-0.5 sm:p-8"
                  style={{ background: c.bg, color: c.tekst }}
                >
                  <span className="mb-6 block h-2 w-12 rounded-full" style={{ background: c.accent }} aria-hidden />
                  <h2 className="text-3xl font-extrabold">{LANDING[k].naam}</h2>
                  <p className="mt-3 flex-1 opacity-80">{LANDING[k].kaart}</p>
                  <span className="mt-6 font-bold underline decoration-2 underline-offset-4">Voor {LANDING[k].voor}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 max-w-xl text-sm text-l-zacht">Eenplekje is nieuw. We zoeken per branche drie organisaties voor een pilot zonder kosten.</p>
      </main>
    </div>
  );
}
