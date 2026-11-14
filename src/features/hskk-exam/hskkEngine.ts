import {
  evaluatePronunciationAttempt,
  type PronunciationAttemptResult,
} from '../../services/pronunciationLabService.ts';

export type HskkLevel = 'beginner' | 'intermediate' | 'advanced';
export type HskkTaskType =
  | 'listen_and_repeat'
  | 'listen_and_answer_short'
  | 'picture_description'
  | 'read_aloud'
  | 'argumentative_question';

export type HskkPictureSceneKey = 'kitchen_family' | 'office_teamwork';

export interface HskkQuestion {
  id: string;
  level: HskkLevel;
  partLabel: string;
  partNumber: 1 | 2 | 3;
  taskType: HskkTaskType;
  promptZh: string;
  promptPinyin?: string;
  promptVi: string;
  expectedKeywords?: string[];
  prepDurationSeconds?: number;
  recordDurationSeconds: number;
  imageHint?: string;
  sceneKey?: HskkPictureSceneKey;
}

export interface HskkEvaluationResult {
  questionId: string;
  taskType: HskkTaskType;
  transcript: string;
  score: number; // 0..100
  pronunciationDetail?: PronunciationAttemptResult;
  usedRealPitch?: boolean;
  feedbackVi: string;
}

export interface HskkOfficialSpecItem {
  level: HskkLevel;
  totalQuestions: number;
  totalDurationMinutes: number;
  prepMinutes: number;
  passingScore: number;
  maxScore: number;
  parts: { partNumber: 1 | 2 | 3; nameCn: string; nameVi: string; count: number; secondsPerItem: number }[];
}

export const HSKK_OFFICIAL_SPEC: Record<HskkLevel, HskkOfficialSpecItem> = {
  beginner: {
    level: 'beginner',
    totalQuestions: 27,
    totalDurationMinutes: 20,
    prepMinutes: 7,
    passingScore: 60,
    maxScore: 100,
    parts: [
      { partNumber: 1, nameCn: '听后重复', nameVi: 'Nghe và lặp lại câu', count: 15, secondsPerItem: 10 },
      { partNumber: 2, nameCn: '听后回答', nameVi: 'Nghe câu hỏi trả lời nhanh', count: 10, secondsPerItem: 15 },
      { partNumber: 3, nameCn: '回答问题', nameVi: 'Trả lời câu hỏi (Chuẩn bị 7 phút)', count: 2, secondsPerItem: 90 },
    ],
  },
  intermediate: {
    level: 'intermediate',
    totalQuestions: 14,
    totalDurationMinutes: 23,
    prepMinutes: 10,
    passingScore: 60,
    maxScore: 100,
    parts: [
      { partNumber: 1, nameCn: '听后重复', nameVi: 'Nghe và lặp lại câu', count: 10, secondsPerItem: 12 },
      { partNumber: 2, nameCn: '看图说话', nameVi: 'Mô tả tranh trực quan', count: 2, secondsPerItem: 120 },
      { partNumber: 3, nameCn: '回答问题', nameVi: 'Trả lời câu hỏi tình huống', count: 2, secondsPerItem: 120 },
    ],
  },
  advanced: {
    level: 'advanced',
    totalQuestions: 6,
    totalDurationMinutes: 24,
    prepMinutes: 10,
    passingScore: 60,
    maxScore: 100,
    parts: [
      { partNumber: 1, nameCn: '听后复述', nameVi: 'Nghe đoạn dài & Kể lại ý chính', count: 3, secondsPerItem: 120 },
      { partNumber: 2, nameCn: '朗读', nameVi: 'Đọc thành tiếng đoạn văn bản gốc', count: 1, secondsPerItem: 120 },
      { partNumber: 3, nameCn: '回答问题', nameVi: 'Nghị luận chuyên sâu không Pinyin', count: 2, secondsPerItem: 150 },
    ],
  },
};

export const HSKK_LEVEL_META: Record<
  HskkLevel,
  { title: string; subtitle: string; badgeClass: string }
> = {
  beginner: {
    title: 'HSKK Sơ cấp (初级)',
    subtitle: '27 câu chuẩn · Nghe lặp lại (15) · Nghe trả lời nhanh (10) · Trả lời câu hỏi (2)',
    badgeClass: 'bg-emerald-100 text-emerald-800',
  },
  intermediate: {
    title: 'HSKK Trung cấp (中级)',
    subtitle: '14 câu chuẩn · Nghe lặp lại (10) · Mô tả tranh (2) · Trả lời câu hỏi (2)',
    badgeClass: 'bg-sky-100 text-sky-800',
  },
  advanced: {
    title: 'HSKK Cao cấp (高级)',
    subtitle: '6 câu chuẩn · Nghe kể lại đoạn dài (3) · Đọc thành tiếng (1) · Nghị luận sâu (2)',
    badgeClass: 'bg-indigo-100 text-indigo-800',
  },
};

