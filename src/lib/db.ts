import fs from "fs";
import path from "path";
import type { StoreData } from "./types";

const DB_PATH = path.join(process.cwd(), "data", "store.json");

export function readStore(): StoreData {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as StoreData;
}

export function writeStore(data: StoreData): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function updateStore(mutator: (data: StoreData) => void): StoreData {
  const data = readStore();
  mutator(data);
  writeStore(data);
  return data;
}
