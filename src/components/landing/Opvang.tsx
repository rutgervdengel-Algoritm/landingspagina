import Link from 'next/link';
import { Lock, MapPin, Smartphone } from 'lucide-react';
import Logo from './Logo';
import AppVenster from './AppVenster';
import DemoWissel from './DemoWissel';
import PilotFormulier from './PilotFormulier';
import { FAQ, LANDING, PAKKETTEN, ZORG_OPVANG } from './content';
import { BRAND } from '@/lib/brand';

const HERKENBAAR = [
  { vraag: '“Hoe staan we ervoor?”', tekst: 'Ouders bellen en mailen, en de planning kan er weinig over zeggen. Dat kost tijd en vertrouwen.' },
  { vraag: '“Waarom zij wel en wij niet?”', tekst: 'De volgorde hangt af van dagen, leeftijd en voorrang. Dat klopt, maar het is lastig uit te leggen.' },
  { vraag: '“Wie had dat voorstel ook alweer?”', tekst: 'Voorstellen lopen via mail en telefoon. Reageert een ouder niet, dan blijft de plek hangen.' },
];

const STAPPEN = [
  { kop: 'Leg je plaatsingsbeleid vast', tekst: 'Groepen per leeftijd en dag, en de voorrangsregels die je nu al hanteert: inschrijfdatum, broertjes en zusjes, doorstroom vanuit je eigen opvang.' },
  { kop: 'Zet je wachtlijst erin', tekst: 'Met een export uit je huidige pakket of Excel. Tijdens de pilot doen wij dat en controleer jij of de volgorde klopt.' },
  { kop: 'Plek vrij? Doe een voorstel', tekst: 'Je ziet wie volgens het beleid voorgaat en waarom. Het voorstel, de termijn en de reactie van de ouder liggen vast.' },
];

const OUDERS = [
  { kop: 'Hoe ze ervoor staan', tekst: 'Hun plek in de rij, hoeveel anderen er wachten en per regel hoe dat is bepaald.' },
  { kop: 'Inloggen zonder wachtwoord', tekst: 'Met een link in de mail, op het adres dat bij jullie bekend is. Geen app nodig.' },
  { kop: 'Reageren op een voorstel', tekst: 'Accepteren of afwijzen, met een duidelijke termijn. Een plek kan nooit aan twee gezinnen tegelijk worden gegeven.' },
  { kop: 'Alleen hun eigen gegevens', tekst: 'Geen namen of gegevens van andere gezinnen, en ook niet jullie interne notities.' },
];

