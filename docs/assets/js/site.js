/* Landing page interactions. Every Toki on the page is drawn and
   animated by toki.js; this file only decides what each one does. */
(function () {
  'use strict';

  var reduce = window.Toki ? Toki.reduceMotion
    : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id) { return document.getElementById(id); }
  function toki(id) { return window.Toki && Toki.get(typeof id === 'string' ? $(id) : id); }

  /* ------------------------------------------------ App Store (coming soon) */
  var toast = $('toast'), toastTimer = null;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }
  document.querySelectorAll('[data-soon]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      showToast('App Store 출시를 준비하고 있습니다.');
    });
  });

  /* ------------------------------------------ Hero greeter: hello in 9 tongues */
  (function () {
    var btn = $('greeter'), bubble = $('greetBubble'), t = toki('heroToki');
    if (!btn || !t) return;
    var HELLOS = ['안녕하세요', 'Hello', 'こんにちは', '你好', 'Hola', 'Bonjour', 'Hallo', 'Ciao', 'Olá'];
    var i = 0, moodTimer = null, cycle = null;

    function next(fromTap) {
      i = (i + 1) % HELLOS.length;
      bubble.classList.remove('pop');
      void bubble.offsetWidth;
      bubble.textContent = HELLOS[i];
      bubble.classList.add('pop');
      t.set({ mood: fromTap ? 'happy' : 'talking' });
      if (fromTap) t.hop();
      clearTimeout(moodTimer);
      moodTimer = setTimeout(function () { t.set({ mood: 'idle' }); }, fromTap ? 1100 : 700);
    }
    function schedule() {
      clearInterval(cycle);
      if (!reduce) cycle = setInterval(function () { if (!document.hidden) next(false); }, 3200);
    }
    btn.addEventListener('click', function () { next(true); schedule(); });
    schedule();
  })();

  /* --------------------------------------------- Rotating place in the headline */
  (function () {
    var el = $('rotor');
    if (!el || reduce) return;
    var WORDS = ['기내에서도', '여행지 골목에서도', '인터뷰 현장에서도', '바이어 미팅에서도', '신호 없는 산골에서도'];
    var w = 0, i = WORDS[0].length, deleting = true;
    function tick() {
      var word = WORDS[w];
      if (!deleting) {
        i++;
        el.textContent = word.slice(0, i);
        if (i >= word.length) { deleting = true; return setTimeout(tick, 1700); }
        setTimeout(tick, 95);
      } else {
        i--;
        el.textContent = word.slice(0, i);
        if (i <= 0) { deleting = false; w = (w + 1) % WORDS.length; return setTimeout(tick, 260); }
        setTimeout(tick, 45);
      }
    }
    setTimeout(tick, 2200);
  })();

  /* ----------------------------------------------------------- Reveal on scroll */
  (function () {
    var items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ------------------------------------------------ Ambient videos: on screen only */
  (function () {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !reduce) e.target.play().catch(function () {});
        else e.target.pause();
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.cine-video, .cine-portrait-video').forEach(function (v) {
      if (reduce) v.removeAttribute('autoplay');
      io.observe(v);
    });
  })();

  /* ------------------------------------------- Cabin card: live caption bubble */
  (function () {
    var box = $('cineCaption'), src = $('cineSrc'), dst = $('cineDst'), t = toki('cineToki');
    if (!box || reduce) return;
    var LINES = [
      ['Is this seat taken?', '이 자리 비어 있나요?'],
      ['Not at all, go ahead.', '아니요, 앉으셔도 됩니다.'],
      ['Where are you headed?', '어디로 가시는 길인가요?'],
      ['Seoul, for the first time!', '서울이요, 처음 가 봅니다!']
    ];
    var i = 0;
    setInterval(function () {
      if (document.hidden) return;
      box.classList.add('swap');
      if (t) t.set({ mood: 'listening' });
      setTimeout(function () {
        i = (i + 1) % LINES.length;
        src.textContent = LINES[i][0];
        dst.textContent = LINES[i][1];
        box.classList.remove('swap');
        setTimeout(function () { if (t) t.set({ mood: 'talking' }); }, 500);
      }, 380);
    }, 3400);
  })();

  /* ---------------------------------------------------- Mood cards: tap to hop */
  document.querySelectorAll('.mood').forEach(function (card) {
    card.addEventListener('click', function () {
      var t = toki(card.querySelector('.toki'));
      if (t) t.hop();
    });
  });

  /* ------------------------------------ Language orbit: Toki carries the words */
  (function () {
    var stage = $('orbitStage');
    if (!stage) return;
    var chips = [].slice.call(document.querySelectorAll('#orbitChips .lang-chip'));
    var arcs = $('orbitArcs'), dots = $('orbitDots'), defs = $('orbitDefs');
    var core = toki('orbitToki');
    var SVGNS = 'http://www.w3.org/2000/svg';
    var CX = 230, CY = 230, R = 176, uid = 0, pts = [];

    chips.forEach(function (chip, i) {
      var a = (-90 + i * (360 / chips.length)) * Math.PI / 180;
      var x = CX + R * Math.cos(a), y = CY + R * Math.sin(a);
      chip.style.left = (x / 460 * 100) + '%';
      chip.style.top = (y / 460 * 100) + '%';
      pts.push({ x: x, y: y, el: chip });
    });

    if (reduce) return;

    function arcPath(a, b) {
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      // Bow toward the centre so every route passes by Toki.
      var cx = mx + (CX - mx) * 0.6, cy = my + (CY - my) * 0.6;
      return 'M' + a.x + ',' + a.y + ' Q' + cx + ',' + cy + ' ' + b.x + ',' + b.y;
    }

    function flight() {
      var i = Math.floor(Math.random() * pts.length);
      var j = Math.floor(Math.random() * (pts.length - 1));
      if (j >= i) j++;
      var from = pts[i], to = pts[j], id = 'oarc' + (uid++);

      var grad = document.createElementNS(SVGNS, 'linearGradient');
      grad.setAttribute('id', id);
      grad.setAttribute('gradientUnits', 'userSpaceOnUse');
      grad.setAttribute('x1', from.x); grad.setAttribute('y1', from.y);
      grad.setAttribute('x2', to.x); grad.setAttribute('y2', to.y);
      grad.innerHTML = '<stop offset="0" stop-color="#1c73f7"/><stop offset="1" stop-color="#6e59f2"/>';
      defs.appendChild(grad);

      var path = document.createElementNS(SVGNS, 'path');
      path.setAttribute('d', arcPath(from, to));
      path.setAttribute('class', 'orbit-arc');
      path.setAttribute('stroke', 'url(#' + id + ')');
      arcs.appendChild(path);

      var dot = document.createElementNS(SVGNS, 'circle');
      dot.setAttribute('r', '6');
      dot.setAttribute('class', 'orbit-dot');
      dots.appendChild(dot);

      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;

      from.el.classList.add('sending');
      if (core) core.set({ mood: 'listening', gaze: (from.x - CX) / R, gazeY: (from.y - CY) / R });
      var DUR = 1500, t0 = null, turned = false;

      function step(ts) {
        if (t0 === null) t0 = ts;
        var t = Math.min((ts - t0) / DUR, 1);
        var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        path.style.strokeDashoffset = len * (1 - e);
        var p = path.getPointAtLength(len * e);
        dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
        dot.style.opacity = t < 0.08 ? t / 0.08 : (t > 0.92 ? (1 - t) / 0.08 : 1);
        if (!turned && t > 0.45) {
          turned = true;
          if (core) core.set({ mood: 'talking', gaze: (to.x - CX) / R, gazeY: (to.y - CY) / R });
        }
        if (t < 1) return requestAnimationFrame(step);

        from.el.classList.remove('sending');
        to.el.classList.add('lit');
        dot.remove();
        path.style.transition = 'opacity .5s ease';
        path.style.opacity = '0';
        setTimeout(function () {
          path.remove(); grad.remove(); to.el.classList.remove('lit');
          if (core) core.set({ mood: 'idle', gaze: null, gazeY: 0 });
        }, 700);
      }
      requestAnimationFrame(step);
    }

    var running = false, timer = null;
    function loop() {
      // rAF is frozen in background tabs, so a flight started there would
      // never finish or clean up. Skip instead.
      if (!document.hidden) flight();
      timer = setTimeout(loop, 2300 + Math.random() * 600);
    }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !running) { running = true; loop(); }
        else if (!en.isIntersecting && running) { running = false; clearTimeout(timer); }
      });
    }, { threshold: 0.25 }).observe(stage);
  })();

  /* ----------------------------------------- Demo: the app's conversation card */
  (function () {
    var LINES = [
      ['Excuse me, is this seat taken?', '실례합니다, 이 자리 비어 있나요?'],
      ['No, go ahead!', '아니요, 앉으세요!'],
      ['Thanks. Are you here for the conference too?', '감사합니다. 학회 때문에 오셨나요?'],
      ['Yes, and my phone has no signal in here.', '네, 그런데 여기서는 휴대폰 신호가 안 잡히네요.'],
      ["No problem. This translation doesn't need the internet.", '괜찮습니다. 이 통역은 인터넷이 필요 없거든요.']
    ];
    var play = $('demoPlay'), list = $('demoTranscript'), saved = $('demoSaved');
    var timerEl = document.querySelector('#demoTimer b'), pill = $('demoTimer');
    var t = toki('demoToki');
    if (!play) return;
    var running = false, clock = null, seconds = 0;

    function wait(ms) { return new Promise(function (res) { setTimeout(res, reduce ? Math.min(ms, 120) : ms); }); }
    function setClock(on) {
      clearInterval(clock);
      pill.classList.toggle('on', on);
      if (on) clock = setInterval(function () {
        seconds++;
        timerEl.textContent = Math.floor(seconds / 60) + ':' + ('0' + seconds % 60).slice(-2);
      }, 1000);
    }

    function typeInto(el, text) {
      var words = text.split(' '), k = 0;
      return new Promise(function (res) {
        (function next() {
          k++;
          el.textContent = words.slice(0, k).join(' ');
          list.scrollTop = list.scrollHeight;
          if (k >= words.length) return res();
          setTimeout(next, reduce ? 0 : 150 + Math.random() * 90);
        })();
      });
    }

    async function run() {
      running = true;
      play.disabled = true;
      saved.classList.remove('show');
      list.innerHTML = '';
      seconds = 0; timerEl.textContent = '0:00';
      setClock(true);

      for (var n = 0; n < LINES.length; n++) {
        var row = document.createElement('div');
        row.className = 'demo-line live';
        row.innerHTML = '<div class="src"></div><div class="dst pending">번역 중</div>';
        list.appendChild(row);
        if (t) t.set({ mood: 'listening' });
        await typeInto(row.querySelector('.src'), LINES[n][0]);
        if (t) t.set({ mood: 'talking' });
        await wait(520);
        var dst = row.querySelector('.dst');
        dst.textContent = LINES[n][1];
        dst.classList.remove('pending');
        row.classList.remove('live');
        list.scrollTop = list.scrollHeight;
        await wait(700);
      }

      setClock(false);
      if (t) { t.set({ mood: 'happy' }); t.hop(); }
      saved.classList.add('show');
      play.querySelector('span').textContent = '다시 재생';
      play.disabled = false;
      running = false;
      await wait(2400);
      if (!running && t) t.set({ mood: 'idle' });
    }

    play.addEventListener('click', function () { if (!running) run(); });
  })();

  /* --------------------------------------------- Finale: a hop now and then */
  (function () {
    var el = $('finaleToki'), t = toki(el);
    if (!t || reduce) return;
    var visible = false;
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.4 }).observe(el);
    setInterval(function () { if (visible && !document.hidden) t.hop(); }, 2600);
    el.addEventListener('click', function () { t.hop(); });
  })();
})();
