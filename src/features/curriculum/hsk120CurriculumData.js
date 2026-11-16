// =========================================================================
// HANZIGO HSK 1-6 CURRICULUM MATRIX & ENRICHMENT ENGINE (120 LESSONS)
// Implements Pillars 1, 2, 3, and 4:
// - Pillar 1: 100% Function Words (Pronouns/Numerals, 18 Measure Words,
//   9 Confusable Adverb Pairs, 17 Prepositions) & >= 6 real vocab/lesson
// - Pillar 2: Complete HSK 1-6 Grammar Matrix incl. 8 Faulty Sentence Types
//   (语病 Q51-60) & 1000->400 Summary Rules (缩写)
// - Pillar 3: Structured AST tokens (formula_tokens), common mistakes &
//   zero generic placeholders
// - Pillar 4: 22 Canonical HSK 1-6 Exam Question Archetypes Mapped to Lessons
// =========================================================================

import { HSK120_SUPPLEMENTAL_VOCAB } from './hsk120SupplementalVocab.js';
import { HSK_1_LESSONS } from '../../data/curriculum/hsk1Lessons.js';
import { HSK_2_LESSONS } from '../../data/curriculum/hsk2Lessons.js';
import { HSK_3_LESSONS } from '../../data/curriculum/hsk3Lessons.js';
import { HSK_4_LESSONS } from '../../data/curriculum/hsk4Lessons.js';
import { HSK_5_LESSONS } from '../../data/curriculum/hsk5Lessons.js';
import { HSK_6_LESSONS } from '../../data/curriculum/hsk6Lessons.js';
import {
  HSK_7_TO_9_LESSONS,
  HSK_7_TO_9_STAGE_CONFIGS,
} from './hsk7to9CurriculumData.js';

