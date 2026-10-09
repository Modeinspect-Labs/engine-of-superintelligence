import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Server-side only. Resolves the Anthropic credentials with a fallback
 * chain, so the demo works wherever the repo lands:
 *
 *   1. process.env — a real deployment or runner that sets env vars.
 *   2. .env.local  — loaded by Next.js automatically in dev and start.
 *   3. env.demo    — a committed, non-dotfile fallback that survives the
 *                    copies and syncs that drop .env.local (modeinspect
 *                    ingestion, gitignore-respecting exports).
 *
 * Values already present in process.env always win; the fallback file
 * never overrides a configured environment.
 */

const FALLBACK_FILE = "env.demo";
const KEYS = ["ANTHROPIC_API_KEY", "ANTHROPIC_WORKSPACE_ID"] as const;

/** Parse simple KEY=VALUE lines; ignores comments, blanks, and malformed rows. */
export function parseEnvFile(contents: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rawLine of contents.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (key && value) out[key] = value;
  }
  return out;
}

/** Fill missing Anthropic vars into process.env from env.demo, if present. */
export function ensureAnthropicEnv(): void {
  if (KEYS.every((k) => process.env[k])) return;
  let contents: string;
  try {
    contents = readFileSync(join(process.cwd(), FALLBACK_FILE), "utf8");
  } catch {
    return;
  }
  const parsed = parseEnvFile(contents);
  for (const key of KEYS) {
    if (!process.env[key] && parsed[key]) {
      process.env[key] = parsed[key];
    }
  }
}
