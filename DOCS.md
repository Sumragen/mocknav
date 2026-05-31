# MockNav — Documentation

MockNav is a single JavaScript file that turns a folder of HTML mockups into a navigable panel with page switching, state previews, and device simulation. No build step, no dependencies.

**New here?** Start with [README.md](README.md), then use this file as the full reference.

---

## This repository

| Path | Role |
|------|------|
| `mocknav.js` | Source (readable) |
| `mocknav.min.js` | Minified build for CDN / production |
| `example/index.html` | Demo bootstrap |
| `example/pages/` | Sample mockups |

Run the demo: `npm run demo`, then open `http://localhost:3000/example/` (serves the repo root, not only `example/`).

---

## How it works

You keep one `index.html` that bootstraps MockNav, and your mockups live as regular HTML files alongside it. MockNav fetches each file on demand and renders it directly into the preview panel.

```
your-project/
├── index.html          ← bootstrap file (you edit this once)
└── pages/
    ├── home.html
    ├── auth/
    │   └── login.html
    └── app/
        └── dashboard.html
```

Load `mocknav.js` from a CDN, npm, or a local copy — mockups are always your own HTML files.

Each mockup is a normal HTML file — it opens on its own in a browser, and also works inside MockNav. No special wrapper, no required structure.

---

---

## Install

**CDN** (recommended for static mockup folders):

```html
<script src="https://cdn.jsdelivr.net/npm/mocknav@1.0.0/mocknav.min.js"></script>
```

Works with `file://` and local servers. Your mockup HTML files remain on disk — only the navigator script comes from the CDN.

**npm**:

```bash
npm install mocknav
# optional: copy into project root
cp node_modules/mocknav/mocknav.js .
```

