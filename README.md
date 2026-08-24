# Aureus Technologies

A mobile-responsive single-page company website built with:

- Next.js 16 (App Router, TypeScript)
- Bootstrap 5
- Bootstrap Icons
- Static export (`output: "export"`) for GitHub Pages / static hosting

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

`next build` generates the static site in `out/`, then `scripts/prepare-sites.mjs` packages it into `dist/` (including `.openai/hosting.json` for OpenAI static hosting).
