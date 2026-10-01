import { NextRequest, NextResponse } from "next/server";

// Les photos produits sont commitees dans le depot GitHub public (dossier
// public-uploads/) et servies via raw.githubusercontent.com. Solution choisie
// apres le blocage (facturation) du store Vercel Blob : gratuite sans carte
// bancaire, chaque fichier a un nom unique donc aucun probleme de cache.

const GITHUB_OWNER = "k2nexusgroup-spec";
const GITHUB_REPO = "luxurious-palace";
const GITHUB_BRANCH = "master";

const MAX_SIZE = 8 * 1024 * 1024; // 8 Mo
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Configuration serveur manquante (GITHUB_TOKEN)." }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Format d'image non supporté." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image trop volumineuse (8 Mo max)." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = `public-uploads/produits/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `chore: ajout photo produit ${filename}`,
        content: base64,
        branch: GITHUB_BRANCH
      })
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json({ error: `Échec de l'envoi de l'image (HTTP ${res.status}). ${text}` }, { status: 500 });
  }

  const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;
  return NextResponse.json({ url });
}
