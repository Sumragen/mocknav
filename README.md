# MockNav

A small navigator for folders of static HTML mockups. One script tag, no build step.

Point it at your `.html` files and you get a sidebar, search, state tabs, and device widths. Mockups stay plain HTML — they work on their own and inside the shell.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Install

You need a single file: `mocknav.js` (or `mocknav.min.js` from the CDN).

**CDN**

```html
<script src="https://cdn.jsdelivr.net/npm/mocknav@1.0.0/mocknav.min.js"></script>
```

[jsDelivr](https://www.jsdelivr.com/package/npm/mocknav) · [unpkg](https://unpkg.com/mocknav@1.0.0/mocknav.min.js)

**npm**

```bash
npm install mocknav
cp node_modules/mocknav/mocknav.js .
```

Or grab [`mocknav.js`](mocknav.js) from the repo and drop it in your project.

## Quick start

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
        { name: 'Home',  file: 'pages/home.html' },
        { name: 'Login', file: 'pages/auth/login.html', group: 'Auth' },
      ],
    });
  </script>
</body>
</html>
```

Put your mockup files wherever you like and list them in `pages`. Open `index.html` in the browser — `file://` works, no server required.

For a local server: `npx serve .`

Configuration, states, keyboard shortcuts, and the rest → **[DOCS.md](DOCS.md)**

## Demo

```bash
git clone https://github.com/Sumragen/mocknav.git
cd mocknav
npm run demo
```

Open `http://localhost:3000/example/`. Run from the repo root, not from `example/` alone — the demo loads `../mocknav.js`.

## API

```js
MockNav.init({ title: '…', pages: [ /* … */ ] });
MockNav.go('page-id', 'error');
MockNav.setState('loading');
MockNav.reload();
MockNav.setDevice('mobile');
```

Details in [DOCS.md](DOCS.md).

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © Hennadii Varava
