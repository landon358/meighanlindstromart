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
index.html      Prints  — every work, three wide. This is the home page.
gallery.html    redirect to index.html, for anyone holding the old link
about.html      About
contact.html    Contact
css/style.css
js/works.js     the catalogue — order here IS the order on the page
js/main.js      menu, bar, grid, viewer
images/full/    max 1800px — the viewer
images/thumb/   max 900px — the grid
images/icon-*   favicon, cropped from "Moon and Stars"
```

All artwork © Meighan Lindstrom.

## Design

White paper, EB Garamond throughout, one uppercase micro-label for nav and
field labels. The grid is three wide with tight gutters, and carries **no
captions** — a title fades in under a print only on hover, so at rest the
page is nothing but artwork on white.

The bar is transparent over the top of the page and only takes a background
and hairline once you scroll past 8px. The footer has no rule above it.

## The catalogue

`js/works.js` is the single source of truth. **Array order is page order** —
it is curated, not alphabetical or by series. Meighan's standing requests:
the two martinis and *Everybody, Midtown* sit on row two, and the pink
*I'll Be Your Flowers* opens the page.

To add a print:

1. Put the file in `images/full/` and `images/thumb/` under the same slug
   (`sips -Z 1800` and `sips -Z 900` produce the two sizes).
2. Add a row where you want it to appear:

   ```js
   { slug: 'my-slug', title: 'The Title', series: 'flowers', ratio: 0.75 }
   ```

`ratio` is width ÷ height and reserves the box before the image loads, so
nothing reflows. `series` is metadata only — it is not shown and not
filtered on; the category tabs were removed at Meighan's request.

## The viewer

Two stacked layers crossfade between prints so the outgoing and incoming
images never flicker. Arrows sit bottom right; the incoming print slides
46px against the direction of travel. Only `transform` and `opacity`
animate, and a `seq` counter drops superseded transitions if you click
faster than they finish. Focus moves into the dialog on open, is trapped
while it is up, and returns to the originating tile on close.

## Accessibility

An audit was run and its findings fixed. Worth preserving:

- Secondary text is `#6e6a64`, which is 5.37:1 on white. The lighter grey it
  replaced failed WCAG AA at 3.42:1 — and it sits on the navigation.
- Every page has an `h1`; on the prints page it is visually hidden, since
  that page is wordless by design.
- Nav, filters-era controls and viewer arrows all carry 44px hit areas.
- `prefers-reduced-motion` removes the viewer's travel but keeps its
  crossfade — it is not a blanket `transition: none`.

## Still to supply

- **No email address or social links anywhere.** An earlier build carried an
  invented `hello@…` address and an empty Instagram link; both were removed
  rather than left as dead labels. Until real ones exist the contact form is
  the only route — and note it is wired for Netlify, so it does nothing on
  GitHub Pages.
- **Titles** come from each drawing's own hand lettering where it had any,
  otherwise descriptive.
- **No dates.** No year, exhibition or client is claimed anywhere.

## About page references

The page carries a reproduction of Marc Chagall's *The Lovers of Vence*,
credited in the caption as a reference and not her own work, at Meighan's
explicit direction. The Assata Shakur reference is a short attributed
quotation rather than the page scan. Both are third-party copyrighted works;
if either ever draws an objection, removing them is a two-line change and the
surrounding paragraph already credits all three influences by name.
