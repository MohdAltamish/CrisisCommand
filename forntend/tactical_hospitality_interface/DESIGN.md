---
name: Tactical Hospitality Interface
colors:
  surface: '#1f0f0d'
  surface-dim: '#1f0f0d'
  surface-bright: '#493431'
  surface-container-lowest: '#190a08'
  surface-container-low: '#291715'
  surface-container: '#2d1b18'
  surface-container-high: '#392522'
  surface-container-highest: '#44302d'
  on-surface: '#fcdbd6'
  on-surface-variant: '#e7bdb7'
  inverse-surface: '#fcdbd6'
  inverse-on-surface: '#402b29'
  outline: '#ad8883'
  outline-variant: '#5d3f3b'
  surface-tint: '#ffb4aa'
  primary: '#ffb4aa'
  on-primary: '#690003'
  primary-container: '#ff5545'
  on-primary-container: '#5c0002'
  inverse-primary: '#c0000a'
  secondary: '#adc6ff'
  on-secondary: '#002e69'
  secondary-container: '#4b8eff'
  on-secondary-container: '#00285c'
  tertiary: '#68d3fc'
  on-tertiary: '#003545'
  tertiary-container: '#1d9cc3'
  on-tertiary-container: '#002e3c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930005'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004493'
  tertiary-fixed: '#bbe9ff'
  tertiary-fixed-dim: '#68d3fc'
  on-tertiary-fixed: '#001f29'
  on-tertiary-fixed-variant: '#004d63'
  background: '#1f0f0d'
  on-background: '#fcdbd6'
  surface-variant: '#44302d'
typography:
  h1:
    fontFamily: Syne
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Syne
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.5'
  body-md:
    fontFamily: Syne
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  tactical-label:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  tactical-data:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.2'
  badge:
    fontFamily: Space Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin: 20px
---

## Brand & Style

This design system is engineered for high-stakes environments where split-second decision-making intersects with premium service standards. The visual language balances the cold precision of an aerospace mission control center with the understated luxury of an elite hotel concierge. It evokes a sense of absolute authority, calm under pressure, and technical sophistication.

The style leverages **High-Contrast Minimalism** and **Tactile Command** elements. It utilizes deep, ink-black voids to minimize light pollution in low-light environments, ensuring that critical alerts and tactical data are the sole focus. The aesthetic is raw and functional yet polished, removing all unnecessary ornamentation in favor of data density and legibility.

## Colors

The palette is anchored by an "Ultra-Dark" foundation. The primary background is nearly pure black to maximize the contrast of emergency indicators. 

**Crisis and Status Logic:**
- **Emergency Indicators:** Use the high-saturation Crisis Type colors.
- **Dynamic Feedback:** The "Active" status must utilize a CSS-driven pulse animation to command immediate visual attention.
- **Hierarchy:** Use the secondary text color for metadata and labels to maintain a clear information architecture, reserving the primary white for critical values and headers.
- **Borders:** Subtle borders are used to define zones without adding visual noise.

## Typography

This design system employs a dual-font strategy to differentiate between "Narrative" and "Technical" information.

- **Syne:** Used for headers and body copy. Its bold, modern geometric construction provides the "luxury" feel and ensures that instructions are legible at a glance.
- **Space Mono:** Used exclusively for "Tactical" information—status labels, timestamps, coordinates, and badge text. All tactical labels should be set in UPPERCASE with increased letter spacing to mimic mission control instrumentation.

## Layout & Spacing

The layout utilizes a **Fixed-Adaptive Grid** optimized for PWA usage on mobile and tablet devices. A 12-column grid is used for desktop views, collapsing to a single-column stack on mobile.

**Spacing Rhythm:**
- A strict 4px baseline grid ensures vertical rhythm.
- **Information Density:** Content-heavy tactical views should use `sm` (12px) padding, while luxury/overview screens should use `md` (24px) or `lg` (40px) to allow the "Ultra-Dark" background to provide breathing room.
- Elements are grouped logically using tonal containers rather than relying solely on whitespace.

## Elevation & Depth

In an ultra-dark environment, traditional shadows are ineffective. This design system uses **Tonal Layering** and **Subtle Outlines** to communicate depth:

- **Level 0 (Floor):** `#080808` - The base application canvas.
- **Level 1 (Sectioning):** `#111111` - Sub-navigation or sidebar areas.
- **Level 2 (Containers):** `#181818` - Cards and primary interaction zones, defined by a `#2C2C2E` border.
- **Level 3 (Interaction):** `#202020` - Hover states and active selections.

Depth is further emphasized by **Lucide Thin Line Icons**, which should maintain a 1px or 1.5px stroke width to feel like technical drawings etched into the glass interface.

## Shapes

The shape language combines oversized corner radii with sharp, precise internal data points. 

- **Outer Containers:** Cards and major UI sections use a `20px` radius, providing a modern, premium feel that softens the "cold" nature of the dark theme.
- **Interactive Elements:** Buttons use a `12px` radius to maintain a distinct, touch-friendly silhouette.
- **Status Badges:** These should remain pill-shaped or have a smaller `4px` radius to distinguish them from structural components.

## Components

### Buttons
- **Primary:** Background `#F5F5F5`, text `#080808`, `12px` radius. Bold Syne typography.
- **Tactical/Ghost:** Border `#2C2C2E`, text `#F5F5F5`, Space Mono label. 
- **Emergency:** Background is the specific Crisis Color (e.g., Fire #FF3B30), text white, with a constant pulse glow.

### Cards
- **Base:** Background `#181818`, border `#2C2C2E`, `20px` radius.
- **Active Incident Card:** Features a 4px left-border accent using the relevant Crisis Type color.

### Chips & Badges
- **Tactical Badges:** Space Mono font, `#111111` background, colored border matching the status/type, high letter spacing.

### Inputs
- Background `#111111`, border `#2C2C2E`, `8px` radius. Focus state uses a `1px` solid primary white border with no glow.

### Specialized Components
- **Incident Pulse:** A circular indicator for the map view that radiates outward using the status color to show active emergencies.
- **Telemetry Readout:** A small, monospaced data block showing time-elapsed since incident start.