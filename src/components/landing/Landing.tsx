import Link from 'next/link';
import { positionInOffering } from '@/lib/matching/engine';
import { SECTORS } from '@/lib/matching/sectors';
import Volgnummer from '@/components/app/Volgnummer';
import Logo from './Logo';
import RijDemo from './RijDemo';
import AppVenster from './AppVenster';
import { Lock, MapPin, Smartphone } from 'lucide-react';
import PilotFormulier from './PilotFormulier';
import { DEMO_TODAY, FAQ, LANDING, type LandingSector } from './content';

/** Golfrand voor zwemles: de enige decoratie op die pagina. */
function Golf({ boven, onder }: { boven: string; onder: string }) {
  return (
    <div aria-hidden style={{ background: onder }} className="leading-[0]">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-8 w-full sm:h-12">
        <path d="M0 0h1440v28c-120 18-240 26-360 18S840 10 720 14 480 46 360 48 120 30 0 24Z" style={{ fill: boven }} />
      </svg>
    </div>
  );
}

const ZORG_KORT = [
  { kop: 'In Europa', tekst: 'Gegevens staan in een datacenter in Frankfurt.' },
  { kop: 'Gescheiden per organisatie', tekst: 'Elke organisatie ziet alleen haar eigen wachtlijst. Dat is in de database zelf afgedwongen.' },
  { kop: 'Elk besluit vastgelegd', tekst: 'Voorstellen, reacties en wijzigingen staan in een log dat niet te wijzigen is.' },
  { kop: 'Afspraken op papier', tekst: 'Voor de start van de pilot sluiten we samen een verwerkersovereenkomst.' },
];

const ZORG_OPVANG = [
  { kop: 'Rolverdeling', tekst: 'Jullie organisatie is verwerkingsverantwoordelijke, Eenplekje is verwerker. Dat staat in een verwerkersovereenkomst voordat er echte gegevens in gaan.' },
  { kop: 'Opslag in Europa', tekst: 'De database staat in een datacenter in Frankfurt.' },
  { kop: 'Afgeschermd per organisatie', tekst: 'Medewerkers zien alleen de wachtlijst van hun eigen organisatie. Dat is in de database zelf afgedwongen, niet alleen in het scherm.' },
  { kop: 'Ouders zien alleen hun eigen kind', tekst: 'Ouders loggen in met het e-mailadres dat bij jullie bekend is. Ze zien geen andere gezinnen en geen interne notities.' },
  { kop: 'Onwijzigbaar log', tekst: 'Elk voorstel, elke reactie en elke wijziging van regels staat met tijd, persoon en reden vast. Ook wij kunnen dat log niet aanpassen.' },
  { kop: 'Verwijderen bij stoppen', tekst: 'Stoppen jullie, dan verwijderen we alle gegevens van jullie organisatie.' },
];

const LOG_VOORBEELD = [
  { wanneer: '14 okt, 09:12', wie: 'Locatiemanager', wat: 'Plek vrijgekomen in Babygroep', waarom: 'Maandag en dinsdag, per 1 december' },
  { wanneer: '14 okt, 09:14', wie: 'Locatiemanager', wat: 'Voorstel gedaan', waarom: 'Hoogste plek volgens plaatsingsbeleid (89%)' },
  { wanneer: '15 okt, 20:41', wie: 'Ouder', wat: 'Voorstel geaccepteerd', waarom: '' },
];

/** Kop met het laatste woord omcirkeld, zoals in het oorspronkelijke ontwerp. */
function OmcirkeldeKop({ tekst }: { tekst: string }) {
  const woorden = tekst.replace(/\.$/, '').split(' ');
  const laatste = woorden.pop();
  return (
    <>
      {woorden.join(' ')}{' '}
      <span className="relative inline-block">
        <span className="relative z-10">{laatste}</span>
        <svg className="absolute -left-3 -right-3 -top-2 z-0 h-[calc(100%+16px)] w-[calc(100%+24px)]" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden>
          <ellipse cx="100" cy="40" rx="95" ry="35" fill="none" stroke="#5BA89D" strokeWidth="2" />
        </svg>
      </span>
      .
    </>
  );
}

