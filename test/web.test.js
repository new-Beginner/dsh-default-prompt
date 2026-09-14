import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { apply } from '../src/web.js';
import { PromptManager } from '../src/promptManager.js';

test('Web plugin registers API endpoint and handles requests', async () => {
  let registeredRoute = null;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-web-test-'));
  const promptFile = path.join(tmpDir, 'DEFAULT_PROMPT.md');
  fs.writeFileSync(promptFile, '# Initial Web Test Prompt', 'utf8');

  let currentSettings = {
    enabled: true,
    position: 'after-persona',
    filePath: promptFile,
    sourceMode: 'file',
    promptText: ''
  };

  const mockService = {
    promptManager: new PromptManager(() => currentSettings),
    settingsScope: {
      get: () => currentSettings,
      update: async (patch) => {
        currentSettings = { ...currentSettings, ...patch };
      }
    }
  };

  const mockCtx = {
    defaultPromptService: mockService,
    connection: {
      fetch: {
        register(route) {
          registeredRoute = route;
        }
      }
    },
    emit: () => {}
  };

  apply(mockCtx);

  assert.ok(registeredRoute, 'Route should be registered');
  assert.equal(registeredRoute.path, '/api/dsh-default-prompt');

  // 测试 GET 请求
  const getReq = new Request('http://localhost/api/dsh-default-prompt', { method: 'GET' });
  const getRes = await registeredRoute.fetch(getReq);
  assert.equal(getRes.status, 200);
  const getData = await getRes.json();
  assert.equal(getData.config.enabled, true);
  assert.ok(getData.fileContent.includes('Initial Web Test Prompt'));

  // 测试 POST saveSettings
  const postReq = new Request('http://localhost/api/dsh-default-prompt', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'saveSettings', patch: { position: 'end' } })
  });
  const postRes = await registeredRoute.fetch(postReq);
  assert.equal(postRes.status, 200);
  const postData = await postRes.json();
  assert.equal(postData.ok, true);
  assert.equal(postData.config.position, 'end');

  // 测试 POST saveFile
  const saveFileReq = new Request('http://localhost/api/dsh-default-prompt', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'saveFile', filePath: promptFile, content: '# Updated Web Test Prompt' })
  });
  const saveFileRes = await registeredRoute.fetch(saveFileReq);
  assert.equal(saveFileRes.status, 200);
  const saveFileData = await saveFileRes.json();
  assert.equal(saveFileData.ok, true);
  assert.equal(fs.readFileSync(promptFile, 'utf8'), '# Updated Web Test Prompt');

  // 清理
  fs.rmSync(tmpDir, { recursive: true, force: true });
});