// -------------------- FULL HSKK BEGINNER (27 ITEMS) --------------------
const BEGINNER_PART1_REPEAT: [string, string, string][] = [
  ['今天天气真不错，我们一起去公园散步吧。', 'Jīntiān tiānqì zhēn bùcuò, wǒmen yìqǐ qù gōngyuán sànbù ba.', 'Thời tiết hôm nay thật đẹp, chúng ta cùng đi công viên dạo bộ nhé.'],
  ['请问去火车站怎么走？坐地铁几号线？', 'Qǐngwèn qù huǒchēzhàn zěnme zǒu? Zuò dìtiě jǐ hào xiàn?', 'Xin hỏi đi ga tàu hỏa thế nào? Đi tàu điện ngầm tuyến mấy?'],
  ['我已经学汉语一年多了，很喜欢写汉字。', 'Wǒ yǐjīng xué Hànyǔ yì nián duō le, hěn xǐhuan xiě Hànzì.', 'Tôi đã học tiếng Hán hơn một năm rồi, rất thích viết chữ Hán.'],
  ['明天下班以后，我想去超市买点儿水果。', 'Míngtiān xiàbān yǐhòu, wǒ xiǎng qù chāoshì mǎi diǎnr shuǐguǒ.', 'Ngày mai sau khi tan làm, tôi muốn đi siêu thị mua một ít hoa quả.'],
  ['这件红色的衣服比那件白色的更适合你。', 'Zhè jiàn hóngsè de yīfu bǐ nà jiàn báisè de gèng shìhé nǐ.', 'Bộ quần áo màu đỏ này hợp với bạn hơn bộ màu trắng kia.'],
  ['每天早上七点起床跑步对身体很有帮助。', 'Měitiān zǎoshang qī diǎn qǐchuáng pǎobù duì shēntǐ hěn yǒu bāngzhù.', 'Mỗi sáng dậy lúc 7 giờ chạy bộ rất tốt cho sức khỏe.'],
  ['图书馆里很安静，大家都在认真地看书。', 'Túshūguǎn lǐ hěn ānjìng, dàjiā dōu zài rènzhēn de kànshū.', 'Trong thư viện rất yên tĩnh, mọi người đều chăm chú đọc sách.'],
  ['因为昨天晚上睡得太晚，今天上午我有点儿困。', 'Yīnwèi zuótiān wǎnshang shuì de tài wǎn, jīntiān shàngwǔ wǒ yǒudiǎnr kùn.', 'Vì tối qua ngủ quá muộn nên sáng nay tôi hơi buồn ngủ.'],
  ['你能不能帮我把这个箱子搬到楼上去？', 'Nǐ néng bu néng bāng wǒ bǎ zhège xiāngzi bān dào lóushàng qù?', 'Bạn có thể giúp tôi khiêng chiếc thùng này lên lầu không?'],
  ['春节的时候，全家人都会聚在一起吃年夜饭。', 'Chūnjié de shíhou, quán jiā rén dōu huì jù zài yìqǐ chī niányèfàn.', 'Vào dịp Tết, cả gia đình đều quây quần ăn bữa cơm tất niên.'],
  ['我刚买了一张下个月去北京旅游的飞机票。', 'Wǒ gāng mǎi le yì zhāng xià ge yuè qù Běijīng lǚyóu de fēijīpiào.', 'Tôi vừa mua một vé máy bay đi du lịch Bắc Kinh tháng sau.'],
  ['医生告诉我最近要多喝水，少吃太辣的菜。', 'Yīshēng gàosu wǒ zuìjìn yào duō hē shuǐ, shǎo chī tài là de cài.', 'Bác sĩ dặn tôi dạo này phải uống nhiều nước, ăn ít món quá cay.'],
  ['虽然外边正在下雨，但是房间里非常暖和。', 'Suīrán wàibian zhèngzài xiàyǔ, dànshì fángjiān lǐ fēicháng nuǎnhuo.', 'Tuy bên ngoài đang mưa nhưng trong phòng rất ấm áp.'],
  ['请大家把手机调成静音，会议马上就要开始了。', 'Qǐng dàjiā bǎ shǒujī tiáo chéng jìngyīn, huìyì mǎshàng jiù yào kāishǐ le.', 'Xin mọi người chuyển điện thoại sang chế độ im lặng, cuộc họp sắp bắt đầu rồi.'],
  ['如果有什么不明白的地方，欢迎随时来问我。', 'Rúguǒ yǒu shénme bù míngbai de dìfang, huānyíng suíshí lái wèn wǒ.', 'Nếu có chỗ nào chưa rõ, hoan nghênh bất cứ lúc nào đến hỏi tôi.'],
];