// -------------------------------------------------------------------------
// PILLAR 1: COMPLETE FUNCTION WORDS SYSTEM (TỪ CHỨC NĂNG BẮT BUỘC)
// -------------------------------------------------------------------------
export const FUNCTION_WORDS_SYSTEM = {
  pronounsAndNumerals: [
    {
      id: 'fn-num-er-liang',
      title: 'Phân biệt số đếm 二 (èr) vs 两 (liǎng)',
      tokens: ['二', '两'],
      ruleVi:
        'Dùng 二 khi đếm số tuần tự (一、二、三), số điện thoại/phòng, số thứ tự (第二, 二月, 二哥) và hàng đơn vị/hàng chục (十二, 二十二). Bắt buộc dùng 两 trước lượng từ thông thường (两个人, 两本书), giờ đúng (两点) và số tròn trăm/nghìn (两百, 两千).',
      examples: [
        { hanzi: '二月二十二号两点，我买了两本词典。', pinyin: 'Èryuè èrshí-èr hào liǎng diǎn, wǒ mǎi le liǎng běn cídiǎn.', meaning: 'Ngày 22 tháng 2 lúc 2 giờ, tôi đã mua hai cuốn từ điển.' },
      ],
      lessonIds: ['l-109', 'l-110', 'l-112', 'l-113', 'l-119'],
    },
    {
      id: 'fn-num-ji-duoshao',
      title: 'Phân biệt từ để hỏi 几 (jǐ) vs 多少 (duōshao)',
      tokens: ['几', '多少'],
      ruleVi:
        '几 dùng hỏi số lượng ước chừng nhỏ hơn 10 (hoặc con số đơn lẻ trong ngày tháng/giờ) và BẮT BUỘC có lượng từ ở giữa (几口人, 几本书). 多少 hỏi số lượng bất kỳ từ nhỏ đến lớn và KHÔNG bắt buộc lượng từ (多少钱, 多少人).',
      examples: [
        { hanzi: '你家有几口人？这件衣服多少钱？', pinyin: 'Nǐ jiā yǒu jǐ kǒu rén? Zhè jiàn yīfu duōshao qián?', meaning: 'Nhà bạn có mấy người? Chiếc áo này bao nhiêu tiền?' },
      ],
      lessonIds: ['l-109', 'l-111', 'l-115', 'l-119'],
    },
    {
      id: 'fn-pronoun-indefinite',
      title: 'Đại từ nghi vấn phiếm chỉ (谁…谁… / 哪儿…哪儿… / 什么…都…)',
      tokens: ['谁', '哪儿', '什么'],
      ruleVi:
        'Ngoài chức năng hỏi, 谁, 哪儿, 什么 kết hợp cùng 都 / 也 diễn tả bao quát không ngoại lệ ("ai cũng", "đâu cũng"), hoặc lặp lại hai vế hô ứng (谁…谁…, 哪儿…哪儿…) mang nghĩa phiếm chỉ điều kiện ("ai muốn làm gì thì làm / chỗ nào thích hợp thì đi chỗ ấy").',
      examples: [
        { hanzi: '谁想发言谁先举手；哪儿需要我，我就去哪儿。', pinyin: 'Shéi xiǎng fāyán shéi xiān jǔshǒu; nǎr xūyào wǒ, wǒ jiù qù nǎr.', meaning: 'Ai muốn phát biểu thì người đó giơ tay trước; nơi nào cần tôi, tôi sẽ đến nơi đó.' },
      ],
      lessonIds: ['l-108', 'l-110', 'l-219', 'l-319'],
    },
  ],

  measureWords18: [
    { hanzi: '个', pinyin: 'gè', category: '名量词', collocations: ['一个人', '两个苹果', '三个问题'], contrastNote: 'Lượng từ vạn năng, nhưng ở HSK 2–6 không nên lạm dụng 个 thay thế lượng từ chuyên biệt của sách/xe/áo.', lessonIds: ['l-109', 'l-110'] },
    { hanzi: '口', pinyin: 'kǒu', category: '名量词', collocations: ['三口人', '一口水', '一口流利的中文'], contrastNote: 'Chuyên đếm số thành viên gia đình (你家有几口人) và một ngụm nước/câu nói ngoại ngữ trôi chảy.', lessonIds: ['l-111', 'l-119'] },
    { hanzi: '本', pinyin: 'běn', category: '名量词', collocations: ['一本书', '两本词典', '这本护照'], contrastNote: 'Chuyên dùng cho ấn phẩm đóng gáy thành quyển (sách, từ điển, tạp chí, sổ tay).', lessonIds: ['l-110', 'l-119'] },
    { hanzi: '件', pinyin: 'jiàn', category: '名量词', collocations: ['一件衣服', '这件事情', '两件行李'], contrastNote: 'Chuyên đếm trang phục phần thân trên (áo sơ mi, áo khoác), sự việc trừu tượng (事情) và kiện hành lý.', lessonIds: ['l-208', 'l-302'] },
    { hanzi: '张', pinyin: 'zhāng', category: '名量词', collocations: ['两张票', '一张桌子', '几张照片'], contrastNote: 'Chuyên đếm vật có mặt phẳng rộng hoặc mỏng như vé tàu, giấy, ảnh, thẻ ngân hàng, giường, bàn.', lessonIds: ['l-115', 'l-202', 'l-301'] },
    { hanzi: '把', pinyin: 'bǎ', category: '名量词 / 动量词', collocations: ['一把椅子', '一把雨伞', '帮我一把'], contrastNote: 'Chuyên đếm vật có tay cầm/lưng tựa (ghế, ô, dao, chìa khóa) và dùng sau động từ mang nghĩa nắm/giúp một tay.', lessonIds: ['l-205', 'l-308'] },
    { hanzi: '条', pinyin: 'tiáo', category: '名量词', collocations: ['一条裤子', '一条河', '三条建议'], contrastNote: 'Dùng cho vật thuôn dài mềm (cá, sông, đường, quần, váy dài) và tin tức/quy định điều khoản.', lessonIds: ['l-204', 'l-208'] },
    { hanzi: '双', pinyin: 'shuāng', category: '名量词', collocations: ['一双鞋', '一双筷子', '一双手套'], contrastNote: 'Chỉ một đôi thành cặp phải đi cùng nhau (giày, tất, đũa, mắt, bàn tay).', lessonIds: ['l-208', 'l-210'] },
    { hanzi: '套', pinyin: 'tào', category: '名量词', collocations: ['一套房子', '一套西装', '一套教材'], contrastNote: 'Dùng cho vật đồng bộ nhiều món ghép lại (căn hộ, bộ vest, bộ sách giáo trình, bộ phương án).', lessonIds: ['l-301', 'l-305'] },
    { hanzi: '辆', pinyin: 'liàng', category: '名量词', collocations: ['一辆汽车', '两辆出租车', '那辆自行车'], contrastNote: 'Chuyên đếm phương tiện đường bộ có bánh xe (xe đạp, taxi, ô tô, xe buýt).', lessonIds: ['l-202', 'l-205'] },
    { hanzi: '趟', pinyin: 'tàng', category: '动量词', collocations: ['去一趟北京', '跑两趟银行', '这趟高铁'], contrastNote: 'Động lượng từ chỉ chuyến đi khứ hồi có đích đến (去一趟), đồng thời đếm chuyến tàu/chuyến bay theo lịch trình.', lessonIds: ['l-302', 'l-305'] },
    { hanzi: '顿', pinyin: 'dùn', category: '名量词 / 动量词', collocations: ['吃一顿饭', '批评了一顿'], contrastNote: 'Đếm bữa ăn trong ngày hoặc một trận hành động dồn dập (mắng, phê bình, đánh một trận).', lessonIds: ['l-206', 'l-210'] },
    { hanzi: '遍', pinyin: 'biàn', category: '动量词', collocations: ['看一遍书', '读三遍课文', '检查一遍'], contrastNote: 'Phân biệt 次 vs 遍: 遍 nhấn mạnh hoàn tất trọn vẹn 100% quy trình từ đầu đến cuối; 次 chỉ đếm số lượt chung.', lessonIds: ['l-219', 'l-317'] },
    { hanzi: '次', pinyin: 'cì', category: '动量词', collocations: ['第一次来中国', '去过三次', '问了一次'], contrastNote: 'Chỉ số lần hành động phát sinh nói chung, không bắt buộc làm trọn vẹn từ đầu tới cuối như 遍.', lessonIds: ['l-217', 'l-219'] },
    { hanzi: '场', pinyin: 'chǎng', category: '名量词', collocations: ['一场大雨', '一场比赛', '两场会议'], contrastNote: 'Đếm sự kiện thể thao, biểu diễn nghệ thuật, cuộc thi, cơn mưa gió tuyết kéo dài thành đợt.', lessonIds: ['l-211', 'l-403'] },
    { hanzi: '番', pinyin: 'fān', category: '动量词 / 名量词', collocations: ['一番努力', '思考了一番', '一番好意'], contrastNote: 'Dùng ở HSK 5–6 để nhấn mạnh một quá trình bỏ công suy xét, trải nghiệm hoặc lời nói/tấm lòng sâu sắc.', lessonIds: ['l-504', 'l-515'] },
    { hanzi: '门', pinyin: 'mén', category: '名量词', collocations: ['一门课程', '两门外语', '一门手艺'], contrastNote: 'Chuyên dùng đếm môn học ở trường, ngoại ngữ, chuyên ngành hoặc kỹ năng nghề truyền thống.', lessonIds: ['l-313', 'l-404'] },
    { hanzi: '项', pinyin: 'xiàng', category: '名量词', collocations: ['一项政策', '三项任务', '几项研究成果'], contrastNote: 'Lượng từ văn viết học thuật/công sở dùng cho điều khoản, hạng mục dự án, nhiệm vụ, phát minh.', lessonIds: ['l-412', 'l-611'] },
  ],

  confusableAdverbs9Pairs: [
    {
      pair: '不 vs 没',
      tokens: ['不', '没'],
      coreDifference: '不 phủ định ý muốn chủ quan, thói quen hiện tại/tương lai và tính chất cố định (Không muốn/Không phải). 没 phủ định hành động đã/đang diễn ra trong quá khứ hoặc phủ định sở hữu 有 (Chưa/Không có).',
      grammarPositionRule: '不 có thể đứng trước động từ năng nguyện/tính từ (不贵, 不想去). 没 tuyệt đối KHÔNG đi cùng 是 hay trạng thái đã hoàn tất còn có chữ 了.',
      wrongExample: '我昨天没去了医院 ❌',
      correctExample: '我昨天没去医院 ✔️ (hoặc 我明天不去医院 ✔️)',
      lessonIds: ['l-101', 'l-111', 'l-119', 'l-217'],
    },
    {
      pair: '又 vs 再',
      tokens: ['又', '再'],
      coreDifference: '又 biểu thị sự việc ĐÃ lặp lại (quá khứ/hiện tại hoàn thành) hoặc nối 2 tính chất song song (又便宜又好吃). 再 biểu thị sự việc SẼ lặp lại trong tương lai/giả định (chưa xảy ra).',
      grammarPositionRule: '又 đứng trước động từ đã xảy ra (昨天他又迟到了). 再 đứng trước động từ tương lai hoặc mệnh lệnh (明天再来 / 请再说一遍).',
      wrongExample: '他昨天再来找我了 ❌',
      correctExample: '他昨天又来找我了；请明天再联系我 ✔️',
      lessonIds: ['l-219', 'l-314', 'l-319'],
    },
    {
      pair: '就 vs 才',
      tokens: ['就', '才'],
      coreDifference: '就 nhấn mạnh thời gian SỚM, nhanh, ít, thuận lợi ngoài mong đợi (có thể dùng 了 cuối câu). 才 nhấn mạnh thời gian MUỘN, lâu, khó khăn mới đạt được (KHÔNG dùng 了 cuối câu).',
      grammarPositionRule: 'Cả hai đều là phó từ đứng sau Chủ ngữ & Thời gian, ngay trước Động từ.',
      wrongExample: '他等到晚上十点才回家了 ❌',
      correctExample: '他不到七点就到家了；他十点才到家（bỏ 了） ✔️',
      lessonIds: ['l-205', 'l-313', 'l-319'],
    },
    {
      pair: '刚 vs 刚才',
      tokens: ['刚', '刚才'],
      coreDifference: '刚 là PHÓ TỪ ("vừa mới"), chỉ đứng sau Chủ ngữ và trước Động từ. 刚才 là DANH TỪ THỜI GIAN ("vừa nãy"), đứng trước hoặc sau Chủ ngữ, có thể nhận định ngữ 的 (刚才的电话) và kết hợp giới từ (比刚才好多了).',
      grammarPositionRule: '刚 + V | 刚才 + S + V hoặc S + 刚才 + V.',
      wrongExample: '刚他打电话给你；的刚那个人 ❌',
      correctExample: '刚才他刚出门（cả hai cùng xuất hiện trong 1 câu được） ✔️',
      lessonIds: ['l-312', 'l-319'],
    },
    {
      pair: '往往 vs 经常',
      tokens: ['往往', '经常'],
      coreDifference: '往往 diễn tả QUY LUẬT có điều kiện rõ ràng rút ra từ kinh nghiệm quá khứ/hiện tại (chỉ dùng mệnh đề thường lệ, không dùng cho kế hoạch tương lai hoặc câu cầu khiến). 经常 diễn tả TẦN SUẤT hành động lặp đi lặp lại (dùng được cho quá khứ, hiện tại, tương lai).',
      grammarPositionRule: '每到周末，图书馆往往爆满（quy luật） | 以后我会经常来看你（tương lai dùng 经常）. ',
      wrongExample: '我以后往往去健身房 ❌',
      correctExample: '我以后经常去健身房；不检查语病往往容易丢分 ✔️',
      lessonIds: ['l-405', 'l-415', 'l-505'],
    },
    {
      pair: '忽然 vs 突然',
      tokens: ['忽然', '突然'],
      coreDifference: '忽然 CHỈ là Phó từ ("bỗng nhiên"), không thể làm định ngữ (忽然的事情 ❌), không nhận phó từ mức độ (很忽然 ❌) và không làm vị ngữ (太忽然了 ❌). 突然 vừa là Phó từ vừa là Tính từ nên làm được tất cả vai trò đó!',
      grammarPositionRule: '突然 + N (突然的决定 ✔️) / 很突然 ✔️ / 忽然下起雨来 ✔️.',
      wrongExample: '这是一个很忽然的消息 ❌',
      correctExample: '这是一个很突然的消息 ✔️ (hoặc 他忽然改变主意 ✔️)',
      lessonIds: ['l-410', 'l-419', 'l-517'],
    },
    {
      pair: '果然 vs 居然 / 竟然',
      tokens: ['果然', '居然', '竟然'],
      coreDifference: '果然 nghĩa là "QUẢ NHIÊN" — sự thật khớp đúng 100% với dự đoán từ trước. 居然 / 竟然 nghĩa là "THẾ MÀ LẠI" — sự thật hoàn toàn TRÁI NGƯỢC ngoài sức tưởng tượng (ngạc nhiên).',
      grammarPositionRule: 'Đứng trước động từ vị ngữ hoặc đầu phân câu kết quả.',
      wrongExample: '他从来不复习，果然考了第一名 ❌',
      correctExample: '预报说有暴雨，下午果然下了；他很少复习，居然/竟然考了第一名 ✔️',
      lessonIds: ['l-416', 'l-420', 'l-518'],
    },
    {
      pair: '难免 vs 未免',
      tokens: ['难免', '未免'],
      coreDifference: '难免 nghĩa là "KHÓ TRÁNH KHỎI" (biểu thị thông cảm khách quan rằng sai sót tất yếu dễ xảy ra trong quá trình). 未免 nghĩa là "CÓ PHẦN HƠI... QUÁ" (nhận xét chê nhẹ hành động/phán đoán nào đó bị quá đà).',
      grammarPositionRule: '难免 + 会/有 + Khó khăn | 未免 + 太 + Adj + 了.',
      wrongExample: '你只看一次就否定他，难免太草率了 ❌',
      correctExample: '初学汉语难免声调出错；仅凭一面就下定论未免太草率了 ✔️',
      lessonIds: ['l-504', 'l-510', 'l-520'],
    },
    {
      pair: '幸亏 vs 多亏',
      tokens: ['幸亏', '多亏'],
      coreDifference: 'Cả hai đều có nghĩa "may mà" giúp tránh được hậu quả xấu. 幸亏 thiên về may mắn thoát nạn/rủi ro ngẫu nhiên (hay kết cặp 幸亏…不然…). 多亏 nhấn mạnh lòng BIẾT ƠN đối với sự giúp đỡ cụ thể từ ai đó/điều gì đó (có thể mang tân ngữ 了 + Người).',
      grammarPositionRule: '幸亏 + Mệnh đề，不然… | 多亏 + (了) + Người/Cơ chế，才….',
      wrongExample: '这次幸亏你的帮助很多 ❌',
      correctExample: '幸亏带了雨伞，不然淋湿了；多亏了李老师指导，我才顺利过关 ✔️',
      lessonIds: ['l-518', 'l-519', 'l-520'],
    },
  ],

  corePrepositions17: [
    { hanzi: '在', pinyin: 'zài', meaning: 'Ở, tại (giới từ dẫn nơi chốn/thời điểm xảy ra hành động)', usageFrame: 'S + 在 + Địa điểm + V + O', contrastNote: 'Đứng TRƯỚC động từ (khác hẳn tiếng Việt đặt "ở nhà" ở cuối câu).', lessonIds: ['l-114', 'l-119'] },
    { hanzi: '从', pinyin: 'cóng', meaning: 'Từ (điểm xuất phát không gian, mốc thời gian, góc độ)', usageFrame: '从 + Điểm A + 到 + Điểm B', contrastNote: 'Phân biệt với 离: 从 chỉ hướng xuất phát (从北京出发); 离 đo khoảng cách giữa 2 điểm.', lessonIds: ['l-202', 'l-203'] },
    { hanzi: '离', pinyin: 'lí', meaning: 'Cách (khoảng cách không gian hoặc thời gian giữa A và B)', usageFrame: 'A + 离 + B + 很远 / 还有三天', contrastNote: 'KHÔNG nói 从我家离学校 ❌ — chỉ chọn 从 hoặc 离!', lessonIds: ['l-203', 'l-205'] },
    { hanzi: '往', pinyin: 'wǎng', meaning: 'Hướng về phía (chỉ hướng di chuyển: trước, sau, trái, phải, Đông, Tây)', usageFrame: '往 + Hướng + V (往左拐 / 往前走)', contrastNote: '往 thiên về phương hướng di chuyển; ít dùng với đối tượng trừu tượng như 向.', lessonIds: ['l-204', 'l-205'] },
    { hanzi: '向', pinyin: 'xiàng', meaning: 'Hướng tới, đối với (chỉ hướng hành động hướng về đối tượng cụ thể)', usageFrame: '向 + Đối tượng + V (向经理汇报 / 向客户学习)', contrastNote: 'Không nói 离 đối tượng bằng 往; các động từ 问, 学, 借, 汇报 đều ghép với 向.', lessonIds: ['l-204', 'l-415'] },
    { hanzi: '对', pinyin: 'duì', meaning: 'Đối với (chỉ thái độ, tác động hướng vào người/việc)', usageFrame: 'S + 对 + O + 感兴趣 / 有帮助 / 负责', contrastNote: '对 có thể đứng cả sau chủ ngữ (我对中文感兴趣) hoặc đầu câu (对这件事).', lessonIds: ['l-403', 'l-405'] },
    { hanzi: '对于', pinyin: 'duìyú', meaning: 'Đối với (đặt vấn đề/đối tượng cụ thể ra để phân tích đánh giá)', usageFrame: '对于 + Đối tượng，S + Quan điểm', contrastNote: 'Trang trọng hơn 对; chỉ nêu đối tượng có thái độ hay đánh giá (không nói 对于我笑 ❌, phải dùng 对我笑).', lessonIds: ['l-403', 'l-505', 'l-616'] },
    { hanzi: '关于', pinyin: 'guānyú', meaning: 'Về, liên quan đến (khoanh vùng phạm vi đề tài)', usageFrame: '关于 + Đề tài，…… / 关于……的 + Danh từ', contrastNote: 'Khác 对于: 关于 có thể làm định ngữ có 的 (关于环保的建议) và làm tiêu đề văn bản.', lessonIds: ['l-413', 'l-510'] },
    { hanzi: '把', pinyin: 'bǎ', meaning: 'Đem, lấy (xử lý đối tượng làm thay đổi trạng thái/vị trí)', usageFrame: 'S + 把 + O (Xác định) + V + Bổ ngữ / 了 / 在 / 给', contrastNote: 'Phủ định 没 và năng nguyện 想/要 phải đặt TRƯỚC 把.', lessonIds: ['l-308', 'l-309', 'l-319'] },
    { hanzi: '被', pinyin: 'bèi', meaning: 'Bị, được (câu bị động nhấn mạnh kết quả chịu tác động)', usageFrame: 'O + 被 + (Tác nhân) + V + Thành phần khác', contrastNote: 'Trong văn nói dùng 被/叫/让; riêng 叫/让 bắt buộc phải có tác nhân đi sau.', lessonIds: ['l-310', 'l-319'] },
    { hanzi: '由', pinyin: 'yóu', meaning: 'Do (ai đảm nhiệm, quyết định hoặc cấu thành từ nguyên nhân nào)', usageFrame: '本事 + 由 + Người phụ trách + Đảm nhiệm / 由A和B组成', contrastNote: 'Nhấn mạnh chủ thể thực thi trách nhiệm trong công văn, hợp đồng.', lessonIds: ['l-412', 'l-613'] },
    { hanzi: '随着', pinyin: 'suízhe', meaning: 'Cùng với, theo sự chuyển biến của (bối cảnh song hành)', usageFrame: '随着 + Danh từ biến đổi + 的发展/加深，……', contrastNote: 'Bắt buộc phía sau là cụm danh từ mang nghĩa động (thay đổi/phát triển), không đứng sau trạng thái tĩnh.', lessonIds: ['l-420', 'l-509'] },
    { hanzi: '趁', pinyin: 'chèn', meaning: 'Nhân lúc, tranh thủ lúc (cơ hội/điều kiện thuận lợi hiện có)', usageFrame: '趁(着) + Thời cơ / Lúc rảnh，+ Hành động', contrastNote: 'Hay kết hợp với tính từ thời cơ (趁热吃, 趁年轻多学习, 趁周末整理笔记).', lessonIds: ['l-515', 'l-603'] },
    { hanzi: '凭', pinyin: 'píng', meaning: 'Dựa vào, căn cứ vào (năng lực, bằng chứng, vé, giấy tờ)', usageFrame: '凭 + Bằng chứng / Năng lực，+ Kết quả', contrastNote: 'Diễn đạt điều kiện chứng minh hợp pháp hoặc thực lực (凭借实力 / 凭发票退货).', lessonIds: ['l-516', 'l-606'] },
    { hanzi: '围绕', pinyin: 'wéirào', meaning: 'Xoay quanh (định hướng thảo luận/nghiên cứu quanh chủ đề hạt nhân)', usageFrame: '围绕 + Đề tài cốt lõi，展开 / 讨论……', contrastNote: 'Thay thế chuẩn xác lối viết dài "关于……这一中心话题讨论".', lessonIds: ['l-615', 'l-617'] },
    { hanzi: '鉴于', pinyin: 'jiànyú', meaning: 'Xét thấy rằng, căn cứ vào tình huống thực tế', usageFrame: '鉴于 + Thực trạng，决定 / 采取……', contrastNote: 'Giới từ công văn trang trọng (HSK 6+), không ghép thêm 于 (KHÔNG viết 鉴于于 ❌).', lessonIds: ['l-611', 'l-614'] },
    { hanzi: '本着', pinyin: 'běnzhe', meaning: 'Trên tinh thần, dựa trên nguyên tắc (thỏa thuận, thương lượng)', usageFrame: '本着 + Nguyên tắc / Tinh thần + 的原则，……', contrastNote: 'Cực kỳ phổ biến trong điều khoản hợp đồng thương mại và biên bản ghi nhớ (MOU).', lessonIds: ['l-612', 'l-615'] },
  ],
};

