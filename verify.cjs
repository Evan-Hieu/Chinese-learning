const fs = require('fs');
const vm = require('vm');
const elements = new Map();
function el(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',dataset:{},style:{},setAttribute(name,value){this[name]=value},focus(){},showModal(){this.open=true},close(){this.open=false;if(this.onclose)this.onclose()},getContext:()=>({beginPath(){},moveTo(){},lineTo(){},stroke(){},clearRect(){}}),getBoundingClientRect:()=>({left:0,top:0,width:400,height:400})});return elements.get(id)}
const data={'hanyu-v1':JSON.stringify({dictationMode:'word'})};const sandbox={document:{querySelector:el,querySelectorAll:()=>[]},location:{hash:'#home'},localStorage:{getItem:k=>data[k],setItem:(k,v)=>data[k]=v},window:{scrollTo(){},addEventListener(){}},FormData:class{constructor(f){this.f=f}get(k){return this.f[k]}},console};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/vocabulary-fit.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/vocabulary-context.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/context-playback.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/dictation-settings.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/dictation.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),sandbox);
function run(s){return vm.runInContext(s,sandbox)}
for(const route of ['home','words','grammar','dialogue','practice','listening','writing']){sandbox.location.hash='#'+route;run('render()');if(!el('#app').innerHTML.length)throw Error('Empty '+route)}
run('pages.words(); drawWords("am nhac")');if(!el('#wordlist').innerHTML.includes('音乐'))throw Error('Search failed');
run('flash()');if(!el('#app').innerHTML.includes('Thẻ 1 / 22'))throw Error('Flash failed');el('#remember').onclick();if(!JSON.parse(data['hanyu-v1']).known.includes(0))throw Error('Persistence failed');
run('pages.practice()');const answers={q0:'0',q1:'1',q2:'2',q3:'0',q4:'1',q5:'1'};el('#quiz').onsubmit({preventDefault(){},target:answers});if(!el('#result').textContent.includes('6/6'))throw Error('Scoring failed');
for(const file of ['Q2B1.mp3','Q2B1.NC1.MP3','Q2B1.NC2.MP3','Q2B1.NC3.MP3'])if(fs.statSync('dist/audio/'+file).size<1000)throw Error('Missing audio');
console.log('PASS: seven views, accent-insensitive search, flashcards, saved progress, quiz scoring, four audio assets. DOM simulation only; browser layout not verified.');

run('state.level=1; render()');if(!el('#app').innerHTML.includes('Chưa có bài học')||!el('#lesson-select').disabled)throw Error('HSK1 must have no lessons');
run('state.level=2; render()');if(!el('#lesson-select').innerHTML.includes('Lesson 1')||el('#lesson-select').disabled)throw Error('HSK2 lesson unavailable');
for(const level of [3,4,5,6]){run('state.level='+level+'; render()');if(!el('#app').innerHTML.includes('Chưa có bài học'))throw Error('Unavailable course leaked content');}
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

run('pages.words();drawWords("",0)');
if((el('#wordlist').innerHTML.match(/data-known=/g)||[]).length!==6)throw Error('Desktop vocabulary page must contain six cards');
el('#wordsNext').onclick();if(run('vocabularyPage')!==1)throw Error('Vocabulary next page failed');
run('drawWords("am nhac",3)');if(run('vocabularyPage')!==0||!el('#wordlist').innerHTML.includes('音乐'))throw Error('Search should reset to matching page');
sandbox.window.innerWidth=390;sandbox.window.innerHeight=844;
run('drawWords("",10)');if((el('#wordlist').innerHTML.match(/data-known=/g)||[]).length!==2||!el('#wordsNext').disabled)throw Error('Mobile word page must contain two cards and stop at last page');
run('startDictation(false,"sentence");dictationSession.tab="transcript";showDictation();renderContextPage(2)');
if(!el('#contextRow-3').hidden||el('#contextRow-4').hidden||el('#contextRow-5').hidden||!el('#contextRow-6').hidden)throw Error('Sentence pagination did not show the correct two rows');
el('#contextPageNext').onclick();if(run('dictationSession.contextListPage')!==3)throw Error('Sentence page button failed');
run('dictationSession.transcriptIndex=10;updateContextSentence()');if(run('dictationSession.contextListPage')!==5)throw Error('Sentence page did not follow current playback');
console.log('PASS: word pagination, search reset, mobile page size and sentence-page following.');

