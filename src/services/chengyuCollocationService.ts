import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { saveWordToDeck, type DictionaryEntry } from './dictionaryService.ts';

export type SentimentPolarity = 'positive_褒义' | 'neutral_中性' | 'negative_贬义';

export type ChengyuTopic =
  | 'all'
  | 'study'
  | 'work'
  | 'emotion'
  | 'time'
  | 'wisdom'
  | 'lifestyle';

export interface CharBreakdownItem {
  char: string;
  pinyin: string;
  han_viet: string;
  classical_meaning_vi: string;
}

export interface ChengyuExample {
  zh: string;
  pinyin: string;
  vi: string;
}

export interface ChengyuEntry {
  id: string;
  chengyu: string;
  pinyin: string;
  han_viet: string;
  topic: Exclude<ChengyuTopic, 'all'>;
  literal_meaning_vi: string;
  figurative_meaning_vi: string;
  vietnamese_equivalent_idiom?: string | null;
  char_breakdown: CharBreakdownItem[];
  origin_story_vi: string;
  sentiment_polarity: SentimentPolarity;
  syntactic_function: string[];
  hsk_level: number;
  examples: ChengyuExample[];
}

export type CollocationPatternType =
  | 'Verb + Noun'
  | 'Adv + Verb'
  | 'Adj + Noun'
  | 'MeasureWord + Noun';

export interface CollocationPattern {
  pattern_type: CollocationPatternType;
  collocate_zh: string;
  collocate_pinyin: string;
  full_phrase_vi: string;
  common_vietnamese_error?: string;
}

export interface WordCollocationHub {
  id: string;
  core_word: string;
  pinyin: string;
  meaning_vi: string;
  pos: string;
  hsk_level: number;
  collocation_patterns: CollocationPattern[];
}

export interface SolitaireMoveResult {
  valid: boolean;
  reason_vi?: string;
  userEntry?: ChengyuEntry;
  aiReply?: ChengyuEntry | null;
  chainCompleted?: boolean;
}

// ---------------------------------------------------------------------------
// Curated Dataset (HSK 4-9 Chengyu & Collocation Hubs)
// ---------------------------------------------------------------------------

