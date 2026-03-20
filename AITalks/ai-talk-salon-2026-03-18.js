"use strict";

const path = require("path");
const PptxGenJS = require("pptxgenjs");
const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("./pptxgenjs_helpers/layout");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Codex";
pptx.company = "OpenAI";
pptx.subject = "AI salon talk";
pptx.title = "AI时代对我们工作与生活的影响";
pptx.lang = "zh-CN";
pptx.theme = {
  headFontFace: "Microsoft YaHei",
  bodyFontFace: "Microsoft YaHei",
  lang: "zh-CN",
};

const OUT = path.join(__dirname, "ai-talk-salon-2026-03-18.pptx");

const C = {
  ink: "163245",
  inkSoft: "456174",
  deep: "0F2233",
  mist: "F4F7F9",
  white: "FFFFFF",
  accent: "E97532",
  accentSoft: "F7D7C4",
  teal: "1D7A85",
  tealSoft: "D7EEF0",
  gold: "D9A441",
  goldSoft: "F8EDD1",
  line: "D8E0E6",
  slate: "6B7C89",
};

function addBg(slide, color = C.white) {
  slide.background = { color };
}

function addTopBand(slide, title, kicker) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.68,
    line: { color: C.deep, transparency: 100 },
    fill: { color: C.deep },
  });
  slide.addText(title, {
    x: 0.7,
    y: 0.95,
    w: 8.9,
    h: 0.5,
    fontFace: "Microsoft YaHei",
    fontSize: 24,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  if (kicker) {
    slide.addText(kicker, {
      x: 10.7,
      y: 0.97,
      w: 1.95,
      h: 0.34,
      align: "center",
      valign: "mid",
      fontFace: "Microsoft YaHei",
      fontSize: 10,
      bold: true,
      color: C.accent,
      line: { color: C.accent, pt: 1.2 },
      fill: { color: C.white },
      radius: 0.12,
      margin: 0.04,
    });
  }
  slide.addShape(pptx.ShapeType.line, {
    x: 0.7,
    y: 1.55,
    w: 11.9,
    h: 0,
    line: { color: C.line, pt: 1.2 },
  });
}

function addFooter(slide, page) {
  slide.addText(`AI Salon Talk  |  ${page}`, {
    x: 11.25,
    y: 7.02,
    w: 1.3,
    h: 0.2,
    fontFace: "Microsoft YaHei",
    fontSize: 9,
    color: C.slate,
    align: "right",
    margin: 0,
  });
}

function addBulletList(slide, items, opts = {}) {
  const {
    x,
    y,
    w,
    fontSize = 19,
    color = C.ink,
    bulletColor = C.accent,
    gap = 0.68,
    bulletSize = 0.12,
  } = opts;
  items.forEach((item, idx) => {
    const top = y + idx * gap;
    slide.addShape(pptx.ShapeType.ellipse, {
      x,
      y: top + 0.17,
      w: bulletSize,
      h: bulletSize,
      line: { color: bulletColor, transparency: 100 },
      fill: { color: bulletColor },
    });
    slide.addText(item, {
      x: x + 0.24,
      y: top,
      w,
      h: 0.38,
      fontFace: "Microsoft YaHei",
      fontSize,
      color,
      margin: 0,
      breakLine: false,
    });
  });
}

function addMetricCard(slide, x, y, w, h, tone, number, title, desc) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    line: { color: tone.soft, pt: 1.2 },
    fill: { color: tone.bg },
  });
  slide.addText(number, {
    x: x + 0.26,
    y: y + 0.22,
    w: w - 0.4,
    h: 0.45,
    fontFace: "Microsoft YaHei",
    fontSize: 28,
    bold: true,
    color: tone.main,
    margin: 0,
  });
  slide.addText(title, {
    x: x + 0.26,
    y: y + 0.84,
    w: w - 0.4,
    h: 0.26,
    fontFace: "Microsoft YaHei",
    fontSize: 17,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  slide.addText(desc, {
    x: x + 0.26,
    y: y + 1.2,
    w: w - 0.4,
    h: 0.55,
    fontFace: "Microsoft YaHei",
    fontSize: 11,
    color: C.inkSoft,
    margin: 0,
    valign: "top",
  });
}

function addSectionQuote(slide, text, sub) {
  slide.addText(text, {
    x: 0.9,
    y: 2.0,
    w: 6.95,
    h: 1.6,
    fontFace: "Microsoft YaHei",
    fontSize: 28,
    bold: true,
    color: C.white,
    margin: 0,
    valign: "mid",
  });
  slide.addText(sub, {
    x: 0.92,
    y: 4.05,
    w: 6.35,
    h: 0.45,
    fontFace: "Microsoft YaHei",
    fontSize: 14,
    color: "D7E0E8",
    margin: 0,
  });
}

function finishSlide(slide, page, options = {}) {
  if (options.checkOverlap !== false) {
    warnIfSlideHasOverlaps(slide, pptx);
  }
  warnIfSlideElementsOutOfBounds(slide, pptx);
  addFooter(slide, page);
}

function slide1() {
  const s = pptx.addSlide();
  addBg(s, C.deep);
  s.addShape(pptx.ShapeType.rect, {
    x: 10.2,
    y: 0.15,
    w: 2.8,
    h: 7.1,
    line: { color: C.teal, transparency: 100 },
    fill: { color: C.teal, transparency: 18 },
    rotate: -6,
  });
  // Decorative angled panels on the cover intentionally layer behind the right-side content.
  s.addShape(pptx.ShapeType.rect, {
    x: 11.15,
    y: 0.55,
    w: 1.15,
    h: 5.95,
    line: { color: C.accent, transparency: 100 },
    fill: { color: C.accent, transparency: 18 },
    rotate: -6,
  });
  s.addText("AI时代对我们工作与生活的影响", {
    x: 0.88,
    y: 1.42,
    w: 6.9,
    h: 1.3,
    fontFace: "Microsoft YaHei",
    fontSize: 26,
    bold: true,
    color: C.white,
    margin: 0,
  });
  s.addText("从工具升级到决策方式变化", {
    x: 0.9,
    y: 2.95,
    w: 4.3,
    h: 0.4,
    fontFace: "Microsoft YaHei",
    fontSize: 16,
    color: "D7E0E8",
    margin: 0,
  });
  s.addShape(pptx.ShapeType.line, {
    x: 0.9,
    y: 3.62,
    w: 1.1,
    h: 0,
    line: { color: C.accent, pt: 2.2 },
  });
  s.addText("2026.03.18  龙城CC创意街区沙龙", {
    x: 0.92,
    y: 4.2,
    w: 4.8,
    h: 0.3,
    fontFace: "Microsoft YaHei",
    fontSize: 11,
    color: "BBC7D1",
    margin: 0,
  });
  s.addText("关键词", {
    x: 8.65,
    y: 1.16,
    w: 1.0,
    h: 0.2,
    fontFace: "Microsoft YaHei",
    fontSize: 11,
    color: C.white,
    bold: true,
    margin: 0,
  });
  ["效率", "判断", "协作", "转型"].forEach((word, idx) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 8.62 + (idx % 2) * 1.45,
      y: 1.6 + Math.floor(idx / 2) * 0.88,
      w: 1.16,
      h: 0.46,
      rectRadius: 0.08,
      line: { color: C.white, transparency: 100 },
      fill: { color: idx % 2 === 0 ? C.accent : C.teal, transparency: 6 },
    });
    s.addText(word, {
      x: 8.62 + (idx % 2) * 1.45,
      y: 1.72 + Math.floor(idx / 2) * 0.88,
      w: 1.16,
      h: 0.16,
      align: "center",
      fontFace: "Microsoft YaHei",
      fontSize: 11,
      bold: true,
      color: C.white,
      margin: 0,
    });
  });
  s.addText("20分钟观点分享", {
    x: 8.7,
    y: 4.92,
    w: 2.3,
    h: 0.3,
    fontFace: "Microsoft YaHei",
    fontSize: 18,
    bold: true,
    color: C.white,
    margin: 0,
  });
  s.addText("不讲复杂技术，重点讲 AI 已经怎样进入我们的工作和生活。", {
    x: 8.7,
    y: 5.42,
    w: 2.62,
    h: 0.8,
    fontFace: "Microsoft YaHei",
    fontSize: 11,
    color: "E4EDF3",
    margin: 0,
    valign: "top",
  });
  finishSlide(s, 1, { checkOverlap: false });
}

