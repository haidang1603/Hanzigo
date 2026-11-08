/**
 * =========================================================================
 * HANZIGO — SMART CHINESE NLP ENGINE (CONTEXT-FIRST WORD SEGMENTER & PINYIN)
 * =========================================================================
 * 1. Thuật toán Context-First Alignment giải quyết triệt để bài toán Từ Đa Âm (多音字).
 * 2. Tách từ Forward Maximum Matching (FMM) bảo toàn nguyên vẹn dấu câu và xuống dòng.
 * 3. Làm giàu dữ liệu Token (Token Enrichment): Pinyin, Hán-Việt, Nghĩa Việt/Anh, Cấp HSK, Bộ thủ.
 * 4. Thuần JavaScript / WebAssembly: Hoạt động 100% Client, Edge Runtime & Node.js, không C++ native addons.
 * =========================================================================
 */

import { VOCABULARY_LIST } from '../data/chineseData.js';
import { getHanziDecomposition } from '../data/hanziDecomposition.js';
import { EXTENDED_COMMON_CHARS } from '../data/commonCharactersDict.js';
import { findRadical } from '../data/radicalsData.js';

// =========================================================================
// 1. TỪ ĐIỂN TỪ ĐA ÂM THEO NGỮ CẢNH (HETERONYM COMPOUND RULES)
// =========================================================================
export const HETERONYM_COMPOUND_RULES = {
  // 行: háng (ngân hàng, hàng lối, nghề nghiệp) vs xíng (đi lại, hành vi, được)
  '银行': ['yín', 'háng'],
  '中国银行': ['zhōng', 'guó', 'yín', 'háng'],
  '行业': ['háng', 'yè'],
  '各行各业': ['gè', 'háng', 'gè', 'yè'],
  '同行': ['tóng', 'háng'],
  '一行人': ['yì', 'háng', 'rén'],
  '行长': ['háng', 'zhǎng'],
  '商业银行': ['shāng', 'yè', 'yín', 'háng'],
  '商行': ['shāng', 'háng'],
  '行家': ['háng', 'jia'],
  '内行': ['nèi', 'háng'],
  '外行': ['wài', 'háng'],
  '行动': ['xíng', 'dòng'],
  '行动力': ['xíng', 'dòng', 'lì'],
  '行走': ['xíng', 'zǒu'],
  '行为': ['xíng', 'wéi'],
  '行不行': ['xíng', 'bu', 'xíng'],
  '不行': ['bù', 'xíng'],
  '可以行': ['kě', 'yǐ', 'xíng'],
  '行李': ['xíng', 'li'],
  '行李箱': ['xíng', 'li', 'xiāng'],
  '流行': ['liú', 'xíng'],
  '旅行': ['lǚ', 'xíng'],
  '自行车': ['zì', 'xíng', 'chē'],

  // 觉: jiào (ngủ: 睡觉) vs jué (cảm giác, cảm thấy, nhận thức: 觉得, 感觉)
  '睡觉': ['shuì', 'jiào'],
  '睡个觉': ['shuì', 'ge', 'jiào'],
  '睡午觉': ['shuì', 'wǔ', 'jiào'],
  '睡懒觉': ['shuì', 'lǎn', 'jiào'],
  '午觉': ['wǔ', 'jiào'],
  '觉得': ['jué', 'de'],
  '感觉': ['gǎn', 'jué'],
  '自觉': ['zì', 'jué'],
  '知觉': ['zhī', 'jué'],
  '发觉': ['fā', 'jué'],
  '觉察': ['jué', 'chá'],
  '觉悟': ['jué', 'wù'],
  '错觉': ['cuò', 'jué'],

  // 长: zhǎng (lớn lên, trưởng: 长大, 生长, 校长) vs cháng (dài, lâu dài: 长短, 长城, 很长)
  '长大': ['zhǎng', 'dà'],
  '生长': ['shēng', 'zhǎng'],
  '成长': ['chéng', 'zhǎng'],
  '校长': ['xiào', 'zhǎng'],
  '家长': ['jiā', 'zhǎng'],
  '长辈': ['zhǎng', 'bèi'],
  '班长': ['bān', 'zhǎng'],
  '市长': ['shì', 'zhǎng'],
  '董事长': ['dǒng', 'shì', 'zhǎng'],
  '长相': ['zhǎng', 'xiàng'],
  '长高': ['zhǎng', 'gāo'],
  '长城': ['cháng', 'chéng'],
  '长江': ['cháng', 'jiāng'],
  '长短': ['cháng', 'duǎn'],
  '很长': ['hěn', 'cháng'],
  '太长': ['tài', 'cháng'],
  '长久': ['cháng', 'jiǔ'],
  '长远': ['cháng', 'yuǎn'],
  '长年': ['cháng', 'nián'],
  '长途': ['cháng', 'tú'],
  '特长': ['tè', 'cháng'],

  // 乐: lè (vui vẻ: 快乐, 乐观) vs yuè (âm nhạc: 音乐, 乐器)
  '快乐': ['kuài', 'lè'],
  '可乐': ['kě', 'lè'],
  '乐趣': ['lè', 'qù'],
  '乐观': ['lè', 'guān'],
  '享乐': ['xiǎng', 'lè'],
  '欢乐': ['huān', 'lè'],
  '音乐': ['yīn', 'yuè'],
  '乐器': ['yuè', 'qì'],
  '乐谱': ['yuè', 'pǔ'],
  '乐队': ['yuè', 'duì'],
  '乐曲': ['yuè', 'qǔ'],
  '交响乐': ['jiāo', 'xiǎng', 'yuè'],

  // 还: huán (trả lại: 还钱, 归还) vs hái (vẫn, còn: 还有, 还是, 还要)
  '还钱': ['huán', 'qián'],
  '还书': ['huán', 'shū'],
  '归还': ['guī', 'huán'],
  '还给': ['huán', 'gěi'],
  '偿还': ['cháng', 'huán'],
  '退还': ['tuì', 'huán'],
  '还本': ['huán', 'běn'],
  '还有': ['hái', 'yǒu'],
  '还是': ['hái', 'shì'],
  '还要': ['hái', 'yào'],
  '还好': ['hái', 'hǎo'],
  '还行': ['hái', 'xíng'],
  '还不错': ['hái', 'bú', 'cuò'],
  '还没有': ['hái', 'méi', 'yǒu'],
  '还在': ['hái', 'zài'],
  '哪怕还': ['nǎ', 'pà', 'hái'],

  // 得: děi (phải: 得去, 必须得) vs de (trợ từ: 跑得快, 觉得) vs dé (đạt được: 得到, 获得)
  '得去': ['děi', 'qù'],
  '得做': ['děi', 'zuò'],
  '得走': ['děi', 'zǒu'],
  '得吃': ['děi', 'chī'],
  '得买': ['děi', 'mǎi'],
  '得学': ['děi', 'xué'],
  '必须得': ['bì', 'xū', 'děi'],
  '总得': ['zǒng', 'děi'],
  '跑得快': ['pǎo', 'de', 'kuài'],
  '走得慢': ['zǒu', 'de', 'màn'],
  '吃得好': ['chī', 'de', 'hǎo'],
  '玩得开心': ['wán', 'de', 'kāi', 'xīn'],
  '写得好': ['xiě', 'de', 'hǎo'],
  '说得对': ['shuō', 'de', 'duì'],
  '做得到': ['zuò', 'de', 'dào'],
  '做不得': ['zuò', 'bu', 'dé'],
  '来得及': ['lái', 'de', 'jí'],
  '来不及': ['lái', 'bu', 'jí'],
  '得到': ['dé', 'dào'],
  '获得': ['huò', 'dé'],
  '取得': ['qǔ', 'dé'],
  '心得': ['xīn', 'dé'],
  '得意': ['dé', 'yì'],

  // 看: kān (trông coi: 看门, 看家, 看守) vs kàn (nhìn, xem, đọc: 看书, 看见)
  '看门': ['kān', 'mén'],
  '看家': ['kān', 'jiā'],
  '看守': ['kān', 'shǒu'],
  '看管': ['kān', 'guǎn'],
  '看护': ['kān', 'hù'],
  '看书': ['kàn', 'shū'],
  '看见': ['kàn', 'jiàn'],
  '看看': ['kàn', 'kan'],
  '看病': ['kàn', 'bìng'],
  '看待': ['kàn', 'dài'],
  '观看': ['guān', 'kàn'],

  // 重: chóng (lặp lại: 重新, 重复, 重来) vs zhòng (nặng, quan trọng: 重要, 重量)
  '重新': ['chóng', 'xīn'],
  '重来': ['chóng', 'lái'],
  '重复': ['chóng', 'fù'],
  '重做': ['chóng', 'zuò'],
  '重写': ['chóng', 'xiě'],
  '重要': ['zhòng', 'yào'],
  '重量': ['zhòng', 'liàng'],
  '严重': ['yán', 'zhòng'],
  '沉重': ['chén', 'zhòng'],
  '重力': ['zhòng', 'lì'],
  '重视': ['zhòng', 'shì'],

  // 便: pián (tiện nghi: 便宜) vs biàn (thuận tiện: 方便, 便民)
  '便宜': ['pián', 'yi'],
  '方便': ['fāng', 'biàn'],
  '便当': ['biàn', 'dang'],
  '顺便': ['shùn', 'biàn'],
  '便民': ['biàn', 'mín'],

  // 着: zháo (cháy, vội: 着急, 着火, 着凉) vs zhe (trợ từ thái động: 看着, 听着, 等着) vs zhuó (bắt đầu: 着手, 着想)
  '着急': ['zháo', 'jí'],
  '着火': ['zháo', 'huǒ'],
  '着凉': ['zháo', 'liáng'],
  '睡着': ['shuì', 'zháo'],
  '看着': ['kàn', 'zhe'],
  '听着': ['tīng', 'zhe'],
  '笑着': ['xiào', 'zhe'],
  '等着': ['děng', 'zhe'],
  '拿着': ['ná', 'zhe'],
  '走着': ['zǒu', 'zhe'],
  '写着': ['xiě', 'zhe'],
  '着手': ['zhuó', 'shǒu'],
  '着想': ['zhuó', 'xiǎng'],

  // 教: jiāo (dạy học: 教书, 教我) vs jiào (giáo dục: 教室, 教学, 教师)
  '教书': ['jiāo', 'shū'],
  '教我': ['jiāo', 'wǒ'],
  '教给': ['jiāo', 'gěi'],
  '教室': ['jiào', 'shì'],
  '教师': ['jiào', 'shī'],
  '教学': ['jiào', 'xué'],
  '教育': ['jiào', 'yù'],
  '教材': ['jiào', 'cái'],

  // 都: dū (thủ đô: 首都, 都市) vs dōu (tất cả: 都是, 都有)
  '首都': ['shǒu', 'dū'],
  '都市': ['dū', 'shì'],
  '古都': ['gǔ', 'dū'],
  '大都市': ['dà', 'dū', 'shì'],
  '都是': ['dōu', 'shì'],
  '都有': ['dōu', 'yǒu'],
  '都会': ['dōu', 'huì'],
  '都很': ['dōu', 'hěn'],
  '大家都': ['dà', 'jiā', 'dōu'],

  // 差: chà (kém, sai khác: 差不多, 差点) vs chāi (công tác: 出差)
  '出差': ['chū', 'chāi'],
  '差事': ['chāi', 'shì'],
  '差不多': ['chà', 'bu', 'duō'],
  '差得远': ['chà', 'de', 'yuǎn'],
  '差一点': ['chà', 'yì', 'diǎn'],
  '成绩差': ['chéng', 'jì', 'chà'],
  '偏差': ['piān', 'chā'],

  // 为: wèi (vì, vì mục đích: 因为, 为了) vs wéi (làm, trở thành: 成为, 认为, 作为)
  '因为': ['yīn', 'wèi'],
  '为了': ['wèi', 'le'],
  '为什么': ['wèi', 'shén', 'me'],
  '为何': ['wèi', 'hé'],
  '成为': ['chéng', 'wéi'],
  '认为': ['rèn', 'wéi'],
  '作为': ['zuò', 'wéi'],
  '以为': ['yǐ', 'wéi'],

  // 地: dì (đất, nơi chốn: 地方, 地图, 地球) vs de (phó từ: 慢慢地, 高兴地)
  '地方': ['dì', 'fang'],
  '地图': ['dì', 'tú'],
  '地球': ['dì', 'qiú'],
  '地面': ['dì', 'miàn'],
  '土地': ['tǔ', 'dì'],
  '高兴地': ['gāo', 'xìng', 'de'],
  '慢慢地': ['màn', 'màn', 'de'],
  '认真地': ['rèn', 'zhēn', 'de'],
  '努力地': ['nǔ', 'lì', 'de'],
  '飞快地': ['fēi', 'kuài', 'de'],

  // 会: huì (biết, họp, sẽ) vs kuài (kế toán)
  '会计': ['kuài', 'jì'],
  '财会': ['cái', 'kuài'],
  '开会': ['kāi', 'huì'],
  '会议': ['huì', 'yì'],
  '学会': ['xué', 'huì'],
  '不会': ['bú', 'huì'],
  '机会': ['jī', 'huì'],

  // 调: diào (điều tra, âm điệu) vs tiáo (điều hòa, điều chỉnh)
  '调查': ['diào', 'chá'],
  '调动': ['diào', 'dòng'],
  '声调': ['shēng', 'diào'],
  '音调': ['yīn', 'diào'],
  '强调': ['qiáng', 'diào'],
  '空调': ['kōng', 'tiáo'],
  '调整': ['tiáo', 'zhěng'],
  '调解': ['tiáo', 'jiě'],
  '烹调': ['pēng', 'tiáo'],

  // 种: zhǒng (loại, giống) vs zhòng (trồng trọt)
  '种子': ['zhǒng', 'zi'],
  '各种': ['gè', 'zhǒng'],
  '这种': ['zhè', 'zhǒng'],
  '那种': ['nà', 'zhǒng'],
  '种族': ['zhǒng', 'zú'],
  '种花': ['zhòng', 'huā'],
  '种树': ['zhòng', 'shù'],
  '种植': ['zhòng', 'zhí'],
  '耕种': ['gēng', 'zhòng'],

  // 教: jiào (lớp học, giáo dục) vs jiāo (dạy học)
  '教室': ['jiào', 'shì'],
  '教育': ['jiào', 'yù'],
  '教授': ['jiào', 'shòu'],
  '教师': ['jiào', 'shī'],
  '教训': ['jiào', 'xun'],
  '教书': ['jiāo', 'shū'],
  '教课': ['jiāo', 'kè'],

  // 没: méi (không có) vs mò (chìm, tịch thu)
  '没有': ['méi', 'yǒu'],
  '没事': ['méi', 'shì'],
  '没关系': ['méi', 'guān', 'xi'],
  '淹没': ['yān', 'mò'],
  '沉没': ['chén', 'mò'],
  '没收': ['mò', 'shōu'],

  // 答: dá (trả lời) vs dā (đồng ý, hứa)
  '回答': ['huí', 'dá'],
  '答案': ['dá', '’àn'],
  '答复': ['dá', 'fù'],
  '报答': ['bào', 'dá'],
  '答应': ['dā', 'ying'],

  // 结: jié (kết thúc, kết hôn) vs jiē (chắc chắn, ra quả)
  '结婚': ['jié', 'hūn'],
  '结束': ['jié', 'shù'],
  '结果': ['jié', 'guǒ'],
  '总结': ['zǒng', 'jié'],
  '团结': ['tuán', 'jié'],
  '结实': ['jiē', 'shi'],
  '结果子': ['jiē', 'guǒ', 'zi'],

  // 假: jiǎ (giả tạo) vs jià (kỳ nghỉ)
  '真假': ['zhēn', 'jiǎ'],
  '假如': ['jiǎ', 'rú'],
  '假设': ['jiǎ', 'shè'],
  '假装': ['jiǎ', 'zhuāng'],
  '放假': ['fàng', 'jià'],
  '假期': ['jià', 'qī'],
  '请假': ['qǐng', 'jià'],

  // 倒: dǎo (ngã, sụp đổ) vs dào (rót, lùi xe)
  '摔倒': ['shuāi', 'dǎo'],
  '倒下': ['dǎo', 'xià'],
  '倒闭': ['dǎo', 'bì'],
  '倒车': ['dào', 'chē'],
  '倒水': ['dào', 'shuǐ'],
  '倒退': ['dào', 'tuì'],
  '倒是': ['dào', 'shi'],

  // 难: nán (khó) vs nàn (tai nạn)
  '困难': ['kùn', 'nan'],
  '很难': ['hěn', 'nán'],
  '难过': ['nán', 'guò'],
  '难受': ['nán', 'shòu'],
  '灾难': ['zāi', 'nàn'],
  '难民': ['nàn', 'mín'],
  '遇难': ['yù', 'nàn'],

  // 待: dài (đối đãi, chờ) vs dāi (ở lại)
  '等待': ['děng', 'dài'],
  '招待': ['zhāo', 'dài'],
  '对待': ['duì', 'dài'],
  '待遇': ['dài', 'yù'],
  '待会儿': ['dāi', 'huìr'],
  '待在家里': ['dāi', 'zài', 'jiā', 'lǐ']
};

