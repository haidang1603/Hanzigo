// =========================================================================
// HANZIGO HSK 3.0 ADVANCED CURRICULUM (BAND 3: HSK 7–9 · 60 LESSONS: 121–180)
// File: src/features/curriculum/hsk7to9CurriculumData.js
// =========================================================================

import { HSK_7_TO_9_GRAMMAR_AST_MAP } from './hsk7to9LexiconAndGrammarBank.js';

export const HSK_7_TO_9_STAGE_CONFIGS = [
  {
    level: 7,
    badge: 'HSK 7',
    titleVi: 'Ngôn Ngữ Báo Chí, Kinh Tế Vĩ Mô & Dịch Thuật Cơ Sở',
    subtitleZh: '报刊政论、宏观经济与基础笔译',
    vocabTarget: 7000,
    newWords: 2000,
    hanziTarget: 2700,
    lessonRange: [121, 140],
    durationWeeks: '16 – 20 tuần',
    examConfig: {
      paperCode: 'H79001',
      maxScore: 300,
      passScore: 180,
      unlockTargetScore: 205,
      questionCount: 98,
      durationMinutes: 210,
      hskkRequired: 'Tích hợp Khẩu ngữ & Dịch thuật trong đề HSK 7-9',
    },
    accentColor: 'from-cyan-400 to-blue-600',
    borderGlow: 'border-cyan-300 dark:border-cyan-700',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    primaryTools: ['Translation Studio (29.05)', 'Chengyu Explorer (29.04)'],
  },
  {
    level: 8,
    badge: 'HSK 8',
    titleVi: 'Tiếng Trung Chuyên Ngành (IT/Tài Chính/Pháp Lý) & Biểu Đồ Số Liệu',
    subtitleZh: '专业领域汉语、图表作文与交替传译',
    vocabTarget: 9000,
    newWords: 2000,
    hanziTarget: 2850,
    lessonRange: [141, 160],
    durationWeeks: '20 – 24 tuần',
    examConfig: {
      paperCode: 'H79002',
      maxScore: 300,
      passScore: 210,
      unlockTargetScore: 235,
      questionCount: 98,
      durationMinutes: 210,
      hskkRequired: 'Phiên dịch đuổi & Thuyết trình chuyên ngành',
    },
    accentColor: 'from-indigo-400 to-purple-600',
    borderGlow: 'border-indigo-300 dark:border-indigo-700',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    primaryTools: ['IT/Business Domain Packs (29.05)', 'Data Chart Essay Grader'],
  },
  {
    level: 9,
    badge: 'HSK 9',
    titleVi: 'Cổ Văn Ứng Dụng, Triết Học, Biện Luận & Đỉnh Cao Dịch Thuật',
    subtitleZh: '文言精华、学术思辨与高阶同传笔译',
    vocabTarget: 11092,
    newWords: 2092,
    hanziTarget: 3000,
    lessonRange: [161, 180],
    durationWeeks: '24 – 32 tuần',
    examConfig: {
      paperCode: 'H79003',
      maxScore: 300,
      passScore: 240,
      unlockTargetScore: 260,
      questionCount: 98,
      durationMinutes: 210,
      hskkRequired: 'Hùng biện học thuật & Luận văn 600 chữ',
    },
    accentColor: 'from-amber-400 to-rose-600',
    borderGlow: 'border-amber-300 dark:border-amber-700',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    primaryTools: ['Academic Essay 600 Chars', 'Classical & Diplomatic Translation'],
  },
];

/**
 * Danh sách đầy đủ 60 bài học từ Bài 121 đến Bài 180 (Chuẩn HSK 3.0 Cao Cấp)
 */