function slide2() {
  const s = pptx.addSlide();
  addBg(s, C.mist);
  addTopBand(s, "为什么今天大家都在谈 AI", "NOW");
  s.addText("AI 已从“新概念”进入“可使用阶段”。", {
    x: 0.72,
    y: 1.95,
    w: 5.8,
    h: 0.45,
    fontFace: "Microsoft YaHei",
    fontSize: 21,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  addBulletList(s, [
    "它不再只属于科技公司，而是在进入各行各业。",
    "真正的变化，不是看见 AI，而是开始把 AI 放进流程。",
    "从搜索、整理、写作到分析，越来越多工作正被重新分工。"
  ], { x: 0.9, y: 2.75, w: 5.7, fontSize: 18, gap: 0.72 });
  addMetricCard(s, 7.2, 1.98, 2.55, 1.9, { main: C.accent, soft: C.accentSoft, bg: C.white }, "01", "工具可用", "AI 已经从概念展示进入个人与组织可直接上手的阶段。");
  addMetricCard(s, 9.95, 1.98, 2.55, 1.9, { main: C.teal, soft: C.tealSoft, bg: C.white }, "02", "场景扩散", "从写材料到做方案，AI 开始覆盖高频工作场景。");
  addMetricCard(s, 7.2, 4.18, 2.55, 1.9, { main: C.gold, soft: C.goldSoft, bg: C.white }, "03", "角色重排", "人负责判断与取舍，AI 负责整理与生成。");
  addMetricCard(s, 9.95, 4.18, 2.55, 1.9, { main: C.ink, soft: C.line, bg: C.white }, "04", "速度优势", "谁更早把 AI 变成方法，谁就更早建立效率差。");
  finishSlide(s, 2);
}

function slide3() {
  const s = pptx.addSlide();
  addBg(s, C.white);
  addTopBand(s, "AI 先改变的是工作方式", "FLOW");
  s.addText("过去", {
    x: 0.92,
    y: 2.0,
    w: 1.2,
    h: 0.3,
    fontFace: "Microsoft YaHei",
    fontSize: 18,
    bold: true,
    color: C.slate,
    margin: 0,
  });
  s.addText("现在", {
    x: 7.18,
    y: 2.0,
    w: 1.2,
    h: 0.3,
    fontFace: "Microsoft YaHei",
    fontSize: 18,
    bold: true,
    color: C.accent,
    margin: 0,
  });
  const left = [
    "人找资料",
    "人做整理",
    "人出结果"
  ];
  const right = [
    "AI 先生成",
    "人再判断",
    "人做修正与整合"
  ];
  left.forEach((t, i) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.9,
      y: 2.55 + i * 1.12,
      w: 2.45,
      h: 0.68,
      rectRadius: 0.08,
      line: { color: C.line, pt: 1.2 },
      fill: { color: "F7F9FB" },
    });
    s.addText(t, {
      x: 1.2,
      y: 2.77 + i * 1.12,
      w: 1.9,
      h: 0.18,
      fontFace: "Microsoft YaHei",
      fontSize: 16,
      color: C.ink,
      margin: 0,
      align: "center",
    });
  });
  right.forEach((t, i) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.12,
      y: 2.55 + i * 1.12,
      w: 3.0,
      h: 0.68,
      rectRadius: 0.08,
      line: { color: i === 0 ? C.accentSoft : C.tealSoft, pt: 1.2 },
      fill: { color: i === 0 ? "FFF4EE" : "EEF8F9" },
    });
    s.addText(t, {
      x: 7.42,
      y: 2.77 + i * 1.12,
      w: 2.4,
      h: 0.18,
      fontFace: "Microsoft YaHei",
      fontSize: 16,
      color: C.ink,
      margin: 0,
      align: "center",
    });
  });
  for (let i = 0; i < 3; i++) {
    s.addShape(pptx.ShapeType.chevron, {
      x: 4.25,
      y: 2.65 + i * 1.12,
      w: 1.65,
      h: 0.5,
      line: { color: C.accent, transparency: 100 },
      fill: { color: C.accent, transparency: 5 },
    });
  }
  s.addText("工作重点正从“重复执行”转向“判断与整合”。", {
    x: 0.92,
    y: 6.38,
    w: 10.3,
    h: 0.35,
    fontFace: "Microsoft YaHei",
    fontSize: 20,
    bold: true,
    color: C.deep,
    margin: 0,
  });
  finishSlide(s, 3);
}

