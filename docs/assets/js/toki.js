/* Toki, the jelly speech-bubble mascot, drawn as SVG.
   Geometry, palette and motion mirror Toki.swift in the app, in a
   100-unit box: it breathes, blinks, glances around, bounces while
   listening, moves its mouth while translating and dozes when paused.

   Markup:  <div class="toki" data-mood="idle" data-style="blue"
                 data-tail="leading" data-follow style="--size:120px"></div>
   Script:  Toki.get(el).set({ mood: 'happy', gaze: 0.4 }); Toki.get(el).hop(); */
(function () {
  'use strict';

  var PALETTE = {
    blue: { top: '#73BDFF', bottom: '#1C73F7', face: '#FFFFFF', cheek: 'rgba(255,184,214,.85)', blob: 'rgba(26,87,219,.28)', shine: 'rgba(255,255,255,.55)' },
    milk: { top: '#FFFFFF', bottom: '#DBE3FF', face: '#1A5CEB', cheek: 'rgba(255,140,184,.5)', blob: 'rgba(51,61,153,.22)', shine: 'rgba(255,255,255,.9)' }
  };

  // Squircle body and curled tail as one path, same winding, so a
  // translucent fill (the blob shadow) never doubles where they overlap.
  var BODY = 'M37.7 10H62.3A31.7 31.7 0 0 1 94 41.7V50.3A31.7 31.7 0 0 1 62.3 82H37.7' +
             'A31.7 31.7 0 0 1 6 50.3V41.7A31.7 31.7 0 0 1 37.7 10Z' +
             'M46 80Q26 93 12 95Q22 88 22 74Z';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var instances = [];
  var uid = 0;
  var pointer = null;

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function r1(v) { return Math.round(v * 100) / 100; }

  /* ---------------------------------------------------------------- motion */

  function motion(mood, level, gaze, gazeY, t) {
    var m = { sx: 1, sy: 1, bob: 0, blink: 0, gx: 0, gy: 0, open: 0 };
    if (t <= 0) {
      m.gx = gaze == null ? 0 : gaze;
      m.gy = gazeY || 0;
      m.open = mood === 'talking' ? 0.6 : 0;
      return m;
    }
    var TAU = Math.PI * 2;
    var breath = Math.sin(t * TAU * (mood === 'sleepy' ? 0.22 : 0.45));
    var squash = mood === 'sleepy' ? 0.03 : 0.018;
    m.sy = 1 - squash * breath;
    m.sx = 1 + squash * breath;

    if (mood === 'listening') {
      var bounce = clamp(level, 0, 1) * 0.10;
      m.sy += bounce; m.sx -= bounce * 0.6; m.bob = -bounce * 0.25;
    } else if (mood === 'talking') {
      m.open = (Math.sin(t * TAU * 3.1) + 1) / 2;
      m.bob = Math.sin(t * TAU * 1.55) * 0.012;
    } else if (mood === 'happy') {
      m.bob = Math.abs(Math.sin(t * TAU * 0.9)) * -0.03;
    } else if (mood === 'worried') {
      m.sx += Math.sin(t * TAU * 6) * 0.006;
    }

    // Blink about every 3.8 s, a double blink every third time.
    if (mood !== 'sleepy' && mood !== 'happy') {
      var period = 3.8, cycle = Math.floor(t / period), phase = t % period, win = 0.16;
      if (phase < win) m.blink = Math.sin(phase / win * Math.PI);
      else if (cycle % 3 === 2 && phase > 0.28 && phase < 0.28 + win) m.blink = Math.sin((phase - 0.28) / win * Math.PI);
    }

    if (gaze != null) {
      m.gx = gaze; m.gy = gazeY || 0;
    } else if (mood === 'idle') {
      m.gx = clamp(Math.sin(t * 0.55) + 0.35 * Math.sin(t * 1.3), -1, 1);
      m.gy = Math.sin(t * 0.4) * 0.3;
    }
    return m;
  }

  /* ------------------------------------------------------------------ face */

  function face(mood, m, pal) {
    var f = pal.face, out = '';
    var cx = 50 + m.gx * 4.5, ey = 40 + m.gy * 2, gap = 13.5, st = 3.4;
    var stroke = function (d, w) {
      return '<path d="' + d + '" fill="none" stroke="' + f + '" stroke-width="' + w + '" stroke-linecap="round"/>';
    };

    out += '<ellipse cx="25.5" cy="55.25" rx="5.5" ry="3.25" fill="' + pal.cheek + '"/>' +
           '<ellipse cx="74.5" cy="55.25" rx="5.5" ry="3.25" fill="' + pal.cheek + '"/>';

    [-1, 1].forEach(function (dx) {
      var x = r1(cx + dx * gap), y = r1(ey);
      if (mood === 'happy') {
        out += stroke('M' + (x - 5) + ' ' + (y + 2) + 'Q' + x + ' ' + (y - 6) + ' ' + (x + 5) + ' ' + (y + 2), st);
      } else if (mood === 'sleepy') {
        out += stroke('M' + (x - 4.5) + ' ' + y + 'Q' + x + ' ' + (y + 4) + ' ' + (x + 4.5) + ' ' + y, st * 0.9);
      } else if (mood === 'surprised') {
        out += '<circle cx="' + x + '" cy="' + y + '" r="5.2" fill="' + f + '"/>';
      } else {
        var full = mood === 'worried' ? 11 : (mood === 'listening' ? 15 : 13.5);
        var h = r1(Math.max(3.15, full * (1 - m.blink * 0.85)));
        out += '<rect x="' + (x - 3.5) + '" y="' + r1(y - h / 2) + '" width="7" height="' + h + '" rx="3.5" fill="' + f + '"/>';
      }
      if (mood === 'worried') {
        out += stroke('M' + r1(x - dx * 4.5) + ' ' + r1(y - 12.5) + 'L' + r1(x + dx * 4) + ' ' + r1(y - 9.5), st * 0.7);
      }
    });

    var mx = r1(cx), my = 55.5;
    if (mood === 'happy') {
      out += '<path d="M' + (mx - 7.5) + ' 54.3Q' + mx + ' 65.5 ' + (mx + 7.5) + ' 54.3Z" fill="' + f + '"/>';
    } else if (mood === 'listening' || mood === 'surprised') {
      var big = mood === 'surprised';
      out += '<ellipse cx="' + mx + '" cy="' + my + '" rx="' + (big ? 3.5 : 2.75) + '" ry="' + (big ? 4 : 3) + '" fill="' + f + '"/>';
    } else if (mood === 'talking') {
      var mh = r1(1.8 + 6 * m.open);
      out += '<rect x="' + (mx - 4.25) + '" y="' + r1(my - mh / 2) + '" width="8.5" height="' + mh + '" rx="' + r1(Math.min(8.5, mh) / 2) + '" fill="' + f + '"/>';
    } else if (mood === 'worried') {
      out += stroke('M' + (mx - 5) + ' 56.5Q' + (mx - 2.5) + ' 53.5 ' + mx + ' 56Q' + (mx + 2.5) + ' 58.5 ' + (mx + 5) + ' 56.5', st * 0.8);
    } else if (mood === 'sleepy') {
      out += '<circle cx="' + mx + '" cy="' + my + '" r="2.2" fill="' + f + '"/>';
    } else {
      out += stroke('M' + (mx - 5.5) + ' 54.5Q' + mx + ' 60.5 ' + (mx + 5.5) + ' 54.5', st);
    }
    return out;
  }

  function sleepyZs(t) {
    var out = '';
    for (var i = 0; i < 3; i++) {
      var phase = (t * 0.45 + i / 3) % 1;
      var size = 12 + 5 * i;
      out += '<text x="' + r1(88 + phase * 14) + '" y="' + r1(12 - phase * 30) + '" font-size="' + size +
             '" font-weight="900" fill="#6B8CF2" opacity="' + r1(Math.sin(phase * Math.PI)) +
             '" font-family="ui-rounded, -apple-system, system-ui, sans-serif">z</text>';
    }
    return out;
  }

  /* -------------------------------------------------------------- instance */

  function Instance(el) {
    this.el = el;
    this.mood = el.getAttribute('data-mood') || 'idle';
    this.style = el.getAttribute('data-style') === 'milk' ? 'milk' : 'blue';
    this.trailing = el.getAttribute('data-tail') === 'trailing';
    this.follow = el.hasAttribute('data-follow');
    this.level = 0;
    this.gaze = null;
    this.gazeY = 0;
    this.visible = true;
    this.offset = Math.random() * 20;
    this.build();
    el._toki = this;
  }

  Instance.prototype.build = function () {
    var pal = PALETTE[this.style];
    var id = 'tokiGrad' + (uid++);
    var flip = this.trailing ? ' transform="translate(100 0) scale(-1 1)"' : '';
    this.el.innerHTML =
      '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
        '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">' +
          '<stop offset="0" stop-color="' + pal.top + '"/><stop offset="1" stop-color="' + pal.bottom + '"/>' +
        '</linearGradient></defs>' +
        '<g class="tk-motion">' +
          '<g' + flip + '>' +
            '<path d="' + BODY + '" fill="' + pal.blob + '" transform="translate(-3 6) rotate(-6 50 50)"/>' +
            '<path d="' + BODY + '" fill="url(#' + id + ')"/>' +
            '<rect x="17" y="20.5" width="20" height="7" rx="3.5" fill="' + pal.shine + '" transform="rotate(-28 27 24)"/>' +
            '<circle cx="41" cy="18" r="2.25" fill="' + pal.shine + '"/>' +
          '</g>' +
          '<g class="tk-face"></g>' +
        '</g>' +
        '<g class="tk-z"></g>' +
      '</svg>';
    this.motionG = this.el.querySelector('.tk-motion');
    this.faceG = this.el.querySelector('.tk-face');
    this.zG = this.el.querySelector('.tk-z');
    this.render(0);
  };

  Instance.prototype.render = function (t) {
    var level = this.level;
    if (this.mood === 'listening' && this.el.hasAttribute('data-level-auto')) {
      level = 0.35 + 0.3 * Math.sin(t * 7.3) + 0.25 * Math.sin(t * 12.1 + 1);
    }
    var gaze = this.gaze, gazeY = this.gazeY;
    if (this.follow && pointer && performance.now() - pointer.at < 4000) {
      var rect = this.el.getBoundingClientRect();
      var tx = clamp((pointer.x - (rect.left + rect.width / 2)) / 260, -1, 1);
      var ty = clamp((pointer.y - (rect.top + rect.height * 0.45)) / 260, -1, 1);
      this.fx = this.fx == null ? tx : this.fx + (tx - this.fx) * 0.14;
      this.fy = this.fy == null ? ty : this.fy + (ty - this.fy) * 0.14;
      gaze = this.fx; gazeY = this.fy;
    } else {
      this.fx = this.fy = null;
    }

    var m = motion(this.mood, level, gaze, gazeY, t);
    this.motionG.setAttribute('transform',
      'translate(0 ' + r1(m.bob * 100) + ') translate(50 100) scale(' + r1(m.sx * 1000) / 1000 + ' ' + r1(m.sy * 1000) / 1000 + ') translate(-50 -100)');
    this.faceG.innerHTML = face(this.mood, m, PALETTE[this.style]);
    this.zG.innerHTML = this.mood === 'sleepy' && t > 0 ? sleepyZs(t) : '';
  };

  Instance.prototype.set = function (props) {
    if ('mood' in props) { this.mood = props.mood; this.el.setAttribute('data-mood', props.mood); }
    if ('gaze' in props) this.gaze = props.gaze;
    if ('gazeY' in props) this.gazeY = props.gazeY;
    if ('level' in props) this.level = props.level;
    if (reduceMotion) this.render(0);
    return this;
  };

  Instance.prototype.hop = function () {
    if (reduceMotion) return this;
    var el = this.el;
    el.classList.remove('hop');
    void el.offsetWidth;
    el.classList.add('hop');
    return this;
  };

  /* ------------------------------------------------------------------ loop */

  function frame(ts) {
    var t = ts / 1000;
    for (var i = 0; i < instances.length; i++) {
      var inst = instances[i];
      if (inst.visible) inst.render(t + inst.offset);
    }
    requestAnimationFrame(frame);
  }

  function mountAll(root) {
    var els = (root || document).querySelectorAll('.toki');
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.target._toki) e.target._toki.visible = e.isIntersecting; });
    }, { rootMargin: '80px' }) : null;

    Array.prototype.forEach.call(els, function (el) {
      if (el._toki) return;
      var inst = new Instance(el);
      el.addEventListener('animationend', function () { el.classList.remove('hop'); });
      instances.push(inst);
      if (io) io.observe(el);
    });
  }

  window.addEventListener('pointermove', function (e) {
    pointer = { x: e.clientX, y: e.clientY, at: performance.now() };
  }, { passive: true });

  window.Toki = {
    mount: mountAll,
    get: function (el) { return el && el._toki; },
    reduceMotion: reduceMotion
  };

  mountAll();
  if (!reduceMotion) requestAnimationFrame(frame);
})();
