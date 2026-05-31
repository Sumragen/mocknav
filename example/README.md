# MockNav demo

Run from the repo root:

```bash
npm run demo
# http://localhost:3000/example/
```

Mockup pages under `pages/` use [Tailwind CSS via CDN](https://tailwindcss.com/docs/installation/play-cdn):

```html
<script src="https://cdn.tailwindcss.com"></script>
```

State variants (error, loading, empty) use a small `<style>` block with `body.state-*` selectors — see [DOCS.md](../DOCS.md#states).
