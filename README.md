# Mrežna stranica župe

Brza, jednostavna stranica župe koju župnik ili tajnica mogu svakodnevno uređivati **bez programiranja**, preko sučelja na adresi `/admin`.

- **Astro** (statička stranica) + **Tailwind CSS**
- **Sveltia CMS** (kompatibilan s Decap CMS-om) za uređivanje sadržaja
- Sadržaj se čuva kao obične datoteke (Markdown/YAML) u ovom repozitoriju
- Hosting: **Netlify** ili **Cloudflare Pages**; stranica se sama objavi nakon svake izmjene (1–2 minute)

> Sav primjerni sadržaj označen je s **[PRIMJER]**. Zamijenite ga pravim podacima prije objave.

---

## Što stranica sadrži

| Stranica | Adresa | Što prikazuje |
| --- | --- | --- |
| Naslovnica | `/` | Raspored misa s oznakom **Danas**, ispovijed, kontakt, liturgijski dan i boja, sljedeći događaj, 4 zadnje obavijesti, aktualni listić |
| Župne obavijesti | `/obavijesti/` | Sve obavijesti s **pretragom** i filtrom po temi, dijeljenje i ispis |
| Tjedni listići | `/listici/` | Arhiva po godinama, misne nakane po danima, PDF prilog |
| Kalendar | `/kalendar/` | Mjesečni kalendar događanja + pretplata na mobitelu (`/kalendar.ics`) |
| Sakramenti | `/sakramenti/` | Krštenje, prva pričest, krizma, vjenčanje, bolesničko pomazanje: upute i dokumenti |
| Zajednice i aktivnosti | `/zajednice/` | Zborovi, ministranti, čitači, Caritas, molitvene zajednice, vjeronauk |
| O župi | `/o-zupi/` | Povijest, zaštitnik, sadašnji i prijašnji svećenici, galerija |
| Kontakt i ured | `/kontakt/` | Adresa, karta (OpenStreetMap), telefon, e-mail, radno vrijeme, IBAN s gumbom **Kopiraj** |
| RSS | `/rss.xml` | Obavijesti za čitače vijesti |

Liturgijski dan, oznaka „Danas” i skrivanje prošlih događaja računaju se u pregledniku po hrvatskom vremenu, pa su uvijek točni i bez ponovne objave.

---

## Svakodnevno uređivanje (za župnika i tajnicu)

1. Otvorite `https://VASA-STRANICA/admin/` i kliknite **Prijava s GitHubom** (Sign in with GitHub).
2. Lijevo odaberite što uređujete.

### Objaviti obavijest (2 minute)
1. **Obavijesti → Novo** (New).
2. Upišite **Naslov**, **Kratki sažetak** (jedna-dvije rečenice) i po želji tekst i sliku.
3. Uključite **Istakni na naslovnici** ako je važno.
4. Kliknite **Spremi** (Save). Za 1–2 minute obavijest je na stranici.

### Novi tjedni listić
1. **Tjedni listići → Novo**.
2. Upišite naziv nedjelje, datume tjedna, dodajte **Misne nakane** (dan, vrijeme, nakana) i obavijesti u tjednu.
3. Po želji priložite PDF listića. Spremite.

Savjet: otvorite prošlotjedni listić, i u izborniku odaberite **Dupliciraj** (Duplicate). Promijenite samo datume i nakane.

### Događaj u kalendaru
**Događaji (kalendar) → Novo**: naziv, početak, (završetak), mjesto. Događaj se sam pojavi na naslovnici i u kalendaru, a nestane kad prođe.

### Promijeniti raspored misa, kontakt ili IBAN
**Postavke župe → Podaci o župi, mise i kontakt**. Promjena vrijedi na svim stranicama odjednom.
Kod rasporeda misa označite **Dane na koje vrijedi** da bi oznaka „Danas” radila.

### Slike
Slike se pri učitavanju **automatski smanjuju** (najviše 1600 px) i pretvaraju u WebP, pa se mogu slati izravno s mobitela.

