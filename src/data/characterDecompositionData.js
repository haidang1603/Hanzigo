/**
 * =========================================================================
 * HANZIGO - CHARACTER DECOMPOSITION, STRUCTURE & ETYMOLOGY DATASET
 * =========================================================================
 * Cung cấp:
 * 1. Phân loại cấu trúc chữ Hán (Tả hữu, Thượng hạ, Bao vi, Đơn thể, v.v.)
 * 2. Thành phần cấu tạo chữ (Components / IDS - Ideographic Description Sequence)
 * 3. Cặp Giản thể ↔ Phồn thể chuẩn xác
 * 4. Nhóm chữ dễ gây nhầm lẫn (Confusing pairs / Lookalikes) kèm mẹo phân biệt
 * =========================================================================
 */

export const STRUCTURE_TYPES = {
  SINGLE: { code: 'single', name: 'Đơn thể (独体字)', symbol: '◰', desc: 'Chữ đơn nhất, không chia tách thành phần' },
  LEFT_RIGHT: { code: 'left_right', name: 'Tả hữu (左右结构)', symbol: '⿰', desc: 'Ghép hai phần trái - phải' },
  LEFT_MID_RIGHT: { code: 'left_mid_right', name: 'Tả trung hữu (左中右结构)', symbol: '⿲', desc: 'Ghép ba phần song song trái - giữa - phải' },
  TOP_BOTTOM: { code: 'top_bottom', name: 'Thượng hạ (上下结构)', symbol: '⿱', desc: 'Ghép hai phần trên - dưới' },
  TOP_MID_BOTTOM: { code: 'top_mid_bottom', name: 'Thượng trung hạ (上中下结构)', symbol: '⿳', desc: 'Ghép ba phần tầng trên - giữa - dưới' },
  FULL_ENCLOSURE: { code: 'full_enclosure', name: 'Toàn bao vi (全包围结构)', symbol: '⿴', desc: 'Khung khép kín bao bọc hoàn toàn bên trong' },
  SEMI_ENCLOSURE_TOP_LEFT: { code: 'semi_top_left', name: 'Bán bao vi trên-trái (左上包围)', symbol: '⿸', desc: 'Ôm từ góc trên bên trái' },
  SEMI_ENCLOSURE_TOP_RIGHT: { code: 'semi_top_right', name: 'Bán bao vi trên-phải (右上包围)', symbol: '⿹', desc: 'Ôm từ góc trên bên phải' },
  SEMI_ENCLOSURE_BOTTOM_LEFT: { code: 'semi_bottom_left', name: 'Bán bao vi dưới-trái (左下包围)', symbol: '⿺', desc: 'Bộ quai sước hoặc tẩu ôm bên dưới' },
  SEMI_ENCLOSURE_U: { code: 'semi_u', name: 'Bán bao vi ba phía (下/上三包围)', symbol: '⿶', desc: 'Bao ba mặt, hở một mặt' },
  OVERLAPPING: { code: 'overlapping', name: 'Phẩm tự (品字形结构)', symbol: '品', desc: 'Ba chữ đồng dạng xếp hình tam giác' }
};

