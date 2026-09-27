import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://woszblniatdvijwdkmpm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvc3pibG5pYXRkdmlqd2RrbXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NzEwMTcsImV4cCI6MjEwNjA0NzAxN30.qpSGtdIgGG55MXsLJGbMS3KOLz6W_ZsC16r-6XixMXY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const FULL_VOCABULARY_DATA = [
  // === HSK 1: ĐẠI TỪ & NGHI VẤN (PRONOUNS) ===
  {
    hanzi: '我', pinyin: 'wǒ', hanviet: 'Ngã', meaning: 'Tôi, mình, ta',
    level: 'HSK 1', topic: 'Đại từ', radical: '戈 (Qua)', strokes: 7,
    mnemonic: 'Tay (手) cầm vũ khí (戈) tự vệ khẳng định cái tôi (我).',
    example: { hanzi: '我是越南人。', pinyin: 'Wǒ shì Yuènán rén.', meaning: 'Tôi là người Việt Nam.' }
  },
  {
    hanzi: '你', pinyin: 'nǐ', hanviet: 'Nhĩ', meaning: 'Bạn, anh, chị (ngôi thứ 2)',
    level: 'HSK 1', topic: 'Đại từ', radical: '亻 (Nhân đứng)', strokes: 7,
    mnemonic: 'Người (亻) đối diện trò chuyện cùng ngươi (尔).',
    example: { hanzi: '你好！很高兴认识你。', pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.', meaning: 'Xin chào! Rất vui được quen biết bạn.' }
  },
  {
    hanzi: '他', pinyin: 'tā', hanviet: 'Tha', meaning: 'Anh ấy, cậu ấy, ông ấy',
    level: 'HSK 1', topic: 'Đại từ', radical: '亻 (Nhân đứng)', strokes: 5,
    mnemonic: 'Người (亻) đứng bên cạnh chữ Dã (也 - cũng).',
    example: { hanzi: '他是我的大学同学。', pinyin: 'Tā shì wǒ de dàxué tóngxué.', meaning: 'Anh ấy là bạn học đại học của tôi.' }
  },
  {
    hanzi: '她', pinyin: 'tā', hanviet: 'Tha', meaning: 'Cô ấy, bà ấy, chị ấy',
    level: 'HSK 1', topic: 'Đại từ', radical: '女 (Nữ)', strokes: 6,
    mnemonic: 'Người phụ nữ (女) duyên dáng bên cạnh (也).',
    example: { hanzi: '她也是一名优秀的老师。', pinyin: 'Tā yě shì yì míng yōuxiù de lǎoshī.', meaning: 'Cô ấy cũng là một giáo viên xuất sắc.' }
  },
  {
    hanzi: '我们', pinyin: 'wǒmen', hanviet: 'Ngã môn', meaning: 'Chúng tôi, chúng ta',
    level: 'HSK 1', topic: 'Đại từ', radical: '亻 (Nhân đứng)', strokes: 12,
    mnemonic: 'Nhiều người đứng cạnh cổng (门) tạo thành số nhiều.',
    example: { hanzi: '我们一起去图书馆吧。', pinyin: 'Wǒmen yìqǐ qù túshūguǎn ba.', meaning: 'Chúng ta cùng đi thư viện nhé.' }
  },
  {
    hanzi: '这', pinyin: 'zhè', hanviet: 'Giá', meaning: 'Đây, này',
    level: 'HSK 1', topic: 'Đại từ', radical: '辶 (Sước)', strokes: 7,
    mnemonic: 'Chữ Văn (文) kết hợp bộ quai sước (辶) chỉ vật ở gần bước chân.',
    example: { hanzi: '这是什么书？', pinyin: 'Zhè shì shénme shū?', meaning: 'Đây là sách gì?' }
  },
  {
    hanzi: '那', pinyin: 'nà', hanviet: 'Na', meaning: 'Kia, đó',
    level: 'HSK 1', topic: 'Đại từ', radical: '阝(Ấp)', strokes: 6,
    mnemonic: 'Chỉ về phía vùng đất (阝) xa xôi đằng kia.',
    example: { hanzi: '那是我的汉语老师。', pinyin: 'Nà shì wǒ de Hànyǔ lǎoshī.', meaning: 'Kia là cô giáo tiếng Trung của tôi.' }
  },
  {
    hanzi: '哪', pinyin: 'nǎ', hanviet: 'Nả', meaning: 'Nào, đâu',
    level: 'HSK 1', topic: 'Nghi vấn', radical: '口 (Khẩu)', strokes: 9,
    mnemonic: 'Mở miệng (口) hỏi xem người đó ở đâu (那).',
    example: { hanzi: '你是哪国人？', pinyin: 'Nǐ shì nǎ guó rén?', meaning: 'Bạn là người nước nào?' }
  },
  {
    hanzi: '谁', pinyin: 'shéi', hanviet: 'Thùy', meaning: 'Ai',
    level: 'HSK 1', topic: 'Nghi vấn', radical: '讠(Ngôn)', strokes: 10,
    mnemonic: 'Dùng lời nói (讠) cất tiếng hỏi con chim nhỏ (隹) là ai.',
    example: { hanzi: '他是谁？', pinyin: 'Tā shì shéi?', meaning: 'Anh ấy là ai?' }
  },
  {
    hanzi: '什么', pinyin: 'shénme', hanviet: 'Thập ma', meaning: 'Cái gì',
    level: 'HSK 1', topic: 'Nghi vấn', radical: '亻 (Nhân đứng)', strokes: 7,
    mnemonic: 'Người (亻) thắc mắc chuyện gì đang diễn ra.',
    example: { hanzi: '你在看什么？', pinyin: 'Nǐ zài kàn shénme?', meaning: 'Bạn đang xem cái gì vậy?' }
  },
  {
    hanzi: '几', pinyin: 'jǐ', hanviet: 'Kỷ', meaning: 'Mấy, vài (dưới 10)',
    level: 'HSK 1', topic: 'Nghi vấn', radical: '几 (Kỷ)', strokes: 2,
    mnemonic: 'Hình chiếc bàn nhỏ đếm được vài ba đồ vật.',
    example: { hanzi: '你有几个中国朋友？', pinyin: 'Nǐ yǒu jǐ gè Zhōngguó péngyou?', meaning: 'Bạn có mấy người bạn Trung Quốc?' }
  },
  {
    hanzi: '怎么', pinyin: 'zěnme', hanviet: 'Chẩm ma', meaning: 'Như thế nào, sao lại',
    level: 'HSK 1', topic: 'Nghi vấn', radical: '心 (Tâm)', strokes: 12,
    mnemonic: 'Trái tim (心) băn khoăn suy nghĩ cách giải quyết.',
    example: { hanzi: '去火车站怎么走？', pinyin: 'Qù huǒchēzhàn zěnme zǒu?', meaning: 'Đi ga xe lửa thì đi thế nào?' }
  },
  {
    hanzi: '怎么样', pinyin: 'zěnmeyàng', hanviet: 'Chẩm ma dạng', meaning: 'Thế nào, ra sao',
    level: 'HSK 1', topic: 'Nghi vấn', radical: '木 (Mộc)', strokes: 21,
    mnemonic: 'Hỏi thăm hình dáng (样) và cảm nhận của đối phương.',
    example: { hanzi: '今天天气怎么样？', pinyin: 'Jīntiān tiānqì zěnmeyàng?', meaning: 'Thời tiết hôm nay thế nào?' }
  },

  // === HSK 1: CHÀO HỎI & XÃ GIAO ===
  {
    hanzi: '你好', pinyin: 'nǐ hǎo', hanviet: 'Nhĩ Hảo', meaning: 'Xin chào',
    level: 'HSK 1', topic: 'Chào hỏi', radical: '亻 (Nhân đứng)', strokes: 7,
    mnemonic: 'Người (亻) chào bạn (尔), phụ nữ (女) sinh con trai (子) là điều tốt lành (好).',
    example: { hanzi: '你好！很高兴认识你。', pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.', meaning: 'Xin chào! Rất vui được quen biết bạn.' }
  },
  {
    hanzi: '谢谢', pinyin: 'xièxie', hanviet: 'Tạ Tạ', meaning: 'Cảm ơn',
    level: 'HSK 1', topic: 'Chào hỏi', radical: '讠(Ngôn)', strokes: 12,
    mnemonic: 'Dùng lời nói (讠) cúi mình (身) biểu thị sự biết ơn dù chỉ một tấc (寸).',
    example: { hanzi: '太谢谢你的帮助了！', pinyin: 'Tài xièxie nǐ de bāngzhù le!', meaning: 'Vô cùng cảm ơn sự giúp đỡ của bạn!' }
  },
  {
    hanzi: '再见', pinyin: 'zàijiàn', hanviet: 'Tái Kiến', meaning: 'Tạm biệt (Hẹn gặp lại)',
    level: 'HSK 1', topic: 'Chào hỏi', radical: '冂 (Quynh)', strokes: 6,
    mnemonic: 'Tái (再) nghĩa là lần nữa, Kiến (见) nghĩa là gặp mặt.',
    example: { hanzi: '明天见，再见！', pinyin: 'Míngtiān jiàn, zàijiàn!', meaning: 'Mai gặp nhé, tạm biệt!' }
  },
  {
    hanzi: '不客气', pinyin: 'bú kèqi', hanviet: 'Bất Khách Khí', meaning: 'Đừng khách sáo, không có gì',
    level: 'HSK 1', topic: 'Chào hỏi', radical: '不 (Bất)', strokes: 9,
    mnemonic: 'Đã là bạn bè thân thiết thì không cần câu nệ khách sáo.',
    example: { hanzi: 'A: 谢谢你！ B: 不客气。', pinyin: 'A: Xièxie nǐ! B: Bú kèqi.', meaning: 'A: Cảm ơn bạn! B: Không có chi.' }
  },
  {
    hanzi: '对不起', pinyin: 'duìbuqǐ', hanviet: 'Đối Bất Khởi', meaning: 'Xin lỗi',
    level: 'HSK 1', topic: 'Chào hỏi', radical: '寸 (Thốn)', strokes: 12,
    mnemonic: 'Cảm thấy hổ thẹn không xứng đối diện với người khác.',
    example: { hanzi: '对不起，我来晚了。', pinyin: 'Duìbuqǐ, wǒ lái wǎn le.', meaning: 'Xin lỗi, tôi đến muộn rồi.' }
  },
  {
    hanzi: '没关系', pinyin: 'méi guānxi', hanviet: 'Một Quan Hệ', meaning: 'Không sao đâu, không hề gì',
    level: 'HSK 1', topic: 'Chào hỏi', radical: '氵(Chấm thủy)', strokes: 14,
    mnemonic: 'Nước trôi qua không còn vướng mắc quan hệ gì nữa.',
    example: { hanzi: '没关系，请坐吧。', pinyin: 'Méi guānxi, qǐng zuò ba.', meaning: 'Không sao đâu, xin mời ngồi.' }
  },
  {
    hanzi: '请', pinyin: 'qǐng', hanviet: 'Thỉnh', meaning: 'Xin, mời',
    level: 'HSK 1', topic: 'Chào hỏi', radical: '讠(Ngôn)', strokes: 10,
    mnemonic: 'Dùng lời nói (讠) chân thành trong sáng như màu xanh (青) để mời mọc.',
    example: { hanzi: '请喝茶！', pinyin: 'Qǐng hē chá!', meaning: 'Xin mời uống trà!' }
  },

  // === HSK 1: CON SỐ (NUMBERS) ===
  {
    hanzi: '零', pinyin: 'líng', hanviet: 'Linh', meaning: 'Số 0',
    level: 'HSK 1', topic: 'Con số', radical: '雨 (Vũ)', strokes: 13,
    mnemonic: 'Mưa (雨) rơi lất phất lệnh (令) xuống giọt nước số 0 tròn trĩnh.',
    example: { hanzi: '我的房间号是三零二。', pinyin: 'Wǒ de fángjiān hào shì sān líng èr.', meaning: 'Số phòng của tôi là 302.' }
  },
  {
    hanzi: '一', pinyin: 'yī', hanviet: 'Nhất', meaning: 'Số 1',
    level: 'HSK 1', topic: 'Con số', radical: '一 (Nhất)', strokes: 1,
    mnemonic: 'Một nét ngang đơn giản biểu thị sự khởi đầu của vạn vật.',
    example: { hanzi: '请给我一杯水。', pinyin: 'Qǐng gěi wǒ yì bēi shuǐ.', meaning: 'Xin cho tôi một cốc nước.' }
  },
  {
    hanzi: '二', pinyin: 'èr', hanviet: 'Nhị', meaning: 'Số 2',
    level: 'HSK 1', topic: 'Con số', radical: '二 (Nhị)', strokes: 2,
    mnemonic: 'Hai nét ngang song song trên dưới biểu thị số lượng hai.',
    example: { hanzi: '现在是两点二十分。', pinyin: 'Xiànzài shì liǎng diǎn èrshí fēn.', meaning: 'Bây giờ là 2 giờ 20 phút.' }
  },
  {
    hanzi: '三', pinyin: 'sān', hanviet: 'Tam', meaning: 'Số 3',
    level: 'HSK 1', topic: 'Con số', radical: '一 (Nhất)', strokes: 3,
    mnemonic: 'Ba nét ngang tượng trưng cho tam tài: Thiên - Địa - Nhân.',
    example: { hanzi: '我有三个苹果。', pinyin: 'Wǒ yǒu sān gè píngguǒ.', meaning: 'Tôi có 3 quả táo.' }
  },
  {
    hanzi: '四', pinyin: 'sì', hanviet: 'Tứ', meaning: 'Số 4',
    level: 'HSK 1', topic: 'Con số', radical: '囗 (Vi)', strokes: 5,
    mnemonic: 'Khung thành vuông vức (囗) bên trong chia làm hai luồng.',
    example: { hanzi: '我家有四口人。', pinyin: 'Wǒ jiā yǒu sì kǒu rén.', meaning: 'Nhà tôi có bốn người.' }
  },
  {
    hanzi: '五', pinyin: 'wǔ', hanviet: 'Ngũ', meaning: 'Số 5',
    level: 'HSK 1', topic: 'Con số', radical: '二 (Nhị)', strokes: 4,
    mnemonic: 'Nối kết giữa trời và đất giao nhau tượng trưng ngũ hành.',
    example: { hanzi: '星期五我们去逛街。', pinyin: 'Xīngqīwǔ wǒmen qù guàngjiē.', meaning: 'Thứ sáu chúng mình đi dạo phố.' }
  },
  {
    hanzi: '六', pinyin: 'liù', hanviet: 'Lục', meaning: 'Số 6',
    level: 'HSK 1', topic: 'Con số', radical: '八 (Bát)', strokes: 4,
    mnemonic: 'Mái nhà che trên hai chân vững chãi biểu thị sự thuận buồm xuôi gió.',
    example: { hanzi: '六月是夏天的开始。', pinyin: 'Liùyuè shì xiàtiān de kāishǐ.', meaning: 'Tháng 6 là khởi đầu của mùa hè.' }
  },
  {
    hanzi: '七', pinyin: 'qī', hanviet: 'Thất', meaning: 'Số 7',
    level: 'HSK 1', topic: 'Con số', radical: '一 (Nhất)', strokes: 2,
    mnemonic: 'Nét ngang cắt nét cong móc vút lên tượng trưng số 7.',
    example: { hanzi: '七天为一个星期。', pinyin: 'Qī tiān wéi yí gè xīngqī.', meaning: 'Bảy ngày là một tuần.' }
  },
  {
    hanzi: '八', pinyin: 'bā', hanviet: 'Bát', meaning: 'Số 8',
    level: 'HSK 1', topic: 'Con số', radical: '八 (Bát)', strokes: 2,
    mnemonic: 'Hai nét phẩy và mác dang rộng phát tài phát lộc.',
    example: { hanzi: '八月十五是中秋节。', pinyin: 'Bāyuè shíwǔ shì Zhōngqiūjié.', meaning: 'Ngày 15 tháng 8 là Tết Trung thu.' }
  },
  {
    hanzi: '九', pinyin: 'jiǔ', hanviet: 'Cửu', meaning: 'Số 9',
    level: 'HSK 1', topic: 'Con số', radical: '丿(Phẩy)', strokes: 2,
    mnemonic: 'Uốn lượn trường tồn cửu vạn trường cửu.',
    example: { hanzi: '九点整我们开始上课。', pinyin: 'Jiǔ diǎn zhěng wǒmen kāishǐ shàngkè.', meaning: 'Đúng 9 giờ chúng tôi bắt đầu vào học.' }
  },
  {
    hanzi: '十', pinyin: 'shí', hanviet: 'Thập', meaning: 'Số 10',
    level: 'HSK 1', topic: 'Con số', radical: '十 (Thập)', strokes: 2,
    mnemonic: 'Nét ngang và nét sổ giao nhau chữ thập tròn vẹn đầy đủ.',
    example: { hanzi: '这本书十块钱。', pinyin: 'Zhè běn shū shí kuài qián.', meaning: 'Cuốn sách này 10 đồng.' }
  },
  {
    hanzi: '百', pinyin: 'bǎi', hanviet: 'Bách', meaning: 'Hàng trăm, 100',
    level: 'HSK 1', topic: 'Con số', radical: '白 (Bạch)', strokes: 6,
    mnemonic: 'Thêm nét ngang phía trên chữ Bạch (白) biểu thị con số 100.',
    example: { hanzi: '学校里有一百多名留学生。', pinyin: 'Xuéxiào lǐ yǒu yì bǎi duō míng liúxuéshēng.', meaning: 'Trong trường có hơn 100 lưu học sinh.' }
  },

  // === HSK 1: GIA ĐÌNH & CON NGƯỜI ===
  {
    hanzi: '爸爸', pinyin: 'bàba', hanviet: 'Ba Ba', meaning: 'Bố, cha',
    level: 'HSK 1', topic: 'Gia đình', radical: '父 (Phụ)', strokes: 8,
    mnemonic: 'Bộ phụ (父) ở trên là người cha, bộ ba (巴) ở dưới chỉ âm đọc.',
    example: { hanzi: '我爸爸是一名医生。', pinyin: 'Wǒ bàba shì yì míng yīshēng.', meaning: 'Bố tôi là một bác sĩ.' }
  },
  {
    hanzi: '妈妈', pinyin: 'māma', hanviet: 'Ma Ma', meaning: 'Mẹ, má',
    level: 'HSK 1', topic: 'Gia đình', radical: '女 (Nữ)', strokes: 6,
    mnemonic: 'Người phụ nữ (女) vất vả nuôi con như ngựa (马) bền bỉ.',
    example: { hanzi: '妈妈做的中国菜真好吃！', pinyin: 'Māma zuò de Zhōngguó cài zhēn hǎochī!', meaning: 'Món ăn mẹ nấu ngon quá!' }
  },
  {
    hanzi: '儿子', pinyin: 'érzi', hanviet: 'Nhi tử', meaning: 'Con trai',
    level: 'HSK 1', topic: 'Gia đình', radical: '儿 (Nhi)', strokes: 5,
    mnemonic: 'Cậu bé nhỏ (儿) sinh ra thành đứa con trai (子).',
    example: { hanzi: '他的儿子今年五岁了。', pinyin: 'Tā de érzi jīnnián wǔ suì le.', meaning: 'Con trai anh ấy năm nay 5 tuổi rồi.' }
  },
  {
    hanzi: '女儿', pinyin: 'nǚ’ér', hanviet: 'Nữ nhi', meaning: 'Con gái',
    level: 'HSK 1', topic: 'Gia đình', radical: '女 (Nữ)', strokes: 5,
    mnemonic: 'Bé gái (女) đáng yêu trong nhà.',
    example: { hanzi: '我女儿很喜欢画画。', pinyin: 'Wǒ nǚ’ér hěn xǐhuan huàhuà.', meaning: 'Con gái tôi rất thích vẽ tranh.' }
  },
  {
    hanzi: '家', pinyin: 'jiā', hanviet: 'Gia', meaning: 'Nhà, gia đình',
    level: 'HSK 1', topic: 'Gia đình', radical: '宀 (Miên)', strokes: 10,
    mnemonic: 'Dưới mái nhà (宀) nuôi dưỡng gia súc no đủ ấm áp.',
    example: { hanzi: '我想回家看望父母。', pinyin: 'Wǒ xiǎng huí jiā kànwàng fùmǔ.', meaning: 'Tôi muốn về nhà thăm bố mẹ.' }
  },
  {
    hanzi: '人', pinyin: 'rén', hanviet: 'Nhân', meaning: 'Người, con người',
    level: 'HSK 1', topic: 'Con người', radical: '人 (Nhân)', strokes: 2,
    mnemonic: 'Hình dáng hai chân con người đứng vững trên mặt đất.',
    example: { hanzi: '这里有很多热情的中国人。', pinyin: 'Zhèlǐ yǒu hěn duō rèqíng de Zhōngguó rén.', meaning: 'Ở đây có rất nhiều người Trung Quốc nhiệt tình.' }
  },
  {
    hanzi: '朋友', pinyin: 'péngyou', hanviet: 'Bằng hữu', meaning: 'Bạn bè',
    level: 'HSK 1', topic: 'Con người', radical: '月 (Nguyệt)', strokes: 8,
    mnemonic: 'Hai vầng trăng (朋) song hành cùng bàn tay (友) nắm chặt.',
    example: { hanzi: '有朋自远方来，不亦乐乎。', pinyin: 'Yǒu péng zì yuǎnfāng lái, bú yì lè hū.', meaning: 'Có bạn từ phương xa đến chẳng vui sao.' }
  },
  {
    hanzi: '老师', pinyin: 'lǎoshī', hanviet: 'Lão sư', meaning: 'Thầy giáo, cô giáo',
    level: 'HSK 1', topic: 'Trường học', radical: '耂 (Lão)', strokes: 12,
    mnemonic: 'Người cao tuổi từng trải (老) dẫn dắt chỉ dạy (师).',
    example: { hanzi: '王老师教我们汉语口语。', pinyin: 'Wáng lǎoshī jiāo wǒmen Hànyǔ kǒuyǔ.', meaning: 'Thầy Vương dạy chúng tôi khẩu ngữ tiếng Trung.' }
  },
  {
    hanzi: '学生', pinyin: 'xuésheng', hanviet: 'Học sinh', meaning: 'Học sinh, sinh viên',
    level: 'HSK 1', topic: 'Trường học', radical: '子 (Tử)', strokes: 13,
    mnemonic: 'Người đang tuổi học hỏi (学) để sinh tồn và phát triển (生).',
    example: { hanzi: '我们都是河内大学的学生。', pinyin: 'Wǒmen dōu shì Hénèi dàxué de xuésheng.', meaning: 'Chúng tôi đều là sinh viên trường Đại học Hà Nội.' }
  },
  {
    hanzi: '同学', pinyin: 'tóngxué', hanviet: 'Đồng học', meaning: 'Bạn cùng lớp, bạn học',
    level: 'HSK 1', topic: 'Trường học', radical: '口 (Khẩu)', strokes: 14,
    mnemonic: 'Cùng chung một trường một lớp (同) học hành (学).',
    example: { hanzi: '她是我的同班同学。', pinyin: 'Tā shì wǒ de tóngbān tóngxué.', meaning: 'Cô ấy là bạn cùng lớp của tôi.' }
  },
  {
    hanzi: '先生', pinyin: 'xiānsheng', hanviet: 'Tiên sinh', meaning: 'Ông, ngài, chồng',
    level: 'HSK 1', topic: 'Giao tiếp', radical: '儿 (Nhi)', strokes: 11,
    mnemonic: 'Người sinh ra trước (先) được tôn kính xưng hô.',
    example: { hanzi: '张先生，请问您找谁？', pinyin: 'Zhāng xiānsheng, qǐngwèn nín zhǎo shéi?', meaning: 'Thưa ông Trương, xin hỏi ông tìm ai?' }
  },
  {
    hanzi: '小姐', pinyin: 'xiǎojiě', hanviet: 'Tiểu thư', meaning: 'Cô gái, tiểu thư',
    level: 'HSK 1', topic: 'Giao tiếp', radical: '女 (Nữ)', strokes: 11,
    mnemonic: 'Cô em gái nhỏ (小) xinh xắn con nhà gia giáo (姐).',
    example: { hanzi: '李小姐，很高兴再次见到你。', pinyin: 'Lǐ xiǎojiě, hěn gāoxìng zàicì jiàndào nǐ.', meaning: 'Chào cô Lý, rất vui được gặp lại cô.' }
  },
  {
    hanzi: '医生', pinyin: 'yīshēng', hanviet: 'Y sinh', meaning: 'Bác sĩ',
    level: 'HSK 1', topic: 'Công việc', radical: '匚 (Phương)', strokes: 12,
    mnemonic: 'Người dùng y thuật (医) cứu sinh mệnh người bệnh (生).',
    example: { hanzi: '生病了就应该去看医生。', pinyin: 'Shēngbìng le jiù yīnggāi qù kàn yīshēng.', meaning: 'Bị ốm thì nên đi khám bác sĩ.' }
  },

  // === HSK 1: ĐỊA ĐIỂM & ĐỒ VẬT ===
  {
    hanzi: '学校', pinyin: 'xuéxiào', hanviet: 'Học hiệu', meaning: 'Trường học',
    level: 'HSK 1', topic: 'Trường học', radical: '木 (Mộc)', strokes: 18,
    mnemonic: 'Nơi cây cối râm mát để con người học hành thi cử.',
    example: { hanzi: '我们的学校非常美丽。', pinyin: 'Wǒmen de xuéxiào fēicháng měilì.', meaning: 'Trường học của chúng tôi rất đẹp.' }
  },
  {
    hanzi: '饭店', pinyin: 'fàndiàn', hanviet: 'Phạn điếm', meaning: 'Nhà hàng, quán ăn, khách sạn',
    level: 'HSK 1', topic: 'Ăn uống', radical: '饣(Thực)', strokes: 15,
    mnemonic: 'Cửa tiệm (店) chuyên phục vụ cơm canh đồ ăn ngon (饭).',
    example: { hanzi: '中午我们去那家饭店吃饭吧。', pinyin: 'Zhōngwǔ wǒmen qù nà jiā fàndiàn chīfàn ba.', meaning: 'Trưa nay chúng mình qua nhà hàng kia ăn cơm nhé.' }
  },
  {
    hanzi: '商店', pinyin: 'shāngdiàn', hanviet: 'Thương điếm', meaning: 'Cửa hàng, tiệm tạp hóa',
    level: 'HSK 1', topic: 'Mua sắm', radical: '广 (Quảng)', strokes: 19,
    mnemonic: 'Nơi kinh doanh thương mại (商) bày bán đồ đạc.',
    example: { hanzi: '商店里有很多新鲜的水果。', pinyin: 'Shāngdiàn lǐ yǒu hěn duō xīnxiān de shuǐguǒ.', meaning: 'Trong cửa hàng có rất nhiều hoa quả tươi.' }
  },
  {
    hanzi: '医院', pinyin: 'yīyuàn', hanviet: 'Y viện', meaning: 'Bệnh viện',
    level: 'HSK 1', topic: 'Sức khỏe', radical: '阝(Phụ)', strokes: 16,
    mnemonic: 'Tòa viện lớn (院) nơi tập trung các vị danh y cứu người (医).',
    example: { hanzi: '我家附近有一所大医院。', pinyin: 'Wǒ jiā fùjìn yǒu yì suǒ dà yīyuàn.', meaning: 'Gần nhà tôi có một bệnh viện lớn.' }
  },
  {
    hanzi: '中国', pinyin: 'Zhōngguó', hanviet: 'Trung Quốc', meaning: 'Trung Quốc',
    level: 'HSK 1', topic: 'Du lịch', radical: '囗 (Vi)', strokes: 12,
    mnemonic: 'Viên ngọc quý (玉) giữa lòng bờ cõi quốc gia rộng lớn (国).',
    example: { hanzi: '我想去中国留学。', pinyin: 'Wǒ xiǎng qù Zhōngguó liúxué.', meaning: 'Tôi muốn sang Trung Quốc du học.' }
  },
  {
    hanzi: '北京', pinyin: 'Běijīng', hanviet: 'Bắc Kinh', meaning: 'Bắc Kinh (Thủ đô TQ)',
    level: 'HSK 1', topic: 'Du lịch', radical: '亠 (Đầu)', strokes: 13,
    mnemonic: 'Kinh đô (京) phồn hoa tráng lệ nằm ở phía Bắc (北).',
    example: { hanzi: '北京的秋天非常迷人。', pinyin: 'Běijīng de qiūtiān fēicháng mírén.', meaning: 'Mùa thu Bắc Kinh vô cùng quyến rũ.' }
  },
  {
    hanzi: '飞机', pinyin: 'fēijī', hanviet: 'Phi cơ', meaning: 'Máy bay',
    level: 'HSK 1', topic: 'Du lịch', radical: '飞 (Phi)', strokes: 7,
    mnemonic: 'Cỗ máy (机) có sải cánh bay lượn (飞) trên bầu trời.',
    example: { hanzi: '我坐下午的飞机去上海。', pinyin: 'Wǒ zuò xiàwǔ de fēijī qù Shànghǎi.', meaning: 'Tôi đi máy bay buổi chiều tới Thượng Hải.' }
  },
  {
    hanzi: '出租车', pinyin: 'chūzūchē', hanviet: 'Xuất tô xa', meaning: 'Xe taxi',
    level: 'HSK 1', topic: 'Du lịch', radical: '车 (Xa)', strokes: 19,
    mnemonic: 'Phương tiện xe cộ (车) cho thuê (租) đi lại.',
    example: { hanzi: '我们打出租车去机场吧。', pinyin: 'Wǒmen dǎ chūzūchē qù jīchǎng ba.', meaning: 'Chúng ta bắt xe taxi ra sân bay nhé.' }
  },
  {
    hanzi: '电脑', pinyin: 'diànnǎo', hanviet: 'Điện não', meaning: 'Máy tính, laptop',
    level: 'HSK 1', topic: 'Công nghệ', radical: '月 (Nguyệt)', strokes: 18,
    mnemonic: 'Bộ não điện tử (电 + 脑) xử lý thông tin thông minh.',
    example: { hanzi: '我用电脑写中文作业。', pinyin: 'Wǒ yòng diànnǎo xiě Zhōngwén zuòyè.', meaning: 'Tôi dùng máy tính làm bài tập tiếng Trung.' }
  },
  {
    hanzi: '电视', pinyin: 'diànshì', hanviet: 'Điện thị', meaning: 'Tivi, truyền hình',
    level: 'HSK 1', topic: 'Đời sống', radical: '见 (Kiến)', strokes: 13,
    mnemonic: 'Màn hình điện tử (电) để quan sát ngắm nhìn (视).',
    example: { hanzi: '晚上爸爸喜欢看电视新闻。', pinyin: 'Wǎnshang bàba xǐhuan kàn diànshì xīnwén.', meaning: 'Buổi tối bố thích xem tin tức truyền hình.' }
  },
  {
    hanzi: '电影', pinyin: 'diànyǐng', hanviet: 'Điện ảnh', meaning: 'Phim, điện ảnh',
    level: 'HSK 1', topic: 'Đời sống', radical: '彡 (Sam)', strokes: 20,
    mnemonic: 'Hình bóng (影) chuyển động nhờ ánh sáng bóng đèn (电).',
    example: { hanzi: '周末我们一起去看电影吧。', pinyin: 'Zhōumò wǒmen yìqǐ qù kàn diànyǐng ba.', meaning: 'Cuối tuần chúng mình cùng đi xem phim nhé.' }
  },
  {
    hanzi: '手机', pinyin: 'shǒujī', hanviet: 'Thủ cơ', meaning: 'Điện thoại di động',
    level: 'HSK 1', topic: 'Công nghệ', radical: '手 (Thủ)', strokes: 10,
    mnemonic: 'Cỗ máy viễn thông nhỏ gọn luôn cầm trên tay (手).',
    example: { hanzi: '请把你的手机号码告诉我。', pinyin: 'Qǐng bǎ nǐ de shǒujī hàomǎ gàosu wǒ.', meaning: 'Xin hãy cho tôi biết số điện thoại của bạn.' }
  },
  {
    hanzi: '书', pinyin: 'shū', hanviet: 'Thư', meaning: 'Sách, vở',
    level: 'HSK 1', topic: 'Trường học', radical: '乙 (Ất)', strokes: 4,
    mnemonic: 'Tay cầm bút viết ghi chép lại kiến thức nghìn đời.',
    example: { hanzi: '桌子上有一本汉语书。', pinyin: 'Zhuōzi shang yǒu yì běn Hànyǔ shū.', meaning: 'Trên bàn có một cuốn sách tiếng Trung.' }
  },
  {
    hanzi: '桌子', pinyin: 'zhuōzi', hanviet: 'Trác tử', meaning: 'Cái bàn',
    level: 'HSK 1', topic: 'Đời sống', radical: '木 (Mộc)', strokes: 13,
    mnemonic: 'Đồ vật bằng gỗ (木) cao ráo để học tập và làm việc.',
    example: { hanzi: '请把书放在桌子上。', pinyin: 'Qǐng bǎ shū fàng zài zhuōzi shang.', meaning: 'Xin hãy đặt sách lên trên bàn.' }
  },
  {
    hanzi: '椅子', pinyin: 'yǐzi', hanviet: 'Y tử', meaning: 'Cái ghế',
    level: 'HSK 1', topic: 'Đời sống', radical: '木 (Mộc)', strokes: 15,
    mnemonic: 'Đồ gỗ (木) có lưng tựa êm ái để ngả lưng ngồi nghỉ.',
    example: { hanzi: '房间里有两把新椅子。', pinyin: 'Fángjiān lǐ yǒu liǎng bǎ xīn yǐzi.', meaning: 'Trong phòng có hai chiếc ghế mới.' }
  },
  {
    hanzi: '衣服', pinyin: 'yīfu', hanviet: 'Y phục', meaning: 'Quần áo',
    level: 'HSK 1', topic: 'Đời sống', radical: '衤(Áo)', strokes: 14,
    mnemonic: 'Bộ y phục (衣) chỉnh tề khoác lên người.',
    example: { hanzi: '这件衣服真漂亮！', pinyin: 'Zhè jiàn yīfu zhēn piàoliang!', meaning: 'Bộ quần áo này đẹp quá!' }
  },
  {
    hanzi: '水', pinyin: 'shuǐ', hanviet: 'Thủy', meaning: 'Nước, sông nước',
    level: 'HSK 1', topic: 'Ăn uống', radical: '水 (Thủy)', strokes: 4,
    mnemonic: 'Dòng nước chảy uốn khúc với giọt nước văng hai bên.',
    example: { hanzi: '运动后要多喝水。', pinyin: 'Yùndòng hòu yào duō hē shuǐ.', meaning: 'Sau khi vận động cần uống nhiều nước.' }
  },
  {
    hanzi: '茶', pinyin: 'chá', hanviet: 'Trà', meaning: 'Trà, lá chè',
    level: 'HSK 1', topic: 'Ăn uống', radical: '艹 (Thảo)', strokes: 9,
    mnemonic: 'Cây cỏ thảo mộc (艹) hái từ cây gỗ (木) để thưởng thức.',
    example: { hanzi: '中国人非常喜欢喝热茶。', pinyin: 'Zhōngguó rén fēicháng xǐhuan hē rè chá.', meaning: 'Người Trung Quốc rất thích uống trà nóng.' }
  },
  {
    hanzi: '米饭', pinyin: 'mǐfàn', hanviet: 'Mễ phạn', meaning: 'Cơm trắng',
    level: 'HSK 1', topic: 'Ăn uống', radical: '米 (Mễ)', strokes: 13,
    mnemonic: 'Hạt gạo (米) được nấu chín thành bát cơm thơm phức (饭).',
    example: { hanzi: '我中午吃了一碗米饭和青菜。', pinyin: 'Wǒ zhōngwǔ chī le yì wǎn mǐfàn hé qīngcài.', meaning: 'Buổi trưa tôi đã ăn một bát cơm và rau xanh.' }
  },
  {
    hanzi: '菜', pinyin: 'cài', hanviet: 'Thái', meaning: 'Món ăn, rau xanh',
    level: 'HSK 1', topic: 'Ăn uống', radical: '艹 (Thảo)', strokes: 11,
    mnemonic: 'Rau cỏ (艹) hái bằng tay (爫) từ trên cây (木) chế biến món ngon.',
    example: { hanzi: '今天我们点了四个菜。', pinyin: 'Jīntiān wǒmen diǎn le sì gè cài.', meaning: 'Hôm nay chúng tôi đã gọi bốn món ăn.' }
  },
  {
    hanzi: '苹果', pinyin: 'píngguǒ', hanviet: 'Bình quả', meaning: 'Quả táo tây',
    level: 'HSK 1', topic: 'Ăn uống', radical: '艹 (Thảo)', strokes: 16,
    mnemonic: 'Loại quả (果) giòn ngọt mang biểu tượng bình an (平).',
    example: { hanzi: '每天吃一个苹果对身体很好。', pinyin: 'Měitiān chī yí gè píngguǒ duì shēntǐ hěn hǎo.', meaning: 'Mỗi ngày ăn một quả táo rất tốt cho sức khỏe.' }
  },
  {
    hanzi: '钱', pinyin: 'qián', hanviet: 'Tiền', meaning: 'Tiền bạc',
    level: 'HSK 1', topic: 'Mua sắm', radical: '钅(Kim)', strokes: 10,
    mnemonic: 'Đúc bằng kim loại quý (钅), ai cũng tranh giành bảo vệ.',
    example: { hanzi: '这个西瓜多少钱一斤？', pinyin: 'Zhè ge xīguā duōshao qián yì jīn?', meaning: 'Quả dưa hấu này bao nhiêu tiền một cân?' }
  },
  {
    hanzi: '东西', pinyin: 'dōngxi', hanviet: 'Đông tây', meaning: 'Đồ vật, đồ đạc',
    level: 'HSK 1', topic: 'Mua sắm', radical: '木 (Mộc)', strokes: 14,
    mnemonic: 'Đồ đạc gom từ bốn phương Đông sang Tây.',
    example: { hanzi: '我去超市买点东西。', pinyin: 'Wǒ qù chāoshì mǎi diǎn dōngxi.', meaning: 'Tôi đi siêu thị mua ít đồ.' }
  },
  {
    hanzi: '猫', pinyin: 'māo', hanviet: 'Miêu', meaning: 'Con mèo',
    level: 'HSK 1', topic: 'Động vật', radical: '犭(Khuyển)', strokes: 11,
    mnemonic: 'Loài thú bốn chân (犭) kêu meo meo săn chuột trên ruộng lúa (苗).',
    example: { hanzi: '我家有一只可爱的小猫。', pinyin: 'Wǒ jiā yǒu yì zhī kě’ài de xiǎomāo.', meaning: 'Nhà tôi có một chú mèo con rất đáng yêu.' }
  },
  {
    hanzi: '狗', pinyin: 'gǒu', hanviet: 'Cẩu', meaning: 'Con chó',
    level: 'HSK 1', topic: 'Động vật', radical: '犭(Khuyển)', strokes: 8,
    mnemonic: 'Loài thú bốn chân (犭) trung thành giữ nhà kêu gâu gâu (句).',
    example: { hanzi: '那只小狗非常聪明。', pinyin: 'Nà zhī xiǎogǒu fēicháng cōngming.', meaning: 'Chú cún con kia rất thông minh.' }
  },

  // === HSK 1: THỜI GIAN & PHƯƠNG HƯỚNG ===
  {
    hanzi: '年', pinyin: 'nián', hanviet: 'Niên', meaning: 'Năm',
    level: 'HSK 1', topic: 'Thời gian', radical: '干 (Can)', strokes: 6,
    mnemonic: 'Mỗi năm lúa chín một mùa gặt.',
    example: { hanzi: '我在北京学习了一年汉语。', pinyin: 'Wǒ zài Běijīng xuéxí le yì nián Hànyǔ.', meaning: 'Tôi đã học tiếng Trung một năm ở Bắc Kinh.' }
  },
  {
    hanzi: '月', pinyin: 'yuè', hanviet: 'Nguyệt', meaning: 'Tháng, mặt trăng',
    level: 'HSK 1', topic: 'Thời gian', radical: '月 (Nguyệt)', strokes: 4,
    mnemonic: 'Hình vành trăng khuyết chiếu sáng trên bầu trời đêm.',
    example: { hanzi: '九月我们要开学了。', pinyin: 'Jiǔyuè wǒmen yào kāixué le.', meaning: 'Tháng 9 chúng tôi sẽ tựu trường khai giảng.' }
  },
  {
    hanzi: '日', pinyin: 'rì', hanviet: 'Nhật', meaning: 'Ngày, mặt trời',
    level: 'HSK 1', topic: 'Thời gian', radical: '日 (Nhật)', strokes: 4,
    mnemonic: 'Vầng thái dương tròn trịa tỏa ánh nắng soi sáng vạn vật.',
    example: { hanzi: '十月一日是国庆节。', pinyin: 'Shíyuè yī rì shì Guóqìngjié.', meaning: 'Ngày mùng 1 tháng 10 là ngày Quốc khánh.' }
  },
  {
    hanzi: '号', pinyin: 'hào', hanviet: 'Hiệu', meaning: 'Ngày (văn nói), số',
    level: 'HSK 1', topic: 'Thời gian', radical: '口 (Khẩu)', strokes: 5,
    mnemonic: 'Mở miệng (口) đọc số hiệu ký hiệu.',
    example: { hanzi: '今天几月几号？', pinyin: 'Jīntiān jǐ yuè jǐ hào?', meaning: 'Hôm nay ngày mấy tháng mấy?' }
  },
  {
    hanzi: '星期', pinyin: 'xīngqī', hanviet: 'Tinh kỳ', meaning: 'Tuần lễ, thứ',
    level: 'HSK 1', topic: 'Thời gian', radical: '日 (Nhật)', strokes: 21,
    mnemonic: 'Chu kỳ các vì sao (星) quay theo tuần (期).',
    example: { hanzi: '星期天你想去哪儿玩？', pinyin: 'Xīngqītiān nǐ xiǎng qù nǎr wán?', meaning: 'Chủ nhật bạn muốn đi đâu chơi?' }
  },
  {
    hanzi: '点', pinyin: 'diǎn', hanviet: 'Điểm', meaning: 'Giờ, điểm',
    level: 'HSK 1', topic: 'Thời gian', radical: '灬 (Hỏa)', strokes: 9,
    mnemonic: 'Kim đồng hồ chỉ từng điểm giờ khắc trôi qua.',
    example: { hanzi: '现在是上午十点。', pinyin: 'Xiànzài shì shàngwǔ shí diǎn.', meaning: 'Bây giờ là 10 giờ sáng.' }
  },
  {
    hanzi: '分钟', pinyin: 'fēnzhōng', hanviet: 'Phân chung', meaning: 'Phút',
    level: 'HSK 1', topic: 'Thời gian', radical: '钅(Kim)', strokes: 16,
    mnemonic: 'Chuông đồng hồ (钟) chia thành từng phân khúc nhỏ (分).',
    example: { hanzi: '请稍等我五分钟。', pinyin: 'Qǐng shāoděng wǒ wǔ fēnzhōng.', meaning: 'Xin chờ tôi năm phút.' }
  },
  {
    hanzi: '现在', pinyin: 'xiànzài', hanviet: 'Hiện tại', meaning: 'Bây giờ, hiện tại',
    level: 'HSK 1', topic: 'Thời gian', radical: '王 (Ngọc)', strokes: 14,
    mnemonic: 'Ngọc quý hiển hiện (现) ngay trước mắt nơi này (在).',
    example: { hanzi: '你现在在做什么呢？', pinyin: 'Nǐ xiànzài zài zuò shénme ne?', meaning: 'Bây giờ bạn đang làm gì thế?' }
  },
  {
    hanzi: '今天', pinyin: 'jīntiān', hanviet: 'Kim thiên', meaning: 'Hôm nay',
    level: 'HSK 1', topic: 'Thời gian', radical: '人 (Nhân)', strokes: 8,
    mnemonic: 'Bầu trời (天) của thời khắc hiện tại này (今).',
    example: { hanzi: '今天天气晴朗，微风习习。', pinyin: 'Jīntiān tiānqì qínglǎng, wēifēng xíxí.', meaning: 'Hôm nay trời nắng ráo, gió nhẹ hiu hiu.' }
  },
  {
    hanzi: '明天', pinyin: 'míngtiān', hanviet: 'Minh thiên', meaning: 'Ngày mai',
    level: 'HSK 1', topic: 'Thời gian', radical: '日 (Nhật)', strokes: 12,
    mnemonic: 'Mặt trời (日) cùng mặt trăng (月) chiếu rạng ngày mai tươi sáng (明).',
    example: { hanzi: '明天见，祝你好运！', pinyin: 'Míngtiān jiàn, zhù nǐ hǎoyùn!', meaning: 'Mai gặp lại nhé, chúc bạn may mắn!' }
  },
  {
    hanzi: '昨天', pinyin: 'zuótiān', hanviet: 'Tạc thiên', meaning: 'Hôm qua',
    level: 'HSK 1', topic: 'Thời gian', radical: '日 (Nhật)', strokes: 13,
    mnemonic: 'Mặt trời (日) của ngày đã qua đi (乍).',
    example: { hanzi: '昨天下了一整天的雨。', pinyin: 'Zuótiān xià le yì zhěng tiān de yǔ.', meaning: 'Hôm qua trời đã mưa suốt cả ngày.' }
  },
  {
    hanzi: '上午', pinyin: 'shàngwǔ', hanviet: 'Thượng ngọ', meaning: 'Buổi sáng (trước 12h)',
    level: 'HSK 1', topic: 'Thời gian', radical: '一 (Nhất)', strokes: 7,
    mnemonic: 'Khoảng thời gian phía trên trước buổi trưa chính ngọ (午).',
    example: { hanzi: '上午我有两节汉语课。', pinyin: 'Shàngwǔ wǒ yǒu liǎng jié Hànyǔ kè.', meaning: 'Buổi sáng tôi có hai tiết tiếng Trung.' }
  },
  {
    hanzi: '中午', pinyin: 'zhōngwǔ', hanviet: 'Trung ngọ', meaning: 'Buổi trưa (khoảng 12h)',
    level: 'HSK 1', topic: 'Thời gian', radical: '丨 (Sổ)', strokes: 8,
    mnemonic: 'Chính giữa (中) ban ngày bóng nắng rọi đỉnh đầu.',
    example: { hanzi: '中午我们一起吃午饭吧。', pinyin: 'Zhōngwǔ wǒmen yìqǐ chī wǔfàn ba.', meaning: 'Buổi trưa chúng mình cùng ăn cơm trưa nhé.' }
  },
  {
    hanzi: '下午', pinyin: 'xiàwǔ', hanviet: 'Hạ ngọ', meaning: 'Buổi chiều',
    level: 'HSK 1', topic: 'Thời gian', radical: '一 (Nhất)', strokes: 7,
    mnemonic: 'Khoảng thời gian sau buổi trưa mặt trời hạ dần (下).',
    example: { hanzi: '下午三点我们去操场踢足球。', pinyin: 'Xiàwǔ sān diǎn wǒmen qù cāochǎng tī zúqiú.', meaning: 'Chiều 3 giờ chúng tôi ra sân bóng đá.' }
  },
  {
    hanzi: '时候', pinyin: 'shíhou', hanviet: 'Thời hậu', meaning: 'Thời điểm, lúc, khi',
    level: 'HSK 1', topic: 'Thời gian', radical: '日 (Nhật)', strokes: 20,
    mnemonic: 'Thời khắc mặt trời chiếu ngóng đợi (候) lúc gặp gỡ.',
    example: { hanzi: '你什么时候回国？', pinyin: 'Nǐ shénme shíhou huíguó?', meaning: 'Khi nào bạn về nước?' }
  },
  {
    hanzi: '上', pinyin: 'shàng', hanviet: 'Thượng', meaning: 'Trên, lên',
    level: 'HSK 1', topic: 'Phương hướng', radical: '一 (Nhất)', strokes: 3,
    mnemonic: 'Nét dọc dựng trên nét ngang định hướng lên cao.',
    example: { hanzi: '书在桌子上。', pinyin: 'Shū zài zhuōzi shang.', meaning: 'Sách ở trên bàn.' }
  },
  {
    hanzi: '下', pinyin: 'xià', hanviet: 'Hạ', meaning: 'Dưới, xuống',
    level: 'HSK 1', topic: 'Phương hướng', radical: '一 (Nhất)', strokes: 3,
    mnemonic: 'Nét chấm chỉ xuống phía dưới nét ngang.',
    example: { hanzi: '小猫在椅子下睡觉。', pinyin: 'Xiǎomāo zài yǐzi xià shuìjiào.', meaning: 'Chú mèo con đang ngủ dưới gầm ghế.' }
  },
  {
    hanzi: '前', pinyin: 'qián', hanviet: 'Tiền', meaning: 'Trước, phía trước',
    level: 'HSK 1', topic: 'Phương hướng', radical: '刂 (Đao)', strokes: 9,
    mnemonic: 'Dùng đao tiến lên phía trước khai hoang bờ cõi.',
    example: { hanzi: '学校前面有一个大公园。', pinyin: 'Xuéxiào qiánmiàn yǒu yí gè dà gōngyuán.', meaning: 'Phía trước trường học có một công viên lớn.' }
  },
  {
    hanzi: '后', pinyin: 'hòu', hanviet: 'Hậu', meaning: 'Sau, phía sau',
    level: 'HSK 1', topic: 'Phương hướng', radical: '口 (Khẩu)', strokes: 6,
    mnemonic: 'Người đi sau cất bước chậm rãi quan sát.',
    example: { hanzi: '饭店在超市后面。', pinyin: 'Fàndiàn zài chāoshì hòumiàn.', meaning: 'Nhà hàng ở phía sau siêu thị.' }
  },
  {
    hanzi: '里', pinyin: 'lǐ', hanviet: 'Lý', meaning: 'Bên trong, trong',
    level: 'HSK 1', topic: 'Phương hướng', radical: '里 (Lý)', strokes: 7,
    mnemonic: 'Đồng ruộng (田) đất đai (土) sinh sôi bên trong bờ cõi.',
    example: { hanzi: '书包里有什么？', pinyin: 'Shūbāo lǐ yǒu shénme?', meaning: 'Bên trong cặp sách có những gì?' }
  },

  // === HSK 1: ĐỘNG TỪ CỐT LÕI (ACTION VERBS) ===
  {
    hanzi: '是', pinyin: 'shì', hanviet: 'Thị', meaning: 'Là, đúng',
    level: 'HSK 1', topic: 'Động từ', radical: '日 (Nhật)', strokes: 9,
    mnemonic: 'Mặt trời (日) mọc đúng hẹn soi sáng chân lý.',
    example: { hanzi: '我是汉语老师。', pinyin: 'Wǒ shì Hànyǔ lǎoshī.', meaning: 'Tôi là giáo viên dạy tiếng Trung.' }
  },
  {
    hanzi: '有', pinyin: 'yǒu', hanviet: 'Hữu', meaning: 'Có, tồn tại',
    level: 'HSK 1', topic: 'Động từ', radical: '月 (Nguyệt)', strokes: 6,
    mnemonic: 'Bàn tay nắm lấy vầng trăng biểu thị sự sở hữu.',
    example: { hanzi: '你有一张中国地图吗？', pinyin: 'Nǐ yǒu yì zhāng Zhōngguó dìtú ma?', meaning: 'Bạn có một tấm bản đồ Trung Quốc không?' }
  },
  {
    hanzi: '看', pinyin: 'kàn', hanviet: 'Khán', meaning: 'Xem, nhìn, đọc',
    level: 'HSK 1', topic: 'Động từ', radical: '目 (Mục)', strokes: 9,
    mnemonic: 'Đưa bàn tay (手) che lên mắt (目) để nhìn thật rõ xa xăm.',
    example: { hanzi: '我喜欢看中国电影。', pinyin: 'Wǒ xǐhuan kàn Zhōngguó diànyǐng.', meaning: 'Tôi thích xem phim điện ảnh Trung Quốc.' }
  },
  {
    hanzi: '听', pinyin: 'tīng', hanviet: 'Thính', meaning: 'Nghe',
    level: 'HSK 1', topic: 'Động từ', radical: '口 (Khẩu)', strokes: 7,
    mnemonic: 'Mở miệng lắng tai nghe âm thanh chiếc rìu (斤) chặt cây.',
    example: { hanzi: '每天听汉语录音可以提高听力。', pinyin: 'Měitiān tīng Hànyǔ lùyīn kěyǐ tígāo tīnglì.', meaning: 'Mỗi ngày nghe băng tiếng Trung có thể nâng cao kỹ năng nghe.' }
  },
  {
    hanzi: '说', pinyin: 'shuō', hanviet: 'Thuyết', meaning: 'Nói',
    level: 'HSK 1', topic: 'Động từ', radical: '讠(Ngôn)', strokes: 9,
    mnemonic: 'Dùng lời nói (讠) thuyết phục mọi người vui vẻ.',
    example: { hanzi: '请你说慢一点儿。', pinyin: 'Qǐng nǐ shuō màn yìdiǎnr.', meaning: 'Xin bạn hãy nói chậm lại một chút.' }
  },
  {
    hanzi: '读', pinyin: 'dú', hanviet: 'Độc', meaning: 'Đọc',
    level: 'HSK 1', topic: 'Động từ', radical: '讠(Ngôn)', strokes: 10,
    mnemonic: 'Dùng lời nói (讠) xướng to câu chữ buôn bán (卖).',
    example: { hanzi: '我们每天早晨读课文。', pinyin: 'Wǒmen měitiān zǎochén dú kèwén.', meaning: 'Mỗi sáng chúng tôi đều đọc bài khóa.' }
  },
  {
    hanzi: '写', pinyin: 'xiě', hanviet: 'Tả', meaning: 'Viết',
    level: 'HSK 1', topic: 'Động từ', radical: '冖 (Mịch)', strokes: 5,
    mnemonic: 'Dưới mái che cặm cụi nắn nót viết từng nét chữ.',
    example: { hanzi: '请在练习本上写汉字。', pinyin: 'Qǐng zài liànxíběn shang xiě hànzì.', meaning: 'Xin hãy viết chữ Hán vào vở bài tập.' }
  },
  {
    hanzi: '吃', pinyin: 'chī', hanviet: 'Cật', meaning: 'Ăn',
    level: 'HSK 1', topic: 'Ăn uống', radical: '口 (Khẩu)', strokes: 6,
    mnemonic: 'Mở miệng (口) thưởng thức món ăn đưa vào dạ dày.',
    example: { hanzi: '你想吃中国饺子吗？', pinyin: 'Nǐ xiǎng chī Zhōngguó jiǎozi ma?', meaning: 'Bạn có muốn ăn sủi cảo Trung Quốc không?' }
  },
  {
    hanzi: '喝', pinyin: 'hē', hanviet: 'Hát', meaning: 'Uống',
    level: 'HSK 1', topic: 'Ăn uống', radical: '口 (Khẩu)', strokes: 12,
    mnemonic: 'Dùng miệng (口) uống từng ngụm nước giải khát dưới nắng (日).',
    example: { hanzi: '天气很热，请喝杯冰水吧。', pinyin: 'Tiānqì hěn rè, qǐng hē bēi bīngshuǐ ba.', meaning: 'Trời rất nóng, xin mời uống cốc nước đá.' }
  },
  {
    hanzi: '买', pinyin: 'mǎi', hanviet: 'Mãi', meaning: 'Mua',
    level: 'HSK 1', topic: 'Mua sắm', radical: '乙 (Ất)', strokes: 6,
    mnemonic: 'Dùng đồng tiền mua sắm hàng hóa mang về nhà.',
    example: { hanzi: '我想买两张去北京的火车票。', pinyin: 'Wǒ xiǎng mǎi liǎng zhāng qù Běijīng de huǒchēpiào.', meaning: 'Tôi muốn mua hai vé tàu hỏa đi Bắc Kinh.' }
  },
  {
    hanzi: '去', pinyin: 'qù', hanviet: 'Khứ', meaning: 'Đi',
    level: 'HSK 1', topic: 'Động từ', radical: '厶 (Khư)', strokes: 5,
    mnemonic: 'Rời khỏi đất đai (土) cất bước ra đi.',
    example: { hanzi: '下午我们一起去超市买水果。', pinyin: 'Xiàwǔ wǒmen yìqǐ qù chāoshì mǎi shuǐguǒ.', meaning: 'Chiều nay chúng ta cùng đi siêu thị mua hoa quả.' }
  },
  {
    hanzi: '来', pinyin: 'lái', hanviet: 'Lai', meaning: 'Đến, tới',
    level: 'HSK 1', topic: 'Động từ', radical: '木 (Mộc)', strokes: 7,
    mnemonic: 'Cây lúa trĩu hạt báo hiệu mùa màng bội thu đã đến.',
    example: { hanzi: '欢迎你来我家做客！', pinyin: 'Huānyíng nǐ lái wǒ jiā zuòkè!', meaning: 'Hoan nghênh bạn tới nhà tôi chơi!' }
  },
  {
    hanzi: '回', pinyin: 'huí', hanviet: 'Hồi', meaning: 'Về, quay lại',
    level: 'HSK 1', topic: 'Động từ', radical: '囗 (Vi)', strokes: 6,
    mnemonic: 'Hai vòng xoáy vuông vức trở về điểm xuất phát.',
    example: { hanzi: '太晚了，我们该回家了。', pinyin: 'Tài wǎn le, wǒmen gāi huí jiā le.', meaning: 'Muộn quá rồi, chúng ta nên về nhà thôi.' }
  },
  {
    hanzi: '做', pinyin: 'zuò', hanviet: 'Tác', meaning: 'Làm, chế biến',
    level: 'HSK 1', topic: 'Động từ', radical: '亻 (Nhân đứng)', strokes: 11,
    mnemonic: 'Con người (亻) cần mẫn làm việc tạo ra thành quả cổ kính (故).',
    example: { hanzi: '你周末喜欢做什么？', pinyin: 'Nǐ zhōumò xǐhuan zuò shénme?', meaning: 'Cuối tuần bạn thích làm gì?' }
  },
  {
    hanzi: '坐', pinyin: 'zuò', hanviet: 'Tọa', meaning: 'Ngồi, đi (xe/máy bay)',
    level: 'HSK 1', topic: 'Động từ', radical: '土 (Thổ)', strokes: 7,
    mnemonic: 'Hai người (从) ngồi đối diện nhau trên mặt đất (土).',
    example: { hanzi: '请坐，喝杯热茶吧。', pinyin: 'Qǐng zuò, hē bēi rè chá ba.', meaning: 'Xin mời ngồi, uống chén trà nóng nhé.' }
  },
  {
    hanzi: '住', pinyin: 'zhù', hanviet: 'Trú', meaning: 'Ở, cư trú',
    level: 'HSK 1', topic: 'Động từ', radical: '亻 (Nhân đứng)', strokes: 7,
    mnemonic: 'Người (亻) thắp ngọn đèn làm chủ (主) tổ ấm an cư.',
    example: { hanzi: '你住在哪个城市？', pinyin: 'Nǐ zhù zài nǎ ge chéngshì?', meaning: 'Bạn sinh sống ở thành phố nào?' }
  },
  {
    hanzi: '叫', pinyin: 'jiào', hanviet: 'Khiếu', meaning: 'Tên là, gọi',
    level: 'HSK 1', topic: 'Chào hỏi', radical: '口 (Khẩu)', strokes: 5,
    mnemonic: 'Mở miệng (口) cất tiếng gọi tên ai đó.',
    example: { hanzi: '我叫李明，是越南留学生。', pinyin: 'Wǒ jiào Lǐ Míng, shì Yuènán liúxuéshēng.', meaning: 'Tôi tên là Lý Minh, là du học sinh Việt Nam.' }
  },
  {
    hanzi: '爱', pinyin: 'ài', hanviet: 'Ái', meaning: 'Yêu, thương yêu',
    level: 'HSK 1', topic: 'Cảm xúc', radical: '爫 (Trảo)', strokes: 10,
    mnemonic: 'Bàn tay che chở nâng niu trái tim (心) chân thành.',
    example: { hanzi: '我爱我的爸爸妈妈。', pinyin: 'Wǒ ài wǒ de bàba māma.', meaning: 'Tôi yêu bố mẹ của mình.' }
  },
  {
    hanzi: '喜欢', pinyin: 'xǐhuan', hanviet: 'Hỉ hoan', meaning: 'Thích, yêu mến',
    level: 'HSK 1', topic: 'Cảm xúc', radical: '口 (Khẩu)', strokes: 18,
    mnemonic: 'Niềm vui sướng (喜) hân hoan (欢) dâng trào trong lòng.',
    example: { hanzi: '我非常喜欢学习汉语。', pinyin: 'Wǒ fēicháng xǐhuan xuéxí Hànyǔ.', meaning: 'Tôi vô cùng yêu thích học tiếng Trung.' }
  },
  {
    hanzi: '想', pinyin: 'xiǎng', hanviet: 'Tưởng', meaning: 'Muốn, nghĩ, nhớ',
    level: 'HSK 1', topic: 'Cảm xúc', radical: '心 (Tâm)', strokes: 13,
    mnemonic: 'Quan sát cây cối và mắt (相) rồi gửi gắm tâm tư (心).',
    example: { hanzi: '我想去中国长城看看。', pinyin: 'Wǒ xiǎng qù Zhōngguó Chángchéng kànkan.', meaning: 'Tôi muốn đến Vạn Lý Trường Thành Trung Quốc ngắm nhìn.' }
  },
  {
    hanzi: '会', pinyin: 'huì', hanviet: 'Hội', meaning: 'Biết (qua học tập), sẽ',
    level: 'HSK 1', topic: 'Năng nguyện', radical: '人 (Nhân)', strokes: 6,
    mnemonic: 'Nhiều người hội họp tụ tập trao đổi kỹ năng.',
    example: { hanzi: '你会说汉语吗？', pinyin: 'Nǐ huì shuō Hànyǔ ma?', meaning: 'Bạn có biết nói tiếng Trung không?' }
  },
  {
    hanzi: '能', pinyin: 'néng', hanviet: 'Năng', meaning: 'Có thể (khả năng thực tế)',
    level: 'HSK 1', topic: 'Năng nguyện', radical: '月 (Nguyệt)', strokes: 10,
    mnemonic: 'Hình chú gấu khỏe khoắn đầy năng lực.',
    example: { hanzi: '今天下午你能来我家吗？', pinyin: 'Jīntiān xiàwǔ nǐ néng lái wǒ jiā ma?', meaning: 'Chiều nay bạn có thể qua nhà tôi không?' }
  },
  {
    hanzi: '认识', pinyin: 'rènshi', hanviet: 'Nhận thức', meaning: 'Quen biết, nhận ra',
    level: 'HSK 1', topic: 'Giao tiếp', radical: '讠(Ngôn)', strokes: 11,
    mnemonic: 'Dùng lời nói (讠) tìm hiểu và nhận ra tri thức (识).',
    example: { hanzi: '很高兴认识你！', pinyin: 'Hěn gāoxìng rènshi nǐ!', meaning: 'Rất vui được quen biết bạn!' }
  },
  {
    hanzi: '睡觉', pinyin: 'shuìjiào', hanviet: 'Thụy giác', meaning: 'Ngủ, đi ngủ',
    level: 'HSK 1', topic: 'Đời sống', radical: '目 (Mục)', strokes: 20,
    mnemonic: 'Mắt (目) rũ xuống nghỉ ngơi chìm vào giấc mơ êm đềm.',
    example: { hanzi: '太累了，我想先睡觉。', pinyin: 'Tài lèi le, wǒ xiǎng xiān shuìjiào.', meaning: 'Mệt quá rồi, tôi muốn ngủ trước.' }
  },
  {
    hanzi: '工作', pinyin: 'gōngzuò', hanviet: 'Công tác', meaning: 'Làm việc, công việc',
    level: 'HSK 1', topic: 'Công việc', radical: '亻 (Nhân đứng)', strokes: 10,
    mnemonic: 'Con người dùng sức lao động (工) tạo nên thành quả (作).',
    example: { hanzi: '他每天努力工作。', pinyin: 'Tā měitiān nǔlì gōngzuò.', meaning: 'Anh ấy mỗi ngày đều nỗ lực làm việc.' }
  },
  {
    hanzi: '学习', pinyin: 'xuéxí', hanviet: 'Học tập', meaning: 'Học tập, rèn luyện',
    level: 'HSK 1', topic: 'Trường học', radical: '子 (Tử)', strokes: 11,
    mnemonic: 'Học hỏi kiến thức rồi siêng năng thực hành như chim tập bay.',
    example: { hanzi: '我们在HanziGo努力学习汉语。', pinyin: 'Wǒmen zài HanziGo nǔlì xuéxí Hànyǔ.', meaning: 'Chúng tôi nỗ lực học tiếng Trung trên HanziGo.' }
  },

  // === HSK 1: TÍNH TỪ & TRẠNG TỪ ===
  {
    hanzi: '好', pinyin: 'hǎo', hanviet: 'Hảo', meaning: 'Tốt, đẹp, khỏe',
    level: 'HSK 1', topic: 'Tính từ', radical: '女 (Nữ)', strokes: 6,
    mnemonic: 'Người phụ nữ (女) sinh được con trai (子) là điều tốt đẹp.',
    example: { hanzi: '今天天气很好。', pinyin: 'Jīntiān tiānqì hěn hǎo.', meaning: 'Hôm nay thời tiết rất đẹp.' }
  },
  {
    hanzi: '大', pinyin: 'dà', hanviet: 'Đại', meaning: 'To, lớn',
    level: 'HSK 1', topic: 'Tính từ', radical: '大 (Đại)', strokes: 3,
    mnemonic: 'Con người dang rộng hai cánh tay biểu thị sự to lớn.',
    example: { hanzi: '这个苹果很大很甜。', pinyin: 'Zhè ge píngguǒ hěn dà hěn tián.', meaning: 'Quả táo này rất to và rất ngọt.' }
  },
  {
    hanzi: '小', pinyin: 'xiǎo', hanviet: 'Tiểu', meaning: 'Nhỏ, bé',
    level: 'HSK 1', topic: 'Tính từ', radical: '小 (Tiểu)', strokes: 3,
    mnemonic: 'Chia tách nhỏ giọt ở giữa hai bên nhỏ bé.',
    example: { hanzi: '这间卧室比较小。', pinyin: 'Zhè jiān wòshì bǐjiào xiǎo.', meaning: 'Phòng ngủ này tương đối nhỏ.' }
  },
  {
    hanzi: '多', pinyin: 'duō', hanviet: 'Đa', meaning: 'Nhiều',
    level: 'HSK 1', topic: 'Tính từ', radical: '夕 (Tịch)', strokes: 6,
    mnemonic: 'Nhiều đêm trăng (夕) xếp chồng lên nhau thành nhiều.',
    example: { hanzi: '这里有很多中国朋友。', pinyin: 'Zhèlǐ yǒu hěn duō Zhōngguó péngyou.', meaning: 'Ở đây có rất nhiều bạn Trung Quốc.' }
  },
  {
    hanzi: '少', pinyin: 'shǎo', hanviet: 'Thiểu', meaning: 'Ít, thiếu',
    level: 'HSK 1', topic: 'Tính từ', radical: '小 (Tiểu)', strokes: 4,
    mnemonic: 'Chữ tiểu (小) phẩy thêm một nét nữa biểu thị sự ít ỏi.',
    example: { hanzi: '今天来参加活动的人很少。', pinyin: 'Jīntiān lái cānjiā huódòng de rén hěn shǎo.', meaning: 'Hôm nay người tới tham gia hoạt động rất ít.' }
  },
  {
    hanzi: '冷', pinyin: 'lěng', hanviet: 'Lãnh', meaning: 'Lạnh, rét',
    level: 'HSK 1', topic: 'Thời tiết', radical: '冫(Băng)', strokes: 7,
    mnemonic: 'Nước đóng băng (冫) truyền lệnh (令) gió mùa đông lạnh buốt.',
    example: { hanzi: '冬天北京的天气非常冷。', pinyin: 'Dōngtiān Běijīng de tiānqì fēicháng lěng.', meaning: 'Mùa đông thời tiết Bắc Kinh vô cùng lạnh.' }
  },
  {
    hanzi: '热', pinyin: 'rè', hanviet: 'Nhiệt', meaning: 'Nóng, ấm',
    level: 'HSK 1', topic: 'Thời tiết', radical: '灬 (Hỏa)', strokes: 10,
    mnemonic: 'Đốm lửa (灬) hun nóng đất đai (土) làm nhiệt độ tăng cao.',
    example: { hanzi: '夏天河内天气很热。', pinyin: 'Xiàtiān Hénèi tiānqì hěn rè.', meaning: 'Mùa hè thời tiết Hà Nội rất nóng.' }
  },
  {
    hanzi: '高兴', pinyin: 'gāoxìng', hanviet: 'Cao hứng', meaning: 'Vui vẻ, hớn hở',
    level: 'HSK 1', topic: 'Cảm xúc', radical: '高 (Cao)', strokes: 16,
    mnemonic: 'Tâm trạng thăng hoa lên cao (高) hứng khởi rộn ràng (兴).',
    example: { hanzi: '今天收到礼物我很高兴。', pinyin: 'Jīntiān shōudào lǐwù wǒ hěn gāoxìng.', meaning: 'Hôm nay nhận được quà tôi rất vui.' }
  },
  {
    hanzi: '漂亮', pinyin: 'piàoliang', hanviet: 'Phiêu lượng', meaning: 'Xinh đẹp, đẹp đẽ',
    level: 'HSK 1', topic: 'Tính từ', radical: '氵(Chấm thủy)', strokes: 14,
    mnemonic: 'Nước trong xanh (氵) phản chiếu ánh sáng (亮) xinh đẹp tuyệt trần.',
    example: { hanzi: '这件中国旗袍真漂亮！', pinyin: 'Zhè jiàn Zhōngguó qípáo zhēn piàoliang!', meaning: 'Bộ sườn xám Trung Quốc này thật xinh đẹp!' }
  },
  {
    hanzi: '不', pinyin: 'bù', hanviet: 'Bất', meaning: 'Không (phủ định hiện tại/tương lai)',
    level: 'HSK 1', topic: 'Phó từ', radical: '一 (Nhất)', strokes: 4,
    mnemonic: 'Hạt mầm chưa đâm chồi vươn lên mặt đất.',
    example: { hanzi: '我不喝咖啡，我喝茶。', pinyin: 'Wǒ bù hē kāfēi, wǒ hē chá.', meaning: 'Tôi không uống cà phê, tôi uống trà.' }
  },
  {
    hanzi: '没', pinyin: 'méi', hanviet: 'Một', meaning: 'Chưa, không có',
    level: 'HSK 1', topic: 'Phó từ', radical: '氵(Chấm thủy)', strokes: 7,
    mnemonic: 'Chìm ngập dưới dòng nước (氵) không thấy đâu nữa.',
    example: { hanzi: '我还没吃早饭。', pinyin: 'Wǒ hái méi chī zǎofàn.', meaning: 'Tôi vẫn chưa ăn bữa sáng.' }
  },
  {
    hanzi: '很', pinyin: 'hěn', hanviet: 'Khẩn', meaning: 'Rất, lắm',
    level: 'HSK 1', topic: 'Phó từ', radical: '彳(Chim chích)', strokes: 9,
    mnemonic: 'Bước chân dồn dập quyết tâm thực hiện mức độ cao.',
    example: { hanzi: '中国菜很好吃。', pinyin: 'Zhōngguó cài hěn hǎochī.', meaning: 'Món ăn Trung Quốc rất ngon.' }
  },
  {
    hanzi: '太', pinyin: 'tài', hanviet: 'Thái', meaning: 'Quá, lắm (thường đi với 了)',
    level: 'HSK 1', topic: 'Phó từ', radical: '大 (Đại)', strokes: 4,
    mnemonic: 'Chữ đại (大) thêm một giọt biểu thị sự quá mức.',
    example: { hanzi: '太好了，我们一起去吧！', pinyin: 'Tài hǎo le, wǒmen yìqǐ qù ba!', meaning: 'Quá tốt rồi, chúng mình cùng đi nhé!' }
  },
  {
    hanzi: '都', pinyin: 'dōu', hanviet: 'Đô', meaning: 'Đều, tất cả',
    level: 'HSK 1', topic: 'Phó từ', radical: '阝(Ấp)', strokes: 10,
    mnemonic: 'Toàn bộ vùng đất kinh đô quy tụ muôn dân.',
    example: { hanzi: '我们都是汉语专业的学生。', pinyin: 'Wǒmen dōu shì Hànyǔ zhuānyè de xuésheng.', meaning: 'Chúng tôi đều là sinh viên chuyên ngành tiếng Trung.' }
  },

  // === HSK 2: HOẠT ĐỘNG, SỨC KHỎE & THỂ THAO ===
  {
    hanzi: '帮助', pinyin: 'bāngzhù', hanviet: 'Bang trợ', meaning: 'Giúp đỡ, tương trợ',
    level: 'HSK 2', topic: 'Giao tiếp', radical: '巾 (Khăn)', strokes: 16,
    mnemonic: 'Dùng tấm lòng và sức lực (力) tương trợ người hoạn nạn.',
    example: { hanzi: '谢谢大家的热情帮助！', pinyin: 'Xièxie dàjiā de rèqíng bāngzhù!', meaning: 'Cảm ơn sự giúp đỡ nhiệt tình của mọi người!' }
  },
  {
    hanzi: '跑步', pinyin: 'pǎobù', hanviet: 'Bào bộ', meaning: 'Chạy bộ',
    level: 'HSK 2', topic: 'Thể thao', radical: '足 (Túc)', strokes: 19,
    mnemonic: 'Đôi chân (足) cất từng bước (步) chạy nhanh rèn luyện thân thể.',
    example: { hanzi: '每天早晨我都去公园跑步。', pinyin: 'Měitiān zǎochén wǒ dōu qù gōngyuán pǎobù.', meaning: 'Mỗi sáng tôi đều ra công viên chạy bộ.' }
  },
  {
    hanzi: '踢足球', pinyin: 'tī zúqiú', hanviet: 'Thích túc cầu', meaning: 'Đá bóng, chơi đá banh',
    level: 'HSK 2', topic: 'Thể thao', radical: '足 (Túc)', strokes: 26,
    mnemonic: 'Dùng bàn chân (足) đá quả cầu tròn (球).',
    example: { hanzi: '男孩子们很喜欢在操场上踢足球。', pinyin: 'Nánháizimen hěn xǐhuan zài cāochǎng shang tī zúqiú.', meaning: 'Các bạn nam rất thích đá bóng trên sân vận động.' }
  },
  {
    hanzi: '游泳', pinyin: 'yóuyǒng', hanviet: 'Du vịnh', meaning: 'Bơi lội',
    level: 'HSK 2', topic: 'Thể thao', radical: '氵(Chấm thủy)', strokes: 20,
    mnemonic: 'Dưới làn nước (氵) thỏa sức bơi lội vẫy vùng.',
    example: { hanzi: '夏天去海边游泳很舒服。', pinyin: 'Xiàtiān qù hǎibiān yóuyǒng hěn shūfu.', meaning: 'Mùa hè đi bơi ở biển rất dễ chịu.' }
  },
  {
    hanzi: '唱歌', pinyin: 'chànggē', hanviet: 'Xướng ca', meaning: 'Hát, ca hát',
    level: 'HSK 2', topic: 'Đời sống', radical: '口 (Khẩu)', strokes: 25,
    mnemonic: 'Dùng miệng (口) cất tiếng hát vang bài ca yêu đời.',
    example: { hanzi: '星期六晚上我们去唱KTV唱歌吧。', pinyin: 'Xīngqīliù wǎnshang wǒmen qù chàng KTV chànggē ba.', meaning: 'Tối thứ bảy chúng mình đi hát karaoke nhé.' }
  },
  {
    hanzi: '跳舞', pinyin: 'tiàowǔ', hanviet: 'Khiêu vũ', meaning: 'Khiêu vũ, nhảy múa',
    level: 'HSK 2', topic: 'Đời sống', radical: '足 (Túc)', strokes: 27,
    mnemonic: 'Đôi chân nhảy nhót theo nhịp điệu vũ đạo thướt tha.',
    example: { hanzi: '她从小就学习中国传统跳舞。', pinyin: 'Tā cóngxiǎo jiù xuéxí Zhōngguó chuántǒng tiàowǔ.', meaning: 'Cô ấy từ nhỏ đã học múa truyền thống Trung Quốc.' }
  },
  {
    hanzi: '旅游', pinyin: 'lǚyóu', hanviet: 'Lữ du', meaning: 'Du lịch',
    level: 'HSK 2', topic: 'Du lịch', radical: '方 (Phương)', strokes: 21,
    mnemonic: 'Mang hành lý đi khắp bốn phương trời ngao du thưởng ngoạn.',
    example: { hanzi: '今年放假我想去云南旅游。', pinyin: 'Jīnnián fàngjià wǒ xiǎng qù Yúnnán lǚyóu.', meaning: 'Kỳ nghỉ năm nay tôi muốn đi du lịch Vân Nam.' }
  },
  {
    hanzi: '生病', pinyin: 'shēngbìng', hanviet: 'Sinh bệnh', meaning: 'Bị ốm, bị bệnh',
    level: 'HSK 2', topic: 'Sức khỏe', radical: '疒 (Nạch)', strokes: 15,
    mnemonic: 'Bộ nạch (疒) chỉ người nằm liệt giường vì bệnh tật.',
    example: { hanzi: '天气变冷了，小心不要生病。', pinyin: 'Tiānqì biàn lěng le, xiǎoxīn bú yào shēngbìng.', meaning: 'Thời tiết lạnh rồi, cẩn thận kẻo bị ốm.' }
  },
  {
    hanzi: '身体', pinyin: 'shēntǐ', hanviet: 'Thân thể', meaning: 'Cơ thể, sức khỏe',
    level: 'HSK 2', topic: 'Sức khỏe', radical: '身 (Thân)', strokes: 14,
    mnemonic: 'Thân thể (身) và thể xác (体) là vốn quý nhất của con người.',
    example: { hanzi: '祝您身体健康，万事如意！', pinyin: 'Zhù nín shēntǐ jiànkāng, wànshì rúyì!', meaning: 'Kính chúc bác sức khỏe dồi dào, vạn sự như ý!' }
  },
  {
    hanzi: '眼睛', pinyin: 'yǎnjing', hanviet: 'Nhãn tinh', meaning: 'Đôi mắt',
    level: 'HSK 2', topic: 'Cơ thể', radical: '目 (Mục)', strokes: 22,
    mnemonic: 'Đôi mắt (目) sáng long lanh như hạt ngọc tinh khôi.',
    example: { hanzi: '长时间看电脑对眼睛不好。', pinyin: 'Cháng shíjiān kàn diànnǎo duì yǎnjing bù hǎo.', meaning: 'Nhìn máy tính lâu không tốt cho mắt.' }
  },

  // === HSK 2: GIA ĐÌNH MỞ RỘNG & QUAN HỆ ===
  {
    hanzi: '哥哥', pinyin: 'gēge', hanviet: 'Ca Ca', meaning: 'Anh trai',
    level: 'HSK 2', topic: 'Gia đình', radical: '口 (Khẩu)', strokes: 10,
    mnemonic: 'Hai chữ khả (可) xếp chồng chỉ người anh trưởng thành.',
    example: { hanzi: '我哥哥在河内当软件工程师。', pinyin: 'Wǒ gēge zài Hénèi dāng ruǎnjiàn gōngchéngshī.', meaning: 'Anh trai tôi làm kỹ sư phần mềm ở Hà Nội.' }
  },
  {
    hanzi: '姐姐', pinyin: 'jiějie', hanviet: 'Tỉ Tỉ', meaning: 'Chị gái',
    level: 'HSK 2', topic: 'Gia đình', radical: '女 (Nữ)', strokes: 16,
    mnemonic: 'Người phụ nữ (女) nết na thùy mị trong nhà.',
    example: { hanzi: '姐姐买了一件漂亮的大衣。', pinyin: 'Jiějie mǎi le yí jiàn piàoliang de dàyī.', meaning: 'Chị gái đã mua một chiếc áo khoác rất đẹp.' }
  },
  {
    hanzi: '弟弟', pinyin: 'dìdi', hanviet: 'Đệ Đệ', meaning: 'Em trai',
    level: 'HSK 2', topic: 'Gia đình', radical: '弓 (Cung)', strokes: 14,
    mnemonic: 'Hình ảnh em nhỏ đeo cung tên chạy nhảy vui vẻ.',
    example: { hanzi: '我的弟弟今年读高中一年级。', pinyin: 'Wǒ de dìdi jīnnián dú gāozhōng yī niánjí.', meaning: 'Em trai tôi năm nay học lớp 10.' }
  },
  {
    hanzi: '妹妹', pinyin: 'mèimei', hanviet: 'Muội Muội', meaning: 'Em gái',
    level: 'HSK 2', topic: 'Gia đình', radical: '女 (Nữ)', strokes: 16,
    mnemonic: 'Bé gái (女) sinh sau cùng chưa trưởng thành (未).',
    example: { hanzi: '妹妹最喜欢吃草莓蛋糕。', pinyin: 'Mèimei zuì xǐhuan chī cǎoméi dàngāo.', meaning: 'Em gái thích ăn bánh gato dâu tây nhất.' }
  },
  {
    hanzi: '丈夫', pinyin: 'zhàngfu', hanviet: 'Trượng phu', meaning: 'Người chồng',
    level: 'HSK 2', topic: 'Gia đình', radical: '一 (Nhất)', strokes: 7,
    mnemonic: 'Người trượng phu gánh vác việc gia đình trụ cột.',
    example: { hanzi: '她的丈夫是一名大学教授。', pinyin: 'Tā de zhàngfu shì yì míng dàxué jiàoshòu.', meaning: 'Chồng cô ấy là giáo sư đại học.' }
  },
  {
    hanzi: '妻子', pinyin: 'qīzi', hanviet: 'Thê tử', meaning: 'Người vợ',
    level: 'HSK 2', topic: 'Gia đình', radical: '女 (Nữ)', strokes: 11,
    mnemonic: 'Người phụ nữ hiền thục vun vén tổ ấm gia đình.',
    example: { hanzi: '李先生和他的妻子感情非常好。', pinyin: 'Lǐ xiānsheng hé tā de qīzi gǎnqíng fēicháng hǎo.', meaning: 'Ông Lý và vợ tình cảm rất mặn nồng.' }
  },
  {
    hanzi: '孩子', pinyin: 'háizi', hanviet: 'Hài tử', meaning: 'Trẻ con, con cái',
    level: 'HSK 2', topic: 'Gia đình', radical: '子 (Tử)', strokes: 12,
    mnemonic: 'Đứa trẻ con ngây thơ trong sáng của gia đình.',
    example: { hanzi: '公园里有很多孩子在快乐地玩耍。', pinyin: 'Gōngyuán lǐ yǒu hěn duō háizi zài kuàilè de wánshuǎ.', meaning: 'Trong công viên có rất nhiều trẻ em đang vui chơi thỏa thích.' }
  },

  // === HSK 2: ĐỒ ĂN THỨC UỐNG MỞ RỘNG ===
  {
    hanzi: '咖啡', pinyin: 'kāfēi', hanviet: 'Cà phê', meaning: 'Cà phê',
    level: 'HSK 2', topic: 'Ăn uống', radical: '口 (Khẩu)', strokes: 16,
    mnemonic: 'Đồ uống dùng miệng (口) nhâm nhi từng ngụm đượm đà.',
    example: { hanzi: '你想喝热咖啡还是冰咖啡？', pinyin: 'Nǐ xiǎng hē rè kāfēi háishi bīng kāfēi?', meaning: 'Bạn muốn uống cà phê nóng hay cà phê đá?' }
  },
  {
    hanzi: '牛奶', pinyin: 'niúnǎi', hanviet: 'Ngưu nãi', meaning: 'Sữa bò, sữa tươi',
    level: 'HSK 2', topic: 'Ăn uống', radical: '牛 (Ngưu)', strokes: 9,
    mnemonic: 'Dòng sữa bổ dưỡng (奶) vắt từ con bò sữa (牛).',
    example: { hanzi: '睡前喝一杯温牛奶有助于睡眠。', pinyin: 'Shuì qián hē yì bēi wēn niúnǎi yǒu zhù yú shuìmián.', meaning: 'Trước khi ngủ uống một ly sữa ấm giúp ngủ ngon.' }
  },
  {
    hanzi: '鸡蛋', pinyin: 'jīdàn', hanviet: 'Kê đản', meaning: 'Trứng gà',
    level: 'HSK 2', topic: 'Ăn uống', radical: '鸟 (Điểu)', strokes: 18,
    mnemonic: 'Quả trứng (蛋) do con gà mái (鸡) đẻ ra.',
    example: { hanzi: '早餐我吃了一个鸡蛋和两片面包。', pinyin: 'Zǎocān wǒ chī le yí gè jīdàn hé liǎng piàn miànbāo.', meaning: 'Bữa sáng tôi ăn một quả trứng gà và hai lát bánh mì.' }
  },
  {
    hanzi: '西瓜', pinyin: 'xīguā', hanviet: 'Tây qua', meaning: 'Dưa hấu',
    level: 'HSK 2', topic: 'Ăn uống', radical: '瓜 (Qua)', strokes: 11,
    mnemonic: 'Giống dưa thơm ngọt (瓜) du nhập từ phương Tây (西).',
    example: { hanzi: '夏天吃冰镇西瓜真是太解渴了！', pinyin: 'Xiàtiān chī bīngzhèn xīguā zhēn shì tài jiěkě le!', meaning: 'Mùa hè ăn dưa hấu ướp lạnh thật là đã khát!' }
  },
  {
    hanzi: '羊肉', pinyin: 'yángròu', hanviet: 'Dương nhục', meaning: 'Thịt dê, thịt cừu',
    level: 'HSK 2', topic: 'Ăn uống', radical: '肉 (Nhục)', strokes: 12,
    mnemonic: 'Thịt (肉) của con cừu con dê thơm nức mũi.',
    example: { hanzi: '冬天吃热腾腾的羊肉火锅最过瘾。', pinyin: 'Dōngtiān chī rètēngtēng de yángròu huǒguō zuì guòyǐn.', meaning: 'Mùa đông ăn lẩu thịt cừu nóng hổi là tuyệt nhất.' }
  },
  {
    hanzi: '鱼', pinyin: 'yú', hanviet: 'Ngư', meaning: 'Con cá',
    level: 'HSK 2', topic: 'Ăn uống', radical: '鱼 (Ngư)', strokes: 8,
    mnemonic: 'Hình dáng con cá bơi lội với vảy và đuôi cá.',
    example: { hanzi: '年年有余，过年中国人都吃鱼。', pinyin: 'Niánnián yǒu yú, guònián Zhōngguó rén dōu chī yú.', meaning: 'Năm nào cũng dư dả, ngày tết người TQ đều ăn cá.' }
  },

  // === HSK 2: MÀU SẮC, TÍNH CHẤT & ĐỐI LẬP ===
  {
    hanzi: '颜色', pinyin: 'yánsè', hanviet: 'Nhan sắc', meaning: 'Màu sắc',
    level: 'HSK 2', topic: 'Màu sắc', radical: '色 (Sắc)', strokes: 21,
    mnemonic: 'Sắc thái khuôn mặt (颜) phản ánh vẻ rạng ngời (色).',
    example: { hanzi: '你最喜欢什么颜色？', pinyin: 'Nǐ zuì xǐhuan shénme yánsè?', meaning: 'Bạn thích màu sắc nào nhất?' }
  },
  {
    hanzi: '红', pinyin: 'hóng', hanviet: 'Hồng', meaning: 'Màu đỏ',
    level: 'HSK 2', topic: 'Màu sắc', radical: '纟(Mịch)', strokes: 6,
    mnemonic: 'Sợi tơ (纟) nhuộm màu đỏ thắm may mắn.',
    example: { hanzi: '中国人在新年喜欢穿红色的衣服。', pinyin: 'Zhōngguó rén zài xīnnián xǐhuan chuān hóngsè de yīfu.', meaning: 'Người TQ thích mặc đồ đỏ trong dịp năm mới.' }
  },
  {
    hanzi: '白', pinyin: 'bái', hanviet: 'Bạch', meaning: 'Màu trắng',
    level: 'HSK 2', topic: 'Màu sắc', radical: '白 (Bạch)', strokes: 5,
    mnemonic: 'Ánh nắng mặt trời tinh khôi trong trẻo.',
    example: { hanzi: '天空中飘着几朵洁白的云。', pinyin: 'Tiānkōng zhōng piāo zhe jǐ duǒ jiébái de yún.', meaning: 'Trên bầu trời trôi vài đám mây trắng xóa.' }
  },
  {
    hanzi: '黑', pinyin: 'hēi', hanviet: 'Hắc', meaning: 'Màu đen',
    level: 'HSK 2', topic: 'Màu sắc', radical: '黑 (Hắc)', strokes: 12,
    mnemonic: 'Khói than bốc lên bám đen muội lửa (灬).',
    example: { hanzi: '我有一只黑白相间的小花猫。', pinyin: 'Wǒ yǒu yì zhī hēi bái xiāngjiàn de xiǎohuāmāo.', meaning: 'Tôi có một chú mèo hoa khoang đen trắng.' }
  },
  {
    hanzi: '贵', pinyin: 'guì', hanviet: 'Quý', meaning: 'Đắt đỏ, quý giá',
    level: 'HSK 2', topic: 'Mua sắm', radical: '贝 (Bối)', strokes: 9,
    mnemonic: 'Vỏ sò tiền cổ (贝) quý hiếm có giá trị cao.',
    example: { hanzi: '这件外套太贵了，有没有便宜一点儿的？', pinyin: 'Zhè jiàn wàitào tài guì le, yǒu méiyǒu piányi yìdiǎnr de?', meaning: 'Cái áo khoác này đắt quá, có cái nào rẻ hơn chút không?' }
  },
  {
    hanzi: '便宜', pinyin: 'piányi', hanviet: 'Tiện nghi', meaning: 'Rẻ, giá rẻ',
    level: 'HSK 2', topic: 'Mua sắm', radical: '亻 (Nhân đứng)', strokes: 20,
    mnemonic: 'Tiện lợi (便) thích hợp (宜) cho túi tiền người mua.',
    example: { hanzi: '超市里的蔬菜今天大减价，非常便宜。', pinyin: 'Chāoshì lǐ de shūcài jīntiān dà jiǎnjià, fēicháng piányi.', meaning: 'Rau trong siêu thị hôm nay giảm giá lớn, rất rẻ.' }
  },
  {
    hanzi: '新', pinyin: 'xīn', hanviet: 'Tân', meaning: 'Mới',
    level: 'HSK 2', topic: 'Tính từ', radical: '斤 (Cân)', strokes: 13,
    mnemonic: 'Cây gỗ (木) mới đốn hạ thơm mùi nhựa mới.',
    example: { hanzi: '新年快乐，万事如意！', pinyin: 'Xīnnián kuàilè, wànshì rúyì!', meaning: 'Chúc mừng năm mới, vạn sự như ý!' }
  },
  {
    hanzi: '快', pinyin: 'kuài', hanviet: 'Khoái', meaning: 'Nhanh, mau',
    level: 'HSK 2', topic: 'Tính từ', radical: '忄(Tâm đứng)', strokes: 7,
    mnemonic: 'Nhịp tim (忄) đập nhanh thoăn thoắt dứt khoát.',
    example: { hanzi: '高铁的速度非常快。', pinyin: 'Gāotiě de sùdù fēicháng kuài.', meaning: 'Tốc độ của tàu cao tốc rất nhanh.' }
  },
  {
    hanzi: '慢', pinyin: 'màn', hanviet: 'Mạn', meaning: 'Chậm chạp',
    level: 'HSK 2', topic: 'Tính từ', radical: '忄(Tâm đứng)', strokes: 14,
    mnemonic: 'Thong dong từ tốn từng bước một không vội vã.',
    example: { hanzi: '请走慢一点儿，等等我。', pinyin: 'Qǐng zǒu màn yìdiǎnr, děngdeng wǒ.', meaning: 'Xin hãy đi chậm một chút, chờ tôi với.' }
  },
  {
    hanzi: '远', pinyin: 'yuǎn', hanviet: 'Viễn', meaning: 'Xa xôi',
    level: 'HSK 2', topic: 'Phương hướng', radical: '辶 (Sước)', strokes: 7,
    mnemonic: 'Bước chân (辶) đi biền biệt vạn dặm xa xôi.',
    example: { hanzi: '我家离学校不太远，骑车十分钟就到了。', pinyin: 'Wǒ jiā lí xuéxiào bú tài yuǎn, qí chē shí fēnzhōng jiù dào le.', meaning: 'Nhà tôi cách trường không xa lắm, đi xe 10 phút là tới.' }
  },
  {
    hanzi: '近', pinyin: 'jìn', hanviet: 'Cận', meaning: 'Gần gũi',
    level: 'HSK 2', topic: 'Phương hướng', radical: '辶 (Sước)', strokes: 7,
    mnemonic: 'Chỉ cách vài chiếc rìu (斤) là bước chân tới nơi.',
    example: { hanzi: '超市离这里很近，就在路口拐角处。', pinyin: 'Chāoshì lí zhèlǐ hěn jìn, jiù zài lùkǒu guǎijiǎo chù.', meaning: 'Siêu thị ở rất gần đây, ngay góc ngã rẽ.' }
  },
  {
    hanzi: '累', pinyin: 'lèi', hanviet: 'Luy', meaning: 'Mệt mỏi',
    level: 'HSK 2', topic: 'Cảm xúc', radical: '糸 (Mịch)', strokes: 11,
    mnemonic: 'Làm việc cày cấy trên đồng ruộng (田) tốn nhiều sức lực mệt nhoài.',
    example: { hanzi: '今天工作了一整天，我好累啊。', pinyin: 'Jīntiān gōngzuò le yì zhěng tiān, wǒ hǎo lèi a.', meaning: 'Hôm nay làm việc cả ngày, tôi mệt quá chừng.' }
  },
  {
    hanzi: '错', pinyin: 'cuò', hanviet: 'Thác', meaning: 'Sai, nhầm lẫn',
    level: 'HSK 2', topic: 'Học tập', radical: '钅(Kim)', strokes: 13,
    mnemonic: 'Khai thác kim loại xưa kia (昔) không tránh khỏi sai sót.',
    example: { hanzi: '这道题你做错了，请再仔细算一遍。', pinyin: 'Zhè dào tí nǐ zuò cuò le, qǐng zài zǐxì suàn yí biàn.', meaning: 'Câu này bạn làm sai rồi, hãy tính kỹ lại lần nữa.' }
  },
  {
    hanzi: '对', pinyin: 'duì', hanviet: 'Đối', meaning: 'Đúng, đối với',
    level: 'HSK 2', topic: 'Học tập', radical: '寸 (Thốn)', strokes: 5,
    mnemonic: 'Đo đạc đúng từng tấc (寸) chuẩn xác không sai lệch.',
    example: { hanzi: '你说得很对，我完全同意。', pinyin: 'Nǐ shuō de hěn duì, wǒ wánquán tóngyì.', meaning: 'Bạn nói rất đúng, tôi hoàn toàn đồng ý.' }
  },

  // === HSK 2: GIAO THÔNG & ĐỊA ĐIỂM ===
  {
    hanzi: '火车站', pinyin: 'huǒchēzhàn', hanviet: 'Hỏa xa trạm', meaning: 'Ga xe lửa, ga tàu',
    level: 'HSK 2', topic: 'Du lịch', radical: '立 (Lập)', strokes: 19,
    mnemonic: 'Trạm dừng chân (站) của những đoàn tàu hỏa (火车).',
    example: { hanzi: '请问去火车站怎么走？', pinyin: 'Qǐngwèn qù huǒchēzhàn zěnme zǒu?', meaning: 'Xin hỏi đến ga tàu hỏa đi thế nào?' }
  },
  {
    hanzi: '机场', pinyin: 'jīchǎng', hanviet: 'Cơ trường', meaning: 'Sân bay, phi trường',
    level: 'HSK 2', topic: 'Du lịch', radical: '土 (Thổ)', strokes: 12,
    mnemonic: 'Khu đất bãi rộng lớn (场) cho máy bay (机) cất cánh.',
    example: { hanzi: '我下午要去机场接一位中国朋友。', pinyin: 'Wǒ xiàwǔ yào qù jīchǎng jiē yí wèi Zhōngguó péngyou.', meaning: 'Chiều nay tôi phải ra sân bay đón một người bạn TQ.' }
  },
  {
    hanzi: '公共汽车', pinyin: 'gōnggòng qìchē', hanviet: 'Công cộng khí xa', meaning: 'Xe buýt công cộng',
    level: 'HSK 2', topic: 'Du lịch', radical: '车 (Xa)', strokes: 26,
    mnemonic: 'Phương tiện xe hơi (汽车) phục vụ chung cho cộng đồng (公共).',
    example: { hanzi: '坐公共汽车去学校非常方便省钱。', pinyin: 'Zuò gōnggòng qìchē qù xuéxiào fēicháng fāngbiàn shěngqián.', meaning: 'Đi xe buýt tới trường rất thuận tiện và tiết kiệm.' }
  },
  {
    hanzi: '路', pinyin: 'lù', hanviet: 'Lộ', meaning: 'Đường, con đường',
    level: 'HSK 2', topic: 'Giao thông', radical: '足 (Túc)', strokes: 13,
    mnemonic: 'Bàn chân (足) cất bước đi tới các ngả đường.',
    example: { hanzi: '这条路上的车很多，过马路要小心。', pinyin: 'Zhè tiáo lù shang de chē hěn duō, guò mǎlù yào xiǎoxīn.', meaning: 'Đường này nhiều xe cộ lắm, qua đường nhớ cẩn thận.' }
  },
  {
    hanzi: '门', pinyin: 'mén', hanviet: 'Môn', meaning: 'Cửa, cổng',
    level: 'HSK 2', topic: 'Đời sống', radical: '门 (Môn)', strokes: 3,
    mnemonic: 'Hình dáng cánh cổng lớn hai cánh mở ra.',
    example: { hanzi: '我们在学校大门前集合。', pinyin: 'Wǒmen zài xuéxiào dàmén qián jíhé.', meaning: 'Chúng ta tập trung trước cổng lớn của trường học.' }
  },
  {
    hanzi: '开始', pinyin: 'kāishǐ', hanviet: 'Khai thủy', meaning: 'Bắt đầu, khởi đầu',
    level: 'HSK 2', topic: 'Hành động', radical: '女 (Nữ)', strokes: 12,
    mnemonic: 'Mở ra (开) bước khởi đầu ban sơ (始).',
    example: { hanzi: '电影马上就要开始了。', pinyin: 'Diànyǐng mǎshàng jiù yào kāishǐ le.', meaning: 'Bộ phim sắp bắt đầu rồi.' }
  },
  {
    hanzi: '准备', pinyin: 'zhǔnbèi', hanviet: 'Chuẩn bị', meaning: 'Chuẩn bị, sẵn sàng',
    level: 'HSK 2', topic: 'Học tập', radical: '氵(Chấm thủy)', strokes: 17,
    mnemonic: 'Chuẩn mực đầy đủ (准) sẵn sàng phòng bị chu đáo (备).',
    example: { hanzi: '我已经准备好明天的HSK考试了。', pinyin: 'Wǒ yǐjīng zhǔnbèi hǎo míngtiān de HSK kǎoshì le.', meaning: 'Tôi đã chuẩn bị sẵn sàng cho kỳ thi HSK ngày mai rồi.' }
  },
  {
    hanzi: '考试', pinyin: 'kǎoshì', hanviet: 'Khảo thí', meaning: 'Thi cử, kiểm tra',
    level: 'HSK 2', topic: 'Trường học', radical: '讠(Ngôn)', strokes: 14,
    mnemonic: 'Khảo sát năng lực (考) qua các câu hỏi làm bài (试).',
    example: { hanzi: '下个星期一我们要进行期中考试。', pinyin: 'Xià gè xīngqīyī wǒmen yào jìnxíng qīzhōng kǎoshì.', meaning: 'Thứ hai tuần sau chúng tôi sẽ thi giữa kỳ.' }
  },
  {
    hanzi: '懂', pinyin: 'dǒng', hanviet: 'Đổng', meaning: 'Hiểu, thông suốt',
    level: 'HSK 2', topic: 'Học tập', radical: '忄(Tâm đứng)', strokes: 15,
    mnemonic: 'Trái tim và trí óc (忄) lĩnh hội thấu suốt vấn đề.',
    example: { hanzi: '老师讲的语法你听懂了吗？', pinyin: 'Lǎoshī jiǎng de yǔfǎ nǐ tīngdǒng le ma?', meaning: 'Ngữ pháp cô giáo giảng bạn đã nghe hiểu chưa?' }
  },
  {
    hanzi: '介绍', pinyin: 'jièshào', hanviet: 'Giới thiệu', meaning: 'Giới thiệu, mai mối',
    level: 'HSK 2', topic: 'Giao tiếp', radical: '纟(Mịch)', strokes: 12,
    mnemonic: 'Kết nối sợi tơ duyên (绍) làm cầu nối trung gian (介).',
    example: { hanzi: '请允许我向大家介绍一下我们的新老师。', pinyin: 'Qǐng yǔnxǔ wǒ xiàng dàjiā jièshào yíxià wǒmen de xīn lǎoshī.', meaning: 'Xin phép cho tôi giới thiệu với mọi người giáo viên mới của chúng ta.' }
  },

  // === HSK 3: TỪ VỰNG TRUNG CẤP THỰC CHIẾN ===
  {
    hanzi: '方便', pinyin: 'fāngbiàn', hanviet: 'Phương tiện', meaning: 'Thuận tiện, tiện lợi',
    level: 'HSK 3', topic: 'Đời sống', radical: '亻 (Nhân đứng)', strokes: 13,
    mnemonic: 'Mọi phương diện (方) đều dễ dàng và tiện lợi (便).',
    example: { hanzi: '在这里坐地铁非常方便。', pinyin: 'Zài zhèlǐ zuò dìtiě fēicháng fāngbiàn.', meaning: 'Đi tàu điện ngầm ở đây rất thuận tiện.' }
  },
  {
    hanzi: '简单', pinyin: 'jiǎndān', hanviet: 'Giản đơn', meaning: 'Đơn giản, dễ dàng',
    level: 'HSK 3', topic: 'Học tập', radical: '竹 (Trúc)', strokes: 20,
    mnemonic: 'Gọn gàng như thẻ tre đơn sơ mộc mạc.',
    example: { hanzi: '这个问题很简答，大家都能回答。', pinyin: 'Zhè ge wèntí hěn jiǎndān, dàjiā dōu néng huídá.', meaning: 'Câu hỏi này rất đơn giản, ai cũng có thể trả lời.' }
  },
  {
    hanzi: '认真', pinyin: 'rènzhēn', hanviet: 'Nhận chân', meaning: 'Chăm chỉ, nghiêm túc',
    level: 'HSK 3', topic: 'Học tập', radical: '讠(Ngôn)', strokes: 14,
    mnemonic: 'Nhận thức chân chính (真) làm việc hết mình.',
    example: { hanzi: '他学习汉语的态度非常认真。', pinyin: 'Tā xuéxí Hànyǔ de tàidu fēicháng rènzhēn.', meaning: 'Thái độ học tiếng Trung của anh ấy rất nghiêm túc.' }
  },
  {
    hanzi: '热情', pinyin: 'rèqíng', hanviet: 'Nhiệt tình', meaning: 'Nhiệt tình, nồng hậu',
    level: 'HSK 3', topic: 'Cảm xúc', radical: '灬 (Hỏa)', strokes: 21,
    mnemonic: 'Ngọn lửa nhiệt huyết (热) chan chứa tình cảm ấm áp (情).',
    example: { hanzi: '中国房东对我们非常热情友好。', pinyin: 'Zhōngguó fángdōng duì wǒmen fēicháng rèqíng yǒuhǎo.', meaning: 'Chủ nhà người Trung Quốc rất nhiệt tình và thân thiện với chúng tôi.' }
  },
  {
    hanzi: '努力', pinyin: 'nǔlì', hanviet: 'Nỗ lực', meaning: 'Cố gắng, nỗ lực',
    level: 'HSK 3', topic: 'Học tập', radical: '力 (Lực)', strokes: 9,
    mnemonic: 'Dốc hết tâm sức và sức lực (力) vươn lên thành công.',
    example: { hanzi: '只要努力，你一定能考过HSK 3。', pinyin: 'Zhǐyào nǔlì, nǐ yídìng néng kǎoguò HSK sān.', meaning: 'Chỉ cần nỗ lực, bạn nhất định sẽ thi đỗ HSK 3.' }
  },
  {
    hanzi: '聪明', pinyin: 'cōngming', hanviet: 'Thông minh', meaning: 'Thông minh, sáng dạ',
    level: 'HSK 3', topic: 'Tính từ', radical: '耳 (Nhĩ)', strokes: 22,
    mnemonic: 'Tai thính (聪) mắt tinh tường (明) hiểu biết sâu rộng.',
    example: { hanzi: '那个小男孩特别聪明伶俐。', pinyin: 'Nà ge xiǎonánhái tèbié cōngming línglì.', meaning: 'Cậu bé đó đặc biệt thông minh nhanh nhẹn.' }
  },
  {
    hanzi: '舒服', pinyin: 'shūfu', hanviet: 'Thư phục', meaning: 'Dễ chịu, thoải mái',
    level: 'HSK 3', topic: 'Cảm giác', radical: '舍 (Xá)', strokes: 16,
    mnemonic: 'Thư thái thong dong quần áo vừa vặn dễ chịu.',
    example: { hanzi: '洗完热水澡感觉很舒服。', pinyin: 'Xǐ wán rèshuǐzǎo gǎnjué hěn shūfu.', meaning: 'Tắm nước nóng xong cảm thấy rất dễ chịu.' }
  },
  {
    hanzi: '特别', pinyin: 'tèbié', hanviet: 'Đặc biệt', meaning: 'Đặc biệt, vô cùng',
    level: 'HSK 3', topic: 'Phó từ', radical: '牛 (Ngưu)', strokes: 17,
    mnemonic: 'Con trâu quý đặc biệt (特) phân biệt rạch ròi (别).',
    example: { hanzi: '今天河内的天气特别好。', pinyin: 'Jīntiān Hénèi de tiānqì tèbié hǎo.', meaning: 'Thời tiết Hà Nội hôm nay đặc biệt đẹp.' }
  },
  {
    hanzi: '马上', pinyin: 'mǎshàng', hanviet: 'Mã thượng', meaning: 'Ngay lập tức, tức thì',
    level: 'HSK 3', topic: 'Thời gian', radical: '马 (Mã)', strokes: 6,
    mnemonic: 'Ngồi ngay trên lưng ngựa phi nhanh đến nơi.',
    example: { hanzi: '请稍等，我马上就到！', pinyin: 'Qǐng shāoděng, wǒ mǎshàng jiù dào!', meaning: 'Xin chờ chút, tôi tới ngay đây!' }
  },
  {
    hanzi: '已经', pinyin: 'yǐjīng', hanviet: 'Dĩ kinh', meaning: 'Đã, rồi',
    level: 'HSK 3', topic: 'Phó từ', radical: '己 (Kỷ)', strokes: 11,
    mnemonic: 'Đã từng kinh qua (经) trải nghiệm trong dĩ vãng (已).',
    example: { hanzi: '我已经在河内生活了五年。', pinyin: 'Wǒ yǐjīng zài Hénèi shēnghuó le wǔ nián.', meaning: 'Tôi đã sinh sống ở Hà Nội được năm năm.' }
  },
  {
    hanzi: '经常', pinyin: 'jīngcháng', hanviet: 'Kinh thường', meaning: 'Thường xuyên, hay',
    level: 'HSK 3', topic: 'Phó từ', radical: '巾 (Khăn)', strokes: 19,
    mnemonic: 'Lặp đi lặp lại thành thông lệ thường ngày.',
    example: { hanzi: '周末我经常去图书馆借书。', pinyin: 'Zhōumò wǒ jīngcháng qù túshūguǎn jiè shū.', meaning: 'Cuối tuần tôi thường xuyên đến thư viện mượn sách.' }
  },
  {
    hanzi: '当然', pinyin: 'dāngrán', hanviet: 'Đương nhiên', meaning: 'Đương nhiên, tất nhiên',
    level: 'HSK 3', topic: 'Phó từ', radical: '彐 (Kệ)', strokes: 18,
    mnemonic: 'Đương nhiên đúng với quy luật tự nhiên (然).',
    example: { hanzi: 'A: 你喜欢中国菜吗？ B: 当然喜欢！', pinyin: 'A: Nǐ xǐhuan Zhōngguó cài ma? B: Dāngrán xǐhuan!', meaning: 'A: Bạn thích món ăn Trung Quốc không? B: Đương nhiên là thích rồi!' }
  },
  {
    hanzi: '超市', pinyin: 'chāoshì', hanviet: 'Siêu thị', meaning: 'Siêu thị',
    level: 'HSK 3', topic: 'Mua sắm', radical: '走 (Tẩu)', strokes: 17,
    mnemonic: 'Thị trường mua bán quy mô vượt trội (超) sầm uất.',
    example: { hanzi: '超市里有各种各样的新鲜蔬菜。', pinyin: 'Chāoshì lǐ yǒu gèzhǒnggèyàng de xīnxiān shūcài.', meaning: 'Trong siêu thị có đủ các loại rau tươi.' }
  },
  {
    hanzi: '银行', pinyin: 'yínháng', hanviet: 'Ngân hàng', meaning: 'Ngân hàng',
    level: 'HSK 3', topic: 'Đời sống', radical: '钅(Kim)', strokes: 17,
    mnemonic: 'Nơi lưu thông tiền bạc bạc trắng (银) của ngành tài chính (行).',
    example: { hanzi: '我想去中国银行换点人民币。', pinyin: 'Wǒ xiǎng qù Zhōngguó Yínháng huàn diǎn Rénmínbì.', meaning: 'Tôi muốn đến Ngân hàng Trung Quốc đổi ít tiền Nhân dân tệ.' }
  },
  {
    hanzi: '洗手间', pinyin: 'xǐshǒujiān', hanviet: 'Tẩy thủ gian', meaning: 'Nhà vệ sinh, phòng rửa tay',
    level: 'HSK 3', topic: 'Đời sống', radical: '氵(Chấm thủy)', strokes: 20,
    mnemonic: 'Căn phòng (间) chuyên dùng để rửa tay (洗手) giữ gìn vệ sinh.',
    example: { hanzi: '请问洗手间在哪儿？', pinyin: 'Qǐngwèn xǐshǒujiān zài nǎr?', meaning: 'Xin hỏi nhà vệ sinh ở đâu ạ?' }
  }
];

// Helper to remove duplicates in dataset itself
const uniqueMap = new Map();
FULL_VOCABULARY_DATA.forEach(v => {
  if (!uniqueMap.has(v.hanzi)) {
    uniqueMap.set(v.hanzi, v);
  }
});
export const DEDUPLICATED_VOCAB = Array.from(uniqueMap.values()).map((v, i) => ({
  id: i + 1,
  ...v
}));

console.log(`✅ Tổng số từ vựng chuẩn bị nạp: ${DEDUPLICATED_VOCAB.length} từ duy nhất (100% không trùng lặp)`);
