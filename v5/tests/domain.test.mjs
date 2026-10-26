import test from 'node:test';import assert from 'node:assert/strict';
import {makeLot,inspect,nextStep,handoff,issueCertificate,seed,seedCertified,lastAttempt,certificateStatus,setHold} from '../js/engine.mjs';
import {parseSeries,analyzeTemperature,classifyComplaint,matchOCR} from '../js/ai.mjs';
import {createPassport,decodePassport} from '../js/passport.mjs';
const lot=()=>makeLot({id:'L100',name:'Cà rốt thử nghiệm',origin:'Đơn Dương',qty:100,unit:'kg',threshold:8});
const go1=l=>inspect(l,{step:1,result:'pass',actor:'farm',location:'Nông trại An Phúc',notes:'Đã kiểm tra nhật ký thu hoạch'});
const go2=l=>inspect(l,{step:2,result:'pass',actor:'factory',location:'Xưởng GreenFood',notes:'Kiểm tra đóng gói và kiểm nghiệm',expiry:'2027-12-31'});
test('three-step requirements enforce role and order',async()=>{const l=lot();await assert.rejects(go2(l),/bước 1/);await assert.rejects(inspect(l,{step:1,result:'pass',actor:'factory'}),/Sai vai trò/);await go1(l);assert.equal(nextStep(l),2);await go2(l);assert.equal(nextStep(l),3);await assert.rejects(inspect(l,{step:3,result:'pass',actor:'retailer',location:'Quầy 1',notes:'Có biên bản',temperature:4,seal:'intact'}),/nhận hàng/);});
test('failure stays in audit history, remediation required',async()=>{const l=lot();await go1(l);await inspect(l,{step:2,result:'fail',actor:'factory',location:'Xưởng GreenFood',notes:'Niêm phong không đạt',expiry:'2027-12-31'});assert.equal(nextStep(l),2);await assert.rejects(go2(l),/biện pháp khắc phục/);await inspect(l,{step:2,result:'pass',actor:'factory',location:'Xưởng GreenFood',notes:'Kiểm tra lại đạt',expiry:'2027-12-31',correction:'Đã thay bao bì và đối chiếu hồ sơ'});assert.equal(l.inspections.length,3);assert.equal(l.inspections[1].result,'fail');assert.equal(lastAttempt(l,2).result,'pass');assert.equal(nextStep(l),3);});
test('third stage must have AI report after handoff; high risk requires human review',async()=>{const l=lot();await go1(l);await go2(l);handoff(l,'retailer');await assert.rejects(inspect(l,{step:3,result:'pass',actor:'retailer',location:'Quầy bán số 1',notes:'Ngoại quan đạt',temperature:4,seal:'intact'}),/báo cáo AI/);l.aiReports.push({stage:3,created:new Date(Date.now()+2000).toISOString(),risk:{score:89,level:'high'}});await assert.rejects(inspect(l,{step:3,result:'pass',actor:'retailer',location:'Quầy bán số 1',notes:'Ngoại quan đạt',temperature:4,seal:'intact'}),/Ban kiểm định/);l.aiReports[0].review={notes:'Đã kiểm nghiệm mẫu thực tế',by:'inspector'};await inspect(l,{step:3,result:'pass',actor:'retailer',location:'Quầy bán số 1',notes:'Ngoại quan đạt',temperature:4,seal:'intact'});const p=await issueCertificate(l);assert.match(p.code,/^SMKD-L100-[0-9A-F]{12}$/);await assert.rejects(issueCertificate(l),/một mã/);});
test('certificate is portable, readable with no localStorage',async()=>{const db=seed();await seedCertified(db);const l=db.lots.find(x=>x.id==='L001');let pass=await createPassport(l);assert(pass.url.includes('passport.html#p='));let decoded=await decodePassport(pass.token);assert.equal(decoded.record.n,'Rau xà lách Đà Lạt');assert.equal(decoded.record.st.length,3);assert.equal(decoded.record.c,pass.code);assert(pass.url.length<1600,`QR URL too large: ${pass.url.length}`);let broken=pass.token.slice(0,-2)+'ab';await assert.rejects(decodePassport(broken));});
test('expired, held certificate cannot be presented as sellable',async()=>{const db=seed();await seedCertified(db);const l=db.lots[0];assert.equal(certificateStatus(l).level,'valid');l.expiry='2020-01-01';assert.equal(certificateStatus(l).level,'expired');setHold(l,'Lô có phản ánh ảnh hưởng sức khỏe','inspector');assert.equal(certificateStatus(l).level,'held');});
test('cold chain and data validation',()=>{const text='08:00,4.1\n08:30,4.2\n09:00,11.4\n09:30,12.0\n10:00,4.3';let a=analyzeTemperature(text,8);assert.equal(a.exceed,2);assert.equal(a.level,'high');assert.equal(a.longest,2);assert.throws(()=>parseSeries('08:00,hello\n08:10,4.2'),/Sai định dạng/);});
test('NLP and OCR support investigation but do not automatically certify',()=>{const n=classifyComplaint('Tem mã QR không khớp mã lô trên bao bì');assert(n.confidence>0);const r=matchOCR('L009 CA ROT HUU CO','L003' in {}?{id:'L009'}:{id:'L003'});assert.equal(r.match,false);assert.deepEqual(r.found,['L009']);});
test('AI evidence fusion escalates OCR identity mismatch',async()=>{const {fuseEvidence}=await import('../js/ai.mjs');const cold=analyzeTemperature('08:00,4.0\n08:30,4.1\n09:00,4.2\n09:30,4.3',8);assert.equal(fuseEvidence({cold}).level,'low');const flagged=fuseEvidence({cold,ocr:{match:false}});assert.equal(flagged.level,'high');assert(flagged.reasons.some(x=>x.includes('OCR')));});

