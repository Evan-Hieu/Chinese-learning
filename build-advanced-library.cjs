const fs=require('fs');const source=JSON.parse(fs.readFileSync('advanced-source-full.json','utf8'));const fixes=JSON.parse(fs.readFileSync('advanced-example-fixes.json','utf8'));const procurement=JSON.parse(fs.readFileSync('advanced-procurement-dialogues.json','utf8'));
const topics=[
 ['family','Gia đình & bạn bè',/爸爸|妈妈|父母|儿子|女儿|亲戚|家庭|结婚|妻子|丈夫|孩子|朋友|邻居|爷爷|奶奶|哥哥|姐姐|弟弟|妹妹|婚礼|婚姻/,['家里最近怎么样？','Jiā lǐ zuìjìn zěnmeyàng?','Gần đây gia đình thế nào?'],['你身边的人呢？','Nǐ shēnbiān de rén ne?','Còn những người quanh bạn?']],
 ['food','Ăn uống & mua sắm',/吃|喝|饭|餐|菜|水果|苹果|咖啡|茶|牛奶|面包|厨房|食品|食物|商店|超市|购物|衣服|衬衫|裙|裤|鞋|菜单|口味|美食/,['最近购物和吃饭时有什么发现？','Zuìjìn gòuwù hé chīfàn shí yǒu shénme fāxiàn?','Gần đây khi mua sắm và ăn uống bạn thấy gì mới?'],['还有什么想和我分享的？','Hái yǒu shénme xiǎng hé wǒ fēnxiǎng de?','Bạn còn muốn chia sẻ điều gì nữa?']],
 ['travel','Đi lại & khám phá',/旅游|旅行|飞机|机场|火车|公交|汽车|地铁|船|司机|车站|出租车|交通|机票|风景|景色|城市|北京|宾馆|酒店|参观|出发|目的地|城堡|地图|博物馆/,['最近出门有什么见闻？','Zuìjìn chū mén yǒu shénme jiànwén?','Gần đây ra ngoài bạn thấy gì mới?'],['路上还有什么事？','Lù shàng hái yǒu shénme shì?','Trên đường còn chuyện gì nữa?']],
 ['health','Sức khỏe & sinh hoạt',/医生|医院|病|药|身体|健康|疼|痛|症|治疗|锻炼|运动|跑步|篮球|足球|游泳|睡|起床|刷牙|喷嚏|喘气|休息|疲劳/,['最近身体和生活怎么样？','Zuìjìn shēntǐ hé shēnghuó zěnmeyàng?','Dạo này sức khỏe và sinh hoạt thế nào?'],['还有什么需要注意的？','Hái yǒu shénme xūyào zhùyì de?','Còn điều gì cần chú ý nữa?']],
 ['study','Trường học & ngôn ngữ',/学校|学生|学习|老师|教师|教室|考试|成绩|汉语|英语|语法|词汇|翻译|作业|论文|大学|课堂|教授|教育|课程|知识|文献|考古/,['最近学习上有什么新情况？','Zuìjìn xuéxí shàng yǒu shénme xīn qíngkuàng?','Gần đây việc học có gì mới?'],['你还了解哪些情况？','Nǐ hái liǎojiě nǎxiē qíngkuàng?','Bạn còn biết những tình hình nào nữa?']],
 ['work','Công việc & hợp tác',/工作|公司|工厂|项目|会议|任务|经理|同事|职业|职务|员工|团队|招聘|面试|合同|生产|客户|合作|企业|老板|管理|业务|产品|订单|机械/,['最近工作上有什么事？','Zuìjìn gōngzuò shàng yǒu shénme shì?','Gần đây công việc có chuyện gì?'],['还有其他情况吗？','Hái yǒu qítā qíngkuàng ma?','Còn tình hình nào khác không?']],
 ['money','Tiền bạc & giao dịch',/钱|银行|价格|费用|支付|购买|投资|经济|成本|利润|收入|工资|消费|市场|贸易|货币|贷款|预算|便宜|贵|付款|金融|百分点/,['最近有什么经济方面的消息？','Zuìjìn yǒu shénme jīngjì fāngmiàn de xiāoxi?','Gần đây có tin gì về kinh tế và tiền bạc?'],['你还注意到了什么？','Nǐ hái zhùyì dào le shénme?','Bạn còn chú ý thấy điều gì nữa?']],
 ['nature','Thiên nhiên & môi trường',/天气|下雨|下雪|阳光|太阳|气温|环境|污染|森林|树|植物|动物|鸟|猫|狗|海洋|河|湖|自然|生态|地球|气候|花|季节|山|春|夏|秋|冬/,['最近周围的环境怎么样？','Zuìjìn zhōuwéi de huánjìng zěnmeyàng?','Gần đây môi trường xung quanh thế nào?'],['还有什么让你印象深刻？','Hái yǒu shénme ràng nǐ yìnxiàng shēnkè?','Còn điều gì khiến bạn ấn tượng?']],
 ['culture','Sở thích & văn hóa',/电影|音乐|唱歌|舞蹈|跳舞|艺术|文化|历史|传统|节日|绘画|小说|故事|作家|书|照片|摄影|演出|表演|电视|节目|比赛/,['最近有什么有意思的事？','Zuìjìn yǒu shénme yǒuyìsi de shì?','Gần đây có chuyện gì thú vị?'],['你还想到了什么？','Nǐ hái xiǎng dào le shénme?','Bạn còn nghĩ đến điều gì nữa?']],
 ['technology','Công nghệ & đồ dùng',/电脑|计算机|手机|网络|软件|电子|邮箱|邮件|信息|数据|技术|科技|设备|机器|密码|屏幕|电池|网站|系统|程序|设置/,['最近使用设备时有什么发现？','Zuìjìn shǐyòng shèbèi shí yǒu shénme fāxiàn?','Gần đây khi dùng thiết bị bạn phát hiện điều gì?'],['还有别的情况吗？','Hái yǒu bié de qíngkuàng ma?','Còn tình hình nào khác không?']],
 ['society','Xã hội & ứng xử',/社会|法律|法院|警察|审判|政府|政治|国家|人民|公民|权利|责任|制度|战争|和平|公平|犯罪|偷|贼|安全|危险|救|帮助|道德|尊重|人士/,['最近有什么值得关注的事？','Zuìjìn yǒu shénme zhíde guānzhù de shì?','Gần đây có chuyện gì đáng quan tâm?'],['你怎么看这些事情？','Nǐ zěnme kàn zhèxiē shìqing?','Bạn nhìn nhận những việc này thế nào?']],
 ['life','Cuộc sống & suy nghĩ',/./,['最近有什么想和我聊的？','Zuìjìn yǒu shénme xiǎng hé wǒ liáo de?','Gần đây bạn muốn kể với mình điều gì?'],['你还有什么想法？','Nǐ hái yǒu shénme xiǎngfǎ?','Bạn còn suy nghĩ gì nữa?']]
];
const gids={1:1920193036,2:1408847024,3:635133176,4:1333672178,5:762174000,6:1258066465};
const library={},audit={};
for(let level=1;level<=6;level++){
 let entries=source[level].values.slice(1).filter(r=>r[1]).map((r,i)=>{
  const z=level===1?7:4,word=r[1].trim(),fix=fixes[level+':'+word];let py=r[2],zh=r[z],sentencePy=r[z+1],vi=r[z+2];
  if(fix){py=fix[0]||py;if(fix[1]){zh=fix[1];sentencePy=fix[2];vi=fix[3];}}
  const meaning=r[level===1?6:3],term=word.replace(/（.*?）/g,'').split(' (')[0].trim();
  return {id:'hsk'+level+'-row-'+(i+2),row:i+2,word,term,py,meaning,zh,sentencePy,vi,custom:level===1&&!r[0]};
 });
 const sections=[],stories=[];
 for(const topic of topics){
  const group=entries.filter(e=>!e.custom&&topics.find(t=>t[2].test(e.term+' '+e.zh))===topic);
  for(let offset=0;offset<group.length;offset+=48){
   const section=topic[0]+'-'+(1+Math.floor(offset/48)),part=group.slice(offset,offset+48);sections.push([section,topic[1]+(group.length>48?' · '+(1+Math.floor(offset/48)):'')]);
   for(let k=0;k<part.length;k+=6){
    const batch=part.slice(k,k+6),lines=[];
    batch.forEach((e,i)=>{
     const question=/[？?]$/.test(e.zh.trim());
     if(question){lines.push(['A',topic[1],e.zh,e.sentencePy,e.vi,[e.word]]);lines.push(['B',topic[1],'我们一起了解一下吧。','Wǒmen yìqǐ liǎojiě yíxià ba.','Chúng ta cùng tìm hiểu nhé.',[]]);}
     else {const prompt=i===0?topic[3]:i%3===1?topic[4]:i%3===2?['能再举个例子吗？','Néng zài jǔ ge lìzi ma?','Bạn có thể kể thêm một ví dụ không?']:['说到这里，你还想补充什么？','Shuō dào zhèlǐ, nǐ hái xiǎng bǔchōng shénme?','Nhân nói đến đây, bạn còn muốn bổ sung điều gì?'];lines.push(['A',topic[1],...prompt,[]]);lines.push(['B',topic[1],e.zh,e.sentencePy,e.vi,[e.word]]);}
    });
    stories.push({id:'hsk'+level+'-'+section+'-'+(k/6+1)+'-v1',level,section,speakers:['Tiểu An','Tiểu Lâm'],title:topic[1]+' · '+(Math.floor(offset/6)+k/6+1),subtitle:'Hỏi đáp theo tình huống · '+batch.map(e=>e.term).join(' · '),source:'https://docs.google.com/spreadsheets/d/1IfhJNwdSUCpranQc6i8jNHeZnaLL4UE-_w9y-Tp5y9c/edit#gid='+gids[level],vocabulary:batch.map(e=>[e.word,e.py,e.meaning]),entryIds:batch.map(e=>e.id),lines});
   }
  }
 }
 if(level===1){
  sections.push(['procurement','Mua hàng & sản xuất · Từ bổ sung trong sheet 1']);
  const names=['Chuẩn bị mua hàng','Linh kiện và bản vẽ','So sánh báo giá','Thương lượng số lượng','Đặt hàng và giao nhận','Vật tư và sản xuất'];
  for(let k=0;k<procurement.length;k+=6){const slice=procurement.slice(k,k+6),terms=new Set(slice.flatMap(r=>r[3].split(' '))),batch=entries.filter(e=>e.custom&&terms.has(e.word));stories.push({id:'hsk1-procurement-'+(k/6+1)+'-v1',level:1,section:'procurement',speakers:['Nhân viên mua hàng','Đồng nghiệp'],title:names[k/6],subtitle:'Cùng xử lý một đơn hàng',source:'https://docs.google.com/spreadsheets/d/1IfhJNwdSUCpranQc6i8jNHeZnaLL4UE-_w9y-Tp5y9c/edit#gid='+gids[1],vocabulary:batch.map(e=>[e.word,e.py,e.meaning]),entryIds:batch.map(e=>e.id),lines:slice.map((r,i)=>[i%2?'B':'A',names[k/6],r[0],r[1],r[2],r[3].split(' ')])});}
 }
 const covered=new Set(stories.flatMap(s=>s.entryIds));const missing=entries.filter(e=>!covered.has(e.id));if(missing.length)throw Error('Missing entries '+JSON.stringify(missing));
 for(const story of stories)for(const line of story.lines)for(const word of line[5]){const term=word.replace(/（.*?）/g,'').split(' (')[0];if(!line[2].includes(term))throw Error('Missing literal target '+level+' '+word);}
 for(const e of entries)if(!e.py||e.py.includes('#')||!e.meaning)throw Error('Missing vocabulary metadata '+level+' '+e.word);
 library[level]={level,sections,stories,sourceCount:entries.length,source:gids[level],entries:entries.map(e=>({id:e.id,row:e.row,word:e.word,py:e.py,meaning:e.meaning}))};audit[level]={sourceRows:entries.length,coveredRows:covered.size,stories:stories.length,sections:sections.length,lines:stories.reduce((s,x)=>s+x.lines.length,0)};
}
// HSK2 keeps the original hand-authored stories and existing progress keys.
const vm=require('vm'),legacy={};vm.createContext(legacy);
for(const file of ['hsk2-vocabulary.js','hsk2-dialogues.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),legacy);
vm.runInContext(fs.readFileSync('dist/hsk2-stories.js','utf8').split('let storyLexicon=')[0],legacy);
const oldStories=vm.runInContext('hsk2Stories',legacy),oldSections=vm.runInContext('hsk2Sections',legacy);
library[2].stories=[];library[2].sections=[];
audit[2].stories=oldStories.length;audit[2].sections=oldSections.length;audit[2].lines=oldStories.reduce((sum,x)=>sum+x.lines.length,0);
fs.writeFileSync('dist/advanced-library-data.js','// Read-only snapshot of the user’s six tabs; sentence fixes and connecting turns are maintained separately.\nconst advancedLibraryData='+JSON.stringify(library)+';\n');fs.writeFileSync('dist/advanced-coverage.json',JSON.stringify(audit,null,2));console.log(audit);
