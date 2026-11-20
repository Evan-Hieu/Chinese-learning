// Vocabulary listening practice. Browser speech is separate from the textbook recordings.
let dictationSession=null;
function stopWordAudio(){if(window.speechSynthesis)window.speechSynthesis.cancel();}
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
function startDictation(review=false){
  stopWordAudio();
  const mistakes=Array.isArray(state.dictationWrong)?state.dictationWrong.filter(i=>Number.isInteger(i)&&i>=0&&i<words.length):[];
  const queue=review?mistakes:words.map((_,i)=>i);
  dictationSession={queue,position:0,checked:false,revealed:false,correct:0,review,records:{},tab:'practice',rate:'0.85',volume:'1'};
  showDictation();
}
function dictationChrome(){
  return '<div class="dictation-page"><div class="dictation-title"><h1>1. 你在听什么？</h1><span>Trình độ: HSK2 · Từ vựng</span></div><div class="toolbar dictation-links"><button class="text-button" id="backWords">← Danh sách từ</button><button class="text-button" id="reviewWrong">Ôn từ sai ('+(state.dictationWrong||[]).length+')</button></div>'+(!dictationSession.hideNote?'<div class="practice-note"><span>Tiến độ ôn từ được lưu trên trình duyệt này. Âm thanh dùng giọng tiếng Trung của thiết bị.</span><button id="dismissPracticeNote" aria-label="Đóng thông báo">×</button></div>':'')+'</div>';
}
function bindDictationChrome(){
  document.querySelector('#backWords').onclick=()=>{stopWordAudio();pages.words();};
  document.querySelector('#reviewWrong').onclick=()=>startDictation(true);
  if(!dictationSession.hideNote)document.querySelector('#dismissPracticeNote').onclick=()=>{captureDictation();dictationSession.hideNote=true;showDictation();};
}
function captureDictation(){
  const session=dictationSession;
  if(session.tab!=='transcript'&&session.position<session.queue.length){
    session.records[session.position]={checked:session.checked,revealed:session.revealed,passed:session.passed||false,draft:document.querySelector('#hanziAnswer').value,feedback:document.querySelector('#dictationFeedback').innerHTML};
  }
}
function moveDictation(direction){
  const session=dictationSession;
  if(direction>0&&!session.passed)markDictationWrong();
  captureDictation();session.position=Math.max(0,session.position+direction);
  const record=session.records[session.position]||{};
  session.checked=!!record.checked;session.revealed=!!record.revealed;session.passed=!!record.passed;
  showDictation();
}
function showDictation(){
  stopWordAudio();const session=dictationSession;
  if(session.position>=session.queue.length){
    app.innerHTML=dictationChrome()+'<section class="card dictation-card"><div class="icon">✓</div><h2>'+(session.queue.length?'Hoàn thành lượt học!':'Chưa có từ cần ôn lại')+'</h2><p>'+session.correct+' / '+session.queue.length+' từ đúng ngay lần đầu, không xem đáp án.</p><p class="sub">Từ sai hoặc đã xem đáp án được giữ lại để bạn ôn tiếp.</p><button class="btn" id="restartDictation">Học lại từ đầu</button></section>';
    bindDictationChrome();document.querySelector('#restartDictation').onclick=()=>startDictation();return;
  }
  const word=words[session.queue[session.position]],transcript=session.tab==='transcript';
  const tabs='<div class="dictation-tabs" role="tablist" aria-label="Chế độ học từ"><button role="tab" id="practiceTab" aria-controls="practicePanel" aria-selected="'+!transcript+'">Nghe & gõ</button><button role="tab" id="transcriptTab" aria-controls="practicePanel" aria-selected="'+transcript+'">Toàn bộ từ vựng</button></div>';
  const body=transcript?'<div class="transcript-intro"><h2>Từ vựng Lesson 1</h2><p>Chữ Hán, pinyin, nghĩa và ví dụ trong giáo trình.</p></div><div class="transcript-list">'+session.queue.map((id,i)=>'<article><span class="transcript-number">'+(i+1)+'</span><div><div class="han">'+words[id][0]+'</div><p class="pinyin">'+words[id][1]+'</p><p>'+words[id][2]+'</p><p class="sub">'+words[id][3]+'</p></div></article>').join('')+'</div>':`
  <div class="practice-topline"><div class="word-navigation"><button id="previousWord" aria-label="Từ trước" ${session.position===0?'disabled':''}>←</button><span>${session.position+1} / ${session.queue.length}</span><button id="forwardWord" aria-label="Từ sau">→</button></div><details class="dictation-settings"><summary>⚙ Cài đặt</summary><div class="settings-popover"><label>Âm lượng <input id="wordVolume" type="range" min="0" max="1" step="0.1" value="${session.volume||'1'}"></label><p>Giọng đọc: tiếng Trung trên thiết bị.</p><p>Bỏ qua dấu câu và khoảng trắng khi chấm. Chỉ nhập chữ Hán.</p></div></details></div>
  <div class="dictation-player"><div class="speech-player"><button id="listenWord" aria-label="Nghe từ tiếng Trung">▶</button><span>Nghe từ</span><span class="speech-player-line" aria-hidden="true"></span><span aria-hidden="true">♫</span></div><select id="wordRate" aria-label="Tốc độ đọc từ"><option value="0.65">0.65×</option><option value="0.85">0.85×</option><option value="1">1×</option></select></div>
  <p id="speechStatus" role="status" class="speech-status">Bấm ▶ để nghe. Cần giọng tiếng Trung trên thiết bị.</p>
  <form id="dictationForm" class="daily-dictation-form"><label for="hanziAnswer" class="sr-only">Chữ Hán bạn nghe được</label><textarea id="hanziAnswer" class="hanzi-answer" lang="zh-CN" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="80" rows="3" placeholder="Gõ chữ Hán bạn nghe được…" required></textarea><div class="dictation-actions"><button class="check-answer" type="submit">Kiểm tra</button><button class="skip-answer" type="button" id="nextWord">Bỏ qua</button><button class="reveal-answer" type="button" id="revealWord">Xem đáp án</button></div></form><div id="dictationFeedback" aria-live="polite"></div>`;
  app.innerHTML=dictationChrome()+tabs+'<section class="dictation-workspace" id="practicePanel" role="tabpanel" aria-labelledby="'+(transcript?'transcriptTab':'practiceTab')+'">'+body+'</section>';
  bindDictationChrome();
  document.querySelector('#practiceTab').onclick=()=>{if(!transcript)return;session.tab='practice';showDictation();};
  document.querySelector('#transcriptTab').onclick=()=>{if(transcript)return;captureDictation();session.tab='transcript';showDictation();};
  if(transcript)return;
  const record=session.records[session.position]||{};
  document.querySelector('#hanziAnswer').value=record.draft||'';
  document.querySelector('#dictationFeedback').innerHTML=record.feedback||'';
  if(session.checked||session.revealed)document.querySelector('#nextWord').textContent='Tiếp theo →';
  document.querySelector('#listenWord').onclick=()=>speakWord(word[0]);
  document.querySelector('#wordRate').value=session.rate||'0.85';
  document.querySelector('#wordRate').onchange=e=>{session.rate=e.target.value;stopWordAudio();};
  document.querySelector('#wordVolume').oninput=e=>{session.volume=e.target.value;};
  let composing=false;
  document.querySelector('#hanziAnswer').oncompositionstart=()=>{composing=true;};
  document.querySelector('#hanziAnswer').oncompositionend=()=>{composing=false;};
  document.querySelector('#dictationForm').onsubmit=e=>{e.preventDefault();if(composing||e.isComposing)return;checkDictation();};
  document.querySelector('#revealWord').onclick=()=>{session.revealed=true;markDictationWrong();showWordFeedback(false,true);};
  document.querySelector('#nextWord').onclick=()=>moveDictation(1);
  document.querySelector('#previousWord').onclick=()=>{if(session.position>0)moveDictation(-1);};
  document.querySelector('#forwardWord').onclick=()=>moveDictation(1);
}
function speakWord(text){
  const status=document.querySelector('#speechStatus');
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){status.textContent='Trình duyệt chưa hỗ trợ đọc từ. Bạn vẫn có thể xem đáp án để học từ.';return;}
  stopWordAudio();const voices=window.speechSynthesis.getVoices();
  const voice=voices.find(v=>/^zh[-_]CN/i.test(v.lang))||voices.find(v=>/^zh/i.test(v.lang));
  if(!voice){status.textContent='Chưa tìm thấy giọng tiếng Trung. Hãy bật hoặc cài giọng tiếng Trung trong thiết bị rồi thử lại. Bạn vẫn có thể dùng “Xem đáp án”.';return;}
  const utterance=new window.SpeechSynthesisUtterance(text.replace(/[…。，]/g,' ').trim());
  utterance.volume=Number(dictationSession.volume===undefined?1:dictationSession.volume);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=Number(document.querySelector('#wordRate').value)||0.85;
  utterance.onstart=()=>{status.textContent='Đang đọc…';};
  utterance.onend=()=>{status.textContent='Đã đọc xong. Bấm nút nghe để nghe lại.';};
  utterance.onerror=event=>{if(event.error!=='canceled'&&event.error!=='interrupted')status.textContent='Không phát được giọng đọc. Hãy thử lại hoặc xem đáp án.';};
  window.speechSynthesis.speak(utterance);
}
function markDictationWrong(){
  const id=dictationSession.queue[dictationSession.position];
  if(!Array.isArray(state.dictationWrong))state.dictationWrong=[];
  if(!state.dictationWrong.includes(id))state.dictationWrong.push(id);save();
}
function checkDictation(){
  const input=document.querySelector('#hanziAnswer');
  if(!normalizeHanzi(input.value)){document.querySelector('#dictationFeedback').textContent='Bạn hãy gõ chữ Hán trước khi kiểm tra.';return;}
  const session=dictationSession,id=session.queue[session.position],result=compareHanzi(input.value,words[id][0]);
  if(result.correct){
    if(!session.checked&&!session.revealed)session.correct++;
    session.passed=true;
    // Only an unaided first try clears a word from the review queue.
    if(!session.checked&&!session.revealed){state.dictationWrong=(state.dictationWrong||[]).filter(i=>i!==id);save();}
  }else{session.passed=false;markDictationWrong();}
  session.checked=true;showWordFeedback(result.correct,false,result.parts);
}
function showWordFeedback(correct,reveal,parts=[]){
  const word=words[dictationSession.queue[dictationSession.position]];
  document.querySelector('#dictationFeedback').innerHTML=`<div class="feedback ${correct?'good':''}"><strong>${reveal?'Đáp án của từ':correct?'✓ Chính xác!':'Thử lại nhé — đối chiếu chữ bên dưới.'}</strong>${!reveal?'<div class="hanzi-diff">'+parts.map(p=>'<span class="diff-'+p.kind+'" title="'+({correct:'Đúng',missing:'Thiếu',extra:'Thừa hoặc sai'}[p.kind])+'">'+esc(p.text)+'</span>').join('')+'</div><p class="diff-legend">Xanh: đúng · Gạch dưới: thiếu · Gạch ngang: thừa hoặc sai</p>':''}<div class="han">${word[0]}</div><p class="pinyin">${word[1]}</p><p>${word[2]}</p><p class="example">${word[3]}</p></div>`;
  document.querySelector('#nextWord').textContent='Từ tiếp theo →';
  document.querySelector('#reviewWrong').textContent='Ôn từ sai ('+(state.dictationWrong||[]).length+')';
}
