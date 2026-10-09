# -*- coding: utf-8 -*-
"""
Level 2 Curriculum Lessons (201 to 220) - HSK 2 Sinh hoạt & Tình huống thực tế
Strictly adheres to docs/HANZIGO_CHINESE_CURRICULUM.md
"""

LEVEL_2_LESSONS = [
  # =========================================================================
  # MODULE 2.1: LỊCH TRÌNH, PHƯƠNG TIỆN & ĐI LẠI (BÀI 201-205, ch-5)
  # =========================================================================

  # --- LESSON 201 ---
  {
    "id": "l-201", "chapterId": "ch-5", "levelId": "lvl-2", "lessonNumber": 1,
    "title": "Giờ giấc chi tiết, thói quen thức dậy & đi ngủ",
    "chineseTitle": "精确时间点与作息（起床与睡觉）",
    "subtitle": "Diễn đạt giờ kém (差 - chà), 15 phút (刻 - kè) và thói quen sinh hoạt thường nhật.",
    "objective": "Nói chính xác giờ kém, giờ khắc và miêu tả thời gian biểu một ngày của bạn.",
    "prerequisite": "Đã hoàn thành Level 1.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng lịch thức dậy, đi ngủ.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Giờ giấc chi tiết", "Lịch sinh hoạt", "起床", "睡觉"],
    "relatedMaterialIds": ["mat-2", "mat-6"],
    "step1_learn": {
      "topic": "Giờ kém và khắc: 差 (chà - kém) & 刻 (kè - 15 phút)",
      "summary": "Trong tiếng Trung, 15 phút là 一刻 (yí kè), 45 phút là 三刻 (sān kè). Giờ kém: 差 + Phút + 点 (差五分八点 - 8 giờ kém 5).",
      "audioDemoText": "chà wǔ fēn bā diǎn, qī diǎn yí kè, wǒ měitiān zǎoshang qī diǎn qǐchuáng"
    },
    "step2_vocabulary": [
      {"id": "v-201-1", "hanzi": "起床", "pinyin": "qǐchuáng", "hanviet": "Khởi sàng", "meaning": "Thức dậy, rời giường", "radical": "走 (Tẩu)", "example": {"hanzi": "我早上六点起床。", "pinyin": "Wǒ zǎoshang liù diǎn qǐchuáng.", "meaning": "Tôi thức dậy lúc 6 giờ sáng."}},
      {"id": "v-201-2", "hanzi": "睡觉", "pinyin": "shuìjiào", "hanviet": "Thụy giác", "meaning": "Đi ngủ", "radical": "目 (Mục)", "example": {"hanzi": "晚上十一点睡觉。", "pinyin": "Wǎnshang shíyī diǎn shuìjiào.", "meaning": "11 giờ đêm đi ngủ."}},
      {"id": "v-201-3", "hanzi": "差", "pinyin": "chà", "hanviet": "Sai", "meaning": "Kém, thiếu", "radical": "工 (Công)", "example": {"hanzi": "差五分九点。", "pinyin": "Chà wǔ fēn jiǔ diǎn.", "meaning": "9 giờ kém 5 phút."}},
      {"id": "v-201-4", "hanzi": "刻", "pinyin": "kè", "hanviet": "Khắc", "meaning": "15 phút, khắc", "radical": "刂 (Đao)", "example": {"hanzi": "七点一刻。", "pinyin": "Qī diǎn yí kè.", "meaning": "7 giờ 15 phút."}},
      {"id": "v-201-5", "hanzi": "每天", "pinyin": "měitiān", "hanviet": "Mỗi thiên", "meaning": "Mỗi ngày, hàng ngày", "radical": "人 (Nhân)", "example": {"hanzi": "我每天跑步。", "pinyin": "Wǒ měitiān pǎobù.", "meaning": "Mỗi ngày tôi đều chạy bộ."}},
      {"id": "v-201-6", "hanzi": "早饭", "pinyin": "zǎofàn", "hanviet": "Tảo phạn", "meaning": "Bữa sáng", "radical": "日 (Nhật)", "example": {"hanzi": "吃了早饭。", "pinyin": "Chī le zǎofàn.", "meaning": "Ăn bữa sáng rồi."}}
    ],
    "step3_hanzi": [
      {"hanzi": "床", "pinyin": "chuáng", "meaning": "Giường ngủ", "strokesCount": 7, "strokeOrderText": "Bộ Quảng (广) ở ngoài -> Bộ Mộc (木) ở trong", "components": "广 + 木", "mnemonic": "Chiếc giường bằng gỗ (Mộc) đặt trong căn nhà (Quảng)."},
      {"hanzi": "睡", "pinyin": "shuì", "meaning": "Ngủ", "strokesCount": 13, "strokeOrderText": "Bộ Mục (目) bên trái -> Chữ Thùy (垂) bên phải", "components": "目 + 垂", "mnemonic": "Đôi mắt (目) rủ mí xuống (垂) chính là chìm vào giấc ngủ."}
    ],
    "step4_grammar": {
      "title": "Cấu trúc nói giờ kém trong tiếng Trung: 差 + Phút + 点",
      "formula": "差 + Số phút + 分 + Số giờ + 点",
      "explanation": "Từ 差 đặt ở đầu để chỉ số phút còn thiếu trước khi chạm tới giờ tròn.",
      "examples": [{"hanzi": "现在差十分八点。", "pinyin": "Xiànzài chà shí fēn bā diǎn.", "meaning": "Bây giờ là 8 giờ kém 10 phút."}],
      "commonMistake": {"wrong": "八点差十分 ❌", "correct": "差十分八点 ✔️", "explanation": "Trong tiếng Trung, chữ 差 phải đứng trước số phút."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "你每天几点起床？几点睡觉？", "pinyin": "Nǐ měitiān jǐ diǎn qǐchuáng? Jǐ diǎn shuìjiào?", "meaning": "Mỗi ngày bạn mấy giờ thức dậy? Mấy giờ đi ngủ?"},
        {"speaker": "B", "hanzi": "我早上七点一刻起床，晚上差十分十一点睡觉。", "pinyin": "Wǒ zǎoshang qī diǎn yí kè qǐchuáng, wǎnshang chà shí fēn shíyī diǎn shuìjiào.", "meaning": "Tôi thức dậy lúc 7 giờ 15 phút sáng, và đi ngủ lúc 11 giờ kém 10 đêm."}
      ],
      "audioText": "我早上七点一刻起床，晚上差十分十一点睡觉。",
      "question": "Người B thức dậy vào thời điểm nào?",
      "options": ["6 giờ 30 sáng", "7 giờ 15 sáng (qī diǎn yí kè)", "8 giờ sáng", "7 giờ kém 15"],
      "correctIndex": 1, "explanation": "七点一刻 = 7 giờ 15 phút sáng."
    },
    "step6_speaking": {"prompt": "Nói giờ thức dậy của bạn:", "targetSentence": "我每天早上七点起床。", "targetPinyin": "Wǒ měitiān zǎoshang qī diǎn qǐchuáng.", "targetMeaning": "Hàng ngày tôi thức dậy lúc 7 giờ sáng.", "hint": "Đọc qǐchuáng rõ ràng thanh 3 và 2."},
    "step7_writing": {"prompt": "Sắp xếp câu: Bây giờ là 8 giờ kém 5", "words": ["八点", "现在", "差五分"], "correctOrder": ["现在", "差五分", "八点"], "explanation": "现在 + 差五分 + 八点."},
    "step8_quiz": [
      {"id": "q-201-1", "type": "multiple-choice", "question": "Cách nói chuẩn của '7 giờ 15 phút' là:", "options": ["七点一刻", "七刻一点", "一刻七点", "七点十五刻"], "correctIndex": 0, "explanation": "15 phút là 一刻: 七点一刻."},
      {"id": "q-201-2", "type": "multiple-choice", "question": "Chữ '差' trong '差十分十点' mang ý nghĩa gì?", "options": ["Hơn", "Kém / Thiếu", "Đúng", "Rưỡi"], "correctIndex": 1, "explanation": "Chà mang nghĩa là kém (10 giờ kém 10)."}
    ],
    "step9_challenge": {"title": "Lên lịch sinh hoạt vàng", "taskDesc": "Đọc to câu miêu tả giờ thức dậy và giờ đi ngủ của bạn bằng cụm giờ chính xác.", "targetPhrase": "wǒ qī diǎn qǐchuáng shíyī diǎn shuìjiào", "xpReward": 50, "badge": "Bậc Thầy Giờ Giấc"}
  },

  # --- LESSON 202 ---
  {
    "id": "l-202", "chapterId": "ch-5", "levelId": "lvl-2", "lessonNumber": 2,
    "title": "Phương tiện giao thông công cộng & Động từ di chuyển",
    "chineseTitle": "公共交通与出行（坐地铁、公共汽车、出租车）",
    "subtitle": "Nói về phương tiện di chuyển với 坐 (ngồi/đi xe), 骑 (cưỡi/đi xe đạp), 地铁 (tàu điện ngầm), 出租车 (taxi).",
    "objective": "Diễn đạt được bạn đi đâu bằng phương tiện gì và hỏi cách đi lại tại thành phố lớn.",
    "prerequisite": "Đã hoàn thành Bài 201.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cặp 坐 / 骑 với phương tiện.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Giao thông", "Phương tiện", "坐", "骑", "地铁"],
    "relatedMaterialIds": ["mat-2", "mat-7"],
    "step1_learn": {
      "topic": "Động từ phương tiện: 坐 (zuò - Đi/Ngồi xe ô tô, tàu điện) vs 骑 (qí - Đi xe đạp, xe máy)",
      "summary": "Phương tiện có buồng lái ngồi vào dùng 坐 (坐出租车, 坐地铁, 坐飞机). Phương tiện ngồi dạng cưỡi hai chân dùng 骑 (骑自行车, 骑摩托车).",
      "audioDemoText": "wǒ zuò dìtiě qù gōngsī, tā qí zìxíngchē qù xuéxiào"
    },
    "step2_vocabulary": [
      {"id": "v-202-1", "hanzi": "坐", "pinyin": "zuò", "hanviet": "Tọa", "meaning": "Ngồi, đi (phương tiện)", "radical": "土 (Thổ)", "example": {"hanzi": "坐出租车。", "pinyin": "Zuò chūzūchē.", "meaning": "Đi xe taxi."}},
      {"id": "v-202-2", "hanzi": "地铁", "pinyin": "dìtiě", "hanviet": "Địa thiết", "meaning": "Tàu điện ngầm", "radical": "土 (Thổ)", "example": {"hanzi": "北京地铁很方便。", "pinyin": "Běijīng dìtiě hěn fāngbiàn.", "meaning": "Tàu điện ngầm Bắc Kinh rất tiện lợi."}},
      {"id": "v-202-3", "hanzi": "公共汽车", "pinyin": "gōnggòng qìchē", "hanviet": "Công cộng khí xa", "meaning": "Xe buýt", "radical": "八 (Bát)", "example": {"hanzi": "坐公共汽车。", "pinyin": "Zuò gōnggòng qìchē.", "meaning": "Đi xe buýt."}},
      {"id": "v-202-4", "hanzi": "出租车", "pinyin": "chūzūchē", "hanviet": "Xuất tô xa", "meaning": "Xe taxi", "radical": "出 (Xuất)", "example": {"hanzi": "打出租车。", "pinyin": "Dǎ chūzūchē.", "meaning": "Bắt taxi."}},
      {"id": "v-202-5", "hanzi": "骑", "pinyin": "qí", "hanviet": "Kỵ", "meaning": "Cưỡi, đi (xe đạp, xe máy)", "radical": "马 (Mã)", "example": {"hanzi": "骑自行车。", "pinyin": "Qí zìxíngchē.", "meaning": "Đi xe đạp."}},
      {"id": "v-202-6", "hanzi": "自行车", "pinyin": "zìxíngchē", "hanviet": "Tự hành xa", "meaning": "Xe đạp", "radical": "自 (Tự)", "example": {"hanzi": "买一辆自行车。", "pinyin": "Mǎi yí liàng zìxíngchē.", "meaning": "Mua một chiếc xe đạp."}}
    ],
    "step3_hanzi": [
      {"hanzi": "坐", "pinyin": "zuò", "meaning": "Ngồi, đi xe", "strokesCount": 7, "strokeOrderText": "Bộ Nhân (人) trái -> Bộ Nhân (人) phải -> Bộ Thổ (土) dưới", "components": "人 + 人 + 土", "mnemonic": "Hai người (人 人) cùng ngồi nói chuyện trên mặt đất (土)."},
      {"hanzi": "铁", "pinyin": "tiě", "meaning": "Sắt thép (trong Địa thiết 地铁)", "strokesCount": 10, "strokeOrderText": "Bộ Kim (钅) bên trái -> Chữ Thất (失) bên phải", "components": "钅 + 失", "mnemonic": "Kim loại sắt thép tạo nên đường ray tàu ngầm vững chắc."}
    ],
    "step4_grammar": {
      "title": "Cấu trúc đi đâu bằng phương tiện gì (Chủ ngữ + 坐/骑 + Phương tiện + 去 + Nơi chốn)",
      "formula": "Chủ ngữ + 坐 / 骑 + Phương tiện + 去 + Địa điểm",
      "explanation": "Phương thức di chuyển luôn đứng trước hành động đi tới đích đến.",
      "examples": [{"hanzi": "我每天坐地铁去上班。", "pinyin": "Wǒ měitiān zuò dìtiě qù shàngbān.", "meaning": "Mỗi ngày tôi đi tàu điện ngầm đi làm."}],
      "commonMistake": {"wrong": "我去上班坐地铁 ❌", "correct": "我坐地铁去上班 ✔️", "explanation": "Cách thức di chuyển đứng trước mục đích."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "你今天怎么去公司？", "pinyin": "Nǐ jīntiān zěnme qù gōngsī?", "meaning": "Hôm nay bạn đi đến công ty bằng cách nào?"},
        {"speaker": "B", "hanzi": "今天天气很好，我骑自行车去。", "pinyin": "Jīntiān tiānqì hěn hǎo, wǒ qí zìxíngchē qù.", "meaning": "Hôm nay thời tiết đẹp, tôi đạp xe đạp đi."}
      ],
      "audioText": "你今天怎么去公司？今天天气很好，我骑自行车去。",
      "question": "Người B đi đến công ty bằng phương tiện gì?",
      "options": ["Tàu điện ngầm", "Xe đạp (zìxíngchē)", "Xe buýt", "Xe taxi"],
      "correctIndex": 1, "explanation": "骑自行车去 = Đạp xe đạp đi."
    },
    "step6_speaking": {"prompt": "Nói bạn đi tàu điện ngầm đi làm:", "targetSentence": "我坐地铁去上班。", "targetPinyin": "Wǒ zuò dìtiě qù shàngbān.", "targetMeaning": "Tôi đi tàu điện ngầm đi làm.", "hint": "Đọc dìtiě dứt khoát với thanh 4 và 3."},
    "step7_writing": {"prompt": "Sắp xếp câu: Anh ấy đi xe buýt đến trường", "words": ["去学校", "坐公共汽车", "他"], "correctOrder": ["他", "坐公共汽车", "去学校"], "explanation": "他 + 坐公共汽车 + 去学校."},
    "step8_quiz": [
      {"id": "q-202-1", "type": "multiple-choice", "question": "Động từ phù hợp đi cùng '自行车' (xe đạp) là:", "options": ["坐 (zuò)", "骑 (qí)", "开 (kāi)", "走 (zǒu)"], "correctIndex": 1, "explanation": "Đi xe đạp dùng động từ 骑 (qí zìxíngchē)."},
      {"id": "q-202-2", "type": "multiple-choice", "question": "Từ nào sau đây mang nghĩa là 'Tàu điện ngầm'?", "options": ["出租车", "公共汽车", "地铁 (dìtiě)", "飞机"], "correctIndex": 2, "explanation": "地铁 (Địa thiết) là tàu điện ngầm."}
    ],
    "step9_challenge": {"title": "Lập lộ trình đi lại", "taskDesc": "Nói to câu giới thiệu lộ trình đi học/đi làm hàng ngày của bạn và phương tiện sử dụng.", "targetPhrase": "wǒ zuò dìtiě qù shàngbān", "xpReward": 50, "badge": "Phượt Thủ Đô Thị"}
  },

  # --- LESSON 203 ---
  {
    "id": "l-203", "chapterId": "ch-5", "levelId": "lvl-2", "lessonNumber": 3,
    "title": "Diễn đạt khoảng cách không gian với giới từ 离 (lí)",
    "chineseTitle": "空间距离与介词“离”（离这里很远/很近）",
    "subtitle": "Nắm vững cấu trúc A 离 B 很远/很近 (A cách B rất xa/rất gần) và hỏi khoảng cách bao xa.",
    "objective": "Hỏi và miêu tả được khoảng cách giữa hai địa điểm bằng cấu trúc chữ 离.",
    "prerequisite": "Đã hoàn thành Bài 202.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng cấu trúc A 离 B.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Khoảng cách", "Giới từ 离", "远", "近"],
    "relatedMaterialIds": ["mat-2", "mat-7"],
    "step1_learn": {
      "topic": "Giới từ khoảng cách: A 离 B 很远 / 很近 (A lí B hěn yuǎn / hěn jìn)",
      "summary": "离 (lí - Ly) dùng để so sánh khoảng cách từ điểm A tới điểm B. Cấu trúc: Nơi chốn A + 离 + Nơi chốn B + (Khoảng cách / 很远 / 很近).",
      "audioDemoText": "wǒ jiā lí gōngsī hěn jìn, xuéxiào lí jīchǎng hěn yuǎn"
    },
    "step2_vocabulary": [
      {"id": "v-203-1", "hanzi": "离", "pinyin": "lí", "hanviet": "Ly", "meaning": "Cách, rời khỏi", "radical": "亠 (Đầu)", "example": {"hanzi": "学校离这里不远。", "pinyin": "Xuéxiào lí zhèlǐ bù yuǎn.", "meaning": "Trường học cách đây không xa."}},
      {"id": "v-203-2", "hanzi": "远", "pinyin": "yuǎn", "hanviet": "Viễn", "meaning": "Xa", "radical": "辶 (Sước)", "example": {"hanzi": "太远了。", "pinyin": "Tài yuǎn le.", "meaning": "Xa quá rồi."}},
      {"id": "v-203-3", "hanzi": "近", "pinyin": "jìn", "hanviet": "Cận", "meaning": "Gần", "radical": "辶 (Sước)", "example": {"hanzi": "我家离公司很近。", "pinyin": "Wǒ jiā lí gōngsī hěn jìn.", "meaning": "Nhà tôi cách công ty rất gần."}},
      {"id": "v-203-4", "hanzi": "公里", "pinyin": "gōnglǐ", "hanviet": "Công lý", "meaning": "Ki-lô-mét (km)", "radical": "八 (Bát)", "example": {"hanzi": "有五公里。", "pinyin": "Yǒu wǔ gōnglǐ.", "meaning": "Cách 5 km."}},
      {"id": "v-203-5", "hanzi": "走路", "pinyin": "zǒulù", "hanviet": "Tẩu lộ", "meaning": "Đi bộ", "radical": "走 (Tẩu)", "example": {"hanzi": "走路去十分钟。", "pinyin": "Zǒulù qù shí fēnzhōng.", "meaning": "Đi bộ mất 10 phút."}},
      {"id": "v-203-6", "hanzi": "分钟", "pinyin": "fēnzhōng", "hanviet": "Phân chung", "meaning": "Phút (khoảng thời gian)", "radical": "钅 (Kim)", "example": {"hanzi": "二十分钟。", "pinyin": "Èrshí fēnzhōng.", "meaning": "20 phút."}}
    ],
    "step3_hanzi": [
      {"hanzi": "远", "pinyin": "yuǎn", "meaning": "Xa xôi", "strokesCount": 7, "strokeOrderText": "Bộ Nguyên (元) bên trong -> Bộ Sước (辶) bao ngoài", "components": "元 + 辶", "mnemonic": "Bước chân đi xa (辶) đến tận nơi nguyên thủy ban đầu."},
      {"hanzi": "近", "pinyin": "jìn", "meaning": "Gần gũi", "strokesCount": 7, "strokeOrderText": "Bộ Cân (斤) bên trong -> Bộ Sước (辶) bao ngoài", "components": "斤 + 辶", "mnemonic": "Cầm cây rìu (Cân) đi vài bước chân (Sước) là tới nơi gần."}
    ],
    "step4_grammar": {
      "title": "Cấu trúc khoảng cách: A + 离 + B + Tính từ / Khoảng cách",
      "formula": "Địa điểm A + 离 + Địa điểm B + 很远 / 很近 / Có bao nhiêu km/phút",
      "explanation": "Câu hỏi khoảng cách thường dùng: A 离 B 远吗？ (A cách B xa không?) hoặc A 离 B 多远？ (A cách B bao xa?).",
      "examples": [{"hanzi": "我家离地铁站只有五百米。", "pinyin": "Wǒ jiā lí dìtiězhàn zhǐ yǒu wǔ bǎi mǐ.", "meaning": "Nhà tôi cách ga tàu điện ngầm chỉ có 500 mét."}],
      "commonMistake": {"wrong": "我家从地铁站很近 ❌", "correct": "我家离地铁站很近 ✔️", "explanation": "Nói khoảng cách tĩnh dùng 离 (không dùng 从)."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "请问，故宫离这里远不远？", "pinyin": "Qǐngwèn, Gùgōng lí zhèlǐ yuǎn bu yuǎn?", "meaning": "Xin hỏi, Tử Cấm Thành cách đây có xa không?"},
        {"speaker": "B", "hanzi": "不远，离这里只有两公里，走路二十分钟就到了。", "pinyin": "Bù yuǎn, lí zhèlǐ zhǐ yǒu liǎng gōnglǐ, zǒulù èrshí fēnzhōng jiù dào le.", "meaning": "Không xa, cách đây chỉ có 2 km thôi, đi bộ 20 phút là tới rồi."}
      ],
      "audioText": "故宫离这里远不远？不远，离这里只有两公里。",
      "question": "Địa điểm Tử Cấm Thành cách đây bao xa?",
      "options": ["Rất xa, cách 20 km", "Không xa, chỉ cách 2 km (liǎng gōnglǐ)", "Phải đi máy bay", "Cách 50 km"],
      "correctIndex": 1, "explanation": "B nói: 不远，只有两公里."
    },
    "step6_speaking": {"prompt": "Nói nhà bạn cách công ty rất gần:", "targetSentence": "我家离公司很近。", "targetPinyin": "Wǒ jiā lí gōngsī hěn jìn.", "targetMeaning": "Nhà tôi cách công ty rất gần.", "hint": "Đọc rõ ràng lí và jìn thanh 4."},
    "step7_writing": {"prompt": "Sắp xếp câu: Trường học cách đây không xa", "words": ["不远", "离这里", "学校"], "correctOrder": ["学校", "离这里", "不远"], "explanation": "学校 + 离这里 + 不远."},
    "step8_quiz": [
      {"id": "q-203-1", "type": "multiple-choice", "question": "Điền từ thích hợp vào chỗ trống: 我家 ___ 学校很近。", "options": ["在", "从", "离 (lí)", "往"], "correctIndex": 2, "explanation": "Biểu thị khoảng cách cách bao xa dùng 离."},
      {"id": "q-203-2", "type": "multiple-choice", "question": "Từ phản nghĩa của '远' (yuǎn - Xa) là:", "options": ["大 (dà)", "近 (jìn - Gần)", "高 (gāo)", "冷 (lěng)"], "correctIndex": 1, "explanation": "Gần là 近 (jìn)."}
    ],
    "step9_challenge": {"title": "Đo đạc khoảng cách", "taskDesc": "Nói to câu giới thiệu khoảng cách từ nhà bạn đến trường/chỗ làm bao nhiêu km hoặc đi mất bao lâu.", "targetPhrase": "wǒ jiā lí gōngsī bù yuǎn", "xpReward": 50, "badge": "Chuyên Gia Đo Đạc"}
  },

  # --- LESSON 204 ---
  {
    "id": "l-204", "chapterId": "ch-5", "levelId": "lvl-2", "lessonNumber": 4,
    "title": "Hỏi đường & Chỉ hướng với giới từ 往 (wǎng)",
    "chineseTitle": "问路与指路介词“往”（往左拐、往前走）",
    "subtitle": "Nắm vững kỹ năng hỏi đường (怎么走), rẽ trái (往左拐), rẽ phải (往右拐), đi thẳng (往前走).",
    "objective": "Hỏi đường người đi đường và hiểu trọn vẹn chỉ dẫn hướng đi để không bị lạc ở Trung Quốc.",
    "prerequisite": "Đã hoàn thành Bài 203.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cấu trúc 往 + Hướng + Động từ.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 2", "Hỏi đường", "Giới từ 往", "Phương hướng", "Rẽ trái", "Đi thẳng"],
    "relatedMaterialIds": ["mat-2", "mat-7"],
    "step1_learn": {
      "topic": "Chỉ hướng với giới từ 往 (wǎng - Hướng về phía): 往 + Hướng + Động từ di chuyển",
      "summary": "往 (wǎng) biểu thị phương hướng vận động: 往前走 (Đi về phía trước), 往左拐 (Rẽ sang trái), 往右拐 (Rẽ sang phải).",
      "audioDemoText": "qǐngwèn dìtiězhàn zěnme zǒu, wǎng qián zǒu, dào lùkǒu wǎng zuǒ guǎi"
    },
    "step2_vocabulary": [
      {"id": "v-204-1", "hanzi": "往", "pinyin": "wǎng", "hanviet": "Vãng", "meaning": "Về hướng, hướng tới", "radical": "彳 (Xích)", "example": {"hanzi": "往前走。", "pinyin": "Wǎng qián zǒu.", "meaning": "Đi thẳng về phía trước."}},
      {"id": "v-204-2", "hanzi": "左", "pinyin": "zuǒ", "hanviet": "Tả", "meaning": "Bên trái", "radical": "工 (Công)", "example": {"hanzi": "往左拐。", "pinyin": "Wǎng zuǒ guǎi.", "meaning": "Rẽ sang bên trái."}},
      {"id": "v-204-3", "hanzi": "右", "pinyin": "yòu", "hanviet": "Hữu", "meaning": "Bên phải", "radical": "口 (Khẩu)", "example": {"hanzi": "往右拐。", "pinyin": "Wǎng yòu guǎi.", "meaning": "Rẽ sang bên phải."}},
      {"id": "v-204-4", "hanzi": "拐", "pinyin": "guǎi", "hanviet": "Quải", "meaning": "Rẽ, quẹo", "radical": "扌 (Thủ)", "example": {"hanzi": "在路口拐弯。", "pinyin": "Zài lùkǒu guǎi wān.", "meaning": "Rẽ tại ngã rẽ."}},
      {"id": "v-204-5", "hanzi": "路口", "pinyin": "lùkǒu", "hanviet": "Lộ khẩu", "meaning": "Ngã tư, ngã rẽ đường", "radical": "足 (Túc)", "example": {"hanzi": "前面的十字路口。", "pinyin": "Qiánmiàn de shízì lùkǒu.", "meaning": "Ngã tư đường phía trước."}},
      {"id": "v-204-6", "hanzi": "红绿灯", "pinyin": "hónglǜdēng", "hanviet": "Hồng lục đăng", "meaning": "Đèn giao thông (xanh đỏ)", "radical": "糸 (Mịch)", "example": {"hanzi": "看红绿灯。", "pinyin": "Kàn hónglǜdēng.", "meaning": "Nhìn đèn tín hiệu giao thông."}}
    ],
    "step3_hanzi": [
      {"hanzi": "左", "pinyin": "zuǒ", "meaning": "Bên trái", "strokesCount": 5, "strokeOrderText": "Ngang -> Phẩy -> Nét chữ Công (工)", "components": "𠂇 + 工", "mnemonic": "Tay trái cầm công cụ hỗ trợ làm việc."},
      {"hanzi": "右", "pinyin": "yòu", "meaning": "Bên phải", "strokesCount": 5, "strokeOrderText": "Ngang -> Phẩy -> Bộ Khẩu (口)", "components": "𠂇 + 口", "mnemonic": "Tay phải cầm đũa đưa thức ăn vào miệng (Khẩu)."}
    ],
    "step4_grammar": {
      "title": "Cấu trúc chỉ hướng kinh điển: 往 + Phương hướng + Động từ (拐 / 走)",
      "formula": "往 + 前 / 左 / 右 + 走 (Đi) / 拐 (Rẽ)",
      "explanation": "Khác với tiếng Việt (Rẽ trái -> Tiếng Trung: Hướng về bên trái mà rẽ = 往左拐).",
      "examples": [{"hanzi": "到前面的红绿灯，往右拐就到了。", "pinyin": "Dào qiánmiàn de hónglǜdēng, wǎng yòu guǎi jiù dào le.", "meaning": "Đến chỗ đèn giao thông phía trước, rẽ phải là tới rồi."}],
      "commonMistake": {"wrong": "拐左 ❌", "correct": "往左拐 ✔️", "explanation": "Phải có giới từ 往 chỉ hướng."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Du khách", "hanzi": "请问，去地铁站怎么走？", "pinyin": "Qǐngwèn, qù dìtiězhàn zěnme zǒu?", "meaning": "Xin hỏi, đi đến ga tàu điện ngầm đi đường nào?"},
        {"speaker": "Người đi đường", "hanzi": "你往前走五百米，在第一个路口往左拐，就能看见了。", "pinyin": "Nǐ wǎng qián zǒu wǔ bǎi mǐ, zài dì yí gè lùkǒu wǎng zuǒ guǎi, jiù néng kànjiàn le.", "meaning": "Bạn đi thẳng 500m, ở ngã rẽ đầu tiên rẽ sang trái là sẽ nhìn thấy ngay."}
      ],
      "audioText": "你往前走五百米，在第一个路口往左拐，就能看见了。",
      "question": "Chỉ dẫn rẽ ở đâu?",
      "options": ["Rẽ phải ở ngã tư thứ hai", "Rẽ trái ở ngã rẽ đầu tiên (dì yí gè lùkǒu wǎng zuǒ guǎi)", "Quay đầu lại", "Đi thẳng 2 km"],
      "correctIndex": 1, "explanation": "在第一个路口往左拐 = Ngã rẽ đầu tiên rẽ trái."
    },
    "step6_speaking": {"prompt": "Đọc câu chỉ đường: Đi thẳng rồi rẽ phải:", "targetSentence": "往前走，往右拐。", "targetPinyin": "Wǎng qián zǒu, wǎng yòu guǎi.", "targetMeaning": "Đi thẳng về phía trước, rẽ sang bên phải.", "hint": "Đọc dứt khoát wǎng qián zǒu."},
    "step7_writing": {"prompt": "Sắp xếp câu: Rẽ trái ở ngã tư đường", "words": ["在路口", "往左拐"], "correctOrder": ["在路口", "往左拐"], "explanation": "在路口 + 往左拐."},
    "step8_quiz": [
      {"id": "q-204-1", "type": "multiple-choice", "question": "Cách nói 'Rẽ phải' chuẩn xác trong tiếng Trung là:", "options": ["拐右", "往右拐 (wǎng yòu guǎi)", "右走", "拐在右"], "correctIndex": 1, "explanation": "Cấu trúc chỉ hướng: 往右拐."},
      {"id": "q-204-2", "type": "multiple-choice", "question": "Cụm '红绿灯' (hónglǜdēng) mang nghĩa là gì?", "options": ["Đèn lồng đỏ", "Đèn giao thông (đèn xanh đèn đỏ)", "Biển báo tốc độ", "Đường cao tốc"], "correctIndex": 1, "explanation": "Hồng lục đăng là đèn tín hiệu giao thông."}
    ],
    "step9_challenge": {"title": "Bậc thầy dẫn đường", "taskDesc": "Đọc to câu hướng dẫn bạn bè đi thẳng 200m rồi rẽ trái đến trạm xe buýt.", "targetPhrase": "wǎng qián zǒu wǎng zuǒ guǎi dào dìtiězhàn", "xpReward": 50, "badge": "Bản Đồ Di Động"}
  },

  # --- LESSON 205 ---
  {
    "id": "l-205", "chapterId": "ch-5", "levelId": "lvl-2", "lessonNumber": 5,
    "title": "Ôn tập Module 2.1 & Thử thách bắt taxi, chỉ đường thực tế",
    "chineseTitle": "模块2.1总复习与打车实战挑战",
    "subtitle": "Tổng kết đàm thoại gọi taxi, nói địa điểm, giao tiếp với tài xế và sẵn sàng đấu Boss Chapter 5.",
    "objective": "Tự tin đối thoại với tài xế taxi, chỉ đường trực tiếp và hỏi giá tiền chuyến đi trôi chảy.",
    "prerequisite": "Đã hoàn thành Bài 201–204.",
    "completionCriteria": "Đạt >= 80% điểm bài tập tổng kết Module 2.1.",
    "durationMinutes": 25, "xpReward": 60, "tags": ["HSK 2", "Tổng kết Module", "Bắt taxi", "Thực chiến chỉ đường"],
    "relatedMaterialIds": ["mat-2", "mat-7"],
    "step1_learn": {
      "topic": "Hội thoại gọi taxi thực chiến tại Bắc Kinh",
      "summary": "1. Chào hỏi & Nêu điểm đến: 师傅，我去... (Thưa bác tài, cháu đi...). 2. Hỏi thời gian: 大概需要多长时间？ (Khoảng bao lâu tới?). 3. Chỉ đường gần đích: 前面路口靠边停 (Phía trước ngã rẽ tấp lề đỗ lại).",
      "audioDemoText": "shīfu wǒ qù běijīng dàxué, duō cháng shíjiān néng dào"
    },
    "step2_vocabulary": [
      {"id": "v-205-1", "hanzi": "师傅", "pinyin": "shīfu", "hanviet": "Sư phó", "meaning": "Bác tài, chú (xưng hô tài xế, thợ)", "radical": "巾 (Cân)", "example": {"hanzi": "师傅，请问去机场多少钱？", "pinyin": "Shīfu, qǐngwèn qù jīchǎng duōshao qián?", "meaning": "Bác tài ơi, đi sân bay bao nhiêu tiền ạ?"}},
      {"id": "v-205-2", "hanzi": "大概", "pinyin": "dàgài", "hanviet": "Đại khái", "meaning": "Khoảng chừng, đại khái", "radical": "木 (Mộc)", "example": {"hanzi": "大概半个小时。", "pinyin": "Dàgài bàn gè xiǎoshí.", "meaning": "Khoảng nửa tiếng đồng hồ."}},
      {"id": "v-205-3", "hanzi": "停车", "pinyin": "tíngchē", "hanviet": "Đình xa", "meaning": "Dừng xe, đỗ xe", "radical": "亻 (Nhân)", "example": {"hanzi": "在这里停车。", "pinyin": "Zài zhèlǐ tíngchē.", "meaning": "Đỗ xe ở đây."}}
    ],
    "step3_hanzi": [
      {"hanzi": "停", "pinyin": "tíng", "meaning": "Dừng lại, đỗ xe", "strokesCount": 11, "strokeOrderText": "Bộ Nhân đứng (亻) -> Chữ Đình (亭)", "components": "亻 + 亭", "mnemonic": "Con người (亻) bước vào ngôi đình (亭) dừng chân nghỉ ngơi."}
    ],
    "step4_grammar": {
      "title": "Cụm câu khẩu ngữ kinh điển khi đi taxi",
      "formula": "师傅，我去 + Nơi chốn。 前面 + 往左拐 / 靠边停。",
      "explanation": "Từ 师傅 là cách gọi tôn trọng và thân thiện nhất với các bác tài xế taxi tại Trung Quốc.",
      "examples": [{"hanzi": "师傅，前面路口右拐，谢谢！", "pinyin": "Shīfu, qiánmiàn lùkǒu yòuguǎi, xièxie!", "meaning": "Bác tài ơi, ngã rẽ phía trước rẽ phải ạ, cảm ơn bác!"}],
      "commonMistake": {"wrong": "Gọi tài xế là 司机 (nghe xa cách và lạnh nhạt)", "correct": "Gọi là 师傅 (thân mật, bản xứ)", "explanation": "Văn hóa giao tiếp xã hội Trung Quốc."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Khách", "hanzi": "师傅，我去王府井步行街，大概要多长时间？", "pinyin": "Shīfu, wǒ qù Wángfǔjǐng Bùxíngjiē, dàgài yào duō cháng shíjiān?", "meaning": "Bác tài ơi, cháu đi phố đi bộ Vương Phủ Tỉnh, khoảng bao lâu thì tới ạ?"},
        {"speaker": "Tài xế", "hanzi": "不堵车的话，大概二十分钟就到了。", "pinyin": "Bù dǔchē dehuà, dàgài èrshí fēnzhōng jiù dào le.", "meaning": "Nếu không kẹt xe thì khoảng 20 phút là tới nơi rồi."}
      ],
      "audioText": "师傅，我去王府井步行街，大概要多长时间？大概二十分钟就到了。",
      "question": "Chuyến đi taxi dự kiến mất bao lâu?",
      "options": ["1 tiếng", "Khoảng 20 phút (dàgài èrshí fēnzhōng)", "5 phút", "2 tiếng"],
      "correctIndex": 1, "explanation": "Tài xế nói: 大概二十分钟."
    },
    "step6_speaking": {"prompt": "Nói với tài xế taxi dừng xe tại đây:", "targetSentence": "师傅，请在这里停车。", "targetPinyin": "Shīfu, qǐng zài zhèlǐ tíngchē.", "targetMeaning": "Bác tài ơi, xin dừng xe ở đây ạ.", "hint": "Đọc lịch sự và to rõ ràng."},
    "step7_writing": {"prompt": "Sắp xếp câu: Bác tài ơi, tôi đi sân bay", "words": ["我去机场", "师傅"], "correctOrder": ["师傅", "我去机场"], "explanation": "师傅 + 我去机场."},
    "step8_quiz": [
      {"id": "q-205-1", "type": "multiple-choice", "question": "Cách xưng hô tự nhiên và lịch sự nhất với bác tài xế taxi là:", "options": ["老师 (Lǎoshī)", "师傅 (Shīfu)", "服务员 (Fúwùyuán)", "老板 (Lǎobǎn)"], "correctIndex": 1, "explanation": "Xưng hô với tài xế là 师傅 (Shīfu)."},
      {"id": "q-205-2", "type": "multiple-choice", "question": "Cụm '大概' (dàgài) mang ý nghĩa gì?", "options": ["Chắc chắn 100%", "Đại khái / Khoảng chừng", "Không bao giờ", "Chậm trễ"], "correctIndex": 1, "explanation": "Đại khái nghĩa là khoảng chừng, ước lượng."}
    ],
    "step9_challenge": {"title": "Mở khóa Boss Chapter 5", "taskDesc": "Vượt qua thử thách đàm thoại di chuyển để mở khóa Boss giao thông đô thị!", "targetPhrase": "shīfu wǒ qù jīchǎng qǐng zài zhèlǐ tíngchē", "xpReward": 60, "badge": "Tài Xế Vàng Phố Thị"}
  }
]

print(f"Loaded {len(LEVEL_2_LESSONS)} lessons for Level 2 Module 2.1")
