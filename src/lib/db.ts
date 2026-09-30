import fs from "fs";
import path from "path";
import { cache } from "react";
import { put, list } from "@vercel/blob";
import type { StoreData } from "./types";

const STORE_BLOB_PATH = "data/store.json";
const SEED_PATH = path.join(process.cwd(), "data", "store.json");

function readSeed(): StoreData {
  const raw = fs.readFileSync(SEED_PATH, "utf-8");
  return JSON.parse(raw) as StoreData;
}

async function fetchFromBlob(): Promise<StoreData | null> {
  try {
    const { blobs } = await list({ prefix: STORE_BLOB_PATH, limit: 10 });
    const match = blobs.find((b) => b.pathname === STORE_BLOB_PATH);
    if (!match) return null;
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as StoreData;
  } catch {
    return null;
  }
}

// Dedupe les lectures au sein d'une meme requete (utile pour les pages qui
// appellent plusieurs fonctions de queries.ts sur le meme rendu).
export const readStore = cache(async (): Promise<StoreData> => {
  const remote = await fetchFromBlob();
  if (remote) return remote;

  // Premier demarrage : le store n'existe pas encore sur Blob, on l'initialise
  // avec les donnees de demonstration livrees avec le projet.
  const seed = readSeed();
  await writeStore(seed);
  return seed;
});

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
