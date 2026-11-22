// Original teaching examples keyed to the 22 entries in Lesson 1.
// Sources describe grammar/topic references, not a claim of verbatim quotation.
const contextSources={
  book:{label:'Bài 1 giáo trình bạn cung cấp',note:'Câu luyện tập biên soạn theo từ vựng và chủ đề trong Bài 1; không phải bản chép nguyên trang sách.'},
  progress:{label:'ChinGram — 在／正在',url:'https://chingram.upol.cz/grammar/the-progressive-marker-zai-%E5%9C%A8',note:'Câu biên soạn; tham khảo cách diễn tả hành động đang diễn ra.'},
  simultaneous:{label:'ChinGram — 一边…一边…',url:'https://chingram.upol.cz/grammar/structure-with-yibian-yibian-%E4%B8%80%E8%BE%B9-%E4%B8%80%E9%82%8A%E4%B8%80%E8%BE%B9-%E4%B8%80%E9%82%8A-while-at-the-same-time',note:'Câu biên soạn theo mẫu hai hành động diễn ra cùng lúc.'},
  together:{label:'ChinGram — 跟 và 一起',url:'https://chingram.upol.cz/grammar/preposition-gen-%E8%B7%9Fwith',note:'Câu biên soạn; tham khảo mẫu nói về hoạt động cùng người khác.'}
};
const vocabularyContexts=[
  {target:'在',zh:'我在听中文歌。',py:'Wǒ zài tīng Zhōngwén gē.',vi:'Tôi đang nghe bài hát tiếng Trung.',source:'progress'},
  {target:'正',zh:'妈妈正看电视呢。',py:'Māma zhèng kàn diànshì ne.',vi:'Mẹ đang xem ti vi.',source:'progress'},
  {target:'听',zh:'你喜欢听什么歌？',py:'Nǐ xǐhuan tīng shénme gē?',vi:'Bạn thích nghe bài hát gì?',source:'book'},
  {target:'音乐',zh:'我每天晚上听音乐。',py:'Wǒ měitiān wǎnshang tīng yīnyuè.',vi:'Tôi nghe nhạc mỗi tối.',source:'book'},
  {target:'好听',zh:'这首歌很好听。',py:'Zhè shǒu gē hěn hǎotīng.',vi:'Bài hát này rất hay.',source:'book',note:'首 (shǒu): lượng từ dùng cho bài hát, bài thơ.'},
  {target:'一边……一边……',parts:['一边'],zh:'我一边走路，一边听音乐。',py:'Wǒ yìbiān zǒulù, yìbiān tīng yīnyuè.',vi:'Tôi vừa đi bộ vừa nghe nhạc.',source:'simultaneous'},
  {target:'唱歌',zh:'我妹妹喜欢唱歌。',py:'Wǒ mèimei xǐhuan chàng gē.',vi:'Em gái tôi thích hát.',source:'book'},
  {target:'只',zh:'我只想在家听音乐。',py:'Wǒ zhǐ xiǎng zài jiā tīng yīnyuè.',vi:'Tôi chỉ muốn nghe nhạc ở nhà.',source:'book'},
  {target:'常常',zh:'我常常跟朋友一起打球。',py:'Wǒ chángcháng gēn péngyou yìqǐ dǎ qiú.',vi:'Tôi thường chơi bóng cùng bạn bè.',source:'together'},
  {target:'行',zh:'明天一起看电影，行吗？',py:'Míngtiān yìqǐ kàn diànyǐng, xíng ma?',vi:'Ngày mai cùng xem phim, được không?',source:'book'},
  {target:'下次',zh:'我们下次一起唱歌吧。',py:'Wǒmen xià cì yìqǐ chàng gē ba.',vi:'Lần sau chúng ta cùng hát nhé.',source:'together'},
  {target:'平时',zh:'你平时喜欢做什么？',py:'Nǐ píngshí xǐhuan zuò shénme?',vi:'Thường ngày bạn thích làm gì?',source:'book'},
  {target:'打球',zh:'我弟弟喜欢跟朋友打球。',py:'Wǒ dìdi xǐhuan gēn péngyou dǎ qiú.',vi:'Em trai tôi thích chơi bóng cùng bạn bè.',source:'together'},
  {target:'电视',zh:'爸爸每天晚上看电视。',py:'Bàba měitiān wǎnshang kàn diànshì.',vi:'Bố xem ti vi mỗi tối.',source:'book'},
  {target:'跳舞',zh:'她一边唱歌，一边跳舞。',py:'Tā yìbiān chàng gē, yìbiān tiào wǔ.',vi:'Cô ấy vừa hát vừa nhảy.',source:'simultaneous'},
  {target:'街舞',zh:'我姐姐喜欢跳街舞。',py:'Wǒ jiějie xǐhuan tiào jiēwǔ.',vi:'Chị gái tôi thích nhảy đường phố.',source:'book'},
  {target:'别人',zh:'我喜欢看别人跳舞。',py:'Wǒ xǐhuan kàn biérén tiào wǔ.',vi:'Tôi thích xem người khác nhảy.',source:'book'},
  {target:'篮球',zh:'今天下午我们去打篮球。',py:'Jīntiān xiàwǔ wǒmen qù dǎ lánqiú.',vi:'Chiều nay chúng tôi đi chơi bóng rổ.',source:'book'},
  {target:'周末',zh:'这个周末你有时间吗？',py:'Zhè ge zhōumò nǐ yǒu shíjiān ma?',vi:'Cuối tuần này bạn có thời gian không?',source:'book'},
  {target:'一起',zh:'我们一起去看电影吧。',py:'Wǒmen yìqǐ qù kàn diànyǐng ba.',vi:'Chúng ta cùng đi xem phim nhé.',source:'together'},
  {target:'下个',zh:'下个星期我想去打球。',py:'Xià ge xīngqī wǒ xiǎng qù dǎ qiú.',vi:'Tuần sau tôi muốn đi chơi bóng.',source:'book'},
  {target:'正在',zh:'老师正在教我们汉语。',py:'Lǎoshī zhèngzài jiāo wǒmen Hànyǔ.',vi:'Thầy/cô đang dạy chúng tôi tiếng Trung.',source:'progress'}
];
function dictationMode(){return dictationSession?.mode|| (state.dictationMode==='word'?'word':'sentence');}
function dictationMistakes(mode=dictationMode()){
  const list=state[mode==='sentence'?'sentenceDictationWrong':'dictationWrong'];
  return Array.isArray(list)?list.filter(i=>Number.isInteger(i)&&i>=0&&i<words.length):[];
}
function practiceEntry(id){
  if(dictationMode()==='word')return words[id];
  const item=vocabularyContexts[id];return [item.zh,item.py,item.vi,'Từ trọng tâm: '+item.target];
}
function currentSpeechText(){
  const session=dictationSession;
  if(session.tab==='transcript')return vocabularyContexts[session.queue[session.transcriptIndex||0]].zh;
  return practiceEntry(session.queue[session.position])[0];
}
function activeSpeechPosition(){return dictationSession.tab==='transcript'?(dictationSession.transcriptIndex||0):dictationSession.position;}
function highlightContext(item){
  const chunks=item.parts||[item.target];let result='',i=0;
  while(i<item.zh.length){const match=chunks.find(chunk=>item.zh.startsWith(chunk,i));if(match){result+='<mark>'+esc(match)+'</mark>';i+=match.length;}else result+=esc(item.zh[i++]);}
  return result;
}
function contextSourceHtml(item){
  const source=contextSources[item.source];
  return '<details class="context-source"><summary>Nguồn tham khảo & ghi chú</summary><p>'+source.note+'</p>'+(source.url?'<a href="'+source.url+'" target="_blank" rel="noopener noreferrer">'+source.label+' ↗</a>':'<span>'+source.label+'</span>')+(item.note?'<p>'+item.note+'</p>':'')+'</details>';
}
function contextCurrentHtml(item,translation){return `<p class="context-hanzi" lang="zh-CN">${highlightContext(item)}</p>${['pinyin','both'].includes(translation)?'<p class="context-pinyin">'+item.py+'</p>':''}${['vi','both'].includes(translation)?'<p class="context-meaning">'+item.vi+'</p>':''}<p class="context-focus">Từ trọng tâm: <strong lang="zh-CN">${item.target}</strong></p>`;}
function contextTranscriptHtml(){
  const s=dictationSession,index=s.transcriptIndex||0,item=vocabularyContexts[s.queue[index]],translation=s.translation||'none';
  return `<div class="context-controls"><label for="contextTranslation">Hiển thị</label><select id="contextTranslation"><option value="none" ${translation==='none'?'selected':''}>Chỉ chữ Hán</option><option value="pinyin" ${translation==='pinyin'?'selected':''}>Chữ Hán + pinyin</option><option value="vi" ${translation==='vi'?'selected':''}>Chữ Hán + tiếng Việt</option><option value="both" ${translation==='both'?'selected':''}>Chữ Hán + pinyin + tiếng Việt</option></select><label class="context-repeat"><input id="contextRepeat" type="checkbox" ${s.transcriptRepeat?'checked':''}> Lặp lại</label></div>
  <div class="context-grid"><div class="context-left"><section class="context-sentence-card"><div class="dictation-player"><div class="speech-player"><button id="listenWord" aria-label="Nghe toàn bộ bài">▶</button><span>Nghe toàn bộ</span><span class="speech-player-line" aria-hidden="true"></span></div><select id="wordRate" aria-label="Tốc độ đọc câu">${vocabularySpeechRateOptions()}</select></div><p id="speechStatus" role="status" class="speech-status">Bấm ▶ để nghe toàn bộ ${s.queue.length} câu từ đầu. Lặp lại sẽ phát lại toàn bộ bài.</p><div class="context-current">${contextCurrentHtml(item,translation)}</div></section><div class="context-navigation"><button id="contextPrev" aria-label="Câu trước" ${index===0?'disabled':''}>←</button><span id="contextCounter">${index+1} / ${s.queue.length}</span><button id="contextNext" aria-label="Câu sau" ${index===s.queue.length-1?'disabled':''}>→</button></div><button class="context-practice-button" id="practiceContextSentence">Luyện gõ câu này →</button><div id="contextSourceSlot">${contextSourceHtml(item)}</div></div>
  <div class="context-right"><div class="context-sentence-list" aria-label="Danh sách câu tiếng Trung">${s.queue.map((id,i)=>{const entry=vocabularyContexts[id];return '<div id="contextRow-'+i+'" class="context-row '+(i===index?'selected':'')+'"><button class="context-row-play" data-context-play="'+i+'" aria-label="Nghe câu '+(i+1)+'">▷</button><button class="context-row-text" data-context-select="'+i+'" '+(i===index?'aria-current="true"':'')+' lang="zh-CN">'+entry.zh+'</button></div>';}).join('')}</div><div class="context-pagination"><button id="contextPagePrev" aria-label="Trang câu trước">←</button><span>Danh sách <span id="contextPageCount"></span></span><button id="contextPageNext" aria-label="Trang câu tiếp">→</button></div><label class="context-auto-scroll"><input type="checkbox" id="contextAutoScroll" ${s.contextAutoScroll!==false?'checked':''}> Theo câu đang nghe</label></div></div><p class="context-editorial">${words.length} câu luyện tập biên soạn cho từ vựng Bài ${state.lesson||'1'}. Nguồn tham khảo dùng để đối chiếu chủ đề và cấu trúc; không phải trích nguyên văn tất cả câu. Từ được đánh dấu là từ trọng tâm.</p>`;
}
function selectContextSentence(index,play=false){
  const session=dictationSession;stopWordAudio();session.transcriptIndex=Math.max(0,Math.min(index,session.queue.length-1));showDictation();
  if(session.contextAutoScroll!==false)renderContextPage(Math.floor(session.transcriptIndex/contextPageSize()));
  if(play)speakWord(currentSpeechText());
}
function bindContextTranscript(){
  const s=dictationSession,index=s.transcriptIndex||0;bindContextPagination();
  document.querySelector('#contextTranslation').onchange=e=>{s.translation=e.target.value;updateContextSentence();};
  document.querySelector('#contextRepeat').onchange=e=>{s.transcriptRepeat=e.target.checked;if(!e.target.checked&&(contextPlaylistTimer!==null||contextPlayback?.waiting)){cancelContextPlayback();document.querySelector('#listenWord').textContent='▶';document.querySelector('#speechStatus').textContent='Đã nghe xong toàn bộ bài. Lặp lại đã tắt.';}};
  document.querySelector('#contextAutoScroll').onchange=e=>{s.contextAutoScroll=e.target.checked;};
  document.querySelector('#listenWord').onclick=toggleTranscriptPlayback;
  bindVocabularySpeechRate();
  document.querySelector('#contextPrev').onclick=()=>{if((s.transcriptIndex||0)>0)selectContextSentence(s.transcriptIndex-1);};
  document.querySelector('#contextNext').onclick=()=>{if((s.transcriptIndex||0)<s.queue.length-1)selectContextSentence((s.transcriptIndex||0)+1);};
  document.querySelectorAll('[data-context-select]').forEach(button=>button.onclick=()=>selectContextSentence(Number(button.dataset.contextSelect)));
  document.querySelectorAll('[data-context-play]').forEach(button=>button.onclick=()=>selectContextSentence(Number(button.dataset.contextPlay),true));
  document.querySelector('#practiceContextSentence').onclick=()=>{const id=s.queue[s.transcriptIndex||0];startDictation(false,'sentence');dictationSession.position=id;showDictation();};
}
