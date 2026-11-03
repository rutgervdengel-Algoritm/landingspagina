import { getOrgContext } from '@/lib/org';
import { ACTION_LABEL, type AuditRow } from '@/lib/db';

export default async function Log() {
  const { supabase, org } = await getOrgContext();
  const { data } = await supabase
    .from('audit_log')
    .select('id, actor_label, action, entity, entity_id, reason, metadata, created_at')
    .eq('org_id', org.id)
    .order('created_at', { ascending: false })
    .limit(300);
  const rows = (data ?? []) as AuditRow[];
  const fmt = new Intl.DateTimeFormat('nl-NL', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Amsterdam' });

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-extrabold">Beslissingslog</h1>
      <p className="mt-1 max-w-2xl text-kalk">Alles wat er met de wachtlijst gebeurt, wie het deed en waarom. Dit log kan niet worden gewijzigd of gewist.</p>
      {rows.length === 0 ? (
        <p className="vlak mt-8 p-6 text-kalk">Nog niets vastgelegd.</p>
      ) : (
        <ol className="mt-8 border-l-2 border-kalk-licht pl-6">
          {rows.map((r) => (
            <li key={r.id} className="relative pb-6">
              <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-papier bg-inkt" aria-hidden />
              <p className="text-sm text-kalk"><time dateTime={r.created_at}>{fmt.format(new Date(r.created_at))}</time>, {r.actor_label}</p>
              <p className="font-bold">{ACTION_LABEL[r.action] ?? r.action.replace(/_/g, ' ')}</p>
              {r.reason && <p className="text-kalk">Reden: {r.reason}</p>}
              {typeof r.metadata?.aantal === 'number' && <p className="text-kalk">{r.metadata.aantal as number} stuks</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
