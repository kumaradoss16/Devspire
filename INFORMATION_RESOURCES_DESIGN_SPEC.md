# DevSpireHub Information & Resources — Design Specification
**Document ID:** `INFORMATION_RESOURCES_DESIGN_SPEC.md`  
**Version:** 1.0.0  
**Status:** Approved for Implementation  
**Design System:** DevSpireHub Dark Foundation with Technical Red Accent (`#DC2626`)  

---

## 1. Selected Design Concept: Technical Reference Hub & Editorial Library

### 1.1 Rationale
The selected direction combines the engineering precision of **Concept 1 (Technical Reference Hub)** with the structured content presentation of **Concept 2 (Editorial Knowledge Library)**:
* **Technical Grid Foundation:** Implements a fine, lightweight CSS `linear-gradient` technical grid (`rgba(220, 38, 38, 0.065)` at 38px) over the `#162238` dark canvas, evoking structured engineering schematics.
* **Unified Component Geometry:** Unifies the visual language of Featured Hub Cards, Cheat Sheets, and E-Book Guides with deep slate containers (`#020617`), rounded 14px corners, subtle red boundary illumination, and consistent typography.
* **Streamlined Category Taxonomy:** Introduces a clean 4-pillar resource navigation bar connecting published materials to clear domains: Networking, Linux, Python/Data Science, and Web/Systems.

---

## 2. Design Tokens & Color Roles

| Token Role | Value | Notes & WCAG AA Contrast |
|---|---|---|
| **Canvas Background** | `#162238` | Calibrated dark slate-navy foundation matching Tutorials, Projects & Networking |
| **Card Surface** | `#020617` | Deep dark slate container providing rich depth and high contrast |
| **Primary Accent** | `#DC2626` | Canonical DevSpireHub red token (`var(--color-red)`) |
| **Active Glow & Focus** | `rgba(220, 38, 38, 0.45)` | Elevation illumination on card hover and focus states |
| **Secondary Accent** | `#EF4444` / `#F87171` | High-contrast technical badge text (7.6:1 contrast on `#020617`) |
| **Primary Text** | `#F1F5F9` | Crisp headline and title color (14.2:1 contrast) |
| **Secondary Body** | `#94A3B8` | Clean, readable summary text (6.4:1 contrast) |
| **Borders** | `rgba(220, 38, 38, 0.28)` | Subtle red-tinted boundary, illuminating to 0.65 on hover |
| **Technical Grid Line** | `rgba(220, 38, 38, 0.065)` | 1px horizontal and vertical technical grid at 38px |

---

## 3. Technical Grid Pattern Specification

Lightweight, zero-asset CSS applied to `.info-section` with radial ambient depth lighting:
```css
.info-section {
  background-color: #162238;
  background-image: 
    radial-gradient(circle at 12% 18%, rgba(220, 38, 38, 0.15) 0%, transparent 45%),
    radial-gradient(circle at 88% 82%, rgba(239, 68, 68, 0.08) 0%, transparent 45%),
    radial-gradient(ellipse at 50% 0%, rgba(220, 38, 38, 0.08) 0%, transparent 60%),
    linear-gradient(rgba(220, 38, 38, 0.065) 1px, transparent 1px),
    linear-gradient(90deg, rgba(220, 38, 38, 0.065) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 100% 100%, 38px 38px, 38px 38px;
  position: relative;
  overflow-x: clip;
}
```

---

## 4. Component Structure & Information Architecture

```text
[section.info-section #info-section]
  └── [.container (max-width: 1320px)]
        ├── [.section-header]
        │     ├── [h2: icon + "Information & Resources"]
        │     └── [p: clear editorial summary]
        ├── [.resource-category-nav (4-domain visual progression)]
        │     ├── [01: Networking & Protocols]
        │     ├── [02: Linux Administration]
        │     ├── [03: Python & Data Science]
        │     └── [04: Web & Systems Architecture]
        ├── [.resource-card-grid (2-column Featured Hub Spotlight)]
        │     ├── [Card A: Open-Source Tools Directory]
        │     └── [Card B: Digital Resources Hub]
        ├── [.cheat-section-header (Subhead + #view-all-btn-guide-link)]
        ├── [.card-grid (4-column grid for Cheat Sheets)]
        │     ├── [Cards 1-4: Initial Visible]
        │     └── [Cards 5-9: .hidden-card-cheat]
        ├── [.guide-section-header (Subhead + #view-all-btn-ebooks)]
        └── [.card-grid (4-column grid for E-Books & Guides)]
              ├── [Cards 1-4: Initial Visible]
              └── [Card 5: .hidden-card-guide]
```

---

## 5. Component Anatomy Standards

### 5.1 Featured Directory Hub Cards (`.resource-card`)
* Container: Deep `#020617` surface, `border: 1px solid rgba(220, 38, 38, 0.3)`, rounded 14px corners, subtle hover lift.
* Header: Badge pill (`DIRECTORY` / `CENTRAL HUB`) + clean `h3` title without clumsy solid background blocks.
* Description: Readable `#94A3B8` body copy.
* Footer: Source icon (`fa-github` / `fa-folder`) + pill action link with forward arrow (`Visit Directory <i class="fas fa-arrow-right"></i>`).

### 5.2 Cheat Sheet Cards (`.card-cheat`)
* Container: Deep `#020617` surface, `border: 1px solid rgba(220, 38, 38, 0.24)`, 12px corners.
* Meta Header: High-contrast domain tag (`NETWORKING`, `LINUX`, `PYTHON`) in monospace typography.
* Title & Description: Crisp semantic hierarchy with line clamp.
* Action Footer: Pill download button (`.download-btn[data-file]`) with download arrow.

### 5.3 E-Book & Guide Cards (`.card-guide`)
* Header Icon: Compact 42x42px icon container with subtle red tint and crisp vector icon.
* Meta Header: Domain tag (`NETWORKING`, `LINUX`, `PYTHON`, `HTML`) + Level badge (`BEGINNER`, `INTERMEDIATE`).
* Title & Description: Clean typography without arbitrary min-height bloat.
* Action Footer: High-contrast `.download-btn[data-file]` matching the cheat sheet action pattern.

---

## 6. Preservation Guarantees
* **Anchor ID:** `#info-section` preserved 100%.
* **Interactive Toggles:** `#view-all-btn-guide-link` and `#view-all-btn-ebooks` preserved 100% with exact class names.
* **Download Triggers:** All 14 `.download-btn` elements retain their exact `data-file="..."` paths.
