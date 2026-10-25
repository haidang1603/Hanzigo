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
  }
];

export function getGradedReadersByLevel(level = 'all') {
  if (!level || level === 'all') return GRADED_READERS_DATA;
  return GRADED_READERS_DATA.filter(item => item.level === level);
}

export function getGradedReaderById(id) {
  return GRADED_READERS_DATA.find(item => item.id === id) || null;
}
