/**
 * =========================================================================
 * HANZI GO - HSK 5 CURRICULUM LESSONS (20 LESSONS)
 * =========================================================================
 * Tách biệt theo cơ chế Granular Chunking nhằm tối ưu dung lượng tải ban đầu.
 * Đảm bảo 100% ID bài học, ID từ vựng, âm Hán Việt và quy trình 9 bước sư phạm.
 */

export const HSK_5_LESSONS = [
  {
    "id": "l-501",
    "chapterId": "ch-17",
    "levelId": "lvl-5",
    "lessonNumber": 1,
    "title": "Tám trường phái ẩm thực Trung Hoa",
    "chineseTitle": "中国八大菜系纵览",
    "subtitle": "Khám phá lịch sử, đặc trưng địa lý và phong cách nấu nướng của 8 trường phái ẩm thực lớn.",
    "objective": "Làm chủ từ vựng ẩm thực cao cấp: 菜系, 烹饪, 风味, 特色 và liên từ 所谓……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-17"
    ],
    "step1_learn": {
      "topic": "Tám trường phái ẩm thực Trung Hoa - Trọng tâm HSK 5",
      "summary": "Khám phá lịch sử, đặc trưng địa lý và phong cách nấu nướng của 8 trường phái ẩm thực lớn.",
      "keyTakeaways": [
        "Làm chủ từ vựng ẩm thực cao cấp: 菜系, 烹饪, 风味, 特色 và liên từ 所谓……",
        "Làm chủ điểm ngữ pháp: 所谓…… (Cái gọi là... / Được định nghĩa là...)"
      ],
      "audioDemoText": "川菜以麻辣浓郁著称，而粤菜则讲究原汁原味与鲜美清淡。"
    },
    "step2_vocabulary": [
      {
        "id": "v-501-1",
        "hanzi": "菜系",
        "pinyin": "càixì",
        "hanviet": "Thái hệ",
        "meaning": "Trường phái ẩm thực, phong cách món ăn",
        "radical": "Bộ 艹",
        "example": {
          "hanzi": "中国饮食文化博大精深，有著名的八大菜系。",
          "pinyin": "Zhōngguó yǐnshí wénhuà bódà-jīngshēn, yǒu zhùmíng de bā dà càixì.",
          "meaning": "Văn hóa ẩm thực Trung Quốc sâu rộng uyên bác, có 8 trường phái ẩm thực nổi tiếng."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-501-2",
        "hanzi": "烹饪",
        "pinyin": "pēngrèn",
        "hanviet": "Phanh nhẫm",
        "meaning": "Nấu nướng, nghệ thuật chế biến ẩm thực",
        "radical": "Bộ 灬",
        "example": {
          "hanzi": "中国烹饪讲究色、香、味、形俱全。",
          "pinyin": "Zhōngguó pēngrèn jiǎngjiu sè, xiāng, wèi, xíng jùquán.",
          "meaning": "Nghệ thuật nấu ăn Trung Hoa chú trọng màu sắc, hương thơm, mùi vị và hình thức đều vẹn toàn."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-501-3",
        "hanzi": "风味",
        "pinyin": "fēngwèi",
        "hanviet": "Phong vị",
        "meaning": "Hương vị đặc trưng vùng miền",
        "radical": "Bộ 风",
        "example": {
          "hanzi": "每个地方的特色小吃都有独特的风味。",
          "pinyin": "Měi gè dìfang de tèsè xiǎochī dōu yǒu dútè de fēngwèi.",
          "meaning": "Món ăn vặt đặc sản của mỗi vùng đều mang phong vị độc đáo."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-501-4",
        "hanzi": "所谓",
        "pinyin": "suǒwèi",
        "hanviet": "Sở vị",
        "meaning": "Cái gọi là, cái được xem là",
        "radical": "Bộ 斤",
        "example": {
          "hanzi": "所谓八大菜系，包括鲁菜、川菜、粤菜等。",
          "pinyin": "Suǒwèi bā dà càixì, bāokuò Lǔcài, Chuāncài, Yuècài děng.",
          "meaning": "Cái gọi là 8 trường phái ẩm thực lớn bao gồm món Sơn Đông, món Tứ Xuyên, món Quảng Đông, v.v."
        },
        "pos": "Tính từ / Đại từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "烹",
        "hanzi": "烹",
        "pinyin": "pēng",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱亨灬",
        "radical": {
          "char": "灬",
          "name": "Hỏa",
          "strokes": 4
        },
        "meaning": "Nấu nướng, chế biến món ăn",
        "strokesCount": 11,
        "strokeOrderText": "Chữ Hanh 亨 (7 nét) -> Bộ Hỏa 灬 (4 nét chấm lửa)",
        "components": [
          "亨",
          "灬"
        ],
        "mnemonic": "Đặt vạc thức ăn lên ngọn lửa (灬) để nấu chín hanh thông (亨): nấu nướng, ẩm thực (烹饪)."
      },
      {
        "char": "系",
        "hanzi": "系",
        "pinyin": "xì",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱丿糸",
        "radical": {
          "char": "糸",
          "name": "Mịch",
          "strokes": 6
        },
        "meaning": "Hệ thống, trường phái, mối dây liên kết",
        "strokesCount": 7,
        "strokeOrderText": "Phẩy (丿) -> Bộ Mịch 糸 (6 nét)",
        "components": [
          "丿",
          "糸"
        ],
        "mnemonic": "Sợi dây tơ (糸) nối liền các đầu mối theo trật tự: trường phái, hệ thống (菜系, 体系)."
      }
    ],
    "step4_grammar": {
      "formula": "所谓…… (Cái gọi là... / Được định nghĩa là...)",
      "title": "Cấu trúc giải thích khái niệm học thuật",
      "explanation": "Dùng để dẫn dắt một định nghĩa hoặc giải thích rõ bản chất của một danh từ chuyên môn.",
      "examples": [
        {
          "hanzi": "所谓工匠精神，就是精益求精的态度。",
          "pinyin": "Suǒwèi gōngjiàng jīngshén, jiù shì jīngyìqiújīng de tàidù.",
          "meaning": "Cái gọi là tinh thần thợ thủ công chính là thái độ không ngừng hoàn thiện."
        }
      ],
      "commonMistake": {
        "wrong": "所谓是菜系。",
        "correct": "所谓的八大菜系。",
        "explanation": "Không dùng 所谓 là động từ độc lập, thường đi cùng cụm danh từ."
      }
    },
    "step5_listening": {
      "situation": "Thảo luận sâu về lịch sử hình thành và đặc trưng của Bát Đại Thái Hệ Trung Hoa",
      "context": "Buổi tọa đàm văn hóa ẩm thực tại Viện Nghiên cứu Văn hóa Đông Á",
      "participants": "A: Giáo sư Sử học Ẩm thực, B: Nghiên cứu sinh Việt Nam",
      "targetGoal": "Vận dụng cấu trúc 所谓…… (cái gọi là... / được định nghĩa là...) để định nghĩa học thuật các trường phái ẩm thực",
      "usageNotes": "\"八大菜系\" (Bát đại thái hệ) gồm Lỗ (Sơn Đông), Xuyên (Tứ Xuyên), Việt (Quảng Đông), Tô (Giang Tô), Mân (Phúc Kiến), Chiết (Chiết Giang), Tương (Hồ Nam), Huy (An Huy).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "所谓“八大菜系”，不仅代表了中国各地的地理气候差异，更是数千年烹饪技艺的文化结晶。",
          "pinyin": "Suǒwèi \"bādà càixì\", bùjǐn dàibiǎo le Zhōngguó gèdì de dìlǐ qìhòu chāyì, gèng shì shù qiān nián pēngrèn jìyì de wénhuà jiéjīng.",
          "meaning": "Cái gọi là \"Bát đại thái hệ\" không những đại diện cho sự khác biệt địa lý khí hậu của các vùng miền Trung Quốc, mà còn là kết tinh văn hóa của kỹ nghệ nấu nướng hàng ngàn năm."
        },
        {
          "speaker": "B",
          "hanzi": "教授，我在品尝鲁菜和川菜时，明显感受到了北方酱香浓郁与南方麻辣鲜香的鲜明对比。",
          "pinyin": "Jiàoshòu, wǒ zài pǐncháng Lǔcài hé Chuāncài shí, míngxiǎn gǎnshòu dào le běifāng jiàngxiāng nóngyù yǔ nánfāng málà xiānxiāng de xiānmíng duìbǐ.",
          "meaning": "Thưa Giáo sư, khi thưởng thức món Sơn Đông và Tứ Xuyên, em cảm nhận rõ rệt sự tương phản sâu sắc giữa hương tương đậm đà phương Bắc và vị cay tê tươi thơm phương Nam."
        },
        {
          "speaker": "A",
          "hanzi": "很好！饮食风味的演变正是受制于历史移民与商贸交流。所谓传统，其实一直在包容中演变。",
          "pinyin": "Hěn hǎo! Yǐnshí fēngwèi de yǎnbiàn zhèng shì shòuzhì yú lìshǐ yímín yǔ shāngmào jiāoliú. Suǒwèi chuántǒng, qíshí yìzhí zài bāoróng zhōng yǎnbiàn.",
          "meaning": "Rất giỏi! Sự diễn biến của phong vị ẩm thực vốn chịu ảnh hưởng của các dòng di dân lịch sử và giao thương. Cái gọi là truyền thống thực chất luôn biến đổi trong sự bao dung dung hợp."
        },
        {
          "speaker": "B",
          "hanzi": "这是否意味着现代烹饪在继承传统刀工与火候的同时，也在不断吸收外来食材与理念？",
          "pinyin": "Zhè shìfǒu yìwèizhe xiàndài pēngrèn zài jìchéng chuántǒng dāogōng yǔ huǒhòu de tóngshí, yě zài búduàn xīshōu wàilái shícái yǔ lǐniàn?",
          "meaning": "Điều này có phải có nghĩa là ẩm thực hiện đại khi kế thừa kỹ thuật dao thớt và canh lửa truyền thống, cũng đồng thời không ngừng hấp thu nguyên liệu và triết lý bên ngoài?"
        },
        {
          "speaker": "A",
          "hanzi": "正是如此。深入研究各大菜系的文化精髓，有助于我们更好地理解中华文明的多样性与包容性。",
          "pinyin": "Zhèng shì rúcǐ. Shēnrù yánjiū gè dà càixì de wénhuà jīngsuǐ, yǒuzhù yú wǒmen gèng hǎo de lǐjiě Zhōnghuá wénmíng de duōyàngxìng yǔ bāoróngxìng.",
          "meaning": "Chính là như vậy. Nghiên cứu sâu tinh hoa văn hóa của các trường phái ẩm thực lớn sẽ giúp chúng ta thấu hiểu sâu sắc hơn tính đa dạng và bao dung của văn minh Trung Hoa."
        }
      ],
      "audioText": "所谓“八大菜系”，不仅代表了中国各地的地理气候差异，更是数千年烹饪技艺的文化结晶。教授，我在品尝鲁菜和川菜时，明显感受到了北方酱香浓郁与南方麻辣鲜香的鲜明对比。很好！饮食风味的演变正是受制于历史移民与商贸交流。所谓传统，其实一直在包容中演变。这是否意味着现代烹饪在继承传统刀工与火候的同时，也在不断吸收外来食材与理念？正是如此。深入研究各大菜系的文化精髓，有助于我们更好地理解中华文明的多样性与包容性。",
      "question": "Theo phân tích của Giáo sư, cái gọi là truyền thống ẩm thực thực chất diễn biến như thế nào?",
      "options": [
        "Đóng kín cố định không bao giờ thay đổi",
        "Luôn dung hòa biến đổi trong sự bao dung và giao lưu văn hóa (在包容中演变)",
        "Chỉ bắt chước món ăn nước ngoài",
        "Đã hoàn toàn biến mất"
      ],
      "correctIndex": 1,
      "explanation": "Giáo sư khẳng định: \"所谓传统，其实一直在包容中演变\" (Cái gọi là truyền thống, thực chất luôn biến đổi trong sự bao dung)."
    },
    "step6_speaking": {
      "prompt": "Giới thiệu văn hóa ẩm thực:",
      "targetSentence": "中国烹饪讲究色香味形俱全。",
      "targetPinyin": "Zhōngguó pēngrèn jiǎngjiu sè xiāng wèi xíng jùquán.",
      "targetMeaning": "Nấu nướng Trung Hoa chú trọng màu sắc, hương thơm, mùi vị và hình dạng vẹn toàn.",
      "hint": "Phát âm trang trọng, ngữ điệu truyền cảm."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Cái gọi là thành công chính là nỗ lực bền bỉ'",
      "words": [
        "就是",
        "所谓的成功",
        "坚持不懈的努力"
      ],
      "correctOrder": [
        "所谓的成功",
        "就是",
        "坚持不懈的努力"
      ],
      "explanation": "Cấu trúc 所谓的... 就是..."
    },
    "step8_quiz": [
      {
        "id": "q-501-1",
        "type": "multiple-choice",
        "question": "Tám trường phái ẩm thực lớn trong tiếng Trung được gọi là gì?",
        "options": [
          "八大菜系",
          "八大名著",
          "四大发明",
          "四合院"
        ],
        "correctIndex": 0,
        "explanation": "八大菜系 là 8 trường phái ẩm thực lớn của TQ."
      },
      {
        "id": "q-501-2",
        "type": "multiple-choice",
        "question": "Điền từ: '这道菜具有浓郁的四川本地____。'",
        "options": [
          "风味",
          "附件",
          "押金",
          "房卡"
        ],
        "correctIndex": 0,
        "explanation": "Hương vị vùng miền là 风味."
      }
    ],
    "step9_challenge": {
      "title": "Thuyết trình ẩm thực",
      "taskDesc": "Giới thiệu ngắn 1 phút về một trường phái ẩm thực Trung Hoa mà bạn ấn tượng.",
      "targetPhrase": "sè xiāng wèi jùquán",
      "xpReward": 60,
      "badge": "Học Giả Ẩm Thực HSK 5"
    }
  },
  {
    "id": "l-502",
    "chapterId": "ch-17",
    "levelId": "lvl-5",
    "lessonNumber": 2,
    "title": "Vị cay tê Tứ Xuyên & Đậm đà Quảng Đông",
    "chineseTitle": "川菜麻辣与粤菜清鲜",
    "subtitle": "Phân tích sự khác biệt về gia vị, cách nêm nếm giữa vị cay nồng Tây Nam và vị thanh ngọt phương Nam.",
    "objective": "Nắm vững từ vựng khẩu vị: 麻辣, 清淡, 鲜美, 调料 và cấu trúc 与其……不如……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-17"
    ],
    "step1_learn": {
      "topic": "Vị cay tê Tứ Xuyên & Đậm đà Quảng Đông - Trọng tâm HSK 5",
      "summary": "Phân tích sự khác biệt về gia vị, cách nêm nếm giữa vị cay nồng Tây Nam và vị thanh ngọt phương Nam.",
      "keyTakeaways": [
        "Nắm vững từ vựng khẩu vị: 麻辣, 清淡, 鲜美, 调料 và cấu trúc 与其……不如……",
        "Làm chủ điểm ngữ pháp: 与其……不如…… (Thà rằng... còn hơn... / Thay vì... thì thà...)"
      ],
      "audioDemoText": "与其吃辛辣火锅，不如喝点清淡的热汤。"
    },
    "step2_vocabulary": [
      {
        "id": "v-502-1",
        "hanzi": "麻辣",
        "pinyin": "málà",
        "hanviet": "Ma lạt",
        "meaning": "Cay tê (vị cay kết hợp hoa tiêu và ớt)",
        "radical": "Bộ 麻",
        "example": {
          "hanzi": "正宗的四川火锅以麻辣鲜香闻名。",
          "pinyin": "Zhèngzōng de Sìchuān huǒguō yǐ málà xiānxiāng wénmíng.",
          "meaning": "Lẩu Tứ Xuyên chính gốc nổi tiếng bởi vị cay tê thơm nức."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-502-2",
        "hanzi": "清淡",
        "pinyin": "qīngdàn",
        "hanviet": "Thanh đạm",
        "meaning": "Thanh đạm, ít dầu mỡ gia vị",
        "radical": "Bộ 氵",
        "example": {
          "hanzi": "医生建议生病期间饮食尽量清淡。",
          "pinyin": "Yīshēng jiànyì shēngbìng qījiān yǐnshí jǐnliàng qīngdàn.",
          "meaning": "Bác sĩ khuyên trong thời gian ốm ăn uống nên cố gắng thanh đạm."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-502-3",
        "hanzi": "鲜美",
        "pinyin": "xiānměi",
        "hanviet": "Tiên mỹ",
        "meaning": "Tươi ngon, ngọt thịt/hải sản",
        "radical": "Bộ 鱼",
        "example": {
          "hanzi": "广东的清蒸鲈鱼味道极其鲜美。",
          "pinyin": "Guǎngdōng de qīngzhēng lúyú wèidào jíqí xiānměi.",
          "meaning": "Món cá vược hấp xì dầu của Quảng Đông vị cực kỳ tươi ngọt."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-502-4",
        "hanzi": "调料",
        "pinyin": "tiáoliào",
        "hanviet": "Điều liệu",
        "meaning": "Gia vị nêm nếm",
        "radical": "Bộ 讠",
        "example": {
          "hanzi": "烹饪时加入适量调料可以提升风味。",
          "pinyin": "Pēngrèn shí jiārù shìliàng tiáoliào kěyǐ tíshēng fēngwèi.",
          "meaning": "Khi nấu ăn cho lượng gia vị thích hợp có thể tăng vị ngon."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "麻",
        "hanzi": "麻",
        "pinyin": "má",
        "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸"
        },
        "ids": "⿸广𣏟",
        "radical": {
          "char": "广",
          "name": "Quảng",
          "strokes": 3
        },
        "meaning": "Cây gai, tê rần, cay tê Tứ Xuyên",
        "strokesCount": 11,
        "strokeOrderText": "Chấm -> Ngang -> Phẩy (广) -> Hai bộ Mộc 木 bên trong",
        "components": [
          "广",
          "木"
        ],
        "mnemonic": "Phơi những bó cây gai dưới mái hiên nhà (广): vị cay tê râm ran như chạm vào sợi gai (麻辣)."
      },
      {
        "char": "鲜",
        "hanzi": "鲜",
        "pinyin": "xiān",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰鱼羊",
        "radical": {
          "char": "鱼",
          "name": "Ngư",
          "strokes": 8
        },
        "meaning": "Tươi mới, ngọt thịt, thơm tho",
        "strokesCount": 14,
        "strokeOrderText": "Bộ Ngư 鱼 (8 nét) -> Chữ Dương 羊 (6 nét)",
        "components": [
          "鱼",
          "羊"
        ],
        "mnemonic": "Món cá tươi (鱼) hầm cùng thịt cừu non (羊) tạo nên vị ngọt thanh tao tuyệt hảo: tươi ngon (鲜美)."
      }
    ],
    "step4_grammar": {
      "formula": "与其……不如…… (Thà rằng... còn hơn... / Thay vì... thì thà...)",
      "title": "Cấu trúc liên từ lựa chọn từ bỏ",
      "explanation": "Biểu thị việc so sánh giữa hai phương án, dứt khoát chọn phương án sau và bỏ phương án trước.",
      "examples": [
        {
          "hanzi": "与其在家里睡懒觉，不如去公园散步散心。",
          "pinyin": "Yǔqí zài jiālǐ shuìlǎnjiào, bùrú qù gōngyuán sànbù sànxīn.",
          "meaning": "Thay vì ở nhà ngủ nướng, thà rằng đi dạo công viên thư giãn."
        }
      ],
      "commonMistake": {
        "wrong": "不如在家里，与其出去。",
        "correct": "与其在家里，不如出去。",
        "explanation": "Vế 与其 luôn đứng trước vế 不如."
      }
    },
    "step5_listening": {
      "situation": "Tranh luận về triết lý gia vị: vị cay tê nồng nàn Tứ Xuyên đối lập vị thanh đạm giữ trọn tươi ngon Quảng Đông",
      "context": "Cuộc trò chuyện giữa hai đầu bếp chuyên nghiệp tại triển lãm ẩm thực Á Châu",
      "participants": "A: Đầu bếp Thành Đô (Tứ Xuyên), B: Bếp trưởng Quảng Châu (Việt Thái)",
      "targetGoal": "Vận dụng cấu trúc so sánh lựa chọn 与其……不如…… (thà rằng... còn hơn... / thay vì... thì thà...)",
      "usageNotes": "\"麻辣\" (cay tê của hoa tiêu Tứ Xuyên) và \"清淡鲜美\" (thanh đạm tươi ngọt của Quảng Đông) đại diện cho hai thái cực triết học ẩm thực: nồng nhiệt vs nguyên bản.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "四川菜讲究“一菜一格，百菜百味”，与其追求清淡，不如用精妙的麻辣调料激发食材的层次感！",
          "pinyin": "Sìchuān cài jiǎngjiu \"yí cài yì gé, bǎi cài bǎi wèi\", yǔqí zhuīqiú qīngdàn, bùrú yòng jīngmiào de málà tiáoliào jīfā shícái de céngcìgǎn!",
          "meaning": "Món Tứ Xuyên coi trọng \"mỗi món một vẻ, trăm món trăm vị\", thay vì theo đuổi sự thanh đạm, thà rằng dùng gia vị cay tê tinh tế để đánh thức tầng bậc của nguyên liệu!"
        },
        {
          "speaker": "B",
          "hanzi": "但粤菜更注重“食在广州，原汁原味”，过度使用重调料，反而会掩盖海鲜本身的鲜美滋味。",
          "pinyin": "Dàn Yuècài gèng zhùzhòng \"shí zài Guǎngzhōu, yuánzhīyuánwèi\", guòdù shǐyòng zhòng tiáoliào, fǎn'ér huì yǎngài hǎixiān běnshēn de xiānměi zīwèi.",
          "meaning": "Nhưng món Quảng Đông lại chú trọng \"ẩm thực tại Quảng Châu, vị ngọt nguyên bản\", việc lạm dụng gia vị nồng ngược lại sẽ che lấp đi vị tươi ngon tự nhiên vốn có của hải sản."
        },
        {
          "speaker": "A",
          "hanzi": "其实真正的川菜并不只是辣，花椒与豆瓣酱的配比更是调味艺术的至高境界。",
          "pinyin": "Qíshí zhēnzhèng de Chuāncài bìng bù zhǐshì là, huājiāo yǔ dòubànjiàng de pèibǐ gèng shì tiáowèi yìshù de zhìgāo jìngjiè.",
          "meaning": "Thực ra món Tứ Xuyên chân chính không hề đơn thuần là cay, tỷ lệ phối hợp giữa hoa tiêu và tương đậu bản mới là cảnh giới tối cao của nghệ thuật nêm nếm."
        },
        {
          "speaker": "B",
          "hanzi": "与其争论谁优谁劣，不如各取所长，在保留清鲜口感的同时融入复合香气，创造新融合菜。",
          "pinyin": "Yǔqí zhēnglùn shuí yōu shuí liè, bùrú gè qǔ suǒ cháng, zài bǎoliú qīngxiān kǒugǎn de tóngshí róngrù fùhé xiāngqì, chuàngzào xīn rónghé cài.",
          "meaning": "Thay vì tranh cãi trường phái nào hơn kém, thà rằng chắt lọc ưu điểm của nhau, vừa giữ được vị ngọt thanh vừa hòa quyện hương thơm phức hợp, sáng tạo nên món dung hợp mới."
        },
        {
          "speaker": "A",
          "hanzi": "说得太好了！和而不同正是东方美食哲学的魅力所在，下个月我们联合办一场鉴赏宴吧。",
          "pinyin": "Shuō de tài hǎo le! Hé ér bùtóng zhèng shì dōngfāng měishí zhéxué de mèilì suǒzài, xià gè yuè wǒmen liánhé bàn yì chǎng jiànshǎng yàn ba.",
          "meaning": "Nói hay lắm! Hòa hợp trong dị biệt chính là sức hút của triết lý ẩm thực phương Đông, tháng tới chúng ta cùng tổ chức một yến tiệc thưởng thức nhé."
        }
      ],
      "audioText": "四川菜讲究“一菜一格，百菜百味”，与其追求清淡，不如用精妙的麻辣调料激发食材的层次感！但粤菜更注重“食在广州，原汁原味”，过度使用重调料，反而会掩盖海鲜本身的鲜美滋味。其实真正的川菜并不只是辣，花椒与豆瓣酱的配比更是调味艺术的至高境界。与其争论谁优谁劣，不如各取所长，在保留清鲜口感的同时融入复合香气，创造新融合菜。说得太好了！和而不同正是东方美食哲学的魅力所在，下个月我们联合办一场鉴赏宴吧。",
      "question": "Giải pháp hài hòa được hai đầu bếp đề xuất là gì?",
      "options": [
        "Chỉ nấu món cay Tứ Xuyên và cấm món thanh đạm",
        "Chắt lọc ưu điểm của nhau để sáng tạo món ăn dung hợp (各取所长，创造新融合菜)",
        "Bỏ nghề đầu bếp",
        "Không dùng bất kỳ gia vị nào"
      ],
      "correctIndex": 1,
      "explanation": "Bếp trưởng B đề xuất giải pháp trung dung: \"与其争论谁优谁劣，不如各取所长... 创造新融合菜\" (Thay vì tranh cãi, thà chắt lọc sở trường tạo món dung hợp mới)."
    },
    "step6_speaking": {
      "prompt": "Diễn đạt khẩu vị ăn uống:",
      "targetSentence": "与其天天吃外卖，不如自己动手做饭。",
      "targetPinyin": "Yǔqí tiāntiān chī wàimài, bùrú zìjǐ dòngshǒu zuòfàn.",
      "targetMeaning": "Thay vì ngày nào cũng ăn đồ ship, thà rằng tự mình vào bếp nấu cơm.",
      "hint": "Ngắt giọng rõ ràng ở hai vế."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Thay vì phàn nàn thà hãy cố gắng hành động'",
      "words": [
        "与其",
        "不如",
        "抱怨困难",
        "努力行动"
      ],
      "correctOrder": [
        "与其",
        "抱怨困难",
        "不如",
        "努力行动"
      ],
      "explanation": "Cấu trúc 与其...不如..."
    },
    "step8_quiz": [
      {
        "id": "q-502-1",
        "type": "multiple-choice",
        "question": "Từ nào chỉ hương vị đặc trưng của ớt kết hợp với hoa tiêu trong món Tứ Xuyên?",
        "options": [
          "麻辣 (Cay tê)",
          "酸甜 (Chua ngọt)",
          "苦涩 (Đắng chát)",
          "清淡 (Thanh đạm)"
        ],
        "correctIndex": 0,
        "explanation": "麻辣 (málà) là hương vị cay tê trứ danh."
      },
      {
        "id": "q-502-2",
        "type": "multiple-choice",
        "question": "Điền từ: '与其坐着等待机会，____主动出击争取。'",
        "options": [
          "不如",
          "甚至",
          "既然",
          "虽然"
        ],
        "correctIndex": 0,
        "explanation": "Cặp từ lựa chọn: 与其……不如……"
      }
    ],
    "step9_challenge": {
      "title": "So sánh khẩu vị",
      "taskDesc": "So sánh khẩu vị ăn uống giữa miền Bắc và miền Nam Việt Nam bằng tiếng Trung.",
      "targetPhrase": "yǔqí... bùrú qīngdàn",
      "xpReward": 60,
      "badge": "Chuyên Gia Ẩm Thực"
    }
  },
  {
    "id": "l-503",
    "chapterId": "ch-17",
    "levelId": "lvl-5",
    "lessonNumber": 3,
    "title": "Nghệ thuật thưởng trà & Trà đạo",
    "chineseTitle": "中国传统茶文化与茶艺",
    "subtitle": "Văn hóa trà Trung Hoa: Lục trà, Hồng trà, Ô Long, Phổ Nhĩ và phong thái trà đạo.",
    "objective": "Làm chủ từ vựng trà nghệ: 品茶, 龙井, 普洱, 茶壶 và động từ 讲究……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-17"
    ],
    "step1_learn": {
      "topic": "Nghệ thuật thưởng trà & Trà đạo - Trọng tâm HSK 5",
      "summary": "Văn hóa trà Trung Hoa: Lục trà, Hồng trà, Ô Long, Phổ Nhĩ và phong thái trà đạo.",
      "keyTakeaways": [
        "Làm chủ từ vựng trà nghệ: 品茶, 龙井, 普洱, 茶壶 và động từ 讲究……",
        "Làm chủ điểm ngữ pháp: 讲究…… (Coi trọng / Cầu kỳ về...)"
      ],
      "audioDemoText": "因为绿茶娇嫩讲究85度水温，而普洱熟茶则需要100度沸水激发醇香。"
    },
    "step2_vocabulary": [
      {
        "id": "v-503-1",
        "hanzi": "品茶",
        "pinyin": "pǐnchá",
        "hanviet": "Phẩm trà",
        "meaning": "Thưởng thức trà, nhâm nhi trà",
        "radical": "Bộ 口",
        "example": {
          "hanzi": "品茶不仅能解渴，更能修身养性。",
          "pinyin": "Pǐnchá bùjǐn néng jiěkě, gèng néng xiūshēn-yǎngxìng.",
          "meaning": "Thưởng trà không chỉ giải khát mà còn có thể tu dưỡng tâm tính."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-503-2",
        "hanzi": "龙井",
        "pinyin": "lóngjǐng",
        "hanviet": "Long Tỉnh",
        "meaning": "Trà Long Tỉnh (Tây Hồ, Hàng Châu)",
        "radical": "Bộ 龙",
        "example": {
          "hanzi": "西湖龙井茶色泽翠绿，香气清高。",
          "pinyin": "Xīhú Lóngjǐng chá sèzé cuìlǜ, xiāngqì qīnggāo.",
          "meaning": "Trà Long Tỉnh Tây Hồ sắc xanh biếc, hương thơm thanh khiết."
        },
        "pos": "Danh từ riêng"
      },
      {
        "id": "v-503-3",
        "hanzi": "普洱",
        "pinyin": "pǔ'ěr",
        "hanviet": "Phổ Nhĩ",
        "meaning": "Trà Phổ Nhĩ (Vân Nam)",
        "radical": "Bộ 日",
        "example": {
          "hanzi": "云南普洱茶越陈越香，有助于消化。",
          "pinyin": "Yúnnán Pǔ'ěr chá yuè chén yuè xiāng, yǒuzhùyú xiāohuà.",
          "meaning": "Trà Phổ Nhĩ Vân Nam càng để lâu càng thơm, giúp ích tiêu hóa."
        },
        "pos": "Danh từ riêng"
      },
      {
        "id": "v-503-4",
        "hanzi": "讲究",
        "pinyin": "jiǎngjiu",
        "hanviet": "Giảng cứu",
        "meaning": "Coi trọng, cầu kỳ, tinh tế",
        "radical": "Bộ 讠",
        "example": {
          "hanzi": "中国茶艺冲泡过程非常讲究水温和时间。",
          "pinyin": "Zhōngguó cháyì chōngpào guòchéng fēicháng jiǎngjiu shuǐwēn hé shíjiān.",
          "meaning": "Nghệ thuật pha trà Trung Quốc rất cầu kỳ về nhiệt độ nước và thời gian."
        },
        "pos": "Động từ / Tính từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "品",
        "hanzi": "品",
        "pinyin": "pǐn",
        "structure": {
          "code": "triangle",
          "name": "Phẩm tự (品字形结构)",
          "symbol": "品"
        },
        "ids": "品",
        "radical": {
          "char": "口",
          "name": "Khẩu",
          "strokes": 3
        },
        "meaning": "Thưởng thức, phẩm trà, phẩm hạnh",
        "strokesCount": 9,
        "strokeOrderText": "Khẩu 口 trên -> Khẩu 口 dưới trái -> Khẩu 口 dưới phải",
        "components": [
          "口"
        ],
        "mnemonic": "Dùng ba chiếc miệng (口) nếm đi nếm lại nhiều lần: phẩm vị, nhâm nhi thưởng trà (品茶)."
      },
      {
        "char": "壶",
        "hanzi": "壶",
        "pinyin": "hú",
        "structure": {
          "code": "top_mid_bottom",
          "name": "Thượng trung hạ (上中下结构)",
          "symbol": "⿳"
        },
        "ids": "⿳士冖业",
        "radical": {
          "char": "士",
          "name": "Sĩ",
          "strokes": 3
        },
        "meaning": "Bình, ấm đựng trà rượu",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Sĩ 士 (3 nét) -> Bộ Mịch 冖 (2 nét) -> Thân bình 业 (5 nét)",
        "components": [
          "士",
          "冖",
          "业"
        ],
        "mnemonic": "Bình ấm gốm sứ có nắp (士) và thân tròn (冖) đặt trang trọng trên bàn trà: ấm trà (茶壶)."
      }
    ],
    "step4_grammar": {
      "formula": "讲究…… (Coi trọng / Cầu kỳ về...)",
      "title": "Động từ biểu thị sự chú trọng tiêu chuẩn cao",
      "explanation": "Có thể làm động từ '讲究 + Tiêu chuẩn' hoặc làm tính từ biểu thị sự trang nhã, tinh tế.",
      "examples": [
        {
          "hanzi": "茶道不仅讲究茶叶的品质，更讲究心境的平和。",
          "pinyin": "Chádào bùjǐn jiǎngjiu cháyè de pǐnzhì, gèng jiǎngjiu xīnjìng de pínghé.",
          "meaning": "Trà đạo không chỉ coi trọng chất lượng lá trà mà còn chú trọng sự an yên của tâm cảnh."
        }
      ],
      "commonMistake": {
        "wrong": "他穿得很讲究衣服。",
        "correct": "他的穿着很讲究。",
        "explanation": "Làm vị ngữ tính từ không mang tân ngữ danh từ sau nó."
      }
    },
    "step5_listening": {
      "situation": "Trải nghiệm nghệ thuật thưởng trà, đàm đạo về trà Long Tỉnh và trà Phổ Nhĩ",
      "context": "Tại trà đình truyền thống bên bờ Tây Hồ, Hàng Châu",
      "participants": "A: Trà nghệ sư (Nghệ nhân trà), B: Học viên văn hóa phương Đông",
      "targetGoal": "Vận dụng động từ / tính từ 讲究…… (coi trọng / cầu kỳ, tinh tế về...) trong văn hóa trà đạo",
      "usageNotes": "\"水为茶之母，器为茶之父\" (Nước là mẹ của trà, ấm là cha của trà) là câu danh ngôn trà đạo nổi tiếng giải thích chữ \"讲究\".",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "中国茶道不仅讲究茶叶的品种，对冲泡的水温、紫砂壶的材质乃至品茶的心境都有极高要求。",
          "pinyin": "Zhōngguó chádào bùjǐn jiǎngjiu cháyè de pǐnzhǒng, duì chōngpào de shuǐwēn, zǐshāhú de cáizhì nǎizhì pǐnchá de xīnjìng dōu yǒu jígāo yāoqiú.",
          "meaning": "Trà đạo Trung Hoa không chỉ cầu kỳ về giống lá trà, mà đối với nhiệt độ nước pha, chất liệu ấm tử sa cho đến tâm cảnh thưởng trà đều có đòi hỏi vô cùng tinh tế."
        },
        {
          "speaker": "B",
          "hanzi": "老师，这款西湖龙井香气清雅，而您上次冲泡的云南熟普洱则陈香醇厚，风味截然不同。",
          "pinyin": "Lǎoshī, zhè kuǎn Xīhú Lóngjǐng xiāngqì qīngyǎ, ér nín shàng cì chōngpào de Yúnnán shú Pǔ'ěr zé chénxiāng chúnhòu, fēngwèi jiérán bùtóng.",
          "meaning": "Thưa thầy, loại Long Tỉnh Tây Hồ này hương thơm thanh nhã, còn trà Phổ Nhĩ chín Vân Nam lần trước thầy pha lại thơm trầm lắng đậm đà, phong vị hoàn toàn khác biệt."
        },
        {
          "speaker": "A",
          "hanzi": "冲泡绿茶水温不可过高，讲究八十五度水温悬壶高冲；而冲泡陈年普洱，则必须用沸水温润醒茶。",
          "pinyin": "Chōngpào lǜchá shuǐwēn bùkě guò gāo, jiǎngjiu bāshíwǔ dù shuǐwēn xuánhú gāochōng; ér chōngpào chénnián Pǔ'ěr, zé bìxū yòng fèishuǐ wēnrùn xǐngchá.",
          "meaning": "Pha trà xanh nhiệt độ nước không được quá cao, cầu kỳ ở mức 85 độ nâng ấm rót cao; còn pha Phổ Nhĩ lâu năm bắt buộc dùng nước sôi để đánh thức lá trà."
        },
        {
          "speaker": "B",
          "hanzi": "原来泡茶器具与手法如此讲究，难怪古人将品茶视为修身养性、感悟天地之道的静心过程。",
          "pinyin": "Yuánlái pàochá qìjù yǔ shǒufǎ rúcǐ jiǎngjiu, nánguài gǔrén jiāng pǐnchá shìwéi xiūshēnyǎngxìng, gǎnwù tiāndì zhī dào de jìngxīn guòchéng.",
          "meaning": "Hóa ra dụng cụ và thủ pháp pha trà lại tinh tế đến thế, thảo nào người xưa xem thưởng trà là quá trình tu dưỡng tâm tính, cảm ngộ đạo trời đất."
        },
        {
          "speaker": "A",
          "hanzi": "来，静下心来细细啜饮，体会茶汤由苦涩转为甘甜的曼妙韵味吧。",
          "pinyin": "Lái, jìng xià xīn lái xìxì chuòyǐn, tǐhuì chátāng yóu kǔsè zhuǎn wéi gāntián de mànmiào yùnwèi ba.",
          "meaning": "Nào, hãy lắng lòng lại nhấp từng ngụm nhỏ, cảm nhận dư vị tuyệt diệu khi nước trà từ đắng chát chuyển hóa thành ngọt ngào nhé."
        }
      ],
      "audioText": "中国茶道不仅讲究茶叶的品种，对冲泡的水温、紫砂壶的材质乃至品茶的心境都有极高要求。老师，这款西湖龙井香气清雅，而您上次冲泡的云南熟普洱则陈香醇厚，风味截然不同。冲泡绿茶水温不可过高，讲究八十五度水温悬壶高冲；而冲泡陈年普洱，则必须用沸水温润醒茶。原来泡茶器具与手法如此讲究，难怪古人将品茶视为修身养性、感悟天地之道的静心过程。来，静下心来细细啜饮，体会茶汤由苦涩转为甘甜的曼妙韵味吧。",
      "question": "Khi pha trà xanh Long Tỉnh, nhiệt độ nước cần cầu kỳ ở mức bao nhiêu độ?",
      "options": [
        "Nước lạnh 10 độ",
        "Nước 85 độ (八十五度水温)",
        "Nước sôi sùng sục 100 độ ngâm lâu",
        "Không cần đun nước"
      ],
      "correctIndex": 1,
      "explanation": "Nghệ nhân trà hướng dẫn nhiệt độ chuẩn: \"冲泡绿茶水温不可过高，讲究八十五度水温悬壶高冲\" (Pha trà xanh nhiệt độ không quá cao, cầu kỳ ở mức 85 độ)."
    },
    "step6_speaking": {
      "prompt": "Nói về nghệ thuật trà đạo:",
      "targetSentence": "品茶在于静心，茶如人生。",
      "targetPinyin": "Pǐnchá zàiyú jìngxīn, chá rú rénshēng.",
      "targetMeaning": "Thưởng trà cốt ở tâm tĩnh, trà tựa đời người.",
      "hint": "Ngữ điệu sâu lắng, trầm ấm."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Nghệ thuật pha trà rất chú trọng việc chọn nước'",
      "words": [
        "中国茶道",
        "非常讲究",
        "选水",
        "泡茶"
      ],
      "correctOrder": [
        "中国茶道",
        "泡茶",
        "非常讲究",
        "选水"
      ],
      "explanation": "Cấu trúc Chủ ngữ + Động từ + 讲究 + Tiêu chí."
    },
    "step8_quiz": [
      {
        "id": "q-503-1",
        "type": "multiple-choice",
        "question": "Loại trà xanh trứ danh xuất xứ từ Hàng Châu có tên là gì?",
        "options": [
          "铁观音 (Thiết Quan Âm)",
          "龙井茶 (Trà Long Tỉnh)",
          "大红袍 (Đại Hồng Bào)",
          "茉莉花茶 (Trà hoa nhài)"
        ],
        "correctIndex": 1,
        "explanation": "西湖龙井 (Long Tỉnh Tây Hồ) là đệ nhất danh trà."
      },
      {
        "id": "q-503-2",
        "type": "multiple-choice",
        "question": "Điền từ: '这家茶馆的装修风格非常____。'",
        "options": [
          "讲究",
          "甚至",
          "难免",
          "大略"
        ],
        "correctIndex": 0,
        "explanation": "Trang trí tinh tế, cầu kỳ dùng 讲究."
      }
    ],
    "step9_challenge": {
      "title": "Trà đạo đàm đạo",
      "taskDesc": "Ghi âm đoạn thuyết minh ngắn giới thiệu trà Phổ Nhĩ và tác dụng đối với sức khỏe.",
      "targetPhrase": "chádào jiǎngjiu xīnjìng",
      "xpReward": 60,
      "badge": "Bậc Thầy Trà Nghệ"
    }
  },
  {
    "id": "l-504",
    "chapterId": "ch-17",
    "levelId": "lvl-5",
    "lessonNumber": 4,
    "title": "Nghi thức trên bàn tiệc Trung Hoa",
    "chineseTitle": "中餐宴席礼仪与敬酒文化",
    "subtitle": "Quy tắc sắp xếp chỗ ngồi (chủ tọa, khách quý), nghi thức chúc rượu và phép lịch sự trên bàn ăn.",
    "objective": "Làm chủ từ vựng bàn tiệc: 座次, 敬酒, 规矩, 热情 và cấu trúc 不免……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-17"
    ],
    "step1_learn": {
      "topic": "Nghi thức trên bàn tiệc Trung Hoa - Trọng tâm HSK 5",
      "summary": "Quy tắc sắp xếp chỗ ngồi (chủ tọa, khách quý), nghi thức chúc rượu và phép lịch sự trên bàn ăn.",
      "keyTakeaways": [
        "Làm chủ từ vựng bàn tiệc: 座次, 敬酒, 规矩, 热情 và cấu trúc 不免……",
        "Làm chủ điểm ngữ pháp: 不免…… (Khó tránh khỏi... / Không khỏi...)"
      ],
      "audioDemoText": "敬酒时要双手持杯，并且自己的杯沿要略低于长辈或客户以示尊重。"
    },
    "step2_vocabulary": [
      {
        "id": "v-504-1",
        "hanzi": "座次",
        "pinyin": "zuòcì",
        "hanviet": "Tọa thứ",
        "meaning": "Thứ tự chỗ ngồi trên bàn tiệc",
        "radical": "Bộ 广",
        "example": {
          "hanzi": "中餐宴席的座次安排非常体现长幼尊卑。",
          "pinyin": "Zhōngcān yànxí de zuòcì ānpái fēicháng tǐxiàn zhǎngyòu-zūnbēi.",
          "meaning": "Việc sắp xếp chỗ ngồi trong tiệc Trung Hoa thể hiện rất rõ tôn ti trật tự."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-504-2",
        "hanzi": "敬酒",
        "pinyin": "jìngjiǔ",
        "hanviet": "Kính tửu",
        "meaning": "Chúc rượu, mời rượu kính trọng",
        "radical": "Bộ 攵",
        "example": {
          "hanzi": "敬酒时酒杯要稍微低于长辈或领导。",
          "pinyin": "Jìngjiǔ shí jiǔbēi yào shāowēi dīyú zhǎngbèi huò lǐngdǎo.",
          "meaning": "Khi chúc rượu chén rượu phải hơi thấp hơn người lớn tuổi hoặc lãnh đạo."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-504-3",
        "hanzi": "规矩",
        "pinyin": "guīju",
        "hanviet": "Quy củ",
        "meaning": "Quy củ, luật lệ, khuôn phép",
        "radical": "Bộ 矢",
        "example": {
          "hanzi": "餐桌上的规矩虽然多，但也体现了传统礼仪。",
          "pinyin": "Cānzhuō shang de guīju suīrán duō, yě tǐxiàn le chuántǒng lǐyí.",
          "meaning": "Quy củ trên bàn ăn tuy nhiều nhưng cũng thể hiện lễ nghi truyền thống."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-504-4",
        "hanzi": "不免",
        "pinyin": "bùmiǎn",
        "hanviet": "Bất miễn",
        "meaning": "Khó tránh khỏi, không khỏi",
        "radical": "Bộ 免",
        "example": {
          "hanzi": "初次参加正式宴席，年轻人不免有些拘谨。",
          "pinyin": "Chūcì cānjiā zhèngshì yànxí, niánqīngrén bùmiǎn yǒuxiē jūjǐn.",
          "meaning": "Lần đầu tham gia yến tiệc trang trọng, người trẻ khó tránh khỏi có phần gượng gạo."
        },
        "pos": "Phó từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "规",
        "hanzi": "规",
        "pinyin": "guī",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰夫见",
        "radical": {
          "char": "见",
          "name": "Kiến",
          "strokes": 4
        },
        "meaning": "Quy củ, khuôn phép, quy định",
        "strokesCount": 8,
        "strokeOrderText": "Chữ Phu 夫 (4 nét) -> Bộ Kiến 见 (4 nét)",
        "components": [
          "夫",
          "见"
        ],
        "mnemonic": "Bậc trượng phu (夫) có tầm nhìn sáng suốt (见) đặt ra phép tắc mẫu mực: quy củ, quy định (规矩)."
      },
      {
        "char": "矩",
        "hanzi": "矩",
        "pinyin": "jǔ",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰矢巨",
        "radical": {
          "char": "矢",
          "name": "Thỉ",
          "strokes": 5
        },
        "meaning": "Thước vuông đo góc, khuôn phép",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Thỉ 矢 (5 nét: phẩy, ngang, phẩy, chấm, mác) -> Chữ Cự 巨 (4 nét)",
        "components": [
          "矢",
          "巨"
        ],
        "mnemonic": "Thước vuông lớn (巨) đo lường đường đi thẳng tắp như mũi tên (矢): khuôn phép, quy củ (规矩)."
      }
    ],
    "step4_grammar": {
      "formula": "不免…… (Khó tránh khỏi... / Không khỏi...)",
      "title": "Phó từ chỉ xu hướng tất yếu của tâm lý hoặc hành vi",
      "explanation": "Dùng để giải thích một trạng thái cảm xúc nảy sinh một cách tự nhiên trong hoàn cảnh nhất định.",
      "examples": [
        {
          "hanzi": "离别之际，大家不免感到有些感伤。",
          "pinyin": "Líbié zhī jì, dàjiā bùmiǎn gǎndào yǒuxiē gǎnshāng.",
          "meaning": "Thời khắc chia tay, mọi người khó tránh khỏi cảm thấy có chút ngậm ngùi."
        }
      ],
      "commonMistake": {
        "wrong": "他难免不免。",
        "correct": "他难免感到紧张 / 他不免有些紧张。",
        "explanation": "不免 thường đi với trạng thái tâm lý; không dùng lặp lại难免."
      }
    },
    "step5_listening": {
      "situation": "Nghi thức bàn tiệc thương mại, vị trí chỗ ngồi và văn hóa chúc rượu trang trọng",
      "context": "Phòng VIP nhà hàng khách sạn 5 sao trước bữa tiệc chiêu đãi đối tác",
      "participants": "A: Giám đốc đối ngoại (Người am tường lễ nghi), B: Trợ lý dự án mới vào nghề",
      "targetGoal": "Vận dụng phó từ 不免…… (khó tránh khỏi... / không khỏi...) trong giao tiếp lễ tân (座次, 敬酒, 规矩)",
      "usageNotes": "\"尚东面南\" (hướng đông nhìn nam) là vị trí chủ tọa (主宾席) trang trọng nhất đối diện cửa ra vào trên bàn tiệc tròn Trung Quốc.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "今晚宴请外资重要客户，圆桌座次安排十分考究，正对包厢大门的正座必须留给主宾。",
          "pinyin": "Jīnwǎn yànqǐng wàizī zhòngyào kèhù, yuánzhuō zuòcì ānpái shífēn kǎojiu, zhèng duì bāoxiāng dàmén de zhèngzuò bìxū liú gěi zhǔbīn.",
          "meaning": "Tối nay mở tiệc chiêu đãi khách hàng vốn nước ngoài quan trọng, sắp xếp chỗ ngồi bàn tròn rất mực cầu kỳ, vị trí chính diện đối diện cửa phòng bắt buộc dành cho khách mời danh dự."
        },
        {
          "speaker": "B",
          "hanzi": "主任，商务宴请中的规矩这么多，初次参与的新人初来乍到，难免不免感到拘谨紧张。",
          "pinyin": "Zhǔrèn, shāngwù yànqǐng zhōng de guīju zhème duō, chūcì cānyù de xīnrén chūlái-zhàdào, nánmiǎn bùmiǎn gǎndào jūjǐn jǐnzhāng.",
          "meaning": "Thưa Chủ nhiệm, quy củ trong yến tiệc thương mại nhiều như vậy, người mới lần đầu tham dự chân ướt chân ráo không khỏi cảm thấy gò bó căng thẳng."
        },
        {
          "speaker": "A",
          "hanzi": "有顾虑是正常的，但只要掌握了核心礼仪，在敬酒时杯沿略低于对方以示尊重，就能展现涵养。",
          "pinyin": "Yǒu gùlǜ shì zhèngcháng de, dàn zhǐyào zhǎngwò le héxīn lǐyí, zài jìngjiǔ shí bēiyán lüè dī yú duìfāng yǐ shì zūnzhòng, jiù néng zhǎnxiàn hányǎng.",
          "meaning": "Có lo lắng là điều bình thường, nhưng chỉ cần nắm vững lễ nghi cốt lõi, khi chúc rượu vành ly hơi thấp hơn đối phương để tỏ lòng tôn kính là có thể thể hiện được phong thái hàm dưỡng."
        },
        {
          "speaker": "B",
          "hanzi": "明白了！如果是以茶代酒或者以果汁代酒，是否也应当遵循这套礼仪敬酒规矩？",
          "pinyin": "Míngbái le! Rúguǒ shì yǐ chá dài jiǔ huòzhě yǐ guǒzhī dài jiǔ, shìfǒu yě yīngdāng zūnxún zhè tào lǐyí jìngjiǔ guīju?",
          "meaning": "Em hiểu rồi ạ! Nếu dùng trà thay rượu hoặc dùng nước trái cây thay rượu thì có phải cũng cần tuân theo quy củ lễ nghi chúc rượu này không ạ?"
        },
        {
          "speaker": "A",
          "hanzi": "当然。心诚则灵，礼数周全不仅能化解尴尬，更能为接下来的商务合作奠定坚实的信任基石。",
          "pinyin": "Dāngrán. Xīn chéng zé líng, lǐshù zhōuquán bùjǐn néng huàjiě gāngà, gèng néng wèi jiēxiàlái de shāngwù hézuò diàndìng jiānshí de xìnrèn jīshí.",
          "meaning": "Đương nhiên rồi. Lòng thành thì tất ứng nghiệm, lễ nghĩa chu toàn không chỉ hóa giải ngượng ngùng mà còn đặt nền móng niềm tin vững chắc cho hợp tác thương mại sau này."
        }
      ],
      "audioText": "今晚宴请外资重要客户，圆桌座次安排十分考究，正对包厢大门的正座必须留给主宾。主任，商务宴请中的规矩这么多，初次参与的新人初来乍到，难免不免感到拘谨紧张。有顾虑是正常的，但只要掌握了核心礼仪，在敬酒时杯沿略低于对方以示尊重，就能展现涵养。明白了！如果是以茶代酒或者以果汁代酒，是否也应当遵循这套礼仪敬酒规矩？当然。心诚则灵，礼数周全不仅能化解尴尬，更能为接下来的商务合作奠定坚实的信任基石。",
      "question": "Khi nâng ly chúc rượu người lớn tuổi hoặc đối tác quan trọng, hành vi nào thể hiện sự tôn trọng?",
      "options": [
        "Nâng vành ly cao hơn đầu đối phương",
        "Để vành ly của mình hơi thấp hơn vành ly đối phương (杯沿略低于对方)",
        "Uống hết rượu một mình không mời",
        "Đập mạnh ly xuống bàn"
      ],
      "correctIndex": 1,
      "explanation": "Chủ nhiệm chỉ rõ quy tắc lễ nghi: \"在敬酒时杯沿略低于对方以示尊重\" (Khi chúc rượu vành ly hơi thấp hơn đối phương để tỏ lòng tôn trọng)."
    },
    "step6_speaking": {
      "prompt": "Lời chúc rượu lịch thiệp:",
      "targetSentence": "借此机会，我敬各位一杯，祝大家合作共赢！",
      "targetPinyin": "Jiè cǐ jīhuì, wǒ jìng gèwèi yì bēi, zhù dàjiā hézuò gòngyíng!",
      "targetMeaning": "Nhân cơ hội này, tôi xin kính mọi người một chén, chúc chúng ta hợp tác đôi bên cùng thắng!",
      "hint": "Phong thái tự tin, nâng chén hai tay."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Lần đầu đi làm anh ấy khó tránh khỏi lo lắng'",
      "words": [
        "初次上班",
        "感到紧张",
        "他",
        "不免"
      ],
      "correctOrder": [
        "初次上班",
        "他",
        "不免",
        "感到紧张"
      ],
      "explanation": "Cấu trúc Chủ ngữ + 不免 + Cảm xúc."
    },
    "step8_quiz": [
      {
        "id": "q-504-1",
        "type": "multiple-choice",
        "question": "Khi cụng ly chúc rượu bậc tiền bối trong văn hóa Trung Hoa, hành động nào thể hiện sự khiêm nhường?",
        "options": [
          "Đưa chén thật cao",
          "Để vành ly của mình thấp hơn đối phương",
          "Chỉ dùng một tay",
          "Quay lưng đi"
        ],
        "correctIndex": 1,
        "explanation": "Hạ thấp vành ly thể hiện sự tôn kính và khiêm tốn."
      },
      {
        "id": "q-504-2",
        "type": "multiple-choice",
        "question": "Điền từ: '分别多年再次重逢，老同学心中____感慨万千。'",
        "options": [
          "不免",
          "所谓",
          "究竟",
          "与其"
        ],
        "correctIndex": 0,
        "explanation": "Cảm xúc khó tránh khỏi trào dâng dùng 不免."
      }
    ],
    "step9_challenge": {
      "title": "Nghi thức bàn tiệc",
      "taskDesc": "Mô phỏng bài phát biểu chúc rượu ngắn gọn, trang trọng trong bữa tiệc ký kết hợp đồng.",
      "targetPhrase": "hézuò gòngyíng jìngjiǔ",
      "xpReward": 60,
      "badge": "Ngoại Giao Yến Tiệc"
    }
  },
  {
    "id": "l-505",
    "chapterId": "ch-17",
    "levelId": "lvl-5",
    "lessonNumber": 5,
    "title": "Giao lưu & Dung hợp văn hóa ẩm thực",
    "chineseTitle": "饮食文化交流与融合",
    "subtitle": "Sự giao thoa giữa phở Việt Nam và mì Trung Hoa, ẩm thực truyền thống thích nghi với hiện đại.",
    "objective": "Làm chủ từ vựng giao lưu văn hóa: 融合, 传承, 体验, 赞不绝口 và liên từ 总之……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-17"
    ],
    "step1_learn": {
      "topic": "Giao lưu & Dung hợp văn hóa ẩm thực - Trọng tâm HSK 5",
      "summary": "Sự giao thoa giữa phở Việt Nam và mì Trung Hoa, ẩm thực truyền thống thích nghi với hiện đại.",
      "keyTakeaways": [
        "Làm chủ từ vựng giao lưu văn hóa: 融合, 传承, 体验, 赞不绝口 và liên từ 总之……",
        "Làm chủ điểm ngữ pháp: 总之…… (Nói tóm lại / Tóm lại...)"
      ],
      "audioDemoText": "美食是最好的文化桥梁，食客们都赞不绝口。"
    },
    "step2_vocabulary": [
      {
        "id": "v-505-1",
        "hanzi": "融合",
        "pinyin": "rónghé",
        "hanviet": "Dung hợp",
        "meaning": "Dung hòa, hòa quyện, kết hợp",
        "radical": "Bộ 虫",
        "example": {
          "hanzi": "现代饮食文化是传统与创新的完美融合。",
          "pinyin": "Xiàndài yǐnshí wénhuà shì chuántǒng yǔ chuàngxīn de wánměi rónghé.",
          "meaning": "Văn hóa ẩm thực hiện đại là sự hòa quyện hoàn mỹ giữa truyền thống và đổi mới."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-505-2",
        "hanzi": "传承",
        "pinyin": "chuánchéng",
        "hanviet": "Truyền thừa",
        "meaning": "Kế thừa và lưu truyền",
        "radical": "Bộ 亻",
        "example": {
          "hanzi": "老字号手艺人默默传承着非物质文化遗产。",
          "pinyin": "Lǎozìhào shǒuyìrén mòmò chuánchéng zhe fēiwùzhì wénhuà yíchǎn.",
          "meaning": "Nghệ nhân các hiệu lâu đời âm thầm kế thừa di sản văn hóa phi vật thể."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-505-3",
        "hanzi": "体验",
        "pinyin": "tǐyàn",
        "hanviet": "Thể nghiệm",
        "meaning": "Trải nghiệm thực tế",
        "radical": "Bộ 马",
        "example": {
          "hanzi": "来到北京一定要亲自体验一下地道的烤鸭。",
          "pinyin": "Láidào Běijīng yídìng yào qīnzì tǐyàn yíxià dìdao de kǎoyā.",
          "meaning": "Đến Bắc Kinh nhất định phải đích thân trải nghiệm món vịt quay chính hiệu."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-505-4",
        "hanzi": "赞不绝口",
        "pinyin": "zànbùjuékǒu",
        "hanviet": "Tán bất tuyệt khẩu",
        "meaning": "Khen ngợi không ngớt lời (Thành ngữ)",
        "radical": "Bộ 言",
        "example": {
          "hanzi": "外国游客对越南的牛肉河粉赞不绝口。",
          "pinyin": "Wàiguó yóukè duì Yuènán de niúròu héfěn zànbùjuékǒu.",
          "meaning": "Du khách nước ngoài khen ngợi phở bò Việt Nam không ngớt lời."
        },
        "pos": "Thành ngữ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "融",
        "hanzi": "融",
        "pinyin": "róng",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰鬲虫",
        "radical": {
          "char": "虫",
          "name": "Trùng",
          "strokes": 6
        },
        "meaning": "Dung hợp, hòa tan, dung hòa",
        "strokesCount": 16,
        "strokeOrderText": "Chữ Cách 鬲 (10 nét: cái đỉnh vạc) -> Bộ Trùng 虫 (6 nét)",
        "components": [
          "鬲",
          "虫"
        ],
        "mnemonic": "Nhiệt lượng tỏa ra từ đỉnh vạc (鬲) làm tan chảy và hòa quyện vạn vật: dung hòa, dung hợp (融合)."
      },
      {
        "char": "承",
        "hanzi": "承",
        "pinyin": "chéng",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "承",
        "radical": {
          "char": "手",
          "name": "Thủ",
          "strokes": 4
        },
        "meaning": "Đón nhận, thừa kế, gánh vác",
        "strokesCount": 8,
        "strokeOrderText": "Ngang gập móc -> Sổ móc -> Phẩy -> Hất -> Nét phụ hai bên",
        "components": [
          "手"
        ],
        "mnemonic": "Hai bàn tay đưa lên nâng đỡ và đón nhận trách nhiệm từ tiền nhân: kế thừa, truyền thừa (传承)."
      }
    ],
    "step4_grammar": {
      "formula": "总之…… (Nói tóm lại / Tóm lại...)",
      "title": "Liên từ tổng kết, quy nạp luận điểm",
      "explanation": "Đặt ở đầu câu kết đoạn để thâu tóm toàn bộ ý kiến đã trình bày phía trước.",
      "examples": [
        {
          "hanzi": "总之，饮食不仅是满足口腹之欲，更是一种文化认同。",
          "pinyin": "Zǒngzhī, yǐnshí bùjǐn shì mǎnzú kǒufù zhī yù, gèng shì yì zhǒng wénhuà rèntóng.",
          "meaning": "Tóm lại, ăn uống không chỉ thỏa mãn cơn thèm ăn mà còn là sự đồng điệu văn hóa."
        }
      ],
      "commonMistake": {
        "wrong": "总之很好。",
        "correct": "总之，这个方案很好。",
        "explanation": "Sau 总之 thường có dấu phẩy ngắt nhịp."
      }
    },
    "step5_listening": {
      "situation": "Đánh giá sự dung hòa giữa truyền thống và ẩm thực quốc tế đương đại",
      "context": "Cuộc phỏng vấn chuyên đề trên tạp chí Ẩm thực & Đời sống thượng lưu",
      "participants": "A: Ký giả chuyên mục ẩm thực quốc tế, B: Bếp trưởng ẩm thực dung hợp đạt sao Michelin",
      "targetGoal": "Vận dụng liên từ tổng kết 总之…… (nói tóm lại / tóm lại...) và thành ngữ 赞不绝口 (khen ngợi không ngớt lời)",
      "usageNotes": "\"赞不绝口\" là thành ngữ 4 chữ HSK 5 cực kỳ phổ biến trong văn bản nghị luận miêu tả sự đánh giá xuất sắc về nghệ thuật hoặc ẩm thực.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "主厨您好，您将传统北京烤鸭与西式松露酱巧妙结合，客人们品尝后都赞不绝口，创意的灵感何来？",
          "pinyin": "Zhǔchú nín hǎo, nín jiāng chuántǒng Běijīng kǎoyā yǔ xīshì sōnglùjiàng qiǎomiào jiéhé, kèrénmen pǐncháng hòu dōu zànbùjuékǒu, chuàngyì de línggǎn hé lái?",
          "meaning": "Kính chào Bếp trưởng, ngài kết hợp tài tình món vịt quay Bắc Kinh truyền thống với sốt nấm truffle phương Tây khiến thực khách thưởng thức xong đều khen ngợi không ngớt lời, nguồn cảm hứng sáng tạo bắt nguồn từ đâu?"
        },
        {
          "speaker": "B",
          "hanzi": "我认为传统技艺的传承不能固步自封，融合多元饮食文化才能赋予中餐历久弥新的生机。",
          "pinyin": "Wǒ rènwéi chuántǒng jìyì de chuánchéng bù néng gùbùzìfēng, rónghé duōyuán yǐnshí wénhuà cái néng fùyǔ zhōngcān lìjiǔ-míxīn de shēngjī.",
          "meaning": "Tôi cho rằng việc kế thừa kỹ nghệ truyền thống không thể dậm chân tại chỗ, dung hợp văn hóa ẩm thực đa nguyên mới có thể ban tặng sức sống trường tồn cho món Trung."
        },
        {
          "speaker": "A",
          "hanzi": "在跨文化体验中，外国食客是否也能深刻领会这种融入现代审美的中式哲学？",
          "pinyin": "Zài kuà wénhuà tǐyàn zhōng, wàiguó shíkè shìfǒu yě néng shēnkè lǐnghuì zhè zhǒng róngrù xiàndài shěnměi de zhōngshì zhéxué?",
          "meaning": "Trong trải nghiệm liên văn hóa này, liệu các thực khách nước ngoài có thấu hiểu sâu sắc triết lý Trung Hoa hòa quyện thẩm mỹ hiện đại này không?"
        },
        {
          "speaker": "B",
          "hanzi": "美食是无需翻译的世界通用语言，总之，只要保留食物温度与真诚匠心，就能跨越国界打动人心。",
          "pinyin": "Měishí shì wúxū fānyì de shìjiè tōngyòng yǔyán, zǒngzhī, zhǐyào bǎoliú shíwù wēndù yǔ zhēnchéng jiàngxīn, jiù néng kuàyuè guójiè dǎdòng rénxīn.",
          "meaning": "Ẩm thực là ngôn ngữ chung của thế giới không cần dịch thuật, tóm lại, chỉ cần giữ được hơi ấm món ăn và tấm lòng chân thành của người thợ, tất sẽ vượt qua biên giới lay động lòng người."
        },
        {
          "speaker": "A",
          "hanzi": "精辟的见解！正是这份守正创新的担当，让东方美食在世界舞台上绽放出耀眼光芒。",
          "pinyin": "Jīngpì de jiànjiě! Zhèng shì zhè fèn shǒuzhèng-chuàngxīn de dāndāng, ràng dōngfāng měishí zài shìjiè wǔtái shang zhànfàng chū yàoyǎn guāngmáng.",
          "meaning": "Kiến giải thật thấu đáo! Chính sự đảm đương giữ gìn gốc rễ mà không ngừng đổi mới này đã giúp mỹ thực phương Đông tỏa sáng rực rỡ trên vũ đài thế giới."
        }
      ],
      "audioText": "主厨您好，您将传统北京烤鸭与西式松露酱巧妙结合，客人们品尝后都赞不绝口，创意的灵感何来？我认为传统技艺的传承不能固步自封，融合多元饮食文化才能赋予中餐历久弥新的生机。在跨文化体验中，外国食客是否也能深刻领会这种融入现代审美的中式哲学？美食是无需翻译的世界通用语言，总之，只要保留食物温度与真诚匠心，就能跨越国界打动人心。精辟的见解！正是这份守正创新的担当，让东方美食在世界舞台上绽放出耀眼光芒。",
      "question": "Theo kết luận của Bếp trưởng, yếu tố nào giúp ẩm thực lay động lòng người không phân biệt biên giới?",
      "options": [
        "Bán giá thật đắt đỏ",
        "Hơi ấm món ăn và tấm lòng chân thành của người thợ (食物温度与真诚匠心)",
        "Chỉ dùng nguyên liệu nước ngoài",
        "Quảng cáo rầm rộ trên truyền hình"
      ],
      "correctIndex": 1,
      "explanation": "Bếp trưởng tổng kết: \"总之，只要保留食物温度与真诚匠心，就能跨越国界打动人心\" (Tóm lại, chỉ cần giữ được độ ấm món ăn và tâm huyết chân thành của người thợ)."
    },
    "step6_speaking": {
      "prompt": "Thành ngữ khen ngợi:",
      "targetSentence": "这道菜色香味俱全，令人赞不绝口！",
      "targetPinyin": "Zhè dào cài sè xiāng wèi jùquán, lìng rén zànbùjuékǒu!",
      "targetMeaning": "Món ăn này sắc hương vị vẹn toàn, khiến người ta khen không ngớt lời!",
      "hint": "Ngữ điệu trầm trồ thán phục."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Nói tóm lại ẩm thực chính là văn hóa'",
      "words": [
        "饮食",
        "就是",
        "文化",
        "总之"
      ],
      "correctOrder": [
        "总之",
        "饮食",
        "就是",
        "文化"
      ],
      "explanation": "总之 đứng đầu câu tổng kết."
    },
    "step8_quiz": [
      {
        "id": "q-505-1",
        "type": "multiple-choice",
        "question": "Thành ngữ bốn chữ nào mang nghĩa 'khen ngợi liên tục không ngừng miệng'?",
        "options": [
          "赞不绝口",
          "不见不散",
          "半途而废",
          "塞翁失马"
        ],
        "correctIndex": 0,
        "explanation": "赞不绝口 (zànbùjuékǒu) là khen không ngớt lời."
      },
      {
        "id": "q-505-2",
        "type": "multiple-choice",
        "question": "Điền từ: '____，只要我们共同努力，就一定能克服难关。'",
        "options": [
          "总之",
          "不免",
          "与其",
          "哪怕"
        ],
        "correctIndex": 0,
        "explanation": "Đầu câu tổng luận dùng 总之."
      }
    ],
    "step9_challenge": {
      "title": "Tổng kết Chương 17",
      "taskDesc": "Viết đoạn văn ngắn 80 chữ về sự tương đồng và giao lưu giữa ẩm thực Việt - Trung.",
      "targetPhrase": "zànbùjuékǒu měishí",
      "xpReward": 60,
      "badge": "Nhà Phê Bình Ẩm Thực"
    }
  },
  {
    "id": "l-506",
    "chapterId": "ch-18",
    "levelId": "lvl-5",
    "lessonNumber": 1,
    "title": "Trào lưu ngôn ngữ mạng thịnh hành",
    "chineseTitle": "流行网络用语新风尚",
    "subtitle": "Hiểu và sử dụng các thuật ngữ mạng Douyin, Weibo: 点赞, 转发, 刷屏, 热门 và phó từ 甚至……",
    "objective": "Bắt kịp nhịp sống số của giới trẻ Trung Quốc và tránh dịch thô cứng.",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-18"
    ],
    "step1_learn": {
      "topic": "Trào lưu ngôn ngữ mạng thịnh hành - Trọng tâm HSK 5",
      "summary": "Hiểu và sử dụng các thuật ngữ mạng Douyin, Weibo: 点赞, 转发, 刷屏, 热门 và phó từ 甚至……",
      "keyTakeaways": [
        "Bắt kịp nhịp sống số của giới trẻ Trung Quốc và tránh dịch thô cứng.",
        "Làm chủ điểm ngữ pháp: 甚至…… (Thậm chí... / Ngay cả...)"
      ],
      "audioDemoText": "甚至连大学教授都转发了。"
    },
    "step2_vocabulary": [
      {
        "id": "v-506-1",
        "hanzi": "点赞",
        "pinyin": "diǎnzàn",
        "hanviet": "Điểm tán",
        "meaning": "Thả tim, bấm like (trên mạng)",
        "radical": "Bộ 言",
        "example": {
          "hanzi": "如果喜欢这条视频，别忘了点赞关注。",
          "pinyin": "Rúguǒ xǐhuan zhè tiáo shìpín, bié wàng le diǎnzàn guānzhù.",
          "meaning": "Nếu thích video này, đừng quên thả tim theo dõi nhé."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-506-2",
        "hanzi": "转发",
        "pinyin": "zhuǎnfā",
        "hanviet": "Chuyển phát",
        "meaning": "Chia sẻ lại, retweet, share",
        "radical": "Bộ 车",
        "example": {
          "hanzi": "优质的内容很快就被网友疯狂转发。",
          "pinyin": "Yōuzhì de nèiróng hěn kuài jiù bèi wǎngyǒu fēngkuáng zhuǎnfā.",
          "meaning": "Nội dung chất lượng nhanh chóng được cư dân mạng chia sẻ điên đảo."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-506-3",
        "hanzi": "刷屏",
        "pinyin": "shuāpíng",
        "hanviet": "Soát bính",
        "meaning": "Spam ngập màn hình, viral phủ sóng",
        "radical": "Bộ 刂",
        "example": {
          "hanzi": "这个震撼的新闻瞬间在朋友圈刷屏了。",
          "pinyin": "Zhè gè zhènhàn de xīnwén shùnjiān zài péngyǒuquān shuāpíng le.",
          "meaning": "Tin tức chấn động này trong tích tắc đã phủ sóng ngập tràn Bảng tin WeChat."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-506-4",
        "hanzi": "甚至",
        "pinyin": "shènzhì",
        "hanviet": "Thậm chí",
        "meaning": "Thậm chí, ngay cả (phó từ tăng tiến)",
        "radical": "Bộ 至",
        "example": {
          "hanzi": "很多老年人甚至也会熟练使用智能手机直播。",
          "pinyin": "Hěn duō lǎoniánrén shènzhì yě huì shúliàn shǐyòng zhìnéng shǒujī zhībō.",
          "meaning": "Rất nhiều người cao tuổi thậm chí cũng biết dùng thành thạo smartphone để livestream."
        },
        "pos": "Phó từ / Liên từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "赞",
        "hanzi": "赞",
        "pinyin": "zàn",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱兟贝",
        "radical": {
          "char": "贝",
          "name": "Bối",
          "strokes": 4
        },
        "meaning": "Ca ngợi, khen thưởng, bấm like",
        "strokesCount": 16,
        "strokeOrderText": "Phần trên 兟 (12 nét) -> Bộ Bối 贝 (4 nét: sổ, ngang gập, phẩy, chấm)",
        "components": [
          "兟",
          "贝"
        ],
        "mnemonic": "Đem lễ vật ngọc ngà (贝) dâng lên chúc hạ và ca ngợi người tài: khen ngợi, bấm like (点赞)."
      },
      {
        "char": "屏",
        "hanzi": "屏",
        "pinyin": "píng",
        "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸"
        },
        "ids": "⿸尸并",
        "radical": {
          "char": "尸",
          "name": "Thi",
          "strokes": 3
        },
        "meaning": "Màn hình, bình phong che chắn",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Thi 尸 (3 nét) -> Chữ Tinh 并 (6 nét)",
        "components": [
          "尸",
          "并"
        ],
        "mnemonic": "Tấm bình phong (尸) dựng đứng che chắn không gian: màn hình hiển thị (屏幕, 刷屏)."
      }
    ],
    "step4_grammar": {
      "formula": "甚至…… (Thậm chí... / Ngay cả...)",
      "title": "Phó từ biểu thị mức độ tăng tiến đột biến",
      "explanation": "Dùng để đưa ra một ví dụ nổi bật, bất ngờ vượt quá phạm vi thông thường nhằm nhấn mạnh.",
      "examples": [
        {
          "hanzi": "他不仅会唱中文歌，甚至能背诵唐诗三百首。",
          "pinyin": "Tā bùjǐn huì chàng Zhōngwén gē, shènzhì néng bèisòng Tángshī sānbǎi shǒu.",
          "meaning": "Anh ấy không những biết hát bài hát tiếng Trung, thậm chí còn thuộc lòng 300 bài thơ Đường."
        }
      ],
      "commonMistake": {
        "wrong": "甚至他去。",
        "correct": "他甚至去过南极。",
        "explanation": "Chủ ngữ thường đứng trước 甚至."
      }
    },
    "step5_listening": {
      "situation": "Phân tích hiện tượng ngôn ngữ mạng bùng nổ, văn hóa like và viral mạng xã hội",
      "context": "Hội thảo ngôn ngữ học truyền thông tại Đại học Truyền thông Trung Quốc",
      "participants": "A: Giáo sư Ngôn ngữ học Xã hội, B: Nhà báo công nghệ số",
      "targetGoal": "Vận dụng phó từ tăng tiến 甚至…… (thậm chí... / ngay cả...) trong văn phong nghị luận xã hội",
      "usageNotes": "\"刷屏\" (chiếm sóng ngập màn hình) và \"点赞\" (thả tim) là những từ vựng mạng tiêu biểu đã đi vào từ điển chính thống phản ánh sự chuyển biến của thời đại số.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "移动互联网的发展重塑了大众的表达模式，各种网络流行语在社交媒体上引发全网刷屏。",
          "pinyin": "Yídòng hùliánwǎng de fāzhǎn chóngshù le dàzhòng de biǎodá móshì, gè zhǒng wǎnglùo liúxíngyǔ zài shèjiāo méitǐ shang yǐnfā quán wǎng shuāpíng.",
          "meaning": "Sự phát triển của Internet di động đã định hình lại mô thức biểu đạt của đại chúng, các từ lóng mạng lan truyền tạo nên làn sóng viral ngập tràn toàn mạng."
        },
        {
          "speaker": "B",
          "hanzi": "是的，一条几秒钟的短视频，经过数百万次的点赞与转发，能在极短时间内引爆社会热点。",
          "pinyin": "Shì de, yì tiáo jǐ miǎozhōng de duǎnshìpín, jīngguò shù bǎi wàn cì de diǎnzàn yǔ zhuǎnfā, néng zài jí duǎn shíjiān nèi yǐnbào shèhuì rèdiǎn.",
          "meaning": "Vâng ạ, một đoạn video ngắn vài giây, qua hàng triệu lượt like và chia sẻ, có thể châm ngòi điểm nóng xã hội trong thời gian cực ngắn."
        },
        {
          "speaker": "A",
          "hanzi": "这种碎片化表达甚至渗透到了正式的书面公文和主流媒体报道中，引起了学术界的深刻讨论。",
          "pinyin": "Zhè zhǒng suìpiànhuà biǎodá shènzhì shèntòu dào le zhèngshì de shūmiàn gōngwén hé zhǔliú méitǐ bàodào zhōng, yǐnqǐ le xuéshùjiè de shēnkè tǎolùn.",
          "meaning": "Cách biểu đạt manh mún vụn vặt này thậm chí đã len lỏi vào các công văn hành chính trang trọng và bản tin truyền thông dòng chính, dấy lên tranh luận sâu sắc trong giới học thuật."
        },
        {
          "speaker": "B",
          "hanzi": "但不可否认，生动活泼的网络词汇极大拉近了人与人之间的心理距离，赋予语言极强的幽默感。",
          "pinyin": "Dàn bùkě fǒurèn, shēngdòng huópo de wǎnglùo cíhuì jídà lājìn le rén yǔ rén zhījiān de xīnlǐ jùlí, fùyǔ yǔyán jí qiáng de yōumògǎn.",
          "meaning": "Nhưng không thể phủ nhận, từ vựng mạng sinh động hoạt bát đã kéo gần khoảng cách tâm lý giữa con người với nhau, mang lại tính hài hước mạnh mẽ cho ngôn ngữ."
        },
        {
          "speaker": "A",
          "hanzi": "关键在于如何在拥抱鲜活时代气息的同时，守护规范汉语的典雅底蕴与逻辑严密性。",
          "pinyin": "Guānjiàn zàiyú rúhé zài yōngbào xiānhuó shídài qìxī de tóngshí, shǒuhù guīfàn Hànyǔ de diǎnyǎ dǐyùn yǔ luójí yánmìxìng.",
          "meaning": "Mấu chốt nằm ở chỗ làm sao vừa đón nhận hơi thở sống động của thời đại, vừa gìn giữ cốt cách tao nhã và tính chặt chẽ logic của tiếng Hán chuẩn mực."
        }
      ],
      "audioText": "移动互联网的发展重塑了大众的表达模式，各种网络流行语在社交媒体上引发全网刷屏。是的，一条几秒钟的短视频，经过数百万次的点赞与转发，能在极短时间内引爆社会热点。这种碎片化表达甚至渗透到了正式的书面公文和主流媒体报道中，引起了学术界的深刻讨论。但不可否认，生动活泼的网络词汇极大拉近了人与人之间的心理距离，赋予语言极强的幽默感。关键在于如何在拥抱鲜活时代气息的同时，守护规范汉语的典雅底蕴与逻辑严密性。",
      "question": "Hiện tượng nào của ngôn ngữ mạng khiến giới học thuật chú ý và thảo luận sâu sắc?",
      "options": [
        "Không còn ai dùng mạng xã hội nữa",
        "Cách biểu đạt phân mảnh thậm chí thẩm thấu vào văn bản trang trọng và truyền thông (甚至渗透到正式公文与主流报道)",
        "Mọi người quay lại viết thư tay bằng bút lông",
        "Từ vựng mạng bị pháp luật cấm hoàn toàn"
      ],
      "correctIndex": 1,
      "explanation": "Giáo sư chỉ ra tác động sâu rộng: \"这种碎片化表达甚至渗透到了正式的书面公文和主流媒体报道中\" (Cách biểu đạt manh mún này thậm chí len lỏi vào công văn chính thức và truyền thông)."
    },
    "step6_speaking": {
      "prompt": "Kêu gọi tương tác trên mạng:",
      "targetSentence": "老铁们，给主播点个赞加个关注！",
      "targetPinyin": "Lǎotiě men, gěi zhǔbō diǎn gè zàn jiā gè guānzhù!",
      "targetMeaning": "Các anh em ơi, thả tim và ấn follow cho chủ phòng nhé!",
      "hint": "Ngữ điệu hào hứng của livestream Douyin."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Anh ấy thậm chí quên cả ăn cơm'",
      "words": [
        "忙得",
        "他",
        "甚至",
        "忘了吃饭"
      ],
      "correctOrder": [
        "他",
        "忙得",
        "甚至",
        "忘了吃饭"
      ],
      "explanation": "Cấu trúc 忙得 + 甚至 + V..."
    },
    "step8_quiz": [
      {
        "id": "q-506-1",
        "type": "multiple-choice",
        "question": "Trên mạng xã hội Trung Quốc, cụm từ '一键三连' (1 chạm 3 hành động) gồm những gì?",
        "options": [
          "点赞、投币、收藏 (Like, Coin, Bookmark)",
          "吃饭、睡觉、打豆豆",
          "打电话、发微信、加好友",
          "退货、换货、差评"
        ],
        "correctIndex": 0,
        "explanation": "Văn hóa video Bilibili/Douyin: 点赞、投币、收藏."
      },
      {
        "id": "q-506-2",
        "type": "multiple-choice",
        "question": "Điền từ: '这个问题太深奥了，____专家都无法解答。'",
        "options": [
          "甚至",
          "所谓",
          "究竟",
          "与其"
        ],
        "correctIndex": 0,
        "explanation": "Tăng tiến vượt mức thông thường dùng 甚至."
      }
    ],
    "step9_challenge": {
      "title": "Ngôn ngữ mạng",
      "taskDesc": "Viết một bình luận video Douyin bằng tiếng lóng tự nhiên của cư dân mạng Trung Quốc.",
      "targetPhrase": "diǎnzàn zhuǎnfā shuāpíng",
      "xpReward": 60,
      "badge": "Dân Mạng Sành Điệu"
    }
  },
  {
    "id": "l-507",
    "chapterId": "ch-18",
    "levelId": "lvl-5",
    "lessonNumber": 2,
    "title": "Tâm lý giới trẻ: Nằm phẳng vs Cuộn tròn",
    "chineseTitle": "青年社会心态：躺平与内卷",
    "subtitle": "Hiện tượng xã hội nóng hổi: 内卷 (cạnh tranh khốc liệt) và 躺平 (từ chối áp lực, sống tối giản).",
    "objective": "Nắm vững từ vựng xã hội học: 内卷, 躺平, 竞争, 焦虑 và phó từ 究竟……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-18"
    ],
    "step1_learn": {
      "topic": "Tâm lý giới trẻ: Nằm phẳng vs Cuộn tròn - Trọng tâm HSK 5",
      "summary": "Hiện tượng xã hội nóng hổi: 内卷 (cạnh tranh khốc liệt) và 躺平 (từ chối áp lực, sống tối giản).",
      "keyTakeaways": [
        "Nắm vững từ vựng xã hội học: 内卷, 躺平, 竞争, 焦虑 và phó từ 究竟……",
        "Làm chủ điểm ngữ pháp: 反思…… (Suy ngẫm / Nhìn nhận lại...)"
      ],
      "audioDemoText": "关键在于找到内心的平衡。"
    },
    "step2_vocabulary": [
      {
        "id": "v-507-1",
        "hanzi": "内卷",
        "pinyin": "nèijuǎn",
        "hanviet": "Nội quyển",
        "meaning": "Cuộn vào trong, cạnh tranh kiệt sức vô nghĩa (Involution)",
        "radical": "Bộ 人",
        "example": {
          "hanzi": "过度内卷导致年轻人普遍感到身心疲惫。",
          "pinyin": "Guòdù nèijuǎn dǎozhì niánqīngrén pǔbiàn gǎndào shēnxīn píbèi.",
          "meaning": "Cạnh tranh tiêu cực quá đà khiến giới trẻ nhìn chung cảm thấy mệt mỏi cả thể xác lẫn tâm hồn."
        },
        "pos": "Danh từ / Động từ"
      },
      {
        "id": "v-507-2",
        "hanzi": "躺平",
        "pinyin": "tǎngpíng",
        "hanviet": "Thảng bình",
        "meaning": "Nằm phẳng, buông bỏ áp lực bon chen",
        "radical": "Bộ 身",
        "example": {
          "hanzi": "所谓的躺平，并不是懒惰，而是一种自我调节。",
          "pinyin": "Suǒwèi de tǎngpíng, bìng bú shì lǎnduò, ér shì yì zhǒng zìwǒ tiáojié.",
          "meaning": "Cái gọi là 'nằm phẳng' không phải là lười biếng mà là một cách tự điều chỉnh tâm lý."
        },
        "pos": "Cụm động từ"
      },
      {
        "id": "v-507-3",
        "hanzi": "竞争",
        "pinyin": "jìngzhēng",
        "hanviet": "Cạnh tranh",
        "meaning": "Cạnh tranh, thi đua",
        "radical": "Bộ 立",
        "example": {
          "hanzi": "良性的职场竞争有助于激发个人潜能。",
          "pinyin": "Liángxìng de zhíchǎng jìngzhēng yǒuzhùyú jīfā gèrén qiánnéng.",
          "meaning": "Cạnh tranh nơi công sở lành mạnh giúp kích hoạt tiềm năng cá nhân."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-507-4",
        "hanzi": "焦虑",
        "pinyin": "jiāolǜ",
        "hanviet": "Tiêu lự",
        "meaning": "Lo âu, căng thẳng, bất an",
        "radical": "Bộ 心",
        "example": {
          "hanzi": "不要因为同龄人的成就而产生过多焦虑。",
          "pinyin": "Bú yào yīnwèi tónglíngrén de chéngjiù ér chǎnshēng guòduō jiāolǜ.",
          "meaning": "Đừng vì thành tựu của bạn bè đồng trang lứa mà sinh ra quá nhiều lo âu."
        },
        "pos": "Danh từ / Tính từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "卷",
        "hanzi": "卷",
        "pinyin": "juǎn",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱龹⺋",
        "radical": {
          "char": "卩",
          "name": "Tiết",
          "strokes": 2
        },
        "meaning": "Cuộn lại, lốc xoáy, cạnh tranh kiệt sức",
        "strokesCount": 8,
        "strokeOrderText": "Phần trên 龹 (6 nét: hai chấm, ngang, phẩy, mác...) -> Bộ Tiết ⺋ (2 nét)",
        "components": [
          "龹",
          "⺋"
        ],
        "mnemonic": "Hai tay cuốn tròn dải lụa thành từng cuộn nén chặt: cuốn vào, cạnh tranh kiệt sức (内卷)."
      },
      {
        "char": "躺",
        "hanzi": "躺",
        "pinyin": "tǎng",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰身尚",
        "radical": {
          "char": "身",
          "name": "Thân",
          "strokes": 7
        },
        "meaning": "Nằm ngả lưng, buông bỏ áp lực",
        "strokesCount": 15,
        "strokeOrderText": "Bộ Thân 身 (7 nét) -> Chữ Thượng 尚 (8 nét)",
        "components": [
          "身",
          "尚"
        ],
        "mnemonic": "Thân thể (身) thả lỏng hướng mặt lên trời (尚) nghỉ ngơi buông bỏ áp lực: nằm phẳng (躺平)."
      }
    ],
    "step4_grammar": {
      "formula": "反思…… (Suy ngẫm / Nhìn nhận lại...)",
      "title": "Động từ biểu thị tư duy phản biện xã hội",
      "explanation": "Dùng khi muốn phân tích mặt trái của một trào lưu xã hội để tìm ra hướng đi đúng đắn.",
      "examples": [
        {
          "hanzi": "我们需要深刻反思过度内卷带来的社会心理问题。",
          "pinyin": "Wǒmen xūyào shēnkè fǎnsī guòdù nèijuǎn dàilái de shèhuì xīnlǐ wèntí.",
          "meaning": "Chúng ta cần suy ngẫm sâu sắc về những vấn đề tâm lý xã hội do cạnh tranh quá đà đem lại."
        }
      ],
      "commonMistake": {
        "wrong": "反思他错了。",
        "correct": "我们要反思自己的错误。",
        "explanation": "反思 là động từ trừu tượng đòi hỏi tân ngữ danh từ hóa."
      }
    },
    "step5_listening": {
      "situation": "Tranh luận tâm lý giới trẻ: Áp lực cạnh tranh khốc liệt (Nội quyển) đối lập mong muốn buông bỏ (Nằm phẳng)",
      "context": "Chương trình tọa đàm tâm lý xã hội giữa chuyên gia tư vấn và sinh viên tốt nghiệp",
      "participants": "A: Chuyên gia tâm lý học lâm sàng, B: Sinh viên đại học vừa đi làm",
      "targetGoal": "Vận dụng động từ phản tư 反思…… (nhìn nhận lại / suy ngẫm sâu sắc) về các trào lưu xã hội (内卷, 躺平, 竞争, 焦虑)",
      "usageNotes": "\"内卷\" (Involution - cạnh tranh kiệt sức vô nghĩa) và \"躺平\" (Lying flat - từ chối cuốn vào guồng quay) là cặp từ khóa phản ánh tâm lý xã hội nóng nhất của giới trẻ đương đại.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "在职场竞争白热化的今天，“内卷”与“躺平”成了年轻人宣泄焦虑情绪的高频词汇。",
          "pinyin": "Zài zhíchǎng jìngzhēng báirèhuà de jīntiān, \"nèijuǎn\" yǔ \"tǎngpíng\" chéng le niánqīngrén xuānxiè jiāolǜ qíngxù de gāopín cíhuì.",
          "meaning": "Trong bối cảnh cạnh tranh công sở nóng bỏng ngày nay, \"nội quyển\" và \"nằm phẳng\" đã trở thành những từ ngữ tần suất cao để người trẻ trút bỏ nỗi niềm lo âu."
        },
        {
          "speaker": "B",
          "hanzi": "老师，大家每天加班到深夜，看似忙碌，却陷入了低水平重复竞争，身心俱疲。",
          "pinyin": "Lǎoshī, dàjiā měitiān jiābān dào shēnyè, kànsì mánglù, què xiànrù le dī shuǐpíng chóngfù jìngzhēng, shēnxīn-jùpí.",
          "meaning": "Thưa cô, mọi người ngày nào cũng tăng ca đến đêm khuya, nhìn bề ngoài tưởng bận rộn nhưng thực chất lại rơi vào cạnh tranh lặp lại ở trình độ thấp, thể xác lẫn tâm hồn đều kiệt quệ."
        },
        {
          "speaker": "A",
          "hanzi": "这提示我们需要深入反思盲目竞争的合理性，所谓“躺平”往往不是放弃奋斗，而是寻求心理喘息。",
          "pinyin": "Zhè tíshì wǒmen xūyào shēnrù fǎnsī mángmù jìngzhēng de hélǐxìng, suǒwèi \"tǎngpíng\" wǎngwǎng bú shì fàngqì fèndòu, ér shì xúnqiú xīnlǐ chuǎnxī.",
          "meaning": "Điều này nhắc nhở chúng ta cần suy ngẫm nhìn nhận lại tính hợp lý của sự cạnh tranh mù quáng, cái gọi là \"nằm phẳng\" thường không phải buông bỏ phấn đấu mà là tìm kiếm khoảng nghỉ cho tâm lý."
        },
        {
          "speaker": "B",
          "hanzi": "那么我们究竟该如何在残酷的社会竞争中保持清晰定位，摆脱无谓的精神内耗？",
          "pinyin": "Nàme wǒmen jiūjìng gāi rúhé zài cánkù de shèhuì jìngzhēng zhōng bǎochí qīngxī dìngwèi, bǎituō wúwèi de jīngshén nèihào?",
          "meaning": "Vậy rốt cuộc chúng em nên giữ định vị rõ ràng thế nào trong cuộc cạnh tranh xã hội khốc liệt, thoát khỏi sự tiêu hao tinh thần vô nghĩa?"
        },
        {
          "speaker": "A",
          "hanzi": "找到自己真正热爱的专业领域，建立不可替代的核心价值，才能从根本上化解焦虑、从容前行。",
          "pinyin": "Zhǎodào zìjǐ zhēnzhèng rè'ài de zhuānyè lǐngyù, jiànlì bùkě tìdài de héxīn jiàzhí, cái néng cóng gēnběn shang huàjiě jiāolǜ, cóngróng qiánxíng.",
          "meaning": "Tìm thấy lĩnh vực chuyên môn mà bản thân thực sự đam mê, thiết lập giá trị cốt lõi không thể thay thế, mới có thể hóa giải âu lo từ gốc rễ và tự tin tiến bước."
        }
      ],
      "audioText": "在职场竞争白热化的今天，“内卷”与“躺平”成了年轻人宣泄焦虑情绪的高频词汇。老师，大家每天加班到深夜，看似忙碌，却陷入了低水平重复竞争，身心俱疲。这提示我们需要深入反思盲目竞争的合理性，所谓“躺平”往往不是放弃奋斗，而是寻求心理喘息。那么我们究竟该如何在残酷的社会竞争中保持清晰定位，摆脱无谓的精神内耗？找到自己真正热爱的专业领域，建立不可替代的核心价值，才能从根本上化解焦虑、从容前行。",
      "question": "Theo chuyên gia tâm lý, bản chất thực sự đằng sau trào lưu \"nằm phẳng\" (躺平) của giới trẻ là gì?",
      "options": [
        "Muốn lười biếng bỏ việc vĩnh viễn",
        "Tìm kiếm khoảng nghỉ tạm thời để hồi phục tâm lý trước guồng quay cạnh tranh (寻求心理喘息)",
        "Không muốn kiếm tiền nuôi sống bản thân",
        "Thích nằm ngủ cả ngày ở nhà"
      ],
      "correctIndex": 1,
      "explanation": "Chuyên gia chỉ rõ: \"所谓‘躺平’往往不是放弃奋斗，而是寻求心理喘息\" (Cái gọi là nằm phẳng không phải bỏ cuộc, mà là tìm kiếm khoảng thở cho tâm lý)."
    },
    "step6_speaking": {
      "prompt": "Bày tỏ quan điểm sống:",
      "targetSentence": "拒绝无意义的内卷，过好真实的每一天。",
      "targetPinyin": "Jùjué wú yìyì de nèijuǎn, guò hǎo zhēnshí de měi yì tiān.",
      "targetMeaning": "Từ chối cạnh tranh vô nghĩa, sống trọn vẹn từng ngày chân thật.",
      "hint": "Ngữ điệu sâu sắc, dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Cạnh tranh mù quáng chỉ tạo thêm lo âu'",
      "words": [
        "盲目的内卷",
        "只会",
        "带来焦虑"
      ],
      "correctOrder": [
        "盲目的内卷",
        "只会",
        "带来焦虑"
      ],
      "explanation": "Chủ ngữ + 只会 + Động từ + Tân ngữ."
    },
    "step8_quiz": [
      {
        "id": "q-507-1",
        "type": "multiple-choice",
        "question": "Thuật ngữ mạng chỉ trạng thái từ chối bon chen, sống an nhiên tối giản là gì?",
        "options": [
          "内卷",
          "躺平",
          "种草",
          "刷屏"
        ],
        "correctIndex": 1,
        "explanation": "躺平 (tǎngpíng) là trào lưu nằm phẳng."
      },
      {
        "id": "q-507-2",
        "type": "multiple-choice",
        "question": "Điền từ: '面对压力，我们应该积极面对，而不是一味地陷入____。'",
        "options": [
          "焦虑",
          "风味",
          "菜系",
          "座次"
        ],
        "correctIndex": 0,
        "explanation": "Rơi vào lo âu bất an là 陷入焦虑."
      }
    ],
    "step9_challenge": {
      "title": "Bình luận xã hội",
      "taskDesc": "Viết một đoạn văn 70 chữ bằng tiếng Trung nêu quan điểm của bạn về hiện tượng '内卷' ở giới trẻ.",
      "targetPhrase": "jùjué nèijuǎn pínghéng",
      "xpReward": 60,
      "badge": "Tư Duy Xã Hội HSK 5"
    }
  },
  {
    "id": "l-508",
    "chapterId": "ch-18",
    "levelId": "lvl-5",
    "lessonNumber": 3,
    "title": "Trào lưu tiêu dùng: Gieo cỏ & Nhổ cỏ",
    "chineseTitle": "消费新趋势：种草与拔草",
    "subtitle": "Thuật ngữ mua sắm cực hot: 种草 (bị thu hút, mê mẩn món đồ) và 拔草 (xuống tiền mua thật hoặc bỏ qua sau khi xem review).",
    "objective": "Nắm vững từ vựng tiêu dùng: 种草, 拔草, 推荐, 踩雷 và phó từ 反而……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-18"
    ],
    "step1_learn": {
      "topic": "Trào lưu tiêu dùng: Gieo cỏ & Nhổ cỏ - Trọng tâm HSK 5",
      "summary": "Thuật ngữ mua sắm cực hot: 种草 (bị thu hút, mê mẩn món đồ) và 拔草 (xuống tiền mua thật hoặc bỏ qua sau khi xem review).",
      "keyTakeaways": [
        "Nắm vững từ vựng tiêu dùng: 种草, 拔草, 推荐, 踩雷 và phó từ 反而……",
        "Làm chủ điểm ngữ pháp: 反而…… (Trái lại... / Ngược lại...)"
      ],
      "audioDemoText": "皮肤不仅没变好，反而过敏红肿了。"
    },
    "step2_vocabulary": [
      {
        "id": "v-508-1",
        "hanzi": "种草",
        "pinyin": "zhòngcǎo",
        "hanviet": "Chủng thảo",
        "meaning": "Gieo cỏ, bị review mê hoặc muốn mua (Slang)",
        "radical": "Bộ 禾",
        "example": {
          "hanzi": "看了博主的测评，我被这台咖啡机深深种草了。",
          "pinyin": "Kàn le bózhu de cèpíng, wǒ bèi zhè tái kāfēijī shēnshēn zhòngcǎo le.",
          "meaning": "Xem review của blogger xong, tôi bị chiếc máy pha cà phê này mê hoặc chết mê chết mệt."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-508-2",
        "hanzi": "拔草",
        "pinyin": "bácǎo",
        "hanviet": "Bạt thảo",
        "meaning": "Nhổ cỏ, quyết định mua hoặc bỏ qua món đồ sau cân nhắc",
        "radical": "Bộ 扌",
        "example": {
          "hanzi": "犹豫了一个月，我终于去专柜把那款包拔草了。",
          "pinyin": "Yóuyù le yí gè yuè, wǒ zhōngyú qù zhuānguì bǎ nà kuǎn bāo bácǎo le.",
          "meaning": "Do dự một tháng, cuối cùng tôi đã ra quầy chính hãng 'nhổ cỏ' rước chiếc túi đó về."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-508-3",
        "hanzi": "踩雷",
        "pinyin": "cǎiléi",
        "hanviet": "Thải lôi",
        "meaning": "Dẫm phải mìn, mua phải hàng dởm/thất vọng",
        "radical": "Bộ 足",
        "example": {
          "hanzi": "盲目跟风网购，很容易踩雷买到次品。",
          "pinyin": "Mángmù gēnfēng wǎnggòu, hěn róngyì cǎiléi mǎidào cìpǐn.",
          "meaning": "Mù quáng chạy theo phong trào mua sắm online rất dễ dẫm phải mìn mua trúng hàng kém chất lượng."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-508-4",
        "hanzi": "反而",
        "pinyin": "fǎn'ér",
        "hanviet": "Phản nhi",
        "meaning": "Trái lại, ngược lại (phó từ nghịch chuyển)",
        "radical": "Bộ 又",
        "example": {
          "hanzi": "价格便宜的往往质量不过关，反而浪费钱。",
          "pinyin": "Jiàgé piányi de wǎngwǎng zhìliàng bú guòguān, fǎn'ér làngfèi qián.",
          "meaning": "Đồ rẻ thường chất lượng không đạt chuẩn, ngược lại còn tốn tiền hơn."
        },
        "pos": "Phó từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "拔",
        "hanzi": "拔",
        "pinyin": "bá",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰扌犮",
        "radical": {
          "char": "扌",
          "name": "Thủ",
          "strokes": 3
        },
        "meaning": "Nhổ bật rễ, kéo lên, nhổ cỏ",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Thủ 扌 (3 nét) -> Chữ Bạt 犮 (5 nét: ngang, phẩy, cong móc, phẩy, chấm)",
        "components": [
          "扌",
          "犮"
        ],
        "mnemonic": "Bàn tay (扌) nắm chặt dốc sức nhổ phắt gốc rễ lên khỏi đất: nhổ cỏ mua đồ (拔草)."
      },
      {
        "char": "雷",
        "hanzi": "雷",
        "pinyin": "léi",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱雨田",
        "radical": {
          "char": "雨",
          "name": "Vũ",
          "strokes": 8
        },
        "meaning": "Sấm sét, mìn bẫy, trải nghiệm tồi tệ",
        "strokesCount": 13,
        "strokeOrderText": "Bộ Vũ 雨 (8 nét) -> Bộ Điền 田 (5 nét)",
        "components": [
          "雨",
          "田"
        ],
        "mnemonic": "Cơn mưa giông (雨) giáng sấm sét vang rền xuống giữa đồng ruộng (田): dẫm phải mìn (踩雷)."
      }
    ],
    "step4_grammar": {
      "formula": "反而…… (Trái lại... / Ngược lại...)",
      "title": "Phó từ biểu thị kết quả đi ngược lại dự đoán thông thường",
      "explanation": "Đặt trước vị ngữ của phân câu thứ hai để nhấn mạnh sự bất ngờ, tương phản với phân câu trước.",
      "examples": [
        {
          "hanzi": "吃了感冒药之后，他不仅没好，反而更困了。",
          "pinyin": "Chī le gǎnmàoyào zhīhòu, tā bùjǐn méi hǎo, fǎn'ér gèng kùn le.",
          "meaning": "Sau khi uống thuốc cảm, anh ấy không những không khỏi mà ngược lại càng buồn ngủ hơn."
        }
      ],
      "commonMistake": {
        "wrong": "反而他很开心。",
        "correct": "他反而很开心。",
        "explanation": "Chủ ngữ thường đứng trước 反而."
      }
    },
    "step5_listening": {
      "situation": "Thói quen tiêu dùng mạng: Trào lưu review dẫn dắt (Gieo cỏ) và bài học tránh hàng kém chất lượng (Dẫm mìn)",
      "context": "Cuộc trò chuyện giữa hai người bạn trẻ về kinh nghiệm mua sắm trên ứng dụng Tiểu Hồng Thư (Xiaohongshu)",
      "participants": "A: Người tiêu dùng lý tính, B: Tín đồ mua sắm trực tuyến",
      "targetGoal": "Vận dụng phó từ nghịch chuyển 反而…… (trái lại... / ngược lại...) trong so sánh trải nghiệm (种草, 拔草, 踩雷)",
      "usageNotes": "\"种草\" (bị gợi ý ham muốn mua), \"拔草\" (ra tay mua hoặc dứt bỏ ham muốn) và \"踩雷\" (mua phải đồ dởm) là bộ ba thuật ngữ tiêu dùng phổ biến nhất ở Trung Quốc hiện nay.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "上个月你在小红书上被各路博主疯狂“种草”的那款降噪耳机，实际使用体验如何？",
          "pinyin": "Shàng gè yuè nǐ zài Xiǎohóngshū shang bèi gèlù bózhǔ fēngkuáng \"zhòngcǎo\" de nà kuǎn jiàngzào ěrjī, shíjì shǐyòng tǐyàn rúhé?",
          "meaning": "Tháng trước cậu bị các blogger trên Xiaohongshu \"gieo cỏ\" kịch liệt chiếc tai nghe chống ồn đó, trải nghiệm sử dụng thực tế thế nào?"
        },
        {
          "speaker": "B",
          "hanzi": "别提了，我本来满心期待地“拔草”，结果戴了不到半小时耳朵生疼，彻底“踩雷”了！",
          "pinyin": "Bié tí le, wǒ běnlái mǎnxīn qīdài de \"bácǎo\", jiéguǒ dài le bú dào bàn xiǎoshí ěrduo shēng téng, chèdǐ \"cǎiléi\" le!",
          "meaning": "Đừng nhắc đến nữa, tớ vốn ôm bao kỳ vọng đi \"nhổ cỏ\" rinh về, kết quả đeo chưa đầy nửa tiếng tai đã đau nhức, hoàn toàn \"dẫm phải mìn\" rồi!"
        },
        {
          "speaker": "A",
          "hanzi": "现在很多网红带货充斥着虚假商业推广，过度包装宣传，反而掩盖了产品本身的质量缺陷。",
          "pinyin": "Xiànzài hěn duō wǎnghóng dàihuò chōngchì zhe xūjiǎ shāngyè tuīguǎng, guòdù bāozhuāng xuānchuán, fǎn'ér yǎngài le chǎnpǐn běnshēn de zhìliàng quēxiàn.",
          "meaning": "Bây giờ rất nhiều KOL bán hàng tràn ngập quảng cáo thương mại trá hình, truyền thông thổi phồng quá mức, ngược lại càng che đậy khiếm khuyết chất lượng của bản thân sản phẩm."
        },
        {
          "speaker": "B",
          "hanzi": "盲目跟风不仅浪费钱财，反而增加了生活负担，以后消费真的必须多看中立客观的评测。",
          "pinyin": "Mángmù gēnfēng bùjǐn làngfèi qiáncái, fǎn'ér zēngjiā le shēnghuó fùdān, yǐhòu xiāofèi zhēn de bìxū duō kàn zhōnglì kèguān de píngcè.",
          "meaning": "Mù quáng chạy theo trào lưu không chỉ lãng phí tiền của, trái lại còn tăng thêm gánh nặng cho cuộc sống, sau này tiêu dùng thực sự phải xem nhiều đánh giá trung lập khách quan."
        },
        {
          "speaker": "A",
          "hanzi": "保持理性消费、按需购买，才不会被消费主义营销牵着鼻子走，赶紧去申请无理由退货吧！",
          "pinyin": "Bǎochí lǐxìng xiāofèi, àn xū gòumǎi, cái bú huì bèi xiāofèizhǔyì yíngxiāo qiān zhe bízi zǒu, gǎnjǐn qù shēnqǐng wú lǐyóu tuìhuò ba!",
          "meaning": "Giữ vững tiêu dùng lý trí, mua sắm theo đúng nhu cầu, mới không bị các chiêu trò tiếp thị tiêu dùng dắt mũi, mau đi làm đơn đổi trả hàng không lý do đi nào!"
        }
      ],
      "audioText": "上个月你在小红书上被各路博主疯狂“种草”的那款降噪耳机，实际使用体验如何？别提了，我本来满心期待地“拔草”，结果戴了不到半小时耳朵生疼，彻底“踩雷”了！现在很多网红带货充斥着虚假商业推广，过度包装宣传，反而掩盖了产品本身的质量缺陷。盲目跟风不仅浪费钱财，反而增加了生活负担，以后消费真的必须多看中立客观的评测。保持理性消费、按需购买，才不会被消费主义营销牵着鼻子走，赶紧去申请无理由退货吧！",
      "question": "Hậu quả của việc nghe theo quảng cáo thổi phồng và mua sắm theo trào lưu là gì?",
      "options": [
        "Tiết kiệm được một nửa số tiền",
        "Dẫm phải hàng dởm và tăng thêm gánh nặng tài chính (彻底踩雷，增加生活负担)",
        "Được nhãn hàng tặng quà miễn phí",
        "Trở thành KOL nổi tiếng"
      ],
      "correctIndex": 1,
      "explanation": "Người B than thở kết quả: \"彻底‘踩雷’了... 盲目跟风不仅浪费钱财，反而增加了生活负担\" (Hoàn toàn dẫm phải mìn, lãng phí tiền của và tăng thêm gánh nặng)."
    },
    "step6_speaking": {
      "prompt": "Nói về việc mua sắm:",
      "targetSentence": "理性消费，千万不要轻易盲目拔草。",
      "targetPinyin": "Lǐxìng xiāofèi, qiānwàn bú yào qīngyì mángmù bácǎo.",
      "targetMeaning": "Tiêu dùng lý trí, tuyệt đối đừng vội vàng mua sắm theo trào lưu mù quáng.",
      "hint": "Nhắc nhở chân thành."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Trời mưa không tạnh mà trái lại càng mưa to hơn'",
      "words": [
        "雨不仅没停",
        "反而",
        "越下越大"
      ],
      "correctOrder": [
        "雨不仅没停",
        "反而",
        "越下越大"
      ],
      "explanation": "Cấu trúc 不仅没... 反而..."
    },
    "step8_quiz": [
      {
        "id": "q-508-1",
        "type": "multiple-choice",
        "question": "Từ lóng mạng '踩雷' (cǎiléi) trong mua sắm có nghĩa là gì?",
        "options": [
          "Mua được hàng rẻ đẹp",
          "Mua phải hàng dởm, trải nghiệm tệ",
          "Trúng thưởng lớn",
          "Được tặng quà"
        ],
        "correctIndex": 1,
        "explanation": "踩雷 là dẫm phải bẫy hàng kém chất lượng."
      },
      {
        "id": "q-508-2",
        "type": "multiple-choice",
        "question": "Điền từ: '听了他的解释，大家不仅没释怀，心中____更加疑惑了。'",
        "options": [
          "反而",
          "甚至",
          "究竟",
          "固然"
        ],
        "correctIndex": 0,
        "explanation": "Kết quả trái ngược dự tính dùng 反而."
      }
    ],
    "step9_challenge": {
      "title": "Review sản phẩm",
      "taskDesc": "Viết một mẩu review ngắn cảnh báo bạn bè không nên '踩雷' một món hàng trên mạng.",
      "targetPhrase": "bèi zhòngcǎo cǎiléi",
      "xpReward": 60,
      "badge": "Tiêu Dùng Thông Minh"
    }
  },
  {
    "id": "l-509",
    "chapterId": "ch-18",
    "levelId": "lvl-5",
    "lessonNumber": 4,
    "title": "Video ngắn Douyin & Bán hàng Livestream",
    "chineseTitle": "短视频创作与直播带货",
    "subtitle": "Ngành kinh tế số sôi động: 直播带货 (bán hàng phát sóng trực tiếp), 粉丝 (fan), 弹幕 (bình luận trôi).",
    "objective": "Làm chủ từ vựng kinh tế truyền thông: 短视频, 粉丝, 直播, 互动 và liên từ 从而……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-18"
    ],
    "step1_learn": {
      "topic": "Video ngắn Douyin & Bán hàng Livestream - Trọng tâm HSK 5",
      "summary": "Ngành kinh tế số sôi động: 直播带货 (bán hàng phát sóng trực tiếp), 粉丝 (fan), 弹幕 (bình luận trôi).",
      "keyTakeaways": [
        "Làm chủ từ vựng kinh tế truyền thông: 短视频, 粉丝, 直播, 互动 và liên từ 从而……",
        "Làm chủ điểm ngữ pháp: 从而…… (Từ đó... / Nhờ vậy mà...)"
      ],
      "audioDemoText": "拉近与消费者的距离，从而大幅提高购买转化率。"
    },
    "step2_vocabulary": [
      {
        "id": "v-509-1",
        "hanzi": "短视频",
        "pinyin": "duǎnshìpín",
        "hanviet": "Đoản thị tần",
        "meaning": "Video ngắn (TikTok / Douyin)",
        "radical": "Bộ 矢",
        "example": {
          "hanzi": "短视频已经成为当代人获取碎片化信息的主要途径。",
          "pinyin": "Duǎnshìpín yǐjīng chéngwéi dāngdàirén huòqǔ suìpiànhuà xìnxī de zhǔyào tújìng.",
          "meaning": "Video ngắn đã trở thành con đường chính để người hiện đại tiếp nhận thông tin phân mảnh."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-509-2",
        "hanzi": "直播",
        "pinyin": "zhībō",
        "hanviet": "Trực bá",
        "meaning": "Phát sóng trực tiếp, livestream",
        "radical": "Bộ 目",
        "example": {
          "hanzi": "今晚八点知名主播将在直播间带货。",
          "pinyin": "Jīnwǎn bā diǎn zhīmíng zhǔbō jiāng zài zhībōjiān dàihuò.",
          "meaning": "8 giờ tối nay thần tượng livestream nổi tiếng sẽ phát sóng bán hàng."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-509-3",
        "hanzi": "粉丝",
        "pinyin": "fěnsī",
        "hanviet": "Phấn ti",
        "meaning": "Người hâm mộ, fan, người theo dõi",
        "radical": "Bộ 米",
        "example": {
          "hanzi": "他在社交平台上拥有超过五百万的忠实粉丝。",
          "pinyin": "Tā zài shèjiāo píngtái shang yōngyǒu chāoguò wǔbǎiwàn de zhōngshí fěnsī.",
          "meaning": "Anh ấy sở hữu hơn 5 triệu fan trung thành trên nền tảng mạng xã hội."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-509-4",
        "hanzi": "互动",
        "pinyin": "hùdòng",
        "hanviet": "Hỗ động",
        "meaning": "Tương tác qua lại",
        "radical": "Bộ 戈",
        "example": {
          "hanzi": "主播通过弹幕和观众实时互动，气氛非常热烈。",
          "pinyin": "Zhǔbō tōngguò dànmù hé guānzhòng shíshí hùdòng, qìfēn fēicháng rèliè.",
          "meaning": "Chủ phòng thông qua bình luận bay tương tác trực tiếp với khán giả, không khí vô cùng sôi nổi."
        },
        "pos": "Động từ / Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "播",
        "hanzi": "播",
        "pinyin": "bō",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰扌番",
        "radical": {
          "char": "扌",
          "name": "Thủ",
          "strokes": 3
        },
        "meaning": "Phát sóng, gieo rắc, truyền tải",
        "strokesCount": 15,
        "strokeOrderText": "Bộ Thủ 扌 (3 nét) -> Chữ Phiên 番 (12 nét)",
        "components": [
          "扌",
          "番"
        ],
        "mnemonic": "Bàn tay (扌) gieo rắc hạt giống hoặc truyền phát tín hiệu ra khắp các phương (番): phát sóng trực tiếp (直播)."
      },
      {
        "char": "粉",
        "hanzi": "粉",
        "pinyin": "fěn",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰米分",
        "radical": {
          "char": "米",
          "name": "Mễ",
          "strokes": 6
        },
        "meaning": "Bột phấn, người hâm mộ, fan",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Mễ 米 (6 nét) -> Chữ Phân 分 (4 nét)",
        "components": [
          "米",
          "分"
        ],
        "mnemonic": "Hạt gạo (米) nghiền mịn thành bột trắng tinh (分): bột phấn, người hâm mộ (粉丝)."
      }
    ],
    "step4_grammar": {
      "formula": "从而…… (Từ đó... / Nhờ vậy mà...)",
      "title": "Liên từ chỉ kết quả logic tự nhiên",
      "explanation": "Dùng để nối hai phân câu, vế sau biểu thị kết quả hoặc bước tiến phát sinh tự nhiên từ hành động ở vế trước.",
      "examples": [
        {
          "hanzi": "直播带货缩短了流通环节，从而有效降低了商品成本。",
          "pinyin": "Zhībō dàihuò suōduǎn le liútōng huánjié, cóng'ér yǒuxiào jiàngdī le shāngpǐn chéngběn.",
          "meaning": "Livestream bán hàng rút ngắn khâu lưu thông, nhờ vậy giảm giá thành sản phẩm một cách hiệu quả."
        }
      ],
      "commonMistake": {
        "wrong": "从而降低成本，缩短环节。",
        "correct": "缩短环节，从而降低成本。",
        "explanation": "从而 luôn đứng ở đầu vế kết quả phía sau."
      }
    },
    "step5_listening": {
      "situation": "Thương mại phát trực tiếp (Livestreaming e-Commerce) và nền kinh tế người theo dõi trên nền tảng số",
      "context": "Phòng phân tích chiến lược tiếp thị đa kênh của công ty e-Commerce Thượng Hải",
      "participants": "A: Giám đốc chiến lược thương mại số, B: Quản lý vận hành phòng Livestream",
      "targetGoal": "Vận dụng liên từ chỉ hệ quả tất yếu 从而…… (từ đó... / nhờ vậy mà...) trong kinh tế số",
      "usageNotes": "\"带货直播\" (Livestream bán hàng) là ngành công nghiệp tỷ đô kết hợp giữa giải trí, thuật toán đề xuất và thanh toán tức thì.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "短视频平台的算法精准推送，为我们的直播间带来了海量垂直领域的精准粉丝流量。",
          "pinyin": "Duǎnshìpín píngtái de suànfǎ jīngzhǔn tuīsòng, wèi wǒmen de zhībōjiān dài lái le hǎiliàng chuízhí lǐngyù de jīngzhǔn fěnsī liúliàng.",
          "meaning": "Thuật toán đề xuất chuẩn xác của các nền tảng video ngắn đã mang lại lượng truy cập người theo dõi vô cùng lớn và đúng tệp khách hàng cho phòng livestream của chúng ta."
        },
        {
          "speaker": "B",
          "hanzi": "主播在直播过程中通过实时弹幕与观众高频互动，生动展示产品细节，消除了消费者的顾虑。",
          "pinyin": "Zhǔbō zài zhībō guòchéng zhōng tōngguò shíshí dànmù yǔ guānzhòng gāopín hùdòng, shēngdòng zhǎnshì chǎnpǐn xìjié, xiāochú le xiāofèizhě de gùlǜ.",
          "meaning": "Host trong quá trình phát sóng qua bình luận chạy trên màn hình tương tác tần suất cao với người xem, trình diễn chi tiết sản phẩm sinh động, xóa tan âu lo của người mua."
        },
        {
          "speaker": "A",
          "hanzi": "这种沉浸式的购物体验拉近了品牌与用户的距离，从而大幅提升了订单转化率与复购率。",
          "pinyin": "Zhè zhǒng chénjìnshì de gòuwù tǐyàn lājìn le pǐnpái yǔ yònghù de jùlí, cóng'ér dàfú tíshēng le dìngdān zhuǎnhuàlǜ yǔ fùgòulǜ.",
          "meaning": "Trải nghiệm mua sắm đắm chìm này đã kéo gần khoảng cách giữa thương hiệu và người dùng, từ đó nâng cao vượt bậc tỷ lệ chuyển đổi đơn hàng và tỷ lệ mua lại."
        },
        {
          "speaker": "B",
          "hanzi": "不过我们要严把供应链质量关，绝不能为了追求短期爆单而牺牲售后服务和用户口碑。",
          "pinyin": "Búguò wǒmen yào yán bǎ gōngyìngliàn zhìliàng guān, jué bù néng wèile zhuīqiú duǎnqī bàodān ér xīshēng shòuhòu fúwù hé yònghù kǒubēi.",
          "meaning": "Dẫu vậy chúng ta phải kiểm soát gắt gao chất lượng chuỗi cung ứng, tuyệt đối không vì theo đuổi bùng nổ đơn hàng trước mắt mà hy sinh dịch vụ hậu mãi và uy tín khách hàng."
        },
        {
          "speaker": "A",
          "hanzi": "完全同意。真诚的互动与过硬的产品质量，才是直播电商实现长期可持续繁荣的根本支柱。",
          "pinyin": "Wánquán tóngyì. Zhēnchéng de hùdòng yǔ guòyìng de chǎnpǐn zhìliàng, cái shì zhībō diànshāng shíxiàn chángqī kěchíxù fánróng de gēnběn zhīzhù.",
          "meaning": "Hoàn toàn đồng ý. Sự tương tác chân thành và chất lượng sản phẩm vững vàng mới là trụ cột căn bản giúp thương mại điện tử livestream đạt được thịnh vượng bền vững lâu dài."
        }
      ],
      "audioText": "短视频平台的算法精准推送，为我们的直播间带来了海量垂直领域的精准粉丝流量。主播在直播过程中通过实时弹幕与观众高频互动，生动展示产品细节，消除了消费者的顾虑。这种沉浸式的购物体验拉近了品牌与用户的距离，从而大幅提升了订单转化率与复购率。不过我们要严把供应链质量关，绝不能为了追求短期爆单而牺牲售后服务和用户口碑。完全同意。真诚的互动与过硬的产品质量，才是直播电商实现长期可持续繁荣的根本支柱。",
      "question": "Nhờ vào yếu tố nào mà phòng livestream nâng cao vượt bậc tỷ lệ chuyển đổi đơn hàng?",
      "options": [
        "Ép buộc người xem mua hàng",
        "Tương tác đắm chìm, trực quan giải tỏa nỗi lo người mua (沉浸式体验拉近距离，高频互动消除顾虑)",
        "Hạ giá xuống 0 đồng",
        "Tắt bình luận không cho người xem nói chuyện"
      ],
      "correctIndex": 1,
      "explanation": "Giám đốc chiến lược phân tích: \"沉浸式的购物体验拉近了品牌与用户的距离，从而大幅提升了订单转化率\" (Trải nghiệm đắm chìm kéo gần khoảng cách, từ đó nâng cao tỷ lệ chuyển đổi)."
    },
    "step6_speaking": {
      "prompt": "Câu chốt đơn livestream:",
      "targetSentence": "三二一，上链接！手慢无！",
      "targetPinyin": "Sān èr yī, shàng liànjiē! Shǒu màn wú!",
      "targetMeaning": "3, 2, 1, lên đường link! Chậm tay là hết!",
      "hint": "Khẩu hiệu kinh điển của các chiến thần livestream Trung Quốc."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Tăng cường tương tác, nhờ vậy nâng cao gắn kết fan'",
      "words": [
        "加强互动",
        "从而",
        "提高粉丝黏性"
      ],
      "correctOrder": [
        "加强互动",
        "从而",
        "提高粉丝黏性"
      ],
      "explanation": "Hành động + 从而 + Kết quả."
    },
    "step8_quiz": [
      {
        "id": "q-509-1",
        "type": "multiple-choice",
        "question": "Từ '粉丝' (fěnsī) trong ngữ cảnh Internet có nghĩa là gì?",
        "options": [
          "Sợi bún miến ăn liền",
          "Người hâm mộ, followers",
          "Quạt máy",
          "Tiền bạc"
        ],
        "correctIndex": 1,
        "explanation": "粉丝 là từ mượn âm của từ Fans (người theo dõi)."
      },
      {
        "id": "q-509-2",
        "type": "multiple-choice",
        "question": "Điền từ: '提高生产效率，____降低了产品的最终售价。'",
        "options": [
          "从而",
          "与其",
          "究竟",
          "不免"
        ],
        "correctIndex": 0,
        "explanation": "Kết quả logic tất yếu dùng 从而."
      }
    ],
    "step9_challenge": {
      "title": "Livestream bán hàng",
      "taskDesc": "Mô phỏng 1 phút kịch bản chào hàng, tung mã giảm giá trong phòng livestream Douyin.",
      "targetPhrase": "shàng liànjiē dàihuò",
      "xpReward": 60,
      "badge": "Bậc Thầy Truyền Thông Số"
    }
  },
  {
    "id": "l-510",
    "chapterId": "ch-18",
    "levelId": "lvl-5",
    "lessonNumber": 5,
    "title": "Tác động của mạng xã hội đến ngôn ngữ",
    "chineseTitle": "网络文化对现代汉语的影响",
    "subtitle": "Nhìn nhận khoa học về sự phong phú lẫn nguy cơ làm mai một ngữ pháp chuẩn mực của từ lóng mạng.",
    "objective": "Làm chủ từ vựng học thuật ngôn ngữ: 演变, 丰富, 规范, 沟通 và cấu trúc 显而易见……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-18"
    ],
    "step1_learn": {
      "topic": "Tác động của mạng xã hội đến ngôn ngữ - Trọng tâm HSK 5",
      "summary": "Nhìn nhận khoa học về sự phong phú lẫn nguy cơ làm mai một ngữ pháp chuẩn mực của từ lóng mạng.",
      "keyTakeaways": [
        "Làm chủ từ vựng học thuật ngôn ngữ: 演变, 丰富, 规范, 沟通 và cấu trúc 显而易见……",
        "Làm chủ điểm ngữ pháp: 显而易见…… (Rõ ràng ai cũng thấy là...)"
      ],
      "audioDemoText": "健康的新词汇能丰富表达，但正式场合仍需遵守规范。"
    },
    "step2_vocabulary": [
      {
        "id": "v-510-1",
        "hanzi": "演变",
        "pinyin": "yǎnbiàn",
        "hanviet": "Diễn biến",
        "meaning": "Diễn biến, biến đổi dần qua thời gian",
        "radical": "Bộ 氵",
        "example": {
          "hanzi": "语言的演变生动地反映了时代的深刻变迁。",
          "pinyin": "Yǔyán de yǎnbiàn shēngdòng de fǎnyìng le shídài de shēnkè biànqiān.",
          "meaning": "Sự diễn biến của ngôn ngữ phản ánh sinh động những biến đổi sâu sắc của thời đại."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-510-2",
        "hanzi": "丰富",
        "pinyin": "fēngfù",
        "hanviet": "Phong phú",
        "meaning": "Làm phong phú, dồi dào",
        "radical": "Bộ 豆",
        "example": {
          "hanzi": "网络流行语在一定程度上丰富了汉语的表达方式。",
          "pinyin": "Wǎngluò liúxíngyǔ zài yídìng chéngdù shang fēngfù le Hànyǔ de biǎodá fāngshì.",
          "meaning": "Từ ngữ thịnh hành trên mạng ở mức độ nhất định đã làm phong phú cách diễn đạt của tiếng Hán."
        },
        "pos": "Tính từ / Động từ"
      },
      {
        "id": "v-510-3",
        "hanzi": "规范",
        "pinyin": "guīfàn",
        "hanviet": "Quy phạm",
        "meaning": "Quy chuẩn, chuẩn mực hóa",
        "radical": "Bộ 木",
        "example": {
          "hanzi": "在正式公文和学术写作中，必须坚持语言规范。",
          "pinyin": "Zài zhèngshì gōngwén hé xuéshù xiězuò zhōng, bìxū jiānchí yǔyán guīfàn.",
          "meaning": "Trong công văn chính thức và viết học thuật, bắt buộc phải giữ vững chuẩn mực ngôn ngữ."
        },
        "pos": "Danh từ / Tính từ / Động từ"
      },
      {
        "id": "v-510-4",
        "hanzi": "显而易见",
        "pinyin": "xiǎn'éryìjiàn",
        "hanviet": "Hiển nhi dị kiến",
        "meaning": "Rõ ràng ai cũng thấy (Thành ngữ)",
        "radical": "Bộ 日",
        "example": {
          "hanzi": "互联网对青年交流模式的影响是显而易见的。",
          "pinyin": "Hùliánwǎng duì qīngnián jiāoliú móshì de yǐngxiǎng shì xiǎn'éryìjiàn de.",
          "meaning": "Ảnh hưởng của Internet đối với mô thức giao lưu của giới trẻ là vô cùng rõ ràng."
        },
        "pos": "Thành ngữ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "范",
        "hanzi": "范",
        "pinyin": "fàn",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱艹氾",
        "radical": {
          "char": "艹",
          "name": "Thảo",
          "strokes": 3
        },
        "meaning": "Khuôn mẫu, chuẩn mực, phạm vi",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Thảo 艹 (3 nét) -> Chữ Phiếm 氾 (5 nét: ba chấm thủy + kỷ)",
        "components": [
          "艹",
          "氾"
        ],
        "mnemonic": "Dòng nước (氾) được bờ cỏ (艹) ngăn giữ tạo thành chuẩn mực: khuôn mẫu, quy phạm (规范)."
      },
      {
        "char": "显",
        "hanzi": "显",
        "pinyin": "xiǎn",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱日业",
        "radical": {
          "char": "日",
          "name": "Nhật",
          "strokes": 4
        },
        "meaning": "Hiển thị, lộ rõ, sáng sủa",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Nhật 日 (4 nét) -> Thân chữ Nghiệp 业 (5 nét)",
        "components": [
          "日",
          "业"
        ],
        "mnemonic": "Dưới ánh mặt trời quang minh (日), vạn vật hiện rõ mồn một: rõ ràng, hiển nhiên (显而易见)."
      }
    ],
    "step4_grammar": {
      "formula": "显而易见…… (Rõ ràng ai cũng thấy là...)",
      "title": "Thành ngữ làm vị ngữ hoặc trạng ngữ khẳng định",
      "explanation": "Dùng để khẳng định một chân lý hoặc kết quả hiển nhiên không cần phải bàn cãi.",
      "examples": [
        {
          "hanzi": "数字化时代带来的便利是显而易见的。",
          "pinyin": "Shùzìhuà shídài dàilái de biànlì shì xiǎn'éryìjiàn de.",
          "meaning": "Sự tiện lợi mà thời đại số hóa đem lại là điều rõ ràng ai cũng thấy."
        }
      ],
      "commonMistake": {
        "wrong": "显而易见他错了道理。",
        "correct": "道理是显而易见的。",
        "explanation": "Thường làm vị ngữ độc lập hoặc trạng ngữ đầu câu."
      }
    },
    "step5_listening": {
      "situation": "Tác động sâu rộng của mạng xã hội đến sự tiến hóa và quy chuẩn ngôn ngữ thời đại mới",
      "context": "Hội nghị khoa học toàn quốc về Ngôn ngữ học ứng dụng và Giáo dục Hán ngữ",
      "participants": "A: Viện trưởng Viện Ngôn ngữ Ứng dụng, B: Giảng viên Hán ngữ đối ngoại",
      "targetGoal": "Vận dụng thành ngữ 4 chữ 显而易见…… (rõ ràng ai cũng thấy...) trong luận chứng học thuật",
      "usageNotes": "\"显而易见\" là thành ngữ 4 chữ HSK 5 dùng để khẳng định một luận điểm có bằng chứng thực tế rõ ràng không thể phủ nhận.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "社交媒体的普及对现代汉语词汇系统的影响是显而易见的，语言的演变速度前所未有。",
          "pinyin": "Shèjiāo méitǐ de pǔjí duì xiàndài Hànyǔ cíhuì xìtǒng de yǐngxiǎng shì xiǎn'éryìjiàn de, yǔyán de yǎnbiàn sùdù qiánsuǒwèiyǒu.",
          "meaning": "Sự phổ cập của mạng xã hội tác động đến hệ thống từ vựng tiếng Hán hiện đại là điều hiển nhiên ai cũng thấy, tốc độ diễn biến của ngôn ngữ nhanh chưa từng có."
        },
        {
          "speaker": "B",
          "hanzi": "在教学实践中，留学生也经常接触到这些网络新词，这极大丰富了他们的日常交际语料库。",
          "pinyin": "Zài jiàoxué shíjiàn zhōng, liúxuéshēng yě jīngcháng jiēchù dào zhèxiē wǎnglùo xīncí, zhè jídà fēngfù le tāmen de rìcháng jiāojì yǔliàokù.",
          "meaning": "Trong thực tiễn giảng dạy, lưu học sinh cũng thường xuyên tiếp xúc với các từ mới trên mạng này, điều đó làm phong phú kho ngữ liệu giao tiếp thường nhật của các em rất nhiều."
        },
        {
          "speaker": "A",
          "hanzi": "然而网络用语良莠不齐，部分粗俗表达泛滥成灾，规范语言教学面临着严肃挑战。",
          "pinyin": "Rán'ér wǎnglùo yòngyǔ liángyǒu-bùqí, bùfen cūsú biǎodá fànlàn-chéngzāi, guīfàn yǔyán jiàoxué miànlín zhe yánsù tiǎozhàn.",
          "meaning": "Thế nhưng ngôn ngữ mạng vàng thau lẫn lộn, một bộ phận cách nói thô tục tràn lan, công tác chuẩn hóa giảng dạy ngôn ngữ đang đối mặt thách thức nghiêm trọng."
        },
        {
          "speaker": "B",
          "hanzi": "我们应当如何引导学生在理解网络文化活力的同时，恪守标准汉语的书面规范？",
          "pinyin": "Wǒmen yīngdāng rúhé yǐndǎo xuésheng zài lǐjiě wǎnglùo wénhuà huólì de tóngshí, kèshǒu biāozhǔn Hànyǔ de shūmiàn guīfàn?",
          "meaning": "Chúng ta nên dẫn dắt học sinh thế nào để các em vừa thấu hiểu sức sống của văn hóa mạng, vừa tuân thủ nghiêm ngặt chuẩn mực chữ viết của tiếng Hán tiêu chuẩn?"
        },
        {
          "speaker": "A",
          "hanzi": "分清语境至关重要。口头社交鼓励鲜活生动，学术研究与正式写作则必须保持规范严谨。",
          "pinyin": "Fēn qīng yǔjìng zhìguān zhòngyào. Kǒutóu shèjiāo gǔlì xiānhuó shēngdòng, xuéshù yánjiū yǔ zhèngshì xiězuò zé bìxū bǎochí guīfàn yánjǐn.",
          "meaning": "Phân định rõ ngữ cảnh là điều tối quan trọng. Giao tiếp khẩu ngữ khuyến khích tươi mới sống động, còn nghiên cứu học thuật và văn bản chính thức bắt buộc phải duy trì quy chuẩn nghiêm cẩn."
        }
      ],
      "audioText": "社交媒体的普及对现代汉语词汇系统的影响是显而易见的，语言的演变速度前所未有。在教学实践中，留学生也经常接触到这些网络新词，这极大丰富了他们的日常交际语料库。然而网络用语良莠不齐，部分粗俗表达泛滥成灾，规范语言教学面临着严肃挑战。我们应当如何引导学生在理解网络文化活力的同时，恪守标准汉语的书面规范？分清语境至关重要。口头社交鼓励鲜活生动，学术研究与正式写作则必须保持规范严谨。",
      "question": "Giải pháp căn bản để cân bằng giữa ngôn ngữ mạng và tiếng Hán quy chuẩn là gì?",
      "options": [
        "Cấm toàn bộ học sinh dùng điện thoại lên mạng",
        "Phân định rõ ngữ cảnh: giao tiếp khẩu ngữ tự do, văn bản học thuật giữ nghiêm cẩn (分清语境，学术保持规范严谨)",
        "Thay đổi toàn bộ sách giáo khoa theo tiếng lóng",
        "Không quan tâm để ngôn ngữ tự do phát triển"
      ],
      "correctIndex": 1,
      "explanation": "Viện trưởng đúc kết nguyên tắc sư phạm: \"分清语境至关重要。口头社交鼓励鲜活生动，学术研究与正式写作则必须保持规范严谨\" (Phân rõ ngữ cảnh: khẩu ngữ sinh động, học thuật chính thức phải nghiêm cẩn)."
    },
    "step6_speaking": {
      "prompt": "Thành ngữ nhận định:",
      "targetSentence": "网络用语的积极与消极影响是显而易见的。",
      "targetPinyin": "Wǎngluò yòngyǔ de jījí yǔ xiāojí yǐngxiǎng shì xiǎn'éryìjiàn de.",
      "targetMeaning": "Tác động tích cực và tiêu cực của từ ngữ mạng là điều rõ ràng ai cũng thấy.",
      "hint": "Phong thái nghị luận học thuật."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Kết quả của sự nỗ lực là điều rõ ràng ai cũng thấy'",
      "words": [
        "他的努力成果",
        "是",
        "显而易见的"
      ],
      "correctOrder": [
        "他的努力成果",
        "是",
        "显而易见的"
      ],
      "explanation": "Cấu trúc Chủ ngữ + 是 + 显而易见的."
    },
    "step8_quiz": [
      {
        "id": "q-510-1",
        "type": "multiple-choice",
        "question": "Thành ngữ nào mang ý nghĩa 'sự thật vô cùng rõ ràng, dễ nhìn thấy mà không cần chứng minh'?",
        "options": [
          "显而易见",
          "赞不绝口",
          "不见不散",
          "半途而废"
        ],
        "correctIndex": 0,
        "explanation": "显而易见 (xiǎn'éryìjiàn) là hiển nhiên, rõ như ban ngày."
      },
      {
        "id": "q-510-2",
        "type": "multiple-choice",
        "question": "Điền từ: '现代汉语在漫长的历史中不断____。'",
        "options": [
          "演变",
          "扫码",
          "挂号",
          "退房"
        ],
        "correctIndex": 0,
        "explanation": "Biến đổi dần qua năm tháng dùng 演变."
      }
    ],
    "step9_challenge": {
      "title": "Tổng kết Chương 18",
      "taskDesc": "Viết bài luận ngắn 90 chữ trình bày suy nghĩ của bạn về từ lóng mạng trong kỳ thi HSK.",
      "targetPhrase": "xiǎn'éryìjiàn guīfàn",
      "xpReward": 60,
      "badge": "Học Giả Ngôn Ngữ Học"
    }
  },
  {
    "id": "l-511",
    "chapterId": "ch-19",
    "levelId": "lvl-5",
    "lessonNumber": 1,
    "title": "Tết Nguyên Đán, Đêm trừ tịch & Bữa cơm tất niên",
    "chineseTitle": "春节除夕与年夜饭",
    "subtitle": "Khám phá phong tục Tết cổ truyền: 除夕 (đêm 30 Tết), 年夜饭 (cơm tất niên), 守岁 (đón giao thừa).",
    "objective": "Làm chủ từ vựng lễ hội: 除夕, 团圆, 年夜饭, 拜年 và động từ 意味着……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-19"
    ],
    "step1_learn": {
      "topic": "Tết Nguyên Đán, Đêm trừ tịch & Bữa cơm tất niên - Trọng tâm HSK 5",
      "summary": "Khám phá phong tục Tết cổ truyền: 除夕 (đêm 30 Tết), 年夜饭 (cơm tất niên), 守岁 (đón giao thừa).",
      "keyTakeaways": [
        "Làm chủ từ vựng lễ hội: 除夕, 团圆, 年夜饭, 拜年 và động từ 意味着……",
        "Làm chủ điểm ngữ pháp: 意味着…… (Có nghĩa là... / Báo hiệu...)"
      ],
      "audioDemoText": "当然是热腾腾的饺子，因为饺子的形状像元宝，包着好运与团圆。"
    },
    "step2_vocabulary": [
      {
        "id": "v-511-1",
        "hanzi": "除夕",
        "pinyin": "chúxī",
        "hanviet": "Trừ tịch",
        "meaning": "Đêm giao thừa, chiều 30 Tết",
        "radical": "Bộ 阝",
        "example": {
          "hanzi": "大年三十除夕之夜，家家户户灯火通明。",
          "pinyin": "Dànián sānshí chúxī zhī yè, jiājiā-hùhù dēnghuǒ tōngmíng.",
          "meaning": "Đêm giao thừa 30 Tết, nhà nhà sáng rực ánh đèn."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-511-2",
        "hanzi": "团圆",
        "pinyin": "tuányuán",
        "hanviet": "Đoàn viên",
        "meaning": "Đoàn tụ sum vầy, sum họp",
        "radical": "Bộ 囗",
        "example": {
          "hanzi": "春节是全家老小团圆的最重要时刻。",
          "pinyin": "Chūnjié shì quánjiā lǎoxiǎo tuányuán de zuì zhòngyào shíkè.",
          "meaning": "Tết Nguyên Đán là thời khắc quan trọng nhất để già trẻ cả nhà sum vầy."
        },
        "pos": "Động từ / Tính từ"
      },
      {
        "id": "v-511-3",
        "hanzi": "年夜饭",
        "pinyin": "niányèfàn",
        "hanviet": "Niên dạ phạn",
        "meaning": "Bữa cơm tất niên tối 30 Tết",
        "radical": "Bộ 夕",
        "example": {
          "hanzi": "一家人围坐在一起吃丰盛的年夜饭。",
          "pinyin": "Yì jiā rén wéizuò zài yìqǐ chī fēngshèng de niányèfàn.",
          "meaning": "Cả nhà quây quần bên nhau ăn bữa cơm tất niên thịnh soạn."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-511-4",
        "hanzi": "意味着",
        "pinyin": "yìwèizhe",
        "hanviet": "Ý vị trước",
        "meaning": "Có nghĩa là, báo hiệu điều gì",
        "radical": "Bộ 心",
        "example": {
          "hanzi": "春天的到来，意味着万物复苏与新的开始。",
          "pinyin": "Chūntiān de dàolái, yìwèizhe wànwù fùsū yǔ xīn de kāishǐ.",
          "meaning": "Mùa xuân về báo hiệu vạn vật hồi sinh và những khởi đầu mới."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "夕",
        "hanzi": "夕",
        "pinyin": "xī",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "夕",
        "radical": {
          "char": "夕",
          "name": "Tịch",
          "strokes": 3
        },
        "meaning": "Buổi chiều tối, đêm giao thừa",
        "strokesCount": 3,
        "strokeOrderText": "Phẩy -> Ngang gập phẩy -> Chấm (夕)",
        "components": [
          "夕"
        ],
        "mnemonic": "Vầng trăng khuyết ló dạng lúc hoàng hôn buông xuống: chiều tà, đêm trừ tịch (除夕)."
      },
      {
        "char": "圆",
        "hanzi": "圆",
        "pinyin": "yuán",
        "structure": {
          "code": "full_enclosure",
          "name": "Toàn bao vi (全包围结构)",
          "symbol": "⿴"
        },
        "ids": "⿴囗员",
        "radical": {
          "char": "囗",
          "name": "Vi",
          "strokes": 3
        },
        "meaning": "Tròn trịa, đoàn viên sum vầy",
        "strokesCount": 10,
        "strokeOrderText": "Khung ngoài 囗 (sổ, ngang gập) -> Chữ Viên 员 bên trong (khẩu + bối) -> Đóng khung đáy",
        "components": [
          "囗",
          "员"
        ],
        "mnemonic": "Mọi người (员) ngồi quây quần trọn vẹn trong một vòng tròn ấm cúng (囗): đoàn viên (团圆)."
      }
    ],
    "step4_grammar": {
      "formula": "意味着…… (Có nghĩa là... / Báo hiệu...)",
      "title": "Động từ biểu thị ý nghĩa sâu xa hoặc hệ quả tất yếu",
      "explanation": "Đặt 'Sự việc + 意味着 + Ý nghĩa / Hệ quả' để khẳng định giá trị biểu tượng của hiện tượng.",
      "examples": [
        {
          "hanzi": "除夕团圆，意味着告别过去的一年并迎来新生。",
          "pinyin": "Chúxī tuányuán, yìwèizhe gàobié guòqù de yì nián bìng yínglái xīnshēng.",
          "meaning": "Giao thừa đoàn tụ mang ý nghĩa giã từ năm cũ và đón chào cuộc sống mới."
        }
      ],
      "commonMistake": {
        "wrong": "他意味着笑了。",
        "correct": "他的微笑意味着答应了。",
        "explanation": "意味着 phải đi cùng một mệnh đề hoặc danh từ ý nghĩa."
      }
    },
    "step5_listening": {
      "situation": "Đêm giao thừa trừ tịch, bữa cơm tất niên và văn hóa đoàn viên sum họp của người Á Đông",
      "context": "Bên bàn tiệc tất niên ấm cúng của đại gia đình ba thế hệ vào tối 30 Tết",
      "participants": "A: Người ông trong gia đình (Trưởng bối), B: Cháu nội đi du học về quê đón Tết",
      "targetGoal": "Vận dụng cấu trúc 意味着…… (có nghĩa là... / báo hiệu...) trong diễn đạt phong tục truyền thống (除夕, 团圆, 年夜饭)",
      "usageNotes": "\"除夕\" (Trừ tịch - đêm xua tan điều cũ đón điều mới) là thời khắc thiêng liêng nhất trong năm của văn hóa Hán tự và Việt Nam.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "孙子啊，平时你们在大城市求学工作，唯有除夕这顿年夜饭，全家人围坐在一起才算真正团圆。",
          "pinyin": "Sūnzi a, píngshí nǐmen zài dà chéngshì qiúxué gōngzuò, wéiyǒu Chúxī zhè dùn niányèfàn, quánjiā rén wéizuò zài yìqǐ cái suàn zhēnzhèng tuányuán.",
          "meaning": "Cháu ơi, bình thường các cháu bận rộn học tập làm việc nơi thành phố lớn, chỉ có bữa cơm tất niên đêm trừ tịch này, cả nhà ngồi quây quần bên nhau mới tính là sum họp đoàn viên thực sự."
        },
        {
          "speaker": "B",
          "hanzi": "爷爷，桌上有热气腾腾的水饺、年糕和红烧鱼，每一道菜都饱含着吉祥的寓意吧？",
          "pinyin": "Yéye, zhuō shang yǒu rèqì-téngténg de shuǐjiǎo, niángāo hé hóngshāoyú, měi yí dào cài dōu bǎohán zhe jíxiáng de yùyì ba?",
          "meaning": "Ông nội ơi, trên bàn có sủi cảo nóng hổi, bánh tổ và cá kho đỏ, mỗi món ăn đều chứa chan ngụ ý cát tường phải không ông?"
        },
        {
          "speaker": "A",
          "hanzi": "年年有余，步步高升！吃年夜饭不仅意味着辞旧迎新，更象征着血脉亲情与家风文化的代代延续。",
          "pinyin": "Niánnián-yǒuyú, bùbù-gāoshēng! Chī niányèfàn bùjǐn yìwèizhe cíjiù-yíngxīn, gèng xiàngzhēng zhe xuèmài qīnqíng yǔ jiāfēng wénhuà de dàidài yánxù.",
          "meaning": "Năm năm có dư, từng bước lên cao! Ăn cơm tất niên không chỉ có nghĩa là tiễn năm cũ nghênh năm mới, mà còn tượng trưng cho tình thân máu mủ và gia phong văn hóa kế tục qua các thế hệ."
        },
        {
          "speaker": "B",
          "hanzi": "无论漂泊多远，故乡的年味和家人的牵挂永远是游子心中最温暖的心灵港湾。",
          "pinyin": "Wúlùn piāobó duō yuǎn, gùxiāng de niánwèi hé jiārén de qiānguà yǒngyuǎn shì yóuzǐ xīnzhōng zuì wēnnuǎn de xīnlíng gǎngwān.",
          "meaning": "Bất luận tha hương bôn ba xa xôi nhường nào, phong vị Tết quê hương và nỗi ngóng trông của người thân mãi là bến đỗ ấm áp nhất trong lòng người con xa xứ."
        },
        {
          "speaker": "A",
          "hanzi": "说得好！来，十二点钟声马上敲响，我们全家一起举杯，祈愿新的一年国泰民安、万事胜意！",
          "pinyin": "Shuō de hǎo! Lái, shí'èr diǎn zhōngshēng mǎshàng qiāoxiǎng, wǒmen quánjiā yìqǐ jǔbēi, qíyuàn xīn de yì nián guótài-mín'ān, wànshì-shèngyì!",
          "meaning": "Nói hay lắm! Nào, tiếng chuông 12 giờ sắp điểm, cả gia đình chúng ta cùng nâng ly, nguyện cầu một năm mới quốc thái dân an, vạn sự hanh thông!"
        }
      ],
      "audioText": "孙子啊，平时你们在大城市求学工作，唯有除夕这顿年夜饭，全家人围坐在一起才算真正团圆。爷爷，桌上有热气腾腾的水饺、年糕和红烧鱼，每一道菜都饱含着吉祥的寓意吧？年年有余，步步高升！吃年夜饭不仅意味着辞旧迎新，更象征着血脉亲情与家风文化的代代延续。无论漂泊多远，故乡的年味和家人的牵挂永远是游子心中最温暖的心灵港湾。说得好！来，十二点钟声马上敲响，我们全家一起举杯，祈愿新的一年国泰民安、万事胜意！",
      "question": "Bữa cơm tất niên đêm trừ tịch mang ý nghĩa biểu trưng văn hóa cốt lõi nào?",
      "options": [
        "Chỉ để ăn no một bữa",
        "Tiễn cũ đón mới, tình thân máu mủ và sự tiếp nối văn hóa gia đình (辞旧迎新，象征亲情延续与团圆)",
        "Để so sánh ai giàu hơn",
        "Bắt buộc mọi người không được ngủ"
      ],
      "correctIndex": 1,
      "explanation": "Người ông giải thích sâu sắc: \"吃年夜饭不仅意味着辞旧迎新，更象征着血脉亲情与家风文化的代代延续\" (Ăn cơm tất niên tiễn cũ đón mới, tượng trưng tình thân máu mủ và gia phong tiếp nối)."
    },
    "step6_speaking": {
      "prompt": "Chúc tết cổ truyền:",
      "targetSentence": "祝全家除夕阖家团圆，新年万事如意！",
      "targetPinyin": "Zhù quánjiā chúxī héjiā tuányuán, xīnnián wànshì rúyì!",
      "targetMeaning": "Chúc cả nhà giao thừa sum vầy đoàn viên, năm mới vạn sự như ý!",
      "hint": "Lời chúc cát tường hoan hỷ."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Đoàn viên mang ý nghĩa hạnh phúc của gia đình'",
      "words": [
        "家庭的幸福",
        "团圆",
        "意味着"
      ],
      "correctOrder": [
        "团圆",
        "意味着",
        "家庭的幸福"
      ],
      "explanation": "Chủ ngữ + 意味着 + Ý nghĩa."
    },
    "step8_quiz": [
      {
        "id": "q-511-1",
        "type": "multiple-choice",
        "question": "Tối ngày 30 tháng Chạp âm lịch trong tiếng Trung gọi là gì?",
        "options": [
          "除夕 (Đêm trừ tịch / Giao thừa)",
          "中秋",
          "端午",
          "清明"
        ],
        "correctIndex": 0,
        "explanation": "除夕 (chúxī) là đêm 30 Tết."
      },
      {
        "id": "q-511-2",
        "type": "multiple-choice",
        "question": "Điền từ: '春风吹绿了柳树，____寒冷的冬天已经结束。'",
        "options": [
          "意味着",
          "所谓",
          "究竟",
          "固然"
        ],
        "correctIndex": 0,
        "explanation": "Báo hiệu điều gì dùng 意味着."
      }
    ],
    "step9_challenge": {
      "title": "Lời chúc giao thừa",
      "taskDesc": "Ghi âm một đoạn lời chúc Tết Nguyên Đán ý nghĩa dành tặng gia đình và người thân.",
      "targetPhrase": "chúxī tuányuán niányèfàn",
      "xpReward": 60,
      "badge": "Sứ Giả Văn Hóa Tết"
    }
  },
  {
    "id": "l-512",
    "chapterId": "ch-19",
    "levelId": "lvl-5",
    "lessonNumber": 2,
    "title": "Tết Trung Thu & Ý nghĩa đoàn viên",
    "chineseTitle": "中秋赏月与团圆习俗",
    "subtitle": "Truyền thuyết Hằng Nga, phong tục ngắm trăng tròn, ăn bánh trung thu và gửi gắm nỗi nhớ người thân.",
    "objective": "Làm chủ từ vựng Trung Thu: 中秋, 赏月, 月饼, 思念 và động từ 寄托……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-19"
    ],
    "step1_learn": {
      "topic": "Tết Trung Thu & Ý nghĩa đoàn viên - Trọng tâm HSK 5",
      "summary": "Truyền thuyết Hằng Nga, phong tục ngắm trăng tròn, ăn bánh trung thu và gửi gắm nỗi nhớ người thân.",
      "keyTakeaways": [
        "Làm chủ từ vựng Trung Thu: 中秋, 赏月, 月饼, 思念 và động từ 寄托……",
        "Làm chủ điểm ngữ pháp: 寄托…… (Gửi gắm... vào...)"
      ],
      "audioDemoText": "即使相隔千里也能共享同一轮明月。"
    },
    "step2_vocabulary": [
      {
        "id": "v-512-1",
        "hanzi": "中秋",
        "pinyin": "zhōngqiū",
        "hanviet": "Trung Thu",
        "meaning": "Tết Trung Thu (rằm tháng Tám)",
        "radical": "Bộ 禾",
        "example": {
          "hanzi": "八月十五中秋佳节，明月当空照。",
          "pinyin": "Bā yuè shíwǔ Zhōngqiū jiājié, míngyuè dāngkōng zhào.",
          "meaning": "Rằm tháng Tám tết Trung Thu, trăng sáng vằng vặc giữa trời."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-512-2",
        "hanzi": "赏月",
        "pinyin": "shǎngyuè",
        "hanviet": "Thưởng nguyệt",
        "meaning": "Ngắm trăng, thưởng trăng",
        "radical": "Bộ 贝",
        "example": {
          "hanzi": "全家人聚在庭院里一边品茶一边赏月。",
          "pinyin": "Quánjiā rén jù zài tíngyuàn lǐ yìbiān pǐnchá yìbiān shǎngyuè.",
          "meaning": "Cả nhà tụ họp trong sân vừa thưởng trà vừa ngắm trăng."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-512-3",
        "hanzi": "月饼",
        "pinyin": "yuèbǐng",
        "hanviet": "Nguyệt bính",
        "meaning": "Bánh trung thu",
        "radical": "Bộ 食",
        "example": {
          "hanzi": "中秋节吃月饼象征着生活的圆满与甜美。",
          "pinyin": "Zhōngqiūjié chī yuèbǐng xiàngzhēng zhe shēnghuó de yuánmǎn yǔ tiánměi.",
          "meaning": "Tết Trung Thu ăn bánh trung thu tượng trưng cho cuộc sống viên mãn và ngọt ngào."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-512-4",
        "hanzi": "寄托",
        "pinyin": "jìtuō",
        "hanviet": "Ký thác",
        "meaning": "Gửi gắm (tình cảm, nỗi nhớ)",
        "radical": "Bộ 宀",
        "example": {
          "hanzi": "古代诗人常常借明月寄托对故乡亲人的思念。",
          "pinyin": "Gǔdài shīrén chángcháng jiè míngyuè jìtuō duì gùxiāng qīnrén de sīniàn.",
          "meaning": "Các thi nhân thời xưa thường mượn ánh trăng sáng gửi gắm nỗi nhớ thương quê nhà và người thân."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "赏",
        "hanzi": "赏",
        "pinyin": "shǎng",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱⺌𫎬",
        "radical": {
          "char": "贝",
          "name": "Bối",
          "strokes": 4
        },
        "meaning": "Thưởng trăng, tán thưởng, khen ngợi",
        "strokesCount": 12,
        "strokeOrderText": "Phần Thượng ⺌冖 (5 nét) -> Phần chữ Bối 贝 bên dưới (sổ, ngang gập, phẩy, chấm)",
        "components": [
          "尚",
          "贝"
        ],
        "mnemonic": "Dâng tặng tiền của quý giá (贝) để ca ngợi và tán thưởng vẻ đẹp tuyệt trần: ngắm trăng (赏月)."
      },
      {
        "char": "饼",
        "hanzi": "饼",
        "pinyin": "bǐng",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰饣并",
        "radical": {
          "char": "饣",
          "name": "Thực",
          "strokes": 3
        },
        "meaning": "Bánh bột nướng, bánh nướng trung thu",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Thực 饣 (3 nét) -> Chữ Tinh 并 (6 nét)",
        "components": [
          "饣",
          "并"
        ],
        "mnemonic": "Bột bánh (饣) ép dẹt song song (并) nướng vàng ruộm: bánh nướng, bánh trung thu (月饼)."
      }
    ],
    "step4_grammar": {
      "formula": "寄托…… (Gửi gắm... vào...)",
      "title": "Động từ biểu thị sự ký thác tâm tư, cảm xúc",
      "explanation": "Thường dùng cấu trúc '借 / 把……寄托在……上' để diễn đạt việc gửi gắm tình cảm vào sự vật cụ thể.",
      "examples": [
        {
          "hanzi": "诗人把对家乡深切的思念寄托在天边的明月上。",
          "pinyin": "Shīrén bǎ duì jiāxiāng shēnqiè de sīniàn jìtuō zài tiānbiān de míngyuè shang.",
          "meaning": "Nhà thơ gửi gắm nỗi nhớ quê hương sâu sắc vào vầng trăng sáng chân trời."
        }
      ],
      "commonMistake": {
        "wrong": "寄托他在月亮。",
        "correct": "把思念寄托在明月上。",
        "explanation": "Cần dùng giới từ 把 và 在 để tạo thành cụm hoàn chỉnh."
      }
    },
    "step5_listening": {
      "situation": "Tết Trung Thu, ngắm trăng rằm tháng Tám, thưởng thức bánh trung thu và gửi gắm nỗi nhớ",
      "context": "Sân thượng ngắm trăng của khu vườn truyền thống Tô Châu đêm rằm tháng Tám",
      "participants": "A: Người dẫn chuyện văn hóa thi ca, B: Du khách yêu văn hóa Á Đông",
      "targetGoal": "Vận dụng động từ 寄托…… (gửi gắm... vào...) trong văn cảnh thi ca tình cảm (中秋, 赏月, 月饼, 寄托)",
      "usageNotes": "\"但愿人长久，千里共婵娟\" (Nguyện chúc người bình an trường thọ, dù nghìn dặm xa xôi vẫn cùng ngắm ánh trăng tròn) là danh tác Tô Thức gửi gắm ý nghĩa Tết Trung Thu.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "中秋之夜皓月当空，自古以来中国人便有阖家赏月、品尝月饼的雅致习俗。",
          "pinyin": "Zhōngqiū zhī yè hàoyuè dāngkōng, zìgǔ yǐlái Zhōngguó rén biàn yǒu héjiā shǎngyuè, pǐncháng yuèbǐng de yǎzhì xísú.",
          "meaning": "Đêm Trung Thu vầng trăng vằng vặc trên không trung, tự cổ chí kim người Trung Quốc đã có phong tục tao nhã cả nhà cùng ngắm trăng, thưởng thức bánh trung thu."
        },
        {
          "speaker": "B",
          "hanzi": "圆圆的月饼象征着家庭圆满，在苏轼的词作中，月亮更寄托了对远方亲人的深切思念。",
          "pinyin": "Yuányuán de yuèbǐng xiàngzhēng zhe jiātíng yuánmǎn, zài Sū Shì de cìzuò zhōng, yuèliang gèng jìtuō le duì yuǎnfāng qīnrén de shēnqiè sīniàn.",
          "meaning": "Chiếc bánh trung thu tròn đầy tượng trưng cho gia đình viên mãn, trong từ khúc của Tô Thức, ánh trăng càng gửi gắm nỗi nhớ nhung da diết hướng về người thân phương xa."
        },
        {
          "speaker": "A",
          "hanzi": "“但愿人长久，千里共婵娟”，这句千古名句将个人的离愁别绪升华为对天下苍生的美好祝愿。",
          "pinyin": "\"Dàn yuàn rén chángjiǔ, qiānlǐ gòng chánjuān\", zhè jù qiāngǔ míngjù jiāng gèrén de líchóubiéxù shēnghuá wéi duì tiānxià cāngshēng de měihǎo zhùyuàn.",
          "meaning": "\"Nguyện chúc người trường thọ, ngàn dặm sẻ chia ánh trăng đẹp\", câu thơ ngàn năm bất hủ này đã thăng hoa nỗi sầu ly biệt cá nhân thành lời chúc phúc tốt lành cho muôn dân thiên hạ."
        },
        {
          "speaker": "B",
          "hanzi": "在越南，中秋节除了家庭团聚，也是孩子们的欢乐节日，提灯游行热闹非凡。",
          "pinyin": "Zài Yuènán, Zhōngqiūjié chúle jiātíng tuánjù, yě shì háizimen de huānlè jiérì, tídēng yóuxíng rènào fēifán.",
          "meaning": "Tại Việt Nam, Tết Trung Thu bên cạnh sự sum họp gia đình, cũng là ngày hội tưng bừng của trẻ thơ, rước đèn phá cỗ vô cùng náo nhiệt."
        },
        {
          "speaker": "A",
          "hanzi": "虽有地域特色之别，但寄托于同一轮明月下的团圆情怀与人间温情，却是千百年来相通的。",
          "pinyin": "Suī yǒu dìyù tèsè zhī bié, dàn jìtuō yú tóngyì lún míngyuè xià de tuányuán qínghuái yǔ rénjiān wēnqíng, què shì qiānbǎi nián lái xiāngtōng de.",
          "meaning": "Dẫu có nét đặc sắc riêng theo vùng miền, nhưng ân tình đoàn viên và hơi ấm nhân gian gửi gắm dưới cùng một vầng trăng sáng thì hàng ngàn năm qua luôn tương thông đồng điệu."
        }
      ],
      "audioText": "中秋之夜皓月当空，自古以来中国人便有阖家赏月、品尝月饼的雅致习俗。圆圆的月饼象征着家庭圆满，在苏轼的词作中，月亮更寄托了对远方亲人的深切思念。“但愿人长久，千里共婵娟”，这句千古名句将个人的离愁别绪升华为对天下苍生的美好祝愿。在越南，中秋节除了家庭团聚，也是孩子们的欢乐节日，提灯游行热闹非凡。虽有地域特色之别，但寄托于同一轮明月下的团圆情怀与人间温情，却是千百年来相通的。",
      "question": "Hình tượng ánh trăng tròn rằm tháng Tám gửi gắm nỗi niềm tâm sự gì?",
      "options": [
        "Nỗi sợ bóng đêm",
        "Nỗi nhớ nhung da diết hướng về người thân phương xa và khát vọng đoàn viên (寄托对远方亲人的思念与团圆祝愿)",
        "Mong muốn trời mưa to",
        "Lời đe dọa người khác"
      ],
      "correctIndex": 1,
      "explanation": "Đoạn thoại khẳng định: \"月亮更寄托了对远方亲人的深切思念... 寄托于同一轮明月下的团圆情怀\" (Ánh trăng gửi gắm nỗi nhớ thương sâu sắc tới người thân phương xa và khát vọng đoàn viên)."
    },
    "step6_speaking": {
      "prompt": "Đọc câu thơ kinh điển:",
      "targetSentence": "但愿人长久，千里共婵娟。",
      "targetPinyin": "Dàn yuàn rén chángjiǔ, qiānlǐ gòng chánjuān.",
      "targetMeaning": "Chỉ mong người bình an trường cửu, dẫu xa ngàn dặm cùng chung bóng trăng.",
      "hint": "Ngữ điệu sâu lắng thi vị."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Nhà thơ gửi gắm nỗi nhớ vào vầng trăng'",
      "words": [
        "寄托在明月上",
        "诗人把",
        "深情的思念"
      ],
      "correctOrder": [
        "诗人把",
        "深情的思念",
        "寄托在明月上"
      ],
      "explanation": "Cấu trúc 把 + Nỗi nhớ + 寄托在..."
    },
    "step8_quiz": [
      {
        "id": "q-512-1",
        "type": "multiple-choice",
        "question": "Tết Trung Thu rơi vào ngày nào trong lịch âm lịch?",
        "options": [
          "Tám tháng Tư",
          "Mười lăm tháng Tám (八月十五)",
          "Mùng năm tháng Năm",
          "Tết Nguyên Tiêu rằm tháng Giêng"
        ],
        "correctIndex": 1,
        "explanation": "Rằm tháng Tám: 农历八月十五."
      },
      {
        "id": "q-512-2",
        "type": "multiple-choice",
        "question": "Điền từ: '中秋月饼____了人们对美好团圆的向往。'",
        "options": [
          "寄托",
          "甚至",
          "究竟",
          "与其"
        ],
        "correctIndex": 0,
        "explanation": "Gửi gắm ước vọng dùng 寄托."
      }
    ],
    "step9_challenge": {
      "title": "Thơ Trung Thu",
      "taskDesc": "Ngâm vịnh 2 câu thơ nổi tiếng về Tết Trung Thu và giải thích ý nghĩa bằng tiếng Trung.",
      "targetPhrase": "qiānlǐ gòng chánjuān",
      "xpReward": 60,
      "badge": "Thi Sĩ Thưởng Nguyệt"
    }
  },
  {
    "id": "l-513",
    "chapterId": "ch-19",
    "levelId": "lvl-5",
    "lessonNumber": 3,
    "title": "Tết Đoan Ngọ & Đua thuyền rồng",
    "chineseTitle": "端午赛龙舟与纪念屈原",
    "subtitle": "Khám phá ngày 5/5 âm lịch: Đua thuyền rồng (赛龙舟), ăn bánh ú lá tre (粽子) và tưởng nhớ Khuất Nguyên.",
    "objective": "Làm chủ từ vựng lễ hội Đoan Ngọ: 端午, 龙舟, 粽子, 纪念 và cấu trúc 源于……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-19"
    ],
    "step1_learn": {
      "topic": "Tết Đoan Ngọ & Đua thuyền rồng - Trọng tâm HSK 5",
      "summary": "Khám phá ngày 5/5 âm lịch: Đua thuyền rồng (赛龙舟), ăn bánh ú lá tre (粽子) và tưởng nhớ Khuất Nguyên.",
      "keyTakeaways": [
        "Làm chủ từ vựng lễ hội Đoan Ngọ: 端午, 龙舟, 粽子, 纪念 và cấu trúc 源于……",
        "Làm chủ điểm ngữ pháp: 源于…… (Bắt nguồn từ... / Có cội nguồn từ...)"
      ],
      "audioDemoText": "为了不让鱼虾损伤屈原的遗体，便投江喂鱼。"
    },
    "step2_vocabulary": [
      {
        "id": "v-513-1",
        "hanzi": "端午",
        "pinyin": "duānwǔ",
        "hanviet": "Đoan Ngọ",
        "meaning": "Tết Đoan Ngọ (mùng 5 tháng 5 âm lịch)",
        "radical": "Bộ 立",
        "example": {
          "hanzi": "五月初五端午节是中国的传统法定节日。",
          "pinyin": "Wǔ yuè chū wǔ Duānwǔjié shì Zhōngguó de chuántǒng fǎdìng jiérì.",
          "meaning": "Mùng 5 tháng 5 Tết Đoan Ngọ là ngày lễ truyền thống theo luật định của Trung Quốc."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-513-2",
        "hanzi": "龙舟",
        "pinyin": "lóngzhōu",
        "hanviet": "Long chu",
        "meaning": "Thuyền rồng (dùng để đua)",
        "radical": "Bộ 舟",
        "example": {
          "hanzi": "江面上龙舟竞赛鼓声震天，气氛极其热烈。",
          "pinyin": "Jiāngmiàn shang lóngzhōu jìngsài gǔshēng zhèntiān, qìfēn jíqí rèliè.",
          "meaning": "Trên mặt sông cuộc đua thuyền rồng tiếng trống vang trời, không khí vô cùng sôi động."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-513-3",
        "hanzi": "粽子",
        "pinyin": "zòngzi",
        "hanviet": "Túng tử",
        "meaning": "Bánh ú, bánh chưng tro gói lá tre",
        "radical": "Bộ 米",
        "example": {
          "hanzi": "端午节吃粽子的习俗已经流传了两千多年。",
          "pinyin": "Duānwǔjié chī zòngzi de xísú yǐjīng liúchuán le liǎngqiān duō nián.",
          "meaning": "Phong tục ăn bánh ú tết Đoan Ngọ đã lưu truyền hơn 2000 năm."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-513-4",
        "hanzi": "源于",
        "pinyin": "yuányú",
        "hanviet": "Nguyên vu",
        "meaning": "Bắt nguồn từ, có nguồn gốc từ",
        "radical": "Bộ 氵",
        "example": {
          "hanzi": "端午节赛龙舟的习俗源于对伟大诗人屈原的纪念。",
          "pinyin": "Duānwǔjié sài lóngzhōu de xísú yuányú duì wěidà shīrén Qū Yuán de jìniàn.",
          "meaning": "Tập tục đua thuyền rồng tết Đoan Ngọ bắt nguồn từ việc tưởng nhớ nhà thơ vĩ đại Khuất Nguyên."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "舟",
        "hanzi": "舟",
        "pinyin": "zhōu",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "舟",
        "radical": {
          "char": "舟",
          "name": "Chu",
          "strokes": 6
        },
        "meaning": "Chiếc thuyền mộc, thuyền rồng",
        "strokesCount": 6,
        "strokeOrderText": "Phẩy -> Sổ -> Ngang gập móc -> Chấm -> Chấm -> Ngang (舟)",
        "components": [
          "舟"
        ],
        "mnemonic": "Chiếc thuyền mộc khoét từ thân cây lướt đi trên mặt nước: thuyền rồng (龙舟)."
      },
      {
        "char": "粽",
        "hanzi": "粽",
        "pinyin": "zòng",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰米宗",
        "radical": {
          "char": "米",
          "name": "Mễ",
          "strokes": 6
        },
        "meaning": "Bánh chưng tro, bánh ú nếp gói lá",
        "strokesCount": 14,
        "strokeOrderText": "Bộ Mễ 米 (6 nét) -> Chữ Tông 宗 (8 nét: miên + thị)",
        "components": [
          "米",
          "宗"
        ],
        "mnemonic": "Gạo nếp ngon (米) gói lá cúng dâng lên tổ tiên (宗) ngày lễ Tết: bánh ú Đoan Ngọ (粽子)."
      }
    ],
    "step4_grammar": {
      "formula": "源于…… (Bắt nguồn từ... / Có cội nguồn từ...)",
      "title": "Động từ kết hợp giới từ chỉ nguồn gốc lịch sử",
      "explanation": "Dùng trong các bài thuyết minh văn hóa để giải thích gốc gác cội nguồn của phong tục tập quán.",
      "examples": [
        {
          "hanzi": "这项古老的传统体育运动源于两千年前的水上救援。",
          "pinyin": "Zhè xiàng gǔlǎo de chuántǒng tǐyù yùndòng yuányú liǎngqiān nián qián de shuǐshàng jiùyuán.",
          "meaning": "Môn thể thao truyền thống cổ xưa này bắt nguồn từ hoạt động cứu hộ trên nước cách đây 2000 năm."
        }
      ],
      "commonMistake": {
        "wrong": "源于从中国。",
        "correct": "源于中国古代。",
        "explanation": "源于 đã hàm chứa nghĩa 'từ', không dùng thêm 从."
      }
    },
    "step5_listening": {
      "situation": "Tết Đoan Ngọ, đua thuyền rồng và truyền thuyết gói bánh ú nếp lá tre",
      "context": "Bên bờ sông Mịch La, Hồ Nam trong ngày hội văn hóa Đua thuyền rồng quốc tế",
      "participants": "A: Nhà nghiên cứu văn hóa dân gian, B: Vận động viên đội thuyền rồng",
      "targetGoal": "Vận dụng cấu trúc 源于…… (bắt nguồn từ... / có nguồn gốc từ...) để thuyết minh nguồn gốc lịch sử (端午, 龙舟, 粽子)",
      "usageNotes": "\"端午安康\" (Chúc Đoan Ngọ an khang) là câu chúc đúng chuẩn mực thay vì nói \"端午快乐\", do ngày này gắn liền với tưởng niệm Khuất Nguyên và phòng dịch bệnh.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "端午节赛龙舟的传统源于古代对爱国诗人屈原的深切纪念，更蕴含着避瘟驱邪的古老智慧。",
          "pinyin": "Duānwǔjié sài lóngzhōu de chuántǒng yuányú gǔdài duì àiguó shīrén Qū Yuán de shēnqiè jìniàn, gèng yùnhán zhe bì wēn qū xié de gǔlǎo zhìhuì.",
          "meaning": "Truyền thống đua thuyền rồng Tết Đoan Ngọ bắt nguồn từ niềm tưởng niệm sâu sắc đối với nhà thơ yêu nước Khuất Nguyên thời cổ đại, lại càng hàm chứa trí tuệ cổ xưa về trừ tà phòng dịch."
        },
        {
          "speaker": "B",
          "hanzi": "难怪划龙舟时鼓声震天，大家齐心协力奋勇争先，体现出无坚不摧的集体拼搏精神！",
          "pinyin": "Nánguài huá lóngzhōu shí gǔshēng zhèntiān, dàjiā qíxīn-xiélì fènyǒng zhēngxiān, tǐxiàn chū wújiān-bùcuī de jítǐ pīnbó jīngshén!",
          "meaning": "Thảo nào khi chèo thuyền rồng tiếng trống vang rền dậy đất, mọi người đồng tâm hiệp lực hăng hái tranh tiên, thể hiện tinh thần phấn đấu tập thể kiên cường không gì cản nổi!"
        },
        {
          "speaker": "A",
          "hanzi": "人们包粽子投入江中，初衷是不让鱼虾侵蚀屈原的身躯，如今粽子已成为风靡海内外的经典美食。",
          "pinyin": "Rénmen bāo zòngzi tóurù jiāng zhōng, chūzhōng shì bú ràng yúxiā qīnshí Qū Yuán de shēnqū, rújīn zòngzi yǐ chéngwéi fēngmǐ hǎinèiwài de jīngdiǎn měishí.",
          "meaning": "Người xưa gói bánh chưng bánh ú thả xuống lòng sông, tâm niệm ban đầu là ngăn cá tôm xâm phạm thân thể Khuất Nguyên, nay bánh ú đã trở thành món ngon kinh điển nổi danh trong ngoài nước."
        },
        {
          "speaker": "B",
          "hanzi": "粽叶的清香融合糯米的香甜，既是对先贤忠烈的铭记，也是中华民俗生生不息的写照。",
          "pinyin": "Zòngyè de qīngxiāng rónghé nuòmǐ de xiāngtián, jì shì duì xiānxián zhōngliè de míngjì, yě shì Zhōnghuá mínsú shēngshēng-bùxī de xiězhào.",
          "meaning": "Hương thanh khiết của lá tre hòa cùng vị ngọt thơm của gạo nếp, vừa là sự khắc ghi lòng trung liệt của tiền nhân, vừa là khắc họa cho sức sống bền bỉ không ngừng của tập tục Trung Hoa."
        },
        {
          "speaker": "A",
          "hanzi": "祝愿大家端午安康！愿这份乘风破浪的龙舟精神激励我们在人生赛道上勇往直前。",
          "pinyin": "Zhùyuàn dàjiā Duānwǔ ānkāng! Yuàn zhè fèn chéngfēng-pòlàng de lóngzhōu jīngshén jīlì wǒmen zài rénshēng sàidào shang yǒngwǎng-zhíqián.",
          "meaning": "Chúc mọi người Đoan Ngọ an khang! Cầu chúc tinh thần thuyền rồng rẽ sóng đạp gió này sẽ cổ vũ chúng ta vững bước tiến lên trên đường đua cuộc đời."
        }
      ],
      "audioText": "端午节赛龙舟的传统源于古代对爱国诗人屈原的深切纪念，更蕴含着避瘟驱邪的古老智慧。难怪划龙舟时鼓声震天，大家齐心协力奋勇争先，体现出无坚不摧的集体拼搏精神！人们包粽子投入江中，初衷是不让鱼虾侵蚀屈原的身躯，如今粽子已成为风靡海内外的经典美食。粽叶的清香融合糯米的香甜，既是对先贤忠烈的铭记，也是中华民俗生生不息的写照。祝愿大家端午安康！愿这份乘风破浪的龙舟精神激励我们在人生赛道上勇往直前。",
      "question": "Truyền thống đua thuyền rồng và gói bánh ú Tết Đoan Ngọ bắt nguồn từ sự kiện lịch sử nào?",
      "options": [
        "Lễ mừng được mùa hoa màu",
        "Tưởng niệm nhà thơ yêu nước Khuất Nguyên (对爱国诗人屈原的深切纪念)",
        "Chào mừng vua lên ngôi",
        "Thi bơi lội giữa các làng"
      ],
      "correctIndex": 1,
      "explanation": "Đoạn thoại mở đầu nêu rõ nguồn gốc: \"端午节赛龙舟的传统源于古代对爱国诗人屈原的深切纪念\" (Truyền thống đua thuyền rồng bắt nguồn từ tưởng niệm nhà thơ Khuất Nguyên)."
    },
    "step6_speaking": {
      "prompt": "Giới thiệu ngày hội thuyền rồng:",
      "targetSentence": "赛龙舟体现了团结拼搏的民族精神！",
      "targetPinyin": "Sài lóngzhōu tǐxiàn le tuánjié pīnbó de mínzú jīngshén!",
      "targetMeaning": "Đua thuyền rồng thể hiện tinh thần dân tộc đoàn kết kiên cường vượt khó!",
      "hint": "Giọng điệu hào sảng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Tập tục này bắt nguồn từ thời cổ đại'",
      "words": [
        "习俗",
        "源于",
        "这项",
        "古代"
      ],
      "correctOrder": [
        "这项",
        "习俗",
        "源于",
        "古代"
      ],
      "explanation": "Chủ ngữ + 源于 + Nguồn gốc."
    },
    "step8_quiz": [
      {
        "id": "q-513-1",
        "type": "multiple-choice",
        "question": "Món ăn biểu tượng của Tết Đoan Ngọ mùng 5 tháng 5 là gì?",
        "options": [
          "月饼",
          "粽子",
          "饺子",
          "年糕"
        ],
        "correctIndex": 1,
        "explanation": "粽子 (zòngzi) là bánh ú Đoan Ngọ."
      },
      {
        "id": "q-513-2",
        "type": "multiple-choice",
        "question": "Điền từ: '很多现代医学理论实际上____古老的中医经验。'",
        "options": [
          "源于",
          "所谓",
          "究竟",
          "与其"
        ],
        "correctIndex": 0,
        "explanation": "Bắt nguồn từ dùng 源于."
      }
    ],
    "step9_challenge": {
      "title": "Kể chuyện Đoan Ngọ",
      "taskDesc": "Dùng tiếng Trung kể lại ngắn gọn 1 phút câu chuyện Khuất Nguyên và phong tục đua thuyền rồng.",
      "targetPhrase": "sài lóngzhōu Qū Yuán",
      "xpReward": 60,
      "badge": "Sứ Giả Đoan Ngọ"
    }
  },
  {
    "id": "l-514",
    "chapterId": "ch-19",
    "levelId": "lvl-5",
    "lessonNumber": 4,
    "title": "Phong bao lì xì đỏ & 12 Con giáp",
    "chineseTitle": "红包压岁钱与生肖文化",
    "subtitle": "Văn hóa lì xì (压岁钱), ý nghĩa phong bao đỏ và biểu tượng 12 con giáp (生肖) trong vận mệnh con người.",
    "objective": "Làm chủ từ vựng may mắn: 红包, 压岁钱, 生肖, 吉祥 và động từ 象征……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-19"
    ],
    "step1_learn": {
      "topic": "Phong bao lì xì đỏ & 12 Con giáp - Trọng tâm HSK 5",
      "summary": "Văn hóa lì xì (压岁钱), ý nghĩa phong bao đỏ và biểu tượng 12 con giáp (生肖) trong vận mệnh con người.",
      "keyTakeaways": [
        "Làm chủ từ vựng may mắn: 红包, 压岁钱, 生肖, 吉祥 và động từ 象征……",
        "Làm chủ điểm ngữ pháp: 象征着…… (Tượng trưng cho... / Là biểu tượng của...)"
      ],
      "audioDemoText": "压岁钱寓意着镇压邪崇，保佑孩子们健康成长。"
    },
    "step2_vocabulary": [
      {
        "id": "v-514-1",
        "hanzi": "红包",
        "pinyin": "hóngbāo",
        "hanviet": "Hồng bao",
        "meaning": "Bao lì xì đỏ, phong bao may mắn",
        "radical": "Bộ 糸",
        "example": {
          "hanzi": "过年时长辈会给晚辈发红包传递祝福。",
          "pinyin": "Guònián shí zhǎngbèi huì gěi wǎnbèi fā hóngbāo chuándì zhùfú.",
          "meaning": "Khi đón Tết người lớn sẽ phát bao lì xì cho con cháu để trao gửi lời chúc phúc."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-514-2",
        "hanzi": "压岁钱",
        "pinyin": "yāsuìqián",
        "hanviet": "Áp tuế tiền",
        "meaning": "Tiền mừng tuổi đầu năm",
        "radical": "Bộ 厂",
        "example": {
          "hanzi": "压岁钱寓意着平平安安度过新的一岁。",
          "pinyin": "Yāsuìqián yùyì zhe píngpíng'ān'ān dùguò xīn de yí suì.",
          "meaning": "Tiền mừng tuổi hàm ý bình an suôn sẻ bước qua một tuổi mới."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-514-3",
        "hanzi": "生肖",
        "pinyin": "shēngxiào",
        "hanviet": "Sinh tiếu",
        "meaning": "Con giáp, 12 con giáp (Cầm tinh)",
        "radical": "Bộ 生",
        "example": {
          "hanzi": "请问你属什么生肖？我是属龙的。",
          "pinyin": "Qǐngwèn nǐ shǔ shénme shēngxiào? Wǒ shì shǔ lóng de.",
          "meaning": "Xin hỏi bạn cầm tinh con giáp nào? Tôi cầm tinh con Rồng."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-514-4",
        "hanzi": "象征",
        "pinyin": "xiàngzhēng",
        "hanviet": "Tượng trưng",
        "meaning": "Biểu tượng, tượng trưng cho",
        "radical": "Bộ 木",
        "example": {
          "hanzi": "红色在中国文化中象征着喜庆、吉祥与繁荣。",
          "pinyin": "Hóngsè zài Zhōngguó wénhuà zhōng xiàngzhēng zhe xǐqìng, jíxiáng yǔ fánróng.",
          "meaning": "Màu đỏ trong văn hóa Trung Hoa tượng trưng cho sự vui mừng, cát tường và thịnh vượng."
        },
        "pos": "Động từ / Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "岁",
        "hanzi": "岁",
        "pinyin": "suì",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱山夕",
        "radical": {
          "char": "山",
          "name": "Sơn",
          "strokes": 3
        },
        "meaning": "Tuế nguyệt, tuổi đời, tiền mừng tuổi",
        "strokesCount": 6,
        "strokeOrderText": "Bộ Sơn 山 (3 nét: sổ, sổ ngang, sổ) -> Bộ Tịch 夕 (3 nét)",
        "components": [
          "山",
          "夕"
        ],
        "mnemonic": "Mặt trời lặn sau núi (山) từng chiều (夕), ngày qua tháng lại kết tinh thành tuổi đời: tiền mừng tuổi (压岁钱)."
      },
      {
        "char": "肖",
        "hanzi": "肖",
        "pinyin": "xiào",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱⺌月",
        "radical": {
          "char": "月",
          "name": "Nhục",
          "strokes": 4
        },
        "meaning": "Tương đồng, cầm tinh, 12 con giáp",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Tiểu ⺌ (3 nét) -> Bộ Nhục/Nguyệt 月 (4 nét: phẩy, ngang gập, ngang, ngang)",
        "components": [
          "⺌",
          "月"
        ],
        "mnemonic": "Hình bóng nhỏ bé (⺌) kế thừa từng đường nét máu thịt (月) của cha mẹ: con giáp (生肖)."
      }
    ],
    "step4_grammar": {
      "formula": "象征着…… (Tượng trưng cho... / Là biểu tượng của...)",
      "title": "Động từ biểu thị ý nghĩa biểu tượng văn hóa",
      "explanation": "Dùng để giải thích ngụ ý tốt lành ẩn sau màu sắc, hoa văn, linh vật truyền thống.",
      "examples": [
        {
          "hanzi": "龙在中国传统文化中象征着吉祥与尊贵。",
          "pinyin": "Lóng zài Zhōngguó chuántǒng wénhuà zhōng xiàngzhēng zhe jíxiáng yǔ zūnguì.",
          "meaning": "Rồng trong văn hóa truyền thống Trung Quốc tượng trưng cho sự cát tường và cao quý."
        }
      ],
      "commonMistake": {
        "wrong": "象征是吉祥。",
        "correct": "象征着吉祥。",
        "explanation": "Động từ 象征 đi kèm trợ từ 着 khi làm vị ngữ biểu đạt trạng thái tượng trưng."
      }
    },
    "step5_listening": {
      "situation": "Phong tục phát bao lì xì đỏ, ý nghĩa tiền mừng tuổi và văn hóa 12 con giáp (Thập nhị sinh tiếu)",
      "context": "Sáng mùng 1 Tết tại phòng khách gia đình truyền thống",
      "participants": "A: Người lớn trong nhà trao bao lì xì, B: Con cháu chúc Tết đầu xuân",
      "targetGoal": "Vận dụng cấu trúc 象征着…… (tượng trưng cho... / là biểu tượng của...) trong văn hóa lễ Tết (红包, 压岁钱, 生肖, 象征)",
      "usageNotes": "\"压岁钱\" chữ \"岁\" đồng âm với \"祟\" (tà ma quấy nhiễu), mang ý nghĩa dùng tiền phong bao đỏ trừ tà cầu chúc con trẻ một năm bình an mạnh khỏe.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "大年初一给长辈拜年，长辈给晚辈派发红包压岁钱，这抹亮丽的中国红象征着吉星高照与岁岁平安。",
          "pinyin": "Dànián chūyī gěi zhǎngbèi bàinián, zhǎngbèi gěi wǎnbèi pàifā hóngbāo yāsuìqián, zhè mǒ liànglì de Zhōngguó hóng xiàngzhēng zhe jíxīng-gāozhào yǔ suìsuì-píng'ān.",
          "meaning": "Sáng mùng 1 Tết chúc thọ bề trên, bề trên phát lì xì tiền mừng tuổi cho con cháu, sắc đỏ Trung Hoa tươi thắm này tượng trưng cho sao lành chiếu rọi và năm năm bình an."
        },
        {
          "speaker": "B",
          "hanzi": "祝长辈们福如东海、寿比南山！听说“压岁钱”的“岁”字谐音鬼祟的“祟”，初衷是为了保佑晚辈平安健康。",
          "pinyin": "Zhù zhǎngbèimen fúrú-dōnghǎi, shòubǐ-nánshān! Tīngshuō \"yāsuìqián\" de \"suì\" zì xiéyīn guǐsuì de \"suì\", chūzhōng shì wèile bǎoyòu wǎnbèi píng'ān jiànkāng.",
          "meaning": "Kính chúc các bậc bề trên phúc như đông hải, thọ tỷ nam sơn! Cháu nghe nói chữ \"tuế\" trong \"áp tuế tiền\" đồng âm với \"tuế\" trong tà ma quấy nhiễu, tâm niệm ban đầu là để bảo bọc con trẻ bình an mạnh khỏe."
        },
        {
          "speaker": "A",
          "hanzi": "一点都没错。今年是龙年，在十二生肖中，龙象征着卓越力量与蒸蒸日上的蓬勃生机。",
          "pinyin": "Yìdiǎn dōu méi cuò. Jīnnián shì Lóng nián, zài shí'èr shēngxiào zhōng, lóng xiàngzhēng zhe zhuóyuè lìliang yǔ zhēngzhēng-rìshàng de péngbó shēngjī.",
          "meaning": "Không sai chút nào. Năm nay là năm Thìn, trong 12 con giáp, rồng tượng trưng cho sức mạnh kiệt xuất và sức sống bừng bừng ngày càng phát triển."
        },
        {
          "speaker": "B",
          "hanzi": "生肖文化与干支纪年紧密相连，每个人一出生就拥有独特的生肖印记，凝聚着深厚的人文智慧。",
          "pinyin": "Shēngxiào wénhuà yǔ gānzhī jìnián jǐnmì xiānglián, měi gè rén yì chūshēng jiù yōngyǒu dútè de shēngxiào yìnjì, níngjù zhe shēnhòu de rénwén zhìhuì.",
          "meaning": "Văn hóa con giáp gắn bó chặt chẽ với cách tính năm can chi, mỗi người vừa chào đời đã sở hữu dấu ấn con giáp riêng biệt, ngưng kết trí tuệ nhân văn sâu sắc."
        },
        {
          "speaker": "A",
          "hanzi": "收下这份承载着祝福的压岁钱，愿你在新的一岁里龙腾虎跃、学业事业更上一层楼！",
          "pinyin": "Shōuxià zhè fèn chéngzài zhe zhùfú de yāsuìqián, yuàn nǐ zài xīn de yí suì lǐ lóngténg-hǔyuè, xuéyè shìyè gèng shàng yì céng lóu!",
          "meaning": "Hãy nhận phong bao tiền mừng tuổi đong đầy phúc lành này, chúc cháu trong năm mới rồng bay hổ nhảy, học tập sự nghiệp tiến lên tầng cao mới!"
        }
      ],
      "audioText": "大年初一给长辈拜年，长辈给晚辈派发红包压岁钱，这抹亮丽的中国红象征着吉星高照与岁岁平安。祝长辈们福如东海、寿比南山！听说“压岁钱”的“岁”字谐音鬼祟的“祟”，初衷是为了保佑晚辈平安健康。一点都没错。今年是龙年，在十二生肖中，龙象征着卓越力量与蒸蒸日上的蓬勃生机。生肖文化与干支纪年紧密相连，每个人一出生就拥有独特的生肖印记，凝聚着深厚的人文智慧。收下这份承载着祝福的压岁钱，愿你在新的一岁里龙腾虎跃、学业事业更上一层楼！",
      "question": "Tập tục tặng tiền mừng tuổi (压岁钱) bắt nguồn từ tâm niệm văn hóa ban đầu nào?",
      "options": [
        "Cho trẻ con tiền đi chơi điện tử",
        "Đồng âm với \"trừ tà\", bảo bọc con trẻ một năm bình an và trừ bỏ quấy nhiễu (保佑晚辈平安健康，驱邪祈福)",
        "Để trả nợ cho hàng xóm",
        "Khoe khoang sự giàu có của gia đình"
      ],
      "correctIndex": 1,
      "explanation": "Học viên nêu rõ nguồn gốc: \"压岁钱的岁字谐音鬼祟的祟，初衷是为了保佑晚辈平安健康\" (Chữ tuế đồng âm trừ tà, ban đầu để cầu chúc con cháu bình an khỏe mạnh)."
    },
    "step6_speaking": {
      "prompt": "Lời chúc đầu năm phát tài:",
      "targetSentence": "恭喜发财，红包拿来！",
      "targetPinyin": "Gōngxǐ fācái, hóngbāo nálái!",
      "targetMeaning": "Cung hỷ phát tài, lì xì cầm lại đây!",
      "hint": "Câu nói đùa vui nhộn ngày Tết của trẻ em."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Màu đỏ tượng trưng cho hạnh phúc và may mắn'",
      "words": [
        "幸福与吉祥",
        "红色",
        "象征着"
      ],
      "correctOrder": [
        "红色",
        "象征着",
        "幸福与吉祥"
      ],
      "explanation": "Chủ ngữ + 象征着 + Tân ngữ tượng trưng."
    },
    "step8_quiz": [
      {
        "id": "q-514-1",
        "type": "multiple-choice",
        "question": "Màu sắc được xem là may mắn, cát tường nhất trong ngày Tết Trung Hoa là màu gì?",
        "options": [
          "红色 (Màu đỏ)",
          "黑色 (Màu đen)",
          "白色 (Màu trắng)",
          "蓝色 (Màu xanh lam)"
        ],
        "correctIndex": 0,
        "explanation": "红色 là màu sắc biểu tượng của hỷ sự."
      },
      {
        "id": "q-514-2",
        "type": "multiple-choice",
        "question": "Điền từ: '十二____文化反映了中国人对时间与生命的哲学思考。'",
        "options": [
          "生肖",
          "菜系",
          "座次",
          "单号"
        ],
        "correctIndex": 0,
        "explanation": "12 con giáp là 十二生肖."
      }
    ],
    "step9_challenge": {
      "title": "Hỏi tuổi con giáp",
      "taskDesc": "Hỏi tuổi con giáp và giải thích tính cách tượng trưng của con giáp đó bằng tiếng Trung.",
      "targetPhrase": "xiàngzhēng jíxiáng hóngbāo",
      "xpReward": 60,
      "badge": "Bậc Thầy Phong Tục"
    }
  },
  {
    "id": "l-515",
    "chapterId": "ch-19",
    "levelId": "lvl-5",
    "lessonNumber": 5,
    "title": "So sánh phong tục lễ Tết Việt — Trung",
    "chineseTitle": "越中传统节日风俗比较",
    "subtitle": "Đối chiếu sự tương đồng và nét dị biệt thú vị giữa Tết Việt (bánh chưng vuông) và Tết Trung (sủi cảo, bánh trôi).",
    "objective": "Làm chủ từ vựng so sánh văn hóa: 异同, 习俗, 悠久, 亲切 và cấu trúc 固然……但是……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-19"
    ],
    "step1_learn": {
      "topic": "So sánh phong tục lễ Tết Việt — Trung - Trọng tâm HSK 5",
      "summary": "Đối chiếu sự tương đồng và nét dị biệt thú vị giữa Tết Việt (bánh chưng vuông) và Tết Trung (sủi cảo, bánh trôi).",
      "keyTakeaways": [
        "Làm chủ từ vựng so sánh văn hóa: 异同, 习俗, 悠久, 亲切 và cấu trúc 固然……但是……",
        "Làm chủ điểm ngữ pháp: 固然……但是…… (Tuy rằng... nhưng mà...)"
      ],
      "audioDemoText": "两者都象征着全家团圆与感恩大地。"
    },
    "step2_vocabulary": [
      {
        "id": "v-515-1",
        "hanzi": "异同",
        "pinyin": "yìtóng",
        "hanviet": "Dị đồng",
        "meaning": "Điểm giống và khác nhau",
        "radical": "Bộ 异",
        "example": {
          "hanzi": "越中两国的传统节日文化有许多有趣的异同。",
          "pinyin": "Yuè Zhōng liǎng guó de chuántǒng jiérì wénhuà yǒu xǔduō yǒuqù de yìtóng.",
          "meaning": "Văn hóa lễ tết truyền thống của hai nước Việt - Trung có rất nhiều điểm giống và khác nhau thú vị."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-515-2",
        "hanzi": "习俗",
        "pinyin": "xísú",
        "hanviet": "Tập tục",
        "meaning": "Phong tục tập quán",
        "radical": "Bộ 习",
        "example": {
          "hanzi": "虽然地域不同，但过年祈求平安的习俗是一致的。",
          "pinyin": "Suīrán dìyù bùtóng, dàn guònián qíqiú píng'ān de xísú shì yízhì de.",
          "meaning": "Tuy địa lý khác biệt nhưng tập tục đón Tết cầu bình an thì đồng nhất."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-515-3",
        "hanzi": "悠久",
        "pinyin": "yōujiǔ",
        "hanviet": "Du cửu",
        "meaning": "Lâu đời, trường tồn qua năm tháng",
        "radical": "Bộ 亻",
        "example": {
          "hanzi": "两国都拥有数千年悠久深厚的历史文化底蕴。",
          "pinyin": "Liǎng guó dōu yōngyǒu shùqiān nián yōujiǔ shēnhòu de lìshǐ wénhuà dǐyùn.",
          "meaning": "Cả hai nước đều sở hữu bề dày lịch sử văn hóa lâu đời hàng ngàn năm."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-515-4",
        "hanzi": "亲切",
        "pinyin": "qīnqiè",
        "hanviet": "Thân thiết",
        "meaning": "Thân thiết, gần gũi, ấm áp",
        "radical": "Bộ 立",
        "example": {
          "hanzi": "在异国他乡看到熟悉的春联，感到格外亲切。",
          "pinyin": "Zài yìguó tāxiāng kàndào shúxi de chūnlián, gǎndào géwài qīnqiè.",
          "meaning": "Ở nơi đất khách quê người nhìn thấy câu đối đỏ quen thuộc, cảm thấy vô cùng thân thương gần gũi."
        },
        "pos": "Tính từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "异",
        "hanzi": "异",
        "pinyin": "yì",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱巳廾",
        "radical": {
          "char": "廾",
          "name": "Củng",
          "strokes": 3
        },
        "meaning": "Khác biệt, dị biệt, kỳ lạ",
        "strokesCount": 6,
        "strokeOrderText": "Chữ Tị 巳 biến thể (ngang gập, ngang, cong móc) -> Bộ Củng 廾 (ngang, phẩy, sổ)",
        "components": [
          "巳",
          "廾"
        ],
        "mnemonic": "Hai tay nâng chiếc mặt nạ thần bí (巳) khác lạ với bình thường: dị biệt, điểm khác biệt (异同)."
      },
      {
        "char": "悠",
        "hanzi": "悠",
        "pinyin": "yōu",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱攸心",
        "radical": {
          "char": "心",
          "name": "Tâm",
          "strokes": 4
        },
        "meaning": "Lâu đời, thong dong, xa xăm",
        "strokesCount": 11,
        "strokeOrderText": "Chữ Du 攸 (7 nét: phẩy, sổ, phẩy, ngang, phẩy, mác) -> Bộ Tâm 心 (4 nét)",
        "components": [
          "攸",
          "心"
        ],
        "mnemonic": "Tâm hồn (心) thong dong thư thái như dòng nước êm đềm trôi dài vô tận: lâu đời (悠久)."
      }
    ],
    "step4_grammar": {
      "formula": "固然……但是…… (Tuy rằng... nhưng mà...)",
      "title": "Cấu trúc liên từ nhượng bộ khẳng định tiền đề",
      "explanation": "Dùng để thừa nhận tính hợp lý của vế đầu (固然), sau đó chuyển hướng nhấn mạnh trọng tâm ở vế sau (但是).",
      "examples": [
        {
          "hanzi": "外表的形式固然有所不同，但是对美好生活的期盼是一样的。",
          "pinyin": "Wàibiǎo de xíngshì gùrán yǒu suǒ bùtóng, dànshì duì měihǎo shēnghuó de qīpàn shì yíyàng de.",
          "meaning": "Hình thức bề ngoài tuy rằng có điểm khác biệt, nhưng niềm mong ước cuộc sống tốt đẹp thì giống nhau."
        }
      ],
      "commonMistake": {
        "wrong": "固然好，不好。",
        "correct": "固然很好，但是成本太高。",
        "explanation": "Vế sau bắt buộc phải có 但是/却 để hoàn chỉnh câu."
      }
    },
    "step5_listening": {
      "situation": "So sánh tương đồng và dị biệt trong phong tục đón Tết Nguyên Đán giữa Việt Nam và Trung Quốc",
      "context": "Hội thảo học thuật đối chiếu văn hóa Đông Á tại Trung tâm Giao lưu Văn hóa",
      "participants": "A: Nhà nghiên cứu văn hóa Việt Nam, B: Học giả nghiên cứu dân tộc học Trung Quốc",
      "targetGoal": "Vận dụng cấu trúc nhượng bộ giả thiết 固然……但是…… (tuy rằng... nhưng mà...) trong so sánh văn hóa (异同, 习俗, 悠久, 亲切)",
      "usageNotes": "\"和而不同\" (Hòa nhi bất đồng) — Cả hai nước cùng đón Tết âm lịch, mâm ngũ quả, cúng ông Táo, nhưng Việt Nam có bánh chưng vuông và hoa mai, hoa đào đặc trưng phương Nam.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "越中两国的传统春节习俗固然有极多相通之处，但是在具体节庆饮食与象征符号上依然存在显著异同。",
          "pinyin": "Yuè-Zhōng liǎng guó de chuántǒng Chūnjié xísú gùrán yǒu jí duō xiāngtōng zhī chù, dànshì zài jùtǐ jiéqìng yǐnshí yǔ xiàngzhēng fúhào shang yīrán cúnzài xiǎnzhù yìtóng.",
          "meaning": "Tập tục Tết cổ truyền của hai nước Việt - Trung tuy rằng có vô số điểm tương đồng, nhưng ở nét ẩm thực lễ hội và biểu tượng văn hóa cụ thể vẫn tồn tại những nét giống và khác nhau rõ rệt."
        },
        {
          "speaker": "B",
          "hanzi": "是的，中国北方过年必吃水饺，南方吃年糕；而越南家家户户必不可少的是象征大地的方形粽与圆筒粽。",
          "pinyin": "Shì de, Zhōngguó běifāng guònián bì chī shuǐjiǎo, nánfāng chī niángāo; ér Yuènán jiājiā-hùhù bì bùkě shǎo de shì xiàngzhēng dàdì de fāngxíngzòng yǔ yuántǒngzòng.",
          "meaning": "Đúng vậy, miền Bắc Trung Quốc đón Tết tất phải ăn sủi cảo, miền Nam ăn bánh tổ; còn tại Việt Nam nhà nhà người người không thể thiếu bánh chưng vuông tượng trưng cho đất và bánh tét tròn."
        },
        {
          "speaker": "A",
          "hanzi": "在节庆花卉方面，中国常摆放水仙与金桔，而越南北方偏爱娇艳红桃花，南方则盛行璀璨金黄的梅花。",
          "pinyin": "Zài jiéqìng huāhuì fāngmiàn, Zhōngguó cháng bǎifàng shuǐxiān yǔ jīnjú, ér Yuènán běifāng piān'ài jiāoyàn hóng táohuā, nánfāng zé shèngxíng cuǐcàn jīnhuáng de méihuā.",
          "meaning": "Về mặt hoa kiểng chơi Tết, Trung Quốc thường trưng hoa thủy tiên và quất cảnh, còn miền Bắc Việt Nam chuộng cành đào đỏ thắm kiêu kỳ, miền Nam lại thịnh hành hoa mai vàng rực rỡ."
        },
        {
          "speaker": "B",
          "hanzi": "两种悠久的文化形态固然各具风采，但是核心都体现出对天地自然的敬畏与对家庭团聚的深深眷恋。",
          "pinyin": "Liǎng zhǒng yōujiǔ de wénhuà xíngtài gùrán gè jù fēngcǎi, dànshì héxīn dōu tǐxiàn chū duì tiāndì zìrán de jìngwèi yǔ duì jiātíng tuánjù de shēnshēn juànliàn.",
          "meaning": "Hai hình thái văn hóa lâu đời tuy rằng mỗi bên mang một sắc thái riêng, nhưng cốt lõi đều thể hiện lòng kính sợ tự nhiên đất trời và sự gắn bó sâu sắc với sum họp gia đình."
        },
        {
          "speaker": "A",
          "hanzi": "正是这种同源异彩的文化底色，让身处异国的游子无论走到哪里，都能感受到那份份分外亲切的年味。",
          "pinyin": "Zhèng shì zhè zhǒng tóngyuán-yìcǎi de wénhuà dǐsè, ràng shēnchǔ yìguó de yóuzǐ wúlùn zǒu dào nǎlǐ, dōu néng gǎnshòu dào nà fèn fènwài qīnqiè de niánwèi.",
          "meaning": "Chính nét văn hóa cùng cội nguồn mà muôn vẻ rực rỡ này đã giúp những người con xa xứ dù đi đến đâu cũng đều cảm nhận được phong vị Tết vô cùng ấm áp thân thương."
        }
      ],
      "audioText": "越中两国的传统春节习俗固然有极多相通之处，但是在具体节庆饮食与象征符号上依然存在显著异同。是的，中国北方过年必吃水饺，南方吃年糕；而越南家家户户必不可少的是象征大地的方形粽与圆筒粽。在节庆花卉方面，中国常摆放水仙与金桔，而越南北方偏爱娇艳红桃花，南方则盛行璀璨金黄的梅花。两种悠久的文化形态固然各具风采，但是核心都体现出对天地自然的敬畏与对家庭团聚的深深眷恋。正是这种同源异彩的文化底色，让身处异国的游子无论走到哪里，都能感受到那份份分外亲切的年味。",
      "question": "Điểm cốt lõi tương đồng sâu sắc nhất giữa Tết Nguyên Đán Việt Nam và Trung Quốc là gì?",
      "options": [
        "Ăn cùng một loại sủi cảo giống hệt nhau",
        "Lòng kính sợ tự nhiên đất trời và sự trân trọng sum họp gia đình (敬畏自然，眷恋家庭团聚)",
        "Tất cả đều trưng hoa mai vàng",
        "Đều không mở tiệc tất niên"
      ],
      "correctIndex": 1,
      "explanation": "Học giả đúc kết điểm cốt lõi: \"核心都体现出对天地自然的敬畏与对家庭团聚的深深眷恋\" (Cốt lõi đều thể hiện lòng kính sợ đất trời và sự gắn bó với đoàn tụ gia đình)."
    },
    "step6_speaking": {
      "prompt": "Câu nhận định văn hóa:",
      "targetSentence": "文化求同存异，传统节日连接两国民心。",
      "targetPinyin": "Wénhuà qiútóng-cúnyì, chuántǒng jiérì liánjiē liǎng guó mínxīn.",
      "targetMeaning": "Văn hóa tìm điểm chung giữ điểm riêng, lễ hội truyền thống kết nối lòng dân hai nước.",
      "hint": "Giọng điệu hữu nghị sâu sắc."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Nội dung tuy rằng tốt nhưng thời gian quá ngắn'",
      "words": [
        "固然充实",
        "内容",
        "时间太紧张",
        "但是"
      ],
      "correctOrder": [
        "内容",
        "固然充实",
        "但是",
        "时间太紧张"
      ],
      "explanation": "Chủ ngữ + 固然... 但是..."
    },
    "step8_quiz": [
      {
        "id": "q-515-1",
        "type": "multiple-choice",
        "question": "Món bánh truyền thống hình vuông gói bằng lá dong không thể thiếu trong ngày Tết cổ truyền Việt Nam là gì?",
        "options": [
          "Bánh chưng (方形粽/越南粽)",
          "Bánh bao (包子)",
          "Sủi cảo (饺子)",
          "Bánh trôi (汤圆)"
        ],
        "correctIndex": 0,
        "explanation": "Bánh chưng vuông là linh hồn Tết Việt."
      },
      {
        "id": "q-515-2",
        "type": "multiple-choice",
        "question": "Điền từ: '两国人民的友谊拥有____的历史根基。'",
        "options": [
          "悠久",
          "甚至",
          "究竟",
          "差不多"
        ],
        "correctIndex": 0,
        "explanation": "Lịch sử lâu đời dùng 悠久."
      }
    ],
    "step9_challenge": {
      "title": "Tổng kết Chương 19",
      "taskDesc": "Viết bài so sánh 100 chữ bằng tiếng Trung về phong tục đón Tết Nguyên Đán tại Hà Nội và Bắc Kinh.",
      "targetPhrase": "gùrán dànshì tuányuán",
      "xpReward": 60,
      "badge": "Cầu Nối Văn Hóa HSK 5"
    }
  },
  {
    "id": "l-516",
    "chapterId": "ch-20",
    "levelId": "lvl-5",
    "lessonNumber": 1,
    "title": "Quy trình đăng ký khám bệnh tại bệnh viện",
    "chineseTitle": "医院门诊挂号与分诊",
    "subtitle": "Cách dùng thẻ bảo hiểm, phân khoa khám bệnh (nội, ngoại, tai mũi họng), lấy số thứ tự tại máy tự động.",
    "objective": "Làm chủ từ vựng y tế: 挂号, 门诊, 急诊, 科室 và giới từ 凭……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-20"
    ],
    "step1_learn": {
      "topic": "Quy trình đăng ký khám bệnh tại bệnh viện - Trọng tâm HSK 5",
      "summary": "Cách dùng thẻ bảo hiểm, phân khoa khám bệnh (nội, ngoại, tai mũi họng), lấy số thứ tự tại máy tự động.",
      "keyTakeaways": [
        "Làm chủ từ vựng y tế: 挂号, 门诊, 急诊, 科室 và giới từ 凭……",
        "Làm chủ điểm ngữ pháp: 凭…… (Căn cứ vào... / Dựa vào...)"
      ],
      "audioDemoText": "如果伴有发烧请挂发热门诊，一般症状请挂耳鼻喉科。"
    },
    "step2_vocabulary": [
      {
        "id": "v-516-1",
        "hanzi": "挂号",
        "pinyin": "guàhào",
        "hanviet": "Quải hào",
        "meaning": "Đăng ký khám bệnh, lấy số khám",
        "radical": "Bộ 扌",
        "example": {
          "hanzi": "看病前请先在微信公众号或者自助机上挂号。",
          "pinyin": "Kànbìng qián qǐng xiān zài wēixìn gōngzhònghào huòzhě zìzhùjī shang guàhào.",
          "meaning": "Trước khi khám bệnh xin hãy đăng ký khám trên kênh WeChat hoặc máy tự động."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-516-2",
        "hanzi": "门诊",
        "pinyin": "ménzhěn",
        "hanviet": "Môn chẩn",
        "meaning": "Khoa khám bệnh ngoại trú",
        "radical": "Bộ 门",
        "example": {
          "hanzi": "普通门诊在综合大楼的一层至三层。",
          "pinyin": "Pǔtōng ménzhěn zài zōnghé dàlóu de yì céng zhì sān céng.",
          "meaning": "Khoa khám bệnh thông thường ở tầng 1 đến tầng 3 tòa nhà tổng hợp."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-516-3",
        "hanzi": "急诊",
        "pinyin": "jízhěn",
        "hanviet": "Cấp chẩn",
        "meaning": "Khoa cấp cứu 24/7",
        "radical": "Bộ 心",
        "example": {
          "hanzi": "如果有突发剧烈疼痛，请直接前往急诊室。",
          "pinyin": "Rúguǒ yǒu tūfā jùliè téngtòng, qǐng zhíjiē qiánwǎng jízhěnshì.",
          "meaning": "Nếu có cơn đau dữ dội bất ngờ, xin đi thẳng đến phòng cấp cứu."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-516-4",
        "hanzi": "凭",
        "pinyin": "píng",
        "hanviet": "Bằng",
        "meaning": "Dựa vào, căn cứ vào, xuất trình",
        "radical": "Bộ 几",
        "example": {
          "hanzi": "患者凭医保卡或者身份证取号就诊。",
          "pinyin": "Huànzhě píng yībǎokǎ huòzhě shēnfènzhèng qǔhào jiùzhěn.",
          "meaning": "Bệnh nhân xuất trình thẻ bảo hiểm y tế hoặc CCCD để lấy số vào khám."
        },
        "pos": "Giới từ / Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "诊",
        "hanzi": "诊",
        "pinyin": "zhěn",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰讠㐱",
        "radical": {
          "char": "讠",
          "name": "Ngôn",
          "strokes": 2
        },
        "meaning": "Khám bệnh, chẩn đoán, xem xét",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Ngôn 讠 (2 nét) -> Chữ Chẩn 㐱 (5 nét: nhân + ba nét phẩy sam)",
        "components": [
          "讠",
          "㐱"
        ],
        "mnemonic": "Bác sĩ hỏi han lời nói (讠) kết hợp quan sát thần sắc (㐱) để xác định bệnh: chẩn đoán, khám bệnh (门诊)."
      },
      {
        "char": "挂",
        "hanzi": "挂",
        "pinyin": "guà",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰扌卦",
        "radical": {
          "char": "扌",
          "name": "Thủ",
          "strokes": 3
        },
        "meaning": "Treo lên, lấy số thứ tự khám bệnh",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Thủ 扌 (3 nét) -> Chữ Quái 卦 (6 nét: thổ + bặc)",
        "components": [
          "扌",
          "卦"
        ],
        "mnemonic": "Bàn tay (扌) đưa thẻ quẻ (卦) treo lên tường đánh dấu lượt khám: lấy số khám bệnh (挂号)."
      }
    ],
    "step4_grammar": {
      "formula": "凭…… (Căn cứ vào... / Dựa vào...)",
      "title": "Giới từ chỉ căn cứ giấy tờ, chứng từ",
      "explanation": "Đặt '凭 + Giấy tờ / Chứng nhận' trước động từ để biểu thị điều kiện tiên quyết để nhận quyền lợi.",
      "examples": [
        {
          "hanzi": "凭医生处方才能在药店购买处方药。",
          "pinyin": "Píng yīshēng chǔfāng cái néng zài yàodiàn gòumǎi chǔfāngyào.",
          "meaning": "Phải căn cứ theo đơn của bác sĩ mới có thể mua thuốc kê đơn tại hiệu thuốc."
        }
      ],
      "commonMistake": {
        "wrong": "凭去医院。",
        "correct": "凭身份证挂号。",
        "explanation": "Sau 凭 phải là giấy tờ cụ thể."
      }
    },
    "step5_listening": {
      "situation": "Quy trình đăng ký khám bệnh ngoại trú, cấp cứu và thủ tục xuất trình giấy tờ tại bệnh viện lớn",
      "context": "Tại sảnh hướng dẫn đăng ký khám bệnh bệnh viện Đại học Y khoa Bắc Kinh",
      "participants": "A: Nhân viên bàn hướng dẫn bệnh nhân, B: Bệnh nhân nước ngoài đến khám bệnh",
      "targetGoal": "Vận dụng giới từ 凭…… (căn cứ vào... / dựa vào / xuất trình...) trong thủ tục y tế (挂号, 门诊, 急诊, 凭)",
      "usageNotes": "\"挂号\" (lấy số đăng ký khám) tại các bệnh viện cấp 3A Trung Quốc hiện nay chủ yếu thực hiện qua ứng dụng điện thoại hoặc cây kiosk thông minh tự phục vụ.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "您好，这里是门诊导医台，请问您预约挂了哪个科室的专家号？",
          "pinyin": "Nín hǎo, zhèlǐ shì ménzhěn dǎoyītái, qǐngwèn nín yùyuē guà le nǎ ge kēshì de zhuānjiā hào?",
          "meaning": "Chào quý khách, đây là bàn hướng dẫn bệnh nhân ngoại trú, xin hỏi anh đã hẹn trước lấy số của khoa chuyên gia nào rồi ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "你好，我昨晚开始急性胃痛，还没来得及网上预约，请问普通门诊现在还能现场挂号吗？",
          "pinyin": "Nǐ hǎo, wǒ zuówǎn kāishǐ jíxìng wèitòng, hái méi láidejí wǎngshang yùyuē, qǐngwèn pǔtōng ménzhěn xiànzài hái néng xiànchǎng guàhào ma?",
          "meaning": "Chào chị, tối qua tôi bắt đầu đau dạ dày cấp tính, vẫn chưa kịp đặt lịch hẹn qua mạng, xin hỏi khám thông thường bây giờ còn lấy số tại chỗ được không?"
        },
        {
          "speaker": "A",
          "hanzi": "如果是急性剧烈疼痛，请直接前往急诊科走绿色通道；如果病情平稳，可以凭护照在自助机挂消化内科号。",
          "pinyin": "Rúguǒ shì jíxìng jùliè téngtòng, qǐng zhíjiē qiánwǎng jízhěnkē zǒu lǜsè tōngdào; rúguǒ bìngqíng píngwěn, kěyǐ píng hùzhào zài zìzhùjī guà xiāohuà nèikē hào.",
          "meaning": "Nếu là cơn đau dữ dội cấp tính, xin mời anh đi thẳng sang khoa Cấp cứu theo lối ưu tiên; nếu bệnh tình tạm ổn định, có thể xuất trình hộ chiếu lấy số tại máy tự phục vụ khoa Tiêu hóa."
        },
        {
          "speaker": "B",
          "hanzi": "疼痛还可以忍受，我这就凭护照去办理。请问就诊是在哪一栋大楼？",
          "pinyin": "Téngtòng hái kěyǐ rěnshòu, wǒ zhè jiù píng hùzhào qù bànlǐ. Qǐngwèn jiùzhěn shì zài nǎ yì dòng dàlóu?",
          "meaning": "Cơn đau vẫn có thể chịu đựng được, tôi đi xuất trình hộ chiếu làm thủ tục ngay. Xin hỏi phòng khám nằm ở tòa nhà nào vậy chị?"
        },
        {
          "speaker": "A",
          "hanzi": "在门诊大楼三楼内科二区，打印挂号凭条后，请到候诊区扫码签到并等待叫号。",
          "pinyin": "Zài ménzhěn dàlóu sānlóu nèikē èrqū, dǎyìn guàhào píngtiáo hòu, qǐng dào hòuzhěnqū sǎomǎ qiāndào bìng děngdài jiàohào.",
          "meaning": "Ở tầng 3 tòa nhà Ngoại trú khu 2 Nội khoa ạ, sau khi in phiếu khám, xin mời anh đến khu chờ quét mã điểm danh và đợi loa gọi số."
        }
      ],
      "audioText": "您好，这里是门诊导医台，请问您预约挂了哪个科室的专家号？你好，我昨晚开始急性胃痛，还没来得及网上预约，请问普通门诊现在还能现场挂号吗？如果是急性剧烈疼痛，请直接前往急诊科走绿色通道；如果病情平稳，可以凭护照在自助机挂消化内科号。疼痛还可以忍受，我这就凭护照去办理。请问就诊是在哪一栋大楼？在门诊大楼三楼内科二区，打印挂号凭条后，请到候诊区扫码签到并等待叫号。",
      "question": "Khi bệnh nhân đến khám bệnh mà chưa đặt lịch trước, cần xuất trình giấy tờ gì ở máy tự phục vụ để lấy số?",
      "options": [
        "Xuất trình vé máy bay",
        "Xuất trình hộ chiếu (凭护照在自助机挂号)",
        "Xuất trình thẻ học sinh",
        "Không cần giấy tờ gì cả"
      ],
      "correctIndex": 1,
      "explanation": "Nhân viên hướng dẫn: \"可以凭护照在自助机挂消化内科号\" (Có thể xuất trình hộ chiếu tại máy tự phục vụ để lấy số khoa Tiêu hóa)."
    },
    "step6_speaking": {
      "prompt": "Hỏi quầy chỉ dẫn bệnh viện:",
      "targetSentence": "请问自助挂号机在哪里？",
      "targetPinyin": "Qǐngwèn zìzhù guàhàojī zài nǎlǐ?",
      "targetMeaning": "Xin hỏi máy đăng ký khám bệnh tự động ở đâu ạ?",
      "hint": "Phát âm rõ ràng guàhào."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Xuất trình thẻ bảo hiểm y tế để lấy số khám'",
      "words": [
        "取号就诊",
        "凭医保卡",
        "患者"
      ],
      "correctOrder": [
        "患者",
        "凭医保卡",
        "取号就诊"
      ],
      "explanation": "Chủ ngữ + 凭... + Hành động."
    },
    "step8_quiz": [
      {
        "id": "q-516-1",
        "type": "multiple-choice",
        "question": "Khoa khám và cấp cứu 24/24 trong bệnh viện gọi là gì?",
        "options": [
          "门诊",
          "急诊",
          "挂号处",
          "收费处"
        ],
        "correctIndex": 1,
        "explanation": "急诊 (jízhěn) là khoa cấp cứu."
      },
      {
        "id": "q-516-2",
        "type": "multiple-choice",
        "question": "Điền từ: '请大家____票有序入场参观。'",
        "options": [
          "凭",
          "由于",
          "既然",
          "甚至"
        ],
        "correctIndex": 0,
        "explanation": "Căn cứ theo vé vào cửa dùng 凭."
      }
    ],
    "step9_challenge": {
      "title": "Đăng ký khám bệnh",
      "taskDesc": "Thực hành hỏi nhân viên bàn hướng dẫn bệnh viện cách chọn khoa khám bệnh phù hợp.",
      "targetPhrase": "píng yībǎokǎ guàhào",
      "xpReward": 60,
      "badge": "Bệnh Nhân Thông Thái"
    }
  },
  {
    "id": "l-517",
    "chapterId": "ch-20",
    "levelId": "lvl-5",
    "lessonNumber": 2,
    "title": "Miêu tả triệu chứng bệnh chi tiết",
    "chineseTitle": "描述病情症状与既往史",
    "subtitle": "Cách trình bày chính xác cảm giác khó chịu: chóng mặt, buồn nôn, dị ứng, đau âm ỉ.",
    "objective": "Làm chủ từ vựng miêu tả cơn đau: 头晕, 恶心, 过敏, 阵痛 và phó từ 隐隐……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-20"
    ],
    "step1_learn": {
      "topic": "Miêu tả triệu chứng bệnh chi tiết - Trọng tâm HSK 5",
      "summary": "Cách trình bày chính xác cảm giác khó chịu: chóng mặt, buồn nôn, dị ứng, đau âm ỉ.",
      "keyTakeaways": [
        "Làm chủ từ vựng miêu tả cơn đau: 头晕, 恶心, 过敏, 阵痛 và phó từ 隐隐……",
        "Làm chủ điểm ngữ pháp: 隐隐作痛 (Đau âm ỉ / Đau nhức dai dẳng)"
      ],
      "audioDemoText": "大夫，我肚子隐隐作痛，伴有恶心，而且我对青霉素过敏。"
    },
    "step2_vocabulary": [
      {
        "id": "v-517-1",
        "hanzi": "头晕",
        "pinyin": "tóuyūn",
        "hanviet": "Đầu vựng",
        "meaning": "Chóng mặt, choáng váng",
        "radical": "Bộ 日",
        "example": {
          "hanzi": "早晨起床时感到一阵阵头晕目眩。",
          "pinyin": "Zǎochén qǐchuáng shí gǎndào yízhènzhèn tóuyūn-mùxuàn.",
          "meaning": "Sáng ngủ dậy cảm thấy từng cơn chóng mặt hoa mắt."
        },
        "pos": "Tính từ / Cụm động tân"
      },
      {
        "id": "v-517-2",
        "hanzi": "恶心",
        "pinyin": "ěxin",
        "hanviet": "Ác tâm",
        "meaning": "Buồn nôn, lợm giọng",
        "radical": "Bộ 心",
        "example": {
          "hanzi": "吃了油腻的食物后胃里特别恶心。",
          "pinyin": "Chī le yóunì de shíwù hòu wèi lǐ tèbié ěxin.",
          "meaning": "Sau khi ăn đồ ăn nhiều dầu mỡ trong dạ dày rất buồn nôn."
        },
        "pos": "Tính từ / Động từ"
      },
      {
        "id": "v-517-3",
        "hanzi": "过敏",
        "pinyin": "guòmǐn",
        "hanviet": "Quá mẫn",
        "meaning": "Dị ứng (thuốc, phấn hoa, hải sản)",
        "radical": "Bộ 心",
        "example": {
          "hanzi": "我对海鲜严重过敏，吃虾会浑身起红疹。",
          "pinyin": "Wǒ duì hǎixiān yánzhòng guòmǐn, chī xiā huì húnshēn qǐ hóngzhěn.",
          "meaning": "Tôi bị dị ứng hải sản nghiêm trọng, ăn tôm sẽ nổi mẩn đỏ khắp người."
        },
        "pos": "Tính từ / Động từ / Danh từ"
      },
      {
        "id": "v-517-4",
        "hanzi": "隐隐",
        "pinyin": "yǐnyǐn",
        "hanviet": "Ẩn ẩn",
        "meaning": "Âm ỉ, thoang thoảng không dứt",
        "radical": "Bộ 阝",
        "example": {
          "hanzi": "右上腹部总感到隐隐作痛，已经持续三天了。",
          "pinyin": "Yòushàng fùbù zǒng gǎndào yǐnyǐn zuòtòng, yǐjīng chíxù sān tiān le.",
          "meaning": "Phần bụng trên bên phải luôn cảm thấy đau âm ỉ, đã kéo dài 3 ngày rồi."
        },
        "pos": "Phó từ / Tính từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "晕",
        "hanzi": "晕",
        "pinyin": "yūn",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱日军",
        "radical": {
          "char": "日",
          "name": "Nhật",
          "strokes": 4
        },
        "meaning": "Chóng mặt, choáng váng, hoa mắt",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Nhật 日 (4 nét) -> Chữ Quân 军 (6 nét: mịch + xa)",
        "components": [
          "日",
          "军"
        ],
        "mnemonic": "Dưới ánh mặt trời gay gắt (日), đầu óc quay cuồng như bánh xe (军): chóng mặt, hoa mắt (头晕)."
      },
      {
        "char": "敏",
        "hanzi": "敏",
        "pinyin": "mǐn",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰每攵",
        "radical": {
          "char": "攵",
          "name": "Phác",
          "strokes": 4
        },
        "meaning": "Nhạy cảm, mẫn cảm, dị ứng",
        "strokesCount": 11,
        "strokeOrderText": "Chữ Mỗi 每 (7 nét) -> Bộ Phác 攵 (4 nét: phẩy, ngang, phẩy, mác)",
        "components": [
          "每",
          "攵"
        ],
        "mnemonic": "Mỗi một biến đổi nhỏ (每) đều lập tức phản ứng nhanh nhạy (攵): dị ứng, nhanh nhạy (过敏)."
      }
    ],
    "step4_grammar": {
      "formula": "隐隐作痛 (Đau âm ỉ / Đau nhức dai dẳng)",
      "title": "Cụm cố định miêu tả mức độ đau đớn y khoa",
      "explanation": "Dùng để phân biệt với '剧烈疼痛' (đau dữ dội quằn quại), giúp bác sĩ định lượng bệnh chính xác.",
      "examples": [
        {
          "hanzi": "胃部隐隐作痛，建议做个胃镜检查。",
          "pinyin": "Wèibù yǐnyǐn zuòtòng, jiànyì zuò gè wèijìng jiǎncá.",
          "meaning": "Dạ dày đau âm ỉ, khuyên bạn nên làm nội soi dạ dày."
        }
      ],
      "commonMistake": {
        "wrong": "他隐隐头疼作痛。",
        "correct": "他感到隐隐作痛。",
        "explanation": "隐隐作痛 là một cụm trọn vẹn mô tả cảm giác đau."
      }
    },
    "step5_listening": {
      "situation": "Miêu tả chi tiết các triệu chứng bệnh, cảm giác đau âm ỉ, chóng mặt và tiền sử dị ứng",
      "context": "Phòng khám bệnh chuyên khoa Nội Tiêu hóa của bác sĩ chủ trị",
      "participants": "A: Bác sĩ chuyên khoa tiêu hóa, B: Bệnh nhân miêu tả bệnh tình",
      "targetGoal": "Vận dụng thành ngữ miêu tả cảm giác đau 隐隐作痛 (đau âm ỉ dai dẳng) và thuật ngữ bệnh lý (头晕, 恶心, 过敏)",
      "usageNotes": "\"隐隐作痛\" miêu tả cảm giác đau ngầm rỉ rả không dữ dội nhưng liên tục, phân biệt với \"剧烈疼痛\" (đau dữ dội quằn quại).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "请坐，具体感觉哪里不舒服？这种症状持续多久了？",
          "pinyin": "Qǐng zuò, jùtǐ gǎnjué nǎlǐ bù shūfu? Zhè zhǒng zhèngzhuàng chíxù duō jiǔ le?",
          "meaning": "Xin mời ngồi, cụ thể anh cảm thấy khó chịu ở vị trí nào? Triệu chứng này kéo dài bao lâu rồi?"
        },
        {
          "speaker": "B",
          "hanzi": "大夫，从昨晚吃完海鲜后，上腹部就一直隐隐作痛，伴有轻微的头晕和恶心想吐。",
          "pinyin": "Dàifu, cóng zuówǎn chī wán hǎixiān hòu, shàngfùbù jiù yìzhí yǐnyǐn-zuòtòng, bàn yǒu qīngwēi de tóuyūn hé ěxin xiǎng tù.",
          "meaning": "Thưa bác sĩ, từ tối qua sau khi ăn hải sản xong, vùng bụng trên cứ liên tục đau âm ỉ, kèm theo hơi chóng mặt và cảm giác buồn nôn muốn nôn ói."
        },
        {
          "speaker": "A",
          "hanzi": "腹部有腹泻或者皮肤发痒起红疹的现象吗？以前有没有药物或食物过敏史？",
          "pinyin": "Fùbù yǒu fùxiè huòzhě pífū fāyǎng qǐ hóngzhěn de xiànxiàng ma? Yǐqián yǒu méiyǒu yàowù huò shíwù guòmǐn shǐ?",
          "meaning": "Bụng anh có bị tiêu chảy hoặc da có hiện tượng ngứa ngáy nổi mẩn đỏ không? Trước đây anh có tiền sử dị ứng thuốc hay dị ứng thức ăn gì không?"
        },
        {
          "speaker": "B",
          "hanzi": "没有腹泻，但我对青霉素严重过敏。肚子倒不是剧烈绞痛，但总觉得胃部胀满、隐隐作痛。",
          "pinyin": "Méiyǒu fùxiè, dàn wǒ duì qīngméisù yánzhòng guòmǐn. Dùzi dào bú shì jùliè jiǎotòng, dàn zǒng juéde wèibù zhàngmǎn, yǐnyǐn-zuòtòng.",
          "meaning": "Tôi không bị tiêu chảy, nhưng tôi bị dị ứng nghiêm trọng với penicillin. Bụng không phải đau quặn dữ dội nhưng cứ thấy dạ dày trướng đầy, đau âm ỉ."
        },
        {
          "speaker": "A",
          "hanzi": "好的，我已经把青霉素过敏记录在病历上了。为了排除急性胃黏膜病变，需要先做两项化验检查。",
          "pinyin": "Hǎo de, wǒ yǐjīng bǎ qīngméisù guòmǐn jìlù zài bìnglì shang le. Wèile páichú jíxìng wèiniánmó bìngbiàn, xūyào xiān zuò liǎng xiàng huàyàn jiǎnchá.",
          "meaning": "Được rồi, tôi đã ghi nhận tiền sử dị ứng penicillin vào bệnh án rồi. Để loại trừ tổn thương niêm mạc dạ dày cấp tính, cần làm hai xét nghiệm kiểm tra trước."
        }
      ],
      "audioText": "请坐，具体感觉哪里不舒服？这种症状持续多久了？大夫，从昨晚吃完海鲜后，上腹部就一直隐隐作痛，伴有轻微的头晕和恶心想吐。腹部有腹泻或者皮肤发痒起红疹的现象吗？以前有没有药物或食物过敏史？没有腹泻，但我对青霉素严重过敏。肚子倒不是剧烈绞痛，但总觉得胃部胀满、隐隐作痛。好的，我已经把青霉素过敏记录在病历上了。为了排除急性胃黏膜病变，需要先做两项化验检查。",
      "question": "Bệnh nhân có tiền sử dị ứng nghiêm trọng với chất nào?",
      "options": [
        "Dị ứng phấn hoa",
        "Dị ứng thuốc kháng sinh penicillin (对青霉素严重过敏)",
        "Dị ứng lông chó mèo",
        "Không dị ứng với bất kỳ chất nào"
      ],
      "correctIndex": 1,
      "explanation": "Bệnh nhân báo rõ tiền sử dị ứng: \"但我对青霉素严重过敏\" (Nhưng tôi bị dị ứng nghiêm trọng với penicillin)."
    },
    "step6_speaking": {
      "prompt": "Kể bệnh với bác sĩ:",
      "targetSentence": "大夫，我胸口隐隐作痛，喘不过气来。",
      "targetPinyin": "Dàifu, wǒ xiōngkǒu yǐnyǐn zuòtòng, chuǎn bú guò qì lái.",
      "targetMeaning": "Bác sĩ ơi, lồng ngực tôi đau âm ỉ, thở không ra hơi.",
      "hint": "Nói rõ ràng vị trí đau."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Tôi bị dị ứng nghiêm trọng với phấn hoa'",
      "words": [
        "我对花粉",
        "过敏",
        "十分严重"
      ],
      "correctOrder": [
        "我对花粉",
        "十分严重",
        "过敏"
      ],
      "explanation": "Cấu trúc 对...过敏."
    },
    "step8_quiz": [
      {
        "id": "q-517-1",
        "type": "multiple-choice",
        "question": "Từ nào diễn đạt cảm giác thức ăn dâng lên cổ họng muốn nôn ra?",
        "options": [
          "恶心 (ěxin)",
          "头晕",
          "骨折",
          "贫血"
        ],
        "correctIndex": 0,
        "explanation": "恶心 là cảm giác buồn nôn lợm giọng."
      },
      {
        "id": "q-517-2",
        "type": "multiple-choice",
        "question": "Điền từ: '伤口虽然缝合了，但依然感到____。'",
        "options": [
          "隐隐作痛",
          "赞不绝口",
          "显而易见",
          "不见不散"
        ],
        "correctIndex": 0,
        "explanation": "Đau âm ỉ là 隐隐作痛."
      }
    ],
    "step9_challenge": {
      "title": "Khai báo bệnh án",
      "taskDesc": "Đóng vai bệnh nhân miêu tả đầy đủ 3 triệu chứng sốt, đau bụng âm ỉ và dị ứng cho bác sĩ.",
      "targetPhrase": "yǐnyǐn zuòtòng guòmǐn",
      "xpReward": 60,
      "badge": "Giao Tiếp Y Khoa"
    }
  },
  {
    "id": "l-518",
    "chapterId": "ch-20",
    "levelId": "lvl-5",
    "lessonNumber": 3,
    "title": "Xét nghiệm y tế & Nhận kết quả chẩn đoán",
    "chineseTitle": "医疗化验检查与诊断",
    "subtitle": "Quy trình lấy máu, chụp X-quang, đọc phiếu kết quả xét nghiệm và nghe bác sĩ chẩn đoán.",
    "objective": "Làm chủ từ vựng xét nghiệm: 化验, 抽血, 检查, 确诊 và phó từ 幸亏……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-20"
    ],
    "step1_learn": {
      "topic": "Xét nghiệm y tế & Nhận kết quả chẩn đoán - Trọng tâm HSK 5",
      "summary": "Quy trình lấy máu, chụp X-quang, đọc phiếu kết quả xét nghiệm và nghe bác sĩ chẩn đoán.",
      "keyTakeaways": [
        "Làm chủ từ vựng xét nghiệm: 化验, 抽血, 检查, 确诊 và phó từ 幸亏……",
        "Làm chủ điểm ngữ pháp: 幸亏……不然/否则…… (May mà... nếu không thì...)"
      ],
      "audioDemoText": "白细胞指标略微偏高，确诊为轻微细菌感染，幸亏来得早。"
    },
    "step2_vocabulary": [
      {
        "id": "v-518-1",
        "hanzi": "化验",
        "pinyin": "huàyàn",
        "hanviet": "Hóa nghiệm",
        "meaning": "Xét nghiệm, phân tích sinh hóa",
        "radical": "Bộ 亻",
        "example": {
          "hanzi": "医生开了一张化验单，需要空腹抽血。",
          "pinyin": "Yīshēng kāi le yì zhāng huàyàndān, xūyào kōngfù chōuxuè.",
          "meaning": "Bác sĩ kê một phiếu xét nghiệm, cần nhịn ăn lấy máu."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-518-2",
        "hanzi": "抽血",
        "pinyin": "chōuxuè",
        "hanviet": "Trừu huyết",
        "meaning": "Lấy máu, rút máu xét nghiệm",
        "radical": "Bộ 扌",
        "example": {
          "hanzi": "抽血化验需要保持空腹八小时以上。",
          "pinyin": "Chōuxuè huàyàn xūyào bǎochí kōngfù bā xiǎoshí yǐshàng.",
          "meaning": "Lấy máu xét nghiệm cần giữ bụng đói trên 8 tiếng."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-518-3",
        "hanzi": "诊断",
        "pinyin": "zhěnduàn",
        "hanviet": "Chẩn đoạn",
        "meaning": "Chẩn đoán bệnh tình",
        "radical": "Bộ 言",
        "example": {
          "hanzi": "根据检查结果，医生诊断为急性肠胃炎。",
          "pinyin": "Gēnjù jiǎnchá jiéguǒ, yīshēng zhěnduàn wéi jíxìng chángwèiyán.",
          "meaning": "Căn cứ kết quả kiểm tra, bác sĩ chẩn đoán là viêm dạ dày ruột cấp tính."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-518-4",
        "hanzi": "幸亏",
        "pinyin": "xìngkuī",
        "hanviet": "Hạnh khuy",
        "meaning": "May mà, may mắn nhờ có (phó từ)",
        "radical": "Bộ 土",
        "example": {
          "hanzi": "幸亏送医及时，病情很快得到了控制。",
          "pinyin": "Xìngkuī sòng yī jíshí, bìngqíng hěn kuài dédào le kòngzhì.",
          "meaning": "May mà đưa đến bệnh viện kịp thời, bệnh tình rất nhanh đã được kiểm soát."
        },
        "pos": "Phó từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "断",
        "hanzi": "断",
        "pinyin": "duàn",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰𢆶斤",
        "radical": {
          "char": "斤",
          "name": "Cân",
          "strokes": 4
        },
        "meaning": "Chặt đứt, phán đoán, chẩn đoán",
        "strokesCount": 11,
        "strokeOrderText": "Phần bên trái 𢆶 (7 nét: hai bộ ấu gộp) -> Bộ Cân 斤 (4 nét)",
        "components": [
          "𢆶",
          "斤"
        ],
        "mnemonic": "Dùng chiếc rìu sắc (斤) chặt đứt dứt khoát cuộn tơ rối (𢆶): chẩn đoán, quyết đoán (诊断)."
      },
      {
        "char": "亏",
        "hanzi": "亏",
        "pinyin": "kuī",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "亏",
        "radical": {
          "char": "一",
          "name": "Nhất",
          "strokes": 1
        },
        "meaning": "Thiếu hụt, may mà nhờ có, thua thiệt",
        "strokesCount": 3,
        "strokeOrderText": "Ngang -> Ngang -> Sổ cong móc (亏)",
        "components": [
          "一"
        ],
        "mnemonic": "Thở dài khi đường tài vận bị hao hụt mất mát: may mà nhờ có, thua lỗ (幸亏, 吃亏)."
      }
    ],
    "step4_grammar": {
      "formula": "幸亏……不然/否则…… (May mà... nếu không thì...)",
      "title": "Cấu trúc liên từ giải thích sự thoát nạn may mắn",
      "explanation": "Vế trước chỉ sự việc may mắn xảy ra đúng lúc, vế sau chỉ hậu quả xấu đã được ngăn chặn kịp thời.",
      "examples": [
        {
          "hanzi": "幸亏今天带了雨伞，否则肯定淋成落汤鸡。",
          "pinyin": "Xìngkuī jīntiān dài le yǔsǎn, fǒuzé kěndìng línchéng luòtāngjī.",
          "meaning": "May mà hôm nay mang ô, nếu không nhất định ướt như chuột lột."
        }
      ],
      "commonMistake": {
        "wrong": "他幸亏来了，否则没赶上。",
        "correct": "幸亏他来了，否则就赶不上了。",
        "explanation": "幸亏 thường đứng đầu câu trước chủ ngữ."
      }
    },
    "step5_listening": {
      "situation": "Làm xét nghiệm y tế, lấy máu phân tích sinh hóa và nhận kết quả chẩn đoán",
      "context": "Tại phòng xét nghiệm và khu đọc kết quả chẩn đoán bệnh viện",
      "participants": "A: Bác sĩ trả kết quả xét nghiệm, B: Bệnh nhân nhận kết quả",
      "targetGoal": "Vận dụng liên từ điều kiện may mắn 幸亏……不然/否则…… (may mà... nếu không thì...) (化验, 抽血, 诊断, 幸亏)",
      "usageNotes": "\"幸亏……不然……\" diễn đạt sự may mắn vì đã kịp thời hành động, nếu không sẽ dẫn đến hậu quả nghiêm trọng hơn.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "刚才化验室抽血化验和腹部超声波的结果出来了，请您过目。",
          "pinyin": "Gāngcái huàyànshì chōuxuè huàyàn hé fùbù chāoshēngbō de jiéguǒ chūlái le, qǐng nín guòmù.",
          "meaning": "Vừa rồi kết quả rút máu xét nghiệm và siêu âm ổ bụng đã có rồi, xin mời anh xem qua."
        },
        {
          "speaker": "B",
          "hanzi": "大夫，化验单上的指标偏高，初步诊断结果是什么问题？严重吗？",
          "pinyin": "Dàifu, huàyàndān shang de zhǐbiāo piān gāo, chūbù zhěnduàn jiéguǒ shì shénme wèntí? Yánzhòng ma?",
          "meaning": "Bác sĩ ơi, các chỉ số trên phiếu xét nghiệm hơi cao, kết quả chẩn đoán sơ bộ là vấn đề gì vậy? Có nghiêm trọng không ạ?"
        },
        {
          "speaker": "A",
          "hanzi": "诊断为急性胃炎伴胃酸分泌过多。幸亏你及时来医院就诊，否则拖延下去可能引发胃溃疡出血。",
          "pinyin": "Zhěnduàn wéi jíxìng wèiyán bàn wèisuān fēnmì guòduō. Xìngkuī nǐ jíshí lái yīyuàn jiùzhěn, fǒuzé tuōyán xiàqu kěnéng yǐnfā wèikuìyáng chūxuè.",
          "meaning": "Chẩn đoán là viêm dạ dày cấp tính kèm theo dịch vị tiết quá nhiều. May mà anh đến bệnh viện khám kịp thời, nếu không kéo dài có thể dẫn đến loét dạ dày chảy máu."
        },
        {
          "speaker": "B",
          "hanzi": "听您这么说我放心多了！难怪一直觉得胃部灼热疼痛，需要住院输液治疗吗？",
          "pinyin": "Tīng nín zhème shuō wǒ fàngxīn duō le! Nánguài yìzhí juéde wèibù zhuórè téngtòng, xūyào zhùyuàn shūyè zhìliáo ma?",
          "meaning": "Nghe bác sĩ nói vậy tôi yên tâm nhiều rồi! Thảo nào cứ thấy dạ dày nóng rát đau nhức, có cần phải nằm viện truyền dịch điều trị không ạ?"
        },
        {
          "speaker": "A",
          "hanzi": "不需要住院。按时服用抑酸与保护胃黏膜的药物，注意清淡饮食，一周左右就能康复。",
          "pinyin": "Bù xūyào zhùyuàn. Ànshí fúyòng yìsuān yǔ bǎohù wèiniánmó de yàowù, zhùyì qīngdàn yǐnshí, yì zhōu zuǒyòu jiù néng kāngfù.",
          "meaning": "Không cần nằm viện đâu anh. Uống thuốc ức chế axit và bảo vệ niêm mạc dạ dày đúng giờ, chú ý ăn uống thanh đạm, khoảng một tuần là có thể hồi phục."
        }
      ],
      "audioText": "刚才化验室抽血化验和腹部超声波的结果出来了，请您过目。大夫，化验单上的指标偏高，初步诊断结果是什么问题？严重吗？诊断为急性胃炎伴胃酸分泌过多。幸亏你及时来医院就诊，否则拖延下去可能引发胃溃疡出血。听您这么说我放心多了！难怪一直觉得胃部灼热疼痛，需要住院输液治疗吗？不需要住院。按时服用抑酸与保护胃黏膜的药物，注意清淡饮食，一周左右就能康复。",
      "question": "Bác sĩ chẩn đoán kết quả bệnh tình của bệnh nhân là gì?",
      "options": [
        "Gãy xương cẳng chân",
        "Viêm dạ dày cấp tính kèm dịch vị tiết nhiều (急性胃炎伴胃酸分泌过多)",
        "Cảm cúm thông thường",
        "Cần phải mổ cấp cứu ngay"
      ],
      "correctIndex": 1,
      "explanation": "Bác sĩ thông báo chẩn đoán: \"诊断为急性胃炎伴胃酸分泌过多\" (Chẩn đoán là viêm dạ dày cấp kèm tiết nhiều dịch vị)."
    },
    "step6_speaking": {
      "prompt": "Bác sĩ động viên bệnh nhân:",
      "targetSentence": "幸亏检查及时，按时吃药多休息就没事了。",
      "targetPinyin": "Xìngkuī jiǎnchá jíshí, ànshí chī yào duō xiūxi jiù méi shì le.",
      "targetMeaning": "May mà đi khám kịp thời, uống thuốc đúng giờ nghỉ ngơi nhiều là không sao rồi.",
      "hint": "Lời căn dặn ấm áp."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'May mà có bạn nhắc nhở nếu không tôi đã quên mất'",
      "words": [
        "我差点忘了",
        "幸亏有你提醒",
        "否则"
      ],
      "correctOrder": [
        "幸亏有你提醒",
        "否则",
        "我差点忘了"
      ],
      "explanation": "Cấu trúc 幸亏...否则..."
    },
    "step8_quiz": [
      {
        "id": "q-518-1",
        "type": "multiple-choice",
        "question": "Yêu cầu quan trọng nhất trước khi đi lấy máu xét nghiệm sinh hóa vào buổi sáng là gì?",
        "options": [
          "Ăn thật no",
          "Giữ bụng đói không ăn sáng (空腹)",
          "Uống nước ngọt",
          "Chạy bộ 5km"
        ],
        "correctIndex": 1,
        "explanation": "Lấy máu xét nghiệm cần 空腹 (nhịn ăn)."
      },
      {
        "id": "q-518-2",
        "type": "multiple-choice",
        "question": "Điền từ: '____系了安全带，发生车祸时才没有受重伤。'",
        "options": [
          "幸亏",
          "由于",
          "究竟",
          "固然"
        ],
        "correctIndex": 0,
        "explanation": "May mắn thoát nạn dùng 幸亏."
      }
    ],
    "step9_challenge": {
      "title": "Đọc phiếu xét nghiệm",
      "taskDesc": "Thực hành hội thoại trao đổi kết quả xét nghiệm máu và chẩn đoán với bác sĩ.",
      "targetPhrase": "xìngkuī jiǎnchá huàyàn",
      "xpReward": 60,
      "badge": "Tự Tin Đi Khám"
    }
  },
  {
    "id": "l-519",
    "chapterId": "ch-20",
    "levelId": "lvl-5",
    "lessonNumber": 4,
    "title": "Lấy thuốc theo đơn & Hướng dẫn sử dụng",
    "chineseTitle": "药房取药与用药医嘱",
    "subtitle": "Cách mua thuốc theo đơn tại quầy dược, hiểu liều lượng, tác dụng phụ và kiêng khem khi uống thuốc.",
    "objective": "Làm chủ từ vựng dùng thuốc: 处方, 服用, 剂量, 饭后 và giới từ 遵照……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-20"
    ],
    "step1_learn": {
      "topic": "Lấy thuốc theo đơn & Hướng dẫn sử dụng - Trọng tâm HSK 5",
      "summary": "Cách mua thuốc theo đơn tại quầy dược, hiểu liều lượng, tác dụng phụ và kiêng khem khi uống thuốc.",
      "keyTakeaways": [
        "Làm chủ từ vựng dùng thuốc: 处方, 服用, 剂量, 饭后 và giới từ 遵照……",
        "Làm chủ điểm ngữ pháp: 遵照…… (Tuân theo... / Làm theo lời dặn...)"
      ],
      "audioDemoText": "白色胶囊刺激胃，必须遵照医嘱饭后半小时服用。"
    },
    "step2_vocabulary": [
      {
        "id": "v-519-1",
        "hanzi": "处方",
        "pinyin": "chǔfāng",
        "hanviet": "Xử phương",
        "meaning": "Đơn thuốc, toa thuốc bác sĩ kê",
        "radical": "Bộ 夂",
        "example": {
          "hanzi": "请拿着处方单去一楼大厅药房窗口缴费取药。",
          "pinyin": "Qǐng ná zhe chǔfāngdān qù yì lóu dàtīng yàofáng chuāngkǒu jiǎofèi qǔyào.",
          "meaning": "Xin cầm đơn thuốc xuống quầy thuốc sảnh tầng 1 nộp tiền lấy thuốc."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-519-2",
        "hanzi": "服用",
        "pinyin": "fúyòng",
        "hanviet": "Phục dụng",
        "meaning": "Uống thuốc, dùng thuốc",
        "radical": "Bộ 月",
        "example": {
          "hanzi": "这种胶囊每日三次，每次两粒，饭后温水服用。",
          "pinyin": "Zhè zhǒng jiāonáng měi rì sān cì, měi cì liǎng lì, fànhòu wēnshuǐ fúyòng.",
          "meaning": "Viên nang này ngày uống 3 lần, mỗi lần 2 viên, uống với nước ấm sau bữa ăn."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-519-3",
        "hanzi": "剂量",
        "pinyin": "jìliàng",
        "hanviet": "Tế lượng",
        "meaning": "Liều lượng, liều dùng",
        "radical": "Bộ 讠",
        "example": {
          "hanzi": "切不可随意增加药丸的剂量，以免引起不良反应。",
          "pinyin": "Qiè bù kě suíyì zēngjiā yàowán de jìliàng, yǐmiǎn yǐnqǐ bùliáng fǎnyìng.",
          "meaning": "Tuyệt đối không được tùy tiện tăng liều lượng thuốc, tránh gây phản ứng phụ."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-519-4",
        "hanzi": "遵照",
        "pinyin": "zūnzhào",
        "hanviet": "Tuân chiếu",
        "meaning": "Tuân theo, làm theo chỉ dẫn",
        "radical": "Bộ 辶",
        "example": {
          "hanzi": "患者必须严格遵照医嘱按时服药。",
          "pinyin": "Huànzhě bìxū yángé zūnzhào yīzhǔ ànshí fúyào.",
          "meaning": "Bệnh nhân phải tuân thủ nghiêm ngặt chỉ dẫn của bác sĩ uống thuốc đúng giờ."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "剂",
        "hanzi": "剂",
        "pinyin": "jì",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰齐刂",
        "radical": {
          "char": "刂",
          "name": "Đao",
          "strokes": 2
        },
        "meaning": "Liều thuốc, thang thuốc, phân chia",
        "strokesCount": 8,
        "strokeOrderText": "Chữ Tề 齐 (6 nét: văn + tề) -> Bộ Đao đứng 刂 (2 nét)",
        "components": [
          "齐",
          "刂"
        ],
        "mnemonic": "Dùng dao (刂) phân chia dược liệu thành từng phần cân đối chuẩn xác (齐): liều lượng (剂量)."
      },
      {
        "char": "遵",
        "hanzi": "遵",
        "pinyin": "zūn",
        "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿺"
        },
        "ids": "⿺辶尊",
        "radical": {
          "char": "辶",
          "name": "Quai sước",
          "strokes": 3
        },
        "meaning": "Tuân theo, làm theo chỉ dẫn",
        "strokesCount": 15,
        "strokeOrderText": "Chữ Tôn 尊 (12 nét) -> Bộ Quai sước 辶 (3 nét)",
        "components": [
          "辶",
          "尊"
        ],
        "mnemonic": "Từng bước chân (辶) nhất mực làm theo lời dặn của bậc tôn quý (尊): tuân theo chỉ dẫn (遵照)."
      }
    ],
    "step4_grammar": {
      "formula": "遵照…… (Tuân theo... / Làm theo lời dặn...)",
      "title": "Giới từ chỉ sự phục tùng chỉ dẫn chuyên môn",
      "explanation": "Thường dùng trong các hướng dẫn y tế, pháp lý '遵照 + Lời dặn / Quy định + Động từ'.",
      "examples": [
        {
          "hanzi": "遵照医生的嘱咐，按疗程吃完所有消炎药。",
          "pinyin": "Zūnzhào yīshēng de zhǔfù, àn liáochéng chī wán suǒyǒu xiāoyányào.",
          "meaning": "Tuân theo lời dặn của bác sĩ, uống hết toàn bộ thuốc chống viêm theo đúng liệu trình."
        }
      ],
      "commonMistake": {
        "wrong": "遵照你。",
        "correct": "遵照您的指示办理。",
        "explanation": "Sau 遵照 phải là chỉ thị, lời dặn, quy định."
      }
    },
    "step5_listening": {
      "situation": "Lấy thuốc theo đơn bác sĩ, kiểm tra liều lượng và dặn dò tuân thủ hướng dẫn sử dụng",
      "context": "Quầy cấp phát thuốc ngoại trú tại tầng 1 bệnh viện",
      "participants": "A: Dược sĩ cấp phát thuốc, B: Bệnh nhân nhận thuốc điều trị",
      "targetGoal": "Vận dụng động từ chỉ sự tuân thủ 遵照…… (tuân theo / làm theo lời dặn) trong y tế (处方, 服用, 剂量, 遵照)",
      "usageNotes": "\"饭前服用\" (uống trước bữa ăn 30 phút), \"饭后服用\" (uống sau bữa ăn) và \"按剂量服用\" (uống đúng liều lượng) là những chỉ dẫn y khoa chuẩn mực.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "先生您好，这是医生为您开具处方里的三种口服药，请核对一下姓名与药品种类。",
          "pinyin": "Xiānsheng nín hǎo, zhè shì yīshēng wèi nín kāijù chǔfāng lǐ de sān zhǒng kǒufúyào, qǐng héduì yíxià xìngmíng yǔ yàopǐn zhǒnglèi.",
          "meaning": "Chào anh, đây là 3 loại thuốc uống trong đơn thuốc bác sĩ kê cho anh, xin kiểm tra đối chiếu lại họ tên và chủng loại thuốc."
        },
        {
          "speaker": "B",
          "hanzi": "药名核对无误。请问这几种药的服用剂量和每天吃几次？有什么特别注意事项吗？",
          "pinyin": "Yàomíng héduì wúwù. Qǐngwèn zhè jǐ zhǒng yào de fúyòng jìliàng hé měitiān chī jǐ cì? Yǒu shénme tèbié zhùyì shìxiàng ma?",
          "meaning": "Tên thuốc đối chiếu không có sai sót. Xin hỏi liều lượng uống của các loại thuốc này và mỗi ngày uống mấy lần? Có lưu ý đặc biệt gì không ạ?"
        },
        {
          "speaker": "A",
          "hanzi": "这种胶囊每天早晚各服用一粒，必须饭前半小时空腹温水送服；这瓶药水每天三次，饭后服用。",
          "pinyin": "Zhè zhǒng jiāonáng měitiān zǎowǎn gè fúyòng yí lì, bìxū fànqián bàn xiǎoshí kōngfù wēnshuǐ sòngfú; zhè píng yàoshuǐ měitiān sān cì, fànhòu fúyòng.",
          "meaning": "Loại viên nang này mỗi ngày sáng tối uống mỗi lần 1 viên, bắt buộc uống nước ấm lúc bụng đói trước bữa ăn nửa tiếng; còn chai thuốc nước này mỗi ngày 3 lần, uống sau bữa ăn."
        },
        {
          "speaker": "B",
          "hanzi": "好的，服药期间饮食上有没有什么忌口？",
          "pinyin": "Hǎo de, fúyào qījiān yǐnshí shang yǒu méiyǒu shénme jìkǒu?",
          "meaning": "Vâng, trong thời gian uống thuốc chế độ ăn uống có cần kiêng cữ gì không ạ?"
        },
        {
          "speaker": "A",
          "hanzi": "一定要遵照医嘱，严禁饮酒，切勿食用辛辣生冷刺激的食物，严格按照推荐剂量连续服用一周。",
          "pinyin": "Yídìng yào zūnzhào yīzhǔ, yánjìn yǐnjiǔ, qièwù shíyòng xīnlà shēnglěng cìjī de shíwù, yángé ànzhào tuījiàn jìliàng liánxù fúyòng yì zhōu.",
          "meaning": "Nhất định phải tuân theo lời dặn của bác sĩ, nghiêm cấm uống rượu, tuyệt đối không ăn thức ăn cay nóng đồ sống lạnh kích thích, nghiêm ngặt uống đúng liều khuyến nghị liên tục trong 1 tuần."
        }
      ],
      "audioText": "先生您好，这是医生为您开具处方里的三种口服药，请核对一下姓名与药品种类。药名核对无误。请问这几种药的服用剂量和每天吃几次？有什么特别注意事项吗？这种胶囊每天早晚各服用一粒，必须饭前半小时空腹温水送服；这瓶药水每天三次，饭后服用。好的，服药期间饮食上有没有什么忌口？一定要遵照医嘱，严禁饮酒，切勿食用辛辣生冷刺激的食物，严格按照推荐剂量连续服用一周。",
      "question": "Viên nang bảo vệ dạ dày cần được uống vào thời điểm nào?",
      "options": [
        "Uống ngay trong bữa ăn",
        "Uống lúc bụng đói trước bữa ăn nửa tiếng (饭前半小时空腹)",
        "Nửa đêm thức dậy uống",
        "Thích uống lúc nào thì uống"
      ],
      "correctIndex": 1,
      "explanation": "Dược sĩ dặn dò cách dùng chính xác: \"这种胶囊每天早晚各服用一粒，必须饭前半小时空腹温水送服\" (Viên nang mỗi ngày sáng tối 1 viên, uống bụng đói trước ăn nửa tiếng)."
    },
    "step6_speaking": {
      "prompt": "Dặn dò uống thuốc:",
      "targetSentence": "遵照医嘱，一日三次，一次两片。",
      "targetPinyin": "Zūnzhào yīzhǔ, yí rì sān cì, yí cì liǎng piàn.",
      "targetMeaning": "Tuân theo lời bác sĩ dặn, một ngày 3 lần, mỗi lần 2 viên.",
      "hint": "Rõ ràng, dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Xin hãy tuân thủ chỉ dẫn của bác sĩ để uống thuốc đúng giờ'",
      "words": [
        "遵照医嘱",
        "请患者",
        "按时服药"
      ],
      "correctOrder": [
        "请患者",
        "遵照医嘱",
        "按时服药"
      ],
      "explanation": "Chủ ngữ + 遵照... + Hành động."
    },
    "step8_quiz": [
      {
        "id": "q-519-1",
        "type": "multiple-choice",
        "question": "Cụm từ chỉ thời điểm uống thuốc sau bữa ăn trong tiếng Trung là gì?",
        "options": [
          "饭前 (Trước ăn)",
          "饭后 (Sau ăn)",
          "空腹 (Bụng đói)",
          "睡前 (Trước ngủ)"
        ],
        "correctIndex": 1,
        "explanation": "饭后 (fànhòu) là sau bữa ăn."
      },
      {
        "id": "q-519-2",
        "type": "multiple-choice",
        "question": "Điền từ: '服药期间请____医嘱，戒烟戒酒。'",
        "options": [
          "遵照",
          "究竟",
          "反而",
          "甚至"
        ],
        "correctIndex": 0,
        "explanation": "Tuân thủ lời bác sĩ dặn dùng 遵照."
      }
    ],
    "step9_challenge": {
      "title": "Hướng dẫn dùng thuốc",
      "taskDesc": "Đóng vai dược sĩ giải thích cặn kẽ cách uống 2 loại thuốc cho bệnh nhân người nước ngoài.",
      "targetPhrase": "zūnzhào yīzhǔ fúyòng",
      "xpReward": 60,
      "badge": "Dược Sĩ Chu Đáo"
    }
  },
  {
    "id": "l-520",
    "chapterId": "ch-20",
    "levelId": "lvl-5",
    "lessonNumber": 5,
    "title": "Đại khảo hạch HSK 5 — Chinh phục Level 5",
    "chineseTitle": "HSK 5级终极实战大考核",
    "subtitle": "Tổng ôn toàn diện 2500 từ vựng và các cặp liên từ phức hợp nâng cao của cấp độ HSK 5.",
    "objective": "Nâng cao tốc độ đọc hiểu báo chí, nghe hiểu sâu sắc và tự tin viết đoạn văn luận thuật mạch lạc.",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 5",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 5",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-20"
    ],
    "step1_learn": {
      "topic": "Đại khảo hạch HSK 5 — Chinh phục Level 5 - Trọng tâm HSK 5",
      "summary": "Tổng ôn toàn diện 2500 từ vựng và các cặp liên từ phức hợp nâng cao của cấp độ HSK 5.",
      "keyTakeaways": [
        "Nâng cao tốc độ đọc hiểu báo chí, nghe hiểu sâu sắc và tự tin viết đoạn văn luận thuật mạch lạc.",
        "Làm chủ điểm ngữ pháp: 循序渐进 (Tiến bộ từng bước / Học tập bài bản)"
      ],
      "audioDemoText": "从最初的听力困难到现在的流利理解，循序渐进的努力终于得到了回报！"
    },
    "step2_vocabulary": [
      {
        "id": "v-520-1",
        "hanzi": "突破",
        "pinyin": "tūpò",
        "hanviet": "Đột phá",
        "meaning": "Bứt phá, vượt qua giới hạn",
        "radical": "Bộ 穴",
        "example": {
          "hanzi": "只要方法得当，词汇量一定能实现重大突破。",
          "pinyin": "Zhǐyào fāngfǎ dédàng, cíhuìliàng yídìng néng shíxiàn zhòngdà tūpò.",
          "meaning": "Chỉ cần phương pháp đúng đắn, vốn từ vựng nhất định sẽ tạo nên bứt phá lớn."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-520-2",
        "hanzi": "巩固",
        "pinyin": "gǒnggù",
        "hanviet": "Củng cố",
        "meaning": "Củng cố vững chắc, làm vững thêm",
        "radical": "Bộ 工",
        "example": {
          "hanzi": "复习的目的在于巩固已经掌握的知识要点。",
          "pinyin": "Fùxí de mùdì zàiyú gǒnggù yǐjīng zhǎngwò de zhīshi yàodiǎn.",
          "meaning": "Mục đích của ôn tập là để củng cố các trọng điểm kiến thức đã nắm vững."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-520-3",
        "hanzi": "冲刺",
        "pinyin": "chōngcì",
        "hanviet": "Xung thích",
        "meaning": "Nước rút, bứt tốc về đích",
        "radical": "Bộ 冫",
        "example": {
          "hanzi": "在考前最后的冲刺阶段，保持心态平稳最重要。",
          "pinyin": "Zài kǎo qián zuìhòu de chōngcì jiēduàn, bǎochí xīntài píngwěn zuì zhòngyào.",
          "meaning": "Trong giai đoạn nước rút cuối cùng trước ngày thi, giữ vững tâm lý ổn định là quan trọng nhất."
        },
        "pos": "Cụm động từ / Danh từ"
      },
      {
        "id": "v-520-4",
        "hanzi": "循序渐进",
        "pinyin": "xúnxù-jiànjìn",
        "hanviet": "Tuần tự tiệm tiến",
        "meaning": "Tiến bộ từng bước theo trình tự (Thành ngữ)",
        "radical": "Bộ 彳",
        "example": {
          "hanzi": "学习外语没有捷径，必须循序渐进持之以恒。",
          "pinyin": "Xuéxí wàiyǔ méiyǒu jiéjìng, bìxū xúnxù-jiànjìn chízhīyǐhéng.",
          "meaning": "Học ngoại ngữ không có đường tắt, bắt buộc phải tiến bộ từng bước và kiên trì đến cùng."
        },
        "pos": "Thành ngữ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "突",
        "hanzi": "突",
        "pinyin": "tū",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱穴犬",
        "radical": {
          "char": "穴",
          "name": "Huyệt",
          "strokes": 5
        },
        "meaning": "Bứt phá, đột phá, đột ngột",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Huyệt 穴 (5 nét: chấm, chấm, ngang móc, phẩy, chấm) -> Chữ Khuyển 犬 (4 nét)",
        "components": [
          "穴",
          "犬"
        ],
        "mnemonic": "Con chó săn (犬) bất ngờ từ trong hang đá (穴) lao vụt ra ngoài: đột phá, bứt phá (突破)."
      },
      {
        "char": "循",
        "hanzi": "循",
        "pinyin": "xún",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰彳盾",
        "radical": {
          "char": "彳",
          "name": "Xích",
          "strokes": 3
        },
        "meaning": "Tuần tự, tuân theo quy luật",
        "strokesCount": 12,
        "strokeOrderText": "Bộ Xích 彳 (3 nét) -> Chữ Thuẫn 盾 (9 nét: phẩy, thi, mục)",
        "components": [
          "彳",
          "盾"
        ],
        "mnemonic": "Từng bước đi (彳) vững chãi dưới sự che chắn của tấm khiên (盾) theo quy luật: tuần tự (循序渐进)."
      }
    ],
    "step4_grammar": {
      "formula": "循序渐进 (Tiến bộ từng bước / Học tập bài bản)",
      "title": "Thành ngữ chỉ phương pháp học tập khoa học",
      "explanation": "Khuyên người học xây dựng nền móng vững chắc từ dễ đến khó, không nóng vội đốt cháy giai đoạn.",
      "examples": [
        {
          "hanzi": "汉语学习应当循序渐进，打牢基础才能厚积薄发。",
          "pinyin": "Hànyǔ xuéxí yīngdāng xúnxù-jiànjìn, dǎ láo jīchǔ cái néng hòujī-bófā.",
          "meaning": "Học tiếng Trung nên đi từng bước bài bản, xây chắc nền tảng mới có thể bùng nổ sức mạnh."
        }
      ],
      "commonMistake": {
        "wrong": "他循序渐进很聪明。",
        "correct": "学习要循序渐进。",
        "explanation": "Thường làm vị ngữ hoặc định ngữ phương châm hành động."
      }
    },
    "step5_listening": {
      "situation": "Đại khảo hạch tốt nghiệp HSK 5, tổng kết phương pháp học tập có hệ thống và mục tiêu vươn tới HSK 6",
      "context": "Phỏng vấn đánh giá năng lực ngôn ngữ học thuật cao cấp và bảo vệ luận án",
      "participants": "A: Giáo sư Chủ tịch Hội đồng khảo thí, B: Học viên xuất sắc hoàn thành HSK 5",
      "targetGoal": "Vận dụng thành ngữ 4 chữ 循序渐进 (tiến bộ từng bước / học tập bài bản) trong phương pháp luận học tập",
      "usageNotes": "\"循序渐进\" (Tuần tự tiệm tiến) là thành ngữ nòng cốt chỉ phương pháp học tập khoa học, không đốt cháy giai đoạn để chinh phục đỉnh cao học thuật.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "祝贺你以优异成绩圆满通过HSK五级高级学术考核！你的词汇掌握与论述逻辑展现出了极高的专业素养。",
          "pinyin": "Zhùhè nǐ yǐ yōuyì chéngjì yuánmǎn tōngguò HSK wǔjí gāojí xuéshù kǎohé! Nǐ de cíhuì zhǎngwò yǔ lùnshù luójí zhǎnxiàn chū le jígāo de zhuānyè sùyǎng.",
          "meaning": "Chúc mừng em đã vượt qua kỳ khảo hạch học thuật cao cấp HSK 5 với thành tích xuất sắc mỹ mãn! Năng lực nắm vững từ vựng và tư duy lập luận của em thể hiện tố chất chuyên môn rất cao."
        },
        {
          "speaker": "B",
          "hanzi": "十分感谢教授们的悉心指导！这一路走来，两千五百个词汇和复杂长难句的突破绝非一朝一夕之功。",
          "pinyin": "Shífēn gǎnxiè jiàoshòumen de xīxīn zhǐdǎo! Zhè yí lù zǒu lái, liǎngqiān wǔbǎi gè cíhuì hé fùzá chángnánjù de tūpò juéfēi yìzhāo-yīxī zhī gōng.",
          "meaning": "Em vô cùng cảm tạ sự chỉ dẫn tận tình của các thầy cô giáo sư! Chặng đường vừa qua, việc bứt phá 2500 từ vựng và các câu phức dài khó khăn tuyệt nhiên không phải công phu ngày một ngày hai."
        },
        {
          "speaker": "A",
          "hanzi": "学问之道贵在循序渐进，正是你日复一日地精读学术文献与辩证思考，才实现了听、说、读、写全方位的质变。",
          "pinyin": "Xuéwèn zhī dào guì zài xúnxù-jiànjìn, zhèng shì nǐ rì-fù-yírì de jīngdú xuéshù wénxiàn yǔ biànzhèng sīkǎo, cái shíxiàn le tīng, shuō, dú, xiě quánfāngwèi de zhìbiàn.",
          "meaning": "Đạo làm học vấn quý ở chỗ tiến bộ từng bước bài bản, chính nhờ việc ngày qua ngày em nghiền ngẫm đọc sâu tài liệu học thuật và tư duy biện chứng, mới tạo nên sự chuyển biến về chất toàn diện của 4 kỹ năng nghe, nói, đọc, viết."
        },
        {
          "speaker": "B",
          "hanzi": "在接下来的阶段，我将全力冲刺最高峰HSK六级，深入探究古代汉语典籍与国际商务仲裁前沿。",
          "pinyin": "Zài jiēxiàlái de jiēduàn, wǒ jiāng quánlì chōngcì zuìgāofēng HSK liùjí, shēnrù tànjiū gǔdài Hànyǔ diǎnjí yǔ guójì shāngwù zhòngcái qiányán.",
          "meaning": "Ở giai đoạn kế tiếp, em sẽ dốc toàn lực bứt tốc chinh phục đỉnh cao nhất HSK 6, đi sâu nghiên cứu các trước tác Hán ngữ cổ đại và lĩnh vực trọng tài thương mại quốc tế tiên phong."
        },
        {
          "speaker": "A",
          "hanzi": "志存高远，脚踏实地。相信只要你恪守这份笃学恒心，必将在更高阶的汉学殿堂与跨国舞台上大放异彩！",
          "pinyin": "Zhì cún gāoyuǎn, jiǎo tà shí dì. Xiāngxìn zhǐyào nǐ kèshǒu zhè fèn dǔxué héngxīn, bì jiāng zài gèng gāojiē de Hànxué diàntáng yǔ kuàguó wǔtái shang dàfàng-yìcǎi!",
          "meaning": "Chí hướng cao xa, bàn chân vững bước trên mặt đất. Thầy tin rằng chỉ cần em giữ vững tấm lòng kiên định hiếu học này, ắt sẽ tỏa sáng rực rỡ nơi điện đường Hán học bậc cao và vũ đài đa quốc gia!"
        }
      ],
      "audioText": "祝贺你以优异成绩圆满通过HSK五级高级学术考核！你的词汇掌握与论述逻辑展现出了极高的专业素养。十分感谢教授们的悉心指导！这一路走来，两千五百个词汇和复杂长难句的突破绝非一朝一夕之功。学问之道贵在循序渐进，正是你日复一日地精读学术文献与辩证思考，才实现了听、说、读、写全方位的质变。在接下来的阶段，我将全力冲刺最高峰HSK六级，深入探究古代汉语典籍与国际商务仲裁前沿。志存高远，脚踏实地。相信只要你恪守这份笃学恒心，必将在更高阶的汉学殿堂与跨国舞台上大放异彩！",
      "question": "Theo lời đúc kết của Giáo sư, đạo làm học vấn quý giá nhất ở nguyên tắc nào?",
      "options": [
        "Đốt cháy giai đoạn học vội vàng",
        "Tiến bộ từng bước bài bản, đọc sâu và tư duy biện chứng (贵在循序渐进，精读与辩证思考)",
        "Học vẹt thuộc lòng không cần hiểu",
        "Chỉ cần thi đỗ là ngừng học"
      ],
      "correctIndex": 1,
      "explanation": "Giáo sư khẳng định triết lý học thuật: \"学问之道贵在循序渐进，正是你日复一日地精读学术文献与辩证思考，才实现了全方位的质变\" (Đạo học vấn quý ở tiến bộ từng bước bài bản, đọc sâu và tư duy biện chứng)."
    },
    "step6_speaking": {
      "prompt": "Lời tuyên thệ vượt ải HSK 5:",
      "targetSentence": "我已全面攻克HSK 5级，向高阶殿堂迈进！",
      "targetPinyin": "Wǒ yǐ quánmiàn gōngkè HSK wǔ jí, xiàng gāojiē diàntáng màijìn!",
      "targetMeaning": "Tôi đã hoàn toàn chinh phục HSK 5, tự tin tiến bước lên nấc thang cao cấp!",
      "hint": "Khí phách ngút trời."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Học tập ngoại ngữ cần phải tiến bộ từng bước'",
      "words": [
        "必须",
        "学外语",
        "循序渐进"
      ],
      "correctOrder": [
        "学外语",
        "必须",
        "循序渐进"
      ],
      "explanation": "Chủ ngữ + 必须 + 循序渐进."
    },
    "step8_quiz": [
      {
        "id": "q-520-1",
        "type": "multiple-choice",
        "question": "Thành ngữ bốn chữ nào khuyên chúng ta học tập cần có trình tự từ dễ đến khó, không đốt cháy giai đoạn?",
        "options": [
          "循序渐进",
          "半途而废",
          "显而易见",
          "不见不散"
        ],
        "correctIndex": 0,
        "explanation": "循序渐进 (xúnxù-jiànjìn) là đi từng bước vững chắc."
      },
      {
        "id": "q-520-2",
        "type": "multiple-choice",
        "question": "Điền từ: '经过考前____训练，他的答题速度明显提升了。'",
        "options": [
          "冲刺",
          "所谓",
          "挂号",
          "退房"
        ],
        "correctIndex": 0,
        "explanation": "Luyện thi nước rút dùng 冲刺."
      }
    ],
    "step9_challenge": {
      "title": "Đại khảo hạch HSK 5",
      "taskDesc": "Hoàn thành toàn bộ thử thách HSK 5, nhận chứng nhận sẵn sàng bước vào HSK 6 cao cấp.",
      "targetPhrase": "xúnxù jiànjìn HSK wǔ jí",
      "xpReward": 60,
      "badge": "Bậc Thầy Cao Cấp HSK 5"
    }
  }
];

export default HSK_5_LESSONS;
