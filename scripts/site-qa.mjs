import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const base='http://127.0.0.1:4399';
await mkdir('output/qa/rebuild',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
process.on('SIGINT',async()=>{await browser.close();process.exit(130);});
const result={pages:[],interactions:[],links:[],failures:[]};
const routes=['/','/en/','/realisations/','/en/work/','/a-propos/','/en/about/','/contact/','/en/contact/','/realisations/pos-telephonie/','/en/work/pos-telephonie/','/realisations/easy-salaires/','/en/work/easy-salaires/','/realisations/canapey/','/en/work/canapey/'];
const links=new Set();
try{
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
 const page=await context.newPage();
 for(const route of routes){
  const errors=[];const handler=e=>errors.push(e.message);page.on('pageerror',handler);
  const response=await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1400);
  await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode().catch(()=>{});})));
  const facts=await page.evaluate(()=>({lang:document.documentElement.lang,title:document.title,h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>(i.currentSrc||i.getAttribute('src')||i.getAttribute('srcset')||'').trim()&&(!i.complete||!i.naturalWidth)).map(i=>i.currentSrc||i.src),canonical:document.querySelector('link[rel=canonical]')?.getAttribute('href'),alternate:document.querySelector('.language-switch')?.getAttribute('href'),links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'))}));
  facts.links.forEach(l=>{if(l.startsWith('/'))links.add(l.split('#')[0]);});delete facts.links;
  const entry={name,route,status:response.status(),...facts,errors};result.pages.push(entry);
  if(entry.status!==200||entry.h1!==1||entry.overflow||entry.broken.length||errors.length)result.failures.push(entry);
  const file=route==='/'?'home-fr':route==='/en/'?'home-en':route==='/realisations/'?'work-fr':route==='/en/work/'?'work-en':null;
  if(file){await page.screenshot({path:`output/qa/rebuild/${file}-${name}-hero.png`});if(route==='/'){
   for(const selector of ['.home-workspace','.peaks-heading','.client-list','.home-person','.site-footer']){await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(500);await page.screenshot({path:`output/qa/rebuild/${file}-${name}-${selector.slice(1)}.png`});}
  }}
  page.removeListener('pageerror',handler);
 }
 await page.goto(base+'/');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1400);
 for(const index of [1,2,0]){
  const tab=page.locator(`[data-project-tab="${index}"]`);if(name==='mobile')await tab.tap();else await tab.click();await page.waitForTimeout(400);
  const state=await page.evaluate(()=>({selected:[...document.querySelectorAll('[data-project-tab]')].filter(t=>t.getAttribute('aria-selected')==='true').map(t=>t.id),visible:[...document.querySelectorAll('[data-project-panel]')].filter(p=>!p.hidden).map(p=>p.id),counter:document.querySelector('[data-project-count]')?.textContent}));
  result.interactions.push({name,index,...state});if(state.visible.length!==1||state.selected.length!==1||state.counter!==String(index+1).padStart(2,'0'))result.failures.push({tabState:state});
  await page.locator('.project-console').screenshot({path:`output/qa/rebuild/console-${name}-${index}.png`});
 }
 await page.locator('[data-project-tab="0"]').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('End');
 const endFocus=await page.evaluate(()=>document.activeElement.id);await page.keyboard.press('Home');const homeFocus=await page.evaluate(()=>document.activeElement.id);
 result.interactions.push({name,keyboardEnd:endFocus,keyboardHome:homeFocus});if(endFocus!=='tab-salaires'||homeFocus!=='tab-canapey')result.failures.push({name,endFocus,homeFocus});
 // Check scroll reversal and real input across sections without a scroll lock.
 await page.mouse.wheel(0,5000);await page.waitForTimeout(700);await page.mouse.wheel(0,-8000);await page.waitForTimeout(900);
 const scrollState=await page.evaluate(()=>({y:scrollY,overflow:document.documentElement.scrollWidth>innerWidth,titleOpacity:getComputedStyle(document.querySelector('h1')).opacity}));result.interactions.push({name,scrollState});if(scrollState.y!==0||scrollState.overflow||+scrollState.titleOpacity<.95)result.failures.push({name,scrollState});
 if(name==='mobile'){
  await page.locator('.menu-toggle').tap();const open=await page.locator('.menu-toggle').getAttribute('aria-expanded');
  await page.keyboard.press('Escape');const closed=await page.locator('.menu-toggle').getAttribute('aria-expanded');const focusReturned=await page.locator('.menu-toggle').evaluate(e=>e===document.activeElement);
  result.interactions.push({name,menuOpen:open,menuClosed:closed,focusReturned});if(open!=='true'||closed!=='false'||!focusReturned)result.failures.push({menu:true});
  await page.locator('.menu-toggle').tap();await page.locator('.mobile-nav a[href="/realisations/"]').tap();
 }else{await page.goto(base+'/');await page.keyboard.press('Tab');const firstFocus=await page.evaluate(()=>document.activeElement.className);result.interactions.push({name,firstFocus});if(firstFocus!=='skip-link')result.failures.push({firstFocus});await page.locator('.hero-actions .button').click();}
 await page.waitForURL('**/realisations/');await page.locator('.language-switch').click();await page.waitForURL('**/en/work/');await page.goBack();await page.waitForURL('**/realisations/');await page.goBack();await page.waitForURL(base+'/');
 await context.close();
}
const reduced=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});const rp=await reduced.newPage();
await rp.goto(base+'/');await rp.evaluate(()=>document.fonts.ready);await rp.locator('[data-project-tab="1"]').tap();await rp.screenshot({path:'output/qa/rebuild/reduced-motion-mobile.png'});result.interactions.push({reducedMotion:true,pins:await rp.locator('.pin-spacer').count(),selected:await rp.locator('[data-project-tab="1"]').getAttribute('aria-selected'),titleOpacity:await rp.locator('h1').evaluate(e=>getComputedStyle(e).opacity)});await reduced.close();
for(const route of links){if(!route)continue;const r=await fetch(base+route);result.links.push({route,status:r.status});if(r.status>=400)result.failures.push({route,status:r.status});}
for(const route of ['/index.html','/work.html','/work','/about']){const r=await fetch(base+route,{redirect:'manual'});result.links.push({route,status:r.status,location:r.headers.get('location')});if(r.status!==301)result.failures.push({redirect:route,status:r.status});}
for(const route of ['/not-found/','/en/not-found/']){const r=await fetch(base+route);if(r.status!==404)result.failures.push({notfound:route,status:r.status});}
result.contactConfig=await fetch(base+'/api/contact/config').then(r=>r.json());
console.log(JSON.stringify({pages:result.pages.length,links:result.links.length,failures:result.failures,interactions:result.interactions,contactConfig:result.contactConfig},null,2));
}finally{await writeFile('output/qa/rebuild/report.json',JSON.stringify(result,null,2));await browser.close();}
if(result.failures.length)process.exitCode=1;
