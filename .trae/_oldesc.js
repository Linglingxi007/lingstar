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
