const fs = require('fs');
const path = require('path');
const DIR = path.resolve(__dirname);
let h = fs.readFileSync(path.join(DIR, '..', 'lingstar.html'), 'utf8');
console.log('original length', h.length);

h = h.replace(/<\/style>/, function(){
    return fs.readFileSync(path.join(DIR, '_basecss.txt'), 'utf8') + '\n    </style>';
});
console.log('after CSS:', h.length);

h = h.replace(/<script>/, function(){
    return fs.readFileSync(path.join(DIR, '_modals.html'),'utf8') + '\n<script>';
});
console.log('after modals HTML:', h.length);

h = h.replace(/  \/\/ 昵称\/头像/, function(){
    return fs.readFileSync(path.join(DIR, '_js1.txt'), 'utf8') + '\n  // 昵称/头像';
});
console.log('after js1:', h.length);

const oldAdd = fs.readFileSync(path.join(DIR, '_oldadd.txt'), 'utf8').trim();
const newAdd = fs.readFileSync(path.join(DIR, '_newadd.txt'), 'utf8').trim();
if (!h.includes(oldAdd)) { console.error('oldAdd text not found'); process.exit(3); }
h = h.split(oldAdd).join(newAdd);
console.log('after addChat:', h.length);

const fns = fs.readFileSync(path.join(DIR, '_bigfuncs.js'), 'utf8');
if (!h.includes('        // ===== 初始化 =====')) { console.error('init marker not found'); process.exit(4); }
h = h.replace(/        \/\/ ===== 初始化 =====/, function(){ return fns + '\n        // ===== 初始化 ====='; });
console.log('after bigFunctions:', h.length);

const oldInit = fs.readFileSync(path.join(DIR, '_oldinit.txt'), 'utf8').trim();
const newInit = fs.readFileSync(path.join(DIR, '_initstart.js'), 'utf8').trim();
if (!h.includes(oldInit)) { console.error('oldInit not found'); process.exit(5); }
h = h.split(oldInit).join(newInit);
console.log('after init start:', h.length);

const oldEsc = fs.readFileSync(path.join(DIR, '_oldesc_old.txt'), 'utf8').trim();
const newEsc = fs.readFileSync(path.join(DIR, '_oldesc.js'), 'utf8').trim();
if (!h.includes(oldEsc)) { console.error('oldEsc not found'); process.exit(6); }
h = h.split(oldEsc).join(newEsc);

h = h.replace("addChatMessage(`✦ ${cardLibrary[idx]}`, 'system');",
                    "addChatMessage(`✦ ${cardLibrary[idx]}`, 'angle');");

fs.writeFileSync(path.join(DIR, '..', 'lingstar.html'), h);
console.log('Saved. Final size:', h.length);
