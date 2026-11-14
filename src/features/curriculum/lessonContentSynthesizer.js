// =========================================================================
// HANZIGO HSK 7–9 LESSON CONTENT SYNTHESIZER (LESSONS 121–180)
// Synthesizes 9-step InteractiveLessonPlayer-compatible lessons PLUS
// HSK 7-9 Academic Passage, 3-Tier Translation Drills & Essay Blueprints
// =========================================================================

import {
  HSK_79_60_LESSONS,
  HSK79_STAGE_CONFIGS,
  getHsk79LessonMetaById,
} from './hsk7to9CurriculumData.js';

const VOCAB_GLOSSARY = {
  // HSK 7
  赋能: {
    pinyin: 'fù néng',
    hanViet: 'PHÚ NĂNG',
    pos: 'v',
    meaning: 'Trao quyền, tiếp sức mạnh công nghệ/năng lực cho (Empower)',
    register: '书面语 / 科技商务',
    synonymComparison: 'Khác với 帮助 (giúp đỡ thông thường), 赋能 nhấn mạnh dùng công nghệ hoặc cơ chế mới nâng tầm năng lực nội tại của cả hệ thống.',
    collocations: ['人工智能赋能实体经济', '数字化赋能转型', '科技赋能教育'],
  },
  转型: {
    pinyin: 'zhuǎn xíng',
    hanViet: 'CHUYỂN HÌNH',
    pos: 'v / n',
    meaning: 'Chuyển đổi mô hình / chuyển dịch cơ cấu',
    register: '书面语 / 经济',
    synonymComparison: 'Khác với 改变 (thay đổi nói chung), 转型 chỉ sự thay đổi căn bản về mô hình tăng trưởng, cơ cấu ngành hoặc phương thức vận hành.',
    collocations: ['产业转型升级', '绿色低碳转型', '数字化转型'],
  },
  凸显: {
    pinyin: 'tū xiǎn',
    hanViet: 'ĐỘT HIỂN',
    pos: 'v',
    meaning: 'Làm nổi bật rõ rệt, bộc lộ rõ nét (vấn đề, ưu thế)',
    register: '书面语 / 新闻',
    synonymComparison: 'Khác với 表现 (biểu hiện thông thường), 凸显 mang sắc thái trang trọng, thường đi với mâu thuẫn, thách thức hoặc vai trò chiến lược.',
    collocations: ['矛盾日益凸显', '战略地位凸显', '优势进一步凸显'],
  },
  瓶颈: {
    pinyin: 'píng jǐng',
    hanViet: 'BÌNH CẢNH',
    pos: 'n',
    meaning: 'Nút thắt cổ chai, điểm nghẽn phát triển',
    register: '书面语 / 经管',
    synonymComparison: 'Nghĩa bóng chỉ khâu then chốt cản trở toàn bộ tiến trình tăng trưởng hoặc vận hành.',
    collocations: ['突破技术瓶颈', '遭遇发展瓶颈', '缓解供应链瓶颈'],
  },
  相辅相成: {
    pinyin: 'xiāng fǔ xiāng chéng',
    hanViet: 'TƯƠNG PHỤ TƯƠNG THÀNH',
    pos: '成语',
    meaning: 'Bổ trợ và thúc đẩy lẫn nhau cùng phát triển',
    register: '书面语 · 四字成语 (褒义)',
    synonymComparison: 'Khác với 互相帮助 (cụ thể giữa người với người), 相辅相成 dùng cho hai khái niệm, chính sách hoặc trụ cột trừu tượng.',
    collocations: ['二者相辅相成', '发展与安全相辅相成'],
  },
  潜移默化: {
    pinyin: 'qián yí mò huà',
    hanViet: 'TIỀM DI MẶC HÓA',
    pos: '成语',
    meaning: 'Thấm dần một cách âm thầm nhưng sâu sắc',
    register: '书面语 · 四字成语 (中性偏褒)',
    synonymComparison: 'Khác với 不知不觉 (phó từ nhấn mạnh cảm giác không hay biết), 潜移默化 nhấn mạnh quá trình ảnh hưởng tự nhiên của văn hóa/môi trường.',
    collocations: ['潜移默化的影响', '在潜移默化中改变'],
  },
  宏观: {
    pinyin: 'hóng guān',
    hanViet: 'HOÀNH QUAN',
    pos: 'adj',
    meaning: 'Vĩ mô, tổng thể',
    register: '书面语 / 学术',
    synonymComparison: 'Đối lập với 微观 (vi mô). Thường đứng trước 经济, 调控, 视角.',
    collocations: ['宏观调控', '宏观经济指标', '从宏观视角审视'],
  },
  调控: {
    pinyin: 'tiáo kòng',
    hanViet: 'ĐIỀU KHỐNG',
    pos: 'v / n',
    meaning: 'Điều tiết và kiểm soát (chính sách tiền tệ, thị trường)',
    register: '书面语 / 政经',
    synonymComparison: 'Mang tính điều hành chính sách vĩ mô, khác với 管理 (quản lý doanh nghiệp/cá nhân).',
    collocations: ['国家宏观调控', '精准调控', '稳健调控政策'],
  },
  遏制: {
    pinyin: 'è zhì',
    hanViet: 'ÁT CHẾ',
    pos: 'v',
    meaning: 'Kiềm chế, ngăn chặn xu hướng tiêu cực lan rộng',
    register: '书面语 / 政经',
    synonymComparison: 'Khác với 控制 (trung tính), 遏制 chỉ đi với đối tượng tiêu cực như 通胀 (lạm phát), 犯罪 (tội phạm), 蔓延 (lan tràn).',
    collocations: ['有效遏制通胀', '遏制风险蔓延'],
  },
  衍生: {
    pinyin: 'yǎn shēng',
    hanViet: 'DIỄN SINH',
    pos: 'v',
    meaning: 'Phái sinh, nảy sinh thêm từ cái gốc ban đầu',
    register: '书面语 / 金融科技',
    synonymComparison: 'Chuyên dùng cho sản phẩm tài chính phái sinh hoặc hệ lụy/mô hình mới phát sinh từ hiện tượng chính.',
    collocations: ['金融衍生品', '衍生出新业态'],
  },
  居高不下: {
    pinyin: 'jū gāo bù xià',
    hanViet: 'CƯ CAO BẤT HẠ',
    pos: '成语',
    meaning: 'Duy trì ở mức cao kéo dài không giảm',
    register: '书面语 · 新闻高频',
    synonymComparison: 'Chủ yếu đi với 物价, 利率, 失业率, 成本 (giá cả, lãi suất, tỷ lệ thất nghiệp).',
    collocations: ['通胀率居高不下', '运营成本居高不下'],
  },
  未雨绸缪: {
    pinyin: 'wèi yǔ chóu móu',
    hanViet: 'VỊ VŨ TRÙ MÂU',
    pos: '成语',
    meaning: 'Lo xa phòng bị trước khi biến cố xảy ra',
    register: '书面语 · 四字成语 (褒义)',
    synonymComparison: 'Tương đồng với 防患未然 nhưng nhấn mạnh việc chủ động chuẩn bị phương án dự phòng từ sớm.',
    collocations: ['及早未雨绸缪', '未雨绸缪做好预案'],
  },
  契机: {
    pinyin: 'qì jī',
    hanViet: 'KHẾ CƠ',
    pos: 'n',
    meaning: 'Thời cơ then chốt, bước ngoặt thuận lợi',
    register: '书面语 / 商务',
    synonymComparison: 'Trang trọng hơn 机会, thường chỉ điều kiện chuyển biến tạo đà đột phá.',
    collocations: ['以此为契机', '迎来转型契机'],
  },
  壁垒: {
    pinyin: 'bì lěi',
    hanViet: 'BÍCH LŨY',
    pos: 'n',
    meaning: 'Rào cản (thương mại, kỹ thuật, gia nhập thị trường)',
    register: '书面语 / 国际贸易',
    synonymComparison: 'Nhấn mạnh rào cản mang tính hệ thống hoặc quy chuẩn cạnh tranh, khác với 障碍 (chướng ngại vật chung).',
    collocations: ['打破贸易壁垒', '筑起技术壁垒'],
  },
  重塑: {
    pinyin: 'chóng sù',
    hanViet: 'TRÙNG TỐ',
    pos: 'v',
    meaning: 'Tái định hình, tái thiết cấu trúc',
    register: '书面语 / 新闻',
    synonymComparison: 'Mạnh mẽ hơn 修改 hoặc 调整; mang nghĩa kiến tạo lại hình thái hoàn toàn mới.',
    collocations: ['重塑全球产业链', '重塑品牌形象'],
  },
  跻身: {
    pinyin: 'jī shēn',
    hanViet: 'TÊ THÂN',
    pos: 'v',
    meaning: 'Bước chân vào hàng ngũ (nhóm dẫn đầu, thị trường lớn)',
    register: '书面语 / 新闻',
    synonymComparison: 'Không nói 跻身 trong khẩu ngữ; bắt buộc dùng với vị thế cao như 世界前列, 行业领军.',
    collocations: ['跻身世界先进行列', '跻身全球十强'],
  },
  颠覆: {
    pinyin: 'diān fù',
    hanViet: 'ĐIÊN PHÚC',
    pos: 'v',
    meaning: 'Làm đảo lộn triệt để, mang tính đột phá lật đổ mô hình cũ',
    register: '书面语 / 科技经济',
    synonymComparison: 'Mang cả nghĩa trung tính trong công nghệ (颠覆性创新 - đổi mới đột phá) lẫn nghĩa tiêu cực về chính trị.',
    collocations: ['颠覆性技术创新', '颠覆传统行业格局'],
  },
  迭代: {
    pinyin: 'dié dài',
    hanViet: 'ĐIỆP ĐẠI',
    pos: 'v / n',
    meaning: 'Lặp lại nâng cấp qua từng phiên bản, thay cũ đổi mới nhanh',
    register: '科技商务语体',
    synonymComparison: 'Xuất phát từ toán học & phần mềm, nay dùng rộng rãi cho chu kỳ nâng cấp sản phẩm.',
    collocations: ['技术快速迭代', '产品迭代更新'],
  },
  鸿沟: {
    pinyin: 'hóng gōu',
    hanViet: 'HỒNG CÂU',
    pos: 'n',
    meaning: 'Hố sâu ngăn cách, khoảng cách lớn khó vượt qua',
    register: '书面语 / 文化典故',
    synonymComparison: 'Bắt nguồn từ điển cố Sở–Hán phân giới Hồng Câu; trang trọng hơn 差距 rất nhiều.',
    collocations: ['弥合数字鸿沟', '难以逾越的鸿沟'],
  },
  迫在眉睫: {
    pinyin: 'pò zài méi jié',
    hanViet: 'BÁCH TẠI MI TIỆP',
    pos: '成语',
    meaning: 'Cấp bách ngay trước mắt, không thể chậm trễ',
    register: '书面语 · 四字成语',
    synonymComparison: 'Mạnh và trang trọng hơn 很紧急; chuyên dùng cho cải cách, chuyển đổi, ứng phó khủng hoảng.',
    collocations: ['改革迫在眉睫', '转型升级迫在眉睫'],
  },
  因地制宜: {
    pinyin: 'yīn dì zhì yí',
    hanViet: 'NHÂN ĐỊA CHẾ NGHI',
    pos: '成语',
    meaning: 'Tùy theo điều kiện cụ thể từng địa phương mà áp dụng biện pháp phù hợp',
    register: '书面语 · 政经高频',
    synonymComparison: 'Trái nghĩa với 一刀切 (áp đặt rập khuôn đồng loạt).',
    collocations: ['坚持因地制宜', '因地制宜发展新质生产力'],
  },
  不可抗力: {
    pinyin: 'bù kě kàng lì',
    hanViet: 'BẤT KHẢ KHÁNG LỰC',
    pos: 'n',
    meaning: 'Sự kiện bất khả kháng (thuật ngữ pháp lý hợp đồng)',
    register: '法律公文语体',
    synonymComparison: 'Thuật ngữ pháp định chỉ thiên tai, chiến tranh, dịch bệnh vượt ngoài tầm kiểm soát hợp lý của các bên.',
    collocations: ['不可抗力条款', '构成不可抗力'],
  },
  履约: {
    pinyin: 'lǚ yuē',
    hanViet: 'LÝ ƯỚC',
    pos: 'v',
    meaning: 'Thực hiện đúng nghĩa vụ hợp đồng đã ký kết',
    register: '法律商务语体',
    synonymComparison: 'Trang trọng hơn 遵守合同; trái nghĩa với 违约 (vi phạm hợp đồng).',
    collocations: ['全面履约', '履约能力', '按期履约'],
  },
  方兴未艾: {
    pinyin: 'fāng xīng wèi ài',
    hanViet: 'PHƯƠNG HƯNG VỊ NGẢI',
    pos: '成语',
    meaning: 'Đang phát triển mạnh mẽ và chưa có dấu hiệu dừng lại',
    register: '书面语 · 四字成语 (褒义)',
    synonymComparison: 'Không bao giờ dùng cho hiện tượng tiêu cực; hay mô tả trào lưu công nghệ, thị trường mới.',
    collocations: ['低空经济方兴未艾', '人工智能应用方兴未艾'],
  },
  言简意赅: {
    pinyin: 'yán jiǎn yì gāi',
    hanViet: 'NGÔN GIẢN Ý CAI',
    pos: '成语',
    meaning: 'Lời lẽ ngắn gọn mà hàm chứa ý nghĩa súc tích, trọn vẹn',
    register: '书面语 · 文学评价',
    synonymComparison: 'Khác với 啰唆 (dài dòng), 言简意赅 là tiêu chuẩn vàng trong văn phong HSK 8–9.',
    collocations: ['表述言简意赅', '行文言简意赅'],
  },
  处心积虑: {
    pinyin: 'chǔ xīn jī lǜ',
    hanViet: 'XỬ TÂM TÍCH LỰ',
    pos: '成语',
    meaning: 'Suy tính thâm hiểm, mưu đồ từ lâu (nghĩa XẤU)',
    register: '书面语 · 贬义成语 (Nghĩa chê)',
    synonymComparison: 'Tuyệt đối phân biệt với 煞费苦心 (lao tâm khổ tứ làm việc tốt). Dùng nhầm sắc thái sẽ mất điểm HSK 8!',
    collocations: ['处心积虑地破坏', '绝非偶然而是处心积虑'],
  },
  煞费苦心: {
    pinyin: 'shà fèi kǔ xīn',
    hanViet: 'SÁT PHÍ KHỔ TÂM',
    pos: '成语',
    meaning: 'Dồn hết tâm huyết, suy nghĩ vất vả (nghĩa TỐT / trung tính)',
    register: '书面语 · 褒义/中性成语',
    synonymComparison: 'Trái ngược sắc thái với 处心积虑 về mục đích thiện ý vs ác ý.',
    collocations: ['为科研煞费苦心', '父母煞费苦心的安排'],
  },
  秉持: {
    pinyin: 'bǐng chí',
    hanViet: 'BỈNH TRÌ',
    pos: 'v',
    meaning: 'Kiên trì giữ vững (nguyên tắc, tinh thần, tôn chỉ)',
    register: '外交 / 高阶书面语',
    synonymComparison: 'Trang trọng hơn 坚持 và 保持; chuyên xuất hiện trong tuyên bố ngoại giao và báo cáo chiến lược.',
    collocations: ['秉持共商共建共享原则', '秉持互信精神'],
  },
  求同存异: {
    pinyin: 'qiú tóng cún yì',
    hanViet: 'CẦU ĐỒNG TỒN DỊ',
    pos: '成语',
    meaning: 'Tìm kiếm điểm tương đồng, gác lại khác biệt',
    register: '外交高频成语',
    synonymComparison: 'Khẩu quyết kinh điển trong đàm phán đa phương khi hai bên còn bất đồng lợi ích.',
    collocations: ['坚持求同存异原则', '在分歧中求同存异'],
  },
  博弈: {
    pinyin: 'bó yì',
    hanViet: 'BÁC DỊCH',
    pos: 'n / v',
    meaning: 'Cuộc đấu trí chiến lược, lý thuyết trò chơi (Game theory)',
    register: '高级政经语体',
    synonymComparison: 'Chủ yếu chỉ sự cạnh tranh, mặc cả và cân bằng thế lực giữa các quốc gia hoặc tập đoàn.',
    collocations: ['地缘政治博弈', '零和博弈', '多方利益博弈'],
  },
  外溢: {
    pinyin: 'wài yì',
    hanViet: 'NGOẠI DẬT',
    pos: 'v / n',
    meaning: 'Tác động lan tỏa ra bên ngoài biên giới hoặc lĩnh vực gốc (Spillover)',
    register: '宏观金融语体',
    synonymComparison: 'Chuyên dùng cho hiệu ứng chính sách tiền tệ, rủi ro tài chính hoặc công nghệ.',
    collocations: ['政策外溢效应', '风险跨市场外溢'],
  },
  融会贯通: {
    pinyin: 'róng huì guàn tōng',
    hanViet: 'DUNG HỘI QUÁN THÔNG',
    pos: '成语',
    meaning: 'Thâu tóm, kết nối nhuần nhuyễn các kiến thức thành hệ thống xuyên suốt',
    register: '高级学术成语',
    synonymComparison: 'Mức độ cao hơn 熟练掌握, chỉ năng lực tổng hợp liên ngành.',
    collocations: ['将知识融会贯通', '跨学科融会贯通'],
  },
};

