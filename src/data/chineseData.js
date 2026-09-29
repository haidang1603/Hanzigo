// Comprehensive Chinese Learning Dataset tailored for Vietnamese Learners

export const ROADMAP_LEVELS = [
  {
    id: 'intro',
    code: 'NM',
    level: 'Nhập môn',
    stage: 'Sơ cấp',
    title: 'Phát âm Pinyin & Quy tắc nét bút',
    description: 'Nền tảng vững chắc về 23 thanh mẫu, 24 vận mẫu, 4 thanh điệu chuẩn Bắc Kinh và 8 nét cơ bản chữ Hán.',
    target: 'Đọc chuẩn bất kỳ chữ Hán nào có pinyin và viết đúng quy tắc thuận bút.',
    vocabCount: 60,
    grammarPoints: ['Biến điệu chữ 一 (yī) và 不 (bù)', 'Biến điệu hai thanh 3', 'Quy tắc viết pinyin dấu ngắt âm'],
    skills: ['Phát âm không ngọng', 'Gõ tiếng Trung trên điện thoại/máy tính', 'Nhận diện 20 bộ thủ phổ biến'],
    color: '#45B97C'
  },
  {
    id: 'hsk1',
    code: 'HSK 1',
    level: 'Cơ bản',
    stage: 'Sơ cấp',
    title: 'Giao tiếp hàng ngày & 150 từ vựng',
    description: 'Chào hỏi, giới thiệu bản thân, số đếm, ngày giờ, gia đình, sở thích và các câu giao tiếp sinh hoạt quen thuộc.',
    target: 'Hiểu và sử dụng được các cụm từ, câu đơn giản nhất để giao tiếp trong đời sống.',
    vocabCount: 150,
    grammarPoints: ['Cấu trúc câu chữ 是', 'Câu hỏi đuôi 吗', 'Đại từ nghi vấn 什么, 谁, 哪儿', 'Trợ từ sở hữu 的'],
    skills: ['Tự giới thiệu bản thân trôi chảy', 'Đi chợ mua đồ & thanh toán cơ bản', 'Hỏi và trả lời ngày giờ'],
    color: '#E85D3F'
  },
  {
    id: 'hsk2',
    code: 'HSK 2',
    level: 'Sơ cấp',
    stage: 'Sơ cấp',
    title: 'Sinh hoạt & Mua sắm 300 từ',
    description: 'Mô tả sinh hoạt hàng ngày, ăn uống tại quán ăn, đi lại bằng phương tiện công cộng, hỏi đường và thời tiết.',
    target: 'Giao tiếp đơn giản và trực tiếp trong các tình huống thường nhật quen thuộc.',
    vocabCount: 300,
    grammarPoints: ['Câu so sánh 比', 'Động từ năng nguyện 想, 要, 会', 'Trợ từ trạng thái 了 (hoàn thành)', 'Câu liên động'],
    skills: ['Đi taxi và hỏi đường chi tiết', 'Gọi món tại nhà hàng Trung Hoa', 'Mặc cả và mua sắm cơ bản'],
    color: '#F4B942'
  },
  {
    id: 'hsk3',
    code: 'HSK 3',
    level: 'Trung cấp 1',
    stage: 'Trung cấp',
    title: 'Giao tiếp công việc & Du lịch 600 từ',
    description: 'Hoàn thành các chuyến du lịch tự túc, trao đổi công việc cơ bản, viết email ngắn và giải quyết tình huống phát sinh.',
    target: 'Tự tin du lịch Trung Quốc không cần phiên dịch, giao tiếp công sở căn bản.',
    vocabCount: 600,
    grammarPoints: ['Câu chữ 把', 'Câu chữ 被 (bị động)', 'Cặp liên từ 虽然...但是...', 'Bổ ngữ kết quả & xu hướng'],
    skills: ['Tự đặt vé máy bay & phòng khách sạn', 'Trao đổi thương mại đơn giản trên Taobao/1688', 'Thuyết trình ngắn 3-5 phút'],
    color: '#3B82F6'
  },
  {
    id: 'hsk4',
    code: 'HSK 4',
    level: 'Trung cấp 2',
    stage: 'Trung cấp',
    title: 'Thảo luận chuyên sâu 1200 từ',
    description: 'Bàn luận về các chủ đề văn hóa, kinh tế, xã hội; xem phim không cần phụ đề tiếng Việt và đàm phán hợp đồng sơ cấp.',
    target: 'Đạt chuẩn đầu vào đại học tại Trung Quốc hoặc ứng tuyển công ty đa quốc gia.',
    vocabCount: 1200,
    grammarPoints: ['Liên từ phức hợp', 'Bổ ngữ khả năng', 'Câu phản vấn', 'Cấu trúc nhấn mạnh 是...的'],
    skills: ['Đọc hiểu tin tức tiếng Trung', 'Soạn thảo email thương mại chuyên nghiệp', 'Phỏng vấn xin việc tiếng Trung'],
    color: '#8B5CF6'
  },
  {
    id: 'hsk5-6',
    code: 'HSK 5-6',
    level: 'Cao cấp',
    stage: 'Cao cấp',
    title: 'Làm chủ ngôn ngữ 2500+ từ',
    description: 'Đọc hiểu báo chí tài chính, văn học, thuyết trình kinh doanh, hiểu sâu thành ngữ (Thành ngữ 4 chữ 成语) và đàm phán cấp cao.',
    target: 'Sử dụng tiếng Trung nhuần nhuyễn như người bản xứ, dịch thuật và đàm phán chuyên sâu.',
    vocabCount: 2500,
    grammarPoints: ['Thành ngữ cổ điển', 'Cấu trúc tu từ nâng cao', 'Văn phong văn ngôn & viết học thuật'],
    skills: ['Đàm phán hợp đồng kinh tế lớn', 'Dịch cabin & biên dịch văn bản', 'Thuyết trình trước hội nghị quốc tế'],
    color: '#EC4899'
  }
];

