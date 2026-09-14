# Page Dependency Trees

## `settings:default-prompt` (Default Prompt Settings)

Entry: `client.js`

Dependencies:
- `client.js`
  - Host-provided `react` runtime
  - Host-provided `slots` service
  - `src/web.js` through `/api/dsh-default-prompt`
    - `src/promptManager.js`
    - `src/config.js`

Rendered structure:
- Centered settings container (`max-width: 900px`)
  - Header
    - Sparkles icon
    - Title
    - enabled/disabled badge
    - order metadata badge
    - enable/disable action
    - reload action
  - transient success/error toast
  - injection behavior configuration card
    - prompt position select
    - optional custom order input
    - source mode select
    - workspace rules checkbox
    - Codex sync checkbox
  - content editor/preview card
    - file editor tab
    - inline editor tab
    - effective prompt preview tab
    - context-sensitive toolbar and content panel

The actual desktop render branch is `PromptSettingsView` in `client.js`, lines 374–622. All UI, icons, theme CSS, state, and interaction handlers live in the same file.
