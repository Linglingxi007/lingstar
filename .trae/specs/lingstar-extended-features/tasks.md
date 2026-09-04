# 梦语 · 传讯 扩展功能 - 实现计划 (tasks.md)

## Task 0: 前置基础修复与结构搭建（入口、持久化、侧栏分组）
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 确保 HTML 脚本语法通过 node --check；浏览器打开 Console 0 Error。
  - 在 side-panel / bottom-sheet 网格中新增「🎮 小游戏」大分组（标题条 + 子三项：✊ 猜拳奖惩 / 🎨 涂鸦板 / 🖌️ 你画我猜），与字卡/拍一拍/表情包 分组视觉分隔。
  - 侧栏补充缺失入口：📅 日历 · 📖 心情日记 · ✉️ 信封 · 📋 留言板 · 🌳 许愿树（若当前 HTML 没有，则补充这些入口按钮及对应弹窗壳）。
  - 统一持久化：新增 localStorage 命名空间 `dream_games = { rps_history:[], rps_stats:{}, doodles:[], draw_guess_history:[], draw_guess_topics:{...custom} }`；并在数据管理"导出/导入/清空"中包含该命名空间。
  - 小游戏统一 JS 常量：`DEFAULT_GAME_TOPICS = { 植物:[...], 动物:[...], ... }`、`RPS_DAILY_CAP = ∞ (无 cap)`、`DOODLE_MAX = 50`、`DRAW_GUESS_MAX = 200`。
- **Acceptance Criteria Addressed**: AC-0, FR-5.1~5.4, FR-0.2/0.3
- **Test Requirements**:
  - `rule` TR-0.1: `node --check lingstar.html's script.js` return code = 0；`browser_console_messages` 0 Error。证据：bash 输出 + console JSON。
  - `rule` TR-0.2: 侧栏 evaluate 输出所有入口按钮的 id 列表，包含 `sideBoardBtn / sideWishBtn / sideCalendarBtn / sideDiaryBtn / sideLetterBtn / sideRpsBtn (猜拳) / sideDoodleBtn / sideDrawGuessBtn` 或等价 DOM 结构。证据：evaluate JSON。
  - `rule` TR-0.3: 设置 → 数据管理「导出」包含 `dream_games` 字段，「清空」后 `dream_games = null`。证据：evaluate 导出 JSON。
  - `rubric` TR-0.4: 小游戏分组视觉区分度（维度 / 标尺 / 阈值参见 AC-11）。维度=「区分力」；1=完全没分组，3=只有 🎮 emoji，5=一眼可见分组；阈值>=4。证据：侧栏截图 + 人工打分。

## Task 1: 头像在气泡外（DOM/JS/CSS 重写）
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 0
- **Description**:
  - 重写 `.message / .msg-avatar / .msg-bubble` CSS 规则（见 spec FR-1）：flex row / align-end / gap 8px / 头像 30px 圆形白边阴影；`.message.user { justify-content:flex-end } .message.user > .msg-avatar { order:2 }`；system justify flex-start, avatar order=0。
  - pat 系统通知 `.message.pat-notice` 隐藏头像。
  - 修改 `addChatMessage(text, type)` 函数 DOM 构造：创建 wrapper=msgDiv(.message.type)，再创建 avatar=msg-avatar 与 bubble=msg-bubble 作为同级 msgDiv.children，bodyDiv / contentDiv / quoteDiv 等挂在 bubble 内部，⭐收藏 fav 挂在 bubble 上。
  - 修改 `applyBubbleStyle()` 尾巴伪元素的选择器：从 `.message.user::after` 改成 `.message.user .msg-bubble::after`，并且位置定位到紧贴气泡一侧（不与 avatar 重叠）。
- **Acceptance Criteria Addressed**: AC-1, FR-1.1~1.5
- **Test Requirements**:
  - `rule` TR-1.1: 发送一条消息，evaluate 结构：对 user/system 各一条，检查 `.message > .msg-avatar`（直接子节点）存在，`.message > .msg-bubble` 存在，`.msg-bubble > .msg-avatar` 不存在；user 的 avatar order != 0，system 的 avatar order = 0；user justify flex-end，system justify flex-start。证据：结构 JSON。
  - `rule` TR-1.2: 应用 sharp 气泡样式后，evaluate `.message.user .msg-bubble::after` / `.system` 的 border-left/bottom-left-radius 属性不为默认值（存在尾巴形状）。证据：evaluate CSS 属性。