export const VOCABULARY_LIST = [
  {
    "id": 1,
    "hanzi": "我",
    "pinyin": "wǒ",
    "hanviet": "Ngã",
    "meaning": "Tôi, mình, ta",
    "level": "HSK 1",
    "topic": "Đại từ",
    "radical": "戈 (Qua)",
    "strokes": 7,
    "mnemonic": "Tay (手) cầm vũ khí (戈) tự vệ khẳng định cái tôi (我).",
    "example": {
      "hanzi": "我是越南人。",
      "pinyin": "Wǒ shì Yuènán rén.",
      "meaning": "Tôi là người Việt Nam."
    }
  },
  {
    "id": 2,
    "hanzi": "你",
    "pinyin": "nǐ",
    "hanviet": "Nhĩ",
    "meaning": "Bạn, anh, chị (ngôi thứ 2)",
    "level": "HSK 1",
    "topic": "Đại từ",
    "radical": "亻 (Nhân đứng)",
    "strokes": 7,
    "mnemonic": "Người (亻) đối diện trò chuyện cùng ngươi (尔).",
    "example": {
      "hanzi": "你好！很高兴认识你。",
      "pinyin": "Nǐ hǎo! Hěn gāoxìng rènshi nǐ.",
      "meaning": "Xin chào! Rất vui được quen biết bạn."
    }
  },
  {
    "id": 3,
    "hanzi": "他",
    "pinyin": "tā",
    "hanviet": "Tha",
    "meaning": "Anh ấy, cậu ấy, ông ấy",
    "level": "HSK 1",
    "topic": "Đại từ",
    "radical": "亻 (Nhân đứng)",
    "strokes": 5,
    "mnemonic": "Người (亻) đứng bên cạnh chữ Dã (也 - cũng).",
    "example": {
      "hanzi": "他是我的大学同学。",
      "pinyin": "Tā shì wǒ de dàxué tóngxué.",
      "meaning": "Anh ấy là bạn học đại học của tôi."
    }
  },
  {
    "id": 4,
    "hanzi": "她",
    "pinyin": "tā",
    "hanviet": "Tha",
    "meaning": "Cô ấy, bà ấy, chị ấy",
    "level": "HSK 1",
    "topic": "Đại từ",
    "radical": "女 (Nữ)",
    "strokes": 6,
    "mnemonic": "Người phụ nữ (女) duyên dáng bên cạnh (也).",
    "example": {
      "hanzi": "她也是一名优秀的老师。",
      "pinyin": "Tā yě shì yì míng yōuxiù de lǎoshī.",
      "meaning": "Cô ấy cũng là một giáo viên xuất sắc."
    }
  },
  {
    "id": 5,
    "hanzi": "我们",
    "pinyin": "wǒmen",
    "hanviet": "Ngã môn",
    "meaning": "Chúng tôi, chúng ta",
    "level": "HSK 1",
    "topic": "Đại từ",
    "radical": "亻 (Nhân đứng)",
    "strokes": 12,
    "mnemonic": "Nhiều người đứng cạnh cổng (门) tạo thành số nhiều.",
    "example": {
      "hanzi": "我们一起去图书馆吧。",
      "pinyin": "Wǒmen yìqǐ qù túshūguǎn ba.",
      "meaning": "Chúng ta cùng đi thư viện nhé."
    }
  },
  {
    "id": 6,
    "hanzi": "这",
    "pinyin": "zhè",
    "hanviet": "Giá",
    "meaning": "Đây, này",
    "level": "HSK 1",
    "topic": "Đại từ",
    "radical": "辶 (Sước)",
    "strokes": 7,
    "mnemonic": "Chữ Văn (文) kết hợp bộ quai sước (辶) chỉ vật ở gần bước chân.",
    "example": {
      "hanzi": "这是什么书？",
      "pinyin": "Zhè shì shénme shū?",
      "meaning": "Đây là sách gì?"
    }
  },
  {
    "id": 7,
    "hanzi": "那",
    "pinyin": "nà",
    "hanviet": "Na",
    "meaning": "Kia, đó",
    "level": "HSK 1",
    "topic": "Đại từ",
    "radical": "阝(Ấp)",
    "strokes": 6,
    "mnemonic": "Chỉ về phía vùng đất (阝) xa xôi đằng kia.",
    "example": {
      "hanzi": "那是我的汉语老师。",
      "pinyin": "Nà shì wǒ de Hànyǔ lǎoshī.",
      "meaning": "Kia là cô giáo tiếng Trung của tôi."
    }
  },
  {
    "id": 8,
    "hanzi": "哪",
    "pinyin": "nǎ",
    "hanviet": "Nả",
    "meaning": "Nào, đâu",
    "level": "HSK 1",
    "topic": "Nghi vấn",
    "radical": "口 (Khẩu)",
    "strokes": 9,
    "mnemonic": "Mở miệng (口) hỏi xem người đó ở đâu (那).",
    "example": {
      "hanzi": "你是哪国人？",
      "pinyin": "Nǐ shì nǎ guó rén?",
      "meaning": "Bạn là người nước nào?"
    }
  },
  {
    "id": 9,
    "hanzi": "谁",
    "pinyin": "shéi",
    "hanviet": "Thùy",
    "meaning": "Ai",
    "level": "HSK 1",
    "topic": "Nghi vấn",
    "radical": "讠(Ngôn)",
    "strokes": 10,
    "mnemonic": "Dùng lời nói (讠) cất tiếng hỏi con chim nhỏ (隹) là ai.",
    "example": {
      "hanzi": "他是谁？",
      "pinyin": "Tā shì shéi?",
      "meaning": "Anh ấy là ai?"
    }
  },
  {
    "id": 10,
    "hanzi": "什么",
    "pinyin": "shénme",
    "hanviet": "Thập ma",
    "meaning": "Cái gì",
    "level": "HSK 1",
    "topic": "Nghi vấn",
    "radical": "亻 (Nhân đứng)",
    "strokes": 7,
    "mnemonic": "Người (亻) thắc mắc chuyện gì đang diễn ra.",
    "example": {
      "hanzi": "你在看什么？",
      "pinyin": "Nǐ zài kàn shénme?",
      "meaning": "Bạn đang xem cái gì vậy?"
    }
  },
  {
    "id": 11,
    "hanzi": "几",
    "pinyin": "jǐ",
    "hanviet": "Kỷ",
    "meaning": "Mấy, vài (dưới 10)",
    "level": "HSK 1",
    "topic": "Nghi vấn",
    "radical": "几 (Kỷ)",
    "strokes": 2,
    "mnemonic": "Hình chiếc bàn nhỏ đếm được vài ba đồ vật.",
    "example": {
      "hanzi": "你有几个中国朋友？",
      "pinyin": "Nǐ yǒu jǐ gè Zhōngguó péngyou?",
      "meaning": "Bạn có mấy người bạn Trung Quốc?"
    }
  },
  {
    "id": 12,
    "hanzi": "怎么",
    "pinyin": "zěnme",
    "hanviet": "Chẩm ma",
    "meaning": "Như thế nào, sao lại",
    "level": "HSK 1",
    "topic": "Nghi vấn",
    "radical": "心 (Tâm)",
    "strokes": 12,
    "mnemonic": "Trái tim (心) băn khoăn suy nghĩ cách giải quyết.",
    "example": {
      "hanzi": "去火车站怎么走？",
      "pinyin": "Qù huǒchēzhàn zěnme zǒu?",
      "meaning": "Đi ga xe lửa thì đi thế nào?"
    }
  },
  {
    "id": 13,
    "hanzi": "怎么样",
    "pinyin": "zěnmeyàng",
    "hanviet": "Chẩm ma dạng",
    "meaning": "Thế nào, ra sao",
    "level": "HSK 1",
    "topic": "Nghi vấn",
    "radical": "木 (Mộc)",
    "strokes": 21,
    "mnemonic": "Hỏi thăm hình dáng (样) và cảm nhận của đối phương.",
    "example": {
      "hanzi": "今天天气怎么样？",
      "pinyin": "Jīntiān tiānqì zěnmeyàng?",
      "meaning": "Thời tiết hôm nay thế nào?"
    }
  },
  {
    "id": 14,
    "hanzi": "你好",
    "pinyin": "nǐ hǎo",
    "hanviet": "Nhĩ Hảo",
    "meaning": "Xin chào",
    "level": "HSK 1",
    "topic": "Chào hỏi",
    "radical": "亻 (Nhân đứng)",
    "strokes": 7,
    "mnemonic": "Người (亻) chào bạn (尔), phụ nữ (女) sinh con trai (子) là điều tốt lành (好).",
    "example": {
      "hanzi": "你好！很高兴认识你。",
      "pinyin": "Nǐ hǎo! Hěn gāoxìng rènshi nǐ.",
      "meaning": "Xin chào! Rất vui được quen biết bạn."
    }
  },
  {
    "id": 15,
    "hanzi": "谢谢",
    "pinyin": "xièxie",
    "hanviet": "Tạ Tạ",
    "meaning": "Cảm ơn",
    "level": "HSK 1",
    "topic": "Chào hỏi",
    "radical": "讠(Ngôn)",
    "strokes": 12,
    "mnemonic": "Dùng lời nói (讠) cúi mình (身) biểu thị sự biết ơn dù chỉ một tấc (寸).",
    "example": {
      "hanzi": "太谢谢你的帮助了！",
      "pinyin": "Tài xièxie nǐ de bāngzhù le!",
      "meaning": "Vô cùng cảm ơn sự giúp đỡ của bạn!"
    }
  },
  {
    "id": 16,
    "hanzi": "再见",
    "pinyin": "zàijiàn",
    "hanviet": "Tái Kiến",
    "meaning": "Tạm biệt (Hẹn gặp lại)",
    "level": "HSK 1",
    "topic": "Chào hỏi",
    "radical": "冂 (Quynh)",
    "strokes": 6,
    "mnemonic": "Tái (再) nghĩa là lần nữa, Kiến (见) nghĩa là gặp mặt.",
    "example": {
      "hanzi": "明天见，再见！",
      "pinyin": "Míngtiān jiàn, zàijiàn!",
      "meaning": "Mai gặp nhé, tạm biệt!"
    }
  },
  {
    "id": 17,
    "hanzi": "不客气",
    "pinyin": "bú kèqi",
    "hanviet": "Bất Khách Khí",
    "meaning": "Đừng khách sáo, không có gì",
    "level": "HSK 1",
    "topic": "Chào hỏi",
    "radical": "不 (Bất)",
    "strokes": 9,
    "mnemonic": "Đã là bạn bè thân thiết thì không cần câu nệ khách sáo.",
    "example": {
      "hanzi": "A: 谢谢你！ B: 不客气。",
      "pinyin": "A: Xièxie nǐ! B: Bú kèqi.",
      "meaning": "A: Cảm ơn bạn! B: Không có chi."
    }
  },
  {
    "id": 18,
    "hanzi": "对不起",
    "pinyin": "duìbuqǐ",
    "hanviet": "Đối Bất Khởi",
    "meaning": "Xin lỗi",
    "level": "HSK 1",
    "topic": "Chào hỏi",
    "radical": "寸 (Thốn)",
    "strokes": 12,
    "mnemonic": "Cảm thấy hổ thẹn không xứng đối diện với người khác.",
    "example": {
      "hanzi": "对不起，我来晚了。",
      "pinyin": "Duìbuqǐ, wǒ lái wǎn le.",
      "meaning": "Xin lỗi, tôi đến muộn rồi."
    }
  },
  {
    "id": 19,
    "hanzi": "没关系",
    "pinyin": "méi guānxi",
    "hanviet": "Một Quan Hệ",
    "meaning": "Không sao đâu, không hề gì",
    "level": "HSK 1",
    "topic": "Chào hỏi",
    "radical": "氵(Chấm thủy)",
    "strokes": 14,
    "mnemonic": "Nước trôi qua không còn vướng mắc quan hệ gì nữa.",
    "example": {
      "hanzi": "没关系，请坐吧。",
      "pinyin": "Méi guānxi, qǐng zuò ba.",
      "meaning": "Không sao đâu, xin mời ngồi."
    }
  },
  {
    "id": 20,
    "hanzi": "请",
    "pinyin": "qǐng",
    "hanviet": "Thỉnh",
    "meaning": "Xin, mời",
    "level": "HSK 1",
    "topic": "Chào hỏi",
    "radical": "讠(Ngôn)",
    "strokes": 10,
    "mnemonic": "Dùng lời nói (讠) chân thành trong sáng như màu xanh (青) để mời mọc.",
    "example": {
      "hanzi": "请喝茶！",
      "pinyin": "Qǐng hē chá!",
      "meaning": "Xin mời uống trà!"
    }
  },
  {
    "id": 21,
    "hanzi": "零",
    "pinyin": "líng",
    "hanviet": "Linh",
    "meaning": "Số 0",
    "level": "HSK 1",
    "topic": "Con số",
    "radical": "雨 (Vũ)",
    "strokes": 13,
    "mnemonic": "Mưa (雨) rơi lất phất lệnh (令) xuống giọt nước số 0 tròn trĩnh.",
    "example": {
      "hanzi": "我的房间号是三零二。",
      "pinyin": "Wǒ de fángjiān hào shì sān líng èr.",
      "meaning": "Số phòng của tôi là 302."
    }
  },
  {
    "id": 22,
    "hanzi": "一",
    "pinyin": "yī",
    "hanviet": "Nhất",
    "meaning": "Số 1",
    "level": "HSK 1",
    "topic": "Con số",
    "radical": "一 (Nhất)",
    "strokes": 1,
    "mnemonic": "Một nét ngang đơn giản biểu thị sự khởi đầu của vạn vật.",
    "example": {
      "hanzi": "请给我一杯水。",
      "pinyin": "Qǐng gěi wǒ yì bēi shuǐ.",
      "meaning": "Xin cho tôi một cốc nước."
    }
  },
  {
    "id": 23,
    "hanzi": "二",
    "pinyin": "èr",
    "hanviet": "Nhị",
    "meaning": "Số 2",
    "level": "HSK 1",
    "topic": "Con số",
    "radical": "二 (Nhị)",
    "strokes": 2,
    "mnemonic": "Hai nét ngang song song trên dưới biểu thị số lượng hai.",
    "example": {
      "hanzi": "现在是两点二十分。",
      "pinyin": "Xiànzài shì liǎng diǎn èrshí fēn.",
      "meaning": "Bây giờ là 2 giờ 20 phút."
    }
  },
  {
    "id": 24,
    "hanzi": "三",
    "pinyin": "sān",
    "hanviet": "Tam",
    "meaning": "Số 3",
    "level": "HSK 1",
    "topic": "Con số",
    "radical": "一 (Nhất)",
    "strokes": 3,
    "mnemonic": "Ba nét ngang tượng trưng cho tam tài: Thiên - Địa - Nhân.",
    "example": {
      "hanzi": "我有三个苹果。",
      "pinyin": "Wǒ yǒu sān gè píngguǒ.",
      "meaning": "Tôi có 3 quả táo."
    }
  },
  {
    "id": 25,
    "hanzi": "四",
    "pinyin": "sì",
    "hanviet": "Tứ",
    "meaning": "Số 4",
    "level": "HSK 1",
    "topic": "Con số",
    "radical": "囗 (Vi)",
    "strokes": 5,
    "mnemonic": "Khung thành vuông vức (囗) bên trong chia làm hai luồng.",
    "example": {
      "hanzi": "我家有四口人。",
      "pinyin": "Wǒ jiā yǒu sì kǒu rén.",
      "meaning": "Nhà tôi có bốn người."
    }
  },
  {
    "id": 26,
    "hanzi": "五",
    "pinyin": "wǔ",
    "hanviet": "Ngũ",
    "meaning": "Số 5",
    "level": "HSK 1",
    "topic": "Con số",
    "radical": "二 (Nhị)",
    "strokes": 4,
    "mnemonic": "Nối kết giữa trời và đất giao nhau tượng trưng ngũ hành.",
    "example": {
      "hanzi": "星期五我们去逛街。",
      "pinyin": "Xīngqīwǔ wǒmen qù guàngjiē.",
      "meaning": "Thứ sáu chúng mình đi dạo phố."
    }
  },
  {
    "id": 27,
    "hanzi": "六",
    "pinyin": "liù",
    "hanviet": "Lục",
    "meaning": "Số 6",
    "level": "HSK 1",
    "topic": "Con số",
    "radical": "八 (Bát)",
    "strokes": 4,
    "mnemonic": "Mái nhà che trên hai chân vững chãi biểu thị sự thuận buồm xuôi gió.",
    "example": {
      "hanzi": "六月是夏天的开始。",
      "pinyin": "Liùyuè shì xiàtiān de kāishǐ.",
      "meaning": "Tháng 6 là khởi đầu của mùa hè."
    }
  },
  {
    "id": 28,
    "hanzi": "七",
    "pinyin": "qī",
    "hanviet": "Thất",
    "meaning": "Số 7",
    "level": "HSK 1",
    "topic": "Con số",
    "radical": "一 (Nhất)",
    "strokes": 2,
    "mnemonic": "Nét ngang cắt nét cong móc vút lên tượng trưng số 7.",
    "example": {
      "hanzi": "七天为一个星期。",
      "pinyin": "Qī tiān wéi yí gè xīngqī.",
      "meaning": "Bảy ngày là một tuần."
    }
  },
  {
    "id": 29,
    "hanzi": "八",
    "pinyin": "bā",
    "hanviet": "Bát",
    "meaning": "Số 8",
    "level": "HSK 1",
    "topic": "Con số",
    "radical": "八 (Bát)",
    "strokes": 2,
    "mnemonic": "Hai nét phẩy và mác dang rộng phát tài phát lộc.",
    "example": {
      "hanzi": "八月十五是中秋节。",
      "pinyin": "Bāyuè shíwǔ shì Zhōngqiūjié.",
      "meaning": "Ngày 15 tháng 8 là Tết Trung thu."
    }
  },
  {
    "id": 30,
    "hanzi": "九",
    "pinyin": "jiǔ",
    "hanviet": "Cửu",
    "meaning": "Số 9",
    "level": "HSK 1",
    "topic": "Con số",
    "radical": "丿(Phẩy)",
    "strokes": 2,
    "mnemonic": "Uốn lượn trường tồn cửu vạn trường cửu.",
    "example": {
      "hanzi": "九点整我们开始上课。",
      "pinyin": "Jiǔ diǎn zhěng wǒmen kāishǐ shàngkè.",
      "meaning": "Đúng 9 giờ chúng tôi bắt đầu vào học."
    }
  },
  {
    "id": 31,
    "hanzi": "十",
    "pinyin": "shí",
    "hanviet": "Thập",
    "meaning": "Số 10",
    "level": "HSK 1",
    "topic": "Con số",
    "radical": "十 (Thập)",
    "strokes": 2,
    "mnemonic": "Nét ngang và nét sổ giao nhau chữ thập tròn vẹn đầy đủ.",
    "example": {
      "hanzi": "这本书十块钱。",
      "pinyin": "Zhè běn shū shí kuài qián.",
      "meaning": "Cuốn sách này 10 đồng."
    }
  },
  {
    "id": 32,
    "hanzi": "百",
    "pinyin": "bǎi",
    "hanviet": "Bách",
    "meaning": "Hàng trăm, 100",
    "level": "HSK 1",
    "topic": "Con số",
    "radical": "白 (Bạch)",
    "strokes": 6,
    "mnemonic": "Thêm nét ngang phía trên chữ Bạch (白) biểu thị con số 100.",
    "example": {
      "hanzi": "学校里有一百多名留学生。",
      "pinyin": "Xuéxiào lǐ yǒu yì bǎi duō míng liúxuéshēng.",
      "meaning": "Trong trường có hơn 100 lưu học sinh."
    }
  },
  {
    "id": 33,
    "hanzi": "爸爸",
    "pinyin": "bàba",
    "hanviet": "Ba Ba",
    "meaning": "Bố, cha",
    "level": "HSK 1",
    "topic": "Gia đình",
    "radical": "父 (Phụ)",
    "strokes": 8,
    "mnemonic": "Bộ phụ (父) ở trên là người cha, bộ ba (巴) ở dưới chỉ âm đọc.",
    "example": {
      "hanzi": "我爸爸是一名医生。",
      "pinyin": "Wǒ bàba shì yì míng yīshēng.",
      "meaning": "Bố tôi là một bác sĩ."
    }
  },
  {
    "id": 34,
    "hanzi": "妈妈",
    "pinyin": "māma",
    "hanviet": "Ma Ma",
    "meaning": "Mẹ, má",
    "level": "HSK 1",
    "topic": "Gia đình",
    "radical": "女 (Nữ)",
    "strokes": 6,
    "mnemonic": "Người phụ nữ (女) vất vả nuôi con như ngựa (马) bền bỉ.",
    "example": {
      "hanzi": "妈妈做的中国菜真好吃！",
      "pinyin": "Māma zuò de Zhōngguó cài zhēn hǎochī!",
      "meaning": "Món ăn mẹ nấu ngon quá!"
    }
  },
  {
    "id": 35,
    "hanzi": "儿子",
    "pinyin": "érzi",
    "hanviet": "Nhi tử",
    "meaning": "Con trai",
    "level": "HSK 1",
    "topic": "Gia đình",
    "radical": "儿 (Nhi)",
    "strokes": 5,
    "mnemonic": "Cậu bé nhỏ (儿) sinh ra thành đứa con trai (子).",
    "example": {
      "hanzi": "他的儿子今年五岁了。",
      "pinyin": "Tā de érzi jīnnián wǔ suì le.",
      "meaning": "Con trai anh ấy năm nay 5 tuổi rồi."
    }
  },
  {
    "id": 36,
    "hanzi": "女儿",
    "pinyin": "nǚ’ér",
    "hanviet": "Nữ nhi",
    "meaning": "Con gái",
    "level": "HSK 1",
    "topic": "Gia đình",
    "radical": "女 (Nữ)",
    "strokes": 5,
    "mnemonic": "Bé gái (女) đáng yêu trong nhà.",
    "example": {
      "hanzi": "我女儿很喜欢画画。",
      "pinyin": "Wǒ nǚ’ér hěn xǐhuan huàhuà.",
      "meaning": "Con gái tôi rất thích vẽ tranh."
    }
  },
  {
    "id": 37,
    "hanzi": "家",
    "pinyin": "jiā",
    "hanviet": "Gia",
    "meaning": "Nhà, gia đình",
    "level": "HSK 1",
    "topic": "Gia đình",
    "radical": "宀 (Miên)",
    "strokes": 10,
    "mnemonic": "Dưới mái nhà (宀) nuôi dưỡng gia súc no đủ ấm áp.",
    "example": {
      "hanzi": "我想回家看望父母。",
      "pinyin": "Wǒ xiǎng huí jiā kànwàng fùmǔ.",
      "meaning": "Tôi muốn về nhà thăm bố mẹ."
    }
  },
  {
    "id": 38,
    "hanzi": "人",
    "pinyin": "rén",
    "hanviet": "Nhân",
    "meaning": "Người, con người",
    "level": "HSK 1",
    "topic": "Con người",
    "radical": "人 (Nhân)",
    "strokes": 2,
    "mnemonic": "Hình dáng hai chân con người đứng vững trên mặt đất.",
    "example": {
      "hanzi": "这里有很多热情的中国人。",
      "pinyin": "Zhèlǐ yǒu hěn duō rèqíng de Zhōngguó rén.",
      "meaning": "Ở đây có rất nhiều người Trung Quốc nhiệt tình."
    }
  },
  {
    "id": 39,
    "hanzi": "朋友",
    "pinyin": "péngyou",
    "hanviet": "Bằng hữu",
    "meaning": "Bạn bè",
    "level": "HSK 1",
    "topic": "Con người",
    "radical": "月 (Nguyệt)",
    "strokes": 8,
    "mnemonic": "Hai vầng trăng (朋) song hành cùng bàn tay (友) nắm chặt.",
    "example": {
      "hanzi": "有朋自远方来，不亦乐乎。",
      "pinyin": "Yǒu péng zì yuǎnfāng lái, bú yì lè hū.",
      "meaning": "Có bạn từ phương xa đến chẳng vui sao."
    }
  },
  {
    "id": 40,
    "hanzi": "老师",
    "pinyin": "lǎoshī",
    "hanviet": "Lão sư",
    "meaning": "Thầy giáo, cô giáo",
    "level": "HSK 1",
    "topic": "Trường học",
    "radical": "耂 (Lão)",
    "strokes": 12,
    "mnemonic": "Người cao tuổi từng trải (老) dẫn dắt chỉ dạy (师).",
    "example": {
      "hanzi": "王老师教我们汉语口语。",
      "pinyin": "Wáng lǎoshī jiāo wǒmen Hànyǔ kǒuyǔ.",
      "meaning": "Thầy Vương dạy chúng tôi khẩu ngữ tiếng Trung."
    }
  },
  {
    "id": 41,
    "hanzi": "学生",
    "pinyin": "xuésheng",
    "hanviet": "Học sinh",
    "meaning": "Học sinh, sinh viên",
    "level": "HSK 1",
    "topic": "Trường học",
    "radical": "子 (Tử)",
    "strokes": 13,
    "mnemonic": "Người đang tuổi học hỏi (学) để sinh tồn và phát triển (生).",
    "example": {
      "hanzi": "我们都是河内大学的学生。",
      "pinyin": "Wǒmen dōu shì Hénèi dàxué de xuésheng.",
      "meaning": "Chúng tôi đều là sinh viên trường Đại học Hà Nội."
    }
  },
  {
    "id": 42,
    "hanzi": "同学",
    "pinyin": "tóngxué",
    "hanviet": "Đồng học",
    "meaning": "Bạn cùng lớp, bạn học",
    "level": "HSK 1",
    "topic": "Trường học",
    "radical": "口 (Khẩu)",
    "strokes": 14,
    "mnemonic": "Cùng chung một trường một lớp (同) học hành (学).",
    "example": {
      "hanzi": "她是我的同班同学。",
      "pinyin": "Tā shì wǒ de tóngbān tóngxué.",
      "meaning": "Cô ấy là bạn cùng lớp của tôi."
    }
  },
  {
    "id": 43,
    "hanzi": "先生",
    "pinyin": "xiānsheng",
    "hanviet": "Tiên sinh",
    "meaning": "Ông, ngài, chồng",
    "level": "HSK 1",
    "topic": "Giao tiếp",
    "radical": "儿 (Nhi)",
    "strokes": 11,
    "mnemonic": "Người sinh ra trước (先) được tôn kính xưng hô.",
    "example": {
      "hanzi": "张先生，请问您找谁？",
      "pinyin": "Zhāng xiānsheng, qǐngwèn nín zhǎo shéi?",
      "meaning": "Thưa ông Trương, xin hỏi ông tìm ai?"
    }
  },
  {
    "id": 44,
    "hanzi": "小姐",
    "pinyin": "xiǎojiě",
    "hanviet": "Tiểu thư",
    "meaning": "Cô gái, tiểu thư",
    "level": "HSK 1",
    "topic": "Giao tiếp",
    "radical": "女 (Nữ)",
    "strokes": 11,
    "mnemonic": "Cô em gái nhỏ (小) xinh xắn con nhà gia giáo (姐).",
    "example": {
      "hanzi": "李小姐，很高兴再次见到你。",
      "pinyin": "Lǐ xiǎojiě, hěn gāoxìng zàicì jiàndào nǐ.",
      "meaning": "Chào cô Lý, rất vui được gặp lại cô."
    }
  },
  {
    "id": 45,
    "hanzi": "医生",
    "pinyin": "yīshēng",
    "hanviet": "Y sinh",
    "meaning": "Bác sĩ",
    "level": "HSK 1",
    "topic": "Công việc",
    "radical": "匚 (Phương)",
    "strokes": 12,
    "mnemonic": "Người dùng y thuật (医) cứu sinh mệnh người bệnh (生).",
    "example": {
      "hanzi": "生病了就应该去看医生。",
      "pinyin": "Shēngbìng le jiù yīnggāi qù kàn yīshēng.",
      "meaning": "Bị ốm thì nên đi khám bác sĩ."
    }
  },
  {
    "id": 46,
    "hanzi": "学校",
    "pinyin": "xuéxiào",
    "hanviet": "Học hiệu",
    "meaning": "Trường học",
    "level": "HSK 1",
    "topic": "Trường học",
    "radical": "木 (Mộc)",
    "strokes": 18,
    "mnemonic": "Nơi cây cối râm mát để con người học hành thi cử.",
    "example": {
      "hanzi": "我们的学校非常美丽。",
      "pinyin": "Wǒmen de xuéxiào fēicháng měilì.",
      "meaning": "Trường học của chúng tôi rất đẹp."
    }
  },
  {
    "id": 47,
    "hanzi": "饭店",
    "pinyin": "fàndiàn",
    "hanviet": "Phạn điếm",
    "meaning": "Nhà hàng, quán ăn, khách sạn",
    "level": "HSK 1",
    "topic": "Ăn uống",
    "radical": "饣(Thực)",
    "strokes": 15,
    "mnemonic": "Cửa tiệm (店) chuyên phục vụ cơm canh đồ ăn ngon (饭).",
    "example": {
      "hanzi": "中午我们去那家饭店吃饭吧。",
      "pinyin": "Zhōngwǔ wǒmen qù nà jiā fàndiàn chīfàn ba.",
      "meaning": "Trưa nay chúng mình qua nhà hàng kia ăn cơm nhé."
    }
  },
  {
    "id": 48,
    "hanzi": "商店",
    "pinyin": "shāngdiàn",
    "hanviet": "Thương điếm",
    "meaning": "Cửa hàng, tiệm tạp hóa",
    "level": "HSK 1",
    "topic": "Mua sắm",
    "radical": "广 (Quảng)",
    "strokes": 19,
    "mnemonic": "Nơi kinh doanh thương mại (商) bày bán đồ đạc.",
    "example": {
      "hanzi": "商店里有很多新鲜的水果。",
      "pinyin": "Shāngdiàn lǐ yǒu hěn duō xīnxiān de shuǐguǒ.",
      "meaning": "Trong cửa hàng có rất nhiều hoa quả tươi."
    }
  },
  {
    "id": 49,
    "hanzi": "医院",
    "pinyin": "yīyuàn",
    "hanviet": "Y viện",
    "meaning": "Bệnh viện",
    "level": "HSK 1",
    "topic": "Sức khỏe",
    "radical": "阝(Phụ)",
    "strokes": 16,
    "mnemonic": "Tòa viện lớn (院) nơi tập trung các vị danh y cứu người (医).",
    "example": {
      "hanzi": "我家附近有一所大医院。",
      "pinyin": "Wǒ jiā fùjìn yǒu yì suǒ dà yīyuàn.",
      "meaning": "Gần nhà tôi có một bệnh viện lớn."
    }
  },
  {
    "id": 50,
    "hanzi": "中国",
    "pinyin": "Zhōngguó",
    "hanviet": "Trung Quốc",
    "meaning": "Trung Quốc",
    "level": "HSK 1",
    "topic": "Du lịch",
    "radical": "囗 (Vi)",
    "strokes": 12,
    "mnemonic": "Viên ngọc quý (玉) giữa lòng bờ cõi quốc gia rộng lớn (国).",
    "example": {
      "hanzi": "我想去中国留学。",
      "pinyin": "Wǒ xiǎng qù Zhōngguó liúxué.",
      "meaning": "Tôi muốn sang Trung Quốc du học."
    }
  },
  {
    "id": 51,
    "hanzi": "北京",
    "pinyin": "Běijīng",
    "hanviet": "Bắc Kinh",
    "meaning": "Bắc Kinh (Thủ đô TQ)",
    "level": "HSK 1",
    "topic": "Du lịch",
    "radical": "亠 (Đầu)",
    "strokes": 13,
    "mnemonic": "Kinh đô (京) phồn hoa tráng lệ nằm ở phía Bắc (北).",
    "example": {
      "hanzi": "北京的秋天非常迷人。",
      "pinyin": "Běijīng de qiūtiān fēicháng mírén.",
      "meaning": "Mùa thu Bắc Kinh vô cùng quyến rũ."
    }
  },
  {
    "id": 52,
    "hanzi": "飞机",
    "pinyin": "fēijī",
    "hanviet": "Phi cơ",
    "meaning": "Máy bay",
    "level": "HSK 1",
    "topic": "Du lịch",
    "radical": "飞 (Phi)",
    "strokes": 7,
    "mnemonic": "Cỗ máy (机) có sải cánh bay lượn (飞) trên bầu trời.",
    "example": {
      "hanzi": "我坐下午的飞机去上海。",
      "pinyin": "Wǒ zuò xiàwǔ de fēijī qù Shànghǎi.",
      "meaning": "Tôi đi máy bay buổi chiều tới Thượng Hải."
    }
  },
  {
    "id": 53,
    "hanzi": "出租车",
    "pinyin": "chūzūchē",
    "hanviet": "Xuất tô xa",
    "meaning": "Xe taxi",
    "level": "HSK 1",
    "topic": "Du lịch",
    "radical": "车 (Xa)",
    "strokes": 19,
    "mnemonic": "Phương tiện xe cộ (车) cho thuê (租) đi lại.",
    "example": {
      "hanzi": "我们打出租车去机场吧。",
      "pinyin": "Wǒmen dǎ chūzūchē qù jīchǎng ba.",
      "meaning": "Chúng ta bắt xe taxi ra sân bay nhé."
    }
  },
  {
    "id": 54,
    "hanzi": "电脑",
    "pinyin": "diànnǎo",
    "hanviet": "Điện não",
    "meaning": "Máy tính, laptop",
    "level": "HSK 1",
    "topic": "Công nghệ",
    "radical": "月 (Nguyệt)",
    "strokes": 18,
    "mnemonic": "Bộ não điện tử (电 + 脑) xử lý thông tin thông minh.",
    "example": {
      "hanzi": "我用电脑写中文作业。",
      "pinyin": "Wǒ yòng diànnǎo xiě Zhōngwén zuòyè.",
      "meaning": "Tôi dùng máy tính làm bài tập tiếng Trung."
    }
  },
  {
    "id": 55,
    "hanzi": "电视",
    "pinyin": "diànshì",
    "hanviet": "Điện thị",
    "meaning": "Tivi, truyền hình",
    "level": "HSK 1",
    "topic": "Đời sống",
    "radical": "见 (Kiến)",
    "strokes": 13,
    "mnemonic": "Màn hình điện tử (电) để quan sát ngắm nhìn (视).",
    "example": {
      "hanzi": "晚上爸爸喜欢看电视新闻。",
      "pinyin": "Wǎnshang bàba xǐhuan kàn diànshì xīnwén.",
      "meaning": "Buổi tối bố thích xem tin tức truyền hình."
    }
  },
  {
    "id": 56,
    "hanzi": "电影",
    "pinyin": "diànyǐng",
    "hanviet": "Điện ảnh",
    "meaning": "Phim, điện ảnh",
    "level": "HSK 1",
    "topic": "Đời sống",
    "radical": "彡 (Sam)",
    "strokes": 20,
    "mnemonic": "Hình bóng (影) chuyển động nhờ ánh sáng bóng đèn (电).",
    "example": {
      "hanzi": "周末我们一起去看电影吧。",
      "pinyin": "Zhōumò wǒmen yìqǐ qù kàn diànyǐng ba.",
      "meaning": "Cuối tuần chúng mình cùng đi xem phim nhé."
    }
  },
  {
    "id": 57,
    "hanzi": "手机",
    "pinyin": "shǒujī",
    "hanviet": "Thủ cơ",
    "meaning": "Điện thoại di động",
    "level": "HSK 1",
    "topic": "Công nghệ",
    "radical": "手 (Thủ)",
    "strokes": 10,
    "mnemonic": "Cỗ máy viễn thông nhỏ gọn luôn cầm trên tay (手).",
    "example": {
      "hanzi": "请把你的手机号码告诉我。",
      "pinyin": "Qǐng bǎ nǐ de shǒujī hàomǎ gàosu wǒ.",
      "meaning": "Xin hãy cho tôi biết số điện thoại của bạn."
    }
  },
  {
    "id": 58,
    "hanzi": "书",
    "pinyin": "shū",
    "hanviet": "Thư",
    "meaning": "Sách, vở",
    "level": "HSK 1",
    "topic": "Trường học",
    "radical": "乙 (Ất)",
    "strokes": 4,
    "mnemonic": "Tay cầm bút viết ghi chép lại kiến thức nghìn đời.",
    "example": {
      "hanzi": "桌子上有一本汉语书。",
      "pinyin": "Zhuōzi shang yǒu yì běn Hànyǔ shū.",
      "meaning": "Trên bàn có một cuốn sách tiếng Trung."
    }
  },
  {
    "id": 59,
    "hanzi": "桌子",
    "pinyin": "zhuōzi",
    "hanviet": "Trác tử",
    "meaning": "Cái bàn",
    "level": "HSK 1",
    "topic": "Đời sống",
    "radical": "木 (Mộc)",
    "strokes": 13,
    "mnemonic": "Đồ vật bằng gỗ (木) cao ráo để học tập và làm việc.",
    "example": {
      "hanzi": "请把书放在桌子上。",
      "pinyin": "Qǐng bǎ shū fàng zài zhuōzi shang.",
      "meaning": "Xin hãy đặt sách lên trên bàn."
    }
  },
  {
    "id": 60,
    "hanzi": "椅子",
    "pinyin": "yǐzi",
    "hanviet": "Y tử",
    "meaning": "Cái ghế",
    "level": "HSK 1",
    "topic": "Đời sống",
    "radical": "木 (Mộc)",
    "strokes": 15,
    "mnemonic": "Đồ gỗ (木) có lưng tựa êm ái để ngả lưng ngồi nghỉ.",
    "example": {
      "hanzi": "房间里有两把新椅子。",
      "pinyin": "Fángjiān lǐ yǒu liǎng bǎ xīn yǐzi.",
      "meaning": "Trong phòng có hai chiếc ghế mới."
    }
  },
  {
    "id": 61,
    "hanzi": "衣服",
    "pinyin": "yīfu",
    "hanviet": "Y phục",
    "meaning": "Quần áo",
    "level": "HSK 1",
    "topic": "Đời sống",
    "radical": "衤(Áo)",
    "strokes": 14,
    "mnemonic": "Bộ y phục (衣) chỉnh tề khoác lên người.",
    "example": {
      "hanzi": "这件衣服真漂亮！",
      "pinyin": "Zhè jiàn yīfu zhēn piàoliang!",
      "meaning": "Bộ quần áo này đẹp quá!"
    }
  },
  {
    "id": 62,
    "hanzi": "水",
    "pinyin": "shuǐ",
    "hanviet": "Thủy",
    "meaning": "Nước, sông nước",
    "level": "HSK 1",
    "topic": "Ăn uống",
    "radical": "水 (Thủy)",
    "strokes": 4,
    "mnemonic": "Dòng nước chảy uốn khúc với giọt nước văng hai bên.",
    "example": {
      "hanzi": "运动后要多喝水。",
      "pinyin": "Yùndòng hòu yào duō hē shuǐ.",
      "meaning": "Sau khi vận động cần uống nhiều nước."
    }
  },
  {
    "id": 63,
    "hanzi": "茶",
    "pinyin": "chá",
    "hanviet": "Trà",
    "meaning": "Trà, lá chè",
    "level": "HSK 1",
    "topic": "Ăn uống",
    "radical": "艹 (Thảo)",
    "strokes": 9,
    "mnemonic": "Cây cỏ thảo mộc (艹) hái từ cây gỗ (木) để thưởng thức.",
    "example": {
      "hanzi": "中国人非常喜欢喝热茶。",
      "pinyin": "Zhōngguó rén fēicháng xǐhuan hē rè chá.",
      "meaning": "Người Trung Quốc rất thích uống trà nóng."
    }
  },
  {
    "id": 64,
    "hanzi": "米饭",
    "pinyin": "mǐfàn",
    "hanviet": "Mễ phạn",
    "meaning": "Cơm trắng",
    "level": "HSK 1",
    "topic": "Ăn uống",
    "radical": "米 (Mễ)",
    "strokes": 13,
    "mnemonic": "Hạt gạo (米) được nấu chín thành bát cơm thơm phức (饭).",
    "example": {
      "hanzi": "我中午吃了一碗米饭和青菜。",
      "pinyin": "Wǒ zhōngwǔ chī le yì wǎn mǐfàn hé qīngcài.",
      "meaning": "Buổi trưa tôi đã ăn một bát cơm và rau xanh."
    }
  },
  {
    "id": 65,
    "hanzi": "菜",
    "pinyin": "cài",
    "hanviet": "Thái",
    "meaning": "Món ăn, rau xanh",
    "level": "HSK 1",
    "topic": "Ăn uống",
    "radical": "艹 (Thảo)",
    "strokes": 11,
    "mnemonic": "Rau cỏ (艹) hái bằng tay (爫) từ trên cây (木) chế biến món ngon.",
    "example": {
      "hanzi": "今天我们点了四个菜。",
      "pinyin": "Jīntiān wǒmen diǎn le sì gè cài.",
      "meaning": "Hôm nay chúng tôi đã gọi bốn món ăn."
    }
  },
  {
    "id": 66,
    "hanzi": "苹果",
    "pinyin": "píngguǒ",
    "hanviet": "Bình quả",
    "meaning": "Quả táo tây",
    "level": "HSK 1",
    "topic": "Ăn uống",
    "radical": "艹 (Thảo)",
    "strokes": 16,
    "mnemonic": "Loại quả (果) giòn ngọt mang biểu tượng bình an (平).",
    "example": {
      "hanzi": "每天吃一个苹果对身体很好。",
      "pinyin": "Měitiān chī yí gè píngguǒ duì shēntǐ hěn hǎo.",
      "meaning": "Mỗi ngày ăn một quả táo rất tốt cho sức khỏe."
    }
  },
  {
    "id": 67,
    "hanzi": "钱",
    "pinyin": "qián",
    "hanviet": "Tiền",
    "meaning": "Tiền bạc",
    "level": "HSK 1",
    "topic": "Mua sắm",
    "radical": "钅(Kim)",
    "strokes": 10,
    "mnemonic": "Đúc bằng kim loại quý (钅), ai cũng tranh giành bảo vệ.",
    "example": {
      "hanzi": "这个西瓜多少钱一斤？",
      "pinyin": "Zhè ge xīguā duōshao qián yì jīn?",
      "meaning": "Quả dưa hấu này bao nhiêu tiền một cân?"
    }
  },
  {
    "id": 68,
    "hanzi": "东西",
    "pinyin": "dōngxi",
    "hanviet": "Đông tây",
    "meaning": "Đồ vật, đồ đạc",
    "level": "HSK 1",
    "topic": "Mua sắm",
    "radical": "木 (Mộc)",
    "strokes": 14,
    "mnemonic": "Đồ đạc gom từ bốn phương Đông sang Tây.",
    "example": {
      "hanzi": "我去超市买点东西。",
      "pinyin": "Wǒ qù chāoshì mǎi diǎn dōngxi.",
      "meaning": "Tôi đi siêu thị mua ít đồ."
    }
  },
  {
    "id": 69,
    "hanzi": "猫",
    "pinyin": "māo",
    "hanviet": "Miêu",
    "meaning": "Con mèo",
    "level": "HSK 1",
    "topic": "Động vật",
    "radical": "犭(Khuyển)",
    "strokes": 11,
    "mnemonic": "Loài thú bốn chân (犭) kêu meo meo săn chuột trên ruộng lúa (苗).",
    "example": {
      "hanzi": "我家有一只可爱的小猫。",
      "pinyin": "Wǒ jiā yǒu yì zhī kě’ài de xiǎomāo.",
      "meaning": "Nhà tôi có một chú mèo con rất đáng yêu."
    }
  },
  {
    "id": 70,
    "hanzi": "狗",
    "pinyin": "gǒu",
    "hanviet": "Cẩu",
    "meaning": "Con chó",
    "level": "HSK 1",
    "topic": "Động vật",
    "radical": "犭(Khuyển)",
    "strokes": 8,
    "mnemonic": "Loài thú bốn chân (犭) trung thành giữ nhà kêu gâu gâu (句).",
    "example": {
      "hanzi": "那只小狗非常聪明。",
      "pinyin": "Nà zhī xiǎogǒu fēicháng cōngming.",
      "meaning": "Chú cún con kia rất thông minh."
    }
  },
  {
    "id": 71,
    "hanzi": "年",
    "pinyin": "nián",
    "hanviet": "Niên",
    "meaning": "Năm",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "干 (Can)",
    "strokes": 6,
    "mnemonic": "Mỗi năm lúa chín một mùa gặt.",
    "example": {
      "hanzi": "我在北京学习了一年汉语。",
      "pinyin": "Wǒ zài Běijīng xuéxí le yì nián Hànyǔ.",
      "meaning": "Tôi đã học tiếng Trung một năm ở Bắc Kinh."
    }
  },
  {
    "id": 72,
    "hanzi": "月",
    "pinyin": "yuè",
    "hanviet": "Nguyệt",
    "meaning": "Tháng, mặt trăng",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "月 (Nguyệt)",
    "strokes": 4,
    "mnemonic": "Hình vành trăng khuyết chiếu sáng trên bầu trời đêm.",
    "example": {
      "hanzi": "九月我们要开学了。",
      "pinyin": "Jiǔyuè wǒmen yào kāixué le.",
      "meaning": "Tháng 9 chúng tôi sẽ tựu trường khai giảng."
    }
  },
  {
    "id": 73,
    "hanzi": "日",
    "pinyin": "rì",
    "hanviet": "Nhật",
    "meaning": "Ngày, mặt trời",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "日 (Nhật)",
    "strokes": 4,
    "mnemonic": "Vầng thái dương tròn trịa tỏa ánh nắng soi sáng vạn vật.",
    "example": {
      "hanzi": "十月一日是国庆节。",
      "pinyin": "Shíyuè yī rì shì Guóqìngjié.",
      "meaning": "Ngày mùng 1 tháng 10 là ngày Quốc khánh."
    }
  },
  {
    "id": 74,
    "hanzi": "号",
    "pinyin": "hào",
    "hanviet": "Hiệu",
    "meaning": "Ngày (văn nói), số",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "口 (Khẩu)",
    "strokes": 5,
    "mnemonic": "Mở miệng (口) đọc số hiệu ký hiệu.",
    "example": {
      "hanzi": "今天几月几号？",
      "pinyin": "Jīntiān jǐ yuè jǐ hào?",
      "meaning": "Hôm nay ngày mấy tháng mấy?"
    }
  },
  {
    "id": 75,
    "hanzi": "星期",
    "pinyin": "xīngqī",
    "hanviet": "Tinh kỳ",
    "meaning": "Tuần lễ, thứ",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "日 (Nhật)",
    "strokes": 21,
    "mnemonic": "Chu kỳ các vì sao (星) quay theo tuần (期).",
    "example": {
      "hanzi": "星期天你想去哪儿玩？",
      "pinyin": "Xīngqītiān nǐ xiǎng qù nǎr wán?",
      "meaning": "Chủ nhật bạn muốn đi đâu chơi?"
    }
  },
  {
    "id": 76,
    "hanzi": "点",
    "pinyin": "diǎn",
    "hanviet": "Điểm",
    "meaning": "Giờ, điểm",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "灬 (Hỏa)",
    "strokes": 9,
    "mnemonic": "Kim đồng hồ chỉ từng điểm giờ khắc trôi qua.",
    "example": {
      "hanzi": "现在是上午十点。",
      "pinyin": "Xiànzài shì shàngwǔ shí diǎn.",
      "meaning": "Bây giờ là 10 giờ sáng."
    }
  },
  {
    "id": 77,
    "hanzi": "分钟",
    "pinyin": "fēnzhōng",
    "hanviet": "Phân chung",
    "meaning": "Phút",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "钅(Kim)",
    "strokes": 16,
    "mnemonic": "Chuông đồng hồ (钟) chia thành từng phân khúc nhỏ (分).",
    "example": {
      "hanzi": "请稍等我五分钟。",
      "pinyin": "Qǐng shāoděng wǒ wǔ fēnzhōng.",
      "meaning": "Xin chờ tôi năm phút."
    }
  },
  {
    "id": 78,
    "hanzi": "现在",
    "pinyin": "xiànzài",
    "hanviet": "Hiện tại",
    "meaning": "Bây giờ, hiện tại",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "王 (Ngọc)",
    "strokes": 14,
    "mnemonic": "Ngọc quý hiển hiện (现) ngay trước mắt nơi này (在).",
    "example": {
      "hanzi": "你现在在做什么呢？",
      "pinyin": "Nǐ xiànzài zài zuò shénme ne?",
      "meaning": "Bây giờ bạn đang làm gì thế?"
    }
  },
  {
    "id": 79,
    "hanzi": "今天",
    "pinyin": "jīntiān",
    "hanviet": "Kim thiên",
    "meaning": "Hôm nay",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "人 (Nhân)",
    "strokes": 8,
    "mnemonic": "Bầu trời (天) của thời khắc hiện tại này (今).",
    "example": {
      "hanzi": "今天天气晴朗，微风习习。",
      "pinyin": "Jīntiān tiānqì qínglǎng, wēifēng xíxí.",
      "meaning": "Hôm nay trời nắng ráo, gió nhẹ hiu hiu."
    }
  },
  {
    "id": 80,
    "hanzi": "明天",
    "pinyin": "míngtiān",
    "hanviet": "Minh thiên",
    "meaning": "Ngày mai",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "日 (Nhật)",
    "strokes": 12,
    "mnemonic": "Mặt trời (日) cùng mặt trăng (月) chiếu rạng ngày mai tươi sáng (明).",
    "example": {
      "hanzi": "明天见，祝你好运！",
      "pinyin": "Míngtiān jiàn, zhù nǐ hǎoyùn!",
      "meaning": "Mai gặp lại nhé, chúc bạn may mắn!"
    }
  },
  {
    "id": 81,
    "hanzi": "昨天",
    "pinyin": "zuótiān",
    "hanviet": "Tạc thiên",
    "meaning": "Hôm qua",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "日 (Nhật)",
    "strokes": 13,
    "mnemonic": "Mặt trời (日) của ngày đã qua đi (乍).",
    "example": {
      "hanzi": "昨天下了一整天的雨。",
      "pinyin": "Zuótiān xià le yì zhěng tiān de yǔ.",
      "meaning": "Hôm qua trời đã mưa suốt cả ngày."
    }
  },
  {
    "id": 82,
    "hanzi": "上午",
    "pinyin": "shàngwǔ",
    "hanviet": "Thượng ngọ",
    "meaning": "Buổi sáng (trước 12h)",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "一 (Nhất)",
    "strokes": 7,
    "mnemonic": "Khoảng thời gian phía trên trước buổi trưa chính ngọ (午).",
    "example": {
      "hanzi": "上午我有两节汉语课。",
      "pinyin": "Shàngwǔ wǒ yǒu liǎng jié Hànyǔ kè.",
      "meaning": "Buổi sáng tôi có hai tiết tiếng Trung."
    }
  },
  {
    "id": 83,
    "hanzi": "中午",
    "pinyin": "zhōngwǔ",
    "hanviet": "Trung ngọ",
    "meaning": "Buổi trưa (khoảng 12h)",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "丨 (Sổ)",
    "strokes": 8,
    "mnemonic": "Chính giữa (中) ban ngày bóng nắng rọi đỉnh đầu.",
    "example": {
      "hanzi": "中午我们一起吃午饭吧。",
      "pinyin": "Zhōngwǔ wǒmen yìqǐ chī wǔfàn ba.",
      "meaning": "Buổi trưa chúng mình cùng ăn cơm trưa nhé."
    }
  },
  {
    "id": 84,
    "hanzi": "下午",
    "pinyin": "xiàwǔ",
    "hanviet": "Hạ ngọ",
    "meaning": "Buổi chiều",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "一 (Nhất)",
    "strokes": 7,
    "mnemonic": "Khoảng thời gian sau buổi trưa mặt trời hạ dần (下).",
    "example": {
      "hanzi": "下午三点我们去操场踢足球。",
      "pinyin": "Xiàwǔ sān diǎn wǒmen qù cāochǎng tī zúqiú.",
      "meaning": "Chiều 3 giờ chúng tôi ra sân bóng đá."
    }
  },
  {
    "id": 85,
    "hanzi": "时候",
    "pinyin": "shíhou",
    "hanviet": "Thời hậu",
    "meaning": "Thời điểm, lúc, khi",
    "level": "HSK 1",
    "topic": "Thời gian",
    "radical": "日 (Nhật)",
    "strokes": 20,
    "mnemonic": "Thời khắc mặt trời chiếu ngóng đợi (候) lúc gặp gỡ.",
    "example": {
      "hanzi": "你什么时候回国？",
      "pinyin": "Nǐ shénme shíhou huíguó?",
      "meaning": "Khi nào bạn về nước?"
    }
  },
  {
    "id": 86,
    "hanzi": "上",
    "pinyin": "shàng",
    "hanviet": "Thượng",
    "meaning": "Trên, lên",
    "level": "HSK 1",
    "topic": "Phương hướng",
    "radical": "一 (Nhất)",
    "strokes": 3,
    "mnemonic": "Nét dọc dựng trên nét ngang định hướng lên cao.",
    "example": {
      "hanzi": "书在桌子上。",
      "pinyin": "Shū zài zhuōzi shang.",
      "meaning": "Sách ở trên bàn."
    }
  },
  {
    "id": 87,
    "hanzi": "下",
    "pinyin": "xià",
    "hanviet": "Hạ",
    "meaning": "Dưới, xuống",
    "level": "HSK 1",
    "topic": "Phương hướng",
    "radical": "一 (Nhất)",
    "strokes": 3,
    "mnemonic": "Nét chấm chỉ xuống phía dưới nét ngang.",
    "example": {
      "hanzi": "小猫在椅子下睡觉。",
      "pinyin": "Xiǎomāo zài yǐzi xià shuìjiào.",
      "meaning": "Chú mèo con đang ngủ dưới gầm ghế."
    }
  },
  {
    "id": 88,
    "hanzi": "前",
    "pinyin": "qián",
    "hanviet": "Tiền",
    "meaning": "Trước, phía trước",
    "level": "HSK 1",
    "topic": "Phương hướng",
    "radical": "刂 (Đao)",
    "strokes": 9,
    "mnemonic": "Dùng đao tiến lên phía trước khai hoang bờ cõi.",
    "example": {
      "hanzi": "学校前面有一个大公园。",
      "pinyin": "Xuéxiào qiánmiàn yǒu yí gè dà gōngyuán.",
      "meaning": "Phía trước trường học có một công viên lớn."
    }
  },
  {
    "id": 89,
    "hanzi": "后",
    "pinyin": "hòu",
    "hanviet": "Hậu",
    "meaning": "Sau, phía sau",
    "level": "HSK 1",
    "topic": "Phương hướng",
    "radical": "口 (Khẩu)",
    "strokes": 6,
    "mnemonic": "Người đi sau cất bước chậm rãi quan sát.",
    "example": {
      "hanzi": "饭店在超市后面。",
      "pinyin": "Fàndiàn zài chāoshì hòumiàn.",
      "meaning": "Nhà hàng ở phía sau siêu thị."
    }
  },
  {
    "id": 90,
    "hanzi": "里",
    "pinyin": "lǐ",
    "hanviet": "Lý",
    "meaning": "Bên trong, trong",
    "level": "HSK 1",
    "topic": "Phương hướng",
    "radical": "里 (Lý)",
    "strokes": 7,
    "mnemonic": "Đồng ruộng (田) đất đai (土) sinh sôi bên trong bờ cõi.",
    "example": {
      "hanzi": "书包里有什么？",
      "pinyin": "Shūbāo lǐ yǒu shénme?",
      "meaning": "Bên trong cặp sách có những gì?"
    }
  },
  {
    "id": 91,
    "hanzi": "是",
    "pinyin": "shì",
    "hanviet": "Thị",
    "meaning": "Là, đúng",
    "level": "HSK 1",
    "topic": "Động từ",
    "radical": "日 (Nhật)",
    "strokes": 9,
    "mnemonic": "Mặt trời (日) mọc đúng hẹn soi sáng chân lý.",
    "example": {
      "hanzi": "我是汉语老师。",
      "pinyin": "Wǒ shì Hànyǔ lǎoshī.",
      "meaning": "Tôi là giáo viên dạy tiếng Trung."
    }
  },
  {
    "id": 92,
    "hanzi": "有",
    "pinyin": "yǒu",
    "hanviet": "Hữu",
    "meaning": "Có, tồn tại",
    "level": "HSK 1",
    "topic": "Động từ",
    "radical": "月 (Nguyệt)",
    "strokes": 6,
    "mnemonic": "Bàn tay nắm lấy vầng trăng biểu thị sự sở hữu.",
    "example": {
      "hanzi": "你有一张中国地图吗？",
      "pinyin": "Nǐ yǒu yì zhāng Zhōngguó dìtú ma?",
      "meaning": "Bạn có một tấm bản đồ Trung Quốc không?"
    }
  },
  {
    "id": 93,
    "hanzi": "看",
    "pinyin": "kàn",
    "hanviet": "Khán",
    "meaning": "Xem, nhìn, đọc",
    "level": "HSK 1",
    "topic": "Động từ",
    "radical": "目 (Mục)",
    "strokes": 9,
    "mnemonic": "Đưa bàn tay (手) che lên mắt (目) để nhìn thật rõ xa xăm.",
    "example": {
      "hanzi": "我喜欢看中国电影。",
      "pinyin": "Wǒ xǐhuan kàn Zhōngguó diànyǐng.",
      "meaning": "Tôi thích xem phim điện ảnh Trung Quốc."
    }
  },
  {
    "id": 94,
    "hanzi": "听",
    "pinyin": "tīng",
    "hanviet": "Thính",
    "meaning": "Nghe",
    "level": "HSK 1",
    "topic": "Động từ",
    "radical": "口 (Khẩu)",
    "strokes": 7,
    "mnemonic": "Mở miệng lắng tai nghe âm thanh chiếc rìu (斤) chặt cây.",
    "example": {
      "hanzi": "每天听汉语录音可以提高听力。",
      "pinyin": "Měitiān tīng Hànyǔ lùyīn kěyǐ tígāo tīnglì.",
      "meaning": "Mỗi ngày nghe băng tiếng Trung có thể nâng cao kỹ năng nghe."
    }
  },
  {
    "id": 95,
    "hanzi": "说",
    "pinyin": "shuō",
    "hanviet": "Thuyết",
    "meaning": "Nói",
    "level": "HSK 1",
    "topic": "Động từ",
    "radical": "讠(Ngôn)",
    "strokes": 9,
    "mnemonic": "Dùng lời nói (讠) thuyết phục mọi người vui vẻ.",
    "example": {
      "hanzi": "请你说慢一点儿。",
      "pinyin": "Qǐng nǐ shuō màn yìdiǎnr.",
      "meaning": "Xin bạn hãy nói chậm lại một chút."
    }
  },
  {
    "id": 96,
    "hanzi": "读",
    "pinyin": "dú",
    "hanviet": "Độc",
    "meaning": "Đọc",
    "level": "HSK 1",
    "topic": "Động từ",
    "radical": "讠(Ngôn)",
    "strokes": 10,
    "mnemonic": "Dùng lời nói (讠) xướng to câu chữ buôn bán (卖).",
    "example": {
      "hanzi": "我们每天早晨读课文。",
      "pinyin": "Wǒmen měitiān zǎochén dú kèwén.",
      "meaning": "Mỗi sáng chúng tôi đều đọc bài khóa."
    }
  },
  {
    "id": 97,
    "hanzi": "写",
    "pinyin": "xiě",
    "hanviet": "Tả",
    "meaning": "Viết",
    "level": "HSK 1",
    "topic": "Động từ",
    "radical": "冖 (Mịch)",
    "strokes": 5,
    "mnemonic": "Dưới mái che cặm cụi nắn nót viết từng nét chữ.",
    "example": {
      "hanzi": "请在练习本上写汉字。",
      "pinyin": "Qǐng zài liànxíběn shang xiě hànzì.",
      "meaning": "Xin hãy viết chữ Hán vào vở bài tập."
    }
  },
  {
    "id": 98,
    "hanzi": "吃",
    "pinyin": "chī",
    "hanviet": "Cật",
    "meaning": "Ăn",
    "level": "HSK 1",
    "topic": "Ăn uống",
    "radical": "口 (Khẩu)",
    "strokes": 6,
    "mnemonic": "Mở miệng (口) thưởng thức món ăn đưa vào dạ dày.",
    "example": {
      "hanzi": "你想吃中国饺子吗？",
      "pinyin": "Nǐ xiǎng chī Zhōngguó jiǎozi ma?",
      "meaning": "Bạn có muốn ăn sủi cảo Trung Quốc không?"
    }
  },
  {
    "id": 99,
    "hanzi": "喝",
    "pinyin": "hē",
    "hanviet": "Hát",
    "meaning": "Uống",
    "level": "HSK 1",
    "topic": "Ăn uống",
    "radical": "口 (Khẩu)",
    "strokes": 12,
    "mnemonic": "Dùng miệng (口) uống từng ngụm nước giải khát dưới nắng (日).",
    "example": {
      "hanzi": "天气很热，请喝杯冰水吧。",
      "pinyin": "Tiānqì hěn rè, qǐng hē bēi bīngshuǐ ba.",
      "meaning": "Trời rất nóng, xin mời uống cốc nước đá."
    }
  },
  {
    "id": 100,
    "hanzi": "买",
    "pinyin": "mǎi",
    "hanviet": "Mãi",
    "meaning": "Mua",
    "level": "HSK 1",
    "topic": "Mua sắm",
    "radical": "乙 (Ất)",
    "strokes": 6,
    "mnemonic": "Dùng đồng tiền mua sắm hàng hóa mang về nhà.",
    "example": {
      "hanzi": "我想买两张去北京的火车票。",
      "pinyin": "Wǒ xiǎng mǎi liǎng zhāng qù Běijīng de huǒchēpiào.",
      "meaning": "Tôi muốn mua hai vé tàu hỏa đi Bắc Kinh."
    }
  },
  {
    "id": 101,
    "hanzi": "去",
    "pinyin": "qù",
    "hanviet": "Khứ",
    "meaning": "Đi",
    "level": "HSK 1",
    "topic": "Động từ",
    "radical": "厶 (Khư)",
    "strokes": 5,
    "mnemonic": "Rời khỏi đất đai (土) cất bước ra đi.",
    "example": {
      "hanzi": "下午我们一起去超市买水果。",
      "pinyin": "Xiàwǔ wǒmen yìqǐ qù chāoshì mǎi shuǐguǒ.",
      "meaning": "Chiều nay chúng ta cùng đi siêu thị mua hoa quả."
    }
  },
  {
    "id": 102,
    "hanzi": "来",
    "pinyin": "lái",
    "hanviet": "Lai",
    "meaning": "Đến, tới",
    "level": "HSK 1",
    "topic": "Động từ",
    "radical": "木 (Mộc)",
    "strokes": 7,
    "mnemonic": "Cây lúa trĩu hạt báo hiệu mùa màng bội thu đã đến.",
    "example": {
      "hanzi": "欢迎你来我家做客！",
      "pinyin": "Huānyíng nǐ lái wǒ jiā zuòkè!",
      "meaning": "Hoan nghênh bạn tới nhà tôi chơi!"
    }
  },
  {
    "id": 103,
    "hanzi": "回",
    "pinyin": "huí",
    "hanviet": "Hồi",
    "meaning": "Về, quay lại",
    "level": "HSK 1",
    "topic": "Động từ",
    "radical": "囗 (Vi)",
    "strokes": 6,
    "mnemonic": "Hai vòng xoáy vuông vức trở về điểm xuất phát.",
    "example": {
      "hanzi": "太晚了，我们该回家了。",
      "pinyin": "Tài wǎn le, wǒmen gāi huí jiā le.",
      "meaning": "Muộn quá rồi, chúng ta nên về nhà thôi."
    }
  },
  {
    "id": 104,
    "hanzi": "做",
    "pinyin": "zuò",
    "hanviet": "Tác",
    "meaning": "Làm, chế biến",
    "level": "HSK 1",
    "topic": "Động từ",
    "radical": "亻 (Nhân đứng)",
    "strokes": 11,
    "mnemonic": "Con người (亻) cần mẫn làm việc tạo ra thành quả cổ kính (故).",
    "example": {
      "hanzi": "你周末喜欢做什么？",
      "pinyin": "Nǐ zhōumò xǐhuan zuò shénme?",
      "meaning": "Cuối tuần bạn thích làm gì?"
    }
  },
  {
    "id": 105,
    "hanzi": "坐",
    "pinyin": "zuò",
    "hanviet": "Tọa",
    "meaning": "Ngồi, đi (xe/máy bay)",
    "level": "HSK 1",
    "topic": "Động từ",
    "radical": "土 (Thổ)",
    "strokes": 7,
    "mnemonic": "Hai người (从) ngồi đối diện nhau trên mặt đất (土).",
    "example": {
      "hanzi": "请坐，喝杯热茶吧。",
      "pinyin": "Qǐng zuò, hē bēi rè chá ba.",
      "meaning": "Xin mời ngồi, uống chén trà nóng nhé."
    }
  },
  {
    "id": 106,
    "hanzi": "住",
    "pinyin": "zhù",
    "hanviet": "Trú",
    "meaning": "Ở, cư trú",
    "level": "HSK 1",
    "topic": "Động từ",
    "radical": "亻 (Nhân đứng)",
    "strokes": 7,
    "mnemonic": "Người (亻) thắp ngọn đèn làm chủ (主) tổ ấm an cư.",
    "example": {
      "hanzi": "你住在哪个城市？",
      "pinyin": "Nǐ zhù zài nǎ ge chéngshì?",
      "meaning": "Bạn sinh sống ở thành phố nào?"
    }
  },
  {
    "id": 107,
    "hanzi": "叫",
    "pinyin": "jiào",
    "hanviet": "Khiếu",
    "meaning": "Tên là, gọi",
    "level": "HSK 1",
    "topic": "Chào hỏi",
    "radical": "口 (Khẩu)",
    "strokes": 5,
    "mnemonic": "Mở miệng (口) cất tiếng gọi tên ai đó.",
    "example": {
      "hanzi": "我叫李明，是越南留学生。",
      "pinyin": "Wǒ jiào Lǐ Míng, shì Yuènán liúxuéshēng.",
      "meaning": "Tôi tên là Lý Minh, là du học sinh Việt Nam."
    }
  },
  {
    "id": 108,
    "hanzi": "爱",
    "pinyin": "ài",
    "hanviet": "Ái",
    "meaning": "Yêu, thương yêu",
    "level": "HSK 1",
    "topic": "Cảm xúc",
    "radical": "爫 (Trảo)",
    "strokes": 10,
    "mnemonic": "Bàn tay che chở nâng niu trái tim (心) chân thành.",
    "example": {
      "hanzi": "我爱我的爸爸妈妈。",
      "pinyin": "Wǒ ài wǒ de bàba māma.",
      "meaning": "Tôi yêu bố mẹ của mình."
    }
  },
  {
    "id": 109,
    "hanzi": "喜欢",
    "pinyin": "xǐhuan",
    "hanviet": "Hỉ hoan",
    "meaning": "Thích, yêu mến",
    "level": "HSK 1",
    "topic": "Cảm xúc",
    "radical": "口 (Khẩu)",
    "strokes": 18,
    "mnemonic": "Niềm vui sướng (喜) hân hoan (欢) dâng trào trong lòng.",
    "example": {
      "hanzi": "我非常喜欢学习汉语。",
      "pinyin": "Wǒ fēicháng xǐhuan xuéxí Hànyǔ.",
      "meaning": "Tôi vô cùng yêu thích học tiếng Trung."
    }
  },
  {
    "id": 110,
    "hanzi": "想",
    "pinyin": "xiǎng",
    "hanviet": "Tưởng",
    "meaning": "Muốn, nghĩ, nhớ",
    "level": "HSK 1",
    "topic": "Cảm xúc",
    "radical": "心 (Tâm)",
    "strokes": 13,
    "mnemonic": "Quan sát cây cối và mắt (相) rồi gửi gắm tâm tư (心).",
    "example": {
      "hanzi": "我想去中国长城看看。",
      "pinyin": "Wǒ xiǎng qù Zhōngguó Chángchéng kànkan.",
      "meaning": "Tôi muốn đến Vạn Lý Trường Thành Trung Quốc ngắm nhìn."
    }
  },
  {
    "id": 111,
    "hanzi": "会",
    "pinyin": "huì",
    "hanviet": "Hội",
    "meaning": "Biết (qua học tập), sẽ",
    "level": "HSK 1",
    "topic": "Năng nguyện",
    "radical": "人 (Nhân)",
    "strokes": 6,
    "mnemonic": "Nhiều người hội họp tụ tập trao đổi kỹ năng.",
    "example": {
      "hanzi": "你会说汉语吗？",
      "pinyin": "Nǐ huì shuō Hànyǔ ma?",
      "meaning": "Bạn có biết nói tiếng Trung không?"
    }
  },
  {
    "id": 112,
    "hanzi": "能",
    "pinyin": "néng",
    "hanviet": "Năng",
    "meaning": "Có thể (khả năng thực tế)",
    "level": "HSK 1",
    "topic": "Năng nguyện",
    "radical": "月 (Nguyệt)",
    "strokes": 10,
    "mnemonic": "Hình chú gấu khỏe khoắn đầy năng lực.",
    "example": {
      "hanzi": "今天下午你能来我家吗？",
      "pinyin": "Jīntiān xiàwǔ nǐ néng lái wǒ jiā ma?",
      "meaning": "Chiều nay bạn có thể qua nhà tôi không?"
    }
  },
  {
    "id": 113,
    "hanzi": "认识",
    "pinyin": "rènshi",
    "hanviet": "Nhận thức",
    "meaning": "Quen biết, nhận ra",
    "level": "HSK 1",
    "topic": "Giao tiếp",
    "radical": "讠(Ngôn)",
    "strokes": 11,
    "mnemonic": "Dùng lời nói (讠) tìm hiểu và nhận ra tri thức (识).",
    "example": {
      "hanzi": "很高兴认识你！",
      "pinyin": "Hěn gāoxìng rènshi nǐ!",
      "meaning": "Rất vui được quen biết bạn!"
    }
  },
  {
    "id": 114,
    "hanzi": "睡觉",
    "pinyin": "shuìjiào",
    "hanviet": "Thụy giác",
    "meaning": "Ngủ, đi ngủ",
    "level": "HSK 1",
    "topic": "Đời sống",
    "radical": "目 (Mục)",
    "strokes": 20,
    "mnemonic": "Mắt (目) rũ xuống nghỉ ngơi chìm vào giấc mơ êm đềm.",
    "example": {
      "hanzi": "太累了，我想先睡觉。",
      "pinyin": "Tài lèi le, wǒ xiǎng xiān shuìjiào.",
      "meaning": "Mệt quá rồi, tôi muốn ngủ trước."
    }
  },
  {
    "id": 115,
    "hanzi": "工作",
    "pinyin": "gōngzuò",
    "hanviet": "Công tác",
    "meaning": "Làm việc, công việc",
    "level": "HSK 1",
    "topic": "Công việc",
    "radical": "亻 (Nhân đứng)",
    "strokes": 10,
    "mnemonic": "Con người dùng sức lao động (工) tạo nên thành quả (作).",
    "example": {
      "hanzi": "他每天努力工作。",
      "pinyin": "Tā měitiān nǔlì gōngzuò.",
      "meaning": "Anh ấy mỗi ngày đều nỗ lực làm việc."
    }
  },
  {
    "id": 116,
    "hanzi": "学习",
    "pinyin": "xuéxí",
    "hanviet": "Học tập",
    "meaning": "Học tập, rèn luyện",
    "level": "HSK 1",
    "topic": "Trường học",
    "radical": "子 (Tử)",
    "strokes": 11,
    "mnemonic": "Học hỏi kiến thức rồi siêng năng thực hành như chim tập bay.",
    "example": {
      "hanzi": "我们在HanziGo努力学习汉语。",
      "pinyin": "Wǒmen zài HanziGo nǔlì xuéxí Hànyǔ.",
      "meaning": "Chúng tôi nỗ lực học tiếng Trung trên HanziGo."
    }
  },
  {
    "id": 117,
    "hanzi": "好",
    "pinyin": "hǎo",
    "hanviet": "Hảo",
    "meaning": "Tốt, đẹp, khỏe",
    "level": "HSK 1",
    "topic": "Tính từ",
    "radical": "女 (Nữ)",
    "strokes": 6,
    "mnemonic": "Người phụ nữ (女) sinh được con trai (子) là điều tốt đẹp.",
    "example": {
      "hanzi": "今天天气很好。",
      "pinyin": "Jīntiān tiānqì hěn hǎo.",
      "meaning": "Hôm nay thời tiết rất đẹp."
    }
  },
  {
    "id": 118,
    "hanzi": "大",
    "pinyin": "dà",
    "hanviet": "Đại",
    "meaning": "To, lớn",
    "level": "HSK 1",
    "topic": "Tính từ",
    "radical": "大 (Đại)",
    "strokes": 3,
    "mnemonic": "Con người dang rộng hai cánh tay biểu thị sự to lớn.",
    "example": {
      "hanzi": "这个苹果很大很甜。",
      "pinyin": "Zhè ge píngguǒ hěn dà hěn tián.",
      "meaning": "Quả táo này rất to và rất ngọt."
    }
  },
  {
    "id": 119,
    "hanzi": "小",
    "pinyin": "xiǎo",
    "hanviet": "Tiểu",
    "meaning": "Nhỏ, bé",
    "level": "HSK 1",
    "topic": "Tính từ",
    "radical": "小 (Tiểu)",
    "strokes": 3,
    "mnemonic": "Chia tách nhỏ giọt ở giữa hai bên nhỏ bé.",
    "example": {
      "hanzi": "这间卧室比较小。",
      "pinyin": "Zhè jiān wòshì bǐjiào xiǎo.",
      "meaning": "Phòng ngủ này tương đối nhỏ."
    }
  },
  {
    "id": 120,
    "hanzi": "多",
    "pinyin": "duō",
    "hanviet": "Đa",
    "meaning": "Nhiều",
    "level": "HSK 1",
    "topic": "Tính từ",
    "radical": "夕 (Tịch)",
    "strokes": 6,
    "mnemonic": "Nhiều đêm trăng (夕) xếp chồng lên nhau thành nhiều.",
    "example": {
      "hanzi": "这里有很多中国朋友。",
      "pinyin": "Zhèlǐ yǒu hěn duō Zhōngguó péngyou.",
      "meaning": "Ở đây có rất nhiều bạn Trung Quốc."
    }
  },
  {
    "id": 121,
    "hanzi": "少",
    "pinyin": "shǎo",
    "hanviet": "Thiểu",
    "meaning": "Ít, thiếu",
    "level": "HSK 1",
    "topic": "Tính từ",
    "radical": "小 (Tiểu)",
    "strokes": 4,
    "mnemonic": "Chữ tiểu (小) phẩy thêm một nét nữa biểu thị sự ít ỏi.",
    "example": {
      "hanzi": "今天来参加活动的人很少。",
      "pinyin": "Jīntiān lái cānjiā huódòng de rén hěn shǎo.",
      "meaning": "Hôm nay người tới tham gia hoạt động rất ít."
    }
  },
  {
    "id": 122,
    "hanzi": "冷",
    "pinyin": "lěng",
    "hanviet": "Lãnh",
    "meaning": "Lạnh, rét",
    "level": "HSK 1",
    "topic": "Thời tiết",
    "radical": "冫(Băng)",
    "strokes": 7,
    "mnemonic": "Nước đóng băng (冫) truyền lệnh (令) gió mùa đông lạnh buốt.",
    "example": {
      "hanzi": "冬天北京的天气非常冷。",
      "pinyin": "Dōngtiān Běijīng de tiānqì fēicháng lěng.",
      "meaning": "Mùa đông thời tiết Bắc Kinh vô cùng lạnh."
    }
  },
  {
    "id": 123,
    "hanzi": "热",
    "pinyin": "rè",
    "hanviet": "Nhiệt",
    "meaning": "Nóng, ấm",
    "level": "HSK 1",
    "topic": "Thời tiết",
    "radical": "灬 (Hỏa)",
    "strokes": 10,
    "mnemonic": "Đốm lửa (灬) hun nóng đất đai (土) làm nhiệt độ tăng cao.",
    "example": {
      "hanzi": "夏天河内天气很热。",
      "pinyin": "Xiàtiān Hénèi tiānqì hěn rè.",
      "meaning": "Mùa hè thời tiết Hà Nội rất nóng."
    }
  },
  {
    "id": 124,
    "hanzi": "高兴",
    "pinyin": "gāoxìng",
    "hanviet": "Cao hứng",
    "meaning": "Vui vẻ, hớn hở",
    "level": "HSK 1",
    "topic": "Cảm xúc",
    "radical": "高 (Cao)",
    "strokes": 16,
    "mnemonic": "Tâm trạng thăng hoa lên cao (高) hứng khởi rộn ràng (兴).",
    "example": {
      "hanzi": "今天收到礼物我很高兴。",
      "pinyin": "Jīntiān shōudào lǐwù wǒ hěn gāoxìng.",
      "meaning": "Hôm nay nhận được quà tôi rất vui."
    }
  },
  {
    "id": 125,
    "hanzi": "漂亮",
    "pinyin": "piàoliang",
    "hanviet": "Phiêu lượng",
    "meaning": "Xinh đẹp, đẹp đẽ",
    "level": "HSK 1",
    "topic": "Tính từ",
    "radical": "氵(Chấm thủy)",
    "strokes": 14,
    "mnemonic": "Nước trong xanh (氵) phản chiếu ánh sáng (亮) xinh đẹp tuyệt trần.",
    "example": {
      "hanzi": "这件中国旗袍真漂亮！",
      "pinyin": "Zhè jiàn Zhōngguó qípáo zhēn piàoliang!",
      "meaning": "Bộ sườn xám Trung Quốc này thật xinh đẹp!"
    }
  },
  {
    "id": 126,
    "hanzi": "不",
    "pinyin": "bù",
    "hanviet": "Bất",
    "meaning": "Không (phủ định hiện tại/tương lai)",
    "level": "HSK 1",
    "topic": "Phó từ",
    "radical": "一 (Nhất)",
    "strokes": 4,
    "mnemonic": "Hạt mầm chưa đâm chồi vươn lên mặt đất.",
    "example": {
      "hanzi": "我不喝咖啡，我喝茶。",
      "pinyin": "Wǒ bù hē kāfēi, wǒ hē chá.",
      "meaning": "Tôi không uống cà phê, tôi uống trà."
    }
  },
  {
    "id": 127,
    "hanzi": "没",
    "pinyin": "méi",
    "hanviet": "Một",
    "meaning": "Chưa, không có",
    "level": "HSK 1",
    "topic": "Phó từ",
    "radical": "氵(Chấm thủy)",
    "strokes": 7,
    "mnemonic": "Chìm ngập dưới dòng nước (氵) không thấy đâu nữa.",
    "example": {
      "hanzi": "我还没吃早饭。",
      "pinyin": "Wǒ hái méi chī zǎofàn.",
      "meaning": "Tôi vẫn chưa ăn bữa sáng."
    }
  },
  {
    "id": 128,
    "hanzi": "很",
    "pinyin": "hěn",
    "hanviet": "Khẩn",
    "meaning": "Rất, lắm",
    "level": "HSK 1",
    "topic": "Phó từ",
    "radical": "彳(Chim chích)",
    "strokes": 9,
    "mnemonic": "Bước chân dồn dập quyết tâm thực hiện mức độ cao.",
    "example": {
      "hanzi": "中国菜很好吃。",
      "pinyin": "Zhōngguó cài hěn hǎochī.",
      "meaning": "Món ăn Trung Quốc rất ngon."
    }
  },
  {
    "id": 129,
    "hanzi": "太",
    "pinyin": "tài",
    "hanviet": "Thái",
    "meaning": "Quá, lắm (thường đi với 了)",
    "level": "HSK 1",
    "topic": "Phó từ",
    "radical": "大 (Đại)",
    "strokes": 4,
    "mnemonic": "Chữ đại (大) thêm một giọt biểu thị sự quá mức.",
    "example": {
      "hanzi": "太好了，我们一起去吧！",
      "pinyin": "Tài hǎo le, wǒmen yìqǐ qù ba!",
      "meaning": "Quá tốt rồi, chúng mình cùng đi nhé!"
    }
  },
  {
    "id": 130,
    "hanzi": "都",
    "pinyin": "dōu",
    "hanviet": "Đô",
    "meaning": "Đều, tất cả",
    "level": "HSK 1",
    "topic": "Phó từ",
    "radical": "阝(Ấp)",
    "strokes": 10,
    "mnemonic": "Toàn bộ vùng đất kinh đô quy tụ muôn dân.",
    "example": {
      "hanzi": "我们都是汉语专业的学生。",
      "pinyin": "Wǒmen dōu shì Hànyǔ zhuānyè de xuésheng.",
      "meaning": "Chúng tôi đều là sinh viên chuyên ngành tiếng Trung."
    }
  },
  {
    "id": 131,
    "hanzi": "帮助",
    "pinyin": "bāngzhù",
    "hanviet": "Bang trợ",
    "meaning": "Giúp đỡ, tương trợ",
    "level": "HSK 2",
    "topic": "Giao tiếp",
    "radical": "巾 (Khăn)",
    "strokes": 16,
    "mnemonic": "Dùng tấm lòng và sức lực (力) tương trợ người hoạn nạn.",
    "example": {
      "hanzi": "谢谢大家的热情帮助！",
      "pinyin": "Xièxie dàjiā de rèqíng bāngzhù!",
      "meaning": "Cảm ơn sự giúp đỡ nhiệt tình của mọi người!"
    }
  },
  {
    "id": 132,
    "hanzi": "跑步",
    "pinyin": "pǎobù",
    "hanviet": "Bào bộ",
    "meaning": "Chạy bộ",
    "level": "HSK 2",
    "topic": "Thể thao",
    "radical": "足 (Túc)",
    "strokes": 19,
    "mnemonic": "Đôi chân (足) cất từng bước (步) chạy nhanh rèn luyện thân thể.",
    "example": {
      "hanzi": "每天早晨我都去公园跑步。",
      "pinyin": "Měitiān zǎochén wǒ dōu qù gōngyuán pǎobù.",
      "meaning": "Mỗi sáng tôi đều ra công viên chạy bộ."
    }
  },
  {
    "id": 133,
    "hanzi": "踢足球",
    "pinyin": "tī zúqiú",
    "hanviet": "Thích túc cầu",
    "meaning": "Đá bóng, chơi đá banh",
    "level": "HSK 2",
    "topic": "Thể thao",
    "radical": "足 (Túc)",
    "strokes": 26,
    "mnemonic": "Dùng bàn chân (足) đá quả cầu tròn (球).",
    "example": {
      "hanzi": "男孩子们很喜欢在操场上踢足球。",
      "pinyin": "Nánháizimen hěn xǐhuan zài cāochǎng shang tī zúqiú.",
      "meaning": "Các bạn nam rất thích đá bóng trên sân vận động."
    }
  },
  {
    "id": 134,
    "hanzi": "游泳",
    "pinyin": "yóuyǒng",
    "hanviet": "Du vịnh",
    "meaning": "Bơi lội",
    "level": "HSK 2",
    "topic": "Thể thao",
    "radical": "氵(Chấm thủy)",
    "strokes": 20,
    "mnemonic": "Dưới làn nước (氵) thỏa sức bơi lội vẫy vùng.",
    "example": {
      "hanzi": "夏天去海边游泳很舒服。",
      "pinyin": "Xiàtiān qù hǎibiān yóuyǒng hěn shūfu.",
      "meaning": "Mùa hè đi bơi ở biển rất dễ chịu."
    }
  },
  {
    "id": 135,
    "hanzi": "唱歌",
    "pinyin": "chànggē",
    "hanviet": "Xướng ca",
    "meaning": "Hát, ca hát",
    "level": "HSK 2",
    "topic": "Đời sống",
    "radical": "口 (Khẩu)",
    "strokes": 25,
    "mnemonic": "Dùng miệng (口) cất tiếng hát vang bài ca yêu đời.",
    "example": {
      "hanzi": "星期六晚上我们去唱KTV唱歌吧。",
      "pinyin": "Xīngqīliù wǎnshang wǒmen qù chàng KTV chànggē ba.",
      "meaning": "Tối thứ bảy chúng mình đi hát karaoke nhé."
    }
  },
  {
    "id": 136,
    "hanzi": "跳舞",
    "pinyin": "tiàowǔ",
    "hanviet": "Khiêu vũ",
    "meaning": "Khiêu vũ, nhảy múa",
    "level": "HSK 2",
    "topic": "Đời sống",
    "radical": "足 (Túc)",
    "strokes": 27,
    "mnemonic": "Đôi chân nhảy nhót theo nhịp điệu vũ đạo thướt tha.",
    "example": {
      "hanzi": "她从小就学习中国传统跳舞。",
      "pinyin": "Tā cóngxiǎo jiù xuéxí Zhōngguó chuántǒng tiàowǔ.",
      "meaning": "Cô ấy từ nhỏ đã học múa truyền thống Trung Quốc."
    }
  },
  {
    "id": 137,
    "hanzi": "旅游",
    "pinyin": "lǚyóu",
    "hanviet": "Lữ du",
    "meaning": "Du lịch",
    "level": "HSK 2",
    "topic": "Du lịch",
    "radical": "方 (Phương)",
    "strokes": 21,
    "mnemonic": "Mang hành lý đi khắp bốn phương trời ngao du thưởng ngoạn.",
    "example": {
      "hanzi": "今年放假我想去云南旅游。",
      "pinyin": "Jīnnián fàngjià wǒ xiǎng qù Yúnnán lǚyóu.",
      "meaning": "Kỳ nghỉ năm nay tôi muốn đi du lịch Vân Nam."
    }
  },
  {
    "id": 138,
    "hanzi": "生病",
    "pinyin": "shēngbìng",
    "hanviet": "Sinh bệnh",
    "meaning": "Bị ốm, bị bệnh",
    "level": "HSK 2",
    "topic": "Sức khỏe",
    "radical": "疒 (Nạch)",
    "strokes": 15,
    "mnemonic": "Bộ nạch (疒) chỉ người nằm liệt giường vì bệnh tật.",
    "example": {
      "hanzi": "天气变冷了，小心不要生病。",
      "pinyin": "Tiānqì biàn lěng le, xiǎoxīn bú yào shēngbìng.",
      "meaning": "Thời tiết lạnh rồi, cẩn thận kẻo bị ốm."
    }
  },
  {
    "id": 139,
    "hanzi": "身体",
    "pinyin": "shēntǐ",
    "hanviet": "Thân thể",
    "meaning": "Cơ thể, sức khỏe",
    "level": "HSK 2",
    "topic": "Sức khỏe",
    "radical": "身 (Thân)",
    "strokes": 14,
    "mnemonic": "Thân thể (身) và thể xác (体) là vốn quý nhất của con người.",
    "example": {
      "hanzi": "祝您身体健康，万事如意！",
      "pinyin": "Zhù nín shēntǐ jiànkāng, wànshì rúyì!",
      "meaning": "Kính chúc bác sức khỏe dồi dào, vạn sự như ý!"
    }
  },
  {
    "id": 140,
    "hanzi": "眼睛",
    "pinyin": "yǎnjing",
    "hanviet": "Nhãn tinh",
    "meaning": "Đôi mắt",
    "level": "HSK 2",
    "topic": "Cơ thể",
    "radical": "目 (Mục)",
    "strokes": 22,
    "mnemonic": "Đôi mắt (目) sáng long lanh như hạt ngọc tinh khôi.",
    "example": {
      "hanzi": "长时间看电脑对眼睛不好。",
      "pinyin": "Cháng shíjiān kàn diànnǎo duì yǎnjing bù hǎo.",
      "meaning": "Nhìn máy tính lâu không tốt cho mắt."
    }
  },
  {
    "id": 141,
    "hanzi": "哥哥",
    "pinyin": "gēge",
    "hanviet": "Ca Ca",
    "meaning": "Anh trai",
    "level": "HSK 2",
    "topic": "Gia đình",
    "radical": "口 (Khẩu)",
    "strokes": 10,
    "mnemonic": "Hai chữ khả (可) xếp chồng chỉ người anh trưởng thành.",
    "example": {
      "hanzi": "我哥哥在河内当软件工程师。",
      "pinyin": "Wǒ gēge zài Hénèi dāng ruǎnjiàn gōngchéngshī.",
      "meaning": "Anh trai tôi làm kỹ sư phần mềm ở Hà Nội."
    }
  },
  {
    "id": 142,
    "hanzi": "姐姐",
    "pinyin": "jiějie",
    "hanviet": "Tỉ Tỉ",
    "meaning": "Chị gái",
    "level": "HSK 2",
    "topic": "Gia đình",
    "radical": "女 (Nữ)",
    "strokes": 16,
    "mnemonic": "Người phụ nữ (女) nết na thùy mị trong nhà.",
    "example": {
      "hanzi": "姐姐买了一件漂亮的大衣。",
      "pinyin": "Jiějie mǎi le yí jiàn piàoliang de dàyī.",
      "meaning": "Chị gái đã mua một chiếc áo khoác rất đẹp."
    }
  },
  {
    "id": 143,
    "hanzi": "弟弟",
    "pinyin": "dìdi",
    "hanviet": "Đệ Đệ",
    "meaning": "Em trai",
    "level": "HSK 2",
    "topic": "Gia đình",
    "radical": "弓 (Cung)",
    "strokes": 14,
    "mnemonic": "Hình ảnh em nhỏ đeo cung tên chạy nhảy vui vẻ.",
    "example": {
      "hanzi": "我的弟弟今年读高中一年级。",
      "pinyin": "Wǒ de dìdi jīnnián dú gāozhōng yī niánjí.",
      "meaning": "Em trai tôi năm nay học lớp 10."
    }
  },
  {
    "id": 144,
    "hanzi": "妹妹",
    "pinyin": "mèimei",
    "hanviet": "Muội Muội",
    "meaning": "Em gái",
    "level": "HSK 2",
    "topic": "Gia đình",
    "radical": "女 (Nữ)",
    "strokes": 16,
    "mnemonic": "Bé gái (女) sinh sau cùng chưa trưởng thành (未).",
    "example": {
      "hanzi": "妹妹最喜欢吃草莓蛋糕。",
      "pinyin": "Mèimei zuì xǐhuan chī cǎoméi dàngāo.",
      "meaning": "Em gái thích ăn bánh gato dâu tây nhất."
    }
  },
  {
    "id": 145,
    "hanzi": "丈夫",
    "pinyin": "zhàngfu",
    "hanviet": "Trượng phu",
    "meaning": "Người chồng",
    "level": "HSK 2",
    "topic": "Gia đình",
    "radical": "一 (Nhất)",
    "strokes": 7,
    "mnemonic": "Người trượng phu gánh vác việc gia đình trụ cột.",
    "example": {
      "hanzi": "她的丈夫是一名大学教授。",
      "pinyin": "Tā de zhàngfu shì yì míng dàxué jiàoshòu.",
      "meaning": "Chồng cô ấy là giáo sư đại học."
    }
  },
  {
    "id": 146,
    "hanzi": "妻子",
    "pinyin": "qīzi",
    "hanviet": "Thê tử",
    "meaning": "Người vợ",
    "level": "HSK 2",
    "topic": "Gia đình",
    "radical": "女 (Nữ)",
    "strokes": 11,
    "mnemonic": "Người phụ nữ hiền thục vun vén tổ ấm gia đình.",
    "example": {
      "hanzi": "李先生和他的妻子感情非常好。",
      "pinyin": "Lǐ xiānsheng hé tā de qīzi gǎnqíng fēicháng hǎo.",
      "meaning": "Ông Lý và vợ tình cảm rất mặn nồng."
    }
  },
  {
    "id": 147,
    "hanzi": "孩子",
    "pinyin": "háizi",
    "hanviet": "Hài tử",
    "meaning": "Trẻ con, con cái",
    "level": "HSK 2",
    "topic": "Gia đình",
    "radical": "子 (Tử)",
    "strokes": 12,
    "mnemonic": "Đứa trẻ con ngây thơ trong sáng của gia đình.",
    "example": {
      "hanzi": "公园里有很多孩子在快乐地玩耍。",
      "pinyin": "Gōngyuán lǐ yǒu hěn duō háizi zài kuàilè de wánshuǎ.",
      "meaning": "Trong công viên có rất nhiều trẻ em đang vui chơi thỏa thích."
    }
  },
  {
    "id": 148,
    "hanzi": "咖啡",
    "pinyin": "kāfēi",
    "hanviet": "Cà phê",
    "meaning": "Cà phê",
    "level": "HSK 2",
    "topic": "Ăn uống",
    "radical": "口 (Khẩu)",
    "strokes": 16,
    "mnemonic": "Đồ uống dùng miệng (口) nhâm nhi từng ngụm đượm đà.",
    "example": {
      "hanzi": "你想喝热咖啡还是冰咖啡？",
      "pinyin": "Nǐ xiǎng hē rè kāfēi háishi bīng kāfēi?",
      "meaning": "Bạn muốn uống cà phê nóng hay cà phê đá?"
    }
  },
  {
    "id": 149,
    "hanzi": "牛奶",
    "pinyin": "niúnǎi",
    "hanviet": "Ngưu nãi",
    "meaning": "Sữa bò, sữa tươi",
    "level": "HSK 2",
    "topic": "Ăn uống",
    "radical": "牛 (Ngưu)",
    "strokes": 9,
    "mnemonic": "Dòng sữa bổ dưỡng (奶) vắt từ con bò sữa (牛).",
    "example": {
      "hanzi": "睡前喝一杯温牛奶有助于睡眠。",
      "pinyin": "Shuì qián hē yì bēi wēn niúnǎi yǒu zhù yú shuìmián.",
      "meaning": "Trước khi ngủ uống một ly sữa ấm giúp ngủ ngon."
    }
  },
  {
    "id": 150,
    "hanzi": "鸡蛋",
    "pinyin": "jīdàn",
    "hanviet": "Kê đản",
    "meaning": "Trứng gà",
    "level": "HSK 2",
    "topic": "Ăn uống",
    "radical": "鸟 (Điểu)",
    "strokes": 18,
    "mnemonic": "Quả trứng (蛋) do con gà mái (鸡) đẻ ra.",
    "example": {
      "hanzi": "早餐我吃了一个鸡蛋和两片面包。",
      "pinyin": "Zǎocān wǒ chī le yí gè jīdàn hé liǎng piàn miànbāo.",
      "meaning": "Bữa sáng tôi ăn một quả trứng gà và hai lát bánh mì."
    }
  },
  {
    "id": 151,
    "hanzi": "西瓜",
    "pinyin": "xīguā",
    "hanviet": "Tây qua",
    "meaning": "Dưa hấu",
    "level": "HSK 2",
    "topic": "Ăn uống",
    "radical": "瓜 (Qua)",
    "strokes": 11,
    "mnemonic": "Giống dưa thơm ngọt (瓜) du nhập từ phương Tây (西).",
    "example": {
      "hanzi": "夏天吃冰镇西瓜真是太解渴了！",
      "pinyin": "Xiàtiān chī bīngzhèn xīguā zhēn shì tài jiěkě le!",
      "meaning": "Mùa hè ăn dưa hấu ướp lạnh thật là đã khát!"
    }
  },
  {
    "id": 152,
    "hanzi": "羊肉",
    "pinyin": "yángròu",
    "hanviet": "Dương nhục",
    "meaning": "Thịt dê, thịt cừu",
    "level": "HSK 2",
    "topic": "Ăn uống",
    "radical": "肉 (Nhục)",
    "strokes": 12,
    "mnemonic": "Thịt (肉) của con cừu con dê thơm nức mũi.",
    "example": {
      "hanzi": "冬天吃热腾腾的羊肉火锅最过瘾。",
      "pinyin": "Dōngtiān chī rètēngtēng de yángròu huǒguō zuì guòyǐn.",
      "meaning": "Mùa đông ăn lẩu thịt cừu nóng hổi là tuyệt nhất."
    }
  },
  {
    "id": 153,
    "hanzi": "鱼",
    "pinyin": "yú",
    "hanviet": "Ngư",
    "meaning": "Con cá",
    "level": "HSK 2",
    "topic": "Ăn uống",
    "radical": "鱼 (Ngư)",
    "strokes": 8,
    "mnemonic": "Hình dáng con cá bơi lội với vảy và đuôi cá.",
    "example": {
      "hanzi": "年年有余，过年中国人都吃鱼。",
      "pinyin": "Niánnián yǒu yú, guònián Zhōngguó rén dōu chī yú.",
      "meaning": "Năm nào cũng dư dả, ngày tết người TQ đều ăn cá."
    }
  },
  {
    "id": 154,
    "hanzi": "颜色",
    "pinyin": "yánsè",
    "hanviet": "Nhan sắc",
    "meaning": "Màu sắc",
    "level": "HSK 2",
    "topic": "Màu sắc",
    "radical": "色 (Sắc)",
    "strokes": 21,
    "mnemonic": "Sắc thái khuôn mặt (颜) phản ánh vẻ rạng ngời (色).",
    "example": {
      "hanzi": "你最喜欢什么颜色？",
      "pinyin": "Nǐ zuì xǐhuan shénme yánsè?",
      "meaning": "Bạn thích màu sắc nào nhất?"
    }
  },
  {
    "id": 155,
    "hanzi": "红",
    "pinyin": "hóng",
    "hanviet": "Hồng",
    "meaning": "Màu đỏ",
    "level": "HSK 2",
    "topic": "Màu sắc",
    "radical": "纟(Mịch)",
    "strokes": 6,
    "mnemonic": "Sợi tơ (纟) nhuộm màu đỏ thắm may mắn.",
    "example": {
      "hanzi": "中国人在新年喜欢穿红色的衣服。",
      "pinyin": "Zhōngguó rén zài xīnnián xǐhuan chuān hóngsè de yīfu.",
      "meaning": "Người TQ thích mặc đồ đỏ trong dịp năm mới."
    }
  },
  {
    "id": 156,
    "hanzi": "白",
    "pinyin": "bái",
    "hanviet": "Bạch",
    "meaning": "Màu trắng",
    "level": "HSK 2",
    "topic": "Màu sắc",
    "radical": "白 (Bạch)",
    "strokes": 5,
    "mnemonic": "Ánh nắng mặt trời tinh khôi trong trẻo.",
    "example": {
      "hanzi": "天空中飘着几朵洁白的云。",
      "pinyin": "Tiānkōng zhōng piāo zhe jǐ duǒ jiébái de yún.",
      "meaning": "Trên bầu trời trôi vài đám mây trắng xóa."
    }
  },
  {
    "id": 157,
    "hanzi": "黑",
    "pinyin": "hēi",
    "hanviet": "Hắc",
    "meaning": "Màu đen",
    "level": "HSK 2",
    "topic": "Màu sắc",
    "radical": "黑 (Hắc)",
    "strokes": 12,
    "mnemonic": "Khói than bốc lên bám đen muội lửa (灬).",
    "example": {
      "hanzi": "我有一只黑白相间的小花猫。",
      "pinyin": "Wǒ yǒu yì zhī hēi bái xiāngjiàn de xiǎohuāmāo.",
      "meaning": "Tôi có một chú mèo hoa khoang đen trắng."
    }
  },
  {
    "id": 158,
    "hanzi": "贵",
    "pinyin": "guì",
    "hanviet": "Quý",
    "meaning": "Đắt đỏ, quý giá",
    "level": "HSK 2",
    "topic": "Mua sắm",
    "radical": "贝 (Bối)",
    "strokes": 9,
    "mnemonic": "Vỏ sò tiền cổ (贝) quý hiếm có giá trị cao.",
    "example": {
      "hanzi": "这件外套太贵了，有没有便宜一点儿的？",
      "pinyin": "Zhè jiàn wàitào tài guì le, yǒu méiyǒu piányi yìdiǎnr de?",
      "meaning": "Cái áo khoác này đắt quá, có cái nào rẻ hơn chút không?"
    }
  },
  {
    "id": 159,
    "hanzi": "便宜",
    "pinyin": "piányi",
    "hanviet": "Tiện nghi",
    "meaning": "Rẻ, giá rẻ",
    "level": "HSK 2",
    "topic": "Mua sắm",
    "radical": "亻 (Nhân đứng)",
    "strokes": 20,
    "mnemonic": "Tiện lợi (便) thích hợp (宜) cho túi tiền người mua.",
    "example": {
      "hanzi": "超市里的蔬菜今天大减价，非常便宜。",
      "pinyin": "Chāoshì lǐ de shūcài jīntiān dà jiǎnjià, fēicháng piányi.",
      "meaning": "Rau trong siêu thị hôm nay giảm giá lớn, rất rẻ."
    }
  },
  {
    "id": 160,
    "hanzi": "新",
    "pinyin": "xīn",
    "hanviet": "Tân",
    "meaning": "Mới",
    "level": "HSK 2",
    "topic": "Tính từ",
    "radical": "斤 (Cân)",
    "strokes": 13,
    "mnemonic": "Cây gỗ (木) mới đốn hạ thơm mùi nhựa mới.",
    "example": {
      "hanzi": "新年快乐，万事如意！",
      "pinyin": "Xīnnián kuàilè, wànshì rúyì!",
      "meaning": "Chúc mừng năm mới, vạn sự như ý!"
    }
  },
  {
    "id": 161,
    "hanzi": "快",
    "pinyin": "kuài",
    "hanviet": "Khoái",
    "meaning": "Nhanh, mau",
    "level": "HSK 2",
    "topic": "Tính từ",
    "radical": "忄(Tâm đứng)",
    "strokes": 7,
    "mnemonic": "Nhịp tim (忄) đập nhanh thoăn thoắt dứt khoát.",
    "example": {
      "hanzi": "高铁的速度非常快。",
      "pinyin": "Gāotiě de sùdù fēicháng kuài.",
      "meaning": "Tốc độ của tàu cao tốc rất nhanh."
    }
  },
  {
    "id": 162,
    "hanzi": "慢",
    "pinyin": "màn",
    "hanviet": "Mạn",
    "meaning": "Chậm chạp",
    "level": "HSK 2",
    "topic": "Tính từ",
    "radical": "忄(Tâm đứng)",
    "strokes": 14,
    "mnemonic": "Thong dong từ tốn từng bước một không vội vã.",
    "example": {
      "hanzi": "请走慢一点儿，等等我。",
      "pinyin": "Qǐng zǒu màn yìdiǎnr, děngdeng wǒ.",
      "meaning": "Xin hãy đi chậm một chút, chờ tôi với."
    }
  },
  {
    "id": 163,
    "hanzi": "远",
    "pinyin": "yuǎn",
    "hanviet": "Viễn",
    "meaning": "Xa xôi",
    "level": "HSK 2",
    "topic": "Phương hướng",
    "radical": "辶 (Sước)",
    "strokes": 7,
    "mnemonic": "Bước chân (辶) đi biền biệt vạn dặm xa xôi.",
    "example": {
      "hanzi": "我家离学校不太远，骑车十分钟就到了。",
      "pinyin": "Wǒ jiā lí xuéxiào bú tài yuǎn, qí chē shí fēnzhōng jiù dào le.",
      "meaning": "Nhà tôi cách trường không xa lắm, đi xe 10 phút là tới."
    }
  },
  {
    "id": 164,
    "hanzi": "近",
    "pinyin": "jìn",
    "hanviet": "Cận",
    "meaning": "Gần gũi",
    "level": "HSK 2",
    "topic": "Phương hướng",
    "radical": "辶 (Sước)",
    "strokes": 7,
    "mnemonic": "Chỉ cách vài chiếc rìu (斤) là bước chân tới nơi.",
    "example": {
      "hanzi": "超市离这里很近，就在路口拐角处。",
      "pinyin": "Chāoshì lí zhèlǐ hěn jìn, jiù zài lùkǒu guǎijiǎo chù.",
      "meaning": "Siêu thị ở rất gần đây, ngay góc ngã rẽ."
    }
  },
  {
    "id": 165,
    "hanzi": "累",
    "pinyin": "lèi",
    "hanviet": "Luy",
    "meaning": "Mệt mỏi",
    "level": "HSK 2",
    "topic": "Cảm xúc",
    "radical": "糸 (Mịch)",
    "strokes": 11,
    "mnemonic": "Làm việc cày cấy trên đồng ruộng (田) tốn nhiều sức lực mệt nhoài.",
    "example": {
      "hanzi": "今天工作了一整天，我好累啊。",
      "pinyin": "Jīntiān gōngzuò le yì zhěng tiān, wǒ hǎo lèi a.",
      "meaning": "Hôm nay làm việc cả ngày, tôi mệt quá chừng."
    }
  },
  {
    "id": 166,
    "hanzi": "错",
    "pinyin": "cuò",
    "hanviet": "Thác",
    "meaning": "Sai, nhầm lẫn",
    "level": "HSK 2",
    "topic": "Học tập",
    "radical": "钅(Kim)",
    "strokes": 13,
    "mnemonic": "Khai thác kim loại xưa kia (昔) không tránh khỏi sai sót.",
    "example": {
      "hanzi": "这道题你做错了，请再仔细算一遍。",
      "pinyin": "Zhè dào tí nǐ zuò cuò le, qǐng zài zǐxì suàn yí biàn.",
      "meaning": "Câu này bạn làm sai rồi, hãy tính kỹ lại lần nữa."
    }
  },
  {
    "id": 167,
    "hanzi": "对",
    "pinyin": "duì",
    "hanviet": "Đối",
    "meaning": "Đúng, đối với",
    "level": "HSK 2",
    "topic": "Học tập",
    "radical": "寸 (Thốn)",
    "strokes": 5,
    "mnemonic": "Đo đạc đúng từng tấc (寸) chuẩn xác không sai lệch.",
    "example": {
      "hanzi": "你说得很对，我完全同意。",
      "pinyin": "Nǐ shuō de hěn duì, wǒ wánquán tóngyì.",
      "meaning": "Bạn nói rất đúng, tôi hoàn toàn đồng ý."
    }
  },
  {
    "id": 168,
    "hanzi": "火车站",
    "pinyin": "huǒchēzhàn",
    "hanviet": "Hỏa xa trạm",
    "meaning": "Ga xe lửa, ga tàu",
    "level": "HSK 2",
    "topic": "Du lịch",
    "radical": "立 (Lập)",
    "strokes": 19,
    "mnemonic": "Trạm dừng chân (站) của những đoàn tàu hỏa (火车).",
    "example": {
      "hanzi": "请问去火车站怎么走？",
      "pinyin": "Qǐngwèn qù huǒchēzhàn zěnme zǒu?",
      "meaning": "Xin hỏi đến ga tàu hỏa đi thế nào?"
    }
  },
  {
    "id": 169,
    "hanzi": "机场",
    "pinyin": "jīchǎng",
    "hanviet": "Cơ trường",
    "meaning": "Sân bay, phi trường",
    "level": "HSK 2",
    "topic": "Du lịch",
    "radical": "土 (Thổ)",
    "strokes": 12,
    "mnemonic": "Khu đất bãi rộng lớn (场) cho máy bay (机) cất cánh.",
    "example": {
      "hanzi": "我下午要去机场接一位中国朋友。",
      "pinyin": "Wǒ xiàwǔ yào qù jīchǎng jiē yí wèi Zhōngguó péngyou.",
      "meaning": "Chiều nay tôi phải ra sân bay đón một người bạn TQ."
    }
  },
  {
    "id": 170,
    "hanzi": "公共汽车",
    "pinyin": "gōnggòng qìchē",
    "hanviet": "Công cộng khí xa",
    "meaning": "Xe buýt công cộng",
    "level": "HSK 2",
    "topic": "Du lịch",
    "radical": "车 (Xa)",
    "strokes": 26,
    "mnemonic": "Phương tiện xe hơi (汽车) phục vụ chung cho cộng đồng (公共).",
    "example": {
      "hanzi": "坐公共汽车去学校非常方便省钱。",
      "pinyin": "Zuò gōnggòng qìchē qù xuéxiào fēicháng fāngbiàn shěngqián.",
      "meaning": "Đi xe buýt tới trường rất thuận tiện và tiết kiệm."
    }
  },
  {
    "id": 171,
    "hanzi": "路",
    "pinyin": "lù",
    "hanviet": "Lộ",
    "meaning": "Đường, con đường",
    "level": "HSK 2",
    "topic": "Giao thông",
    "radical": "足 (Túc)",
    "strokes": 13,
    "mnemonic": "Bàn chân (足) cất bước đi tới các ngả đường.",
    "example": {
      "hanzi": "这条路上的车很多，过马路要小心。",
      "pinyin": "Zhè tiáo lù shang de chē hěn duō, guò mǎlù yào xiǎoxīn.",
      "meaning": "Đường này nhiều xe cộ lắm, qua đường nhớ cẩn thận."
    }
  },
  {
    "id": 172,
    "hanzi": "门",
    "pinyin": "mén",
    "hanviet": "Môn",
    "meaning": "Cửa, cổng",
    "level": "HSK 2",
    "topic": "Đời sống",
    "radical": "门 (Môn)",
    "strokes": 3,
    "mnemonic": "Hình dáng cánh cổng lớn hai cánh mở ra.",
    "example": {
      "hanzi": "我们在学校大门前集合。",
      "pinyin": "Wǒmen zài xuéxiào dàmén qián jíhé.",
      "meaning": "Chúng ta tập trung trước cổng lớn của trường học."
    }
  },
  {
    "id": 173,
    "hanzi": "开始",
    "pinyin": "kāishǐ",
    "hanviet": "Khai thủy",
    "meaning": "Bắt đầu, khởi đầu",
    "level": "HSK 2",
    "topic": "Hành động",
    "radical": "女 (Nữ)",
    "strokes": 12,
    "mnemonic": "Mở ra (开) bước khởi đầu ban sơ (始).",
    "example": {
      "hanzi": "电影马上就要开始了。",
      "pinyin": "Diànyǐng mǎshàng jiù yào kāishǐ le.",
      "meaning": "Bộ phim sắp bắt đầu rồi."
    }
  },
  {
    "id": 174,
    "hanzi": "准备",
    "pinyin": "zhǔnbèi",
    "hanviet": "Chuẩn bị",
    "meaning": "Chuẩn bị, sẵn sàng",
    "level": "HSK 2",
    "topic": "Học tập",
    "radical": "氵(Chấm thủy)",
    "strokes": 17,
    "mnemonic": "Chuẩn mực đầy đủ (准) sẵn sàng phòng bị chu đáo (备).",
    "example": {
      "hanzi": "我已经准备好明天的HSK考试了。",
      "pinyin": "Wǒ yǐjīng zhǔnbèi hǎo míngtiān de HSK kǎoshì le.",
      "meaning": "Tôi đã chuẩn bị sẵn sàng cho kỳ thi HSK ngày mai rồi."
    }
  },
  {
    "id": 175,
    "hanzi": "考试",
    "pinyin": "kǎoshì",
    "hanviet": "Khảo thí",
    "meaning": "Thi cử, kiểm tra",
    "level": "HSK 2",
    "topic": "Trường học",
    "radical": "讠(Ngôn)",
    "strokes": 14,
    "mnemonic": "Khảo sát năng lực (考) qua các câu hỏi làm bài (试).",
    "example": {
      "hanzi": "下个星期一我们要进行期中考试。",
      "pinyin": "Xià gè xīngqīyī wǒmen yào jìnxíng qīzhōng kǎoshì.",
      "meaning": "Thứ hai tuần sau chúng tôi sẽ thi giữa kỳ."
    }
  },
  {
    "id": 176,
    "hanzi": "懂",
    "pinyin": "dǒng",
    "hanviet": "Đổng",
    "meaning": "Hiểu, thông suốt",
    "level": "HSK 2",
    "topic": "Học tập",
    "radical": "忄(Tâm đứng)",
    "strokes": 15,
    "mnemonic": "Trái tim và trí óc (忄) lĩnh hội thấu suốt vấn đề.",
    "example": {
      "hanzi": "老师讲的语法你听懂了吗？",
      "pinyin": "Lǎoshī jiǎng de yǔfǎ nǐ tīngdǒng le ma?",
      "meaning": "Ngữ pháp cô giáo giảng bạn đã nghe hiểu chưa?"
    }
  },
  {
    "id": 177,
    "hanzi": "介绍",
    "pinyin": "jièshào",
    "hanviet": "Giới thiệu",
    "meaning": "Giới thiệu, mai mối",
    "level": "HSK 2",
    "topic": "Giao tiếp",
    "radical": "纟(Mịch)",
    "strokes": 12,
    "mnemonic": "Kết nối sợi tơ duyên (绍) làm cầu nối trung gian (介).",
    "example": {
      "hanzi": "请允许我向大家介绍一下我们的新老师。",
      "pinyin": "Qǐng yǔnxǔ wǒ xiàng dàjiā jièshào yíxià wǒmen de xīn lǎoshī.",
      "meaning": "Xin phép cho tôi giới thiệu với mọi người giáo viên mới của chúng ta."
    }
  },
  {
    "id": 178,
    "hanzi": "方便",
    "pinyin": "fāngbiàn",
    "hanviet": "Phương tiện",
    "meaning": "Thuận tiện, tiện lợi",
    "level": "HSK 3",
    "topic": "Đời sống",
    "radical": "亻 (Nhân đứng)",
    "strokes": 13,
    "mnemonic": "Mọi phương diện (方) đều dễ dàng và tiện lợi (便).",
    "example": {
      "hanzi": "在这里坐地铁非常方便。",
      "pinyin": "Zài zhèlǐ zuò dìtiě fēicháng fāngbiàn.",
      "meaning": "Đi tàu điện ngầm ở đây rất thuận tiện."
    }
  },
  {
    "id": 179,
    "hanzi": "简单",
    "pinyin": "jiǎndān",
    "hanviet": "Giản đơn",
    "meaning": "Đơn giản, dễ dàng",
    "level": "HSK 3",
    "topic": "Học tập",
    "radical": "竹 (Trúc)",
    "strokes": 20,
    "mnemonic": "Gọn gàng như thẻ tre đơn sơ mộc mạc.",
    "example": {
      "hanzi": "这个问题很简答，大家都能回答。",
      "pinyin": "Zhè ge wèntí hěn jiǎndān, dàjiā dōu néng huídá.",
      "meaning": "Câu hỏi này rất đơn giản, ai cũng có thể trả lời."
    }
  },
  {
    "id": 180,
    "hanzi": "认真",
    "pinyin": "rènzhēn",
    "hanviet": "Nhận chân",
    "meaning": "Chăm chỉ, nghiêm túc",
    "level": "HSK 3",
    "topic": "Học tập",
    "radical": "讠(Ngôn)",
    "strokes": 14,
    "mnemonic": "Nhận thức chân chính (真) làm việc hết mình.",
    "example": {
      "hanzi": "他学习汉语的态度非常认真。",
      "pinyin": "Tā xuéxí Hànyǔ de tàidu fēicháng rènzhēn.",
      "meaning": "Thái độ học tiếng Trung của anh ấy rất nghiêm túc."
    }
  },
  {
    "id": 181,
    "hanzi": "热情",
    "pinyin": "rèqíng",
    "hanviet": "Nhiệt tình",
    "meaning": "Nhiệt tình, nồng hậu",
    "level": "HSK 3",
    "topic": "Cảm xúc",
    "radical": "灬 (Hỏa)",
    "strokes": 21,
    "mnemonic": "Ngọn lửa nhiệt huyết (热) chan chứa tình cảm ấm áp (情).",
    "example": {
      "hanzi": "中国房东对我们非常热情友好。",
      "pinyin": "Zhōngguó fángdōng duì wǒmen fēicháng rèqíng yǒuhǎo.",
      "meaning": "Chủ nhà người Trung Quốc rất nhiệt tình và thân thiện với chúng tôi."
    }
  },
  {
    "id": 182,
    "hanzi": "努力",
    "pinyin": "nǔlì",
    "hanviet": "Nỗ lực",
    "meaning": "Cố gắng, nỗ lực",
    "level": "HSK 3",
    "topic": "Học tập",
    "radical": "力 (Lực)",
    "strokes": 9,
    "mnemonic": "Dốc hết tâm sức và sức lực (力) vươn lên thành công.",
    "example": {
      "hanzi": "只要努力，你一定能考过HSK 3。",
      "pinyin": "Zhǐyào nǔlì, nǐ yídìng néng kǎoguò HSK sān.",
      "meaning": "Chỉ cần nỗ lực, bạn nhất định sẽ thi đỗ HSK 3."
    }
  },
  {
    "id": 183,
    "hanzi": "聪明",
    "pinyin": "cōngming",
    "hanviet": "Thông minh",
    "meaning": "Thông minh, sáng dạ",
    "level": "HSK 3",
    "topic": "Tính từ",
    "radical": "耳 (Nhĩ)",
    "strokes": 22,
    "mnemonic": "Tai thính (聪) mắt tinh tường (明) hiểu biết sâu rộng.",
    "example": {
      "hanzi": "那个小男孩特别聪明伶俐。",
      "pinyin": "Nà ge xiǎonánhái tèbié cōngming línglì.",
      "meaning": "Cậu bé đó đặc biệt thông minh nhanh nhẹn."
    }
  },
  {
    "id": 184,
    "hanzi": "舒服",
    "pinyin": "shūfu",
    "hanviet": "Thư phục",
    "meaning": "Dễ chịu, thoải mái",
    "level": "HSK 3",
    "topic": "Cảm giác",
    "radical": "舍 (Xá)",
    "strokes": 16,
    "mnemonic": "Thư thái thong dong quần áo vừa vặn dễ chịu.",
    "example": {
      "hanzi": "洗完热水澡感觉很舒服。",
      "pinyin": "Xǐ wán rèshuǐzǎo gǎnjué hěn shūfu.",
      "meaning": "Tắm nước nóng xong cảm thấy rất dễ chịu."
    }
  },
  {
    "id": 185,
    "hanzi": "特别",
    "pinyin": "tèbié",
    "hanviet": "Đặc biệt",
    "meaning": "Đặc biệt, vô cùng",
    "level": "HSK 3",
    "topic": "Phó từ",
    "radical": "牛 (Ngưu)",
    "strokes": 17,
    "mnemonic": "Con trâu quý đặc biệt (特) phân biệt rạch ròi (别).",
    "example": {
      "hanzi": "今天河内的天气特别好。",
      "pinyin": "Jīntiān Hénèi de tiānqì tèbié hǎo.",
      "meaning": "Thời tiết Hà Nội hôm nay đặc biệt đẹp."
    }
  },
  {
    "id": 186,
    "hanzi": "马上",
    "pinyin": "mǎshàng",
    "hanviet": "Mã thượng",
    "meaning": "Ngay lập tức, tức thì",
    "level": "HSK 3",
    "topic": "Thời gian",
    "radical": "马 (Mã)",
    "strokes": 6,
    "mnemonic": "Ngồi ngay trên lưng ngựa phi nhanh đến nơi.",
    "example": {
      "hanzi": "请稍等，我马上就到！",
      "pinyin": "Qǐng shāoděng, wǒ mǎshàng jiù dào!",
      "meaning": "Xin chờ chút, tôi tới ngay đây!"
    }
  },
  {
    "id": 187,
    "hanzi": "已经",
    "pinyin": "yǐjīng",
    "hanviet": "Dĩ kinh",
    "meaning": "Đã, rồi",
    "level": "HSK 3",
    "topic": "Phó từ",
    "radical": "己 (Kỷ)",
    "strokes": 11,
    "mnemonic": "Đã từng kinh qua (经) trải nghiệm trong dĩ vãng (已).",
    "example": {
      "hanzi": "我已经在河内生活了五年。",
      "pinyin": "Wǒ yǐjīng zài Hénèi shēnghuó le wǔ nián.",
      "meaning": "Tôi đã sinh sống ở Hà Nội được năm năm."
    }
  },
  {
    "id": 188,
    "hanzi": "经常",
    "pinyin": "jīngcháng",
    "hanviet": "Kinh thường",
    "meaning": "Thường xuyên, hay",
    "level": "HSK 3",
    "topic": "Phó từ",
    "radical": "巾 (Khăn)",
    "strokes": 19,
    "mnemonic": "Lặp đi lặp lại thành thông lệ thường ngày.",
    "example": {
      "hanzi": "周末我经常去图书馆借书。",
      "pinyin": "Zhōumò wǒ jīngcháng qù túshūguǎn jiè shū.",
      "meaning": "Cuối tuần tôi thường xuyên đến thư viện mượn sách."
    }
  },
  {
    "id": 189,
    "hanzi": "当然",
    "pinyin": "dāngrán",
    "hanviet": "Đương nhiên",
    "meaning": "Đương nhiên, tất nhiên",
    "level": "HSK 3",
    "topic": "Phó từ",
    "radical": "彐 (Kệ)",
    "strokes": 18,
    "mnemonic": "Đương nhiên đúng với quy luật tự nhiên (然).",
    "example": {
      "hanzi": "A: 你喜欢中国菜吗？ B: 当然喜欢！",
      "pinyin": "A: Nǐ xǐhuan Zhōngguó cài ma? B: Dāngrán xǐhuan!",
      "meaning": "A: Bạn thích món ăn Trung Quốc không? B: Đương nhiên là thích rồi!"
    }
  },
  {
    "id": 190,
    "hanzi": "超市",
    "pinyin": "chāoshì",
    "hanviet": "Siêu thị",
    "meaning": "Siêu thị",
    "level": "HSK 3",
    "topic": "Mua sắm",
    "radical": "走 (Tẩu)",
    "strokes": 17,
    "mnemonic": "Thị trường mua bán quy mô vượt trội (超) sầm uất.",
    "example": {
      "hanzi": "超市里有各种各样的新鲜蔬菜。",
      "pinyin": "Chāoshì lǐ yǒu gèzhǒnggèyàng de xīnxiān shūcài.",
      "meaning": "Trong siêu thị có đủ các loại rau tươi."
    }
  },
  {
    "id": 191,
    "hanzi": "银行",
    "pinyin": "yínháng",
    "hanviet": "Ngân hàng",
    "meaning": "Ngân hàng",
    "level": "HSK 3",
    "topic": "Đời sống",
    "radical": "钅(Kim)",
    "strokes": 17,
    "mnemonic": "Nơi lưu thông tiền bạc bạc trắng (银) của ngành tài chính (行).",
    "example": {
      "hanzi": "我想去中国银行换点人民币。",
      "pinyin": "Wǒ xiǎng qù Zhōngguó Yínháng huàn diǎn Rénmínbì.",
      "meaning": "Tôi muốn đến Ngân hàng Trung Quốc đổi ít tiền Nhân dân tệ."
    }
  },
  {
    "id": 192,
    "hanzi": "洗手间",
    "pinyin": "xǐshǒujiān",
    "hanviet": "Tẩy thủ gian",
    "meaning": "Nhà vệ sinh, phòng rửa tay",
    "level": "HSK 3",
    "topic": "Đời sống",
    "radical": "氵(Chấm thủy)",
    "strokes": 20,
    "mnemonic": "Căn phòng (间) chuyên dùng để rửa tay (洗手) giữ gìn vệ sinh.",
    "example": {
      "hanzi": "请问洗手间在哪儿？",
      "pinyin": "Qǐngwèn xǐshǒujiān zài nǎr?",
      "meaning": "Xin hỏi nhà vệ sinh ở đâu ạ?"
    }
  },
  {
    "id": 193,
    "hanzi": "汉语",
    "pinyin": "Hànyǔ",
    "hanviet": "Hán ngữ",
    "meaning": "Tiếng Hán, tiếng Trung",
    "level": "HSK 1",
    "topic": "Trường học",
    "radical": "氵(Thủy)",
    "strokes": 14,
    "mnemonic": "Ngôn ngữ của người Hán bên dòng sông Hán Thủy.",
    "example": {
      "hanzi": "我学汉语学了六个月。",
      "pinyin": "Wǒ xué Hànyǔ xué le liù gè yuè.",
      "meaning": "Tôi học tiếng Trung được 6 tháng rồi."
    }
  },
  {
    "id": 194,
    "hanzi": "字",
    "pinyin": "zì",
    "hanviet": "Tự",
    "meaning": "Chữ, chữ Hán",
    "level": "HSK 1",
    "topic": "Trường học",
    "radical": "宀 (Miên)",
    "strokes": 6,
    "mnemonic": "Đứa trẻ (子) dưới mái nhà (宀) chăm chỉ viết từng con chữ.",
    "example": {
      "hanzi": "这个汉字怎么读？",
      "pinyin": "Zhè ge hànzì zěnme dú?",
      "meaning": "Chữ Hán này đọc thế nào?"
    }
  },
  {
    "id": 195,
    "hanzi": "名字",
    "pinyin": "míngzi",
    "hanviet": "Danh tự",
    "meaning": "Tên, họ tên",
    "level": "HSK 1",
    "topic": "Chào hỏi",
    "radical": "夕 (Tịch)",
    "strokes": 12,
    "mnemonic": "Trong đêm tối (夕) cất tiếng (口) gọi tên danh tính.",
    "example": {
      "hanzi": "你的名字真好听。",
      "pinyin": "Nǐ de míngzi zhēn hǎotīng.",
      "meaning": "Tên của bạn nghe hay quá."
    }
  },
  {
    "id": 196,
    "hanzi": "天气",
    "pinyin": "tiānqì",
    "hanviet": "Thiên khí",
    "meaning": "Thời tiết",
    "level": "HSK 1",
    "topic": "Thời tiết",
    "radical": "气 (Khí)",
    "strokes": 8,
    "mnemonic": "Khí quyển dưới bầu trời thay đổi nắng mưa.",
    "example": {
      "hanzi": "明天的天气预报说会下雨。",
      "pinyin": "Míngtiān de tiānqì yùbào shuō huì xiàyǔ.",
      "meaning": "Dự báo thời tiết ngày mai nói sẽ có mưa."
    }
  },
  {
    "id": 197,
    "hanzi": "打电话",
    "pinyin": "dǎ diànhuà",
    "hanviet": "Đả điện thoại",
    "meaning": "Gọi điện thoại",
    "level": "HSK 1",
    "topic": "Giao tiếp",
    "radical": "扌(Thủ)",
    "strokes": 18,
    "mnemonic": "Dùng tay (扌) bấm máy gọi điện truyền lời thoại (话).",
    "example": {
      "hanzi": "晚上我给你打电话。",
      "pinyin": "Wǎnshang wǒ gěi nǐ dǎ diànhuà.",
      "meaning": "Tối nay tôi sẽ gọi điện cho bạn."
    }
  },
  {
    "id": 198,
    "hanzi": "早上",
    "pinyin": "zǎoshang",
    "hanviet": "Tảo thượng",
    "meaning": "Buổi sáng sớm",
    "level": "HSK 2",
    "topic": "Thời gian",
    "radical": "日 (Nhật)",
    "strokes": 9,
    "mnemonic": "Mặt trời mọc sớm chiếu sáng buổi ban mai.",
    "example": {
      "hanzi": "早上好！祝你今天一天都顺利。",
      "pinyin": "Zǎoshang hǎo! Zhù nǐ jīntiān yì tiān dōu shùnlì.",
      "meaning": "Chào buổi sáng! Chúc bạn một ngày thuận lợi."
    }
  },
  {
    "id": 199,
    "hanzi": "晚上",
    "pinyin": "wǎnshang",
    "hanviet": "Vãn thượng",
    "meaning": "Buổi tối",
    "level": "HSK 2",
    "topic": "Thời gian",
    "radical": "日 (Nhật)",
    "strokes": 14,
    "mnemonic": "Mặt trời lặn đêm muộn buông xuống.",
    "example": {
      "hanzi": "晚上八点我在家看书。",
      "pinyin": "Wǎnshang bā diǎn wǒ zài jiā kàn shū.",
      "meaning": "8 giờ tối tôi ở nhà đọc sách."
    }
  },
  {
    "id": 200,
    "hanzi": "铅笔",
    "pinyin": "qiānbǐ",
    "hanviet": "Duyên bút",
    "meaning": "Bút chì",
    "level": "HSK 2",
    "topic": "Trường học",
    "radical": "竹 (Trúc)",
    "strokes": 21,
    "mnemonic": "Cây bút cán trúc (竹) chứa lõi chì đen nhánh.",
    "example": {
      "hanzi": "请借我一支铅笔用一下。",
      "pinyin": "Qǐng jiè wǒ yì zhī qiānbǐ yòng yíxià.",
      "meaning": "Xin cho tôi mượn cây bút chì dùng một lát."
    }
  },
  {
    "id": 201,
    "hanzi": "报纸",
    "pinyin": "bàozhǐ",
    "hanviet": "Báo chỉ",
    "meaning": "Báo, tờ báo",
    "level": "HSK 2",
    "topic": "Đời sống",
    "radical": "纟(Mịch)",
    "strokes": 19,
    "mnemonic": "Tờ giấy (纸) in thông tin thời sự báo cáo (报).",
    "example": {
      "hanzi": "爷爷每天早晨看报纸。",
      "pinyin": "Yéye měitiān zǎochén kàn bàozhǐ.",
      "meaning": "Ông nội mỗi sáng đều đọc báo."
    }
  },
  {
    "id": 202,
    "hanzi": "房间",
    "pinyin": "fángjiān",
    "hanviet": "Phòng gian",
    "meaning": "Căn phòng",
    "level": "HSK 2",
    "topic": "Đời sống",
    "radical": "户 (Hộ)",
    "strokes": 15,
    "mnemonic": "Không gian (间) bên trong cánh cửa ngôi nhà (房).",
    "example": {
      "hanzi": "我的房间非常干净整洁。",
      "pinyin": "Wǒ de fángjiān fēicháng gānjìng zhěngjié.",
      "meaning": "Căn phòng của tôi rất sạch sẽ và ngăn nắp."
    }
  },
  {
    "id": 203,
    "hanzi": "手表",
    "pinyin": "shǒubiǎo",
    "hanviet": "Thủ biểu",
    "meaning": "Đồng hồ đeo tay",
    "level": "HSK 2",
    "topic": "Đời sống",
    "radical": "手 (Thủ)",
    "strokes": 12,
    "mnemonic": "Vật dụng hiển thị giờ khắc đeo ở cổ tay (手).",
    "example": {
      "hanzi": "这块手表是妈妈送给我的生日礼物。",
      "pinyin": "Zhè kuài shǒubiǎo shì māma sòng gěi wǒ de shēngrì lǐwù.",
      "meaning": "Chiếc đồng hồ này là quà sinh nhật mẹ tặng tôi."
    }
  },
  {
    "id": 204,
    "hanzi": "晴天",
    "pinyin": "qíngtiān",
    "hanviet": "Tình thiên",
    "meaning": "Ngày nắng ráo",
    "level": "HSK 2",
    "topic": "Thời tiết",
    "radical": "日 (Nhật)",
    "strokes": 16,
    "mnemonic": "Mặt trời (日) tỏa ánh nắng xanh biếc (青) chan hòa.",
    "example": {
      "hanzi": "今天是个晴天，适合去郊游。",
      "pinyin": "Jīntiān shì gè qíngtiān, shìhé qù jiāoyóu.",
      "meaning": "Hôm nay là ngày nắng, thích hợp đi dã ngoại."
    }
  },
  {
    "id": 205,
    "hanzi": "阴天",
    "pinyin": "yīntiān",
    "hanviet": "Âm thiên",
    "meaning": "Trời râm, trời âm u",
    "level": "HSK 2",
    "topic": "Thời tiết",
    "radical": "阝(Phụ)",
    "strokes": 10,
    "mnemonic": "Bóng râm che khuất ánh mặt trời mây mù phủ kín.",
    "example": {
      "hanzi": "虽然是阴天，但天气很凉爽。",
      "pinyin": "Suīrán shì yīntiān, dàn tiānqì hěn liángshuǎng.",
      "meaning": "Tuy là trời râm nhưng không khí rất mát mẻ."
    }
  },
  {
    "id": 206,
    "hanzi": "下雪",
    "pinyin": "xiàxuě",
    "hanviet": "Hạ tuyết",
    "meaning": "Tuyết rơi",
    "level": "HSK 2",
    "topic": "Thời tiết",
    "radical": "雨 (Vũ)",
    "strokes": 14,
    "mnemonic": "Bông tuyết trắng muốt rơi từ bầu trời tuyết lạnh (雪).",
    "example": {
      "hanzi": "冬天北京经常下雪，景色很美。",
      "pinyin": "Dōngtiān Běijīng jīngcháng xiàxuě, jǐngsè hěn měi.",
      "meaning": "Mùa đông Bắc Kinh hay có tuyết rơi, phong cảnh rất đẹp."
    }
  },
  {
    "id": 207,
    "hanzi": "下雨",
    "pinyin": "xiàyǔ",
    "hanviet": "Hạ vũ",
    "meaning": "Mưa rơi, trời mưa",
    "level": "HSK 2",
    "topic": "Thời tiết",
    "radical": "雨 (Vũ)",
    "strokes": 11,
    "mnemonic": "Những hạt mưa từ mây trên trời đổ xuống.",
    "example": {
      "hanzi": "外面下大雨了，出门记得带伞。",
      "pinyin": "Wàimiàn xià dàyǔ le, chūmén jìde dài sǎn.",
      "meaning": "Bên ngoài mưa to rồi, ra ngoài nhớ mang theo ô."
    }
  },
  {
    "id": 208,
    "hanzi": "穿",
    "pinyin": "chuān",
    "hanviet": "Xuyên",
    "meaning": "Mặc (quần áo), đi (giày dép)",
    "level": "HSK 2",
    "topic": "Đời sống",
    "radical": "穴 (Huyệt)",
    "strokes": 9,
    "mnemonic": "Xỏ chân tay xuyên qua hang huyệt quần áo.",
    "example": {
      "hanzi": "今天冷，多穿一点儿衣服。",
      "pinyin": "Jīntiān lěng, duō chuān yìdiǎnr yīfu.",
      "meaning": "Hôm nay lạnh, nhớ mặc thêm nhiều áo."
    }
  },
  {
    "id": 209,
    "hanzi": "送",
    "pinyin": "sòng",
    "hanviet": "Tống",
    "meaning": "Tặng, tiễn đưa",
    "level": "HSK 2",
    "topic": "Giao tiếp",
    "radical": "辶 (Sước)",
    "strokes": 9,
    "mnemonic": "Cất bước chân đưa tiễn trao gửi món quà.",
    "example": {
      "hanzi": "朋友送了我一本精美的中文小说。",
      "pinyin": "Péngyou sòng le wǒ yì běn jīngměi de Zhōngwén xiǎoshuō.",
      "meaning": "Bạn bè tặng tôi một cuốn tiểu thuyết tiếng Trung rất đẹp."
    }
  },
  {
    "id": 210,
    "hanzi": "给",
    "pinyin": "gěi",
    "hanviet": "Cấp",
    "meaning": "Cho, đưa cho, tặng",
    "level": "HSK 2",
    "topic": "Giao tiếp",
    "radical": "纟(Mịch)",
    "strokes": 9,
    "mnemonic": "Nối kết sợi dây trao tận tay cho đối phương.",
    "example": {
      "hanzi": "请给我一张发票。",
      "pinyin": "Qǐng gěi wǒ yì zhāng fāpiào.",
      "meaning": "Xin xuất cho tôi một tờ hóa đơn."
    }
  },
  {
    "id": 211,
    "hanzi": "问",
    "pinyin": "wèn",
    "hanviet": "Vấn",
    "meaning": "Hỏi, thắc mắc",
    "level": "HSK 2",
    "topic": "Giao tiếp",
    "radical": "门 (Môn)",
    "strokes": 6,
    "mnemonic": "Mở miệng (口) cất lời hỏi trước cửa nhà (门).",
    "example": {
      "hanzi": "请问，洗手间在哪个方向？",
      "pinyin": "Qǐngwèn, xǐshǒujiān zài nǎ ge fāngxiàng?",
      "meaning": "Xin hỏi, nhà vệ sinh ở hướng nào ạ?"
    }
  },
  {
    "id": 212,
    "hanzi": "找",
    "pinyin": "zhǎo",
    "hanviet": "Trảo",
    "meaning": "Tìm kiếm, thối lại (tiền lẻ)",
    "level": "HSK 2",
    "topic": "Mua sắm",
    "radical": "扌(Thủ)",
    "strokes": 7,
    "mnemonic": "Dùng bàn tay (扌) cầm ngọn đuốc tìm kiếm đồ thất lạc.",
    "example": {
      "hanzi": "找你五块钱，谢谢光临！",
      "pinyin": "Zhǎo nǐ wǔ kuài qián, xièxie guānglín!",
      "meaning": "Thối lại bạn 5 đồng, cảm ơn quý khách!"
    }
  },
  {
    "id": 213,
    "hanzi": "告诉",
    "pinyin": "gàosu",
    "hanviet": "Cáo tố",
    "meaning": "Bảo, nói cho biết",
    "level": "HSK 2",
    "topic": "Giao tiếp",
    "radical": "讠(Ngôn)",
    "strokes": 14,
    "mnemonic": "Dùng lời nói (讠) thông báo báo cáo tin tức.",
    "example": {
      "hanzi": "请告诉我明天开会的具体时间。",
      "pinyin": "Qǐng gàosu wǒ míngtiān kāihuì de jùtǐ shíjiān.",
      "meaning": "Xin hãy nói cho tôi biết thời gian họp cụ thể ngày mai."
    }
  },
  {
    "id": 214,
    "hanzi": "等",
    "pinyin": "děng",
    "hanviet": "Đẳng",
    "meaning": "Chờ đợi, đợi",
    "level": "HSK 2",
    "topic": "Hành động",
    "radical": "竹 (Trúc)",
    "strokes": 12,
    "mnemonic": "Xếp thẻ tre theo thứ tự chờ đến lượt mình.",
    "example": {
      "hanzi": "请在这儿等我一下。",
      "pinyin": "Qǐng zài zhèr děng wǒ yíxià.",
      "meaning": "Xin hãy chờ tôi ở đây một lát."
    }
  },
  {
    "id": 215,
    "hanzi": "让",
    "pinyin": "ràng",
    "hanviet": "Nhượng",
    "meaning": "Nhường, để cho, bảo",
    "level": "HSK 2",
    "topic": "Giao tiếp",
    "radical": "讠(Ngôn)",
    "strokes": 5,
    "mnemonic": "Dùng lời nói nhã nhặn nhường nhịn người khác.",
    "example": {
      "hanzi": "老师让我回答这个问题。",
      "pinyin": "Lǎoshī ràng wǒ huídá zhè ge wèntí.",
      "meaning": "Cô giáo bảo tôi trả lời câu hỏi này."
    }
  },
  {
    "id": 216,
    "hanzi": "希望",
    "pinyin": "xīwàng",
    "hanviet": "Hi vọng",
    "meaning": "Hi vọng, mong muốn",
    "level": "HSK 2",
    "topic": "Cảm xúc",
    "radical": "月 (Nguyệt)",
    "strokes": 18,
    "mnemonic": "Ánh trăng hiền hòa gieo niềm hi vọng ngóng trông.",
    "example": {
      "hanzi": "我希望大家都考出好成绩。",
      "pinyin": "Wǒ xīwàng dàjiā dōu kǎochū hǎo chéngjì.",
      "meaning": "Tôi hi vọng mọi người đều đạt kết quả thi thật tốt."
    }
  },
  {
    "id": 217,
    "hanzi": "因为",
    "pinyin": "yīnwèi",
    "hanviet": "Nhân vị",
    "meaning": "Bởi vì, do vì",
    "level": "HSK 2",
    "topic": "Liên từ",
    "radical": "囗 (Vi)",
    "strokes": 10,
    "mnemonic": "Nguyên nhân nằm trọn trong khuôn khổ vấn đề.",
    "example": {
      "hanzi": "因为今天下雨，所以我们没去公园。",
      "pinyin": "Yīnwèi jīntiān xiàyǔ, suǒyǐ wǒmen méi qù gōngyuán.",
      "meaning": "Bởi vì hôm nay trời mưa nên chúng tôi không đi công viên."
    }
  },
  {
    "id": 218,
    "hanzi": "所以",
    "pinyin": "suǒyǐ",
    "hanviet": "Sở dĩ",
    "meaning": "Cho nên, vì thế",
    "level": "HSK 2",
    "topic": "Liên từ",
    "radical": "斤 (Cân)",
    "strokes": 12,
    "mnemonic": "Kết quả logic đưa ra phương án xử lý.",
    "example": {
      "hanzi": "他学习很努力，所以成绩很优秀。",
      "pinyin": "Tā xuéxí hěn nǔlì, suǒyǐ chéngjì hěn yōuxiù.",
      "meaning": "Anh ấy học rất chăm chỉ, cho nên thành tích rất xuất sắc."
    }
  },
  {
    "id": 219,
    "hanzi": "但是",
    "pinyin": "dànshì",
    "hanviet": "Đãn thị",
    "meaning": "Nhưng, thế nhưng",
    "level": "HSK 2",
    "topic": "Liên từ",
    "radical": "亻 (Nhân đứng)",
    "strokes": 16,
    "mnemonic": "Chuyển ý đối lập giữa hai vế câu.",
    "example": {
      "hanzi": "汉语虽然难，但是很有意思。",
      "pinyin": "Hànyǔ suīrán nán, dànshì hěn yǒu yìsi.",
      "meaning": "Tiếng Trung tuy khó nhưng rất thú vị."
    }
  },
  {
    "id": 220,
    "hanzi": "虽然",
    "pinyin": "suīrán",
    "hanviet": "Tuy nhiên",
    "meaning": "Mặc dù, dẫu rằng",
    "level": "HSK 2",
    "topic": "Liên từ",
    "radical": "虫 (Trùng)",
    "strokes": 21,
    "mnemonic": "Thừa nhận vế đầu để nhấn mạnh ý đằng sau.",
    "example": {
      "hanzi": "虽然天气冷，他依然坚持早起晨跑。",
      "pinyin": "Suīrán tiānqì lěng, tā yīrán jiānchí zǎoqǐ chénpǎo.",
      "meaning": "Mặc dù trời lạnh, anh ấy vẫn kiên trì dậy sớm chạy bộ."
    }
  },
  {
    "id": 221,
    "hanzi": "正在",
    "pinyin": "zhèngzài",
    "hanviet": "Chính tại",
    "meaning": "Đang (làm gì đó)",
    "level": "HSK 2",
    "topic": "Phó từ",
    "radical": "止 (Chỉ)",
    "strokes": 11,
    "mnemonic": "Hành động đang diễn ra đúng vào thời điểm này.",
    "example": {
      "hanzi": "他们正在教室里专心听课。",
      "pinyin": "Tāmen zhèngzài jiàoshì lǐ zhuānxīn tīngkè.",
      "meaning": "Họ đang chăm chú nghe giảng trong lớp học."
    }
  },
  {
    "id": 222,
    "hanzi": "真",
    "pinyin": "zhēn",
    "hanviet": "Chân",
    "meaning": "Thật, thật là",
    "level": "HSK 2",
    "topic": "Phó từ",
    "radical": "目 (Mục)",
    "strokes": 10,
    "mnemonic": "Chân thực ngay trước mắt không hề giả tạo.",
    "example": {
      "hanzi": "你今天的精神状态真好！",
      "pinyin": "Nǐ jīntiān de jīngshén zhuàngtài zhēn hǎo!",
      "meaning": "Hôm nay tinh thần của bạn thật là tốt!"
    }
  },
  {
    "id": 223,
    "hanzi": "最",
    "pinyin": "zuì",
    "hanviet": "Tối",
    "meaning": "Nhất (mức độ cao nhất)",
    "level": "HSK 2",
    "topic": "Phó từ",
    "radical": "日 (Nhật)",
    "strokes": 12,
    "mnemonic": "Mặt trời chiếu tỏ đỉnh cao nhất trên đôi tai (耳).",
    "example": {
      "hanzi": "这是我最喜欢读的一本中文书。",
      "pinyin": "Zhè shì wǒ zuì xǐhuan dú de yì běn Zhōngwén shū.",
      "meaning": "Đây là cuốn sách tiếng Trung mà tôi thích đọc nhất."
    }
  },
  {
    "id": 224,
    "hanzi": "件",
    "pinyin": "jiàn",
    "hanviet": "Kiện",
    "meaning": "Chiếc, cái (lượng từ quần áo, sự việc)",
    "level": "HSK 2",
    "topic": "Lượng từ",
    "radical": "亻 (Nhân đứng)",
    "strokes": 6,
    "mnemonic": "Mỗi một sự kiện đồ vật của con người.",
    "example": {
      "hanzi": "这件衣服质量非常好。",
      "pinyin": "Zhè jiàn yīfu zhìliàng fēicháng hǎo.",
      "meaning": "Bộ quần áo này chất lượng rất tốt."
    }
  },
  {
    "id": 225,
    "hanzi": "斤",
    "pinyin": "jīn",
    "hanviet": "Cân",
    "meaning": "Cân (đơn vị đo lường TQ = 500g)",
    "level": "HSK 2",
    "topic": "Lượng từ",
    "radical": "斤 (Cân)",
    "strokes": 4,
    "mnemonic": "Hình chiếc rìu cân đo đong đếm trọng lượng.",
    "example": {
      "hanzi": "苹果三块钱一斤。",
      "pinyin": "Píngguǒ sān kuài qián yì jīn.",
      "meaning": "Táo ba đồng một cân."
    }
  },
  {
    "id": 226,
    "hanzi": "两",
    "pinyin": "liǎng",
    "hanviet": "Lưỡng",
    "meaning": "Hai (dùng trước lượng từ)",
    "level": "HSK 2",
    "topic": "Con số",
    "radical": "一 (Nhất)",
    "strokes": 7,
    "mnemonic": "Cặp đôi cân xứng cùng nhau xuất hiện.",
    "example": {
      "hanzi": "我有两张今晚的话剧票。",
      "pinyin": "Wǒ yǒu liǎng zhāng jīnwǎn de huàjù piào.",
      "meaning": "Tôi có hai vé kịch tối nay."
    }
  },
  {
    "id": 227,
    "hanzi": "千",
    "pinyin": "qiān",
    "hanviet": "Thiên",
    "meaning": "Nghìn, 1000",
    "level": "HSK 2",
    "topic": "Con số",
    "radical": "十 (Thập)",
    "strokes": 3,
    "mnemonic": "Thêm nét phẩy trên chữ Thập (十) biểu thị một nghìn.",
    "example": {
      "hanzi": "这台电脑三千块钱。",
      "pinyin": "Zhè tái diànnǎo sānqiān kuài qián.",
      "meaning": "Chiếc máy tính này 3000 đồng."
    }
  },
  {
    "id": 228,
    "hanzi": "打算",
    "pinyin": "dǎsuàn",
    "hanviet": "Đả toán",
    "meaning": "Dự định, tính toán",
    "level": "HSK 3",
    "topic": "Hành động",
    "radical": "扌(Thủ)",
    "strokes": 19,
    "mnemonic": "Dùng bàn tay (扌) gảy bàn tính lên kế hoạch.",
    "example": {
      "hanzi": "大学毕业后你有什么打算？",
      "pinyin": "Dàxué bìyè hòu nǐ yǒu shénme dǎsuàn?",
      "meaning": "Sau khi tốt nghiệp đại học bạn có dự định gì?"
    }
  },
  {
    "id": 229,
    "hanzi": "结束",
    "pinyin": "jiéshù",
    "hanviet": "Kết thúc",
    "meaning": "Kết thúc, chấm dứt",
    "level": "HSK 3",
    "topic": "Hành động",
    "radical": "纟(Mịch)",
    "strokes": 19,
    "mnemonic": "Buộc túm nút chỉ lại hoàn tất sự việc.",
    "example": {
      "hanzi": "会议大概在五点钟结束。",
      "pinyin": "Huìyì dàgài zài wǔ diǎn zhōng jiéshù.",
      "meaning": "Cuộc họp khoảng 5 giờ sẽ kết thúc."
    }
  },
  {
    "id": 230,
    "hanzi": "决定",
    "pinyin": "juédìng",
    "hanviet": "Quyết định",
    "meaning": "Quyết định, định đoạt",
    "level": "HSK 3",
    "topic": "Hành động",
    "radical": "氵(Chấm thủy)",
    "strokes": 15,
    "mnemonic": "Dòng nước quyết đoán định hình con đường đi.",
    "example": {
      "hanzi": "经过深思熟虑，我决定去北京留学。",
      "pinyin": "Jīngguò shēnsīshúlǜ, wǒ juédìng qù Běijīng liúxué.",
      "meaning": "Sau khi suy nghĩ kỹ, tôi quyết định sang Bắc Kinh du học."
    }
  },
  {
    "id": 231,
    "hanzi": "解决",
    "pinyin": "jiějué",
    "hanviet": "Giải quyết",
    "meaning": "Giải quyết (vấn đề, khó khăn)",
    "level": "HSK 3",
    "topic": "Công việc",
    "radical": "角 (Giác)",
    "strokes": 19,
    "mnemonic": "Dùng dao mổ xẻ gỡ rối mọi khúc mắc.",
    "example": {
      "hanzi": "我们要共同努力解决这个难题。",
      "pinyin": "Wǒmen yào gòngtóng nǔlì jiějué zhè ge nántí.",
      "meaning": "Chúng ta phải cùng nhau nỗ lực giải quyết vấn đề khó khăn này."
    }
  },
  {
    "id": 232,
    "hanzi": "提高",
    "pinyin": "tígāo",
    "hanviet": "Đề cao",
    "meaning": "Nâng cao, cải thiện",
    "level": "HSK 3",
    "topic": "Học tập",
    "radical": "扌(Thủ)",
    "strokes": 22,
    "mnemonic": "Đưa bàn tay nâng tầm kiến thức lên cao.",
    "example": {
      "hanzi": "多读中文原版书能有效提高词汇量。",
      "pinyin": "Duō dú Zhōngwén yuánbǎn shū néng yǒuxiào tígāo cíhuìliàng.",
      "meaning": "Đọc nhiều sách tiếng Trung gốc giúp nâng cao lượng từ vựng hiệu quả."
    }
  },
  {
    "id": 233,
    "hanzi": "完成",
    "pinyin": "wánchéng",
    "hanviet": "Hoàn thành",
    "meaning": "Hoàn thành, làm xong",
    "level": "HSK 3",
    "topic": "Công việc",
    "radical": "宀 (Miên)",
    "strokes": 13,
    "mnemonic": "Ngôi nhà xây xong hoàn thiện vững chắc.",
    "example": {
      "hanzi": "我终于在下班前完成了这份报告。",
      "pinyin": "Wǒ zhōngyú zài xiàbān qián wánchéng le zhè fèn bàogào.",
      "meaning": "Cuối cùng tôi đã hoàn thành bản báo cáo này trước giờ tan tầm."
    }
  },
  {
    "id": 234,
    "hanzi": "选择",
    "pinyin": "xuǎnzé",
    "hanviet": "Tuyển trạch",
    "meaning": "Lựa chọn, tuyển chọn",
    "level": "HSK 3",
    "topic": "Hành động",
    "radical": "辶 (Sước)",
    "strokes": 24,
    "mnemonic": "Chọn lựa con đường đi đúng đắn nhất.",
    "example": {
      "hanzi": "人生充满各种各样的选择。",
      "pinyin": "Rénshēng chōngmǎn gèzhǒnggèyàng de xuǎnzé.",
      "meaning": "Cuộc đời tràn ngập những ngã rẽ và sự lựa chọn."
    }
  },
  {
    "id": 235,
    "hanzi": "愿意",
    "pinyin": "yuànyì",
    "hanviet": "Nguyện ý",
    "meaning": "Sẵn lòng, bằng lòng",
    "level": "HSK 3",
    "topic": "Cảm xúc",
    "radical": "心 (Tâm)",
    "strokes": 27,
    "mnemonic": "Tâm nguyện từ đáy lòng mong muốn được làm.",
    "example": {
      "hanzi": "你愿意和我们一起去爬山吗？",
      "pinyin": "Nǐ yuànyì hé wǒmen yìqǐ qù páshān ma?",
      "meaning": "Bạn có sẵn lòng cùng chúng tôi đi leo núi không?"
    }
  },
  {
    "id": 236,
    "hanzi": "参加",
    "pinyin": "cānjiā",
    "hanviet": "Tham gia",
    "meaning": "Tham gia, dự (sự kiện, kỳ thi)",
    "level": "HSK 3",
    "topic": "Hành động",
    "radical": "厶 (Khư)",
    "strokes": 13,
    "mnemonic": "Tham gia góp mặt tăng thêm sức mạnh tập thể.",
    "example": {
      "hanzi": "下个月我将参加HSK 3级考试。",
      "pinyin": "Xià gè yuè wǒ jiāng cānjiā HSK sān jí kǎoshì.",
      "meaning": "Tháng sau tôi sẽ tham gia kỳ thi HSK cấp 3."
    }
  },
  {
    "id": 237,
    "hanzi": "练习",
    "pinyin": "liànxí",
    "hanviet": "Luyện tập",
    "meaning": "Luyện tập, bài tập",
    "level": "HSK 3",
    "topic": "Học tập",
    "radical": "纟(Mịch)",
    "strokes": 14,
    "mnemonic": "Rèn giũa sợi tơ lặp đi lặp lại cho dẻo dai thành thạo.",
    "example": {
      "hanzi": "多做练习才能牢固掌握语法知识。",
      "pinyin": "Duō zuò liànxí cái néng láogù zhǎngwò yǔfǎ zhīshi.",
      "meaning": "Làm nhiều bài tập mới có thể nắm vững kiến thức ngữ pháp."
    }
  },
  {
    "id": 238,
    "hanzi": "检查",
    "pinyin": "jiǎnchá",
    "hanviet": "Kiểm tra",
    "meaning": "Kiểm tra, rà soát",
    "level": "HSK 3",
    "topic": "Học tập",
    "radical": "木 (Mộc)",
    "strokes": 20,
    "mnemonic": "Soi chiếu kỹ từng thẻ gỗ hồ sơ không bỏ sót.",
    "example": {
      "hanzi": "交卷前请仔细检查一遍名字和答案。",
      "pinyin": "Jiāojuàn qián qǐng zǐxì jiǎnchá yí biàn míngzi hé dá’àn.",
      "meaning": "Trước khi nộp bài hãy kiểm tra kỹ lại tên và đáp án."
    }
  },
  {
    "id": 239,
    "hanzi": "清楚",
    "pinyin": "qīngchu",
    "hanviet": "Thanh sở",
    "meaning": "Rõ ràng, rành mạch",
    "level": "HSK 3",
    "topic": "Tính từ",
    "radical": "氵(Chấm thủy)",
    "strokes": 24,
    "mnemonic": "Nước trong vắt (清) nhìn thấu đáy rừng cây (楚).",
    "example": {
      "hanzi": "老师，我听得很清楚，谢谢您。",
      "pinyin": "Lǎoshī, wǒ tīng de hěn qīngchu, xièxie nín.",
      "meaning": "Thưa cô, em nghe rất rõ rồi, cảm ơn cô."
    }
  },
  {
    "id": 240,
    "hanzi": "放心",
    "pinyin": "fàngxīn",
    "hanviet": "Phóng tâm",
    "meaning": "Yên tâm, an tâm",
    "level": "HSK 3",
    "topic": "Cảm xúc",
    "radical": "攵 (Phộc)",
    "strokes": 12,
    "mnemonic": "Thả lỏng trái tim buông bỏ âu lo muộn phiền.",
    "example": {
      "hanzi": "请爸爸妈妈放心，我在国外生活得很好。",
      "pinyin": "Qǐng bàba māma fàngxīn, wǒ zài guówài shēnghuó de hěn hǎo.",
      "meaning": "Xin bố mẹ yên tâm, con ở nước ngoài sống rất tốt."
    }
  },
  {
    "id": 241,
    "hanzi": "照顾",
    "pinyin": "zhàogù",
    "hanviet": "Chiếu cố",
    "meaning": "Chăm sóc, trông nom",
    "level": "HSK 3",
    "topic": "Gia đình",
    "radical": "灬 (Hỏa)",
    "strokes": 27,
    "mnemonic": "Chiếu ánh sáng chở che và quan tâm từng li từng tí.",
    "example": {
      "hanzi": "生病的时候，室友一直悉心照顾我。",
      "pinyin": "Shēngbìng de shíhou, shìyǒu yìzhí xīxīn zhàogù wǒ.",
      "meaning": "Lúc tôi bị ốm, bạn cùng phòng luôn chu đáo chăm sóc tôi."
    }
  },
  {
    "id": 242,
    "hanzi": "离开",
    "pinyin": "líkāi",
    "hanviet": "Ly khai",
    "meaning": "Rời khỏi, xa rời",
    "level": "HSK 3",
    "topic": "Hành động",
    "radical": "亠 (Đầu)",
    "strokes": 14,
    "mnemonic": "Rời xa cội nguồn cất bước đến chân trời mới.",
    "example": {
      "hanzi": "飞机将在半小时后离开跑道。",
      "pinyin": "Fēijī jiāng zài bàn xiǎoshí hòu líkāi pǎodào.",
      "meaning": "Máy bay sẽ rời đường băng sau nửa tiếng nữa."
    }
  },
  {
    "id": 243,
    "hanzi": "迟到",
    "pinyin": "chídào",
    "hanviet": "Trì đáo",
    "meaning": "Đến muộn, đi trễ",
    "level": "HSK 3",
    "topic": "Trường học",
    "radical": "辶 (Sước)",
    "strokes": 15,
    "mnemonic": "Bước chân chậm chạp (迟) đến nơi hẹn (到) trễ tràng.",
    "example": {
      "hanzi": "今天路上堵车，我很抱歉迟到了。",
      "pinyin": "Jīntiān lù shang dǔchē, wǒ hěn bàoqiàn chídào le.",
      "meaning": "Hôm nay trên đường bị tắc xe, tôi rất xin lỗi vì đã đến muộn."
    }
  },
  {
    "id": 244,
    "hanzi": "发现",
    "pinyin": "fāxiàn",
    "hanviet": "Phát hiện",
    "meaning": "Phát hiện, nhận thấy",
    "level": "HSK 3",
    "topic": "Hành động",
    "radical": "癶 (Bát)",
    "strokes": 17,
    "mnemonic": "Khai mở và nhìn thấy điều mới lạ trước mắt.",
    "example": {
      "hanzi": "我发现学习汉字其实非常有规律。",
      "pinyin": "Wǒ fāxiàn xuéxí hànzì qíshí fēicháng yǒu guīlǜ.",
      "meaning": "Tôi phát hiện học chữ Hán thực ra rất có quy luật."
    }
  },
  {
    "id": 245,
    "hanzi": "借",
    "pinyin": "jiè",
    "hanviet": "Tá",
    "meaning": "Mượn, vay",
    "level": "HSK 3",
    "topic": "Giao tiếp",
    "radical": "亻 (Nhân đứng)",
    "strokes": 10,
    "mnemonic": "Người này tạm thời chuyển giao cho người kia dùng.",
    "example": {
      "hanzi": "我想借用一下你的字典。",
      "pinyin": "Wǒ xiǎng jièyòng yíxià nǐ de zìdiǎn.",
      "meaning": "Tôi muốn mượn dùng cuốn từ điển của bạn một lát."
    }
  },
  {
    "id": 246,
    "hanzi": "习惯",
    "pinyin": "xíguàn",
    "hanviet": "Tập quán",
    "meaning": "Thói quen, quen với",
    "level": "HSK 3",
    "topic": "Đời sống",
    "radical": "习 (Tập)",
    "strokes": 14,
    "mnemonic": "Tập luyện thường xuyên qua năm tháng hóa thành thói quen.",
    "example": {
      "hanzi": "我已经完全习惯了这里的生活节奏。",
      "pinyin": "Wǒ yǐjīng wánquán xíguàn le zhèlǐ de shēnghuó jiézòu.",
      "meaning": "Tôi đã hoàn toàn quen với nhịp sống ở đây."
    }
  },
  {
    "id": 247,
    "hanzi": "其实",
    "pinyin": "qíshí",
    "hanviet": "Kỳ thực",
    "meaning": "Thực ra, kỳ thực",
    "level": "HSK 3",
    "topic": "Phó từ",
    "radical": "八 (Bát)",
    "strokes": 16,
    "mnemonic": "Bản chất sự thật đích thực ẩn chứa bên trong.",
    "example": {
      "hanzi": "很多事情看似很难，其实只要迈出第一步。",
      "pinyin": "Hěn duō shìqing kànsì hěn nán, qíshí zhǐyào màichū dì-yī bù.",
      "meaning": "Nhiều việc nhìn thì khó, thực ra chỉ cần bước bước đầu tiên."
    }
  },
  {
    "id": 248,
    "hanzi": "突然",
    "pinyin": "tūrán",
    "hanviet": "Đột nhiên",
    "meaning": "Đột nhiên, bất ngờ",
    "level": "HSK 3",
    "topic": "Phó từ",
    "radical": "穴 (Huyệt)",
    "strokes": 16,
    "mnemonic": "Chó từ trong hang (穴) bất ngờ lao vọt ra (突).",
    "example": {
      "hanzi": "外面突然下起了倾盆大雨。",
      "pinyin": "Wàimiàn tūrán xiàqǐ le qīngpén dàyǔ.",
      "meaning": "Bên ngoài đột nhiên đổ mưa như trút nước."
    }
  },
  {
    "id": 249,
    "hanzi": "终于",
    "pinyin": "zhōngyú",
    "hanviet": "Chung vu",
    "meaning": "Cuối cùng, rốt cuộc",
    "level": "HSK 3",
    "topic": "Phó từ",
    "radical": "纟(Mịch)",
    "strokes": 11,
    "mnemonic": "Sợi dây đi đến điểm kết thúc cuối cùng gặt hái quả ngọt.",
    "example": {
      "hanzi": "经过几个月的努力，我终于通过了考试！",
      "pinyin": "Jīngguò jǐ gè yuè de nǔlì, wǒ zhōngyú tōngguò le kǎoshì!",
      "meaning": "Sau mấy tháng nỗ lực, cuối cùng tôi đã vượt qua kỳ thi!"
    }
  },
  {
    "id": 250,
    "hanzi": "一定",
    "pinyin": "yídìng",
    "hanviet": "Nhất định",
    "meaning": "Nhất định, chắc chắn",
    "level": "HSK 3",
    "topic": "Phó từ",
    "radical": "一 (Nhất)",
    "strokes": 9,
    "mnemonic": "Một lòng kiên định không gì lay chuyển nổi.",
    "example": {
      "hanzi": "明天是周末，我一定要好好睡个懒觉。",
      "pinyin": "Míngtiān shì zhōumò, wǒ yídìng yào hǎohǎo shuì gè lǎnjiào.",
      "meaning": "Ngày mai là cuối tuần, tôi nhất định sẽ ngủ nướng một giấc thật đã."
    }
  },
  {
    "id": 251,
    "hanzi": "蛋糕",
    "pinyin": "dàngāo",
    "hanviet": "Đản cao",
    "meaning": "Bánh ngọt, bánh gato",
    "level": "HSK 3",
    "topic": "Ăn uống",
    "radical": "虫 (Trùng)",
    "strokes": 21,
    "mnemonic": "Bánh làm từ trứng gà (蛋) và bột mì xốp mềm ngọt ngào.",
    "example": {
      "hanzi": "祝你生日快乐，快来切蛋糕吧！",
      "pinyin": "Zhù nǐ shēngrì kuàilè, kuài lái qiē dàngāo ba!",
      "meaning": "Chúc bạn sinh nhật vui vẻ, mau lại cắt bánh gato nào!"
    }
  },
  {
    "id": 252,
    "hanzi": "面条",
    "pinyin": "miàntiáo",
    "hanviet": "Miến điều",
    "meaning": "Mì sợi",
    "level": "HSK 3",
    "topic": "Ăn uống",
    "radical": "麦 (Mạch)",
    "strokes": 16,
    "mnemonic": "Bột lúa mì kéo thành từng sợi dài dai ngon.",
    "example": {
      "hanzi": "生日那天中国人常常吃一碗长寿面条。",
      "pinyin": "Shēngrì nà tiān Zhōngguó rén chángcháng chī yì wǎn chángshòu miàntiáo.",
      "meaning": "Ngày sinh nhật người Trung Quốc thường ăn một bát mì trường thọ."
    }
  },
  {
    "id": 253,
    "hanzi": "面包",
    "pinyin": "miànbāo",
    "hanviet": "Miến bao",
    "meaning": "Bánh mì",
    "level": "HSK 3",
    "topic": "Ăn uống",
    "radical": "麦 (Mạch)",
    "strokes": 14,
    "mnemonic": "Bột mì nhào nặn bọc nhân nướng thơm phức.",
    "example": {
      "hanzi": "早晨我常常吃一块面包喝杯热牛奶。",
      "pinyin": "Zǎochén wǒ chángcháng chī yí kuài miànbāo hē bēi rè niúnǎi.",
      "meaning": "Buổi sáng tôi thường ăn một mẩu bánh mì và uống cốc sữa nóng."
    }
  },
  {
    "id": 254,
    "hanzi": "饮料",
    "pinyin": "yǐnliào",
    "hanviet": "Ẩm liệu",
    "meaning": "Đồ uống, nước giải khát",
    "level": "HSK 3",
    "topic": "Ăn uống",
    "radical": "饣(Thực)",
    "strokes": 14,
    "mnemonic": "Nguyên liệu thảo mộc pha chế thành đồ uống giải khát.",
    "example": {
      "hanzi": "请问您需要点什么冰镇饮料？",
      "pinyin": "Qǐngwèn nín xūyào diǎn shénme bīngzhèn yǐnliào?",
      "meaning": "Xin hỏi quý khách cần dùng thức uống ướp lạnh gì ạ?"
    }
  },
  {
    "id": 255,
    "hanzi": "空调",
    "pinyin": "kōngtiáo",
    "hanviet": "Không điều",
    "meaning": "Máy điều hòa",
    "level": "HSK 3",
    "topic": "Đời sống",
    "radical": "穴 (Huyệt)",
    "strokes": 18,
    "mnemonic": "Thiết bị điều tiết nhiệt độ không khí trong phòng.",
    "example": {
      "hanzi": "夏天屋里开了空调，非常凉快舒服。",
      "pinyin": "Xiàtiān wū lǐ kāi le kōngtiáo, fēicháng liángkuai shūfu.",
      "meaning": "Mùa hè trong phòng bật điều hòa rất mát mẻ dễ chịu."
    }
  },
  {
    "id": 256,
    "hanzi": "冰箱",
    "pinyin": "bīngxiāng",
    "hanviet": "Băng sương",
    "meaning": "Tủ lạnh",
    "level": "HSK 3",
    "topic": "Đời sống",
    "radical": "冫(Băng)",
    "strokes": 21,
    "mnemonic": "Chiếc hòm gỗ làm lạnh bằng băng bảo quản thực phẩm.",
    "example": {
      "hanzi": "冰箱里放着新鲜的水果和牛奶。",
      "pinyin": "Bīngxiāng lǐ fàng zhe xīnxiān de shuǐguǒ hé niúnǎi.",
      "meaning": "Trong tủ lạnh để đầy hoa quả tươi và sữa bò."
    }
  },
  {
    "id": 257,
    "hanzi": "伞",
    "pinyin": "sǎn",
    "hanviet": "Tản",
    "meaning": "Cái ô, cái dù",
    "level": "HSK 3",
    "topic": "Đời sống",
    "radical": "人 (Nhân)",
    "strokes": 6,
    "mnemonic": "Hình dáng chiếc ô có nan xòe rộng che chở con người.",
    "example": {
      "hanzi": "天阴了，带把伞以防下雨。",
      "pinyin": "Tiān yīn le, dài bǎ sǎn yǐ fáng xiàyǔ.",
      "meaning": "Trời âm u rồi, mang theo chiếc ô để phòng trời mưa."
    }
  },
  {
    "id": 258,
    "hanzi": "裙子",
    "pinyin": "qúnzi",
    "hanviet": "Quần tử",
    "meaning": "Váy, đầm",
    "level": "HSK 3",
    "topic": "Trang phục",
    "radical": "衤(Áo)",
    "strokes": 14,
    "mnemonic": "Tà áo váy vải vóc xúng xính của phái đẹp.",
    "example": {
      "hanzi": "她穿了一条红色的裙子，宛如仙女。",
      "pinyin": "Tā chuān le yì tiáo hóngsè de qúnzi, wǎnrú xiānnǚ.",
      "meaning": "Cô ấy mặc một chiếc váy đỏ, đẹp tựa tiên nữ."
    }
  },
  {
    "id": 259,
    "hanzi": "裤子",
    "pinyin": "kùzi",
    "hanviet": "Khố tử",
    "meaning": "Quần",
    "level": "HSK 3",
    "topic": "Trang phục",
    "radical": "衤(Áo)",
    "strokes": 14,
    "mnemonic": "Y phục hai ống xỏ chân bảo vệ cơ thể khi lao động.",
    "example": {
      "hanzi": "这条黑色裤子穿起来非常显瘦。",
      "pinyin": "Zhè tiáo hēisè kùzi chuān qǐlái fēicháng xiǎnshòu.",
      "meaning": "Chiếc quần màu đen này mặc vào trông rất thon gọn."
    }
  },
  {
    "id": 260,
    "hanzi": "鞋",
    "pinyin": "xié",
    "hanviet": "Hài",
    "meaning": "Giày dép",
    "level": "HSK 3",
    "topic": "Trang phục",
    "radical": "革 (Cách)",
    "strokes": 15,
    "mnemonic": "Làm từ da thuộc (革) bao bọc bàn chân vững bước.",
    "example": {
      "hanzi": "这双运动鞋走起路来轻便舒适。",
      "pinyin": "Zhè shuāng yùndòngxié zǒu qǐ lù lái qīngbiàn shūshì.",
      "meaning": "Đôi giày thể thao này đi bộ rất êm nhẹ và thoải mái."
    }
  },
  {
    "id": 261,
    "hanzi": "帽子",
    "pinyin": "màozi",
    "hanviet": "Mạo tử",
    "meaning": "Cái mũ, cái nón",
    "level": "HSK 3",
    "topic": "Trang phục",
    "radical": "巾 (Khăn)",
    "strokes": 14,
    "mnemonic": "Vải khăn (巾) đội trùm lên đầu che nắng che mưa.",
    "example": {
      "hanzi": "夏天在户外活动要记得戴帽子防晒。",
      "pinyin": "Xiàtiān zài hùwài huódòng yào jìde dài màozi fángshài.",
      "meaning": "Mùa hè hoạt động ngoài trời nhớ đội mũ chống nắng."
    }
  },
  {
    "id": 262,
    "hanzi": "护照",
    "pinyin": "hùzhào",
    "hanviet": "Hộ chiếu",
    "meaning": "Hộ chiếu, passport",
    "level": "HSK 3",
    "topic": "Du lịch",
    "radical": "扌(Thủ)",
    "strokes": 21,
    "mnemonic": "Giấy tờ chiếu cố bảo hộ xuất nhập cảnh quốc gia.",
    "example": {
      "hanzi": "出国旅游一定要妥善保管好护照。",
      "pinyin": "Chūguó lǚyóu yídìng yào tuǒshàn bǎoguǎn hǎo hùzhào.",
      "meaning": "Đi du lịch nước ngoài nhất định phải giữ gìn hộ chiếu cẩn thận."
    }
  },
  {
    "id": 263,
    "hanzi": "信用卡",
    "pinyin": "xìnyòngkǎ",
    "hanviet": "Tín dụng tạp",
    "meaning": "Thẻ tín dụng",
    "level": "HSK 3",
    "topic": "Mua sắm",
    "radical": "亻 (Nhân đứng)",
    "strokes": 19,
    "mnemonic": "Tấm thẻ từ bảo chứng niềm tin thanh toán thông minh.",
    "example": {
      "hanzi": "在许多商场都可以刷信用卡消费。",
      "pinyin": "Zài xǔduō shāngchǎng dōu kěyǐ shuā xìnyòngkǎ xiāofèi.",
      "meaning": "Tại nhiều trung tâm thương mại đều có thể quẹt thẻ tín dụng."
    }
  },
  {
    "id": 264,
    "hanzi": "钱包",
    "pinyin": "qiánbāo",
    "hanviet": "Tiền bao",
    "meaning": "Ví tiền, bóp tiền",
    "level": "HSK 3",
    "topic": "Đời sống",
    "radical": "钅(Kim)",
    "strokes": 15,
    "mnemonic": "Túi nhỏ bọc gói cất giữ tiền bạc an toàn.",
    "example": {
      "hanzi": "糟糕，我把钱包忘在出租车上了！",
      "pinyin": "Zāogāo, wǒ bǎ qiánbāo wàng zài chūzūchē shang le!",
      "meaning": "Thôi chết, tôi để quên ví tiền trên xe taxi rồi!"
    }
  },
  {
    "id": 265,
    "hanzi": "邻居",
    "pinyin": "línjū",
    "hanviet": "Lân cư",
    "meaning": "Hàng xóm, láng giềng",
    "level": "HSK 3",
    "topic": "Xã hội",
    "radical": "阝(Ấp)",
    "strokes": 15,
    "mnemonic": "Những người sinh sống kề cận liền kề tổ ấm.",
    "example": {
      "hanzi": "俗话说远亲不如近邻，邻居间要互相帮助。",
      "pinyin": "Súhuà shuō yuǎnqīn bùrú jìnlín, línjū jiān yào hùxiāng bāngzhù.",
      "meaning": "Người xưa nói bà con xa không bằng láng giềng gần, hàng xóm nên giúp nhau."
    }
  },
  {
    "id": 266,
    "hanzi": "司机",
    "pinyin": "sījī",
    "hanviet": "Ty cơ",
    "meaning": "Tài xế, bác tài",
    "level": "HSK 3",
    "topic": "Nghề nghiệp",
    "radical": "口 (Khẩu)",
    "strokes": 11,
    "mnemonic": "Người chuyên trách điều khiển cỗ máy xe cộ.",
    "example": {
      "hanzi": "出租车司机师傅非常熟悉北京的路线。",
      "pinyin": "Chūzūchē sījī shīfu fēicháng shúxī Běijīng de lùxiàn.",
      "meaning": "Bác tài xế taxi rất thông thuộc các tuyến đường Bắc Kinh."
    }
  },
  {
    "id": 267,
    "hanzi": "太阳",
    "pinyin": "tàiyáng",
    "hanviet": "Thái dương",
    "meaning": "Mặt trời",
    "level": "HSK 3",
    "topic": "Thiên nhiên",
    "radical": "日 (Nhật)",
    "strokes": 10,
    "mnemonic": "Nguồn sáng cực đại sưởi ấm mặt đất muôn loài.",
    "example": {
      "hanzi": "清晨一轮红日太阳从东方冉冉升起。",
      "pinyin": "Qīngchén yì lún hóngrì tàiyáng cóng dōngfāng rǎnrǎn shēngqǐ.",
      "meaning": "Sáng sớm một vầng mặt trời đỏ rực từ phương Đông từ từ nhô lên."
    }
  },
  {
    "id": 268,
    "hanzi": "月亮",
    "pinyin": "yuèliang",
    "hanviet": "Nguyệt lượng",
    "meaning": "Mặt trăng",
    "level": "HSK 3",
    "topic": "Thiên nhiên",
    "radical": "月 (Nguyệt)",
    "strokes": 13,
    "mnemonic": "Vầng trăng sáng vằng vặc tỏa ánh dịu mát ban đêm.",
    "example": {
      "hanzi": "今晚的月亮又圆又大，皎洁迷人。",
      "pinyin": "Jīnwǎn de yuèliang yòu yuán yòu dà, jiǎojié mírén.",
      "meaning": "Mặt trăng đêm nay vừa tròn vừa to, sáng trong mê hoặc."
    }
  },
  {
    "id": 269,
    "hanzi": "树",
    "pinyin": "shù",
    "hanviet": "Thụ",
    "meaning": "Cây cối",
    "level": "HSK 3",
    "topic": "Thiên nhiên",
    "radical": "木 (Mộc)",
    "strokes": 9,
    "mnemonic": "Cây gỗ đứng sừng sững cắm rễ sâu vào lòng đất.",
    "example": {
      "hanzi": "道路两旁种满了高大挺拔的绿树。",
      "pinyin": "Dàolù liǎngpáng zhòng mǎn le gāodà tǐngbá de lǜ shù.",
      "meaning": "Hai bên đường trồng đầy những hàng cây xanh cao lớn thẳng tắp."
    }
  },
  {
    "id": 270,
    "hanzi": "花",
    "pinyin": "huā",
    "hanviet": "Hoa",
    "meaning": "Bông hoa, tiêu (tiền/thời gian)",
    "level": "HSK 3",
    "topic": "Thiên nhiên",
    "radical": "艹 (Thảo)",
    "strokes": 7,
    "mnemonic": "Nụ hoa thảo mộc hé nở khoe sắc muôn màu.",
    "example": {
      "hanzi": "春天公园里盛开着各种鲜花。",
      "pinyin": "Chūntiān gōngyuán lǐ shèngkāi zhe gèzhǒng xiānhuā.",
      "meaning": "Mùa xuân trong công viên nở rộ đủ các loài hoa tươi."
    }
  },
  {
    "id": 271,
    "hanzi": "草",
    "pinyin": "cǎo",
    "hanviet": "Thảo",
    "meaning": "Cỏ, cây cỏ",
    "level": "HSK 3",
    "topic": "Thiên nhiên",
    "radical": "艹 (Thảo)",
    "strokes": 9,
    "mnemonic": "Ngọn cỏ non mọc xanh rờn đón nắng sớm mai.",
    "example": {
      "hanzi": "春风吹又生，青草生机勃勃。",
      "pinyin": "Chūnfēng chuī yòu shēng, qīngcǎo shēngjī bóbó.",
      "meaning": "Gió xuân thổi lại mọc, cỏ xanh bừng bừng sức sống."
    }
  },
  {
    "id": 272,
    "hanzi": "鸟",
    "pinyin": "niǎo",
    "hanviet": "Điểu",
    "meaning": "Con chim",
    "level": "HSK 3",
    "topic": "Động vật",
    "radical": "鸟 (Điểu)",
    "strokes": 5,
    "mnemonic": "Hình ảnh chú chim nhỏ có mỏ và mắt hót vang trên cành.",
    "example": {
      "hanzi": "清晨森林里传来清脆悦耳的鸟叫声。",
      "pinyin": "Qīngchén sēnlín lǐ chuánlái qīngcuì yuè’ěr de niǎo jiàoshēng.",
      "meaning": "Sáng sớm trong rừng vọng lại tiếng chim hót trong trẻo êm tai."
    }
  },
  {
    "id": 273,
    "hanzi": "熊猫",
    "pinyin": "xióngmāo",
    "hanviet": "Hùng miêu",
    "meaning": "Gấu trúc (quốc bảo TQ)",
    "level": "HSK 3",
    "topic": "Động vật",
    "radical": "犭(Khuyển)",
    "strokes": 25,
    "mnemonic": "Loài gấu tròn trĩnh đáng yêu chuyên ăn lá trúc.",
    "example": {
      "hanzi": "中国大熊猫是深受全世界喜爱的国宝。",
      "pinyin": "Zhōngguó dàxióngmāo shì shēn shòu quán shìjiè xǐ’ài de guóbǎo.",
      "meaning": "Gấu trúc lớn Trung Quốc là quốc bảo được cả thế giới yêu mến."
    }
  },
  {
    "id": 274,
    "hanzi": "季节",
    "pinyin": "jìjié",
    "hanviet": "Quý tiết",
    "meaning": "Mùa, mùa màng",
    "level": "HSK 3",
    "topic": "Thời tiết",
    "radical": "子 (Tử)",
    "strokes": 13,
    "mnemonic": "Bốn mùa xuân hạ thu đông luân chuyển.",
    "example": {
      "hanzi": "秋天是我最喜欢的丰收季节。",
      "pinyin": "Qiūtiān shì wǒ zuì xǐhuan de fēngshōu jìjié.",
      "meaning": "Mùa thu là mùa thu hoạch mà tôi yêu thích nhất."
    }
  },
  {
    "id": 275,
    "hanzi": "春天",
    "pinyin": "chūntiān",
    "hanviet": "Xuân thiên",
    "meaning": "Mùa xuân",
    "level": "HSK 3",
    "topic": "Thời tiết",
    "radical": "日 (Nhật)",
    "strokes": 13,
    "mnemonic": "Mặt trời (日) sưởi ấm mầm cây ngày xuân ấm áp.",
    "example": {
      "hanzi": "春天万物复苏，生机盎然。",
      "pinyin": "Chūntiān wànwù fùsū, shēngjī àngrán.",
      "meaning": "Mùa xuân vạn vật hồi sinh, tràn ngập sức sống."
    }
  },
  {
    "id": 276,
    "hanzi": "夏天",
    "pinyin": "xiàtiān",
    "hanviet": "Hạ thiên",
    "meaning": "Mùa hè, mùa hạ",
    "level": "HSK 3",
    "topic": "Thời tiết",
    "radical": "夂 (Trĩ)",
    "strokes": 14,
    "mnemonic": "Mùa ve kêu hè về sôi động dưới bóng râm.",
    "example": {
      "hanzi": "夏天我们常常去海滩游泳消暑。",
      "pinyin": "Xiàtiān wǒmen chángcháng qù hǎitān yóuyǒng xiāoshǔ.",
      "meaning": "Mùa hè chúng tôi thường đi biển bơi để giải nhiệt."
    }
  },
  {
    "id": 277,
    "hanzi": "秋天",
    "pinyin": "qiūtiān",
    "hanviet": "Thu thiên",
    "meaning": "Mùa thu",
    "level": "HSK 3",
    "topic": "Thời tiết",
    "radical": "禾 (Hòa)",
    "strokes": 13,
    "mnemonic": "Cây lúa (禾) ngả màu vàng rực đón ngọn lửa thu hoạch.",
    "example": {
      "hanzi": "秋天的香山枫叶红遍，美不胜收。",
      "pinyin": "Qiūtiān de Xiāngshān fēngyè hóng biàn, měi bù shèng shōu.",
      "meaning": "Mùa thu lá phong núi Hương Đỏ rực, đẹp không sao xiết."
    }
  },
  {
    "id": 278,
    "hanzi": "冬天",
    "pinyin": "dōngtiān",
    "hanviet": "Đông thiên",
    "meaning": "Mùa đông",
    "level": "HSK 3",
    "topic": "Thời tiết",
    "radical": "冫(Băng)",
    "strokes": 9,
    "mnemonic": "Băng giá (冫) bao phủ đất trời mùa đông lạnh buốt.",
    "example": {
      "hanzi": "冬天堆雪人和滑雪是一件很有趣的事。",
      "pinyin": "Dōngtiān duī xuěrén hé huáxuě shì yí jiàn hěn yǒuqù de shì.",
      "meaning": "Mùa đông đắp người tuyết và trượt tuyết là điều vô cùng thú vị."
    }
  }
];

