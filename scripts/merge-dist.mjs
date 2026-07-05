#!/usr/bin/env node
/**
 * Merges the landing app build (landing/dist) into the Ghost static export (dist).
 *
 * The landing owns "/" (index.html) and the /garage-assets + /models namespaces.
 * Everything else in dist belongs to the Ghost export and must never be touched.
 * Fails loudly on any collision or integrity problem so a broken merge can
 * never reach Vercel silently.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const LANDING_DIST = path.join(ROOT, 'landing', 'dist')

// Paths the landing build is allowed to overwrite in dist.
const OVERWRITE_ALLOWLIST = new Set(['index.html'])
// Directory namespaces owned entirely by the landing build.
const LANDING_NAMESPACES = ['garage-assets', 'models']

function fail(msg) {
  console.error(`\n[merge-dist] FAIL: ${msg}\n`)
  process.exit(1)
}

function listFiles(dir) {
  return fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => path.relative(dir, path.join(e.parentPath, e.name)))
}

// --- Preconditions ---------------------------------------------------------
if (!fs.existsSync(DIST)) fail(`dist not found at ${DIST} — run "npm run build:blog" first`)
if (!fs.existsSync(path.join(DIST, 'blog', 'index.html')))
  fail('dist/blog/index.html missing — Ghost export did not produce the /blog/ feed (check routes.yaml + that Ghost was running)')
if (!fs.existsSync(path.join(LANDING_DIST, 'index.html')))
  fail(`landing build not found at ${LANDING_DIST} — run "npm run build:landing" first`)

// --- Reset landing-owned namespaces so stale hashed bundles never pile up ---
for (const ns of LANDING_NAMESPACES) {
  fs.rmSync(path.join(DIST, ns), { recursive: true, force: true })
}

// --- Collision check: landing may only add files or overwrite the allowlist -
const landingFiles = listFiles(LANDING_DIST)
const collisions = landingFiles.filter((rel) => {
  if (OVERWRITE_ALLOWLIST.has(rel)) return false
  if (LANDING_NAMESPACES.some((ns) => rel === ns || rel.startsWith(ns + path.sep))) return false
  return fs.existsSync(path.join(DIST, rel))
})
if (collisions.length > 0)
  fail(`landing build would overwrite Ghost-owned files:\n  ${collisions.join('\n  ')}`)

// --- Merge ------------------------------------------------------------------
for (const rel of landingFiles) {
  const dest = path.join(DIST, rel)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(path.join(LANDING_DIST, rel), dest)
}

// --- Post-merge integrity checks --------------------------------------------
const mergedIndex = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
if (!mergedIndex.includes('garage-assets'))
  fail('dist/index.html does not look like the landing build (missing garage-assets reference)')

const leaky = listFiles(DIST)
  .filter((rel) => rel.endsWith('.html'))
  .filter((rel) => fs.readFileSync(path.join(DIST, rel), 'utf8').includes('localhost:2368'))
if (leaky.length > 0)
  fail(`localhost:2368 leaked into:\n  ${leaky.join('\n  ')}`)

if (!fs.existsSync(path.join(DIST, '404.html')))
  console.warn('[merge-dist] warn: dist/404.html missing — custom 404 will not be served')

console.log(
  `[merge-dist] ok: merged ${landingFiles.length} landing files into dist (overwrote index.html, owns /${LANDING_NAMESPACES.join(', /')})`,
)