function slide4() {
  const s = pptx.addSlide();
  addBg(s, C.mist);
  addTopBand(s, "AI 对个人工作的三类价值", "VALUE");
  addMetricCard(s, 0.86, 2.05, 3.65, 3.55, { main: C.accent, soft: C.accentSoft, bg: C.white }, "A", "提效", "减少重复劳动，缩短搜集资料、整理内容和形成初稿的时间。");
  addMetricCard(s, 4.84, 2.05, 3.65, 3.55, { main: C.teal, soft: C.tealSoft, bg: C.white }, "B", "提质", "帮助梳理结构、优化表达，让输出更完整、更有条理。");
  addMetricCard(s, 8.82, 2.05, 3.65, 3.55, { main: C.gold, soft: C.goldSoft, bg: C.white }, "C", "拓边界", "让非专业人士也能完成部分专业工作，比如数据分析、脚本编写和内容制作。");
  s.addText("原来要花半天完成的准备工作，现在往往可以在 30 分钟内拿到一个可用初稿。", {
    x: 0.92,
    y: 6.25,
    w: 11.3,
    h: 0.35,
    fontFace: "Microsoft YaHei",
    fontSize: 18,
    color: C.ink,
    margin: 0,
    align: "center",
  });
  finishSlide(s, 4);
}

