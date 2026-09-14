# Default Prompt Plugin — Design System

## Product and UX context

This is a developer-facing settings panel embedded inside the DeepSeek Harness desktop/web settings shell. It configures where a default system prompt is injected, which source files contribute content, and lets users edit or preview the effective prompt. The audience is technically proficient and values clarity, trust, reversibility, compactness, and precise status feedback more than decorative marketing visuals.

## Visual direction: Harness-Native Calm

Use a polished native-settings language: precise hairline borders, structured grouping, calm negative space, and restrained technical metadata. The page must visually inherit the active DeepSeek Harness theme instead of assuming dark or light mode. Retain the host DSH visual identity and semantic theme variables; any static preview fallback should be a neutral light theme so the design is not presented as dark-only. Do not import the green/coral palette, oversized display typography, editorial treatments, or decorative branding from the inspiration reference. No gradients, glassmorphism, decorative illustrations, exaggerated shadows, or invented branding.

## Color tokens

All UI colors must use the existing host semantic CSS variables whenever available:

- Primary text: `var(--dsw-alias-label-primary)`
- Secondary text: `var(--dsw-alias-label-secondary)`
- Tertiary text: `var(--dsw-alias-label-tertiary)`
- Base card/surface: `var(--dsw-alias-surface-l1, rgba(255,255,255,0.03))`
- Elevated input/editor surface: `var(--dsw-alias-surface-l2, rgba(0,0,0,0.20))`
- Hover/selected surface: `var(--dsw-alias-surface-l3, rgba(255,255,255,0.08))`
- Standard border: `var(--dsw-alias-border-l2)`
- Subtle divider: `var(--dsw-alias-border-l3, rgba(255,255,255,0.06))`
- Accent/action/focus: `var(--dsw-alias-interactive-accent, #1677ff)`
- Accent hover: `var(--dsw-alias-interactive-accent-hover, #4096ff)`
- Success: `#22c55e` with translucent surface/border
- Error/destructive: `#ef4444` with translucent surface/border
- Warning only when needed: `#f59e0b` with translucent surface/border

Never introduce pink, purple, neon, warm luxury, or unrelated brand colors.

## Typography

- Interface font: inherit the DSH shell font through `font-family: inherit`; never load or hardcode a new remote/display font.
- Headline: 20–22px, 650–700 weight, readable line-height and natural Chinese character spacing.
- Section title: 14–15px, 600 weight.
- Field label: 13px, 550–600 weight.
- Supporting copy: 12px, 1.5–1.6 line-height for comfortable Chinese reading.
- Use `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace` only for file paths, order values, counts, and editor content.
- Avoid uppercase English eyebrow text and decorative letter spacing. Prefer concise Chinese headings and normal sentence case.

## Layout and spacing

- Calibrate to the supplied 876×890 Harness settings screenshot: the host sidebar occupies about 242px and the plugin section receives only about 540–595px of practical width.
- Plugin content width must therefore cap at approximately 600px (target 560px in the visible host panel), not 900–1040px.
- Main layout is strictly vertical: page header, compact status overview, full-width configuration card, then full-width editor/preview card.
- Never use a side-by-side configuration/editor split; the host settings panel does not provide enough width.
- Every configuration field stacks its label/description above its full-width control. Do not use an internal two-column field grid at this width.
- Editor always receives the full available content width and at least 360px height.
- Header actions, status items, tabs, and editor toolbar must wrap gracefully without clipping at a 540px content width.
- Spacing scale: 4, 8, 12, 16, 20, 24, 32px.
- Card padding: 18–24px. Row minimum height: 48–56px.
- Use dividers to express structure; avoid excessive nested cards.

## Shape and depth

- Primary containers: 10–12px radius.
- Inputs, buttons, segmented controls: 7–9px radius.
- Badges/chips: pill only for status; 999px radius.
- Prefer 1px borders and subtle surface contrast over shadows.
- If elevation is needed, use one restrained ambient shadow only: `0 8px 28px rgba(0,0,0,0.10)`.

## Components

### Status overview

Place plugin enabled state, injection order, active source mode, and effective character count in a clearly scannable overview area. Use a small colored dot plus text for state. Do not bury operational metadata inside the page title.

### Toggle

Use a designed switch for boolean settings instead of browser-default checkboxes. Include visible on/off state, keyboard focus, disabled state, and a stable 36–40px control width.

### Select and numeric input

Use consistent 36–40px control height, clear focus ring, balanced padding, readable option text, and avoid allowing a very long select to dominate the row. Surface the recommended option with supporting copy rather than cramming explanations into option labels.

### Buttons

- Primary: save or enable the core function.
- Secondary: reload/import.
- Destructive/off action: visually restrained neutral button with red text only on hover/focus unless currently critical.
- Minimum hit target: 36px height.
- Preserve icons already defined in `client.js` and keep label/icon gaps consistent.

### Tabs

Use an accessible segmented tab bar or underline tabs with clear active state and keyboard-focus affordance. The active editor tab should visually connect to its content panel. Counts should appear as compact metadata, not within an overly long label.

### Editor and preview

The editor is the visual priority: a professional dark/light adaptive code-workbench surface, monospaced text, comfortable line-height, a compact toolbar, path/status metadata, clear save affordance, and minimum 360px height. Preview uses the same frame and readable wrapping. Empty state must be calm and instructive.

### Toast/status feedback

Use a compact inline or floating alert with icon, accessible contrast, and no layout jump when possible. Success and error must not rely on color alone.

## Motion

- Standard transition: 140–180ms ease-out for color, border, background, and transform.
- Buttons may move at most 1px on active press.
- Toast entrance: 160ms fade/translate by 4px.
- Respect reduced-motion preferences.
- No looping decorative animation.

## Content and hierarchy rules

- Prefer concise Chinese labels with optional technical term beneath or alongside, not long bilingual strings in every control.
- Put explanations under labels; keep select options short.
- Always show what is saved automatically versus what requires an explicit save.
- Keep file paths monospaced and truncate safely with a tooltip/title.
- Preserve every current capability: enable/disable, reload, injection position, custom order, source mode, workspace merge, Codex sync/import, file editing, inline editing, effective preview, character count, and status/error messages.

## Responsive and accessibility

- Desktop first inside DSH settings, but usable down to approximately 720px panel width.
- Two columns collapse to one; toolbars wrap without overlap.
- Visible keyboard focus on every interactive control.
- Use semantic buttons, labels, selects, inputs, and tabs; never make critical actions clickable `div`s.
- Ensure at least WCAG AA contrast using the host theme variables.
- Do not communicate enabled/disabled/file existence only through colored emoji.

## Hard fidelity constraint

Use ONLY the fonts, colors, spacing, and component styles defined above and inherited from the DSH theme. Do not introduce any fonts, colors, gradients, decorative art, or visual styles outside this system.
