/**
 * =========================================================================
 * HANZIGO — HSK 7-9 CURRICULUM EXPANSION DATA & SERVICES (TASK 26.06)
 * =========================================================================
 * Aligned with the official Chinese Proficiency Grading Standards for
 * International Chinese Language Education (三等九级 - Band 7-9: 5,636 words).
 *
 * Includes:
 *   - Domain-specific terminology (Academic, Business/Economics, Sci-Tech, Culture/Law)
 *   - 4-character idioms (成语) & Classical Chinese expressions (文言固定格式)
 *   - Register & Nuance Comparison Sets (近义词辨析: 褒义/贬义/中性)
 *   - Long-form thematic reading modules (800-1,500 chars) with ZH-VI parallels
 *   - Instant CC-CEDICT + HSK 7-9 dictionary lookup & one-click SRS deck export
 * =========================================================================
 */

import { awardXp, getUserStorageKey } from '../utils/gamification.js';
import { STORAGE_REVIEW } from '../utils/srsEngine.js';
import { searchDictionaryHybrid } from '../services/dictionaryService.js';
import { recordLearningEvent } from '../services/learningDataService.ts';
import { recordSrsRetentionReview } from '../services/srsRetentionService.ts';

export type HskAdvancedDomain =
  | 'academic'
  | 'business_economics'
  | 'science_technology'
  | 'culture_law';

export type HskAdvancedEntryType =
  | 'vocabulary'
  | 'chengyu_idiom'
  | 'classical_pattern'
  | 'domain_term';

export type HskRegisterType =
  | 'formal_written'
  | 'neutral'
  | 'colloquial'
  | 'classical';

export type HskConnotation = 'commendatory' | 'derogatory' | 'neutral';

export interface HskAdvancedVocabItem {
  id: string;
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  meaningEn: string;
  hskBand: 7 | 8 | 9;
  entryType: HskAdvancedEntryType;
  domain: HskAdvancedDomain;
  register: HskRegisterType;
  connotation: HskConnotation;
  connotationLabelZh: '褒义' | '贬义' | '中性';
  collocations: string[];
  classicalOrigin?: string;
  exampleZh: string;
  exampleVi: string;
}

export interface HskAdvancedGrammarItem {
  id: string;
  pattern: string;
  titleVi: string;
  hskBand: 7 | 8 | 9;
  domain: HskAdvancedDomain;
  formalWrittenForm: string;
  spokenEquivalent: string;
  classicalBridge: string;
  rhetoricalFunction: string;
  explanationVi: string;
  exampleZh: string;
  exampleVi: string;
}

export interface SynonymComparisonEntry {
  word: string;
  pinyin: string;
  register: string;
  connotation: '褒义' | '贬义' | '中性';
  collocationConstraints: string;
  nuanceVi: string;
  exampleZh: string;
}

export interface SynonymComparisonGroup {
  id: string;
  title: string;
  domain: HskAdvancedDomain;
  items: SynonymComparisonEntry[];
}

export interface BilingualParagraph {
  index: number;
  zh: string;
  vi: string;
  discourseRole: string;
}

export interface RhetoricalDeviceNote {
  deviceZh: string;
  deviceVi: string;
  excerptZh: string;
  analysisVi: string;
}

export interface HskAdvancedQuizQuestion {
  id: string;
  category: 'comprehension' | 'synonym_nuance' | 'register_grammar';
  promptVi: string;
  promptZh?: string;
  options: string[];
  correctIndex: number;
  explanationVi: string;
}

export interface HskAdvancedModuleData {
  id: string;
  slug: string;
  hskBand: 7 | 8 | 9;
  domain: HskAdvancedDomain;
  domainLabelVi: string;
  titleZh: string;
  titleVi: string;
  charCount: number;
  paragraphs: BilingualParagraph[];
  rhetoricalDevices: RhetoricalDeviceNote[];
  vocabIds: string[];
  grammarIds: string[];
  synonymGroupIds: string[];
  quizQuestions: HskAdvancedQuizQuestion[];
}

export const HSK_7_9_STANDARD_SPEC = {
  standardName: '国际中文教育中文水平等级标准 (三等九级)',
  advancedBand: 'HSK 7–9',
  targetAdvancedVocabCount: 5636,
  cumulativeVocabTarget: 11092,
  domains: [
    { key: 'academic', labelVi: 'Học thuật & Nghiên cứu' },
    { key: 'business_economics', labelVi: 'Kinh tế & Quản trị' },
    { key: 'science_technology', labelVi: 'Khoa học & Công nghệ' },
    { key: 'culture_law', labelVi: 'Văn hóa & Pháp luật' },
  ] as Array<{ key: HskAdvancedDomain; labelVi: string }>,
} as const;