function slide5() {
  const s = pptx.addSlide();
  addBg(s, C.white);
  addTopBand(s, "AI 已经进入高频工作场景", "USE CASES");
  const cards = [
    { x: 0.92, y: 2.0, w: 2.8, h: 2.15, title: "会议纪要", tone: C.accent, bg: "FFF4EE", desc: "自动提炼重点、结论与待办，让会后跟进更清楚。" },
    { x: 3.96, y: 2.0, w: 2.8, h: 2.15, title: "写 PPT", tone: C.teal, bg: "EEF8F9", desc: "搭框架、写标题、梳理逻辑，让表达更完整。" },
    { x: 7.0, y: 2.0, w: 2.8, h: 2.15, title: "数据整理", tone: C.gold, bg: "FEF8E8", desc: "做清洗、归类、汇总和初步分析，提升可读性。" },
    { x: 10.04, y: 2.0, w: 2.2, h: 2.15, title: "AI 编程", tone: C.ink, bg: "F4F7F9", desc: "写脚本、查问题、做自动化与原型验证。" },
  ];
  cards.forEach((card) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: card.x,
      y: card.y,
      w: card.w,
      h: card.h,
      rectRadius: 0.08,
      line: { color: card.tone, pt: 1.2 },
      fill: { color: card.bg },
    });
    s.addShape(pptx.ShapeType.rect, {
      x: card.x,
      y: card.y,
      w: card.w,
      h: 0.22,
      line: { color: card.tone, transparency: 100 },
      fill: { color: card.tone },
    });
    s.addText(card.title, {
      x: card.x + 0.18,
      y: card.y + 0.42,
      w: card.w - 0.36,
      h: 0.25,
      fontFace: "Microsoft YaHei",
      fontSize: 16,
      bold: true,
      color: C.ink,
      margin: 0,
    });
    s.addText(card.desc, {
      x: card.x + 0.18,
      y: card.y + 0.92,
      w: card.w - 0.36,
      h: 0.78,
      fontFace: "Microsoft YaHei",
      fontSize: 11,
      color: C.inkSoft,
      margin: 0,
      valign: "top",
    });
  });
  s.addText("AI 最先落地的，不是宏大叙事，而是每天都会重复发生的具体工作。", {
    x: 0.92,
    y: 5.28,
    w: 11.4,
    h: 0.35,
    fontFace: "Microsoft YaHei",
    fontSize: 20,
    bold: true,
    color: C.deep,
    margin: 0,
    align: "center",
  });
  addBulletList(s, [
    "这些场景的共同特点是：信息量大、重复度高、需要先整理后判断。",
    "所以 AI 的价值，不只是省时间，更是把人的注意力释放到更重要的决定上。"
  ], { x: 1.38, y: 6.05, w: 10.2, fontSize: 15, gap: 0.56, bulletColor: C.teal });
  finishSlide(s, 5);
}

