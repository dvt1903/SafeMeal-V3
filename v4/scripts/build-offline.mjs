import {readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));const rd=x=>readFileSync(join(root,x),'utf8');
const qr=rd('web/qr-lib.js'),keccak=rd('web/keccak.js').replace(/\bexport\s+(?=function|const)/g,''),engine=rd('web/ai-engine.js').replace(/\bexport\s+(?=function|const)/g,''),app=rd('web/app.js').replace(/^import .*?;\s*$/gm,'');
const html=`<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#0a382d"/><title>SafeMeal V4.2 | AI Inspection Studio &amp; Web3</title><style>${rd('web/style.css')}</style></head><body><div id="app"><div style="padding:40px">Đang mở SafeMeal AI…</div></div><div id="toasts" aria-live="polite"></div><script>${qr}</script><script>${keccak}\n${engine}\n${app}\n</script></body></html>`;
writeFileSync(join(root,'MO_NGAY_V4.html'),html);console.log('Compiled offline demo',html.length,'chars');
