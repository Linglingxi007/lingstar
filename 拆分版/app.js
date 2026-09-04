    (function() {
        "use strict";
        // ===== 默认数据 =====
        const DEFAULT_CARDS = [
            "月光轻吻你的额",
            "星辰在指尖流转",
            "风带来远方的歌",
            "琥珀色的记忆",
            "玫瑰与雾气缠绕",
            "雨滴敲打窗棂",
            "羽毛落在肩头",
            "银色的河流低语",
            "你是我未完成的诗",
            "梦境的碎片闪烁"
        ];
        const DEFAULT_EMOJIS = ["😊","❤️","💕","🥺","😽","🌸","🌙","✨","💗","🤗","🥰","😘","😚","😌","☺️","😏"];
        const DEFAULT_PATS = ["轻轻拍拍头","捏捏脸蛋","摸摸头发","抱一抱","戳戳脸颊","牵牵小手","拍拍肩膀","揉揉脑袋","后背轻轻拍","轻轻摸手"];
  // ===== 扩展：常量 & 工具 & Appearance / 主题 & 小游戏 =====
  function escapeHtml(s) {
    return String(s==null?'':s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  const DEFAULT_BOARD_PHRASES = {
    yellow: ['今天也要元气满满~', '好想和你一起去看海', '今天的风好温柔呢', '刚吃了超甜的蛋糕！', '晚安，好梦 🌙'],
    pink:   ['我也在一直想念你', '最喜欢和你牵手散步了', '抱抱~ 你今天辛苦啦', '想跟你一直在一起', '你就是我最大的勇气'],
    blue:   ['安静地陪在你身边', '今晚月色也很美', '一起加油，彼此都要好好的', '慢慢走，慢慢来', '我永远都在这里'],
    red:    ['不许熬夜！马上睡觉！', '今天也要好好吃饭！', '不准难过，我会心疼的', '我来保护你！', '不准想不开！！'],
    green:  ['一起去看樱花吧 🌸', '一起去吃火锅好不好 🍲', '想和你去动物园看熊猫', '一起看日落吧 🌇', '想去你最喜欢的咖啡店'],
    purple: ['如果有烦恼尽管告诉我', '想做你最特别的人', '你是独一无二的存在', '我相信你一定可以的', '谢谢你出现在我的生命里']
  };
  const DEFAULT_WISH_PHRASES = {
    yellow: ['想要一个大大的拥抱~', '想和你一起去旅行 ✈️', '想变成会发光的小星星', '今天也要被温柔以待', '愿所有美好都如期而至'],
    pink:   ['想永远被你宠着 ♡', '想和你看一辈子的星空', '想成为你最想念的人', '想一直握着你的手', '想要更多的亲亲抱抱'],
    blue:   ['希望你每天都能做个好梦', '希望你永远不要难过', '希望你一生平安顺遂', '希望你被全世界温柔相待', '希望你不要生病'],
    red:    ['希望你永远不离开我', '希望我是你最特别的人', '希望你心里只有我一个人', '希望你永远不会忘记我', '希望我是你的第一选择'],
    green:  ['希望能吃到好多好吃的！', '希望学业顺利～', '希望工作顺利不加班！', '希望能养一只小猫 🐱', '希望可以搬进大房子'],
    purple: ['希望我们能早点重逢', '希望时间可以慢一点', '希望下辈子我们也能遇见', '希望所有愿望都可以成真', '希望你成为世界上最幸福的人']
  };
  const STAR_COLORS = [
    {key:'yellow', emoji:'🌟', label:'阳光金', main:'#FFD966', light:'#FFF3B8', deep:'#E0A830', glow:'rgba(255,200,60,0.75)', paper:'linear-gradient(135deg, #fff6b0 0%, #ffe787 100%)'},
    {key:'pink',   emoji:'💗', label:'樱花粉', main:'#FF9ECB', light:'#FFD9EC', deep:'#D56AA0', glow:'rgba(255,140,190,0.75)',paper:'linear-gradient(135deg, #ffd1e4 0%, #ffafcd 100%)'},
    {key:'blue',   emoji:'🌊', label:'晴空蓝', main:'#7FC6F2', light:'#CEEAF9', deep:'#4C96CC', glow:'rgba(100,170,240,0.75)',paper:'linear-gradient(135deg, #d3f0ff 0%, #a6dbf6 100%)'},
    {key:'red',    emoji:'🔥', label:'勇气红', main:'#FF7A8F', light:'#FFCCD4', deep:'#D0455C', glow:'rgba(255,100,120,0.75)',paper:'linear-gradient(135deg, #ffdadf 0%, #ff99a8 100%)'},
    {key:'green',  emoji:'🍀', label:'幸运绿', main:'#9EDC8B', light:'#DCF2CE', deep:'#62AE4A', glow:'rgba(140,220,130,0.75)',paper:'linear-gradient(135deg, #e6ffd8 0%, #b8ed94 100%)'},
    {key:'purple', emoji:'💜', label:'梦情紫', main:'#C8A7FF', light:'#E6D7FF', deep:'#9069D8', glow:'rgba(180,140,255,0.75)',paper:'linear-gradient(135deg, #e8dcff 0%, #c5b0ff 100%)'}
  ];
  const DAILY_NOTE_CAP = 5;
  const DAILY_WISH_CAP = 5;
  const DOODLE_PALETTE = ['#000000','#FFFFFF','#D9534F','#F0AD4E','#5CB85C','#5BC0DE','#428BCA','#9B59B6','#E91E63','#009688','#FF9800','#795548','#9E9E9E','#607D8B','#F8E71C','#BD10E0'];
  const THEME_PRESETS = {
    'zisakura':    {name:'🌙 月落紫樱', vars:{bg_page:'#f6f0fb',bg_chat:'#fbf7ff',bg_panel:'#ffffff',bg_card:'#f7eefa',bg_bubble_user:'#e7d4ff',bg_bubble_angle:'#f5ecfb',bg_bubble_system:'#efe8f5',bg_button:'#a97be0',bg_button_hover:'#8a5ecc',bg_button_danger:'#e85a5a',bg_border:'#e6d5f0',bg_shadow:'280 50% 92%',text_primary:'#3a264a',text_secondary:'#5a4470',text_muted:'#927fa5',accent:'#8449c7',ring:'0 0 0 3px rgba(132,73,199,0.22)',board_note_bg_1:'linear-gradient(135deg, #fff6b0 0%, #ffe787 100%)',board_note_bg_2:'linear-gradient(135deg, #ffd1e4 0%, #ffafcd 100%)',board_lines:'rgba(140, 120, 160, 0.22)',board_grid:'rgba(140, 120, 160, 0.18)',board_page:'#fbf8ff',wish_canopy:'#b8d4ff',wish_trunk:'#8c5a3c',wish_sky:'#f5f1ff'}},
    'seasalt':     {name:'🌊 夏日海盐', vars:{bg_page:'#ecf8fa',bg_chat:'#f6fcfe',bg_panel:'#ffffff',bg_card:'#eaf8fa',bg_bubble_user:'#aee4ee',bg_bubble_angle:'#e3f5f7',bg_bubble_system:'#e0f1f4',bg_button:'#52b9c9',bg_button_hover:'#3ea4b4',bg_button_danger:'#e85a5a',bg_border:'#cde5e8',bg_shadow:'190 40% 90%',text_primary:'#1c3a40',text_secondary:'#3a626a',text_muted:'#7b9ea4',accent:'#2a8b9a',ring:'0 0 0 3px rgba(42,139,154,0.22)',board_note_bg_1:'linear-gradient(135deg, #fff6b0 0%, #ffe787 100%)',board_note_bg_2:'linear-gradient(135deg, #ffd1e4 0%, #ffafcd 100%)',board_lines:'rgba(80, 120, 130, 0.22)',board_grid:'rgba(80, 120, 130, 0.18)',board_page:'#f4fbfc',wish_canopy:'#9fd2c0',wish_trunk:'#8c5a3c',wish_sky:'#e9f8fb'}},
    'caramel':     {name:'☕ 焦糖摩卡', vars:{bg_page:'#fbf3e8',bg_chat:'#fff9ef',bg_panel:'#ffffff',bg_card:'#f9ecd8',bg_bubble_user:'#f5c88a',bg_bubble_angle:'#fbeecf',bg_bubble_system:'#f2e4cc',bg_button:'#c08a4b',bg_button_hover:'#a97336',bg_button_danger:'#e85a5a',bg_border:'#ecd7b3',bg_shadow:'40 45% 90%',text_primary:'#412a13',text_secondary:'#6a4a29',text_muted:'#a48767',accent:'#a96b22',ring:'0 0 0 3px rgba(169,107,34,0.22)',board_note_bg_1:'linear-gradient(135deg, #fff6b0 0%, #ffe787 100%)',board_note_bg_2:'linear-gradient(135deg, #ffd1e4 0%, #ffafcd 100%)',board_lines:'rgba(120, 80, 40, 0.22)',board_grid:'rgba(120, 80, 40, 0.18)',board_page:'#fcf6ea',wish_canopy:'#d8c082',wish_trunk:'#7a4e2c',wish_sky:'#fbf4e7'}},
    'mistforest':  {name:'🌲 森林薄雾', vars:{bg_page:'#eff6ef',bg_chat:'#f7fbf6',bg_panel:'#ffffff',bg_card:'#e8f3e6',bg_bubble_user:'#b7dfa8',bg_bubble_angle:'#e4f2de',bg_bubble_system:'#dfead9',bg_button:'#62a65c',bg_button_hover:'#4e8e49',bg_button_danger:'#e85a5a',bg_border:'#c9e0c2',bg_shadow:'108 30% 90%',text_primary:'#223a22',text_secondary:'#456645',text_muted:'#809d80',accent:'#3e7f3a',ring:'0 0 0 3px rgba(62,127,58,0.22)',board_note_bg_1:'linear-gradient(135deg, #fff6b0 0%, #ffe787 100%)',board_note_bg_2:'linear-gradient(135deg, #ffd1e4 0%, #ffafcd 100%)',board_lines:'rgba(60, 110, 70, 0.22)',board_grid:'rgba(60, 110, 70, 0.18)',board_page:'#f5faf4',wish_canopy:'#8ecb80',wish_trunk:'#6b482c',wish_sky:'#eef7ec'}},
    'sakura':      {name:'🌸 樱花乳酪', vars:{bg_page:'#fef6f6',bg_chat:'#fffbfb',bg_panel:'#ffffff',bg_card:'#fff5f7',bg_bubble_user:'#ffd4df',bg_bubble_angle:'#fff1f4',bg_bubble_system:'#f5eef5',bg_button:'#ff99b0',bg_button_hover:'#ff7d9b',bg_button_danger:'#e85a5a',bg_border:'#f1d8e2',bg_shadow:'320 50% 94%',text_primary:'#3d2630',text_secondary:'#6b4b58',text_muted:'#a38793',accent:'#d24b6e',ring:'0 0 0 3px rgba(210,75,110,0.25)',board_note_bg_1:'linear-gradient(135deg, #fff6b0 0%, #ffe787 100%)',board_note_bg_2:'linear-gradient(135deg, #ffd1e4 0%, #ffafcd 100%)',board_lines:'rgba(120, 90, 100, 0.22)',board_grid:'rgba(120, 90, 100, 0.18)',board_page:'#fdfaf2',wish_canopy:'#a7d99a',wish_trunk:'#8c5a3c',wish_sky:'#f6faff'}},
    'amber':       {name:'✦ 星夜琥珀', vars:{bg_page:'#2a2033',bg_chat:'#35293d',bg_panel:'#3a2d46',bg_card:'#443451',bg_bubble_user:'#b8842c',bg_bubble_angle:'#4c3c5c',bg_bubble_system:'#4a3959',bg_button:'#d39e2f',bg_button_hover:'#e3ae3e',bg_button_danger:'#d05050',bg_border:'#584469',bg_shadow:'260 20% 12%',text_primary:'#f2e8d3',text_secondary:'#d6c3a1',text_muted:'#928271',accent:'#ffcf5d',ring:'0 0 0 3px rgba(255,207,93,0.25)',board_note_bg_1:'linear-gradient(135deg, #ffe388 0%, #ffcc55 100%)',board_note_bg_2:'linear-gradient(135deg, #ffb7d1 0%, #ff83aa 100%)',board_lines:'rgba(230, 210, 170, 0.22)',board_grid:'rgba(230, 210, 170, 0.18)',board_page:'#4a3a2b',wish_canopy:'#4e8a5e',wish_trunk:'#5b3c23',wish_sky:'#2e2440'}}
  };
  const VAR_KEYS = ['bg_page','bg_chat','bg_panel','bg_card','bg_bubble_user','bg_bubble_angle','bg_bubble_system','bg_button','bg_button_hover','bg_button_danger','bg_border','bg_shadow','text_primary','text_secondary','text_muted','accent','ring','board_note_bg_1','board_note_bg_2','board_lines','board_grid','board_page','wish_canopy','wish_trunk','wish_sky'];
  const DEFAULT_DRAW_TOPICS = {
    '🌱 植物':   ['向日葵','玫瑰','樱花树','仙人掌','四叶草','蘑菇','柳树','向日葵花田','竹子','含羞草','盆栽多肉','荷花','蒲公英','薰衣草','郁金香','桃花','银杏','山茶花','雏菊','木棉'],
    '🐾 动物':   ['小猫','小狗','兔子','熊猫','企鹅','金鱼','长颈鹿','大象','老虎','狐狸','仓鼠','考拉','海豚','独角兽','恐龙','猫头鹰','松鼠','螃蟹','青蛙','小乌龟'],
    '🍎 水果':   ['西瓜','苹果','草莓','葡萄','香蕉','樱桃','榴莲','芒果','水蜜桃','菠萝','蓝莓','橘子','椰子','猕猴桃','柠檬','火龙果','梨','哈密瓜','石榴','柿子'],
    '🏞 景物':   ['彩虹','城堡','摩天轮','烟花','雪山','日落','灯塔','小桥流水','森林','沙滩','热气球','星空','月亮','瀑布','小房子','故宫','富士山','金字塔','沙漠','极光'],
    '🍜 食物':   ['火锅','蛋糕','拉面','冰淇淋','寿司','烤肉','包子','奶茶','饺子','披萨','牛排','糖葫芦','麻辣烫','饭团','马卡龙','可丽饼','铜锣烧','华夫饼','烤肠','关东煮'],
    '🧸 事物':   ['书包','钢琴','雨伞','地球仪','照相机','时钟','机器人','气球','自行车','魔法棒','宝箱','吉他','风筝','镜子','茶杯','闹钟','台灯','圣诞袜','水晶球','积木']
  };
  let phraseKind = 'board';
  let rpsMode = 'winner_rules';
  let rpsRole = 'dreamer';
  let dgMode = 'topic';
  let dgRole = 'dreamer';
  let dgCurrentRound = null;
  let dgTimer = null;
  let appearance = {
    savedThemes:{},
    activeThemeKey:'sakura',
    customVars: {},
    chatSettings: JSON.parse(JSON.stringify({
      chatFontFamily:'inherit', chatFontSize:0.78, chatLineHeight:1.65, chatLetterSpacing:0, chatDensity:'normal',
      showBubbleTail:true, avatarShape:'circle', showNickname:'first', showTimeFormat:'auto',
      showDateDivider:true, showReadReceipt:true, enableSound:true, bubbleWidthPct:78, bubbleRadius:16,
      bubbleShadow:true, showAvatarOutside:true, chatAnimDuration:0.26, chatBgOpacity:1, chatBgPattern:'none'
    })),
    miscSettings: { chatHeaderStyle:'default', showSidebarQuick: true, scrollSnapBubble: false, autoScrollOnNew: true, doubleTapToLike: true, swipeToReply: false, cardAnimStyle:'pop' },
    board_boardStyle:'lines',
    messageBoard: { phrases: {}, notes: [], todayDate:'', todayCount:0 },
    wishTree:     { phrases: {}, stars: [], todayDate:'', todayCount:0 }
  };
  let dreamGames = {
    rps_history: [],
    rps_stats: {dreamerWins:0, angleWins:0, ties:0},
    doodles: [],
    draw_guess_history: [],
    draw_guess_topics: {},
    draw_guess_stats: {dreamerHits:0, angleHits:0, total:0}
  };
  let currentDreamerRoundRule = null;
  // ========== 工具函数 ==========
  function todayKey() {
    const d = new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
  }
  function saveAppearance() {
    try {
      localStorage.setItem('dream_appearance', JSON.stringify(appearance));
      localStorage.setItem('dream_games', JSON.stringify(dreamGames));
    } catch(e) { /* ignore quota */ }
  }
  function loadAppearance() {
    try {
      const a = localStorage.getItem('dream_appearance');
      if (a) appearance = Object.assign(appearance, JSON.parse(a));
      const g = localStorage.getItem('dream_games');
      if (g) dreamGames = Object.assign(dreamGames, JSON.parse(g));
    } catch(e) {}
    if (!appearance.messageBoard.phrases || !Object.keys(appearance.messageBoard.phrases).length) appearance.messageBoard.phrases = JSON.parse(JSON.stringify(DEFAULT_BOARD_PHRASES));
    if (!appearance.wishTree.phrases || !Object.keys(appearance.wishTree.phrases).length) appearance.wishTree.phrases = JSON.parse(JSON.stringify(DEFAULT_WISH_PHRASES));
  }
  function sendReplyToChat(kind, src, replyText) {
    if (!replyText) return;
    let quoteCls = 'bd-quote-block', replyCls = 'bd-reply-block', qt='原留言';
    if (kind === 'wish') { quoteCls = 'ws-quote-block'; replyCls = 'ws-reply-block'; qt = '原愿望'; }
    const qc = src.colorLabel || '';
    const html =
      '<div class="'+quoteCls+'"><div class="quote-title">'+(qc?qc+' · ':'')+qt+'</div><div>'+escapeHtml(src.content)+'</div></div>'+
      '<div class="'+replyCls+'"><div class="reply-title">✏️ 回复</div><div>'+escapeHtml(replyText)+'</div></div>';
    addChatMessageHtml(html, 'angle');
  }
  function currentPhrases() {
    return phraseKind === 'wish' ? appearance.wishTree.phrases : appearance.messageBoard.phrases;
  }
  const CHAT_SETTINGS_DEFAULT = {
    // 聊天字体/背景/气泡细节
    chatFontFamily: 'inherit',        // inherit / serif / kai / round / mono
    chatFontSize: 0.78,               // rem，范围 0.68 ~ 0.92
    chatLineHeight: 1.65,             // 1.2 ~ 2.0
    chatLetterSpacing: 0,             // px, -1 ~ 3
    chatDensity: 'normal',            // compact / normal / relaxed
    // 消息显示方式
    showBubbleTail: true,             // 气泡小尾巴
    avatarShape: 'circle',            // circle / rounded / square
    showNickname: 'first',            // always / first / never
    showTimeFormat: 'auto',           // auto / 12h / 24h / off
    showDateDivider: true,            // 日期分隔线
    showReadReceipt: true,            // 已读回执
    enableSound: true,                // 提示音
    bubbleWidthPct: 78,               // 气泡最大宽度 % 50 ~ 90
    bubbleRadius: 16,                 // 气泡圆角 px 0 ~ 26
    bubbleShadow: true,               // 气泡柔和阴影
    showAvatarOutside: true,          // 头像显示在气泡外侧（不启用则收进气泡内）
    chatAnimDuration: 0.26,           // 入场动画 0 ~ 0.8 s
    chatBgOpacity: 1,                 // 聊天背景叠加透明度
    chatBgPattern: 'none'             // none / dots / grid / lines / noise
  };
  const CHAT_FONT_OPTIONS = [
    ['inherit','默认（跟随系统）'],['sans-serif','无衬线'],['"Noto Serif SC", serif','衬线'],
    ['"KaiTi", "STKaiti", "楷体", serif','楷体'],['"Huiwen-mincho", "Yuanti SC", "SimHei", sans-serif','圆体'],['"JetBrains Mono", ui-monospace, Menlo, monospace','等宽']
  ];
  function applyChatSettings(cs, {save} = {save:true}) {
    const s = Object.assign({}, CHAT_SETTINGS_DEFAULT, appearance.chatSettings || {}, cs || {});
    appearance.chatSettings = s;
    const root = document.documentElement;
    root.style.setProperty('--chat-font-family', s.chatFontFamily);
    root.style.setProperty('--chat-font-size', s.chatFontSize.toFixed(2)+'rem');
    root.style.setProperty('--chat-line-height', s.chatLineHeight.toFixed(2));
    root.style.setProperty('--chat-letter-spacing', s.chatLetterSpacing+'px');
    root.style.setProperty('--bubble-radius', s.bubbleRadius+'px');
    root.style.setProperty('--bubble-max-width', s.bubbleWidthPct+'%');
    root.style.setProperty('--chat-anim-dur', s.chatAnimDuration.toFixed(2)+'s');
    root.style.setProperty('--chat-bg-opacity', s.chatBgOpacity.toFixed(2));
    // density / avatar / bubble-tail classes 应用到 app 容器
    const app = document.getElementById('app');
    if (app) {
      app.classList.toggle('density-compact', s.chatDensity === 'compact');
      app.classList.toggle('density-relaxed', s.chatDensity === 'relaxed');
      app.classList.toggle('no-tail', !s.showBubbleTail);
      app.classList.toggle('avatar-circle', s.avatarShape==='circle');
      app.classList.toggle('avatar-rounded', s.avatarShape==='rounded');
      app.classList.toggle('avatar-square', s.avatarShape==='square');
      app.classList.toggle('nick-always', s.showNickname==='always');
      app.classList.toggle('nick-never', s.showNickname==='never');
      app.classList.toggle('divider-hide', !s.showDateDivider);
      app.classList.toggle('no-shadow', !s.bubbleShadow);
      app.classList.toggle('avatar-inside', !s.showAvatarOutside);
      app.setAttribute('data-time', s.showTimeFormat);
      app.setAttribute('data-pattern', s.chatBgPattern);
      app.style.setProperty('--read-receipt', s.showReadReceipt ? '1' : '0');
      app.style.setProperty('--enable-sound', s.enableSound ? '1' : '0');
    }
    // 附加：.message .msg-bubble::after display 根据 showBubbleTail 关
    const styleId = '__chatSettingExtra';
    let node = document.getElementById(styleId);
    if (!node) { node = document.createElement('style'); node.id = styleId; document.head.appendChild(node); }
    node.textContent = '.no-tail .msg-bubble::after{ display:none !important; }' +
      '.avatar-inside .message.user, .avatar-inside .message.angle { gap: 0 !important; }' +
      '.avatar-inside .msg-avatar { display: none; }' +
      '.density-compact .chat-list { gap: 6px; } .density-compact .msg-bubble { padding: 5px 9px; }' +
      '.density-relaxed .chat-list { gap: 14px; } .density-relaxed .msg-bubble { padding: 11px 15px; }';
    avatarShape = s.avatarShape || 'circle'; // 兼容旧变量（profile 里的 avatar shape）
    if (save) saveAppearance();
    return s;
  }
  function applyThemeVariables(vars) {
    const root = document.documentElement;
    function setVar(varName, value) {
      if (!value) return;
      const name = '--' + varName.replace(/_/g, '-');
      root.style.setProperty(name, value);
    }
    const map = {
      'bg_page':'bg_page','bg_chat':'bg_chat','bg_panel':'bg_panel','bg_card':'bg_card',
      'bg_bubble_user':'bg_bubble_user','bg_bubble_angle':'bg_bubble_angle','bg_bubble_system':'bg_bubble_system',
      'bg_button':'bg_button','bg_button_hover':'bg_button_hover','bg_button_danger':'bg_button_danger',
      'bg_border':'bg_border','bg_shadow':'bg_shadow',
      'text_primary':'text_primary','text_secondary':'text_secondary','text_muted':'text_muted',
      'accent':'accent','ring':'ring',
      'board_note_bg_1':'board-note-bg','board_note_bg_2':'board-note-bg-alt',
      'board_lines':'board-lines','board_grid':'board-grid','board_page':'board-page',
      'wish_canopy':'wish-canopy','wish_trunk':'wish-trunk','wish_sky':'wish-sky'
    };
    Object.keys(map).forEach(function(k){
      if (vars[k]) setVar(map[k], vars[k]);
    });
  }
  function getCurrentThemeVars() {
    const styles = getComputedStyle(document.documentElement);
    const cssMap = {
      '--bg-page':'bg_page','--bg-chat':'bg_chat','--bg-panel':'bg_panel','--bg-card':'bg_card',
      '--bg-bubble-user':'bg_bubble_user','--bg-bubble-angle':'bg_bubble_angle','--bg-bubble-system':'bg_bubble_system',
      '--bg-button':'bg_button','--bg-button-hover':'bg_button_hover','--bg-button-danger':'bg_button_danger',
      '--bg-border':'bg_border','--bg-shadow':'bg_shadow',
      '--text-primary':'text_primary','--text-secondary':'text_secondary','--text-muted':'text_muted',
      '--accent':'accent','--ring':'ring',
      '--board-note-bg':'board_note_bg_1','--board-note-bg-alt':'board_note_bg_2',
      '--board-lines':'board_lines','--board-grid':'board_grid','--board-page':'board_page',
      '--wish-canopy':'wish_canopy','--wish-trunk':'wish_trunk','--wish-sky':'wish_sky'
    };
    const vars = {};
    Object.keys(cssMap).forEach(function(k){ vars[cssMap[k]] = (styles.getPropertyValue(k)||'').trim(); });
    return vars;
  }
  function loadThemeFromStorage() {
    try {
      const key = appearance.activeThemeKey || 'sakura';
      const preset = THEME_PRESETS[key];
      if (preset && preset.vars) applyThemeVariables(preset.vars);
    } catch(e){}
    if (appearance.customVars && Object.keys(appearance.customVars).length) applyThemeVariables(appearance.customVars);
    applyChatSettings(appearance.chatSettings || {}, {save:false});
  }
  function saveCurrentThemeToStorage() {
    appearance.customVars = getCurrentThemeVars();
    saveAppearance();
  }
  function getThemeSwatchPreviewVars(vars) {
    return {
      '--c-bg-page': vars.bg_page || '',
      '--c-bubble-user': vars.bg_bubble_user || '',
      '--c-bubble-angle': vars.bg_bubble_angle || '',
      '--c-accent': vars.accent || ''
    };
  }

  // 昵称/头像
        let userName = '我';
        let userAvatar = '🌸';
        let angleName = 'ta';
        let angleAvatar = '🌙';
        let avatarShape = 'circle';
        let userSize = 60,
            userLeft = 0,
            userTop = 0;
        let angleSize = 60,
            angleLeft = 0,
            angleTop = 0;
        // 通话
        let callState = 'idle';
        let callTimer = null;
        // 分组/字卡/表情/拍一拍
        let groups = {};
        let groupList = [];
        let cardLibrary = [];
        let currentGroup = 'all';
        let cardSelectMode = false;
        let cardSelected = new Set();
        let cardSearch = '';
        let emojiGroups = {};
        let emojiGroupList = [];
        let emojiCurrentGroup = 'all';
        let emojiSelectMode = false;
        let emojiSelected = new Set();
        let emojiSearch = '';
        let patGroups = {};
        let patGroupList = [];
        let patCurrentGroup = 'all';
        let patSelectMode = false;
        let patSelected = new Set();
        let patSearch = '';
        // ===== DOM =====
        const chatBox = document.getElementById('chatBox');
        const userInput = document.getElementById('userInput');
        const sendBtn = document.getElementById('sendBtn');
        const openSidePanelBtn = document.getElementById('openSidePanelBtn');
        const openSettingsBtn = document.getElementById('openSettingsBtn');
        const sidePanel = document.getElementById('sidePanel');
        const sideOverlay = document.getElementById('sideOverlay');
        const sideCloseBtn = document.getElementById('sideCloseBtn');
        const arrowUpBtn = document.getElementById('arrowUpBtn');
        const bottomSheet = document.getElementById('bottomSheet');
        const bottomCallBtn = document.getElementById('bottomCallBtn');
        const bottomEmojiBtn = document.getElementById('bottomEmojiBtn');
        const bottomPatBtn = document.getElementById('bottomPatBtn');
        const sideCardBtn = document.getElementById('sideCardBtn');
        const sideEmojiBtn = document.getElementById('sideEmojiBtn');
        const sidePatBtn = document.getElementById('sidePatBtn');
        // 设置弹窗（外观设置主窗口）
        const settingsModal = document.getElementById('settingsModal');
        const closeSettingsBtn = document.getElementById('closeSettingsBtn');
        // 外观设置子板块按钮
        const openThemeBtn = document.getElementById('openThemeBtn');
        const openBgFontBtn = document.getElementById('openBgFontBtn');
        const openBubbleBtn = document.getElementById('openBubbleBtn');
        const openAvatarBtn = document.getElementById('openAvatarBtn');
        const openNicknameBtn = document.getElementById('openNicknameBtn');
        // 子板块弹窗
        const themeModal = document.getElementById('themeModal');
        const closeThemeModal = document.getElementById('closeThemeModal');
        const bgFontModal = document.getElementById('bgFontModal');
        const closeBgFontModal = document.getElementById('closeBgFontModal');
        const bubbleModal = document.getElementById('bubbleModal');
        const closeBubbleModal = document.getElementById('closeBubbleModal');
        const nicknameModal = document.getElementById('nicknameModal');
        const closeNicknameModal = document.getElementById('closeNicknameModal');
        const avatarModal = document.getElementById('avatarModal');
        const closeAvatarModal = document.getElementById('closeAvatarModal');
        // 昵称
        const userNameInput = document.getElementById('userNameInput');
        const angleNameInput = document.getElementById('angleNameInput');
        const saveNicknameBtn = document.getElementById('saveNicknameBtn');
        // 头像
        const userAvatarInput = document.getElementById('userAvatarInput');
const angleAvatarInput = document.getElementById('angleAvatarInput');
        const applyUserAvatarBtn = document.getElementById('applyUserAvatarBtn');
        const applyAngleAvatarBtn = document.getElementById('applyAngleAvatarBtn');
        const removeUserAvatarBtn = document.getElementById('removeUserAvatarBtn');
        const removeAngleAvatarBtn = document.getElementById('removeAngleAvatarBtn');
        const userSizeSlider = document.getElementById('userSizeSlider');
        const userLeftSlider = document.getElementById('userLeftSlider');
        const userTopSlider = document.getElementById('userTopSlider');
        const angleSizeSlider = document.getElementById('angleSizeSlider');
        const angleLeftSlider = document.getElementById('angleLeftSlider');
        const angleTopSlider = document.getElementById('angleTopSlider');
        const userSizeValue = document.getElementById('userSizeValue');
        const userLeftValue = document.getElementById('userLeftValue');
        const userTopValue = document.getElementById('userTopValue');
        const angleSizeValue = document.getElementById('angleSizeValue');
        const angleLeftValue = document.getElementById('angleLeftValue');
        const angleTopValue = document.getElementById('angleTopValue');
        const previewUserAvatar = document.getElementById('previewUserAvatar');
        const previewAngleAvatar = document.getElementById('previewAngleAvatar');
        const previewUserEmoji = document.getElementById('previewUserEmoji');
        const previewAngleEmoji = document.getElementById('previewAngleEmoji');
        const previewUserName = document.getElementById('previewUserName');
        const previewAngleName = document.getElementById('previewAngleName');
        const saveAvatarBtn = document.getElementById('saveAvatarBtn');
        const shapeBtns = document.querySelectorAll('.shape-btn');
        // 字卡元素
        const modalCardCount = document.getElementById('modalCardCount');
        const modGroupTabs = document.getElementById('modGroupTabs');
        const modSearchInput = document.getElementById('modSearchInput');
        const modCardList = document.getElementById('modCardList');
        const modBatchInput = document.getElementById('modBatchInput');
        const modBatchGroupSelect = document.getElementById('modBatchGroupSelect');
        const modBatchImportBtn = document.getElementById('modBatchImportBtn');
        const modClearBatchBtn = document.getElementById('modClearBatchBtn');
        const modGroupInput = document.getElementById('modGroupInput');
        const modAddGroupBtn = document.getElementById('modAddGroupBtn');
        const modDeleteGroupBtn = document.getElementById('modDeleteGroupBtn');
        const modSelectBtn = document.getElementById('modSelectBtn');
        const modDeleteSelectedBtn = document.getElementById('modDeleteSelectedBtn');
        const modSelectInfo = document.getElementById('modSelectInfo');
        const modMoveRow = document.getElementById('modMoveRow');
        const modMoveGroupSelect = document.getElementById('modMoveGroupSelect');
        const modMoveBtn = document.getElementById('modMoveBtn');
        const modClearAllBtn = document.getElementById('modClearAllBtn');
        const modResetDefaultBtn = document.getElementById('modResetDefaultBtn');
 // 表情包元素
        const emojiList = document.getElementById('emojiList');
        const emojiSearchInput = document.getElementById('emojiSearchInput');
        const emojiInput = document.getElementById('emojiInput');
        const emojiGroupSelect = document.getElementById('emojiGroupSelect');
        const addEmojiBtn = document.getElementById('addEmojiBtn');
        const clearEmojiBtn = document.getElementById('clearEmojiBtn');
        const resetEmojiBtn = document.getElementById('resetEmojiBtn');
        const emojiGroupTabs = document.getElementById('emojiGroupTabs');
        const emojiSelectBtn = document.getElementById('emojiSelectBtn');
        const emojiDeleteSelectedBtn = document.getElementById('emojiDeleteSelectedBtn');
        const emojiSelectInfo = document.getElementById('emojiSelectInfo');
        const emojiMoveRow = document.getElementById('emojiMoveRow');
        const emojiMoveGroupSelect = document.getElementById('emojiMoveGroupSelect');
        const emojiMoveBtn = document.getElementById('emojiMoveBtn');
        const emojiCount = document.getElementById('emojiCount');
        const emojiAllCount = document.getElementById('emojiAllCount');
        // 拍一拍元素
        const patList = document.getElementById('patList');
        const patSearchInput = document.getElementById('patSearchInput');
        const patInput = document.getElementById('patInput');
        const patGroupSelect = document.getElementById('patGroupSelect');
        const addPatBtn = document.getElementById('addPatBtn');
        const clearPatBtn = document.getElementById('clearPatBtn');
        const resetPatBtn = document.getElementById('resetPatBtn');
        const patGroupTabs = document.getElementById('patGroupTabs');
        const patSelectBtn = document.getElementById('patSelectBtn');
        const patDeleteSelectedBtn = document.getElementById('patDeleteSelectedBtn');
        const patSelectInfo = document.getElementById('patSelectInfo');
        const patMoveRow = document.getElementById('patMoveRow');
        const patMoveGroupSelect = document.getElementById('patMoveGroupSelect');
        const patMoveBtn = document.getElementById('patMoveBtn');
        const patCount = document.getElementById('patCount');
        const patAllCount = document.getElementById('patAllCount');
        // 通话元素
        const callBtn = document.getElementById('callBtn');
        const hangupBtn = document.getElementById('hangupBtn');
        const callStatusText = document.getElementById('callStatusText');
        const callDreamerDot = document.getElementById('callDreamerDot');
        const callAngleDot = document.getElementById('callAngleDot');
        const callUserAvatar = document.getElementById('callUserAvatar');
        const callAngleAvatar = document.getElementById('callAngleAvatar');
        const callUserName = document.getElementById('callUserName');
        const callAngleName = document.getElementById('callAngleName');
        // ===== 工具 =====
        function showToast(msg) { alert(msg); }
        function addChatMessage(text, type, extraClass) {
            addChatMessageHtml((text || '').replace(/\n/g, '<br>'), type || 'system', extraClass);
        }
        function addChatMessageHtml(html, type, extraClass) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message ' + (type || 'system') + (extraClass ? ' ' + extraClass : '');
            const avatarSpan = document.createElement('span');
            avatarSpan.className = 'msg-avatar';
            if (type === 'user') {
                avatarSpan.innerHTML = isImageUrl(userAvatar) ? `<img src="${userAvatar}">` : userAvatar;
            } else {
                avatarSpan.innerHTML = isImageUrl(angleAvatar) ? `<img src="${angleAvatar}">` : angleAvatar;
            }
            const bubble = document.createElement('div');
            bubble.className = 'msg-bubble';
            const content = document.createElement('div');
            content.className = 'msg-content';
            content.innerHTML = html || '';
            bubble.appendChild(content);
            const now = new Date();
            const ts = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
            const small = document.createElement('small');
            const sender = type === 'user' ? userName : angleName;
            small.textContent = sender + ' · ' + ts;
            bubble.appendChild(small);
            bubble.querySelectorAll('img.msg-doodle-img').forEach(function(img){
                img.addEventListener('click', function(){ openImgViewer(img.src); });
            });
            if (type === 'user') {
                msgDiv.appendChild(bubble);
                msgDiv.appendChild(avatarSpan);
            } else {
                msgDiv.appendChild(avatarSpan);
                msgDiv.appendChild(bubble);
            }
            chatBox.appendChild(msgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        function openImgViewer(src) {
            const v = document.getElementById('imgViewer');
            const i = document.getElementById('imgViewerImg');
            i.src = src || '';
            v.classList.add('active');
            v.onclick = function() { v.classList.remove('active'); v.onclick = null; };
        }
 function isImageUrl(str) {
            return str && (str.startsWith('http') || str.startsWith('data:image'));
        }
        function renderAvatar(container, avatar, shape, size, left, top) {
            container.style.width = size + 'px';
            container.style.height = size + 'px';
            container.style.marginLeft = left + 'px';
            container.style.marginTop = top + 'px';
            container.className = `avatar-preview shape-${shape}`;
            if (isImageUrl(avatar)) {
                container.innerHTML = `<img src="${avatar}">`;
            } else {
                container.innerHTML = `<span style="font-size:${size*0.6}px;">${avatar}</span>`;
            }
        }
        // ===== 弹窗控制 =====
        function openModal(modal) { modal.classList.add('active');
            document.body.style.overflow = 'hidden'; }
        function closeModal(modal) { modal.classList.remove('active');
            document.body.style.overflow = ''; }
        // ===== 侧边栏控制 =====
        function openSidePanel() {
            sidePanel.classList.add('open');
            sideOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeSidePanel() {
            sidePanel.classList.remove('open');
            sideOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        // ===== 底部上弹侧边栏 =====
        let bottomSheetOpen = false;
        function toggleBottomSheet() {
            bottomSheetOpen = !bottomSheetOpen;
            bottomSheet.classList.toggle('open', bottomSheetOpen);
            arrowUpBtn.classList.toggle('active', bottomSheetOpen);
        }
        function closeBottomSheet() {
            bottomSheetOpen = false;
            bottomSheet.classList.remove('open');
            arrowUpBtn.classList.remove('active');
        }
        // ===== 昵称/头像管理 =====
        function loadProfile() {
            const saved = localStorage.getItem('dream_profile');
            if (saved) {
                try {
                    const p = JSON.parse(saved);
                    userName = p.userName || '我';
                    userAvatar = p.userAvatar || '🌸';
                    angleName = p.angleName || 'ta';
                    angleAvatar = p.angleAvatar || '🌙';
                    avatarShape = p.avatarShape || 'circle';
                    userSize = p.userSize || 60;
                    userLeft = p.userLeft || 0;
                    userTop = p.userTop || 0;
                    angleSize = p.angleSize || 60;
                    angleLeft = p.angleLeft || 0;
                    angleTop = p.angleTop || 0;
                } catch (e) {}
            }
            applyProfile();
        }
        function applyProfile() {
            document.getElementById('angleNameDisplay').textContent = angleName;
            const avatarEl = document.getElementById('angleAvatarDisplay');
            if (isImageUrl(angleAvatar)) {
                avatarEl.innerHTML = `<img src="${angleAvatar}">`;
                avatarEl.style.background = 'none';
            } else {
                avatarEl.textContent = angleAvatar;
                avatarEl.style.background = 'linear-gradient(135deg, #dcc3ed, #c6a8de)';
            }
 if (userNameInput) userNameInput.value = userName;
            if (angleNameInput) angleNameInput.value = angleName;
            if (userAvatarInput) userAvatarInput.value = userAvatar;
            if (angleAvatarInput) angleAvatarInput.value = angleAvatar;
            renderAvatar(previewUserAvatar, userAvatar, avatarShape, userSize, userLeft, userTop);
            renderAvatar(previewAngleAvatar, angleAvatar, avatarShape, angleSize, angleLeft, angleTop);
            previewUserName.textContent = userName;
            previewAngleName.textContent = angleName;
            if (userSizeSlider) userSizeSlider.value = userSize;
            if (userLeftSlider) userLeftSlider.value = userLeft;
            if (userTopSlider) userTopSlider.value = userTop;
            if (angleSizeSlider) angleSizeSlider.value = angleSize;
            if (angleLeftSlider) angleLeftSlider.value = angleLeft;
            if (angleTopSlider) angleTopSlider.value = angleTop;
            if (userSizeValue) userSizeValue.textContent = userSize + 'px';
            if (userLeftValue) userLeftValue.textContent = userLeft + 'px';
            if (userTopValue) userTopValue.textContent = userTop + 'px';
            if (angleSizeValue) angleSizeValue.textContent = angleSize + 'px';
            if (angleLeftValue) angleLeftValue.textContent = angleLeft + 'px';
            if (angleTopValue) angleTopValue.textContent = angleTop + 'px';
            if (callUserAvatar) callUserAvatar.textContent = userAvatar;
            if (callAngleAvatar) callAngleAvatar.textContent = angleAvatar;
            if (callUserName) callUserName.textContent = userName;
            if (callAngleName) callAngleName.textContent = angleName;
            shapeBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.shape === avatarShape);
            });
        }
        function saveFullProfile() {
            const data = {
                userName,
                userAvatar,
                angleName,
                angleAvatar,
                avatarShape,
                userSize,
                userLeft,
                userTop,
                angleSize,
                angleLeft,
                angleTop
            };
            localStorage.setItem('dream_profile', JSON.stringify(data));
            applyProfile();
            showToast('已保存');
        }
        // ===== 字卡渲染 =====
        function renderCards() {
            if (!modGroupTabs) return;
            modGroupTabs.innerHTML = '';
            let total = 0;
            for (const g in groups) total += groups[g].length;
            const allTab = document.createElement('span');
            allTab.className = `mod-group-tab ${currentGroup === 'all' ? 'active' : ''}`;
            allTab.dataset.group = 'all';
            allTab.innerHTML = `全部 <span class="count">${total}</span>`;
            allTab.addEventListener('click', () => switchGroup('all'));
            modGroupTabs.appendChild(allTab);
            for (const gName of groupList) {
                if (gName === 'default') continue;
                const tab = document.createElement('span');
                tab.className = `mod-group-tab ${currentGroup === gName ? 'active' : ''}`;
                tab.dataset.group = gName;
                const count = groups[gName] ? groups[gName].length : 0;
                tab.innerHTML = `${gName} <span class="count">${count}</span>`;
                tab.addEventListener('click', () => switchGroup(gName));
                modGroupTabs.appendChild(tab);
            }
            modBatchGroupSelect.innerHTML = '';
            for (const g of groupList) {
                const opt = document.createElement('option');
                opt.value = g;
                opt.textContent = g === 'default' ? '默认' : g;
                modBatchGroupSelect.appendChild(opt);
            }
            modMoveGroupSelect.innerHTML = '<option value="">移动到...</option>';
            for (const g of groupList) {
                const opt = document.createElement('option');
                opt.value = g;
                opt.textContent = g === 'default' ? '默认' : g;
                modMoveGroupSelect.appendChild(opt);
            }
            let display = [];
            if (currentGroup === 'all') {
                for (const g in groups) display = display.concat(groups[g]);
            } else if (groups[currentGroup]) {
                display = groups[currentGroup];
            } else {
                currentGroup = 'all';
                for (const g in groups) display = display.concat(groups[g]);
            }
            const kw = cardSearch.trim().toLowerCase();
            if (kw) display = display.filter(c => c.toLowerCase().includes(kw));
  modCardList.innerHTML = '';
            if (!display.length) {
                const empty = document.createElement('span');
                empty.className = 'mod-empty';
                empty.textContent = kw ? '未找到匹配字卡' : (currentGroup === 'all' ? '暂无字卡' : `「${currentGroup}」为空`);
                modCardList.appendChild(empty);
            } else {
                display.forEach(card => {
                    const realIdx = cardLibrary.indexOf(card);
                    let gName = '';
                    for (const g in groups) {
                        if (groups[g].includes(card)) { gName = g; break; }
                    }
                    const item = document.createElement('span');
                    item.className = 'mod-item';
                    if (cardSelectMode && cardSelected.has(realIdx)) item.classList.add('selected');
                    const label = gName !== 'default' ? `<span class="group-label">${gName}</span>` : '';
                    item.innerHTML = `${card} ${label} <span class="del" data-idx="${realIdx}">✕</span>`;
                    if (cardSelectMode) {
                        item.style.cursor = 'pointer';
                        item.addEventListener('click', function(e) {
                            if (e.target.classList.contains('del')) return;
                            const idx = parseInt(this.querySelector('.del').dataset.idx);
                            toggleCardSelect(idx);
                        });
                    }
                    modCardList.appendChild(item);
                });
                modCardList.querySelectorAll('.del').forEach(el => {
                    el.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const idx = parseInt(this.dataset.idx);
                        if (!isNaN(idx) && idx >= 0 && idx < cardLibrary.length) {
                            const text = cardLibrary[idx];
                            for (const g in groups) {
                                const pos = groups[g].indexOf(text);
                                if (pos !== -1) groups[g].splice(pos, 1);
                            }
                            cardLibrary.splice(idx, 1);
                            cardSelected.clear();
                            renderCards();
                            showToast('已删除一张字卡');
                        }
                    });
                });
            }
            modalCardCount.textContent = `${cardLibrary.length} 张`;
            const allCount = document.getElementById('modAllCount');
            if (allCount) allCount.textContent = total;
            updateCardSelectUI();
        }
        function switchGroup(name) {
            if (name !== 'all' && !groups[name]) name = 'all';
            currentGroup = name;
            cardSelected.clear();
            renderCards();
        }
        function toggleCardSelect(idx) {
            if (cardSelected.has(idx)) cardSelected.delete(idx);
            else cardSelected.add(idx);
            renderCards();
        }
        function updateCardSelectUI() {
            const count = cardSelected.size;
            modSelectInfo.textContent = `已选 ${count}`;
            if (count > 0) {
                modDeleteSelectedBtn.style.display = 'inline-flex';
                modDeleteSelectedBtn.textContent = `删除选中(${count})`;
                modMoveRow.style.display = 'flex';
            } else {
                modDeleteSelectedBtn.style.display = 'none';
                modMoveRow.style.display = 'none';
            }
        }
        function toggleCardSelectMode() {
            cardSelectMode = !cardSelectMode;
            if (!cardSelectMode) { cardSelected.clear();
                modSelectBtn.textContent = '☑ 选择'; } else { modSelectBtn.textContent = '✕ 取消'; }
            renderCards();
        }
function deleteCardSelected() {
            if (!cardSelected.size) return;
            if (!confirm(`删除选中的 ${cardSelected.size} 张字卡？`)) return;
            const sorted = Array.from(cardSelected).sort((a, b) => b - a);
            for (const idx of sorted) {
                const text = cardLibrary[idx];
                for (const g in groups) {
                    const pos = groups[g].indexOf(text);
                    if (pos !== -1) groups[g].splice(pos, 1);
                }
                cardLibrary.splice(idx, 1);
            }
            cardSelected.clear();
            cardSelectMode = false;
            modSelectBtn.textContent = '☑ 选择';
            renderCards();
            showToast(`已删除 ${sorted.length} 张字卡`);
        }
        function moveCardSelected() {
            if (!cardSelected.size) { alert('请先选择字卡'); return; }
            const target = modMoveGroupSelect.value;
            if (!target || !groups[target]) { alert('请选择目标分组'); return; }
            const count = cardSelected.size;
            const cards = [];
            const sorted = Array.from(cardSelected).sort((a, b) => b - a);
            for (const idx of sorted) cards.push(cardLibrary[idx]);
            for (const card of cards) {
                for (const g in groups) {
                    const pos = groups[g].indexOf(card);
                    if (pos !== -1) { groups[g].splice(pos, 1); break; }
                }
                const pos = cardLibrary.indexOf(card);
                if (pos !== -1) cardLibrary.splice(pos, 1);
            }
            groups[target] = groups[target].concat(cards);
            const seen = new Set();
            groups[target] = groups[target].filter(c => { if (seen.has(c)) return false;
                seen.add(c); return true; });
            cardLibrary = [];
            for (const g in groups) cardLibrary = cardLibrary.concat(groups[g]);
            cardSelected.clear();
            cardSelectMode = false;
            modSelectBtn.textContent = '☑ 选择';
            renderCards();
            showToast(`移动 ${count} 张字卡到「${target === 'default' ? '默认' : target}」`);
        }
        function addCardGroup() {
            const name = modGroupInput.value.trim();
            if (!name) { alert('请输入分组名称'); return; }
            if (name === 'all' || name === 'default') { alert('不能使用 "all" 或 "default"'); return; }
            if (groups[name]) { alert(`「${name}」已存在`); return; }
            groups[name] = [];
            groupList.push(name);
            modGroupInput.value = '';
            renderCards();
            showToast(`创建分组「${name}」`);
        }
        function deleteCardGroup() {
            if (groupList.length <= 1) { alert('至少保留一个分组'); return; }
            const name = prompt('输入要删除的分组名（字卡移至"默认"）：');
            if (!name || name === 'default') { if (name === 'default') alert('不能删除默认分组'); return; }
            if (!groups[name]) { alert(`「${name}」不存在`); return; }
            if (!confirm(`删除「${name}」？${groups[name].length} 张字卡移至"默认"`)) return;
            if (groups[name].length) {
                groups['default'] = groups['default'].concat(groups[name]);
                const seen = new Set();
                groups['default'] = groups['default'].filter(c => { if (seen.has(c)) return false;
                    seen.add(c); return true; });
                cardLibrary = [];
                for (const g in groups) cardLibrary = cardLibrary.concat(groups[g]);
            }
            delete groups[name];
            const idx = groupList.indexOf(name);
            if (idx !== -1) groupList.splice(idx, 1);
            if (currentGroup === name) currentGroup = 'all';
            renderCards();
            showToast(`已删除分组「${name}」`);
        }
        function batchImportCards() {
            const raw = modBatchInput.value;
            if (!raw.trim()) { alert('请输入字卡内容'); return; }
            const lines = raw.split('\n').map(l => l.trim()).filter(l => l);
            if (!lines.length) { alert('没有有效内容'); return; }
            const target = modBatchGroupSelect.value;
            if (!groups[target]) { alert('目标分组不存在'); return; }
            const existing = new Set(groups[target]);
            const added = lines.filter(l => !existing.has(l));
            if (!added.length) {
                showToast('所有字卡已存在于该分组，无需重复添加');
                modBatchInput.value = '';
                return;
            }
            groups[target] = groups[target].concat(added);
            cardLibrary = [];
            for (const g in groups) cardLibrary = cardLibrary.concat(groups[g]);
            modBatchInput.value = '';
            renderCards();
            showToast(`导入 ${added.length} 张字卡到「${target === 'default' ? '默认' : target}」`);
        }
        function clearAllCards() {
            if (!cardLibrary.length) return;
            if (!confirm('确定清空所有字卡吗？')) return;
            for (const g in groups) groups[g] = [];
            cardLibrary = [];
            currentGroup = 'all';
            cardSelected.clear();
            renderCards();
            showToast('字卡已清空');
        }
function resetDefaultCards() {
            if (cardLibrary.length && !confirm('覆盖当前字卡？')) return;
            groups = { default: [...DEFAULT_CARDS] };
            groupList = ['default'];
            cardLibrary = [...DEFAULT_CARDS];
            currentGroup = 'all';
            cardSelected.clear();
            cardSelectMode = false;
            modSelectBtn.textContent = '☑ 选择';
            renderCards();
            showToast('已恢复默认字卡');
        }
        // ===== 表情包渲染（带分组） =====
        function renderEmojis() {
            if (!emojiGroupTabs) return;
            emojiGroupTabs.innerHTML = '';
            let total = 0;
            for (const g in emojiGroups) total += emojiGroups[g].length;
            const allTab = document.createElement('span');
            allTab.className = `mod-group-tab ${emojiCurrentGroup === 'all' ? 'active' : ''}`;
            allTab.dataset.group = 'all';
            allTab.innerHTML = `全部 <span class="count">${total}</span>`;
            allTab.addEventListener('click', () => switchEmojiGroup('all'));
            emojiGroupTabs.appendChild(allTab);
            for (const gName of emojiGroupList) {
                if (gName === 'default') continue;
                const tab = document.createElement('span');
                tab.className = `mod-group-tab ${emojiCurrentGroup === gName ? 'active' : ''}`;
                tab.dataset.group = gName;
                const count = emojiGroups[gName] ? emojiGroups[gName].length : 0;
                tab.innerHTML = `${gName} <span class="count">${count}</span>`;
                tab.addEventListener('click', () => switchEmojiGroup(gName));
                emojiGroupTabs.appendChild(tab);
            }
            emojiGroupSelect.innerHTML = '';
            for (const g of emojiGroupList) {
                const opt = document.createElement('option');
                opt.value = g;
                opt.textContent = g === 'default' ? '默认' : g;
                emojiGroupSelect.appendChild(opt);
            }
            emojiMoveGroupSelect.innerHTML = '<option value="">移动到...</option>';
            for (const g of emojiGroupList) {
                const opt = document.createElement('option');
                opt.value = g;
                opt.textContent = g === 'default' ? '默认' : g;
                emojiMoveGroupSelect.appendChild(opt);
            }
            let display = [];
            if (emojiCurrentGroup === 'all') {
                for (const g in emojiGroups) display = display.concat(emojiGroups[g]);
            } else if (emojiGroups[emojiCurrentGroup]) {
                display = emojiGroups[emojiCurrentGroup];
            } else {
                emojiCurrentGroup = 'all';
                for (const g in emojiGroups) display = display.concat(emojiGroups[g]);
            }
            const kw = emojiSearch.trim().toLowerCase();
            if (kw) display = display.filter(e => e.toLowerCase().includes(kw));
            emojiList.innerHTML = '';
            if (!display.length) {
                const empty = document.createElement('span');
                empty.className = 'mod-empty';
                empty.textContent = kw ? '未找到匹配表情' : (emojiCurrentGroup === 'all' ? '暂无表情' : `「${emojiCurrentGroup}」为空`);
                emojiList.appendChild(empty);
            } else {
                const allEmojis = [];
                for (const g in emojiGroups) allEmojis.push(...emojiGroups[g]);
                display.forEach(e => {
                    const realIdx = allEmojis.indexOf(e);
                    let gName = '';
                    for (const g in emojiGroups) {
                        if (emojiGroups[g].includes(e)) { gName = g; break; }
                    }
                    const item = document.createElement('span');
                    item.className = 'mod-item';
                    if (emojiSelectMode && emojiSelected.has(realIdx)) item.classList.add('selected');
                    const label = gName !== 'default' ? `<span class="group-label">${gName}</span>` : '';
                    item.innerHTML = `${e} ${label} <span class="del" data-emoji="${e}">✕</span>`;
                    if (emojiSelectMode) {
                        item.style.cursor = 'pointer';
                        item.addEventListener('click', function(e) {
                            if (e.target.classList.contains('del')) return;
                            const emoji = this.querySelector('.del').dataset.emoji;
                            const idx = allEmojis.indexOf(emoji);
                            toggleEmojiSelect(idx);
                        });
                    }
                    emojiList.appendChild(item);
                });
emojiList.querySelectorAll('.del').forEach(el => {
                    el.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const emoji = this.dataset.emoji;
                        for (const g in emojiGroups) {
                            const pos = emojiGroups[g].indexOf(emoji);
                            if (pos !== -1) emojiGroups[g].splice(pos, 1);
                        }
                        emojiSelected.clear();
                        renderEmojis();
                        showToast('已删除');
                    });
                });
            }
            const allEmojisCount = Object.values(emojiGroups).reduce((a, b) => a + b.length, 0);
            emojiCount.textContent = `${allEmojisCount} 个`;
            emojiAllCount.textContent = total;
            updateEmojiSelectUI();
        }
        function switchEmojiGroup(name) {
            if (name !== 'all' && !emojiGroups[name]) name = 'all';
            emojiCurrentGroup = name;
            emojiSelected.clear();
            renderEmojis();
        }
        function toggleEmojiSelect(idx) {
            if (emojiSelected.has(idx)) emojiSelected.delete(idx);
            else emojiSelected.add(idx);
            renderEmojis();
        }
        function updateEmojiSelectUI() {
            const count = emojiSelected.size;
            emojiSelectInfo.textContent = `已选 ${count}`;
            if (count > 0) {
                emojiDeleteSelectedBtn.style.display = 'inline-flex';
                emojiDeleteSelectedBtn.textContent = `删除选中(${count})`;
                emojiMoveRow.style.display = 'flex';
            } else {
                emojiDeleteSelectedBtn.style.display = 'none';
                emojiMoveRow.style.display = 'none';
            }
        }
        function toggleEmojiSelectMode() {
            emojiSelectMode = !emojiSelectMode;
            if (!emojiSelectMode) { emojiSelected.clear();
                emojiSelectBtn.textContent = '☑ 选择'; } else { emojiSelectBtn.textContent = '✕ 取消'; }
            renderEmojis();
        }
        function deleteEmojiSelected() {
            if (!emojiSelected.size) return;
            if (!confirm(`删除选中的 ${emojiSelected.size} 个表情？`)) return;
            const allEmojis = [];
            for (const g in emojiGroups) allEmojis.push(...emojiGroups[g]);
            const sorted = Array.from(emojiSelected).sort((a, b) => b - a);
            for (const idx of sorted) {
                const e = allEmojis[idx];
                for (const g in emojiGroups) {
                    const pos = emojiGroups[g].indexOf(e);
                    if (pos !== -1) emojiGroups[g].splice(pos, 1);
                }
            }
            emojiSelected.clear();
            emojiSelectMode = false;
            emojiSelectBtn.textContent = '☑ 选择';
            renderEmojis();
            showToast(`已删除 ${sorted.length} 个表情`);
        }
        function moveEmojiSelected() {
            if (!emojiSelected.size) { alert('请先选择表情'); return; }
            const target = emojiMoveGroupSelect.value;
            if (!target || !emojiGroups[target]) { alert('请选择目标分组'); return; }
            const allEmojis = [];
            for (const g in emojiGroups) allEmojis.push(...emojiGroups[g]);
            const count = emojiSelected.size;
            const items = [];
            const sorted = Array.from(emojiSelected).sort((a, b) => b - a);
            for (const idx of sorted) items.push(allEmojis[idx]);
            for (const e of items) {
                for (const g in emojiGroups) {
                    const pos = emojiGroups[g].indexOf(e);
                    if (pos !== -1) { emojiGroups[g].splice(pos, 1); break; }
                }
            }
            emojiGroups[target] = emojiGroups[target].concat(items);
            const seen = new Set();
            emojiGroups[target] = emojiGroups[target].filter(e => { if (seen.has(e)) return false;
                seen.add(e); return true; });
            emojiSelected.clear();
            emojiSelectMode = false;
            emojiSelectBtn.textContent = '☑ 选择';
            renderEmojis();
            showToast(`移动 ${count} 个表情到「${target === 'default' ? '默认' : target}」`);
        }
        function addEmoji() {
            const val = emojiInput.value.trim();
            if (!val) { alert('请输入表情'); return; }
            const target = emojiGroupSelect.value;
            if (!emojiGroups[target]) { alert('目标分组不存在'); return; }
            if (emojiGroups[target].includes(val)) { showToast('已存在'); return; }
            emojiGroups[target].push(val);
            emojiInput.value = '';
            renderEmojis();
            showToast('已添加');
        }
        function clearEmojis() {
            const total = Object.values(emojiGroups).reduce((a, b) => a + b.length, 0);
            if (!total) return;
            if (!confirm('清空所有表情？')) return;
            for (const g in emojiGroups) emojiGroups[g] = [];
            emojiSelected.clear();
            renderEmojis();
            showToast('已清空');
        }