function slide6() {
  const s = pptx.addSlide();
  addBg(s, C.deep);
  addSectionQuote(s, "AI 也在改变我们的生活方式。", "从学习、信息获取到内容生产，普通人第一次拥有了“全天候助手”。");
  s.addShape(pptx.ShapeType.roundRect, {
    x: 8.55,
    y: 1.55,
    w: 3.7,
    h: 4.3,
    rectRadius: 0.1,
    line: { color: "2A4458", pt: 1.2 },
    fill: { color: "1A3447" },
  });
  addBulletList(s, [
    "学习更个性化，随时可以获得解释与辅导",
    "信息获取更直接，不必层层检索和筛选",
    "内容创作门槛更低，普通人也能做图文和视频"
  ], { x: 8.9, y: 2.1, w: 3.0, fontSize: 15, gap: 0.88, bulletColor: C.accent, color: C.white });
  finishSlide(s, 6);
}

function slide7() {
  const s = pptx.addSlide();
  addBg(s, C.mist);
  addTopBand(s, "AI 带来的新问题", "RISK");
  const issues = [
    { title: "准确性", desc: "AI 可能说得像真的，但并不一定是真的。", tone: C.accent, bg: "FFF4EE" },
    { title: "隐私与安全", desc: "输入内容可能涉及企业或个人敏感信息。", tone: C.teal, bg: "EEF8F9" },
    { title: "版权与合规", desc: "生成内容的边界仍需谨慎，不能直接拿来即用。", tone: C.gold, bg: "FEF8E8" },
    { title: "依赖风险", desc: "过度依赖可能削弱人的基本能力与判断质量。", tone: C.ink, bg: "FFFFFF" },
  ];
  issues.forEach((item, idx) => {
    const y = 1.98 + idx * 1.2;
    s.addShape(pptx.ShapeType.roundRect, {
      x: 1.02,
      y,
      w: 11.25,
      h: 0.88,
      rectRadius: 0.08,
      line: { color: item.tone, pt: 1.1 },
      fill: { color: item.bg },
    });
    s.addText(item.title, {
      x: 1.32,
      y: y + 0.24,
      w: 1.8,
      h: 0.22,
      fontFace: "Microsoft YaHei",
      fontSize: 16,
      bold: true,
      color: C.ink,
      margin: 0,
    });
    s.addText(item.desc, {
      x: 3.24,
      y: y + 0.24,
      w: 8.22,
      h: 0.24,
      fontFace: "Microsoft YaHei",
      fontSize: 13,
      color: C.inkSoft,
      margin: 0,
    });
  });
  s.addText("会用 AI 和用对 AI，是两件不同的事。", {
    x: 1.04,
    y: 6.55,
    w: 11.2,
    h: 0.3,
    align: "center",
    fontFace: "Microsoft YaHei",
    fontSize: 18,
    bold: true,
    color: C.deep,
    margin: 0,
  });
  finishSlide(s, 7);
}

