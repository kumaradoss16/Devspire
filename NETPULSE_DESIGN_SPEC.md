# NetPulse "Precision Instrument Panel" Design Specification

## 1. Design Vision & Guiding Principles
Transform the NetPulse Speed Tester into a calm, authoritative, instrument-grade technical dashboard in the DevSpireHub dark aesthetic.

### Core Tenets
- **Precision Instrument**: Every readout, chart line, and needle sweep feels measured and accurate rather than gamified or flashing.
- **Zero Content Modification**: 100% preservation of all existing text, labels, FAQs, tables, newsletter fields, and SEO metadata.
- **Accessible & Usable by Default**: WCAG 2.2 AA compliance across all states: 44px+ touch targets, >= 4.5:1 text contrast, non-color visual distinctions, full keyboard navigation, and polite screen reader announcements.
- **Fluid & Responsive Without Breakage**: Zero horizontal overflow at any width (320px–1920px+), responsive tables, container queries, and fluid typography.
- **Decoupled Architecture**: UI layers listen to engine events without modifying the measurement math or server selection logic.

---

## 2. Design Token Architecture

### 2.1 Color Palette
```css
:root {
  /* Foundations */
  --np-bg-canvas: #0D1117;       /* Deepest page canvas */
  --np-bg-surface: #151B23;      /* Primary dashboard card surface */
  --np-bg-elevated: #1B2531;     /* Elevated tiles, stats, and dialogs */
  --np-bg-subtle: #212C3B;       /* Hover states and interactive pills */

  /* Borders */
  --np-border-subtle: rgba(255, 255, 255, 0.08);
  --np-border-default: #2A3544;
  --np-border-strong: rgba(255, 255, 255, 0.22);
  --np-border-focus: #FF710D;

  /* Typography */
  --np-text-primary: #F1F5F9;    /* 15.5:1 contrast on surface */
  --np-text-secondary: #A7B2C0;  /* 7.2:1 contrast on surface */
  --np-text-muted: #8392A3;      /* 4.8:1 contrast on surface (exceeds WCAG 4.5:1) */

  /* Data Accents */
  --np-accent-brand: #E54415;    /* DevSpire Primary Orange */
  --np-accent-dl: #FF710D;       /* Download metric (Orange) */
  --np-accent-ul: #19BAAF;       /* Upload metric (Teal) */
  --np-accent-ping: #F59E0B;     /* Ping metric (Warm Amber) */
  --np-accent-jit: #EC4899;      /* Jitter metric (Pink) */
  --np-accent-loss: #EF4444;     /* Packet loss / Alert (Red) */
  --np-accent-success: #10B981;  /* Complete / Good state */
}
```

### 2.2 Typography Scale (Fluid Modular Clamp)
- **Display Numerals (`#liveSpd`)**: `clamp(2.5rem, 5vw + 1rem, 4rem)` (Tabular Figures)
- **Primary Metrics (`#dlSpd`, `#ulSpd`)**: `clamp(1.25rem, 2.5vw, 1.75rem)`
- **Secondary Metrics (`#pingV`, `#jitV`, `#lossV`)**: `clamp(1.125rem, 2vw, 1.5rem)`
- **Card Headings**: `clamp(1.1rem, 1.5vw, 1.35rem)`
- **Body & Explanatory Text**: `clamp(0.9rem, 0.4vw + 0.8rem, 1rem)`
- **Captions & Metadata**: `clamp(0.72rem, 0.2vw + 0.68rem, 0.8rem)`

### 2.3 Border Radii & Spacing Scale
- **Radii**:
  - `sm`: `4px` (sub-badges, ticks)
  - `md`: `8px` (buttons, tabs, inputs, server pills)
  - `lg`: `16px` (metric tiles, chart cards, prompt dialog)
  - `xl`: `24px` (master instrument dashboard `.D`)
  - `full`: `9999px` (progress pills, timer ring)
