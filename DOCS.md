# MockNav — Documentation

MockNav is a single JavaScript file that turns a folder of HTML mockups into a navigable panel: sidebar, states, device widths, and click-through flows between pages. No build step, no dependencies.

Start with [README.md](README.md) for a short overview. This file is the full reference.

---

## How it works

You write one `index.html` that loads MockNav from a CDN and lists your mockup files. Each mockup is a normal HTML file on disk. MockNav shows them in an iframe — scripts run as usual, styles stay isolated, and clicks on internal links update the sidebar instead of navigating only inside the frame.

```
your-project/
├── index.html
└── pages/
    ├── home.html
    ├── auth/
    │   └── login.html
    └── app/
        └── dashboard.html
```

Mockups work on their own (open the `.html` file directly) and inside MockNav. Nothing special to wrap or import.

---

## Setup

Add one script tag to your bootstrap `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/mocknav@1.0.0/mocknav.min.js"></script>
```

Pin the version (`@1.0.0`) so CDN updates do not surprise you. [jsDelivr](https://www.jsdelivr.com/package/npm/mocknav) · [unpkg](https://unpkg.com/mocknav@1.0.0/mocknav.min.js)

That is all you need from MockNav itself. Your mockup files stay in your project folder.

---

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
        { id: 'home',  name: 'Home',  file: 'pages/home.html' },
        { id: 'login', name: 'Login', file: 'pages/auth/login.html', group: 'Auth' },
      ],
    });
  </script>
</body>
</html>
```

Open `index.html` in the browser. Works on `file://` — no server required.

---

## Interactive mockups

The main way to wire up a user flow is a regular link to another `.html` file. MockNav intercepts the click, finds that file in your `pages` config, and switches the sidebar to it.

### Register pages in `index.html`

Every mockup you want to reach by click must be listed in `MockNav.init`:

```js
MockNav.init({
  title: 'My Project',
  pages: [
    { id: 'home',      name: 'Home',      file: 'pages/home.html' },
    { id: 'login',     name: 'Login',     file: 'pages/auth/login.html' },
    { id: 'dashboard', name: 'Dashboard', file: 'pages/app/dashboard.html' },
  ],
});
```

MockNav matches by **filename** — `login.html` in the href must correspond to a `file` path that ends with `login.html`.

### Link to another mockup

From `pages/home.html`, link to login with a path **relative to the current mockup file**:

```html
<a href="auth/login.html">Get started</a>
```

From `pages/auth/login.html`, go to dashboard one folder up:

```html
<a href="../app/dashboard.html">Sign in</a>
```

Use an `<a>` tag even when it looks like a button — that is what MockNav listens for:

```html
<a href="auth/login.html" class="btn btn-primary">Get started</a>
```

When someone clicks the link inside MockNav, the sidebar jumps to that page. When they open the mockup file directly in a browser, the link works as a normal navigation.

### Open a specific state

Append `?state=` to the href:

```html
<a href="auth/login.html?state=error">Show login error</a>
```

The target page must define that state in `index.html`:

```js
{
  id: 'login',
  name: 'Login',
  file: 'pages/auth/login.html',
  states: [
    { id: 'default', label: 'Default' },
    { id: 'error',   label: 'Error'   },
  ],
}
```

### Full flow example

**`index.html`**

```js
MockNav.init({
  title: 'Demo',
  pages: [
    { id: 'home',      name: 'Home',      file: 'pages/home.html' },
    { id: 'login',     name: 'Login',     file: 'pages/auth/login.html' },
    { id: 'dashboard', name: 'Dashboard', file: 'pages/app/dashboard.html' },
  ],
});
```

**`pages/home.html`**

```html
<nav>
  <span>My App</span>
  <a href="auth/login.html">Log in</a>
</nav>

<main>
  <h1>Welcome</h1>
  <a href="auth/login.html" class="cta">Get started</a>
</main>
```

**`pages/auth/login.html`**

```html
<form>
  <!-- fields -->
  <a href="../app/dashboard.html" class="submit-btn">Sign in</a>
</form>
```

**`pages/app/dashboard.html`**

```html
<aside>
  <a href="../home.html">← Back to home</a>
</aside>
```

Click *Get started* → sidebar shows Login. Click *Sign in* → sidebar shows Dashboard. No JavaScript routing required.

### Submit button with a loading state, then navigate

If the button should show feedback before moving on, handle the click in JS but navigate through a link so MockNav stays in sync:

```html
<a href="../app/dashboard.html" id="sign-in" class="submit-btn">Sign in</a>

<script>
  document.getElementById('sign-in').addEventListener('click', function (e) {
    e.preventDefault();
    document.body.classList.add('state-loading');
    if (typeof mnNotifyState === 'function') mnNotifyState('loading');

    var target = this;
    setTimeout(function () {
      target.click(); // MockNav intercepts this second click
    }, 600);
  });
</script>
```