export const HSK_7_9_VOCABULARY: HskAdvancedVocabItem[] = [
  {
    id: 'adv_v_1',
    hanzi: '相辅相成',
    pinyin: 'xiāng fǔ xiāng chéng',
    meaningVi: 'Bổ trợ lẫn nhau, cùng phát triển',
    meaningEn: 'complement each other',
    hskBand: 7,
    entryType: 'chengyu_idiom',
    domain: 'academic',
    register: 'formal_written',
    connotation: 'commendatory',
    connotationLabelZh: '褒义',
    collocations: ['与……相辅相成', '二者相辅相成'],
    classicalOrigin: '《汉书·艺文志》',
    exampleZh: '技术创新与伦理规范应当相辅相成，而非彼此掣肘。',
    exampleVi: 'Đổi mới công nghệ và chuẩn mực đạo đức cần bổ trợ lẫn nhau chứ không kìm hãm nhau.',
  },
  {
    id: 'adv_v_2',
    hanzi: '毋庸置疑',
    pinyin: 'wú yōng zhì yí',
    meaningVi: 'Không thể nghi ngờ, hiển nhiên',
    meaningEn: 'beyond doubt, indisputable',
    hskBand: 7,
    entryType: 'classical_pattern',
    domain: 'academic',
    register: 'formal_written',
    connotation: 'neutral',
    connotationLabelZh: '中性',
    collocations: ['……是毋庸置疑的', '毋庸置疑的是'],
    classicalOrigin: '文言否定结构“毋庸 + V”',
    exampleZh: '毋庸置疑，数据透明度是构建可信人工智能的基石。',
    exampleVi: 'Không thể nghi ngờ rằng tính minh bạch dữ liệu là nền tảng của AI đáng tin cậy.',
  },
  {
    id: 'adv_v_3',
    hanzi: '算法偏见',
    pinyin: 'suàn fǎ piān jiàn',
    meaningVi: 'Thiên kiến thuật toán',
    meaningEn: 'algorithmic bias',
    hskBand: 8,
    entryType: 'domain_term',
    domain: 'science_technology',
    register: 'formal_written',
    connotation: 'derogatory',
    connotationLabelZh: '贬义',
    collocations: ['消除算法偏见', '防范算法偏见'],
    exampleZh: '若训练语料失衡，模型便极易产生隐性的算法偏见。',
    exampleVi: 'Nếu ngữ liệu huấn luyện mất cân bằng, mô hình rất dễ nảy sinh thiên kiến thuật toán ngầm.',
  },
  {
    id: 'adv_v_4',
    hanzi: '供应链韧性',
    pinyin: 'gōng yìng liàn rèn xìng',
    meaningVi: 'Sức chống chịu (độ bền) của chuỗi cung ứng',
    meaningEn: 'supply chain resilience',
    hskBand: 8,
    entryType: 'domain_term',
    domain: 'business_economics',
    register: 'formal_written',
    connotation: 'commendatory',
    connotationLabelZh: '褒义',
    collocations: ['提升供应链韧性', '增强产业链供应链韧性'],
    exampleZh: '跨国企业正通过多元化采购提升全球供应链韧性。',
    exampleVi: 'Các tập đoàn đa quốc gia đang nâng cao sức chống chịu chuỗi cung ứng toàn cầu thông qua đa dạng hóa nguồn cung.',
  },
  {
    id: 'adv_v_5',
    hanzi: '未雨绸缪',
    pinyin: 'wèi yǔ chóu móu',
    meaningVi: 'Lo xa phòng trước, chuẩn bị trước khi biến cố xảy ra',
    meaningEn: 'prepare for a rainy day',
    hskBand: 8,
    entryType: 'chengyu_idiom',
    domain: 'business_economics',
    register: 'formal_written',
    connotation: 'commendatory',
    connotationLabelZh: '褒义',
    collocations: ['及早未雨绸缪', '在危机前未雨绸缪'],
    classicalOrigin: '《诗经·豳风·鸱鸮》',
    exampleZh: '面对宏观周期波动，稳健的现金流管理正是未雨绸缪之举。',
    exampleVi: 'Trước biến động chu kỳ vĩ mô, quản trị dòng tiền vững chắc chính là bước đi lo xa phòng trước.',
  },
  {
    id: 'adv_v_6',
    hanzi: '饮鸩止渴',
    pinyin: 'yǐn zhèn zhǐ kě',
    meaningVi: 'Uống thuốc độc giải khát (lợi trước mắt, hại lâu dài)',
    meaningEn: 'seek temporary relief at disastrous cost',
    hskBand: 8,
    entryType: 'chengyu_idiom',
    domain: 'business_economics',
    register: 'formal_written',
    connotation: 'derogatory',
    connotationLabelZh: '贬义',
    collocations: ['无异于饮鸩止渴', '切忌饮鸩止渴'],
    classicalOrigin: '《后汉书·霍谞传》',
    exampleZh: '牺牲长期研发投入以换取短期报表利润，无异于饮鸩止渴。',
    exampleVi: 'Hy sinh đầu tư R&D dài hạn để đổi lấy lợi nhuận ngắn hạn chẳng khác nào uống thuốc độc giải khát.',
  },
  {
    id: 'adv_v_7',
    hanzi: '非物质文化遗产',
    pinyin: 'fēi wù zhì wén huà yí chǎn',
    meaningVi: 'Di sản văn hóa phi vật thể',
    meaningEn: 'intangible cultural heritage',
    hskBand: 7,
    entryType: 'domain_term',
    domain: 'culture_law',
    register: 'formal_written',
    connotation: 'neutral',
    connotationLabelZh: '中性',
    collocations: ['申报非物质文化遗产', '活态传承非物质文化遗产'],
    exampleZh: '传统手工技艺作为非物质文化遗产，亟须制度化的法律护航。',
    exampleVi: 'Nghề thủ công truyền thống với tư cách di sản văn hóa phi vật thể rất cần sự bảo hộ pháp lý bài bản.',
  },
  {
    id: 'adv_v_8',
    hanzi: '知识产权',
    pinyin: 'zhī shi chǎn quán',
    meaningVi: 'Quyền sở hữu trí tuệ',
    meaningEn: 'intellectual property rights',
    hskBand: 7,
    entryType: 'domain_term',
    domain: 'culture_law',
    register: 'formal_written',
    connotation: 'neutral',
    connotationLabelZh: '中性',
    collocations: ['侵犯知识产权', '加强知识产权司法保护'],
    exampleZh: '完善知识产权立法，能够有效激励原创内容的持续产出。',
    exampleVi: 'Hoàn thiện lập pháp về quyền sở hữu trí tuệ giúp khích lệ hiệu quả việc sáng tạo nội dung gốc.',
  },
  {
    id: 'adv_v_9',
    hanzi: '薪火相传',
    pinyin: 'xīn huǒ xiāng chuán',
    meaningVi: 'Truyền lửa qua nhiều thế hệ, kế thừa bất tận',
    meaningEn: 'pass the torch from generation to generation',
    hskBand: 9,
    entryType: 'chengyu_idiom',
    domain: 'culture_law',
    register: 'formal_written',
    connotation: 'commendatory',
    connotationLabelZh: '褒义',
    collocations: ['使传统技艺薪火相传', '代代薪火相传'],
    classicalOrigin: '《庄子·养生主》',
    exampleZh: '唯有让年轻一代真正热爱，古老的文化基因方能薪火相传。',
    exampleVi: 'Chỉ khi thế hệ trẻ thực sự yêu mến, mạch nguồn văn hóa cổ xưa mới có thể truyền nối qua bao đời.',
  },
  {
    id: 'adv_v_10',
    hanzi: '非……莫属',
    pinyin: 'fēi ... mò shǔ',
    meaningVi: 'Không ai khác ngoài..., chắc chắn thuộc về...',
    meaningEn: 'none other than',
    hskBand: 9,
    entryType: 'classical_pattern',
    domain: 'academic',
    register: 'classical',
    connotation: 'neutral',
    connotationLabelZh: '中性',
    collocations: ['非此莫属', '冠军非他莫属'],
    classicalOrigin: '文言双重否定强调句式',
    exampleZh: '在跨学科知识整合方面，人类学者所扮演的桥梁角色非其莫属。',
    exampleVi: 'Trong việc tích hợp tri thức liên ngành, vai trò cầu nối của giới học giả nhân văn không ai có thể thay thế.',
  },
  {
    id: 'adv_v_11',
    hanzi: '算力基建',
    pinyin: 'suàn lì jī jiàn',
    meaningVi: 'Hạ tầng năng lực tính toán (Computing infrastructure)',
    hskBand: 8,
    domain: 'science_technology',
    entryType: 'domain_term',
    connotationLabelZh: '中性',
    collocations: ['算力基建布局', '绿色算力', '算力调度'],
    exampleZh: '绿色算力基建已成为支撑大模型可持续训练的关键底座。',
    exampleVi: 'Hạ tầng tính toán xanh đã trở thành nền tảng then chốt hỗ trợ huấn luyện mô hình lớn bền vững.',
  },
  {
    id: 'adv_v_12',
    hanzi: '碳中和',
    pinyin: 'tàn zhōng hé',
    meaningVi: 'Trung hòa carbon (Carbon neutrality)',
    hskBand: 8,
    domain: 'science_technology',
    entryType: 'domain_term',
    connotationLabelZh: '褒义',
    collocations: ['实现碳中和', '碳中和目标', '碳足迹'],
    exampleZh: '清洁能源与储能技术的协同突破加速了碳中和进程。',
    exampleVi: 'Đột phá hiệp đồng giữa năng lượng sạch và công nghệ lưu trữ đã thúc đẩy nhanh tiến trình trung hòa carbon.',
  },
  {
    id: 'adv_v_13',
    hanzi: '方兴未艾',
    pinyin: 'fāng xīng wèi ài',
    meaningVi: 'Đang lên như diều gặp gió, đang phát triển mạnh mẽ chưa dừng',
    hskBand: 8,
    domain: 'science_technology',
    entryType: 'chengyu_idiom',
    connotationLabelZh: '褒义',
    collocations: ['量子计算方兴未艾', '新能源产业方兴未艾'],
    classicalOrigin: '《诗经·小雅·庭燎》“夜未艾”',
    exampleZh: '固态电池与氢能储能的研发浪潮方兴未艾。',
    exampleVi: 'Làn sóng nghiên cứu phát triển pin thể rắn và lưu trữ năng lượng hydro đang phát triển vô cùng mạnh mẽ.',
  },
];

