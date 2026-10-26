import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createContext,runInContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
import * as engine from '../js/engine.mjs';
import * as ai from '../js/ai.mjs';
import * as passport from '../js/passport.mjs';

test('UI can add L987 and carry it across inspection, AI, QR and the lot list',async()=>{
 const nodes=new Map(),saved=new Map(),session=new Map();
 const el=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',value:'',classList:{remove(){},add(){}},dataset:{}});return nodes.get(s)};
 const storage=m=>({getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)});
 class Form {constructor(x){return Object.entries(x.fields||{})}}
 let source=await readFile(new URL('../js/app.mjs',import.meta.url),'utf8');
 source=source.replace(/^import .*;\s*$/gm,'').replace(/\ninit\(\);\s*$/,'');
 const context=createContext({...engine,...ai,...passport,qrSVG:()=>'<svg></svg>',crypto:webcrypto,
  document:{querySelector:el,querySelectorAll:()=>[],addEventListener(){}},
  localStorage:storage(saved),sessionStorage:storage(session),FormData:Form,
  window:{},URL:{revokeObjectURL(){}},setTimeout:()=>1,clearTimeout:()=>{},
  console,Blob,TextEncoder,TextDecoder,Response,CompressionStream,DecompressionStream,
  prompt:()=>null,confirm:()=>true
 });
 const run=x=>runInContext(x,context);
 const submit=(id,fields)=>run('handleForm')({id,fields});
 runInContext(source,context);
 run('db=seed();page="lots";role="farm";render()');
 assert.match(el('#app').innerHTML,/Toàn bộ lô sản phẩm/);
 await submit('new-lot-form',{id:'L987',name:'Rau cải mới',origin:'HTX Đức Trọng',qty:'45',unit:'kg',threshold:'3.5'});
 assert.equal(run('getLot().id'),'L987');assert.equal(run('nextStep(getLot())'),1);
 assert.equal(JSON.parse(saved.get('safemeal_v5_individual_demo')).lots.length,5);
 await submit('inspect-form',{step:'1',result:'pass',location:'Đức Trọng',notes:'Đã kiểm tra nguồn gốc rau cải'});
 await run('onAction')('set-role','factory');
 await submit('inspect-form',{step:'2',result:'pass',location:'Xưởng chế biến',notes:'Niêm phong và hồ sơ đạt',expiry:'2028-12-31'});
 await run('onAction')('set-role','retailer');
 await run('onAction')('handoff');
 await run('onAction')('lot-to-ai','L987');
 assert.match(el('#app').innerHTML,/3.5°C/);
 run('aiCSV=aiSeriesFor(getLot(),"normal");aiResult=analyzeTemperature(aiCSV,getLot().threshold)');
 await run('onAction')('ai-save');
 await run('onAction')('goto','workflow');
 await submit('inspect-form',{step:'3',result:'pass',location:'Quầy số 1',notes:'Bảo quản tốt niêm phong nguyên',temperature:'1.5',seal:'intact'});
 assert.match(run('getLot().certificate.code'),/^SMKD-L987-/);
 await run('onAction')('lot-to-passport','L987');
 await new Promise(ok=>setTimeout(ok,30));
 assert.match(el('#qr-output').innerHTML,/QR mang thông tin sản phẩm/);
 await run('onAction')('goto','lots');
 assert.match(el('#app').innerHTML,/L987/);
});
