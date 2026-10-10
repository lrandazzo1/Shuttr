# The Focus Stack Diagnostic

A five-step lead-capture quiz: four questions, an email gate, then the result
revealed **inline** on the same page. React + Tailwind, client state only, no
dependencies beyond React.

```jsx
import FocusStackDiagnostic from '@/components/FocusStackDiagnostic';

export default function Page() {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-16">
      <FocusStackDiagnostic tools={MY_AFFILIATE_LINKS} />
    </main>
  );
}
```

`'use client'` — it holds state and reads `prefers-reduced-motion`, so it
cannot be a server component. Light theme throughout: white card, `zinc-200`
borders, `zinc-900` type. The accent (`#B4411F`) is written as arbitrary
Tailwind values, so the component drops into any project without touching
`tailwind.config`.

## Props

| Prop | Default | What it does |
|---|---|---|
| `onSubmit` | — | `async (payload) => {}`. Throw to show an inline error. Overrides `endpoint`. |
| `endpoint` | `/api/subscribe` | Where the default submit POSTs. `null` = demo mode (resolves after 500 ms, no network). |
| `tools` | `DEFAULT_TOOLS` | Affiliate slots, merged over the defaults. Ids you leave out keep theirs. |
| `gatedArticle` | built-in copy | A ReactNode revealed with the result — the rest of your article. |
| `yearsRemaining` | `50` | Lifespan assumption in the headline stat. |
| `className` | `''` | Appended to the card's classes. |

## Question types

| Step | Key | Type | Stored as |
|---|---|---|---|
| 1 | `band` / `hours` | single + slider | string + number |
| 2 | `windows` | **multi-select** | array of ids |
| 3 | `failed` | **multi-select** | array of ids |
| 4 | `friction` | single | id |

Multi-select steps render square checkbox cards; single-select render round
radios. Both are real `<input>`s inside a `<fieldset>`, so keyboard behaviour
is native.

Payload:

```json
{
  "email": "you@example.com",
  "optIn": true,
  "answers": { "hoursPerDay": 7, "band": "heavy",
               "windows": ["morning", "latenight"],
               "failed": ["blockers", "deleting"],
               "friction": "anxiety" },
  "result": { "yearsLost": 14.58, "archetype": "The Morning Scroller" }
}
```

## The math

```
years = hoursPerDay × 365 × yearsRemaining ÷ 8760
```

Exported as `yearsLost(hoursPerDay, yearsRemaining)`. At 7 h/day over 50 years
that is 14.6 years. Both constants are assumptions, not findings, and the
result footnote says so on screen — a stat the reader can check is more
persuasive than one they cannot.

## Picking the archetype from several windows

`windows` is an array now, so the result picks one archetype and says why:

- Three or more windows selected → **The Ambient Drifter**.
- Otherwise the first match in `WINDOW_PRIORITY`: `allday`, `morning`,
  `latenight`, `deepwork`. Picking "All day" alongside anything else is itself
  the diagnosis, so it always wins.
- When more than one was selected, the card names them all and says the stack
  is built around the costliest.

Every selected failure gets its own note — that block is the highest-trust
moment in the flow, because it tells the reader something they did not type.

## Affiliate links

Every recommended object lives in `DEFAULT_TOOLS`, keyed by id, and the
archetypes reference ids rather than URLs. Override any subset:

```jsx
<FocusStackDiagnostic tools={{
  alarmClock: { name: 'Loftie Clock', href: 'https://…?tag=yours', affiliate: true,
                note: 'Any dumb clock works; this one has a decent alarm.' },
}} />
```

Links render as anchors with `rel="sponsored noopener noreferrer"` and open in
a new tab. Rows with `affiliate: true` carry a small marker and trigger the
disclosure line under the stack.

**Keep the free option first where it is the better answer.** `screenTime` and
`greyscale` ship with real support URLs and `affiliate: false` for exactly that
reason — the brand's pitch is that it takes no app sponsorships, and a stack
that recommends a paid blocker before the free setting already on the phone
contradicts it.

Two compliance notes: the FTC requires the disclosure to be **near the links
and unavoidable**, which is why it sits inside the stack card rather than in
the footer; and the pre-checked opt-in is not valid consent under GDPR/UK GDPR,
so ship it unchecked for EU/UK traffic or treat the email itself as consent and
the checkbox as a preference.

## The inline reveal

Submitting does **not** navigate or change step. The gate is replaced by a
one-line confirmation and everything below expands via a
`grid-rows-[0fr] → grid-rows-[1fr]` transition, which animates to the content's
natural height with no hard-coded `max-height` to get wrong. The reveal is
`aria-hidden` while closed, and scrolls itself into view 220 ms after opening.

## Accessibility

Real `fieldset`/`legend` with native radio and checkbox inputs. Focus moves to
each step's heading on transition, but not on first paint, so landing on the
page does not yank the viewport. `role="progressbar"` with live values,
`role="alert"` errors with `aria-describedby`. Transitions and the count-up
respect `prefers-reduced-motion` — the final number renders immediately rather
than animating, so it is never wrong on screen.
