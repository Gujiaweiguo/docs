# OpenCode 实战手册（步骤化执行版）

这份手册只给你一件事：每一步选哪个智能体、复制哪段提示词。

---

## 0. 占位符与前置条件

先替换占位符：

- `<MVP_CHANGE_ID>`：MVP 变更 ID（例如 `rbac-mvp`）
- `<CHANGE_ID>`：增量变更 ID（例如 `add-user-lock`）
- `<MVP_SCOPE>`：MVP 范围描述
- `<INCREMENT_SCOPE>`：增量需求描述
- `<BACKEND_TEST_CMD>`：后端测试命令
- `<FRONTEND_TEST_CMD>`：前端测试命令
- `<TARGET_PAGE_URL>`：页面地址（例如 `https://demo.dataease.cn/#/data/dataset`）
- `<DEMO_USERNAME>`：页面账号
- `<DEMO_PASSWORD>`：页面密码

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

## 2. 场景一：新 MVP（小任务）

### 步骤 A（Sisyphus）

选择智能体：`Sisyphus`

复制提示词：

```text
/opsx-ff 为 <MVP_CHANGE_ID> 创建 MVP 变更，目标：<MVP_SCOPE>。
请基于 <MVP_CHANGE_ID> 完善 specs 与 tasks：
1) 写清核心能力、接口、数据模型、验收标准
2) 给出最小任务拆解（实现、测试、验证、归档）
3) 仅做最小必要设计，不做超范围扩展
```

### 步骤 B（Atlas）

选择智能体：`Atlas`

复制提示词：

```text
/opsx-apply <MVP_CHANGE_ID>
```

### 步骤 C（Hephaestus，可选）

选择智能体：`Hephaestus`

复制提示词：

```text
请接管当前未完成项并持续执行直到完成：
1) 仅最小修复
2) 每轮修复后执行必要回归
3) 更新 verification-report.md
4) 输出剩余风险与是否可归档结论
```

### 步骤 D（命令）

```bash
!<BACKEND_TEST_CMD>
!<FRONTEND_TEST_CMD>
```

```text
/opsx-verify <MVP_CHANGE_ID>
```

### 步骤 E（Atlas）

选择智能体：`Atlas`

复制提示词：

```text
/opsx-archive <MVP_CHANGE_ID>
```

---

## 3. 场景二：增量变更（小任务）

### 步骤 A（Sisyphus）

选择智能体：`Sisyphus`

复制提示词：

```text
/opsx-ff 为 <CHANGE_ID> 创建增量变更，目标：<INCREMENT_SCOPE>。
请基于 <CHANGE_ID> 完善 specs 与 tasks：
1) 只描述新增/变更部分，不重复全量规范
2) 标注受影响模块、兼容性约束、回归范围
3) 更新 tasks.md（实现、回归、验证、归档）
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
1) 仅最小修复
2) 每轮修复后执行必要回归
3) 更新 verification-report.md
4) 输出剩余风险与是否可归档结论
```

### 步骤 D（命令）

```bash
!<BACKEND_TEST_CMD>
!<FRONTEND_TEST_CMD>
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

## 4. 场景三：大任务（启用 Prometheus）

### 步骤 A0（Sisyphus，首次必做）

选择智能体：`Sisyphus`

复制提示词：

```text
/opsx-ff 为 <MVP_CHANGE_ID> 或 <CHANGE_ID> 创建变更，目标：补齐本次大任务需求。
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
请为 <MVP_CHANGE_ID> 或 <CHANGE_ID> 生成唯一执行计划，先输出到 `.sisyphus/plans/*.md`，不要直接写 OpenSpec。
要求：
1) 每个任务有任务ID、输入/输出、验收标准、回滚方案
2) 标注依赖顺序与风险等级
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
/opsx-apply <MVP_CHANGE_ID> 或 /opsx-apply <CHANGE_ID>
```

### 步骤 C（Atlas）

选择智能体：`Atlas`

复制提示词：

```text
/start-work
```

### 步骤 D（Hephaestus）

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
/opsx-verify <MVP_CHANGE_ID> 或 /opsx-verify <CHANGE_ID>
/opsx-archive <MVP_CHANGE_ID> 或 /opsx-archive <CHANGE_ID>
```

---

## 5. 场景四：页面驱动增量实现

### 步骤 A（Sisyphus）

选择智能体：`Sisyphus`

复制提示词：

```text
/opsx-ff 为 <CHANGE_ID> 创建增量变更，目标如下：
实现 AI 读取并参考目标页面功能，页面地址：<TARGET_PAGE_URL>。
登录凭据通过环境变量注入：<DEMO_USERNAME> / <DEMO_PASSWORD>。
需覆盖以下页面行为并映射到新增实现：
1) 点击新建数据集
2) 点击选择数据源
3) 拖拉数据表至面板
4) 数据预览设计维度和指标
5) 点击计算字段进行编辑
6) 点击分组字段进行编辑
7) 点击刷新数据进行预览
请输出 specs/tasks，并标注验收标准与回归范围。
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
请按 <CHANGE_ID> 执行实现：
1) 严格按页面 7 步行为对齐
2) 每一步记录证据（截图路径、日志路径、关键结果）
3) 输出 verification-report.md，并给出每一步达标结论
```

### 步骤 D（命令 + Atlas）

```text
/opsx-verify <CHANGE_ID>
/opsx-archive <CHANGE_ID>
```

---

## 6. 失败排查（复制即用）

实现与规范不一致：

```text
请对照当前 OpenSpec 检查实现差异，只做最小修复：
1) 列出未实现、部分实现、行为不一致项
2) 给出最小修复方案与影响范围
3) 修复后执行必要回归
4) 输出证据路径与剩余风险
```

测试失败排查：

```text
这是一次失败排查，请仅处理本次失败相关问题：
1) 先定位根因
2) 给出最小修复点
3) 修复后只跑必要回归
4) 输出失败原因、修复点、回归结果、剩余风险
```

校验失败排查：

```text
`/opsx-verify <MVP_CHANGE_ID>` 或 `/opsx-verify <CHANGE_ID>` 失败。
请只修复导致校验失败的最小问题（任务未完成、实现与规范不一致、证据缺失），不做无关改动。
修复后重新执行校验，并输出结果摘要。
```

---

## 7. 必过检查清单

- [ ] 已执行 `/opsx-ff ...` 且已创建对应变更目录。
- [ ] 已执行 `/opsx-apply <MVP_CHANGE_ID>` 或 `/opsx-apply <CHANGE_ID>`。
- [ ] 已产出 `proposal.md`、`tasks.md`、`specs/`、`verification-report.md`。
- [ ] 已执行 `/opsx-verify <MVP_CHANGE_ID>` 或 `/opsx-verify <CHANGE_ID>` 且通过。
- [ ] 已执行 `/opsx-archive <MVP_CHANGE_ID>` 或 `/opsx-archive <CHANGE_ID>`。
- [ ] 输出中包含证据：命令摘要 + 报告路径 + 风险说明。
