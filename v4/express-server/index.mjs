// Optional Express REST entrypoint for Lập trình Web nâng cao.
// Uses same tested business domain service as dependency-free server.
import express from 'express';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {initDatabase,SafeMeal} from '../server/core.mjs';
const app=express();
const db=initDatabase(process.env.DB_PATH||join(fileURLToPath(new URL('.',import.meta.url)),'safemeal-express.sqlite'),{seed:process.env.DEMO_SEED==='1'});
const svc=new SafeMeal(db);
app.disable('x-powered-by');app.use(express.json({limit:'64kb'}));
app.use((req,res,next)=>{const origin=req.headers.origin;const allowed=(process.env.ALLOWED_ORIGINS||'http://127.0.0.1:5173,http://localhost:5173').split(',');if(origin&&allowed.includes(origin)){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS')}if(req.method==='OPTIONS')return res.sendStatus(origin&&allowed.includes(origin)?204:403);next()});
const asyncRoute=fn=>(req,res,next)=>Promise.resolve().then(()=>fn(req,res)).catch(next);
const who=req=>svc.getUser((req.headers.authorization||'').replace(/^Bearer /i,''));
app.get('/api/health',(_req,res)=>res.json({ok:true,version:'4.0',server:'express',aiReportEndpoints:true}));
app.post('/api/auth/login',asyncRoute((req,res)=>res.json(svc.login(req.body.email,req.body.password))));
app.get('/api/me',asyncRoute((req,res)=>{const user=who(req);if(!user)return res.status(401).json({error:'Chưa đăng nhập'});return res.json(user)}));
app.get('/api/ai-reports',asyncRoute((req,res)=>{const user=who(req);if(!user)return res.status(401).json({error:'Cần đăng nhập để xem báo cáo AI'});return res.json(svc.listAI(user,req.query.lotId||''))}));
app.post('/api/ai-reports',asyncRoute((req,res)=>res.status(201).json(svc.saveAI(who(req),req.body))));
app.post('/api/ai-reports/:id/review',asyncRoute((req,res)=>res.json(svc.reviewAI(who(req),Number(req.params.id),req.body.note))));
app.get('/api/lots',asyncRoute((_req,res)=>res.json(svc.listLots())));
app.post('/api/lots',asyncRoute((req,res)=>res.status(201).json(svc.createLot(who(req),req.body))));
app.post('/api/lots/:id/inspect/:step',asyncRoute((req,res)=>res.json(svc.inspect(who(req),req.params.id,Number(req.params.step),req.body))));
app.post('/api/lots/:id/handoff',asyncRoute((req,res)=>res.json(svc.handoff(who(req),req.params.id))));
app.get('/api/verify/:code',asyncRoute((req,res)=>res.json(svc.verify(req.params.code))));
app.post('/api/complaints',asyncRoute((req,res)=>res.status(201).json(svc.complain(req.body))));
app.post('/api/lots/:id/hold',asyncRoute((req,res)=>res.json(svc.hold(who(req),req.params.id,req.body.reason))));
app.get('/api/audit',asyncRoute((req,res)=>{if(who(req)?.role!=='inspector')return res.status(403).json({error:'Không có quyền'});return res.json(svc.auditIntegrity())}));
app.use((err,req,res,next)=>{if(err.status)return res.status(err.status).json({error:err.message});if(err.code?.startsWith('SQLITE_CONSTRAINT'))return res.status(409).json({error:'Dữ liệu trùng'});console.error(err);return res.status(500).json({error:'Lỗi server'})});
app.listen(Number(process.env.PORT||8000),process.env.HOST||'127.0.0.1',()=>console.log('SafeMeal Express server ready'));
