---
name: "lingstar-chat-settings-fixer"
description: "在 lingstar.html 单文件 IIFE 聊天应用中按标准化 7 步流程定位+修复 聊天/日记/日历/写信/字卡/回信/已读回执/提示音/头像 等开关设置类 bug，内置语法校验命令和 14 项浏览器验证清单。当用户要求修复梦语·传讯的任何功能开关无效、或调整聊天回复规律、或美化日历/日记 UI 时调用。"
---

# 梦语·传讯 聊天设置批量修复器（Lingstar Chat Settings Fixer）

本 Skill 把 **13+ 项聊天/日记/日历/写信设置修复** 从"盲 grep → 反复改 → 爆 bug → 重改"的人肉流程固化为一套可复用的 **7 步 SOP**，适用于单文件 `lingstar.html`（style + HTML 模板 + IIFE `<script>`，300KB+ 字节）。

---

## 🎯 何时调用本 Skill

当用户提出以下任一诉求时，**立即加载本 Skill** 按 SOP 执行：

| 触发关键词举例 |
|---|
| 修复 XX 开关无效 / 功能没生效 / 打开了没反应 |
| 改 已读回执 / 引用回复 / 长按 / 点击消息 / 工具栏 的行为 |
| 调整 字卡回复速度 / 抽字卡方式 / 拼字卡 / 表情混 / 颜文字混 |
| 已读不回 / 显示头像 / 自定义回信规律 （这些是典型 checkbox） |
| 消息提示音 / 通话提示音 （Audio/Web Audio 相关） |
| 主动写信 / 时空来信 / 改时间单位为分钟 （定时器 + slider + select） |
| 美化日历跳转按钮 / 心情日记快捷行 / 子弹窗（纯 CSS/HTML） |
| 用户附截图显示"🕹 跳转竖排丑"或"快捷行全是字卡想换 emoji" |

---

## 📐 架构事实（必须熟记，省 30% 时间）

1. **全部 JS 在 IIFE 私有**：`typeof replyWithRandomCard === 'undefined'` 在 DevTools 顶层是正常现象，不能用来证明函数不存在。**唯一有效证据**：chatBox 初始系统消息文字（"字卡已备好"）+ dispatchEvent 后 DOM className 变化 + `console_messages() === 0 error`。
2. **单文件分层**：
   - HTML 模板起点：`<body>` （`</body>` 在脚本尾后，现约 L9408）
   - IIFE `<script>` 起点：约 L3774；`})();` 终点：约 L9402
   - CSS `<style>` 起点：`<head>` 中
3. **梦角消息过去一直发 `type='system'`（历史 Bug）**：新增回复一律要改成 `type='angle'`，否则头像灰、昵称错、提示音不触发。
4. **saveAppearance() 白名单**：不要把 `replyTimer / letterTimer / typingTimer` 这些运行时句柄序列化进 `dream_appearance`，它们存 localStorage 会变 `{}` 或报错。只存 scalar/obj 配置值（chatMergeCards, chatLetterMin 等——这些已经在白名单里了不用改）。

---

## 🚀 SOP 标准 7 步流程

### 第 1 步：一次性 grep 全定位（8 个模式并行，≤30 秒）
```
pattern 目的：
- 函数声明：/^        function addChatMessage\(/
              /^        function replyWithRandomCard\(/
              /^        function handleSend\(/
              /^        function showQuoteBar\(/
              /^        function init\(\);?\s*$/  (找到入口点，决定哪里加 restartLetterTimer)
- 变量区：  /let chatLetterMin = / /let chatSoundMsg = / /let replyDelayMin = / /let chatShowAvatar = /
- 旧委托：  /chatBox\.addEventListener\(\'(click|contextmenu)\'/
- HTML：    /chatLetterMinSlider/ /id=\"sndMsg\"/ /id=\"calJumpBtn\"/
- 绑定：    /bindSlider\(\'chatLetter/ /syncSlider\(\'chatLetter/
- reset：   /resetClearAll/ 附近
- 触发：    /bottomCallBtn\.addEventListener/ /openModal\(callModal\)/
```
并行发完拿到行号后，再开始 Edit。**不要边 grep 边 Edit**（容易漏改）。