// =========================================================================
// 2. TỪ ĐIỂN MẪU TỰ ĐƠN (CHARACTER PINYIN & HANVIET DICTIONARY)
// =========================================================================
export const COMMON_CHAR_PINYIN_MAP = {
  '你': { pinyin: 'nǐ', hanviet: 'Nhĩ' },
  '好': { pinyin: 'hǎo', hanviet: 'Hảo' },
  '我': { pinyin: 'wǒ', hanviet: 'Ngã' },
  '们': { pinyin: 'men', hanviet: 'Môn' },
  '他': { pinyin: 'tā', hanviet: 'Tha' },
  '她': { pinyin: 'tā', hanviet: 'Tha' },
  '它': { pinyin: 'tā', hanviet: 'Tha' },
  '是': { pinyin: 'shì', hanviet: 'Thị' },
  '不': { pinyin: 'bù', hanviet: 'Bất' },
  '很': { pinyin: 'hěn', hanviet: 'Hẩn' },
  '在': { pinyin: 'zài', hanviet: 'Tại' },
  '有': { pinyin: 'yǒu', hanviet: 'Hữu' },
  '人': { pinyin: 'rén', hanviet: 'Nhân' },
  '个': { pinyin: 'gè', hanviet: 'Cá' },
  '的': { pinyin: 'de', hanviet: 'Đích' },
  '了': { pinyin: 'le', hanviet: 'Liễu' },
  '来': { pinyin: 'lái', hanviet: 'Lai' },
  '去': { pinyin: 'qù', hanviet: 'Khứ' },
  '吃': { pinyin: 'chī', hanviet: 'Ngật' },
  '喝': { pinyin: 'hē', hanviet: 'Hát' },
  '看': { pinyin: 'kàn', hanviet: 'Khán' },
  '听': { pinyin: 'tīng', hanviet: 'Thính' },
  '说': { pinyin: 'shuō', hanviet: 'Thuyết' },
  '读': { pinyin: 'dú', hanviet: 'Độc' },
  '写': { pinyin: 'xiě', hanviet: 'Tả' },
  '学': { pinyin: 'xué', hanviet: 'Học' },
  '习': { pinyin: 'xí', hanviet: 'Tập' },
  '生': { pinyin: 'shēng', hanviet: 'Sinh' },
  '会': { pinyin: 'huì', hanviet: 'Hội' },
  '能': { pinyin: 'néng', hanviet: 'Năng' },
  '想': { pinyin: 'xiǎng', hanviet: 'Tưởng' },
  '要': { pinyin: 'yào', hanviet: 'Yếu' },
  '多': { pinyin: 'duō', hanviet: 'Đa' },
  '少': { pinyin: 'shǎo', hanviet: 'Thiểu' },
  '大': { pinyin: 'dà', hanviet: 'Đại' },
  '小': { pinyin: 'xiǎo', hanviet: 'Tiểu' },
  '买': { pinyin: 'mǎi', hanviet: 'Mãi' },
  '卖': { pinyin: 'mài', hanviet: 'Mại' },
  '钱': { pinyin: 'qián', hanviet: 'Tiền' },
  '水': { pinyin: 'shuǐ', hanviet: 'Thủy' },
  '茶': { pinyin: 'chá', hanviet: 'Trà' },
  '饭': { pinyin: 'fàn', hanviet: 'Phạn' },
  '菜': { pinyin: 'cài', hanviet: 'Thái' },
  '家': { pinyin: 'jiā', hanviet: 'Gia' },
  '国': { pinyin: 'guó', hanviet: 'Quốc' },
  '天': { pinyin: 'tiān', hanviet: 'Thiên' },
  '地': { pinyin: 'dì', hanviet: 'Địa' },
  '上': { pinyin: 'shàng', hanviet: 'Thượng' },
  '下': { pinyin: 'xià', hanviet: 'Hạ' },
  '前': { pinyin: 'qián', hanviet: 'Tiền' },
  '后': { pinyin: 'hòu', hanviet: 'Hậu' },
  '左': { pinyin: 'zuǒ', hanviet: 'Tả' },
  '右': { pinyin: 'yòu', hanviet: 'Hữu' },
  '中': { pinyin: 'zhōng', hanviet: 'Trung' },
  '车': { pinyin: 'chē', hanviet: 'Xa' },
  '坐': { pinyin: 'zuò', hanviet: 'Tọa' },
  '请': { pinyin: 'qǐng', hanviet: 'Thỉnh' },
  '问': { pinyin: 'wèn', hanviet: 'Vấn' },
  '做': { pinyin: 'zuò', hanviet: 'Tác' },
  '作': { pinyin: 'zuò', hanviet: 'Tác' },
  '日': { pinyin: 'rì', hanviet: 'Nhật' },
  '月': { pinyin: 'yuè', hanviet: 'Nguyệt' },
  '年': { pinyin: 'nián', hanviet: 'Niên' },
  '点': { pinyin: 'diǎn', hanviet: 'Điểm' },
  '分': { pinyin: 'fēn', hanviet: 'Phân' },
  '明': { pinyin: 'míng', hanviet: 'Minh' },
  '亮': { pinyin: 'liàng', hanviet: 'Lượng' },
  '新': { pinyin: 'xīn', hanviet: 'Tân' },
  '旧': { pinyin: 'jiù', hanviet: 'Cựu' },
  '早': { pinyin: 'zǎo', hanviet: 'Tảo' },
  '晚': { pinyin: 'wǎn', hanviet: 'Vãn' },
  '快': { pinyin: 'kuài', hanviet: 'Khoái' },
  '慢': { pinyin: 'màn', hanviet: 'Mạn' },
  '高': { pinyin: 'gāo', hanviet: 'Cao' },
  '低': { pinyin: 'dī', hanviet: 'Đê' },
  '冷': { pinyin: 'lěng', hanviet: 'Lãnh' },
  '热': { pinyin: 'rè', hanviet: 'Nhiệt' },
  '雨': { pinyin: 'yǔ', hanviet: 'Vũ' },
  '雪': { pinyin: 'xuě', hanviet: 'Tuyết' },
  '风': { pinyin: 'fēng', hanviet: 'Phong' },
  '云': { pinyin: 'yún', hanviet: 'Vân' },
  '话': { pinyin: 'huà', hanviet: 'Thoại' },
  '语': { pinyin: 'yǔ', hanviet: 'Ngữ' },
  '文': { pinyin: 'wén', hanviet: 'Văn' },
  '字': { pinyin: 'zì', hanviet: 'Tự' },
  '书': { pinyin: 'shū', hanviet: 'Thư' },
  '店': { pinyin: 'diàn', hanviet: 'Điếm' },
  '路': { pinyin: 'lù', hanviet: 'Lộ' },
  '道': { pinyin: 'dào', hanviet: 'Đạo' },
  '行': { pinyin: 'xíng', hanviet: 'Hành' },
  '走': { pinyin: 'zǒu', hanviet: 'Tẩu' },
  '跑': { pinyin: 'pǎo', hanviet: 'Bào' },
  '长': { pinyin: 'cháng', hanviet: 'Trường' },
  '觉': { pinyin: 'jué', hanviet: 'Giác' },
  '乐': { pinyin: 'lè', hanviet: 'Lạc' },
  '还': { pinyin: 'hái', hanviet: 'Hoàn' },
  '得': { pinyin: 'de', hanviet: 'Đắc' },
  '重': { pinyin: 'zhòng', hanviet: 'Trọng' },
  '便': { pinyin: 'biàn', hanviet: 'Tiện' },
  '着': { pinyin: 'zhe', hanviet: 'Trước' },
  '教': { pinyin: 'jiào', hanviet: 'Giáo' },
  '都': { pinyin: 'dōu', hanviet: 'Đô' },
  '差': { pinyin: 'chà', hanviet: 'Sai' },
  '为': { pinyin: 'wèi', hanviet: 'Vi' },
  '心': { pinyin: 'xīn', hanviet: 'Tâm' },
  '情': { pinyin: 'qíng', hanviet: 'Tình' },
  '爱': { pinyin: 'ài', hanviet: 'Ái' },
  '给': { pinyin: 'gěi', hanviet: 'Cấp' },
  '对': { pinyin: 'duì', hanviet: 'Đối' },
  '朋': { pinyin: 'péng', hanviet: 'Bằng' },
  '友': { pinyin: 'yǒu', hanviet: 'Hữu' },
  '块': { pinyin: 'kuài', hanviet: 'Khối' },
  '懂': { pinyin: 'dǒng', hanviet: 'Đổng' },
  '错': { pinyin: 'cuò', hanviet: 'Thác' },
  '题': { pinyin: 'tí', hanviet: 'Đề' },
  '答': { pinyin: 'dá', hanviet: 'Đáp' },
  '机': { pinyin: 'jī', hanviet: 'Cơ' },
  '票': { pinyin: 'piào', hanviet: 'Phiếu' },
  '住': { pinyin: 'zhù', hanviet: 'Trụ' },
  '宿': { pinyin: 'sù', hanviet: 'Túc' },
  '飞': { pinyin: 'fēi', hanviet: 'Phi' },
  '起': { pinyin: 'qǐ', hanviet: 'Khởi' },
  '拿': { pinyin: 'ná', hanviet: 'Noa' },
  '带': { pinyin: 'dài', hanviet: 'Đới' },
  '进': { pinyin: 'jìn', hanviet: 'Tiến' },
  '出': { pinyin: 'chū', hanviet: 'Xuất' },
  '换': { pinyin: 'huàn', hanviet: 'Hoán' },
  '卡': { pinyin: 'kǎ', hanviet: 'Tạp' },
  '包': { pinyin: 'bāo', hanviet: 'Bao' },
  '宜': { pinyin: 'yí', hanviet: 'Nghi' },
  '质': { pinyin: 'zhì', hanviet: 'Chất' },
  '量': { pinyin: 'liàng', hanviet: 'Lượng' },
  '发': { pinyin: 'fā', hanviet: 'Phát' },
  '送': { pinyin: 'sòng', hanviet: 'Tống' },
  '笑': { pinyin: 'xiào', hanviet: 'Tiếu' },
  '哭': { pinyin: 'kū', hanviet: 'Khốc' },
  '急': { pinyin: 'jí', hanviet: 'Cấp' },
  '难': { pinyin: 'nán', hanviet: 'Nan' },
  '易': { pinyin: 'yì', hanviet: 'Dịch' },
  '信': { pinyin: 'xìn', hanviet: 'Tín' },
  '放': { pinyin: 'fàng', hanviet: 'Phóng' },
  '祝': { pinyin: 'zhù', hanviet: 'Chúc' },
  '愿': { pinyin: 'yuàn', hanviet: 'Nguyện' },
  '叫': { pinyin: 'jiào', hanviet: 'Khiếu' },
  '只': { pinyin: 'zhī', hanviet: 'Chích' },
  '白': { pinyin: 'bái', hanviet: 'Bạch' },
  '黑': { pinyin: 'hēi', hanviet: 'Hắc' },
  '红': { pinyin: 'hóng', hanviet: 'Hồng' },
  '绿': { pinyin: 'lǜ', hanviet: 'Lục' },
  '蓝': { pinyin: 'lán', hanviet: 'Lam' },
  '黄': { pinyin: 'huáng', hanviet: 'Hoàng' },
  '床': { pinyin: 'chuáng', hanviet: 'Sàng' },
  '香': { pinyin: 'xiāng', hanviet: 'Hương' },
  '蕉': { pinyin: 'jiāo', hanviet: 'Tiêu' },
  '瓜': { pinyin: 'guā', hanviet: 'Qua' },
  '斤': { pinyin: 'jīn', hanviet: 'Cân' },
  '整': { pinyin: 'zhěng', hanviet: 'Chỉnh' },
  '算': { pinyin: 'suàn', hanviet: 'Toán' },
  '甜': { pinyin: 'tián', hanviet: 'Điềm' },
  '花': { pinyin: 'huā', hanviet: 'Hoa' },
  '初': { pinyin: 'chū', hanviet: 'Sơ' },
  '屋': { pinyin: 'wū', hanviet: 'Ốc' },
  '顶': { pinyin: 'dǐng', hanviet: 'Đỉnh' },
  '盖': { pinyin: 'gài', hanviet: 'Cái' },
  '满': { pinyin: 'mǎn', hanviet: 'Mãn' },
  '极': { pinyin: 'jí', hanviet: 'Cực' },
  '零': { pinyin: 'líng', hanviet: 'Linh' },
  '度': { pinyin: 'dù', hanviet: 'Độ' },
  '街': { pinyin: 'jiē', hanviet: 'Nhai' },
  '堆': { pinyin: 'duī', hanviet: 'Đôi' },
  '打': { pinyin: 'dǎ', hanviet: 'Đả' },
  '仗': { pinyin: 'zhàng', hanviet: 'Trượng' },
  '处': { pinyin: 'chù', hanviet: 'Xứ' },
  '壶': { pinyin: 'hú', hanviet: 'Hồ' },
  '龙': { pinyin: 'lóng', hanviet: 'Long' },
  '井': { pinyin: 'jǐng', hanviet: 'Tỉnh' },
  '窗': { pinyin: 'chuāng', hanviet: 'Song' },
  '户': { pinyin: 'hù', hanviet: 'Hộ' },
  '景': { pinyin: 'jǐng', hanviet: 'Cảnh' },
  '宁': { pinyin: 'níng', hanviet: 'Ninh' },
  '静': { pinyin: 'jìng', hanviet: 'Tĩnh' },
  '深': { pinyin: 'shēn', hanviet: 'Thâm' },
  '搭': { pinyin: 'dā', hanviet: 'Đáp' },
  '乘': { pinyin: 'chéng', hanviet: 'Thừa' },
  '铁': { pinyin: 'tiě', hanviet: 'Thiết' },
  '游': { pinyin: 'yóu', hanviet: 'Du' },
  '西': { pinyin: 'xī', hanviet: 'Tây' },
  '湖': { pinyin: 'hú', hanviet: 'Hồ' },
  '迫': { pinyin: 'pò', hanviet: 'Bách' },
  '及': { pinyin: 'jí', hanviet: 'Cập' },
  '待': { pinyin: 'dài', hanviet: 'Đãi' },
  '往': { pinyin: 'wǎng', hanviet: 'Vãng' },
  '著': { pinyin: 'zhù', hanviet: 'Trứ' },
  '名': { pinyin: 'míng', hanviet: 'Danh' },
  '区': { pinyin: 'qū', hanviet: 'Khu' },
  '苏': { pinyin: 'sū', hanviet: 'Tô' },
  '杭': { pinyin: 'háng', hanviet: 'Hàng' },
  '果': { pinyin: 'guǒ', hanviet: 'Quả' },
  '然': { pinyin: 'rán', hanviet: 'Nhiên' },
  '清': { pinyin: 'qīng', hanviet: 'Thanh' },
  '澈': { pinyin: 'chè', hanviet: 'Triệt' },
  '微': { pinyin: 'wēi', hanviet: 'Vi' },
  '吹': { pinyin: 'chuī', hanviet: 'Xuy' },
  '岸': { pinyin: 'àn', hanviet: 'Ngạn' },
  '柳': { pinyin: 'liǔ', hanviet: 'Liễu' },
  '随': { pinyin: 'suí', hanviet: 'Tùy' },
  '摆': { pinyin: 'bǎi', hanviet: 'Bãi' },
  '动': { pinyin: 'dòng', hanviet: 'Động' },
  '租': { pinyin: 'zū', hanviet: 'Tô' },
  '辆': { pinyin: 'liàng', hanviet: 'Lượng' },
  '共': { pinyin: 'gòng', hanviet: 'Cộng' },
  '享': { pinyin: 'xiǎng', hanviet: 'Hưởng' },
  '单': { pinyin: 'dān', hanviet: 'Đơn' },
  '骑': { pinyin: 'qí', hanviet: 'Kỵ' },
  '途': { pinyin: 'tú', hanviet: 'Đồ' },
  '遇': { pinyin: 'yù', hanviet: 'Ngộ' },
  '当': { pinyin: 'dāng', hanviet: 'Đương' },
  '居': { pinyin: 'jū', hanviet: 'Cư' },
  '民': { pinyin: 'mín', hanviet: 'Dân' },
  '各': { pinyin: 'gè', hanviet: 'Các' },
  '客': { pinyin: 'kè', hanviet: 'Khách' },
  '老': { pinyin: 'lǎo', hanviet: 'Lão' },
  '号': { pinyin: 'hào', hanviet: 'Hiệu' },
  '餐': { pinyin: 'cān', hanviet: 'San' },
  '馆': { pinyin: 'guǎn', hanviet: 'Quán' },
  '品': { pinyin: 'pǐn', hanviet: 'Phẩm' },
  '尝': { pinyin: 'cháng', hanviet: 'Thường' },
  '醋': { pinyin: 'cù', hanviet: 'Thố' },
  '虾': { pinyin: 'xiā', hanviet: 'Hà' },
  '仁': { pinyin: 'rén', hanviet: 'Nhân' },
  '味': { pinyin: 'wèi', hanviet: 'Vị' },
  '酸': { pinyin: 'suān', hanviet: 'Toan' },
  '嫩': { pinyin: 'nèn', hanviet: 'Nộn' },
  '令': { pinyin: 'lìng', hanviet: 'Lệnh' },
  '回': { pinyin: 'huí', hanviet: 'Hồi' },
  '穷': { pinyin: 'qióng', hanviet: 'Cùng' },
  '仅': { pinyin: 'jǐn', hanviet: 'Cận' },
  '领': { pinyin: 'lǐng', hanviet: 'Lãnh' },
  '略': { pinyin: 'lüè', hanviet: 'Lược' },
  '自': { pinyin: 'zì', hanviet: 'Tự' },
  '受': { pinyin: 'shòu', hanviet: 'Thụ' },
  '代': { pinyin: 'dài', hanviet: 'Đại' },
  '通': { pinyin: 'tōng', hanviet: 'Thông' },
  '利': { pinyin: 'lì', hanviet: 'Lợi' }
};

