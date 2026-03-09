# OpenCode 与 oh-my-opencode 在 WSL2 官方安装配置手册

本文面向 Windows 10/11 用户，给出基于官方文档的最小可用安装与配置流程。
文档基线时间：2026-03-09。

---

## 0. 适用范围

- Windows 10 2004+（Build 19041+）或 Windows 11
- 使用 WSL2 运行 OpenCode（官方推荐）
- 在 OpenCode 基础上安装 `oh-my-opencode` 插件

---

## 1. 官方来源

- Microsoft Learn（WSL 安装）：[https://learn.microsoft.com/zh-cn/windows/wsl/install](https://learn.microsoft.com/zh-cn/windows/wsl/install)
- Microsoft Learn（WSL 基础命令）：[https://learn.microsoft.com/en-us/windows/wsl/basic-commands](https://learn.microsoft.com/en-us/windows/wsl/basic-commands)
- OpenCode（Windows + WSL）：[https://opencode.ai/docs/windows-wsl/](https://opencode.ai/docs/windows-wsl/)
- OpenCode（Intro / 安装方式）：[https://dev.opencode.ai/docs/](https://dev.opencode.ai/docs/)
- OpenCode（Config）：[https://dev.opencode.ai/docs/config/](https://dev.opencode.ai/docs/config/)
- OpenCode（Models）：[https://dev.opencode.ai/docs/models/](https://dev.opencode.ai/docs/models/)
- OpenCode（Providers）：[https://dev.opencode.ai/docs/providers/](https://dev.opencode.ai/docs/providers/)
- OpenCode（Ecosystem，含 oh-my-opencode）：[https://dev.opencode.ai/docs/ecosystem/](https://dev.opencode.ai/docs/ecosystem/)
- Oh My OpenCode（Installation）：[https://ohmyopencode.com/installation/](https://ohmyopencode.com/installation/)
- oh-my-opencode（Configuration，GitHub）：[https://github.com/code-yeongyu/oh-my-opencode/blob/dev/docs/reference/configuration.md](https://github.com/code-yeongyu/oh-my-opencode/blob/dev/docs/reference/configuration.md)

---

## 2. 第一步：安装并确认 WSL2（Windows 侧）

在管理员 PowerShell 执行：

```powershell
wsl --install
```

重启后，执行以下检查：

```powershell
wsl --update
wsl --status
wsl --list --verbose
```

验收要点：

- `wsl --status` 可正常返回状态
- `wsl --list --verbose` 中目标发行版为 `VERSION 2`

常用补充命令（官方）：

```powershell
wsl --list --online
wsl --install -d Ubuntu
wsl --set-default-version 2
```

---

## 3. 第二步：在 WSL2 内安装 OpenCode

进入 WSL 终端（如 Ubuntu）执行：

```bash
curl -fsSL https://opencode.ai/install | bash
opencode --version
```

说明：

- OpenCode 官方在 Windows 场景推荐用 WSL 运行，而非直接在 PowerShell 中运行。
- 项目在 Windows 盘时可通过 `/mnt/c/...` 访问。

---

## 4. 第三步：安装 oh-my-opencode

官方推荐方式：

```bash
bunx oh-my-opencode install
```

可选方式：

```bash
npm install -g oh-my-opencode
# 或
bun install -g oh-my-opencode
# 或
yarn global add oh-my-opencode
# 或
pnpm add -g oh-my-opencode
```

版本注意事项（官方安装页）：

- 若 OpenCode 版本为 `1.0.132` 或更早，可能出现配置问题。
- 建议使用 OpenCode `1.0.133+`。

---

## 5. 配置文件位置（OpenCode 与 oh-my-opencode）

OpenCode（官方优先级：项目级覆盖用户级）：

- 用户级：`~/.config/opencode/opencode.json`
- 项目级：`opencode.json`（项目根目录）

oh-my-opencode（项目级覆盖用户级，支持 `.jsonc` 与 `.json`）：

- 项目级：`.opencode/oh-my-opencode.jsonc` 或 `.opencode/oh-my-opencode.json`
- 用户级：`~/.config/opencode/oh-my-opencode.jsonc` 或 `~/.config/opencode/oh-my-opencode.json`

### 5.1 按《模型场景速查表》设置模型与 variants

目标：

- 默认模型：`zhipuai-coding-plan/glm-5`
- 高复杂场景：`gmn/gpt-5.3-codex`
- 推理强度：`gmn/gpt-5.3-codex` 与 `gmn/gpt-5.2-codex` 已配置 `variants`

OpenCode 示例（用户级 `~/.config/opencode/opencode.json`，按当前系统配置脱敏）：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "zhipuai-coding-plan": {
      "options": {
        "apiKey": "<YOUR_ZHIPU_API_KEY>"
      }
    },
    "gmn": {
      "npm": "@ai-sdk/openai",
      "name": "gmn",
      "options": {
        "baseURL": "https://gmncode.cn/v1"
      },
      "models": {
        "gpt-5.3-codex": {
          "name": "GPT-5.3-codex",
          "thinking": true,
          "variants": {
            "low": {
              "reasoningEffort": "low",
              "textVerbosity": "low",
              "reasoningSummary": "auto",
              "store": false,
              "include": ["reasoning.encrypted_content"]
            },
            "medium": {
              "reasoningEffort": "medium",
              "textVerbosity": "medium",
              "reasoningSummary": "auto",
              "store": false,
              "include": ["reasoning.encrypted_content"]
            },
            "high": {
              "reasoningEffort": "high",
              "textVerbosity": "high",
              "reasoningSummary": "auto",
              "store": false,
              "include": ["reasoning.encrypted_content"]
            },
            "xhigh": {
              "reasoningEffort": "xhigh",
              "textVerbosity": "high",
              "reasoningSummary": "auto",
              "store": false,
              "include": ["reasoning.encrypted_content"]
            }
          },
          "modalities": {
            "input": ["text", "image", "pdf"],
            "output": ["text"]
          },
          "limit": {
            "context": 400000,
            "output": 128000
          },
          "options": {
            "store": false,
            "reasoningEffort": "xhigh",
            "textVerbosity": "high",
            "reasoningSummary": "auto",
            "include": ["reasoning.encrypted_content"]
          }
        },
        "gpt-5.2-codex": {
          "name": "GPT-5.2 Codex",
          "variants": {
            "low": {
              "reasoningEffort": "low",
              "textVerbosity": "low",
              "reasoningSummary": "auto",
              "include": ["reasoning.encrypted_content"],
              "store": false
            },
            "medium": {
              "reasoningEffort": "medium",
              "textVerbosity": "medium",
              "reasoningSummary": "auto",
              "include": ["reasoning.encrypted_content"],
              "store": false
            },
            "high": {
              "reasoningEffort": "high",
              "textVerbosity": "high",
              "reasoningSummary": "auto",
              "include": ["reasoning.encrypted_content"],
              "store": false
            },
            "xhigh": {
              "reasoningEffort": "xhigh",
              "textVerbosity": "high",
              "reasoningSummary": "auto",
              "include": ["reasoning.encrypted_content"],
              "store": false
            }
          },
          "options": {
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        }
      }
    }
  },
  "model": "zhipuai-coding-plan/glm-5",
  "small_model": "zhipuai-coding-plan/glm-4.7",
  "mcp": {
    "zai-mcp-server": {
      "type": "local",
      "command": ["npx", "-y", "@z_ai/mcp-server"],
      "environment": {
        "Z_AI_MODE": "ZHIPU",
        "Z_AI_API_KEY": "<YOUR_ZHIPU_API_KEY>"
      }
    },
    "web-search-prime": {
      "type": "remote",
      "url": "https://open.bigmodel.cn/api/mcp/web_search_prime/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_ZHIPU_API_KEY>"
      }
    }
  },
  "plugin": ["oh-my-opencode"]
}
```

oh-my-opencode 示例（用户级 `~/.config/opencode/oh-my-opencode.json`，按当前系统配置）：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/dev/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": { "model": "gmn/gpt-5.3-codex" },
    "hephaestus": { "model": "gmn/gpt-5.3-codex" },
    "oracle": { "model": "gmn/gpt-5.3-codex" },
    "metis": { "model": "gmn/gpt-5.3-codex" },
    "prometheus": { "model": "gmn/gpt-5.3-codex" },
    "librarian": { "model": "zhipuai-coding-plan/glm-5" },
    "explore": { "model": "zhipuai-coding-plan/glm-5" },
    "momus": { "model": "zhipuai-coding-plan/glm-5" },
    "atlas": { "model": "zhipuai-coding-plan/glm-5" },
    "multimodal-looker": { "model": "zhipuai-coding-plan/glm-4.6v" }
  },
  "categories": {
    "quick": { "model": "zhipuai-coding-plan/glm-5" },
    "unspecified-low": { "model": "zhipuai-coding-plan/glm-5" },
    "unspecified-high": { "model": "zhipuai-coding-plan/glm-5" },
    "writing": { "model": "zhipuai-coding-plan/glm-5" },
    "artistry": { "model": "zhipuai-coding-plan/glm-5" },
    "deep": { "model": "gmn/gpt-5.3-codex" },
    "ultrabrain": { "model": "gmn/gpt-5.3-codex" },
    "visual-engineering": { "model": "zhipuai-coding-plan/glm-5" }
  }
}
```

说明：

- 当前系统示例未开启 `compaction.auto`；如需自动压缩，可在 `opencode.json` 中按官方 `compaction` 配置启用。
- oh-my-opencode 的 `preemptive-compaction` 是内置 hook，默认可用；不要在 `disabled_hooks` 中禁用它。
- `sisyphus-junior`、`frontend-ui-ux-engineer`、`document-writer` 等名称默认不是内置 agent；如需使用，先在 `~/.config/opencode/agents` 或 `.opencode/agents` 定义后再映射模型。
- 示例中的密钥统一使用占位符；`gmn` 密钥按当前方案写入 `~/.local/share/opencode/auth.json`。
- 当前系统在 `opencode.json` 中保留了 `zhipuai-coding-plan.options.apiKey` 与 MCP 认证字段；如需调整为环境变量方式，可按需迁移。

### 5.2 `gmn` 配置使用教程（按实践）

安装：

- OpenCode 按官方安装文档执行即可：[https://opencode.ai/docs/#%E5%AE%89%E8%A3%85](https://opencode.ai/docs/#%E5%AE%89%E8%A3%85)

配置模型：

- 编辑 `~/.config/opencode/opencode.json`，在 `provider` 中添加/校对 `gmn`：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "gmn": {
      "npm": "@ai-sdk/openai",
      "name": "gmn",
      "options": {
        "baseURL": "https://gmncode.cn/v1"
      },
      "models": {
        "gpt-5.3-codex": {
          "name": "GPT-5.3-codex",
          "thinking": true,
          "variants": {
            "low": {
              "reasoningEffort": "low",
              "textVerbosity": "low",
              "reasoningSummary": "auto",
              "store": false,
              "include": ["reasoning.encrypted_content"]
            },
            "medium": {
              "reasoningEffort": "medium",
              "textVerbosity": "medium",
              "reasoningSummary": "auto",
              "store": false,
              "include": ["reasoning.encrypted_content"]
            },
            "high": {
              "reasoningEffort": "high",
              "textVerbosity": "high",
              "reasoningSummary": "auto",
              "store": false,
              "include": ["reasoning.encrypted_content"]
            },
            "xhigh": {
              "reasoningEffort": "xhigh",
              "textVerbosity": "high",
              "reasoningSummary": "auto",
              "store": false,
              "include": ["reasoning.encrypted_content"]
            }
          },
          "modalities": {
            "input": ["text", "image", "pdf"],
            "output": ["text"]
          },
          "limit": {
            "context": 400000,
            "output": 128000
          },
          "options": {
            "store": false,
            "reasoningEffort": "xhigh",
            "textVerbosity": "high",
            "reasoningSummary": "auto",
            "include": ["reasoning.encrypted_content"]
          }
        },
        "gpt-5.2-codex": {
          "name": "GPT-5.2 Codex",
          "variants": {
            "low": {
              "reasoningEffort": "low",
              "textVerbosity": "low",
              "reasoningSummary": "auto",
              "include": ["reasoning.encrypted_content"],
              "store": false
            },
            "medium": {
              "reasoningEffort": "medium",
              "textVerbosity": "medium",
              "reasoningSummary": "auto",
              "include": ["reasoning.encrypted_content"],
              "store": false
            },
            "high": {
              "reasoningEffort": "high",
              "textVerbosity": "high",
              "reasoningSummary": "auto",
              "include": ["reasoning.encrypted_content"],
              "store": false
            },
            "xhigh": {
              "reasoningEffort": "xhigh",
              "textVerbosity": "high",
              "reasoningSummary": "auto",
              "include": ["reasoning.encrypted_content"],
              "store": false
            }
          },
          "options": {
            "include": ["reasoning.encrypted_content"],
            "store": false
          }
        }
      }
    }
  }
}
```

配置密钥：

方式：手动编辑认证文件

- 在 `~/.local/share/opencode/auth.json` 中添加 API Key。
- `auth.json` 中的供应商名称必须与 `opencode.json` 的供应商名称完全一致（例如 `gmn`）。

```json
{
  "gmn": {
    "type": "api",
    "key": "你的API密钥"
  }
}
```

小技巧：

- 在 OpenCode 中按 `Ctrl + T` 可切换不同推理强度（variants）。
- 若当前模型未定义 `variants`，`Ctrl + T` 不会有明显效果。

---

## 6. 启动与验证

在项目目录（WSL 内）执行：

```bash
cd /mnt/c/Users/<YourName>/<project>
opencode
```

最小验收清单：

- [ ] `opencode --version` 可输出版本
- [ ] `opencode` 可正常进入会话
- [ ] `/models`（或 `opencode -m <provider/model>`）可切换 `zhipuai-coding-plan/glm-5` 与 `gmn/gpt-5.3-codex`
- [ ] `gmn/gpt-5.3-codex`、`gmn/gpt-5.2-codex` 的 `variants` 可见，并可通过 `Ctrl + T` 切换
- [ ] oh-my-opencode 相关能力可用（如其默认代理/功能被加载）
- [ ] `~/.local/share/opencode/auth.json` 中已配置 `gmn`（名称需与 `provider.gmn` 一致）
- [ ] 配置文件路径可确认（项目级或用户级）

---

## 7. 常见问题（官方路径）

1. `wsl --install` 后只显示帮助文本  
   先执行 `wsl --list --online`，再 `wsl --install -d <DistroName>`。

2. WSL 安装卡在 `0.0%`  
   使用：

   ```powershell
   wsl --install --web-download -d <DistroName>
   ```

3. Desktop App 连不上 WSL 内 OpenCode 服务  
   按 OpenCode 官方文档在 WSL 启动：

   ```bash
   OPENCODE_SERVER_PASSWORD=your-password opencode serve --hostname 0.0.0.0 --port 4096
   ```

   Windows 端连接 `http://localhost:4096`；若失败，用 `hostname -I` 查询 WSL IP 后连接。
