---
name: Core Career Connect
description: Engineering careers, thoughtfully matched. A calm forest-green recruitment portal with one lime signal.
colors:
  ink: "#17221e"
  ink-2: "#3c4a43"
  text-3: "#56655e"
  muted: "#5b6861"
  surface: "#ffffff"
  surface-faint: "#fafbf9"
  paper: "#f5f7f3"
  sunken: "#f0f1ef"
  tint: "#eff6eb"
  tint-strong: "#d8e7d8"
  tint-strong-ink: "#28543e"
  line: "#e5eae5"
  line-soft: "#edf0ed"
  line-strong: "#dfe5df"
  accent-line: "#6c9c79"
  accent-line-soft: "#b5d2bf"
  accent-line-hover: "#83ac8c"
  green: "#1d674b"
  green-dark: "#174d3a"
  forest: "#173c31"
  lime: "#d5f36a"
  lime-ink: "#27452b"
  progress: "#70a66e"
  success: "#39704e"
  success-bg: "#eff6eb"
  warn: "#8a5a0f"
  warn-bg: "#fff3df"
  info: "#3d6a90"
  info-bg: "#eaf1f8"
  danger: "#a84d40"
  danger-bg: "#fcecea"
  on-dark: "#eff7f0"
  on-dark-2: "#c4d0c8"
  on-dark-3: "#a6b8ae"
  focus: "#1d674b"
  focus-dark: "#d5f36a"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(36px, 4vw, 58px)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "0"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    letterSpacing: "0"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 700
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  body-sm:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "13px"
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 700
  eyebrow:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "1.25px"
rounded:
  sm: "5px"
  field: "7px"
  md: "8px"
  card: "10px"
  lg: "12px"
  pill: "20px"
  round: "50%"
spacing:
  xs: "6px"
  sm: "9px"
  md: "13px"
  lg: "19px"
  xl: "26px"
  page-x: "38px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  button-primary-hover:
    backgroundColor: "{colors.green-dark}"
  button-light:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  button-lime:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.lime-ink}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "10px 11px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "18px"
  metric-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "17px 18px"
  status-pill:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success}"
    rounded: "{rounded.pill}"
    padding: "5px 8px"
  status-pill-review:
    backgroundColor: "{colors.warn-bg}"
    textColor: "{colors.warn}"
  status-pill-interview:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.info}"
  status-pill-rejected:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger}"
  status-pill-closed:
    backgroundColor: "{colors.sunken}"
    textColor: "{colors.muted}"
  tag:
    backgroundColor: "{colors.sunken}"
    textColor: "{colors.text-3}"
    rounded: "{rounded.sm}"
    padding: "5px 8px"
  modal:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    width: "540px"
  toast:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  sidebar:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.on-dark}"
    width: "250px"
    padding: "26px 18px"
  login-story:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.on-dark}"
---

# Design System: Core Career Connect

## Overview

**Creative North Star: "The Quiet Placement Desk"**

A recruitment portal that behaves like a well-run agency desk: calm, legible, and organised around status. Deep forest green anchors identity and navigation; everything else is pale green-tinted paper, hairline borders, and dark ink. A single acid-lime accent marks the one thing that matters on a surface (the brand mark, the active nav edge, one highlighted word, the lime button). Students get warmth through copy and a soft tint palette; staff get efficiency through dense tables and small controls.

Density is moderate-to-compact: 12-14px text, 10px card radii, 1px borders instead of shadows. Depth is almost entirely tonal (paper behind white panels behind tinted chips). The system is light only; there is no dark mode.

**Key Characteristics:**
- Forest green + lime, with a green-tinted neutral family (never pure gray).
- Flat, bordered surfaces; shadow only for hover lift, modal, and toast.
- Status is always a colour pill with a dot, never colour alone in running text.
- Two typefaces: Manrope for headings and numbers, DM Sans for everything else.
- Accessible by default: 3px focus ring, 44px touch targets on coarse pointers, 12px text floor, 4.5:1 text contrast.

## Colors

A restrained green-led palette. All values live as CSS custom properties on `:root` in `index.html`; never write a raw hex in a rule.

