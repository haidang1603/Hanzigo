/**
 * =========================================================================
 * HANZIGO — CONTEXTUAL ROLEPLAY SCENARIO BUILDER (PHASE 11)
 * =========================================================================
 * Bộ máy xây dựng kịch bản hội thoại nhập vai theo ngữ cảnh:
 * 1. Tự động trích xuất ngữ cảnh, từ vựng và ngữ pháp từ 120 bài học HSK 1–6.
 * 2. Cung cấp 6 tình huống giao tiếp đời thực kinh điển cho mọi trình độ.
 * 3. Định nghĩa 3 mục tiêu nhiệm vụ sư phạm cho mỗi phiên nhập vai.
 * =========================================================================
 */

import { CURRICULUM_ALL_LESSONS, getCurriculumLessonById } from '../data/curriculumLessons.js';

// 6 Tình huống giao tiếp thực tế đặc biệt
export const SPECIAL_ROLEPLAY_SCENARIOS = [
  {
    id: 'scenario-restaurant',
    title: 'Gọi món tại Nhà hàng Tứ Xuyên',
    chineseTitle: '在四川餐馆点菜',
    hskLevel: 'HSK 1-2',
    category: 'Ẩm thực & Đời sống',
    avatar: '🍜',
    aiPersona: {
      name: 'Vương Tiểu Nhị (服务员小王)',
      role: 'Nhân viên phục vụ nhà hàng Tứ Xuyên nhiệt tình, niềm nở',
      tone: 'Thân thiện, lịch sự, gợi ý món đặc sản'
    },
    userPersona: 'Thực khách lần đầu trải nghiệm ẩm thực Tứ Xuyên',
    initialAiGreeting: {
      hanzi: '您好！欢迎光临！请问几位？请问想吃点什么？',
      pinyin: 'Nín hǎo! Huānyíng guānglín! Qǐngwèn jǐ wèi? Qǐngwèn xiǎng chī diǎn shénme?',
      vi: 'Xin chào! Hoan nghênh quý khách! Cho hỏi quý khách đi mấy người? Quý khách muốn dùng món gì ạ?'
    },
    missionObjectives: [
      { id: 1, text: 'Chào hỏi nhân viên và thông báo số lượng người đi cùng', completed: false },
      { id: 2, text: 'Hỏi giá tiền hoặc dặn dò khẩu vị (ít cay / không cay)', completed: false },
      { id: 3, text: 'Gọi ít nhất 1 món ăn hoặc 1 đồ uống và nói lời cảm ơn', completed: false }
    ],
    targetVocab: [
      { hanzi: '菜单', pinyin: 'càidān', meaning: 'thực đơn' },
      { hanzi: '点菜', pinyin: 'diǎncài', meaning: 'gọi món' },
      { hanzi: '辣', pinyin: 'là', meaning: 'cay' },
      { hanzi: '米饭', pinyin: 'mǐfàn', meaning: 'cơm trắng' },
      { hanzi: '买单', pinyin: 'mǎidān', meaning: 'thanh toán, tính tiền' },
      { hanzi: '多少钱', pinyin: 'duōshao qián', meaning: 'bao nhiêu tiền' }
    ],
    targetGrammar: [
      { title: 'Câu chữ 想 (Muốn)', structure: 'S + 想 + V + O', explanation: 'Bày tỏ mong muốn' },
      { title: 'Hỏi số lượng với 几/多少', structure: '几 + Lượng từ / 多少 + N', explanation: 'Hỏi số lượng' }
    ]
  },
  {
    id: 'scenario-shopping',
    title: 'Mặc cả Mua sắm tại Chợ Đêm Vương Phủ Tỉnh',
    chineseTitle: '在王府井夜市买东西砍价',
    hskLevel: 'HSK 2-3',
    category: 'Mua sắm & Du lịch',
    avatar: '🛍️',
    aiPersona: {
      name: 'Bác Trương (张老板)',
      role: 'Chủ quầy đồ lưu niệm và trà cổ Bắc Kinh lâu năm, biết cách nói chuyện',
      tone: 'Hồ hởi, mời chào, thích thương lượng giá vui vẻ'
    },
    userPersona: 'Khách du lịch Việt Nam tìm mua quà lưu niệm',
    initialAiGreeting: {
      hanzi: '帅哥/美女，来看一看！正宗的北京丝绸和茶叶，今天打折，想要哪个？',
      pinyin: 'Shuàigē/Měinǚ, lái kàn yí kàn! Zhèngzōng de Běijīng sīchóu hé cháyè, jīntiān dǎzhé, xiǎng yào nǎge?',
      vi: 'Bạn ơi ghé xem thử đi! Lụa và trà Bắc Kinh chính gốc, hôm nay giảm giá đặc biệt, muốn lấy cái nào?'
    },
    missionObjectives: [
      { id: 1, text: 'Hỏi giá của một món đồ lưu niệm hoặc trà', completed: false },
      { id: 2, text: 'Chê đắt và thương lượng giảm giá ít nhất 1 lần', completed: false },
      { id: 3, text: 'Chốt số lượng mua và thanh toán bằng WeChat/Alipay hoặc tiền mặt', completed: false }
    ],
    targetVocab: [
      { hanzi: '便宜', pinyin: 'piányi', meaning: 'rẻ' },
      { hanzi: '太贵了', pinyin: 'tài guì le', meaning: 'đắt quá rồi' },
      { hanzi: '打折', pinyin: 'dǎzhé', meaning: 'giảm giá' },
      { hanzi: '现金', pinyin: 'xiànjīn', meaning: 'tiền mặt' },
      { hanzi: '扫码', pinyin: 'sǎomǎ', meaning: 'quét mã thanh toán' }
    ],
    targetGrammar: [
      { title: 'Cấu trúc 太...了 (Quá/Lắm)', structure: '太 + Adj + 了', explanation: 'Biểu thị mức độ cao' },
      { title: 'Câu so sánh 比', structure: 'A 比 B + Adj', explanation: 'So sánh hơn kém' }
    ]
  },
  {
    id: 'scenario-taxi',
    title: 'Hỏi đường & Bắt Taxi tới Sân bay',
    chineseTitle: '打出租车去大兴机场',
    hskLevel: 'HSK 2-3',
    category: 'Giao thông & Di chuyển',
    avatar: '🚕',
    aiPersona: {
      name: 'Bác tài Lý (李师傅)',
      role: 'Tài xế taxi rành đường xá Bắc Kinh, nói giọng chuẩn địa phương',
      tone: 'Nhanh nhẹn, thân thiện, hỏi han lộ trình'
    },
    userPersona: 'Hành khách đang vội ra sân bay để kịp chuyến bay về Việt Nam',
    initialAiGreeting: {
      hanzi: '您好！去哪儿啊？请系好安全带，后备箱可以放行李。',
      pinyin: 'Nín hǎo! Qù nǎr a? Qǐng jì hǎo ānquándài, hòubèixiāng kěyǐ fàng xíngli.',
      vi: 'Chào quý khách! Đi đâu thế ạ? Nhớ thắt dây an toàn, cốp sau xe có thể để hành lý nhé.'
    },
    missionObjectives: [
      { id: 1, text: 'Nói rõ địa điểm đích đến (Sân bay / Khách sạn / Ga tàu)', completed: false },
      { id: 2, text: 'Hỏi thời gian di chuyển dự kiến hoặc tình trạng tắc đường', completed: false },
      { id: 3, text: 'Yêu cầu in hóa đơn hoặc hỏi giá cước', completed: false }
    ],
    targetVocab: [
      { hanzi: '机场', pinyin: 'jīchǎng', meaning: 'sân bay' },
      { hanzi: '堵车', pinyin: 'dǔchē', meaning: 'tắc đường' },
      { hanzi: '大概', pinyin: 'dàgài', meaning: 'khoảng chừng, ước chừng' },
      { hanzi: '发票', pinyin: 'fāpiào', meaning: 'hóa đơn' },
      { hanzi: '慢走', pinyin: 'mànzǒu', meaning: 'đi thong thả (chào tạm biệt)' }
    ],
    targetGrammar: [
      { title: 'Giới từ 从...到... (Từ... đến...)', structure: '从 A 到 B', explanation: 'Chỉ cự ly hoặc thời gian' },
      { title: 'Cấu trúc 要...了 (Sắp... rồi)', structure: '快要/要 + V + 了', explanation: 'Sự việc sắp xảy ra' }
    ]
  },
  {
    id: 'scenario-pharmacy',
    title: 'Mua thuốc & Khám tại Hiệu thuốc',
    chineseTitle: '在同仁堂药店买药',
    hskLevel: 'HSK 3-4',
    category: 'Y tế & Sức khỏe',
    avatar: '💊',
    aiPersona: {
      name: 'Dược sĩ Lưu (刘药剂师)',
      role: 'Dược sĩ giàu kinh nghiệm tại hiệu thuốc Đồng Nhân Đường',
      tone: 'Ân cần, cẩn thận, hỏi kỹ triệu chứng bệnh'
    },
    userPersona: 'Người học cảm thấy không khỏe (cảm sốt, đau đầu)',
    initialAiGreeting: {
      hanzi: '您好，请问您哪里不舒服？发烧还是头疼？',
      pinyin: 'Nín hǎo, qǐngwèn nín nǎlǐ bù shūfu? Fāshāo háishi tóuténg?',
      vi: 'Xin chào, cho hỏi quý khách khó chịu ở đâu? Bị sốt hay đau đầu thế ạ?'
    },
    missionObjectives: [
      { id: 1, text: 'Mô tả rõ ràng ít nhất 2 triệu chứng cơ thể (đau đầu, sốt, ho, sổ mũi)', completed: false },
      { id: 2, text: 'Hỏi cách uống thuốc (ngày mấy lần, trước hay sau bữa ăn)', completed: false },
      { id: 3, text: 'Hỏi thuốc có tác dụng phụ gây buồn ngủ không', completed: false }
    ],
    targetVocab: [
      { hanzi: '发烧', pinyin: 'fāshāo', meaning: 'bị sốt' },
      { hanzi: '头疼', pinyin: 'tóuténg', meaning: 'đau đầu' },
      { hanzi: '感冒', pinyin: 'gǎnmào', meaning: 'cảm cúm' },
      { hanzi: '吃药', pinyin: 'chī yào', meaning: 'uống thuốc' },
      { hanzi: '饭后', pinyin: 'fànhòu', meaning: 'sau bữa ăn' }
    ],
    targetGrammar: [
      { title: 'Liên từ 还是 (Hay là trong câu hỏi)', structure: 'A 还是 B ?', explanation: 'Câu hỏi lựa chọn' },
      { title: 'Cấu trúc 除了...以外 (Ngoài... ra)', structure: '除了 A 以外，还/都...', explanation: 'Biểu thị ngoại trừ hoặc bổ sung' }
    ]
  },
  {
    id: 'scenario-it-interview',
    title: 'Phỏng vấn Xin việc Lập trình viên',
    chineseTitle: 'IT软件工程师岗位面试',
    hskLevel: 'HSK 4-5',
    category: 'Nghề nghiệp & Công nghệ',
    avatar: '💻',
    aiPersona: {
      name: 'Giám đốc Nhân sự Trần (陈总监)',
      role: 'Trưởng bộ phận tuyển dụng công ty công nghệ tại Thâm Quyến',
      tone: 'Chuyên nghiệp, trọng nhân tài, đánh giá kỹ năng thực chiến'
    },
    userPersona: 'Kỹ sư phần mềm Việt Nam ứng tuyển vào dự án phần mềm đa quốc gia',
    initialAiGreeting: {
      hanzi: '请坐！我看过你的简历，你的项目经验很丰富。首先请用中文做一个简单的自我介绍吧。',
      pinyin: 'Qǐng zuò! Wǒ kànguò nǐ de jiǎnlì, nǐ de xiàngmù jīngyàn hěn fēngfù. Shǒuxiān qǐng yòng zhōngwén zuò yí gè jiǎndān de zìwǒ jièshào ba.',
      vi: 'Mời ngồi! Tôi đã xem qua CV của bạn, kinh nghiệm dự án khá phong phú. Trước hết xin mời bạn giới thiệu ngắn gọn về bản thân bằng tiếng Trung nhé.'
    },
    missionObjectives: [
      { id: 1, text: 'Giới thiệu bản thân và kinh nghiệm làm việc trọng tâm', completed: false },
      { id: 2, text: 'Nêu lý do ứng tuyển và điểm mạnh của bản thân', completed: false },
      { id: 3, text: 'Đặt 1 câu hỏi ngược lại cho nhà tuyển dụng về văn hóa công ty hoặc lộ trình dự án', completed: false }
    ],
    targetVocab: [
      { hanzi: '简历', pinyin: 'jiǎnlì', meaning: 'sơ yếu lý lịch, CV' },
      { hanzi: '经验', pinyin: 'jīngyàn', meaning: 'kinh nghiệm' },
      { hanzi: '技术', pinyin: 'jìshù', meaning: 'kỹ thuật, công nghệ' },
      { hanzi: '负责', pinyin: 'fùzé', meaning: 'phụ trách, chịu trách nhiệm' },
      { hanzi: '挑战', pinyin: 'tiǎozhàn', meaning: 'thử thách' }
    ],
    targetGrammar: [
      { title: 'Câu chữ 把 (Câu xử lý)', structure: 'S + 把 + O + V + Thành phần khác', explanation: 'Nhấn mạnh sự tác động làm biến đổi đối tượng' },
      { title: 'Cấu trúc 不但...而且 (Không những... mà còn)', structure: '不但 A 而且 B', explanation: 'Quan hệ tăng tiến' }
    ]
  },
  {
    id: 'scenario-business-negotiation',
    title: 'Đàm phán Hợp đồng Thương mại',
    chineseTitle: '进出口贸易商务合同谈判',
    hskLevel: 'HSK 5-6',
    category: 'Thương mại & Hợp đồng',
    avatar: '🤝',
    aiPersona: {
      name: 'Tổng Giám đốc Mã (马总经理)',
      role: 'Đại diện đàm phán cấp cao của tập đoàn thương mại quốc tế',
      tone: 'Điềm tĩnh, sắc sảo, tôn trọng nguyên tắc đôi bên cùng có lợi (Win-Win)'
    },
    userPersona: 'Giám đốc xuất nhập khẩu đại diện doanh nghiệp Việt Nam',
    initialAiGreeting: {
      hanzi: '欢迎各位贵宾！关于这次农产品采购合同的付款方式和交货期，贵公司有什么具体的建议？',
      pinyin: 'Huānyíng gèwèi guìbīn! Guānyú zhè cì nóngchǎnpǐn cǎigòu hétong de fùkuǎn fāngshì hé jiāohuò qī, guì gōngsī yǒu shénme jùtǐ de jiànyì?',
      vi: 'Nhiệt liệt chào mừng quý khách! Về phương thức thanh toán và thời hạn giao hàng của hợp đồng thu mua nông sản lần này, quý công ty có đề xuất cụ thể nào không?'
    },
    missionObjectives: [
      { id: 1, text: 'Đưa ra đề xuất phương thức thanh toán L/C hoặc T/T', completed: false },
      { id: 2, text: 'Thương lượng về thời hạn giao hàng hoặc tỷ lệ chiết khấu theo số lượng', completed: false },
      { id: 3, text: 'Đạt được thỏa thuận nguyên tắc và chúc mừng sự hợp tác đôi bên', completed: false }
    ],
    targetVocab: [
      { hanzi: '合同', pinyin: 'hétong', meaning: 'hợp đồng' },
      { hanzi: '交货', pinyin: 'jiāohuò', meaning: 'giao hàng' },
      { hanzi: '付款', pinyin: 'fùkuǎn', meaning: 'thanh toán tiền' },
      { hanzi: '双方', pinyin: 'shuāngfāng', meaning: 'hai bên, đôi bên' },
      { hanzi: '合作', pinyin: 'hézuò', meaning: 'hợp tác' }
    ],
    targetGrammar: [
      { title: 'Cấu trúc 关于 (Về vấn đề gì)', structure: '关于 + N / Cụm từ, ...', explanation: 'Đưa ra phạm vi chủ đề' },
      { title: 'Cấu trúc 哪怕...也 (Dù cho... cũng)', structure: '哪怕 A 也 B', explanation: 'Giả thiết nhượng bộ' }
    ]
  }
];