export default function Landing({ sector, ontwerp }: { sector: LandingSector; ontwerp?: 'warm' }) {
  const s = LANDING[sector];
  const warm = ontwerp === 'warm';
  const opvang = sector === 'kinderopvang';
  const sport = sector === 'sport';
  const zwem = sector === 'zwemles';
  const positie = positionInOffering({
    sector,
    offering: s.demo.offering,
    entryId: s.demo.uitgelicht,
    entries: s.demo.entries,
    rules: s.demo.rules,
    today: DEMO_TODAY,
  });
  const meervoud = SECTORS[sector].participant.meervoud;
  const vragen = [...s.vragen, ...FAQ];

  return (
    <div className="landing min-h-screen" data-thema={warm ? 'opvang-warm' : sector}>
      <header className="sticky top-0 z-20 border-b border-l-lijn" style={{ background: 'color-mix(in srgb, var(--l-bg) 92%, transparent)', backdropFilter: 'blur(8px)' }}>
        {sport && <div className="h-1 bg-l-accent" aria-hidden />}
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="Eenplekje, naar de keuzepagina" className="flex items-center gap-3">
            <Logo />
            <span className="hidden border-l border-l-lijn pl-3 text-sm font-bold text-l-zacht sm:inline">voor {s.voor}</span>
          </Link>
          <nav aria-label="Hoofdmenu" className="flex items-center gap-1 sm:gap-2">
            <a href="#hoe" className="hidden rounded-md px-3 py-2 font-bold hover:bg-l-zacht2 md:inline-block">Hoe het werkt</a>
            <a href="#ouders" className="hidden rounded-md px-3 py-2 font-bold hover:bg-l-zacht2 md:inline-block">Voor ouders</a>
            <Link href="/login" className="rounded-md px-3 py-2 font-bold hover:bg-l-zacht2">Inloggen</Link>
            <a href="#pilot" className="l-knop-sterk whitespace-nowrap px-4 py-2 text-sm">
              {warm ? (<><span className="sm:hidden">Demo</span><span className="hidden sm:inline">Demo aanvragen</span></>) : opvang ? (<><span className="sm:hidden">Pilot</span><span className="hidden sm:inline">Pilot aanvragen</span></>) : 'Doe mee'}
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          style={sport ? { backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 119px, color-mix(in srgb, var(--l-sterk) 6%, transparent) 119px 120px)' } : undefined}
        >
          {warm && (
            <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none" aria-hidden>
              <path d="M-100,300 C200,100 400,500 700,250 C1000,0 1200,400 1540,200" stroke="#5BA89D" strokeWidth="3" />
            </svg>
          )}
          <div className={`relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:pb-24 lg:pt-20 ${opvang && !warm ? 'items-start' : 'items-center'}`}>
            <div className={`min-w-0 ${opvang && !warm ? 'lg:pt-16' : ''}`}>
              <h1
                className={`max-w-2xl font-extrabold ${sport ? 'text-[clamp(3rem,9vw,5.75rem)] leading-[0.92]' : opvang ? 'text-[clamp(2.4rem,6vw,4rem)] leading-[1.05]' : 'text-[clamp(2.4rem,6.5vw,4.25rem)] leading-[1.02]'}`}
              >
                {warm ? <OmcirkeldeKop tekst={s.titel} /> : s.titel}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-l-zacht sm:text-xl">{s.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#pilot" className={`${opvang ? 'l-knop-sterk' : 'l-knop-accent'} px-6 py-3 text-lg`}>{warm ? 'Demo aanvragen' : opvang ? 'Pilot aanvragen' : 'Doe mee met de pilot'}</a>
                <a href="#demo" className="l-knop-rustig px-6 py-3 text-lg">{warm ? 'Bekijk hoe het werkt' : 'Probeer de rij'}</a>
              </div>
              {warm && (
                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
                  {[
                    { icoon: MapPin, tekst: 'Gegevens in de EU' },
                    { icoon: Lock, tekst: 'Onwijzigbaar beslissingslog' },
                    { icoon: Smartphone, tekst: 'Geen app nodig voor ouders' },
                  ].map((t) => (
                    <li key={t.tekst} className="flex items-center gap-2">
                      <t.icoon size={18} style={{ color: '#5BA89D' }} aria-hidden />
                      {t.tekst}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-6 max-w-md text-sm text-l-zacht">{s.noot}</p>
            </div>
            {warm ? (
              <div className="mx-auto w-full max-w-md min-w-0 lg:mr-0">
                <AppVenster sector={sector} />
              </div>
            ) : (
            <div className="min-w-0">
              <div className={`mx-auto max-w-md lg:mr-0 ${zwem ? 'rotate-[-1.5deg]' : ''}`}>
                <p className="mb-1 pl-1 text-sm font-bold text-l-zacht">Dit ziet de ouder van {positie.candidate.participantName.split(' ')[0]}</p>
                <Volgnummer pos={positie} meervoud={meervoud} />
              </div>
              {opvang && (
                <div className="l-vlak mx-auto mt-5 max-w-md p-5 lg:mr-0">
                  <p className="text-sm font-bold text-l-zacht">Voorbeeld uit het beslissingslog</p>
                  <ol className="mt-3 grid gap-3 border-l-2 border-l-lijn pl-4">
                    {LOG_VOORBEELD.map((r) => (
                      <li key={r.wanneer}>
                        <p className="text-xs text-l-zacht">{r.wanneer}, {r.wie.toLowerCase()}</p>
                        <p className="font-bold">{r.wat}</p>
                        {r.waarom && <p className="text-sm text-l-zacht">{r.waarom}</p>}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
            )}
          </div>
        </section>

        {zwem && <Golf boven="var(--l-bg)" onder="var(--l-zachtvlak)" />}

        {/* Interactieve rij */}
        <section id="demo" className={`scroll-mt-20 bg-l-zacht2 ${zwem ? '' : 'border-y border-l-lijn'}`} style={{ ['--ticket-gat' as string]: 'var(--l-zachtvlak)' }}>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <h2 className={`max-w-2xl font-extrabold ${sport ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}>
              {opvang ? 'Zie hoe je plaatsingsbeleid uitpakt' : 'Zet de regels zoals jij wilt. De rij schuift mee.'}
            </h2>
            <p className="mt-3 max-w-2xl text-l-zacht">
              Bij een vrije plek telt eerst of iemand past: {opvang ? 'leeftijdsgroep en dagen' : sport ? 'leeftijd en trainingstijd' : 'niveau, leeftijd en lesmoment'}. Daarna bepalen de voorrangsregels de volgorde.
              Wat je hier instelt, is precies wat ouders als uitleg zien.
            </p>
            <div className="mt-8">
              <RijDemo sector={sector} />
            </div>
          </div>
        </section>

        {zwem && <Golf boven="var(--l-zachtvlak)" onder="var(--l-bg)" />}

        {/* Zo werkt het: een echte volgorde, dus genummerd */}
        <section id="hoe" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
          <h2 className={`font-extrabold ${sport ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}>Zo werkt het</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {s.stappen.map((stap, i) => (
              <li key={stap.kop} className="grid content-start gap-3">
                {sport ? (
                  <span className="font-lkop text-7xl font-extrabold leading-none text-l-accent" aria-hidden>{i + 1}</span>
                ) : opvang ? (
                  <span className="font-lkop text-3xl text-l-zacht" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-l-accent font-lkop text-2xl font-extrabold text-l-accent-tekst" aria-hidden>{i + 1}</span>
                )}
                <h3 className={`font-extrabold ${sport ? 'text-3xl' : 'text-xl'}`}><span className="sr-only">Stap {i + 1}: </span>{stap.kop}</h3>
                <p className="text-l-zacht">{stap.tekst}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Branchepunten */}
        <section className="border-t border-l-lijn bg-l-vlak">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <h2 className={`font-extrabold ${sport ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}>Gemaakt voor hoe {s.voor} werken</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {s.punten.map((p) => (
                <div key={p.kop} className={opvang ? 'border-t border-l-lijn pt-5' : ''}>
                  <h3 className={`font-extrabold ${sport ? 'text-2xl' : 'text-xl'}`}>{p.kop}</h3>
                  <p className="mt-2 text-l-zacht">{p.tekst}</p>
                </div>
              ))}
              {opvang && (
                <div className="border-t border-l-lijn pt-5 md:col-span-3 md:grid md:grid-cols-3 md:gap-8">
                  <h3 className="text-xl font-extrabold">Naast je planningssoftware</h3>
                  <p className="mt-2 text-l-zacht md:col-span-2 md:mt-0">
                    Eenplekje vervangt je planning of administratie niet. Je zet de wachtlijst erin met een export uit je huidige systeem of Excel.
                    Een koppeling met jullie systeem is er nog niet; die onderzoeken we samen als de pilot bevalt.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Voor ouders */}
        <section id="ouders" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className={`font-extrabold ${sport ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}>{s.ouders.kop}</h2>
              <p className="mt-3 max-w-xl text-l-zacht">{s.ouders.intro}</p>
            </div>
            <ul className="grid gap-5">
              {[
                { kop: 'Hun plek in de rij', tekst: 'Plus hoeveel anderen er wachten en wie er voor gaat, per regel uitgelegd.' },
                { kop: 'Inloggen zonder wachtwoord', tekst: 'Met een link in de mail, op het adres dat bij jullie bekend is. Geen app nodig.' },
                { kop: 'Reageren op een voorstel', tekst: 'Accepteren of afwijzen, met een duidelijke termijn. Een plek kan nooit aan twee gezinnen tegelijk worden gegeven.' },
                { kop: 'Alleen hun eigen gegevens', tekst: 'Ouders zien geen namen of gegevens van andere gezinnen, en ook niet jullie interne notities.' },
              ].map((p) => (
                <li key={p.kop} className="border-l-4 border-l-accent pl-4" style={opvang ? { borderLeftColor: 'var(--l-band-accent)' } : undefined}>
                  <h3 className="text-lg font-extrabold">{p.kop}</h3>
                  <p className="text-l-zacht">{p.tekst}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Zorgvuldigheid */}
        <section className="bg-l-band text-l-band-tekst">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <h2 className={`font-extrabold ${sport ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`} style={{ color: 'var(--l-band-tekst)' }}>
              {opvang ? 'Gegevens van kinderen, zorgvuldig geregeld' : 'Zorgvuldig met gegevens van kinderen'}
            </h2>
            <dl className={`mt-10 grid gap-8 sm:grid-cols-2 ${opvang ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
              {(opvang ? ZORG_OPVANG : ZORG_KORT).map((p) => (
                <div key={p.kop}>
                  <dt className="font-lkop text-xl font-extrabold text-l-band-accent">{p.kop}</dt>
                  <dd className="mt-2 opacity-85">{p.tekst}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Pilot */}
        <section id="pilot" className="scroll-mt-20 bg-l-zacht2">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:py-24">
            <div>
              <h2 className={`font-extrabold ${sport ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}>{opvang ? 'Een begeleide pilot' : 'Doe mee met de pilot'}</h2>
              <p className="mt-4 text-l-zacht">{s.pilot.intro}</p>
              {opvang ? (
                <ol className="mt-6 grid gap-4">
                  {s.pilot.punten.map((p, i) => (
                    <li key={p.kop} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3">
                      <span className="font-lkop text-2xl text-l-zacht" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <h3 className="text-lg font-extrabold"><span className="sr-only">Fase {i + 1}: </span>{p.kop}</h3>
                        <p className="text-l-zacht">{p.tekst}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="mt-6 grid gap-3">
                  {s.pilot.punten.map((p) => (
                    <li key={p.kop}><strong>{p.kop}</strong> {p.tekst}</li>
                  ))}
                </ul>
              )}
            </div>
            <PilotFormulier sector={sector} />
          </div>
        </section>

        {/* Vragen */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className={`font-extrabold ${sport ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}>Vragen</h2>
          <div className="mt-8 divide-y divide-l-lijn border-y border-l-lijn">
            {vragen.map((q) => (
              <details key={q.v} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                  {q.v}
                  <span aria-hidden className="text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-l-zacht">{q.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-l-lijn">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-l-zacht sm:px-6">
          <Logo className="text-l-tekst" />
          <nav aria-label="Voettekst" className="flex flex-wrap gap-x-5 gap-y-2">
            {(Object.keys(LANDING) as LandingSector[]).filter((k) => k !== sector).map((k) => (
              <Link key={k} href={LANDING[k].pad} className="hover:text-l-tekst">Eenplekje voor {LANDING[k].voor}</Link>
            ))}
            <Link href="/login" className="hover:text-l-tekst">Inloggen</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
