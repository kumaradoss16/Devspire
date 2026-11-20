# DESIGN.md — DevSpireHub Design System & Anti-Slop Architecture

## 1. Design Direction
DevSpireHub is designed as a technical developer platform and high-focus learning studio. It feels like an authoritative engineering publication combined with an interactive software lab—clean, intentional, and fast. The visual hierarchy is anchored by deep navy foundations with subtle navy-tinted surfaces, eliminating generic AI-template grey cards and repetitive 3-column rows. High-contrast typography and radiant orange accents guide attention naturally toward real code, actionable commands, and practical projects. Every component behaves with disciplined precision, calm micro-interactions, and zero extraneous decorative noise.

---

## 2. Token Architecture (CSS Custom Properties)

```css
:root {
  /* ── 1. Color Palette: Foundations & Brand ── */
  --color-canvas-base:       #010D18; /* Master background canvas */
  --color-surface-frame:     #08121E; /* Inset framed containers */
  --color-surface-card:      #10243A; /* Primary card surface */
  --color-surface-raised:    #162F4A; /* Elevated cards / active pills */
  --color-surface-subtle:    rgba(16, 36, 58, 0.65);

  /* Brand Accents */
  --color-brand-orange:      #E54415; /* Primary brand orange */
  --color-brand-orange-vivid:#FF710D; /* Vivid accent for headings */
  --color-brand-orange-soft: #FB923C; /* Soft text & tags */
  --color-brand-orange-glow: rgba(229, 68, 21, 0.24);

  /* Section-Specific Semantic Accents */
  --color-accent-programming:#FF710D; /* Programming: Warm Orange */
  --color-accent-networking: #2179C0; /* Networking: Tech Blue */
  --color-accent-hacking:    #FF0C0C; /* Ethical Hacking: Vivid Red / Cyan */
  --color-accent-ai:         #EC4899; /* AI & Automation: Radiant Pink */
  --color-accent-ai-soft:    #F472B6;
  --color-accent-teal:       #19BAAF; /* Precision Teal */

  /* Navy-Tinted Neutrals (Strictly Zero Flat Greys) */
  --color-text-primary:      #FFFFFF; /* High-contrast headings */
  --color-text-secondary:    #CECECE; /* Primary reading prose */
  --color-text-muted:        #94A3B8; /* Secondary metadata & dates */
  --color-border-subtle:     rgba(34, 61, 87, 0.55);
  --color-border-strong:     #223D57;
  --color-border-focus:      #FF710D;

  /* ── 2. Fluid Modular Typography Scale ── */
  --font-family-sans:        'Saira', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono:        'JetBrains Mono', 'Fira Code', monospace;

  /* Modular fluid type scale using clamp() */
  --font-size-xs:            0.75rem;                       /* 12px */
  --font-size-sm:            0.875rem;                      /* 14px */
  --font-size-base:          1rem;                          /* 16px */
  --font-size-lg:            clamp(1.125rem, 1.2vw, 1.25rem);/* 18–20px */
  --font-size-xl:            clamp(1.35rem, 1.8vw, 1.6rem);  /* 22–26px (Section Subheaders) */
  --font-size-2xl:           clamp(1.65rem, 2.4vw, 2.15rem); /* 26–34px (Section Headers) */
  --font-size-3xl:           clamp(2.1rem, 3.8vw, 3.15rem);  /* 34–50px (Hero Headline) */

  --line-height-tight:       1.15;
  --line-height-snug:        1.35;
  --line-height-relaxed:     1.65;
  --measure-prose:           68ch; /* Optimal tutorial reading measure */

  /* ── 3. Spacing Scale (8pt Grid) ── */
  --space-1:                 4px;
  --space-2:                 8px;
  --space-3:                 12px;
  --space-4:                 16px;
  --space-5:                 20px;
  --space-6:                 24px;
  --space-8:                 32px;
  --space-10:                40px;
  --space-12:                48px;
  --space-16:                64px;
  --space-20:                80px;

  /* ── 4. Unified Border Radii (4-Tier System) ── */
  --radius-sm:               4px;   /* Inline code, small tags */
  --radius-md:               8px;   /* Buttons, inputs, small cards */
  --radius-lg:               16px;  /* Standard content cards */
  --radius-xl:               24px;  /* Master framed containers */
  --radius-full:             9999px;/* Pill badges, switchers */

  /* ── 5. Elevations & Shadows ── */
  --shadow-sm:               0 2px 6px rgba(0, 0, 0, 0.25);
  --shadow-md:               0 8px 24px -4px rgba(0, 0, 0, 0.45);
  --shadow-lg:               0 20px 50px -12px rgba(0, 0, 0, 0.65);
  --shadow-glow-orange:      0 0 24px -4px rgba(229, 68, 21, 0.35);

  /* ── 6. Purposeful Motion & Transitions ── */
  --duration-fast:           150ms;
  --duration-base:           220ms;
  --duration-slow:           350ms;
  --ease-standard:           cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-base: 0ms;
    --duration-slow: 0ms;
  }
}
```