export default function Opvang() {
  const kdv = LANDING.kinderopvang;
  const bso = LANDING.bso;
  // Vragen van beide pagina's samen, zonder dubbele.
  const vragen = [...bso.vragen.slice(0, 3), ...kdv.vragen, ...FAQ].filter((q, i, alle) => alle.findIndex((x) => x.v === q.v) === i);

  return (
    <div className="landing min-h-screen" data-thema="helder">
      <header className="sticky top-0 z-20 border-b border-l-lijn" style={{ background: 'color-mix(in srgb, var(--l-bg) 90%, transparent)', backdropFilter: 'blur(10px)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label={`${BRAND.name}, naar de startpagina`}><Logo /></Link>
          <nav aria-label="Hoofdmenu" className="flex items-center gap-1 sm:gap-2">
            <a href="#hoe" className="hidden rounded-full px-4 py-2 font-semibold hover:bg-l-zacht2 md:inline-block">Hoe het werkt</a>
            <a href="#ouders" className="hidden rounded-full px-4 py-2 font-semibold hover:bg-l-zacht2 md:inline-block">Voor ouders</a>
            <a href="#vragen" className="hidden rounded-full px-4 py-2 font-semibold hover:bg-l-zacht2 lg:inline-block">Vragen</a>
            <Link href="/login" className="rounded-full px-4 py-2 font-semibold hover:bg-l-zacht2">Inloggen</Link>
            <a href="#demo-aanvragen" className="l-knop-sterk whitespace-nowrap px-5 py-2.5">
              <span className="sm:hidden">Demo</span><span className="hidden sm:inline">Demo aanvragen</span>
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:pb-24 lg:pt-20">
          <div className="min-w-0">
            <p className="oog">Voor kinderopvang en BSO</p>
            <h1 className="mt-4 text-[clamp(2.6rem,7vw,4.5rem)]">Een wachtlijst die je kunt uitleggen.</h1>
            <p className="mt-6 max-w-xl text-lg text-l-zacht sm:text-xl">
              Bij elke vrije plek zie je wie volgens jullie plaatsingsbeleid voorgaat, en waarom. Elk besluit ligt vast. En ouders zien zelf hoe ze ervoor staan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#demo-aanvragen" className="l-knop-sterk px-7 py-3.5 text-lg">Demo aanvragen</a>
              <a href="#hoe" className="l-knop-rustig px-7 py-3.5 text-lg">Bekijk hoe het werkt</a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-l-zacht">
              {[
                { icoon: MapPin, tekst: 'Gegevens in de EU' },
                { icoon: Lock, tekst: 'Onwijzigbaar beslissingslog' },
                { icoon: Smartphone, tekst: 'Geen app nodig voor ouders' },
              ].map((t) => (
                <li key={t.tekst} className="flex items-center gap-2"><t.icoon size={18} aria-hidden />{t.tekst}</li>
              ))}
            </ul>
          </div>
          <div className="mx-auto w-full max-w-md min-w-0 lg:mr-0">
            <AppVenster sector="kinderopvang" />
          </div>
        </section>

        {/* Herkenbaar */}
        <section className="border-y border-l-lijn bg-l-vlak">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <p className="oog">Herkenbaar</p>
            <h2 className="mt-3 max-w-2xl text-3xl sm:text-5xl">Drie vragen die elke planner kent.</h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {HERKENBAAR.map((h) => (
                <li key={h.vraag} className="rounded-[1.25rem] bg-l-bg p-6">
                  <p className="font-lkop text-2xl font-semibold">{h.vraag}</p>
                  <p className="mt-3 text-l-zacht">{h.tekst}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Hoe het werkt */}
        <section id="hoe" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
          <p className="oog">Hoe het werkt</p>
          <h2 className="mt-3 max-w-2xl text-3xl sm:text-5xl">Van beleid op papier naar een rij die klopt.</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STAPPEN.map((stap, i) => (
              <li key={stap.kop} className="l-vlak p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-l-accent font-bold text-l-accent-tekst" aria-hidden>{i + 1}</span>
                <h3 className="mt-5 text-xl"><span className="sr-only">Stap {i + 1}: </span>{stap.kop}</h3>
                <p className="mt-2 text-l-zacht">{stap.tekst}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Interactieve rij */}
        <section id="demo" className="scroll-mt-20 border-y border-l-lijn bg-l-zacht2" style={{ ['--ticket-gat' as string]: 'var(--l-zachtvlak)' }}>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <p className="oog">Probeer het zelf</p>
            <h2 className="mt-3 max-w-2xl text-3xl sm:text-5xl">Zie hoe je plaatsingsbeleid uitpakt.</h2>
            <p className="mt-4 max-w-2xl text-l-zacht">
              Eerst telt of een kind past: leeftijdsgroep en dagen. Daarna bepalen jullie voorrangsregels de volgorde. Schuif met de regels en de rij schuift mee.
            </p>
            <div className="mt-8"><DemoWissel /></div>
          </div>
        </section>

        {/* Dagopvang en BSO */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="oog">Eén account</p>
          <h2 className="mt-3 max-w-3xl text-3xl sm:text-5xl">Dagopvang en BSO, elk met een eigen rij.</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {[
              { naam: 'Dagopvang en peuteropvang', punten: kdv.punten },
              { naam: 'BSO', punten: bso.punten },
            ].map((blok) => (
              <div key={blok.naam} className="l-vlak p-6 sm:p-8">
                <p className="pil text-sm">{blok.naam}</p>
                <dl className="mt-6 grid gap-6">
                  {blok.punten.map((p) => (
                    <div key={p.kop}>
                      <dt className="text-lg font-bold">{p.kop}</dt>
                      <dd className="mt-1 text-l-zacht">{p.tekst}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* Naast het huidige pakket */}
        <section aria-labelledby="pakket" className="border-y border-l-lijn bg-l-vlak">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-24">
            <p className="oog">Geen overstap</p>
            <h2 id="pakket" className="mt-3 text-3xl sm:text-5xl">Werkt naast het pakket dat je al hebt.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-l-zacht">
              Je planning, contracten en facturen blijven waar ze zijn. Stuur ons een export van je wachtlijst; wij zetten hem erin en jij controleert of de volgorde klopt.
            </p>
            <ul className="mt-10 flex flex-wrap justify-center gap-3" aria-label="Pakketten waaruit je een export kunt aanleveren">
              {PAKKETTEN.map((p) => (
                <li key={p} className="pil text-lg">{p}</li>
              ))}
              <li className="pil text-lg" style={{ borderStyle: 'dashed', borderWidth: 2, borderColor: 'var(--l-tekst)', background: 'transparent' }}>Of gewoon Excel</li>
            </ul>
            <p className="mx-auto mt-8 max-w-xl text-sm text-l-zacht">
              {BRAND.name} heeft geen koppeling met deze pakketten. Je levert een export aan en wij zetten die om. Een koppeling bouwen we als de pilot bevalt.
            </p>
          </div>
        </section>

        {/* Voor ouders */}
        <section id="ouders" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="oog">Voor ouders</p>
              <h2 className="mt-3 text-3xl sm:text-5xl">Minder vragen, meer vertrouwen.</h2>
              <p className="mt-4 max-w-xl text-l-zacht">
                Ouders willen vooral weten waar ze aan toe zijn en of het eerlijk gaat. Ze zien dezelfde regels en dezelfde berekening als jullie planning gebruikt.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {OUDERS.map((p) => (
                <li key={p.kop} className="l-vlak p-5">
                  <h3 className="text-lg">{p.kop}</h3>
                  <p className="mt-1 text-l-zacht">{p.tekst}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Zorgvuldigheid */}
        <section className="bg-l-band text-l-band-tekst">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <p className="oog" style={{ color: 'var(--l-band-accent)' }}>Privacy</p>
            <h2 className="mt-3 max-w-2xl text-3xl sm:text-5xl" style={{ color: 'var(--l-band-tekst)' }}>Gegevens van kinderen, zorgvuldig geregeld.</h2>
            <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ZORG_OPVANG.map((p) => (
                <div key={p.kop}>
                  <dt className="text-lg font-bold" style={{ color: 'var(--l-band-accent)' }}>{p.kop}</dt>
                  <dd className="mt-2 opacity-85">{p.tekst}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Demo en pilot */}
        <section id="demo-aanvragen" className="scroll-mt-20 bg-l-zacht2">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:py-24">
            <div>
              <p className="oog">Pilot zonder kosten</p>
              <h2 className="mt-3 text-3xl sm:text-5xl">Vraag een demo aan.</h2>
              <p className="mt-4 font-semibold">{BRAND.name} is nieuw. We zoeken drie opvangorganisaties voor een begeleide pilot van ongeveer drie maanden.</p>
              <p className="mt-2 text-l-zacht">We laten je zien hoe het werkt en kijken samen of het bij jullie past. Dit is ons voorstel voor het verloop.</p>
              <ol className="mt-8 grid gap-5">
                {kdv.pilot.punten.map((p, i) => (
                  <li key={p.kop} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-l-lijn bg-l-vlak text-sm font-bold" aria-hidden>{i + 1}</span>
                    <div>
                      <h3 className="text-lg"><span className="sr-only">Fase {i + 1}: </span>{p.kop}</h3>
                      <p className="text-l-zacht">{p.tekst}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <PilotFormulier sector="kinderopvang" cta="demo" />
          </div>
        </section>

        {/* Vragen */}
        <section id="vragen" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
          <p className="oog">Veelgestelde vragen</p>
          <h2 className="mt-3 text-3xl sm:text-5xl">Vragen.</h2>
          <div className="mt-8 divide-y divide-l-lijn border-y border-l-lijn">
            {vragen.map((q) => (
              <details key={q.v} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                  {q.v}
                  <span aria-hidden className="text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-l-zacht">{q.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-l-lijn bg-l-vlak">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-l-zacht sm:px-6">
          <div>
            <Logo className="text-l-tekst" />
            <p className="mt-2">{BRAND.name}: de wachtlijst voor kinderopvang en BSO.</p>
          </div>
          <nav aria-label="Voettekst" className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="#hoe" className="hover:text-l-tekst">Hoe het werkt</a>
            <a href="#demo-aanvragen" className="hover:text-l-tekst">Demo aanvragen</a>
            <Link href="/login" className="hover:text-l-tekst">Inloggen</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
