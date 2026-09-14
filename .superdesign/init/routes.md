# Routes and UI Registration

## Settings section: `default-prompt`

- Surface: DeepSeek Harness Web GUI settings
- Slot: `settings.section`
- Section id: `default-prompt`
- Label: `提示词设置`
- Order: `14`
- Component: `PromptSettingsView`
- Source: `client.js`
- API: `/api/dsh-default-prompt` (`GET`, `POST`) implemented in `src/web.js`

The project does not own a standalone router. Its rendered target is mounted into the host application's settings navigation through the DSH slots service.

```js
return {
  inject: ['slots'],
  apply(ctx) {
    ctx.slots.inject('settings.section', () => ctx.slots.register({
      name: 'settings.section',
      id: 'default-prompt',
      order: 14,
      label: () => '提示词设置'
    }, PromptSettingsView));
  }
};
```
