# ScholarLink — Design Aesthetics Guide

> Reference doc for all UI/UX decisions across the landing page, student dashboard, and admin panel.

---

## Design Philosophy

**Minimalist. Light. Trustworthy.**

ScholarLink handles financial data, academic records, and life-changing opportunities. The design must feel institutional-grade yet human — not cold like a government portal, not loud like a startup. Think: a well-designed bank app crossed with a modern university prospectus.

Every pixel earns its place. If it doesn't communicate data or guide action, remove it.

---

## Color System

```css
/* ── Base ── */
--color-bg:           #F8F9FB;   /* near-white with a faint cool tint */
--color-surface:      #FFFFFF;   /* cards, panels */
--color-surface-2:    #F1F4F8;   /* nested cards, table rows hover */
--color-border:       #E4E8EF;   /* hairline separators */

/* ── Brand ── */
--color-primary:      #2C63E5;   /* main CTA, links, active states */
--color-primary-soft: #EEF3FD;   /* hover backgrounds on primary elements */
--color-accent:       #00C6A2;   /* success, approved, ML score ring fill */

/* ── Scholarship Type Badges ── */
--color-external:     #5B6AF0;   /* indigo — national/NGO */
--color-merit:        #F59E0B;   /* amber — CGPA merit */
--color-athletics:    #10B981;   /* emerald — athletics */
--color-mcm:          #8B5CF6;   /* violet — merit-cum-means */

/* ── Status Colors ── */
--color-approved:     #10B981;
--color-pending:      #F59E0B;
--color-rejected:     #EF4444;
--color-review:       #3B82F6;
--color-expired:      #9CA3AF;

/* ── Text ── */
--color-text-primary:   #111827;
--color-text-secondary: #6B7280;
--color-text-muted:     #9CA3AF;

/* ── Achievement Level Badges (Athletics) ── */
--badge-national:     #10B981;   /* green */
--badge-state:        #3B82F6;   /* blue */
--badge-university:   #F59E0B;   /* amber */
--badge-inter:        #6B7280;   /* grey */
```

---

## Typography

```css
--font-sans:    'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', monospace; /* SQL snippets only */

/* Scale */
--text-xs:      0.75rem;    /* 12px — labels, metadata */
--text-sm:      0.875rem;   /* 14px — body, table data */
--text-base:    1rem;       /* 16px — default */
--text-lg:      1.125rem;   /* 18px — card titles */
--text-xl:      1.25rem;    /* 20px — section headers */
--text-2xl:     1.5rem;     /* 24px — page titles */
--text-hero:    clamp(2.5rem, 6vw, 5rem); /* landing page headline */

/* Weights */
--font-normal:  400;
--font-medium:  500;
--font-semibold: 600;
--font-bold:    700;
```

---

## Spacing & Layout

```css
--radius-sm:    6px;
--radius-md:    12px;
--radius-lg:    20px;
--radius-xl:    28px;
--radius-full:  9999px;   /* pills, badges */

--shadow-sm:    0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-md:    0 4px 12px rgba(0,0,0,0.08);
--shadow-lg:    0 12px 32px rgba(0,0,0,0.10);
--shadow-card:  0 2px 8px rgba(44,99,229,0.07);

/* Grid */
--sidebar-width:  240px;
--content-max:    1200px;
--card-gap:       1.25rem;
```

---

## Component Patterns

### Scholarship Card
```
┌─────────────────────────────────────────────┐
│  [TYPE BADGE]                    [ML RING]  │
│  Scholarship Name                   82%     │
│  Provider Name · ₹45,000/yr               │
│                                             │
│  ████████████░░░░  18 days left             │
│                                             │
│  [Apply Now]              [Save for later]  │
└─────────────────────────────────────────────┘
```
- `border-radius: var(--radius-lg)`
- Hover: `transform: translateY(-2px)` + `box-shadow: var(--shadow-lg)`
- Left border accent stripe = scholarship type color (4px solid)
- ML ring: SVG circular progress, stroke = `--color-accent`

### MCM Card (unique)
```
┌─────────────────────────────────────────────┐
│  [MCM BADGE]                     [ML RING]  │
│  Scholarship Name                   75%     │
│                                             │
│  CGPA Component    ████████░░  64 pts       │
│  Income Component  █████░░░░░  35 pts       │
│  ─────────────────────────────────          │
│  Composite Score               99/100       │
└─────────────────────────────────────────────┘
```