/**
 * Tự động tạo kịch bản nhập vai từ bất kỳ bài học nào trong 120 bài HSK 1–6
 * 
 * @param {string|Object} lessonIdOrObj - ID bài học ('l-101'...) hoặc đối tượng bài học
 * @returns {Object} Kịch bản nhập vai hoàn chỉnh
 */
export function buildScenarioForLesson(lessonIdOrObj) {
  let lesson = null;
  if (typeof lessonIdOrObj === 'string') {
    lesson = getCurriculumLessonById(lessonIdOrObj) || CURRICULUM_ALL_LESSONS.find(l => l.id === lessonIdOrObj);
  } else if (lessonIdOrObj && typeof lessonIdOrObj === 'object') {
    lesson = lessonIdOrObj;
  }

  if (!lesson) {
    // Trả về kịch bản mặc định nếu không tìm thấy bài
    return SPECIAL_ROLEPLAY_SCENARIOS[0];
  }

  // 1. Trích xuất từ vựng mục tiêu
  const vocabRaw = lesson.step2_vocabulary || lesson.step2_vocab?.words || [];
  const targetVocab = vocabRaw.map(v => ({
    hanzi: v.hanzi,
    pinyin: v.pinyin,
    meaning: v.meaning,
    hanviet: v.hanviet || ''
  })).slice(0, 8);

  // 2. Trích xuất ngữ pháp mục tiêu
  const grammarRaw = lesson.step4_grammar?.rules || lesson.step4_grammar?.points || [];
  const targetGrammar = grammarRaw.map(g => ({
    title: g.title || g.structure || 'Điểm ngữ pháp',
    structure: g.structure || g.formula || '',
    explanation: g.explanation || g.desc || ''
  })).slice(0, 3);

  // 3. Xây dựng Persona AI & Người học dựa trên tiêu đề bài học
  const title = lesson.title || 'Giao tiếp tiếng Trung';
  const chineseTitle = lesson.chineseTitle || '中文交流';
  const hskLevel = lesson.tags?.find(t => t.startsWith('HSK')) || 'HSK 1';

  const firstVocab = targetVocab[0]?.hanzi || '你好';
  const initialGreetingHanzi = `你好！今天我们来练习"${chineseTitle}"。请问你想聊些什么？`;
  const initialGreetingPinyin = 'Nǐ hǎo! Jīntiān wǒmen lái liànxí. Qǐngwèn nǐ xiǎng liáo xiē shénme?';
  const initialGreetingVi = `Xin chào! Hôm nay chúng ta sẽ cùng thực hành bài "${title}". Bạn muốn trò chuyện về điều gì?`;

  return {
    id: `roleplay-${lesson.id}`,
    lessonId: lesson.id,
    title: `Nhập vai Bài ${lesson.lessonNumber || ''}: ${title}`,
    chineseTitle,
    hskLevel,
    category: `Giáo trình HSK Chuẩn - Bài ${lesson.lessonNumber || ''}`,
    avatar: '🎓',
    aiPersona: {
      name: `Bạn học AI Đồng hành (${hskLevel})`,
      role: `Bạn học người bản xứ kiên nhẫn, cùng luyện tập chủ đề "${title}"`,
      tone: 'Gần gũi, khích lệ, dùng từ vựng đúng trình độ'
    },
    userPersona: 'Học viên luyện tập áp dụng kiến thức bài học vào thực tế',
    initialAiGreeting: {
      hanzi: initialGreetingHanzi,
      pinyin: initialGreetingPinyin,
      vi: initialGreetingVi
    },
    missionObjectives: [
      { id: 1, text: `Chào hỏi và mở đầu cuộc đối thoại liên quan đến ${title}`, completed: false },
      { id: 2, text: `Vận dụng ít nhất 2 từ vựng mục tiêu (như: ${firstVocab}) trong lượt nói`, completed: false },
      { id: 3, text: 'Duy trì cuộc đối thoại tối thiểu 3 lượt nói và kết thúc tự nhiên', completed: false }
    ],
    targetVocab,
    targetGrammar
  };
}

