# MockNav

**One JavaScript file. Zero dependencies. No build step.**

MockNav turns a folder of plain HTML mockups into a navigable preview: sidebar with groups and search, state switching, device frames, link navigation between pages, and badges for team status.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Why MockNav?

| | MockNav | Typical iframe gallery |
|---|---------|------------------------|
| Setup | Copy one `.js` file | Build tool or framework |
| Mockup files | Normal HTML, open standalone | Often wrapped or templated |
| Dependencies | None | Often React/Vite/etc. |
| States | `?state=` + CSS classes | Varies |
| In-mockup links | Intercepted → sidebar navigation | Often manual |

Your designers and developers keep writing regular `.html` files. MockNav only adds a single `index.html` that lists them.

## Install

Pick one — you only need the single `mocknav.js` file.

**CDN (no install)** — add a script tag to your `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/mocknav@1.0.0/mocknav.min.js"></script>
```

Pin a version (`@1.0.0`) so updates do not break your setup. Use `mocknav.min.js` on CDN; `mocknav.js` is the readable source. [jsDelivr](https://www.jsdelivr.com/package/npm/mocknav) · [unpkg](https://unpkg.com/mocknav@1.0.0/mocknav.min.js)

**npm** — install into a project (e.g. to vendor the file or pin in `package.json`):

```bash
npm install mocknav
```

Then reference the file from `node_modules` when serving over HTTP, or copy it once:

```bash
cp node_modules/mocknav/mocknav.js .
```

**Manual** — download [`mocknav.js`](mocknav.js) from GitHub and keep it in your project.

---

## Quick start

**1.** Load MockNav (CDN example):

```html
<script src="https://cdn.jsdelivr.net/npm/mocknav@1.0.0/mocknav.min.js"></script>
```

**2.** Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My mockups</title>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/mocknav@1.0.0/mocknav.min.js"></script>
  <script>
    MockNav.init({
      title: 'My Project',
      pages: [
        { name: 'Home', file: 'pages/home.html' },
        { name: 'Login', file: 'pages/auth/login.html', group: 'Auth' },
      ],
    });
  </script>
</body>
</html>
```

**3.** Add HTML files under `pages/` (or any layout you prefer).

**4.** Open `index.html` in your browser (works from `file://` — no server required).

For local development with hot reload, you can also run:

```bash
npx serve .
```

Full configuration (states, link navigation, device preview, keyboard shortcuts) → **[DOCS.md](DOCS.md)**

## Try the demo

This repository includes a working example:

```bash
git clone https://github.com/Sumragen/mocknav.git
cd mocknav
npm run demo
# open http://localhost:3000/example/
```

The demo is served from the repo root so `example/index.html` can load `../mocknav.js`. Do not run `serve example` alone — the library file lives one level up.

## Repository layout

```
mocknav/
├── mocknav.js      ← source
├── mocknav.min.js  ← minified (`npm run build`)
├── DOCS.md         ← full documentation
├── LICENSE
├── package.json    ← npm metadata (optional; library has no runtime deps)
└── example/        ← demo project (not required in your app)
    ├── index.html
    └── pages/      ← sample HTML mockups
```

In **your** project you typically have:

```
your-design-system/
├── index.html      ← MockNav bootstrap (you maintain)
└── pages/          ← your team's HTML mockups
```

MockNav itself can load from a CDN; your mockup `.html` files stay in the project.

## API (summary)

```js
MockNav.init({ title: '…', pages: [ /* … */ ] });
MockNav.go('page-id', 'error');   // navigate by id (+ optional state)
MockNav.setState('loading');      // switch state on current page
MockNav.notifyState('error');     // sync toolbar without reload
MockNav.reload();
MockNav.setDevice('mobile');      // desktop · tablet · mobile
```

| Page option | Purpose |
|-------------|---------|
| `name`, `file` | Sidebar label and HTML path |
| `group` | Sidebar section |
| `states` | Default / error / loading variants via `?state=` |
| `badge` | `new` · `wip` · `done` · `review` |
| `tags` | Search keywords |

See **[DOCS.md](DOCS.md)** for the complete reference.

## Browser notes

MockNav loads every mockup in an iframe — scripts run natively, styles stay isolated. Works on **`file://`** (double-click `index.html`) and **`http://`** (`npx serve .`).

## Contributing

Issues and pull requests are welcome. See **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## License

[MIT](LICENSE) © Hennadii Varava
