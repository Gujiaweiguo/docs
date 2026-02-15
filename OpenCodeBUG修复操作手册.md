# OpenCode BUG 修复操作手册（可直接复制提示词）

这份手册只做一件事：给你可直接复制到 OpenCode 的命令和提示词。

你只需要替换占位符（如 `<BUGFIX_CHANGE_ID>`），按顺序粘贴执行即可。

---

## 0. 先替换这几个占位符

- `<BUGFIX_CHANGE_ID>`：本次 BUG 修复变更 ID（例如 `fix-login-500`）
- `<BUGFIX_BATCH_ID>`：批量 BUG 收敛变更 ID（例如 `stabilize-release`）
- `<BUG_DESC>`：BUG 描述（现象、期望行为、影响范围）
- `<BACKEND_TEST_CMD>`：后端测试命令（例如 `go test ./... -v`）
- `<FRONTEND_TEST_CMD>`：前端测试命令（例如 `npm run test`）
- `<E2E_TEST_CMD>`：端到端测试命令（例如 `npx playwright test`）

---

## 1. 4 大智能体怎么选（BUG 修复决策）

先用这条规则：

- 小任务（单个 BUG、路径清晰、预计 1 轮内收敛）：只用 Sisyphus。
- 大任务（跨模块、批量收敛、多轮修复）：Prometheus -> Atlas -> Hephaestus。

| Agent | 类型 | 如何访问 | 适用场景 | 不建议场景 |
|---|---|---|---|---|
| Sisyphus | 主要 Agent（默认） | 直接使用 | 单个 BUG 快速定位与修复 | 超长链路编排 |
| Prometheus | Planner Agent | 按 Tab 键 | 先拆修复计划、排依赖、定验收 | 问题非常简单 |
| Atlas | 执行 Orchestrator | `/start-work` | 按计划批量执行修复与回归 | 无计划直接开跑 |
| Hephaestus | 工匠型执行者 | 选中 | 持续修复失败项直到收敛 | 需求未澄清阶段 |

---

## 2. 场景一：单个 BUG 快速修复（按任务规模选择）

### 2.1 小任务版（Sisyphus）

适用条件：

- 单个 BUG，问题边界明确。
- 影响范围可控，预计少量改动即可修复。

步骤 A（创建修复变更）：

```text
/openspec-proposal 为 <BUGFIX_CHANGE_ID> 创建 BUG 修复变更，问题：<BUG_DESC>
```

步骤 B（定位根因并更新任务）：

```text
请基于 <BUGFIX_CHANGE_ID> 执行单个 BUG 修复准备：
1) 先定位根因并说明影响范围
2) 更新 tasks.md（定位、修复、回归、验证、归档）
3) 约束：仅最小改动，不做无关重构
```

步骤 C（执行修复）：

```text
/openspec-apply <BUGFIX_CHANGE_ID>
```

步骤 D（可选手动回归）：

```bash
!<BACKEND_TEST_CMD>
!<FRONTEND_TEST_CMD>
!<E2E_TEST_CMD>
```

步骤 E（生成验证报告）：

```text
请输出 verification-report.md，至少包含：
- BUG 根因
- 修复点与影响范围
- 回归结果
- 剩余风险与证据路径
```

步骤 F（严格验证）：

```bash
!openspec validate --strict --no-interactive
```

步骤 G（归档）：

```text
/openspec-archive <BUGFIX_CHANGE_ID>
```

本版必达产物与门禁：

- 产物：`proposal.md`、`tasks.md`、`specs/`、`verification-report.md`
- 门禁：`openspec validate --strict --no-interactive` 必须通过

### 2.2 大任务版（Prometheus -> Atlas -> Hephaestus）

适用条件：

- 单个 BUG 但链路长、依赖多、需要多轮修复。
- 需要计划驱动、阶段验收和持续风险收敛。

步骤 A（Prometheus，按 Tab 后输入）：

```text
请为 <BUGFIX_CHANGE_ID> 生成 BUG 修复详细计划，问题：<BUG_DESC>。
计划必须包含：
1) 根因假设与排查路径
2) 影响模块与依赖顺序
3) 每阶段输入/输出文件
4) 验收标准、回滚策略、风险优先级
```

步骤 B（主界面执行 Atlas）：

```text
/start-work
```

补充执行约束：

```text
请按最新计划执行，不跳过验证门禁。
必须执行：openspec validate --strict --no-interactive。
```

步骤 C（Hephaestus 持续修复）：

- 执行时机：默认在步骤 B 当前轮次执行结束后再进入步骤 C（串行）。
- 如果步骤 B 已通过门禁并可归档，可跳过步骤 C。

```text
Hephaestus，请接管当前未完成项并持续执行直到完成：
1) 修复失败项（仅最小改动）
2) 每轮修复后执行必要回归
3) 更新 verification-report.md
4) 输出剩余风险与是否可归档结论
```

收尾：

```text
/openspec-archive <BUGFIX_CHANGE_ID>
```

---

## 3. 场景二：发布前批量 BUG 收敛（多个修复变更）

### 3.1 小任务版（Sisyphus）

适用条件：

- BUG 数量较多但仍可由单代理串行推进。
- 目标是快速形成发布前可用的稳定版本。

