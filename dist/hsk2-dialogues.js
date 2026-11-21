// Original dialogues; vocabulary membership is checked against sheet "2".
const hsk2Sections=[
 ['people','Hẹn gặp & gia đình'],['daily','Sinh hoạt & sức khỏe'],['shopping','Mua sắm & ăn uống'],
 ['study','Trường học & học tập'],['travel','Đi lại & du lịch'],['leisure','Thể thao & giải trí']
];
function defineHsk2Dialogue(id,section,title,subtitle,speakers,rows,notes=[]){
 const lines=rows.map(row=>{const [speaker,zh,py,vi,terms]=row.split('|');const support=notes.flatMap(note=>note.split(';').map(part=>part.trim())).filter(note=>zh.includes(note.split(' · ')[0].split('…')[0]));return [speaker,subtitle,zh,py,vi,terms.split(' '),support];});
 return {id,section,title,subtitle,speakers,lines};
}
const additionalHsk2Stories=[
defineHsk2Dialogue('new-neighbours-v1','people','Làm quen gia đình hàng xóm','Một lần ghé thăm nhà mới',['Người hàng xóm','Chủ nhà'],[
 'A|您好，我姓王，是您的新邻居。|Nín hǎo, wǒ xìng Wáng, shì nín de xīn línjū.|Xin chào, tôi họ Vương, là hàng xóm mới của bác.|您 姓 新',
 'B|欢迎，请进！我给您介绍一下我的家人。|Huānyíng, qǐng jìn! Wǒ gěi nín jièshào yíxià wǒ de jiārén.|Chào mừng, mời vào! Để tôi giới thiệu gia đình với bác.|欢迎 进 介绍 给',
 'B|穿白衣服的女人是我的妻子。|Chuān bái yīfu de nǚrén shì wǒ de qīzi.|Người phụ nữ mặc áo trắng là vợ tôi.|穿 白 女人 妻子',
 'A|她旁边的男人是您的哥哥吗？|Tā pángbiān de nánrén shì nín de gēge ma?|Người đàn ông cạnh chị ấy là anh trai bác à?|旁边 男人 哥哥',
 'B|对，他比我高，头发也比我的长。|Duì, tā bǐ wǒ gāo, tóufa yě bǐ wǒ de cháng.|Đúng, anh ấy cao hơn tôi, tóc cũng dài hơn tóc tôi.|对 比 高 长 也',
 'A|这三个孩子呢？|Zhè sān ge háizi ne?|Còn ba đứa trẻ này?|孩子',
 'B|这是我的弟弟、妹妹，还有姐姐的儿子。|Zhè shì wǒ de dìdi, mèimei, hái yǒu jiějie de érzi.|Đây là em trai, em gái tôi và con trai của chị gái tôi.|弟弟 妹妹 姐姐 还',
 'A|孩子们的眼睛都很大，这个房间也很大！|Háizimen de yǎnjing dōu hěn dà, zhège fángjiān yě hěn dà!|Mắt của các em đều rất to, căn phòng này cũng rộng nữa!|眼睛 房间',
 'B|这是我们的猫，它叫小白。|Zhè shì wǒmen de māo, tā jiào Xiǎobái.|Đây là mèo nhà tôi, nó tên Tiểu Bạch.|它 白',
 'A|它坐着看我们，真可爱！|Tā zuò zhe kàn wǒmen, zhēn kě’ài!|Nó đang ngồi nhìn chúng ta, thật đáng yêu!|着 真'
 ],['邻居 · línjū · hàng xóm; 家人 · jiārén · người nhà; 头发 · tóufa · tóc; 可爱 · kě’ài · đáng yêu (từ hỗ trợ)']),
defineHsk2Dialogue('morning-routine-v1','daily','Một buổi sáng bận rộn','Hai đồng nghiệp trò chuyện trước giờ làm',['Tiểu An','Tiểu Minh'],[
 'A|你每天早上几点起床？|Nǐ měitiān zǎoshang jǐ diǎn qǐchuáng?|Mỗi sáng bạn dậy lúc mấy giờ?|每 早上 起床',
 'B|六点，起床以后我先洗脸，再去跑步。|Liù diǎn, qǐchuáng yǐhòu wǒ xiān xǐ liǎn, zài qù pǎobù.|Sáu giờ, dậy rồi mình rửa mặt trước, sau đó đi chạy bộ.|洗 再 跑步',
 'A|你每天都运动，身体一定很好吧。|Nǐ měitiān dōu yùndòng, shēntǐ yídìng hěn hǎo ba.|Bạn tập thể dục mỗi ngày, chắc sức khỏe tốt lắm nhỉ.|运动 身体 吧',
 'B|还可以。跑完步，我喝牛奶，吃鸡蛋。|Hái kěyǐ. Pǎo wán bù, wǒ hē niúnǎi, chī jīdàn.|Cũng được. Chạy xong, mình uống sữa và ăn trứng.|还 可以 完 牛奶 鸡蛋',
 'A|你怎么去上班？|Nǐ zěnme qù shàngbān?|Bạn đi làm bằng gì?|上班',
 'B|我骑自行车去公司，骑半个小时。|Wǒ qí zìxíngchē qù gōngsī, qí bàn ge xiǎoshí.|Mình đi xe đạp đến công ty, mất nửa giờ.|自行车 公司 小时',
 'A|今天工作忙吗？|Jīntiān gōngzuò máng ma?|Hôm nay công việc bận không?|忙',
 'B|很忙，我晚上可能会很累。|Hěn máng, wǒ wǎnshang kěnéng huì hěn lèi.|Rất bận, tối nay có lẽ mình sẽ rất mệt.|晚上 可能 累',
 'A|那下班以后早点休息吧。|Nà xiàbān yǐhòu zǎo diǎn xiūxi ba.|Vậy tan làm thì nghỉ ngơi sớm nhé.|休息',
 'B|好，你也要注意身体。|Hǎo, nǐ yě yào zhùyì shēntǐ.|Ừ, bạn cũng phải chú ý sức khỏe nhé.|也 要 身体'
 ],['先 · xiān · trước; 以后 · yǐhòu · sau khi; 注意 · zhùyì · chú ý (từ hỗ trợ)']),
defineHsk2Dialogue('sick-day-v1','daily','Hôm nay mình bị ốm','Bạn học gọi hỏi thăm người nghỉ học',['Bạn học','Người bị ốm'],[
 'A|你为什么没来上课？|Nǐ wèishénme méi lái shàng kè?|Sao bạn không đến học?|为什么 课',
 'B|因为我生病了，所以今天在家休息。|Yīnwèi wǒ shēngbìng le, suǒyǐ jīntiān zài jiā xiūxi.|Vì mình bị ốm, nên hôm nay nghỉ ở nhà.|因为 生病 所以 休息',
 'A|现在觉得怎么样？|Xiànzài juéde zěnmeyàng?|Bây giờ bạn thấy thế nào?|觉得',
 'B|身体很累，眼睛也不舒服。|Shēntǐ hěn lèi, yǎnjing yě bù shūfu.|Mình rất mệt, mắt cũng khó chịu.|身体 累 眼睛',
 'A|医生让你吃药了吗？|Yīshēng ràng nǐ chī yào le ma?|Bác sĩ đã bảo bạn uống thuốc chưa?|让 药',
 'B|让我每天吃两次药，一次两片。|Ràng wǒ měitiān chī liǎng cì yào, yí cì liǎng piàn.|Bảo mình uống thuốc hai lần mỗi ngày, mỗi lần hai viên.|每 两 次 药',
 'A|今天别做太多事情，先睡一会儿。|Jīntiān bié zuò tài duō shìqing, xiān shuì yíhuìr.|Hôm nay đừng làm nhiều việc, ngủ một lúc trước đi.|别 事情',
 'B|谢谢，我希望明天就能去上课。|Xièxie, wǒ xīwàng míngtiān jiù néng qù shàng kè.|Cảm ơn, mình hy vọng mai có thể đến học ngay.|希望 就 课',
 'A|有问题就给我打电话。|Yǒu wèntí jiù gěi wǒ dǎ diànhuà.|Có vấn đề gì thì gọi cho mình.|问题 给',
 'B|好，我知道了。|Hǎo, wǒ zhīdào le.|Ừ, mình biết rồi.|知道'
 ],['舒服 · shūfu · dễ chịu; 片 · piàn · viên (lượng từ) — liều thuốc chỉ là nội dung hội thoại, không phải hướng dẫn dùng thuốc.']),
defineHsk2Dialogue('clothes-present-v1','shopping','Chọn áo làm quà','Khách tìm quà cho chồng và anh trai',['Khách hàng','Người bán'],[
 'A|我想给丈夫买一件衣服。|Wǒ xiǎng gěi zhàngfu mǎi yí jiàn yīfu.|Tôi muốn mua một chiếc áo cho chồng.|给 丈夫 件',
 'B|您喜欢什么颜色的？|Nín xǐhuan shénme yánsè de?|Chị thích màu gì?|您 颜色',
 'A|红色太亮了，有白色的吗？|Hóngsè tài liàng le, yǒu báisè de ma?|Màu đỏ rực quá, có màu trắng không?|红 白',
 'B|有，这件白色的比那件黑色的便宜。|Yǒu, zhè jiàn báisè de bǐ nà jiàn hēisè de piányi.|Có, chiếc màu trắng này rẻ hơn chiếc màu đen kia.|白 比 黑 便宜',
 'A|他个子很高，这件衣服会不会太小？|Tā gèzi hěn gāo, zhè jiàn yīfu huì bu huì tài xiǎo?|Anh ấy rất cao, áo này có nhỏ quá không?|高 件',
 'B|可以让他穿一下。|Kěyǐ ràng tā chuān yíxià.|Có thể để anh ấy mặc thử.|可以 让 穿',
 'A|这件多少钱？这家店还卖手表吗？|Zhè jiàn duōshao qián? Zhè jiā diàn hái mài shǒubiǎo ma?|Chiếc này bao nhiêu tiền? Cửa hàng còn bán đồng hồ không?|还 卖 手表',
 'B|衣服一百元，手表一千元。|Yīfu yì bǎi yuán, shǒubiǎo yì qiān yuán.|Áo một trăm tệ, đồng hồ một nghìn tệ.|百 元 千',
 'A|手表太贵了，我只买衣服。|Shǒubiǎo tài guì le, wǒ zhǐ mǎi yīfu.|Đồng hồ đắt quá, tôi chỉ mua áo thôi.|贵',
 'B|好，这是我们店最好看的衣服。|Hǎo, zhè shì wǒmen diàn zuì hǎokàn de yīfu.|Vâng, đây là chiếc áo đẹp nhất ở cửa hàng chúng tôi.|最',
 'A|好，我买两件，一件送给丈夫，一件送给哥哥。|Hǎo, wǒ mǎi liǎng jiàn, yí jiàn sòng gěi zhàngfu, yí jiàn sòng gěi gēge.|Được, tôi mua hai chiếc, một tặng chồng, một tặng anh trai.|两 送 丈夫 哥哥'
 ],['亮 · liàng · sáng, rực; 个子 · gèzi · vóc dáng (từ hỗ trợ)']),
defineHsk2Dialogue('restaurant-lunch-v1','shopping','Gọi món cho bữa trưa','Hai người bạn dùng bữa ở quán ăn',['Khách hàng','Nhân viên'],[
 'A|服务员，你们这儿有什么好吃的？|Fúwùyuán, nǐmen zhèr yǒu shénme hǎochī de?|Bạn phục vụ ơi, ở đây có món gì ngon?|服务员 好吃',
 'B|今天的鱼很新鲜，羊肉也非常好吃。|Jīntiān de yú hěn xīnxiān, yángròu yě fēicháng hǎochī.|Cá hôm nay rất tươi, thịt cừu cũng rất ngon.|鱼 羊肉 非常 好吃',
 'A|那我们要一条鱼，再要一些羊肉。|Nà wǒmen yào yì tiáo yú, zài yào yìxiē yángròu.|Vậy chúng tôi gọi một con cá, thêm ít thịt cừu.|要 再',
 'B|好的，您还要喝点什么？|Hǎo de, nín hái yào hē diǎn shénme?|Vâng, anh chị còn muốn uống gì?|您 还',
 'A|我想喝咖啡，还想吃西瓜，你们卖西瓜吗？|Wǒ xiǎng hē kāfēi, hái xiǎng chī xīguā, nǐmen mài xīguā ma?|Tôi muốn cà phê, và cả dưa hấu, quán có bán dưa hấu không?|咖啡 西瓜 卖',
 'B|卖，西瓜每公斤六元。|Mài, xīguā měi gōngjīn liù yuán.|Có, dưa hấu sáu tệ một cân (kg).|每 公斤 元',
 'A|那来一公斤吧。|Nà lái yì gōngjīn ba.|Vậy cho chúng tôi một cân.|公斤 吧',
 'B|好，请等一下，鱼马上就好。|Hǎo, qǐng děng yíxià, yú mǎshàng jiù hǎo.|Vâng, xin đợi chút, cá sắp xong rồi.|等 就',
 'A|这鱼真好吃！|Zhè yú zhēn hǎochī!|Cá này thật ngon!|真 好吃',
 'B|谢谢，欢迎下次再来！|Xièxie, huānyíng xià cì zài lái!|Cảm ơn, mong anh chị lần sau lại đến!|欢迎 次 再'
 ],['新鲜 · xīnxiān · tươi; 马上 · mǎshàng · ngay, sắp (từ hỗ trợ)']),
defineHsk2Dialogue('first-class-v1','study','Buổi học đầu tiên','Học viên hỏi giáo viên một từ chưa hiểu',['Học viên','Giáo viên'],[
 'A|这是我第一次在这个教室上课。|Zhè shì wǒ dì yī cì zài zhège jiàoshì shàng kè.|Đây là lần đầu tôi học trong phòng học này.|第一 次 教室 课',
 'B|欢迎！九点开始，现在还有五分钟。|Huānyíng! Jiǔ diǎn kāishǐ, xiànzài hái yǒu wǔ fēnzhōng.|Chào mừng! Chín giờ bắt đầu, bây giờ còn năm phút.|欢迎 开始 还',
 'A|我看见大家正从门外走进来。|Wǒ kànjiàn dàjiā zhèng cóng mén wài zǒu jìn lái.|Tôi thấy mọi người đang đi từ ngoài cửa vào.|大家 从 门 外 走 进',
 'B|对，我们现在开始上课。|Duì, wǒmen xiànzài kāishǐ shàng kè.|Đúng rồi, bây giờ chúng ta bắt đầu học.|对 开始',
 'A|老师，我可以问一个问题吗？|Lǎoshī, wǒ kěyǐ wèn yí ge wèntí ma?|Thưa cô, em có thể hỏi một câu không?|可以 问 问题',
 'B|可以，请说。|Kěyǐ, qǐng shuō.|Được, em nói đi.|可以',
 'A|这个字是什么意思？我不懂。|Zhège zì shì shénme yìsi? Wǒ bù dǒng.|Chữ này nghĩa là gì? Em không hiểu.|意思 懂',
 'B|我告诉你：“近”就是不远。|Wǒ gàosu nǐ: “jìn” jiù shì bù yuǎn.|Cô giải thích nhé: “gần” nghĩa là không xa.|告诉 近 就 远',
 'B|现在请你回答第一题。|Xiànzài qǐng nǐ huídá dì yī tí.|Bây giờ em hãy trả lời câu thứ nhất.|回答 第一 题',
 'A|我懂了，这次不会错了。|Wǒ dǒng le, zhè cì bú huì cuò le.|Em hiểu rồi, lần này sẽ không sai nữa.|懂 次 错'
 ]),
defineHsk2Dialogue('exam-practice-v1','study','Cùng ôn bài thi','Hai bạn cùng sửa một câu trả lời sai',['Tiểu An','Tiểu Minh'],[
 'A|明天有考试，你准备好了吗？|Míngtiān yǒu kǎoshì, nǐ zhǔnbèi hǎo le ma?|Mai có bài thi, bạn chuẩn bị xong chưa?|考试 准备',
 'B|还没有，我有几个问题想问你。|Hái méiyǒu, wǒ yǒu jǐ ge wèntí xiǎng wèn nǐ.|Chưa, mình có vài câu muốn hỏi bạn.|还 问题 问',
 'A|可以，我们还有一个小时的时间。|Kěyǐ, wǒmen hái yǒu yí ge xiǎoshí de shíjiān.|Được, chúng ta còn một giờ.|可以 小时 时间',
 'B|这道题是什么意思？我看不懂。|Zhè dào tí shì shénme yìsi? Wǒ kàn bu dǒng.|Câu này nghĩa là gì? Mình đọc không hiểu.|题 意思 懂',
 'A|你得先看这句话，再回答问题。|Nǐ děi xiān kàn zhè jù huà, zài huídá wèntí.|Bạn phải đọc câu này trước, rồi trả lời câu hỏi.|得 再 回答 问题',
 'B|你说得太快了，请慢一点儿。|Nǐ shuō de tài kuài le, qǐng màn yìdiǎnr.|Bạn nói nhanh quá, chậm một chút nhé.|快 慢',
 'A|好，我慢慢说，你别着急。|Hǎo, wǒ mànmàn shuō, nǐ bié zháojí.|Được, mình nói chậm, bạn đừng sốt ruột.|慢 别',
 'B|这次我懂了，我刚才写错了。|Zhè cì wǒ dǒng le, wǒ gāngcái xiě cuò le.|Lần này mình hiểu rồi, vừa nãy mình viết sai.|次 懂 错',
 'A|你每天看中文报纸吗？|Nǐ měitiān kàn Zhōngwén bàozhǐ ma?|Bạn có đọc báo tiếng Trung mỗi ngày không?|每 报纸',
 'B|看，我每天看半个小时。|Kàn, wǒ měitiān kàn bàn ge xiǎoshí.|Có, mỗi ngày mình đọc nửa giờ.|每 小时',
 'A|好，我们现在开始吧。|Hǎo, wǒmen xiànzài kāishǐ ba.|Được, giờ chúng ta bắt đầu nhé.|开始 吧'
 ],['先 · xiān · trước; 句话 · jù huà · câu nói; 刚才 · gāngcái · vừa nãy; 着急 · zháojí · sốt ruột (từ hỗ trợ)']),
defineHsk2Dialogue('airport-bus-v1','travel','Tìm trạm xe ra sân bay','Hỏi đường trước chuyến bay sáng mai',['Người đi đường','Người chỉ đường'],[
 'A|你明天几点去机场？|Nǐ míngtiān jǐ diǎn qù jīchǎng?|Mai bạn đi sân bay lúc mấy giờ?|机场',
 'B|早上七点，我想坐公共汽车去。|Zǎoshang qī diǎn, wǒ xiǎng zuò gōnggòng qìchē qù.|Bảy giờ sáng, mình muốn đi xe buýt.|早上 公共汽车',
 'A|你从哪儿上车？|Nǐ cóng nǎr shàng chē?|Bạn lên xe từ đâu?|从',
 'B|从公司旁边的车站上车。|Cóng gōngsī pángbiān de chēzhàn shàng chē.|Từ trạm xe cạnh công ty.|公司 旁边',
 'A|出门以后向右走，车站就在右边。|Chū mén yǐhòu xiàng yòu zǒu, chēzhàn jiù zài yòubian.|Ra cửa rồi đi về bên phải, trạm xe ở ngay bên phải.|出 门 向 走 右边 就',
 'B|是过了那条路再向左走吗？|Shì guò le nà tiáo lù zài xiàng zuǒ zǒu ma?|Có phải qua con đường kia rồi rẽ trái không?|过 路 再 向',
 'A|不是，左边是学校，车站在右边。|Bú shì, zuǒbian shì xuéxiào, chēzhàn zài yòubian.|Không, bên trái là trường, trạm xe ở bên phải.|左边 右边',
 'B|知道了，机场离这里近吗？|Zhīdào le, jīchǎng lí zhèlǐ jìn ma?|Mình hiểu rồi, sân bay có gần đây không?|知道 机场 离 近',
 'A|不近，要坐一个小时。|Bú jìn, yào zuò yí ge xiǎoshí.|Không gần, phải đi một giờ.|近 要 小时',
 'B|好的，谢谢你告诉我怎么走。|Hǎo de, xièxie nǐ gàosu wǒ zěnme zǒu.|Được, cảm ơn bạn chỉ đường cho mình.|告诉 走'
 ],['车站 · chēzhàn · trạm xe; 以后 · yǐhòu · sau khi (từ hỗ trợ)']),
defineHsk2Dialogue('island-tickets-v1','travel','Mua vé tàu đi chơi','Một cặp vợ chồng chọn ngày đẹp trời để đi đảo',['Du khách','Nhân viên bán vé'],[
 'A|你好，我们想买两张去小岛的船票。|Nǐ hǎo, wǒmen xiǎng mǎi liǎng zhāng qù xiǎodǎo de chuánpiào.|Xin chào, chúng tôi muốn mua hai vé tàu ra đảo.|两 张 船 票',
 'B|您想什么时候出发？|Nín xiǎng shénme shíhou chūfā?|Anh chị muốn khởi hành khi nào?|您',
 'A|今天下午，还有票吗？|Jīntiān xiàwǔ, hái yǒu piào ma?|Chiều nay, còn vé không?|还 票',
 'B|有，请告诉我你们的名字。|Yǒu, qǐng gàosu wǒ nǐmen de míngzi.|Có, xin cho tôi biết tên anh chị.|告诉',
 'A|我姓王，这是我的妻子。|Wǒ xìng Wáng, zhè shì wǒ de qīzi.|Tôi họ Vương, đây là vợ tôi.|姓 妻子',
 'B|好，两张票一共一百元。|Hǎo, liǎng zhāng piào yígòng yì bǎi yuán.|Vâng, hai vé tổng cộng một trăm tệ.|两 张 百 元',
 'B|从三号门上船，别走错了。|Cóng sān hào mén shàng chuán, bié zǒu cuò le.|Lên tàu ở cửa số ba, đừng đi nhầm nhé.|从 号 门 船 别 错',
 'A|这船开得快吗？|Zhè chuán kāi de kuài ma?|Tàu này chạy nhanh không?|船 快',
 'B|不快，路上可以看风景。|Bú kuài, lù shang kěyǐ kàn fēngjǐng.|Không nhanh, trên đường có thể ngắm cảnh.|快 路 可以',
 'A|去年下雪，我们没有来。|Qùnián xià xuě, wǒmen méiyǒu lái.|Năm ngoái có tuyết nên chúng tôi không đến.|去年 雪',
 'B|今天是晴天，但是明天可能是阴天。|Jīntiān shì qíngtiān, dànshì míngtiān kěnéng shì yīntiān.|Hôm nay trời nắng, nhưng mai có thể âm u.|晴 但是 可能 阴',
 'A|那太好了，这是我第一次坐船旅游。|Nà tài hǎo le, zhè shì wǒ dì yī cì zuò chuán lǚyóu.|Thế thì tốt quá, đây là lần đầu tôi đi du lịch bằng tàu.|第一 次 船 旅游',
 'B|欢迎，祝你们玩得快乐！|Huānyíng, zhù nǐmen wán de kuàilè!|Hoan nghênh, chúc anh chị đi chơi vui vẻ!|欢迎 玩 快乐'
 ],['小岛 · xiǎodǎo · đảo nhỏ; 出发 · chūfā · khởi hành; 风景 · fēngjǐng · phong cảnh (từ hỗ trợ)']),
defineHsk2Dialogue('afternoon-sport-v1','leisure','Hẹn nhau chơi thể thao','Chọn hoạt động cho buổi chiều',['Tiểu An','Tiểu Minh'],[
 'A|下午我们去运动吧，你想打篮球还是踢足球？|Xiàwǔ wǒmen qù yùndòng ba, nǐ xiǎng dǎ lánqiú háishi tī zúqiú?|Chiều nay đi tập nhé, bạn muốn chơi bóng rổ hay đá bóng?|运动 打篮球 踢足球',
 'B|我想打篮球。你哥哥也来吗？|Wǒ xiǎng dǎ lánqiú. Nǐ gēge yě lái ma?|Mình muốn chơi bóng rổ. Anh bạn cũng đến chứ?|打篮球 哥哥 也',
 'A|他今天很忙，弟弟和妹妹会来。|Tā jīntiān hěn máng, dìdi hé mèimei huì lái.|Hôm nay anh ấy bận, em trai và em gái sẽ đến.|忙 弟弟 妹妹',
 'B|好，你弟弟跑得快吗？|Hǎo, nǐ dìdi pǎo de kuài ma?|Được, em trai bạn chạy nhanh không?|弟弟 快',
 'A|他比我快，但是我比他高。|Tā bǐ wǒ kuài, dànshì wǒ bǐ tā gāo.|Em ấy nhanh hơn mình, nhưng mình cao hơn em ấy.|比 但是 高',
 'B|你们谁打篮球打得最好？|Nǐmen shéi dǎ lánqiú dǎ de zuì hǎo?|Ai trong các bạn chơi bóng rổ giỏi nhất?|打篮球 最',
 'A|弟弟最好，我还在学。|Dìdi zuì hǎo, wǒ hái zài xué.|Em trai giỏi nhất, mình vẫn đang học.|最 还',
 'B|打完篮球，我们去游泳怎么样？|Dǎ wán lánqiú, wǒmen qù yóuyǒng zěnmeyàng?|Chơi bóng rổ xong, mình đi bơi nhé?|完 游泳',
 'A|可以，但是我现在有点累。|Kěyǐ, dànshì wǒ xiànzài yǒudiǎn lèi.|Được, nhưng giờ mình hơi mệt.|可以 累',
 'B|那我们先休息十分钟，再去。|Nà wǒmen xiān xiūxi shí fēnzhōng, zài qù.|Vậy nghỉ mười phút rồi đi.|休息 再'
 ],['还是 · háishi · hay là; 先 · xiān · trước (từ hỗ trợ)']),
defineHsk2Dialogue('birthday-party-v1','leisure','Bữa tiệc sinh nhật','Mọi người cùng hát và nhảy trong buổi tiệc',['Khách','Chủ tiệc'],[
 'A|生日快乐！这是我们送给你的礼物。|Shēngrì kuàilè! Zhè shì wǒmen sòng gěi nǐ de lǐwù.|Chúc mừng sinh nhật! Đây là quà chúng mình tặng bạn.|生日 快乐 送 给',
 'B|谢谢大家！快进来坐吧。|Xièxie dàjiā! Kuài jìn lái zuò ba.|Cảm ơn mọi người! Mau vào ngồi đi.|大家 快 进 吧',
 'A|你妹妹正在唱歌，她唱得真好听。|Nǐ mèimei zhèngzài chàng gē, tā chàng de zhēn hǎotīng.|Em gái bạn đang hát, em ấy hát hay thật.|妹妹 正在 唱歌 真',
 'B|对，她最喜欢唱歌，也喜欢跳舞。|Duì, tā zuì xǐhuan chàng gē, yě xǐhuan tiào wǔ.|Đúng, em ấy thích hát nhất, cũng thích nhảy.|对 最 唱歌 也 跳舞',
 'A|你为什么笑？|Nǐ wèishénme xiào?|Bạn cười gì thế?|为什么 笑',
 'B|因为弟弟一边跳舞，一边学小猫叫。|Yīnwèi dìdi yìbiān tiào wǔ, yìbiān xué xiǎomāo jiào.|Vì em trai vừa nhảy vừa bắt chước mèo kêu.|因为 弟弟 跳舞',
 'A|他真有意思，大家都很高兴。|Tā zhēn yǒu yìsi, dàjiā dōu hěn gāoxìng.|Em ấy vui tính thật, mọi người đều rất vui.|真 意思 大家',
 'B|来，我们一起吃生日蛋糕吧。|Lái, wǒmen yìqǐ chī shēngrì dàngāo ba.|Nào, chúng ta cùng ăn bánh sinh nhật nhé.|一起 生日 吧',
 'A|好，希望你每天都快乐！|Hǎo, xīwàng nǐ měitiān dōu kuàilè!|Được, mong bạn ngày nào cũng vui!|希望 每 快乐',
 'B|谢谢你们来，我非常高兴。|Xièxie nǐmen lái, wǒ fēicháng gāoxìng.|Cảm ơn các bạn đã đến, mình rất vui.|非常'
 ],['礼物 · lǐwù · quà; 一边…一边… · yìbiān…yìbiān… · vừa…vừa…; 蛋糕 · dàngāo · bánh kem (từ hỗ trợ)'])
];
