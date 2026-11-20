const fs = require('fs');
const vm = require('vm');
const elements = new Map();
function el(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',dataset:{},style:{},setAttribute(name,value){this[name]=value},focus(){},showModal(){this.open=true},close(){this.open=false;if(this.onclose)this.onclose()},getContext:()=>({beginPath(){},moveTo(){},lineTo(){},stroke(){},clearRect(){}}),getBoundingClientRect:()=>({left:0,top:0,width:400,height:400})});return elements.get(id)}
const data={'hanyu-v1':JSON.stringify({dictationMode:'word'})};const sandbox={document:{querySelector:el,querySelectorAll:()=>[]},location:{hash:'#home'},localStorage:{getItem:k=>data[k],setItem:(k,v)=>data[k]=v},window:{scrollTo(){},addEventListener(){}},FormData:class{constructor(f){this.f=f}get(k){return this.f[k]}},console};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/vocabulary-context.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/context-playback.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/dictation-settings.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/dictation.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),sandbox);
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

run('state.dictationWrong=[];pages.words()');el('#dictationBtn').onclick({type:'click'});if(run('dictationSession.queue.length')!==22)throw Error('Click event selected review instead of lesson');console.log('PASS: vocabulary button starts all 22 words.');

run('startDictation()');el('#hanziAnswer').value='在';el('#dictationForm').onsubmit({preventDefault(){}});el('#forwardWord').onclick();el('#previousWord').onclick();if(el('#hanziAnswer').value!=='在')throw Error('Previous word lost draft');const count=run('dictationSession.correct');el('#dictationForm').onsubmit({preventDefault(){}});if(run('dictationSession.correct')!==count)throw Error('Revisiting double counted score');el('#transcriptTab').onclick();if(!el('#app').innerHTML.includes('context-sentence-list'))throw Error('Transcript tab did not open');el('#practiceTab').onclick();if(el('#hanziAnswer').value!=='在')throw Error('Tab switch lost answer');console.log('PASS: previous/next, transcript tabs, preserved answer and no duplicate scoring.');

run('state.dictationPrefs={showImmediate:false,showFull:false};startDictation();dictationSession.position=3;showDictation()');
el('#hanziAnswer').value='音';el('#dictationForm').onsubmit({preventDefault(){}});
if(el('#dictationFeedback').innerHTML.includes('乐')||el('#dictationFeedback').innerHTML.includes('yīnyuè'))throw Error('Hidden answer leaked');
if(!el('#dictationFeedback').innerHTML.includes('＊'))throw Error('Missing answer mask');
el('#showImmediateAnswer').onchange({target:{checked:true}});
if(!el('#dictationFeedback').innerHTML.includes('answer-hint'))throw Error('Immediate hint missing');
el('#showFullAnswer').onchange({target:{checked:true}});
if(!el('#dictationFeedback').innerHTML.includes('yīnyuè'))throw Error('Full answer missing');
el('#showFullAnswer').onchange({target:{checked:false}});
if(el('#dictationFeedback').innerHTML.includes('yīnyuè'))throw Error('Full answer did not hide');
run('updateDictationPreference("replayDelay",2)');
if(JSON.parse(data['hanyu-v1']).dictationPrefs.replayDelay!==2)throw Error('Settings not saved');
if(run('updateDictationPreference("playKey","Control")'))throw Error('Conflicting shortcuts allowed');
el('#openDictationSettings').onclick();if(!el('#dictationSettingsDialog').open)throw Error('Dialog did not open');
el('#closeDictationSettings').onclick();if(el('#dictationSettingsDialog').open)throw Error('Dialog did not close');
console.log('PASS: masked answers, optional hints/full answer, saved settings and dialog.');

const replayTimers=new Map();let timerSerial=0;
sandbox.setTimeout=(cb,delay)=>{const id=++timerSerial;replayTimers.set(id,{cb,delay});return id;};
sandbox.clearTimeout=id=>replayTimers.delete(id);
let spoken=[];const synth={paused:false,speaking:false,getVoices:()=>[{lang:'zh-CN'}],cancel(){this.speaking=false;},pause(){this.paused=true;},resume(){this.paused=false;},speak(u){spoken.push(u);this.speaking=true;u.onstart();}};
sandbox.window.speechSynthesis=synth;sandbox.window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
run('state.dictationPrefs={autoReplay:true,replayDelay:2};startDictation();speakWord("在")');
let utterance=spoken.at(-1);synth.speaking=false;utterance.onend();
if(replayTimers.size!==1||[...replayTimers.values()][0].delay!==2000)throw Error('Replay delay incorrect');
el('#forwardWord').onclick();if(replayTimers.size)throw Error('Replay survived word change');
utterance.onend();if(replayTimers.size)throw Error('Stale audio restarted replay');
run('speakWord("正");toggleWordPlayback()');if(!synth.paused)throw Error('Pause failed');
run('toggleWordPlayback()');if(synth.paused)throw Error('Resume failed');
const before=spoken.length;
const keyEvent=(key,code=key,extra={})=>({key,code,target:{tagName:'TEXTAREA'},preventDefault(){this.prevented=true;},...extra});
sandbox.event=keyEvent('Control');run('dictationKeyDown(event)');sandbox.event=keyEvent('c','KeyC',{ctrlKey:true});run('dictationKeyDown(event)');sandbox.event=keyEvent('Control');run('dictationKeyUp(event)');
if(spoken.length!==before)throw Error('Ctrl+C triggered replay');
sandbox.event=keyEvent('Control');run('dictationKeyDown(event);dictationKeyUp(event)');if(spoken.length!==before+1)throw Error('Replay shortcut failed');
el('#openDictationSettings').onclick();if(replayTimers.size)throw Error('Dialog did not cancel replay');
const atDialog=spoken.length;sandbox.event=keyEvent('Control');run('dictationKeyDown(event);dictationKeyUp(event)');if(spoken.length!==atDialog)throw Error('Shortcut active inside modal');
el('#closeDictationSettings').onclick();run('stopWordAudio()');
console.log('PASS: simulated speech pause/resume, delayed replay cancellation, Ctrl+C and modal shortcut guards.');

