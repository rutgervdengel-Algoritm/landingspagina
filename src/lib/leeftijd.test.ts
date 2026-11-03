import { describe, expect, it } from 'vitest';
import { leeftijdsbereik, totMaanden, vanafMaanden } from './leeftijd';

describe('leeftijd invoeren', () => {
  it('rekent jaren om naar maanden', () => {
    expect(vanafMaanden('4')).toBe(48);
    expect(vanafMaanden('1,5')).toBe(18);
    expect(totMaanden('8')).toBe(107);
    expect(totMaanden('1,5')).toBe(18);
    expect(totMaanden('')).toBeNull();
  });
  it('toont een leesbaar bereik', () => {
    expect(leeftijdsbereik(72, 107)).toBe('6 t/m 8 jaar');
    expect(leeftijdsbereik(0, 18)).toBe('t/m 1,5 jaar');
    expect(leeftijdsbereik(48, null)).toBe('vanaf 4 jaar');
  });
});
