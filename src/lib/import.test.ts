import { describe, expect, it } from 'vitest';
import { parseDatum, parseImport } from './import';

describe('import uit Excel', () => {
  it('herkent kolommen, scheidingstekens en Nederlandse datums', () => {
    const plak = 'Naam kind\tGeboortedatum\tOuder\tE-mail\tInschrijfdatum\tDagen\tBroer/zus\n' +
      'Saar de Wit\t15-06-2023\tMarieke\tMarieke@Voorbeeld.nl\t3-1-2025\tma, wo\tja\n' +
      'Daan Bos\t2023-02-01\tPeter\tpeter@voorbeeld.nl\t\t\t';
    const r = parseImport(plak);
    expect(r.errors).toEqual([]);
    expect(r.rows).toHaveLength(2);
    expect(r.rows[0]).toMatchObject({
      participant_name: 'Saar de Wit',
      participant_birthdate: '2023-06-15',
      guardian_email: 'marieke@voorbeeld.nl',
      registered_at: '2025-01-03T12:00:00Z',
      dagen: [{ dag: 'ma' }, { dag: 'wo' }],
      broer_zus: true,
    });
    expect(r.rows[1].registered_at).toBeNull();
  });

  it('meldt fouten per regel in plaats van stil over te slaan', () => {
    const r = parseImport('naam;email;geboortedatum\nNoor;geen-mail;1-1-2020\nFinn;f@x.nl;31-31-2020');
    expect(r.rows).toHaveLength(0);
    expect(r.errors.map((e) => e.regel)).toEqual([2, 3]);
  });

  it('weigert als verplichte kolommen ontbreken', () => {
    expect(parseImport('voornaam,telefoon\nA,06').errors[0].melding).toMatch(/naam/);
  });

  it('parseert datums streng', () => {
    expect(parseDatum('15/6/2023')).toBe('2023-06-15');
    expect(parseDatum('2023-6-5')).toBe('2023-06-05');
    expect(parseDatum('13-13-2023')).toBeNull();
  });
});