function slide8() {
  const s = pptx.addSlide();
  addBg(s, C.white);
  addTopBand(s, "AI 时代真正稀缺的能力", "HUMAN EDGE");
  const blocks = [
    { x: 0.92, title: "提问能力", desc: "能不能把问题说清楚，决定 AI 输出的上限。", color: C.accent, bg: "FFF4EE" },
    { x: 4.02, title: "判断能力", desc: "能不能识别对错、轻重和优先级，决定结果是否可靠。", color: C.teal, bg: "EEF8F9" },
    { x: 7.12, title: "整合能力", desc: "能不能把零散信息变成方案，决定输出是否可执行。", color: C.gold, bg: "FEF8E8" },
    { x: 10.22, title: "持续学习", desc: "能不能持续跟进工具变化，决定长期竞争力。", color: C.ink, bg: "F4F7F9" },
  ];
  blocks.forEach((b) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: b.x,
      y: 2.08,
      w: 2.2,
      h: 3.55,
      rectRadius: 0.08,
      line: { color: b.color, pt: 1.1 },
      fill: { color: b.bg },
    });
    s.addShape(pptx.ShapeType.rect, {
      x: b.x + 0.18,
      y: 2.26,
      w: 0.36,
      h: 0.14,
      line: { color: b.color, transparency: 100 },
      fill: { color: b.color },
    });
    s.addText(b.title, {
      x: b.x + 0.18,
      y: 2.6,
      w: 1.8,
      h: 0.26,
      fontFace: "Microsoft YaHei",
      fontSize: 16,
      bold: true,
      color: C.ink,
      margin: 0,
      align: "center",
    });
    s.addText(b.desc, {
      x: b.x + 0.18,
      y: 3.2,
      w: 1.84,
      h: 1.45,
      fontFace: "Microsoft YaHei",
      fontSize: 11,
      color: C.inkSoft,
      margin: 0,
      valign: "mid",
      align: "center",
    });
  });
  s.addText("AI 提高了下限，但真正拉开差距的，仍然是人的思考与判断。", {
    x: 1.0,
    y: 6.25,
    w: 11.2,
    h: 0.32,
    fontFace: "Microsoft YaHei",
    fontSize: 18,
    bold: true,
    color: C.deep,
    margin: 0,
    align: "center",
  });
  finishSlide(s, 8);
}