// Cơ sở dữ liệu chiết tự và thành phần chữ Hán thông dụng
export const CHARACTER_DECOMPOSITION_DICT = {
  '你': {
    structure: STRUCTURE_TYPES.LEFT_RIGHT,
    components: [
      { char: '亻', role: 'meaning', name: 'Bộ Nhân đứng', meaning: 'Chỉ con người, đối tượng giao tiếp' },
      { char: '尔', role: 'sound', name: 'Chữ Nhĩ', meaning: 'Đại từ chỉ anh/ngươi (vừa gợi âm vừa gợi nghĩa)' }
    ],
    traditional: '你',
    etymologyType: 'Hình thanh kết hợp Hội ý (形声兼会意)',
    mnemonicStory: 'Con người (亻) đối diện trực tiếp trò chuyện cùng bạn (尔).'
  },
  '好': {
    structure: STRUCTURE_TYPES.LEFT_RIGHT,
    components: [
      { char: '女', role: 'meaning', name: 'Bộ Nữ', meaning: 'Người phụ nữ, người mẹ' },
      { char: '子', role: 'meaning', name: 'Chữ Tử', meaning: 'Đứa con, con nhỏ' }
    ],
    traditional: '好',
    etymologyType: 'Hội ý (会意)',
    mnemonicStory: 'Người phụ nữ (女) bồng ẵm đứa con (子) khỏe mạnh là điều tốt lành, trọn vẹn nhất (好).'
  },
  '我': {
    structure: STRUCTURE_TYPES.SINGLE,
    components: [
      { char: '手', role: 'meaning', name: 'Bàn tay biến thể', meaning: 'Cầm nắm, điều khiển' },
      { char: '戈', role: 'meaning', name: 'Bộ Qua (binh khí)', meaning: 'Binh khí cổ, bảo vệ bản thân' }
    ],
    traditional: '我',
    etymologyType: 'Tượng hình & Hội ý cổ (会意)',
    mnemonicStory: 'Bàn tay cầm vũ khí (戈) tự vệ khẳng định quyền làm chủ và cái tôi (我).'
  },
  '他': {
    structure: STRUCTURE_TYPES.LEFT_RIGHT,
    components: [
      { char: '亻', role: 'meaning', name: 'Bộ Nhân đứng', meaning: 'Chỉ người' },
      { char: '也', role: 'sound', name: 'Chữ Dã', meaning: 'Trợ từ "cũng", biểu thị đối tượng khác' }
    ],
    traditional: '他',
    etymologyType: 'Hình thanh (形声)',
    mnemonicStory: 'Người đàn ông (亻) cũng (也) là một người bạn cùng trang lứa.'
  },
  '她': {
    structure: STRUCTURE_TYPES.LEFT_RIGHT,
    components: [
      { char: '女', role: 'meaning', name: 'Bộ Nữ', meaning: 'Chỉ người nữ' },
      { char: '也', role: 'sound', name: 'Chữ Dã', meaning: 'Trợ từ' }
    ],
    traditional: '她',
    etymologyType: 'Hình thanh (形声)',
    mnemonicStory: 'Người phụ nữ (女) duyên dáng bên cạnh ta.'
  },
  '学': {
    structure: STRUCTURE_TYPES.TOP_BOTTOM,
    components: [
      { char: '𦥯', role: 'meaning', name: 'Nửa trên (Hào + Miên)', meaning: 'Tri thức khai sáng dưới mái nhà' },
      { char: '子', role: 'meaning', name: 'Chữ Tử', meaning: 'Con trẻ, học trò' }
    ],
    traditional: '學',
    etymologyType: 'Hội ý (会意)',
    mnemonicStory: 'Con trẻ (子) mở rộng tầm mắt học tập kiến thức dưới mái trường.'
  },
  '生': {
    structure: STRUCTURE_TYPES.SINGLE,
    components: [
      { char: '生', role: 'root', name: 'Đơn thể tượng hình', meaning: 'Cây cỏ đâm chồi từ mặt đất' }
    ],
    traditional: '生',
    etymologyType: 'Tượng hình (象形)',
    mnemonicStory: 'Hình ảnh mầm cây vươn lên từ lòng đất mang lại sức sống mới.'
  },
  '国': {
    structure: STRUCTURE_TYPES.FULL_ENCLOSURE,
    components: [
      { char: '囗', role: 'meaning', name: 'Bộ Vi', meaning: 'Bờ cõi biên cương bao quanh bảo vệ' },
      { char: '玉', role: 'meaning', name: 'Chữ Ngọc', meaning: 'Ngọc ngà châu báu, của cải nhân dân' }
    ],
    traditional: '國',
    etymologyType: 'Hội ý (会意)',
    mnemonicStory: 'Biên giới thành quách (囗) bao bọc viên ngọc quý (玉) chính là đất nước (国).'
  },
  '家': {
    structure: STRUCTURE_TYPES.TOP_BOTTOM,
    components: [
      { char: '宀', role: 'meaning', name: 'Bộ Miên', meaning: 'Mái nhà che mưa che nắng' },
      { char: '豕', role: 'meaning', name: 'Bộ Thỉ (con heo)', meaning: 'Vật nuôi tượng trưng cho sự ấm no, tài sản' }
    ],
    traditional: '家',
    etymologyType: 'Hội ý (会意)',
    mnemonicStory: 'Dưới mái nhà (宀) có nuôi đàn gia súc (豕) chính là mái ấm gia đình no đủ (家).'
  },
  '水': {
    structure: STRUCTURE_TYPES.SINGLE,
    components: [
      { char: '水', role: 'root', name: 'Đơn thể tượng hình', meaning: 'Dòng sông uốn lượn kèm giọt nước' }
    ],
    traditional: '水',
    etymologyType: 'Tượng hình (象形)',
    mnemonicStory: 'Dòng nước chảy cuồn cuộn ở giữa và những giọt bọt nước văng hai bên.'
  },
  '茶': {
    structure: STRUCTURE_TYPES.TOP_MID_BOTTOM,
    components: [
      { char: '艹', role: 'meaning', name: 'Bộ Thảo', meaning: 'Lá cây, ngọn cỏ' },
      { char: '人', role: 'meaning', name: 'Chữ Nhân', meaning: 'Con người chăm bón thu hái' },
      { char: '木', role: 'meaning', name: 'Bộ Mộc', meaning: 'Thân cây gỗ' }
    ],
    traditional: '茶',
    etymologyType: 'Hội ý (会意)',
    mnemonicStory: 'Lá cây cỏ (艹) được con người (人) hái từ trên cây chè (木) đem pha thành nước trà.'
  },
  '语': {
    structure: STRUCTURE_TYPES.LEFT_RIGHT,
    components: [
      { char: '讠', role: 'meaning', name: 'Bộ Ngôn', meaning: 'Lời nói, ngôn ngữ' },
      { char: '吾', role: 'sound', name: 'Chữ Ngô (Ngũ 五 + Khẩu 口)', meaning: 'Bản thân tôi (gợi âm đọc yǔ)' }
    ],
    traditional: '語',
    etymologyType: 'Hình thanh (形声)',
    mnemonicStory: 'Lời nói (讠) xuất phát từ tấm lòng của chính bản thân mình (吾).'
  },
  '汉': {
    structure: STRUCTURE_TYPES.LEFT_RIGHT,
    components: [
      { char: '氵', role: 'meaning', name: 'Bộ Thủy (ba chấm thủy)', meaning: 'Dòng sông Hán Thủy' },
      { char: '又', role: 'sound', name: 'Chữ Hựu', meaning: 'Bàn tay nắm, biến thể giản hóa từ 𦰌' }
    ],
    traditional: '漢',
    etymologyType: 'Hình thanh (形声)',
    mnemonicStory: 'Dòng sông Hán Thủy (氵) nơi khởi nguồn văn minh tộc Hán rực rỡ.'
  },
  '字': {
    structure: STRUCTURE_TYPES.TOP_BOTTOM,
    components: [
      { char: '宀', role: 'meaning', name: 'Bộ Miên', meaning: 'Mái nhà giáo dục' },
      { char: '子', role: 'sound', name: 'Chữ Tử', meaning: 'Con cái, sinh sôi (gợi âm zì)' }
    ],
    traditional: '字',
    etymologyType: 'Hội ý & Hình thanh (形声兼会意)',
    mnemonicStory: 'Chữ viết (字) như những đứa con (子) được sinh sôi bồi đắp không ngừng dưới mái nhà (宀).'
  },
  '写': {
    structure: STRUCTURE_TYPES.TOP_BOTTOM,
    components: [
      { char: '冖', role: 'meaning', name: 'Bộ Mịch', meaning: 'Khăn phủ che' },
      { char: '与', role: 'sound', name: 'Chữ Dữ', meaning: 'Giản thể hóa từ dạng phồn thể 寫' }
    ],
    traditional: '寫',
    etymologyType: 'Hình thanh giản hóa',
    mnemonicStory: 'Đặt bút nắn nót viết từng nét chữ trọn vẹn lên trang giấy.'
  },
  '道': {
    structure: STRUCTURE_TYPES.SEMI_ENCLOSURE_BOTTOM_LEFT,
    components: [
      { char: '辶', role: 'meaning', name: 'Bộ Quai sước', meaning: 'Bước chân di chuyển trên đường' },
      { char: '首', role: 'sound', name: 'Chữ Thủ (cái đầu)', meaning: 'Tư tưởng dẫn đường (gợi âm dào)' }
    ],
    traditional: '道',
    etymologyType: 'Hội ý & Hình thanh',
    mnemonicStory: 'Cái đầu (首) dẫn dắt bước chân vững vàng (辶) trên con đường chính đạo.'
  },
  '钱': {
    structure: STRUCTURE_TYPES.LEFT_RIGHT,
    components: [
      { char: '钅', role: 'meaning', name: 'Bộ Kim', meaning: 'Kim loại, vàng bạc' },
      { char: '戋', role: 'sound', name: 'Chữ Tàn', meaning: 'Binh khí nhỏ, gợi âm qián' }
    ],
    traditional: '錢',
    etymologyType: 'Hình thanh (形声)',
    mnemonicStory: 'Tiền bạc đúc bằng kim loại quý (钅), ai nấy đều tích cóp gìn giữ.'
  },
  '吃': {
    structure: STRUCTURE_TYPES.LEFT_RIGHT,
    components: [
      { char: '口', role: 'meaning', name: 'Bộ Khẩu', meaning: 'Miệng, dùng để ăn uống' },
      { char: '乞', role: 'sound', name: 'Chữ Khất (cầu xin)', meaning: 'Gợi âm chī' }
    ],
    traditional: '吃',
    etymologyType: 'Hình thanh (形声)',
    mnemonicStory: 'Dùng miệng (口) để thưởng thức các món ăn ngon.'
  },
  '喝': {
    structure: STRUCTURE_TYPES.LEFT_RIGHT,
    components: [
      { char: '口', role: 'meaning', name: 'Bộ Khẩu', meaning: 'Cái miệng' },
      { char: '曷', role: 'sound', name: 'Chữ Hạt', meaning: 'Gợi âm hē' }
    ],
    traditional: '喝',
    etymologyType: 'Hình thanh (形声)',
    mnemonicStory: 'Dùng miệng (口) đón lấy dòng nước mát lành lúc khát.'
  },
  '看': {
    structure: STRUCTURE_TYPES.TOP_BOTTOM,
    components: [
      { char: '手', role: 'meaning', name: 'Bộ Thủ (bàn tay khum che)', meaning: 'Khum tay trên trán' },
      { char: '目', role: 'meaning', name: 'Bộ Mục (con mắt)', meaning: 'Ánh mắt hướng ra xa' }
    ],
    traditional: '看',
    etymologyType: 'Hội ý (会意)',
    mnemonicStory: 'Đặt bàn tay (手) che nắng trên mắt (目) để phóng tầm mắt nhìn ra xa (看).'
  },
  '听': {
    structure: STRUCTURE_TYPES.LEFT_RIGHT,
    components: [
      { char: '口', role: 'meaning', name: 'Bộ Khẩu', meaning: 'Miệng hoặc giác quan mở' },
      { char: '斤', role: 'sound', name: 'Chữ Cân', meaning: 'Gợi âm tīng' }
    ],
    traditional: '聽',
    etymologyType: 'Hình thanh giản hóa',
    mnemonicStory: 'Lắng nghe từng lời nói truyền cảm xúc qua thanh âm.'
  },
  '说': {
    structure: STRUCTURE_TYPES.LEFT_RIGHT,
    components: [
      { char: '讠', role: 'meaning', name: 'Bộ Ngôn', meaning: 'Lời nói' },
      { char: '兑', role: 'sound', name: 'Chữ Đoái (quẻ Đoái vui vẻ)', meaning: 'Gợi âm shuō' }
    ],
    traditional: '說',
    etymologyType: 'Hình thanh (形声)',
    mnemonicStory: 'Dùng lời nói (讠) chân thành truyền đạt niềm vui (兑) cho mọi người.'
  },
  '想': {
    structure: STRUCTURE_TYPES.TOP_BOTTOM,
    components: [
      { char: '相', role: 'sound', name: 'Chữ Tương', meaning: 'Gợi âm xiǎng' },
      { char: '心', role: 'meaning', name: 'Bộ Tâm', meaning: 'Trái tim, tình cảm, nỗi nhớ' }
    ],
    traditional: '想',
    etymologyType: 'Hình thanh (形声)',
    mnemonicStory: 'Nỗi nhớ thương và suy tư nảy sinh từ nơi sâu thẳm trong trái tim (心).'
  },
  '做': {
    structure: STRUCTURE_TYPES.LEFT_MID_RIGHT,
    components: [
      { char: '亻', role: 'meaning', name: 'Bộ Nhân đứng', meaning: 'Con người hành động' },
      { char: '故', role: 'sound', name: 'Chữ Cố (Cổ 古 + Phộc 攵)', meaning: 'Gợi âm zuò' }
    ],
    traditional: '做',
    etymologyType: 'Hình thanh (形声)',
    mnemonicStory: 'Con người (亻) không ngừng lao động tạo ra công việc và thành quả (做).'
  }
};