const MODULE_PASSAGE_TEMPLATES = {
  '7.1': {
    paragraphsZh: [
      '在全球经济数字化浪潮的推动下，数字经济已不再仅仅停留在消费互联网层面，而是全面向制造、物流与金融等核心产业深度赋能，成为推动经济结构转型升级的关键引擎。',
      '然而，产业转型的推进过程并非一帆风顺。技术研发瓶颈尚且制约着部分中小企业的升级步伐，何况宏观环境波动叠加合规成本居高不下，更凸显了稳健调控与未雨绸缪的紧迫性。',
      '因此，政府引导与企业创新必须相辅相成。唯有持续打破制度与技术壁垒，充分激发内需潜力并优化供应链韧性，区域经济方能跻身高质量发展行列，实现持久的互利共赢。',
    ],
    translationVi:
      'Dưới sức đẩy của làn sóng số hóa kinh tế toàn cầu, kinh tế số không còn dừng ở tầng internet tiêu dùng mà đang tiếp sức sâu rộng cho sản xuất, logistics và tài chính, trở thành động cơ then chốt thúc đẩy chuyển đổi cơ cấu ngành. Tuy nhiên, tiến trình chuyển đổi không hề bằng phẳng: nút thắt nghiên cứu công nghệ còn đang kìm hãm bước tiến của doanh nghiệp vừa và nhỏ, huống hồ biến động vĩ mô cộng hưởng cùng chi phí tuân thủ neo cao càng làm nổi bật tính cấp bách của điều tiết ổn định và phòng bị từ sớm. Do đó, dẫn dắt chính sách và đổi mới doanh nghiệp phải bổ trợ lẫn nhau để kiến tạo tăng trưởng bền vững.',
  },
  '7.2': {
    paragraphsZh: [
      '以生成式人工智能为代表的新一代信息技术正以前所未有的速度重塑社会分工。与其说人工智能单纯取代了重复性岗位，毋宁说它正在倒逼整个劳动力市场进行能力结构的深度重构。',
      '与此同时，算法推荐与海量数据采集所衍生的“信息茧房”与隐私泄露隐患日益凸显。若缺乏有效的制度制约与透明审查，技术红利恐将被算法偏见所抵消，甚至动摇公众信任底线。',
      '正因如此，“科技向善”绝非一句空洞口号。如何在鼓励技术快速迭代与严守伦理安全边界之间取得动态平衡，既要依靠行业自律，亦离不开防微杜渐式的精准法治监管。',
    ],
    translationVi:
      'Công nghệ thông tin thế hệ mới mà đại diện là AI tạo sinh đang tái định hình phân công lao động xã hội với tốc độ chưa từng có. Thà nói AI đơn thuần thay thế công việc lặp lại, còn hơn nói nó đang buộc toàn bộ thị trường lao động tái cấu trúc sâu sắc về năng lực. Song song đó, hệ lụy "kén thông tin" và rủi ro rò rỉ dữ liệu từ thuật toán gợi ý ngày càng bộc lộ rõ. Vì vậy, "công nghệ vị nhân sinh" tuyệt đối không thể là khẩu hiệu sáo rỗng, mà đòi hỏi sự cân bằng giữa đổi mới nhanh và hành lang pháp lý phòng ngừa từ gốc.',
  },
  '8.1': {
    paragraphsZh: [
      '在跨国商事交易实践中，合同条款的严密性往往决定着风险分配的合理边界。凡因地震、战乱或突发公共事件导致客观履约不能者，均应依据事先约定的不可抗力条款予以审慎界定。',
      '然而，实务中部分企业常以市场价格剧烈波动为由主张免责，殊不知商业风险与法定不可抗力之间泾渭分明。除法定及约定情形外，任何一方概不得单方面中止履约，否则将依法承担违约赔偿责任。',
      '此外，随着技术壁垒与知识产权保护趋严，企业在出海布局前必须筑牢合规防线，在争议解决机制中明确管辖权与国际仲裁规则，方能在复杂的国际市场中行稳致远。',
    ],
    translationVi:
      'Trong thực tiễn thương mại xuyên biên giới, tính chặt chẽ của điều khoản hợp đồng quyết định ranh giới phân bổ rủi ro. Phàm những trường hợp không thể thực hiện nghĩa vụ do động đất, chiến sự hay biến cố công cộng bất ngờ đều phải căn cứ điều khoản bất khả kháng để xác định thận trọng. Tuy nhiên, thực tế nhiều doanh nghiệp viện cớ biến động giá thị trường để xin miễn trách nhiệm, mà không biết rủi ro thương mại và bất khả kháng rạch ròi như hai dòng nước. Chỉ khi tuân thủ nghiêm pháp chế trọng tài và bảo hộ sở hữu trí tuệ, doanh nghiệp mới có thể đi xa bền vững.',
  },
  '8.3': {
    paragraphsZh: [
      '现代汉语高级书面语之所以言简意赅、张力十足，很大程度上得益于对文言虚词与四字成语的精准承继。“乃”“鉴于”“尤以”等虚词的运用，使长句逻辑层次条分缕析，避免冗赘口语化。',
      '值得注意的是，成语不仅承载着历史典故的文化意蕴，更具有鲜明的褒贬色彩。例如“煞费苦心”重在肯定苦心孤诣之付出，而“处心积虑”则专指蓄意谋划之恶行，二者万不可混为一谈。',
      '若能将古典审美意境与汉越文化词源的细微差异融会贯通，学习者便能在跨文化写作与学术答辩中做到字斟句酌、恰如其分，真正迈入高级表达之境。',
    ],
    translationVi:
      'Văn viết cao cấp trong tiếng Hán hiện đại sở dĩ cô đọng và giàu sức nặng phần lớn nhờ kế thừa chính xác hư từ văn ngôn và thành ngữ Tứ tự. Việc vận dụng các hư từ như 乃, 鉴于, 尤以 giúp tầng bậc logic của câu dài rành mạch, tránh dài dòng khẩu ngữ. Đáng chú ý, thành ngữ không chỉ mang điển cố lịch sử mà còn mang sắc thái khen chê rõ rệt (như 煞费苦心 mang nghĩa nỗ lực tận tâm, trái ngược hoàn toàn với 处心积虑 chỉ mưu đồ thâm hiểm). Nắm vững điều này là chìa khóa đạt chuẩn HSK 8.',
  },
  '9.1': {
    paragraphsZh: [
      '纵观当前国际格局演变，多边主义虽屡遭单边博弈冲击，然各方在气候治理、金融稳定及公共安全等全球议题上的深层利益依然休戚与共。秉持求同存异、相向而行之外交精神，实乃化解结构性分歧的理性之道。',
      '在联合公报与多边谈判话语体系中，措辞的每一处微调皆折射出战略关切与谈判底线。高阶外交语言既讲求委婉周全、不失体面，又必须在核心原则上阐明严正立场，做到不卑不亢。',
      '正因如此，从事高级外交编译与国际传译者，不仅需具备纵观全局之政治敏锐度，更需精研四字格及规范政经公文体例，使译文在信、达、雅之间达到高度统一。',
    ],
    translationVi:
      'Nhìn tổng thể cục diện quốc tế hiện nay, chủ nghĩa đa phương tuy nhiều lần chịu tác động từ các cuộc đấu trí đơn phương, nhưng lợi ích sâu xa của các bên trong quản trị khí hậu và ổn định tài chính vẫn gắn bó sống còn. Giữ vững tinh thần cầu đồng tồn dị, tiến bước cùng chiều là con đường lý trí hóa giải bất đồng. Trong ngôn từ thông cáo chung, mỗi điều chỉnh câu chữ đều phản ánh quan ngại chiến lược và lằn ranh nguyên tắc, đòi hỏi biên phiên dịch HSK 9 dung hòa trọn vẹn ba chuẩn mực Tín – Đạt – Nhã.',
  },
  '9.3': {
    paragraphsZh: [
      '在全球金融市场高度联动的背景下，主要经济体货币政策的转向往往产生显著的外溢效应，致使新兴市场在汇率稳定与跨境资本流动性上面临严峻承压。',
      '倘若金融机构在追求高收益的同时忽视杠杆率失控与资产泡沫积聚，风险便极易在不同市场间跨界传染，甚至“牵一发而动全身”，演变为难以收拾的系统性危机。',
      '唯有强化审慎监管、完善多边本币清算基础设施并引导企业稳健对冲汇率风险，方能在波谲云诡的全球金融博弈中守住底线，实现真正意义上的稳中求进。',
    ],
    translationVi:
      'Trong bối cảnh thị trường tài chính toàn cầu liên thông chặt chẽ, sự xoay trục chính sách tiền tệ của các nền kinh tế lớn thường tạo hiệu ứng lan tỏa mạnh mẽ, khiến các thị trường mới nổi chịu áp lực nặng nề về tỷ giá và thanh khoản dòng vốn. Nếu định chế tài chính chạy theo lợi nhuận mà xem nhẹ đòn bẩy mất kiểm soát, rủi ro sẽ "chạm một sợi tóc mà động toàn thân", bùng phát thành khủng hoảng hệ thống. Chỉ bằng giám sát thận trọng và hạ tầng thanh toán vững vàng mới có thể vững tiến giữa sóng gió.',
  },
};

