# MockNav demo

Run from the repo root:

```bash
npm run demo
# http://localhost:3000/example/
```

## What this demo shows

- **Tailwind CDN** in each mockup — no build step
- **States** — switch Default / Error / Loading / Empty in the toolbar (`?state=` + `body.state-*` CSS)
- **Link navigation** — click *Get started* on Home or *Sign in* on Login; MockNav follows internal `<a href="…">` links
- **Interactive states** — on Login, click *Sign in* to cycle loading → error via `mnNotifyState()`

See [DOCS.md](../DOCS.md) for the full reference.