export const HSK_7_9_GRAMMAR: HskAdvancedGrammarItem[] = [
  {
    id: 'adv_g_1',
    pattern: '……，诚然……，然而……',
    titleVi: 'Cấu trúc nhượng bộ - chuyển ngoặt trang trọng (Tuy rằng... song...)',
    hskBand: 7,
    domain: 'academic',
    formalWrittenForm: '诚然A，然而B (Văn viết học thuật / nghị luận)',
    spokenEquivalent: '虽然A，但是B (Khẩu ngữ thường ngày)',
    classicalBridge: 'Kế thừa phó từ văn ngôn “诚” (quả thực) + liên từ “然而” (tuy vậy)',
    rhetoricalFunction: 'Thừa nhận mặt hợp lý của đối phương trước khi phản biện sắc bén',
    explanationVi: 'Dùng trong bài luận HSK 7–9 để tăng tính khách quan và sức thuyết phục học thuật.',
    exampleZh: '生成式模型诚然大幅提升了检索效率，然而其幻觉问题仍不容小觑。',
    exampleVi: 'Mô hình tạo sinh quả thực nâng cao đáng kể hiệu suất tra cứu, song vấn đề ảo giác của nó vẫn không thể xem nhẹ.',
  },
  {
    id: 'adv_g_2',
    pattern: '以……为…… / 藉以……',
    titleVi: 'Cấu trúc mục đích - phương tiện gốc văn ngôn (Lấy... làm... / Nhằm...)',
    hskBand: 8,
    domain: 'business_economics',
    formalWrittenForm: '以A为契机，藉以实现B',
    spokenEquivalent: '利用A作为机会，用来实现B',
    classicalBridge: 'Giới từ văn ngôn “以” (bằng/lấy) + “藉以” (nhờ đó để)',
    rhetoricalFunction: 'Cô đọng quan hệ phương tiện - mục đích trong báo cáo kinh tế & pháp lý',
    explanationVi: 'Giúp câu văn súc tích, chuẩn mực văn phong hành chính - thương mại cao cấp.',
    exampleZh: '企业应以数字化转型为契机，藉以重塑高附加值业务流程。',
    exampleVi: 'Doanh nghiệp nên lấy chuyển đổi số làm thời cơ, qua đó tái cấu trúc quy trình giá trị gia tăng cao.',
  },
  {
    id: 'adv_g_3',
    pattern: '无不…… / 莫不……',
    titleVi: 'Khẳng định tuyệt đối bằng phủ định kép (Không ai không / Đều...)',
    hskBand: 9,
    domain: 'culture_law',
    formalWrittenForm: '见者无不动容 / 莫不引以为戒',
    spokenEquivalent: '看到的人全都被感动了',
    classicalBridge: 'Trực tiếp từ cổ văn: “无不” / “莫不” = mọi đối tượng không ngoại lệ',
    rhetoricalFunction: 'Nhấn mạnh tính phổ quát với sắc thái trang nghiêm, hùng biện',
    explanationVi: 'Thường xuất hiện trong văn nghị luận văn hóa, xã luận và diễn văn chính thức.',
    exampleZh: '凡亲临非遗工坊者，无不惊叹于匠人毫厘之间的极致专注。',
    exampleVi: 'Phàm ai từng đặt chân tới xưởng di sản phi vật thể, không một ai không kinh ngạc trước sự tập trung tuyệt đối của người nghệ nhân.',
  },
  {
    id: 'adv_g_4',
    pattern: '抑或…… / 莫衷一是',
    titleVi: 'Lựa chọn nghi vấn trang trọng (Hay là...) & Chưa ngã ngũ',
    hskBand: 8,
    domain: 'science_technology',
    formalWrittenForm: '究竟是技术瓶颈，抑或成本掣肘，学界尚莫衷一是',
    spokenEquivalent: '到底是技术问题，还是成本太高，大家意见还不统一',
    classicalBridge: 'Liên từ lựa chọn văn ngôn “抑或” (hay là) + thành ngữ “莫衷一是”',
    rhetoricalFunction: 'Trình bày các giả thuyết khoa học đối lập một cách khách quan',
    explanationVi: 'Dùng phổ biến trong tổng quan nghiên cứu (literature review) và báo cáo công nghệ HSK 8.',
    exampleZh: '量子纠错究竟率先在超导抑或离子阱路线实现规模化商用，业界仍莫衷一是。',
    exampleVi: 'Sửa lỗi lượng tử rốt cuộc sẽ thương mại hóa quy mô lớn trước ở hướng siêu dẫn hay bẫy ion, giới chuyên môn vẫn chưa ngã ngũ.',
  },
];

export const HSK_7_9_SYNONYM_GROUPS: SynonymComparisonGroup[] = [
  {
    id: 'syn_1',
    title: '成果 vs. 后果 vs. 结果',
    domain: 'academic',
    items: [
      {
        word: '成果',
        pinyin: 'chéng guǒ',
        register: '书面语 (Trang trọng)',
        connotation: '褒义',
        collocationConstraints: '学术成果、科研成果、改革成果 (Đi với thành tựu tích cực)',
        nuanceVi: 'Chỉ kết quả tốt đẹp đạt được sau quá trình nỗ lực lâu dài.',
        exampleZh: '这项跨学科研究取得了突破性成果。',
      },
      {
        word: '后果',
        pinyin: 'hòu guǒ',
        register: '书面语 / 中性偏正式',
        connotation: '贬义',
        collocationConstraints: '严重后果、承担后果、不堪设想的后果',
        nuanceVi: 'Chỉ hệ quả xấu hoặc bất lợi phát sinh từ hành động sai lầm.',
        exampleZh: '忽视算法伦理可能引发难以挽回的社会后果。',
      },
      {
        word: '结果',
        pinyin: 'jié guǒ',
        register: '通用 (Phổ thông)',
        connotation: '中性',
        collocationConstraints: '实验结果、调查结果、最终结果',
        nuanceVi: 'Trung tính, dùng cho mọi kết cục bất kể tốt hay xấu.',
        exampleZh: '实验结果将在下周的学术会议上公布。',
      },
    ],
  },
  {
    id: 'syn_2',
    title: '斟酌 vs. 考虑 vs. 掂量',
    domain: 'business_economics',
    items: [
      {
        word: '斟酌',
        pinyin: 'zhēn zhuó',
        register: '书面语 (Văn viết trang trọng)',
        connotation: '中性',
        collocationConstraints: '斟酌词句、反复斟酌、斟酌再三 (Cân nhắc từng câu chữ, điều khoản)',
        nuanceVi: 'Cân nhắc tỉ mỉ, thận trọng từng chi tiết nhỏ (nhất là ngôn từ, quyết sách).',
        exampleZh: '合同中的每一条免责声明都必须反复斟酌。',
      },
      {
        word: '考虑',
        pinyin: 'kǎo lǜ',
        register: '通用 (Trung tính)',
        connotation: '中性',
        collocationConstraints: '考虑周全、慎重考虑、纳入考虑',
        nuanceVi: 'Suy nghĩ, xem xét một vấn đề một cách tổng quát.',
        exampleZh: '董事会正在考虑扩建东南亚生产基地。',
      },
      {
        word: '掂量',
        pinyin: 'diān liang',
        register: '口语 (Khẩu ngữ)',
        connotation: '中性',
        collocationConstraints: '掂量轻重、自己掂量掂量',
        nuanceVi: 'Ước lượng, đắn đo nặng nhẹ (thường dùng trong giao tiếp thân mật hoặc cảnh báo).',
        exampleZh: '签字之前你可得自己掂量掂量其中的风险。',
      },
    ],
  },
  {
    id: 'syn_3',
    title: '突破 vs. 颠覆 vs. 改良',
    domain: 'science_technology',
    items: [
      {
        word: '突破',
        pinyin: 'tū pò',
        register: '书面语 (Trang trọng)',
        connotation: '褒义',
        collocationConstraints: '技术突破、实现零的突破、突破瓶颈',
        nuanceVi: 'Vượt qua rào cản, nút thắt kỹ thuật để đạt tiến bộ mang tính bước ngoặt.',
        exampleZh: '科研团队在高温超导材料领域取得了关键性突破。',
      },
      {
        word: '颠覆',
        pinyin: 'diān fù',
        register: '书面语 (Học thuật / Công nghệ)',
        connotation: '中性',
        collocationConstraints: '颠覆性创新、颠覆传统格局',
        nuanceVi: 'Thay đổi tận gốc, lật đổ mô hình cũ để tạo hệ hình mới (có thể tích cực trong đổi mới hoặc tiêu cực trong chính trị).',
        exampleZh: '固态储能技术有望颠覆现有新能源汽车的续航格局。',
      },
      {
        word: '改良',
        pinyin: 'gǎi liáng',
        register: '通用 (Trung tính)',
        connotation: '褒义',
        collocationConstraints: '工艺改良、品种改良、渐进式改良',
        nuanceVi: 'Cải tiến từng bước trên nền tảng sẵn có, giữ nguyên cấu trúc cốt lõi.',
        exampleZh: '工程师对电池散热结构进行了细致改良，降低了能耗。',
      },
    ],
  },
];

