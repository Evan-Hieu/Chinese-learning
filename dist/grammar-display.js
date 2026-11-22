// Shared by every grammar lesson and HSK level. Each example owns its translations.
function grammarExamples(rows){return '<div class="grammar-examples">'+rows.map(([han,pinyin,vi])=>'<div class="grammar-example"><div class="grammar-example-han" lang="zh-CN">'+esc(han)+'</div><div class="grammar-example-pinyin" lang="zh-Latn">'+esc(pinyin)+'</div><div class="grammar-example-vi" lang="vi">'+esc(vi)+'</div></div>').join('')+'</div>';}
function setupGrammarDisplay(){
 if(typeof document.createElement!=='function')return;
 const modes=[['han','Chỉ chữ Hán'],['pinyin','Chữ Hán + pinyin'],['vi','Chữ Hán + tiếng Việt'],['all','Chữ Hán + pinyin + tiếng Việt']];
 const heading=document.querySelector('.grammar-page-heading');if(!heading)return;
 const label=document.createElement('label');label.className='grammar-display-setting';label.textContent='Hiển thị';
 const select=document.createElement('select');select.id='grammar-display';select.setAttribute('aria-label','Hiển thị câu ngữ pháp');
 modes.forEach(([value,text])=>{const option=document.createElement('option');option.value=value;option.textContent=text;select.append(option);});
 select.value=modes.some(([v])=>v===state.grammarDisplay)?state.grammarDisplay:'han';
 const apply=()=>{app.dataset.grammarDisplay=select.value;};apply();select.onchange=()=>{state.grammarDisplay=select.value;save();apply();};label.append(select);heading.append(label);
}
