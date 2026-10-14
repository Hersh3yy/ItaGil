<!--
  PROJECT.md — the living map of this repo. One file to open and know where things stand.
  Maintained by the `project-map` skill. The assessment (status/issues/roadmap) is refreshed
  each session; the Diary at the bottom only grows. App-code changes need a green light;
  main is merged to only when sure.
-->
<!-- clickup_list: -->

# itamargilboa.com — map

**What it is** · The website of Amsterdam artist Itamar Gilboa — a Nuxt 3 rebuild of his old Joomla site, so he can update his own content and leave GoDaddy/Joomla behind. Biography, news, projects (his artworks), contact.
**Stack** · Nuxt 3.8.2 · Vue 3.3 · Tailwind · VAMS CMS (was Strapi on DigitalOcean) · Resend email · Netlify
**Status** · 🟡 rough — it works and is deployed, but for a *public artist site* the two things that matter most are essentially absent: **SEO** and **image optimization**. Content is also client-only rendered, so search engines and social previews see blank pages. Small, clean codebase; all high-value fixes.
**Repo** · GitLab `Itamar_gilboa/itamargilboa` · work on branch `project-map-vams` (merge to `main` only when sure)
**Hosting** · Netlify (`starlit-figolla-325428.netlify.app`) · content + images on DigitalOcean (Strapi + Spaces)
**ClickUp** · not linked yet
**Last assessed** · 2026-09-09

---

## Run it