// Gộp từ điển ký tự mở rộng
Object.entries(EXTENDED_COMMON_CHARS || {}).forEach(([k, v]) => {
  if (!COMMON_CHAR_PINYIN_MAP[k] && v) {
    COMMON_CHAR_PINYIN_MAP[k] = { pinyin: v.pinyin, hanviet: v.hanviet };
  }
});

// Nạp thêm từ VOCABULARY_LIST cho các chữ đơn
(VOCABULARY_LIST || []).forEach(v => {
  if (v && v.hanzi && v.hanzi.length === 1 && !COMMON_CHAR_PINYIN_MAP[v.hanzi]) {
    COMMON_CHAR_PINYIN_MAP[v.hanzi] = { pinyin: v.pinyin, hanviet: v.hanviet };
  }
});

// =========================================================================
// 3. TẠO TẬP TỪ ĐIỂN TÁCH TỪ (SEGMENTATION DICTIONARY)
// =========================================================================
// Xây dựng tập từ vựng chuẩn từ VOCABULARY_LIST và các quy tắc từ ghép
const SEGMENTATION_SET = new Set();
const VOCAB_LOOKUP_MAP = new Map();

// Nạp 500 từ cốt lõi
(VOCABULARY_LIST || []).forEach(v => {
  if (v && v.hanzi) {
    SEGMENTATION_SET.add(v.hanzi);
    VOCAB_LOOKUP_MAP.set(v.hanzi, v);
  }
});

