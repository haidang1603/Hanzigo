/**
 * =========================================================================
 * HANZIGO — CHINESE CHARACTER IDS DECOMPOSITION DATASET
 * =========================================================================
 * Cung cấp:
 * 1. Ký hiệu kết cấu hình học chuẩn ISO/IEC 10646 IDS:
 *    ⿰ (Tả Hữu), ⿱ (Thượng Hạ), ⿲ (Tả Trung Hữu), ⿳ (Thượng Trung Hạ),
 *    ⿴ (Toàn Bao Vi), ⿵ (Bao hở dưới), ⿶ (Bao hở trên), ⿷ (Bao hở phải),
 *    ⿸ (Bao trên-trái), ⿹ (Bao trên-phải), ⿺ (Bao dưới-trái), ⿻ (Đan xen),
 *    品 (Phẩm tự), ◰ (Đơn thể).
 * 2. Cây phân rã thành phần bộ thủ (Components) & Mẹo nhớ chiết tự sư phạm.
 * 3. Hàm tra cứu thông minh getHanziDecomposition(char).
 * =========================================================================
 */

import { findRadical } from './radicalsData.js';

export const IDS_STRUCTURE_TYPES = {
  SINGLE: { code: 'single', name: 'Đơn thể (独体字)', symbol: '◰', desc: 'Chữ đơn nhất, không chia tách thành phần' },
  LEFT_RIGHT: { code: 'left_right', name: 'Tả hữu (左右结构)', symbol: '⿰', desc: 'Ghép hai phần trái - phải' },
  LEFT_MID_RIGHT: { code: 'left_mid_right', name: 'Tả trung hữu (左中右结构)', symbol: '⿲', desc: 'Ghép ba phần song song trái - giữa - phải' },
  TOP_BOTTOM: { code: 'top_bottom', name: 'Thượng hạ (上下结构)', symbol: '⿱', desc: 'Ghép hai phần trên - dưới' },
  TOP_MID_BOTTOM: { code: 'top_mid_bottom', name: 'Thượng trung hạ (上中下结构)', symbol: '⿳', desc: 'Ghép ba phần tầng trên - giữa - dưới' },
  FULL_ENCLOSURE: { code: 'full_enclosure', name: 'Toàn bao vi (全包围结构)', symbol: '⿴', desc: 'Khung khép kín bao bọc hoàn toàn bên trong' },
  SEMI_ENCLOSURE_TOP_LEFT: { code: 'semi_top_left', name: 'Bán bao vi trên-trái (左上包围)', symbol: '⿸', desc: 'Khung ôm từ góc trên bên trái' },
  SEMI_ENCLOSURE_TOP_RIGHT: { code: 'semi_top_right', name: 'Bán bao vi trên-phải (右上包围)', symbol: '⿹', desc: 'Khung ôm từ góc trên bên phải' },
  SEMI_ENCLOSURE_BOTTOM_LEFT: { code: 'semi_bottom_left', name: 'Bán bao vi dưới-trái (左下包围)', symbol: '⿺', desc: 'Bộ quai sước hoặc tẩu ôm bên dưới' },
  SEMI_ENCLOSURE_U: { code: 'semi_u', name: 'Bán bao vi ba phía (下/上三包围)', symbol: '⿶', desc: 'Bao ba mặt, hở một mặt' },
  SEMI_ENCLOSURE_DOWN: { code: 'semi_down', name: 'Bán bao vi hở dưới (下三包围)', symbol: '⿵', desc: 'Bao trên và hai bên, hở phía dưới' },
  OVERLAPPING: { code: 'overlapping', name: 'Đan xen lồng ghép (镶嵌结构)', symbol: '⿻', desc: 'Các nét đan xen, lồng vào nhau' },
  TRIANGLE: { code: 'triangle', name: 'Phẩm tự (品字形结构)', symbol: '品', desc: 'Ba chữ đồng dạng xếp hình tam giác' }
};

export const HANZI_DECOMPOSITION_DATABASE = {
  // HSK 1
  '你': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰亻尔',
    components: [
      { char: '亻', pinyin: 'rén', hanviet: 'Nhân', name: 'Bộ Nhân đứng', meaning: 'Chỉ con người, đối tượng giao tiếp' },
      { char: '尔', pinyin: 'ěr', hanviet: 'Nhĩ', name: 'Chữ Nhĩ', meaning: 'Đại từ chỉ bạn, anh, ngươi' }
    ],
    mnemonic: 'Con người (亻) đối diện trực tiếp trò chuyện cùng bạn (尔).'
  },
  '好': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰女子',
    components: [
      { char: '女', pinyin: 'nǚ', hanviet: 'Nữ', name: 'Bộ Nữ', meaning: 'Người phụ nữ, người mẹ' },
      { char: '子', pinyin: 'zǐ', hanviet: 'Tử', name: 'Chữ Tử', meaning: 'Đứa con, con nhỏ' }
    ],
    mnemonic: 'Người mẹ (女) sinh được đứa con (子) khỏe mạnh là điều tốt lành, viên mãn nhất (好).'
  },
  '我': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '⿻手戈',
    components: [
      { char: '手', pinyin: 'shǒu', hanviet: 'Thủ', name: 'Bàn tay', meaning: 'Hành động cầm nắm' },
      { char: '戈', pinyin: 'gē', hanviet: 'Qua', name: 'Binh khí', meaning: 'Vũ khí tự vệ cổ đại' }
    ],
    mnemonic: 'Bàn tay cầm vũ khí (戈) tự vệ khẳng định quyền làm chủ và bản thân tôi (我).'
  },
  '他': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰亻也',
    components: [
      { char: '亻', pinyin: 'rén', hanviet: 'Nhân', name: 'Bộ Nhân đứng', meaning: 'Con người' },
      { char: '也', pinyin: 'yě', hanviet: 'Dã', name: 'Chữ Dã', meaning: 'Cũng, người kia' }
    ],
    mnemonic: 'Người đàn ông (亻) ấy cũng (也) là một người bạn của chúng ta (他).'
  },
  '她': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰女也',
    components: [
      { char: '女', pinyin: 'nǚ', hanviet: 'Nữ', name: 'Bộ Nữ', meaning: 'Người phụ nữ' },
      { char: '也', pinyin: 'yě', hanviet: 'Dã', name: 'Chữ Dã', meaning: 'Cũng' }
    ],
    mnemonic: 'Người phụ nữ (女) duyên dáng ấy cũng (也) cùng tham gia buổi họp (她).'
  },
  '学': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱⺌冖子',
    components: [
      { char: '⺌', pinyin: 'xiǎo', hanviet: 'Tiểu', name: 'Ánh sáng tri thức', meaning: 'Tia sáng học vấn' },
      { char: '冖', pinyin: 'mì', hanviet: 'Mịch', name: 'Mái trường', meaning: 'Mái nhà học tập' },
      { char: '子', pinyin: 'zǐ', hanviet: 'Tử', name: 'Đứa trẻ', meaning: 'Học trò, con cái' }
    ],
    mnemonic: 'Đứa trẻ (子) ngồi dưới mái trường (冖) tiếp thu những ánh sáng tri thức (⺌) để học hỏi (学).'
  },
  '习': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_TOP_LEFT,
    ids: '⿸𠃌冫',
    components: [
      { char: '羽', pinyin: 'yǔ', hanviet: 'Vũ', name: 'Bộ Lông vũ', meaning: 'Đôi cánh chim non' }
    ],
    mnemonic: 'Hình ảnh cánh chim non (羽) chăm chỉ tập đập cánh từng ngày để bay cao (习).'
  },
  '休': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰亻木',
    components: [
      { char: '亻', pinyin: 'rén', hanviet: 'Nhân', name: 'Bộ Nhân đứng', meaning: 'Con người' },
      { char: '木', pinyin: 'mù', hanviet: 'Mộc', name: 'Cây cối', meaning: 'Bóng râm gốc cây' }
    ],
    mnemonic: 'Con người (亻) sau giờ lao động tựa lưng vào bóng mát gốc cây (木) để nghỉ ngơi (休).'
  },
  '想': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱相心',
    components: [
      { char: '相', pinyin: 'xiāng', hanviet: 'Tương', name: 'Chữ Tương', meaning: 'Cùng nhau, hướng về nhau' },
      { char: '心', pinyin: 'xīn', hanviet: 'Tâm', name: 'Bộ Tâm', meaning: 'Trái tim, tâm trí' }
    ],
    mnemonic: 'Khi trái tim (心) luôn hướng về nhau (相), đó chính là nỗi nhớ nhung, suy nghĩ (想).'
  },
  '朋': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰月月',
    components: [
      { char: '月', pinyin: 'yuè', hanviet: 'Nguyệt', name: 'Vầng trăng', meaning: 'Ánh sáng bầu bạn' },
      { char: '月', pinyin: 'yuè', hanviet: 'Nguyệt', name: 'Vầng trăng thứ hai', meaning: 'Tri kỷ song hành' }
    ],
    mnemonic: 'Hai vầng trăng sáng (月 + 月) luôn song hành tỏa sáng trên bầu trời như bạn bè tri kỷ bè bạn (朋).'
  },
  '友': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_TOP_LEFT,
    ids: '⿸𠂇又',
    components: [
      { char: '𠂇', pinyin: 'yǒu', hanviet: 'Tả', name: 'Bàn tay trái', meaning: 'Bàn tay nâng đỡ' },
      { char: '又', pinyin: 'yòu', hanviet: 'Hựu', name: 'Bàn tay phải', meaning: 'Bàn tay nắm chặt' }
    ],
    mnemonic: 'Hai bàn tay (𠂇 + 又) siết chặt lấy nhau đồng cam cộng khổ cùng bạn hữu (友).'
  },
  '家': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱宀豕',
    components: [
      { char: '宀', pinyin: 'mián', hanviet: 'Miên', name: 'Bộ Miên (Mái nhà)', meaning: 'Nơi che mưa che nắng' },
      { char: '豕', pinyin: 'shǐ', hanviet: 'Thỉ', name: 'Bộ Thỉ (Con lợn)', meaning: 'Gia súc, sự no ấm gia đình' }
    ],
    mnemonic: 'Dưới mái nhà (宀) có của cải chăn nuôi no đủ (豕), đó chính là tổ ấm gia đình (家).'
  },
  '国': {
    structure: IDS_STRUCTURE_TYPES.FULL_ENCLOSURE,
    ids: '⿴囗玉',
    components: [
      { char: '囗', pinyin: 'wéi', hanviet: 'Vi', name: 'Bộ Vi (Đường biên giới)', meaning: 'Lãnh thổ toàn vẹn' },
      { char: '玉', pinyin: 'yù', hanviet: 'Ngọc', name: 'Viên ngọc quý', meaning: 'Chủ quyền, quốc bảo quý giá' }
    ],
    mnemonic: 'Biên cương bờ cõi vững chắc (囗) bảo vệ viên ngọc báu của quốc gia (国).'
  },
  '问': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_DOWN,
    ids: '⿵门口',
    components: [
      { char: '门', pinyin: 'mén', hanviet: 'Môn', name: 'Bộ Môn (Cửa lớn)', meaning: 'Cổng ra vào' },
      { char: '口', pinyin: 'kǒu', hanviet: 'Khẩu', name: 'Bộ Khẩu (Cái miệng)', meaning: 'Lời nói, phát ngôn' }
    ],
    mnemonic: 'Đứng trước cổng nhà (门) mở miệng (口) cất tiếng hỏi thăm đường (问).'
  },
  '听': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰口斤',
    components: [
      { char: '口', pinyin: 'kǒu', hanviet: 'Khẩu', name: 'Bộ Khẩu', meaning: 'Cái miệng' },
      { char: '斤', pinyin: 'jīn', hanviet: 'Cân', name: 'Bộ Cân (Cái rìu)', meaning: 'Âm thanh gõ đo lường' }
    ],
    mnemonic: 'Lắng nghe (听) thanh âm từ miệng (口) với sự cân nhắc tỉ mỉ (斤).'
  },
  '说': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰讠兑',
    components: [
      { char: '讠', pinyin: 'yán', hanviet: 'Ngôn', name: 'Bộ Ngôn', meaning: 'Lời nói, ngôn ngữ' },
      { char: '兑', pinyin: 'duì', hanviet: 'Đoái', name: 'Bộ Đoái', meaning: 'Sự vui vẻ, chia sẻ' }
    ],
    mnemonic: 'Dùng lời nói (讠) chân thành giãi bày làm cho đối phương vui vẻ, thấu suốt (说).'
  },
  '读': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰讠卖',
    components: [
      { char: '讠', pinyin: 'yán', hanviet: 'Ngôn', name: 'Bộ Ngôn', meaning: 'Lời nói, sách vở' },
      { char: '卖', pinyin: 'mài', hanviet: 'Mại', name: 'Chữ Mại', meaning: 'Trao đổi, tiếp nhận' }
    ],
    mnemonic: 'Dùng lời nói (讠) xướng to câu chữ trong sách để tiếp thu kiến thức (读).'
  },
  '写': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱冖与',
    components: [
      { char: '冖', pinyin: 'mì', hanviet: 'Mịch', name: 'Mái che', meaning: 'Mặt bàn học tập' },
      { char: '与', pinyin: 'yǔ', hanviet: 'Dữ', name: 'Đường nét', meaning: 'Nét bút đưa đẩy' }
    ],
    mnemonic: 'Ngồi ngay ngắn dưới mái phòng (冖) phóng bút trao gửi tâm tư bằng chữ viết (写).'
  },
  '明': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰日月',
    components: [
      { char: '日', pinyin: 'rì', hanviet: 'Nhật', name: 'Mặt trời', meaning: 'Ánh sáng ban ngày' },
      { char: '月', pinyin: 'yuè', hanviet: 'Nguyệt', name: 'Mặt trăng', meaning: 'Ánh sáng ban đêm' }
    ],
    mnemonic: 'Mặt trời (日) kết hợp với mặt trăng (月) chiếu rọi ánh sáng rực rỡ, xua tan bóng tối (明).'
  },
  '时': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰日寸',
    components: [
      { char: '日', pinyin: 'rì', hanviet: 'Nhật', name: 'Mặt trời', meaning: 'Chu kỳ ngày' },
      { char: '寸', pinyin: 'cùn', hanviet: 'Thốn', name: 'Tấc, thước đo', meaning: 'Đo lường từng tấc bóng nắng' }
    ],
    mnemonic: 'Bóng mặt trời (日) nhích từng tấc (寸) chính là thước đo thời gian (时).'
  },
  '看': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱手目',
    components: [
      { char: '手', pinyin: 'shǒu', hanviet: 'Thủ', name: 'Bàn tay', meaning: 'Đưa tay lên trán che nắng' },
      { char: '目', pinyin: 'mù', hanviet: 'Mục', name: 'Đôi mắt', meaning: 'Ánh nhìn chăm chú' }
    ],
    mnemonic: 'Đưa bàn tay (手) lên trán che bớt ánh nắng để đôi mắt (目) nhìn rõ nơi xa (看).'
  },
  '喝': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰口曷',
    components: [
      { char: '口', pinyin: 'kǒu', hanviet: 'Khẩu', name: 'Cái miệng', meaning: 'Hành động ăn uống' },
      { char: '曷', pinyin: 'hé', hanviet: 'Hạt', name: 'Cơn khát cháy cổ', meaning: 'Cảm giác khô khát' }
    ],
    mnemonic: 'Khi cổ họng khô khát (曷), dùng miệng (口) uống từng ngụm nước mát lành (喝).'
  },
  '吃': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰口乞',
    components: [
      { char: '口', pinyin: 'kǒu', hanviet: 'Khẩu', name: 'Cái miệng', meaning: 'Dùng miệng ăn' },
      { char: '乞', pinyin: 'qǐ', hanviet: 'Khất', name: 'Cầu xin thức ăn', meaning: 'Nhu cầu no bụng' }
    ],
    mnemonic: 'Mở miệng (口) ăn thức ăn (乞) để nuôi sống cơ thể (吃).'
  },
  '饭': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰饣反',
    components: [
      { char: '饣', pinyin: 'shí', hanviet: 'Thực', name: 'Bộ Thực', meaning: 'Thức ăn, lương thực' },
      { char: '反', pinyin: 'fǎn', hanviet: 'Phản', name: 'Hành động lặp lại', meaning: 'Gợi âm thanh' }
    ],
    mnemonic: 'Lương thực (饣) nấu chín dẻo thơm thành bữa cơm nuôi dưỡng con người (饭).'
  },
  '钱': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰钅戋',
    components: [
      { char: '钅', pinyin: 'jīn', hanviet: 'Kim', name: 'Bộ Kim (Kim loại)', meaning: 'Tiền đúc bằng đồng/vàng' },
      { char: '戋', pinyin: 'jiān', hanviet: 'Tàn', name: 'Vũ khí xếp lớp', meaning: 'Sự tranh giành bảo vệ của cải' }
    ],
    mnemonic: 'Kim loại quý giá (钅) thời xưa được đúc thành đồng tiền để giao thương (钱).'
  },
  '买': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱乛头',
    components: [
      { char: '乛', pinyin: 'wān', hanviet: 'Móc lưới', meaning: 'Lưới bắt của cải' },
      { char: '头', pinyin: 'tóu', hanviet: 'Đầu', name: 'Đầu óc tính toán', meaning: 'Suy tính trao đổi hàng hóa' }
    ],
    mnemonic: 'Dùng tiền bạc và suy tính để đổi lấy hàng hóa mang về nhà (买).'
  },
  '水': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '水',
    components: [
      { char: '水', pinyin: 'shuǐ', hanviet: 'Thủy', name: 'Dòng nước', meaning: 'Dòng nước chảy uốn lượn' }
    ],
    mnemonic: 'Hình ảnh dòng suối nguồn tuôn chảy giữa hai bờ đá mát rượi (水).'
  },
  '茶': {
    structure: IDS_STRUCTURE_TYPES.TOP_MID_BOTTOM,
    ids: '⿳艹人木',
    components: [
      { char: '艹', pinyin: 'cǎo', hanviet: 'Thảo', name: 'Cỏ cây, thảo mộc', meaning: 'Lá cây búp trà' },
      { char: '人', pinyin: 'rén', hanviet: 'Nhân', name: 'Con người', meaning: 'Nghệ nhân hái trà' },
      { char: '木', pinyin: 'mù', hanviet: 'Mộc', name: 'Thân cây gỗ', meaning: 'Gốc cây trà cổ thụ' }
    ],
    mnemonic: 'Con người (人) đứng giữa ngọn cỏ thảo mộc (艹) và gốc cây (木) thưởng thức chén trà thanh tao (茶).'
  },
  '车': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '车',
    components: [
      { char: '车', pinyin: 'chē', hanviet: 'Xa', name: 'Cỗ xe', meaning: 'Xe cộ có hai bánh và trục lăn' }
    ],
    mnemonic: 'Hình ảnh cỗ xe ngựa cổ có thùng xe và bánh trục vững vàng (车).'
  },
  '块': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰土夬',
    components: [
      { char: '土', pinyin: 'tǔ', hanviet: 'Thổ', name: 'Đất cát', meaning: 'Cục đất khối đá' },
      { char: '夬', pinyin: 'guài', hanviet: 'Quái', name: 'Rẽ nhánh', meaning: 'Gợi âm thanh' }
    ],
    mnemonic: 'Đất đá (土) quy tụ thành từng khối, dùng làm lượng từ đồng tiền (块).'
  },
  '懂': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰忄董',
    components: [
      { char: '忄', pinyin: 'xīn', hanviet: 'Tâm', name: 'Bộ Tâm đứng', meaning: 'Trái tim, tâm trí' },
      { char: '董', pinyin: 'dǒng', hanviet: 'Đổng', name: 'Sắp xếp trật tự', meaning: 'Thấu hiểu lý lẽ' }
    ],
    mnemonic: 'Tâm trí (忄) được sắp xếp thông suốt (董), nhận biết rõ đúng sai là thấu hiểu (懂).'
  },
  '语': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰讠吾',
    components: [
      { char: '讠', pinyin: 'yán', hanviet: 'Ngôn', name: 'Lời nói', meaning: 'Ngôn ngữ' },
      { char: '吾', pinyin: 'wú', hanviet: 'Ngô', name: 'Bản thân tôi', meaning: 'Tâm can người nói' }
    ],
    mnemonic: 'Lời nói (讠) cất lên từ sâu thẳm tâm can bản thân tôi (吾) tạo nên ngôn ngữ (语).'
  },
  '汉': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰氵又',
    components: [
      { char: '氵', pinyin: 'shuǐ', hanviet: 'Chấm thủy', name: 'Dòng sông Hán Thủy', meaning: 'Nguồn gốc văn minh tộc Hán' },
      { char: '又', pinyin: 'yòu', hanviet: 'Hựu', name: 'Đôi bàn tay', meaning: 'Hành động xây dựng' }
    ],
    mnemonic: 'Nền văn minh tộc Hán bắt nguồn từ lưu vực dòng sông Hán Thủy (氵) phồn vinh (汉).'
  },
  '字': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱宀子',
    components: [
      { char: '宀', pinyin: 'mián', hanviet: 'Miên', name: 'Mái nhà', meaning: 'Nơi dưỡng dục' },
      { char: '子', pinyin: 'zǐ', hanviet: 'Tử', name: 'Đứa con', meaning: 'Thế hệ tương lai' }
    ],
    mnemonic: 'Dưới mái nhà (宀), đứa con (子) được rèn luyện học từng nét chữ văn tự (字).'
  }
