# OpenCode 可执行测试操作手册（可直接复制提示词）

这份手册只做一件事：给你可直接复制到 OpenCode 的命令和提示词。

你只需要改占位符（如 `<CHANGE_ID>`），按顺序粘贴执行即可。

---

## 0. 先替换这几个占位符

- `<CHANGE_ID>`：本次变更 ID（例如 `add-login`、`test-all`）
- `<BACKEND_TEST_CMD>`：后端测试命令（例如 `go test ./... -v`）
- `<FRONTEND_UNIT_CMD>`：前端单测命令（例如 `npm run test:unit`）
- `<FRONTEND_E2E_CMD>`：前端 E2E 命令（例如 `npx playwright test`）

---

## 1. 4 大智能体怎么选（实用决策）

先用这条规则：

- 小任务（单变更、路径清晰、步骤 <= 6）：只用 Sisyphus。
- 大任务（跨模块、全量回归、多轮修复）：Prometheus -> Atlas -> Hephaestus。

| Agent | 类型 | 如何访问 | 适用场景 | 不建议场景 |
|---|---|---|---|---|
| Sisyphus | 主要 Agent（默认） | 直接使用 | 日常编码、单变更测试、快速修复 | 超长链路编排 |
| Prometheus | Planner Agent | 按 Tab 键 | 先拆计划、排依赖、定验收 | 任务非常简单 |
| Atlas | 执行 Orchestrator | `/start-work` | 执行已批准计划、批量推进任务 | 没有计划直接开跑 |
| Hephaestus | 工匠型执行者 | 选中 | 持续修复直到完成目标 | 需求未澄清阶段 |

### 1.1 快速档（默认：只用 Sisyphus）

直接在 OpenCode 粘贴：

```text
请作为默认主代理执行 <CHANGE_ID> 测试闭环：
1) 生成并更新 test-plan.md 与 tasks.md
2) 执行测试并汇总结果
3) 产出 verification-report.md
4) 执行 openspec validate --strict --no-interactive
5) 如通过则执行 /openspec-archive <CHANGE_ID>
约束：最小改动，不改无关文件，默认中文输出。
```

### 1.2 重型档（复杂任务：Prometheus + Atlas + Hephaestus）

步骤 A（切到 Prometheus，按 Tab 后粘贴）：

```text
请为 <CHANGE_ID> 生成详细执行计划，目标是完成测试闭环。
计划必须包含：
1) 任务拆解（需求汇总、测试计划、执行、验证、归档）
2) 每步输入/输出文件
3) 验收标准与失败回滚策略
4) 风险点与优先级
```

步骤 B（回到主界面执行 Atlas）：

```text
/start-work
```

如果需要补充指令，继续粘贴：

```text
请按 Prometheus 最新计划执行，不跳过验证门禁。
必须执行：openspec validate --strict --no-interactive。
```

步骤 C（切到 Hephaestus 持续修复）：

执行时机：
- 默认在步骤 B 当前轮次执行结束后再进入步骤 C（串行）。
- 如果步骤 B 已满足验收并可归档，可跳过步骤 C；仅在失败、阻塞或存在未完成项时进入步骤 C。

调用方式（合并版）：
- 先让 Atlas 跑完当前轮次，确认存在失败项/阻塞项/未完成项。
- 选中当前任务（或当前对话中的未完成项）。
- 在输入框按 `Tab` 打开 Agent 选择器，选择 `Hephaestus` 并回车确认。
- 确认当前对话的 Agent 已显示为 `Hephaestus`。
- 粘贴下面提示词并执行。
- 每轮修复后只做必要回归，直到达到归档条件或输出剩余风险。

如果界面没有明显 Agent 切换入口，可直接输入同一条提示词作为兜底方式：

```text
Hephaestus，请接管当前未完成项并持续执行直到完成：
1) 修复失败测试（仅最小改动）
2) 每轮修复后执行必要回归
3) 更新 verification-report.md
4) 输出剩余风险与是否可归档结论
```

---

## 2. 日常场景：单个变更测试（按任务规模选择）

### 2.1 小任务版（Sisyphus）

适用条件：
- 单一变更、影响范围清晰、预计 1 轮内可完成。
- 失败后只需局部修复，不需要跨模块协调。