export const TOPIC_FILTERS = [
  'Tất cả',
  'Chào hỏi',
  'Gia đình',
  'Trường học',
  'Ăn uống',
  'Mua sắm',
  'Thời gian',
  'Cảm xúc',
  'Công việc',
  'Du lịch',
  'Công nghệ',
  'Đời sống'
];

export const LESSONS_DATA = [
  {
    id: 'lesson-1',
    number: 1,
    title: 'Chào hỏi cơ bản (问好)',
    subtitle: 'Nắm chắc cách chào hỏi, cảm ơn và tạm biệt chuẩn phát âm Bắc Kinh.',
    level: 'HSK 1',
    durationMinutes: 15,
    xpReward: 50,
    vocabList: [
      { hanzi: '你好', pinyin: 'nǐ hǎo', hanviet: 'Nhĩ hảo', meaning: 'Xin chào', example: '你好，我是李华。' },
      { hanzi: '您好', pinyin: 'nín hǎo', hanviet: 'Nâm hảo', meaning: 'Chào ông/bà (kính ngữ)', example: '老师，您好！' },
      { hanzi: '谢谢', pinyin: 'xièxie', hanviet: 'Tạ tạ', meaning: 'Cảm ơn', example: '谢谢你的礼物。' },
      { hanzi: '不客气', pinyin: 'bú kèqi', hanviet: 'Bất khách khí', meaning: 'Không có chi', example: 'A: 谢谢！B: 不客气。' },
      { hanzi: '再见', pinyin: 'zàijiàn', hanviet: 'Tái kiến', meaning: 'Tạm biệt', example: '老师，再见！' }
    ],
    grammar: {
      title: 'Biến điệu thanh 3 trong 你好 (nǐ hǎo)',
      explanation: 'Khi hai âm tiết mang thanh 3 đi liền nhau, âm tiết thứ nhất sẽ biến điệu phát âm thành thanh 2. Vì vậy, "nǐ hǎo" trên thực tế sẽ được phát âm là "ní hǎo". Đây là quy tắc cực kỳ quan trọng giúp câu nói mềm mại và tự nhiên như người bản xứ.',
      examples: [
        { hanzi: '你好', read: 'nǐ hǎo ➔ đọc thành [ní hǎo]', meaning: 'Xin chào' },
        { hanzi: '您可以', read: 'kěyǐ ➔ đọc thành [kéyǐ]', meaning: 'Có thể' }
      ]
    },
    quizzes: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Khi gặp người lớn tuổi hoặc thầy cô giáo, bạn nên dùng từ nào để thể hiện sự tôn trọng?',
        options: ['你好 (nǐ hǎo)', '您好 (nín hǎo)', '再见 (zàijiàn)', '不客气 (bú kèqi)'],
        correctIndex: 1,
        explanation: '您 (nín) là đại từ ngôi thứ hai số ít trang trọng (có thêm bộ Tâm 心 ở dưới chữ 你), dùng để xưng hô kính trọng với người lớn, thầy cô, đối tác.'
      },
      {
        id: 'q2',
        type: 'listening',
        question: 'Nghe đoạn audio sau và chọn nghĩa tiếng Việt chính xác:',
        audioText: '谢谢你！',
        options: ['Tạm biệt bạn!', 'Cảm ơn bạn!', 'Xin hỏi tên bạn?', 'Bạn có khỏe không?'],
        correctIndex: 1,
        explanation: '谢谢 (xièxie) nghĩa là cảm ơn, 谢谢你 (xièxie nǐ) là "cảm ơn bạn".'
      },
      {
        id: 'q3',
        type: 'reorder',
        question: 'Sắp xếp các từ sau thành câu hoàn chỉnh mang nghĩa "Thầy giáo, xin chào thầy!":',
        words: ['您好', '老师', '！'],
        correctOrder: ['老师', '您好', '！'],
        explanation: 'Trong tiếng Trung, danh xưng (thầy cô, chức vụ) thường được đặt ở đầu câu trước lời chào.'
      }
    ]
  },
  {
    id: 'lesson-2',
    number: 2,
    title: 'Giới thiệu bản thân (自我介绍)',
    subtitle: 'Nói tên, quốc tịch người Việt Nam và làm quen với bạn mới.',
    level: 'HSK 1',
    durationMinutes: 18,
    xpReward: 60,
    vocabList: [
      { hanzi: '我', pinyin: 'wǒ', hanviet: 'Ngã', meaning: 'Tôi, mình', example: '我是学生。' },
      { hanzi: '是', pinyin: 'shì', hanviet: 'Thị', meaning: 'Là', example: '他是中国人。' },
      { hanzi: '越南人', pinyin: 'Yuènán rén', hanviet: 'Việt Nam nhân', meaning: 'Người Việt Nam', example: '我们都是越南人。' },
      { hanzi: '叫', pinyin: 'jiào', hanviet: 'Khiếu', meaning: 'Tên là, gọi là', example: '我叫明。' },
      { hanzi: '很高兴', pinyin: 'hěn gāoxìng', hanviet: 'Hẳn cao hứng', meaning: 'Rất vui', example: '认识你很高兴。' }
    ],
    grammar: {
      title: 'Cấu trúc câu khẳng định chữ 是 (shì - Là)',
      explanation: 'Chữ 是 tương tự như động từ "to be" trong tiếng Anh hoặc "là" trong tiếng Việt: Chủ ngữ + 是 + Danh từ.',
      examples: [
        { hanzi: '我是越南人。', read: 'Wǒ shì Yuènán rén.', meaning: 'Tôi là người Việt Nam.' },
        { hanzi: '他是我的老师。', read: 'Tā shì wǒ de lǎoshī.', meaning: 'Thầy ấy là giáo viên của tôi.' }
      ]
    },
    quizzes: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Câu nào sau đây dịch đúng câu: "Tôi là người Việt Nam"?',
        options: [
          '我叫越南人。 (Wǒ jiào Yuènán rén.)',
          '我是越南人。 (Wǒ shì Yuènán rén.)',
          '我有越南人。 (Wǒ yǒu Yuènán rén.)',
          '我去越南人。 (Wǒ qù Yuènán rén.)'
        ],
        correctIndex: 1,
        explanation: 'Sử dụng cấu trúc: Chủ ngữ (我) + 是 + Danh từ (越南人).'
      },
      {
        id: 'q2',
        type: 'listening',
        audioText: '很高兴认识你！',
        question: 'Nghe và xác định câu này thường được nói vào thời điểm nào?',
        options: [
          'Khi lần đầu tiên gặp gỡ và làm quen',
          'Khi muốn nhờ người khác giúp đỡ',
          'Khi bước vào cửa hàng mua đồ',
          'Khi chuẩn bị đi ngủ'
        ],
        correctIndex: 0,
        explanation: '很高兴认识你 (hěn gāoxìng rènshi nǐ) nghĩa là "Rất vui được làm quen với bạn".'
      },
      {
        id: 'q3',
        type: 'reorder',
        question: 'Ghép câu: "Tôi tên là Lý Hoa."',
        words: ['李华', '我', '叫', '。'],
        correctOrder: ['我', '叫', '李华', '。'],
        explanation: 'Cấu trúc giới thiệu tên: 我 + 叫 + [Tên riêng].'
      }
    ]
  },
  {
    id: 'lesson-3',
    number: 3,
    title: 'Số đếm và tuổi (数字与年龄)',
    subtitle: 'Nắm vững quy tắc đếm từ 1 đến 100 và hỏi tuổi đối phương.',
    level: 'HSK 1',
    durationMinutes: 15,
    xpReward: 50,
    vocabList: [
      { hanzi: '一', pinyin: 'yī', hanviet: 'Nhất', meaning: 'Số 1', example: '一个人。' },
      { hanzi: '十', pinyin: 'shí', hanviet: 'Thập', meaning: 'Số 10', example: '十块钱。' },
      { hanzi: '百', pinyin: 'bǎi', hanviet: 'Bách', meaning: 'Trăm', example: '一百。' },
      { hanzi: '岁', pinyin: 'suì', hanviet: 'Tuế', meaning: 'Tuổi', example: '我二十岁。' },
      { hanzi: '多大', pinyin: 'duō dà', hanviet: 'Đa đại', meaning: 'Bao nhiêu tuổi', example: '你多大了？' }
    ],
    grammar: {
      title: 'Cách hỏi tuổi trong tiếng Trung',
      explanation: 'Để hỏi tuổi người cùng trang lứa hoặc trẻ tuổi: "你多大了？" (Nǐ duō dà le?). Nếu hỏi trẻ em dưới 10 tuổi: "你几岁了？" (Nǐ jǐ suì le?). Nếu hỏi người lớn tuổi kính trọng: "您多大年纪了？".',
      examples: [
        { hanzi: '你今年多大？', read: 'Nǐ jīnnián duō dà?', meaning: 'Năm nay bạn bao nhiêu tuổi?' },
        { hanzi: '我今年二十五岁。', read: 'Wǒ jīnnián èrshíwǔ suì.', meaning: 'Năm nay tôi 25 tuổi.' }
      ]
    },
    quizzes: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Số 48 trong tiếng Trung được viết và đọc như thế nào?',
        options: ['十四 (shísì)', '四十八 (sìshíbā)', '八十四 (bāshísì)', '四八 (sìbā)'],
        correctIndex: 1,
        explanation: 'Số 48 gồm 4 chục (四 + 十) và 8 đơn vị (八) => 四十八 (sìshíbā).'
      },
      {
        id: 'q2',
        type: 'listening',
        audioText: '我今年二十岁。',
        question: 'Người nói trong câu bao nhiêu tuổi?',
        options: ['12 tuổi', '20 tuổi', '22 tuổi', '30 tuổi'],
        correctIndex: 1,
        explanation: '二十岁 (èrshí suì) là 20 tuổi.'
      },
      {
        id: 'q3',
        type: 'reorder',
        question: 'Sắp xếp câu: "Năm nay bạn bao nhiêu tuổi?"',
        words: ['今年', '你', '多大', '了', '？'],
        correctOrder: ['你', '今年', '多大', '了', '？'],
        explanation: 'Trật tự câu: Chủ ngữ (你) + Trạng từ thời gian (今年) + Từ để hỏi (多大) + 了 + ?'
      }
    ]
  },
  {
    id: 'lesson-4',
    number: 4,
    title: 'Gia đình và người thân (家庭成员)',
    subtitle: 'Kể về các thành viên trong gia đình và nghề nghiệp của họ.',
    level: 'HSK 1',
    durationMinutes: 20,
    xpReward: 60,
    vocabList: [
      { hanzi: '爸爸', pinyin: 'bàba', hanviet: 'Ba ba', meaning: 'Bố', example: '我爸爸是医生。' },
      { hanzi: '妈妈', pinyin: 'māma', hanviet: 'Ma ma', meaning: 'Mẹ', example: '我妈妈在学校工作。' },
      { hanzi: '哥哥', pinyin: 'gēge', hanviet: 'Ca ca', meaning: 'Anh trai', example: '我有一个哥哥。' },
      { hanzi: '妹妹', pinyin: 'mèimei', hanviet: 'Muội muội', meaning: 'Em gái', example: '妹妹很喜欢看书。' },
      { hanzi: '有', pinyin: 'yǒu', hanviet: 'Hữu', meaning: 'Có', example: '你家有几口人？' }
    ],
    grammar: {
      title: 'Lượng từ 口 (kǒu) dùng cho nhân khẩu gia đình',
      explanation: 'Khi đếm số lượng người trong gia đình, người Trung Quốc dùng lượng từ 口 (kǒu - nghĩa gốc là miệng ăn): Gia đình có + số lượng + 口人.',
      examples: [
        { hanzi: '我家有四口人。', read: 'Wǒ jiā yǒu sì kǒu rén.', meaning: 'Nhà tôi có 4 người.' },
        { hanzi: '你家有几口人？', read: 'Nǐ jiā yǒu jǐ kǒu rén?', meaning: 'Nhà bạn có mấy người?' }
      ]
    },
    quizzes: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Lượng từ nào dùng để đếm thành viên trong gia đình?',
        options: ['个 (gè)', '只 (zhī)', '口 (kǒu)', '张 (zhāng)'],
        correctIndex: 2,
        explanation: 'Dùng 口 (kǒu) trong cụm từ cố định: ...口人 (nhân khẩu).'
      },
      {
        id: 'q2',
        type: 'listening',
        audioText: '我有一个哥哥和一个妹妹。',
        question: 'Người nói có những người thân nào?',
        options: ['1 anh trai và 1 em trai', '1 anh trai và 1 em gái', '1 chị gái và 1 em gái', '2 em gái'],
        correctIndex: 1,
        explanation: '哥哥 (gēge) là anh trai, 妹妹 (mèimei) là em gái.'
      },
      {
        id: 'q3',
        type: 'reorder',
        question: 'Sắp xếp câu: "Nhà tôi có năm người."',
        words: ['我家', '有', '五', '口人', '。'],
        correctOrder: ['我家', '有', '五', '口人', '。'],
        explanation: '我家 (nhà tôi) + 有 (có) + 五口人 (5 người).'
      }
    ]
  },
  {
    id: 'lesson-5',
    number: 5,
    title: 'Thời gian & Lịch trình (时间与日常)',
    subtitle: 'Nói giờ giấc, ngày trong tuần và sắp xếp lịch hẹn.',
    level: 'HSK 1',
    durationMinutes: 18,
    xpReward: 55,
    vocabList: [
      { hanzi: '现在', pinyin: 'xiànzài', hanviet: 'Hiện tại', meaning: 'Bây giờ', example: '现在几点？' },
      { hanzi: '点', pinyin: 'diǎn', hanviet: 'Điểm', meaning: 'Giờ (thời điểm)', example: '八点三十分。' },
      { hanzi: '分', pinyin: 'fēn', hanviet: 'Phân', meaning: 'Phút', example: '差五分九点。' },
      { hanzi: '今天', pinyin: 'jīntiān', hanviet: 'Kim thiên', meaning: 'Hôm nay', example: '今天星期几？' },
      { hanzi: '星期', pinyin: 'xīngqī', hanviet: 'Tinh kỳ', meaning: 'Thứ, tuần', example: '星期一 (thứ Hai).' }
    ],
    grammar: {
      title: 'Quy tắc nói thời gian: Lớn trước, nhỏ sau',
      explanation: 'Trong tiếng Trung, đơn vị thời gian lớn luôn đứng trước đơn vị thời gian nhỏ: Năm -> Tháng -> Ngày -> Buổi -> Giờ -> Phút.',
      examples: [
        { hanzi: '今天上午八点', read: 'Jīntiān shàngwǔ bā diǎn', meaning: '8 giờ sáng hôm nay' },
        { hanzi: '星期天下午三点半', read: 'Xīngqītiān xiàwǔ sān diǎn bàn', meaning: '3 giờ rưỡi chiều Chủ nhật' }
      ]
    },
    quizzes: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Trong tiếng Trung, "Thứ Tư" được nói như thế nào?',
        options: ['星期四 (xīngqīsì)', '星期三 (xīngqīsān)', '星期五 (xīngqīwǔ)', '星期二 (xīngqī’èr)'],
        correctIndex: 1,
        explanation: 'Tiếng Trung bắt đầu từ Thứ Hai là 星期一 (xīngqīyī), Thứ Ba là 星期二, Thứ Tư là 星期三!'
      },
      {
        id: 'q2',
        type: 'listening',
        audioText: '现在是下午两点十分。',
        question: 'Thời gian được nhắc đến là mấy giờ?',
        options: ['2 giờ 10 phút sáng', '2 giờ 10 phút chiều', '10 giờ 2 phút sáng', '12 giờ 10 phút trưa'],
        correctIndex: 1,
        explanation: '下午 (xiàwǔ) là buổi chiều, 两点十分 (liǎng diǎn shí fēn) là 2 giờ 10 phút.'
      },
      {
        id: 'q3',
        type: 'reorder',
        question: 'Sắp xếp câu hỏi: "Bây giờ là mấy giờ rồi?"',
        words: ['几点', '现在', '了', '？'],
        correctOrder: ['现在', '几点', '了', '？'],
        explanation: '现在 (bây giờ) + 几点 (mấy giờ) + 了 (rồi) + ?'
      }
    ]
  },
  {
    id: 'lesson-6',
    number: 6,
    title: 'Gọi món tại nhà hàng (在餐厅点菜)',
    subtitle: 'Tự tin gọi món ăn Trung Hoa, xin trà đá và thanh toán hóa đơn.',
    level: 'HSK 1',
    durationMinutes: 20,
    xpReward: 65,
    vocabList: [
      { hanzi: '服务员', pinyin: 'fúwùyuán', hanviet: 'Phục vụ viên', meaning: 'Người phục vụ', example: '服务员，请点菜！' },
      { hanzi: '菜单', pinyin: 'càidān', hanviet: 'Thái đơn', meaning: 'Thực đơn, menu', example: '请给我看一下菜单。' },
      { hanzi: '饺子', pinyin: 'jiǎozi', hanviet: 'Giảo tử', meaning: 'Bánh sủi cảo', example: '我要一盘饺子。' },
      { hanzi: '买单', pinyin: 'mǎidān', hanviet: 'Mãi đơn', meaning: 'Thanh toán, tính tiền', example: '服务员，买单！' },
      { hanzi: '多少钱', pinyin: 'duōshao qián', hanviet: 'Đa thiểu tiền', meaning: 'Bao nhiêu tiền', example: '一共多少钱？' }
    ],
    grammar: {
      title: 'Động từ năng nguyện 要 (yào) khi gọi món',
      explanation: 'Khi gọi món trong nhà hàng, ta dùng "我要 + tên món" (Tôi muốn / Cho tôi món...) rất tự nhiên và lịch sự.',
      examples: [
        { hanzi: '我要一碗牛肉面。', read: 'Wǒ yào yì wǎn niúròumiàn.', meaning: 'Cho tôi một bát mì bò.' },
        { hanzi: '我们要两瓶啤酒。', read: 'Wǒmen yào liǎng píng píjiǔ.', meaning: 'Chúng tôi muốn 2 chai bia.' }
      ]
    },
    quizzes: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Khi muốn gọi nhân viên tính tiền, người Trung Quốc thường nói:',
        options: ['服务员，点菜！', '服务员，买单！', '服务员，再见！', '服务员，你好！'],
        correctIndex: 1,
        explanation: '买单 (mǎidān) nghĩa là thanh toán hóa đơn.'
      },
      {
        id: 'q2',
        type: 'listening',
        audioText: '请给我一杯热茶，谢谢。',
        question: 'Khách hàng đang gọi thức uống gì?',
        options: ['Một cốc cà phê', 'Một cốc bia lạnh', 'Một cốc trà nóng', 'Một chai nước ngọt'],
        correctIndex: 2,
        explanation: '热茶 (rè chá) là trà nóng.'
      },
      {
        id: 'q3',
        type: 'reorder',
        question: 'Sắp xếp câu: "Tất cả hết bao nhiêu tiền?"',
        words: ['一共', '多少钱', '？'],
        correctOrder: ['一共', '多少钱', '？'],
        explanation: '一共 (tổng cộng) + 多少钱 (bao nhiêu tiền) + ?'
      }
    ]
  }
];

