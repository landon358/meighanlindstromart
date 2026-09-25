/* Catalogue — single source of truth for every page.
   code   shown in the grid
   ratio  width / height, reserves the box before the image loads */
window.WORKS = [
  /* ---- FLOWERS ---- */
  { code: 'FL-01', slug: 'my-garden',            title: 'Welcome to My Garden',   cat: 'flowers',  ratio: 1.026 },
  { code: 'FL-02', slug: 'flowers-vase-yellow',  title: "I'll Be Your Flowers",   cat: 'flowers',  ratio: 0.714 },
  { code: 'FL-03', slug: 'flowers-vase-blue',    title: "I'll Be Your Flowers",   cat: 'flowers',  ratio: 0.714 },
  { code: 'FL-04', slug: 'flowers-vase-pink',    title: "I'll Be Your Flowers",   cat: 'flowers',  ratio: 0.714 },
  { code: 'FL-05', slug: 'bloom-again',          title: 'We All Bloom Again',     cat: 'flowers',  ratio: 1.000 },
  { code: 'FL-06', slug: 'take-it-slow',         title: "Let's Take It Slow",     cat: 'flowers',  ratio: 1.013 },
  { code: 'FL-07', slug: 'never-too-late',       title: 'Never Too Late',         cat: 'flowers',  ratio: 1.070 },
  { code: 'FL-08', slug: 'proper-conditions',    title: 'Proper Conditions',      cat: 'flowers',  ratio: 0.773 },
  { code: 'FL-09', slug: 'pink-figure',          title: 'Girl in the Field',      cat: 'flowers',  ratio: 1.000 },

  /* ---- WORDS ---- */
  { code: 'WD-01', slug: 'hate-yourself',        title: 'A Person You Love',      cat: 'words',    ratio: 1.009 },
  { code: 'WD-02', slug: 'all-we-got',           title: 'All We Got',             cat: 'words',    ratio: 1.000 },
  { code: 'WD-03', slug: 'carry-all-that',       title: 'All That With You',      cat: 'words',    ratio: 1.000 },
  { code: 'WD-04', slug: 'favorite-fruit',       title: 'My Favorite Fruit',      cat: 'words',    ratio: 1.000 },
  { code: 'WD-05', slug: 'sweet-fruit',          title: 'The Sweet Fruit I Am',   cat: 'words',    ratio: 0.699 },
  { code: 'WD-06', slug: 'good-for-the-soul',    title: 'Good for the Soul',      cat: 'words',    ratio: 1.089 },
  { code: 'WD-07', slug: 'high-on-a-lot',        title: 'Drunk on Everything',    cat: 'words',    ratio: 1.000 },

  /* ---- NEW YORK ---- */
  { code: 'NY-01', slug: 'crowd',                title: 'Everybody, Midtown',     cat: 'newyork',  ratio: 0.751 },
  { code: 'NY-02', slug: 'new-york-from-memory', title: 'New York, From Memory',  cat: 'newyork',  ratio: 0.750 },
  { code: 'NY-03', slug: 'lincoln-center',       title: 'Lincoln Center',         cat: 'newyork',  ratio: 0.905 },
  { code: 'NY-04', slug: 'ny-red',               title: 'NY, Repeated',           cat: 'newyork',  ratio: 0.750 },
  { code: 'NY-05', slug: 'ny-black',             title: 'NY, Repeated',           cat: 'newyork',  ratio: 0.750 },

  /* ---- EVERYDAY ---- */
  { code: 'EV-01', slug: 'martini',              title: 'Martini',                cat: 'everyday', ratio: 0.750 },
  { code: 'EV-02', slug: 'espresso-martini',     title: 'Espresso Martini',       cat: 'everyday', ratio: 0.750 },
  { code: 'EV-03', slug: 'groceries',            title: 'Groceries',              cat: 'everyday', ratio: 1.000 },
  { code: 'EV-04', slug: 'good-morning',         title: 'Good Morning',           cat: 'everyday', ratio: 1.000 },
  { code: 'EV-05', slug: 'good-night',           title: 'Good Night',             cat: 'everyday', ratio: 0.800 },
  { code: 'EV-06', slug: 'pyjamas',              title: 'Pyjamas',                cat: 'everyday', ratio: 0.806 },
  { code: 'EV-07', slug: 'starry-horse',         title: 'Starry Horse',           cat: 'everyday', ratio: 0.750 },
  { code: 'EV-08', slug: 'star',                 title: 'Star',                   cat: 'everyday', ratio: 0.667 },
  { code: 'EV-09', slug: 'handful-of-stars',     title: 'A Handful of Stars',     cat: 'everyday', ratio: 0.750 },
  { code: 'EV-10', slug: 'wishing-tree',         title: 'The Wishing Tree',       cat: 'everyday', ratio: 0.802 },
  { code: 'EV-11', slug: 'yellow',               title: 'Yellow',                 cat: 'everyday', ratio: 0.969 }
];

window.CATS = {
  flowers:  'FLOWERS',
  words:    'WORDS',
  newyork:  'NEW YORK',
  everyday: 'EVERYDAY'
};