## Task 2: 许愿树树形底板 + 随机星位 + 发光立体
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 0 (如果许愿树弹窗不存在需要在 Task 0 先补入口壳)
- **Description**:
  - 若不存在许愿树完整子系统（留言/许愿/每日5限/话语库/历史/回复+勾选），先按前版结构实现这些基础能力（可直接参照 handoff 的 DB 结构 + JS 逻辑）。
  - 重写许愿树 CSS：`.wish-tree` 容器中央放树干（`::before` / 独立元素 + 大 emoji 🌳 + 树冠 canvas 容器 `canopy-container` 采用 `border-radius: 55% 50% 50% 52% / 60% 60% 40% 45%` 的椭圆色块 + `-webkit-mask` 做不规则树冠边缘）。
  - `canopy-container` 是 `.star-item` 的定位容器（position relative），初始为空；每次「✨ 摘取星星」后，在树冠坐标内（以 0-1 比例随机 x=cosθ、y=sinθ 投影到椭圆）创建一个绝对定位的 star-item。
  - star-item: clip-path 五角星；径向渐变 `radial-gradient(circle at 30% 25%, #fff - 中心亮色%, color-main 55%, color-deep 100%)`；6 色各一套；box-shadow=`0 0 16px rgba(light color, 0.55), 0 0 32px rgba(light color, 0.22)`；`drop-shadow` 叠一层。
  - 随机尺寸：width/height ∈ [60,92]px，旋转角 ± 15°（离散）；z-index 堆叠交替。
  - 未读小红点：position absolute，位于 star clip-path 右上角。
  - 回复写入聊天时调用 sendReplyToChat(wish=true) 函数，构造包含 `ws-quote-block`（原愿望引用块）的复合消息。
- **Acceptance Criteria Addressed**: AC-2, FR-2.1~2.9, G8 部分引用封装
- **Test Requirements**:
  - `rule` TR-2.1: 打开许愿树 evaluate `.star-grid .star-item`（或 canopy 中 star-item）初始 count = 0；点击摘取 6 次后 count = 5，第 6 次按钮 disabled。证据：evaluate count。
  - `rule` TR-2.2: 每颗星星 clip-path 等于 5 角星 polygon；box-shadow 含有 rgba(...) 双环发光；树冠中所有 star-item 的 (x,y) 都在树冠椭圆公式内（以中心+半长轴+半短轴判定）。证据：clip-path 文本 + 坐标+椭圆判定。
  - `rule` TR-2.3: 勾选回复发送聊天并提交 → evaluate 聊天最后一条消息 html 内含有"原愿望"+"回复" 两段 + 原正文内容（非空字符串）。证据：聊天消息 html。

## Task 3: 留言板书页纹理 + 便利贴形状 + 回复引用
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 0 (若留言板系统不存在，先按前版结构补全基础能力：每日 5 限 + 话语库 + 历史 + 回复表单)
- **Description**:
  - 书页纹理三态：
    - 横格：linear-gradient 横向细密有色间隔（18px 间距），左侧一条红色装订线。
    - 网格：`background-image: linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, same)`，background-size=18px。
    - 空白页：纯色浅白背景，边角泛黄渐变。
  - 工具栏有切换器（横格/网格/空白），选择保存到 `dream_appearance.board_boardStyle`。
  - `.board-note`：便利贴形态。使用右上角 clip-path+伪元素创建折角，或 `clip-path: polygon(0% 0%, 88% 0, 100% 12%, 100% 100%, 0 100%)` + 一个"折起来"的小三角背景叠加。
  - 便利贴颜色随主题：odd `--board-note-bg`，even `--board-note-bg-alt`（双色渐变交替）；rotate ±1~3°（3n+1/3n+2/3n+3 不同旋转）。
  - 未读红点 + emoji 头 + 时间戳 + 回复标记；点击展开详情 `.board-detail` 使用 `--board-detail-bg`。
  - 回复表单"写入聊天"勾选后：构造包含 `bd-quote-block` 原留言引用块 + 梦角回复段的复合消息。
