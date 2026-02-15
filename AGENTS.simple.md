# AGENTS.md（简版）

## 项目信息
- 项目名：<PROJECT_NAME>
- 根目录：<PROJECT_ROOT>
- 启动命令：<START_COMMAND>
- 端口：API <API_PORT> / Web <WEB_PORT>

## 规则
- 默认中文回复
- 有歧义先提问；先给计划/方案，得到确认再执行
- 最小改动，不做无关重构
- 不新增依赖，需先说明并确认
- 未明确要求不提交；不使用 --amend

## OpenSpec（如使用）
- 新功能/改接口/改表结构：先 Proposal，经批准后 Apply
- 上线后 Archive，并执行 `openspec validate --strict --no-interactive`