run('state.dictationPrefs={autoReplay:3,replayDelay:1.5};startDictation(false,"sentence");speakWord(currentSpeechText())');
const finiteStart=spoken.length;
for(let i=0;i<4;i++){
 synth.speaking=false;spoken.at(-1).onend();
 if(i<3){const entry=[...replayTimers.entries()][0];if(!entry||entry[1].delay!==1500)throw Error('Finite replay delay');replayTimers.delete(entry[0]);entry[1].cb();}
}
if(spoken.length-finiteStart!==3||replayTimers.size)throw Error('Finite repeat did not stop');
for(const count of [0,1,10])if(!run('updateDictationPreference("autoReplay",'+count+')'))throw Error('Valid repeat rejected');
if(run('updateDictationPreference("autoReplay",11)'))throw Error('Invalid repeat accepted');
run('updateDictationPreference("suggestions",true);updateDictationPreference("shortcutTips",false)');
if(el('#hanziAnswer').autocomplete!=='on'||!el('#shortcutTips').hidden)throw Error('Input preferences not applied');
run('updateDictationPreference("shortcutTips",true)');if(el('#shortcutTips').hidden)throw Error('Tips did not show');
for(const [shortcut,key,code,mods] of [['Control+Shift','Shift','ShiftLeft',{ctrlKey:true,shiftKey:true}],['Control+Alt','Alt','AltLeft',{ctrlKey:true,altKey:true}],['Meta','Meta','MetaLeft',{metaKey:true}],['Control+Space',' ','Space',{ctrlKey:true}],['Control+KeyB','b','KeyB',{ctrlKey:true}]]){
 run('state.dictationPrefs.replayKey='+JSON.stringify(shortcut));const beforeChord=spoken.length;
 sandbox.event=keyEvent(key,code,mods);run('dictationKeyDown(event);dictationKeyUp(event)');
 if(spoken.length!==beforeChord+1)throw Error('Chord failed '+shortcut);
}
run('stopWordAudio();state.dictationPrefs={showImmediate:true,showFull:false};startDictation(false,"sentence")');
el('#hanziAnswer').value='我在听';
let prevented=false;el('#hanziAnswer').onkeydown({key:'Enter',preventDefault(){prevented=true;}});
if(!prevented||!run('dictationSession.checked')||!el('#dictationFeedback').innerHTML.includes('answer-hint'))throw Error('Enter did not check with hint');
run('startDictation(false,"sentence")');el('#hanziAnswer').value='我';
el('#hanziAnswer').onkeydown({key:'Enter',isComposing:true,preventDefault(){throw Error('IME Enter intercepted');}});
if(run('dictationSession.checked'))throw Error('IME answer checked');
el('#hanziAnswer').oncompositionstart();el('#hanziAnswer').onkeydown({key:'Enter',preventDefault(){throw Error('Composition intercepted');}});el('#hanziAnswer').oncompositionend();
run('updateDictationPreference("showFull",true)');el('#hanziAnswer').onkeydown({key:'Enter',preventDefault(){}});
if(!el('#dictationFeedback').innerHTML.includes(run('practiceEntry(0)[0]')))throw Error('Full sentence preference ignored');
console.log('PASS: finite repeats, combinations, input preferences, Enter checking, IME protection and full sentence feedback.');
run('state.dictationPrefs={showImmediate:true,showFull:false};startDictation(false,"sentence")');
const enterAnswer=()=>el('#hanziAnswer').onkeydown({key:'Enter',target:el('#hanziAnswer'),preventDefault(){}});
el('#hanziAnswer').value=run('practiceEntry(0)[0]');enterAnswer();
if(!run('dictationSession.passed')||run('dictationSession.position')!==0)throw Error('First Enter must check only');
enterAnswer();if(run('dictationSession.position')!==1||el('#hanziAnswer').value!=='')throw Error('Second Enter must advance with empty input');
el('#hanziAnswer').value='错';enterAnswer();enterAnswer();if(run('dictationSession.position')!==1)throw Error('Wrong answer advanced');
el('#hanziAnswer').value=run('practiceEntry(1)[0]');enterAnswer();el('#hanziAnswer').value='错';enterAnswer();if(run('dictationSession.position')!==1||run('dictationSession.passed'))throw Error('Edited answer advanced');
run('dictationSession.position=21;showDictation()');el('#hanziAnswer').value=run('practiceEntry(21)[0]');enterAnswer();enterAnswer();
if(!el('#app').innerHTML.includes('Hoàn thành lượt học'))throw Error('Final Enter did not complete');
console.log('PASS: Enter checks first, advances correct answers only, guards edited answers and completes final question.');
for(const mode of ['word','sentence']){
 run('state.dictationPrefs={autoReplay:10};startDictation(false,'+JSON.stringify(mode)+')');
 const beforeAuto=spoken.length;run('moveDictation(1)');
 if(spoken.length!==beforeAuto+1||spoken.at(-1).text!==run('currentSpeechText().replace(/[…。，]/g," ").trim()'))throw Error('New item must read once: '+mode);
 synth.speaking=false;spoken.at(-1).onend();if(replayTimers.size)throw Error('Navigation playback repeated: '+mode);
 run('dictationSession.position=21;showDictation()');const beforeComplete=spoken.length;run('moveDictation(1)');if(spoken.length!==beforeComplete)throw Error('Completion played audio');
}
console.log('PASS: sentence and word navigation each play once, ignore repeat count and stop at completion.');
vm.runInContext(fs.readFileSync('dist/vocabulary-activities.js','utf8'),sandbox);
run('pages.words()');if(!el('#app').innerHTML.includes('hanziAnswer'))throw Error('Vocabulary must open practice directly');
run('selectVocabularyActivity("flash")');if(!el('#app').innerHTML.includes('activityFlip'))throw Error('Flash activity missing');
el('#activityFlip').onclick();if(!el('#app').innerHTML.includes(run('vocabularyContexts[0].vi')))throw Error('Flash context missing');
const knownBefore=run('state.known.length');el('#remember').onclick();el('#remember').onclick();if(run('new Set(state.known).size!==state.known.length'))throw Error('Duplicate remembered word');
run('startWordMatch()');const firstPair=run('matchRoundIds()[0]');run('chooseMatchMeaning('+firstPair+')');if(run('wordMatch.attempts')!==0)throw Error('Unselected guess counted');
const wrongPair=run('matchRoundIds().find(id=>words[id][2]!==words[matchRoundIds()[0]][2])');run('selectMatchWord('+firstPair+');chooseMatchMeaning('+wrongPair+')');if(run('wordMatch.matches')!==0||run('wordMatch.attempts')!==1)throw Error('Wrong pair accepted');
for(let round=0;round<6;round++){
 const ids=JSON.parse(run('JSON.stringify(matchRoundIds())'));
 for(const id of ids)run('selectMatchWord('+id+');chooseMatchMeaning('+id+')');
 if(run('wordMatch.solved.length')!==ids.length)throw Error('Round not completed');
 el('#matchNext').onclick();
}
if(!el('#app').innerHTML.includes('Hoàn thành ghép từ')||run('wordMatch.matches')!==22||!JSON.parse(data['hanyu-v1']).matchBest)throw Error('Game completion missing');
console.log('PASS: vocabulary entry, integrated flashcards with contexts, wrong/correct matches, all 22 pairs and saved best score.');
vm.runInContext(fs.readFileSync('dist/picture-practice.js','utf8'),sandbox);
run('pages.practice()');if(!el('#app').innerHTML.includes('exercise-picture'))throw Error('Picture practice not default');
if(!run('gradePicture("identify",0,"打球")')||run('gradePicture("identify",0,"唱歌")'))throw Error('Activity grading');
for(const marker of ['在','正在','正'])if(!run('gradePicture("dialogue",0,"他'+marker+'打篮球呢。","他在做什么？")'))throw Error('Progressive variant rejected');
if(run('gradePicture("dialogue",0,"他在唱歌","他在做什么")'))throw Error('Wrong pictured action accepted');
if(!run('gradePicture("simultaneous",1,"她一边跳舞，一边唱歌。")')||run('gradePicture("simultaneous",1,"她在跳舞")'))throw Error('Simultaneous grading');
el('#pictureAction').value='打球';run('checkPictureAnswer()');if(!JSON.parse(data['hanyu-v1']).picturePractice['identify:0'].correct)throw Error('Picture progress not saved');
run('showPictureHint()');if(!el('#pictureFeedback').textContent.includes('打球'))throw Error('Hint missing');
for(const path of ['activities-page5.png','activities-page6.png'])if(fs.statSync('dist/images/lesson1/'+path).size<1000)throw Error('Missing textbook image');
console.log('PASS: textbook picture exercises, action grading, progressive variants, reordered simultaneous actions, hints and saved progress.');
for(const asset of ['play-ball','dance','watch-tv','listen-music','eat','walk-listen','sing-dance','read-drink']){const svg=fs.readFileSync('dist/images/lesson1/cartoon/'+asset+'.svg','utf8');if(!svg.includes('viewBox="0 0 320 240"')||svg.includes('<script'))throw Error('Invalid cartoon scene '+asset);}
run('pages.practice()');if(!el('#app').innerHTML.includes('photos/play-ball.jpg')||!el('#app').innerHTML.includes('Tác giả và nguồn ảnh'))throw Error('Cartoon or attribution missing');
console.log('PASS: eight local vector scenes, default cartoon presentation and visible source attribution.');
for(const asset of ['play-ball','dance','watch-tv','listen-music','eat','walk-listen','sing-dance','read-drink']){const photo=fs.readFileSync('dist/images/lesson1/photos/'+asset+'.jpg');if(photo.length<10000||photo[0]!==255||photo[1]!==216)throw Error('Invalid lesson photo '+asset);}
console.log('PASS: eight local JPEG photos downloaded and mapped to activities.');
vm.runInContext(fs.readFileSync('dist/hsk2-vocabulary.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/hsk2-dialogues.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/hsk2-catalog.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/hsk2-stories.js','utf8'),sandbox);
const sourceWords=new Set(JSON.parse(fs.readFileSync('dist/hsk2-source.json','utf8')).vocabulary.map(w=>w[0]));
for(const word of JSON.parse(run('JSON.stringify(hsk2Story.vocabulary)')))if(!sourceWords.has(word[0]))throw Error('Story target not from HSK2 sheet: '+word[0]);
if(!run('hsk2Story.lines.every(line=>line[5].every(term=>storyLexicon.has(term)&&line[2].includes(term)))'))throw Error('Target missing from sentence');
sandbox.location.hash='#stories';run('state.level=2;state.dictationPrefs={showFull:false,showImmediate:true};pages.stories();startStory(false)');
if(el('#app').innerHTML.includes(run('hsk2Story.lines[0][2]'))||!el('#app').innerHTML.includes('story-vocab-row'))throw Error('Story answer leaked or vocabulary missing');
const lessonMistakes=run('JSON.stringify([state.dictationWrong,state.sentenceDictationWrong])');
el('#hanziAnswer').value='错';run('checkStory()');if(!el('#storyFeedback').innerHTML.includes('Chưa chính xác'))throw Error('Wrong story accepted');
el('#hanziAnswer').value=run('hsk2Story.lines[0][2]');run('checkStory()');if(!run('storySession.passed'))throw Error('Correct story rejected');
const storySpeechBefore=spoken.length;el('#hanziAnswer').onkeydown({key:'Enter',preventDefault(){}});
if(run('storySession.position')!==1||spoken.length!==storySpeechBefore+1)throw Error('Story Enter transition failed');
synth.speaking=false;spoken.at(-1).onend();if(replayTimers.size)throw Error('Story navigation repeated audio');
run('startStory(true)');if(run('storySession.position')!==1)throw Error('Story resume failed');
el('#hanziAnswer').oncompositionstart();el('#hanziAnswer').onkeydown({key:'Enter',preventDefault(){throw Error('Story IME intercepted');}});el('#hanziAnswer').oncompositionend();
if(run('JSON.stringify([state.dictationWrong,state.sentenceDictationWrong])')!==lessonMistakes)throw Error('Story affected lesson mistakes');
run('storySession.position=13;showStory()');el('#hanziAnswer').value=run('hsk2Story.lines[13][2]');run('checkStory();moveStory(1)');if(!el('#app').innerHTML.includes('Hoàn thành hội thoại'))throw Error('Story completion failed');
console.log('PASS: HSK2 source membership, contextual targets, hidden answers, grading, Enter progression, single playback, resume and isolated story progress.');
if(run('words.length')!==22||run('words[0][0]')!=='在'||run('words[21][0]')!=='正在')throw Error('Lesson vocabulary changed');
if(run('sections.some(item=>item[0]==="stories")'))throw Error('Advanced sidebar entry should be removed');
run('pages.words()');if(run('dictationSession.mode')!=='sentence'||run('dictationSession.queue.length')!==22)throw Error('Lesson activity mixed with story');
console.log('PASS: separate advanced vocabulary section and unchanged 22-word lesson practice.');
sandbox.location.hash='#home';run('render()');if(el('#nav').innerHTML.includes('Từ vựng nâng cao')||!el('#app').innerHTML.includes('advanced-home-entry'))throw Error('Advanced entry missing on homepage');
console.log('PASS: advanced vocabulary is visible in initial homepage navigation and prominent homepage entry.');
const catalog=JSON.parse(run('JSON.stringify(hsk2Stories)'));const coveredCatalog=new Set();
for(const story of catalog){if(story.lines.length<6||!story.speakers.length)throw Error('Incomplete dialogue');for(const line of story.lines){if(!line[2]||!line[3]||!line[4])throw Error('Missing dialogue content');for(const term of line[5]){if(!sourceWords.has(term)||!line[2].includes(term))throw Error('Invalid contextual target '+term);coveredCatalog.add(term);}}}
if(coveredCatalog.size!==150||[...sourceWords].some(term=>!coveredCatalog.has(term)))throw Error('HSK2 coverage incomplete');
if(!run('hsk2Sections.every(([id])=>hsk2Stories.filter(s=>s.section===id).length===2)'))throw Error('Section layout invalid');
run('hsk2LibraryQuery="报纸";hsk2LibraryFilter="all"');if(!run('filteredHsk2Stories().some(s=>s.id==="exam-practice-v1")')||run('filteredHsk2Stories().some(s=>s.id==="morning-routine-v1")'))throw Error('Vocabulary search failed');
run('hsk2LibraryQuery="";hsk2LibraryFilter="all"');sandbox.location.hash='#stories';
run('selectHsk2Story("morning-routine-v1",false)');el('#hanziAnswer').value=run('hsk2Story.lines[0][2]');run('checkStory();moveStory(1)');
run('selectHsk2Story("exam-practice-v1",false)');el('#hanziAnswer').value='错';run('checkStory()');
run('selectHsk2Story("morning-routine-v1",true)');if(run('storySession.position')!==1||!run('storySession.records[0].correct'))throw Error('Per-dialogue progress overwritten');
for(const story of catalog){run('selectHsk2Story('+JSON.stringify(story.id)+',false)');for(const line of story.lines){el('#hanziAnswer').value=line[2];run('checkStory()');if(!run('storySession.passed'))throw Error('Valid dialogue answer rejected');run('moveStory(1)');}}
run('hsk2LibraryFilter="done"');if(run('filteredHsk2Stories().length')!==12)throw Error('Completed filter failed');
run('hsk2LibraryFilter="new"');if(run('filteredHsk2Stories().length')!==0)throw Error('New filter failed');
run('hsk2LibraryFilter="all";pages.stories()');if((el('#hsk2SectionList').innerHTML.match(/data-story-open=/g)||[]).length!==12)throw Error('Lesson cards missing');
console.log('PASS: 150/150 source words in dialogue lines, 6 sections of 2 lessons, search, isolated per-lesson progress, all 129 sentence answers and status filters.');
sandbox.location.hash='#words';run('returnLessonTab=null;pages.words();dictationSession.position=3;showDictation()');el('#hanziAnswer').value='我正在';
run('openAdvancedVocabulary();render()');if(!el('#app').innerHTML.includes('advancedTab')||el('#nav').innerHTML.includes('Từ vựng nâng cao'))throw Error('Advanced tab migration incomplete');
if(!el('#nav').innerHTML.includes('href="#words" class="active"'))throw Error('Vocabulary sidebar not highlighted');
run('returnToLessonVocabulary("practice");render()');if(run('dictationSession.position')!==3||el('#hanziAnswer').value!=='我正在')throw Error('Lesson draft not preserved across advanced tab');
run('openAdvancedVocabulary();render();returnToLessonVocabulary("transcript");render()');if(run('dictationSession.tab')!=='transcript'||run('dictationSession.transcriptIndex')!==3)throw Error('Transcript return failed');
console.log('PASS: third vocabulary tab, removed sidebar entry, correct sidebar highlight and preserved lesson draft/transcript selection.');