- **Spacing**: 8pt grid (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`).

---

## 3. Component Inventory & Behavior

### 3.1 Gauge & Speedometer
- **SVG Arc**: Precision dual track arc:
  - Background track: Subtle dark stroke `#1B2531` with crisp radial graduation marks.
  - Active sweep: Smooth conic/arc stroke in Brand Orange (`#FF710D`).
- **Needle**: Slender pointer with damped spring physics (`SPRING = 0.10`, `DAMP = 0.72`).
- **Accessibility**:
  - `role="meter"` with live `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.
  - Non-visual text update every 1 second during test for screen readers.

### 3.2 Dual Metric Differentiation (Non-Color Relying)
- **Download**:
  - Color: Brand Orange (`#FF710D`)
  - Icon: Solid Download Arrow (`ti ti-download`)
  - Chart Line: **Solid stroke** (width 2.5px) with soft gradient fill under curve.
  - Progress Bar: Solid bar fill.
- **Upload**:
  - Color: Instrument Teal (`#19BAAF`)
  - Icon: Outlined Upload Arrow (`ti ti-upload`)
  - Chart Line: **Dashed stroke** (`borderDash: [6, 4]`, width 2.5px) without fill.
  - Progress Bar: Subtle diagonal hatched fill.

### 3.3 Server Selection Matrix
- **Mode Switcher**: Accessible tablist with `role="tablist"` and `role="tab"`:
  - `Nearby` (`aria-selected="true"`)
  - `All` (`aria-selected="false"`)
- **Server Pills**: Horizontally scrollable row with smooth wheel scroll, touch gestures, and `min-height: 44px` touch targets. Proximity badges (`<1km`, `45km`) clearly separated.

### 3.4 Accessible Location Permission Dialog (`#geoPrompt`)
- Upgraded to a compliant modal dialog:
  - `role="dialog"`, `aria-modal="true"`, `aria-labelledby="geoPromptTitle"`, `aria-describedby="geoPromptDesc"`.
  - Focus trapped inside dialog on appearance.
  - `Escape` key automatically executes "Skip".
  - Keyboard focus restored to the "Test Servers" section after dismissal.

### 3.5 Charts Frame (`#liveC` & `#pingC`)
- Responsive aspect ratio using `ResizeObserver`.
- Redraw throttled to 10–15 fps during active measurement to prevent thread contention.
- Accessible tabular summary accordion toggle underneath for screen readers and high-contrast users.

### 3.6 Test History & Persistence
- **Storage Migration**: Automatically syncs test runs to `localStorage` under key `netpulse_history_v1`.
- **Backward Compatible**: Reads existing in-memory schema, stores ISO timestamps, server details, download, upload, ping, jitter, and rating.
- **Defensive Storage**: Wrapped in `try...catch` with private browsing / quota exhaustion fallback.

---

## 4. Responsive Wireframes

### Mobile (<640px) — Focused Vertical Stack
```
┌──────────────────────────────────────────────┐
│ [DevSpireHub Logo]                      [≡]  │
├──────────────────────────────────────────────┤
│ NetPulse Speed Analyzer                      │
│ Server: Mumbai, IN • ISP: Detecting…         │
├──────────────────────────────────────────────┤
│ [Speedometer SVG Gauge (Auto-scaled)]        │
│          45.9 Mbps                           │
│   Download: 45.9  |  Upload: 24.3           │
├──────────────────────────────────────────────┤
│ [▶ START TEST (Full-width, 48px height)]     │
├──────────────────────────────────────────────┤
│ [DL Progress Tile]     [UL Progress Tile]    │
├──────────────────────────────────────────────┤
│ [Ping: 24ms]   [Jitter: 7ms]   [Loss: 0%]    │
├──────────────────────────────────────────────┤
│ [Throughput Chart (Solid DL / Dashed UL)]    │
│ [Ping / Jitter Chart]                        │
├──────────────────────────────────────────────┤
│ [Test Servers: [Nearby] [All] (44px pills)]  │
├──────────────────────────────────────────────┤
│ [Network Info Card]                          │
├──────────────────────────────────────────────┤
│ [Test History (Scrollable Table + Clear)]    │
├──────────────────────────────────────────────┤
│ [Speed Rating Guide (Internal scroll)]       │
├──────────────────────────────────────────────┤
│ [DevSpire Dispatch Newsletter]               │
└──────────────────────────────────────────────┘
```

### Desktop (>=1024px) — 2-Column Precision Dashboard
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo] DevSpireHub           Home  Projects  Programming  Hacking  NetPulse │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────┐ ┌───────────────────────────────────────┐ │
│ │       INSTRUMENT CLUSTER      │ │             ACTIVE METRICS            │ │
│ │                               │ │  DOWNLOAD              UPLOAD         │ │
│ │        [SVG GAUGE]            │ │  45.9 Mbps             24.3 Mbps      │ │
│ │                               │ │  [Solid Progress]      [Dashed Bar]   │ │
│ │          45.9 Mbps            │ ├───────────────────────────────────────┤ │
│ │                               │ │  PING       JITTER       PACKET LOSS  │ │
│ │   [▶ START TEST (52px)]       │ │  24 ms      7 ms         0%           │ │
│ └───────────────────────────────┘ └───────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────┐ ┌───────────────────────────────────────┐ │
│ │  LIVE THROUGHPUT CHART        │ │  PING & JITTER CHART                  │ │
│ │  (Solid DL vs Dashed UL)      │ │  (Amber Ping vs Pink Jitter)          │ │
│ └───────────────────────────────┘ └───────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────┐ ┌───────────────────────────────────────┐ │
│ │  TEST SERVERS (Nearby / All)  │ │  NETWORK INFORMATION                  │ │
│ │  [Mumbai] [Chennai] [Delhi]   │ │  ISP • IP Address • City • Timezone   │ │
│ └───────────────────────────────┘ └───────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│  TEST HISTORY (Local storage, min/avg/max summary, clear & export)         │
├─────────────────────────────────────────────────────────────────────────────┤
│  GUIDE & DOCUMENTATION (Speed rating table, How it works, Why NetPulse)     │
└─────────────────────────────────────────────────────────────────────────────┘
```
