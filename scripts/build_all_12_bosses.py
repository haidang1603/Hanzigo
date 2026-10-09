# -*- coding: utf-8 -*-
"""
Generate all 12 authentic Boss Challenges for Chapters 1 to 12
Strictly adheres to docs/HANZIGO_CHINESE_CURRICULUM.md
"""
import json

ALL_12_BOSSES = [
  # --- BOSS 1: Module 1.1 ---
  {
    "id": "boss-ch-1",
    "chapterId": "ch-1",
    "title": "Đại Chiến Phát Âm: Cuộc Gặp Đầu Tiên Tại Bắc Kinh",
    "chineseTitle": "语音初战：北京初遇",
    "bossName": "Thầy Vương (王老师) — Chuyên gia Ngữ âm Bắc Kinh",
    "bossAvatar": "👨‍🏫",
    "scenario": "Bạn vừa đặt chân tới Bắc Kinh và gặp Thầy Vương tại sảnh đón sinh viên quốc tế. Thầy sẽ kiểm tra phản xạ chào hỏi, phân biệt thanh điệu và kính ngữ của bạn!",
    "xpReward": 200,
    "requiredScoreToPass": 80,
    "stages": [
      {
        "stageNumber": 1,
        "bossDialogue": "你好！欢迎来到北京！请问你是新来的留学生吗？",
        "bossPinyin": "Nǐ hǎo! Huānyíng lái dào Běijīng! Qǐngwèn nǐ shì xīn lái de liúxuéshēng ma?",
        "bossMeaning": "Xin chào! Chào mừng bạn đến Bắc Kinh! Xin hỏi bạn có phải là du học sinh mới đến không?",
        "prompt": "Hãy đáp lại lời chào của Thầy Vương một cách lễ phép nhất:",
        "options": [
          { "text": "老师您好！我是新来的学生，谢谢您！", "pinyin": "Lǎoshī nín hǎo! Wǒ shì xīn lái de xuésheng, xièxie nín!", "isCorrect": True, "score": 25, "feedback": "Rất tuyệt vời! Bạn đã sử dụng kính ngữ 您好 và lời cảm ơn đúng chuẩn." },
          { "text": "你好，我不去。", "pinyin": "Nǐ hǎo, wǒ bú qù.", "isCorrect": False, "score": 0, "feedback": "Câu trả lời không phù hợp với tình huống chào đón." },
          { "text": "再见！", "pinyin": "Zàijiàn!", "isCorrect": False, "score": 0, "feedback": "Vừa gặp thầy mà đã nói tạm biệt là chưa đúng ngữ cảnh!" }
        ]
      },
      {
        "stageNumber": 2,
        "bossDialogue": "坐了这么久的飞机，你累不累？要喝点水吗？",
        "bossPinyin": "Zuò le zhème jiǔ de fēijī, nǐ lèi bu lèi? Yào hē diǎn shuǐ ma?",
        "bossMeaning": "Ngồi máy bay lâu như vậy, bạn có mệt không? Có muốn uống chút nước không?",
        "prompt": "Hãy trả lời rằng bạn không mệt và cảm ơn thầy:",
        "options": [
          { "text": "我不累，谢谢老师！我喝水。", "pinyin": "Wǒ bú lèi, xièxie lǎoshī! Wǒ hē shuǐ.", "isCorrect": True, "score": 25, "feedback": "Xuất sắc! Câu trả lời kết hợp hoàn hảo phủ định 不累 và động từ 喝水." },
          { "text": "爸爸很忙。", "pinyin": "Bàba hěn máng.", "isCorrect": False, "score": 0, "feedback": "Lạc đề hoàn toàn rồi bạn ơi!" },
          { "text": "八个妈妈。", "pinyin": "Bā gè māma.", "isCorrect": False, "score": 0, "feedback": "Coi chừng nhầm lẫn từ vựng nhé!" }
        ]
      },
      {
        "stageNumber": 3,
        "bossDialogue": "很好！你的发音很准！我们现在去学校吧。",
        "bossPinyin": "Hěn hǎo! Nǐ de fāyīn hěn zhǔn! Wǒmen xiànzài qù xuéxiào ba.",
        "bossMeaning": "Rất tốt! Phát âm của em rất chuẩn! Bây giờ chúng ta cùng đến trường nhé.",
        "prompt": "Đáp lại sự khen ngợi của Thầy Vương một cách khiêm tốn:",
        "options": [
          { "text": "谢谢老师，您太客气了！好的，我们走吧。", "pinyin": "Xièxie lǎoshī, nín tài kèqi le! Hǎo de, wǒmen zǒu ba.", "isCorrect": True, "score": 25, "feedback": "Cực kỳ tinh tế và khiêm nhường theo đúng văn hóa Trung Hoa." },
          { "text": "我不客气！", "pinyin": "Wǒ bú kèqi!", "isCorrect": False, "score": 5, "feedback": "不客气 chỉ dùng khi người khác cảm ơn bạn thôi nhé." },
          { "text": "你是谁？", "pinyin": "Nǐ shì shéi?", "isCorrect": False, "score": 0, "feedback": "Câu hỏi này hơi thiếu tế nhị trong tình huống này." }
        ]
      },
      {
        "stageNumber": 4,
        "bossDialogue": "到了学校，明天的开学典礼再见！",
        "bossPinyin": "Dào le xuéxiào, míngtiān de kāixué diǎnlǐ zàijiàn!",
        "bossMeaning": "Đến trường rồi, hẹn gặp em tại lễ khai giảng ngày mai nhé!",
        "prompt": "Nói lời tạm biệt lễ phép với Thầy Vương:",
        "options": [
          { "text": "老师辛苦了，明天见！老师再见！", "pinyin": "Lǎoshī xīnkǔ le, míngtiān jiàn! Lǎoshī zàijiàn!", "isCorrect": True, "score": 25, "feedback": "Hoàn hảo 100%! Bạn đã chinh phục trọn vẹn Boss Chapter 1!" },
          { "text": "你好！", "pinyin": "Nǐ hǎo!", "isCorrect": False, "score": 0, "feedback": "Lúc chia tay không nên nói 你好." },
          { "text": "不喝茶。", "pinyin": "Bù hē chá.", "isCorrect": False, "score": 0, "feedback": "Không liên quan đến lời chào tạm biệt." }
        ]
      }
    ]
  },

  # --- BOSS 2: Module 1.2 ---
  {
    "id": "boss-ch-2",
    "chapterId": "ch-2",
    "title": "Thử Thách Quán Trà Sữa Sanlitun: Đánh Vần & Tự Giới Thiệu",
    "chineseTitle": "奶茶店初次相识挑战",
    "bossName": "Cô chủ Tiểu Mai (小梅) — Quán Trà Sữa Sanlitun",
    "bossAvatar": "🧋",
    "scenario": "Bạn bước vào quán trà sữa nổi tiếng ở Bắc Kinh và gặp cô chủ Tiểu Mai. Bạn cần tự giới thiệu bản thân, quốc tịch, tuổi tác và giao tiếp tự nhiên!",
    "xpReward": 200,
    "requiredScoreToPass": 80,
    "stages": [
      {
        "stageNumber": 1,
        "bossDialogue": "你好！欢迎光临！你是第一次来北京吗？你叫什么名字？",
        "bossPinyin": "Nǐ hǎo! Huānyíng guānglín! Nǐ shì dì yī cì lái Běijīng ma? Nǐ jiào shénme míngzi?",
        "bossMeaning": "Xin chào! Kính chào quý khách! Bạn lần đầu đến Bắc Kinh à? Bạn tên là gì?",
        "prompt": "Chào cô chủ và giới thiệu họ tên của bạn:",
        "options": [
          { "text": "你好！我是第一次来，我叫安，很高兴认识你！", "pinyin": "Nǐ hǎo! Wǒ shì dì yī cì lái, wǒ jiào Ān, hěn gāoxìng rènshi nǐ!", "isCorrect": True, "score": 25, "feedback": "Rất tự tin và thân thiện!" },
          { "text": "这是什么？", "pinyin": "Zhè shì shénme?", "isCorrect": False, "score": 0, "feedback": "Chưa trả lời câu hỏi tên của cô chủ." },
          { "text": "我不好。", "pinyin": "Wǒ bù hǎo.", "isCorrect": False, "score": 0, "feedback": "Không phù hợp ngữ cảnh làm quen." }
        ]
      },
      {
        "stageNumber": 2,
        "bossDialogue": "你的汉语说得真好！你是哪国人？今年多大了？",
        "bossPinyin": "Nǐ de Hànyǔ shuō de zhēn hǎo! Nǐ shì nǎ guó rén? Jīnnián duō dà le?",
        "bossMeaning": "Tiếng Trung của bạn nói hay quá! Bạn là người nước nào? Năm nay bao nhiêu tuổi rồi?",
        "prompt": "Nói rõ quốc tịch Việt Nam và số tuổi của bạn:",
        "options": [
          { "text": "我是越南人，今年二十岁，在北京学汉语。", "pinyin": "Wǒ shì Yuènán rén, jīnnián èrshí suì, zài Běijīng xué Hànyǔ.", "isCorrect": True, "score": 25, "feedback": "Xuất sắc! Câu trả lời đầy đủ thông tin chuẩn ngữ pháp." },
          { "text": "他是中国人。", "pinyin": "Tā shì Zhōngguó rén.", "isCorrect": False, "score": 0, "feedback": "Nhầm lẫn đại từ nhân xưng rồi." },
          { "text": "我有五本书。", "pinyin": "Wǒ yǒu wǔ běn shū.", "isCorrect": False, "score": 0, "feedback": "Lạc đề hoàn toàn." }
        ]
      },
      {
        "stageNumber": 3,
        "bossDialogue": "原来是越南留学生！你想喝点什么奶茶？",
        "bossPinyin": "Yuánlái shì Yuènán liúxuéshēng! Nǐ xiǎng hē diǎn shénme nǎichá?",
        "bossMeaning": "Hóa ra là du học sinh Việt Nam! Bạn muốn uống trà sữa gì nào?",
        "prompt": "Gọi một ly trà sữa và cảm ơn cô chủ:",
        "options": [
          { "text": "请给我一杯珍珠奶茶，谢谢！", "pinyin": "Qǐng gěi wǒ yì bēi zhēnzhū nǎichá, xièxie!", "isCorrect": True, "score": 25, "feedback": "Chuẩn xác và tự nhiên!" },
          { "text": "我不喜欢吃米饭。", "pinyin": "Wǒ bù xǐhuan chī mǐfàn.", "isCorrect": False, "score": 0, "feedback": "Đang ở quán trà sữa mà lại nói cơm." },
          { "text": "再见！", "pinyin": "Zàijiàn!", "isCorrect": False, "score": 0, "feedback": "Chưa gọi đồ mà đã tạm biệt!" }
        ]
      },
      {
        "stageNumber": 4,
        "bossDialogue": "好的，这是你的奶茶！欢迎常来做客，认识你很高兴！",
        "bossPinyin": "Hǎo de, zhè shì nǐ de nǎichá! Huānyíng cháng lái zuòkè, rènshi nǐ hěn gāoxìng!",
        "bossMeaning": "Được rồi, đây là trà sữa của bạn! Hoan nghênh bạn thường xuyên ghé chơi, rất vui được quen bạn!",
        "prompt": "Đáp lại lời tạm biệt một cách lịch thiệp nhất:",
        "options": [
          { "text": "谢谢小梅姐！认识你我也很高兴，明天见！", "pinyin": "Xièxie Xiǎoméi jiě! Rènshi nǐ wǒ yě hěn gāoxìng, míngtiān jiàn!", "isCorrect": True, "score": 25, "feedback": "Hoàn hảo! Bạn đã vượt qua Boss Chapter 2 một cách thuyết phục!" },
          { "text": "不客气！", "pinyin": "Bú kèqi!", "isCorrect": False, "score": 5, "feedback": "Người ta đưa đồ cho mình thì mình phải cảm ơn chứ!" },
          { "text": "你是老师吗？", "pinyin": "Nǐ shì lǎoshī ma?", "isCorrect": False, "score": 0, "feedback": "Lạc quẻ rồi bạn ơi!" }
        ]
      }
    ]
  },

  # --- BOSS 3: Module 1.3 ---
  {
    "id": "boss-ch-3",
    "chapterId": "ch-3",
    "title": "Đại Chiến Mua Sắm & Lịch Trình: Chợ Hoa Quả Triều Dương",
    "chineseTitle": "朝阳水果市场采购与议价",
    "bossName": "Bác Trương (张大爷) — Chủ Sạp Hoa Quả Triều Dương",
    "bossAvatar": "🍎",
    "scenario": "Bạn đến chợ hoa quả truyền thống Bắc Kinh để mua táo và hỏi thăm lịch trình, ngày giờ và hỏi giá cả đồ vật.",
    "xpReward": 200,
    "requiredScoreToPass": 80,
    "stages": [
      {
        "stageNumber": 1,
        "bossDialogue": "小伙子，今天十月九号，红富士苹果刚到，新鲜得很！你想买几斤？",
        "bossPinyin": "Xiǎohuǒzi, jīntiān shí yuè jiǔ hào, hóngfùshì píngguǒ gāng dào, xīnxiān de hěn! Nǐ xiǎng mǎi jǐ jīn?",
        "bossMeaning": "Chàng trai trẻ ơi, hôm nay ngày 9 tháng 10, táo tươi vừa về ngon lắm! Cháu muốn mua mấy cân?",
        "prompt": "Hỏi giá táo bao nhiêu tiền một cân:",
        "options": [
          { "text": "大爷好，请问这个苹果多少钱一斤？", "pinyin": "Dàye hǎo, qǐngwèn zhège píngguǒ duōshao qián yì jīn?", "isCorrect": True, "score": 25, "feedback": "Rất lễ phép và đúng trọng tâm hỏi giá!" },
          { "text": "我不有钱。", "pinyin": "Wǒ bù yǒu qián.", "isCorrect": False, "score": 0, "feedback": "Sai ngữ pháp! Phủ định của 有 phải là 没有." },
          { "text": "几点睡觉？", "pinyin": "Jǐ diǎn shuìjiào?", "isCorrect": False, "score": 0, "feedback": "Lạc đề hoàn toàn." }
        ]
      },
      {
        "stageNumber": 2,
        "bossDialogue": "十五块钱一斤，很甜的！",
        "bossPinyin": "Shíwǔ kuài qián yì jīn, hěn tián de!",
        "bossMeaning": "15 tệ một cân cháu ơi, ngọt lắm!",
        "prompt": "Bày tỏ cảm thán đắt quá và mặc cả:",
        "options": [
          { "text": "太贵了！大爷，便宜一点儿可以吗？十块钱一斤行不行？", "pinyin": "Tài guì le! Dàye, piányi yìdiǎnr kěyǐ ma? Shí kuài qián yì jīn xíng bu xíng?", "isCorrect": True, "score": 25, "feedback": "Sử dụng cấu trúc 太贵了 và 便宜一点儿 cực kỳ chuẩn!" },
          { "text": "太好了！", "pinyin": "Tài hǎo le!", "isCorrect": False, "score": 0, "feedback": "Bác bán đắt mà lại khen tốt quá là mất tiền oan đấy!" },
          { "text": "明天见。", "pinyin": "Míngtiān jiàn.", "isCorrect": False, "score": 0, "feedback": "Bỏ đi vội vàng quá." }
        ]
      },
      {
        "stageNumber": 3,
        "bossDialogue": "行行行，看你汉语说得好，十块就十块！你家里有几口人？买两斤够吃吗？",
        "bossPinyin": "Xíng xíng xíng, kàn nǐ Hànyǔ shuō de hǎo, shí kuài jiù shí kuài! Nǐ jiā lǐ yǒu jǐ kǒu rén? Mǎi liǎng jīn gòu chī ma?",
        "bossMeaning": "Được được, thấy cháu nói tiếng Trung giỏi, 10 tệ thì 10 tệ! Nhà cháu có mấy người? Mua 2 cân đủ ăn không?",
        "prompt": "Trả lời số người trong nhà bằng lượng từ 口:",
        "options": [
          { "text": "我家有四口人，买两斤正好，谢谢大爷！", "pinyin": "Wǒ jiā yǒu sì kǒu rén, mǎi liǎng jīn zhènghǎo, xièxie dàye!", "isCorrect": True, "score": 25, "feedback": "Chính xác lượng từ 口 rén và trả lời đầy đủ!" },
          { "text": "我家有四个。", "pinyin": "Wǒ jiā yǒu sì gè.", "isCorrect": False, "score": 5, "feedback": "Nói người trong nhà nên dùng 口 rén." },
          { "text": "在学校吃饭。", "pinyin": "Zài xuéxiào chīfàn.", "isCorrect": False, "score": 0, "feedback": "Chưa trả lời câu hỏi số người." }
        ]
      },
      {
        "stageNumber": 4,
        "bossDialogue": "一共二十块钱，你现在怎么付钱？",
        "bossPinyin": "Yígòng èrshí kuài qián, nǐ xiànzài zěnme fù qián?",
        "bossMeaning": "Tổng cộng 20 tệ, cháu trả tiền thế nào?",
        "prompt": "Nói bạn quét mã trả tiền bằng WeChat:",
        "options": [
          { "text": "大爷，我扫您的微信二维码付钱，二十块付好了！", "pinyin": "Dàye, wǒ sǎo nín de Wēixìn èrwéimǎ fù qián, èrshí kuài fù hǎo le!", "isCorrect": True, "score": 25, "feedback": "Xuất sắc! Chinh phục trọn vẹn Boss Chapter 3!" },
          { "text": "我没有钱再见。", "pinyin": "Wǒ méiyǒu qián zàijiàn.", "isCorrect": False, "score": 0, "feedback": "Mua đồ mà không trả tiền là không được nha!" },
          { "text": "昨天星期五。", "pinyin": "Zuótiān xīngqīwǔ.", "isCorrect": False, "score": 0, "feedback": "Lạc đề rồi." }
        ]
      }
    ]
  },

  # --- BOSS 4: Module 1.4 ---
  {
    "id": "boss-ch-4",
    "chapterId": "ch-4",
    "title": "Hội Đồng Khảo Thí CTI: Tốt Nghiệp HSK 1 Toàn Diện",
    "chineseTitle": "HSK 1级全真结业答辩考",
    "bossName": "Giám khảo Trương (张考官) — Trưởng ban Khảo thí CTI",
    "bossAvatar": "🎓",
    "scenario": "Bạn bước vào phòng sát hạch cuối cùng của Level 1. Giám khảo Trương sẽ kiểm tra toàn diện 150 từ vựng và năng lực phản xạ tiếng Trung của bạn!",
    "xpReward": 250,
    "requiredScoreToPass": 80,
    "stages": [
      {
        "stageNumber": 1,
        "bossDialogue": "考生你好，欢迎参加HSK 1级结业口语测试。首先请用中文简单介绍你的爱好：你喜欢吃什么、喝什么？",
        "bossPinyin": "Kǎoshēng nǐ hǎo, huānyíng cānjiā HSK yī jí jiéyè kǒuyǔ cèshì. Shǒuxiān qǐng yòng Zhōngwén jiǎndān jièshào nǐ de àihào: nǐ xǐhuan chī shénme, hē shénme?",
        "bossMeaning": "Chào thí sinh, mời em giới thiệu sở thích: Em thích ăn gì, uống gì?",
        "prompt": "Trả lời bằng cấu trúc 喜欢吃/喝:",
        "options": [
          { "text": "老师好，我喜欢吃米饭和中国菜，喜欢喝中国绿茶。", "pinyin": "Lǎoshī hǎo, wǒ xǐhuan chī mǐfàn hé Zhōngguó cài, xǐhuan hē Zhōngguó lǜchá.", "isCorrect": True, "score": 25, "feedback": "Rất chuẩn mực và lưu loát!" },
          { "text": "我不喜欢。", "pinyin": "Wǒ bù xǐhuan.", "isCorrect": False, "score": 0, "feedback": "Quá ngắn ngủi và thiếu thông tin." },
          { "text": "明天几点？", "pinyin": "Míngtiān jǐ diǎn?", "isCorrect": False, "score": 0, "feedback": "Không đúng trọng tâm câu hỏi." }
        ]
      },
      {
        "stageNumber": 2,
        "bossDialogue": "很好。请问你会说汉语、会写汉字吗？你为什么想学汉语？",
        "bossPinyin": "Hěn hǎo. Qǐngwèn nǐ huì shuō Hànyǔ, huì xiě hànzì ma? Nǐ wèishénme xiǎng xué Hànyǔ?",
        "bossMeaning": "Rất tốt. Em biết nói tiếng Trung, biết viết chữ Hán không? Vì sao em muốn học tiếng Trung?",
        "prompt": "Dùng năng nguyện động từ 会 và 想 để trả lời:",
        "options": [
          { "text": "我会说汉语，也会写一些汉字。我想学汉语是因为我想去北京大学读书。", "pinyin": "Wǒ huì shuō Hànyǔ, yě huì xiě yìxiē hànzì. Wǒ xiǎng xué Hànyǔ shì yīnwèi wǒ xiǎng qù Běijīng Dàxué dúshū.", "isCorrect": True, "score": 25, "feedback": "Vận dụng 会 và 想 hoàn hảo, nêu rõ mục tiêu cao đẹp!" },
          { "text": "我不会也不想。", "pinyin": "Wǒ bú huì yě bù xiǎng.", "isCorrect": False, "score": 0, "feedback": "Thái độ chưa tích cực trong kỳ thi." },
          { "text": "昨天天气很好。", "pinyin": "Zuótiān tiānqì hěn hǎo.", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      },
      {
        "stageNumber": 3,
        "bossDialogue": "外面现在下雨了吗？今天天气怎么样？",
        "bossPinyin": "Wàimiàn xiànzài xià yǔ le ma? Jīntiān tiānqì zěnmeyàng?",
        "bossMeaning": "Bên ngoài trời mưa chưa? Hôm nay thời tiết thế nào?",
        "prompt": "Miêu tả thời tiết hiện tại:",
        "options": [
          { "text": "外面没下雨，今天天气很好，不冷也不热，很舒服。", "pinyin": "Wàimiàn méi xià yǔ, jīntiān tiānqì hěn hǎo, bù lěng yě bú rè, hěn shūfu.", "isCorrect": True, "score": 25, "feedback": "Vận dụng 不冷也不热 rất sinh động và đúng chuẩn HSK 1!" },
          { "text": "太贵了。", "pinyin": "Tài guì le.", "isCorrect": False, "score": 0, "feedback": "Thời tiết không liên quan đến đắt rẻ." },
          { "text": "我有四个哥哥。", "pinyin": "Wǒ yǒu sì gè gēge.", "isCorrect": False, "score": 0, "feedback": "Lạc đề." }
        ]
      },
      {
        "stageNumber": 4,
        "bossDialogue": "回答非常出色！恭喜你全面通过HSK 1级考核，正式迈入Level 2！请发表你的结业感言：",
        "bossPinyin": "Huídá fēicháng chūsè! Gōngxǐ nǐ quánmiàn tōngguò HSK yī jí kǎohé, zhèngshì màirù Level 2! Qǐng fābiǎo nǐ de jiéyè gǎnyán:",
        "bossMeaning": "Trả lời rất xuất sắc! Chúc mừng em vượt qua kỳ thi HSK 1, chính thức bước vào Level 2! Mời em phát biểu cảm nghĩ tốt nghiệp:",
        "prompt": "Đọc to lời cảm ơn và quyết tâm học tiếp:",
        "options": [
          { "text": "谢谢张考官！在HanziGo学习非常快乐，接下来我会更加努力征服HSK 2级！", "pinyin": "Xièxie Zhāng kǎoguān! Zài HanziGo xuéxí fēicháng kuàilè, jiēxiàlai wǒ huì gèngjiā nǔlì zhēngfú HSK èr jí!", "isCorrect": True, "score": 25, "feedback": "Tuyệt vời! Bạn đã xuất sắc tốt nghiệp Level 1 (HSK 1) với số điểm tuyệt đối!" },
          { "text": "我走啦，再见！", "pinyin": "Wǒ zǒu la, zàijiàn!", "isCorrect": False, "score": 5, "feedback": "Hơi vội vàng khi phát biểu tốt nghiệp." },
          { "text": "我不想学了。", "pinyin": "Wǒ bù xiǎng xué le.", "isCorrect": False, "score": 0, "feedback": "Đừng nản lòng nhé!" }
        ]
      }
    ]
  }
]

# We will generate remaining Bosses 5-12 in similar format
print(f"Base 4 Bosses ready, total stages: {sum(len(b['stages']) for b in ALL_12_BOSSES)}")