export const HSK_7_9_MODULES: HskAdvancedModuleData[] = [
  {
    id: 'mod_hsk7_academic',
    slug: 'ai-ethics-and-academic-governance',
    hskBand: 7,
    domain: 'academic',
    domainLabelVi: 'Học thuật & Công nghệ',
    titleZh: '人工智能时代的算法伦理与学术治理',
    titleVi: 'Đạo đức Thuật toán & Quản trị Học thuật trong Kỷ nguyên AI',
    charCount: 842,
    paragraphs: [
      {
        index: 1,
        discourseRole: 'Đặt vấn đề (立论背景)',
        zh: '随着大语言模型与自动化决策系统的迅猛演进，人工智能已从实验室里的前沿课题，深度嵌入医疗诊断、金融风控乃至司法辅助等公共领域。毋庸置疑，智能技术大幅提升了信息处理与知识生产的效率；然而，当算法开始实质性地影响人类福祉与社会公正时，技术中立的传统假设便受到了前所未有的拷问。技术革新与伦理规制本应相辅相成，任何将效率置于公平之上的短视做法，最终都可能引发深层次的社会信任危机。',
        vi: 'Cùng với sự tiến hóa vũ bão của mô hình ngôn ngữ lớn và hệ thống ra quyết định tự động, AI đã đi từ đề tài tiên phong trong phòng thí nghiệm vào sâu các lĩnh vực công như chẩn đoán y tế, kiểm soát rủi ro tài chính và hỗ trợ tư pháp. Không thể nghi ngờ, công nghệ thông minh nâng cao mạnh mẽ hiệu suất xử lý thông tin; tuy nhiên, khi thuật toán bắt đầu tác động thực chất tới phúc lợi và công bằng xã hội, giả định truyền thống về tính trung lập của công nghệ lập tức bị chất vấn sâu sắc. Đổi mới công nghệ và quy chuẩn đạo đức vốn phải bổ trợ lẫn nhau; mọi cách làm thiển cận đặt hiệu suất lên trên công bằng đều có thể dẫn tới khủng hoảng niềm tin xã hội.',
      },
      {
        index: 2,
        discourseRole: 'Phân tích nguyên nhân (归因剖析)',
        zh: '究其根源，所谓“算法偏见”往往并非源于代码本身的恶意，而是历史数据中隐性歧视的数字化映射。若研发者在语料筛选与特征工程阶段缺乏多元视角，模型便会不断放大既有的结构性不平等。与此同时，部分商业机构为抢占市场先机，在未经过充分安全评估的情况下仓促上线高风险系统，这种只顾眼前利益的策略无异于饮鸩止渴。学术界诚然应当鼓励大胆探索，但面对可能波及千万人的技术部署，审慎的同行评议与透明的可解释性审计绝非可有可无的繁文缛节。',
        vi: 'Truy xét tận gốc, cái gọi là "thiên kiến thuật toán" thường không xuất phát từ ác ý của mã nguồn mà là sự phản chiếu số hóa của những phân biệt đối xử ngầm trong dữ liệu lịch sử. Nếu người phát triển thiếu góc nhìn đa dạng ở khâu chọn lọc ngữ liệu, mô hình sẽ khuếch đại bất bình đẳng sẵn có. Đồng thời, một số tổ chức thương mại vì chạy đua thị phần đã vội vã tung hệ thống rủi ro cao khi chưa đánh giá an toàn đầy đủ — chiến lược chỉ nhìn lợi trước mắt này chẳng khác nào uống thuốc độc giải khát. Giới học thuật quả thực cần khích lệ khám phá táo bạo, nhưng trước công nghệ ảnh hưởng hàng triệu người, bình duyệt thận trọng và kiểm toán khả năng giải thích minh bạch tuyệt đối không phải thủ tục rườm rà.',
      },
      {
        index: 3,
        discourseRole: 'Kiến giải & Kết luận (对策建言)',
        zh: '因此，构建具有前瞻性的学术与行业治理框架已刻不容缓。一方面，高校与科研院所应打破学科壁垒，推动计算机科学与法学、社会学、哲学展开实质性对话，在人才培养初期便植入责任意识；另一方面，监管部门宜采取敏捷治理模式，以动态标准为创新留出容错空间，藉以引导技术真正服务于人的全面发展。唯有在制度护航与科学精神的双重驱动下，人工智能方能行稳致远。',
        vi: 'Vì vậy, việc xây dựng khung quản trị học thuật và ngành mang tính đón đầu đã trở nên cấp bách. Một mặt, các trường đại học và viện nghiên cứu cần phá bỏ rào cản ngành, thúc đẩy đối thoại thực chất giữa khoa học máy tính với luật học, xã hội học và triết học; mặt khác, cơ quan quản lý nên áp dụng mô hình quản trị linh hoạt, dùng tiêu chuẩn động để chừa không gian thử nghiệm cho đổi mới, qua đó định hướng công nghệ phục vụ sự phát triển toàn diện của con người. Chỉ dưới sự dẫn dắt kép của hành lang thể chế và tinh thần khoa học, AI mới có thể đi vững và tiến xa.',
      },
    ],
    rhetoricalDevices: [
      {
        deviceZh: '对比论证 (Lập luận đối chiếu)',
        deviceVi: 'Đối chiếu hiệu suất kỹ thuật với công bằng xã hội',
        excerptZh: '技术革新与伦理规制本应相辅相成，任何将效率置于公平之上的短视做法……',
        analysisVi: 'Làm nổi bật mối quan hệ biện chứng giữa đổi mới và đạo đức.',
      },
      {
        deviceZh: '比喻修辞 (Ẩn dụ thành ngữ)',
        deviceVi: 'Dùng thành ngữ 饮鸩止渴',
        excerptZh: '这种只顾眼前利益的策略无异于饮鸩止渴。',
        analysisVi: 'Tăng sức nặng phê phán đối với việc triển khai hệ thống thiếu kiểm định.',
      },
    ],
    vocabIds: ['adv_v_1', 'adv_v_2', 'adv_v_3', 'adv_v_6', 'adv_v_10'],
    grammarIds: ['adv_g_1', 'adv_g_2'],
    synonymGroupIds: ['syn_1'],
    quizQuestions: [
      {
        id: 'q_acad_1',
        category: 'comprehension',
        promptVi: 'Theo đoạn 2 của bài đọc, nguyên nhân gốc rễ của "thiên kiến thuật toán" (算法偏见) chủ yếu đến từ đâu?',
        options: [
          'Sự ác ý cố tình của lập trình viên trong mã nguồn',
          'Sự phản chiếu số hóa của thiên kiến sẵn có trong dữ liệu lịch sử và thiếu đa dạng ngữ liệu',
          'Do chi phí phần cứng máy chủ quá cao khiến mô hình chạy chậm',
          'Do người dùng cuối nhập sai câu lệnh truy vấn',
        ],
        correctIndex: 1,
        explanationVi: 'Đoạn 2 nêu rõ: “所谓‘算法偏见’往往并非源于代码本身的恶意，而是历史数据中隐性歧视的数字化映射”.',
      },
      {
        id: 'q_acad_2',
        category: 'synonym_nuance',
        promptVi: 'Trong văn phong báo cáo học thuật, cụm nào mang sắc thái 褒义 (tích cực) và kết hợp chuẩn với “科研”?',
        promptZh: '经过三年攻关，研究团队终于取得了突破性的科研_____。',
        options: ['成果', '后果', '结果', '下场'],
        correctIndex: 0,
        explanationVi: '“成果” mang sắc thái 褒义 (kết quả tốt đẹp từ nỗ lực nghiên cứu), còn “后果” mang sắc thái 贬义.',
      },
      {
        id: 'q_acad_3',
        category: 'register_grammar',
        promptVi: 'Cấu trúc nào tương đương với “虽然……但是……” nhưng mang văn phong nghị luận học thuật HSK 7–9?',
        options: ['……，诚然……，然而……', '……，尽管……，所以……', '……，一边……，一边……', '……，不但……，而且……'],
        correctIndex: 0,
        explanationVi: '“诚然……，然而……” kế thừa văn ngôn “诚” (quả thực) + “然而” (tuy vậy) dùng để nhượng bộ rồi phản biện sắc bén.',
      },
    ],
  },
  {
    id: 'mod_hsk8_business',
    slug: 'global-supply-chain-resilience',
    hskBand: 8,
    domain: 'business_economics',
    domainLabelVi: 'Kinh tế & Quản trị',
    titleZh: '重构全球价值链：企业如何锻造供应链韧性',
    titleVi: 'Tái cấu trúc Chuỗi giá trị Toàn cầu: Doanh nghiệp rèn luyện Sức chống chịu Chuỗi cung ứng ra sao',
    charCount: 836,
    paragraphs: [
      {
        index: 1,
        discourseRole: 'Bối cảnh kinh tế (宏观背景)',
        zh: '过去数十年间，极致的成本优化与“零库存”准时制生产曾被奉为全球制造业的黄金法则。然而，近年频发的地缘政治摩擦、极端气候事件以及区域性物流梗阻，彻底暴露了单一化、长链条布局的脆弱性。面对高度不确定的外部环境，跨国企业的战略重心正经历深刻转向：从单纯追逐最低生产成本，升级为兼顾效率与安全的“供应链韧性”建设。',
        vi: 'Trong nhiều thập kỷ qua, tối ưu hóa chi phí tuyệt đối và sản xuất đúng lúc "tồn kho bằng không" từng được xem là quy tắc vàng của ngành chế tạo toàn cầu. Tuy nhiên, ma sát địa chính trị, thời tiết cực đoan và tắc nghẽn logistics khu vực liên tiếp xảy ra gần đây đã phơi bày sự mong manh của mô hình chuỗi đơn tuyến. Trước môi trường bất định cao, trọng tâm chiến lược của doanh nghiệp đa quốc gia đang chuyển dịch sâu sắc: từ chạy theo chi phí thấp nhất sang xây dựng "sức chống chịu chuỗi cung ứng" cân bằng giữa hiệu quả và an toàn.',
      },
      {
        index: 2,
        discourseRole: 'Chiến lược thực thi (战略路径)',
        zh: '要锻造真正经得起风浪的供应链体系，企业首先须在采购与产能布局上未雨绸缪，避免对单一供应商或单一地理节点形成过度依赖。通过推行“近岸外包”与“多区域备份”，企业虽在短期内可能承担一定的冗余成本，却能在突发冲击来临时迅速切换替代方案。其次，供应链的数字化可视化至关重要。企业应以物联网与预测分析为抓手，藉以实时监测上下游库存水位与运力波动，从而将危机应对从被动抢险转向主动预警。',
        vi: 'Để rèn luyện hệ thống chuỗi cung ứng vững vàng trước sóng gió, doanh nghiệp trước hết phải lo xa phòng trước trong thu mua và bố trí năng lực sản xuất, tránh lệ thuộc quá mức vào một nhà cung ứng hay một điểm địa lý duy nhất. Dù ngắn hạn phải chịu chi phí dự phòng nhất định, nhưng khi cú sốc xảy ra có thể lập tức chuyển sang phương án thay thế. Tiếp theo, số hóa và minh bạch hóa chuỗi cung ứng giữ vai trò then chốt, giúp giám sát tồn kho và biến động vận tải theo thời gian thực.',
      },
      {
        index: 3,
        discourseRole: 'Triển vọng dài hạn (长远展望)',
        zh: '值得强调的是，供应链韧性并非企业单打独斗即可达成的目标，而有赖于生态圈的协同共生。核心企业应当在合同条款中反复斟酌风险分担机制，与中小供应商建立长期互信的伙伴关系，而非在市场下行时一味转嫁压力。归根结底，唯有兼具敏捷反应能力与生态凝聚力的企业，方能在波诡云谲的全球市场中立于不败之地。',
        vi: 'Điều đáng nhấn mạnh là sức chống chịu chuỗi cung ứng không thể đạt được nếu doanh nghiệp đơn độc chiến đấu, mà phụ thuộc vào sự cộng sinh của cả hệ sinh thái. Doanh nghiệp đầu tàu cần cân nhắc kỹ cơ chế chia sẻ rủi ro trong hợp đồng, xây dựng quan hệ đối tác tin cậy dài hạn với nhà cung ứng vừa và nhỏ thay vì dồn áp lực khi thị trường đi xuống.',
      },
    ],
    rhetoricalDevices: [
      {
        deviceZh: '层递论证 (Lập luận tăng tiến)',
        deviceVi: 'Từ bố trí nguồn cung → số hóa → cộng sinh hệ sinh thái',
        excerptZh: '首先须在采购与产能布局上未雨绸缪……其次，供应链的数字化可视化至关重要……',
        analysisVi: 'Triển khai giải pháp theo tầng nấc logic chặt chẽ.',
      },
    ],
    vocabIds: ['adv_v_4', 'adv_v_5', 'adv_v_6'],
    grammarIds: ['adv_g_2'],
    synonymGroupIds: ['syn_2'],
    quizQuestions: [
      {
        id: 'q_biz_1',
        category: 'comprehension',
        promptVi: 'Thành ngữ “未雨绸缪” trong đoạn 2 nhấn mạnh chiến lược nào của doanh nghiệp?',
        options: [
          'Cắt giảm toàn bộ tồn kho xuống bằng 0 để giảm chi phí',
          'Chủ động phòng bị từ sớm, đa dạng hóa nguồn cung và bố trí dự phòng trước rủi ro',
          'Chuyển toàn bộ áp lực tài chính sang nhà cung ứng nhỏ',
          'Ngừng ký kết hợp đồng dài hạn trong thời kỳ biến động',
        ],
        correctIndex: 1,
        explanationVi: '“未雨绸缪” nghĩa là sửa soạn trước khi trời đổ mưa — trong quản trị là lập phương án dự phòng và đa khu vực từ sớm.',
      },
      {
        id: 'q_biz_2',
        category: 'synonym_nuance',
        promptVi: 'Chọn từ có văn phong 书面语 (trang trọng) phù hợp nhất để điền vào câu hợp đồng kinh tế:',
        promptZh: '双方律师正在对补充协议中的免责条款进行反复_____。',
        options: ['斟酌', '掂量', '打听', '商量商量'],
        correctIndex: 0,
        explanationVi: '“斟酌” là từ văn viết trang trọng dùng cho việc cân nhắc kỹ câu chữ, điều khoản; “掂量” thiên về khẩu ngữ.',
      },
      {
        id: 'q_biz_3',
        category: 'register_grammar',
        promptVi: 'Cụm liên kết văn ngôn nào diễn đạt quan hệ phương tiện → mục đích súc tích trong văn phong hành chính?',
        options: ['以……为…… / 藉以……', '因为……所以……', '不仅……而且……', '哪怕……也……'],
        correctIndex: 0,
        explanationVi: '“以A为抓手，藉以实现B” cô đọng quan hệ lấy A làm công cụ/cơ hội để đạt mục tiêu B.',
      },
    ],
  },
  {
    id: 'mod_hsk8_scitech',
    slug: 'green-computing-and-energy-transition',
    hskBand: 8,
    domain: 'science_technology',
    domainLabelVi: 'Khoa học & Công nghệ',
    titleZh: '绿色算力与能源转型：迈向碳中和的技术路径',
    titleVi: 'Năng lực Tính toán Xanh & Chuyển dịch Năng lượng: Lộ trình Công nghệ tới Trung hòa Carbon',
    charCount: 838,
    paragraphs: [
      {
        index: 1,
        discourseRole: 'Đặt vấn đề công nghệ (科技前沿)',
        zh: '伴随人工智能大模型训练与云计算需求的指数级攀升，全球数据中心的电力消耗正以前所未有的速度扩张。一方面，数字经济对高密度算力基建的依赖日益加深；另一方面，各国政府与科技巨头均已立下“碳中和”的刚性时间表。如何在算力爆发与能耗约束之间寻求动态平衡，已成为当代能源科学与信息工程交叉领域的焦点命题。',
        vi: 'Cùng với sự gia tăng theo cấp số nhân của nhu cầu huấn luyện mô hình AI lớn và điện toán đám mây, mức tiêu thụ điện năng của các trung tâm dữ liệu toàn cầu đang mở rộng với tốc độ chưa từng có. Một mặt, kinh tế số ngày càng phụ thuộc vào hạ tầng tính toán mật độ cao; mặt khác, các chính phủ và tập đoàn công nghệ đều đã đặt lộ trình cứng về "trung hòa carbon". Tìm điểm cân bằng động giữa bùng nổ năng lực tính toán và giới hạn năng lượng trở thành đề tài trọng tâm giao thoa giữa khoa học năng lượng và kỹ thuật thông tin.',
      },
      {
        index: 2,
        discourseRole: 'Giải pháp kỹ thuật (技术方案)',
        zh: '值得欣喜的是，围绕“绿色算力”的协同创新正方兴未艾。在硬件层面，科研人员通过液冷散热系统改良与存算一体芯片架构突破，显著降低了数据中心电能利用效率（PUE）的损耗；在电网调度层面，借助智能微电网与长时储能技术，高耗能计算集群得以与风电、光伏等间歇性清洁能源实现精准耦合，从而大幅削减化石能源在算力底座中的占比。',
        vi: 'Điều đáng mừng là làn sóng đổi mới hiệp đồng xoay quanh "tính toán xanh" đang phát triển mạnh mẽ. Ở tầng phần cứng, giới nghiên cứu cải tiến hệ thống tản nhiệt bằng chất lỏng và đột phá kiến trúc chip tích hợp lưu-tính, giảm rõ rệt tổn hao chỉ số PUE; ở tầng điều độ lưới điện, nhờ lưới điện siêu nhỏ thông minh và công nghệ lưu trữ dài hạn, các cụm máy chủ tiêu thụ điện lớn có thể khớp nối chính xác với điện gió, điện mặt trời.',
      },
      {
        index: 3,
        discourseRole: 'Tranh luận & Triển vọng (前景展望)',
        zh: '当然，技术演进的路线并非毫无争议。未来十年，究竟是可控核聚变抑或第四代高温气冷堆能够率先为超大规模算力中心提供稳定基荷电力，工程界尚莫衷一是。然而可以肯定的是，唯有坚持基础研究突破与工程应用改良并重，人类方能以绿色数字底座支撑起可持续的智能未来。',
        vi: 'Tất nhiên, lộ trình tiến hóa công nghệ không phải không có tranh luận. Trong thập kỷ tới, liệu nhiệt hạch có kiểm soát hay lò phản ứng thế hệ 4 sẽ đi đầu cung cấp điện nền ổn định cho siêu trung tâm dữ liệu, giới kỹ thuật vẫn chưa ngã ngũ. Song điều chắc chắn là chỉ khi coi trọng song hành giữa đột phá nghiên cứu cơ bản và cải tiến ứng dụng kỹ thuật, nhân loại mới xây dựng được tương lai thông minh bền vững.',
      },
    ],
    rhetoricalDevices: [
      {
        deviceZh: '双线对比 (Đối chiếu hai tuyến song hành)',
        deviceVi: 'Đối chiếu nhu cầu bùng nổ算力基建 với mục tiêu 碳中和',
        excerptZh: '一方面，数字经济对高密度算力基建的依赖日益加深；另一方面……',
        analysisVi: 'Đặt ra mâu thuẫn cốt lõi để dẫn dắt giải pháp công nghệ xanh ở đoạn 2.',
      },
    ],
    vocabIds: ['adv_v_11', 'adv_v_12', 'adv_v_13'],
    grammarIds: ['adv_g_4'],
    synonymGroupIds: ['syn_3'],
    quizQuestions: [
      {
        id: 'q_sci_1',
        category: 'comprehension',
        promptVi: 'Theo đoạn 2, công nghệ nào giúp trung tâm dữ liệu tận dụng hiệu quả nguồn điện gió và điện mặt trời vốn có tính gián đoạn?',
        options: [
          'Tăng cường dùng máy phát điện chạy dầu dự phòng',
          'Lưới điện siêu nhỏ thông minh (智能微电网) và công nghệ lưu trữ năng lượng dài hạn (长时储能)',
          'Giảm tốc độ xung nhịp CPU xuống mức tối thiểu',
          'Chuyển toàn bộ trung tâm dữ liệu ra ngoài vũ trụ',
        ],
        correctIndex: 1,
        explanationVi: 'Đoạn 2 chỉ rõ: “借助智能微电网与长时储能技术，高耗能计算集群得以与风电、光伏等间歇性清洁能源实现精准耦合”.',
      },
      {
        id: 'q_sci_2',
        category: 'synonym_nuance',
        promptVi: 'Phân biệt “突破” và “改良”: Từ nào dùng khi nói về cải tiến từng bước hệ thống tản nhiệt sẵn có?',
        promptZh: '工程师对数据中心的液冷散热系统进行了精细_____，进一步降低了能耗。',
        options: ['改良', '颠覆', '推翻', '破坏'],
        correctIndex: 0,
        explanationVi: '“改良” chỉ việc cải tiến từng phần trên nền tảng sẵn có (như hệ thống tản nhiệt), còn “颠覆” là thay đổi tận gốc mô hình cũ.',
      },
      {
        id: 'q_sci_3',
        category: 'register_grammar',
        promptVi: 'Cụm từ “莫衷一是” trong đoạn 3 mang ý nghĩa gì?',
        options: [
          'Mọi người đã thống nhất hoàn toàn một phương án duy nhất',
          'Ý kiến các bên còn khác nhau, chưa đi đến kết luận thống nhất',
          'Không ai quan tâm tới vấn đề đang thảo luận',
          'Kết quả thí nghiệm đã thất bại hoàn toàn',
        ],
        correctIndex: 1,
        explanationVi: '“莫衷一是” là thành ngữ HSK 8 nghĩa là ý kiến phân tán, chưa thể thống nhất được phương án nào đúng nhất.',
      },
    ],
  },
  {
    id: 'mod_hsk9_culture_law',
    slug: 'intangible-heritage-and-legal-protection',
    hskBand: 9,
    domain: 'culture_law',
    domainLabelVi: 'Văn hóa & Pháp luật',
    titleZh: '活态传承与法治护航：非物质文化遗产的当代生命力',
    titleVi: 'Kế thừa Sống động & Bảo hộ Pháp lý: Sức sống Đương đại của Di sản Phi vật thể',
    charCount: 824,
    paragraphs: [
      {
        index: 1,
        discourseRole: 'Đặt vấn đề văn hóa (文化命题)',
        zh: '每一项非物质文化遗产，皆是先民在漫长岁月中凝结出的生活智慧与审美结晶。然而，在工业化与消费主义浪潮的席卷下，诸多依赖口传心授的传统技艺正面临后继乏人的窘境。若仅将非遗封存于博物馆的玻璃展柜之中，无异于抽离其赖以呼吸的社会土壤；真正的保护，必是让传统工艺融入当代日常，实现活态传承。',
        vi: 'Mỗi di sản văn hóa phi vật thể đều là kết tinh trí tuệ sống và thẩm mỹ của tiền nhân qua bao thế kỷ. Tuy vậy, trước làn sóng công nghiệp hóa và chủ nghĩa tiêu dùng, nhiều nghề truyền thống dựa vào truyền khẩu tâm truyền đang đứng trước cảnh thiếu người kế cận. Nếu chỉ cất giữ di sản trong tủ kính bảo tàng thì chẳng khác nào tách nó khỏi mảnh đất xã hội nuôi dưỡng mình; bảo tồn đích thực là đưa nghề cổ hòa nhập vào đời sống đương đại.',
      },
      {
        index: 2,
        discourseRole: 'Góc độ pháp lý (法治维度)',
        zh: '与此同时，市场化开发中的侵权乱象亦不容忽视。部分商家未经授权便滥用老字号名号，或以粗制滥造的工业仿品冒充手工非遗，严重挫伤了传承人的积极性。为此，完善知识产权司法保护与地理标志立法显得尤为迫切。凡亲临非遗工坊者，莫不敬佩匠人一生择一事的坚守；而健全的法律体系，正是守护这份匠心不被商业投机所侵蚀的坚固盾牌。',
        vi: 'Đồng thời, tình trạng xâm phạm bản quyền trong quá trình thương mại hóa cũng không thể xem nhẹ. Một số đơn vị tự ý lạm dụng thương hiệu lâu đời hoặc dùng hàng nhái công nghiệp kém chất lượng mạo danh thủ công di sản, làm tổn thương sâu sắc tâm huyết nghệ nhân. Do đó, hoàn thiện bảo hộ tư pháp về sở hữu trí tuệ và pháp luật chỉ dẫn địa lý trở nên vô cùng cấp thiết.',
      },
      {
        index: 3,
        discourseRole: 'Tổng kết (结语升华)',
        zh: '法律确立底线，创意激活当下，教育播种未来。当年轻设计师与非遗大师携手共创，当消费者愿意为货真价实的文化原创买单，古老的文明基因便能在新时代的脉搏中薪火相传、生生不息。',
        vi: 'Pháp luật dựng lằn ranh bảo vệ, sáng tạo thổi hồn cho hiện tại, giáo dục gieo mầm cho tương lai. Khi nhà thiết kế trẻ đồng sáng tạo cùng nghệ nhân di sản và người tiêu dùng trân trọng giá trị nguyên bản, mạch nguồn văn minh cổ xưa sẽ tiếp tục truyền lửa bất tận trong nhịp đập thời đại mới.',
      },
    ],
    rhetoricalDevices: [
      {
        deviceZh: '排比句 (Phép điệp cấu trúc 3 vế)',
        deviceVi: '法律确立底线，创意激活当下，教育播种未来。',
        excerptZh: '法律确立底线，创意激活当下，教育播种未来。',
        analysisVi: 'Tạo nhịp điệu dứt khoát, cô đọng 3 trụ cột bảo tồn di sản.',
      },
    ],
    vocabIds: ['adv_v_7', 'adv_v_8', 'adv_v_9'],
    grammarIds: ['adv_g_3'],
    synonymGroupIds: ['syn_1'],
    quizQuestions: [
      {
        id: 'q_cult_1',
        category: 'comprehension',
        promptVi: 'Theo đoạn 1, vì sao việc chỉ cất giữ di sản phi vật thể trong tủ kính bảo tàng là chưa đủ?',
        options: [
          'Vì tủ kính bảo tàng quá nhỏ để trưng bày hết hiện vật',
          'Vì làm tách rời di sản khỏi đời sống xã hội đương đại — nơi nuôi dưỡng sức sống cho nghề truyền thống',
          'Vì du khách không thích tham quan bảo tàng vào cuối tuần',
          'Vì chi phí bảo trì kính trưng bày quá tốn kém',
        ],
        correctIndex: 1,
        explanationVi: 'Đoạn 1 nhấn mạnh: “若仅将非遗封存于博物馆的玻璃展柜之中，无异于抽离其赖以呼吸的社会土壤；真正的保护，必是让传统工艺融入当代日常，实现活态传承.”',
      },
      {
        id: 'q_cult_2',
        category: 'register_grammar',
        promptVi: 'Cấu trúc phủ định kép “凡亲临非遗工坊者，莫不敬佩……” mang sắc thái tu từ nào?',
        options: [
          'Diễn đạt sự hoài nghi, không chắc chắn',
          'Khẳng định tuyệt đối không ngoại lệ (Mọi người đến thăm đều khâm phục)',
          'Phủ định hoàn toàn giá trị của nghề thủ công',
          'Thể hiện câu hỏi tu từ mang tính châm biếm',
        ],
        correctIndex: 1,
        explanationVi: '“莫不……” (không ai không) là cấu trúc phủ định kép gốc văn ngôn dùng để khẳng định mạnh mẽ với sắc thái trang nghiêm.',
      },
      {
        id: 'q_cult_3',
        category: 'synonym_nuance',
        promptVi: 'Câu “法律确立底线，创意激活当下，教育播种未来。” sử dụng biện pháp tu từ nào?',
        options: ['排比句 (Điệp cấu trúc 3 vế)', '反问句 (Câu hỏi tu từ)', '拟人 (Nhân hóa)', '夸张 (Nói quá)'],
        correctIndex: 0,
        explanationVi: 'Ba vế song hành cùng cấu trúc Chủ ngữ + Động từ + Tân ngữ (法律确立底线 / 创意激活当下 / 教育播种未来) là phép 排比 điển hình.',
      },
    ],
  },
];

