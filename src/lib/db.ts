import fs from "fs";
import path from "path";
import type { StoreData } from "./types";

// La "base de donnees" est le fichier data/store.json du depot GitHub lui-meme,
// lu et ecrit via l'API Contents de GitHub. Solution choisie apres le blocage
// (facturation) du store Vercel Blob : gratuite sans carte bancaire, limite de
// 5000 requetes/heure largement suffisante pour une boutique de cette taille.

const GITHUB_OWNER = "k2nexusgroup-spec";
const GITHUB_REPO = "luxurious-palace";
const GITHUB_BRANCH = "master";
const STORE_PATH = "data/store.json";
const SEED_PATH = path.join(process.cwd(), "data", "store.json");

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN manquant dans les variables d'environnement.");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

function contentsUrl(filePath: string): string {
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
}

function readSeed(): StoreData {
  const raw = fs.readFileSync(SEED_PATH, "utf-8");
  return JSON.parse(raw) as StoreData;
}

interface GithubFile {
  content: string; // base64
  sha: string;
}

async function getFile(filePath: string): Promise<GithubFile | null> {
  const res = await fetch(`${contentsUrl(filePath)}?ref=${GITHUB_BRANCH}`, {
    headers: githubHeaders(),
    cache: "no-store"
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Lecture GitHub impossible (HTTP ${res.status})`);
  }
  const data = (await res.json()) as GithubFile;
  return data;
}

async function putFile(filePath: string, contentBase64: string, message: string, sha?: string): Promise<void> {
  const res = await fetch(contentsUrl(filePath), {
    method: "PUT",
    headers: { ...githubHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {})
    })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ecriture GitHub impossible (HTTP ${res.status}) ${text}`);
  }
}

// Le depot est public : si le token est absent ou refuse (401/403), la lecture
// retombe sur raw.githubusercontent.com (sans authentification) pour que la
// boutique reste en ligne. Seules les ecritures exigent un token valide.
async function readPublicStore(): Promise<StoreData> {
  const res = await fetch(
    `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${STORE_PATH}?t=${Date.now()}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error(`Lecture publique GitHub impossible (HTTP ${res.status})`);
  }
  return (await res.json()) as StoreData;
}

export async function readStore(): Promise<StoreData> {
  if (!process.env.GITHUB_TOKEN) return readPublicStore();

  const res = await fetch(`${contentsUrl(STORE_PATH)}?ref=${GITHUB_BRANCH}`, {
    headers: githubHeaders(),
    cache: "no-store"
  });
  if (res.status === 401 || res.status === 403) return readPublicStore();
  if (res.ok) {
    const file = (await res.json()) as GithubFile;
    const json = Buffer.from(file.content, "base64").toString("utf-8");
    return JSON.parse(json) as StoreData;
  }
  if (res.status !== 404) {
    throw new Error(`Lecture GitHub impossible (HTTP ${res.status})`);
  }

  // Le fichier n'existe vraiment pas encore sur la branche : premier demarrage.
  const seed = readSeed();
  await writeStore(seed);
  return seed;
}

export async function writeStore(data: StoreData): Promise<void> {
  const existing = await getFile(STORE_PATH);
  const content = Buffer.from(JSON.stringify(data, null, 2), "utf-8").toString("base64");
  await putFile(STORE_PATH, content, "chore: mise a jour des donnees boutique", existing?.sha);
}

export async function updateStore(mutator: (data: StoreData) => void): Promise<StoreData> {
  const data = await readStore();
  mutator(data);
  await writeStore(data);
  return data;
}
