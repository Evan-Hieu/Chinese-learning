const fs = require('fs');
const vm = require('vm');
const elements = new Map();
function el(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',dataset:{},style:{},getContext:()=>({beginPath(){},moveTo(){},lineTo(){},stroke(){},clearRect(){}}),getBoundingClientRect:()=>({left:0,top:0,width:400,height:400})});return elements.get(id)}
const data={};const sandbox={document:{querySelector:el,querySelectorAll:()=>[]},location:{hash:'#home'},localStorage:{getItem:k=>data[k],setItem:(k,v)=>data[k]=v},window:{scrollTo(){},addEventListener(){}},FormData:class{constructor(f){this.f=f}get(k){return this.f[k]}},console};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),sandbox);
function run(s){return vm.runInContext(s,sandbox)}
for(const route of ['home','words','grammar','dialogue','practice','listening','writing']){sandbox.location.hash='#'+route;run('render()');if(!el('#app').innerHTML.length)throw Error('Empty '+route)}
run('pages.words(); drawWords("am nhac")');if(!el('#wordlist').innerHTML.includes('音乐'))throw Error('Search failed');
run('flash()');if(!el('#app').innerHTML.includes('Thẻ 1 / 22'))throw Error('Flash failed');el('#remember').onclick();if(!JSON.parse(data['hanyu-v1']).known.includes(0))throw Error('Persistence failed');
run('pages.practice()');const answers={q0:'0',q1:'1',q2:'2',q3:'0',q4:'1',q5:'1'};el('#quiz').onsubmit({preventDefault(){},target:answers});if(!el('#result').textContent.includes('6/6'))throw Error('Scoring failed');
for(const file of ['Q2B1.mp3','Q2B1.NC1.MP3','Q2B1.NC2.MP3','Q2B1.NC3.MP3'])if(fs.statSync('dist/audio/'+file).size<1000)throw Error('Missing audio');
console.log('PASS: seven views, accent-insensitive search, flashcards, saved progress, quiz scoring, four audio assets. DOM simulation only; browser layout not verified.');