### Primary
- **Portal Green** (`--green`, #1d674b): primary buttons, links, eyebrows, icon glyphs, default focus ring. Hover/pressed: **Deep Green** (`--green-dark`, #174d3a).
- **Forest** (`--forest`, #173c31): sidebar, login story panel and login shell background, toast. The only large dark surface.

### Secondary
- **Signal Lime** (`--lime`, #d5f36a): brand mark, active-nav inset edge, headline emphasis, the lime button, the large login circle, focus ring on dark. Ink on lime is **Lime Ink** (`--lime-ink`, #27452b).

### Tertiary
- **Progress Sage** (`--progress`, #70a66e): profile completion bar fill only.
- **Accent Lines** (`--accent-line` #6c9c79, `--accent-line-soft` #b5d2bf, `--accent-line-hover` #83ac8c): green-tinted borders for selected, hover and focused-field states.

### Neutral
- **Ink** (`--ink`, #17221e): body text, headings. **Ink 2** (`--ink-2`, #3c4a43): strong secondary text (light button label, table primary cell, activity copy, login labels). **Text 3** (`--text-3`, #56655e): form labels, tags, icon buttons. **Muted** (`--muted`, #5b6861): captions, notes, subheads; the lightest permitted text on light surfaces.
- **Paper** (`--paper`, #f5f7f3): page and login-panel background. **Surface** (`--surface`, #fff): panels, cards, fields, modals. **Surface Faint** (`--surface-faint`, #fafbf9): table header, choice-button hover. **Sunken** (`--sunken`, #f0f1ef): tags and neutral (closed/draft) pills.
- **Tint** (`--tint`, #eff6eb): pale green fill for icon chips, company marks, selected choice, success pill. **Tint Strong** (`--tint-strong`, #d8e7d8) with **Tint Strong Ink** (`--tint-strong-ink`, #28543e): avatars.
- **Lines**: `--line` #e5eae5 (panel and card borders), `--line-soft` #edf0ed (row dividers, progress track), `--line-strong` #dfe5df (field borders, section dividers).
- **On-dark text**: `--on-dark` #eff7f0, `--on-dark-2` #c4d0c8, `--on-dark-3` #a6b8ae. Overlays: `--on-dark-hover` (#ffffff14), `--on-dark-faint` (#ffffff0b), `--on-dark-line` (#ffffff1a). Also `--glass` (#ffffffc7, sticky topbar) and `--scrim` (#10251dc4, modal backdrop).

### Status (foreground + background pairs)
- **Success** `--success` #39704e on `--success-bg` #eff6eb: New / Open / Active.
- **Warn** `--warn` #8a5a0f on `--warn-bg` #fff3df: In review.
- **Info** `--info` #3d6a90 on `--info-bg` #eaf1f8: Interview.
- **Danger** `--red` #a84d40 on `--danger-bg` #fcecea: Rejected, login error text.
- **Neutral** `--muted` on `--sunken`: Closed, Draft.
(Offer and Paused currently reuse the success/neutral pairs; there is no dedicated Offer colour.)

### Named Rules
**The One Lime Rule.** Lime appears once or twice per screen as a signal, never as a fill for large content areas (the login circle is the single decorative exception).
**The Tinted Neutral Rule.** Every neutral carries a slight green cast. Do not introduce cool or pure grays, or new near-duplicate tints; pick the nearest existing token.
**The Token-Only Rule.** Rules reference `var(--token)`. A new colour needs a new named token with a role, not a raw hex.

## Typography

**Display / Heading Font:** Manrope (sans-serif), weights 500-800
**Body Font:** DM Sans (sans-serif), weights 400-700 (loaded from Google Fonts)

**Character:** Manrope's geometric, slightly engineered headings suit the mechanical/electrical audience; DM Sans keeps dense forms and tables friendly. Letter-spacing is 0 on headings; only uppercase micro-labels are tracked.

### Hierarchy
- **Display** (Manrope 800, clamp(36px, 4vw, 58px), 1.08; 34px under 740px): login story headline only.
- **Page title** (Manrope 800, 28px; 23px under 740px): `h1` on each page. Login heading is 25px.
- **Metric value** (Manrope 800, 27px; 24px under 470px): dashboard numbers.
- **Title** (Manrope 700, 13-16px): panel titles 13px, job titles and profile name 14-15px, modal title 16px.
- **Body** (DM Sans 400, 14px base): default; descriptive copy 13px at line-height 1.5-1.75.
- **Label** (DM Sans 600-700, 12px): buttons, form labels, status pills, captions. 12px is the floor for readable text.
- **Eyebrow** (DM Sans 700, 11px, 1.25px tracking, uppercase): section kickers; table headers are 11px uppercase with .7px tracking. These two are the only 11px text.

### Named Rules
**The Two-Voice Rule.** Manrope for things you scan (titles, numbers, brand), DM Sans for things you read. Never mix them within one run of text.
**The 12px Floor Rule.** No running text below 12px; only uppercase tracked kickers may use 11px.

## Layout

Fixed 250px sidebar (`--forest`) with a main column offset by the same width; sticky 72px topbar; content in `.page` (max 1440px, padding 33px 38px 60px, centred). Grids use `minmax(0, 1fr)` columns: four-up metrics (12px gap), 1.55fr/.85fr overview, two-up job grid, content + 280px profile card. Spacing is a loose 6/9/13/19/26px rhythm tuned by eye rather than a strict 4px grid; keep new gaps on those steps.

Breakpoints:
- **max-width 1050px:** sidebar 215px, page padding 28px 25px, metrics 2 columns, profile aside 240px.
- **max-width 740px:** sidebar collapses to a 72px icon rail (labels, support card, identity text hidden), topbar 60px, page padding 24px 16px, h1 23px, single-column grids, login splits into a short story header above the form (story paragraph and footer hidden, circle shrinks).
- **max-width 470px:** tighter metrics (8px gap), stacked heading actions, single-column forms, reduced table cell padding.

Login: two equal columns (min 360/420px) at desktop, forest story left, paper form right (box 400px wide).

## Elevation & Depth

Flat with tonal layering: paper page, white bordered panels (1px `--line`), tinted chips. Shadows are state-only. The topbar adds a 12px backdrop blur over `--glass`.

### Shadow Vocabulary
- **Ambient** (`--shadow`: `0 18px 52px #18332912`): toast.
- **Card hover** (`--card-hover-shadow`: `0 12px 26px #1b58310a`): job card lifts 2px with an `--accent-line-soft` border.
- **Modal** (`--modal-shadow`: `0 30px 100px #0003`): modal over a `--scrim` backdrop.
- **Field focus halo** (`--focus-halo`: `0 0 0 3px #3a87531a`): faint ring added with `--accent-line` border.

### Named Rules
**The Flat-By-Default Rule.** Surfaces carry borders, not shadows, at rest. Shadows appear only for hover lift, overlays, and focus.

## Shapes

Softly rounded rectangles, small-to-medium: 5px tags, 7px fields, 8px buttons/nav/toast, 9-10px cards, panels, metric cards and icon chips, 12px modal and brand mark, 20px status pills, 50% avatars and dots. Borders are always 1px; active nav uses a 3px inset left edge in lime. The login screen uses one oversized lime circle bleeding off the bottom-right as its only decorative shape.

## Components

### Buttons
- **Shape:** 8px radius, 10px 14px padding (7px 10px small), 12px / 700 label, inline-flex with 8px gap.
- **Primary:** Portal Green fill, white text; hover Deep Green and a 1px upward nudge.
- **Light:** white fill, `--line` border, Ink 2 text. **Lime:** lime fill, Lime Ink text, for the rare highlighted action.
- **Text link:** green 12px/700, no chrome; expanded hit area via pseudo-element.
- **Coarse pointer / max 740px:** all buttons min-height 44px.

### Fields
- **Style:** white fill, 1px `--line-strong` border, 7px radius, 10px 11px padding, 12px text (16px on coarse pointers to prevent iOS zoom); min-height 44px on login and coarse pointers.
- **Focus:** 3px green outline (1px offset) plus `--accent-line` border and `--focus-halo`.
- **Error:** inline `--red` 12px text beneath the form (`.login-error`), reserved min-height so layout does not jump.

### Status pills and tags
- **Pill:** 20px radius, 5px 8px padding, 12px/700, 5px currentColor dot, colours from the Status pairs. Always carries a text label.
- **Tag:** Sunken fill, Text 3 text, 5px radius, 12px; used for job attributes.

### Cards / Containers
- **Panel / content panel / job card / metric card:** white, 1px `--line`, 10px radius; panel padding 17-19px, job card 18px, metric card 17px 18px (min-height 116px). Job card hover: lift, `--accent-line-soft` border, card hover shadow.
- **Icon chip:** 30px (metric) / 28px (activity) square, 9px radius, Tint fill, green glyph. **Company mark:** 38px, Tint fill, Manrope 800 initials.
- **Profile card:** centred, 64px Tint Strong avatar, 6px progress bar (Sage fill on Line Soft).

### Tables
Full-width collapsed table in a horizontally scrolling wrapper; cell text wraps, while headers, status pills and buttons stay on one line. Header cells: Surface Faint fill, 11px uppercase muted, `--line` bottom border. Body: 12px 13px padding, 13px text, `--line-soft` row dividers (none on the last row), primary cell Ink 2 / 700 with a muted 12px secondary line.

### Modal
540px max width, white, 12px radius, modal shadow over `--scrim`; head (title 16px Manrope + muted subtitle + 20px close button), body padding 20px 21px, footer right-aligned with 8px gap. Enters with an 8px rise (.2s) and backdrop fade; reduced-motion shortens animations.

### Toast
Forest fill, white 12px text, 8px radius, ambient shadow, fixed bottom-right (22px).

### Navigation (sidebar)
Forest background; items are 8px-radius buttons, 12px 11px padding, `--on-dark-2` text at 600 weight. Hover/active: `--on-dark-hover` fill and white text; active adds a 3px inset lime edge. Section label is 11px uppercase `--on-dark-3`. Support card uses `--on-dark-faint` with an `--on-dark-line` border. Identity row separated by `--on-dark-line`. Under 740px it is an icon-only 72px rail.

### Metric cards
Four per row on desktop (two under 1050px). Muted 12px/600 label with a Tint icon chip right-aligned, then a Manrope 800 27px value (13px above, 3px below) and a muted 12px note.

### Login screen (signature)
Forest background shell. Left story panel: lime brand mark, 11px lime eyebrow, Manrope display headline with the key phrase in lime, `--on-dark-2` paragraph, footer in `--on-dark-3`, and a large lime circle bleeding off the bottom-right. Right panel on Paper holds a 400px form box: eyebrow, 25px heading, portal chooser (two 105px-tall buttons with a 38px Tint icon chip, label, caption, arrow; selected state uses Tint fill and an `--accent-line` 1px inset border), then fields, a full-width primary button, and an auth-switch line.

## Do's and Don'ts

### Do:
- **Do** use `var(--token)` for every colour; extend the token set instead of adding a hex.
- **Do** pair every status with its fg/bg tokens and a text label; keep to the five Status pairs.
- **Do** keep body text at 12px or larger and at least 4.5:1 contrast (`--muted` #5b6861 is the lightest text allowed on light surfaces; `--on-dark-3` is the lightest on forest).
- **Do** keep the 3px focus ring (`--focus` on light, `--focus-dark` on forest/lime/toast) on every interactive element; adjust only `outline-offset` where clipping occurs.
- **Do** give touch targets at least 44px under `(pointer: coarse)` and at 740px or narrower; use pseudo-element hit-area expansion for text links.
- **Do** honour `prefers-reduced-motion` for any new animation or transform transition.
- **Do** write student-facing copy warmly and staff-facing copy tersely, in line with PRODUCT.md.

### Don't:
- **Don't** add dark mode or cool/neutral grays; neutrals stay green-tinted.
- **Don't** use lime as a large fill, as text on light backgrounds (fails contrast), or more than once or twice per screen.
- **Don't** convey status by colour alone, and don't use `--red` for anything but errors and Rejected.
- **Don't** add shadows to resting cards, or nest bordered cards inside bordered cards.
- **Don't** mix Manrope and DM Sans within a text run, or set Manrope below 12px.
- **Don't** introduce new radii or near-duplicate tints; snap to the existing steps.
- **Don't** use `--accent-line*` borders as the only signal of selection on text-bearing controls without the tint fill.