export const CURATED_CHENGYU_ENTRIES: ChengyuEntry[] = [
  {
    id: 'cy-banxin-banyi',
    chengyu: '半信半疑',
    pinyin: 'bàn xìn bàn yí',
    han_viet: 'BÁN TÍN BÁN NGHI',
    topic: 'emotion',
    literal_meaning_vi: 'Nửa tin nửa ngờ.',
    figurative_meaning_vi: 'Có phần tin nhưng vẫn còn hoài nghi, chưa hoàn toàn tin tưởng hẳn.',
    vietnamese_equivalent_idiom: 'Nửa tin nửa ngờ',
    char_breakdown: [
      { char: '半', pinyin: 'bàn', han_viet: 'Bán', classical_meaning_vi: 'Một nửa, phần nào' },
      { char: '信', pinyin: 'xìn', han_viet: 'Tín', classical_meaning_vi: 'Tin tưởng, tin cậy' },
      { char: '半', pinyin: 'bàn', han_viet: 'Bán', classical_meaning_vi: 'Một nửa' },
      { char: '疑', pinyin: 'yí', han_viet: 'Nghi', classical_meaning_vi: 'Nghi ngờ, hồ nghi' },
    ],
    origin_story_vi:
      'Xuất phát từ truyện cổ thời Tam Quốc & dân gian Trung Hoa mô tả tâm lý con người trước những tin đồn bất ngờ: lý trí thấy hợp lý nhưng chứng cứ chưa đủ rõ ràng nên vừa tin vừa ngờ.',
    sentiment_polarity: 'neutral_中性',
    syntactic_function: ['Vị ngữ', 'Trạng ngữ', 'Định ngữ'],
    hsk_level: 5,
    examples: [
      {
        zh: '听了这个消息，他半信半疑，决定亲自去看看。',
        pinyin: 'Tīng le zhège xiāoxi, tā bànxìn-bànyí, juédìng qīnzì qù kànkan.',
        vi: 'Nghe tin này xong, anh ấy nửa tin nửa ngờ, quyết định tự mình đi xem thử.',
      },
    ],
  },
  {
    id: 'cy-ruxiang-suisu',
    chengyu: '入乡随俗',
    pinyin: 'rù xiāng suí sú',
    han_viet: 'NHẬP HƯƠNG TÙY TỤC',
    topic: 'lifestyle',
    literal_meaning_vi: 'Vào làng nào thì theo phong tục làng ấy.',
    figurative_meaning_vi: 'Khi đến một vùng đất, môi trường mới thì nên tôn trọng và hòa nhập theo tập quán địa phương.',
    vietnamese_equivalent_idiom: 'Nhập gia tùy tục',
    char_breakdown: [
      { char: '入', pinyin: 'rù', han_viet: 'Nhập', classical_meaning_vi: 'Đi vào, bước vào' },
      { char: '乡', pinyin: 'xiāng', han_viet: 'Hương', classical_meaning_vi: 'Quê hương, làng quê, vùng đất' },
      { char: '随', pinyin: 'suí', han_viet: 'Tùy', classical_meaning_vi: 'Thuận theo, làm theo' },
      { char: '俗', pinyin: 'sú', han_viet: 'Tục', classical_meaning_vi: 'Phong tục, tập quán' },
    ],
    origin_story_vi:
      'Bắt nguồn từ "Trang Tử" và "Lễ Ký": khi sứ giả hoặc khách lữ hành đi qua biên giới nước khác, việc đầu tiên là hỏi thăm phong tục, điều kiêng kỵ để không thất lễ.',
    sentiment_polarity: 'positive_褒义',
    syntactic_function: ['Vị ngữ', 'Trạng ngữ'],
    hsk_level: 5,
    examples: [
      {
        zh: '到了别的国家，我们要学会入乡随俗。',
        pinyin: 'Dào le biéde guójiā, wǒmen yào xuéhuì rùxiāng-suísú.',
        vi: 'Khi đến quốc gia khác, chúng ta cần học cách nhập gia tùy tục.',
      },
    ],
  },
  {
    id: 'cy-yiju-liangde',
    chengyu: '一举两得',
    pinyin: 'yī jǔ liǎng dé',
    han_viet: 'NHẤT CỬ LƯỠNG ĐẮC',
    topic: 'work',
    literal_meaning_vi: 'Một lần hành động mà thu được hai kết quả.',
    figurative_meaning_vi: 'Làm một việc mà đạt được hai lợi ích cùng một lúc.',
    vietnamese_equivalent_idiom: 'Một công đôi việc',
    char_breakdown: [
      { char: '一', pinyin: 'yī', han_viet: 'Nhất', classical_meaning_vi: 'Một' },
      { char: '举', pinyin: 'jǔ', han_viet: 'Cử', classical_meaning_vi: 'Hành động, động tác, việc làm' },
      { char: '两', pinyin: 'liǎng', han_viet: 'Lưỡng', classical_meaning_vi: 'Hai, đôi' },
      { char: '得', pinyin: 'dé', han_viet: 'Đắc', classical_meaning_vi: 'Thu được, đạt được' },
    ],
    origin_story_vi:
      'Trong "Tấn Thư - Thúc Tích truyện", danh tướng thời Tấn bày kế vừa giúp dân khai thông kênh rạch chống hạn, vừa tận dụng đường thủy để vận chuyển lương thực nhanh chóng.',
    sentiment_polarity: 'positive_褒义',
    syntactic_function: ['Vị ngữ', 'Định ngữ'],
    hsk_level: 4,
    examples: [
      {
        zh: '骑自行车上班既省钱又能锻炼身体，真是一举两得。',
        pinyin: 'Qí zìxíngchē shàngbān jì shěngqián yòu néng duànliàn shēntǐ, zhēn shì yījǔ-liǎngdé.',
        vi: 'Đạp xe đi làm vừa tiết kiệm tiền vừa rèn luyện sức khỏe, đúng là một công đôi việc.',
      },
    ],
  },
  {
    id: 'cy-huashe-tianzu',
    chengyu: '画蛇添足',
    pinyin: 'huà shé tiān zú',
    han_viet: 'HỌA XÀ THIÊM TÚC',
    topic: 'wisdom',
    literal_meaning_vi: 'Vẽ rắn rồi lại vẽ thêm chân.',
    figurative_meaning_vi: 'Làm thừa thãi những việc không cần thiết, chẳng những không tốt hơn mà còn làm hỏng việc.',
    vietnamese_equivalent_idiom: 'Vẽ rắn thêm chân',
    char_breakdown: [
      { char: '画', pinyin: 'huà', han_viet: 'Họa', classical_meaning_vi: 'Vẽ' },
      { char: '蛇', pinyin: 'shé', han_viet: 'Xà', classical_meaning_vi: 'Con rắn' },
      { char: '添', pinyin: 'tiān', han_viet: 'Thiêm', classical_meaning_vi: 'Thêm vào' },
      { char: '足', pinyin: 'zú', han_viet: 'Túc', classical_meaning_vi: 'Bàn chân' },
    ],
    origin_story_vi:
      'Trong "Chiến Quốc Sách", có mấy người thi vẽ rắn giành vò rượu. Một người vẽ xong trước tiên, thấy còn dư thời gian liền vẽ thêm 4 cái chân cho rắn. Người vẽ sau giật lấy vò rượu và nói: "Rắn làm gì có chân!".',
    sentiment_polarity: 'negative_贬义',
    syntactic_function: ['Vị ngữ', 'Tân ngữ', 'Định ngữ'],
    hsk_level: 5,
    examples: [
      {
        zh: '这篇文章已经很精彩了，再加这些解释反而是画蛇添足。',
        pinyin: 'Zhè piān wénzhāng yǐjīng hěn jīngcǎi le, zài jiā zhèxiē jiěshì fǎn\'ér shì huàshé-tiānzú.',
        vi: 'Bài viết này vốn đã rất hay rồi, thêm những giải thích này vào trái lại thành vẽ rắn thêm chân.',
      },
    ],
  },
  {
    id: 'cy-shouzhudaitu',
    chengyu: '守株待兔',
    pinyin: 'shǒu zhū dài tù',
    han_viet: 'THỦ CHU ĐÃI THỐ',
    topic: 'wisdom',
    literal_meaning_vi: 'Ôm gốc cây chờ thỏ chạy tới đâm đầu vào.',
    figurative_meaning_vi: 'Trông chờ vào may mắn ngẫu nhiên mà lười biếng không chịu lao động, hoặc bảo thủ không biết linh hoạt.',
    vietnamese_equivalent_idiom: 'Há miệng chờ sung',
    char_breakdown: [
      { char: '守', pinyin: 'shǒu', han_viet: 'Thủ', classical_meaning_vi: 'Canh giữ, ngồi chờ' },
      { char: '株', pinyin: 'zhū', han_viet: 'Chu', classical_meaning_vi: 'Gốc cây (lộ trên mặt đất)' },
      { char: '待', pinyin: 'dài', han_viet: 'Đãi', classical_meaning_vi: 'Đợi chờ' },
      { char: '兔', pinyin: 'tù', han_viet: 'Thố', classical_meaning_vi: 'Con thỏ' },
    ],
    origin_story_vi:
      'Sách "Hàn Phi Tử" kể về người nông dân nước Tống tình cờ nhặt được con thỏ đâm đầu vào gốc cây chết. Từ đó anh ta bỏ cày cuốc, ngày nào cũng ngồi canh bên gốc cây chờ thỏ nữa nên bị thiên hạ chê cười.',
    sentiment_polarity: 'negative_贬义',
    syntactic_function: ['Vị ngữ', 'Định ngữ', 'Trạng ngữ'],
    hsk_level: 5,
    examples: [
      {
        zh: '成功要靠努力，不能像守株待兔那样等待机会。',
        pinyin: 'Chénggōng yào kào nǔlì, bù néng xiàng shǒuzhū-dàitù nàyàng děngdài jīhuì.',
        vi: 'Thành công phải dựa vào nỗ lực, không thể ngồi chờ cơ hội như kiểu ôm gốc cây đợi thỏ.',
      },
    ],
  },
  {
    id: 'cy-yixin-yiyi',
    chengyu: '一心一意',
    pinyin: 'yī xīn yī yì',
    han_viet: 'NHẤT TÂM NHẤT Ý',
    topic: 'study',
    literal_meaning_vi: 'Một lòng một dạ.',
    figurative_meaning_vi: 'Tập trung toàn bộ tâm trí vào một việc duy nhất, không phân tâm.',
    vietnamese_equivalent_idiom: 'Một lòng một dạ',
    char_breakdown: [
      { char: '一', pinyin: 'yī', han_viet: 'Nhất', classical_meaning_vi: 'Một, duy nhất' },
      { char: '心', pinyin: 'xīn', han_viet: 'Tâm', classical_meaning_vi: 'Tấm lòng, tâm trí' },
      { char: '一', pinyin: 'yī', han_viet: 'Nhất', classical_meaning_vi: 'Một' },
      { char: '意', pinyin: 'yì', han_viet: 'Ý', classical_meaning_vi: 'Ý chí, suy nghĩ' },
    ],
    origin_story_vi:
      'Từ "Tam Quốc Chí": ngợi khen những bậc hiền tài, học giả dốc toàn tâm toàn ý cho sự nghiệp và lý tưởng mà không bị cám dỗ bởi lợi ích bên ngoài.',
    sentiment_polarity: 'positive_褒义',
    syntactic_function: ['Trạng ngữ', 'Vị ngữ', 'Định ngữ'],
    hsk_level: 4,
    examples: [
      {
        zh: '他一心一意地学习中文，进步非常快。',
        pinyin: 'Tā yīxīn-yīyì de xuéxí Zhōngwén, jìnbù fēicháng kuài.',
        vi: 'Anh ấy toàn tâm toàn ý học tiếng Trung nên tiến bộ rất nhanh.',
      },
    ],
  },
  {
    id: 'cy-shiban-gongbei',
    chengyu: '事半功倍',
    pinyin: 'shì bàn gōng bèi',
    han_viet: 'SỰ BÁN CÔNG BỘI',
    topic: 'study',
    literal_meaning_vi: 'Công sức bỏ ra một nửa nhưng hiệu quả tăng gấp đôi.',
    figurative_meaning_vi: 'Nhờ phương pháp đúng đắn mà làm việc nhẹ nhàng nhưng đạt thành quả vượt trội.',
    vietnamese_equivalent_idiom: 'Làm ít hưởng nhiều / Tốn ít công hiệu quả cao',
    char_breakdown: [
      { char: '事', pinyin: 'shì', han_viet: 'Sự', classical_meaning_vi: 'Công sức, việc làm' },
      { char: '半', pinyin: 'bàn', han_viet: 'Bán', classical_meaning_vi: 'Một nửa' },
      { char: '功', pinyin: 'gōng', han_viet: 'Công', classical_meaning_vi: 'Hiệu quả, thành quả' },
      { char: '倍', pinyin: 'bèi', han_viet: 'Bội', classical_meaning_vi: 'Gấp đôi, tăng bội' },
    ],
    origin_story_vi:
      'Xuất phát từ lời Mạnh Tử bàn về nghệ thuật trị quốc và học tập: nếu nắm bắt đúng quy luật và thời cơ, kết quả đạt được sẽ gấp bội phần công sức bỏ ra.',
    sentiment_polarity: 'positive_褒义',
    syntactic_function: ['Vị ngữ', 'Định ngữ'],
    hsk_level: 6,
    examples: [
      {
        zh: '掌握科学的学习方法能让你事半功倍。',
        pinyin: 'Zhǎngwò kēxué de xuéxí fāngfǎ néng ràng nǐ shìbàn-gōngbèi.',
        vi: 'Nắm vững phương pháp học khoa học sẽ giúp bạn bỏ ít công mà hiệu quả nhân đôi.',
      },
    ],
  },
  {
    id: 'cy-bantu-erfei',
    chengyu: '半途而废',
    pinyin: 'bàn tú ér fèi',
    han_viet: 'BÁN ĐỒ NHI PHẾ',
    topic: 'study',
    literal_meaning_vi: 'Đi được nửa đường thì bỏ cuộc.',
    figurative_meaning_vi: 'Làm việc gì chưa đến nơi đến chốn đã nản lòng dừng lại giữa chừng.',
    vietnamese_equivalent_idiom: 'Đứt gánh giữa đường / Bỏ cuộc giữa chừng',
    char_breakdown: [
      { char: '半', pinyin: 'bàn', han_viet: 'Bán', classical_meaning_vi: 'Một nửa' },
      { char: '途', pinyin: 'tú', han_viet: 'Đồ', classical_meaning_vi: 'Con đường' },
      { char: '而', pinyin: 'ér', han_viet: 'Nhi', classical_meaning_vi: 'Mà (liên từ cổ)' },
      { char: '废', pinyin: 'fèi', han_viet: 'Phế', classical_meaning_vi: 'Dừng lại, vứt bỏ' },
    ],
    origin_story_vi:
      'Trong "Lễ Ký - Trung Dung", Khổng Tử nhắc nhở người quân tử phải kiên trì giữ vững đạo lý; còn câu chuyện vợ Lạc Dương Tử cắt đứt khung cửi để khuyên chồng không được bỏ học giữa chừng.',
    sentiment_polarity: 'negative_贬义',
    syntactic_function: ['Vị ngữ', 'Tân ngữ'],
    hsk_level: 5,
    examples: [
      {
        zh: '学习语言最重要的是坚持，千万不能半途而废。',
        pinyin: 'Xuéxí yǔyán zuì zhòngyào de shì jiānchí, qiānwàn bù néng bàntú-érfèi.',
        vi: 'Học ngoại ngữ quan trọng nhất là sự kiên trì, tuyệt đối không thể bỏ cuộc giữa chừng.',
      },
    ],
  },
  {
    id: 'cy-dexin-yingshou',
    chengyu: '得心应手',
    pinyin: 'dé xīn yìng shǒu',
    han_viet: 'ĐẮC TÂM ỨNG THỦ',
    topic: 'work',
    literal_meaning_vi: 'Tâm nghĩ thế nào thì tay làm đáp ứng đúng như vậy.',
    figurative_meaning_vi: 'Kỹ năng thuần thục, làm việc trôi chảy, thành thạo không gặp trở ngại.',
    vietnamese_equivalent_idiom: 'Thuần thục như ý / Thành thạo điêu luyện',
    char_breakdown: [
      { char: '得', pinyin: 'dé', han_viet: 'Đắc', classical_meaning_vi: 'Đạt được, hợp ý' },
      { char: '心', pinyin: 'xīn', han_viet: 'Tâm', classical_meaning_vi: 'Tâm ý, suy nghĩ' },
      { char: '应', pinyin: 'yìng', han_viet: 'Ứng', classical_meaning_vi: 'Đáp ứng, phối hợp' },
      { char: '手', pinyin: 'shǒu', han_viet: 'Thủ', classical_meaning_vi: 'Đôi tay, thao tác' },
    ],
    origin_story_vi:
      'Từ "Trang Tử - Thiên Đạo": người thợ đóng bánh xe Luân Biển miệt mài đẽo gỗ suốt 70 năm, đến mức tay và tâm ý hòa làm một, không cần dùng thước đo vẫn chuẩn xác tuyệt đối.',
    sentiment_polarity: 'positive_褒义',
    syntactic_function: ['Vị ngữ', 'Trạng ngữ', 'Bổ ngữ'],
    hsk_level: 6,
    examples: [
      {
        zh: '经过半年的练习，他用筷子已经得心应手了。',
        pinyin: 'Jīngguò bànnián de liànxí, tā yòng kuàizi yǐjīng déxīn-yìngshǒu le.',
        vi: 'Sau nửa năm luyện tập, anh ấy dùng đũa đã rất thuần thục rồi.',
      },
    ],
  },
  {
    id: 'cy-shuiluo-shichu',
    chengyu: '水落石出',
    pinyin: 'shuǐ luò shí chū',
    han_viet: 'THỦY LẠC THẠCH XUẤT',
    topic: 'wisdom',
    literal_meaning_vi: 'Nước rút xuống thì đá dưới đáy sông lộ ra.',
    figurative_meaning_vi: 'Sự thật cuối cùng cũng được phơi bày sáng tỏ rõ ràng.',
    vietnamese_equivalent_idiom: 'Sự thật phơi bày / Sáng tỏ như ban ngày',
    char_breakdown: [
      { char: '水', pinyin: 'shuǐ', han_viet: 'Thủy', classical_meaning_vi: 'Dòng nước' },
      { char: '落', pinyin: 'luò', han_viet: 'Lạc', classical_meaning_vi: 'Hạ xuống, rút xuống' },
      { char: '石', pinyin: 'shí', han_viet: 'Thạch', classical_meaning_vi: 'Đá ngầm' },
      { char: '出', pinyin: 'chū', han_viet: 'Xuất', classical_meaning_vi: 'Lộ ra, hiện ra' },
    ],
    origin_story_vi:
      'Âu Dương Tu viết trong "Túy Ông Đình Ký" tả cảnh sông mùa đông nước cạn để lộ bãi đá, sau được Tô Thức dùng trong "Hậu Xích Bích Phú" và dân gian dùng để ví việc điều tra rõ chân tướng.',
    sentiment_polarity: 'neutral_中性',
    syntactic_function: ['Vị ngữ', 'Tân ngữ'],
    hsk_level: 6,
    examples: [
      {
        zh: '警察调查之后，整件事情终于水落石出了。',
        pinyin: 'Jǐngchá diàochá zhīhòu, zhěng jiàn shìqing zhōngyú shuǐluò-shíchū le.',
        vi: 'Sau khi cảnh sát điều tra, toàn bộ sự việc cuối cùng đã sáng tỏ.',
      },
    ],
  },
  {
    id: 'cy-churen-yiliao',
    chengyu: '出人意料',
    pinyin: 'chū rén yì liào',
    han_viet: 'XUẤT NHÂN Ý LIỆU',
    topic: 'emotion',
    literal_meaning_vi: 'Vượt ra ngoài sự suy đoán của mọi người.',
    figurative_meaning_vi: 'Bất ngờ, ngoài sức tưởng tượng.',
    vietnamese_equivalent_idiom: 'Ngoài sức tưởng tượng',
    char_breakdown: [
      { char: '出', pinyin: 'chū', han_viet: 'Xuất', classical_meaning_vi: 'Vượt ra ngoài' },
      { char: '人', pinyin: 'rén', han_viet: 'Nhân', classical_meaning_vi: 'Con người' },
      { char: '意', pinyin: 'yì', han_viet: 'Ý', classical_meaning_vi: 'Ý nghĩ' },
      { char: '料', pinyin: 'liào', han_viet: 'Liệu', classical_meaning_vi: 'Dự liệu, đoán trước' },
    ],
    origin_story_vi:
      'Thường dùng trong văn học cổ điển từ thời Minh – Thanh khi mô tả những bước ngoặt bất ngờ trong cốt truyện hay chiến thuật quân sự.',
    sentiment_polarity: 'neutral_中性',
    syntactic_function: ['Vị ngữ', 'Định ngữ'],
    hsk_level: 5,
    examples: [
      {
        zh: '比赛的结果出人意料，新人竟然赢了冠军。',
        pinyin: 'Bǐsài de jiéguǒ chūrén-yìliào, xīnrén jìngrán yíng le guànjūn.',
        vi: 'Kết quả trận đấu thật bất ngờ, người mới lại thắng nhà vô địch.',
      },
    ],
  },
  {
    id: 'cy-xuezhong-songtan',
    chengyu: '雪中送炭',
    pinyin: 'xuě zhōng sòng tàn',
    han_viet: 'TUYẾT TRUNG TỐNG THÁN',
    topic: 'lifestyle',
    literal_meaning_vi: 'Trời đổ tuyết lạnh giá mà mang than đến sưởi ấm.',
    figurative_meaning_vi: 'Giúp đỡ kịp thời đúng lúc người khác đang lâm vào cảnh khó khăn hoạn nạn nhất.',
    vietnamese_equivalent_idiom: 'Cứu nguy lúc ngặt / Một miếng khi đói bằng một gói khi no',
    char_breakdown: [
      { char: '雪', pinyin: 'xuě', han_viet: 'Tuyết', classical_meaning_vi: 'Tuyết rơi giá rét' },
      { char: '中', pinyin: 'zhōng', han_viet: 'Trung', classical_meaning_vi: 'Trong lúc' },
      { char: '送', pinyin: 'sòng', han_viet: 'Tống', classical_meaning_vi: 'Mang tặng, gửi đến' },
      { char: '炭', pinyin: 'tàn', han_viet: 'Thán', classical_meaning_vi: 'Than sưởi' },
    ],
    origin_story_vi:
      'Thời nhà Tống, vua Tống Thái Tông giữa đêm tuyết rơi dày nhớ tới những gia đình nghèo khổ không có củi lửa sưởi ấm, liền sai người mang gạo và than đi phát tận nơi.',
    sentiment_polarity: 'positive_褒义',
    syntactic_function: ['Vị ngữ', 'Tân ngữ', 'Định ngữ'],
    hsk_level: 6,
    examples: [
      {
        zh: '在我最困难的时候，朋友的帮助真是雪中送炭。',
        pinyin: 'Zài wǒ zuì kùnnan de shíhou, péngyou de bāngzhù zhēn shì xuězhōng-sòngtàn.',
        vi: 'Lúc tôi khó khăn nhất, sự giúp đỡ của bạn bè thật sự như đưa than giữa trời tuyết.',
      },
    ],
  },
  {
    id: 'cy-guangyin-sijian',
    chengyu: '光阴似箭',
    pinyin: 'guāng yīn sì jiàn',
    han_viet: 'QUANG ÂM TỰ TIỄN',
    topic: 'time',
    literal_meaning_vi: 'Thời gian trôi nhanh như mũi tên bay.',
    figurative_meaning_vi: 'Thời gian qua đi rất nhanh, cần biết trân trọng từng phút giây.',
    vietnamese_equivalent_idiom: 'Thời gian thoi đưa / Nhanh như tên bắn',
    char_breakdown: [
      { char: '光', pinyin: 'guāng', han_viet: 'Quang', classical_meaning_vi: 'Ánh sáng ban ngày' },
      { char: '阴', pinyin: 'yīn', han_viet: 'Âm', classical_meaning_vi: 'Bóng tối ban đêm (光阴 = thời gian)' },
      { char: '似', pinyin: 'sì', han_viet: 'Tự', classical_meaning_vi: 'Giống như' },
      { char: '箭', pinyin: 'jiàn', han_viet: 'Tiễn', classical_meaning_vi: 'Mũi tên' },
    ],
    origin_story_vi:
      'Nhà thơ Vi Trang thời Đường viết: "Chung nhật mang mang hà sở quy, quang âm tự tiễn nhật nguyệt như phi", nhắc nhở thế nhân không để tuổi xuân trôi qua lãng phí.',
    sentiment_polarity: 'neutral_中性',
    syntactic_function: ['Vị ngữ', 'Phân câu độc lập'],
    hsk_level: 5,
    examples: [
      {
        zh: '光阴似箭，转眼间我们就要大学毕业了。',
        pinyin: 'Guāngyīn-sìjiàn, zhuǎnyǎnjiān wǒmen jiù yào dàxué bìyè le.',
        vi: 'Thời gian thoi đưa, chớp mắt chúng ta sắp tốt nghiệp đại học rồi.',
      },
    ],
  },
  {
    id: 'cy-jianchi-buxie',
    chengyu: '坚持不懈',
    pinyin: 'jiān chí bù xiè',
    han_viet: 'KIÊN TRÌ BẤT GIẢI',
    topic: 'work',
    literal_meaning_vi: 'Giữ vững bền bỉ không hề lơi lỏng.',
    figurative_meaning_vi: 'Kiên trì nỗ lực tới cùng, không chùn bước trước gian khổ.',
    vietnamese_equivalent_idiom: 'Kiên trì bền bỉ / Có công mài sắt có ngày nên kim',
    char_breakdown: [
      { char: '坚', pinyin: 'jiān', han_viet: 'Kiên', classical_meaning_vi: 'Vững chắc, kiên định' },
      { char: '持', pinyin: 'chí', han_viet: 'Trì', classical_meaning_vi: 'Giữ lấy, duy trì' },
      { char: '不', pinyin: 'bù', han_viet: 'Bất', classical_meaning_vi: 'Không' },
      { char: '懈', pinyin: 'xiè', han_viet: 'Giải', classical_meaning_vi: 'Lơi lỏng, biếng nhác' },
    ],
    origin_story_vi:
      'Ghi trong "Hậu Hán Thư - Đặng Vũ truyện", ca ngợi tinh thần làm việc bền bỉ không ngừng nghỉ của danh tướng Đặng Vũ trong công cuộc ổn định triều chính.',
    sentiment_polarity: 'positive_褒义',
    syntactic_function: ['Vị ngữ', 'Trạng ngữ', 'Định ngữ'],
    hsk_level: 5,
    examples: [
      {
        zh: '只要坚持不懈地努力，梦想终会实现。',
        pinyin: 'Zhǐyào jiānchí-bùxiè de nǔlì, mèngxiǎng zhōng huì shíxiàn.',
        vi: 'Chỉ cần nỗ lực kiên trì không ngừng, ước mơ rồi sẽ thành hiện thực.',
      },
    ],
  },
  {
    id: 'cy-hutou-shewei',
    chengyu: '虎头蛇尾',
    pinyin: 'hǔ tóu shé wěi',
    han_viet: 'HỔ ĐẦU XÀ VĨ',
    topic: 'work',
    literal_meaning_vi: 'Đầu hổ nhưng đuôi rắn.',
    figurative_meaning_vi: 'Lúc mới bắt đầu làm thì rầm rộ khí thế, nhưng về sau lại đuối sức, làm qua loa hoặc bỏ dở.',
    vietnamese_equivalent_idiom: 'Đầu voi đuôi chuột',
    char_breakdown: [
      { char: '虎', pinyin: 'hǔ', han_viet: 'Hổ', classical_meaning_vi: 'Con hổ (oai phong lúc đầu)' },
      { char: '头', pinyin: 'tóu', han_viet: 'Đầu', classical_meaning_vi: 'Phần đầu, khởi đầu' },
      { char: '蛇', pinyin: 'shé', han_viet: 'Xà', classical_meaning_vi: 'Con rắn (nhỏ yếu lúc sau)' },
      { char: '尾', pinyin: 'wěi', han_viet: 'Vĩ', classical_meaning_vi: 'Phần đuôi, kết thúc' },
    ],
    origin_story_vi:
      'Trong "Chu Tử Ngữ Loại" thời Tống và "Khang Hi Tự Điển", các học giả dùng hình ảnh đầu hổ to lớn nhưng đuôi rắn nhỏ bé để phê bình thói làm việc thiếu nhất quán.',
    sentiment_polarity: 'negative_贬义',
    syntactic_function: ['Vị ngữ', 'Định ngữ'],
    hsk_level: 6,
    examples: [
      {
        zh: '做任何计划都要有始有终，不能虎头蛇尾。',
        pinyin: 'Zuò rènhé jìhuà dōu yào yǒushǐ-yǒuzhōng, bù néng hǔtóu-shéwěi.',
        vi: 'Làm kế hoạch nào cũng phải có đầu có cuối, không thể đầu voi đuôi chuột.',
      },
    ],
  },
  {
    id: 'cy-weida-budiao',
    chengyu: '尾大不掉',
    pinyin: 'wěi dà bù diào',
    han_viet: 'VĨ ĐẠI BẤT ĐIỆU',
    topic: 'work',
    literal_meaning_vi: 'Cái đuôi quá to nên không vẫy nổi.',
    figurative_meaning_vi: 'Bộ máy cấp dưới hoặc quy mô phình to quá mức khiến trung tâm không thể điều khiển linh hoạt.',
    vietnamese_equivalent_idiom: 'Đầu nhỏ đuôi to / Cồng kềnh khó xoay xở',
    char_breakdown: [
      { char: '尾', pinyin: 'wěi', han_viet: 'Vĩ', classical_meaning_vi: 'Cái đuôi' },
      { char: '大', pinyin: 'dà', han_viet: 'Đại', classical_meaning_vi: 'To lớn' },
      { char: '不', pinyin: 'bù', han_viet: 'Bất', classical_meaning_vi: 'Không' },
      { char: '掉', pinyin: 'diào', han_viet: 'Điệu', classical_meaning_vi: 'Lay chuyển, vẫy động' },
    ],
    origin_story_vi:
      'Từ "Tả Truyện - Chiêu Công thập nhất niên": đại phu Thân Vô Vũ can gián Sở Linh Vương đừng để các chư hầu biên ải quá lớn mạnh, ví như đuôi to hơn thân thì không vẫy được.',
    sentiment_polarity: 'negative_贬义',
    syntactic_function: ['Vị ngữ', 'Định ngữ'],
    hsk_level: 7,
    examples: [
      {
        zh: '公司部门过多，结果出现尾大不掉的局面。',
        pinyin: 'Gōngsī bùmén guòduō, jiéguǒ chūxiàn wěidà-bùdiào de júmiàn.',
        vi: 'Công ty có quá nhiều phòng ban, kết quả rơi vào tình trạng cồng kềnh khó điều hành.',
      },
    ],
  },
];

