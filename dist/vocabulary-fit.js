// Fixed-height learning views use buttons to page through lists instead of moving the page.
let vocabularyPage=0;
function vocabularyPageSize(){return (window.innerWidth||1280)<=650?2:(window.innerWidth||1280)<=1000?4:6;}
function contextPageSize(){return (window.innerWidth||1280)<=650?2:(window.innerHeight||800)<760?4:6;}
function renderContextPage(page){
  const s=dictationSession,size=contextPageSize(),pages=Math.max(1,Math.ceil(s.queue.length/size));
  s.contextListPage=Math.max(0,Math.min(page,pages-1));
  s.queue.forEach((_,i)=>{const row=document.querySelector('#contextRow-'+i);if(row)row.hidden=i<s.contextListPage*size||i>=(s.contextListPage+1)*size;});
  document.querySelector('#contextPageCount').textContent=(s.contextListPage+1)+' / '+pages;
  document.querySelector('#contextPagePrev').disabled=s.contextListPage===0;
  document.querySelector('#contextPageNext').disabled=s.contextListPage===pages-1;
}
function bindContextPagination(){
  const s=dictationSession;
  renderContextPage(s.contextListPage??Math.floor((s.transcriptIndex||0)/contextPageSize()));
  document.querySelector('#contextPagePrev').onclick=()=>renderContextPage((s.contextListPage||0)-1);
  document.querySelector('#contextPageNext').onclick=()=>renderContextPage((s.contextListPage||0)+1);
}
window.addEventListener('resize',()=>{
  if(typeof state==='undefined'||location.hash.slice(1)!=='words')return;
  if(app.dataset.vocabView==='list')drawWords(document.querySelector('#search').value,vocabularyPage);
  else if(app.dataset.vocabView==='transcript')renderContextPage(Math.floor((dictationSession.transcriptIndex||0)/contextPageSize()));
});
