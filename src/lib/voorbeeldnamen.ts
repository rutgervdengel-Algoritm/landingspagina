// Fictieve namen voor voorbeelddata, gemengd zoals in een gemiddelde
// Nederlandse wachtlijst. Elke positie geeft een andere combinatie.

const KINDEREN = [
  'Emma', 'Noah', 'Yara', 'Mohammed', 'Sofia', 'Liam', 'Amira', 'Daan', 'Zoë', 'Ayoub',
  'Lotte', 'Jayden', 'Fatima', 'Sem', 'Mila', 'Milan', 'Noor', 'Adam', 'Julia', 'Levi',
  'Elif', 'Finn', 'Saar', 'Rayan', 'Nora', 'Bilal', 'Tess', 'Kai', 'Lina', 'Omar',
];

const ACHTERNAMEN = [
  'de Jong', 'Yılmaz', 'Jansen', 'El Amrani', 'de Vries', 'Bakker', 'Kaya', 'van Dijk', 'Visser',
  'Benali', 'Smit', 'Pinas', 'Meijer', 'Nguyen', 'de Boer', 'Mulder', 'Kartosen', 'Bos', 'Haddou',
  'Vos', 'Peters', 'Bouzid', 'Hendriks', 'Dekker', 'Martens',
];

const OUDERS = [
  'Sanne', 'Ahmed', 'Lisa', 'Mehmet', 'Anouk', 'Karim', 'Iris', 'Thomas',
  'Esra', 'Mark', 'Nadia', 'Jeroen', 'Samira', 'Bas', 'Yvonne', 'Rachid',
];

export function voorbeeldNaam(n: number): { kind: string; ouder: string } {
  const achternaam = ACHTERNAMEN[(n * 7) % ACHTERNAMEN.length];
  return {
    kind: `${KINDEREN[n % KINDEREN.length]} ${achternaam}`,
    ouder: `${OUDERS[(n * 5 + 3) % OUDERS.length]} ${achternaam}`,
  };
}
