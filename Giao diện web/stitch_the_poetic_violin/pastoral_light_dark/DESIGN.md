---
name: Pastoral Light & Dark
colors:
  surface: '#fdf9ee'
  surface-dim: '#dddad0'
  surface-bright: '#fdf9ee'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f4e9'
  surface-container: '#f1eee3'
  surface-container-high: '#ebe8de'
  surface-container-highest: '#e5e2d8'
  on-surface: '#1c1c16'
  on-surface-variant: '#414845'
  inverse-surface: '#31312a'
  inverse-on-surface: '#f4f1e6'
  outline: '#717974'
  outline-variant: '#c1c8c3'
  surface-tint: '#426558'
  primary: '#00150e'
  on-primary: '#ffffff'
  primary-container: '#062c21'
  on-primary-container: '#719586'
  inverse-primary: '#a9cfbe'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fdd65b'
  on-secondary-container: '#745c00'
  tertiary: '#250909'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e1d1c'
  on-tertiary-container: '#b2817f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c4ebda'
  primary-fixed-dim: '#a9cfbe'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#2a4d41'
  secondary-fixed: '#ffe086'
  secondary-fixed-dim: '#e8c349'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#f0b9b6'
  on-tertiary-fixed: '#311212'
  on-tertiary-fixed-variant: '#633c3b'
  background: '#fdf9ee'
  on-background: '#1c1c16'
  surface-variant: '#e5e2d8'
typography:
  display-lg:
    fontFamily: ebGaramond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: ebGaramond
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: ebGaramond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-sm:
    fontFamily: ebGaramond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: hankenGrotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: hankenGrotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: hankenGrotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
This design system balances the heritage of classical artistry with the warmth of a countryside retreat. It targets a sophisticated audience seeking intellectual depth and tactile comfort.

The design style is **Modern Editorial Minimalism**, characterized by generous whitespace, refined serif typography, and a "paper-like" physical presence. It blends the clarity of a modern SaaS interface with the high-contrast drama of a printed literary journal. The light mode evokes the feeling of natural parchment and sun-drenched stone, while the dark mode maintains its established atmosphere of a dimly lit, emerald-toned study.

## Colors
The palette is rooted in nature and prestige. 

**Light Mode (Pastoral)**
The background utilizes a soft, warm cream (#F5F2ED) to reduce eye strain and mimic high-quality paper. Surface elements use a brighter off-white (#FBF9F7) to create subtle elevation. Text is set in a deep, near-black charcoal with a hint of emerald green (#14140E) to maintain readability without the harshness of pure black.

**Accents**
- **Emerald (#062C21):** Used for primary actions and deep structural elements. In light mode, it provides a sharp, authoritative contrast.
- **Antique Gold (#D4B038):** Used sparingly for high-value highlights, active states, and secondary buttons.

**Dark Mode (Stradivarius)**
Remains a sophisticated, deep emerald environment. Use the Emerald (#062C21) for surfaces and the Darker Emerald (#041C15) for primary backgrounds, ensuring the Antique Gold provides the primary glow.

## Typography
The system employs a classic serif/sans-serif pairing. 

**EB Garamond** is used for all headings and display text. Its classical proportions and graceful serifs provide the "Stradivarius" heritage feel. Headlines should use a tighter letter-spacing to emphasize their editorial nature.

**Hanken Grotesk** handles all functional and body copy. Its clean, sharp geometry provides a contemporary counterpoint to the serif, ensuring maximum legibility in data-heavy or interactive sections. Use the semibold weight for labels to create a distinct visual hierarchy against body text.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous margins to evoke a luxury magazine feel. 

- **Desktop:** 12-column grid with 24px gutters. Use wide outside margins (40px+) to center the content and provide "breathing room."
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px gutters.

Spacing should be used expansively. Sections should be separated by large vertical gaps (e.g., 80px or 120px) to prevent the layout from feeling cluttered. Vertical rhythm is based on an 8px base unit.

## Elevation & Depth
In this design system, depth is achieved through **Tonal Layering** rather than heavy shadows.

**Light Mode:** Surfaces are distinguished by subtle color shifts from the Parchment background (#F5F2ED) to the White Surface (#FBF9F7). Use ultra-thin, low-contrast outlines (1px #E5E1D8) for cards and containers. If a shadow is required for a floating element, use a very soft, multi-layered "ambient" shadow with a hint of the primary emerald color (e.g., `rgba(6, 44, 33, 0.04)`).

**Dark Mode:** Depth is created through luminance. Primary surfaces are slightly lighter than the background. Use the Gold accent for "inner glow" effects on active states to simulate candlelight.

## Shapes
The shape language is **Soft (0.25rem)**. 

While the overall aesthetic is traditional, slightly softened corners prevent the UI from feeling aggressive or "sharp." Buttons and input fields use a consistent 4px radius. 

Exceptions:
- **Chips & Tags:** May use a full pill-shape (rounded-xl) for better visual distinction from buttons.
- **Hero Imagery:** Should maintain sharp (0px) corners to emphasize the "fine art" framing.

## Components

### Buttons
- **Primary:** Emerald background with White text. No border.
- **Secondary:** Transparent background with an Antique Gold 1px border and Gold text.
- **Ghost:** No background or border; Charcoal text that shifts to Emerald on hover.

### Input Fields
In light mode, inputs use the Surface White (#FBF9F7) with a subtle 1px border in #D6D1C4. On focus, the border transitions to Emerald. Labels should always be positioned above the field in the Label-MD style.

### Cards
Cards are flat with a 1px border. There is no heavy drop shadow. The card header should use the EB Garamond font at the Headline-SM level.

### Lists
Lists use generous 16px vertical padding between items. Separator lines should be faint (1px #E5E1D8) and not span the full width of the container, leaving a margin on either side.

### Selection Controls
Checkboxes and Radios use the Emerald color for the selected state. The "check" or "dot" should be Antique Gold to create a jewel-like interaction point.