步骤 A（创建批量收敛变更）：

```text
/openspec-proposal 为 <BUGFIX_BATCH_ID> 创建发布前批量 BUG 收敛变更，目标：修复高优先级缺陷并完成发布前回归
```

步骤 B（汇总缺陷与任务拆解）：

```text
请基于 <BUGFIX_BATCH_ID> 汇总当前待修复 BUG 并更新 tasks.md：
1) 按严重级别与影响模块分组
2) 定义每个 BUG 的验收标准与回归范围
3) 形成分批修复顺序（P0 -> P1 -> P2）
```

步骤 C（执行批量修复）：

```text
/openspec-apply <BUGFIX_BATCH_ID>
```

步骤 D（可选手动回归）：

```bash
!<BACKEND_TEST_CMD>
!<FRONTEND_TEST_CMD>
!<E2E_TEST_CMD>
```

步骤 E（生成批量验证报告）：

```text
请输出 verification-report.md，至少包含：
- 已修复清单（按优先级）
- 未修复清单与阻塞原因
- 回归结果
- 发布风险与建议
```

步骤 F（严格验证）：

```bash
!openspec validate --strict --no-interactive
```

步骤 G（归档）：

```text
/openspec-archive <BUGFIX_BATCH_ID>
```

本版必达产物与门禁：

- 产物：`proposal.md`、`tasks.md`、`specs/`、`verification-report.md`
- 门禁：`openspec validate --strict --no-interactive` 必须通过

### 3.2 大任务版（Prometheus -> Atlas -> Hephaestus）

适用条件：

- 批量 BUG 涉及跨模块、跨链路影响。
- 需要分阶段执行、持续修复和发布阻断判断。

步骤 A（Prometheus，按 Tab 后输入）：

```text
请为 <BUGFIX_BATCH_ID> 生成发布前批量 BUG 收敛计划。
计划必须包含：
1) BUG 分组策略（P0/P1/P2）
2) 跨模块依赖矩阵与分批执行顺序
3) 每批次验收标准与回归范围
4) 发布阻断条件、回滚策略、风险分级
```

步骤 B（主界面执行 Atlas）：

```text
/start-work
```

补充执行约束：

```text
请按最新计划分批执行，不跳过验证门禁。
必须执行：openspec validate --strict --no-interactive。
```

步骤 C（Hephaestus 持续修复）：

- 执行时机：默认在步骤 B 当前轮次执行结束后再进入步骤 C（串行）。
- 如果步骤 B 已通过门禁并可归档，可跳过步骤 C。

```text
Hephaestus，请接管当前未完成项并持续执行直到完成：
1) 按优先级修复失败项（仅最小改动）
2) 每轮修复后执行受影响范围回归
3) 持续更新 verification-report.md
4) 输出剩余风险、发布建议、是否可归档结论
```

收尾：

```bash
!openspec validate --strict --no-interactive
```

```text
/openspec-archive <BUGFIX_BATCH_ID>
```

---

## 4. 失败时直接复制的修复提示词

### 4.1 根因定位

```text
这是一次 BUG 根因定位，请仅做定位与修复建议：
1) 明确复现路径与触发条件
2) 定位根因与影响范围
3) 给出最小修复方案
4) 输出证据路径与剩余风险
```

### 4.2 回归失败排查

```text
这是一次回归失败排查，请只处理本次失败相关问题：
1) 先定位失败根因
2) 给出最小修复点
3) 修复后只执行必要回归
4) 输出失败原因、修复点、回归结果、剩余风险
```

### 4.3 严格验证失败排查

```text
`openspec validate --strict --no-interactive` 失败。
请只修复导致验证失败的规范结构/格式问题，不做无关改动。
修复后重新执行严格验证，并给出结果摘要。
```

---

## 5. 一键版（懒人复制）

如果你希望一次性让 OpenCode 完成单个 BUG 修复闭环，直接粘贴：

```text
请按 OpenSpec 流程完成 <BUGFIX_CHANGE_ID> 的 BUG 修复闭环，严格执行：Proposal -> Apply -> Validate -> Archive。
要求：
1) 更新 tasks.md（定位、修复、回归、验证）
2) 仅做最小改动修复 BUG
3) 执行必要测试并产出 verification-report.md
4) 执行 openspec validate --strict --no-interactive
5) 验证通过后执行 /openspec-archive <BUGFIX_CHANGE_ID>
约束：不改无关文件，不使用危险 git 命令，默认中文输出。
最终仅输出：改动文件、命令结果摘要、未解决风险。
```

---

## 6. 必过检查清单（执行结束后）

- [ ] 已执行 `/openspec-apply <BUGFIX_CHANGE_ID>` 或 `/openspec-apply <BUGFIX_BATCH_ID>`。
- [ ] 已产出 `proposal.md`、`tasks.md`、`specs/`、`verification-report.md`。
- [ ] 已执行 `openspec validate --strict --no-interactive` 且通过。
- [ ] 已执行 `/openspec-archive <BUGFIX_CHANGE_ID>` 或 `/openspec-archive <BUGFIX_BATCH_ID>`。
- [ ] 输出里包含证据：命令摘要 + 报告路径 + 风险说明。
