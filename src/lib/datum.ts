// Svi datumi u sadržaju su "zidno vrijeme" u Hrvatskoj (npr. 2026-12-03T18:00).
// Gradnja radi u UTC-u (vidi astro.config.mjs) pa ih uvijek formatiramo u UTC-u
// i dobivamo točno ono što je urednik upisao.
const TZ = 'UTC';
const L = 'hr-HR';

export const DANI_KRATKO = ['ned', 'pon', 'uto', 'sri', 'cet', 'pet', 'sub'] as const;
export const DANI_PUNO: Record<string, string> = {
  pon: 'ponedjeljak', uto: 'utorak', sri: 'srijeda', cet: 'četvrtak', pet: 'petak', sub: 'subota', ned: 'nedjelja',
};

export const datumDugi = (d: Date) =>
  new Intl.DateTimeFormat(L, { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);

export const datumSrednji = (d: Date) =>
  new Intl.DateTimeFormat(L, { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' }).format(d);

export const datumKratki = (d: Date) =>
  new Intl.DateTimeFormat(L, { timeZone: TZ, day: 'numeric', month: 'numeric', year: 'numeric' }).format(d);

export const danUTjednu = (d: Date) =>
  new Intl.DateTimeFormat(L, { timeZone: TZ, weekday: 'long' }).format(d);

export const danIMjesec = (d: Date) =>
  new Intl.DateTimeFormat(L, { timeZone: TZ, day: 'numeric', month: 'long' }).format(d);

export const mjesecKratko = (d: Date) =>
  new Intl.DateTimeFormat(L, { timeZone: TZ, month: 'short' }).format(d).replace('.', '');

export const vrijeme = (d: Date) =>
  `${d.getUTCHours()}:${String(d.getUTCMinutes()).padStart(2, '0')}`;

/** "2026-12-03T18:00" – za usporedbu s trenutnim vremenom u pregledniku. */
export const zidno = (d: Date) => d.toISOString().slice(0, 16);
export const isoDan = (d: Date) => d.toISOString().slice(0, 10);

export const velikoSlovo = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