const BEGINNER_PART2_QUICK_ANSWER: [string, string, string, string[]][] = [
  ['你每天早上几点起床？', 'Nǐ měitiān zǎoshang jǐ diǎn qǐchuáng?', 'Mỗi sáng bạn thức dậy lúc mấy giờ?', ['早上', '点', '起床']],
  ['你最喜欢吃哪种中国菜？为什么？', 'Nǐ zuì xǐhuan chī nǎ zhǒng Zhōngguócài? Wèishénme?', 'Bạn thích ăn món Trung Quốc nào nhất? Tại sao?', ['喜欢', '吃', '因为', '好吃']],
  ['你们学校或者公司离家远吗？你怎么去？', 'Nǐmen xuéxiào huòzhě gōngsī lí jiā yuǎn ma? Nǐ zěnme qù?', 'Trường học hoặc công ty cách nhà bạn có xa không? Bạn đi bằng gì?', ['坐', '骑', '走路', '分钟', '不远']],
  ['你学汉语多长时间了？觉得什么最难？', 'Nǐ xué Hànyǔ duō cháng shíjiān le? Juéde shénme zuì nán?', 'Bạn học tiếng Trung bao lâu rồi? Thấy phần nào khó nhất?', ['学了', '觉得', '汉字', '声调', '听力']],
  ['周末的时候你常和朋友去哪里玩儿？', 'Zhōumò de shíhou nǐ cháng hé péngyou qù nǎlǐ wánr?', 'Cuối tuần bạn hay đi đâu chơi với bạn bè?', ['周末', '朋友', '一起', '公园', '电影']],
  ['你喜欢喝茶还是喝咖啡？', 'Nǐ xǐhuan hē chá háishi hē kāfēi?', 'Bạn thích uống trà hay uống cà phê?', ['喜欢', '喝茶', '咖啡']],
  ['昨天晚上你几点睡觉的？睡得好吗？', 'Zuótiān wǎnshang nǐ jǐ diǎn shuìjiào de? Shuì de hǎo ma?', 'Tối qua bạn đi ngủ lúc mấy giờ? Ngủ có ngon không?', ['昨晚', '点', '睡觉', '很好']],
  ['如果有一周的假期，你想去哪里旅游？', 'Rúguǒ yǒu yì zhōu de jiàqī, nǐ xiǎng qù nǎlǐ lǚyóu?', 'Nếu có kỳ nghỉ một tuần, bạn muốn đi du lịch đâu?', ['假期', '想去', '旅游', '看看']],
  ['你平时用什么方法练习说汉语？', 'Nǐ píngshí yòng shénme fāngfǎ liànxí shuō Hànyǔ?', 'Bình thường bạn dùng cách nào để luyện nói tiếng Hán?', ['练习', '说', '听', '读']],
  ['今天晚饭你打算自己做还是在外面吃？', 'Jīntiān wǎnfàn nǐ dǎsuàn zìjǐ zuò háishi zài wàimiàn chī?', 'Bữa tối nay bạn định tự nấu hay ăn bên ngoài?', ['晚饭', '做饭', '外面', '吃']],
];

const BEGINNER_PART3_OPEN: HskkQuestion[] = [
  {
    id: 'hskk-b-p3-1',
    level: 'beginner',
    partNumber: 3,
    partLabel: 'Phần 3: Trả lời câu hỏi (回答问题 · 26/27)',
    taskType: 'argumentative_question',
    promptZh: '你周末一般喜欢做什么？请用至少五句话具体介绍一下。',
    promptPinyin: 'Nǐ zhōumò yìbān xǐhuan zuò shénme? Qǐng yòng zhìshǎo wǔ jù huà jùtǐ jièshào yíxià.',
    promptVi: 'Cuối tuần bạn thường thích làm gì? Hãy giới thiệu cụ thể ít nhất 5 câu.',
    expectedKeywords: ['周末', '喜欢', '早上', '朋友', '因为', '开心'],
    prepDurationSeconds: 120,
    recordDurationSeconds: 90,
  },
  {
    id: 'hskk-b-p3-2',
    level: 'beginner',
    partNumber: 3,
    partLabel: 'Phần 3: Trả lời câu hỏi (回答问题 · 27/27)',
    taskType: 'argumentative_question',
    promptZh: '请介绍一下你的家乡或者你现在居住的城市。',
    promptPinyin: 'Qǐng jièshào yíxià nǐ de jiāxiāng huòzhě nǐ xiànzài jūzhù de chéngshì.',
    promptVi: 'Hãy giới thiệu về quê hương bạn hoặc thành phố nơi bạn đang sinh sống.',
    expectedKeywords: ['城市', '风景', '人', '好吃', '喜欢', '欢迎'],
    prepDurationSeconds: 120,
    recordDurationSeconds: 90,
  },
];