for(const activity of ['flash','match']){
 run('selectVocabularyActivity('+JSON.stringify(activity)+')');
 for(const id of ['practiceTab','transcriptTab','advancedTab'])if(!el('#app').innerHTML.includes('id="'+id+'"')||typeof el('#'+id).onclick!=='function')throw Error('Activity tab missing: '+activity+' '+id);
 el('#transcriptTab').onclick();if(!el('#app').innerHTML.includes('context-transcript'))throw Error('Activity transcript navigation failed');
 run('selectVocabularyActivity('+JSON.stringify(activity)+')');el('#practiceTab').onclick();if(!el('#app').innerHTML.includes('dictationForm'))throw Error('Activity practice navigation failed');
 run('selectVocabularyActivity('+JSON.stringify(activity)+')');el('#advancedTab').onclick();if(sandbox.location.hash!=='#stories')throw Error('Activity advanced navigation failed');
}
console.log('PASS: flashcard and matching retain all three working vocabulary tabs.');
vm.runInContext(fs.readFileSync('dist/advanced-library-data.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/advanced-library.js','utf8'),sandbox);
const originalLessonWords=run('JSON.stringify(words)');
const expectedCounts=[0,190,150,295,600,1295,2513];
const progressBeforeLevels=run('JSON.stringify(state.hsk2Stories)');
for(let level=1;level<=6;level++){
 sandbox.location.hash='#stories';run('state.level='+level+';render()');
 if(!el('#app').innerHTML.includes('hsk2SectionList')||run('advancedSourceCount()')!==expectedCounts[level])throw Error('Wrong level catalogue '+level);
 const allStories=run('hsk2Stories'),data=run('advancedLibraryData['+level+']');
 if(level!==2){const ids=new Set(allStories.flatMap(s=>s.entryIds));if(data.entries.some(e=>!ids.has(e.id)))throw Error('Missing source row '+level);}
 for(const story of allStories){
  for(const line of story.lines){
   if(!line[2]||!line[3]||!line[4])throw Error('Missing sentence content '+story.id);
   for(const word of line[5]){const literal=word.replace(/（.*?）/g,'').split(' (')[0];if(!line[2].includes(literal))throw Error('Target absent '+word);}
  }
 }
 const story=allStories[0];run('selectHsk2Story('+JSON.stringify(story.id)+',false)');
 if(level!==2&&!el('#app').innerHTML.includes('HSK'+level))throw Error('Wrong practice level');
 el('#hanziAnswer').value=story.lines[0][2];run('checkStory()');if(!run('storySession.passed'))throw Error('Level answer failed');
 run('moveStory(1)');if(!run('storyProgress().position===1'))throw Error('Level save failed');
 run('pages.stories(); selectHsk2Story('+JSON.stringify(story.id)+',true)');if(!run('storySession.position===1'))throw Error('Level resume failed');
 el('#transcriptTab').onclick();if(level!==2&&el('#app').innerHTML.includes('context-transcript'))throw Error('Leaked textbook vocabulary');
 sandbox.location.hash='#words';run('render()');if(level!==2&&!el('#app').innerHTML.includes('hsk2SectionList'))throw Error('Vocabulary sidebar blocked');
}
if(run('JSON.stringify(words)')!==originalLessonWords)throw Error('Textbook words changed');
sandbox.location.hash='#stories';run('state.level=2;render()');if(run('hsk2Stories.length')!==12)throw Error('Original HSK2 stories changed');
console.log('PASS: six advanced catalogues, all 5043 source rows, literal targets, bilingual sentences, grading, per-story save/resume, isolated textbook tabs and unchanged HSK2 stories.');
vm.runInContext(fs.readFileSync('dist/lesson2-data.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/lesson2-btnc.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/lesson3-data.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/lesson4-data.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/lesson5-data.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/lesson6-data.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/lesson7-data.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/lesson8-data.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/lesson9-data.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/lesson2.js','utf8'),sandbox);
sandbox.location.hash='#words';run('state.level=2;state.known=[0,2];state.sentenceDictationWrong=[4];save();switchTextbookLesson("2")');
if(run('words.length')!==20||run('state.lesson')!=='2'||run('state.known.length')!==0)throw Error('Lesson 2 vocabulary or isolation failed');
if(!el('#lesson-select').innerHTML.includes('Lesson 2'))throw Error('Lesson 2 selector unavailable');
for(const route of ['home','words','grammar','dialogue','practice','listening','writing']){sandbox.location.hash='#'+route;run('render()');if(!el('#app').innerHTML.length)throw Error('Empty Lesson 2 '+route);if(route==='listening'&&el('#app').innerHTML.includes('audio/Q2B1'))throw Error('Lesson 1 audio leaked');}
run('startDictation(false,"sentence")');const lesson2Words=run('words'),lesson2Contexts=run('vocabularyContexts');
for(let i=0;i<20;i++){if(!lesson2Contexts[i].zh.includes(lesson2Words[i][0]))throw Error('Lesson 2 target absent');el('#hanziAnswer').value=lesson2Contexts[i].zh;run('checkDictation()');if(!run('dictationSession.passed'))throw Error('Lesson 2 answer failed');if(i<19)run('moveDictation(1)');}
run('selectVocabularyActivity("flash")');if(!el('#app').innerHTML.includes('1 / 20'))throw Error('Lesson 2 flash count');
run('startWordMatch()');while(run('wordMatch.round')<5){const ids=run('matchRoundIds()');for(const id of ids)run('selectMatchWord('+id+');chooseMatchMeaning('+id+')');run('wordMatch.round++;wordMatch.solved=[];wordMatch.selected=null;showWordMatch()');}if(!el('#app').innerHTML.includes('20 / 20'))throw Error('Lesson 2 match completion failed');
for(const mode of ['vocab','reading','order']){const qs=run('lesson2Exercises['+JSON.stringify(mode)+']');for(let i=0;i<qs.length;i++)if(!run('gradeLesson2Exercise('+JSON.stringify(mode)+','+i+','+JSON.stringify(qs[i][1])+').correct'))throw Error('Lesson 2 exercise answer failed');}
if(!run('lesson2TimeText("06:15",true)==="早上六点一刻"&&lesson2TimeText("22:45",true)==="晚上十点三刻"'))throw Error('Time generation failed');
run('state.known=[1];state.sentenceDictationWrong=[8];save();switchTextbookLesson("1")');
if(run('words.length')!==22||run('JSON.stringify(state.known)')!=='[0,2]'||run('JSON.stringify(state.sentenceDictationWrong)')!=='[4]')throw Error('Lesson 1 progress changed');
run('switchTextbookLesson("2")');if(run('JSON.stringify(state.known)')!=='[1]'||run('JSON.stringify(state.sentenceDictationWrong)')!=='[8]')throw Error('Lesson 2 progress lost');
for(let page=15;page<=26;page++)if(fs.statSync('dist/images/lesson2/page-'+page+'.png').size<1000)throw Error('Missing original lesson page');
run('state.level=2;switchTextbookLesson("1")');sandbox.location.hash='#stories';run('render()');if(run('hsk2Stories.length')!==12)throw Error('Advanced library changed');
console.log('PASS: Lesson 2 seven views, 20 contextual targets, all dictation answers, flash/matching, textbook exercises, clock times, isolated progress and twelve source pages.');

