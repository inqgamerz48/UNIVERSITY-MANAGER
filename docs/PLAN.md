# Implementation Plan: Digital Scholar Landing Page (Option B+)

> **Goal:** Create a "Digital Scholar" landing page that blends Academic Prestige (Art) with Modern SaaS Utility (Function).
> **Style:** Dark Academia, "Paper-Glass" textures, Fraunces typography, Gold/Sage accents.

## 1. Design Specification
- **Theme:** "Scholar's Desktop"
- **Typography:** `Fraunces` (Headings, dramatic), `Outfit` (Body, UI), `JetBrains Mono` (Code/Tech details).
- **Palette:** Deep Ink Background (`#0F1419`), Gold Accents (`#D4A853`), Sage Success (`#7C9A82`).
- **Motif:** "Paper-Glass" cards (frosted glass with paper texture feel), "Folio" containers for screenshots.

## 2. Proposed Components
### A. Hero Section (`src/components/landing/Hero.tsx`)
- **Layout:** Centered or Split (Dynamic).
- **Elements:** 
  - "Ivy League" Badge.
  - H1 headline: "Academic Excellence Meets Modern Craft".
  - Dual CTAs: "Get Started" (Primary/Gold) & "View Dashboard" (Secondary/Outline).

### B. Product Folio (`src/components/landing/ProductFolio.tsx`)
- **Concept:** Instead of a generic browser frame, the dashboard screenshot sits inside a "University Folder" or "Leather Portfolio" style container.
- **Visuals:** Gold border, subtle paper texture overlay, shadow depth.

### C. Feature Grid (`src/components/landing/FeatureGrid.tsx`)
- **Style:** "Index Cards" or "Library Catalog" cards.
- **Interaction:** Hover Lift + subtle gold glow.

### D. Footer (`src/components/Footer.tsx`)
- **Style:** Minimalist, academic citation style.

## 3. Implementation Steps
1.  **Setup:** Create `docs/PLAN.md` (Done).
2.  **Scaffold:** Create `src/components/landing` directory.
3.  **Develop:**
    - Implement `ProductFolio` (The centerpiece).
    - Refine `Hero` logic and animations.
    - Extract and polish `FeatureGrid`.
    - Build `Footer`.
4.  **Integrate:** Assemble in `src/app/page.tsx`.
5.  **Polish:** Add entrance animations (`fade-up`, `stagger`), verify accessibility.

## 4. Verification Plan
- **Visual Audit:** Check against "Option B+" aesthetics (Gold/Sage/Ink).
- **Responsiveness:** Verify Layout on Mobile vs Desktop.
- **Accessibility:** Ensure contrast ratios for Gold text on Dark bg.
- **Performance:** Check LCP (Large Contentful Paint) for the Hero image.

## User Review Required
- [ ] Confirm the "Product Folio" concept (Screenshot wrapper).