,

  // === HSK 1 FOUNDATION STANDARDIZED CHARACTERS (TASK 22.02) ===
  '一': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '一',
    components: [
      {
            "char": "一",
            "pinyin": "yī",
            "hanviet": "Nhất",
            "name": "Bộ Nhất",
            "meaning": "Một nét ngang, số một, khởi nguyên vũ trụ"
      }
],
    mnemonic: 'Nét ngang duy nhất đại diện cho sự khởi đầu, số một.'
  },

  '二': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '二',
    components: [
      {
            "char": "二",
            "pinyin": "èr",
            "hanviet": "Nhị",
            "name": "Bộ Nhị",
            "meaning": "Hai nét ngang tượng trưng Trời và Đất"
      }
],
    mnemonic: 'Hai nét ngang song song: nét trên là Trời, nét dưới là Đất.'
  },

  '三': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '三',
    components: [
      {
            "char": "三",
            "pinyin": "sān",
            "hanviet": "Tam",
            "name": "Chữ Tam",
            "meaning": "Ba nét ngang biểu thị Tam tài: Thiên - Địa - Nhân"
      }
],
    mnemonic: 'Ba nét ngang đại diện cho Trời, Đất và Con người ở giữa.'
  },

  '四': {
    structure: IDS_STRUCTURE_TYPES.FULL_ENCLOSURE,
    ids: '⿴囗儿',
    components: [
      {
            "char": "囗",
            "pinyin": "wéi",
            "hanviet": "Vi",
            "name": "Bộ Vi",
            "meaning": "Khung bao bọc bốn phía"
      },
      {
            "char": "儿",
            "pinyin": "ér",
            "hanviet": "Nhi",
            "name": "Nét bên trong",
            "meaning": "Hai nét chia mở ra"
      }
],
    mnemonic: 'Khung bao ngoài vuông vắn (囗) chia thành 4 góc.'
  },

  '五': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '五',
    components: [
      {
            "char": "二",
            "pinyin": "èr",
            "hanviet": "Nhị",
            "name": "Trời và đất",
            "meaning": "Hai cõi càn khôn"
      },
      {
            "char": "乂",
            "pinyin": "yì",
            "hanviet": "Ngải",
            "name": "Nét đan xen",
            "meaning": "Giao thoa ngũ hành (Kim Mộc Thủy Hỏa Thổ)"
      }
],
    mnemonic: 'Trời đất (2 nét ngang) giao thoa ngũ hành ở giữa sinh ra vạn vật.'
  },

  '八': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '八',
    components: [
      {
            "char": "八",
            "pinyin": "bā",
            "hanviet": "Bát",
            "name": "Bộ Bát",
            "meaning": "Hai nét mở rộng chia đôi, số 8"
      }
],
    mnemonic: 'Hai nét phẩy và mác mở rộng sang hai phía thể hiện sự phân tách.'
  },

  '十': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '十',
    components: [
      {
            "char": "十",
            "pinyin": "shí",
            "hanviet": "Thập",
            "name": "Bộ Thập",
            "meaning": "Giao nhau bốn phương tám hướng, số 10 vẹn toàn"
      }
],
    mnemonic: 'Nét ngang Đông Tây gặp nét sổ Nam Bắc, hội tụ thành số 10 tròn đầy.'
  },

  '人': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '人',
    components: [
      {
            "char": "人",
            "pinyin": "rén",
            "hanviet": "Nhân",
            "name": "Bộ Nhân",
            "meaning": "Con người bước đi vững vàng"
      }
],
    mnemonic: 'Hình ảnh con người đứng vững vàng trên hai chân.'
  },

  '大': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '大',
    components: [
      {
            "char": "人",
            "pinyin": "rén",
            "hanviet": "Nhân",
            "name": "Người",
            "meaning": "Con người"
      },
      {
            "char": "一",
            "pinyin": "yī",
            "hanviet": "Nhất",
            "name": "Dang tay",
            "meaning": "Kéo rộng hai tay"
      }
],
    mnemonic: 'Hình con người dang rộng hai tay hai chân hết cỡ để diễn tả sự to lớn.'
  },

  '口': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '口',
    components: [
      {
            "char": "口",
            "pinyin": "kǒu",
            "hanviet": "Khẩu",
            "name": "Bộ Khẩu",
            "meaning": "Cái miệng, lối vào, cửa khẩu"
      }
],
    mnemonic: 'Hình vẽ chiếc miệng mở rộng đón nhận thức ăn và lời nói.'
  },

  '女': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '女',
    components: [
      {
            "char": "女",
            "pinyin": "nǚ",
            "hanviet": "Nữ",
            "name": "Bộ Nữ",
            "meaning": "Người phụ nữ đoan trang"
      }
],
    mnemonic: 'Hình ảnh người phụ nữ ngồi khoanh tay đoan trang, dịu hiền.'
  },

  '子': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '子',
    components: [
      {
            "char": "子",
            "pinyin": "zǐ",
            "hanviet": "Tử",
            "name": "Bộ Tử",
            "meaning": "Đứa con, con nhỏ"
      }
],
    mnemonic: 'Hình em bé quấn tã dang rộng hai tay nhỏ tinh nghịch.'
  },

  '日': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '日',
    components: [
      {
            "char": "日",
            "pinyin": "rì",
            "hanviet": "Nhật",
            "name": "Bộ Nhật",
            "meaning": "Mặt trời, ngày"
      }
],
    mnemonic: 'Hình tròn mặt trời tỏa sáng rực rỡ có vệt đen ở giữa.'
  },

  '月': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '月',
    components: [
      {
            "char": "月",
            "pinyin": "yuè",
            "hanviet": "Nguyệt",
            "name": "Bộ Nguyệt",
            "meaning": "Mặt trăng, tháng, thịt bắp"
      }
],
    mnemonic: 'Vành trăng khuyết chiếu sáng ban đêm.'
  },

  '水': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '水',
    components: [
      {
            "char": "水",
            "pinyin": "shuǐ",
            "hanviet": "Thủy",
            "name": "Bộ Thủy",
            "meaning": "Dòng nước chảy"
      }
],
    mnemonic: 'Dòng nước chảy uốn khúc ở giữa và các bọt nước bắn ra hai bên.'
  },

  '火': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '火',
    components: [
      {
            "char": "火",
            "pinyin": "huǒ",
            "hanviet": "Hỏa",
            "name": "Bộ Hỏa",
            "meaning": "Ngọn lửa bốc cháy"
      }
],
    mnemonic: 'Ngọn lửa bốc cháy ở giữa và hai tia lửa văng sang hai phía.'
  },

  '木': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '木',
    components: [
      {
            "char": "木",
            "pinyin": "mù",
            "hanviet": "Mộc",
            "name": "Bộ Mộc",
            "meaning": "Cây cối, gỗ"
      }
],
    mnemonic: 'Thân cây vươn thẳng, cành lá tỏa sang hai bên và rễ bám sâu vào lòng đất.'
  },

  '土': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '土',
    components: [
      {
            "char": "土",
            "pinyin": "tǔ",
            "hanviet": "Thổ",
            "name": "Bộ Thổ",
            "meaning": "Đất cát"
      }
],
    mnemonic: 'Hạt giống và mầm cây nhú lên từ bề mặt đất.'
  },

  '山': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '山',
    components: [
      {
            "char": "山",
            "pinyin": "shān",
            "hanviet": "Sơn",
            "name": "Bộ Sơn",
            "meaning": "Ngọn núi"
      }
],
    mnemonic: 'Hình ba ngọn núi nhấp nhô nối tiếp nhau.'
  },

  '不': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '不',
    components: [
      {
            "char": "一",
            "pinyin": "yī",
            "hanviet": "Nhất",
            "name": "Vòm trời",
            "meaning": "Trời cao"
      },
      {
            "char": "𠀃",
            "pinyin": "bù",
            "hanviet": "Bất",
            "name": "Chim bay",
            "meaning": "Cánh chim bay lên trời không trở lại"
      }
],
    mnemonic: 'Cánh chim bay vút lên bầu trời biến mất, mang nghĩa phủ định: không còn, không làm.'
  },

  '个': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱人丨',
    components: [
      {
            "char": "人",
            "pinyin": "rén",
            "hanviet": "Nhân",
            "name": "Bộ Nhân",
            "meaning": "Người, cái"
      },
      {
            "char": "丨",
            "pinyin": "gǔn",
            "hanviet": "Cổn",
            "name": "Nét sổ thẳng",
            "meaning": "Một cá thể thẳng đứng"
      }
],
    mnemonic: 'Một con người (人) đứng thẳng (丨) đại diện cho từng đơn vị, từng cá thể.'
  },

  '起': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_BOTTOM_LEFT,
    ids: '⿺走己',
    components: [
      {
            "char": "走",
            "pinyin": "zǒu",
            "hanviet": "Tẩu",
            "name": "Bộ Tẩu",
            "meaning": "Chạy, đi, khởi hành"
      },
      {
            "char": "己",
            "pinyin": "jǐ",
            "hanviet": "Kỷ",
            "name": "Bản thân",
            "meaning": "Tự mình"
      }
],
    mnemonic: 'Bản thân mình (己) tự cất bước chạy (走) biểu thị sự bắt đầu, thức dậy vươn lên.'
  },

  '您': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱你心',
    components: [
      {
            "char": "你",
            "pinyin": "nǐ",
            "hanviet": "Nhĩ",
            "name": "Bạn, anh, thầy",
            "meaning": "Đối tượng giao tiếp"
      },
      {
            "char": "心",
            "pinyin": "xīn",
            "hanviet": "Tâm",
            "name": "Bộ Tâm",
            "meaning": "Tấm lòng, sự tôn kính"
      }
],
    mnemonic: 'Đặt bạn (你) trang trọng trên cả trái tim (心) biểu thị sự kính trọng tối cao (Ngài, Thầy).'
  },

  '谢': {
    structure: IDS_STRUCTURE_TYPES.LEFT_MID_RIGHT,
    ids: '⿲讠身寸',
    components: [
      {
            "char": "讠",
            "pinyin": "yán",
            "hanviet": "Ngôn",
            "name": "Bộ Ngôn",
            "meaning": "Lời nói"
      },
      {
            "char": "身",
            "pinyin": "shēn",
            "hanviet": "Thân",
            "name": "Thân thể",
            "meaning": "Cơ thể cúi chào"
      },
      {
            "char": "寸",
            "pinyin": "cùn",
            "hanviet": "Thốn",
            "name": "Bộ Thốn",
            "meaning": "Tấc tất, lễ phép đúng mực"
      }
],
    mnemonic: 'Dùng lời nói (讠), cúi thân mình (身) xuống đúng mực (寸) để cảm tạ (谢谢).'
  },

  '客': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱宀各',
    components: [
      {
            "char": "宀",
            "pinyin": "mián",
            "hanviet": "Miên",
            "name": "Bộ Miên",
            "meaning": "Mái nhà"
      },
      {
            "char": "各",
            "pinyin": "gè",
            "hanviet": "Các",
            "name": "Mỗi người",
            "meaning": "Người từ nơi khác đến"
      }
],
    mnemonic: 'Người từ nơi khác (各) bước vào dưới mái nhà (宀) chính là khách quý (客人).'
  },

  '气': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '气',
    components: [
      {
            "char": "气",
            "pinyin": "qì",
            "hanviet": "Khí",
            "name": "Bộ Khí",
            "meaning": "Hơi nước, không khí, khí chất"
      }
],
    mnemonic: 'Những làn mây và luồng không khí bốc lên nhẹ nhàng uốn lượn.'
  },

  '再': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '再',
    components: [
      {
            "char": "一",
            "pinyin": "yī",
            "hanviet": "Nhất",
            "name": "Nét ngang",
            "meaning": "Khởi đầu lại"
      },
      {
            "char": "冉",
            "pinyin": "rǎn",
            "hanviet": "Nhiễm",
            "name": "Bộ Nhiễm",
            "meaning": "Tiến triển lặp lại"
      }
],
    mnemonic: 'Hành động lặp lại thêm một lần nữa, hẹn gặp lại (再见).'
  },

  '见': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '见',
    components: [
      {
            "char": "冂",
            "pinyin": "jiōng",
            "hanviet": "Quynh",
            "name": "Đôi mắt mở",
            "meaning": "Mục lực"
      },
      {
            "char": "儿",
            "pinyin": "ér",
            "hanviet": "Nhi",
            "name": "Cặp chân",
            "meaning": "Bước chân người"
      }
],
    mnemonic: 'Đôi mắt mở to nhìn thấy đối phương khi bước chân tới gặp gỡ.'
  },

  '是': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱日疋',
    components: [
      {
            "char": "日",
            "pinyin": "rì",
            "hanviet": "Nhật",
            "name": "Mặt trời",
            "meaning": "Sự quang minh chính đại"
      },
      {
            "char": "疋",
            "pinyin": "zhǐ",
            "hanviet": "Chỉ",
            "name": "Chân đứng vững",
            "meaning": "Ngay thẳng, đứng đắn"
      }
],
    mnemonic: 'Mặt trời (日) soi tỏ bước chân ngay thẳng (疋), khẳng định điều đúng đắn, phải là (是).'
  },

  '吗': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰口马',
    components: [
      {
            "char": "口",
            "pinyin": "kǒu",
            "hanviet": "Khẩu",
            "name": "Bộ Khẩu",
            "meaning": "Mở miệng hỏi"
      },
      {
            "char": "马",
            "pinyin": "mǎ",
            "hanviet": "Mã",
            "name": "Con ngựa (thanh âm)",
            "meaning": "Âm đọc mǎ tạo ra ma"
      }
],
    mnemonic: 'Mở miệng (口) mượn âm con ngựa (马) để cất lên câu hỏi nghi vấn (吗).'
  },

  '老': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱耂匕',
    components: [
      {
            "char": "耂",
            "pinyin": "lǎo",
            "hanviet": "Lão",
            "name": "Bộ Lão",
            "meaning": "Người già tóc dài chống gậy"
      },
      {
            "char": "匕",
            "pinyin": "bǐ",
            "hanviet": "Chủy",
            "name": "Cái thìa, người cúi",
            "meaning": "Người già lưng còng"
      }
],
    mnemonic: 'Hình ảnh bậc tiền bối tóc dài râu bạc chống gậy bước đi (老师).'
  },

  '师': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰𠂤巾',
    components: [
      {
            "char": "𠂤",
            "pinyin": "duī",
            "hanviet": "Đôi",
            "name": "Gò đất, quân đội",
            "meaning": "Đoàn thể học trò"
      },
      {
            "char": "巾",
            "pinyin": "jīn",
            "hanviet": "Cân",
            "name": "Bộ Cân",
            "meaning": "Lá cờ chỉ huy"
      }
],
    mnemonic: 'Người giương cao lá cờ (巾) dẫn dắt đông đảo học trò (𠂤) chính là thầy giáo (老师).'
  },

  '生': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '生',
    components: [
      {
            "char": "土",
            "pinyin": "tǔ",
            "hanviet": "Thổ",
            "name": "Đất",
            "meaning": "Đất lành"
      },
      {
            "char": "屮",
            "pinyin": "chè",
            "hanviet": "Triệt",
            "name": "Mầm cây",
            "meaning": "Mầm non sinh sôi nảy nở"
      }
],
    mnemonic: 'Mầm non nhú lên từ lòng đất biểu thị sự sinh sôi, sức sống trẻ trung của học sinh (学生).'
  },

  '叫': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰口丩',
    components: [
      {
            "char": "口",
            "pinyin": "kǒu",
            "hanviet": "Khẩu",
            "name": "Bộ Khẩu",
            "meaning": "Miệng"
      },
      {
            "char": "丩",
            "pinyin": "jiū",
            "hanviet": "Củ",
            "name": "Tiếng kêu ngân vang",
            "meaning": "Âm thanh cất lên"
      }
],
    mnemonic: 'Mở miệng (口) gọi tên nhau ngân vang (叫).'
  },

  '什': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰亻十',
    components: [
      {
            "char": "亻",
            "pinyin": "rén",
            "hanviet": "Nhân",
            "name": "Bộ Nhân đứng",
            "meaning": "Con người"
      },
      {
            "char": "十",
            "pinyin": "shí",
            "hanviet": "Thập",
            "name": "Bộ Thập",
            "meaning": "Số mười, đa dạng"
      }
],
    mnemonic: 'Người (亻) thắc mắc đủ mười (十) điều chưa rõ: Cái gì? (什么).'
  },

  '么': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱丿么',
    components: [
      {
            "char": "丿",
            "pinyin": "piě",
            "hanviet": "Phẩy",
            "name": "Nét phẩy",
            "meaning": "Nhẹ nhàng"
      },
      {
            "char": "幺",
            "pinyin": "yāo",
            "hanviet": "Yêu",
            "name": "Bộ Yêu",
            "meaning": "Nhỏ bé, thanh nhẹ"
      }
],
    mnemonic: 'Trợ từ nghi vấn nhẹ nhàng lướt qua cuối câu (什么).'
  },

  '名': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱夕口',
    components: [
      {
            "char": "夕",
            "pinyin": "xī",
            "hanviet": "Tịch",
            "name": "Bộ Tịch",
            "meaning": "Buổi tối trời tối mịt"
      },
      {
            "char": "口",
            "pinyin": "kǒu",
            "hanviet": "Khẩu",
            "name": "Bộ Khẩu",
            "meaning": "Cái miệng"
      }
],
    mnemonic: 'Trời tối mịt (夕) không thấy mặt nhau, phải mở miệng (口) gọi tên để nhận ra nhau (名字).'
  },

  '哪': {
    structure: IDS_STRUCTURE_TYPES.LEFT_MID_RIGHT,
    ids: '⿲口那',
    components: [
      {
            "char": "口",
            "pinyin": "kǒu",
            "hanviet": "Khẩu",
            "name": "Bộ Khẩu",
            "meaning": "Mở miệng hỏi"
      },
      {
            "char": "那",
            "pinyin": "nà",
            "hanviet": "Na",
            "name": "Nơi đó",
            "meaning": "Chỉ định vị trí"
      }
],
    mnemonic: 'Mở miệng (口) hỏi xem nơi ấy (那) rốt cuộc là nơi nào, nước nào? (哪国).'
  },

  '越': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_BOTTOM_LEFT,
    ids: '⿺走戉',
    components: [
      {
            "char": "走",
            "pinyin": "zǒu",
            "hanviet": "Tẩu",
            "name": "Bộ Tẩu",
            "meaning": "Chạy, vượt qua"
      },
      {
            "char": "戉",
            "pinyin": "yuè",
            "hanviet": "Việt",
            "name": "Binh khí chiếc rìu",
            "meaning": "Vượt qua chông gai"
      }
],
    mnemonic: 'Cầm rìu (戉) bước qua ngàn dặm (走) lập quốc, biểu trưng cho đất nước Việt Nam (越南).'
  },

  '南': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱十⿵冂羊',
    components: [
      {
            "char": "十",
            "pinyin": "shí",
            "hanviet": "Thập",
            "name": "Bộ Thập",
            "meaning": "Phương hướng"
      },
      {
            "char": "冂",
            "pinyin": "jiōng",
            "hanviet": "Quynh",
            "name": "Khung ngoài",
            "meaning": "Khoảng không gian"
      },
      {
            "char": "羊",
            "pinyin": "yáng",
            "hanviet": "Dương",
            "name": "Mầm sống ấm áp",
            "meaning": "Phương Nam ấm áp"
      }
],
    mnemonic: 'Phương trời phía Nam chan hòa ánh nắng ấm áp và trù phú (越南).'
  },

  '岁': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱山夕',
    components: [
      {
            "char": "山",
            "pinyin": "shān",
            "hanviet": "Sơn",
            "name": "Ngọn núi",
            "meaning": "Năm tháng sừng sững"
      },
      {
            "char": "夕",
            "pinyin": "xī",
            "hanviet": "Tịch",
            "name": "Đêm tối",
            "meaning": "Ngày đêm trôi qua"
      }
],
    mnemonic: 'Mặt trời lặn sau núi (山) từng chiều (夕), ngày qua tháng lại kết tinh thành tuổi đời (岁).'
  },

  '几': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '几',
    components: [
      {
            "char": "几",
            "pinyin": "jǐ",
            "hanviet": "Kỷ",
            "name": "Bộ Kỷ",
            "meaning": "Cái bàn nhỏ, số lượng ít dưới 10"
      }
],
    mnemonic: 'Hình chiếc bàn trà nhỏ, gợi nhớ những con số nhỏ đếm được trên đầu ngón tay (几).'
  },

  '多': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱夕夕',
    components: [
      {
            "char": "夕",
            "pinyin": "xī",
            "hanviet": "Tịch",
            "name": "Trăng đêm",
            "meaning": "Một đêm"
      },
      {
            "char": "夕",
            "pinyin": "xī",
            "hanviet": "Tịch",
            "name": "Trăng đêm",
            "meaning": "Nhiều đêm xếp chồng"
      }
],
    mnemonic: 'Nhiều đêm (夕) chồng chất lên nhau biểu thị số lượng nhiều, dồi dào (多少).'
  },

  '少': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '少',
    components: [
      {
            "char": "小",
            "pinyin": "xiǎo",
            "hanviet": "Tiểu",
            "name": "Nhỏ",
            "meaning": "Bé nhỏ"
      },
      {
            "char": "丿",
            "pinyin": "piě",
            "hanviet": "Phẩy",
            "name": "Nét phẩy gạt đi",
            "meaning": "Bớt đi một chút"
      }
],
    mnemonic: 'Đã nhỏ bé (小) lại còn bị gạt bớt một nét (丿) thì càng trở nên ít ỏi (多少).'
  },

  '认': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰讠人',
    components: [
      {
            "char": "讠",
            "pinyin": "yán",
            "hanviet": "Ngôn",
            "name": "Bộ Ngôn",
            "meaning": "Lời nói, trao đổi"
      },
      {
            "char": "人",
            "pinyin": "rén",
            "hanviet": "Nhân",
            "name": "Bộ Nhân",
            "meaning": "Con người"
      }
],
    mnemonic: 'Dùng lời nói (讠) trò chuyện cùng một người (人) để nhận biết, làm quen (认识).'
  },

  '识': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰讠只',
    components: [
      {
            "char": "讠",
            "pinyin": "yán",
            "hanviet": "Ngôn",
            "name": "Bộ Ngôn",
            "meaning": "Lời nói, tri thức"
      },
      {
            "char": "只",
            "pinyin": "zhī",
            "hanviet": "Chích",
            "name": "Từng điều một",
            "meaning": "Thấu hiểu"
      }
],
    mnemonic: 'Lời nói (讠) diễn giải rõ ràng từng điều (只) giúp mở mang tri thức, hiểu biết (认识).'
  },

  '高': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱亠⿵冂口',
    components: [
      {
            "char": "亠",
            "pinyin": "tóu",
            "hanviet": "Đầu",
            "name": "Mái tháp cao",
            "meaning": "Đỉnh cao"
      },
      {
            "char": "口",
            "pinyin": "kǒu",
            "hanviet": "Khẩu",
            "name": "Cửa sổ lầu cao",
            "meaning": "Tầm nhìn thoáng đãng"
      }
],
    mnemonic: 'Hình ảnh tòa tháp cao vút có mái che và cửa sổ lầu trông ra bốn phương (高兴).'
  },

  '兴': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱⺍六',
    components: [
      {
            "char": "⺍",
            "pinyin": "bā",
            "hanviet": "Bát",
            "name": "Ba nét trên",
            "meaning": "Nhiều bàn tay nâng đỡ"
      },
      {
            "char": "一",
            "pinyin": "yī",
            "hanviet": "Nhất",
            "name": "Nền tảng",
            "meaning": "Nền tảng vững"
      },
      {
            "char": "八",
            "pinyin": "bā",
            "hanviet": "Bát",
            "name": "Hai chân nhảy múa",
            "meaning": "Hân hoan"
      }
],
    mnemonic: 'Nhiều bàn tay cùng chung sức nâng lên trong niềm vui hân hoan phấn khởi (高兴).'
  },

  '有': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱𠂇月',
    components: [
      {
            "char": "𠂇",
            "pinyin": "yòu",
            "hanviet": "Hựu",
            "name": "Bàn tay",
            "meaning": "Bàn tay nắm giữ"
      },
      {
            "char": "月",
            "pinyin": "ròu",
            "hanviet": "Nhục",
            "name": "Miếng thịt (bộ Nhục)",
            "meaning": "Thực phẩm quý"
      }
],
    mnemonic: 'Bàn tay (𠂇) nắm chắc miếng thịt tươi (月) biểu thị sự giàu có, sở hữu (有).'
  },

  '没': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰氵殳',
    components: [
      {
            "char": "氵",
            "pinyin": "shuǐ",
            "hanviet": "Thủy",
            "name": "Bộ Ba chấm thủy",
            "meaning": "Nước sâu"
      },
      {
            "char": "殳",
            "pinyin": "shū",
            "hanviet": "Thù",
            "name": "Bàn tay cầm gậy lặn",
            "meaning": "Chìm nghỉm mất dấu"
      }
],
    mnemonic: 'Rơi xuống dòng nước sâu (氵) chìm nghỉm không thấy đâu nữa mang nghĩa không có, biến mất (没有).'
  },

  '哥': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱可可',
    components: [
      {
            "char": "可",
            "pinyin": "kě",
            "hanviet": "Khả",
            "name": "Chữ Khả",
            "meaning": "Gánh vác trách nhiệm"
      },
      {
            "char": "可",
            "pinyin": "kě",
            "hanviet": "Khả",
            "name": "Chữ Khả",
            "meaning": "Chăm lo cho em"
      }
],
    mnemonic: 'Hai chữ Khả (可) xếp chồng: Người anh trai gánh vác việc gia đình, chăm lo chu đáo cho các em (哥哥).'
  },

  '姐': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰女且',
    components: [
      {
            "char": "女",
            "pinyin": "nǚ",
            "hanviet": "Nữ",
            "name": "Bộ Nữ",
            "meaning": "Người phụ nữ"
      },
      {
            "char": "且",
            "pinyin": "qiě",
            "hanviet": "Thả",
            "name": "Tấm bia tổ tiên",
            "meaning": "Bậc đàn chị đáng kính"
      }
],
    mnemonic: 'Người phụ nữ (女) đứng hàng trên trong nhà, luôn bảo bọc các em là chị gái (姐姐).'
  },

  '和': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰禾口',
    components: [
      {
            "char": "禾",
            "pinyin": "hé",
            "hanviet": "Hòa",
            "name": "Bộ Hòa",
            "meaning": "Bông lúa chín"
      },
      {
            "char": "口",
            "pinyin": "kǒu",
            "hanviet": "Khẩu",
            "name": "Bộ Khẩu",
            "meaning": "Miệng ăn no ấm"
      }
],
    mnemonic: 'Mỗi miệng ăn (口) đều có lúa gạo (禾) thì thiên hạ thái bình, hòa thuận ấm êm (和平, 和).'
  },

  '今': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱人乛',
    components: [
      {
            "char": "人",
            "pinyin": "rén",
            "hanviet": "Nhân",
            "name": "Con người",
            "meaning": "Hiện diện"
      },
      {
            "char": "乛",
            "pinyin": "yǐ",
            "hanviet": "Ất",
            "name": "Nét ngang gập",
            "meaning": "Thời điểm hiện tại"
      }
],
    mnemonic: 'Bóng dáng con người đang hiện diện dưới mái hiên lúc này chính là ngày hôm nay (今天).'
  },

  '天': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '天',
    components: [
      {
            "char": "一",
            "pinyin": "yī",
            "hanviet": "Nhất",
            "name": "Tầng trời",
            "meaning": "Vòm trời trên cao"
      },
      {
            "char": "大",
            "pinyin": "dà",
            "hanviet": "Đại",
            "name": "Người dang tay",
            "meaning": "Con người"
      }
],
    mnemonic: 'Phía trên đầu con người to lớn (大) chính là bầu trời bao la (天).'
  },

  '昨': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰日乍',
    components: [
      {
            "char": "日",
            "pinyin": "rì",
            "hanviet": "Nhật",
            "name": "Bộ Nhật",
            "meaning": "Mặt trời, ngày"
      },
      {
            "char": "乍",
            "pinyin": "zhà",
            "hanviet": "Sạ",
            "name": "Vừa mới thoảng qua",
            "meaning": "Vừa trôi qua"
      }
],
    mnemonic: 'Mặt trời của ngày vừa mới lặn qua (乍) chính là ngày hôm qua (昨天).'
  },

  '号': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱口丂',
    components: [
      {
            "char": "口",
            "pinyin": "kǒu",
            "hanviet": "Khẩu",
            "name": "Bộ Khẩu",
            "meaning": "Miệng hô to"
      },
      {
            "char": "丂",
            "pinyin": "kǎo",
            "hanviet": "Khảo",
            "name": "Nét uốn cong",
            "meaning": "Số hiệu, thanh âm"
      }
],
    mnemonic: 'Mở miệng (口) đọc vang số hiệu ngày tháng (几月几号).'
  },

  '星': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱日生',
    components: [
      {
            "char": "日",
            "pinyin": "rì",
            "hanviet": "Nhật",
            "name": "Bộ Nhật",
            "meaning": "Thiên thể mặt trời"
      },
      {
            "char": "生",
            "pinyin": "shēng",
            "hanviet": "Sinh",
            "name": "Sinh sôi tỏa sáng",
            "meaning": "Ngôi sao lấp lánh"
      }
],
    mnemonic: 'Mặt trời (日) sinh ra (生) muôn vì sao lấp lánh trên bầu trời đêm (星期).'
  },

  '期': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰其月',
    components: [
      {
            "char": "其",
            "pinyin": "qí",
            "hanviet": "Kỳ",
            "name": "Chiếc nong sảy",
            "meaning": "Quy luật đều đặn"
      },
      {
            "char": "月",
            "pinyin": "yuè",
            "hanviet": "Nguyệt",
            "name": "Mặt trăng",
            "meaning": "Chu kỳ tuần trăng"
      }
],
    mnemonic: 'Chu kỳ tuần trăng (月) lặp lại đều đặn theo thời gian định kỳ (星期).'
  },

  '现': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰王见',
    components: [
      {
            "char": "王",
            "pinyin": "wáng",
            "hanviet": "Vương",
            "name": "Bộ Ngọc/Vương",
            "meaning": "Viên ngọc quý"
      },
      {
            "char": "见",
            "pinyin": "jiàn",
            "hanviet": "Kiến",
            "name": "Nhìn thấy",
            "meaning": "Hiển hiện trước mắt"
      }
],
    mnemonic: 'Viên ngọc quý (王) mài giũa hiện ra trước mắt (见) tượng trưng cho khoảnh khắc hiện tại (现在).'
  },

  '在': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_TOP_LEFT,
    ids: '⿸𠂇土',
    components: [
      {
            "char": "𠂇",
            "pinyin": "yòu",
            "hanviet": "Hựu",
            "name": "Bàn tay chống đỡ",
            "meaning": "Tồn tại"
      },
      {
            "char": "土",
            "pinyin": "tǔ",
            "hanviet": "Thổ",
            "name": "Bộ Thổ",
            "meaning": "Vùng đất"
      }
],
    mnemonic: 'Con người sinh sống và gắn bó trên mảnh đất (土) biểu thị vị trí: ở, tại (在).'
  },

  '点': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱占灬',
    components: [
      {
            "char": "占",
            "pinyin": "zhān",
            "hanviet": "Chiêm",
            "name": "Chiêm bói",
            "meaning": "Xác định thời khắc"
      },
      {
            "char": "灬",
            "pinyin": "huǒ",
            "hanviet": "Hỏa",
            "name": "Bốn chấm hỏa",
            "meaning": "Giọt nước/chấm nhỏ"
      }
],
    mnemonic: 'Chấm nhỏ thời khắc (灬) điểm đúng lúc trên mặt đồng hồ (几点).'
  },

  '分': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱八刀',
    components: [
      {
            "char": "八",
            "pinyin": "bā",
            "hanviet": "Bát",
            "name": "Bộ Bát",
            "meaning": "Tách ra hai bên"
      },
      {
            "char": "刀",
            "pinyin": "dāo",
            "hanviet": "Đao",
            "name": "Bộ Đao",
            "meaning": "Con dao bén"
      }
],
    mnemonic: 'Dùng dao (刀) chia tách (八) thời gian thành từng phút nhỏ (分钟).'
  },

  '半': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '半',
    components: [
      {
            "char": "八",
            "pinyin": "bā",
            "hanviet": "Bát",
            "name": "Chia đôi",
            "meaning": "Phân nửa"
      },
      {
            "char": "十",
            "pinyin": "shí",
            "hanviet": "Thập",
            "name": "Số mười",
            "meaning": "Một tổng thể"
      }
],
    mnemonic: 'Chia đôi một tổng thể ra làm hai phần bằng nhau: một nửa (半).'
  },

  '上': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '上',
    components: [
      {
            "char": "一",
            "pinyin": "yī",
            "hanviet": "Nhất",
            "name": "Đường chân trời",
            "meaning": "Mặt phẳng chuẩn"
      },
      {
            "char": "卜",
            "pinyin": "bǔ",
            "hanviet": "Bốc",
            "name": "Chỉ dấu hướng lên",
            "meaning": "Phía trên"
      }
],
    mnemonic: 'Chỉ thị ký hiệu nằm phía trên đường cơ sở: ở trên (上午, 上面).'
  },

  '午': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '午',
    components: [
      {
            "char": "午",
            "pinyin": "wǔ",
            "hanviet": "Ngọ",
            "name": "Bộ Thập có móc",
            "meaning": "Giờ Ngọ lúc giữa trưa"
      }
],
    mnemonic: 'Hình chiếc chày giã gạo thẳng đứng lúc mặt trời đứng bóng giữa trưa (中午).'
  },

  '下': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '下',
    components: [
      {
            "char": "一",
            "pinyin": "yī",
            "hanviet": "Nhất",
            "name": "Mặt phẳng chuẩn",
            "meaning": "Đường ngang"
      },
      {
            "char": "卜",
            "pinyin": "bǔ",
            "hanviet": "Bốc",
            "name": "Chỉ dấu hướng xuống",
            "meaning": "Phía dưới"
      }
],
    mnemonic: 'Chỉ thị ký hiệu hướng xuống dưới đường cơ sở: ở dưới (下午, 下面).'
  },

  '儿': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '儿',
    components: [
      {
            "char": "儿",
            "pinyin": "ér",
            "hanviet": "Nhi",
            "name": "Bộ Nhi",
            "meaning": "Đứa trẻ con"
      }
],
    mnemonic: 'Hình ảnh đôi chân nhanh nhẹn của đứa trẻ con chạy nhảy (哪儿, 一点儿).'
  },

  '去': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱土厶',
    components: [
      {
            "char": "土",
            "pinyin": "tǔ",
            "hanviet": "Thổ",
            "name": "Mặt đất",
            "meaning": "Vùng đất"
      },
      {
            "char": "厶",
            "pinyin": "sī",
            "hanviet": "Khứ/Khư",
            "name": "Bàn chân rời đi",
            "meaning": "Rời khỏi hang động"
      }
],
    mnemonic: 'Bàn chân bước ra khỏi miệng hang đi đến nơi khác: đi, rời đi (去).'
  },

  '校': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰木交',
    components: [
      {
            "char": "木",
            "pinyin": "mù",
            "hanviet": "Mộc",
            "name": "Bộ Mộc",
            "meaning": "Cột gỗ trường học"
      },
      {
            "char": "交",
            "pinyin": "jiāo",
            "hanviet": "Giao",
            "name": "Giao lưu học hỏi",
            "meaning": "Trao đổi tri thức"
      }
],
    mnemonic: 'Dưới mái trường dựng bằng gỗ (木), thầy trò giao lưu (交) truyền dạy tri thức (学校).'
  },

  '馆': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰饣官',
    components: [
      {
            "char": "饣",
            "pinyin": "shí",
            "hanviet": "Thực",
            "name": "Bộ Thực",
            "meaning": "Đồ ăn thức uống"
      },
      {
            "char": "官",
            "pinyin": "guān",
            "hanviet": "Quan",
            "name": "Dinh thự quy mô lớn",
            "meaning": "Nơi chốn trang trọng"
      }
],
    mnemonic: 'Tòa nhà quy mô (官) phục vụ ăn uống nghỉ ngơi hoặc lưu trữ sách vở là quán, viện (饭馆, 图书馆).'
  },

  '商': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱亠⿵冂啇',
    components: [
      {
            "char": "亠",
            "pinyin": "tóu",
            "hanviet": "Đầu",
            "name": "Mái nhà",
            "meaning": "Khu chợ buôn bán"
      },
      {
            "char": "口",
            "pinyin": "kǒu",
            "hanviet": "Khẩu",
            "name": "Bộ Khẩu",
            "meaning": "Thương lượng giá cả"
      }
],
    mnemonic: 'Mọi người quây quần dưới chợ bàn bạc trao đổi hàng hóa buôn bán: thương nghiệp (商店).'
  },

  '店': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_TOP_LEFT,
    ids: '⿸广占',
    components: [
      {
            "char": "广",
            "pinyin": "guǎng",
            "hanviet": "Quảng",
            "name": "Bộ Quảng",
            "meaning": "Tòa nhà mái hiên lớn"
      },
      {
            "char": "占",
            "pinyin": "zhàn",
            "hanviet": "Chiếm",
            "name": "Chiếm cứ mặt bằng",
            "meaning": "Cửa tiệm"
      }
],
    mnemonic: 'Một cơ sở mặt bằng (占) nằm dưới mái hiên rộng (广) mở ra để buôn bán: cửa hàng (商店).'
  },

  '太': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '太',
    components: [
      {
            "char": "大",
            "pinyin": "dà",
            "hanviet": "Đại",
            "name": "To lớn",
            "meaning": "Rộng lớn"
      },
      {
            "char": "丶",
            "pinyin": "diǎn",
            "hanviet": "Chấm",
            "name": "Dấu chấm nhấn mạnh",
            "meaning": "Cực độ"
      }
],
    mnemonic: 'Chữ Đại (大) thêm một dấu chấm ở dưới để nhấn mạnh sự to lớn tột bực: quá, lắm (太好了, 太贵了).'
  },

  '贵': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱中贝',
    components: [
      {
            "char": "中",
            "pinyin": "zhōng",
            "hanviet": "Trung",
            "name": "Ở giữa, hộp giỏ quý",
            "meaning": "Bảo vật"
      },
      {
            "char": "贝",
            "pinyin": "bèi",
            "hanviet": "Bối",
            "name": "Bộ Bối",
            "meaning": "Vỏ sò tiền tệ cổ xưa"
      }
],
    mnemonic: 'Vỏ sò tiền tệ (贝) đựng trong hộp giỏ kín đáo chứng tỏ là vật có giá trị cao, đắt đỏ (贵).'
  },

  '喜': {
    structure: IDS_STRUCTURE_TYPES.TOP_MID_BOTTOM,
    ids: '⿳士豆口',
    components: [
      {
            "char": "士",
            "pinyin": "shì",
            "hanviet": "Sĩ",
            "name": "Bộ Sĩ",
            "meaning": "Người trí thức"
      },
      {
            "char": "豆",
            "pinyin": "dòu",
            "hanviet": "Đậu",
            "name": "Mâm đồ ăn",
            "meaning": "Bữa tiệc mừng"
      },
      {
            "char": "口",
            "pinyin": "kǒu",
            "hanviet": "Khẩu",
            "name": "Miệng cười",
            "meaning": "Hát ca vui vẻ"
      }
],
    mnemonic: 'Trong ngày hội, mọi người mở tiệc (豆) và cất miệng cười hát (口) trong niềm hỷ hoan (喜欢).'
  },

  '欢': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰又欠',
    components: [
      {
            "char": "又",
            "pinyin": "yòu",
            "hanviet": "Hựu",
            "name": "Bàn tay vỗ",
            "meaning": "Vỗ tay tán thưởng"
      },
      {
            "char": "欠",
            "pinyin": "qiàn",
            "hanviet": "Khiếm",
            "name": "Há miệng reo hò",
            "meaning": "Hân hoan"
      }
],
    mnemonic: 'Bàn tay vỗ nhịp (又) cùng miệng há to reo vui (欠) tạo nên sự hoan hỷ, yêu thích (喜欢).'
  },

  '米': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '米',
    components: [
      {
            "char": "米",
            "pinyin": "mǐ",
            "hanviet": "Mễ",
            "name": "Bộ Mễ",
            "meaning": "Hạt thóc hạt gạo tỏa bốn phương"
      }
],
    mnemonic: 'Những hạt gạo trắng ngần tỏa ra từ bông lúa trĩu hạt (米饭).'
  },

  '菜': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱艹采',
    components: [
      {
            "char": "艹",
            "pinyin": "cǎo",
            "hanviet": "Thảo",
            "name": "Bộ Thảo đầu",
            "meaning": "Cây cỏ rau xanh"
      },
      {
            "char": "采",
            "pinyin": "cǎi",
            "hanviet": "Thải",
            "name": "Bàn tay hái lượm",
            "meaning": "Hái rau"
      }
],
    mnemonic: 'Bàn tay hái (采) các đọt rau xanh mơn mởn (艹) để chế biến thành món ăn ngon (中国菜).'
  },

  '会': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱人云',
    components: [
      {
            "char": "人",
            "pinyin": "rén",
            "hanviet": "Nhân",
            "name": "Bộ Nhân",
            "meaning": "Mọi người tụ họp"
      },
      {
            "char": "云",
            "pinyin": "yún",
            "hanviet": "Vân",
            "name": "Lời nói luận bàn",
            "meaning": "Hội tụ đúc kết"
      }
],
    mnemonic: 'Mọi người (人) ngồi lại đàm đạo (云) tích lũy tri thức để biết làm mọi việc (我会说汉语).'
  },

  '做': {
    structure: IDS_STRUCTURE_TYPES.LEFT_MID_RIGHT,
    ids: '⿲亻古攵',
    components: [
      {
            "char": "亻",
            "pinyin": "rén",
            "hanviet": "Nhân",
            "name": "Bộ Nhân đứng",
            "meaning": "Con người"
      },
      {
            "char": "古",
            "pinyin": "gǔ",
            "hanviet": "Cổ",
            "name": "Kinh nghiệm xưa",
            "meaning": "Phương pháp cũ"
      },
      {
            "char": "攵",
            "pinyin": "pū",
            "hanviet": "Phộc",
            "name": "Bàn tay cầm que gõ",
            "meaning": "Hành động thực tế"
      }
],
    mnemonic: 'Con người (亻) vận dụng kinh nghiệm (古) bắt tay vào làm việc (攵) cụ thể (做菜).'
  },

  '怎': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱乍心',
    components: [
      {
            "char": "乍",
            "pinyin": "zhà",
            "hanviet": "Sạ",
            "name": "Bất chợt",
            "meaning": "Sự việc đột ngột"
      },
      {
            "char": "心",
            "pinyin": "xīn",
            "hanviet": "Tâm",
            "name": "Bộ Tâm",
            "meaning": "Tâm tư thắc mắc"
      }
],
    mnemonic: 'Sự việc bất chợt (乍) xảy ra khiến trong lòng (心) nảy sinh câu hỏi: Làm sao, như thế nào? (怎么, 怎么样).'
  },

  '样': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰木羊',
    components: [
      {
            "char": "木",
            "pinyin": "mù",
            "hanviet": "Mộc",
            "name": "Bộ Mộc",
            "meaning": "Khuôn mẫu bằng gỗ"
      },
      {
            "char": "羊",
            "pinyin": "yáng",
            "hanviet": "Dương",
            "name": "Con cừu",
            "meaning": "Hình mẫu thanh âm"
      }
],
    mnemonic: 'Khuôn gỗ (木) tạc hình con cừu (羊) tạo thành hình dáng mẫu mực (怎么样).'
  },

  '冷': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰冫令',
    components: [
      {
            "char": "冫",
            "pinyin": "bīng",
            "hanviet": "Băng",
            "name": "Bộ Băng",
            "meaning": "Nước đá đông lạnh giá"
      },
      {
            "char": "令",
            "pinyin": "lìng",
            "hanviet": "Lệnh",
            "name": "Mệnh lệnh (thanh âm)",
            "meaning": "Âm đọc ling"
      }
],
    mnemonic: 'Băng giá lạnh buốt (冫) khiến người ta run rẩy co ro (冷).'
  },

  '热': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱执灬',
    components: [
      {
            "char": "执",
            "pinyin": "zhí",
            "hanviet": "Chấp",
            "name": "Cầm nắm",
            "meaning": "Giữ chặt"
      },
      {
            "char": "灬",
            "pinyin": "huǒ",
            "hanviet": "Hỏa",
            "name": "Bốn chấm hỏa",
            "meaning": "Ngọn lửa nóng rực"
      }
],
    mnemonic: 'Ngọn lửa hồng rực (灬) đốt nóng bừng cả không gian: nóng nực, nhiệt tình (热).'
  },

  '雨': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '雨',
    components: [
      {
            "char": "一",
            "pinyin": "yī",
            "hanviet": "Nhất",
            "name": "Trời mây",
            "meaning": "Bầu trời u ám"
      },
      {
            "char": "冂",
            "pinyin": "jiōng",
            "hanviet": "Quynh",
            "name": "Khoảng không gian",
            "meaning": "Mây phủ"
      },
      {
            "char": "丨",
            "pinyin": "gǔn",
            "hanviet": "Cổn",
            "name": "Sợi mưa rơi",
            "meaning": "Mưa tuôn"
      },
      {
            "char": "灬",
            "pinyin": "diǎn",
            "hanviet": "Chấm",
            "name": "Bốn giọt mưa rơi",
            "meaning": "Giọt nước mưa"
      }
],
    mnemonic: 'Từ vòm mây trên trời rơi xuống bốn giọt nước mưa tí tách: trời mưa (下雨).'
  },

  '电': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '电',
    components: [
      {
            "char": "日",
            "pinyin": "rì",
            "hanviet": "Nhật",
            "name": "Mặt trời",
            "meaning": "Vùng mây sét"
      },
      {
            "char": "乚",
            "pinyin": "háo",
            "hanviet": "Ất móc",
            "name": "Tia chớp ngoằn ngoèo",
            "meaning": "Tia sét"
      }
],
    mnemonic: 'Tia sét xé toạc bầu trời phóng xuống mặt đất: điện lực, tia chớp (电影, 电话).'
  },

  '影': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰景彡',
    components: [
      {
            "char": "景",
            "pinyin": "jǐng",
            "hanviet": "Cảnh",
            "name": "Phong cảnh rực rỡ",
            "meaning": "Ánh sáng"
      },
      {
            "char": "彡",
            "pinyin": "shān",
            "hanviet": "Tam",
            "name": "Bộ Sam",
            "meaning": "Ba vệt bóng đổ mờ ảo"
      }
],
    mnemonic: 'Ánh sáng rọi vào phong cảnh (景) tạo nên những vệt bóng đổ nghệ thuật (彡): hình ảnh, bóng hình (电影).'
  },

  '都': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰者阝',
    components: [
      {
            "char": "者",
            "pinyin": "zhě",
            "hanviet": "Giả",
            "name": "Con người, nhân dân",
            "meaning": "Mọi người"
      },
      {
            "char": "阝",
            "pinyin": "yì",
            "hanviet": "Ấp",
            "name": "Bộ Ấp",
            "meaning": "Thành thị, vùng đất"
      }
],
    mnemonic: 'Tất cả nhân dân (者) cùng tụ hội về nơi đô thành (阝): đều, tất cả (我们都是学生).'
  },

  '很': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰彳艮',
    components: [
      {
            "char": "彳",
            "pinyin": "chì",
            "hanviet": "Xích",
            "name": "Bộ Xích",
            "meaning": "Bước chân bước đi"
      },
      {
            "char": "艮",
            "pinyin": "gèn",
            "hanviet": "Cấn",
            "name": "Cứng cỏi, kiên định",
            "meaning": "Cao độ"
      }
],
    mnemonic: 'Bước chân (彳) kiên quyết tiến tới mức độ cao nhất: rất, lắm (很好).'
  },

  '真': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱十具',
    components: [
      {
            "char": "十",
            "pinyin": "shí",
            "hanviet": "Thập",
            "name": "Bộ Thập",
            "meaning": "Hoàn mỹ"
      },
      {
            "char": "目",
            "pinyin": "mù",
            "hanviet": "Mục",
            "name": "Mắt nhìn thấy rõ",
            "meaning": "Chân thực"
      },
      {
            "char": "八",
            "pinyin": "bā",
            "hanviet": "Bát",
            "name": "Nền tảng chân đứng",
            "meaning": "Vững vàng"
      }
],
    mnemonic: 'Mười phần (十) đều tận mắt (目) chứng kiến rõ ràng: thật, chân thực (真好).'
  },

  '考': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱耂丂',
    components: [
      {
            "char": "耂",
            "pinyin": "lǎo",
            "hanviet": "Lão",
            "name": "Bộ Lão",
            "meaning": "Bậc thầy dày dặn kinh nghiệm"
      },
      {
            "char": "丂",
            "pinyin": "kǎo",
            "hanviet": "Khảo",
            "name": "Khảo nghiệm, thử thách",
            "meaning": "Đánh giá năng lực"
      }
],
    mnemonic: 'Bậc thầy lớn tuổi (耂) đặt ra đề bài khảo sát kiểm tra học trò (考试).'
  },

  '试': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰讠式',
    components: [
      {
            "char": "讠",
            "pinyin": "yán",
            "hanviet": "Ngôn",
            "name": "Bộ Ngôn",
            "meaning": "Lời văn, câu hỏi"
      },
      {
            "char": "式",
            "pinyin": "shì",
            "hanviet": "Thức",
            "name": "Quy chuẩn, công thức",
            "meaning": "Chuẩn mực"
      }
],
    mnemonic: 'Dùng lời văn và câu hỏi (讠) theo đúng quy chuẩn (式) để thi thố, thử nghiệm (考试).'
  },

  '准': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰冫隹',
    components: [
      {
            "char": "冫",
            "pinyin": "bīng",
            "hanviet": "Băng",
            "name": "Bộ Băng",
            "meaning": "Đo lường như mực nước đóng băng"
      },
      {
            "char": "隹",
            "pinyin": "zhuī",
            "hanviet": "Chuy",
            "name": "Con chim đuôi ngắn",
            "meaning": "Thước đo chuẩn xác"
      }
],
    mnemonic: 'Cân đo chính xác đến từng giọt băng (冫) như đàn chim định hướng (隹): chuẩn bị, chuẩn mực (准备).'
  },

  '备': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱夂田',
    components: [
      {
            "char": "夂",
            "pinyin": "zhǐ",
            "hanviet": "Tuy",
            "name": "Bước chân chuẩn bị",
            "meaning": "Hành động cẩn trọng"
      },
      {
            "char": "田",
            "pinyin": "tián",
            "hanviet": "Điền",
            "name": "Ruộng đồng, kho bãi",
            "meaning": "Tích trữ lương thảo"
      }
],
    mnemonic: 'Bàn chân (夂) đi lại kiểm tra ruộng đồng kho thóc (田) đầy đủ trước khi lên đường: chuẩn bị (准备).'
  },

  '题': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰是页',
    components: [
      {
            "char": "是",
            "pinyin": "shì",
            "hanviet": "Thị",
            "name": "Chân lý, đúng đắn",
            "meaning": "Khẳng định"
      },
      {
            "char": "页",
            "pinyin": "yè",
            "hanviet": "Hiệt",
            "name": "Bộ Hiệt",
            "meaning": "Trang giấy, phần đầu đề"
      }
],
    mnemonic: 'Phần mở đầu trang sách (页) ghi lại vấn đề cốt lõi cần giải quyết: đề mục, câu hỏi (问题).'
  },

  '开': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '开',
    components: [
      {
            "char": "一",
            "pinyin": "yī",
            "hanviet": "Nhất",
            "name": "Thanh cài cửa",
            "meaning": "Chốt cổng"
      },
      {
            "char": "廾",
            "pinyin": "gǒng",
            "hanviet": "Củng",
            "name": "Hai bàn tay mở ra",
            "meaning": "Mở cửa"
      }
],
    mnemonic: 'Hai bàn tay nhấc thanh chốt ngang mở toang cánh cửa đón ánh sáng: bắt đầu, mở ra (开始).'
  },

  '始': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰女台',
    components: [
      {
            "char": "女",
            "pinyin": "nǚ",
            "hanviet": "Nữ",
            "name": "Bộ Nữ",
            "meaning": "Người mẹ"
      },
      {
            "char": "台",
            "pinyin": "tái",
            "hanviet": "Thai",
            "name": "Cái bệ thai nghén",
            "meaning": "Khởi đầu sự sống"
      }
],
    mnemonic: 'Người mẹ (女) mang thai phôi thai sự sống (台) chính là khởi đầu của vạn vật: ban đầu (开始).'
  },

  '这': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_BOTTOM_LEFT,
    ids: '⿺辶文',
    components: [
      {
            "char": "辶",
            "pinyin": "chuò",
            "hanviet": "Quai sước",
            "name": "Bộ Quai sước",
            "meaning": "Bước chân tiến tới"
      },
      {
            "char": "文",
            "pinyin": "wén",
            "hanviet": "Văn",
            "name": "Văn tự, dấu vết",
            "meaning": "Chỉ dấu ngay đây"
      }
],
    mnemonic: 'Bước chân (辶) tiến ngay tới vị trí có dấu vết (文) này: đây, này (这).'
  },

  '那': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰冄阝',
    components: [
      {
            "char": "冄",
            "pinyin": "rǎn",
            "hanviet": "Nhiễm",
            "name": "Bộ phận bên trái",
            "meaning": "Xa xăm"
      },
      {
            "char": "阝",
            "pinyin": "yì",
            "hanviet": "Ấp",
            "name": "Bộ Ấp",
            "meaning": "Vùng đất phương xa"
      }
],
    mnemonic: 'Chỉ về vùng đất xa xôi bên kia: kia, đó (那).'
  },

  '里': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱田土',
    components: [
      {
            "char": "田",
            "pinyin": "tián",
            "hanviet": "Điền",
            "name": "Bộ Điền",
            "meaning": "Thửa ruộng"
      },
      {
            "char": "土",
            "pinyin": "tǔ",
            "hanviet": "Thổ",
            "name": "Bộ Thổ",
            "meaning": "Mảnh đất"
      }
],
    mnemonic: 'Thửa ruộng (田) trên mảnh đất quê hương (土) tạo thành đơn vị dặm đường hoặc bên trong (哪里).'
  },
  // =========================================================================
  // HSK 2 EXPANSION — TASK 22.03 STANDARDIZATION
  // =========================================================================
  '床': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_TOP_LEFT,
    ids: '⿸广木',
    components: [
      { char: '广', pinyin: 'guǎng', hanviet: 'Quảng', name: 'Bộ Quảng', meaning: 'Ngôi nhà rộng lớn' },
      { char: '木', pinyin: 'mù', hanviet: 'Mộc', name: 'Bộ Mộc', meaning: 'Cây gỗ' }
    ],
    mnemonic: 'Chiếc giường bằng gỗ (木) được đặt trong căn nhà (广).'
  },
  '睡': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰目垂',
    components: [
      { char: '目', pinyin: 'mù', hanviet: 'Mục', name: 'Bộ Mục', meaning: 'Mắt, thị giác' },
      { char: '垂', pinyin: 'chuí', hanviet: 'Thùy', name: 'Rủ xuống', meaning: 'Hạ thấp xuống' }
    ],
    mnemonic: 'Đôi mắt (目) trĩu mí rủ xuống (垂) chính là chìm vào giấc ngủ.'
  },
  '坐': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱从土',
    components: [
      { char: '从', pinyin: 'cóng', hanviet: 'Tòng', name: 'Hai người', meaning: 'Người này đi theo người kia' },
      { char: '土', pinyin: 'tǔ', hanviet: 'Thổ', name: 'Bộ Thổ', meaning: 'Mảnh đất' }
    ],
    mnemonic: 'Hai người (从) cùng ngồi tựa bên nhau trên mảnh đất (土).'
  },
  '铁': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰钅失',
    components: [
      { char: '钅', pinyin: 'jīn', hanviet: 'Kim', name: 'Bộ Kim', meaning: 'Kim loại' },
      { char: '失', pinyin: 'shī', hanviet: 'Thất', name: 'Mất mát', meaning: 'Mất đi, bỏ đi' }
    ],
    mnemonic: 'Kim loại (钅) sau khi mài mất đi (失) lớp rỉ sét sẽ trở thành sắt thép sáng bóng.'
  },
  '远': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_BOTTOM_LEFT,
    ids: '⿺辶元',
    components: [
      { char: '辶', pinyin: 'chuò', hanviet: 'Sước', name: 'Bộ Quai sước', meaning: 'Bước chân di chuyển' },
      { char: '元', pinyin: 'yuán', hanviet: 'Nguyên', name: 'Khởi đầu', meaning: 'Nguồn cội, ban đầu' }
    ],
    mnemonic: 'Bước chân (辶) cất bước đi đến tận cội nguồn (元) xa xôi.'
  },
  '近': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_BOTTOM_LEFT,
    ids: '⿺辶斤',
    components: [
      { char: '辶', pinyin: 'chuò', hanviet: 'Sước', name: 'Bộ Quai sước', meaning: 'Bước chân di chuyển' },
      { char: '斤', pinyin: 'jīn', hanviet: 'Cân', name: 'Cái rìu', meaning: 'Đơn vị đo hoặc công cụ' }
    ],
    mnemonic: 'Bước chân (辶) chỉ cách một cái rìu (斤) là khoảng cách rất gần gũi.'
  },
  '左': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_TOP_LEFT,
    ids: '⿸𠂇工',
    components: [
      { char: '𠂇', pinyin: 'yòu', hanviet: 'Tả', name: 'Bàn tay trái', meaning: 'Bàn tay phụ giúp' },
      { char: '工', pinyin: 'gōng', hanviet: 'Công', name: 'Bộ Công', meaning: 'Thợ thuyền, công việc' }
    ],
    mnemonic: 'Bàn tay trái (𠂇) cầm thước trợ giúp công việc chế tác của người thợ (工).'
  },
  '右': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_TOP_LEFT,
    ids: '⿸𠂇口',
    components: [
      { char: '𠂇', pinyin: 'yòu', hanviet: 'Hữu', name: 'Bàn tay phải', meaning: 'Bàn tay thuận' },
      { char: '口', pinyin: 'kǒu', hanviet: 'Khẩu', name: 'Bộ Khẩu', meaning: 'Miệng ăn' }
    ],
    mnemonic: 'Bàn tay phải (𠂇) linh hoạt cầm đũa đưa thức ăn vào miệng (口).'
  },
  '停': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰亻亭',
    components: [
      { char: '亻', pinyin: 'rén', hanviet: 'Nhân', name: 'Bộ Nhân đứng', meaning: 'Con người' },
      { char: '亭', pinyin: 'tíng', hanviet: 'Đình', name: 'Ngôi đình', meaning: 'Đình nghỉ mát bên đường' }
    ],
    mnemonic: 'Người đi đường (亻) dừng chân nghỉ ngơi trong ngôi đình (亭).'
  },
  '服': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰月⺋',
    components: [
      { char: '月', pinyin: 'ròu', hanviet: 'Nhục', name: 'Bộ Nguyệt', meaning: 'Cơ thể, da thịt' },
      { char: '⺋', pinyin: 'jié', hanviet: 'Tiết', name: 'Bộ Tiết', meaning: 'Khuôn phép, tuân phục' }
    ],
    mnemonic: 'Áo quần (服) ôm vừa vặn thân thể (月) và giữ gìn nề nếp lễ nghi (⺋).'
  },
  '单': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱丷甲',
    components: [
      { char: '丷', pinyin: 'bā', hanviet: 'Bát', name: 'Hai chấm', meaning: 'Đánh dấu phân tách' },
      { char: '甲', pinyin: 'jiǎ', hanviet: 'Giáp', name: 'Áo giáp / Đứng đầu', meaning: 'Vỏ bọc hoặc bảng tên' }
    ],
    mnemonic: 'Tờ giấy đơn giản (单) ghi tên danh sách hoặc thực đơn.'
  },
  '辣': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰辛束',
    components: [
      { char: '辛', pinyin: 'xīn', hanviet: 'Tân', name: 'Bộ Tân', meaning: 'Vị cay nồng, cay đắng' },
      { char: '束', pinyin: 'shù', hanviet: 'Thúc', name: 'Bó chặt', meaning: 'Gói buộc lại' }
    ],
    mnemonic: 'Vị cay gắt (辛) như bó chặt (束) đầu lưỡi khiến toát mồ hôi.'
  },
  '甜': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰舌甘',
    components: [
      { char: '舌', pinyin: 'shé', hanviet: 'Thiệt', name: 'Bộ Thiệt', meaning: 'Chiếc lưỡi' },
      { char: '甘', pinyin: 'gān', hanviet: 'Cam', name: 'Bộ Cam', meaning: 'Vị ngọt dịu' }
    ],
    mnemonic: 'Chiếc lưỡi (舌) nếm được vị cam ngọt (甘) ngào của bánh kẹo.'
  },
  '衣': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '衣',
    components: [
      { char: '衣', pinyin: 'yī', hanviet: 'Y', name: 'Bộ Y', meaning: 'Áo, trang phục' }
    ],
    mnemonic: 'Hình vẽ mô phỏng chiếc áo choàng thời cổ đại.'
  },
  '穿': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱穴牙',
    components: [
      { char: '穴', pinyin: 'xué', hanviet: 'Huyệt', name: 'Bộ Huyệt', meaning: 'Hang động, lỗ hổng' },
      { char: '牙', pinyin: 'yá', hanviet: 'Nha', name: 'Bộ Nha', meaning: 'Răng nanh' }
    ],
    mnemonic: 'Răng nanh (牙) cắn thủng lỗ hang (穴), mang nghĩa xỏ qua để mặc quần áo.'
  },
  '宜': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱宀且',
    components: [
      { char: '宀', pinyin: 'mián', hanviet: 'Miên', name: 'Bộ Miên', meaning: 'Mái nhà' },
      { char: '且', pinyin: 'qiě', hanviet: 'Thả', name: 'Bàn tế', meaning: 'Sắp đặt tế tự' }
    ],
    mnemonic: 'Dưới mái nhà (宀) xếp đặt đồ đạc (且) gọn gàng rất tiện nghi, thích hợp.'
  },
  '信': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰亻言',
    components: [
      { char: '亻', pinyin: 'rén', hanviet: 'Nhân', name: 'Bộ Nhân đứng', meaning: 'Con người' },
      { char: '言', pinyin: 'yán', hanviet: 'Ngôn', name: 'Bộ Ngôn', meaning: 'Lời nói' }
    ],
    mnemonic: 'Người (亻) nói lời nào (言) giữ đúng lời ấy là người có chữ tín (信).'
  },
  '共': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱卄八',
    components: [
      { char: '卄', pinyin: 'niàn', hanviet: 'Trấp', name: 'Hai mươi', meaning: 'Nhiều người' },
      { char: '八', pinyin: 'bā', hanviet: 'Bát', name: 'Bộ Bát', meaning: 'Đôi bàn tay dâng lên' }
    ],
    mnemonic: 'Đôi bàn tay (八) cùng nâng bó cỏ chung sức tạo thành tổng cộng (共).'
  },
  '晴': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰日青',
    components: [
      { char: '日', pinyin: 'rì', hanviet: 'Nhật', name: 'Bộ Nhật', meaning: 'Mặt trời' },
      { char: '青', pinyin: 'qīng', hanviet: 'Thanh', name: 'Màu xanh biếc', meaning: 'Bầu trời trong xanh' }
    ],
    mnemonic: 'Ánh mặt trời (日) chiếu sáng trên nền trời xanh biếc (青) là ngày nắng đẹp trời quang (晴).'
  },
  '雪': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱雨彐',
    components: [
      { char: '雨', pinyin: 'yǔ', hanviet: 'Vũ', name: 'Bộ Vũ', meaning: 'Cơn mưa' },
      { char: '彐', pinyin: 'jì', hanviet: 'Kệ', name: 'Bàn tay quét', meaning: 'Bàn tay gom lại' }
    ],
    mnemonic: 'Nước mưa (雨) đông lại thành tinh thể tuyết rơi có thể dùng tay (彐) gom thành hình khối.'
  },
  '比': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰匕匕',
    components: [
      { char: '匕', pinyin: 'bǐ', hanviet: 'Chủy', name: 'Bộ Chủy', meaning: 'Chiếc muỗng, chiếc thìa' },
      { char: '匕', pinyin: 'bǐ', hanviet: 'Chủy', name: 'Bộ Chủy', meaning: 'Chiếc muỗng thứ hai' }
    ],
    mnemonic: 'Hai chiếc muỗng (匕) đặt cạnh nhau để so sánh kích thước lớn nhỏ.'
  },
  '更': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '⿻一𣲖',
    components: [
      { char: '更', pinyin: 'gèng', hanviet: 'Canh', name: 'Chữ Canh', meaning: 'Đổi mới, càng ngày càng' }
    ],
    mnemonic: 'Tiếng gõ mõ sang canh giờ mới, tượng trưng cho sự tiến triển càng lúc càng tăng.'
  },
  '最': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱日取',
    components: [
      { char: '日', pinyin: 'rì', hanviet: 'Nhật', name: 'Bộ Nhật', meaning: 'Mặt trời' },
      { char: '取', pinyin: 'qǔ', hanviet: 'Thủ', name: 'Lấy, đoạt lấy', meaning: 'Chọn lấy tinh hoa' }
    ],
    mnemonic: 'Dưới ánh mặt trời (日) chọn lấy (取) điều tinh túy, xuất sắc nhất (最).'
  },
  '病': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_TOP_LEFT,
    ids: '⿸疒丙',
    components: [
      { char: '疒', pinyin: 'nè', hanviet: 'Nạch', name: 'Bộ Nạch', meaning: 'Giường bệnh tật' },
      { char: '丙', pinyin: 'bǐng', hanviet: 'Bính', name: 'Lửa Bính', meaning: 'Sức nóng, sốt' }
    ],
    mnemonic: 'Nằm trên giường bệnh (疒) người sốt nóng như lửa Bính (丙) là biểu hiện của ốm đau.'
  },
  '药': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱艹约',
    components: [
      { char: '艹', pinyin: 'cǎo', hanviet: 'Thảo', name: 'Bộ Thảo', meaning: 'Cây cỏ thảo dược' },
      { char: '约', pinyin: 'yuē', hanviet: 'Ước', name: 'Hẹn ước', meaning: 'Quy ước, định lượng' }
    ],
    mnemonic: 'Cây cỏ thảo dược (艹) được điều phối đúng liều lượng quy ước (约) để chữa lành bệnh tật.'
  },
  '息': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱自心',
    components: [
      { char: '自', pinyin: 'zì', hanviet: 'Tự', name: 'Chiếc mũi', meaning: 'Cái mũi thở khí' },
      { char: '心', pinyin: 'xīn', hanviet: 'Tâm', name: 'Bộ Tâm', meaning: 'Trái tim' }
    ],
    mnemonic: 'Mũi (自) hít thở đều đặn nuôi dưỡng trái tim (心) khỏe mạnh là trạng thái nghỉ ngơi tĩnh dưỡng.'
  },
  '关': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱丷天',
    components: [
      { char: '丷', pinyin: 'bā', hanviet: 'Bát', name: 'Hai then cài', meaning: 'Khóa then cửa' },
      { char: '天', pinyin: 'tiān', hanviet: 'Thiên', name: 'Trời, cánh cổng lớn', meaning: 'Cửa ải' }
    ],
    mnemonic: 'Khóa then (丷) cài chặt cánh cửa ải trời (天) lại để giữ bình an.'
  },
  '拿': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱合手',
    components: [
      { char: '合', pinyin: 'hé', hanviet: 'Hợp', name: 'Chữ Hợp', meaning: 'Chụm lại, vừa khít' },
      { char: '手', pinyin: 'shǒu', hanviet: 'Thủ', name: 'Bộ Thủ', meaning: 'Bàn tay' }
    ],
    mnemonic: 'Bàn tay chụm lại (合 + 手) để cầm nắm chắc chắn đồ vật.'
  },
  '过': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_BOTTOM_LEFT,
    ids: '⿺辶寸',
    components: [
      { char: '辶', pinyin: 'chuò', hanviet: 'Sước', name: 'Bộ Quai sước', meaning: 'Bước chân di chuyển' },
      { char: '寸', pinyin: 'cùn', hanviet: 'Thốn', name: 'Tấc đất, thước đo', meaning: 'Khoảng cách' }
    ],
    mnemonic: 'Bước chân (辶) đã đi qua từng tấc (寸) đường tượng trưng cho kinh nghiệm đã từng trải qua.'
  },
  '次': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰冫欠',
    components: [
      { char: '冫', pinyin: 'bīng', hanviet: 'Băng', name: 'Bộ Băng', meaning: 'Hai giọt sương băng' },
      { char: '欠', pinyin: 'qiàn', hanviet: 'Khiếm', name: 'Bộ Khiếm', meaning: 'Thở hắt ra' }
    ],
    mnemonic: 'Giọt băng (冫) tan rồi thở phào (欠), lần lượt từng trải nghiệm trôi qua.'
  },
  '因': {
    structure: IDS_STRUCTURE_TYPES.FULL_ENCLOSURE,
    ids: '⿴囗大',
    components: [
      { char: '囗', pinyin: 'wéi', hanviet: 'Vi', name: 'Bộ Vi', meaning: 'Khung bao bọc bốn bề' },
      { char: '大', pinyin: 'dà', hanviet: 'Đại', name: 'Người lớn', meaning: 'Con người' }
    ],
    mnemonic: 'Người lớn (大) nằm tựa trên chiếc chiếu trong bốn bức tường (囗) là căn nguyên, lý do khởi đầu.'
  },
  '但': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰亻旦',
    components: [
      { char: '亻', pinyin: 'rén', hanviet: 'Nhân', name: 'Bộ Nhân đứng', meaning: 'Con người' },
      { char: '旦', pinyin: 'dàn', hanviet: 'Đán', name: 'Buổi sớm', meaning: 'Mặt trời mọc trên mặt đất' }
    ],
    mnemonic: 'Con người (亻) nhìn mặt trời buổi sớm (旦) đổi sắc, thể hiện sự chuyển ngoặt ý tứ: nhưng mà.'
  },
  '特': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰牜寺',
    components: [
      { char: '牜', pinyin: 'niú', hanviet: 'Ngưu', name: 'Bộ Ngưu', meaning: 'Con trâu, con bò' },
      { char: '寺', pinyin: 'sì', hanviet: 'Tự', name: 'Ngôi chùa', meaning: 'Nơi tôn nghiêm' }
    ],
    mnemonic: 'Con bò đực dũng mãnh (牜) trong sân chùa (寺) mang khí chất đặc biệt.'
  },
  '助': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰且力',
    components: [
      { char: '且', pinyin: 'qiě', hanviet: 'Thả', name: 'Bàn thờ tổ tiên', meaning: 'Dâng phẩm vật' },
      { char: '力', pinyin: 'lì', hanviet: 'Lực', name: 'Bộ Lực', meaning: 'Sức lực' }
    ],
    mnemonic: 'Đem đồ tế lễ (且) và dùng toàn bộ sức lực (力) để tương trợ, giúp đỡ người hoạn nạn.'
  },
  '通': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_BOTTOM_LEFT,
    ids: '⿺辶甬',
    components: [
      { char: '辶', pinyin: 'chuò', hanviet: 'Sước', name: 'Bộ Quai sước', meaning: 'Bước chân' },
      { char: '甬', pinyin: 'yǒng', hanviet: 'Dũng', name: 'Lối đi hình ống chuông', meaning: 'Thông suốt' }
    ],
    mnemonic: 'Bước chân (辶) đi qua lối đường hầm thông suốt (甬) biểu thị sự hanh thông, vượt qua kỳ thi.'
  },
  '贺': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱加贝',
    components: [
      { char: '加', pinyin: 'jiā', hanviet: 'Gia', name: 'Gia thêm', meaning: 'Thêm lời chúc tụng' },
      { char: '贝', pinyin: 'bèi', hanviet: 'Bối', name: 'Bộ Bối', meaning: 'Vỏ sò, tiền bạc' }
    ],
    mnemonic: 'Thêm lời chúc mừng (加) cùng quà tặng quý báu (贝) để chúc hạ niềm vui thành công.'
  }

