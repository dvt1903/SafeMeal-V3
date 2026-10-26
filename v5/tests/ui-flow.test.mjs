import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createContext, runInContext} from 'node:vm';
import * as engine from '../js/engine.mjs';
import * as ai from '../js/ai.mjs';
import * as passport from '../js/passport.mjs';
import {webcrypto} from 'node:crypto';

const elements=new Map();
const listeners=new Map();
const element=selector=>{if(!elements.has(selector))elements.set(selector,{innerHTML:'',textContent:'',value:'',classList:{remove(){},add(){}},dataset:{}});return elements.get(selector)};
const local=new Map(),session=new Map();
const storage=m=>({getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)});
class FakeFormData {constructor(form){return Object.entries(form.fields||{})}}
let context;
async function loadUI(){
 local.clear();session.clear();elements.clear();listeners.clear();
 const source=await readFile(new URL('../js/app.mjs',import.meta.url),'utf8');
 const edited=source.replace(/^import .*;\s*$/gm,'').replace(/\ninit\(\);\s*$/,'');
 context=createContext({...engine,...ai,...passport,qrSVG:url=>'<svg data-url="'+url.slice(0,50)+'"></svg>',crypto:webcrypto,
  document:{querySelector:element,querySelectorAll:()=>[],addEventListener(type,handler){listeners.set(type,handler)}},
  localStorage:storage(local),sessionStorage:storage(session),FormData:FakeFormData,
  window:{addEventListener(){}}, URL:{revokeObjectURL(){}},setTimeout:()=>1,clearTimeout:()=>{},console,
  Blob,TextEncoder,TextDecoder,Response,CompressionStream,DecompressionStream,
  prompt:()=>null,confirm:()=>true,
 });
 runInContext(edited,context);
 runInContext('db=seed();page="lots";role="farm";render();',context);
}
const run=script=>runInContext(script,context);
const form=(id,fields)=>({id,fields});
test('freshly created unseeded L987 appears in all screens and completes full workflow',async()=>{
 await loadUI();
 assert.match(element('#app').innerHTML,/Toàn bộ lô sản phẩm/);
 assert.match(element('#navigation').innerHTML,/Quản lý lô/);
 await run('handleForm')(form('new-lot-form',{id:'L987',name:'Rau cải mới thử nghiệm',origin:'HTX Đức Trọng',qty:'45',unit:'kg',threshold:'3.5'}));
 assert.match(element('#app').innerHTML,/L987/);
 assert.equal(run('getLot()').id,'L987');
 assert.equal(run('page'),'lots');
 assert.match(element('#app').innerHTML,/id="new-lot-confirmation"/);
 assert.match(element('#app').innerHTML,/data-lot-id="L987"/);
 await run('onAction')('open-lot','L987');
 assert.equal(run('page'),'workflow');
 assert.equal(JSON.parse(local.get('safemeal_v5_individual_demo')).lots.length,5);
 assert.equal(JSON.parse(local.get('safemeal_v5_individual_demo')).active,'L987');
 assert.match(element('#app').innerHTML,/Ghi phiếu kiểm định bước 1/);
 await run('handleForm')(form('inspect-form',{step:'1',result:'pass',location:'Trang trại Đức Trọng',notes:'Nhật ký thu hoạch có chữ ký'}));
 assert.equal(run('nextStep(getLot())'),2);
 await run('onAction')('set-role','factory');
 await run('handleForm')(form('inspect-form',{step:'2',result:'pass',location:'Xưởng chế biến',notes:'Hồ sơ đóng gói hợp lệ',expiry:'2028-12-31'}));
 assert.equal(run('nextStep(getLot())'),3);
 await run('onAction')('set-role','retailer');
 await run('onAction')('handoff');
 await run('onAction')('lot-to-ai','L987');
 assert.match(element('#app').innerHTML,/Ngưỡng 3.5°C/);
 assert.match(run('aiSeriesFor(getLot(),"normal")'),/08:00/);
 run('aiCSV=aiSeriesFor(getLot(),"normal");aiResult=analyzeTemperature(aiCSV,getLot().threshold)');
 await run('onAction')('ai-save');
 assert.equal(run('getLot().aiReports.length'),1);
 await run('onAction')('goto','workflow');
 assert.match(element('#app').innerHTML,/Ghi phiếu kiểm định bước 3/);
 await run('handleForm')(form('inspect-form',{step:'3',result:'pass',location:'Quầy thực phẩm Đức Trọng',notes:'Niêm phong nguyên và đo thực tế đạt',temperature:'1.3',seal:'intact'}));
 assert.equal(run('getLot().certificate.code').startsWith('SMKD-L987-'),true);
 await run('onAction')('lot-to-passport','L987');
 await new Promise(resolve=>setTimeout(resolve,140));
 assert.match(element('#qr-output').innerHTML,/QR mang thông tin sản phẩm/);
 await run('onAction')('lot-to-incident','L987');
 await run('handleForm')(form('new-meal-form',{name:'Canh cải tươi',servings:'50',amount:'2'}));
 assert.match(element('#app').innerHTML,/Canh cải tươi/);
 await run('onAction')('goto','lots');
 assert.match(element('#app').innerHTML,/L987/);
 assert.match(element('#app').innerHTML,/data-id="L987"/);
 assert.equal(run('db.meals.find(x=>x.name==="Canh cải tươi").ingredients[0].qty'),2);
 assert.equal(JSON.parse(local.get('safemeal_v5_individual_demo')).lots[0].id,'L987');
 await run('init()');
 assert.equal(run('getLot().id'),'L987');
 assert.match(element('#app').innerHTML,/L987/);
});


test('submit handler handles HTML form named id without native GET navigation',async()=>{
 await loadUI();
 const fakeForm={id:{tagName:'INPUT',name:'id'},getAttribute:name=>name==='id'?'new-lot-form':null,
  fields:{lotCode:'L998',name:'Sữa tươi thanh trùng',origin:'Hà Nội',qty:'40',unit:'lít',threshold:'6'}};
 let nativePrevented=false;
 assert.equal(typeof listeners.get('submit'),'function');
 listeners.get('submit')({target:fakeForm,preventDefault(){nativePrevented=true}});
 assert.equal(nativePrevented,true,'MUST prevent native form GET navigation');
 await new Promise(resolve=>setTimeout(resolve,75));
 assert.equal(JSON.parse(local.get('safemeal_v5_individual_demo')).lots[0].id,'L998');
 assert.equal(run('getLot().id'),'L998');
 assert.match(element('#app').innerHTML,/L998/);
});
