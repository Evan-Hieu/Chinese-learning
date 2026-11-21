// Use one practice engine for all levels while preserving the original HSK2 catalogue.
const originalHsk2Stories=hsk2Stories,originalHsk2Sections=hsk2Sections;
let activeAdvancedLevel=2;
function advancedSourceCount(){return advancedLibraryData[state.level].sourceCount;}
function activateAdvancedLevel(level){
 if(activeAdvancedLevel!==level){hsk2LibraryQuery='';hsk2LibraryFilter='all';openHsk2Sections.clear();stopWordAudio();storySession=null;}
 activeAdvancedLevel=level;
 hsk2Stories=level===2?originalHsk2Stories:advancedLibraryData[level].stories;
 hsk2Sections=level===2?originalHsk2Sections:advancedLibraryData[level].sections;
}
const originalAdvancedTabsBinding=bindAdvancedVocabularyTabs;
bindAdvancedVocabularyTabs=function(){
 if(state.level===2){originalAdvancedTabsBinding();return;}
 document.querySelector('#practiceTab').onclick=()=>showAdvancedLessonUnavailable('practice');
 document.querySelector('#transcriptTab').onclick=()=>showAdvancedLessonUnavailable('transcript');
 document.querySelector('#advancedTab').onclick=()=>{if(storyIsActive()&&storySession?.position<hsk2Story.lines.length)storyCapture();pages.stories();};
};
function showAdvancedLessonUnavailable(tab){
 if(storyIsActive()&&storySession?.position<hsk2Story.lines.length)storyCapture();
 stopWordAudio();dictationSession=null;app.dataset.vocabView='story-hub';
 app.innerHTML=vocabularyTabsMarkup(tab)+'<section class="card"><h2>Chưa có bài giáo trình HSK'+state.level+'</h2><p>Kho từ vựng nâng cao HSK'+state.level+' đã sẵn sàng. Chọn tab Từ vựng nâng cao để học.</p></section>';
 bindAdvancedVocabularyTabs();
}
render();
