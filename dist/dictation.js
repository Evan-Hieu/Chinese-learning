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
  dictationSession={queue,position:0,checked:false,revealed:false,correct:0,review};
  showDictation();
}
function dictationChrome(){
  return intro('TỪ VỰNG · HSK2 · LESSON 1','Nghe, gõ và nhớ từ.','Nghe từ rồi dùng bàn phím tiếng Trung gõ chữ Hán. Đáp án ẩn cho đến khi kiểm tra hoặc xem gợi ý.')+
    '<div class="toolbar"><button class="btn secondary" id="backWords">← Danh sách từ</button><button class="btn secondary" id="reviewWrong">Ôn từ sai ('+(state.dictationWrong||[]).length+')</button></div>';
}
function bindDictationChrome(){
  document.querySelector('#backWords').onclick=()=>{stopWordAudio();pages.words();};
  document.querySelector('#reviewWrong').onclick=()=>startDictation(true);
}
function showDictation(){
  stopWordAudio();const session=dictationSession;
  if(session.position>=session.queue.length){
    app.innerHTML=dictationChrome()+'<section class="card dictation-card"><div class="icon">✓</div><h2>'+(session.queue.length?'Hoàn thành lượt học!':'Chưa có từ cần ôn lại')+'</h2><p>'+session.correct+' / '+session.queue.length+' từ đúng ngay lần đầu, không xem đáp án.</p><p class="sub">Từ sai hoặc đã xem đáp án được giữ lại để bạn ôn tiếp.</p><button class="btn" id="restartDictation">Học lại từ đầu</button></section>';
    bindDictationChrome();document.querySelector('#restartDictation').onclick=()=>startDictation();return;
  }
  const word=words[session.queue[session.position]];
  app.innerHTML=dictationChrome()+`<section class="card dictation-card"><div class="section-head"><span class="pill">Từ ${session.position+1} / ${session.queue.length}</span><span class="sub">Từ vựng giáo trình</span></div><div class="progress"><i style="width:${session.position/session.queue.length*100}%"></i></div><div class="dictation-listen"><button class="listen-word" id="listenWord" aria-label="Nghe từ tiếng Trung">♫</button><h2>Nghe từ và gõ lại</h2><p class="sub">Giọng đọc tự động của thiết bị · Tiếng Trung phổ thông</p><label>Tốc độ <select id="wordRate" aria-label="Tốc độ đọc từ"><option value="0.65">Chậm</option><option value="0.85" selected>Vừa</option><option value="1">Bình thường</option></select></label><p id="speechStatus" role="status" class="sub">Bấm nút nghe để bắt đầu. Cần thiết bị có giọng đọc tiếng Trung.</p></div><form id="dictationForm"><label for="hanziAnswer">Chữ Hán bạn nghe được</label><input id="hanziAnswer" class="hanzi-answer" type="text" lang="zh-CN" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="80" placeholder="Gõ chữ Hán tại đây…" required><div class="toolbar"><button class="btn" type="submit">Kiểm tra</button><button class="btn secondary" type="button" id="revealWord">Xem đáp án</button><button class="btn secondary" type="button" id="nextWord">Bỏ qua →</button></div></form><div id="dictationFeedback" aria-live="polite"></div></section><p class="sub">Bỏ qua khoảng trắng và dấu câu khi chấm. Từ nâng cao sẽ được bổ sung sau khi đối chiếu tài liệu.</p>`;
  bindDictationChrome();
  document.querySelector('#listenWord').onclick=()=>speakWord(word[0]);
  document.querySelector('#wordRate').onchange=stopWordAudio;
  document.querySelector('#dictationForm').onsubmit=e=>{e.preventDefault();if(e.isComposing)return;checkDictation();};
  document.querySelector('#revealWord').onclick=()=>{session.revealed=true;markDictationWrong();showWordFeedback(false,true);};
  document.querySelector('#nextWord').onclick=()=>{if(!session.passed)markDictationWrong();session.position++;session.checked=false;session.revealed=false;session.passed=false;showDictation();};
}
function speakWord(text){
  const status=document.querySelector('#speechStatus');
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){status.textContent='Trình duyệt chưa hỗ trợ đọc từ. Bạn vẫn có thể xem đáp án để học từ.';return;}
  stopWordAudio();const voices=window.speechSynthesis.getVoices();
  const voice=voices.find(v=>/^zh[-_]CN/i.test(v.lang))||voices.find(v=>/^zh/i.test(v.lang));
  if(!voice){status.textContent='Chưa tìm thấy giọng tiếng Trung. Hãy bật hoặc cài giọng tiếng Trung trong thiết bị rồi thử lại. Bạn vẫn có thể dùng “Xem đáp án”.';return;}
  const utterance=new window.SpeechSynthesisUtterance(text.replace(/[…。，]/g,' ').trim());
  utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=Number(document.querySelector('#wordRate').value)||0.85;
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