run('switchTextbookLesson("2");pages.listening()');for(const file of ['Q2B2.mp3','Q2B2.NC1.MP3','Q2B2.NC2.MP3','Q2B2.NC3.MP3'])if(fs.statSync('dist/audio/'+file).size<1000||!el('#app').innerHTML.includes('audio/'+file))throw Error('Missing Lesson 2 audio '+file);run('switchTextbookLesson("1")');console.log('PASS: all four supplied Q2B2 audio files appear only in Lesson 2.');

run('switchTextbookLesson("2");pages.listening()');
const ncGroups=run('lesson2BTNC');for(let id=0;id<ncGroups.length;id++){const answers={};ncGroups[id].questions.forEach((q,i)=>answers['nc'+id+'q'+i]=String(q[2]));el('#lesson2BTNCForm'+id).onsubmit({preventDefault(){},target:answers});if(!el('#lesson2BTNCResult'+id).textContent.includes('5 / 5'))throw Error('BTNC self-practice grading failed');}
if(run('lesson2BTNC[0].key.join("")')!=='EBACD'||run('lesson2BTNC[1].key.join("")')!=='EABDC'||run('lesson2BTNC[2].key.join("")')!=='BCCBB')throw Error('Original PDF key changed');
run('switchTextbookLesson("1")');console.log('PASS: fifteen new transcript-based listening questions and three original BTNC answer keys remain separate.');
vm.runInContext(fs.readFileSync('dist/lesson3-btnc.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/lesson3.js','utf8'),sandbox);
sandbox.location.hash='#words';run('state.level=2;switchTextbookLesson("2");state.known=[2,4];state.sentenceDictationWrong=[3];save();switchTextbookLesson("3")');
if(run('words.length')!==21||run('state.known.length')!==0||!el('#lesson-select').innerHTML.includes('Lesson 3'))throw Error('Lesson 3 entry failed');
for(const route of ['home','words','grammar','dialogue','practice','listening','writing']){sandbox.location.hash='#'+route;run('render()');if(!el('#app').innerHTML.length)throw Error('Empty Lesson 3 '+route);if(route==='listening'&&/audio\/Q2B[12]/.test(el('#app').innerHTML))throw Error('Old audio leaked');}
run('startDictation(false,"sentence")');const contexts3=run('vocabularyContexts'),words3=run('words');for(let i=0;i<21;i++){if(!contexts3[i].zh.includes(words3[i][0]))throw Error('Lesson 3 target absent');el('#hanziAnswer').value=contexts3[i].zh;run('checkDictation()');if(!run('dictationSession.passed'))throw Error('Lesson 3 grading failed');if(i<20)run('moveDictation(1)');}
for(const mode of ['vocab','reading','choose']){const qs=run('lesson3Data.exercises['+JSON.stringify(mode)+']');for(let i=0;i<qs.length;i++)if(!run('gradeLesson3Exercise('+JSON.stringify(mode)+','+i+','+JSON.stringify(qs[i][1])+').correct'))throw Error('Lesson 3 exercise key failed');}
if(!run('gradeLesson3Borrow("我可以用一下你的笔吗？","用","笔")&&gradeLesson3Borrow("我可不可以借一下你的手机？","借","手机")&&!gradeLesson3Borrow("我想吃饭。","借","手机")'))throw Error('Borrowing question variants failed');
run('selectVocabularyActivity("flash")');if(!el('#app').innerHTML.includes('1 / 21'))throw Error('Lesson 3 flash count');
run('startWordMatch()');for(let round=0;round<6;round++){for(const id of run('matchRoundIds()'))run('selectMatchWord('+id+');chooseMatchMeaning('+id+')');run('wordMatch.round++;wordMatch.solved=[];wordMatch.selected=null;showWordMatch()');}if(!el('#app').innerHTML.includes('21 / 21'))throw Error('Lesson 3 matching count');
run('pages.listening()');for(const file of ['Q2B3.mp3','Q2B3.NC1.MP3','Q2B3.NC2.MP3','Q2B3.NC3.MP3'])if(fs.statSync('dist/audio/'+file).size<1000||!el('#app').innerHTML.includes('audio/'+file))throw Error('Lesson 3 audio missing');
const groups3=run('lesson3BTNC');for(let id=0;id<3;id++){const answers={};groups3[id].questions.forEach((q,i)=>answers['l3nc'+id+'q'+i]=String(q[2]));el('#lesson3BTNCForm'+id).onsubmit({preventDefault(){},target:answers});if(!el('#lesson3BTNCResult'+id).textContent.includes('5 / 5'))throw Error('Lesson 3 listening quiz failed');}
if(run('lesson3BTNC.map(g=>g.key.join("")).join("/")')!=='CEDBA/CDEAB/ACBBC')throw Error('PDF page 14 answer mismatch');
run('state.known=[5];save();switchTextbookLesson("2")');if(run('words.length')!==20||run('JSON.stringify(state.known)')!=='[2,4]'||run('JSON.stringify(state.sentenceDictationWrong)')!=='[3]')throw Error('Lesson 2 progress changed');run('switchTextbookLesson("3")');if(run('JSON.stringify(state.known)')!=='[5]')throw Error('Lesson 3 progress lost');
for(let page=27;page<=37;page++)if(fs.statSync('dist/images/lesson3/page-'+page+'.png').size<1000)throw Error('Lesson 3 source image missing');
sandbox.location.hash='#stories';run('render()');if(run('hsk2Stories.length')!==12)throw Error('Advanced HSK2 changed');run('switchTextbookLesson("1")');
console.log('PASS: Lesson 3 seven views, 21 contextual words, borrowing question variants, 15 listening questions, verified PDF keys, four audio assets, 11 source pages and independent Lesson 1–3 progress.');
vm.runInContext(fs.readFileSync('dist/lesson4-btnc.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/lesson4.js','utf8'),sandbox);
sandbox.location.hash='#words';run('state.level=2;switchTextbookLesson("3");state.known=[1,6];state.sentenceDictationWrong=[2];save();switchTextbookLesson("4")');
if(run('words.length')!==19||run('state.known.length')!==0||!el('#lesson-select').innerHTML.includes('Lesson 4'))throw Error('Lesson 4 entry failed');
for(const route of ['home','words','grammar','dialogue','practice','listening','writing']){sandbox.location.hash='#'+route;run('render()');if(!el('#app').innerHTML.length)throw Error('Empty Lesson 4 '+route);if(route==='listening'&&/audio\/Q2B[123]/.test(el('#app').innerHTML))throw Error('Old audio leaked into Lesson 4');}
run('startDictation(false,"sentence")');const w4=run('words'),c4=run('vocabularyContexts');for(let i=0;i<19;i++){if(!c4[i].zh.includes(w4[i][0]))throw Error('Lesson 4 target absent');el('#hanziAnswer').value=c4[i].zh;run('checkDictation()');if(!run('dictationSession.passed'))throw Error('Lesson 4 answer failed');if(i<18)run('moveDictation(1)');}
for(const mode of ['vocab','reading','choose']){const qs=run('lesson4Data.exercises['+JSON.stringify(mode)+']');for(let i=0;i<qs.length;i++)if(!run('gradeLesson4Exercise('+JSON.stringify(mode)+','+i+','+JSON.stringify(qs[i][1])+').correct'))throw Error('Lesson 4 exercise key failed');}
run('lesson4PracticeMode="reading";lesson4Practice()');const readingAnswers={l4reading0:'1',l4reading1:'0',l4reading2:'1',l4reading3:'2'};el('#lesson4ReadingQuiz').onsubmit({preventDefault(){},target:readingAnswers});if(!el('#lesson4ReadingResult').textContent.includes('4 / 4'))throw Error('Lesson 4 reading quiz failed');
if(!run('gradeLesson4Shop(0,"这件衬衫还有什么颜色的？",lesson4ShopItems[0],"红色")&&gradeLesson4Shop(1,"我可以试一下红色的吗？",lesson4ShopItems[0],"红色")&&gradeLesson4Shop(2,"太贵了，可以便宜一点儿吗？",lesson4ShopItems[0],"红色")&&!gradeLesson4Shop(1,"我想吃饭。",lesson4ShopItems[0],"红色")'))throw Error('Shopping patterns failed');
run('selectVocabularyActivity("flash")');if(!el('#app').innerHTML.includes('1 / 19'))throw Error('Lesson 4 flash count');run('startWordMatch()');for(let round=0;round<5;round++){for(const id of run('matchRoundIds()'))run('selectMatchWord('+id+');chooseMatchMeaning('+id+')');run('wordMatch.round++;wordMatch.solved=[];wordMatch.selected=null;showWordMatch()');}if(!el('#app').innerHTML.includes('19 / 19'))throw Error('Lesson 4 matching count');
run('pages.listening()');for(const file of ['Q2B4.mp3','Q2B4.NC1.MP3','Q2B4.NC2.MP3','Q2B4.NC3.MP3'])if(fs.statSync('dist/audio/'+file).size<1000||!el('#app').innerHTML.includes('audio/'+file))throw Error('Lesson 4 audio missing');const nc4=run('lesson4BTNC');for(let id=0;id<3;id++){const answers={};nc4[id].questions.forEach((q,i)=>answers['l4nc'+id+'q'+i]=String(q[2]));el('#lesson4BTNCForm'+id).onsubmit({preventDefault(){},target:answers});if(!el('#lesson4BTNCResult'+id).textContent.includes('5 / 5'))throw Error('Lesson 4 NC grading failed');}if(run('lesson4BTNC.map(g=>g.key.join("")).join("/")')!=='CABED/DACBE/BCAAC')throw Error('PDF page 15 answer mismatch');
run('state.known=[4];state.lesson4Shop={item:"1",color:"黑色",size:"38"};save();switchTextbookLesson("3")');if(run('words.length')!==21||run('JSON.stringify(state.known)')!=='[1,6]'||run('JSON.stringify(state.sentenceDictationWrong)')!=='[2]')throw Error('Lesson 3 progress changed');run('switchTextbookLesson("4")');if(run('JSON.stringify(state.known)')!=='[4]'||run('state.lesson4Shop.size')!=='38')throw Error('Lesson 4 progress lost');
for(let i=1;i<=13;i++)if(fs.statSync('dist/images/lesson4/source-'+i+'.png').size<1000)throw Error('Lesson 4 source missing');sandbox.location.hash='#stories';run('render()');if(run('hsk2Stories.length')!==12)throw Error('Advanced library changed');run('switchTextbookLesson("1")');
console.log('PASS: Lesson 4 seven views, 19 contextual words, reading and shopping practice, 15 listening questions, PDF page 15 keys, four audio files, thirteen source images and independent Lesson 1–4 progress.');
vm.runInContext(fs.readFileSync('dist/lesson5-btnc.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/lesson5.js','utf8'),sandbox);
sandbox.location.hash='#words';run('state.level=2;switchTextbookLesson("4");state.known=[1,5];state.sentenceDictationWrong=[4];save();switchTextbookLesson("5")');
if(run('words.length')!==20||run('state.known.length')!==0||!el('#lesson-select').innerHTML.includes('Lesson 5'))throw Error('Lesson 5 entry failed');
for(const route of ['home','words','grammar','dialogue','practice','listening','writing']){sandbox.location.hash='#'+route;run('render()');if(!el('#app').innerHTML.length)throw Error('Empty Lesson 5 '+route);if(route==='listening'&&/audio\/Q2B[1234]/.test(el('#app').innerHTML))throw Error('Old audio leaked into Lesson 5');}
run('startDictation(false,"sentence")');const w5=run('words'),c5=run('vocabularyContexts');for(let i=0;i<20;i++){if(!c5[i].zh.includes(w5[i][0]))throw Error('Lesson 5 target absent');el('#hanziAnswer').value=c5[i].zh;run('checkDictation()');if(!run('dictationSession.passed'))throw Error('Lesson 5 grading failed');if(i<19)run('moveDictation(1)');}
for(const mode of ['vocab','reading','choose','feelings']){const qs=run('lesson5Data.exercises['+JSON.stringify(mode)+']');for(let i=0;i<qs.length;i++)if(!run('gradeLesson5Exercise('+JSON.stringify(mode)+','+i+','+JSON.stringify(qs[i][1])+').correct'))throw Error('Lesson 5 key failed');}
run('lesson5PracticeMode="reading";lesson5Practice()');const reading5={};run('lesson5Data.exercises.comprehension').forEach((q,i)=>reading5['l5reading'+i]=String(q[2]));el('#lesson5ReadingQuiz').onsubmit({preventDefault(){},target:reading5});if(!el('#lesson5ReadingResult').textContent.includes('5 / 5'))throw Error('Lesson 5 reading grading failed');
run('lesson5PracticeMode="pictures";lesson5Practice()');['买衣服','去图书馆','打篮球'].forEach((answer,i)=>el('#lesson5Picture'+i).value=answer);el('#lesson5PictureCheck').onclick();if(!run('Object.values(state.lesson5Exercises.pictures).every(r=>r.correct)'))throw Error('Lesson 5 pictures failed');
run('lesson5PracticeMode="shop";lesson5Practice()');el('#lesson5PlanMake').onclick();if(!el('#lesson5PlanOutput').textContent.includes('星期六下午三点'))throw Error('Appointment report failed');
run('selectVocabularyActivity("flash")');if(!el('#app').innerHTML.includes('1 / 20'))throw Error('Lesson 5 flash count');run('startWordMatch()');for(let round=0;round<5;round++){for(const id of run('matchRoundIds()'))run('selectMatchWord('+id+');chooseMatchMeaning('+id+')');run('wordMatch.round++;wordMatch.solved=[];wordMatch.selected=null;showWordMatch()');}if(!el('#app').innerHTML.includes('20 / 20'))throw Error('Lesson 5 match count');
run('pages.listening()');for(const file of ['Q2B5.mp3','Q2B5.NC1.MP3','Q2B5.NC2.MP3','Q2B5.NC3.MP3'])if(fs.statSync('dist/audio/'+file).size<1000||!el('#app').innerHTML.includes('audio/'+file))throw Error('Lesson 5 audio missing');const nc5=run('lesson5BTNC');for(let id=0;id<3;id++){const answers={};nc5[id].questions.forEach((q,i)=>answers['l5nc'+id+'q'+i]=String(q[2]));el('#lesson5BTNCForm'+id).onsubmit({preventDefault(){},target:answers});if(!el('#lesson5BTNCResult'+id).textContent.includes('5 / 5'))throw Error('Lesson 5 listening quiz failed');}if(run('lesson5BTNC.map(g=>g.key.join("")).join("/")')!=='BEACD/ECBDA/BB CAB'.replace(' ',''))throw Error('PDF page 16 keys changed');
run('state.known=[3];state.lesson5Plan={friend:"小明",time:"星期六下午三点"};save();switchTextbookLesson("4")');if(run('words.length')!==19||run('JSON.stringify(state.known)')!=='[1,5]'||run('JSON.stringify(state.sentenceDictationWrong)')!=='[4]')throw Error('Lesson 4 progress changed');run('switchTextbookLesson("5")');if(run('JSON.stringify(state.known)')!=='[3]'||run('state.lesson5Plan.friend')!=='小明')throw Error('Lesson 5 progress lost');
for(let i=1;i<=13;i++)if(fs.statSync('dist/images/lesson5/source-'+i+'.png').size<1000)throw Error('Lesson 5 source missing');sandbox.location.hash='#stories';run('render()');if(run('hsk2Stories.length')!==12)throw Error('Advanced library changed');run('switchTextbookLesson("1")');
console.log('PASS: Lesson 5 seven views, 20 contextual words, picture/reading/feelings/appointment practice, fifteen listening questions, PDF page 16 keys, all audio/source images and separate Lesson 1–5 progress.');

