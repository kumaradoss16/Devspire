# DevSpireHub Networking Section — Design Specification & Architecture
**Document ID:** `NETWORKING_DESIGN_SPEC.md`  
**Version:** 1.0.0  
**Status:** Approved for Implementation  
**Design System:** DevSpireHub Dark Foundation with Navy Engineering Identity (`#1347B7`)  

---

## 1. Selected Design Concept: Technical Grid Engineering & Hands-On Lab Hub

### 1.1 Rationale & Concept Synthesis
The chosen direction synthesizes **Concept 1 (Technical Grid Engineering)** and **Concept 3 (Practical Networking Lab)**:
* **Engineering Precision:** Implements a subtle, performant CSS `linear-gradient` technical grid pattern calibrated against the `#162238` dark canvas background. It evokes network packet matrices and topology blueprints without distracting from typography.
* **Structured Information Architecture:** Bridges theoretical foundations (Protocols, TCP/IP, OSI, Windows OS hierarchy) with practical simulation (Cisco Packet Tracer VLAN lab) through a clean 4-step Learning Path banner.
* **Aspect-Ratio Discipline:** Enforces strict `aspect-ratio: 16 / 9` and `object-fit: cover` on all card imagery, permanently eliminating the 2,098px height blowup and guaranteeing uniform 4-column card alignment.

---

## 2. Design Tokens & Color Space Calibration

| Token Role | Value | Notes & WCAG AA Contrast |
|---|---|---|
| **Canvas Background** | `#162238` | Calibrated dark slate-navy foundation matching Tutorials & Projects |
| **Card Surface** | `#020617` | Deep dark slate container providing rich visual depth |
| **Primary Accent** | `#1347B7` | Canonical DevSpireHub navy blue token (`--color-navy`) |
| **Active Glow & Focus** | `rgba(19, 71, 183, 0.45)` | Elevation glow on hover and focus-visible indicator |
| **Secondary Accent** | `#3B82F6` / `#60A5FA` | High-contrast technical badge pill text (7.8:1 contrast on `#020617`) |
| **Primary Text** | `#F1F5F9` | Crisp headline and title color (14.2:1 contrast) |
| **Secondary Body** | `#94A3B8` | Clean, readable summary text (6.4:1 contrast) |
| **Borders** | `rgba(19, 71, 183, 0.28)` | Subtle navy-tinted boundary, illuminating to 0.65 on hover |
| **Technical Grid Line** | `rgba(19, 71, 183, 0.08)` | 1px horizontal and vertical engineering grid at 36px |

---

## 3. Technical Grid Pattern Specification

Lightweight, zero-asset CSS pattern applied to the section canvas with radial ambient depth lighting:
```css
.networking-section {
  background-color: #162238;
  background-image: 
    radial-gradient(circle at 12% 18%, rgba(19, 71, 183, 0.14) 0%, transparent 45%),
    radial-gradient(circle at 88% 82%, rgba(59, 130, 246, 0.08) 0%, transparent 45%),
    radial-gradient(ellipse at 50% 0%, rgba(19, 71, 183, 0.08) 0%, transparent 60%),
    linear-gradient(rgba(19, 71, 183, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(19, 71, 183, 0.08) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 100% 100%, 36px 36px, 36px 36px;
  position: relative;
  overflow-x: clip;
}
```

---

## 4. Component Structure & Markup Hierarchy

```text
[section.networking-section #networking-section]
  └── [.container (max-width: 1320px)]
        ├── [.section-header]
        │     ├── [h2: icon + "Networking & Systems Architecture"]
        │     └── [p: clear editorial summary]
        ├── [.net-learning-path (4-step visual progression)]
        │     ├── [Step 1: OSI & TCP/IP Foundations]
        │     ├── [Step 2: Core Protocols & Addressing]
        │     ├── [Step 3: Systems & File Architecture]
        │     └── [Step 4: Cisco Packet Tracer Labs]
        ├── [.networking-card-grid (4-column desktop grid)]
        │     ├── [Card 1: Common Network Protocols]
        │     ├── [Card 2: Network Fundamentals 1]
        │     ├── [Card 3: Network Fundamentals 2]
        │     ├── [Card 4: Windows File System]
        │     └── [Card 5: VLAN Configuration (Cisco Packet Tracer)]
        └── [.view-all-btn #view-all-btn-networking ("View All" / "Show Less")]
```

---

## 5. Card Anatomy & Aspect-Ratio Standards

Each `.networking-card` is engineered for strict vertical parity:
1. **Media Cover (`aspect-ratio: 16 / 9`):**
   * Container: `aspect-ratio: 16 / 9; overflow: hidden; background: #060b13;`
   * Image: `width: 100%; height: 100%; object-fit: cover; display: block;`
   * Hover: Scale `1.05` transition with smooth `cubic-bezier(0.16, 1, 0.3, 1)`.
   * Type Badge: Absolute overlay (e.g., `CORE TRACK` or `SIMULATION LAB`) with dark backdrop blur.
2. **Card Body (`flex: 1; display: flex; flex-direction: column;`):**
   * **Meta Header:** Level tag (`BEGINNER`) + Section Count badge (`9 SECTIONS`) in monospace font (`JetBrains Mono`).
   * **Title (`h3`):** Semantic, high-contrast, clean 1.15rem typography with hover color transition to `#60A5FA`.
   * **Summary (`p`):** Strict 3-line or 4-line webkit clamp (`display: -webkit-box; -webkit-line-clamp: 3; line-height: 1.6;`).
   * **Footer:** Clean duration indicator (`<i class="fas fa-clock"></i> 3 hr`) + high-contrast action button `.start-networking` (`background: rgba(19, 71, 183, 0.15); border: 1px solid rgba(19, 71, 183, 0.4); color: #60A5FA;`).

---

## 6. Responsive Breakpoint Rules

* **Desktop (>=1200px):** 4 columns (`grid-template-columns: repeat(4, 1fr); gap: 1.5rem;`).
* **Tablet (768px - 1199px):** 2 columns (`grid-template-columns: repeat(2, 1fr); gap: 1.25rem;`).
* **Mobile (<768px):** 1 column (`grid-template-columns: 1fr; width: 100%; max-width: 100%;`).
* **Overflow Protection:** All nested containers set `box-sizing: border-box; width: 100%; max-width: 100%; overflow-x: clip;` with 0 horizontal overflow.

---

## 7. Preservation Guarantees
* **URLs & Anchors:** Unchanged (`#networking-section`, all 5 tutorial URLs).
* **JavaScript Toggle:** Preserved with zero modification to `script.js` (`#view-all-btn-networking` toggling `.hidden-networking` and `.show-networking`).
* **Canonical Navy Token:** `#1347B7` remains the dominant accent foundation.
