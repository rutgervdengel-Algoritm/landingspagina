import { describe, expect, it } from 'vitest';
import { voorbeeldNaam } from './voorbeeldnamen';

describe('voorbeeldnamen', () => {
  it('geeft 30 verschillende voornamen en geen dubbele namen', () => {
    const namen = Array.from({ length: 30 }, (_, n) => voorbeeldNaam(n).kind);
    expect(new Set(namen.map((x) => x.split(' ')[0])).size).toBe(30);
    expect(new Set(namen).size).toBe(30);
  });
  it('ouder deelt de achternaam van het kind', () => {
    const { kind, ouder } = voorbeeldNaam(4);
    expect(kind.split(' ').slice(1).join(' ')).toBe(ouder.split(' ').slice(1).join(' '));
  });
});
