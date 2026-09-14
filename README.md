# offtalk-site

Landing site and legal docs for **Toki (토키)**, the iOS live voice interpreter
that works where there is no internet at all. One page in Korean and English,
switched from the top right (`?lang=ko` or `?lang=en` links straight to either).

- Live: https://jsonpassion.github.io/offtalk-site/
- App repo: [jsonpassion/OffTalk](https://github.com/jsonpassion/OffTalk) (private)

## Structure

```
docs/
├── index.html          # landing page (ko/en)
├── privacy.html        # privacy policy (ko/en)
├── terms.html          # terms of service (ko/en)
├── styles.css          # daylight jelly theme
└── assets/
    ├── js/i18n.js      # English copy and the language switch
    ├── js/toki.js      # Toki mascot drawn as SVG, same geometry and motion as the app
    ├── js/site.js      # page interactions
    ├── img/            # app icon, OG image, app screenshots (ko, en)
    └── video/          # ambient cabin footage
```

Served by GitHub Pages from `main` → `/docs`. Pure static HTML, CSS and JS, no build step.

© 2026 ForgeLab, Jason Lee