// -------------------------------------------------------------------------
// PILLAR 2: COMPLETE GRAMMAR MATRIX HSK 1-6 + HSK 6 FAULTY SENTENCES & SUMMARY
// -------------------------------------------------------------------------
export const HSK6_FAULTY_SENTENCE_8_TYPES = [
  {
    code: 'YUBING-01',
    nameZh: '成分残缺 (Thiếu thành phần chủ chốt Chủ/Vị/Tân ngữ)',
    signalPattern: '通过……使…… / 在……中，使…… / 经过……让……',
    wrongSentence: '通过这次模拟考试，使我发现了自己在病句题上的薄弱环节。',
    fixedSentence: '通过这次模拟考试，我发现了自己在病句题上的薄弱环节。（hoặc bỏ 通过）',
    diagnosisTipVi: 'Thấy giới từ mở đầu (通过, 由于, 在…下, 随着) đi kèm chữ 使 / 让 ở vế sau thì câu MẤT CHỦ NGỮ 99%! Chỉ cần xóa 1 trong 2.',
  },
  {
    code: 'YUBING-02',
    nameZh: '成分赘余 (Thừa từ trùng lặp ý nghĩa)',
    signalPattern: '大约……左右 / 免费赠送 / 凯旋归来 / 切忌不要 / 心里由衷',
    wrongSentence: '这款智能词典大约有五百左右个生词，还免费赠送给VIP会员。',
    fixedSentence: '这款智能词典大约有五百个生词，还赠送给VIP会员。',
    diagnosisTipVi: 'Chú ý các chữ đã hàm chứa sẵn nghĩa của chữ đi kèm (凯旋=chiến thắng trở về nên thừa 归来; 免费=tặng không tiền nên thừa cùng 赠送).',
  },
  {
    code: 'YUBING-03',
    nameZh: '搭配不当 (Kết hợp sai Chủ-Vị, Động-Tân hoặc Định-Trung)',
    signalPattern: '提高……问题 / 改善……水平 / 培养……氛围',
    wrongSentence: '这次研讨会大大提高了同学们的学习兴趣和学习态度。',
    fixedSentence: '这次研讨会大大激发了同学们的学习兴趣，端正了学习态度。',
    diagnosisTipVi: 'Cẩn thận khi 1 động từ kéo 2 tân ngữ nối bằng 和/与/及! Phải kiểm tra cặp Động-Tân thứ 2 xem có ghép được không (提高 thái độ ❌ -> 端正态度 ✔️).',
  },
  {
    code: 'YUBING-04',
    nameZh: '语序不当 (Sai trật tự từ, định ngữ đa tầng & vị trí liên từ)',
    signalPattern: '不仅A……而且B…… (khác chủ ngữ) / 多项定语顺序',
    wrongSentence: '不仅中国经济保持韧性，而且亚洲各国也在加快数字化转型。',
    fixedSentence: '中国经济不仅保持韧性，…… ❌ -> 不仅中国经济保持韧性，而且亚洲各国…… ✔️ (Chú ý: cùng 1 chủ ngữ thì Chủ ngữ đứng TRƯỚC 不仅; khác chủ ngữ thì 不仅 đứng TRƯỚC Chủ ngữ 1).',
    diagnosisTipVi: 'Luật vàng liên từ: Hai vế CÙNG 1 chủ ngữ -> [Chủ ngữ + Liên từ]; hai vế KHÁC chủ ngữ -> [Liên từ + Chủ ngữ 1]. Định ngữ nhiều lớp theo thứ tự: Sở hữu + Thời gian/Nơi chốn + Số lượng + Động từ + Tính từ + Danh từ.',
  },
  {
    code: 'YUBING-05',
    nameZh: '句式杂糅 (Trộn lẫn 2 cấu trúc câu khác nhau làm 1)',
    signalPattern: '原因是……造成的 / 本着……为原则 / 根据……显示 / 围绕以……为中心',
    wrongSentence: '造成这次物流延迟的原因，主要是由于暴雨和人手不足引起的。',
    fixedSentence: '造成这次物流延迟的原因主要是暴雨和人手不足。（hoặc 这次物流延迟主要是由于暴雨和人手不足引起的。）',
    diagnosisTipVi: 'Gặp hai dấu hiệu câu giao nhau (原因是 + 由于…引起的) thì lập tức xác định sai do gộp 2 mẫu.',
  },
  {
    code: 'YUBING-06',
    nameZh: '两面对一面 (Vế 1 hai chiều 能否/是否/好坏 nhưng vế 2 chỉ nói 1 chiều)',
    signalPattern: '能否 / 是否 / 好坏 / 胜败 / 成败 …… Vế 2 chỉ khẳng định',
    wrongSentence: '能否坚持每天精读真题，是决定HSK六级取得高分的关键。',
    fixedSentence: '坚持每天精读真题，是决定HSK六级取得高分的关键。（hoặc 能否坚持……决定着能否取得高分。）',
    diagnosisTipVi: 'Quét mắt ngay từ khóa 能否, 是否, 好坏, 高低, 多少; nếu 1 vế có 2 mặt mà vế còn lại chỉ có 1 mặt khẳng định/tích cực thì 100% câu sai!',
  },
  {
    code: 'YUBING-07',
    nameZh: '否定失当 (Phủ định kép/ba làm đảo ngược ý nghĩa)',
    signalPattern: '避免 / 防止 / 禁止 / 切忌 / 否认 + 不…… / 难道……不……吗',
    wrongSentence: '为了防止不再发生类似的合同违约事件，法务部修订了审核标准。',
    fixedSentence: '为了防止再次发生类似的合同违约事件，法务部修订了审核标准。',
    diagnosisTipVi: 'Các động từ 避免 (tránh), 防止 (phòng ngừa), 禁止 (cấm), 切忌 (tuyệt đối tránh) bản thân đã mang sẵn nghĩa PHỦ ĐỊNH ("không để"). Cộng thêm 不 đằng sau thành phủ định kép = "phòng để đừng không xảy ra" -> NGƯỢC NGHĨA!',
  },
  {
    code: 'YUBING-08',
    nameZh: '表意不明 / 分类不当 (Mơ hồ đa nghĩa 歧义 & Liệt kê chồng chéo)',
    signalPattern: '几个学校老师 / 咬死了猎人的狗 / 和 / 菜市场卖蔬菜和苹果、香蕉等水果',
    wrongSentence: '几位学校的领导今天上午亲切看望了刚入职的新教师。',
    fixedSentence: '学校的几位领导今天上午亲切看望了刚入职的新教师。',
    diagnosisTipVi: 'Kiểm tra danh từ nối 和 (A và B cùng hạng? hay A bao hàm B?) và cụm định ngữ số từ dễ gây hiểu 2 nghĩa ("một vài lãnh đạo của 1 trường" hay "lãnh đạo của vài trường").',
  },
];

export const HSK6_SUMMARY_1000_TO_400_RULES = [
  { id: 'SX-01', title: 'Bảo toàn ngôi kể (人称统一)', ruleVi: 'Nguyên văn dùng ngôi thứ ba (他/李明) tuyệt đối giữ ngôi thứ ba; không tự ý chuyển sang 我 hoặc nhận xét chủ quan.' },
  { id: 'SX-02', title: 'Cấm bình luận cá nhân (严禁议论)', ruleVi: 'Tuyệt đối không viết câu như "我认为", "这篇故事告诉我们" — bài thi tóm tắt chỉ kể lại mạch sự kiện gốc.' },
  { id: 'SX-03', title: 'Cắt tỉa râu ria giữ xương sống (删繁就简)', ruleVi: 'Lược bỏ tính từ miêu tả cảnh vật, đối thoại xã giao thừa, ví dụ lặp lại; chỉ giữ 6 yếu tố: Ai – Lúc nào – Ở đâu – Khởi đầu – Biến cố chuyển ngoặt – Kết cục.' },
  { id: 'SX-04', title: 'Chuyển thoại trực tiếp thành gián tiếp (转述对话)', ruleVi: 'Thay lời thoại trong dấu ngoặc kép bằng câu thuật ngắn (他说…… / 拒绝了……).' },
  { id: 'SX-05', title: 'Bảo toàn tên riêng & mốc thời gian then chốt (保留核心专名)', ruleVi: '10 phút đọc văn bản 1.000 chữ phải ghi nhớ ngay tên nhân vật chính, địa điểm, hành động ngoặt ý.' },
  { id: 'SX-06', title: 'Kiểm soát dung lượng 380–420 chữ (字数合规)', ruleVi: 'Chuẩn CTI yêu cầu khoảng 400 chữ; quá ngắn (<300) hoặc quá dài (>500) và thiếu tiêu đề tự đặt đều bị trừ nặng.' },
];

export const GRAMMAR_MATRIX_HSK1_6 = {
  'HSK 1': [
    { code: 'G1-ORDER', label: 'Trật tự S + Time + Place + V + O', lessonIds: ['l-113', 'l-114', 'l-119'] },
    { code: 'G1-SHI', label: 'Câu chữ 是 & phủ định 不是', lessonIds: ['l-107', 'l-119'] },
    { code: 'G1-YOU', label: 'Câu chữ 有 / 没有', lessonIds: ['l-111', 'l-119'] },
    { code: 'G1-ADJ', label: 'Câu vị ngữ tính từ với 很 / 太……了', lessonIds: ['l-115', 'l-118'] },
    { code: 'G1-PARTICLES', label: 'Trợ từ cơ bản 的, 了, 呢, 吗', lessonIds: ['l-106', 'l-107', 'l-116', 'l-119'] },
    { code: 'G1-SHI-DE', label: 'Cấu trúc nhấn mạnh thời gian/địa điểm/cách thức 是……的', lessonIds: ['l-114', 'l-119', 'l-120'] },
    { code: 'G1-SANDHI', label: 'Biến điệu 不 (bú), 一 (yí/yì), Thanh 3 + Thanh 3', lessonIds: ['l-101', 'l-105', 'l-110'] },
  ],
  'HSK 2': [
    { code: 'G2-VBUV', label: 'Câu hỏi chính phản V 不 V / Adj 不 Adj', lessonIds: ['l-206', 'l-219'] },
    { code: 'G2-ASPECT', label: 'Bộ 3 trợ từ động thái 了 - 着 - 过', lessonIds: ['l-216', 'l-217', 'l-219'] },
    { code: 'G2-REDUPLICATE', label: 'Lặp lại động từ VV / V一V (thử, nhẹ nhàng)', lessonIds: ['l-208', 'l-219'] },
    { code: 'G2-PIVOT', label: 'Câu kiêm ngữ 请 / 让 / 叫', lessonIds: ['l-207', 'l-215', 'l-311'] },
    { code: 'G2-COMPARE', label: 'Câu so sánh hơn 比 & không bằng 没有', lessonIds: ['l-212', 'l-213', 'l-219'] },
    { code: 'G2-RESULT', label: 'Bổ ngữ kết quả (完, 好, 懂, 到, 见, 错)', lessonIds: ['l-215', 'l-219', 'l-306'] },
    { code: 'G2-DEGREE', label: 'Bổ ngữ trạng thái/trình độ V + 得 + 很 / Adj', lessonIds: ['l-208', 'l-213', 'l-315'] },
    { code: 'G2-DURATION-FREQ', label: 'Bổ ngữ thời lượng (V了+Time+O) & động lượng (V+次/遍/下)', lessonIds: ['l-201', 'l-217', 'l-219'] },
    { code: 'G2-KUAIYAO', label: 'Biểu thị sắp xảy ra 快要 / 就要……了', lessonIds: ['l-211', 'l-302'] },
  ],
  'HSK 3': [
    { code: 'G3-DIR-SIMPLE-COMP', label: 'Bổ ngữ xu hướng đơn & kép (上/下/进/出/回/过/起 + 来/去) + Nghĩa bóng (起来/出来/下去)', lessonIds: ['l-303', 'l-304', 'l-305'] },
    { code: 'G3-POTENTIAL', label: 'Bổ ngữ khả năng (看得懂/看不懂, 来得及/来不及)', lessonIds: ['l-307', 'l-319'] },
    { code: 'G3-BA-4', label: '4 mẫu câu chữ 把 (把+O+V+在/到/给/成)', lessonIds: ['l-308', 'l-309', 'l-319'] },
    { code: 'G3-PASSIVE', label: 'Câu bị động với 被 / 叫 / 让', lessonIds: ['l-310', 'l-319'] },
    { code: 'G3-EQUATIVE', label: 'So sánh ngang bằng 跟……一样', lessonIds: ['l-314', 'l-319'] },
    { code: 'G3-OR', label: 'Phân biệt lựa chọn 还是 (câu hỏi) vs 或者 (trần thuật)', lessonIds: ['l-305', 'l-318'] },
    { code: 'G3-PARALLEL', label: 'Hành động song song 一边…一边… & Tính chất kép 又…又…', lessonIds: ['l-304', 'l-314', 'l-319'] },
    { code: 'G3-PROGRESSIVE', label: 'Biến đổi tăng tiến 越来越… & 越A越B', lessonIds: ['l-314', 'l-318', 'l-319'] },
    { code: 'G3-EXCLUDE-COND', label: '除了…以外 & Điều kiện 只有…才… / 只要…就…', lessonIds: ['l-313', 'l-317', 'l-319'] },
  ],
  'HSK 4': [
    { code: 'G4-12PAIRS', label: '12 cặp liên từ phức (不仅…而且…, 尽管…但是…, 不管/无论…都…, 既然…就…, 哪怕/即使…也…, 与其…不如…, 之所以…是因为…, 一方面…另一方面…, 从而, 因此, 然而, 反而)', lessonIds: ['l-401', 'l-402', 'l-406', 'l-414', 'l-419', 'l-420'] },
    { code: 'G4-LIAN-DOU', label: 'Nhấn mạnh cực đoan 连……也/都……', lessonIds: ['l-407', 'l-420'] },
    { code: 'G4-YI-WEI', label: 'Lấy cái gì làm cái gì 以……为…… (nhầm lẫn 以为)', lessonIds: ['l-408', 'l-415'] },
    { code: 'G4-DUI-LAISHUO', label: 'Đặt góc độ bình luận 对……来说', lessonIds: ['l-403', 'l-411'] },
  ],
  'HSK 5': [
    { code: 'G5-COLLOCATION', label: 'Phối hợp từ cố định 词语搭配 (Động-Tân & Định-Trung)', lessonIds: ['l-501', 'l-503', 'l-517'] },
    { code: 'G5-REGISTER', label: 'Sắc thái khen/chê 褒义 vs 贬义 & Phân biệt từ đồng nghĩa', lessonIds: ['l-507', 'l-515', 'l-520'] },
    { code: 'G5-PARTICLES', label: '11 Hư từ văn viết cao cấp (何必, 何况, 况且, 幸亏, 索性, 偏偏, 简直, 依然, 可见, 总之, 一旦)', lessonIds: ['l-502', 'l-504', 'l-505', 'l-518', 'l-520'] },
    { code: 'G5-IDIOMS', label: 'Thành ngữ 4 chữ trung cấp trong diễn ngôn xã hội & văn hóa', lessonIds: ['l-511', 'l-514', 'l-520'] },
  ],
  'HSK 6': [
    { code: 'G6-YUBING-8', label: '8 dạng câu bệnh HSK 6 (Q51-60: 成分残缺, 成分赘余, 搭配不当, 语序不当, 句式杂糅, 两面对一面, 否定失当, 表意不明/分类不当)', lessonIds: ['l-618', 'l-620'] },
    { code: 'G6-SUMMARY-400', label: 'Kỹ thuật viết tóm tắt 1.000 chữ xuống 400 chữ (缩写)', lessonIds: ['l-619', 'l-620'] },
    { code: 'G6-IDIOMS-50', label: '50 Thành ngữ HSK 6 & Thành ngữ điển cố văn viết', lessonIds: ['l-601', 'l-604', 'l-605'] },
  ],
};

