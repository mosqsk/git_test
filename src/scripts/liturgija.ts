// Izračun liturgijskog vremena, boje i većih blagdana za zadani dan (rimski kalendar, Hrvatska).
// Radi u pregledniku, pa je "danas" uvijek točan i bez ponovne objave stranice.

export type Boja = 'zelena' | 'ljubičasta' | 'bijela' | 'crvena' | 'ružičasta';

export const BOJE: Record<Boja, string> = {
  zelena: '#2f6b3a',
  ljubičasta: '#5b3a7a',
  bijela: '#a5822f', // bijelu prikazujemo zlatnom da bude vidljiva na svijetloj pozadini
  crvena: '#a51e22',
  ružičasta: '#b4587a',
};

export interface LiturgijskiDan {
  naziv: string; // npr. "Prva nedjelja došašća" ili "Vrijeme kroz godinu"
  vrijeme: string; // liturgijsko vrijeme
  boja: Boja;
  blagdan: boolean;
}

const DAN = 86400000;
const d = (g: number, m: number, dan: number) => new Date(Date.UTC(g, m - 1, dan));
const plus = (x: Date, dana: number) => new Date(x.valueOf() + dana * DAN);
const razlikaDana = (a: Date, b: Date) => Math.round((a.valueOf() - b.valueOf()) / DAN);
const kljuc = (x: Date) => `${x.getUTCMonth() + 1}-${x.getUTCDate()}`;
const isti = (a: Date, b: Date) => razlikaDana(a, b) === 0;

function uskrs(g: number) {
  const a = g % 19, b = Math.floor(g / 100), c = g % 100;
  const dd = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), gg = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - dd - gg + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mj = Math.floor((h + l - 7 * m + 114) / 31), dan = ((h + l - 7 * m + 114) % 31) + 1;
  return d(g, mj, dan);
}

function prvaNedjeljaDosasca(g: number) {
  const bozic = d(g, 12, 25);
  const dow = bozic.getUTCDay(); // 0 = nedjelja
  return plus(bozic, -(dow === 0 ? 7 : dow) - 21);
}

function krstenjeGospodinovo(g: number) {
  const bogojavljenje = d(g, 1, 6);
  const dow = bogojavljenje.getUTCDay();
  return plus(bogojavljenje, dow === 0 ? 7 : 7 - dow);
}

const STALNI: Record<string, [string, Boja]> = {
  '1-1': ['Svetkovina Svete Bogorodice Marije', 'bijela'],
  '1-6': ['Bogojavljenje – Sveta tri kralja', 'bijela'],
  '2-2': ['Prikazanje Gospodinovo – Svijećnica', 'bijela'],
  '3-19': ['Sveti Josip, zaručnik BDM', 'bijela'],
  '3-25': ['Navještenje Gospodinovo – Blagovijest', 'bijela'],
  '5-1': ['Sveti Josip Radnik', 'bijela'],
  '6-24': ['Rođenje svetog Ivana Krstitelja', 'bijela'],
  '6-29': ['Sveti Petar i Pavao, apostoli', 'crvena'],
  '8-6': ['Preobraženje Gospodinovo', 'bijela'],
  '8-15': ['Uznesenje Blažene Djevice Marije – Velika Gospa', 'bijela'],
  '9-8': ['Rođenje Blažene Djevice Marije – Mala Gospa', 'bijela'],
  '9-14': ['Uzvišenje svetog Križa', 'crvena'],
  '11-1': ['Svi sveti', 'bijela'],
  '11-2': ['Spomen svih vjernih mrtvih – Dušni dan', 'ljubičasta'],
  '12-6': ['Sveti Nikola, biskup', 'bijela'],
  '12-8': ['Bezgrješno začeće Blažene Djevice Marije', 'bijela'],
  '12-24': ['Badnjak', 'ljubičasta'],
  '12-25': ['Božić – Rođenje Gospodinovo', 'bijela'],
  '12-26': ['Sveti Stjepan, prvomučenik', 'crvena'],
  '12-27': ['Sveti Ivan, apostol i evanđelist', 'bijela'],
  '12-28': ['Nevina dječica, mučenici', 'crvena'],
};

const REDNI = ['', 'Prva', 'Druga', 'Treća', 'Četvrta', 'Peta', 'Šesta'];

