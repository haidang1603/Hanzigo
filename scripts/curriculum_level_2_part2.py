# -*- coding: utf-8 -*-
"""
Level 2 Curriculum Lessons (206 to 220) - Modules 2.2, 2.3, 2.4
Strictly adheres to docs/HANZIGO_CHINESE_CURRICULUM.md
"""

LEVEL_2_REMAINING = [
  # =========================================================================
  # MODULE 2.2: ẨM THỰC, NHÀ HÀNG & MUA SẮM (BÀI 206-210, ch-6)
  # =========================================================================

  # --- LESSON 206 ---
  {
    "id": "l-206", "chapterId": "ch-6", "levelId": "lvl-2", "lessonNumber": 6,
    "title": "Đi nhà hàng & Gọi món quen thuộc (点菜与菜单)",
    "chineseTitle": "餐厅点菜与特色美食（服务员，点菜）",
    "subtitle": "Kêu phục vụ (服务员), xem thực đơn (菜单), gọi món (点菜) và các món ăn Trung Hoa trứ danh.",
    "objective": "Tự tin gọi món tại quán ăn Trung Quốc và hỏi nhân viên về các món đặc sản.",
    "prerequisite": "Đã hoàn thành Module 2.1.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đóng vai gọi 2 món ăn kèm đồ uống.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Nhà hàng", "Gọi món", "服务员", "点菜"],
    "relatedMaterialIds": ["mat-2", "mat-6"],
    "step1_learn": {
      "topic": "Đàm thoại gọi món: 服务员，我们要点菜 (Fúwùyuán, wǒmen yào diǎncài)",
      "summary": "服务员 (fúwùyuán) là nhân viên phục vụ. 菜单 (càidān) là thực đơn. 点菜 (diǎncài) là gọi món. 好吃 (hǎochī) là ngon miệng.",
      "audioDemoText": "fúwùyuán qǐng gěi wǒ càidān, wǒmen yào diǎncài"
    },
    "step2_vocabulary": [
      {"id": "v-206-1", "hanzi": "服务员", "pinyin": "fúwùyuán", "hanviet": "Phục vụ viên", "meaning": "Nhân viên phục vụ", "radical": "亻 (Nhân)", "example": {"hanzi": "服务员，买单！", "pinyin": "Fúwùyuán, mǎidān!", "meaning": "Phục vụ ơi, tính tiền!"}},
      {"id": "v-206-2", "hanzi": "菜单", "pinyin": "càidān", "hanviet": "Thái đơn", "meaning": "Thực đơn", "radical": "艹 (Thảo)", "example": {"hanzi": "请看菜单。", "pinyin": "Qǐng kàn càidān.", "meaning": "Mời xem thực đơn."}},
      {"id": "v-206-3", "hanzi": "点菜", "pinyin": "diǎncài", "hanviet": "Điểm thái", "meaning": "Gọi món, gọi thức ăn", "radical": "灬 (Hỏa)", "example": {"hanzi": "可以点菜了吗？", "pinyin": "Kěyǐ diǎncài le ma?", "meaning": "Đã có thể gọi món chưa ạ?"}},
      {"id": "v-206-4", "hanzi": "饺子", "pinyin": "jiǎozi", "hanviet": "Sủi cảo", "meaning": "Sủi cảo, bánh chẻo", "radical": "饣 (Thực)", "example": {"hanzi": "中国饺子很好吃。", "pinyin": "Zhōngguó jiǎozi hěn hǎochī.", "meaning": "Sủi cảo Trung Quốc rất ngon."}},
      {"id": "v-206-5", "hanzi": "好吃", "pinyin": "hǎochī", "hanviet": "Hảo cật", "meaning": "Ngon miệng", "radical": "女 (Nữ)", "example": {"hanzi": "这个菜真好吃！", "pinyin": "Zhège cài zhēn hǎochī!", "meaning": "Món này ngon thật!"}},
      {"id": "v-206-6", "hanzi": "烤鸭", "pinyin": "kǎoyā", "hanviet": "Khảo áp", "meaning": "Vịt quay", "radical": "火 (Hỏa)", "example": {"hanzi": "北京烤鸭。", "pinyin": "Běijīng kǎoyā.", "meaning": "Vịt quay Bắc Kinh."}}
    ],
    "step3_hanzi": [
      {"hanzi": "服", "pinyin": "fú", "meaning": "Phục vụ, quần áo", "strokesCount": 8, "strokeOrderText": "Bộ Nguyệt (月) bên trái -> Nét gập chấm phải", "components": "月 + 卩 + 又", "mnemonic": "Mặc trang phục gọn gàng cung kính phục vụ khách hàng."},
      {"hanzi": "单", "pinyin": "dān", "meaning": "Đơn tờ, danh sách", "strokesCount": 8, "strokeOrderText": "Hai chấm trên -> Bộ Khẩu (口) -> Ngang -> Sổ thẳng dài", "components": "丷 + 口 + 十", "mnemonic": "Tờ giấy ghi chép danh sách các món ăn rõ ràng."}
    ],
    "step4_grammar": {
      "title": "Mẫu câu gọi món lịch sự: 请给我们... / 我们要...",
      "formula": "服务员，请给我们一份 + Tên món ăn",
      "explanation": "Lượng từ cho một phần đồ ăn là 份 (fèn - suất, phần) hoặc 盘 (pán - đĩa).",
      "examples": [{"hanzi": "服务员，我们要一份北京烤鸭和两碗米饭。", "pinyin": "Fúwùyuán, wǒmen yào yí fèn Běijīng kǎoyā hé liǎng wǎn mǐfàn.", "meaning": "Phục vụ ơi, cho chúng tôi một phần vịt quay Bắc Kinh và hai bát cơm."}],
      "commonMistake": {"wrong": "我要一米饭 ❌", "correct": "我们要一碗米饭 ✔️", "explanation": "Phải có lượng từ bát (碗 - wǎn) cho cơm."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Nhân viên", "hanzi": "您好，两位想吃点什么？", "pinyin": "Nín hǎo, liǎng wèi xiǎng chī diǎn shénme?", "meaning": "Kính chào quý khách, hai vị muốn dùng món gì ạ?"},
        {"speaker": "Khách", "hanzi": "服务员，给我们来一盘饺子和一份宫保鸡丁。", "pinyin": "Fúwùyuán, gěi wǒmen lái yì pán jiǎozi hé yí fèn Gōngbǎo jīdīng.", "meaning": "Phục vụ ơi, cho chúng tôi một đĩa sủi cảo và một phần gà xào Cung Bảo nhé."}
      ],
      "audioText": "服务员，给我们来一盘饺子和一份宫保鸡丁。",
      "question": "Khách hàng đã gọi những món gì?",
      "options": ["Cơm chiên và canh trứng", "Một đĩa sủi cảo và gà xào Cung Bảo (yì pán jiǎozi hé yí fèn Gōngbǎo jīdīng)", "Vịt quay Bắc Kinh", "Mì cay Tứ Xuyên"],
      "correctIndex": 1, "explanation": "Khách gọi: 一盘饺子和一份宫保鸡丁."
    },
    "step6_speaking": {"prompt": "Nói gọi món với nhân viên phục vụ:", "targetSentence": "服务员，我们要点菜。", "targetPinyin": "Fúwùyuán, wǒmen yào diǎncài.", "targetMeaning": "Phục vụ ơi, chúng tôi muốn gọi món.", "hint": "Đọc fúwùyuán rõ ràng và lịch sự."},
    "step7_writing": {"prompt": "Sắp xếp câu: Cho chúng tôi một đĩa sủi cảo", "words": ["一盘饺子", "给我们", "来"], "correctOrder": ["给我们", "来", "一盘饺子"], "explanation": "给我们 + 来 + 一盘饺子."},
    "step8_quiz": [
      {"id": "q-206-1", "type": "multiple-choice", "question": "Khi muốn gọi tính tiền tại quán ăn, người Trung Quốc thường nói:", "options": ["买单 (mǎidān)", "点菜 (diǎncài)", "看菜单 (kàn càidān)", "吃饭 (chīfàn)"], "correctIndex": 0, "explanation": "Thanh toán tính tiền gọi là 买单 (mǎidān)."},
      {"id": "q-206-2", "type": "multiple-choice", "question": "Từ '饺子' (jiǎozi) là món ăn nổi tiếng nào của Trung Hoa?", "options": ["Bánh bao", "Sủi cảo / Bánh chẻo", "Mì xào", "Đậu phụ thối"], "correctIndex": 1, "explanation": "Sủi cảo là món ăn truyền thống đặc sắc của Trung Quốc."}
    ],
    "step9_challenge": {"title": "Gọi món chuyên nghiệp", "taskDesc": "Đóng vai gọi trọn vẹn 1 món mặn, 1 món canh và 1 món nước tại bàn ăn.", "targetPhrase": "fúwùyuán wǒmen yào diǎncài gěi wǒ càidān", "xpReward": 50, "badge": "Thực Khách Sành Điệu"}
  },

  # --- LESSON 207 ---
  {
    "id": "l-207", "chapterId": "ch-6", "levelId": "lvl-2", "lessonNumber": 7,
    "title": "Khẩu vị & Dặn dò nhà bếp (不要放辣椒)",
    "chineseTitle": "口味与点餐嘱咐（酸、甜、苦、辣、咸）",
    "subtitle": "5 vị cơ bản trong ẩm thực (chua, ngọt, đắng, cay, mặn) và cách dặn dò nhà bếp không bỏ ớt hay hành.",
    "objective": "Miêu tả khẩu vị ưa thích và dặn dò đầu bếp nấu theo yêu cầu đặc biệt của bản thân.",
    "prerequisite": "Đã hoàn thành Bài 206.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng câu dặn dò nhà bếp.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Khẩu vị", "Cay", "Ngọt", "不要放辣椒"],
    "relatedMaterialIds": ["mat-2", "mat-6"],
    "step1_learn": {
      "topic": "5 Vị cơ bản: 酸 (suān - chua), 甜 (tián - ngọt), 苦 (kǔ - đắng), 辣 (là - cay), 咸 (xián - mặn)",
      "summary": "Cấu trúc dặn dò đầu bếp: 不要放... (Đừng bỏ...), 少放... (Bỏ ít...). Ví dụ: 不要放辣椒 (Đừng bỏ ớt), 少放盐 (Bỏ ít muối).",
      "audioDemoText": "suān tián kǔ là xián, bú yào fàng làjiāo, shǎo fàng yán"
    },
    "step2_vocabulary": [
      {"id": "v-207-1", "hanzi": "辣", "pinyin": "là", "hanviet": "Lạt", "meaning": "Cay", "radical": "辛 (Tân)", "example": {"hanzi": "四川菜很辣。", "pinyin": "Sìchuān cài hěn là.", "meaning": "Món ăn Tứ Xuyên rất cay."}},
      {"id": "v-207-2", "hanzi": "甜", "pinyin": "tián", "hanviet": "Điềm", "meaning": "Ngọt", "radical": "甘 (Cam)", "example": {"hanzi": "这个西瓜很甜。", "pinyin": "Zhège xīguā hěn tián.", "meaning": "Quả dưa hấu này rất ngọt."}},
      {"id": "v-207-3", "hanzi": "酸", "pinyin": "suān", "hanviet": "Toan", "meaning": "Chua", "radical": "酉 (Dậu)", "example": {"hanzi": "有点儿酸。", "pinyin": "Yǒudiǎnr suān.", "meaning": "Hơi chua một chút."}},
      {"id": "v-207-4", "hanzi": "放", "pinyin": "fàng", "hanviet": "Phóng", "meaning": "Bỏ vào, để, đặt", "radical": "攵 (Phác)", "example": {"hanzi": "不要放糖。", "pinyin": "Bú yào fàng táng.", "meaning": "Đừng bỏ đường."}},
      {"id": "v-207-5", "hanzi": "辣椒", "pinyin": "làjiāo", "hanviet": "Lạt tiêu", "meaning": "Quả ớt", "radical": "辛 (Tân)", "example": {"hanzi": "我不吃辣椒。", "pinyin": "Wǒ bù chī làjiāo.", "meaning": "Tôi không ăn ớt."}},
      {"id": "v-207-6", "hanzi": "少", "pinyin": "shǎo", "hanviet": "Thiểu", "meaning": "Ít", "radical": "小 (Tiểu)", "example": {"hanzi": "少放一点儿盐。", "pinyin": "Shǎo fàng yìdiǎnr yán.", "meaning": "Bỏ ít muối một chút."}}
    ],
    "step3_hanzi": [
      {"hanzi": "辣", "pinyin": "là", "meaning": "Cay nồng", "strokesCount": 14, "strokeOrderText": "Bộ Tân (辛) bên trái -> Chữ Thúc (束) bên phải", "components": "辛 + 束", "mnemonic": "Vị cay đắng (Tân) buộc chặt (Thúc) nơi đầu lưỡi."},
      {"hanzi": "甜", "pinyin": "tián", "meaning": "Ngọt ngào", "strokesCount": 11, "strokeOrderText": "Bộ Cam (甘) bên trái -> Bộ Thiệt (舌) bên phải", "components": "甘 + 舌", "mnemonic": "Cái lưỡi (Thiệt) nếm vị ngọt lành thơm tho (Cam)."}
    ],
    "step4_grammar": {
      "title": "Cấu trúc dặn dò khẩu vị: 不要放 / 少放 + Gia vị",
      "formula": "请 + 不要放 / 少放 + 辣椒 (ớt) / 糖 (đường) / 盐 (muối) / 香菜 (ngò rí)",
      "explanation": "Khi đi du lịch Trung Quốc, đặc biệt ở Tứ Xuyên và Hồ Nam nơi các món rất cay, mẫu câu '不要放辣椒' là chìa khóa sinh tồn hữu ích.",
      "examples": [{"hanzi": "服务员，我的菜请不要放辣椒，少放盐。", "pinyin": "Fúwùyuán, wǒ de cài qǐng bú yào fàng làjiāo, shǎo fàng yán.", "meaning": "Phục vụ ơi, món của tôi xin đừng bỏ ớt, và cho ít muối thôi nhé."}],
      "commonMistake": {"wrong": "不放辣椒 ❌ (thiếu lịch sự)", "correct": "请不要放辣椒 ✔️", "explanation": "Thêm 请 và 不要 để thể hiện thái độ nhã nhặn."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Nhân viên", "hanzi": "这份麻婆豆腐需要微辣还是大辣？", "pinyin": "Zhè fèn Mápó dòufu xūyào wēilà háishì dàlà?", "meaning": "Phần đậu phụ Ma Bà này quý khách muốn cay nhẹ hay cay nồng ạ?"},
        {"speaker": "Khách", "hanzi": "我不太能吃辣，请帮我做微辣，少放辣椒，谢谢！", "pinyin": "Wǒ bú tài néng chī là, qǐng bāng wǒ zuò wēilà, shǎo fàng làjiāo, xièxie!", "meaning": "Tôi không ăn được cay lắm, xin làm cay nhẹ thôi và cho ít ớt giúp tôi, cảm ơn nhé!"}
      ],
      "audioText": "我不太能吃辣，请帮我做微辣，少放辣椒。",
      "question": "Khách hàng yêu cầu độ cay như thế nào?",
      "options": ["Rất cay nồng", "Không bỏ đậu phụ", "Cay nhẹ và cho ít ớt (wēilà, shǎo fàng làjiāo)", "Cho thật nhiều ớt"],
      "correctIndex": 2, "explanation": "Khách dặn: 微辣，少放辣椒."
    },
    "step6_speaking": {"prompt": "Dặn dò đầu bếp không bỏ ớt:", "targetSentence": "请不要放辣椒。", "targetPinyin": "Qǐng bú yào fàng làjiāo.", "targetMeaning": "Xin đừng bỏ ớt.", "hint": "Đọc làjiāo dứt khoát thanh 4 và 1."},
    "step7_writing": {"prompt": "Sắp xếp câu: Xin cho ít muối một chút", "words": ["盐", "少放一点儿", "请"], "correctOrder": ["请", "少放一点儿", "盐"], "explanation": "请 + 少放一点儿 + 盐."},
    "step8_quiz": [
      {"id": "q-207-1", "type": "multiple-choice", "question": "Từ nào sau đây mang nghĩa là vị 'Ngọt'?", "options": ["辣 (là)", "酸 (suān)", "甜 (tián)", "苦 (kǔ)"], "correctIndex": 2, "explanation": "甜 (tián) là ngọt."},
      {"id": "q-207-2", "type": "multiple-choice", "question": "Câu '不要放辣椒' có nghĩa là:", "options": ["Cho nhiều ớt vào", "Đừng bỏ ớt", "Đừng ăn cơm", "Bỏ thêm muối"], "correctIndex": 1, "explanation": "Đừng bỏ ớt vào món ăn."}
    ],
    "step9_challenge": {"title": "Khẩu vị của riêng tôi", "taskDesc": "Đọc to câu dặn dò nhà bếp: Tôi thích ngọt, không ăn được cay, xin đừng cho ớt.", "targetPhrase": "qǐng bú yào fàng làjiāo wǒ bù chī là", "xpReward": 50, "badge": "Khẩu Vị Tinh Tế"}
  },

  # --- LESSON 208 ---
  {
    "id": "l-208", "chapterId": "ch-6", "levelId": "lvl-2", "lessonNumber": 8,
    "title": "Mua sắm quần áo, màu sắc & Size (试衣服)",
    "chineseTitle": "服装购物、颜色与试穿（这件衣服可以试一下吗）",
    "subtitle": "Lượng từ 件 (jiàn), màu sắc cơ bản (đỏ, đen, trắng), động từ 穿 (mặc) và thử đồ (试一下).",
    "objective": "Biết hỏi thử quần áo, hỏi size lớn/nhỏ và miêu tả màu sắc yêu thích.",
    "prerequisite": "Đã hoàn thành Bài 207.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đàm thoại thử đồ trong shop thời trang.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Mua sắm", "Quần áo", "Màu sắc", "试衣服"],
    "relatedMaterialIds": ["mat-2", "mat-6"],
    "step1_learn": {
      "topic": "Mua sắm quần áo: 这件衣服可以试一下吗？ (Zhè jiàn yīfu kěyǐ shì yíxià ma?)",
      "summary": "件 (jiàn) là lượng từ cho quần áo. 颜色 (yánsè) là màu sắc: 红色 (đỏ), 黑色 (đen), 白色 (trắng). 试 (shì) là thử, 穿 (chuān) là mặc.",
      "audioDemoText": "zhè jiàn yīfu kěyǐ shì yíxià ma, yǒu méiyǒu dà yidiǎnr de"
    },
    "step2_vocabulary": [
      {"id": "v-208-1", "hanzi": "衣服", "pinyin": "yīfu", "hanviet": "Y phục", "meaning": "Quần áo", "radical": "衣 (Y)", "example": {"hanzi": "买新衣服。", "pinyin": "Mǎi xīn yīfu.", "meaning": "Mua quần áo mới."}},
      {"id": "v-208-2", "hanzi": "件", "pinyin": "jiàn", "hanviet": "Kiện", "meaning": "Chiếc, cái (lượng từ quần áo)", "radical": "亻 (Nhân)", "example": {"hanzi": "这件衣服很漂亮。", "pinyin": "Zhè jiàn yīfu hěn piàoliang.", "meaning": "Bộ quần áo này rất đẹp."}},
      {"id": "v-208-3", "hanzi": "试", "pinyin": "shì", "hanviet": "Thí", "meaning": "Thử (thử đồ, thi)", "radical": "讠 (Ngôn)", "example": {"hanzi": "我可以试一下吗？", "pinyin": "Wǒ kěyǐ shì yíxià ma?", "meaning": "Tôi có thể thử một chút không?"}},
      {"id": "v-208-4", "hanzi": "穿", "pinyin": "chuān", "hanviet": "Xuyên", "meaning": "Mặc, xỏ (giày áo)", "radical": "穴 (Huyệt)", "example": {"hanzi": "穿这件衬衫。", "pinyin": "Chuān zhè jiàn chènshān.", "meaning": "Mặc chiếc áo sơ mi này."}},
      {"id": "v-208-5", "hanzi": "颜色", "pinyin": "yánsè", "hanviet": "Nhan sắc", "meaning": "Màu sắc", "radical": "页 (Hiệp)", "example": {"hanzi": "你喜欢什么颜色？", "pinyin": "Nǐ xǐhuan shénme yánsè?", "meaning": "Bạn thích màu gì?"}},
      {"id": "v-208-6", "hanzi": "红", "pinyin": "hóng", "hanviet": "Hồng", "meaning": "Màu đỏ", "radical": "纟 (Mịch)", "example": {"hanzi": "红色的衣服。", "pinyin": "Hóngsè de yīfu.", "meaning": "Quần áo màu đỏ."}}
    ],
    "step3_hanzi": [
      {"hanzi": "衣", "pinyin": "yī", "meaning": "Áo, y phục", "strokesCount": 6, "strokeOrderText": "Chấm -> Ngang -> Phẩy -> Sổ gập cong -> Phẩy -> Mác", "components": "Bộ Y (衣)", "mnemonic": "Hình dáng chiếc áo cổ truyền có vạt áo khoác lên người."},
      {"hanzi": "穿", "pinyin": "chuān", "meaning": "Mặc quần áo, xuyên qua", "strokesCount": 9, "strokeOrderText": "Bộ Huyệt (穴) ở trên -> Chữ Nha (牙) ở dưới", "components": "穴 + 牙", "mnemonic": "Đưa cơ thể xuyên qua cái hang lỗ áo để mặc vào."}
    ],
    "step4_grammar": {
      "title": "Động từ trùng điệp hoặc đi cùng 一下 để làm mềm giọng điệu: 试一下 / 穿穿",
      "formula": "Động từ + 一下 (yíxià) -> Biểu thị hành động thử trong chốc lát, tạo ngữ khí nhẹ nhàng",
      "explanation": "Khi xin phép làm gì (thử áo, xem đồ, hỏi han), dùng 一下 để câu nói trở nên vô cùng lịch sự và tự nhiên.",
      "examples": [{"hanzi": "请问，我可以试一下这件红色的衣服吗？", "pinyin": "Qǐngwèn, wǒ kěyǐ shì yíxià zhè jiàn hóngsè de yīfu ma?", "meaning": "Xin hỏi, tôi có thể thử chiếc áo màu đỏ này một chút được không?"}],
      "commonMistake": {"wrong": "我可以试吗？ (hơi cộc lốc)", "correct": "我可以试一下吗？ ✔️", "explanation": "一下 giúp câu nói mềm mại, nhã nhặn hơn."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Khách", "hanzi": "服务员，这件衣服有点儿小，有大一点儿的吗？", "pinyin": "Fúwùyuán, zhè jiàn yīfu yǒudiǎnr xiǎo, yǒu dà yìdiǎnr de ma?", "meaning": "Nhân viên ơi, chiếc áo này hơi chật một chút, có cái lớn hơn một chút không?"},
        {"speaker": "Nhân viên", "hanzi": "有的，您等一下，我帮您拿一件大号的试一下。", "pinyin": "Yǒu de, nín děng yíxià, wǒ bāng nín ná yí jiàn dàhào de shì yíxià.", "meaning": "Dạ có ạ, quý khách đợi một chút, em lấy cho quý khách chiếc size L để thử nhé."}
      ],
      "audioText": "这件衣服有点儿小，有大一点儿的吗？有的，我帮您拿一件大号的。",
      "question": "Khách hàng muốn đổi chiếc áo như thế nào?",
      "options": ["Đổi màu đen", "Lấy chiếc to hơn một chút (dà yìdiǎnr de)", "Lấy chiếc rẻ hơn", "Không mua nữa"],
      "correctIndex": 1, "explanation": "Khách hỏi: 有大一点儿的吗."
    },
    "step6_speaking": {"prompt": "Hỏi nhân viên xin phép thử chiếc áo này:", "targetSentence": "我可以试一下吗？", "targetPinyin": "Wǒ kěyǐ shì yíxià ma?", "targetMeaning": "Tôi có thể thử một chút không?", "hint": "Đọc shì yíxià ma nhẹ nhàng."},
    "step7_writing": {"prompt": "Sắp xếp câu: Chiếc áo này rất đẹp", "words": ["很漂亮", "衣服", "这件"], "correctOrder": ["这件", "衣服", "很漂亮"], "explanation": "这件 + 衣服 + 很漂亮."},
    "step8_quiz": [
      {"id": "q-208-1", "type": "multiple-choice", "question": "Lượng từ dùng cho quần áo (áo, váy, áo khoác) là:", "options": ["个 (gè)", "件 (jiàn)", "本 (běn)", "张 (zhāng)"], "correctIndex": 1, "explanation": "Lượng từ quần áo là 件 (jiàn yīfu)."},
      {"id": "q-208-2", "type": "multiple-choice", "question": "Màu '黑色' (hēisè) trong tiếng Trung là màu gì?", "options": ["Màu trắng", "Màu đen", "Màu đỏ", "Màu xanh"], "correctIndex": 1, "explanation": "Hắc sắc là màu đen."}
    ],
    "step9_challenge": {"title": "Tín đồ thời trang", "taskDesc": "Đọc to câu hỏi xin thử một chiếc áo màu đỏ size lớn hơn.", "targetPhrase": "wǒ kěyǐ shì yíxià zhè jiàn yīfu ma", "xpReward": 50, "badge": "Stylist Bản Lĩnh"}
  },

  # --- LESSON 209 ---
  {
    "id": "l-209", "chapterId": "ch-6", "levelId": "lvl-2", "lessonNumber": 9,
    "title": "Thanh toán số & Mặc cả (微信支付与打折)",
    "chineseTitle": "移动支付与讨价还价（可以便宜一点儿吗）",
    "subtitle": "Kỹ năng mặc cả (便宜一点儿), giảm giá (打折) và thanh toán qua ví điện tử WeChat Pay/Alipay.",
    "objective": "Mặc cả mua hàng thành công và thanh toán quét mã QR như người bản xứ.",
    "prerequisite": "Đã hoàn thành Bài 208.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và thực hành đàm thoại mặc cả, thanh toán.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Mặc cả", "WeChat Pay", "Alipay", "打折", "便宜一点儿"],
    "relatedMaterialIds": ["mat-2", "mat-6"],
    "step1_learn": {
      "topic": "Thanh toán thời đại số: 扫码支付 (Quét mã trả tiền) & Mặc cả: 可以便宜一点儿吗？",
      "summary": "便宜 (piányi) là rẻ. 便宜一点儿 (rẻ hơn chút nhé). 打折 (dǎzhé) là giảm giá (打八折 nghĩa là giảm 20%, bán với giá 80%). 微信 (WeChat), 支付宝 (Alipay).",
      "audioDemoText": "kěyǐ piányi yìdiǎnr ma, wǒ sǎomǎ fùqián, wēixìn háishì zhīfùbǎo"
    },
    "step2_vocabulary": [
      {"id": "v-209-1", "hanzi": "便宜", "pinyin": "piányi", "hanviet": "Tiện nghi", "meaning": "Rẻ, giá cả phải chăng", "radical": "亻 (Nhân)", "example": {"hanzi": "太贵了，便宜一点儿吧！", "pinyin": "Tài guì le, piányi yìdiǎnr ba!", "meaning": "Đắt quá, rẻ một chút đi mà!"}},
      {"id": "v-209-2", "hanzi": "打折", "pinyin": "dǎzhé", "hanviet": "Đả chiết", "meaning": "Chiết khấu, giảm giá", "radical": "扌 (Thủ)", "example": {"hanzi": "今天打八折。", "pinyin": "Jīntiān dǎ bā zhé.", "meaning": "Hôm nay giảm 20% (bán giá 80%)."}},
      {"id": "v-209-3", "hanzi": "微信", "pinyin": "Wēixìn", "hanviet": "Vi tín", "meaning": "WeChat (ứng dụng nhắn tin/thanh toán)", "radical": "亻 (Nhân)", "example": {"hanzi": "我用微信付钱。", "pinyin": "Wǒ yòng Wēixìn fùqián.", "meaning": "Tôi dùng WeChat trả tiền."}},
      {"id": "v-209-4", "hanzi": "支付宝", "pinyin": "Zhīfùbǎo", "hanviet": "Chi phó bảo", "meaning": "Alipay (ví điện tử)", "radical": "十 (Thập)", "example": {"hanzi": "支持支付宝。", "pinyin": "Zhīchí Zhīfùbǎo.", "meaning": "Hỗ trợ thanh toán Alipay."}},
      {"id": "v-209-5", "hanzi": "扫码", "pinyin": "sǎomǎ", "hanviet": "Tảo mã", "meaning": "Quét mã QR", "radical": "扌 (Thủ)", "example": {"hanzi": "请扫这里。", "pinyin": "Qǐng sǎo zhèlǐ.", "meaning": "Xin quét ở đây."}},
      {"id": "v-209-6", "hanzi": "现金", "pinyin": "xiànjīn", "hanviet": "Hiện kim", "meaning": "Tiền mặt", "radical": "王 (Vương)", "example": {"hanzi": "我有现金。", "pinyin": "Wǒ yǒu xiànjīn.", "meaning": "Tôi có tiền mặt."}}
    ],
    "step3_hanzi": [
      {"hanzi": "宜", "pinyin": "yi", "meaning": "Thích hợp, tiện nghi", "strokesCount": 8, "strokeOrderText": "Mái nhà (宀) -> Bộ Thả (且)", "components": "宀 + 且", "mnemonic": "Trong nhà mọi thứ sắp xếp thích hợp tạo sự thuận tiện."},
      {"hanzi": "信", "pinyin": "xìn", "meaning": "Tin tưởng, thư từ (trong WeChat 微信)", "strokesCount": 9, "strokeOrderText": "Bộ Nhân đứng (亻) bên trái -> Bộ Ngôn (言) bên phải", "components": "亻 + 言", "mnemonic": "Lời nói của con người (亻 + 言) phải giữ chữ tín."}
    ],
    "step4_grammar": {
      "title": "Hiểu đúng cách tính giảm giá '打...折' của người Trung Quốc",
      "formula": "打 X 折 = Giá bán bằng X/10 giá gốc (Ví dụ: 打八折 = Bán 80% giá, tức giảm 20%)",
      "explanation": "Người Việt hay nhầm: Nghe '打八折' tưởng giảm 80%, nhưng thực tế người Trung Quốc tính phần GIỮ LẠI (bán với 8 phần giá gốc).",
      "examples": [{"hanzi": "一件一百块的衣服，打八折就是八十块。", "pinyin": "Yí jiàn yì bǎi kuài de yīfu, dǎ bā zhé jiù shì bāshí kuài.", "meaning": "Một chiếc áo 100 tệ, giảm giá 20% (đả bát chiết) thì còn 80 tệ."}],
      "commonMistake": {"wrong": "Nghĩ 打八折 là giảm 80% ❌", "correct": "Đánh giá 8/10, tức là giảm 20% ✔️", "explanation": "Cách tính chiết khấu đặc trưng của Trung Quốc."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Khách", "hanzi": "老板，这个一百二十块太贵了，可以便宜一点儿吗？", "pinyin": "Lǎobǎn, zhè ge yì bǎi èrshí kuài tài guì le, kěyǐ piányi yìdiǎnr ma?", "meaning": "Chủ quán ơi, cái này 120 tệ đắt quá, bớt cho em chút được không?"},
        {"speaker": "Chủ shop", "hanzi": "行，看你是留学生，给你打九折，一百块拿走！你扫码还是付现金？", "pinyin": "Xíng, kàn nǐ shì liúxuéshēng, gěi nǐ dǎ jiǔ zhé, yì bǎi kuài ná zǒu! Nǐ sǎomǎ háishì fù xiànjīn?", "meaning": "Được rồi, thấy cháu là du học sinh, bớt cho cháu 10% (đả cửu chiết), 100 tệ cầm đi! Cháu quét mã hay trả tiền mặt?"}
      ],
      "audioText": "可以便宜一点儿吗？给你打折，一百块拿走！你扫码还是付现金？",
      "question": "Chủ cửa hàng đồng ý bán với giá bao nhiêu?",
      "options": ["120 tệ", "100 tệ (yì bǎi kuài)", "50 tệ", "Không bán"],
      "correctIndex": 1, "explanation": "Chủ quán đồng ý: 一百块拿走 (100 tệ)."
    },
    "step6_speaking": {"prompt": "Đọc câu mặc cả kinh điển:", "targetSentence": "老板，可以便宜一点儿吗？", "targetPinyin": "Lǎobǎn, kěyǐ piányi yìdiǎnr ma?", "targetMeaning": "Chủ quán ơi, có thể bớt chút được không?", "hint": "Đọc piányi thanh nhẹ, giọng điệu dễ thương."},
    "step7_writing": {"prompt": "Sắp xếp câu: Tôi quét mã WeChat trả tiền", "words": ["付钱", "微信", "我扫"], "correctOrder": ["我扫", "微信", "付钱"], "explanation": "我扫 + 微信 + 付钱."},
    "step8_quiz": [
      {"id": "q-209-1", "type": "multiple-choice", "question": "Cửa hàng treo biển '打七折' (dǎ qī zhé) nghĩa là khách được:", "options": ["Giảm 70%", "Giảm 30% (bán giá 70% giá gốc)", "Mua 7 tặng 1", "Miễn phí"], "correctIndex": 1, "explanation": "Đả thất chiết là bán 70% giá, tức giảm 30%."},
      {"id": "q-209-2", "type": "multiple-choice", "question": "Hai ứng dụng quét mã thanh toán phổ biến nhất Trung Quốc là:", "options": ["Facebook và Google", "WeChat (微信) và Alipay (支付宝)", "Zalo và Momo", "Grab và Shopee"], "correctIndex": 1, "explanation": "WeChat Pay và Alipay thống trị thanh toán số Trung Quốc."}
    ],
    "step9_challenge": {"title": "Chinh phục chủ shop", "taskDesc": "Đọc trọn vẹn câu: Bác ơi bớt chút đi, cháu quét mã WeChat thanh toán ngay!", "targetPhrase": "lǎobǎn kěyǐ piányi yìdiǎnr ma wǒ sǎomǎ", "xpReward": 50, "badge": "Bậc Thầy Mặc Cả"}
  },

  # --- LESSON 210 ---
  {
    "id": "l-210", "chapterId": "ch-6", "levelId": "lvl-2", "lessonNumber": 10,
    "title": "Ôn tập Module 2.2 & Thử thách đi chợ đêm mua sắm",
    "chineseTitle": "模块2.2总复习与夜市购物实战",
    "subtitle": "Tổng hợp đối thoại ăn uống, mặc cả, thanh toán quét mã tại khu chợ đêm sầm uất.",
    "objective": "Làm chủ trọn vẹn kỹ năng giao tiếp sinh hoạt ẩm thực và mua sắm trước khi đấu Boss Chapter 6.",
    "prerequisite": "Đã hoàn thành Bài 206–209.",
    "completionCriteria": "Đạt >= 80% điểm bài tập tổng kết Module 2.2.",
    "durationMinutes": 25, "xpReward": 60, "tags": ["HSK 2", "Tổng kết Module", "Chợ đêm", "Review Checkpoint"],
    "relatedMaterialIds": ["mat-2", "mat-6"],
    "step1_learn": {
      "topic": "Hội thoại thực chiến tại Chợ đêm Vương Phủ Tỉnh (王府井夜市)",
      "summary": "1. Mua đồ ăn vặt: 来一份... (Cho một phần...). 2. Thử trang phục lưu niệm: 这件多少钱，可以试吗？. 3. Mặc cả & Quét mã: 便宜点，我扫码.",
      "audioDemoText": "wángfǔjǐng yèshì hěn rènao, yǒushíhou yào dǎzhé"
    },
    "step2_vocabulary": [
      {"id": "v-210-1", "hanzi": "夜市", "pinyin": "yèshì", "hanviet": "Dạ thị", "meaning": "Chợ đêm", "radical": "夕 (Tịch)", "example": {"hanzi": "逛夜市。", "pinyin": "Guàng yèshì.", "meaning": "Dạo chợ đêm."}},
      {"id": "v-210-2", "hanzi": "热闹", "pinyin": "rènao", "hanviet": "Nhiệt náo", "meaning": "Náo nhiệt, sôi động", "radical": "灬 (Hỏa)", "example": {"hanzi": "这里真热闹！", "pinyin": "Zhèlǐ zhēn rènao!", "meaning": "Ở đây náo nhiệt thật!"}},
      {"id": "v-210-3", "hanzi": "一共", "pinyin": "yígòng", "hanviet": "Nhất cộng", "meaning": "Tổng cộng", "radical": "八 (Bát)", "example": {"hanzi": "一共五十块。", "pinyin": "Yígòng wǔshí kuài.", "meaning": "Tổng cộng 50 tệ."}}
    ],
    "step3_hanzi": [
      {"hanzi": "共", "pinyin": "gòng", "meaning": "Chung, tổng cộng", "strokesCount": 6, "strokeOrderText": "Ngang trên -> Sổ -> Sổ -> Ngang dưới -> Phẩy -> Chấm", "components": "艹 + 八", "mnemonic": "Hai bàn tay cùng chung tay góp sức lại."}
    ],
    "step4_grammar": {
      "title": "Hỏi tổng số tiền với 一共 (yígòng)",
      "formula": "一共 + Số tiền + 块 (Ví dụ: 一共八十块)",
      "explanation": "Dùng 一共 khi tính tổng chi phí nhiều món hàng mua cùng một lúc.",
      "examples": [{"hanzi": "两个一共多少钱？ 一共六十块。", "pinyin": "Liǎng gè yígòng duōshao qián? Yígòng liùshí kuài.", "meaning": "Hai cái tổng cộng bao nhiêu tiền? Tổng cộng 60 tệ."}],
      "commonMistake": {"wrong": "共一 ❌", "correct": "一共 ✔️", "explanation": "Thứ tự từ là 一共."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "老板，一碗炸酱面和一杯奶茶，一共多少钱？", "pinyin": "Lǎobǎn, yì wǎn zhájiàngmiàn hé yì bēi nǎichá, yígòng duōshao qián?", "meaning": "Chủ quán ơi, một bát mì tương đen và một ly trà sữa tổng cộng bao nhiêu tiền ạ?"},
        {"speaker": "B", "hanzi": "面二十五，奶茶十五，一共四十块。", "pinyin": "Miàn èrshíwǔ, nǎichá shíwǔ, yígòng sìshí kuài.", "meaning": "Mì 25, trà sữa 15, tổng cộng 40 tệ nhé."}
      ],
      "audioText": "一共多少钱？一共四十块。",
      "question": "Tổng cộng số tiền của hai món là bao nhiêu?",
      "options": ["25 tệ", "30 tệ", "40 tệ (sìshí kuài)", "50 tệ"],
      "correctIndex": 2, "explanation": "Chủ quán nói: 一共四十块 (40 tệ)."
    },
    "step6_speaking": {"prompt": "Hỏi tổng số tiền mua sắm:", "targetSentence": "这两个一共多少钱？", "targetPinyin": "Zhè liǎng gè yígòng duōshao qián?", "targetMeaning": "Hai cái này tổng cộng bao nhiêu tiền?", "hint": "Đọc yígòng rõ ràng thanh 2 và 4."},
    "step7_writing": {"prompt": "Sắp xếp câu: Tổng cộng năm mươi tệ", "words": ["五十块", "一共"], "correctOrder": ["一共", "五十块"], "explanation": "一共 + 五十块."},
    "step8_quiz": [
      {"id": "q-210-1", "type": "multiple-choice", "question": "Từ '一共' (yígòng) mang nghĩa là gì?", "options": ["Từng cái một", "Tổng cộng", "Đắt nhất", "Rẻ nhất"], "correctIndex": 1, "explanation": "一共 là tổng cộng."},
      {"id": "q-210-2", "type": "multiple-choice", "question": "Muốn nói 'Tôi quét mã trả tiền', bạn nói:", "options": ["我付现金", "我扫码付钱", "我不给钱", "你扫我"], "correctIndex": 1, "explanation": "我扫码付钱 = Tôi quét mã trả tiền."}
    ],
    "step9_challenge": {"title": "Mở khóa Boss Chapter 6", "taskDesc": "Vượt qua thử thách chợ đêm để chuẩn bị so tài mua sắm với Boss!", "targetPhrase": "zhè liǎng gè yígòng duōshao qián wǒ sǎomǎ", "xpReward": 60, "badge": "Chiến Thần Chợ Đêm"}
  }
]

print(f"Loaded {len(LEVEL_2_REMAINING)} lessons for Module 2.2")
