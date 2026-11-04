import Link from 'next/link';
import { positionInOffering } from '@/lib/matching/engine';
import { SECTORS } from '@/lib/matching/sectors';
import Volgnummer from '@/components/app/Volgnummer';
import Logo from './Logo';
import DemoKiezer from './DemoKiezer';
import PilotFormulier from './PilotFormulier';
import { DEMO_TODAY, FAQ, LANDING, type LandingSector } from './content';

const ALGEMEEN_INTRO =
  'Voor zwemscholen, sportclubs en kinderopvang. Ouders zien op welke plek ze staan en waarom. Jij ziet bij elke vrije plek direct wie aan de beurt is, volgens jouw regels.';

export default function Landing({ sector }: { sector: LandingSector | null }) {
  const s = sector ? LANDING[sector] : null;
  const heroSector: LandingSector = sector ?? 'zwemles';
  const hd = LANDING[heroSector].demo;
  const heroPositie = positionInOffering({
    sector: heroSector,
    offering: hd.offering,
    entryId: hd.uitgelicht,
    entries: hd.entries,
    rules: hd.rules,
    today: DEMO_TODAY,
  });
  const meervoud = SECTORS[heroSector].participant.meervoud;

  return (
    <div className="app">
      <header className="sticky top-0 z-20 border-b border-kalk-licht/70 bg-papier/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="Eenplekje, naar de startpagina"><Logo /></Link>
          <nav aria-label="Hoofdmenu" className="flex items-center gap-1 sm:gap-2">
            <a href="#hoe" className="hidden rounded-md px-3 py-2 font-bold hover:bg-kalk-lichter md:inline-block">Hoe het werkt</a>
            <a href="#ouders" className="hidden rounded-md px-3 py-2 font-bold hover:bg-kalk-lichter md:inline-block">Voor ouders</a>
            <Link href="/login" className="rounded-md px-3 py-2 font-bold hover:bg-kalk-lichter">Inloggen</Link>
            <a href="#pilot" className="knop-hoofd knop-klein">Doe mee</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero: de belofte, met het ticket dat een ouder ziet */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:pb-24 lg:pt-20">
          <div className="min-w-0">
            {s && <p className="mb-4 font-bold text-zee">Voor {s.voor}</p>}
            <h1 className="max-w-2xl text-[clamp(2.4rem,6.5vw,4.25rem)] font-extrabold leading-[1.02]" style={{ textWrap: 'balance' }}>
              Iedereen op de wachtlijst ziet waar hij staat.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-kalk sm:text-xl">{s ? s.intro : ALGEMEEN_INTRO}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#pilot" className="knop-signaal px-6 py-3 text-lg">Doe mee met de pilot</a>
              <a href="#demo" className="knop-rustig px-6 py-3 text-lg">Probeer de rij</a>
            </div>
            <p className="mt-6 max-w-md text-sm text-kalk">
              Eenplekje is nieuw. We zoeken drie aanbieders die de eerste versie gratis gebruiken en ons vertellen wat beter moet.
            </p>
          </div>
          <div className="min-w-0">
            <div className="mx-auto max-w-md rotate-[-1.5deg] lg:mr-0">
              <p className="mb-1 pl-1 text-sm font-bold text-kalk">Dit ziet de ouder van {heroPositie.candidate.participantName.split(' ')[0]}</p>
              <Volgnummer pos={heroPositie} meervoud={meervoud} />
            </div>
          </div>
        </section>

        {/* Interactieve rij */}
        <section id="demo" className="scroll-mt-20 border-y border-kalk-licht" style={{ background: '#F0F3F4', ['--ticket-gat' as string]: '#F0F3F4' }}>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <h2 className="max-w-2xl text-3xl font-extrabold sm:text-4xl">Zet de regels zoals jij wilt. De rij schuift mee.</h2>
            <p className="mt-3 max-w-2xl text-kalk">
              Bij een vrije plek telt eerst of iemand past: leeftijd, niveau en het moment. Daarna bepalen jouw voorrangsregels de volgorde.
              Wat jij instelt, is precies wat ouders als uitleg zien.
            </p>
            <div className="mt-8">
              <DemoKiezer start={heroSector} />
            </div>
          </div>
        </section>

        {/* Hoe het werkt: een echte volgorde, dus genummerd */}
        <section id="hoe" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Zo werkt het voor jou</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { kop: 'Richt je wachtlijst in', tekst: 'Kies je branche, voeg je groepen of lesmomenten toe en stel je voorrangsregels in met een paar schuifjes.' },
              { kop: 'Zet je lijst erin', tekst: 'Plak je bestaande lijst uit Excel of Google Sheets. Naam, geboortedatum, e-mail en inschrijfdatum worden herkend.' },
              { kop: 'Plek vrij? Doe een voorstel', tekst: 'Kies de groep en het moment. Je ziet wie aan de beurt is en waarom, en doet met één klik een voorstel. De ouder reageert online.' },
            ].map((stap, i) => (
              <li key={stap.kop} className="grid content-start gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-inkt font-display text-2xl font-extrabold text-papier">{i + 1}</span>
                <h3 className="text-xl font-extrabold">{stap.kop}</h3>
                <p className="text-kalk">{stap.tekst}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Branche-specifiek of overzicht van branches */}
        <section className="border-t border-kalk-licht bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            {s ? (
              <>
                <h2 className="text-3xl font-extrabold sm:text-4xl">Gemaakt voor hoe {s.voor} werken</h2>
                <div className="mt-10 grid gap-8 md:grid-cols-3">
                  {s.punten.map((p) => (
                    <div key={p.kop}>
                      <h3 className="text-xl font-extrabold">{p.kop}</h3>
                      <p className="mt-2 text-kalk">{p.tekst}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold sm:text-4xl">Eén wachtlijst, de taal van jouw branche</h2>
                <div className="mt-10 grid gap-5 md:grid-cols-3">
                  {(Object.keys(LANDING) as LandingSector[]).map((k) => (
                    <Link key={k} href={LANDING[k].pad} className="group rounded-2xl border border-kalk-licht p-6 hover:border-inkt">
                      <h3 className="text-2xl font-extrabold">{LANDING[k].naam}</h3>
                      <p className="mt-2 text-kalk">{LANDING[k].punten[0].tekst}</p>
                      <span className="mt-4 inline-block font-bold underline decoration-2 underline-offset-4 group-hover:decoration-signaal-diep">Meer over {LANDING[k].voor}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Voor ouders */}
        <section id="ouders" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Minder bellen, minder twijfel</h2>
              <p className="mt-3 max-w-xl text-kalk">
                De meeste vragen over een wachtlijst gaan over één ding: waar sta ik? Met Eenplekje kijken ouders dat zelf na, wanneer ze willen.
              </p>
            </div>
            <ul className="grid gap-5">
              {[
                { kop: 'Hun plek in de rij', tekst: 'Plus hoeveel anderen er wachten en wie er voor gaat, per regel uitgelegd.' },
                { kop: 'Inloggen zonder wachtwoord', tekst: 'Met een link in de mail, op het adres dat bij jou bekend is. Geen app nodig.' },
                { kop: 'Reageren op een voorstel', tekst: 'Accepteren of afwijzen, met een duidelijke termijn. Een plek kan nooit aan twee gezinnen tegelijk worden gegeven.' },
                { kop: 'Alleen hun eigen gegevens', tekst: 'Ouders zien geen namen of gegevens van andere gezinnen, en ook niet jullie interne notities.' },
              ].map((p) => (
                <li key={p.kop} className="border-l-4 border-signaal pl-4">
                  <h3 className="text-lg font-extrabold">{p.kop}</h3>
                  <p className="text-kalk">{p.tekst}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Zorgvuldigheid */}
        <section className="bg-inkt text-papier">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <h2 className="text-3xl font-extrabold text-papier sm:text-4xl">Zorgvuldig met gegevens van kinderen</h2>
            <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { kop: 'In Europa', tekst: 'Gegevens staan in een datacenter in Frankfurt.' },
                { kop: 'Gescheiden per organisatie', tekst: 'Elke organisatie ziet alleen haar eigen wachtlijst. Dat is in de database zelf afgedwongen.' },
                { kop: 'Elk besluit vastgelegd', tekst: 'Voorstellen, reacties en wijzigingen staan in een log dat niet te wijzigen is.' },
                { kop: 'Afspraken op papier', tekst: 'Voor de start van de pilot sluiten we samen een verwerkersovereenkomst.' },
              ].map((p) => (
                <div key={p.kop}>
                  <dt className="font-display text-xl font-extrabold text-signaal">{p.kop}</dt>
                  <dd className="mt-2 text-papier/80">{p.tekst}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Pilot */}
        <section id="pilot" className="scroll-mt-20 bg-signaal-licht">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:py-24">
            <div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Doe mee met de pilot</h2>
              <p className="mt-4 text-kalk">
                We zoeken drie {s ? s.voor : 'zwemscholen, sportclubs of opvangorganisaties'} met een wachtlijst die Eenplekje een paar maanden gratis gebruiken.
              </p>
              <ul className="mt-6 grid gap-3">
                <li><strong>Wij</strong> richten het samen met je in en zetten je lijst erin.</li>
                <li><strong>Jij</strong> gebruikt het bij echte vrije plekken en vertelt wat beter moet.</li>
                <li><strong>Samen</strong> bepalen we daarna of en voor welke prijs je doorgaat.</li>
              </ul>
            </div>
            <PilotFormulier sector={sector} />
          </div>
        </section>

        {/* Vragen */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Vragen</h2>
          <div className="mt-8 divide-y divide-kalk-licht border-y border-kalk-licht">
            {FAQ.map((q) => (
              <details key={q.v} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                  {q.v}
                  <span aria-hidden className="text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-kalk">{q.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-kalk-licht">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-kalk sm:px-6">
          <Logo className="text-inkt" />
          <nav aria-label="Voettekst" className="flex flex-wrap gap-x-5 gap-y-2">
            {(Object.keys(LANDING) as LandingSector[]).map((k) => (
              <Link key={k} href={LANDING[k].pad} className="hover:text-inkt">{LANDING[k].naam}</Link>
            ))}
            <Link href="/login" className="hover:text-inkt">Inloggen</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