在 OpenCode 依次输入：

```text
/openspec-proposal 为 <CHANGE_ID> 创建测试变更，目标是补齐并执行该变更的测试与验证，产出 tasks.md 和 test-plan.md
```

```text
请基于 <CHANGE_ID> 生成可执行测试计划并写入对应变更目录：
1) 生成 test-plan.md（测试范围、策略、用例、预期结果）
2) 更新 tasks.md（后端测试、前端单测、前端E2E、规范验证、结果汇总）
要求：最小改动，不改无关文件，默认中文输出。
```

```text
/openspec-apply <CHANGE_ID>
```

如果要手动执行测试命令，可输入：

```bash
!<BACKEND_TEST_CMD>
!<FRONTEND_UNIT_CMD>
!<FRONTEND_E2E_CMD>
```

```text
请验证 <CHANGE_ID> 对应实现是否满足 OpenSpec 要求，输出 verification-report.md。
报告必须包含：通过项、不通过项、风险项、每项对应证据路径。
```

```bash
!openspec validate --strict --no-interactive
```

```text
/openspec-archive <CHANGE_ID>
```

本版必达产物与门禁：
- 产物：`test-plan.md`、`tasks.md`、`verification-report.md`
- 门禁：`openspec validate --strict --no-interactive` 必须通过

### 2.2 大任务版（Prometheus -> Atlas -> Hephaestus）

适用条件：
- 单变更但链路长、依赖多、预计需要多轮修复。
- 需要先拆计划，再编排执行，并持续收敛风险。

步骤 A（Prometheus，按 Tab 后输入）：

```text
请为 <CHANGE_ID> 生成详细执行计划，目标是完成单变更测试闭环。
计划必须包含：
1) 任务拆解（需求确认、测试计划、执行、验证、归档）
2) 每步输入/输出文件（至少包含 test-plan.md、tasks.md、verification-report.md）
3) 验收标准、失败回滚策略、门禁点
4) 风险点与优先级
```

步骤 B（主界面执行 Atlas）：

```text
/start-work
```

如果需要补充执行约束，继续输入：

```text
请按 Prometheus 最新计划执行，不跳过验证门禁。
必须执行：openspec validate --strict --no-interactive。
```

步骤 C（Hephaestus 持续修复）：

执行时机：
- 默认在步骤 B 当前轮次执行结束后再进入步骤 C（串行）。
- 如果步骤 B 已通过门禁并可归档，可跳过步骤 C。

```text
请接管当前未完成项并持续执行直到完成：
1) 修复失败测试（仅最小改动）
2) 每轮修复后执行必要回归
3) 更新 verification-report.md
4) 输出剩余风险与是否可归档结论
```

收尾命令：

```text
/openspec-archive <CHANGE_ID>
```

本版必达产物与门禁：
- 产物：`test-plan.md`、`tasks.md`、`verification-report.md`
- 门禁：`openspec validate --strict --no-interactive` 必须通过

---

## 3. 发布前场景：全量回归测试（按任务规模选择）

### 3.1 小任务版（Sisyphus）

适用条件：
- 项目规模中小，模块数量可控，可由单代理完成全量回归。
- 目标是快速得到一版完整回归结论并决定是否归档。

在 OpenCode 依次输入：

```text
请汇总当前项目中所有已归档与未归档 OpenSpec 变更，生成 all-requirements.md。
要求：按功能点、场景、验收标准组织，去重并标注来源变更ID。
```

```text
请根据 all-requirements.md 生成系统级 test-plan.md，覆盖正常/异常/回归场景。
要求：每条用例都要关联需求ID，并给出预期结果。
```

```text
/openspec-proposal 创建全量回归测试变更，用于执行所有历史变更的测试与规范验证
```

创建后，把 `<CHANGE_ID>` 替换成系统实际生成的变更名。

```text
请将 test-plan.md 纳入 <CHANGE_ID> 变更目录，并更新 tasks.md：
- 运行后端测试
- 运行前端单测
- 运行前端E2E
- 生成 verification-report.md
- 执行 openspec 严格验证
```

```text
/openspec-apply <CHANGE_ID>
```