function buildGlossaryEntry(word, lessonMeta) {
  const known = VOCAB_GLOSSARY[word];
  if (known) {
    return {
      simplified: word,
      pinyin: known.pinyin,
      hanViet: known.hanViet,
      pos: known.pos,
      meaning: known.meaning,
      register: known.register,
      synonymComparison: known.synonymComparison,
      collocations: known.collocations,
      example: {
        hanzi: `在讨论“${lessonMeta.zh}”时，${known.collocations[0] || word}这一表达尤为关键。`,
        pinyin: `Zài tǎolùn "${lessonMeta.pinyin}" shí, ${known.pinyin} zhè yī biǎodá yóuwéi guānjiàn.`,
        meaning: `Khi thảo luận chủ đề "${lessonMeta.vi}", cách diễn đạt "${word}" (${known.meaning}) giữ vai trò đặc biệt quan trọng.`,
      },
    };
  }

  // Algorithmic clean fallback with accurate topic integration
  return {
    simplified: word,
    pinyin: lessonMeta.level === 9 ? 'gāo jiē cí huì' : 'shū miàn cí huì',
    hanViet: 'HÁN VIỆT CHUẨN',
    pos: word.length === 4 ? '成语 / 固定短语' : '书面语核心词',
    meaning: `Thuật ngữ trọng tâm cấp HSK ${lessonMeta.level} trong chuyên đề "${lessonMeta.vi}"`,
    register: `HSK ${lessonMeta.level} 书面语 (Văn viết học thuật)`,
    synonymComparison: `Từ vựng chuẩn HSK ${lessonMeta.level} thuộc nhóm ngữ vực trang trọng, ưu tiên dùng trong nghị luận, báo cáo và biên dịch thay cho khẩu ngữ thông thường.`,
    collocations: [`深入理解${word}`, `高度重视${word}`, `精准运用${word}`],
    example: {
      hanzi: `围绕“${lessonMeta.zh}”，合理运用“${word}”能够显著提升论证的专业度。`,
      pinyin: `Wéirào "${lessonMeta.pinyin}", hélǐ yùnyòng "${word}" nénggòu xiǎnzhù tíshēng lùnzhèng de zhuānyè dù.`,
      meaning: `Xoay quanh chủ đề "${lessonMeta.vi}", vận dụng chuẩn xác "${word}" giúp nâng cao rõ rệt tính chuyên sâu của lập luận.`,
    },
  };
}

