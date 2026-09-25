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
  }


  /* ---------- bar ------------------------------------------ */

  /* The bar is transparent over the top of the page so the deck and the
     grid run under it, and only takes a background once you scroll. */
  function initBar() {
    var on = false;
    function check() {
      var past = window.scrollY > 8;
      if (past === on) return;
      on = past;
      document.body.classList.toggle('scrolled', past);
    }
    check();
    window.addEventListener('scroll', check, { passive: true });
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
    initBar();
    initGrid();
    initViewer();
    document.querySelectorAll('img').forEach(onLoad);
    var y = document.getElementById('yr');
    if (y) y.textContent = new Date().getFullYear();
  });
})();
