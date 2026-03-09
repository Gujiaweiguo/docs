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

### 2.1 当前机器的 WSL2 实际配置（2026-03-09 采样）

Linux 发行版内配置（`/etc/wsl.conf`）：

```ini
[boot]
systemd=true
```

Windows 用户级配置（`C:\Users\weigu\.wslconfig`，在 WSL 内对应 `/mnt/c/Users/weigu/.wslconfig`）：

```ini
[wsl2]
memory=24GB
swap=12GB
processors=8
autoProxy=false
```

说明：

- `.wslconfig` 为 WSL2 全局资源配置；修改后执行 `wsl --shutdown` 再重启发行版生效。
- `/etc/wsl.conf` 为当前发行版配置；此处已启用 `systemd=true`。

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

- 默认模型：`openai/gpt-5.3-codex`
- 快速模型：`zhipuai-coding-plan/glm-5`
- 推理强度：`openai/gpt-5.3-codex` 与 `openai/gpt-5.2-codex` 已配置 `variants`（`low/medium/high/xhigh`）

OpenCode 示例（用户级 `~/.config/opencode/opencode.json`，按当前系统配置脱敏）：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openai": {
      "options": {
        "baseURL": "https://gmncode.cn",
        "apiKey": "<YOUR_GMN_API_KEY>"
      },
      "models": {
        "gpt-5.2-codex": {
          "name": "GPT-5.2 Codex",
          "options": {
            "store": false
          },
          "variants": {
            "low": {},
            "medium": {},
            "high": {},
            "xhigh": {}
          }
        },
        "gpt-5.3-codex": {
          "name": "GPT-5.3 Codex",
          "options": {
            "store": false
          },
          "variants": {
            "low": {},
            "medium": {},
            "high": {},
            "xhigh": {}
          }
        }
      }
    },
    "zhipuai-coding-plan": {
      "options": {
        "apiKey": "<YOUR_ZHIPU_API_KEY>"
      }
    }
  },
  "agent": {
    "build": {
      "options": {
        "store": false
      }
    },
    "plan": {
      "options": {
        "store": false
      }
    }
  },
  "model": "openai/gpt-5.3-codex",
  "small_model": "zhipuai-coding-plan/glm-4.5-air",
  "plugin": ["oh-my-opencode"],
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
  }
}
```

oh-my-opencode 示例（用户级 `~/.config/opencode/oh-my-opencode.json`，按当前系统配置）：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/dev/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": { "model": "openai/gpt-5.3-codex" },
    "hephaestus": { "model": "openai/gpt-5.3-codex" },
    "oracle": { "model": "openai/gpt-5.3-codex" },
    "metis": { "model": "openai/gpt-5.3-codex" },
    "prometheus": { "model": "openai/gpt-5.3-codex" },
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
    "deep": { "model": "openai/gpt-5.3-codex" },
    "ultrabrain": { "model": "openai/gpt-5.3-codex" },
    "visual-engineering": { "model": "zhipuai-coding-plan/glm-5" }
  }
}
```

说明：

- 当前机器通过 OpenAI 兼容接口接入 GMN，因此模型标识为 `openai/...`，不是 `gmn/...`。
- 当前机器的 GMN Key 在 `~/.config/opencode/opencode.json` 的 `provider.openai.options.apiKey`。
- 当前机器未使用 `~/.local/share/opencode/auth.json` 作为生效认证源；该路径仅保留过历史备份文件。
- oh-my-opencode 的 `preemptive-compaction` 是内置 hook，默认可用；不要在 `disabled_hooks` 中禁用它。

### 5.2 `gmn` 配置使用教程（按当前实际配置）

安装：

- OpenCode 按官方安装文档执行即可：[https://opencode.ai/docs/#%E5%AE%89%E8%A3%85](https://opencode.ai/docs/#%E5%AE%89%E8%A3%85)

配置模型：

- 编辑 `~/.config/opencode/opencode.json`，将 GMN 作为 OpenAI 兼容提供方配置在 `provider.openai`：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openai": {
      "options": {
        "baseURL": "https://gmncode.cn",
        "apiKey": "<YOUR_GMN_API_KEY>"
      },
      "models": {
        "gpt-5.2-codex": {
          "name": "GPT-5.2 Codex",
          "options": {
            "store": false
          },
          "variants": {
            "low": {},
            "medium": {},
            "high": {},
            "xhigh": {}
          }
        },
        "gpt-5.3-codex": {
          "name": "GPT-5.3 Codex",
          "options": {
            "store": false
          },
          "variants": {
            "low": {},
            "medium": {},
            "high": {},
            "xhigh": {}
          }
        }
      }
    }
  },
  "model": "openai/gpt-5.3-codex"
}
```

配置密钥：

- 当前生效方案：将 GMN 密钥写在 `provider.openai.options.apiKey`。
- 当前配置不依赖 `~/.local/share/opencode/auth.json`。

小技巧：

- 在 OpenCode 中按 `Ctrl + T` 可切换已定义的 `variants` 档位。
- 若某个模型未定义 `variants`，`Ctrl + T` 对该模型不会有明显效果。

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
- [ ] `/models`（或 `opencode -m <provider/model>`）可切换 `zhipuai-coding-plan/glm-5` 与 `openai/gpt-5.3-codex`
- [ ] `openai/gpt-5.3-codex`、`openai/gpt-5.2-codex` 的 `variants` 可见，并可通过 `Ctrl + T` 切换
- [ ] oh-my-opencode 相关能力可用（如其默认代理/功能被加载）
- [ ] `~/.config/opencode/opencode.json` 中 `provider.openai.options.apiKey` 已配置（占位符已替换为真实值）
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
