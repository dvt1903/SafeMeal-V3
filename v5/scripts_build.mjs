import {readFile,writeFile} from 'node:fs/promises';
const R=new URL('./',import.meta.url);
const file=async x=>readFile(new URL(x,R),'utf8');
const page=await file('index.html');
const source=await Promise.all(['js/engine.mjs','js/ai.mjs','js/passport.mjs','js/app.mjs'].map(file));
const bundle=source.map((s,i)=>`// === ${i} ===\n`+s.replace(/^import .*;\s*$/gm,'').replace(/^export /gm,'')).join('\n\n');
const qrSource=await file('js/qr-lib.js');
const html=page.replace('<link rel="stylesheet" href="assets/style.css">','<style>'+await file('assets/style.css')+'</style>')
.replace('<script src="js/qr-lib.js"></script><script type="module" src="js/app.mjs"></script>',()=>'<script>'+qrSource+'</script><script>'+bundle+'</script>');
await writeFile(new URL('SafeMeal_V5_MO_NGAY.html',R),html);console.log('Wrote',html.length,'characters');
