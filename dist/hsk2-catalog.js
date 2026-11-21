let hsk2LibraryQuery='',hsk2LibraryFilter='all';
const openHsk2Sections=new Set();
function hsk2StoryStatus(story){const p=storyProgress(story.id);return p.position>=story.lines.length?'done':p.position>0||Object.keys(p.records).length?'learning':'new';}
function filteredHsk2Stories(){
 const q=hsk2LibraryQuery.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 return hsk2Stories.filter(story=>(hsk2LibraryFilter==='all'||hsk2StoryStatus(story)===hsk2LibraryFilter)&&(!q||[story.title,story.subtitle,...story.vocabulary.flat(),...story.lines.map(line=>line[2])].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q)));
}
function renderHsk2Sections(){
 const visible=filteredHsk2Stories();
 document.querySelector('#hsk2SectionList').innerHTML=visible.length?hsk2Sections.map(([id,title],index)=>{
  const lessons=visible.filter(story=>story.section===id);if(!lessons.length)return '';
  const terms=new Set(lessons.flatMap(story=>story.vocabulary.map(w=>w[0])));
  return `<details class="hsk2-section" data-hsk2-section="${id}" ${openHsk2Sections.has(id)||hsk2LibraryQuery?'open':''}><summary><strong>Section ${index+1}</strong><span>${title}</span><small>(${lessons.length} bài · ${terms.size} từ)</small></summary><div class="hsk2-lesson-grid">${lessons.map(story=>{
   const p=storyProgress(story.id),status=hsk2StoryStatus(story),correct=Object.values(p.records).filter(r=>r.correct).length;
   return `<button class="hsk2-lesson-card" data-story-open="${story.id}" type="button"><strong>${hsk2Stories.indexOf(story)+1}. ${esc(story.title)}</strong><span>${story.lines.length} câu · HSK2 · ${story.vocabulary.length} từ</span><small class="lesson-status ${status}">${status==='done'?'Đã đi hết · '+correct+'/'+story.lines.length+' câu đúng':status==='learning'?'Đang học · Câu '+Math.min(p.position+1,story.lines.length)+'/'+story.lines.length:'Chưa học'}</small></button>`;
  }).join('')}</div></details>`;
 }).join(''):'<p class="library-empty">Không có bài phù hợp. Thử tên bài hoặc từ như “报纸”, “咖啡”.</p>';
 document.querySelector('#hsk2SearchResult').textContent=hsk2LibraryQuery||hsk2LibraryFilter!=='all'?'Tìm thấy '+visible.length+' / '+hsk2Stories.length+' bài':'';
 document.querySelectorAll('[data-story-open]').forEach(button=>button.onclick=()=>selectHsk2Story(button.dataset.storyOpen,true));
 document.querySelectorAll('[data-hsk2-section]').forEach(detail=>detail.ontoggle=()=>{if(detail.open)openHsk2Sections.add(detail.dataset.hsk2Section);else openHsk2Sections.delete(detail.dataset.hsk2Section);});
}
function renderHsk2Catalog(){
 stopWordAudio();dictationSession=null;app.dataset.vocabView='story-hub';
 const covered=new Set(hsk2Stories.flatMap(story=>story.vocabulary.map(w=>w[0])));
 app.innerHTML=vocabularyTabsMarkup('advanced')+`<div class="hsk2-catalog" id="practicePanel" role="tabpanel" aria-labelledby="advancedTab"><div class="hsk2-breadcrumb">Kho từ vựng nâng cao <span>/</span> HSK2</div><div class="hsk2-catalog-heading"><div><h1>Hội thoại HSK2</h1><p>6 Section · 12 bài · Nghe và gõ từng câu theo câu chuyện</p></div><form id="hsk2SearchForm" class="hsk2-search"><input id="hsk2Search" type="search" aria-label="Tìm hội thoại hoặc từ vựng" placeholder="Tìm tên bài, từ vựng…" value="${esc(hsk2LibraryQuery)}"><select id="hsk2Status" aria-label="Lọc tiến độ"><option value="all">Tất cả bài</option><option value="new">Chưa học</option><option value="learning">Đang học</option><option value="done">Đã đi hết</option></select><button type="submit">Tìm</button></form></div><div class="hsk2-coverage"><strong>${covered.size} / ${hsk2SourceVocabulary.length} từ HSK2</strong><span>đã có trong các câu thoại · Từ mới hiện phía trên mỗi câu</span></div><p id="hsk2SearchResult" role="status" class="hsk2-search-result"></p><div id="hsk2SectionList"></div><p class="hsk2-catalog-note">Kho học riêng, không thay nội dung bài giáo trình. Hội thoại mới biên soạn theo sheet “2”; từ hỗ trợ được ghi chú riêng. <a href="${hsk2Stories[0].source}" target="_blank" rel="noopener">Nguồn danh sách từ</a></p></div>`;
 bindAdvancedVocabularyTabs();document.querySelector('#hsk2Status').value=hsk2LibraryFilter;
 document.querySelector('#hsk2SearchForm').onsubmit=e=>{e.preventDefault();hsk2LibraryQuery=document.querySelector('#hsk2Search').value.trim();hsk2LibraryFilter=document.querySelector('#hsk2Status').value;renderHsk2Sections();};
 renderHsk2Sections();
}
