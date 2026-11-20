const dictationDefaults={replayKey:'Control',playKey:'Backquote',autoReplay:0,replayDelay:0.5,suggestions:false,shortcutTips:true,showImmediate:true,showFull:false};
const dictationShortcutKeys=['Control','Shift','Alt','Meta','Control+Shift','Control+Alt','Control+Space','Control+KeyB','Backquote','F2','F3','None'];
const dictationReplayDelays=[0.5,1,1.5,2,2.5,3];
let soloDictationKey=null;
function dictationPrefs(){
  const raw=state.dictationPrefs||{},prefs={...dictationDefaults};
  for(const key of ['replayKey','playKey'])if(dictationShortcutKeys.includes(raw[key]))prefs[key]=raw[key];
  if(prefs.replayKey===prefs.playKey&&prefs.replayKey!=='None')prefs.playKey='None';
  for(const key of ['suggestions','shortcutTips','showImmediate','showFull'])if(typeof raw[key]==='boolean')prefs[key]=raw[key];
  const repeats=raw.autoReplay===true?1:raw.autoReplay===false?0:Number(raw.autoReplay);
  if(Number.isInteger(repeats)&&repeats>=0&&repeats<=10)prefs.autoReplay=repeats;
  if(dictationReplayDelays.includes(Number(raw.replayDelay)))prefs.replayDelay=Number(raw.replayDelay);
  return prefs;
}
function keyLabel(key){return {Control:'Ctrl',Alt:'Alt',Shift:'Shift',Meta:'Command','Control+Shift':'Ctrl + Shift','Control+Alt':'Ctrl + Alt','Control+Space':'Ctrl + Space','Control+KeyB':'Ctrl + b',Backquote:'` (backtick)',F2:'F2',F3:'F3',None:'Không dùng'}[key]||key;}
function shortcutOptions(value){return dictationShortcutKeys.map(key=>'<option value="'+key+'"'+(key===value?' selected':'')+'>'+esc(keyLabel(key))+'</option>').join('');}
function dictationSettingsMarkup(){
  const p=dictationPrefs();
  return `<dialog id="dictationSettingsDialog" class="dictation-modal" aria-labelledby="dictationSettingsTitle"><div class="settings-heading"><h2 id="dictationSettingsTitle">⚙ Cài đặt</h2><button type="button" id="closeDictationSettings" aria-label="Đóng cài đặt">×</button></div><div class="settings-body"><div class="settings-table">
  <label for="settingReplayKey">Phím nghe lại</label><select id="settingReplayKey">${shortcutOptions(p.replayKey)}</select>
  <label for="settingPlayKey">Phím phát / tạm dừng</label><select id="settingPlayKey">${shortcutOptions(p.playKey)}</select>
  <label for="settingAutoReplay">Tự động nghe lại</label><select id="settingAutoReplay">${Array.from({length:11},(_,n)=>'<option value="'+n+'"'+(p.autoReplay===n?' selected':'')+'>'+(n===0?'Không':n+' lần')+'</option>').join('')}</select>
  <label for="settingReplayDelay">Khoảng nghỉ giữa các lần nghe</label><select id="settingReplayDelay">${dictationReplayDelays.map(n=>'<option value="'+n+'"'+(p.replayDelay===n?' selected':'')+'>'+n.toFixed(1)+' giây</option>').join('')}</select>
  <label for="settingSuggestions">Gợi ý bàn phím điện thoại</label><select id="settingSuggestions"><option value="false" ${!p.suggestions?'selected':''}>Tắt</option><option value="true" ${p.suggestions?'selected':''}>Bật</option></select>
  <label for="settingShortcutTips">Hiện hướng dẫn phím tắt</label><select id="settingShortcutTips"><option value="true" ${p.shortcutTips?'selected':''}>Hiện</option><option value="false" ${!p.shortcutTips?'selected':''}>Ẩn</option></select>
  </div><p id="settingsValidation" role="status" class="settings-validation"></p><p class="settings-footnote">Tự nghe lại áp dụng cho từ/câu đang luyện sau lượt phát đầu; chọn 3 lần nghĩa là phát đầu rồi nghe lại 3 lần. “Lặp lại” ở tab toàn bộ từ vựng vẫn lặp cả bài. Cài đặt được lưu trên trình duyệt này.</p><p class="settings-footnote">Gợi ý nhập phụ thuộc bàn phím. Phím tắt có thể bị hệ điều hành giữ lại; có thể chọn F2/F3 nếu cần.</p></div></dialog>`;
}
function applyDictationInputPrefs(){
  const input=document.querySelector('#hanziAnswer');if(!input)return;
  const p=dictationPrefs();input.setAttribute('autocomplete',p.suggestions?'on':'off');input.setAttribute('autocorrect',p.suggestions?'on':'off');input.setAttribute('spellcheck',String(p.suggestions));
  const tips=document.querySelector('#shortcutTips');if(tips){tips.hidden=!p.shortcutTips;tips.textContent='Nghe lại: '+keyLabel(p.replayKey)+' · Phát / dừng: '+keyLabel(p.playKey);}
}
function updateDictationPreference(key,value){
  const p=dictationPrefs();p[key]=value;
  if((key==='autoReplay'&&(!Number.isInteger(value)||value<0||value>10))||(key==='replayDelay'&&!dictationReplayDelays.includes(value))||(['replayKey','playKey'].includes(key)&&!dictationShortcutKeys.includes(value)))return false;
  if(p.replayKey===p.playKey&&p.replayKey!=='None'){
    document.querySelector('#settingsValidation').textContent='Hai thao tác cần dùng hai phím khác nhau.';return false;
  }
  state.dictationPrefs=p;save();document.querySelector('#settingsValidation').textContent='';
  applyDictationInputPrefs();return true;
}
function bindDictationSettings(){
  const dialog=document.querySelector('#dictationSettingsDialog');
  document.querySelector('#openDictationSettings').onclick=()=>{stopWordAudio();soloDictationKey=null;dialog.showModal();};
  document.querySelector('#closeDictationSettings').onclick=()=>dialog.close();
  dialog.onclose=()=>{soloDictationKey=null;document.querySelector('#openDictationSettings').focus();};
  dialog.onclick=e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();}};
  for(const [id,key,type] of [['settingReplayKey','replayKey','string'],['settingPlayKey','playKey','string'],['settingAutoReplay','autoReplay','number'],['settingReplayDelay','replayDelay','number'],['settingSuggestions','suggestions','bool'],['settingShortcutTips','shortcutTips','bool']]){
    const control=document.querySelector('#'+id);control.onchange=e=>{const previous=dictationPrefs()[key],value=type==='bool'?e.target.value==='true':type==='number'?Number(e.target.value):e.target.value;
      if(!updateDictationPreference(key,value))control.value=String(previous);if(key==='autoReplay'||key==='replayDelay')stopWordAudio();};
  }
  applyDictationInputPrefs();
}
function dictationShortcutsActive(e){
  if(!dictationSession||dictationSession.tab==='transcript'||state.level!==2||!document.querySelector('#dictationForm'))return false;
  if(document.querySelector('#dictationSettingsDialog')?.open||e.isComposing||dictationSession.composing)return false;
  const target=e.target;if(target&&['SELECT','BUTTON','INPUT'].includes(target.tagName))return false;
  return true;
}
function runDictationShortcut(key){
  const p=dictationPrefs();
  if(key===p.replayKey){speakWord(currentSpeechText());return true;}
  if(key===p.playKey){toggleWordPlayback();return true;}return false;
}
function dictationKeyDown(e){
  if(!dictationShortcutsActive(e)){soloDictationKey=null;return;}
  const modifiers=['Control','Shift','Alt','Meta'];
  const held=[['Control',e.ctrlKey||e.key==='Control'],['Shift',e.shiftKey||e.key==='Shift'],['Alt',e.altKey||e.key==='Alt'],['Meta',e.metaKey||e.key==='Meta']].filter(([,down])=>down).map(([name])=>name);
  const p=dictationPrefs();
  if(modifiers.includes(e.key)){
    const chord=held.join('+');soloDictationKey=(chord===p.replayKey||chord===p.playKey)?chord:null;return;
  }
  soloDictationKey=null;
  let base=e.code==='Backquote'||e.key==='`'?'Backquote':e.code==='Space'||e.key===' '?'Space':e.code==='KeyB'||e.key.toLowerCase()==='b'?'KeyB':e.key;
  const chord=[...held,base].join('+');
  if(chord===p.replayKey||chord===p.playKey){e.preventDefault();if(!e.repeat)runDictationShortcut(chord);}
}
function dictationKeyUp(e){
  if(soloDictationKey&&soloDictationKey.split('+').includes(e.key)&&dictationShortcutsActive(e))runDictationShortcut(soloDictationKey);
  soloDictationKey=null;
}
window.addEventListener('keydown',dictationKeyDown);
window.addEventListener('keyup',dictationKeyUp);
window.addEventListener('blur',()=>{soloDictationKey=null;stopWordAudio();});
window.addEventListener('pagehide',()=>stopWordAudio());
