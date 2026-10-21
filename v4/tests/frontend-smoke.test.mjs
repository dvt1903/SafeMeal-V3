import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import vm from 'node:vm';import {webcrypto} from 'node:crypto';
const engine=readFileSync(new URL('../web/ai-engine.js',import.meta.url),'utf8').replace(/\bexport\s+(?=function|const)/g,'');
const web=readFileSync(new URL('../web/app.js',import.meta.url),'utf8').replace(/^import .*?;\s*$/gm,'');
const eth=readFileSync(new URL('../web/keccak.js',import.meta.url),'utf8').replace(/\bexport\s+(?=(function|const))/g,'');
const el={innerHTML:'',append:()=>{}};const fake={querySelector:selector=>selector==='#app'?el:selector==='#toasts'?{append:()=>{}}:null,createElement:()=>({className:'',textContent:'',remove:()=>{}}),addEventListener:()=>{}};
const mem={};const store={getItem:k=>mem[k]||null,setItem:(k,v)=>{mem[k]=String(v)},removeItem:k=>{delete mem[k]}};
const ctx=vm.createContext({window:{ethereum:null},document:fake,localStorage:store,sessionStorage:store,crypto:webcrypto,location:{hostname:'example.org',origin:'https://example.org',pathname:'/v4/',search:''},URLSearchParams,TextEncoder,TextDecoder,Date,Intl,console,setTimeout:()=>{},history:{replaceState:()=>{}},navigator:{clipboard:{writeText:async()=>{}}}});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
test('Homepage + workflow render without a backend',async()=>{vm.runInContext(eth+'\n'+engine+'\n'+web,ctx);await wait(120);assert.match(el.innerHTML,/Mỗi bữa ăn, một hành trình minh bạch/);vm.runInContext('page="pipeline";render();',ctx);assert.match(el.innerHTML,/Kiểm định ba bước → một mã SMKD/);assert.match(el.innerHTML,/GIAI ĐOẠN 03/)});
test('Public verification is consistent for seeded certificates',async()=>{await vm.runInContext('verifyOffline(state.lots[0].certificate.code)',ctx).then(x=>{assert.equal(x.registered,true);assert.equal(x.status,'valid');assert.equal(x.meals.length,2)});await vm.runInContext('verifyOffline(state.lots[1].certificate.code)',ctx).then(x=>assert.equal(x.status,'expired'))});
test('Wallet ABI uses Ethereum Keccak selector',()=>{assert.equal(vm.runInContext('ethSelector("transfer(address,uint256)")',ctx),'0xa9059cbb')});
test('Wallet EIP-1193 integration requests accounts and signature (mock provider)',async()=>{
 const calls=[];ctx.window.ethereum={request:async ({method,params})=>{calls.push(method);if(method==='eth_requestAccounts')return ['0x1111111111111111111111111111111111111111'];if(method==='eth_chainId')return '0xaa36a7';if(method==='personal_sign')return '0xMockSignatureForTest';return null;}};
 await vm.runInContext('connectWallet()',ctx);vm.runInContext('page="wallet";render()',ctx);assert.match(el.innerHTML,/Đã kết nối địa chỉ ví/);
 await vm.runInContext('signWallet()',ctx);assert(calls.includes('eth_requestAccounts')&&calls.includes('personal_sign'));
});

test('Inspection wizard offers correct role switch and enables stage 2 for L003',async()=>{
 vm.runInContext('page="pipeline";currentLot="L003";role="retailer";render()',ctx);
 assert.match(el.innerHTML,/Bước cần thực hiện: 2\/3/);
 assert.match(el.innerHTML,/data-act="setrole" data-id="factory"/);
 await vm.runInContext('act({dataset:{act:"setrole",id:"factory"}})',ctx);
 assert.match(el.innerHTML,/data-act="inspect" data-id="L003"/);
 assert.doesNotMatch(el.innerHTML,/data-act="inspect" data-id="L003"[^>]*disabled/);
});


test('AI Studio renders four analyzers and can produce a cold-chain assessment',async()=>{
 vm.runInContext('page="ai";render()',ctx);
 assert.match(el.innerHTML,/AI Inspection Studio/);
 assert.match(el.innerHTML,/MobileNet/);
 assert.match(el.innerHTML,/Tesseract/);
 await vm.runInContext('aiDoAction("aicold","")',ctx);
 assert.match(el.innerHTML,/mẫu vượt ngưỡng/);
});
