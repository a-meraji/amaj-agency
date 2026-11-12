#!/usr/bin/env node
/**
 * Pull a Figma file into ./design for offline, exact implementation work.
 *
 *   node scripts/figma/pull.mjs                 # all steps, skipping outputs that exist
 *   node scripts/figma/pull.mjs --only=frames   # file | frames | fills | icons (comma list)
 *   node scripts/figma/pull.mjs --force         # re-download even if outputs exist
 *
 * Needs FIGMA_TOKEN (env or .env.local) and figma.config.json.
 * Free/Starter Figma plans have very small REST quotas, so every step is a
 * single batched request and nothing is re-fetched unless asked.
 *
 * API calls per full run: file 1 · frames 1 · fills 1 · icons 1.
 * Image downloads go to signed S3 URLs and do not count against the quota.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = process.cwd();
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const outDir = resolve(root, args.out ?? "design");
const steps = (args.only ?? "file,frames,fills,icons").split(",");
const force = Boolean(args.force);

const config = JSON.parse(readFileSync(join(root, "figma.config.json"), "utf8"));
const token = process.env.FIGMA_TOKEN ?? readEnvLocal("FIGMA_TOKEN");
const api = process.env.FIGMA_API_BASE ?? "https://api.figma.com";
if (!token) fail("FIGMA_TOKEN missing. Put it in .env.local (git-ignored).");

let apiCalls = 0;

for (const step of steps) {
  if (step === "file") await pullFile();
  else if (step === "frames") await pullFrames();
  else if (step === "fills") await pullFills();
  else if (step === "icons") await pullIcons();
  else fail(`Unknown step "${step}"`);
}
console.log(`Done. Figma API calls this run: ${apiCalls}`);

// ---------------------------------------------------------------------------

async function pullFile() {
  const target = join(outDir, "file.json");
  if (skip(target)) return;
  const json = await figma(`/v1/files/${config.fileKey}`);
  write(target, JSON.stringify(json));
  console.log(`file   → ${rel(target)} (${json.name}, modified ${json.lastModified})`);
}

async function pullFrames() {
  const dir = join(outDir, "frames");
  const entries = Object.entries(config.frames ?? {});
  if (!entries.length) return console.log("frames → none configured");
  if (entries.every(([, n]) => skip(join(dir, `${n}.png`), true))) return logSkip("frames", dir);
  const ids = entries.map(([id]) => id).join(",");
  const { images, err } = await figma(
    `/v1/images/${config.fileKey}?ids=${enc(ids)}&format=png&scale=1`,
  );
  if (err) fail(err);
  await downloadAll(entries.map(([id, name]) => [images[id], join(dir, `${name}.png`)]));
  console.log(`frames → ${rel(dir)} (${entries.length})`);
}

async function pullFills() {
  const dir = join(outDir, "images");
  const file = readDesign();
  const used = new Set();
  walk(file.document, (n) => {
    for (const p of n.fills ?? []) if (p.type === "IMAGE" && p.imageRef) used.add(p.imageRef);
  });
  const missing = [...used].filter((ref) => force || !findImage(dir, ref));
  if (!missing.length) return logSkip("fills", dir);
  const { meta } = await figma(`/v1/files/${config.fileKey}/images`);
  await downloadAll(
    missing.map((ref) => [meta.images[ref], join(dir, ref)]),
    true,
  );
  console.log(`fills  → ${rel(dir)} (${missing.length} of ${used.size} used images)`);
}

async function pullIcons() {
  const dir = join(outDir, "icons");
  const entries = Object.entries(config.icons ?? {});
  if (!entries.length) return console.log("icons  → none configured");
  if (entries.every(([, n]) => skip(join(dir, `${n}.svg`), true))) return logSkip("icons", dir);
  const ids = entries.map(([id]) => id).join(",");
  const { images, err } = await figma(
    `/v1/images/${config.fileKey}?ids=${enc(ids)}&format=svg&svg_outline_text=true`,
  );
  if (err) fail(err);
  await downloadAll(entries.map(([id, name]) => [images[id], join(dir, `${name}.svg`)]));
  console.log(`icons  → ${rel(dir)} (${entries.length})`);
}

// ---------------------------------------------------------------------------

async function figma(path, attempt = 1) {
  apiCalls++;
  const res = await fetch(api + path, { headers: { "X-Figma-Token": token } });
  if (res.status === 429 && attempt <= 3) {
    const wait = Number(res.headers.get("retry-after") ?? 30);
    if (wait > 120) fail(`Rate limited by Figma for ${wait}s. Try again later.`);
    console.warn(`429 — retrying in ${wait}s…`);
    await new Promise((r) => setTimeout(r, wait * 1000));
    return figma(path, attempt + 1);
  }
  if (!res.ok) fail(`Figma ${res.status} on ${path}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

/** Download [url, path] pairs. With `sniff`, the extension is taken from the bytes. */
async function downloadAll(pairs, sniff = false) {
  for (const [url, path] of pairs) {
    if (!url) {
      console.warn(`  ! no URL for ${rel(path)} (node deleted or hidden?)`);
      continue;
    }
    const res = await fetch(url);
    if (!res.ok) fail(`Download ${res.status} for ${rel(path)}`);
    const buf = Buffer.from(await res.arrayBuffer());
    write(sniff ? `${path}.${extFor(buf)}` : path, buf);
  }
}

function extFor(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (buf.subarray(0, 4).toString() === "RIFF") return "webp";
  if (buf.subarray(0, 3).toString() === "GIF") return "gif";
  return "bin";
}

function findImage(dir, ref) {
  return ["png", "jpg", "webp", "gif"].some((e) => existsSync(join(dir, `${ref}.${e}`)));
}

function readDesign() {
  const p = join(outDir, "file.json");
  if (!existsSync(p)) fail('design/file.json missing — run the "file" step first.');
  return JSON.parse(readFileSync(p, "utf8"));
}

function walk(node, fn) {
  fn(node);
  for (const c of node.children ?? []) walk(c, fn);
}

function skip(path, quiet = false) {
  const exists = !force && existsSync(path);
  if (exists && !quiet) console.log(`skip   ${rel(path)} (exists; --force to refresh)`);
  return exists;
}

function write(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
}

function readEnvLocal(key) {
  const p = join(root, ".env.local");
  if (!existsSync(p)) return undefined;
  const line = readFileSync(p, "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith(`${key}=`));
  return line?.slice(key.length + 1).trim();
}

function enc(s) {
  return encodeURIComponent(s);
}

function rel(p) {
  return p.replace(root, ".").replaceAll("\\", "/");
}

function logSkip(step, dir) {
  console.log(`skip   ${step} → ${rel(dir)} (complete; --force to refresh)`);
}

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exit(1);
}