// -------------------------------------------------------------------------
// PILLAR 4: ALL 22 HSK 1-6 EXAM QUESTION ARCHETYPES MAPPED TO LESSONS
// -------------------------------------------------------------------------
export const HSK_EXAM_22_QUESTION_TYPES = [
  // HSK 1 (Parts 1-8 condensed into core canonical archetypes, covering all 4 Listening + 4 Reading)
  { code: 'HSK1-L1', level: 'HSK 1', skill: 'Nghe', name: 'Nghe cụm từ/câu đơn nhìn tranh chọn Đúng/Sai', targetLessons: ['l-101', 'l-105', 'l-120'], examIds: ['hsk1-mock-01', 'hsk1-official-sample-01'] },
  { code: 'HSK1-L23', level: 'HSK 1', skill: 'Nghe', name: 'Nghe câu đơn & đối thoại 2 lượt chọn tranh A/B/C', targetLessons: ['l-108', 'l-110', 'l-120'], examIds: ['hsk1-mock-01', 'hsk1-mock-02'] },
  { code: 'HSK1-L4', level: 'HSK 1', skill: 'Nghe', name: 'Nghe câu hỏi trực tiếp chọn đáp án nhanh (A/B/C)', targetLessons: ['l-113', 'l-115', 'l-120'], examIds: ['hsk1-mock-01', 'hsk1-mock-03'] },
  { code: 'HSK1-R1234', level: 'HSK 1', skill: 'Đọc', name: 'Đọc tranh đúng/sai, ghép câu–tranh, hỏi–đáp A–F & điền từ', targetLessons: ['l-111', 'l-114', 'l-119', 'l-120'], examIds: ['hsk1-mock-01', 'hsk1-reading-02'] },

  // HSK 2
  { code: 'HSK2-L1', level: 'HSK 2', skill: 'Nghe', name: 'Nghe câu trần thuật đối chiếu tranh Đúng/Sai', targetLessons: ['l-202', 'l-210', 'l-220'], examIds: ['hsk2-mock-01', 'hsk2-official-ref-01'] },
  { code: 'HSK2-L234', level: 'HSK 2', skill: 'Nghe', name: 'Nghe hội thoại ngắn/dài xác định thời gian, địa điểm & mục đích', targetLessons: ['l-201', 'l-206', 'l-214', 'l-220'], examIds: ['hsk2-mock-01', 'hsk2-listening-02'] },
  { code: 'HSK2-R123', level: 'HSK 2', skill: 'Đọc', name: 'Đọc nối tranh, điền từ vào chỗ trống & phán đoán Đúng/Sai ngắn', targetLessons: ['l-203', 'l-212', 'l-219', 'l-220'], examIds: ['hsk2-mock-01', 'hsk2-mock-02'] },
  { code: 'HSK2-R4', level: 'HSK 2', skill: 'Đọc', name: 'Ghép cặp hội thoại hỏi–đáp logic sinh hoạt A–E', targetLessons: ['l-209', 'l-215', 'l-218', 'l-220'], examIds: ['hsk2-mock-01', 'hsk2-mock-03'] },

  // HSK 3
  { code: 'HSK3-L123', level: 'HSK 3', skill: 'Nghe', name: 'Nghe tranh, phán đoán Đúng/Sai & đối thoại suy luận ngụ ý', targetLessons: ['l-301', 'l-305', 'l-319', 'l-320'], examIds: ['hsk3-mock-01', 'hsk3-official-ref-01'] },
  { code: 'HSK3-R123', level: 'HSK 3', skill: 'Đọc', name: 'Ghép cặp câu, điền từ (的/地/得, lượng từ) & đọc đoạn ngắn 100 chữ', targetLessons: ['l-308', 'l-315', 'l-318', 'l-320'], examIds: ['hsk3-mock-01', 'hsk3-mock-02'] },
  { code: 'HSK3-W1', level: 'HSK 3', skill: 'Viết', name: 'Sắp xếp các từ lộn xộn thành câu chuẩn (把 / 被 / 比)', targetLessons: ['l-303', 'l-308', 'l-310', 'l-320'], examIds: ['hsk3-mock-01', 'hsk3-mock-03'] },
  { code: 'HSK3-W2', level: 'HSK 3', skill: 'Viết', name: 'Nhìn Pinyin viết chữ Hán chính xác vào chỗ trống', targetLessons: ['l-306', 'l-312', 'l-316', 'l-320'], examIds: ['hsk3-mock-01', 'hsk3-mock-03'] },

  // HSK 4
  { code: 'HSK4-L123', level: 'HSK 4', skill: 'Nghe', name: 'Nghe phán đoán Đúng/Sai, đối thoại 2 câu & độc thoại 4–5 câu', targetLessons: ['l-405', 'l-411', 'l-420'], examIds: ['hsk4-mock-01', 'hsk4-official-ref-01'] },
  { code: 'HSK4-R1', level: 'HSK 4', skill: 'Đọc', name: 'Chọn từ điền khuyết câu đơn & hội thoại (liên từ / phó từ)', targetLessons: ['l-401', 'l-406', 'l-414'], examIds: ['hsk4-mock-01', 'hsk4-mock-02'] },
  { code: 'HSK4-R2', level: 'HSK 4', skill: 'Đọc', name: 'Sắp xếp thứ tự câu A-B-C thành đoạn mạch lạc (排列顺序)', targetLessons: ['l-402', 'l-413', 'l-420'], examIds: ['hsk4-mock-01', 'hsk4-official-ref-01'] },
  { code: 'HSK4-R3', level: 'HSK 4', skill: 'Đọc', name: 'Đọc hiểu đoạn văn 200 chữ suy luận chủ đề & thái độ', targetLessons: ['l-409', 'l-416', 'l-420'], examIds: ['hsk4-mock-01', 'hsk4-mock-03'] },
  { code: 'HSK4-W12', level: 'HSK 4', skill: 'Viết', name: 'Sắp xếp từ thành câu + Nhìn tranh kèm từ gợi ý viết câu hoàn chỉnh', targetLessons: ['l-407', 'l-417', 'l-420'], examIds: ['hsk4-mock-01', 'hsk4-mock-03'] },

  // HSK 5
  { code: 'HSK5-L12', level: 'HSK 5', skill: 'Nghe', name: 'Nghe hội thoại dài & đoạn độc thoại xã hội văn hóa 20 câu', targetLessons: ['l-505', 'l-511', 'l-520'], examIds: ['hsk5-mock-01', 'hsk5-official-ref-01'] },
  { code: 'HSK5-R123', level: 'HSK 5', skill: 'Đọc', name: 'Điền khuyết đoạn văn 4 lỗ (完形填空), tìm câu đồng nhất ý & đọc sâu', targetLessons: ['l-501', 'l-507', 'l-515', 'l-520'], examIds: ['hsk5-mock-01', 'hsk5-mock-02'] },
  { code: 'HSK5-W123', level: 'HSK 5', skill: 'Viết', name: 'Sắp xếp câu phức + Đoạn văn 80 chữ dùng 5 từ khóa / theo tranh', targetLessons: ['l-506', 'l-512', 'l-519', 'l-520'], examIds: ['hsk5-mock-01', 'hsk5-mock-03'] },

  // HSK 6
  { code: 'HSK6-L-R', level: 'HSK 6', skill: 'Nghe & Đọc', name: 'Nghe tin tức/tọa đàm 50 câu & Chữa 10 câu bệnh 语病 (Q51-60) + Chọn câu điền đoạn', targetLessons: ['l-616', 'l-618', 'l-620'], examIds: ['hsk6-full-101-01', 'hsk6-mock-01'] },
  { code: 'HSK6-W1', level: 'HSK 6', skill: 'Viết', name: 'Đọc 1.000 chữ trong 10 phút rồi viết tóm tắt 400 chữ (缩写)', targetLessons: ['l-619', 'l-620'], examIds: ['hsk6-full-101-01', 'hsk6-mock-01'] },
];