- **Acceptance Criteria Addressed**: AC-3, FR-3.1~3.7, G8
- **Test Requirements**:
  - `rule` TR-3.1: 三态切换后 evaluate `.board-grid` 容器 `backgroundImage` 分别匹配「横格」「网格」「空白」关键字。证据：CSS 属性。
  - `rule` TR-3.2: evaluate 前 3 个 `.board-note` 的 clip-path 字符串含有折角形状（88% 0, 100% 12% 或等价折角参数），background 依次取两套不同变量，transform: rotate 的绝对值 ∈ [0.5, 3.5]。证据：note 属性 JSON。
  - `rule` TR-3.3: 勾选回复发送聊天并提交 → evaluate 聊天最后一条 html 有"原留言"段 + 梦角回复段，原文非空。证据：聊天消息 html。

## Task 4: 6+ 主题统一体系 + 保存方案（主题不封顶）
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 0
- **Description**:
  - `:root` 中定义 30+ 语义 CSS 变量（前版约定）：基础 12 色 + 透明度 6 变量 + 侧栏 3 / 留言板 4 / 许愿树 2 / 弹窗边 1 / 按钮 2 / 输入环 1 / shadow-card 1 / text-muted / bg-card / bg-input-focus。
  - THEME_PRESETS 至少 6 套完整配色（zisakura/seasalt/caramel/mistforest/sakura/amber），每套都填 30+ 变量。
  - `applyThemeVariables(vars)` 把所有变量 `setProperty`；`getCurrentThemeVars()` 全部反读；`saveCurrentThemeToStorage()` 保存到 localStorage。
  - 快速 swatches HTML：4 列 × 7 格（6 预设 + 1 自定义），每个都有渐变预览背景 + 中文 tooltip。
  - 「📁 主题方案 → ➕ 保存当前」：将 `getCurrentThemeVars()` + 自定义 name 存入 savedThemePresets；主题方案列表可"应用 / 覆盖 / 删除"。
  - 所有 CSS 选择器都使用语义变量（如 Task 1/2/3 的样式所述）。
- **Acceptance Criteria Addressed**: AC-4, AC-5, FR-4.1~4.9, NFR-2
- **Test Requirements**:
  - `rule` TR-4.1: 依次点击 6 个预设 swatches → evaluate 7 项变量，与 THEME_PRESETS 原值 42 项比对一致。证据：6×7 对照表。
  - `rule` TR-4.2: 自定义编辑器随机改 3 个颜色 + 滑杆 2 个 → 保存为"测试方案"→ evaluate savedThemePresets 包含该条 → 刷新 → 重新应用 → evaluate 7 项变量回到保存值。证据：保存前后快照。
  - `rubric` TR-4.3: 色调统一维度（参见 AC-10）阈值≥4。证据：每套主题截图（侧栏+留言+许愿+设置拼接）+人工打分。

## Task 5: 小游戏弹窗/入口搭建 + localStorage 统一入口
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 0
- **Description**:
  - 创建 3 个 `modal-overlay.sub-modal`：猜拳 `rpsModal`、涂鸦板 `doodleModal`、你画我猜 `drawGuessModal`。
  - 三个弹窗统一有：大 heading + 关闭按钮 + modal-body 区域；ESC 可关。
  - `loadGamesStorage()` 读 `dream_games`；`saveGamesStorage()` 写。
  - 数据管理的"导出 JSON / 导入 JSON / 清空所有数据"包含 dream_games。
- **Acceptance Criteria Addressed**: FR-5 / FR-0.3
- **Test Requirements**:
  - `rule` TR-5.1: 点击侧栏三个小游戏入口，三个弹窗依次打开；evaluate `document.querySelectorAll('.modal-overlay.sub-modal.active')` 分别能匹配到对应 ID。刷新后猜拳历史仍存在（写入过的情况下）。证据：active modal ID。

