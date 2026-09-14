import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { DEFAULT_PROMPT_TEMPLATE, resolveOrder } from './config.js';

/**
 * 路径展开辅助函数：支持 ~ 展开为用户家目录
 */
export function expandHome(filePath) {
  if (!filePath || typeof filePath !== 'string') return '';
  const trimmed = filePath.trim();
  if (trimmed === '~' || trimmed.startsWith('~/') || trimmed.startsWith('~\\')) {
    return path.join(os.homedir(), trimmed.slice(1));
  }
  return path.resolve(trimmed);
}

/**
 * 查找用户全局默认提示词路径：~/.dsh/DEFAULT_PROMPT.md
 */
export function getDefaultPromptPath() {
  return path.join(os.homedir(), '.dsh', 'DEFAULT_PROMPT.md');
}

/**
 * 获取 Codex 的 AGENTS.md 路径：~/.codex/AGENTS.md
 */
export function getCodexAgentsPath() {
  return path.join(os.homedir(), '.codex', 'AGENTS.md');
}

export class PromptManager {
  constructor(getConfig, logger) {
    this.getConfig = getConfig;
    this.logger = logger || console;
    this.fileCache = new Map(); // path -> { mtime: number, content: string }
  }

  /**
   * 清除文件读取缓存
   */
  invalidateCache() {
    this.fileCache.clear();
  }

  /**
   * 安全读取 UTF-8 文本文件（带 mtime 缓存）
   */
  readFileWithCache(targetPath) {
    if (!targetPath) return '';
    try {
      if (!fs.existsSync(targetPath)) return '';
      const stat = fs.statSync(targetPath);
      if (!stat.isFile()) return '';

      const cached = this.fileCache.get(targetPath);
      if (cached && cached.mtime === stat.mtimeMs) {
        return cached.content;
      }

      const content = fs.readFileSync(targetPath, 'utf8');
      this.fileCache.set(targetPath, { mtime: stat.mtimeMs, content });
      return content;
    } catch (err) {
      this.logger.warn?.(`[dsh-default-prompt] 读取文件失败 ${targetPath}: ${err.message}`);
      return '';
    }
  }