// -------------------- FULL HSKK INTERMEDIATE (14 ITEMS) --------------------
const INTERMEDIATE_PART1_REPEAT: [string, string, string][] = [
  ['虽然学习汉语的过程中会遇到困难，但只要坚持就一定能成功。', 'Suīrán xuéxí Hànyǔ de guòchéng zhōng huì yùdào kùnnan, dàn zhǐyào jiānchí jiù yídìng néng chénggōng.', 'Tuy trong quá trình học tiếng Trung sẽ gặp khó khăn, chỉ cần kiên trì nhất định sẽ thành công.'],
  ['多和当地人用中文交流，是提高口语流利度最有效的方法之一。', 'Duō hé dāngdìrén yòng Zhōngwén jiāoliú, shì tígāo kǒuyǔ liúlìdù zuì yǒuxiào de fāngfǎ zhī yī.', 'Giao tiếp nhiều bằng tiếng Trung với người bản xứ là một trong những cách hiệu quả nhất nâng độ trôi chảy.'],
  ['随着交通越来越方便，周末坐高铁去周边城市旅行已经成为一种时尚。', 'Suízhe jiāotōng yuèláiyuè fāngbiàn, zhōumò zuò gāotiě qù zhōubiān chéngshì lǚxíng yǐjīng chéngwéi yì zhǒng shíshàng.', 'Cùng với giao thông ngày càng thuận tiện, cuối tuần đi tàu cao tốc du lịch thành phố lân cận đã thành xu hướng.'],
  ['无论工作多忙，每天都要抽出半个小时陪伴家人或者锻炼身体。', 'Wúlùn gōngzuò duō máng, měitiān dōu yào chōuchū bàn ge xiǎoshí péibàn jiārén huòzhě duànliàn shēntǐ.', 'Dù công việc bận đến đâu, mỗi ngày cũng nên dành nửa tiếng bên gia đình hoặc tập thể dục.'],
  ['在团队合作中，认真倾听别人的建议往往比急着发表意见更重要。', 'Zài tuánduì hézuò zhōng, rènzhēn qīngtīng biérén de jiànyì wǎngwǎng bǐ jízhe fābiǎo yìjiàn gèng zhòngyào.', 'Trong làm việc nhóm, lắng nghe góp ý của người khác thường quan trọng hơn vội vàng phát biểu ý kiến.'],
  ['这次文化展览不仅吸引了许多年轻人，也让不少外国朋友加深了了解。', 'Zhè cì wénhuà zhǎnlǎn bùjǐn xīyǐn le xǔduō niánqīngrén, yě ràng bùshǎo wàiguó péngyou jiāshēn le liǎojiě.', 'Triển lãm văn hóa lần này không chỉ thu hút nhiều bạn trẻ mà còn giúp bạn bè quốc tế hiểu sâu hơn.'],
  ['如果一个人总是害怕犯错误，就很难在工作和学习上有所突破。', 'Rúguǒ yí ge rén zǒng shì hàipà fàn cuòwù, jiù hěn nán zài gōngzuò hé xuéxí shàng yǒusuǒ tūpò.', 'Nếu một người luôn sợ mắc sai lầm thì rất khó tạo đột phá trong công việc và học tập.'],
  ['养成每天整理笔记的好习惯，复习的时候就会觉得轻松得多。', 'Yǎngchéng měitiān zhěnglǐ bǐjì de hǎo xíguàn, fùxí de shíhou jiù huì juéde qīngsōng de duō.', 'Tạo thói quen tốt sắp xếp ghi chép mỗi ngày, lúc ôn tập sẽ thấy nhẹ nhàng hơn nhiều.'],
  ['相比买昂贵的礼物，亲手写一张温暖的感谢卡往往更让人感动。', 'Xiāngbǐ mǎi ángguì de lǐwù, qīnshǒu xiě yì zhāng wēnnuǎn de gǎnxièkǎ wǎngwǎng gèng ràng rén gǎndòng.', 'So với mua quà đắt tiền, tự tay viết tấm thiệp cảm ơn ấm áp thường khiến người ta cảm động hơn.'],
  ['保护环境并不只是一句口号，而是要落实到减少塑料袋等日常小事上。', 'Bǎohù huánjìng bìng bù zhǐ shì yí jù kǒuhào, érshì yào luòshí dào jiǎnshǎo sùliàodài děng rìcháng xiǎoshì shàng.', 'Bảo vệ môi trường không chỉ là khẩu hiệu, mà phải thực hiện từ những việc nhỏ hằng ngày như giảm túi nilon.'],
];