// -------------------------------------------------------------------------
// PER-LESSON GRAMMAR SPECIALIZATIONS FOR HSK 1-6 CORE MILESTONES
// -------------------------------------------------------------------------
const LESSON_GRAMMAR_ENHANCEMENTS = {
  'l-101': {
    code: 'G1-SANDHI-BU',
    formula_tokens: [
      { token: 'Chủ ngữ', role: 'Chủ thể', note: '我 / 他 / 这' },
      { token: '不 (bù -> bú trước thanh 4)', role: 'Phó từ phủ định', note: 'Biến thành thanh 2 trước 是, 去, 对, 累' },
      { token: 'Động từ / Tính từ', role: 'Vị ngữ', note: 'Biểu thị ý muốn/trạng thái' },
    ],
    masteryNotes: [
      'Quy tắc biến điệu 不: Đứng trước thanh 1/2/3 giữ bù; đứng trước thanh 4 đọc bú (不是 bú shì, 不去 bú qù). Phân biệt phủ định khách quan với 没 (quá khứ / 有).',
    ],
  },
  'l-105': {
    code: 'G1-SANDHI-ALL',
    formula_tokens: [
      { token: 'Thanh 3 + Thanh 3 -> Thanh 2 + Thanh 3', role: 'Biến điệu thanh 3', note: '你好 nǐhǎo -> ní hǎo' },
      { token: '一: đứng lẻ yī | + T4 -> yí | + T1/2/3 -> yì', role: 'Biến điệu 一', note: '一个 yí gè | 一天 yì tiān' },
      { token: '不: giữ bù | + T4 -> bú', role: 'Biến điệu 不', note: '好不好 hǎo bu hǎo' },
    ],
    masteryNotes: [
      'Tổng hợp đủ 3 biến điệu HSK 1: (1) Thanh 3 + Thanh 3 -> Thanh 2 + Thanh 3; (2) 一 biến yí trước thanh 4, biến yì trước thanh 1/2/3; (3) 不 biến bú trước thanh 4.',
    ],
  },
  'l-109': {
    code: 'G1-NUM-PRONOUNS',
    formula_tokens: [
      { token: '二 (đếm/thứ tự: 二月, 十二)', role: 'Số đếm trừu tượng', note: 'Không đứng trước lượng từ thông thường' },
      { token: '两 + Lượng từ (两个人, 两本书)', role: 'Số lượng cụ thể', note: 'Luôn dùng 两 trước 个, 本, 张, 点' },
      { token: '几 + Lượng từ (<10) vs 多少 (mọi số)', role: 'Từ nghi vấn số', note: '几岁 / 多少钱' },
    ],
    masteryNotes: [
      'Phân biệt 二 vs 两, 几 vs 多少 và đại từ nghi vấn phiếm chỉ 谁…谁…, 哪儿…哪儿… ngay từ nền tảng HSK 1.',
    ],
  },
  'l-119': {
    code: 'G1-ORDER-SHIDE',
    formula_tokens: [
      { token: 'S + Thời gian + 在 Địa điểm + V + O', role: 'Trật tự câu chuẩn', note: 'Thời gian trước Địa điểm, Địa điểm trước Hành động' },
      { token: 'S + 是 + [Thời gian/Địa điểm/Cách thức] + V + 的', role: 'Cấu trúc nhấn mạnh 是……的', note: 'Nhấn mạnh tình tiết việc đã xảy ra' },
      { token: '的 / 了 / 呢 / 吗', role: '4 trợ từ cốt lõi HSK 1', note: 'Sở hữu 的, hoàn tất 了, hỏi tiếp 呢, câu hỏi 吗' },
    ],
    masteryNotes: [
      'Khi kể việc đã xảy ra và muốn nhấn mạnh đi bằng gì, ở đâu hay lúc nào, bắt buộc dùng khung 是……的 (ví dụ: 我是坐飞机去北京的).',
    ],
  },
  'l-206': {
    code: 'G2-VBUV',
    formula_tokens: [
      { token: 'S + V 不 V + O? / S + Adj 不 Adj?', role: 'Câu hỏi chính phản (HSK 2)', note: '去不去 / 辣不辣 / 喜欢不喜欢 (KHÔNG thêm 吗 cuối câu)' },
      { token: 'Động từ 2 âm tiết: AB 不 AB hoặc A 不 AB', role: 'Biến thể khẩu ngữ', note: '喜不喜欢 hoặc 喜欢不喜欢 đều đúng' },
    ],
    masteryNotes: [
      'Câu hỏi chính phản V 不 V đã tự mang nghĩa nghi vấn Có... không?, tuyệt đối KHÔNG kết thúc bằng trợ từ 吗!',
    ],
  },
  'l-208': {
    code: 'G2-VV-DEGREE',
    formula_tokens: [
      { token: 'V + 一下 / VV (看看, 试试, 看一看)', role: 'Lặp lại động từ', note: 'Giảm nhẹ ngữ khí, làm thử chốc lát' },
      { token: 'S + V + 得 + 很 / 非常 + Adj', role: 'Bổ ngữ trạng thái/mức độ', note: 'Đánh giá chất lượng hành động' },
    ],
    masteryNotes: [
      'Ghi nhớ cặp đôi giao tiếp HSK 2: 试一试 / 试试 (mặc thử xem) và bổ ngữ trình độ 她说中文说得很流利.',
    ],
  },
  'l-215': {
    code: 'G2-PIVOTAL',
    formula_tokens: [
      { token: 'S1 + 请 / 让 / 叫 + O/S2', role: 'Động từ sai khiến (Kiêm ngữ)', note: 'O vừa là tân ngữ V1 vừa là chủ ngữ V2' },
      { token: 'V2 + Tân ngữ 2', role: 'Hành động được nhờ/sai bảo', note: '请他多喝水 / 让医生看看' },
    ],
    masteryNotes: [
      'Câu kiêm ngữ 请/让/叫 phân biệt sắc thái: 请 (lịch sự mời nhờ), 让 (cho phép/bảo nhẹ), 叫 (yêu cầu/gọi bảo).',
    ],
  },
  'l-219': {
    code: 'G2-ASPECT-COMPLEMENTS',
    formula_tokens: [
      { token: '了 (hoàn tất) vs 着 (duy trì) vs 过 (trải nghiệm)', role: '3 trợ từ động thái', note: 'V+了/着/过' },
      { token: 'V + 完/好/懂/到/见/错', role: '6 Bổ ngữ kết quả HSK 2', note: 'Phủ định dùng 没(有) bỏ 了' },
      { token: 'V +了+ Thời lượng / Số lần (分钟, 次, 遍)', role: 'Bổ ngữ thời lượng & động lượng', note: '学了两年中文 / 去过三次' },
      { token: 'A 没有 B (那么) + Adj', role: 'So sánh kém hơn 没有', note: 'Khác A 比 B + Adj' },
    ],
    masteryNotes: [
      'Tích hợp toàn bộ ngữ pháp xương sống HSK 2: V不V, 了-着-过, 比 vs 没有, bổ ngữ kết quả và thời lượng/động lượng.',
    ],
  },
  'l-303': {
    code: 'G3-DIRECTIONAL-SIMPLE-FIG',
    formula_tokens: [
      { token: 'V + 上/下/进/出/回/过/起 + 来/去', role: 'Bổ ngữ xu hướng', note: '来 hướng về người nói; 去 ra xa người nói' },
      { token: '起来 (bắt đầu) / 出来 (nhận ra) / 下去 (tiếp tục)', role: 'Nghĩa bóng mở rộng', note: '想起来了, 看出来了, 坚持下去' },
    ],
    masteryNotes: [
      'Không chỉ dịch nghĩa đen đi lên/đi xuống, HSK 3 khảo thí mạnh nghĩa mở rộng: 下起雨来 (bắt đầu mưa), 听出来 (nghe nhận ra), 坚持下去 (kiên trì tiếp tục).',
    ],
  },
  'l-307': {
    code: 'G3-POTENTIAL',
    formula_tokens: [
      { token: 'V + 得 + Kết quả/Xu hướng (khẳng định)', role: 'Có khả năng làm nổi', note: '看得懂, 买得起, 来得及' },
      { token: 'V + 不 + Kết quả/Xu hướng (phủ định)', role: 'Không đủ năng lực/điều kiện', note: '看不懂, 来不及, 受不了' },
    ],
    masteryNotes: [
      'Bổ ngữ khả năng khác 能+V ở chỗ nhấn mạnh điều kiện khách quan/thể lực có cho phép hoàn tất kết quả đó hay không (cố định: 来得及 vs 来不及).',
    ],
  },
  'l-308': {
    code: 'G3-BA-4-PATTERNS',
    formula_tokens: [
      { token: 'Mẫu 1: S + 把 + O + V + 在 + Nơi chốn', role: 'Chuyển vị trí tới đâu', note: '把护照放在桌子上' },
      { token: 'Mẫu 2: S + 把 + O + V + 到 + Điểm đích/Thời điểm', role: 'Đưa tới điểm đến', note: '把会议改到下周三' },
      { token: 'Mẫu 3: S + 把 + O + V + 给 + Người nhận', role: 'Chuyển giao cho ai', note: '把文件发给经理' },
      { token: 'Mẫu 4: S + 把 + O1 + V + 成 + O2', role: 'Biến đổi/dịch thành cái khác', note: '把中文翻译成越南语' },
    ],
    masteryNotes: [
      'Nắm trọn 4 mẫu kết cấu câu chữ 把 trọng điểm HSK 3 (在 / 到 / 给 / 成) và quy tắc đặt 没 / 想 / 要 đứng TRƯỚC 把.',
    ],
  },
  'l-319': {
    code: 'G3-COMPREHENSIVE-CONNECTORS',
    formula_tokens: [
      { token: '跟……一样 | 越来越… | 越A越B', role: 'Cấu trúc so sánh & tăng tiến', note: '中文越说越流利' },
      { token: '一边…一边… | 又…又… | 除了…以外', role: 'Cấu trúc song hành & bao gồm/loại trừ', note: '除了小王以外，大家都去了' },
      { token: '还是 (hỏi) vs 或者 (trần thuật) | 只有…才… vs 只要…就…', role: 'Liên từ lựa chọn & điều kiện', note: 'Chỉ có... mới... vs Chỉ cần... thì...' },
    ],
    masteryNotes: [
      'Tổng hợp phân biệt cặp hay nhầm: 还是 vs 或者 và điều kiện ắt có đủ 只有…才… (điều kiện duy nhất) vs 只要…就… (điều kiện đủ).',
    ],
  },
  'l-401': {
    code: 'G4-CONJUNCTIONS-12PAIRS',
    formula_tokens: [
      { token: 'Tăng tiến/Song hành', role: '不仅……而且…… | 一方面……另一方面…… | 从而', note: 'Củng cố hai chiều lập luận' },
      { token: 'Chuyển ngoặt/Nhượng bộ', role: '尽管……但是…… | 然而 | 反而 | 哪怕/即使……也……', note: 'Đảo chiều bất ngờ hoặc giả định nhượng bộ' },
      { token: 'Nhân quả/Điều kiện', role: '既然……就…… | 之所以……是因为…… | 因此 | 不管/无论……都……', note: 'Chốt nguyên nhân-hệ quả chặt chẽ' },
    ],
    masteryNotes: [
      'Bắt buộc ghi nhớ đủ 12 cặp liên từ phức HSK 4 (不仅……而且……, 尽管……但是……, 不管/无论……都……, 既然……就……, 哪怕/即使……也……, 与其……不如……, 之所以……是因为……, 一方面……另一方面……, 从而, 因此, 然而, 反而) để giải bài tập sắp xếp câu A-B-C (排列顺序) đạt độ chính xác tuyệt đối.',
    ],
  },
  'l-407': {
    code: 'G4-LIAN-YE-DOU',
    formula_tokens: [
      { token: '连 + Đối tượng cực đoan nhất + 也 / 都 + Vị ngữ', role: 'Nhấn mạnh "Ngay cả... cũng..."', note: '连小孩儿都懂的道理' },
      { token: '一 + Lượng từ + 也/都 + 不/没 + V', role: 'Phủ định tuyệt đối', note: '连一分钱也没花' },
    ],
    masteryNotes: [
      'Cấu trúc 连……也/都…… kết hợp với Một chút cũng không (一点儿也不) là trọng tâm phần Viết HSK 4.',
    ],
  },
  'l-408': {
    code: 'G4-YI-WEI-LAISHUO',
    formula_tokens: [
      { token: '以 + A + 为 + B', role: 'Lấy A làm B (tiêu chuẩn/trọng tâm)', note: '以客户需求为标准 (KHÔNG nhầm động từ 以为 "tưởng rằng")' },
      { token: '对 + Chủ thể + 来说', role: 'Xét từ góc độ của ai', note: '对外国留学生来说，声调最难' },
    ],
    masteryNotes: [
      'Phân biệt cặp 以……为…… (lấy làm cơ sở) và động từ 以为 (lầm tưởng rằng), kết hợp khung nêu góc nhìn 对……来说.',
    ],
  },
  'l-505': {
    code: 'G5-WRITTEN-PARTICLES-11',
    formula_tokens: [
      { token: 'Hư từ hỏi tu từ/tăng tiến', role: '何必 (cần gì phải) | 何况 / 况且 (huống hồ)', note: 'Tăng chiều sâu thuyết phục' },
      { token: 'Hư từ thái độ/nhấn mạnh', role: '索性 (dứt khoát) | 偏偏 (cố tình trái khoáy) | 简直 (quả thực như)', note: 'Sắc thái biểu cảm tinh tế' },
      { token: 'Hư từ kết nối/kết luận', role: '幸亏 | 依然 | 可见 | 总之 | 一旦 (hễ một khi)', note: 'Chuẩn bài viết đoạn văn 80 chữ HSK 5' },
    ],
    masteryNotes: [
      'HSK 5 chuyển từ khẩu ngữ sang hư từ văn viết sắc nét: nắm vị trí và sắc thái của toàn bộ 11 hư từ 何必, 何况, 况且, 幸亏, 索性, 偏偏, 简直, 依然, 可见, 总之, 一旦.',
    ],
  },
  'l-515': {
    code: 'G5-COLLOCATION-CONNOTATION',
    formula_tokens: [
      { token: '词语搭配 (Động-Tân / Định-Trung)', role: 'Phối hợp tự nhiên chuẩn bản ngữ', note: '提高水平 vs 解决困难 vs 丰富经验' },
      { token: '褒义 (Khen) vs 贬义 (Chê)', role: 'Phân biệt sắc thái từ đồng nghĩa', note: '果断 (tích cực) vs 武断 (tiêu cực); 鼓励 vs 煽动' },
    ],
    masteryNotes: [
      'Trong Đọc hiểu Phần 1 HSK 5 (điền khuyết đoạn văn), 60% đáp án phân định dựa vào phối hợp Động-Tân và sắc thái khen/chê của 2 từ cận nghĩa.',
    ],
  },
  'l-618': {
    code: 'G6-YUBING-8-TYPES',
    formula_tokens: [
      { token: 'Bước 1: 抓主干 (Khóa Chủ - Vị - Tân)', role: 'Phát hiện 成分残缺 / 搭配不当 / 句式杂糅', note: 'Loại 3/8 bệnh câu ngay từ khung chính' },
      { token: 'Bước 2: 查枝叶 (Soát Định - Trạng - Liên từ)', role: 'Phát hiện 成分赘余 / 语序不当 / 两面对一面 / 否定失当 / 歧义', note: 'Quét 能否, 防止+不, 通过+使, 大约+左右' },
    ],
    masteryNotes: [
      'Quét đủ 8 dạng bệnh câu kinh điển Q51–60 trong đề thi HSK 6 để đạt 8–10/10 câu khó nhất bài thi.',
    ],
  },
  'l-619': {
    code: 'G6-SUMMARY-400',
    formula_tokens: [
      { token: '10 phút đọc 1.000 chữ', role: 'Khóa nhân vật, thời gian, bước ngoặt, kết cục', note: 'Không được cầm bút ghi chép trong lúc đọc!' },
      { token: '35 phút viết 380–420 chữ (缩写)', role: 'Giữ ngôi kể thứ ba, bỏ thoại/cảnh/议论, đặt tiêu đề chuẩn', note: 'Tuyệt đối cấm viết 我认为 / 告诉我们' },
    ],
    masteryNotes: [
      'Áp dụng 6 quy tắc thép của phần thi Viết HSK 6: Tóm tắt trung thực nguyên tác từ 1.000 chữ xuống gọn 400 chữ.',
    ],
  },
};

