# Contributing to MockNav

Thank you for helping improve MockNav.

## What belongs in this repo

- **`mocknav.js`** — the entire runtime library (single file, no bundler)
- **`DOCS.md`** — user-facing documentation; keep in sync with API changes
- **`example/`** — runnable demo; update when adding features that need a visual check

Please avoid turning the core library into a build-step project unless there is a strong, discussed reason.

## Before you open a PR

1. Run the demo and click through pages and states:
   ```bash
   npm run demo
   ```
   Open `http://localhost:3000/example/`.
2. If you changed `mocknav.js`, run `npm run build` and commit `mocknav.min.js`.
3. Test in **Firefox** (file or server) and **Chrome** (local server).
3. Keep CSS class prefixes on the `.mn-*` namespace inside `mocknav.js`; mockups use their own prefixed classes (see DOCS.md).

## Pull request guidelines

- One logical change per PR when possible (feature, fix, or docs).
- Describe **what** changed and **why** in the PR description.
- If you change `MockNav.init` options or behavior, update **DOCS.md** and the **README** summary table if needed.

## Reporting bugs

Use [GitHub Issues](https://github.com/Sumragen/mocknav/issues) and include:

- Browser and OS
- Whether you used `file://` or a local server
- Minimal `pages` config and HTML snippet if relevant
- Expected vs actual behavior

## Questions

Open a discussion or issue — no need for a PR for questions alone.