const INTERMEDIATE_PART2_PICTURES: HskkQuestion[] = [
  {
    id: 'hskk-i-p2-1',
    level: 'intermediate',
    partNumber: 2,
    partLabel: 'Phần 2: Mô tả tranh (看图说话 · 11/14)',
    taskType: 'picture_description',
    sceneKey: 'kitchen_family',
    promptZh: '请结合图片内容，用汉语完整描述画面中的人物、动作、环境与情感氛围。',
    promptVi: 'Quan sát bức tranh gia đình cùng nấu ăn trong gian bếp và miêu tả trọn vẹn bằng tiếng Hán (nên đạt 2 phút nói tự nhiên).',
    imageHint: 'Gia đình 3 người: Bố, mẹ và con gái đang rửa rau, nấu canh bên bếp ấm cúng, mọi người cười vui.',
    expectedKeywords: ['厨房', '做饭', '开心', '一起', '家庭', '幸福'],
    prepDurationSeconds: 180,
    recordDurationSeconds: 120,
  },
  {
    id: 'hskk-i-p2-2',
    level: 'intermediate',
    partNumber: 2,
    partLabel: 'Phần 2: Mô tả tranh (看图说话 · 12/14)',
    taskType: 'picture_description',
    sceneKey: 'office_teamwork',
    promptZh: '请结合第二张图片，描述图中的场景、人物正在沟通的内容以及你的感想。',
    promptVi: 'Quan sát bức tranh nhóm đồng nghiệp trẻ thảo luận biểu đồ dự án quanh bàn họp sáng tạo.',
    imageHint: 'Nhóm 3 đồng nghiệp trước bảng biểu đồ cột và laptop đang trao đổi ý tưởng, một người chỉ vào biểu đồ tăng trưởng.',
    expectedKeywords: ['讨论', '办公室', '同事', '工作', '图表', '合作'],
    prepDurationSeconds: 180,
    recordDurationSeconds: 120,
  },
];

const INTERMEDIATE_PART3_OPEN: HskkQuestion[] = [
  {
    id: 'hskk-i-p3-1',
    level: 'intermediate',
    partNumber: 3,
    partLabel: 'Phần 3: Trả lời câu hỏi (回答问题 · 13/14)',
    taskType: 'argumentative_question',
    promptZh: '现在很多人喜欢在网上购物，你觉得网购有哪些优点和不足？',
    promptPinyin: 'Xiànzài hěn duō rén xǐhuan zài wǎngshàng gòuwù, nǐ juéde wǎnggòu yǒu nǎxiē yōudiǎn hé bùzú?',
    promptVi: 'Hiện nay nhiều người thích mua sắm trực tuyến, bạn thấy mua sắm online có ưu điểm và hạn chế gì?',
    expectedKeywords: ['方便', '价格', '质量', '快递', '比较', '认为'],
    prepDurationSeconds: 180,
    recordDurationSeconds: 120,
  },
  {
    id: 'hskk-i-p3-2',
    level: 'intermediate',
    partNumber: 3,
    partLabel: 'Phần 3: Trả lời câu hỏi (回答问题 · 14/14)',
    taskType: 'argumentative_question',
    promptZh: '请谈谈保持良好人际关系或者交朋友对你来说最重要的是什么？',
    promptPinyin: 'Qǐng tántan bǎochí liánghǎo rénjì guānxì huòzhě jiāo péngyou duì nǐ lái shuō zuì zhòngyào de shì shénme?',
    promptVi: 'Hãy chia sẻ điều quan trọng nhất với bạn khi duy trì mối quan hệ xã hội tốt hoặc kết bạn.',
    expectedKeywords: ['真诚', '尊重', '沟通', '互相', '帮助', '信任'],
    prepDurationSeconds: 180,
    recordDurationSeconds: 120,
  },
];

