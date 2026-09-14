import test from 'node:test';
import assert from 'node:assert/strict';
import { apply } from '../index.js';

test('Plugin apply registers systemPrompt section and settings', () => {
  let registeredSection = null;
  let sectionDisposed = false;
  let registeredSettings = null;
  let registeredCommand = null;
  let emittedEvents = [];
  let providedServices = {};

  const mockCtx = {
    logger: {
      warn: () => {},
      info: () => {}
    },
    systemPrompt: {
      section(sec) {
        registeredSection = sec;
        return () => {
          sectionDisposed = true;
        };
      },
      getSectionOrder: () => 0
    },
    settings: {
      register(ns, schema, opts) {
        registeredSettings = { ns, schema, opts, value: { enabled: true, position: 'after-persona', promptText: 'Plugin test prompt', sourceMode: 'inline' } };
        return {
          get: () => registeredSettings.value,
          watch: (cb) => {
            registeredSettings.watchCb = cb;
            return () => {};
          },
          update: async (patch) => {
            registeredSettings.value = { ...registeredSettings.value, ...patch };
          }
        };
      }
    },
    commands: {
      register(cmd) {
        registeredCommand = cmd;
      }
    },
    effect(fn) {
      return fn();
    },
    provide(name, srv) {
      providedServices[name] = srv;
    },
    inject(deps, fn) {
      fn(mockCtx);
    },
    emit(event, ...args) {
      emittedEvents.push({ event, args });
    },
    on(event, fn) {}
  };

  apply(mockCtx, { enabled: true, position: 'after-persona' });

  // 验证设置注册
  assert.ok(registeredSettings, 'Settings should be registered');
  assert.equal(registeredSettings.ns, 'dsh-default-prompt');

  // 验证 section 注册
  assert.ok(registeredSection, 'Prompt section should be registered');
  assert.equal(registeredSection.name, 'dsh-default-prompt:base');
  assert.equal(registeredSection.order, 10);

  // 验证提示词执行
  const text = registeredSection.text({});
  assert.equal(text, 'Plugin test prompt');

  // 验证指令注册
  assert.ok(registeredCommand, 'Command should be registered');
  assert.equal(registeredCommand.name, 'prompt');

  // 验证对外暴露的服务
  assert.ok(providedServices['defaultPromptService']);

  // 测试 watch 触发位置切换
  registeredSettings.watchCb({ position: 'before-tools' }, { position: 'after-persona' });
  assert.equal(sectionDisposed, true, 'Old section should be disposed when order changes');
  assert.equal(registeredSection.order, 950, 'New order should be 950');
});
