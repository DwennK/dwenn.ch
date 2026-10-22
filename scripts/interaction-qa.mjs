import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base='http://127.0.0.1:4399';
const out='output/qa/interactive';await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const report={runs:[],errors:[]};
try{
for(const [name,width,height,reducedMotion] of [['desktop',1440,900,'no-preference'],['mobile',390,844,'no-preference'],['narrow',320,740,'reduce'],['tablet',768,1024,'reduce']]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion,hasTouch:width<800,permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const lang of ['fr','en']){
  await page.goto(base+(lang==='fr'?'/':'/en/'));await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1800);
  await page.screenshot({path:`${out}/${name}-${lang}-hero.png`});
  assert.equal(await page.locator('h1').getAttribute('aria-label'),'Full stack.');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  for(const key of ['canapey','pos','salaires']){
   await page.locator(`#tab-${key}`).click();
   const panel=page.locator(`#panel-${key}`);
   await panel.locator('[data-console-mode="code"]').click();
   for(const index of [0,1,2]){
    await panel.locator(`[data-inspector-tab="${index}"]`).click();
    assert.equal(await panel.locator('[data-inspector-panel]:visible').count(),1);
    const source=panel.locator(`[data-inspector-panel="${index}"]`);
    assert.ok((await source.locator('code').textContent()).length>100);
    assert.match(await source.locator('.inspector-explanation a').getAttribute('href'),/github\.com\/.+\/blob\/[a-f0-9]{40}\/.+#L\d+-L\d+/);
   }
   await panel.locator('[data-inspector-tab="0"]').focus();await page.keyboard.press('End');assert.equal(await page.evaluate(()=>document.activeElement.id),`source-tab-${key}-2`);
   await page.keyboard.press('Home');assert.equal(await page.evaluate(()=>document.activeElement.id),`source-tab-${key}-0`);
   await page.keyboard.press(width>800?'ArrowDown':'ArrowRight');assert.equal(await page.evaluate(()=>document.activeElement.id),`source-tab-${key}-1`);await page.keyboard.press('Home');
   if(name==='desktop'){
    const source=panel.locator('[data-inspector-panel="0"]');await source.locator('[data-copy-code]').click();
    assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),await source.locator('code').textContent());
   }
   await page.locator('[data-workspace-expand]').click();await page.waitForTimeout(700);
   assert.equal(await page.locator('#workspace-dialog').evaluate(e=>e.open),true);
   assert.equal(await page.locator('#workspace-dialog [data-project-console]').count(),1);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:`${out}/${name}-${lang}-${key}-expanded.png`});
   await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>!!document.activeElement.closest('#workspace-dialog')),true);
   await page.keyboard.press('Escape');await page.waitForTimeout(600);
   assert.equal(await page.locator('#workspace-dialog').evaluate(e=>e.open),false);
   assert.equal(await page.locator('[data-workspace-expand]').evaluate(e=>e===document.activeElement),true);
   assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
   await panel.locator('[data-console-mode="preview"]').click();
   await panel.locator('[data-open-source="1"]').click();
   assert.equal(await panel.locator('[data-inspector-tab="1"]').getAttribute('aria-selected'),'true');
   assert.equal(await panel.locator('[data-console-mode="code"]').getAttribute('aria-selected'),'true');
  }
  await page.locator('#tab-canapey').click();await page.locator('#mode-canapey-play').click();await page.waitForTimeout(500);
  await page.locator('.project-console').screenshot({path:`${out}/${name}-${lang}-playground.png`});
  await page.locator('[data-workspace-expand]').click();await page.waitForTimeout(650);await page.locator('[data-pg-enter]').click();await page.keyboard.press('ArrowRight');await page.keyboard.press('Escape');
  assert.equal(await page.locator('#workspace-dialog').evaluate(e=>e.open),true);
  assert.equal(await page.locator('[data-pg-enter]').evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Escape');await page.waitForTimeout(600);assert.equal(await page.locator('#workspace-dialog').evaluate(e=>e.open),false);
  await page.locator('#mode-canapey-preview').click();await page.mouse.move(1,1);
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(700);
  await page.screenshot({path:`${out}/${name}-${lang}-final.png`});
  report.runs.push({name,lang,width,height,reducedMotion,passed:true});
 }
 assert.deepEqual(errors,[]);await context.close();
}
}catch(error){report.errors.push(error.stack);process.exitCode=1;}finally{await browser.close();await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}