## Task 6: 猜拳奖惩小游戏（两种模式 + 切换弹窗 + 历史/统计）
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 5
- **Description**:
  - UI：顶部 tabs（模式 A / 模式 B） + 角色切换（梦女 / 梦角）。
  - 切换确认弹窗：从"梦女普通"切换到「梦角想要玩双方奖惩」时触发 → confirmModal → 系统消息写入聊天（同步告知梦角）。
  - 出拳：✊ ✌️ ✋ 三个按钮，梦女先选 → 0.8~2s 后模拟梦角随机出拳 → 判定胜方。
  - 奖惩输入：模式 A = 赢方弹出输入框（类型 奖励/惩罚 切换 + textarea）；模式 B = 梦角永远是奖惩制定者（无论胜负），禁用梦女输入框。
  - 历史列表：时间倒序，每一条包含 双方出拳 emoji + 胜方 + 模式 + 奖励/惩罚文本 + 时间戳；可清空，可导出 JSON。
  - 积分板：梦女胜 / 梦角胜 / 平局 / 总数 / 胜率，以及模式 A/B 各自独立。
- **Acceptance Criteria Addressed**: AC-6, FR-6.1~6.9
- **Test Requirements**:
  - `rule` TR-6.1: 角色→模式切换触发弹窗（snapshot 含有"梦角想要开启双方奖惩"的文字）；同意后 evaluate 聊天最新一条系统消息含有"梦女同意"或同义。证据：snapshot 文本 + 聊天消息 JSON。
  - `rule` TR-6.2: 连续进行 3 轮（1 胜 1 负 1 平），evaluate dream_games.rps_history 长度 3，每一轮的 winner 字段与实际出拳比对逻辑一致；积分板数字匹配。模式 A 下输方奖惩输入框 disabled（仅赢方可写），模式 B 下仅梦角输入框 enabled。证据：history JSON + enabled 属性。
  - `rule` TR-6.3: 刷新后历史与积分板数字保持不变。证据：刷新前后 evaluate JSON 一致。

## Task 7: 涂鸦板（Canvas 绘画 + 保存 + 画廊 + 发送到聊天）
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 5
- **Description**:
  - Canvas 800×500 DPR-aware。工具栏：画笔大小（1~24）、颜色（调色板 16 色 + 任意色 hex）、工具（铅笔/马克笔/橡皮擦）、撤销 / 重做 / 清空 / 保存。
  - `undoStack` 深度 50，每次鼠标 up 入栈。
  - 保存：生成 dataURL，连同 author、title、timestamp、size 存到 dream_games.doodles。满 50 覆盖最旧。
  - 画廊：4 列网格，点击放大，显示作者/标题/时间。
  - 「💬 发送到聊天」：在 addChatMessage 中新增"画图消息"类型，渲染 缩略图 `<img src=thumbsrc onclick=openBig>` → 点击打开大图 overlay。
  - 主题联动：canvas wrapper 背景=--wish-detail-bg，工具栏按钮=--btn-primary-bg。
  - 同时支持 mousedown/move/up 与 touchstart/move/end。
- **Acceptance Criteria Addressed**: AC-7, FR-7.1~7.7
- **Test Requirements**:
  - `rule` TR-7.1: 梦女在 Canvas 上拖动画出一条对角线（evaluate 用 CanvasRenderingContext2D.getImageData() 在对角线上取 5 点非透明像素>0），撤销后同位置全透明。梦女保存 1 张、切梦角保存 1 张 → evaluate dream_games.doodles.length = 2。刷新后仍是 2。证据：getImageData 结果 + doodles 列表。
  - `rule` TR-7.2: 点击画廊一张"发送到聊天" → evaluate 聊天最后一条消息含有 `<img`，src 以 data:image 开头；点击后出现大图 overlay（display!='none'）。证据：聊天消息 + overlay active。

