# Meighan Lindstrom — site

Live: **https://landon358.github.io/meighanlindstromart/**

Static. No build step, no dependencies.

```bash
python3 serve.py          # http://localhost:4321
```

`serve.py` exists because `python -m http.server` sends no `Cache-Control`,
so browsers silently reuse stale JS and CSS — which looks exactly like a
change not working. This one refuses caching outright.

## Structure

```
index.html      Home    — crosshair stage + a chain of prints that walks the page
gallery.html    Work    — all 32, three wide, filters
about.html      About   — placeholder copy, see below
contact.html    Contact
css/style.css
js/works.js     catalogue — slug, title, series, aspect ratio
js/main.js      menu, grid, filters, viewer, deck, clock
images/full/    max 1800px — the viewer
images/thumb/   max 900px — the grids and the deck
```

All artwork © Meighan Lindstrom.

## Design

White paper, EB Garamond throughout, one uppercase micro-label for nav and
field labels. The work grid is three wide from 1000px (two below that) with
tight gutters and no inset, so the prints run large, and carries **no captions** — a title fades in under a print only on
hover, so at rest the page is nothing but artwork on white.

The home page is a single full-viewport stage: two hairline rules crossing
behind the name, and nothing else at rest.

## The deck (home page)

`initDeck()` in `js/main.js`. Sets of prints land as one continuous chain of
overlapping cards that walks across the stage. It runs on a timer, not on the
cursor, so it behaves the same on touch.

The rhythm:

- The first set is 3 prints; every set after is 3–7.
- Inside a set, prints arrive **one every 0.5s** (`DEAL`).
- After the last print of a set, a pause of 2.4–3.2s before the next begins.
- A retiring set leaves on the **same 0.5s cadence, oldest first**, so the
  tail is eaten at the pace the head is drawn. A card only returns to the
  pool once it is actually hidden, never when its set is scheduled to go.
- **Three sets stay on the page at once.** The oldest goes the moment a
  fourth lands.

Every load is different: the start position, the initial heading, and the
direction the line curves (`spin`) are all randomized, and the prints are
drawn from a shuffled order that reshuffles only once it is used up — so no
print repeats until every other one has had a turn.

How the chain works. A single head position and heading persist across sets,
so each set picks up exactly where the last one stopped — one line, not
clusters. The heading turns `TURN` (0.075 rad, about 4.3°) per card, which is
what bends the line into a long arc; `step` is 0.32 of a card width, so cards
sit at roughly 68% overlap. If the head wanders past a comfortable
ellipse the heading bends back toward the middle, and a hard clamp guarantees
nothing is ever placed off-stage — verified at 1440px and 375px.

Cards are **square and axis-aligned**: a fixed `aspect-ratio: 1`, no rotation,
prints contained inside. They carry a 1px `--rule` edge, because most of these
prints are on white paper and a stack of them would otherwise read as one
blank shape.

**Nothing animates.** There is no transition and no keyframe on `.card` —
each print appears and vanishes in a single frame. The 0.5s spacing inside a
set is timing, not motion: positions for the whole set are computed up front
so the chain stays in order, and only the reveal waits its turn. Verified in
the browser: `transition-duration: 0s`, `animation-name: none`. If you ever
add motion here, that is a deliberate reversal, not a fix.

Three numbers worth knowing: `DEAL` is the gap between prints (both in and
out), `step` controls how much of each print shows (lower = heavier overlap;
0.32 leaves about a third of each card visible), and `TURN` controls how
tightly the line curves.

## Transitions

The viewer keeps two stacked layers and crossfades between them. Arrows sit bottom
right; the incoming print slides 46px against the direction of travel while
the outgoing one leaves. Only `transform` and `opacity` animate. A `seq`
counter drops superseded transitions if you click faster than they finish.

## Adding or changing artwork

1. Put the file in `images/full/` and `images/thumb/` under the same slug
   (`sips -Z 1800` and `sips -Z 900` produce the two sizes).
2. Add a row to `js/works.js`:

   ```js
   { code: 'FL-10', slug: 'my-slug', title: 'The Title', cat: 'flowers', ratio: 0.75 }
   ```

   `cat` is one of `flowers`, `words`, `newyork`, `everyday`. `ratio` is
   width ÷ height. `code` is no longer displayed anywhere — it is kept only
   to keep each series grouped and ordered in the file.

The three prints on the home page are set by one attribute in `index.html`:
`<section class="scatter" data-scatter="slug,slug,slug">`. Order matters —
the first takes the large left column, the second drops furthest, the third
drops a little.

## Before this goes live — needs Meighan's real details

Nothing about her is invented; the copy was written from the artwork. These
placeholders are the exception:

- **`hello@meighanlindstrom.com`** — in all four pages (bar menu, footer,
  About, Contact). Search and replace.
- **Instagram** — `https://instagram.com/` with no handle, in the bar menu
  and footer of all four pages.
- **About page** — currently **lorem ipsum placeholder**, marked with an HTML
  comment in `about.html`. The earlier draft copy and the practice/materials
  detail rows were removed. This folder is not under version control, so they
  are saved in `../about-copy-draft.md` rather than being recoverable.
- **Titles** — from each drawing's own hand lettering where it had any,
  otherwise descriptive.
- **No dates.** No year, exhibition or client is claimed anywhere.

## Contact form

Wired for Netlify (`data-netlify` + honeypot); works on deploy with no extra
config. On another host, point the `<form>` at your own handler.

## Unused file

`images/full/wordmark.jpg` is Meighan's hand-drawn "MEIGHANS ART" lettering.
The current design sets the wordmark in type instead. Kept in case it is
wanted later.
