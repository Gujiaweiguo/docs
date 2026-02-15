# AGENTS.md

## 项目信息
- 项目名：<PROJECT_NAME>
- 根目录：<PROJECT_ROOT>
- 模块/目录：<MODULES>
- 技术栈：<STACK>
- 启动命令：<START_COMMAND>
- 端口：API <API_PORT> / Web <WEB_PORT>

## 语言与沟通
- 默认中文回复
- 有歧义先提问
- 先给计划/方案，得到确认再执行

## 执行与改动原则
- 最小改动，不做无关重构
- 删除/迁移/大改动需二次确认
- 不新增依赖，除非说明原因并获得确认

## Git 规则
- 未明确要求不提交
- 允许分支开发：每个任务一个分支
- 合并时机：任务完成 + 验证通过 + 工作区干净
- 合并方式：在 main 上 `git merge --ff-only <branch>`
- 不使用 `--amend`
- 不创建 PR，除非明确要求

## 验证要求
- 改动后说明验证方式；需要跑测试先确认

## 环境变量与敏感信息
- 使用 `.env` / `.env.local`，不提交敏感信息
- 不在对话中记住密码

## 命令执行偏好
- 用户用自然语言下达指令即可
- 可能破坏性或联网命令需先确认

## OpenSpec 流程（如果使用）
- 新功能/改接口/改表结构：必须先 Proposal，经批准后再 Apply
- 上线后 Archive，并执行 `openspec validate --strict --no-interactive`
- 常用命令：`openspec list`、`openspec show <id>`、`openspec validate <id>`
- OpenCode 命令：`/openspec-proposal`、`/openspec-apply`、`/openspec-archive`

## OpenSpec 结构与最佳实践（可选，按仓库实际调整）
- 目录布局：建议使用 `openspec/`，并在 `openspec/AGENTS.md` 写明规则
- 变更目录：`openspec/changes/<change-id>/`
  - 常见脚手架：`proposal.md`、`tasks.md`、可选 `design.md`、以及 delta specs
- 变更 ID：`kebab-case`，动词开头（`add-`/`update-`/`remove-`/`refactor-`）
- delta specs 建议格式：
  - `## ADDED|MODIFIED|REMOVED|RENAMED Requirements`
  - 至少包含一个 `#### Scenario:`
- 提交/共享前验证：`openspec validate <id> --strict --no-interactive`