const RAW_HSK_7_TO_9_LESSONS = [
  // ==================== HSK 7 (Bài 121 - 140) ====================
  { id: 121, level: 7, moduleIndex: 1, moduleTitle: 'Chặng 7.1: Ngôn ngữ Báo chí & Kinh tế Vĩ mô', zh: '数字经济与产业转型', pinyin: 'Shùzì jīngjì yǔ chǎnyè zhuǎnxíng', vi: 'Kinh tế số & Cấu trúc đính chính 与其说……毋宁说……', grammarCode: 'HSK7-WRITTEN-YUQISHUO', keyVocab: ['赋能', '转型', '相辅相成', '瓶颈'], focusTool: 'reading' },
  { id: 122, level: 7, moduleIndex: 1, moduleTitle: 'Chặng 7.1: Ngôn ngữ Báo chí & Kinh tế Vĩ mô', zh: '全球供应链的韧性与挑战', pinyin: 'Quánqiú gōngyìngliàn de rìnxìng yǔ tiǎozhàn', vi: 'Chuỗi cung ứng toàn cầu & Liên từ nhượng bộ 诚然……然而……', grammarCode: 'HSK7-CONJ-CHENGRAN', keyVocab: ['韧性', '诚然', '息息相关', '未雨绸缪'], focusTool: 'reading' },
  { id: 123, level: 7, moduleIndex: 1, moduleTitle: 'Chặng 7.1: Ngôn ngữ Báo chí & Kinh tế Vĩ mô', zh: '新兴市场与消费升级', pinyin: 'Xīnxīng shìchǎng yǔ xiāofèi shēngjí', vi: 'Thị trường mới nổi & Hư từ phản vấn 尚且……何况……', grammarCode: 'HSK7-CONJ-SHANGQIE', keyVocab: ['尚且', '崛起', '日新月异', '层出不穷'], focusTool: 'grammar' },
  { id: 124, level: 7, moduleIndex: 1, moduleTitle: 'Chặng 7.1: Ngôn ngữ Báo chí & Kinh tế Vĩ mô', zh: '区域经济一体化进程', pinyin: 'Qūyù jīngjì yītǐhuà jìnchéng', vi: 'Hội nhập kinh tế khu vực & Giới từ học thuật 值此……之际', grammarCode: 'HSK7-PREP-ZHICI', keyVocab: ['契机', '互利共赢', '举足轻重', '循序渐进'], focusTool: 'roleplay' },
  { id: 125, level: 7, moduleIndex: 1, moduleTitle: 'Chặng 7.1: Ngôn ngữ Báo chí & Kinh tế Vĩ mô', zh: '宏观调控与财政政策', pinyin: 'Hóngguān tiáokòng yǔ cáizhèng zhèngcè', vi: 'Điều tiết vĩ mô & Cấu trúc mục đích 旨在…… / 以期……', grammarCode: 'HSK7-VERB-ZHIZAI', keyVocab: ['旨在', '调控', '稳中求进', '立竿见影'], focusTool: 'reading' },

  { id: 126, level: 7, moduleIndex: 2, moduleTitle: 'Chặng 7.2: Sinh thái học, Đô thị hóa & Phát triển bền vững', zh: '碳中和目标与绿色能源', pinyin: 'Tànzhōnghé mùbiāo yǔ lǜsè néngyuán', vi: 'Mục tiêu trung hòa carbon & Phó từ đánh giá 未免 / 不免', grammarCode: 'HSK7-ADV-WEIMIAN', keyVocab: ['未免', '刻不容缓', '取代', '任重道远'], focusTool: 'grammar' },
  { id: 127, level: 7, moduleIndex: 2, moduleTitle: 'Chặng 7.2: Sinh thái học, Đô thị hóa & Phát triển bền vững', zh: '超大城市治理与智慧交通', pinyin: 'Chāodà chéngshì zhìlǐ yǔ zhìhuì jiāotōng', vi: 'Quản trị siêu đô thị & Cấu trúc suy luận 无怪乎 / 难怪', grammarCode: 'HSK7-ADV-WUGUAIHU', keyVocab: ['治理', '拥堵', '因地制宜', '多管齐下'], focusTool: 'listening' },
  { id: 128, level: 7, moduleIndex: 2, moduleTitle: 'Chặng 7.2: Sinh thái học, Đô thị hóa & Phát triển bền vững', zh: '生物多样性保护迫在眉睫', pinyin: 'Shēngwù duōyàngxìng bǎohù pòzàiméijié', vi: 'Bảo tồn đa dạng sinh học & Cấu trúc phủ định kép 非……不可', grammarCode: 'HSK7-PAT-FEIBUKE', keyVocab: ['迫在眉睫', '濒危', '休戚与共', '防患于未然'], focusTool: 'reading' },
  { id: 129, level: 7, moduleIndex: 2, moduleTitle: 'Chặng 7.2: Sinh thái học, Đô thị hóa & Phát triển bền vững', zh: '循环经济与资源再生', pinyin: 'Xúnhuán jīngjì yǔ zīyuán zàishēng', vi: 'Kinh tế tuần hoàn & Liên từ điều kiện 倘若……便……', grammarCode: 'HSK7-CONJ-TANGRUO', keyVocab: ['倘若', '耗竭', '变废为宝', '持之以恒'], focusTool: 'grammar' },
  { id: 130, level: 7, moduleIndex: 2, moduleTitle: 'Chặng 7.2: Sinh thái học, Đô thị hóa & Phát triển bền vững', zh: '乡村振兴与生态旅游', pinyin: 'Xiāngcūn zhènxīng yǔ shēngtài lǚyóu', vi: 'Chấn hưng nông thôn & Cấu trúc sóng đôi 既……又……且……', grammarCode: 'HSK7-PARALLEL-JIYOU', keyVocab: ['振兴', '禀赋', '独具匠心', '络绎不绝'], focusTool: 'reading' },

  { id: 131, level: 7, moduleIndex: 3, moduleTitle: 'Chặng 7.3: Tâm lý học Xã hội, Giáo dục & Truyền thông', zh: '信息茧房与算法推荐机制', pinyin: 'Xìnxī jiǎnfáng yǔ suànfǎ tuījiàn jīzhì', vi: 'Kén thông tin & Cấu trúc nguyên nhân 之所以……乃是因为……', grammarCode: 'HSK7-CAUSE-NAISHI', keyVocab: ['算法', '局限', '先入为主', '司空见惯'], focusTool: 'reading' },
  { id: 132, level: 7, moduleIndex: 3, moduleTitle: 'Chặng 7.3: Tâm lý học Xã hội, Giáo dục & Truyền thông', zh: '终身学习与职业倦怠调适', pinyin: 'Zhōngshēn xuéxí yǔ zhíyè juàndài tiáoshì', vi: 'Học tập suốt đời & Cấu trúc giả định 纵然……亦……', grammarCode: 'HSK7-CONJ-ZONGRAN', keyVocab: ['倦怠', '焦虑', '学无止境', '迎刃而解'], focusTool: 'roleplay' },
  { id: 133, level: 7, moduleIndex: 3, moduleTitle: 'Chặng 7.3: Tâm lý học Xã hội, Giáo dục & Truyền thông', zh: '非物质文化遗产的活态传承', pinyin: 'Fēiwùzhì wénhuà yíchǎn de huótài chuánchéng', vi: 'Di sản văn hóa phi vật thể & Cấu trúc 得以 + Động từ双音节', grammarCode: 'HSK7-AUX-DEYI', keyVocab: ['得以', '传承', '匠心', '薪火相传'], focusTool: 'writing' },
  { id: 134, level: 7, moduleIndex: 3, moduleTitle: 'Chặng 7.3: Tâm lý học Xã hội, Giáo dục & Truyền thông', zh: '代际沟通与家庭观念演变', pinyin: 'Dàijì gōutōng yǔ jiātíng guānniàn yǎnbiàn', vi: 'Giao tiếp giữa các thế hệ & Thành ngữ 莫衷一是 / 各抒己见', grammarCode: 'HSK7-IDIOM-SYNTAX', keyVocab: ['演变', '鸿沟', '莫衷一是', '求同存异'], focusTool: 'listening' },
  { id: 135, level: 7, moduleIndex: 3, moduleTitle: 'Chặng 7.3: Tâm lý học Xã hội, Giáo dục & Truyền thông', zh: '公共舆情与媒介素养', pinyin: 'Gōnggòng yúqíng yǔ méijiè sùyǎng', vi: 'Dư luận xã hội & Phó từ cảnh báo 切忌 / 切勿', grammarCode: 'HSK7-IMP-QIEJI', keyVocab: ['切忌', '舆情', '断章取义', '捕风捉影'], focusTool: 'grammar' },

  { id: 136, level: 7, moduleIndex: 4, moduleTitle: 'Chặng 7.4: Kỹ thuật Biên dịch Trung ↔ Việt & Luận văn HSK 7', zh: '中越翻译技巧（一）：长定语的拆译与逆序', pinyin: 'Cháng dìngyǔ de chāiyì yǔ nìxù', vi: 'Kỹ thuật tách và đảo cụm Định ngữ dài khi dịch Trung ↔ Việt', grammarCode: 'HSK7-TRANS-MODIFIER', keyVocab: ['语序', '修饰', '融会贯通', '信达雅'], focusTool: 'reading' },
  { id: 137, level: 7, moduleIndex: 4, moduleTitle: 'Chặng 7.4: Kỹ thuật Biên dịch Trung ↔ Việt & Luận văn HSK 7', zh: '中越翻译技巧（二）：无主句与被动句转换', pinyin: 'Wúzhǔjù yǔ bèidòngjù zhuǎnhuàn', vi: 'Chuyển đổi câu khuyết chủ ngữ và câu bị động trong dịch thuật', grammarCode: 'HSK7-TRANS-PASSIVE', keyVocab: ['推敲', '语境', '恰如其分', '一脉相承'], focusTool: 'writing' },
  { id: 138, level: 7, moduleIndex: 4, moduleTitle: 'Chặng 7.4: Kỹ thuật Biên dịch Trung ↔ Việt & Luận văn HSK 7', zh: '多模态阅读：图表信息提取与归纳', pinyin: 'Duōmótài yuèdú: Túbiǎo xìnxī tíqǔ', vi: 'Đọc hiểu đa phương thức & Tóm tắt xu hướng biểu đồ', grammarCode: 'HSK7-CHART-TREND', keyVocab: ['飙升', '占比', '稳步增长', '一目了然'], focusTool: 'reading' },
  { id: 139, level: 7, moduleIndex: 4, moduleTitle: 'Chặng 7.4: Kỹ thuật Biên dịch Trung ↔ Việt & Luận văn HSK 7', zh: '议论文写作：立论、驳论与过渡衔接', pinyin: 'Yìlùnwén xiězuò: Lìlùn yǔ bólùn', vi: 'Kỹ thuật lập luận, phản biện và liên kết đoạn trong bài viết 300 chữ', grammarCode: 'HSK7-ESSAY-STRUCTURE', keyVocab: ['论点', '论据', '有目共睹', '不可否认'], focusTool: 'writing' },
  { id: 140, level: 7, moduleIndex: 4, moduleTitle: 'Chặng 7.4: Kỹ thuật Biên dịch Trung ↔ Việt & Luận văn HSK 7', zh: 'HSK 7 阶段综合测评与翻译实训', pinyin: 'HSK 7 Jiēduàn zōnghé cèpíng', vi: 'Thi thử tích hợp HSK 7 (Nghe - Đọc - Dịch thuật - Viết - Khẩu ngữ)', grammarCode: 'HSK7-FINAL-CBT', keyVocab: ['达标', '综合', '炉火纯青', '脱颖而出'], focusTool: 'exam' },

  // ==================== HSK 8 (Bài 141 - 160) ====================
  { id: 141, level: 8, moduleIndex: 1, moduleTitle: 'Chặng 8.1: Tiếng Trung Chuyên ngành CNTT, Hệ thống & AI', zh: '分布式系统与高并发架构设计', pinyin: 'Fēnbùshì xìtǒng yǔ gāobìngfā jiàgòu', vi: 'Hệ thống phân tán, Chịu tải cao & Cấu trúc 鉴于……故……', grammarCode: 'HSK8-IT-JIANYU', keyVocab: ['高并发', '微服务架构', '吞吐量', '容错'], focusTool: 'reading' },
  { id: 142, level: 8, moduleIndex: 1, moduleTitle: 'Chặng 8.1: Tiếng Trung Chuyên ngành CNTT, Hệ thống & AI', zh: '大语言模型训练与检索增强生成（RAG）', pinyin: 'Dàyǔyán móxíng yǔ jiǎnsuǒ zēngqiáng', vi: 'Huấn luyện LLM, Kiến trúc RAG & Cấu trúc 以……为依托', grammarCode: 'HSK8-IT-YITUO', keyVocab: ['大语言模型', '向量数据库', '推理', '语义'], focusTool: 'reading' },
  { id: 143, level: 8, moduleIndex: 1, moduleTitle: 'Chặng 8.1: Tiếng Trung Chuyên ngành CNTT, Hệ thống & AI', zh: '网络安全防护与数据隐私合规', pinyin: 'Wǎngluò ānquán yǔ shùjù yǐnsī héguī', vi: 'An ninh mạng, Tuân thủ dữ liệu & Cấu trúc 一经……即……', grammarCode: 'HSK8-LAW-YIJING', keyVocab: ['加密', '漏洞', '合规', '防患未然'], focusTool: 'grammar' },
  { id: 144, level: 8, moduleIndex: 1, moduleTitle: 'Chặng 8.1: Tiếng Trung Chuyên ngành CNTT, Hệ thống & AI', zh: '敏捷开发流程与跨国技术团队协作', pinyin: 'Mǐnjié kāifā yǔ kuàguó tuánduì xiézuò', vi: 'Quy trình Agile/Scrum & Giao tiếp kỹ thuật đa quốc gia', grammarCode: 'HSK8-IT-AGILE', keyVocab: ['迭代', '部署', '代码审查', '集思广益'], focusTool: 'roleplay' },
  { id: 145, level: 8, moduleIndex: 1, moduleTitle: 'Chặng 8.1: Tiếng Trung Chuyên ngành CNTT, Hệ thống & AI', zh: '芯片制造工艺与算力基础设施', pinyin: 'Xīnpiàn zhìzào yǔ suànlì jīchǔ shèshī', vi: 'Bán dẫn, Hạ tầng năng lực tính toán & Cấu trúc 不仅在于……更在于……', grammarCode: 'HSK8-CONJ-ZAIYU', keyVocab: ['算力', '自主研发', '攻关', '精益求精'], focusTool: 'listening' },

  { id: 146, level: 8, moduleIndex: 2, moduleTitle: 'Chặng 8.2: Tài chính Quốc tế, Thương mại & Đầu tư', zh: '跨境电商物流体系与关税壁垒', pinyin: 'Kuàjìng diànshāng wùliú yǔ guānshuì bìlěi', vi: 'Thương mại điện tử xuyên biên giới & Cấu trúc 凡属……均……', grammarCode: 'HSK8-COMM-FANSHU', keyVocab: ['清关', '壁垒', '居高不下', '顺应'], focusTool: 'reading' },
  { id: 147, level: 8, moduleIndex: 2, moduleTitle: 'Chặng 8.2: Tài chính Quốc tế, Thương mại & Đầu tư', zh: '资本市场波动与风险对冲策略', pinyin: 'Zīběn shìchǎng bōdòng yǔ fēngxiǎn duìchōng', vi: 'Biến động thị trường vốn, Phòng vệ rủi ro & Hư từ 固然……但……', grammarCode: 'HSK8-CONJ-GURAN', keyVocab: ['固然', '对冲', '瞬息万变', '审慎'], focusTool: 'grammar' },
  { id: 148, level: 8, moduleIndex: 2, moduleTitle: 'Chặng 8.2: Tài chính Quốc tế, Thương mại & Đầu tư', zh: '企业并购重组与知识产权估值', pinyin: 'Qǐyè bìnggòu chóngzǔ yǔ zhīshi chǎnquán', vi: 'Sáp nhập doanh nghiệp (M&A), Định giá sở hữu trí tuệ', grammarCode: 'HSK8-BIZ-VALUATION', keyVocab: ['并购', '估值', '专利', '独占鳌头'], focusTool: 'reading' },
  { id: 149, level: 8, moduleIndex: 2, moduleTitle: 'Chặng 8.2: Tài chính Quốc tế, Thương mại & Đầu tư', zh: '国际金融结算与汇率形成机制', pinyin: 'Guójì jīnróng jiésuàn yǔ huìlǜ jīzhì', vi: 'Thanh toán quốc tế, Cơ chế tỷ giá & Cấu trúc 视……而定', grammarCode: 'HSK8-PAT-SHI-ERDING', keyVocab: ['汇率', '结算', '挂钩', '息息相关'], focusTool: 'listening' },
  { id: 150, level: 8, moduleIndex: 2, moduleTitle: 'Chặng 8.2: Tài chính Quốc tế, Thương mại & Đầu tư', zh: '绿色金融债券与可持续发展报告（ESG）', pinyin: 'Lǜsè jīnróng yǔ ESG bàogào', vi: 'Tài chính xanh, Báo cáo ESG & Cấu trúc 兼顾 A 与 B', grammarCode: 'HSK8-VERB-JIANGU', keyVocab: ['兼顾', '披露', '透明', '行稳致远'], focusTool: 'writing' },

  { id: 151, level: 8, moduleIndex: 3, moduleTitle: 'Chặng 8.3: Văn bản Pháp lý, Hợp đồng & Công hàm Ngoại giao', zh: '商事合同条款的严谨性与免责声明', pinyin: 'Shāngshì hétóng tiáokuǎn yǔ miǎnzé', vi: 'Điều khoản hợp đồng thương mại & Cấu trúc 除……外，概不……', grammarCode: 'HSK8-LAW-GAIBU', keyVocab: ['违约', '免责', '不可抗力', '约束力'], focusTool: 'reading' },
  { id: 152, level: 8, moduleIndex: 3, moduleTitle: 'Chặng 8.3: Văn bản Pháp lý, Hợp đồng & Công hàm Ngoại giao', zh: '国际仲裁程序与争端解决机制', pinyin: 'Guójì zhòngcái yǔ zhēngduān jiějué', vi: 'Trọng tài quốc tế & Ngôn ngữ công văn 本着……的原则', grammarCode: 'HSK8-PREP-BENZHE', keyVocab: ['仲裁', '裁决', '达成共识', '秉持'], focusTool: 'grammar' },
  { id: 153, level: 8, moduleIndex: 3, moduleTitle: 'Chặng 8.3: Văn bản Pháp lý, Hợp đồng & Công hàm Ngoại giao', zh: '公文函电写作：照会、通知与备忘录', pinyin: 'Gōngwén hándiàn: Zhàohuì yǔ bèiwànglù', vi: 'Soạn thảo Công hàm, Thông báo, Biên bản ghi nhớ (MOU)', grammarCode: 'HSK8-DOC-MEMO', keyVocab: ['备忘录', '特此', '谨', '遵照'], focusTool: 'writing' },
  { id: 154, level: 8, moduleIndex: 3, moduleTitle: 'Chặng 8.3: Văn bản Pháp lý, Hợp đồng & Công hàm Ngoại giao', zh: '现代医学伦理与生物技术突破', pinyin: 'Xiàndài yīxué lúnlǐ yǔ shēngwù jìshù', vi: 'Y đức hiện đại, Công nghệ sinh học & Cấu trúc 关乎……', grammarCode: 'HSK8-VERB-GUANHU', keyVocab: ['伦理', '临床', '攻克', '息息相关'], focusTool: 'listening' },
  { id: 155, level: 8, moduleIndex: 3, moduleTitle: 'Chặng 8.3: Văn bản Pháp lý, Hợp đồng & Công hàm Ngoại giao', zh: '学术讲座同声传译与速记符号体系', pinyin: 'Xuéshù jiǎngzuò chuányì yǔ sùjì', vi: 'Kỹ thuật ghi tốc ký (Note-taking) trong phiên dịch hội thảo', grammarCode: 'HSK8-INTERP-NOTES', keyVocab: ['传译', '提纲挈领', '言简意赅', '随机应变'], focusTool: 'roleplay' },

  { id: 156, level: 8, moduleIndex: 4, moduleTitle: 'Chặng 8.4: Đặc huấn Viết Biểu đồ Số liệu (图表作文) & Phiên dịch HSK 8', zh: '图表作文专攻：数据趋势描述与归因分析', pinyin: 'Túbiǎo zuòwén: Shùjù qūshì yǔ guīyīn', vi: 'Công thức viết bài phân tích biểu đồ 400 chữ (Mô tả số liệu → Nguyên nhân → Dự báo)', grammarCode: 'HSK8-CHART-ESSAY', keyVocab: ['呈现', '态势', '归因于', '显而易见'], focusTool: 'writing' },
  { id: 157, level: 8, moduleIndex: 4, moduleTitle: 'Chặng 8.4: Đặc huấn Viết Biểu đồ Số liệu (图表作文) & Phiên dịch HSK 8', zh: '高阶翻译：四字格成语在越译中中的增色作用', pinyin: 'Sìzìgé zài fānyì zhōng de zēngsè', vi: 'Ứng dụng cấu trúc Tứ tự cách (4 chữ) để nâng điểm bài dịch Việt → Trung', grammarCode: 'HSK8-TRANS-4CHAR', keyVocab: ['精炼', '对称', '画龙点睛', '字斟句酌'], focusTool: 'writing' },
  { id: 158, level: 8, moduleIndex: 4, moduleTitle: 'Chặng 8.4: Đặc huấn Viết Biểu đồ Số liệu (图表作文) & Phiên dịch HSK 8', zh: '长篇学术论文摘要（Abstract）阅读与撰写', pinyin: 'Xuéshù lùnwén zhāiyào yuèdú yǔ zhuànxiě', vi: 'Đọc và viết Tóm tắt luận văn khoa học (Abstract) chuẩn học thuật', grammarCode: 'HSK8-ACADEMIC-ABSTRACT', keyVocab: ['摘要', '论证', '实证', '综上所述'], focusTool: 'reading' },
  { id: 159, level: 8, moduleIndex: 4, moduleTitle: 'Chặng 8.4: Đặc huấn Viết Biểu đồ Số liệu (图表作文) & Phiên dịch HSK 8', zh: '口语即兴评述：两难议题的辩证表达', pinyin: 'Kǒuyǔ jíxìng píngshù: Biànzhèng biǎodá', vi: 'Phát biểu ứng khẩu 3 phút về các chủ đề xã hội có hai luồng ý kiến trái chiều', grammarCode: 'HSK8-SPEAK-DIALECTIC', keyVocab: ['辩证', '利弊', '一分为二', '权衡'], focusTool: 'roleplay' },
  { id: 160, level: 8, moduleIndex: 4, moduleTitle: 'Chặng 8.4: Đặc huấn Viết Biểu đồ Số liệu (图表作文) & Phiên dịch HSK 8', zh: 'HSK 8 阶段全真统考与专业能力认证', pinyin: 'HSK 8 Quánzhēn tǒngkǎo', vi: 'Thi thử tích hợp HSK 8 (Mục tiêu ≥ 210/300 điểm chuẩn CTI)', grammarCode: 'HSK8-FINAL-CBT', keyVocab: ['娴熟', '游刃有余', '登峰造极', '胜任'], focusTool: 'exam' },

  // ==================== HSK 9 (Bài 161 - 180) ====================
  { id: 161, level: 9, moduleIndex: 1, moduleTitle: 'Chặng 9.1: Tinh hoa Cổ văn Ứng dụng trong Hán ngữ Hiện đại', zh: '文言虚词在现代书面语中的遗存（之、其、所、以）', pinyin: 'Wényán xūcí zài xiàndài shūmiànyǔ', vi: 'Hư từ cổ văn (之, 其, 所, 以) trong báo chí và văn bản học thuật hiện đại', grammarCode: 'HSK9-CLASSICAL-PARTICLES', keyVocab: ['持之以恒', '总而言之', '竭尽所能', '一以贯之'], focusTool: 'grammar' },
  { id: 162, level: 9, moduleIndex: 1, moduleTitle: 'Chặng 9.1: Tinh hoa Cổ văn Ứng dụng trong Hán ngữ Hiện đại', zh: '《论语》与《孟子》中的治学与修身之道', pinyin: 'Lúnyǔ yǔ Mèngzǐ zhōng de zhìxué zhī dào', vi: 'Danh ngôn Luận Ngữ & Mạnh Tử thường trích dẫn trong bài thi HSK 9', grammarCode: 'HSK9-CLASSICAL-QUOTES', keyVocab: ['温故知新', '举一反三', '见贤思齐', '修身'], focusTool: 'reading' },
  { id: 163, level: 9, moduleIndex: 1, moduleTitle: 'Chặng 9.1: Tinh hoa Cổ văn Ứng dụng trong Hán ngữ Hiện đại', zh: '《道德经》与《孙子兵法》的现代管理学启示', pinyin: 'Dàodéjīng yǔ Sūnzǐ Bīngfǎ de qǐshì', vi: 'Triết lý Đạo Đức Kinh & Tôn Tử Binh Pháp trong quản trị chiến lược', grammarCode: 'HSK9-STRATEGIC-IDIOMS', keyVocab: ['运筹帷幄', '知己知彼', '上善若水', '审时度势'], focusTool: 'reading' },
  { id: 164, level: 9, moduleIndex: 1, moduleTitle: 'Chặng 9.1: Tinh hoa Cổ văn Ứng dụng trong Hán ngữ Hiện đại', zh: '古今词义演变与文言固定句式（何……之有 / 无乃……乎）', pinyin: 'Wényán gùdìng jùshì', vi: 'Cấu trúc phản vấn cổ điển: 何……之有？ / 不亦……乎？', grammarCode: 'HSK9-CLASSICAL-RHETORIC', keyVocab: ['不亦乐乎', '何罪之有', '岂有此理', '古今中外'], focusTool: 'grammar' },
  { id: 165, level: 9, moduleIndex: 1, moduleTitle: 'Chặng 9.1: Tinh hoa Cổ văn Ứng dụng trong Hán ngữ Hiện đại', zh: '唐诗宋词意境鉴赏与中越汉诗格律对比', pinyin: 'Tángshī Sòngcí yìjìng jiànshǎng', vi: 'Thưởng thức Đường thi Tống từ & Đối chiếu thơ chữ Hán Việt Nam – Trung Quốc', grammarCode: 'HSK9-POETRY-AESTHETICS', keyVocab: ['意境', '格律', '千古绝唱', '脍炙人口'], focusTool: 'reading' },

  { id: 166, level: 9, moduleIndex: 2, moduleTitle: 'Chặng 9.2: Tư duy Triết học, Phê bình Văn học & Đàm phán Cấp cao', zh: '东西方哲学思维范式的比较与交融', pinyin: 'Dōng-Xīfāng zhéxué sīwéi fànshì', vi: 'So sánh mô thức tư duy triết học Đông – Tây & Cấu trúc 诚如……所言', grammarCode: 'HSK9-PHIL-CHENGRU', keyVocab: ['范式', '天人合一', '博大精深', '兼容并蓄'], focusTool: 'reading' },
  { id: 167, level: 9, moduleIndex: 2, moduleTitle: 'Chặng 9.2: Tư duy Triết học, Phê bình Văn học & Đàm phán Cấp cao', zh: '当代文学批评与叙事美学分析', pinyin: 'Dāngdài wénxué pīpíng yǔ xùshì měixué', vi: 'Phê bình văn học đương đại & Nghệ thuật tự sự', grammarCode: 'HSK9-LIT-CRITICISM', keyVocab: ['隐喻', '勾勒', '入木三分', '耐人寻味'], focusTool: 'reading' },
  { id: 168, level: 9, moduleIndex: 2, moduleTitle: 'Chặng 9.2: Tư duy Triết học, Phê bình Văn học & Đàm phán Cấp cao', zh: '高层外交辞令：委婉表达与立场宣示', pinyin: 'Gāocéng wàijiāo cílìng', vi: 'Ngôn từ ngoại giao cấp cao: Cách nói uyển chuyển và tuyên bố lập trường', grammarCode: 'HSK9-DIPLOMATIC-TONE', keyVocab: ['重申', '磋商', '高瞻远瞩', '不言而喻'], focusTool: 'roleplay' },
  { id: 169, level: 9, moduleIndex: 2, moduleTitle: 'Chặng 9.2: Tư duy Triết học, Phê bình Văn học & Đàm phán Cấp cao', zh: '宏观社会学调查报告的批判性阅读', pinyin: 'Shèhuìxué diàochá bàogào pīpànxìng yuèdú', vi: 'Đọc phản biện báo cáo xã hội học & Nhận diện ngụy biện logic', grammarCode: 'HSK9-CRITICAL-LOGIC', keyVocab: ['抽样', '偏差', '以偏概全', '因果倒置'], focusTool: 'reading' },
  { id: 170, level: 9, moduleIndex: 2, moduleTitle: 'Chặng 9.2: Tư duy Triết học, Phê bình Văn học & Đàm phán Cấp cao', zh: '高难度病句与逻辑歧义终极辨析', pinyin: 'Gāonándù bìngjù yǔ luójí qíyì', vi: 'Phân tích câu bệnh học thuật và câu đa nghĩa phức tạp bậc HSK 9', grammarCode: 'HSK9-ADVANCED-YUBING', keyVocab: ['歧义', '偷换概念', '自相矛盾', '无懈可击'], focusTool: 'grammar' },

  { id: 171, level: 9, moduleIndex: 3, moduleTitle: 'Chặng 9.3: Đỉnh cao Biên dịch & Phiên dịch Học thuật (Tín - Đạt - Nhã)', zh: '严复“信、达、雅”翻译标准在政经文献中的实践', pinyin: 'Xìn, Dá, Yǎ fānyì biāozhǔn', vi: 'Thực hành tiêu chuẩn Tín – Đạt – Nhã trong dịch thuật văn kiện chính trị - kinh tế', grammarCode: 'HSK9-TRANS-XINDAYA', keyVocab: ['信达雅', '传神', '相得益彰', '精益求精'], focusTool: 'writing' },
  { id: 172, level: 9, moduleIndex: 3, moduleTitle: 'Chặng 9.3: Đỉnh cao Biên dịch & Phiên dịch Học thuật (Tín - Đạt - Nhã)', zh: '文化负载词与俗语谚语的归化与异化译法', pinyin: 'Wénhuà fùzàicí de guīhuà yǔ yìhuà', vi: 'Phương pháp Quy hóa (Domestication) & Dị hóa (Foreignization) khi dịch điển cố văn hóa', grammarCode: 'HSK9-TRANS-CULTURAL', keyVocab: ['归化', '异化', '入木三分', '异曲同工'], focusTool: 'reading' },
  { id: 173, level: 9, moduleIndex: 3, moduleTitle: 'Chặng 9.3: Đỉnh cao Biên dịch & Phiên dịch Học thuật (Tín - Đạt - Nhã)', zh: '法律条文与大型招标书的精准汉越互译', pinyin: 'Fǎlǜ tiáowén yǔ zhāobiāoshū hùyì', vi: 'Dịch thuật chính xác văn bản luật và hồ sơ mời thầu quốc tế', grammarCode: 'HSK9-TRANS-LEGAL', keyVocab: ['招标', '具有法律效力', '严谨', '滴水不漏'], focusTool: 'writing' },
  { id: 174, level: 9, moduleIndex: 3, moduleTitle: 'Chặng 9.3: Đỉnh cao Biên dịch & Phiên dịch Học thuật (Tín - Đạt - Nhã)', zh: '国际峰会主旨演讲视译与同传实训', pinyin: 'Guójì fēnghuì zhǔzhǐ yǎnjiǎng shìyì', vi: 'Dịch nhìn (Sight Translation) và Phiên dịch cabin bài phát biểu hội nghị thượng đỉnh', grammarCode: 'HSK9-SIGHT-INTERP', keyVocab: ['主旨', '同声传译', '一气呵成', '出口成章'], focusTool: 'listening' },
  { id: 175, level: 9, moduleIndex: 3, moduleTitle: 'Chặng 9.3: Đỉnh cao Biên dịch & Phiên dịch Học thuật (Tín - Đạt - Nhã)', zh: '文学散文与哲理随笔的高阶修辞润色', pinyin: 'Wénxué sǎnwén xiūcí rùnsè', vi: 'Nhuận sắc tu từ (Ẩn dụ, Điệp cấu trúc, Đối ngẫu) trong dịch văn học', grammarCode: 'HSK9-RHETORIC-PARALLEL', keyVocab: ['排比', '对仗', '润色', '妙笔生花'], focusTool: 'writing' },

  { id: 176, level: 9, moduleIndex: 4, moduleTitle: 'Chặng 9.4: Luận văn Nghị luận 600 Chữ, Hùng biện & Thi Tốt Nghiệp HSK 9', zh: '600字深度议论文写作：破题、立意与思辨层次', pinyin: 'Liùbǎi zì shēndù yìlùnwén xiězuò', vi: 'Kiến trúc bài luận 600 chữ chuẩn HSK 9: Mở bài dẫn điển tích, Thân bài 3 tầng phản biện', grammarCode: 'HSK9-ESSAY-600CHARS', keyVocab: ['立意', '思辨', '高屋建瓴', '发人深省'], focusTool: 'writing' },
  { id: 177, level: 9, moduleIndex: 4, moduleTitle: 'Chặng 9.4: Luận văn Nghị luận 600 Chữ, Hùng biện & Thi Tốt Nghiệp HSK 9', zh: '高阶学术口语答辩：反驳技巧与逻辑攻防', pinyin: 'Xuéshù kǒuyǔ dábiàn yǔ luójí gōngfáng', vi: 'Kỹ thuật bảo vệ luận điểm và phản biện học thuật trước hội đồng giám khảo', grammarCode: 'HSK9-ORAL-DEFENSE', keyVocab: ['答辩', '针锋相对', '有理有据', '折服'], focusTool: 'roleplay' },
  { id: 178, level: 9, moduleIndex: 4, moduleTitle: 'Chặng 9.4: Luận văn Nghị luận 600 Chữ, Hùng biện & Thi Tốt Nghiệp HSK 9', zh: 'HSK 7–9 全真综合模拟统考（一）：听力与阅读卷', pinyin: 'HSK 7-9 Quánzhēn tǒngkǎo: Tīnglì yǔ Yuèdú', vi: 'Thi thử HSK 7–9 Phần 1: 40 câu Nghe học thuật + 47 câu Đọc chuyên sâu', grammarCode: 'HSK9-MOCK-PART1', keyVocab: ['融会贯通', '洞察', '游刃有余', '胸有成竹'], focusTool: 'exam' },
  { id: 179, level: 9, moduleIndex: 4, moduleTitle: 'Chặng 9.4: Luận văn Nghị luận 600 Chữ, Hùng biện & Thi Tốt Nghiệp HSK 9', zh: 'HSK 7–9 全真综合模拟统考（二）：写作、翻译与口语卷', pinyin: 'HSK 7-9 Quánzhēn tǒngkǎo: Xiě-Yì-Shuō', vi: 'Thi thử HSK 7–9 Phần 2: Viết biểu đồ + Luận văn 600 chữ + Dịch thuật + Khẩu ngữ', grammarCode: 'HSK9-MOCK-PART2', keyVocab: ['一气呵成', '字斟句酌', '雄辩', '卓越'], focusTool: 'exam' },
  { id: 180, level: 9, moduleIndex: 4, moduleTitle: 'Chặng 9.4: Luận văn Nghị luận 600 Chữ, Hùng biện & Thi Tốt Nghiệp HSK 9', zh: 'HSK 9 终极大师认证与汉学研究展望', pinyin: 'HSK 9 Zhōngjí dàshī rènzhèng', vi: 'Chứng nhận Đại sư Hán ngữ HSK 9 (11.092 từ) & Định hướng nghiên cứu chuyên sâu', grammarCode: 'HSK9-MASTER-CERT', keyVocab: ['集大成', '登峰造极', '学贯中西', '止于至善'], focusTool: 'exam' },
];

