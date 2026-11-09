/* Toki, the crayon baby bunny, as in the app (Toki.swift): one drawing per
   mood that breathes, bounces to the voice while listening, bobs while it
   translates and dozes when paused. Poked, it does a binky, the twisting
   hop a happy rabbit does, four times with a soft "pong" on each landing.

   Markup:  <span class="toki" data-mood="idle" data-follow style="--size:120px"></span>
   Script:  Toki.get(el).set({ mood: 'happy' }); Toki.get(el).hop({ sound: true }); */
(function () {
  'use strict';

  var MOODS = ['idle', 'listening', 'talking', 'happy', 'sleepy', 'surprised', 'worried'];
  var script = document.currentScript && document.currentScript.src;
  var base = script ? script.replace(/js\/toki\.js.*$/, '') : 'assets/';
  var art = function (name) { return base + 'img/toki/' + name + '.webp'; };

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var instances = [];
  var pointer = null;
  var hopSound = null;

  // Every drawing is fetched once, so a mood change never flashes blank.
  MOODS.concat(['hop1', 'hop2']).forEach(function (name) { var i = new Image(); i.src = art(name); });

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function r3(v) { return Math.round(v * 1000) / 1000; }

  function playHop() {
    try {
      if (!hopSound) hopSound = new Audio(base + 'audio/hop.m4a');
      var s = hopSound.cloneNode();
      s.volume = 0.55;
      var p = s.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  /* ---------------------------------------------------------------- motion */

  function motion(mood, level, t) {
    var m = { sx: 1, sy: 1, bob: 0, tilt: 0 };
    if (t <= 0) return m;
    var TAU = Math.PI * 2;
    var breath = Math.sin(t * TAU * (mood === 'sleepy' ? 0.22 : 0.45));
    var squash = mood === 'sleepy' ? 0.025 : 0.014;
    m.sy = 1 - squash * breath;
    m.sx = 1 + squash * breath;
    if (mood === 'listening') {
      var bounce = clamp(level, 0, 1) * 0.08;
      m.sy += bounce; m.sx -= bounce * 0.5; m.bob = -bounce * 0.3;
    } else if (mood === 'talking') {
      m.bob = -Math.abs(Math.sin(t * TAU * 1.6)) * 0.03;
      m.tilt = Math.sin(t * TAU * 0.8) * 2;
    } else if (mood === 'happy') {
      m.bob = -Math.abs(Math.sin(t * TAU * 0.9)) * 0.04;
    } else if (mood === 'worried') {
      m.tilt = Math.sin(t * TAU * 5) * 1.2;
    } else if (mood === 'sleepy') {
      m.tilt = Math.sin(t * TAU * 0.11) * 3 - 3;
    }
    return m;
  }

  /* -------------------------------------------------------------- instance */

  function Instance(el) {
    this.el = el;
    this.mood = MOODS.indexOf(el.getAttribute('data-mood')) >= 0 ? el.getAttribute('data-mood') : 'idle';
    this.follow = el.hasAttribute('data-follow');
    this.level = 0;
    this.lean = 0;
    this.visible = true;
    this.hopping = false;
    this.offset = Math.random() * 20;
    el.innerHTML = '<span class="tk-body"><img class="tk-art" alt="" draggable="false" /></span>' +
                   '<span class="tk-z" aria-hidden="true"><i>z</i><i>z</i><i>z</i></span>';
    this.body = el.querySelector('.tk-body');
    this.img = el.querySelector('.tk-art');
    this.show(this.mood);
    el._toki = this;
  }

  Instance.prototype.show = function (name) {
    var src = art(name);
    if (this.img.getAttribute('src') !== src) this.img.setAttribute('src', src);
  };

  Instance.prototype.render = function (t) {
    if (this.hopping) return;
    var level = this.level;
    if (this.mood === 'listening' && this.el.hasAttribute('data-level-auto')) {
      level = 0.35 + 0.3 * Math.sin(t * 7.3) + 0.25 * Math.sin(t * 12.1 + 1);
    }
    // Leans a little toward the pointer, the way it looks around in the app.
    var target = 0;
    if (this.follow && pointer && performance.now() - pointer.at < 4000) {
      var rect = this.el.getBoundingClientRect();
      target = clamp((pointer.x - (rect.left + rect.width / 2)) / 300, -1, 1) * 5;
    }
    this.lean += (target - this.lean) * 0.08;
    var m = motion(this.mood, level, t);
    this.body.style.transform = 'translateY(' + r3(m.bob * 100) + '%) rotate(' + r3(m.tilt + this.lean) +
      'deg) scale(' + r3(m.sx) + ',' + r3(m.sy) + ')';
  };

  Instance.prototype.set = function (props) {
    if ('mood' in props && MOODS.indexOf(props.mood) >= 0) {
      this.mood = props.mood;
      this.el.setAttribute('data-mood', props.mood);
      if (!this.hopping) this.show(props.mood);
    }
    if ('level' in props) this.level = props.level;
    if (reduceMotion) this.render(0);
    return this;
  };

  /* A binky: two drawings, the direction changing every hop, four hops in
     about 1.1 s. `sound` only when the visitor poked it. */
  Instance.prototype.hop = function (opts) {
    if (reduceMotion || this.hopping) return this;
    var self = this, el = this.el, n = 0, total = 4;
    var sound = opts && opts.sound;
    this.hopping = true;
    this.body.style.transform = '';
    function step() {
      if (n >= total) {
        el.classList.remove('hop', 'hop-flip');
        self.hopping = false;
        self.show(self.mood);
        return;
      }
      self.show(n % 2 ? 'hop2' : 'hop1');
      el.classList.remove('hop');
      el.classList.toggle('hop-flip', n % 2 === 1);
      void el.offsetWidth;
      el.classList.add('hop');
      if (sound) setTimeout(playHop, 150);
      n += 1;
      setTimeout(step, 275);
    }
    step();
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
      instances.push(new Instance(el));
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