### 第 2 步：轻量 UI 非冲突 Edit 并行批（≤12 个）
下列修改互相**不共用行号**，可以一次 `Edit × N` 并行发（省时间）：
- 日记 quickRow：`renderQuickRow()` 删除 sampleWords(cardLibrary)，只留 emoji 12 条
- 日历 calJumpBtn HTML：按钮内 `"🕹 跳转"` → `"🕹"` + `title="跳转到日期"`（防竖排）
- 日历 `.cal-jump-btn` + `.cal-nav` CSS：加 `flex-wrap:nowrap gap:4px`，按钮改 `34×34px flex center`
- 写信变量声明行：改 `chatLetterMin = 15/minute; chatLetterMax = 60/minute`（之前 hour/day）
- 写信 resetClearAll：同上默认值也改回 15/minute 60/minute
- 写信 HTML `<select>`：加 `<option value="minute">分钟</option>` 且 `selected`
- 写信 HTML `<input range min/max/value>`：min=1/2, max=180/480, value=15/60（之前 1-48 hour）
- Audio 元素：在 `</body>` 前加 `<audio id=sndMsg><audio id=sndCall>` 占位
- IIFE 声明区加运行时句柄：`let replyTimer = null, letterTimer = null;`（避免未声明就 clearTimeout crash）

完成后先跑**语法校验**（见第 6 步）——这批次几乎不可能出错。

### 第 3 步：核心函数 3 个重写（逐个串行 Edit）
这 3 个函数行号近，且共享 quoteMsg / replyDelayMin 等变量，**必须串行**以免 edit old_string 不一致：

#### 3a. addChatMessage 重写要点
1. **头像 if(chatShowAvatar)**：保留原来的 if 分支（已正确），else 什么都不做（天然"关了就不渲染"）
2. **引用 click toggle**：`msgDiv.addEventListener('click')` → 同一条 `_key = mid|text.slice(0,30)` 比过则 `clearQuoteBar()`（取消），否则 `quoteMsg={_key,sender,text,msgId}` + `showQuoteBar(sender, text)`。必须 `ev.stopPropagation()` 防止冒泡到 chatBox 空点击委托。
3. **工具栏 contextmenu**：`msgDiv.addEventListener('contextmenu')` → `ev.preventDefault()+stopPropagation()` → 调 `openMsgToolbar(msgDiv, ev)`（移动端长按也会触发 contextmenu 事件）
4. **已读回执初始状态 + setTimeout 改已读**：用户消息 meta 里 `<span id=mid-read>` 初始写 `✓`（graphic）或 `未读`（text），然后 `setTimeout(1500+rand×3500, ()=>getElementById 改成 ✓✓/已读 紫色)`。**必须通过 id 找元素**，不能改 meta.innerHTML 变量。
5. **消息提示音**：`type==='angle'` 或（system 但 sender='angle'）&& chatSoundMsg 开 → `playSfx('msg')`。

#### 3b. replyWithRandomCard 重写要点
1. **总开关 chatCustomReplyRule**：顶部 `const useRule = !!chatCustomReplyRule;`，决定 effPickMode/effMerge/effEmoji/effKao 4 个有效配置。OFF → 强制 simple random 一张，不 merge/mix；ON → 下面全套生效。
2. **封装 pickOne()**：内部根据 effPickMode（sequence/norepeat/random）抽一张字卡，避免 merge=2-5 时写 4 遍同样逻辑
3. **拼字卡 chatMergeCards**：`count = 2 + floor(rand*4)` → `for(j=0;j<count;j++) parts.push(pickOne())` → `join( rand<0.5 ? '，' : '\n' )`
4. **梦角称呼 angleCallChance**：保留原逻辑（30% 概率从 angleCallsUser 抽一条放 msg 头部）
5. **表情混入 chatEmojiMix**：60% 概率 → 摊平 `for(g in emojiGroups) flat.push(...emojiGroups[g])` → roll=35% 前插 / 35% 后插 / 30% 中插（中间按换行或逗号切 chunk 中间位置 splice 插入；无法切就按字符串一半位置插）
6. **颜文字混入 chatKaomojiMix**：50% 概率 → 摊平 kaomojiGroups → 70% `\n` + k / 30% ` ` + k
7. **结尾发消息 type='angle'**：把原来的 `'system'` 全部替换成 `'angle'`，否则上面 3a 里判断 type==='angle' playSfx 永远不触发

