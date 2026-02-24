# OpenCode 快速入门

本篇用于新人在最短时间内跑通一次完整流程。

---

## 0. 你会学到什么

- OpenCode 与 OpenSpec 的关系
- 四阶段闭环：`Prepare -> Apply -> Verify -> Archive`
- 各智能体职责与最小协作方式
- 10 分钟最小可跑示例

---

## 1. 核心概念

- `OpenSpec`：规范与变更管理系统，负责定义“做什么、验收什么”。
- `OpenCode`：执行与协作入口，负责“按规范落地实现与验证”。
- 变更闭环：
  - `Prepare`：创建变更并补齐 proposal/specs/tasks（`/opsx-ff`）
  - `Apply`：将变更落地到工作上下文
  - `Verify`：校验实现与变更产物一致性（`/opsx-verify`）
  - `Archive`：归档并结束本次变更

---

## 2. 智能体职责（默认）

- `Sisyphus`：提案与任务拆解（`/opsx-ff`）
- `Atlas`：执行与归档（`/opsx-apply`、`/opsx-archive`）
- `Hephaestus`：失败项最小修复与收敛
- `Prometheus`（可选）：大任务计划输出到 `.sisyphus/plans/*.md`

---

## 3. 10 分钟最小闭环

前置命令：

```bash
openspec init
opencode
```

最小流程（示例变更：`hello-opencode`）：

1. Prepare（Sisyphus）

```text
/opsx-ff 为 hello-opencode 创建最小学习变更。
请输出 proposal、tasks、specs，验收标准为：能完整跑通闭环并给出验证报告。
```

2. Apply（Atlas）

```text
/opsx-apply hello-opencode
```

3. Verify（Atlas）

```text
/opsx-verify hello-opencode
```

4. Archive（Atlas）

```text
/opsx-archive hello-opencode
```

---

## 4. 新人常见错误

- 直接实现，不先 `Prepare`
- 同时并行执行 `/opsx-apply` 与 `/start-work`
- 验证失败后做无关重构，导致变更扩大
- 缺少 `verification-report.md` 的证据路径与风险说明

---

## 5. 入门完成标准

- [ ] 已跑通 `Prepare -> Apply -> Verify -> Archive`
- [ ] 已看到对应变更目录与产物文件
- [ ] 已执行并通过 `/opsx-verify hello-opencode`
- [ ] 已输出含证据与风险的验证结论

---

## 6. 继续学习

- 执行导向：`OpenCode实战手册.md`
- 测试导向：`OpenCode测试手册.md`
- 缺陷导向：`OpenCodeBUG修复手册.md`
