import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

async function freePort() {
  const server=createServer();
  await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
  const port=server.address().port;
  await new Promise(resolve=>server.close(resolve));
  return port;
}

// Kiểm thử API qua HTTP thật và SQLite tạm; không dùng mock route.
test('HTTP end-to-end: auth → 3 steps → handoff → provenance AI → certificate → verify → complaint → hold', {timeout:35000}, async t=>{
  const dir=await mkdtemp(join(tmpdir(),'safemeal-e2e-'));
  const port=await freePort(), base=`http://127.0.0.1:${port}`;
  const proc=spawn(process.execPath,['server/server.mjs'],{
    cwd:new URL('..',import.meta.url).pathname,
    env:{...process.env,PORT:String(port),HOST:'127.0.0.1',DB_PATH:join(dir,'safemeal.sqlite'),DEMO_SEED:'1'},
    stdio:['ignore','pipe','pipe']
  });
  let log='';for(const stream of [proc.stdout,proc.stderr])stream.on('data',d=>log+=String(d));
  t.after(async()=>{proc.kill('SIGTERM');await rm(dir,{recursive:true,force:true});});
  async function req(path,method='GET',body=undefined,token=''){
    const res=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(5000)});
    return {status:res.status,body:await res.json()};
  }
  let ready=false;
  for(let i=0;i<60;i++){
    if(proc.exitCode!==null)throw Error('API failed to start: '+log);
    try{const r=await req('/api/health');if(r.status===200){ready=true;break;}}catch{}
    await delay(100);
  }
  assert(ready,'HTTP service did not start: '+log);
  const tokens={};
  for(const [role,email] of Object.entries({farm:'farm@safemeal.demo',factory:'factory@safemeal.demo',store:'store@safemeal.demo',inspector:'inspector@safemeal.demo'})){
    const r=await req('/api/auth/login','POST',{email,password:'SafeMeal@2026'});
    assert.equal(r.status,200,role+': '+JSON.stringify(r.body));
    tokens[role]=r.body.token;
  }
  const data={status:'pass',location:'Điểm kiểm tra mẫu',notes:'Biên bản kiểm định DEMO',expiry:'2027-12-31',temperature:4,seal:'intact'};
  assert.equal((await req('/api/lots/L003/inspect/2','POST',data,tokens.factory)).status,400,'step 2 cannot bypass step 1');
  assert.equal((await req('/api/lots/L003/inspect/1','POST',data,tokens.store)).status,403,'role enforced at API');
  assert.equal((await req('/api/lots/L003/inspect/1','POST',data,tokens.farm)).status,200);
  assert.equal((await req('/api/lots/L003/inspect/2','POST',data,tokens.factory)).status,200);
  const series='08:00,3.8\n08:30,4.1\n09:00,4.2\n09:30,4.0\n10:00,4.3\n10:30,4.0';
  const before=await req('/api/ai-reports','POST',{lotId:'L003',stage:3,series,sourceKind:'demo'},tokens.store);
  assert.equal(before.status,409,'no stage 3 AI before handoff');
  assert.equal((await req('/api/lots/L003/handoff','POST',{},tokens.store)).status,200);
  const ai=await req('/api/ai-reports','POST',{lotId:'L003',stage:3,series,sourceKind:'csv',sourceNote:'sensor-l003.csv'},tokens.store);
  assert.equal(ai.status,201,JSON.stringify(ai.body));
  assert.equal(ai.body.source.kind,'csv');
  assert.equal(ai.body.source.verifiedByIndependentSensor,false);
  assert.match(ai.body.source.seriesSHA256,/^[0-9a-f]{64}$/);
  assert.equal((await req('/api/lots/L003/inspect/3','POST',data,tokens.store)).status,200);
  const again=await req('/api/ai-reports','POST',{lotId:'L003',stage:3,series},tokens.store);
  assert.equal(again.status,409,'do not attach AI to completed inspection');
  const lots=await req('/api/lots');
  const code=lots.body.find(l=>l.id==='L003').certificate.code;
  assert.match(code,/^SMKD-L003-[A-F0-9]{12}$/);
  const verified=await req('/api/verify/'+encodeURIComponent(code));
  assert.equal(verified.body.status,'valid');
  const c=await req('/api/complaints','POST',{code,body:'Lô sản phẩm này có mùi khác thường và tem bị bong',printedLot:'L003',seal:'broken'});
  assert.equal(c.status,201);
  assert.equal(c.body.classification,'seal-broken');
  assert.equal((await req('/api/lots/L003/hold','POST',{reason:'Cần lấy mẫu thực địa và rà soát chứng từ'},tokens.inspector)).status,200);
  assert.equal((await req('/api/verify/'+encodeURIComponent(code))).body.status,'held');
  assert.equal((await req('/api/audit','GET',undefined,tokens.inspector)).body.ok,true);
});