// Danh mục cặp chữ Hán dễ nhầm lẫn (Confusing Character Pairs / Lookalikes)
export const CONFUSING_CHARACTER_PAIRS = [
  {
    pair: ['己', '已', '巳'],
    title: 'Bộ ba Kỷ - Dĩ - Tỵ',
    distinction: 'Phân biệt dựa vào độ hở của nét gập: 己 hở hoàn toàn, 已 thò lên nửa, 巳 đóng kín mít.',
    mnemonic: 'Kỷ (己) mở toang hoác, Dĩ (已) nửa vời, Tỵ (巳) đóng kín mít.',
    details: [
      { char: '己', pinyin: 'jǐ', hanviet: 'Kỷ', meaning: 'Bản thân mình (tự kỷ, tri kỷ)' },
      { char: '已', pinyin: 'yǐ', hanviet: 'Dĩ', meaning: 'Đã, xong rồi (đã rồi, dĩ vãng)' },
      { char: '巳', pinyin: 'sì', hanviet: 'Tỵ', meaning: 'Can chi giờ Tỵ (9h-11h sáng), con rắn' }
    ]
  },
  {
    pair: ['未', '末'],
    title: 'Vị (Chưa) và Mạt (Ngọn/Cuối)',
    distinction: 'Khác nhau ở độ dài hai nét ngang: 未 có nét ngang trên NGẮN, ngang dưới DÀI. 末 có nét ngang trên DÀI, ngang dưới NGẮN.',
    mnemonic: 'Chưa tới (未) thì đầu ngắn, đến đoạn cuối/ngọn cây (末) thì tán lá trên xòe dài.',
    details: [
      { char: '未', pinyin: 'wèi', hanviet: 'Vị', meaning: 'Chưa (tương lai, vị tất)' },
      { char: '末', pinyin: 'mò', hanviet: 'Mạt', meaning: 'Cuối cùng, ngọn cỏ (cuối tuần, mạt vận)' }
    ]
  },
  {
    pair: ['晴', '睛'],
    title: 'Tình (Trời trong) và Tròng mắt (Tình)',
    distinction: 'Nhìn bộ thủ bên trái: 晴 có bộ Nhật (日 - mặt trời nắng ráo), 睛 có bộ Mục (目 - con mắt nhìn).',
    mnemonic: 'Mặt trời (日) lên thì trời tạnh nắng (晴), mắt (目) sáng thì thấy rõ con ngươi (睛).',
    details: [
      { char: '晴', pinyin: 'qíng', hanviet: 'Tình', meaning: 'Trời quang đãng, tạnh ráo, có nắng' },
      { char: '睛', pinyin: 'jīng', hanviet: 'Tình', meaning: 'Tròng mắt, con ngươi (mắt: 眼睛)' }
    ]
  },
  {
    pair: ['乌', '鸟'],
    title: 'Ô (Quạ đen) và Điểu (Con chim)',
    distinction: 'Chữ 乌 KHÔNG có dấu chấm ở giữa, chữ 鸟 CÓ dấu chấm (tượng trưng mắt chim).',
    mnemonic: 'Quạ đen (乌) toàn thân đen tuyền không thấy rõ mắt, chim (鸟) thường có mắt sáng long lanh.',
    details: [
      { char: '乌', pinyin: 'wū', hanviet: 'Ô', meaning: 'Con quạ, màu đen, tối tăm' },
      { char: '鸟', pinyin: 'niǎo', hanviet: 'Điểu', meaning: 'Loài chim' }
    ]
  },
  {
    pair: ['刀', '力'],
    title: 'Đao (Con dao) và Lực (Sức mạnh)',
    distinction: 'Nét phẩy của 刀 không thò lên đầu, nét phẩy của 力 thò xuyên qua nét ngang móc.',
    mnemonic: 'Dao bén (刀) giữ nguyên bao, sức mạnh (力) vươn cao xuyên phá.',
    details: [
      { char: '刀', pinyin: 'dāo', hanviet: 'Đao', meaning: 'Con dao, vũ khí chém' },
      { char: '力', pinyin: 'lì', hanviet: 'Lực', meaning: 'Sức lực, công lực' }
    ]
  },
  {
    pair: ['买', '卖'],
    title: 'Mãi (Mua) và Mại (Bán)',
    distinction: 'Chữ 卖 (Bán) có thêm chữ Thập (十) trên đầu so với 买 (Mua).',
    mnemonic: 'Người bán (卖) có thêm hàng hóa (十) mới đem bán được cho người mua (买).',
    details: [
      { char: '买', pinyin: 'mǎi', hanviet: 'Mãi', meaning: 'Mua (thanh 3)' },
      { char: '卖', pinyin: 'mài', hanviet: 'Mại', meaning: 'Bán (thanh 4)' }
    ]
  }
];

/**
 * Tra cứu thông tin phân rã cấu trúc chữ
 */
export function getCharacterDecomposition(char) {
  if (!char || typeof char !== 'string') return null;
  const singleChar = Array.from(char)[0];
  return CHARACTER_DECOMPOSITION_DICT[singleChar] || null;
}

/**
 * Tìm các chữ dễ nhầm của một chữ cụ thể nếu có
 */
export function getConfusingPairForChar(char) {
  if (!char) return null;
  const singleChar = Array.from(char)[0];
  return CONFUSING_CHARACTER_PAIRS.find(p => p.pair.includes(singleChar)) || null;
}
