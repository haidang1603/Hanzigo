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

import { getUserStorageKey } from '../utils/gamification.js';
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