### Athletics Card (unique)
```
┌─────────────────────────────────────────────┐
│  [ATHLETICS BADGE]   [NATIONAL ●]           │
│  Scholarship Name                           │
│  Cricket · Gold medal, State U-19           │
│  ₹20,000/yr · Verified ✓                   │
└─────────────────────────────────────────────┘
```

### CGPA Merit Card (unique)
```
┌─────────────────────────────────────────────┐
│  [MERIT BADGE]              [Rank 3 of 48]  │
│  Scholarship Name                           │
│  CSE Year 2 · Top 10%  ●────────────○      │
│  ₹15,000/yr · ████████ 89th percentile     │
└─────────────────────────────────────────────┘
```

### Status Badges
```
Approved    → green pill   bg:#D1FAE5 text:#065F46
Pending     → amber pill   bg:#FEF3C7 text:#92400E
Under Review→ blue pill    bg:#DBEAFE text:#1E40AF
Rejected    → red pill     bg:#FEE2E2 text:#991B1B
Expired     → grey pill    bg:#F3F4F6 text:#6B7280
```

---

## Dashboard Layout

```
┌──────────────────────────────────────────────────────────┐
│  SIDEBAR (240px, white, border-right)                    │
│  [Logo]                                                  │
│  ─────────────                                           │
│  ○ Dashboard                                             │
│  ○ My Matches      (4 tabs inside: All/External/College/Applied)
│  ○ Applications                                          │
│  ○ Documents                                             │
│  ○ Profile                                               │
│  ─────────────                                           │
│  [Student Avatar + Name]                                 │
├──────────────────────────────────────────────────────────┤
│  TOPBAR (sticky, white, shadow-sm)                       │
│  Page Title        [Search]    [Notifications]  [Avatar] │
├──────────────────────────────────────────────────────────┤
│  CONTENT AREA (bg: --color-bg, padding: 2rem)            │
│                                                          │
│  STATS ROW (4 cards: Matches Found / Applied / Approved / Total Aid)
│  [card] [card] [card] [card]                             │
│                                                          │
│  MAIN GRID                                               │
│  [Scholarship Cards — 3 columns on desktop, 1 on mobile] │
│                                                          │
│  ML INSIGHT BANNER (sticky bottom or inline)             │
│  "Improve CGPA by 0.3 to unlock 4 more scholarships →"  │
└──────────────────────────────────────────────────────────┘
```

### Stats Cards
Each stat card has: icon (24px, colored) · large number (`text-2xl bold`) · label (`text-sm secondary`) · subtle bottom border in type color.

No drop shadows on stats cards — they sit flat on the page bg.

---

## Micro-interactions

- **Card hover:** `translateY(-2px)` + shadow deepens + type border stripe brightens slightly
- **ML ring:** SVG stroke-dashoffset animation, 1.2s ease-out, triggered on scroll or tab-switch
- **MCM bars:** Width animation from 0 to computed value, 0.8s ease-out, staggered 150ms
- **Achievement badge:** Slight glow on hover matching badge color
- **Status badge transitions:** Color cross-fade when status updates (websocket or polling)
- **Tab switch:** Underline slides horizontally (not fade in/out)
- **Apply button:** Ripple effect on click + brief success pulse

---

## Responsive Breakpoints

```
Mobile:   < 640px  — 1 column cards, collapsed sidebar (bottom nav)
Tablet:   640–1024px — 2 column cards, sidebar icon-only
Desktop:  > 1024px — 3 column cards, full sidebar
```

---

## Accessibility Rules

- All color pairs must meet WCAG AA (4.5:1 for text, 3:1 for UI components)
- Focus rings: `2px solid --color-primary` with `2px offset`
- ML score ring always has an accessible text alternative (e.g., `aria-label="Approval probability: 82%"`)
- Status badges never rely on color alone — always include text label
- Keyboard-navigable tabs with `role="tablist"` / `role="tab` / `aria-selected`

---

## What to Avoid

- No dark cards against dark background (except the hero section)
- No gradient buttons (solid fills only)
- No more than 3 font weights on any single page
- No skeleton loaders with heavy shimmer — use subtle opacity pulse
- No full-width images in the dashboard — data is the visual
- No parallax inside the dashboard — only on the landing page hero

---

*ScholarLink Design System v1 — Minimalist · Light · Trustworthy*