export const PINYIN_DATA = {
  initials: [
    { sound: 'b', vietGuide: 'Đọc gần như "p" trong tiếng Việt, không bật hơi', example: 'bā (八 - Tám)' },
    { sound: 'p', vietGuide: 'Bật hơi mạnh, môi mím rồi bật luồng hơi ra', example: 'píng (苹 - Táo)' },
    { sound: 'm', vietGuide: 'Đọc giống "m" tiếng Việt', example: 'mā (妈 - Mẹ)' },
    { sound: 'f', vietGuide: 'Đọc giống "ph" tiếng Việt', example: 'fēi (飞 - Bay)' },
    { sound: 'd', vietGuide: 'Đọc gần như "t" tiếng Việt, không bật hơi', example: 'dà (大 - To lớn)' },
    { sound: 't', vietGuide: 'Bật hơi mạnh, đọc giống "th" tiếng Việt', example: 'tā (他 - Anh ấy)' },
    { sound: 'n', vietGuide: 'Đọc giống "n" tiếng Việt', example: 'nǐ (你 - Bạn)' },
    { sound: 'l', vietGuide: 'Đọc giống "l" tiếng Việt', example: 'lǎo (老 - Già/Thầy)' },
    { sound: 'g', vietGuide: 'Đọc giống "c/k" tiếng Việt không bật hơi', example: 'gē (哥 - Anh trai)' },
    { sound: 'k', vietGuide: 'Bật hơi mạnh trong cuống họng giống "kh"', example: 'kàn (看 - Nhìn/Xem)' },
    { sound: 'h', vietGuide: 'Hơi lai giữa "h" và "kh" tiếng Việt', example: 'hǎo (好 - Tốt/Hay)' },
    { sound: 'j', vietGuide: 'Mặt lưỡi áp ngạc cứng, giống "ch" nhẹ', example: 'jiào (叫 - Kêu/Tên)' },
    { sound: 'q', vietGuide: 'Bật hơi mạnh từ mặt lưỡi, âm tắc xát', example: 'qù (去 - Đi)' },
    { sound: 'x', vietGuide: 'Mặt lưỡi nâng nhẹ, giống "x" tiếng Việt', example: 'xiè (谢 - Cảm ơn)' },
    { sound: 'zh', vietGuide: 'Đầu lưỡi uốn lên vòm miệng, không bật hơi (như "tr")', example: 'zhōng (中 - Giữa)' },
    { sound: 'ch', vietGuide: 'Uốn lưỡi và BẬT HƠI mạnh, đầu lưỡi thụt nhẹ', example: 'chī (吃 - Ăn)' },
    { sound: 'sh', vietGuide: 'Uốn lưỡi thổi luồng hơi ra, giống "s" nặng miền Nam', example: 'shì (是 - Là)' },
    { sound: 'r', vietGuide: 'Uốn lưỡi rung nhẹ, gần giống "r" tiếng Việt', example: 'rén (人 - Người)' },
    { sound: 'z', vietGuide: 'Đầu lưỡi thẳng chạm răng trên, không bật hơi', example: 'zài (在 - Ở)' },
    { sound: 'c', vietGuide: 'Đầu lưỡi thẳng và BẬT HƠI mạnh', example: 'cài (菜 - Món ăn)' },
    { sound: 's', vietGuide: 'Đầu lưỡi thẳng xát nhẹ qua kẽ răng, như "x"', example: 'sì (四 - Bốn)' }
  ],
  finals: [
    { sound: 'a', vietGuide: 'Đọc như "a" tròn miệng', example: 'bà' },
    { sound: 'o', vietGuide: 'Đọc hơi lai giữa "ô" và "ua"', example: 'bō' },
    { sound: 'e', vietGuide: 'Đọc gần như "ơ" hoặc "ưa"', example: 'gē' },
    { sound: 'i', vietGuide: 'Đọc như "i" (với zh, ch, sh, z, c, s đọc là "ư")', example: 'nǐ / shì' },
    { sound: 'u', vietGuide: 'Đọc như "u" tiếng Việt tròn môi', example: 'bù' },
    { sound: 'ü', vietGuide: 'Tròn môi huýt sáo đọc "uy", không dẹt mép', example: 'lǜ (绿 - Xanh)' },
    { sound: 'ai', vietGuide: 'Đọc như "ai"', example: 'bái' },
    { sound: 'ei', vietGuide: 'Đọc như "ây"', example: 'běi' },
    { sound: 'ao', vietGuide: 'Đọc như "ao"', example: 'gāo' },
    { sound: 'ou', vietGuide: 'Đọc như "âu"', example: 'dōu' },
    { sound: 'an', vietGuide: 'Đọc như "an"', example: 'sān' },
    { sound: 'en', vietGuide: 'Đọc như "ơn/ân"', example: 'hěn' },
    { sound: 'ang', vietGuide: 'Đọc như "ang"', example: 'bāng' },
    { sound: 'eng', vietGuide: 'Đọc như "âng"', example: 'péng' },
    { sound: 'ong', vietGuide: 'Đọc như "ung/oong"', example: 'zhōng' }
  ],
  tones: [
    {
      tone: 1,
      name: 'Thanh 1 (Âm Bình)',
      mark: 'ā',
      pitch: '55 - Cao Bằng',
      description: 'Âm vực giữ nguyên ở mức cao độ 5, đều đặn, không lên không xuống, ngân vang nhẹ.',
      example: 'mā (妈 - Mẹ)',
      tip: 'Tưởng tượng như đang ngân một nốt nhạc cao và thẳng giọng.'
    },
    {
      tone: 2,
      name: 'Thanh 2 (Dương Bình)',
      mark: 'á',
      pitch: '35 - Đi Lên',
      description: 'Bắt đầu từ mức trung bình 3 rồi vút lên mức 5, tương tự dấu sắc trong tiếng Việt.',
      example: 'má (麻 - Cây gai)',
      tip: 'Đọc giống như khi bạn ngạc nhiên hỏi: "Hả?", "Gì cơ?".'
    },
    {
      tone: 3,
      name: 'Thanh 3 (Thượng Thanh)',
      mark: 'ǎ',
      pitch: '214 - Xuống Rồi Lên',
      description: 'Hạ giọng xuống thật sâu mức 1 rồi vòng ngược lên mức 4.',
      example: 'mǎ (马 - Ngựa)',
      tip: 'Gần giống dấu hỏi hoặc dấu ngã tiếng Việt nhưng cần nhấn sâu giọng xuống cổ họng trước.'
    },
    {
      tone: 4,
      name: 'Thanh 4 (Khứ Thanh)',
      mark: 'à',
      pitch: '51 - Rơi Dứt Khoát',
      description: 'Rơi thẳng từ mức cao nhất 5 tụt xuống mức 1 thật dứt khoát, mạnh mẽ.',
      example: 'mà (骂 - Mắng mỏ)',
      tip: 'Phát âm dứt khoát như khi bạn ra lệnh: "Dừng!", không kéo dài âm đuôi.'
    }
  ]
};