// -------------------- FULL HSKK ADVANCED (6 ITEMS) --------------------
const ADVANCED_FULL_ITEMS: HskkQuestion[] = [
  {
    id: 'hskk-a-p1-1',
    level: 'advanced',
    partNumber: 1,
    partLabel: 'Phần 1: Nghe và kể lại đoạn văn (听后复述 · 1/6)',
    taskType: 'listen_and_repeat',
    promptZh: '从前有一位老木匠准备退休，老板请他再建最后一栋房子。老木匠心不在焉，用了粗糙的材料。完工后老板把钥匙交给他作为礼物。老木匠十分后悔，原来一生的认真最后却让自己住进了敷衍造就的屋子。',
    promptPinyin: 'Cóngqián yǒu yí wèi lǎo mùjiàng zhǔnbèi tuìxiū...',
    promptVi: 'Nghe câu chuyện ngụ ngôn về người thợ mộc xây ngôi nhà cuối đời, sau tiếng Beep hãy kể lại đầy đủ cốt truyện và bài học (không cần nhớ từng chữ giống hệt).',
    expectedKeywords: ['木匠', '房子', '材料', '钥匙', '后悔', '认真'],
    recordDurationSeconds: 120,
  },
  {
    id: 'hskk-a-p1-2',
    level: 'advanced',
    partNumber: 1,
    partLabel: 'Phần 1: Nghe và kể lại đoạn văn (听后复述 · 2/6)',
    taskType: 'listen_and_repeat',
    promptZh: '近年来，许多博物馆推出了“夜间开放”和数字沉浸展览。上班族下班后可以伴着柔和灯光欣赏文物，既缓解了白天的参观拥堵，也让传统文化真正融入了现代都市的夜间生活。',
    promptPinyin: 'Jìnniánlái, xǔduō bówùguǎn tuīchū le yèjiān kāifàng...',
    promptVi: 'Nghe đoạn tin văn hóa về xu hướng mở cửa bảo tàng ban đêm và triển lãm số tương tác, sau đó tóm tắt thuật lại ý chính.',
    expectedKeywords: ['博物馆', '夜间', '数字', '文物', '缓解', '生活'],
    recordDurationSeconds: 120,
  },
  {
    id: 'hskk-a-p1-3',
    level: 'advanced',
    partNumber: 1,
    partLabel: 'Phần 1: Nghe và kể lại đoạn văn (听后复述 · 3/6)',
    taskType: 'listen_and_repeat',
    promptZh: '真正的成长并不是没有遇到过挫折，而是在经历风雨后依然保持热爱生活的勇气。许多人在顺境中容易忽视自身不足，反而是跌倒后的反思让人变得沉稳而清醒。',
    promptPinyin: 'Zhēnzhèng de chéngzhǎng bìng bù shì méiyǒu yùdào guo cuòzhé...',
    promptVi: 'Nghe đoạn nghị luận về giá trị của trắc trở đối với sự trưởng thành cá nhân và thuật lại mạch lạc.',
    expectedKeywords: ['成长', '挫折', '勇气', '顺境', '反思', '清醒'],
    recordDurationSeconds: 120,
  },
  {
    id: 'hskk-a-p2-1',
    level: 'advanced',
    partNumber: 2,
    partLabel: 'Phần 2: Đọc thành tiếng đoạn văn (朗读 · 4/6)',
    taskType: 'read_aloud',
    promptZh: '秋天的江南水乡总是带着几分温润的诗意。清晨薄雾尚未散尽，石桥下的河水静静流淌，岸边白墙黑瓦的民居倒映其中，仿佛一幅刚刚研好墨的水彩画。早起的老人在巷口打完太极，顺手买回两根刚出锅的热油条和一碗豆浆；背着书包的小学生三三两两走过青石板路，清脆的笑声打破了水巷的宁静。现代高楼虽然在不远处拔地而起，可这片老街区依然保留着慢节奏的人情味，让每一个匆忙赶路的旅人都不由自主地放轻了脚步。',
    promptVi: 'Đọc thành tiếng toàn bộ đoạn văn trên (200+ chữ Hán, KHÔNG có Pinyin), chú ý ngắt nghỉ cụm ý tự nhiên, chuẩn biến điệu và ngữ điệu truyền cảm.',
    prepDurationSeconds: 180,
    recordDurationSeconds: 120,
  },
  {
    id: 'hskk-a-p3-1',
    level: 'advanced',
    partNumber: 3,
    partLabel: 'Phần 3: Nghị luận chuyên sâu (回答问题 · 5/6)',
    taskType: 'argumentative_question',
    promptZh: '有人认为生成式人工智能最终会取代大量传统脑力与文案岗位，但也有人认为它只是提升创造力的工具。对此你持什么观点？请给出充分论证。',
    promptVi: 'Nghị luận quan điểm HSKK Cao cấp (Chuẩn bị trước, nói ~2,5 phút): AI tạo sinh sẽ thay thế hay tiếp sức cho lao động tri thức?',
    expectedKeywords: ['人工智能', '取代', '效率', '创造力', '人类', '认为'],
    prepDurationSeconds: 300,
    recordDurationSeconds: 150,
  },
  {
    id: 'hskk-a-p3-2',
    level: 'advanced',
    partNumber: 3,
    partLabel: 'Phần 3: Nghị luận chuyên sâu (回答问题 · 6/6)',
    taskType: 'argumentative_question',
    promptZh: '在高速发展的现代社会中，城市建设应当优先追求经济效率，还是保留历史文化记忆？请结合实例谈谈如何平衡二者关系。',
    promptVi: 'Nghị luận về cân bằng giữa tốc độ hiện đại hóa đô thị và bảo tồn ký ức lịch sử – văn hóa.',
    expectedKeywords: ['城市', '文化', '历史', '经济', '平衡', '发展'],
    prepDurationSeconds: 300,
    recordDurationSeconds: 150,
  },
];

