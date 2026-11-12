#!/usr/bin/env node
/**
 * Read design/file.json offline (no API calls) and print what you need to
 * implement a frame exactly.
 *
 *   node scripts/figma/inspect.mjs                     # pages + top-level frames
 *   node scripts/figma/inspect.mjs 4:2                 # node tree with positions, fills, text
 *   node scripts/figma/inspect.mjs 176:678 --scale=2   # mobile @2x frame → CSS px
 *   node scripts/figma/inspect.mjs 4:2 --text          # only text layers (copy + type specs)
 *   node scripts/figma/inspect.mjs --tokens            # colour / type / radius usage counts
 *
 * Positions are relative to the inspected node. Grid layers are hidden by default
 * (add --grid). Values are divided by --scale (defaults to 1).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}`));
const scale = Number(flag("scale")?.split("=")[1] ?? 1);
const nodeId = args.find((a) => !a.startsWith("--"));
const file = JSON.parse(readFileSync(join(process.cwd(), "design", "file.json"), "utf8"));

const r = (v) => +(v / scale).toFixed(1);
const hex = (c, a = c.a) =>
  "#" +
  [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("") +
  (a < 0.999 ? `/${Math.round(a * 100)}` : "");
const paint = (p) => {
  if (p.type === "SOLID") return hex(p.color, p.color.a * (p.opacity ?? 1));
  if (p.type === "IMAGE") return `image:${p.imageRef?.slice(0, 8)}(${p.scaleMode})`;
  const stops = (p.gradientStops ?? [])
    .map((s) => `${hex(s.color)} ${Math.round(s.position * 100)}%`)
    .join(", ");
  return `${p.type.replace("GRADIENT_", "").toLowerCase()}(${stops})${p.opacity < 1 ? ` op${p.opacity}` : ""}`;
};
const visible = (arr) => (arr ?? []).filter((p) => p.visible !== false);
const find = (n, id) => (n.id === id ? n : (n.children ?? []).map((c) => find(c, id)).find(Boolean));

if (flag("tokens")) tokens();
else if (!nodeId) summary();
else tree(find(file.document, nodeId) ?? die(`Node ${nodeId} not found`));

function summary() {
  console.log(`${file.name} — modified ${file.lastModified}`);
  for (const page of file.document.children) {
    console.log(`\nPAGE ${page.name} (${page.id})`);
    for (const f of page.children ?? []) {
      const b = f.absoluteBoundingBox ?? {};
      console.log(`  ${f.id.padEnd(10)} ${String(Math.round(b.width)).padStart(5)}×${Math.round(b.height)}  ${f.name}`);
    }
  }
}

function tree(top) {
  const o = top.absoluteBoundingBox;
  const textOnly = Boolean(flag("text"));
  const showGrid = Boolean(flag("grid"));
  const walk = (n, d) => {
    if (n.visible === false) return;
    if (!showGrid && n !== top && /grid/i.test(n.name)) return;
    const b = n.absoluteBoundingBox ?? {};
    const pos = `@${r(b.x - o.x)},${r(b.y - o.y)} ${r(b.width)}×${r(b.height)}`;
    let line = `${"  ".repeat(d)}${n.type.slice(0, 5).padEnd(5)} ${n.id} "${n.name.slice(0, 44)}" ${pos}`;
    if (n.layoutMode)
      line += ` auto:${n.layoutMode.toLowerCase()} gap${r(n.itemSpacing ?? 0)} pad${[n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft].map((v) => r(v ?? 0)).join("/")}`;
    const fills = visible(n.fills);
    if (fills.length) line += ` fill:${fills.map(paint).join(" + ")}`;
    const strokes = visible(n.strokes);
    if (strokes.length) line += ` stroke:${strokes.map(paint).join(",")} ${r(n.strokeWeight)}px`;
    if (n.cornerRadius) line += ` r${r(n.cornerRadius)}`;
    if (n.rectangleCornerRadii) line += ` r[${n.rectangleCornerRadii.map(r).join(",")}]`;
    if (n.opacity != null && n.opacity < 1) line += ` op${n.opacity.toFixed(2)}`;
    if (n.rotation) line += ` rot${Math.round((n.rotation * 180) / Math.PI)}°`;
    const fx = visible(n.effects);
    if (fx.length)
      line += ` fx:${fx.map((e) => `${e.type.toLowerCase()}(${r(e.radius)}${e.offset ? ` ${r(e.offset.x)},${r(e.offset.y)}` : ""}${e.color ? ` ${hex(e.color)}` : ""})`).join(",")}`;
    if (n.type === "TEXT") {
      const s = n.style;
      line += ` ${r(s.fontSize)}px/${s.fontWeight} lh${r(s.lineHeightPx ?? 0)} ls${r(s.letterSpacing ?? 0)} ${s.textAlignHorizontal.toLowerCase()} ${s.fontFamily} — ${JSON.stringify(n.characters.length > 80 ? n.characters.slice(0, 80) + "…" : n.characters)}`;
    }
    if (!textOnly || n.type === "TEXT") console.log(line);
    if (!["VECTOR", "BOOLEAN_OPERATION", "TEXT"].includes(n.type)) (n.children ?? []).forEach((c) => walk(c, d + 1));
  };
  walk(top, 0);
}

function tokens() {
  const colors = {}, type = {}, radii = {};
  const bump = (o, k) => (o[k] = (o[k] ?? 0) + 1);
  const walk = (n) => {
    if (n.visible === false) return;
    for (const p of [...visible(n.fills), ...visible(n.strokes)]) if (p.type === "SOLID") bump(colors, paint(p));
    if (n.style) bump(type, `${n.style.fontFamily} ${n.style.fontWeight} ${n.style.fontSize}px lh${Math.round(n.style.lineHeightPx ?? 0)}`);
    if (n.cornerRadius) bump(radii, n.cornerRadius);
    (n.children ?? []).forEach(walk);
  };
  walk(file.document);
  const print = (title, o) => {
    console.log(`\n${title}`);
    Object.entries(o).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));
  };
  print("COLOURS", colors);
  print("TYPE", type);
  print("RADII", radii);
}

function die(msg) {
  console.error(msg);
  process.exit(1);
}
