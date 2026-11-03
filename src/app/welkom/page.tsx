import Link from 'next/link';
import { BRAND } from '@/lib/brand';

// Ingelogd, maar nog nergens aan gekoppeld.
export default function Welkom() {
  return (
    <main className="app px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-display text-2xl font-extrabold">{BRAND.name}</p>
        <h1 className="mt-10 text-4xl font-extrabold">Welkom. Wat kom je doen?</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/aan-de-slag" className="vlak block p-6 hover:border-inkt">
            <h2 className="text-xl font-extrabold">Ik beheer een wachtlijst</h2>
            <p className="mt-2 text-kalk">Voor een opvang, zwemschool, club of vereniging. In een paar minuten ingericht.</p>
          </Link>
          <div className="vlak p-6">
            <h2 className="text-xl font-extrabold">Ik sta op een wachtlijst</h2>
            <p className="mt-2 text-kalk">
              We vonden geen inschrijving bij dit e-mailadres. Log in met het adres dat je bij de organisatie hebt
              opgegeven, of vraag de organisatie om het te controleren.
            </p>
            <Link href="/login" className="knop-rustig knop-klein mt-4">
              Ander e-mailadres
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