export interface DictionaryPopupResult {
  query: string;
  source: 'hsk_7_9_domain' | 'cc_cedict_hybrid';
  hanzi: string;
  pinyin: string;
  meaning: string;
  hskBand?: number;
  entryType?: string;
  connotationLabelZh?: string;
  collocations?: string[];
  classicalOrigin?: string;
}

/**
 * Instant pop-up dictionary lookup combining HSK 7-9 domain dictionary
 * and hybrid CC-CEDICT search (`dictionaryService.js`).
 */
export async function lookupHsk7to9OrCedict(
  rawQuery: string
): Promise<DictionaryPopupResult | null> {
  const query = String(rawQuery || '').trim();
  if (!query) return null;

  const advHit = HSK_7_9_VOCABULARY.find(
    (v) => v.hanzi === query || v.hanzi.includes(query)
  );
  if (advHit) {
    return {
      query,
      source: 'hsk_7_9_domain',
      hanzi: advHit.hanzi,
      pinyin: advHit.pinyin,
      meaning: advHit.meaningVi,
      hskBand: advHit.hskBand,
      entryType: advHit.entryType,
      connotationLabelZh: advHit.connotationLabelZh,
      collocations: advHit.collocations,
      classicalOrigin: advHit.classicalOrigin,
    };
  }

  try {
    const hybrid = await searchDictionaryHybrid(query, { limit: 3 });
    if (Array.isArray(hybrid) && hybrid.length > 0) {
      const top = hybrid[0];
      return {
        query,
        source: 'cc_cedict_hybrid',
        hanzi: top.hanzi || top.word || query,
        pinyin: top.pinyin || '',
        meaning: top.meaning || top.meaning_vi || 'Đã tìm thấy trong CC-CEDICT',
      };
    }
  } catch {
    // Fallback cleanly in offline/unit test environments
  }

  return null;
}

