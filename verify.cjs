const fs = require('fs');
const vm = require('vm');
const elements = new Map();
function el(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',dataset:{},style:{},getContext:()=>({beginPath(){},moveTo(){},lineTo(){},stroke(){},clearRect(){}}),getBoundingClientRect:()=>({left:0,top:0,width:400,height:400})});return elements.get(id)}
const data={};const sandbox={document:{querySelector:el,querySelectorAll:()=>[]},location:{hash:'#home'},localStorage:{getItem:k=>data[k],setItem:(k,v)=>data[k]=v},window:{scrollTo(){},addEventListener(){}},FormData:class{constructor(f){this.f=f}get(k){return this.f[k]}},console};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/dictation.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),sandbox);
function run(s){return vm.runInContext(s,sandbox)}
for(const route of ['home','words','grammar','dialogue','practice','listening','writing']){sandbox.location.hash='#'+route;run('render()');if(!el('#app').innerHTML.length)throw Error('Empty '+route)}
run('pages.words(); drawWords("am nhac")');if(!el('#wordlist').innerHTML.includes('音乐'))throw Error('Search failed');
run('flash()');if(!el('#app').innerHTML.includes('Thẻ 1 / 22'))throw Error('Flash failed');el('#remember').onclick();if(!JSON.parse(data['hanyu-v1']).known.includes(0))throw Error('Persistence failed');
run('pages.practice()');const answers={q0:'0',q1:'1',q2:'2',q3:'0',q4:'1',q5:'1'};el('#quiz').onsubmit({preventDefault(){},target:answers});if(!el('#result').textContent.includes('6/6'))throw Error('Scoring failed');
for(const file of ['Q2B1.mp3','Q2B1.NC1.MP3','Q2B1.NC2.MP3','Q2B1.NC3.MP3'])if(fs.statSync('dist/audio/'+file).size<1000)throw Error('Missing audio');
console.log('PASS: seven views, accent-insensitive search, flashcards, saved progress, quiz scoring, four audio assets. DOM simulation only; browser layout not verified.');

run('state.level=1; render()');if(!el('#app').innerHTML.includes('Chưa có bài học')||!el('#lesson-select').disabled)throw Error('HSK1 must have no lessons');
run('state.level=2; render()');if(!el('#lesson-select').innerHTML.includes('Lesson 1')||el('#lesson-select').disabled)throw Error('HSK2 lesson unavailable');
for(const level of [3,4]){run('state.level='+level+'; render()');if(!el('#app').innerHTML.includes('Chưa có bài học'))throw Error('Unavailable course leaked content');}
run('state.level=2; render()');if(!run('state.known.includes(0)'))throw Error('Course selection lost progress');
console.log('PASS: HSK1–4 selection, HSK2 Lesson 1 mapping, empty courses and preserved progress.');

if(!run('compareHanzi(" 听。 ", "听").correct'))throw Error('Punctuation normalization');
if(run('compareHanzi("听音", "音乐").correct'))throw Error('Incorrect answer accepted');
if(!run('compareHanzi("音", "音乐").parts.some(p=>p.kind==="missing"&&p.text==="乐")'))throw Error('Missing character diff');
run('state.level=2; pages.words()');if(!el('#app').innerHTML.includes('dictationBtn'))throw Error('Missing vocabulary entry');
run('startDictation()');if(el('#app').innerHTML.includes('zài'))throw Error('Pinyin shown before answer');
el('#hanziAnswer').value='错';el('#dictationForm').onsubmit({preventDefault(){}});if(!run('state.dictationWrong.includes(0)'))throw Error('Wrong word not saved');
el('#hanziAnswer').value='在';el('#dictationForm').onsubmit({preventDefault(){}});if(run('dictationSession.correct')!==0)throw Error('Retry counted as first try');
run('startDictation(true)');el('#hanziAnswer').value='在';el('#dictationForm').onsubmit({preventDefault(){}});if(run('state.dictationWrong.includes(0)'))throw Error('Review did not clear word');
run('startDictation()');el('#revealWord').onclick();if(!run('state.dictationWrong.includes(0)'))throw Error('Revealed answer missing from review');
console.log('PASS: dictation normalization, character feedback, hidden answers, saved mistakes, retry scoring and review.');