test('repeated QR passports preserve product data and failed checks cannot issue code',async()=>{
  const db=seed();await seedCertified(db);
  for(const l of db.lots.filter(x=>x.certificate)){
    const pass=await createPassport(l),again=await decodePassport(pass.token);
    assert.equal(again.record.n,l.name);
    assert.equal(again.record.o,l.origin);
    assert.equal(again.record.id,l.id);
    assert.equal(again.record.st.length,3);
    assert.equal(again.record.c,l.certificate.code);
    assert(pass.url.startsWith('https://dvt1903.github.io/SafeMeal-V3/v5/passport.html#p='));
  }
  const failed=lot();await go1(failed);await inspect(failed,{step:2,result:'fail',actor:'factory',location:'Xưởng thử nghiệm',notes:'Niêm phong sản phẩm không đạt',expiry:'2027-12-31'});
  await assert.rejects(issueCertificate(failed),/Chưa đủ ba phiếu/);
});

test('local preview HTTP serves root and /v5 aliases including passport module',async()=>{
  const {spawn}=await import('node:child_process');
  const serverPath=new URL('../server.mjs',import.meta.url);
  const proc=spawn(process.execPath,[serverPath.pathname],{env:{...process.env,HOST:'127.0.0.1',PORT:'18247'},stdio:'ignore'});
  try{
    let res;
    for(let i=0;i<40;i++){
      try{res=await fetch('http://127.0.0.1:18247/');break}catch{await new Promise(r=>setTimeout(r,100))}
    }
    assert.equal(res?.status,200,'preview server failed');
    for(const path of ['/index.html','/v5/','/v5/index.html','/passport.html','/v5/passport.html','/v5/js/passport-view.mjs','/v5/assets/style.css']){
      const response=await fetch('http://127.0.0.1:18247'+path);assert.equal(response.status,200,path);
      const body=await response.text();assert(body.length>100,path+' blank');
    }
    const bad=await fetch('http://127.0.0.1:18247/no-such-file.html');assert.equal(bad.status,404);
  } finally{proc.kill('SIGTERM')}
});


test('freshly created custom lot L987 runs farm, factory, AI, POS and cross-device QR',async()=>{
 const db=seed();const batch=makeLot({id:'L987',name:'Rau cải thử nghiệm mới',origin:'Hợp tác xã Đức Trọng',qty:42,unit:'kg',threshold:3.5});
 db.lots.unshift(batch);db.active=batch.id;assert.equal(db.lots.length,5);assert.equal(batch.id,'L987');assert.equal(nextStep(batch),1);
 await inspect(batch,{step:1,result:'pass',actor:'farm',location:'Vùng trồng Đức Trọng',notes:'Kiểm tra nhật ký thu hoạch có ghi giờ và người phụ trách'});
 await inspect(batch,{step:2,result:'fail',actor:'factory',location:'Xưởng mới',notes:'Bao bì hư hỏng cần đóng gói lại',expiry:'2028-12-31'});
 assert.equal(nextStep(batch),2);
 await inspect(batch,{step:2,result:'pass',actor:'factory',location:'Xưởng mới',notes:'Đã kiểm tra lại các chứng từ và niêm phong',expiry:'2028-12-31',correction:'Đã thay bao bì và kiểm tra lại từng kiện hàng'});
 handoff(batch,'retailer');const {analyzeTemperature,fuseEvidence}=await import('../js/ai.mjs');
 const series='08:00,1.1\n08:30,1.2\n09:00,1.3\n09:30,1.1\n10:00,1.4';const risk=fuseEvidence({cold:analyzeTemperature(series,batch.threshold)});
 batch.aiReports.push({id:'AI-L987',stage:3,created:new Date(Date.now()+2000).toISOString(),risk,source:'manual_input',series});
 await inspect(batch,{step:3,result:'pass',actor:'retailer',location:'Quầy thực phẩm',notes:'Nhiệt độ đạt, niêm phong nguyên',temperature:1.4,seal:'intact'});
 const issued=await issueCertificate(batch);assert.match(issued.code,/^SMKD-L987-[A-F0-9]{12}$/);
 const p=await createPassport(batch);const imported=await decodePassport(p.token);assert.equal(imported.record.n,'Rau cải thử nghiệm mới');assert.equal(imported.record.id,'L987');assert.equal(imported.record.st.length,3);assert.equal(imported.record.o,'Hợp tác xã Đức Trọng');assert.equal(batch.inspections.length,4);assert.equal(nextStep(batch),4);
 db.meals.push({id:'M987',name:'Canh rau cải',servings:42,ingredients:[{lot:'L987',qty:0}]});
 assert.equal((await import('../js/engine.mjs')).relatedMeals(db,'L987').length,1);
});

test('custom batch IDs validate and static data survives JSON export/import',()=>{
 assert.throws(()=>makeLot({id:'abc space',name:'Cải xanh',origin:'Lâm Đồng',qty:3,threshold:5}),/Mã lô/);
 const state=seed();state.lots.unshift(makeLot({id:'MUA-XUAN-88',name:'Bắp cải',origin:'Đà Lạt',qty:30,threshold:5}));state.active='MUA-XUAN-88';
 const copy=JSON.parse(JSON.stringify(state));assert.equal(copy.lots.length,5);assert.equal(copy.lots[0].name,'Bắp cải');assert.equal(copy.active,'MUA-XUAN-88');
});
