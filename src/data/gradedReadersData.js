/**
 * =========================================================================
 * HANZIGO — GRADED CHINESE READERS (KHO BÀI ĐỌC PHÂN CẤP HSK 1–6)
 * =========================================================================
 * 12 bài đọc thực tế phân theo độ khó HSK 1 đến HSK 6 (2 bài/cấp độ)
 * Kèm bản dịch tiếng Việt tự nhiên, từ vựng trọng tâm và câu hỏi đọc hiểu sư phạm.
 * =========================================================================
 */

export const GRADED_READERS_DATA = [
  // --- HSK 1 ---
  {
    id: 'gr-101',
    level: 'HSK 1',
    titleZh: '小明的一天',
    titleVi: 'Một ngày của Tiểu Minh',
    topic: 'Đời sống thường nhật',
    readTimeMinutes: 2,
    wordCount: 120,
    contentZh: `你好！我叫小明，我是中国人。
我早上七点起床，吃早饭。我喜欢喝茶，吃米饭。
上午八点半，我去学校学习汉语。学校很大，老师和同学都很好。
下午四点，我和朋友一起去商店买水。晚上我很开心，看中国书。
这是我快乐的一天。`,
    translationVi: `Xin chào! Tôi tên là Tiểu Minh, tôi là người Trung Quốc.
Tôi thức dậy lúc 7 giờ sáng và ăn sáng. Tôi thích uống trà và ăn cơm.
8 giờ rưỡi sáng, tôi đến trường học tiếng Trung. Trường học rất lớn, thầy cô và bạn bè đều rất tốt.
4 giờ chiều, tôi cùng bạn bè đến cửa hàng mua nước. Buổi tối tôi rất vui, đọc sách tiếng Trung.
Đây là một ngày vui vẻ của tôi.`,
    vocabularyHighlights: [
      { hanzi: '起床', pinyin: 'qǐchuáng', hanviet: 'Khởi sàng', meaning: 'Thức dậy' },
      { hanzi: '喜欢', pinyin: 'xǐhuan', hanviet: 'Hỷ hoan', meaning: 'Thích' },
      { hanzi: '学校', pinyin: 'xuéxiào', hanviet: 'Học hiệu', meaning: 'Trường học' },
      { hanzi: '朋友', pinyin: 'péngyou', hanviet: 'Bằng hữu', meaning: 'Bạn bè' }
    ],
    questions: [
      {
        question: '小明早上几点起床？ (Tiểu Minh thức dậy lúc mấy giờ sáng?)',
        options: ['六点 (6 giờ)', '七点 (7 giờ)', '八点半 (8 giờ rưỡi)', '九点 (9 giờ)'],
        answerIndex: 1,
        explanation: 'Trong bài có câu: "我早上七点起床" (Tôi 7 giờ sáng thức dậy).'
      },
      {
        question: '下午四点，小明和朋友去做什么？ (4 giờ chiều, Tiểu Minh cùng bạn làm gì?)',
        options: ['去商店买水 (Đến cửa hàng mua nước)', '在学校看书 (Đọc sách ở trường)', '回家吃早饭 (Về nhà ăn sáng)', '去喝咖啡 (Đi uống cà phê)'],
        answerIndex: 0,
        explanation: 'Trong bài có câu: "下午四点，我和朋友一起去商店买水".'
      }
    ]
  },
  {
    id: 'gr-102',
    level: 'HSK 1',
    titleZh: '我的温暖家庭',
    titleVi: 'Gia đình ấm áp của tôi',
    topic: 'Gia đình & Tình cảm',
    readTimeMinutes: 2,
    wordCount: 135,
    contentZh: `我家有四口人：爸爸、妈妈、妹妹和我。
爸爸是医生，他工作很忙。妈妈是老师，她在学校教书。
妹妹今年八岁，她喜欢喝牛奶，看小猫。
我们家有一只白色的小猫，它叫小白。小白很漂亮，也很可爱。
星期天，我们都在家，一起做饭，吃中国菜。我爱我的家。`,
    translationVi: `Nhà tôi có bốn người: bố, mẹ, em gái và tôi.
Bố là bác sĩ, công việc của ông rất bận. Mẹ là giáo viên, bà dạy học ở trường.
Em gái năm nay tám tuổi, em ấy thích uống sữa bò và ngắm mèo con.
Nhà chúng tôi có một chú mèo con màu trắng, nó tên là Tiểu Bạch. Tiểu Bạch rất xinh xắn và cũng rất đáng yêu.
Chủ nhật, cả nhà chúng tôi đều ở nhà, cùng nhau nấu nướng và ăn món Trung Quốc. Tôi yêu gia đình tôi.`,
    vocabularyHighlights: [
      { hanzi: '医生', pinyin: 'yīshēng', hanviet: 'Y sinh', meaning: 'Bác sĩ' },
      { hanzi: '牛奶', pinyin: 'niúnǎi', hanviet: 'Ngưu nãi', meaning: 'Sữa bò' },
      { hanzi: '可爱', pinyin: 'kě’ài', hanviet: 'Khả ái', meaning: 'Đáng yêu' },
      { hanzi: '星期天', pinyin: 'xīngqītiān', hanviet: 'Tinh kỳ thiên', meaning: 'Chủ nhật' }
    ],
    questions: [
      {
        question: '小明的妈妈做什么工作？ (Mẹ của Tiểu Minh làm nghề gì?)',
        options: ['医生 (Bác sĩ)', '老师 (Giáo viên)', '商人 (Thương nhân)', '司机 (Tài xế)'],
        answerIndex: 1,
        explanation: 'Trong bài có câu: "妈妈是老师，她在学校教书" (Mẹ là giáo viên, bà dạy học ở trường).'
      },
      {
        question: '小白是一只什么动物？ (Tiểu Bạch là con vật gì?)',
        options: ['小狗 (Chó con)', '小鸟 (Chim nhỏ)', '小猫 (Mèo con)', '小鱼 (Cá nhỏ)'],
        answerIndex: 2,
        explanation: 'Bài viết nêu rõ: "我们家有一只白色的小猫，它叫小白".'
      }
    ]
  },

  // --- HSK 2 ---
  {
    id: 'gr-201',
    level: 'HSK 2',
    titleZh: '周末去水果市场',
    titleVi: 'Cuối tuần đi chợ hoa quả',
    topic: 'Mua sắm & Ẩm thực',
    readTimeMinutes: 3,
    wordCount: 180,
    contentZh: `今天天气非常晴朗，阳光明媚。我和姐姐一起去离家不远的水果市场买东西。
市场里人很多，非常热闹。这里的苹果、香蕉和西瓜都很新鲜。
姐姐问售货员：“请问，西瓜一斤多少钱？”
售货员笑着回答：“三块五一斤，如果买整个西瓜，算你三块钱一斤。”
这里的西瓜又大又甜，姐姐买了一个大西瓜，一共花了三十块钱。
回家的路上，我们还买了两杯珍珠奶茶，心情特别好。`,
    translationVi: `Hôm nay thời tiết rất nắng ráo, ánh mặt trời rực rỡ. Tôi và chị gái cùng nhau đến chợ hoa quả cách nhà không xa để mua đồ.
Trong chợ rất đông người, vô cùng náo nhiệt. Táo, chuối và dưa hấu ở đây đều rất tươi ngon.
Chị gái hỏi người bán hàng: "Xin hỏi, dưa hấu bao nhiêu tiền một cân?"
Người bán hàng mỉm cười trả lời: "Ba đồng rưỡi một cân, nếu mua cả quả thì tính cô ba đồng một cân."
Dưa hấu ở đây vừa to vừa ngọt, chị gái mua một quả dưa hấu to, hết tổng cộng ba mươi đồng.
Trên đường về nhà, chúng tôi còn mua hai ly trà sữa trân châu, tâm trạng vô cùng vui vẻ.`,
    vocabularyHighlights: [
      { hanzi: '晴朗', pinyin: 'qínglǎng', hanviet: 'Tình lãng', meaning: 'Nắng ráo, trong xanh' },
      { hanzi: '新鲜', pinyin: 'xīnxiān', hanviet: 'Tân tiên', meaning: 'Tươi ngon' },
      { hanzi: '售货员', pinyin: 'shòuhuòyuán', hanviet: 'Thụ hóa viên', meaning: 'Nhân viên bán hàng' },
      { hanzi: '珍珠奶茶', pinyin: 'zhēnzhū nǎichá', hanviet: 'Trân châu nãi trà', meaning: 'Trà sữa trân châu' }
    ],
    questions: [
      {
        question: '如果买整个西瓜，一斤多少钱？ (Nếu mua cả quả dưa hấu thì bao nhiêu tiền một cân?)',
        options: ['三块五 (3 đồng 5)', '三块钱 (3 đồng)', '两块 (2 đồng)', '三十块 (30 đồng)'],
        answerIndex: 1,
        explanation: 'Người bán hàng trả lời: "如果买整个西瓜，算你三块钱一斤".'
      },
      {
        question: '买大西瓜一共花了多少钱？ (Mua quả dưa hấu to hết tổng cộng bao nhiêu tiền?)',
        options: ['十五块 (15 đồng)', '二十块 (20 đồng)', '三十块 (30 đồng)', '三十五块 (35 đồng)'],
        answerIndex: 2,
        explanation: 'Trong bài ghi nhận: "一共花了三十块钱" (hết tổng cộng 30 đồng).'
      }
    ]
  },
  {
    id: 'gr-202',
    level: 'HSK 2',
    titleZh: '冬天的北京初雪',
    titleVi: 'Tuyết đầu mùa mùa đông ở Bắc Kinh',
    topic: 'Thời tiết & Cảm xúc',
    readTimeMinutes: 3,
    wordCount: 195,
    contentZh: `昨天北京迎来了今年冬天的第一场雪。
早晨打开窗户，外面全变白了。树上、路上和屋顶上都盖满了白雪，美丽极了。
虽然外面天气很冷，只有零下五度，但是街道上的行人依然很多。
很多大人和孩子们在公园里堆雪人、打雪仗，到处都是欢笑声。
我和朋友走进一家老茶馆，点了一壶热热的龙井茶，一边喝茶一边看着窗外的雪景。
这种宁静温暖的感觉，让我深深喜欢上了北京的冬天。`,
    translationVi: `Hôm qua Bắc Kinh đón cơn tuyết đầu mùa của mùa đông năm nay.
Sáng sớm mở cửa sổ ra, bên ngoài vạn vật đều biến thành một màu trắng xóa. Trên cây, trên đường và trên nóc nhà đều phủ đầy tuyết trắng, đẹp tuyệt vời.
Mặc dù thời tiết bên ngoài rất lạnh, chỉ âm 5 độ, nhưng người đi bộ trên phố vẫn rất đông.
Rất nhiều người lớn và trẻ em đang đắp người tuyết và ném bóng tuyết trong công viên, khắp nơi đều rộn rã tiếng cười.
Tôi và bạn bước vào một quán trà cổ, gọi một ấm trà Long Tỉnh nóng hổi, vừa uống trà vừa ngắm cảnh tuyết rơi ngoài cửa sổ.
Cảm giác thanh bình và ấm áp này khiến tôi say đắm mùa đông Bắc Kinh.`,
    vocabularyHighlights: [
      { hanzi: '初雪', pinyin: 'chūxuě', hanviet: 'Sơ tuyết', meaning: 'Tuyết đầu mùa' },
      { hanzi: '窗户', pinyin: 'chuānghu', hanviet: 'Song hộ', meaning: 'Cửa sổ' },
      { hanzi: '零下', pinyin: 'língxià', hanviet: 'Linh hạ', meaning: 'Dưới 0 độ (độ âm)' },
      { hanzi: '宁静', pinyin: 'níngjìng', hanviet: 'Ninh tĩnh', meaning: 'Thanh bình, yên ả' }
    ],
    questions: [
      {
        question: '昨天的气温大概是多少度？ (Nhiệt độ ngày hôm qua khoảng bao nhiêu độ?)',
        options: ['零上五度 (Dương 5 độ)', '零下五度 (Âm 5 độ)', '零度 (0 độ)', '零下十度 (Âm 10 độ)'],
        answerIndex: 1,
        explanation: 'Trong bài có câu: "虽然外面天气很冷，只有零下五度" (chỉ âm 5 độ).'
      },
      {
        question: '作者在茶馆里做了什么？ (Tác giả đã làm gì trong quán trà?)',
        options: ['吃火锅 (Ăn lẩu)', '喝龙井茶并看雪景 (Uống trà Long Tỉnh và ngắm cảnh tuyết)', '写汉语作业 (Làm bài tập tiếng Trung)', '堆雪人 (Đắp người tuyết)'],
        answerIndex: 1,
        explanation: 'Tác giả chia sẻ: "点了一壶热热的龙井茶，一边喝茶一边看着窗外的雪景".'
      }
    ]
  },

  // --- HSK 3 ---
  {
    id: 'gr-301',
    level: 'HSK 3',
    titleZh: '搭乘高铁游西湖',
    titleVi: 'Đi tàu cao tốc du ngoạn Tây Hồ',
    topic: 'Du lịch & Giao thông',
    readTimeMinutes: 4,
    wordCount: 240,
    contentZh: `上个周末，我体验了一次中国的高铁，从上海到杭州只用了一个小时左右，速度快而且非常平稳。
到达杭州后，我迫不及待地前往著名的西湖风景区。
俗话说：“上有天堂，下有苏杭。”西湖的景色果然名不虚传。湖水清澈，微风徐徐吹来，岸边的垂柳随风摆动。
我租了一辆共享单车，沿着苏堤慢慢骑行。途中遇到了很多热情的当地居民和来自世界各地的游客。
中午，我在湖边的一家老字号餐馆品尝了著名的西湖醋鱼和龙井虾仁，味道酸甜鲜嫩，令人回味无穷。
这次旅行不仅让我领略了大自然的美丽，也让我亲身感受到了现代交通带来的便利。`,
    translationVi: `Cuối tuần trước, tôi đã trải nghiệm chuyến tàu cao tốc Trung Quốc, từ Thượng Hải đến Hàng Châu chỉ mất khoảng một tiếng đồng hồ, tốc độ nhanh mà lại chạy rất êm ái.
Sau khi đến Hàng Châu, tôi nóng lòng muốn đến ngay khu danh thắng Tây Hồ nổi tiếng.
Tục ngữ có câu: "Trên có thiên đàng, dưới có Tô Hàng." Phong cảnh Tây Hồ quả thực danh bất hư truyền. Nước hồ trong vắt, gió nhẹ thoảng qua, những hàng liễu rủ ven bờ đung đưa trong gió.
Tôi thuê một chiếc xe đạp công cộng, thong thả đạp xe dọc theo đê Tô Đê. Trên đường đi, tôi gặp rất nhiều cư dân địa phương hiếu khách và du khách đến từ khắp nơi trên thế giới.
Buổi trưa, tôi thưởng thức món cá giấm Tây Hồ và tôm nõn xào trà Long Tỉnh tại một nhà hàng lâu đời ven hồ, hương vị chua ngọt tươi mềm khiến người ta dư vị mãi không thôi.
Chuyến đi này không chỉ giúp tôi chiêm ngưỡng vẻ đẹp thiên nhiên mà còn giúp tôi tận mắt cảm nhận sự tiện lợi do giao thông hiện đại đem lại.`,
    vocabularyHighlights: [
      { hanzi: '高铁', pinyin: 'gāotiě', hanviet: 'Cao thiết', meaning: 'Tàu cao tốc' },
      { hanzi: '名不虚传', pinyin: 'míng bù xū chuán', hanviet: 'Danh bất hư truyền', meaning: 'Quả đúng như lời đồn' },
      { hanzi: '共享单车', pinyin: 'gòngxiǎng dānchē', hanviet: 'Cộng hưởng đơn xa', meaning: 'Xe đạp công cộng chia sẻ' },
      { hanzi: '回味无穷', pinyin: 'huíwèi wúqióng', hanviet: 'Hồi vị vô cùng', meaning: 'Dư vị khó quên, nhớ mãi' }
    ],
    questions: [
      {
        question: '从上海坐高铁到杭州大约需要多长时间？ (Đi tàu cao tốc từ Thượng Hải đến Hàng Châu mất khoảng bao lâu?)',
        options: ['半小时左右 (Khoảng nửa tiếng)', '一个小时左右 (Khoảng 1 tiếng)', '两个小时 (2 tiếng)', '三个小时以上 (Trên 3 tiếng)'],
        answerIndex: 1,
        explanation: 'Đoạn văn nêu rõ: "从上海到杭州只用了一个小时左右".'
      },
      {
        question: '作者是如何游览西湖苏堤的？ (Tác giả tham quan Tô Đê ở Tây Hồ bằng phương tiện gì?)',
        options: ['乘游船 (Đi thuyền du lịch)', '坐出租车 (Đi taxi)', '骑共享单车 (Đạp xe đạp công cộng)', '坐地铁 (Đi tàu điện ngầm)'],
        answerIndex: 2,
        explanation: 'Trong bài có câu: "我租了一辆共享单车，沿着苏堤慢慢骑行".'
      }
    ]
  },
  {
    id: 'gr-302',
    level: 'HSK 3',
    titleZh: '我的第一次求职面试',
    titleVi: 'Buổi phỏng vấn xin việc đầu tiên của tôi',
    topic: 'Công sở & Sự nghiệp',
    readTimeMinutes: 4,
    wordCount: 250,
    contentZh: `大学毕业后，我迎来了人生的第一次正式求职面试。
面试前几天，我非常紧张。我认真准备了自己的中文简历，并练习了常见的面试问答。
当天早上，我提前半个小时到达了那家跨国贸易公司。我穿上了整洁的职业正装，努力让自己保持冷静。
面试官是一位十分和蔼的经理。他首先让我做自我介绍，然后询问了我对国际贸易和团队合作的看法。
虽然在回答专业问题时我的心跳得很快，但我始终保持微笑，声音清楚而自信。
面试结束时，经理对我诚恳的态度表示赞赏。
这次经历让我明白，充分的准备和自信的心态是战胜恐惧、取得成功的关键。`,
    translationVi: `Sau khi tốt nghiệp đại học, tôi bước vào buổi phỏng vấn xin việc chính thức đầu tiên trong cuộc đời.
Mấy ngày trước phỏng vấn, tôi rất căng thẳng. Tôi cẩn thận chuẩn bị sơ yếu lý lịch tiếng Trung của mình và luyện tập các câu hỏi đáp phỏng vấn thường gặp.
Sáng hôm đó, tôi đến công ty thương mại đa quốc gia sớm nửa tiếng. Tôi mặc bộ âu phục công sở chỉnh tề, nỗ lực giữ cho bản thân bình tĩnh.
Người phỏng vấn là một vị quản lý rất hòa nhã. Trước tiên ông ấy bảo tôi tự giới thiệu bản thân, sau đó hỏi han về quan điểm của tôi đối với thương mại quốc tế và làm việc nhóm.
Mặc dù khi trả lời các câu hỏi chuyên môn tim tôi đập thình thịch, nhưng tôi luôn giữ nụ cười, giọng nói rõ ràng và tự tin.
Khi buổi phỏng vấn kết thúc, vị quản lý bày tỏ sự khen ngợi đối với thái độ chân thành của tôi.
Trải nghiệm này giúp tôi hiểu rằng, sự chuẩn bị chu đáo và tâm thái tự tin chính là chìa khóa để chiến thắng nỗi sợ và đạt được thành công.`,
    vocabularyHighlights: [
      { hanzi: '面试', pinyin: 'miànshì', hanviet: 'Diện thí', meaning: 'Phỏng vấn' },
      { hanzi: '跨国公司', pinyin: 'kuàguó gōngsī', hanviet: 'Khóa quốc công ty', meaning: 'Công ty đa quốc gia' },
      { hanzi: '团队合作', pinyin: 'tuánduì hézuò', hanviet: 'Đoàn đội hợp tác', meaning: 'Làm việc nhóm' },
      { hanzi: '赞赏', pinyin: 'zànshǎng', hanviet: 'Tán thưởng', meaning: 'Khen ngợi, tán thưởng' }
    ],
    questions: [
      {
        question: '作者提前多长时间到达面试公司？ (Tác giả đến công ty phỏng vấn trước bao lâu?)',
        options: ['十分钟 (10 phút)', '半个小时 (Nửa tiếng)', '一个小时 (1 tiếng)', '两个小时 (2 tiếng)'],
        answerIndex: 1,
        explanation: 'Trong bài ghi: "我提前半个小时到达了那家跨国贸易公司".'
      },
      {
        question: '作者认为成功的关键是什么？ (Tác giả cho rằng chìa khóa thành công là gì?)',
        options: ['运气好 (May mắn)', '充分的准备和自信的心态 (Chuẩn bị chu đáo và tự tin)', '有熟人介绍 (Có người quen giới thiệu)', '穿名牌衣服 (Mặc đồ hiệu)'],
        answerIndex: 1,
        explanation: 'Kết luận bài viết: "充分的准备和自信的心态是战胜恐惧、取得成功的关键".'
      }
    ]
  },

  // --- HSK 4 ---
  {
    id: 'gr-401',
    level: 'HSK 4',
    titleZh: '人工智能与无现金生活',
    titleVi: 'Trí tuệ nhân tạo và đời sống không tiền mặt',
    topic: 'Khoa học & Đời sống hiện đại',
    readTimeMinutes: 5,
    wordCount: 290,
    contentZh: `近年来，以移动支付、人脸识别和大数据为代表的人工智能技术，正在深刻地改变着中国人的日常生活。
现在出门，无论是去超市采购、乘坐地铁，还是在路边摊买早餐，几乎每个人都只带一部智能手机。
扫描二维码即可在几秒钟内完成支付，“无现金社会”已经成为现实。
这种技术的普及不仅极大地提高了交易效率，降低了商家的管理成本，还促进了电子商务的蓬勃发展。
然而，技术的快速迭代也带来了一些不可忽视的挑战。例如，部分不熟悉智能设备的老年人在日常出行中可能会感到不便，个人隐私与数据安全问题也日益受到公众的广泛关注。
如何在享受科技红利的同时，兼顾社会的公平与人文关怀，是值得全社会共同深思的课题。`,
    translationVi: `Những năm gần đây, công nghệ trí tuệ nhân tạo đại diện bởi thanh toán di động, nhận diện khuôn mặt và dữ liệu lớn đang thay đổi sâu sắc đời sống hàng ngày của người dân Trung Quốc.
Hiện nay khi ra khỏi nhà, dù là đi siêu thị mua sắm, đi tàu điện ngầm hay mua bữa sáng ở các quán ven đường, hầu như mọi người chỉ mang theo một chiếc điện thoại thông minh.
Quét mã QR là có thể hoàn tất thanh toán trong vài giây, "xã hội không tiền mặt" đã trở thành hiện thực.
Sự phổ biến của công nghệ này không chỉ nâng cao đáng kể hiệu quả giao dịch, giảm chi phí quản lý của người bán, mà còn thúc đẩy thương mại điện tử phát triển bùng nổ.
Tuy nhiên, sự đổi mới nhanh chóng của công nghệ cũng mang lại một số thách thức không thể xem nhẹ. Ví dụ, một bộ phận người cao tuổi không quen sử dụng thiết bị thông minh có thể cảm thấy bất tiện trong sinh hoạt, vấn đề an toàn dữ liệu và quyền riêng tư cá nhân cũng ngày càng được công chúng quan tâm rộng rãi.
Làm thế nào để vừa tận hưởng thành quả công nghệ vừa đảm bảo công bằng xã hội và giá trị nhân văn là bài toán xứng đáng để toàn xã hội cùng suy ngẫm.`,
    vocabularyHighlights: [
      { hanzi: '移动支付', pinyin: 'yídòng zhīfù', hanviet: 'Di động chi phó', meaning: 'Thanh toán di động' },
      { hanzi: '二维码', pinyin: 'èrwéimǎ', hanviet: 'Nhị duy mã', meaning: 'Mã QR' },
      { hanzi: '迭代', pinyin: 'diédài', hanviet: 'Điệt đại', meaning: 'Đổi mới, nâng cấp dần' },
      { hanzi: '人文关怀', pinyin: 'rénwén guānhuái', hanviet: 'Nhân văn quan hoài', meaning: 'Quan tâm nhân văn' }
    ],
    questions: [
      {
        question: '“无现金生活”给社会带来的好处不包括哪一项？ (Lợi ích của đời sống không tiền mặt không bao gồm điều nào?)',
        options: ['提高交易效率 (Nâng cao hiệu quả giao dịch)', '降低管理成本 (Giảm chi phí quản lý)', '彻底消除个人隐私泄露 (Xóa bỏ hoàn toàn rò rỉ quyền riêng tư)', '促进电商发展 (Thúc đẩy thương mại điện tử)'],
        answerIndex: 2,
        explanation: 'Bài viết chỉ ra quyền riêng tư cá nhân là thách thức cần quan tâm, chứ không hề bị xóa bỏ hoàn toàn.'
      },
      {
        question: '根据文章，快速的科技发展对哪一人群可能造成不便？ (Theo bài viết, sự phát triển công nghệ có thể gây bất tiện cho nhóm người nào?)',
        options: ['在校大学生 (Sinh viên)', '熟悉手机的年轻人 (Người trẻ rành điện thoại)', '不熟悉智能设备的老年人 (Người cao tuổi không rành công nghệ)', '外国留学生 (Du học sinh nước ngoài)'],
        answerIndex: 2,
        explanation: 'Đoạn văn viết: "部分不熟悉智能设备的老年人在日常出行中可能会感到不便".'
      }
    ]
  },
  {
    id: 'gr-402',
    level: 'HSK 4',
    titleZh: '除夕团圆与年夜饭的温度',
    titleVi: 'Sum họp đêm Giao thừa và hơi ấm bữa cơm tất niên',
    topic: 'Văn hóa & Phong tục truyền thống',
    readTimeMinutes: 5,
    wordCount: 310,
    contentZh: `在中国传统文化中，春节是最具凝聚力和温情的节日，而除夕夜的“年夜饭”则是春节的核心象征。
无论在外打拼的人路途多么遥远，都会克服一切困难踏上春运的归途，只为了在除夕之夜与家人围坐在一起。
餐桌上的菜肴不仅丰富多样，而且每一道菜都饱含着吉祥的寓意。
例如，餐桌上必不可少的一道清蒸鱼，象征着“年年有余”；热气腾腾的饺子因其形状像古代的金元宝，寓意着“招财进宝”与富足。
全家人一边品尝美味佳肴，一边守在电视机前观看春晚，欢声笑语充满整个屋子。
年夜饭的真正意义，早已超越了食物本身的滋味。它是一份对家庭的守望，是漂泊游子心灵深处的精神避风港，更承载着中华民族对团圆与和谐的恒久期盼。`,
    translationVi: `Trong văn hóa truyền thống Trung Quốc, Tết Nguyên Đán là ngày lễ giàu tính gắn kết và ấm áp nhất, còn "bữa cơm tất niên" đêm Giao thừa chính là biểu tượng cốt lõi của ngày Tết.
Dù những người bôn ba làm ăn phương xa có ở cách trở nghìn trùng, họ đều vượt qua mọi gian nan để bước lên chuyến tàu xuân về quê, chỉ vì muốn được quây quần bên người thân trong đêm trừ tịch.
Các món ăn trên bàn tiệc không chỉ phong phú đa dạng mà từng món đều chan chứa ngụ ý tốt lành.
Chẳng hạn, món cá hấp thanh đạm không thể thiếu trên bàn tượng trưng cho "niên niên hữu dư" (năm nào cũng dư dả của cải); đĩa sủi cảo bốc khói nghi ngút vì hình dáng giống thỏi vàng kim nguyên bảo thời xưa nên mang ý nghĩa "chiêu tài tiến bảo" và no đủ.
Cả gia đình vừa thưởng thức của ngon vật lạ, vừa quây quần trước ti vi xem Gala đón xuân, tiếng cười nói rộn rã ngập tràn gian phòng.
Ý nghĩa thực sự của bữa cơm tất niên từ lâu đã vượt qua hương vị của bản thân thức ăn. Nó là sự gắn bó giữ gìn tổ ấm, là bến đỗ bình yên trong tâm khảm của những người con xa xứ, và chuyên chở khát vọng muôn đời của dân tộc Trung Hoa về đoàn viên và hòa hợp.`,
    vocabularyHighlights: [
      { hanzi: '除夕', pinyin: 'chúxī', hanviet: 'Trừ tịch', meaning: 'Đêm Giao thừa' },
      { hanzi: '春运', pinyin: 'chūnyùn', hanviet: 'Xuân vận', meaning: 'Đợt cao điểm đi lại dịp Tết' },
      { hanzi: '年年有余', pinyin: 'niánnián yǒuyú', hanviet: 'Niên niên hữu dư', meaning: 'Quanh năm dư dả sung túc' },
      { hanzi: '避风港', pinyin: 'bìfēnggǎng', hanviet: 'Tị phong cảng', meaning: 'Bến đỗ bình yên, nơi nương tựa' }
    ],
    questions: [
      {
        question: '年夜饭上的鱼象征着什么寓意？ (Món cá trong bữa cơm tất niên mang ý nghĩa biểu tượng gì?)',
        options: ['步步高升 (Từng bước thăng tiến)', '年年有余 (Năm nào cũng dư dả sung túc)', '心想事成 (Vạn sự như ý)', '寿比南山 (Thọ sánh trời nam)'],
        answerIndex: 1,
        explanation: 'Trong bài có viết: "必不可少的一道清蒸鱼，象征着‘年年有余’".'
      },
      {
        question: '饺子寓意“招财进宝”是因为什么？ (Sủi cảo mang ý nghĩa chiêu tài tiến bảo vì lý do gì?)',
        options: ['味道特别甜 (Hương vị rất ngọt)', '形状像古代的金元宝 (Hình dáng giống thỏi vàng kim nguyên bảo)', '用金子做的 (Làm bằng vàng thật)', '煮熟后颜色变黄 (Khi luộc chín chuyển sang màu vàng)'],
        answerIndex: 1,
        explanation: 'Đoạn văn giải thích: "热气腾腾的饺子因其形状像古代的金元宝，寓意着‘招财进宝’".'
      }
    ]
  },

  // --- HSK 5 ---
  {
    id: 'gr-501',
    level: 'HSK 5',
    titleZh: '茶道哲思与快节奏下的慢生活',
    titleVi: 'Triết lý trà đạo và nhịp sống chậm giữa thời đại vội vã',
    topic: 'Triết học nhân sinh & Văn hóa thưởng trà',
    readTimeMinutes: 6,
    wordCount: 360,
    contentZh: `在当今这个信息爆炸、节奏飞快的现代社会中，许多人被无休止的工作指标和数字焦虑所困扰，心灵常常处于疲惫不堪的状态。
面对这种普遍的心理困境，中国悠久的茶道文化为人们提供了一种返璞归真、调适心境的智慧良方。
泡茶讲究“水、火、器、叶”的契合，更注重心境的澄澈与专注于当下。
从温杯、投茶，到注水、出汤，每一步都需要从容不迫的耐心。水温过高，则伤其鲜嫩；水温过低，则难出其香韵。
这正如人生的处世之道：急功近利往往事与愿违，唯有懂得循序渐进、张弛有度，方能在风浪中保持从容。
茶之滋味，初尝微苦，继而回甘。
古人借茶明志，主张“静心、修德、体道”。在茶香袅袅中暂时放下琐碎烦恼，不仅是对身体的调剂，更是对精神世界的净化与重塑。
学会在喧嚣中慢下脚步，我们才能看清自己内心真正追求的方向。`,
    translationVi: `Trong xã hội hiện đại ngập tràn thông tin và hối hả hôm nay, vô số người bị bủa vây bởi các chỉ số công việc vô tận và nỗi lo âu kỹ thuật số, khiến tâm trí thường rơi vào tình trạng kiệt sức mệt mỏi.
Trước thực trạng tâm lý phổ biến này, văn hóa trà đạo lâu đời của Trung Hoa đem đến cho con người một phương thuốc trí tuệ để quay về với bản nguyên giản dị và điều hòa tâm thái.
Pha trà coi trọng sự giao hòa của "nước, lửa, ấm chén, búp trà", và càng chú trọng sự tĩnh tại, thuần khiết của tâm hồn cùng sự chú tâm vào phút giây hiện tại.
Từ tráng ấm chén, bỏ trà, đến rót nước, chắt nước trà, từng bước đều đòi hỏi sự kiên nhẫn khoan thai. Nước quá sôi sẽ làm hỏng độ tươi non; nước chưa đủ nhiệt lại khó đánh thức được hương vị đằm thắm.
Điều này hệt như đạo lý ứng xử ở đời: nóng vội cầu lợi tức thì thường biến khéo thành vụng, chỉ khi thấu hiểu sự tuần tự tiến bước, biết buông biết giữ nhịp nhàng, con người mới giữ được sự ung dung trước sóng gió cuộc đời.
Vị của trà, thoạt nếm có chút đắng chát, nhưng lắng lại là vị ngọt hậu ngọt ngào.
Tiền nhân mượn trà tỏ chí, đề cao "tĩnh tâm, tu đức, ngộ đạo". Trong làn hương trà thoang thoảng tạm gác lại muộn phiền vụn vặt, không chỉ là sự thư thái cho thân thể, mà còn là sự gột rửa và tái tạo thế giới tinh thần.
Học được cách bước chậm lại giữa phồn hoa huyên náo, ta mới thấu suốt được phương hướng mà trái tim mình thực sự kiếm tìm.`,
    vocabularyHighlights: [
      { hanzi: '返璞归真', pinyin: 'fǎnpú guīzhēn', hanviet: 'Phản phác quy chân', meaning: 'Quay về bản chất thuần phác mộc mạc ban đầu' },
      { hanzi: '急功近利', pinyin: 'jígōng jìnlì', hanviet: 'Cấp công cận lợi', meaning: 'Nóng vội hám cái lợi trước mắt' },
      { hanzi: '张弛有度', pinyin: 'zhāngchí yǒudù', hanviet: 'Trương thi hữu độ', meaning: 'Biết co biết giãn, biết buông biết giữ chừng mực' },
      { hanzi: '回甘', pinyin: 'huígān', hanviet: 'Hồi cam', meaning: 'Vị ngọt hậu sau khi uống trà' }
    ],
    questions: [
      {
        question: '文章指出泡茶的水温与人生处世有何相通之处？ (Bài viết chỉ ra nhiệt độ nước pha trà tương đồng với đạo đối nhân xử thế ở điểm nào?)',
        options: ['都要追求越热越好 (Đều phải càng nóng càng tốt)', '都要急功近利 (Đều phải chớp lấy cơ hội ngay lập tức)', '都要掌握火候，循序渐进、张弛有度 (Đều phải nắm bắt chừng mực, tiến hành tuần tự, co giãn nhịp nhàng)', '都可以随便应付 (Đều có thể tùy tiện xử lý)'],
        answerIndex: 2,
        explanation: 'Đoạn văn viết: "急功近利往往事与愿违，唯有懂得循序渐进、张弛有度，方能在风浪中保持从容".'
      },
      {
        question: '古人借茶明志，主要主张什么理念？ (Người xưa mượn trà tỏ chí, chủ yếu đề cao quan niệm gì?)',
        options: ['积累财富 (Tích lũy của cải)', '静心、修德、体道 (Tĩnh tâm, tu dưỡng đạo đức, chiêm nghiệm đạo lý)', '逃避现实社会 (Trốn tránh xã hội hiện thực)', '炫耀奢华器皿 (Khoe khoang ấm chén xa xỉ)'],
        answerIndex: 1,
        explanation: 'Trong bài có câu: "古人借茶明志，主张‘静心、修德、体道’".'
      }
    ]
  },
  {
    id: 'gr-502',
    level: 'HSK 5',
    titleZh: '商业谈判中的共赢思维',
    titleVi: 'Tư duy cùng thắng trong đàm phán thương mại',
    topic: 'Thương mại & Quản trị kinh doanh',
    readTimeMinutes: 6,
    wordCount: 375,
    contentZh: `在激烈的全球商业竞争中，传统的“零和博弈”观念正在被现代的“合作共赢”理念所取代。
过去，不少谈判者错误地将谈判视为一场你死我活的角力，试图通过极限施压将对方逼入死角，以谋求己方利益的最大化。
然而，大量的商业实践证明，这种缺乏诚意的霸道行径往往会导致合作破裂，甚至招致长期的商业报复。
真正高明的谈判专家懂得将焦点从“立场争执”转向“利益探索”。
在谈判伊始，首先通过深入调研和倾听，准确厘清对方核心关切背后的根本诉求。
通过互换非核心资源的让步，或者通过共同做大市场蛋糕来寻找利益的契合点，从而达成双方均认可的平衡协议。
谈判的终极目的从来不是打败对手，而是为了缔结一段具有持续生命力的战略伙伴关系。
唯有建立在信任与相互尊重基石上的契约，才能抵御不可预测的市场风险，实现长远的互利共赢。`,
    translationVi: `Trong cuộc cạnh tranh thương mại toàn cầu khốc liệt, quan niệm "trò chơi có tổng bằng không (Zero-sum game)" truyền thống đang dần bị thay thế bởi lý tưởng "hợp tác đôi bên cùng có lợi (Win-win)".
Trước đây, không ít nhà đàm phán ngộ nhận coi đàm phán là một cuộc đấu sinh tử một mất một còn, luôn tìm cách dùng sức ép cực độ dồn ép đối phương vào ngõ cụt nhằm mưu cầu tối đa hóa lợi ích của bản thân mình.
Thế nhưng, vô số thực tiễn kinh doanh đã minh chứng rằng hành vi áp đặt thiếu vắng thiện chí này thường dẫn đến đổ vỡ hợp tác, thậm chí chuốc lấy sự trả đũa thương mại lâu dài.
Chuyên gia đàm phán thực sự cao tay biết chuyển dịch trọng tâm từ "tranh cãi về lập trường" sang "khám phá lợi ích tiềm ẩn".
Ngay từ lúc khởi đầu đàm phán, trước tiên thông qua nghiên cứu sâu sát và lắng nghe thấu cảm để làm rõ ngọn ngành nguyện vọng căn bản đằng sau mối quan tâm cốt lõi của đối tác.
Bằng cách nhân nhượng hoán đổi các nguồn lực phi cốt lõi, hoặc cùng nhau nới rộng chiếc bánh thị phần để tìm kiếm điểm giao thoa lợi ích, từ đó đi đến một thỏa thuận cân bằng mà cả hai bên đều hài lòng.
Mục đích tối thượng của đàm phán chưa bao giờ là đánh bại đối thủ, mà là nhằm thiết lập một mối quan hệ đối tác chiến lược bền vững trường tồn.
Chỉ có bản hợp đồng xây dựng trên nền tảng của niềm tin và sự tôn trọng lẫn nhau mới đủ sức đương đầu với những biến cố rủi ro khôn lường của thị trường, hiện thực hóa sự cùng thắng bền lâu.`,
    vocabularyHighlights: [
      { hanzi: '零和博弈', pinyin: 'línghé bóyì', hanviet: 'Linh hòa bác dịch', meaning: 'Trò chơi có tổng bằng không (kẻ được người mất)' },
      { hanzi: '互利共赢', pinyin: 'hùlì gòngyíng', hanviet: 'Hỗ lợi cộng doanh', meaning: 'Cùng có lợi, đôi bên cùng thắng' },
      { hanzi: '诉求', pinyin: 'sùqiú', hanviet: 'Tố cầu', meaning: 'Nguyện vọng, yêu cầu cốt lõi' },
      { hanzi: '缔结', pinyin: 'dìjié', hanviet: 'Đế kết', meaning: 'Ký kết, thiết lập (quan hệ, hiệp ước)' }
    ],
    questions: [
      {
        question: '文章认为高明的谈判专家应将焦点放在哪里？ (Bài viết cho rằng chuyên gia đàm phán tài ba nên tập trung vào điều gì?)',
        options: ['立场争执 (Tranh cãi lập trường)', '利益探索 (Khám phá và dung hòa lợi ích)', '极限施压 (Gia tăng áp lực tối đa)', '单方面索取 (Đòi hỏi đơn phương)'],
        answerIndex: 1,
        explanation: 'Đoạn văn viết: "真正高明的谈判专家懂得将焦点从‘立场争执’转向‘利益探索’".'
      },
      {
        question: '谈判的终极目的是什么？ (Mục đích tối thượng của đàm phán là gì?)',
        options: ['彻底击垮竞争对手 (Đánh bại triệt để đối thủ cạnh tranh)', '缔结具有持续生命力的战略伙伴关系 (Ký kết quan hệ đối tác chiến lược bền vững)', '一次性赚取暴利 (Kiếm lợi nhuận khủng một lần)', '迫使对方无条件妥协 (Ép đối phương thỏa hiệp vô điều kiện)'],
        answerIndex: 1,
        explanation: 'Bài viết khẳng định: "谈判的终极目的从来不是打败对手，而是为了缔结一段具有持续生命力的战略伙伴关系".'
      }
    ]
  },

  // --- HSK 6 ---
  {
    id: 'gr-601',
    level: 'HSK 6',
    titleZh: '全球绿色供应链的变革与重塑',
    titleVi: 'Chuyển dịch và tái định hình chuỗi cung ứng xanh toàn cầu',
    topic: 'Kinh tế vĩ mô & Phát triển bền vững',
    readTimeMinutes: 7,
    wordCount: 420,
    contentZh: `在气候变化日益严峻的全球大背景下，实现碳达峰与碳中和目标已成为不可逆转的世界共识。
随之而来的，是一场波及全球制造业与国际贸易体系的深刻变革——全球供应链的全面绿色重塑。
传统工业体系长期依赖于高消耗、高排放的粗放型扩张模式，这不仅加剧了生态赤字，更在全球监管趋严的当下演变为巨大的合规风险。
越来越多的跨国巨头开始将全生命周期的环境足迹、清洁能源使用率以及资源循环利用效率，列为供应商准入的核心严苛指标。
这一转变倒逼上游制造企业加速技术革新。从原材料采购的低碳甄选，到生产流程中的数智化赋能，再到物流仓储环节的绿色降耗，产业链条上的每一个节点都在进行深层次的技术重构。
诚然，短期内的低碳转型必然伴随着巨额的设备改造与研发资金投入，对中小型制造企业的生存空间构成了前所未有的严峻考验。
然而，从宏观的长周期视角审视，唯有率先完成绿色低碳转型的经济实体，方能在新一轮国际产业分工与绿色贸易壁垒的重构中构筑不可替代的核心竞争壁垒。
可持续发展不再是一句空洞的道德宣示，它已然成为重塑未来全球经济增长版图的底层底层逻辑。`,
    translationVi: `Dưới bối cảnh biến đổi khí hậu toàn cầu ngày càng gay gắt, việc hiện thực hóa các mục tiêu đạt đỉnh phát thải carbon và trung hòa carbon đã trở thành đồng thuận thế giới không thể đảo ngược.
Kéo theo đó là một cuộc cải cách sâu rộng lan tỏa khắp hệ thống sản xuất công nghiệp và thương mại quốc tế: Cuộc tái cấu trúc xanh toàn diện chuỗi cung ứng toàn cầu.
Hệ sinh thái công nghiệp truyền thống trong một thời gian dài đã lệ thuộc vào mô hình mở rộng theo chiều rộng tiêu hao nhiều nguyên liệu và xả thải lớn, điều này không những làm gia tăng thâm hụt sinh thái mà dưới bối cảnh giám sát toàn cầu ngày càng siết chặt còn biến tướng thành rủi ro pháp lý tuân thủ nghiêm trọng.
Ngày càng nhiều tập đoàn đa quốc gia khổng lồ bắt đầu đưa lượng phát thải môi trường toàn vòng đời sản phẩm, tỷ lệ sử dụng năng lượng sạch cùng hiệu suất tái chế tuần hoàn tài nguyên vào thành các tiêu chuẩn tuyển chọn nhà cung cấp khắt khe bậc nhất.
Sự chuyển mình này đã buộc các doanh nghiệp sản xuất thượng nguồn phải tăng tốc đổi mới sáng tạo công nghệ. Từ khâu tuyển chọn nguyên vật liệu đầu vào phát thải thấp, đến việc ứng dụng công nghệ số hóa thông minh trong quy trình sản xuất, rồi đến việc cắt giảm tiêu hao năng lượng trong kho vận hậu cần, từng mắt xích trong chuỗi cung ứng đều đang tiến hành tái cấu trúc công nghệ tầng sâu.
Phải thừa nhận rằng, sự chuyển đổi xanh trong ngắn hạn chắc chắn sẽ đi kèm với chi phí cải tiến thiết bị và đầu tư nghiên cứu phát triển khổng lồ, đặt ra thử thách sống còn vô cùng khắc nghiệt đối với không gian sinh tồn của các doanh nghiệp vừa và nhỏ.
Tuy nhiên, khi xem xét từ góc nhìn chu kỳ kinh tế vĩ mô dài hạn, chỉ những thực thể kinh tế tiên phong hoàn tất chuyển đổi xanh phát thải thấp mới có thể gây dựng nên bức tường thành cạnh tranh cốt lõi không thể thay thế trong đợt tái cấu trúc phân công lao động công nghiệp quốc tế và rào cản thương mại xanh mới.
Phát triển bền vững không còn là một khẩu hiệu đạo đức sáo rỗng, nó đã thực sự trở thành nguyên lý cơ bản tái lập bản đồ tăng trưởng kinh tế toàn cầu trong tương lai.`,
    vocabularyHighlights: [
      { hanzi: '碳中和', pinyin: 'tàn zhōnghé', hanviet: 'Thán trung hòa', meaning: 'Trung hòa carbon (Net Zero)' },
      { hanzi: '粗放型', pinyin: 'cūfàngxíng', hanviet: 'Thô phóng hình', meaning: 'Mô hình phát triển theo chiều rộng, thô sơ' },
      { hanzi: '绿色贸易壁垒', pinyin: 'lǜsè màoyì bìlěi', hanviet: 'Lục sắc mậu dịch bích lũy', meaning: 'Rào cản kỹ thuật thương mại xanh' },
      { hanzi: '全生命周期', pinyin: 'quán shēngmìng zhōuqī', hanviet: 'Toàn sinh mệnh chu kỳ', meaning: 'Toàn bộ vòng đời sản phẩm' }
    ],
    questions: [
      {
        question: '跨国巨头将哪些指标列为供应商准入的核心指标？ (Các tập đoàn đa quốc gia đưa những chỉ số nào vào tiêu chuẩn cốt lõi tuyển chọn nhà cung cấp?)',
        options: ['产品单价越低越好 (Đơn giá sản phẩm càng rẻ càng tốt)', '全生命周期环境足迹与清洁能源使用率 (Phát thải môi trường toàn vòng đời và tỷ lệ dùng năng lượng sạch)', '供应商的员工总人数 (Tổng số lượng nhân viên của nhà cung ứng)', '厂房占地面积大小 (Diện tích mặt bằng nhà xưởng)'],
        answerIndex: 1,
        explanation: 'Đoạn văn viết: "将全生命周期的环境足迹、清洁能源使用率以及资源循环利用效率，列为供应商准入的核心严苛指标".'
      },
      {
        question: '文章指出低碳转型短期内对中小企业带来了什么考验？ (Bài viết chỉ ra chuyển đổi phát thải thấp trong ngắn hạn đặt ra thử thách gì cho doanh nghiệp vừa và nhỏ?)',
        options: ['订单过多无法按时交付 (Quá nhiều đơn hàng không kịp giao)', '设备改造与研发资金投入带来的生存考验 (Thử thách sinh tồn do chi phí cải tạo thiết bị và đầu tư R&D)', '员工纷纷要求加薪 (Nhân viên đua nhau đòi tăng lương)', '国际市场需求彻底萎缩 (Nhu cầu thị trường quốc tế suy giảm hoàn toàn)'],
        answerIndex: 1,
        explanation: 'Bài viết nêu rõ: "短期内的低碳转型必然伴随着巨额的设备改造与研发资金投入，对中小型制造企业的生存空间构成了前所未有的严峻考验".'
      }
    ]
  },
  {
    id: 'gr-602',
    level: 'HSK 6',
    titleZh: '老子“道法自然”与当代生态伦理',
    titleVi: 'Tư tưởng "Đạo pháp tự nhiên" của Lão Tử và đạo đức sinh thái đương đại',
    topic: 'Triết học cổ điển & Đạo đức sinh thái',
    readTimeMinutes: 7,
    wordCount: 435,
    contentZh: `先秦诸子百家中，道家学派创始人老子所著《道德经》，以其博大精深的思想体系，构筑了中国传统哲学最深奥玄妙的形而上学高峰。
其核心命题“人法地，地法天，天法道，道法自然”，不仅揭示了宇宙生成演化的本原法则，更蕴含着极具前瞻性的生态智慧与伦理哲思。
“道法自然”之“自然”，非独指今日所言之客观自然界，实乃指万事万物“自己如此”、本真自在的存在样态与运行规律。
老子告诫统治者与世人，应当摒弃人类中心主义的狂妄自大，遵循客观事物内蕴的发展法则，行“无为而无不为”之智。
所谓“无为”，绝非消极怠惰、坐以待毙的避世主义，而是力戒妄自尊大、强行干涉、肆意掠夺的非理性妄动。
反观当下，人类凭借现代科技的迅猛发展，以近乎掠夺的姿态榨取地球资源，虽创造了前所未有的物质繁荣，却也将自身推向了生态崩溃与气候异化的悬崖边缘。
重温老子“知足不辱，知止不殆”的古训，有助于唤醒我们对天地化育万物的敬畏之心。
唯有在科技理性中注入东方的生态智慧，重新审视人类在宇宙生态共同体中的位次，我们方能在人与自然的和谐共生中寻求人类文明的永续繁衍。`,
    translationVi: `Trong bách gia chư tử thời Tiên Tần, pho sách "Đạo Đức Kinh" của bậc thủy tổ học phái Đạo gia Lão Tử, bằng hệ thống tư tưởng bác đại tinh thâm, đã kiến tạo nên đỉnh cao siêu hình học huyền diệu thâm sâu bậc nhất trong triết học truyền thống Trung Hoa.
Mệnh đề cốt lõi của ông: "Nhân pháp địa, địa pháp thiên, thiên pháp đạo, đạo pháp tự nhiên", không chỉ hé mở quy luật khởi nguồn sinh thành và diễn hóa của vũ trụ bao la, mà còn hàm chứa trí tuệ sinh thái và tư tưởng đạo đức mang tầm nhìn vượt thời đại.
Chữ "tự nhiên" trong "Đạo pháp tự nhiên", không đơn thuần chỉ giới tự nhiên khách quan như ta vẫn hiểu ngày nay, mà thực chất chỉ trạng thái tồn tại và quy luật vận hành "tự nó là như vậy", vốn dĩ tự tại của vạn sự vạn vật.
Lão Tử khuyên răn bậc cai trị và nhân gian phải gạt bỏ sự ngạo mạn tự phụ của chủ nghĩa lấy con người làm trung tâm, thuận theo quy luật phát triển nội tại của sự vật khách quan, thực thi trí tuệ "vô vi nhi vô bất vi" (không làm trái tự nhiên thì không việc gì là không thành).
Cái gọi là "vô vi", tuyệt nhiên chẳng phải chủ nghĩa yếm thế tiêu cực lười biếng, cam chịu khoanh tay chờ chết, mà là kiên quyết kiềm chế những hành động xốc nổi mù quáng, áp đặt can thiệp thô bạo và vơ vét bóc lột cạn kiệt phi lý.
Nhìn lại hiện tại, nhân loại dựa vào sự phát triển thần tốc của khoa học công nghệ hiện đại, với tư thái gần như bóc lột để bòn rút tài nguyên Trái Đất, dẫu đã tạo dựng nên sự phồn vinh vật chất chưa từng có, nhưng cũng đồng thời đẩy chính bản thân mình tới bờ vực của sụp đổ sinh thái và biến đổi khí hậu dị thường.
Ôn lại lời răn dạy cổ xưa của Lão Tử "Tri túc bất nhục, tri chỉ bất đãi" (biết đủ thì không nhục, biết dừng thì không nguy), giúp đánh thức trong tâm hồn ta lòng kính sợ đối với đức hiếu sinh dưỡng dục muôn loài của trời đất.
Chỉ khi rót thêm trí tuệ sinh thái phương Đông vào tư duy lý tính khoa học, nhìn nhận lại vị thế của con người trong cộng đồng sinh thái vũ trụ, chúng ta mới có thể tìm thấy sự trường tồn tiếp nối bất tận của văn minh nhân loại trong sự cộng sinh hòa hợp giữa con người và tự nhiên.`,
    vocabularyHighlights: [
      { hanzi: '道法自然', pinyin: 'dàofǎ zìrán', hanviet: 'Đạo pháp tự nhiên', meaning: 'Đạo noi theo tự nhiên, quy luật vận hành tự tại' },
      { hanzi: '形而上学', pinyin: 'xíng’érshàngxué', hanviet: 'Hình nhi thượng học', meaning: 'Triết học siêu hình, bản thể luận' },
      { hanzi: '知足不辱', pinyin: 'zhīzú bù rǔ', hanviet: 'Tri túc bất nhục', meaning: 'Biết đủ thì không bị nhục nhã' },
      { hanzi: '和谐共生', pinyin: 'héxié gòngshēng', hanviet: 'Hòa hiệp cộng sinh', meaning: 'Cùng chung sống hòa hợp' }
    ],
    questions: [
      {
        question: '老子所说的“无为”在现代生态哲学中应如何理解？ (Khái niệm "Vô vi" của Lão Tử trong triết học sinh thái hiện đại nên được hiểu như thế nào?)',
        options: ['什么事情都不要做，任由自然毁灭 (Không làm gì cả, mặc kệ tự nhiên bị hủy diệt)', '消极避世与懒惰 (Lười biếng và trốn tránh cuộc đời)', '不妄为、不肆意掠夺，遵循客观规律 (Không hành động mù quáng, không vơ vét bừa bãi, thuận theo quy luật khách quan)', '彻底放弃现代科学技术 (Từ bỏ hoàn toàn khoa học kỹ thuật hiện đại)'],
        answerIndex: 2,
        explanation: 'Đoạn văn phân tích: "所谓‘无为’……而是力戒妄自尊大、强行干涉、肆意掠夺的非理性妄动".'
      },
      {
        question: '“知止不殆”中的“殆”在古文中是什么意思？ (Từ "đãi" trong câu "tri chỉ bất đãi" theo văn ngôn cổ có nghĩa là gì?)',
        options: ['快乐 (Vui vẻ)', '危险 (Nguy hiểm)', '缓慢 (Chậm chạp)', '富足 (Giàu có)'],
        answerIndex: 1,
        explanation: 'Trong Hán ngữ cổ, "đãi" (殆) nghĩa là nguy hại, nguy hiểm ("biết điểm dừng thì không gặp hiểm nguy").'
      }
    ]
  },

  // ==========================================
  // EXPANDED READERS (HSK 1 - HSK 6)
  // ==========================================

  // --- HSK 1 (Bổ sung 2 bài) ---
  {
    id: 'gr-103',
    level: 'HSK 1',
    titleZh: '去中国超市买东西',
    titleVi: 'Đi siêu thị Trung Quốc mua sắm',
    topic: 'Mua sắm & Đời sống',
    readTimeMinutes: 2,
    wordCount: 125,
    contentZh: `今天下午，我和同学王方一起去大超市。
超市里有很多东西，有苹果、西瓜、茶和牛奶。
苹果很好吃，也不贵。王方想买六个红苹果和两瓶水。
我想买三本书和一个漂亮的杯子。
我们一共花了五十块钱。售货员很高兴，对我们说“谢谢，再见”。
去超市买东西真方便。`,
    translationVi: `Chiều hôm nay, tôi cùng bạn học Vương Phương đến siêu thị lớn.
Trong siêu thị có rất nhiều đồ, có táo, dưa hấu, trà và sữa bò.
Táo rất ngon và cũng không đắt. Vương Phương muốn mua 6 quả táo đỏ và 2 chai nước.
Tôi muốn mua 3 quyển sách và một chiếc cốc đẹp.
Chúng tôi tổng cộng tiêu hết 50 tệ. Nhân viên bán hàng rất vui, nói với chúng tôi: "Cảm ơn, tạm biệt".
Đi siêu thị mua sắm thật là thuận tiện.`,
    vocabularyHighlights: [
      { hanzi: '超市', pinyin: 'chāoshì', hanviet: 'Siêu thị', meaning: 'Siêu thị' },
      { hanzi: '西瓜', pinyin: 'xīguā', hanviet: 'Tây qua', meaning: 'Dưa hấu' },
      { hanzi: '一共', pinyin: 'yígòng', hanviet: 'Nhất cộng', meaning: 'Tổng cộng' },
      { hanzi: '方便', pinyin: 'fāngbiàn', hanviet: 'Phương tiện', meaning: 'Thuận tiện, tiện lợi' }
    ],
    questions: [
      {
        question: '王方在超市想买什么？ (Vương Phương muốn mua gì ở siêu thị?)',
        options: ['六个红苹果和两瓶水 (6 quả táo đỏ và 2 chai nước)', '三本书和一个杯子 (3 quyển sách và 1 chiếc cốc)', '西瓜和牛奶 (Dưa hấu và sữa bò)', '只有茶 (Chỉ có trà)'],
        answerIndex: 0,
        explanation: 'Trong bài có câu rõ ràng: "王方想买六个红苹果和两瓶水".'
      },
      {
        question: '他们买东西一共花了多少钱？ (Họ mua đồ tổng cộng hết bao nhiêu tiền?)',
        options: ['三十块钱 (30 tệ)', '四十块钱 (40 tệ)', '五十块钱 (50 tệ)', '一百块钱 (100 tệ)'],
        answerIndex: 2,
        explanation: 'Đoạn văn viết: "我们一共花了五十块钱" (Chúng tôi tiêu hết tổng cộng 50 tệ).'
      }
    ]
  },
  {
    id: 'gr-104',
    level: 'HSK 1',
    titleZh: '我可爱的小狗点点',
    titleVi: 'Chú chó cưng Điểm Điểm của tôi',
    topic: 'Thú cưng & Tình cảm',
    readTimeMinutes: 2,
    wordCount: 118,
    contentZh: `我家有一只小狗，它的名字叫点点。
点点身上的毛是黄色的，眼睛很大，耳朵很小。
每天早上我起床的时候，它都在门外等我。
它喜欢吃肉，也喜欢在草地上飞快地跑。
下午放学回家，它看见我就会摇尾巴，非常高兴。
点点不仅是我的好朋友，也是我们家的一员。`,
    translationVi: `Nhà tôi có một chú chó nhỏ, tên của nó là Điểm Điểm.
Lông trên người Điểm Điểm màu vàng, mắt rất to, tai rất nhỏ.
Mỗi buổi sáng khi tôi thức dậy, nó đều đợi tôi ở ngoài cửa.
Nó thích ăn thịt, cũng thích chạy thật nhanh trên bãi cỏ.
Chiều tan học về nhà, nó nhìn thấy tôi là vẫy đuôi, vô cùng mừng rỡ.
Điểm Điểm không chỉ là người bạn thân của tôi, mà còn là một thành viên trong gia đình tôi.`,
    vocabularyHighlights: [
      { hanzi: '名字', pinyin: 'míngzi', hanviet: 'Danh tự', meaning: 'Tên gọi' },
      { hanzi: '黄色', pinyin: 'huángsè', hanviet: 'Hoàng sắc', meaning: 'Màu vàng' },
      { hanzi: '起床', pinyin: 'qǐchuáng', hanviet: 'Khởi sàng', meaning: 'Thức dậy' },
      { hanzi: '看见', pinyin: 'kànjiàn', hanviet: 'Khán kiến', meaning: 'Nhìn thấy' }
    ],
    questions: [
      {
        question: '点点身上的毛是什么颜色的？ (Lông trên người Điểm Điểm có màu gì?)',
        options: ['白色的 (Màu trắng)', '黑色的 (Màu đen)', '黄色的 (Màu vàng)', '灰色的 (Màu xám)'],
        answerIndex: 2,
        explanation: 'Bài viết nêu rõ: "点点身上的毛是黄色的" (Lông của Điểm Điểm màu vàng).'
      },
      {
        question: '点点看见我回家的时候会做什么？ (Điểm Điểm làm gì khi thấy tôi về nhà?)',
        options: ['睡觉 (Đi ngủ)', '摇尾巴，非常高兴 (Vẫy đuôi, rất mừng rỡ)', '跑去商店 (Chạy ra cửa hàng)', '大声叫 (Sủa lớn)'],
        answerIndex: 1,
        explanation: 'Trong bài có câu: "它看见我就会摇尾巴，非常高兴".'
      }
    ]
  },

  // --- HSK 2 (Bổ sung 2 bài) ---
  {
    id: 'gr-203',
    level: 'HSK 2',
    titleZh: '体验四川麻辣火锅',
    titleVi: 'Trải nghiệm lẩu cay Tứ Xuyên',
    topic: 'Ẩm thực truyền thống',
    readTimeMinutes: 3,
    wordCount: 195,
    contentZh: `上个星期五晚上，我和几个留学生朋友一起去吃正宗的四川火锅。
这家饭馆在市中心，生意非常好，服务员很热情。
我们点了一个鸳鸯锅：一边是红红的麻辣汤底，另一边是不辣的牛肉清汤。
四川火锅里的辣椒和花椒很多，闻起来特别香。
我们点了羊肉卷、豆腐、新鲜蔬菜和面条。
虽然辣得大家一边喝冰水一边擦汗，但是味道真是太好吃了！
吃火锅不仅能尝到美味的中国菜，还能和朋友们一边聊天一边享受快乐的时光。`,
    translationVi: `Tối thứ Sáu tuần trước, tôi và mấy người bạn du học sinh cùng nhau đi ăn lẩu Tứ Xuyên chính gốc.
Nhà hàng này nằm ở trung tâm thành phố, buôn bán rất phát đạt, nhân viên phục vụ rất nhiệt tình.
Chúng tôi gọi một nồi lẩu uyên ương: một bên là nước lẩu cay xè đỏ rực, bên kia là nước lẩu thịt bò thanh đạm không cay.
Ớt và hoa tiêu trong lẩu Tứ Xuyên rất nhiều, ngửi mùi thơm nức mũi.
Chúng tôi gọi thịt cừu cuộn, đậu phụ, rau tươi và mì sợi.
Tuy rằng cay đến mức mọi người vừa uống nước đá vừa lau mồ hôi, nhưng mùi vị quả thực quá ngon!
Ăn lẩu không chỉ nếm được món ăn Trung Hoa thơm ngon, mà còn có thể cùng bạn bè vừa trò chuyện vừa tận hưởng khoảnh khắc vui vẻ.`,
    vocabularyHighlights: [
      { hanzi: '正宗', pinyin: 'zhèngzōng', hanviet: 'Chính tông', meaning: 'Chính gốc, truyền thống' },
      { hanzi: '热情', pinyin: 'rèqíng', hanviet: 'Nhiệt tình', meaning: 'Nhiệt tình' },
      { hanzi: '虽然', pinyin: 'suīrán', hanviet: 'Tuy nhiên', meaning: 'Tuy rằng' },
      { hanzi: '味道', pinyin: 'wèidào', hanviet: 'Vị đạo', meaning: 'Mùi vị' }
    ],
    questions: [
      {
        question: '他们点了什么样的火锅？ (Họ đã gọi loại lẩu nào?)',
        options: ['只有辣锅 (Chỉ có nồi cay)', '鸳鸯锅（一边辣一边不辣） (Nồi uyên ương: một bên cay một bên không)', '只有海鲜锅 (Chỉ có lẩu hải sản)', '甜品锅 (Nồi đồ ngọt)'],
        answerIndex: 1,
        explanation: 'Đoạn văn viết rõ: "我们点了一个鸳鸯锅：一边是红红的麻辣汤底，另一边是不辣的牛肉清汤".'
      },
      {
        question: '大家吃火锅时的感受是什么？ (Cảm nhận của mọi người khi ăn lẩu là gì?)',
        options: ['一点儿也不辣 (Chẳng cay chút nào)', '味道不好吃 (Vị không ngon)', '虽然辣但太好吃了，大家很开心 (Tuy cay nhưng quá ngon, mọi người rất vui)', '太贵了不想吃 (Quá đắt không muốn ăn)'],
        answerIndex: 2,
        explanation: 'Trong bài có câu: "虽然辣得大家一边喝冰水一边擦汗，但是味道真是太好吃了！".'
      }
    ]
  },
  {
    id: 'gr-204',
    level: 'HSK 2',
    titleZh: '在大学图书馆借书',
    titleVi: 'Mượn sách tại thư viện đại học',
    topic: 'Học đường & Sinh hoạt',
    readTimeMinutes: 3,
    wordCount: 185,
    contentZh: `我们大学的图书馆是一座六层高的白色大楼，环境非常安静。
每天都有很多学生在里面看书、写作业和复习功课。
今天下午，我拿着学生卡去三楼借阅汉语学习资料。
三楼的书架上整齐地摆满了各种各样的语言类图书和词典。
我找了半个小时，终于借到了两本关于HSK考试的辅导书。
图书馆的老师告诉我，每本书可以借一个月，如果看不完，还可以在网上申请续借。
我很喜欢在图书馆学习，因为这里能让我集中精力。`,
    translationVi: `Thư viện trường đại học của chúng tôi là một tòa nhà màu trắng cao 6 tầng, môi trường vô cùng yên tĩnh.
Mỗi ngày đều có rất nhiều sinh viên bên trong đọc sách, làm bài tập và ôn tập bài vở.
Chiều hôm nay, tôi cầm thẻ sinh viên lên tầng 3 để mượn tài liệu học tiếng Trung.
Trên giá sách tầng 3 xếp đầy ngay ngắn đủ loại sách ngôn ngữ và từ điển.
Tôi tìm mất nửa tiếng đồng hồ, cuối cùng đã mượn được hai cuốn sách hướng dẫn về kỳ thi HSK.
Thầy cô ở thư viện nói với tôi rằng, mỗi cuốn sách được mượn 1 tháng, nếu đọc chưa xong còn có thể đăng ký gia hạn trực tuyến.
Tôi rất thích học tập ở thư viện, vì nơi đây giúp tôi tập trung tinh thần.`,
    vocabularyHighlights: [
      { hanzi: '环境', pinyin: 'huánjìng', hanviet: 'Hoàn cảnh', meaning: 'Môi trường xung quanh' },
      { hanzi: '资料', pinyin: 'zīliào', hanviet: 'Tư liệu', meaning: 'Tài liệu' },
      { hanzi: '终于', pinyin: 'zhōngyú', hanviet: 'Chung vu', meaning: 'Cuối cùng' },
      { hanzi: '集中', pinyin: 'jízhōng', hanviet: 'Tập trung', meaning: 'Tập trung' }
    ],
    questions: [
      {
        question: '作者去图书馆三楼借了什么书？ (Tác giả lên tầng 3 thư viện mượn sách gì?)',
        options: ['两本关于HSK考试的辅导书 (2 cuốn sách ôn thi HSK)', '故事书 (Sách truyện)', '数学书 (Sách toán học)', '音乐书 (Sách âm nhạc)'],
        answerIndex: 0,
        explanation: 'Đoạn văn nêu rõ: "终于借到了两本关于HSK考试的辅导书".'
      },
      {
        question: '图书馆借的书如果一个月看不完可以怎么办？ (Nếu sách mượn 1 tháng đọc chưa xong thì làm thế nào?)',
        options: ['必须马上还 (Phải trả ngay lập tức)', '交罚款 (Nộp tiền phạt)', '在网上申请续借 (Đăng ký gia hạn trên mạng)', '送给朋友 (Tặng cho bạn bè)'],
        answerIndex: 2,
        explanation: 'Trong bài có câu: "如果看不完，还可以在网上申请续借" (nếu đọc chưa xong, còn có thể lên mạng xin gia hạn).'
      }
    ]
  },

  // --- HSK 3 (Bổ sung 2 bài) ---
  {
    id: 'gr-303',
    level: 'HSK 3',
    titleZh: '参加中国朋友的传统婚礼',
    titleVi: 'Dự đám cưới truyền thống của bạn Trung Quốc',
    topic: 'Phong tục & Lễ hội',
    readTimeMinutes: 4,
    wordCount: 260,
    contentZh: `上个周末，我受邀参加了中国大学好友张伟的婚礼。这是我第一次亲身体验中国的传统婚俗，感觉特别新奇。
整个婚礼现场布置得喜气洋洋，到处都挂着大红色的双喜字和漂亮的鲜花。
新郎穿着笔挺的西装，新娘则穿着红色的秀禾服，头上戴着金色的头饰，看起来美丽而庄重。
在婚礼仪式上，新郎新娘恭敬地给双方父母敬茶，感谢父母多年的养育之恩。父母喝了茶，给新人送上了大红色的红包，祝他们百年好合、白头偕老。
客人们围坐在大圆桌旁，品尝着丰盛的婚宴菜肴，彼此碰杯祝福。
参加这次婚礼，让我深刻感受到了中国文化中对家庭和谐与亲情孝道的高度重视。`,
    translationVi: `Cuối tuần trước, tôi được mời tham dự đám cưới của người bạn đại học Trung Quốc Trương Vĩ. Đây là lần đầu tiên tôi trực tiếp trải nghiệm phong tục hôn lễ truyền thống của Trung Quốc, cảm thấy vô cùng mới lạ.
Toàn bộ hội trường hôn lễ được bài trí ngập tràn không khí vui tươi hỷ sự, khắp nơi treo chữ Song Hỷ màu đỏ thắm và hoa tươi rực rỡ.
Chú rể mặc âu phục tề chỉnh, cô dâu diện bộ Hỷ phục Tú Hòa đỏ thắm, trên đầu cài trâm vàng, trông vừa xinh đẹp vừa trang trọng.
Trong nghi thức hôn lễ, cô dâu chú rể cung kính dâng trà cho cha mẹ hai bên, cảm tạ công ơn nuôi dưỡng nhiều năm của đấng sinh thành. Cha mẹ uống trà và trao tặng cặp đôi những phong bao lì xì đỏ thắm, chúc hai con trăm năm hạnh phúc, bạc đầu giai lão.
Các vị khách quây quần bên những bàn tròn lớn, thưởng thức các món ăn tiệc cưới thịnh soạn, cùng nâng ly chúc mừng nhau.
Tham dự đám cưới lần này giúp tôi cảm nhận sâu sắc sự coi trọng cao độ đối với hòa thuận gia đình và chữ hiếu trong văn hóa Trung Hoa.`,
    vocabularyHighlights: [
      { hanzi: '婚礼', pinyin: 'hūnlǐ', hanviet: 'Hôn lễ', meaning: 'Đám cưới, hôn lễ' },
      { hanzi: '庄重', pinyin: 'zhuāngzhòng', hanviet: 'Trang trọng', meaning: 'Trang trọng, nghiêm trang' },
      { hanzi: '丰盛', pinyin: 'fēngshèng', hanviet: 'Phong thịnh', meaning: 'Thịnh soạn, dồi dào' },
      { hanzi: '孝道', pinyin: 'xiàodào', hanviet: 'Hiếu đạo', meaning: 'Đạo hiếu, lòng hiếu thảo' }
    ],
    questions: [
      {
        question: '新娘在婚礼上穿了什么服装？ (Cô dâu mặc trang phục gì trong đám cưới?)',
        options: ['白色的婚纱 (Váy cưới màu trắng)', '红色的秀禾服 (Áo Tú Hòa màu đỏ truyền thống)', '普通便服 (Quần áo bình thường)', '运动服 (Quần áo thể thao)'],
        answerIndex: 1,
        explanation: 'Bài viết chỉ rõ: "新娘则穿着红色的秀禾服，头上戴着金色的头饰".'
      },
      {
        question: '新人敬茶后，父母送给他们什么祝福？ (Sau khi dâng trà, cha mẹ trao cho cặp đôi lời chúc gì?)',
        options: ['百年好合、白头偕老 (Trăm năm hạnh phúc, bạc đầu giai lão)', '一路平安 (Thuận buồm xuôi gió)', '生意兴隆 (Buôn may bán đắt)', '早日毕业 (Sớm ngày tốt nghiệp)'],
        answerIndex: 0,
        explanation: 'Trong bài có câu: "祝他们百年好合、白头偕老".'
      }
    ]
  },
  {
    id: 'gr-304',
    level: 'HSK 3',
    titleZh: '保护大熊猫的生态志愿者',
    titleVi: 'Tình nguyện viên bảo vệ gấu trúc sinh thái',
    topic: 'Tự nhiên & Động vật',
    readTimeMinutes: 4,
    wordCount: 275,
    contentZh: `大熊猫是中国特有的珍稀动物，被誉为中国的“国宝”。去年暑假，我报名参加了四川卧龙自然保护区的志愿者活动。
在保护区里，我们的主要工作是帮助饲养员清理熊猫的圈舍、搬运新鲜的竹子和制作营养窝窝头。
大熊猫每天大部分的时间都在吃竹子和睡觉。它们走路时摇摇晃晃的，吃竹子时两只手捧着，样子憨态可掬，非常惹人喜爱。
保护区的专家向我们解释，由于气候变化和人类活动的干扰，大熊猫的野生栖息地曾经变得非常零碎。
近年来，中国政府建立了大熊猫国家公园，将破碎的栖息地连接起来，大熊猫的种群数量才逐渐恢复。
这段难忘的志愿者经历，让我明白了保护野生动物就是保护人类赖以生存的自然家园。`,
    translationVi: `Gấu trúc lớn là loài động vật quý hiếm đặc hữu của Trung Quốc, được tôn vinh là "Quốc bảo" của đất nước này. Kỳ nghỉ hè năm ngoái, tôi đăng ký tham gia hoạt động tình nguyện viên tại Khu bảo tồn thiên nhiên Ngọa Long, Tứ Xuyên.
Ở khu bảo tồn, công việc chính của chúng tôi là giúp đỡ nhân viên chăm sóc dọn dẹp chuồng nuôi gấu trúc, vận chuyển tre trúc tươi và làm bánh dinh dưỡng bổ sung.
Phần lớn thời gian mỗi ngày gấu trúc đều dành cho việc ăn tre và ngủ. Chúng đi đứng lắc lư khập khiễng, khi ăn tre thì hai tay ôm lấy, bộ dạng ngây ngô đáng yêu vô cùng.
Các chuyên gia của khu bảo tồn giải thích với chúng tôi rằng, do biến đổi khí hậu và sự can thiệp từ hoạt động của con người, môi trường sống tự nhiên của gấu trúc từng bị chia cắt manh mún.
Những năm gần đây, chính phủ Trung Quốc đã thành lập Công viên Quốc gia Gấu trúc, kết nối các vùng sinh thái bị chia cắt, số lượng quần thể gấu trúc mới dần dần được phục hồi.
Kinh nghiệm tình nguyện khó quên này giúp tôi thấu hiểu rằng bảo vệ động vật hoang dã chính là bảo vệ ngôi nhà chung tự nhiên mà con người đang nương tựa để sinh tồn.`,
    vocabularyHighlights: [
      { hanzi: '国宝', pinyin: 'guóbǎo', hanviet: 'Quốc bảo', meaning: 'Báu vật quốc gia' },
      { hanzi: '憨态可掬', pinyin: 'hāntài-kějū', hanviet: 'Hàm thái khả cúc', meaning: 'Dáng vẻ ngây thơ đáng yêu' },
      { hanzi: '栖息地', pinyin: 'qīxīdì', hanviet: 'Tê tức địa', meaning: 'Môi trường sống, nơi cư trú' },
      { hanzi: '逐渐', pinyin: 'zhújiàn', hanviet: 'Trục tiệm', meaning: 'Dần dần, từng bước' }
    ],
    questions: [
      {
        question: '志愿者的主要工作内容是什么？ (Nhiệm vụ chính của tình nguyện viên là gì?)',
        options: ['清理圈舍、搬运竹子和制作营养窝窝头 (Dọn chuồng, chuyển tre tươi và làm bánh dinh dưỡng)', '给大熊猫看病 (Khám bệnh cho gấu trúc)', '拍摄商业电影 (Quay phim thương mại)', '砍伐森林 (Chặt phá rừng)'],
        answerIndex: 0,
        explanation: 'Đoạn văn viết: "我们的主要工作是帮助饲养员清理熊猫的圈舍、搬运新鲜的竹子和制作营养窝窝头".'
      },
      {
        question: '中国政府近年采取了什么措施恢复大熊猫数量？ (Chính phủ TQ đã áp dụng biện pháp gì gần đây để phục hồi số lượng gấu trúc?)',
        options: ['建立了大熊猫国家公园，连接破碎栖息地 (Thành lập Công viên quốc gia Gấu trúc, kết nối môi trường sống)', '把所有熊猫送出国 (Gửi tất cả gấu trúc ra nước ngoài)', '禁止游客参观 (Cấm du khách tham quan)', '人工饲养所有野生动物 (Nuôi nhốt nhân tạo tất cả động vật)'],
        answerIndex: 0,
        explanation: 'Bài viết giải thích: "近年来，中国政府建立了大熊猫国家公园，将破碎的栖息地连接起来".'
      }
    ]
  },

  // --- HSK 4 (Bổ sung 2 bài) ---
  {
    id: 'gr-403',
    level: 'HSK 4',
    titleZh: '移动支付如何深刻改变现代生活',
    titleVi: 'Thanh toán di động thay đổi sâu sắc đời sống hiện đại',
    topic: 'Công nghệ & Tiện ích',
    readTimeMinutes: 5,
    wordCount: 310,
    contentZh: `在中国生活，哪怕出门不带一分现金和银行卡，只要随身携带一部智能手机，人们的生活几乎不会受到任何影响。从乘坐公交地铁、超市购物，到街头买煎饼、缴纳水电煤气费，扫描二维码已经成为全民通用的支付方式。
移动支付的普及不仅极大地提升了社会交易的效率，缩短了排队等候的时间，还从源头上减少了假币流通和现金被盗的风险。
对于商家而言，数字收银系统能够自动记录流水账目，极大方便了日常的财务统计与库存管理。
然而，随着数字社会的全面到来，如何帮助不熟悉智能手机的老年群体跨越“数字鸿沟”，也逐渐成为全社会共同关注的课题。
许多公共服务窗口和商户依然保留了人工现金通道，以确保每个人都能享受到社会的温度与便利。
移动支付不仅是一项科技创新，更体现了现代社会效率与人文关怀之间的平衡智慧。`,
    translationVi: `Sống tại Trung Quốc, cho dù ra ngoài không mang theo một đồng tiền mặt hay thẻ ngân hàng nào, chỉ cần mang theo một chiếc điện thoại thông minh bên mình, cuộc sống của mọi người gần như không bị ảnh hưởng chút nào. Từ việc đi xe buýt tàu điện ngầm, mua sắm siêu thị, cho đến mua bánh rán ven đường, nộp tiền điện nước, quét mã QR đã trở thành phương thức thanh toán toàn dân phổ cập.
Sự phổ biến của thanh toán di động không chỉ nâng cao vượt bậc hiệu quả giao dịch xã hội, rút ngắn thời gian xếp hàng chờ đợi, mà còn giảm thiểu tận gốc rủi ro lưu thông tiền giả và mất cắp tiền mặt.
Đối với người kinh doanh, hệ thống thu ngân kỹ thuật số có thể tự động ghi chép các giao dịch phát sinh, mang lại sự tiện lợi to lớn cho việc thống kê tài chính và quản lý kho hàng ngày.
Tuy nhiên, cùng với sự xuất hiện toàn diện của xã hội số, làm thế nào để hỗ trợ nhóm người cao tuổi chưa quen thuộc với điện thoại thông minh vượt qua "hố ngăn cách kỹ thuật số" cũng dần trở thành chủ đề được toàn xã hội quan tâm sâu sắc.
Rất nhiều quầy dịch vụ công cộng và cửa hàng vẫn tiếp tục duy trì làn giao dịch tiền mặt truyền thống, nhằm đảm bảo mỗi cá nhân đều có thể cảm nhận được sự ấm áp và tiện lợi của xã hội.
Thanh toán di động không đơn thuần là một cải tiến công nghệ, mà còn thể hiện trí tuệ cân bằng giữa hiệu quả thời đại số và sự sẻ chia nhân văn.`,
    vocabularyHighlights: [
      { hanzi: '携带', pinyin: 'xiédài', hanviet: 'Huề đới', meaning: 'Mang theo bên mình' },
      { hanzi: '普及', pinyin: 'pǔjí', hanviet: 'Phổ cập', meaning: 'Phổ cập, lan rộng' },
      { hanzi: '数字鸿沟', pinyin: 'shùzì hónggōu', hanviet: 'Số tự hồng câu', meaning: 'Khoảng cách kỹ thuật số' },
      { hanzi: '人文关怀', pinyin: 'rénwén guānhuái', hanviet: 'Nhân văn quan hoài', meaning: 'Sự quan tâm nhân văn' }
    ],
    questions: [
      {
        question: '移动支付为现代社会带来了哪些显著优势？ (Thanh toán di động đem lại lợi ích nổi bật nào?)',
        options: ['提升交易效率，减少现金被盗和假币风险 (Tăng hiệu suất giao dịch, giảm rủi ro tiền giả và trộm cắp)', '增加现金使用量 (Tăng lượng tiền mặt sử dụng)', '必须每天去银行排队 (Hàng ngày phải ra ngân hàng xếp hàng)', '使购物变得更加繁琐 (Làm cho việc mua sắm phức tạp hơn)'],
        answerIndex: 0,
        explanation: 'Đoạn văn phân tích: "提升了社会交易的效率，缩短了排队等候的时间，还从源头上减少了假币流通和现金被盗的风险".'
      },
      {
        question: '为了照顾不熟悉智能手机的老年人，社会采取了什么措施？ (Để chăm lo người cao tuổi không thạo smartphone, xã hội đã làm gì?)',
        options: ['禁止老年人出门 (Cấm người già ra đường)', '保留人工现金通道 (Duy trì quầy phục vụ tiền mặt truyền thống)', '取消所有移动支付 (Hủy bỏ mọi thanh toán di động)', '强迫老年人购买最新款手机 (Ép người già mua smartphone mới nhất)'],
        answerIndex: 1,
        explanation: 'Bài viết nêu rõ: "许多公共服务窗口和商户依然保留了人工现金通道，以确保每个人都能享受到社会的温度与便利".'
      }
    ]
  },
  {
    id: 'gr-404',
    level: 'HSK 4',
    titleZh: '职场新人的沟通智慧与团队协作',
    titleVi: 'Trí tuệ giao tiếp và phối hợp nhóm của người mới đi làm',
    topic: 'Công sở & Kỹ năng',
    readTimeMinutes: 5,
    wordCount: 320,
    contentZh: `走出大学校门迈入职场，面对崭新的工作环境与人际关系，许多职场新人都难免会产生迷茫与焦虑。其实，在现代企业中，除了扎实的专业能力之外，良好的沟通态度和团队协作意识往往起着决定性的作用。
首先，积极倾听是有效沟通的前提。在接受领导安排任务或听取同事建议时，应当认真记录要点，遇到不明确的地方及时礼貌地确认，避免因主观臆断而导致工作方向出现偏差。
其次，善于汇报工作进度同样至关重要。定期向团队同步阶段性成果与遇到的困难，既体现了高度的责任心，也能争取到及时的团队资源支持。
最后，团队协作讲究“取长补短”。每个人都有自己的专长与局限，懂得虚心向经验丰富的同事请教，同时在他人需要帮助时主动伸出援手，才能在团队中建立起牢固的信任基石。
保持终身学习的谦逊心态，把每一次挑战当作自我提升的契机，是职场新人稳步成长的必由之路。`,
    translationVi: `Rời khỏi cổng trường đại học bước chân vào chốn công sở, đối diện với môi trường làm việc và các mối quan hệ nhân sự hoàn toàn mới, nhiều người mới đi làm khó tránh khỏi cảm giác hoang mang và lo âu. Thực ra, trong các doanh nghiệp hiện đại, bên cạnh năng lực chuyên môn vững vàng, thái độ giao tiếp chuẩn mực và ý thức phối hợp nhóm thường đóng vai trò mang tính quyết định.
Trước hết, tích cực lắng nghe là tiền đề của giao tiếp hiệu quả. Khi tiếp nhận nhiệm vụ do cấp trên giao phó hoặc lắng nghe ý kiến của đồng nghiệp, cần ghi chép cẩn thận các điểm mấu chốt, khi gặp chỗ chưa rõ ràng phải kịp thời xác nhận lại một cách lịch sự, tránh vì phán đoán chủ quan mà khiến phương hướng công việc bị lệch lạc.
Thứ hai, chủ động báo cáo tiến độ công việc cũng quan trọng không kém. Định kỳ đồng bộ thành quả từng giai đoạn và những khó khăn gặp phải với tập thể, vừa thể hiện tinh thần trách nhiệm cao, vừa tranh thủ được sự hỗ trợ tài nguyên kịp thời từ đội ngũ.
Sau cùng, làm việc nhóm đòi hỏi sự "bổ khuyết điểm yếu, phát huy điểm mạnh". Mỗi người đều có thế mạnh và giới hạn riêng, biết khiêm tốn học hỏi từ các đồng nghiệp giàu kinh nghiệm, đồng thời chủ động đưa tay giúp đỡ khi người khác cần, mới có thể xây dựng nền móng tin cậy vững chắc trong tập thể.
Giữ vững tâm thái khiêm tốn học hỏi trọn đời, coi mỗi thách thức là cơ hội tự hoàn thiện, chính là con đường tất yếu để người mới đi làm trưởng thành vững chắc.`,
    vocabularyHighlights: [
      { hanzi: '沟通', pinyin: 'gōutōng', hanviet: 'Câu thông', meaning: 'Giao tiếp, trao đổi' },
      { hanzi: '协作', pinyin: 'xiézuò', hanviet: 'Hiệp tác', meaning: 'Hợp tác, phối hợp' },
      { hanzi: '取长补短', pinyin: 'qǔcháng-bǔduǎn', hanviet: 'Thủ trường bổ đoản', meaning: 'Lấy sở trường bù đắp sở đoản' },
      { hanzi: '谦逊', pinyin: 'qiānxùn', hanviet: 'Khiêm tốn', meaning: 'Khiêm nhường, lễ độ' }
    ],
    questions: [
      {
        question: '有效沟通的首要前提是什么？ (Tiền đề quan trọng đầu tiên của giao tiếp hiệu quả là gì?)',
        options: ['积极倾听并及时确认要点 (Tích cực lắng nghe và kịp thời xác nhận điểm mấu chốt)', '只管自己说话，不听别人 (Chỉ nói phần mình, không nghe người khác)', '尽量不与同事交流 (Hạn chế tối đa tiếp xúc với đồng nghiệp)', '任何事情都自己做决定 (Mọi việc đều tự ý quyết định)'],
        answerIndex: 0,
        explanation: 'Bài viết khẳng định: "积极倾听是有效沟通的前提……应当认真记录要点，遇到不明确的地方及时礼貌地确认".'
      },
      {
        question: '文中提到的“取长补短”在团队中体现为？ (Thành ngữ "thủ trường bổ đoản" được thể hiện như thế nào trong đội nhóm?)',
        options: ['互相指责对方的缺点 (Chỉ trích khuyết điểm của nhau)', '虚心请教并主动协助他人，建立信任 (Khiêm tốn học hỏi và chủ động hỗ trợ người khác để xây dựng niềm tin)', '各自独立完成所有工作 (Ai làm việc nấy độc lập)', '隐藏自己的真实能力 (Che giấu năng lực thật)'],
        answerIndex: 1,
        explanation: 'Trong bài có câu: "懂得虚心向经验丰富的同事请教，同时在他人需要帮助时主动伸出援手，才能在团队中建立起牢固的信任基石".'
      }
    ]
  },

  // --- HSK 5 (Bổ sung 2 bài) ---
  {
    id: 'gr-503',
    level: 'HSK 5',
    titleZh: '“共享经济”的崛起、重塑与反思',
    titleVi: 'Sự trỗi dậy, tái cấu trúc và phản tư về kinh tế chia sẻ',
    topic: 'Kinh tế & Xã hội',
    readTimeMinutes: 6,
    wordCount: 380,
    contentZh: `在过去十年间，“共享经济”犹如一股席卷全球的飓风，借助移动互联网的平台算法与大数据调度，深刻重塑了人们的出行、住宿、办公乃至日常消费模式。从街头随处可见的共享单车，到处处可见的共享充电宝与联合办公空间，闲置资源的整合与共享极大地降低了个人持有资产的边际成本，践行了集约利用资源的绿色低碳理念。
然而，在经历资本疯狂追捧与野蛮生长的狂潮之后，共享经济的弊端也随之暴露。盲目投放过量单车导致城市公共空间被严重侵占，用户押金难退与平台破产倒闭频发，甚至在某些领域出现了“以共享之名行租赁之实”的价格垄断与大数据杀熟现象。
面对行业阵痛，监管部门相继出台了系列规范政策，推动共享经济从粗放式扩张转向高质量精细化运营。
实践证明，共享经济的生命力不在于资本炒作的虚假繁荣，而在于能否真正解决社会痛点、提升公共福祉，并在商业利润与社会公共利益之间构筑长久平衡的良性生态。`,
    translationVi: `Trong suốt một thập kỷ qua, "kinh tế chia sẻ" tựa như một cơn bão quét qua toàn cầu, nhờ vào thuật toán nền tảng của internet di động và năng lực điều phối dữ liệu lớn, đã tái định hình sâu sắc mô hình đi lại, lưu trú, văn phòng làm việc cho đến tiêu dùng hàng ngày của con người. Từ những chiếc xe đạp chia sẻ có thể bắt gặp ở bất cứ góc phố nào, cho tới sạc pin chia sẻ và không gian làm việc chung (co-working space), việc tích hợp và chia sẻ tài nguyên nhàn rỗi đã giảm thiểu đáng kể chi phí cận biên của việc sở hữu tài sản cá nhân, thực thi triết lý xanh giảm phát thải carbon thông qua sử dụng tập trung tài nguyên.
Tuy nhiên, sau khi trải qua làn sóng săn đón cuồng nhiệt của các dòng vốn đầu tư và sự tăng trưởng hoang dã tự phát, những mặt trái bất cập của kinh tế chia sẻ cũng dần lộ diện. Việc thả trôi xe đạp ồ ạt quá mức dẫn tới không gian công cộng đô thị bị xâm lấn nghiêm trọng, tình trạng người dùng khó đòi lại tiền đặt cọc và các nền tảng tuyên bố phá sản xảy ra liên miên, thậm chí ở một vài lĩnh vực đã xuất hiện hiện tượng độc quyền giá cả và phân biệt giá bằng thuật toán (big data price discrimination) "dưới danh nghĩa chia sẻ nhưng thực chất là kinh doanh cho thuê".
Đối diện với những cơn đau đớn chuyển mình của ngành, các cơ quan giám sát đã liên tục ban hành hàng loạt chính sách quy chuẩn, thúc đẩy kinh tế chia sẻ chuyển hướng từ mở rộng quy mô thô thiển sang vận hành tinh gọn chất lượng cao.
Thực tiễn chứng minh rằng, sức sống đích thực của kinh tế chia sẻ không nằm ở sự phồn vinh ảo tưởng được thổi phồng bởi dòng vốn đầu cơ, mà nằm ở việc liệu có thể giải quyết thực chất các vấn đề nhức nhối của xã hội, nâng cao phúc lợi chung và kiến tạo một hệ sinh thái lành mạnh cân bằng lâu dài giữa lợi nhuận kinh doanh và lợi ích công cộng xã hội.`,
    vocabularyHighlights: [
      { hanzi: '边际成本', pinyin: 'biānjì chéngběn', hanviet: 'Biên tế thành bản', meaning: 'Chi phí cận biên (Marginal cost)' },
      { hanzi: '野蛮生长', pinyin: 'yěmán shēngzhǎng', hanviet: 'Dã manh sinh trưởng', meaning: 'Tăng trưởng hoang dã, tự phát thiếu kiểm soát' },
      { hanzi: '大数据杀熟', pinyin: 'dàshùjù shāshú', hanviet: 'Đại số tự sát thục', meaning: 'Phân biệt giá đối với khách hàng quen dựa vào Big Data' },
      { hanzi: '良性生态', pinyin: 'liángxìng shēngtài', hanviet: 'Lương tính sinh thái', meaning: 'Hệ sinh thái lành mạnh, bền vững' }
    ],
    questions: [
      {
        question: '“共享经济”最初展现的核心价值体现在哪里？ (Giá trị cốt lõi ban đầu của kinh tế chia sẻ thể hiện ở đâu?)',
        options: ['盘活闲置资源，降低边际成本，践行低碳集约理念 (Tận dụng tài nguyên nhàn rỗi, giảm chi phí cận biên, thực thi lối sống xanh)', '完全替代所有传统制造业 (Thay thế toàn bộ ngành chế tạo truyền thống)', '消除市场中的一切商业竞争 (Xóa bỏ mọi cạnh tranh thương mại)', '让所有人都不需要工作 (Khiến mọi người không cần đi làm)'],
        answerIndex: 0,
        explanation: 'Đoạn 1 nêu: "闲置资源的整合与共享极大地降低了个人持有资产的边际成本，践行了集约利用资源的绿色低碳理念".'
      },
      {
        question: '共享经济未来实现长远健康发展的关键是什么？ (Chìa khóa để kinh tế chia sẻ phát triển lành mạnh dài lâu là gì?)',
        options: ['继续进行无节制的资本盲目扩张 (Tiếp tục mở rộng vốn mù quáng)', '在商业盈利与社会公共利益之间构筑长久平衡 (Kiến tạo sự cân bằng lâu dài giữa lợi nhuận kinh doanh và lợi ích công cộng)', '彻底关闭所有共享平台 (Đóng cửa toàn bộ nền tảng chia sẻ)', '完全取消政府的监管与引导 (Xóa bỏ hoàn toàn sự giám sát của chính phủ)'],
        answerIndex: 1,
        explanation: 'Đoạn kết luận: "能否真正解决社会痛点、提升公共福祉，并在商业利润与社会公共利益之间构筑长久平衡的良性生态".'
      }
    ]
  },
  {
    id: 'gr-504',
    level: 'HSK 5',
    titleZh: '传统非遗手工艺在数字时代的现代新生',
    titleVi: 'Sức sống mới của di sản thủ công phi vật thể trong kỷ nguyên số',
    topic: 'Nghệ thuật & Di sản',
    readTimeMinutes: 6,
    wordCount: 395,
    contentZh: `中国非物质文化遗产凝聚了中华民族数千年来的匠人智慧与审美意趣。然而，随着流水线工业生产与现代生活节奏的冲击，诸如苏绣、景泰蓝、古法造纸以及皮影戏等传统手工艺，曾一度面临技艺断代、后继乏人以及市场萎缩的濒危困境。
令人振奋的是，互联网数字技术的普及为这些古老技艺的传承开辟了崭新的生机。年轻一代的非遗传承人打破了“酒香不怕巷子深”的守旧思维，巧妙利用短视频平台与沉浸式直播，将一件件工艺品从选材、雕琢到成型的细腻全过程原汁原味地呈现给全球受众。
繁复的工序与精益求精的工匠精神，在数字镜头下焕发出令人叹为观止的艺术震撼力。
此外，非遗文创产品更与现代潮流设计紧密结合，推出了一系列深受年轻人追捧的“国潮”联名周边与虚拟数字藏品。
这种“活态传承”不仅让古老的非遗技艺摆脱了作为博物馆冷清展品的命运，更使其以鲜活自信的姿态重新融入了当代公众的生活日常。`,
    translationVi: `Di sản văn hóa phi vật thể của Trung Quốc kết tinh trí tuệ của bao thế hệ nghệ nhân bậc thầy và gu thẩm mỹ tao nhã suốt hàng nghìn năm của dân tộc. Tuy nhiên, trước sức ép của dây chuyền sản xuất công nghiệp hàng loạt và nhịp sống hiện đại hối hả, các môn thủ công truyền thống như thêu Tô Châu, tráng men Cảnh Thái Lam, làm giấy thủ công cổ truyền và nghệ thuật múa rối bóng từng có thời điểm đối mặt với tình cảnh ngặt nghèo đứt gãy truyền thừa, thiếu hụt người kế nghiệp và thị trường bị thu hẹp teo tóp.
Điều đáng mừng là, sự phổ biến của công nghệ kỹ thuật số trên Internet đã mở ra một sức sống hoàn toàn mới cho sự bảo tồn tiếp nối của các ngón nghề cổ xưa này. Thế hệ kế thừa trẻ tuổi đã phá vỡ tư duy bảo thủ "rượu thơm chẳng ngại ngõ sâu", khéo léo vận dụng các nền tảng video ngắn và phát sóng trực tiếp (livestream) tương tác sống động, mang toàn bộ quá trình tinh xảo từ khâu tuyển chọn nguyên liệu, chạm khắc cho tới khi hoàn thiện một tác phẩm nghệ thuật giới thiệu nguyên vẹn tới khán giả toàn cầu.
Những công đoạn phức tạp cùng tinh thần nghệ nhân tỉ mỉ cầu toàn, dưới ống kính kỹ thuật số đã toát lên sức rung động nghệ thuật khiến người xem phải trầm trồ thán phục.
Thêm vào đó, các sản phẩm sáng tạo văn hóa di sản phi vật thể còn kết hợp chặt chẽ với các thiết kế trào lưu hiện đại, cho ra mắt hàng loạt ấn phẩm "Quốc triều" (Guochao) liên kết thương hiệu và bộ sưu tập kỹ thuật số ảo được giới trẻ săn đón nồng nhiệt.
Mô hình "bảo tồn sống động" này không chỉ giúp các ngón nghề di sản phi vật thể cổ xưa thoát khỏi số phận nằm im lìm thành hiện vật lạnh lẽo nơi viện bảo tàng, mà còn giúp chúng trở lại hòa nhập vào đời sống sinh hoạt thường nhật của công chúng đương đại bằng tư thái tràn đầy sức sống và tự tin.`,
    vocabularyHighlights: [
      { hanzi: '非物质文化遗产', pinyin: 'fēiwùzhì wénhuà yíchǎn', hanviet: 'Phi vật chất văn hóa di sản', meaning: 'Di sản văn hóa phi vật thể (Intangible cultural heritage)' },
      { hanzi: '工匠精神', pinyin: 'gōngjiàng jīngshén', hanviet: 'Công tượng tinh thần', meaning: 'Tinh thần nghệ nhân tỉ mỉ, cầu toàn' },
      { hanzi: '叹为观止', pinyin: 'tànwéiguānzhǐ', hanviet: 'Thán vi quan chỉ', meaning: 'Khen ngợi hết lời, trầm trồ thán phục' },
      { hanzi: '活态传承', pinyin: 'huótài chuánchéng', hanviet: 'Hoạt thái truyền thừa', meaning: 'Kế thừa và bảo tồn sống động trong đời thực' }
    ],
    questions: [
      {
        question: '年轻一代传承人如何利用互联网技术让传统非遗走出困境？ (Thế hệ kế thừa trẻ tuổi đã dùng công nghệ internet như thế nào để giúp di sản thoát khó khăn?)',
        options: ['利用短视频与直播呈现精湛制作工序，结合国潮设计 (Dùng video ngắn, livestream quay công đoạn chế tác tinh xảo và phối hợp thiết kế Guochao)', '放弃所有手工技艺，全部改为机器生产 (Bỏ hết thủ công, chuyển sang máy móc 100%)', '提高价格让普通人买不起 (Tăng giá thật cao để người thường không mua được)', '拒绝让大众了解非遗的秘密 (Từ chối cho công chúng biết bí quyết di sản)'],
        answerIndex: 0,
        explanation: 'Bài viết nêu: "年轻一代的非遗传承人……巧妙利用短视频平台与沉浸式直播，将一件件工艺品从选材、雕琢到成型的细腻全过程原汁原味地呈现给全球受众……非遗文创产品更与现代潮流设计紧密结合".'
      },
      {
        question: '“活态传承”的深远意义在于？ (Ý nghĩa sâu xa của mô hình "bảo tồn sống động" là gì?)',
        options: ['把文物锁在地下室 (Khóa cổ vật trong tầng hầm)', '让非遗脱离冷清展品命运，以鲜活姿态融入现代日常生活 (Giúp di sản thoát cảnh hiện vật lạnh lẽo, hòa nhập vào đời sống hàng ngày một cách sống động)', '只允许少数专家研究 (Chỉ cho phép vài chuyên gia nghiên cứu)', '让传统手艺彻底成为历史 (Để thủ công truyền thống hoàn toàn thành dĩ vãng)'],
        answerIndex: 1,
        explanation: 'Đoạn kết nhấn mạnh: "不仅让古老的非遗技艺摆脱了作为博物馆冷清展品的命运，更使其以鲜活自信的姿态重新融入了当代公众的生活日常".'
      }
    ]
  },

  // --- HSK 6 (Bổ sung 2 bài) ---
  {
    id: 'gr-603',
    level: 'HSK 6',
    titleZh: '庄子《逍遥游》的精神自由境界与现代人焦虑解药',
    titleVi: 'Cảnh giới tự do tinh thần trong Tiêu Dao Du của Trang Tử và phương thuốc cho âu lo hiện đại',
    topic: 'Triết học cổ điển & Tâm lý',
    readTimeMinutes: 7,
    wordCount: 460,
    contentZh: `战国哲人庄周所开创之庄子哲学，以其奇诡跌宕的浪漫寓言与洞烛幽微的辨证思辨，为中华精神世界注入了最富诗意与超越性的自由灵魂。《庄子·内篇》开宗明义之《逍遥游》，借由“北冥有鱼，其名为鲲……化而为鸟，其名为鹏”的宏阔意象，展开了一场关于生命何以摆脱现实羁绊、抵达绝对自由之境的心灵求索。
庄子深刻地洞察到，世人之所以终日营营役役、焦虑不堪，根源在于主体心灵深陷于世俗功名、利禄、是非、物欲等外在条件的沉重“有待”之中。无论是列子御风而行的轻巧，亦或蜩与学鸠对大鹏南溟之举的嘲弄，皆未能脱离对外部特定环境与物质依托的执念束缚。
唯有破除以自我为中心的逼仄成见，做到“至人无己，神人无功，圣人无名”，方能超脱相对价值之樊篱，乘天地之正，御六气之辩，游于无穷之境。
置身于当下高度内卷、功利浮躁与技术异化的现代工业社会，人们被海量碎片化信息与无休止的竞争指标所裹挟，精神内耗与异化感空前加剧。
重读庄子，并非倡导不负责任的消极遁世与虚无放弃，而是启示我们应当在喧嚣尘世中保有心斋虚静的精神退守空间。
当我们能够以超拔物外的大格局俯瞰得失荣辱，便能在心灵深处构筑起一座风雨不动的定力之舟，安顿好那颗在数字洪流中颠簸流离的心灵。`,
    translationVi: `Triết học Trang Tử do triết nhân thời Chiến Quốc Trang Chu khởi xướng, bằng những câu chuyện ngụ ngôn lãng mạn bay bổng kỳ ảo cùng tư duy biện chứng soi tỏ cội nguồn sâu thẳm, đã thổi vào thế giới tinh thần Trung Hoa một linh hồn tự do đậm chất thi ca và siêu việt nhất. Tác phẩm "Tiêu Dao Du" mở đầu thiên Nội Thiên của sách "Trang Tử", mượn hình tượng kỳ vĩ bao la "Biển Bắc có con cá, tên nó là Côn... hóa thành loài chim, tên gọi là Bằng", mở ra một cuộc kiếm tìm nơi cõi lòng về việc sinh mệnh làm sao để thoát khỏi xiềng xích ràng buộc của hiện thực để chạm tới cảnh giới tự do tuyệt đối.
Trang Tử nhìn thấu một cách sâu sắc rằng, sở dĩ con người thế gian suốt ngày tất bật bươn chải nhọc nhằn, ngập tràn trong âu lo sợ hãi, căn nguyên là bởi tâm khảm của chủ thể đã lún sâu vào sự "hữu đãi" (lệ thuộc có điều kiện) nặng nề đối với công danh, phú quý, thị phi và dục vọng vật chất thế tục bên ngoài. Cho dẫu là sự bay bổng nhẹ nhàng cưỡi gió của Liệt Tử, hay tiếng cười giễu cợt của ve sầu và chim cưu trước chuyến bay vượt biển phương Nam nghìn dặm của chim Bằng, thảy đều chưa thể thoát ly khỏi sự ràng buộc chấp niệm vào môi trường đặc thù và chỗ dựa vật chất bên ngoài.
Chỉ khi nào phá vỡ được những thành kiến hạn hẹp hẹp hòi lấy cái tôi làm trung tâm, đạt tới cảnh giới "Chí nhân vô kỷ, Thần nhân vô công, Thánh nhân vô danh" (Bậc chí nhân không chấp vào cái tôi bản ngã, bậc thần nhân không màng chiến công hiển hách, bậc thánh nhân không màng danh tiếng lưu truyền), mới có thể siêu thoát khỏi hàng rào giá trị tương đối, cưỡi lên sự chính đạo của trời đất, điều khiển sự biến hóa của lục khí vũ trụ, thảnh thơi du ngoạn giữa chốn vô cùng vô tận.
Đắm chìm giữa một xã hội công nghiệp hiện đại cạnh tranh khốc liệt (nội quyển), thực dụng nông nổi và tha hóa bởi công nghệ như ngày nay, con người bị cuốn phăng bởi lượng thông tin vỡ vụn khổng lồ và các chỉ số cạnh tranh không hồi kết, sự tiêu hao nội tâm và cảm giác tha hóa chưa từng có tăng cao tột độ.
Đọc lại Trang Tử, tuyệt nhiên chẳng phải cổ súy cho thái độ trốn đời yếm thế tiêu cực hay buông xuôi vô trách nhiệm, mà là thức tỉnh soi sáng cho chúng ta biết giữ lại cho mình một khoảng trời tĩnh tại "Tâm trai hư tĩnh" (lòng thanh tịnh trống không) nơi chốn trần ai náo nhiệt.
Khi chúng ta có thể phóng tầm mắt từ một đại cục cao rộng siêu thoát ngoại vật để cúi nhìn mọi được mất vinh nhục phù du, ta mới có thể kiến tạo nơi sâu thẳm tâm hồn một con thuyền định lực bất chuyển trước mưa sa gió giật, vỗ về an định được trái tim đang trôi dạt chao đảo giữa dòng lũ cuộn trào của thời đại số.`,
    vocabularyHighlights: [
      { hanzi: '逍遥游', pinyin: 'xiāoyáoyóu', hanviet: 'Tiêu dao du', meaning: 'Du ngoạn tự do tự tại, cảnh giới siêu thoát tuyệt đối' },
      { hanzi: '至人无己', pinyin: 'zhìrén wújǐ', hanviet: 'Chí nhân vô kỷ', meaning: 'Bậc chí nhân buông bỏ mọi chấp niệm vị kỷ về cái tôi' },
      { hanzi: '内卷', pinyin: 'nèijuǎn', hanviet: 'Nội quyển', meaning: 'Sự cạnh tranh khốc liệt triệt tiêu lẫn nhau (Involution)' },
      { hanzi: '精神内耗', pinyin: 'jīngshén nèihào', hanviet: 'Tinh thần nội hao', meaning: 'Sự hao mòn năng lượng tâm lý do dằn vặt lo âu nội tại' }
    ],
    questions: [
      {
        question: '庄子认为世人终日焦虑不堪的深层原因是什么？ (Trang Tử cho rằng nguyên nhân sâu xa khiến con người âu lo khôn nguôi là gì?)',
        options: ['心灵沉溺于功名利禄等外在条件的“有待”与执念中 (Tâm hồn chìm đắm trong sự lệ thuộc có điều kiện "hữu đãi" vào công danh phú quý ngoại tại)', '没有考上好大学 (Không đỗ đại học tốt)', '身体缺乏足够的体育锻炼 (Cơ thể thiếu vận động)', '科技发展太慢 (Khoa học phát triển quá chậm)'],
        answerIndex: 0,
        explanation: 'Đoạn 2 nêu rõ: "根源在于主体心灵深陷于世俗功名、利禄、是非、物欲等外在条件的沉重‘有待’之中……皆未能脱离对外部特定环境与物质依托的执念束缚".'
      },
      {
        question: '在现代社会重读《逍遥游》具有什么积极的现实启示？ (Đọc lại Tiêu Dao Du trong xã hội hiện đại mang lại bài học tích cực nào?)',
        options: ['放弃所有工作彻底隐居山林 (Bỏ hết công việc trốn vào rừng sâu)', '在喧嚣中保有心斋虚静的退守空间，以超拔格局安顿心灵 (Giữ gìn khoảng trời thanh tịnh trong tâm, nhìn nhận cuộc sống bằng đại cục để an định cõi lòng)', '完全否定科学技术与社会进步 (Phủ nhận hoàn toàn khoa học kỹ thuật và tiến bộ xã hội)', '鼓励人们参与更残酷的恶性竞争 (Khuyến khích cạnh tranh tàn nhẫn hơn)'],
        answerIndex: 1,
        explanation: 'Đoạn kết luận: "并非倡导不负责任的消极遁世……而是启示我们应当在喧嚣尘世中保有心斋虚静的精神退守空间。当我们能够以超拔物外的大格局俯瞰得失荣辱，便能在心灵深处构筑起一座风雨不动的定力之舟".'
      }
    ]
  },
  {
    id: 'gr-604',
    level: 'HSK 6',
    titleZh: '脑机接口、合成生物学与人类意识边界的哲学追问',
    titleVi: 'Giao diện não - máy, sinh học tổng hợp và truy vấn triết học về ranh giới ý thức loài người',
    topic: 'Khoa học tiên phong & Đạo đức công nghệ',
    readTimeMinutes: 8,
    wordCount: 475,
    contentZh: `步入二十一世纪第三个十年，以侵入式脑机接口、神经调控芯片、基因编辑与合成生物学为代表的前沿颠覆性科技，正以前所未有的加速度跨越基础理论研究的门槛，全面向临床医疗应用乃至人机融合演进。
当微型电极阵列能够直接转译人类大脑皮层的神经电信号并实现跨设备意念交互，当生物合成技术能够人工重组生命遗传密码乃至人造多细胞器官，人类正无可逆转地站立在重塑自身生物学躯体与认知范式的临界奇点之上。
科技赋能赋予了人类攻克帕金森病、高位截瘫、渐冻症等神经退行性绝症的磅礴曙光，然而其内蕴的哲学悖论与伦理风险亦如悬顶之达摩克利斯之剑。
当硅基算法算力深度介入人类的思维加工与记忆存储，人类主体性意识的本体论边界究竟在何处？由意识上传与记忆修改所衍生出的“我还是不是我”的同一性困境，将彻底动摇人类沿袭数千年的自我认同基石。
更为严峻的是，生物技术与算力资源的阶层化垄断，恐将把传统的社会贫富差距固化并放大为生物物种层面的“基因鸿沟”与“认知特权”。
面对狂飙突进的科学狂想，人类文明亟须构建具有全球普遍约束力的科技伦理宪章与法治防火墙。
科学旨在探索“能够做什么”，而人文哲学则必须坚守“应当做什么”的终极良知底线，确保科技伟力始终航行在增进全人类共同福祉的向善航道之中。`,
    translationVi: `Bước vào thập niên thứ ba của thế kỷ hai mươi mốt, các công nghệ mang tính đột phá mang tính cách mạng đại diện bởi giao diện não - máy (BCI) xâm lấn, chip điều hòa thần kinh, chỉnh sửa gen và sinh học tổng hợp, đang vượt qua ngưỡng cửa nghiên cứu lý thuyết cơ bản với gia tốc chưa từng thấy, tiến thẳng tới ứng dụng y tế lâm sàng và thậm chí là sự tiến hóa hợp nhất giữa con người và máy móc.
Khi các cụm vi điện cực có thể trực tiếp giải mã tín hiệu điện thần kinh trên vỏ não người để thực hiện tương tác ý nghĩ xuyên thiết bị, khi công nghệ sinh học tổng hợp có thể tái cấu trúc mã di truyền sinh mệnh nhân tạo cho tới tạo lập các cơ quan đa tế bào nhân tạo, nhân loại đang đứng trước một điểm kỳ dị (singularity) không thể đảo ngược trong việc tái cấu trúc cơ thể sinh học và hệ hình nhận thức của chính mình.
Sự trao quyền của khoa học công nghệ mang lại ánh rạng đông rực rỡ để nhân loại chinh phục các căn bệnh thoái hóa thần kinh nan y như bệnh Parkinson, liệt tứ chi, xơ cứng teo cơ một bên (ALS), thế nhưng nghịch lý triết học và rủi ro đạo đức tiềm ẩn trong đó cũng tựa như thanh gươm Damocles treo lơ lửng trên đầu.
Khi sức mạnh tính toán của thuật toán nền tảng silicon can thiệp sâu sắc vào quá trình xử lý tư duy và lưu trữ ký ức của con người, thì ranh giới bản thể luận của ý thức chủ thể con người rốt cuộc sẽ nằm ở đâu? Khủng hoảng về tính đồng nhất bản ngã (identity crisis) bắt nguồn từ việc tải ý thức lên đám mây và chỉnh sửa ký ức: "Ta có còn là chính ta hay không?", sẽ làm lung lay triệt để nền tảng nhận thức bản ngã mà con người đã kế thừa qua hàng thiên niên kỷ.
Nghiêm trọng hơn nữa, sự độc quyền hóa theo giai tầng đối với công nghệ sinh học và tài nguyên tính toán rất có nguy cơ sẽ biến hố sâu ngăn cách giàu nghèo xã hội truyền thống thành một "hố sâu gen" và "đặc quyền nhận thức" mang tính giống loài sinh học.
Đối diện với những cuồng vọng khoa học đang lao nhanh như vũ bão, văn minh nhân loại cấp thiết phải xây dựng một bản hiến chương đạo đức công nghệ và bức tường lửa pháp lý có tính ràng buộc phổ quát toàn cầu.
Khoa học nhằm khám phá "có thể làm được những gì", trong khi triết học nhân văn bắt buộc phải kiên định giữ vững lằn ranh lương tri tối thượng "nên làm những gì", đảm bảo sức mạnh vĩ đại của công nghệ luôn được định hướng di chuyển trên hải trình hướng thiện nhằm nâng cao phúc lợi chung của toàn thể nhân loại.`,
    vocabularyHighlights: [
      { hanzi: '脑机接口', pinyin: 'nǎojī jiēkǒu', hanviet: 'Não cơ tiếp khẩu', meaning: 'Giao diện não - máy (Brain-Computer Interface - BCI)' },
      { hanzi: '同一性困境', pinyin: 'tóngyīxìng kùnjìng', hanviet: 'Đồng nhất tính khốn cảnh', meaning: 'Nghịch lý đồng nhất bản ngã triết học (Identity dilemma)' },
      { hanzi: '达摩克利斯之剑', pinyin: 'dámókèlìsī zhī jiàn', hanviet: 'Đạt ma khắc lợi tư chi kiếm', meaning: 'Thanh kiếm Damocles (Hiểm họa ngầm treo lơ lửng)' },
      { hanzi: '科技向善', pinyin: 'kējì xiàngshàn', hanviet: 'Khoa kỹ hướng thiện', meaning: 'Công nghệ phục vụ điều thiện và phúc lợi con người (Tech for Good)' }
    ],
    questions: [
      {
        question: '前沿脑机接口与神经技术在哲学伦理上面临的最深刻挑战是什么？ (Thách thức triết học đạo đức sâu sắc nhất của giao diện não máy là gì?)',
        options: ['动摇人类主体意识边界与“同一性”自我认同，以及可能加剧生物学阶层不平等 (Làm lung lay ranh giới ý thức chủ thể, khủng hoảng bản ngã và nguy cơ bất bình đẳng sinh học)', '制造芯片成本太低 (Chi phí sản xuất chip quá rẻ)', '无法治疗任何疾病 (Không chữa được bệnh gì)', '计算机运行速度变慢 (Tốc độ máy tính bị chậm đi)'],
        answerIndex: 0,
        explanation: 'Đoạn 4 & 5 nêu rõ: "动摇人类沿袭数千年的自我认同基石……恐将把传统的社会贫富差距固化并放大为生物物种层面的‘基因鸿沟’与‘认知特权’".'
      },
      {
        question: '文中提出人文哲学在面对科技狂飙时必须坚守的底线是？ (Triết học nhân văn bắt buộc phải kiên định giữ vững lằn ranh nào?)',
        options: ['全面阻挠所有科学实验 (Ngăn chặn toàn bộ thí nghiệm khoa học)', '坚守“应当做什么”的终极良知底线，确保科技向善 (Giữ vững lằn ranh lương tri "nên làm gì", bảo đảm công nghệ hướng thiện vì con người)', '任由资本自由无序发展 (Mặc kệ tư bản tự do bành trướng)', '放弃一切道德法律约束 (Từ bỏ mọi quy chuẩn đạo đức luật pháp)'],
        answerIndex: 1,
        explanation: 'Đoạn kết luận khẳng định: "科学旨在探索‘能够做什么’，而人文哲学则必须坚守‘应当做什么’的终极良知底线，确保科技伟力始终航行在增进全人类共同福祉的向善航道之中".'
      }
    ]
  }
];

export function getGradedReadersByLevel(level = 'all') {
  if (!level || level === 'all') return GRADED_READERS_DATA;
  return GRADED_READERS_DATA.filter(item => item.level === level);
}

export function getGradedReaderById(id) {
  return GRADED_READERS_DATA.find(item => item.id === id) || null;
}

export function getGradedReadersByTopic(topic = 'all') {
  if (!topic || topic === 'all') return GRADED_READERS_DATA;
  return GRADED_READERS_DATA.filter(item => item.topic === topic);
}

export function getAllReaderTopics() {
  const topics = new Set();
  GRADED_READERS_DATA.forEach(r => {
    if (r.topic) topics.add(r.topic);
  });
  return Array.from(topics);
}
