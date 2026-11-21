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
