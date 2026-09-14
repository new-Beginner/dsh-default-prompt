import fs from 'node:fs';
import path from 'node:path';
import { expandHome, getDefaultPromptPath, getCodexAgentsPath } from './promptManager.js';
import { DEFAULT_PROMPT_TEMPLATE } from './config.js';

export const name = 'dsh-default-prompt-web';
export const inject = ['connection', 'defaultPromptService'];

export function apply(ctx) {
  const service = ctx.defaultPromptService;
  const reply = (value, status = 200) => new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });

  async function buildPayload() {
    const status = service.promptManager.getStatus();
    const config = service.settingsScope ? service.settingsScope.get() : {};

    let fileContent = '';
    if (fs.existsSync(status.resolvedFilePath)) {
      try {
        fileContent = fs.readFileSync(status.resolvedFilePath, 'utf8');
      } catch {}
    }

    let codexContent = '';
    if (fs.existsSync(status.codexPath)) {
      try {
        codexContent = fs.readFileSync(status.codexPath, 'utf8');
      } catch {}
    }

    return {
      status,
      config,
      fileContent,
      codexContent,
      defaultTemplate: DEFAULT_PROMPT_TEMPLATE
    };
  }

  ctx.connection.fetch.register({
    path: '/api/dsh-default-prompt',
    methods: ['GET', 'POST'],
    requestBody: 'buffered',
    async fetch(request) {
      try {
        if (request.method === 'GET') {
          return reply(await buildPayload());
        }

        if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') {
          return reply({ error: '需要 JSON 请求体' }, 415);
        }

        const data = await request.json();
        const { action } = data;

        if (action === 'saveSettings') {
          if (service.settingsScope && data.patch) {
            await service.settingsScope.update(data.patch);
            service.promptManager.invalidateCache();
            ctx.emit('system-prompt/change');
          }
          return reply({ ok: true, ...(await buildPayload()) });
        }

        if (action === 'saveFile') {
          const content = typeof data.content === 'string' ? data.content : '';
          const targetPath = expandHome(data.filePath) || getDefaultPromptPath();
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          fs.writeFileSync(targetPath, content, 'utf8');
          service.promptManager.invalidateCache();
          ctx.emit('system-prompt/change');
          return reply({ ok: true, targetPath, ...(await buildPayload()) });
        }

        if (action === 'importCodex') {
          const result = service.promptManager.importFromCodex();
          ctx.emit('system-prompt/change');
          return reply({ ok: true, imported: result, ...(await buildPayload()) });
        }

        if (action === 'resetFile') {
          const targetPath = getDefaultPromptPath();
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          fs.writeFileSync(targetPath, DEFAULT_PROMPT_TEMPLATE, 'utf8');
          service.promptManager.invalidateCache();
          ctx.emit('system-prompt/change');
          return reply({ ok: true, ...(await buildPayload()) });
        }

        if (action === 'reload') {
          service.promptManager.invalidateCache();
          ctx.emit('system-prompt/change');
          return reply({ ok: true, ...(await buildPayload()) });
        }

        return reply({ error: `未知操作: ${action}` }, 400);
      } catch (err) {
        return reply({ error: err.message || String(err) }, 500);
      }
    }
  });
}