```bash
!openspec validate --strict --no-interactive
```

```text
/openspec-archive <CHANGE_ID>
```

本版必达产物与门禁：
- 产物：`all-requirements.md`、`test-plan.md`、`tasks.md`、`verification-report.md`
- 门禁：`openspec validate --strict --no-interactive` 必须通过

### 3.2 大任务版（Prometheus -> Atlas -> Hephaestus）

适用条件：
- 跨模块、跨团队、执行周期长的发布前全量回归。
- 需要分阶段验收、批量推进和多轮缺陷修复。

步骤 A（Prometheus，按 Tab 后输入）：

```text
请为发布前全量回归生成详细计划，目标是完成所有历史变更的测试闭环。
计划必须包含：
1) 需求基线汇总策略（all-requirements.md）
2) 系统级测试计划与分批执行策略
3) 每阶段输入/输出与验收标准（含 test-plan.md、tasks.md、verification-report.md）
4) 失败回滚策略、风险分级与发布阻断条件
```

步骤 B（主界面执行 Atlas）：

```text
/start-work
```

补充执行约束（建议追加）：

```text
请按 Prometheus 最新计划分批执行全量回归，不跳过验证门禁。
必须执行：openspec validate --strict --no-interactive。
```

步骤 C（Hephaestus 持续修复）：

执行时机：
- 默认在步骤 B 当前轮次执行结束后再进入步骤 C（串行）。
- 如果步骤 B 已通过门禁并可归档，可跳过步骤 C。

```text
请接管当前全量回归未完成项并持续执行直到完成：
1) 按优先级修复失败项（仅最小改动）
2) 每轮修复后执行受影响范围回归
3) 持续更新 verification-report.md
4) 输出剩余风险、发布建议、是否可归档结论
```

收尾命令：

```bash
!openspec validate --strict --no-interactive
```

```text
/openspec-archive <CHANGE_ID>
```

本版必达产物与门禁：
- 产物：`all-requirements.md`、`test-plan.md`、`tasks.md`、`verification-report.md`
- 门禁：`openspec validate --strict --no-interactive` 必须通过

---

## 4. 失败时直接复制的修复提示词

### 4.1 测试失败排查

```text
这是一次测试失败排查，请只做最小修复：
1) 先定位失败根因（不要顺手重构）
2) 给出最小修复方案和影响范围
3) 修复后只执行必要回归测试
4) 输出：失败原因、修复点、回归结果、剩余风险
```

### 4.2 规范不一致排查

```text
请对照 OpenSpec 检查当前实现与规范差异，输出差异清单：
- 未实现
- 部分实现
- 行为不一致
并给出两种方案：
A) 改实现对齐规范
B) 改规范对齐真实需求
要求：每项都附证据文件路径。
```

### 4.3 严格验证失败排查

```text
`openspec validate --strict --no-interactive` 失败。
请只修复导致验证失败的规范结构/格式问题，不做无关改动。
修复后重新执行严格验证，并给出结果摘要。
```

---

## 5. 一键版（懒人复制）

如果你希望一次性让 OpenCode 完整执行单变更测试，直接粘贴：

```text
请按 OpenSpec 流程完成 <CHANGE_ID> 的测试闭环，严格执行：Proposal -> Apply -> Validate -> Archive。
要求：
1) 生成并更新 test-plan.md 与 tasks.md
2) 执行测试（后端/前端单测/E2E）
3) 产出 verification-report.md
4) 执行 openspec validate --strict --no-interactive
5) 验证通过后执行 /openspec-archive <CHANGE_ID>
约束：最小改动、不改无关文件、不使用危险 git 命令、默认中文输出。
最终仅输出：改动文件、命令结果摘要、未解决风险。
```

---

## 6. 必过检查清单（执行结束后）

- [ ] 已执行 `/openspec-apply <CHANGE_ID>`。
- [ ] 已产出 `test-plan.md`、`tasks.md`、`verification-report.md`。
- [ ] 已执行 `openspec validate --strict --no-interactive` 且通过。
- [ ] 已执行 `/openspec-archive <CHANGE_ID>`（如本轮需要归档）。
- [ ] 输出里包含证据：命令摘要 + 报告路径 + 风险说明。