/**
 * One-click export of an HSK 7-9 item into the user's SRS deck
 * (compatible with `hanzigo_vocab_review`, `srsRetentionService`, and Task 26.01 telemetry).
 */
export async function exportHskAdvancedItemToSrs(
  item: Pick<HskAdvancedVocabItem, 'id' | 'hanzi' | 'pinyin' | 'meaningVi' | 'hskBand' | 'domain'>,
  user: { id?: string | null } | null = null
): Promise<{ exported: boolean; cardId: string }> {
  const cardId = item.id || `adv_${item.hanzi}`;

  // 1. Add to legacy `hanzigo_vocab_review` queue if in browser/storage environment
  if (typeof localStorage !== 'undefined') {
    try {
      const reviewKey = getUserStorageKey(STORAGE_REVIEW, user);
      const raw = localStorage.getItem(reviewKey);
      const list = raw ? (JSON.parse(raw) as string[]) : [];
      if (!list.includes(cardId)) {
        list.push(cardId);
        localStorage.setItem(reviewKey, JSON.stringify(list));
      }
    } catch {
      // Ignore storage errors
    }
  }

  // 2. Initialize retention metadata in Task 26.03 SRS Retention Engine
  recordSrsRetentionReview({
    user,
    cardId,
    hanzi: item.hanzi,
    pinyin: item.pinyin,
    meaning: item.meaningVi,
    hskLevel: item.hskBand,
    reviewRating: 3,
    elapsedDays: 0,
  });

  // 3. Emit standardized telemetry event in Task 26.01
  await recordLearningEvent({
    userId: user?.id ?? null,
    sourceModule: 'lesson',
    hskLevel: item.hskBand,
    skillDomain: 'vocabulary',
    itemId: cardId,
    isCorrect: true,
    scoreEarned: 1,
    scoreMax: 1,
    payload: {
      domain: item.domain,
      action: 'export_hsk7_9_to_srs',
      hanzi: item.hanzi,
    },
  });

  return { exported: true, cardId };
}

