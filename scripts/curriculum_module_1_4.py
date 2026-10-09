# -*- coding: utf-8 -*-
"""
Module 1.4 Lessons (116 to 120) - HSK 1 Completion
Strictly adheres to docs/HANZIGO_CHINESE_CURRICULUM.md
"""

MODULE_1_4_LESSONS = [
  # --- LESSON 116 ---
  {
    "id": "l-116", "chapterId": "ch-4", "levelId": "lvl-1", "lessonNumber": 16,
    "title": "Đồ ăn thức uống quen thuộc & Động từ 吃, 喝",
    "chineseTitle": "饮食与动词“吃/喝”（你喜欢吃什么）",
    "subtitle": "Nói về sở thích ẩm thực (喜欢), các món ăn và đồ uống thường nhật bằng tiếng Trung.",
    "objective": "Diễn đạt được bạn thích ăn gì, uống gì và gọi được món ăn/nước uống cơ bản.",
    "prerequisite": "Đã hoàn thành Module 1.3.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng câu sở thích ăn uống.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 1", "Ẩm thực", "Động từ 吃", "Động từ 喝", "喜欢"],
    "relatedMaterialIds": ["mat-1", "mat-2"],
    "step1_learn": {
      "topic": "Hỏi sở thích: 你喜欢吃什么？ (Nǐ xǐhuan chī shénme?)",
      "summary": "喜欢 (xǐhuan) là thích. 吃 (chī) là ăn, 喝 (hē) là uống. Cấu trúc: Chủ ngữ + 喜欢 + 吃/喝 + Đồ ăn/Thức uống.",
      "audioDemoText": "nǐ xǐhuan chī shénme, wǒ xǐhuan chī mǐfàn, wǒ xǐhuan hē chá"
    },
    "step2_vocabulary": [
      {"id": "v-116-1", "hanzi": "喜欢", "pinyin": "xǐhuan", "hanviet": "Hỷ hoan", "meaning": "Thích", "radical": "士 (Sĩ)", "example": {"hanzi": "我喜欢中国菜。", "pinyin": "Wǒ xǐhuan Zhōngguó cài.", "meaning": "Tôi thích món ăn Trung Quốc."}},
      {"id": "v-116-2", "hanzi": "吃", "pinyin": "chī", "hanviet": "Cật", "meaning": "Ăn", "radical": "口 (Khẩu)", "example": {"hanzi": "你想吃什么？", "pinyin": "Nǐ xiǎng chī shénme?", "meaning": "Bạn muốn ăn gì?"}},
      {"id": "v-116-3", "hanzi": "喝", "pinyin": "hē", "hanviet": "Hát", "meaning": "Uống", "radical": "口 (Khẩu)", "example": {"hanzi": "请喝茶。", "pinyin": "Qǐng hē chá.", "meaning": "Mời uống trà."}},
      {"id": "v-116-4", "hanzi": "米饭", "pinyin": "mǐfàn", "hanviet": "Mễ phạn", "meaning": "Cơm", "radical": "米 (Mễ)", "example": {"hanzi": "我吃米饭。", "pinyin": "Wǒ chī mǐfàn.", "meaning": "Tôi ăn cơm."}},
      {"id": "v-116-5", "hanzi": "茶", "pinyin": "chá", "hanviet": "Trà", "meaning": "Trà, chè", "radical": "艹 (Thảo)", "example": {"hanzi": "中国茶很好喝。", "pinyin": "Zhōngguó chá hěn hǎohē.", "meaning": "Trà Trung Quốc rất ngon."}},
      {"id": "v-116-6", "hanzi": "菜", "pinyin": "cài", "hanviet": "Thái", "meaning": "Món ăn, rau", "radical": "艹 (Thảo)", "example": {"hanzi": "这个菜很好吃。", "pinyin": "Zhège cài hěn hǎochī.", "meaning": "Món này rất ngon."}}
    ],
    "step3_hanzi": [
      {"hanzi": "吃", "pinyin": "chī", "meaning": "Ăn", "strokesCount": 6, "strokeOrderText": "Bộ Khẩu (口) -> Nét phẩy -> Nét ngang gập cong móc (乞)", "components": "口 + 乞", "mnemonic": "Cái miệng (口) mở ra đón nhận đồ ăn xin về."},
      {"hanzi": "茶", "pinyin": "chá", "meaning": "Trà", "strokesCount": 9, "strokeOrderText": "Bộ Thảo (艹) ở trên -> Nét bộ Nhân (人) -> Bộ Mộc (木) ở dưới", "components": "艹 + 人 + 木", "mnemonic": "Con người (人) hái lá cỏ (艹) từ trên cây gỗ (木) về nấu trà."}
    ],
    "step4_grammar": {
      "title": "Cấu trúc biểu đạt sở thích: 喜欢 + Động từ / Danh từ",
      "formula": "Chủ ngữ + 喜欢 + Động từ (吃 / 喝) + Tân ngữ",
      "explanation": "Từ 喜欢 có thể đi trực tiếp với danh từ (喜欢茶) hoặc đi với cụm động tân (喜欢喝茶). Phủ định là 不喜欢.",
      "examples": [{"hanzi": "我不喜欢喝咖啡，我喜欢喝茶。", "pinyin": "Wǒ bù xǐhuan hē kāfēi, wǒ xǐhuan hē chá.", "meaning": "Tôi không thích uống cà phê, tôi thích uống trà."}],
      "commonMistake": {"wrong": "我没喜欢茶 ❌", "correct": "我不喜欢茶 ✔️", "explanation": "Phủ định tâm lý tình cảm dùng 不 (không dùng 没)."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "中午你想吃什么？", "pinyin": "Zhōngwǔ nǐ xiǎng chī shénme?", "meaning": "Buổi trưa bạn muốn ăn gì?"},
        {"speaker": "B", "hanzi": "我想吃米饭和中国菜。", "pinyin": "Wǒ xiǎng chī mǐfàn hé Zhōngguó cài.", "meaning": "Tôi muốn ăn cơm và món ăn Trung Quốc."}
      ],
      "audioText": "中午你想吃什么？我想吃米饭和中国菜。",
      "question": "Người B muốn ăn món gì buổi trưa?",
      "options": ["Bánh bao", "Cơm và món Trung Quốc (mǐfàn hé Zhōngguó cài)", "Trái cây", "Mì sợi"],
      "correctIndex": 1, "explanation": "Người B nói rõ: 米饭和中国菜."
    },
    "step6_speaking": {"prompt": "Nói câu bạn thích uống trà:", "targetSentence": "我喜欢喝茶。", "targetPinyin": "Wǒ xǐhuan hē chá.", "targetMeaning": "Tôi thích uống trà.", "hint": "Đọc xǐhuan nhẹ nhàng, chá thanh 2."},
    "step7_writing": {"prompt": "Sắp xếp câu: Tôi thích ăn cơm", "words": ["吃米饭", "喜欢", "我"], "correctOrder": ["我", "喜欢", "吃米饭"], "explanation": "我 + 喜欢 + 吃米饭."},
    "step8_quiz": [
      {"id": "q-116-1", "type": "multiple-choice", "question": "Từ nào sau đây mang nghĩa là 'Uống'?", "options": ["吃 (chī)", "喝 (hē)", "买 (mǎi)", "看 (kàn)"], "correctIndex": 1, "explanation": "喝 (hē) là uống."},
      {"id": "q-116-2", "type": "multiple-choice", "question": "Phủ định của 'Tôi thích ăn cơm' là:", "options": ["我没喜欢吃米饭", "我不喜欢吃米饭", "我喜欢不吃米饭", "我不吃米饭喜欢"], "correctIndex": 1, "explanation": "Phủ định sở thích dùng 不: 我不喜欢吃米饭."}
    ],
    "step9_challenge": {"title": "Gọi món tại quán ăn", "taskDesc": "Đọc to câu gọi 1 món ăn và 1 loại đồ uống mà bạn thích.", "targetPhrase": "wǒ xǐhuan chī mǐfàn hē chá", "xpReward": 50, "badge": "Tín Đồ Ẩm Thực"}
  },

  # --- LESSON 117 ---
  {
    "id": "l-117", "chapterId": "ch-4", "levelId": "lvl-1", "lessonNumber": 17,
    "title": "Khả năng & Nguyện vọng với 会, 想",
    "chineseTitle": "能愿动词“会”与“想”（我会说汉语）",
    "subtitle": "Phân biệt năng nguyện động từ 会 (biết qua học tập rèn luyện) và 想 (mong muốn/dự định).",
    "objective": "Nói được bạn biết làm gì (会) và mong muốn làm gì (想) bằng tiếng Trung.",
    "prerequisite": "Đã hoàn thành Bài 116.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng chính xác 会 và 想.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 1", "Năng nguyện động từ", "会", "想", "Ngoại ngữ"],
    "relatedMaterialIds": ["mat-1", "mat-8"],
    "step1_learn": {
      "topic": "Năng nguyện động từ: 会 (huì - Biết) & 想 (xiǎng - Muốn)",
      "summary": "会 chỉ kỹ năng có được qua học tập (我会说汉语, 我会写汉字). 想 chỉ nguyện vọng/mong muốn (我想去北京). Phủ định là 不会 và 不想.",
      "audioDemoText": "wǒ huì shuō hànyǔ, wǒ huì xiě hànzì, wǒ xiǎng qù běijīng"
    },
    "step2_vocabulary": [
      {"id": "v-117-1", "hanzi": "会", "pinyin": "huì", "hanviet": "Hội", "meaning": "Biết (qua học tập)", "radical": "人 (Nhân)", "example": {"hanzi": "你会说汉语吗？", "pinyin": "Nǐ huì shuō Hànyǔ ma?", "meaning": "Bạn biết nói tiếng Trung không?"}},
      {"id": "v-117-2", "hanzi": "想", "pinyin": "xiǎng", "hanviet": "Tưởng", "meaning": "Muốn, nhớ, nghĩ", "radical": "心 (Tâm)", "example": {"hanzi": "我想学汉语。", "pinyin": "Wǒ xiǎng xué Hànyǔ.", "meaning": "Tôi muốn học tiếng Trung."}},
      {"id": "v-117-3", "hanzi": "说", "pinyin": "shuō", "hanviet": "Thuyết", "meaning": "Nói", "radical": "讠 (Ngôn)", "example": {"hanzi": "他说得很好。", "pinyin": "Tā shuō de hěn hǎo.", "meaning": "Anh ấy nói rất tốt."}},
      {"id": "v-117-4", "hanzi": "写", "pinyin": "xiě", "hanviet": "Tả", "meaning": "Viết", "radical": "冖 (Mịch)", "example": {"hanzi": "写汉字。", "pinyin": "Xiě hànzì.", "meaning": "Viết chữ Hán."}},
      {"id": "v-117-5", "hanzi": "汉字", "pinyin": "hànzì", "hanviet": "Hán tự", "meaning": "Chữ Hán", "radical": "宀 (Miên)", "example": {"hanzi": "汉字很有意思。", "pinyin": "Hànzì hěn yǒu yìsi.", "meaning": "Chữ Hán rất thú vị."}},
      {"id": "v-117-6", "hanzi": "做", "pinyin": "zuò", "hanviet": "Tác", "meaning": "Làm", "radical": "亻 (Nhân)", "example": {"hanzi": "做中国菜。", "pinyin": "Zuò Zhōngguó cài.", "meaning": "Nấu món Trung Quốc."}}
    ],
    "step3_hanzi": [
      {"hanzi": "会", "pinyin": "huì", "meaning": "Biết, gặp gỡ", "strokesCount": 6, "strokeOrderText": "Bộ Nhân (人) ở trên -> Bộ Vân (云) ở dưới", "components": "人 + 云", "mnemonic": "Con người hội tụ dưới mây trời trao đổi tri thức và kỹ năng."},
      {"hanzi": "想", "pinyin": "xiǎng", "meaning": "Muốn, nghĩ tưởng", "strokesCount": 13, "strokeOrderText": "Chữ Tướng (相) ở trên -> Bộ Tâm (心) ở dưới", "components": "相 + 心", "mnemonic": "Để hình ảnh sự vật trong trái tim chính là sự suy nghĩ mong muốn."}
    ],
    "step4_grammar": {
      "title": "Vị trí của năng nguyện động từ 会 và 想",
      "formula": "Chủ ngữ + 会 / 想 + Động từ chính + Tân ngữ",
      "explanation": "Động từ năng nguyện luôn đứng trước động từ chính trong câu. Phủ định đặt 不 trước động từ năng nguyện (不会 / 不想).",
      "examples": [{"hanzi": "我会写这个汉字。", "pinyin": "Wǒ huì xiě zhège hànzì.", "meaning": "Tôi biết viết chữ Hán này."}],
      "commonMistake": {"wrong": "我写会汉字 ❌", "correct": "我会写汉字 ✔️", "explanation": "会 đứng trước động từ chính 写."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "你会说汉语吗？", "pinyin": "Nǐ huì shuō Hànyǔ ma?", "meaning": "Bạn biết nói tiếng Trung không?"},
        {"speaker": "B", "hanzi": "我会说一点儿汉语，我还会写汉字。", "pinyin": "Wǒ huì shuō yìdiǎnr Hànyǔ, wǒ hái huì xiě hànzì.", "meaning": "Tôi biết nói một chút tiếng Trung, tôi còn biết viết chữ Hán nữa."}
      ],
      "audioText": "你会说汉语吗？我会说一点儿汉语，我还会写汉字。",
      "question": "Người B có những kỹ năng nào?",
      "options": ["Chỉ biết nghe", "Biết nói một chút và biết viết chữ Hán", "Không biết tiếng Trung", "Chỉ biết đọc sách"],
      "correctIndex": 1, "explanation": "B nói: 会说一点儿... 会写汉字."
    },
    "step6_speaking": {"prompt": "Khẳng định khả năng nói tiếng Trung của bạn:", "targetSentence": "我会说汉语。", "targetPinyin": "Wǒ huì shuō Hànyǔ.", "targetMeaning": "Tôi biết nói tiếng Trung.", "hint": "Đọc shuō uốn lưỡi sh, Hànyǔ thanh 4 và 3."},
    "step7_writing": {"prompt": "Sắp xếp câu: Tôi muốn đi Bắc Kinh", "words": ["去北京", "想", "我"], "correctOrder": ["我", "想", "去北京"], "explanation": "我 + 想 + 去北京."},
    "step8_quiz": [
      {"id": "q-117-1", "type": "multiple-choice", "question": "Để diễn tả 'kỹ năng biết làm gì qua học tập rèn luyện', ta dùng từ:", "options": ["想 (xiǎng)", "会 (huì)", "去 (qù)", "在 (zài)"], "correctIndex": 1, "explanation": "Từ 会 biểu thị kỹ năng do học tập có được."},
      {"id": "q-117-2", "type": "multiple-choice", "question": "Chọn câu phủ định đúng:", "options": ["我不想去学校", "我没想去学校", "我去不想学校", "我不想学校去"], "correctIndex": 0, "explanation": "Phủ định của 想 là 不想."}
    ],
    "step9_challenge": {"title": "Tự tin tuyên bố năng lực", "taskDesc": "Đọc to câu: 'Tôi biết nói tiếng Trung và tôi muốn đi du lịch Trung Quốc'.", "targetPhrase": "wǒ huì shuō hànyǔ wǒ xiǎng qù zhōngguó", "xpReward": 50, "badge": "Tự Tin Hội Nhập"}
  },

  # --- LESSON 118 ---
  {
    "id": "l-118", "chapterId": "ch-4", "levelId": "lvl-1", "lessonNumber": 18,
    "title": "Giải trí & Thời tiết sơ cấp (看书, 看电影, 冷, 热)",
    "chineseTitle": "休闲与初级天气表达（天气怎么样）",
    "subtitle": "Hỏi và nhận xét thời tiết với 怎么样 (zěnmeyàng), 冷 (lạnh), 热 (nóng) và các hoạt động giải trí.",
    "objective": "Hỏi thăm thời tiết, miêu tả nóng/lạnh/mưa và nói về sở thích xem phim, đọc sách.",
    "prerequisite": "Đã hoàn thành Bài 117.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và miêu tả được thời tiết hôm nay.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 1", "Thời tiết", "怎么样", "Giải trí", "Xem phim"],
    "relatedMaterialIds": ["mat-1", "mat-6"],
    "step1_learn": {
      "topic": "Hỏi thời tiết: 今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
      "summary": "天气 (tiānqì) là thời tiết. 怎么样 (zěnmeyàng) dùng để hỏi tính chất/tình hình như thế nào. 冷 (lěng) là lạnh, 热 (rè) là nóng, 下雨 (xiàyǔ) là trời mưa.",
      "audioDemoText": "jīntiān tiānqì zěnmeyàng, jīntiān tiānqì hěn hǎo, bù lěng yě bú rè"
    },
    "step2_vocabulary": [
      {"id": "v-118-1", "hanzi": "天气", "pinyin": "tiānqì", "hanviet": "Thiên khí", "meaning": "Thời tiết", "radical": "气 (Khí)", "example": {"hanzi": "今天天气很好。", "pinyin": "Jīntiān tiānqì hěn hǎo.", "meaning": "Hôm nay thời tiết rất đẹp."}},
      {"id": "v-118-2", "hanzi": "怎么样", "pinyin": "zěnmeyàng", "hanviet": "Chẩm ma dạng", "meaning": "Như thế nào", "radical": "心 (Tâm)", "example": {"hanzi": "你觉得怎么样？", "pinyin": "Nǐ juéde zěnmeyàng?", "meaning": "Bạn thấy thế nào?"}},
      {"id": "v-118-3", "hanzi": "冷", "pinyin": "lěng", "hanviet": "Lãnh", "meaning": "Lạnh", "radical": "冫 (Băng)", "example": {"hanzi": "太冷了！", "pinyin": "Tài lěng le!", "meaning": "Lạnh quá rồi!"}},
      {"id": "v-118-4", "hanzi": "热", "pinyin": "rè", "hanviet": "Nhiệt", "meaning": "Nóng", "radical": "灬 (Hỏa)", "example": {"hanzi": "今天很热。", "pinyin": "Jīntiān hěn rè.", "meaning": "Hôm nay rất nóng."}},
      {"id": "v-118-5", "hanzi": "下雨", "pinyin": "xià yǔ", "hanviet": "Hạ vũ", "meaning": "Trời mưa", "radical": "雨 (Vũ)", "example": {"hanzi": "明天会下雨。", "pinyin": "Míngtiān huì xià yǔ.", "meaning": "Ngày mai trời sẽ mưa."}},
      {"id": "v-118-6", "hanzi": "看电影", "pinyin": "kàn diànyǐng", "hanviet": "Khán điện ảnh", "meaning": "Xem phim", "radical": "目 (Mục)", "example": {"hanzi": "周末看电影。", "pinyin": "Zhōumò kàn diànyǐng.", "meaning": "Cuối tuần đi xem phim."}}
    ],
    "step3_hanzi": [
      {"hanzi": "冷", "pinyin": "lěng", "meaning": "Lạnh lẽo", "strokesCount": 7, "strokeOrderText": "Bộ Băng (冫) bên trái -> Chữ Lệnh (令) bên phải", "components": "冫 + 令", "mnemonic": "Hai giọt nước đóng băng (冫) mang lại cảm giác lạnh giá."},
      {"hanzi": "雨", "pinyin": "yǔ", "meaning": "Mưa", "strokesCount": 8, "strokeOrderText": "Ngang -> Sổ -> Ngang gập móc -> Sổ giữa -> Bốn chấm mưa", "components": "Bộ Vũ (雨)", "mnemonic": "Bầu trời giăng mây và 4 giọt nước mưa rơi xuống."}
    ],
    "step4_grammar": {
      "title": "Hỏi ý kiến hoặc tình trạng với 怎么样",
      "formula": "Chủ ngữ (Người / Sự vật / Thời tiết) + 怎么样？",
      "explanation": "Từ 怎么样 đứng ở cuối câu để hỏi về tính chất, ý kiến hoặc thời tiết.",
      "examples": [{"hanzi": "北京的天气怎么样？", "pinyin": "Běijīng de tiānqì zěnmeyàng?", "meaning": "Thời tiết ở Bắc Kinh như thế nào?"}],
      "commonMistake": {"wrong": "怎么样天气 ❌", "correct": "天气怎么样 ✔️", "explanation": "怎么样 luôn đứng sau chủ ngữ được hỏi."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "明天天气怎么样？", "pinyin": "Míngtiān tiānqì zěnmeyàng?", "meaning": "Ngày mai thời tiết thế nào?"},
        {"speaker": "B", "hanzi": "明天不下雨，不冷也不热，很舒服。", "pinyin": "Míngtiān bú xià yǔ, bù lěng yě bú rè, hěn shūfu.", "meaning": "Ngày mai không mưa, không lạnh cũng không nóng, rất dễ chịu."}
      ],
      "audioText": "明天天气怎么样？明天不下雨，不冷也不热。",
      "question": "Thời tiết ngày mai ra sao?",
      "options": ["Rất lạnh và có tuyết", "Mưa rất to", "Không mưa, không lạnh cũng không nóng", "Rất nóng bức"],
      "correctIndex": 2, "explanation": "B nói: 不下雨，不冷也不热."
    },
    "step6_speaking": {"prompt": "Nhận xét thời tiết hôm nay rất đẹp:", "targetSentence": "今天天气很好。", "targetPinyin": "Jīntiān tiānqì hěn hǎo.", "targetMeaning": "Hôm nay thời tiết rất đẹp.", "hint": "Đọc tiānqì thanh 1 và 4."},
    "step7_writing": {"prompt": "Sắp xếp câu: Thời tiết hôm nay như thế nào?", "words": ["怎么样", "今天", "天气"], "correctOrder": ["今天", "天气", "怎么样"], "explanation": "今天 + 天气 + 怎么样."},
    "step8_quiz": [
      {"id": "q-118-1", "type": "multiple-choice", "question": "Từ nào sau đây mang nghĩa là 'Trời mưa'?", "options": ["下雪 (xià xuě)", "下雨 (xià yǔ)", "刮风 (guā fēng)", "晴天 (qíngtiān)"], "correctIndex": 1, "explanation": "下雨 (xià yǔ) là trời mưa."},
      {"id": "q-118-2", "type": "multiple-choice", "question": "Cụm '不冷也不热' mang nghĩa:", "options": ["Vừa lạnh vừa nóng", "Không lạnh cũng không nóng", "Rất lạnh", "Rất nóng"], "correctIndex": 1, "explanation": "Không lạnh cũng không nóng, thời tiết ôn hòa."}
    ],
    "step9_challenge": {"title": "Bản tin thời tiết bỏ túi", "taskDesc": "Đọc to bản tin dự báo thời tiết 2 câu miêu tả hôm nay nắng hay mưa, nóng hay lạnh.", "targetPhrase": "jīntiān tiānqì hěn hǎo bù lěng yě bú rè", "xpReward": 50, "badge": "Khí Tượng Viên Nhí"}
  },

  # --- LESSON 119 ---
  {
    "id": "l-119", "chapterId": "ch-4", "levelId": "lvl-1", "lessonNumber": 19,
    "title": "Tổng ôn tập toàn diện ngữ pháp & 150 từ vựng HSK 1",
    "chineseTitle": "HSK 1全真语法体系与150词总复习",
    "subtitle": "Hệ thống hóa toàn bộ ngữ pháp HSK 1: Trợ từ 的, 吗, 呢, 了; trật tự từ SVO và đòn bẩy Hán - Việt.",
    "objective": "Tổng kết vững chắc 150 từ vựng cốt lõi và 48 cấu trúc ngữ pháp trước kỳ thi Checkpoint Test.",
    "prerequisite": "Đã hoàn thành Bài 101–118.",
    "completionCriteria": "Đạt >= 80% trắc nghiệm tổng hợp toàn bộ Level 1.",
    "durationMinutes": 25, "xpReward": 60, "tags": ["HSK 1", "Tổng ôn tập", "Ngữ pháp tổng hợp", "Review Checkpoint"],
    "relatedMaterialIds": ["mat-1", "mat-4", "mat-10"],
    "step1_learn": {
      "topic": "Hệ thống 4 trợ từ kinh điển HSK 1: 的 (sở hữu), 吗 (hỏi có/không), 呢 (còn...thì sao), 了 (đã/rồi)",
      "summary": "1. 的 biểu thị sở hữu (我的书). 2. 吗 biến câu kể thành câu hỏi nghi vấn (你好吗). 3. 呢 hỏi tiếp hoặc rút gọn (你呢). 4. 了 biểu thị sự thay đổi trạng thái hoặc hành động đã xảy ra (太贵了 / 我买了).",
      "audioDemoText": "wǒ de shū, nǐ hǎo ma, wǒ hěn hǎo nǐ ne, tài guì le"
    },
    "step2_vocabulary": [
      {"id": "v-119-1", "hanzi": "都", "pinyin": "dōu", "hanviet": "Đô", "meaning": "Đều", "radical": "阝 (Ấp)", "example": {"hanzi": "我们都是学生。", "pinyin": "Wǒmen dōu shì xuésheng.", "meaning": "Chúng tôi đều là học sinh."}},
      {"id": "v-119-2", "hanzi": "很", "pinyin": "hěn", "hanviet": "Khẩn", "meaning": "Rất", "radical": "彳 (Xích)", "example": {"hanzi": "汉语很好听。", "pinyin": "Hànyǔ hěn hǎotīng.", "meaning": "Tiếng Trung rất hay."}},
      {"id": "v-119-3", "hanzi": "真", "pinyin": "zhēn", "hanviet": "Chân", "meaning": "Thật, thực sự", "radical": "目 (Mục)", "example": {"hanzi": "真漂亮！", "pinyin": "Zhēn piàoliang!", "meaning": "Thật là đẹp!"}},
      {"id": "v-119-4", "hanzi": "一点儿", "pinyin": "yìdiǎnr", "hanviet": "Nhất điểm nhi", "meaning": "Một chút, một ít", "radical": "一 (Nhất)", "example": {"hanzi": "我会说一点儿。", "pinyin": "Wǒ huì shuō yìdiǎnr.", "meaning": "Tôi biết nói một chút."}}
    ],
    "step3_hanzi": [
      {"hanzi": "都", "pinyin": "dōu", "meaning": "Đều, tất cả", "strokesCount": 10, "strokeOrderText": "Bộ Giả (者) bên trái -> Bộ Ấp (阝) bên phải", "components": "者 + 阝", "mnemonic": "Mọi người dân trong thành thị đều bình đẳng như nhau."},
      {"hanzi": "真", "pinyin": "zhēn", "meaning": "Thật, chân thật", "strokesCount": 10, "strokeOrderText": "Bộ Thập (十) -> Khung Mục (目) với 3 nét ngang -> Hai nét phẩy chấm dưới", "components": "十 + 目", "mnemonic": "Đôi mắt nhìn thấy mười phần sự thật rõ ràng."}
    ],
    "step4_grammar": {
      "title": "Bảng tổng kết 3 quy tắc trật tự từ tiếng Trung tối quan trọng",
      "formula": "1. Ai làm gì ở đâu: S + 在 + Địa điểm + V. 2. Thời gian trước hành động: S + Time + V. 3. Định ngữ trước trung tâm ngữ: Tính từ/Định ngữ + 的 + Danh từ.",
      "explanation": "Nắm vững 3 quy tắc vàng này là bạn đã giải quyết được 90% lỗi sai cú pháp khi làm bài thi HSK 1.",
      "examples": [{"hanzi": "我今天在学校买了一本书。", "pinyin": "Wǒ jīntiān zài xuéxiào mǎi le yì běn shū.", "meaning": "Hôm nay tôi đã mua một quyển sách ở trường."}],
      "commonMistake": {"wrong": "我买一本书在学校今天 ❌", "correct": "我今天在学校买了一本书 ✔️", "explanation": "Thời gian và địa điểm luôn đứng trước hành động."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "你们都是越南留学生吗？", "pinyin": "Nǐmen dōu shì Yuènán liúxuéshēng ma?", "meaning": "Các bạn đều là du học sinh Việt Nam à?"},
        {"speaker": "B", "hanzi": "对，我们都在北京大学学汉语。", "pinyin": "Duì, wǒmen dōu zài Běijīng Dàxué xué Hànyǔ.", "meaning": "Đúng vậy, chúng tôi đều học tiếng Trung tại Đại học Bắc Kinh."}
      ],
      "audioText": "你们都是越南留学生吗？对，我们都在北京大学学汉语。",
      "question": "Những người này đang làm gì ở đâu?",
      "options": ["Đang du lịch Thượng Hải", "Đang học tiếng Trung tại Đại học Bắc Kinh", "Đang đi làm ở công ty", "Đang đi mua sắm"],
      "correctIndex": 1, "explanation": "都在北京大学学汉语."
    },
    "step6_speaking": {"prompt": "Đọc câu tổng hợp toàn diện:", "targetSentence": "我们都在学校学汉语。", "targetPinyin": "Wǒmen dōu zài xuéxiào xué Hànyǔ.", "targetMeaning": "Chúng tôi đều học tiếng Trung ở trường.", "hint": "Đọc mượt mà dōu zài xuéxiào."},
    "step7_writing": {"prompt": "Sắp xếp câu: Chúng tôi đều là bạn tốt", "words": ["好朋友", "我们", "都是"], "correctOrder": ["我们", "都是", "好朋友"], "explanation": "我们 + 都是 + 好朋友."},
    "step8_quiz": [
      {"id": "q-119-1", "type": "multiple-choice", "question": "Trong câu '这是 ___ 汉语书', điền từ sở hữu nào phù hợp nhất?", "options": ["我", "我的", "我很", "我都"], "correctIndex": 1, "explanation": "Biểu thị sở hữu dùng 我的 (của tôi)."},
      {"id": "q-119-2", "type": "multiple-choice", "question": "Phó từ '都' (dōu - Đều) luôn đứng ở vị trí nào trong câu?", "options": ["Đầu câu trước chủ ngữ", "Sau chủ ngữ, trước động từ/tính từ", "Cuối câu", "Sau tân ngữ"], "correctIndex": 1, "explanation": "都 đứng sau chủ ngữ số nhiều và trước động từ: 我们都去."}
    ],
    "step9_challenge": {"title": "Sẵn sàng thi Checkpoint HSK 1", "taskDesc": "Vượt qua thử thách phản xạ để mở khóa bài thi chuẩn hóa Level 1!", "targetPhrase": "wǒmen dōu zài xuéxiào xué hànyǔ", "xpReward": 60, "badge": "Chiến Binh Sẵn Sàng"}
  },

  # --- LESSON 120 ---
  {
    "id": "l-120", "chapterId": "ch-4", "levelId": "lvl-1", "lessonNumber": 20,
    "title": "Checkpoint Test HSK 1 (Thi thử mô phỏng chuẩn CTI)",
    "chineseTitle": "HSK 1级全真模拟考与阶段通关测试",
    "subtitle": "Đề thi sát hạch toàn diện 100% cấu trúc khảo thí quốc tế CTI: Nghe hiểu, Đọc hiểu và Viết câu.",
    "objective": "Đạt chuẩn đầu ra Level 1 (HSK 1): Nắm vững 150 từ vựng và tự tin vượt qua đề thi chứng chỉ.",
    "prerequisite": "Đã hoàn thành toàn bộ Bài 101–119.",
    "completionCriteria": "Đạt >= 80% điểm bài thi để nhận Huy hiệu Tốt nghiệp HSK 1.",
    "durationMinutes": 30, "xpReward": 100, "tags": ["HSK 1", "Thi thử CTI", "Checkpoint Test", "Tốt nghiệp Level 1"],
    "relatedMaterialIds": ["mat-1", "mat-10"],
    "step1_learn": {
      "topic": "Chiến thuật làm bài thi HSK 1 chuẩn quốc tế CTI",
      "summary": "Đề thi HSK 1 gồm 2 phần lớn: 1. Phần Nghe (20 câu, có tranh minh họa và audio đọc 2 lần). 2. Phần Đọc hiểu (20 câu, nối từ với hình ảnh, chọn đúng sai). Tất cả đều có Pinyin hỗ trợ.",
      "audioDemoText": "hsk yī jí kǎoshì xiànzài kāishǐ, qǐng tīng dì yī tí"
    },
    "step2_vocabulary": [
      {"id": "v-120-1", "hanzi": "考试", "pinyin": "kǎoshì", "hanviet": "Khảo thí", "meaning": "Thi cử, kiểm tra", "radical": "耂 (Lão)", "example": {"hanzi": "今天的考试不难。", "pinyin": "Jīntiān de kǎoshì bù nán.", "meaning": "Bài thi hôm nay không khó."}},
      {"id": "v-120-2", "hanzi": "准备", "pinyin": "zhǔnbèi", "hanviet": "Chuẩn bị", "meaning": "Chuẩn bị", "radical": "冫 (Băng)", "example": {"hanzi": "你准备好了吗？", "pinyin": "Nǐ zhǔnbèi hǎo le ma?", "meaning": "Bạn đã chuẩn bị xong chưa?"}},
      {"id": "v-120-3", "hanzi": "问题", "pinyin": "wèntí", "hanviet": "Vấn đề", "meaning": "Câu hỏi, vấn đề", "radical": "门 (Môn)", "example": {"hanzi": "没问题！", "pinyin": "Méi wèntí!", "meaning": "Không vấn đề gì cả!"}},
      {"id": "v-120-4", "hanzi": "开始", "pinyin": "kāishǐ", "hanviet": "Khai thủy", "meaning": "Bắt đầu", "radical": "门 (Môn)", "example": {"hanzi": "现在开始。", "pinyin": "Xiànzài kāishǐ.", "meaning": "Bây giờ bắt đầu."}}
    ],
    "step3_hanzi": [
      {"hanzi": "考", "pinyin": "kǎo", "meaning": "Khảo thí, thi", "strokesCount": 6, "strokeOrderText": "Ngang -> Sổ -> Ngang -> Phẩy -> Nét gập móc", "components": "Bộ Lão (耂)", "mnemonic": "Các vị khảo quan lớn tuổi (Lão) ngồi chấm thi."},
      {"hanzi": "试", "pinyin": "shì", "meaning": "Thử nghiệm, bài thi", "strokesCount": 8, "strokeOrderText": "Bộ Ngôn (讠) bên trái -> Bộ Thức (式) bên phải", "components": "讠 + 式", "mnemonic": "Dùng lời nói (Ngôn) diễn đạt theo đúng quy thức (Thức) bài thi."}
    ],
    "step4_grammar": {
      "title": "Mẹo tránh bẫy nghe và đọc đề thi HSK 1",
      "formula": "1. Nghe từ khóa (Số lượng, Thời gian, Đại từ). 2. Phân tích tranh trước khi audio phát.",
      "explanation": "Trong bài thi nghe, audio luôn có khoảng dừng 10 giây trước mỗi câu. Hãy tận dụng thời gian này nhìn nhanh vào các bức tranh để dự đoán từ vựng liên quan.",
      "examples": [{"hanzi": "没问题，我已经准备好了！", "pinyin": "Méi wèntí, wǒ yǐjīng zhǔnbèi hǎo le!", "meaning": "Không vấn đề gì, tôi đã chuẩn bị sẵn sàng rồi!"}],
      "commonMistake": {"wrong": "Đợi nghe xong mới đọc câu hỏi dẫn đến bị cuống.", "correct": "Đọc lướt câu hỏi trước khi nghe audio.", "explanation": "Chiến thuật làm bài khảo thí chuẩn mực."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Khảo quan", "hanzi": "你好！请问你叫什么名字？你是哪国人？", "pinyin": "Nǐ hǎo! Qǐngwèn nǐ jiào shénme míngzi? Nǐ shì nǎ guó rén?", "meaning": "Xin chào! Xin hỏi em tên gì? Em là người nước nào?"},
        {"speaker": "Thí sinh", "hanzi": "老师您好！我叫阮明，我是越南人，今天我来参加HSK 1级考试。", "pinyin": "Lǎoshī nín hǎo! Wǒ jiào Ruǎn Míng, wǒ shì Yuènán rén, jīntiān wǒ lái cānjiā HSK yī jí kǎoshì.", "meaning": "Em chào thầy ạ! Em tên Nguyễn Minh, em là người Việt Nam, hôm nay em đến tham gia kỳ thi HSK 1."}
      ],
      "audioText": "我叫阮明，我是越南人，今天我来参加HSK 1级考试。",
      "question": "Thí sinh Nguyễn Minh đến đây để làm gì?",
      "options": ["Đi du lịch", "Tham gia kỳ thi HSK 1 (cānjiā HSK yī jí kǎoshì)", "Đi mua sách", "Đi ăn cơm"],
      "correctIndex": 1, "explanation": "B nói: 来参加HSK 1级考试."
    },
    "step6_speaking": {"prompt": "Khẳng định bạn đã sẵn sàng vượt qua kỳ thi:", "targetSentence": "没问题，我准备好了！", "targetPinyin": "Méi wèntí, wǒ zhǔnbèi hǎo le!", "targetMeaning": "Không vấn đề gì, tôi đã chuẩn bị xong rồi!", "hint": "Đọc méi wèntí dứt khoát và tự tin."},
    "step7_writing": {"prompt": "Sắp xếp câu: Kỳ thi tiếng Trung bắt đầu rồi", "words": ["开始了", "汉语考试"], "correctOrder": ["汉语考试", "开始了"], "explanation": "汉语考试 + 开始了."},
    "step8_quiz": [
      {"id": "q-120-1", "type": "multiple-choice", "question": "Chúc mừng bạn đến với câu hỏi tốt nghiệp HSK 1: Câu nào sau đây hoàn toàn đúng chuẩn ngữ pháp tiếng Trung?", "options": ["我今天下午在学校学汉语", "我学汉语在学校今天下午", "今天下午我学汉语在学校", "在学校我学汉语今天下午"], "correctIndex": 0, "explanation": "Trật tự vàng: Chủ ngữ (我) + Thời gian (今天下午) + Địa điểm (在学校) + Động từ tân ngữ (学汉语)."},
      {"id": "q-120-2", "type": "multiple-choice", "question": "Số lượng từ vựng cốt lõi mà người học làm chủ sau khi hoàn thành Level 1 là:", "options": ["50 từ", "100 từ", "150 từ vựng cốt lõi", "1000 từ"], "correctIndex": 2, "explanation": "HSK 1 trang bị chuẩn 150 từ vựng quốc tế và hệ thống ngữ âm nền móng."}
    ],
    "step9_challenge": {"title": "Vinh danh Tốt nghiệp HSK 1", "taskDesc": "Đọc to câu tuyên bố hoàn thành Level 1 và mở khóa Boss Đấu trường Sanlitun!", "targetPhrase": "wǒ zhǔnbèi hǎo le hsk yī jí tōngguān", "xpReward": 100, "badge": "Tốt Nghiệp HSK 1 Xuất Sắc"}
  }
]

print(f"Loaded {len(MODULE_1_4_LESSONS)} lessons for Module 1.4")