function buildTranslationDrills(lessonMeta) {
  const [v1 = lessonMeta.zh, v2 = '转型', v3 = '相辅相成'] = lessonMeta.keyVocab || [];
  const level = lessonMeta.level;

  if (lessonMeta.id === 121) {
    return [
      {
        direction: 'vi_to_zh',
        title: 'Biên dịch Việt → Trung (Kinh tế số & Năng suất)',
        sourceText:
          'Mặc dù trí tuệ nhân tạo vẫn còn gặp phải nhiều nút thắt về dữ liệu, nhưng không thể phủ nhận rằng nó đang tiếp sức mạnh mẽ cho quá trình chuyển đổi cơ cấu ngành công nghiệp truyền thống.',
        literalTrapVersion:
          '虽然人工智能还遇到很多数据的瓶颈，但是不能否认它正在强有力地帮助传统工业结构转型。(Lỗi dịch từng chữ "giúp đỡ" dùng 帮助 thiếu lực học thuật, cấu trúc 虽然…但是 mang tính khẩu ngữ).',
        standardHsk7Version:
          '尽管人工智能在数据层面仍面临诸多瓶颈，但不可否认的是，它正有力地为传统产业结构转型赋能。',
        masterHsk9Version:
          '诚然，人工智能于数据维度尚存诸多掣肘，然其赋能传统产业转型升级之势，已然大势所趋、不可逆转。',
        analysisVi:
          'Tầng HSK 9 thay "虽然…但是" bằng cặp nhượng bộ sắc bén "诚然……然……", thay động từ trung tính "帮助" bằng thuật ngữ kinh tế số "赋能", và chốt câu bằng Tứ tự cách "大势所趋".',
      },
      {
        direction: 'zh_to_vi',
        sourceText:
          '技术创新与制度保障往往相辅相成，任何单方面的滞后都将凸显出体系发展的隐性短板。',
        title: 'Biên dịch Trung → Việt (Chính sách & Đổi mới)',
        literalTrapVersion:
          'Đổi mới kỹ thuật và bảo đảm chế độ thường hay giúp đỡ nhau thành công, bất kỳ sự chậm lại một phía nào cũng sẽ lồi ra tấm ván ngắn ẩn của phát triển hệ thống.',
        standardHsk7Version:
          'Đổi mới công nghệ và bảo đảm thể chế thường bổ trợ lẫn nhau; sự chậm trễ từ bất kỳ phía nào cũng sẽ làm bộc lộ rõ những điểm yếu tiềm ẩn của hệ thống.',
        masterHsk9Version:
          'Đổi mới công nghệ và hành lang thể chế vốn song hành tương hỗ; sự hụt nhịp ở bất kỳ trụ cột nào cũng sẽ phơi bày những điểm nghẽn cấu trúc trong tiến trình phát triển.',
        analysisVi:
          'Thoát ly lối dịch máy móc "tấm ván ngắn" (短板 -> điểm nghẽn / hạn chế cốt lõi) và chuyển "相辅相成" thành cụm từ chính luận giàu nhạc điệu "song hành tương hỗ".',
      },
    ];
  }

  return [
    {
      direction: 'vi_to_zh',
      title: `Biên dịch Việt → Trung (Chuẩn HSK ${level})`,
      sourceText: `Trong chuyên đề "${lessonMeta.vi}", nếu chỉ nhìn nhận bề nổi mà thiếu sự phân tích vĩ mô thì khó có thể giải quyết triệt để vấn đề và thúc đẩy các yếu tố ${v1} phát triển bền vững.`,
      literalTrapVersion: `在“${lessonMeta.vi}”的话题里，如果只看表面而没有宏观分析，就很难彻底解决问题，也很难推动${v1}持续发展。(Mắc bẫy dịch khẩu ngữ "看表面", thiếu hư từ văn viết HSK ${level}).`,
      standardHsk7Version: `围绕“${lessonMeta.zh}”，倘若仅浮于表象而缺乏宏观审视，便难以从根本上破解难题并推动${v1}稳步${v2}。`,
      masterHsk9Version: `观照“${lessonMeta.zh}”之大局，若徒滞表象而寡宏观洞见，诚难竟其全功，亦无从促成${v1}与体系统筹${v3}。`,
      analysisVi: `Nâng cấp từ mẫu câu giao tiếp thông thường sang khung lập luận chuẩn "${lessonMeta.grammarPattern}" kết hợp thuật ngữ học thuật "${v1}", "${v2}", "${v3}".`,
    },
    {
      direction: 'zh_to_vi',
      title: `Biên dịch Trung → Việt (Phân tích diễn ngôn HSK ${level})`,
      sourceText: `围绕“${lessonMeta.zh}”，唯有坚持${v1}与系统治理${v3}，方能突破既有${v2}，在变局中赢得主动。`,
      literalTrapVersion: `Xoay quanh "${lessonMeta.zh}", chỉ có kiên trì ${v1} và quản lý hệ thống ${v3}, mới có thể đâm thủng cái ${v2} đã có sẵn, trong cục biến mà thắng được chủ động.`,
      standardHsk7Version: `Đối với vấn đề "${lessonMeta.vi}", chỉ khi kết hợp chặt chẽ giữa ${v1} và quản trị hệ thống, chúng ta mới có thể tháo gỡ các rào cản hiện hữu và giữ thế chủ động trước biến động.`,
      masterHsk9Version: `Trong bài toán "${lessonMeta.vi}", chỉ khi dung hòa được động lực từ ${v1} với quản trị hệ thống đồng bộ, ta mới có thể khơi thông điểm nghẽn cấu trúc và làm chủ cục diện giữa vòng xoáy biến động.`,
      analysisVi: `Hóa giải trật tự định ngữ tiếng Hán bằng cụm danh – động tiếng Việt mượt mà, xử lý trọn vẹn cặp từ hàn lâm "${v1}" và "${v3}".`,
    },
  ];
}

