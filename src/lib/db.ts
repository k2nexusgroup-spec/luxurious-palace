import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";
import type { StoreData } from "./types";

const STORE_BLOB_PATH = "data/store.json";
const SEED_PATH = path.join(process.cwd(), "data", "store.json");

function readSeed(): StoreData {
  const raw = fs.readFileSync(SEED_PATH, "utf-8");
  return JSON.parse(raw) as StoreData;
}

// Ne retourne null QUE si le store n'existe vraiment pas encore sur Blob
// (premier demarrage). Toute autre erreur (reseau, API Blob indisponible...)
// est propagee telle quelle : on ne doit JAMAIS re-semer silencieusement les
// donnees de demonstration par-dessus de vraies donnees de production suite
// a un simple incident transitoire.
async function fetchExistingStore(): Promise<StoreData | null> {
  const { blobs } = await list({ prefix: STORE_BLOB_PATH, limit: 10 });
  const match = blobs.find((b) => b.pathname === STORE_BLOB_PATH);
  if (!match) return null;

  // Le CDN de Vercel Blob met les fichiers publics en cache (~60s) meme avec
  // cacheControlMaxAge:0. "uploadedAt" n'a qu'une precision a la seconde : deux
  // ecritures dans la meme seconde produiraient la meme URL et retomberaient
  // dans le cache. On utilise donc l'horodatage de LECTURE (toujours unique)
  // pour garantir un vrai cache miss a chaque appel, quitte a ne pas profiter
  // du cache pour ce petit fichier JSON.
  const bustedUrl = `${match.url}?v=${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const res = await fetch(bustedUrl, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Lecture du store Blob impossible (HTTP ${res.status})`);
  }
  return (await res.json()) as StoreData;
}

export async function readStore(): Promise<StoreData> {
  const existing = await fetchExistingStore();
  if (existing) return existing;

  // Le store n'existe vraiment pas encore : premier demarrage du site.
  // On l'initialise avec les donnees de demonstration livrees avec le projet.
  const seed = readSeed();
  await writeStore(seed);
  return seed;
}

export async function writeStore(data: StoreData): Promise<void> {
  await put(STORE_BLOB_PATH, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0
  });
}

export async function updateStore(mutator: (data: StoreData) => void): Promise<StoreData> {
  const data = await readStore();
  mutator(data);
  await writeStore(data);
  return data;
}
