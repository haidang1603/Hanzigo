# -*- coding: utf-8 -*-
"""
Bosses 5 to 12 Definitions
Mapped to Modules 2.1 - 3.4
"""

BOSSES_5_TO_12 = [
  # --- BOSS 5: Module 2.1 ---
  {
    "id": "boss-ch-5",
    "chapterId": "ch-5",
    "title": "Bác Tài Lão Luyện: Bắt Taxi & Chỉ Đường Phố Cổ",
    "chineseTitle": "老北京的士问路与出行大考验",
    "bossName": "Bác tài Lão Lý (李师傅) — Tài xế Taxi Phố Cổ Bắc Kinh",
    "bossAvatar": "🚕",
    "scenario": "Bạn cần bắt taxi đi từ khách sạn tới ga tàu điện ngầm để kịp giờ hẹn. Bạn phải chỉ đường, hỏi thời gian và trao đổi lộ trình bằng tiếng Trung bản xứ!",
    "xpReward": 200,
    "requiredScoreToPass": 80,
    "stages": [
      {
        "stageNumber": 1,
        "bossDialogue": "小同志，上车！请问你要去哪儿？",
        "bossPinyin": "Xiǎo tóngzhì, shàngchē! Qǐngwèn nǐ yào qù nǎr?",
        "bossMeaning": "Đồng chí nhỏ ơi lên xe! Xin hỏi cháu muốn đi đâu?",
        "prompt": "Chào bác tài và nói rõ điểm đến:",
        "options": [
          { "text": "师傅您好！我去西单地铁站，请问大概需要多长时间？", "pinyin": "Shīfu nín hǎo! Wǒ qù Xīdān dìtiězhàn, qǐngwèn dàgài xūyào duō cháng shíjiān?", "isCorrect": True, "score": 25, "feedback": "Xưng hô 师傅 cực kỳ thân thiện và hỏi thời gian chuẩn xác!" },
          { "text": "我骑自行车。", "pinyin": "Wǒ qí zìxíngchē.", "isCorrect": False, "score": 0, "feedback": "Đang ngồi trên taxi mà lại bảo đi xe đạp." },
          { "text": "这里是哪里？", "pinyin": "Zhèlǐ shì nǎlǐ?", "isCorrect": False, "score": 0, "feedback": "Chưa nói điểm đến cho bác tài." }
        ]
      },
      {
        "stageNumber": 2,
        "bossDialogue": "现在差十分八点，路上有点儿堵，大概需要二十分钟。西单地铁站离这里有五公里呢！",
        "bossPinyin": "Xiànzài chà shí fēn bā diǎn, lùshang yǒudiǎnr dǔ, dàgài xūyào èrshí fēnzhōng. Xīdān dìtiězhàn lí zhèlǐ yǒu wǔ gōnglǐ ne!",
        "bossMeaning": "Bây giờ 8 giờ kém 10, trên đường hơi kẹt, khoảng 20 phút tới. Ga Tây Đơn cách đây 5 km đấy!",
        "prompt": "Nói bạn có cuộc hẹn lúc 8 giờ rưỡi nên nhờ bác tài đi nhanh một chút:",
        "options": [
          { "text": "师傅，我八点半在地铁站有约会，麻烦您开快一点儿，谢谢！", "pinyin": "Shīfu, wǒ bā diǎn bàn zài dìtiězhàn yǒu yuēhuì, máfan nín kāi kuài yìdiǎnr, xièxie!", "isCorrect": True, "score": 25, "feedback": "Diễn đạt giờ giấc và nhờ vả lịch sự 10 điểm!" },
          { "text": "我不去了。", "pinyin": "Wǒ bú qù le.", "isCorrect": False, "score": 0, "feedback": "Hủy chuyến giữa đường là không nên nhé." },
          { "text": "昨天星期天。", "pinyin": "Zuótiān xīngqītiān.", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      },
      {
        "stageNumber": 3,
        "bossDialogue": "前面快到路口了，左拐还是往前走？",
        "bossPinyin": "Qiánmiàn kuài dào lùkǒu le, zuǒ guǎi háishì wǎng qián zǒu?",
        "bossMeaning": "Phía trước sắp đến ngã tư rồi, rẽ trái hay đi thẳng cháu?",
        "prompt": "Chỉ đường: Đến ngã rẽ đèn xanh đỏ thì rẽ phải:",
        "options": [
          { "text": "师傅，到前面的红绿灯路口往右拐，然后往前走两百米。", "pinyin": "Shīfu, dào qiánmiàn de hónglǜdēng lùkǒu wǎng yòu guǎi, ránhòu wǎng qián zǒu liǎng bǎi mǐ.", "isCorrect": True, "score": 25, "feedback": "Chỉ đường siêu chuẩn với 往右拐 và 往前走!" },
          { "text": "拐左。", "pinyin": "Guǎi zuǒ.", "isCorrect": False, "score": 5, "feedback": "Phải nói 往左拐 mới đúng ngữ pháp." },
          { "text": "太贵了。", "pinyin": "Tài guì le.", "isCorrect": False, "score": 0, "feedback": "Đang hỏi đường chứ chưa tính tiền." }
        ]
      },
      {
        "stageNumber": 4,
        "bossDialogue": "好嘞，地铁站到了！一共二十五块钱，你拿好发票！",
        "bossPinyin": "Hǎo lei, dìtiězhàn dào le! Yígòng èrshíwǔ kuài qián, nǐ ná hǎo fāpiào!",
        "bossMeaning": "Được rồi, ga tàu điện tới rồi! Tổng cộng 25 tệ, cháu cầm lấy hóa đơn nhé!",
        "prompt": "Cảm ơn và nói bạn quét mã trả tiền:",
        "options": [
          { "text": "谢谢李师傅！正好八点一刻，我扫微信付您二十五块，再见！", "pinyin": "Xièxie Lǐ shīfu! Zhènghǎo bā diǎn yí kè, wǒ sǎo Wēixìn fù nín èrshíwǔ kuài, zàijiàn!", "isCorrect": True, "score": 25, "feedback": "Hoàn hảo 100%! Bạn đã chinh phục trọn vẹn Boss Chapter 5!" },
          { "text": "我没钱。", "pinyin": "Wǒ méi qián.", "isCorrect": False, "score": 0, "feedback": "Đi taxi không trả tiền là vi phạm quy định." },
          { "text": "你叫什么名字？", "pinyin": "Nǐ jiào shénme míngzi?", "isCorrect": False, "score": 0, "feedback": "Đến nơi rồi không cần hỏi tên nữa." }
        ]
      }
    ]
  },

  # --- BOSS 6: Module 2.2 ---
  {
    "id": "boss-ch-6",
    "chapterId": "ch-6",
    "title": "Bếp Trưởng Toàn Tụ Đức: Thử Thách Ẩm Thực & Mặc Cả",
    "chineseTitle": "全聚德烤鸭店与夜市点单大对决",
    "bossName": "Bếp trưởng Vương (王大厨) — Tiệm Vịt Quay Toàn Tụ Đức",
    "bossAvatar": "👨‍🍳",
    "scenario": "Bạn bước vào nhà hàng vịt quay danh tiếng tại Bắc Kinh. Bếp trưởng sẽ kiểm tra khả năng gọi món, yêu cầu khẩu vị và mặc cả mua quà lưu niệm của bạn!",
    "xpReward": 200,
    "requiredScoreToPass": 80,
    "stages": [
      {
        "stageNumber": 1,
        "bossDialogue": "欢迎光临全聚德！您几位？想吃点什么特色菜？",
        "bossPinyin": "Huānyíng guānglín Quánjùdé! Nín jǐ wèi? Xiǎng chī diǎn shénme tèsè cài?",
        "bossMeaning": "Chào mừng đến Toàn Tụ Đức! Quý khách đi mấy người? Muốn ăn món đặc sản gì?",
        "prompt": "Nêu số người và gọi một phần vịt quay Bắc Kinh:",
        "options": [
          { "text": "服务员好，我们两位，请给我们来一份北京烤鸭和一盘饺子！", "pinyin": "Fúwùyuán hǎo, wǒmen liǎng wèi, qǐng gěi wǒmen lái yí fèn Běijīng kǎoyā hé yì pán jiǎozi!", "isCorrect": True, "score": 25, "feedback": "Gọi món cực chuẩn với lượng từ 份 và 盘!" },
          { "text": "我不吃东西。", "pinyin": "Wǒ bù chī dōngxi.", "isCorrect": False, "score": 0, "feedback": "Vào nhà hàng lại bảo không ăn đồ gì." },
          { "text": "两点开会。", "pinyin": "Liǎng diǎn kāihuì.", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      },
      {
        "stageNumber": 2,
        "bossDialogue": "好的！您二位吃不吃辣？有什么口味上的特别要求吗？",
        "bossPinyin": "Hǎo de! Nín èr wèi chī bu chī là? Yǒu shénme kǒuwèi shàng de tèbié yāoqiú ma?",
        "bossMeaning": "Được ạ! Hai vị có ăn cay không? Có yêu cầu khẩu vị đặc biệt gì không ạ?",
        "prompt": "Dặn dò nhà bếp không bỏ ớt và cho ít muối:",
        "options": [
          { "text": "我们不太能吃辣，请不要放辣椒，菜里少放一点儿盐，谢谢！", "pinyin": "Wǒmen bú tài néng chī là, qǐng bú yào fàng làjiāo, cài lǐ shǎo fàng yìdiǎnr yán, xièxie!", "isCorrect": True, "score": 25, "feedback": "Mẫu câu dặn dò khẩu vị 不要放辣椒 và 少放盐 xuất sắc!" },
          { "text": "多放辣椒！", "pinyin": "Duō fàng làjiāo.", "isCorrect": False, "score": 5, "feedback": "Nếu không ăn cay được thì đừng dặn cho nhiều ớt nhé." },
          { "text": "天气很热。", "pinyin": "Tiānqì hěn rè.", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      },
      {
        "stageNumber": 3,
        "bossDialogue": "用完餐后，旁边专柜有纪念T恤，这件红色的要一百八十块，您想带一件吗？",
        "bossPinyin": "Yòng wán cān hòu, pángbiān zhuānguì yǒu jìniàn T-xù, zhè jiàn hóngsè de yào yì bǎi bāshí kuài, nín xiǎng dài yí jiàn ma?",
        "bossMeaning": "Dùng bữa xong quầy bên cạnh có áo thun lưu niệm, chiếc màu đỏ này 180 tệ, bạn muốn lấy một chiếc không?",
        "prompt": "Hỏi xem có được thử không và xin bớt giá một chút:",
        "options": [
          { "text": "请问我可以试一下吗？如果我买，可以便宜一点儿打个折吗？", "pinyin": "Qǐngwèn wǒ kěyǐ shì yíxià ma? Rúguǒ wǒ mǎi, kěyǐ piányi yìdiǎnr dǎ ge zhé ma?", "isCorrect": True, "score": 25, "feedback": "Vừa lịch sự hỏi thử 试一下 vừa mặc cả khéo léo 打折!" },
          { "text": "太难看了不买。", "pinyin": "Tài nánkàn le bù mǎi.", "isCorrect": False, "score": 0, "feedback": "Khen chê hơi gay gắt." },
          { "text": "在火车站。", "pinyin": "Zài huǒchēzhàn.", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      },
      {
        "stageNumber": 4,
        "bossDialogue": "没问题，给您打八折，饭钱加衣服一共两百块！",
        "bossPinyin": "Méi wèntí, gěi nín dǎ bā zhé, fànqián jiā yīfu yígòng liǎng bǎi kuài!",
        "bossMeaning": "Không vấn đề, giảm 20% cho bạn, tiền cơm cộng áo tổng cộng 200 tệ!",
        "prompt": "Đồng ý giá và thanh toán quét mã qua Alipay:",
        "options": [
          { "text": "太好了，谢谢老板！两百块我用支付宝扫码付钱。", "pinyin": "Tài hǎo le, xièxie lǎobǎn! Liǎng bǎi kuài wǒ yòng Zhīfùbǎo sǎo mǎ fù qián.", "isCorrect": True, "score": 25, "feedback": "Đỉnh cao thực chiến! Chinh phục trọn vẹn Boss Chapter 6!" },
          { "text": "明天再给钱。", "pinyin": "Míngtiān zài gěi qián.", "isCorrect": False, "score": 0, "feedback": "Ăn xong phải trả tiền ngay." },
          { "text": "谁是服务员？", "pinyin": "Shéi shì fúwùyuán?", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      }
    ]
  },

  # --- BOSS 7: Module 2.3 ---
  {
    "id": "boss-ch-7",
    "chapterId": "ch-7",
    "title": "Bác Sĩ Bệnh Viện Hữu Nghị: Khám Bệnh & So Sánh Thời Tiết",
    "chineseTitle": "北京友谊医院就诊与健康大闯关",
    "bossName": "Bác sĩ Triệu (赵医生) — Bệnh Viện Hữu Nghị Bắc Kinh",
    "bossAvatar": "🩺",
    "scenario": "Do thời tiết giao mùa Bắc Kinh lạnh đột ngột, bạn bị cảm sốt và đến bệnh viện gặp Bác sĩ Triệu để thăm khám và xin giấy nghỉ phép.",
    "xpReward": 200,
    "requiredScoreToPass": 80,
    "stages": [
      {
        "stageNumber": 1,
        "bossDialogue": "你好，请坐。外面今天降温刮大风，我看你脸色不太好，哪里不舒服？",
        "bossPinyin": "Nǐ hǎo, qǐng zuò. Wàimiàn jīntiān jiàngwēn guā dà fēng, wǒ kàn nǐ liǎnsè bú tài hǎo, nǎlǐ bù shūfu?",
        "bossMeaning": "Chào bạn, mời ngồi. Bên ngoài hôm nay hạ nhiệt gió to, tôi thấy sắc mặt bạn không tốt lắm, khó chịu ở đâu?",
        "prompt": "Miêu tả triệu chứng sốt và đau đầu:",
        "options": [
          { "text": "赵医生好，我头很疼，昨天晚上发烧三十八度八，今天浑身没力气。", "pinyin": "Zhào yīshēng hǎo, wǒ tóu hěn téng, zuótiān wǎnshang fāshāo sānshíbā dù bā, jīntiān húnshēn méi lìqi.", "isCorrect": True, "score": 25, "feedback": "Khai báo triệu chứng rõ ràng: 头疼, 发烧!" },
          { "text": "我要去买苹果。", "pinyin": "Wǒ yào qù mǎi píngguǒ.", "isCorrect": False, "score": 0, "feedback": "Vào viện khám bệnh không nói mua táo." },
          { "text": "今天比昨天热。", "pinyin": "Jīntiān bǐ zuótiān rè.", "isCorrect": False, "score": 0, "feedback": "Sai thực tế thời tiết." }
        ]
      },
      {
        "stageNumber": 2,
        "bossDialogue": "确实是重感冒了。北京现在的冬天比你们南方冷得多，你出门穿得太少了！",
        "bossPinyin": "Quèshí shì zhòng gǎnmào le. Běijīng xiànzài de dōngtiān bǐ nǐmen nánfāng lěng de duō, nǐ chūmén chuān de tài shǎo le!",
        "bossMeaning": "Đúng là cảm nặng rồi. Mùa đông Bắc Kinh bây giờ lạnh hơn phương nam nhiều lắm, cháu ra ngoài mặc ít quá!",
        "prompt": "Thừa nhận thời tiết hôm nay lạnh hơn hôm qua nhiều:",
        "options": [
          { "text": "是的，今天比昨天冷多了，而且外面还下雪了，我最怕冷。", "pinyin": "Shì de, jīntiān bǐ zuótiān lěng duō le, érqiě wàimiàn hái xià xuě le, wǒ zuì pà lěng.", "isCorrect": True, "score": 25, "feedback": "Dùng câu chữ 比 (比昨天冷多了) và 最 pà lěng cực kỳ chuẩn mực!" },
          { "text": "今天比昨天很冷。", "pinyin": "Jīntiān bǐ zuótiān hěn lěng.", "isCorrect": False, "score": 5, "feedback": "Sai ngữ pháp! Câu chữ 比 tuyệt đối không dùng 很." },
          { "text": "我不喜欢喝茶。", "pinyin": "Wǒ bù xǐhuan hē chá.", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      },
      {
        "stageNumber": 3,
        "bossDialogue": "我给你开三天的感冒药和退烧药。记得一天吃三次，饭后吃，一定要多喝温水！",
        "bossPinyin": "Wǒ gěi nǐ kāi sān tiān de gǎnmàoyào hé tuìshāoyào. Jìde yì tiān chī sān cì, fànhòu chī, yídìng yào duō hē wēnshuǐ!",
        "bossMeaning": "Bác sĩ kê đơn thuốc 3 ngày. Nhớ mỗi ngày uống 3 lần sau ăn, nhất định phải uống nhiều nước ấm!",
        "prompt": "Cảm ơn bác sĩ và nhắc lại cách uống thuốc:",
        "options": [
          { "text": "谢谢赵医生，我记住了：一天吃三次药，饭后吃，而且会多喝水多休息。", "pinyin": "Xièxie Zhào yīshēng, wǒ jì zhù le: yì tiān chī sān cì yào, fànhòu chī, érqiě huì duō hē shuǐ duō xiūxi.", "isCorrect": True, "score": 25, "feedback": "Dùng chuẩn động từ 吃药 (không dùng 喝药) và 多喝水!" },
          { "text": "我每天喝三次药。", "pinyin": "Wǒ měitiān hē sān cì yào.", "isCorrect": False, "score": 5, "feedback": "Tiếng Trung nói 吃药 chứ không nói 喝药 nha." },
          { "text": "几点退房？", "pinyin": "Jǐ diǎn tuìfáng?", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      },
      {
        "stageNumber": 4,
        "bossDialogue": "我再给你开一张三天的病假条，你给学校老师请假，好好在宿舍睡两天！",
        "bossPinyin": "Wǒ zài gěi nǐ kāi yì zhāng sān tiān de bìngjiàtiáo, nǐ gěi xuéxiào lǎoshī qǐngjià, hǎohao zài sùshè shuì liǎng tiān!",
        "bossMeaning": "Bác sĩ viết thêm cho cháu giấy nghỉ ốm 3 ngày để xin phép thầy cô nghỉ ngơi!",
        "prompt": "Nhận giấy xin nghỉ phép và cảm ơn bác sĩ:",
        "options": [
          { "text": "太感谢您了赵医生！有了请假条我就可以安心休息了，谢谢您！", "pinyin": "Tài gǎnxiè nín le Zhào yīshēng! Yǒu le qǐngjiàtiáo wǒ jiù kěyǐ ānxīn xiūxi le, xièxie nín!", "isCorrect": True, "score": 25, "feedback": "Tuyệt đối hoàn hảo! Chinh phục trọn vẹn Boss Chapter 7!" },
          { "text": "再见不送。", "pinyin": "Zàijiàn bú sòng.", "isCorrect": False, "score": 0, "feedback": "Thiếu lịch sự." },
          { "text": "多少钱一斤？", "pinyin": "Duōshao qián yì jīn?", "isCorrect": False, "score": 0, "feedback": "Khám bệnh chứ không phải mua rau." }
        ]
      }
    ]
  },

  # --- BOSS 8: Module 2.4 ---
  {
    "id": "boss-ch-8",
    "chapterId": "ch-8",
    "title": "Hội Đồng Khảo Thí CTI: Đại Sát Hạch Tốt Nghiệp HSK 2",
    "chineseTitle": "HSK 2级全真阶段终极答辩大考",
    "bossName": "Giám khảo Lâm (林考官) — Ban Khảo thí Quốc tế CTI",
    "bossAvatar": "🎖️",
    "scenario": "Đại kỳ thi sát hạch cuối cùng của Level 2. Giám khảo Lâm sẽ kiểm tra toàn diện năng lực phản xạ 300 từ vựng và các trợ từ động thái 着, 过, liên từ 因为...所以... của bạn!",
    "xpReward": 250,
    "requiredScoreToPass": 80,
    "stages": [
      {
        "stageNumber": 1,
        "bossDialogue": "考生你好，欢迎参加HSK 2级结业综合面试。首先请问：你去过哪些中国城市？吃过什么中国特色美食？",
        "bossPinyin": "Kǎoshēng nǐ hǎo, huānyíng cānjiā HSK èr jí jiéyè zōnghé miànshì. Shǒuxiān qǐngwèn: nǐ qù guo nǎxiē Zhōngguó chéngshì? Chī guo shénme Zhōngguó tèsè měishí?",
        "bossMeaning": "Chào thí sinh, mời em trả lời: Em từng đi những thành phố nào của Trung Quốc? Đã từng ăn đặc sản gì?",
        "prompt": "Trả lời bằng trợ từ kinh nghiệm 过:",
        "options": [
          { "text": "老师好，我去过北京和上海，吃过北京烤鸭和四川火锅，感觉特别美味！", "pinyin": "Lǎoshī hǎo, wǒ qù guo Běijīng hé Shànghǎi, chī guo Běijīng kǎoyā hé Sìchuān huǒguō, gǎnjué tèbié měiwèi!", "isCorrect": True, "score": 25, "feedback": "Vận dụng trợ từ 过 cực kỳ trôi chảy và tự nhiên!" },
          { "text": "我去了北京。", "pinyin": "Wǒ qù le Běijīng.", "isCorrect": False, "score": 10, "feedback": "Hỏi kinh nghiệm nên dùng 过 sẽ hay hơn." },
          { "text": "我不有去过。", "pinyin": "Wǒ bù yǒu qù guo.", "isCorrect": False, "score": 0, "feedback": "Sai ngữ pháp! Phủ định của 过 là 没去过." }
        ]
      },
      {
        "stageNumber": 2,
        "bossDialogue": "很好。请你看看窗外：现在的天气和环境状态是什么样的？请用包含'着'的句子描述。",
        "bossPinyin": "Hěn hǎo. Qǐng nǐ kànkan chuāngwài: xiànzài de tiānqì hé huánjìng zhuàngtài shì shénmeyàng de? Qǐng yòng bāohán 'zhe' de jùzi miáoshù.",
        "bossMeaning": "Rất tốt. Hãy nhìn ra ngoài cửa sổ miêu tả trạng thái bằng câu có trợ từ '着':",
        "prompt": "Miêu tả trạng thái với trợ từ 着:",
        "options": [
          { "text": "外面下着雪，教室的门开着，操场上正站着几个正在打雪仗的同学。", "pinyin": "Wàimiàn xià zhe xuě, jiàoshì de mén kāi zhe, cāochǎng shàng zhèng zhàn zhe jǐ gè zhèngzài dǎ xuězhàng de tóngxué.", "isCorrect": True, "score": 25, "feedback": "Xuất sắc! Kết hợp 3 trạng thái duy trì 下着, 开着, 站着 đỉnh cao!" },
          { "text": "门开。", "pinyin": "Mén kāi.", "isCorrect": False, "score": 0, "feedback": "Chưa có trợ từ 着." },
          { "text": "昨天我买衣服了。", "pinyin": "Zuótiān wǒ mǎi yīfu le.", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      },
      {
        "stageNumber": 3,
        "bossDialogue": "最后一道题：为什么说'学汉语虽然难，但是很有用'？请用关联词阐述你的理由。",
        "bossPinyin": "Zuìhòu yí dào tí: wèishénme shuō 'xué Hànyǔ suīrán nán, dànshì hěn yǒuyòng'? Qǐng yòng guānliáncí chǎnshù nǐ de lǐyóu.",
        "bossMeaning": "Câu hỏi cuối: Vì sao nói học tiếng Trung tuy khó nhưng rất hữu ích? Dùng liên từ giải thích:",
        "prompt": "Dùng cặp liên từ 因为...所以... hoặc 虽然...但是...:",
        "options": [
          { "text": "因为学会了汉语，我就可以自己去中国自由行，而且能交到很多中国朋友，所以一切努力都值得！", "pinyin": "Yīnwèi xuéhuì le Hànyǔ, wǒ jiù kěyǐ zìjǐ qù Zhōngguó zìyóuxíng, érqiě néng jiāo dào hěn duō Zhōngguó péngyou, suǒyǐ yíqiè nǔlì dōu zhídé!", "isCorrect": True, "score": 25, "feedback": "Lập luận logic chặt chẽ với 因为...所以..., thể hiện tư duy ngôn ngữ độc lập!" },
          { "text": "因为难所以难。", "pinyin": "Yīnwèi nán suǒyǐ nán.", "isCorrect": False, "score": 0, "feedback": "Câu trả lời quá sơ sài." },
          { "text": "今天比昨天冷。", "pinyin": "Jīntiān bǐ zuótiān lěng.", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      },
      {
        "stageNumber": 4,
        "bossDialogue": "太精彩了！你的回答完全达到了HSK 2级最高等级标准，我代表考委会正式宣布：你已成功通过Level 2，荣获HSK 2级通关认证！",
        "bossPinyin": "Tài jīngcǎi le! Nǐ de huídá wánquán dádào le HSK èr jí zuìgāo děngjí biāozhǔn, wǒ dàibiǎo kǎowěihuì zhèngshì xuānbù: nǐ yǐ chénggōng tōngguò Level 2, rónghuò HSK èr jí tōngguān rènzhèng!",
        "bossMeaning": "Quá xuất sắc! Em đã chính thức vượt qua Level 2, nhận chứng chỉ tốt nghiệp HSK 2!",
        "prompt": "Phát biểu tuyên thệ tiến lên Level 3:",
        "options": [
          { "text": "感谢林考官！完成Level 2只是新起点，接下来我要全力以赴征服HSK 3级独立交流大关！", "pinyin": "Gǎnxiè Lín kǎoguān! Wánchéng Level 2 zhǐshì xīn qǐdiǎn, jiēxiàlai wǒ yào quánlìyǐfù zhēngfú HSK sān jí dúlì jiāoliú dàguān!", "isCorrect": True, "score": 25, "feedback": "Đỉnh cao phong thái học giả! Bạn đã chính thức tốt nghiệp Level 2 (HSK 2) xuất sắc!" },
          { "text": "太好了我不用学了。", "pinyin": "Tài hǎo le wǒ bú yòng xué le.", "isCorrect": False, "score": 0, "feedback": "Đừng dừng lại khi đang trên đà bứt phá nhé!" },
          { "text": "再见师傅。", "pinyin": "Zàijiàn shīfu.", "isCorrect": False, "score": 0, "feedback": "Khảo quan chứ không phải tài xế taxi nha." }
        ]
      }
    ]
  },

  # --- BOSS 9: Module 3.1 ---
  {
    "id": "boss-ch-9",
    "chapterId": "ch-9",
    "title": "Tổng Quản Sân Bay & Lễ Tân Bốn Mùa: Thử Thách Du Lịch Độc Lập",
    "chineseTitle": "首都机场与四季酒店自由行生存挑战",
    "bossName": "Quản lý Phương (方经理) — Khách Sạn Bốn Mùa Bắc Kinh",
    "bossAvatar": "🏨",
    "scenario": "Bạn một mình hạ cánh tại sân bay Thủ Đô và tới làm thủ tục tại khách sạn cao cấp. Bạn phải vận dụng bổ ngữ xu hướng, xử lý hành lý và check-in tự chủ 100%!",
    "xpReward": 250,
    "requiredScoreToPass": 80,
    "stages": [
      {
        "stageNumber": 1,
        "bossDialogue": "先生/女士您好，欢迎来到四季酒店。请问您有预订吗？请出示您的证件。",
        "bossPinyin": "Xiānsheng/Nǚshì nín hǎo, huānyíng lái dào Sìjì Jiǔdiàn. Qǐngwèn nín yǒu yùdìng ma? Qǐng chūshì nín de zhèngjiàn.",
        "bossMeaning": "Kính chào quý khách đến khách sạn Bốn Mùa. Quý khách có đặt trước không? Xin xuất trình giấy tờ:",
        "prompt": "Báo đã đặt phòng trên mạng và lấy hộ chiếu ra:",
        "options": [
          { "text": "方经理您好，我已经在网上预订了一间大床房，我已经把护照拿出来了，请您过目。", "pinyin": "Fāng jīnglǐ nín hǎo, wǒ yǐjīng zài wǎngshang yùdìng le yì jiān dàchuángfáng, wǒ yǐjīng bǎ hùzhào ná chūlái le, qǐng nín guòmù.", "isCorrect": True, "score": 25, "feedback": "Kết hợp câu chữ 把 và bổ ngữ xu hướng 拿出来了 cực kỳ tao nhã!" },
          { "text": "我要住在这里。", "pinyin": "Wǒ yào zhù zài zhèlǐ.", "isCorrect": False, "score": 0, "feedback": "Chưa đưa giấy tờ và thông tin đặt phòng." },
          { "text": "我是服务员。", "pinyin": "Wǒ shì fúwùyuán.", "isCorrect": False, "score": 0, "feedback": "Nhầm lẫn vai trò rồi." }
        ]
      },
      {
        "stageNumber": 2,
        "bossDialogue": "查到了，预订两晚。我们需要收五百元现金押金，退房时会全部退还给您。",
        "bossPinyin": "Chá dào le, yùdìng liǎng wǎn. Wǒmen xūyào shōu wǔ bǎi yuán xiànjīn yājīn, tuìfáng shí huì quánbù tuìhuán gěi nín.",
        "bossMeaning": "Đã tra thấy, đặt 2 đêm. Chúng tôi cần thu 500 tệ tiền cọc, khi trả phòng sẽ hoàn lại đủ.",
        "prompt": "Đồng ý nộp tiền cọc và hỏi giờ trả phòng:",
        "options": [
          { "text": "没问题，这是五百块押金。请问后天中午几点之前需要办理退房？", "pinyin": "Méi wèntí, zhè shì wǔ bǎi kuài yājīn. Qǐngwèn hòutiān zhōngwǔ jǐ diǎn zhīqián xūyào bànlǐ tuìfáng?", "isCorrect": True, "score": 25, "feedback": "Giao tiếp chuẩn xác với 押金 và 办理退房!" },
          { "text": "我不给押金。", "pinyin": "Wǒ bù gěi yājīn.", "isCorrect": False, "score": 0, "feedback": "Quy định khách sạn phải có tiền cọc phòng." },
          { "text": "明天几点下雨？", "pinyin": "Míngtiān jǐ diǎn xià yǔ?", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      },
      {
        "stageNumber": 3,
        "bossDialogue": "中午十二点前退房即可。您的房间在八楼808，请问需要服务生帮您把行李拿上去吗？",
        "bossPinyin": "Zhōngwǔ shí'èr diǎn qián tuìfáng jíkě. Nín de fángjiān zài bā lóu bā líng bā, qǐngwèn xūyào fúwùshēng bāng nín bǎ xíngli ná shàngqù ma?",
        "bossMeaning": "Trước 12 giờ trưa ạ. Phòng ở tầng 8, có cần nhân viên mang hành lý lên trên đó giúp không?",
        "prompt": "Tự tin nói tự mình xách hành lý lên được:",
        "options": [
          { "text": "不用麻烦了，我自己把行李拿上去就行，非常感谢您的热情服务！", "pinyin": "Bú yòng máfan le, wǒ zìjǐ bǎ xíngli ná shàngqù jiù xíng, fēicháng gǎnxiè nín de rèqíng fúwù!", "isCorrect": True, "score": 25, "feedback": "Dùng 把行李拿上去 và thể hiện tính tự lập cao!" },
          { "text": "行李拿下来。", "pinyin": "Xíngli ná xiàlái.", "isCorrect": False, "score": 0, "feedback": "Đang ở dưới sảnh phải mang LÊN (拿上去)." },
          { "text": "我跑出来。", "pinyin": "Wǒ pǎo chūlái.", "isCorrect": False, "score": 0, "feedback": "Sai ngữ cảnh." }
        ]
      },
      {
        "stageNumber": 4,
        "bossDialogue": "这是您的房卡和早餐券！您一个人自由行汉语这么流利，真令人佩服，祝您入住愉快！",
        "bossPinyin": "Zhè shì nín de fángkǎ hé zǎocānquàn! Nín yí gè rén zìyóuxíng Hànyǔ zhème liúlì, zhēn lìng rén pèifú, zhù nín rùzhù yúkuài!",
        "bossMeaning": "Đây là thẻ phòng và phiếu ăn sáng! Chúc quý khách kỳ nghỉ tuyệt vời!",
        "prompt": "Cảm ơn và chúc quản lý làm việc tốt:",
        "options": [
          { "text": "谢谢方经理！我先进房间休息去了，祝您工作顺利，再见！", "pinyin": "Xièxie Fāng jīnglǐ! Wǒ xiān jìn fángjiān xiūxi qù le, zhù nín gōngzuò shùnlì, zàijiàn!", "isCorrect": True, "score": 25, "feedback": "Xuất sắc vượt qua Boss Chapter 9 - Tự do du lịch không rào cản!" },
          { "text": "不客气。", "pinyin": "Bú kèqi.", "isCorrect": False, "score": 5, "feedback": "Phải nói lời cảm ơn." },
          { "text": "你是哪国人？", "pinyin": "Nǐ shì nǎ guó rén?", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      }
    ]
  },

  # --- BOSS 10: Module 3.2 ---
  {
    "id": "boss-ch-10",
    "chapterId": "ch-10",
    "title": "Đại Sư Ngữ Pháp: Đại Chiến Cú Pháp Bổ Ngữ, Chữ 把 & Chữ 被",
    "chineseTitle": "全能句法大对决：把字句、被字句与补语阵法",
    "bossName": "Giáo sư Tiền (钱教授) — Viện Nghiên cứu Ngôn ngữ Bắc Kinh",
    "bossAvatar": "🧙‍♂️",
    "scenario": "Bạn đối đầu với Giáo sư Tiền trong trận chiến ngữ pháp hóc búa nhất: Bổ ngữ kết quả, bổ ngữ khả năng, câu chữ 把 nâng cao và câu bị động chữ 被!",
    "xpReward": 250,
    "requiredScoreToPass": 80,
    "stages": [
      {
        "stageNumber": 1,
        "bossDialogue": "第一阵法：请听题！把句子'我做完了练习'转换为最地道的'把'字句，并说明理由！",
        "bossPinyin": "Dì yī zhènfǎ: qǐng tīng tí! Bǎ jùzi 'wǒ zuò wán le liànxí' zhuǎnhuàn wéi zuì dìdao de 'bǎ' zì jù, bìng shuōmíng lǐyóu!",
        "bossMeaning": "Ải 1: Chuyển câu 'Tôi làm xong bài tập rồi' sang câu chữ 把 chuẩn nhất:",
        "prompt": "Chọn câu chuyển đổi hoàn hảo nhất:",
        "options": [
          { "text": "我把练习做完了！因为练习是确定的宾语，做完了表示动作产生的结果。", "pinyin": "Wǒ bǎ liànxí zuò wán le! Yīnwèi liànxí shì quèdìng de bīnyǔ, zuò wán le biǎoshì dòngzuò chǎnshēng de jiéguǒ.", "isCorrect": True, "score": 25, "feedback": "Chuẩn xác 100%! Cú pháp S + 把 + O + V + Bổ ngữ kết quả!" },
          { "text": "我把做完了练习。", "pinyin": "Wǒ bǎ zuò wán le liànxí.", "isCorrect": False, "score": 0, "feedback": "Sai trật tự từ nghiêm trọng!" },
          { "text": "练习把我做完了。", "pinyin": "Liànxí bǎ wǒ zuò wán le.", "isCorrect": False, "score": 0, "feedback": "Bài tập không thể tác động làm xong con người được!" }
        ]
      },
      {
        "stageNumber": 2,
        "bossDialogue": "第二阵法：'这本书太深奥了，我看不懂。' 这里的'看不懂'是什么补语？它的肯定形式是什么？",
        "bossPinyin": "Dì èr zhènfǎ: 'zhè běn shū tài shēn'ào le, wǒ kàn bu dǒng.' Zhèlǐ de 'kàn bu dǒng' shì shénme bǔyǔ? Tā de kěndìng xíngshì shì shénme?",
        "bossMeaning": "Ải 2: '看不懂' là bổ ngữ gì và dạng khẳng định của nó là gì?",
        "prompt": "Phân tích bổ ngữ khả năng:",
        "options": [
          { "text": "这是可能补语的否定形式，表示没有理解的能力；肯定形式是'看得懂'！", "pinyin": "Zhè shì kěnéng bǔyǔ de fǒudìng xíngshì, biǎoshì méiyǒu lǐjiě de nénglì; kěndìng xíngshì shì 'kàn de dǒng'!", "isCorrect": True, "score": 25, "feedback": "Kiến thức ngữ pháp uyên bác và vững như bàn thạch!" },
          { "text": "这是结果补语，肯定形式是看懂了。", "pinyin": "Zhè shì jiéguǒ bǔyǔ, kěndìng xíngshì shì kàn dǒng le.", "isCorrect": False, "score": 10, "feedback": "Có chữ 不 chen vào giữa là Bổ ngữ khả năng (可能补语)." },
          { "text": "是程度补语。", "pinyin": "Shì chéngdù bǔyǔ.", "isCorrect": False, "score": 0, "feedback": "Nhầm loại bổ ngữ rồi." }
        ]
      },
      {
        "stageNumber": 3,
        "bossDialogue": "第三阵法：请将主动句'大风刮倒了路边的大树'改为'被'字句！",
        "bossPinyin": "Dì sān zhènfǎ: qǐng jiāng zhǔdòng jù 'dà fēng guā dǎo le lùbiān de dà shù' gǎi wéi 'bèi' zì jù!",
        "bossMeaning": "Ải 3: Đổi câu 'Gió to thổi đổ cây to ven đường' sang câu bị động chữ 被:",
        "prompt": "Chuyển sang câu chữ 被:",
        "options": [
          { "text": "路边的大树被大风刮倒了！", "pinyin": "Lùbiān de dà shù bèi dà fēng guā dǎo le!", "isCorrect": True, "score": 25, "feedback": "Chính xác tuyệt đối! Vật chịu tác động (大树) + 被 + Tác nhân (大风) + V (刮倒了)!" },
          { "text": "大风被大树刮倒了。", "pinyin": "Dà fēng bèi dà shù guā dǎo le.", "isCorrect": False, "score": 0, "feedback": "Ngược logic hoàn toàn rồi!" },
          { "text": "大树大风被刮倒。", "pinyin": "Dà shù dà fēng bèi guā dǎo.", "isCorrect": False, "score": 0, "feedback": "Cú pháp lộn xộn." }
        ]
      },
      {
        "stageNumber": 4,
        "bossDialogue": "终极一关：如何用一句话同时展现'把'字句与复合趋向补语的精妙结合？",
        "bossPinyin": "Zhōngjí yì guān: rúhé yòng yí jù huà tóngshí zhǎnxiàn 'bǎ' zì jù yǔ fùhé qūxiàng bǔyǔ de jīngmiào jiéhé?",
        "bossMeaning": "Ải cuối: Đặt một câu kết hợp hoàn hảo cả câu chữ 把 và bổ ngữ xu hướng kép:",
        "prompt": "Đưa ra câu đỉnh cao cú pháp:",
        "options": [
          { "text": "请你把桌子上的笔记本电脑拿出来，把作业本交上去！", "pinyin": "Qǐng nǐ bǎ zhuōzi shàng de bǐjìběn diànnǎo ná chūlái, bǎ zuòyèběn jiāo shàngqù!", "isCorrect": True, "score": 25, "feedback": "Đỉnh cao tuyệt đỉnh! Cả hai vế đều kết hợp 把 + Bổ ngữ xu hướng kép (拿出来 & 交上去)! BẠN ĐÃ ĐÁNH BẠI GIÁO SƯ TIỀN!" },
          { "text": "我把书看。", "pinyin": "Wǒ bǎ shū kàn.", "isCorrect": False, "score": 0, "feedback": "Động từ cô độc là lỗi cấm kỵ!" },
          { "text": "今天比昨天冷。", "pinyin": "Jīntiān bǐ zuótiān lěng.", "isCorrect": False, "score": 0, "feedback": "Đây là câu so sánh chữ 比." }
        ]
      }
    ]
  },

  # --- BOSS 11: Module 3.3 ---
  {
    "id": "boss-ch-11",
    "chapterId": "ch-11",
    "title": "Phỏng Vấn & Cuộc Họp Công Sở: Chinh Phục Giám Đốc Trương",
    "chineseTitle": "跨国企业商务面试与职场沟通大冲关",
    "bossName": "Giám đốc Trương (张总) — Tổng Giám đốc Doanh nghiệp Đa quốc gia",
    "bossAvatar": "💼",
    "scenario": "Bạn tham gia buổi phỏng vấn và họp dự án cùng Tổng Giám đốc Trương. Bạn phải phân biệt 3 chữ Đích, trình bày kế hoạch làm việc và thái độ giải quyết vấn đề chuyên nghiệp!",
    "xpReward": 250,
    "requiredScoreToPass": 80,
    "stages": [
      {
        "stageNumber": 1,
        "bossDialogue": "请进！请坐。我看过你的简历，你的汉语学得非常认真。请谈谈你在工作中遇到难题时，如何解决问题？",
        "bossPinyin": "Qǐng jìn! Qǐng zuò. Wǒ kàn guo nǐ de jiǎnlì, nǐ de Hànyǔ xué de fēicháng rènzhēn. Qǐng tántan nǐ zài gōngzuò zhōng yù dào nántí shí, rúhé jiějué wèntí?",
        "bossMeaning": "Mời vào, mời ngồi. Tôi đã xem CV, tiếng Trung của bạn học rất nghiêm túc. Khi gặp khó khăn bạn giải quyết thế nào?",
        "prompt": "Trả lời bằng thái độ trách nhiệm và tinh thần đồng đội:",
        "options": [
          { "text": "张总好，遇到问题时，我首先会认真分析原因，然后和同事们一起讨论，最后制定详细计划按时解决！", "pinyin": "Zhāng zǒng hǎo, yù dào wèntí shí, wǒ shǒuxiān huì rènzhēn fēnxī yuányīn, ránhòu hé tóngshìmen yìqǐ tǎolùn, zuìhòu zhìdìng xiángxì jìhuà ànshí jiějué!", "isCorrect": True, "score": 25, "feedback": "Phong thái chuyên nghiệp đỉnh cao kết hợp 首先 -> 然后 -> 最后!" },
          { "text": "我不知道怎么办。", "pinyin": "Wǒ bù zhīdào zěnme bàn.", "isCorrect": False, "score": 0, "feedback": "Thiếu chủ động trong công việc." },
          { "text": "我请假回家睡觉。", "pinyin": "Wǒ qǐngjià huí jiā shuìjiào.", "isCorrect": False, "score": 0, "feedback": "Bị loại ngay từ vòng phỏng vấn!" }
        ]
      },
      {
        "stageNumber": 2,
        "bossDialogue": "回答很有条理！我们下午两点有一个重要会议，需要你向大家汇报。请准确使用'的、地、得'造一个工作汇报句。",
        "bossPinyin": "Huídá hěn yǒu tiáolǐ! Wǒmen xiàwǔ liǎng diǎn yǒu yí gè zhòngyào huìyì, xūyào nǐ xiàng dàjiā huìbào. Qǐng zhǔnquè shǐyòng 'de, de, de' zào yí gè gōngzuò huìbào jù.",
        "bossMeaning": "Trả lời rất có mạch lạc! Chiều nay họp dự án, mời bạn đặt một câu dùng chuẩn cả 3 chữ 的, 地, 得:",
        "prompt": "Vận dụng tam giác 3 chữ Đích trong công việc:",
        "options": [
          { "text": "我们团队认真的态度（的）让我们努力地执行计划（地），而且把项目完成得非常出色（得）！", "pinyin": "Wǒmen tuánduì rènzhēn de tàidu ràng wǒmen nǔlì de zhíxíng jìhuà, érqiě bǎ xiàngmù wánchéng de fēicháng chūsè!", "isCorrect": True, "score": 25, "feedback": "Chuẩn xác tuyệt đối! 的 + Danh từ, 地 + Động từ, Động từ + 得 + Mức độ!" },
          { "text": "认真的做好的写得。", "pinyin": "Rènzhēn de zuò hǎo de xiě de.", "isCorrect": False, "score": 0, "feedback": "Ghép chữ vô nghĩa." },
          { "text": "昨天很热。", "pinyin": "Zuótiān hěn rè.", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      },
      {
        "stageNumber": 3,
        "bossDialogue": "非常出色！作为外籍员工，你如何看待我们公司的企业文化和团队协作？",
        "bossPinyin": "Fēicháng chūsè! Zuòwéi wàijí yuángōng, nǐ rúhé kàndài wǒmen gōngsī de qǐyè wénhuà hé tuánduì xiézuò?",
        "bossMeaning": "Rất xuất sắc! Là nhân viên người nước ngoài, bạn nhìn nhận văn hóa công ty và làm việc nhóm thế nào?",
        "prompt": "Vận dụng thành ngữ 入乡随俗 và thái độ nhiệt tình:",
        "options": [
          { "text": "我认为首先要学会入乡随俗，尊重大家的沟通习惯；同时我对工作充满热情，愿意一心一意为团队做贡献！", "pinyin": "Wǒ rènwéi shǒuxiān yào xuéhuì rù xiāng suí sú, zūnzhòng dàjiā de gōutōng xíguàn; tóngshí wǒ duì gōngzuò chōngmǎn rèqíng, yuànyì yìxīnyíyì wèi tuánduì zuò gòngxiàn!", "isCorrect": True, "score": 25, "feedback": "Vận dụng cả 入乡随俗, 热情 và 一心一意, giám khảo nào cũng muốn tuyển ngay!" },
          { "text": "我马马虎虎吧。", "pinyin": "Wǒ mǎmǎhūhū ba.", "isCorrect": False, "score": 5, "feedback": "Không nên tự nhận làm việc qua loa trong phỏng vấn." },
          { "text": "我很贵。", "pinyin": "Wǒ hěn guì.", "isCorrect": False, "score": 0, "feedback": "Diễn đạt sai ngữ pháp." }
        ]
      },
      {
        "stageNumber": 4,
        "bossDialogue": "太优秀了！你不仅汉语功底扎实，而且具备了极强的跨文化沟通能力。恭喜你，你被我们公司正式录取了！",
        "bossPinyin": "Tài yōuxiù le! Nǐ bùjǐn Hànyǔ gōngdǐ zhāshi, érqiě jùbèi le jí qiáng de kuà wénhuà gōutōng nénglì. Gōngxǐ nǐ, nǐ bèi wǒmen gōngsī zhèngshì lùqǔ le!",
        "bossMeaning": "Quá xuất sắc! Bạn đã chính thức được công ty chúng tôi tuyển dụng!",
        "prompt": "Đáp lại lời chúc mừng và bày tỏ lòng cảm ơn:",
        "options": [
          { "text": "非常感谢张总的信任！我一定努力工作，认真完成每一个任务，绝不辜负您的期望！", "pinyin": "Fēicháng gǎnxiè Zhāng zǒng de xìnrèn! Wǒ yídìng nǔlì gōngzuò, rènzhēn wánchéng měi yí gè rènwu, jué bù gūfù nín de qīwàng!", "isCorrect": True, "score": 25, "feedback": "Chúc mừng bạn đã xuất sắc vượt qua Boss Chapter 11 - Sẵn sàng bước vào Đại Boss Tối Thượng!" },
          { "text": "好的我走啦。", "pinyin": "Hǎo de wǒ zǒu la.", "isCorrect": False, "score": 0, "feedback": "Hơi cụt lủn." },
          { "text": "没有钱。", "pinyin": "Méiyǒu qián.", "isCorrect": False, "score": 0, "feedback": "Không phù hợp." }
        ]
      }
    ]
  }
]

print(f"Bosses 5 to 11 loaded, count: {len(BOSSES_5_TO_12)}")
