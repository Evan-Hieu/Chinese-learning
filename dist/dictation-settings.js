const dictationDefaults={replayKey:'Control',playKey:'Backquote',autoReplay:false,replayDelay:0.5,suggestions:false,shortcutTips:true,showImmediate:true,showFull:false};
let soloDictationKey=null;
function dictationPrefs(){
  const raw=state.dictationPrefs||{},prefs={...dictationDefaults};
  const keys=['Control','Alt','Shift','Backquote','F2','F3','None'];
  for(const key of ['replayKey','playKey'])if(keys.includes(raw[key]))prefs[key]=raw[key];
  if(prefs.replayKey===prefs.playKey&&prefs.replayKey!=='None')prefs.playKey='None';
  for(const key of ['autoReplay','suggestions','shortcutTips','showImmediate','showFull'])if(typeof raw[key]==='boolean')prefs[key]=raw[key];
  if([0.5,1,2,3,5].includes(Number(raw.replayDelay)))prefs.replayDelay=Number(raw.replayDelay);
  return prefs;
}
function keyLabel(key){return {Control:'Ctrl',Alt:'Alt',Shift:'Shift',Backquote:'` (dấu huyền)',F2:'F2',F3:'F3',None:'Không dùng'}[key]||key;}
function shortcutOptions(value){return ['Control','Alt','Shift','Backquote','F2','F3','None'].map(key=>'<option value="'+key+'"'+(key===value?' selected':'')+'>'+esc(keyLabel(key))+'</option>').join('');}
function dictationSettingsMarkup(){
  const p=dictationPrefs();
  return `<dialog id="dictationSettingsDialog" class="dictation-modal" aria-labelledby="dictationSettingsTitle"><div class="settings-heading"><h2 id="dictationSettingsTitle">⚙ Cài đặt</h2><button type="button" id="closeDictationSettings" aria-label="Đóng cài đặt">×</button></div><div class="settings-body"><div class="settings-table">
  <label for="settingReplayKey">Phím nghe lại</label><select id="settingReplayKey">${shortcutOptions(p.replayKey)}</select>
  <label for="settingPlayKey">Phím phát / tạm dừng</label><select id="settingPlayKey">${shortcutOptions(p.playKey)}</select>
  <label for="settingAutoReplay">Tự động nghe lại</label><select id="settingAutoReplay"><option value="false" ${!p.autoReplay?'selected':''}>Không</option><option value="true" ${p.autoReplay?'selected':''}>Có</option></select>
  <label for="settingReplayDelay">Khoảng nghỉ giữa các lần nghe</label><select id="settingReplayDelay">${[0.5,1,2,3,5].map(n=>'<option value="'+n+'"'+(p.replayDelay===n?' selected':'')+'>'+n+' giây</option>').join('')}</select>
  <label for="settingSuggestions">Gợi ý bàn phím điện thoại</label><select id="settingSuggestions"><option value="false" ${!p.suggestions?'selected':''}>Tắt</option><option value="true" ${p.suggestions?'selected':''}>Bật</option></select>
  <label for="settingShortcutTips">Hiện hướng dẫn phím tắt</label><select id="settingShortcutTips"><option value="true" ${p.shortcutTips?'selected':''}>Hiện</option><option value="false" ${!p.shortcutTips?'selected':''}>Ẩn</option></select>
  <label for="wordVolume">Âm lượng</label><input id="wordVolume" type="range" min="0" max="1" step="0.1" value="${dictationSession.volume||'1'}" aria-label="Âm lượng">
  </div><p id="settingsValidation" role="status" class="settings-validation"></p><p class="settings-footnote">Được lưu trên trình duyệt này. Tự nghe lại chỉ bắt đầu sau khi bấm phát. Gợi ý nhập còn phụ thuộc bàn phím và thiết bị.</p></div></dialog>`;
}
function applyDictationInputPrefs(){
  const input=document.querySelector('#hanziAnswer');if(!input)return;
  const p=dictationPrefs();input.setAttribute('autocomplete',p.suggestions?'on':'off');input.setAttribute('autocorrect',p.suggestions?'on':'off');input.setAttribute('spellcheck',String(p.suggestions));
  const tips=document.querySelector('#shortcutTips');if(tips){tips.hidden=!p.shortcutTips;tips.textContent='Nghe lại: '+keyLabel(p.replayKey)+' · Phát / tạm dừng: '+keyLabel(p.playKey)+'. Phím tắt tạm ngưng khi đang chọn chữ bằng bộ gõ.';}
}
function updateDictationPreference(key,value){
  const p=dictationPrefs();p[key]=value;
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
  for(const [id,key,type] of [['settingReplayKey','replayKey','string'],['settingPlayKey','playKey','string'],['settingAutoReplay','autoReplay','bool'],['settingReplayDelay','replayDelay','number'],['settingSuggestions','suggestions','bool'],['settingShortcutTips','shortcutTips','bool']]){
    const control=document.querySelector('#'+id);control.onchange=e=>{const previous=dictationPrefs()[key],value=type==='bool'?e.target.value==='true':type==='number'?Number(e.target.value):e.target.value;
      if(!updateDictationPreference(key,value))control.value=String(previous);if(key==='autoReplay'||key==='replayDelay')stopWordAudio();};
  }
  document.querySelector('#wordVolume').oninput=e=>{dictationSession.volume=e.target.value;};
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
  if(['Control','Alt','Shift'].includes(e.key)){soloDictationKey=e.key;return;}
  soloDictationKey=null;
  if(e.repeat||e.ctrlKey||e.altKey||e.metaKey)return;
  const key=e.code==='Backquote'?'Backquote':e.key,p=dictationPrefs();
  if(key===p.replayKey||key===p.playKey){e.preventDefault();runDictationShortcut(key);}
}
function dictationKeyUp(e){
  if(soloDictationKey===e.key&&dictationShortcutsActive(e))runDictationShortcut(e.key);
  soloDictationKey=null;
}
window.addEventListener('keydown',dictationKeyDown);
window.addEventListener('keyup',dictationKeyUp);
window.addEventListener('blur',()=>{soloDictationKey=null;stopWordAudio();});
window.addEventListener('pagehide',()=>stopWordAudio());
