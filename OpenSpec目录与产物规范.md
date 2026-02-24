# OpenSpec 目录与产物规范

本规范定义 OpenSpec 变更目录下必须产出的文件、最小字段与验收口径。

---

## 0. 标准目录

```text
openspec/
  changes/
    <CHANGE_ID>/
      proposal.md
      tasks.md
      verification-report.md
      specs/
```

---

## 1. `proposal.md` 规范

最小必填项：

- 背景与目标
- 变更范围（包含边界）
- 影响模块
- 验收标准
- 风险与回滚思路

最小模板：

```md
# Proposal: <CHANGE_ID>
## 背景与目标
## 变更范围
## 影响模块
## 验收标准
## 风险与回滚
```

---

## 2. `tasks.md` 规范

最小必填项：

- 任务 ID
- 输入/输出
- 依赖关系
- 执行步骤
- 完成定义（DoD）

最小模板：

```md
# Tasks: <CHANGE_ID>
## T1 <任务名>
- 输入：
- 输出：
- 依赖：
- 验收：
- 回滚：
```

---

## 3. `specs/` 规范

要求：

- 只描述本次新增/变更行为
- 不重复全量旧规范
- 每条行为需可验证

建议结构：

- 功能行为
- 接口或交互约束
- 异常与边界场景

---

## 4. `verification-report.md` 规范

最小必填项：

- 执行命令摘要
- 回归结果
- 证据路径（日志/截图/报告）
- 风险说明
- 是否可归档结论

---

## 5. 命名与一致性

- `<CHANGE_ID>` 使用小写短横线（如 `fix-login-500`）
- 文档术语统一：`Prepare`、`Apply`、`Verify`、`Archive`
- 一个变更仅保留一套任务计划，不并行维护重复计划

---

## 6. 常见结构错误

- 缺少 `verification-report.md`
- `tasks.md` 无任务 ID 或无验收标准
- `specs/` 写成需求背景，未描述可验证行为
- 文档中 `<CHANGE_ID>` 与目录名不一致

---

## 7. 检查命令

```bash
openspec list --json
openspec status --change <CHANGE_ID> --json
```

```text
/opsx-verify <CHANGE_ID>
```
