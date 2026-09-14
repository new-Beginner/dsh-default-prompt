# dsh-default-prompt 1.1.1 质量验证记录

## 交付范围

- **真正的系统级注入**：通过 `systemPrompt.section` 直接注册到底层 System Prompt，确保全局行为准则具有最高模型权威度。
- **5 种注入位置支持**：`after-persona`（推荐默认，权重 10）、`before-tools`（950）、`after-tools`（9950）、`end`（10300）及 `custom`。
- **多层级提示词来源**：全局文件（`~/.dsh/DEFAULT_PROMPT.md`）、工作区项目文件（`.dsh/prompt.md`）、行内文本与自动合并模式（Combine）。
- **缓存与热重载**：基于文件状态 `mtime` 的高性能缓存，文件变更实时热重载。
- **Codex 规则兼容**：一键检测并导入本地 `~/.codex/AGENTS.md`。
- **现代化 Web 控制台**：专为 DSH Settings 面板量身打造的配置 UI，支持亮暗主题自适应与实时生效预览。
- **斜杠指令系统**：提供 `/prompt`、`/prompt reload`、`/prompt path`、`/prompt import-codex`。

---

## 实际验证结果

| 验证项 | 测试命令 / 操作 | 结果 | 关键指标 / 说明 |
| :--- | :--- | :--- | :--- |
| **自动化测试套件** | `npm test` | ✅ 全部通过 | 9 个测试用例通过，耗时 ~208ms，0 失败，0 告警 |
| **插件生命周期测试** | `test/plugin.test.js` | ✅ 通过 | 验证 `systemPrompt.section` 与 `settings` 服务注册正确 |
| **位置解析测试** | `test/promptManager.test.js` | ✅ 通过 | 验证 5 种位置到内部权重（order）的双向映射与边界条件 |
| **路径展开测试** | `test/promptManager.test.js` | ✅ 通过 | 验证跨平台 `~` 用户目录安全展开 |
| **文件与缓存测试** | `test/promptManager.test.js` | ✅ 通过 | 验证临时文件读写、空文件跳过、mtime 缓存与失效机制 |
| **多源合并模式测试** | `test/promptManager.test.js` | ✅ 通过 | 验证全局文件、工作区文件与行内文本三合一拼装与隔离 |
| **标题包裹测试** | `test/promptManager.test.js` | ✅ 通过 | 验证可选的 Markdown 二级标题前缀逻辑 |
| **Web API 测试** | `test/web.test.js` | ✅ 通过 | 验证 `/api/dsh-default-prompt` 获取、保存及导入端点 |
| **离线包打包验证** | `npm run pack:plugin` | ✅ 通过 | 干净生成 `dsh-default-prompt-1.1.1.tgz`（17.6 kB，9 个文件） |

---

## 测试用例覆盖详情

```text
✔ Plugin apply registers systemPrompt section and settings (1.68ms)
✔ resolveOrder correctly maps positions (0.98ms)
✔ expandHome expands ~ correctly (0.18ms)
✔ PromptManager inline mode (0.13ms)
✔ PromptManager returns empty when disabled (0.21ms)
✔ PromptManager file mode with temp file and caching (4.01ms)
✔ PromptManager combine mode merges sources (4.38ms)
✔ PromptManager sectionTitle prepends title when present (0.11ms)
✔ Web plugin registers API endpoint and handles requests (30.89ms)

ℹ tests 9
ℹ suites 0
ℹ pass 9
ℹ fail 0
```

---

## 安全与架构边界

1. **零污染与非侵入性**：
   - 插件仅扩展底层 `systemPrompt` 切片，不修改会话持久化数据、不篡改用户历史消息 DOM、不伪造任何工具调用。
2. **轻量与零 Token 浪费**：
   - 当插件配置为禁用（`enabled: false`）或提示词内容为空时，`systemPrompt.section` 钩子返回空内容，完全不占用模型上下文 Token。
3. **缓存性能保障**：
   - 提示词文件读取使用 `fs.statSync` 对比修改时间戳，只有在物理文件被保存修改后才会触发磁盘重新读取，避免多轮高频对话时的 I/O 阻塞。
