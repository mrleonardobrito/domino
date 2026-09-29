# Domino Agent Guide

Domino is a responsive React + Vite web app. It no longer uses the simulated phone frame, status bar, keyboard or device picker; the app renders directly in the browser and adapts from phone to desktop widths.

## Structure

- App UI lives in `src/Prototype.tsx` and `src/prototype.css`; `src/App.tsx` and `src/main.tsx` only mount it.
- Use native page scrolling and standard `input` elements. Use the local `Sheet` component (Radix Dialog) for modals: bottom sheet on phones, centered dialog from 640px up.
- Respect device safe areas with `env(safe-area-inset-*)` (the viewport uses `viewport-fit=cover`).
- Keep content in a centered column (max 600px) and avoid horizontal page scroll at any width.
- `npm run build` outputs the static site to `dist/client` (also prepares the Sites worker output). Vercel deploys use `vercel.json`.

## Domino product decisions
- Selected visual: chainable Domino concept, generated image exec-62517b9c-86ea-4a77-bcda-1c0eb8f139b8.png.
- All app-owned copy is Brazilian Portuguese. Preserve warm yellow background, coral/blue/lilac domino tiles, black offset shadows, condensed headings and directional connectors.
- A named block has one initial SE cue and an ordered task sequence. Only the first incomplete task is actionable. Completing it releases the next.
- Editor supports adding, editing, removing and reordering tasks. Keep both drag handles and accessible move controls.
- Responsive web app (no phone frame).
- Frontend prototype: data lives in the current session; no authentication, server or external integrations.