if(run('vocabularyContexts.length')!==22)throw Error('Each word needs a sentence');
if(!run('vocabularyContexts.every((item,i)=>item.target===words[i][0]&&item.zh&&item.py&&item.vi&&contextSources[item.source]&&(item.parts||[item.target]).every(part=>item.zh.includes(part)))'))throw Error('Context content or source mapping invalid');
run('state.dictationMode="sentence";state.sentenceDictationWrong=[];startDictation()');
if(run('dictationSession.mode')!=='sentence')throw Error('Sentence mode not selected');
el('#hanziAnswer').value='我在听中文歌';el('#dictationForm').onsubmit({preventDefault(){}});
if(!run('dictationSession.passed'))throw Error('Full sentence without punctuation rejected');
run('moveDictation(1)');const oldWordMistakes=run('JSON.stringify(state.dictationWrong)');
el('#hanziAnswer').value='正';el('#dictationForm').onsubmit({preventDefault(){}});
if(run('dictationSession.passed')||!run('state.sentenceDictationWrong.includes(1)'))throw Error('Single word incorrectly passed sentence exercise');
if(run('JSON.stringify(state.dictationWrong)')!==oldWordMistakes)throw Error('Sentence errors changed word review queue');
el('#transcriptTab').onclick();
if(!el('#app').innerHTML.includes('context-sentence-list')||(el('#app').innerHTML.match(/data-context-select=/g)||[]).length!==22)throw Error('Transcript should list all sentences');
if(el('#app').innerHTML.includes('Māma zhèng kàn'))throw Error('Pinyin leaked in Chinese-only mode');
el('#contextTranslation').onchange({target:{value:'both'}});
if(!el('.context-current').innerHTML.includes('Māma zhèng kàn')||!el('.context-current').innerHTML.includes('Mẹ đang xem ti vi.'))throw Error('Translation selector failed');
run('selectContextSentence(3)');el('#listenWord').onclick();
if(spoken.at(-1).text!==run('vocabularyContexts[0].zh.replace(/[…。，]/g," ").trim()'))throw Error('Main player must start at first sentence');
el('#practiceContextSentence').onclick();
if(run('dictationSession.mode')!=='sentence'||run('dictationSession.position')!==0)throw Error('Practice selected sentence failed');
run('stopWordAudio()');console.log('PASS: 22 sourced sentence contexts, sentence grading, separate review, Chinese-only transcript, translation and selected-sentence practice.');

run('startDictation(false,"sentence");dictationSession.tab="transcript";dictationSession.transcriptIndex=9;showDictation()');
let playlistStart=spoken.length;el('#listenWord').onclick();
for(let i=0;i<22;i++){
  if(spoken.at(-1).text!==run('vocabularyContexts['+i+'].zh.replace(/[…。，]/g," ").trim()'))throw Error('Whole-list order mismatch at '+i);
  if(run('dictationSession.transcriptIndex')!==i)throw Error('Selected sentence did not follow playback');
  synth.speaking=false;spoken.at(-1).onend();
}
if(spoken.length-playlistStart!==22||run('contextPlayback')!==null||replayTimers.size)throw Error('Playback must stop after one whole pass');
el('#contextRepeat').onchange({target:{checked:true}});playlistStart=spoken.length;el('#listenWord').onclick();
for(let i=0;i<22;i++){synth.speaking=false;spoken.at(-1).onend();}
if(spoken.length-playlistStart!==22||replayTimers.size!==1)throw Error('Repeat must wait until the whole list finishes');
const repeatEntry=[...replayTimers.entries()][0];replayTimers.delete(repeatEntry[0]);repeatEntry[1].cb();
if(spoken.at(-1).text!==run('vocabularyContexts[0].zh.replace(/[…。，]/g," ").trim()'))throw Error('Repeat did not restart from first sentence');
el('#contextRepeat').onchange({target:{checked:false}});
if(!synth.speaking||run('contextPlayback')===null)throw Error('Turning repeat off stopped the current pass');
const staleEnd=spoken.at(-1).onend;run('selectContextSentence(3,true)');
const individualStart=spoken.length;synth.speaking=false;spoken.at(-1).onend();staleEnd();
if(spoken.length!==individualStart||replayTimers.size||run('contextPlayback')!==null)throw Error('Individual sentence replayed or old playlist resumed');
el('#listenWord').onclick();el('#listenWord').onclick();if(!synth.paused)throw Error('Whole-list pause failed');
el('#listenWord').onclick();if(synth.paused)throw Error('Whole-list resume failed');
el('#practiceTab').onclick();const afterTab=spoken.length;synth.speaking=false;spoken.at(-1).onend();
if(spoken.length!==afterTab||run('contextPlayback')!==null)throw Error('Playlist continued after tab change');
run('stopWordAudio()');console.log('PASS: one complete 22-sentence pass, whole-list repeat, single-row playback, pause/resume and cancellation.');