// Nạp toàn bộ các từ ghép trong quy tắc từ đa âm
Object.keys(HETERONYM_COMPOUND_RULES).forEach(word => {
  SEGMENTATION_SET.add(word);
});

// Thêm các từ nối & cụm từ giao tiếp thường gặp
[
  '我们', '你们', '他们', '她们', '它们', '大家', '自己', '什么', '怎么', '怎样', 
  '哪里', '哪个', '谁的', '为什么', '多少', '几点', '现在', '今天', '明天', '昨天', 
  '上午', '下午', '晚上', '早晨', '中午', '周末', '去年', '今年', '明年', '星期天', 
  '高兴', '漂亮', '可爱', '热情', '认真', '努力', '非常', '十分', '特别', '更加', 
  '因为', '所以', '虽然', '但是', '如果', '或者', '还是', '而且', '不但', '只有', 
  '只要', '以便', '为了', '从而', '进而', '即使', '不管', '无论', '与其', '不如', 
  '一边', '一起', '一直', '已经', '正在', '将要', '曾经', '马上', '立刻', '渐渐',
  '人工智能', '移动支付', '共享单车', '电子商务', '社交媒体', '气候变化', '绿色发展', 
  '全生命周期', '可持续发展', '道法自然', '形而上学', '知足不辱', '和谐共生',
  '脑机接口', '神经调控', '颠覆性', '临床医疗', '本体论', '意识形态', '哲学反思',
  '现代', '技术', '速度', '跨越', '关于', '人类', '主体', '意识', '哲学', '反思',
  '传统', '文化', '保护', '环境', '经济', '社会', '发展', '生活', '工作', '学习'
].forEach(w => SEGMENTATION_SET.add(w));

