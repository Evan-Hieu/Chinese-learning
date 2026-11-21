const textPracticePage=pages.practice;
const activityPictures=[
 {box:[80,48,109,103],action:'打球',subject:'他',vi:'Một người đang chơi bóng'},
 {box:[326,48,77,103],action:'跳舞',subject:'她',vi:'Một người đang múa'},
 {box:[78,258,118,84],action:'看电视',subject:'他们',vi:'Nhóm người trước màn hình ti vi'},
 {box:[304,258,118,84],action:'听音乐',subject:'她',vi:'Một người đeo tai nghe'},
 {box:[78,447,118,83],action:'吃饭',subject:'她',vi:'Một người đang ăn'}
];
const simultaneousPictures=[
 {box:[84,199,117,85],actions:['走路','听音乐'],vi:'Người vừa đi đường vừa nghe nhạc'},
 {box:[305,199,119,85],actions:['唱歌','跳舞'],vi:'Người đang biểu diễn với các nốt nhạc'},
 {box:[84,336,118,85],actions:['看书','喝茶'],vi:'Người vừa đọc sách vừa uống đồ uống'}
];
let pictureMode='identify',pictureIndex=0;
function pictureKey(){return pictureMode+':'+pictureIndex;}
function pictureImage(item,simultaneous){
 const [x,y,w,h]=item.box,source=simultaneous?'activities-page6.png':'activities-page5.png';
 // A viewport shows the illustration in the original page without changing it.
 return `<svg class="exercise-picture" viewBox="${x} ${y} ${w} ${h}" role="img" aria-label="${esc(item.vi)}"><image href="images/lesson1/${source}" width="${simultaneous?567:551}" height="${simultaneous?710:643}"/></svg>`;
}
function showPicturePractice(){
 stopWordAudio();const simultaneous=pictureMode==='simultaneous',items=simultaneous?simultaneousPictures:activityPictures,item=items[pictureIndex];
 const records=state.picturePractice||{},record=records[pictureKey()]||{};
 const options=activityPictures.map(p=>p.action);
 app.innerHTML=`<div class="picture-heading"><div class="eyebrow">HSK2 · LESSON 1 · LUYỆN TẬP</div><h1>Nhìn hình, nói tiếng Trung</h1><p class="sub">Hình từ trang 5–6 giáo trình bạn cung cấp. Chọn từng bài bên dưới để luyện.</p></div><div class="picture-tabs" role="group" aria-label="Chọn bài tập"><button data-picture-mode="identify" aria-pressed="${pictureMode==='identify'}">1. Điền hoạt động</button><button data-picture-mode="dialogue" aria-pressed="${pictureMode==='dialogue'}">2. Hỏi & đáp</button><button data-picture-mode="simultaneous" aria-pressed="${simultaneous}">3. Vừa… vừa…</button><button id="textPractice">Bài tập chữ</button></div><section class="picture-exercise"><div class="picture-progress"><strong>${pictureMode==='identify'?'Điền hoạt động':simultaneous?'一边……一边……':'在／正在／正'}</strong><span>Câu ${pictureIndex+1} / ${items.length}</span></div><div class="picture-exercise-grid"><figure>${pictureImage(item,simultaneous)}<figcaption>Hình ${pictureIndex+1} · Trang ${simultaneous?6:5}</figcaption></figure><form id="pictureForm"><p class="picture-prompt">${pictureMode==='identify'?'Chọn hoạt động tương ứng với hình.':simultaneous?'Viết một câu diễn tả hai hoạt động diễn ra cùng lúc.':'Viết câu hỏi và câu trả lời về người trong hình.'}</p>${pictureMode==='identify'?'<label for="pictureAction">Hoạt động</label><select id="pictureAction" required><option value="">Chọn hoạt động…</option>'+options.map(action=>'<option value="'+action+'" '+(record.answer===action?'selected':'')+'>'+action+'</option>').join('')+'</select>':pictureMode==='dialogue'?'<label for="pictureQuestion">A · Câu hỏi</label><input id="pictureQuestion" lang="zh-CN" placeholder="…在做什么？" value="'+esc(record.question||'')+'" required><label for="pictureAnswer">B · Câu trả lời</label><input id="pictureAnswer" lang="zh-CN" placeholder="…正在……。" value="'+esc(record.answer||'')+'" required>':'<label for="pictureAnswer">Câu của bạn</label><input id="pictureAnswer" lang="zh-CN" placeholder="他／她一边……，一边……。" value="'+esc(record.answer||'')+'" required><p class="sub">Có thể đổi thứ tự hai hoạt động. Với tranh có nhiều cách hiểu, xem câu gợi ý để đối chiếu.</p>'}<div class="picture-actions"><button class="btn" type="submit">Kiểm tra</button><button class="btn secondary" id="pictureReveal" type="button">Xem gợi ý</button></div><div id="pictureFeedback" class="picture-feedback" role="status"></div></form></div><div class="picture-navigation"><button class="btn secondary" id="picturePrevious" ${pictureIndex===0?'disabled':''}>← Trước</button><span id="pictureScore">Đã đúng ${Object.values(records).filter(r=>r.correct).length} / 13 bài</span><button class="btn secondary" id="pictureNext" ${pictureIndex===items.length-1?'disabled':''}>Tiếp →</button></div></section>`;
 document.querySelectorAll('[data-picture-mode]').forEach(button=>button.onclick=()=>{capturePictureDraft();pictureMode=button.dataset.pictureMode;pictureIndex=0;showPicturePractice();});
 document.querySelector('#textPractice').onclick=()=>{capturePictureDraft();textPracticePage();const back=document.createElement('button');back.className='btn secondary';back.textContent='← Bài tập nhìn hình';back.onclick=showPicturePractice;app.prepend(back);};
 document.querySelector('#pictureForm').onsubmit=e=>{e.preventDefault();checkPictureAnswer();};
 document.querySelector('#pictureReveal').onclick=()=>showPictureHint();
 document.querySelector('#picturePrevious').onclick=()=>{capturePictureDraft();pictureIndex--;showPicturePractice();};
 document.querySelector('#pictureNext').onclick=()=>{capturePictureDraft();pictureIndex++;showPicturePractice();};
 if(record.correct)document.querySelector('#pictureFeedback').textContent='✓ Bài này bạn đã làm đúng. Có thể sửa và kiểm tra lại.';
}
function capturePictureDraft(){
 const answer=document.querySelector(pictureMode==='identify'?'#pictureAction':'#pictureAnswer').value,question=pictureMode==='dialogue'?document.querySelector('#pictureQuestion').value:'';
 state.picturePractice=state.picturePractice||{};const previous=state.picturePractice[pictureKey()]||{};
 state.picturePractice[pictureKey()]={...previous,answer,question,correct:previous.answer===answer&&previous.question===question?!!previous.correct:false};save();
}
function pictureSample(){
 if(pictureMode==='simultaneous'){const a=simultaneousPictures[pictureIndex].actions;return '他一边'+a[0]+'，一边'+a[1]+'。';}
 const item=activityPictures[pictureIndex];return pictureMode==='identify'?item.action:item.subject+'在做什么？ '+item.subject+'正在'+item.action+'。';
}
function gradePicture(mode,index,answer,question=''){
 const text=normalizeHanzi(answer);
 if(mode==='identify')return text===activityPictures[index].action;
 if(mode==='dialogue'){
   const item=activityPictures[index],subject='(?:他|她|他们|她们)',action=item.action==='打球'?'打(?:篮)?球':item.action==='吃饭'?'(?:吃饭|吃东西|吃汉堡)':item.action;
   return new RegExp('^'+subject+'(?:现在)?(?:在|正在|正)做什么(?:呢)?$').test(normalizeHanzi(question))&&new RegExp('^'+subject+'(?:现在)?(?:在|正在|正)'+action+'(?:呢)?$').test(text);
 }
 const actions=simultaneousPictures[index].actions.map(action=>index===2&&action==='喝茶'?'(?:喝茶|喝咖啡|喝水)':action);
 return actions.some((first,i)=>new RegExp('^(?:他|她|他们|她们)?一边'+first+'一边'+actions[1-i]+'$').test(text));
}
function checkPictureAnswer(){
 capturePictureDraft();const record=state.picturePractice[pictureKey()];record.correct=gradePicture(pictureMode,pictureIndex,record.answer,record.question);save();document.querySelector('#pictureScore').textContent='Đã đúng '+Object.values(state.picturePractice).filter(r=>r.correct).length+' / 13 bài';
 document.querySelector('#pictureFeedback').textContent=record.correct?'✓ Chính xác! Bạn có thể sang hình tiếp theo.':pictureMode==='simultaneous'?'Chưa khớp câu mẫu. Kiểm tra cấu trúc 一边……一边…… và hai hoạt động; bấm “Xem gợi ý” để đối chiếu.':'Chưa chính xác. Hãy kiểm tra hoạt động và mẫu câu; bạn có thể thử lại hoặc xem gợi ý.';
}
function showPictureHint(){capturePictureDraft();document.querySelector('#pictureFeedback').textContent='Gợi ý: '+pictureSample()+(pictureMode==='simultaneous'?' Đây là câu tham khảo; tranh có thể có cách diễn đạt khác.':'');}
pages.practice=showPicturePractice;
if(location.hash==='#practice'&&state.level===2)pages.practice();
