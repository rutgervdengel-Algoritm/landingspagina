import type { Entry, Offering, PriorityRule, Sector, Slot } from '@/lib/matching/types';
import { voorbeeldNaam } from '@/lib/voorbeeldnamen';

/** Een landingspagina. BSO is een eigen pagina, maar rekent als kinderopvang. */
export type LandingSector = Exclude<Sector, 'overig'> | 'bso';

/** Volgorde op de startpagina en in de voettekst: opvang en BSO eerst. */
export const VOLGORDE: LandingSector[] = ['kinderopvang', 'bso', 'zwemles', 'sport'];

/** Zwemles en sport staan los van de opvangsite: eigen adres, niet gelinkt vanaf de startpagina. */
export const ANDERE_BRANCHES: LandingSector[] = ['zwemles', 'sport'];

/** Pakketten waaruit opvangorganisaties een export kunnen aanleveren. Alleen namen, geen logo's:
 *  er is geen koppeling of samenwerking met deze leveranciers. */
export const PAKKETTEN = ['Flexkids', 'KidsVision', 'Portabase', 'Bitcare', 'KOVnet', 'KindPlanner', 'Jaamo', 'Kidsadmin', 'Proles'];

export const ZORG_OPVANG = [
  { kop: 'Rolverdeling', tekst: 'Jullie organisatie is verwerkingsverantwoordelijke, Eenplekje is verwerker. Dat staat in een verwerkersovereenkomst voordat er echte gegevens in gaan.' },
  { kop: 'Opslag in Europa', tekst: 'De database staat in een datacenter in Frankfurt.' },
  { kop: 'Afgeschermd per organisatie', tekst: 'Medewerkers zien alleen de wachtlijst van hun eigen organisatie. Dat is in de database zelf afgedwongen, niet alleen in het scherm.' },
  { kop: 'Ouders zien alleen hun eigen kind', tekst: 'Ouders loggen in met het e-mailadres dat bij jullie bekend is. Ze zien geen andere gezinnen en geen interne notities.' },
  { kop: 'Onwijzigbaar log', tekst: 'Elk voorstel, elke reactie en elke wijziging van regels staat met tijd, persoon en reden vast. Ook wij kunnen dat log niet aanpassen.' },
  { kop: 'Verwijderen bij stoppen', tekst: 'Stoppen jullie, dan verwijderen we alle gegevens van jullie organisatie.' },
];

export const DEMO_TODAY = '2026-11-04';

interface Blok { kop: string; tekst: string }

