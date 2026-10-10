# Shuttr / Unscroll

Everything built for the phone-detox newsletter so far: the live site, the
React quiz component, and the earlier builds kept for reference.

```
site/          the deployed site — static HTML, no build step
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
| `index.html` | Edition No. 01 — the article, the blur gate from Section II, the sign-up card |
| `story.html` | Our Story — the reflex, the 186/6/43 math, whack-a-mole, the Shuttr pivot |
| `quiz.html` + `quiz.js` | The Focus Stack Diagnostic, as a standalone page |
| `vercel.json` | `cleanUrls` routing and security headers |

`vercel.json` sets `cleanUrls: true`, so `/story.html` serves at `/story`. The
in-page links are written with the `.html` suffix so the files also work opened
straight from disk; Vercel 308-redirects them to the clean path.

To deploy: drag the `site/` folder onto vercel.com/new, or connect this repo to
the existing project (Settings → Git, Framework Preset **Other**, build command
and output directory empty).

## components/ — the quiz

`FocusStackDiagnostic.jsx` is the React version: light theme, two multi-select
questions, affiliate-ready recommendation slots, and an inline reveal that
expands the result in place when the email is submitted. See
`components/README.md` for props, the payload shape, and the affiliate and
consent notes.

**Known divergence:** `site/quiz.js` is a vanilla port of the same quiz, and it
is still on the **dark** palette and single-select. It was built before the
light-theme iteration. Bringing it in line is a straight port — ask and it gets
done.

## Before launch

Search for `PLACEHOLDER` across the repo. The short list:

- **Brand** — "Unscroll" in every masthead and footer, plus titles and meta.
- **Form actions** — every form is a stub that fakes success. Point them at your
  list provider; `examples/app/api/subscribe/route.js` shows the payload shape.
  In `site/quiz.js`, set `ENDPOINT`.
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
