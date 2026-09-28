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
images/wordmark.png    the logo — it IS the site title
images/share-cover.jpg the og:image — her flower logo
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

`js/works.js` is the single source of truth. **Array order is page order**,
and the order is Meighan's own — she sent it as four screenshots of the
page laid out row by row. The file keeps her rows grouped in threes to
match the grid. Reordering across a row break changes her layout, so treat
the blank lines as structural rather than cosmetic.

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

## The header

The logo replaced the text title — there is no "Meighan Lindstrom Art"
wordmark in type any more, so the image carries the site name in its `alt`
and the home link the text used to hold.

It is a **PNG with a transparent ground**, cut out of the original scan by
flood-filling the paper inward from the border. The scan's paper measured
251 and dipped to 242, which read as a grey rectangle against the page's
`#ffffff`. Re-exporting as JPEG, or cropping without clearing the ground,
brings the box back.

The logo sits in normal flow and scrolls away; the bar below it is
`position: sticky`. Two things will break that if you touch them:

- The bar must stay a **direct child of `body`**. A sticky element only
  sticks within its parent's box, so wrapping the logo and the bar together
  in one element makes the bar leave the screen with that wrapper.
- `overflow-x: hidden` must stay on `html`, **not** `body`. On `body` it
  computes `overflow-y` to `auto`, which makes `body` a scroll container and
  silently kills the sticky.

`initBar` keys the background off `bar.getBoundingClientRect().top <= 0`
rather than a scroll distance, because the bar no longer starts at y=0.

## Contact

Her email and Instagram are on the About page, the Contact page and in the
footer of every page.

The form is wired for Netlify (`data-netlify="true"` plus the hidden
`form-name` and the `bot-field` honeypot). **It does nothing on GitHub
Pages** — anything typed into it is silently discarded, so until the move
the email is the only working route. The decision is to move hosting to
Netlify, at which point the form starts working with no code change.

When that move happens, the absolute URLs need repointing: `og:url` and
`og:image` on all three pages currently hard-code
`https://landon358.github.io/meighanlindstromart/`. They have to be
absolute for social scrapers, so they cannot just be made relative.

## Notes

- **Titles** come from each drawing's own hand lettering where it had any,
  otherwise descriptive. *Everybody, Reaching* is descriptive and was named
  here, not by Meighan.
- **No dates.** No year, exhibition or client is claimed anywhere.
- The Chagall reproduction and the Shakur quotation were removed from the
  About page at Meighan's request, along with `images/ref-chagall.jpg`.