#### 3c. handleSend 重写要点
1. chatReadNoReply 概率：25% → **45%**（用户反馈原概率太小"已读不回"不像真的）。return 前不做别的，addChatMessage 里的独立 setTimeout 仍会把消息变 ✓✓ 已读（这是用户要求的"即使不回也标已读"）
2. delay 计算：`baseSpeed = floor(chatReplySpeed)` → `minD = max(100, floor(min(rDM||0,rDX||0)))` → `maxD = max(minD+200, floor(max(...)))` → `delay = baseSpeed + minD + floor(rand × max(1,maxD-minD))`
3. **clearTimeout(replyTimer)**：每次重新设之前先清旧的，避免用户连发 3 条 → 梦角连着回 3 条刷屏
4. send 后自己的"输入提示音"：`if (chatSoundMsg) playSfx('send');`（可选，高频 1200Hz 短滴即可）

### 第 4 步：主动写信 4 个新函数 + HTML/绑定同步
1. **写位置**：`init()` 之前，放在 shade/hexToRgba 工具函数区前面最好
2. **`__letterUnitMs(val, unit)`**：minute→`*60000`, hour→`*3.6e6`, day→`*86400000`，默认分钟
3. **`randLetterDelay()`**：a=min 算 ms，b=max 算 ms → `[lo,hi]=[Math.min(a,b), Math.max(a,b)]` → `return max(5000, lo + floor(rand × max(1, hi-lo)))`（**最小 5 秒**，防止 0 或负值导致无限递归写信爆炸）
4. **`deliverAutoLetter()`**：
   - 顶部如果 `!chatLetterEnabled` 就 restartLetterTimer() return
   - titles 数组抽一条（`['想你了','碎碎念','梦里见','写给你','今天的我','月光下','给你的信',...]`）
   - `n = 1+rand×3` 抽字卡 → `picks.join('\n')` → 末尾追加一个 emojiGroups 摊平随机 emoji
   - `if (!letterBox.mine.inbox) letterBox.mine.inbox = []`（兜底防清库后 undefined）
   - push：`{ id:'L'+Date.now()+rand万, title, content, from:'angle', to:'usr', ts:Date.now(), read:false, replied:false, sourceBox:'mine', sourceLetterBox:'mine', source:'auto' }`
   - `saveAppearance()` → `showToast('✉ ta来信：'+title)` → `chatSoundMsg && playSfx('msg')`
   - 末尾 `restartLetterTimer()`（递归调度下一封）
5. **`restartLetterTimer()`**：先 `clearTimeout(letterTimer); letterTimer = null; if(!chatLetterEnabled) return;` → `letterTimer = setTimeout(deliverAutoLetter, randLetterDelay())`
6. **init() 尾部**：`init();` 后 / `})();` 前 必须插入 `restartLetterTimer();` 启动整个流程（**千万别把 init() 本身覆盖掉了！**曾犯过把 init() 替换成 restartLetterTimer 导致整个应用不启动，修复花了很长时间）
7. **bindSlider & syncSlider**：两处 letter 格式化加 `minute` → "分钟" 分支（原来只支持 hour/day），三元嵌套：`u==='minute'||u==='min' ? 分钟 : u==='hour' ? 小时 : 天`

### 第 5 步：工具栏委托冲突 + 通话提示音
1. **L7189 附近**原来的 `chatBox.addEventListener('click', ... closest('.message') → openMsgToolbar)` 会和 addChatMessage 里的 click 引用 **冲突**。改法：把原来 'click' 整个事件改成 **`'contextmenu'`**（`e.preventDefault()+stopPropagation()`），右键/长按才开工具栏
2. **再补一个 chatBox 的空 click 委托**：`if (!e.target.closest('.message') && !e.target.closest('.msg-toolbar')) closeMsgToolbar()`——点击空白处关闭工具栏（保留原来 document click 的兜底）
3. **通话提示音**：`bottomCallBtn.addEventListener('click', ...)` 里在 `openModal(callModal)` **之前**加 `if(chatSoundCall) playSfx('call');`

### 第 6 步：语法校验（必须每次大改后跑，<1 秒）
```sh
node -e "
  const fs=require('fs');
  const h=fs.readFileSync('/workspace/lingstar.html','utf8');
  const c=h.match(/<script[^>]*>([\s\S]*?)<\/script>/)[0]
    .replace(/<script[^>]*>/,'').replace(/<\/script>$/,'');
  try{ new Function(c); console.log('OK',c.length,'bytes'); }
  catch(e){ console.log('ERR',e.message); }
"
```
- 如果是 SyntaxError：读错误 message + 行号（如果 new Function 不报行号，就用 `node -e "require('fs').readFileSync('c.txt','utf8'); eval(c)"` 或写临时文件 + `node --check` 定位）
- 绝不能带着 ERR 继续浏览器验证——浪费 30 秒 snapshot 时间

