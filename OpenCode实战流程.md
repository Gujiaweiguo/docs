# openCode + Oh My OpenCode 与 OpenSpec 结合的实战流程

这份文档只做一件事：给你可直接复制到 OpenCode 的命令和提示词。

你只需要替换占位符并按顺序执行。

---

## 0. 占位符与前置条件

先替换下面占位符：

- `<MVP_CHANGE_ID>`：新 MVP 变更 ID（例如 `rbac-mvp`）
- `<CHANGE_ID>`：新增功能的变更 ID（例如 `add-user-lock`）
- `<MVP_SCOPE>`：MVP 范围描述（功能边界、技术栈、验收标准）
- `<INCREMENT_SCOPE>`：增量需求描述（新增点、兼容要求、影响模块）
- `<BACKEND_TEST_CMD>`：后端测试命令（例如 `go test ./... -v`）
- `<FRONTEND_TEST_CMD>`：前端测试命令（例如 `npm run test`）

前置条件：

```bash
openspec init
opencode
```

---

## 1. 场景一：新 MVP（从 0 到 1）

### 1.1 小任务版（Sisyphus）

适用条件：

- MVP 边界清晰，模块数量可控。
- 希望以单代理快速完成从 Proposal 到 Archive 的闭环。

步骤 A（创建 MVP 变更）：

```text
/openspec-proposal 为 <MVP_CHANGE_ID> 创建 MVP 变更，目标：<MVP_SCOPE>
```

步骤 B（生成 specs 与 tasks）：

```text
请基于 <MVP_CHANGE_ID> 生成并完善 specs 与 tasks：
1) 写清核心能力、接口、数据模型和验收标准
2) 输出最小可交付任务拆解（后端、前端、测试、验证）
3) 仅做最小必要设计，不做超范围扩展
```

步骤 C（执行变更）：

```text
/openspec-apply <MVP_CHANGE_ID>
```

步骤 D（可选手动测试）：

```bash
!<BACKEND_TEST_CMD>
!<FRONTEND_TEST_CMD>
```

步骤 E（生成验证报告）：

```text
请输出 verification-report.md，包含：通过项、不通过项、风险项、证据路径。
```

步骤 F（严格验证）：

```bash
!openspec validate --strict --no-interactive
```

步骤 G（归档）：

```text
/openspec-archive <MVP_CHANGE_ID>
```

本版必达产物与门禁：

- 产物：`proposal.md`、`tasks.md`、`specs/`、`verification-report.md`
- 门禁：`openspec validate --strict --no-interactive` 必须通过

### 1.2 大任务版（Prometheus -> Atlas -> Hephaestus）

适用条件：

- MVP 跨多个模块，依赖复杂。
- 预计需要多轮修复与阶段验收。

步骤 A（Prometheus，按 Tab 后输入）：

```text
请为 <MVP_CHANGE_ID> 生成新 MVP 详细执行计划，目标：<MVP_SCOPE>。
计划必须包含：
1) 需求边界与不做项
2) 模块拆分、依赖顺序、输入/输出文件
3) 验收标准、验证门禁、回滚策略
4) 风险分级与优先级
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

- 执行时机：默认在步骤 B 当前轮次结束后进入（串行）。
- 若步骤 B 已通过门禁并可归档，可跳过步骤 C。

```text
Hephaestus，请接管当前未完成项并持续执行直到完成：
1) 仅做最小修复
2) 每轮修复后执行必要回归
3) 更新 verification-report.md
4) 输出剩余风险与是否可归档结论
```

收尾：

```text
/openspec-archive <MVP_CHANGE_ID>
```

---

## 2. 场景二：新增 changes（已有项目增量迭代）

### 2.1 小任务版（单个 change）

适用条件：

- 在已有项目上新增一个功能点或修复一个行为差异。
- 影响范围可控，主要是增量修改。

步骤 A（创建增量变更）：

```text
/openspec-proposal 为 <CHANGE_ID> 创建增量变更，目标：<INCREMENT_SCOPE>
```

步骤 B（补充增量规格与任务）：

```text
请基于 <CHANGE_ID> 做增量设计与任务拆解：
1) 只描述新增/变更部分，不重复全量规范
2) 标注受影响模块、兼容性约束、回归范围
3) 更新 tasks.md（实现、回归、验证、归档）
```

步骤 C（执行变更）：

```text
/openspec-apply <CHANGE_ID>
```

步骤 D（可选手动回归）：

```bash
!<BACKEND_TEST_CMD>
!<FRONTEND_TEST_CMD>
```

步骤 E（生成验证报告）：

```text
请输出 verification-report.md，重点说明：
- 增量功能是否达标
- 对历史功能是否产生回归
- 未解决风险与影响范围
```

步骤 F（严格验证）：

```bash
!openspec validate --strict --no-interactive
```

步骤 G（归档）：

```text
/openspec-archive <CHANGE_ID>
```

本版必达产物与门禁：

- 产物：`proposal.md`、`tasks.md`、`specs/`、`verification-report.md`
- 门禁：`openspec validate --strict --no-interactive` 必须通过

### 2.2 大任务版（跨模块新增 changes）

适用条件：

- 增量需求跨多个模块，涉及兼容性和依赖顺序。
- 可能拆成多轮执行并持续收敛风险。

步骤 A（Prometheus，按 Tab 后输入）：

```text
请为 <CHANGE_ID> 生成跨模块增量变更计划，目标：<INCREMENT_SCOPE>。
计划必须包含：
1) 影响模块与依赖矩阵
2) 增量规格与兼容性策略
3) 分批执行与回归策略
4) 验收标准、验证门禁、回滚方案
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

- 执行时机：默认在步骤 B 当前轮次结束后进入（串行）。
- 若步骤 B 已通过门禁并可归档，可跳过步骤 C。

```text
Hephaestus，请接管当前未完成项并持续执行直到完成：
1) 按优先级修复失败项（仅最小改动）
2) 每轮修复后执行受影响范围回归
3) 持续更新 verification-report.md
4) 输出剩余风险、上线建议、是否可归档
```

收尾：

```bash
!openspec validate --strict --no-interactive
```

```text
/openspec-archive <CHANGE_ID>
```

---

## 3. 失败时可直接复制的提示词

### 3.1 实现与规范不一致

```text
请对照当前 OpenSpec 检查实现差异，只做最小修复：
1) 列出未实现、部分实现、行为不一致项
2) 给出最小修复方案与影响范围
3) 修复后执行必要回归
4) 输出证据路径与剩余风险
```

### 3.2 测试失败排查

```text
这是一次失败排查，请仅处理本次失败相关问题：
1) 先定位根因
2) 给出最小修复点
3) 修复后只跑必要回归
4) 输出失败原因、修复点、回归结果、剩余风险
```

### 3.3 严格验证失败排查

```text
`openspec validate --strict --no-interactive` 失败。
请只修复导致验证失败的规范结构/格式问题，不做无关改动。
修复后重新执行严格验证，并输出结果摘要。
```

---

## 4. 必过检查清单

- [ ] 已执行 `/openspec-apply <MVP_CHANGE_ID>` 或 `/openspec-apply <CHANGE_ID>`。
- [ ] 已产出 `proposal.md`、`tasks.md`、`specs/`、`verification-report.md`。
- [ ] 已执行 `openspec validate --strict --no-interactive` 且通过。
- [ ] 已执行 `/openspec-archive <MVP_CHANGE_ID>` 或 `/openspec-archive <CHANGE_ID>`。
- [ ] 输出中包含证据：命令摘要 + 报告路径 + 风险说明。