export const CHARACTERS_WRITING = [
  {
    char: '你',
    pinyin: 'nǐ',
    hanviet: 'Nhĩ',
    meaning: 'Bạn, anh, chị (ngôi thứ 2)',
    strokesCount: 7,
    radical: '亻 (Nhân đứng)',
    strokeOrder: ['Phẩy (丿)', 'Sổ (丨)', 'Phẩy (丿)', 'Ngang móc (乛)', 'Sổ móc (亅)', 'Phẩy (丿)', 'Chấm (丶)'],
    components: '亻 (Người) + 尔 (Bạn/Ngươi)',
    mnemonic: 'Chỉ người đối diện (亻) đang cùng ta trò chuyện.',
    tip: 'Nét sổ của bộ nhân đứng thẳng, nét sổ móc ở bên phải nằm cân đối giữa ô.'
  },
  {
    char: '好',
    pinyin: 'hǎo',
    hanviet: 'Hảo',
    meaning: 'Tốt, lành, đẹp',
    strokesCount: 6,
    radical: '女 (Nữ)',
    strokeOrder: ['Phẩy gập (𡿨)', 'Phẩy (丿)', 'Ngang (一)', 'Ngang gập móc (𠃌)', 'Sổ cong móc (乚)', 'Ngang (一)'],
    components: '女 (Phụ nữ) + 子 (Con trai)',
    mnemonic: 'Người phụ nữ sinh được con trai nếp tẻ vẹn toàn là điều tuyệt vời nhất (好).',
    tip: 'Nét ngang của bộ Nữ 女 biến thành nét hất khi ghép chữ, không vươn quá sang phải.'
  },
  {
    char: '学',
    pinyin: 'xué',
    hanviet: 'Học',
    meaning: 'Học tập, bắt chước',
    strokesCount: 8,
    radical: '子 (Tử)',
    strokeOrder: ['Chấm (丶)', 'Chấm (丶)', 'Phẩy (丿)', 'Chấm (丶)', 'Ngang móc (乛)', 'Ngang gập móc (𠃌)', 'Sổ cong móc (乚)', 'Ngang (一)'],
    components: 'Mái trường che chở cho đứa trẻ (子) tiếp thu tri thức.',
    mnemonic: 'Đứa trẻ ngồi dưới mái trường tiếp thu 3 giọt kiến thức từ thầy cô.',
    tip: '3 chấm ở phần đầu viết nhỏ gọn, mái nhà ôm trọn phần đầu của chữ 子.'
  },
  {
    char: '习',
    pinyin: 'xí',
    hanviet: 'Tập',
    meaning: 'Thực hành, rèn luyện',
    strokesCount: 3,
    radical: '乙 (Ất)',
    strokeOrder: ['Ngang gập móc (𠃌)', 'Chấm (丶)', 'Hất (㇀)'],
    components: 'Hình ảnh cánh chim non đang tập đập cánh bay.',
    mnemonic: 'Học thì phải tập luyện liên tục như cánh chim non tập bay.',
    tip: 'Nét ngang gập móc mở rộng góc, nét chấm bên trong đặt ở góc trên.'
  },
  {
    char: '爱',
    pinyin: 'ài',
    hanviet: 'Ái',
    meaning: 'Yêu thương',
    strokesCount: 10,
    radical: '爫 (Trảo)',
    strokeOrder: ['Phẩy (丿)', 'Chấm (丶)', 'Chấm (丶)', 'Phẩy (丿)', 'Ngang móc (乛)', 'Ngang (一)', 'Phẩy (丿)', 'Ngang phẩy (㇇)', 'Mác (乀)'],
    components: 'Bàn tay vuốt ve, trân trọng một tình cảm sâu sắc trong lòng bạn bè.',
    mnemonic: 'Dành tình cảm nâng niu và bảo bọc cho người mình thương mến.',
    tip: 'Nét mác cuối cùng viết thoải, vững chãi làm chân đỡ cho toàn bộ chữ.'
  },
  {
    char: '中',
    pinyin: 'zhōng',
    hanviet: 'Trung',
    meaning: 'Ở giữa, trung tâm',
    strokesCount: 4,
    radical: '丨 (Sổ)',
    strokeOrder: ['Sổ (丨)', 'Ngang gập (𠃍)', 'Ngang (一)', 'Sổ thẳng giữa (丨)'],
    components: 'Hình chữ nhật tượng trưng vùng đất, nét sổ thẳng đâm xuyên chính giữa.',
    mnemonic: 'Một nét sổ thẳng vạch đúng trọng tâm chính giữa.',
    tip: 'Nét sổ cuối cùng phải đâm xuyên chính tâm, thẳng tắp từ trên xuống dưới.'
  }
];