/**
 * Lấy toàn bộ danh sách kịch bản sẵn có (Gồm 6 kịch bản thực tế đặc biệt + kịch bản các bài học)
 */
export function getAllRoleplayScenarios() {
  return SPECIAL_ROLEPLAY_SCENARIOS;
}

/**
 * Tìm kịch bản theo ID (hỗ trợ cả kịch bản đặc biệt và kịch bản theo bài học roleplay-l-*)
 */
export function getRoleplayScenarioById(scenarioId) {
  if (!scenarioId) return SPECIAL_ROLEPLAY_SCENARIOS[0];
  const special = SPECIAL_ROLEPLAY_SCENARIOS.find(s => s.id === scenarioId);
  if (special) return special;

  if (scenarioId.startsWith('roleplay-l-') || scenarioId.startsWith('l-')) {
    const lessonId = scenarioId.replace('roleplay-', '');
    return buildScenarioForLesson(lessonId);
  }

  return SPECIAL_ROLEPLAY_SCENARIOS[0];
}

/**
 * Kiểm tra xem người học đã sử dụng từ vựng nào trong danh sách mục tiêu
 * 
 * @param {string} userText - Câu người học nói/gõ
 * @param {Array} targetVocabList - Danh sách từ vựng mục tiêu
 * @returns {Array<string>} Danh sách chữ Hán đã được sử dụng
 */
export function detectUsedTargetVocab(userText = '', targetVocabList = []) {
  if (!userText || typeof userText !== 'string' || !Array.isArray(targetVocabList)) {
    return [];
  }
  const clean = userText.trim().toLowerCase();
  const matched = [];

  for (const item of targetVocabList) {
    if (!item || !item.hanzi) continue;
    if (clean.includes(item.hanzi.toLowerCase())) {
      matched.push(item.hanzi);
    }
  }

  return matched;
}