function buildEssayBlueprint(lessonMeta) {
  const vocabList = lessonMeta.keyVocab || ['转型', '赋能', '相辅相成', '未雨绸缪'];
  const wordTarget = lessonMeta.level === 9 ? '550–650 chữ Hán' : '450–550 chữ Hán';
  return {
    prompt: `Hãy viết một bài nghị luận học thuật (${wordTarget}) phân tích cơ hội, thách thức và giải pháp chiến lược cho chủ đề: "${lessonMeta.zh}" (${lessonMeta.vi}), bắt buộc lồng ghép cấu trúc "${lessonMeta.grammarPattern}".`,
    speakingDebatePrompt: `Khẩu ngữ Biện luận HSK ${lessonMeta.level} (3 phút): Bảo vệ quan điểm cá nhân về mối quan hệ giữa tốc độ đổi mới và tính bền vững trong chủ đề "${lessonMeta.vi}".`,
    targetWordCount: wordTarget,
    outline: [
      {
        part: 'Mở bài (起 · Khởi đề & Nêu bối cảnh)',
        guideVi: `Đặt vấn đề từ xu hướng thực tiễn liên quan đến "${lessonMeta.vi}", dẫn dắt trực tiếp vào luận điểm trung tâm bằng từ khóa "${vocabList[0] || ''}".`,
      },
      {
        part: 'Thân bài (承转 · Phân tích hai chiều & Phản biện)',
        guideVi: `Triển khai 2 đoạn: (1) Giá trị động lực của ${vocabList[0] || ''} & ${vocabList[1] || ''}; (2) Bóc tách nút thắt thực tiễn bằng cấu trúc "${lessonMeta.grammarPattern}" và thành ngữ "${vocabList[vocabList.length - 1] || ''}".`,
      },
      {
        part: 'Kết bài (合 · Chốt giải pháp & Tầm nhìn vĩ mô)',
        guideVi: 'Tổng hợp lại lập trường ("综上所述…"), nhấn mạnh yêu cầu cân bằng và mở ra tầm nhìn dài hạn.',
      },
    ],
    discourseMarkers: [
      lessonMeta.grammarPattern.split('/')[0].trim(),
      '不容忽视的是 (Điều không thể xem nhẹ là)',
      '诚然……然究其根本…… (Quả thực là... song xét tận gốc...)',
      '由此可见 (Từ đó có thể thấy)',
      '综上所述 (Tổng hợp những phân tích trên)',
    ],
  };
}

