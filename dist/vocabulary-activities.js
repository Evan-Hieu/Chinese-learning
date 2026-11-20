// Shared activity selector keeps every vocabulary exercise in the same workspace.
const vocabularyListPage=pages.words;
pages.words=()=>startDictation(false,'sentence');
const baseDictationChrome=dictationChrome;
dictationChrome=function(){
  return baseDictationChrome().replace('<option value="word"', '<option value="flash">Flashcard</option><option value="match">Game ghép từ</option><option value="word"');
};
function selectVocabularyActivity(value){
  stopWordAudio();
  if(value==='flash'){idx=0;flip=false;showVocabularyFlash();}
  else if(value==='match')startWordMatch();
  else startDictation(false,value);
}
function activityChrome(value){
  return dictationChrome().replace('value="sentence" selected','value="sentence"').replace('value="word" selected','value="word"').replace('value="'+value+'"','value="'+value+'" selected');
}
function bindActivityChrome(){
  document.querySelector('#backWords').onclick=()=>{stopWordAudio();vocabularyListPage();};
  document.querySelector('#reviewWrong').onclick=()=>startDictation(true);
  document.querySelector('#practiceMode').onchange=e=>selectVocabularyActivity(e.target.value);
}
function showVocabularyFlash(){
  stopWordAudio();app.dataset.vocabView='activity';const w=words[idx],context=vocabularyContexts[idx];
  app.innerHTML=activityChrome('flash')+`<section class="vocabulary-activity"><div class="activity-top"><strong>Flashcard · Thẻ ${idx+1} / ${words.length}</strong><button class="text-button" id="listenWord">▶ Nghe từ</button></div><button class="activity-flash" id="activityFlip" aria-label="Lật thẻ" aria-pressed="${flip}"><span class="han" lang="zh-CN">${esc(w[0])}</span>${flip?'<span class="pinyin">'+esc(w[1])+'</span><strong>'+esc(w[2])+'</strong><span lang="zh-CN">'+esc(context.zh)+'</span><small>'+esc(context.vi)+'</small>':'<span class="sub">Chạm để xem nghĩa và câu ví dụ ↻</span>'}</button><div class="activity-buttons"><button class="btn secondary" id="prev">← Trước</button><button class="btn" id="remember">${state.known.includes(idx)?'✓ Đã nhớ':'Mình đã nhớ'}</button><button class="btn secondary" id="next">Tiếp →</button></div><p id="speechStatus" role="status" class="speech-status"></p></section>`;
  bindActivityChrome();
  document.querySelector('#activityFlip').onclick=()=>{flip=!flip;showVocabularyFlash();};
  document.querySelector('#prev').onclick=()=>{idx=(idx+words.length-1)%words.length;flip=false;showVocabularyFlash();};
  document.querySelector('#next').onclick=()=>{idx=(idx+1)%words.length;flip=false;showVocabularyFlash();};
  document.querySelector('#remember').onclick=()=>{if(!state.known.includes(idx))state.known.push(idx);save();showVocabularyFlash();};
  document.querySelector('#listenWord').onclick=()=>speakWord(w[0],{repeatsRemaining:0});
}
let wordMatch=null;
function shuffled(items){return [...items].sort(()=>Math.random()-.5);}
function startWordMatch(){
  stopWordAudio();wordMatch={order:shuffled(words.map((_,i)=>i)),round:0,matches:0,attempts:0,selected:null,solved:[],feedback:''};showWordMatch();
}
function matchRoundIds(){return wordMatch.order.slice(wordMatch.round*4,wordMatch.round*4+4);}
function showWordMatch(){
  stopWordAudio();app.dataset.vocabView='activity';const game=wordMatch,ids=matchRoundIds();
  if(!ids.length){
    state.matchBest=Math.max(state.matchBest||0,Math.round(game.matches/game.attempts*100));save();
    app.innerHTML=activityChrome('match')+`<section class="vocabulary-activity match-complete"><h2>✦ Hoàn thành ghép từ!</h2><p>Ghép đúng ${game.matches} / ${words.length} từ · ${game.attempts} lượt thử</p><p>Độ chính xác: ${Math.round(game.matches/game.attempts*100)}% · Kỷ lục: ${state.matchBest}%</p><button class="btn" id="matchRestart">Chơi lại ↻</button></section>`;
    bindActivityChrome();document.querySelector('#matchRestart').onclick=startWordMatch;return;
  }
  if(!game.right||game.rightRound!==game.round){game.right=shuffled(ids);game.rightRound=game.round;}
  const complete=game.solved.length===ids.length;
  app.innerHTML=activityChrome('match')+`<section class="vocabulary-activity"><div class="activity-top"><strong>Game ghép từ · Vòng ${game.round+1} / ${Math.ceil(words.length/4)}</strong><span>Đã ghép ${game.matches} / ${words.length} · ${game.attempts} lượt thử</span></div><p class="match-instruction">Chọn một từ tiếng Trung, rồi chọn nghĩa tiếng Việt tương ứng.</p><div class="match-board"><div aria-label="Từ tiếng Trung">${ids.map(id=>'<button class="match-tile '+(game.selected===id?'selected':'')+'" data-match-word="'+id+'" '+(game.solved.includes(id)?'disabled':'')+' aria-pressed="'+(game.selected===id)+'" lang="zh-CN">'+esc(words[id][0])+(game.solved.includes(id)?' ✓':'')+'</button>').join('')}</div><div aria-label="Nghĩa tiếng Việt">${game.right.map(id=>'<button class="match-tile" data-match-meaning="'+id+'" '+(game.solved.includes(id)?'disabled':'')+'>'+esc(words[id][2])+(game.solved.includes(id)?' ✓':'')+'</button>').join('')}</div></div><p class="match-feedback" role="status">${esc(game.feedback||'Sẵn sàng? Bắt đầu ghép nhé!')}</p><div class="activity-buttons"><button class="btn secondary" id="matchRestart">Chơi lại ↻</button>${complete?'<button class="btn" id="matchNext">'+(game.matches===words.length?'Xem kết quả':'Vòng tiếp theo →')+'</button>':''}</div></section>`;
  bindActivityChrome();
  document.querySelectorAll('[data-match-word]').forEach(button=>button.onclick=()=>selectMatchWord(Number(button.dataset.matchWord)));
  document.querySelectorAll('[data-match-meaning]').forEach(button=>button.onclick=()=>chooseMatchMeaning(Number(button.dataset.matchMeaning)));
  document.querySelector('#matchRestart').onclick=startWordMatch;
  if(complete)document.querySelector('#matchNext').onclick=()=>{game.round++;game.solved=[];game.selected=null;game.feedback='';showWordMatch();};
}
function selectMatchWord(id){if(!matchRoundIds().includes(id)||wordMatch.solved.includes(id))return;wordMatch.selected=id;wordMatch.feedback='Chọn nghĩa tương ứng ở cột bên phải.';showWordMatch();}
function chooseMatchMeaning(id){
  const game=wordMatch;
  if(!matchRoundIds().includes(id)||game.solved.includes(id))return;
  if(game.selected===null){game.feedback='Hãy chọn một từ tiếng Trung trước.';showWordMatch();return;}
  game.attempts++;
  if(words[id][2]===words[game.selected][2]){
    const selected=game.selected;
    game.right=game.right.map(item=>item===id?selected:item===selected?id:item);
    game.solved.push(selected);game.matches++;game.selected=null;game.feedback='✓ Chính xác! '+words[selected][0]+' — '+words[id][2];
  }
  else game.feedback='Chưa đúng, thử chọn nghĩa khác nhé.';
  showWordMatch();
}
// Preserve the searchable word list as a secondary view.
const baseBindDictationChrome=bindDictationChrome;
bindDictationChrome=function(){baseBindDictationChrome();document.querySelector('#backWords').onclick=()=>{stopWordAudio();vocabularyListPage();};};
if(location.hash==='#words'&&state.level===2)pages.words();