interface SectorLanding {
  pad: string;
  /** Branche waarmee de rekenregel werkt. */
  sector: Exclude<Sector, 'overig'>;
  naam: string;
  voor: string; // "zwemscholen"
  kaart: string; // korte zin op de keuzepagina
  titel: string;
  intro: string;
  noot: string;
  punten: Blok[];
  stappen: Blok[];
  ouders: { kop: string; intro: string };
  pilot: { intro: string; punten: Blok[] };
  vragen: { v: string; a: string }[];
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
    pad: '/branches/zwemles',
    sector: 'zwemles',
    naam: 'Zwemles',
    voor: 'zwemscholen',
    kaart: 'Lesgroepen per niveau en leeftijd, meerdere lesmomenten, minder telefoontjes aan het bad.',
    titel: 'Ouders zien zelf waar hun kind staat voor zwemles.',
    noot: 'Eenplekje is nieuw. We zoeken drie zwemscholen die de eerste versie gratis gebruiken en ons vertellen wat beter moet.',
    stappen: [
      { kop: 'Zet je lesgroepen erin', tekst: 'Per groep het niveau, de leeftijd en de lesmomenten. Je voorrangsregels stel je in met een paar schuifjes.' },
      { kop: 'Plak je wachtlijst', tekst: 'Uit Excel of Google Sheets. Naam, geboortedatum, e-mail en inschrijfdatum worden herkend.' },
      { kop: 'Lesplek vrij? Doe een voorstel', tekst: 'Kies de groep en het moment. Je ziet wie aan de beurt is en waarom. De ouder accepteert of wijst af via de app.' },
    ],
    ouders: { kop: 'Minder telefoontjes aan het bad', intro: 'De meeste vragen over een zwemwachtlijst gaan over één ding: wanneer is mijn kind aan de beurt? Met Eenplekje zien ouders zelf op welke plek ze staan en waarom.' },
    pilot: {
      intro: 'We zoeken drie zwemscholen met een wachtlijst die Eenplekje een paar maanden gratis gebruiken.',
      punten: [
        { kop: 'Wij', tekst: 'richten het samen met je in en zetten je lijst erin.' },
        { kop: 'Jij', tekst: 'gebruikt het bij echte vrije lesplekken en vertelt wat beter moet.' },
        { kop: 'Samen', tekst: 'bepalen we daarna of en voor welke prijs je doorgaat.' },
      ],
    },
    vragen: [
      { v: 'Werkt het met meerdere baden of locaties?', a: 'De basis ondersteunt meerdere locaties. Tijdens de pilot richten we die samen in.' },
      { v: 'Wat als een kind tussentijds een niveau omhoog gaat?', a: 'Dan pas je het niveau aan bij de inschrijving en telt het kind mee voor groepen op dat niveau. De wijziging staat in het log.' },
    ],
    intro:
      'Met de reden erbij, zodat ze niet meer hoeven te bellen. Jij ziet bij elk vrij lesmoment direct wie aan de beurt is, op niveau, leeftijd en jouw voorrangsregels.',
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
    pad: '/branches/sport',
    sector: 'sport',
    naam: 'Sport',
    voor: 'sportclubs',
    kaart: 'Groepen per leeftijd en trainingstijd, clubregels die iedereen kan zien.',
    titel: 'Een eerlijke wachtlijst voor je club.',
    intro:
      'Wachtende leden zien zelf op welke plek ze staan voor hun groep, en waarom. Wie de ledenadministratie doet, ziet bij elke vrije plek direct wie aan de beurt is, volgens de clubregels.',
    noot: 'Eenplekje is nieuw. We zoeken drie clubs die de eerste versie gratis gebruiken en ons vertellen wat beter moet.',
    stappen: [
      { kop: 'Zet je groepen erin', tekst: 'Per groep de leeftijd en de trainingstijden. De clubregels voor voorrang stel je in met een paar schuifjes.' },
      { kop: 'Plak je wachtlijst', tekst: 'Uit Excel of Google Sheets, ook als die nu bij één vrijwilliger op de laptop staat.' },
      { kop: 'Plek vrij? Doe een voorstel', tekst: 'Kies de groep. Je ziet wie er aan de beurt is en waarom, en doet met één klik een voorstel.' },
    ],
    ouders: { kop: 'Minder discussie over wie er eerst was', intro: 'Bij een volle club gaat het al snel over eerlijkheid. Met Eenplekje ziet iedereen dezelfde regels en zijn eigen plek in de rij.' },
    pilot: {
      intro: 'We zoeken drie sportclubs met een wachtlijst die Eenplekje een paar maanden gratis gebruiken.',
      punten: [
        { kop: 'Wij', tekst: 'richten het samen met je in en zetten je lijst erin.' },
        { kop: 'Jullie', tekst: 'gebruiken het bij echte vrije plekken en vertellen wat beter moet.' },
        { kop: 'Samen', tekst: 'bepalen we daarna of en voor welke prijs jullie doorgaan.' },
      ],
    },
    vragen: [
      { v: 'Ons bestuur wisselt elk jaar. Blijft de lijst bewaard?', a: 'Ja. De lijst staat niet meer bij één persoon, en elk besluit staat met reden in het log.' },
      { v: 'Kunnen we voorrang geven aan inwoners of broertjes en zusjes?', a: 'Ja. Dat zijn regels die je zelf aanzet en weegt. Wachtende leden zien welke regels er gelden.' },
    ],
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
    pad: '/',
    sector: 'kinderopvang',
    naam: 'Kinderopvang',
    voor: 'opvangorganisaties',
    kaart: 'Dagopvang en peuteropvang: plaatsingsbeleid vastleggen, elk besluit onderbouwen, ouders zelf laten meekijken.',
    titel: 'Een wachtlijst die je kunt uitleggen.',
    intro:
      'Leg je plaatsingsbeleid vast en zie bij elke vrije plek wie volgens dat beleid voorgaat, en waarom. Ouders zien zelf hun plek in de rij. Elk besluit staat in een log dat niet te wijzigen is.',
    noot: 'Eenplekje is een nieuw product. We zoeken drie opvangorganisaties voor een begeleide pilot van een paar maanden, zonder kosten.',
    stappen: [
      { kop: 'Leg je plaatsingsbeleid vast', tekst: 'Groepen per leeftijd en dag, en de voorrangsregels die je nu al hanteert, zoals broertjes en zusjes of kinderen van medewerkers.' },
      { kop: 'Zet je wachtlijst erin', tekst: 'Met een export uit je huidige systeem of Excel. Tijdens de pilot doen we dat samen en controleer jij het resultaat.' },
      { kop: 'Onderbouw elke plaatsing', tekst: 'Bij een vrije plek zie je wie volgens het beleid voorgaat en waarom. Het voorstel en de reactie van de ouder worden vastgelegd.' },
    ],
    ouders: { kop: 'Minder vragen, meer vertrouwen', intro: 'Ouders willen vooral weten waar ze staan en of het eerlijk gaat. Met Eenplekje zien ze hun plek in de rij en de regels die gelden, zonder dat ze gegevens van andere gezinnen zien.' },
    pilot: {
      intro: 'Een begeleide pilot van ongeveer drie maanden met één of twee locaties, zonder kosten. Dit is ons voorstel voor het verloop.',
      punten: [
        { kop: 'Kennismaking', tekst: 'We bespreken je plaatsingsbeleid en je wachtlijst, en sluiten een verwerkersovereenkomst.' },
        { kop: 'Inrichten', tekst: 'Wij zetten groepen, regels en je lijst erin. Jij controleert of de volgorde klopt met hoe je nu werkt.' },
        { kop: 'Gebruiken', tekst: 'Acht tot tien weken bij echte vrije plekken, met een korte check-in per week.' },
        { kop: 'Evalueren', tekst: 'Samen kijken naar tijdsbesteding, vragen van ouders en ervaring van je team. Daarna besluit je of je doorgaat.' },
      ],
    },
    vragen: [
      { v: 'Werkt het naast onze planningssoftware?', a: 'Ja. Eenplekje vervangt je planning of administratie niet. Je stuurt ons een export van je wachtlijst uit bijvoorbeeld Flexkids, Bitcare, KOVnet of Excel, en wij zetten die erin. Een koppeling is er nog niet; die bouwen we als de pilot bevalt.' },
      { v: 'Wie is verantwoordelijk voor de gegevens?', a: 'Jullie organisatie blijft verwerkingsverantwoordelijke. Eenplekje is verwerker. Dat leggen we vast in een verwerkersovereenkomst voordat er echte gegevens in gaan.' },
      { v: 'Wat gebeurt er met de gegevens als we stoppen?', a: 'Dan verwijderen we alle gegevens van jullie organisatie, inclusief het beslissingslog. Een export voor je eigen archief maken we vooraf samen.' },
    ],
    punten: [
      { kop: 'Plaatsen per dag', tekst: 'Ouders geven hun dagen op en hoeveel dagen minimaal goed is. Een plek op maandag en dinsdag wordt dus ook voorgesteld aan wie drie dagen wil maar twee accepteert.' },
      { kop: 'Inschrijven voor de geboorte', tekst: 'Een babyplek gaat nooit naar een peuter. Wie zich tijdens de zwangerschap inschrijft, ziet de plek in de rij vanaf de gewenste startdatum.' },
      { kop: 'Verantwoording', tekst: 'Elk voorstel en elke reactie staat met reden in een log dat niet te wijzigen is. Handig bij vragen van ouders.' },
    ],
    demo: {
      uitgelicht: 'd23',
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
  bso: {
    pad: '/',
    sector: 'kinderopvang',
    naam: 'BSO',
    voor: 'BSO-locaties',
    kaart: 'Volle en rustige dagen, doorstroom vanuit de dagopvang, ouders die zelf zien waar ze staan.',
    titel: 'Een BSO-wachtlijst die je kunt uitleggen.',
    intro:
      'Zie bij elke vrije BSO-dag wie volgens je plaatsingsbeleid voorgaat, en waarom. Ouders zien zelf hun plek in de rij, ook als hun kind pas over een jaar vier wordt.',
    noot: 'Eenplekje is een nieuw product. We zoeken drie opvangorganisaties met een BSO-wachtlijst voor een begeleide pilot van een paar maanden, zonder kosten.',
    stappen: [
      { kop: 'Leg je plaatsingsbeleid vast', tekst: 'Groepen per leeftijd en dag, en de voorrangsregels die je nu al hanteert, zoals broertjes en zusjes of doorstroom vanuit je eigen dagopvang.' },
      { kop: 'Zet je wachtlijst erin', tekst: 'Met een export uit je huidige systeem of Excel. Tijdens de pilot doen we dat samen en controleer jij het resultaat.' },
      { kop: 'Dag vrij? Doe een voorstel', tekst: 'Kies de groep en de dagen die vrijkomen. Je ziet wie volgens het beleid voorgaat en waarom. Het voorstel en de reactie van de ouder worden vastgelegd.' },
    ],
    ouders: { kop: 'Minder vragen, meer vertrouwen', intro: 'Rond de start van het schooljaar willen ouders vooral weten of er op tijd plek is. Met Eenplekje zien ze hun plek in de rij en de regels die gelden, zonder dat ze gegevens van andere gezinnen zien.' },
    pilot: {
      intro: 'Een begeleide pilot van ongeveer drie maanden met één of twee BSO-locaties, zonder kosten. Dit is ons voorstel voor het verloop.',
      punten: [
        { kop: 'Kennismaking', tekst: 'We bespreken je plaatsingsbeleid en je wachtlijst, en sluiten een verwerkersovereenkomst.' },
        { kop: 'Inrichten', tekst: 'Wij zetten groepen, regels en je lijst erin. Jij controleert of de volgorde klopt met hoe je nu werkt.' },
        { kop: 'Gebruiken', tekst: 'Acht tot tien weken bij echte vrije plekken, met een korte check-in per week.' },
        { kop: 'Evalueren', tekst: 'Samen kijken naar tijdsbesteding, vragen van ouders en ervaring van je team. Daarna besluit je of je doorgaat.' },
      ],
    },
    vragen: [
      { v: 'Kunnen dagopvang en BSO in één account?', a: 'Ja. Het zijn groepen binnen dezelfde organisatie, elk met een eigen rij. De voorrangsregels gelden voor de hele organisatie.' },
      { v: 'We halen kinderen op van meerdere scholen. Kan dat?', a: 'Ja. Maak per school of per basisgroep een eigen groep, met eigen dagen en leeftijden. Elke groep heeft een eigen rij.' },
      { v: 'Werkt het ook voor vakantieopvang of flexibele dagen?', a: 'Nog niet. Eenplekje gaat nu over vaste dagen per week. Vakantieopvang en losse dagen pakken we op als pilotdeelnemers daar behoefte aan hebben.' },
      { v: 'Werkt het naast onze planningssoftware?', a: 'Ja. Eenplekje vervangt je planning of administratie niet. Je stuurt ons een export van je wachtlijst uit bijvoorbeeld Flexkids, Bitcare, KOVnet of Excel, en wij zetten die erin. Een koppeling is er nog niet; die bouwen we als de pilot bevalt.' },
      { v: 'Wie is verantwoordelijk voor de gegevens?', a: 'Jullie organisatie blijft verwerkingsverantwoordelijke. Eenplekje is verwerker. Dat leggen we vast in een verwerkersovereenkomst voordat er echte gegevens in gaan.' },
    ],
    punten: [
      { kop: 'Plaatsen per dag', tekst: 'Zit de dinsdag vol en is er op vrijdag nog ruimte? Ouders geven hun dagen op en hoeveel dagen minimaal goed is. Zo stel je ook een plek voor aan wie drie dagen wil maar met twee geholpen is.' },
      { kop: 'Vanaf de vierde verjaardag', tekst: 'Ouders schrijven ruim van tevoren in. Een kind van drie komt nog niet in aanmerking voor een plek van nu, maar de ouder ziet wel de plek in de rij vanaf de dag dat het kind vier wordt.' },
      { kop: 'Doorstroom als regel', tekst: 'Geef je voorrang aan kinderen die al bij je dagopvang of peuteropvang zitten? Zet die regel aan en bepaal hoe zwaar hij weegt. Ouders zien welke regels gelden.' },
    ],
    demo: {
      uitgelicht: 'd31',
      offering: { id: 'b', name: 'BSO 4 t/m 7 jaar', minAgeMonths: 48, maxAgeMonths: 95, slots: [{ dag: 'di' }, { dag: 'do' }] },
      rules: [
        { id: 'wacht', type: 'wachttijd', label: 'Inschrijfdatum', weight: 50, active: true },
        { id: 'bz', type: 'kenmerk', label: 'Broertje of zusje op de locatie', factorKey: 'broer_zus', weight: 25, active: true },
        { id: 'door', type: 'kenmerk', label: 'Stroomt door vanuit onze eigen opvang', factorKey: 'doorstroom', weight: 25, active: true },
      ],
      entries: maakEntries(30, [
        { leeftijd: 52, wacht: 400, slots: [{ dag: 'di' }, { dag: 'do' }] },
        { leeftijd: 49, wacht: 520, slots: [{ dag: 'ma' }, { dag: 'di' }, { dag: 'do' }], min: 2, factoren: { doorstroom: true } },
        { leeftijd: 60, wacht: 210, slots: [{ dag: 'di' }, { dag: 'do' }], factoren: { broer_zus: true } },
        { leeftijd: 75, wacht: 150, slots: [{ dag: 'di' }] },
        { leeftijd: 44, wacht: 600, slots: [{ dag: 'di' }, { dag: 'do' }], factoren: { doorstroom: true } },
        { leeftijd: 66, wacht: 320, slots: [{ dag: 'ma' }, { dag: 'wo' }] },
        { leeftijd: 58, wacht: 90, slots: [{ dag: 'di' }, { dag: 'do' }], factoren: { broer_zus: true, doorstroom: true } },
      ]),
    },
  },
};

export const FAQ = [
  {
    v: 'Wat kost het?',
    a: 'Tijdens de pilot niets. Daarna bepalen we samen een prijs die past bij wat het oplevert. Je zit nergens aan vast.',
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
