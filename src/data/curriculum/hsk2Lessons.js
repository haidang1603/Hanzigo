/**
 * =========================================================================
 * HANZI GO - HSK 2 CURRICULUM LESSONS (20 LESSONS)
 * =========================================================================
 * Tách biệt theo cơ chế Granular Chunking nhằm tối ưu dung lượng tải ban đầu.
 * Đảm bảo 100% ID bài học, ID từ vựng, âm Hán Việt và quy trình 9 bước sư phạm.
 */

export const HSK_2_LESSONS = [
  {
    "id": "l-201",
    "chapterId": "ch-5",
    "levelId": "lvl-2",
    "lessonNumber": 1,
    "title": "Giờ giấc chi tiết, thói quen thức dậy & đi ngủ",
    "chineseTitle": "精确时间点与作息（起床与睡觉）",
    "subtitle": "Diễn đạt giờ kém (差 - chà), 15 phút (刻 - kè) và thói quen sinh hoạt thường nhật.",
    "objective": "Nói chính xác giờ kém, giờ khắc và miêu tả thời gian biểu một ngày của bạn.",
    "prerequisite": "Đã hoàn thành Level 1.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng lịch thức dậy, đi ngủ.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Giờ giấc chi tiết",
      "Lịch sinh hoạt",
      "起床",
      "睡觉"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Giờ kém và khắc: 差 (chà - kém) & 刻 (kè - 15 phút)",
      "summary": "Trong tiếng Trung, 15 phút là 一刻 (yí kè), 45 phút là 三刻 (sān kè). Giờ kém: 差 + Phút + 点 (差五分八点 - 8 giờ kém 5).",
      "audioDemoText": "chà wǔ fēn bā diǎn, qī diǎn yí kè, wǒ měitiān zǎoshang qī diǎn qǐchuáng"
    },
    "step2_vocabulary": [
      {
        "id": "v-201-1",
        "hanzi": "起床",
        "pinyin": "qǐchuáng",
        "hanviet": "Khởi sàng",
        "meaning": "Thức dậy, rời giường",
        "radical": "走 (Tẩu)",
        "example": {
          "hanzi": "我早上六点起床。",
          "pinyin": "Wǒ zǎoshang liù diǎn qǐchuáng.",
          "meaning": "Tôi thức dậy lúc 6 giờ sáng."
        },
        "pos": "Động từ ly hợp"
      },
      {
        "id": "v-201-2",
        "hanzi": "睡觉",
        "pinyin": "shuìjiào",
        "hanviet": "Thụy giác",
        "meaning": "Đi ngủ",
        "radical": "目 (Mục)",
        "example": {
          "hanzi": "晚上十一点睡觉。",
          "pinyin": "Wǎnshang shíyī diǎn shuìjiào.",
          "meaning": "11 giờ đêm đi ngủ."
        },
        "pos": "Động từ ly hợp"
      },
      {
        "id": "v-201-3",
        "hanzi": "差",
        "pinyin": "chà",
        "hanviet": "Sai",
        "meaning": "Kém, thiếu",
        "radical": "工 (Công)",
        "example": {
          "hanzi": "差五分九点。",
          "pinyin": "Chà wǔ fēn jiǔ diǎn.",
          "meaning": "9 giờ kém 5 phút."
        },
        "pos": "Động từ / Tính từ"
      },
      {
        "id": "v-201-4",
        "hanzi": "刻",
        "pinyin": "kè",
        "hanviet": "Khắc",
        "meaning": "15 phút, khắc",
        "radical": "刂 (Đao)",
        "example": {
          "hanzi": "七点一刻。",
          "pinyin": "Qī diǎn yí kè.",
          "meaning": "7 giờ 15 phút."
        },
        "pos": "Lượng từ thời gian"
      },
      {
        "id": "v-201-5",
        "hanzi": "每天",
        "pinyin": "měitiān",
        "hanviet": "Mỗi thiên",
        "meaning": "Mỗi ngày, hàng ngày",
        "radical": "人 (Nhân)",
        "example": {
          "hanzi": "我每天跑步。",
          "pinyin": "Wǒ měitiān pǎobù.",
          "meaning": "Mỗi ngày tôi đều chạy bộ."
        },
        "pos": "Danh từ chỉ thời gian"
      },
      {
        "id": "v-201-6",
        "hanzi": "早饭",
        "pinyin": "zǎofàn",
        "hanviet": "Tảo phạn",
        "meaning": "Bữa sáng",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "吃了早饭。",
          "pinyin": "Chī le zǎofàn.",
          "meaning": "Ăn bữa sáng rồi."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "床",
        "hanzi": "床",
        "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸"
        },
        "ids": "⿸广木",
        "radical": {
          "char": "广",
          "name": "Quảng",
          "strokes": 3
        },
        "meaning": "Giường ngủ",
        "strokesCount": 7,
        "strokeOrderText": "Chấm -> Ngang -> Phẩy (广) -> Ngang -> Sổ -> Phẩy -> Mác (木)",
        "components": [
          "广",
          "木"
        ],
        "mnemonic": "Chiếc giường bằng gỗ (木) đặt ngay ngắn trong ngôi nhà (广).",
        "pinyin": "chuáng"
      },
      {
        "char": "睡",
        "hanzi": "睡",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰目垂",
        "radical": {
          "char": "目",
          "name": "Mục",
          "strokes": 5
        },
        "meaning": "Ngủ",
        "strokesCount": 13,
        "strokeOrderText": "Bộ Mục 目 bên trái (5 nét) -> Bộ Thùy 垂 bên phải (8 nét)",
        "components": [
          "目",
          "垂"
        ],
        "mnemonic": "Đôi mắt (目) trĩu mí rủ xuống (垂) chính là lúc chìm vào giấc ngủ ngon.",
        "pinyin": "shuì"
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc nói giờ kém trong tiếng Trung: 差 + Phút + 点",
      "formula": "差 + Số phút + 分 + Số giờ + 点",
      "explanation": "Từ 差 đặt ở đầu để chỉ số phút còn thiếu trước khi chạm tới giờ tròn.",
      "examples": [
        {
          "hanzi": "现在差十分八点。",
          "pinyin": "Xiànzài chà shí fēn bā diǎn.",
          "meaning": "Bây giờ là 8 giờ kém 10 phút."
        }
      ],
      "commonMistake": {
        "wrong": "八点差十分 ❌",
        "correct": "差十分八点 ✔️",
        "explanation": "Trong tiếng Trung, chữ 差 phải đứng trước số phút."
      }
    },
    "step5_listening": {
      "situation": "Thói quen sinh hoạt và giờ giấc thức dậy của bạn cùng phòng",
      "context": "Tại ký túc xá đại học lúc tối muộn trước ngày có tiết học sớm",
      "participants": "A: Minh (du học sinh Việt Nam), B: Đại Vệ (bạn cùng phòng)",
      "targetGoal": "Hỏi và diễn đạt chính xác giờ giấc kém (差), khắc (刻 - 15 phút) và thói quen sinh hoạt thường nhật",
      "usageNotes": "Trong tiếng Trung, 15 phút gọi là 一刻 (yí kè). 8 giờ kém 15 nói là 差一刻八点 (chà yí kè bā diǎn).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "大卫，你明天早上几点起床？",
          "pinyin": "Dàwèi, nǐ míngtiān zǎoshang jǐ diǎn qǐchuáng?",
          "meaning": "David, sáng mai bạn mấy giờ thức dậy?"
        },
        {
          "speaker": "B",
          "hanzi": "我明天有早课，差一刻八点就要去教室，所以七点一刻起床。",
          "pinyin": "Wǒ míngtiān yǒu zǎokè, chà yí kè bā diǎn jiù yào qù jiàoshì, suǒyǐ qī diǎn yí kè qǐchuáng.",
          "meaning": "Ngày mai tôi có tiết học sớm, 8 giờ kém 15 phải đến lớp rồi, nên 7 giờ 15 tôi dậy."
        },
        {
          "speaker": "A",
          "hanzi": "你每天晚上几点睡觉？睡得好吗？",
          "pinyin": "Nǐ měitiān wǎnshang jǐ diǎn shuìjiào? Shuì de hǎo ma?",
          "meaning": "Hàng ngày bạn mấy giờ đi ngủ? Ngủ có ngon không?"
        },
        {
          "speaker": "B",
          "hanzi": "我平时差十分十一点睡觉。今天晚上要复习生词，可能会晚一点儿。",
          "pinyin": "Wǒ píngshí chà shí fēn shíyī diǎn shuìjiào. Jīntiān wǎnshang yào fùxí shēngcí, kěnéng huì wǎn yìdiǎnr.",
          "meaning": "Bình thường tôi 11 giờ kém 10 ngủ. Tối nay phải ôn từ mới nên có thể sẽ muộn hơn một chút."
        }
      ],
      "audioText": "大卫，你明天早上几点起床？我明天有早课，差一刻八点就要去教室，所以七点一刻起床。你每天晚上几点睡觉？睡得好吗？我平时差十分十一点睡觉。今天晚上要复习生词，可能会晚一点儿。",
      "question": "Đại Vệ sáng mai dự định thức dậy vào thời điểm nào?",
      "options": [
        "7 giờ đúng",
        "7 giờ 15 phút (七点一刻)",
        "8 giờ kém 15",
        "11 giờ kém 10"
      ],
      "correctIndex": 1,
      "explanation": "Đại Vệ nói: \"所以七点一刻起床\" (Cho nên 7 giờ 15 dậy)."
    },
    "step6_speaking": {
      "prompt": "Nói giờ thức dậy của bạn:",
      "targetSentence": "我每天早上七点起床。",
      "targetPinyin": "Wǒ měitiān zǎoshang qī diǎn qǐchuáng.",
      "targetMeaning": "Hàng ngày tôi thức dậy lúc 7 giờ sáng.",
      "hint": "Đọc qǐchuáng rõ ràng thanh 3 và 2."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Bây giờ là 8 giờ kém 5",
      "words": [
        "八点",
        "现在",
        "差五分"
      ],
      "correctOrder": [
        "现在",
        "差五分",
        "八点"
      ],
      "explanation": "现在 + 差五分 + 八点."
    },
    "step8_quiz": [
      {
        "id": "q-201-1",
        "type": "multiple-choice",
        "question": "Cách nói chuẩn của '7 giờ 15 phút' là:",
        "options": [
          "七点一刻",
          "七刻一点",
          "一刻七点",
          "七点十五刻"
        ],
        "correctIndex": 0,
        "explanation": "15 phút là 一刻: 七点一刻."
      },
      {
        "id": "q-201-2",
        "type": "multiple-choice",
        "question": "Chữ '差' trong '差十分十点' mang ý nghĩa gì?",
        "options": [
          "Hơn",
          "Kém / Thiếu",
          "Đúng",
          "Rưỡi"
        ],
        "correctIndex": 1,
        "explanation": "Chà mang nghĩa là kém (10 giờ kém 10)."
      }
    ],
    "step9_challenge": {
      "title": "Lên lịch sinh hoạt vàng",
      "taskDesc": "Đọc to câu miêu tả giờ thức dậy và giờ đi ngủ của bạn bằng cụm giờ chính xác.",
      "targetPhrase": "wǒ qī diǎn qǐchuáng shíyī diǎn shuìjiào",
      "xpReward": 50,
      "badge": "Bậc Thầy Giờ Giấc"
    }
  },
  {
    "id": "l-202",
    "chapterId": "ch-5",
    "levelId": "lvl-2",
    "lessonNumber": 2,
    "title": "Phương tiện giao thông công cộng & Động từ di chuyển",
    "chineseTitle": "公共交通与出行（坐地铁、公共汽车、出租车）",
    "subtitle": "Nói về phương tiện di chuyển với 坐 (ngồi/đi xe), 骑 (cưỡi/đi xe đạp), 地铁 (tàu điện ngầm), 出租车 (taxi).",
    "objective": "Diễn đạt được bạn đi đâu bằng phương tiện gì và hỏi cách đi lại tại thành phố lớn.",
    "prerequisite": "Đã hoàn thành Bài 201.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cặp 坐 / 骑 với phương tiện.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Giao thông",
      "Phương tiện",
      "坐",
      "骑",
      "地铁"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Động từ phương tiện: 坐 (zuò - Đi/Ngồi xe ô tô, tàu điện) vs 骑 (qí - Đi xe đạp, xe máy)",
      "summary": "Phương tiện có buồng lái ngồi vào dùng 坐 (坐出租车, 坐地铁, 坐飞机). Phương tiện ngồi dạng cưỡi hai chân dùng 骑 (骑自行车, 骑摩托车).",
      "audioDemoText": "wǒ zuò dìtiě qù gōngsī, tā qí zìxíngchē qù xuéxiào"
    },
    "step2_vocabulary": [
      {
        "id": "v-202-1",
        "hanzi": "坐",
        "pinyin": "zuò",
        "hanviet": "Tọa",
        "meaning": "Ngồi, đi (phương tiện)",
        "radical": "土 (Thổ)",
        "example": {
          "hanzi": "坐出租车。",
          "pinyin": "Zuò chūzūchē.",
          "meaning": "Đi xe taxi."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-202-2",
        "hanzi": "地铁",
        "pinyin": "dìtiě",
        "hanviet": "Địa thiết",
        "meaning": "Tàu điện ngầm",
        "radical": "土 (Thổ)",
        "example": {
          "hanzi": "北京地铁很方便。",
          "pinyin": "Běijīng dìtiě hěn fāngbiàn.",
          "meaning": "Tàu điện ngầm Bắc Kinh rất tiện lợi."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-202-3",
        "hanzi": "公共汽车",
        "pinyin": "gōnggòng qìchē",
        "hanviet": "Công cộng khí xa",
        "meaning": "Xe buýt",
        "radical": "八 (Bát)",
        "example": {
          "hanzi": "坐公共汽车。",
          "pinyin": "Zuò gōnggòng qìchē.",
          "meaning": "Đi xe buýt."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-202-4",
        "hanzi": "出租车",
        "pinyin": "chūzūchē",
        "hanviet": "Xuất tô xa",
        "meaning": "Xe taxi",
        "radical": "出 (Xuất)",
        "example": {
          "hanzi": "打出租车。",
          "pinyin": "Dǎ chūzūchē.",
          "meaning": "Bắt taxi."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-202-5",
        "hanzi": "骑",
        "pinyin": "qí",
        "hanviet": "Kỵ",
        "meaning": "Cưỡi, đi (xe đạp, xe máy)",
        "radical": "马 (Mã)",
        "example": {
          "hanzi": "骑自行车。",
          "pinyin": "Qí zìxíngchē.",
          "meaning": "Đi xe đạp."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-202-6",
        "hanzi": "自行车",
        "pinyin": "zìxíngchē",
        "hanviet": "Tự hành xa",
        "meaning": "Xe đạp",
        "radical": "自 (Tự)",
        "example": {
          "hanzi": "买一辆自行车。",
          "pinyin": "Mǎi yí liàng zìxíngchē.",
          "meaning": "Mua một chiếc xe đạp."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "坐",
        "hanzi": "坐",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱从土",
        "radical": {
          "char": "土",
          "name": "Thổ",
          "strokes": 3
        },
        "meaning": "Ngồi, đi xe",
        "strokesCount": 7,
        "strokeOrderText": "Phẩy -> Chấm (人 trái) -> Phẩy -> Chấm (人 phải) -> Ngang -> Sổ -> Ngang (土)",
        "components": [
          "从",
          "土"
        ],
        "mnemonic": "Hai người (从) ngồi trò chuyện bên nhau trên mảnh đất (土).",
        "pinyin": "zuò"
      },
      {
        "char": "铁",
        "hanzi": "铁",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰钅失",
        "radical": {
          "char": "钅",
          "name": "Kim",
          "strokes": 5
        },
        "meaning": "Sắt thép",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Kim 钅 (5 nét) -> Chữ Thất 失 (5 nét)",
        "components": [
          "钅",
          "失"
        ],
        "mnemonic": "Thứ kim loại (钅) sau khi mất đi (失) lớp rỉ sét sẽ trở thành thép cứng.",
        "pinyin": "tiě"
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc đi đâu bằng phương tiện gì (Chủ ngữ + 坐/骑 + Phương tiện + 去 + Nơi chốn)",
      "formula": "Chủ ngữ + 坐 / 骑 + Phương tiện + 去 + Địa điểm",
      "explanation": "Phương thức di chuyển luôn đứng trước hành động đi tới đích đến.",
      "examples": [
        {
          "hanzi": "我每天坐地铁去上班。",
          "pinyin": "Wǒ měitiān zuò dìtiě qù shàngbān.",
          "meaning": "Mỗi ngày tôi đi tàu điện ngầm đi làm."
        }
      ],
      "commonMistake": {
        "wrong": "我去上班坐地铁 ❌",
        "correct": "我坐地铁去上班 ✔️",
        "explanation": "Cách thức di chuyển đứng trước mục đích."
      }
    },
    "step5_listening": {
      "situation": "Lựa chọn phương tiện giao thông đi làm trong giờ cao điểm",
      "context": "Tại trạm xe buýt Bắc Kinh vào buổi sáng",
      "participants": "A: Tiểu Mai, B: Trương Lực",
      "targetGoal": "Nắm vững các từ chỉ phương tiện giao thông (地铁, 公共汽车, 自行车) và động từ di chuyển (坐, 骑)",
      "usageNotes": "Động từ 坐 (zuò) dùng cho phương tiện ngồi lên như tàu điện ngầm, xe buýt, taxi; còn 骑 (qí) dùng cho xe 2 bánh như xe đạp, xe máy.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "张力，你每天怎么去公司上班？",
          "pinyin": "Zhāng Lì, nǐ měitiān zěnme qù gōngsī shàngbān?",
          "meaning": "Trương Lực, hàng ngày bạn đi làm bằng phương tiện gì?"
        },
        {
          "speaker": "B",
          "hanzi": "早上路上汽车很多，我通常坐地铁，半个小时就到了。",
          "pinyin": "Zǎoshang lùshang qìchē hěn duō, wǒ tōngcháng zuò dìtiě, bàn gè xiǎoshí jiù dào le.",
          "meaning": "Buổi sáng trên đường rất đông xe, tôi thường đi tàu điện ngầm, nửa tiếng là đến rồi."
        },
        {
          "speaker": "A",
          "hanzi": "坐公共汽车或者骑自行车方便吗？",
          "pinyin": "Zuò gōnggòng qìchē huòzhě qí zìxíngchē fāngbiàn ma?",
          "meaning": "Đi xe buýt hoặc đạp xe đạp có tiện không?"
        },
        {
          "speaker": "B",
          "hanzi": "坐公共汽车经常堵车。天气好的时候，我也喜欢骑自行车去。",
          "pinyin": "Zuò gōnggòng qìchē jīngcháng dǔchē. Tiānqì hǎo de shíhou, wǒ yě xǐhuan qí zìxíngchē qù.",
          "meaning": "Đi xe buýt hay bị tắc đường. Khi thời tiết đẹp, tôi cũng thích đạp xe đi."
        }
      ],
      "audioText": "张力，你每天怎么去公司上班？早上路上汽车很多，我通常坐地铁，半个小时就到了。坐公共汽车或者骑自行车方便吗？坐公共汽车经常堵车。天气好的时候，我也喜欢骑自行车去。",
      "question": "Vì sao Trương Lực thường chọn đi tàu điện ngầm vào buổi sáng?",
      "options": [
        "Vì vé tàu điện ngầm miễn phí",
        "Vì đi xe buýt hay tắc đường, đi tàu điện ngầm nửa tiếng là tới",
        "Vì anh ấy không biết đi xe đạp",
        "Vì công ty không có chỗ để xe"
      ],
      "correctIndex": 1,
      "explanation": "Trương Lực giải thích đường đông xe, đi xe buýt hay tắc đường còn đi tàu điện ngầm nhanh nửa tiếng là tới."
    },
    "step6_speaking": {
      "prompt": "Nói bạn đi tàu điện ngầm đi làm:",
      "targetSentence": "我坐地铁去上班。",
      "targetPinyin": "Wǒ zuò dìtiě qù shàngbān.",
      "targetMeaning": "Tôi đi tàu điện ngầm đi làm.",
      "hint": "Đọc dìtiě dứt khoát với thanh 4 và 3."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Anh ấy đi xe buýt đến trường",
      "words": [
        "去学校",
        "坐公共汽车",
        "他"
      ],
      "correctOrder": [
        "他",
        "坐公共汽车",
        "去学校"
      ],
      "explanation": "他 + 坐公共汽车 + 去学校."
    },
    "step8_quiz": [
      {
        "id": "q-202-1",
        "type": "multiple-choice",
        "question": "Động từ phù hợp đi cùng '自行车' (xe đạp) là:",
        "options": [
          "坐 (zuò)",
          "骑 (qí)",
          "开 (kāi)",
          "走 (zǒu)"
        ],
        "correctIndex": 1,
        "explanation": "Đi xe đạp dùng động từ 骑 (qí zìxíngchē)."
      },
      {
        "id": "q-202-2",
        "type": "multiple-choice",
        "question": "Từ nào sau đây mang nghĩa là 'Tàu điện ngầm'?",
        "options": [
          "出租车",
          "公共汽车",
          "地铁 (dìtiě)",
          "飞机"
        ],
        "correctIndex": 2,
        "explanation": "地铁 (Địa thiết) là tàu điện ngầm."
      }
    ],
    "step9_challenge": {
      "title": "Lập lộ trình đi lại",
      "taskDesc": "Nói to câu giới thiệu lộ trình đi học/đi làm hàng ngày của bạn và phương tiện sử dụng.",
      "targetPhrase": "wǒ zuò dìtiě qù shàngbān",
      "xpReward": 50,
      "badge": "Phượt Thủ Đô Thị"
    }
  },
  {
    "id": "l-203",
    "chapterId": "ch-5",
    "levelId": "lvl-2",
    "lessonNumber": 3,
    "title": "Diễn đạt khoảng cách không gian với giới từ 离 (lí)",
    "chineseTitle": "空间距离与介词“离”（离这里很远/很近）",
    "subtitle": "Nắm vững cấu trúc A 离 B 很远/很近 (A cách B rất xa/rất gần) và hỏi khoảng cách bao xa.",
    "objective": "Hỏi và miêu tả được khoảng cách giữa hai địa điểm bằng cấu trúc chữ 离.",
    "prerequisite": "Đã hoàn thành Bài 202.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng cấu trúc A 离 B.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Khoảng cách",
      "Giới từ 离",
      "远",
      "近"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Giới từ khoảng cách: A 离 B 很远 / 很近 (A lí B hěn yuǎn / hěn jìn)",
      "summary": "离 (lí - Ly) dùng để so sánh khoảng cách từ điểm A tới điểm B. Cấu trúc: Nơi chốn A + 离 + Nơi chốn B + (Khoảng cách / 很远 / 很近).",
      "audioDemoText": "wǒ jiā lí gōngsī hěn jìn, xuéxiào lí jīchǎng hěn yuǎn"
    },
    "step2_vocabulary": [
      {
        "id": "v-203-1",
        "hanzi": "离",
        "pinyin": "lí",
        "hanviet": "Ly",
        "meaning": "Cách, rời khỏi",
        "radical": "隹 (Chuy)",
        "example": {
          "hanzi": "学校离这里不远。",
          "pinyin": "Xuéxiào lí zhèlǐ bù yuǎn.",
          "meaning": "Trường học cách đây không xa."
        },
        "pos": "Giới từ"
      },
      {
        "id": "v-203-2",
        "hanzi": "远",
        "pinyin": "yuǎn",
        "hanviet": "Viễn",
        "meaning": "Xa",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "太远了。",
          "pinyin": "Tài yuǎn le.",
          "meaning": "Xa quá rồi."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-203-3",
        "hanzi": "近",
        "pinyin": "jìn",
        "hanviet": "Cận",
        "meaning": "Gần",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "我家离公司很近。",
          "pinyin": "Wǒ jiā lí gōngsī hěn jìn.",
          "meaning": "Nhà tôi cách công ty rất gần."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-203-4",
        "hanzi": "公里",
        "pinyin": "gōnglǐ",
        "hanviet": "Tùng",
        "meaning": "Ki-lô-mét (km)",
        "radical": "人 (Nhân)",
        "example": {
          "hanzi": "有五公里。",
          "pinyin": "Yǒu wǔ gōnglǐ.",
          "meaning": "Cách 5 km."
        },
        "pos": "Giới từ"
      },
      {
        "id": "v-203-5",
        "hanzi": "走路",
        "pinyin": "zǒulù",
        "hanviet": "Đáo",
        "meaning": "Đi bộ",
        "radical": "刂 (Đao)",
        "example": {
          "hanzi": "走路去十分钟。",
          "pinyin": "Zǒulù qù shí fēnzhōng.",
          "meaning": "Đi bộ mất 10 phút."
        },
        "pos": "Động từ / Giới từ"
      },
      {
        "id": "v-203-6",
        "hanzi": "分钟",
        "pinyin": "fēnzhōng",
        "hanviet": "Công lý",
        "meaning": "Phút (khoảng thời gian)",
        "radical": "木 (Mộc)",
        "example": {
          "hanzi": "二十分钟。",
          "pinyin": "Èrshí fēnzhōng.",
          "meaning": "20 phút."
        },
        "pos": "Lượng từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "远",
        "hanzi": "远",
        "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿺"
        },
        "ids": "⿺辶元",
        "radical": {
          "char": "辶",
          "name": "Sước",
          "strokes": 3
        },
        "meaning": "Xa xôi",
        "strokesCount": 7,
        "strokeOrderText": "Ngang -> Ngang -> Phẩy -> Cong móc (元) -> Chấm -> Ngang gập cong -> Mác dài (辶)",
        "components": [
          "辶",
          "元"
        ],
        "mnemonic": "Bước chân (辶) cất bước đi đến tận cội nguyên (元) xa xôi.",
        "pinyin": "yuǎn"
      },
      {
        "char": "近",
        "hanzi": "近",
        "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿺"
        },
        "ids": "⿺辶斤",
        "radical": {
          "char": "辶",
          "name": "Sước",
          "strokes": 3
        },
        "meaning": "Gần gũi",
        "strokesCount": 7,
        "strokeOrderText": "Phẩy -> Phẩy -> Ngang -> Sổ (斤) -> Chấm -> Ngang gập cong -> Mác dài (辶)",
        "components": [
          "辶",
          "斤"
        ],
        "mnemonic": "Bước chân (辶) chỉ cách một cái rìu (斤) là khoảng cách rất gần.",
        "pinyin": "jìn"
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc khoảng cách: A + 离 + B + Tính từ / Khoảng cách",
      "formula": "Địa điểm A + 离 + Địa điểm B + 很远 / 很近 / Có bao nhiêu km/phút",
      "explanation": "Câu hỏi khoảng cách thường dùng: A 离 B 远吗？ (A cách B xa không?) hoặc A 离 B 多远？ (A cách B bao xa?).",
      "examples": [
        {
          "hanzi": "我家离地铁站只有五百米。",
          "pinyin": "Wǒ jiā lí dìtiězhàn zhǐ yǒu wǔ bǎi mǐ.",
          "meaning": "Nhà tôi cách ga tàu điện ngầm chỉ có 500 mét."
        }
      ],
      "commonMistake": {
        "wrong": "我家从地铁站很近 ❌",
        "correct": "我家离地铁站很近 ✔️",
        "explanation": "Nói khoảng cách tĩnh dùng 离 (không dùng 从)."
      }
    },
    "step5_listening": {
      "situation": "Hỏi khoảng cách không gian từ khách sạn đến địa điểm tham quan",
      "context": "Quầy lễ tân khách sạn tại trung tâm Bắc Kinh",
      "participants": "A: Du khách Việt Nam, B: Nhân viên lễ tân khách sạn",
      "targetGoal": "Sử dụng cấu trúc 离...很远 / 离...很近 và 从...到... để diễn đạt khoảng cách và thời gian",
      "usageNotes": "Cấu trúc A 离 B + Khoảng cách/Tính từ (远/近). Tuyệt đối không thêm 在 trước 离.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "请问，我们酒店离故宫远不远？",
          "pinyin": "Qǐngwèn, wǒmen jiǔdiàn lí Gùgōng yuǎn bù yuǎn?",
          "meaning": "Xin hỏi, khách sạn của chúng ta cách Cố Cung (Tử Cấm Thành) xa không?"
        },
        {
          "speaker": "B",
          "hanzi": "不远，这里离故宫大概只有三公里。",
          "pinyin": "Bù yuǎn, zhèlǐ lí Gùgōng dàgài zhǐ yǒu sān gōnglǐ.",
          "meaning": "Không xa đâu, từ đây cách Cố Cung ước chừng chỉ có 3 cây số."
        },
        {
          "speaker": "A",
          "hanzi": "从这里坐地铁去，需要多长时间？",
          "pinyin": "Cóng zhèlǐ zuò dìtiě qù, xūyào duō cháng shíjiān?",
          "meaning": "Từ đây đi tàu điện ngầm thì mất bao lâu thời gian?"
        },
        {
          "speaker": "B",
          "hanzi": "坐地铁一号线只有两站路，大约十分钟就能到。",
          "pinyin": "Zuò dìtiě yī hào xiàn zhǐ yǒu liǎng zhàn lù, dàyuē shí fēnzhōng jiù néng dào.",
          "meaning": "Đi tàu điện ngầm tuyến số 1 chỉ có 2 ga, khoảng 10 phút là tới nơi rồi."
        }
      ],
      "audioText": "请问，我们酒店离故宫远不远？不远，这里离故宫大概只有三公里。从这里坐地铁去，需要多长时间？坐地铁一号线只有两站路，大约十分钟就能到。",
      "question": "Từ khách sạn đến Cố Cung cách bao xa và đi tàu điện ngầm mất bao lâu?",
      "options": [
        "Cách 30 km, mất 1 tiếng",
        "Cách khoảng 3 km, đi tàu điện ngầm khoảng 10 phút",
        "Cách 10 km, mất nửa tiếng",
        "Cách 500 mét, đi bộ 2 phút"
      ],
      "correctIndex": 1,
      "explanation": "Lễ tân trả lời: \"大概只有三公里... 大约十分钟就能到\"."
    },
    "step6_speaking": {
      "prompt": "Nói nhà bạn cách công ty rất gần:",
      "targetSentence": "我家离公司很近。",
      "targetPinyin": "Wǒ jiā lí gōngsī hěn jìn.",
      "targetMeaning": "Nhà tôi cách công ty rất gần.",
      "hint": "Đọc rõ ràng lí và jìn thanh 4."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Trường học cách đây không xa",
      "words": [
        "不远",
        "离这里",
        "学校"
      ],
      "correctOrder": [
        "学校",
        "离这里",
        "不远"
      ],
      "explanation": "学校 + 离这里 + 不远."
    },
    "step8_quiz": [
      {
        "id": "q-203-1",
        "type": "multiple-choice",
        "question": "Điền từ thích hợp vào chỗ trống: 我家 ___ 学校很近。",
        "options": [
          "在",
          "从",
          "离 (lí)",
          "往"
        ],
        "correctIndex": 2,
        "explanation": "Biểu thị khoảng cách cách bao xa dùng 离."
      },
      {
        "id": "q-203-2",
        "type": "multiple-choice",
        "question": "Từ phản nghĩa của '远' (yuǎn - Xa) là:",
        "options": [
          "大 (dà)",
          "近 (jìn - Gần)",
          "高 (gāo)",
          "冷 (lěng)"
        ],
        "correctIndex": 1,
        "explanation": "Gần là 近 (jìn)."
      }
    ],
    "step9_challenge": {
      "title": "Đo đạc khoảng cách",
      "taskDesc": "Nói to câu giới thiệu khoảng cách từ nhà bạn đến trường/chỗ làm bao nhiêu km hoặc đi mất bao lâu.",
      "targetPhrase": "wǒ jiā lí gōngsī bù yuǎn",
      "xpReward": 50,
      "badge": "Chuyên Gia Đo Đạc"
    }
  },
  {
    "id": "l-204",
    "chapterId": "ch-5",
    "levelId": "lvl-2",
    "lessonNumber": 4,
    "title": "Hỏi đường & Chỉ hướng với giới từ 往 (wǎng)",
    "chineseTitle": "问路与指路介词“往”（往左拐、往前走）",
    "subtitle": "Nắm vững kỹ năng hỏi đường (怎么走), rẽ trái (往左拐), rẽ phải (往右拐), đi thẳng (往前走).",
    "objective": "Hỏi đường người đi đường và hiểu trọn vẹn chỉ dẫn hướng đi để không bị lạc ở Trung Quốc.",
    "prerequisite": "Đã hoàn thành Bài 203.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cấu trúc 往 + Hướng + Động từ.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Hỏi đường",
      "Giới từ 往",
      "Phương hướng",
      "Rẽ trái",
      "Đi thẳng"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Chỉ hướng với giới từ 往 (wǎng - Hướng về phía): 往 + Hướng + Động từ di chuyển",
      "summary": "往 (wǎng) biểu thị phương hướng vận động: 往前走 (Đi về phía trước), 往左拐 (Rẽ sang trái), 往右拐 (Rẽ sang phải).",
      "audioDemoText": "qǐngwèn dìtiězhàn zěnme zǒu, wǎng qián zǒu, dào lùkǒu wǎng zuǒ guǎi"
    },
    "step2_vocabulary": [
      {
        "id": "v-204-1",
        "hanzi": "往",
        "pinyin": "wǎng",
        "hanviet": "Vãng",
        "meaning": "Về hướng, hướng tới",
        "radical": "彳 (Xích)",
        "example": {
          "hanzi": "往前走。",
          "pinyin": "Wǎng qián zǒu.",
          "meaning": "Đi thẳng về phía trước."
        },
        "pos": "Giới từ"
      },
      {
        "id": "v-204-2",
        "hanzi": "左",
        "pinyin": "zuǒ",
        "hanviet": "Quải",
        "meaning": "Bên trái",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "往左拐。",
          "pinyin": "Wǎng zuǒ guǎi.",
          "meaning": "Rẽ sang bên trái."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-204-3",
        "hanzi": "右",
        "pinyin": "yòu",
        "hanviet": "Hữu",
        "meaning": "Bên phải",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "往右拐。",
          "pinyin": "Wǎng yòu guǎi.",
          "meaning": "Rẽ sang bên phải."
        },
        "pos": "Danh từ phương vị"
      },
      {
        "id": "v-204-4",
        "hanzi": "拐",
        "pinyin": "guǎi",
        "hanviet": "Tả",
        "meaning": "Rẽ, quẹo",
        "radical": "工 (Công)",
        "example": {
          "hanzi": "在路口拐弯。",
          "pinyin": "Zài lùkǒu guǎi wān.",
          "meaning": "Rẽ tại ngã rẽ."
        },
        "pos": "Danh từ phương vị"
      },
      {
        "id": "v-204-5",
        "hanzi": "路口",
        "pinyin": "lùkǒu",
        "hanviet": "Tiền",
        "meaning": "Ngã tư, ngã rẽ đường",
        "radical": "刂 (Đao)",
        "example": {
          "hanzi": "前面的十字路口。",
          "pinyin": "Qiánmiàn de shízì lùkǒu.",
          "meaning": "Ngã tư đường phía trước."
        },
        "pos": "Danh từ phương vị"
      },
      {
        "id": "v-204-6",
        "hanzi": "红绿灯",
        "pinyin": "hónglǜdēng",
        "hanviet": "Hồng lục đăng",
        "meaning": "Đèn giao thông (xanh đỏ)",
        "radical": "糸 (Mịch)",
        "example": {
          "hanzi": "看红绿灯。",
          "pinyin": "Kàn hónglǜdēng.",
          "meaning": "Nhìn đèn tín hiệu giao thông."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "左",
        "hanzi": "左",
        "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸"
        },
        "ids": "⿸𠂇工",
        "radical": {
          "char": "工",
          "name": "Công",
          "strokes": 3
        },
        "meaning": "Bên trái",
        "strokesCount": 5,
        "strokeOrderText": "Ngang -> Phẩy (𠂇) -> Ngang -> Sổ -> Ngang (工)",
        "components": [
          "𠂇",
          "工"
        ],
        "mnemonic": "Bàn tay trái (𠂇) cầm thước hỗ trợ người thợ làm việc thủ công (工).",
        "pinyin": "zuǒ"
      },
      {
        "char": "右",
        "hanzi": "右",
        "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸"
        },
        "ids": "⿸𠂇口",
        "radical": {
          "char": "口",
          "name": "Khẩu",
          "strokes": 3
        },
        "meaning": "Bên phải",
        "strokesCount": 5,
        "strokeOrderText": "Ngang -> Phẩy (𠂇) -> Sổ -> Ngang gập -> Ngang (口)",
        "components": [
          "𠂇",
          "口"
        ],
        "mnemonic": "Bàn tay phải (𠂇) linh hoạt đưa thức ăn vào miệng (口).",
        "pinyin": "yòu"
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc chỉ hướng kinh điển: 往 + Phương hướng + Động từ (拐 / 走)",
      "formula": "往 + 前 / 左 / 右 + 走 (Đi) / 拐 (Rẽ)",
      "explanation": "Khác với tiếng Việt (Rẽ trái -> Tiếng Trung: Hướng về bên trái mà rẽ = 往左拐).",
      "examples": [
        {
          "hanzi": "到前面的红绿灯，往右拐就到了。",
          "pinyin": "Dào qiánmiàn de hónglǜdēng, wǎng yòu guǎi jiù dào le.",
          "meaning": "Đến chỗ đèn giao thông phía trước, rẽ phải là tới rồi."
        }
      ],
      "commonMistake": {
        "wrong": "拐左 ❌",
        "correct": "往左拐 ✔️",
        "explanation": "Phải có giới từ 往 chỉ hướng."
      }
    },
    "step5_listening": {
      "situation": "Hỏi đường và chỉ dẫn phương hướng ở ngã tư đường phố",
      "context": "Tại góc phố đông người qua lại gần quảng trường",
      "participants": "A: Người hỏi đường, B: Cảnh sát giao thông / Người dân địa phương",
      "targetGoal": "Nắm vững cách chỉ hướng với 往 (wǎng): 往前走 (đi thẳng), 往右拐 (rẽ phải), 往左拐 (rẽ trái)",
      "usageNotes": "往 + Phương hướng + Động từ (拐, 走). Hồng lục đăng (红绿灯) là đèn tín hiệu giao thông.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "您好，请问去市图书馆怎么走？",
          "pinyin": "Nǐn hǎo, qǐngwèn qù shì túshūguǎn zěnme zǒu?",
          "meaning": "Chào bác, xin hỏi đi tới thư viện thành phố đi như thế nào ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "你从这儿一直往前走，到了前边的红绿灯往右拐。",
          "pinyin": "Nǐ cóng zhèr yìzhí wǎng qián zǒu, dào le qiánbiān de hónglǜdēng wǎng yòu guǎi.",
          "meaning": "Cháu từ chỗ này cứ đi thẳng về phía trước, đến cột đèn giao thông phía trước thì rẽ phải."
        },
        {
          "speaker": "A",
          "hanzi": "往右拐以后还要走多远？",
          "pinyin": "Wǎng yòu guǎi yǐhòu hái yào zǒu duō yuǎn?",
          "meaning": "Sau khi rẽ phải thì còn phải đi bao xa nữa ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "再往前走一百米，图书馆就在你的左边。",
          "pinyin": "Zài wǎng qián zǒu yìbǎi mǐ, túshūguǎn jiù zài nǐ de zuǒbiān.",
          "meaning": "Đi tiếp về phía trước 100 mét nữa, thư viện nằm ngay bên tay trái của cháu."
        }
      ],
      "audioText": "您好，请问去市图书馆怎么走？你从这儿一直往前走，到了前边的红绿灯往右拐。往右拐以后还要走多远？再往前走一百米，图书馆就在你的左边。",
      "question": "Người đi đường cần rẽ hướng nào khi đến cột đèn giao thông?",
      "options": [
        "Rẽ trái ngay",
        "Rẽ phải (往右拐)",
        "Quay đầu lại",
        "Đi sang đường"
      ],
      "correctIndex": 1,
      "explanation": "Chỉ dẫn là: \"到了前边的红绿灯往右拐\" (Đến đèn giao thông phía trước thì rẽ phải)."
    },
    "step6_speaking": {
      "prompt": "Đọc câu chỉ đường: Đi thẳng rồi rẽ phải:",
      "targetSentence": "往前走，往右拐。",
      "targetPinyin": "Wǎng qián zǒu, wǎng yòu guǎi.",
      "targetMeaning": "Đi thẳng về phía trước, rẽ sang bên phải.",
      "hint": "Đọc dứt khoát wǎng qián zǒu."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Rẽ trái ở ngã tư đường",
      "words": [
        "在路口",
        "往左拐"
      ],
      "correctOrder": [
        "在路口",
        "往左拐"
      ],
      "explanation": "在路口 + 往左拐."
    },
    "step8_quiz": [
      {
        "id": "q-204-1",
        "type": "multiple-choice",
        "question": "Cách nói 'Rẽ phải' chuẩn xác trong tiếng Trung là:",
        "options": [
          "拐右",
          "往右拐 (wǎng yòu guǎi)",
          "右走",
          "拐在右"
        ],
        "correctIndex": 1,
        "explanation": "Cấu trúc chỉ hướng: 往右拐."
      },
      {
        "id": "q-204-2",
        "type": "multiple-choice",
        "question": "Cụm '红绿灯' (hónglǜdēng) mang nghĩa là gì?",
        "options": [
          "Đèn lồng đỏ",
          "Đèn giao thông (đèn xanh đèn đỏ)",
          "Biển báo tốc độ",
          "Đường cao tốc"
        ],
        "correctIndex": 1,
        "explanation": "Hồng lục đăng là đèn tín hiệu giao thông."
      }
    ],
    "step9_challenge": {
      "title": "Bậc thầy dẫn đường",
      "taskDesc": "Đọc to câu hướng dẫn bạn bè đi thẳng 200m rồi rẽ trái đến trạm xe buýt.",
      "targetPhrase": "wǎng qián zǒu wǎng zuǒ guǎi dào dìtiězhàn",
      "xpReward": 50,
      "badge": "Bản Đồ Di Động"
    }
  },
  {
    "id": "l-205",
    "chapterId": "ch-5",
    "levelId": "lvl-2",
    "lessonNumber": 5,
    "title": "Ôn tập Module 2.1 & Thử thách bắt taxi, chỉ đường thực tế",
    "chineseTitle": "模块2.1总复习与打车实战挑战",
    "subtitle": "Tổng kết đàm thoại gọi taxi, nói địa điểm, giao tiếp với tài xế và sẵn sàng đấu Boss Chapter 5.",
    "objective": "Tự tin đối thoại với tài xế taxi, chỉ đường trực tiếp và hỏi giá tiền chuyến đi trôi chảy.",
    "prerequisite": "Đã hoàn thành Bài 201–204.",
    "completionCriteria": "Đạt >= 80% điểm bài tập tổng kết Module 2.1.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 2",
      "Tổng kết Module",
      "Bắt taxi",
      "Thực chiến chỉ đường"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Hội thoại gọi taxi thực chiến tại Bắc Kinh",
      "summary": "1. Chào hỏi & Nêu điểm đến: 师傅，我去... (Thưa bác tài, cháu đi...). 2. Hỏi thời gian: 大概需要多长时间？ (Khoảng bao lâu tới?). 3. Chỉ đường gần đích: 前面路口靠边停 (Phía trước ngã rẽ tấp lề đỗ lại).",
      "audioDemoText": "shīfu wǒ qù běijīng dàxué, duō cháng shíjiān néng dào"
    },
    "step2_vocabulary": [
      {
        "id": "v-205-1",
        "hanzi": "师傅",
        "pinyin": "shīfu",
        "hanviet": "Đình xa",
        "meaning": "Bác tài, chú (xưng hô tài xế, thợ)",
        "radical": "亻 (Nhân đứng)",
        "example": {
          "hanzi": "师傅，请问去机场多少钱？",
          "pinyin": "Shīfu, qǐngwèn qù jīchǎng duōshao qián?",
          "meaning": "Bác tài ơi, đi sân bay bao nhiêu tiền ạ?"
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-205-2",
        "hanzi": "大概",
        "pinyin": "dàgài",
        "hanviet": "Sư phó",
        "meaning": "Khoảng chừng, đại khái",
        "radical": "巾 (Cân)",
        "example": {
          "hanzi": "大概半个小时。",
          "pinyin": "Dàgài bàn gè xiǎoshí.",
          "meaning": "Khoảng nửa tiếng đồng hồ."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-205-3",
        "hanzi": "停车",
        "pinyin": "tíngchē",
        "hanviet": "Đa thiếu tiền",
        "meaning": "Dừng xe, đỗ xe",
        "radical": "夕 (Tịch)",
        "example": {
          "hanzi": "在这里停车。",
          "pinyin": "Zài zhèlǐ tíngchē.",
          "meaning": "Đỗ xe ở đây."
        },
        "pos": "Cụm nghi vấn"
      }
    ],
    "step3_hanzi": [
      {
        "char": "停",
        "hanzi": "停",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰亻亭",
        "radical": {
          "char": "亻",
          "name": "Nhân đứng",
          "strokes": 2
        },
        "meaning": "Dừng lại, đỗ xe",
        "strokesCount": 11,
        "strokeOrderText": "Phẩy -> Sổ (亻) -> Chấm -> Ngang -> Khẩu -> Đinh (亭)",
        "components": [
          "亻",
          "亭"
        ],
        "mnemonic": "Người (亻) dừng chân nghỉ ngơi ở ngôi đình (亭) ven đường.",
        "pinyin": "tíng"
      },
      {
        "char": "车",
        "hanzi": "车",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "车",
        "radical": {
          "char": "车",
          "name": "Xa",
          "strokes": 4
        },
        "meaning": "Xe cộ",
        "strokesCount": 4,
        "strokeOrderText": "Ngang -> Phẩy gập -> Ngang -> Sổ dài chính giữa xuyên suốt",
        "components": [
          "车"
        ],
        "mnemonic": "Hình vẽ chiếc xe ngựa cổ nhìn từ trên cao xuống.",
        "pinyin": "chē"
      }
    ],
    "step4_grammar": {
      "title": "Cụm câu khẩu ngữ kinh điển khi đi taxi",
      "formula": "师傅，我去 + Nơi chốn。 前面 + 往左拐 / 靠边停。",
      "explanation": "Từ 师傅 là cách gọi tôn trọng và thân thiện nhất với các bác tài xế taxi tại Trung Quốc.",
      "examples": [
        {
          "hanzi": "师傅，前面路口右拐，谢谢！",
          "pinyin": "Shīfu, qiánmiàn lùkǒu yòuguǎi, xièxie!",
          "meaning": "Bác tài ơi, ngã rẽ phía trước rẽ phải ạ, cảm ơn bác!"
        }
      ],
      "commonMistake": {
        "wrong": "Gọi tài xế là 司机 (nghe xa cách và lạnh nhạt)",
        "correct": "Gọi là 师傅 (thân mật, bản xứ)",
        "explanation": "Văn hóa giao tiếp xã hội Trung Quốc."
      }
    },
    "step5_listening": {
      "situation": "Bắt xe taxi, giao tiếp lộ trình và yêu cầu dừng đỗ xe an toàn",
      "context": "Trên một chiếc taxi đang lưu thông tới sân bay",
      "participants": "A: Hành khách, B: Bác tài xế taxi (师傅)",
      "targetGoal": "Thực hành các mẫu câu gọi tài xế (师傅), hỏi thời gian và yêu cầu dừng xe (请在这里停车)",
      "usageNotes": "Ở Trung Quốc, xưng hô tài xế taxi là 师傅 (shīfu - bác tài) rất lịch sự và thông dụng.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "师傅，我去首都机场二号航站楼，大概需要多长时间？",
          "pinyin": "Shīfu, wǒ qù Shǒudū Jīchǎng èr hào hángzhànlóu, dàgài xūyào duō cháng shíjiān?",
          "meaning": "Bác tài ơi, tôi đi nhà ga T2 sân bay Thủ Đô, mất khoảng bao lâu thời gian?"
        },
        {
          "speaker": "B",
          "hanzi": "现在不堵车，大概四十分钟能到。",
          "pinyin": "Xiànzài bù dǔchē, dàgài sìshí fēnzhōng néng dào.",
          "meaning": "Bây giờ không tắc đường, khoảng 40 phút là tới nơi."
        },
        {
          "speaker": "A",
          "hanzi": "太好了。师傅，请在前边那个路口停车，我朋友在那里等我。",
          "pinyin": "Tài hǎo le. Shīfu, qǐng zài qiánbiān nàge lùkǒu tíngchē, wǒ péngyou zài nàlǐ děng wǒ.",
          "meaning": "Tốt quá. Bác tài ơi, xin hãy dừng xe ở ngã rẽ phía trước, bạn tôi đang đợi ở đó."
        },
        {
          "speaker": "B",
          "hanzi": "好的，没问题。请系好安全带，马上就到了。",
          "pinyin": "Hǎo de, méi wèntí. Qǐng jì hǎo ānquándài, mǎshàng jiù dào le.",
          "meaning": "Được rồi, không vấn đề gì. Xin thắt dây an toàn, sắp tới nơi rồi."
        }
      ],
      "audioText": "师傅，我去首都机场二号航站楼，大概需要多长时间？现在不堵车，大概四十分钟能到。太好了。师傅，请在前边那个路口停车，我朋友在那里等我。好的，没问题。请系好安全带，马上就到了。",
      "question": "Hành khách yêu cầu tài xế taxi dừng xe ở đâu?",
      "options": [
        "Dừng ngay giữa đường",
        "Dừng ở ngã rẽ phía trước để đón bạn (在前边那个路口停车)",
        "Dừng ở trạm xăng",
        "Dừng ở cổng sân bay"
      ],
      "correctIndex": 1,
      "explanation": "Hành khách nói: \"师傅，请在前边那个路口停车，我朋友在那里等我\"."
    },
    "step6_speaking": {
      "prompt": "Nói với tài xế taxi dừng xe tại đây:",
      "targetSentence": "师傅，请在这里停车。",
      "targetPinyin": "Shīfu, qǐng zài zhèlǐ tíngchē.",
      "targetMeaning": "Bác tài ơi, xin dừng xe ở đây ạ.",
      "hint": "Đọc lịch sự và to rõ ràng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Bác tài ơi, tôi đi sân bay",
      "words": [
        "我去机场",
        "师傅"
      ],
      "correctOrder": [
        "师傅",
        "我去机场"
      ],
      "explanation": "师傅 + 我去机场."
    },
    "step8_quiz": [
      {
        "id": "q-205-1",
        "type": "multiple-choice",
        "question": "Cách xưng hô tự nhiên và lịch sự nhất với bác tài xế taxi là:",
        "options": [
          "老师 (Lǎoshī)",
          "师傅 (Shīfu)",
          "服务员 (Fúwùyuán)",
          "老板 (Lǎobǎn)"
        ],
        "correctIndex": 1,
        "explanation": "Xưng hô với tài xế là 师傅 (Shīfu)."
      },
      {
        "id": "q-205-2",
        "type": "multiple-choice",
        "question": "Cụm '大概' (dàgài) mang ý nghĩa gì?",
        "options": [
          "Chắc chắn 100%",
          "Đại khái / Khoảng chừng",
          "Không bao giờ",
          "Chậm trễ"
        ],
        "correctIndex": 1,
        "explanation": "Đại khái nghĩa là khoảng chừng, ước lượng."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa Boss Chapter 5",
      "taskDesc": "Vượt qua thử thách đàm thoại di chuyển để mở khóa Boss giao thông đô thị!",
      "targetPhrase": "shīfu wǒ qù jīchǎng qǐng zài zhèlǐ tíngchē",
      "xpReward": 60,
      "badge": "Tài Xế Vàng Phố Thị"
    }
  },
  {
    "id": "l-206",
    "chapterId": "ch-6",
    "levelId": "lvl-2",
    "lessonNumber": 6,
    "title": "Đi nhà hàng & Gọi món quen thuộc (点菜与菜单)",
    "chineseTitle": "餐厅点菜与特色美食（服务员，点菜）",
    "subtitle": "Kêu phục vụ (服务员), xem thực đơn (菜单), gọi món (点菜) và các món ăn Trung Hoa trứ danh.",
    "objective": "Tự tin gọi món tại quán ăn Trung Quốc và hỏi nhân viên về các món đặc sản.",
    "prerequisite": "Đã hoàn thành Module 2.1.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đóng vai gọi 2 món ăn kèm đồ uống.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Nhà hàng",
      "Gọi món",
      "服务员",
      "点菜"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Đàm thoại gọi món: 服务员，我们要点菜 (Fúwùyuán, wǒmen yào diǎncài)",
      "summary": "服务员 (fúwùyuán) là nhân viên phục vụ. 菜单 (càidān) là thực đơn. 点菜 (diǎncài) là gọi món. 好吃 (hǎochī) là ngon miệng.",
      "audioDemoText": "fúwùyuán qǐng gěi wǒ càidān, wǒmen yào diǎncài"
    },
    "step2_vocabulary": [
      {
        "id": "v-206-1",
        "hanzi": "服务员",
        "pinyin": "fúwùyuán",
        "hanviet": "Điểm thái",
        "meaning": "Nhân viên phục vụ",
        "radical": "灬 (Hỏa)",
        "example": {
          "hanzi": "服务员，买单！",
          "pinyin": "Fúwùyuán, mǎidān!",
          "meaning": "Phục vụ ơi, tính tiền!"
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-206-2",
        "hanzi": "菜单",
        "pinyin": "càidān",
        "hanviet": "Thái đơn",
        "meaning": "Thực đơn",
        "radical": "艹 (Thảo)",
        "example": {
          "hanzi": "请看菜单。",
          "pinyin": "Qǐng kàn càidān.",
          "meaning": "Mời xem thực đơn."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-206-3",
        "hanzi": "点菜",
        "pinyin": "diǎncài",
        "hanviet": "Phục vụ viên",
        "meaning": "Gọi món, gọi thức ăn",
        "radical": "月 (Nguyệt)",
        "example": {
          "hanzi": "可以点菜了吗？",
          "pinyin": "Kěyǐ diǎncài le ma?",
          "meaning": "Đã có thể gọi món chưa ạ?"
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-206-4",
        "hanzi": "饺子",
        "pinyin": "jiǎozi",
        "hanviet": "Mễ phạn",
        "meaning": "Sủi cảo, bánh chẻo",
        "radical": "米 (Mễ)",
        "example": {
          "hanzi": "中国饺子很好吃。",
          "pinyin": "Zhōngguó jiǎozi hěn hǎochī.",
          "meaning": "Sủi cảo Trung Quốc rất ngon."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-206-5",
        "hanzi": "好吃",
        "pinyin": "hǎochī",
        "hanviet": "Diện điều",
        "meaning": "Ngon miệng",
        "radical": "麦 (Mạch)",
        "example": {
          "hanzi": "这个菜真好吃！",
          "pinyin": "Zhège cài zhēn hǎochī!",
          "meaning": "Món này ngon thật!"
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-206-6",
        "hanzi": "烤鸭",
        "pinyin": "kǎoyā",
        "hanviet": "Thủy giảo",
        "meaning": "Vịt quay",
        "radical": "水 (Thủy)",
        "example": {
          "hanzi": "北京烤鸭。",
          "pinyin": "Běijīng kǎoyā.",
          "meaning": "Vịt quay Bắc Kinh."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "服",
        "hanzi": "服",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰月⺋",
        "radical": {
          "char": "月",
          "name": "Nguyệt",
          "strokes": 4
        },
        "meaning": "Phục vụ, quần áo",
        "strokesCount": 8,
        "strokeOrderText": "Phẩy -> Ngang gập móc -> Ngang -> Ngang (月) -> Ngang gập -> Ngang -> Sổ cong móc (⺋)",
        "components": [
          "月",
          "⺋"
        ],
        "mnemonic": "Y phục mặc sát da thịt (月) và tuân thủ nề nếp phép tắc (⺋).",
        "pinyin": "fú"
      },
      {
        "char": "单",
        "hanzi": "单",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱丷甲",
        "radical": {
          "char": "十",
          "name": "Thập",
          "strokes": 2
        },
        "meaning": "Đơn tờ, danh sách",
        "strokesCount": 8,
        "strokeOrderText": "Chấm -> Phẩy (丷) -> Khẩu -> Sổ dài xuyên qua chữ Khẩu và hai nét ngang",
        "components": [
          "丷",
          "甲"
        ],
        "mnemonic": "Tờ giấy đơn giản (单) ghi danh sách món ăn hoặc công việc.",
        "pinyin": "dān"
      }
    ],
    "step4_grammar": {
      "title": "Mẫu câu gọi món lịch sự: 请给我们... / 我们要...",
      "formula": "服务员，请给我们一份 + Tên món ăn",
      "explanation": "Lượng từ cho một phần đồ ăn là 份 (fèn - suất, phần) hoặc 盘 (pán - đĩa).",
      "examples": [
        {
          "hanzi": "服务员，我们要一份北京烤鸭和两碗米饭。",
          "pinyin": "Fúwùyuán, wǒmen yào yí fèn Běijīng kǎoyā hé liǎng wǎn mǐfàn.",
          "meaning": "Phục vụ ơi, cho chúng tôi một phần vịt quay Bắc Kinh và hai bát cơm."
        }
      ],
      "commonMistake": {
        "wrong": "我要一米饭 ❌",
        "correct": "我们要一碗米饭 ✔️",
        "explanation": "Phải có lượng từ bát (碗 - wǎn) cho cơm."
      }
    },
    "step5_listening": {
      "situation": "Xem thực đơn và gọi món ăn tại nhà hàng ẩm thực Trung Hoa",
      "context": "Tại bàn ăn một nhà hàng truyền thống vào giờ cơm trưa",
      "participants": "A: Thực khách, B: Nhân viên phục vụ (服务员)",
      "targetGoal": "Thực hành gọi món (点菜), xin thực đơn (菜单) và gọi đồ uống (热茶)",
      "usageNotes": "Cấu trúc gọi món thông dụng: 给我来一份 / 一碗 + Tên món.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "服务员，请给我们一份菜单，我们要点菜。",
          "pinyin": "Fúwùyuán, qǐng gěi wǒmen yí fèn càidān, wǒmen yào diǎncài.",
          "meaning": "Phục vụ viên ơi, cho chúng tôi xin một cuốn thực đơn, chúng tôi muốn gọi món."
        },
        {
          "speaker": "B",
          "hanzi": "好的，这是菜单。请问两位想吃点儿什么？",
          "pinyin": "Hǎo de, zhè shì càidān. Qǐngwèn liǎng wèi xiǎng chī diǎnr shénme?",
          "meaning": "Dạ được, đây là thực đơn. Xin hỏi hai vị muốn dùng món gì ạ?"
        },
        {
          "speaker": "A",
          "hanzi": "给我来一份宫保鸡丁，一碗牛肉面条，还有十个水饺。",
          "pinyin": "Gěi wǒ lái yí fèn gōngbǎo jīdīng, yì wǎn niúròu miàntiáo, hái yǒu shí gè shuǐjiǎo.",
          "meaning": "Cho tôi một đĩa gà Kung Pao, một bát mì thịt bò, và 10 chiếc sủi cảo."
        },
        {
          "speaker": "B",
          "hanzi": "好的，请问两位喝点儿什么饮料吗？",
          "pinyin": "Hǎo de, qǐngwèn liǎng wèi hē diǎnr shénme yǐnliào ma?",
          "meaning": "Dạ được, xin hỏi hai vị có uống đồ uống gì không ạ?"
        },
        {
          "speaker": "A",
          "hanzi": "请给我们两杯热茶，谢谢！",
          "pinyin": "Qǐng gěi wǒmen liǎng bēi rèchá, xièxie!",
          "meaning": "Xin cho chúng tôi hai tách trà nóng, cảm ơn!"
        }
      ],
      "audioText": "服务员，请给我们一份菜单，我们要点菜。好的，这是菜单。请问两位想吃点儿什么？给我来一份宫保鸡丁，一碗牛肉面条，还有十个水饺。好的，请问两位喝点儿什么饮料吗？请给我们两杯热茶，谢谢！",
      "question": "Khách hàng đã gọi những món ăn và đồ uống nào?",
      "options": [
        "Cơm rang dưa bò và nước ngọt",
        "Gà Kung Pao, mì bò, 10 sủi cảo và 2 tách trà nóng",
        "Vịt quay và rượu trắng",
        "Bánh bao hấp và cà phê"
      ],
      "correctIndex": 1,
      "explanation": "Khách gọi: 宫保鸡丁, 一碗牛肉面条, 十个水饺 và 两杯热茶."
    },
    "step6_speaking": {
      "prompt": "Nói gọi món với nhân viên phục vụ:",
      "targetSentence": "服务员，我们要点菜。",
      "targetPinyin": "Fúwùyuán, wǒmen yào diǎncài.",
      "targetMeaning": "Phục vụ ơi, chúng tôi muốn gọi món.",
      "hint": "Đọc fúwùyuán rõ ràng và lịch sự."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Cho chúng tôi một đĩa sủi cảo",
      "words": [
        "一盘饺子",
        "给我们",
        "来"
      ],
      "correctOrder": [
        "给我们",
        "来",
        "一盘饺子"
      ],
      "explanation": "给我们 + 来 + 一盘饺子."
    },
    "step8_quiz": [
      {
        "id": "q-206-1",
        "type": "multiple-choice",
        "question": "Khi muốn gọi tính tiền tại quán ăn, người Trung Quốc thường nói:",
        "options": [
          "买单 (mǎidān)",
          "点菜 (diǎncài)",
          "看菜单 (kàn càidān)",
          "吃饭 (chīfàn)"
        ],
        "correctIndex": 0,
        "explanation": "Thanh toán tính tiền gọi là 买单 (mǎidān)."
      },
      {
        "id": "q-206-2",
        "type": "multiple-choice",
        "question": "Từ '饺子' (jiǎozi) là món ăn nổi tiếng nào của Trung Hoa?",
        "options": [
          "Bánh bao",
          "Sủi cảo / Bánh chẻo",
          "Mì xào",
          "Đậu phụ thối"
        ],
        "correctIndex": 1,
        "explanation": "Sủi cảo là món ăn truyền thống đặc sắc của Trung Quốc."
      }
    ],
    "step9_challenge": {
      "title": "Gọi món chuyên nghiệp",
      "taskDesc": "Đóng vai gọi trọn vẹn 1 món mặn, 1 món canh và 1 món nước tại bàn ăn.",
      "targetPhrase": "fúwùyuán wǒmen yào diǎncài gěi wǒ càidān",
      "xpReward": 50,
      "badge": "Thực Khách Sành Điệu"
    }
  },
  {
    "id": "l-207",
    "chapterId": "ch-6",
    "levelId": "lvl-2",
    "lessonNumber": 7,
    "title": "Khẩu vị & Dặn dò nhà bếp (不要放辣椒)",
    "chineseTitle": "口味与点餐嘱咐（酸、甜、苦、辣、咸）",
    "subtitle": "5 vị cơ bản trong ẩm thực (chua, ngọt, đắng, cay, mặn) và cách dặn dò nhà bếp không bỏ ớt hay hành.",
    "objective": "Miêu tả khẩu vị ưa thích và dặn dò đầu bếp nấu theo yêu cầu đặc biệt của bản thân.",
    "prerequisite": "Đã hoàn thành Bài 206.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng câu dặn dò nhà bếp.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Khẩu vị",
      "Cay",
      "Ngọt",
      "不要放辣椒"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "5 Vị cơ bản: 酸 (suān - chua), 甜 (tián - ngọt), 苦 (kǔ - đắng), 辣 (là - cay), 咸 (xián - mặn)",
      "summary": "Cấu trúc dặn dò đầu bếp: 不要放... (Đừng bỏ...), 少放... (Bỏ ít...). Ví dụ: 不要放辣椒 (Đừng bỏ ớt), 少放盐 (Bỏ ít muối).",
      "audioDemoText": "suān tián kǔ là xián, bú yào fàng làjiāo, shǎo fàng yán"
    },
    "step2_vocabulary": [
      {
        "id": "v-207-1",
        "hanzi": "辣",
        "pinyin": "là",
        "hanviet": "Lạt",
        "meaning": "Cay",
        "radical": "辛 (Tân)",
        "example": {
          "hanzi": "四川菜很辣。",
          "pinyin": "Sìchuān cài hěn là.",
          "meaning": "Món ăn Tứ Xuyên rất cay."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-207-2",
        "hanzi": "甜",
        "pinyin": "tián",
        "hanviet": "Điềm",
        "meaning": "Ngọt",
        "radical": "甘 (Cam)",
        "example": {
          "hanzi": "这个西瓜很甜。",
          "pinyin": "Zhège xīguā hěn tián.",
          "meaning": "Quả dưa hấu này rất ngọt."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-207-3",
        "hanzi": "酸",
        "pinyin": "suān",
        "hanviet": "Phóng",
        "meaning": "Chua",
        "radical": "攵 (Phác)",
        "example": {
          "hanzi": "有点儿酸。",
          "pinyin": "Yǒudiǎnr suān.",
          "meaning": "Hơi chua một chút."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-207-4",
        "hanzi": "放",
        "pinyin": "fàng",
        "hanviet": "Lạt tiêu",
        "meaning": "Bỏ vào, để, đặt",
        "radical": "辛 (Tân)",
        "example": {
          "hanzi": "不要放糖。",
          "pinyin": "Bú yào fàng táng.",
          "meaning": "Đừng bỏ đường."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-207-5",
        "hanzi": "辣椒",
        "pinyin": "làjiāo",
        "hanviet": "Oản",
        "meaning": "Quả ớt",
        "radical": "石 (Thạch)",
        "example": {
          "hanzi": "我不吃辣椒。",
          "pinyin": "Wǒ bù chī làjiāo.",
          "meaning": "Tôi không ăn ớt."
        },
        "pos": "Lượng từ / Danh từ"
      },
      {
        "id": "v-207-6",
        "hanzi": "少",
        "pinyin": "shǎo",
        "hanviet": "Bôi",
        "meaning": "Ít",
        "radical": "木 (Mộc)",
        "example": {
          "hanzi": "少放一点儿盐。",
          "pinyin": "Shǎo fàng yìdiǎnr yán.",
          "meaning": "Bỏ ít muối một chút."
        },
        "pos": "Lượng từ / Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "辣",
        "hanzi": "辣",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰辛束",
        "radical": {
          "char": "辛",
          "name": "Tân",
          "strokes": 7
        },
        "meaning": "Cay nồng",
        "strokesCount": 14,
        "strokeOrderText": "Bộ Tân 辛 (7 nét) -> Bộ Thúc 束 (7 nét)",
        "components": [
          "辛",
          "束"
        ],
        "mnemonic": "Vị cay cay cay gắt (辛) như bó chặt (束) lấy đầu lưỡi.",
        "pinyin": "là"
      },
      {
        "char": "甜",
        "hanzi": "甜",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰舌甘",
        "radical": {
          "char": "甘",
          "name": "Cam",
          "strokes": 5
        },
        "meaning": "Ngọt ngào",
        "strokesCount": 11,
        "strokeOrderText": "Bộ Thiệt 舌 (6 nét) -> Bộ Cam 甘 (5 nét)",
        "components": [
          "舌",
          "甘"
        ],
        "mnemonic": "Cái lưỡi (舌) nếm được vị cam ngọt (甘) ngào của mật.",
        "pinyin": "tián"
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc dặn dò khẩu vị: 不要放 / 少放 + Gia vị",
      "formula": "请 + 不要放 / 少放 + 辣椒 (ớt) / 糖 (đường) / 盐 (muối) / 香菜 (ngò rí)",
      "explanation": "Khi đi du lịch Trung Quốc, đặc biệt ở Tứ Xuyên và Hồ Nam nơi các món rất cay, mẫu câu '不要放辣椒' là chìa khóa sinh tồn hữu ích.",
      "examples": [
        {
          "hanzi": "服务员，我的菜请不要放辣椒，少放盐。",
          "pinyin": "Fúwùyuán, wǒ de cài qǐng bú yào fàng làjiāo, shǎo fàng yán.",
          "meaning": "Phục vụ ơi, món của tôi xin đừng bỏ ớt, và cho ít muối thôi nhé."
        }
      ],
      "commonMistake": {
        "wrong": "不放辣椒 ❌ (thiếu lịch sự)",
        "correct": "请不要放辣椒 ✔️",
        "explanation": "Thêm 请 và 不要 để thể hiện thái độ nhã nhặn."
      }
    },
    "step5_listening": {
      "situation": "Dặn dò khẩu vị với đầu bếp khi không ăn được cay",
      "context": "Tại quầy mì Tứ Xuyên thơm nồng mùi gia vị",
      "participants": "A: Du khách Việt Nam, B: Bếp trưởng / Chủ quán",
      "targetGoal": "Thành thạo cấu trúc dặn dò khẩu vị: 不要放辣椒 (đừng bỏ ớt), 少放一点儿 (cho ít một chút)",
      "usageNotes": "Khi ăn đồ Trung Quốc, nếu không ăn được cay nhớ nói: 我不能吃辣，请不要放辣椒 (Wǒ bù néng chī là, qǐng bú yào fàng làjiāo).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "老板，这碗牛肉面很辣吗？我不太能吃辣。",
          "pinyin": "Lǎobǎn, zhè wǎn niúròu miàn hěn là ma? Wǒ bú tài néng chī là.",
          "meaning": "Chủ quán ơi, bát mì thịt bò này có cay lắm không? Tôi không ăn cay được lắm."
        },
        {
          "speaker": "B",
          "hanzi": "我们四川菜都有点儿辣。你要是不能吃辣，我可以做清汤的。",
          "pinyin": "Wǒmen Sìchuān cài dōu yǒudiǎnr là. Nǐ yàoshi bù néng chī là, wǒ kěyǐ zuò qīngtāng de.",
          "meaning": "Món Tứ Xuyên chúng tôi đều hơi cay. Nếu bạn không ăn cay được, tôi có thể làm nước dùng thanh ngọt."
        },
        {
          "speaker": "A",
          "hanzi": "太感谢了！请千万不要放辣椒，少放一点儿盐。",
          "pinyin": "Tài gǎnxiè le! Qǐng qiānwàn bú yào fàng làjiāo, shǎo fàng yìdiǎnr yán.",
          "meaning": "Cảm ơn bác nhiều quá! Xin ngàn vạn lần đừng bỏ ớt, và cho ít muối một chút nhé."
        },
        {
          "speaker": "B",
          "hanzi": "好的，记住了，一碗牛肉面，不放辣椒少放盐！",
          "pinyin": "Hǎo de, jì zhù le, yì wǎn niúròu miàn, bú fàng làjiāo shǎo fàng yán!",
          "meaning": "Được rồi, tôi nhớ rồi, một bát mì bò không ớt và ít muối!"
        }
      ],
      "audioText": "老板，这碗牛肉面很辣吗？我不太能吃辣。我们四川菜都有点儿辣。你要是不能吃辣，我可以做清汤的。太感谢了！请千万不要放辣椒，少放一点儿盐。好的，记住了，一碗牛肉面，不放辣椒少放盐！",
      "question": "Khách hàng dặn dò đầu bếp về khẩu vị như thế nào?",
      "options": [
        "Cho thật nhiều ớt cay",
        "Không cho ớt và cho ít muối (不要放辣椒，少放盐)",
        "Cho nhiều dấm và tiêu",
        "Cho thêm đường"
      ],
      "correctIndex": 1,
      "explanation": "Khách dặn: \"请千万不要放辣椒，少放一点儿盐\"."
    },
    "step6_speaking": {
      "prompt": "Dặn dò đầu bếp không bỏ ớt:",
      "targetSentence": "请不要放辣椒。",
      "targetPinyin": "Qǐng bú yào fàng làjiāo.",
      "targetMeaning": "Xin đừng bỏ ớt.",
      "hint": "Đọc làjiāo dứt khoát thanh 4 và 1."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Xin cho ít muối một chút",
      "words": [
        "盐",
        "少放一点儿",
        "请"
      ],
      "correctOrder": [
        "请",
        "少放一点儿",
        "盐"
      ],
      "explanation": "请 + 少放一点儿 + 盐."
    },
    "step8_quiz": [
      {
        "id": "q-207-1",
        "type": "multiple-choice",
        "question": "Từ nào sau đây mang nghĩa là vị 'Ngọt'?",
        "options": [
          "辣 (là)",
          "酸 (suān)",
          "甜 (tián)",
          "苦 (kǔ)"
        ],
        "correctIndex": 2,
        "explanation": "甜 (tián) là ngọt."
      },
      {
        "id": "q-207-2",
        "type": "multiple-choice",
        "question": "Câu '不要放辣椒' có nghĩa là:",
        "options": [
          "Cho nhiều ớt vào",
          "Đừng bỏ ớt",
          "Đừng ăn cơm",
          "Bỏ thêm muối"
        ],
        "correctIndex": 1,
        "explanation": "Đừng bỏ ớt vào món ăn."
      }
    ],
    "step9_challenge": {
      "title": "Khẩu vị của riêng tôi",
      "taskDesc": "Đọc to câu dặn dò nhà bếp: Tôi thích ngọt, không ăn được cay, xin đừng cho ớt.",
      "targetPhrase": "qǐng bú yào fàng làjiāo wǒ bù chī là",
      "xpReward": 50,
      "badge": "Khẩu Vị Tinh Tế"
    }
  },
  {
    "id": "l-208",
    "chapterId": "ch-6",
    "levelId": "lvl-2",
    "lessonNumber": 8,
    "title": "Mua sắm quần áo, màu sắc & Size (试衣服)",
    "chineseTitle": "服装购物、颜色与试穿（这件衣服可以试一下吗）",
    "subtitle": "Lượng từ 件 (jiàn), màu sắc cơ bản (đỏ, đen, trắng), động từ 穿 (mặc) và thử đồ (试一下).",
    "objective": "Biết hỏi thử quần áo, hỏi size lớn/nhỏ và miêu tả màu sắc yêu thích.",
    "prerequisite": "Đã hoàn thành Bài 207.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đàm thoại thử đồ trong shop thời trang.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Mua sắm",
      "Quần áo",
      "Màu sắc",
      "试衣服"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Mua sắm quần áo: 这件衣服可以试一下吗？ (Zhè jiàn yīfu kěyǐ shì yíxià ma?)",
      "summary": "件 (jiàn) là lượng từ cho quần áo. 颜色 (yánsè) là màu sắc: 红色 (đỏ), 黑色 (đen), 白色 (trắng). 试 (shì) là thử, 穿 (chuān) là mặc.",
      "audioDemoText": "zhè jiàn yīfu kěyǐ shì yíxià ma, yǒu méiyǒu dà yidiǎnr de"
    },
    "step2_vocabulary": [
      {
        "id": "v-208-1",
        "hanzi": "衣服",
        "pinyin": "yīfu",
        "hanviet": "Kiện",
        "meaning": "Quần áo",
        "radical": "亻 (Nhân đứng)",
        "example": {
          "hanzi": "买新衣服。",
          "pinyin": "Mǎi xīn yīfu.",
          "meaning": "Mua quần áo mới."
        },
        "pos": "Lượng từ"
      },
      {
        "id": "v-208-2",
        "hanzi": "件",
        "pinyin": "jiàn",
        "hanviet": "Xuyên",
        "meaning": "Chiếc, cái (lượng từ quần áo)",
        "radical": "穴 (Huyệt)",
        "example": {
          "hanzi": "这件衣服很漂亮。",
          "pinyin": "Zhè jiàn yīfu hěn piàoliang.",
          "meaning": "Bộ quần áo này rất đẹp."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-208-3",
        "hanzi": "试",
        "pinyin": "shì",
        "hanviet": "Thí",
        "meaning": "Thử (thử đồ, thi)",
        "radical": "讠 (Ngôn)",
        "example": {
          "hanzi": "我可以试一下吗？",
          "pinyin": "Wǒ kěyǐ shì yíxià ma?",
          "meaning": "Tôi có thể thử một chút không?"
        },
        "pos": "Động từ"
      },
      {
        "id": "v-208-4",
        "hanzi": "穿",
        "pinyin": "chuān",
        "hanviet": "Y phục",
        "meaning": "Mặc, xỏ (giày áo)",
        "radical": "衤 (Y)",
        "example": {
          "hanzi": "穿这件衬衫。",
          "pinyin": "Chuān zhè jiàn chènshān.",
          "meaning": "Mặc chiếc áo sơ mi này."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-208-5",
        "hanzi": "颜色",
        "pinyin": "yánsè",
        "hanviet": "Nhan sắc",
        "meaning": "Màu sắc",
        "radical": "页 (Hiệt)",
        "example": {
          "hanzi": "你喜欢什么颜色？",
          "pinyin": "Nǐ xǐhuan shénme yánsè?",
          "meaning": "Bạn thích màu gì?"
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-208-6",
        "hanzi": "红",
        "pinyin": "hóng",
        "hanviet": "Đại hiệu",
        "meaning": "Màu đỏ",
        "radical": "大 (Đại)",
        "example": {
          "hanzi": "红色的衣服。",
          "pinyin": "Hóngsè de yīfu.",
          "meaning": "Quần áo màu đỏ."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "衣",
        "hanzi": "衣",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "衣",
        "radical": {
          "char": "衣",
          "name": "Y",
          "strokes": 6
        },
        "meaning": "Áo, y phục",
        "strokesCount": 6,
        "strokeOrderText": "Chấm -> Ngang -> Phẩy -> Cong móc -> Phẩy -> Mác",
        "components": [
          "衣"
        ],
        "mnemonic": "Hình vẽ chiếc áo choàng thời xưa có cổ áo và tay áo rủ xuống.",
        "pinyin": "yī"
      },
      {
        "char": "穿",
        "hanzi": "穿",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱穴牙",
        "radical": {
          "char": "穴",
          "name": "Huyệt",
          "strokes": 5
        },
        "meaning": "Mặc, xuyên qua",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Huyệt 穴 (5 nét) -> Chữ Nha 牙 (4 nét)",
        "components": [
          "穴",
          "牙"
        ],
        "mnemonic": "Răng nanh (牙) cắn thủng cái hang (穴), mang nghĩa xỏ xuyên qua để mặc quần áo.",
        "pinyin": "chuān"
      }
    ],
    "step4_grammar": {
      "title": "Động từ trùng điệp hoặc đi cùng 一下 để làm mềm giọng điệu: 试一下 / 穿穿",
      "formula": "Động từ + 一下 (yíxià) -> Biểu thị hành động thử trong chốc lát, tạo ngữ khí nhẹ nhàng",
      "explanation": "Khi xin phép làm gì (thử áo, xem đồ, hỏi han), dùng 一下 để câu nói trở nên vô cùng lịch sự và tự nhiên.",
      "examples": [
        {
          "hanzi": "请问，我可以试一下这件红色的衣服吗？",
          "pinyin": "Qǐngwèn, wǒ kěyǐ shì yíxià zhè jiàn hóngsè de yīfu ma?",
          "meaning": "Xin hỏi, tôi có thể thử chiếc áo màu đỏ này một chút được không?"
        }
      ],
      "commonMistake": {
        "wrong": "我可以试吗？ (hơi cộc lốc)",
        "correct": "我可以试一下吗？ ✔️",
        "explanation": "一下 giúp câu nói mềm mại, nhã nhặn hơn."
      }
    },
    "step5_listening": {
      "situation": "Mua sắm quần áo thời trang, hỏi màu sắc và thử kích cỡ (Size)",
      "context": "Trong cửa hàng quần áo thời trang trung tâm mua sắm",
      "participants": "A: Người mua hàng, B: Nhân viên tư vấn bán hàng",
      "targetGoal": "Thực hành các lượng từ quần áo (件), màu sắc (红色, 白色, 黑色) và xin thử đồ (试一下)",
      "usageNotes": "Động từ 试 (shì) kết hợp với 一下: 试一下 (thử một chút). Lượng từ của áo là 件 (jiàn).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你好，我想看一下这件红色的衣服。",
          "pinyin": "Nǐ hǎo, wǒ xiǎng kàn yíxià zhè jiàn hóngsè de yīfu.",
          "meaning": "Chào bạn, tôi muốn xem chiếc áo màu đỏ này."
        },
        {
          "speaker": "B",
          "hanzi": "您好！这件衣服今年很流行，穿起来非常漂亮。",
          "pinyin": "Nín hǎo! Zhè jiàn yīfu jīnnián hěn liúxíng, chuān qǐlái fēicháng piàoliang.",
          "meaning": "Chào quý khách! Chiếc áo này năm nay rất thịnh hành, mặc lên người rất đẹp."
        },
        {
          "speaker": "A",
          "hanzi": "我可以试穿一下吗？我觉得这件有点儿小。",
          "pinyin": "Wǒ kěyǐ shìchuān yíxià ma? Wǒ juéde zhè jiàn yǒudiǎnr xiǎo.",
          "meaning": "Tôi có thể mặc thử một chút không? Tôi thấy chiếc này hơi nhỏ."
        },
        {
          "speaker": "B",
          "hanzi": "当然可以，试衣间在右边。如果您觉得小，我给您拿一件大号的。",
          "pinyin": "Dāngrán kěyǐ, shìyījiān zài yòubiān. Rúguǒ nín juéde xiǎo, wǒ gěi nín ná yí jiàn dàhào de.",
          "meaning": "Đương nhiên được ạ, phòng thử đồ ở bên phải. Nếu quý khách thấy nhỏ, tôi lấy chiếc cỡ lớn cho bạn."
        }
      ],
      "audioText": "你好，我想看一下这件红色的衣服。您好！这件衣服今年很流行，穿起来非常漂亮。我可以试穿一下吗？我觉得这件有点儿小。当然可以，试衣间在右边。如果您觉得小，我给您拿一件大号的。",
      "question": "Nhân viên bán hàng sẽ làm gì nếu khách hàng cảm thấy chiếc áo bị chật?",
      "options": [
        "Bảo khách hàng giảm cân",
        "Lấy cho khách một chiếc cỡ lớn hơn (大号)",
        "Bảo khách đổi màu áo",
        "Bán áo cho người khác"
      ],
      "correctIndex": 1,
      "explanation": "Nhân viên nói: \"如果您觉得小，我给您拿一件大号的\"."
    },
    "step6_speaking": {
      "prompt": "Hỏi nhân viên xin phép thử chiếc áo này:",
      "targetSentence": "我可以试一下吗？",
      "targetPinyin": "Wǒ kěyǐ shì yíxià ma?",
      "targetMeaning": "Tôi có thể thử một chút không?",
      "hint": "Đọc shì yíxià ma nhẹ nhàng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Chiếc áo này rất đẹp",
      "words": [
        "很漂亮",
        "衣服",
        "这件"
      ],
      "correctOrder": [
        "这件",
        "衣服",
        "很漂亮"
      ],
      "explanation": "这件 + 衣服 + 很漂亮."
    },
    "step8_quiz": [
      {
        "id": "q-208-1",
        "type": "multiple-choice",
        "question": "Lượng từ dùng cho quần áo (áo, váy, áo khoác) là:",
        "options": [
          "个 (gè)",
          "件 (jiàn)",
          "本 (běn)",
          "张 (zhāng)"
        ],
        "correctIndex": 1,
        "explanation": "Lượng từ quần áo là 件 (jiàn yīfu)."
      },
      {
        "id": "q-208-2",
        "type": "multiple-choice",
        "question": "Màu '黑色' (hēisè) trong tiếng Trung là màu gì?",
        "options": [
          "Màu trắng",
          "Màu đen",
          "Màu đỏ",
          "Màu xanh"
        ],
        "correctIndex": 1,
        "explanation": "Hắc sắc là màu đen."
      }
    ],
    "step9_challenge": {
      "title": "Tín đồ thời trang",
      "taskDesc": "Đọc to câu hỏi xin thử một chiếc áo màu đỏ size lớn hơn.",
      "targetPhrase": "wǒ kěyǐ shì yíxià zhè jiàn yīfu ma",
      "xpReward": 50,
      "badge": "Stylist Bản Lĩnh"
    }
  },
  {
    "id": "l-209",
    "chapterId": "ch-6",
    "levelId": "lvl-2",
    "lessonNumber": 9,
    "title": "Thanh toán số & Mặc cả (微信支付与打折)",
    "chineseTitle": "移动支付与讨价还价（可以便宜一点儿吗）",
    "subtitle": "Kỹ năng mặc cả (便宜一点儿), giảm giá (打折) và thanh toán qua ví điện tử WeChat Pay/Alipay.",
    "objective": "Mặc cả mua hàng thành công và thanh toán quét mã QR như người bản xứ.",
    "prerequisite": "Đã hoàn thành Bài 208.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và thực hành đàm thoại mặc cả, thanh toán.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Mặc cả",
      "WeChat Pay",
      "Alipay",
      "打折",
      "便宜一点儿"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Thanh toán thời đại số: 扫码支付 (Quét mã trả tiền) & Mặc cả: 可以便宜一点儿吗？",
      "summary": "便宜 (piányi) là rẻ. 便宜一点儿 (rẻ hơn chút nhé). 打折 (dǎzhé) là giảm giá (打八折 nghĩa là giảm 20%, bán với giá 80%). 微信 (WeChat), 支付宝 (Alipay).",
      "audioDemoText": "kěyǐ piányi yìdiǎnr ma, wǒ sǎomǎ fùqián, wēixìn háishì zhīfùbǎo"
    },
    "step2_vocabulary": [
      {
        "id": "v-209-1",
        "hanzi": "便宜",
        "pinyin": "piányi",
        "hanviet": "Đả chiết",
        "meaning": "Rẻ, giá cả phải chăng",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "太贵了，便宜一点儿吧！",
          "pinyin": "Tài guì le, piányi yìdiǎnr ba!",
          "meaning": "Đắt quá, rẻ một chút đi mà!"
        },
        "pos": "Cụm động từ"
      },
      {
        "id": "v-209-2",
        "hanzi": "打折",
        "pinyin": "dǎzhé",
        "hanviet": "Vi tín",
        "meaning": "Chiết khấu, giảm giá",
        "radical": "彳 (Xích)",
        "example": {
          "hanzi": "今天打八折。",
          "pinyin": "Jīntiān dǎ bā zhé.",
          "meaning": "Hôm nay giảm 20% (bán giá 80%)."
        },
        "pos": "Danh từ riêng"
      },
      {
        "id": "v-209-3",
        "hanzi": "微信",
        "pinyin": "Wēixìn",
        "hanviet": "Tiện nghi",
        "meaning": "WeChat (ứng dụng nhắn tin/thanh toán)",
        "radical": "亻 (Nhân đứng)",
        "example": {
          "hanzi": "我用微信付钱。",
          "pinyin": "Wǒ yòng Wēixìn fùqián.",
          "meaning": "Tôi dùng WeChat trả tiền."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-209-4",
        "hanzi": "支付宝",
        "pinyin": "Zhīfùbǎo",
        "hanviet": "Thái... liễu",
        "meaning": "Alipay (ví điện tử)",
        "radical": "大 (Đại)",
        "example": {
          "hanzi": "支持支付宝。",
          "pinyin": "Zhīchí Zhīfùbǎo.",
          "meaning": "Hỗ trợ thanh toán Alipay."
        },
        "pos": "Phó từ / Cảm thán"
      },
      {
        "id": "v-209-5",
        "hanzi": "扫码",
        "pinyin": "sǎomǎ",
        "hanviet": "Bách",
        "meaning": "Quét mã QR",
        "radical": "白 (Bạch)",
        "example": {
          "hanzi": "请扫这里。",
          "pinyin": "Qǐng sǎo zhèlǐ.",
          "meaning": "Xin quét ở đây."
        },
        "pos": "Số từ"
      },
      {
        "id": "v-209-6",
        "hanzi": "现金",
        "pinyin": "xiànjīn",
        "hanviet": "Thiên",
        "meaning": "Tiền mặt",
        "radical": "十 (Thập)",
        "example": {
          "hanzi": "我有现金。",
          "pinyin": "Wǒ yǒu xiànjīn.",
          "meaning": "Tôi có tiền mặt."
        },
        "pos": "Số từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "宜",
        "hanzi": "宜",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱宀且",
        "radical": {
          "char": "宀",
          "name": "Miên",
          "strokes": 3
        },
        "meaning": "Thích hợp, tiện nghi",
        "strokesCount": 8,
        "strokeOrderText": "Chấm -> Chấm -> Ngang móc (宀) -> Sổ -> Ngang gập -> Ngang -> Ngang -> Ngang dài (且)",
        "components": [
          "宀",
          "且"
        ],
        "mnemonic": "Dưới mái nhà (宀) xếp đặt đồ đạc (且) rất thích hợp, thuận tiện.",
        "pinyin": "yí"
      },
      {
        "char": "信",
        "hanzi": "信",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰亻言",
        "radical": {
          "char": "亻",
          "name": "Nhân đứng",
          "strokes": 2
        },
        "meaning": "Tin tưởng, tin nhắn",
        "strokesCount": 9,
        "strokeOrderText": "Phẩy -> Sổ (亻) -> Chấm -> Ngang -> Ngang -> Ngang -> Khẩu (言)",
        "components": [
          "亻",
          "言"
        ],
        "mnemonic": "Con người (亻) nói lời nào (言) giữ đúng lời ấy là người đáng tin cậy (信).",
        "pinyin": "xìn"
      }
    ],
    "step4_grammar": {
      "title": "Hiểu đúng cách tính giảm giá '打...折' của người Trung Quốc",
      "formula": "打 X 折 = Giá bán bằng X/10 giá gốc (Ví dụ: 打八折 = Bán 80% giá, tức giảm 20%)",
      "explanation": "Người Việt hay nhầm: Nghe '打八折' tưởng giảm 80%, nhưng thực tế người Trung Quốc tính phần GIỮ LẠI (bán với 8 phần giá gốc).",
      "examples": [
        {
          "hanzi": "一件一百块的衣服，打八折就是八十块。",
          "pinyin": "Yí jiàn yì bǎi kuài de yīfu, dǎ bā zhé jiù shì bāshí kuài.",
          "meaning": "Một chiếc áo 100 tệ, giảm giá 20% (đả bát chiết) thì còn 80 tệ."
        }
      ],
      "commonMistake": {
        "wrong": "Nghĩ 打八折 là giảm 80% ❌",
        "correct": "Đánh giá 8/10, tức là giảm 20% ✔️",
        "explanation": "Cách tính chiết khấu đặc trưng của Trung Quốc."
      }
    },
    "step5_listening": {
      "situation": "Mặc cả giá cả lịch sự và thanh toán không tiền mặt bằng WeChat",
      "context": "Tại quầy bán đồ lưu niệm thủ công mỹ nghệ",
      "participants": "A: Khách mua quà lưu niệm, B: Chủ quầy hàng",
      "targetGoal": "Thực hành mẫu câu mặc cả kinh điển: 太贵了，便宜一点儿可以吗 và thanh toán 微信支付",
      "usageNotes": "Mặc cả văn minh: Bày tỏ thiện chí mua (便宜一点儿我就买) và hỏi thanh toán quét mã (扫码支付).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "老板，这套茶具多少钱？",
          "pinyin": "Lǎobǎn, zhè tào chájù duōshao qián?",
          "meaning": "Chủ quán ơi, bộ ấm chén trà này bao nhiêu tiền?"
        },
        {
          "speaker": "B",
          "hanzi": "这套是一百八十块钱。",
          "pinyin": "Zhè tào shì yìbǎi bāshí kuài qián.",
          "meaning": "Bộ này là 180 tệ."
        },
        {
          "speaker": "A",
          "hanzi": "太贵了，一百五十块钱可以吗？便宜一点儿我就买。",
          "pinyin": "Tài guì le, yìbǎi wǔshí kuài qián kěyǐ ma? Piányi yìdiǎnr wǒ jiù mǎi.",
          "meaning": "Đắt quá, 150 tệ được không? Bớt một chút là tôi mua liền."
        },
        {
          "speaker": "B",
          "hanzi": "行吧，看你这么喜欢，一百五十块给你了。",
          "pinyin": "Xíng ba, kàn nǐ zhème xǐhuan, yìbǎi wǔshí kuài gěi nǐ le.",
          "meaning": "Được rồi, thấy bạn thích thế này, 150 tệ bán cho bạn đó."
        },
        {
          "speaker": "A",
          "hanzi": "谢谢老板！我用微信支付扫码给你。",
          "pinyin": "Xièxie lǎobǎn! Wǒ yòng Wēixìn zhīfù sǎomǎ gěi nǐ.",
          "meaning": "Cảm ơn chủ quán! Tôi dùng WeChat Pay quét mã trả tiền cho bạn nhé."
        }
      ],
      "audioText": "老板，这套茶具多少钱？这套是一百八十块钱。太贵了，一百五十块钱可以吗？便宜一点儿我就买。行吧，看你这么喜欢，一百五十块给你了。谢谢老板！我用微信支付扫码给你。",
      "question": "Bộ ấm chén trà được chốt bán với giá bao nhiêu tệ sau khi khách mặc cả?",
      "options": [
        "180 tệ",
        "100 tệ",
        "150 tệ (一百五十块)",
        "200 tệ"
      ],
      "correctIndex": 2,
      "explanation": "Chủ quầy đồng ý: \"一百五十块给你了\" (150 tệ để cho bạn đó)."
    },
    "step6_speaking": {
      "prompt": "Đọc câu mặc cả kinh điển:",
      "targetSentence": "老板，可以便宜一点儿吗？",
      "targetPinyin": "Lǎobǎn, kěyǐ piányi yìdiǎnr ma?",
      "targetMeaning": "Chủ quán ơi, có thể bớt chút được không?",
      "hint": "Đọc piányi thanh nhẹ, giọng điệu dễ thương."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi quét mã WeChat trả tiền",
      "words": [
        "付钱",
        "微信",
        "我扫"
      ],
      "correctOrder": [
        "我扫",
        "微信",
        "付钱"
      ],
      "explanation": "我扫 + 微信 + 付钱."
    },
    "step8_quiz": [
      {
        "id": "q-209-1",
        "type": "multiple-choice",
        "question": "Cửa hàng treo biển '打七折' (dǎ qī zhé) nghĩa là khách được:",
        "options": [
          "Giảm 70%",
          "Giảm 30% (bán giá 70% giá gốc)",
          "Mua 7 tặng 1",
          "Miễn phí"
        ],
        "correctIndex": 1,
        "explanation": "Đả thất chiết là bán 70% giá, tức giảm 30%."
      },
      {
        "id": "q-209-2",
        "type": "multiple-choice",
        "question": "Hai ứng dụng quét mã thanh toán phổ biến nhất Trung Quốc là:",
        "options": [
          "Facebook và Google",
          "WeChat (微信) và Alipay (支付宝)",
          "Zalo và Momo",
          "Grab và Shopee"
        ],
        "correctIndex": 1,
        "explanation": "WeChat Pay và Alipay thống trị thanh toán số Trung Quốc."
      }
    ],
    "step9_challenge": {
      "title": "Chinh phục chủ shop",
      "taskDesc": "Đọc trọn vẹn câu: Bác ơi bớt chút đi, cháu quét mã WeChat thanh toán ngay!",
      "targetPhrase": "lǎobǎn kěyǐ piányi yìdiǎnr ma wǒ sǎomǎ",
      "xpReward": 50,
      "badge": "Bậc Thầy Mặc Cả"
    }
  },
  {
    "id": "l-210",
    "chapterId": "ch-6",
    "levelId": "lvl-2",
    "lessonNumber": 10,
    "title": "Ôn tập Module 2.2 & Thử thách đi chợ đêm mua sắm",
    "chineseTitle": "模块2.2总复习与夜市购物实战",
    "subtitle": "Tổng hợp đối thoại ăn uống, mặc cả, thanh toán quét mã tại khu chợ đêm sầm uất.",
    "objective": "Làm chủ trọn vẹn kỹ năng giao tiếp sinh hoạt ẩm thực và mua sắm trước khi đấu Boss Chapter 6.",
    "prerequisite": "Đã hoàn thành Bài 206–209.",
    "completionCriteria": "Đạt >= 80% điểm bài tập tổng kết Module 2.2.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 2",
      "Tổng kết Module",
      "Chợ đêm",
      "Review Checkpoint"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Hội thoại thực chiến tại Chợ đêm Vương Phủ Tỉnh (王府井夜市)",
      "summary": "1. Mua đồ ăn vặt: 来一份... (Cho một phần...). 2. Thử trang phục lưu niệm: 这件多少钱，可以试吗？. 3. Mặc cả & Quét mã: 便宜点，我扫码.",
      "audioDemoText": "wángfǔjǐng yèshì hěn rènao, yǒushíhou yào dǎzhé"
    },
    "step2_vocabulary": [
      {
        "id": "v-210-1",
        "hanzi": "夜市",
        "pinyin": "yèshì",
        "hanviet": "Nhất cộng",
        "meaning": "Chợ đêm",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "逛夜市。",
          "pinyin": "Guàng yèshì.",
          "meaning": "Dạo chợ đêm."
        },
        "pos": "Phó từ"
      },
      {
        "id": "v-210-2",
        "hanzi": "热闹",
        "pinyin": "rènao",
        "hanviet": "Khối",
        "meaning": "Náo nhiệt, sôi động",
        "radical": "土 (Thổ)",
        "example": {
          "hanzi": "这里真热闹！",
          "pinyin": "Zhèlǐ zhēn rènao!",
          "meaning": "Ở đây náo nhiệt thật!"
        },
        "pos": "Lượng từ"
      },
      {
        "id": "v-210-3",
        "hanzi": "一共",
        "pinyin": "yígòng",
        "hanviet": "Dạ thị",
        "meaning": "Tổng cộng",
        "radical": "夕 (Tịch)",
        "example": {
          "hanzi": "一共五十块。",
          "pinyin": "Yígòng wǔshí kuài.",
          "meaning": "Tổng cộng 50 tệ."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "共",
        "hanzi": "共",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱卄八",
        "radical": {
          "char": "八",
          "name": "Bát",
          "strokes": 2
        },
        "meaning": "Tổng cộng, chung",
        "strokesCount": 6,
        "strokeOrderText": "Ngang -> Sổ -> Sổ -> Ngang dài (卄) -> Phẩy -> Chấm (八)",
        "components": [
          "卄",
          "八"
        ],
        "mnemonic": "Hai bàn tay (八) cùng chung sức nâng bó cỏ (卄) tạo nên tổng cộng.",
        "pinyin": "gòng"
      },
      {
        "char": "块",
        "hanzi": "块",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰土夬",
        "radical": {
          "char": "土",
          "name": "Thổ",
          "strokes": 3
        },
        "meaning": "Đồng tệ, mảnh, cục",
        "strokesCount": 7,
        "strokeOrderText": "Ngang -> Sổ -> Hất (土) -> Ngang gập -> Ngang -> Phẩy -> Mác (夬)",
        "components": [
          "土",
          "夬"
        ],
        "mnemonic": "Mảnh đất (土) được phân chia (夬) thành từng khối vuông vức.",
        "pinyin": "kuài"
      }
    ],
    "step4_grammar": {
      "title": "Hỏi tổng số tiền với 一共 (yígòng)",
      "formula": "一共 + Số tiền + 块 (Ví dụ: 一共八十块)",
      "explanation": "Dùng 一共 khi tính tổng chi phí nhiều món hàng mua cùng một lúc.",
      "examples": [
        {
          "hanzi": "两个一共多少钱？ 一共六十块。",
          "pinyin": "Liǎng gè yígòng duōshao qián? Yígòng liùshí kuài.",
          "meaning": "Hai cái tổng cộng bao nhiêu tiền? Tổng cộng 60 tệ."
        }
      ],
      "commonMistake": {
        "wrong": "共一 ❌",
        "correct": "一共 ✔️",
        "explanation": "Thứ tự từ là 一共."
      }
    },
    "step5_listening": {
      "situation": "Dạo chơi chợ đêm và tính tổng số tiền mua sắm ăn vặt",
      "context": "Tại khu phố ẩm thực chợ đêm nhộn nhịp",
      "participants": "A: Bạn trẻ đi dạo chợ đêm, B: Người bán hàng ăn vặt",
      "targetGoal": "Nắm vững cách hỏi tổng số tiền 一共多少钱 và các con số tính toán cộng gộp",
      "usageNotes": "一共 (yígòng) là phó từ đứng trước vị ngữ biểu thị tổng cộng.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "阿姨，这个烤冷面和奶茶一共多少钱？",
          "pinyin": "Āyí, zhè ge kǎolěngmiàn hé nǎichá yígòng duōshao qián?",
          "meaning": "Dì ơi, món mì nướng lạnh này và cốc trà sữa tổng cộng bao nhiêu tiền ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "烤冷面十五块，奶茶十二块，一共二十七块钱。",
          "pinyin": "Kǎolěngmiàn shíwǔ kuài, nǎichá shí’èr kuài, yígòng èrshíqī kuài qián.",
          "meaning": "Mì nướng lạnh 15 tệ, trà sữa 12 tệ, tổng cộng 27 tệ cháu nhé."
        },
        {
          "speaker": "A",
          "hanzi": "给我打个折吧，二十五块钱可以吗？",
          "pinyin": "Gěi wǒ dǎ gè zhé ba, èrshíwǔ kuài qián kěyǐ ma?",
          "meaning": "Giảm giá bớt cho cháu đi, 25 tệ được không ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "哈哈，小姑娘真会买东西，好，二十五块拿去吧！",
          "pinyin": "Hāhā, xiǎo gūniang zhēn huì mǎi dōngxi, hǎo, èrshíwǔ kuài ná qù ba!",
          "meaning": "Haha, cô bé biết mua sắm thật đấy, được rồi, 25 tệ cầm lấy đi nhé!"
        }
      ],
      "audioText": "阿姨，这个烤冷面和奶茶一共多少钱？烤冷面十五块，奶茶十二块，一共二十七块钱。给我打个折吧，二十五块钱可以吗？哈哈，小姑娘真会买东西，好，二十五块拿去吧！",
      "question": "Người bán hàng cuối cùng lấy tổng số tiền là bao nhiêu sau khi bớt giá?",
      "options": [
        "27 tệ",
        "25 tệ (二十五块)",
        "30 tệ",
        "20 tệ"
      ],
      "correctIndex": 1,
      "explanation": "Người bán vui vẻ đồng ý: \"好，二十五块拿去吧\" (Được rồi, 25 tệ cầm lấy đi nhé)."
    },
    "step6_speaking": {
      "prompt": "Hỏi tổng số tiền mua sắm:",
      "targetSentence": "这两个一共多少钱？",
      "targetPinyin": "Zhè liǎng gè yígòng duōshao qián?",
      "targetMeaning": "Hai cái này tổng cộng bao nhiêu tiền?",
      "hint": "Đọc yígòng rõ ràng thanh 2 và 4."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tổng cộng năm mươi tệ",
      "words": [
        "五十块",
        "一共"
      ],
      "correctOrder": [
        "一共",
        "五十块"
      ],
      "explanation": "一共 + 五十块."
    },
    "step8_quiz": [
      {
        "id": "q-210-1",
        "type": "multiple-choice",
        "question": "Từ '一共' (yígòng) mang nghĩa là gì?",
        "options": [
          "Từng cái một",
          "Tổng cộng",
          "Đắt nhất",
          "Rẻ nhất"
        ],
        "correctIndex": 1,
        "explanation": "一共 là tổng cộng."
      },
      {
        "id": "q-210-2",
        "type": "multiple-choice",
        "question": "Muốn nói 'Tôi quét mã trả tiền', bạn nói:",
        "options": [
          "我付现金",
          "我扫码付钱",
          "我不给钱",
          "你扫我"
        ],
        "correctIndex": 1,
        "explanation": "我扫码付钱 = Tôi quét mã trả tiền."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa Boss Chapter 6",
      "taskDesc": "Vượt qua thử thách chợ đêm để chuẩn bị so tài mua sắm với Boss!",
      "targetPhrase": "zhè liǎng gè yígòng duōshao qián wǒ sǎomǎ",
      "xpReward": 60,
      "badge": "Chiến Thần Chợ Đêm"
    }
  },
  {
    "id": "l-211",
    "chapterId": "ch-7",
    "levelId": "lvl-2",
    "lessonNumber": 11,
    "title": "Bốn mùa & Hiện tượng thời tiết (刮风, 下雪, 晴天)",
    "chineseTitle": "四季气候与天气现象（春夏秋冬）",
    "subtitle": "4 mùa trong năm (xuân, hạ, thu, đông) và các hiện tượng thời tiết gió, mưa tuyết, trời quang.",
    "objective": "Miêu tả được khí hậu các mùa trong năm và các hiện tượng thời tiết quen thuộc.",
    "prerequisite": "Đã hoàn thành Module 2.2.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng câu miêu tả thời tiết 4 mùa.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Thời tiết",
      "Bốn mùa",
      "下雪",
      "晴天"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "4 Mùa: 春 (chūn - xuân), 夏 (xià - hạ), 秋 (qiū - thu), 冬 (dōng - đông)",
      "summary": "Hiện tượng thời tiết phong phú: 晴天 (qíngtiān - trời nắng ráo), 阴天 (yīntiān - trời râm u ám), 刮风 (guāfēng - gió thổi), 下雪 (xiàxuě - tuyết rơi).",
      "audioDemoText": "chūn xià qiū dōng, jīntiān shì qíngtiān, běijīng dōngtiān huì xiàxuě"
    },
    "step2_vocabulary": [
      {
        "id": "v-211-1",
        "hanzi": "晴天",
        "pinyin": "qíngtiān",
        "hanviet": "Tình thiên",
        "meaning": "Trời nắng, trời quang",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "今天是晴天。",
          "pinyin": "Jīntiān shì qíngtiān.",
          "meaning": "Hôm nay trời nắng ráo."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-211-2",
        "hanzi": "阴天",
        "pinyin": "yīntiān",
        "hanviet": "Âm thiên",
        "meaning": "Trời âm u, trời râm",
        "radical": "阝 (Phụ)",
        "example": {
          "hanzi": "阴天要带伞。",
          "pinyin": "Yīntiān yào dài sǎn.",
          "meaning": "Trời râm nhớ mang ô."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-211-3",
        "hanzi": "下雪",
        "pinyin": "xià xuě",
        "hanviet": "Quát phong",
        "meaning": "Tuyết rơi",
        "radical": "刂 (Đao)",
        "example": {
          "hanzi": "外面下雪了。",
          "pinyin": "Wàimiàn xià xuě le.",
          "meaning": "Bên ngoài tuyết rơi rồi."
        },
        "pos": "Cụm động từ"
      },
      {
        "id": "v-211-4",
        "hanzi": "刮风",
        "pinyin": "guā fēng",
        "hanviet": "Hạ tuyết",
        "meaning": "Gió thổi, có gió",
        "radical": "雨 (Vũ)",
        "example": {
          "hanzi": "刮大风。",
          "pinyin": "Guā dà fēng.",
          "meaning": "Gió thổi lớn."
        },
        "pos": "Cụm động từ"
      },
      {
        "id": "v-211-5",
        "hanzi": "春天",
        "pinyin": "chūntiān",
        "hanviet": "Hạ vũ",
        "meaning": "Mùa xuân",
        "radical": "雨 (Vũ)",
        "example": {
          "hanzi": "春天很暖和。",
          "pinyin": "Chūntiān hěn nuǎnhuo.",
          "meaning": "Mùa xuân rất ấm áp."
        },
        "pos": "Cụm động từ"
      },
      {
        "id": "v-211-6",
        "hanzi": "冬天",
        "pinyin": "dōngtiān",
        "hanviet": "Độ",
        "meaning": "Mùa đông",
        "radical": "广 (Quảng)",
        "example": {
          "hanzi": "冬天很冷。",
          "pinyin": "Dōngtiān hěn lěng.",
          "meaning": "Mùa đông rất lạnh."
        },
        "pos": "Lượng từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "晴",
        "hanzi": "晴",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰日青",
        "radical": {
          "char": "日",
          "name": "Nhật",
          "strokes": 4
        },
        "meaning": "Trời quang đãng",
        "strokesCount": 12,
        "strokeOrderText": "Bộ Nhật 日 (4 nét) -> Bộ Thanh 青 (8 nét)",
        "components": [
          "日",
          "青"
        ],
        "mnemonic": "Mặt trời (日) chiếu sáng rực rỡ trên nền trời xanh biếc (青).",
        "pinyin": "qíng"
      },
      {
        "char": "雪",
        "hanzi": "雪",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱雨彐",
        "radical": {
          "char": "雨",
          "name": "Vũ",
          "strokes": 8
        },
        "meaning": "Tuyết trắng",
        "strokesCount": 11,
        "strokeOrderText": "Bộ Vũ 雨 (8 nét) -> Chữ Kệ 彐 (3 nét)",
        "components": [
          "雨",
          "彐"
        ],
        "mnemonic": "Mưa (雨) đông đặc thành bông tuyết rơi xuống tay nắm lại được (彐).",
        "pinyin": "xuě"
      }
    ],
    "step4_grammar": {
      "title": "Cách diễn đạt hiện tượng thời tiết đang xảy ra",
      "formula": "外面 + 下雪了 / 刮风了 / 下雨了",
      "explanation": "Thêm trợ từ 了 ở cuối cụm từ để báo hiệu sự thay đổi của thời tiết (đã bắt đầu có tuyết rơi hoặc nổi gió).",
      "examples": [
        {
          "hanzi": "外面刮风了，穿多一点儿衣服吧！",
          "pinyin": "Wàimiàn guā fēng le, chuān duō yìdiǎnr yīfu ba!",
          "meaning": "Bên ngoài nổi gió rồi, mặc nhiều quần áo một chút đi!"
        }
      ],
      "commonMistake": {
        "wrong": "风刮 ❌",
        "correct": "刮风 ✔️",
        "explanation": "Động từ 刮 đứng trước danh từ 风."
      }
    },
    "step5_listening": {
      "situation": "Trao đổi về thời tiết bốn mùa và dự báo khí hậu ngày mai",
      "context": "Hai người bạn gọi điện thoại lên kế hoạch đi dã ngoại công viên",
      "participants": "A: Lan, B: Minh",
      "targetGoal": "Miêu tả các hiện tượng khí hậu: 晴天 (trời nắng), 刮风 (nổi gió), 下雪 (tuyết rơi), 下雨 (mưa rơi)",
      "usageNotes": "Khi nói nhiệt độ: 只有五度 (chỉ có 5 độ). Động từ 刮 (quát) đi kèm với gió (刮风).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "明天天气预报怎么说？我们还能去公园吗？",
          "pinyin": "Míngtiān tiānqì yùbào zěnme shuō? Wǒmen hái néng qù gōngyuán ma?",
          "meaning": "Ngày mai dự báo thời tiết nói thế nào? Chúng mình còn đi công viên được không?"
        },
        {
          "speaker": "B",
          "hanzi": "预报说早上是晴天，但是下午会刮大风，气温只有五度。",
          "pinyin": "Yùbào shuō zǎoshang shì qíngtiān, dànshì xiàwǔ huì guā dàfēng, qìwēn zhǐ yǒu wǔ dù.",
          "meaning": "Dự báo nói buổi sáng trời quang, nhưng buổi chiều sẽ nổi gió to, nhiệt độ chỉ có 5 độ."
        },
        {
          "speaker": "A",
          "hanzi": "会下雪吗？我听说北方冬天经常下大雪。",
          "pinyin": "Huì xiàxuě ma? Wǒ tīngshuō běifāng dōngtiān jīngcháng xià dàxuě.",
          "meaning": "Có tuyết rơi không? Mình nghe nói mùa đông miền Bắc hay có tuyết rơi lớn."
        },
        {
          "speaker": "B",
          "hanzi": "明天不下雪，不过风很大，出门要多穿衣服。",
          "pinyin": "Míngtiān bú xiàxuě, búguò fēng hěn dà, chūmén yào duō chuān yīfu.",
          "meaning": "Ngày mai không có tuyết rơi, nhưng gió rất lớn, ra ngoài phải mặc nhiều quần áo vào nhé."
        }
      ],
      "audioText": "明天天气预报怎么说？我们还能去公园吗？预报说早上是晴天，但是下午会刮大风，气温只有五度。会下雪吗？我听说北方冬天经常下大雪。明天不下雪，不过风很大，出门要多穿衣服。",
      "question": "Dự báo thời tiết buổi chiều ngày mai có hiện tượng gì?",
      "options": [
        "Trời nắng chang chang 35 độ",
        "Mưa rào lớn",
        "Nổi gió rất to và nhiệt độ chỉ có 5 độ (刮大风)",
        "Bão tuyết dữ dội"
      ],
      "correctIndex": 2,
      "explanation": "Minh thông báo: \"下午会刮大风，气温只有五度\" (Buổi chiều sẽ nổi gió to, nhiệt độ chỉ có 5 độ)."
    },
    "step6_speaking": {
      "prompt": "Nói bên ngoài đang có gió thổi:",
      "targetSentence": "外面刮风了。",
      "targetPinyin": "Wàimiàn guā fēng le.",
      "targetMeaning": "Bên ngoài gió thổi rồi.",
      "hint": "Đọc guā fēng thanh 1 rõ ràng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Hôm nay là trời nắng",
      "words": [
        "晴天",
        "今天",
        "是"
      ],
      "correctOrder": [
        "今天",
        "是",
        "晴天"
      ],
      "explanation": "今天 + 是 + 晴天."
    },
    "step8_quiz": [
      {
        "id": "q-211-1",
        "type": "multiple-choice",
        "question": "Từ nào sau đây mang nghĩa là 'Tuyết rơi'?",
        "options": [
          "下雨 (xià yǔ)",
          "下雪 (xià xuě)",
          "刮风 (guā fēng)",
          "阴天 (yīntiān)"
        ],
        "correctIndex": 1,
        "explanation": "下雪 là tuyết rơi."
      },
      {
        "id": "q-211-2",
        "type": "multiple-choice",
        "question": "Mùa xuân trong tiếng Trung là gì?",
        "options": [
          "春天 (chūntiān)",
          "夏天 (xiàtiān)",
          "秋天 (qiūtiān)",
          "冬天 (dōngtiān)"
        ],
        "correctIndex": 0,
        "explanation": "Mùa xuân là 春天."
      }
    ],
    "step9_challenge": {
      "title": "Thời tiết 4 phương",
      "taskDesc": "Đọc to câu miêu tả thời tiết mùa đông Bắc Kinh có tuyết rơi rất lạnh.",
      "targetPhrase": "běijīng dōngtiān hěn lěng huì xiàxuě",
      "xpReward": 50,
      "badge": "Sứ Giả Bốn Mùa"
    }
  },
  {
    "id": "l-212",
    "chapterId": "ch-7",
    "levelId": "lvl-2",
    "lessonNumber": 12,
    "title": "Câu so sánh hơn với chữ 比 (A 比 B + Tính từ)",
    "chineseTitle": "比较句与介词“比”（今天比昨天冷）",
    "subtitle": "Ngữ pháp trọng điểm bậc nhất HSK 2: Cấu trúc so sánh hơn với chữ 比 và dạng phủ định 没有.",
    "objective": "Sử dụng thành thạo câu chữ 比 để so sánh hai người hoặc hai sự vật hiện tượng.",
    "prerequisite": "Đã hoàn thành Bài 211.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đặt được 2 câu so sánh đúng cú pháp.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Câu chữ 比",
      "So sánh hơn",
      "Ngữ pháp trọng điểm"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Công thức câu so sánh hơn: A + 比 (bǐ) + B + Tính từ",
      "summary": "Tiếng Trung so sánh hơn: A 比 B + Tính từ (今天比昨天冷 - Hôm nay lạnh hơn hôm qua). Phủ định so sánh: A 没有 B + Tính từ (A không bằng B: 昨天没有今天冷).",
      "audioDemoText": "jīntiān bǐ zuótiān lěng, gēge bǐ wǒ gāo, tā méiyǒu wǒ dà"
    },
    "step2_vocabulary": [
      {
        "id": "v-212-1",
        "hanzi": "比",
        "pinyin": "bǐ",
        "hanviet": "Bỉ",
        "meaning": "So với, hơn",
        "radical": "比 (Bỉ)",
        "example": {
          "hanzi": "他比我大两岁。",
          "pinyin": "Tā bǐ wǒ dà liǎng suì.",
          "meaning": "Anh ấy lớn hơn tôi 2 tuổi."
        },
        "pos": "Giới từ"
      },
      {
        "id": "v-212-2",
        "hanzi": "高",
        "pinyin": "gāo",
        "hanviet": "Cao",
        "meaning": "Cao",
        "radical": "高 (Cao)",
        "example": {
          "hanzi": "姚明很高。",
          "pinyin": "Yáo Míng hěn gāo.",
          "meaning": "Diêu Minh rất cao."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-212-3",
        "hanzi": "矮",
        "pinyin": "ǎi",
        "hanviet": "Ải",
        "meaning": "Thấp, lùn",
        "radical": "矢 (Thỉ)",
        "example": {
          "hanzi": "弟弟比我矮。",
          "pinyin": "Dìdi bǐ wǒ ǎi.",
          "meaning": "Em trai thấp hơn tôi."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-212-4",
        "hanzi": "长",
        "pinyin": "cháng",
        "hanviet": "Trường",
        "meaning": "Dài",
        "radical": "长 (Trường)",
        "example": {
          "hanzi": "这件衣服比较长。",
          "pinyin": "Zhè jiàn yīfu bǐjiào cháng.",
          "meaning": "Chiếc áo này tương đối dài."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-212-5",
        "hanzi": "短",
        "pinyin": "duǎn",
        "hanviet": "Đoản",
        "meaning": "Ngắn",
        "radical": "矢 (Thỉ)",
        "example": {
          "hanzi": "头发很短。",
          "pinyin": "Tóufa hěn duǎn.",
          "meaning": "Tóc rất ngắn."
        },
        "pos": "Tính từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "比",
        "hanzi": "比",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰匕匕",
        "radical": {
          "char": "比",
          "name": "Bỉ",
          "strokes": 4
        },
        "meaning": "So sánh, hơn",
        "strokesCount": 4,
        "strokeOrderText": "Ngang -> Sổ hất -> Phẩy -> Sổ cong móc",
        "components": [
          "匕",
          "匕"
        ],
        "mnemonic": "Hai chiếc muỗng (匕) đặt song song cạnh nhau để so sánh kích thước.",
        "pinyin": "bǐ"
      },
      {
        "char": "高",
        "hanzi": "高",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱亠冋",
        "radical": {
          "char": "高",
          "name": "Cao",
          "strokes": 10
        },
        "meaning": "To lớn, cao ráo",
        "strokesCount": 10,
        "strokeOrderText": "Chấm -> Ngang (亠) -> Khẩu -> Quynh (冂) -> Khẩu",
        "components": [
          "亠",
          "冋"
        ],
        "mnemonic": "Hình vẽ ngọn đài tháp cao tầng có mái che và các cửa sổ thông gió.",
        "pinyin": "gāo"
      }
    ],
    "step4_grammar": {
      "title": "Quy tắc vàng: Tuyệt đối KHÔNG dùng 很 trong câu chữ 比",
      "formula": "A + 比 + B + Tính từ (KHÔNG DÙNG: A 比 B 很 + Tính từ ❌)",
      "explanation": "Trong câu chữ 比, sự so sánh đã thể hiện tính chênh lệch. Dùng thêm 很 sẽ bị coi là lỗi ngữ pháp nghiêm trọng.",
      "examples": [
        {
          "hanzi": "今天比昨天冷。（ĐÚNG）  /  今天比昨天很冷。（SAI ❌）",
          "pinyin": "Jīntiān bǐ zuótiān lěng.",
          "meaning": "Hôm nay lạnh hơn hôm qua."
        }
      ],
      "commonMistake": {
        "wrong": "他比我很高 ❌",
        "correct": "他比我高 ✔️",
        "explanation": "Trong câu chữ 比 tuyệt đối không cho 很 đứng trước tính từ."
      }
    },
    "step5_listening": {
      "situation": "So sánh mức độ nhiệt độ và thời tiết giữa hai thành phố",
      "context": "Cuộc gọi video giữa Hà Nội và Bắc Kinh vào mùa đông",
      "participants": "A: Hoa (ở Hà Nội), B: Tuấn (du học sinh tại Bắc Kinh)",
      "targetGoal": "Sử dụng cấu trúc câu so sánh chữ 比: A 比 B + Tính từ (+ 多了 / 一点儿)",
      "usageNotes": "Cấu trúc so sánh chữ 比 không được dùng kèm phó từ 很 (Sai: A 比 B 很好; Đúng: A 比 B 好).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "俊，北京现在的天气怎么样？比河内冷吗？",
          "pinyin": "Jùn, Běijīng xiànzài de tiānqì zěnme yàng? Bǐ Hénèi lěng ma?",
          "meaning": "Tuấn ơi, thời tiết Bắc Kinh bây giờ thế nào? Có lạnh hơn Hà Nội không?"
        },
        {
          "speaker": "B",
          "hanzi": "冷多了！北京今天比昨天更冷，最高温度只有零下两度。",
          "pinyin": "Lěng duō le! Běijīng jīntiān bǐ zuótiān gèng lěng, zuìgāo wēndù zhǐ yǒu língxià liǎng dù.",
          "meaning": "Lạnh hơn nhiều lắm! Bắc Kinh hôm nay còn lạnh hơn hôm qua, nhiệt độ cao nhất chỉ âm 2 độ."
        },
        {
          "speaker": "A",
          "hanzi": "天哪，那河内比北京暖和多了，河内今天有二十度呢。",
          "pinyin": "Tiān na, nà Hénèi bǐ Běijīng nuǎnhuo duō le, Hénèi jīntiān yǒu èrshí dù ne.",
          "meaning": "Trời ơi, thế thì Hà Nội ấm áp hơn Bắc Kinh nhiều, Hà Nội hôm nay tận 20 độ cơ."
        },
        {
          "speaker": "B",
          "hanzi": "是啊，你比我幸福多了，我现在出门必须穿大衣。",
          "pinyin": "Shì a, nǐ bǐ wǒ xìngfú duō le, wǒ xiànzài chūmén bìxū chuān dàyī.",
          "meaning": "Đúng thế, bạn hạnh phúc hơn mình nhiều, bây giờ mình ra ngoài bắt buộc phải mặc áo khoác dày."
        }
      ],
      "audioText": "俊，北京现在的天气怎么样？比河内冷吗？冷多了！北京今天比昨天更冷，最高温度只有零下两度。天哪，那河内比北京暖和多了，河内今天有二十度呢。是啊，你比我幸福多了，我现在出门必须穿大衣。",
      "question": "Thời tiết Bắc Kinh hôm nay so với hôm qua như thế nào?",
      "options": [
        "Ấm hơn hôm qua",
        "Lạnh hơn hôm qua và nhiệt độ cao nhất là âm 2 độ (今天比昨天更冷)",
        "Nắng ráo hơn",
        "Không thay đổi"
      ],
      "correctIndex": 1,
      "explanation": "Tuấn nói: \"北京今天比昨天更冷，最高温度只有零下两度\"."
    },
    "step6_speaking": {
      "prompt": "Đọc câu so sánh: Hôm nay lạnh hơn hôm qua:",
      "targetSentence": "今天比昨天冷。",
      "targetPinyin": "Jīntiān bǐ zuótiān lěng.",
      "targetMeaning": "Hôm nay lạnh hơn hôm qua.",
      "hint": "Đọc mượt mà bǐ zuótiān lěng, không thêm 很."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Anh trai cao hơn tôi",
      "words": [
        "我",
        "高",
        "哥哥",
        "比"
      ],
      "correctOrder": [
        "哥哥",
        "比",
        "我",
        "高"
      ],
      "explanation": "哥哥 + 比 + 我 + 高."
    },
    "step8_quiz": [
      {
        "id": "q-212-1",
        "type": "multiple-choice",
        "question": "Câu so sánh nào sau đây đúng ngữ pháp?",
        "options": [
          "他比我很高",
          "他比我高",
          "高他比我",
          "他我比高"
        ],
        "correctIndex": 1,
        "explanation": "Không dùng 很 trong câu chữ 比: 他比我高."
      },
      {
        "id": "q-212-2",
        "type": "multiple-choice",
        "question": "Dạng phủ định của 'Hôm nay lạnh hơn hôm qua' là:",
        "options": [
          "今天不比昨天冷",
          "今天没有昨天冷",
          "今天比昨天没冷",
          "今天冷没有昨天"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định so sánh dùng 没有: 今天没有昨天冷 (Hôm nay không lạnh bằng hôm qua)."
      }
    ],
    "step9_challenge": {
      "title": "Nhà so sánh cừ khôi",
      "taskDesc": "Đọc to câu so sánh chiều cao hoặc tuổi tác của bạn với một người bạn.",
      "targetPhrase": "tā bǐ wǒ gāo wǒ bǐ tā dà",
      "xpReward": 50,
      "badge": "Bậc Thầy So Sánh"
    }
  },
  {
    "id": "l-213",
    "chapterId": "ch-7",
    "levelId": "lvl-2",
    "lessonNumber": 13,
    "title": "So sánh mức độ nâng cao với 更, 最 (Càng & Nhất)",
    "chineseTitle": "程度副词“更”与“最”（更漂亮、最好）",
    "subtitle": "Biểu thị mức độ cao hơn nữa với 更 (gèng - càng) và mức độ tuyệt đối với 最 (zuì - nhất).",
    "objective": "Sử dụng 更 và 最 để diễn tả mức độ tăng tiến và sở thích nhất trong đời sống.",
    "prerequisite": "Đã hoàn thành Bài 212.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng 更 và 最.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "So sánh bậc nhất",
      "更",
      "最",
      "Càng",
      "Nhất"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Phó từ mức độ: 更 (gèng - Càng hơn nữa) & 最 (zuì - Nhất, tuyệt đối)",
      "summary": "更 đứng trước tính từ để biểu đạt mức độ vượt trội hơn nữa (这件更漂亮 - Cái này càng đẹp hơn). 最 đứng trước tính từ/tâm lý để biểu đạt nhất (最好 - Tốt nhất, 最喜欢 - Thích nhất).",
      "audioDemoText": "zhè jiàn gèng piàoliang, wǒ zuì xǐhuan chī běijīng kǎoyā"
    },
    "step2_vocabulary": [
      {
        "id": "v-213-1",
        "hanzi": "更",
        "pinyin": "gèng",
        "hanviet": "Canh",
        "meaning": "Càng, hơn nữa",
        "radical": "曰 (Viết)",
        "example": {
          "hanzi": "明天会更冷。",
          "pinyin": "Míngtiān huì gèng lěng.",
          "meaning": "Ngày mai sẽ càng lạnh hơn."
        },
        "pos": "Phó từ"
      },
      {
        "id": "v-213-2",
        "hanzi": "最",
        "pinyin": "zuì",
        "hanviet": "Tối",
        "meaning": "Nhất",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "我最喜欢你。",
          "pinyin": "Wǒ zuì xǐhuan nǐ.",
          "meaning": "Tôi thích bạn nhất."
        },
        "pos": "Phó từ"
      },
      {
        "id": "v-213-3",
        "hanzi": "好",
        "pinyin": "hǎo",
        "hanviet": "Phi thường",
        "meaning": "Tốt",
        "radical": "非 (Phi)",
        "example": {
          "hanzi": "最好的朋友。",
          "pinyin": "Zuì hǎo de péngyou.",
          "meaning": "Người bạn tốt nhất."
        },
        "pos": "Phó từ"
      },
      {
        "id": "v-213-4",
        "hanzi": "漂亮",
        "pinyin": "piàoliang",
        "hanviet": "Đặc biệt",
        "meaning": "Xinh đẹp, đẹp đẽ",
        "radical": "牜 (Ngưu)",
        "example": {
          "hanzi": "她真漂亮！",
          "pinyin": "Tā zhēn piàoliang!",
          "meaning": "Cô ấy thật là xinh đẹp!"
        },
        "pos": "Phó từ / Tính từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "更",
        "hanzi": "更",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "⿻一𣲖",
        "radical": {
          "char": "曰",
          "name": "Viết",
          "strokes": 4
        },
        "meaning": "Càng, hơn nữa",
        "strokesCount": 7,
        "strokeOrderText": "Ngang -> Nhật (日) -> Phẩy dài -> Mác",
        "components": [
          "更"
        ],
        "mnemonic": "Tiếng gõ mõ sang canh giờ mới, thể hiện sự tiến triển càng lúc càng tăng.",
        "pinyin": "gèng"
      },
      {
        "char": "最",
        "hanzi": "最",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱日取",
        "radical": {
          "char": "日",
          "name": "Nhật",
          "strokes": 4
        },
        "meaning": "Nhất, tối cao",
        "strokesCount": 12,
        "strokeOrderText": "Bộ Nhật 日 (4 nét) -> Chữ Thủ 取 (8 nét)",
        "components": [
          "日",
          "取"
        ],
        "mnemonic": "Ánh mặt trời (日) soi tỏ hành động chọn lấy (取) phần tinh hoa nhất.",
        "pinyin": "zuì"
      }
    ],
    "step4_grammar": {
      "title": "Vị trí của phó từ 更 và 最 trong câu",
      "formula": "Chủ ngữ + 更 / 最 + Tính từ / Động từ chỉ cảm xúc (喜欢, 想)",
      "explanation": "Khác với tiếng Việt (Đẹp nhất -> Tiếng Trung: 最漂亮 = Nhất đẹp; Thích nhất -> 最喜欢 = Nhất thích). Phó từ luôn đứng trước từ nó bổ nghĩa.",
      "examples": [
        {
          "hanzi": "在所有中国菜里，我最喜欢吃饺子。",
          "pinyin": "Zài suǒyǒu Zhōngguó cài lǐ, wǒ zuì xǐhuan chī jiǎozi.",
          "meaning": "Trong tất cả các món ăn Trung Quốc, tôi thích ăn sủi cảo nhất."
        }
      ],
      "commonMistake": {
        "wrong": "我喜欢最饺子 ❌",
        "correct": "我最喜欢饺子 ✔️",
        "explanation": "最 luôn đứng trước động từ/tính từ."
      }
    },
    "step5_listening": {
      "situation": "Đánh giá và so sánh mức độ ẩm thực với phó từ 更 và 最",
      "context": "Hai đồng nghiệp bàn luận chọn quán ăn ngon nhất cho buổi liên hoan",
      "participants": "A: Tiểu Triệu, B: Lý Tĩnh",
      "targetGoal": "Thành thạo cách dùng phó từ mức độ 更 (càng) và 最 (nhất)",
      "usageNotes": "更 dùng để tăng cấp trong so sánh (tốt hơn nữa); 最 dùng để chỉ vị trí số một tuyệt đối.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "李静，学校附近有三家中国餐馆，你觉得哪家最好？",
          "pinyin": "Lǐ Jìng, xuéxiào fùjìn yǒu sān jiā Zhōngguó cānguǎn, nǐ juéde nǎ jiā zuì hǎo?",
          "meaning": "Lý Tĩnh, gần trường có 3 nhà hàng Trung Quốc, bạn thấy quán nào ngon nhất?"
        },
        {
          "speaker": "B",
          "hanzi": "我觉得东门那家四川菜最好吃，菜品非常丰富。",
          "pinyin": "Wǒ juéde dōngmén nà jiā Sìchuān cài zuì hǎochī, càipǐn fēicháng fēngfù.",
          "meaning": "Mình thấy quán Tứ Xuyên ở cổng phía Đông là ngon nhất, món ăn vô cùng phong phú."
        },
        {
          "speaker": "A",
          "hanzi": "西门那家北京烤鸭店怎么样？",
          "pinyin": "Xīmén nà jiā Běijīng kǎoyā diàn zěnme yàng?",
          "meaning": "Quán vịt quay Bắc Kinh ở cổng phía Tây thì thế nào?"
        },
        {
          "speaker": "B",
          "hanzi": "那家烤鸭也不错，但是价格更贵一些。东门那家最便宜也最好吃。",
          "pinyin": "Nà jiā kǎoyā yě búcuò, dànshì jiàgé gèng guì yìxiē. Dōngmén nà jiā zuì piányi yě zuì hǎochī.",
          "meaning": "Quán vịt quay đó cũng được, nhưng giá cả đắt hơn một chút. Quán cổng Đông vừa rẻ nhất lại vừa ngon nhất."
        }
      ],
      "audioText": "李静，学校附近有三家中国餐馆，你觉得哪家最好？我觉得东门那家四川菜最好吃，菜品非常丰富。西门那家北京烤鸭店怎么样？那家烤鸭也不错，但是价格更贵一些。东门那家最便宜也最好吃。",
      "question": "Vì sao Lý Tĩnh khuyên nên chọn quán ăn ở cổng phía Đông?",
      "options": [
        "Vì quán rất to",
        "Vì đồ ăn ngon nhất và giá cả cũng rẻ nhất (最便宜也最好吃)",
        "Vì có người quen làm ở đó",
        "Vì quán mở cửa thâu đêm"
      ],
      "correctIndex": 1,
      "explanation": "Lý Tĩnh nhận xét: \"东门那家最便宜也最好吃\" (Quán cổng Đông vừa rẻ nhất lại vừa ngon nhất)."
    },
    "step6_speaking": {
      "prompt": "Nói món ăn bạn thích nhất:",
      "targetSentence": "我最喜欢中国菜。",
      "targetPinyin": "Wǒ zuì xǐhuan Zhōngguó cài.",
      "targetMeaning": "Tôi thích nhất món ăn Trung Quốc.",
      "hint": "Đọc zuì xǐhuan liền mạch."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Ngày mai sẽ càng lạnh hơn",
      "words": [
        "会更冷",
        "明天"
      ],
      "correctOrder": [
        "明天",
        "会更冷"
      ],
      "explanation": "明天 + 会更冷."
    },
    "step8_quiz": [
      {
        "id": "q-213-1",
        "type": "multiple-choice",
        "question": "Cách nói 'Người bạn tốt nhất' trong tiếng Trung là:",
        "options": [
          "朋友最好",
          "最好的朋友 (zuì hǎo de péngyou)",
          "最好朋友",
          "更朋友好"
        ],
        "correctIndex": 1,
        "explanation": "Định ngữ đứng trước: 最好的朋友."
      },
      {
        "id": "q-213-2",
        "type": "multiple-choice",
        "question": "Từ '更' (gèng) mang ý nghĩa là gì?",
        "options": [
          "Kém hơn",
          "Càng / Hơn nữa",
          "Bằng nhau",
          "Không thích"
        ],
        "correctIndex": 1,
        "explanation": "更 mang nghĩa là càng, hơn nữa."
      }
    ],
    "step9_challenge": {
      "title": "Khẳng định ngôi vị số một",
      "taskDesc": "Đọc to câu: 'Đây là điều tôi yêu thích nhất trong cuộc sống'.",
      "targetPhrase": "zhè shì wǒ zuì xǐhuan de",
      "xpReward": 50,
      "badge": "Bậc Thầy Tối Thượng"
    }
  },
  {
    "id": "l-214",
    "chapterId": "ch-7",
    "levelId": "lvl-2",
    "lessonNumber": 14,
    "title": "Sức khỏe & Đi khám bệnh (生病, 感冒, 发烧, 吃药)",
    "chineseTitle": "身体健康与医院看病（感冒发烧与吃药）",
    "subtitle": "Khai báo triệu chứng sức khỏe với bác sĩ: ốm (生病), cảm cúm (感冒), sốt (发烧), uống thuốc (吃药).",
    "objective": "Trình bày được tình trạng sức khỏe không khỏe và hiểu lời dặn uống thuốc của bác sĩ.",
    "prerequisite": "Đã hoàn thành Bài 213.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng các triệu chứng bệnh thường gặp.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Sức khỏe",
      "Bệnh viện",
      "感冒",
      "发烧",
      "吃药"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Miêu tả sức khỏe: 身体 (shēntǐ - cơ thể/sức khỏe), 生病 (shēngbìng - bị ốm)",
      "summary": "Triệu chứng thông thường: 感冒 (gǎnmào - cảm cúm), 发烧 (fāshāo - phát sốt), 头疼 (tóuténg - đau đầu). Giải pháp y tế: 看医生 (khám bác sĩ), 吃药 (uống thuốc - chú ý tiếng Trung dùng động từ 吃 cho thuốc).",
      "audioDemoText": "wǒ shēntǐ bú shūfu, wǒ fāshāo le, yīsheng ràng wǒ chī yào"
    },
    "step2_vocabulary": [
      {
        "id": "v-214-1",
        "hanzi": "身体",
        "pinyin": "shēntǐ",
        "hanviet": "Sinh bệnh",
        "meaning": "Cơ thể, sức khỏe",
        "radical": "疒 (Nạch)",
        "example": {
          "hanzi": "身体健康。",
          "pinyin": "Shēntǐ jiànkāng.",
          "meaning": "Sức khỏe dồi dào."
        },
        "pos": "Cụm động từ"
      },
      {
        "id": "v-214-2",
        "hanzi": "生病",
        "pinyin": "shēngbìng",
        "hanviet": "Cảm mạo",
        "meaning": "Bị ốm, mắc bệnh",
        "radical": "心 (Tâm)",
        "example": {
          "hanzi": "他生病住院了。",
          "pinyin": "Tā shēngbìng zhùyuàn le.",
          "meaning": "Anh ấy ốm phải nhập viện rồi."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-214-3",
        "hanzi": "感冒",
        "pinyin": "gǎnmào",
        "hanviet": "Phát thiêu",
        "meaning": "Cảm cúm",
        "radical": "火 (Hỏa)",
        "example": {
          "hanzi": "我感冒了。",
          "pinyin": "Wǒ gǎnmào le.",
          "meaning": "Tôi bị cảm cúm rồi."
        },
        "pos": "Cụm động từ"
      },
      {
        "id": "v-214-4",
        "hanzi": "发烧",
        "pinyin": "fāshāo",
        "hanviet": "Dược",
        "meaning": "Sốt, phát sốt",
        "radical": "艹 (Thảo)",
        "example": {
          "hanzi": "三十八度，发烧了。",
          "pinyin": "Sānshíbā dù, fāshāo le.",
          "meaning": "38 độ, sốt rồi."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-214-5",
        "hanzi": "药",
        "pinyin": "yào",
        "hanviet": "Đầu thống",
        "meaning": "Thuốc",
        "radical": "疒 (Nạch)",
        "example": {
          "hanzi": "记得按时吃药。",
          "pinyin": "Jìde ànshí chī yào.",
          "meaning": "Nhớ uống thuốc đúng giờ."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-214-6",
        "hanzi": "舒服",
        "pinyin": "shūfu",
        "hanviet": "Y viện",
        "meaning": "Dễ chịu, thoải mái",
        "radical": "阝 (Phụ)",
        "example": {
          "hanzi": "我不舒服。",
          "pinyin": "Wǒ bù shūfu.",
          "meaning": "Tôi thấy không được khỏe."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "病",
        "hanzi": "病",
        "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸"
        },
        "ids": "⿸疒丙",
        "radical": {
          "char": "疒",
          "name": "Nạch",
          "strokes": 5
        },
        "meaning": "Bệnh tật",
        "strokesCount": 10,
        "strokeOrderText": "Chấm -> Ngang -> Phẩy -> Chấm -> Hất (疒) -> Ngang -> Phẩy -> Sổ -> Ngang gập móc -> Sổ (丙)",
        "components": [
          "疒",
          "丙"
        ],
        "mnemonic": "Người nằm trên giường bệnh (疒) người nóng hầm hập như lửa Bính (丙).",
        "pinyin": "bìng"
      },
      {
        "char": "药",
        "hanzi": "药",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱艹约",
        "radical": {
          "char": "艹",
          "name": "Thảo",
          "strokes": 3
        },
        "meaning": "Thuốc men",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Thảo 艹 (3 nét) -> Chữ Ước 约 (6 nét)",
        "components": [
          "艹",
          "约"
        ],
        "mnemonic": "Cỏ cây thảo dược (艹) được hẹn ước (约) để chữa khỏi ốm đau.",
        "pinyin": "yào"
      }
    ],
    "step4_grammar": {
      "title": "Cảnh báo dùng từ: Người Trung Quốc nói 'ĂN THUỐC' (吃药), không nói 喝药",
      "formula": "吃药 (chī yào - Uống thuốc viên/thuốc tây nói chung)",
      "explanation": "Trong tiếng Việt ta nói 'uống thuốc', nhưng trong tiếng Trung tiêu chuẩn bắt buộc dùng động từ 吃 (chī yào). Chỉ khi thuốc là thuốc nước bắc đun sôi người ta mới dùng 喝中药.",
      "examples": [
        {
          "hanzi": "医生说一天吃三次药。",
          "pinyin": "Yīshēng shuō yì tiān chī sān cì yào.",
          "meaning": "Bác sĩ nói mỗi ngày uống thuốc 3 lần."
        }
      ],
      "commonMistake": {
        "wrong": "喝药 ❌ (nghe giống uống thuốc độc)",
        "correct": "吃药 ✔️",
        "explanation": "Thuốc tây viên uống luôn dùng 吃药."
      }
    },
    "step5_listening": {
      "situation": "Khám bệnh tại bệnh viện, mô tả triệu chứng và lắng nghe đơn thuốc",
      "context": "Tại phòng khám đa khoa bệnh viện thành phố",
      "participants": "A: Bác sĩ điều trị, B: Bệnh nhân",
      "targetGoal": "Mô tả triệu chứng bệnh tật (生病, 感冒, 发烧, 头疼) và cách dùng thuốc (吃药)",
      "usageNotes": "Trong tiếng Trung, uống thuốc dùng động từ 吃 (cật): 吃药 (chī yào - ăn thuốc/uống thuốc), không dùng 喝 (uống).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你哪里不舒服？发烧了吗？",
          "pinyin": "Nǐ nǎlǐ bù shūfu? Fāshāo le ma?",
          "meaning": "Cháu khó chịu ở chỗ nào? Có bị sốt không?"
        },
        {
          "speaker": "B",
          "hanzi": "大夫，我昨天晚上开始头疼，喉咙也很痛，今天早上发烧三十八度五。",
          "pinyin": "Dàifu, wǒ zuótiān wǎnshang kāishǐ tóuténg, hóulóng yě hěn tòng, jīntiān zǎoshang fāshāo sānshíbā dù wǔ.",
          "meaning": "Bác sĩ ơi, từ tối qua cháu bắt đầu đau đầu, cổ họng cũng đau, sáng nay sốt 38 độ 5."
        },
        {
          "speaker": "A",
          "hanzi": "你这是重感冒了。我给你开一些感冒药。",
          "pinyin": "Nǐ zhè shì zhòng gǎnmào le. Wǒ gěi nǐ kāi yìxiē gǎnmàoyào.",
          "meaning": "Cháu bị cảm nặng rồi. Bác kê cho cháu một ít thuốc cảm nhé."
        },
        {
          "speaker": "B",
          "hanzi": "这种药一天吃几次？饭前吃还是饭后吃？",
          "pinyin": "Zhè zhǒng yào yì tiān chī jǐ cì? Fàn qián chī háishi fàn hòu chī?",
          "meaning": "Loại thuốc này một ngày uống mấy lần ạ? Uống trước ăn hay sau ăn?"
        },
        {
          "speaker": "A",
          "hanzi": "一天吃三次，每次两片，饭后半小时吃。",
          "pinyin": "Yì tiān chī sān cì, měi cì liǎng piàn, fàn hòu bàn xiǎoshí chī.",
          "meaning": "Một ngày uống 3 lần, mỗi lần 2 viên, uống sau bữa ăn nửa tiếng."
        }
      ],
      "audioText": "你哪里不舒服？发烧了吗？大夫，我昨天晚上开始头疼，喉咙也很痛，今天早上发烧三十八度五。你这是重感冒了。我给你开一些感冒药。这种药一天吃几次？饭前吃还是饭后吃？一天吃三次，每次两片，饭后半小时吃。",
      "question": "Bác sĩ hướng dẫn bệnh nhân liều lượng và cách uống thuốc như thế nào?",
      "options": [
        "Ngày uống 1 lần trước khi đi ngủ",
        "Ngày uống 3 lần, mỗi lần 2 viên sau ăn nửa tiếng (一天吃三次)",
        "Uống lúc nào thấy đau đầu",
        "Không cần uống thuốc"
      ],
      "correctIndex": 1,
      "explanation": "Bác sĩ hướng dẫn cụ thể: \"一天吃三次，每次两片，饭后半小时吃\"."
    },
    "step6_speaking": {
      "prompt": "Nói tình trạng bạn bị cảm sốt với bác sĩ:",
      "targetSentence": "我感冒发烧了。",
      "targetPinyin": "Wǒ gǎnmào fāshāo le.",
      "targetMeaning": "Tôi bị cảm sốt rồi.",
      "hint": "Đọc gǎnmào thanh 3 và 4, fāshāo thanh 1."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Nhớ uống thuốc đúng giờ",
      "words": [
        "吃药",
        "按时",
        "记得"
      ],
      "correctOrder": [
        "记得",
        "按时",
        "吃药"
      ],
      "explanation": "记得 + 按时 + 吃药."
    },
    "step8_quiz": [
      {
        "id": "q-214-1",
        "type": "multiple-choice",
        "question": "Từ tiếng Trung chuẩn xác để nói 'uống thuốc' là:",
        "options": [
          "喝药",
          "吃药 (chī yào)",
          "买药",
          "看药"
        ],
        "correctIndex": 1,
        "explanation": "Tiếng Trung dùng động từ 吃 cho thuốc: 吃药."
      },
      {
        "id": "q-214-2",
        "type": "multiple-choice",
        "question": "Cụm '不舒服' (bù shūfu) dùng để biểu thị:",
        "options": [
          "Rất khỏe mạnh",
          "Không thoải mái / Trong người không khỏe",
          "Rất vui vẻ",
          "Rất đói bụng"
        ],
        "correctIndex": 1,
        "explanation": "Không khỏe trong người là 不舒服."
      }
    ],
    "step9_challenge": {
      "title": "Bệnh án tự thuật",
      "taskDesc": "Đọc to câu miêu tả: 'Hôm nay tôi thấy không được khỏe, bị cảm sốt nên phải đi khám bác sĩ'.",
      "targetPhrase": "wǒ jīntiān bù shūfu gǎnmào fāshāo le",
      "xpReward": 50,
      "badge": "Tự Chăm Sóc Bản Thân"
    }
  },
  {
    "id": "l-215",
    "chapterId": "ch-7",
    "levelId": "lvl-2",
    "lessonNumber": 15,
    "title": "Xin nghỉ phép & Lời khuyên ân cần (请假, 休息, 多喝水)",
    "chineseTitle": "请假条与健康叮嘱（请假与多喝水）",
    "subtitle": "Kỹ năng xin nghỉ học/nghỉ làm với 请假 (qǐngjià), lời khuyên nghỉ ngơi (休息) và uống nhiều nước ấm.",
    "objective": "Viết được tin nhắn hoặc nói lời xin phép nghỉ ốm lịch sự với giáo viên/sếp.",
    "prerequisite": "Đã hoàn thành Bài 214.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói trọn vẹn câu xin nghỉ phép.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Xin nghỉ phép",
      "请假",
      "休息",
      "多喝水"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Mẫu câu xin nghỉ phép: 老师/经理，我想请假 (Lǎoshī/Jīnglǐ, wǒ xiǎng qǐngjià)",
      "summary": "请假 (qǐngjià) là xin nghỉ phép. 休息 (xiūxi) là nghỉ ngơi. Cấu trúc khuyên nhủ: 多 + Động từ (多喝水 - Uống nhiều nước, 多休息 - Nghỉ ngơi nhiều).",
      "audioDemoText": "lǎoshī wǒ shēngbìng le xiǎng qǐngjià yì tiān, nǐ hǎohao xiūxi duō hē shuǐ"
    },
    "step2_vocabulary": [
      {
        "id": "v-215-1",
        "hanzi": "请假",
        "pinyin": "qǐngjià",
        "hanviet": "Thỉnh giả",
        "meaning": "Xin nghỉ phép",
        "radical": "讠 (Ngôn)",
        "example": {
          "hanzi": "我想请假两天。",
          "pinyin": "Wǒ xiǎng qǐngjià liǎng tiān.",
          "meaning": "Tôi muốn xin nghỉ phép 2 ngày."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-215-2",
        "hanzi": "休息",
        "pinyin": "xiūxi",
        "hanviet": "Hưu tức",
        "meaning": "Nghỉ ngơi",
        "radical": "亻 (Nhân đứng)",
        "example": {
          "hanzi": "好好休息。",
          "pinyin": "Hǎohāo xiūxi.",
          "meaning": "Nghỉ ngơi thật tốt nhé."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-215-3",
        "hanzi": "多",
        "pinyin": "duō",
        "hanviet": "Đa",
        "meaning": "Nhiều (làm gì nhiều hơn)",
        "radical": "夕 (Tịch)",
        "example": {
          "hanzi": "多喝热水。",
          "pinyin": "Duō hē rèshuǐ.",
          "meaning": "Uống nhiều nước ấm."
        },
        "pos": "Phó từ / Tính từ"
      },
      {
        "id": "v-215-4",
        "hanzi": "能不能",
        "pinyin": "néng bu néng",
        "hanviet": "Thủy",
        "meaning": "Có thể...hay không",
        "radical": "水 (Thủy)",
        "example": {
          "hanzi": "能不能帮我？",
          "pinyin": "Néng bu néng bāng wǒ?",
          "meaning": "Có thể giúp tôi được không?"
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "休",
        "hanzi": "休",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰亻木",
        "radical": {
          "char": "亻",
          "name": "Nhân đứng",
          "strokes": 2
        },
        "meaning": "Nghỉ ngơi",
        "strokesCount": 6,
        "strokeOrderText": "Phẩy -> Sổ (亻) -> Ngang -> Sổ -> Phẩy -> Mác (木)",
        "components": [
          "亻",
          "木"
        ],
        "mnemonic": "Người (亻) mệt mỏi tựa lưng vào gốc cây (木) nghỉ ngơi lấy lại sức.",
        "pinyin": "xiū"
      },
      {
        "char": "息",
        "hanzi": "息",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱自心",
        "radical": {
          "char": "心",
          "name": "Tâm",
          "strokes": 4
        },
        "meaning": "Hơi thở, nghỉ dưỡng",
        "strokesCount": 10,
        "strokeOrderText": "Chữ Tự 自 (6 nét) -> Bộ Tâm 心 (4 nét)",
        "components": [
          "自",
          "心"
        ],
        "mnemonic": "Chiếc mũi (自) hít thở đều đặn nuôi dưỡng trái tim (心) thanh thản.",
        "pinyin": "xī"
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc khuyên bảo làm gì nhiều hơn: 多 + Động từ + Tân ngữ",
      "formula": "多 + Động từ (多喝水 / 多吃水果 / 多休息)",
      "explanation": "Trong tiếng Trung, phó từ 多 đứng trước động từ để khuyên ai đó nên thực hiện hành động gì nhiều hơn.",
      "examples": [
        {
          "hanzi": "感冒的时候要多喝温水，多睡觉。",
          "pinyin": "Gǎnmào de shíhou yào duō hē wēnshuǐ, duō shuìjiào.",
          "meaning": "Khi bị cảm cúm cần uống nhiều nước ấm và ngủ nhiều hơn."
        }
      ],
      "commonMistake": {
        "wrong": "喝水多 ❌",
        "correct": "多喝水 ✔️",
        "explanation": "Từ 多 phải đứng trước động từ 喝."
      }
    },
    "step5_listening": {
      "situation": "Học sinh gọi điện xin phép giáo viên nghỉ học và lời dặn dò chu đáo",
      "context": "Cuộc đàm thoại qua điện thoại giữa học sinh bị ốm và cô giáo chủ nhiệm",
      "participants": "A: Học sinh Vương Bình, B: Cô giáo Trương (张老师)",
      "targetGoal": "Thành thạo cấu trúc xin nghỉ phép (请假), nghỉ ngơi (休息) và dặn dò ân cần (多喝水)",
      "usageNotes": "Xin nghỉ phép dùng cụm động tân 请假 (qǐngjià). Dặn dò làm việc gì nhiều hơn dùng 多 + Động từ (多喝水, 多休息).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "张老师，您好！我是王平。我今天身体不太好，想请假一天。",
          "pinyin": "Zhāng lǎoshī, nín hǎo! Wǒ shì Wáng Píng. Wǒ jīntiān shēntǐ bú tài hǎo, xiǎng qǐngjià yì tiān.",
          "meaning": "Cô Trương, em chào cô ạ! Em là Vương Bình. Hôm nay sức khỏe em không tốt, em muốn xin phép nghỉ 1 ngày."
        },
        {
          "speaker": "B",
          "hanzi": "王平，你怎么了？去医院看了吗？",
          "pinyin": "Wáng Píng, nǐ zěnme le? Qù yīyuàn kàn le ma?",
          "meaning": "Vương Bình, em làm sao thế? Đã đi bệnh viện khám chưa?"
        },
        {
          "speaker": "A",
          "hanzi": "我去医院看过了，医生说我是感冒，需要多卧床休息。",
          "pinyin": "Wǒ qù yīyuàn kàn guò le, yīshēng shuō wǒ shì gǎnmào, xūyào duō wòchuáng xiūxi.",
          "meaning": "Em đi khám rồi ạ, bác sĩ bảo em bị cảm, cần nằm nghỉ ngơi nhiều."
        },
        {
          "speaker": "B",
          "hanzi": "好的，你安心在宿舍休息吧。多喝热水，按时吃药，不用担心功课。",
          "pinyin": "Hǎo de, nǐ ānxīn zài sùshè xiūxi ba. Duō hē rèshuǐ, ànshí chī yào, bú yòng dānxīn gōngkè.",
          "meaning": "Được rồi, em yên tâm ở ký túc xá nghỉ ngơi nhé. Uống nhiều nước ấm, uống thuốc đúng giờ, không cần lo lắng về bài vở đâu."
        }
      ],
      "audioText": "张老师，您好！我是王平。我今天身体不太好，想请假一天。王平，你怎么了？去医院看了吗？我去医院看过了，医生说我是感冒，需要多卧床休息。好的，你安心在宿舍休息吧。多喝热水，按时吃药，不用担心功课。",
      "question": "Cô giáo Trương đã khuyên học sinh làm những việc gì để mau khỏi bệnh?",
      "options": [
        "Đến lớp thi kiểm tra",
        "Nghỉ ngơi, uống nhiều nước ấm và uống thuốc đúng giờ (多喝热水，按时吃药)",
        "Đi làm thêm ngoài giờ",
        "Không đồng ý cho nghỉ"
      ],
      "correctIndex": 1,
      "explanation": "Cô giáo dặn dò: \"你安心在宿舍休息吧。多喝热水，按时吃药，不用担心功课\"."
    },
    "step6_speaking": {
      "prompt": "Đọc câu xin phép nghỉ 1 ngày:",
      "targetSentence": "老师，我想请假一天。",
      "targetPinyin": "Lǎoshī, wǒ xiǎng qǐngjià yì tiān.",
      "targetMeaning": "Thưa thầy, em muốn xin nghỉ một ngày.",
      "hint": "Đọc qǐngjià yì tiān trang trọng, lễ phép."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Bạn hãy nghỉ ngơi thật tốt nhé",
      "words": [
        "休息",
        "好好",
        "你"
      ],
      "correctOrder": [
        "你",
        "好好",
        "休息"
      ],
      "explanation": "你 + 好好 + 休息."
    },
    "step8_quiz": [
      {
        "id": "q-215-1",
        "type": "multiple-choice",
        "question": "Từ mang nghĩa 'Xin nghỉ phép' trong tiếng Trung là:",
        "options": [
          "放假 (fàngjià)",
          "请假 (qǐngjià)",
          "休息 (xiūxi)",
          "睡觉 (shuìjiào)"
        ],
        "correctIndex": 1,
        "explanation": "Xin nghỉ phép là 请假 (qǐngjià)."
      },
      {
        "id": "q-215-2",
        "type": "multiple-choice",
        "question": "Khuyên ai đó 'uống nhiều nước', câu đúng ngữ pháp là:",
        "options": [
          "喝水多",
          "多喝水 (duō hē shuǐ)",
          "水多喝",
          "多水喝"
        ],
        "correctIndex": 1,
        "explanation": "Cấu trúc: 多 + Động từ = 多喝水."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa Boss Chapter 7",
      "taskDesc": "Vượt qua thử thách để chuẩn bị đại chiến giải quyết tình huống y tế và thời tiết!",
      "targetPhrase": "lǎoshī wǒ bù shūfu xiǎng qǐngjià yì tiān",
      "xpReward": 60,
      "badge": "Giao Tế Chu Toàn"
    }
  },
  {
    "id": "l-216",
    "chapterId": "ch-8",
    "levelId": "lvl-2",
    "lessonNumber": 16,
    "title": "Trợ từ động thái 着 diễn đạt trạng thái duy trì (门开着呢)",
    "chineseTitle": "动态助词“着”与状态持续（门开着、穿着红衣服）",
    "subtitle": "Làm chủ trợ từ 着 (zhe) biểu thị trạng thái đang tiếp diễn hoặc một tư thế được giữ nguyên.",
    "objective": "Phân biệt cách dùng trợ từ 着 và miêu tả được các trạng thái đồ vật, con người xung quanh.",
    "prerequisite": "Đã hoàn thành Module 2.3.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cấu trúc Động từ + 着.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Trợ từ 着",
      "Trạng thái duy trì",
      "Ngữ pháp HSK 2"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Trợ từ động thái 着 (zhe): Động từ + 着 + (Tân ngữ) + 呢",
      "summary": "着 biểu thị trạng thái kết quả của hành động đang được duy trì: 门开着 (Cửa đang mở), 穿戴着 (Đang mặc/đeo), 站着 (Đang đứng), 拿着 (Đang cầm trên tay). Phủ định: 没 + Động từ + 着.",
      "audioDemoText": "mén kāi zhe ne, tā chuān zhe hóngsè de yīfu, shǒu lǐ ná zhe yì běn shū"
    },
    "step2_vocabulary": [
      {
        "id": "v-216-1",
        "hanzi": "着",
        "pinyin": "zhe",
        "hanviet": "Môn",
        "meaning": "Đang (trợ từ trạng thái)",
        "radical": "门 (Môn)",
        "example": {
          "hanzi": "门开着呢。",
          "pinyin": "Mén kāi zhe ne.",
          "meaning": "Cửa đang mở đấy."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-216-2",
        "hanzi": "开",
        "pinyin": "kāi",
        "hanviet": "Khai",
        "meaning": "Mở, lái xe",
        "radical": "廾 (Củng)",
        "example": {
          "hanzi": "请开门。",
          "pinyin": "Qǐng kāi mén.",
          "meaning": "Xin mở cửa."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-216-3",
        "hanzi": "关",
        "pinyin": "guān",
        "hanviet": "Quan",
        "meaning": "Đóng, tắt",
        "radical": "八 (Bát)",
        "example": {
          "hanzi": "窗户关着。",
          "pinyin": "Chuānghu guān zhe.",
          "meaning": "Cửa sổ đang đóng."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-216-4",
        "hanzi": "拿",
        "pinyin": "ná",
        "hanviet": "Trước",
        "meaning": "Cầm, nắm, lấy",
        "radical": "目 (Mục)",
        "example": {
          "hanzi": "手里拿着手机。",
          "pinyin": "Shǒu lǐ ná zhe shǒujī.",
          "meaning": "Trong tay đang cầm điện thoại."
        },
        "pos": "Trợ từ động thái"
      },
      {
        "id": "v-216-5",
        "hanzi": "站",
        "pinyin": "zhàn",
        "hanviet": "Nã",
        "meaning": "Đứng, bến trạm",
        "radical": "手 (Thủ)",
        "example": {
          "hanzi": "外面站着一个人。",
          "pinyin": "Wàimiàn zhàn zhe yí gè rén.",
          "meaning": "Bên ngoài đang đứng một người."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "关",
        "hanzi": "关",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱丷天",
        "radical": {
          "char": "八",
          "name": "Bát",
          "strokes": 2
        },
        "meaning": "Đóng lại, cửa ải",
        "strokesCount": 6,
        "strokeOrderText": "Chấm -> Phẩy (丷) -> Ngang -> Ngang -> Phẩy -> Mác (天)",
        "components": [
          "丷",
          "天"
        ],
        "mnemonic": "Cánh cửa đóng then cài để bảo vệ bình an một góc trời (天).",
        "pinyin": "guān"
      },
      {
        "char": "拿",
        "hanzi": "拿",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱合手",
        "radical": {
          "char": "手",
          "name": "Thủ",
          "strokes": 4
        },
        "meaning": "Cầm, nắm lấy",
        "strokesCount": 10,
        "strokeOrderText": "Chữ Hợp 合 (6 nét) -> Bộ Thủ 手 (4 nét)",
        "components": [
          "合",
          "手"
        ],
        "mnemonic": "Bàn tay chụm lại (合 + 手) để cầm nắm chắc chắn đồ vật.",
        "pinyin": "ná"
      }
    ],
    "step4_grammar": {
      "title": "Phân biệt 在 + V (Hành động đang diễn ra) vs V + 着 (Trạng thái duy trì)",
      "formula": "1. Hành động đang tiến hành: 他在穿衣服 (Anh ấy đang xỏ áo vào người). 2. Trạng thái duy trì: 他穿着衣服 (Anh ấy đang mặc chiếc áo trên người).",
      "explanation": "着 nhấn mạnh vào TRẠNG THÁI tĩnh được lưu giữ sau khi hành động đã hoàn tất.",
      "examples": [
        {
          "hanzi": "前面站着的那个人是我哥哥。",
          "pinyin": "Qiánmiàn zhàn zhe de nà ge rén shì wǒ gēge.",
          "meaning": "Người đang đứng ở phía trước kia là anh trai tôi."
        }
      ],
      "commonMistake": {
        "wrong": "门不开展 ❌",
        "correct": "门没开着 ✔️",
        "explanation": "Phủ định của trạng thái 着 dùng 没 (không dùng 不)."
      }
    },
    "step5_listening": {
      "situation": "Miêu tả trạng thái duy trì của sự vật và trang phục với trợ từ 着",
      "context": "Hẹn gặp bạn bè tại quán cà phê và miêu tả đặc điểm nhận diện",
      "participants": "A: Người bạn đến sau, B: Người bạn đang ngồi đợi",
      "targetGoal": "Thành thạo trợ từ động thái 着 (zhe) biểu thị trạng thái đang duy trì: 门开着, 穿着, 拿着",
      "usageNotes": "Động từ + 着 biểu thị trạng thái đang tiếp diễn, kéo dài của hành động/tư thế: 坐着 (đang ngồi), 拿着 (đang cầm trên tay).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "小美，你在咖啡馆哪里？我没看见你。",
          "pinyin": "Xiǎoměi, nǐ zài kāfēiguǎn nǎlǐ? Wǒ méi kànjiàn nǐ.",
          "meaning": "Tiểu Mỹ, bạn ở chỗ nào trong quán cà phê? Mình chưa nhìn thấy bạn."
        },
        {
          "speaker": "B",
          "hanzi": "我在二楼窗户旁边坐着呢。门开着，你一上来就能看见。",
          "pinyin": "Wǒ zài èrlóu chuānghu pángbiān zuòzhe ne. Mén kāizhe, nǐ yí shànglái jiù néng kànjiàn.",
          "meaning": "Mình đang ngồi ở cạnh cửa sổ tầng 2 này. Cửa đang mở, bạn vừa bước lên là thấy ngay."
        },
        {
          "speaker": "A",
          "hanzi": "二楼人挺多的，你今天穿着什么颜色的衣服？",
          "pinyin": "Èrlóu rén tǐng duō de, nǐ jīntiān chuānzhe shénme yánsè de yīfu?",
          "meaning": "Tầng 2 đông người lắm, hôm nay bạn mặc áo màu gì thế?"
        },
        {
          "speaker": "B",
          "hanzi": "我穿着一件白色的毛衣，手里拿着一本汉语书。",
          "pinyin": "Wǒ chuānzhe yí jiàn báisè de máoyī, shǒulǐ názhe yì běn Hànyǔ shū.",
          "meaning": "Mình đang mặc một chiếc áo len màu trắng, trên tay đang cầm một cuốn sách tiếng Trung."
        }
      ],
      "audioText": "小美，你在咖啡馆哪里？我没看见你。我在二楼窗户旁边坐着呢。门开着，你一上来就能看见。二楼人挺多的，你今天穿着什么颜色的衣服？我穿着一件白色的毛衣，手里拿着一本汉语书。",
      "question": "Tiểu Mỹ đang mang những đặc điểm nhận diện nào?",
      "options": [
        "Mặc áo đen đeo khẩu trang",
        "Mặc áo len trắng và tay cầm cuốn sách tiếng Trung (穿着白毛衣，手里拿着书)",
        "Đang đứng đợi ngoài cửa",
        "Đang uống nước cam"
      ],
      "correctIndex": 1,
      "explanation": "Tiểu Mỹ nói: \"我穿着一件白色的毛衣，手里拿着一本汉语书\"."
    },
    "step6_speaking": {
      "prompt": "Đọc câu miêu tả cửa đang mở:",
      "targetSentence": "门开着呢。",
      "targetPinyin": "Mén kāi zhe ne.",
      "targetMeaning": "Cửa đang mở đấy.",
      "hint": "Đọc zhe ne là thanh nhẹ lướt êm."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Anh ấy đang cầm một quyển sách",
      "words": [
        "一本书",
        "他拿着"
      ],
      "correctOrder": [
        "他拿着",
        "一本书"
      ],
      "explanation": "他拿着 + 一本书."
    },
    "step8_quiz": [
      {
        "id": "q-216-1",
        "type": "multiple-choice",
        "question": "Trợ từ '着' trong câu '门开着呢' biểu thị điều gì?",
        "options": [
          "Hành động đã qua",
          "Trạng thái đang được duy trì",
          "Nguyện vọng tương lai",
          "So sánh"
        ],
        "correctIndex": 1,
        "explanation": "着 biểu thị trạng thái kết quả đang duy trì."
      },
      {
        "id": "q-216-2",
        "type": "multiple-choice",
        "question": "Phủ định đúng của '他穿着红衣服' là:",
        "options": [
          "他不穿着红衣服",
          "他没穿着红衣服",
          "他穿没着红衣服",
          "他红衣服不穿"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định của V+着 là 没 + V + 着."
      }
    ],
    "step9_challenge": {
      "title": "Bức tranh chuyển động",
      "taskDesc": "Đọc to câu miêu tả: 'Người đang đứng đằng kia đang mặc chiếc áo màu đỏ'.",
      "targetPhrase": "nà ge rén chuān zhe hóngsè de yīfu",
      "xpReward": 50,
      "badge": "Quan Sát Tinh Tường"
    }
  },
  {
    "id": "l-217",
    "chapterId": "ch-8",
    "levelId": "lvl-2",
    "lessonNumber": 17,
    "title": "Trợ từ động thái 过 diễn đạt trải nghiệm quá khứ (我去过北京)",
    "chineseTitle": "动态助词“过”与人生经历（去过、吃过、没做过）",
    "subtitle": "Diễn đạt 'từng làm gì' trong đời với 过 (guo) và phủ định 'chưa từng' với 没...过.",
    "objective": "Hỏi và chia sẻ các trải nghiệm du lịch, ẩm thực, cuộc sống mà bạn từng làm trong quá khứ.",
    "prerequisite": "Đã hoàn thành Bài 216.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng các trải nghiệm cá nhân với 过.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Trợ từ 过",
      "Trải nghiệm quá khứ",
      "我去过北京"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Trợ từ động thái 过 (guo - Đã từng): Động từ + 过 + Tân ngữ",
      "summary": "过 nhấn mạnh vào KINH NGHIỆM / TRẢI NGHIỆM đã từng xảy ra trong quá khứ. Phủ định bắt buộc là: 没 + Động từ + 过 (Chưa từng). Tuyệt đối KHÔNG dùng 不 + Động từ + 过.",
      "audioDemoText": "wǒ qù guo běijīng, wǒ chī guo kǎoyā, wǒ méi xué guo fǎyǔ"
    },
    "step2_vocabulary": [
      {
        "id": "v-217-1",
        "hanzi": "过",
        "pinyin": "guo",
        "hanviet": "Quá",
        "meaning": "Đã từng (trợ từ kinh nghiệm)",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "你去过中国吗？",
          "pinyin": "Nǐ qù guo Zhōngguó ma?",
          "meaning": "Bạn từng đi Trung Quốc chưa?"
        },
        "pos": "Trợ từ động thái"
      },
      {
        "id": "v-217-2",
        "hanzi": "次",
        "pinyin": "cì",
        "hanviet": "Thứ",
        "meaning": "Lần (lượng từ số lần)",
        "radical": "欠 (Khiếm)",
        "example": {
          "hanzi": "我去过两次。",
          "pinyin": "Wǒ qù guo liǎng cì.",
          "meaning": "Tôi từng đi 2 lần rồi."
        },
        "pos": "Lượng từ"
      },
      {
        "id": "v-217-3",
        "hanzi": "以前",
        "pinyin": "yǐqián",
        "hanviet": "Khứ quá",
        "meaning": "Trước đây, trước kia",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "以前我没吃过。",
          "pinyin": "Yǐqián wǒ méi chī guo.",
          "meaning": "Trước đây tôi chưa từng ăn."
        },
        "pos": "Cụm động từ"
      },
      {
        "id": "v-217-4",
        "hanzi": "电影",
        "pinyin": "diànyǐng",
        "hanviet": "Cật quá",
        "meaning": "Bộ phim",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "我看过这部电影。",
          "pinyin": "Wǒ kàn guo zhè bù diànyǐng.",
          "meaning": "Tôi đã từng xem bộ phim này."
        },
        "pos": "Cụm động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "过",
        "hanzi": "过",
        "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿺"
        },
        "ids": "⿺辶寸",
        "radical": {
          "char": "辶",
          "name": "Sước",
          "strokes": 3
        },
        "meaning": "Đi qua, đã từng",
        "strokesCount": 6,
        "strokeOrderText": "Ngang -> Sổ móc -> Chấm (寸) -> Chấm -> Ngang gập cong -> Mác dài (辶)",
        "components": [
          "辶",
          "寸"
        ],
        "mnemonic": "Bước chân (辶) đi qua từng tấc (寸) đường đã từng trải nghiệm.",
        "pinyin": "guò"
      },
      {
        "char": "次",
        "hanzi": "次",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰冫欠",
        "radical": {
          "char": "欠",
          "name": "Khiếm",
          "strokes": 4
        },
        "meaning": "Số lần, lượt",
        "strokesCount": 6,
        "strokeOrderText": "Chấm -> Hất (冫) -> Phẩy -> Ngang móc -> Phẩy -> Mác (欠)",
        "components": [
          "冫",
          "欠"
        ],
        "mnemonic": "Giọt băng (冫) tan rồi thở phào (欠), lần lượt từng trải nghiệm trôi qua.",
        "pinyin": "cì"
      }
    ],
    "step4_grammar": {
      "title": "Phân biệt 了 (Hành động đã hoàn thành) vs 过 (Trải nghiệm từng làm qua)",
      "formula": "1. Khẳng định: S + V + 过 + O. 2. Phủ định: S + 没(有) + V + 过 + O. 3. Nghi vấn: S + V + 过 + O + 没有 / 吗？",
      "explanation": "Câu chữ 了 nhấn mạnh sự việc ĐÃ XONG (Ví dụ: 我吃了饭 - Tôi ăn cơm xong rồi). Còn 过 nhấn mạnh vào KINH NGHIỆM ĐỜI NGƯỜI (Ví dụ: 我吃过烤鸭 - Tôi từng ăn vịt quay rồi).",
      "examples": [
        {
          "hanzi": "我以前没去过北京，这是第一次。",
          "pinyin": "Wǒ yǐqián méi qù guo Běijīng, zhè shì dì yī cì.",
          "meaning": "Trước đây tôi chưa từng đến Bắc Kinh, đây là lần đầu tiên."
        }
      ],
      "commonMistake": {
        "wrong": "我不去过 ❌",
        "correct": "我没去过 ✔️",
        "explanation": "Phủ định của 过 bắt buộc dùng 没(有)."
      }
    },
    "step5_listening": {
      "situation": "Trao đổi về trải nghiệm du lịch và văn hóa với trợ từ động thái 过",
      "context": "Giờ giải lao giao lưu giữa các sinh viên quốc tế",
      "participants": "A: Sinh viên Việt Nam, B: Du học sinh Trung Quốc",
      "targetGoal": "Thành thạo trợ từ động thái 过 (guo) diễn đạt kinh nghiệm từng trải qua trong quá khứ",
      "usageNotes": "Cấu trúc: Động từ + 过 + (Tân ngữ): 去过 (từng đi), 吃过 (từng ăn), 看过 (từng xem). Phủ định dùng 没 + Động từ + 过.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "李明，你去过中国哪些城市旅游？",
          "pinyin": "Lǐ Míng, nǐ qù guò Zhōngguó nǎxiē chéngshì lǚyóu?",
          "meaning": "Lý Minh, bạn từng đi du lịch những thành phố nào ở Trung Quốc rồi?"
        },
        {
          "speaker": "B",
          "hanzi": "我去过北京、上海和西安。你呢？",
          "pinyin": "Wǒ qù guò Běijīng, Shànghǎi hé Xī’ān. Nǐ ne?",
          "meaning": "Mình từng đi Bắc Kinh, Thượng Hải và Tây An. Còn bạn?"
        },
        {
          "speaker": "A",
          "hanzi": "我去年去过一次北京，还去长城看过日出。",
          "pinyin": "Wǒ qùnián qù guò yí cì Běijīng, hái qù Chángchéng kàn guò rìchū.",
          "meaning": "Năm ngoái mình từng đi Bắc Kinh một lần, còn lên Trường Thành ngắm bình minh nữa."
        },
        {
          "speaker": "B",
          "hanzi": "太棒了！那你吃过地道的北京烤鸭吗？",
          "pinyin": "Tài bàng le! Nà nǐ chī guò dìdào de Běijīng kǎoyā ma?",
          "meaning": "Tuyệt quá! Thế bạn đã từng ăn món vịt quay Bắc Kinh chính gốc chưa?"
        },
        {
          "speaker": "A",
          "hanzi": "吃过，我觉得味道非常棒！",
          "pinyin": "Chī guò, wǒ juéde wèidào fēicháng bàng!",
          "meaning": "Từng ăn rồi, mình thấy hương vị cực kỳ tuyệt vời!"
        }
      ],
      "audioText": "李明，你去过中国哪些城市旅游？我去过北京、上海和西安。你呢？我去年去过一次北京，还去长城看过日出。太棒了！那你吃过地道的北京烤鸭吗？吃过，我觉得味道非常棒！",
      "question": "Người A đã từng có những trải nghiệm gì ở Bắc Kinh?",
      "options": [
        "Từng đi Bắc Kinh 1 lần, ngắm bình minh trên Trường Thành và ăn vịt quay (去过一次北京)",
        "Chưa từng đi Trung Quốc",
        "Chỉ ở Thượng Hải 2 ngày",
        "Đi Tây An xem tượng đất nung"
      ],
      "correctIndex": 0,
      "explanation": "Người A chia sẻ đã từng đi Bắc Kinh 1 lần, lên Trường Thành ngắm bình minh và đã ăn vịt quay."
    },
    "step6_speaking": {
      "prompt": "Khẳng định bạn từng đến Bắc Kinh:",
      "targetSentence": "我去过北京。",
      "targetPinyin": "Wǒ qù guo Běijīng.",
      "targetMeaning": "Tôi đã từng đi Bắc Kinh.",
      "hint": "Đọc guo là thanh nhẹ lướt êm."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi chưa từng ăn món này",
      "words": [
        "吃过",
        "我没",
        "这个菜"
      ],
      "correctOrder": [
        "我没",
        "吃过",
        "这个菜"
      ],
      "explanation": "我没 + 吃过 + 这个菜."
    },
    "step8_quiz": [
      {
        "id": "q-217-1",
        "type": "multiple-choice",
        "question": "Để nói 'Tôi chưa từng đi Trung Quốc', câu đúng là:",
        "options": [
          "我不去过中国",
          "我没去过中国",
          "我去不中国",
          "中国我没去"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định kinh nghiệm bắt buộc dùng 没: 我没去过中国."
      },
      {
        "id": "q-217-2",
        "type": "multiple-choice",
        "question": "Từ '次' trong '我去过两次' là loại từ gì?",
        "options": [
          "Danh từ",
          "Lượng từ chỉ số lần",
          "Tính từ",
          "Phó từ"
        ],
        "correctIndex": 1,
        "explanation": "次 là động lượng từ chỉ số lần thực hiện hành động."
      }
    ],
    "step9_challenge": {
      "title": "Kho báu trải nghiệm",
      "taskDesc": "Đọc to câu chia sẻ một món ăn ngon bạn từng thưởng thức bằng tiếng Trung.",
      "targetPhrase": "wǒ chī guo běijīng kǎoyā hěn hǎochī",
      "xpReward": 50,
      "badge": "Người Giàu Trải Nghiệm"
    }
  },
  {
    "id": "l-218",
    "chapterId": "ch-8",
    "levelId": "lvl-2",
    "lessonNumber": 18,
    "title": "Cặp liên từ logic 因为...所以... & 虽然...但是...",
    "chineseTitle": "复句关联词（因为...所以...，虽然...但是...）",
    "subtitle": "Kết nối hai vế câu logic: Nguyên nhân - kết quả (Bởi vì...cho nên...) và chuyển ngoặt (Tuy rằng...nhưng mà...).",
    "objective": "Nói và viết được các câu phức logic giải thích nguyên nhân và diễn đạt quan điểm tương phản.",
    "prerequisite": "Đã hoàn thành Bài 217.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và ghép đúng các cặp liên từ logic.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Liên từ logic",
      "因为所以",
      "虽然但是",
      "Câu phức"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "2 Cặp liên từ cốt lõi HSK 2: 因为...所以... & 虽然...但是...",
      "summary": "1. Nguyên nhân - kết quả: 因为 (yīnwèi - bởi vì) ... 所以 (suǒyǐ - cho nên). 2. Chuyển ngoặt đối lập: 虽然 (suīrán - tuy rằng) ... 但是 (dànshì - nhưng mà).",
      "audioDemoText": "yīnwèi jīntiān xiàyǔ, suǒyǐ wǒ méi qù; suīrán hěn lěng, dànshì wǒ hěn kāixīn"
    },
    "step2_vocabulary": [
      {
        "id": "v-218-1",
        "hanzi": "因为",
        "pinyin": "yīnwèi",
        "hanviet": "Nhân vi",
        "meaning": "Bởi vì, vì",
        "radical": "囗 (Vi)",
        "example": {
          "hanzi": "因为下雨了。",
          "pinyin": "Yīnwèi xià yǔ le.",
          "meaning": "Bởi vì trời mưa rồi."
        },
        "pos": "Liên từ"
      },
      {
        "id": "v-218-2",
        "hanzi": "所以",
        "pinyin": "suǒyǐ",
        "hanviet": "Sở dĩ",
        "meaning": "Cho nên, vì vậy",
        "radical": "户 (Hộ)",
        "example": {
          "hanzi": "所以我在家。",
          "pinyin": "Suǒyǐ wǒ zài jiā.",
          "meaning": "Cho nên tôi ở nhà."
        },
        "pos": "Liên từ"
      },
      {
        "id": "v-218-3",
        "hanzi": "虽然",
        "pinyin": "suīrán",
        "hanviet": "Tuy nhiên",
        "meaning": "Mặc dù, tuy rằng",
        "radical": "虫 (Trùng)",
        "example": {
          "hanzi": "虽然汉语难。",
          "pinyin": "Suīrán Hànyǔ nán.",
          "meaning": "Tuy rằng tiếng Trung khó."
        },
        "pos": "Liên từ"
      },
      {
        "id": "v-218-4",
        "hanzi": "但是",
        "pinyin": "dànshì",
        "hanviet": "Đãn thị",
        "meaning": "Nhưng mà, nhưng",
        "radical": "亻 (Nhân đứng)",
        "example": {
          "hanzi": "但是很有趣。",
          "pinyin": "Dànshì hěn yǒuqù.",
          "meaning": "Nhưng mà rất thú vị."
        },
        "pos": "Liên từ"
      },
      {
        "id": "v-218-5",
        "hanzi": "还是",
        "pinyin": "háishi",
        "hanviet": "Nan",
        "meaning": "Hay là, vẫn là",
        "radical": "隹 (Chuy)",
        "example": {
          "hanzi": "喝茶还是喝咖啡？",
          "pinyin": "Hē chá háishi hē kāfēi?",
          "meaning": "Uống trà hay là uống cà phê?"
        },
        "pos": "Tính từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "因",
        "hanzi": "因",
        "structure": {
          "code": "full_enclosure",
          "name": "Toàn bao vi (全包围结构)",
          "symbol": "⿴"
        },
        "ids": "⿴囗大",
        "radical": {
          "char": "囗",
          "name": "Vi",
          "strokes": 3
        },
        "meaning": "Bởi vì, nguyên nhân",
        "strokesCount": 6,
        "strokeOrderText": "Sổ -> Ngang gập (囗) -> Ngang -> Phẩy -> Mác (大) -> Ngang đóng đáy (囗)",
        "components": [
          "囗",
          "大"
        ],
        "mnemonic": "Người lớn (大) nằm trên chiếc chiếu trong bốn bức tường (囗) là căn nguyên sinh ra mọi sự.",
        "pinyin": "yīn"
      },
      {
        "char": "但",
        "hanzi": "但",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰亻旦",
        "radical": {
          "char": "亻",
          "name": "Nhân đứng",
          "strokes": 2
        },
        "meaning": "Nhưng mà",
        "strokesCount": 7,
        "strokeOrderText": "Phẩy -> Sổ (亻) -> Nhật 日 -> Ngang dài (旦)",
        "components": [
          "亻",
          "旦"
        ],
        "mnemonic": "Người (亻) thức dậy nhìn mặt trời mọc sớm (旦), chuyển mạch nhưng mà.",
        "pinyin": "dàn"
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc ghép nối logic tiếng Trung",
      "formula": "因为 + Nguyên nhân, 所以 + Kết quả.   /   虽然 + Vế nhượng bộ, 但是 + Vế chuyển ngoặt.",
      "explanation": "Trong tiếng Trung, hai liên từ này luôn đi thành từng cặp đối ứng với nhau (khác tiếng Anh không được dùng cả because và so cùng lúc, tiếng Trung BẮT BUỘC có thể dùng cả đôi).",
      "examples": [
        {
          "hanzi": "虽然汉字有点儿难写，但是我很喜欢学。",
          "pinyin": "Suīrán hànzì yǒudiǎnr nán xiě, dànshì wǒ hěn xǐhuan xué.",
          "meaning": "Mặc dù chữ Hán hơi khó viết một chút, nhưng tôi rất thích học."
        }
      ],
      "commonMistake": {
        "wrong": "Bỏ quên chữ 但是 khi đã có 虽然",
        "correct": "Luôn dùng cặp: 虽然...但是...",
        "explanation": "Cặp liên từ đi đôi giúp văn phong mạch lạc."
      }
    },
    "step5_listening": {
      "situation": "Chia sẻ động lực và khó khăn khi học tiếng Trung với cặp liên từ logic",
      "context": "Buổi sinh hoạt câu lạc bộ Hán ngữ trường đại học",
      "participants": "A: Thành viên mới, B: Đội trưởng câu lạc bộ (học trưởng)",
      "targetGoal": "Thành thạo hai cặp liên từ quan trọng: 因为...所以... (bởi vì... cho nên...) và 虽然...但是... (mặc dù... nhưng mà...)",
      "usageNotes": "Cặp liên từ biểu thị nguyên nhân - kết quả và chuyển ngoặt ý tứ, giúp câu nói liền mạch và tự nhiên như người bản xứ.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "学长，我觉得汉字很难写，有时想放弃。",
          "pinyin": "Xuézhǎng, wǒ juéde Hànzì hěn nán xiě, yǒushí xiǎng fàngqì.",
          "meaning": "Anh ơi, em thấy chữ Hán khó viết quá, đôi lúc em muốn từ bỏ."
        },
        {
          "speaker": "B",
          "hanzi": "虽然汉字笔画比较多，但是只要掌握了部首规律，就会觉得很有趣。",
          "pinyin": "Suīrán Hànzì bǐhuà bǐjiào duō, dànshì zhǐyào zhǎngwò le bùshǒu guīlǜ, jiù huì juéde hěn yǒuqù.",
          "meaning": "Mặc dù chữ Hán nét bút tương đối nhiều, nhưng chỉ cần nắm vững quy luật bộ thủ, sẽ thấy rất thú vị."
        },
        {
          "speaker": "A",
          "hanzi": "因为我打算去中国留学，所以我一定要把汉语学好。",
          "pinyin": "Yīnwèi wǒ dǎsuàn qù Zhōngguó liúxué, suǒyǐ wǒ yídìng yào bǎ Hànyǔ xué hǎo.",
          "meaning": "Bởi vì em dự định đi Trung Quốc du học, cho nên em nhất định phải học giỏi tiếng Trung."
        },
        {
          "speaker": "B",
          "hanzi": "有明确的目标就好！我们一起努力，你一定能成功。",
          "pinyin": "Yǒu míngquè de mùbiāo jiù hǎo! Wǒmen yìqǐ nǔlì, nǐ yídìng néng chénggōng.",
          "meaning": "Có mục tiêu rõ ràng là rất tốt! Chúng ta cùng cố gắng, em nhất định sẽ thành công."
        }
      ],
      "audioText": "学长，我觉得汉字很难写，有时想放弃。虽然汉字笔画比较多，但是只要掌握了部首规律，就会觉得很有趣。因为我打算去中国留学，所以我一定要把汉语学好。有明确的目标就好！我们一起努力，你一定能成功。",
      "question": "Vì sao bạn học sinh quyết tâm nhất định phải học giỏi tiếng Trung?",
      "options": [
        "Vì bố mẹ bắt học",
        "Vì bạn ấy dự định đi Trung Quốc du học (因为打算去中国留学)",
        "Vì học cho vui",
        "Vì tiếng Trung rất dễ học"
      ],
      "correctIndex": 1,
      "explanation": "Bạn ấy khẳng định: \"因为我打算去中国留学，所以我一定要把汉语学好\"."
    },
    "step6_speaking": {
      "prompt": "Đọc câu thể hiện tinh thần học tập kiên trì:",
      "targetSentence": "虽然汉语难，但是我喜欢。",
      "targetPinyin": "Suīrán Hànyǔ nán, dànshì wǒ xǐhuan.",
      "targetMeaning": "Mặc dù tiếng Trung khó, nhưng tôi thích.",
      "hint": "Đọc nhấn giọng ở dànshì."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Bởi vì trời mưa cho nên tôi không đi",
      "words": [
        "所以我不去",
        "因为下雨"
      ],
      "correctOrder": [
        "因为下雨",
        "所以我不去"
      ],
      "explanation": "因为下雨 + 所以我不去."
    },
    "step8_quiz": [
      {
        "id": "q-218-1",
        "type": "multiple-choice",
        "question": "Cặp liên từ nào sau đây biểu thị mối quan hệ nguyên nhân - kết quả?",
        "options": [
          "虽然...但是...",
          "因为...所以... (yīnwèi...suǒyǐ...)",
          "不但...而且...",
          "如果...就..."
        ],
        "correctIndex": 1,
        "explanation": "因为...所以... là Bởi vì...cho nên..."
      },
      {
        "id": "q-218-2",
        "type": "multiple-choice",
        "question": "Trong câu hỏi lựa chọn 'Bạn uống trà hay cà phê', từ 'hay là' chuẩn là:",
        "options": [
          "还是 (háishi)",
          "或者 (huòzhě)",
          "因为",
          "所以"
        ],
        "correctIndex": 0,
        "explanation": "Câu hỏi lựa chọn dùng 还是 (háishi)."
      }
    ],
    "step9_challenge": {
      "title": "Nhà hùng biện logic",
      "taskDesc": "Đọc to câu ghép sử dụng trọn vẹn cặp liên từ 因为...所以...",
      "targetPhrase": "yīnwèi wǒ xǐhuan hànyǔ suǒyǐ wǒ nǔlì xué",
      "xpReward": 50,
      "badge": "Tư Duy Logic"
    }
  },
  {
    "id": "l-219",
    "chapterId": "ch-8",
    "levelId": "lvl-2",
    "lessonNumber": 19,
    "title": "Tổng ôn tập toàn diện hệ thống ngữ pháp HSK 2",
    "chineseTitle": "HSK 2级全真语法体系与300词总复习",
    "subtitle": "Hệ thống hóa toàn bộ 300 từ vựng và các cấu trúc câu so sánh 比, trợ từ 了/着/过, câu phức liên từ.",
    "objective": "Nắm vững toàn diện 96 điểm ngữ pháp HSK 2 và 300 từ vựng trước bài thi tổng kết.",
    "prerequisite": "Đã hoàn thành Bài 201–218.",
    "completionCriteria": "Đạt >= 80% điểm bài trắc nghiệm tổng hợp Level 2.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 2",
      "Tổng ôn tập",
      "Ngữ pháp tổng hợp",
      "Review Checkpoint"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Hệ thống 3 Trợ từ động thái cốt lõi: 了 (Hoàn thành), 着 (Duy trì), 过 (Kinh nghiệm quá khứ)",
      "summary": "1. V + 了: Hành động đã thực hiện (我买了). 2. V + 着: Trạng thái đang duy trì (门开着). 3. V + 过: Đã từng trải nghiệm trong đời (我去过). Bổ trợ thêm câu chữ 比 và các cặp liên từ.",
      "audioDemoText": "wǒ chī le fàn, mén kāi zhe, wǒ qù guo zhōngguó, jīntiān bǐ zuótiān lěng"
    },
    "step2_vocabulary": [
      {
        "id": "v-219-1",
        "hanzi": "已经",
        "pinyin": "yǐjīng",
        "hanviet": "Thính đổng",
        "meaning": "Đã, rồi",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "我已经知道了。",
          "pinyin": "Wǒ yǐjīng zhīdào le.",
          "meaning": "Tôi đã biết rồi."
        },
        "pos": "Động từ bổ ngữ kết quả"
      },
      {
        "id": "v-219-2",
        "hanzi": "特别",
        "pinyin": "tèbié",
        "hanviet": "Năng",
        "meaning": "Đặc biệt, vô cùng",
        "radical": "月 (Nguyệt)",
        "example": {
          "hanzi": "今天特别热。",
          "pinyin": "Jīntiān tèbié rè.",
          "meaning": "Hôm nay đặc biệt nóng."
        },
        "pos": "Động từ năng nguyện"
      },
      {
        "id": "v-219-3",
        "hanzi": "帮助",
        "pinyin": "bāngzhù",
        "hanviet": "Phục tập",
        "meaning": "Giúp đỡ",
        "radical": "羽 (Vũ)",
        "example": {
          "hanzi": "谢谢你的帮助。",
          "pinyin": "Xièxie nǐ de bāngzhù.",
          "meaning": "Cảm ơn sự giúp đỡ của bạn."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-219-4",
        "hanzi": "懂",
        "pinyin": "dǒng",
        "hanviet": "Bang trợ",
        "meaning": "Hiểu",
        "radical": "巾 (Cân)",
        "example": {
          "hanzi": "我听懂了。",
          "pinyin": "Wǒ tīng dǒng le.",
          "meaning": "Tôi nghe hiểu rồi."
        },
        "pos": "Động từ / Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "特",
        "hanzi": "特",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰牜寺",
        "radical": {
          "char": "牜",
          "name": "Ngưu",
          "strokes": 4
        },
        "meaning": "Đặc biệt",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Ngưu 牜 (4 nét) -> Chữ Tự 寺 (6 nét)",
        "components": [
          "牜",
          "寺"
        ],
        "mnemonic": "Con bò đực dũng mãnh (牜) trong sân chùa (寺) mang khí chất đặc biệt.",
        "pinyin": "tè"
      },
      {
        "char": "助",
        "hanzi": "助",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰且力",
        "radical": {
          "char": "力",
          "name": "Lực",
          "strokes": 2
        },
        "meaning": "Giúp đỡ, tương trợ",
        "strokesCount": 7,
        "strokeOrderText": "Chữ Thả 且 (5 nét) -> Bộ Lực 力 (2 nét)",
        "components": [
          "且",
          "力"
        ],
        "mnemonic": "Dâng vật phẩm (且) và đem hết sức lực (力) để cứu giúp người khác.",
        "pinyin": "zhù"
      }
    ],
    "step4_grammar": {
      "title": "Bảng đối sánh 3 trợ từ động thái kinh điển của tiếng Trung",
      "formula": "了 (Xong việc) vs 着 (Đang giữ trạng thái) vs 过 (Đã từng trải qua)",
      "explanation": "Nắm vững sự khác biệt giữa 3 trợ từ này giúp bạn đạt điểm tối đa các câu hỏi ngữ pháp điền từ trong kỳ thi HSK 2.",
      "examples": [
        {
          "hanzi": "我已经吃过饭了，现在正坐着休息呢。",
          "pinyin": "Wǒ yǐjīng chī guo fàn le, xiànzài zhèng zuò zhe xiūxi ne.",
          "meaning": "Tôi đã ăn cơm xong rồi, bây giờ đang ngồi nghỉ ngơi."
        }
      ],
      "commonMistake": {
        "wrong": "Nhầm lẫn giữa 过 và 了 khi kể về quá khứ.",
        "correct": "过 nhấn mạnh trải nghiệm từng làm; 了 nhấn mạnh hoàn tất sự việc.",
        "explanation": "Phân biệt bản chất ngữ nghĩa của trợ từ."
      }
    },
    "step5_listening": {
      "situation": "Đánh giá năng lực đàm thoại toàn diện và phản xạ ứng biến HSK 2",
      "context": "Phòng phỏng vấn đánh giá năng lực ngôn ngữ cuối khóa",
      "participants": "A: Giám khảo phỏng vấn, B: Thí sinh",
      "targetGoal": "Tổng hợp năng lực nghe hiểu và phản xạ câu ghép HSK 2 trong các tình huống thực tế",
      "usageNotes": "Động từ bổ ngữ kết quả 听懂 (nghe hiểu). Khi không nghe rõ có thể nói: 请您再说一遍 (Xin thầy/cô nói lại một lần).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你好！学习了三个月汉语，你觉得现在听力和口语怎么样？",
          "pinyin": "Nǐ hǎo! Xuéxí le sān gè yuè Hànyǔ, nǐ juéde xiànzài tīnglì hé kǒuyǔ zěnme yàng?",
          "meaning": "Chào em! Học được 3 tháng tiếng Trung rồi, em thấy nghe và nói hiện tại thế nào?"
        },
        {
          "speaker": "B",
          "hanzi": "老师好！我现在能听懂日常慢速对话，也能用简单的句子表达自己的想法。",
          "pinyin": "Lǎoshī hǎo! Wǒ xiànzài néng tīngdǒng rìcháng mànsù duìhuà, yě néng yòng jiǎndān de jùzi biǎodá zìjǐ de xiǎngfǎ.",
          "meaning": "Em chào thầy cô! Hiện tại em nghe hiểu được đối thoại chậm hàng ngày, và có thể dùng câu đơn giản diễn đạt ý nghĩ của mình."
        },
        {
          "speaker": "A",
          "hanzi": "如果去中国旅游或者买东西，你能自己交流吗？",
          "pinyin": "Rúguǒ qù Zhōngguó lǚyóu huòzhě mǎi dōngxi, nǐ néng zìjǐ jiāoliú ma?",
          "meaning": "Nếu đi Trung Quốc du lịch hoặc mua sắm, em có thể tự mình giao tiếp được không?"
        },
        {
          "speaker": "B",
          "hanzi": "我能自己问路、点菜和买东西，遇到不懂的生词也能请别人再说一遍。",
          "pinyin": "Wǒ néng zìjǐ wènlù, diǎncài hé mǎi dōngxi, yù dào bù dǒng de shēngcí yě néng qǐng biérén zài shuō yí biàn.",
          "meaning": "Em có thể tự mình hỏi đường, gọi món và mua sắm, gặp từ mới không hiểu cũng có thể nhờ người khác nói lại một lần."
        }
      ],
      "audioText": "你好！学习了三个月汉语，你觉得现在听力和口语怎么样？老师好！我现在能听懂日常慢速对话，也能用简单的句子表达自己的想法。如果去中国旅游或者买东西，你能自己交流吗？我能自己问路、点菜和买东西，遇到不懂的生词也能请别人再说一遍。",
      "question": "Thí sinh tự tin có thể tự làm được những việc giao tiếp thực tế nào khi sang Trung Quốc?",
      "options": [
        "Tự làm phiên dịch hội nghị lớn",
        "Tự mình hỏi đường, gọi món ăn và mua sắm (自己问路、点菜和买东西)",
        "Chưa thể tự nói chuyện được",
        "Chỉ có thể viết chữ"
      ],
      "correctIndex": 1,
      "explanation": "Thí sinh khẳng định: \"我能自己问路、点菜和买东西...\"."
    },
    "step6_speaking": {
      "prompt": "Khẳng định khả năng nghe hiểu tiếng Trung của bạn:",
      "targetSentence": "我能听懂日常对话。",
      "targetPinyin": "Wǒ néng tīng dǒng rìcháng duìhuà.",
      "targetMeaning": "Tôi có thể nghe hiểu hội thoại thường nhật.",
      "hint": "Đọc tīng dǒng thanh 1 và 3 dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi đã nghe hiểu rồi",
      "words": [
        "听懂了",
        "我已经"
      ],
      "correctOrder": [
        "我已经",
        "听懂了"
      ],
      "explanation": "我已经 + 听懂了."
    },
    "step8_quiz": [
      {
        "id": "q-219-1",
        "type": "multiple-choice",
        "question": "Điền từ thích hợp vào chỗ trống: 他手里拿 ___ 一本书。",
        "options": [
          "了",
          "着 (zhe)",
          "过",
          "在"
        ],
        "correctIndex": 1,
        "explanation": "Trạng thái cầm trên tay duy trì dùng 着: 拿着."
      },
      {
        "id": "q-219-2",
        "type": "multiple-choice",
        "question": "Tổng số từ vựng cốt lõi yêu cầu người học làm chủ khi hoàn thành HSK 2 là:",
        "options": [
          "150 từ",
          "300 từ vựng sinh hoạt",
          "600 từ",
          "1200 từ"
        ],
        "correctIndex": 1,
        "explanation": "HSK 2 tích lũy 300 từ vựng đàm thoại sinh hoạt thường nhật."
      }
    ],
    "step9_challenge": {
      "title": "Khởi động tổng duyệt HSK 2",
      "taskDesc": "Vượt qua thử thách để bước vào bài thi Checkpoint Test HSK 2 chính thức!",
      "targetPhrase": "wǒ yǐjīng dōu tīng dǒng le zhǔnbèi hǎo le",
      "xpReward": 60,
      "badge": "Sẵn Sàng Chinh Phục HSK 2"
    }
  },
  {
    "id": "l-220",
    "chapterId": "ch-8",
    "levelId": "lvl-2",
    "lessonNumber": 20,
    "title": "Checkpoint Test HSK 2 (Thi thử mô phỏng đề chuẩn CTI 35 câu)",
    "chineseTitle": "HSK 2级全真模拟考与阶段通关测试",
    "subtitle": "Đề thi sát hạch toàn diện Level 2: 35 câu hỏi chuẩn cấu trúc quốc tế CTI gồm Nghe hiểu và Đọc hiểu.",
    "objective": "Đạt chuẩn đầu ra Level 2 (HSK 2): Xử lý trôi chảy các tình huống sinh hoạt thường nhật bằng tiếng Trung.",
    "prerequisite": "Đã hoàn thành toàn bộ Bài 201–219.",
    "completionCriteria": "Đạt >= 80% điểm bài thi để nhận Chứng nhận Tốt nghiệp Level 2.",
    "durationMinutes": 35,
    "xpReward": 100,
    "tags": [
      "HSK 2",
      "Thi thử CTI",
      "Checkpoint Test",
      "Tốt nghiệp Level 2"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Cấu trúc đề thi chuẩn quốc tế HSK 2 (CTI Exam Standard)",
      "summary": "Đề thi HSK 2 gồm 2 phần: 1. Nghe hiểu (35 câu, có tranh và audio đọc 2 lần). 2. Đọc hiểu (25 câu, nối câu tương ứng, điền từ vào chỗ trống). Tất cả vẫn có Pinyin hỗ trợ.",
      "audioDemoText": "hsk èr jí kǎoshì xiànzài kāishǐ, qǐng dàjiā zhǔnbèi hǎo"
    },
    "step2_vocabulary": [
      {
        "id": "v-220-1",
        "hanzi": "成绩",
        "pinyin": "chéngjì",
        "hanviet": "Khảo thí",
        "meaning": "Thành tích, điểm số",
        "radical": "耂 (Lão)",
        "example": {
          "hanzi": "考试成绩很好。",
          "pinyin": "Kǎoshì chéngjì hěn hǎo.",
          "meaning": "Điểm thi rất tốt."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-220-2",
        "hanzi": "通过",
        "pinyin": "tōngguò",
        "hanviet": "Thông quá",
        "meaning": "Đậu, vượt qua bài thi",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "通过考试了！",
          "pinyin": "Tōngguò kǎoshì le!",
          "meaning": "Thi đậu rồi!"
        },
        "pos": "Động từ"
      },
      {
        "id": "v-220-3",
        "hanzi": "祝贺",
        "pinyin": "zhùhè",
        "hanviet": "Chuẩn bị",
        "meaning": "Chúc mừng",
        "radical": "冫 (Băng)",
        "example": {
          "hanzi": "祝贺你！",
          "pinyin": "Zhùhè nǐ!",
          "meaning": "Chúc mừng bạn nhé!"
        },
        "pos": "Động từ"
      },
      {
        "id": "v-220-4",
        "hanzi": "希望",
        "pinyin": "xīwàng",
        "hanviet": "Chúc hạ",
        "meaning": "Hy vọng, mong muốn",
        "radical": "贝 (Bối)",
        "example": {
          "hanzi": "希望你能成功。",
          "pinyin": "Xīwàng nǐ néng chénggōng.",
          "meaning": "Hy vọng bạn có thể thành công."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "通",
        "hanzi": "通",
        "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿺"
        },
        "ids": "⿺辶甬",
        "radical": {
          "char": "辶",
          "name": "Sước",
          "strokes": 3
        },
        "meaning": "Thông suốt, vượt qua",
        "strokesCount": 10,
        "strokeOrderText": "Chữ Dũng 甬 (7 nét) -> Bộ Sước 辶 (3 nét)",
        "components": [
          "辶",
          "甬"
        ],
        "mnemonic": "Bước chân (辶) đi xuyên qua lòng chuông rỗng (甬) hanh thông vạn dặm.",
        "pinyin": "tōng"
      },
      {
        "char": "贺",
        "hanzi": "贺",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱加贝",
        "radical": {
          "char": "贝",
          "name": "Bối",
          "strokes": 4
        },
        "meaning": "Chúc mừng",
        "strokesCount": 9,
        "strokeOrderText": "Chữ Gia 加 (5 nét) -> Bộ Bối 贝 (4 nét)",
        "components": [
          "加",
          "贝"
        ],
        "mnemonic": "Gia thêm lời chúc tụng (加) cùng bảo vật tiền của (贝) để chúc mừng ngày vui.",
        "pinyin": "hè"
      }
    ],
    "step4_grammar": {
      "title": "Bí kíp phân bổ thời gian bài thi HSK 2",
      "formula": "Nghe hiểu: Đọc trước câu hỏi 15 giây. Đọc hiểu: Tập trung vào từ khóa ngữ pháp (比, 着, 过, 因为, 离).",
      "explanation": "Đọc hiểu HSK 2 yêu cầu tốc độ đọc nhanh hơn HSK 1. Tìm nhanh các từ chỉ thời gian, địa điểm và đại từ liên kết để chọn đáp án chuẩn xác.",
      "examples": [
        {
          "hanzi": "祝贺你顺利通过HSK 2级考试！",
          "pinyin": "Zhùhè nǐ shùnlì tōngguò HSK èr jí kǎoshì!",
          "meaning": "Chúc mừng bạn đã thuận lợi vượt qua kỳ thi HSK 2!"
        }
      ],
      "commonMistake": {
        "wrong": "Đọc dịch từng chữ sang tiếng Việt mất thời gian.",
        "correct": "Nhìn lướt bắt cụm từ cố định để khoanh đáp án.",
        "explanation": "Chiến thuật làm bài khảo thí đạt điểm cao."
      }
    },
    "step5_listening": {
      "situation": "Nhận kết quả thi đỗ HSK 2 và xác lập mục tiêu chinh phục HSK 3",
      "context": "Văn phòng bộ môn tiếng Trung sau khi công bố kết quả kỳ thi chuẩn hóa",
      "participants": "A: Cố vấn học tập, B: Học viên đạt thành tích xuất sắc",
      "targetGoal": "Tổng kết chứng chỉ HSK 2 và định hướng lộ trình học tập nâng cao lên HSK 3",
      "usageNotes": "祝贺 (zhùhè - chúc mừng). Cấu trúc 争取...内 (tranh thủ / phấn đấu trong khoảng thời gian...): 争取半年内.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "恭喜你通过了HSK 2级考试，成绩非常优秀！",
          "pinyin": "Gōngxǐ nǐ tōngguò le HSK èr jí kǎoshì, chéngjì fēicháng yōuxiù!",
          "meaning": "Chúc mừng em đã vượt qua kỳ thi HSK 2, thành tích rất xuất sắc!"
        },
        {
          "speaker": "B",
          "hanzi": "谢谢老师！感谢老师这段时间的耐心指导和帮助。",
          "pinyin": "Xièxie lǎoshī! Gǎnxiè lǎoshī zhè duàn shíjiān de nàixīn zhǐdǎo hé bāngzhù.",
          "meaning": "Em cảm ơn cô ạ! Cảm ơn cô suốt thời gian qua đã kiên nhẫn chỉ dẫn và giúp đỡ em."
        },
        {
          "speaker": "A",
          "hanzi": "接下来你有什么学习计划？打算继续考HSK 3级吗？",
          "pinyin": "Jiēxiàlái nǐ yǒu shénme xuéxí jìhuà? Dǎsuàn jìxù kǎo HSK sān jí ma?",
          "meaning": "Tiếp theo em có kế hoạch học tập gì? Có dự định thi tiếp HSK 3 không?"
        },
        {
          "speaker": "B",
          "hanzi": "是的，我准备每天背十个新词，多练习长句子，争取半年内通过HSK 3级！",
          "pinyin": "Shì de, wǒ zhǔnbèi měitiān bèi shí gè xīn cí, duō liànxí cháng jùzi, zhēngqǔ bàn nián nèi tōngguò HSK sān jí!",
          "meaning": "Vâng ạ, em chuẩn bị mỗi ngày học thuộc 10 từ mới, luyện tập nhiều câu dài hơn, phấn đấu trong nửa năm vượt qua HSK 3!"
        }
      ],
      "audioText": "恭喜你通过了HSK 2级考试，成绩非常优秀！谢谢老师！感谢老师这段时间的耐心指导和帮助。接下来你有什么学习计划？打算继续考HSK 3级吗？是的，我准备每天背十个新词，多练习长句子，争取半年内通过HSK 3级！",
      "question": "Học viên đặt ra kế hoạch học tập cụ thể nào tiếp theo?",
      "options": [
        "Nghỉ học tiếng Trung",
        "Mỗi ngày học 10 từ mới, luyện câu dài để thi đỗ HSK 3 trong vòng nửa năm (争取半年内通过HSK 3级)",
        "Đi làm ngay",
        "Chỉ học ngữ pháp"
      ],
      "correctIndex": 1,
      "explanation": "Học viên nêu rõ: \"我准备每天背十个新词，多练习长句子，争取半年内通过HSK 3级\"."
    },
    "step6_speaking": {
      "prompt": "Khẳng định quyết tâm vượt qua bài thi:",
      "targetSentence": "我一定能通过考试！",
      "targetPinyin": "Wǒ yídìng néng tōngguò kǎoshì!",
      "targetMeaning": "Tôi nhất định có thể vượt qua kỳ thi!",
      "hint": "Đọc dõng dạc và tràn đầy tự tin."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Chúc mừng bạn thi đậu rồi",
      "words": [
        "通过考试了",
        "祝贺你"
      ],
      "correctOrder": [
        "祝贺你",
        "通过考试了"
      ],
      "explanation": "祝贺你 + 通过考试了."
    },
    "step8_quiz": [
      {
        "id": "q-220-1",
        "type": "multiple-choice",
        "question": "Câu nào sau đây kết hợp hoàn hảo các cấu trúc trọng điểm của Level 2?",
        "options": [
          "今天比昨天冷，虽然刮风，但是门关着呢",
          "今天比昨天很冷，虽然刮风所以门关着",
          "比今天昨天冷虽然但是",
          "今天昨天比冷门关"
        ],
        "correctIndex": 0,
        "explanation": "Câu chuẩn kết hợp câu chữ 比 (比昨天冷), liên từ đối lập (虽然...但是...) và trạng thái (门关着呢)."
      },
      {
        "id": "q-220-2",
        "type": "multiple-choice",
        "question": "Chúc mừng bạn đã hoàn thành Level 2! Năng lực giao tiếp của bạn đạt mức:",
        "options": [
          "Chỉ biết chào hỏi cơ bản",
          "Xử lý trôi chảy các tình huống sinh hoạt đời thường (mua sắm, gọi món, đi lại, khám bệnh)",
          "Dịch cabin hội nghị quốc tế",
          "Đọc tiểu thuyết cổ đại"
        ],
        "correctIndex": 1,
        "explanation": "Level 2 (HSK 2) khẳng định năng lực tự chủ xử lý trôi chảy mọi tình huống sinh hoạt quen thuộc."
      }
    ],
    "step9_challenge": {
      "title": "Vinh danh Tốt nghiệp HSK 2",
      "taskDesc": "Đọc to câu tuyên bố hoàn thành xuất sắc Level 2 và mở khóa Boss Đấu trường Thiên An Môn!",
      "targetPhrase": "wǒ shùnlì tōngguò le hsk èr jí kǎoshì",
      "xpReward": 100,
      "badge": "Tốt Nghiệp HSK 2 Xuất Sắc"
    }
  }
];

export default HSK_2_LESSONS;