,

  // ==================== HSK 3 INTERMEDIATE EXPANSION (TASK 22.04) ====================
  '护': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰扌户',
    components: [
        {
            "char": "扌",
            "pinyin": "shǒu",
            "hanviet": "Thủ",
            "name": "Bộ Thủ (tay)",
            "meaning": "Bàn tay hành động che chở"
        },
        {
            "char": "户",
            "pinyin": "hù",
            "hanviet": "Hộ",
            "name": "Bộ Hộ (cửa)",
            "meaning": "Cánh cửa của hộ gia đình"
        }
    ],
    mnemonic: 'Bàn tay (扌) che chở bảo vệ cho cánh cửa từng hộ gia đình (户).'
  },

  '照': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱昭灬',
    components: [
        {
            "char": "昭",
            "pinyin": "zhāo",
            "hanviet": "Chiêu",
            "name": "Chữ Chiêu",
            "meaning": "Sáng rõ, quang minh"
        },
        {
            "char": "灬",
            "pinyin": "huǒ",
            "hanviet": "Hỏa",
            "name": "Bộ Hỏa (4 chấm)",
            "meaning": "Lửa phát sáng sưởi ấm"
        }
    ],
    mnemonic: 'Ngọn lửa (灬) tỏa sáng rực rỡ (昭) chiếu rọi vạn vật.'
  },

  '飞': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '飞',
    components: [
        {
            "char": "飞",
            "pinyin": "fēi",
            "hanviet": "Phi",
            "name": "Bộ Phi",
            "meaning": "Đôi cánh chim đang vỗ cánh bay"
        }
    ],
    mnemonic: 'Hình tượng cánh chim đang vỗ cánh bay lượn trên bầu trời.'
  },

  '进': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_BOTTOM_LEFT,
    ids: '⿺辶井',
    components: [
        {
            "char": "辶",
            "pinyin": "chuò",
            "hanviet": "Quai sước",
            "name": "Bộ Quai sước",
            "meaning": "Bước chân di chuyển"
        },
        {
            "char": "井",
            "pinyin": "jǐng",
            "hanviet": "Tỉnh",
            "name": "Chữ Tỉnh (cái giếng)",
            "meaning": "Giếng nước đầu làng"
        }
    ],
    mnemonic: 'Từng bước chân (辶) tiến về phía giếng nước (井) đầu làng.'
  },

  '出': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '出',
    components: [
        {
            "char": "出",
            "pinyin": "chū",
            "hanviet": "Xuất",
            "name": "Bộ Khảm",
            "meaning": "Núi non trồi lên trên đất"
        }
    ],
    mnemonic: 'Hai ngọn núi (山) nhô lên khỏi mặt đất: xuất hiện, đi ra ngoài.'
  },

  '跑': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰𧾷包',
    components: [
        {
            "char": "𧾷",
            "pinyin": "zú",
            "hanviet": "Túc",
            "name": "Bộ Túc (chân)",
            "meaning": "Bàn chân vận động"
        },
        {
            "char": "包",
            "pinyin": "bāo",
            "hanviet": "Bao",
            "name": "Chữ Bao (gói)",
            "meaning": "Bọc, cuộn tròn bứt tốc"
        }
    ],
    mnemonic: 'Đôi chân (𧾷) nhấc bổng cuộn tròn (包) lao nhanh về phía trước: chạy bộ.'
  },

  '带': {
    structure: IDS_STRUCTURE_TYPES.TOP_MID_BOTTOM,
    ids: '⿳艹冖巾',
    components: [
        {
            "char": "艹",
            "pinyin": "cǎo",
            "hanviet": "Thảo",
            "name": "Bộ Thảo",
            "meaning": "Dải hoa văn trang sức"
        },
        {
            "char": "冖",
            "pinyin": "mì",
            "hanviet": "Mịch",
            "name": "Bộ Mịch",
            "meaning": "Khăn trùm"
        },
        {
            "char": "巾",
            "pinyin": "jīn",
            "hanviet": "Cân",
            "name": "Bộ Cân",
            "meaning": "Dải khăn thắt lưng mang theo"
        }
    ],
    mnemonic: 'Dải lụa vải (巾) trang trí hoa văn (艹) thắt quanh hông mang theo bên mình.'
  },

  '独': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰犭虫',
    components: [
        {
            "char": "犭",
            "pinyin": "quǎn",
            "hanviet": "Khuyển",
            "name": "Bộ Khuyển",
            "meaning": "Thú hoang dã"
        },
        {
            "char": "虫",
            "pinyin": "chóng",
            "hanviet": "Trùng",
            "name": "Bộ Trùng",
            "meaning": "Côn trùng sâu bọ"
        }
    ],
    mnemonic: 'Loài thú hoang (犭) lẫn loài sâu bọ (虫) thường sống đơn độc, tự mình sinh tồn.'
  },

  '解': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰角𧢲',
    components: [
        {
            "char": "角",
            "pinyin": "jiǎo",
            "hanviet": "Giác",
            "name": "Bộ Giác",
            "meaning": "Sừng động vật"
        },
        {
            "char": "刀",
            "pinyin": "dāo",
            "hanviet": "Đao",
            "name": "Bộ Đao",
            "meaning": "Con dao bén"
        },
        {
            "char": "牛",
            "pinyin": "niú",
            "hanviet": "Ngưu",
            "name": "Bộ Ngưu",
            "meaning": "Con trâu"
        }
    ],
    mnemonic: 'Dùng dao nhọn (刀) xẻ sừng (角) và mổ trâu (牛): giải phẫu, giải thích thấu đáo.'
  },

  '完': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱宀元',
    components: [
        {
            "char": "宀",
            "pinyin": "mián",
            "hanviet": "Miên",
            "name": "Bộ Miên",
            "meaning": "Mái nhà che chở"
        },
        {
            "char": "元",
            "pinyin": "yuán",
            "hanviet": "Nguyên",
            "name": "Chữ Nguyên",
            "meaning": "Khởi đầu, nguyên vẹn trọn lành"
        }
    ],
    mnemonic: 'Mái nhà (宀) đã xây dựng trọn vẹn từ gốc (元): hoàn thành, hoàn tất.'
  },

  '得': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰彳㝵',
    components: [
        {
            "char": "彳",
            "pinyin": "chì",
            "hanviet": "Xích",
            "name": "Bộ Xích",
            "meaning": "Bước chân chậm rãi"
        },
        {
            "char": "日",
            "pinyin": "rì",
            "hanviet": "Nhật",
            "name": "Bộ Nhật",
            "meaning": "Mặt trời quang minh"
        },
        {
            "char": "寸",
            "pinyin": "cùn",
            "hanviet": "Thốn",
            "name": "Bộ Thốn",
            "meaning": "Bàn tay tấc gang nắm bắt"
        }
    ],
    mnemonic: 'Mỗi bước đi (彳) dưới ánh mặt trời (日) đều dùng tay (寸) thu được thành quả.'
  },

  '楚': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱林疋',
    components: [
        {
            "char": "林",
            "pinyin": "lín",
            "hanviet": "Lâm",
            "name": "Bộ Lâm",
            "meaning": "Rừng cây xanh tốt"
        },
        {
            "char": "疋",
            "pinyin": "shū",
            "hanviet": "Sơ",
            "name": "Bộ Sơ (chân)",
            "meaning": "Đôi chân bước qua"
        }
    ],
    mnemonic: 'Đôi chân (疋) băng qua cánh rừng rậm (林) nhìn thấy cảnh vật rành mạch rõ ràng (清楚).'
  },

  '把': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰扌巴',
    components: [
        {
            "char": "扌",
            "pinyin": "shǒu",
            "hanviet": "Thủ",
            "name": "Bộ Thủ (tay)",
            "meaning": "Bàn tay nắm lấy"
        },
        {
            "char": "巴",
            "pinyin": "bā",
            "hanviet": "Ba",
            "name": "Chữ Ba",
            "meaning": "Bám dính, đuôi sam"
        }
    ],
    mnemonic: 'Bàn tay (扌) nắm chặt lấy đối tượng (巴) để xử lý, tác động (câu chữ 把).'
  },

  '洗': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰氵先',
    components: [
        {
            "char": "氵",
            "pinyin": "shuǐ",
            "hanviet": "Thủy",
            "name": "Bộ Thủy",
            "meaning": "Ba chấm nước rửa trôi"
        },
        {
            "char": "先",
            "pinyin": "xiān",
            "hanviet": "Tiên",
            "name": "Chữ Tiên",
            "meaning": "Trước tiên"
        }
    ],
    mnemonic: 'Trước tiên (先) phải dùng nước sạch (氵) để rửa ráy, giặt giũ (洗).'
  },

  '搬': {
    structure: IDS_STRUCTURE_TYPES.LEFT_MID_RIGHT,
    ids: '⿲扌舟殳',
    components: [
        {
            "char": "扌",
            "pinyin": "shǒu",
            "hanviet": "Thủ",
            "name": "Bộ Thủ",
            "meaning": "Bàn tay nâng vác"
        },
        {
            "char": "舟",
            "pinyin": "zhōu",
            "hanviet": "Chu",
            "name": "Bộ Chu (thuyền)",
            "meaning": "Thuyền chở tải"
        },
        {
            "char": "殳",
            "pinyin": "shū",
            "hanviet": "Thù",
            "name": "Bộ Thù (gậy chèo)",
            "meaning": "Gậy chèo thuyền di chuyển"
        }
    ],
    mnemonic: 'Bàn tay (扌) chèo thuyền (舟) cầm gậy (殳) vận chuyển, di dời đồ đạc (搬家).'
  },

  '借': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰亻昔',
    components: [
        {
            "char": "亻",
            "pinyin": "rén",
            "hanviet": "Nhân",
            "name": "Bộ Nhân",
            "meaning": "Con người"
        },
        {
            "char": "昔",
            "pinyin": "xī",
            "hanviet": "Tích",
            "name": "Chữ Tích (xưa)",
            "meaning": "Ngày xưa, trước kia"
        }
    ],
    mnemonic: 'Người xưa (昔) sống tình nghĩa nhờ cậy đùm bọc nhau: mượn, vay (借).'
  },

  '被': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰衤皮',
    components: [
        {
            "char": "衤",
            "pinyin": "yī",
            "hanviet": "Y",
            "name": "Bộ Y (áo)",
            "meaning": "Áo quần bao bọc"
        },
        {
            "char": "皮",
            "pinyin": "pí",
            "hanviet": "Bì",
            "name": "Bộ Bì (da)",
            "meaning": "Tấm da thú"
        }
    ],
    mnemonic: 'Tấm chăn da (皮) khoác lên áo (衤) che phủ thân thể: bị, được đón nhận (câu chữ 被).'
  },

  '偷': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰亻俞',
    components: [
        {
            "char": "亻",
            "pinyin": "rén",
            "hanviet": "Nhân",
            "name": "Bộ Nhân",
            "meaning": "Con người"
        },
        {
            "char": "俞",
            "pinyin": "yú",
            "hanviet": "Du",
            "name": "Chữ Du",
            "meaning": "Bằng lòng, thuận lòng"
        }
    ],
    mnemonic: 'Kẻ xấu (亻) lợi dụng sự bằng lòng nhẹ dạ (俞) của người khác để lén lút trộm cắp (偷).'
  },

  '同': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_DOWN,
    ids: '⿵冂一口',
    components: [
        {
            "char": "冂",
            "pinyin": "jiōng",
            "hanviet": "Quynh",
            "name": "Bộ Quynh",
            "meaning": "Cương giới bờ cõi"
        },
        {
            "char": "一",
            "pinyin": "yī",
            "hanviet": "Nhất",
            "name": "Bộ Nhất",
            "meaning": "Một mối đồng nhất"
        },
        {
            "char": "口",
            "pinyin": "kǒu",
            "hanviet": "Khẩu",
            "name": "Bộ Khẩu",
            "meaning": "Miệng nói cùng lời"
        }
    ],
    mnemonic: 'Cùng chung một ranh giới (冂), muôn người đồng thanh cùng một (一) tiếng nói (口): tương đồng.'
  },

  '经': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰纟圣',
    components: [
        {
            "char": "纟",
            "pinyin": "sī",
            "hanviet": "Mịch",
            "name": "Bộ Mịch",
            "meaning": "Sợi tơ đường chỉ"
        },
        {
            "char": "圣",
            "pinyin": "shèng",
            "hanviet": "Thánh",
            "name": "Chữ Thánh/Kính",
            "meaning": "Mặt đất thẳng thớm"
        }
    ],
    mnemonic: 'Đường tơ sợi (纟) dệt ngang dọc qua mặt đất (圣): kinh qua, trải qua, kinh nghiệm (经常).'
  },

  '成': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_TOP_RIGHT,
    ids: '⿹𢦏',
    components: [
        {
            "char": "戈",
            "pinyin": "gē",
            "hanviet": "Qua",
            "name": "Bộ Qua",
            "meaning": "Chiếc rìu lễ hội"
        },
        {
            "char": "𠃌",
            "pinyin": "gōu",
            "hanviet": "Móc",
            "name": "Nét móc hoàn tất",
            "meaning": "Khép lại thành quả"
        }
    ],
    mnemonic: 'Rung chuông múa rìu (戈) khép lại thành công viên mãn của công trình: thành tựu (成功).'
  },

  '努': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱奴力',
    components: [
        {
            "char": "奴",
            "pinyin": "nú",
            "hanviet": "Nô",
            "name": "Chữ Nô",
            "meaning": "Tận tụy chăm chỉ"
        },
        {
            "char": "力",
            "pinyin": "lì",
            "hanviet": "Lực",
            "name": "Bộ Lực",
            "meaning": "Sức mạnh cơ bắp"
        }
    ],
    mnemonic: 'Dốc hết toàn bộ sức lực (力) cống hiến hết mình như người tận tụy (奴): nỗ lực, cố gắng (努力).'
  },

  '提': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰扌是',
    components: [
        {
            "char": "扌",
            "pinyin": "shǒu",
            "hanviet": "Thủ",
            "name": "Bộ Thủ",
            "meaning": "Bàn tay nâng đỡ"
        },
        {
            "char": "是",
            "pinyin": "shì",
            "hanviet": "Thị",
            "name": "Chữ Thị (đúng)",
            "meaning": "Ngay thẳng, lẽ phải"
        }
    ],
    mnemonic: 'Bàn tay (扌) nâng bổng lẽ phải ngay thẳng (是) lên cao: xách lên, đề xuất, nâng cao (提高).'
  },

  '聪': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰耳总',
    components: [
        {
            "char": "耳",
            "pinyin": "ěr",
            "hanviet": "Nhĩ",
            "name": "Bộ Nhĩ (tai)",
            "meaning": "Lỗ tai nghe hiểu thấu suốt"
        },
        {
            "char": "总",
            "pinyin": "zǒng",
            "hanviet": "Tổng",
            "name": "Chữ Tổng",
            "meaning": "Bao quát toàn bộ"
        }
    ],
    mnemonic: 'Đôi tai (耳) biết lắng nghe và thâu tóm bao quát tất cả (总): thông minh mẫn tiệp (聪明).'
  },

  '情': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰忄青',
    components: [
        {
            "char": "忄",
            "pinyin": "xīn",
            "hanviet": "Tâm",
            "name": "Bộ Tâm",
            "meaning": "Trái tim cảm xúc"
        },
        {
            "char": "青",
            "pinyin": "qīng",
            "hanviet": "Thanh",
            "name": "Bộ Thanh",
            "meaning": "Màu xanh non thanh khiết"
        }
    ],
    mnemonic: 'Trái tim (忄) ấp ủ tình cảm trong lành tươi mới như sắc xanh (青): tình cảm, tình ý (热情, 事情).'
  },

  '地': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰土也',
    components: [
        {
            "char": "土",
            "pinyin": "tǔ",
            "hanviet": "Thổ",
            "name": "Bộ Thổ",
            "meaning": "Đất đai nâng đỡ vạn vật"
        },
        {
            "char": "也",
            "pinyin": "yě",
            "hanviet": "Dã",
            "name": "Chữ Dã",
            "meaning": "Cũng là, nối tiếp"
        }
    ],
    mnemonic: 'Đất đai (土) là nền móng cho vạn vật (也): mặt đất (dì), trợ từ chỉ cách thức hành động (de).'
  },

  '花': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱艹化',
    components: [
        {
            "char": "艹",
            "pinyin": "cǎo",
            "hanviet": "Thảo",
            "name": "Bộ Thảo",
            "meaning": "Cỏ cây hoa lá"
        },
        {
            "char": "化",
            "pinyin": "huà",
            "hanviet": "Hóa",
            "name": "Chữ Hóa",
            "meaning": "Biến hóa trổ bông"
        }
    ],
    mnemonic: 'Cây cỏ (艹) biến hóa (化) trổ ra muôn sắc hoa rực rỡ; từ đó cũng mang nghĩa tiêu tốn tiền bạc/thời gian.'
  },

  '俗': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰亻谷',
    components: [
        {
            "char": "亻",
            "pinyin": "rén",
            "hanviet": "Nhân",
            "name": "Bộ Nhân",
            "meaning": "Con người sinh sống"
        },
        {
            "char": "谷",
            "pinyin": "gǔ",
            "hanviet": "Cốc",
            "name": "Bộ Cốc (thung lũng)",
            "meaning": "Thung lũng quần tụ dân cư"
        }
    ],
    mnemonic: 'Con người (亻) sống quần tụ nơi thung lũng (谷) hình thành nên tập tục, phong tục (风俗, 俗话).'
  },

  '虎': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_TOP_LEFT,
    ids: '⿸虍几',
    components: [
        {
            "char": "虍",
            "pinyin": "hū",
            "hanviet": "Hô",
            "name": "Bộ Hô",
            "meaning": "Bộ da vằn vện của loài cọp"
        },
        {
            "char": "几",
            "pinyin": "jī",
            "hanviet": "Kỷ",
            "name": "Chữ Kỷ",
            "meaning": "Chân thú vững chãi"
        }
    ],
    mnemonic: 'Bộ da vằn uy nghiêm (虍) trên đôi chân mạnh mẽ: chúa sơn lâm cọp dữ (马马虎虎).'
  },

  '首': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱丷自',
    components: [
        {
            "char": "丷",
            "pinyin": "bā",
            "hanviet": "Bát",
            "name": "Nét tóc rẽ đôi",
            "meaning": "Chỏm tóc mái"
        },
        {
            "char": "自",
            "pinyin": "zì",
            "hanviet": "Tự",
            "name": "Bộ Tự",
            "meaning": "Cái mũi, gương mặt"
        }
    ],
    mnemonic: 'Gương mặt (自) cùng mái tóc (丷) đại diện cho phần đầu: trước tiên, khởi đầu (首先).'
  },

  '然': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱肰灬',
    components: [
        {
            "char": "⺼",
            "pinyin": "ròu",
            "hanviet": "Nhục",
            "name": "Bộ Nhục",
            "meaning": "Miếng thịt tươi"
        },
        {
            "char": "犬",
            "pinyin": "quǎn",
            "hanviet": "Khuyển",
            "name": "Bộ Khuyển",
            "meaning": "Chó săn"
        },
        {
            "char": "灬",
            "pinyin": "huǒ",
            "hanviet": "Hỏa",
            "name": "Bộ Hỏa (bốn chấm)",
            "meaning": "Ngọn lửa nướng chín"
        }
    ],
    mnemonic: 'Nướng thịt (⺼) dưới ngọn lửa (灬) tự nhiên dậy hương thơm: tất nhiên, sau đó (然后, 当然).'
  },

  '选': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_BOTTOM_LEFT,
    ids: '⿺辶先',
    components: [
        {
            "char": "辶",
            "pinyin": "chuò",
            "hanviet": "Quai sước",
            "name": "Bộ Quai sước",
            "meaning": "Bước chân"
        },
        {
            "char": "先",
            "pinyin": "xiān",
            "hanviet": "Tiên",
            "name": "Chữ Tiên",
            "meaning": "Đi đầu tiên"
        }
    ],
    mnemonic: 'Bước đi (辶) để chọn ra người đi trước tiên phong (先): lựa chọn, tuyển chọn (选择).'
  },

  '择': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰扌𠬤',
    components: [
        {
            "char": "扌",
            "pinyin": "shǒu",
            "hanviet": "Thủ",
            "name": "Bộ Thủ",
            "meaning": "Bàn tay hành động"
        },
        {
            "char": "𠬤",
            "pinyin": "yì",
            "hanviet": "Dịch",
            "name": "Chọn lọc tinh hoa",
            "meaning": "Lọc lấy phần tốt đẹp"
        }
    ],
    mnemonic: 'Bàn tay (扌) cân nhắc lựa chọn lấy phần tinh túy nhất: kén chọn, chọn lựa (选择).'
  },

  '平': {
    structure: IDS_STRUCTURE_TYPES.SINGLE,
    ids: '平',
    components: [
        {
            "char": "干",
            "pinyin": "gān",
            "hanviet": "Can",
            "name": "Bộ Can",
            "meaning": "Cán cân thẳng đứng"
        },
        {
            "char": "八",
            "pinyin": "bā",
            "hanviet": "Bát",
            "name": "Bộ Bát",
            "meaning": "Hai đĩa cân thăng bằng"
        }
    ],
    mnemonic: 'Chiếc cân chia đều hai bên một cách công bằng phẳng lặng: bình an, trình độ (水平, 平安).'
  },

  '持': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰扌寺',
    components: [
        {
            "char": "扌",
            "pinyin": "shǒu",
            "hanviet": "Thủ",
            "name": "Bộ Thủ",
            "meaning": "Bàn tay nắm chặt"
        },
        {
            "char": "寺",
            "pinyin": "sì",
            "hanviet": "Tự",
            "name": "Bộ Tự (chùa)",
            "meaning": "Ngôi chùa nghiêm trang"
        }
    ],
    mnemonic: 'Bàn tay (扌) giữ vững niềm tin kiên định như quy củ ngôi chùa (寺): kiên trì, duy trì (坚持).'
  },

  '毕': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱比十',
    components: [
        {
            "char": "比",
            "pinyin": "bǐ",
            "hanviet": "Tỉ",
            "name": "Bộ Tỉ",
            "meaning": "So sánh từng bậc học"
        },
        {
            "char": "十",
            "pinyin": "shí",
            "hanviet": "Thập",
            "name": "Bộ Thập",
            "meaning": "Số 10 tròn trĩnh trọn vẹn"
        }
    ],
    mnemonic: 'So sánh (比) mọi mặt đều đạt điểm 10 tròn trĩnh (十): hoàn tất khóa học, tốt nghiệp (毕业).'
  },

  '梦': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱林夕',
    components: [
        {
            "char": "林",
            "pinyin": "lín",
            "hanviet": "Lâm",
            "name": "Bộ Lâm",
            "meaning": "Rừng cây đêm tối mênh mông"
        },
        {
            "char": "夕",
            "pinyin": "xī",
            "hanviet": "Tịch",
            "name": "Bộ Tịch",
            "meaning": "Mặt trời lặn, đêm tối"
        }
    ],
    mnemonic: 'Màn đêm (夕) buông xuống rừng sâu (林), tâm trí đi vào giấc mộng mơ màng: ước mơ, giấc mơ (梦想).'
  }
