'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function BevestigKnop({ entryId }: { entryId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<'klaar' | 'bezig' | 'gedaan'>('klaar');
  async function bevestig() {
    setStatus('bezig');
    const { error } = await createClient().rpc('guardian_confirm_interest', { p_entry: entryId });
    setStatus(error ? 'klaar' : 'gedaan');
    router.refresh();
  }
  return status === 'gedaan' ? (
    <span className="font-bold text-zee" role="status">Interesse bevestigd</span>
  ) : (
    <button className="knop-rustig knop-klein" onClick={bevestig} disabled={status === 'bezig'}>Ik heb nog steeds interesse</button>
  );
}
