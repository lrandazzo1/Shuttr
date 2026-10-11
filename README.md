# Shuttr / Unscroll

Everything built for the phone-detox newsletter so far: the live site, the
React quiz component, and the earlier builds kept for reference.

```
site/          the deployed site — static HTML, no build step
api/           the signup function (runs on Vercel)
components/    FocusStackDiagnostic.jsx, the React/Next.js quiz
examples/      a worked Next.js route handler the quiz can post to
docs/          how the Shuttr product photography was pulled from Shopify
archive/       earlier builds, kept because the copy is worth keeping
```

## site/ — what is live

Plain HTML, Tailwind via the Play CDN, and a little vanilla JS. No install, no
build, no framework preset. Deployed to Vercel (team `jamoke`, project
`unscroll-site`):

- https://unscroll-site-wheat.vercel.app
- https://unscroll-site-jamoke.vercel.app

| File | What it is |
|---|---|
| `index.html` | The landing page: signup, the "your year in dots" tool, links to the articles |
| `edition-01.html` | Edition No. 01 — the article, the blur gate from Section II, the sign-up card |
| `story.html` | Our Story — the reflex, the 186/6/43 math, whack-a-mole, the Shuttr pivot |
| `quiz.html` + `quiz.js` | The Focus Stack Diagnostic, as a standalone page |

The root `vercel.json` sets `cleanUrls: true`, so `/story.html` serves at `/story`. The
in-page links are written with the `.html` suffix so the files also work opened
straight from disk; Vercel 308-redirects them to the clean path.

Deploys come from this repo: the Vercel project builds `main` from the repo
root, framework preset **Other**, no build command. Pushing to `main` ships the
site. Two things at the repo root make that work, so leave the project's Root
Directory setting empty:

| File | What it is |
|---|---|
| `vercel.json` | `outputDirectory: "site"` (serve `site/` at `/`), `cleanUrls` routing, security headers |
| `api/subscribe.js` | Vercel function the landing forms post to; forwards the email to Mailcheap |

## components/ — the quiz

`FocusStackDiagnostic.jsx` is the React version: light theme, two multi-select
questions, affiliate-ready recommendation slots, and an inline reveal that
expands the result in place when the email is submitted. See
`components/README.md` for props, the payload shape, and the affiliate and
consent notes.

`site/quiz.js` is a vanilla port of the same quiz for the static site — same
questions, math, archetypes, copy and behaviour, no React. The two are kept in
step by hand, so a change to one needs the same change to the other.

## Before launch

Search for `PLACEHOLDER` across the repo. The short list:

- **Brand** — "Unscroll" in every masthead and footer, plus titles and meta.
- **Form actions** — the landing page forms post to `/api/subscribe`, which
  forwards the email to [Mailcheap](https://github.com/marclou/mailcheap). Deploy
  Mailcheap, create a newsletter and an API key in it, then set `MAILCHEAP_URL`,
  `MAILCHEAP_API_KEY` and `MAILCHEAP_NEWSLETTER` on this Vercel project. Until
  then the function answers 503 and the forms say signup is not set up. The
  forms in `edition-01.html`, `story.html` and `quiz.js` are still stubs that
  fake success; point them at the same route (`ENDPOINT` in `quiz.js`).
- **Affiliate links** — `DEFAULT_TOOLS` in the component. All `#` today.
- **Social proof** — the 12,400 readers figure is a placeholder, as are the
  140 testers and the beta-tester quote.
- **Author** — `[Founder Name]` and the grey avatar circle.
- **Privacy page** — does not exist; the footer slot is commented out.

## archive/

- `two-file-tailwind/` — the Tailwind two-page build plus the standalone
  `protocol.html` lead-magnet page, which is not deployed but is good copy.
- `single-file/` — the whole site as one file with a hash router, for
  drag-and-drop deploys.
