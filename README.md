# dsh-default-prompt

> **DeepSeek Harness 基础默认系统提示词插件**  
> 像 OpenAI Codex 一样，将核心行为规范与基础指令直接、紧接注入在系统提示词（System Prompt）之后，赋予模型最高系统级权威度。

---

## 🌟 为什么需要这个插件？

在 DeepSeek Harness 默认机制下，`AGENTS.md` 是通过 `dsh-agent-instructions` 包装在带有 `<system-reminder>` 的 **用户消息（User Role Message）** 中注入对话历史的，并且附带了：
> *"They do not override system, developer, or direct user instructions."*

这会导致大语言模型（尤其是遵循系统提示词能力较强、或对话轮次变多后的模型）**降低对用户全局指令的服从优先级**甚至忽略。

而 **OpenAI Codex** 的做法是：将用户的全局/开发者规则（如 `~/.codex/AGENTS.md`、developer instructions）**直接编入最顶层的 System Prompt** 中，紧跟在 Assistant 角色定义之后。

本插件 `dsh-default-prompt` 为 DeepSeek Harness 带来了与 Codex 完全一致的机制与体验：
- **真正的系统级提示词**：通过 `systemPrompt.section` 直接成为模型底层 System Prompt 的一部分。
- **紧随角色定义 (order: 10)**：默认紧接在 `You are a coding agent powered by ...` 之后，比任何工具说明、环境说明更靠前，指令优先级最高。
- **零 Token 浪费**：在禁用或内容为空时自动剔除，不占用任何系统提示词 Token。

---

## ✨ 核心特性

1. **五种灵活的注入位置**：
   - 🎯 **紧跟角色身份（after-persona，权重 10，默认推荐）**：像 Codex 一样，位于系统开场白之后、所有工具说明之前。
   - 🛠️ **工具说明前（before-tools，权重 950）**。
   - 📦 **工具说明后（after-tools，权重 9950）**：位于所有工具描述之后，环境上下文之前。
   - 🔚 **系统提示词末尾（end，权重 10300）**：在整个系统提示词最后。
   - ⚙️ **自定义权重（custom）**：自由指定任意数字 order。

2. **多样化的提示词来源**：
   - **全局文件模式（推荐）**：默认读取 `~/.dsh/DEFAULT_PROMPT.md`，文件保存后即刻自动热重载。
   - **工作区项目覆盖/合并**：自动发现当前打开的项目根目录下 `.dsh/prompt.md` 或 `PROMPT.md`，实现跨项目灵活定制。
   - **行内文本模式**：直接在 Web 设置界面中编写并持久化。
   - **组合模式 (Combine)**：全局文件 + 项目工作区文件 + 行内文本自动合并。

3. **一键同步 Codex 规则**：
   - 自动检测本地 `~/.codex/AGENTS.md`。
   - 提供一键导入按钮与指令，老用户无需重复编写提示词。

4. **现代化 Web 控制台**：
   - 在 DSH 设置菜单中提供专属的 **「提示词设置」** 设置面板。
   - 支持在线查看、实时编辑保存、重置为官方推荐模板。
   - **实时生效预览**：直观展示最终拼装并注入 LLM System Prompt 的真实内容与字数统计。

5. **斜杠指令支持 (/prompt)**：
   - `/prompt` 或 `/prompt status`：查看当前提示词激活状态与内容预览。
   - `/prompt reload`：手动刷新磁盘文件缓存。
   - `/prompt path`：查看提示词文件物理路径与存在状态。
   - `/prompt import-codex`：一键导入本地 Codex 规则。

---

## 🚀 快速开始与安装

### 方式一：打包为 .tgz 本地安装（推荐）

1. **打包插件**：
   在插件项目根目录下运行打包命令：
   ```bash
   npm pack
   ```
   会生成类似 `dsh-default-prompt-1.1.1.tgz` 的压缩包。

2. **在 DSH 桌面配置文件中注册**：
   打开你的 DSH 桌面配置：`~/.dsh/profiles/desktop/package.json`
   
   在 `dependencies` 中添加：
   ```json
   {
     "dependencies": {
       "dsh-default-prompt": "file:D:/32057/Files_of_Desktop/Academic/AI/deepseekharness-plugin/inject-plugin/dsh-default-prompt-1.1.1.tgz"
     },
     "dsh": {
       "profile": {
         "bundles": [
           "@deepseek-ai/dsh-base",
           "@deepseek-ai/dsh-web-app",
           "dsh-default-prompt"
         ]
       }
     }
   }
   ```

3. **重启 DeepSeek Harness**：
   重启后，插件即会自动生效，并会在 `~/.dsh/DEFAULT_PROMPT.md` 初始化一份高品质默认提示词模板。

---

## ⚙️ 配置说明 (settings.yaml)

插件的设置会自动保存到 `~/.dsh/settings.yaml` 中的 `dsh-default-prompt` 命名空间下：

```yaml
dsh-default-prompt:
  enabled: true                          # 是否启用注入 (true / false)
  position: 'after-persona'              # 注入位置: after-persona | before-tools | after-tools | end | custom
  customOrder: 10                        # 自定义权重 (仅 position 为 custom 时有效)
  sourceMode: 'file'                     # 来源模式: file | inline | combine
  filePath: ''                           # 自定义文件路径 (留空默认 ~/.dsh/DEFAULT_PROMPT.md)
  promptText: ''                         # 行内提示词文本
  enableWorkspaceFile: true              # 是否合并项目工作区中的 .dsh/prompt.md
  syncCodex: false                       # 当默认文件不存在时，是否自动回退读取 ~/.codex/AGENTS.md
  sectionTitle: ''                       # 可选的 Markdown 标题包裹
```

---

## 📝 默认模板参考

默认初始化的 `~/.dsh/DEFAULT_PROMPT.md` 内容示例如下：

```markdown
# 基础指令 (Default Instructions)

- 请使用中文进行交流和解答。
- 遇到需求不明确或存在多种实现路径时，主动提供合理选项供用户选择，并在用户确认后再执行关键变更。
- 优先检索并复用本地现有的可用技能（Skills）与项目规范。
- 编写代码时遵循工程最佳实践，遵循最小变更原则，避免过度修改无关逻辑。
```

你可以随时在 DSH 界面中的 **设置 -> 默认提示词** 或直接用文本编辑器编辑该文件，任何修改都会在下一次模型请求时立即生效！

---

## 🛠️ 项目目录结构

```text
dsh-default-prompt/
├── package.json          # 模块定义、ESM 配置与 DSH bundle 声明
├── cordis.patch.yml      # Cordis 宿主层与 Web 层自动挂载补丁
├── index.js              # 宿主核心：注册 systemPrompt.section、设置与 /prompt 指令
├── client.js             # 前端界面：DSH Settings 可视化配置与实时预览卡片
├── src/
│   ├── config.js         # Schemastery Schema、位置权重与默认模板
│   ├── promptManager.js  # 提示词读取、多来源组合、mtime 缓存与 Codex 导入
│   └── web.js            # 后端 HTTP API (/api/dsh-default-prompt) 路由
├── test/
│   ├── promptManager.test.js # 提示词管理器单元测试
│   ├── plugin.test.js        # 插件生命周期与注入测试
│   ├── web.test.js           # Web API 接口测试
│   └── run.js                # 统一轻量测试执行入口
└── README.md
```

## 📄 License

MIT License © 2026 DeepSeek Harness Community