const HSK_7_9_PROGRESS_KEY = 'hanzigo_hsk79_completed_modules';

export interface Hsk7to9ModuleCompletion {
  moduleId: string;
  scorePercent: number;
  completedAt: string;
}

export function getCompletedHsk7to9Modules(
  user: { id?: string | null } | null = null
): Record<string, Hsk7to9ModuleCompletion> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const key = getUserStorageKey(HSK_7_9_PROGRESS_KEY, user);
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, Hsk7to9ModuleCompletion>) : {};
  } catch {
    return {};
  }
}

export async function completeHsk7to9Module(
  module: HskAdvancedModuleData,
  scorePercent: number,
  user: { id?: string | null } | null = null
): Promise<{ xpAwarded: number; progress: Record<string, Hsk7to9ModuleCompletion> }> {
  const safeScore = Math.min(100, Math.max(0, Math.round(scorePercent)));
  const current = getCompletedHsk7to9Modules(user);
  const existing = current[module.id];
  const updated: Record<string, Hsk7to9ModuleCompletion> = {
    ...current,
    [module.id]: {
      moduleId: module.id,
      scorePercent: Math.max(safeScore, existing?.scorePercent ?? 0),
      completedAt: new Date().toISOString(),
    },
  };

  if (typeof localStorage !== 'undefined') {
    try {
      const key = getUserStorageKey(HSK_7_9_PROGRESS_KEY, user);
      localStorage.setItem(key, JSON.stringify(updated));

      const lessonsKey = getUserStorageKey('hanzigo_completed_lessons', user);
      const rawLessons = localStorage.getItem(lessonsKey);
      const lessons = rawLessons ? (JSON.parse(rawLessons) as string[]) : [];
      if (!lessons.includes(module.id)) {
        lessons.push(module.id);
        localStorage.setItem(lessonsKey, JSON.stringify(lessons));
      }
    } catch {
      // Ignore storage errors
    }
  }

  const xpAmount = safeScore >= 80 ? 80 : 50;
  awardXp(xpAmount, user, `hsk79_complete_${module.id}`);

  await Promise.allSettled([
    recordLearningEvent({
      userId: user?.id ?? null,
      sourceModule: 'lesson',
      hskLevel: module.hskBand,
      skillDomain: 'reading',
      itemId: `${module.id}_reading`,
      isCorrect: safeScore >= 60,
      scoreEarned: safeScore,
      scoreMax: 100,
      payload: { domain: module.domain, titleZh: module.titleZh },
    }),
    recordLearningEvent({
      userId: user?.id ?? null,
      sourceModule: 'lesson',
      hskLevel: module.hskBand,
      skillDomain: 'grammar',
      itemId: `${module.id}_grammar`,
      isCorrect: safeScore >= 60,
      scoreEarned: safeScore,
      scoreMax: 100,
      payload: { domain: module.domain },
    }),
  ]);

  return { xpAwarded: xpAmount, progress: updated };
}


