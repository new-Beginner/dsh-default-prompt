# Shared UI Components

## Framework

- Client runtime: Cordis browser plugin loaded through `window.__ModuleLoader__`
- UI library: React via runtime `require('react')`
- Rendering style: `React.createElement` (no JSX build step)
- Styling: runtime-injected vanilla CSS using DSH semantic CSS variables

## `Icon`

- Path: `client.js`
- Purpose: Shared inline SVG icon primitive used across the settings panel.
- Props: `name`, `size`, `style`

```js
const ICONS = {
  sparkles: 'M12 3l1.9 4.8L18.7 9.7l-4.8 1.9L12 16.4l-1.9-4.8L5.3 9.7l4.8-1.9L12 3zm7 13l.9 2.3L22.2 19l-2.3.9L19 22.2l-.9-2.3L15.8 19l2.3-.9L19 16zM4.5 16l.6 1.6L6.7 18l-1.6.6L4.5 20.2l-.6-1.6L2.3 18l1.6-.6L4.5 16z',
  check: 'M20 6L9 17l-5-5',
  refresh: 'M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67',
  save: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8',
  file: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM13 2v7h7',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5 5 5-5m-5 5V3',
  sliders: 'M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11 5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
  alert: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'
};

function Icon({ name, size = 16, style = {} }) {
  const d = ICONS[name] || ICONS.sparkles;
  return h('svg', {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    style: { display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }
  }, h('path', { d }));
}
```

## Inline controls

The settings page currently implements buttons, badges, text fields, selects, tabs, toasts, and the editor as CSS classes inside `client.js`. They are page-local rather than separate shared React components, so their complete source is captured in `layouts.md` and `theme.md` rather than duplicated here.