**GitHub** — download [`mocknav.js`](https://github.com/Sumragen/mocknav/blob/main/mocknav.js) from the repo.

---

## Quick start

**1. Load MockNav** in your bootstrap `index.html` (CDN or local path):

```html
<script src="https://cdn.jsdelivr.net/npm/mocknav@1.0.0/mocknav.min.js"></script>
```

**2. Create `index.html`:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MockNav</title>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/mocknav@1.0.0/mocknav.min.js"></script>
  <script>
    MockNav.init({
      title: 'My Project',
      pages: [
        {
          name: 'Home',
          file: 'pages/home.html',
        },
        {
          name:  'Login',
          file:  'pages/auth/login.html',
          group: 'Auth',
          states: [
            { id: 'default', label: 'Default' },
            { id: 'error',   label: 'Error'   },
          ],
        },
      ],
    });
  </script>
</body>
</html>
```

**3. Open `index.html`** in your browser. On `file://`, MockNav loads mockups in an iframe (browsers block `fetch` for local files). A local server also works:

```
npx serve .
```

That's it.

---

## Configuration reference

`MockNav.init(config)` accepts a single object:

| Key     | Type     | Default     | Description                        |
|---------|----------|-------------|------------------------------------|
| `title` | string   | `'MockNav'` | Project name shown in the sidebar  |
| `pages` | Page[]   | `[]`        | List of pages (see below)          |

### Page

| Key      | Type     | Required | Description                                             |
|----------|----------|----------|---------------------------------------------------------|
| `name`   | string   | ✓        | Label shown in the sidebar                              |
| `file`   | string   | ✓        | Path to the HTML file, relative to `index.html`         |
| `id`     | string   |          | Unique key. Auto-generated if omitted                   |
| `group`  | string   |          | Sidebar section heading. Default: `'Pages'`             |
| `badge`  | string   |          | Status tag: `'new'` `'wip'` `'done'` `'review'`        |
| `tags`   | string[] |          | Extra keywords that appear in search                    |
| `states` | State[]  |          | List of states. Default: single Default state           |

### State

| Key     | Type   | Required | Description                                                        |
|---------|--------|----------|--------------------------------------------------------------------|
| `id`    | string | ✓        | Identifier, e.g. `'error'`                                         |
| `label` | string | ✓        | Label shown in the toolbar pill, e.g. `'Error'`                    |
| `file`  | string |          | Override — load a different file for this state instead of the base |

---

## States

States let you show the same page in different conditions — filled form, empty list, error message, loading spinner — without duplicating the whole mockup.

### How MockNav passes the state

When a state is selected, MockNav appends `?state=<id>` to the file URL before fetching it:

```
pages/auth/login.html?state=error
```

Your mockup reads this and applies a CSS class to `<body>`:

```html
<!-- put this at the bottom of every mockup (standalone / ↗ open in new tab) -->
<script>
  const s = new URLSearchParams(location.search).get('state');
  if (s) document.body.classList.add('state-' + s);
</script>
```

Inside MockNav’s preview panel, the library applies `state-<id>` on an embedded root (`.mn-mockup-body`) for you — the snippet above is not required for toolbar state switching, only when the file is opened directly.

For full-screen state overlays, prefer `position: absolute` on a positioned ancestor (or `body::after` with `inset: 0`) instead of `position: fixed`, so the overlay stays inside the preview and does not block the MockNav sidebar.

Then in CSS, style each state:

```css
/* default — error message is hidden */
.login-error-msg { display: none; }

/* error state — MockNav passes ?state=error */
body.state-error .login-error-msg           { display: block; }
body.state-error .login-field input[type=password] { border-color: #e24b4a; }

/* loading state */
body.state-loading .login-submit { opacity: .5; pointer-events: none; }
```

### State with a separate file

When a state looks completely different from the default, point it at its own file instead:

```js
states: [
  { id: 'default', label: 'Default' },
  { id: 'success', label: 'Success', file: 'pages/auth/register-success.html' },
]
```

Both options work; use whichever keeps your code simpler.

---

## CSS in mockups

**Tailwind CDN** — add the Play CDN script to each mockup’s `<head>`:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Works standalone and inside MockNav (`file://` via iframe, `http://` via inject). In inject mode, MockNav waits for `<script src>` tags in the mockup (head and body) to load before showing the page — any CDN, not Tailwind-specific. Keep a small `<style>` block for `body.state-*` rules if you use states.

**Custom CSS** — prefix selectors (`.login-`, `.dash-`) so styles do not leak when mockups are injected without an iframe. See [CSS isolation](#css-isolation) below.

MockNav renders mockup HTML directly into the page (no iframe). This means styles from one mockup can affect another if you use global selectors.

**The convention:** prefix every CSS selector with the page name.

```css
/* ✗ leaks */
nav { background: red; }
h1  { font-size: 48px; }

/* ✓ contained */
.home-nav { background: red; }
.home-hero h1 { font-size: 48px; }
```

Keep the prefix short — two to four characters is fine: `.lg-`, `.dash-`, `.prof-`. The sidebar name makes a natural choice.

When you open a mockup on its own (`file://` or direct URL), the prefix has zero impact — it's just a class name. When MockNav loads it, styles stay contained.

---

## Device preview

The toolbar has three device buttons that resize the preview viewport:

| Button | Width   | Simulates            |
|--------|---------|----------------------|
| ⬛     | 100%    | Desktop              |
| ▬      | 768px   | Tablet               |
| ▯      | 390px   | Mobile (iPhone size) |

Your mockup should use responsive CSS so it looks right at each width. The viewport scrolls if the content is taller than the panel.

---

## Sidebar features

**Groups** — pages with the same `group` value are listed under one heading. Pages without a group go under `'Pages'`.

```js
{ name: 'Login',    file: '...', group: 'Auth' },
{ name: 'Register', file: '...', group: 'Auth' },
```

**Badges** — a small coloured label on the nav item. Useful for tracking status across the team.

| Value    | Colour |
|----------|--------|
| `new`    | Green  |
| `wip`    | Yellow |
| `done`   | Blue   |
| `review` | Pink   |

**State dots** — the small coloured circles next to each page name indicate which states the page has. The colour is driven by the state `id`:

| id        | Colour      |
|-----------|-------------|
| `default` | Grey        |
| `hover`   | Blue        |
| `active`  | Purple      |
| `error`   | Red         |
| `success` | Green       |
| `loading` | Yellow      |
| `empty`   | Light blue  |

Any other `id` gets a grey dot.

**Search** — the search box filters by page name, group, and tags simultaneously.

---

## Open in new tab

The status bar at the bottom shows the path of the current file and an **↗ open** link that opens the mockup directly in a new tab — useful for sharing a specific page with a teammate.

---

## Programmatic navigation

```js
MockNav.go('login'); // navigate to a page by its id
```

The current page and state are kept in the URL hash (`#login/error`). Refreshing or sharing the link restores the same view.

---

## Local files (`file://`)

Browsers block `fetch()` on `file://` URLs. MockNav detects this and loads each mockup in an **iframe** instead — double-click `index.html` and it should work in Chrome, Safari, and Firefox.

States still use `?state=` in the iframe URL, so the mockup state snippet in each HTML file works as documented.

For `http://` (local server), mockups are injected directly into the panel (no iframe). Use a server if you prefer that mode or need to test without iframe isolation:

```bash
npx serve .            # fastest
python -m http.server  # if you have Python
```

Or use the **Live Server** extension in VS Code (right-click `index.html` → Open with Live Server).

---

## Asking an AI to generate mockups

When prompting an AI (Claude, ChatGPT, etc.) to generate a mockup that will be used inside MockNav, include this in your prompt:

> Prefix all CSS selectors with `.<pagename>-` (e.g. `.login-`, `.dash-`) to avoid style leaks. At the bottom of the file, add this snippet:
> ```html
> <script>
>   const s = new URLSearchParams(location.search).get('state');
>   if (s) document.body.classList.add('state-' + s);
> </script>
> ```
> Then write CSS for each state using `body.state-<id>` selectors.

This produces mockups that work both standalone and inside MockNav without any editing.

---

## Full example

`index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Demo — Mockups</title>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/mocknav@1.0.0/mocknav.min.js"></script>
  <script>
    MockNav.init({
      title: 'Demo',
      pages: [
        {
          name:  'Landing',
          file:  'pages/landing.html',
          group: 'Public',
          badge: 'done',
        },
        {
          name:  'Login',
          file:  'pages/auth/login.html',
          group: 'Auth',
          tags:  ['form', 'auth'],
          states: [
            { id: 'default', label: 'Default'   },
            { id: 'error',   label: 'Error'     },
            { id: 'loading', label: 'Submitting' },
          ],
        },
        {
          name:  'Dashboard',
          file:  'pages/app/dashboard.html',
          group: 'App',
          badge: 'wip',
          states: [
            { id: 'default', label: 'Default' },
            { id: 'empty',   label: 'Empty'   },
            { id: 'loading', label: 'Loading' },
          ],
        },
        {
          name:  'Settings',
          file:  'pages/app/settings.html',
          group: 'App',
          states: [
            { id: 'default', label: 'Default' },
            { id: 'success', label: 'Saved',  file: 'pages/app/settings-saved.html' },
          ],
        },
        {
          name:  '404',
          file:  'pages/errors/404.html',
          group: 'Errors',
        },
      ],
    });
  </script>
</body>
</html>
```
