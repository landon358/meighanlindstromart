/* ============================================================
   MEIGHAN LINDSTROM — interaction
   ============================================================ */
(function () {
  'use strict';

  var W = window.WORKS || [];

  var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  var CALM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DIST = CALM ? 0 : 46;   /* px the print travels on change */

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function onLoad(img) {
    if (img.complete && img.naturalWidth) { img.classList.add('is-loaded'); return; }
    img.addEventListener('load', function () { img.classList.add('is-loaded'); }, { once: true });
  }

  function load(src) {
    return new Promise(function (res) {
      var i = new Image();
      i.onload = function () { res(i); };
      i.onerror = function () { res(null); };
      i.src = src;
    });
  }

  /* ---------- menu ------------------------------------------ */

  function initMenu() {
    var burger = document.querySelector('.burger');
    var menu = document.querySelector('.menu');
    if (!burger || !menu) return;

    var menuReturn = null;

    function set(open) {
      if (open) menuReturn = document.activeElement;
      document.body.classList.toggle('menu-open', open);
      burger.textContent = open ? 'Close' : 'Menu';
      burger.setAttribute('aria-expanded', String(open));
      if (open) {
        var first = menu.querySelector('a');
        if (first) first.focus();
      } else if (menuReturn && menuReturn.focus) {
        menuReturn.focus();
        menuReturn = null;
      }
    }
    burger.addEventListener('click', function () {
      set(!document.body.classList.contains('menu-open'));
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) set(false);
    });
    window.addEventListener('resize', function () { if (innerWidth >= 860) set(false); });
  }

  /* ---------- print tile ------------------------------------ */

  function tile(w) {
    var a = document.createElement('a');
    a.className = 'item';
    a.href = 'images/full/' + w.slug + '.jpg';
    a.setAttribute('data-slug', w.slug);
    a.setAttribute('data-cat', w.cat);
    /* width/height carry the intrinsic ratio so nothing reflows on load */
    var ih = 1000, iw = Math.round(1000 * w.ratio);
    a.innerHTML =
      '<span class="item__box">' +
        '<img src="images/thumb/' + w.slug + '.jpg" alt="' + w.title +
        ' — drawing by Meighan Lindstrom" width="' + iw + '" height="' + ih +
        '" loading="lazy" decoding="async">' +
      '</span>' +
      '<span class="item__cap">' + w.title + '</span>';
    onLoad(a.querySelector('img'));
    return a;
  }

  function initGrid() {
    var grid = document.querySelector('[data-grid]');
    if (grid) W.forEach(function (w) { grid.appendChild(tile(w)); });

    var trio = document.querySelector('[data-scatter]');
    if (trio) {
      (trio.getAttribute('data-scatter') || '').split(',').forEach(function (s) {
        var w = W.find(function (x) { return x.slug === s.trim(); });
        if (w) trio.appendChild(tile(w));
      });
    }
  }


  /* ---------- home: the deck ------------------------------- */

  /* One continuous chain of prints. Each set picks up exactly where the
     last one stopped, and the heading turns a few degrees per card, so
     what builds is a single line arcing across the page rather than
     clusters scattered around it. The chain is capped at MAX_CARDS, so
     once it is full the oldest print goes exactly as each new one
     lands — a fixed-length snake crawling across the stage. Nothing
     fades: cards appear and vanish in a single frame. */
  function initDeck() {
    var host = document.querySelector('[data-deck]');
    if (!host || !W.length) return;
    if (CALM) return;                       /* decorative — skip entirely */

    var MAX_CARDS = 11;                     /* longest the tail may get */
    var HOLD_MIN = 2400, HOLD_MAX = 3200;   /* the pause after a set finishes */
    var DEAL     = 500;                     /* gap between prints inside a set */
    var TURN     = 0.075;                   /* radians per card — the arc */

    var pool = [], live = [], setNo = 0, z = 1;   /* live is flat, in arrival order */
    var x = 0, y = 0, heading = 0, spin = 1, walking = false;

    /* a shuffled running order, reshuffled once it is used up, so no
       print repeats until every other one has had a turn */
    var order = [], orderAt = 0;
    function reshuffle() {
      order = W.map(function (_, i) { return i; });
      for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = order[i]; order[i] = order[j]; order[j] = t;
      }
      orderAt = 0;
    }
    function nextWork() {
      if (orderAt >= order.length) reshuffle();
      return W[order[orderAt++]];
    }
    reshuffle();

    function take() {
      var el = pool.pop();
      if (!el) {
        el = document.createElement('div');
        el.className = 'card';
        var im = document.createElement('img');
        im.alt = '';
        im.decoding = 'async';
        el.appendChild(im);
        host.appendChild(el);
      }
      return el;
    }

    /* A print becomes visible, and if that puts the chain over its
       limit the oldest one goes in the same frame. Head and tail
       therefore move at identical pace without a second timer. */
    function reveal(el) {
      el.style.display = '';
      live.push(el);
      while (live.length > MAX_CARDS) {
        var old = live.shift();
        old.style.display = 'none';
        pool.push(old);              /* only reusable once actually hidden */
      }
    }

    function deal() {
      var w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) { setTimeout(deal, 400); return; }

      var cw   = Math.max(92, Math.min(180, w * 0.125));
      var step = cw * 0.32;                 /* tighter shingle, more of each card buried */
      var pad  = cw / 2 + 10;

      if (!walking) {                       /* a different path every load */
        x = w * (0.22 + Math.random() * 0.56);
        y = h * (0.24 + Math.random() * 0.52);
        heading = Math.random() * Math.PI * 2;
        spin = Math.random() < 0.5 ? -1 : 1;   /* curves left or right */
        walking = true;
      }

      var n = setNo === 0 ? 3 : 3 + Math.floor(Math.random() * 5);   /* 3–7 */

      for (var i = 0; i < n; i++) {
        heading += TURN * spin;

        /* if the head wanders past a comfortable ellipse, bend it back
           toward the middle rather than letting it run off the edge */
        var nx = (x - w / 2) / (w * 0.40);
        var ny = (y - h / 2) / (h * 0.36);
        var out = Math.hypot(nx, ny);
        if (out > 1) {
          var toMid = Math.atan2(h / 2 - y, w / 2 - x);
          var diff  = Math.atan2(Math.sin(toMid - heading), Math.cos(toMid - heading));
          heading += diff * Math.min(0.5, (out - 1) * 1.2 + 0.15);
        }

        x += Math.cos(heading) * step;
        y += Math.sin(heading) * step;
        x = Math.max(pad, Math.min(w - pad, x));
        y = Math.max(pad, Math.min(h - pad, y));

        var el  = take();
        var wk  = nextWork();
        var img = el.querySelector('img');
        if (img.getAttribute('src') !== 'images/thumb/' + wk.slug + '.jpg') {
          img.src = 'images/thumb/' + wk.slug + '.jpg';
        }
        el.style.setProperty('--w', cw + 'px');
        el.style.left    = x + 'px';
        el.style.top     = y + 'px';
        el.style.zIndex  = ++z;
        el.style.display = 'none';

        /* the walk is computed now so the chain stays in order; only the
           reveal waits its turn, and it is still a single frame each */
        setTimeout(function (node) {
          return function () { reveal(node); };
        }(el), i * DEAL);
      }

      setNo++;

      setTimeout(deal, n * DEAL + HOLD_MIN + Math.random() * (HOLD_MAX - HOLD_MIN));
    }

    /* warm the opening hand so the first set does not land piecemeal */
    Promise.all(order.slice(0, 3).map(function (i) {
      return load('images/thumb/' + W[i].slug + '.jpg');
    })).then(function () { setTimeout(deal, 400); });
  }

  /* ---------- home: the clock ------------------------------ */

  /* The viewer's own date and time, to the millisecond. Intl with no
     locale or zone argument resolves to whatever the browser is set to,
     so this is local wherever it is read. Decorative, so aria-hidden —
     a value changing 60 times a second is noise to a screen reader. */
  function initClock() {
    var el = document.querySelector('[data-clock]');
    if (!el) return;

    /* all numeric, but still ordered the way the viewer's locale writes
       dates — 09/25/2026 in the US, 25/09/2026 in most of Europe */
    var day = new Intl.DateTimeFormat(undefined, {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    function p2(n) { return (n < 10 ? '0' : '') + n; }
    function p3(n) { return (n < 10 ? '00' : n < 100 ? '0' : '') + n; }

    function tick() {
      var d = new Date();
      var t = p2(d.getHours()) + ':' + p2(d.getMinutes()) + ':' + p2(d.getSeconds());
      if (!CALM) t += '.' + p3(d.getMilliseconds());
      el.textContent = day.format(d) + '  ' + t;
      if (!CALM) requestAnimationFrame(tick);
    }

    tick();
    /* calmer setting: still a clock, just not a blur of digits */
    if (CALM) setInterval(tick, 1000);
  }

  /* ---------- filters --------------------------------------- */

  function initFilters() {
    var buttons = document.querySelectorAll('.filter');
    if (!buttons.length) return;
    var count = document.querySelector('[data-count]');

    function apply(cat) {
      var shown = 0;
      document.querySelectorAll('.item').forEach(function (el) {
        var hit = cat === 'all' || el.getAttribute('data-cat') === cat;
        el.classList.toggle('is-hidden', !hit);
        if (hit) shown++;
      });
      if (count) count.textContent = shown;
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === cat));
      });
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
    });
    apply('all');
  }

  /* ---------- viewer ---------------------------------------- */

  function initViewer() {
    var v = document.querySelector('.viewer');
    if (!v) return;

    var layers = v.querySelectorAll('.vlayer');
    var title  = v.querySelector('[data-v-title]');
    var count  = v.querySelector('[data-v-count]');
    var closer = v.querySelector('[data-v-close]');

    /* The print element is created the moment it gets a source, never
       before — so the page never carries a source-less image node. */
    function printEl(layer) {
      var el = layer.querySelector('.vlayer__img');
      if (!el) {
        el = document.createElement('img');
        el.className = 'vlayer__img';
        el.decoding = 'async';
        layer.querySelector('.vlayer__fig').appendChild(el);
      }
      return el;
    }

    var active = 0;          /* index into layers */
    var list = [];
    var i = 0;
    var seq = 0;             /* abandons superseded transitions */
    var restoreTo = null;    /* what had focus before the dialog opened */

    function place(el, x, opacity, animate) {
      /* will-change is a hint for the duration of the move, not a
         permanent state — it holds a compositor layer while set */
      el.style.willChange = animate ? 'transform, opacity' : '';
      if (animate) {
        clearTimeout(el._wc);
        el._wc = setTimeout(function () { el.style.willChange = ''; }, 900);
      }
      el.style.transition = animate
        ? 'transform .72s ' + EASE + ', opacity .46s ' + EASE
        : 'none';
      el.style.transform = 'translate3d(' + x + 'px,0,0)';
      el.style.opacity = opacity;
    }

    function visible() {
      return Array.prototype.slice
        .call(document.querySelectorAll('.item:not(.is-hidden)'))
        .map(function (el) { return el.getAttribute('data-slug'); })
        .filter(Boolean);
    }

    function show(n, dir) {
      if (!list.length) return;
      var my = ++seq;
      i = (n + list.length) % list.length;

      var w = W.find(function (x) { return x.slug === list[i]; });
      if (!w) return;

      count.textContent = pad(i + 1) + ' / ' + pad(list.length);
      title.classList.remove('is-in');

      load('images/full/' + w.slug + '.jpg').then(function (full) {
        if (my !== seq) return;              /* a newer change won */

        var cur  = layers[active];
        var next = layers[active ? 0 : 1];
        var img  = printEl(next);

        img.src = full ? full.src : 'images/full/' + w.slug + '.jpg';
        img.alt = w.title + ' — drawing by Meighan Lindstrom';

        place(next, dir * DIST, 0, false);
        next.offsetHeight;                   /* commit the start state */
        next.classList.add('is-active');
        place(next, 0, 1, true);

        if (cur !== next) {
          cur.classList.remove('is-active');
          place(cur, -dir * DIST, 0, true);
        }
        active = active ? 0 : 1;

        title.textContent = w.title;
        title.classList.add('is-in');
      });
    }

    function open(slug) {
      list = visible();
      var n = list.indexOf(slug);
      layers.forEach(function (l) {
        l.classList.remove('is-active');
        place(l, 0, 0, false);
      });
      active = 1;                             /* so the first show uses layer 0 */
      restoreTo = document.activeElement;
      v.classList.add('is-open');
      v.setAttribute('aria-hidden', 'false');
      v.setAttribute('aria-modal', 'true');
      document.documentElement.style.overflow = 'hidden';
      show(n < 0 ? 0 : n, 0);
      closer.focus();
    }

    function close() {
      v.classList.remove('is-open');
      v.setAttribute('aria-hidden', 'true');
      v.removeAttribute('aria-modal');
      document.documentElement.style.overflow = '';
      if (restoreTo && restoreTo.focus) restoreTo.focus();
      restoreTo = null;
    }

    /* keep Tab inside the dialog — the grid behind it is still in the
       document and would otherwise swallow every keystroke */
    function trap(e) {
      var f = v.querySelectorAll('button');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (!v.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    document.addEventListener('click', function (e) {
      var el = e.target.closest('.item');
      if (!el) return;
      e.preventDefault();
      open(el.getAttribute('data-slug'));
    });

    v.querySelector('[data-v-close]').addEventListener('click', close);
    v.querySelector('[data-v-prev]').addEventListener('click', function () { show(i - 1, -1); });
    v.querySelector('[data-v-next]').addEventListener('click', function () { show(i + 1,  1); });
    v.querySelector('.viewer__stage').addEventListener('click', function (e) {
      if (e.target === e.currentTarget) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!v.classList.contains('is-open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'Tab')        trap(e);
      if (e.key === 'ArrowLeft')  show(i - 1, -1);
      if (e.key === 'ArrowRight') show(i + 1,  1);
    });
  }

  /* ---------- boot ------------------------------------------ */

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initGrid();
    initDeck();
    initClock();
    initFilters();
    initViewer();
    document.querySelectorAll('img').forEach(onLoad);
    var y = document.getElementById('yr');
    if (y) y.textContent = new Date().getFullYear();
  });
})();
