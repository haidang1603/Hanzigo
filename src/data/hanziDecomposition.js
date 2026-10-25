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