,

  // ==================== HSK 4 ADVANCED INTERMEDIATE (TASK 22.05) ====================
  '结': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰纟吉',
    components: [
        {
            "char": "纟",
            "pinyin": "sī",
            "hanviet": "Mịch",
            "name": "Bộ Mịch",
            "meaning": "Sợi tơ kết nối"
        },
        {
            "char": "吉",
            "pinyin": "jí",
            "hanviet": "Cát",
            "name": "Chữ Cát (tốt lành)",
            "meaning": "Điều may mắn tốt lành"
        }
    ],
    mnemonic: 'Dùng sợi tơ (纟) buộc chặt điều cát lành may mắn (吉): kết nối, kết bạn (结识).'
  },

  '扫': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰扌彐',
    components: [
        {
            "char": "扌",
            "pinyin": "shǒu",
            "hanviet": "Thủ",
            "name": "Bộ Thủ (tay)",
            "meaning": "Bàn tay hành động"
        },
        {
            "char": "彐",
            "pinyin": "jì",
            "hanviet": "Ký",
            "name": "Hình đầu chổi",
            "meaning": "Chổi quét bụi"
        }
    ],
    mnemonic: 'Bàn tay (扌) lia quét nhanh chóng như chổi quét (彐): quét mã QR (扫码).'
  },

  '约': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰纟勺',
    components: [
        {
            "char": "纟",
            "pinyin": "sī",
            "hanviet": "Mịch",
            "name": "Bộ Mịch",
            "meaning": "Sợi tơ bền chặt"
        },
        {
            "char": "勺",
            "pinyin": "sháo",
            "hanviet": "Chước",
            "name": "Cái thìa/muôi",
            "meaning": "Ước lượng đong đếm"
        }
    ],
    mnemonic: 'Sợi tơ (纟) ràng buộc lời hẹn ước đong đầy chiếc muôi (勺): hẹn hò, ước hẹn (约会).'
  },

  '建': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_BOTTOM_LEFT,
    ids: '⿺廴聿',
    components: [
        {
            "char": "廴",
            "pinyin": "yǐn",
            "hanviet": "Dẫn",
            "name": "Bộ Dẫn",
            "meaning": "Bước dài tiến tới"
        },
        {
            "char": "聿",
            "pinyin": "yù",
            "hanviet": "Duật",
            "name": "Cây bút viết",
            "meaning": "Vạch kế hoạch"
        }
    ],
    mnemonic: 'Cầm bút (聿) vạch từng bước đi xa (廴) để kiến thiết tương lai: kiến nghị (建议).'
  },

  '毅': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰豖殳',
    components: [
        {
            "char": "豖",
            "pinyin": "chù",
            "hanviet": "Thốc",
            "name": "Con heo rừng",
            "meaning": "Thú dữ hung hãn"
        },
        {
            "char": "殳",
            "pinyin": "shū",
            "hanviet": "Thù",
            "name": "Binh khí gậy săn",
            "meaning": "Vũ khí chiến đấu"
        }
    ],
    mnemonic: 'Cầm gậy săn (殳) đối diện dã thú hung tợn (豖) không hề lùi bước: nghị lực (毅力).'
  },

  '摄': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰扌聂',
    components: [
        {
            "char": "扌",
            "pinyin": "shǒu",
            "hanviet": "Thủ",
            "name": "Bộ Thủ",
            "meaning": "Bàn tay điều khiển"
        },
        {
            "char": "聂",
            "pinyin": "niè",
            "hanviet": "Nhiếp",
            "name": "Chữ Nhiếp (ba cái tai)",
            "meaning": "Thu nhận nhiều phía"
        }
    ],
    mnemonic: 'Bàn tay (扌) nắm bắt mọi thanh âm hình ảnh thu vào tai (聂): nhiếp ảnh (摄影).'
  },

  '压': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_TOP_LEFT,
    ids: '⿸厂土丶',
    components: [
        {
            "char": "厂",
            "pinyin": "hǎn",
            "hanviet": "Hán",
            "name": "Vách đá dốc",
            "meaning": "Vách núi sừng sững"
        },
        {
            "char": "土",
            "pinyin": "tǔ",
            "hanviet": "Thổ",
            "name": "Bộ Thổ (đất)",
            "meaning": "Khối đất đá nặng nề"
        }
    ],
    mnemonic: 'Khối đất đá (土) nặng ngàn cân dưới vách đá (厂) đè xuống: áp lực (压力).'
  },

  '严': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱亚厂',
    components: [
        {
            "char": "一",
            "pinyin": "yī",
            "hanviet": "Nhất",
            "name": "Nét ngang ranh giới",
            "meaning": "Kỷ luật ngay thẳng"
        },
        {
            "char": "厂",
            "pinyin": "hǎn",
            "hanviet": "Hán",
            "name": "Mái vòm công đường",
            "meaning": "Pháp luật nghiêm minh"
        }
    ],
    mnemonic: 'Quy củ thép dưới mái vòm (厂) không sai lệch một nét ngang (一): nghiêm khắc (严格).'
  },

  '印': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰𠂉卩',
    components: [
        {
            "char": "𠂉",
            "pinyin": "fù",
            "hanviet": "Phụ",
            "name": "Bàn tay úp xuống",
            "meaning": "Tay cầm con dấu"
        },
        {
            "char": "卩",
            "pinyin": "jié",
            "hanviet": "Tiết",
            "name": "Con dấu ngọc",
            "meaning": "Dấu ấn đóng lên giấy"
        }
    ],
    mnemonic: 'Bàn tay cầm con dấu (卩) đóng mạnh lên giấy khắc sâu dấu tích: ấn tượng (印象).'
  },

  '格': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰木各',
    components: [
        {
            "char": "木",
            "pinyin": "mù",
            "hanviet": "Mộc",
            "name": "Bộ Mộc",
            "meaning": "Thanh gỗ khuôn mẫu"
        },
        {
            "char": "各",
            "pinyin": "gè",
            "hanviet": "Các",
            "name": "Chữ Các (mỗi cái)",
            "meaning": "Đặc trưng riêng biệt"
        }
    ],
    mnemonic: 'Từng khúc gỗ (木) đều có phẩm chất và tiêu chuẩn riêng biệt (各): tính cách (性格), hợp cách (合格).'
  },

  '订': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰讠丁',
    components: [
        {
            "char": "讠",
            "pinyin": "yán",
            "hanviet": "Ngôn",
            "name": "Bộ Ngôn",
            "meaning": "Lời nói cam kết"
        },
        {
            "char": "丁",
            "pinyin": "dīng",
            "hanviet": "Đinh",
            "name": "Chiếc đinh đóng cột",
            "meaning": "Chắc chắn không đổi"
        }
    ],
    mnemonic: 'Lời nói (讠) cam kết chắc nịch như đóng đinh (丁): đặt phòng (订房), đặt trước (预订).'
  },

  '标': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰木示',
    components: [
        {
            "char": "木",
            "pinyin": "mù",
            "hanviet": "Mộc",
            "name": "Bộ Mộc",
            "meaning": "Cột gỗ làm mốc"
        },
        {
            "char": "示",
            "pinyin": "shì",
            "hanviet": "Thị",
            "name": "Bộ Thị",
            "meaning": "Biểu thị hiển thị"
        }
    ],
    mnemonic: 'Dựng cột gỗ (木) làm biển chỉ dẫn biểu thị (示) cột mốc: tiêu chuẩn (标准).'
  },

  '办': {
    structure: IDS_STRUCTURE_TYPES.LEFT_MID_RIGHT,
    ids: '⿲丿力丶',
    components: [
        {
            "char": "力",
            "pinyin": "lì",
            "hanviet": "Lực",
            "name": "Bộ Lực",
            "meaning": "Dốc sức hành động"
        },
        {
            "char": "丿",
            "pinyin": "piě",
            "hanviet": "Phẩy",
            "name": "Nét phẩy bên trái",
            "meaning": "Hỗ trợ bên trái"
        },
        {
            "char": "丶",
            "pinyin": "diǎn",
            "hanviet": "Chấm",
            "name": "Nét chấm bên phải",
            "meaning": "Hỗ trợ bên phải"
        }
    ],
    mnemonic: 'Dốc sức lực (力) từ hai phía trái phải để giải quyết công việc: biện pháp, làm thủ tục (办法, 办理).'
  },

  '卡': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱上卜',
    components: [
        {
            "char": "上",
            "pinyin": "shàng",
            "hanviet": "Thượng",
            "name": "Chữ Thượng (trên)",
            "meaning": "Phía trên"
        },
        {
            "char": "卜",
            "pinyin": "bǔ",
            "hanviet": "Bặc",
            "name": "Bộ Bặc (dưới)",
            "meaning": "Phía dưới"
        }
    ],
    mnemonic: 'Lưng chừng ở giữa không lên trên (上) không xuống dưới (卜): thẻ từ, thẻ phòng (卡片, 房卡).'
  },

  '兑': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱丷兄',
    components: [
        {
            "char": "丷",
            "pinyin": "bā",
            "hanviet": "Bát",
            "name": "Nụ cười tươi tắn",
            "meaning": "Vui vẻ"
        },
        {
            "char": "兄",
            "pinyin": "xiōng",
            "hanviet": "Huynh",
            "name": "Người anh cả",
            "meaning": "Chủ trì giao thương"
        }
    ],
    mnemonic: 'Miệng người anh (兄) tươi cười khi hoán đổi ngân tệ sòng phẳng: quy đổi (兑换).'
  },

  '率': {
    structure: IDS_STRUCTURE_TYPES.TOP_MID_BOTTOM,
    ids: '⿳亠玄十',
    components: [
        {
            "char": "亠",
            "pinyin": "tóu",
            "hanviet": "Đầu",
            "name": "Bộ Đầu",
            "meaning": "Phần chóp trên"
        },
        {
            "char": "玄",
            "pinyin": "xuán",
            "hanviet": "Huyền",
            "name": "Bộ Huyền",
            "meaning": "Quy luật sâu kín"
        },
        {
            "char": "十",
            "pinyin": "shí",
            "hanviet": "Thập",
            "name": "Bộ Thập",
            "meaning": "Tròn vẹn mười phần"
        }
    ],
    mnemonic: 'Đo lường mối tương quan sâu kín (玄) đạt mức độ trọn mười (十): tỷ giá (汇率).'
  },

  '租': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰禾且',
    components: [
        {
            "char": "禾",
            "pinyin": "hé",
            "hanviet": "Hòa",
            "name": "Bộ Hòa",
            "meaning": "Lúa thóc hoa lợi"
        },
        {
            "char": "且",
            "pinyin": "qiě",
            "hanviet": "Thả",
            "name": "Mảnh đất màu mỡ",
            "meaning": "Đất đai canh tác"
        }
    ],
    mnemonic: 'Đem lúa thóc (禾) trả tiền thuê mướn mảnh đất màu mỡ (且): thuê xe (租车), thuê nhà (租房).'
  },

  '导': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱巳寸',
    components: [
        {
            "char": "巳",
            "pinyin": "sì",
            "hanviet": "Tị",
            "name": "Hình đứa trẻ",
            "meaning": "Người cần chỉ dẫn"
        },
        {
            "char": "寸",
            "pinyin": "cùn",
            "hanviet": "Thốn",
            "name": "Bộ Thốn (tay)",
            "meaning": "Bàn tay dắt lối"
        }
    ],
    mnemonic: 'Bàn tay (寸) dẫn dắt em nhỏ (巳) đi đúng hướng trên đường: hướng dẫn viên (导游).'
  },

  '丢': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱丿去',
    components: [
        {
            "char": "丿",
            "pinyin": "piě",
            "hanviet": "Phẩy",
            "name": "Nét phẩy rơi rụng",
            "meaning": "Rơi mất"
        },
        {
            "char": "去",
            "pinyin": "qù",
            "hanviet": "Khứ",
            "name": "Chữ Khứ (đi)",
            "meaning": "Bước đi"
        }
    ],
    mnemonic: 'Một nét phẩy (丿) rơi mất khi bước đi (去): đánh mất đồ đạc (丢失).'
  },

  '警': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱敬言',
    components: [
        {
            "char": "敬",
            "pinyin": "jìng",
            "hanviet": "Kính",
            "name": "Chữ Kính (tôn kính)",
            "meaning": "Nghiêm trang cung kính"
        },
        {
            "char": "言",
            "pinyin": "yán",
            "hanviet": "Ngôn",
            "name": "Bộ Ngôn",
            "meaning": "Lời răn đe"
        }
    ],
    mnemonic: 'Dùng lời lẽ (言) nghiêm trang tôn kính (敬) để răn đe giữ gìn trật tự: cảnh sát (报警, 警察).'
  },

  '稍': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰禾肖',
    components: [
        {
            "char": "禾",
            "pinyin": "hé",
            "hanviet": "Hòa",
            "name": "Bộ Hòa (lúa)",
            "meaning": "Nhánh lúa non"
        },
        {
            "char": "肖",
            "pinyin": "xiāo",
            "hanviet": "Tiêu",
            "name": "Chữ Tiêu (nhỏ bé)",
            "meaning": "Mỏng manh, ít ỏi"
        }
    ],
    mnemonic: 'Chỉ xin một nhánh lúa nhỏ (禾) mỏng manh (肖): xin đợi một chút (稍等).'
  },

  '留': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱卯田',
    components: [
        {
            "char": "卯",
            "pinyin": "mǎo",
            "hanviet": "Mão",
            "name": "Giờ Mão ban mai",
            "meaning": "Thời gian sáng sớm"
        },
        {
            "char": "田",
            "pinyin": "tián",
            "hanviet": "Điền",
            "name": "Bộ Điền (ruộng)",
            "meaning": "Ruộng đồng gắn bó"
        }
    ],
    mnemonic: 'Ở lại canh giữ ruộng vườn (田) qua giờ Mão (卯): để lại lời nhắn (留言), lưu lại (保留).'
  },

  '改': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰己攵',
    components: [
        {
            "char": "己",
            "pinyin": "jǐ",
            "hanviet": "Kỷ",
            "name": "Bản thân mình",
            "meaning": "Cái tôi cá nhân"
        },
        {
            "char": "攵",
            "pinyin": "pū",
            "hanviet": "Phác",
            "name": "Cây roi răn đe",
            "meaning": "Sửa phạt lỗi sai"
        }
    ],
    mnemonic: 'Dùng roi gậy (攵) tự răn đe bản thân mình (己) sửa chữa sai lầm: đổi lịch (改期), sửa đổi (改错).'
  },

  '迟': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_BOTTOM_LEFT,
    ids: '⿺辶尺',
    components: [
        {
            "char": "辶",
            "pinyin": "chuò",
            "hanviet": "Quai sước",
            "name": "Bộ Quai sước",
            "meaning": "Bước chân di chuyển"
        },
        {
            "char": "尺",
            "pinyin": "chǐ",
            "hanviet": "Xích",
            "name": "Thước đo tấc gang",
            "meaning": "Khoảng cách ngắn"
        }
    ],
    mnemonic: 'Bước chân di chuyển (辶) từng tấc thước ngắn ngủi (尺): chậm trễ, hoãn lịch (推迟, 迟到).'
  },

  '附': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰阝付',
    components: [
        {
            "char": "阝",
            "pinyin": "fù",
            "hanviet": "Phụ",
            "name": "Gò đất bên cạnh",
            "meaning": "Chỗ nương tựa"
        },
        {
            "char": "付",
            "pinyin": "fù",
            "hanviet": "Phó",
            "name": "Chữ Phó (giao nộp)",
            "meaning": "Trao gửi"
        }
    ],
    mnemonic: 'Trao gửi (付) tài liệu đặt nép cạnh gò đất (阝): tệp đính kèm (附件), phụ cận (附近).'
  },

  '确': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰石角',
    components: [
        {
            "char": "石",
            "pinyin": "shí",
            "hanviet": "Thạch",
            "name": "Bộ Thạch (đá)",
            "meaning": "Tảng đá kiên cố"
        },
        {
            "char": "角",
            "pinyin": "jiǎo",
            "hanviet": "Giác",
            "name": "Bộ Giác (sừng)",
            "meaning": "Sừng hươu góc cạnh"
        }
    ],
    mnemonic: 'Tảng đá (石) cứng cáp như sừng hươu (角) không lung lay: xác nhận (确认), chính xác (准确).'
  },

  '堵': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰土者',
    components: [
        {
            "char": "土",
            "pinyin": "tǔ",
            "hanviet": "Thổ",
            "name": "Bộ Thổ (đất)",
            "meaning": "Đất đá"
        },
        {
            "char": "者",
            "pinyin": "zhě",
            "hanviet": "Giả",
            "name": "Chữ Giả (người ta)",
            "meaning": "Mọi người đi lại"
        }
    ],
    mnemonic: 'Đắp đất (土) chặn ngang lối đi của mọi người (者): tắc đường kẹt xe (堵车).'
  },

  '歉': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰兼欠',
    components: [
        {
            "char": "兼",
            "pinyin": "jiān",
            "hanviet": "Kiêm",
            "name": "Chữ Kiêm (nhiều việc)",
            "meaning": "Gánh vác nhiều việc"
        },
        {
            "char": "欠",
            "pinyin": "qiàn",
            "hanviet": "Khiếm",
            "name": "Bộ Khiếm (thiếu)",
            "meaning": "Thiếu sót chưa vẹn toàn"
        }
    ],
    mnemonic: 'Gánh vác nhiều bề (兼) mà vẫn thiếu sót (欠) chưa chu toàn: áy náy xin lỗi (抱歉).'
  },

  '沟': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰氵勾',
    components: [
        {
            "char": "氵",
            "pinyin": "shuǐ",
            "hanviet": "Thủy",
            "name": "Bộ Thủy",
            "meaning": "Dòng nước khơi thông"
        },
        {
            "char": "勾",
            "pinyin": "gōu",
            "hanviet": "Câu",
            "name": "Móc nối liên kết",
            "meaning": "Kết nối hai đầu"
        }
    ],
    mnemonic: 'Dòng nước chảy (氵) khơi thông rãnh kênh móc nối (勾) với nhau: giao tiếp thông suốt (沟通).'
  },

  '配': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰酉己',
    components: [
        {
            "char": "酉",
            "pinyin": "yǒu",
            "hanviet": "Dậu",
            "name": "Bộ Dậu (hũ rượu)",
            "meaning": "Rượu quý lên men"
        },
        {
            "char": "己",
            "pinyin": "jǐ",
            "hanviet": "Kỷ",
            "name": "Bộ Kỷ (bản thân)",
            "meaning": "Tấm lòng chân thành"
        }
    ],
    mnemonic: 'Hũ rượu quý (酉) hòa cùng tấm lòng của chính mình (己): cộng tác phối hợp (配合).'
  },

  '券': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱𢍉刀',
    components: [
        {
            "char": "𢍉",
            "pinyin": "quàn",
            "hanviet": "Khế",
            "name": "Giao ước gỗ",
            "meaning": "Khế ước văn tự"
        },
        {
            "char": "刀",
            "pinyin": "dāo",
            "hanviet": "Đao",
            "name": "Bộ Đao",
            "meaning": "Con dao cắt đôi"
        }
    ],
    mnemonic: 'Dùng dao (刀) cắt đôi mảnh giao ước bằng gỗ làm chứng: phiếu giảm giá (优惠券).'
  },

  '邮': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰由阝',
    components: [
        {
            "char": "由",
            "pinyin": "yóu",
            "hanviet": "Do",
            "name": "Chữ Do (nguyên do)",
            "meaning": "Lý do khẩn cấp"
        },
        {
            "char": "阝",
            "pinyin": "yì",
            "hanviet": "Ấp",
            "name": "Xóm ấp làng mạc",
            "meaning": "Trạm ngựa chuyển phát"
        }
    ],
    mnemonic: 'Trạm ngựa chuyển phát từ xóm ấp (阝) vì nguyên do (由) khẩn cấp: bưu điện (邮局), bao bưu (包邮).'
  },

  '递': {
    structure: IDS_STRUCTURE_TYPES.SEMI_ENCLOSURE_BOTTOM_LEFT,
    ids: '⿺辶弟',
    components: [
        {
            "char": "辶",
            "pinyin": "chuò",
            "hanviet": "Quai sước",
            "name": "Bước chân di chuyển",
            "meaning": "Giao hàng tận nơi"
        },
        {
            "char": "弟",
            "pinyin": "dì",
            "hanviet": "Đệ",
            "name": "Người em trai",
            "meaning": "Thân thiện nhanh nhẹn"
        }
    ],
    mnemonic: 'Người em trai (弟) bước đi nhanh (辶) mang thư từ bưu phẩm trao tận tay: chuyển phát nhanh (快递).'
  },

  '签': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱竹佥',
    components: [
        {
            "char": "竹",
            "pinyin": "zhú",
            "hanviet": "Trúc",
            "name": "Bộ Trúc (cây tre)",
            "meaning": "Cây bút thẻ tre"
        },
        {
            "char": "佥",
            "pinyin": "qiān",
            "hanviet": "Thiêm",
            "name": "Mọi người đồng lòng",
            "meaning": "Nhất trí cam kết"
        }
    ],
    mnemonic: 'Cây bút tre (竹) viết lời cam kết chung lòng (佥) của đôi bên: ký nhận (签收), ký tên (签字).'
  },

  '额': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰客页',
    components: [
        {
            "char": "客",
            "pinyin": "kè",
            "hanviet": "Khách",
            "name": "Vị khách quý",
            "meaning": "Người giao dịch"
        },
        {
            "char": "页",
            "pinyin": "yè",
            "hanviet": "Hiệt",
            "name": "Bộ Hiệt (đầu người)",
            "meaning": "Định mức tính theo đầu người"
        }
    ],
    mnemonic: 'Ghi nhận số lượng định mức trên đầu (页) của mỗi vị khách (客): số dư (余额), định mức (额度).'
  },

  '账': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰贝长',
    components: [
        {
            "char": "贝",
            "pinyin": "bèi",
            "hanviet": "Bối",
            "name": "Bộ Bối (tiền của)",
            "meaning": "Tiền bạc ngân lượng"
        },
        {
            "char": "长",
            "pinyin": "cháng",
            "hanviet": "Trường",
            "name": "Thời gian lâu dài",
            "meaning": "Sổ sách lưu niên"
        }
    ],
    mnemonic: 'Ghi chép tiền của (贝) qua năm tháng lâu dài (长) vào sổ sách: chuyển khoản (转账), kết toán (结账).'
  },

  '换': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰扌奂',
    components: [
        {
            "char": "扌",
            "pinyin": "shǒu",
            "hanviet": "Thủ",
            "name": "Bộ Thủ (tay)",
            "meaning": "Bàn tay trao đổi"
        },
        {
            "char": "奂",
            "pinyin": "huàn",
            "hanviet": "Hoán",
            "name": "Sáng rực rỡ",
            "meaning": "Món đồ mới đẹp"
        }
    ],
    mnemonic: 'Bàn tay (扌) đưa ra trao đổi lấy món đồ mới sáng đẹp (奂): đổi hàng (换货), đổi tiền (换钱).'
  },

  '评': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰讠平',
    components: [
        {
            "char": "讠",
            "pinyin": "yán",
            "hanviet": "Ngôn",
            "name": "Bộ Ngôn",
            "meaning": "Lời nói nhận xét"
        },
        {
            "char": "平",
            "pinyin": "píng",
            "hanviet": "Bình",
            "name": "Bộ Bình (công bằng)",
            "meaning": "Khách quan công tâm"
        }
    ],
    mnemonic: 'Dùng lời lẽ (讠) công tâm công bằng (平) để đưa ra nhận xét: đánh giá nhận xét (评价).'
  },

  '握': {
    structure: IDS_STRUCTURE_TYPES.LEFT_RIGHT,
    ids: '⿰扌屋',
    components: [
        {
            "char": "扌",
            "pinyin": "shǒu",
            "hanviet": "Thủ",
            "name": "Bộ Thủ (tay)",
            "meaning": "Bàn tay nắm lấy"
        },
        {
            "char": "屋",
            "pinyin": "wū",
            "hanviet": "Ốc",
            "name": "Ngôi nhà che chở",
            "meaning": "Trọn vẹn tổ ấm"
        }
    ],
    mnemonic: 'Bàn tay (扌) bảo bọc trọn vẹn ngôi nhà ấm êm (屋): nắm vững kiến thức (掌握), bắt tay (握手).'
  },

  '熟': {
    structure: IDS_STRUCTURE_TYPES.TOP_BOTTOM,
    ids: '⿱孰灬',
    components: [
        {
            "char": "孰",
            "pinyin": "shú",
            "hanviet": "Thục",
            "name": "Nấu nướng kỹ càng",
            "meaning": "Chế biến thức ăn"
        },
        {
            "char": "灬",
            "pinyin": "huǒ",
            "hanviet": "Hỏa",
            "name": "Bộ Hỏa (4 chấm lửa)",
            "meaning": "Ngọn lửa tôi luyện"
        }
    ],
    mnemonic: 'Nấu nướng thức ăn trên ngọn lửa (灬) kỹ càng chín thấu: quen thuộc, thuần thục (熟悉, 熟练).'
  },
  '烹': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱亨灬",
      "components": [
          {
              "char": "亨",
              "pinyin": "hēng",
              "hanviet": "Hanh",
              "name": "Hanh thông",
              "meaning": "Hanh thông, thuận lợi"
          },
          {
              "char": "灬",
              "pinyin": "huǒ",
              "hanviet": "Hỏa",
              "name": "Bộ Hỏa (4 chấm lửa)",
              "meaning": "Lửa đun nấu thức ăn"
          }
      ],
      "mnemonic": "Nấu nướng thuận theo sự hanh thông (亨), bên dưới nổi lửa (灬) đun chín: nấu nướng, ẩm thực (烹饪)."
  },
  '系': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱丿糸",
      "components": [
          {
              "char": "丿",
              "pinyin": "piě",
              "hanviet": "Phiệt",
              "name": "Nét phẩy",
              "meaning": "Sợi dây buông xuống"
          },
          {
              "char": "糸",
              "pinyin": "mì",
              "hanviet": "Mịch",
              "name": "Bộ Mịch (sợi tơ)",
              "meaning": "Mối dây ràng buộc, liên kết"
          }
      ],
      "mnemonic": "Sợi tơ nhỏ (糸) nối kết chặt chẽ mọi đầu mối lại với nhau: hệ thống, liên hệ (系统, 联系)."
  },
  '麻': {
      "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸",
          "desc": "Bao bọc góc trên bên trái"
      },
      "ids": "⿸广𣏟",
      "components": [
          {
              "char": "广",
              "pinyin": "guǎng",
              "hanviet": "Quảng",
              "name": "Bộ Quảng (mái nhà)",
              "meaning": "Nhà kho sấy vỏ cây"
          },
          {
              "char": "𣏟",
              "pinyin": "pài",
              "hanviet": "Phái",
              "name": "Hai cây gai",
              "meaning": "Cây gai phơi khô làm tê đầu lưỡi"
          }
      ],
      "mnemonic": "Dưới mái kho (广) phơi những bó cây gai (𣏟), vị cay tê dại đặc trưng Tứ Xuyên: cay tê (麻辣), phiền toái (麻烦)."
  },
  '鲜': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰鱼羊",
      "components": [
          {
              "char": "鱼",
              "pinyin": "yú",
              "hanviet": "Ngư",
              "name": "Con cá",
              "meaning": "Hải sản dưới nước"
          },
          {
              "char": "羊",
              "pinyin": "yáng",
              "hanviet": "Dương",
              "name": "Con dê",
              "meaning": "Gia súc trên cạn thơm ngon"
          }
      ],
      "mnemonic": "Vị ngọt của cá tươi (鱼) kết hợp thịt dê (羊) tạo thành hương vị tươi ngon tuyệt đỉnh: tươi ngon (新鲜), tươi ngọt (鲜美)."
  },
  '品': {
      "structure": {
          "code": "triangle",
          "name": "Phẩm tự (品字形结构)",
          "symbol": "品",
          "desc": "Ba phần tạo thành hình tam giác"
      },
      "ids": "品",
      "components": [
          {
              "char": "口",
              "pinyin": "kǒu",
              "hanviet": "Khẩu",
              "name": "Miệng thứ nhất",
              "meaning": "Thưởng thức miếng đầu"
          },
          {
              "char": "口",
              "pinyin": "kǒu",
              "hanviet": "Khẩu",
              "name": "Miệng thứ hai",
              "meaning": "Cảm nhận miếng thứ hai"
          },
          {
              "char": "口",
              "pinyin": "kǒu",
              "hanviet": "Khẩu",
              "name": "Miệng thứ ba",
              "meaning": "Đánh giá phẩm vị tinh tế"
          }
      ],
      "mnemonic": "Ba cái miệng (口) cùng nhấp từng ngụm trà nhỏ để nếm trọn hương vị: thưởng thức (品尝), phẩm chất (品质)."
  },
  '壶': {
      "structure": {
          "code": "top_mid_bottom",
          "name": "Thượng trung hạ (上中下结构)",
          "symbol": "⿳",
          "desc": "Ghép ba phần trên - giữa - dưới"
      },
      "ids": "⿳士冖业",
      "components": [
          {
              "char": "士",
              "pinyin": "shì",
              "hanviet": "Sĩ",
              "name": "Kẻ sĩ, nắp ấm",
              "meaning": "Nắp ấm trà tao nhã"
          },
          {
              "char": "冖",
              "pinyin": "mì",
              "hanviet": "Mịch",
              "name": "Bộ Mịch (khăn phủ)",
              "meaning": "Thân ấm đậy kín giữ nhiệt"
          },
          {
              "char": "业",
              "pinyin": "yè",
              "hanviet": "Nghiệp",
              "name": "Đế ấm",
              "meaning": "Đế ấm vững chắc đặt trên khay"
          }
      ],
      "mnemonic": "Kẻ sĩ (士) đậy kín nắp (冖) bình trà bằng gốm trên bàn tiệc (业): bình trà, ấm trà (茶壶)."
  },
  '规': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰夫见",
      "components": [
          {
              "char": "夫",
              "pinyin": "fū",
              "hanviet": "Phu",
              "name": "Trượng phu, người lớn",
              "meaning": "Người có trách nhiệm đặt ra phép tắc"
          },
          {
              "char": "见",
              "pinyin": "jiàn",
              "hanviet": "Kiến",
              "name": "Bộ Kiến (trông thấy)",
              "meaning": "Nhìn nhận, kiểm tra chuẩn mực"
          }
      ],
      "mnemonic": "Bậc trượng phu (夫) nhìn nhận (见) thấu đáo để định ra chuẩn mực: quy tắc (规则), quy củ (规矩)."
  },
  '矩': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰矢巨",
      "components": [
          {
              "char": "矢",
              "pinyin": "shǐ",
              "hanviet": "Thỉ",
              "name": "Bộ Thỉ (mũi tên)",
              "meaning": "Thước đo thẳng tắp như tên bắn"
          },
          {
              "char": "巨",
              "pinyin": "jù",
              "hanviet": "Cự",
              "name": "Thước vuông góc",
              "meaning": "Thước thợ mộc uốn góc vuông"
          }
      ],
      "mnemonic": "Mũi tên thẳng (矢) cùng chiếc thước vuông (巨) định hình khuôn phép ngay ngắn: quy củ phép tắc (规矩)."
  },
  '融': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰鬲虫",
      "components": [
          {
              "char": "鬲",
              "pinyin": "lì",
              "hanviet": "Cách",
              "name": "Nồi ba chân thời cổ",
              "meaning": "Dụng cụ nấu nung chảy kim loại"
          },
          {
              "char": "虫",
              "pinyin": "chóng",
              "hanviet": "Trùng",
              "name": "Khói hơi bốc lên",
              "meaning": "Khí nóng hòa quyện bốc lên"
          }
      ],
      "mnemonic": "Nồi đồng ba chân (鬲) nung nóng khiến vạn vật hòa quyện thành một dòng chảy êm dịu: dung hợp (融合), hòa tan (融化)."
  },
  '承': {
      "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰",
          "desc": "Chữ nguyên khối không tách rời"
      },
      "ids": "承",
      "components": [
          {
              "char": "乛",
              "pinyin": "wān",
              "hanviet": "Oát",
              "name": "Nét gập đón nhận",
              "meaning": "Hai tay dang ra"
          },
          {
              "char": "手",
              "pinyin": "shǒu",
              "hanviet": "Thủ",
              "name": "Bàn tay nâng đỡ",
              "meaning": "Đỡ lấy trọng trách từ người trước"
          }
      ],
      "mnemonic": "Hai tay cung kính đón nhận và nâng đỡ trọng trách của tiền nhân trao lại: kế thừa (继承), thừa nhận (承认)."
  },
  '赞': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱兟贝",
      "components": [
          {
              "char": "兟",
              "pinyin": "shēn",
              "hanviet": "Sân",
              "name": "Hai người tiến lên",
              "meaning": "Đồng lòng cổ vũ người khác"
          },
          {
              "char": "贝",
              "pinyin": "bèi",
              "hanviet": "Bối",
              "name": "Bộ Bối (vỏ sò quý)",
              "meaning": "Tặng thưởng trân quý"
          }
      ],
      "mnemonic": "Hai người tiến bước (兟) mang theo ngọc bối (贝) tán dương thành quả xuất sắc: tán thành (赞成), khen ngợi (赞赏)."
  },
  '屏': {
      "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸",
          "desc": "Bao bọc góc trên bên trái"
      },
      "ids": "⿸尸并",
      "components": [
          {
              "char": "尸",
              "pinyin": "shī",
              "hanviet": "Thi",
              "name": "Bộ Thi (thân thể, vách)",
              "meaning": "Tấm vách che chắn"
          },
          {
              "char": "并",
              "pinyin": "bìng",
              "hanviet": "Bịnh",
              "name": "Đứng liền kề",
              "meaning": "Các nan gỗ kết liền nhau"
          }
      ],
      "mnemonic": "Tấm vách (尸) gồm các thanh gỗ dựng liền sát nhau (并) tạo thành màn chắn: màn hình (屏幕), bình phong (屏风)."
  },
  '卷': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱龹⺋",
      "components": [
          {
              "char": "龹",
              "pinyin": "quán",
              "hanviet": "Quyển",
              "name": "Hai tay cuộn tròn",
              "meaning": "Bàn tay nắm lấy cuộn giấy"
          },
          {
              "char": "⺋",
              "pinyin": "wēi",
              "hanviet": "Nguy",
              "name": "Hình người cúi gối",
              "meaning": "Cúi mình chăm chú vào bài thi"
          }
      ],
      "mnemonic": "Hai tay cuộn tròn (龹) cuộn thẻ tre bài thi trước người (⺋): cuốn vào (内卷), tập sách, bài thi (试卷)."
  },
  '躺': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰身尚",
      "components": [
          {
              "char": "身",
              "pinyin": "shēn",
              "hanviet": "Thân",
              "name": "Bộ Thân (cơ thể)",
              "meaning": "Thân thể con người"
          },
          {
              "char": "尚",
              "pinyin": "shàng",
              "hanviet": "Thượng",
              "name": "Chữ Thượng (thanh cao, hướng lên)",
              "meaning": "Nằm ngửa thảnh thơi"
          }
      ],
      "mnemonic": "Thân thể (身) thả lỏng ngửa mặt thảnh thơi (尚) trên giường: nằm nghỉ (躺着), nằm yên mặc kệ đời (躺平)."
  },
  '拔': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰扌犮",
      "components": [
          {
              "char": "扌",
              "pinyin": "shǒu",
              "hanviet": "Thủ",
              "name": "Bộ Thủ (tay)",
              "meaning": "Bàn tay dùng sức"
          },
          {
              "char": "犮",
              "pinyin": "bá",
              "hanviet": "Bạt",
              "name": "Chó chạy quẫy đuôi",
              "meaning": "Dùng sức giật phắt lên"
          }
      ],
      "mnemonic": "Bàn tay (扌) dùng sức giật phắt (犮) bật rễ cây cỏ ra khỏi đất: nhổ cỏ (拔草), kéo co (拔河)."
  },
  '雷': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱雨田",
      "components": [
          {
              "char": "雨",
              "pinyin": "yǔ",
              "hanviet": "Vũ",
              "name": "Bộ Vũ (mưa)",
              "meaning": "Mây mưa giông tố trên trời"
          },
          {
              "char": "田",
              "pinyin": "tián",
              "hanviet": "Điền",
              "name": "Bộ Điền (ruộng)",
              "meaning": "Mặt đất vang dội tiếng sấm"
          }
      ],
      "mnemonic": "Khi cơn mưa (雨) đổ xuống cánh đồng (田), sấm chớp nổ vang rền: sấm sét (打雷), đụng phải bẫy (踩雷)."
  },
  '播': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰扌番",
      "components": [
          {
              "char": "扌",
              "pinyin": "shǒu",
              "hanviet": "Thủ",
              "name": "Bộ Thủ (tay)",
              "meaning": "Bàn tay gieo rắc"
          },
          {
              "char": "番",
              "pinyin": "fān",
              "hanviet": "Phiên",
              "name": "Lượt, hạt giống rải ra đồng",
              "meaning": "Truyền rộng rãi"
          }
      ],
      "mnemonic": "Bàn tay (扌) gieo rắc hạt giống ra khắp muôn phương (番): phát sóng trực tiếp (直播), truyền bá tin tức (广播)."
  },
  '粉': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰米分",
      "components": [
          {
              "char": "米",
              "pinyin": "mǐ",
              "hanviet": "Mễ",
              "name": "Bộ Mễ (hạt gạo)",
              "meaning": "Lương thực hạt gạo"
          },
          {
              "char": "分",
              "pinyin": "fēn",
              "hanviet": "Phân",
              "name": "Chữ Phân (chia nhỏ)",
              "meaning": "Nghiền nhỏ thành bột mịn"
          }
      ],
      "mnemonic": "Hạt gạo (米) được chia nhỏ nghiền nát (分) thành bột phấn mịn màng: người hâm mộ (粉丝), bột mì (面粉)."
  },
  '范': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱艹氾",
      "components": [
          {
              "char": "艹",
              "pinyin": "cǎo",
              "hanviet": "Thảo",
              "name": "Bộ Thảo (cây cỏ)",
              "meaning": "Khuôn cỏ đan bện"
          },
          {
              "char": "氾",
              "pinyin": "fàn",
              "hanviet": "Phiếm",
              "name": "Nước chảy tràn bờ",
              "meaning": "Giới hạn không để tràn lan"
          }
      ],
      "mnemonic": "Dùng khuôn bện từ lau cỏ (艹) để chặn dòng nước chảy tràn (氾), giữ trọn chuẩn mực: phạm vi giới hạn (范围), tấm gương mẫu mực (典范)."
  },
  '显': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱日业",
      "components": [
          {
              "char": "日",
              "pinyin": "rì",
              "hanviet": "Nhật",
              "name": "Bộ Nhật (mặt trời)",
              "meaning": "Ánh dương rực rỡ"
          },
          {
              "char": "业",
              "pinyin": "yè",
              "hanviet": "Nghiệp",
              "name": "Sự nghiệp rạng danh",
              "meaning": "Thành tựu tỏ rõ"
          }
      ],
      "mnemonic": "Dưới ánh mặt trời (日), mọi sự nghiệp công lao (业) đều hiện rõ ràng trước mắt: rõ rệt (明显), thể hiện (显示)."
  },
  '夕': {
      "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰",
          "desc": "Chữ nguyên khối không tách rời"
      },
      "ids": "夕",
      "components": [
          {
              "char": "夕",
              "pinyin": "xī",
              "hanviet": "Tịch",
              "name": "Bộ Tịch (trăng non buổi chiều tà)",
              "meaning": "Hoàng hôn buông xuống, đêm giao thừa"
          }
      ],
      "mnemonic": "Hình vầng trăng khuyết nghiêng bóng lúc hoàng hôn buông: đêm trừ tịch (除夕), chiều tà (夕阳)."
  },
  '圆': {
      "structure": {
          "code": "full_enclosure",
          "name": "Toàn bao vi (全包围结构)",
          "symbol": "⿴",
          "desc": "Bao bọc trọn vẹn bốn phía"
      },
      "ids": "⿴囗员",
      "components": [
          {
              "char": "囗",
              "pinyin": "wéi",
              "hanviet": "Vi",
              "name": "Bộ Vi (vòng tròn khép kín)",
              "meaning": "Bầu trời và vành đai tròn trĩnh"
          },
          {
              "char": "员",
              "pinyin": "yuán",
              "hanviet": "Viên",
              "name": "Chữ Viên (thành viên, đồng tiền tròn)",
              "meaning": "Hình dáng tròn đầy"
          }
      ],
      "mnemonic": "Vòng tròn khép kín (囗) ôm trọn từng thành viên đoàn tụ (员) sum vầy: đoàn viên ấm áp (团圆), tròn trịa (圆满)."
  },
  '赏': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱⺌𫎬",
      "components": [
          {
              "char": "⺌",
              "pinyin": "xiǎo",
              "hanviet": "Tiểu",
              "name": "Bộ Tiểu biến thể",
              "meaning": "Mái nhà thưởng lãm"
          },
          {
              "char": "贝",
              "pinyin": "bèi",
              "hanviet": "Bối",
              "name": "Bộ Bối (tiền tài, quà quý)",
              "meaning": "Ban thưởng quà quý"
          }
      ],
      "mnemonic": "Mở cửa ngắm cảnh đẹp dưới trăng rồi ban tặng ngọc bối (贝) trân quý: ngắm trăng thưởng lãm (赏月), khen thưởng (奖赏)."
  },
  '饼': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰饣并",
      "components": [
          {
              "char": "饣",
              "pinyin": "shí",
              "hanviet": "Thực",
              "name": "Bộ Thực (thức ăn)",
              "meaning": "Đồ ăn làm từ bột"
          },
          {
              "char": "并",
              "pinyin": "bìng",
              "hanviet": "Bịnh",
              "name": "Ép liền lại với nhau",
              "meaning": "Nhồi bột dát mỏng tròn đều"
          }
      ],
      "mnemonic": "Thức ăn (饣) được nhồi bột dát phẳng dính liền nhau (并) rồi nướng chín: bánh trung thu (月饼), bánh quy (饼干)."
  },
  '舟': {
      "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰",
          "desc": "Chữ nguyên khối không tách rời"
      },
      "ids": "舟",
      "components": [
          {
              "char": "舟",
              "pinyin": "zhōu",
              "hanviet": "Chu",
              "name": "Bộ Chu (con thuyền nhỏ)",
              "meaning": "Thuyền rồng lướt sóng trên sông"
          }
      ],
      "mnemonic": "Hình dáng mộc mạc của chiếc thuyền nan bằng gỗ lướt trên mặt nước: thuyền rồng (龙舟), con thuyền (舟)."
  },
  '粽': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰米宗",
      "components": [
          {
              "char": "米",
              "pinyin": "mǐ",
              "hanviet": "Mễ",
              "name": "Bộ Mễ (hạt gạo nếp)",
              "meaning": "Gạo nếp dẻo thơm"
          },
          {
              "char": "宗",
              "pinyin": "zōng",
              "hanviet": "Tông",
              "name": "Tông miếu tổ tiên",
              "meaning": "Lễ vật dâng cúng tổ tiên"
          }
      ],
      "mnemonic": "Gạo nếp dẻo thơm (米) gói lá cúng tế ở tông miếu (宗) ngày Đoan Ngọ: bánh ú bánh chưng nếp (粽子)."
  },
  '肖': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱⺌月",
      "components": [
          {
              "char": "⺌",
              "pinyin": "xiǎo",
              "hanviet": "Tiểu",
              "name": "Nho nhỏ",
              "meaning": "Nét tinh tế nhỏ nhắn"
          },
          {
              "char": "月",
              "pinyin": "ròu",
              "hanviet": "Nhục",
              "name": "Bộ Nhục (thịt xương)",
              "meaning": "Máu mủ ruột thịt giống nhau"
          }
      ],
      "mnemonic": "Đường nét xương thịt (月) hao hao giống từng chi tiết nhỏ (⺌): con giáp (生肖), tương tự giống nhau (不肖)."
  },
  '异': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱巳廾",
      "components": [
          {
              "char": "巳",
              "pinyin": "sì",
              "hanviet": "Tị",
              "name": "Khuôn mặt đeo mặt nạ",
              "meaning": "Hóa trang khác thường"
          },
          {
              "char": "廾",
              "pinyin": "gǒng",
              "hanviet": "Củng",
              "name": "Hai tay nâng lên",
              "meaning": "Hai tay giơ mặt nạ lạ lùng"
          }
      ],
      "mnemonic": "Hai tay (廾) giơ chiếc mặt nạ lạ kỳ (巳) làm người khác ngạc nhiên: khác biệt (差异), kỳ lạ dị thường (奇异)."
  },
  '悠': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱攸心",
      "components": [
          {
              "char": "攸",
              "pinyin": "yōu",
              "hanviet": "Du",
              "name": "Dòng nước êm đềm trôi xa",
              "meaning": "Thời gian trôi thong thả"
          },
          {
              "char": "心",
              "pinyin": "xīn",
              "hanviet": "Tâm",
              "name": "Bộ Tâm (trái tim, suy tư)",
              "meaning": "Tâm tư lắng đọng muôn thuở"
          }
      ],
      "mnemonic": "Dòng thời gian trôi xa (攸) lắng đọng trong cội nguồn tâm thức (心): lịch sử lâu đời (悠久), nhàn nhã thong dong (悠闲)."
  },
  '诊': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰讠㐱",
      "components": [
          {
              "char": "讠",
              "pinyin": "yán",
              "hanviet": "Ngôn",
              "name": "Bộ Ngôn (lời nói)",
              "meaning": "Thầy thuốc hỏi han bệnh tình"
          },
          {
              "char": "㐱",
              "pinyin": "zhěn",
              "hanviet": "Chẩn",
              "name": "Chải chuốt tỉ mỉ",
              "meaning": "Khám xét cẩn thận kỹ càng"
          }
      ],
      "mnemonic": "Dùng lời lẽ (讠) hỏi han và khám xét tỉ mỉ (㐱) từng triệu chứng: khám bệnh (门诊), chẩn đoán (诊断)."
  },
  '挂': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰扌卦",
      "components": [
          {
              "char": "扌",
              "pinyin": "shǒu",
              "hanviet": "Thủ",
              "name": "Bộ Thủ (tay)",
              "meaning": "Bàn tay đưa thẻ lên"
          },
          {
              "char": "卦",
              "pinyin": "guà",
              "hanviet": "Quái",
              "name": "Quẻ bói, thẻ tre ghi số",
              "meaning": "Thẻ bài ghi danh"
          }
      ],
      "mnemonic": "Bàn tay (扌) treo tấm thẻ tre ghi số (卦) lên bảng khám bệnh thời xưa: lấy số khám bệnh (挂号), treo đồ vật (挂上)."
  },
  '晕': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱日军",
      "components": [
          {
              "char": "日",
              "pinyin": "rì",
              "hanviet": "Nhật",
              "name": "Bộ Nhật (mặt trời gay gắt)",
              "meaning": "Nắng chiếu hoa mắt"
          },
          {
              "char": "军",
              "pinyin": "jūn",
              "hanviet": "Quân",
              "name": "Đoàn quân xoay chuyển",
              "meaning": "Đầu óc quay cuồng"
          }
      ],
      "mnemonic": "Đứng dưới ánh nắng gắt (日) lâu ngày khiến đầu óc quay cuồng (军): chóng mặt hoa mắt (头晕), say xe (晕车)."
  },
  '敏': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰每攵",
      "components": [
          {
              "char": "每",
              "pinyin": "měi",
              "hanviet": "Mỗi",
              "name": "Chữ Mỗi (người mẹ búi tóc)",
              "meaning": "Tỉ mỉ chu đáo"
          },
          {
              "char": "攵",
              "pinyin": "pū",
              "hanviet": "Phộc",
              "name": "Bộ Phộc (nét gõ nhẹ)",
              "meaning": "Phản ứng nhanh nhẹn"
          }
      ],
      "mnemonic": "Mỗi một tác động nhỏ (攵) đều được cơ thể cảm nhận và phản xạ siêu nhanh (每): mẫn cảm dị ứng (过敏), nhanh nhẹn mẫn tiệp (敏捷)."
  },
  '断': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰𢆶斤",
      "components": [
          {
              "char": "𢆶",
              "pinyin": "yōu",
              "hanviet": "U",
              "name": "Hai bó tơ",
              "meaning": "Mớ dây rối rắm"
          },
          {
              "char": "斤",
              "pinyin": "jīn",
              "hanviet": "Cân",
              "name": "Bộ Cân (chiếc rìu sắc)",
              "meaning": "Chém đứt dứt khoát"
          }
      ],
      "mnemonic": "Dùng lưỡi rìu sắc bén (斤) chặt đứt phăng mớ tơ rối (𢆶) để phân định rõ ràng: chẩn đoán bệnh tật (判断, 诊断), đứt gãy (断开)."
  },
  '亏': {
      "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰",
          "desc": "Chữ nguyên khối không tách rời"
      },
      "ids": "亏",
      "components": [
          {
              "char": "亏",
              "pinyin": "kuī",
              "hanviet": "Khuy",
              "name": "Hơi thở bị cản trở, hao hụt",
              "meaning": "Thiếu hụt, nhờ cậy may mắn"
          }
      ],
      "mnemonic": "Hình ảnh luồng khí thở ra bị nghẽn lại, biểu thị sự hao khuyết nhưng nhờ đó mà thoát nạn: may mà nhờ có (多亏), hao hụt tổn thất (吃亏)."
  },
  '剂': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰齐刂",
      "components": [
          {
              "char": "齐",
              "pinyin": "qí",
              "hanviet": "Tề",
              "name": "Ngay ngắn bằng tề",
              "meaning": "Cân đo đong đếm chuẩn xác"
          },
          {
              "char": "刂",
              "pinyin": "dāo",
              "hanviet": "Đao",
              "name": "Bộ Đao (con dao chia liều)",
              "meaning": "Dao cắt chia liều thuốc"
          }
      ],
      "mnemonic": "Dùng dao (刂) chia đều tăm tắp (齐) các thang thuốc thảo mộc thành từng liều lượng: liều lượng thuốc men (剂量, 药剂)."
  },
  '遵': {
      "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿺",
          "desc": "Bao bọc góc dưới bên trái"
      },
      "ids": "⿺辶尊",
      "components": [
          {
              "char": "辶",
              "pinyin": "chuò",
              "hanviet": "Sước",
              "name": "Bộ Sước (bước đi)",
              "meaning": "Bước đi theo chỉ dẫn"
          },
          {
              "char": "尊",
              "pinyin": "zūn",
              "hanviet": "Tôn",
              "name": "Chữ Tôn (tôn kính người trên)",
              "meaning": "Tôn kính y lệnh, phép tắc"
          }
      ],
      "mnemonic": "Bước đi (辶) tuân theo sự kính trọng chỉ bảo của bậc tôn sư hoặc y bác sĩ (尊): tuân thủ nghiêm ngặt (遵守, 遵照)."
  },
  '突': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱穴犬",
      "components": [
          {
              "char": "穴",
              "pinyin": "xué",
              "hanviet": "Huyệt",
              "name": "Bộ Huyệt (hang hốc)",
              "meaning": "Hang sâu tối tăm"
          },
          {
              "char": "犬",
              "pinyin": "quǎn",
              "hanviet": "Khuyển",
              "name": "Bộ Khuyển (chó săn)",
              "meaning": "Chó phóng vọt ra bất thình lình"
          }
      ],
      "mnemonic": "Con chó săn (犬) bất thình lình từ trong hang tối (穴) lao vọt ra ngoài: đột nhiên bất ngờ (突然), đột phá (突破)."
  },
  '循': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰彳盾",
      "components": [
          {
              "char": "彳",
              "pinyin": "chì",
              "hanviet": "Xích",
              "name": "Bộ Xích (bước chân trái)",
              "meaning": "Bước đi theo từng bước tuần tự"
          },
          {
              "char": "盾",
              "pinyin": "dùn",
              "hanviet": "Thuẫn",
              "name": "Chiếc khiên che chắn",
              "meaning": "Đi men theo bức tường thành bảo vệ"
          }
      ],
      "mnemonic": "Từng bước chân (彳) men theo chiếc khiên che chắn (盾) vững chắc, lặp lại nhịp nhàng: tuần hoàn (循环), tuân tự (遵循)."
  },
  '懈': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰忄解",
      "components": [
          {
              "char": "忄",
              "pinyin": "xīn",
              "hanviet": "Tâm",
              "name": "Bộ Tâm (trái tim)",
              "meaning": "Ý chí, tâm trí"
          },
          {
              "char": "解",
              "pinyin": "jiě",
              "hanviet": "Giải",
              "name": "Giải tán, nới lỏng",
              "meaning": "Buông lỏng không tập trung"
          }
      ],
      "mnemonic": "Tâm trí (忄) buông lỏng giải tán (解) sự tập trung dẫn tới lười biếng, chểnh mảng: kiên trì không lơi lỏng (坚持不懈)."
  },
  '废': {
      "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸",
          "desc": "Bao bọc góc trên bên trái"
      },
      "ids": "⿸广发",
      "components": [
          {
              "char": "广",
              "pinyin": "guǎng",
              "hanviet": "Quảng",
              "name": "Bộ Quảng (mái nhà)",
              "meaning": "Ngôi nhà trống"
          },
          {
              "char": "发",
              "pinyin": "fā",
              "hanviet": "Phát",
              "name": "Bắn ra, phát tán",
              "meaning": "Bắn đi mất, hoang tàn"
          }
      ],
      "mnemonic": "Dưới mái nhà (广) đồ đạc phát tán phân tán (发) trở nên hoang phế đổ nát: bỏ dở giữa chừng (半途而废), phế tích (废墟)."
  },
  '彬': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰林彡",
      "components": [
          {
              "char": "林",
              "pinyin": "lín",
              "hanviet": "Lâm",
              "name": "Rừng cây",
              "meaning": "Chất phác mộc mạc như rừng"
          },
          {
              "char": "彡",
              "pinyin": "shān",
              "hanviet": "Sam",
              "name": "Bộ Sam (hoa văn)",
              "meaning": "Hoa văn trau chuốt rực rỡ"
          }
      ],
      "mnemonic": "Chất phác như rừng (林) kết hợp với hoa văn trau chuốt (彡), văn chất hài hòa: nho nhã lịch thiệp (彬彬有礼)."
  },
  '睦': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰目坴",
      "components": [
          {
              "char": "目",
              "pinyin": "mù",
              "hanviet": "Mục",
              "name": "Bộ Mục (mắt)",
              "meaning": "Ánh mắt hiền hòa nhìn nhau"
          },
          {
              "char": "坴",
              "pinyin": "lù",
              "hanviet": "Lục",
              "name": "Đất gò cao màu mỡ",
              "meaning": "Nền tảng vững bền"
          }
      ],
      "mnemonic": "Ánh mắt (目) hiền hòa nhìn nhau trên mảnh đất chung (坴): hòa thuận thân ái (和睦, 睦邻)."
  },
  '逢': {
      "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿺",
          "desc": "Bao bọc góc dưới bên trái"
      },
      "ids": "⿺辶夆",
      "components": [
          {
              "char": "辶",
              "pinyin": "chuò",
              "hanviet": "Sước",
              "name": "Bộ Sước (bước đi)",
              "meaning": "Bước chân trên đường đời"
          },
          {
              "char": "夆",
              "pinyin": "féng",
              "hanviet": "Phùng",
              "name": "Gặp gỡ ở mũi nhọn",
              "meaning": "Hai bên cùng tiến tới gặp nhau"
          }
      ],
      "mnemonic": "Bước chân đi trên đường (辶) bất ngờ gặp gỡ tương phùng (夆): nghìn năm khó gặp (千载难逢), tương phùng (重逢)."
  },
  '缓': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰纟爰",
      "components": [
          {
              "char": "纟",
              "pinyin": "sī",
              "hanviet": "Mịch",
              "name": "Bộ Mịch (sợi tơ)",
              "meaning": "Sợi dây kéo"
          },
          {
              "char": "爰",
              "pinyin": "yuán",
              "hanviet": "Viên",
              "name": "Kéo tay dẫn dắt",
              "meaning": "Chậm rãi nới lỏng tay kéo"
          }
      ],
      "mnemonic": "Sợi dây (纟) từ từ nới lỏng kéo dài (爰) nhịp độ thời gian: không thể chậm trễ (刻不容缓), chậm rãi hoãn lại (缓慢, 缓解)."
  },
  '薪': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱艹新",
      "components": [
          {
              "char": "艹",
              "pinyin": "cǎo",
              "hanviet": "Thảo",
              "name": "Bộ Thảo (cây cỏ)",
              "meaning": "Cành cây, củi đóm khô"
          },
          {
              "char": "新",
              "pinyin": "xīn",
              "hanviet": "Tân",
              "name": "Chữ Tân (mới đốn)",
              "meaning": "Cây gỗ mới chặt trong rừng"
          }
      ],
      "mnemonic": "Cây cỏ cành gai mới chặt (新) chất thành đống củi: nằm gai nếm mật (卧薪尝胆), tiền lương chi tiêu (薪水)."
  },
  '釜': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱父金",
      "components": [
          {
              "char": "父",
              "pinyin": "fù",
              "hanviet": "Phụ",
              "name": "Người cha, trụ cột",
              "meaning": "Đôi tay cầm công cụ"
          },
          {
              "char": "金",
              "pinyin": "jīn",
              "hanviet": "Kim",
              "name": "Bộ Kim (kim loại)",
              "meaning": "Nồi kim loại đúc dày dặn"
          }
      ],
      "mnemonic": "Dụng cụ đun nấu bằng kim loại (金) người cha (父) dùng nấu ăn trong quân ngũ: đập nồi dìm thuyền (破釜沉舟)."
  },
  '锦': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰钅帛",
      "components": [
          {
              "char": "钅",
              "pinyin": "jīn",
              "hanviet": "Kim",
              "name": "Bộ Kim (quý giá như vàng)",
              "meaning": "Lấp lánh ánh kim"
          },
          {
              "char": "帛",
              "pinyin": "bó",
              "hanviet": "Bạch",
              "name": "Lụa tơ tằm trắng",
              "meaning": "Vải lụa cao cấp"
          }
      ],
      "mnemonic": "Tấm lụa tơ tằm (帛) dệt hoa văn óng ánh quý như vàng (钅): thêu hoa trên gấm (锦上添花), tiền đồ rực rỡ (前程似锦)."
  },
  '睛': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰目青",
      "components": [
          {
              "char": "目",
              "pinyin": "mù",
              "hanviet": "Mục",
              "name": "Bộ Mục (con mắt)",
              "meaning": "Mắt nhìn"
          },
          {
              "char": "青",
              "pinyin": "qīng",
              "hanviet": "Thanh",
              "name": "Màu xanh trong veo",
              "meaning": "Con ngươi đen lánh trong veo"
          }
      ],
      "mnemonic": "Con mắt (目) có tròng xanh trong veo (青) chính là con ngươi điểm sáng: vẽ rồng điểm mắt (画龙点睛), đôi mắt (眼睛)."
  },
  '简': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱⺮间",
      "components": [
          {
              "char": "⺮",
              "pinyin": "zhú",
              "hanviet": "Trúc",
              "name": "Bộ Trúc (thẻ tre)",
              "meaning": "Thẻ tre chép sử thời cổ"
          },
          {
              "char": "间",
              "pinyin": "jiān",
              "hanviet": "Gian",
              "name": "Khoảng trống, ngăn cách",
              "meaning": "Gọt bớt chữ giữa các khe thẻ tre"
          }
      ],
      "mnemonic": "Viết chữ tóm lược trên các nan tre (⺮) có khoảng cách thưa thoáng (间): đơn giản (简单), sơ yếu lý lịch (简历)."
  },
  '履': {
      "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸",
          "desc": "Bao bọc góc trên bên trái"
      },
      "ids": "⿸尸复",
      "components": [
          {
              "char": "尸",
              "pinyin": "shī",
              "hanviet": "Thi",
              "name": "Bộ Thi (thân thể)",
              "meaning": "Dáng người đi lại"
          },
          {
              "char": "复",
              "pinyin": "fù",
              "hanviet": "Phức",
              "name": "Bước chân lặp lại",
              "meaning": "Dấu chân in trên đường"
          }
      ],
      "mnemonic": "Thân người (尸) bước đi lặp lại từng bước (复) in dấu giày trên đất: thực hiện nghĩa vụ (履行), lý lịch bước đời (履历)."
  },
  '筹': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱⺮寿",
      "components": [
          {
              "char": "⺮",
              "pinyin": "zhú",
              "hanviet": "Trúc",
              "name": "Bộ Trúc (thẻ tính bằng tre)",
              "meaning": "Thẻ tính toán số liệu"
          },
          {
              "char": "寿",
              "pinyin": "shòu",
              "hanviet": "Thọ",
              "name": "Lâu dài, trù tính xa",
              "meaning": "Tính toán kế hoạch trường cửu"
          }
      ],
      "mnemonic": "Dùng thẻ tre (⺮) để tính toán mưu lược trường cửu (寿): trù tính tổng thể (统筹), trù bị (筹备)."
  },
  '协': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰十办",
      "components": [
          {
              "char": "十",
              "pinyin": "shí",
              "hanviet": "Thập",
              "name": "Bộ Thập (số mười, trọn vẹn)",
              "meaning": "Đông đảo mười phương"
          },
          {
              "char": "办",
              "pinyin": "bàn",
              "hanviet": "Biện",
              "name": "Dùng sức chung làm việc",
              "meaning": "Hợp sức giải quyết"
          }
      ],
      "mnemonic": "Mười người (十) cùng xúm tay làm việc (办) tạo nên sức mạnh điều phối: điều phối hiệp lực (协调), hiệp thương (协商)."
  },
  '划': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰戈刂",
      "components": [
          {
              "char": "戈",
              "pinyin": "gē",
              "hanviet": "Qua",
              "name": "Bộ Qua (binh khí giáo mác)",
              "meaning": "Đầu mác sắc nhọn"
          },
          {
              "char": "刂",
              "pinyin": "dāo",
              "hanviet": "Đao",
              "name": "Bộ Đao (con dao khắc vạch)",
              "meaning": "Khắc vạch đường ranh giới"
          }
      ],
      "mnemonic": "Dùng mũi mác (戈) và lưỡi dao (刂) vạch ranh giới địa bàn tác chiến: quy hoạch chiến lược (规划), phân chia (划分)."
  },
  '挑': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰扌兆",
      "components": [
          {
              "char": "扌",
              "pinyin": "shǒu",
              "hanviet": "Thủ",
              "name": "Bộ Thủ (tay)",
              "meaning": "Bàn tay ghé vai gánh vác"
          },
          {
              "char": "兆",
              "pinyin": "zhào",
              "hanviet": "Triệu",
              "name": "Vết nứt mai rùa điềm báo",
              "meaning": "Điềm báo thử thách lớn"
          }
      ],
      "mnemonic": "Bàn tay (扌) ghé vai gánh lấy trọng trách trước điềm báo khó khăn (兆): khiêu chiến thử thách (挑战), gánh vác (挑梁)."
  },
  '酬': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰酉州",
      "components": [
          {
              "char": "酉",
              "pinyin": "yǒu",
              "hanviet": "Dậu",
              "name": "Bộ Dậu (bình rượu quý)",
              "meaning": "Rượu quý mời khách"
          },
          {
              "char": "州",
              "pinyin": "zhōu",
              "hanviet": "Châu",
              "name": "Các châu quận xa xôi",
              "meaning": "Khách quý từ xa tới"
          }
      ],
      "mnemonic": "Rót chén rượu quý (酉) thết đãi khách từ các châu (州) tới để tạ ơn công lao: thù lao xứng đáng (报酬), thù tiếp (酬谢)."
  },
  '险': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰阝佥",
      "components": [
          {
              "char": "阝",
              "pinyin": "fù",
              "hanviet": "Phụ",
              "name": "Bộ Phụ (vách núi dựng đứng)",
              "meaning": "Địa hình hiểm trở"
          },
          {
              "char": "佥",
              "pinyin": "qiān",
              "hanviet": "Thiêm",
              "name": "Nhiều người tập trung",
              "meaning": "Cùng nhau đối mặt"
          }
      ],
      "mnemonic": "Vách núi dựng đứng (阝) mọi người (佥) cùng lo sợ té ngã: hiểm trở nguy nan (危险), phòng ngừa rủi ro (保险)."
  },
  '竭': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰立曷",
      "components": [
          {
              "char": "立",
              "pinyin": "lì",
              "hanviet": "Lập",
              "name": "Bộ Lập (đứng thẳng)",
              "meaning": "Đứng vững vàng"
          },
          {
              "char": "曷",
              "pinyin": "hé",
              "hanviet": "Hạt",
              "name": "Khát khao mong đợi",
              "meaning": "Cạn kiệt nước uống"
          }
      ],
      "mnemonic": "Đứng thẳng (立) dốc cạn giọt nước cuối cùng (曷) để hoàn thành nhiệm vụ: dốc hết tâm lực (竭尽全力), cạn kiệt (枯竭)."
  },
  '聘': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰耳甹",
      "components": [
          {
              "char": "耳",
              "pinyin": "ěr",
              "hanviet": "Nhĩ",
              "name": "Bộ Nhĩ (tai lắng nghe)",
              "meaning": "Lắng nghe tiếng lành đồn xa"
          },
          {
              "char": "甹",
              "pinyin": "pīng",
              "hanviet": "Bính",
              "name": "Khí khái hào hiệp",
              "meaning": "Kẻ sĩ tài ba có tài cán"
          }
      ],
      "mnemonic": "Lắng nghe (耳) danh tiếng của bậc hiền tài (甹) rồi mang lễ vật tới mời về làm việc: tuyển dụng chiêu mộ (招聘, 聘请)."
  },
  '询': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰讠旬",
      "components": [
          {
              "char": "讠",
              "pinyin": "yán",
              "hanviet": "Ngôn",
              "name": "Bộ Ngôn (lời nói)",
              "meaning": "Lời thăm hỏi"
          },
          {
              "char": "旬",
              "pinyin": "xún",
              "hanviet": "Tuần",
              "name": "Mười ngày tròn trĩnh",
              "meaning": "Hỏi han thấu đáo khắp lượt"
          }
      ],
      "mnemonic": "Dùng lời lẽ (讠) đi hỏi han thấu đáo khắp lượt (旬) trước khi đưa ra mức giá: hỏi giá thương mại (询价), tư vấn (咨询)."
  },
  '鉴': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱监金",
      "components": [
          {
              "char": "监",
              "pinyin": "jiān",
              "hanviet": "Giám",
              "name": "Giám sát, soi bóng",
              "meaning": "Cúi nhìn xuống soi xét"
          },
          {
              "char": "金",
              "pinyin": "jīn",
              "hanviet": "Kim",
              "name": "Bộ Kim (gương đồng)",
              "meaning": "Tấm gương đồng sáng chói"
          }
      ],
      "mnemonic": "Cúi xuống soi mặt (监) vào chậu đồng thau (金) để nhìn rõ hư thực: soi xét học hỏi kinh nghiệm (借鉴, 鉴别)."
  },
  '扣': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰扌口",
      "components": [
          {
              "char": "扌",
              "pinyin": "shǒu",
              "hanviet": "Thủ",
              "name": "Bộ Thủ (bàn tay)",
              "meaning": "Bàn tay giữ lại"
          },
          {
              "char": "口",
              "pinyin": "kǒu",
              "hanviet": "Khẩu",
              "name": "Bộ Khẩu (cái miệng, nút cài)",
              "meaning": "Giữ lại một phần ở cửa"
          }
      ],
      "mnemonic": "Bàn tay (扌) giữ lại một phần ở miệng túi (口): chiết khấu giảm giá (折扣), giữ lại khấu trừ (扣除)."
  },
  '让': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰讠上",
      "components": [
          {
              "char": "讠",
              "pinyin": "yán",
              "hanviet": "Ngôn",
              "name": "Bộ Ngôn (lời nói)",
              "meaning": "Lời lẽ nhã nhặn"
          },
          {
              "char": "上",
              "pinyin": "shàng",
              "hanviet": "Thượng",
              "name": "Lên trên, mời người khác",
              "meaning": "Mời người khác đi trước"
          }
      ],
      "mnemonic": "Dùng lời lẽ (讠) nhã nhặn mời đối phương tiến lên trước (上): nhượng bộ thỏa hiệp (让步), khiêm nhường (谦让)."
  },
  '撤': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿲扌育攵",
      "components": [
          {
              "char": "扌",
              "pinyin": "shǒu",
              "hanviet": "Thủ",
              "name": "Bộ Thủ (tay)",
              "meaning": "Bàn tay thu hồi"
          },
          {
              "char": "育",
              "pinyin": "yù",
              "hanviet": "Dục",
              "name": "Nuôi dưỡng",
              "meaning": "Vốn liếng nuôi nấng"
          },
          {
              "char": "攵",
              "pinyin": "pū",
              "hanviet": "Phộc",
              "name": "Đánh gõ, xua đi",
              "meaning": "Xua quân rút về"
          }
      ],
      "mnemonic": "Bàn tay (扌) thu hồi toàn bộ vốn liếng lực lượng (育攵) rút về nơi an toàn: triệt hồi, hủy bỏ (撤回, 撤销)."
  },
  '销': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰钅肖",
      "components": [
          {
              "char": "钅",
              "pinyin": "jīn",
              "hanviet": "Kim",
              "name": "Bộ Kim (kim loại)",
              "meaning": "Thỏi kim loại nung"
          },
          {
              "char": "肖",
              "pinyin": "xiào",
              "hanviet": "Tiếu",
              "name": "Nhỏ dần tan biến",
              "meaning": "Nung chảy tiêu hao"
          }
      ],
      "mnemonic": "Thỏi kim loại (钅) bị nung nóng tiêu biến dần (肖): hủy bỏ tiêu hủy (撤销), tiêu thụ hàng hóa (销售)."
  },
  '抗': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰扌亢",
      "components": [
          {
              "char": "扌",
              "pinyin": "shǒu",
              "hanviet": "Thủ",
              "name": "Bộ Thủ (bàn tay)",
              "meaning": "Bàn tay giơ lên cản phá"
          },
          {
              "char": "亢",
              "pinyin": "kàng",
              "hanviet": "Kháng",
              "name": "Cổ ngẩng cao hiên ngang",
              "meaning": "Đầu không cúi"
          }
      ],
      "mnemonic": "Bàn tay (扌) giơ cao cùng chiếc cổ ngẩng kiên cường (亢) chống đỡ sức ép: kháng cự bất khả kháng (不可抗力, 抗拒)."
  },
  '裁': {
      "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿹",
          "desc": "Bao bọc góc dưới bên trái"
      },
      "ids": "⿹𢦏衣",
      "components": [
          {
              "char": "𢦏",
              "pinyin": "zāi",
              "hanviet": "Tai",
              "name": "Thanh gỗ có ngấn đo",
              "meaning": "Thước đo phân chia"
          },
          {
              "char": "衣",
              "pinyin": "yī",
              "hanviet": "Y",
              "name": "Bộ Y (tấm áo)",
              "meaning": "Tấm vải cắt may áo"
          }
      ],
      "mnemonic": "Dùng thước đo và kéo cắt tấm vải may áo (衣) ngay ngắn theo chuẩn: phân định phán xét công minh (仲裁, 裁判)."
  },
  '署': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱罒者",
      "components": [
          {
              "char": "罒",
              "pinyin": "wǎng",
              "hanviet": "Võng",
              "name": "Bộ Võng (lưới giăng kín)",
              "meaning": "Quy củ pháp lý"
          },
          {
              "char": "者",
              "pinyin": "zhě",
              "hanviet": "Giả",
              "name": "Người có trách nhiệm",
              "meaning": "Người chấp bút đứng đầu"
          }
      ],
      "mnemonic": "Người đứng đầu cơ quan (者) ký tên dưới lưới pháp luật công minh (罒): ký tên hợp đồng (签署), cơ quan công quyền (公署)."
  },
  '膨': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰月彭",
      "components": [
          {
              "char": "月",
              "pinyin": "ròu",
              "hanviet": "Nhục",
              "name": "Bộ Nhục (da thịt, thân thể)",
              "meaning": "Thân thể căng phồng"
          },
          {
              "char": "彭",
              "pinyin": "péng",
              "hanviet": "Bành",
              "name": "Tiếng trống thùng thình",
              "meaning": "Căng to như mặt trống"
          }
      ],
      "mnemonic": "Cơ thể da thịt (月) căng tròn to vang như mặt trống (彭): bành trướng phình to (膨胀), lạm phát (通货膨胀)."
  },
  '胀': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰月张",
      "components": [
          {
              "char": "月",
              "pinyin": "ròu",
              "hanviet": "Nhục",
              "name": "Bộ Nhục (thân thể)",
              "meaning": "Thân thể"
          },
          {
              "char": "张",
              "pinyin": "zhāng",
              "hanviet": "Trương",
              "name": "Giương cung kéo căng",
              "meaning": "Kéo căng nở to"
          }
      ],
      "mnemonic": "Da thịt cơ thể (月) giương căng nở rộng (张) vượt quá mức bình thường: căng trướng giãn nở (膨胀, 肿胀)."
  },
  '覆': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱覀复",
      "components": [
          {
              "char": "覀",
              "pinyin": "yà",
              "hanviet": "Á",
              "name": "Bộ Á (nắp đậy úp xuống)",
              "meaning": "Úp ngược xuống"
          },
          {
              "char": "复",
              "pinyin": "fù",
              "hanviet": "Phức",
              "name": "Lặp lại, bước chân đi",
              "meaning": "Lật ngược lại"
          }
      ],
      "mnemonic": "Chiếc nắp (覀) úp ngược lại lật đổ toàn bộ trật tự cũ (复): lật đổ cách mạng (颠覆, 覆盖)."
  },
  '慧': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱彗心",
      "components": [
          {
              "char": "彗",
              "pinyin": "huì",
              "hanviet": "Tuệ",
              "name": "Chiếc chổi quét dọn",
              "meaning": "Quét sạch bụi trần phiền não"
          },
          {
              "char": "心",
              "pinyin": "xīn",
              "hanviet": "Tâm",
              "name": "Bộ Tâm (trái tim, tâm trí)",
              "meaning": "Tâm trí sáng tỏ"
          }
      ],
      "mnemonic": "Dùng chiếc chổi quét (彗) dọn sạch mọi u mê trong tâm trí (心) để thấu suốt vạn vật: trí tuệ thông thái (智慧)."
  },
  '残': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰歹戋",
      "components": [
          {
              "char": "歹",
              "pinyin": "dǎi",
              "hanviet": "Đãi",
              "name": "Bộ Đãi (xương tàn, hư hại)",
              "meaning": "Mảnh xương gãy vụn"
          },
          {
              "char": "戋",
              "pinyin": "jiān",
              "hanviet": "Tiễn",
              "name": "Hai thanh gươm giáo chém nhau",
              "meaning": "Tổn hại chiến tranh"
          }
      ],
      "mnemonic": "Gươm đao chém nhau (戋) chỉ còn sót lại đống xương tàn (歹): tàn khuyết thiếu hụt (残缺), tàn dư (残余)."
  },
  '缺': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰缶夬",
      "components": [
          {
              "char": "缶",
              "pinyin": "fǒu",
              "hanviet": "Phữu",
              "name": "Bộ Phữu (đồ sành sứ)",
              "meaning": "Chiếc vò sành cổ"
          },
          {
              "char": "夬",
              "pinyin": "guài",
              "hanviet": "Quái",
              "name": "Mảnh vỡ sứt mẻ",
              "meaning": "Bị mẻ một góc"
          }
      ],
      "mnemonic": "Chiếc vò sành (缶) bị mẻ sứt mất một góc (夬): khuyết thiếu, thiếu hụt (缺陷, 缺少, 残缺)."
  },
  '缩': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰纟宿",
      "components": [
          {
              "char": "纟",
              "pinyin": "sī",
              "hanviet": "Mịch",
              "name": "Bộ Mịch (sợi chỉ, sợi tơ)",
              "meaning": "Sợi vải tơ tằm"
          },
          {
              "char": "宿",
              "pinyin": "sù",
              "hanviet": "Túc",
              "name": "Nằm co ro trong đêm",
              "meaning": "Thu mình lại"
          }
      ],
      "mnemonic": "Sợi vải (纟) ngâm nước thu nhỏ lại như người nằm co ro trong đêm (宿): co lại, tóm tắt cô đọng (缩小, 缩写)."
  },
  '炼': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰火东",
      "components": [
          {
              "char": "火",
              "pinyin": "huǒ",
              "hanviet": "Hỏa",
              "name": "Bộ Hỏa (ngọn lửa)",
              "meaning": "Ngọn lửa tôi rèn"
          },
          {
              "char": "东",
              "pinyin": "dōng",
              "hanviet": "Đông",
              "name": "Phương Đông mặt trời mọc",
              "meaning": "Ánh dương rực rỡ"
          }
      ],
      "mnemonic": "Dùng ngọn lửa (火) tôi luyện quặng kim loại dưới ánh dương (东) để loại bỏ tạp chất: gọt giũa cô đọng súc tích (精炼), rèn luyện (锻炼)."
  },
  '极': {
      "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰",
          "desc": "Ghép hai phần trái - phải"
      },
      "ids": "⿰木及",
      "components": [
          {
              "char": "木",
              "pinyin": "mù",
              "hanviet": "Mộc",
              "name": "Bộ Mộc (cây gỗ)",
              "meaning": "Thanh xà nóc nhà cao nhất"
          },
          {
              "char": "及",
              "pinyin": "jí",
              "hanviet": "Cập",
              "name": "Vươn tay chạm tới",
              "meaning": "Chạm tới đỉnh cao nhất"
          }
      ],
      "mnemonic": "Thanh xà gỗ nóc nhà (木) cao đến mức chạm tới trời (及): đỉnh cao tột cùng (登峰造极), cực kỳ cực điểm (极其, 极限)."
  },
  '贯': {
      "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱",
          "desc": "Ghép hai phần trên - dưới"
      },
      "ids": "⿱毌贝",
      "components": [
          {
              "char": "毌",
              "pinyin": "guàn",
              "hanviet": "Quán",
              "name": "Sợi dây luồn qua",
              "meaning": "Xâu chuỗi sợi dây"
          },
          {
              "char": "贝",
              "pinyin": "bèi",
              "hanviet": "Bối",
              "name": "Bộ Bối (đồng tiền vỏ sò)",
              "meaning": "Các đồng tiền cổ có lỗ"
          }
      ],
      "mnemonic": "Dùng sợi dây (毌) xâu chuỗi hàng ngàn đồng tiền cổ (贝) lại thành một chuỗi thông suốt: hiểu thấu suốt kết hợp nhuần nhuyễn (融会贯通), xâu chuỗi nhất quán (一贯)."
  }
};

