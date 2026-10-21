import http from 'node:http';
import {join,resolve,extname} from 'node:path';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {initDatabase,SafeMeal} from './core.mjs';
const here=resolve(fileURLToPath(new URL('.',import.meta.url)));
const db=initDatabase(process.env.DB_PATH||join(here,'safemeal.sqlite'),{seed:process.env.DEMO_SEED==='1'});
const svc=new SafeMeal(db);
const HOST=process.env.HOST||'127.0.0.1',PORT=Number(process.env.PORT||8000),ALLOWED=(process.env.ALLOWED_ORIGINS||'http://localhost:8000,http://127.0.0.1:8000').split(',');
const loginAttempts=new Map();
function output(res,status,obj,extra={}){const body=JSON.stringify(obj);res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra});res.end(body)}
function getBody(req){return new Promise((ok,no)=>{let x='',size=0;req.on('data',chunk=>{size+=chunk.length;if(size>65536){no(Object.assign(new Error('Payload quá lớn'),{status:413}));req.destroy()}else x+=chunk});req.on('end',()=>{try{ok(x?JSON.parse(x):{})}catch{no(Object.assign(new Error('JSON không hợp lệ'),{status:400}))}});req.on('error',no)})}
export async function handler(req,res){const url=new URL(req.url,'http://localhost'),path=url.pathname;const origin=req.headers.origin||'';if(origin&&ALLOWED.includes(origin)){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');}
 if(req.method==='OPTIONS'){res.writeHead(origin&&ALLOWED.includes(origin)?204:403);return res.end()}
 if(path==='/'||path==='/index.html'||['/app.js','/style.css','/qr-lib.js','/keccak.js','/ai-engine.js'].includes(path)){const fname=path==='/'?'index.html':path.slice(1);const mime=fname.endsWith('.html')?'text/html; charset=utf-8':fname.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8';res.writeHead(200,{'Content-Type':mime});return res.end(await readFile(join(here,'..','web',fname)))}
 if(!path.startsWith('/api/'))return output(res,404,{error:'Không tồn tại đường dẫn.'});
 try{const token=(req.headers.authorization||'').replace(/^Bearer /i,'');const user=svc.getUser(token);const data=req.method==='POST'?await getBody(req):{};
 if(req.method==='GET'&&path==='/api/health')return output(res,200,{ok:true,version:'4.0.0',mode:'local-fullstack'});
 if(req.method==='POST'&&path==='/api/auth/login'){const key=req.socket.remoteAddress||'local';const prev=loginAttempts.get(key)||{n:0,time:Date.now()};if(Date.now()-prev.time>60_000){prev.n=0;prev.time=Date.now()}if(prev.n>=12)return output(res,429,{error:'Thử lại sau ít phút.'});try{const result=svc.login(data.email,data.password);loginAttempts.delete(key);return output(res,200,result)}catch(e){prev.n++;loginAttempts.set(key,prev);throw e}}
 if(req.method==='GET'&&path==='/api/me')return output(res,user?200:401,user||{error:'Chưa đăng nhập'});
 if(req.method==='GET'&&path==='/api/ai-reports')return output(res,user?200:401,user?svc.listAI(user,url.searchParams.get('lotId')||''):{error:'Cần đăng nhập để xem báo cáo AI'});
 if(req.method==='POST'&&path==='/api/ai-reports')return output(res,201,svc.saveAI(user,data));
 if(req.method==='POST'&&/^\/api\/ai-reports\/\d+\/review$/.test(path))return output(res,200,svc.reviewAI(user,Number(path.split('/')[3]),data.note));
 if(req.method==='GET'&&path==='/api/ai-reports')return output(res,user?200:401,user?svc.listAI(user,url.searchParams.get('lotId')||''):{error:'Cần đăng nhập để xem báo cáo AI'});
 if(req.method==='POST'&&path==='/api/ai-reports')return output(res,201,svc.saveAI(user,data));
 if(req.method==='POST'&&/^\/api\/ai-reports\/\d+\/review$/.test(path))return output(res,200,svc.reviewAI(user,Number(path.split('/')[3]),data.note));
 if(req.method==='GET'&&path==='/api/lots')return output(res,200,svc.listLots());
 if(req.method==='POST'&&path==='/api/lots')return output(res,201,svc.createLot(user,data));
 if(req.method==='POST'&&/^\/api\/lots\/[^/]+\/handoff$/.test(path))return output(res,200,svc.handoff(user,decodeURIComponent(path.split('/')[3])));
 if(req.method==='POST'&&/^\/api\/lots\/[^/]+\/inspect\/[123]$/.test(path))return output(res,200,svc.inspect(user,decodeURIComponent(path.split('/')[3]),Number(path.split('/')[5]),data));
 if(req.method==='GET'&&/^\/api\/verify\/[^/]+$/.test(path))return output(res,200,svc.verify(decodeURIComponent(path.split('/')[3])));
 if(req.method==='POST'&&path==='/api/complaints')return output(res,201,svc.complain(data));
 if(req.method==='POST'&&/^\/api\/lots\/[^/]+\/hold$/.test(path))return output(res,200,svc.hold(user,decodeURIComponent(path.split('/')[3]),data.reason));
 if(req.method==='GET'&&path==='/api/audit'){if(user?.role!=='inspector')return output(res,403,{error:'Chỉ kiểm định viên.'});return output(res,200,svc.auditIntegrity())}
 return output(res,404,{error:'Đường dẫn API không tồn tại.'});
 }catch(e){if(e.code?.startsWith('SQLITE_CONSTRAINT'))return output(res,409,{error:'Dữ liệu đã tồn tại.'});return output(res,e.status||500,{error:e.status?e.message:'Lỗi hệ thống (xem terminal).'})}}
const app=http.createServer((req,res)=>handler(req,res).catch(e=>output(res,500,{error:'Server error'})));
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){app.listen(PORT,HOST,()=>console.log(`SafeMeal V4 API: http://${HOST}:${PORT} (DEMO_SEED=${process.env.DEMO_SEED||'0'})`))}
export {app};
