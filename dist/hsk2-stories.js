// Pilot: original connected dialogue, target vocabulary from the user's HSK2 tab.
let hsk2Story={id:'birthday-phone-v1',section:'people',speakers:['Tiểu An','Tiểu Minh'],title:'Chiếc điện thoại để quên',subtitle:'Hẹn đi mua quà sinh nhật',source:'https://docs.google.com/spreadsheets/d/1IfhJNwdSUCpranQc6i8jNHeZnaLL4UE-_w9y-Tp5y9c/edit#gid=1408847024',
 vocabulary:[['姐姐','jiějie','chị gái'],['生日','shēngrì','sinh nhật'],['一起','yìqǐ','cùng nhau'],['吧','ba','nhé'],['已经','yǐjīng','đã'],['准备','zhǔnbèi','chuẩn bị'],['公司','gōngsī','công ty'],['门','mén','cửa'],['外','wài','bên ngoài'],['等','děng','đợi'],['到','dào','đến / đạt tới'],['离','lí','cách'],['远','yuǎn','xa'],['公共汽车','gōnggòng qìchē','xe buýt'],['找','zhǎo','tìm'],['手机','shǒujī','điện thoại di động'],['颜色','yánsè','màu sắc'],['黑','hēi','đen'],['可以','kěyǐ','có thể'],['给','gěi','cho'],['别','bié','đừng'],['就','jiù','ngay / chính là'],['旁边','pángbiān','bên cạnh'],['对','duì','đúng'],['帮助','bāngzhù','sự giúp đỡ'],['走','zǒu','đi'],['完','wán','xong'],['再','zài','rồi / lại'],['咖啡','kāfēi','cà phê'],['希望','xīwàng','hy vọng']],
 lines:[
 ['A','Lên kế hoạch','明天是姐姐的生日，我们一起去买东西吧。','Míngtiān shì jiějie de shēngrì, wǒmen yìqǐ qù mǎi dōngxi ba.','Ngày mai là sinh nhật chị gái, chúng ta cùng đi mua đồ nhé.',['姐姐','生日','一起','吧']],
 ['B','Lên kế hoạch','好，我已经准备好了。','Hǎo, wǒ yǐjīng zhǔnbèi hǎo le.','Được, mình đã chuẩn bị xong rồi.',['已经','准备']],
 ['A','Hẹn trước cửa công ty','我在公司门外等你。','Wǒ zài gōngsī mén wài děng nǐ.','Mình đợi bạn ở ngoài cửa công ty.',['公司','门','外','等']],
 ['B','Hẹn trước cửa công ty','我到了，这里离商店远吗？','Wǒ dào le, zhèlǐ lí shāngdiàn yuǎn ma?','Mình đến rồi, từ đây đến cửa hàng có xa không?',['到','离','远']],
 ['A','Hẹn trước cửa công ty','不远，我们坐公共汽车去。','Bù yuǎn, wǒmen zuò gōnggòng qìchē qù.','Không xa, chúng ta đi xe buýt nhé.',['远','公共汽车']],
 ['B','Phát hiện quên điện thoại','等一下，我找不到手机了。','Děng yíxià, wǒ zhǎo bu dào shǒujī le.','Đợi chút, mình không tìm thấy điện thoại rồi.',['等','找','到','手机']],
 ['A','Tìm chiếc điện thoại','你的手机是什么颜色的？','Nǐ de shǒujī shì shénme yánsè de?','Điện thoại của bạn màu gì?',['手机','颜色']],
 ['B','Tìm chiếc điện thoại','黑色的，你可以给我打电话吗？','Hēisè de, nǐ kěyǐ gěi wǒ dǎ diànhuà ma?','Màu đen, bạn có thể gọi điện cho mình không?',['黑','可以','给']],
 ['A','Gọi điện để tìm máy','可以，别着急，我现在就打。','Kěyǐ, bié zháojí, wǒ xiànzài jiù dǎ.','Được, đừng lo, mình gọi ngay bây giờ.',['可以','别','就'],['着急 · zháojí · lo lắng, sốt ruột (từ hỗ trợ câu chuyện)']],
 ['B','Nghe thấy tiếng chuông','我听到了！手机在椅子旁边。','Wǒ tīng dào le! Shǒujī zài yǐzi pángbiān.','Mình nghe thấy rồi! Điện thoại ở cạnh chiếc ghế.',['到','手机','旁边']],
 ['A','Tìm thấy rồi','对，就是你的手机！','Duì, jiù shì nǐ de shǒujī!','Đúng rồi, chính là điện thoại của bạn!',['对','就','手机']],
 ['B','Cùng lên đường','谢谢你的帮助，现在可以走了。','Xièxie nǐ de bāngzhù, xiànzài kěyǐ zǒu le.','Cảm ơn bạn đã giúp, bây giờ đi được rồi.',['帮助','可以','走']],
 ['A','Tiếp tục kế hoạch','我们买完东西，再去喝咖啡吧。','Wǒmen mǎi wán dōngxi, zài qù hē kāfēi ba.','Chúng ta mua đồ xong rồi đi uống cà phê nhé.',['完','再','咖啡','吧']],
 ['B','Một kết thúc vui','好，希望姐姐喜欢我们的礼物。','Hǎo, xīwàng jiějie xǐhuan wǒmen de lǐwù.','Được, hy vọng chị thích món quà của chúng ta.',['希望','姐姐'],['礼物 · lǐwù · quà tặng (từ hỗ trợ câu chuyện)']]
 ]};