### 第 7 步：本地预览 + 浏览器 14 项验证

#### 启动预览服务器（1 次就行）
```sh
cd /workspace && python3 -m http.server 8771
# 验证：curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:8771/lingstar.html
```

#### 验证清单（顺序执行，每项记录 pass/fail）

| # | 验证项 | 方法（browser_evaluate script） | Pass 标志 |
|---|---|---|---|
| 1 | Console 0 error | `browser_console_messages()` 取最后一批 | 只含 previewer-tools log，无 error/warn |
| 2 | init() 真跑了 | `document.getElementById('chatBox').innerText` | 包含 "字卡已备好" 字样 |
| 3 | 点击消息 → 引用 toggle | `document.querySelector('.message.user').click();` → 读 `quoteBar.classList.contains('show')` + `quoteBarFrom.textContent` / 再点 1 次 → `show=false` | 1 次 show=true + from 正确 ("我：")；2 次 show=false |
| 4 | 已读回执 初始 ✓ → 变 ✓✓ | 发送新消息后立刻读 `.msg-read-graphic.textContent==='✓'` → wait 5s 再读 ==='✓✓' + color 紫色 | 两步都成立 |
| 5 | 日记 quickRow 无长字卡全 emoji | `diaryModal.active=true` → `Array.from(diaryQuickRow.children).map(x=>x.textContent.length).every(l<=5)` === true；内容均为 😊🌹✨🌙⭐🌸 等 emoji，无 "月光轻吻你的额" 等 >10 字长句 | every(l<=5) === true |
| 6 | 日历跳转按钮只有图标不竖排 | `calJumpBtn.textContent.trim() === '🕹'` && `calJumpBtn.title.startsWith('跳转')` && `getComputedStyle(calJumpBtn.parentElement).gap==='4px'` | 全 true |
| 7 | 日历跳转 Modal 美化 | `jumpDateModal.classList.add('active')` 后 `getComputedStyle(jumpDateModal.querySelector('.modal-content')).borderRadius==='20px'` | true |
| 8 | 拼字卡 2–5 分句 | chatMergeCards=true chatCustomReplyRule=true → 发消息 → 等 9s → 新 angle msg 里 `，` 数 ≥ 1 或 `\n` 数 ≥ 1 | count_by_comma ≥ 2 或 count_by_newline ≥ 2 |
| 9 | 表情混入 | chatEmojiMix=true → 回复里 `[😊🌹✨❤️💫🌙⭐🌸🤗💗🌈🎉💖💜]` 任一出现 | indexOf 命中 ≥1 |
| 10 | 颜文字混入（概率 50%） | chatKaomojiMix=true → 发送 3 条 → 3 条回复里至少 1 条匹配 `/（(.{0,8}[)）] ｜ T_T ｜ owo ｜ uwu ｜ ≧▽≦ ｜ >_< ｜ \^\^ /i` | 1+ 命中即过 |
| 11 | 已读不回 45% | chatReadNoReply=true → 发 6 条 → 应 1–4 条不回复但每条下方均 ✓✓ | msgCount 少 1–4 条 angle 回复，但每条 user 下方均 ✓✓ |
| 12 | 显示头像 | chatShowAvatar=true → `document.querySelectorAll('.message').every(m => m.querySelector('.msg-avatar'))` === true；关开关后发新消息不创建 avatar span | 每步对应 true |
| 13 | 自定义回信规律 OFF 强制简单 | chatCustomReplyRule=false chatMergeCards=true → 回复仍是单一句、无分句、无 emoji 混 | hasComma==0 && hasEmoji==false |
| 14 | 主动写信数据路径 OK | 直接 inject 假信：`letterBox.mine.inbox.push({...}); saveAppearance(); reload;` → inbox.length+1 | +1，下次 load 仍在 |
| 15 | 写信单位分钟默认生效 | resetClearAll 后读 chatLetterMinVal.textContent == '15分钟' && chatLetterMinUnit.value === 'minute' == chatLetterMaxUnit.value | 3 条件全 true |
| 16 | 提示音元素存在 + 钩子 | `!!document.getElementById('sndMsg') && !!document.getElementById('sndCall')` && `bottomCallBtn.onclick 源码字符串含 playSfx('call')` && `addChatMessage 里含 playSfx('msg')` | 全 true |