// =========================================================================
// 4. THUẬT TOÁN CONTEXT-FIRST ALIGNMENT (XỬ LÝ TOÀN BỘ CÂU TRƯỚC)
// =========================================================================

/**
 * Trích xuất Pinyin của từng ký tự trong câu dựa trên ngữ cảnh toàn câu
 * @param {string} sentence Câu nguyên bản
 * @returns {Array<{ char: string, pinyin: string, hanviet: string, index: number }>}
 */
export function extractContextualPinyinArray(sentence) {
  if (!sentence || typeof sentence !== 'string') return [];
  const chars = Array.from(sentence);
  const n = chars.length;
  
  // Khởi tạo mảng kết quả mặc định
  const result = chars.map((ch, idx) => {
    const isHanzi = /[\u4e00-\u9fa5]/.test(ch);
    const charMeta = COMMON_CHAR_PINYIN_MAP[ch];
    let pinyin = charMeta?.pinyin;
    if (isHanzi && !pinyin) {
      const rad = findRadical(ch);
      pinyin = rad?.pinyin || 'zì';
    }
    return {
      char: ch,
      pinyin: pinyin || (isHanzi ? 'zì' : null),
      hanviet: charMeta?.hanviet || (isHanzi ? 'Tự' : null),
      index: idx
    };
  });

  // Bước 1: Quét các quy tắc từ ghép đa âm (ưu tiên từ dài nhất trước - Longest Match)
  // Sắp xếp các quy tắc theo độ dài giảm dần
  const compoundEntries = Object.entries(HETERONYM_COMPOUND_RULES)
    .sort((a, b) => b[0].length - a[0].length);

  for (const [pattern, pinyinList] of compoundEntries) {
    let startIdx = 0;
    while ((startIdx = sentence.indexOf(pattern, startIdx)) !== -1) {
      const patternChars = Array.from(pattern);
      const patternLen = patternChars.length;
      
      // Ánh xạ Pinyin chuẩn ngữ cảnh vào từng ký tự tương ứng
      for (let i = 0; i < patternLen; i++) {
        if (result[startIdx + i]) {
          result[startIdx + i].pinyin = pinyinList[i];
        }
      }
      startIdx += patternLen;
    }
  }

  // Bước 2: Áp dụng các quy tắc ngữ pháp động
  // Quy tắc 得: [Động từ] + 得 + [Tính từ / Phó từ] -> "de" (Ví dụ: 跑得快, 做得好)
  for (let i = 1; i < n - 1; i++) {
    if (result[i].char === '得') {
      const prevChar = result[i - 1].char;
      const nextChar = result[i + 1].char;
      if (['跑', '走', '吃', '喝', '写', '说', '看', '做', '玩', '跳', '唱', '飞'].includes(prevChar)) {
        result[i].pinyin = 'de';
      } else if (['去', '走', '做', '买', '学', '吃'].includes(nextChar) && !result[i].pinyin) {
        result[i].pinyin = 'děi';
      }
    }
  }

  // Quy tắc 着: [Động từ] + 着 -> "zhe" (Ví dụ: 看着, 听着, 等着)
  for (let i = 1; i < n; i++) {
    if (result[i].char === '着') {
      const prevChar = result[i - 1].char;
      if (['看', '听', '说', '等', '坐', '站', '走', '笑', '拿', '写', '穿', '带'].includes(prevChar)) {
        result[i].pinyin = 'zhe';
      }
    }
  }

  // Quy tắc 地: [Phó từ / Tính từ] + 地 + [Động từ] -> "de" (Ví dụ: 慢慢地, 高兴地)
  for (let i = 1; i < n - 1; i++) {
    if (result[i].char === '地') {
      const prevChar = result[i - 1].char;
      const nextChar = result[i + 1].char;
      if (['慢', '快', '乐', '兴', '真', '静'].includes(prevChar) || /[\u4e00-\u9fa5]/.test(nextChar)) {
        if (!['方', '图', '球', '面', '址', '理'].includes(nextChar)) {
          result[i].pinyin = 'de';
        }
      }
    }
  }

  return result;
}

// =========================================================================
// 5. TÁCH TỪ BẢO TOÀN DẤU CÂU (SEGMENTATION WITH PUNCTUATION PRESERVATION)
// =========================================================================

/**
 * Phân tách câu thành các token từ vựng và dấu câu
 * @param {string} sentence Câu nguyên bản
 * @param {Array} charPinyinArray Mảng Pinyin đã resolve theo ngữ cảnh
 * @returns {Array<Object>} Mảng các token đã làm giàu thông tin
 */
