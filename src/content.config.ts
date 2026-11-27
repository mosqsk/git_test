import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const DANI = ['pon', 'uto', 'sri', 'cet', 'pet', 'sub', 'ned'] as const;

const opcionalniTekst = z.string().optional().nullable().transform((v) => v ?? '');

/** Postavke župe: jedno mjesto za podatke koji se prikazuju svuda. */
const postavke = defineCollection({
  loader: glob({ pattern: '*.{yml,yaml}', base: './src/content/postavke' }),
  schema: z.object({
    naziv: z.string(),
    kratki_naziv: z.string(),
    podnaslov: opcionalniTekst,
    biskupija: opcionalniTekst,
    logo: opcionalniTekst,
    logo_biskupije: opcionalniTekst,
    poveznica_biskupije: opcionalniTekst,
    opis: opcionalniTekst,
    adresa: z.object({
      ulica: z.string(),
      mjesto: z.string(),
      postanski_broj: opcionalniTekst,
      lat: z.coerce.number(),
      lng: z.coerce.number(),
    }),
    telefon: opcionalniTekst,
    mobitel: opcionalniTekst,
    email: opcionalniTekst,
    iban: opcionalniTekst,
    primatelj: opcionalniTekst,
    banka: opcionalniTekst,
    oib: opcionalniTekst,
    facebook: opcionalniTekst,
    youtube: opcionalniTekst,
    raspored_misa: z
      .array(
        z.object({
          oznaka: z.string(),
          dani: z.array(z.enum(DANI)).default([]),
          vremena: z.array(z.coerce.string()).default([]),
          napomena: opcionalniTekst,
        }),
      )
      .default([]),
    ispovijed: z
      .array(z.object({ kada: z.string(), napomena: opcionalniTekst }))
      .default([]),
    radno_vrijeme_ureda: z
      .array(z.object({ dani: z.string(), vrijeme: z.string() }))
      .default([]),
    napomena_ureda: opcionalniTekst,
  }),
});

const obavijesti = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/obavijesti' }),
  schema: z.object({
    naslov: z.string(),
    datum: z.coerce.date(),
    sazetak: opcionalniTekst,
    kategorija: z.string().default('Obavijest'),
    slika: opcionalniTekst,
    istaknuto: z.boolean().default(false),
    objavljeno: z.boolean().default(true),
  }),
});

const listici = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/listici' }),
  schema: z.object({
    naslov: z.string(),
    tjedan_od: z.coerce.date(),
    tjedan_do: z.coerce.date(),
    liturgijski_naslov: opcionalniTekst,
    nakane: z
      .array(
        z.object({
          datum: z.coerce.date(),
          vrijeme: z.coerce.string(),
          nakana: z.string(),
        }),
      )
      .default([]),
    pdf: opcionalniTekst,
    objavljeno: z.boolean().default(true),
  }),
});

const dogadaji = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dogadaji' }),
  schema: z.object({
    naslov: z.string(),
    pocetak: z.coerce.date(),
    kraj: z.coerce.date().optional().nullable(),
    cijeli_dan: z.boolean().default(false),
    mjesto: opcionalniTekst,
    vrsta: z.string().default('Događaj'),
    sazetak: opcionalniTekst,
  }),
});

const sakramenti = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sakramenti' }),
  schema: z.object({
    naziv: z.string(),
    redoslijed: z.coerce.number().default(10),
    kratko: opcionalniTekst,
    dokumenti: z.array(z.string()).default([]),
    kome_se_javiti: opcionalniTekst,
    rok: opcionalniTekst,
  }),
});

const zajednice = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/zajednice' }),
  schema: z.object({
    naziv: z.string(),
    vrsta: z.string().default('Zajednica'),
    redoslijed: z.coerce.number().default(10),
    voditelj: opcionalniTekst,
    termin: opcionalniTekst,
    mjesto: opcionalniTekst,
    kontakt: opcionalniTekst,
    slika: opcionalniTekst,
    sazetak: opcionalniTekst,
  }),
});

const svecenici = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/svecenici' }),
  schema: z.object({
    ime: z.string(),
    sluzba: z.string().default('župnik'),
    od: z.coerce.number().optional().nullable(),
    do: z.coerce.number().optional().nullable(),
    sadasnji: z.boolean().default(false),
    slika: opcionalniTekst,
    napomena: opcionalniTekst,
  }),
});

const stranice = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stranice' }),
  schema: z.object({
    naslov: z.string(),
    uvod: opcionalniTekst,
    zastitnik: opcionalniTekst,
    dan_proslave: opcionalniTekst,
    o_zastitniku: opcionalniTekst,
    slika: opcionalniTekst,
    galerija: z
      .array(z.object({ slika: z.string(), opis: opcionalniTekst }))
      .default([]),
  }),
});

const crkve = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/crkve' }),
  schema: z.object({
    naziv: z.string(),
    mjesto: opcionalniTekst,
    redoslijed: z.coerce.number().default(10),
    slika: opcionalniTekst,
    opis_slike: opcionalniTekst,
  }),
});

export const collections = { crkve, postavke, obavijesti, listici, dogadaji, sakramenti, zajednice, svecenici, stranice };