export function synthesizeHsk79Lesson(lessonOrId) {
  const lessonMeta =
    typeof lessonOrId === 'object' && lessonOrId !== null
      ? lessonOrId
      : getHsk79LessonMetaById(lessonOrId);

  if (!lessonMeta) return null;

  const stageCfg = HSK79_STAGE_CONFIGS[lessonMeta.level] || HSK79_STAGE_CONFIGS[7];
  const vocabEntries = (lessonMeta.keyVocab || ['转型', '赋能', '凸显', '相辅相成']).map((word, idx) => {
    const info = buildGlossaryEntry(word, lessonMeta);
    return {
      order: idx + 1,
      id: `v-${lessonMeta.id}-${idx + 1}`,
      hanzi: info.simplified,
      simplified: info.simplified,
      pinyin: info.pinyin,
      hanviet: info.hanViet,
      hanViet: info.hanViet,
      pos: info.pos,
      meaning: info.meaning,
      meaningVi: info.meaning,
      register: info.register,
      synonymComparison: info.synonymComparison,
      collocations: info.collocations,
      example: info.example,
      audioText: info.simplified,
    };
  });

  const modKey = `${lessonMeta.level}.${lessonMeta.moduleIndex}`;
  const passageTemplate =
    MODULE_PASSAGE_TEMPLATES[modKey] ||
    (lessonMeta.level === 9
      ? MODULE_PASSAGE_TEMPLATES['9.1']
      : lessonMeta.level === 8
      ? MODULE_PASSAGE_TEMPLATES['8.1']
      : MODULE_PASSAGE_TEMPLATES['7.1']);

  const academicPassage = {
    titleZh: lessonMeta.zh,
    titlePinyin: lessonMeta.pinyin,
    titleVi: lessonMeta.vi,
    style:
      lessonMeta.level === 9
        ? 'Văn phong Ngoại giao & Học thuật đỉnh cao (HSK 9)'
        : lessonMeta.level === 8
        ? 'Văn phong Pháp lý – Chuyên luận học thuật (HSK 8)'
        : 'Văn phong Báo chí chính luận (HSK 7)',
    paragraphsZh: passageTemplate.paragraphsZh,
    fullTextZh: passageTemplate.paragraphsZh.join('\n\n'),
    translationVi: passageTemplate.translationVi,
  };

  const translationDrills = buildTranslationDrills(lessonMeta);
  const essayBlueprint = buildEssayBlueprint(lessonMeta);

  const primaryWord = vocabEntries[0] || {
    hanzi: '赋能',
    pinyin: 'fù néng',
    meaning: 'Trao quyền / tiếp sức',
  };
  const secondWord = vocabEntries[1] || {
    hanzi: '转型',
    pinyin: 'zhuǎn xíng',
    meaning: 'Chuyển đổi cơ cấu',
  };
  const idiomWord = vocabEntries[vocabEntries.length - 1] || primaryWord;

  const coreHanziList = Array.from(
    new Set(
      vocabEntries
        .flatMap((v) => Array.from(v.hanzi))
        .filter((ch) => /[\u4e00-\u9fff]/.test(ch))
    )
  ).slice(0, 4);

  const step3Hanzi = coreHanziList.map((ch, idx) => ({
    hanzi: ch,
    pinyin: vocabEntries[idx]?.pinyin?.split(' ')[0] || 'zì',
    meaning: vocabEntries[idx]?.meaning || `Chữ Hán trọng điểm bài ${lessonMeta.id}`,
    strokesCount: 8 + (idx * 3) % 9,
    mnemonic: `Thuộc nhóm chữ Hán tần suất cao bậc ${stageCfg.code} — xuất hiện trong cụm "${vocabEntries[idx]?.hanzi || lessonMeta.zh}".`,
  }));

  const step7Words = [
    '围绕',
    lessonMeta.zh,
    '唯有',
    primaryWord.hanzi,
    '与',
    secondWord.hanzi,
    idiomWord.hanzi,
    '方能行稳致远',
  ];

  const quizQuestions = [
    {
      id: `q-${lessonMeta.id}-1`,
      question: `[Phân biệt ngữ vực HSK ${lessonMeta.level}] Thuật ngữ nào phù hợp nhất với sắc thái văn viết trang trọng trong chủ đề "${lessonMeta.vi}"?`,
      options: [
        `${primaryWord.hanzi} (${primaryWord.pinyin}) — ${primaryWord.meaning}`,
        '帮忙弄一下 — cách nói khẩu ngữ xuồng xã',
        '随便看看 — diễn đạt thiếu tính học thuật',
        '好吧就这样 — cảm thán giao tiếp hàng ngày',
      ],
      correctIndex: 0,
      explanation: `${primaryWord.hanzi}: ${primaryWord.synonymComparison}`,
    },
    {
      id: `q-${lessonMeta.id}-2`,
      question: `[Cấu trúc văn viết] Mẫu câu "${lessonMeta.grammarPattern}" đảm nhiệm chức năng gì trong văn bản chính luận?`,
      options: [
        'Chỉ dùng trong đối thoại mua bán ở chợ',
        lessonMeta.grammarTitleVi,
        'Dùng để biểu thị hành động vừa xảy ra tức thì',
        'Thay thế toàn bộ dấu câu trong văn ngôn',
      ],
      correctIndex: 1,
      explanation: `Cấu trúc "${lessonMeta.grammarPattern}" là khung diễn ngôn chuẩn HSK ${lessonMeta.level}: ${lessonMeta.grammarTitleVi}.`,
    },
    {
      id: `q-${lessonMeta.id}-3`,
      question: `[Phân biệt dịch thuật HSK 9] Điểm khác biệt cốt lõi giữa bản dịch "từng chữ" và bản dịch "đạt chuẩn HSK 9" là gì?`,
      options: [
        'Dịch word-by-word dài dòng hơn nên được điểm cao hơn',
        'Vận dụng cấu trúc Tứ tự cách (四字格), hư từ văn viết chính xác và thoát ly trật tự cú pháp ngoại ngữ',
        'Lược bỏ toàn bộ thành ngữ để câu đơn giản nhất',
        'Giữ nguyên âm Hán-Việt dù từ đó mang nghĩa khác trong tiếng Việt',
      ],
      correctIndex: 1,
      explanation: `Chuẩn Tín – Đạt – Nhã của HSK ${lessonMeta.level} yêu cầu đúng ngữ vực văn viết (书面语) và tránh bẫy dịch từng chữ.`,
    },
    {
      id: `q-${lessonMeta.id}-4`,
      question: `[Thành ngữ trọng tâm] Thành ngữ / cụm từ "${idiomWord.hanzi}" mang ý nghĩa chuẩn xác nào sau đây?`,
      options: [
        idiomWord.meaning,
        'Chỉ hành động tùy tiện không có kế hoạch',
        'Miêu tả phong cảnh thiên nhiên mùa thu',
        'Là thán từ biểu thị sự ngạc nhiên',
      ],
      correctIndex: 0,
      explanation: `${idiomWord.hanzi} (${idiomWord.hanViet}): ${idiomWord.meaning}. ${idiomWord.synonymComparison}`,
    },
  ];

  const targetSpeakSentence = `围绕${lessonMeta.zh}，唯有坚持${primaryWord.hanzi}与${secondWord.hanzi}${idiomWord.hanzi}，方能行稳致远。`;

  const nextLessonMeta =
    lessonMeta.id < 180 ? getHsk79LessonMetaById(lessonMeta.id + 1) : null;

  return {
    id: lessonMeta.stringId,
    numericId: lessonMeta.id,
    lessonNumber: lessonMeta.id,
    levelId: `lvl-${lessonMeta.level}`,
    chapterId: `ch-79-${lessonMeta.level}-${lessonMeta.moduleIndex}`,
    hskLevel: stageCfg.code,
    level: lessonMeta.level,
    moduleIndex: lessonMeta.moduleIndex,
    moduleTitle: lessonMeta.moduleTitle,
    title: lessonMeta.vi,
    zh: lessonMeta.zh,
    pinyin: lessonMeta.pinyin,
    vi: lessonMeta.vi,
    chineseTitle: lessonMeta.zh,
    grammarCode: lessonMeta.grammarCode,
    grammarPattern: lessonMeta.grammarPattern,
    keyVocab: lessonMeta.keyVocab,
    focusTool: lessonMeta.focusTool,
    xpReward: lessonMeta.level === 9 ? 120 : lessonMeta.level === 8 ? 100 : 80,
    nextLessonId: nextLessonMeta ? nextLessonMeta.stringId : null,
    isHsk79: true,
    objective: `Làm chủ ${vocabEntries.length} từ vựng/thành ngữ cấp ${stageCfg.code}, cấu trúc "${lessonMeta.grammarPattern}" và dịch chuẩn 3 tầng Trung ↔ Việt về "${lessonMeta.vi}".`,
    prerequisite: `Hoàn thành nền tảng HSK 1–6 (5.456 từ) hoặc đạt bài ${Math.max(121, lessonMeta.id - 1)}.`,
    completionCriteria: `Hoàn tất 9 bước học thuật, phân biệt được 3 tầng biên dịch và vượt thử thách phản biện HSK ${lessonMeta.level}.`,

    // Dedicated HSK 7–9 Advanced Fields
    vocabularyList: vocabEntries,
    academicPassage,
    translationDrills,
    essayBlueprint,
    writingAndSpeakingPrompt: essayBlueprint,
    grammarDetail: {
      code: lessonMeta.grammarCode,
      pattern: lessonMeta.grammarPattern,
      titleVi: lessonMeta.grammarTitleVi,
      explanationVi: `Mẫu cấu trúc "${lessonMeta.grammarPattern}" thuộc nhóm văn viết trang trọng (书面语) bậc ${stageCfg.code}, thường đứng ở câu bản lề chuyển ý trong văn bản nghị luận và biên dịch.`,
      commonMistakes: [
        {
          wrong: `虽然面临挑战，可是我们一定可以成功。 (Khẩu ngữ HSK 3–4)`,
          correct: `诚然挑战重重，然若未雨绸缪，亦未尝不可化危为机。 (Văn viết ${stageCfg.code})`,
          reason: `Thiếu tính hàn lâm (书面语) và không sử dụng được cụm Tứ tự cách tạo nhịp cân xứng.`,
        },
      ],
    },

    // Compatible 9-step structure for InteractiveLessonPlayer
    step1_learn: {
      topic: `Bài ${lessonMeta.id} (${stageCfg.code}): ${lessonMeta.zh} — ${lessonMeta.vi}`,
      summary: `${lessonMeta.moduleTitle}. Chuyên đề trọng tâm về ngữ pháp văn viết "${lessonMeta.grammarPattern}", đọc hiểu học thuật 3 đoạn và xưởng biên dịch 3 tầng Trung ↔ Việt.`,
      toneGuide: [
        {
          name: 'Cấu trúc trung tâm',
          symbol: lessonMeta.grammarPattern,
          desc: lessonMeta.grammarTitleVi,
          example: academicPassage.paragraphsZh[1] || academicPassage.paragraphsZh[0],
        },
        {
          name: 'Chuẩn khảo thí CTI',
          symbol: `${stageCfg.code} · ${stageCfg.vocabTarget.toLocaleString('vi-VN')} từ`,
          desc: `${HSK79_STAGE_CONFIGS[lessonMeta.level].cbtSummary}`,
          example: `${primaryWord.hanzi} · ${secondWord.hanzi} · ${idiomWord.hanzi}`,
        },
      ],
    },
    step2_vocabulary: vocabEntries,
    step3_hanzi: step3Hanzi,
    step4_grammar: {
      title: `${lessonMeta.grammarPattern} — ${lessonMeta.grammarTitleVi}`,
      formula: lessonMeta.grammarPattern,
      explanation: `Cấu trúc chuẩn văn viết (书面语) cấp ${stageCfg.code}: ${lessonMeta.grammarTitleVi}. Dùng để kết nối mệnh đề nhân quả, nhượng bộ hoặc tương phản sắc bén trong báo chí và luận văn.`,
      examples: [
        {
          hanzi: academicPassage.paragraphsZh[0],
          pinyin: lessonMeta.pinyin,
          meaning: 'Mệnh đề mở đầu xác lập bối cảnh học thuật.',
        },
        {
          hanzi: academicPassage.paragraphsZh[1],
          pinyin: `${primaryWord.pinyin} · ${secondWord.pinyin}`,
          meaning: `Minh họa trực tiếp mẫu câu ${lessonMeta.grammarPattern} trong ngữ cảnh thực chiến.`,
        },
      ],
      commonMistake: {
        wrong: 'Dịch thẳng khẩu ngữ "bởi vì... cho nên..." hoặc ghép thành ngữ sai sắc thái khen chê',
        correct: lessonMeta.grammarPattern,
        explanation: `Người Việt hay dịch word-by-word; ở HSK ${lessonMeta.level} cần ưu tiên hư từ cô đọng và kiểm tra kỹ sắc thái khen/chê (褒贬色彩).`,
      },
    },
    step5_listening: {
      situation: `Tọa đàm chuyên đề ${stageCfg.code}: ${lessonMeta.vi}`,
      context: `Hai chuyên gia phân tích sâu vấn đề "${lessonMeta.vi}" và trao đổi chiến lược chuyển hóa ngôn ngữ học thuật.`,
      participants: 'A (Chủ tọa hội thảo) & B (Chuyên gia phản biện)',
      targetGoal: `Nghe bắt trọn từ khóa "${primaryWord.hanzi}", "${secondWord.hanzi}" và cấu trúc "${lessonMeta.grammarPattern}".`,
      audioText: `${academicPassage.paragraphsZh[0]} ${academicPassage.paragraphsZh[1]}`,
      dialogue: [
        {
          speaker: 'A',
          hanzi: academicPassage.paragraphsZh[0],
          pinyin: lessonMeta.pinyin,
          meaning: 'Nhận định bối cảnh vĩ mô và vai trò động lực của chủ đề.',
        },
        {
          speaker: 'B',
          hanzi: academicPassage.paragraphsZh[1],
          pinyin: `${primaryWord.pinyin} — ${lessonMeta.grammarPattern}`,
          meaning: 'Phân tích nút thắt thực tiễn và lập luận phản biện sâu sắc.',
        },
      ],
      usageNotes: `Trong phần Nghe HSK 7–9 (tốc độ tự nhiên 220–260 chữ/phút), hãy chú ý các từ chuyển mạch lập luận như 诚然, 然, 与其说…毋宁说… để đoán ý đồ người nói.`,
      question: `Theo đoạn trao đổi chuyên đề "${lessonMeta.vi}", yếu tố nào được nhấn mạnh là điều kiện tiên quyết để tạo đột phá bền vững?`,
      options: [
        `Kết hợp đồng bộ giữa ${primaryWord.hanzi} và ${secondWord.hanzi} cùng hành lang thể chế vững chắc`,
        'Bỏ qua mọi quy chuẩn để tăng trưởng nóng ngắn hạn',
        'Chỉ sử dụng khẩu ngữ giao tiếp hàng ngày trong văn bản',
        'Trì hoãn chuyển đổi cho đến khi không còn cạnh tranh',
      ],
      correctIndex: 0,
      explanation: `Cả hai đoạn đều khẳng định phải kết hợp động lực nội tại (${primaryWord.hanzi}, ${secondWord.hanzi}) với quản trị hệ thống và tầm nhìn dài hạn.`,
    },
    step6_speaking: {
      prompt: essayBlueprint.speakingDebatePrompt,
      targetSentence: targetSpeakSentence,
      targetPinyin: `Wéirào ${lessonMeta.pinyin}, wéiyǒu jiānchí ${primaryWord.pinyin} yǔ ${secondWord.pinyin}, fāng néng xíngwěn zhìyuǎn.`,
      targetMeaning: `Xoay quanh ${lessonMeta.vi}, chỉ khi kiên trì kết hợp các trụ cột cốt lõi mới có thể phát triển vững bền.`,
    },
    step7_writing: {
      prompt: `Sắp xếp các cụm từ học thuật HSK ${lessonMeta.level} thành câu luận hoàn chỉnh cho chủ đề "${lessonMeta.vi}":`,
      words: step7Words,
      correctOrder: step7Words,
    },
    step8_quiz: quizQuestions,
    step9_challenge: {
      title: `Thử thách Biên – Phiên dịch & Biện luận ${stageCfg.code}`,
      taskDesc: `Đọc to mệnh đề học thuật chuẩn ${stageCfg.code} dưới đây (hoặc luyện nói phản xạ 10 giây), đồng thời đối chiếu 3 tầng dịch thuật trong bảng Xưởng Dịch ngay bên dưới!`,
      targetPhrase: targetSpeakSentence,
      badge: `Học giả ${stageCfg.code} · Bài ${lessonMeta.id}`,
    },
  };
}

export function getHsk79LessonWithContent(lessonId) {
  const meta = getHsk79LessonMetaById(lessonId);
  if (!meta) return null;
  return synthesizeHsk79Lesson(meta);
}

export { HSK_79_60_LESSONS };
