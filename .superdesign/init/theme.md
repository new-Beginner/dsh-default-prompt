# Theme Tokens

## Compact token summary

- Font: inherit the host DSH interface font; technical values and editor content alone use the system monospace stack.
- Primary text: var(--dsw-alias-label-primary)
- Secondary text: var(--dsw-alias-label-secondary)
- Tertiary text: var(--dsw-alias-label-tertiary)
- Surface L1: var(--dsw-alias-surface-l1, #ffffff)
- Surface L2: var(--dsw-alias-surface-l2, #f6f7f9)
- Surface L3: var(--dsw-alias-surface-l3, rgba(0,0,0,0.08))
- Border L2: var(--dsw-alias-border-l2)
- Border L3: var(--dsw-alias-border-l3, rgba(0,0,0,0.08))
- Accent: var(--dsw-alias-interactive-accent, #1677ff)
- Accent hover: var(--dsw-alias-interactive-accent-hover, #4096ff)
- Success: #22c55e on translucent green surfaces.
- Error: #ef4444 on translucent red surfaces.
- Type scale: 10–12px metadata, 12–13px controls, 14px section title, 20px page title.
- Radius: 8px controls, 9px editor/title mark, 10px status overview, 11px cards.
- Layout: 600px maximum plugin width, centered; header and configuration/editor cards stack vertically.
- Status overview: 2×2 at normal settings width and 1 column below 520px.
- Configuration fields: label/description above full-width control.
- Motion: 160ms transitions; no forced dark mode or decorative animation.

## Raw embedded CSS source

The project has no standalone CSS or Tailwind file. All theme styles are injected by ensureStyles() in client.js; the complete function and CSS template are reproduced below.

```js
    let stylesInjected = false;
    function ensureStyles() {
      if (stylesInjected) return;
      stylesInjected = true;
      const css = `
        .dsh-dp-container {
          padding: 20px;
          max-width: 900px;
          margin: 0 auto;
          font-family: inherit;
          color: var(--dsw-alias-label-primary);
        }
        .dsh-dp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--dsw-alias-border-l2);
        }
        .dsh-dp-title {
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dsh-dp-card {
          background: var(--dsw-alias-surface-l1, #ffffff);
          border: 1px solid var(--dsw-alias-border-l2);
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 18px;
        }
        .dsh-dp-card-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--dsw-alias-label-primary);
        }
        .dsh-dp-field {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 0.5px solid var(--dsw-alias-border-l3, rgba(255, 255, 255, 0.06));
        }
        .dsh-dp-field:last-child {
          border-bottom: none;
        }
        .dsh-dp-field-info {
          flex: 1;
          margin-right: 20px;
        }
        .dsh-dp-field-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--dsw-alias-label-primary);
        }
        .dsh-dp-field-desc {
          font-size: 12px;
          color: var(--dsw-alias-label-secondary);
          margin-top: 2px;
        }
        .dsh-dp-select, .dsh-dp-input {
          background: var(--dsw-alias-surface-l2, rgba(0,0,0,0.2));
          border: 1px solid var(--dsw-alias-border-l3);
          border-radius: 6px;
          padding: 6px 10px;
          color: var(--dsw-alias-label-primary);
          font-size: 13px;
          outline: none;
        }
        .dsh-dp-select:focus, .dsh-dp-input:focus {
          border-color: var(--dsw-alias-interactive-accent, #1677ff);
        }
        .dsh-dp-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid var(--dsw-alias-border-l3);
          background: var(--dsw-alias-surface-l2, rgba(255,255,255,0.06));
          color: var(--dsw-alias-label-primary);
          transition: all 0.15s ease;
        }
        .dsh-dp-btn:hover:not(:disabled) {
          background: var(--dsw-alias-surface-l3, rgba(255,255,255,0.12));
          border-color: var(--dsw-alias-border-l2);
        }
        .dsh-dp-btn-primary {
          background: var(--dsw-alias-interactive-accent, #1677ff);
          border-color: var(--dsw-alias-interactive-accent, #1677ff);
          color: #fff;
        }
        .dsh-dp-btn-primary:hover:not(:disabled) {
          background: var(--dsw-alias-interactive-accent-hover, #4096ff);
        }
        .dsh-dp-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }
        .dsh-dp-badge-green {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .dsh-dp-badge-red {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .dsh-dp-textarea {
          width: 100%;
          min-height: 240px;
          background: var(--dsw-alias-surface-l2, #f6f7f9);
          border: 1px solid var(--dsw-alias-border-l3);
          border-radius: 6px;
          padding: 12px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
          font-size: 12px;
          line-height: 1.5;
          color: var(--dsw-alias-label-primary);
          resize: vertical;
          box-sizing: border-box;
          outline: none;
        }
        .dsh-dp-textarea:focus {
          border-color: var(--dsw-alias-interactive-accent, #1677ff);
        }
        .dsh-dp-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
          border-bottom: 1px solid var(--dsw-alias-border-l3);
          padding-bottom: 8px;
        }
        .dsh-dp-tab-item {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          color: var(--dsw-alias-label-secondary);
          transition: all 0.15s ease;
        }
        .dsh-dp-tab-item:hover {
          color: var(--dsw-alias-label-primary);
          background: var(--dsw-alias-surface-l2);
        }
        .dsh-dp-tab-item.active {
          color: var(--dsw-alias-label-primary);
          font-weight: 600;
          background: var(--dsw-alias-surface-l3, rgba(255,255,255,0.08));
        }
        .dsh-dp-toast {
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dsh-dp-toast-success {
          background: rgba(34, 197, 94, 0.12);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }
        .dsh-dp-toast-error {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        /* Harness-native narrow settings layout (calibrated to ~560px content width). */
        .dsh-dp-container {
          width: 100%;
          max-width: 600px;
          padding: 24px 18px 36px;
          box-sizing: border-box;
        }
        .dsh-dp-header {
          align-items: stretch;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 16px;
          padding-bottom: 0;
          border-bottom: none;
        }
        .dsh-dp-header-main {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          min-width: 0;
        }
        .dsh-dp-title-icon {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          color: var(--dsw-alias-interactive-accent, #1677ff);
          background: color-mix(in srgb, var(--dsw-alias-interactive-accent, #1677ff) 9%, transparent);
          border: 1px solid color-mix(in srgb, var(--dsw-alias-interactive-accent, #1677ff) 18%, transparent);
          border-radius: 9px;
        }
        .dsh-dp-title {
          display: block;
          font-size: 20px;
          font-weight: 650;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }
        .dsh-dp-subtitle {
          margin-top: 5px;
          color: var(--dsw-alias-label-secondary);
          font-size: 12px;
          line-height: 1.6;
        }
        .dsh-dp-header-actions {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 8px;
        }
        .dsh-dp-status-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-bottom: 16px;
          overflow: hidden;
          background: var(--dsw-alias-surface-l1, #fff);
          border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
          border-radius: 10px;
        }
        .dsh-dp-status-item {
          min-width: 0;
          padding: 12px 14px;
          border-right: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
        }
        .dsh-dp-status-item:nth-child(even) { border-right: none; }
        .dsh-dp-status-item:nth-child(-n + 2) {
          border-bottom: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
        }
        .dsh-dp-status-label {
          display: block;
          margin-bottom: 5px;
          color: var(--dsw-alias-label-secondary);
          font-size: 11px;
          line-height: 1.35;
        }
        .dsh-dp-status-value {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          color: var(--dsw-alias-label-primary);
          font-size: 12px;
          font-weight: 600;
        }
        .dsh-dp-status-value code {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font: 500 11px/1.35 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        }
        .dsh-dp-status-dot {
          width: 7px;
          height: 7px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
        }
        .dsh-dp-status-dot.off {
          background: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
        }
        .dsh-dp-card {
          padding: 18px 20px;
          margin-bottom: 16px;
          border-color: var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
          border-radius: 11px;
        }
        .dsh-dp-card-title {
          margin-bottom: 4px;
          font-size: 14px;
          font-weight: 650;
        }
        .dsh-dp-card-desc {
          margin-bottom: 8px;
          color: var(--dsw-alias-label-secondary);
          font-size: 12px;
          line-height: 1.55;
        }
        .dsh-dp-field {
          align-items: stretch;
          flex-direction: column;
          gap: 10px;
          padding: 16px 0;
        }
        .dsh-dp-field-info {
          margin-right: 0;
        }
        .dsh-dp-field-label {
          font-weight: 600;
        }
        .dsh-dp-field-desc {
          margin-top: 4px;
          line-height: 1.55;
        }
        .dsh-dp-select,
        .dsh-dp-input {
          width: 100%;
          min-height: 38px;
          padding: 7px 11px;
          border-color: var(--dsw-alias-border-l2);
          border-radius: 8px;
          box-sizing: border-box;
          font-family: inherit;
        }
        .dsh-dp-source-mode {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 3px;
          padding: 3px;
          background: var(--dsw-alias-surface-l2, rgba(0, 0, 0, 0.04));
          border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
          border-radius: 9px;
        }
        .dsh-dp-source-mode-item {
          min-width: 0;
          min-height: 32px;
          padding: 5px 8px;
          overflow: hidden;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: var(--dsw-alias-label-secondary);
          font-family: inherit;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        .dsh-dp-source-mode-item.active {
          background: var(--dsw-alias-surface-l1, #fff);
          color: var(--dsw-alias-label-primary);
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        .dsh-dp-source-mode-item:focus-visible {
          outline: 2px solid var(--dsw-alias-interactive-accent, #1677ff);
          outline-offset: 1px;
        }
        .dsh-dp-switch-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dsh-dp-switch-state {
          color: var(--dsw-alias-label-secondary);
          font-size: 11px;
        }
        .dsh-dp-switch {
          position: relative;
          width: 38px;
          height: 22px;
          min-height: 22px;
          margin: 0;
          appearance: none;
          border: 1px solid var(--dsw-alias-border-l2);
          border-radius: 999px;
          background: var(--dsw-alias-surface-l3, rgba(0, 0, 0, 0.08));
          cursor: pointer;
          transition: background-color 0.16s ease, border-color 0.16s ease;
        }
        .dsh-dp-switch::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.24);
          transition: transform 0.16s ease;
        }
        .dsh-dp-switch:checked {
          border-color: var(--dsw-alias-interactive-accent, #1677ff);
          background: var(--dsw-alias-interactive-accent, #1677ff);
        }
        .dsh-dp-switch:checked::after { transform: translateX(16px); }
        .dsh-dp-switch:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-interactive-accent, #1677ff) 18%, transparent);
        }
        .dsh-dp-tabs {
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
          padding-bottom: 10px;
        }
        .dsh-dp-tab-item {
          min-height: 34px;
          border: none;
          background: transparent;
          font-family: inherit;
        }
        .dsh-dp-editor-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px 14px;
          margin-bottom: 10px;
        }
        .dsh-dp-path {
          min-width: 0;
          color: var(--dsw-alias-label-secondary);
          font: 11px/1.45 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dsh-dp-file-state {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          color: #16a34a;
          font-family: inherit;
          font-size: 10px;
          font-weight: 600;
        }
        .dsh-dp-toolbar-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-left: auto;
        }
        .dsh-dp-textarea {
          min-height: 360px;
          padding: 14px;
          border-color: var(--dsw-alias-border-l2);
          border-radius: 9px;
          font-size: 12px;
          line-height: 1.7;
        }
        .dsh-dp-btn {
          min-height: 36px;
          padding: 7px 13px;
          border-radius: 8px;
          font-family: inherit;
        }
        @media (max-width: 520px) {
          .dsh-dp-container { padding-inline: 12px; }
          .dsh-dp-status-grid { grid-template-columns: 1fr; }
          .dsh-dp-status-item { border-right: none; border-bottom: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08)); }
          .dsh-dp-status-item:last-child { border-bottom: none; }
          .dsh-dp-header-actions,
          .dsh-dp-toolbar-actions { justify-content: flex-start; margin-left: 0; }
        }
      `;
```
