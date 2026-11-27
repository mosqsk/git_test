import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { obavijesti, postavke } from '../lib/sadrzaj';

export async function GET(context: APIContext) {
  const p = await postavke();
  const sve = await obavijesti();
  return rss({
    title: `Obavijesti – ${p.naziv}`,
    description: p.opis || p.naziv,
    site: context.site!,
    customData: '<language>hr</language>',
    items: sve.map((o) => ({
      title: o.data.naslov,
      pubDate: o.data.datum,
      description: o.data.sazetak,
      categories: [o.data.kategorija],
      link: `/obavijesti/${o.id}/`,
    })),
  });
}