---

## ⚠️ 致命错误历史（前车之鉴，永不重犯）

| 错误 | 后果 | 正确做法 |
|---|---|---|
| 把 `init();` 覆盖了（Edit old_string="init();" → new_string 里漏写 init） | **整个页面完全不启动**，IIFE 不执行，所有变量 undefined | Edit 前把 tail 附近 5 行读出来，替换时永远保留 `init();` 在最前，新内容写在 init 之后 |
| `showQuoteBar(sender, text)` 定义带 2 参，调用时写 `showQuoteBar()` 无参 | `text.length` TypeError crash，引用条永远不显示 show 类、q-text 空 | 调用永远带参；函数内做 `safeText = (text==null)? '' : String(text)` 防御 |
| `new DOMTokenList()` 非法构造（老 bug 修 emojiGroups 时犯） | 立刻崩 DOM | 需要假 element 就 `document.createElement('span')`，永远别 new DOMTokenList |
| 连续 `browser_click` 没 re-snapshot | ref 失效 → "ref not found in RefMap" | 每次 click 改变 DOM 后必做 wait+re-snapshot，或改用 `browser_evaluate` 直接用 id/className 查元素点（最省时间） |
| 用 `typeof replyWithRandomCard === 'undefined'` 说函数不存在 | 错误结论；IIFE 私有函数在 DevTools 顶层永远是 undefined | 只能看 chatBox 实际消息 / console errors / 实际行为 |
| 定时器句柄存 localStorage | 反序列化后变成 `{}` 或报错 | saveAppearance 存配置型 scalar，不存 replyTimer/letterTimer/typingTimer |
| emojiGroups 直接 `emojiGroups['default']` 不用兜底 | 用户改了分组名后 → splice undefined | 永远 `for (g in emojiGroups) flat.push(...(emojiGroups[g]||[]))` 摊平 |
| addChatMessage 里直接改 `meta.innerHTML = new readSpan` | 已渲染的 msg-body 引用丢了，整个 meta 内部结构被覆盖 | 给 `<span>` 加 id，setTimeout 里用 `getElementById(id).textContent = '✓✓'` 原地改 |

---

## 🔧 工具：playSfx（Web Audio 合成音）

新增时直接粘贴以下代码（放 shade 工具函数前即可）。**不需要任何外部 mp3 / base64 / 文件**：

```
// ===== Web Audio 合成提示音 =====
let __sfxCtx = null;
function playSfx(kind) {
  try {
    if (!__sfxCtx) __sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = __sfxCtx;
    const now = ctx.currentTime;
    const vol = Math.max(0.05, Math.min(1, chatVolume / 100));
    function tone(freq, start, dur, type, gain) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, now + start);
      g.gain.exponentialRampToValueAtTime(vol * (gain||1), now + start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now + start); osc.stop(now + start + dur + 0.02);
    }
    if (kind === 'msg') { tone(880,0,0.08,'sine',0.9); tone(1320,0.09,0.12,'sine',0.8); }
    else if (kind === 'call') { for (var i=0;i<3;i++){tone(660,i*0.5,0.18,'triangle',1);tone(990,i*0.5+0.2,0.18,'triangle',0.9);} }
    else if (kind === 'send') { tone(1200,0,0.04,'sine',0.5); }
  } catch(e) {}
}
```

- msg：短两音 (收到消息)
- call：660/990Hz 三段振铃 (通话呼入)
- send：短滴 (输入消息发出反馈)

---

## ✅ 完成判据（Done 定义）

**满足全部 3 条才算 Done，不要只凭 Edit 工具都成功就说 Done：**

1. ✅ 语法校验 OK（第 6 步命令输出 `OK 304xxx bytes`，无 ERR）
2. ✅ Console 0 error（第 7.1 项，无 SyntaxError / ReferenceError）
3. ✅ 验证清单 14 项至少 12 项 pass；用户明确提到的诉求项（通常 3–8 条）必须 100% pass，不能有"应该可以"

如果某项验证失败，回到第 1 步重新 grep 定位（行号会因为之前的 Edit 变了）→ 再 Edit → 再校验 → 再验证，闭环到全部 pass 为止。