```bash
yarn install     # fresh clone — no node_modules yet
yarn dev         # nuxt dev
yarn build       # SSR build   ·   yarn generate = static
yarn lint
```
**Node:** none pinned (no `.nvmrc`/`engines`). Nuxt 3.8.2 targets **Node 18 or 20 LTS**; Node 22+/24 may warn on this older `@nuxt/*` stack (build verified on Node 24 this session — see diary). **Contact form** needs `RESEND_API_KEY` (500s without it); `RESEND_FROM_EMAIL`/`RESEND_TO_EMAIL` default to `gilboaitamar@gmail.com`. **Content** comes from VAMS (`https://app.use-vams.me`) through the server route `server/api/cms/[type].get.js`. It needs `NUXT_CMS_API_KEY` (Itamar's VAMS api_key) or every content request 401s. See `.env.example`.

**How the VAMS switch works:** the pages still read the Strapi shape (`{ data: { attributes } }`). The server route fetches `/api/entries/by-type/{slug}` from VAMS and reshapes each entry into that Strapi shape, so no template changed. It runs server-side so the key never reaches the browser, and caches each type for 60 s (stale-while-revalidate) so traffic never hits VAMS's 60/min API throttle. The VAMS side is `ItamarWebsiteSeeder` + `strapi:import-itamar-website` on VAMS branch `itamar-website`.

## Status

A lean, tidy Nuxt 3 site. The email path is genuinely solid. But it's an artist's shopfront, and the shopfront isn't optimized: no per-page SEO, raw full-size images on the gallery/slideshow, and all content fetched client-side after load — so Google and link-preview scrapers see an empty shell. None of it is hard to fix; it's the highest-leverage work on the whole roster.

## Issues

Grounded in the audit (file:line). Highest-value first.

| Sev | Issue | Where |
|---|---|---|
| serious | **No SEO.** No `useSeoMeta`/`useHead` on any page; every page shares one global title/description. Project pages — the sellable content — have no unique title, OG, Twitter, or canonical. No sitemap/robots/JSON-LD. | all `pages/**` · `nuxt.config.ts:14` |
| serious | **Content is client-only.** All Strapi data is `$fetch`ed in `mounted()`, so the SSR HTML is empty (`index.vue` literally renders `<h1>Hello</h1>`). Crawlers and social scrapers see nothing — the root cause under the SEO gap. | `biography.vue:18` · `news.vue:53` · `projects/index.vue:29` · `projects/[slug].vue:52` · `landing-slideshow.vue:79` |
| serious | **Images unoptimized.** No `@nuxt/image`; every artwork is a raw `<img>` pulling full-res originals from Spaces — no `lazy`, dimensions, WebP, or `srcset`. The lightbox loads the same full-size file as the thumbnail. | `image-gallery.vue:4,11` · `landing-slideshow.vue:9` · `news.vue:14` |
| warning | **Accessibility:** slideshow `alt="Slide Image"` and biography image has no alt; all social icons say `alt="Instagram Icon"` (copy-paste); clickable `<div>`/`<p>` for nav (no keyboard access to the lightbox). | `landing-slideshow.vue:9` · `biography.vue:5` · `social-media-icons.vue:7,10,13` · `image-gallery.vue:3` |
| warning | **Silent contact-form failure** — a network error is swallowed by `console.log` and the user still sees nothing (only "Thank you!" on success). No honeypot / rate-limit / spam guard. | `contact-form.vue:55` · `server/api/send-email.post.js` |
| cleanup | **Dead code:** `sortedApiSlides` (unused + calls an unimported `partition`, would throw); `lodash.partition` dep declared but real imports use hoisted `lodash`; a `gtag.client.js` with a `new DataTransfer()`-instead-of-`new Date()` bug while Umami is already the analytics; stray backtick in `news.vue:13`; unused `.font-open-sans`. | see audit |
| cleanup | Render-blocking `@import` of full Font Awesome ×3 + Google Fonts ×2 for ~2 glyphs; stale README (SendGrid/Netlify-Functions paragraph). *(Fixed this session: CMS base URL centralised to one env var; `.netlify/state.json` untracked + gitignored.)* | multiple |

## Guide

- **Layouts (2):** `default.vue` (sidenav + content, inner pages), `slideshow.vue` (full-screen landing). No `app.vue`.
- **Pages (6):** `/`, `biography`, `news`, `contact`, `projects/index`, `projects/[slug]`.
- **Data:** client-side `$fetch` in `mounted()` (Options API) to Strapi collections `ig-biography`, `news-articles`, `ig-projects`, `ig-landing-page-slideshow-images`. No `useAsyncData`, no caching, no types. Strapi is public (no token); images from DO Spaces.
- **Email:** `server/api/send-email.post.js` — validates input, escapes HTML, Resend key is correctly server-only (`runtimeConfig`, not `public`). The strongest file in the repo. SendGrid migration is clean (only a stale README line remains).

## Hard parts

### Why the site is invisible to Google

🔭 **What it does** — Every page fetches its Strapi content inside Vue's `mounted()` hook, which runs **only in the browser, after** the page has loaded. So the HTML the server sends (and that Googlebot, and Facebook/LinkedIn/WhatsApp link-preview scrapers, actually read) is an empty shell — the homepage is literally `<h1>Hello</h1>`. The artwork only appears once JavaScript runs, which crawlers and scrapers largely don't wait for. No amount of meta tags fixes this while the content arrives client-side.

⚖️ **Why this way** — The fix is to fetch on the *server* with Nuxt's `useAsyncData`/`useFetch` so the content is baked into the delivered HTML, then add `useSeoMeta` per page (title, description, `ogImage` = the first artwork). SEO tags and server-rendered content are two halves of one fix; doing either alone is half a bridge.

🗣️ **Say it to a senior** — "Content is fetched in `mounted()`, so the SSR HTML is empty and crawlers see nothing — I'd move the fetches to `useAsyncData` and add per-page `useSeoMeta`, which is the single highest-ROI change for an artist's public site."

---

### The `lodash.partition` dead-dependency trap

🔭 **What it does** — `package.json` declares `lodash.partition`, but the code imports `lodash/partition` — a different path that resolves against the full `lodash` package (present only as a *transitive* dependency, reachable because `.npmrc` sets `shamefully-hoist=true`). So the declared dependency is dead weight, and the working import secretly relies on a hoisted package that could vanish on a clean/strict install.

⚖️ **Why this way** — Either import from the declared `lodash.partition` package, or declare `lodash` directly. Relying on hoisting is the kind of thing that works on your machine and breaks in CI.

🗣️ **Say it to a senior** — "The declared `lodash.partition` is unused; the real import pulls from a hoisted transitive `lodash`, so a strict install could break it — I'd align the dependency with the import path."

## Roadmap — near future

- [ ] SEO + SSR together: move Strapi fetches to `useAsyncData`, add `useSeoMeta` per page (project pages get title/description/OG from the artwork) — the single highest-value change <!-- id:n1 -->
- [ ] Images: add `@nuxt/image` with a Spaces/CDN provider → WebP + responsive `srcset` + resized thumbnails; `loading="lazy"` + dimensions on every `<img>` <!-- id:n2 -->
- [ ] Accessibility: real alt text on artwork (slideshow, biography), fix the copy-paste social-icon alts, make the lightbox keyboard-openable <!-- id:n3 -->
- [ ] Fix the silent contact-form failure (surface errors to the user) <!-- id:n4 -->
- [ ] Package-currency pass: minors done 2026-09-29; majors left = Nuxt 4, Tailwind 4, ESLint 9+ (flat config) <!-- id:n5 -->

## Roadmap — far future

- [ ] Sitemap + robots + JSON-LD (`Person` / `VisualArtwork`) structured data <!-- id:f1 -->
- [ ] Contact form: honeypot + rate-limit (README's own MVP TODO) <!-- id:f2 -->
- [x] Centralise the Strapi base URL in `runtimeConfig.public` instead of hardcoding in 5 files — done: `NUXT_PUBLIC_CMS_BASE_URL`, defaults to Strapi <!-- id:f3 -->
- [ ] Replace the render-blocking Font Awesome CDN with the 2 needed inline SVGs; consolidate the font imports <!-- id:f4 -->
- [ ] Decide one analytics stack (Umami vs the buggy GA plugin) and delete the other <!-- id:f5 -->
- [ ] Remove the dead code: `sortedApiSlides`, the `lodash.partition` mismatch, unused assets, the stray backtick <!-- id:f6 -->
- [x] **Strategic:** move this site off Strapi onto **VAMS** (code done 2026-09-29, branch `vams-cms`; prod cut-over pending, see diary) — one CMS for all of Itamar's content, under your control, off GoDaddy. Base URL is already env-driven (`f3`); remaining work = seed VAMS with his entry types + content, then add a Strapi→VAMS response-shape adapter in the fetches <!-- id:f7 -->

---

## Diary

### 2026-09-09 — first map + grounded audit, then VAMS-wiring (branch `project-map-vams`)
- Fresh clone. Full frontend audit + a build check. Findings: it works, but the two things a public artist site lives on — SEO and image performance — are essentially absent, and content is client-only so crawlers see empty pages. The email/contact path is the strongest file. Clear dead code (`sortedApiSlides`, `lodash.partition` mismatch, a buggy GA plugin alongside Umami). Added this `PROJECT.md` + `.env.example`; untracked the committed `.netlify/state.json` scratch and gitignored `.netlify/`.
- **Green-lit change:** Hiren asked for a pullable branch wired to VAMS. Reality check — VAMS doesn't hold Itamar's website content yet and returns a different response shape than Strapi, so *pointing* at VAMS would render an empty site. Did the safe, demo-preserving half: **centralised the CMS base URL** (`NUXT_PUBLIC_CMS_BASE_URL`, defaults to Strapi) across the 5 hardcoded fetches + `nuxt.config`. The app now switches CMS with one env var; default stays Strapi so the client sees real artwork. True VAMS switch = seed VAMS + add a shape adapter (`f7`). `yarn build` green on Node 24 after the refactor.
- The SEO / image / a11y / dead-code improvements were **assessed only, not implemented** (per the "look but don't implement" ask) — they're the near-future roadmap.
- Node: no version pinned; Nuxt 3.8.2 wants 18/20 LTS. Build verified on Node 24.

### 2026-09-29 — moved off Strapi onto VAMS (branch `vams-cms`)
- Hiren reported the DigitalOcean Strapi went down and asked to connect the site to VAMS. At the time of checking, Strapi answered 200 again, so I snapshotted all four collections (1 biography, 13 news, 13 projects, 10 slides) into VAMS at `database/data/itamargilboa-strapi-snapshot.json`. The images live in the `bengijzel` Spaces bucket, which VAMS already uses, so no image moved.
- VAMS (branch `itamar-website`): `ItamarWebsiteSeeder` adds the four entry types with the same slugs and grants them to `itamar@gilboa.net`; `strapi:import-itamar-website` imports the snapshot, idempotent by `content.strapi_id`. 3 new tests, full suite 262 green. Checked on a scratch local Postgres too: 37 entries, re-run updates in place.
- Site: new `server/api/cms/[type].get.js` reshapes VAMS entries into the Strapi shape; the five `$fetch` calls now hit it. `cmsBaseUrl` moved from public to private runtime config, plus a new private `cmsApiKey`. Verified end-to-end in the browser against a local VAMS: landing slideshow, projects list and order, project detail, news order, biography all render.
- Hiren got approval to use VAMS. Ran the seeder and the import on the production VAMS database (37 entries; a re-run updated all 37 in place) and checked `app.use-vams.me` serves all four types with Itamar's key. Still to do: set `NUXT_CMS_API_KEY` on Netlify and deploy the site (the GitLab repo is read-only for Hiren).
- Local commits, not pushed: an atomic-design pass (`components/atoms|molecules|organisms`, `pathPrefix: false` so names stay; new `NavLink` and `SiteLogo` atoms; social icons from a list, which fixed the copy-pasted alts) and a package update within majors (Nuxt 3.21.11, Tailwind 3.4.19, ESLint 8.57.1, Resend 6.30). Skipped folding the two `parseText` copies and the two sort helpers together: they differ in small ways, and one shared version would need option flags.