function resetEmojis() {
            if (Object.values(emojiGroups).reduce((a, b) => a + b.length, 0) && !confirm('恢复默认表情？')) return;
            emojiGroups = { default: [...DEFAULT_EMOJIS] };
            emojiGroupList = ['default'];
            emojiCurrentGroup = 'all';
            emojiSelected.clear();
            emojiSelectMode = false;
            emojiSelectBtn.textContent = '☑ 选择';
            renderEmojis();
            showToast('已恢复默认');
        }
        // ===== 拍一拍渲染（带分组） =====
        function renderPats() {
            if (!patGroupTabs) return;
            patGroupTabs.innerHTML = '';
            let total = 0;
            for (const g in patGroups) total += patGroups[g].length;
            const allTab = document.createElement('span');
            allTab.className = `mod-group-tab ${patCurrentGroup === 'all' ? 'active' : ''}`;
            allTab.dataset.group = 'all';
            allTab.innerHTML = `全部 <span class="count">${total}</span>`;
            allTab.addEventListener('click', () => switchPatGroup('all'));
            patGroupTabs.appendChild(allTab);
            for (const gName of patGroupList) {
                if (gName === 'default') continue;
                const tab = document.createElement('span');
                tab.className = `mod-group-tab ${patCurrentGroup === gName ? 'active' : ''}`;
                tab.dataset.group = gName;
                const count = patGroups[gName] ? patGroups[gName].length : 0;
                tab.innerHTML = `${gName} <span class="count">${count}</span>`;
                tab.addEventListener('click', () => switchPatGroup(gName));
                patGroupTabs.appendChild(tab);
            }
            patGroupSelect.innerHTML = '';
            for (const g of patGroupList) {
                const opt = document.createElement('option');
                opt.value = g;
                opt.textContent = g === 'default' ? '默认' : g;
                patGroupSelect.appendChild(opt);
            }
            patMoveGroupSelect.innerHTML = '<option value="">移动到...</option>';
            for (const g of patGroupList) {
                const opt = document.createElement('option');
                opt.value = g;
                opt.textContent = g === 'default' ? '默认' : g;
                patMoveGroupSelect.appendChild(opt);
            }
            let display = [];
            if (patCurrentGroup === 'all') {
                for (const g in patGroups) display = display.concat(patGroups[g]);
            } else if (patGroups[patCurrentGroup]) {
                display = patGroups[patCurrentGroup];
            } else {
                patCurrentGroup = 'all';
                for (const g in patGroups) display = display.concat(patGroups[g]);
            }
            const kw = patSearch.trim().toLowerCase();
            if (kw) display = display.filter(p => p.toLowerCase().includes(kw));
            patList.innerHTML = '';
            if (!display.length) {
                const empty = document.createElement('span');
                empty.className = 'mod-empty';
                empty.textContent = kw ? '未找到匹配拍一拍' : (patCurrentGroup === 'all' ? '暂无拍一拍' : `「${patCurrentGroup}」为空`);
                patList.appendChild(empty);
            } else {
                const allPats = [];
                for (const g in patGroups) allPats.push(...patGroups[g]);
                display.forEach(p => {
                    const realIdx = allPats.indexOf(p);
                    let gName = '';
                    for (const g in patGroups) {
                        if (patGroups[g].includes(p)) { gName = g; break; }
                    }
                    const item = document.createElement('span');
                    item.className = 'mod-item';
                    if (patSelectMode && patSelected.has(realIdx)) item.classList.add('selected');
                    const label = gName !== 'default' ? `<span class="group-label">${gName}</span>` : '';
                    item.innerHTML = `${p} ${label} <span class="del" data-pat="${p}">✕</span>`;
                    if (patSelectMode) {
                        item.style.cursor = 'pointer';
                        item.addEventListener('click', function(e) {
                            if (e.target.classList.contains('del')) return;
                            const pat = this.querySelector('.del').dataset.pat;
                            const idx = allPats.indexOf(pat);
                            togglePatSelect(idx);
                        });
                    }
                    patList.appendChild(item);
                });
                patList.querySelectorAll('.del').forEach(el => {
                    el.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const pat = this.dataset.pat;
                        for (const g in patGroups) {
                            const pos = patGroups[g].indexOf(pat);
                            if (pos !== -1) patGroups[g].splice(pos, 1);
                        }
                        patSelected.clear();
                        renderPats();
                        showToast('已删除');
                    });
                });
            }
   const allPatsCount = Object.values(patGroups).reduce((a, b) => a + b.length, 0);
            patCount.textContent = `${allPatsCount} 个`;
            patAllCount.textContent = total;
            updatePatSelectUI();
        }
        function switchPatGroup(name) {
            if (name !== 'all' && !patGroups[name]) name = 'all';
            patCurrentGroup = name;
            patSelected.clear();
            renderPats();
        }
        function togglePatSelect(idx) {
            if (patSelected.has(idx)) patSelected.delete(idx);
            else patSelected.add(idx);
            renderPats();
        }
        function updatePatSelectUI() {
            const count = patSelected.size;
            patSelectInfo.textContent = `已选 ${count}`;
            if (count > 0) {
                patDeleteSelectedBtn.style.display = 'inline-flex';
                patDeleteSelectedBtn.textContent = `删除选中(${count})`;
                patMoveRow.style.display = 'flex';
            } else {
                patDeleteSelectedBtn.style.display = 'none';
                patMoveRow.style.display = 'none';
            }
        }
        function togglePatSelectMode() {
            patSelectMode = !patSelectMode;
            if (!patSelectMode) { patSelected.clear();
                patSelectBtn.textContent = '☑ 选择'; } else { patSelectBtn.textContent = '✕ 取消'; }
            renderPats();
        }
        function deletePatSelected() {
            if (!patSelected.size) return;
            if (!confirm(`删除选中的 ${patSelected.size} 个拍一拍？`)) return;
            const allPats = [];
            for (const g in patGroups) allPats.push(...patGroups[g]);
            const sorted = Array.from(patSelected).sort((a, b) => b - a);
            for (const idx of sorted) {
                const p = allPats[idx];
                for (const g in patGroups) {
                    const pos = patGroups[g].indexOf(p);
                    if (pos !== -1) patGroups[g].splice(pos, 1);
                }
            }
            patSelected.clear();
            patSelectMode = false;
            patSelectBtn.textContent = '☑ 选择';
            renderPats();
            showToast(`已删除 ${sorted.length} 个拍一拍`);
        }
        function movePatSelected() {
            if (!patSelected.size) { alert('请先选择拍一拍'); return; }
            const target = patMoveGroupSelect.value;
            if (!target || !patGroups[target]) { alert('请选择目标分组'); return; }
            const allPats = [];
            for (const g in patGroups) allPats.push(...patGroups[g]);
            const count = patSelected.size;
            const items = [];
            const sorted = Array.from(patSelected).sort((a, b) => b - a);
            for (const idx of sorted) items.push(allPats[idx]);
            for (const p of items) {
                for (const g in patGroups) {
                    const pos = patGroups[g].indexOf(p);
                    if (pos !== -1) { patGroups[g].splice(pos, 1); break; }
                }
            }
            patGroups[target] = patGroups[target].concat(items);
            const seen = new Set();
            patGroups[target] = patGroups[target].filter(p => { if (seen.has(p)) return false;
                seen.add(p); return true; });
            patSelected.clear();
            patSelectMode = false;
            patSelectBtn.textContent = '☑ 选择';
            renderPats();
            showToast(`移动 ${count} 个拍一拍到「${target === 'default' ? '默认' : target}」`);
        }
        function addPat() {
            const val = patInput.value.trim();
            if (!val) { alert('请输入拍一拍内容'); return; }
            const target = patGroupSelect.value;
            if (!patGroups[target]) { alert('目标分组不存在'); return; }
            if (patGroups[target].includes(val)) { showToast('已存在'); return; }
            patGroups[target].push(val);
            patInput.value = '';
            renderPats();
            showToast('已添加');
        }
        function clearPats() {
            const total = Object.values(patGroups).reduce((a, b) => a + b.length, 0);
            if (!total) return;
            if (!confirm('清空所有拍一拍？')) return;
            for (const g in patGroups) patGroups[g] = [];
            patSelected.clear();
            renderPats();
            showToast('已清空');
        }
        function resetPats() {
            if (Object.values(patGroups).reduce((a, b) => a + b.length, 0) && !confirm('恢复默认拍一拍？')) return;
            patGroups = { default: [...DEFAULT_PATS] };
            patGroupList = ['default'];
            patCurrentGroup = 'all';
            patSelected.clear();
            patSelectMode = false;
            patSelectBtn.textContent = '☑ 选择';
            renderPats();
            showToast('已恢复默认');
        }
   // ===== 通话 =====
        function updateCallUI(state, msg) {
            const map = {
                idle: { btn: '📞 呼叫', showHangup: false, dot: 'off', text: '💤 待机中' },
                calling: { btn: '📞 呼叫中', showHangup: true, dot: 'calling', text: '📞 正在呼叫...' },
                connected: { btn: '📞 通话中', showHangup: true, dot: 'on', text: '💬 通话中...' }
            };
            const s = map[state] || map.idle;
            callBtn.textContent = s.btn;
            callBtn.className = `btn-call${state === 'calling' ? ' ringing' : ''}`;
            hangupBtn.style.display = s.showHangup ? 'inline-flex' : 'none';
            callDreamerDot.className = `dot ${s.dot}`;
            callAngleDot.className = `dot ${s.dot}`;
            callStatusText.textContent = msg || s.text;
            callState = state;
        }
        function startCall() {
            if (callState === 'calling' || callState === 'connected') return;
            updateCallUI('calling');
            addChatMessage(`📞 ${userName}拨通了${angleName}的视频...`, 'system');
            if (callTimer) clearTimeout(callTimer);
            callTimer = setTimeout(() => {
                if (callState === 'calling') {
                    updateCallUI('connected');
                    addChatMessage(`💬 ${angleName}接听了视频通话！`, 'system');
                    callTimer = setTimeout(() => {
                        if (callState === 'connected') {
                            addChatMessage(`🌙 ${angleName}：我一直在看着你……`, 'system');
                        }
                    }, 3000);
                }
            }, 2000);
        }
        function hangupCall() {
            if (callTimer) { clearTimeout(callTimer);
                callTimer = null; }
            const was = callState === 'connected';
            updateCallUI('idle');
            addChatMessage(was ? '📴 视频通话已挂断' : '📴 已取消呼叫', 'system');
        }
        function replyWithRandomCard() {
            if (!cardLibrary.length) {
                addChatMessage(`${angleName}沉默不语…… 字卡空空如也。`, 'system');
                return;
            }
            const idx = Math.floor(Math.random() * cardLibrary.length);
            addChatMessage(`✦ ${cardLibrary[idx]}`, 'angle');
        }
        function handleSend() {
            const text = userInput.value.trim();
            if (!text) return;
            addChatMessage(text, 'user');
            userInput.value = '';
            userInput.focus();
            setTimeout(replyWithRandomCard, 300);
        }
        // ===== 子板块弹窗辅助 =====
        function openSubModal(modal) {
            closeModal(settingsModal);
            openModal(modal);
        }
        // ===== 留言板 & 许愿树：话语库管理 =====
        function renderPhraseTabs() {
            const wrap = document.getElementById('phraseTabs');
            if (!wrap) return;
            wrap.innerHTML = '';
            const allTab = document.createElement('span');
            allTab.className = 'mod-group-tab active'; allTab.dataset.group='all'; allTab.textContent = '全部';
            wrap.appendChild(allTab);
            STAR_COLORS.forEach(function(c){
                const t = document.createElement('span');
                t.className = 'mod-group-tab'; t.dataset.group = c.key; t.textContent = c.emoji + ' ' + c.label;
                wrap.appendChild(t);
            });
            wrap.querySelectorAll('.mod-group-tab').forEach(function(t){
                t.addEventListener('click', function(){
                    wrap.querySelectorAll('.mod-group-tab').forEach(function(x){x.classList.remove('active');});
                    t.classList.add('active');
                    renderPhraseList(t.dataset.group);
                });
            });
        }
        function currentPhrases() { return phraseKind === 'wish' ? appearance.wishTree.phrases : appearance.messageBoard.phrases; }
        function renderPhraseList(group) {
            const list = document.getElementById('phraseList'); if (!list) return;
            const src = currentPhrases();
            let arr = [];
            if (group === 'all') Object.keys(src).forEach(function(k){ src[k].forEach(function(x){ arr.push({k:k,x:x}); }); });
            else arr = (src[group]||[]).map(function(x){ return {k:group,x:x}; });
            const q = (document.getElementById('phraseSearchInput')||{}).value || '';
            if (q) arr = arr.filter(function(a){ return a.x.indexOf(q) >= 0; });
            list.innerHTML = '';
            if (!arr.length) { list.innerHTML = '<span class="mod-empty">空空如也～</span>'; return; }
            arr.forEach(function(kv){
                const item = document.createElement('div');
                item.className = 'mod-item';
                item.innerHTML = '<span>'+escapeHtml(kv.x)+'</span><span class="del" title="删除">✕</span>';
                item.querySelector('.del').onclick = function() {
                    const p = currentPhrases()[kv.k]; const i = p.indexOf(kv.x);
                    if (i>=0) p.splice(i,1); renderPhraseList(group); saveAppearance();
                };
                list.appendChild(item);
            });
        }
        function openPhraseModal(kind) {
            phraseKind = kind;
            document.getElementById('phraseTitle').textContent = kind === 'wish' ? '📝 愿望话语库' : '📝 留言话语库';
            document.getElementById('phraseSearchInput').value = '';
            renderPhraseTabs(); renderPhraseList('all');
            openModal(phraseModal);
        }
        // ===== 留言板 =====
        function openBoardModal() { openModal(boardModal); renderBoard(); }
        function renderBoard() {
            const bg = document.getElementById('boardBg');
            if (bg) {
                bg.classList.remove('lines','grid','blank');
                bg.classList.add(appearance.board_boardStyle || 'lines');
                document.querySelectorAll('#boardStyleSwitch .chip').forEach(function(c){
                    c.classList.toggle('active', c.dataset.v === (appearance.board_boardStyle||'lines'));
                });
            }
            const grid = document.getElementById('boardGrid');
            grid.innerHTML = '';
            const notes = appearance.messageBoard.notes;
            const bc = document.getElementById('boardCount');
            if (bc) bc.textContent = notes.length + ' 张';
            if (!notes.length) {
                grid.innerHTML = '<span style="grid-column:1/-1;text-align:center;font-size:0.75rem;color:var(--text_muted);padding:40px 0;">📋 还没有小纸条～点击右上角抽一张吧 ✨</span>';
            }
            const rots = [-1.5, 1.8, -0.8, 1.2, -2.0];
            notes.forEach(function(n, idx){
                const el = document.createElement('div');
                el.className = 'board-note' + (n.read ? '' : ' unread');
                el.style.transform = 'rotate(' + (rots[idx%rots.length]||-1) + 'deg)';
                el.innerHTML = '<div class="nt-head"><span>📋 '+(n.colorLabel||'')+'</span><span style="opacity:0.55;">'+(n.timeStr||'')+'</span></div>'
                    + '<div class="nt-content">'+escapeHtml(n.content)+'</div>'
                    + '<div class="nt-footer">'+(n.replied ? '💬 已回复':'')+'</div>';
                el.onclick = function(){ openBoardDetail(n, idx); };
                grid.appendChild(el);
            });
            const today = todayKey();
            if (appearance.messageBoard.todayDate !== today) { appearance.messageBoard.todayDate = today; appearance.messageBoard.todayCount = 0; saveAppearance(); }
            const btn = document.getElementById('drawBoardNoteBtn');
            if (btn) {
                btn.disabled = appearance.messageBoard.todayCount >= DAILY_NOTE_CAP;
                btn.title = btn.disabled ? ('今日已达上限（'+DAILY_NOTE_CAP+'张）') : ('今日剩余 '+(DAILY_NOTE_CAP-appearance.messageBoard.todayCount)+' 张');
                btn.textContent = btn.disabled ? ('今日已达 '+DAILY_NOTE_CAP+'张') : '📨 抽一张小纸条';
            }
        }
        function drawBoardNote() {
            const today = todayKey();
            if (appearance.messageBoard.todayDate !== today) { appearance.messageBoard.todayDate = today; appearance.messageBoard.todayCount = 0; }
            if (appearance.messageBoard.todayCount >= DAILY_NOTE_CAP) { showToast('今日已达 '+DAILY_NOTE_CAP+' 张小纸条上限啦～'); return; }
            const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
            const pool = (appearance.messageBoard.phrases[color.key] || []).slice();
            let content;
            if (!pool.length) { Object.values(appearance.messageBoard.phrases).forEach(function(p){ p.forEach(function(x){pool.push(x);}); }); }
            if (!pool.length) content = '一张有故事的小纸条～';
            else content = pool[Math.floor(Math.random() * pool.length)];
            const now = new Date();
            const note = {
                id: 'BN'+now.getTime()+Math.floor(Math.random()*1e4),
                colorKey: color.key, colorLabel: color.emoji+color.label, content: content,
                read:false, replied:false, replies:[], ts:now.getTime(),
                timeStr: String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')
            };
            appearance.messageBoard.notes.unshift(note);
            appearance.messageBoard.todayCount++;
            saveAppearance(); renderBoard();
        }
        function openBoardDetail(n) {
            n.read = true; saveAppearance();
            const wrap = document.getElementById('boardDetailWrap');
            wrap.innerHTML = ''
                + '<div class="board-detail">'
                + '<div class="detail-original"><strong>'+(n.colorLabel||'')+' 📋</strong><br>'+escapeHtml(n.content)+'<br><small style="opacity:0.4;">'+(n.timeStr||'')+'</small></div>'
                + '<div class="detail-replies" id="bdReplies"></div>'
                + '<div class="reply-form">'
                + '<textarea id="bdReplyText" placeholder="写下梦角的回复..."></textarea>'
                + '<div class="reply-form-row">'
                + '<label><input type="checkbox" id="bdSendChat"> 回复发送到聊天界面</label>'
                + '<button class="btn-primary-mod" id="bdSendReply">💌 发送回复</button>'
                + '</div></div></div>';
            const rbox = document.getElementById('bdReplies');
            (n.replies||[]).forEach(function(r){
                const d = document.createElement('div'); d.className='detail-reply';
                d.innerHTML = '<small style="opacity:0.4;">'+r.ts+'</small><br>'+escapeHtml(r.text);
                rbox.appendChild(d);
            });
            document.getElementById('bdSendReply').onclick = function(){
                const t = (document.getElementById('bdReplyText').value||'').trim();
                if (!t) return showToast('请写点回复内容～');
                const now = new Date();
                const ts = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
                n.replies = n.replies || []; n.replies.push({text:t, ts:ts}); n.replied = true;
                saveAppearance(); renderBoard();
                if (document.getElementById('bdSendChat').checked) sendReplyToChat({type:'board', original:n.content, reply:t});
                openBoardDetail(n);
            };
        }
        // ===== 许愿树 =====
        function openWishModal() { openModal(wishModal); renderWishTree(); }
        function renderWishTree() {
            const cc = document.getElementById('canopyContainer');
            cc.innerHTML = '';
            const stars = appearance.wishTree.stars;
            const wc = document.getElementById('wishCount');
            if (wc) wc.textContent = stars.length + ' 颗';
            if (!stars.length) {
                const hint = document.createElement('div');
                hint.style.cssText='color:var(--text_muted);font-size:0.75rem;opacity:0.85;text-align:center;padding:0 18px;';
                hint.textContent = '🌳 树叶空空如也，快点击右上角摘取一颗星星吧 ✨';
                cc.appendChild(hint);
            }
            const cw = cc.clientWidth || 360, ch = cc.clientHeight || 300;
            stars.forEach(function(s, i){
                const el = document.createElement('div');
                const col = STAR_COLORS.find(function(c){ return c.key === s.colorKey; }) || STAR_COLORS[0];
                const W = s.size || 78;
                el.className = 'star-item' + (s.read ? '' : ' unread');
                el.style.width = W + 'px'; el.style.height = W + 'px';
                const px = s.px, py = s.py;
                const leftPct = Math.max(0.04, Math.min(0.94, px));
                const topPct  = Math.max(0.04, Math.min(0.94, py));
                el.style.left = 'calc(' + (leftPct*100).toFixed(1) + '% - ' + Math.round(W/2) + 'px)';
                el.style.top  = 'calc(' + (topPct*100).toFixed(1)  + '% - ' + Math.round(W/2) + 'px)';
                const rot = (s.rot !== undefined ? s.rot : 0);
                el.style.transform = 'rotate('+rot+'deg)';
                el.style.background = 'radial-gradient(circle at 30% 25%, '+col.light+' 0%, '+col.main+' 55%, '+col.deep+' 100%)';
                const cp = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
                el.style.clipPath = cp;
                el.style.WebkitClipPath = cp;
                el.style.filter = 'drop-shadow(0 0 6px rgba(255,255,255,0.45)) drop-shadow(0 0 14px '+col.main+'aa)';
                el.title = col.label + ' 愿望';
                (function(star){ el.onclick = function(ev){ ev.stopPropagation(); openWishDetail(star); }; })(s);
                cc.appendChild(el);
            });
            const today = todayKey();
            if (appearance.wishTree.todayDate !== today) { appearance.wishTree.todayDate = today; appearance.wishTree.todayCount = 0; saveAppearance(); }
            const btn = document.getElementById('drawWishStarBtn');
            if (btn) {
                btn.disabled = appearance.wishTree.todayCount >= DAILY_WISH_CAP;
                btn.textContent = btn.disabled ? ('今日已达 '+DAILY_WISH_CAP+' 颗') : '✨ 摘取星星';
            }
        }
        function drawWishStar() {
            const today = todayKey();
            if (appearance.wishTree.todayDate !== today) { appearance.wishTree.todayDate = today; appearance.wishTree.todayCount = 0; }
            if (appearance.wishTree.todayCount >= DAILY_WISH_CAP) { showToast('今日已达 '+DAILY_WISH_CAP+' 颗星星上限啦～'); return; }
            const t = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * 0.78;
            const px = 0.5 + Math.cos(t) * r * 0.44;
            const py = 0.55 + Math.sin(t) * r * 0.38;
            const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
            const pool = (appearance.wishTree.phrases[color.key] || []).slice();
            let content;
            if (!pool.length) Object.values(appearance.wishTree.phrases).forEach(function(p){ p.forEach(function(x){ pool.push(x); }); });
            if (!pool.length) content = '一颗发光的愿望，等待你发现。';
            else content = pool[Math.floor(Math.random() * pool.length)];
            const rot = Math.round((Math.random() * 30 - 15));
            const size = 60 + Math.round(Math.random() * 32);
            const now = new Date();
            const star = {
                id:'WS'+now.getTime()+Math.floor(Math.random()*1e4),
                colorKey: color.key, colorLabel: color.emoji+color.label,
                content: content, px: px, py: py, rot: rot, size: size,
                read:false, replied:false, replies:[], ts:now.getTime(),
                timeStr: String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')
            };
            appearance.wishTree.stars.unshift(star);
            appearance.wishTree.todayCount++;
            saveAppearance();
            setTimeout(renderWishTree, 12);
        }
        function openWishDetail(s) {
            s.read = true; saveAppearance();
            const col = STAR_COLORS.find(function(c){ return c.key === s.colorKey; }) || STAR_COLORS[0];
            const wrap = document.getElementById('wishDetailWrap');
            wrap.innerHTML = ''
                + '<div class="wish-detail">'
                + '<div class="detail-original"><strong>'+s.colorLabel+' 许愿星</strong><br>'+escapeHtml(s.content)+'<br><small style="opacity:0.4;">'+(s.timeStr||'')+'</small></div>'
                + '<div class="detail-replies" id="wsReplies"></div>'
                + '<div class="reply-form">'
                + '<textarea id="wsReplyText" placeholder="写下ta的回信..."></textarea>'
                + '<div class="reply-form-row">'
                + '<label><input type="checkbox" id="wsSendChat"> 回复发送到聊天界面</label>'
                + '<button class="btn-primary-mod" id="wsSendReply">💌 发送回信</button>'
                + '</div></div></div>';
            const rbox = document.getElementById('wsReplies');
            (s.replies||[]).forEach(function(r){
                const d = document.createElement('div'); d.className='detail-reply';
                d.innerHTML = '<small style="opacity:0.4;">'+r.ts+'</small><br>'+escapeHtml(r.text);
                rbox.appendChild(d);
            });
            document.getElementById('wsSendReply').onclick = function(){
                const t = (document.getElementById('wsReplyText').value||'').trim();
                if (!t) return showToast('请写点回信内容～');
                const now = new Date();
                const ts = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
                s.replies = s.replies || []; s.replies.push({text:t, ts:ts}); s.replied = true;
                saveAppearance();
                if (document.getElementById('wsSendChat').checked) sendReplyToChat({type:'wish', original:s.content, reply:t, color:col.emoji});
                openWishDetail(s);
            };
        }
        // ===== 聊天设置 UI =====
        function renderChatSettingsForm() {
            const form = document.getElementById('chatSettingsForm'); if (!form) return;
            const s = Object.assign({}, CHAT_SETTINGS_DEFAULT, appearance.chatSettings || {});
            const ROWS = [
                ['select',   'chatFontFamily',    '字体',       CHAT_FONT_OPTIONS],
                ['range',    'chatFontSize',      '字号（rem）', {min:0.68, max:0.92, step:0.02, unit:' '}],
                ['range',    'chatLineHeight',    '行高',       {min:1.2,  max:2.0,  step:0.05, unit:' '}],
                ['range',    'chatLetterSpacing', '字距（px）', {min:-1,   max:3,    step:0.5,  unit:' '}],
                ['select',   'chatDensity',       '气泡密度',   [['compact','紧凑'],['normal','标准'],['relaxed','舒展']]],
                ['range',    'bubbleWidthPct',    '气泡最大宽度（%）', {min:50, max:90, step:1, unit:'%'}],
                ['range',    'bubbleRadius',      '气泡圆角（px）', {min:0,  max:26, step:1, unit:'px'}],
                ['range',    'chatAnimDuration',  '入场动画（秒）', {min:0, max:0.8, step:0.02, unit:'s'}],
                ['range',    'chatBgOpacity',     '聊天背景不透明度', {min:0.3, max:1, step:0.05, unit:'×'}],
                ['select',   'avatarShape',       '头像形状',   [['circle','圆形'],['rounded','圆角方'],['square','方形']]],
                ['select',   'showNickname',      '昵称显示',   [['always','全部显示'],['first','首条显示'],['never','不显示']]],
                ['select',   'showTimeFormat',    '时间格式',   [['auto','自动'],['12h','12 小时'],['24h','24 小时'],['off','不显示']]],
                ['select',   'chatBgPattern',     '聊天背景纹理',[['none','无'],['dots','小点点'],['grid','细网格'],['lines','横纹'],['noise','颗粒']]],
                ['toggle',   'showBubbleTail',    '气泡小尾巴'],
                ['toggle',   'showDateDivider',   '日期分隔线'],
                ['toggle',   'showReadReceipt',   '已读回执'],
                ['toggle',   'enableSound',       '提示音'],
                ['toggle',   'bubbleShadow',      '气泡阴影'],
                ['toggle',   'showAvatarOutside', '头像在气泡外']
            ];
            form.innerHTML = '';
            const patchForm = {};
            ROWS.forEach(function(row){
                const type=row[0], key=row[1], label=row[2], opts=row[3];
                const wrap = document.createElement('div');
                wrap.className = 'theme-row';
                wrap.style.flexDirection = type==='range'?'column':'row';
                wrap.style.alignItems = 'stretch';
                wrap.style.minHeight = (type==='range')?'58px':'40px';
                const top = document.createElement('div');
                top.style.display='flex'; top.style.justifyContent='space-between'; top.style.alignItems='center'; top.style.gap='6px';
                const lbl = document.createElement('label'); lbl.textContent = label;
                lbl.style.fontSize='0.66rem'; lbl.style.color='var(--text_secondary)'; lbl.style.fontWeight='500';
                const val = document.createElement('span');
                val.className='cs-val'; val.style.fontSize='0.62rem'; val.style.color='var(--text_muted)';
                top.appendChild(lbl); top.appendChild(val); wrap.appendChild(top);
                let widget;
                const v = s[key];
                if (type === 'select') {
                    widget = document.createElement('select');
                    widget.style.marginTop='4px';
                    widget.style.padding='5px 7px'; widget.style.borderRadius='7px'; widget.style.border='1px solid var(--bg_border)'; widget.style.background='var(--bg_panel)';
                    widget.style.fontSize='0.68rem';
                    opts.forEach(function(o){
                        const opt = document.createElement('option'); opt.value = o[0]; opt.textContent = o[1];
                        if (String(v) === String(o[0])) opt.selected = true;
                        widget.appendChild(opt);
                    });
                    widget.onchange = function(){ patchForm[key]=widget.value; val.textContent=widget.selectedOptions[0].textContent; commitPatch(); };
                    val.textContent = widget.selectedOptions[0].textContent;
                } else if (type === 'range') {
                    const c = document.createElement('div'); c.style.display='flex'; c.style.alignItems='center'; c.style.gap='6px'; c.style.marginTop='4px';
                    widget = document.createElement('input'); widget.type='range'; widget.min=opts.min; widget.max=opts.max; widget.step=opts.step; widget.value=v;
                    widget.style.flex='1';
                    widget.oninput = function(){ patchForm[key]=parseFloat(widget.value); val.textContent=(+widget.value).toFixed(2) + (opts.unit||''); commitPatch({save:false}); };
                    widget.onchange = function(){ commitPatch({save:true}); };
                    val.textContent = (+v).toFixed(2) + (opts.unit||'');
                    c.appendChild(widget); wrap.appendChild(c); widget = c;
                } else if (type === 'toggle') {
                    const c = document.createElement('label');
                    c.style.display='inline-flex'; c.style.alignItems='center'; c.style.gap='6px'; c.style.cursor='pointer';
                    widget = document.createElement('input'); widget.type='checkbox'; widget.checked=!!v;
                    widget.style.accentColor='var(--accent)'; widget.style.width='14px'; widget.style.height='14px';
                    widget.onchange = function(){ patchForm[key]=widget.checked; commitPatch(); };
                    val.textContent = v ? '开':'关';
                    c.appendChild(widget); c.appendChild(val); wrap.appendChild(c); widget = c;
                }
                if (type==='select') wrap.appendChild(widget);
                form.appendChild(wrap);
            });
            function commitPatch(opt){ if (!Object.keys(patchForm).length) return; const merged = Object.assign({}, appearance.chatSettings, patchForm); applyChatSettings(merged, {save: !(opt && opt.save===false)}); }
        }
        function renderMiscForm() {
            const form = document.getElementById('miscForm'); if (!form) return;
            const m = Object.assign({}, { chatHeaderStyle:'default', showSidebarQuick:true, scrollSnapBubble:false, autoScrollOnNew:true, doubleTapToLike:true, swipeToReply:false, cardAnimStyle:'pop' }, appearance.miscSettings || {});
            appearance.miscSettings = m;
            const items = [
                ['chatHeaderStyle','顶栏风格',   [['default','默认（粉雾）'],['dreamy','梦幻'],['minimal','极简'],['bold','深色对比']]],
                ['cardAnimStyle','抽卡动效',     [['pop','弹跳 pop'],['fade','柔 fade'],['slide','滑入 slide'],['spin','旋转 spin'],['none','无']]],
                ['showSidebarQuick','底部快捷入口侧栏显示'],
                ['autoScrollOnNew','新消息自动滚到底部'],
                ['doubleTapToLike','双击气泡发送爱心'],
                ['swipeToReply','滑动消息回复（实验性）'],
                ['scrollSnapBubble','单条滚动吸附（长聊天更顺手）']
            ];
            form.innerHTML = '';
            items.forEach(function(item){
                const key=item[0], label=item[1], opts=item[2];
                const row = document.createElement('div'); row.className='theme-row'; row.style.padding='7px 9px';
                const l = document.createElement('label'); l.textContent = label;
                l.style.fontSize='0.72rem'; l.style.color='var(--text_primary)'; l.style.fontWeight='500';
                row.appendChild(l);
                let w;
                if (opts) {
                    w = document.createElement('select');
                    w.style.padding='5px 8px'; w.style.borderRadius='8px'; w.style.border='1px solid var(--bg_border)';
                    opts.forEach(function(o){
                        const opt = document.createElement('option'); opt.value=o[0]; opt.textContent=o[1];
                        if (m[key]===o[0]) opt.selected = true;
                        w.appendChild(opt);
                    });
                    w.onchange = function(){ m[key]=w.value; saveAppearance(); applyMiscClass(); showToast('已保存：'+label); };
                } else {
                    w = document.createElement('input'); w.type='checkbox'; w.checked = !!m[key];
                    w.style.width='16px'; w.style.height='16px'; w.style.accentColor='var(--accent)';
                    w.onchange = function(){ m[key]=w.checked; saveAppearance(); applyMiscClass(); showToast((w.checked?'开启：':'关闭：')+label); };
                }
                row.appendChild(w);
                form.appendChild(row);
            });
            applyMiscClass();
        }
        function applyMiscClass() {
            const m = appearance.miscSettings || {};
            const app = document.getElementById('app'); if (!app) return;
            app.setAttribute('data-header', m.chatHeaderStyle || 'default');
            app.setAttribute('data-card-anim', m.cardAnimStyle || 'pop');
            app.classList.toggle('show-quick', !!m.showSidebarQuick);
            app.classList.toggle('no-auto-scroll', !m.autoScrollOnNew);
            app.classList.toggle('dbl-like', !!m.doubleTapToLike);
            app.classList.toggle('swipe-reply', !!m.swipeToReply);
            if (m.scrollSnapBubble) { app.style.scrollSnapType = 'y proximity'; document.querySelector('.chat-list')?.style.setProperty('scroll-snap-type','y proximity'); document.querySelectorAll('.message').forEach(function(el){el.style.scrollSnapAlign='start';}); }
            else { app.style.scrollSnapType='none'; const cl=document.querySelector('.chat-list'); if (cl) cl.style.scrollSnapType='none'; document.querySelectorAll('.message').forEach(function(el){el.style.scrollSnapAlign='';}); }
            const styleId = '__miscExtra';
            let node = document.getElementById(styleId);
            if (!node) { node = document.createElement('style'); node.id = styleId; document.head.appendChild(node); }
            node.textContent =
              '#app[data-header="dreamy"] .top-bar{ background: linear-gradient(135deg, rgba(255,180,210,.4), rgba(180,190,255,.4)); backdrop-filter: blur(8px); }' +
              '#app[data-header="minimal"] .top-bar{ background: transparent; box-shadow:none; }' +
              '#app[data-header="bold"] .top-bar{ background: var(--accent); color:#fff; } #app[data-header="bold"] .top-bar h1, #app[data-header="bold"] .status{ color:#fff; }' +
              '#app[data-card-anim="pop"] .card-pop{ animation: pop .4s cubic-bezier(.2,1.5,.4,1) both; }' +
              '#app[data-card-anim="fade"] .card-pop{ animation: fade .4s ease-out both; }' +
              '#app[data-card-anim="slide"] .card-pop{ animation: slideIn .4s ease-out both; }' +
              '#app[data-card-anim="spin"] .card-pop{ animation: spin 1s cubic-bezier(.2,.9,.3,1.1) both; }' +
              '@keyframes pop{0%{transform:scale(.6) translateY(10px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}' +
              '@keyframes fade{0%{opacity:0}100%{opacity:1}}' +
              '@keyframes slideIn{0%{transform:translateY(20px);opacity:0}100%{transform:translateY(0);opacity:1}}' +
              '@keyframes spin{0%{transform:rotate(-30deg) scale(.8);opacity:0}100%{transform:rotate(0) scale(1);opacity:1}}';
        }

        // ===== 主题编辑器 UI =====
        function buildThemeEditor() {
            const sw = document.getElementById('themeSwatches');
            if (!sw) return;
            sw.innerHTML = '';
            Object.keys(THEME_PRESETS).forEach(function(key){
                const p = THEME_PRESETS[key];
                const v = p.vars || {};
                const d = document.createElement('div');
                d.className = 'theme-swatch'; d.title = p.name;
                d.dataset.key = key;
                const g1 = v.bg_page || '#fff'; const g2 = v.bg_bubble_user || '#ddd'; const g3 = v.accent || '#999';
                d.style.background = 'linear-gradient(135deg, '+g1+' 0%, '+g2+' 55%, '+g3+' 100%)';
                d.innerHTML = '<div class="name">'+p.name+'</div>';
                d.onclick = function(){
                    appearance.activeThemeKey = key; appearance.customVars = {};
                    applyThemeVariables(v); saveAppearance(); saveCurrentThemeToStorage();
                    refreshThemeActive();
                };
                sw.appendChild(d);
            });
            const cust = document.createElement('div');
            cust.className = 'theme-swatch custom'; cust.title = '📁 自定义';
            cust.innerHTML = '<span>➕</span><div class="name">自定义</div>';
            cust.onclick = function(){
                appearance.activeThemeKey = 'custom'; saveAppearance(); refreshThemeActive();
            };
            sw.appendChild(cust);
            const ed = document.getElementById('themeEditor');
            if (ed) {
                const fields = [
                    ['bg_page','页面背景'],['bg_chat','聊天背景'],['bg_panel','面板白'],['bg_card','卡片'],
                    ['bg_bubble_user','梦女气泡'],['bg_bubble_angle','梦角气泡'],['bg_bubble_system','系统气泡'],
                    ['bg_button','按钮'],['bg_button_hover','按钮悬停'],['bg_button_danger','危险按钮'],
                    ['bg_border','边线色'],['text_primary','主文字'],['text_secondary','次级文字'],['text_muted','次要文字'],
                    ['accent','强调色'],['board_page','书页底'],['board_note_bg_1','便利贴1'],['board_note_bg_2','便利贴2'],
                    ['board_lines','书页横格'],['board_grid','书页网格'],['wish_canopy','树冠绿'],
                    ['wish_trunk','树干棕'],['wish_sky','天空蓝'],
                    ['ring','焦点环']
                ];
                const styles = getComputedStyle(document.documentElement);
                ed.innerHTML = fields.map(function(kv){
                    const k = kv[0], label = kv[1];
                    const cssName = '--'+k.replace(/_/g,'-');
                    let cur = (document.documentElement.style.getPropertyValue(cssName) || '').trim();
                    if (!cur) cur = (styles.getPropertyValue(cssName) || '').trim();
                    if (!cur) cur = THEME_PRESETS.sakura?.vars?.[k] || '';
                    if (!cur || cur.indexOf('gradient')>=0 || cur.indexOf('rgba')>=0 || cur.indexOf('hsl')>=0 || cur.indexOf(' ')>=0 && k!=='ring') {
                        // 非纯色 → 从预设或兜底近似值采一个
                        if (k.indexOf('note')>=0) cur = k.indexOf('1')>=0 ? '#fff6b0' : '#ffd1e4';
                        else if (k==='ring') cur = '#d24b6e';
                        else if (k==='board_lines' || k==='board_grid') cur = '#907080';
                        else cur = '#cccccc';
                    }
                    const hex = colorToHex(cur);
                    return '<div class="theme-row" data-k="'+k+'"><label title="'+k+'">'+label+'</label><input type="color" data-k="'+k+'" value="'+hex+'"></div>';
                }).join('');
                ed.querySelectorAll('input[type=color]').forEach(function(inp){
                    inp.addEventListener('input', function(){
                        const k = this.dataset.k; if (!k) return;
                        const patch = {}; patch[k] = this.value;
                        const all = Object.assign(getCurrentThemeVars(), patch);
                        applyThemeVariables(all);
                        appearance.activeThemeKey = 'custom';
                        appearance.customVars = all;
                    });
                    inp.addEventListener('change', function(){ saveAppearance(); saveCurrentThemeToStorage(); refreshThemeActive(); });
                });
            }
            const bs = document.getElementById('btnSaveTheme');
            if (bs) bs.onclick = function(){
                const name = (prompt('请为这套主题取一个名字：', '我的主题') || '').trim();
                if (!name) return;
                appearance.savedThemes[name] = getCurrentThemeVars();
                saveAppearance(); renderSavedThemes(); refreshThemeActive(); showToast('已保存：' + name);
            };
            renderSavedThemes();
            refreshThemeActive();
        }
        function colorToHex(c) {
            if (!c) return '#a97bc9';
            if (c.charAt(0) === '#') {
                if (c.length === 4) return '#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];
                return c.slice(0,7);
            }
            const m = c.match(/rgba?\(([^)]+)\)/);
            if (m) { const parts = m[1].split(',').map(function(s){return parseInt(s.trim(),10);});
                const r = parts[0]||0, g = parts[1]||0, b = parts[2]||0;
                return '#'+[r,g,b].map(function(x){return ('0'+(x&255).toString(16)).slice(-2);}).join(''); }
            return '#a97bc9';
        }
        function refreshThemeActive() {
            const cur = getCurrentThemeVars();
            const activeName = appearance.activeThemeKey || '';
            const curAccent = colorToHex((cur.accent || '').trim());
            document.querySelectorAll('.theme-swatches .theme-swatch').forEach(function(el){
                el.classList.remove('active');
            });
            document.querySelectorAll('.theme-swatches .theme-swatch:not(.custom)').forEach(function(el){
                const key = el.dataset.key || '';
                const name = el.title || '';
                const p = key ? THEME_PRESETS[key] : null;
                const presetAccent = p && p.vars ? colorToHex(p.vars.accent) : '';
                if (key && key === activeName) { el.classList.add('active'); return; }
                if (presetAccent && curAccent && presetAccent === curAccent) el.classList.add('active');
            });
            if (activeName === 'custom' || activeName === '') {
                const c = document.querySelector('.theme-swatches .theme-swatch.custom');
                if (c) c.classList.add('active');
            }
        }
        function renderSavedThemes() {
            const list = document.getElementById('savedPresetsList'); if (!list) return;
            list.innerHTML = '';
            const keys = Object.keys(appearance.savedThemes || {});
            if (!keys.length) {
                list.innerHTML = '<div style="padding:12px; font-size:0.72rem; color:var(--text_muted); text-align:center; border-radius:10px; background:rgba(127,90,180,0.06);">📭 还没有保存的主题<br>右侧调节 26 项颜色后，点击上方「➕ 保存当前为新主题」即可无限扩展 ✨</div>';
                return;
            }
            keys.forEach(function(name){
                const p = appearance.savedThemes[name] || {};
                const el = document.createElement('div'); el.className='theme-preset-card';
                const dotsArr = [p.accent, p.bg_bubble_user, p.bg_bubble_angle, p.bg_chat, p.bg_page, p.wish_canopy].filter(Boolean);
                const dotsHtml = dotsArr.map(function(c){return '<b style="background:'+colorToHex(c)+'"></b>';}).join('');
                const nameSpan = document.createElement('span'); nameSpan.className='name'; nameSpan.textContent = name;
                const dots = document.createElement('span'); dots.className='dots'; dots.innerHTML = dotsHtml;
                el.appendChild(nameSpan); el.appendChild(dots);
                el.onclick = function(){
                    appearance.activeThemeKey = 'custom'; appearance.customVars = p;
                    applyThemeVariables(p); saveAppearance(); saveCurrentThemeToStorage();
                    renderSavedThemes(); refreshThemeActive(); showToast('已应用：'+name);
                };
                const del = document.createElement('button'); del.className='mini-btn danger'; del.textContent='×'; del.title='删除';
                del.style.marginLeft = '6px';
                del.onclick = function(e){
                    e.stopPropagation();
                    if (confirm('删除该主题方案？\n'+name)) {
                        delete appearance.savedThemes[name]; saveAppearance(); renderSavedThemes();
                    }
                };
                el.appendChild(del);
                list.appendChild(el);
            });
        }
        // ===== 数据管理 =====
        function exportAll() {
            const out = {
                exportedAt: Date.now(),
                dream_profile: JSON.parse(localStorage.getItem('dream_profile') || '{}'),
                dream_appearance: JSON.parse(localStorage.getItem('dream_appearance') || '{}'),
                dream_games: JSON.parse(localStorage.getItem('dream_games') || '{}')
            };
            const blob = new Blob([JSON.stringify(out, null, 2)], {type:'application/json'});
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
            a.download = '梦语·传讯-数据-'+new Date().toISOString().slice(0,10)+'.json';
            document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); if (a.parentNode) a.parentNode.removeChild(a); }, 1000);
        }
        function importAll(file) {
            const r = new FileReader();
            r.onload = function() { try {
                const o = JSON.parse(r.result);
                if (o.dream_profile) localStorage.setItem('dream_profile', JSON.stringify(o.dream_profile));
                if (o.dream_appearance) localStorage.setItem('dream_appearance', JSON.stringify(o.dream_appearance));
                if (o.dream_games) localStorage.setItem('dream_games', JSON.stringify(o.dream_games));
                location.reload();
            } catch(e) { alert('导入失败：格式不正确'); } };
            r.readAsText(file);
        }
        function clearAllData() {
            if (!confirm('⚠ 真的要清空全部数据吗？（包括聊天/外观/小游戏所有记录）')) return;
            localStorage.removeItem('dream_profile');
            localStorage.removeItem('dream_appearance');
            localStorage.removeItem('dream_games');
            localStorage.removeItem('dream_activeTheme');
            location.reload();
        }
        // ===== 猜拳奖惩 =====
        let rpsRound = null;
        function openRpsModal() { openModal(rpsModal); renderRps(); }
        function renderRps() {
            document.querySelectorAll('#rpsRoleSwitch .chip').forEach(function(c){c.classList.toggle('active', c.dataset.role === rpsRole);});
            document.querySelectorAll('#rpsModeTabs .tab').forEach(function(t){t.classList.toggle('active', t.dataset.mode === rpsMode);});
            const s = dreamGames.rps_stats || {};
            const total = (s.dreamerWins||0)+(s.angleWins||0)+(s.ties||0);
            const rate = total ? Math.round((s.dreamerWins||0) / total * 100) : 0;
            const bar = document.getElementById('rpsStatsBar');
            if (bar) bar.innerHTML = ''
                + '<span>🎀 梦女胜 <b class="num">'+(s.dreamerWins||0)+'</b></span>'
                + '<span>🌙 梦角胜 <b class="num">'+(s.angleWins||0)+'</b></span>'
                + '<span>🤝 平局 <b class="num">'+(s.ties||0)+'</b></span>'
                + '<span>总 <b class="num">'+total+'</b></span>'
                + '<span>胜率 <b class="num">'+rate+'%</b></span>';
            const uh = document.getElementById('rpsUserHand'), ah = document.getElementById('rpsAngleHand');
            const hm = {rock:'✊', scissors:'✌️', paper:'✋'};
            if (uh) uh.innerHTML = rpsRound && rpsRound.userHand ? hm[rpsRound.userHand] : '';
            if (ah) {
                ah.classList.toggle('pending', !(rpsRound && rpsRound.angleHand));
                ah.innerHTML = rpsRound && rpsRound.angleHand ? hm[rpsRound.angleHand] : '';
            }
            const rr = document.getElementById('rpsResult');
            if (rpsRound && rpsRound.done) {
                rr.style.display = '';
                rr.className = 'rps-result ' + (rpsRound.winner === 'dreamer' ? 'win-user' : rpsRound.winner === 'angle' ? 'win-angle' : 'tie');
                const label = rpsRound.winner === 'dreamer' ? '🎉 梦女获胜！' : rpsRound.winner === 'angle' ? '🌙 梦角获胜！' : '🤝 平局';
                rr.innerHTML = label + ' <small style="opacity:0.7;">（'+(rpsRound.timeStr||'')+'）</small>';
            } else rr.style.display = 'none';
            renderRpsRuleInput();
            renderRpsHistory();
        }
        function renderRpsRuleInput() {
            const wrap = document.getElementById('rpsRuleInput'); if (!wrap) return;
            const need = rpsRound && rpsRound.done && !rpsRound.rule && rpsRound.winner !== 'tie';
            wrap.style.display = need ? '' : 'none';
            if (!need) return;
            const winnerIsDreamer = rpsRound.winner === 'dreamer';
            const proposer = rpsMode === 'angle_rules' ? 'angle' : (winnerIsDreamer ? 'dreamer' : 'angle');
            const currentWriterIsDreamer = (proposer === 'dreamer');
            const disabled = (rpsRole !== proposer);
            wrap.innerHTML = ''
                + '<div style="font-size:0.72rem; color:var(--text_secondary); margin-bottom:4px;">'
                + (rpsMode === 'angle_rules' ? '🌙 模式B：奖惩规则由 梦角 制定' : (winnerIsDreamer ? '🏆 梦女胜出 → 由梦女写奖惩' : '🌙 梦角胜出 → 由梦角写奖惩'))
                + '<br>当前视角：<b>'+(rpsRole==='dreamer'?'🎀 梦女':'🌙 梦角')+'</b> · 制定权：<b>'+(currentWriterIsDreamer?'🎀 梦女':'🌙 梦角')+'</b>'
                + '</div>'
                + '<div class="rps-rule-type-tabs" id="rpsRuleType">'
                + '<span class="c active" data-t="reward">🎁 奖励</span>'
                + '<span class="c" data-t="punish">⚡ 惩罚</span></div>'
                + '<textarea id="rpsRuleText" rows="2" placeholder="写下奖惩内容...（'+(disabled?'请切换角色到对应视角再写':'当前视角可写')+'）" '+(disabled?'disabled style="opacity:0.5; cursor:not-allowed;"':'')+'></textarea>'
                + '<div style="display:flex; justify-content:flex-end; margin-top:4px;">'
                + '<button class="btn-primary-mod" id="rpsRuleSubmitBtn" '+(disabled?'disabled style="opacity:0.5; cursor:not-allowed;"':'')+'>保存本轮奖惩</button></div>';
            wrap.querySelectorAll('#rpsRuleType .c').forEach(function(c){
                c.onclick = function() {
                    wrap.querySelectorAll('#rpsRuleType .c').forEach(function(x){x.classList.remove('active');});
                    c.classList.add('active');
                };
            });
            const sb = wrap.querySelector('#rpsRuleSubmitBtn');
            if (sb) sb.onclick = function(){
                const text = (document.getElementById('rpsRuleText').value || '').trim();
                if (!text) return showToast('请写下奖惩内容');
                const typeEl = wrap.querySelector('#rpsRuleType .c.active');
                rpsRound.rule = { type: typeEl ? typeEl.dataset.t : 'reward', text: text, proposer: proposer };
                dreamGames.rps_history.unshift({
                    mode: rpsMode, ts: Date.now(), timeStr: rpsRound.timeStr,
                    userHand: rpsRound.userHand, angleHand: rpsRound.angleHand, winner: rpsRound.winner, rule: rpsRound.rule
                });
                dreamGames.rps_stats = dreamGames.rps_stats || {};
                if (rpsRound.winner === 'dreamer') dreamGames.rps_stats.dreamerWins = (dreamGames.rps_stats.dreamerWins||0) + 1;
                else if (rpsRound.winner === 'angle') dreamGames.rps_stats.angleWins = (dreamGames.rps_stats.angleWins||0) + 1;
                saveAppearance(); renderRps(); showToast('本轮已保存 📝');
            };
        }
        function rpsJudge(u,a){ if (u===a) return 'tie'; if ((u==='rock'&&a==='scissors')||(u==='scissors'&&a==='paper')||(u==='paper'&&a==='rock')) return 'dreamer'; return 'angle'; }
        function playRps(hand){
            if (rpsRound && rpsRound.done && !rpsRound.rule && rpsRound.winner !== 'tie') return showToast('请先保存本轮奖惩再开始下一局');
            const now = new Date();
            rpsRound = { userHand: hand, angleHand: null, winner: null, done: false,
                timeStr: String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0') };
            renderRps();
            setTimeout(function(){
                const opts = ['rock','scissors','paper'];
                rpsRound.angleHand = opts[Math.floor(Math.random()*3)];
                rpsRound.winner = rpsJudge(rpsRound.userHand, rpsRound.angleHand);
                rpsRound.done = true;
                if (rpsRound.winner === 'tie') {
                    dreamGames.rps_stats.ties = (dreamGames.rps_stats.ties||0) + 1;
                    dreamGames.rps_history.unshift({
                        mode: rpsMode, ts: Date.now(), timeStr: rpsRound.timeStr,
                        userHand: rpsRound.userHand, angleHand: rpsRound.angleHand, winner: 'tie'
                    });
                    saveAppearance();
                }
                renderRps();
            }, 900 + Math.floor(Math.random() * 900));
        }
        function renderRpsHistory() {
            const list = document.getElementById('rpsHistoryList'); if (!list) return;
            const H = dreamGames.rps_history;
            if (!H.length) { list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text_muted);font-size:0.75rem;">📜 暂无记录，开始一局吧！</div>'; return; }
            const hm = {rock:'✊',scissors:'✌️',paper:'✋'};
            list.innerHTML = H.slice(0, 100).map(function(r){
                return '<div class="item">'
                    + '<span style="font-size:0.6rem;color:var(--text_muted);min-width:60px;">'+(r.timeStr || new Date(r.ts).toLocaleTimeString().slice(0,5))+'</span>'
                    + '<span style="min-width:26px;">🎀'+(hm[r.userHand]||'?')+'</span>'
                    + '<span style="min-width:26px;">🌙'+(hm[r.angleHand]||'?')+'</span>'
                    + '<span style="flex:1;min-width:70px;"><b>'+(r.winner==='dreamer'?'🎀胜':r.winner==='angle'?'🌙胜':'🤝平')+'</b> '+(r.mode==='winner_rules'?'':'·模式B')+'</span>'
                    + '<span style="font-size:0.6rem;color:var(--text_secondary);max-width:140px;">'
                    + (r.rule ? '<b>'+(r.rule.type==='reward'?'🎁':'⚡')+'</b> '+escapeHtml(r.rule.text) : '')
                    + '</span></div>';
            }).join('');
        }
        // ===== 自定义 confirm =====
        let __confirmResolvers = null;
        function showConfirm(title, htmlMsg) {
            return new Promise(function(res){
                const m = document.getElementById('confirmModal');
                document.getElementById('confirmTitle').textContent = title || '确认';
                document.getElementById('confirmMsg').innerHTML = htmlMsg || '';
                m.classList.add('active');
                let done = false;
                const finish = function(v){ if (done) return; done=true; m.classList.remove('active'); res(v); };
                document.getElementById('confirmYes').onclick = function(){ finish(true); };
                document.getElementById('confirmNo').onclick = function(){ finish(false); };
                m.querySelectorAll('[data-confirm-close]').forEach(function(b){ b.onclick = function(){ finish(false); }; });
            });
        }
        // ===== 涂鸦板 =====
        let doodleRole='dreamer', doodleTool='pencil', doodleColor='#111111', doodleWidth=3;
        let doodleUndo = [], doodleRedo = [];
        function openDoodleModal() {
            openModal(doodleModal);
            const c = document.getElementById('doodleCanvas');
            resizeDoodleCanvas(c);
            renderDoodleToolbar(); renderDoodleGallery(); clearDoodle(true);
        }
        function resizeDoodleCanvas(c) {
            if (!c) return;
            const maxW = Math.min(800, (c.parentElement ? c.parentElement.clientWidth - 12 : 800));
            const ratio = maxW / 800;
            c.style.width = maxW + 'px';
            c.style.height = Math.round(500*ratio) + 'px';
            if (c.__inited) return;
            c.__inited = true;
            bindDoodleDraw(c, function(){
                const img = c.toDataURL('image/png');
                doodleUndo.push(img); if (doodleUndo.length > 50) doodleUndo.shift();
                doodleRedo = [];
            });
        }
        function bindDoodleDraw(c, onStrokeEnd) {
            let drawing = false; const ctx = c.getContext('2d');
            function pos(e){
                const rect = c.getBoundingClientRect();
                const t = e.touches && e.touches[0] ? e.touches[0] : e;
                const x = (t.clientX - rect.left) * (c.width / rect.width);
                const y = (t.clientY - rect.top) * (c.height / rect.height);
                return {x:x, y:y};
            }
            function start(e){ drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); e.preventDefault(); }
            function move(e){ if (!drawing) return; const p = pos(e);
                ctx.lineWidth = doodleWidth; ctx.lineCap = 'round'; ctx.lineJoin='round';
                if (doodleTool === 'eraser') { ctx.globalCompositeOperation = 'destination-out'; ctx.strokeStyle = 'rgba(0,0,0,1)'; }
                else { ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = doodleColor;
                    if (doodleTool === 'marker') ctx.globalAlpha = 0.55; else ctx.globalAlpha = 1; }
                ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); }
            function end(){ if (!drawing) return; drawing=false; ctx.closePath(); if (onStrokeEnd) onStrokeEnd(); }
            c.addEventListener('mousedown', start); c.addEventListener('mousemove', move); window.addEventListener('mouseup', end);
            c.addEventListener('touchstart', start); c.addEventListener('touchmove', move); c.addEventListener('touchend', end);
        }
        function renderDoodleToolbar() {
            const bar = document.getElementById('doodleToolbar'); if (!bar) return;
            const pal = DOODLE_PALETTE.map(function(c){ return '<span class="sw '+(c===doodleColor?'active':'')+'" data-c="'+c+'" style="background:'+c+';"></span>'; }).join('');
            bar.innerHTML = ''
                + '<div class="role-switch" id="doodleRoleSwitch">'
                + '<div class="chip '+(doodleRole==='dreamer'?'active':'')+'" data-role="dreamer">🎀 梦女画</div>'
                + '<div class="chip '+(doodleRole==='angle'?'active':'')+'" data-role="angle">🌙 梦角画</div></div> '
                + '<select id="ddTool">'
                + '<option value="pencil"'+(doodleTool==='pencil'?' selected':'')+'>✏️ 铅笔</option>'
                + '<option value="marker"'+(doodleTool==='marker'?' selected':'')+'>🖊️ 马克笔</option>'
                + '<option value="eraser"'+(doodleTool==='eraser'?' selected':'')+'>🧽 橡皮</option></select> '
                + '<span class="palette">'+pal+'</span>'
                + ' <input type="color" id="ddColorPicker" value="'+colorToHex(doodleColor)+'" title="自定义颜色"> '
                + ' <span style="font-size:0.68rem;color:var(--text_muted);">粗细:</span> '
                + ' <input type="range" min="1" max="32" value="'+doodleWidth+'" id="ddWidth"> '
                + '<button class="mini-btn" id="ddUndo">↶ 撤销</button> '
                + '<button class="mini-btn" id="ddRedo">↷ 重做</button> '
                + '<button class="mini-btn danger" id="ddClear">🧹 清空</button> '
                + '<button class="mini-btn primary" id="ddSave">💾 保存</button>';
            bar.querySelectorAll('#doodleRoleSwitch .chip').forEach(function(x){
                x.onclick = function(){ doodleRole = x.dataset.role; renderDoodleToolbar(); };
            });
            bar.querySelectorAll('.sw').forEach(function(sw){
                sw.onclick = function(){ doodleColor = sw.dataset.c; renderDoodleToolbar(); };
            });
            const toolSel = bar.querySelector('#ddTool');
            toolSel.onchange = function(e){ doodleTool = e.target.value; };
            bar.querySelector('#ddColorPicker').oninput = function(e){ doodleColor = e.target.value; };
            bar.querySelector('#ddWidth').oninput = function(e){ doodleWidth = +e.target.value; };
            bar.querySelector('#ddUndo').onclick = doodleUndoBtn;
            bar.querySelector('#ddRedo').onclick = doodleRedoBtn;
            bar.querySelector('#ddClear').onclick = function(){ if (confirm('清空画布？')) clearDoodle(); };
            bar.querySelector('#ddSave').onclick = saveDoodle;
        }
        function clearDoodle(silent) {
            const c = document.getElementById('doodleCanvas'); if (!c) return;
            const ctx = c.getContext('2d');
            ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0,0,c.width,c.height); ctx.restore();
            const snap = c.toDataURL('image/png');
            if (silent) { doodleUndo = [snap]; doodleRedo = []; }
            else { doodleUndo.push(snap); if (doodleUndo.length>50) doodleUndo.shift(); doodleRedo = []; }
        }
        function doodleUndoBtn() {
            if (doodleUndo.length <= 1) return;
            const c = document.getElementById('doodleCanvas'); const ctx = c.getContext('2d');
            const cur = doodleUndo.pop(); doodleRedo.push(cur);
            const last = doodleUndo[doodleUndo.length-1];
            const img = new Image();
            img.onload = function(){ ctx.clearRect(0,0,c.width,c.height); ctx.drawImage(img,0,0); }; img.src = last;
        }
        function doodleRedoBtn() {
            if (!doodleRedo.length) return;
            const c = document.getElementById('doodleCanvas'); const ctx = c.getContext('2d');
            const cur = doodleRedo.pop(); doodleUndo.push(cur);
            const img = new Image(); img.onload = function(){ ctx.clearRect(0,0,c.width,c.height); ctx.drawImage(img,0,0); }; img.src = cur;
        }
        function saveDoodle() {
            const c = document.getElementById('doodleCanvas');
            const title = prompt('给这张画取个标题（可选）：', '') || '';
            const data = c.toDataURL('image/png');
            const img = new Image(); img.onload = function(){
                const thumb = document.createElement('canvas');
                const tw = 320, th = Math.round(tw * img.height / img.width);
                thumb.width = tw; thumb.height = th; const tx = thumb.getContext('2d');
                tx.drawImage(img, 0, 0, tw, th);
                const thumbData = thumb.toDataURL('image/png');
                dreamGames.doodles.unshift({
                    id:'D'+Date.now()+Math.floor(Math.random()*1e4),
                    author: doodleRole, title: title, img: data, thumb: thumbData,
                    w: img.width, h: img.height, ts: Date.now(),
                    timeStr: String(new Date().getHours()).padStart(2,'0')+':'+String(new Date().getMinutes()).padStart(2,'0')
                });
                while (dreamGames.doodles.length > DOODLE_MAX) dreamGames.doodles.pop();
                saveAppearance(); renderDoodleGallery(); showToast('已保存到画廊 🖼️'); clearDoodle();
            }; img.src = data;
        }
        function renderDoodleGallery() {
            const g = document.getElementById('doodleGallery'); if (!g) return;
            if (!dreamGames.doodles.length) { g.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:20px 0;font-size:0.72rem;color:var(--text_muted);">🖼️ 还没有涂鸦～画一张保存吧！</div>'; return; }
            g.innerHTML = dreamGames.doodles.map(function(d){
                return '<div class="doodle-card" data-id="'+d.id+'" title="点击放大查看">'
                    + '<img src="'+(d.thumb||d.img)+'">'
                    + '<div class="dlc-meta">'+(d.author==='dreamer'?'🎀':'🌙')+' · '+(d.timeStr||'')+'</div></div>';
            }).join('');
            g.querySelectorAll('.doodle-card').forEach(function(card){
                const id = card.dataset.id; const d = dreamGames.doodles.find(function(x){return x.id===id;}); if (!d) return;
                card.onclick = function(){ showDoodleFull(d); };
            });
        }
        function showDoodleFull(d) {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;';
            wrap.innerHTML = ''
                + '<div style="background:var(--bg_card,white);border-radius:16px;padding:14px;max-width:560px;max-height:90vh;overflow:auto;">'
                + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">'
                + '<div style="font-size:0.8rem;"><b>'+(d.author==='dreamer'?'🎀 梦女':'🌙 梦角')+'</b> · '+escapeHtml(d.title||'（无标题）')+' · <small style="opacity:0.5;">'+new Date(d.ts).toLocaleString()+'</small></div>'
                + '<button class="mini-btn danger" id="dfClose">✕</button>'
                + '</div><img src="'+d.img+'" style="max-width:100%;border-radius:10px;display:block;">'
                + '<div style="display:flex;gap:6px;justify-content:flex-end;margin-top:8px;flex-wrap:wrap;">'
                + '<button class="mini-btn" id="dfSend">💬 发送到聊天</button> '
                + '<a class="mini-btn primary" download="doodle-'+d.id+'.png" href="'+d.img+'">⬇️ 下载 PNG</a> '
                + '<button class="mini-btn danger" id="dfDelete">🗑 删除</button>'
                + '</div></div>';
            document.body.appendChild(wrap);
            function close(){ if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }
            wrap.querySelector('#dfClose').onclick = close;
            wrap.addEventListener('click', function(e){ if (e.target === wrap) close(); });
            wrap.querySelector('#dfSend').onclick = function(){
                addChatMessageHtml('<img class="msg-doodle-img" src="'+(d.thumb||d.img)+'"><small>'+(d.author==='dreamer'?'🎀 我的涂鸦':'🌙 梦角的涂鸦')+'：'+escapeHtml(d.title||'(无标题)')+'</small>',
                    d.author === 'dreamer' ? 'user' : 'angle');
                close(); closeModal(doodleModal);
            };
            wrap.querySelector('#dfDelete').onclick = function(){
                if (!confirm('确认删除这张涂鸦？')) return;
                const i = dreamGames.doodles.findIndex(function(x){ return x.id === d.id; });
                if (i>=0) dreamGames.doodles.splice(i,1);
                saveAppearance(); renderDoodleGallery(); close();
            };
        }
        // ===== 你画我猜 =====
        let dgRound = null, dgCategory = null;
        function dgMergeTopics(){
            const t = {};
            Object.keys(DEFAULT_DRAW_TOPICS).forEach(function(k){ t[k] = DEFAULT_DRAW_TOPICS[k].slice(); });
            Object.keys(dreamGames.draw_guess_topics||{}).forEach(function(k){
                if (!t[k]) t[k] = [];
                (dreamGames.draw_guess_topics[k]||[]).forEach(function(x){ if (t[k].indexOf(x) < 0) t[k].push(x); });
            });
            return t;
        }
        function openDrawGuessModal() { openModal(drawGuessModal); initDgCanvas(); renderDg(); }
        function initDgCanvas() {
            const c = document.getElementById('dgCanvas'); if (!c || c.__inited) return;
            c.__inited = true;
            const maxW = Math.min(800, (c.parentElement ? c.parentElement.clientWidth - 12 : 800));
            const ratio = maxW / 800;
            c.style.width = maxW + 'px'; c.style.height = Math.round(460*ratio)+'px';
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,c.width,c.height);
            let drawing = false, tool = 'pencil', w = 4, col = '#111111';
            if (!document.getElementById('dgToolbar')) {
                const t = document.createElement('div'); t.id='dgToolbar'; t.className='doodle-toolbar';
                t.style.margin = '6px 0';
                const pal = DOODLE_PALETTE.slice(0,12).map(function(x){return '<span class="sw" data-c="'+x+'" style="background:'+x+'"></span>';}).join('');
                t.innerHTML = ''
                    + '<select><option value="pencil">✏️ 铅笔</option><option value="marker">🖊️ 马克笔</option><option value="eraser">🧽 橡皮</option></select> '
                    + '<span class="palette">'+pal+'</span> '
                    + '<span style="font-size:0.68rem;color:var(--text_muted);">粗细:</span> '
                    + '<input type="range" min="1" max="28" value="4"> '
                    + '<button class="mini-btn danger">🧹 清空</button>';
                c.parentElement.parentElement.insertBefore(t, c.parentElement);
                const selectEl = t.querySelector('select');
                const colorSws = t.querySelectorAll('.sw');
                const range = t.querySelector('input[type=range]');
                const clr = t.querySelector('.mini-btn.danger');
                selectEl.onchange = function(){ tool = selectEl.value; };
                range.oninput = function(){ w = +range.value; };
                colorSws.forEach(function(s){ s.onclick = function(){ col = s.dataset.c; colorSws.forEach(function(x){x.classList.toggle('active', x===s);}); }; });
                clr.onclick = function(){ ctx.save(); ctx.globalCompositeOperation='source-over'; ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,c.width,c.height); ctx.restore(); };
            }
            function pos(e){
                const rect = c.getBoundingClientRect();
                const t0 = e.touches && e.touches[0] ? e.touches[0] : e;
                return { x: (t0.clientX-rect.left) * c.width/rect.width, y: (t0.clientY-rect.top) * c.height/rect.height };
            }
            function start(e){ drawing=true; const p=pos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); e.preventDefault(); }
            function move(e){ if (!drawing) return; const p=pos(e); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.lineWidth=w;
                if (tool==='eraser') { ctx.globalCompositeOperation='destination-out'; ctx.strokeStyle='rgba(0,0,0,1)'; }
                else { ctx.globalCompositeOperation='source-over'; ctx.strokeStyle=col; ctx.globalAlpha = tool==='marker'?0.55:1; }
                ctx.lineTo(p.x,p.y); ctx.stroke(); e.preventDefault(); }
            function end(){ if (drawing){drawing=false; ctx.closePath();} }
            c.addEventListener('mousedown',start); c.addEventListener('mousemove',move); window.addEventListener('mouseup',end);
            c.addEventListener('touchstart',start); c.addEventListener('touchmove',move); c.addEventListener('touchend',end);
        }
        function renderDg() {
            document.querySelectorAll('#dgModeTabs .tab').forEach(function(t){ t.classList.toggle('active', t.dataset.mode===dgMode); });
            document.querySelectorAll('#dgRoleSwitch .chip').forEach(function(c){ c.classList.toggle('active', c.dataset.role===dgRole); });
            const H = dreamGames.draw_guess_history;
            const rightDreamer = H.filter(function(h){ return h.result==='hit' && h.guesser==='dreamer'; }).length;
            const rightAngle = H.filter(function(h){ return h.result==='hit' && h.guesser==='angle'; }).length;
            const bar = document.getElementById('dgStatsBar');
            if (bar) bar.innerHTML = ''
                + '<span>🎀 梦女答对 <b class="num">'+rightDreamer+'</b></span>'
                + '<span>🌙 梦角答对 <b class="num">'+rightAngle+'</b></span>'
                + '<span>总轮数 <b class="num">'+H.length+'</b></span>';
            const wr = document.getElementById('dgWordRow');
            if (!dgRound) {
                wr.innerHTML = '<span class="label">💡 还没开始～点击"开启新一轮"开始吧！</span>';
            } else {
                const elapsed = Math.max(0, dgRound.duration - Math.floor(((Date.now()-dgRound.startTs)/1000)));
                const guesser = dgRound.artist === 'dreamer' ? 'angle' : 'dreamer';
                const showWord = (dgRole === dgRound.artist);
                wr.innerHTML = ''
                    + '<span class="label">本轮：</span>'
                    + '<span class="word">'+(showWord ? escapeHtml(dgRound.word) : '（🎨 '+(dgRound.artist==='dreamer'?'梦女':'梦角')+'正在画...请猜）')+'</span> '
                    + '<span class="label">话题：</span><b>'+(dgRound.category||'自由画')+'</b> '
                    + '<span class="label">画家：</span><b>'+(dgRound.artist==='dreamer'?'🎀 梦女':'🌙 梦角')+'</b> '
                    + '<span class="label">猜的人：</span><b>'+(guesser==='dreamer'?'🎀 梦女':'🌙 梦角')+'</b> '
                    + '<span class="countdown">⏳ '+elapsed+'s</span>';
            }
            const topWrap = document.getElementById('dgTopicsWrap');
            topWrap.style.display = dgMode === 'topic' ? '' : 'none';
            if (dgMode === 'topic') {
                const tags = document.getElementById('dgTopicTags');
                const top = dgMergeTopics();
                tags.innerHTML = Object.keys(top).map(function(k){
                    return '<span class="tag '+(dgCategory===k?'active':'')+'" data-k="'+escapeHtml(k)+'">'+escapeHtml(k)+' <small style="opacity:0.55;">('+(top[k]||[]).length+')</small></span>';
                }).join('');
                tags.querySelectorAll('.tag').forEach(function(tg){ tg.onclick = function(){ dgCategory = tg.dataset.k; renderDg(); }; });
            }
            renderDgHistory();
            const mgrWrap = document.getElementById('dgTopicMgrWrap'); if (!mgrWrap) return;
            if (mgrWrap.dataset.open !== '1') { mgrWrap.innerHTML = ''; return; }
            const top2 = dgMergeTopics();
            let html = '<hr class="mod-divider"><div style="font-size:0.7rem;font-weight:500;color:var(--text_secondary);margin-bottom:6px;">🧰 话题管理（可增删分类和词）</div><div class="dg-topic-mgr">';
            Object.keys(top2).forEach(function(k){
                const inpIdK = 'inp_'+btoa(unescape(encodeURIComponent(k))).replace(/[+=/]/g,'_').slice(0,24);
                html += '<div class="row"><b style="min-width:80px;">'+escapeHtml(k)+'</b>';
                html += (top2[k]||[]).map(function(w){
                    return '<span style="padding:2px 6px;border-radius:10px;background:rgba(245,240,250,0.6);margin:2px;font-size:0.65rem;display:inline-flex;align-items:center;gap:4px;">'+escapeHtml(w)
                         + ' <button class="mini-btn danger" style="padding:0 4px;" data-delw="'+escapeHtml(k)+'" data-w="'+escapeHtml(w)+'">✕</button></span>';
                }).join(' ');
                html += ' <input placeholder="+ 新词" data-addw="'+escapeHtml(k)+'" id="'+inpIdK+'" style="min-width:80px;">'
                     +  ' <button class="mini-btn primary" data-addwordbtn="'+escapeHtml(k)+'">加词</button>'
                     +  ' <button class="mini-btn danger" data-delcat="'+escapeHtml(k)+'">删除分类</button></div>';
            });
            html += '<div class="row"><input placeholder="新分类名（emoji + 文字可）" id="dgNewCat"><button class="mini-btn primary" id="dgAddCat">➕ 新建分类</button></div>';
            html += '</div>';
            mgrWrap.innerHTML = html;
            mgrWrap.querySelectorAll('[data-delw]').forEach(function(b){ b.onclick = function(){
                const k = b.dataset.delw, w = b.dataset.w;
                // rebuild custom for k: copy DEFAULT, add custom extras, then remove w and all sibling displayed (current shown minus w)
                const base = (DEFAULT_DRAW_TOPICS[k]||[]).slice();
                const extras = (dreamGames.draw_guess_topics[k]||[]).filter(function(x){ return base.indexOf(x) < 0; });
                dreamGames.draw_guess_topics[k] = base.concat(extras).filter(function(x){ return x !== w; });
                saveAppearance(); renderDg(); // Rebuilds DOM.
            };});
            mgrWrap.querySelectorAll('[data-addwordbtn]').forEach(function(b){ b.onclick = function(){
                const k = b.dataset.addwordbtn;
                const inp = mgrWrap.querySelector('input[data-addw="'+k.replace(/"/g,'\\"')+'"]');
                if (!inp) return;
                const v = (inp.value||'').trim(); if (!v) return;
                if (!dreamGames.draw_guess_topics[k]) dreamGames.draw_guess_topics[k] = [];
                if (dreamGames.draw_guess_topics[k].indexOf(v) < 0) dreamGames.draw_guess_topics[k].push(v);
                saveAppearance(); renderDg();
            };});
            mgrWrap.querySelectorAll('[data-delcat]').forEach(function(b){ b.onclick = function(){
                const k = b.dataset.delcat; if (!confirm('删除分类？ '+k)) return;
                dreamGames.draw_guess_topics[k] = [];
                if (dgCategory === k) dgCategory = null;
                saveAppearance(); renderDg();
            };});
            const ac = document.getElementById('dgAddCat'); if (ac) ac.onclick = function(){
                const v = (document.getElementById('dgNewCat').value||'').trim(); if (!v) return;
                if (!dreamGames.draw_guess_topics[v]) dreamGames.draw_guess_topics[v] = [];
                saveAppearance(); renderDg();
            };
        }
        function dgStartTimer() {
            if (dgTimer) clearInterval(dgTimer);
            dgTimer = setInterval(function(){
                if (!dgRound) return;
                const left = dgRound.duration - Math.floor((Date.now()-dgRound.startTs)/1000);
                if (left <= 0) {
                    dgRound.result = 'timeout'; dgRound.endTs = Date.now();
                    const thumb = dgCaptureThumb();
                    dreamGames.draw_guess_history.unshift(Object.assign({}, dgRound, {img:thumb}));
                    while (dreamGames.draw_guess_history.length > DRAW_GUESS_MAX) dreamGames.draw_guess_history.pop();
                    addChatMessage('🖌️ 你画我猜：本轮「'+dgRound.word+'」时间到啦～ 还没猜到哦 ⏰', 'system');
                    dgRound = null; saveAppearance(); clearInterval(dgTimer); dgTimer=null;
                }
                renderDg();
            }, 500);
        }
        function dgCaptureThumb() {
            const c = document.getElementById('dgCanvas'); if (!c) return '';
            const thumb = document.createElement('canvas');
            const ratio = 320 / c.width; thumb.width = 320; thumb.height = Math.round(c.height * ratio);
            thumb.getContext('2d').drawImage(c, 0, 0, thumb.width, thumb.height);
            return thumb.toDataURL('image/png');
        }
        function startDgRound() {
            if (dgRound) return showToast('当前轮未结束～');
            let word = '', category = null;
            if (dgMode === 'topic') {
                const merged = dgMergeTopics();
                const keys = Object.keys(merged).filter(function(k){return (merged[k]||[]).length;});
                if (!keys.length) return showToast('话题词库为空，请先在话题管理里添加词！');
                const cat = dgCategory && merged[dgCategory] && merged[dgCategory].length ? dgCategory : keys[Math.floor(Math.random()*keys.length)];
                const pool = merged[cat]; category = cat; dgCategory = cat;
                word = pool[Math.floor(Math.random()*pool.length)];
            } else {
                const input = prompt((dgRole==='dreamer'?'🎀 梦女':'🌙 梦角')+'请输入题目（将成为画画的主题）：');
                if (!input || !input.trim()) return;
                word = input.trim();
            }
            const guesser = dgRole === 'dreamer' ? 'angle' : 'dreamer';
            const now = new Date();
            dgRound = {
                id: 'DG'+now.getTime()+Math.floor(Math.random()*1e4),
                mode: dgMode, category: category, word: word,
                artist: dgRole, guesser: guesser, result: null,
                duration: 90, startTs: now.getTime(), ts: now.getTime(),
                timeStr: String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0'),
                guesses: []
            };
            const c = document.getElementById('dgCanvas');
            if (c) { const ctx = c.getContext('2d'); ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,c.width,c.height); }
            dgStartTimer(); renderDg();
        }
        function dgGuess() {
            if (!dgRound) return showToast('先开启新一轮吧！');
            if (dgRole !== dgRound.guesser) return showToast('当前视角是'+(dgRole==='dreamer'?'🎀 梦女（画家）':'🌙 梦角（画家）')+'，不能猜哦～请切换到猜的人视角！');
            const v = (document.getElementById('dgGuessInput').value||'').trim(); if (!v) return;
            const w = dgRound.word;
            const hit = v === w || (v.length>=2 && w.indexOf(v)>=0) || (w.length>=2 && v.indexOf(w)>=0);
            dgRound.guesses.push({who: dgRole, text: v, hit: hit});
            document.getElementById('dgGuessInput').value = '';
            if (hit) {
                dgRound.result = 'hit'; dgRound.endTs = Date.now();
                const thumb = dgCaptureThumb();
                dreamGames.draw_guess_history.unshift(Object.assign({}, dgRound, {img: thumb}));
                while (dreamGames.draw_guess_history.length > DRAW_GUESS_MAX) dreamGames.draw_guess_history.pop();
                clearInterval(dgTimer); dgTimer = null;
                addChatMessage('🖌️ 你画我猜新纪录：['+(dgRound.artist==='dreamer'?'🎀 梦女':'🌙 梦角')+'] 出题「'+dgRound.word+'」，['+(dgRound.guesser==='dreamer'?'🎀 梦女':'🌙 梦角')+'] 猜对啦！🎉', 'system');
                dgRound = null; saveAppearance(); renderDg();
                showToast('🎉 答对了！');
            } else {
                showToast('❌ 不是「'+v+'」哦，再试试！');
                renderDg();
            }
        }
        function renderDgHistory() {
            const list = document.getElementById('dgHistoryList'); if (!list) return;
            const H = dreamGames.draw_guess_history;
            if (!H.length) { list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text_muted);font-size:0.75rem;">还没有记录～来一局你画我猜吧！</div>'; return; }
            list.innerHTML = H.slice(0, 80).map(function(h){
                return '<div class="item">'
                    + '<img src="'+(h.img||'')+'" style="width:48px;height:40px;object-fit:cover;border-radius:6px;border:1px solid rgba(0,0,0,0.08);">'
                    + '<span style="flex:1;">'
                    + '<b>'+(h.result==='hit'?'🎉 答对':'⏰ 超时')+'</b>'
                    + ' <small style="opacity:0.5;">'+(h.mode==='topic'?'话题':'自由画')+'</small><br>'
                    + escapeHtml(h.category||'') + ' · 答案：<b>'+escapeHtml(h.word)+'</b><br>'
                    + '<small style="opacity:0.6;">🎨'+(h.artist==='dreamer'?'🎀':'🌙')+' 画 · 猜题 '+(h.guesser==='dreamer'?'🎀':'🌙')+' · '+(h.timeStr||'')+'</small>'
                    + '</span><button class="mini-btn danger" data-del="'+h.id+'">🗑</button></div>';
            }).join('');
            list.querySelectorAll('[data-del]').forEach(function(b){ b.onclick = function(){
                if (!confirm('删除这条记录？')) return;
                dreamGames.draw_guess_history = dreamGames.draw_guess_history.filter(function(x){ return x.id !== b.dataset.del; });
                saveAppearance(); renderDgHistory(); renderDg();
            };});
        }

        // ===== 初始化 =====
        function init() {
            loadProfile();
            loadAppearance();
            applyProfile();
            applyChatSettings(appearance.chatSettings || {}, {save:false});
            applyMiscClass();
            loadThemeFromStorage();
            buildThemeEditor();
            try { renderMiscForm(); } catch(e){}
            try { renderChatSettingsForm(); } catch(e){}
            // Side new entry buttons
            function _bindSide(id, handler) {
                const b = document.getElementById(id);
                if (b) b.addEventListener('click', handler);
            }
            _bindSide('sideCalendarBtn', function(){ closeSidePanel(); openModal(calendarModal); });
            _bindSide('sideDiaryBtn',    function(){ closeSidePanel(); openModal(diaryModal); });
            _bindSide('sideLetterBtn',   function(){ closeSidePanel(); openModal(letterModal); });
            _bindSide('sideBoardBtn',    function(){ closeSidePanel(); openBoardModal(); });
            _bindSide('sideWishBtn',     function(){ closeSidePanel(); openWishModal(); });
            _bindSide('sideRpsBtn',      function(){ closeSidePanel(); openRpsModal(); });
            _bindSide('sideDoodleBtn',   function(){ closeSidePanel(); openDoodleModal(); });
            _bindSide('sideDrawGuessBtn',function(){ closeSidePanel(); openDrawGuessModal(); });
            // Data modal
            const openDataBtn = document.getElementById('openDataBtn');
            if (openDataBtn) openDataBtn.addEventListener('click', function(){ openSubModal(dataModal); });
            const closeDataModal = document.getElementById('closeDataModal');
            if (closeDataModal) closeDataModal.addEventListener('click', function(){ closeModal(dataModal); });
            const dataModalEl = document.getElementById('dataModal');
            if (dataModalEl) dataModalEl.addEventListener('click', function(e){ if (e.target === dataModalEl) closeModal(dataModalEl); });
            const btnExp = document.getElementById('btnExportAll'); if (btnExp) btnExp.addEventListener('click', exportAll);
            const fileImp = document.getElementById('fileImportAll'); if (fileImp) fileImp.addEventListener('change', function(e){ if (e.target.files && e.target.files[0]) importAll(e.target.files[0]); });
            const btnClr = document.getElementById('btnClearAll'); if (btnClr) btnClr.addEventListener('click', clearAllData);
            // Board
            const bss = document.getElementById('boardStyleSwitch');
            if (bss) bss.querySelectorAll('.chip').forEach(function(c){
                c.addEventListener('click', function(){ appearance.board_boardStyle = c.dataset.v; saveAppearance(); renderBoard(); });
            });
            const drawB = document.getElementById('drawBoardNoteBtn'); if (drawB) drawB.onclick = drawBoardNote;
            const bPb = document.getElementById('boardPhrasesBtn'); if (bPb) bPb.onclick = function(){ openPhraseModal('board'); };
            const bHb = document.getElementById('boardHistoryBtn'); if (bHb) bHb.onclick = function(){
                const list = document.getElementById('histList'); document.getElementById('histTitle').textContent = '📋 留言板历史';
                list.innerHTML = '';
                appearance.messageBoard.notes.forEach(function(n){
                    const it = document.createElement('div'); it.className = 'item';
                    it.innerHTML = '<span>'+(n.colorLabel||'')+'</span><span style="flex:1;">'+escapeHtml(n.content)+'<br><small style="opacity:0.5;">'+(n.timeStr||'')+' · '+(n.replied?'已回复':'未回复')+'</small></span>';
                    list.appendChild(it);
                });
                if (!appearance.messageBoard.notes.length) list.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text_muted);font-size:0.75rem;">暂无记录</div>';
                openModal(histModal);
            };
            const cbM = document.getElementById('closeBoardModal');
            if (cbM) { cbM.onclick = function(){ closeModal(boardModal); }; boardModal.addEventListener('click', function(e){ if (e.target === boardModal) closeModal(boardModal); }); }
            // Wish
            const dwB = document.getElementById('drawWishStarBtn'); if (dwB) dwB.onclick = drawWishStar;
            const wPb = document.getElementById('wishPhrasesBtn'); if (wPb) wPb.onclick = function(){ openPhraseModal('wish'); };
            const wHb = document.getElementById('wishHistoryBtn'); if (wHb) wHb.onclick = function(){
                const list = document.getElementById('histList'); document.getElementById('histTitle').textContent = '🌳 许愿树历史';
                list.innerHTML = '';
                appearance.wishTree.stars.forEach(function(s){
                    const it = document.createElement('div'); it.className = 'item';
                    it.innerHTML = '<span>'+(s.colorLabel||'')+'</span><span style="flex:1;">'+escapeHtml(s.content)+'<br><small style="opacity:0.5;">'+(s.timeStr||'')+' · '+(s.replied?'已回信':'未回信')+'</small></span>';
                    list.appendChild(it);
                });
                if (!appearance.wishTree.stars.length) list.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text_muted);font-size:0.75rem;">暂无记录</div>';
                openModal(histModal);
            };
            const cwM = document.getElementById('closeWishModal');
            if (cwM) { cwM.onclick = function(){ closeModal(wishModal); }; wishModal.addEventListener('click', function(e){ if (e.target === wishModal) closeModal(wishModal); }); }
            // Phrase modal
            const phraseS = document.getElementById('phraseSearchInput');
            if (phraseS) phraseS.oninput = function(){ const g = document.querySelector('#phraseTabs .mod-group-tab.active'); if (g) renderPhraseList(g.dataset.group); };
            const aPb = document.getElementById('addPhraseBtn'); if (aPb) aPb.onclick = function(){
                const v = (document.getElementById('phraseInput').value||'').trim(); if (!v) return;
                const g = document.querySelector('#phraseTabs .mod-group-tab.active');
                const key = (g && g.dataset.group && g.dataset.group !== 'all') ? g.dataset.group : STAR_COLORS[0].key;
                const cur = currentPhrases(); if (!cur[key]) cur[key] = [];
                if (cur[key].indexOf(v) >= 0) return showToast('已存在');
                cur[key].push(v); document.getElementById('phraseInput').value = ''; saveAppearance(); renderPhraseList(key);
            };
            const cpB = document.getElementById('clearPhraseBtn'); if (cpB) cpB.onclick = function(){
                if (!confirm('清空该类型话语库？')) return;
                const cur = currentPhrases(); Object.keys(cur).forEach(function(k){ cur[k] = []; });
                saveAppearance(); renderPhraseList(document.querySelector('#phraseTabs .mod-group-tab.active').dataset.group); showToast('已清空');
            };
            const rpB = document.getElementById('resetPhraseBtn'); if (rpB) rpB.onclick = function(){
                if (!confirm('恢复默认话语库？')) return;
                if (phraseKind === 'wish') appearance.wishTree.phrases = JSON.parse(JSON.stringify(DEFAULT_WISH_PHRASES));
                else appearance.messageBoard.phrases = JSON.parse(JSON.stringify(DEFAULT_BOARD_PHRASES));
                saveAppearance(); renderPhraseList('all'); showToast('已恢复');
            };
            const cpM = document.getElementById('closePhraseModal'); if (cpM) cpM.onclick = function(){ closeModal(phraseModal); };
            if (typeof phraseModal !== 'undefined' && phraseModal) phraseModal.addEventListener('click', function(e){ if (e.target === phraseModal) closeModal(phraseModal); });
            const chM = document.getElementById('closeHistModal'); if (chM) chM.onclick = function(){ closeModal(histModal); };
            if (typeof histModal !== 'undefined' && histModal) histModal.addEventListener('click', function(e){ if (e.target === histModal) closeModal(histModal); });
            // 占位 modals close
            [['closeCalendarModal','calendarModal'],['closeDiaryModal','diaryModal'],['closeLetterModal','letterModal']].forEach(function(pair){
                const cid = pair[0], mid = pair[1];
                const c = document.getElementById(cid); const m = document.getElementById(mid);
                if (c) c.onclick = function(){ if (m) closeModal(m); };
                if (m) m.addEventListener('click', function(e){ if (e.target === m) closeModal(m); });
            });
            // theme modal
            const ctM = document.getElementById('closeThemeModal'); if (ctM) ctM.onclick = function(){ closeModal(themeModal); };
            if (typeof themeModal !== 'undefined' && themeModal) themeModal.addEventListener('click', function(e){ if (e.target === themeModal) closeModal(themeModal); });
            // RPS
            const crM = document.getElementById('closeRpsModal');
            if (crM) { crM.onclick = function(){ closeModal(rpsModal); }; rpsModal.addEventListener('click', function(e){ if (e.target === rpsModal) closeModal(rpsModal); }); }
            document.querySelectorAll('#rpsRoleSwitch .chip').forEach(function(c){ c.addEventListener('click', async function(){
                const nr = c.dataset.role;
                if (nr === 'angle' && rpsMode === 'winner_rules' && rpsRole !== 'angle') {
                    const ok = await showConfirm('🌙 模式切换确认', '🌙 <b>梦角想要开启「双方都可制定奖惩」模式</b>，是否同意？<br><small style="opacity:0.7;">（回答会同步到聊天区告知梦角）</small>');
                    addChatMessage(ok ? '📝 梦女同意开启双方奖惩模式 🎉' : '📝 梦女暂时不想开启双方奖惩模式 😢', 'system');
                    if (!ok) { renderRps(); return; }
                }
                rpsRole = nr; renderRps();
            });});
            document.querySelectorAll('#rpsModeTabs .tab').forEach(function(t){ t.addEventListener('click', async function(){
                const nm = t.dataset.mode;
                if (nm === 'winner_rules' && rpsRole === 'angle') {
                    const ok = await showConfirm('🌙 模式切换确认', '🌙 <b>梦角想要开启「双方都可制定奖惩」模式</b>，是否同意？<br><small style="opacity:0.7;">（回答会同步到聊天区告知梦角）</small>');
                    addChatMessage(ok ? '📝 梦女同意开启双方奖惩模式 🎉' : '📝 梦女暂时不想开启双方奖惩模式 😢', 'system');
                    if (!ok) { renderRps(); return; }
                }
                rpsMode = nm; renderRps();
            });});
            document.querySelectorAll('#rpsModal .rps-actions .btn').forEach(function(b){ b.onclick = function(){ playRps(b.dataset.hand); }; });
            const rcB = document.getElementById('rpsClearBtn'); if (rcB) rcB.onclick = function(){ if (!confirm('清空猜拳历史？')) return; dreamGames.rps_history = []; dreamGames.rps_stats = {dreamerWins:0, angleWins:0, ties:0}; saveAppearance(); renderRps(); };
            const reB = document.getElementById('rpsExportBtn'); if (reB) reB.onclick = function(){
                const blob = new Blob([JSON.stringify({rps_history:dreamGames.rps_history, rps_stats:dreamGames.rps_stats}, null, 2)],{type:'application/json'});
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rps-history.json'; document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(a.href); if (a.parentNode) a.parentNode.removeChild(a);}, 1000);
            };
            // Doodle
            const cdM = document.getElementById('closeDoodleModal');
            if (cdM) { cdM.onclick = function(){ closeModal(doodleModal); }; doodleModal.addEventListener('click', function(e){ if (e.target === doodleModal) closeModal(doodleModal); }); }
            // Draw Guess
            const cgM = document.getElementById('closeDrawGuessModal');
            if (cgM) { cgM.onclick = function(){ closeModal(drawGuessModal); }; drawGuessModal.addEventListener('click', function(e){ if (e.target === drawGuessModal) closeModal(drawGuessModal); }); }
            document.querySelectorAll('#dgRoleSwitch .chip').forEach(function(c){ c.addEventListener('click', function(){ dgRole = c.dataset.role; renderDg(); }); });
            document.querySelectorAll('#dgModeTabs .tab').forEach(function(t){ t.addEventListener('click', async function(){
                const nm = t.dataset.mode;
                if (nm === 'free' && dgRole === 'angle' && dgMode !== 'free') {
                    const ok = await showConfirm('🌙 你画我猜模式切换确认', '🌙 <b>梦角想要玩「无话题自由画」模式</b>，是否同意？<br><small style="opacity:0.7;">（回答会同步到聊天区告知梦角）</small>');
                    addChatMessage(ok ? '📝 梦女同意开启自由画你画我猜 ✨' : '📝 梦女想继续玩话题限定的你画我猜 😅', 'system');
                    if (!ok) { renderDg(); return; }
                }
                dgMode = nm; renderDg();
            });});
            const sgB = document.getElementById('dgStartBtn'); if (sgB) sgB.onclick = startDgRound;
            const ggB = document.getElementById('dgGuessBtn'); if (ggB) ggB.onclick = dgGuess;
            const giI = document.getElementById('dgGuessInput'); if (giI) giI.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); dgGuess(); } });
            const tmB = document.getElementById('dgTopicMgrBtn'); if (tmB) tmB.onclick = function(){
                const w = document.getElementById('dgTopicMgrWrap'); w.dataset.open = (w.dataset.open === '1' ? '0' : '1'); renderDg();
            };
            // Init chatbox background first
            if (document.getElementById('chatBox')) document.getElementById('chatBox').style.background = 'var(--bg_chat)';
            // Old (legacy)
            groups = { default: [...DEFAULT_CARDS] };
            groupList = ['default'];
            cardLibrary = [...DEFAULT_CARDS];
            currentGroup = 'all';
            renderCards();
            emojiGroups = { default: [...DEFAULT_EMOJIS] };
            emojiGroupList = ['default'];
            emojiCurrentGroup = 'all';
            renderEmojis();
            patGroups = { default: [...DEFAULT_PATS] };
            patGroupList = ['default'];
            patCurrentGroup = 'all';
            renderPats();
            addChatMessage(`✦ 递出你的话语…… 字卡已备好。`, 'system');
            userInput.focus();
            // 右侧侧边栏
            openSidePanelBtn.addEventListener('click', openSidePanel);
            sideCloseBtn.addEventListener('click', closeSidePanel);
            sideOverlay.addEventListener('click', closeSidePanel);
            // 底部上弹侧边栏
            arrowUpBtn.addEventListener('click', toggleBottomSheet);
            // 底部按钮
            bottomCallBtn.addEventListener('click', () => { closeBottomSheet();
                openModal(callModal); });
            bottomEmojiBtn.addEventListener('click', () => { closeBottomSheet();
                openModal(emojiModal); });
            bottomPatBtn.addEventListener('click', () => { closeBottomSheet();
                openModal(patModal); });
            // 侧边栏按钮
            sideCardBtn.addEventListener('click', () => { closeSidePanel();
                openModal(cardModal); });
            sideEmojiBtn.addEventListener('click', () => { closeSidePanel();
                openModal(emojiModal); });
            sidePatBtn.addEventListener('click', () => { closeSidePanel();
                openModal(patModal); });
            // 设置主弹窗
            openSettingsBtn.addEventListener('click', () => openModal(settingsModal));
            closeSettingsBtn.addEventListener('click', () => closeModal(settingsModal));
            settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) closeModal(settingsModal); });
            // 外观设置子板块
            openThemeBtn.addEventListener('click', () => { buildThemeEditor(); openSubModal(themeModal); });
            openBgFontBtn.addEventListener('click', () => { renderChatSettingsForm(); openSubModal(chatSettingsModal); });
            openBubbleBtn.addEventListener('click', () => { renderChatSettingsForm(); openSubModal(chatSettingsModal); });
            openAvatarBtn.addEventListener('click', () => openSubModal(avatarModal));
            openNicknameBtn.addEventListener('click', () => openSubModal(nicknameModal));
            // ===== 新增：聊天设置 / 外观细节 两个入口 =====
            const openChatSettingsBtn = document.getElementById('openChatSettingsBtn');
            const openMiscBtn = document.getElementById('openMiscBtn');
            const chatSettingsModal = document.getElementById('chatSettingsModal');
            const miscModal = document.getElementById('miscModal');
            const closeChatSettingsModal = document.getElementById('closeChatSettingsModal');
            const closeMiscModal = document.getElementById('closeMiscModal');
            const chatResetBtn = document.getElementById('chatResetBtn');
            const chatPreviewBtn = document.getElementById('chatPreviewBtn');
            if (openChatSettingsBtn) openChatSettingsBtn.addEventListener('click', function(){ renderChatSettingsForm(); openSubModal(chatSettingsModal); });
            if (openMiscBtn) openMiscBtn.addEventListener('click', function(){ renderMiscForm(); openSubModal(miscModal); });
            if (closeChatSettingsModal) closeChatSettingsModal.addEventListener('click', function(){ closeModal(chatSettingsModal); });
            if (chatSettingsModal) chatSettingsModal.addEventListener('click', function(e){ if (e.target === chatSettingsModal) closeModal(chatSettingsModal); });
            if (closeMiscModal) closeMiscModal.addEventListener('click', function(){ closeModal(miscModal); });
            if (miscModal) miscModal.addEventListener('click', function(e){ if (e.target === miscModal) closeModal(miscModal); });
            if (chatResetBtn) chatResetBtn.addEventListener('click', function(){
                if (!confirm('将聊天设置恢复默认？当前调节会被清掉。')) return;
                appearance.chatSettings = JSON.parse(JSON.stringify({chatFontFamily:'inherit',chatFontSize:0.78,chatLineHeight:1.65,chatLetterSpacing:0,chatDensity:'normal',showBubbleTail:true,avatarShape:'circle',showNickname:'first',showTimeFormat:'auto',showDateDivider:true,showReadReceipt:true,enableSound:true,bubbleWidthPct:78,bubbleRadius:16,bubbleShadow:true,showAvatarOutside:true,chatAnimDuration:0.26,chatBgOpacity:1,chatBgPattern:'none'}));
                applyChatSettings(appearance.chatSettings, {save:true}); renderChatSettingsForm(); showToast('已恢复默认');
            });
            if (chatPreviewBtn) chatPreviewBtn.addEventListener('click', function(){
                addChatMessage('这是一条预览消息，用来感受字号/气泡/间距是否顺手~','user');
                addChatMessage('没问题！预览一眼就能找到最喜欢的设置 ♡','angle');
            });
            // 子板块关闭
            closeThemeModal.addEventListener('click', () => closeModal(themeModal));
            themeModal.addEventListener('click', (e) => { if (e.target === themeModal) closeModal(themeModal); });
            closeBgFontModal.addEventListener('click', () => closeModal(chatSettingsModal));
            bgFontModal.addEventListener('click', (e) => { if (e.target === bgFontModal) closeModal(chatSettingsModal); });
            closeBubbleModal.addEventListener('click', () => closeModal(chatSettingsModal));
            bubbleModal.addEventListener('click', (e) => { if (e.target === bubbleModal) closeModal(chatSettingsModal); });
            // 昵称弹窗
            closeNicknameModal.addEventListener('click', () => closeModal(nicknameModal));
            nicknameModal.addEventListener('click', (e) => { if (e.target === nicknameModal) closeModal(nicknameModal); });
            saveNicknameBtn.addEventListener('click', () => {
                userName = userNameInput.value.trim() || '我';
                angleName = angleNameInput.value.trim() || 'ta';
                saveFullProfile();
                closeModal(nicknameModal);
            });
      // 头像弹窗
            closeAvatarModal.addEventListener('click', () => closeModal(avatarModal));
            avatarModal.addEventListener('click', (e) => { if (e.target === avatarModal) closeModal(avatarModal); });
            shapeBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    avatarShape = this.dataset.shape;
                    shapeBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    applyProfile();
                });
            });
            applyUserAvatarBtn.addEventListener('click', () => {
                userAvatar = userAvatarInput.value.trim() || '🌸';
                applyProfile();
            });
            applyAngleAvatarBtn.addEventListener('click', () => {
                angleAvatar = angleAvatarInput.value.trim() || '🌙';
                applyProfile();
            });
            removeUserAvatarBtn.addEventListener('click', () => {
                userAvatar = '🌸';
                userAvatarInput.value = '🌸';
                applyProfile();
            });
            removeAngleAvatarBtn.addEventListener('click', () => {
                angleAvatar = '🌙';
                angleAvatarInput.value = '🌙';
                applyProfile();
            });
            [userSizeSlider, userLeftSlider, userTopSlider, angleSizeSlider, angleLeftSlider, angleTopSlider].forEach(
                slider => {
                    slider.addEventListener('input', function() {
                        const id = this.id;
                        const val = parseInt(this.value);
                        const labelMap = {
                            userSizeSlider: 'userSizeValue',
                            userLeftSlider: 'userLeftValue',
                            userTopSlider: 'userTopValue',
                            angleSizeSlider: 'angleSizeValue',
                            angleLeftSlider: 'angleLeftValue',
                            angleTopSlider: 'angleTopValue'
                        };
                        const valueEl = document.getElementById(labelMap[id]);
                        if (valueEl) valueEl.textContent = val + 'px';
                        if (id === 'userSizeSlider') userSize = val;
                        else if (id === 'userLeftSlider') userLeft = val;
                        else if (id === 'userTopSlider') userTop = val;
                        else if (id === 'angleSizeSlider') angleSize = val;
                        else if (id === 'angleLeftSlider') angleLeft = val;
                        else if (id === 'angleTopSlider') angleTop = val;
                        applyProfile();
                    });
                });
            saveAvatarBtn.addEventListener('click', () => {
                saveFullProfile();
                closeModal(avatarModal);
            });
            // 字卡
            closeCardModal.addEventListener('click', () => closeModal(cardModal));
            cardModal.addEventListener('click', (e) => { if (e.target === cardModal) closeModal(cardModal); });
            modAddGroupBtn.addEventListener('click', addCardGroup);
            modGroupInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addCardGroup(); });
            modDeleteGroupBtn.addEventListener('click', deleteCardGroup);
            modBatchImportBtn.addEventListener('click', batchImportCards);
            modClearBatchBtn.addEventListener('click', () => { modBatchInput.value = ''; });
            modBatchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    batchImportCards();
                }
            });
            modSelectBtn.addEventListener('click', toggleCardSelectMode);
            modDeleteSelectedBtn.addEventListener('click', deleteCardSelected);
            modMoveBtn.addEventListener('click', moveCardSelected);
            modClearAllBtn.addEventListener('click', clearAllCards);
            modResetDefaultBtn.addEventListener('click', resetDefaultCards);
            modSearchInput.addEventListener('input', function() {
                cardSearch = this.value;
                renderCards();
            });
            // 表情包
            closeEmojiModal.addEventListener('click', () => closeModal(emojiModal));
            emojiModal.addEventListener('click', (e) => { if (e.target === emojiModal) closeModal(emojiModal); });
            emojiSearchInput.addEventListener('input', function() {
                emojiSearch = this.value;
                renderEmojis();
            });
            addEmojiBtn.addEventListener('click', addEmoji);
            emojiInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addEmoji(); });
            clearEmojiBtn.addEventListener('click', clearEmojis);
            resetEmojiBtn.addEventListener('click', resetEmojis);
            emojiSelectBtn.addEventListener('click', toggleEmojiSelectMode);
            emojiDeleteSelectedBtn.addEventListener('click', deleteEmojiSelected);
            emojiMoveBtn.addEventListener('click', moveEmojiSelected);
   // 拍一拍
            closePatModal.addEventListener('click', () => closeModal(patModal));
            patModal.addEventListener('click', (e) => { if (e.target === patModal) closeModal(patModal); });
            patSearchInput.addEventListener('input', function() {
                patSearch = this.value;
                renderPats();
            });
            addPatBtn.addEventListener('click', addPat);
            patInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addPat(); });
            clearPatBtn.addEventListener('click', clearPats);
            resetPatBtn.addEventListener('click', resetPats);
            patSelectBtn.addEventListener('click', togglePatSelectMode);
            patDeleteSelectedBtn.addEventListener('click', deletePatSelected);
            patMoveBtn.addEventListener('click', movePatSelected);
            // 通话
            closeCallModal.addEventListener('click', () => closeModal(callModal));
            callModal.addEventListener('click', (e) => { if (e.target === callModal) closeModal(callModal); });
            callBtn.addEventListener('click', startCall);
            hangupBtn.addEventListener('click', hangupCall);
            // 发送
            sendBtn.addEventListener('click', handleSend);
            userInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            });
            document.getElementById('profileClick').addEventListener('click', () => {
                openModal(settingsModal);
            });
            chatBox.addEventListener('click', () => userInput.focus());
            document.addEventListener('keydown', function(e){
                if (e.key === 'Escape') {
                    if (sidePanel.classList.contains('open')) closeSidePanel();
                    if (bottomSheetOpen) closeBottomSheet();
                    const stack = [cardModal, settingsModal, themeModal, nicknameModal, avatarModal, emojiModal, patModal,
                                   boardModal, wishModal, rpsModal, doodleModal, drawGuessModal, dataModal, phraseModal, histModal,
                                   calendarModal, diaryModal, letterModal, confirmModal,
                                   typeof callModal !== 'undefined' ? callModal : null].filter(Boolean);
                    for (let i = stack.length - 1; i >= 0; i--) {
                        const m = stack[i];
                        if (m && m.classList && m.classList.contains('active')) { closeModal(m); break; }
                    }
                }
            });
            // Bottom sheet: add extra group items
            const bsg = document.querySelector('.bottom-sheet-grid');
            if (bsg && !document.getElementById('bottomBoardBtn')) {
                const oldM = bsg.querySelector('.sheet-item[style*="opacity"]'); if (oldM && oldM.parentNode) oldM.parentNode.removeChild(oldM);
                const items = [
                    {id:'bottomBoardBtn', icon:'📋', label:'留言板', onclick: function(){ closeBottomSheet(); openBoardModal(); }},
                    {id:'bottomWishBtn',  icon:'🌳', label:'许愿树', onclick: function(){ closeBottomSheet(); openWishModal(); }},
                    {id:'bottomRpsBtn',   icon:'✊', label:'猜拳',   onclick: function(){ closeBottomSheet(); openRpsModal(); }},
                    {id:'bottomDoodleBtn',icon:'🎨', label:'涂鸦',   onclick: function(){ closeBottomSheet(); openDoodleModal(); }},
                    {id:'bottomDGBtn',    icon:'🖌️', label:'你画我猜', onclick: function(){ closeBottomSheet(); openDrawGuessModal(); }}
                ];
                items.forEach(function(it){
                    const d = document.createElement('div'); d.className = 'sheet-item'; d.id = it.id;
                    d.innerHTML = '<span class="icon">'+it.icon+'</span><span class="label">'+it.label+'</span>';
                    d.addEventListener('click', it.onclick); bsg.appendChild(d);
                });
            }
            // Auto-render once after init for layout-dependent widths
            setTimeout(function(){ if (wishModal && wishModal.classList.contains('active')) renderWishTree(); }, 50);
        }
init();
    })();