import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import worker from '../worker.mjs';
const root = resolve('dist');
const portIndex = process.argv.indexOf('--port');
const port = portIndex === -1 ? 4399 : Number(process.argv[portIndex + 1]);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.xml':'application/xml','.txt':'text/plain','.svg':'image/svg+xml','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2'};
const redirects = new Map((await readFile(resolve(root,'_redirects'),'utf8')).trim().split('\n').map(line=>line.split(/\s+/)).map(([from,to,status])=>[from,{to,status:Number(status)}]));
const server = http.createServer(async (req,res)=>{
 try {
  const url = new URL(req.url,'http://127.0.0.1');
  const redirect = redirects.get(url.pathname);
  if (redirect) { res.writeHead(redirect.status,{Location:redirect.to+url.search});return res.end(); }
  if (url.pathname.startsWith('/api/')) {
   const chunks=[];for await(const chunk of req) chunks.push(chunk);
   const request = new Request(url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:Buffer.concat(chunks)})});
   // Deliberately no secrets/provider bindings: real Worker, honest unavailable result.
   const response = await worker.fetch(request,{});
   res.writeHead(response.status,Object.fromEntries(response.headers));return res.end(await response.text());
  }
  let target = resolve(root,'.'+decodeURIComponent(url.pathname));
  if(target!==root && !target.startsWith(root+sep)) {res.writeHead(403);return res.end();}
  let status=200;
  try {if((await stat(target)).isDirectory())target=resolve(target,'index.html');await stat(target);} catch {target=resolve(root,'404.html');status=404;}
  const body=await readFile(target);res.writeHead(status,{'Content-Type':types[extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);
 } catch {res.writeHead(500);res.end('Unable to load preview.');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local built preview: http://127.0.0.1:${port} (email delivery disabled)`));