export const CONVERSATIONS_DATA = [
  {
    id: 'conv-1',
    title: 'Làm quen & Kết bạn',
    scenario: 'Bạn gặp một người bạn Trung Quốc tại một buổi giao lưu văn hóa sinh viên.',
    aiName: 'Tiểu Hàm (小涵)',
    aiRole: 'Sinh viên Đại học Bắc Kinh',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23E85D3F"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">涵</text></svg>',
    dialogue: [
      {
        speaker: 'ai',
        hanzi: '你好！我叫小涵，很高兴认识你。你叫什么名字？',
        pinyin: 'Nǐ hǎo! Wǒ jiào Xiǎohán, hěn gāoxìng rènshi nǐ. Nǐ jiào shénme míngzi?',
        meaning: 'Xin chào! Mình tên là Tiểu Hàm, rất vui được làm quen với bạn. Bạn tên là gì thế?'
      },
      {
        speaker: 'user',
        hanzi: '你好，小涵！我叫明，我是越南人。',
        pinyin: 'Nǐ hǎo, Xiǎohán! Wǒ jiào Míng, wǒ shì Yuènán rén.',
        meaning: 'Chào Tiểu Hàm! Mình tên là Minh, mình là người Việt Nam.'
      },
      {
        speaker: 'ai',
        hanzi: '哇，你是越南人啊！你的汉语说得真好。你学汉语多长时间了？',
        pinyin: 'Wa, nǐ shì Yuènán rén a! Nǐ de Hànyǔ shuō de zhēn hǎo. Nǐ xué Hànyǔ duō cháng shíjiān le?',
        meaning: 'Oa, bạn là người Việt Nam à! Tiếng Trung của bạn nói hay thật đấy. Bạn đã học tiếng Trung được bao lâu rồi?'
      },
      {
        speaker: 'user',
        hanzi: '谢谢你的夸奖！我刚学了三个月，还在努力学习呢。',
        pinyin: 'Xièxie nǐ de kuājiǎng! Wǒ gāng xué le sān gè yuè, hái zài nǔlì xuéxí ne.',
        meaning: 'Cảm ơn lời khen của bạn! Mình mới học được 3 tháng, vẫn đang nỗ lực học đây.'
      },
      {
        speaker: 'ai',
        hanzi: '太棒了！我们可以加个微信吗？以后一起练习中文！',
        pinyin: 'Tài bàng le! Wǒmen kěyǐ jiā gè Wēixìn ma? Yǐhòu yìqǐ liànxí Zhōngwén!',
        meaning: 'Tuyệt vời quá! Chúng mình có thể kết bạn WeChat được không? Sau này cùng nhau luyện tiếng Trung nhé!'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '好啊，我的微信号是...',
        pinyin: 'Hǎo a, wǒ de Wēixìn hào shì...',
        meaning: 'Được chứ, số WeChat của mình là...'
      },
      {
        hanzi: '没问题，很高兴和你成为朋友！',
        pinyin: 'Méi wèntí, hěn gāoxìng hé nǐ chéngwéi péngyou!',
        meaning: 'Không vấn đề gì, rất vui được làm bạn với bạn!'
      }
    ]
  },
  {
    id: 'conv-2',
    title: 'Tại nhà hàng (点餐)',
    scenario: 'Bạn bước vào một nhà hàng món ăn Tứ Xuyên và chuẩn bị gọi món.',
    aiName: 'Phục vụ Trương (张服务员)',
    aiRole: 'Nhân viên nhà hàng',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23F4B942"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23243447" dominant-baseline="middle" text-anchor="middle">张</text></svg>',
    dialogue: [
      {
        speaker: 'ai',
        hanzi: '欢迎光临！请问您几位？这边请坐。',
        pinyin: 'Huānyíng guānglín! Qǐngwèn nín jǐ wèi? Zhè biān qǐng zuò.',
        meaning: 'Kính chào quý khách! Xin hỏi quý khách đi mấy người ạ? Mời ngồi phía bên này.'
      },
      {
        speaker: 'user',
        hanzi: '两位。请给我们看一眼菜单。',
        pinyin: 'Liǎng wèi. Qǐng gěi wǒmen kàn yì yǎn càidān.',
        meaning: 'Hai người. Làm ơn cho chúng tôi xem thực đơn một lát.'
      },
      {
        speaker: 'ai',
        hanzi: '这是我们的菜单。今天我们的麻婆豆腐和水煮牛肉非常受欢迎。',
        pinyin: 'Zhè shì wǒmen de càidān. Jīntiān wǒmen de mápó dòufu hé shuǐzhǔ niúròu fēicháng shòu huānyíng.',
        meaning: 'Đây là thực đơn của quán. Hôm nay món đậu phụ Ma Bà và thịt bò cay Tứ Xuyên rất được ưa chuộng đấy ạ.'
      },
      {
        speaker: 'user',
        hanzi: '好的，请给我们一份麻婆豆腐，少放点辣椒，再来两碗米饭。',
        pinyin: 'Hǎo de, qǐng gěi wǒmen yí fèn mápó dòufu, shǎo fàng diǎn làjiāo, zài lái liǎng wǎn mǐfàn.',
        meaning: 'Được rồi, cho chúng tôi một suất đậu phụ Ma Bà, ít ớt thôi nhé, và thêm hai bát cơm trắng.'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '服务员，请给我们两杯温水。',
        pinyin: 'Fúwùyuán, qǐng gěi wǒmen liǎng bēi wēn shuǐ.',
        meaning: 'Phục vụ ơi, cho chúng tôi hai cốc nước ấm.'
      },
      {
        hanzi: '好的，先这些，谢谢！',
        pinyin: 'Hǎo de, xiān zhèxiē, xièxie!',
        meaning: 'Được rồi, trước mắt cứ bấy nhiêu đã, cảm ơn bạn!'
      }
    ]
  },
  {
    id: 'conv-3',
    title: 'Hỏi đường đi tàu điện ngầm',
    scenario: 'Bạn đang ở Thượng Hải và cần tìm trạm tàu điện ngầm gần nhất.',
    aiName: 'Bác Vương (王大伯)',
    aiRole: 'Cư dân Thượng Hải nhiệt tình',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%2345B97C"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">王</text></svg>',
    dialogue: [
      {
        speaker: 'user',
        hanzi: '您好，打扰一下，请问最近的地铁站在哪里？',
        pinyin: 'Nǐn hǎo, dǎrǎo yíxià, qǐngwèn zuìjìn de dìtiězhan zài nǎlǐ?',
        meaning: 'Chào bác, xin làm phiền một chút, cho cháu hỏi ga tàu điện ngầm gần nhất ở đâu ạ?'
      },
      {
        speaker: 'ai',
        hanzi: '哦，地铁站啊！你往前直走，过两个红绿灯向右拐，就能看到2号线入口了。',
        pinyin: 'Ó, dìtiězhàn a! Nǐ wǎng qián zhí zǒu, guò liǎng gè hónglǜdēng xiàng yòu guǎi, jiù néng kàndào èr hào xiàn rùkǒu le.',
        meaning: 'Ồ, ga tàu điện ngầm à! Cháu cứ đi thẳng phía trước, qua 2 cột đèn xanh đỏ rồi rẽ phải là thấy lối vào tuyến số 2 ngay.'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '走过去大概需要几分钟？',
        pinyin: 'Zǒu guòqù dàgài xūyào jǐ fēnzhōng?',
        meaning: 'Đi bộ qua đó mất khoảng mấy phút ạ?'
      },
      {
        hanzi: '太感谢您了，祝您生活愉快！',
        pinyin: 'Tài gǎnxiè nín le, zhù nín shēnghuó yúkuài!',
        meaning: 'Cháu vô cùng cảm ơn bác, chúc bác một ngày vui vẻ ạ!'
      }
    ]
  },
  {
    id: 'conv-4',
    title: 'Mua sắm & Trả giá (砍价)',
    scenario: 'Bạn đang chọn mua một chiếc áo khoác tại chợ đầu mối thời trang Quảng Châu.',
    aiName: 'Chị Lý Chủ Shop (李老板)',
    aiRole: 'Chủ cửa hàng quần áo',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23EC4899"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">李</text></svg>',
    dialogue: [
      {
        speaker: 'ai',
        hanzi: '帅哥/美女，来看一下新款外套！质量非常好，你穿肯定好看。',
        pinyin: 'Shuàigē/Měinǚ, lái kàn yíxià xīnkuǎn wàitào! Zhìliàng fēicháng hǎo, nǐ chuān kěndìng hǎokàn.',
        meaning: 'Soái ca/mỹ nữ ơi, vào xem mẫu áo khoác mới này! Chất lượng tốt lắm, bạn mặc đảm bảo đẹp.'
      },
      {
        speaker: 'user',
        hanzi: '老板，这件黑色外套多少钱一件？',
        pinyin: 'Lǎobǎn, zhè jiàn hēisè wàitào duōshao qián yí jiàn?',
        meaning: 'Chị chủ ơi, chiếc áo khoác đen này giá bao nhiêu tiền một chiếc thế?'
      },
      {
        speaker: 'ai',
        hanzi: '这件原价两百块，今天看你合眼缘，给你优惠一百六十块。',
        pinyin: 'Zhè jiàn yuánjià liǎng bǎi kuài, jīntiān kàn nǐ hé yǎnyuán, gěi nǐ yōuhuì yì bǎi liùshí kuài.',
        meaning: 'Chiếc này giá gốc 200 tệ, hôm nay thấy bạn có duyên, giảm giá ưu đãi cho bạn 160 tệ.'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '一百块怎么样？如果可以我就买两件。',
        pinyin: 'Yì bǎi kuài zěnmeyàng? Rúguǒ kěyǐ wǒ jiù mǎi liǎng jiàn.',
        meaning: '100 tệ được không chị? Nếu được em mua luôn 2 chiếc.'
      },
      {
        hanzi: '能不能便宜一点？我真心想买。',
        pinyin: 'Néng bu néng piányi yìdiǎn? Wǒ zhēnxīn xiǎng mǎi.',
        meaning: 'Có thể bớt thêm một chút được không? Em thật lòng muốn mua.'
      }
    ]
  },
  {
    id: 'conv-free',
    title: 'Trò chuyện tự do cùng Tiểu Hàm (自由对话)',
    scenario: 'Không gian mở để bạn thoải mái trò chuyện bất kỳ chủ đề nào bằng tiếng Trung.',
    aiName: 'Tiểu Hàm (小涵 AI)',
    aiRole: 'Gia sư AI đồng hành thông minh',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%236366F1"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">AI</text></svg>',
    dialogue: [
      {
        speaker: 'ai',
        hanzi: '你好！我是你的中文AI伙伴小涵。今天过得怎么样？你想聊些什么话题呢？',
        pinyin: 'Nǐ hǎo! Wǒ shì nǐ de Zhōngwén AI huǒbàn Xiǎohán. Jīntiān guò de zěnmeyàng? Nǐ xiǎng liáo xiē shénme huàtí ne?',
        meaning: 'Chào bạn! Mình là Tiểu Hàm - người bạn AI tiếng Trung của bạn. Hôm nay bạn thế nào? Bạn muốn trò chuyện về chủ đề gì nào?'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '今天天气很好，我刚下班。',
        pinyin: 'Jīntiān tiānqì hěn hǎo, wǒ gāng xiàbān.',
        meaning: 'Hôm nay thời tiết rất đẹp, mình vừa tan ca làm.'
      },
      {
        hanzi: '我想跟你练习一下中文自我介绍。',
        pinyin: 'Wǒ xiǎng gēn nǐ liànxí yíxià Zhōngwén zìwǒ jièshào.',
        meaning: 'Mình muốn cùng bạn luyện tập bài tự giới thiệu bản thân bằng tiếng Trung.'
      },
      {
        hanzi: '中国有什么好玩的旅游景点吗？',
        pinyin: 'Zhōngguó yǒu shénme hǎowán de lǚyóu jǐngdiǎn ma?',
        meaning: 'Trung Quốc có địa điểm du lịch nào thú vị để đi chơi không?'
      }
    ]
  }
];

