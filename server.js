'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const PORT=Number(process.env.PORT||8080),HOST=process.env.HOST||'127.0.0.1';
const homeOrigin=new URL(process.env.HOME_ORIGIN||`http://ccna.localhost:${PORT}`).origin;
const base=new URL(homeOrigin);const origins=[homeOrigin,...['topics','exam','weakness'].map(mode=>{let u=new URL(homeOrigin);u.hostname=mode+'.'+base.hostname;return u.origin;})];
const allowedHosts=new Set(origins.map(o=>new URL(o).host));allowedHosts.add(`127.0.0.1:${PORT}`);allowedHosts.add(`localhost:${PORT}`);
const engine=fs.readFileSync(path.join(__dirname,'engine.js'),'utf8');
const bridge=`<!doctype html><html><head><meta charset="utf-8"><title>Local progress bridge</title></head><body><script>${engine}</script><script>
'use strict';const ALLOWED=${JSON.stringify(origins)},KEY='packet-practice-v1';
function read(){return JSON.parse(localStorage.getItem(KEY)||'{"version":1,"attempts":[],"sessions":[],"flags":{}}');}
function reply(event,data){event.source.postMessage(data,event.origin);}
addEventListener('message',event=>{if(!ALLOWED.includes(event.origin)||event.source!==parent||!event.data)return;try{let state=read();if(event.data.type==='ccna:merge'){const incoming=event.data.state;if(!incoming||incoming.version!==1||!Array.isArray(incoming.attempts)||!Array.isArray(incoming.sessions)||!incoming.flags)throw Error('Invalid state');state=CCNAEngine.merge(state,incoming);localStorage.setItem(KEY,JSON.stringify(state));}else if(event.data.type!=='ccna:get')return;reply(event,{type:'ccna:state',state});}catch(e){reply(event,{type:'ccna:error'});}});

</script></body></html>`;
const app=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const configured=app.replace('<script>const DATA=',`<script>window.CCNA_DEPLOY=${JSON.stringify({homeOrigin})};</script><script>const DATA=`);
const server=http.createServer((req,res)=>{
 if(!allowedHosts.has(req.headers.host)){res.writeHead(400,{'Content-Type':'text/plain'});res.end('Unrecognized hostname. Configure HOME_ORIGIN for deployment.');return;}
 if(req.headers.host===`localhost:${PORT}`||req.headers.host===`127.0.0.1:${PORT}`){res.writeHead(302,{'Location':homeOrigin});res.end();return;}
 const pathname=new URL(req.url,homeOrigin).pathname;
 const headers={'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':`default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src ${homeOrigin}; frame-ancestors ${origins.join(' ')}; object-src 'none'; base-uri 'none'; form-action 'none'`};
 if(pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end('{"ok":true}');return;}
 if(pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}
 if(pathname==='/storage-bridge.html'){res.writeHead(200,headers);res.end(bridge);return;}
 if(['/', '/index.html','/topics','/exam','/weakness'].includes(pathname)){res.writeHead(200,headers);res.end(configured);return;}
 res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');
});
server.listen(PORT,HOST,()=>console.log('Packet Practice is ready at '+homeOrigin+'\nMode addresses:\n'+origins.slice(1).join('\n')+'\nProgress is stored in your browser, not on this server.'));