const hsk2Stories=[hsk2Story,...additionalHsk2Stories];
const hsk2VocabularyMap=new Map(hsk2SourceVocabulary.map(w=>[w[0],w]));
for(const story of hsk2Stories){story.source=hsk2Stories[0].source;story.vocabulary=[...new Set(story.lines.flatMap(line=>line[5]))].map(term=>hsk2VocabularyMap.get(term));}
let storyLexicon=new Map(hsk2Story.vocabulary.map(w=>[w[0],w]));
function storyProgress(id=hsk2Story.id){const p=state.hsk2Stories?.[id]||(state.hsk2StoryProgress?.id===id?state.hsk2StoryProgress:null);return p?.id===id?p:{id,position:0,records:{}};}
function selectHsk2Story(id,resume=true){const story=hsk2Stories.find(item=>item.id===id);if(!story)return;stopWordAudio();hsk2Story=story;storyLexicon=new Map(story.vocabulary.map(w=>[w[0],w]));startStory(resume);}
let storySession=null;
function saveStoryProgress(){if(!storySession)return;state.hsk2Stories=state.hsk2Stories||{};state.hsk2Stories[hsk2Story.id]={id:hsk2Story.id,position:storySession.position,records:storySession.records};save();}
function storyIsActive(){return dictationSession?.mode==='story'&&location.hash==='#stories';}
function storySpeak(){speakWord(hsk2Story.lines[storySession.position][2],{repeatsRemaining:0});}
function startStory(resume=true){
 stopWordAudio();const p=resume?storyProgress():{position:0,records:{}};
 storySession={position:Math.max(0,Math.min(p.position,hsk2Story.lines.length)),records:{...p.records},tab:'practice',mode:'story',queue:hsk2Story.lines.map((_,i)=>i),rate:'0.85',volume:'1',composing:false};dictationSession=storySession;
 showStory();if(storySession.position<hsk2Story.lines.length)storySpeak();
}
function storyCapture(){if(!storySession||storySession.position>=hsk2Story.lines.length)return;const old=storySession.records[storySession.position]||{},draft=document.querySelector('#hanziAnswer').value;storySession.records[storySession.position]={...old,draft,correct:old.draft===draft?!!old.correct:false};saveStoryProgress();}
function moveStory(direction){
 storyCapture();stopWordAudio();storySession.position=Math.max(0,Math.min(hsk2Story.lines.length,storySession.position+direction));saveStoryProgress();showStory();
 if(storySession.position<hsk2Story.lines.length){document.querySelector('#hanziAnswer').focus();storySpeak();}
}
function storyWordsHtml(line){return line[5].map(term=>{const w=storyLexicon.get(term);return '<div class="story-vocab"><b lang="zh-CN">'+esc(w[0])+'</b><span>'+esc(w[1])+'</span><small>'+esc(w[2])+'</small></div>';}).join('');}
function showStory(){
 stopWordAudio();app.dataset.vocabView='story';const s=storySession,total=hsk2Story.lines.length;
 if(s.position>=total){app.innerHTML='<section class="story-finish"><span class="story-kicker">HSK2 · HOÀN THÀNH HỘI THOẠI</span><h1>Hoàn thành hội thoại!</h1><p>Đã đi qua '+total+' câu · '+hsk2Story.vocabulary.length+' từ HSK2 trong một câu chuyện.</p><p>'+Object.values(s.records).filter(r=>r.correct).length+' câu đã gõ đúng · Có thể học lại để ôn các từ.</p><button class="btn" id="storyRestart">Học lại câu chuyện</button><button class="btn secondary" id="storyHome">Về danh sách hội thoại</button></section>';document.querySelector('#storyRestart').onclick=()=>startStory(false);document.querySelector('#storyHome').onclick=pages.stories;saveStoryProgress();return;}
 const line=hsk2Story.lines[s.position],record=s.records[s.position]||{};s.passed=!!record.correct;s.revealed=!!record.revealed;
 app.innerHTML=`<div class="story-heading"><div><span class="story-kicker">TỪ VỰNG NÂNG CAO · HSK2</span><h1>${hsk2Story.title}</h1></div><button class="text-button" id="storyHome">← Danh sách bài</button></div><div class="story-scene"><span class="story-speaker">${line[0]+' · '+esc(hsk2Story.speakers[line[0]==='A'?0:1])}</span><span>${esc(line[1])}</span><strong>Câu ${s.position+1} / ${total}</strong></div><section class="story-workspace"><div class="story-vocab-heading"><b>Từ cần học trong câu này</b><small>Chữ Hán · Pinyin · Nghĩa</small></div><div class="story-vocab-row">${storyWordsHtml(line)}</div>${line[6]?'<p class="story-support">'+line[6].map(esc).join(' · ')+'</p>':''}<div class="story-player"><button class="btn" id="listenWord" aria-label="Nghe câu hội thoại">▶ Nghe câu</button><select id="wordRate" aria-label="Tốc độ đọc"><option value="0.65">0.65×</option><option value="0.85" selected>0.85×</option><option value="1">1×</option></select><button class="text-button" id="openDictationSettings">⚙ Cài đặt</button></div><p id="speechStatus" role="status" class="speech-status">Bấm nghe câu. Giọng đọc phụ thuộc giọng tiếng Trung trên thiết bị.</p><form id="dictationForm"><label for="hanziAnswer" class="sr-only">Câu hội thoại bạn nghe được</label><textarea id="hanziAnswer" class="hanzi-answer" lang="zh-CN" maxlength="160" placeholder="Nghe và gõ câu tiếng Trung…" rows="2"></textarea><div class="story-answer-actions"><button class="btn" type="submit">Kiểm tra ↵</button><button class="btn secondary" id="storyReveal" type="button">Xem câu</button></div></form><div id="storyFeedback" role="status" aria-live="polite"></div><p id="shortcutTips" class="shortcut-tips"></p><div class="story-navigation"><button class="btn secondary" id="storyPrevious" ${s.position===0?'disabled':''}>← Câu trước</button><span>Đúng rồi → Enter để tiếp tục</span><button class="btn secondary" id="storyNext">Bỏ qua →</button></div></section>${dictationSettingsMarkup()}`;
 const input=document.querySelector('#hanziAnswer');input.value=record.draft||'';
 document.querySelector('#storyHome').onclick=()=>{storyCapture();stopWordAudio();pages.stories();};
 document.querySelector('#listenWord').onclick=toggleWordPlayback;
 document.querySelector('#wordRate').value=s.rate;document.querySelector('#wordRate').onchange=e=>{s.rate=e.target.value;stopWordAudio();};
 document.querySelector('#dictationForm').onsubmit=e=>{e.preventDefault();if(!s.composing&&!e.isComposing)checkStory();};
 input.oncompositionstart=()=>{s.composing=true;};input.oncompositionend=()=>{s.composing=false;};input.oninput=()=>{s.passed=false;storyCapture();};
 input.onkeydown=e=>{if(e.key!=='Enter'||e.shiftKey||e.ctrlKey||e.altKey||e.metaKey||e.isComposing||s.composing||e.keyCode===229)return;e.preventDefault();if(e.repeat)return;if(s.passed&&compareHanzi(input.value,line[2]).correct)moveStory(1);else checkStory();};
 document.querySelector('#storyReveal').onclick=()=>{storyCapture();s.revealed=true;s.records[s.position].revealed=true;saveStoryProgress();renderStoryFeedback(true);};
 document.querySelector('#storyPrevious').onclick=()=>moveStory(-1);document.querySelector('#storyNext').onclick=()=>moveStory(1);
 bindDictationSettings();if(record.checked||record.revealed)renderStoryFeedback(!!record.revealed);
}
function checkStory(){stopWordAudio();const input=document.querySelector('#hanziAnswer');if(!normalizeHanzi(input.value)){document.querySelector('#storyFeedback').textContent='Hãy nhập câu bạn nghe được trước nhé.';return;}storyCapture();const r=storySession.records[storySession.position];r.checked=true;r.correct=compareHanzi(input.value,hsk2Story.lines[storySession.position][2]).correct;storySession.passed=r.correct;saveStoryProgress();renderStoryFeedback(false);}
function renderStoryFeedback(reveal){
 const s=storySession,line=hsk2Story.lines[s.position],r=s.records[s.position]||{},p=dictationPrefs(),full=reveal||r.correct||p.showFull,parts=compareHanzi(r.draft||'',line[2]).parts;
 document.querySelector('#storyFeedback').innerHTML='<div class="story-feedback-heading">'+(r.correct?'✓ Chính xác · Enter để sang câu tiếp theo':reveal?'Câu tham khảo':'Chưa chính xác · thử nghe lại nhé')+'</div><div class="masked-answer" lang="zh-CN">'+(full?esc(line[2]):maskedWordFeedback(parts,p.showImmediate))+'</div>'+(full?'<details class="story-translation"><summary>Xem pinyin và nghĩa</summary><p class="story-answer-detail">'+esc(line[3])+'<br>'+esc(line[4])+'</p></details>':'')+'<div class="story-hint-options"><label><input type="checkbox" id="storyHint" '+(p.showImmediate?'checked':'')+'> Gợi ý từ tiếp theo</label><label><input type="checkbox" id="storyFull" '+(p.showFull?'checked':'')+'> Hiện cả câu</label></div>';
 document.querySelector('#storyHint').onchange=e=>{updateDictationPreference('showImmediate',e.target.checked);renderStoryFeedback(reveal);};document.querySelector('#storyFull').onchange=e=>{updateDictationPreference('showFull',e.target.checked);renderStoryFeedback(reveal);};
 document.querySelector('#storyNext').textContent=r.correct?'Câu tiếp theo →':'Bỏ qua →';
}
pages.stories=function(){renderHsk2Catalog();};
const baseCurrentSpeechText=currentSpeechText;
currentSpeechText=function(){return storyIsActive()?hsk2Story.lines[storySession.position][2]:baseCurrentSpeechText();};
sections.splice(2,0,['stories','◌','Từ vựng nâng cao']);
const homeBeforeAdvanced=pages.home;
pages.home=function(){
 homeBeforeAdvanced();
 app.innerHTML=app.innerHTML.replace('<section class="hero">','<a class="advanced-home-entry" href="#stories"><span>◌ KHO HỌC RIÊNG · HSK2</span><strong>Từ vựng nâng cao qua hội thoại</strong><small>Nghe & gõ từng câu · Từ mới hiện phía trên · Khám phá 12 hội thoại →</small></a><section class="hero">');
};
// The first navigation was rendered before this script registered the new section.
// Refresh every initial route so the menu is present on the plain homepage too.
render();