export const HSK_7_TO_9_LESSONS = RAW_HSK_7_TO_9_LESSONS.map((lesson) => {
  const astMeta = HSK_7_TO_9_GRAMMAR_AST_MAP[lesson.grammarCode];
  return {
    ...lesson,
    lessonNumber: lesson.id,
    stringId: `hsk79-${lesson.id}`,
    moduleCode: `${lesson.level}.${lesson.moduleIndex}`,
    grammarPattern: astMeta?.patternDisplay || lesson.vi,
    grammarTitleVi: astMeta?.category || lesson.vi,
    isHsk79: true,
  };
});

// Backward-compatible aliases for Roadmap UI & existing HSK 7-9 test suites
export const HSK79_CBT_CONFIG = {
  paperCode: 'HSK79-STD',
  questionCount: 98,
  durationMinutes: 210,
  maxScore: 300,
  skills: ['Nghe hiểu', 'Đọc hiểu', 'Viết luận & Biểu đồ', 'Biên dịch Trung ↔ Việt', 'Khẩu ngữ Biện luận'],
  passThresholds: { 7: 180, 8: 210, 9: 240 },
};

export const HSK79_STAGE_CONFIGS = HSK_7_TO_9_STAGE_CONFIGS.reduce((acc, cfg) => {
  acc[cfg.level] = {
    level: cfg.level,
    code: cfg.badge,
    bandLabel: `Bậc Cao cấp (${cfg.badge})`,
    title: `${cfg.badge} — ${cfg.titleVi}`,
    chineseTitle: cfg.subtitleZh,
    description: `${cfg.titleVi} · Đạt ${cfg.examConfig.passScore}/${cfg.examConfig.maxScore}đ`,
    vocabTarget: cfg.vocabTarget,
    newVocabIncremental: cfg.newWords,
    hanziTarget: cfg.hanziTarget,
    lessonRange: cfg.lessonRange,
    passScore: cfg.examConfig.passScore,
    maxScore: cfg.examConfig.maxScore,
    cbtSummary: `${cfg.examConfig.questionCount} câu · ${cfg.examConfig.durationMinutes} phút · Đạt ${cfg.badge} ≥ ${cfg.examConfig.passScore}/300đ`,
    color: cfg.level === 7 ? '#0891B2' : cfg.level === 8 ? '#4F46E5' : '#D97706',
    paperCode: cfg.examConfig.paperCode,
    primaryTools: cfg.primaryTools,
  };
  return acc;
}, {});

