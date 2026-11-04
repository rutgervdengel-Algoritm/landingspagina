import type { Entry, Offering, PriorityRule, Sector, Slot } from '@/lib/matching/types';
import { voorbeeldNaam } from '@/lib/voorbeeldnamen';

export type LandingSector = Exclude<Sector, 'overig'>;

export const DEMO_TODAY = '2026-11-04';

interface SectorLanding {
  pad: string;
  naam: string;
  voor: string; // "zwemscholen"
  intro: string;
  punten: { kop: string; tekst: string }[];
  demo: { offering: Offering; rules: PriorityRule[]; entries: Entry[]; uitgelicht: string };
}

function maandenGeleden(n: number) {
  const d = new Date(`${DEMO_TODAY}T12:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() - n);
  return d.toISOString().slice(0, 10);
}

function dagenGeleden(n: number) {
  const d = new Date(`${DEMO_TODAY}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString();
}

function maakEntries(
  start: number,
  rijen: { leeftijd: number; wacht: number; slots: Slot[]; level?: string; factoren?: Record<string, boolean>; min?: number }[],
): Entry[] {
  return rijen.map((r, i) => ({
    id: `d${start + i}`,
    participantName: voorbeeldNaam(start + i).kind,
    birthdate: maandenGeleden(r.leeftijd),
    preferredSlots: r.slots,
    minSlots: r.min ?? null,
    level: r.level ?? null,
    priorityFactors: r.factoren ?? {},
    registeredAt: dagenGeleden(r.wacht),
    status: 'wachtend',
  }));
}

const WO: Slot = { dag: 'wo', van: '15:00', tot: '15:45' };
const MA: Slot = { dag: 'ma', van: '16:00', tot: '16:45' };
const ZA: Slot = { dag: 'za', van: '09:00', tot: '10:00' };

export const LANDING: Record<LandingSector, SectorLanding> = {
  zwemles: {
    pad: '/zwemles',
    naam: 'Zwemles',
    voor: 'zwemscholen',
    intro:
      'Ouders zien op welke plek hun kind staat voor zwemles, en waarom. Jij ziet bij elk vrij lesmoment direct wie aan de beurt is, op niveau, leeftijd en jouw voorrangsregels.',
    punten: [
      { kop: 'Niveau en leeftijd zijn harde eisen', tekst: 'Een plek in groep A gaat nooit naar een kind dat al voor B zwemt of nog te jong is.' },
      { kop: 'Meerdere lesmomenten', tekst: 'Ouders geven aan welke tijden passen. Komt er één vrij, dan tellen alle kinderen mee voor wie die tijd werkt.' },
      { kop: 'Jouw volgorde', tekst: 'Inschrijfdatum, oudere kinderen eerst of broertjes en zusjes: jij bepaalt hoe zwaar elke regel weegt.' },
    ],
    demo: {
      uitgelicht: 'd3',
      offering: { id: 'z', name: 'Zwemles A, woensdag', minAgeMonths: 48, maxAgeMonths: 155, level: 'A', slots: [WO] },
      rules: [
        { id: 'wacht', type: 'wachttijd', label: 'Inschrijfdatum', weight: 60, active: true },
        { id: 'oud', type: 'leeftijd_oudst', label: 'Oudere kinderen eerst', weight: 30, active: true },
        { id: 'bz', type: 'kenmerk', label: 'Broertje of zusje zwemt al', factorKey: 'broer_zus', weight: 10, active: true },
      ],
      entries: maakEntries(0, [
        { leeftijd: 62, wacht: 290, slots: [WO], level: 'A' },
        { leeftijd: 80, wacht: 120, slots: [WO, MA], level: 'A', factoren: { broer_zus: true } },
        { leeftijd: 55, wacht: 340, slots: [WO], level: 'A' },
        { leeftijd: 71, wacht: 210, slots: [MA, WO], level: 'A' },
        { leeftijd: 95, wacht: 60, slots: [WO], level: 'A' },
        { leeftijd: 66, wacht: 150, slots: [WO], level: 'A', factoren: { broer_zus: true } },
        { leeftijd: 84, wacht: 260, slots: [WO], level: 'B' },
        { leeftijd: 58, wacht: 180, slots: [MA], level: 'A' },
      ]),
    },
  },
  sport: {
    pad: '/sport',
    naam: 'Sport',
    voor: 'sportclubs',
    intro:
      'Leden in spe zien op welke plek ze staan voor hun groep, en waarom. Jij ziet bij elke vrije plek direct wie aan de beurt is, op leeftijd, trainingstijd en de regels van je club.',
    punten: [
      { kop: 'Groepen per leeftijd', tekst: 'Een plek bij de 6- tot 8-jarigen gaat alleen naar kinderen die op dat moment die leeftijd hebben.' },
      { kop: 'Vaste trainingstijden', tekst: 'Wie niet op zaterdagochtend kan, komt niet in aanmerking voor de zaterdaggroep en ziet ook waarom.' },
      { kop: 'Clubregels zichtbaar', tekst: 'Voorrang voor broertjes en zusjes of inwoners van de gemeente staat er gewoon bij, zodat niemand zich gepasseerd voelt.' },
    ],
    demo: {
      uitgelicht: 'd12',
      offering: { id: 's', name: 'Judo 6 t/m 8 jaar', minAgeMonths: 72, maxAgeMonths: 107, slots: [ZA] },
      rules: [
        { id: 'wacht', type: 'wachttijd', label: 'Inschrijfdatum', weight: 60, active: true },
        { id: 'bz', type: 'kenmerk', label: 'Broertje of zusje is lid', factorKey: 'broer_zus', weight: 20, active: true },
        { id: 'inw', type: 'kenmerk', label: 'Woont in de gemeente', factorKey: 'inwoner', weight: 20, active: true },
      ],
      entries: maakEntries(10, [
        { leeftijd: 80, wacht: 250, slots: [ZA], factoren: { inwoner: true } },
        { leeftijd: 90, wacht: 100, slots: [ZA], factoren: { broer_zus: true, inwoner: true } },
        { leeftijd: 75, wacht: 320, slots: [ZA] },
        { leeftijd: 100, wacht: 190, slots: [ZA], factoren: { inwoner: true } },
        { leeftijd: 85, wacht: 140, slots: [ZA], factoren: { broer_zus: true } },
        { leeftijd: 78, wacht: 60, slots: [ZA], factoren: { inwoner: true } },
        { leeftijd: 112, wacht: 280, slots: [ZA], factoren: { inwoner: true } },
      ]),
    },
  },
  kinderopvang: {
    pad: '/kinderopvang',
    naam: 'Kinderopvang',
    voor: 'kinderopvang',
    intro:
      'Ouders zien op welke plek hun kind staat voor de opvang, en waarom. Jij ziet bij elke vrije plek direct wie aan de beurt is, op leeftijdsgroep, dagen en je plaatsingsbeleid.',
    punten: [
      { kop: 'Plaatsen per dag', tekst: 'Ouders geven hun dagen op en hoeveel dagen minimaal goed is. Een plek op maandag en dinsdag wordt dus ook voorgesteld aan wie drie dagen wil maar twee accepteert.' },
      { kop: 'Leeftijdsgroepen', tekst: 'Een babyplek gaat nooit naar een peuter. De leeftijd op de startdatum telt.' },
      { kop: 'Verantwoording', tekst: 'Elk voorstel en elke reactie staat met reden in een log dat niet te wijzigen is. Handig bij vragen van ouders.' },
    ],
    demo: {
      uitgelicht: 'd21',
      offering: { id: 'k', name: 'Babygroep', minAgeMonths: 0, maxAgeMonths: 18, slots: [{ dag: 'ma' }, { dag: 'di' }] },
      rules: [
        { id: 'wacht', type: 'wachttijd', label: 'Inschrijfdatum', weight: 50, active: true },
        { id: 'bz', type: 'kenmerk', label: 'Broertje of zusje op de locatie', factorKey: 'broer_zus', weight: 30, active: true },
        { id: 'pers', type: 'kenmerk', label: 'Kind van medewerker', factorKey: 'personeel', weight: 20, active: true },
      ],
      entries: maakEntries(20, [
        { leeftijd: 4, wacht: 300, slots: [{ dag: 'ma' }, { dag: 'di' }] },
        { leeftijd: 6, wacht: 200, slots: [{ dag: 'ma' }, { dag: 'di' }, { dag: 'do' }], min: 2 },
        { leeftijd: 3, wacht: 260, slots: [{ dag: 'ma' }, { dag: 'di' }], factoren: { broer_zus: true } },
        { leeftijd: 8, wacht: 90, slots: [{ dag: 'ma' }, { dag: 'di' }], factoren: { personeel: true } },
        { leeftijd: 5, wacht: 150, slots: [{ dag: 'di' }] },
        { leeftijd: 2, wacht: 330, slots: [{ dag: 'ma' }, { dag: 'di' }, { dag: 'vr' }] },
        { leeftijd: 22, wacht: 360, slots: [{ dag: 'ma' }, { dag: 'di' }] },
      ]),
    },
  },
};

export const FAQ = [
  {
    v: 'Wat kost het?',
    a: 'Tijdens de pilot niets. Daarna bepalen we samen een prijs die past bij wat het jou oplevert. Je zit nergens aan vast.',
  },
  {
    v: 'Moeten ouders een app installeren?',
    a: 'Nee. Ouders loggen in via een link in hun mail, op hun telefoon of computer. Een wachtwoord is niet nodig.',
  },
  {
    v: 'Kan ik mijn bestaande lijst gebruiken?',
    a: 'Ja. Je plakt je lijst uit Excel of Google Sheets. Kolommen als naam, geboortedatum, e-mail en inschrijfdatum worden herkend. Tijdens de pilot helpen we daarbij.',
  },
  {
    v: 'Wat als een ouder niet inlogt?',
    a: 'Dan werkt alles gewoon. Jij beheert de lijst en doet de voorstellen. Ouders die wel inloggen, zien waar ze staan en hoeven niet te bellen.',
  },
  {
    v: 'Hoe af is het?',
    a: 'Eenplekje is nieuw. De kern werkt: inrichten, je lijst erin zetten, de rij met uitleg, voorstellen doen en ouders die reageren. Automatische mails en een inschrijfformulier voor ouders bouwen we samen met de pilotdeelnemers.',
  },
];