// Build full exam question banks matching official CTI counts (27 / 14 / 6)
export const HSKK_FULL_EXAMS: Record<HskkLevel, HskkQuestion[]> = {
  beginner: [
    ...BEGINNER_PART1_REPEAT.map(([zh, pinyin, vi], idx) => ({
      id: `hskk-b-p1-${idx + 1}`,
      level: 'beginner' as const,
      partNumber: 1 as const,
      partLabel: `Phần 1: Nghe và lặp lại (${idx + 1}/27)`,
      taskType: 'listen_and_repeat' as const,
      promptZh: zh,
      promptPinyin: pinyin,
      promptVi: vi,
      recordDurationSeconds: 10,
    })),
    ...BEGINNER_PART2_QUICK_ANSWER.map(([zh, pinyin, vi, kws], idx) => ({
      id: `hskk-b-p2-${idx + 1}`,
      level: 'beginner' as const,
      partNumber: 2 as const,
      partLabel: `Phần 2: Nghe trả lời nhanh (${16 + idx}/27)`,
      taskType: 'listen_and_answer_short' as const,
      promptZh: zh,
      promptPinyin: pinyin,
      promptVi: vi,
      expectedKeywords: kws,
      recordDurationSeconds: 15,
    })),
    ...BEGINNER_PART3_OPEN,
  ],
  intermediate: [
    ...INTERMEDIATE_PART1_REPEAT.map(([zh, pinyin, vi], idx) => ({
      id: `hskk-i-p1-${idx + 1}`,
      level: 'intermediate' as const,
      partNumber: 1 as const,
      partLabel: `Phần 1: Nghe và lặp lại (${idx + 1}/14)`,
      taskType: 'listen_and_repeat' as const,
      promptZh: zh,
      promptPinyin: pinyin,
      promptVi: vi,
      recordDurationSeconds: 12,
    })),
    ...INTERMEDIATE_PART2_PICTURES,
    ...INTERMEDIATE_PART3_OPEN,
  ],
  advanced: ADVANCED_FULL_ITEMS,
};

// Quick practice mode (covers ALL 3 official parts for each level: 3 items per level)
export const HSKK_SAMPLE_QUESTIONS: Record<HskkLevel, HskkQuestion[]> = {
  beginner: [
    HSKK_FULL_EXAMS.beginner[0],
    HSKK_FULL_EXAMS.beginner[15],
    HSKK_FULL_EXAMS.beginner[25],
  ],
  intermediate: [
    HSKK_FULL_EXAMS.intermediate[0],
    HSKK_FULL_EXAMS.intermediate[10],
    HSKK_FULL_EXAMS.intermediate[12],
  ],
  advanced: [
    HSKK_FULL_EXAMS.advanced[0],
    HSKK_FULL_EXAMS.advanced[3],
    HSKK_FULL_EXAMS.advanced[4],
  ],
};

/**
 * Phát âm thanh "Beep" báo hiệu bắt đầu thu âm qua Web Audio API
 */
export function playBeepTone(frequency = 880, durationMs = 220): void {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // ignore audio context errors in restricted environments
  }
}

/**
 * Chấm điểm phần thi nói HSKK (Sơ / Trung / Cao cấp)
 * Hỗ trợ đầy đủ cả 5 dạng bài và sử dụng pitch contour thực từ Micro nếu có.
 */
