import type { APIRoute } from 'astro';
import { dogadaji, postavke } from '../lib/sadrzaj';

// iCalendar datoteka: župljani se mogu pretplatiti na kalendar na mobitelu.
const zidno = (d: Date) => d.toISOString().slice(0, 16).replace(/[-:]/g, '') + '00';
const dan = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');
const esc = (s = '') => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const preklopi = (linija: string) => linija.match(/.{1,73}/gu)?.join('\r\n ') ?? linija;

export const GET: APIRoute = async ({ site }) => {
  const p = await postavke();
  const host = site?.host ?? 'zupa';
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const linije = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${esc(p.naziv)}//HR`, 'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${esc(p.kratki_naziv)}`, 'X-WR-TIMEZONE:Europe/Zagreb',
  ];
  for (const e of await dogadaji()) {
    const { naslov, pocetak, kraj, cijeli_dan, mjesto, sazetak } = e.data;
    linije.push('BEGIN:VEVENT', `UID:${e.id}@${host}`, `DTSTAMP:${stamp}`);
    if (cijeli_dan) {
      linije.push(`DTSTART;VALUE=DATE:${dan(pocetak)}`, `DTEND;VALUE=DATE:${dan(new Date((kraj ?? pocetak).valueOf() + 86400000))}`);
    } else {
      linije.push(`DTSTART;TZID=Europe/Zagreb:${zidno(pocetak)}`, `DTEND;TZID=Europe/Zagreb:${zidno(kraj ?? new Date(pocetak.valueOf() + 3600000))}`);
    }
    linije.push(`SUMMARY:${esc(naslov)}`);
    if (mjesto) linije.push(`LOCATION:${esc(mjesto)}`);
    if (sazetak) linije.push(`DESCRIPTION:${esc(sazetak)}`);
    linije.push('END:VEVENT');
  }
  linije.push('END:VCALENDAR');
  return new Response(linije.map(preklopi).join('\r\n'), { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