/**
 * Tra cứu thông tin chiết tự chuẩn IDS cho ký tự
 * @param {string} char Ký tự tiếng Trung đơn
 * @returns {Object} Dữ liệu chiết tự chuẩn hóa
 */
export function getHanziDecomposition(char) {
  if (!char || typeof char !== 'string') return null;
  const singleChar = Array.from(char)[0];

  // 1. Kiểm tra trực tiếp trong bộ dữ liệu chiết tự IDS
  if (HANZI_DECOMPOSITION_DATABASE[singleChar]) {
    const item = HANZI_DECOMPOSITION_DATABASE[singleChar];
    return {
      char: singleChar,
      structure: item.structure.code,
      symbol: item.structure.symbol,
      structureName: item.structure.name,
      structureDesc: item.structure.desc,
      ids: item.ids,
      components: item.components,
      mnemonic: item.mnemonic
    };
  }

  // 2. Tra cứu qua bộ thủ Khang Hy nếu chưa có trong database cứng
  const radicalInfo = findRadical(singleChar);
  const isSelfRadical = radicalInfo && radicalInfo.radical === singleChar;

  if (isSelfRadical) {
    return {
      char: singleChar,
      structure: 'single',
      symbol: '◰',
      structureName: 'Đơn thể (独体字)',
      structureDesc: 'Chữ đơn thể độc lập kiêm bộ thủ chuẩn Khang Hy',
      ids: singleChar,
      components: [
        { 
          char: singleChar, 
          pinyin: radicalInfo.pinyin || '', 
          hanviet: radicalInfo.hanviet || '', 
          name: `Bộ ${radicalInfo.hanviet || radicalInfo.radical}`, 
          meaning: radicalInfo.meaning || 'Bộ thủ biểu ý' 
        }
      ],
      mnemonic: `Chữ ${singleChar} là chữ đơn thể độc lập kiêm bộ thủ ${radicalInfo.hanviet || radicalInfo.radical} (${radicalInfo.meaning || ''}).`
    };
  }

  return {
    char: singleChar,
    structure: 'left_right',
    symbol: '⿰',
    structureName: 'Ghép bộ thủ',
    structureDesc: 'Cấu tạo từ bộ thủ và phần thanh âm',
    ids: `⿰${radicalInfo?.radical || '部'}?`,
    components: [
      { 
        char: radicalInfo?.radical || '—', 
        pinyin: radicalInfo?.pinyin || '', 
        hanviet: radicalInfo?.hanviet || '', 
        name: `Bộ ${radicalInfo?.hanviet || radicalInfo?.radical || ''}`, 
        meaning: radicalInfo?.meaning || 'Bộ thủ định nghĩa ý nghĩa' 
      }
    ],
    mnemonic: `Chữ ${singleChar} mang bộ thủ ${radicalInfo?.radical || ''} (${radicalInfo?.meaning || ''}).`
  };
}
