# MockNav — Documentation

MockNav is a single JavaScript file that turns a folder of HTML mockups into a navigable panel with page switching, state previews, device simulation, and in-mockup link navigation. No build step, no dependencies.

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

You keep one `index.html` that bootstraps MockNav, and your mockups live as regular HTML files alongside it. Each mockup loads in an **iframe** inside the preview panel — scripts run natively, styles stay isolated, and clicks on internal links are intercepted so navigation stays inside MockNav.

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

**3. Open `index.html`** in your browser — works on `file://` and with a local server:

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

When a state is selected, MockNav loads the page in an iframe. For non-default states it appends `?state=<id>` to the file URL:

```
pages/auth/login.html?state=error
```

The default state loads the file without a `?state=` parameter.

Your mockup reads this and applies a CSS class to `<body>`:

```html
<!-- put this at the bottom of every mockup (standalone / ↗ open in new tab) -->
<script>
  const s = new URLSearchParams(location.search).get('state');
  if (s) document.body.classList.add('state-' + s);
</script>
```

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

For full-screen state overlays inside the iframe, prefer `position: absolute` on a positioned ancestor (or `body::after` with `inset: 0`) instead of `position: fixed`, so the overlay stays inside the preview viewport.

### Interactive state sync

When a user clicks inside the mockup (e.g. submit → loading → error), the toolbar can stay in sync without reloading the iframe.

**From inside the mockup**, call the injected helper:

```js
mnNotifyState('loading');
// later…
mnNotifyState('error');
```

MockNav injects `mnNotifyState` into each iframe after load. It posts a message to the parent, which updates the active state pill and URL hash.

**Fallback:** if your mockup adds `state-<id>` to `<body>` via JavaScript (instead of calling `mnNotifyState`), MockNav watches `body.classList` and syncs automatically.

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

## Link navigation

MockNav intercepts clicks on internal links inside the iframe. When a user clicks `<a href="other-page.html">`, MockNav finds the matching page in your config and navigates to it — instead of loading the file inside the iframe alone.

Supported link types:

| href | Behaviour |
|------|-----------|
| `login.html` | Navigate to the page whose `file` ends with `login.html` |
| `login.html?state=error` | Navigate to that page in the `error` state |
| `#section` | Ignored — normal anchor behaviour |
| `https://…` | Ignored — opens normally (or use `target="_blank"`) |
| `mailto:`, `tel:`, `javascript:` | Ignored |

Links are resolved relative to the current iframe URL. If no matching page exists in the config, the link opens in a new tab as a fallback.

Use normal `<a href="…">` tags between mockups to prototype user flows without JavaScript routing.

---

## CSS in mockups

Because each mockup runs in its own iframe, styles do not leak between pages. You can use global selectors (`nav`, `h1`, etc.) without affecting other mockups.

**Tailwind CDN** — add the Play CDN script to each mockup’s `<head>`:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Works standalone and inside MockNav. Keep a small `<style>` block for `body.state-*` rules if you use states.

**Optional prefix convention** — some teams still prefix selectors (`.login-`, `.dash-`) for clarity when sharing CSS snippets or opening mockups side by side in separate tabs. It is not required for MockNav isolation.

---

## Device preview

The toolbar has three device buttons that resize the preview viewport with realistic device chrome:

| Button | Shortcut | Size | Simulates |
|--------|----------|------|-----------|
| Desktop | `D` | Fluid (max 1440px) | Browser window with macOS-style title bar |
| Tablet  | `T` | 768 × 946 px | Tablet card |
| Mobile  | `M` | 393 × 852 px | iPhone 15/16 shell with dynamic island |

Your mockup should use responsive CSS so it looks right at each width. The stage scrolls if the device frame is taller than the panel.

---

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `⌘K` / `Ctrl+K` | Focus search |
| `B` | Toggle sidebar |
| `R` | Reload current mockup |
| `D` / `T` / `M` | Desktop / tablet / mobile |
| `←` / `→` | Previous / next state |
| `↑` / `↓` | Previous / next page |
| `1`–`9` | Jump to page by position |
| `Esc` | Clear search (when search is focused) |

Shortcuts are disabled while typing in an input or textarea.

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

**State dots** — the small coloured circles next to each page name indicate which states the page has. The colour is inferred from the state `id`:

| id contains | Colour      |
|-------------|-------------|
| `error`, `fail` | Red     |
| `success`, `done`, `complete` | Green |
| `loading`, `process` | Yellow |
| `empty`, `new` | Light blue |
| `active`, `premium` | Purple |
| other | Grey |

**Search** — the search box filters by page name, group, and tags simultaneously.

---

## URL hash routing

The current page and state are kept in the URL hash:

```
index.html#login/error
```

Refreshing or sharing this link restores the same view. Hash format: `#<pageId>/<stateId>`.

---

## Open in new tab / copy link

The status bar shows the path of the current mockup file. The **↗ open** link opens that file directly in a new tab — useful for sharing a specific page with a teammate.

The toolbar **copy link** button copies the iframe URL (including `?state=` when applicable) to the clipboard.

---

## Programmatic API

```js
MockNav.init({ title: '…', pages: [ /* … */ ] });

MockNav.go('login');              // navigate to a page (optional second arg: stateId)
MockNav.setState('error');        // switch state on the current page (reloads iframe)
MockNav.notifyState('loading');   // sync toolbar/hash without reload (same as mnNotifyState)
MockNav.reload();                 // reload the current iframe
MockNav.setDevice('mobile');      // 'desktop' | 'tablet' | 'mobile'
```

---

## Local files (`file://`)

MockNav always loads mockups in an iframe. This works on `file://` — double-click `index.html` and it should work in Chrome, Safari, and Firefox. Scripts inside mockups (Tailwind CDN, inline handlers) run normally.

States still use `?state=` in the iframe URL, so the mockup state snippet in each HTML file works as documented.

For team sharing or when `file://` restrictions apply in your browser, use a local server:

```bash
npx serve .            # fastest
python -m http.server  # if you have Python
```

Or use the **Live Server** extension in VS Code (right-click `index.html` → Open with Live Server).

---

## Asking an AI to generate mockups

When prompting an AI (Claude, ChatGPT, etc.) to generate a mockup that will be used inside MockNav, include this in your prompt:

> At the bottom of the file, add this snippet:
> ```html
> <script>
>   const s = new URLSearchParams(location.search).get('state');
>   if (s) document.body.classList.add('state-' + s);
> </script>
> ```
> Then write CSS for each state using `body.state-<id>` selectors. Use normal `<a href="other-page.html">` links between mockup files for navigation.

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
          id:    'landing',
          name:  'Landing',
          file:  'pages/landing.html',
          group: 'Public',
          badge: 'done',
        },
        {
          id:    'login',
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
          id:    'dashboard',
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
          id:    'settings',
          name:  'Settings',
          file:  'pages/app/settings.html',
          group: 'App',
          states: [
            { id: 'default', label: 'Default' },
            { id: 'success', label: 'Saved',  file: 'pages/app/settings-saved.html' },
          ],
        },
        {
          id:    '404',
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