Jezik sučelja: Sveltia CMS prati jezik preglednika. Ako se ne prikaže hrvatski, promijenite ga u postavkama sučelja (ikona korisnika → Settings → Language).

---

## Hosting i prijava urednika

Potrebno je jednom postaviti. Odaberite **A (Netlify, najjednostavnije)** ili **B (Cloudflare Pages)**.

### A) Netlify
1. Na [netlify.com](https://www.netlify.com) se prijavite GitHub računom.
2. **Add new site → Import an existing project → GitHub** → odaberite ovaj repozitorij.
   Postavke gradnje upisane su u `netlify.toml` (naredba `npm run build`, mapa `dist`). Kliknite **Deploy**.
3. **Prijava u /admin preko GitHuba**:
   - Na GitHubu: **Settings → Developer settings → OAuth Apps → New OAuth App**.
     - *Homepage URL*: adresa vaše stranice (`https://zupa-sv-marije-magdalene.netlify.app`)
     - *Authorization callback URL*: `https://api.netlify.com/auth/done`
   - Kopirajte **Client ID** i stvorite **Client secret**.
   - Na Netlifyju: **Site configuration → Access & security → OAuth → Install provider → GitHub**, zalijepite ID i secret.
4. U `public/admin/config.yml` već su upisani `repo: mosqsk/git_test`, `branch: main` i `site_url` (adresa stranice). Ako se repozitorij ili adresa promijene, ažurirajte ih ondje.
5. Varijablu `SITE_URL` **ne treba** postavljati: Netlify sam daje adresu stranice. Potrebna je tek kada dodate vlastitu domenu (vidi niže).

### B) Cloudflare Pages
1. Na [dash.cloudflare.com](https://dash.cloudflare.com): **Workers & Pages → Create → Pages → Connect to Git** → odaberite repozitorij.
   - Framework preset: **Astro**, build command `npm run build`, output `dist`.
   - Environment variable: `NODE_VERSION = 22`, `SITE_URL = https://vasa-adresa`.
2. Za prijavu urednika postavite besplatni [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) (gumb **Deploy to Cloudflare Workers** u njegovim uputama) i GitHub OAuth App s callback adresom `https://<vaš-worker>.workers.dev/callback`.
3. U `public/admin/config.yml` odkomentirajte `base_url:` i upišite adresu workera.

### Tko smije uređivati
Urednik treba GitHub račun koji je dodan kao **suradnik (collaborator)** na repozitorij: GitHub → repozitorij → **Settings → Collaborators → Add people**.

### Vlastita domena
U Netlifyju ili Cloudflareu dodajte domenu (npr. `zupa-sunja.hr`) pod **Domains** i slijedite upute za DNS. Zatim novu adresu upišite u `site_url` u `public/admin/config.yml` i postavite varijablu okoline `SITE_URL` na istu adresu.

---

## Za tehničku osobu

```bash
npm install
npm run dev      # lokalno na http://localhost:4321
npm run build    # gradnja u mapu dist/
```

- Sadržaj: `src/content/` (obavijesti, listići, događaji, sakramenti, zajednice, svećenici, stranice, postavke)
- Sheme sadržaja: `src/content.config.ts`
- Stranice: `src/pages/`, zajednički dijelovi: `src/components/`, izgled: `src/styles/global.css`
- Postavke uređivača: `public/admin/config.yml`
- Liturgijski kalendar (vrijeme, boja, veći blagdani): `src/scripts/liturgija.ts`
- Datumi se upisuju kao hrvatsko vrijeme (`2026-12-03T18:00`); gradnja radi u UTC-u da se sati ne pomiču.
- Lokalno uređivanje bez prijave: otvorite `http://localhost:4321/admin/` u Chromeu/Edgeu i odaberite **Radi s lokalnim repozitorijem** (Work with Local Repository).

Inspiracija za strukturu: sagud.xyz, sveti-ivan.hr, zupa-svete-obitelji.hr. Dizajn, tekstovi i slike su izvorni.
