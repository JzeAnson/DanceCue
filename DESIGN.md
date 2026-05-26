---
name: Kinetic Glow
colors:
  surface: '#131316'
  surface-dim: '#131316'
  surface-bright: '#39393c'
  surface-container-lowest: '#0e0e11'
  surface-container-low: '#1b1b1e'
  surface-container: '#1f1f22'
  surface-container-high: '#2a2a2d'
  surface-container-highest: '#353438'
  on-surface: '#e4e1e6'
  on-surface-variant: '#d4c0d7'
  inverse-surface: '#e4e1e6'
  inverse-on-surface: '#303033'
  outline: '#9d8ba0'
  outline-variant: '#504254'
  surface-tint: '#ebb2ff'
  primary: '#ebb2ff'
  on-primary: '#520072'
  primary-container: '#bc13fe'
  on-primary-container: '#ffffff'
  inverse-primary: '#9800d0'
  secondary: '#e6feff'
  on-secondary: '#003739'
  secondary-container: '#00f4fe'
  on-secondary-container: '#006c71'
  tertiary: '#ffb1c3'
  on-tertiary: '#66002c'
  tertiary-container: '#e8006e'
  on-tertiary-container: '#ffffff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f8d8ff'
  primary-fixed-dim: '#ebb2ff'
  on-primary-fixed: '#320047'
  on-primary-fixed-variant: '#74009f'
  secondary-fixed: '#63f7ff'
  secondary-fixed-dim: '#00dce5'
  on-secondary-fixed: '#002021'
  on-secondary-fixed-variant: '#004f53'
  tertiary-fixed: '#ffd9e0'
  tertiary-fixed-dim: '#ffb1c3'
  on-tertiary-fixed: '#3f0019'
  on-tertiary-fixed-variant: '#8f0041'
  background: '#131316'
  on-background: '#e4e1e6'
  surface-variant: '#353438'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  touch-target: 56px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style
The design system is engineered for high-intensity movement and low-light environments. It targets dancers, choreographers, and fitness enthusiasts who require a hands-free interface that remains legible while in motion.

The aesthetic blends **Modernism** with **Glassmorphism**, utilizing deep obsidian backgrounds to reduce glare and vibrant, neon-inflected accents to mimic the energy of a stage performance. The emotional response should be one of "controlled energy"—precise enough for technical rehearsal, but vibrant enough to inspire creative flow. Visual cues must be oversized and high-contrast to account for users viewing the screen from several feet away.

## Colors
This design system utilizes a "Void & Neon" palette optimized for OLED displays and studio lighting.

- **Primary (Electric Purple):** Used for primary actions, active song progress, and "Listening" states.
- **Secondary (Neon Cyan):** Used for success states, secondary navigation, and tempo indicators.
- **Tertiary (Pulse Pink):** Reserved for high-energy highlights and destructive actions.
- **Neutral (Deep Obsidian):** The foundation of the UI. Backgrounds use `#0F0F12`, while elevated cards use a slightly lighter `#1A1A20`.
- **Gradients:** Use a 45-degree linear gradient from Primary to Secondary for high-impact interactive elements like the Voice Activation button.

## Typography
The typography strategy prioritizes "glanceability." 

**Montserrat** is used for all headlines and display text to provide a bold, rhythmic presence. **Inter** handles body text and settings for maximum clarity. **JetBrains Mono** is introduced for technical data—such as BPM, timestamps, and voice command feedback—to provide a precise, digital-tool feel.

Large display sizes are intentionally aggressive to ensure titles are readable from across a dance floor. For mobile, headline scales are reduced, but weight is maintained to keep the visual hierarchy intact.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a heavy emphasis on "Safe Zones" for touch.

- **Rhythm:** All spacing is based on an 8px base unit.
- **Touch Targets:** A minimum 56px height/width is required for all rehearsal-mode controls to account for sweaty or imprecise taps.
- **Margins:** Desktop views use expansive 64px margins to allow the glassmorphic cards to "breathe" against the dark background. Mobile views use 20px margins to maximize horizontal space for progress bars.
- **Breakpoints:** 
  - Mobile: < 600px (Single column, bottom-anchored controls)
  - Tablet: 600px - 1024px (2-column layout, side-car navigation)
  - Desktop: > 1024px (Expanded timeline and multi-view video feedback)

## Elevation & Depth
This design system uses **Glassmorphism** to create a sense of layering without breaking the dark-mode immersion.

- **Base Layer:** Pure neutral black/obsidian.
- **Surface Layer:** 12% opacity white fill with a 20px backdrop blur and a 1px "inner glow" border at 15% opacity. This creates the "frosted glass" effect.
- **Active Layer:** Elements currently in focus (like the active song section) use a Primary color outer glow (shadow) with a 20px spread to simulate a neon light source.
- **Shadows:** Avoid traditional black shadows. Use colored "ambient glows" (Primary or Secondary colors at 20% opacity) to signify elevation.

## Shapes
Shapes are intentionally "Soft-Industrial." 

The standard `0.5rem` (8px) radius provides a modern, friendly feel, while the `rounded-xl` (1.5rem) radius is reserved for large containers and cards. Buttons and chips should use the **Pill-shaped** (3) setting to provide a distinct visual contrast against the rectangular layout of the video/timeline sections.

## Components
- **Voice Activation Button:** A large, circular floating action button (FAB). When "Listening," it should pulse with a Primary-to-Secondary gradient and an outer glow syncopated to a 120BPM rhythm.
- **Progress Bar & Section Markers:** The progress bar is thick (12px height). Sections (Intro, Verse, Chorus) are marked by vertical neon lines. The active section is highlighted with a glassmorphic overlay.
- **Playback Controls:** Oversized icons (minimum 32px icon size) within 64px touch targets. Use high-contrast white on glass backgrounds.
- **Status Chips:** Small, pill-shaped labels using **JetBrains Mono** to indicate "SYNCED," "REC," or "BPM."
- **Input Fields:** Minimalist under-lined fields or fully transparent glass containers. No heavy borders; use the 1px inner-glow border technique.
- **Cards:** Use the frosted glass style with a subtle vertical gradient to suggest depth. Headlines within cards should always be Montserrat Bold.