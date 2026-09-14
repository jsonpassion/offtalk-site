/* Korean and English in one page.
   Korean lives in the HTML. Elements marked data-i18n="key" get their
   English markup from EN below; the Korean original is captured on first
   switch so it can be restored. data-i18n-attr="alt=key;aria-label=key"
   does the same for attributes, data-src-en swaps images, and .lang-ko /
   .lang-en blocks (the policy pages) are shown or hidden.

   Language: ?lang= in the URL, then the visitor's saved choice, then the
   browser language (Korean browsers get Korean, everyone else English). */
(function () {
  'use strict';

  var STORE_KEY = 'toki.lang';

  var EN = {
    'meta.title': 'Toki, the offline live interpreter for iPhone',
    'meta.desc': 'Toki is a live voice interpreter for iPhone that works without internet. On a plane, abroad without roaming, at field interviews and meetings overseas, your words are translated the moment you speak. No login, no tracking.',
    'meta.title.terms': 'Terms of Service, Toki',
    'meta.desc.terms': 'Terms of Service for Toki.',
    'meta.title.privacy': 'Privacy Policy, Toki',
    'meta.desc.privacy': 'Toki has no servers and no accounts. Your voice and conversations never leave your device.',

    'brand.kr': '',
    'nav.how': 'How it works',
    'nav.features': 'Features',
    'nav.meet': 'Meet Toki',
    'nav.langs': 'Languages',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.cta': 'Download',
    'nav.home': 'Home',
    'nav.privacy': 'Privacy Policy',
    'nav.terms': 'Terms of Service',
    'switch.label': 'Language',

    'hero.tag': 'Offline live interpreter for iOS',
    'hero.h1': 'Speak, and it’s<br /><span class="hl">translated</span>.',
    'hero.sub': 'Toki understands you the <strong>moment</strong> you speak and interprets on the spot. Speech recognition and translation all happen <strong>on your iPhone</strong>, so there is no Wi-Fi or roaming to worry about.',
    'hero.meet': 'Meet Toki',
    'hero.chip1': 'On a plane',
    'hero.chip2': 'Abroad, no roaming',
    'hero.chip3': 'Field interviews',
    'hero.chip4': 'Meetings overseas',
    'hero.floatA': '<div class="fpair"><span class="glyph v">A</span><svg class="farrow" viewBox="0 0 16 10"><path d="M1 5h13M10 1.5 14 5l-4 3.5"/></svg><span class="glyph">あ</span></div><div class="fsrc">Is this seat taken?</div><div class="fdst">この席は空いていますか?</div>',
    'hero.floatB': '<div class="fpair"><span class="glyph">가</span><svg class="farrow" viewBox="0 0 16 10"><path d="M1 5h13M10 1.5 14 5l-4 3.5"/></svg><span class="glyph v">A</span></div><div class="fsrc">사진 한 장 부탁드립니다</div><div class="fdst">Could you take a photo for me?</div>',
    'hero.shotAlt': 'Toki conversation screen with English sentences and Korean translations stacked in pairs',
    'hero.greetLabel': 'Say hello to Toki',

    'moments.eyebrow': 'When to use it',
    'moments.h2': 'Moments made for Toki',
    'moments.p': 'Translation apps are everywhere, yet the internet is rarely there when you need one most. Toki was built for exactly those moments.',
    'm1.h3': 'On planes and in airports',
    'm1.p': 'Stay in airplane mode and talk right away with the passenger next to you or the transfer desk.',
    'm1.q': '"Would you mind switching seats with me?"',
    'm2.h3': 'Abroad without roaming',
    'm2.p': 'No SIM and no roaming on your first day. Even in a back-alley restaurant, the interpreting never drops.',
    'm2.q': '"Which dish here is the least spicy?"',
    'm3.h3': 'At field interviews',
    'm3.p': 'In a mountain village or an underground venue with no signal, the whole interview is still transcribed and translated.',
    'm3.q': '"What made you start doing this work?"',
    'm4.h3': 'At meetings overseas',
    'm4.p': 'On factory tours or warehouse inspections where Wi-Fi never reaches, keep the negotiation moving.',
    'm4.q': '"On these terms, we can raise next quarter’s volume."',

    'cine.label': 'Two passengers smiling and talking in a plane cabin',
    'cine.eyebrow': '30,000 FT, NO SIGNAL',
    'cine.h2': '30,000 feet up with no signal,<br />the conversation keeps going.',
    'cine.p': 'Because Toki runs on your iPhone, not on the internet.',

    'how.eyebrow': 'How it works',
    'how.h2': 'Three taps is all it takes',
    'how.p': 'No sign-up and no complicated setup. Download the language packs once, and Toki works fully offline from then on.',
    's1.h3': 'Pick your languages',
    's1.p': 'Choose the language you speak and the one they read. Toki fetches the speech model and translation pack you need in one go.',
    's2.h3': 'Tap and talk',
    's2.p': 'Your words appear as you speak, and the translation flows in underneath before you even finish the sentence.',
    's3.h3': 'Slide to finish',
    's3.p': 'When the conversation is over, slide once. The full original and translation are saved to your history automatically.',

    'features.eyebrow': 'Features',
    'features.h2': 'Translation apps are everywhere.<br />Ones that keep your voice on your phone are rare.',
    'features.p': 'Toki is built on Apple’s on-device speech recognition and translation engines. It is not that there is no server. Toki simply does not need one.',
    'f1.h3': 'Works without internet',
    'f1.p': 'With the language packs downloaded, you get full live interpreting even in airplane mode. No roaming, no Wi-Fi.',
    'f2.h3': 'Translated as you speak',
    'f2.p': 'No waiting for the sentence to end. Even the words you are still saying are translated ahead of time.',
    'f3.h3': 'Your voice stays put',
    'f3.p': 'No recordings, no uploads. Recognition and translation both happen on the device, and the audio is gone right away.',
    'f4.h3': 'Sentence-by-sentence pairs',
    'f4.p': 'Fast talkers will not scramble the order. Each finished sentence and its translation stack up like a chat.',
    'f5.h3': 'Pause and pick up again',
    'f5.p': 'Stop for a moment and keep talking later. The session carries on and saves as a single conversation.',
    'f6.h3': 'History and sharing',
    'f6.p': 'Finished conversations save automatically. Open, copy or share them as they are. Everything stays on your phone.',

    'meet.eyebrow': 'Character',
    'meet.h2': 'Meet Toki',
    'meet.p': 'Toki is a squishy speech bubble that carries your words into another language. One look at its face tells you what it is up to.',
    'mood1.h3': 'Waiting',
    'mood1.p': 'Breathes and looks around. Tap it on the home screen and it says hello in different languages.',
    'mood2.h3': 'Listening',
    'mood2.p': 'Bounces along with your voice while it pays close attention.',
    'mood3.h3': 'Interpreting',
    'mood3.p': 'Moves its mouth while the translation flows, carrying your words across.',
    'mood4.h3': 'Saved',
    'mood4.p': 'Smiles with its eyes and hops when a conversation is saved to history.',
    'mood5.h3': 'Paused',
    'mood5.p': 'Nods off while paused, waiting for whatever you say next.',
    'mood6.h3': 'A little worried',
    'mood6.p': 'Gets a bit nervous when free time is running low or something goes wrong.',
    'meet.hint': 'Tap a card to make Toki hop.',

    'screens.eyebrow': 'Preview',
    'screens.h2': 'See it before you try it',
    'screens.p': 'These are real app screens. No complicated menus, just tap and talk.',
    'shot1.cap': '<b>Tap and talk</b>One button to start',
    'shot2.cap': '<b>Live interpreting</b>Sentences and translations in pairs',
    'shot3.cap': '<b>9 languages</b>Any combination you like',
    'shot4.cap': '<b>Auto-save</b>Finished chats go to history',
    'shot5.cap': '<b>Offline</b>Keeps going without signal',
    'shot1.alt': 'Home screen with two languages and the button to start interpreting',
    'shot2.alt': 'Conversation screen with sentences and translations stacked in pairs',
    'shot3.alt': 'Language picker listing 9 languages',
    'shot4.alt': 'History screen listing saved conversations',
    'shot5.alt': 'Onboarding screen saying the conversation keeps going when the signal drops',

    'langs.eyebrow': 'Languages',
    'langs.h2': '9 languages, any direction',
    'langs.p': 'Every language supported by both Apple’s on-device speech recognition and translation. Toki interprets between any pair of them.',
    'langs.label': 'Toki carrying words between 9 languages in any combination',

    'demo.eyebrow': 'Demo',
    'demo.h2': 'Here is how it flows',
    'demo.p': 'Press play to watch sentences get recognized and translations follow, just like in the app.',
    'demo.langs': '<span class="glyph">가</span><svg class="farrow" viewBox="0 0 16 10" aria-hidden="true"><path d="M1 5h13M10 1.5 14 5l-4 3.5"/></svg><span class="glyph v">A</span>',
    'demo.langsLabel': 'Korean to English',
    'demo.empty': 'Press the button below to start the conversation.',
    'demo.saved': 'Saved to history',

    'privacy.h2': 'Your voice never leaves your phone',
    'privacy.p': 'Toki has no servers, no accounts and no analytics. The only network use is the operating system downloading Apple’s language assets and keeping your free-time counter in step through iCloud. Translation itself runs completely offline.',

    'pricing.eyebrow': 'Pricing',
    'pricing.h2': 'Your first 30 minutes are free',
    'pricing.p': 'Try every feature first, then subscribe to Toki Pro when you want to keep going.',
    'free.h3': 'Start free',
    'free.amount': '$0',
    'free.note': 'Free download',
    'free.li1': '<strong>30 minutes</strong> with every feature, free',
    'free.li2': 'No limit on conversation length',
    'free.li3': 'All 9 languages, any combination',
    'free.li4': 'Saved conversations are <strong>always</strong> readable',
    'free.btn': 'Start for free',
    'pro.badge': 'Save 49% yearly',
    'pro.amount': '$1.99<span class="price-unit"> / month</span>',
    'pro.note': 'or $11.99 a year (about $1.00 a month)',
    'pro.li1': '<strong>Unlimited</strong> translation time',
    'pro.li2': 'Monthly or yearly auto-renewing subscription',
    'pro.li3': 'Cancel anytime in your Apple Account',
    'pro.li4': 'Restores automatically after reinstalling',
    'pro.btn': 'Download the app',
    'pricing.foot': 'Prices shown are for the US App Store and vary by region.',

    'faq.h2': 'Frequently asked questions',
    'faq.q1': 'How much does it cost?',
    'faq.a1': 'The download is free, and your first 30 minutes include every feature with no limits. The free time is given once and does not reset if you reinstall the app or move to a new iPhone on the same Apple Account (iCloud). To keep using Toki, subscribe to <strong>Toki Pro</strong> for $1.99 a month or $11.99 a year on the US App Store (about $1.00 a month, 49% less). Prices vary by region, and you can cancel anytime in your Apple Account settings. Saved conversations stay readable even without a subscription.',
    'faq.q2': 'Does it really work without internet?',
    'faq.a2': 'Yes. Download the language packs once (about 50 to 100 MB per language), and both speech recognition and translation run on the device. Try it in airplane mode.',
    'faq.q3': 'Which devices are supported?',
    'faq.a3': 'Toki runs on iPhone with iOS 26 or later, because it uses Apple’s latest on-device speech recognition and translation technology.',
    'faq.q4': 'Which languages is the app itself available in?',
    'faq.a4': 'The app is available in English, 한국어, 日本語 and 简体中文. It follows your iPhone’s language at first, and you can change it anytime in the app’s settings. This is separate from the 9 interpreting languages.',
    'faq.q5': 'Who is Toki?',
    'faq.a5': 'Toki is the speech bubble character who keeps you company in the app. Whenever it listens, interprets or saves, its face and movement show you what is happening.',
    'faq.q6': 'Are my conversations stored anywhere?',
    'faq.a6': 'Your history is stored only on your device. No one, including the developer, can see it, and you can delete it in the app at any time.',
    'faq.q7': 'How good are the translations?',
    'faq.a7': 'Toki uses Apple’s translation engine. The quality holds up for everyday conversation, travel and business meetings, and unlike internet-based translation there is almost no delay.',
    'faq.q8': 'Are audio recordings kept?',
    'faq.a8': 'No. Audio is discarded as soon as it is recognized and is never saved as a file. Only the original and translated text remain, and only on your phone.',

    'finale.label': 'Download',
    'finale.h2': 'Now go where the internet doesn’t',
    'finale.p': 'Your interpreter is already in your pocket.',

    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact',
    'footer.mailto': 'mailto:forgelab.aitech@gmail.com?subject=%5BToki%5D%20Inquiry',
    'footer.biz': 'ForgeLab, Representative Jason Lee'
  };

  // Strings and lists used by scripts, in both languages.
  var DATA = {
    ko: {
      rotor: ['기내에서도', '여행지 골목에서도', '인터뷰 현장에서도', '바이어 미팅에서도', '신호 없는 산골에서도'],
      hellos: ['안녕하세요', 'Hello', 'こんにちは', '你好', 'Hola', 'Bonjour', 'Hallo', 'Ciao', 'Olá'],
      cine: [
        ['Is this seat taken?', '이 자리 비어 있나요?'],
        ['Not at all, go ahead.', '아니요, 앉으셔도 됩니다.'],
        ['Where are you headed?', '어디로 가시는 길인가요?'],
        ['Seoul, for the first time!', '서울이요, 처음 가 봅니다!']
      ],
      demo: [
        ['Excuse me, is this seat taken?', '실례합니다, 이 자리 비어 있나요?'],
        ['No, go ahead!', '아니요, 앉으세요!'],
        ['Thanks. Are you here for the conference too?', '감사합니다. 학회 때문에 오셨나요?'],
        ['Yes, and my phone has no signal in here.', '네, 그런데 여기서는 휴대폰 신호가 안 잡히네요.'],
        ["No problem. This translation doesn't need the internet.", '괜찮습니다. 이 통역은 인터넷이 필요 없거든요.']
      ],
      play: '대화 재생',
      replay: '다시 재생',
      pending: '번역 중',
      empty: '아래 버튼을 누르면 대화가 시작됩니다.',
      soon: 'App Store 출시를 준비하고 있습니다.'
    },
    en: {
      rotor: ['On the plane.', 'At the market.', 'On the job.', 'In the meeting.', 'Off the grid.'],
      hellos: ['Hello', '안녕하세요', 'こんにちは', '你好', 'Hola', 'Bonjour', 'Hallo', 'Ciao', 'Olá'],
      cine: [
        ['이 자리 비어 있나요?', 'Is this seat taken?'],
        ['네, 앉으셔도 됩니다.', 'It’s free, go ahead.'],
        ['어디로 가시는 길인가요?', 'Where are you headed?'],
        ['부산에 계신 부모님을 뵈러 갑니다.', 'I’m visiting my parents in Busan.']
      ],
      demo: [
        ['실례합니다, 이 자리 비어 있나요?', 'Excuse me, is this seat taken?'],
        ['아니요, 앉으세요!', 'No, go ahead!'],
        ['감사합니다. 학회 때문에 오셨나요?', 'Thanks. Are you here for the conference too?'],
        ['네, 그런데 여기서는 휴대폰 신호가 안 잡히네요.', 'Yes, and my phone has no signal in here.'],
        ['괜찮습니다. 이 통역은 인터넷이 필요 없거든요.', "No problem. This translation doesn't need the internet."]
      ],
      play: 'Play conversation',
      replay: 'Play again',
      pending: 'Translating',
      empty: 'Press the button below to start the conversation.',
      soon: 'Coming soon to the App Store.'
    }
  };

  var originals = {};      // key -> Korean innerHTML
  var originalAttrs = {};  // key -> Korean attribute value
  var current = 'ko';

  function valid(l) { return l === 'ko' || l === 'en' ? l : null; }

  function detect() {
    var fromUrl = null, saved = null;
    try { fromUrl = valid(new URLSearchParams(location.search).get('lang')); } catch (e) {}
    try { saved = valid(localStorage.getItem(STORE_KEY)); } catch (e) {}
    if (fromUrl) {
      try { localStorage.setItem(STORE_KEY, fromUrl); } catch (e) {}
      return fromUrl;
    }
    if (saved) return saved;
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'ko';
    return /^ko/i.test(nav) ? 'ko' : 'en';
  }

  function apply(lang) {
    current = lang;
    var root = document.documentElement;
    root.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!(key in originals)) originals[key] = el.innerHTML;
      var html = lang === 'en' && key in EN ? EN[key] : originals[key];
      if (el.innerHTML !== html) el.innerHTML = html;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split('='), attr = parts[0].trim(), key = (parts[1] || '').trim();
        if (!attr || !key) return;
        var id = key + '@' + attr;
        if (!(id in originalAttrs)) originalAttrs[id] = el.getAttribute(attr);
        el.setAttribute(attr, lang === 'en' && key in EN ? EN[key] : originalAttrs[id]);
      });
    });

    document.querySelectorAll('img[data-src-en]').forEach(function (img) {
      if (!img.hasAttribute('data-src-ko')) img.setAttribute('data-src-ko', img.getAttribute('src'));
      img.setAttribute('src', img.getAttribute(lang === 'en' ? 'data-src-en' : 'data-src-ko'));
    });

    document.querySelectorAll('.lang-ko').forEach(function (el) { el.style.display = lang === 'ko' ? 'block' : 'none'; });
    document.querySelectorAll('.lang-en').forEach(function (el) { el.style.display = lang === 'en' ? 'block' : 'none'; });

    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });

    root.classList.remove('i18n-wait');
    document.dispatchEvent(new CustomEvent('toki:lang', { detail: { lang: lang } }));
  }

  function set(lang) {
    lang = valid(lang);
    if (!lang || lang === current) return;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    try {
      var url = new URL(location.href);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    } catch (e) {}
    apply(lang);
  }

  document.querySelectorAll('.lang-switch button').forEach(function (b) {
    b.addEventListener('click', function () { set(b.getAttribute('data-lang')); });
  });

  window.I18N = {
    get lang() { return current; },
    set: set,
    data: function (name) { return DATA[current][name]; }
  };

  var initial = detect();
  if (initial === 'en') apply('en');
  else {
    document.documentElement.classList.remove('i18n-wait');
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === 'ko' ? 'true' : 'false');
    });
  }
})();