export const HSK79_MODULE_TITLES = Array.from(
  HSK_7_TO_9_LESSONS.reduce((map, lesson) => {
    const code = `${lesson.level}.${lesson.moduleIndex}`;
    if (!map.has(code)) {
      const cfg = HSK_7_TO_9_STAGE_CONFIGS.find((s) => s.level === lesson.level);
      map.set(code, {
        level: lesson.level,
        moduleIndex: lesson.moduleIndex,
        code,
        title: lesson.moduleTitle,
        chineseTitle: cfg?.subtitleZh || lesson.zh,
        desc: `Chặng ${code}: ${lesson.moduleTitle.replace(/^Chặng \d\.\d:\s*/, '')}`,
      });
    }
    return map;
  }, new Map()).values()
);

export const HSK_79_60_LESSONS = HSK_7_TO_9_LESSONS;

export function getHsk79LessonMetaById(lessonId) {
  if (lessonId === null || lessonId === undefined) return null;
  const parsed =
    typeof lessonId === 'number'
      ? lessonId
      : Number(String(lessonId).replace(/^hsk79-/, '').replace(/^l-/, ''));
  if (!Number.isFinite(parsed)) return null;
  return HSK_7_TO_9_LESSONS.find((l) => l.id === parsed) || null;
}

export default HSK_7_TO_9_LESSONS;