export function liturgijskiDan(danas: Date): LiturgijskiDan {
  const g = danas.getUTCFullYear();
  const nedjelja = danas.getUTCDay() === 0;
  const U = uskrs(g);
  const pepelnica = plus(U, -46);
  const duhovi = plus(U, 49);
  const dosasce = prvaNedjeljaDosasca(g);
  const krstenje = krstenjeGospodinovo(g);
  const bozic = d(g, 12, 25);

  // Pomični blagdani
  const pomicni: [Date, string, Boja][] = [
    [pepelnica, 'Čista srijeda – Pepelnica', 'ljubičasta'],
    [plus(U, -7), 'Cvjetnica – Nedjelja Muke Gospodnje', 'crvena'],
    [plus(U, -3), 'Veliki četvrtak', 'bijela'],
    [plus(U, -2), 'Veliki petak – Muka Gospodnja', 'crvena'],
    [plus(U, -1), 'Velika subota', 'ljubičasta'],
    [U, 'Uskrs – Nedjelja Uskrsnuća Gospodnjega', 'bijela'],
    [plus(U, 1), 'Uskrsni ponedjeljak', 'bijela'],
    [plus(U, 7), 'Druga vazmena nedjelja – Nedjelja Božjega milosrđa', 'bijela'],
    [plus(U, 39), 'Uzašašće Gospodinovo – Spasovo', 'bijela'],
    [duhovi, 'Duhovi – Pedesetnica', 'crvena'],
    [plus(U, 50), 'Blažena Djevica Marija, Majka Crkve', 'bijela'],
    [plus(U, 56), 'Presveto Trojstvo', 'bijela'],
    [plus(U, 60), 'Tijelovo – Presveto Tijelo i Krv Kristova', 'bijela'],
    [plus(U, 68), 'Presveto Srce Isusovo', 'bijela'],
    [plus(dosasce, -7), 'Isus Krist, Kralj svega stvorenja', 'bijela'],
    [krstenje, 'Krštenje Gospodinovo', 'bijela'],
  ];
  // Sveta obitelj: nedjelja u božićnoj osmini, a ako je nema, 30. prosinca
  const dowBozic = bozic.getUTCDay();
  pomicni.push([dowBozic === 0 ? d(g, 12, 30) : plus(bozic, 7 - dowBozic), 'Sveta obitelj Isusa, Marije i Josipa', 'bijela']);

  // Liturgijsko vrijeme
  let vrijeme = 'Vrijeme kroz godinu';
  let boja: Boja = 'zelena';
  let naziv = '';

  if (danas >= dosasce && danas < bozic) {
    vrijeme = 'Došašće';
    boja = 'ljubičasta';
    const tj = Math.floor(razlikaDana(danas, dosasce) / 7) + 1;
    if (nedjelja) {
      naziv = `${REDNI[tj]} nedjelja došašća`;
      if (tj === 3) boja = 'ružičasta';
    }
  } else if (danas >= bozic || danas <= krstenje) {
    vrijeme = 'Božićno vrijeme';
    boja = 'bijela';
  } else if (danas >= pepelnica && danas < plus(U, -3)) {
    vrijeme = 'Korizma';
    boja = 'ljubičasta';
    if (nedjelja) {
      const tj = Math.floor(razlikaDana(danas, plus(pepelnica, 4)) / 7) + 1;
      if (tj >= 1 && tj <= 5) {
        naziv = `${REDNI[tj]} korizmena nedjelja`;
        if (tj === 4) boja = 'ružičasta';
      }
    }
  } else if (danas >= plus(U, -3) && danas < U) {
    vrijeme = 'Vazmeno trodnevlje';
    boja = 'crvena';
  } else if (danas >= U && danas <= duhovi) {
    vrijeme = 'Vazmeno vrijeme';
    boja = 'bijela';
    if (nedjelja) {
      const tj = razlikaDana(danas, U) / 7 + 1;
      if (tj >= 3 && tj <= 7) naziv = `${REDNI[tj] ?? tj + '.'} vazmena nedjelja`;
    }
  } else if (nedjelja) {
    const n = danas < pepelnica
      ? Math.floor(razlikaDana(danas, krstenje) / 7) + 1
      : 34 - razlikaDana(plus(dosasce, -7), danas) / 7;
    naziv = `${n}. nedjelja kroz godinu`;
  }

  let blagdan = false;
  const pomicni_ = pomicni.find(([x]) => isti(x, danas));
  const stalni = STALNI[kljuc(danas)];
  const izuzetak = vrijeme === 'Korizma' || vrijeme === 'Vazmeno trodnevlje';
  if (pomicni_) {
    [, naziv, boja] = pomicni_;
    blagdan = true;
  } else if (stalni && !(izuzetak && nedjelja)) {
    [naziv, boja] = stalni;
    blagdan = true;
  }

  return { naziv: naziv || vrijeme, vrijeme, boja, blagdan };
}
