// The main transcript player reads the whole list; row buttons play once only.
let contextPlayback=null,contextPlaylistTimer=null;
function cancelContextPlayback(){
  if(contextPlaylistTimer!==null){clearTimeout(contextPlaylistTimer);contextPlaylistTimer=null;}
  contextPlayback=null;
}
function updateContextSentence(){
  const s=dictationSession,index=s.transcriptIndex||0,item=vocabularyContexts[s.queue[index]],translation=s.translation||'none';
  document.querySelector('.context-current').innerHTML=contextCurrentHtml(item,translation);
  document.querySelector('#contextSourceSlot').innerHTML=contextSourceHtml(item);
  document.querySelector('#contextCounter').textContent=(index+1)+' / '+s.queue.length;
  document.querySelector('#contextPrev').disabled=index===0;
  document.querySelector('#contextNext').disabled=index===s.queue.length-1;
  document.querySelectorAll('[data-context-select]').forEach(button=>{
    const selected=Number(button.dataset.contextSelect)===index;
    button.setAttribute('aria-current',String(selected));
    button.closest('.context-row').classList.toggle('selected',selected);
  });
  if(s.contextAutoScroll!==false)renderContextPage(Math.floor(index/contextPageSize()));
}
function finishContextPlayback(playback){
  if(contextPlayback!==playback)return;
  contextPlayback=null;document.querySelector('#listenWord').textContent='▶';
  document.querySelector('#speechStatus').textContent='Đã nghe xong toàn bộ '+playback.session.queue.length+' câu. Bấm ▶ để nghe lại từ đầu.';
}
function playContextItem(playback,index){
  if(contextPlayback!==playback||dictationSession!==playback.session||dictationSession.tab!=='transcript')return;
  const s=playback.session;
  if(index>=s.queue.length){
    if(!s.transcriptRepeat){finishContextPlayback(playback);return;}
    document.querySelector('#listenWord').textContent='❚❚';
    document.querySelector('#speechStatus').textContent='Đã hết toàn bộ bài. Sẽ lặp lại từ câu đầu.';
    contextPlaylistTimer=setTimeout(()=>{contextPlaylistTimer=null;if(contextPlayback===playback)playContextItem(playback,0);},dictationPrefs().replayDelay*1000);
    return;
  }
  s.transcriptIndex=index;playback.index=index;playback.waiting=false;updateContextSentence();
  const started=speakWord(vocabularyContexts[s.queue[index]].zh,{
    playlist:true,
    onComplete:()=>{if(contextPlayback===playback)playContextItem(playback,index+1);},
    onError:()=>{if(contextPlayback===playback)cancelContextPlayback();}
  });
  if(started===false&&contextPlayback===playback)cancelContextPlayback();
}
function toggleTranscriptPlayback(){
  const synth=window.speechSynthesis,status=document.querySelector('#speechStatus'),playback=contextPlayback;
  if(playback&&playback.session===dictationSession){
    if(playback.waiting){playContextItem(playback,0);return;}
    if(contextPlaylistTimer!==null){clearTimeout(contextPlaylistTimer);contextPlaylistTimer=null;playback.waiting=true;document.querySelector('#listenWord').textContent='▶';status.textContent='Đã tạm dừng trước lượt lặp tiếp theo.';return;}
    if(synth?.paused&&wordUtterance){synth.resume();document.querySelector('#listenWord').textContent='❚❚';status.textContent='Đang nghe toàn bộ bài · Câu '+(playback.index+1)+' / '+dictationSession.queue.length;return;}
    if(synth?.speaking&&wordUtterance){synth.pause();document.querySelector('#listenWord').textContent='▶';status.textContent='Đã tạm dừng. Bấm ▶ để nghe tiếp.';return;}
  }
  stopWordAudio();
  const next={session:dictationSession,index:0,waiting:false};contextPlayback=next;playContextItem(next,0);
}
