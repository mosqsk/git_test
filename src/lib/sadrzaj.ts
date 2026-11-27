import { getCollection, getEntry } from 'astro:content';

export async function postavke() {
  const p = await getEntry('postavke', 'zupa');
  if (!p) throw new Error('Nedostaje datoteka src/content/postavke/zupa.yml');
  return p.data;
}

export async function obavijesti() {
  return (await getCollection('obavijesti', (e) => e.data.objavljeno)).sort(
    (a, b) => b.data.datum.valueOf() - a.data.datum.valueOf(),
  );
}

export async function listici() {
  return (await getCollection('listici', (e) => e.data.objavljeno)).sort(
    (a, b) => b.data.tjedan_od.valueOf() - a.data.tjedan_od.valueOf(),
  );
}

export async function dogadaji() {
  return (await getCollection('dogadaji')).sort((a, b) => a.data.pocetak.valueOf() - b.data.pocetak.valueOf());
}

export const telHref = (t: string) => `tel:${t.replace(/[^\d+]/g, '')}`;
export const ibanRazmak = (iban: string) => iban.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
export const tekstIzMarkdowna = (md = '') =>
  md.replace(/[#*_>`|\-\[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