export const COMMUNITY_POSTS = [
  {
    id: 'system-welcome',
    author: 'Ban Quản Trị HanziGo',
    avatar: '/hanzigo-logo.svg',
    initial: 'HZ',
    level: 'Quản trị viên',
    time: 'Ghim đầu trang',
    tag: '#KinhNghiemHoc',
    content: 'Chào mừng các bạn học viên đến với Không gian Cộng đồng HanziGo! 🌟 Đây là nơi giao lưu học hỏi, giải đáp thắc mắc ngữ pháp, tìm bạn cùng luyện phản xạ khẩu ngữ và tham gia các thử thách học tập. Hãy đăng câu hỏi hoặc cảm nhận học tập đầu tiên của bạn ở khung phía trên nhé! 🇨🇳🇻🇳✨',
    likes: 1,
    liked: false,
    saved: false,
    isPinned: true,
    comments: [
      {
        id: 'c1',
        author: 'Trợ lý học tập HanziGo',
        content: 'Mẹo nhỏ: Bạn có thể chọn thẻ chủ đề #HoiDapNguPhap hoặc #TimBanLuyenNoi để mọi người dễ dàng tìm thấy bài viết của bạn hơn!',
        time: 'Vừa xong'
      }
    ]
  }
];

export const USER_ACHIEVEMENTS = [
  {
    id: 'first-step',
    name: 'Khởi đầu Hanzi',
    desc: 'Hoàn thành bài học tương tác đầu tiên',
    icon: '🌱',
    unlocked: false,
    date: null
  },
  {
    id: 'streak-7',
    name: 'Chuỗi 7 Ngày Rực Lửa',
    desc: 'Học liên tiếp 7 ngày không gián đoạn',
    icon: '🔥',
    unlocked: false,
    date: null
  },
  {
    id: 'pinyin-master',
    name: 'Bậc thầy Pinyin',
    desc: 'Phát âm chuẩn 100% bảng thanh điệu',
    icon: '🗣️',
    unlocked: false,
    date: null
  },
  {
    id: 'vocab-100',
    name: 'Kỵ sĩ Từ Vựng',
    desc: 'Ghi nhớ vững chắc 100 từ vựng HSK 1',
    icon: '📚',
    unlocked: false,
    date: null
  },
  {
    id: 'calligraphy',
    name: 'Nét Chữ Phượng Múa',
    desc: 'Luyện viết 20 chữ Hán đạt điểm > 90',
    icon: '🖌️',
    unlocked: false,
    date: null
  },
  {
    id: 'conversation-star',
    name: 'Ngôi sao Hội thoại',
    desc: 'Hoàn thành 5 màn đối thoại cùng AI Tiểu Hàm',
    icon: '💬',
    unlocked: false,
    date: null
  },
  {
    id: 'hsk1-pass',
    name: 'Chinh phục HSK 1',
    desc: 'Vượt qua bài thi thử HSK 1 với điểm số > 180',
    icon: '🏆',
    unlocked: false,
    date: null
  },
  {
    id: 'night-owl',
    name: 'Cú Đêm Chăm Học',
    desc: 'Học tập sau 22h đêm trong 3 ngày liên tiếp',
    icon: '🌙',
    unlocked: false,
    date: null
  }
];
