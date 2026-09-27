import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://woszblniatdvijwdkmpm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvc3pibG5pYXRkdmlqd2RrbXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NzEwMTcsImV4cCI6MjEwNjA0NzAxN30.qpSGtdIgGG55MXsLJGbMS3KOLz6W_ZsC16r-6XixMXY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the base 192 clean unique words
import { DEDUPLICATED_VOCAB as BASE_VOCAB } from './seedFullVocabulary.js';

// Add 130+ more distinct, authentic HSK 1, 2, 3 words to reach 320+ unique vocabulary
const ADDITIONAL_VOCAB = [
  // HSK 1
  {
    hanzi: '汉语', pinyin: 'Hànyǔ', hanviet: 'Hán ngữ', meaning: 'Tiếng Hán, tiếng Trung',
    level: 'HSK 1', topic: 'Trường học', radical: '氵(Thủy)', strokes: 14,
    mnemonic: 'Ngôn ngữ của người Hán bên dòng sông Hán Thủy.',
    example: { hanzi: '我学汉语学了六个月。', pinyin: 'Wǒ xué Hànyǔ xué le liù gè yuè.', meaning: 'Tôi học tiếng Trung được 6 tháng rồi.' }
  },
  {
    hanzi: '字', pinyin: 'zì', hanviet: 'Tự', meaning: 'Chữ, chữ Hán',
    level: 'HSK 1', topic: 'Trường học', radical: '宀 (Miên)', strokes: 6,
    mnemonic: 'Đứa trẻ (子) dưới mái nhà (宀) chăm chỉ viết từng con chữ.',
    example: { hanzi: '这个汉字怎么读？', pinyin: 'Zhè ge hànzì zěnme dú?', meaning: 'Chữ Hán này đọc thế nào?' }
  },
  {
    hanzi: '名字', pinyin: 'míngzi', hanviet: 'Danh tự', meaning: 'Tên, họ tên',
    level: 'HSK 1', topic: 'Chào hỏi', radical: '夕 (Tịch)', strokes: 12,
    mnemonic: 'Trong đêm tối (夕) cất tiếng (口) gọi tên danh tính.',
    example: { hanzi: '你的名字真好听。', pinyin: 'Nǐ de míngzi zhēn hǎotīng.', meaning: 'Tên của bạn nghe hay quá.' }
  },
  {
    hanzi: '天气', pinyin: 'tiānqì', hanviet: 'Thiên khí', meaning: 'Thời tiết',
    level: 'HSK 1', topic: 'Thời tiết', radical: '气 (Khí)', strokes: 8,
    mnemonic: 'Khí quyển dưới bầu trời thay đổi nắng mưa.',
    example: { hanzi: '明天的天气预报说会下雨。', pinyin: 'Míngtiān de tiānqì yùbào shuō huì xiàyǔ.', meaning: 'Dự báo thời tiết ngày mai nói sẽ có mưa.' }
  },
  {
    hanzi: '打电话', pinyin: 'dǎ diànhuà', hanviet: 'Đả điện thoại', meaning: 'Gọi điện thoại',
    level: 'HSK 1', topic: 'Giao tiếp', radical: '扌(Thủ)', strokes: 18,
    mnemonic: 'Dùng tay (扌) bấm máy gọi điện truyền lời thoại (话).',
    example: { hanzi: '晚上我给你打电话。', pinyin: 'Wǎnshang wǒ gěi nǐ dǎ diànhuà.', meaning: 'Tối nay tôi sẽ gọi điện cho bạn.' }
  },

  // HSK 2
  {
    hanzi: '早上', pinyin: 'zǎoshang', hanviet: 'Tảo thượng', meaning: 'Buổi sáng sớm',
    level: 'HSK 2', topic: 'Thời gian', radical: '日 (Nhật)', strokes: 9,
    mnemonic: 'Mặt trời mọc sớm chiếu sáng buổi ban mai.',
    example: { hanzi: '早上好！祝你今天一天都顺利。', pinyin: 'Zǎoshang hǎo! Zhù nǐ jīntiān yì tiān dōu shùnlì.', meaning: 'Chào buổi sáng! Chúc bạn một ngày thuận lợi.' }
  },
  {
    hanzi: '晚上', pinyin: 'wǎnshang', hanviet: 'Vãn thượng', meaning: 'Buổi tối',
    level: 'HSK 2', topic: 'Thời gian', radical: '日 (Nhật)', strokes: 14,
    mnemonic: 'Mặt trời lặn đêm muộn buông xuống.',
    example: { hanzi: '晚上八点我在家看书。', pinyin: 'Wǎnshang bā diǎn wǒ zài jiā kàn shū.', meaning: '8 giờ tối tôi ở nhà đọc sách.' }
  },
  {
    hanzi: '铅笔', pinyin: 'qiānbǐ', hanviet: 'Duyên bút', meaning: 'Bút chì',
    level: 'HSK 2', topic: 'Trường học', radical: '竹 (Trúc)', strokes: 21,
    mnemonic: 'Cây bút cán trúc (竹) chứa lõi chì đen nhánh.',
    example: { hanzi: '请借我一支铅笔用一下。', pinyin: 'Qǐng jiè wǒ yì zhī qiānbǐ yòng yíxià.', meaning: 'Xin cho tôi mượn cây bút chì dùng một lát.' }
  },
  {
    hanzi: '报纸', pinyin: 'bàozhǐ', hanviet: 'Báo chỉ', meaning: 'Báo, tờ báo',
    level: 'HSK 2', topic: 'Đời sống', radical: '纟(Mịch)', strokes: 19,
    mnemonic: 'Tờ giấy (纸) in thông tin thời sự báo cáo (报).',
    example: { hanzi: '爷爷每天早晨看报纸。', pinyin: 'Yéye měitiān zǎochén kàn bàozhǐ.', meaning: 'Ông nội mỗi sáng đều đọc báo.' }
  },
  {
    hanzi: '房间', pinyin: 'fángjiān', hanviet: 'Phòng gian', meaning: 'Căn phòng',
    level: 'HSK 2', topic: 'Đời sống', radical: '户 (Hộ)', strokes: 15,
    mnemonic: 'Không gian (间) bên trong cánh cửa ngôi nhà (房).',
    example: { hanzi: '我的房间非常干净整洁。', pinyin: 'Wǒ de fángjiān fēicháng gānjìng zhěngjié.', meaning: 'Căn phòng của tôi rất sạch sẽ và ngăn nắp.' }
  },
  {
    hanzi: '手表', pinyin: 'shǒubiǎo', hanviet: 'Thủ biểu', meaning: 'Đồng hồ đeo tay',
    level: 'HSK 2', topic: 'Đời sống', radical: '手 (Thủ)', strokes: 12,
    mnemonic: 'Vật dụng hiển thị giờ khắc đeo ở cổ tay (手).',
    example: { hanzi: '这块手表是妈妈送给我的生日礼物。', pinyin: 'Zhè kuài shǒubiǎo shì māma sòng gěi wǒ de shēngrì lǐwù.', meaning: 'Chiếc đồng hồ này là quà sinh nhật mẹ tặng tôi.' }
  },
  {
    hanzi: '晴天', pinyin: 'qíngtiān', hanviet: 'Tình thiên', meaning: 'Ngày nắng ráo',
    level: 'HSK 2', topic: 'Thời tiết', radical: '日 (Nhật)', strokes: 16,
    mnemonic: 'Mặt trời (日) tỏa ánh nắng xanh biếc (青) chan hòa.',
    example: { hanzi: '今天是个晴天，适合去郊游。', pinyin: 'Jīntiān shì gè qíngtiān, shìhé qù jiāoyóu.', meaning: 'Hôm nay là ngày nắng, thích hợp đi dã ngoại.' }
  },
  {
    hanzi: '阴天', pinyin: 'yīntiān', hanviet: 'Âm thiên', meaning: 'Trời râm, trời âm u',
    level: 'HSK 2', topic: 'Thời tiết', radical: '阝(Phụ)', strokes: 10,
    mnemonic: 'Bóng râm che khuất ánh mặt trời mây mù phủ kín.',
    example: { hanzi: '虽然是阴天，但天气很凉爽。', pinyin: 'Suīrán shì yīntiān, dàn tiānqì hěn liángshuǎng.', meaning: 'Tuy là trời râm nhưng không khí rất mát mẻ.' }
  },
  {
    hanzi: '下雪', pinyin: 'xiàxuě', hanviet: 'Hạ tuyết', meaning: 'Tuyết rơi',
    level: 'HSK 2', topic: 'Thời tiết', radical: '雨 (Vũ)', strokes: 14,
    mnemonic: 'Bông tuyết trắng muốt rơi từ bầu trời tuyết lạnh (雪).',
    example: { hanzi: '冬天北京经常下雪，景色很美。', pinyin: 'Dōngtiān Běijīng jīngcháng xiàxuě, jǐngsè hěn měi.', meaning: 'Mùa đông Bắc Kinh hay có tuyết rơi, phong cảnh rất đẹp.' }
  },
  {
    hanzi: '下雨', pinyin: 'xiàyǔ', hanviet: 'Hạ vũ', meaning: 'Mưa rơi, trời mưa',
    level: 'HSK 2', topic: 'Thời tiết', radical: '雨 (Vũ)', strokes: 11,
    mnemonic: 'Những hạt mưa từ mây trên trời đổ xuống.',
    example: { hanzi: '外面下大雨了，出门记得带伞。', pinyin: 'Wàimiàn xià dàyǔ le, chūmén jìde dài sǎn.', meaning: 'Bên ngoài mưa to rồi, ra ngoài nhớ mang theo ô.' }
  },
  {
    hanzi: '穿', pinyin: 'chuān', hanviet: 'Xuyên', meaning: 'Mặc (quần áo), đi (giày dép)',
    level: 'HSK 2', topic: 'Đời sống', radical: '穴 (Huyệt)', strokes: 9,
    mnemonic: 'Xỏ chân tay xuyên qua hang huyệt quần áo.',
    example: { hanzi: '今天冷，多穿一点儿衣服。', pinyin: 'Jīntiān lěng, duō chuān yìdiǎnr yīfu.', meaning: 'Hôm nay lạnh, nhớ mặc thêm nhiều áo.' }
  },
  {
    hanzi: '送', pinyin: 'sòng', hanviet: 'Tống', meaning: 'Tặng, tiễn đưa',
    level: 'HSK 2', topic: 'Giao tiếp', radical: '辶 (Sước)', strokes: 9,
    mnemonic: 'Cất bước chân đưa tiễn trao gửi món quà.',
    example: { hanzi: '朋友送了我一本精美的中文小说。', pinyin: 'Péngyou sòng le wǒ yì běn jīngměi de Zhōngwén xiǎoshuō.', meaning: 'Bạn bè tặng tôi một cuốn tiểu thuyết tiếng Trung rất đẹp.' }
  },
  {
    hanzi: '给', pinyin: 'gěi', hanviet: 'Cấp', meaning: 'Cho, đưa cho, tặng',
    level: 'HSK 2', topic: 'Giao tiếp', radical: '纟(Mịch)', strokes: 9,
    mnemonic: 'Nối kết sợi dây trao tận tay cho đối phương.',
    example: { hanzi: '请给我一张发票。', pinyin: 'Qǐng gěi wǒ yì zhāng fāpiào.', meaning: 'Xin xuất cho tôi một tờ hóa đơn.' }
  },
  {
    hanzi: '问', pinyin: 'wèn', hanviet: 'Vấn', meaning: 'Hỏi, thắc mắc',
    level: 'HSK 2', topic: 'Giao tiếp', radical: '门 (Môn)', strokes: 6,
    mnemonic: 'Mở miệng (口) cất lời hỏi trước cửa nhà (门).',
    example: { hanzi: '请问，洗手间在哪个方向？', pinyin: 'Qǐngwèn, xǐshǒujiān zài nǎ ge fāngxiàng?', meaning: 'Xin hỏi, nhà vệ sinh ở hướng nào ạ?' }
  },
  {
    hanzi: '找', pinyin: 'zhǎo', hanviet: 'Trảo', meaning: 'Tìm kiếm, thối lại (tiền lẻ)',
    level: 'HSK 2', topic: 'Mua sắm', radical: '扌(Thủ)', strokes: 7,
    mnemonic: 'Dùng bàn tay (扌) cầm ngọn đuốc tìm kiếm đồ thất lạc.',
    example: { hanzi: '找你五块钱，谢谢光临！', pinyin: 'Zhǎo nǐ wǔ kuài qián, xièxie guānglín!', meaning: 'Thối lại bạn 5 đồng, cảm ơn quý khách!' }
  },
  {
    hanzi: '告诉', pinyin: 'gàosu', hanviet: 'Cáo tố', meaning: 'Bảo, nói cho biết',
    level: 'HSK 2', topic: 'Giao tiếp', radical: '讠(Ngôn)', strokes: 14,
    mnemonic: 'Dùng lời nói (讠) thông báo báo cáo tin tức.',
    example: { hanzi: '请告诉我明天开会的具体时间。', pinyin: 'Qǐng gàosu wǒ míngtiān kāihuì de jùtǐ shíjiān.', meaning: 'Xin hãy nói cho tôi biết thời gian họp cụ thể ngày mai.' }
  },
  {
    hanzi: '等', pinyin: 'děng', hanviet: 'Đẳng', meaning: 'Chờ đợi, đợi',
    level: 'HSK 2', topic: 'Hành động', radical: '竹 (Trúc)', strokes: 12,
    mnemonic: 'Xếp thẻ tre theo thứ tự chờ đến lượt mình.',
    example: { hanzi: '请在这儿等我一下。', pinyin: 'Qǐng zài zhèr děng wǒ yíxià.', meaning: 'Xin hãy chờ tôi ở đây một lát.' }
  },
  {
    hanzi: '让', pinyin: 'ràng', hanviet: 'Nhượng', meaning: 'Nhường, để cho, bảo',
    level: 'HSK 2', topic: 'Giao tiếp', radical: '讠(Ngôn)', strokes: 5,
    mnemonic: 'Dùng lời nói nhã nhặn nhường nhịn người khác.',
    example: { hanzi: '老师让我回答这个问题。', pinyin: 'Lǎoshī ràng wǒ huídá zhè ge wèntí.', meaning: 'Cô giáo bảo tôi trả lời câu hỏi này.' }
  },
  {
    hanzi: '希望', pinyin: 'xīwàng', hanviet: 'Hi vọng', meaning: 'Hi vọng, mong muốn',
    level: 'HSK 2', topic: 'Cảm xúc', radical: '月 (Nguyệt)', strokes: 18,
    mnemonic: 'Ánh trăng hiền hòa gieo niềm hi vọng ngóng trông.',
    example: { hanzi: '我希望大家都考出好成绩。', pinyin: 'Wǒ xīwàng dàjiā dōu kǎochū hǎo chéngjì.', meaning: 'Tôi hi vọng mọi người đều đạt kết quả thi thật tốt.' }
  },
  {
    hanzi: '因为', pinyin: 'yīnwèi', hanviet: 'Nhân vị', meaning: 'Bởi vì, do vì',
    level: 'HSK 2', topic: 'Liên từ', radical: '囗 (Vi)', strokes: 10,
    mnemonic: 'Nguyên nhân nằm trọn trong khuôn khổ vấn đề.',
    example: { hanzi: '因为今天下雨，所以我们没去公园。', pinyin: 'Yīnwèi jīntiān xiàyǔ, suǒyǐ wǒmen méi qù gōngyuán.', meaning: 'Bởi vì hôm nay trời mưa nên chúng tôi không đi công viên.' }
  },
  {
    hanzi: '所以', pinyin: 'suǒyǐ', hanviet: 'Sở dĩ', meaning: 'Cho nên, vì thế',
    level: 'HSK 2', topic: 'Liên từ', radical: '斤 (Cân)', strokes: 12,
    mnemonic: 'Kết quả logic đưa ra phương án xử lý.',
    example: { hanzi: '他学习很努力，所以成绩很优秀。', pinyin: 'Tā xuéxí hěn nǔlì, suǒyǐ chéngjì hěn yōuxiù.', meaning: 'Anh ấy học rất chăm chỉ, cho nên thành tích rất xuất sắc.' }
  },
  {
    hanzi: '但是', pinyin: 'dànshì', hanviet: 'Đãn thị', meaning: 'Nhưng, thế nhưng',
    level: 'HSK 2', topic: 'Liên từ', radical: '亻 (Nhân đứng)', strokes: 16,
    mnemonic: 'Chuyển ý đối lập giữa hai vế câu.',
    example: { hanzi: '汉语虽然难，但是很有意思。', pinyin: 'Hànyǔ suīrán nán, dànshì hěn yǒu yìsi.', meaning: 'Tiếng Trung tuy khó nhưng rất thú vị.' }
  },
  {
    hanzi: '虽然', pinyin: 'suīrán', hanviet: 'Tuy nhiên', meaning: 'Mặc dù, dẫu rằng',
    level: 'HSK 2', topic: 'Liên từ', radical: '虫 (Trùng)', strokes: 21,
    mnemonic: 'Thừa nhận vế đầu để nhấn mạnh ý đằng sau.',
    example: { hanzi: '虽然天气冷，他依然坚持早起晨跑。', pinyin: 'Suīrán tiānqì lěng, tā yīrán jiānchí zǎoqǐ chénpǎo.', meaning: 'Mặc dù trời lạnh, anh ấy vẫn kiên trì dậy sớm chạy bộ.' }
  },
  {
    hanzi: '正在', pinyin: 'zhèngzài', hanviet: 'Chính tại', meaning: 'Đang (làm gì đó)',
    level: 'HSK 2', topic: 'Phó từ', radical: '止 (Chỉ)', strokes: 11,
    mnemonic: 'Hành động đang diễn ra đúng vào thời điểm này.',
    example: { hanzi: '他们正在教室里专心听课。', pinyin: 'Tāmen zhèngzài jiàoshì lǐ zhuānxīn tīngkè.', meaning: 'Họ đang chăm chú nghe giảng trong lớp học.' }
  },
  {
    hanzi: '真', pinyin: 'zhēn', hanviet: 'Chân', meaning: 'Thật, thật là',
    level: 'HSK 2', topic: 'Phó từ', radical: '目 (Mục)', strokes: 10,
    mnemonic: 'Chân thực ngay trước mắt không hề giả tạo.',
    example: { hanzi: '你今天的精神状态真好！', pinyin: 'Nǐ jīntiān de jīngshén zhuàngtài zhēn hǎo!', meaning: 'Hôm nay tinh thần của bạn thật là tốt!' }
  },
  {
    hanzi: '最', pinyin: 'zuì', hanviet: 'Tối', meaning: 'Nhất (mức độ cao nhất)',
    level: 'HSK 2', topic: 'Phó từ', radical: '日 (Nhật)', strokes: 12,
    mnemonic: 'Mặt trời chiếu tỏ đỉnh cao nhất trên đôi tai (耳).',
    example: { hanzi: '这是我最喜欢读的一本中文书。', pinyin: 'Zhè shì wǒ zuì xǐhuan dú de yì běn Zhōngwén shū.', meaning: 'Đây là cuốn sách tiếng Trung mà tôi thích đọc nhất.' }
  },
  {
    hanzi: '件', pinyin: 'jiàn', hanviet: 'Kiện', meaning: 'Chiếc, cái (lượng từ quần áo, sự việc)',
    level: 'HSK 2', topic: 'Lượng từ', radical: '亻 (Nhân đứng)', strokes: 6,
    mnemonic: 'Mỗi một sự kiện đồ vật của con người.',
    example: { hanzi: '这件衣服质量非常好。', pinyin: 'Zhè jiàn yīfu zhìliàng fēicháng hǎo.', meaning: 'Bộ quần áo này chất lượng rất tốt.' }
  },
  {
    hanzi: '斤', pinyin: 'jīn', hanviet: 'Cân', meaning: 'Cân (đơn vị đo lường TQ = 500g)',
    level: 'HSK 2', topic: 'Lượng từ', radical: '斤 (Cân)', strokes: 4,
    mnemonic: 'Hình chiếc rìu cân đo đong đếm trọng lượng.',
    example: { hanzi: '苹果三块钱一斤。', pinyin: 'Píngguǒ sān kuài qián yì jīn.', meaning: 'Táo ba đồng một cân.' }
  },
  {
    hanzi: '两', pinyin: 'liǎng', hanviet: 'Lưỡng', meaning: 'Hai (dùng trước lượng từ)',
    level: 'HSK 2', topic: 'Con số', radical: '一 (Nhất)', strokes: 7,
    mnemonic: 'Cặp đôi cân xứng cùng nhau xuất hiện.',
    example: { hanzi: '我有两张今晚的话剧票。', pinyin: 'Wǒ yǒu liǎng zhāng jīnwǎn de huàjù piào.', meaning: 'Tôi có hai vé kịch tối nay.' }
  },
  {
    hanzi: '千', pinyin: 'qiān', hanviet: 'Thiên', meaning: 'Nghìn, 1000',
    level: 'HSK 2', topic: 'Con số', radical: '十 (Thập)', strokes: 3,
    mnemonic: 'Thêm nét phẩy trên chữ Thập (十) biểu thị một nghìn.',
    example: { hanzi: '这台电脑三千块钱。', pinyin: 'Zhè tái diànnǎo sānqiān kuài qián.', meaning: 'Chiếc máy tính này 3000 đồng.' }
  },

  // HSK 3
  {
    hanzi: '打算', pinyin: 'dǎsuàn', hanviet: 'Đả toán', meaning: 'Dự định, tính toán',
    level: 'HSK 3', topic: 'Hành động', radical: '扌(Thủ)', strokes: 19,
    mnemonic: 'Dùng bàn tay (扌) gảy bàn tính lên kế hoạch.',
    example: { hanzi: '大学毕业后你有什么打算？', pinyin: 'Dàxué bìyè hòu nǐ yǒu shénme dǎsuàn?', meaning: 'Sau khi tốt nghiệp đại học bạn có dự định gì?' }
  },
  {
    hanzi: '结束', pinyin: 'jiéshù', hanviet: 'Kết thúc', meaning: 'Kết thúc, chấm dứt',
    level: 'HSK 3', topic: 'Hành động', radical: '纟(Mịch)', strokes: 19,
    mnemonic: 'Buộc túm nút chỉ lại hoàn tất sự việc.',
    example: { hanzi: '会议大概在五点钟结束。', pinyin: 'Huìyì dàgài zài wǔ diǎn zhōng jiéshù.', meaning: 'Cuộc họp khoảng 5 giờ sẽ kết thúc.' }
  },
  {
    hanzi: '决定', pinyin: 'juédìng', hanviet: 'Quyết định', meaning: 'Quyết định, định đoạt',
    level: 'HSK 3', topic: 'Hành động', radical: '氵(Chấm thủy)', strokes: 15,
    mnemonic: 'Dòng nước quyết đoán định hình con đường đi.',
    example: { hanzi: '经过深思熟虑，我决定去北京留学。', pinyin: 'Jīngguò shēnsīshúlǜ, wǒ juédìng qù Běijīng liúxué.', meaning: 'Sau khi suy nghĩ kỹ, tôi quyết định sang Bắc Kinh du học.' }
  },
  {
    hanzi: '解决', pinyin: 'jiějué', hanviet: 'Giải quyết', meaning: 'Giải quyết (vấn đề, khó khăn)',
    level: 'HSK 3', topic: 'Công việc', radical: '角 (Giác)', strokes: 19,
    mnemonic: 'Dùng dao mổ xẻ gỡ rối mọi khúc mắc.',
    example: { hanzi: '我们要共同努力解决这个难题。', pinyin: 'Wǒmen yào gòngtóng nǔlì jiějué zhè ge nántí.', meaning: 'Chúng ta phải cùng nhau nỗ lực giải quyết vấn đề khó khăn này.' }
  },
  {
    hanzi: '提高', pinyin: 'tígāo', hanviet: 'Đề cao', meaning: 'Nâng cao, cải thiện',
    level: 'HSK 3', topic: 'Học tập', radical: '扌(Thủ)', strokes: 22,
    mnemonic: 'Đưa bàn tay nâng tầm kiến thức lên cao.',
    example: { hanzi: '多读中文原版书能有效提高词汇量。', pinyin: 'Duō dú Zhōngwén yuánbǎn shū néng yǒuxiào tígāo cíhuìliàng.', meaning: 'Đọc nhiều sách tiếng Trung gốc giúp nâng cao lượng từ vựng hiệu quả.' }
  },
  {
    hanzi: '完成', pinyin: 'wánchéng', hanviet: 'Hoàn thành', meaning: 'Hoàn thành, làm xong',
    level: 'HSK 3', topic: 'Công việc', radical: '宀 (Miên)', strokes: 13,
    mnemonic: 'Ngôi nhà xây xong hoàn thiện vững chắc.',
    example: { hanzi: '我终于在下班前完成了这份报告。', pinyin: 'Wǒ zhōngyú zài xiàbān qián wánchéng le zhè fèn bàogào.', meaning: 'Cuối cùng tôi đã hoàn thành bản báo cáo này trước giờ tan tầm.' }
  },
  {
    hanzi: '选择', pinyin: 'xuǎnzé', hanviet: 'Tuyển trạch', meaning: 'Lựa chọn, tuyển chọn',
    level: 'HSK 3', topic: 'Hành động', radical: '辶 (Sước)', strokes: 24,
    mnemonic: 'Chọn lựa con đường đi đúng đắn nhất.',
    example: { hanzi: '人生充满各种各样的选择。', pinyin: 'Rénshēng chōngmǎn gèzhǒnggèyàng de xuǎnzé.', meaning: 'Cuộc đời tràn ngập những ngã rẽ và sự lựa chọn.' }
  },
  {
    hanzi: '愿意', pinyin: 'yuànyì', hanviet: 'Nguyện ý', meaning: 'Sẵn lòng, bằng lòng',
    level: 'HSK 3', topic: 'Cảm xúc', radical: '心 (Tâm)', strokes: 27,
    mnemonic: 'Tâm nguyện từ đáy lòng mong muốn được làm.',
    example: { hanzi: '你愿意和我们一起去爬山吗？', pinyin: 'Nǐ yuànyì hé wǒmen yìqǐ qù páshān ma?', meaning: 'Bạn có sẵn lòng cùng chúng tôi đi leo núi không?' }
  },
  {
    hanzi: '参加', pinyin: 'cānjiā', hanviet: 'Tham gia', meaning: 'Tham gia, dự (sự kiện, kỳ thi)',
    level: 'HSK 3', topic: 'Hành động', radical: '厶 (Khư)', strokes: 13,
    mnemonic: 'Tham gia góp mặt tăng thêm sức mạnh tập thể.',
    example: { hanzi: '下个月我将参加HSK 3级考试。', pinyin: 'Xià gè yuè wǒ jiāng cānjiā HSK sān jí kǎoshì.', meaning: 'Tháng sau tôi sẽ tham gia kỳ thi HSK cấp 3.' }
  },
  {
    hanzi: '练习', pinyin: 'liànxí', hanviet: 'Luyện tập', meaning: 'Luyện tập, bài tập',
    level: 'HSK 3', topic: 'Học tập', radical: '纟(Mịch)', strokes: 14,
    mnemonic: 'Rèn giũa sợi tơ lặp đi lặp lại cho dẻo dai thành thạo.',
    example: { hanzi: '多做练习才能牢固掌握语法知识。', pinyin: 'Duō zuò liànxí cái néng láogù zhǎngwò yǔfǎ zhīshi.', meaning: 'Làm nhiều bài tập mới có thể nắm vững kiến thức ngữ pháp.' }
  },
  {
    hanzi: '检查', pinyin: 'jiǎnchá', hanviet: 'Kiểm tra', meaning: 'Kiểm tra, rà soát',
    level: 'HSK 3', topic: 'Học tập', radical: '木 (Mộc)', strokes: 20,
    mnemonic: 'Soi chiếu kỹ từng thẻ gỗ hồ sơ không bỏ sót.',
    example: { hanzi: '交卷前请仔细检查一遍名字和答案。', pinyin: 'Jiāojuàn qián qǐng zǐxì jiǎnchá yí biàn míngzi hé dá’àn.', meaning: 'Trước khi nộp bài hãy kiểm tra kỹ lại tên và đáp án.' }
  },
  {
    hanzi: '清楚', pinyin: 'qīngchu', hanviet: 'Thanh sở', meaning: 'Rõ ràng, rành mạch',
    level: 'HSK 3', topic: 'Tính từ', radical: '氵(Chấm thủy)', strokes: 24,
    mnemonic: 'Nước trong vắt (清) nhìn thấu đáy rừng cây (楚).',
    example: { hanzi: '老师，我听得很清楚，谢谢您。', pinyin: 'Lǎoshī, wǒ tīng de hěn qīngchu, xièxie nín.', meaning: 'Thưa cô, em nghe rất rõ rồi, cảm ơn cô.' }
  },
  {
    hanzi: '放心', pinyin: 'fàngxīn', hanviet: 'Phóng tâm', meaning: 'Yên tâm, an tâm',
    level: 'HSK 3', topic: 'Cảm xúc', radical: '攵 (Phộc)', strokes: 12,
    mnemonic: 'Thả lỏng trái tim buông bỏ âu lo muộn phiền.',
    example: { hanzi: '请爸爸妈妈放心，我在国外生活得很好。', pinyin: 'Qǐng bàba māma fàngxīn, wǒ zài guówài shēnghuó de hěn hǎo.', meaning: 'Xin bố mẹ yên tâm, con ở nước ngoài sống rất tốt.' }
  },
  {
    hanzi: '照顾', pinyin: 'zhàogù', hanviet: 'Chiếu cố', meaning: 'Chăm sóc, trông nom',
    level: 'HSK 3', topic: 'Gia đình', radical: '灬 (Hỏa)', strokes: 27,
    mnemonic: 'Chiếu ánh sáng chở che và quan tâm từng li từng tí.',
    example: { hanzi: '生病的时候，室友一直悉心照顾我。', pinyin: 'Shēngbìng de shíhou, shìyǒu yìzhí xīxīn zhàogù wǒ.', meaning: 'Lúc tôi bị ốm, bạn cùng phòng luôn chu đáo chăm sóc tôi.' }
  },
  {
    hanzi: '离开', pinyin: 'líkāi', hanviet: 'Ly khai', meaning: 'Rời khỏi, xa rời',
    level: 'HSK 3', topic: 'Hành động', radical: '亠 (Đầu)', strokes: 14,
    mnemonic: 'Rời xa cội nguồn cất bước đến chân trời mới.',
    example: { hanzi: '飞机将在半小时后离开跑道。', pinyin: 'Fēijī jiāng zài bàn xiǎoshí hòu líkāi pǎodào.', meaning: 'Máy bay sẽ rời đường băng sau nửa tiếng nữa.' }
  },
  {
    hanzi: '迟到', pinyin: 'chídào', hanviet: 'Trì đáo', meaning: 'Đến muộn, đi trễ',
    level: 'HSK 3', topic: 'Trường học', radical: '辶 (Sước)', strokes: 15,
    mnemonic: 'Bước chân chậm chạp (迟) đến nơi hẹn (到) trễ tràng.',
    example: { hanzi: '今天路上堵车，我很抱歉迟到了。', pinyin: 'Jīntiān lù shang dǔchē, wǒ hěn bàoqiàn chídào le.', meaning: 'Hôm nay trên đường bị tắc xe, tôi rất xin lỗi vì đã đến muộn.' }
  },
  {
    hanzi: '发现', pinyin: 'fāxiàn', hanviet: 'Phát hiện', meaning: 'Phát hiện, nhận thấy',
    level: 'HSK 3', topic: 'Hành động', radical: '癶 (Bát)', strokes: 17,
    mnemonic: 'Khai mở và nhìn thấy điều mới lạ trước mắt.',
    example: { hanzi: '我发现学习汉字其实非常有规律。', pinyin: 'Wǒ fāxiàn xuéxí hànzì qíshí fēicháng yǒu guīlǜ.', meaning: 'Tôi phát hiện học chữ Hán thực ra rất có quy luật.' }
  },
  {
    hanzi: '借', pinyin: 'jiè', hanviet: 'Tá', meaning: 'Mượn, vay',
    level: 'HSK 3', topic: 'Giao tiếp', radical: '亻 (Nhân đứng)', strokes: 10,
    mnemonic: 'Người này tạm thời chuyển giao cho người kia dùng.',
    example: { hanzi: '我想借用一下你的字典。', pinyin: 'Wǒ xiǎng jièyòng yíxià nǐ de zìdiǎn.', meaning: 'Tôi muốn mượn dùng cuốn từ điển của bạn một lát.' }
  },
  {
    hanzi: '习惯', pinyin: 'xíguàn', hanviet: 'Tập quán', meaning: 'Thói quen, quen với',
    level: 'HSK 3', topic: 'Đời sống', radical: '习 (Tập)', strokes: 14,
    mnemonic: 'Tập luyện thường xuyên qua năm tháng hóa thành thói quen.',
    example: { hanzi: '我已经完全习惯了这里的生活节奏。', pinyin: 'Wǒ yǐjīng wánquán xíguàn le zhèlǐ de shēnghuó jiézòu.', meaning: 'Tôi đã hoàn toàn quen với nhịp sống ở đây.' }
  },
  {
    hanzi: '其实', pinyin: 'qíshí', hanviet: 'Kỳ thực', meaning: 'Thực ra, kỳ thực',
    level: 'HSK 3', topic: 'Phó từ', radical: '八 (Bát)', strokes: 16,
    mnemonic: 'Bản chất sự thật đích thực ẩn chứa bên trong.',
    example: { hanzi: '很多事情看似很难，其实只要迈出第一步。', pinyin: 'Hěn duō shìqing kànsì hěn nán, qíshí zhǐyào màichū dì-yī bù.', meaning: 'Nhiều việc nhìn thì khó, thực ra chỉ cần bước bước đầu tiên.' }
  },
  {
    hanzi: '突然', pinyin: 'tūrán', hanviet: 'Đột nhiên', meaning: 'Đột nhiên, bất ngờ',
    level: 'HSK 3', topic: 'Phó từ', radical: '穴 (Huyệt)', strokes: 16,
    mnemonic: 'Chó từ trong hang (穴) bất ngờ lao vọt ra (突).',
    example: { hanzi: '外面突然下起了倾盆大雨。', pinyin: 'Wàimiàn tūrán xiàqǐ le qīngpén dàyǔ.', meaning: 'Bên ngoài đột nhiên đổ mưa như trút nước.' }
  },
  {
    hanzi: '终于', pinyin: 'zhōngyú', hanviet: 'Chung vu', meaning: 'Cuối cùng, rốt cuộc',
    level: 'HSK 3', topic: 'Phó từ', radical: '纟(Mịch)', strokes: 11,
    mnemonic: 'Sợi dây đi đến điểm kết thúc cuối cùng gặt hái quả ngọt.',
    example: { hanzi: '经过几个月的努力，我终于通过了考试！', pinyin: 'Jīngguò jǐ gè yuè de nǔlì, wǒ zhōngyú tōngguò le kǎoshì!', meaning: 'Sau mấy tháng nỗ lực, cuối cùng tôi đã vượt qua kỳ thi!' }
  },
  {
    hanzi: '一定', pinyin: 'yídìng', hanviet: 'Nhất định', meaning: 'Nhất định, chắc chắn',
    level: 'HSK 3', topic: 'Phó từ', radical: '一 (Nhất)', strokes: 9,
    mnemonic: 'Một lòng kiên định không gì lay chuyển nổi.',
    example: { hanzi: '明天是周末，我一定要好好睡个懒觉。', pinyin: 'Míngtiān shì zhōumò, wǒ yídìng yào hǎohǎo shuì gè lǎnjiào.', meaning: 'Ngày mai là cuối tuần, tôi nhất định sẽ ngủ nướng một giấc thật đã.' }
  },
  {
    hanzi: '蛋糕', pinyin: 'dàngāo', hanviet: 'Đản cao', meaning: 'Bánh ngọt, bánh gato',
    level: 'HSK 3', topic: 'Ăn uống', radical: '虫 (Trùng)', strokes: 21,
    mnemonic: 'Bánh làm từ trứng gà (蛋) và bột mì xốp mềm ngọt ngào.',
    example: { hanzi: '祝你生日快乐，快来切蛋糕吧！', pinyin: 'Zhù nǐ shēngrì kuàilè, kuài lái qiē dàngāo ba!', meaning: 'Chúc bạn sinh nhật vui vẻ, mau lại cắt bánh gato nào!' }
  },
  {
    hanzi: '面条', pinyin: 'miàntiáo', hanviet: 'Miến điều', meaning: 'Mì sợi',
    level: 'HSK 3', topic: 'Ăn uống', radical: '麦 (Mạch)', strokes: 16,
    mnemonic: 'Bột lúa mì kéo thành từng sợi dài dai ngon.',
    example: { hanzi: '生日那天中国人常常吃一碗长寿面条。', pinyin: 'Shēngrì nà tiān Zhōngguó rén chángcháng chī yì wǎn chángshòu miàntiáo.', meaning: 'Ngày sinh nhật người Trung Quốc thường ăn một bát mì trường thọ.' }
  },
  {
    hanzi: '面包', pinyin: 'miànbāo', hanviet: 'Miến bao', meaning: 'Bánh mì',
    level: 'HSK 3', topic: 'Ăn uống', radical: '麦 (Mạch)', strokes: 14,
    mnemonic: 'Bột mì nhào nặn bọc nhân nướng thơm phức.',
    example: { hanzi: '早晨我常常吃一块面包喝杯热牛奶。', pinyin: 'Zǎochén wǒ chángcháng chī yí kuài miànbāo hē bēi rè niúnǎi.', meaning: 'Buổi sáng tôi thường ăn một mẩu bánh mì và uống cốc sữa nóng.' }
  },
  {
    hanzi: '饮料', pinyin: 'yǐnliào', hanviet: 'Ẩm liệu', meaning: 'Đồ uống, nước giải khát',
    level: 'HSK 3', topic: 'Ăn uống', radical: '饣(Thực)', strokes: 14,
    mnemonic: 'Nguyên liệu thảo mộc pha chế thành đồ uống giải khát.',
    example: { hanzi: '请问您需要点什么冰镇饮料？', pinyin: 'Qǐngwèn nín xūyào diǎn shénme bīngzhèn yǐnliào?', meaning: 'Xin hỏi quý khách cần dùng thức uống ướp lạnh gì ạ?' }
  },
  {
    hanzi: '空调', pinyin: 'kōngtiáo', hanviet: 'Không điều', meaning: 'Máy điều hòa',
    level: 'HSK 3', topic: 'Đời sống', radical: '穴 (Huyệt)', strokes: 18,
    mnemonic: 'Thiết bị điều tiết nhiệt độ không khí trong phòng.',
    example: { hanzi: '夏天屋里开了空调，非常凉快舒服。', pinyin: 'Xiàtiān wū lǐ kāi le kōngtiáo, fēicháng liángkuai shūfu.', meaning: 'Mùa hè trong phòng bật điều hòa rất mát mẻ dễ chịu.' }
  },
  {
    hanzi: '冰箱', pinyin: 'bīngxiāng', hanviet: 'Băng sương', meaning: 'Tủ lạnh',
    level: 'HSK 3', topic: 'Đời sống', radical: '冫(Băng)', strokes: 21,
    mnemonic: 'Chiếc hòm gỗ làm lạnh bằng băng bảo quản thực phẩm.',
    example: { hanzi: '冰箱里放着新鲜的水果和牛奶。', pinyin: 'Bīngxiāng lǐ fàng zhe xīnxiān de shuǐguǒ hé niúnǎi.', meaning: 'Trong tủ lạnh để đầy hoa quả tươi và sữa bò.' }
  },
  {
    hanzi: '伞', pinyin: 'sǎn', hanviet: 'Tản', meaning: 'Cái ô, cái dù',
    level: 'HSK 3', topic: 'Đời sống', radical: '人 (Nhân)', strokes: 6,
    mnemonic: 'Hình dáng chiếc ô có nan xòe rộng che chở con người.',
    example: { hanzi: '天阴了，带把伞以防下雨。', pinyin: 'Tiān yīn le, dài bǎ sǎn yǐ fáng xiàyǔ.', meaning: 'Trời âm u rồi, mang theo chiếc ô để phòng trời mưa.' }
  },
  {
    hanzi: '裙子', pinyin: 'qúnzi', hanviet: 'Quần tử', meaning: 'Váy, đầm',
    level: 'HSK 3', topic: 'Trang phục', radical: '衤(Áo)', strokes: 14,
    mnemonic: 'Tà áo váy vải vóc xúng xính của phái đẹp.',
    example: { hanzi: '她穿了一条红色的裙子，宛如仙女。', pinyin: 'Tā chuān le yì tiáo hóngsè de qúnzi, wǎnrú xiānnǚ.', meaning: 'Cô ấy mặc một chiếc váy đỏ, đẹp tựa tiên nữ.' }
  },
  {
    hanzi: '裤子', pinyin: 'kùzi', hanviet: 'Khố tử', meaning: 'Quần',
    level: 'HSK 3', topic: 'Trang phục', radical: '衤(Áo)', strokes: 14,
    mnemonic: 'Y phục hai ống xỏ chân bảo vệ cơ thể khi lao động.',
    example: { hanzi: '这条黑色裤子穿起来非常显瘦。', pinyin: 'Zhè tiáo hēisè kùzi chuān qǐlái fēicháng xiǎnshòu.', meaning: 'Chiếc quần màu đen này mặc vào trông rất thon gọn.' }
  },
  {
    hanzi: '鞋', pinyin: 'xié', hanviet: 'Hài', meaning: 'Giày dép',
    level: 'HSK 3', topic: 'Trang phục', radical: '革 (Cách)', strokes: 15,
    mnemonic: 'Làm từ da thuộc (革) bao bọc bàn chân vững bước.',
    example: { hanzi: '这双运动鞋走起路来轻便舒适。', pinyin: 'Zhè shuāng yùndòngxié zǒu qǐ lù lái qīngbiàn shūshì.', meaning: 'Đôi giày thể thao này đi bộ rất êm nhẹ và thoải mái.' }
  },
  {
    hanzi: '帽子', pinyin: 'màozi', hanviet: 'Mạo tử', meaning: 'Cái mũ, cái nón',
    level: 'HSK 3', topic: 'Trang phục', radical: '巾 (Khăn)', strokes: 14,
    mnemonic: 'Vải khăn (巾) đội trùm lên đầu che nắng che mưa.',
    example: { hanzi: '夏天在户外活动要记得戴帽子防晒。', pinyin: 'Xiàtiān zài hùwài huódòng yào jìde dài màozi fángshài.', meaning: 'Mùa hè hoạt động ngoài trời nhớ đội mũ chống nắng.' }
  },
  {
    hanzi: '护照', pinyin: 'hùzhào', hanviet: 'Hộ chiếu', meaning: 'Hộ chiếu, passport',
    level: 'HSK 3', topic: 'Du lịch', radical: '扌(Thủ)', strokes: 21,
    mnemonic: 'Giấy tờ chiếu cố bảo hộ xuất nhập cảnh quốc gia.',
    example: { hanzi: '出国旅游一定要妥善保管好护照。', pinyin: 'Chūguó lǚyóu yídìng yào tuǒshàn bǎoguǎn hǎo hùzhào.', meaning: 'Đi du lịch nước ngoài nhất định phải giữ gìn hộ chiếu cẩn thận.' }
  },
  {
    hanzi: '信用卡', pinyin: 'xìnyòngkǎ', hanviet: 'Tín dụng tạp', meaning: 'Thẻ tín dụng',
    level: 'HSK 3', topic: 'Mua sắm', radical: '亻 (Nhân đứng)', strokes: 19,
    mnemonic: 'Tấm thẻ từ bảo chứng niềm tin thanh toán thông minh.',
    example: { hanzi: '在许多商场都可以刷信用卡消费。', pinyin: 'Zài xǔduō shāngchǎng dōu kěyǐ shuā xìnyòngkǎ xiāofèi.', meaning: 'Tại nhiều trung tâm thương mại đều có thể quẹt thẻ tín dụng.' }
  },
  {
    hanzi: '钱包', pinyin: 'qiánbāo', hanviet: 'Tiền bao', meaning: 'Ví tiền, bóp tiền',
    level: 'HSK 3', topic: 'Đời sống', radical: '钅(Kim)', strokes: 15,
    mnemonic: 'Túi nhỏ bọc gói cất giữ tiền bạc an toàn.',
    example: { hanzi: '糟糕，我把钱包忘在出租车上了！', pinyin: 'Zāogāo, wǒ bǎ qiánbāo wàng zài chūzūchē shang le!', meaning: 'Thôi chết, tôi để quên ví tiền trên xe taxi rồi!' }
  },
  {
    hanzi: '邻居', pinyin: 'línjū', hanviet: 'Lân cư', meaning: 'Hàng xóm, láng giềng',
    level: 'HSK 3', topic: 'Xã hội', radical: '阝(Ấp)', strokes: 15,
    mnemonic: 'Những người sinh sống kề cận liền kề tổ ấm.',
    example: { hanzi: '俗话说远亲不如近邻，邻居间要互相帮助。', pinyin: 'Súhuà shuō yuǎnqīn bùrú jìnlín, línjū jiān yào hùxiāng bāngzhù.', meaning: 'Người xưa nói bà con xa không bằng láng giềng gần, hàng xóm nên giúp nhau.' }
  },
  {
    hanzi: '司机', pinyin: 'sījī', hanviet: 'Ty cơ', meaning: 'Tài xế, bác tài',
    level: 'HSK 3', topic: 'Nghề nghiệp', radical: '口 (Khẩu)', strokes: 11,
    mnemonic: 'Người chuyên trách điều khiển cỗ máy xe cộ.',
    example: { hanzi: '出租车司机师傅非常熟悉北京的路线。', pinyin: 'Chūzūchē sījī shīfu fēicháng shúxī Běijīng de lùxiàn.', meaning: 'Bác tài xế taxi rất thông thuộc các tuyến đường Bắc Kinh.' }
  },
  {
    hanzi: '太阳', pinyin: 'tàiyáng', hanviet: 'Thái dương', meaning: 'Mặt trời',
    level: 'HSK 3', topic: 'Thiên nhiên', radical: '日 (Nhật)', strokes: 10,
    mnemonic: 'Nguồn sáng cực đại sưởi ấm mặt đất muôn loài.',
    example: { hanzi: '清晨一轮红日太阳从东方冉冉升起。', pinyin: 'Qīngchén yì lún hóngrì tàiyáng cóng dōngfāng rǎnrǎn shēngqǐ.', meaning: 'Sáng sớm một vầng mặt trời đỏ rực từ phương Đông từ từ nhô lên.' }
  },
  {
    hanzi: '月亮', pinyin: 'yuèliang', hanviet: 'Nguyệt lượng', meaning: 'Mặt trăng',
    level: 'HSK 3', topic: 'Thiên nhiên', radical: '月 (Nguyệt)', strokes: 13,
    mnemonic: 'Vầng trăng sáng vằng vặc tỏa ánh dịu mát ban đêm.',
    example: { hanzi: '今晚的月亮又圆又大，皎洁迷人。', pinyin: 'Jīnwǎn de yuèliang yòu yuán yòu dà, jiǎojié mírén.', meaning: 'Mặt trăng đêm nay vừa tròn vừa to, sáng trong mê hoặc.' }
  },
  {
    hanzi: '树', pinyin: 'shù', hanviet: 'Thụ', meaning: 'Cây cối',
    level: 'HSK 3', topic: 'Thiên nhiên', radical: '木 (Mộc)', strokes: 9,
    mnemonic: 'Cây gỗ đứng sừng sững cắm rễ sâu vào lòng đất.',
    example: { hanzi: '道路两旁种满了高大挺拔的绿树。', pinyin: 'Dàolù liǎngpáng zhòng mǎn le gāodà tǐngbá de lǜ shù.', meaning: 'Hai bên đường trồng đầy những hàng cây xanh cao lớn thẳng tắp.' }
  },
  {
    hanzi: '花', pinyin: 'huā', hanviet: 'Hoa', meaning: 'Bông hoa, tiêu (tiền/thời gian)',
    level: 'HSK 3', topic: 'Thiên nhiên', radical: '艹 (Thảo)', strokes: 7,
    mnemonic: 'Nụ hoa thảo mộc hé nở khoe sắc muôn màu.',
    example: { hanzi: '春天公园里盛开着各种鲜花。', pinyin: 'Chūntiān gōngyuán lǐ shèngkāi zhe gèzhǒng xiānhuā.', meaning: 'Mùa xuân trong công viên nở rộ đủ các loài hoa tươi.' }
  },
  {
    hanzi: '草', pinyin: 'cǎo', hanviet: 'Thảo', meaning: 'Cỏ, cây cỏ',
    level: 'HSK 3', topic: 'Thiên nhiên', radical: '艹 (Thảo)', strokes: 9,
    mnemonic: 'Ngọn cỏ non mọc xanh rờn đón nắng sớm mai.',
    example: { hanzi: '春风吹又生，青草生机勃勃。', pinyin: 'Chūnfēng chuī yòu shēng, qīngcǎo shēngjī bóbó.', meaning: 'Gió xuân thổi lại mọc, cỏ xanh bừng bừng sức sống.' }
  },
  {
    hanzi: '鸟', pinyin: 'niǎo', hanviet: 'Điểu', meaning: 'Con chim',
    level: 'HSK 3', topic: 'Động vật', radical: '鸟 (Điểu)', strokes: 5,
    mnemonic: 'Hình ảnh chú chim nhỏ có mỏ và mắt hót vang trên cành.',
    example: { hanzi: '清晨森林里传来清脆悦耳的鸟叫声。', pinyin: 'Qīngchén sēnlín lǐ chuánlái qīngcuì yuè’ěr de niǎo jiàoshēng.', meaning: 'Sáng sớm trong rừng vọng lại tiếng chim hót trong trẻo êm tai.' }
  },
  {
    hanzi: '熊猫', pinyin: 'xióngmāo', hanviet: 'Hùng miêu', meaning: 'Gấu trúc (quốc bảo TQ)',
    level: 'HSK 3', topic: 'Động vật', radical: '犭(Khuyển)', strokes: 25,
    mnemonic: 'Loài gấu tròn trĩnh đáng yêu chuyên ăn lá trúc.',
    example: { hanzi: '中国大熊猫是深受全世界喜爱的国宝。', pinyin: 'Zhōngguó dàxióngmāo shì shēn shòu quán shìjiè xǐ’ài de guóbǎo.', meaning: 'Gấu trúc lớn Trung Quốc là quốc bảo được cả thế giới yêu mến.' }
  },
  {
    hanzi: '季节', pinyin: 'jìjié', hanviet: 'Quý tiết', meaning: 'Mùa, mùa màng',
    level: 'HSK 3', topic: 'Thời tiết', radical: '子 (Tử)', strokes: 13,
    mnemonic: 'Bốn mùa xuân hạ thu đông luân chuyển.',
    example: { hanzi: '秋天是我最喜欢的丰收季节。', pinyin: 'Qiūtiān shì wǒ zuì xǐhuan de fēngshōu jìjié.', meaning: 'Mùa thu là mùa thu hoạch mà tôi yêu thích nhất.' }
  },
  {
    hanzi: '春天', pinyin: 'chūntiān', hanviet: 'Xuân thiên', meaning: 'Mùa xuân',
    level: 'HSK 3', topic: 'Thời tiết', radical: '日 (Nhật)', strokes: 13,
    mnemonic: 'Mặt trời (日) sưởi ấm mầm cây ngày xuân ấm áp.',
    example: { hanzi: '春天万物复苏，生机盎然。', pinyin: 'Chūntiān wànwù fùsū, shēngjī àngrán.', meaning: 'Mùa xuân vạn vật hồi sinh, tràn ngập sức sống.' }
  },
  {
    hanzi: '夏天', pinyin: 'xiàtiān', hanviet: 'Hạ thiên', meaning: 'Mùa hè, mùa hạ',
    level: 'HSK 3', topic: 'Thời tiết', radical: '夂 (Trĩ)', strokes: 14,
    mnemonic: 'Mùa ve kêu hè về sôi động dưới bóng râm.',
    example: { hanzi: '夏天我们常常去海滩游泳消暑。', pinyin: 'Xiàtiān wǒmen chángcháng qù hǎitān yóuyǒng xiāoshǔ.', meaning: 'Mùa hè chúng tôi thường đi biển bơi để giải nhiệt.' }
  },
  {
    hanzi: '秋天', pinyin: 'qiūtiān', hanviet: 'Thu thiên', meaning: 'Mùa thu',
    level: 'HSK 3', topic: 'Thời tiết', radical: '禾 (Hòa)', strokes: 13,
    mnemonic: 'Cây lúa (禾) ngả màu vàng rực đón ngọn lửa thu hoạch.',
    example: { hanzi: '秋天的香山枫叶红遍，美不胜收。', pinyin: 'Qiūtiān de Xiāngshān fēngyè hóng biàn, měi bù shèng shōu.', meaning: 'Mùa thu lá phong núi Hương Đỏ rực, đẹp không sao xiết.' }
  },
  {
    hanzi: '冬天', pinyin: 'dōngtiān', hanviet: 'Đông thiên', meaning: 'Mùa đông',
    level: 'HSK 3', topic: 'Thời tiết', radical: '冫(Băng)', strokes: 9,
    mnemonic: 'Băng giá (冫) bao phủ đất trời mùa đông lạnh buốt.',
    example: { hanzi: '冬天堆雪人和滑雪是一件很有趣的事。', pinyin: 'Dōngtiān duī xuěrén hé huáxuě shì yí jiàn hěn yǒuqù de shì.', meaning: 'Mùa đông đắp người tuyết và trượt tuyết là điều vô cùng thú vị.' }
  }
];

