import { liturgijskiDan, BOJE } from './liturgija';

const KLJUCEVI = ['ned', 'pon', 'uto', 'sri', 'cet', 'pet', 'sub'];

/** Trenutno vrijeme u Hrvatskoj kao "YYYY-MM-DDTHH:mm". */
export function sadaUHrvatskoj(): string {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Zagreb', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date()).map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

function pokreni() {
  const sada = sadaUHrvatskoj();
  const danasISO = sada.slice(0, 10);
  const danas = new Date(`${danasISO}T00:00:00Z`);
  const dan = KLJUCEVI[danas.getUTCDay()];

  // 1. Oznaka "danas" u rasporedu misa
  document.querySelectorAll<HTMLElement>('[data-dani]').forEach((el) => {
    const dani = (el.dataset.dani || '').split(' ');
    el.dataset.danas = String(dani.includes(dan));
  });

  // 2. Liturgijski dan
  const lit = liturgijskiDan(danas);
  document.documentElement.style.setProperty('--liturgijska', BOJE[lit.boja]);
  const datumTekst = new Intl.DateTimeFormat('hr-HR', {
    timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(danas);
  document.querySelectorAll<HTMLElement>('[data-liturgija]').forEach((el) => {
    const vrsta = el.dataset.liturgija;
    if (vrsta === 'datum') el.textContent = datumTekst.charAt(0).toUpperCase() + datumTekst.slice(1);
    else if (vrsta === 'naziv') el.textContent = lit.naziv;
    else if (vrsta === 'vrijeme') el.textContent = lit.vrijeme;
    else if (vrsta === 'boja') el.textContent = `Liturgijska boja: ${lit.boja}`;
  });

  // 3. Prošli događaji: sakrij ih iz popisa "nadolazeće" i označi sljedeći
  document.querySelectorAll<HTMLElement>('[data-nadolazece]').forEach((popis) => {
    const max = Number(popis.dataset.nadolazece) || 99;
    let prikazano = 0;
    popis.querySelectorAll<HTMLElement>('[data-kraj]').forEach((el) => {
      const prosao = (el.dataset.kraj || '') < sada;
      const vidljiv = !prosao && prikazano < max;
      el.hidden = !vidljiv;
      if (vidljiv) prikazano++;
    });
    const prazno = popis.querySelector<HTMLElement>('[data-prazno]');
    if (prazno) prazno.hidden = prikazano > 0;
  });

  // 4. Istaknuti sljedeći događaj
  document.querySelectorAll<HTMLElement>('[data-sljedeci]').forEach((okvir) => {
    const stavke = [...okvir.querySelectorAll<HTMLElement>('[data-kraj]')];
    const prvi = stavke.find((el) => (el.dataset.kraj || '') >= sada);
    stavke.forEach((el) => (el.hidden = el !== prvi));
    okvir.hidden = !prvi;
  });

  // 5. Oznaka "danas" i "sutra" uz datume
  const sutra = new Date(danas.valueOf() + 86400000).toISOString().slice(0, 10);
  document.querySelectorAll<HTMLElement>('[data-dan-iso]').forEach((el) => {
    const iso = el.dataset.danIso;
    const znak = el.querySelector<HTMLElement>('.relativni-dan');
    if (!znak) return;
    if (iso === danasISO) { znak.textContent = 'Danas'; znak.hidden = false; el.dataset.danas = 'true'; }
    else if (iso === sutra) { znak.textContent = 'Sutra'; znak.hidden = false; }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pokreni);
else pokreni();
