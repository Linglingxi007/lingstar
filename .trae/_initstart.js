        function init() {
            loadProfile();
            loadAppearance();
            applyProfile();
            buildThemeEditor();
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
