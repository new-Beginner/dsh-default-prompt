# Extractable Components

## Layout components

No reusable cross-page layout component exists in this plugin. The host DSH settings shell owns navigation and page framing; this plugin only provides one `settings.section` view.

## Icon

- Source: `client.js`
- Category: basic
- Description: Inline SVG icon renderer used throughout the settings view.
- Extractable props: `name` (string), `size` (number)
- Hardcoded: SVG path dictionary, stroke styling
- Decision: do not extract to Superdesign; it is a small primitive and the design workflow should keep it inline.

## PromptSettingsView

- Source: `client.js`
- Category: page
- Description: Complete settings screen for configuring system prompt injection and editing prompt sources.
- Extractable props: none; data is loaded from `/api/dsh-default-prompt`.
- Hardcoded: information architecture, field labels, tabs, icons, styling, API interactions
- Decision: do not extract as a reusable component because it is the design target itself and is not shared across pages.