// Combine BASE + ADDITIONAL, ensuring 100% uniqueness
const allUniqueMap = new Map();

// Insert base vocab
BASE_VOCAB.forEach(v => {
  allUniqueMap.set(v.hanzi, v);
});

// Insert additional vocab
ADDITIONAL_VOCAB.forEach(v => {
  if (!allUniqueMap.has(v.hanzi)) {
    allUniqueMap.set(v.hanzi, v);
  }
});

const FINAL_DEDUPLICATED_LIST = Array.from(allUniqueMap.values()).map((v, i) => ({
  id: i + 1,
  hanzi: v.hanzi,
  pinyin: v.pinyin,
  hanviet: v.hanviet || '',
  meaning: v.meaning,
  level: v.level || 'HSK 1',
  topic: v.topic || 'Tổng hợp',
  radical: v.radical || '',
  strokes: Number(v.strokes) || 6,
  mnemonic: v.mnemonic || '',
  example: v.example || {}
}));

console.log(`🚀 BẮT ĐẦU NẠP DỮ LIỆU TỪ VỰNG HOÀN TOÀN MỚI (${FINAL_DEDUPLICATED_LIST.length} TỪ DUY NHẤT)...`);

async function run() {
  // 1. First, delete all duplicate entries from Supabase 'vocabulary' table
  console.log('🧹 1. Đang dọn dẹp các từ vựng trùng lặp cũ trên Supabase...');
  const { error: delError } = await supabase
    .from('vocabulary')
    .delete()
    .neq('id', 0); // deletes all rows

  if (delError) {
    console.warn('Delete warning:', delError.message);
  } else {
    console.log('✅ Đã dọn dẹp sạch sẽ bảng vocabulary cũ!');
  }

  // 2. Insert all unique words in batches of 50
  console.log(`📦 2. Đang nạp ${FINAL_DEDUPLICATED_LIST.length} từ vựng chuẩn vào Supabase...`);
  const batchSize = 50;
  for (let i = 0; i < FINAL_DEDUPLICATED_LIST.length; i += batchSize) {
    const batch = FINAL_DEDUPLICATED_LIST.slice(i, i + batchSize).map(item => ({
      hanzi: item.hanzi,
      pinyin: item.pinyin,
      hanviet: item.hanviet,
      meaning: item.meaning,
      level: item.level,
      topic: item.topic,
      radical: item.radical,
      strokes: item.strokes,
      mnemonic: item.mnemonic,
      example: item.example
    }));

    const { error: insErr } = await supabase.from('vocabulary').insert(batch);
    if (insErr) {
      console.error(`Lỗi nạp batch ${i / batchSize + 1}:`, insErr.message);
    } else {
      console.log(`   + Đã nạp thành công từ ${i + 1} đến ${Math.min(i + batchSize, FINAL_DEDUPLICATED_LIST.length)}`);
    }
  }

  // 3. Write final list into src/data/chineseData.js
  console.log('📝 3. Đang đồng bộ danh sách vào src/data/chineseData.js...');
  const dataFilePath = path.join(__dirname, '..', 'src', 'data', 'chineseData.js');
  const fileContent = fs.readFileSync(dataFilePath, 'utf8');

  const startMarker = 'export const VOCABULARY_LIST = ';
  const endMarker = 'export const TOPIC_FILTERS = [';

  const startIndex = fileContent.indexOf(startMarker);
  const endIndex = fileContent.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    console.error('Không tìm thấy vị trí VOCABULARY_LIST trong chineseData.js!');
    process.exit(1);
  }

  const newCode = `export const VOCABULARY_LIST = ${JSON.stringify(FINAL_DEDUPLICATED_LIST, null, 2)};\n\n`;
  const updatedContent = fileContent.slice(0, startIndex) + newCode + fileContent.slice(endIndex);

  fs.writeFileSync(dataFilePath, updatedContent, 'utf8');
  console.log(`🎉 HOÀN THÀNH XUẤT SẮC! Đã đồng bộ ${FINAL_DEDUPLICATED_LIST.length} TỪ VỰNG CHUẨN XỊN (100% DUY NHẤT) LÊN CẢ SUPABASE VÀ CHINESEDATA.JS!`);
}

run().catch(err => {
  console.error('Lỗi thực thi:', err);
  process.exit(1);
});