// -------------------------------------------------------------------------
// CURATED DOMAIN EXTENSION MAP (GUARANTEES >= 6 REAL VOCAB PER LESSON)
// Non-overlapping: HSK 1-3 strictly pulls HSK 1-3 words; HSK 4-6 strictly pulls HSK 4-6 words
// -------------------------------------------------------------------------
const LESSON_SUPPLEMENTAL_HANZI = {
  // HSK 1 (< 6 in step2_vocabulary)
  'l-101': ['不'],
  'l-102': ['一', '十'],
  'l-103': ['四', '吃'],
  'l-104': ['我', '你'],
  'l-105': ['个', '他'],
  'l-106': ['您', '请'],
  'l-107': ['呢', '她'],
  'l-108': ['谁'],
  'l-109': ['二', '两'],
  'l-110': ['我们', '这', '那'],
  'l-119': ['在', '的'],
  'l-120': ['对不起', '没关系'],
  // HSK 2 (< 6)
  'l-205': ['从', '离', '往'],
  'l-210': ['双', '条', '顿'],
  'l-212': ['比'],
  'l-213': ['最', '更'],
  'l-215': ['让', '多'],
  'l-216': ['着'],
  'l-217': ['过', '次'],
  'l-218': ['就'],
  'l-219': ['又', '再'],
  'l-220': ['才', '辆'],
  // HSK 3 (< 6)
  'l-304': ['把'],
  'l-305': ['趟', '套', '刚才'],
  'l-306': ['完'],
  'l-307': ['得', '能'],
  'l-308': ['张'],
  'l-309': ['寄', '送'],
  'l-310': ['被'],
  'l-311': ['向'],
  'l-312': ['刚', '遍'],
  'l-313': ['才'],
  'l-314': ['又'],
  'l-315': ['的', '地', '得'],
  'l-316': ['场', '画'],
  'l-317': ['关于', '从'],
  'l-318': ['其实', '虽然'],
  'l-319': ['谁', '再'],
  'l-320': ['努力', '简单'],
  // HSK 4 (< 6)
  'l-401': ['往往', '介绍'],
  'l-402': ['既然', '安排'],
  'l-403': ['对于', '精彩'],
  'l-404': ['积累', '顺利'],
  'l-405': ['礼貌', '态度'],
  'l-406': ['不管', '经验'],
  'l-407': ['竟然', '居然'],
  'l-408': ['按照', '过程'],
  'l-409': ['忽然', '旅游'],
  'l-410': ['果然', '千万'],
  'l-411': ['联系', '解释'],
  'l-412': ['由', '项'],
  'l-413': ['关于', '保证'],
  'l-414': ['因此', '负责'],
  'l-415': ['向', '商量'],
  'l-416': ['果然', '经历'],
  'l-417': ['随着', '流利'],
  'l-418': ['安全', '保护'],
  'l-419': ['尽管', '放弃'],
  'l-420': ['优秀', '考虑'],
  // HSK 5 (< 6)
  'l-501': ['菜系', '烹饪'],
  'l-502': ['风味', '清淡'],
  'l-503': ['品茶', '讲究'],
  'l-504': ['难免', '番'],
  'l-505': ['总之', '经典'],
  'l-506': ['甚至', '深刻'],
  'l-507': ['未免', '挑战'],
  'l-508': ['反而', '缓解'],
  'l-509': ['从而', '导致'],
  'l-510': ['围绕', '独特'],
  'l-511': ['传统', '贡献'],
  'l-512': ['象征', '团圆'],
  'l-513': ['历史', '故事'],
  'l-514': ['吉祥', '风俗'],
  'l-515': ['趁', '温故知新'],
  'l-516': ['凭', '手续'],
  'l-517': ['忽然', '检查'],
  'l-518': ['幸亏', '多亏'],
  'l-519': ['遵照', '仔细'],
  'l-520': ['半途而废', '循序渐进'],
  // HSK 6 (< 6)
  'l-601': ['坚持不懈', '废寝忘食'],
  'l-602': ['彬彬有礼', '和睦相处'],
  'l-603': ['争分夺秒', '千载难逢'],
  'l-604': ['塞翁失马', '画蛇添足'],
  'l-605': ['画龙点睛', '守株待兔'],
  'l-606': ['招聘', '简历'],
  'l-607': ['经验', '成果'],
  'l-608': ['克服', '转化'],
  'l-609': ['工资', '奖金'],
  'l-610': ['胸有成竹', '千里之行'],
  'l-611': ['鉴于', '项'],
  'l-612': ['本着', '合同'],
  'l-613': ['由', '按照'],
  'l-614': ['条款', '仲裁'],
  'l-615': ['围绕', '促进'],
  'l-616': ['对于', '市场'],
  'l-617': ['突破', '趋势'],
  'l-618': ['严谨', '修改'],
  'l-619': ['概括', '凝练'],
  'l-620': ['融会贯通', '精益求精'],
};

// Direct fallback-free dictionary records for a handful of HSK 1-6 terms referenced above
// in case any isn't already inside HSK120_SUPPLEMENTAL_VOCAB
const INLINE_SUPPLEMENTAL_DEFS = {
  不: { hanzi: '不', pinyin: 'bù', hanviet: 'Bất', pos: 'Phó từ', meaning: 'Không (biến điệu bú trước thanh 4)', level: 'HSK 1', example: { hanzi: '我不是日本人，我是越南人。', pinyin: 'Wǒ bú shì Rìběnrén, wǒ shì Yuènánrén.', meaning: 'Tôi không phải người Nhật, tôi là người Việt Nam.' } },
  一: { hanzi: '一', pinyin: 'yī', hanviet: 'Nhất', pos: 'Số từ', meaning: 'Một (biến điệu yí/yì khi ghép từ)', level: 'HSK 1', example: { hanzi: '我买了一本书。', pinyin: 'Wǒ mǎi le yì běn shū.', meaning: 'Tôi đã mua một quyển sách.' } },
  十: { hanzi: '十', pinyin: 'shí', hanviet: 'Thập', pos: 'Số từ', meaning: 'Mười (10)', level: 'HSK 1', example: { hanzi: '现在是十点十分。', pinyin: 'Xiànzài shì shí diǎn shí fēn.', meaning: 'Bây giờ là mười giờ mười phút.' } },
  四: { hanzi: '四', pinyin: 'sì', hanviet: 'Tứ', pos: 'Số từ', meaning: 'Bốn (4)', level: 'HSK 1', example: { hanzi: '教室里有四个人。', pinyin: 'Jiàoshì lǐ yǒu sì gè rén.', meaning: 'Trong phòng học có bốn người.' } },
  吃: { hanzi: '吃', pinyin: 'chī', hanviet: 'Khiết', pos: 'Động từ', meaning: 'Ăn', level: 'HSK 1', example: { hanzi: '我想吃中国菜。', pinyin: 'Wǒ xiǎng chī Zhōngguócài.', meaning: 'Tôi muốn ăn món Trung Quốc.' } },
  您: { hanzi: '您', pinyin: 'nín', hanviet: 'Nâm', pos: 'Đại từ', meaning: 'Ngài, ông, bà, thầy/cô (ngôi thứ 2 lịch sự)', level: 'HSK 1', example: { hanzi: '老师，您好！', pinyin: 'Lǎoshī, nín hǎo!', meaning: 'Chào thầy/cô ạ!' } },
  呢: { hanzi: '呢', pinyin: 'ne', hanviet: 'Ni', pos: 'Trợ từ', meaning: 'Thế còn..., đâu rồi? (trợ từ ngữ khí)', level: 'HSK 1', example: { hanzi: '我很好，你呢？', pinyin: 'Wǒ hěn hǎo, nǐ ne?', meaning: 'Tôi rất khỏe, còn bạn thì sao?' } },
  在: { hanzi: '在', pinyin: 'zài', hanviet: 'Tại', pos: 'Giới từ / Động từ', meaning: 'Ở, đang ở tại', level: 'HSK 1', example: { hanzi: '我在家学汉语。', pinyin: 'Wǒ zài jiā xué Hànyǔ.', meaning: 'Tôi học tiếng Hán ở nhà.' } },
  的: { hanzi: '的', pinyin: 'de', hanviet: 'Đích', pos: 'Trợ từ kết cấu', meaning: 'Của (nối định ngữ và danh từ trung tâm)', level: 'HSK 1', example: { hanzi: '这是我的中文书。', pinyin: 'Zhè shì wǒ de Zhōngwén shū.', meaning: 'Đây là sách tiếng Trung của tôi.' } },
  比: { hanzi: '比', pinyin: 'bǐ', hanviet: 'Tỉ', pos: 'Giới từ', meaning: 'So với (dùng trong câu so sánh hơn A 比 B)', level: 'HSK 2', example: { hanzi: '今天比昨天冷得多。', pinyin: 'Jīntiān bǐ zuótiān lěng de duō.', meaning: 'Hôm nay lạnh hơn hôm qua nhiều.' } },
  让: { hanzi: '让', pinyin: 'ràng', hanviet: 'Nhượng', pos: 'Động từ sai khiến / Giới từ', meaning: 'Bảo, để cho, khiến (kiêm ngữ & bị động khẩu ngữ)', level: 'HSK 2', example: { hanzi: '医生让我多喝水多休息。', pinyin: 'Yīshēng ràng wǒ duō hē shuǐ duō xiūxi.', meaning: 'Bác sĩ dặn tôi uống nhiều nước và nghỉ ngơi nhiều.' } },
  多: { hanzi: '多', pinyin: 'duō', hanviet: 'Đa', pos: 'Tính từ / Phó từ', meaning: 'Nhiều / Bao nhiêu (hỏi mức độ)', level: 'HSK 1', example: { hanzi: '请你多注意休息。', pinyin: 'Qǐng nǐ duō zhùyì xiūxi.', meaning: 'Bạn nhớ chú ý nghỉ ngơi nhiều nhé.' } },
  着: { hanzi: '着', pinyin: 'zhe', hanviet: 'Trước', pos: 'Trợ từ động thái', meaning: 'Đang duy trì trạng thái (门开着呢)', level: 'HSK 2', example: { hanzi: '外边正下着大雨呢。', pinyin: 'Wàibiān zhèng xiàzhe dàyǔ ne.', meaning: 'Bên ngoài trời đang mưa to đấy.' } },
  过: { hanzi: '过', pinyin: 'guo', hanviet: 'Quá', pos: 'Trợ từ động thái', meaning: 'Đã từng trải qua (我学过汉语)', level: 'HSK 2', example: { hanzi: '我曾经去过一次北京。', pinyin: 'Wǒ céngjīng qù guo yí cì Běijīng.', meaning: 'Tôi từng đến Bắc Kinh một lần.' } },
  得: { hanzi: '得', pinyin: 'de', hanviet: 'Đắc', pos: 'Trợ từ kết cấu', meaning: 'Đứng giữa Động từ/Tính từ và Bổ ngữ trạng thái/khả năng', level: 'HSK 2', example: { hanzi: '他汉字写得非常漂亮。', pinyin: 'Tā Hànzì xiě de fēicháng piàoliang.', meaning: 'Cậu ấy viết chữ Hán rất đẹp.' } },
  地: { hanzi: '地', pinyin: 'de', hanviet: 'Địa', pos: 'Trợ từ kết cấu', meaning: 'Đặt giữa Trạng ngữ và Động từ (认真地学习)', level: 'HSK 3', example: { hanzi: '我们要认真地分析语法结构。', pinyin: 'Wǒmen yào rènzhēn de fēnxī yǔfǎ jiégòu.', meaning: 'Chúng ta phải phân tích nghiêm túc cấu trúc ngữ pháp.' } },
  寄: { hanzi: '寄', pinyin: 'jì', hanviet: 'Ký', pos: 'Động từ', meaning: 'Gửi (thư từ, bưu phẩm, tài liệu)', level: 'HSK 3', example: { hanzi: '我已经把合同寄给客户了。', pinyin: 'Wǒ yǐjīng bǎ hétong jì gěi kèhù le.', meaning: 'Tôi đã gửi hợp đồng cho khách hàng rồi.' } },
  送: { hanzi: '送', pinyin: 'sòng', hanviet: 'Tống', pos: 'Động từ', meaning: 'Tặng, giao, tiễn', level: 'HSK 2', example: { hanzi: '朋友送给我两张电影票。', pinyin: 'Péngyou sòng gěi wǒ liǎng zhāng diànyǐngpiào.', meaning: 'Bạn tặng cho tôi hai tấm vé xem phim.' } },
  完: { hanzi: '完', pinyin: 'wán', hanviet: 'Hoàn', pos: 'Động từ / Bổ ngữ', meaning: 'Xong, hết (làm bổ ngữ kết quả: 做完, 看完)', level: 'HSK 2', example: { hanzi: '我已经把作业写完了。', pinyin: 'Wǒ yǐjīng bǎ zuòyè xiěwán le.', meaning: 'Tôi đã làm xong bài tập rồi.' } },
  能: { hanzi: '能', pinyin: 'néng', hanviet: 'Năng', pos: 'Động từ năng nguyện', meaning: 'Có thể (điều kiện khách quan/năng lực cho phép)', level: 'HSK 1', example: { hanzi: '你明天能参加会议吗？', pinyin: 'Nǐ míngtiān néng cānjiā huìyì ma?', meaning: 'Ngày mai bạn có thể tham dự cuộc họp không?' } },
  画: { hanzi: '画', pinyin: 'huà', hanviet: 'Họa', pos: 'Động từ / Danh từ', meaning: 'Vẽ / Bức tranh', level: 'HSK 3', example: { hanzi: '画蛇添足是一个经典的成语。', pinyin: 'Huàshé-tiānzú shì yí gè jīngdiǎn de chéngyǔ.', meaning: 'Vẽ rắn thêm chân là một thành ngữ kinh điển.' } },
  经典: { hanzi: '经典', pinyin: 'jīngdiǎn', hanviet: 'Kinh điển', pos: 'Tính từ / Danh từ', meaning: 'Kinh điển, tác phẩm chuẩn mực lâu đời', level: 'HSK 5', example: { hanzi: '这道菜是最经典的川菜代表。', pinyin: 'Zhè dào cài shì zuì jīngdiǎn de Chuāncài dàibiǎo.', meaning: 'Món này là đại diện kinh điển nhất của ẩm thực Tứ Xuyên.' } },
  团圆: { hanzi: '团圆', pinyin: 'tuányuán', hanviet: 'Đoàn viên', pos: 'Động từ / Tính từ', meaning: 'Đoàn tụ sum vầy gia đình', level: 'HSK 5', example: { hanzi: '中秋节象征着全家人团圆幸福。', pinyin: 'Zhōngqiūjié xiàngzhēngzhe quánjiārén tuányuán xìngfú.', meaning: 'Tết Trung Thu tượng trưng cho gia đình đoàn viên hạnh phúc.' } },
  手续: { hanzi: '手续', pinyin: 'shǒuxù', hanviet: 'Thủ tục', pos: 'Danh từ', meaning: 'Thủ tục giấy tờ hành chính', level: 'HSK 4', example: { hanzi: '办完挂号手续后请到三楼候诊。', pinyin: 'Bànwán guàhào shǒuxù hòu qǐng dào sān lóu hòuzhěn.', meaning: 'Làm xong thủ tục lấy số xong vui lòng lên tầng ba chờ khám.' } },
  检查: { hanzi: '检查', pinyin: 'jiǎnchá', hanviet: 'Kiểm tra', pos: 'Động từ', meaning: 'Kiểm tra, khám xét tổng quát', level: 'HSK 3', example: { hanzi: '医生先给病人做了一项详细检查。', pinyin: 'Yīshēng xiān gěi bìngrén zuò le yí xiàng xiángxì jiǎnchá.', meaning: 'Bác sĩ trước tiên khám kiểm tra chi tiết cho bệnh nhân.' } },
  克服: { hanzi: '克服', pinyin: 'kèfú', hanviet: 'Khắc phục', pos: 'Động từ', meaning: 'Khắc phục, vượt qua khó khăn/nhược điểm', level: 'HSK 4', example: { hanzi: '我们要努力克服口语紧张的缺点。', pinyin: 'Wǒmen yào nǔlì kèfú kǒuyǔ jǐnzhāng de quēdiǎn.', meaning: 'Chúng ta cần nỗ lực khắc phục nhược điểm căng thẳng khi nói.' } },
  转化: { hanzi: '转化', pinyin: 'zhuǎnhuà', hanviet: 'Chuyển hóa', pos: 'Động từ', meaning: 'Chuyển hóa, biến đổi tính chất', level: 'HSK 5', example: { hanzi: '在压力下要把挑战转化为成长动力。', pinyin: 'Zài yālì xià yào bǎ tiǎozhàn zhuǎnhuà wéi chéngzhǎng dònglì.', meaning: 'Trước áp lực cần chuyển hóa thử thách thành động lực trưởng thành.' } },
  成果: { hanzi: '成果', pinyin: 'chéngguǒ', hanviet: 'Thành quả', pos: 'Danh từ', meaning: 'Thành quả lao động/nghiên cứu đạt được', level: 'HSK 5', example: { hanzi: '这项科研成果在业内赢得了高度评价。', pinyin: 'Zhè xiàng kēyán chéngguǒ zài yènèi yíngdé le gāodù píngjià.', meaning: 'Thành quả nghiên cứu này nhận được đánh giá cao trong ngành.' } },
  市场: { hanzi: '市场', pinyin: 'shìchǎng', hanviet: 'Thị trường', pos: 'Danh từ', meaning: 'Thị trường / chợ', level: 'HSK 4', example: { hanzi: '今年东南亚电商市场增长好于预期。', pinyin: 'Jīnnián Dōngnányà diànshāng shìchǎng zēngzhǎng hǎoyú yùqī.', meaning: 'Tăng trưởng thương mại điện tử Đông Nam Á năm nay tốt hơn kỳ vọng.' } },
  趋势: { hanzi: '趋势', pinyin: 'qūshì', hanviet: 'Xu thế', pos: 'Danh từ', meaning: 'Xu hướng, chiều hướng phát triển chủ đạo', level: 'HSK 5', example: { hanzi: '人工智能赋能产业升级是必然趋势。', pinyin: 'Réngōng zhìnéng fùnéng chǎnyè shēngjí shì bìrán qūshì.', meaning: 'AI tiếp sức nâng cấp ngành công nghiệp là xu thế tất yếu.' } },
  严谨: { hanzi: '严谨', pinyin: 'yánjǐn', hanviet: 'Nghiêm cẩn', pos: 'Tính từ', meaning: 'Chặt chẽ, nghiêm túc chuẩn xác không cẩu thả', level: 'HSK 6', example: { hanzi: '法律合同的措辞必须保持高度严谨。', pinyin: 'Fǎlǜ hétong de cuòcí bìxū bǎochí gāodù yánjǐn.', meaning: 'Ngôn từ hợp đồng pháp lý phải giữ sự chặt chẽ nghiêm cẩn cao độ.' } },
  修改: { hanzi: '修改', pinyin: 'xiūgǎi', hanviet: 'Tu cải', pos: 'Động từ', meaning: 'Chỉnh sửa lại cho hoàn chỉnh đúng ngữ pháp', level: 'HSK 4', example: { hanzi: '找出语病之后要马上学会正确修改。', pinyin: 'Zhǎochū yǔbìng zhīhòu yào mǎshàng xuéhuì zhèngquè xiūgǎi.', meaning: 'Sau khi tìm ra lỗi câu bệnh phải học cách sửa lại đúng ngay.' } },
  概括: { hanzi: '概括', pinyin: 'gàikuò', hanviet: 'Khái quát', pos: 'Động từ / Tính từ', meaning: 'Khái quát hóa, tóm gọn ý cốt lõi', level: 'HSK 5', example: { hanzi: '请用四百字概括这段故事的核心脉络。', pinyin: 'Qǐng yòng sìbǎi zì gàikuò zhè duàn gùshi de héxīn màiluò.', meaning: 'Hãy dùng 400 chữ tóm lược mạch truyện cốt lõi này.' } },
  凝练: { hanzi: '凝练', pinyin: 'níngliàn', hanviet: 'Ngưng luyện', pos: 'Tính từ', meaning: 'Cô đọng súc tích, tinh gọn từng chữ', level: 'HSK 6', example: { hanzi: '缩写高分秘诀在于保留主干且语言凝练。', pinyin: 'Suōxiě gāofēn mìjué zàiyú bǎoliú zhǔgàn qiě yǔyán níngliàn.', meaning: 'Bí quyết điểm cao bài tóm tắt là giữ xương sống và câu chữ cô đọng.' } },
  融会贯通: { hanzi: '融会贯通', pinyin: 'rónghuì-guàntōng', hanviet: 'Dung hội quán thông', pos: 'Thành ngữ', meaning: 'Kết nối nhuần nhuyễn thành hệ thống xuyên suốt', level: 'HSK 6', example: { hanzi: '把前六级语法词汇融会贯通就能冲刺高等九级。', pinyin: 'Bǎ qián liù jí yǔfǎ cíhuì rónghuì-guàntōng jiù néng chōngcì gāoděng jiǔ jí.', meaning: 'Kết nối nhuần nhuyễn từ vựng ngữ pháp 6 cấp đầu sẽ sẵn sàng bứt phá HSK 9.' } },
  精益求精: { hanzi: '精益求精', pinyin: 'jīngyì-qiújīng', hanviet: 'Tinh ích cầu tinh', pos: 'Thành ngữ', meaning: 'Đã tinh tường rồi vẫn trau dồi hoàn mỹ hơn nữa', level: 'HSK 6', example: { hanzi: '在翻译和写作细节上要始终做到精益求精。', pinyin: 'Zài fānyì hé xiězuò xìjié shàng yào shǐzhōng zuòdào jīngyì-qiújīng.', meaning: 'Trong từng chi tiết dịch thuật và viết luận luôn cầu toàn chuẩn xác hơn nữa.' } },
  循序渐进: { hanzi: '循序渐进', pinyin: 'xúnxù-jiànjìn', hanviet: 'Tuần tự tiệm tiến', pos: 'Thành ngữ', meaning: 'Tiến bộ từng bước một bài bản vững chắc', level: 'HSK 5', example: { hanzi: '语言积累讲究循序渐进，切忌急功近利。', pinyin: 'Yǔyán jīlěi jiǎngjiu xúnxù-jiànjìn, qièjì jígōng-jìnlì.', meaning: 'Tích lũy ngôn ngữ đòi hỏi tiến từng bước vững vàng, tránh nóng vội.' } },
};

