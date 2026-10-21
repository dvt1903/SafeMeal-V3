import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const here=resolve(fileURLToPath(new URL('..',import.meta.url)));
const child=spawn(process.execPath,['server/server.mjs'],{cwd:here,env:{...process.env,DEMO_SEED:process.env.DEMO_SEED??'1',PORT:process.env.PORT??'8000'},stdio:'inherit'});
child.on('exit',code=>process.exit(code??1));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>child.kill(signal));
