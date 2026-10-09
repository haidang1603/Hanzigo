# -*- coding: utf-8 -*-
"""
Level 2 Curriculum Lessons (211 to 220) - Modules 2.3 & 2.4 (HSK 2 Completion)
Strictly adheres to docs/HANZIGO_CHINESE_CURRICULUM.md
"""

LEVEL_2_MODULES_3_AND_4 = [
  # =========================================================================
  # MODULE 2.3: THỜI TIẾT, SO SÁNH & SỨC KHỎE (BÀI 211-215, ch-7)
  # =========================================================================

  # --- LESSON 211 ---
  {
    "id": "l-211", "chapterId": "ch-7", "levelId": "lvl-2", "lessonNumber": 11,
    "title": "Bốn mùa & Hiện tượng thời tiết (刮风, 下雪, 晴天)",
    "chineseTitle": "四季气候与天气现象（春夏秋冬）",
    "subtitle": "4 mùa trong năm (xuân, hạ, thu, đông) và các hiện tượng thời tiết gió, mưa tuyết, trời quang.",
    "objective": "Miêu tả được khí hậu các mùa trong năm và các hiện tượng thời tiết quen thuộc.",
    "prerequisite": "Đã hoàn thành Module 2.2.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng câu miêu tả thời tiết 4 mùa.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Thời tiết", "Bốn mùa", "下雪", "晴天"],
    "relatedMaterialIds": ["mat-2", "mat-6"],
    "step1_learn": {
      "topic": "4 Mùa: 春 (chūn - xuân), 夏 (xià - hạ), 秋 (qiū - thu), 冬 (dōng - đông)",
      "summary": "Hiện tượng thời tiết phong phú: 晴天 (qíngtiān - trời nắng ráo), 阴天 (yīntiān - trời râm u ám), 刮风 (guāfēng - gió thổi), 下雪 (xiàxuě - tuyết rơi).",
      "audioDemoText": "chūn xià qiū dōng, jīntiān shì qíngtiān, běijīng dōngtiān huì xiàxuě"
    },
    "step2_vocabulary": [
      {"id": "v-211-1", "hanzi": "晴天", "pinyin": "qíngtiān", "hanviet": "Tình thiên", "meaning": "Trời nắng, trời quang", "radical": "日 (Nhật)", "example": {"hanzi": "今天是晴天。", "pinyin": "Jīntiān shì qíngtiān.", "meaning": "Hôm nay trời nắng ráo."}},
      {"id": "v-211-2", "hanzi": "阴天", "pinyin": "yīntiān", "hanviet": " m thiên", "meaning": "Trời âm u, trời râm", "radical": "阝 (Phụ)", "example": {"hanzi": "阴天要带伞。", "pinyin": "Yīntiān yào dài sǎn.", "meaning": "Trời râm nhớ mang ô."}},
      {"id": "v-211-3", "hanzi": "下雪", "pinyin": "xià xuě", "hanviet": "Hạ tuyết", "meaning": "Tuyết rơi", "radical": "雨 (Vũ)", "example": {"hanzi": "外面下雪了。", "pinyin": "Wàimiàn xià xuě le.", "meaning": "Bên ngoài tuyết rơi rồi."}},
      {"id": "v-211-4", "hanzi": "刮风", "pinyin": "guā fēng", "hanviet": "Quát phong", "meaning": "Gió thổi, có gió", "radical": "舌 (Thiệt)", "example": {"hanzi": "刮大风。", "pinyin": "Guā dà fēng.", "meaning": "Gió thổi lớn."}},
      {"id": "v-211-5", "hanzi": "春天", "pinyin": "chūntiān", "hanviet": "Xuân thiên", "meaning": "Mùa xuân", "radical": "日 (Nhật)", "example": {"hanzi": "春天很暖和。", "pinyin": "Chūntiān hěn nuǎnhuo.", "meaning": "Mùa xuân rất ấm áp."}},
      {"id": "v-211-6", "hanzi": "冬天", "pinyin": "dōngtiān", "hanviet": "Đông thiên", "meaning": "Mùa đông", "radical": "夂 (Tri)", "example": {"hanzi": "冬天很冷。", "pinyin": "Dōngtiān hěn lěng.", "meaning": "Mùa đông rất lạnh."}}
    ],
    "step3_hanzi": [
      {"hanzi": "晴", "pinyin": "qíng", "meaning": "Trời quang mây tạnh", "strokesCount": 12, "strokeOrderText": "Bộ Nhật (日) bên trái -> Chữ Thanh (青) bên phải", "components": "日 + 青", "mnemonic": "Mặt trời (Nhật) soi rọi trời xanh (Thanh) trong trẻo."},
      {"hanzi": "雪", "pinyin": "xuě", "meaning": "Tuyết trắng", "strokesCount": 11, "strokeOrderText": "Bộ Vũ (雨) ở trên -> Bộ Ký (彐) ở dưới", "components": "雨 + 彐", "mnemonic": "Mưa rơi (Vũ) trong giá lạnh tích tụ thành tuyết trắng."}
    ],
    "step4_grammar": {
      "title": "Cách diễn đạt hiện tượng thời tiết đang xảy ra",
      "formula": "外面 + 下雪了 / 刮风了 / 下雨了",
      "explanation": "Thêm trợ từ 了 ở cuối cụm từ để báo hiệu sự thay đổi của thời tiết (đã bắt đầu có tuyết rơi hoặc nổi gió).",
      "examples": [{"hanzi": "外面刮风了，穿多一点儿衣服吧！", "pinyin": "Wàimiàn guā fēng le, chuān duō yìdiǎnr yīfu ba!", "meaning": "Bên ngoài nổi gió rồi, mặc nhiều quần áo một chút đi!"}],
      "commonMistake": {"wrong": "风刮 ❌", "correct": "刮风 ✔️", "explanation": "Động từ 刮 đứng trước danh từ 风."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "今天北京天气怎么样？", "pinyin": "Jīntiān Běijīng tiānqì zěnmeyàng?", "meaning": "Hôm nay thời tiết Bắc Kinh thế nào?"},
        {"speaker": "B", "hanzi": "今天阴天，外面刮风了，下午可能会下雪。", "pinyin": "Jīntiān yīntiān, wàimiàn guā fēng le, xiàwǔ kěnéng huì xià xuě.", "meaning": "Hôm nay trời âm u, bên ngoài nổi gió rồi, buổi chiều có thể sẽ có tuyết rơi đấy."}
      ],
      "audioText": "今天阴天，外面刮风了，下午可能会下雪。",
      "question": "Buổi chiều dự báo có thể xảy ra hiện tượng gì?",
      "options": ["Nắng to", "Trời có thể sẽ có tuyết rơi (xià xuě)", "Mưa đá", "Trời ấm áp"],
      "correctIndex": 1, "explanation": "B nói: 下午可能会下雪."
    },
    "step6_speaking": {"prompt": "Nói bên ngoài đang có gió thổi:", "targetSentence": "外面刮风了。", "targetPinyin": "Wàimiàn guā fēng le.", "targetMeaning": "Bên ngoài gió thổi rồi.", "hint": "Đọc guā fēng thanh 1 rõ ràng."},
    "step7_writing": {"prompt": "Sắp xếp câu: Hôm nay là trời nắng", "words": ["晴天", "今天", "是"], "correctOrder": ["今天", "是", "晴天"], "explanation": "今天 + 是 + 晴天."},
    "step8_quiz": [
      {"id": "q-211-1", "type": "multiple-choice", "question": "Từ nào sau đây mang nghĩa là 'Tuyết rơi'?", "options": ["下雨 (xià yǔ)", "下雪 (xià xuě)", "刮风 (guā fēng)", "阴天 (yīntiān)"], "correctIndex": 1, "explanation": "下雪 là tuyết rơi."},
      {"id": "q-211-2", "type": "multiple-choice", "question": "Mùa xuân trong tiếng Trung là gì?", "options": ["春天 (chūntiān)", "夏天 (xiàtiān)", "秋天 (qiūtiān)", "冬天 (dōngtiān)"], "correctIndex": 0, "explanation": "Mùa xuân là 春天."}
    ],
    "step9_challenge": {"title": "Thời tiết 4 phương", "taskDesc": "Đọc to câu miêu tả thời tiết mùa đông Bắc Kinh có tuyết rơi rất lạnh.", "targetPhrase": "běijīng dōngtiān hěn lěng huì xiàxuě", "xpReward": 50, "badge": "Sứ Giả Bốn Mùa"}
  },

  # --- LESSON 212 ---
  {
    "id": "l-212", "chapterId": "ch-7", "levelId": "lvl-2", "lessonNumber": 12,
    "title": "Câu so sánh hơn với chữ 比 (A 比 B + Tính từ)",
    "chineseTitle": "比较句与介词“比”（今天比昨天冷）",
    "subtitle": "Ngữ pháp trọng điểm bậc nhất HSK 2: Cấu trúc so sánh hơn với chữ 比 và dạng phủ định 没有.",
    "objective": "Sử dụng thành thạo câu chữ 比 để so sánh hai người hoặc hai sự vật hiện tượng.",
    "prerequisite": "Đã hoàn thành Bài 211.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đặt được 2 câu so sánh đúng cú pháp.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Câu chữ 比", "So sánh hơn", "Ngữ pháp trọng điểm"],
    "relatedMaterialIds": ["mat-2", "mat-4"],
    "step1_learn": {
      "topic": "Công thức câu so sánh hơn: A + 比 (bǐ) + B + Tính từ",
      "summary": "Tiếng Trung so sánh hơn: A 比 B + Tính từ (今天比昨天冷 - Hôm nay lạnh hơn hôm qua). Phủ định so sánh: A 没有 B + Tính từ (A không bằng B: 昨天没有今天冷).",
      "audioDemoText": "jīntiān bǐ zuótiān lěng, gēge bǐ wǒ gāo, tā méiyǒu wǒ dà"
    },
    "step2_vocabulary": [
      {"id": "v-212-1", "hanzi": "比", "pinyin": "bǐ", "hanviet": "Tỷ", "meaning": "So với, hơn", "radical": "比 (Tỷ)", "example": {"hanzi": "他比我大两岁。", "pinyin": "Tā bǐ wǒ dà liǎng suì.", "meaning": "Anh ấy lớn hơn tôi 2 tuổi."}},
      {"id": "v-212-2", "hanzi": "高", "pinyin": "gāo", "hanviet": "Cao", "meaning": "Cao", "radical": "高 (Cao)", "example": {"hanzi": "姚明很高。", "pinyin": "Yáo Míng hěn gāo.", "meaning": "Diêu Minh rất cao."}},
      {"id": "v-212-3", "hanzi": "矮", "pinyin": "ǎi", "hanviet": "Ải", "meaning": "Thấp, lùn", "radical": "矢 (Thỉ)", "example": {"hanzi": "弟弟比我矮。", "pinyin": "Dìdi bǐ wǒ ǎi.", "meaning": "Em trai thấp hơn tôi."}},
      {"id": "v-212-4", "hanzi": "长", "pinyin": "cháng", "hanviet": "Trường", "meaning": "Dài", "radical": "长 (Trường)", "example": {"hanzi": "这件衣服比较长。", "pinyin": "Zhè jiàn yīfu bǐjiào cháng.", "meaning": "Chiếc áo này tương đối dài."}},
      {"id": "v-212-5", "hanzi": "短", "pinyin": "duǎn", "hanviet": "Đoản", "meaning": "Ngắn", "radical": "矢 (Thỉ)", "example": {"hanzi": "头发很短。", "pinyin": "Tóufa hěn duǎn.", "meaning": "Tóc rất ngắn."}}
    ],
    "step3_hanzi": [
      {"hanzi": "比", "pinyin": "bǐ", "meaning": "So sánh, hơn kém", "strokesCount": 4, "strokeOrderText": "Ngang -> Sổ ngắn -> Phẩy -> Sổ cong móc", "components": "Bộ Tỷ (比)", "mnemonic": "Hình tượng hai người đứng cạnh nhau để so đọ chiều cao."},
      {"hanzi": "高", "pinyin": "gāo", "meaning": "To lớn, cao ráo", "strokesCount": 10, "strokeOrderText": "Chấm -> Ngang -> Khẩu -> Quynh -> Khẩu", "components": "Bộ Cao (高)", "mnemonic": "Hình ảnh tòa tháp cao vút tầng tầng lớp lớp hướng lên trời."}
    ],
    "step4_grammar": {
      "title": "Quy tắc vàng: Tuyệt đối KHÔNG dùng 很 trong câu chữ 比",
      "formula": "A + 比 + B + Tính từ (KHÔNG DÙNG: A 比 B 很 + Tính từ ❌)",
      "explanation": "Trong câu chữ 比, sự so sánh đã thể hiện tính chênh lệch. Dùng thêm 很 sẽ bị coi là lỗi ngữ pháp nghiêm trọng.",
      "examples": [{"hanzi": "今天比昨天冷。（ĐÚNG）  /  今天比昨天很冷。（SAI ❌）", "pinyin": "Jīntiān bǐ zuótiān lěng.", "meaning": "Hôm nay lạnh hơn hôm qua."}],
      "commonMistake": {"wrong": "他比我很高 ❌", "correct": "他比我高 ✔️", "explanation": "Trong câu chữ 比 tuyệt đối không cho 很 đứng trước tính từ."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "今天天气怎么样？冷不冷？", "pinyin": "Jīntiān tiānqì zěnmeyàng? Lěng bu lěng?", "meaning": "Thời tiết hôm nay thế nào? Lạnh không?"},
        {"speaker": "B", "hanzi": "今天比昨天冷多了，你出门多穿点儿。", "pinyin": "Jīntiān bǐ zuótiān lěng duō le, nǐ chūmén duō chuān diǎnr.", "meaning": "Hôm nay lạnh hơn hôm qua nhiều lắm, bạn ra ngoài nhớ mặc nhiều áo vào."}
      ],
      "audioText": "今天比昨天冷多了，你出门多穿点儿。",
      "question": "So sánh thời tiết hôm nay và hôm qua như thế nào?",
      "options": ["Hôm nay ấm hơn hôm qua", "Hôm nay lạnh hơn hôm qua nhiều (bǐ zuótiān lěng duō le)", "Hai ngày như nhau", "Hôm qua lạnh hơn"],
      "correctIndex": 1, "explanation": "B nói: 今天比昨天冷多了."
    },
    "step6_speaking": {"prompt": "Đọc câu so sánh: Hôm nay lạnh hơn hôm qua:", "targetSentence": "今天比昨天冷。", "targetPinyin": "Jīntiān bǐ zuótiān lěng.", "targetMeaning": "Hôm nay lạnh hơn hôm qua.", "hint": "Đọc mượt mà bǐ zuótiān lěng, không thêm 很."},
    "step7_writing": {"prompt": "Sắp xếp câu: Anh trai cao hơn tôi", "words": ["我", "高", "哥哥", "比"], "correctOrder": ["哥哥", "比", "我", "高"], "explanation": "哥哥 + 比 + 我 + 高."},
    "step8_quiz": [
      {"id": "q-212-1", "type": "multiple-choice", "question": "Câu so sánh nào sau đây đúng ngữ pháp?", "options": ["他比我很高", "他比我高", "高他比我", "他我比高"], "correctIndex": 1, "explanation": "Không dùng 很 trong câu chữ 比: 他比我高."},
      {"id": "q-212-2", "type": "multiple-choice", "question": "Dạng phủ định của 'Hôm nay lạnh hơn hôm qua' là:", "options": ["今天不比昨天冷", "今天没有昨天冷", "今天比昨天没冷", "今天冷没有昨天"], "correctIndex": 1, "explanation": "Phủ định so sánh dùng 没有: 今天没有昨天冷 (Hôm nay không lạnh bằng hôm qua)."}
    ],
    "step9_challenge": {"title": "Nhà so sánh cừ khôi", "taskDesc": "Đọc to câu so sánh chiều cao hoặc tuổi tác của bạn với một người bạn.", "targetPhrase": "tā bǐ wǒ gāo wǒ bǐ tā dà", "xpReward": 50, "badge": "Bậc Thầy So Sánh"}
  },

  # --- LESSON 213 ---
  {
    "id": "l-213", "chapterId": "ch-7", "levelId": "lvl-2", "lessonNumber": 13,
    "title": "So sánh mức độ nâng cao với 更, 最 (Càng & Nhất)",
    "chineseTitle": "程度副词“更”与“最”（更漂亮、最好）",
    "subtitle": "Biểu thị mức độ cao hơn nữa với 更 (gèng - càng) và mức độ tuyệt đối với 最 (zuì - nhất).",
    "objective": "Sử dụng 更 và 最 để diễn tả mức độ tăng tiến và sở thích nhất trong đời sống.",
    "prerequisite": "Đã hoàn thành Bài 212.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng 更 và 最.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "So sánh bậc nhất", "更", "最", "Càng", "Nhất"],
    "relatedMaterialIds": ["mat-2", "mat-4"],
    "step1_learn": {
      "topic": "Phó từ mức độ: 更 (gèng - Càng hơn nữa) & 最 (zuì - Nhất, tuyệt đối)",
      "summary": "更 đứng trước tính từ để biểu đạt mức độ vượt trội hơn nữa (这件更漂亮 - Cái này càng đẹp hơn). 最 đứng trước tính từ/tâm lý để biểu đạt nhất (最好 - Tốt nhất, 最喜欢 - Thích nhất).",
      "audioDemoText": "zhè jiàn gèng piàoliang, wǒ zuì xǐhuan chī běijīng kǎoyā"
    },
    "step2_vocabulary": [
      {"id": "v-213-1", "hanzi": "更", "pinyin": "gèng", "hanviet": "Canh", "meaning": "Càng, hơn nữa", "radical": "曰 (Viết)", "example": {"hanzi": "明天会更冷。", "pinyin": "Míngtiān huì gèng lěng.", "meaning": "Ngày mai sẽ càng lạnh hơn."}},
      {"id": "v-213-2", "hanzi": "最", "pinyin": "zuì", "hanviet": "Tối", "meaning": "Nhất", "radical": "日 (Nhật)", "example": {"hanzi": "我最喜欢你。", "pinyin": "Wǒ zuì xǐhuan nǐ.", "meaning": "Tôi thích bạn nhất."}},
      {"id": "v-213-3", "hanzi": "好", "pinyin": "hǎo", "hanviet": "Hảo", "meaning": "Tốt", "radical": "女 (Nữ)", "example": {"hanzi": "最好的朋友。", "pinyin": "Zuì hǎo de péngyou.", "meaning": "Người bạn tốt nhất."}},
      {"id": "v-213-4", "hanzi": "漂亮", "pinyin": "piàoliang", "hanviet": "Phiêu lượng", "meaning": "Xinh đẹp, đẹp đẽ", "radical": "氵 (Thủy)", "example": {"hanzi": "她真漂亮！", "pinyin": "Tā zhēn piàoliang!", "meaning": "Cô ấy thật là xinh đẹp!"}}
    ],
    "step3_hanzi": [
      {"hanzi": "更", "pinyin": "gèng", "meaning": "Càng, thay đổi", "strokesCount": 7, "strokeOrderText": "Ngang -> Nhật (日) -> Phẩy dài -> Mác", "components": "一 + 日 + 乂", "mnemonic": "Mỗi ngày mới trôi qua sự việc càng thêm tiến triển."},
      {"hanzi": "最", "pinyin": "zuì", "meaning": "Tối, đứng đầu, nhất", "strokesCount": 12, "strokeOrderText": "Bộ Nhật (日) ở trên -> Chữ Thủ (取) ở dưới", "components": "日 + 耳 + 又", "mnemonic": "Dưới ánh mặt trời, lấy được phần thưởng cao nhất đứng đầu."}
    ],
    "step4_grammar": {
      "title": "Vị trí của phó từ 更 và 最 trong câu",
      "formula": "Chủ ngữ + 更 / 最 + Tính từ / Động từ chỉ cảm xúc (喜欢, 想)",
      "explanation": "Khác với tiếng Việt (Đẹp nhất -> Tiếng Trung: 最漂亮 = Nhất đẹp; Thích nhất -> 最喜欢 = Nhất thích). Phó từ luôn đứng trước từ nó bổ nghĩa.",
      "examples": [{"hanzi": "在所有中国菜里，我最喜欢吃饺子。", "pinyin": "Zài suǒyǒu Zhōngguó cài lǐ, wǒ zuì xǐhuan chī jiǎozi.", "meaning": "Trong tất cả các món ăn Trung Quốc, tôi thích ăn sủi cảo nhất."}],
      "commonMistake": {"wrong": "我喜欢最饺子 ❌", "correct": "我最喜欢饺子 ✔️", "explanation": "最 luôn đứng trước động từ/tính từ."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "你觉得这件衣服怎么样？", "pinyin": "Nǐ juéde zhè jiàn yīfu zěnmeyàng?", "meaning": "Bạn thấy chiếc áo này thế nào?"},
        {"speaker": "B", "hanzi": "这件很好看，但那件红色的更漂亮，而且价格最便宜！", "pinyin": "Zhè jiàn hěn hǎokàn, dàn nà jiàn hóngsè de gèng piàoliang, érqiě jiàgé zuì piányi!", "meaning": "Chiếc này rất đẹp, nhưng chiếc màu đỏ kia càng đẹp hơn, vả lại giá còn rẻ nhất nữa!"}
      ],
      "audioText": "那件红色的更漂亮，而且价格最便宜！",
      "question": "Chiếc áo màu đỏ có đặc điểm gì?",
      "options": ["Đắt nhất", "Càng đẹp hơn và giá rẻ nhất (gèng piàoliang, zuì piányi)", "Xấu hơn", "Hơi nhỏ"],
      "correctIndex": 1, "explanation": "B nói: 更漂亮，价格最便宜."
    },
    "step6_speaking": {"prompt": "Nói món ăn bạn thích nhất:", "targetSentence": "我最喜欢中国菜。", "targetPinyin": "Wǒ zuì xǐhuan Zhōngguó cài.", "targetMeaning": "Tôi thích nhất món ăn Trung Quốc.", "hint": "Đọc zuì xǐhuan liền mạch."},
    "step7_writing": {"prompt": "Sắp xếp câu: Ngày mai sẽ càng lạnh hơn", "words": ["会更冷", "明天"], "correctOrder": ["明天", "会更冷"], "explanation": "明天 + 会更冷."},
    "step8_quiz": [
      {"id": "q-213-1", "type": "multiple-choice", "question": "Cách nói 'Người bạn tốt nhất' trong tiếng Trung là:", "options": ["朋友最好", "最好的朋友 (zuì hǎo de péngyou)", "最好朋友", "更朋友好"], "correctIndex": 1, "explanation": "Định ngữ đứng trước: 最好的朋友."},
      {"id": "q-213-2", "type": "multiple-choice", "question": "Từ '更' (gèng) mang ý nghĩa là gì?", "options": ["Kém hơn", "Càng / Hơn nữa", "Bằng nhau", "Không thích"], "correctIndex": 1, "explanation": "更 mang nghĩa là càng, hơn nữa."}
    ],
    "step9_challenge": {"title": "Khẳng định ngôi vị số một", "taskDesc": "Đọc to câu: 'Đây là điều tôi yêu thích nhất trong cuộc sống'.", "targetPhrase": "zhè shì wǒ zuì xǐhuan de", "xpReward": 50, "badge": "Bậc Thầy Tối Thượng"}
  },

  # --- LESSON 214 ---
  {
    "id": "l-214", "chapterId": "ch-7", "levelId": "lvl-2", "lessonNumber": 14,
    "title": "Sức khỏe & Đi khám bệnh (生病, 感冒, 发烧, 吃药)",
    "chineseTitle": "身体健康与医院看病（感冒发烧与吃药）",
    "subtitle": "Khai báo triệu chứng sức khỏe với bác sĩ: ốm (生病), cảm cúm (感冒), sốt (发烧), uống thuốc (吃药).",
    "objective": "Trình bày được tình trạng sức khỏe không khỏe và hiểu lời dặn uống thuốc của bác sĩ.",
    "prerequisite": "Đã hoàn thành Bài 213.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng các triệu chứng bệnh thường gặp.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Sức khỏe", "Bệnh viện", "感冒", "发烧", "吃药"],
    "relatedMaterialIds": ["mat-2", "mat-6"],
    "step1_learn": {
      "topic": "Miêu tả sức khỏe: 身体 (shēntǐ - cơ thể/sức khỏe), 生病 (shēngbìng - bị ốm)",
      "summary": "Triệu chứng thông thường: 感冒 (gǎnmào - cảm cúm), 发烧 (fāshāo - phát sốt), 头疼 (tóuténg - đau đầu). Giải pháp y tế: 看医生 (khám bác sĩ), 吃药 (uống thuốc - chú ý tiếng Trung dùng động từ 吃 cho thuốc).",
      "audioDemoText": "wǒ shēntǐ bú shūfu, wǒ fāshāo le, yīsheng ràng wǒ chī yào"
    },
    "step2_vocabulary": [
      {"id": "v-214-1", "hanzi": "身体", "pinyin": "shēntǐ", "hanviet": "Thân thể", "meaning": "Cơ thể, sức khỏe", "radical": "身 (Thân)", "example": {"hanzi": "身体健康。", "pinyin": "Shēntǐ jiànkāng.", "meaning": "Sức khỏe dồi dào."}},
      {"id": "v-214-2", "hanzi": "生病", "pinyin": "shēngbìng", "hanviet": "Sinh bệnh", "meaning": "Bị ốm, mắc bệnh", "radical": "疒 (Nạch)", "example": {"hanzi": "他生病住院了。", "pinyin": "Tā shēngbìng zhùyuàn le.", "meaning": "Anh ấy ốm phải nhập viện rồi."}},
      {"id": "v-214-3", "hanzi": "感冒", "pinyin": "gǎnmào", "hanviet": "Cảm mạo", "meaning": "Cảm cúm", "radical": "心 (Tâm)", "example": {"hanzi": "我感冒了。", "pinyin": "Wǒ gǎnmào le.", "meaning": "Tôi bị cảm cúm rồi."}},
      {"id": "v-214-4", "hanzi": "发烧", "pinyin": "fāshāo", "hanviet": "Phát thiêu", "meaning": "Sốt, phát sốt", "radical": "火 (Hỏa)", "example": {"hanzi": "三十八度，发烧了。", "pinyin": "Sānshíbā dù, fāshāo le.", "meaning": "38 độ, sốt rồi."}},
      {"id": "v-214-5", "hanzi": "药", "pinyin": "yào", "hanviet": "Dược", "meaning": "Thuốc", "radical": "艹 (Thảo)", "example": {"hanzi": "记得按时吃药。", "pinyin": "Jìde ànshí chī yào.", "meaning": "Nhớ uống thuốc đúng giờ."}},
      {"id": "v-214-6", "hanzi": "舒服", "pinyin": "shūfu", "hanviet": "Thư phục", "meaning": "Dễ chịu, thoải mái", "radical": "矢 (Thỉ)", "example": {"hanzi": "我不舒服。", "pinyin": "Wǒ bù shūfu.", "meaning": "Tôi thấy không được khỏe."}}
    ],
    "step3_hanzi": [
      {"hanzi": "病", "pinyin": "bìng", "meaning": "Bệnh tật, ốm đau", "strokesCount": 10, "strokeOrderText": "Bộ Nạch (疒) bao ngoài -> Chữ Bính (丙) bên trong", "components": "疒 + 丙", "mnemonic": "Người nằm trên giường bệnh (bộ Nạch 疒) đang bị ốm đau."},
      {"hanzi": "药", "pinyin": "yào", "meaning": "Thuốc men (Dược)", "strokesCount": 9, "strokeOrderText": "Bộ Thảo (艹) ở trên -> Chữ Ước (约) ở dưới", "components": "艹 + 约", "mnemonic": "Cây cỏ thảo mộc (艹) hẹn ước giúp chữa lành bệnh tật."}
    ],
    "step4_grammar": {
      "title": "Cảnh báo dùng từ: Người Trung Quốc nói 'ĂN THUỐC' (吃药), không nói 喝药",
      "formula": "吃药 (chī yào - Uống thuốc viên/thuốc tây nói chung)",
      "explanation": "Trong tiếng Việt ta nói 'uống thuốc', nhưng trong tiếng Trung tiêu chuẩn bắt buộc dùng động từ 吃 (chī yào). Chỉ khi thuốc là thuốc nước bắc đun sôi người ta mới dùng 喝中药.",
      "examples": [{"hanzi": "医生说一天吃三次药。", "pinyin": "Yīshēng shuō yì tiān chī sān cì yào.", "meaning": "Bác sĩ nói mỗi ngày uống thuốc 3 lần."}],
      "commonMistake": {"wrong": "喝药 ❌ (nghe giống uống thuốc độc)", "correct": "吃药 ✔️", "explanation": "Thuốc tây viên uống luôn dùng 吃药."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Bác sĩ", "hanzi": "你哪里不舒服？", "pinyin": "Nǐ nǎlǐ bù shūfu?", "meaning": "Cháu thấy không khỏe ở chỗ nào?"},
        {"speaker": "Bệnh nhân", "hanzi": "医生，我头疼，昨天晚上发烧三十八度五，好像感冒了。", "pinyin": "Yīshēng, wǒ tóuténg, zuótiān wǎnshang fāshāo sānshíbā dù wǔ, hǎoxiàng gǎnmào le.", "meaning": "Bác sĩ ơi, cháu bị đau đầu, tối qua sốt 38.5 độ, hình như bị cảm cúm rồi ạ."}
      ],
      "audioText": "我头疼，昨天晚上发烧三十八度五，好像感冒了。",
      "question": "Bệnh nhân gặp phải những triệu chứng gì?",
      "options": ["Đau chân", "Đau đầu và sốt 38.5 độ (tóuténg, fāshāo)", "Đau bụng do ăn no", "Không bị làm sao"],
      "correctIndex": 1, "explanation": "Bệnh nhân nói: 头疼，发烧三十八度五."
    },
    "step6_speaking": {"prompt": "Nói tình trạng bạn bị cảm sốt với bác sĩ:", "targetSentence": "我感冒发烧了。", "targetPinyin": "Wǒ gǎnmào fāshāo le.", "targetMeaning": "Tôi bị cảm sốt rồi.", "hint": "Đọc gǎnmào thanh 3 và 4, fāshāo thanh 1."},
    "step7_writing": {"prompt": "Sắp xếp câu: Nhớ uống thuốc đúng giờ", "words": ["吃药", "按时", "记得"], "correctOrder": ["记得", "按时", "吃药"], "explanation": "记得 + 按时 + 吃药."},
    "step8_quiz": [
      {"id": "q-214-1", "type": "multiple-choice", "question": "Từ tiếng Trung chuẩn xác để nói 'uống thuốc' là:", "options": ["喝药", "吃药 (chī yào)", "买药", "看药"], "correctIndex": 1, "explanation": "Tiếng Trung dùng động từ 吃 cho thuốc: 吃药."},
      {"id": "q-214-2", "type": "multiple-choice", "question": "Cụm '不舒服' (bù shūfu) dùng để biểu thị:", "options": ["Rất khỏe mạnh", "Không thoải mái / Trong người không khỏe", "Rất vui vẻ", "Rất đói bụng"], "correctIndex": 1, "explanation": "Không khỏe trong người là 不舒服."}
    ],
    "step9_challenge": {"title": "Bệnh án tự thuật", "taskDesc": "Đọc to câu miêu tả: 'Hôm nay tôi thấy không được khỏe, bị cảm sốt nên phải đi khám bác sĩ'.", "targetPhrase": "wǒ jīntiān bù shūfu gǎnmào fāshāo le", "xpReward": 50, "badge": "Tự Chăm Sóc Bản Thân"}
  },

  # --- LESSON 215 ---
  {
    "id": "l-215", "chapterId": "ch-7", "levelId": "lvl-2", "lessonNumber": 15,
    "title": "Xin nghỉ phép & Lời khuyên ân cần (请假, 休息, 多喝水)",
    "chineseTitle": "请假条与健康叮嘱（请假与多喝水）",
    "subtitle": "Kỹ năng xin nghỉ học/nghỉ làm với 请假 (qǐngjià), lời khuyên nghỉ ngơi (休息) và uống nhiều nước ấm.",
    "objective": "Viết được tin nhắn hoặc nói lời xin phép nghỉ ốm lịch sự với giáo viên/sếp.",
    "prerequisite": "Đã hoàn thành Bài 214.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói trọn vẹn câu xin nghỉ phép.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Xin nghỉ phép", "请假", "休息", "多喝水"],
    "relatedMaterialIds": ["mat-2", "mat-6"],
    "step1_learn": {
      "topic": "Mẫu câu xin nghỉ phép: 老师/经理，我想请假 (Lǎoshī/Jīnglǐ, wǒ xiǎng qǐngjià)",
      "summary": "请假 (qǐngjià) là xin nghỉ phép. 休息 (xiūxi) là nghỉ ngơi. Cấu trúc khuyên nhủ: 多 + Động từ (多喝水 - Uống nhiều nước, 多休息 - Nghỉ ngơi nhiều).",
      "audioDemoText": "lǎoshī wǒ shēngbìng le xiǎng qǐngjià yì tiān, nǐ hǎohao xiūxi duō hē shuǐ"
    },
    "step2_vocabulary": [
      {"id": "v-215-1", "hanzi": "请假", "pinyin": "qǐngjià", "hanviet": "Thỉnh giả", "meaning": "Xin nghỉ phép", "radical": "讠 (Ngôn)", "example": {"hanzi": "我想请假两天。", "pinyin": "Wǒ xiǎng qǐngjià liǎng tiān.", "meaning": "Tôi muốn xin nghỉ phép 2 ngày."}},
      {"id": "v-215-2", "hanzi": "休息", "pinyin": "xiūxi", "hanviet": "Hưu tức", "meaning": "Nghỉ ngơi", "radical": "亻 (Nhân)", "example": {"hanzi": "好好休息。", "pinyin": "Hǎohāo xiūxi.", "meaning": "Nghỉ ngơi thật tốt nhé."}},
      {"id": "v-215-3", "hanzi": "多", "pinyin": "duō", "hanviet": "Đa", "meaning": "Nhiều (làm gì nhiều hơn)", "radical": "夕 (Tịch)", "example": {"hanzi": "多喝热水。", "pinyin": "Duō hē rèshuǐ.", "meaning": "Uống nhiều nước ấm."}},
      {"id": "v-215-4", "hanzi": "能不能", "pinyin": "néng bu néng", "hanviet": "Năng bất năng", "meaning": "Có thể...hay không", "radical": "月 (Nguyệt)", "example": {"hanzi": "能不能帮我？", "pinyin": "Néng bu néng bāng wǒ?", "meaning": "Có thể giúp tôi được không?"}}
    ],
    "step3_hanzi": [
      {"hanzi": "休", "pinyin": "xiū", "meaning": "Nghỉ ngơi (Hưu)", "strokesCount": 6, "strokeOrderText": "Bộ Nhân đứng (亻) bên trái -> Bộ Mộc (木) bên phải", "components": "亻 + 木", "mnemonic": "Con người (亻) tựa lưng vào gốc cây (木) để nghỉ ngơi."},
      {"hanzi": "息", "pinyin": "xī", "meaning": "Hơi thở, nghỉ dưỡng", "strokesCount": 10, "strokeOrderText": "Bộ Tự (自) ở trên -> Bộ Tâm (心) ở dưới", "components": "自 + 心", "mnemonic": "Tự bản thân (自) lắng nghe hơi thở con tim (心) trong tĩnh lặng."}
    ],
    "step4_grammar": {
      "title": "Cấu trúc khuyên bảo làm gì nhiều hơn: 多 + Động từ + Tân ngữ",
      "formula": "多 + Động từ (多喝水 / 多吃水果 / 多休息)",
      "explanation": "Trong tiếng Trung, phó từ 多 đứng trước động từ để khuyên ai đó nên thực hiện hành động gì nhiều hơn.",
      "examples": [{"hanzi": "感冒的时候要多喝温水，多睡觉。", "pinyin": "Gǎnmào de shíhou yào duō hē wēnshuǐ, duō shuìjiào.", "meaning": "Khi bị cảm cúm cần uống nhiều nước ấm và ngủ nhiều hơn."}],
      "commonMistake": {"wrong": "喝水多 ❌", "correct": "多喝水 ✔️", "explanation": "Từ 多 phải đứng trước động từ 喝."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Học sinh", "hanzi": "王老师，我今天感冒发烧了，头很疼，想请假一天去医院看病。", "pinyin": "Wáng lǎoshī, wǒ jīntiān gǎnmào fāshāo le, tóu hěn téng, xiǎng qǐngjià yì tiān qù yīyuàn kànbìng.", "meaning": "Thưa thầy Vương, hôm nay em bị cảm sốt, đầu rất đau, em muốn xin phép nghỉ 1 ngày đi viện khám ạ."},
        {"speaker": "Thầy giáo", "hanzi": "好的，你好好休息，多喝水，按时吃药，祝你早日康复！", "pinyin": "Hǎo de, nǐ hǎohāo xiūxi, duō hē shuǐ, ànshí chī yào, zhù nǐ zǎorì kāngfù!", "meaning": "Được rồi, em nghỉ ngơi cho khỏe nhé, uống nhiều nước, nhớ uống thuốc đúng giờ, chúc em sớm bình phục!"}
      ],
      "audioText": "老师，我今天感冒发烧了，想请假一天。好的，你好好休息，多喝水。",
      "question": "Thầy giáo dặn dò học sinh điều gì?",
      "options": ["Phải đến lớp ngay", "Nghỉ ngơi thật tốt và uống nhiều nước (hǎohāo xiūxi, duō hē shuǐ)", "Không được nghỉ học", "Đi chơi thể thao"],
      "correctIndex": 1, "explanation": "Thầy dặn: 好好休息，多喝水."
    },
    "step6_speaking": {"prompt": "Đọc câu xin phép nghỉ 1 ngày:", "targetSentence": "老师，我想请假一天。", "targetPinyin": "Lǎoshī, wǒ xiǎng qǐngjià yì tiān.", "targetMeaning": "Thưa thầy, em muốn xin nghỉ một ngày.", "hint": "Đọc qǐngjià yì tiān trang trọng, lễ phép."},
    "step7_writing": {"prompt": "Sắp xếp câu: Bạn hãy nghỉ ngơi thật tốt nhé", "words": ["休息", "好好", "你"], "correctOrder": ["你", "好好", "休息"], "explanation": "你 + 好好 + 休息."},
    "step8_quiz": [
      {"id": "q-215-1", "type": "multiple-choice", "question": "Từ mang nghĩa 'Xin nghỉ phép' trong tiếng Trung là:", "options": ["放假 (fàngjià)", "请假 (qǐngjià)", "休息 (xiūxi)", "睡觉 (shuìjiào)"], "correctIndex": 1, "explanation": "Xin nghỉ phép là 请假 (qǐngjià)."},
      {"id": "q-215-2", "type": "multiple-choice", "question": "Khuyên ai đó 'uống nhiều nước', câu đúng ngữ pháp là:", "options": ["喝水多", "多喝水 (duō hē shuǐ)", "水多喝", "多水喝"], "correctIndex": 1, "explanation": "Cấu trúc: 多 + Động từ = 多喝水."}
    ],
    "step9_challenge": {"title": "Mở khóa Boss Chapter 7", "taskDesc": "Vượt qua thử thách để chuẩn bị đại chiến giải quyết tình huống y tế và thời tiết!", "targetPhrase": "lǎoshī wǒ bù shūfu xiǎng qǐngjià yì tiān", "xpReward": 60, "badge": "Giao Tế Chu Toàn"}
  },

  # =========================================================================
  # MODULE 2.4: TRẠNG THÁI, CẢM XÚC & TỔNG KẾT HSK 2 (BÀI 216-220, ch-8)
  # =========================================================================

  # --- LESSON 216 ---
  {
    "id": "l-216", "chapterId": "ch-8", "levelId": "lvl-2", "lessonNumber": 16,
    "title": "Trợ từ động thái 着 diễn đạt trạng thái duy trì (门开着呢)",
    "chineseTitle": "动态助词“着”与状态持续（门开着、穿着红衣服）",
    "subtitle": "Làm chủ trợ từ 着 (zhe) biểu thị trạng thái đang tiếp diễn hoặc một tư thế được giữ nguyên.",
    "objective": "Phân biệt cách dùng trợ từ 着 và miêu tả được các trạng thái đồ vật, con người xung quanh.",
    "prerequisite": "Đã hoàn thành Module 2.3.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cấu trúc Động từ + 着.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Trợ từ 着", "Trạng thái duy trì", "Ngữ pháp HSK 2"],
    "relatedMaterialIds": ["mat-2", "mat-4"],
    "step1_learn": {
      "topic": "Trợ từ động thái 着 (zhe): Động từ + 着 + (Tân ngữ) + 呢",
      "summary": "着 biểu thị trạng thái kết quả của hành động đang được duy trì: 门开着 (Cửa đang mở), 穿戴着 (Đang mặc/đeo), 站着 (Đang đứng), 拿着 (Đang cầm trên tay). Phủ định: 没 + Động từ + 着.",
      "audioDemoText": "mén kāi zhe ne, tā chuān zhe hóngsè de yīfu, shǒu lǐ ná zhe yì běn shū"
    },
    "step2_vocabulary": [
      {"id": "v-216-1", "hanzi": "着", "pinyin": "zhe", "hanviet": "Trước", "meaning": "Đang (trợ từ trạng thái)", "radical": "目 (Mục)", "example": {"hanzi": "门开着呢。", "pinyin": "Mén kāi zhe ne.", "meaning": "Cửa đang mở đấy."}},
      {"id": "v-216-2", "hanzi": "开", "pinyin": "kāi", "hanviet": "Khai", "meaning": "Mở, lái xe", "radical": "廾 (Củng)", "example": {"hanzi": "请开门。", "pinyin": "Qǐng kāi mén.", "meaning": "Xin mở cửa."}},
      {"id": "v-216-3", "hanzi": "关", "pinyin": "guān", "hanviet": "Quan", "meaning": "Đóng, tắt", "radical": "丷 (Bát)", "example": {"hanzi": "窗户关着。", "pinyin": "Chuānghu guān zhe.", "meaning": "Cửa sổ đang đóng."}},
      {"id": "v-216-4", "hanzi": "拿", "pinyin": "ná", "hanviet": "Nã", "meaning": "Cầm, nắm, lấy", "radical": "手 (Thủ)", "example": {"hanzi": "手里拿着手机。", "pinyin": "Shǒu lǐ ná zhe shǒujī.", "meaning": "Trong tay đang cầm điện thoại."}},
      {"id": "v-216-5", "hanzi": "站", "pinyin": "zhàn", "hanviet": "Trạm", "meaning": "Đứng, bến trạm", "radical": "立 (Lập)", "example": {"hanzi": "外面站着一个人。", "pinyin": "Wàimiàn zhàn zhe yí gè rén.", "meaning": "Bên ngoài đang đứng một người."}}
    ],
    "step3_hanzi": [
      {"hanzi": "关", "pinyin": "guān", "meaning": "Đóng lại, cửa ải", "strokesCount": 6, "strokeOrderText": "Chấm -> Phẩy -> Ngang trên -> Ngang dưới -> Phẩy -> Mác", "components": "丷 + 天", "mnemonic": "Cánh cổng thành then cài đóng kín bảo vệ sự bình an."},
      {"hanzi": "拿", "pinyin": "ná", "meaning": "Cầm lấy, nắm bắt", "strokesCount": 10, "strokeOrderText": "Chữ Hợp (合) ở trên -> Bộ Thủ (手) ở dưới", "components": "合 + 手", "mnemonic": "Bàn tay (Thủ) chụm hợp lại (Hợp) để cầm nắm đồ vật."}
    ],
    "step4_grammar": {
      "title": "Phân biệt 在 + V (Hành động đang diễn ra) vs V + 着 (Trạng thái duy trì)",
      "formula": "1. Hành động đang tiến hành: 他在穿衣服 (Anh ấy đang xỏ áo vào người). 2. Trạng thái duy trì: 他穿着衣服 (Anh ấy đang mặc chiếc áo trên người).",
      "explanation": "着 nhấn mạnh vào TRẠNG THÁI tĩnh được lưu giữ sau khi hành động đã hoàn tất.",
      "examples": [{"hanzi": "前面站着的那个人是我哥哥。", "pinyin": "Qiánmiàn zhàn zhe de nà ge rén shì wǒ gēge.", "meaning": "Người đang đứng ở phía trước kia là anh trai tôi."}],
      "commonMistake": {"wrong": "门不开展 ❌", "correct": "门没开着 ✔️", "explanation": "Phủ định của trạng thái 着 dùng 没 (không dùng 不)."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "请问，王老师在办公室吗？", "pinyin": "Qǐngwèn, Wáng lǎoshī zài bàngōngshì ma?", "meaning": "Xin hỏi, thầy Vương có ở trong văn phòng không?"},
        {"speaker": "B", "hanzi": "在的，你看，办公室门开着呢，他正坐在里面看书呢。", "pinyin": "Zài de, nǐ kàn, bàngōngshì mén kāi zhe ne, tā zhèng zuò zhe lǐmiàn kàn shū ne.", "meaning": "Có đấy, bạn nhìn kìa, cửa văn phòng đang mở đấy, thầy đang ngồi bên trong đọc sách kìa."}
      ],
      "audioText": "办公室门开着呢，他正坐在里面看书呢。",
      "question": "Thầy Vương đang ở đâu và làm gì?",
      "options": ["Đang đứng ngoài sân", "Đang ngồi đọc sách trong văn phòng cửa mở", "Đã về nhà", "Đang đi dạy học"],
      "correctIndex": 1, "explanation": "B nói: 门开着呢，坐在里面看书."
    },
    "step6_speaking": {"prompt": "Đọc câu miêu tả cửa đang mở:", "targetSentence": "门开着呢。", "targetPinyin": "Mén kāi zhe ne.", "targetMeaning": "Cửa đang mở đấy.", "hint": "Đọc zhe ne là thanh nhẹ lướt êm."},
    "step7_writing": {"prompt": "Sắp xếp câu: Anh ấy đang cầm một quyển sách", "words": ["一本书", "他拿着"], "correctOrder": ["他拿着", "一本书"], "explanation": "他拿着 + 一本书."},
    "step8_quiz": [
      {"id": "q-216-1", "type": "multiple-choice", "question": "Trợ từ '着' trong câu '门开着呢' biểu thị điều gì?", "options": ["Hành động đã qua", "Trạng thái đang được duy trì", "Nguyện vọng tương lai", "So sánh"], "correctIndex": 1, "explanation": "着 biểu thị trạng thái kết quả đang duy trì."},
      {"id": "q-216-2", "type": "multiple-choice", "question": "Phủ định đúng của '他穿着红衣服' là:", "options": ["他不穿着红衣服", "他没穿着红衣服", "他穿没着红衣服", "他红衣服不穿"], "correctIndex": 1, "explanation": "Phủ định của V+着 là 没 + V + 着."}
    ],
    "step9_challenge": {"title": "Bức tranh chuyển động", "taskDesc": "Đọc to câu miêu tả: 'Người đang đứng đằng kia đang mặc chiếc áo màu đỏ'.", "targetPhrase": "nà ge rén chuān zhe hóngsè de yīfu", "xpReward": 50, "badge": "Quan Sát Tinh Tường"}
  },

  # --- LESSON 217 ---
  {
    "id": "l-217", "chapterId": "ch-8", "levelId": "lvl-2", "lessonNumber": 17,
    "title": "Trợ từ động thái 过 diễn đạt trải nghiệm quá khứ (我去过北京)",
    "chineseTitle": "动态助词“过”与人生经历（去过、吃过、没做过）",
    "subtitle": "Diễn đạt 'từng làm gì' trong đời với 过 (guo) và phủ định 'chưa từng' với 没...过.",
    "objective": "Hỏi và chia sẻ các trải nghiệm du lịch, ẩm thực, cuộc sống mà bạn từng làm trong quá khứ.",
    "prerequisite": "Đã hoàn thành Bài 216.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng các trải nghiệm cá nhân với 过.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Trợ từ 过", "Trải nghiệm quá khứ", "我去过北京"],
    "relatedMaterialIds": ["mat-2", "mat-4"],
    "step1_learn": {
      "topic": "Trợ từ động thái 过 (guo - Đã từng): Động từ + 过 + Tân ngữ",
      "summary": "过 nhấn mạnh vào KINH NGHIỆM / TRẢI NGHIỆM đã từng xảy ra trong quá khứ. Phủ định bắt buộc là: 没 + Động từ + 过 (Chưa từng). Tuyệt đối KHÔNG dùng 不 + Động từ + 过.",
      "audioDemoText": "wǒ qù guo běijīng, wǒ chī guo kǎoyā, wǒ méi xué guo fǎyǔ"
    },
    "step2_vocabulary": [
      {"id": "v-217-1", "hanzi": "过", "pinyin": "guo", "hanviet": "Quá", "meaning": "Đã từng (trợ từ kinh nghiệm)", "radical": "辶 (Sước)", "example": {"hanzi": "你去过中国吗？", "pinyin": "Nǐ qù guo Zhōngguó ma?", "meaning": "Bạn từng đi Trung Quốc chưa?"}},
      {"id": "v-217-2", "hanzi": "次", "pinyin": "cì", "hanviet": "Thứ", "meaning": "Lần (lượng từ số lần)", "radical": "欠 (Khiếm)", "example": {"hanzi": "我去过两次。", "pinyin": "Wǒ qù guo liǎng cì.", "meaning": "Tôi từng đi 2 lần rồi."}},
      {"id": "v-217-3", "hanzi": "以前", "pinyin": "yǐqián", "hanviet": "Dĩ tiền", "meaning": "Trước đây, trước kia", "radical": "刀 (Đao)", "example": {"hanzi": "以前我没吃过。", "pinyin": "Yǐqián wǒ méi chī guo.", "meaning": "Trước đây tôi chưa từng ăn."}},
      {"id": "v-217-4", "hanzi": "电影", "pinyin": "diànyǐng", "hanviet": "Điện ảnh", "meaning": "Bộ phim", "radical": "日 (Nhật)", "example": {"hanzi": "我看过这部电影。", "pinyin": "Wǒ kàn guo zhè bù diànyǐng.", "meaning": "Tôi đã từng xem bộ phim này."}}
    ],
    "step3_hanzi": [
      {"hanzi": "过", "pinyin": "guo", "meaning": "Đi qua, đã từng", "strokesCount": 6, "strokeOrderText": "Chữ Thốn (寸) bên trong -> Bộ Sước (辶) bao ngoài", "components": "寸 + 辶", "mnemonic": "Từng tấc bước chân (Thốn + Sước) đã đi qua dòng thời gian dĩ vãng."},
      {"hanzi": "次", "pinyin": "cì", "meaning": "Lần lượt, số lần", "strokesCount": 6, "strokeOrderText": "Bộ Băng (冫) bên trái -> Bộ Khiếm (欠) bên phải", "components": "冫 + 欠", "mnemonic": "Từng lượt từng lần mở miệng đếm số lần trải nghiệm."}
    ],
    "step4_grammar": {
      "title": "Phân biệt 了 (Hành động đã hoàn thành) vs 过 (Trải nghiệm từng làm qua)",
      "formula": "1. Khẳng định: S + V + 过 + O. 2. Phủ định: S + 没(有) + V + 过 + O. 3. Nghi vấn: S + V + 过 + O + 没有 / 吗？",
      "explanation": "Câu chữ 了 nhấn mạnh sự việc ĐÃ XONG (Ví dụ: 我吃了饭 - Tôi ăn cơm xong rồi). Còn 过 nhấn mạnh vào KINH NGHIỆM ĐỜI NGƯỜI (Ví dụ: 我吃过烤鸭 - Tôi từng ăn vịt quay rồi).",
      "examples": [{"hanzi": "我以前没去过北京，这是第一次。", "pinyin": "Wǒ yǐqián méi qù guo Běijīng, zhè shì dì yī cì.", "meaning": "Trước đây tôi chưa từng đến Bắc Kinh, đây là lần đầu tiên."}],
      "commonMistake": {"wrong": "我不去过 ❌", "correct": "我没去过 ✔️", "explanation": "Phủ định của 过 bắt buộc dùng 没(有)."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "你看过中国京剧吗？", "pinyin": "Nǐ kàn guo Zhōngguó Jīngjù ma?", "meaning": "Bạn đã từng xem Kinh kịch Trung Quốc chưa?"},
        {"speaker": "B", "hanzi": "我没看过，但我听过京剧的音乐，很有特色。", "pinyin": "Wǒ méi kàn guo, dàn wǒ tīng guo Jīngjù de yīnyuè, hěn yǒu tèsè.", "meaning": "Tôi chưa từng xem, nhưng tôi từng nghe qua âm nhạc Kinh kịch, rất đặc sắc."}
      ],
      "audioText": "你看过中国京剧吗？我没看过，但我听过京剧的音乐。",
      "question": "Người B đã từng làm điều gì liên quan đến Kinh kịch?",
      "options": ["Đã từng đi diễn Kinh kịch", "Từng nghe âm nhạc Kinh kịch (tīng guo Jīngjù de yīnyuè)", "Từng xem phim Kinh kịch", "Chưa nghe bao giờ"],
      "correctIndex": 1, "explanation": "B nói: 我听过京剧的音乐."
    },
    "step6_speaking": {"prompt": "Khẳng định bạn từng đến Bắc Kinh:", "targetSentence": "我去过北京。", "targetPinyin": "Wǒ qù guo Běijīng.", "targetMeaning": "Tôi đã từng đi Bắc Kinh.", "hint": "Đọc guo là thanh nhẹ lướt êm."},
    "step7_writing": {"prompt": "Sắp xếp câu: Tôi chưa từng ăn món này", "words": ["吃过", "我没", "这个菜"], "correctOrder": ["我没", "吃过", "这个菜"], "explanation": "我没 + 吃过 + 这个菜."},
    "step8_quiz": [
      {"id": "q-217-1", "type": "multiple-choice", "question": "Để nói 'Tôi chưa từng đi Trung Quốc', câu đúng là:", "options": ["我不去过中国", "我没去过中国", "我去不中国", "中国我没去"], "correctIndex": 1, "explanation": "Phủ định kinh nghiệm bắt buộc dùng 没: 我没去过中国."},
      {"id": "q-217-2", "type": "multiple-choice", "question": "Từ '次' trong '我去过两次' là loại từ gì?", "options": ["Danh từ", "Lượng từ chỉ số lần", "Tính từ", "Phó từ"], "correctIndex": 1, "explanation": "次 là động lượng từ chỉ số lần thực hiện hành động."}
    ],
    "step9_challenge": {"title": "Kho báu trải nghiệm", "taskDesc": "Đọc to câu chia sẻ một món ăn ngon bạn từng thưởng thức bằng tiếng Trung.", "targetPhrase": "wǒ chī guo běijīng kǎoyā hěn hǎochī", "xpReward": 50, "badge": "Người Giàu Trải Nghiệm"}
  },

  # --- LESSON 218 ---
  {
    "id": "l-218", "chapterId": "ch-8", "levelId": "lvl-2", "lessonNumber": 18,
    "title": "Cặp liên từ logic 因为...所以... & 虽然...但是...",
    "chineseTitle": "复句关联词（因为...所以...，虽然...但是...）",
    "subtitle": "Kết nối hai vế câu logic: Nguyên nhân - kết quả (Bởi vì...cho nên...) và chuyển ngoặt (Tuy rằng...nhưng mà...).",
    "objective": "Nói và viết được các câu phức logic giải thích nguyên nhân và diễn đạt quan điểm tương phản.",
    "prerequisite": "Đã hoàn thành Bài 217.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và ghép đúng các cặp liên từ logic.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Liên từ logic", "因为所以", "虽然但是", "Câu phức"],
    "relatedMaterialIds": ["mat-2", "mat-4"],
    "step1_learn": {
      "topic": "2 Cặp liên từ cốt lõi HSK 2: 因为...所以... & 虽然...但是...",
      "summary": "1. Nguyên nhân - kết quả: 因为 (yīnwèi - bởi vì) ... 所以 (suǒyǐ - cho nên). 2. Chuyển ngoặt đối lập: 虽然 (suīrán - tuy rằng) ... 但是 (dànshì - nhưng mà).",
      "audioDemoText": "yīnwèi jīntiān xiàyǔ, suǒyǐ wǒ méi qù; suīrán hěn lěng, dànshì wǒ hěn kāixīn"
    },
    "step2_vocabulary": [
      {"id": "v-218-1", "hanzi": "因为", "pinyin": "yīnwèi", "hanviet": "Nhân vi", "meaning": "Bởi vì, vì", "radical": "囗 (Vi)", "example": {"hanzi": "因为下雨了。", "pinyin": "Yīnwèi xià yǔ le.", "meaning": "Bởi vì trời mưa rồi."}},
      {"id": "v-218-2", "hanzi": "所以", "pinyin": "suǒyǐ", "hanviet": "Sở dĩ", "meaning": "Cho nên, vì vậy", "radical": "斤 (Cân)", "example": {"hanzi": "所以我在家。", "pinyin": "Suǒyǐ wǒ zài jiā.", "meaning": "Cho nên tôi ở nhà."}},
      {"id": "v-218-3", "hanzi": "虽然", "pinyin": "suīrán", "hanviet": "Tuy nhiên", "meaning": "Mặc dù, tuy rằng", "radical": "虫 (Trùng)", "example": {"hanzi": "虽然汉语难。", "pinyin": "Suīrán Hànyǔ nán.", "meaning": "Tuy rằng tiếng Trung khó."}},
      {"id": "v-218-4", "hanzi": "但是", "pinyin": "dànshì", "hanviet": "Đãn thị", "meaning": "Nhưng mà, nhưng", "radical": "亻 (Nhân)", "example": {"hanzi": "但是很有趣。", "pinyin": "Dànshì hěn yǒuqù.", "meaning": "Nhưng mà rất thú vị."}},
      {"id": "v-218-5", "hanzi": "还是", "pinyin": "háishi", "hanviet": "Hoàn thị", "meaning": "Hay là, vẫn là", "radical": "辶 (Sước)", "example": {"hanzi": "喝茶还是喝咖啡？", "pinyin": "Hē chá háishi hē kāfēi?", "meaning": "Uống trà hay là uống cà phê?"}}
    ],
    "step3_hanzi": [
      {"hanzi": "因", "pinyin": "yīn", "meaning": "Nguyên nhân (trong Bởi vì 因为)", "strokesCount": 6, "strokeOrderText": "Khung Vi (囗) bao ngoài -> Chữ Đại (大) bên trong", "components": "囗 + 大", "mnemonic": "Con người to lớn (Đại) bị giới hạn trong khuôn khổ (Vi) sinh ra nguyên cớ."},
      {"hanzi": "但", "pinyin": "dàn", "meaning": "Nhưng mà (trong 但是)", "strokesCount": 7, "strokeOrderText": "Bộ Nhân đứng (亻) bên trái -> Chữ Đán (旦) bên phải", "components": "亻 + 旦", "mnemonic": "Con người (亻) nhìn mặt trời mọc rạng đông (旦) chuyển giao ngày mới."}
    ],
    "step4_grammar": {
      "title": "Cấu trúc ghép nối logic tiếng Trung",
      "formula": "因为 + Nguyên nhân, 所以 + Kết quả.   /   虽然 + Vế nhượng bộ, 但是 + Vế chuyển ngoặt.",
      "explanation": "Trong tiếng Trung, hai liên từ này luôn đi thành từng cặp đối ứng với nhau (khác tiếng Anh không được dùng cả because và so cùng lúc, tiếng Trung BẮT BUỘC có thể dùng cả đôi).",
      "examples": [{"hanzi": "虽然汉字有点儿难写，但是我很喜欢学。", "pinyin": "Suīrán hànzì yǒudiǎnr nán xiě, dànshì wǒ hěn xǐhuan xué.", "meaning": "Mặc dù chữ Hán hơi khó viết một chút, nhưng tôi rất thích học."}],
      "commonMistake": {"wrong": "Bỏ quên chữ 但是 khi đã có 虽然", "correct": "Luôn dùng cặp: 虽然...但是...", "explanation": "Cặp liên từ đi đôi giúp văn phong mạch lạc."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "你昨天怎么没来上课？", "pinyin": "Nǐ zuótiān zěnme méi lái shàngkè?", "meaning": "Hôm qua sao bạn không đến lớp học?"},
        {"speaker": "B", "hanzi": "因为我感冒发烧了，所以在家休息了一天。", "pinyin": "Yīnwèi wǒ gǎnmào fāshāo le, suǒyǐ zài jiā xiūxi le yì tiān.", "meaning": "Bởi vì tôi bị cảm sốt, cho nên đã ở nhà nghỉ ngơi một ngày."}
      ],
      "audioText": "因为我感冒发烧了，所以在家休息了一天。",
      "question": "Vì sao người B không đi học hôm qua?",
      "options": ["Bận đi làm", "Bị cảm sốt nên ở nhà nghỉ (gǎnmào fāshāo, suǒyǐ zài jiā xiūxi)", "Đi du lịch", "Quên lịch học"],
      "correctIndex": 1, "explanation": "B nói: 因为我感冒发烧了，所以在家休息."
    },
    "step6_speaking": {"prompt": "Đọc câu thể hiện tinh thần học tập kiên trì:", "targetSentence": "虽然汉语难，但是我喜欢。", "targetPinyin": "Suīrán Hànyǔ nán, dànshì wǒ xǐhuan.", "targetMeaning": "Mặc dù tiếng Trung khó, nhưng tôi thích.", "hint": "Đọc nhấn giọng ở dànshì."},
    "step7_writing": {"prompt": "Sắp xếp câu: Bởi vì trời mưa cho nên tôi không đi", "words": ["所以我不去", "因为下雨"], "correctOrder": ["因为下雨", "所以我不去"], "explanation": "因为下雨 + 所以我不去."},
    "step8_quiz": [
      {"id": "q-218-1", "type": "multiple-choice", "question": "Cặp liên từ nào sau đây biểu thị mối quan hệ nguyên nhân - kết quả?", "options": ["虽然...但是...", "因为...所以... (yīnwèi...suǒyǐ...)", "不但...而且...", "如果...就..."], "correctIndex": 1, "explanation": "因为...所以... là Bởi vì...cho nên..."},
      {"id": "q-218-2", "type": "multiple-choice", "question": "Trong câu hỏi lựa chọn 'Bạn uống trà hay cà phê', từ 'hay là' chuẩn là:", "options": ["还是 (háishi)", "或者 (huòzhě)", "因为", "所以"], "correctIndex": 0, "explanation": "Câu hỏi lựa chọn dùng 还是 (háishi)."}
    ],
    "step9_challenge": {"title": "Nhà hùng biện logic", "taskDesc": "Đọc to câu ghép sử dụng trọn vẹn cặp liên từ 因为...所以...", "targetPhrase": "yīnwèi wǒ xǐhuan hànyǔ suǒyǐ wǒ nǔlì xué", "xpReward": 50, "badge": "Tư Duy Logic"}
  },

  # --- LESSON 219 ---
  {
    "id": "l-219", "chapterId": "ch-8", "levelId": "lvl-2", "lessonNumber": 19,
    "title": "Tổng ôn tập toàn diện hệ thống ngữ pháp HSK 2",
    "chineseTitle": "HSK 2级全真语法体系与300词总复习",
    "subtitle": "Hệ thống hóa toàn bộ 300 từ vựng và các cấu trúc câu so sánh 比, trợ từ 了/着/过, câu phức liên từ.",
    "objective": "Nắm vững toàn diện 96 điểm ngữ pháp HSK 2 và 300 từ vựng trước bài thi tổng kết.",
    "prerequisite": "Đã hoàn thành Bài 201–218.",
    "completionCriteria": "Đạt >= 80% điểm bài trắc nghiệm tổng hợp Level 2.",
    "durationMinutes": 25, "xpReward": 60, "tags": ["HSK 2", "Tổng ôn tập", "Ngữ pháp tổng hợp", "Review Checkpoint"],
    "relatedMaterialIds": ["mat-2", "mat-10"],
    "step1_learn": {
      "topic": "Hệ thống 3 Trợ từ động thái cốt lõi: 了 (Hoàn thành), 着 (Duy trì), 过 (Kinh nghiệm quá khứ)",
      "summary": "1. V + 了: Hành động đã thực hiện (我买了). 2. V + 着: Trạng thái đang duy trì (门开着). 3. V + 过: Đã từng trải nghiệm trong đời (我去过). Bổ trợ thêm câu chữ 比 và các cặp liên từ.",
      "audioDemoText": "wǒ chī le fàn, mén kāi zhe, wǒ qù guo zhōngguó, jīntiān bǐ zuótiān lěng"
    },
    "step2_vocabulary": [
      {"id": "v-219-1", "hanzi": "已经", "pinyin": "yǐjīng", "hanviet": "Dĩ kinh", "meaning": "Đã, rồi", "radical": "己 (Kỷ)", "example": {"hanzi": "我已经知道了。", "pinyin": "Wǒ yǐjīng zhīdào le.", "meaning": "Tôi đã biết rồi."}},
      {"id": "v-219-2", "hanzi": "特别", "pinyin": "tèbié", "hanviet": "Đặc biệt", "meaning": "Đặc biệt, vô cùng", "radical": "牜 (Ngưu)", "example": {"hanzi": "今天特别热。", "pinyin": "Jīntiān tèbié rè.", "meaning": "Hôm nay đặc biệt nóng."}},
      {"id": "v-219-3", "hanzi": "帮助", "pinyin": "bāngzhù", "hanviet": "Bang trợ", "meaning": "Giúp đỡ", "radical": "巾 (Cân)", "example": {"hanzi": "谢谢你的帮助。", "pinyin": "Xièxie nǐ de bāngzhù.", "meaning": "Cảm ơn sự giúp đỡ của bạn."}},
      {"id": "v-219-4", "hanzi": "懂", "pinyin": "dǒng", "hanviet": "Đổng", "meaning": "Hiểu", "radical": "忄 (Tâm)", "example": {"hanzi": "我听懂了。", "pinyin": "Wǒ tīng dǒng le.", "meaning": "Tôi nghe hiểu rồi."}}
    ],
    "step3_hanzi": [
      {"hanzi": "特", "pinyin": "tè", "meaning": "Đặc biệt", "strokesCount": 10, "strokeOrderText": "Bộ Ngưu (牜) bên trái -> Chữ Tự (寺) bên phải", "components": "牜 + 寺", "mnemonic": "Con trâu đực quý giá (Ngưu) dâng lên cửa chùa (Tự) là lễ vật đặc biệt."},
      {"hanzi": "助", "pinyin": "zhù", "meaning": "Giúp sức, tương trợ", "strokesCount": 7, "strokeOrderText": "Chữ Thả (且) bên trái -> Bộ Lực (力) bên phải", "components": "且 + 力", "mnemonic": "Bỏ thêm sức lực (Lực) cùng hỗ trợ nhau làm việc."}
    ],
    "step4_grammar": {
      "title": "Bảng đối sánh 3 trợ từ động thái kinh điển của tiếng Trung",
      "formula": "了 (Xong việc) vs 着 (Đang giữ trạng thái) vs 过 (Đã từng trải qua)",
      "explanation": "Nắm vững sự khác biệt giữa 3 trợ từ này giúp bạn đạt điểm tối đa các câu hỏi ngữ pháp điền từ trong kỳ thi HSK 2.",
      "examples": [{"hanzi": "我已经吃过饭了，现在正坐着休息呢。", "pinyin": "Wǒ yǐjīng chī guo fàn le, xiànzài zhèng zuò zhe xiūxi ne.", "meaning": "Tôi đã ăn cơm xong rồi, bây giờ đang ngồi nghỉ ngơi."}],
      "commonMistake": {"wrong": "Nhầm lẫn giữa 过 và 了 khi kể về quá khứ.", "correct": "过 nhấn mạnh trải nghiệm từng làm; 了 nhấn mạnh hoàn tất sự việc.", "explanation": "Phân biệt bản chất ngữ nghĩa của trợ từ."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "你学了多长时间汉语了？能听懂中国人说话吗？", "pinyin": "Nǐ xué le duō cháng shíjiān Hànyǔ le? Néng tīng dǒng Zhōngguórén shuōhuà ma?", "meaning": "Bạn đã học tiếng Trung được bao lâu rồi? Có nghe hiểu người Trung Quốc nói chuyện không?"},
        {"speaker": "B", "hanzi": "我学了半年了，虽然说得不太快，但是基本的日常对话都能听懂。", "pinyin": "Wǒ xué le bàn nián le, suīrán shuō de bú tài kuài, dànshì jīběn de rìcháng duìhuà dōu néng tīng dǒng.", "meaning": "Tôi học được nửa năm rồi, mặc dù nói chưa được nhanh lắm, nhưng các hội thoại sinh hoạt cơ bản đều nghe hiểu được hết."}
      ],
      "audioText": "虽然说得不太快，但是基本的日常对话都能听懂。",
      "question": "Trình độ tiếng Trung của người B hiện tại ra sao?",
      "options": ["Không hiểu gì", "Nói rất nhanh", "Nghe hiểu được các hội thoại sinh hoạt thường nhật (jīběn rìcháng duìhuà néng tīng dǒng)", "Đã quên hết"],
      "correctIndex": 2, "explanation": "B nói: 基本的日常对话都能听懂."
    },
    "step6_speaking": {"prompt": "Khẳng định khả năng nghe hiểu tiếng Trung của bạn:", "targetSentence": "我能听懂日常对话。", "targetPinyin": "Wǒ néng tīng dǒng rìcháng duìhuà.", "targetMeaning": "Tôi có thể nghe hiểu hội thoại thường nhật.", "hint": "Đọc tīng dǒng thanh 1 và 3 dứt khoát."},
    "step7_writing": {"prompt": "Sắp xếp câu: Tôi đã nghe hiểu rồi", "words": ["听懂了", "我已经"], "correctOrder": ["我已经", "听懂了"], "explanation": "我已经 + 听懂了."},
    "step8_quiz": [
      {"id": "q-219-1", "type": "multiple-choice", "question": "Điền từ thích hợp vào chỗ trống: 他手里拿 ___ 一本书。", "options": ["了", "着 (zhe)", "过", "在"], "correctIndex": 1, "explanation": "Trạng thái cầm trên tay duy trì dùng 着: 拿着."},
      {"id": "q-219-2", "type": "multiple-choice", "question": "Tổng số từ vựng cốt lõi yêu cầu người học làm chủ khi hoàn thành HSK 2 là:", "options": ["150 từ", "300 từ vựng sinh hoạt", "600 từ", "1200 từ"], "correctIndex": 1, "explanation": "HSK 2 tích lũy 300 từ vựng đàm thoại sinh hoạt thường nhật."}
    ],
    "step9_challenge": {"title": "Khởi động tổng duyệt HSK 2", "taskDesc": "Vượt qua thử thách để bước vào bài thi Checkpoint Test HSK 2 chính thức!", "targetPhrase": "wǒ yǐjīng dōu tīng dǒng le zhǔnbèi hǎo le", "xpReward": 60, "badge": "Sẵn Sàng Chinh Phục HSK 2"}
  },

  # --- LESSON 220 ---
  {
    "id": "l-220", "chapterId": "ch-8", "levelId": "lvl-2", "lessonNumber": 20,
    "title": "Checkpoint Test HSK 2 (Thi thử mô phỏng đề chuẩn CTI 35 câu)",
    "chineseTitle": "HSK 2级全真模拟考与阶段通关测试",
    "subtitle": "Đề thi sát hạch toàn diện Level 2: 35 câu hỏi chuẩn cấu trúc quốc tế CTI gồm Nghe hiểu và Đọc hiểu.",
    "objective": "Đạt chuẩn đầu ra Level 2 (HSK 2): Xử lý trôi chảy các tình huống sinh hoạt thường nhật bằng tiếng Trung.",
    "prerequisite": "Đã hoàn thành toàn bộ Bài 201–219.",
    "completionCriteria": "Đạt >= 80% điểm bài thi để nhận Chứng nhận Tốt nghiệp Level 2.",
    "durationMinutes": 35, "xpReward": 100, "tags": ["HSK 2", "Thi thử CTI", "Checkpoint Test", "Tốt nghiệp Level 2"],
    "relatedMaterialIds": ["mat-2", "mat-10"],
    "step1_learn": {
      "topic": "Cấu trúc đề thi chuẩn quốc tế HSK 2 (CTI Exam Standard)",
      "summary": "Đề thi HSK 2 gồm 2 phần: 1. Nghe hiểu (35 câu, có tranh và audio đọc 2 lần). 2. Đọc hiểu (25 câu, nối câu tương ứng, điền từ vào chỗ trống). Tất cả vẫn có Pinyin hỗ trợ.",
      "audioDemoText": "hsk èr jí kǎoshì xiànzài kāishǐ, qǐng dàjiā zhǔnbèi hǎo"
    },
    "step2_vocabulary": [
      {"id": "v-220-1", "hanzi": "成绩", "pinyin": "chéngjì", "hanviet": "Thành tích", "meaning": "Thành tích, điểm số", "radical": "禾 (Hòa)", "example": {"hanzi": "考试成绩很好。", "pinyin": "Kǎoshì chéngjì hěn hǎo.", "meaning": "Điểm thi rất tốt."}},
      {"id": "v-220-2", "hanzi": "通过", "pinyin": "tōngguò", "hanviet": "Thông qua", "meaning": "Đậu, vượt qua bài thi", "radical": "辶 (Sước)", "example": {"hanzi": "通过考试了！", "pinyin": "Tōngguò kǎoshì le!", "meaning": "Thi đậu rồi!"}},
      {"id": "v-220-3", "hanzi": "祝贺", "pinyin": "zhùhè", "hanviet": "Chúc hạ", "meaning": "Chúc mừng", "radical": "礻 (Thị)", "example": {"hanzi": "祝贺你！", "pinyin": "Zhùhè nǐ!", "meaning": "Chúc mừng bạn nhé!"}},
      {"id": "v-220-4", "hanzi": "希望", "pinyin": "xīwàng", "hanviet": "Hy vọng", "meaning": "Hy vọng, mong muốn", "radical": "巾 (Cân)", "example": {"hanzi": "希望你能成功。", "pinyin": "Xīwàng nǐ néng chénggōng.", "meaning": "Hy vọng bạn có thể thành công."}}
    ],
    "step3_hanzi": [
      {"hanzi": "通", "pinyin": "tōng", "meaning": "Thông suốt, vượt qua", "strokesCount": 10, "strokeOrderText": "Chữ Dũng (甬) bên trong -> Bộ Sước (辶) bao ngoài", "components": "甬 + 辶", "mnemonic": "Con đường thông suốt không bị vật cản giúp vượt qua suôn sẻ."},
      {"hanzi": "贺", "pinyin": "hè", "meaning": "Chúc mừng (Hạ)", "strokesCount": 9, "strokeOrderText": "Chữ Gia (加) ở trên -> Bộ Bối (贝) ở dưới", "components": "加 + 贝", "mnemonic": "Thêm lời chúc tụng (Gia) kèm theo quà tặng quý giá (Bối)."}
    ],
    "step4_grammar": {
      "title": "Bí kíp phân bổ thời gian bài thi HSK 2",
      "formula": "Nghe hiểu: Đọc trước câu hỏi 15 giây. Đọc hiểu: Tập trung vào từ khóa ngữ pháp (比, 着, 过, 因为, 离).",
      "explanation": "Đọc hiểu HSK 2 yêu cầu tốc độ đọc nhanh hơn HSK 1. Tìm nhanh các từ chỉ thời gian, địa điểm và đại từ liên kết để chọn đáp án chuẩn xác.",
      "examples": [{"hanzi": "祝贺你顺利通过HSK 2级考试！", "pinyin": "Zhùhè nǐ shùnlì tōngguò HSK èr jí kǎoshì!", "meaning": "Chúc mừng bạn đã thuận lợi vượt qua kỳ thi HSK 2!"}],
      "commonMistake": {"wrong": "Đọc dịch từng chữ sang tiếng Việt mất thời gian.", "correct": "Nhìn lướt bắt cụm từ cố định để khoanh đáp án.", "explanation": "Chiến thuật làm bài khảo thí đạt điểm cao."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Khảo quan", "hanzi": "恭喜你，你的听力和阅读成绩都非常好，达到了优秀标准！", "pinyin": "Gōngxǐ nǐ, nǐ de tīnglì hé yuèdú chéngjì dōu hěn hǎokàn, dádào le yōuxiù biāozhǔn!", "meaning": "Chúc mừng em, điểm thi nghe hiểu và đọc hiểu của em đều rất xuất sắc, đạt tiêu chuẩn loại giỏi!"},
        {"speaker": "Thí sinh", "hanzi": "太感谢老师了！接下来我一定要努力征服HSK 3级！", "pinyin": "Tài gǎnxiè lǎoshī le! Jiēxiàlai wǒ yídìng yào nǔlì zhēngfú HSK sān jí!", "meaning": "Em cảm ơn thầy nhiều lắm ạ! Sắp tới em nhất định sẽ nỗ lực chinh phục HSK 3!"}
      ],
      "audioText": "恭喜你，你的成绩达到了优秀标准！接下来我一定要征服HSK 3级！",
      "question": "Mục tiêu tiếp theo của thí sinh là gì?",
      "options": ["Nghỉ học tiếng Trung", "Chinh phục kỳ thi HSK 3 (zhēngfú HSK sān jí)", "Đi tìm việc làm", "Đi du lịch"],
      "correctIndex": 1, "explanation": "Thí sinh nói rõ: 努力征服HSK 3级."
    },
    "step6_speaking": {"prompt": "Khẳng định quyết tâm vượt qua bài thi:", "targetSentence": "我一定能通过考试！", "targetPinyin": "Wǒ yídìng néng tōngguò kǎoshì!", "targetMeaning": "Tôi nhất định có thể vượt qua kỳ thi!", "hint": "Đọc dõng dạc và tràn đầy tự tin."},
    "step7_writing": {"prompt": "Sắp xếp câu: Chúc mừng bạn thi đậu rồi", "words": ["通过考试了", "祝贺你"], "correctOrder": ["祝贺你", "通过考试了"], "explanation": "祝贺你 + 通过考试了."},
    "step8_quiz": [
      {"id": "q-220-1", "type": "multiple-choice", "question": "Câu nào sau đây kết hợp hoàn hảo các cấu trúc trọng điểm của Level 2?", "options": ["今天比昨天冷，虽然刮风，但是门关着呢", "今天比昨天很冷，虽然刮风所以门关着", "比今天昨天冷虽然但是", "今天昨天比冷门关"], "correctIndex": 0, "explanation": "Câu chuẩn kết hợp câu chữ 比 (比昨天冷), liên từ đối lập (虽然...但是...) và trạng thái (门关着呢)."},
      {"id": "q-220-2", "type": "multiple-choice", "question": "Chúc mừng bạn đã hoàn thành Level 2! Năng lực giao tiếp của bạn đạt mức:", "options": ["Chỉ biết chào hỏi cơ bản", "Xử lý trôi chảy các tình huống sinh hoạt đời thường (mua sắm, gọi món, đi lại, khám bệnh)", "Dịch cabin hội nghị quốc tế", "Đọc tiểu thuyết cổ đại"], "correctIndex": 1, "explanation": "Level 2 (HSK 2) khẳng định năng lực tự chủ xử lý trôi chảy mọi tình huống sinh hoạt quen thuộc."}
    ],
    "step9_challenge": {"title": "Vinh danh Tốt nghiệp HSK 2", "taskDesc": "Đọc to câu tuyên bố hoàn thành xuất sắc Level 2 và mở khóa Boss Đấu trường Thiên An Môn!", "targetPhrase": "wǒ shùnlì tōngguò le hsk èr jí kǎoshì", "xpReward": 100, "badge": "Tốt Nghiệp HSK 2 Xuất Sắc"}
  }
]

print(f"Loaded {len(LEVEL_2_MODULES_3_AND_4)} lessons for Level 2 Modules 2.3 & 2.4")
