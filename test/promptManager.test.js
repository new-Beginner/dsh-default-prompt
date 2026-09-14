import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { PromptManager, expandHome, getDefaultPromptPath } from '../src/promptManager.js';
import { resolveOrder, POSITION_ORDERS, DEFAULT_PROMPT_TEMPLATE } from '../src/config.js';

test('resolveOrder correctly maps positions', () => {
  assert.equal(resolveOrder('after-persona'), 10);
  assert.equal(resolveOrder('before-tools'), 950);
  assert.equal(resolveOrder('after-tools'), 9950);
  assert.equal(resolveOrder('end'), 10300);
  assert.equal(resolveOrder('custom', 42), 42);
  assert.equal(resolveOrder('custom', 'invalid'), 10);
  assert.equal(resolveOrder('unknown'), 10);
});

test('expandHome expands ~ correctly', () => {
  const home = os.homedir();
  assert.equal(expandHome('~'), home);
  assert.equal(expandHome('~/.dsh/test.md'), path.join(home, '.dsh', 'test.md'));
  assert.equal(expandHome(''), '');
});

test('PromptManager inline mode', () => {
  const config = {
    enabled: true,
    sourceMode: 'inline',
    promptText: 'Hello from inline prompt!'
  };
  const manager = new PromptManager(() => config);
  const result = manager.assemblePrompt();
  assert.equal(result, 'Hello from inline prompt!');
});

test('PromptManager returns empty when disabled', () => {
  const config = {
    enabled: false,
    sourceMode: 'inline',
    promptText: 'Should be ignored'
  };
  const manager = new PromptManager(() => config);
  assert.equal(manager.assemblePrompt(), '');
});

test('PromptManager file mode with temp file and caching', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-prompt-test-'));
  const tmpFile = path.join(tmpDir, 'prompt.md');
  fs.writeFileSync(tmpFile, 'First version of prompt', 'utf8');

  const config = {
    enabled: true,
    sourceMode: 'file',
    filePath: tmpFile
  };
  const manager = new PromptManager(() => config);

  // 第一次读取
  assert.equal(manager.assemblePrompt(), 'First version of prompt');

  // 修改文件内容
  fs.writeFileSync(tmpFile, 'Second version of prompt', 'utf8');
  // 强制更新 mtime 以测试缓存失效
  const now = new Date(Date.now() + 2000);
  fs.utimesSync(tmpFile, now, now);

  // 第二次读取应自动感知新内容
  assert.equal(manager.assemblePrompt(), 'Second version of prompt');

  // 清理临时目录
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('PromptManager combine mode merges sources', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-prompt-test-'));
  const tmpFile = path.join(tmpDir, 'global.md');
  fs.writeFileSync(tmpFile, 'Global Instructions', 'utf8');

  // 创建临时工作区
  const wsDir = path.join(tmpDir, 'workspace');
  fs.mkdirSync(path.join(wsDir, '.dsh'), { recursive: true });
  fs.writeFileSync(path.join(wsDir, '.dsh', 'prompt.md'), 'Workspace Specific Instructions', 'utf8');

  const config = {
    enabled: true,
    sourceMode: 'combine',
    filePath: tmpFile,
    promptText: 'Inline Instructions',
    enableWorkspaceFile: true
  };
  const manager = new PromptManager(() => config);

  const context = {
    agent: {
      session: {
        header: { cwd: wsDir }
      }
    }
  };

  const result = manager.assemblePrompt(context);
  assert.ok(result.includes('Global Instructions'));
  assert.ok(result.includes('Workspace Specific Instructions'));
  assert.ok(result.includes('Inline Instructions'));

  // 清理
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('PromptManager sectionTitle prepends title when present', () => {
  const config = {
    enabled: true,
    sourceMode: 'inline',
    promptText: 'Some rules here',
    sectionTitle: '## System Instructions'
  };
  const manager = new PromptManager(() => config);
  assert.equal(manager.assemblePrompt(), '## System Instructions\n\nSome rules here');
});
