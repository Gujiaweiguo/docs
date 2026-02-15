# AGENTS.md

本项目以写作/学习文档为主，本文件提供固定上下文与工作约定。

## 项目上下文
- 文档根目录：<DOC_ROOT>
- 主要格式：Markdown
- 目标读者：<AUDIENCE>
- 文档结构：<STRUCTURE>
- 统一风格：<STYLE_GUIDE>

## 语言与沟通
- 默认中文回复
- 有歧义先提问
- 先给目录/提纲/修改范围，得到确认再开始写
- 未明确要求不提交 git

## 写作要求
- 最小改动，不做无关改写
- 内容先结构化，再补细节
- 术语一致，避免同义词混用
- 需要引用/外部资料时先确认来源

## Git 规则
- 未明确要求不提交
- 允许分支开发：每个任务一个分支
- 合并方式：在 main 上 `git merge --ff-only <branch>`
- 不使用 `--amend`
- 不创建 PR，除非明确要求

## 验证要求
- 改动后说明验证方式（如目录检查、链接检查、格式检查）

## 环境变量与敏感信息
- 使用 `.env` / `.env.local`，不提交敏感信息
- 不在对话中记住密码

## OpenSpec（如使用）
- 新功能/改接口/改表结构：必须先 Proposal，经批准后再 Apply
- 上线后 Archive，并执行 `openspec validate --strict --no-interactive`
- 常用命令：`openspec list`、`openspec show <id>`、`openspec validate <id>`
- OpenCode 命令：`/openspec-proposal`、`/openspec-apply`、`/openspec-archive`