## Task 8: 你画我猜（两种模式 + 切换确认 + 话题库可扩展 + 记录）
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 5, Task 7（复用 Canvas 绘制工具精简版）
- **Description**:
  - 模式切换：自由画 / 话题限定（tabs）。
  - 角色切换（梦女 / 梦角）+ 跨模式弹窗：从"梦角·话题限定"切到「梦角·自由画」时触发 confirmModal「梦角想要玩无话题自由画…是否同意」→ 系统消息同步到聊天告知梦角。
  - 话题库：`DEFAULT_DRAW_TOPICS = { 植物:[...], 动物:[...], 水果:[...], 景物:[...], 食物:[...], 事物:[...] }`；可在"话题管理"弹窗增删分类+分类下的词。
  - 回合流程：出题方出题（自由画=输入；话题限定=抽分类抽词）→ 倒计时显示 → 出题方画画（Task 7 精简版 canvas）→ 猜题方输入答案 → 匹配（`answer.trim().toLowerCase()` 含同义词命中）→ 命中胜局，或者超时揭晓答案。
  - 角色轮换：每局结束后下一局出题方自动换。
  - 历史：`dream_games.draw_guess_history[]` 保存每轮全部字段（含缩略图 dataURL）。
  - 积分板：梦女答对 / 梦角答对 / 总轮数。
  - 模式 A/B 各记录。
- **Acceptance Criteria Addressed**: AC-8, FR-8.1~8.9
- **Test Requirements**:
  - `rule` TR-8.1: 模式切换触发 confirmModal（含有"梦角想要玩无话题"的文本）；同意后聊天系统消息含"梦女同意"；话题管理"添加分类→添加词"生效，新一轮话题限定能抽到新增词。证据：snapshot/聊天/话题词库 JSON。
  - `rule` TR-8.2: 完整走 2 轮（话题限定+自由画各 1 轮），evaluate dream_games.draw_guess_history 含有 2 条完整记录（题目/答案/缩略图非空）；积分板数字累加。刷新后记录仍在。证据：history JSON + 积分板数字。
  - `rule` TR-8.3: 命中答案（输入正确词）时 evaluate 显示"答对了🎉"标记，积分+1；超时后 evaluate 显示"本轮答案"揭晓文本。证据：文本匹配。

## Task 9: 留言/许愿回复发送到聊天附带原引用块
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2, Task 3
- **Description**:
  - 统一封装函数 `sendReplyToChat({type, original, reply})`：
    - type='board' → `<div class="bd-quote-block"><span class="bq-title">📋 原留言</span><div class="bq-body">原留言正文</div></div><div class="bd-reply-block"><span class="bq-title">💬 梦角回复</span>...</div>`
    - type='wish' → `ws-quote-block`（同上结构但是 🌟 原愿望 + 色彩/分类 tag）
  - 在留言板回复提交 handler 中：若 `bd-send-chat` checkbox 被勾选 → 调 sendReplyToChat({type:'board', ...})；同理许愿树回复 ws send-chat → sendReplyToChat({type:'wish'})。
  - 复合消息写入 addChatMessage 时以"system/梦角"类型加入 chatBox，引用块 + 回复段视觉上分层（引用块边框左色/半透明背景/小字号小标题）。
- **Acceptance Criteria Addressed**: AC-9, FR-9.1~9.4
- **Test Requirements**:
  - `rule` TR-9.1: 留言板勾选回复发送 → evaluate 聊天最后一条消息 html 同时存在 `.bd-quote-block` + `bd-reply-block`，且原留言正文与提交的原文相等。许愿树同理 `.ws-quote-block`。证据：DOM html。
  - `rule` TR-9.2: 引用块含有明确小标题"原留言/原愿望"和"回复"。CSS 检查引用块 `border-left-color = color-mix(--accent)` 或直接使用 accent 色。证据：CSS 属性。

## Task 10: 整体 E2E 浏览器验证 + 修复问题
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1-9 全部
- **Description**:
  - 启动 python -m http.server 8765；browser 打开 lingstar.html，执行所有 AC 测试用例（代码检查/头像/许愿树/留言板/6 主题/自定义主题/猜拳全流程/涂鸦/你画我猜/引用块）。
  - 每项测试收集命令输出为证据；若 AC rubric 打分未达阈值，回到对应 Task 修复颜色/布局/样式。
  - 刷新页面验证持久化。
  - 最终 Console 0 Error。
- **Acceptance Criteria Addressed**: AC-0~AC-9, AC-10/AC-11 rubrics
- **Test Requirements**:
  - `rule` TR-10.1: Console 0 Error；所有 10 条 AC 的 rule 类 TR 全部一次通过。证据：完整 browser test 输出记录 + 截图。
  - `rubric` TR-10.2: AC-10/AC-11 阈值≥4。证据：人工打分记录。