  /**
   * 确保默认提示词文件存在，如果不存在且允许则自动初始化
   */
  ensureDefaultPromptFile(filePath, syncCodex = false) {
    const target = expandHome(filePath) || getDefaultPromptPath();
    try {
      if (fs.existsSync(target)) return target;

      // 如果目标是默认路径，且开启了 syncCodex 或 codex 存在
      if (target === getDefaultPromptPath() && syncCodex) {
        const codexPath = getCodexAgentsPath();
        if (fs.existsSync(codexPath)) {
          const codexContent = fs.readFileSync(codexPath, 'utf8');
          fs.mkdirSync(path.dirname(target), { recursive: true });
          fs.writeFileSync(target, codexContent, 'utf8');
          this.logger.info?.(`[dsh-default-prompt] 已从 ~/.codex/AGENTS.md 自动同步到 ${target}`);
          return target;
        }
      }

      // 如果是默认路径，写入初始模板
      if (target === getDefaultPromptPath()) {
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, DEFAULT_PROMPT_TEMPLATE, 'utf8');
        this.logger.info?.(`[dsh-default-prompt] 已创建初始默认提示词文件: ${target}`);
      }
    } catch (err) {
      this.logger.warn?.(`[dsh-default-prompt] 自动创建提示词文件失败: ${err.message}`);
    }
    return target;
  }

  /**
   * 检查并发现当前工作区内的专用提示词文件
   */
  findWorkspacePrompt(cwd) {
    if (!cwd || typeof cwd !== 'string') return null;
    const candidates = [
      path.join(cwd, '.dsh', 'prompt.md'),
      path.join(cwd, '.dsh', 'PROMPT.md'),
      path.join(cwd, 'PROMPT.md')
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
    return null;
  }

  /**
   * 从 Codex 导入 AGENTS.md 内容
   */
  importFromCodex() {
    const codexPath = getCodexAgentsPath();
    if (!fs.existsSync(codexPath)) {
      throw new Error(`未找到 Codex 规则文件: ${codexPath}`);
    }
    const content = fs.readFileSync(codexPath, 'utf8');
    const defaultPath = getDefaultPromptPath();
    fs.mkdirSync(path.dirname(defaultPath), { recursive: true });
    fs.writeFileSync(defaultPath, content, 'utf8');
    this.invalidateCache();
    return {
      source: codexPath,
      target: defaultPath,
      content
    };
  }

  /**
   * 组装完整的默认提示词内容
   */
  assemblePrompt(context = {}) {
    const config = this.getConfig();
    if (!config.enabled) {
      return '';
    }

    const mode = config.sourceMode || 'file';
    let globalContent = '';
    let workspaceContent = '';
    let inlineContent = (config.promptText || '').trim();

    // 1. 读取全局文件
    if (mode === 'file' || mode === 'combine') {
      const resolvedPath = this.ensureDefaultPromptFile(config.filePath, config.syncCodex);
      globalContent = this.readFileWithCache(resolvedPath).trim();

      // 如果全局文件仍为空，且启用了 syncCodex，尝试直接读取 Codex
      if (!globalContent && config.syncCodex) {
        const codexPath = getCodexAgentsPath();
        globalContent = this.readFileWithCache(codexPath).trim();
      }
    }

    // 2. 读取工作区项目特定提示词 (如果启用)
    if (config.enableWorkspaceFile && (mode === 'file' || mode === 'combine')) {
      const cwd = context.agent?.session?.header?.cwd || process.cwd();
      const wsFile = this.findWorkspacePrompt(cwd);
      if (wsFile) {
        workspaceContent = this.readFileWithCache(wsFile).trim();
      }
    }

    // 3. 根据模式合并内容
    const parts = [];
    if (mode === 'file') {
      if (globalContent) parts.push(globalContent);
      if (workspaceContent) {
        parts.push(`<!-- Workspace Specific Prompt -->\n${workspaceContent}`);
      }
    } else if (mode === 'inline') {
      if (inlineContent) parts.push(inlineContent);
    } else if (mode === 'combine') {
      if (globalContent) parts.push(globalContent);
      if (workspaceContent) {
        parts.push(`<!-- Workspace Specific Prompt -->\n${workspaceContent}`);
      }
      if (inlineContent) parts.push(inlineContent);
    }

    let finalPrompt = parts.filter(Boolean).join('\n\n');
    if (!finalPrompt) return '';

    // 4. 可选标题包裹
    if (config.sectionTitle?.trim()) {
      finalPrompt = `${config.sectionTitle.trim()}\n\n${finalPrompt}`;
    }

    return finalPrompt;
  }

  /**
   * 获取当前状态摘要（用于 UI 与 /prompt 命令诊断）
   */
  getStatus(context = {}) {
    const config = this.getConfig();
    const resolvedPath = expandHome(config.filePath) || getDefaultPromptPath();
    const fileExists = fs.existsSync(resolvedPath);
    const codexPath = getCodexAgentsPath();
    const codexExists = fs.existsSync(codexPath);

    const cwd = context.agent?.session?.header?.cwd || process.cwd();
    const workspaceFile = config.enableWorkspaceFile ? this.findWorkspacePrompt(cwd) : null;
    const prompt = this.assemblePrompt(context);
    const order = resolveOrder(config.position, config.customOrder);

    return {
      enabled: !!config.enabled,
      position: config.position || 'after-persona',
      order,
      sourceMode: config.sourceMode || 'file',
      filePath: config.filePath || '~/.dsh/DEFAULT_PROMPT.md',
      resolvedFilePath: resolvedPath,
      fileExists,
      workspaceFile,
      codexPath,
      codexExists,
      activePrompt: prompt,
      charCount: prompt.length,
      lineCount: prompt ? prompt.split('\n').length : 0
    };
  }
}