export function segmentSentenceWithPinyin(sentence, charPinyinArray) {
  if (!sentence) return [];
  const chars = Array.from(sentence);
  const n = chars.length;
  const tokens = [];
  let i = 0;

  const MAX_WORD_LEN = 6;

  while (i < n) {
    const ch = chars[i];

    // 1. Khoảng trắng hoặc Xuống dòng
    if (/^\s$/.test(ch)) {
      tokens.push({
        raw: ch,
        type: ch === '\n' ? 'newline' : 'whitespace',
        isChinese: false,
        isPunctuation: false,
        pinyin: ''
      });
      i++;
      continue;
    }

    // 2. Dấu câu tiếng Trung hoặc tiếng Anh
    if (/^[。，！？；：、“”‘’《》（）—…,.!?:;"'()-]$/.test(ch)) {
      tokens.push({
        raw: ch,
        type: 'punctuation',
        isChinese: false,
        isPunctuation: true,
        pinyin: ''
      });
      i++;
      continue;
    }

    // 3. Ký tự không phải chữ Hán (Số, chữ cái Latinh, ký hiệu khác)
    if (!/[\u4e00-\u9fa5]/.test(ch)) {
      let nonHanzi = '';
      while (i < n && !/[\u4e00-\u9fa5]/.test(chars[i]) && !/^\s$/.test(chars[i]) && !/^[。，！？；：、“”‘’《》（）—…,.!?:;"'()-]$/.test(chars[i])) {
        nonHanzi += chars[i];
        i++;
      }
      tokens.push({
        raw: nonHanzi,
        type: 'latin_or_number',
        isChinese: false,
        isPunctuation: false,
        pinyin: nonHanzi
      });
      continue;
    }

    // 4. Ký tự Hán: Tìm từ ghép dài nhất (Forward Maximum Matching)
    let matchedWord = null;
    let matchLen = 1;

    for (let len = Math.min(MAX_WORD_LEN, n - i); len >= 2; len--) {
      const sub = chars.slice(i, i + len).join('');
      if (SEGMENTATION_SET.has(sub)) {
        matchedWord = sub;
        matchLen = len;
        break;
      }
    }

    const wordText = matchedWord || ch;
    const tokenChars = [];
    const tokenPinyins = [];
    const tokenHanviets = [];

    for (let k = 0; k < matchLen; k++) {
      const cMeta = charPinyinArray[i + k] || { char: chars[i + k], pinyin: '', hanviet: '' };
      tokenChars.push(cMeta.char);
      tokenPinyins.push(cMeta.pinyin || '');
      tokenHanviets.push(cMeta.hanviet || '');
    }

    // Tra cứu dữ liệu giàu (Enrichment)
    const localMeta = VOCAB_LOOKUP_MAP.get(wordText);
    const decomp = getHanziDecomposition(wordText[0]);
    const posInfo = tagTokenPos(wordText, localMeta);

    // Xác định cấp HSK mặc định nếu không có trong từ điển cơ bản
    let defaultLevel = 'HSK 1';
    if (matchLen >= 4) {
      defaultLevel = 'HSK 6';
    } else if (matchLen === 3) {
      defaultLevel = 'HSK 5';
    } else if (matchLen === 2) {
      defaultLevel = 'HSK 4';
    } else if (!COMMON_CHAR_PINYIN_MAP[wordText]) {
      defaultLevel = 'HSK 3';
    }

    tokens.push({
      raw: wordText,
      type: 'word',
      isChinese: true,
      isPunctuation: false,
      chars: tokenChars,
      pinyin: tokenPinyins.join(' ').trim(),
      pinyinList: tokenPinyins,
      hanviet: localMeta?.hanviet || tokenHanviets.join(' ').trim(),
      meaningVi: localMeta?.meaning || (matchLen === 1 ? COMMON_CHAR_PINYIN_MAP[wordText]?.meaning || 'Đang cập nhật' : 'Từ ghép tiếng Trung'),
      meaningEn: localMeta?.en || '',
      pos: posInfo.label,
      posCode: posInfo.code,
      posLabel: posInfo.label,
      posColor: posInfo.color,
      level: localMeta?.level || defaultLevel,
      traditional: localMeta?.traditional || wordText,
      decomposition: decomp,
      mnemonic: localMeta?.mnemonic || decomp?.mnemonic || '',
      example: localMeta?.example || null,
      startIndex: i,
      endIndex: i + matchLen
    });

    i += matchLen;
  }

  return tokens;
}

// =========================================================================
// 6. TỪ LOẠI (PART-OF-SPEECH) & NHẬN DIỆN CẤU TRÚC NGỮ PHÁP (GRAMMAR PATTERNS)
// =========================================================================

export const CHINESE_POS_MAP = {
  n: { label: 'Danh từ', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300' },
  v: { label: 'Động từ', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300' },
  adj: { label: 'Tính từ', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300' },
  adv: { label: 'Phó từ', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300' },
  pron: { label: 'Đại từ', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300' },
  prep: { label: 'Giới từ', color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-300' },
  conj: { label: 'Liên từ', color: 'text-pink-600 bg-pink-50 dark:bg-pink-950/40 dark:text-pink-300' },
  m: { label: 'Lượng từ', color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-300' },
  num: { label: 'Số từ', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-300' },
  part: { label: 'Trợ từ', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300' },
  idiom: { label: 'Thành ngữ', color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-300' },
  other: { label: 'Từ vựng', color: 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300' }
};

const PRONOUNS = new Set([
  '我', '你', '您', '他', '她', '它', '我们', '你们', '他们', '她们', '它们',
  '自己', '大家', '谁', '什么', '哪', '哪儿', '哪里', '这', '这儿', '这里',
  '那', '那儿', '那里', '怎么', '怎样', '为什么', '各自', '某人', '彼此'
]);

const CONJUNCTIONS = new Set([
  '和', '跟', '与', '同', '及', '以及', '或者', '还是', '但', '但是', '可是',
  '不过', '虽然', '尽管', '因为', '所以', '因此', '如果', '要是', '只要', '只有',
  '不仅', '不但', '而且', '并且', '接着', '然后', '由于', '哪怕', '既然'
]);

const PREPOSITIONS = new Set([
  '在', '从', '往', '向', '到', '对', '对于', '关于', '给', '比', '被', '叫',
  '让', '把', '替', '为', '为了', '按照', '根据', '沿着', '自从', '通过', '随着'
]);

const PARTICLES = new Set([
  '的', '得', '地', '了', '着', '过', '吗', '呢', '吧', '啊', '呀', '罢', '嘛', '啦'
]);

const ADVERBS = new Set([
  '不', '没', '没有', '很', '非常', '最', '太', '真', '更', '越', '都', '也',
  '还', '再', '又', '就', '刚', '刚才', '正在', '正', '已经', '曾经', '马上',
  '立刻', '常常', '经常', '一直', '总是', '互相', '特别', '极其', '倒', '却',
  '难道', '究竟', '几乎', '大概', '也许', '稍微', '挺', '格外', '分外', '猛然'
]);

const MEASURE_WORDS = new Set([
  '个', '本', '支', '张', '件', '条', '把', '只', '头', '匹', '瓶', '杯', '碗',
  '斤', '公斤', '米', '块', '双', '套', '辆', '架', '栋', '扇', '家', '次', '遍',
  '趟', '顿', '番', '阵', '节', '封', '篇', '群', '股', '所', '口', '名', '份'
]);

/**
 * Gán nhãn từ loại (Part-of-Speech Tagging) cho từ vựng tiếng Trung
 * @param {string} wordText
 * @param {Object} [localMeta]
 */
export function tagTokenPos(wordText, localMeta) {
  if (PRONOUNS.has(wordText)) return { code: 'pron', label: 'Đại từ', color: CHINESE_POS_MAP.pron.color };
  if (CONJUNCTIONS.has(wordText)) return { code: 'conj', label: 'Liên từ', color: CHINESE_POS_MAP.conj.color };
  if (PREPOSITIONS.has(wordText)) return { code: 'prep', label: 'Giới từ', color: CHINESE_POS_MAP.prep.color };
  if (PARTICLES.has(wordText)) return { code: 'part', label: 'Trợ từ', color: CHINESE_POS_MAP.part.color };
  if (ADVERBS.has(wordText)) return { code: 'adv', label: 'Phó từ', color: CHINESE_POS_MAP.adv.color };
  if (MEASURE_WORDS.has(wordText)) return { code: 'm', label: 'Lượng từ', color: CHINESE_POS_MAP.m.color };
  if (/^[零一二两三四五六七八九十百千万亿0-9]+$/.test(wordText)) return { code: 'num', label: 'Số từ', color: CHINESE_POS_MAP.num.color };
  if (wordText.length === 4 && localMeta?.pos?.toLowerCase().includes('thành ngữ')) {
    return { code: 'idiom', label: 'Thành ngữ', color: CHINESE_POS_MAP.idiom.color };
  }

  if (localMeta?.pos) {
    const rawPos = localMeta.pos.toLowerCase();
    if (rawPos.includes('danh') || rawPos === 'n' || rawPos === 'noun') return { code: 'n', label: 'Danh từ', color: CHINESE_POS_MAP.n.color };
    if (rawPos.includes('động') || rawPos === 'v' || rawPos === 'verb') return { code: 'v', label: 'Động từ', color: CHINESE_POS_MAP.v.color };
    if (rawPos.includes('tính') || rawPos === 'adj') return { code: 'adj', label: 'Tính từ', color: CHINESE_POS_MAP.adj.color };
    if (rawPos.includes('phó') || rawPos === 'adv') return { code: 'adv', label: 'Phó từ', color: CHINESE_POS_MAP.adv.color };
    if (rawPos.includes('đại') || rawPos === 'pron') return { code: 'pron', label: 'Đại từ', color: CHINESE_POS_MAP.pron.color };
    if (rawPos.includes('giới') || rawPos === 'prep') return { code: 'prep', label: 'Giới từ', color: CHINESE_POS_MAP.prep.color };
    if (rawPos.includes('liên') || rawPos === 'conj') return { code: 'conj', label: 'Liên từ', color: CHINESE_POS_MAP.conj.color };
    if (rawPos.includes('lượng') || rawPos === 'm') return { code: 'm', label: 'Lượng từ', color: CHINESE_POS_MAP.m.color };
    if (rawPos.includes('thành ngữ') || rawPos === 'idiom') return { code: 'idiom', label: 'Thành ngữ', color: CHINESE_POS_MAP.idiom.color };
    return { code: 'other', label: localMeta.pos, color: CHINESE_POS_MAP.other.color };
  }

  return { code: 'other', label: wordText.length === 1 ? 'Ký tự đơn' : 'Từ ghép', color: CHINESE_POS_MAP.other.color };
}

export const GRAMMAR_PATTERNS_CATALOG = [
  {
    id: 'ba_structure',
    name: 'Câu chữ 把 (Câu xử trí)',
    pattern: /把[^，。！？\n]+[动写做放买搬开关洗扫吃喝打拿扔送到给借修带去回][^，。！？\n]*/g,
    explanation: 'Dùng để nhấn mạnh hành động tác động lên tân ngữ và kết quả tạo ra: S + 把 + O + V + Thành phần khác.',
    level: 'HSK 3'
  },
  {
    id: 'bei_structure',
    name: 'Câu bị động chữ 被',
    pattern: /[被叫让][^，。！？\n]+[打破偷吃骑打丢碎骂骗走开洗抢][^，。！？\n]*/g,
    explanation: 'Diễn tả chủ ngữ chịu tác động mang tính khách quan hoặc kết quả bất lợi: S + 被 (tác nhân) + V + Bổ ngữ.',
    level: 'HSK 3'
  },
  {
    id: 'bi_comparison',
    name: 'Câu so sánh chữ 比',
    pattern: /[^，。！？\n]+比[^，。！？\n]+(快|慢|大|小|多|少|高|矮|贵|便宜|好|漂亮|严重|聪明|远|近|暖和|冷)[^，。！？\n]*/g,
    explanation: 'So sánh mức độ sai khác giữa hai đối tượng A và B: A + 比 + B + Hình dung từ (+ Bổ ngữ mức độ).',
    level: 'HSK 2'
  },
  {
    id: 'bujin_erqie',
    name: 'Cấu trúc tăng tiến (不仅...而且...)',
    pattern: /(不仅|不但)[^。！？\n]+?(而且|还|也)[^。！？\n]*/g,
    explanation: 'Biểu thị quan hệ tăng tiến về ngữ nghĩa: Không những... mà còn...',
    level: 'HSK 3'
  },
  {
    id: 'zhiyao_jiu',
    name: 'Cấu trúc điều kiện đầy đủ (只要...就...)',
    pattern: /只要[^。！？\n]+?就[^。！？\n]*/g,
    explanation: 'Chỉ cần thỏa mãn điều kiện phía trước thì phía sau tất yếu sẽ xảy ra: Chỉ cần... thì...',
    level: 'HSK 3'
  },
  {
    id: 'zhiyou_cai',
    name: 'Cấu trúc điều kiện duy nhất (只有...才...)',
    pattern: /只有[^。！？\n]+?才[^。！？\n]*/g,
    explanation: 'Nhấn mạnh điều kiện duy nhất cần có để đạt được kết quả: Chỉ có... mới...',
    level: 'HSK 4'
  },
  {
    id: 'suiran_danshi',
    name: 'Cấu trúc chuyển ngoặt nhượng bộ (虽然...但是...)',
    pattern: /(虽然|尽管)[^。！？\n]+?(但是|可是|但|却)[^。！？\n]*/g,
    explanation: 'Biểu thị quan hệ nhượng bộ và đối lập ý nghĩa: Tuy rằng... nhưng mà...',
    level: 'HSK 3'
  },
  {
    id: 'yinwei_suoyi',
    name: 'Cấu trúc nguyên nhân - hệ quả (因为...所以...)',
    pattern: /因为[^。！？\n]+?所以[^。！？\n]*/g,
    explanation: 'Chỉ rõ nguyên nhân dẫn tới kết quả tương ứng: Bởi vì... cho nên...',
    level: 'HSK 2'
  },
  {
    id: 'shi_de',
    name: 'Cấu trúc nhấn mạnh 是...的',
    pattern: /是[^，。！？\n]+的/g,
    explanation: 'Nhấn mạnh thời gian, địa điểm, phương thức hoặc đối tượng của một hành động đã diễn ra.',
    level: 'HSK 2'
  },
  {
    id: 'yibian_yibian',
    name: 'Cấu trúc hành động song hành (一边...一边...)',
    pattern: /一边[^，。！？\n]+一边[^，。！？\n]+/g,
    explanation: 'Diễn tả hai động tác hoặc trạng thái cùng diễn ra song song: Vừa... vừa...',
    level: 'HSK 2'
  },
  {
    id: 'yue_lai_yue',
    name: 'Cấu trúc biến đổi mức độ (越来越... / 越...越...)',
    pattern: /越(来)?越[^，。！？\n]+|越[^，。！？\n]+越[^，。！？\n]+/g,
    explanation: 'Diễn tả sự tăng tiến mức độ theo thời gian hoặc theo điều kiện: Càng ngày càng... / Càng... càng...',
    level: 'HSK 2'
  },
  {
    id: 'lian_dou',
    name: 'Cấu trúc nhấn mạnh cực độ (连...都/也...)',
    pattern: /连[^。！？\n]+?(都|也)[^。！？\n]*/g,
    explanation: 'Nhấn mạnh một sự việc cực đoan hoặc hiển nhiên nhất để làm nổi bật mệnh đề sau: Ngay cả... cũng...',
    level: 'HSK 4'
  }
];

/**
 * Trích xuất các mẫu cấu trúc ngữ pháp tiêu biểu trong văn bản
 * @param {string} text
 * @returns {Array<Object>}
 */
export function extractGrammarPatterns(text = '') {
  if (!text || typeof text !== 'string') return [];
  const results = [];
  const seenPatterns = new Set();

  GRAMMAR_PATTERNS_CATALOG.forEach(def => {
    const regex = new RegExp(def.pattern.source, def.pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      const matchedSpan = match[0].trim();
      const key = `${def.id}-${matchedSpan}`;
      if (!seenPatterns.has(key) && matchedSpan.length >= 3) {
        seenPatterns.add(key);
        results.push({
          id: def.id,
          name: def.name,
          matchedText: matchedSpan,
          explanation: def.explanation,
          level: def.level,
          startIndex: match.index,
          endIndex: match.index + matchedSpan.length
        });
      }
    }
  });

  return results.slice(0, 10);
}

/**
 * Tính toán độ khó văn bản (Readability Score) và cấp độ HSK khuyến nghị
 * @param {string} text
 * @param {Array<Object>} allTokens
 * @param {Object} hskStats
 */
export function calculateReadabilityScore(text = '', allTokens = [], hskStats = {}) {
  if (!text || typeof text !== 'string' || allTokens.length === 0) {
    return {
      hskScore: 1.0,
      recommendedLevel: 'HSK 1 - Sơ cấp',
      estimatedReadingTimeMinutes: 1,
      typeTokenRatio: 0,
      avgSentenceLength: 0,
      advancedWordRatio: 0
    };
  }

  const chineseTokens = allTokens.filter(t => t.isChinese);
  const totalTokens = chineseTokens.length;
  if (totalTokens === 0) {
    return {
      hskScore: 1.0,
      recommendedLevel: 'HSK 1 - Sơ cấp',
      estimatedReadingTimeMinutes: 1,
      typeTokenRatio: 0,
      avgSentenceLength: 0,
      advancedWordRatio: 0
    };
  }

  const uniqueWords = new Set(chineseTokens.map(t => t.raw));
  const typeTokenRatio = Math.round((uniqueWords.size / totalTokens) * 100) / 100;

  const sentences = text.split(/[。！？!?\n]+/).filter(s => s.trim().length > 0);
  const totalChars = chineseTokens.reduce((sum, t) => sum + t.raw.length, 0);
  const avgSentenceLength = sentences.length > 0 ? Math.round(totalChars / sentences.length) : totalChars;

  let weightedSum = 0;
  let weightedCount = 0;
  let advancedWords = 0;

  const LEVEL_WEIGHTS = {
    'HSK 1': 1.0,
    'HSK 2': 2.0,
    'HSK 3': 3.0,
    'HSK 4': 4.0,
    'HSK 5': 5.0,
    'HSK 6': 6.0,
    'HSK 5-6': 5.5,
    'HSK 3-4': 3.5,
    'HSK 1-2': 1.5
  };

  chineseTokens.forEach(t => {
    let w = LEVEL_WEIGHTS[t.level];
    if (!w) {
      const levelStr = String(t.level || '');
      if (levelStr.includes('6')) w = 6.0;
      else if (levelStr.includes('5')) w = 5.0;
      else if (levelStr.includes('4')) w = 4.0;
      else if (levelStr.includes('3')) w = 3.0;
      else if (levelStr.includes('2')) w = 2.0;
      else if (t.raw.length >= 2) w = 4.5;
      else w = 1.0;
    }
    weightedSum += w;
    weightedCount += 1;
    if (w >= 3.5) advancedWords += 1;
  });

  const rawScore = weightedCount > 0 ? weightedSum / weightedCount : 1.0;
  const sentenceComplexityBonus = avgSentenceLength > 25 ? 0.3 : 0;
  const advancedRatio = totalTokens > 0 ? advancedWords / totalTokens : 0;
  const advancedBonus = advancedRatio * 1.2;

  const hskScore = Math.min(6.0, Math.max(1.0, Math.round((rawScore + sentenceComplexityBonus + advancedBonus) * 10) / 10));

  let recommendedLevel = 'HSK 1 - Sơ cấp';
  if (hskScore >= 5.2) recommendedLevel = 'HSK 6 - Cao cấp chuyên sâu';
  else if (hskScore >= 4.2) recommendedLevel = 'HSK 5 - Cao cấp ứng dụng';
  else if (hskScore >= 3.2) recommendedLevel = 'HSK 4 - Trung cấp nâng cao';
  else if (hskScore >= 2.2) recommendedLevel = 'HSK 3 - Trung cấp';
  else if (hskScore >= 1.5) recommendedLevel = 'HSK 2 - Sơ cấp nâng cao';

  const estimatedReadingTimeMinutes = Math.max(1, Math.ceil(totalChars / 150));

  return {
    hskScore,
    recommendedLevel,
    estimatedReadingTimeMinutes,
    typeTokenRatio,
    avgSentenceLength,
    advancedWordRatio: Math.round(advancedRatio * 100)
  };
}

const STOP_WORDS = new Set([
  '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个',
  '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好',
  '自己', '这', '那', '我们', '他们', '她们', '它', '把', '被', '让', '给', '从',
  '地', '得', '过', '吗', '呢', '吧', '啊', '呀', '但', '但是', '因为', '所以'
]);

/**
 * Trích xuất từ khóa chủ đạo và thành ngữ 4 chữ trong bài
 * @param {string} text
 * @param {Array<Object>} allTokens
 */
export function extractKeyTermsAndChengyu(text = '', allTokens = []) {
  const chineseTokens = allTokens.filter(t => t.isChinese);
  const freqMap = new Map();
  const chengyuList = [];
  const seenChengyu = new Set();

  chineseTokens.forEach(t => {
    if (t.raw.length === 4 && (t.pos === 'Thành ngữ' || t.level === 'HSK 5' || t.level === 'HSK 6' || /[\u4e00-\u9fa5]{4}/.test(t.raw))) {
      if (t.meaningVi && t.meaningVi !== 'Từ ghép tiếng Trung' && !seenChengyu.has(t.raw)) {
        seenChengyu.add(t.raw);
        chengyuList.push({
          hanzi: t.raw,
          pinyin: t.pinyin,
          meaning: t.meaningVi,
          level: t.level
        });
      }
    }

    if (t.raw.length >= 2 && !STOP_WORDS.has(t.raw)) {
      const current = freqMap.get(t.raw) || { count: 0, token: t };
      current.count += 1;
      freqMap.set(t.raw, current);
    }
  });

  const sortedKeywords = Array.from(freqMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map(item => ({
      hanzi: item.token.raw,
      pinyin: item.token.pinyin,
      meaning: item.token.meaningVi,
      level: item.token.level,
      pos: item.token.posLabel || item.token.pos,
      frequency: item.count
    }));

  return {
    topKeywords: sortedKeywords,
    chengyuList: chengyuList.slice(0, 5)
  };
}

/**
 * Trích xuất tóm tắt ý chính của bài đọc (Extractive Summarization)
 * @param {string} text
 * @param {Array<Object>} keyTerms
 */
export function generateExtractiveSummary(text = '', keyTerms = []) {
  if (!text || typeof text !== 'string') return '';
  const sentences = text
    .split(/(?<=[。！？!?\n])/)
    .map(s => s.trim())
    .filter(s => s.length >= 8 && /[\u4e00-\u9fa5]/.test(s));

  if (sentences.length <= 2) return sentences.join(' ');

  const keywordSet = new Set(keyTerms.map(k => k.hanzi));

  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0;
    if (index === 0) score += 3;
    keywordSet.forEach(kw => {
      if (sentence.includes(kw)) score += 2;
    });
    if (sentence.length >= 15 && sentence.length <= 50) score += 1;
    return { sentence, score, index };
  });

  const top2 = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .sort((a, b) => a.index - b.index);

  return top2.map(item => item.sentence).join(' ');
}

// =========================================================================
// 7. PHÂN TÍCH TOÀN BỘ ĐOẠN VĂN (FULL TEXT ANALYZER)
// =========================================================================

/**
 * Phân tích toàn diện một đoạn văn tiếng Trung
 * @param {string} text Đoạn văn người dùng nhập hoặc bài đọc HSK
 * @returns {Object} Kết quả phân tích có cấu trúc
 */
export function analyzeChineseText(text = '') {
  if (!text || typeof text !== 'string') {
    return {
      paragraphs: [],
      stats: { 
        totalChars: 0, 
        chineseChars: 0, 
        wordCount: 0, 
        hskStats: {},
        readability: { hskScore: 1.0, recommendedLevel: 'HSK 1 - Sơ cấp', estimatedReadingTimeMinutes: 1, typeTokenRatio: 0, avgSentenceLength: 0, advancedWordRatio: 0 },
        grammarPatterns: [],
        keyTerms: { topKeywords: [], chengyuList: [] },
        summary: ''
      },
      readability: { hskScore: 1.0, recommendedLevel: 'HSK 1 - Sơ cấp', estimatedReadingTimeMinutes: 1, estimatedReadingMinutes: 1, typeTokenRatio: 0, ttr: 0, avgSentenceLength: 0, advancedWordRatio: 0 },
      tokens: [],
      allTokens: [],
      grammarPatterns: [],
      keyTerms: { topKeywords: [], chengyuList: [] },
      summary: ''
    };
  }

  // Tách thành các đoạn văn theo dấu xuống dòng
  const rawParagraphs = text.split(/\r?\n/);
  const paragraphs = [];
  let totalChars = 0;
  let chineseChars = 0;
  let totalWords = 0;
  const hskStats = { 'HSK 1': 0, 'HSK 2': 0, 'HSK 3': 0, 'HSK 4': 0, 'HSK 5': 0, 'HSK 6': 0, 'Khác': 0 };

  rawParagraphs.forEach((pText, pIndex) => {
    if (!pText.trim()) {
      paragraphs.push({ id: `p-${pIndex}`, isEmpty: true, tokens: [] });
      return;
    }

    totalChars += pText.length;
    // 1. Trích xuất Pinyin theo ngữ cảnh cả đoạn
    const charPinyinArray = extractContextualPinyinArray(pText);
    
    // 2. Tách từ bảo toàn dấu câu
    const tokens = segmentSentenceWithPinyin(pText, charPinyinArray);

    tokens.forEach(tok => {
      if (tok.isChinese) {
        chineseChars += tok.raw.length;
        totalWords += 1;
        const lvl = tok.level || 'Khác';
        if (hskStats[lvl] !== undefined) {
          hskStats[lvl] += 1;
        } else {
          hskStats['Khác'] += 1;
        }
      }
    });

    paragraphs.push({
      id: `p-${pIndex}`,
      rawText: pText,
      isEmpty: false,
      tokens: tokens
    });
  });

  const allTokens = paragraphs.flatMap(p => p.tokens);
  const grammarPatterns = extractGrammarPatterns(text);
  const readability = calculateReadabilityScore(text, allTokens, hskStats);
  const keyTermsResult = extractKeyTermsAndChengyu(text, allTokens);
  const summary = generateExtractiveSummary(text, keyTermsResult.topKeywords);

  // Normalize aliases for readability metrics
  readability.estimatedReadingMinutes = readability.estimatedReadingTimeMinutes || 1;
  readability.ttr = readability.typeTokenRatio !== undefined ? Number(readability.typeTokenRatio.toFixed(2)) : 0;

  return {
    paragraphs,
    tokens: allTokens,
    allTokens,
    stats: {
      totalChars,
      chineseChars,
      wordCount: totalWords,
      hskStats,
      readability,
      grammarPatterns,
      keyTerms: keyTermsResult,
      summary
    },
    readability,
    grammarPatterns,
    keyTerms: keyTermsResult,
    summary
  };
}