function parseFormulaTokens(lesson) {
  const enhanced = LESSON_GRAMMAR_ENHANCEMENTS[lesson.id];
  if (enhanced?.formula_tokens) return enhanced.formula_tokens;

  const rawFormula = String(lesson.step4_grammar?.formula || lesson.step4_grammar?.title || '').trim();
  const splitParts = rawFormula
    .split(/[+|/→↔]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (splitParts.length >= 2) {
    return splitParts.map((part, idx) => ({
      token: part,
      role: idx === 0 ? 'Thành phần mở / Chủ thể' : idx === splitParts.length - 1 ? 'Thành phần chốt / Vị ngữ' : `Thành tố #${idx + 1}`,
    }));
  }

  return [
    {
      token: rawFormula || lesson.step4_grammar?.title || lesson.title,
      role: 'Cấu trúc trọng tâm bài học',
    },
  ];
}

function resolveSupplementalEntry(hanzi, lesson) {
  const fromPool = HSK120_SUPPLEMENTAL_VOCAB[hanzi];
  const fromInline = INLINE_SUPPLEMENTAL_DEFS[hanzi];
  const source = fromPool || fromInline;
  if (!source) return null;

  return {
    id: `ext-${lesson.id}-${hanzi}`,
    hanzi: source.hanzi,
    pinyin: source.pinyin,
    hanviet: source.hanviet,
    pos: source.pos,
    meaning: source.meaning,
    level: source.level,
    isExtension: true,
    example: source.example,
    audioText: source.hanzi,
  };
}

function getFunctionWordFocusForLesson(lessonId) {
  const highlights = [];

  for (const item of FUNCTION_WORDS_SYSTEM.pronounsAndNumerals) {
    if (item.lessonIds.includes(lessonId)) {
      highlights.push({ group: 'Đại từ & Số từ', ...item });
    }
  }
  for (const mw of FUNCTION_WORDS_SYSTEM.measureWords18) {
    if (mw.lessonIds.includes(lessonId)) {
      highlights.push({
        group: 'Lượng từ cốt lõi',
        title: `Lượng từ "${mw.hanzi}" (${mw.pinyin}) — ${mw.category}`,
        tokens: [mw.hanzi],
        ruleVi: mw.contrastNote,
        examples: [{ hanzi: mw.collocations.join(' / '), pinyin: mw.pinyin, meaning: mw.category }],
      });
    }
  }
  for (const adv of FUNCTION_WORDS_SYSTEM.confusableAdverbs9Pairs) {
    if (adv.lessonIds.includes(lessonId)) {
      highlights.push({
        group: 'Phó từ dễ nhầm',
        title: `Phân biệt: ${adv.pair}`,
        tokens: adv.tokens,
        ruleVi: `${adv.coreDifference} ${adv.grammarPositionRule}`,
        examples: [{ hanzi: `${adv.wrongExample} → ${adv.correctExample}`, pinyin: adv.pair, meaning: 'Đối chiếu lỗi sai' }],
      });
    }
  }
  for (const prep of FUNCTION_WORDS_SYSTEM.corePrepositions17) {
    if (prep.lessonIds.includes(lessonId)) {
      highlights.push({
        group: 'Giới từ cốt lõi',
        title: `Giới từ "${prep.hanzi}" (${prep.pinyin}) — ${prep.meaning}`,
        tokens: [prep.hanzi],
        ruleVi: `${prep.usageFrame}. ${prep.contrastNote}`,
        examples: [{ hanzi: prep.usageFrame, pinyin: prep.pinyin, meaning: prep.meaning }],
      });
    }
  }

  return highlights;
}

function getExamTypesForLesson(lessonId, levelLabel) {
  const direct = HSK_EXAM_22_QUESTION_TYPES.filter((qt) => qt.targetLessons.includes(lessonId));
  if (direct.length > 0) return direct;
  return HSK_EXAM_22_QUESTION_TYPES.filter((qt) => qt.level === levelLabel).slice(0, 2);
}

const HSK_1_TO_6_MODULE_TITLES = {
  '1.1': 'Chặng 1.1: Pinyin & 4 Thanh điệu căn bản (拼音与四声)',
  '1.2': 'Chặng 1.2: Chào hỏi, Bản thân & Xưng hô (问好与自我介绍)',
  '1.3': 'Chặng 1.3: Gia đình, Thời gian & Nơi chốn (家庭、时间与处所)',
  '1.4': 'Chặng 1.4: Thói quen, Sở thích & Tổng kết HSK 1 (爱好与总评)',
  '2.1': 'Chặng 2.1: Lịch trình, Phương tiện & Đi lại (日程与出行)',
  '2.2': 'Chặng 2.2: Ẩm thực, Nhà hàng & Mua sắm (餐饮与购物)',
  '2.3': 'Chặng 2.3: Thời tiết, So sánh & Sức khỏe (气候比较与健康)',
  '2.4': 'Chặng 2.4: Trạng thái, Cảm xúc & Tổng kết HSK 2 (动态助词与总评)',
  '3.1': 'Chặng 3.1: Du lịch, Khách sạn & Giao tiếp Độc lập (旅游与趋向补语)',
  '3.2': 'Chặng 3.2: Bổ ngữ Kết quả & Câu chữ 把/被 (补语与把被字句)',
  '3.3': 'Chặng 3.3: Công việc, Học tập & Giao tế Xã hội (职场与结构助词)',
  '3.4': 'Chặng 3.4: Thành ngữ, Văn hóa & Tổng kết HSK 3 (叙事与总评)',
  '4.1': 'Chặng 4.1: Gặp gỡ, Kết bạn & Đàm thoại phản xạ (社交与即时对话)',
  '4.2': 'Chặng 4.2: Du lịch tự túc & Khách sạn (自由行与酒店入住)',
  '4.3': 'Chặng 4.3: Điện thoại & Đặt lịch công việc (商务通话与预约)',
  '4.4': 'Chặng 4.4: Thương mại số & Liên từ phức HSK 4 (电商与复句)',
  '5.1': 'Chặng 5.1: Ẩm thực 8 trường phái & Văn hóa (八大菜系与文化)',
  '5.2': 'Chặng 5.2: Ngôn ngữ mạng & Xã hội hiện đại (流行语与社会)',
  '5.3': 'Chặng 5.3: Lễ hội truyền thống & Phong tục (传统节日与民俗)',
  '5.4': 'Chặng 5.4: Y tế, Hư từ văn viết & Sắc thái từ (书面虚词与辨析)',
  '6.1': 'Chặng 6.1: Thành ngữ 4 chữ kinh điển (经典成语与典故)',
  '6.2': 'Chặng 6.2: Phỏng vấn xin việc & Viết CV (面试与中文简历)',
  '6.3': 'Chặng 6.3: Đàm phán thương mại & Hợp đồng (商务谈判与合同)',
  '6.4': 'Chặng 6.4: Chữa bệnh câu 语病 & Tóm tắt 400 chữ (语病与缩写)',
};

const HSK120_TOOL_CYCLE = ['pronunciation', 'writing', 'grammar', 'reading', 'listening', 'roleplay', 'exam'];

export function enrichCurriculumLesson(lesson, idx = 0) {
  if (!lesson || lesson.isHsk79) return lesson;

  const coreVocab = Array.isArray(lesson.step2_vocabulary) ? lesson.step2_vocabulary : [];
  const existingSet = new Set(coreVocab.map((v) => v.hanzi));

  const configuredExtras = LESSON_SUPPLEMENTAL_HANZI[lesson.id] || [];
  const extendedVocabulary = [];

  for (const hz of configuredExtras) {
    if (existingSet.has(hz)) continue;
    const entry = resolveSupplementalEntry(hz, lesson);
    if (entry) {
      extendedVocabulary.push(entry);
      existingSet.add(hz);
    }
  }

  // Ensure every single lesson has at least 6 real non-generic words combined
  const levelCode = lesson.hskLevel || (lesson.levelId ? `HSK ${lesson.levelId.replace('lvl-', '')}` : 'HSK 1');
  const levelNum = Number(String(levelCode).replace(/\D/g, '')) || 1;
  if (coreVocab.length + extendedVocabulary.length < 6) {
    const allowedLevels = levelNum <= 3 ? ['HSK 1', 'HSK 2', 'HSK 3'] : ['HSK 4', 'HSK 5', 'HSK 6'];
    const candidates = Object.values(HSK120_SUPPLEMENTAL_VOCAB).filter(
      (item) => allowedLevels.includes(item.level) && !existingSet.has(item.hanzi)
    );
    let cursor = idx * 3;
    while (coreVocab.length + extendedVocabulary.length < 6 && candidates.length > 0) {
      const pick = candidates[cursor % candidates.length];
      cursor++;
      if (!existingSet.has(pick.hanzi)) {
        extendedVocabulary.push({
          id: `ext-${lesson.id}-${pick.hanzi}`,
          hanzi: pick.hanzi,
          pinyin: pick.pinyin,
          hanviet: pick.hanviet,
          pos: pick.pos,
          meaning: pick.meaning,
          level: pick.level,
          isExtension: true,
          example: pick.example,
          audioText: pick.hanzi,
        });
        existingSet.add(pick.hanzi);
      } else if (cursor > idx * 3 + candidates.length + 5) {
        break;
      }
    }
  }

  const keyVocab = [
    ...coreVocab.map((v) => v.hanzi),
    ...extendedVocabulary.map((v) => v.hanzi),
  ];

  const formulaTokens = parseFormulaTokens(lesson);
  const grammarEnhanced = LESSON_GRAMMAR_ENHANCEMENTS[lesson.id];
  const functionWordFocus = getFunctionWordFocusForLesson(lesson.id);
  const examQuestionTypesMapped = getExamTypesForLesson(lesson.id, levelCode);
  const numericId = idx + 1;
  const moduleIndex = Math.floor((idx % 20) / 5) + 1;
  const moduleTitle =
    HSK_1_TO_6_MODULE_TITLES[`${levelNum}.${moduleIndex}`] ||
    `Chặng ${levelNum}.${moduleIndex}`;
  const synthesizedPinyin =
    lesson.pinyin ||
    coreVocab
      .slice(0, 3)
      .map((v) => v.pinyin)
      .filter(Boolean)
      .join(' · ') ||
    `HSK ${levelNum}`;

  const enrichedStep4Grammar = lesson.step4_grammar
    ? {
        ...lesson.step4_grammar,
        code: grammarEnhanced?.code || lesson.step4_grammar.code || `G-${lesson.id.toUpperCase()}`,
        formula_tokens: lesson.step4_grammar.formula_tokens || formulaTokens,
        masteryNotes: lesson.step4_grammar.masteryNotes || grammarEnhanced?.masteryNotes || null,
        faultySentenceRules: lesson.id === 'l-618' ? HSK6_FAULTY_SENTENCE_8_TYPES : lesson.step4_grammar.faultySentenceRules || null,
        summaryWritingRules: lesson.id === 'l-619' ? HSK6_SUMMARY_1000_TO_400_RULES : lesson.step4_grammar.summaryWritingRules || null,
      }
    : undefined;

  return {
    ...lesson,
    numericId,
    level: levelNum,
    moduleIndex,
    moduleTitle,
    zh: lesson.chineseTitle || lesson.zh || lesson.title,
    pinyin: synthesizedPinyin,
    vi: lesson.title || lesson.vi || '',
    focusTool: lesson.focusTool || HSK120_TOOL_CYCLE[idx % HSK120_TOOL_CYCLE.length],
    grammarCode: grammarEnhanced?.code || lesson.grammarCode || `G-${lesson.id.toUpperCase()}`,
    keyVocab,
    extendedVocabulary,
    functionWordFocus,
    grammarAst: formulaTokens,
    grammarMasteryNotes: grammarEnhanced?.masteryNotes || null,
    faultySentenceRules: lesson.id === 'l-618' ? HSK6_FAULTY_SENTENCE_8_TYPES : null,
    summaryWritingRules: lesson.id === 'l-619' ? HSK6_SUMMARY_1000_TO_400_RULES : null,
    examQuestionTypesMapped,
    ...(enrichedStep4Grammar ? { step4_grammar: enrichedStep4Grammar } : {}),
  };
}

export function enrichCurriculumLessons(baseLessons, startIdx = 0) {
  if (!Array.isArray(baseLessons)) return [];
  return baseLessons.map((lesson, idx) => enrichCurriculumLesson(lesson, startIdx + idx));
}

export function buildHsk120Lessons(baseLessons) {
  return enrichCurriculumLessons(baseLessons, 0);
}

export const HSK_1_TO_3_ENRICHED = enrichCurriculumLessons([
  ...HSK_1_LESSONS,
  ...HSK_2_LESSONS,
  ...HSK_3_LESSONS,
], 0);

export const HSK_4_TO_6_ENRICHED = enrichCurriculumLessons([
  ...HSK_4_LESSONS,
  ...HSK_5_LESSONS,
  ...HSK_6_LESSONS,
], 60);

export const HSK_120_LESSONS = [
  ...HSK_1_TO_3_ENRICHED,
  ...HSK_4_TO_6_ENRICHED,
];

export const HSK_STAGE_CONFIGS = [
  {
    level: 1,
    badge: 'HSK 1',
    titleVi: 'Khởi Đầu Pinyin & Giao Tiếp Căn Bản',
    subtitleZh: '语音入门与日常交流',
    vocabTarget: 150,
    newWords: 150,
    hanziTarget: 300,
    lessonRange: [1, 20],
    durationWeeks: '6 – 8 tuần',
    examConfig: {
      paperCode: 'H10901',
      maxScore: 200,
      passScore: 120,
      unlockTargetScore: 160,
      questionCount: 40,
      durationMinutes: 40,
      hskkRequired: null,
    },
    accentColor: 'from-emerald-400 to-teal-500',
    borderGlow: 'border-emerald-300 dark:border-emerald-700',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    primaryTools: ['Phát âm & Biến điệu', 'Mễ tự cách HanziWriter'],
  },
  {
    level: 2,
    badge: 'HSK 2',
    titleVi: 'Sinh Hoạt Thường Nhật & Bổ Ngữ Cơ Bản',
    subtitleZh: '日常生活与基本补语',
    vocabTarget: 300,
    newWords: 150,
    hanziTarget: 600,
    lessonRange: [21, 40],
    durationWeeks: '8 – 10 tuần',
    examConfig: {
      paperCode: 'H20901',
      maxScore: 200,
      passScore: 120,
      unlockTargetScore: 160,
      questionCount: 60,
      durationMinutes: 55,
      hskkRequired: null,
    },
    accentColor: 'from-amber-400 to-orange-500',
    borderGlow: 'border-amber-300 dark:border-amber-700',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    primaryTools: ['Luyện nghe A-B Loop', 'Câu chữ 比 & Trợ từ động thái'],
  },
  {
    level: 3,
    badge: 'HSK 3',
    titleVi: 'Giao Tiếp Độc Lập, Câu Chữ 把/被 & Bổ Ngữ Xu Hướng',
    subtitleZh: '独立交际与把被字句',
    vocabTarget: 600,
    newWords: 300,
    hanziTarget: 900,
    lessonRange: [41, 60],
    durationWeeks: '10 – 12 tuần',
    examConfig: {
      paperCode: 'H30901',
      maxScore: 300,
      passScore: 180,
      unlockTargetScore: 230,
      questionCount: 80,
      durationMinutes: 90,
      hskkRequired: 'HSKK Sơ cấp',
    },
    accentColor: 'from-sky-400 to-blue-600',
    borderGlow: 'border-sky-300 dark:border-sky-700',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    primaryTools: ['Bổ ngữ Kết quả / Khả năng', 'Câu chữ 把 & 被'],
  },
  {
    level: 4,
    badge: 'HSK 4',
    titleVi: 'Công Sở, Thương Mại Số & 12 Cặp Liên Từ Phức',
    subtitleZh: '职场商务与复杂复句',
    vocabTarget: 1200,
    newWords: 600,
    hanziTarget: 1200,
    lessonRange: [61, 80],
    durationWeeks: '12 – 14 tuần',
    examConfig: {
      paperCode: 'H40901',
      maxScore: 300,
      passScore: 180,
      unlockTargetScore: 230,
      questionCount: 100,
      durationMinutes: 105,
      hskkRequired: 'HSKK Trung cấp',
    },
    accentColor: 'from-orange-400 to-rose-500',
    borderGlow: 'border-orange-300 dark:border-orange-700',
    badgeBg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    primaryTools: ['12 Cặp liên từ phức', 'Đàm thoại Công sở'],
  },
  {
    level: 5,
    badge: 'HSK 5',
    titleVi: 'Văn Hóa Xã Hội, Sắc Thái Từ & Hư Từ Văn Viết',
    subtitleZh: '社会文化与书面虚词',
    vocabTarget: 2500,
    newWords: 1300,
    hanziTarget: 1500,
    lessonRange: [81, 100],
    durationWeeks: '14 – 16 tuần',
    examConfig: {
      paperCode: 'H50901',
      maxScore: 300,
      passScore: 180,
      unlockTargetScore: 230,
      questionCount: 100,
      durationMinutes: 125,
      hskkRequired: 'HSKK Trung/Cao cấp',
    },
    accentColor: 'from-purple-400 to-indigo-600',
    borderGlow: 'border-purple-300 dark:border-purple-700',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    primaryTools: ['Sắc thái Bao/Biếm & Hư từ', 'Đoạn văn từ khóa 80 chữ'],
  },
  {
    level: 6,
    badge: 'HSK 6',
    titleVi: 'Thành Ngữ, Chữa Bệnh Câu (语病) & Tóm Tắt 400 Chữ',
    subtitleZh: '成语辨析、语病与缩写',
    vocabTarget: 5000,
    newWords: 2500,
    hanziTarget: 1800,
    lessonRange: [101, 120],
    durationWeeks: '16 – 20 tuần',
    examConfig: {
      paperCode: 'H60901',
      maxScore: 300,
      passScore: 180,
      unlockTargetScore: 230,
      questionCount: 101,
      durationMinutes: 140,
      hskkRequired: 'HSKK Cao cấp',
    },
    accentColor: 'from-rose-500 to-amber-500',
    borderGlow: 'border-rose-300 dark:border-rose-700',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    primaryTools: ['8 Dạng Bệnh Câu (语病 Q51-60)', 'Tóm tắt 1000 -> 400 chữ'],
  },
];

export const ALL_9_STAGE_CONFIGS = [
  ...HSK_STAGE_CONFIGS,
  ...HSK_7_TO_9_STAGE_CONFIGS,
];

export const ALL_180_LESSONS = [
  ...HSK_120_LESSONS.map((lesson, idx) => ({
    ...lesson,
    id: idx + 1,
    stringId: lesson.id,
    canonicalId: lesson.id,
  })),
  ...HSK_7_TO_9_LESSONS,
];

export default HSK_120_LESSONS;