for(const lessonId of ['2','3','4','5']){run('switchTextbookLesson('+JSON.stringify(lessonId)+')');run('pages.listening()');if(!el('#app').innerHTML.includes('audio/Q2B'+lessonId+'.mp3'))throw Error('A later lesson overwrote an earlier listening page');}run('switchTextbookLesson("1")');
vm.runInContext(fs.readFileSync('dist/lesson6-btnc.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/lesson6.js','utf8'),sandbox);
sandbox.location.hash='#words';run('state.level=2;switchTextbookLesson("5");state.known=[2,6];state.sentenceDictationWrong=[5];save();switchTextbookLesson("6")');
if(run('words.length')!==19||run('state.known.length')!==0||!el('#lesson-select').innerHTML.includes('Lesson 6'))throw Error('Lesson 6 entry failed');
for(const route of ['home','words','grammar','dialogue','practice','listening','writing']){sandbox.location.hash='#'+route;run('render()');if(!el('#app').innerHTML.length)throw Error('Empty Lesson 6 '+route);if(route==='listening'&&/audio\/Q2B[12345]/.test(el('#app').innerHTML))throw Error('Old audio leaked into Lesson 6');}
run('startDictation(false,"sentence")');const w6=run('words'),c6=run('vocabularyContexts');for(let i=0;i<19;i++){if(!c6[i].zh.includes(w6[i][0]))throw Error('Lesson 6 target absent');el('#hanziAnswer').value=c6[i].zh;run('checkDictation()');if(!run('dictationSession.passed'))throw Error('Lesson 6 grading failed');if(i<18)run('moveDictation(1)');}
for(const mode of ['vocab','reading','choose']){const qs=run('lesson6Data.exercises['+JSON.stringify(mode)+']');for(let i=0;i<qs.length;i++)if(!run('gradeLesson6Exercise('+JSON.stringify(mode)+','+i+','+JSON.stringify(qs[i][1])+').correct'))throw Error('Lesson 6 exercise key failed');}
run('lesson6PracticeMode="reading";lesson6Practice()');const reading6={};run('lesson6Data.exercises.comprehension').forEach((q,i)=>reading6['l6reading'+i]=String(q[2]));el('#lesson6ReadingQuiz').onsubmit({preventDefault(){},target:reading6});if(!el('#lesson6ReadingResult').textContent.includes('4 / 4'))throw Error('Lesson 6 reading grading failed');
if(!run('gradeLesson6Picture(0,"你上个周末喝没喝咖啡？","没喝，我非常忙。").answer&&gradeLesson6Picture(1,"上个周末你看电影了吗？","看了。").question&&!gradeLesson6Picture(1,"你看电影吗？","没看了。").answer'))throw Error('Completion question variants failed');
if(!run('lesson6CompletedPhrase("买几本书")==="买了几本书"&&lesson6CompletedPhrase("看了一部电影")==="看了一部电影"&&lesson6CompletedPhrase("没看电影")==="没看电影"'))throw Error('Completion placement failed');
run('lesson6PracticeMode="pictures";lesson6Practice()');for(let i=0;i<3;i++){el('#lesson6PictureQ'+i).value=run('lesson6QuestionVariants(...lesson6PictureTasks['+i+'])[0]');el('#lesson6PictureA'+i).value=run('lesson6PictureTasks['+i+'][0]')+'了';}el('#lesson6PictureCheck').onclick();if(!run('Object.values(state.lesson6Exercises.pictures).every(r=>r.correct)'))throw Error('Lesson 6 picture grading failed');
run('lesson6PracticeMode="shop";lesson6Practice()');el('#lesson6TripMake').onclick();if(!el('#lesson6TripOutput').textContent.includes('买了几本书'))throw Error('Weekend dialogue failed');
run('selectVocabularyActivity("flash")');if(!el('#app').innerHTML.includes('1 / 19'))throw Error('Lesson 6 flash count');run('startWordMatch()');for(let round=0;round<5;round++){for(const id of run('matchRoundIds()'))run('selectMatchWord('+id+');chooseMatchMeaning('+id+')');run('wordMatch.round++;wordMatch.solved=[];wordMatch.selected=null;showWordMatch()');}if(!el('#app').innerHTML.includes('19 / 19'))throw Error('Lesson 6 matching count');
run('pages.listening()');for(const file of ['Q2B6.mp3','Q2B6.NC1.MP3','Q2B6.NC2.MP3','Q2B6.NC3.MP3'])if(fs.statSync('dist/audio/'+file).size<1000||!el('#app').innerHTML.includes('audio/'+file))throw Error('Lesson 6 audio missing');const nc6=run('lesson6BTNC');for(let id=0;id<3;id++){const answers={};nc6[id].questions.forEach((q,i)=>answers['l6nc'+id+'q'+i]=String(q[2]));el('#lesson6BTNCForm'+id).onsubmit({preventDefault(){},target:answers});if(!el('#lesson6BTNCResult'+id).textContent.includes('5 / 5'))throw Error('Lesson 6 NC grading failed');}if(run('lesson6BTNC.map(g=>g.key.join("")).join("/")')!=='AEDBC/BCAED/ACBBC')throw Error('PDF page 17 keys changed');
run('state.known=[3];state.lesson6Trip={activity:"看电影",detail:"买几本书"};save();switchTextbookLesson("5")');if(run('words.length')!==20||run('JSON.stringify(state.known)')!=='[2,6]'||run('JSON.stringify(state.sentenceDictationWrong)')!=='[5]')throw Error('Lesson 5 progress changed');run('switchTextbookLesson("6")');if(run('JSON.stringify(state.known)')!=='[3]'||run('state.lesson6Trip.detail')!=='买几本书')throw Error('Lesson 6 progress lost');
for(let i=1;i<=12;i++)if(fs.statSync('dist/images/lesson6/source-'+i+'.png').size<1000)throw Error('Lesson 6 source missing');for(const id of ['2','3','4','5','6']){run('switchTextbookLesson('+JSON.stringify(id)+');pages.listening()');if(!el('#app').innerHTML.includes('audio/Q2B'+id+'.mp3'))throw Error('Earlier lesson listening overwritten');}sandbox.location.hash='#stories';run('render()');if(run('hsk2Stories.length')!==12)throw Error('Advanced library changed');run('switchTextbookLesson("1")');
console.log('PASS: Lesson 6 seven views, 19 contextual words, completion questions/negative answers/了 placement, picture and reading exercises, 15 listening questions, PDF page 17 keys and separate Lesson 1–6 progress.');
vm.runInContext(fs.readFileSync('dist/lesson7-btnc.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/lesson7.js','utf8'),sandbox);
sandbox.location.hash='#words';run('state.level=2;switchTextbookLesson("6");state.known=[1,5];save();switchTextbookLesson("7")');
if(run('words.length')!==21||run('state.known.length')!==0||!el('#lesson-select').innerHTML.includes('Lesson 7'))throw Error('Lesson 7 entry failed');
for(const route of ['home','words','grammar','dialogue','practice','listening','writing']){sandbox.location.hash='#'+route;run('render()');if(!el('#app').innerHTML.length)throw Error('Empty Lesson 7 '+route);if(route==='listening'&&/audio\/Q2B[123456]/.test(el('#app').innerHTML))throw Error('Wrong lesson audio');}
run('startDictation(false,"sentence")');const w7=run('words'),c7=run('vocabularyContexts');for(let i=0;i<21;i++){if(!c7[i].zh.includes(w7[i][0]))throw Error('Lesson 7 target absent');el('#hanziAnswer').value=c7[i].zh;run('checkDictation()');if(!run('dictationSession.passed'))throw Error('Lesson 7 grading failed');if(i<20)run('moveDictation(1)');}
for(const mode of ['vocab','reading','choose']){const qs=run('lesson7Data.exercises['+JSON.stringify(mode)+']');for(let i=0;i<qs.length;i++)if(!run('gradeLesson7Exercise('+JSON.stringify(mode)+','+i+','+JSON.stringify(qs[i][1])+').correct'))throw Error('Lesson 7 key failed');}
run('lesson7PracticeMode="reading";lesson7Practice()');const reading7={};run('lesson7Data.exercises.comprehension').forEach((q,i)=>reading7['l7reading'+i]=String(q[2]));el('#lesson7ReadingQuiz').onsubmit({preventDefault(){},target:reading7});if(!el('#lesson7ReadingResult').textContent.includes('4 / 4'))throw Error('Lesson 7 reading failed');
if(!run('lesson7AnswerMatches("我骑自行车去的。","我是骑自行车去的")&&!lesson7AnswerMatches("我是走路去的","我是骑自行车去的")'))throw Error('Optional shi grading failed');
for(const scene of run('lesson7TransportScenes'))for(const answer of run('lesson7TransportAnswers('+JSON.stringify(scene)+')'))if(!run('lesson7AnswerMatches('+JSON.stringify(answer)+','+JSON.stringify(answer)+')'))throw Error('Transport grading');
for(const scene of run('lesson7PhotoScenes'))for(const answer of run('lesson7PhotoAnswers('+JSON.stringify(scene)+')'))if(!run('lesson7AnswerMatches('+JSON.stringify(answer.replace(/^是/,''))+','+JSON.stringify(answer)+')'))throw Error('Photo grading');
for(const mode of ['pictures','photos','shop'])run('lesson7PracticeMode='+JSON.stringify(mode)+';lesson7Practice()');el('#lesson7TripMake').onclick();if(!el('#lesson7TripOutput').textContent.includes('我是坐飞机去的'))throw Error('Trip report failed');
run('selectVocabularyActivity("flash")');if(!el('#app').innerHTML.includes('1 / 21'))throw Error('Lesson 7 flash count');run('startWordMatch()');for(let round=0;round<6;round++){for(const id of run('matchRoundIds()'))run('selectMatchWord('+id+');chooseMatchMeaning('+id+')');run('wordMatch.round++;wordMatch.solved=[];wordMatch.selected=null;showWordMatch()');}if(!el('#app').innerHTML.includes('21 / 21'))throw Error('Lesson 7 matching count');
run('pages.listening()');for(const file of ['Q2B7.mp3','Q2B7.NC1.MP3','Q2B7.NC2.MP3','Q2B7.NC3.MP3'])if(fs.statSync('dist/audio/'+file).size<1000||!el('#app').innerHTML.includes('audio/'+file))throw Error('Lesson 7 audio missing');const nc7=run('lesson7BTNC');for(let id=0;id<3;id++){const answers={};nc7[id].questions.forEach((q,i)=>answers['l7nc'+id+'q'+i]=String(q[2]));el('#lesson7BTNCForm'+id).onsubmit({preventDefault(){},target:answers});if(!el('#lesson7BTNCResult'+id).textContent.includes('5 / 5'))throw Error('Lesson 7 NC grading failed');}if(run('lesson7BTNC.map(g=>g.key.join("")).join("/")')!=='CAEBD/EDABC/ABCBA')throw Error('PDF page 18 keys changed');
run('state.known=[3];state.lesson7Trip={place:"海南"};save();switchTextbookLesson("6")');if(run('JSON.stringify(state.known)')!=='[1,5]')throw Error('Lesson 6 progress changed');run('switchTextbookLesson("7")');if(run('JSON.stringify(state.known)')!=='[3]'||run('state.lesson7Trip.place')!=='海南')throw Error('Lesson 7 progress lost');
for(let i=1;i<=14;i++)if(fs.statSync('dist/images/lesson7/source-'+i+'.png').size<1000)throw Error('Lesson 7 source missing');for(const id of ['2','3','4','5','6','7']){run('switchTextbookLesson('+JSON.stringify(id)+');pages.listening()');if(!el('#app').innerHTML.includes('audio/Q2B'+id+'.mp3'))throw Error('Earlier listening overwritten');}sandbox.location.hash='#stories';run('render()');if(run('hsk2Stories.length')!==12)throw Error('Advanced library changed');
console.log('PASS: Lesson 7 seven views, 21 contextual words, optional shi grading, transport/photo/trip/reading practice, 15 listening questions, PDF page 18 keys, four audio files, fourteen source pages and isolated progress.');
vm.runInContext(fs.readFileSync('dist/lesson8-btnc.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/lesson8.js','utf8'),sandbox);
sandbox.location.hash='#words';run('state.level=2;switchTextbookLesson("7");state.known=[1,5];save();switchTextbookLesson("8")');
if(run('words.length')!==16||run('state.known.length')!==0||!el('#lesson-select').innerHTML.includes('Lesson 8'))throw Error('Lesson 8 entry failed');
for(const route of ['home','words','grammar','dialogue','practice','listening','writing']){sandbox.location.hash='#'+route;run('render()');if(!el('#app').innerHTML.length)throw Error('Empty Lesson 8 '+route);if(route==='listening'&&/audio\/Q2B[1234567]/.test(el('#app').innerHTML))throw Error('Wrong lesson audio');}
run('startDictation(false,"sentence")');const w8=run('words'),c8=run('vocabularyContexts');for(let i=0;i<16;i++){if(i===11?!c8[i].zh.includes('除了')||!c8[i].zh.includes('以外'):!c8[i].zh.includes(w8[i][0]))throw Error('Lesson 8 target absent');el('#hanziAnswer').value=c8[i].zh;run('checkDictation()');if(!run('dictationSession.passed'))throw Error('Lesson 8 dictation failed');if(i<15)run('moveDictation(1)');}
for(const mode of ['vocab','reading','choose']){const qs=run('lesson8Data.exercises['+JSON.stringify(mode)+']');for(let i=0;i<qs.length;i++)if(!run('gradeLesson8Exercise('+JSON.stringify(mode)+','+i+','+JSON.stringify(qs[i][1])+').correct'))throw Error('Lesson 8 key failed');}
run('lesson8PracticeMode="reading";lesson8Practice()');const reading8={};run('lesson8Data.exercises.comprehension').forEach((q,i)=>reading8['l8reading'+i]=String(q[2]));el('#lesson8ReadingQuiz').onsubmit({preventDefault(){},target:reading8});if(!el('#lesson8ReadingResult').textContent.includes('6 / 6'))throw Error('Lesson 8 reading failed');
if(!run('gradeLesson8Skill(0,0,"你会不会唱歌？")&&gradeLesson8Skill(1,2,"我会跳街舞和日本舞。")&&!gradeLesson8Skill(0,1,"我不会唱歌。")'))throw Error('Skill grading failed');
for(let i=0;i<4;i++){const t=run('lesson8ExtensionTasks['+i+']');if(!run('gradeLesson8Extension('+i+','+JSON.stringify('除了'+t[0]+'以外，我还喜欢'+t[1]+'。')+')'))throw Error('Extension grading failed');}
for(const mode of ['pictures','photos','shop'])run('lesson8PracticeMode='+JSON.stringify(mode)+';lesson8Practice()');el('#lesson8InterviewMake').onclick();if(!el('#lesson8InterviewOutput').textContent.includes('除了说英语以外，还会说法语'))throw Error('Interview report failed');
run('selectVocabularyActivity("flash")');if(!el('#app').innerHTML.includes('1 / 16'))throw Error('Lesson 8 flash count');run('startWordMatch()');for(let round=0;round<4;round++){for(const id of run('matchRoundIds()'))run('selectMatchWord('+id+');chooseMatchMeaning('+id+')');run('wordMatch.round++;wordMatch.solved=[];wordMatch.selected=null;showWordMatch()');}if(!el('#app').innerHTML.includes('16 / 16'))throw Error('Lesson 8 matching count');
run('pages.listening()');for(const file of ['Q2B8.mp3','Q2B8.NC1.MP3','Q2B8.NC2.MP3','Q2B8.NC3.MP3'])if(fs.statSync('dist/audio/'+file).size<1000||!el('#app').innerHTML.includes('audio/'+file))throw Error('Lesson 8 audio missing');const nc8=run('lesson8BTNC');for(let id=0;id<3;id++){const answers={};nc8[id].questions.forEach((q,i)=>answers['l8nc'+id+'q'+i]=String(q[2]));el('#lesson8BTNCForm'+id).onsubmit({preventDefault(){},target:answers});if(!el('#lesson8BTNCResult'+id).textContent.includes('5 / 5'))throw Error('Lesson 8 NC grading failed');}if(run('lesson8BTNC.map(g=>g.key.join("")).join("/")')!=='DECBA/BDCEA/BBCBC')throw Error('PDF page 19 keys changed');
run('state.known=[3];state.lesson8Interview={name:"小明"};save();switchTextbookLesson("7")');if(run('JSON.stringify(state.known)')!=='[1,5]')throw Error('Lesson 7 progress changed');run('switchTextbookLesson("8")');if(run('JSON.stringify(state.known)')!=='[3]'||run('state.lesson8Interview.name')!=='小明')throw Error('Lesson 8 progress lost');
for(let i=1;i<=13;i++)if(fs.statSync('dist/images/lesson8/source-'+i+'.png').size<1000)throw Error('Lesson 8 source missing');
// Reject cross-lesson form binding, which a permissive DOM stub would otherwise hide.
sandbox.document.querySelector=id=>{const m=id.match(/^#lesson(\d+)BTNCForm/);if(m&&m[1]!==run('state.lesson'))throw Error('Cross-lesson listening handler '+id);return el(id);};
for(const id of ['2','3','4','5','6','7','8']){run('switchTextbookLesson('+JSON.stringify(id)+');pages.listening()');if(!el('#app').innerHTML.includes('audio/Q2B'+id+'.mp3'))throw Error('Earlier listening overwritten');}sandbox.location.hash='#stories';run('render()');if(run('hsk2Stories.length')!==12)throw Error('Advanced library changed');
console.log('PASS: Lesson 8 seven views, 16 contextual words, skill/extension/interview/reading exercises, 15 listening questions, PDF page 19 keys, four audio files, thirteen source pages and separate progress. Earlier listening forms bind only their own lesson.');
vm.runInContext(fs.readFileSync('dist/lesson9-btnc.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/lesson9.js','utf8'),sandbox);
sandbox.location.hash='#words';run('state.level=2;switchTextbookLesson("8");state.known=[1,5];save();switchTextbookLesson("9")');
if(run('words.length')!==19||run('state.known.length')!==0||!el('#lesson-select').innerHTML.includes('Lesson 9'))throw Error('Lesson 9 entry failed');
for(const route of ['home','words','grammar','dialogue','practice','listening','writing']){sandbox.location.hash='#'+route;run('render()');if(!el('#app').innerHTML.length)throw Error('Empty Lesson 9 '+route);if(route==='listening'&&/audio\/Q2B[12345678]/.test(el('#app').innerHTML))throw Error('Wrong lesson audio');}
run('startDictation(false,"sentence")');const w9=run('words'),c9=run('vocabularyContexts');for(let i=0;i<19;i++){const target=w9[i][0];if(i===10?!c9[i].zh.includes('对')||!c9[i].zh.includes('感兴趣'):!c9[i].zh.includes(target.replaceAll('……','')))throw Error('Lesson 9 target absent');el('#hanziAnswer').value=c9[i].zh;run('checkDictation()');if(!run('dictationSession.passed'))throw Error('Lesson 9 dictation failed');if(i<18)run('moveDictation(1)');}
for(const mode of ['vocab','reading','choose']){const qs=run('lesson9Data.exercises['+JSON.stringify(mode)+']');for(let i=0;i<qs.length;i++)if(!run('gradeLesson9Exercise('+JSON.stringify(mode)+','+i+','+JSON.stringify(qs[i][1])+').correct'))throw Error('Lesson 9 key failed');}
run('lesson9PracticeMode="reading";lesson9Practice()');const reading9={};run('lesson9Data.exercises.comprehension').forEach((q,i)=>reading9['l9reading'+i]=String(q[2]));el('#lesson9ReadingQuiz').onsubmit({preventDefault(){},target:reading9});if(!el('#lesson9ReadingResult').textContent.includes('4 / 4'))throw Error('Lesson 9 reading failed');
if(!run('gradeLesson9Experience(2,0,"你吃没吃过烤鸭？")&&gradeLesson9Experience(2,0,"你吃过烤鸭吗？")&&gradeLesson9Experience(2,2,"我还没吃过烤鸭。")&&!gradeLesson9Experience(2,2,"我不吃过烤鸭。")&&!gradeLesson9Experience(2,1,"我吃了烤鸭。")'))throw Error('Experience forms failed');
for(let i=0;i<4;i++)for(let kind=0;kind<3;kind++)if(!run('gradeLesson9Experience('+i+','+kind+',lesson9ExperienceVariants('+i+','+kind+')[0])'))throw Error('Experience key failed');
run('lesson9PracticeMode="pictures";lesson9Practice();lesson9PracticeMode="shop";lesson9Practice()');el('#lesson9InterviewMake').onclick();if(!el('#lesson9InterviewOutput').textContent.includes('小明去过长城，是去年去的，觉得长城很长，很美'))throw Error('Interview report failed');
run('selectVocabularyActivity("flash")');if(!el('#app').innerHTML.includes('1 / 19'))throw Error('Lesson 9 flash count');run('startWordMatch()');for(let round=0;round<5;round++){for(const id of run('matchRoundIds()'))run('selectMatchWord('+id+');chooseMatchMeaning('+id+')');run('wordMatch.round++;wordMatch.solved=[];wordMatch.selected=null;showWordMatch()');}if(!el('#app').innerHTML.includes('19 / 19'))throw Error('Lesson 9 matching count');
run('pages.listening()');for(const file of ['Q2B9.mp3','Q2B9.NC1.MP3','Q2B9.NC2.MP3','Q2B9.NC3.MP3'])if(fs.statSync('dist/audio/'+file).size<1000||!el('#app').innerHTML.includes('audio/'+file))throw Error('Lesson 9 audio missing');const nc9=run('lesson9BTNC');for(let id=0;id<3;id++){const answers={};nc9[id].questions.forEach((q,i)=>answers['l9nc'+id+'q'+i]=String(q[2]));el('#lesson9BTNCForm'+id).onsubmit({preventDefault(){},target:answers});if(!el('#lesson9BTNCResult'+id).textContent.includes('5 / 5'))throw Error('Lesson 9 NC grading failed');}if(run('lesson9BTNC.map(g=>g.key.join("")).join("/")')!=='BEADC/EDABC/BAABB')throw Error('PDF page 20 keys changed');
run('state.known=[3];state.lesson9Interview={name:"小明"};save();switchTextbookLesson("8")');if(run('JSON.stringify(state.known)')!=='[1,5]')throw Error('Lesson 8 progress changed');run('switchTextbookLesson("9")');if(run('JSON.stringify(state.known)')!=='[3]'||run('state.lesson9Interview.name')!=='小明')throw Error('Lesson 9 progress lost');
for(let i=1;i<=12;i++)if(fs.statSync('dist/images/lesson9/source-'+i+'.png').size<1000)throw Error('Lesson 9 source missing');for(const id of ['2','3','4','5','6','7','8','9']){run('switchTextbookLesson('+JSON.stringify(id)+');pages.listening()');if(!el('#app').innerHTML.includes('audio/Q2B'+id+'.mp3'))throw Error('Earlier listening overwritten');}sandbox.location.hash='#stories';run('render()');if(run('hsk2Stories.length')!==12)throw Error('Advanced library changed');
console.log('PASS: Lesson 9 seven views, 19 contextual words, experience question/negative variants, picture/interview/reading exercises, 15 listening questions, PDF page 20 keys, four audio files, twelve source pages and isolated progress.');
