import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const result=[];
try{
 const routes=['/','/en/','/realisations/','/en/work/','/a-propos/','/en/about/','/contact/','/en/contact/','/realisations/pos-telephonie/','/en/work/pos-telephonie/','/realisations/easy-salaires/','/en/work/easy-salaires/','/realisations/canapey/','/en/work/canapey/'];
 for(const [width,height] of [[390,844],[320,740],[768,1024],[1265,714]]){
  const context=await browser.newContext({viewport:{width,height}});const p=await context.newPage();
  for(const route of routes){
   await p.goto('http://127.0.0.1:4399'+route);await p.evaluate(()=>document.fonts.ready);
   const textClips=await p.evaluate(()=>[...document.querySelectorAll('main h1,main h2,main h3,main p,footer a')].filter(el=>{
    if(el.closest('[aria-hidden=true]')||el.closest('.signature-resolution'))return false;
    if(getComputedStyle(el).visibility==='hidden'||getComputedStyle(el).display==='none')return false;
    const range=document.createRange();range.selectNodeContents(el);const r=range.getBoundingClientRect();return r.width>0&&(r.left < -3||r.right > innerWidth+3);
   }).map(el=>({text:el.textContent.slice(0,80),class:el.className,width:el.getBoundingClientRect().width})));
   const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   if(textClips.length||overflow)result.push({width,height,route,overflow,textClips});
  }
  if(width===1265){await p.goto('http://127.0.0.1:4399/');await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:'output/qa/site/short-desktop-hero.png'});}
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:900}});const p=await context.newPage();
 await p.addInitScript(()=>{window.__metrics={cls:0,lcp:0};new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__metrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())window.__metrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});});
 await p.goto('http://127.0.0.1:4399/');await p.waitForTimeout(2000);const metrics=await p.evaluate(()=>({...window.__metrics,transferBytes:performance.getEntriesByType('resource').reduce((s,e)=>s+e.transferSize,0)}));
 console.log(JSON.stringify({layoutIssues:result,localColdLoad:metrics},null,2));await writeFile('output/qa/site/layout-report.json',JSON.stringify({layoutIssues:result,localColdLoad:metrics},null,2));await context.close();
}finally{await browser.close();}
