# OpenCode 测试手册（步骤化执行版）

这份手册只给你一件事：每一步选哪个智能体、复制哪段提示词。

---

## 0. 占位符与前置条件

先替换占位符：

- `<CHANGE_ID>`：测试变更 ID（例如 `test-login-flow`）
- `<BACKEND_TEST_CMD>`：后端测试命令
- `<FRONTEND_UNIT_CMD>`：前端单测命令
- `<FRONTEND_E2E_CMD>`：前端 E2E 命令

前置条件：

```bash
openspec init
opencode
```

---

## 1. 固定规则（先看一次）

- 固定闭环：`Prepare -> Apply -> Verify -> Archive`
- 默认智能体：
  - Prepare：`Sisyphus`
  - Apply/Archive：`Atlas`
  - 失败项修复：`Hephaestus`
  - 大任务规划（可选）：`Prometheus`
- 大任务启用 Prometheus 时，只保留一套计划：先由 Prometheus 产出计划，再由 `Sisyphus` 或 `Atlas` 落盘到 `proposal/specs/tasks`。
- 串行执行：`/opsx-apply` 在跑时，不执行 `/start-work`。

---

## 2. 场景一：单变更测试（日常）

### 步骤 A（Sisyphus）

选择智能体：`Sisyphus`

复制提示词：

```text
/opsx-ff 为 <CHANGE_ID> 创建测试变更，目标：补齐并执行测试闭环。
请基于 <CHANGE_ID> 完善 specs 与 tasks：
1) 生成 test-plan.md（范围、策略、用例、预期）
2) 更新 tasks.md（后端、单测、E2E、验证、归档）
3) 标注回归范围与风险项
```

### 步骤 B（Atlas）

选择智能体：`Atlas`

复制提示词：

```text
/opsx-apply <CHANGE_ID>
```

### 步骤 C（Hephaestus，可选）

选择智能体：`Hephaestus`

复制提示词：

```text
请接管当前未完成项并持续执行直到完成：
1) 修复失败测试（仅最小改动）
2) 每轮修复后执行必要回归
3) 更新 verification-report.md
4) 输出剩余风险与是否可归档结论
```

### 步骤 D（命令）

```bash
!<BACKEND_TEST_CMD>
!<FRONTEND_UNIT_CMD>
!<FRONTEND_E2E_CMD>
```

```text
/opsx-verify <CHANGE_ID>
```

### 步骤 E（Atlas）

选择智能体：`Atlas`

复制提示词：

```text
/opsx-archive <CHANGE_ID>
```

---

## 3. 场景二：发布前全量回归

### 步骤 A0（Sisyphus，首次必做）

选择智能体：`Sisyphus`

复制提示词：

```text
/opsx-ff 创建全量回归测试变更。
创建后请返回实际变更名。
```

```bash
!openspec list --json
!openspec status --change <实际变更名>
```

说明：如果该变更已存在，可跳过 A0。

### 步骤 A（Prometheus，可选）

选择智能体：`Prometheus`

复制提示词：

```text
请为 <CHANGE_ID> 生成唯一执行计划，先输出到 `.sisyphus/plans/*.md`，不要直接写 OpenSpec。
要求：
1) 每个任务有任务ID、输入/输出、验收标准、回滚方案
2) 标注依赖顺序、回归批次与风险等级
3) 输出 Plan v1，并作为 Atlas/Hephaestus 唯一执行依据
```

### 步骤 A1（Sisyphus 或 Atlas）

选择智能体：`Sisyphus` 或 `Atlas`

复制提示词：

```text
请将 `.sisyphus/plans/` 下最新 Plan v1 同步落盘到 OpenSpec：
- 目标位置：`proposal/specs/tasks`
- 保持任务ID、依赖顺序、验收标准、回滚方案不变
- 不新增第二套计划文档
```

### 步骤 B（Atlas）

选择智能体：`Atlas`

复制提示词：

```text
/opsx-apply <CHANGE_ID>
```

### 步骤 C（Atlas）

选择智能体：`Atlas`

复制提示词：

```text
/start-work
```

### 步骤 D（Hephaestus，可选）

选择智能体：`Hephaestus`

复制提示词：

```text
请按已落盘任务继续收敛失败项：
1) 仅修复失败项
2) 修复后做必要回归
3) 更新 verification-report.md
4) 给出是否可归档结论
```

### 步骤 E（命令 + Atlas）

```text
/opsx-verify <CHANGE_ID>
/opsx-archive <CHANGE_ID>
```

---

## 4. 失败排查（复制即用）

测试失败排查：

```text
这是一次测试失败排查，请只做最小修复：
1) 先定位失败根因（不要顺手重构）
2) 给出最小修复方案和影响范围
3) 修复后只执行必要回归测试
4) 输出：失败原因、修复点、回归结果、剩余风险
```

规范不一致排查：

```text
请对照 OpenSpec 检查当前实现与规范差异，输出：
- 未实现
- 部分实现
- 行为不一致
并给出最小修复方案与证据路径。
```

校验失败排查：

```text
`/opsx-verify <CHANGE_ID>` 失败。
请只修复导致校验失败的最小问题（任务未完成、实现与规范不一致、证据缺失），不做无关改动。
修复后重新执行校验，并给出结果摘要。
```

---

## 5. 必过检查清单

- [ ] 已执行 `/opsx-ff ...` 且已创建 `openspec/changes/<CHANGE_ID>/`。
- [ ] 已执行 `/opsx-apply <CHANGE_ID>`。
- [ ] 已产出 `test-plan.md`、`tasks.md`、`verification-report.md`。
- [ ] 已执行 `/opsx-verify <CHANGE_ID>` 且通过。
- [ ] 已执行 `/opsx-archive <CHANGE_ID>`。
- [ ] 输出中包含证据：命令摘要 + 报告路径 + 风险说明。
