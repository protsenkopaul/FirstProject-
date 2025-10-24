import fs from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = resolve(__dirname, "../data");

export async function readJson<T>(file: string): Promise<T[]> {
  const filePath = resolve(dataDir, file);
  try {
    const text = await fs.readFile(filePath, "utf-8");
    return JSON.parse(text);
  } catch {
    return [];
  }
}

export async function writeJson<T>(file: string, data: T[]): Promise<void> {
  const filePath = resolve(dataDir, file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