---

## 3. Core Component Standards & State Matrix

| Component | Default Visual State | Hover / Focus-Visible State | Active / Disabled State |
|---|---|---|---|
| **Primary Action Button (`.btn-primary`)** | Solid `#E54415` fill, `#FFFFFF` text, `border-radius: 8px`, `padding: 10px 20px`, bold typography. | `translateY(-1px)`, background `#FF710D`, box-shadow `0 8px 24px rgba(229, 68, 21, 0.35)`. `outline: 2px solid #FF710D; outline-offset: 3px`. | Active: `translateY(0)`, opacity `0.9`. Disabled: opacity `0.5`, pointer-events `none`. |
| **Secondary Button (`.btn-card`, `.btn-ghost`)** | Inset dark surface, 1px border `var(--color-border-strong)`, text `var(--color-text-secondary)`. | Border color adapts to section accent (`--card-accent`), background `var(--card-accent)`, text `#010D18`. | Focus-visible: 2px high-contrast outline. |
| **Content Cards (`.card`, `.recent-card`)** | Clean single card surface (`#10243A`), top section accent line (3px), subtle 1px border (`#223D57`). **No nested cards inside cards**. | `translateY(-3px)`, border-color `var(--card-accent-border)`, subtle ambient glow. | Zero perpetual bouncy animations. |
| **Category Badges (`.tag-cat`)** | Semi-transparent background `rgba(..., 0.14)`, 1px border, monospace typography, uppercase. | Accentuated border and text glow on card hover. | Static metadata element. |
| **Code Windows (Prism)** | Dark macOS-style header (`#0D1E31`), 3 discrete control dots, JetBrains Mono font, line numbers, horizontal scroll inside container. | Hover shows copy-code action button. | Keyboard navigable tab stop for scrollable code. |
| **Global Navigation (`.navbar`)** | Deep navy backdrop (`#010D18`), clean logo, accessible nav links with section-themed hover pills. | Mobile toggle: 44×44px tap target, accessible `aria-expanded` state. | Sticky behavior with minimal backdrop blur. |

---

## 4. Anti-Slop Implementation Rules
1. **Zero Nested Cards**: Sections must use fluid background canvases and clean negative space; cards are reserved strictly for discrete interactive entities (tutorials, projects, tools).
2. **Intentional Section Rhythm**: Break the monotonous 3-column grid by introducing asymmetric section layouts (e.g. 1 hero anchor + 2 secondary cards, wide comparison tables, horizontal resource chips).
3. **No Arbitrary Hex Values**: All layout and typography code must reference CSS custom properties defined in this design system.
4. **Touch Target Floor**: All interactive controls (buttons, links, pills, hamburger toggles) must meet the 44×44px minimum touch boundary.
