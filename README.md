# Nscale

A high-fidelity replica of the Nscale Cloud console, built as a demo
codebase for modeinspect sales calls. Next.js 16 · Tailwind v4 · Radix ·
CVA · Zustand. All data is mock; the Workbench's replies come from a real
Claude call with a scripted offline fallback.

```bash
npm install
PORT=3006 npm run dev
```

Open http://localhost:3006 — it redirects to the org dashboard. The
design-system reference lives at `/design`. Conventions: `AGENTS.md`.
