// Vocabulary listening practice. Browser speech is separate from the textbook recordings.
let dictationSession=null,wordReplayTimer=null,wordSpeechEpoch=0,wordUtterance=null;
function vocabularyTabsMarkup(active){return '<div class="dictation-tabs" role="tablist" aria-label="Chế độ học từ">'+[['practice','practiceTab','Nghe & gõ'],['transcript','transcriptTab','Toàn bộ từ vựng'],['advanced','advancedTab','Từ vựng nâng cao']].map(([key,id,label])=>'<button role="tab" id="'+id+'" aria-controls="practicePanel" aria-selected="'+(active===key)+'">'+label+'</button>').join('')+'</div>';}
function stopWordAudio(preservePlaylist=false){
  if(!preservePlaylist)cancelContextPlayback();
  wordSpeechEpoch++;
  if(wordReplayTimer!==null){clearTimeout(wordReplayTimer);wordReplayTimer=null;}
  wordUtterance=null;
  if(window.speechSynthesis)window.speechSynthesis.cancel();
  const button=document.querySelector('#listenWord');if(button)button.textContent='▶';
}
function normalizeHanzi(text){return String(text).normalize('NFKC').replace(/[\s\p{P}\p{S}]/gu,'');}
function compareHanzi(answer,expected){
  const a=Array.from(normalizeHanzi(answer)),b=Array.from(normalizeHanzi(expected));
  const table=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
  for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)table[i][j]=a[i]===b[j]?table[i+1][j+1]+1:Math.max(table[i+1][j],table[i][j+1]);
  const parts=[];let i=0,j=0;
  while(i<a.length||j<b.length){
    if(i<a.length&&j<b.length&&a[i]===b[j]){parts.push({kind:'correct',text:a[i++]});j++;}
    else if(j<b.length&&(i===a.length||table[i][j+1]>=table[i+1][j]))parts.push({kind:'missing',text:b[j++]});
    else parts.push({kind:'extra',text:a[i++]});
  }
  return {correct:a.join('')===b.join(''),parts};
}
function startDictation(review=false,mode=state.dictationMode==='word'?'word':'sentence'){
  stopWordAudio();
  const mistakes=dictationMistakes(mode);
  const queue=review?mistakes:words.map((_,i)=>i);
  dictationSession={queue,position:0,checked:false,revealed:false,correct:0,review,mode,records:{},tab:'practice',rate:'0.85',volume:'1',lastResult:null,composing:false,hideNote:true};
  state.dictationMode=mode;save();
  showDictation();
}
function dictationChrome(){
  const mode=dictationMode();
  return '<div class="dictation-page"><div class="toolbar dictation-links"><button class="text-button" id="backWords">← Danh sách từ</button><button class="text-button" id="reviewWrong">'+(mode==='sentence'?'Ôn câu sai':'Ôn từ sai')+' ('+dictationMistakes().length+')</button></div><div class="practice-mode-control"><label for="practiceMode">Luyện theo</label><select id="practiceMode"><option value="sentence" '+(mode==='sentence'?'selected':'')+'>Câu ví dụ</option><option value="word" '+(mode==='word'?'selected':'')+'>Từ riêng lẻ</option></select><span>'+(mode==='sentence'?'Nghe và gõ cả câu tiếng Trung.':'Nghe và gõ một từ.')+'</span></div></div>';
}
function bindDictationChrome(){
  document.querySelector('#backWords').onclick=()=>{stopWordAudio();pages.words();};
  document.querySelector('#reviewWrong').onclick=()=>startDictation(true);
  document.querySelector('#practiceMode').onchange=e=>selectVocabularyActivity(e.target.value);
  if(!dictationSession.hideNote)document.querySelector('#dismissPracticeNote').onclick=()=>{captureDictation();dictationSession.hideNote=true;showDictation();};
}
function captureDictation(){
  const session=dictationSession;
  if(session.tab!=='transcript'&&session.position<session.queue.length){
    session.records[session.position]={checked:session.checked,revealed:session.revealed,passed:session.passed||false,draft:document.querySelector('#hanziAnswer').value,lastResult:session.lastResult};
  }
}
function moveDictation(direction){
  const session=dictationSession,previousPosition=session.position;
  if(direction>0&&!session.passed)markDictationWrong();
  captureDictation();session.position=Math.max(0,session.position+direction);
  const record=session.records[session.position]||{};
  session.checked=!!record.checked;session.revealed=!!record.revealed;session.passed=!!record.passed;session.lastResult=record.lastResult||null;
  showDictation();
  if(session.tab==='practice'&&session.position!==previousPosition&&session.position<session.queue.length){
    speakWord(currentSpeechText(),{repeatsRemaining:0});
  }
}
function showDictation(){
  stopWordAudio();const session=dictationSession;session.composing=false;app.dataset.vocabView=session.tab==='transcript'?'transcript':'practice';
  if(session.position>=session.queue.length){
    app.innerHTML=dictationChrome()+'<section class="card dictation-card"><div class="icon">✓</div><h2>'+(session.queue.length?'Hoàn thành lượt học!':'Chưa có từ cần ôn lại')+'</h2><p>'+session.correct+' / '+session.queue.length+' '+(session.mode==='sentence'?'câu':'từ')+' đúng ngay lần đầu, không xem đáp án.</p><p class="sub">Từ sai hoặc đã xem đáp án được giữ lại để bạn ôn tiếp.</p><button class="btn" id="restartDictation">Học lại từ đầu</button></section>';
    bindDictationChrome();document.querySelector('#restartDictation').onclick=()=>startDictation();return;
  }
  const word=practiceEntry(session.queue[session.position]),transcript=session.tab==='transcript';
  const tabs=vocabularyTabsMarkup(transcript?'transcript':'practice');
  const body=transcript?contextTranscriptHtml():`
  <div class="practice-topline"><div class="word-navigation"><button id="previousWord" aria-label="Từ trước" ${session.position===0?'disabled':''}>←</button><span>${session.position+1} / ${session.queue.length}</span><button id="forwardWord" aria-label="Từ sau">→</button></div><button class="settings-open-button" id="openDictationSettings" aria-haspopup="dialog">⚙ Cài đặt</button></div>
  <div class="dictation-player"><div class="speech-player"><button id="listenWord" aria-label="${session.mode==='sentence'?'Nghe câu tiếng Trung':'Nghe từ tiếng Trung'}">▶</button><span>${session.mode==='sentence'?'Nghe câu':'Nghe từ'}</span><span class="speech-player-line" aria-hidden="true"></span><span aria-hidden="true">♫</span></div><select id="wordRate" aria-label="Tốc độ đọc từ"><option value="0.65">0.65×</option><option value="0.85">0.85×</option><option value="1">1×</option></select></div>
  <p id="speechStatus" role="status" class="speech-status">Bấm ▶ để nghe. Cần giọng tiếng Trung trên thiết bị.</p>
  <form id="dictationForm" class="daily-dictation-form"><label for="hanziAnswer" class="sr-only">Chữ Hán bạn nghe được</label><textarea id="hanziAnswer" class="hanzi-answer" lang="zh-CN" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="80" rows="3" placeholder="${session.mode==='sentence'?'Gõ cả câu tiếng Trung bạn nghe được…':'Gõ chữ Hán bạn nghe được…'}" required></textarea><div class="dictation-actions" id="dictationActions"><button class="check-answer" type="submit">Kiểm tra</button><button class="skip-answer" type="button" id="nextWord">Bỏ qua</button><button class="reveal-answer" type="button" id="revealWord">Xem đáp án</button></div></form><div id="dictationFeedback" aria-live="polite"></div><p id="shortcutTips" class="shortcut-tips"></p>${dictationSettingsMarkup()}`;
  app.innerHTML=tabs+dictationChrome()+'<section class="dictation-workspace '+(transcript?'context-transcript':'')+'" id="practicePanel" role="tabpanel" aria-labelledby="'+(transcript?'transcriptTab':'practiceTab')+'">'+body+'</section>';
  bindDictationChrome();
  document.querySelector('#practiceTab').onclick=()=>{if(!transcript)return;session.tab='practice';showDictation();};
  document.querySelector('#transcriptTab').onclick=()=>{if(transcript)return;captureDictation();if(session.transcriptIndex===undefined)session.transcriptIndex=session.position;session.tab='transcript';showDictation();};
  document.querySelector('#advancedTab').onclick=()=>openAdvancedVocabulary();
  if(transcript){bindContextTranscript();return;}
  const record=session.records[session.position]||{};
  document.querySelector('#hanziAnswer').value=record.draft||'';
  if(session.lastResult)showWordFeedback(session.lastResult.correct,session.lastResult.reveal,session.lastResult.parts);
  if(session.passed)document.querySelector('#nextWord').textContent='Tiếp theo →';
  document.querySelector('#listenWord').onclick=toggleWordPlayback;
  document.querySelector('#wordRate').value=session.rate||'0.85';
  document.querySelector('#wordRate').onchange=e=>{session.rate=e.target.value;stopWordAudio();};
  bindDictationSettings();
  document.querySelector('#hanziAnswer').oninput=()=>{document.querySelector('#dictationActions').hidden=false;};
  let composing=false;
  document.querySelector('#hanziAnswer').oncompositionstart=()=>{composing=true;session.composing=true;};
  document.querySelector('#hanziAnswer').oncompositionend=()=>{composing=false;session.composing=false;};
  document.querySelector('#hanziAnswer').onkeydown=e=>{
    if(e.key!=='Enter'||e.shiftKey||e.ctrlKey||e.altKey||e.metaKey)return;
    if(composing||session.composing||e.isComposing||e.keyCode===229)return;
    e.preventDefault();if(e.repeat)return;
    if(session.passed&&compareHanzi(e.target.value,practiceEntry(session.queue[session.position])[0]).correct){
      moveDictation(1);
      if(session.position<session.queue.length)document.querySelector('#hanziAnswer').focus();
    }else checkDictation();
  };
  document.querySelector('#dictationForm').onsubmit=e=>{e.preventDefault();if(composing||e.isComposing)return;checkDictation();};
  document.querySelector('#revealWord').onclick=()=>{session.revealed=true;markDictationWrong();showWordFeedback(false,true);};
  document.querySelector('#nextWord').onclick=()=>moveDictation(1);
  document.querySelector('#previousWord').onclick=()=>{if(session.position>0)moveDictation(-1);};
  document.querySelector('#forwardWord').onclick=()=>moveDictation(1);
}
function toggleWordPlayback(){
  const synth=window.speechSynthesis,status=document.querySelector('#speechStatus');
  if(synth?.paused&&wordUtterance){synth.resume();document.querySelector('#listenWord').textContent='❚❚';status.textContent='Đang đọc…';return;}
  if(synth?.speaking&&wordUtterance){synth.pause();document.querySelector('#listenWord').textContent='▶';status.textContent='Đã tạm dừng. Bấm ▶ để tiếp tục.';return;}
  if(wordReplayTimer!==null){stopWordAudio();status.textContent='Đã dừng tự nghe lại. Bấm ▶ để phát.';return;}
  speakWord(currentSpeechText());
}
function speakWord(text,options={}){
  const status=document.querySelector('#speechStatus');
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){status.textContent='Trình duyệt chưa hỗ trợ đọc từ. Bạn vẫn có thể xem đáp án để học từ.';return false;}
  stopWordAudio(!!options.playlist);const epoch=wordSpeechEpoch,session=dictationSession,position=activeSpeechPosition();
  const voices=window.speechSynthesis.getVoices();
  const voice=voices.find(v=>/^zh[-_]CN/i.test(v.lang))||voices.find(v=>/^zh/i.test(v.lang));
  if(!voice){status.textContent='Chưa tìm thấy giọng tiếng Trung. Hãy bật hoặc cài giọng tiếng Trung trong thiết bị rồi thử lại. Bạn vẫn có thể dùng “Xem đáp án”.';return false;}
  const utterance=new window.SpeechSynthesisUtterance(text.replace(/[…。，]/g,' ').trim());wordUtterance=utterance;
  utterance.volume=Number(session.volume===undefined?1:session.volume);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=Number(document.querySelector('#wordRate')?.value)||0.85;
  utterance.onstart=()=>{if(epoch!==wordSpeechEpoch)return;status.textContent=options.playlist?'Đang nghe toàn bộ bài · Câu '+(position+1)+' / '+session.queue.length:'Đang đọc…';document.querySelector('#listenWord').textContent='❚❚';};
  utterance.onend=()=>{
    if(epoch!==wordSpeechEpoch)return;wordUtterance=null;document.querySelector('#listenWord').textContent='▶';
    if(options.onComplete){options.onComplete();return;}
    const prefs=dictationPrefs();
    const remaining=Number.isInteger(options.repeatsRemaining)?options.repeatsRemaining:prefs.autoReplay;
    const repeat=session.tab!=='transcript'&&remaining>0&&!session.passed&&!session.revealed;
    if(repeat&&session===dictationSession&&position===activeSpeechPosition()){
      status.textContent='Còn '+remaining+' lần nghe lại · phát sau '+prefs.replayDelay+' giây. Bấm ▶ để dừng.';
      wordReplayTimer=setTimeout(()=>{wordReplayTimer=null;if(epoch===wordSpeechEpoch)speakWord(text,{...options,repeatsRemaining:remaining-1});},prefs.replayDelay*1000);
    }else status.textContent='Đã đọc xong. Bấm ▶ để nghe lại.';
  };
  utterance.onerror=event=>{if(epoch!==wordSpeechEpoch)return;wordUtterance=null;document.querySelector('#listenWord').textContent='▶';if(event.error!=='canceled'&&event.error!=='interrupted')status.textContent='Không phát được giọng đọc. Hãy thử lại hoặc xem đáp án.';if(options.onError)options.onError();};
  window.speechSynthesis.resume();window.speechSynthesis.speak(utterance);return true;
}
function markDictationWrong(){
  const id=dictationSession.queue[dictationSession.position];
  const key=dictationMode()==='sentence'?'sentenceDictationWrong':'dictationWrong';
  state[key]=dictationMistakes();if(!state[key].includes(id))state[key].push(id);save();
}
function checkDictation(){
  stopWordAudio();
  const input=document.querySelector('#hanziAnswer');
  if(!normalizeHanzi(input.value)){document.querySelector('#dictationFeedback').textContent='Bạn hãy gõ chữ Hán trước khi kiểm tra.';return;}
  const session=dictationSession,id=session.queue[session.position],result=compareHanzi(input.value,practiceEntry(id)[0]);
  if(result.correct){
    if(!session.checked&&!session.revealed)session.correct++;
    session.passed=true;
    // Only an unaided first try clears a word from the review queue.
    if(!session.checked&&!session.revealed){const key=dictationMode()==='sentence'?'sentenceDictationWrong':'dictationWrong';state[key]=dictationMistakes().filter(i=>i!==id);save();}
  }else{session.passed=false;markDictationWrong();}
  session.checked=true;showWordFeedback(result.correct,false,result.parts);
}
function maskedWordFeedback(parts,showImmediate){
  const expected=parts.filter(p=>p.kind!=='extra'),firstMissing=expected.findIndex(p=>p.kind==='missing');
  let hintStart=firstMissing,hintEnd=firstMissing+1;
  if(showImmediate&&firstMissing>=0&&typeof Intl.Segmenter==='function'){
    const text=expected.map(p=>p.text).join('');
    let offset=0;
    for(const item of new Intl.Segmenter('zh-CN',{granularity:'word'}).segment(text)){
      const end=offset+Array.from(item.segment).length;
      if(firstMissing>=offset&&firstMissing<end){hintStart=offset;hintEnd=end;break;}offset=end;
    }
  }
  return expected.map((p,index)=>{
    if(p.kind==='correct')return '<span class="answer-match">'+esc(p.text)+'</span>';
    if(showImmediate&&index>=hintStart&&index<hintEnd)return '<span class="answer-hint">'+esc(p.text)+'</span>';
    return '<span class="answer-mask" aria-label="Chữ còn ẩn">＊</span>';
  }).join('');
}
function showWordFeedback(correct,reveal,parts=[]){
  stopWordAudio();
  const session=dictationSession,word=practiceEntry(session.queue[session.position]),prefs=dictationPrefs();
  session.lastResult={correct,reveal,parts};
  const full=correct||reveal||prefs.showFull;
  document.querySelector('#dictationFeedback').innerHTML=`<div class="dictation-result ${correct?'is-correct':'is-incorrect'}"><div class="result-heading"><span>${correct?'✓ Chính xác':reveal?'Đáp án':'⚠ Chưa chính xác'}</span><button id="feedbackNext" type="button">${correct?'Tiếp theo →':'Bỏ qua'}</button></div><div class="masked-answer" lang="zh-CN">${full?esc(word[0]):maskedWordFeedback(parts,prefs.showImmediate)}</div>${!full?'<p class="partial-answer-note">Xanh: chữ đúng · Xanh đậm, gạch dưới: chữ gợi ý · ＊: chữ còn ẩn</p>':''}<div class="answer-options"><label><input id="showImmediateAnswer" type="checkbox" ${prefs.showImmediate?'checked':''}> Hiện gợi ý ngay sau khi kiểm tra</label><label><input id="showFullAnswer" type="checkbox" ${prefs.showFull?'checked':''}> Hiện toàn bộ đáp án</label></div>${full?'<div class="answer-details"><p class="pinyin">'+word[1]+'</p><p>'+word[2]+'</p><p class="example">'+word[3]+'</p></div>':''}</div>`;
  document.querySelector('#showImmediateAnswer').onchange=e=>{updateDictationPreference('showImmediate',e.target.checked);showWordFeedback(correct,reveal,parts);};
  document.querySelector('#showFullAnswer').onchange=e=>{updateDictationPreference('showFull',e.target.checked);if(e.target.checked&&!correct){session.revealed=true;markDictationWrong();}showWordFeedback(correct,reveal,parts);};
  document.querySelector('#dictationActions').hidden=true;
  document.querySelector('#feedbackNext').onclick=()=>moveDictation(1);
  document.querySelector('#nextWord').textContent=correct?'Tiếp theo →':'Bỏ qua';
  document.querySelector('#reviewWrong').textContent=(dictationMode()==='sentence'?'Ôn câu sai':'Ôn từ sai')+' ('+dictationMistakes().length+')';
}
