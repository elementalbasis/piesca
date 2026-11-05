import {test} from 'node:test';
import assert from 'node:assert/strict';
import {compile} from '../assets/scripts/pie/sca.mjs';
function sc(changes,categories='',extra={}) {return compile({changes,categories,...extra}).transform;}
test('published SCA2 Latin–Portuguese example',()=>{
  const f=sc('[sm]//_#\ni/j/_V\nL/V/_\ne//Vr_#\nv//V_V\nu/o/_#\ngn/nh/_\nS/Z/V_V\nc/i/F_t\nc/u/B_t\np//V_t\nii/i/_\ne//C_rV','V=aeiou\nL=āēīōū\nC=ptcqbdgmnlrhs\nF=ie\nB=ou\nS=ptc\nZ=bdg');
  assert.deepEqual(['lector','doctor','focus','jocus','districtus','cīvitatem','adoptare','opera','secundus'].map(f),['leitor','doutor','fogo','jogo','distrito','cidade','adotar','obra','segundo']);
});
test('boundaries, accents, Unicode normalization and ordered rules',()=>{
  assert.equal(sc('ḱ/s/_\ns/z/#_\nó/á/_')('*ḱómos'),'zámos');
  assert.equal(sc('é/i/_')('e\u0301'),'i');
  assert.equal(sc('k/s/#_')('kima kimaka'),'sima simaka');
});
test('mapped categories, extended substitution and deletion on short replacement category',()=>{
  assert.equal(sc('Si/Zj/_','S=ptk\nZ=bdg')('piti'),'bjdj');
  assert.equal(sc('S/Z/_','S=ptk\nZ=bd')('ptk'),'bd');
});
test('insertion, deletion, metathesis, gemination, wildcard, optional context',()=>{
  assert.equal(sc('/j/_kt')('akta'),'ajkta');
  assert.equal(sc('s//_#')('sos'),'so');
  assert.equal(sc('nt/\\\\/_V','V=aeiou')('anta'),'atna');
  assert.equal(sc('M//_²','M=mn')('mmnnmn'),'mnmn');
  assert.equal(sc('M/M²/_','M=mn')('mn'),'mmnn');
  assert.equal(sc('p/b/_…V','V=aeiou')('pkta'),'bkta');
  assert.equal(sc('u/ü/_C(C)F','C=ptk\nF=ie')('ukti upti'),'ükti üpti');
});
test('exceptions, inline category with boundary, arrow syntax',()=>{
  assert.equal(sc('k→s/_V/#s_','V=aeiou')('ska ka'),'ska sa');
  assert.equal(sc('m/n/_[dt#]')('amd amt am'),'and ant an');
});
test('rewrites enable multicharacter category segments and reverse optionally',()=>{
  assert.equal(sc('K/G/_','K=kʷk\nG=gʷg',{rewrites:'kʷ|q\ngʷ|ɢ'})('kʷek'),'gʷeg');
  assert.equal(sc('', '', {rewrites:'kʷ|q',rewriteOutput:false})('kʷe'),'qe');
});

test('invalid rules fail explicitly instead of silently changing the dictionary',()=>{
  for(const c of [{changes:'p/b'}, {changes:'p/b/x'}, {categories:'VV=aeiou'}, {changes:'/j/_'}, {changes:'p/b/_(V'}])assert.throws(()=>compile(c));
});
test('glosses and empty replacements are preserved correctly',()=>{
  assert.equal(sc('o/a/_')('wod ‣ water'),'wad ‣ water');
  assert.equal(sc('s//_')('s'),'');
});
