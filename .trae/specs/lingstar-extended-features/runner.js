const fs = require('fs');
const path = require('path');
let h = fs.readFileSync(path.join(__dirname, '..', '..', 'lingstar.html'), 'utf8');
console.log('original length', h.length);

// ========== 1: CSS injection ==========
h = h.replace(/<\/style>/, function(){
    return fs.readFileSync(path.join(__dirname, '_basecss.txt'), 'utf8') + '\n    </style>';
});
console.log('after CSS:', h.length);

// ========== 2: Modals HTML injection ==========
h = h.replace(/<script>/, function(){
    return fs.readFileSync(path.join(__dirname, '_modals.html'),'utf8') + '\n<script>';
});
console.log('after modals HTML:', h.length);

// ========== 3: JS constants/vars (js1) ==========
h = h.replace(/  \/\/ 昵称\/头像/, function(){
    return fs.readFileSync(path.join(__dirname, '_js1.txt'), 'utf8') + '\n  // 昵称/头像';
});
console.log('after js1:', h.length);

// ========== 4: Replace addChatMessage implementation ==========
const oldAdd = fs.readFileSync(path.join(__dirname, '_oldadd.txt'), 'utf8').trim();
const newAdd = fs.readFileSync(path.join(__dirname, '_newadd.txt'), 'utf8').trim();
if (!h.includes(oldAdd)) { console.error('oldAdd text not found'); process.exit(3); }
h = h.split(oldAdd).join(newAdd);
console.log('after addChat:', h.length);

// ========== 5: bigFunctions before init marker ==========
const fns = fs.readFileSync(path.join(__dirname, '_bigfuncs.js'), 'utf8');
if (!h.includes('        // ===== 初始化 =====')) { console.error('init marker not found'); process.exit(4); }
h = h.replace(/        \/\/ ===== 初始化 =====/, function(){ return fns + '\n        // ===== 初始化 ====='; });
console.log('after bigFunctions:', h.length);

// ========== 6: init() start ==========
const oldInit = fs.readFileSync(path.join(__dirname, '_oldinit.txt'), 'utf8').trim();
const newInit = fs.readFileSync(path.join(__dirname, '_initstart.js'), 'utf8').trim();
if (!h.includes(oldInit)) { console.error('oldInit not found'); process.exit(5); }
h = h.split(oldInit).join(newInit);
console.log('after init start:', h.length);

// ========== 7: ESC + bottom sheet end ==========
const oldEsc = fs.readFileSync(path.join(__dirname, '_oldesc_old.txt'), 'utf8').trim();
const newEsc = fs.readFileSync(path.join(__dirname, '_oldesc.js'), 'utf8').trim();
if (!h.includes(oldEsc)) { console.error('oldEsc not found'); process.exit(6); }
h = h.split(oldEsc).join(newEsc);

// ========== 8: reply type ==========
h = h.replace("addChatMessage(`✦ ${cardLibrary[idx]}`, 'system');",
                    "addChatMessage(`✦ ${cardLibrary[idx]}`, 'angle');");

fs.writeFileSync(path.join(__dirname, '..', '..', 'lingstar.html'), h);
console.log('Saved. Final size:', h.length);