function slide9() {
  const s = pptx.addSlide();
  addBg(s, C.mist);
  addTopBand(s, "对企业、园区与地产转型的启发", "INDUSTRY");
  s.addText("未来竞争不只是空间供给，更是服务效率和运营能力。", {
    x: 0.92,
    y: 1.95,
    w: 8.5,
    h: 0.34,
    fontFace: "Microsoft YaHei",
    fontSize: 21,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  const cols = [
    {
      x: 0.96,
      title: "从物理空间",
      sub: "传统价值",
      items: ["租售与物业服务", "配套资源", "地理位置"],
      color: C.slate,
      bg: "FFFFFF",
    },
    {
      x: 4.54,
      title: "走向数字运营",
      sub: "效率升级",
      items: ["招商支持", "客户服务", "内容传播"],
      color: C.accent,
      bg: "FFF4EE",
    },
    {
      x: 8.12,
      title: "升级产业平台",
      sub: "长期方向",
      items: ["决策辅助", "企业协同", "创新生态连接"],
      color: C.teal,
      bg: "EEF8F9",
    },
  ];
  cols.forEach((col, idx) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: col.x,
      y: 2.55,
      w: 3.1,
      h: 3.2,
      rectRadius: 0.08,
      line: { color: col.color, pt: 1.2 },
      fill: { color: col.bg },
    });
    s.addText(col.title, {
      x: col.x + 0.24,
      y: 2.9,
      w: 2.6,
      h: 0.32,
      fontFace: "Microsoft YaHei",
      fontSize: 17,
      bold: true,
      color: C.ink,
      margin: 0,
      align: "center",
    });
    s.addText(col.sub, {
      x: col.x + 0.24,
      y: 3.35,
      w: 2.6,
      h: 0.2,
      fontFace: "Microsoft YaHei",
      fontSize: 10,
      color: col.color,
      bold: true,
      margin: 0,
      align: "center",
    });
    addBulletList(s, col.items, {
      x: col.x + 0.36,
      y: 4.0,
      w: 2.25,
      fontSize: 13,
      gap: 0.6,
      bulletColor: col.color,
    });
    if (idx < 2) {
      s.addShape(pptx.ShapeType.line, {
        x: col.x + 3.18,
        y: 4.15,
        w: 0.34,
        h: 0,
        line: { color: C.gold, pt: 1.6, beginArrowType: "none", endArrowType: "triangle" },
      });
    }
  });
  finishSlide(s, 9);
}

function slide10() {
  const s = pptx.addSlide();
  addBg(s, C.deep);
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.85,
    y: 0.92,
    w: 11.6,
    h: 5.65,
    rectRadius: 0.12,
    line: { color: "284355", pt: 1.2 },
    fill: { color: "163042" },
  });
  s.addText("结语", {
    x: 1.25,
    y: 1.45,
    w: 1.0,
    h: 0.26,
    fontFace: "Microsoft YaHei",
    fontSize: 13,
    color: C.accent,
    bold: true,
    margin: 0,
  });
  s.addText("AI 不会简单替代人，\n但会重构人与工具的分工。", {
    x: 1.25,
    y: 2.0,
    w: 6.2,
    h: 1.35,
    fontFace: "Microsoft YaHei",
    fontSize: 24,
    bold: true,
    color: C.white,
    margin: 0,
    breakLine: true,
  });
  addBulletList(s, [
    "未来的差距，不只是会不会用 AI，而是会不会把 AI 用进业务。",
    "越早理解、越早实践，就越容易在变化中占据主动。",
    "对个人如此，对企业、园区和地产转型也是如此。"
  ], { x: 1.3, y: 4.1, w: 6.2, fontSize: 15, gap: 0.68, bulletColor: C.teal, color: C.white });
  s.addShape(pptx.ShapeType.roundRect, {
    x: 8.55,
    y: 2.05,
    w: 2.85,
    h: 2.4,
    rectRadius: 0.1,
    line: { color: C.accent, pt: 1.2 },
    fill: { color: "1D3A4E" },
  });
  s.addText("谢谢", {
    x: 8.55,
    y: 2.65,
    w: 2.85,
    h: 0.38,
    align: "center",
    fontFace: "Microsoft YaHei",
    fontSize: 22,
    bold: true,
    color: C.white,
    margin: 0,
  });
  s.addText("欢迎交流", {
    x: 8.55,
    y: 3.22,
    w: 2.85,
    h: 0.24,
    align: "center",
    fontFace: "Microsoft YaHei",
    fontSize: 12,
    color: "D7E0E8",
    margin: 0,
  });
  finishSlide(s, 10);
}

async function main() {
  slide1();
  slide2();
  slide3();
  slide4();
  slide5();
  slide6();
  slide7();
  slide8();
  slide9();
  slide10();
  await pptx.writeFile({ fileName: OUT });
  console.log(`Wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
