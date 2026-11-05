import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const data=JSON.parse(await readFile(new URL('../assets/data/pie/dictionary.json',import.meta.url)));
globalThis.self={};let messages=[];
globalThis.postMessage=m=>messages.push(m);
globalThis.fetch=async()=>({ok:true,json:async()=>data});
await import('../assets/scripts/pie/worker.mjs');
async function send(message){messages=[];await self.onmessage({data:message});assert.notEqual(messages[0]?.type,'error',messages[0]?.message);return messages[0];}
test('complete imported dictionary transforms headwords, inflections and authentic table cells',async()=>{
  const config={changes:'bʰ/b/_\né/e/_\no/a/_\nh₂//_',categories:'',rewrites:''};
  const start=performance.now();const ready=await send({type:'apply',config,url:'dictionary.json'});
  assert.equal(ready.count,1931);console.log(`Full dictionary indexed in ${Math.round(performance.now()-start)} ms`);
  const result=await send({type:'search',query:'bereti',pos:'verb',page:0,request:1});
  const e=result.results.find(e=>e.word==='bereti');assert.ok(e);
  const content=e.tables.flat(2).map(c=>c.text).join(' ');
  assert.match(content,/Active voice/);assert.match(content,/Middle voice/);
  assert.match(content,/bereti/);assert.doesNotMatch(content,/bʰéreti|bʰéroh₂/);
  const inflected=await send({type:'search',query:'beranti',pos:'verb',page:0,request:2});assert.ok(inflected.results.some(e=>e.word==='bereti'));
  const water=await send({type:'search',query:'water',pos:'noun',page:0,request:3});assert.ok(water.total>0);
});
test('unknown forms return empty results and page is clamped',async()=>{
  const result=await send({type:'search',query:'thisworddoesnotexistxxx',pos:'',page:100,request:4});assert.equal(result.total,0);assert.equal(result.page,0);
});
test('table data is structured text, not third party HTML',()=>{
  for(const tables of Object.values(data.tables))for(const table of tables)for(const row of table)for(const cell of row){assert.ok(Array.isArray(cell.p));assert.ok(cell.r>0&&cell.c>0);}
});
