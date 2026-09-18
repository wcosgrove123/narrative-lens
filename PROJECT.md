---
id: woyn745b
name: "Narrative Lens"
kind: app
lifecycle: paused
status: "yellow"
status_note: "Unverified, set yellow by default; claude.md calls V1.0 MVP complete; not verified here"
summary: "Local-first app for photographers to sequence photo essays: import (including HEIC), drag-and-drop ordering, captions and tonal edits, stored in IndexedDB."
origin: mine
version: "0.1.0"
tags: [run:localhost, react]
repo: https://github.com/wcosgrove123/narrative-lens.git
deploy: { target: local }
launch:
  - { name: dev, cmd: "npm run dev" }
danger_zone: false
links: []
depends_on: []
created: 2026-09-17
---

## What it is
Vite, React 19, TypeScript, Dexie, dnd-kit, Radix. photos/ holds sample images. claude.md describes V1.1 (photo editing) as the current phase.

## Big plan
None recorded.

## Small plans
- [ ] None recorded.

## Decisions
- None documented.

## Notes
- Last real commit 2025-10-13.
- 2026-09-17 — manifest written during homelab reorg