export function gradeHskkSpeakingResponse(
  question: HskkQuestion,
  transcript: string,
  userContour?: number[]
): HskkEvaluationResult {
  const clean = (transcript || '').trim();
  const usedRealPitch = Boolean(userContour && userContour.length >= 4);

  if (!clean) {
    return {
      questionId: question.id,
      taskType: question.taskType,
      transcript: '',
      score: 0,
      usedRealPitch,
      feedbackVi: 'Chưa ghi nhận được giọng nói hoặc văn bản trả lời.',
    };
  }

  // Listen & Repeat / Advanced Read Aloud -> match Hanzi characters + real F0 pitch tone contour (no fake sine wave)
  if (question.taskType === 'listen_and_repeat' || question.taskType === 'read_aloud') {
    const targetChars: string[] = question.promptZh.match(/[\u4e00-\u9fa5]/g) ?? [];
    const spokenChars: string[] = clean.match(/[\u4e00-\u9fa5]/g) ?? [];
    const matchedCount = targetChars.filter((ch) => spokenChars.includes(ch)).length;
    const hanziMatchPct =
      targetChars.length > 0 ? Math.round((matchedCount / targetChars.length) * 100) : 100;

    const taskLabel = question.taskType === 'read_aloud' ? 'Đọc thành tiếng' : 'Lặp lại / Kể lại';

    if (!usedRealPitch) {
      return {
        questionId: question.id,
        taskType: question.taskType,
        transcript: clean,
        score: hanziMatchPct,
        usedRealPitch: false,
        feedbackVi: `${taskLabel}: ${hanziMatchPct}/100 (Khớp nội dung ASR: ${hanziMatchPct}%; chưa ghi nhận F0 micro).`,
      };
    }

    const pronResult = evaluatePronunciationAttempt({
      drill: {
        id: question.id,
        category: 'sentence_shadowing',
        hsk_level: question.level === 'beginner' ? 2 : question.level === 'intermediate' ? 4 : 6,
        hanzi: question.promptZh,
        pinyin_underlying: question.promptPinyin || '',
        pinyin_surface: question.promptPinyin || '',
        meaning_vi: question.promptVi,
        phonetic_focus: 'HSKK Thanh điệu & Ngữ điệu câu',
        articulation_tip_vi: 'Giữ chuẩn thanh điệu và ngắt nhịp tự nhiên theo cụm từ.',
        reference_pitch_contour: [],
      },
      userContour: userContour!,
    });

    const combinedScore = Math.round(hanziMatchPct * 0.55 + pronResult.tone_score * 0.45);
    return {
      questionId: question.id,
      taskType: question.taskType,
      transcript: clean,
      score: combinedScore,
      pronunciationDetail: pronResult,
      usedRealPitch: true,
      feedbackVi: `${taskLabel}: ${combinedScore}/100 (Khớp nội dung: ${hanziMatchPct}%, Thanh điệu [Đo F0 micro thật]: ${pronResult.tone_score}%).`,
    };
  }

  // Open speaking: Quick Answer, Picture Description, Argumentative
  const hanziCount = (clean.match(/[\u4e00-\u9fa5]/g) || []).length;
  const kws = question.expectedKeywords || [];
  const matchedKws = kws.filter((k) => clean.includes(k));
  const kwScore = kws.length > 0 ? Math.round((matchedKws.length / kws.length) * 50) : 40;
  const targetCharsCount =
    question.taskType === 'listen_and_answer_short'
      ? 10
      : question.level === 'advanced'
      ? 65
      : 35;
  const fluencyScore = Math.min(50, Math.round((hanziCount / targetCharsCount) * 50));
  const pitchBonus = usedRealPitch ? 5 : 0;
  const score = Math.min(100, kwScore + fluencyScore + pitchBonus);

  return {
    questionId: question.id,
    taskType: question.taskType,
    transcript: clean,
    score,
    usedRealPitch,
    feedbackVi: `Khớp ${matchedKws.length}/${kws.length} ý trọng tâm (${hanziCount} âm tiết tiếng Trung${
      usedRealPitch ? ' · Đã ghi nhận cao độ F0 micro' : ''
    }). ${
      score >= 75
        ? 'Diễn đạt tự nhiên, đủ ý!'
        : 'Nên mở rộng thêm ý và sử dụng liên từ (因为, 所以, 首先, 此外) để tăng điểm.'
    }`,
  };
}

/**
 * Nâng cấp chấm điểm HSKK bằng AI (/api/ai/grade) để hiểu ngữ nghĩa & từ đồng nghĩa.
 * Tự động fallback về `gradeHskkSpeakingResponse` nếu offline hoặc chưa cấu hình API.
 */
export async function gradeHskkSpeakingWithAi(
  question: HskkQuestion,
  transcript: string,
  userContour?: number[],
  audioBase64?: string | null
): Promise<HskkEvaluationResult> {
  const baseline = gradeHskkSpeakingResponse(question, transcript, userContour);
  if (!transcript.trim() && !audioBase64) return baseline;
  if (typeof fetch === 'undefined') return baseline;

  try {
    const res = await fetch('/api/ai/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'hskk',
        promptZh: question.promptZh,
        promptVi: question.promptVi,
        taskType: question.taskType,
        level: question.level,
        expectedKeywords: question.expectedKeywords || [],
        transcript,
        audioBase64: audioBase64 || null,
      }),
    });

    if (!res.ok) return baseline;
    const data = await res.json();
    const ai = data?.result;
    if (!ai || typeof ai.score !== 'number') return baseline;

    return {
      ...baseline,
      score: Math.max(0, Math.min(100, Math.round(ai.score))),
      feedbackVi: `${ai.feedbackVi || baseline.feedbackVi} [Chấm bởi AI]`,
    };
  } catch {
    return baseline;
  }
}
