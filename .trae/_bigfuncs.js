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
        // ===== 主题编辑器 UI =====
        function buildThemeEditor() {
            const sw = document.getElementById('themeSwatches');
            if (!sw) return;
            sw.innerHTML = '';
            Object.keys(THEME_PRESETS).forEach(function(key){
                const p = THEME_PRESETS[key];
                const d = document.createElement('div');
                d.className = 'theme-swatch'; d.title = p.name;
                d.style.background = 'linear-gradient(135deg, '+p.bg_page+' 0%, '+p.accent_soft+' 45%, '+p.accent+' 100%)';
                d.innerHTML = '<div class="name">'+p.name+'</div>';
                d.onclick = function(){ applyThemeVariables(p); saveCurrentThemeToStorage(); refreshThemeActive(); };
                sw.appendChild(d);
            });
            const cust = document.createElement('div');
            cust.className = 'theme-swatch custom'; cust.title = '📁 自定义';
            cust.innerHTML = '<span>➕</span><div class="name">自定义</div>';
            sw.appendChild(cust);
            const ed = document.getElementById('themeEditor');
            if (ed) {
                const fields = [
                    ['accent','强调色'],['accent2','强调色2'],
                    ['bubble_user','我的气泡'],['bubble_angle','ta的气泡'],
                    ['bg_chat','聊天背景'],['bg_page','页面背景'],
                    ['modal_bg','弹窗背景'],['overlay_color','遮罩色'],
                    ['text_primary','主文字'],['text_secondary','次级文字'],
                    ['side_panel_bg','侧栏背景'],['board_bg','留言板背景'],
                    ['wish_tree_bg','许愿树背景']
                ];
                ed.innerHTML = fields.map(function(kv){
                    const k = kv[0], label = kv[1];
                    let cur = (document.documentElement.style.getPropertyValue('--'+k.replace(/_/g,'-'))||'').trim();
                    if (!cur && THEME_PRESETS.zisakura[k]) cur = THEME_PRESETS.zisakura[k];
                    if (cur && cur.indexOf('gradient')>=0) cur = '#b088cc';
                    return '<div class="field"><span>'+label+'</span><input type="color" data-k="'+k+'" value="'+colorToHex(cur)+'"></div>';
                }).join('');
                ed.querySelectorAll('input').forEach(function(inp){
                    inp.addEventListener('input', function(){
                        const k = this.dataset.k; if (!k) return;
                        const patch = {}; patch[k] = this.value;
                        applyThemeVariables(Object.assign(getCurrentThemeVars(), patch));
                    });
                });
            }
            const bs = document.getElementById('btnSaveTheme');
            if (bs) bs.onclick = function(){
                const name = prompt('请为这套主题取一个名字：', '我的主题');
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
            document.querySelectorAll('.theme-swatch:not(.custom)').forEach(function(el){
                const t = el.title;
                let match = false;
                Object.keys(THEME_PRESETS).forEach(function(k){
                    if (THEME_PRESETS[k].name === t && THEME_PRESETS[k].accent === cur.accent) match = true;
                });
                el.classList.toggle('active', match);
            });
        }
        function renderSavedThemes() {
            const list = document.getElementById('savedPresetsList'); if (!list) return;
            list.innerHTML = '';
            const keys = Object.keys(appearance.savedThemes || {});
            if (!keys.length) {
                list.innerHTML = '<span style="font-size:0.7rem;color:var(--text_muted);padding:6px;">还没有保存的主题～ 调整颜色后点击 ➕ 保存当前为新主题 即可无限扩展 🎉</span>';
                return;
            }
            keys.forEach(function(name){
                const p = appearance.savedThemes[name];
                const el = document.createElement('div'); el.className='pi';
                const dotsArr = [p.accent, p.bubble_user, p.bubble_angle, p.bg_chat].filter(Boolean);
                const dotsHtml = dotsArr.map(function(c){return '<b style="background:'+colorToHex(c)+'"></b>';}).join('');
                el.innerHTML = '<span>'+escapeHtml(name)+' <span class="dots">'+dotsHtml+'</span></span>';
                el.onclick = function(){ applyThemeVariables(p); saveCurrentThemeToStorage(); renderSavedThemes(); refreshThemeActive(); };
                const del = document.createElement('button'); del.className='mini-btn danger'; del.textContent='删除';
                del.style.marginLeft = '6px';
                del.onclick = function(e){
                    e.stopPropagation();
                    if (confirm('删除该主题方案？ '+name)) {
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
        let rpsRole = 'dreamer', rpsMode = 'winner_rules', rpsRound = null;
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
        let dgRole = 'dreamer', dgMode = 'topic', dgRound = null, dgTimer = null;
        let dgCategory = null;
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
