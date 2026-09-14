import { SettingsSchema, resolveOrder } from './src/config.js';
import { PromptManager, getDefaultPromptPath, getCodexAgentsPath } from './src/promptManager.js';

export { SettingsSchema } from './src/config.js';
export { PromptManager } from './src/promptManager.js';

export const name = 'dsh-default-prompt';
export const inject = ['systemPrompt', 'settings'];

export function apply(ctx, config = {}) {
  // 1. 注册设置项
  let settingsScope;
  try {
    settingsScope = ctx.settings.register('dsh-default-prompt', SettingsSchema, {
      base: config
    });
  } catch (err) {
    ctx.logger.warn?.(`[dsh-default-prompt] 注册设置项失败: ${err.message}`);
  }

  const getConfig = () => (settingsScope ? settingsScope.get() : config);

  // 2. 初始化提示词管理器
  const promptManager = new PromptManager(getConfig, ctx.logger);

  // 初始启动时确保默认提示词文件存在
  try {
    const cfg = getConfig();
    promptManager.ensureDefaultPromptFile(cfg.filePath, cfg.syncCodex);
  } catch {}

  // 3. 动态注册系统提示词段落
  let currentOrder = resolveOrder(getConfig().position, getConfig().customOrder);
  let sectionDisposer = null;

  function mountSection(order) {
    if (typeof sectionDisposer === 'function') {
      sectionDisposer();
      sectionDisposer = null;
    }

    sectionDisposer = ctx.systemPrompt.section({
      name: 'dsh-default-prompt:base',
      order,
      text(context) {
        return promptManager.assemblePrompt(context);
      }
    });
    currentOrder = order;
  }

  mountSection(currentOrder);

  // 4. 监听设置变更，实时同步提示词位置与内容
  if (settingsScope?.watch) {
    ctx.effect(() => settingsScope.watch((next, prev) => {
      promptManager.invalidateCache();
      const nextOrder = resolveOrder(next.position, next.customOrder);
      if (nextOrder !== currentOrder) {
        mountSection(nextOrder);
      }
      ctx.emit('system-prompt/change');
    }), 'dsh-default-prompt:settings-watch');
  }

  // 5. 暴露对外服务供 Web 模块与其它插件调用
  const service = {
    promptManager,
    settingsScope,
    getConfig,
    reload() {
      promptManager.invalidateCache();
      ctx.emit('system-prompt/change');
    }
  };
  ctx.provide('defaultPromptService', service);

  // 6. 可选注册 /prompt 指令
  ctx.inject(['commands'], (cmdCtx) => {
    cmdCtx.commands.register({
      name: 'prompt',
      description: '查看或管理基础默认系统提示词 (像 Codex 一样注入)',
      input: { hint: 'status | reload | path | import-codex | help' },
      recordInput: false,
      async handler({ rawInput }) {
        const [subcmd = 'status'] = rawInput.trim().split(/\s+/).filter(Boolean);

        if (subcmd === 'reload') {
          service.reload();
          return {
            kind: 'success',
            text: '✅ 基础默认提示词缓存已刷新，下一次请求将重新读取文件与配置。'
          };
        }

        if (subcmd === 'path') {
          const status = promptManager.getStatus();
          return {
            kind: 'success',
            text: [
              `📄 **默认提示词文件路径**: \`${status.resolvedFilePath}\``,
              `状态: ${status.fileExists ? '🟢 存在' : '🔴 不存在'}`,
              `Codex 规则文件: \`${status.codexPath}\` (${status.codexExists ? '已检测到' : '未检测到'})`
            ].join('\n')
          };
        }

        if (subcmd === 'import-codex') {
          try {
            const res = promptManager.importFromCodex();
            ctx.emit('system-prompt/change');
            return {
              kind: 'success',
              text: `✅ 已成功从 \`${res.source}\` 导入规则到 \`${res.target}\`！`
            };
          } catch (err) {
            return {
              kind: 'failure',
              text: `❌ 导入失败: ${err.message}`
            };
          }
        }

        if (subcmd === 'help') {
          return {
            kind: 'success',
            text: [
              '### 基础默认系统提示词 (/prompt) 指令帮助',
              '- `/prompt` 或 `/prompt status`：查看当前提示词状态与注入预览',
              '- `/prompt reload`：重新读取提示词文件并刷新缓存',
              '- `/prompt path`：查看提示词文件路径与存在状态',
              '- `/prompt import-codex`：一键从 ~/.codex/AGENTS.md 导入规则',
              '- `/prompt help`：显示此帮助信息'
            ].join('\n')
          };
        }

        // 默认显示 status
        const status = promptManager.getStatus();
        const lines = [
          '### 🧠 基础默认系统提示词状态 (dsh-default-prompt)',
          `- **启用状态**: ${status.enabled ? '🟢 已启用' : '🔴 已禁用'}`,
          `- **注入位置**: \`${status.position}\` (权重 Order: ${status.order})`,
          `- **来源模式**: \`${status.sourceMode}\``,
          `- **文件路径**: \`${status.resolvedFilePath}\` (${status.fileExists ? '存在' : '缺失'})`,
          status.workspaceFile ? `- **工作区专用文件**: \`${status.workspaceFile}\`` : '',
          `- **当前字数**: ${status.charCount} 字符 (${status.lineCount} 行)`,
          '',
          '**当前生效的注入内容预览:**',
          status.activePrompt ? '```markdown\n' + status.activePrompt + '\n```' : '*(当前内容为空)*'
        ].filter(Boolean);

        return {
          kind: 'success',
          text: lines.join('\n')
        };
      }
    });
  });

  // 7. 卸载清理
  ctx.on('dispose', () => {
    if (typeof sectionDisposer === 'function') {
      sectionDisposer();
      sectionDisposer = null;
    }
  });
}