Style the loading state in CSS (`body.state-loading …`). See [States](#states) below.

### What MockNav ignores

| href | Behaviour |
|------|-----------|
| `page.html` | Navigate to matching page in config |
| `page.html?state=error` | Navigate + switch to that state |
| `#section` | Normal in-page anchor |
| `https://…` | Normal link (leave the shell) |
| `mailto:`, `tel:`, `javascript:` | Ignored by interceptor |

If the href points to an HTML file **not** listed in `pages`, MockNav opens it in a new tab.

Paths are resolved relative to the current iframe URL, same as in a standalone site.

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

States show the same page in different conditions — empty list, validation error, loading — without duplicating the whole file.

### URL parameter

For non-default states MockNav loads:

```
pages/auth/login.html?state=error
```

Default state has no `?state=` in the URL.

Add this snippet at the bottom of each mockup (needed when opening the file directly; inside MockNav it also applies on first load):

```html
<script>
  const s = new URLSearchParams(location.search).get('state');
  if (s) document.body.classList.add('state-' + s);
</script>
```

CSS:

```css
.login-error { display: none; }

body.state-error .login-error { display: block; }
body.state-error .login-password { border-color: #e24b4a; }

body.state-loading .submit-btn { opacity: .5; pointer-events: none; }
```

For overlays inside the preview, use `position: absolute` (or `body::after` with `inset: 0`) instead of `position: fixed`.

### Sync toolbar on click (without reload)

When the user triggers a state change inside the mockup — wrong password, spinner — keep the toolbar in sync:

```js
mnNotifyState('loading');
// later…
mnNotifyState('error');
```

MockNav injects `mnNotifyState` into each iframe. You can also toggle `body.classList` (`state-error`, etc.); MockNav watches for that and syncs the toolbar.

To actually change what is shown, update the DOM or CSS in your click handler — `mnNotifyState` only updates the shell UI.

### Separate file per state

When a state is a completely different layout:

```js
states: [
  { id: 'default', label: 'Default' },
  { id: 'success', label: 'Success', file: 'pages/auth/register-success.html' },
]
```

---

## CSS in mockups

Each mockup runs in its own iframe, so styles do not leak between pages.

Tailwind works via CDN in each file:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Add a `<style>` block for `body.state-*` rules when using states.

---

## Device preview

| Button | Shortcut | Size | Simulates |
|--------|----------|------|-----------|
| Desktop | `D` | Fluid (max 1440px) | Browser window |
| Tablet  | `T` | 768 × 946 px | Tablet |
| Mobile  | `M` | 393 × 852 px | Phone |

Use responsive CSS in your mockups. The stage scrolls if the frame is taller than the panel.

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

Disabled while focus is in an input or textarea.

---

## Sidebar

**Groups** — pages with the same `group` share a heading.

**Badges** — `new` · `wip` · `done` · `review` on the nav item.

**State dots** — coloured circles next to pages with multiple states. Colour is inferred from the state `id` (`error` → red, `loading` → yellow, etc.).

**Search** — filters by name, group, and tags.

---

## URL hash

Current page and state live in the hash:

```
index.html#login/error
```

Share or refresh that URL to restore the view.

---

## Status bar

Shows the current file path. **↗ open** opens the mockup in a new tab. **Copy link** copies the iframe URL (including `?state=` when set).

---

## Programmatic API

Called from `index.html` (outside the iframe):

```js
MockNav.init({ title: '…', pages: [ /* … */ ] });
MockNav.go('login', 'error');
MockNav.setState('loading');
MockNav.reload();
MockNav.setDevice('mobile');
```

Inside a mockup, use `mnNotifyState('error')` for toolbar sync without reload.

---

## Local files (`file://`)

MockNav loads mockups in an iframe. Double-clicking `index.html` works in Chrome, Safari, and Firefox.

If you hit browser restrictions, run a local server: `npx serve .`

---

## Prompting an AI for mockups

Include in your prompt:

> Use normal `<a href="other-page.html">` links between mockup files for navigation (paths relative to the current file). At the bottom add:
> ```html
> <script>
>   const s = new URLSearchParams(location.search).get('state');
>   if (s) document.body.classList.add('state-' + s);
> </script>
> ```
> Style states with `body.state-<id>` selectors.

---

## Live demo

The repo includes a working example under `example/`. If you clone it: `npm run demo` → `http://localhost:3000/example/`. You do not need the repo to use MockNav — the CDN script tag is enough.