export const CURATED_COLLOCATION_HUBS: WordCollocationHub[] = [
  {
    id: 'col-tigao',
    core_word: '提高',
    pinyin: 'tígāo',
    meaning_vi: 'Nâng cao, cải thiện (trình độ, chất lượng, nhận thức)',
    pos: 'Động từ (Verb)',
    hsk_level: 3,
    collocation_patterns: [
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '水平 / 能力',
        collocate_pinyin: 'shuǐpíng / nénglì',
        full_phrase_vi: 'Nâng cao trình độ / năng lực',
        common_vietnamese_error: 'Người Việt hay dịch sát nghĩa là *增加水平 (sai! Dùng 提高水平)',
      },
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '质量 / 效率',
        collocate_pinyin: 'zhìliàng / xiàolǜ',
        full_phrase_vi: 'Nâng cao chất lượng / hiệu suất',
      },
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '警惕 / 认识',
        collocate_pinyin: 'jǐngtì / rènshi',
        full_phrase_vi: 'Nâng cao cảnh giác / nhận thức',
      },
      {
        pattern_type: 'Adv + Verb',
        collocate_zh: '大幅度 / 显著 + 提高',
        collocate_pinyin: 'dàfúdù / xiǎnzhù tígāo',
        full_phrase_vi: 'Nâng cao vượt bậc / rõ rệt',
      },
    ],
  },
  {
    id: 'col-peiyang',
    core_word: '培养',
    pinyin: 'péiyǎng',
    meaning_vi: 'Bồi dưỡng, đào tạo, nuôi dưỡng (thói quen, nhân tài, hứng thú)',
    pos: 'Động từ (Verb)',
    hsk_level: 4,
    collocation_patterns: [
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '习惯 / 兴趣',
        collocate_pinyin: 'xíguàn / xìngqù',
        full_phrase_vi: 'Nuôi dưỡng thói quen / hứng thú',
        common_vietnamese_error: 'Tránh dùng *做习惯 hoặc *训练习惯; chuẩn phải là 培养习惯 / 养成习惯',
      },
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '人才 / 感情',
        collocate_pinyin: 'réncái / gǎnqíng',
        full_phrase_vi: 'Đào tạo nhân tài / vun đắp tình cảm',
      },
      {
        pattern_type: 'Adv + Verb',
        collocate_zh: '精心 / 重点 + 培养',
        collocate_pinyin: 'jīngxīn / zhòngdiǎn péiyǎng',
        full_phrase_vi: 'Dày công bồi dưỡng / đào tạo trọng điểm',
      },
      {
        pattern_type: 'Adj + Noun',
        collocate_zh: '独立思考能力',
        collocate_pinyin: 'dúlì sīkǎo nénglì',
        full_phrase_vi: 'Bồi dưỡng năng lực tư duy độc lập',
      },
    ],
  },
  {
    id: 'col-fengfu',
    core_word: '丰富',
    pinyin: 'fēngfù',
    meaning_vi: 'Phong phú (Tính từ) / Làm phong phú thêm (Động từ)',
    pos: 'Tính từ / Động từ',
    hsk_level: 4,
    collocation_patterns: [
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '知识 / 经验',
        collocate_pinyin: 'zhīshi / jīngyàn',
        full_phrase_vi: 'Làm phong phú kiến thức / kinh nghiệm',
        common_vietnamese_error: 'Không dùng *多知识; muốn nói giàu kinh nghiệm phải dùng 经验丰富',
      },
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '业余生活',
        collocate_pinyin: 'yèyú shēnghuó',
        full_phrase_vi: 'Làm phong phú đời sống ngoài giờ',
      },
      {
        pattern_type: 'Adj + Noun',
        collocate_zh: '丰富的想象力',
        collocate_pinyin: 'fēngfù de xiǎngxiànglì',
        full_phrase_vi: 'Trí tưởng tượng phong phú',
      },
      {
        pattern_type: 'Adv + Verb',
        collocate_zh: '极其 / 十分 + 丰富',
        collocate_pinyin: 'jíqí / shífēn fēngfù',
        full_phrase_vi: 'Vô cùng / hết sức phong phú',
      },
    ],
  },
  {
    id: 'col-jiejue',
    core_word: '解决',
    pinyin: 'jiějué',
    meaning_vi: 'Giải quyết, tháo gỡ (vấn đề, mâu thuẫn, khó khăn)',
    pos: 'Động từ (Verb)',
    hsk_level: 3,
    collocation_patterns: [
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '问题 / 困难',
        collocate_pinyin: 'wèntí / kùnnan',
        full_phrase_vi: 'Giải quyết vấn đề / khó khăn',
        common_vietnamese_error: 'Không dùng *做问题 hoặc *处理困难 khi ý muốn tháo gỡ dứt điểm; hãy dùng 解决问题',
      },
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '矛盾 / 纠纷',
        collocate_pinyin: 'máodùn / jiūfēn',
        full_phrase_vi: 'Giải quyết mâu thuẫn / tranh chấp',
      },
      {
        pattern_type: 'Adv + Verb',
        collocate_zh: '彻底 / 妥善 + 解决',
        collocate_pinyin: 'chèdǐ / tuǒshàn jiějué',
        full_phrase_vi: 'Giải quyết triệt để / ổn thỏa',
      },
      {
        pattern_type: 'MeasureWord + Noun',
        collocate_zh: '一套 + 解决方案',
        collocate_pinyin: 'yī tào jiějué fāng\'àn',
        full_phrase_vi: 'Một bộ phương án giải quyết',
      },
    ],
  },
  {
    id: 'col-fabiao',
    core_word: '发表',
    pinyin: 'fābiǎo',
    meaning_vi: 'Phát biểu, công bố, đăng tải (bài viết, ý kiến, diễn văn)',
    pos: 'Động từ (Verb)',
    hsk_level: 4,
    collocation_patterns: [
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '意见 / 看法',
        collocate_pinyin: 'yìjiàn / kànfǎ',
        full_phrase_vi: 'Phát biểu ý kiến / quan điểm',
        common_vietnamese_error: 'Người Việt hay nói *说意见 hoặc *出意见 (sai! Chuẩn: 发表意见 / 提出意见)',
      },
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '论文 / 文章',
        collocate_pinyin: 'lùnwén / wénzhāng',
        full_phrase_vi: 'Công bố luận văn / đăng bài báo',
      },
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '演讲 / 声明',
        collocate_pinyin: 'yǎnjiǎng / shēngmíng',
        full_phrase_vi: 'Đọc diễn văn / ra tuyên bố',
      },
      {
        pattern_type: 'MeasureWord + Noun',
        collocate_zh: '一篇 + 学术论文',
        collocate_pinyin: 'yī piān xuéshù lùnwén',
        full_phrase_vi: 'Một bài luận văn học thuật',
      },
    ],
  },
  {
    id: 'col-yangcheng',
    core_word: '养成',
    pinyin: 'yǎngchéng',
    meaning_vi: 'Hình thành, rèn giũa thành (thói quen, tác phong)',
    pos: 'Động từ (Verb)',
    hsk_level: 4,
    collocation_patterns: [
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '好习惯',
        collocate_pinyin: 'hǎo xíguàn',
        full_phrase_vi: 'Hình thành thói quen tốt',
        common_vietnamese_error: 'Không dịch word-by-word thành *做习惯 hay *看书报; hãy dùng 养成阅读习惯',
      },
      {
        pattern_type: 'Verb + Noun',
        collocate_zh: '良好的作息',
        collocate_pinyin: 'liánghǎo de zuòxī',
        full_phrase_vi: 'Tạo nếp sinh hoạt điều độ',
      },
      {
        pattern_type: 'Adv + Verb',
        collocate_zh: '逐渐 / 从小 + 养成',
        collocate_pinyin: 'zhújiàn / cóngxiǎo yǎngchéng',
        full_phrase_vi: 'Dần dần / từ nhỏ hình thành',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Utility & Search Helpers
// ---------------------------------------------------------------------------

/**
 * Strip tone marks from pinyin for homophone solitaire matching (e.g. "yī" -> "yi")
 */
export function stripPinyinTones(pinyin: string): string {
  return (pinyin || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ü/g, 'v')
    .trim();
}

export function getFirstCharPinyin(entry: ChengyuEntry): string {
  if (entry.char_breakdown && entry.char_breakdown.length > 0) {
    return stripPinyinTones(entry.char_breakdown[0].pinyin);
  }
  const parts = entry.pinyin.trim().split(/\s+/);
  return stripPinyinTones(parts[0] || '');
}

export function getLastCharPinyin(entry: ChengyuEntry): string {
  if (entry.char_breakdown && entry.char_breakdown.length > 0) {
    return stripPinyinTones(entry.char_breakdown[entry.char_breakdown.length - 1].pinyin);
  }
  const parts = entry.pinyin.trim().split(/\s+/);
  return stripPinyinTones(parts[parts.length - 1] || '');
}

/**
 * Check if a 4-character Chengyu matches a positional pattern like "一_二_", "半?半?", "_心_意"
 */
export function matchesChengyuPattern(chengyu: string, patternInput: string): boolean {
  const cleanPattern = patternInput.trim().replace(/\s+/g, '');
  if (!cleanPattern) return true;

  // If the pattern uses wildcard characters (_ or ? or *), do positional matching
  const hasWildcard = /[_?？*]/.test(cleanPattern);
  const chars = Array.from(chengyu.trim());
  const patChars = Array.from(cleanPattern);

  if (hasWildcard && patChars.length === 4 && chars.length === 4) {
    for (let i = 0; i < 4; i += 1) {
      const pc = patChars[i];
      if (pc !== '_' && pc !== '?' && pc !== '？' && pc !== '*' && pc !== chars[i]) {
        return false;
      }
    }
    return true;
  }

  return chengyu.includes(cleanPattern);
}

/**
 * Fetch Chengyu entries (from Supabase if available, merged with curated list)
 */
export async function listChengyuEntries(): Promise<ChengyuEntry[]> {
  if (!isSupabaseConfigured || !supabase) {
    return CURATED_CHENGYU_ENTRIES;
  }
  try {
    const { data, error } = await supabase
      .from('chengyu_entries')
      .select('*')
      .order('hsk_level', { ascending: true });

    if (!error && data && data.length > 0) {
      const remote = data as ChengyuEntry[];
      const remoteSet = new Set(remote.map((r) => r.chengyu));
      return [...remote, ...CURATED_CHENGYU_ENTRIES.filter((c) => !remoteSet.has(c.chengyu))];
    }
  } catch {
    // fallback to curated dataset
  }
  return CURATED_CHENGYU_ENTRIES;
}

/**
 * Search Chengyu by pattern (e.g. "一_二_"), topic, sentiment polarity, or Vietnamese idiom
 */
export function searchChengyuEntries(
  entries: ChengyuEntry[],
  filters: {
    query?: string;
    topic?: ChengyuTopic;
    sentiment?: SentimentPolarity | 'all';
  }
): ChengyuEntry[] {
  const q = (filters.query || '').trim().toLowerCase();
  const topic = filters.topic || 'all';
  const sentiment = filters.sentiment || 'all';

  return entries.filter((entry) => {
    if (topic !== 'all' && entry.topic !== topic) return false;
    if (sentiment !== 'all' && entry.sentiment_polarity !== sentiment) return false;

    if (!q) return true;

    // Positional pattern match (e.g., 半_半_, 一_二_, _心_意)
    if (matchesChengyuPattern(entry.chengyu, filters.query || '')) {
      return true;
    }

    const haystack = [
      entry.chengyu,
      entry.pinyin,
      stripPinyinTones(entry.pinyin),
      entry.han_viet,
      entry.literal_meaning_vi,
      entry.figurative_meaning_vi,
      entry.vietnamese_equivalent_idiom || '',
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(q);
  });
}

/**
 * Fetch Word Collocation Hubs
 */
export async function listCollocationHubs(): Promise<WordCollocationHub[]> {
  if (!isSupabaseConfigured || !supabase) {
    return CURATED_COLLOCATION_HUBS;
  }
  try {
    const { data, error } = await supabase
      .from('word_collocation_hubs')
      .select('*')
      .order('hsk_level', { ascending: true });

    if (!error && data && data.length > 0) {
      const remote = data as WordCollocationHub[];
      const remoteSet = new Set(remote.map((r) => r.core_word));
      return [...remote, ...CURATED_COLLOCATION_HUBS.filter((c) => !remoteSet.has(c.core_word))];
    }
  } catch {
    // fallback
  }
  return CURATED_COLLOCATION_HUBS;
}

export function searchCollocationHubs(
  hubs: WordCollocationHub[],
  query: string
): WordCollocationHub[] {
  const q = (query || '').trim().toLowerCase();
  if (!q) return hubs;

  return hubs.filter((hub) => {
    const inHeader =
      hub.core_word.toLowerCase().includes(q) ||
      hub.pinyin.toLowerCase().includes(q) ||
      stripPinyinTones(hub.pinyin).includes(q) ||
      hub.meaning_vi.toLowerCase().includes(q);

    if (inHeader) return true;

    return hub.collocation_patterns.some(
      (p) =>
        p.collocate_zh.toLowerCase().includes(q) ||
        p.full_phrase_vi.toLowerCase().includes(q) ||
        (p.common_vietnamese_error || '').toLowerCase().includes(q)
    );
  });
}

// ---------------------------------------------------------------------------
// Chengyu Solitaire (成语接龙) Engine
// ---------------------------------------------------------------------------

/**
 * Find all valid next Chengyu moves given the previous Chengyu and used history
 */
export function getValidSolitaireNextMoves(
  entries: ChengyuEntry[],
  previousEntry: ChengyuEntry,
  usedChengyuSet: Set<string>,
  allowHomophone = true
): ChengyuEntry[] {
  const prevChars = Array.from(previousEntry.chengyu.trim());
  const tailChar = prevChars[prevChars.length - 1];
  const tailPinyin = getLastCharPinyin(previousEntry);

  return entries.filter((candidate) => {
    if (usedChengyuSet.has(candidate.chengyu)) return false;
    const headChar = Array.from(candidate.chengyu.trim())[0];
    if (headChar === tailChar) return true;
    if (allowHomophone && tailPinyin && getFirstCharPinyin(candidate) === tailPinyin) {
      return true;
    }
    return false;
  });
}

/**
 * Validate user's Chengyu Solitaire submission and compute AI counter-move
 */
export function playChengyuSolitaireTurn(params: {
  entries: ChengyuEntry[];
  previousEntry: ChengyuEntry;
  userInput: string;
  usedChengyu: string[];
  allowHomophone?: boolean;
}): SolitaireMoveResult {
  const { entries, previousEntry, userInput, usedChengyu, allowHomophone = true } = params;
  const cleanInput = userInput.trim();
  const usedSet = new Set(usedChengyu);

  if (!cleanInput || Array.from(cleanInput).length !== 4) {
    return {
      valid: false,
      reason_vi: 'Thành ngữ phải gồm đúng 4 chữ Hán.',
    };
  }

  if (usedSet.has(cleanInput)) {
    return {
      valid: false,
      reason_vi: `Thành ngữ "${cleanInput}" đã được sử dụng trong chuỗi này.`,
    };
  }

  const matchedUserEntry = entries.find((e) => e.chengyu === cleanInput);
  if (!matchedUserEntry) {
    return {
      valid: false,
      reason_vi: `Chưa tìm thấy "${cleanInput}" trong kho thành ngữ chuẩn. Hãy thử gợi ý bên dưới.`,
    };
  }

  const prevTailChar = Array.from(previousEntry.chengyu.trim())[3];
  const prevTailPinyin = getLastCharPinyin(previousEntry);
  const userHeadChar = Array.from(matchedUserEntry.chengyu.trim())[0];
  const userHeadPinyin = getFirstCharPinyin(matchedUserEntry);

  const exactMatch = userHeadChar === prevTailChar;
  const homophoneMatch = allowHomophone && prevTailPinyin && userHeadPinyin === prevTailPinyin;

  if (!exactMatch && !homophoneMatch) {
    return {
      valid: false,
      reason_vi: allowHomophone
        ? `Thành ngữ tiếp theo phải bắt đầu bằng chữ "${prevTailChar}" hoặc âm "${prevTailPinyin}".`
        : `Thành ngữ tiếp theo phải bắt đầu bằng đúng chữ "${prevTailChar}".`,
    };
  }

  const updatedUsed = new Set([...usedSet, matchedUserEntry.chengyu]);
  const aiCandidates = getValidSolitaireNextMoves(
    entries,
    matchedUserEntry,
    updatedUsed,
    allowHomophone
  );

  // Prefer exact Hanzi match for AI reply if available
  const aiExact = aiCandidates.find(
    (c) => Array.from(c.chengyu)[0] === Array.from(matchedUserEntry.chengyu)[3]
  );
  const aiReply = aiExact || aiCandidates[0] || null;

  return {
    valid: true,
    userEntry: matchedUserEntry,
    aiReply,
    chainCompleted: aiReply === null,
  };
}

/**
 * Save a Chengyu into the user's SRS Vocabulary Deck
 */
export async function saveChengyuToSRS(
  entry: ChengyuEntry,
  user?: { id?: string | null } | null
): Promise<void> {
  const dictEntry: DictionaryEntry = {
    id: `chengyu-${entry.chengyu}`,
    simplified: entry.chengyu,
    traditional: entry.chengyu,
    pinyin: entry.pinyin,
    pinyin_numbered: entry.pinyin,
    hsk_level: entry.hsk_level,
    han_viet: entry.han_viet,
    pos: 'Thành ngữ (成语)',
    meanings_vi: [
      entry.figurative_meaning_vi,
      entry.vietnamese_equivalent_idiom ? `Tương đương: ${entry.vietnamese_equivalent_idiom}` : '',
    ].filter(Boolean),
    examples: entry.examples.map((ex) => ({ zh: ex.zh, pinyin: ex.pinyin, vi: ex.vi })),
    radical_breakdown: entry.char_breakdown.map((c) => `${c.char} (${c.classical_meaning_vi})`),
  };

  await saveWordToDeck(dictEntry, user);
}

