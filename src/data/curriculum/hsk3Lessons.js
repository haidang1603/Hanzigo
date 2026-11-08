/**
 * =========================================================================
 * HANZI GO - HSK 3 CURRICULUM LESSONS (20 LESSONS)
 * =========================================================================
 * Tách biệt theo cơ chế Granular Chunking nhằm tối ưu dung lượng tải ban đầu.
 * Đảm bảo 100% ID bài học, ID từ vựng, âm Hán Việt và quy trình 9 bước sư phạm.
 */

export const HSK_3_LESSONS = [
  {
    "id": "l-301",
    "chapterId": "ch-9",
    "levelId": "lvl-3",
    "lessonNumber": 1,
    "title": "Đặt phòng khách sạn & Làm thủ tục check-in (预订酒店)",
    "chineseTitle": "酒店入住与预订手续（押金、护照、房卡）",
    "subtitle": "Xử lý thủ tục khách sạn: Đặt phòng trước (预订), hộ chiếu (护照), tiền đặt cọc (押金), thẻ phòng (房卡).",
    "objective": "Tự tin check-in khách sạn, hỏi mật khẩu wifi và giải quyết các yêu cầu phòng nghỉ độc lập.",
    "prerequisite": "Đã hoàn thành Level 2.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đàm thoại check-in khách sạn trôi chảy.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Du lịch",
      "Khách sạn",
      "预订",
      "护照",
      "押金"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Hội thoại quầy lễ tân khách sạn: 办理入住 (Bànlǐ rùzhù)",
      "summary": "预订 (yùdìng) là đặt trước. 护照 (hùzhào) là hộ chiếu. 押金 (yājīn) là tiền đặt cọc. 房卡 (fángkǎ) là thẻ phòng. 退房 (tuìfáng) là trả phòng.",
      "audioDemoText": "nǐ hǎo, wǒ zài wǎngshang yùdìng le yí jiān fángjiān, zhè shì wǒ de hùzhào"
    },
    "step2_vocabulary": [
      {
        "id": "v-301-1",
        "hanzi": "预订",
        "pinyin": "yùdìng",
        "hanviet": "Dự đính",
        "meaning": "Đặt trước (phòng, vé)",
        "radical": "页 (Hiệt)",
        "example": {
          "hanzi": "预订两晚房间。",
          "pinyin": "Yùdìng liǎng wǎn fángjiān.",
          "meaning": "Đặt phòng 2 đêm."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-301-2",
        "hanzi": "护照",
        "pinyin": "hùzhào",
        "hanviet": "Hộ chiếu",
        "meaning": "Hộ chiếu",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "请出示您的护照。",
          "pinyin": "Qǐng chūshì nín de hùzhào.",
          "meaning": "Xin xuất trình hộ chiếu của quý khách."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-301-3",
        "hanzi": "押金",
        "pinyin": "yājīn",
        "hanviet": "Áp kim",
        "meaning": "Tiền đặt cọc",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "押金两百元。",
          "pinyin": "Yājīn liǎng bǎi yuán.",
          "meaning": "Tiền đặt cọc 200 tệ."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-301-4",
        "hanzi": "退房",
        "pinyin": "tuìfáng",
        "hanviet": "Thoái phòng",
        "meaning": "Trả phòng, check-out",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "明天中午退房。",
          "pinyin": "Míngtiān zhōngwǔ tuìfáng.",
          "meaning": "Trưa mai trả phòng."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-301-5",
        "hanzi": "单人房",
        "pinyin": "dānrénfáng",
        "hanviet": "Đơn nhân phòng",
        "meaning": "Phòng đơn",
        "radical": "十 (Thập)",
        "example": {
          "hanzi": "一间单人房。",
          "pinyin": "Yì jiān dānrénfáng.",
          "meaning": "Một phòng đơn."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-301-6",
        "hanzi": "网络",
        "pinyin": "wǎnglùo",
        "hanviet": "Võng lạc",
        "meaning": "Mạng internet, Wifi",
        "radical": "糸 (Mịch)",
        "example": {
          "hanzi": "房间有无线网络吗？",
          "pinyin": "Fángjiān yǒu wúxiàn wǎnglùo ma?",
          "meaning": "Phòng có wifi không?"
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "护",
        "hanzi": "护",
        "pinyin": "hù",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰扌户",
        "radical": {
          "char": "扌",
          "name": "Thủ",
          "strokes": 3
        },
        "meaning": "Bảo hộ, che chở",
        "strokesCount": 7,
        "strokeOrderText": "Ngang -> Sổ móc -> Hất (扌) -> Chấm -> Ngang gập -> Ngang -> Phẩy (户)",
        "components": [
          "扌",
          "户"
        ],
        "mnemonic": "Bàn tay (扌) che chở bảo vệ cho cánh cửa từng hộ gia đình (户)."
      },
      {
        "char": "照",
        "hanzi": "照",
        "pinyin": "zhào",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱昭灬",
        "radical": {
          "char": "灬",
          "name": "Hỏa",
          "strokes": 4
        },
        "meaning": "Chiếu sáng, chụp ảnh",
        "strokesCount": 13,
        "strokeOrderText": "Chữ Chiêu 昭 (9 nét) -> Bốn chấm hỏa 灬 (4 nét)",
        "components": [
          "昭",
          "灬"
        ],
        "mnemonic": "Ngọn lửa (灬) tỏa sáng rực rỡ (昭) chiếu rọi vạn vật."
      }
    ],
    "step4_grammar": {
      "title": "Mẫu câu thực hiện thủ tục: 办理 + Danh từ (办理入住 / 办理退房)",
      "formula": "我想办理 + 入住 (Check-in) / 退房 (Check-out) / 签证 (Visa)",
      "explanation": "Từ 办理 (bànlǐ - xử lý/làm thủ tục) là động từ trang trọng cốt lõi của trình độ HSK 3 trong mọi bối cảnh hành chính, sân bay, khách sạn.",
      "examples": [
        {
          "hanzi": "您好，我想办理入住手续，这是我的护照。",
          "pinyin": "Nín hǎo, wǒ xiǎng bànlǐ rùzhù shǒuxù, zhè shì wǒ de hùzhào.",
          "meaning": "Xin chào, tôi muốn làm thủ tục nhận phòng, đây là hộ chiếu của tôi."
        }
      ],
      "commonMistake": {
        "wrong": "我做住 ❌",
        "correct": "办理入住 ✔️",
        "explanation": "Dùng cụm thuật ngữ chuẩn 办理入住."
      }
    },
    "step5_listening": {
      "situation": "Làm thủ tục nhận phòng (Check-in) tại khách sạn quốc tế",
      "context": "Tại quầy lễ tân khách sạn 4 sao ở Thượng Hải",
      "participants": "A: Nhân viên lễ tân, B: Du khách Việt Nam (Anh Tuấn)",
      "targetGoal": "Thực hành các thủ tục khách sạn: 预订 (đặt trước), 护照 (hộ chiếu), 押金 (tiền đặt cọc), 房卡 (thẻ phòng)",
      "usageNotes": "Ở khách sạn Trung Quốc, tiền đặt cọc gọi là 押金 (yājīn), khi trả phòng (退房) lễ tân sẽ hoàn lại đầy đủ.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "您好，请问有什么可以帮您的？",
          "pinyin": "Nín hǎo, qǐngwèn yǒu shénme kěyǐ bāng nín de?",
          "meaning": "Xin chào quý khách, tôi có thể giúp gì cho bạn ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "你好，我在网上预订了一间单人房，这是我的护照。",
          "pinyin": "Nǐ hǎo, wǒ zài wǎngshang yùdìng le yì jiān dānrénfáng, zhè shì wǒ de hùzhào.",
          "meaning": "Chào bạn, tôi đã đặt trước một phòng đơn qua mạng, đây là hộ chiếu của tôi."
        },
        {
          "speaker": "A",
          "hanzi": "好的，查到了。请您先交三百块押金，退房时会退还给您。",
          "pinyin": "Hǎo de, chá dào le. Qǐng nín xiān jiāo sānbǎi kuài yājīn, tuìfáng shí huì tuìhuán gěi nín.",
          "meaning": "Dạ được, tôi tra thấy rồi. Xin quý khách nộp trước 300 tệ tiền cọc, khi trả phòng sẽ hoàn lại cho bạn."
        },
        {
          "speaker": "B",
          "hanzi": "没问题，请问房间里有免费的网络和Wifi吗？",
          "pinyin": "Méi wèntí, qǐngwèn fángjiān lǐ yǒu miǎnfèi de wǎnglùo hé Wifi ma?",
          "meaning": "Không vấn đề gì, xin hỏi trong phòng có mạng và Wifi miễn phí không?"
        },
        {
          "speaker": "A",
          "hanzi": "有的，房卡背面写着网络密码。电梯在右边，祝您入住愉快！",
          "pinyin": "Yǒu de, fángkǎ bèimiàn xiězhe wǎnglùo mìmǎ. Diàntī zài yòubiān, zhù nín rùzhù yúkuài!",
          "meaning": "Dạ có, mặt sau thẻ phòng có ghi mật khẩu mạng. Thang máy ở bên phải, chúc quý khách ở lại vui vẻ!"
        }
      ],
      "audioText": "您好，请问有什么可以帮您的？你好，我在网上预订了一间单人房，这是我的护照。好的，查到了。请您先交三百块押金，退房时会退还给您。没问题，请问房间里有免费的网络和Wifi吗？有的，房卡背面写着网络密码。电梯在右边，祝您入住愉快！",
      "question": "Khách hàng cần nộp bao nhiêu tiền đặt cọc khi làm thủ tục check-in?",
      "options": [
        "100 tệ",
        "200 tệ",
        "300 tệ (三百块押金)",
        "500 tệ"
      ],
      "correctIndex": 2,
      "explanation": "Lễ tân thông báo: \"请您先交三百块押金，退房时会退还给您\" (Xin nộp trước 300 tệ tiền cọc)."
    },
    "step6_speaking": {
      "prompt": "Đọc câu làm thủ tục nhận phòng:",
      "targetSentence": "你好，我想办理入住手续。",
      "targetPinyin": "Nǐ hǎo, wǒ xiǎng bànlǐ rùzhù shǒuxù.",
      "targetMeaning": "Xin chào, tôi muốn làm thủ tục nhận phòng.",
      "hint": "Đọc bànlǐ rùzhù shǒuxù dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Đây là hộ chiếu của tôi",
      "words": [
        "护照",
        "这是",
        "我的"
      ],
      "correctOrder": [
        "这是",
        "我的",
        "护照"
      ],
      "explanation": "这是 + 我的 + 护照."
    },
    "step8_quiz": [
      {
        "id": "q-301-1",
        "type": "multiple-choice",
        "question": "Từ mang nghĩa 'Hộ chiếu' trong tiếng Trung là:",
        "options": [
          "签证 (qiānzhèng)",
          "护照 (hùzhào)",
          "机票 (jīpiào)",
          "身份证 (shēnfènzhèng)"
        ],
        "correctIndex": 1,
        "explanation": "护照 (Hộ chiếu) là passport."
      },
      {
        "id": "q-301-2",
        "type": "multiple-choice",
        "question": "Khoản tiền đặt cọc tạm thời tại khách sạn gọi là:",
        "options": [
          "房费 (fángfèi)",
          "押金 (yājīn)",
          "现金 (xiànjīn)",
          "小费 (xiǎofèi)"
        ],
        "correctIndex": 1,
        "explanation": "押金 là tiền cọc bảo đảm."
      }
    ],
    "step9_challenge": {
      "title": "Check-in thành công",
      "taskDesc": "Đọc to màn đối thoại: Chào bạn, tôi đã đặt phòng trước, đây là hộ chiếu và tiền cọc.",
      "targetPhrase": "wǒ yùdìng le fángjiān zhè shì hùzhào hé yājīn",
      "xpReward": 50,
      "badge": "Khách Hàng VIP"
    }
  },
  {
    "id": "l-302",
    "chapterId": "ch-9",
    "levelId": "lvl-3",
    "lessonNumber": 2,
    "title": "Tại sân bay & Thủ tục hành lý (机场办理登机与行李托运)",
    "chineseTitle": "机场登机与行李手续（准时、起飞、迟到）",
    "subtitle": "Kỹ năng hàng không: Thẻ lên máy bay (登机牌), gửi hành lý (托运行李), cất cánh (起飞) và đúng giờ (准时).",
    "objective": "Tự xử lý thủ tục check-in tại sân bay, cân hành lý và tìm đúng cửa lên máy bay.",
    "prerequisite": "Đã hoàn thành Bài 301.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và hiểu thông báo tại sân bay.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Sân bay",
      "Hành lý",
      "起飞",
      "准时",
      "迟到"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Thủ tục hàng không: 登机 (Dēngjī - Lên máy bay) & 行李 (Xíngli - Hành lý)",
      "summary": "机场 (jīchǎng) là sân bay. 登机牌 (dēngjīpái) là thẻ lên máy bay. 行李 (xíngli) là hành lý. 起飞 (qǐfēi) là cất cánh. 准时 (zhǔnshí) là đúng giờ. 迟到 (chídào) là đến muộn.",
      "audioDemoText": "fēijī zhǔnshí qǐfēi, qǐng chūshì dēngjīpái hé hùzhào, zhè jiàn xíngli yào tuōyùn"
    },
    "step2_vocabulary": [
      {
        "id": "v-302-1",
        "hanzi": "机场",
        "pinyin": "jīchǎng",
        "hanviet": "Cơ trường",
        "meaning": "Sân bay",
        "radical": "木 (Mộc)",
        "example": {
          "hanzi": "去首都机场。",
          "pinyin": "Qù Shǒudū Jīchǎng.",
          "meaning": "Đi sân bay Thủ Đô."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-302-2",
        "hanzi": "行李",
        "pinyin": "xíngli",
        "hanviet": "Hành lý",
        "meaning": "Hành lý, vali",
        "radical": "行 (Hành)",
        "example": {
          "hanzi": "托运行李。",
          "pinyin": "Tuōyùn xíngli.",
          "meaning": "Ký gửi hành lý."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-302-3",
        "hanzi": "准时",
        "pinyin": "zhǔnshí",
        "hanviet": "Chuẩn thời",
        "meaning": "Đúng giờ",
        "radical": "冫 (Băng)",
        "example": {
          "hanzi": "飞机准时起飞。",
          "pinyin": "Fēijī zhǔnshí qǐfēi.",
          "meaning": "Máy bay cất cánh đúng giờ."
        },
        "pos": "Tính từ / Phó từ"
      },
      {
        "id": "v-302-4",
        "hanzi": "起飞",
        "pinyin": "qǐfēi",
        "hanviet": "Khởi phi",
        "meaning": "Cất cánh",
        "radical": "走 (Tẩu)",
        "example": {
          "hanzi": "飞机要起飞了。",
          "pinyin": "Fēijī yào qǐfēi le.",
          "meaning": "Máy bay sắp cất cánh rồi."
        },
        "pos": "Cụm động từ"
      },
      {
        "id": "v-302-5",
        "hanzi": "迟到",
        "pinyin": "chídào",
        "hanviet": "Trì đáo",
        "meaning": "Đến muộn, trễ giờ",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "不要迟到！",
          "pinyin": "Bú yào chídào!",
          "meaning": "Đừng đến muộn nhé!"
        },
        "pos": "Động từ"
      },
      {
        "id": "v-302-6",
        "hanzi": "登机牌",
        "pinyin": "dēngjīpái",
        "hanviet": "Đăng cơ bài",
        "meaning": "Thẻ lên máy bay",
        "radical": "癶 (Bát)",
        "example": {
          "hanzi": "这是您的登机牌。",
          "pinyin": "Zhè shì nín de dēngjīpái.",
          "meaning": "Đây là thẻ lên tàu bay của quý khách."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "准",
        "hanzi": "准",
        "pinyin": "zhǔn",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰冫隹",
        "radical": {
          "char": "冫",
          "name": "Băng",
          "strokes": 2
        },
        "meaning": "Chuẩn xác, cho phép",
        "strokesCount": 10,
        "strokeOrderText": "Chấm -> Hất (冫) -> Phẩy -> Sổ -> Chấm -> Ngang -> Ngang -> Sổ -> Ngang (隹)",
        "components": [
          "冫",
          "隹"
        ],
        "mnemonic": "Hai giọt băng lạnh (冫) cùng đàn chim (隹) giữ cự ly chuẩn xác tuyệt đối."
      },
      {
        "char": "飞",
        "hanzi": "飞",
        "pinyin": "fēi",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "飞",
        "radical": {
          "char": "飞",
          "name": "Phi",
          "strokes": 3
        },
        "meaning": "Bay lượn",
        "strokesCount": 3,
        "strokeOrderText": "Ngang gập cong móc -> Phẩy -> Chấm",
        "components": [
          "飞"
        ],
        "mnemonic": "Hình vẽ chú chim đang sải cánh bay lượn trên bầu trời."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc sắp diễn ra: 快要 / 就要...了 (Sắp...rồi)",
      "formula": "Chủ ngữ + 快要 / 就要 + Động từ + 了",
      "explanation": "Biểu thị một hành động sắp sửa xảy ra trong tương lai rất gần. Rất hay dùng trong thông báo sân bay.",
      "examples": [
        {
          "hanzi": "飞机快要起飞了，请大家系好安全带。",
          "pinyin": "Fēijī kuàiyào qǐfēi le, qǐng dàjiā jì hǎo ānquándài.",
          "meaning": "Máy bay sắp cất cánh rồi, xin mọi người thắt chặt dây an toàn."
        }
      ],
      "commonMistake": {
        "wrong": "飞机快起飞 ❌",
        "correct": "飞机快要起飞了 ✔️",
        "explanation": "快要 luôn đi cùng 了 ở cuối câu."
      }
    },
    "step5_listening": {
      "situation": "Làm thủ tục gửi hành lý và nhận thẻ lên máy bay tại sân bay",
      "context": "Tại quầy làm thủ tục hãng hàng không ở sân bay Bắc Kinh",
      "participants": "A: Nhân viên thủ tục sân bay, B: Hành khách",
      "targetGoal": "Nắm vững từ vựng sân bay: 机场 (sân bay), 行李 (hành lý), 登机牌 (thẻ lên tàu), 准时 (đúng giờ), 起飞 (cất cánh)",
      "usageNotes": "Thẻ lên máy bay là 登机牌 (dēngjīpái). Chú ý giờ máy bay cất cánh (起飞) thường sớm hơn giờ ghi trên vé.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "您好，请出示您的护照和机票。",
          "pinyin": "Nín hǎo, qǐng chūshì nín de hùzhào hé jīpiào.",
          "meaning": "Chào quý khách, xin vui lòng xuất trình hộ chiếu và vé máy bay."
        },
        {
          "speaker": "B",
          "hanzi": "给您。我有一件大行李需要托运，请问会超重吗？",
          "pinyin": "Gěi nín. Wǒ yǒu yí jiàn dà xíngli xūyào tuōyùn, qǐngwèn huì chāozhòng ma?",
          "meaning": "Gửi bạn. Tôi có một kiện hành lý lớn cần ký gửi, xin hỏi có bị quá cân không?"
        },
        {
          "speaker": "A",
          "hanzi": "刚好二十公斤，没有超重。请问航班会准时起飞吗？",
          "pinyin": "Gānghǎo èrshí gōngjīn, méiyǒu chāozhòng. Hángbān zhǔnshí qǐfēi.",
          "meaning": "Vừa đúng 20 kg, không quá cân. Chuyến bay sẽ cất cánh đúng giờ."
        },
        {
          "speaker": "B",
          "hanzi": "太好了，我真担心天气不好会迟到。",
          "pinyin": "Tài hǎo le, wǒ zhēn dānxīn tiānqì bù hǎo huì chídào.",
          "meaning": "Tốt quá, tôi cứ lo thời tiết xấu sẽ bị trễ giờ."
        },
        {
          "speaker": "A",
          "hanzi": "这是您的登机牌，请在十二号登机口准时登机。",
          "pinyin": "Zhè shì nín de dēngjīpái, qǐng zài shí’èr hào dēngjīkǒu zhǔnshí dēngjī.",
          "meaning": "Đây là thẻ lên máy bay của bạn, xin hãy lên máy bay đúng giờ tại cửa số 12."
        }
      ],
      "audioText": "您好，请出示您的护照和机票。给您。我有一件大行李需要托运，请问会超重吗？刚好二十公斤，没有超重。航班准时起飞。太好了，我真担心天气不好会迟到。这是您的登机牌，请在十二号登机口准时登机。",
      "question": "Hành khách lên máy bay tại cửa số mấy?",
      "options": [
        "Cửa số 2",
        "Cửa số 10",
        "Cửa số 12 (十二号登机口)",
        "Cửa số 20"
      ],
      "correctIndex": 2,
      "explanation": "Nhân viên dặn dò: \"请在十二号登机口准时登机\" (Xin hãy lên máy bay tại cửa số 12 đúng giờ)."
    },
    "step6_speaking": {
      "prompt": "Nói chuyến bay cất cánh đúng giờ:",
      "targetSentence": "飞机准时起飞。",
      "targetPinyin": "Fēijī zhǔnshí qǐfēi.",
      "targetMeaning": "Máy bay cất cánh đúng giờ.",
      "hint": "Đọc zhǔnshí qǐfēi dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Máy bay sắp cất cánh rồi",
      "words": [
        "快要起飞了",
        "飞机"
      ],
      "correctOrder": [
        "飞机",
        "快要起飞了"
      ],
      "explanation": "飞机 + 快要起飞了."
    },
    "step8_quiz": [
      {
        "id": "q-302-1",
        "type": "multiple-choice",
        "question": "Từ nào sau đây mang nghĩa là 'Thẻ lên máy bay'?",
        "options": [
          "护照 (hùzhào)",
          "登机牌 (dēngjīpái)",
          "门票 (ménpiào)",
          "车票 (chēpiào)"
        ],
        "correctIndex": 1,
        "explanation": "登机牌 là Boarding pass."
      },
      {
        "id": "q-302-2",
        "type": "multiple-choice",
        "question": "Cụm '准时' (zhǔnshí) mang nghĩa là:",
        "options": [
          "Đúng giờ",
          "Chậm trễ",
          "Hủy bỏ",
          "Đặt trước"
        ],
        "correctIndex": 0,
        "explanation": "Chuẩn thời nghĩa là đúng giờ."
      }
    ],
    "step9_challenge": {
      "title": "Làm chủ cổng sân bay",
      "taskDesc": "Đọc to câu: 'Chuyến bay của tôi cất cánh đúng giờ, tôi không bị trễ'.",
      "targetPhrase": "wǒ de fēijī zhǔnshí qǐfēi wǒ méi chídào",
      "xpReward": 50,
      "badge": "Phi Công Vũ Trụ"
    }
  },
  {
    "id": "l-303",
    "chapterId": "ch-9",
    "levelId": "lvl-3",
    "lessonNumber": 3,
    "title": "Bổ ngữ Xu hướng Đơn với 来 và 去 (进来, 出去, 上来, 下去)",
    "chineseTitle": "简单趋向补语“来/去”（进来、出去、上来、下去）",
    "subtitle": "Quy tắc phương hướng kinh điển: Hướng về phía người nói dùng 来, rời xa người nói dùng 去.",
    "objective": "Sử dụng chính xác bổ ngữ xu hướng đơn 来 và 去 kết hợp 7 động từ chuyển động cơ bản.",
    "prerequisite": "Đã hoàn thành Bài 302.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cặp 来/去 theo điểm đứng của người nói.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Bổ ngữ xu hướng đơn",
      "来",
      "去",
      "Ngữ pháp cốt lõi"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "7 Động từ chuyển động + 来 (Lại - về phía mình) / 去 (Khứ - ra xa mình)",
      "summary": "7 Động từ: 进 (vào), 出 (ra), 上 (lên), 下 (xuống), 回 (về), 过 (qua), 起 (dậy). Người nói ở trong phòng: Gọi người khác vào -> 进来; Người nói ở ngoài phòng: Bảo người khác vào trong -> 进去.",
      "audioDemoText": "qǐng jìnlái, tā zǒu chūqu le, nǐ shénme shíhou huílái"
    },
    "step2_vocabulary": [
      {
        "id": "v-303-1",
        "hanzi": "进来",
        "pinyin": "jìnlái",
        "hanviet": "Tiến lai",
        "meaning": "Vào đây (hướng về phía người nói)",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "请进来坐！",
          "pinyin": "Qǐng jìnlái zuò!",
          "meaning": "Mời vào đây ngồi!"
        },
        "pos": "Động từ xu hướng"
      },
      {
        "id": "v-303-2",
        "hanzi": "出去",
        "pinyin": "chūqù",
        "hanviet": "Xuất khứ",
        "meaning": "Ra ngoài (xa người nói)",
        "radical": "出 (Xuất)",
        "example": {
          "hanzi": "他出去了。",
          "pinyin": "Tā chūqù le.",
          "meaning": "Anh ấy ra ngoài rồi."
        },
        "pos": "Động từ xu hướng"
      },
      {
        "id": "v-303-3",
        "hanzi": "上来",
        "pinyin": "shànglái",
        "hanviet": "Thượng lai",
        "meaning": "Lên đây",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "快上来！",
          "pinyin": "Kuài shànglái!",
          "meaning": "Mau lên đây!"
        },
        "pos": "Động từ xu hướng"
      },
      {
        "id": "v-303-4",
        "hanzi": "下去",
        "pinyin": "xiàqù",
        "hanviet": "Hạ khứ",
        "meaning": "Xuống dưới kia",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "走下去。",
          "pinyin": "Zǒu xiàqù.",
          "meaning": "Đi bộ xuống dưới kia."
        },
        "pos": "Động từ xu hướng"
      },
      {
        "id": "v-303-5",
        "hanzi": "回来",
        "pinyin": "huílái",
        "hanviet": "Hồi lai",
        "meaning": "Trở về đây",
        "radical": "囗 (Vi)",
        "example": {
          "hanzi": "爸爸回来了。",
          "pinyin": "Bàba huílái le.",
          "meaning": "Bố đã về rồi."
        },
        "pos": "Động từ xu hướng"
      },
      {
        "id": "v-303-6",
        "hanzi": "过去",
        "pinyin": "guòqù",
        "hanviet": "Quá khứ",
        "meaning": "Đi qua đằng kia, quá khứ",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "走过去看看。",
          "pinyin": "Zǒu guòqù kànkan.",
          "meaning": "Đi qua bên kia xem thử."
        },
        "pos": "Động từ xu hướng / Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "进",
        "hanzi": "进",
        "pinyin": "jìn",
        "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿺"
        },
        "ids": "⿺辶井",
        "radical": {
          "char": "辶",
          "name": "Sước",
          "strokes": 3
        },
        "meaning": "Tiến lên, bước vào",
        "strokesCount": 7,
        "strokeOrderText": "Ngang -> Ngang -> Phẩy -> Sổ (井) -> Chấm -> Ngang gập cong -> Mác dài (辶)",
        "components": [
          "辶",
          "井"
        ],
        "mnemonic": "Bước chân (辶) tiến bước lại gần miệng giếng nước (井)."
      },
      {
        "char": "出",
        "hanzi": "出",
        "pinyin": "chū",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "出",
        "radical": {
          "char": "凵",
          "name": "Khảm",
          "strokes": 2
        },
        "meaning": "Đi ra, xuất phát",
        "strokesCount": 5,
        "strokeOrderText": "Sổ -> Ngang gập -> Sổ -> Sổ xuyên giữa -> Ngang gập -> Sổ",
        "components": [
          "出"
        ],
        "mnemonic": "Hai ngọn núi (山) xếp chồng lên nhau vươn cao mọc ra ngoài."
      }
    ],
    "step4_grammar": {
      "title": "Vị trí của Tân ngữ nơi chốn trong Bổ ngữ Xu hướng",
      "formula": "Động từ + NƠI CHỐN + 来 / 去 (Ví dụ: 回家来, 进教室去)",
      "explanation": "Quy tắc bắt buộc: Nếu tân ngữ là ĐỊA ĐIỂM NƠI CHỐN, nó BẮT BUỘC phải chen vào giữa động từ và 来/去. Tuyệt đối không được nói: 回来家 ❌.",
      "examples": [
        {
          "hanzi": "他已经进教室去了。（ĐÚNG）  /  他已经进去教室了。（SAI ❌）",
          "pinyin": "Tā yǐjīng jìn jiàoshì qù le.",
          "meaning": "Anh ấy đã bước vào trong lớp học rồi."
        }
      ],
      "commonMistake": {
        "wrong": "回学校去 ➔ nói thành 回去学校 ❌",
        "correct": "回学校去 ✔️",
        "explanation": "Địa điểm nơi chốn phải nằm kẹp ở giữa."
      }
    },
    "step5_listening": {
      "situation": "Hướng chuyển động trong sinh hoạt với Bổ ngữ xu hướng đơn 来/去",
      "context": "Cuộc trò chuyện giữa hai người bạn dưới lầu và trên lầu ký túc xá",
      "participants": "A: Tiểu Lệ (ở dưới sân), B: Minh (ở trên tầng 3)",
      "targetGoal": "Thành thạo quy tắc xác định 来 (hướng về phía người nói) và 去 (rời xa người nói): 进来, 出去, 上来, 下去",
      "usageNotes": "Quy tắc vàng: Nếu hành động hướng về phía người nói -> dùng 来; nếu hành động rời xa người nói -> dùng 去.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "小明，你在楼上吗？快下来吧，我们在楼下等你呢！",
          "pinyin": "Xiǎomíng, nǐ zài lóushàng ma? Kuài xiàlai ba, wǒmen zài lóuxià děng nǐ ne!",
          "meaning": "Tiểu Minh, bạn ở trên lầu à? Mau xuống đây đi, tụi mình đang đợi bạn dưới lầu nè!"
        },
        {
          "speaker": "B",
          "hanzi": "我正在整理行李呢，你上来帮我拿一下箱子，好吗？",
          "pinyin": "Wǒ zhèngzài zhěnglǐ xíngli ne, nǐ shànglai bāng wǒ ná yíxià xiāngzi, hǎo ma?",
          "meaning": "Mình đang thu dọn hành lý, bạn lên đây giúp mình bê chiếc vali một lát được không?"
        },
        {
          "speaker": "A",
          "hanzi": "外面风太大了，好，我马上走上去。",
          "pinyin": "Wàimiàn fēng tài dà le, hǎo, wǒ mǎshàng zǒu shàngqu.",
          "meaning": "Bên ngoài gió to quá, được rồi, mình đi lên ngay đây."
        },
        {
          "speaker": "B",
          "hanzi": "门开着呢，你直接推门走进来吧。",
          "pinyin": "Mén kāizhe ne, nǐ zhíjiē tuī mén zǒu jìnlái ba.",
          "meaning": "Cửa đang mở đấy, bạn cứ trực tiếp đẩy cửa bước vào đây nhé."
        }
      ],
      "audioText": "小明，你在楼上吗？快下来吧，我们在楼下等你呢！我正在整理行李呢，你上来帮我拿一下箱子，好吗？外面风太大了，好，我马上走上去。门开着呢，你直接推门走进来吧。",
      "question": "Vì sao Tiểu Minh nhờ bạn đi lên lầu?",
      "options": [
        "Lên ăn cơm trưa",
        "Lên giúp bê đỡ chiếc vali hành lý (帮我拿一下箱子)",
        "Lên mượn sách",
        "Lên xem phim"
      ],
      "correctIndex": 1,
      "explanation": "Tiểu Minh nói: \"你上来帮我拿一下箱子，好吗？\" (Bạn lên giúp mình bê chiếc vali một chút được không?)."
    },
    "step6_speaking": {
      "prompt": "Mời ai đó bước vào phòng:",
      "targetSentence": "请进，快请进来！",
      "targetPinyin": "Qǐng jìn, kuài qǐng jìnlái!",
      "targetMeaning": "Mời vào, mau vào đây đi!",
      "hint": "Đọc jìnlái thanh 4 và thanh nhẹ."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Anh ấy đã về nhà rồi",
      "words": [
        "回家去了",
        "他已经"
      ],
      "correctOrder": [
        "他已经",
        "回家去了"
      ],
      "explanation": "他已经 + 回家去了."
    },
    "step8_quiz": [
      {
        "id": "q-303-1",
        "type": "multiple-choice",
        "question": "Chọn câu đúng ngữ pháp có tân ngữ nơi chốn:",
        "options": [
          "他进去了教室",
          "他进教室去了",
          "教室进他去",
          "他去进教室"
        ],
        "correctIndex": 1,
        "explanation": "Nơi chốn bắt buộc nằm kẹp ở giữa: 进教室去."
      },
      {
        "id": "q-303-2",
        "type": "multiple-choice",
        "question": "Nếu bạn đang ở trong nhà và gọi bạn bè ngoài sân vào, bạn sẽ nói:",
        "options": [
          "你出去吧",
          "你进来吧",
          "你上去吧",
          "你下去吧"
        ],
        "correctIndex": 1,
        "explanation": "Vào về phía mình đang đứng trong nhà dùng 进来."
      }
    ],
    "step9_challenge": {
      "title": "Điều hướng không gian",
      "taskDesc": "Đọc to câu: 'Xin mời bước vào đây ngồi, bố tôi đã về nhà rồi'.",
      "targetPhrase": "qǐng jìnlái zuò wǒ bàba huí jiā lái le",
      "xpReward": 50,
      "badge": "La Bàn Đa Chiều"
    }
  },
  {
    "id": "l-304",
    "chapterId": "ch-9",
    "levelId": "lvl-3",
    "lessonNumber": 4,
    "title": "Bổ ngữ Xu hướng Kép (跑出来, 走过去, 拿出来)",
    "chineseTitle": "复合趋向补语（动词 + 上/下/进/出/回/过/起 + 来/去）",
    "subtitle": "Diễn đạt chuyển động phức tạp tinh tế: V + Bổ ngữ xu hướng kép (跑出来 - chạy vụt ra, 拿出来 - lấy đồ ra).",
    "objective": "Nắm vững cấu trúc Bổ ngữ xu hướng kép và miêu tả sinh động mọi chuyển động trong đời sống.",
    "prerequisite": "Đã hoàn thành Bài 303.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng bổ ngữ xu hướng kép.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Bổ ngữ xu hướng kép",
      "跑出来",
      "拿出来",
      "Ngữ pháp nâng cao"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Công thức Bổ ngữ Xu hướng Kép: Động từ + (上/下/进/出/回/过/起) + (来/去)",
      "summary": "Kết hợp động từ hành động cụ thể với hướng di chuyển: 跑出来 (Chạy lao ra ngoài), 走过去 (Đi bước sang bên kia), 拿出来 (Lấy lôi từ trong túi ra ngoài).",
      "audioDemoText": "tā cóng fángjiān pǎo chūlái le, qǐng bǎ hùzhào ná chūlái"
    },
    "step2_vocabulary": [
      {
        "id": "v-304-1",
        "hanzi": "跑",
        "pinyin": "pǎo",
        "hanviet": "Bào",
        "meaning": "Chạy",
        "radical": "足 (Túc)",
        "example": {
          "hanzi": "跑得很快。",
          "pinyin": "Pǎo de hěn kuài.",
          "meaning": "Chạy rất nhanh."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-304-2",
        "hanzi": "跑出来",
        "pinyin": "pǎo chūlái",
        "hanviet": "Bào xuất lai",
        "meaning": "Chạy vọt ra ngoài này",
        "radical": "足 (Túc)",
        "example": {
          "hanzi": "小狗跑出来了。",
          "pinyin": "Xiǎogǒu pǎo chūlái le.",
          "meaning": "Chú chó con chạy vọt ra ngoài rồi."
        },
        "pos": "Cụm bổ ngữ xu hướng"
      },
      {
        "id": "v-304-3",
        "hanzi": "拿出来",
        "pinyin": "ná chūlái",
        "hanviet": "Nã xuất lai",
        "meaning": "Lấy ra, rút ra",
        "radical": "手 (Thủ)",
        "example": {
          "hanzi": "把护照拿出来。",
          "pinyin": "Bǎ hùzhào ná chūlái.",
          "meaning": "Lấy cuốn hộ chiếu ra."
        },
        "pos": "Cụm bổ ngữ xu hướng"
      },
      {
        "id": "v-304-4",
        "hanzi": "站起来",
        "pinyin": "zhàn qǐlái",
        "hanviet": "Trạm khởi lai",
        "meaning": "Đứng dậy",
        "radical": "立 (Lập)",
        "example": {
          "hanzi": "请大家站起来。",
          "pinyin": "Qǐng dàjiā zhàn qǐlái.",
          "meaning": "Mời mọi người đứng dậy."
        },
        "pos": "Cụm bổ ngữ xu hướng"
      },
      {
        "id": "v-304-5",
        "hanzi": "带回去",
        "pinyin": "dài huíqù",
        "hanviet": "Đái hồi khứ",
        "meaning": "Mang về lại bên đó",
        "radical": "巾 (Cân)",
        "example": {
          "hanzi": "把礼物带回去。",
          "pinyin": "Bǎ lǐwù dài huíqù.",
          "meaning": "Mang món quà về lại."
        },
        "pos": "Cụm bổ ngữ xu hướng"
      }
    ],
    "step3_hanzi": [
      {
        "char": "跑",
        "hanzi": "跑",
        "pinyin": "pǎo",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰𧾷包",
        "radical": {
          "char": "足",
          "name": "Túc",
          "strokes": 7
        },
        "meaning": "Chạy nhanh",
        "strokesCount": 12,
        "strokeOrderText": "Bộ Túc 𧾷 (7 nét) -> Chữ Bao 包 (5 nét)",
        "components": [
          "𧾷",
          "包"
        ],
        "mnemonic": "Đôi chân (𧾷) guồng bước gói trọn (包) khoảng cách khi chạy nhanh."
      },
      {
        "char": "带",
        "hanzi": "带",
        "pinyin": "dài",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿳丱冖巾",
        "radical": {
          "char": "巾",
          "name": "Cân",
          "strokes": 3
        },
        "meaning": "Mang theo, dây thắt",
        "strokesCount": 9,
        "strokeOrderText": "Ngang -> Sổ -> Sổ -> Phẩy -> Sổ (丱) -> Mịch 冖 -> Bộ Cân 巾 (3 nét)",
        "components": [
          "丱",
          "冖",
          "巾"
        ],
        "mnemonic": "Dải khăn (巾) quấn quanh eo mang theo đồ đạc bên mình."
      }
    ],
    "step4_grammar": {
      "title": "Vị trí của Tân ngữ chỉ sự vật trong Bổ ngữ Xu hướng Kép",
      "formula": "Động từ + (Xu hướng 1) + TÂN NGỮ ĐỒ VẬT + 来/去  HOẶC  Động từ + Xu hướng kép + Tân ngữ",
      "explanation": "Ví dụ: 拿出护照来 HOẶC 拿出来护照 (Cả hai cách đều đúng khi tân ngữ là đồ vật thông thường).",
      "examples": [
        {
          "hanzi": "安检的时候，请把电脑从包里拿出来。",
          "pinyin": "Ānjiǎn de shíhou, qǐng bǎ diànnǎo cóng bāo lǐ ná chūlái.",
          "meaning": "Khi kiểm tra an ninh, xin hãy lấy máy tính từ trong túi xách ra."
        }
      ],
      "commonMistake": {
        "wrong": "站起去 ❌",
        "correct": "站起来 ✔️",
        "explanation": "Chuyển động từ thấp lên cao luôn đi với 起来 (Khởi lai)."
      }
    },
    "step5_listening": {
      "situation": "Mô tả hành động phức tạp với Bổ ngữ xu hướng kép (V + 上/下/出/进 + 来/去)",
      "context": "Tại thư viện trường đại học khi bất ngờ có cơn mưa rào",
      "participants": "A: Thủ thư thư viện, B: Sinh viên vào tránh mưa",
      "targetGoal": "Thành thạo cấu trúc bổ ngữ xu hướng kép: 跑出来, 拿出来, 走过去, 站起来",
      "usageNotes": "Cấu trúc: Động từ + Xu hướng 1 (上/下/进/出/回/过/起) + Xu hướng 2 (来/去). Ví dụ: 跑进来 (chạy vào đây).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "外边下大雨了，同学们都从操场跑进来了。",
          "pinyin": "Wàibiān xià dàyǔ le, tóngxuémen dōu cóng cāochǎng pǎo jìnlái le.",
          "meaning": "Bên ngoài mưa to rồi, các bạn học sinh đều từ sân vận động chạy ào vào trong này rồi."
        },
        {
          "speaker": "B",
          "hanzi": "老师好！我的书包有点儿湿，我先把课本拿出来。",
          "pinyin": "Lǎoshī hǎo! Wǒ de shūbāo yǒudiǎnr shī, wǒ xiān bǎ kèběn ná chūlái.",
          "meaning": "Em chào thầy ạ! Ba lô của em hơi ướt, em lấy sách giáo khoa ra trước đã."
        },
        {
          "speaker": "A",
          "hanzi": "快到那边坐下吧，把湿衣服脱下来晾一晾。",
          "pinyin": "Kuài dào nàbiān zuò xià ba, bǎ shī yīfu tuō xiàlái liàng yí liàng.",
          "meaning": "Mau lại đằng kia ngồi xuống đi, cởi áo ướt ra hong khô một lát."
        },
        {
          "speaker": "B",
          "hanzi": "谢谢老师！等雨停了，我就把借的书带回去。",
          "pinyin": "Xièxie lǎoshī! Děng yǔ tíng le, wǒ jiù bǎ jiè de shū dài huíqù.",
          "meaning": "Em cảm ơn thầy! Đợi tạnh mưa, em sẽ mang sách đã mượn về lại ký túc xá."
        }
      ],
      "audioText": "外边下大雨了，同学们都从操场跑进来了。老师好！我的书包有点儿湿，我先把课本拿出来。快到那边坐下吧，把湿衣服脱下来晾一晾。谢谢老师！等雨停了，我就把借的书带回去。",
      "question": "Học sinh dự định làm gì sau khi cơn mưa tạnh?",
      "options": [
        "Ở lại thư viện ngủ",
        "Mang sách đã mượn về ký túc xá (把借的书带回去)",
        "Đi đá bóng tiếp",
        "Đi mua ô che mưa"
      ],
      "correctIndex": 1,
      "explanation": "Học sinh nói: \"等雨停了，我就把借的书带回去\" (Đợi mưa tạnh em sẽ mang sách mượn về)."
    },
    "step6_speaking": {
      "prompt": "Đọc câu hướng dẫn đứng dậy:",
      "targetSentence": "请大家站起来。",
      "targetPinyin": "Qǐng dàjiā zhàn qǐlái.",
      "targetMeaning": "Mời mọi người đứng dậy.",
      "hint": "Đọc zhàn qǐlái dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Lấy hộ chiếu ra",
      "words": [
        "拿出来",
        "把护照"
      ],
      "correctOrder": [
        "把护照",
        "拿出来"
      ],
      "explanation": "把护照 + 拿出来."
    },
    "step8_quiz": [
      {
        "id": "q-304-1",
        "type": "multiple-choice",
        "question": "Hành động 'Đứng dậy' trong tiếng Trung nói là:",
        "options": [
          "站下去",
          "站出来",
          "站起来 (zhàn qǐlái)",
          "站过去"
        ],
        "correctIndex": 2,
        "explanation": "Hướng từ dưới lên dùng 起来: 站起来."
      },
      {
        "id": "q-304-2",
        "type": "multiple-choice",
        "question": "Từ '拿出来' (ná chūlái) có nghĩa là gì?",
        "options": [
          "Cất vào trong",
          "Lấy ra / Lôi ra ngoài này",
          "Vứt đi",
          "Mua về"
        ],
        "correctIndex": 1,
        "explanation": "拿出来 là lấy ra ngoài."
      }
    ],
    "step9_challenge": {
      "title": "Khẩu lệnh chuẩn xác",
      "taskDesc": "Đọc to câu: 'Khi qua an ninh, xin hãy lấy hộ chiếu và máy tính ra'.",
      "targetPhrase": "qǐng bǎ hùzhào hé diànnǎo ná chūlái",
      "xpReward": 50,
      "badge": "Bậc Thầy Chuyển Động"
    }
  },
  {
    "id": "l-305",
    "chapterId": "ch-9",
    "levelId": "lvl-3",
    "lessonNumber": 5,
    "title": "Ôn tập Module 3.1 & Xử lý tình huống du lịch tự túc",
    "chineseTitle": "模块3.1总复习与自由行独立沟通挑战",
    "subtitle": "Tổng kết đàm thoại du lịch độc lập: Check-in, sân bay, chỉ hướng bổ ngữ xu hướng và đấu Boss Chapter 9.",
    "objective": "Tự tin xử lý 100% tình huống du lịch tự túc tại Trung Quốc không cần người phiên dịch đi kèm.",
    "prerequisite": "Đã hoàn thành Bài 301–304.",
    "completionCriteria": "Đạt >= 80% điểm bài tập tổng kết Module 3.1.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 3",
      "Tổng kết Module",
      "Du lịch tự túc",
      "Review Checkpoint"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Bộ cẩm nang sinh tồn du lịch tự túc 3 ngày tại Trung Quốc",
      "summary": "1. Sân bay: 办理登机, 托运行李, 准时起飞. 2. Khách sạn: 办理入住, 交押金, 拿房卡. 3. Không gian: 进教室去, 拿出来, 站起来.",
      "audioDemoText": "zìyóuxíng hěn fāngbiàn, wǒ néng dúlì jiějué wèntí"
    },
    "step2_vocabulary": [
      {
        "id": "v-305-1",
        "hanzi": "自由行",
        "pinyin": "zìyóuxíng",
        "hanviet": "Tự do hành",
        "meaning": "Du lịch tự túc",
        "radical": "自 (Tự)",
        "example": {
          "hanzi": "我喜欢自由行。",
          "pinyin": "Wǒ xǐhuan zìyóuxíng.",
          "meaning": "Tôi thích du lịch tự túc."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-305-2",
        "hanzi": "独立",
        "pinyin": "dúlì",
        "hanviet": "Độc lập",
        "meaning": "Độc lập, tự chủ",
        "radical": "犭 (Khuyển)",
        "example": {
          "hanzi": "独立生活。",
          "pinyin": "Dúlì shēnghuó.",
          "meaning": "Cuộc sống độc lập."
        },
        "pos": "Tính từ / Động từ"
      },
      {
        "id": "v-305-3",
        "hanzi": "解决",
        "pinyin": "jiějué",
        "hanviet": "Giải quyết",
        "meaning": "Giải quyết",
        "radical": "角 (Giác)",
        "example": {
          "hanzi": "解决问题。",
          "pinyin": "Jiějué wèntí.",
          "meaning": "Giải quyết vấn đề."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "独",
        "hanzi": "独",
        "pinyin": "dú",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰犭虫",
        "radical": {
          "char": "犭",
          "name": "Khuyển",
          "strokes": 3
        },
        "meaning": "Độc lập, đơn độc",
        "strokesCount": 9,
        "strokeOrderText": "Phẩy cong -> Cong móc -> Phẩy (犭) -> Sổ -> Ngang gập -> Ngang -> Sổ -> Hất -> Chấm (虫)",
        "components": [
          "犭",
          "虫"
        ],
        "mnemonic": "Loài thú hoang (犭) và loài sâu bọ (虫) thường sống tự lập, đơn độc."
      },
      {
        "char": "解",
        "hanzi": "解",
        "pinyin": "jiě",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰角𧢲",
        "radical": {
          "char": "角",
          "name": "Giác",
          "strokes": 7
        },
        "meaning": "Tháo gỡ, giải quyết",
        "strokesCount": 13,
        "strokeOrderText": "Bộ Giác 角 (7 nét) -> Bộ Đao 刀 (2 nét) -> Chữ Ngưu 牛 (4 nét)",
        "components": [
          "角",
          "刀",
          "牛"
        ],
        "mnemonic": "Dùng con dao (刀) tháo gỡ cặp sừng (角) của chú bò (牛), nghĩa là giải quyết triệt để."
      }
    ],
    "step4_grammar": {
      "title": "Mẫu câu tự tin giải quyết vấn đề của học viên HSK 3",
      "formula": "没问题，我自己可以解决！ (Méi wèntí, wǒ zìjǐ kěyǐ jiějué!)",
      "explanation": "Khẳng định bước chuyển mình từ người học thụ động sang người sử dụng tiếng Trung độc lập trong mọi hoàn cảnh.",
      "examples": [
        {
          "hanzi": "虽然这是我第一次来中国，但是这些问题我都能独立解决。",
          "pinyin": "Suīrán zhè shì wǒ dì yī cì lái Zhōngguó, dànshì zhèxiē wèntí wǒ dōu néng dúlì jiějué.",
          "meaning": "Mặc dù đây là lần đầu tiên tôi đến Trung Quốc, nhưng những vấn đề này tôi đều có thể tự mình giải quyết."
        }
      ],
      "commonMistake": {
        "wrong": "Nói ngập ngừng thiếu tự tin.",
        "correct": "Sử dụng câu ngắn dứt khoát kết hợp bổ ngữ xu hướng.",
        "explanation": "Khí chất của người giao tiếp độc lập."
      }
    },
    "step5_listening": {
      "situation": "Trải nghiệm du lịch tự túc và khả năng tự lập giải quyết vấn đề",
      "context": "Chia sẻ kinh nghiệm du lịch tại buổi hội thảo sinh viên",
      "participants": "A: Bạn hỏi, B: Bạn vừa đi du lịch tự túc về",
      "targetGoal": "Vận dụng từ vựng trung cấp: 自由行 (du lịch tự túc), 独立 (độc lập), 解决 (giải quyết)",
      "usageNotes": "自由行 là xu hướng du lịch độc lập không qua tour, rèn luyện tính tự chủ (独立解决问题).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "听说你上个月一个人去云南自由行了，感觉怎么样？",
          "pinyin": "Tīngshuō nǐ shàng gè yuè yí gè rén qù Yúnnán zìyóuxíng le, gǎnjué zěnme yàng?",
          "meaning": "Nghe nói tháng trước bạn tự đi du lịch Vân Nam tự túc một mình, cảm giác thế nào?"
        },
        {
          "speaker": "B",
          "hanzi": "非常棒！虽然一路上遇到不少困难，但我都能独立解决。",
          "pinyin": "Fēicháng bàng! Suīrán yílùshang yù dào bù shǎo kùnnan, dàn wǒ dōu néng dúlì jiějué.",
          "meaning": "Cực kỳ tuyệt vời! Mặc dù trên đường gặp không ít khó khăn, nhưng mình đều tự lập giải quyết được."
        },
        {
          "speaker": "A",
          "hanzi": "一个人订酒店、问路和坐车，不害怕吗？",
          "pinyin": "Yí gè rén dìng jiǔdiàn, wènlù hé zuòchē, bù hàipà ma?",
          "meaning": "Một mình tự đặt phòng, hỏi đường và đi xe, không sợ sao?"
        },
        {
          "speaker": "B",
          "hanzi": "只要敢开口说汉语，当地人都会热情地帮助你。",
          "pinyin": "Zhǐyào gǎn kāikǒu shuō Hànyǔ, dāngdì rén dōu huì rèqíng de bāngzhù nǐ.",
          "meaning": "Chỉ cần dám mở miệng nói tiếng Trung, người dân địa phương đều sẽ nhiệt tình giúp đỡ bạn."
        }
      ],
      "audioText": "听说你上个月一个人去云南自由行了，感觉怎么样？非常棒！虽然一路上遇到不少困难，但我都能独立解决。一个人订酒店、问路和坐车，不害怕吗？只要敢开口说汉语，当地人都会热情地帮助你。",
      "question": "Kinh nghiệm quan trọng nhất mà bạn B rút ra khi đi du lịch tự túc một mình là gì?",
      "options": [
        "Phải mang thật nhiều tiền mặt",
        "Chỉ cần dám mở miệng nói tiếng Trung thì người địa phương sẽ nhiệt tình giúp đỡ",
        "Không nên đi một mình",
        "Phải thuê phiên dịch"
      ],
      "correctIndex": 1,
      "explanation": "Bạn B đúc kết: \"只要敢开口说汉语，当地人都会热情地帮助你\"."
    },
    "step6_speaking": {
      "prompt": "Tuyên bố khả năng tự lập của bạn:",
      "targetSentence": "没问题，我能自己解决！",
      "targetPinyin": "Méi wèntí, wǒ néng zìjǐ jiějué!",
      "targetMeaning": "Không vấn đề gì, tôi có thể tự giải quyết!",
      "hint": "Đọc tràn đầy năng lượng và tự tin."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi thích đi du lịch tự túc",
      "words": [
        "自由行",
        "喜欢",
        "我"
      ],
      "correctOrder": [
        "我",
        "喜欢",
        "自由行"
      ],
      "explanation": "我 + 喜欢 + 自由行."
    },
    "step8_quiz": [
      {
        "id": "q-305-1",
        "type": "multiple-choice",
        "question": "Từ '自由行' (zìyóuxíng) mang nghĩa là hình thức du lịch nào?",
        "options": [
          "Du lịch theo đoàn tour",
          "Du lịch tự túc / Tự do khám phá",
          "Đi công tác",
          "Về quê"
        ],
        "correctIndex": 1,
        "explanation": "自由行 là du lịch tự túc."
      },
      {
        "id": "q-305-2",
        "type": "multiple-choice",
        "question": "Dấu mốc của Level 3 (HSK 3) được gọi là:",
        "options": [
          "Khởi đầu bỡ ngỡ",
          "Mốc chuyển mình: Giao tiếp độc lập",
          "Bậc thầy dịch thuật",
          "Chuyên gia văn học"
        ],
        "correctIndex": 1,
        "explanation": "HSK 3 là cột mốc chuyển mình sang giao tiếp độc lập."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa Boss Chapter 9",
      "taskDesc": "Vượt qua thử thách du lịch độc lập để sẵn sàng đối đầu Boss Sân bay Bắc Kinh!",
      "targetPhrase": "wǒ néng dúlì zài zhōngguó zìyóuxíng",
      "xpReward": 60,
      "badge": "Phượt Thủ Tự Lập"
    }
  },
  {
    "id": "l-306",
    "chapterId": "ch-10",
    "levelId": "lvl-3",
    "lessonNumber": 6,
    "title": "Bổ ngữ Kết quả cơ bản (做完, 学好, 听懂, 看见, 找到)",
    "chineseTitle": "结果补语核心（做完、学好、听懂、看见）",
    "subtitle": "Ngữ pháp linh hồn: Động từ + Bổ ngữ kết quả (完, 好, 懂, 见, 到) biểu thị hành động đã đạt kết quả.",
    "objective": "Sử dụng thành thạo bổ ngữ kết quả để diễn tả đã làm xong, học giỏi, nghe hiểu, nhìn thấy.",
    "prerequisite": "Đã hoàn thành Module 3.1.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng chính xác các bổ ngữ kết quả thông dụng.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Bổ ngữ kết quả",
      "做完",
      "听懂",
      "学好"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Công thức Bổ ngữ Kết quả: Động từ + Kết quả (完 / 好 / 懂 / 见 / 到)",
      "summary": "1. 完 (xong): 做完, 吃完, 看完. 2. 好 (chuẩn/tốt đẹp): 准备好, 学好. 3. 懂 (hiểu): 听懂, 看懂. 4. 见 (nhận thấy qua giác quan): 看见, 听见. 5. 到 (đạt được mục tiêu): 找到, 买到.",
      "audioDemoText": "wǒ zuò wán zuòyè le, wǒ tīng dǒng le, wǒ zhǎo dào shǒujī le"
    },
    "step2_vocabulary": [
      {
        "id": "v-306-1",
        "hanzi": "完",
        "pinyin": "wán",
        "hanviet": "Hoàn",
        "meaning": "Xong, hết",
        "radical": "宀 (Miên)",
        "example": {
          "hanzi": "做完练习。",
          "pinyin": "Zuò wán liànxí.",
          "meaning": "Làm xong bài tập."
        },
        "pos": "Động từ / Bổ ngữ kết quả"
      },
      {
        "id": "v-306-2",
        "hanzi": "懂",
        "pinyin": "dǒng",
        "hanviet": "Đổng",
        "meaning": "Hiểu",
        "radical": "忄 (Tâm)",
        "example": {
          "hanzi": "我听懂了。",
          "pinyin": "Wǒ tīng dǒng le.",
          "meaning": "Tôi nghe hiểu rồi."
        },
        "pos": "Động từ / Bổ ngữ kết quả"
      },
      {
        "id": "v-306-3",
        "hanzi": "看见",
        "pinyin": "kànjiàn",
        "hanviet": "Khán kiến",
        "meaning": "Nhìn thấy",
        "radical": "目 (Mục)",
        "example": {
          "hanzi": "看见他了吗？",
          "pinyin": "Kànjiàn tā le ma?",
          "meaning": "Nhìn thấy anh ấy chưa?"
        },
        "pos": "Cụm bổ ngữ kết quả"
      },
      {
        "id": "v-306-4",
        "hanzi": "找到",
        "pinyin": "zhǎodào",
        "hanviet": "Trảo đáo",
        "meaning": "Tìm thấy, kiếm được",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "找到了钱包。",
          "pinyin": "Zhǎodào le qiánbāo.",
          "meaning": "Đã tìm thấy ví tiền."
        },
        "pos": "Cụm bổ ngữ kết quả"
      },
      {
        "id": "v-306-5",
        "hanzi": "清楚",
        "pinyin": "qīngchu",
        "hanviet": "Thanh sở",
        "meaning": "Rõ ràng",
        "radical": "氵 (Thủy)",
        "example": {
          "hanzi": "听得清楚。",
          "pinyin": "Tīng de qīngchu.",
          "meaning": "Nghe được rõ ràng."
        },
        "pos": "Tính từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "完",
        "hanzi": "完",
        "pinyin": "wán",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱宀元",
        "radical": {
          "char": "宀",
          "name": "Miên",
          "strokes": 3
        },
        "meaning": "Hoàn tất, xong xuôi",
        "strokesCount": 7,
        "strokeOrderText": "Chấm -> Chấm -> Ngang móc (宀) -> Ngang -> Ngang -> Phẩy -> Cong móc (元)",
        "components": [
          "宀",
          "元"
        ],
        "mnemonic": "Dưới mái nhà (宀) đã khôi phục lại trọn vẹn cội nguyên (元), nghĩa là hoàn tất mỹ mãn."
      },
      {
        "char": "懂",
        "hanzi": "懂",
        "pinyin": "dǒng",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰忄董",
        "radical": {
          "char": "忄",
          "name": "Tâm",
          "strokes": 3
        },
        "meaning": "Hiểu rõ, thấu hiểu",
        "strokesCount": 15,
        "strokeOrderText": "Bộ Tâm 忄 (3 nét) -> Chữ Đổng 董 (12 nét)",
        "components": [
          "忄",
          "董"
        ],
        "mnemonic": "Trái tim (忄) luôn có chính kiến và hiểu rõ đạo lý sâu sắc."
      }
    ],
    "step4_grammar": {
      "title": "Phủ định của Bổ ngữ Kết quả: 没 + Động từ + Kết quả (KHÔNG DÙNG 不)",
      "formula": "Khẳng định: V + Kết quả + 了. Phủ định: 没(有) + V + Kết quả (BỎ 了).",
      "explanation": "Bổ ngữ kết quả biểu thị việc đã xảy ra, nên phủ định BẮT BUỘC dùng 没. Tuyệt đối không dùng 不.",
      "examples": [
        {
          "hanzi": "我还没做完作业。（ĐÚNG）  /  我不做完作业。（SAI ❌）",
          "pinyin": "Wǒ hái méi zuò wán zuòyè.",
          "meaning": "Tôi vẫn chưa làm xong bài tập về nhà."
        }
      ],
      "commonMistake": {
        "wrong": "我不听懂 ❌",
        "correct": "我没听懂 ✔️",
        "explanation": "Phủ định bổ ngữ kết quả luôn luôn dùng 没."
      }
    },
    "step5_listening": {
      "situation": "Kiểm tra tiến độ công việc và học tập với Bổ ngữ kết quả (做完, 听懂, 看见)",
      "context": "Tại lớp học tiếng Trung sau giờ kiểm tra",
      "participants": "A: Lớp trưởng, B: Học viên",
      "targetGoal": "Thành thạo cấu trúc bổ ngữ kết quả: Động từ + 完/懂/见/到/清楚",
      "usageNotes": "Bổ ngữ kết quả đứng ngay sau động từ không có khoảng cách: 做完 (làm xong), 听懂 (nghe hiểu), 看清楚 (nhìn rõ).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "今天的听力考试很难，你都听懂了吗？",
          "pinyin": "Jīntiān de tīnglì kǎoshì hěn nán, nǐ dōu tīngdǒng le ma?",
          "meaning": "Bài thi nghe hôm nay khó quá, bạn nghe hiểu hết không?"
        },
        {
          "speaker": "B",
          "hanzi": "第二部分语速很快，我没听清楚，不过前面的我都做完了。",
          "pinyin": "Dì-èr bùfen yǔsù hěn kuài, wǒ méi tīng qīngchu, búguò qiánmiàn de wǒ dōu zuòwán le.",
          "meaning": "Phần 2 tốc độ nói nhanh quá mình nghe không rõ, nhưng phần trước mình đều làm xong rồi."
        },
        {
          "speaker": "A",
          "hanzi": "黑板上的作业你看见了吗？老师让我们写一篇短文。",
          "pinyin": "Hēibǎn shang de zuòyè nǐ kànjiàn le ma? Lǎoshī ràng wǒmen xiě yì piān duǎnwén.",
          "meaning": "Bài tập trên bảng đen bạn có nhìn thấy không? Thầy bảo chúng ta viết một đoạn văn ngắn."
        },
        {
          "speaker": "B",
          "hanzi": "我看见了，我已经把题目记在笔记本上了。",
          "pinyin": "Wǒ kànjiàn le, wǒ yǐjīng bǎ tímù jì zài bǐjìběn shang le.",
          "meaning": "Mình nhìn thấy rồi, mình đã chép đề bài vào sổ tay rồi."
        }
      ],
      "audioText": "今天的听力考试很难，你都听懂了吗？第二部分语速很快，我没听清楚，不过前面的我都做完了。黑板上的作业你看见了吗？老师让我们写一篇短文。我看见了，我已经把题目记在笔记本上了。",
      "question": "Bạn B đã làm gì đối với bài tập thầy giáo giao trên bảng đen?",
      "options": [
        "Chưa nhìn thấy đề bài",
        "Đã ghi lại đề bài vào sổ tay (把题目记在笔记本上)",
        "Quên không làm",
        "Nhờ bạn làm hộ"
      ],
      "correctIndex": 1,
      "explanation": "Bạn B trả lời: \"我看见了，我已经把题目记在笔记本上了\"."
    },
    "step6_speaking": {
      "prompt": "Khẳng định bạn đã nghe hiểu:",
      "targetSentence": "我全都听懂了。",
      "targetPinyin": "Wǒ quándōu tīng dǒng le.",
      "targetMeaning": "Tôi nghe hiểu toàn bộ rồi.",
      "hint": "Đọc tīng dǒng thanh 1 và 3 rõ ràng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi vẫn chưa làm xong bài tập",
      "words": [
        "作业",
        "还没做完",
        "我"
      ],
      "correctOrder": [
        "我",
        "还没做完",
        "作业"
      ],
      "explanation": "我 + 还没做完 + 作业."
    },
    "step8_quiz": [
      {
        "id": "q-306-1",
        "type": "multiple-choice",
        "question": "Chọn câu phủ định đúng với bổ ngữ kết quả:",
        "options": [
          "我不买到票",
          "我没买到票",
          "我买不到票了",
          "我买没票"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định bổ ngữ kết quả dùng 没: 我没买到票."
      },
      {
        "id": "q-306-2",
        "type": "multiple-choice",
        "question": "Từ '完' trong '吃完了' đóng vai trò ngữ pháp là gì?",
        "options": [
          "Bổ ngữ xu hướng",
          "Bổ ngữ kết quả",
          "Bổ ngữ thời lượng",
          "Trạng từ"
        ],
        "correctIndex": 1,
        "explanation": "完 là bổ ngữ kết quả chỉ sự hoàn tất."
      }
    ],
    "step9_challenge": {
      "title": "Báo cáo tiến độ chuẩn",
      "taskDesc": "Đọc to câu: 'Tôi đã chuẩn bị xong tất cả và tìm thấy hộ chiếu rồi'.",
      "targetPhrase": "wǒ zhǔnbèi hǎo le zhǎodào hùzhào le",
      "xpReward": 50,
      "badge": "Hoàn Tất Xuất Sắc"
    }
  },
  {
    "id": "l-307",
    "chapterId": "ch-10",
    "levelId": "lvl-3",
    "lessonNumber": 7,
    "title": "Bổ ngữ Khả năng (看得懂, 听不清楚, 买不起)",
    "chineseTitle": "可能补语（动词 + 得/不 + 结果/趋向）",
    "subtitle": "Diễn đạt có thể hay không thể đạt được kết quả: V + 得/不 + Kết quả (看得懂 - xem hiểu được, 听不清 - nghe không rõ).",
    "objective": "Làm chủ bổ ngữ khả năng để phản xạ nhanh: có hiểu được không, có làm kịp không, có mua nổi không.",
    "prerequisite": "Đã hoàn thành Bài 306.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cấu trúc V+得/不+Bổ ngữ.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Bổ ngữ khả năng",
      "看得懂",
      "听不清楚",
      "Ngữ pháp HSK 3"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Công thức Bổ ngữ Khả năng: Khẳng định (V + 得 + Kết quả) vs Phủ định (V + 不 + Kết quả)",
      "summary": "Khẳng định: 看得懂 (Đọc hiểu được), 做得完 (Làm kịp/làm hết được). Phủ định: 看不懂 (Không đọc hiểu được), 做不完 (Không làm xuể/không kịp), 听不清楚 (Nghe không rõ ràng).",
      "audioDemoText": "nǐ kàn de dǒng ma, wǒ kàn bu dǒng, tài guì le wǒ mǎi bu qǐ"
    },
    "step2_vocabulary": [
      {
        "id": "v-307-1",
        "hanzi": "看得懂",
        "pinyin": "kàn de dǒng",
        "hanviet": "Khán đắc đổng",
        "meaning": "Xem/đọc hiểu được",
        "radical": "目 (Mục)",
        "example": {
          "hanzi": "你看得懂中文报纸吗？",
          "pinyin": "Nǐ kàn de dǒng Zhōngwén bàozhǐ ma?",
          "meaning": "Bạn đọc hiểu được báo tiếng Trung không?"
        },
        "pos": "Cụm bổ ngữ khả năng"
      },
      {
        "id": "v-307-2",
        "hanzi": "听不懂",
        "pinyin": "tīng bu dǒng",
        "hanviet": "Thính bất đổng",
        "meaning": "Nghe không hiểu",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "说太快我听不懂。",
          "pinyin": "Shuō tài kuài wǒ tīng bu dǒng.",
          "meaning": "Nói nhanh quá tôi nghe không hiểu."
        },
        "pos": "Cụm bổ ngữ khả năng"
      },
      {
        "id": "v-307-3",
        "hanzi": "买得起",
        "pinyin": "mǎi de qǐ",
        "hanviet": "Mãi đắc khởi",
        "meaning": "Mua nổi, đủ tiền mua",
        "radical": "乛 (Ất)",
        "example": {
          "hanzi": "太贵了买不起。",
          "pinyin": "Tài guì le mǎi bu qǐ.",
          "meaning": "Đắt quá mua không nổi."
        },
        "pos": "Cụm bổ ngữ khả năng"
      },
      {
        "id": "v-307-4",
        "hanzi": "做不完",
        "pinyin": "zuò bu wán",
        "hanviet": "Tác bất hoàn",
        "meaning": "Làm không hết, không xong xuể",
        "radical": "亻 (Nhân đứng)",
        "example": {
          "hanzi": "作业太多做不完。",
          "pinyin": "Zuòyè tài duō zuò bu wán.",
          "meaning": "Bài tập nhiều quá làm không hết."
        },
        "pos": "Cụm bổ ngữ khả năng"
      }
    ],
    "step3_hanzi": [
      {
        "char": "得",
        "hanzi": "得",
        "pinyin": "de",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰彳㝵",
        "radical": {
          "char": "彳",
          "name": "Xích",
          "strokes": 3
        },
        "meaning": "Được, trợ từ trình độ",
        "strokesCount": 11,
        "strokeOrderText": "Phẩy -> Phẩy -> Sổ (彳) -> Nhật 日 -> Nhất 一 -> Thốn 寸",
        "components": [
          "彳",
          "㝵"
        ],
        "mnemonic": "Bước chân chậm rãi (彳) qua từng ngày (日) sẽ thu hoạch được kết quả tấc đất (寸)."
      },
      {
        "char": "楚",
        "hanzi": "楚",
        "pinyin": "chǔ",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱林疋",
        "radical": {
          "char": "木",
          "name": "Mộc",
          "strokes": 4
        },
        "meaning": "Rõ ràng (trong 清楚)",
        "strokesCount": 13,
        "strokeOrderText": "Chữ Lâm 林 (8 nét) -> Chữ Thất 疋 (5 nét)",
        "components": [
          "林",
          "疋"
        ],
        "mnemonic": "Hai hàng cây rừng (林) ngay ngắn nhìn rõ ràng từng gốc rễ (疋)."
      }
    ],
    "step4_grammar": {
      "title": "Phân biệt Bổ ngữ Khả năng (看得懂) vs 能 + Động từ (能看懂)",
      "formula": "Bổ ngữ khả năng (V + 得/不 + Kết quả) là khẩu ngữ tự nhiên số 1 của người bản xứ",
      "explanation": "Người Việt hay nói '能看懂' theo thói quen dịch từng chữ, nhưng người Trung Quốc 90% sẽ nói '看得懂' hoặc '看不懂'.",
      "examples": [
        {
          "hanzi": "你说得太快了，我听不清楚，请慢一点儿。",
          "pinyin": "Nǐ shuō de tài kuài le, wǒ tīng bu qīngchu, qǐng màn yìdiǎnr.",
          "meaning": "Bạn nói nhanh quá, tôi nghe không rõ, xin nói chậm lại một chút."
        }
      ],
      "commonMistake": {
        "wrong": "不能看懂 (nghe cứng nhắc dịch máy)",
        "correct": "看不懂 ✔️",
        "explanation": "Bổ ngữ khả năng tự nhiên, bản xứ hơn nhiều."
      }
    },
    "step5_listening": {
      "situation": "Diễn đạt khả năng thực hiện với Bổ ngữ khả năng (看得懂, 听不懂, 买得起)",
      "context": "Tại hiệu sách Trung văn khi cùng bạn bè chọn tiểu thuyết",
      "participants": "A: Bạn cùng lớp, B: Học viên HSK 3",
      "targetGoal": "Phân biệt Bổ ngữ khả năng: Động từ + 得/不 + Kết quả/Xu hướng (看得懂 / 看不懂)",
      "usageNotes": "Bổ ngữ khả năng biểu thị chủ quan hoặc khách quan có đủ điều kiện làm được việc gì hay không.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "这本全中文的小说，你看得懂吗？",
          "pinyin": "Zhè běn quán Zhōngwén de xiǎoshuō, nǐ kàn de dǒng ma?",
          "meaning": "Cuốn tiểu thuyết toàn tiếng Trung này, bạn đọc có hiểu nổi không?"
        },
        {
          "speaker": "B",
          "hanzi": "生词比较多，没有拼音我看不懂，需要查词典。",
          "pinyin": "Shēngcí bǐjiào duō, méiyǒu pīnyīn wǒ kàn bu dǒng, xūyào chá cídiǎn.",
          "meaning": "Từ mới tương đối nhiều, không có Pinyin thì mình đọc không hiểu, cần tra từ điển."
        },
        {
          "speaker": "A",
          "hanzi": "那边的有声书不错，听得清楚而且发音很标准。",
          "pinyin": "Nàbiān de yǒushēngshū búcuò, tīng de qīngchu érqiě fāyīn hěn biāozhǔn.",
          "meaning": "Sách nói bên kia hay lắm, nghe rất rõ ràng mà phát âm lại rất chuẩn."
        },
        {
          "speaker": "B",
          "hanzi": "太好了，价格也不贵，我们普通学生也买得起。",
          "pinyin": "Tài hǎo le, jiàgé yě bú guì, wǒmen pǔtōng xuésheng yě mǎi de qǐ.",
          "meaning": "Tuyệt quá, giá cả cũng không đắt, học sinh bình thường tụi mình cũng mua nổi."
        }
      ],
      "audioText": "这本全中文的小说，你看得懂吗？生词比较多，没有拼音我看不懂，需要查词典。那边的有声书不错，听得清楚而且发音很标准。太好了，价格也不贵，我们普通学生也买得起。",
      "question": "Vì sao cuốn tiểu thuyết toàn tiếng Trung khiến bạn B đọc không hiểu?",
      "options": [
        "Vì chữ quá nhỏ",
        "Vì có nhiều từ mới và không có Pinyin (生词比较多，没有拼音)",
        "Vì sách bị rách",
        "Vì truyện quá dài"
      ],
      "correctIndex": 1,
      "explanation": "Bạn B giải thích: \"生词比较多，没有拼音我看不懂，需要查词典\"."
    },
    "step6_speaking": {
      "prompt": "Nói bạn nghe không rõ, xin nói chậm lại:",
      "targetSentence": "我听不清楚，请慢一点儿。",
      "targetPinyin": "Wǒ tīng bu qīngchu, qǐng màn yìdiǎnr.",
      "targetMeaning": "Tôi nghe không rõ, xin chậm một chút.",
      "hint": "Đọc tīng bu qīngchu mượt mà."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Bạn có đọc hiểu không?",
      "words": [
        "看得懂吗",
        "你"
      ],
      "correctOrder": [
        "你",
        "看得懂吗"
      ],
      "explanation": "你 + 看得懂吗."
    },
    "step8_quiz": [
      {
        "id": "q-307-1",
        "type": "multiple-choice",
        "question": "Dạng phủ định của '看得懂' (Đọc hiểu được) là:",
        "options": [
          "不看懂",
          "看不懂 (kàn bu dǒng)",
          "没看得懂",
          "看得不懂"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định bổ ngữ khả năng thay 得 bằng 不: 看不懂."
      },
      {
        "id": "q-307-2",
        "type": "multiple-choice",
        "question": "Cụm '买不起' (mǎi bu qǐ) mang nghĩa:",
        "options": [
          "Không muốn mua",
          "Không mua nổi (vì quá đắt/không đủ tiền)",
          "Đã mua rồi",
          "Mua rẻ"
        ],
        "correctIndex": 1,
        "explanation": "买不起 là không đủ năng lực tài chính để mua."
      }
    ],
    "step9_challenge": {
      "title": "Làm chủ khả năng",
      "taskDesc": "Đọc to câu: 'Bài tập này tuy khó nhưng tôi làm hết được'.",
      "targetPhrase": "zhè ge zuòyè wǒ zuò de wán",
      "xpReward": 50,
      "badge": "Khả Năng Vô Hạn"
    }
  },
  {
    "id": "l-308",
    "chapterId": "ch-10",
    "levelId": "lvl-3",
    "lessonNumber": 8,
    "title": "Linh hồn ngữ pháp: Câu chữ 把 căn bản (S + 把 + O + V + khác)",
    "chineseTitle": "“把”字句核心法则（S + 把 + O + 动词 + 其他成分）",
    "subtitle": "Ngữ pháp tối quan trọng của tiếng Trung: Đưa tân ngữ lên trước để diễn tả sự tác động, xử lý của chủ ngữ.",
    "objective": "Làm chủ 100% bản chất câu chữ 把 căn bản và chuyển đổi câu SVO thông thường sang câu chữ 把.",
    "prerequisite": "Đã hoàn thành Bài 307.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đổi đúng 3 câu SVO sang câu chữ 把.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Câu chữ 把",
      "Linh hồn ngữ pháp",
      "Ngữ pháp trọng điểm"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Công thức kinh điển Câu chữ 把: Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác",
      "summary": "Câu chữ 把 dùng khi chủ ngữ TÁC ĐỘNG vào tân ngữ làm tân ngữ THAY ĐỔI VỊ TRÍ HOẶC TRẠNG THÁI. Động từ không bao giờ đứng trơ trọi một mình, phải có thành phần khác đi kèm (了, Bổ ngữ, Trùng điệp).",
      "audioDemoText": "wǒ bǎ zuòyè zuò wán le, qǐng bǎ mén guān shàng, tā bǎ píngguǒ chī le"
    },
    "step2_vocabulary": [
      {
        "id": "v-308-1",
        "hanzi": "把",
        "pinyin": "bǎ",
        "hanviet": "Bả",
        "meaning": "Đem, lấy (giới từ câu chữ 把)",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "把书给我。",
          "pinyin": "Bǎ shū gěi wǒ.",
          "meaning": "Đưa sách cho tôi."
        },
        "pos": "Giới từ"
      },
      {
        "id": "v-308-2",
        "hanzi": "放",
        "pinyin": "fàng",
        "hanviet": "Phóng",
        "meaning": "Đặt, để",
        "radical": "攵 (Phác)",
        "example": {
          "hanzi": "把包放在桌子上。",
          "pinyin": "Bǎ bāo fàng zài zhuōzi shàng.",
          "meaning": "Đặt túi xách lên trên bàn."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-308-3",
        "hanzi": "关上",
        "pinyin": "guānshàng",
        "hanviet": "Quan thượng",
        "meaning": "Đóng lại",
        "radical": "八 (Bát)",
        "example": {
          "hanzi": "把门关上。",
          "pinyin": "Bǎ mén guānshàng.",
          "meaning": "Đóng cửa lại."
        },
        "pos": "Cụm bổ ngữ kết quả"
      },
      {
        "id": "v-308-4",
        "hanzi": "洗",
        "pinyin": "xǐ",
        "hanviet": "Tẩy",
        "meaning": "Rửa, giặt",
        "radical": "氵 (Thủy)",
        "example": {
          "hanzi": "把衣服洗干净。",
          "pinyin": "Bǎ yīfu xǐ gānjìng.",
          "meaning": "Giặt quần áo sạch sẽ."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-308-5",
        "hanzi": "干净",
        "pinyin": "gānjìng",
        "hanviet": "Can tịnh",
        "meaning": "Sạch sẽ",
        "radical": "干 (Can)",
        "example": {
          "hanzi": "房间很干净。",
          "pinyin": "Fángjiān hěn gānjìng.",
          "meaning": "Căn phòng rất sạch sẽ."
        },
        "pos": "Tính từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "把",
        "hanzi": "把",
        "pinyin": "bǎ",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰扌巴",
        "radical": {
          "char": "扌",
          "name": "Thủ",
          "strokes": 3
        },
        "meaning": "Cầm nắm, câu chữ 把",
        "strokesCount": 7,
        "strokeOrderText": "Ngang -> Sổ móc -> Hất (扌) -> Ngang gập -> Sổ -> Ngang -> Sổ cong móc (巴)",
        "components": [
          "扌",
          "巴"
        ],
        "mnemonic": "Bàn tay (扌) nắm chặt lấy cán chiếc đuôi (巴) để điều khiển."
      },
      {
        "char": "洗",
        "hanzi": "洗",
        "pinyin": "xǐ",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰氵先",
        "radical": {
          "char": "氵",
          "name": "Thủy",
          "strokes": 3
        },
        "meaning": "Rửa sạch, giặt giũ",
        "strokesCount": 9,
        "strokeOrderText": "Chấm -> Chấm -> Hất (氵) -> Phẩy -> Ngang -> Sổ -> Ngang -> Phẩy -> Sổ cong móc (先)",
        "components": [
          "氵",
          "先"
        ],
        "mnemonic": "Dùng dòng nước trong (氵) rửa sạch trước tiên (先) để tẩy trần bụi bẩn."
      }
    ],
    "step4_grammar": {
      "title": "4 Điều cấm kỵ tuyệt đối khi dùng Câu chữ 把",
      "formula": "1. Động từ không được đứng cô độc (phải có thành phần khác: 了, 在, 到, 成, Bổ ngữ). 2. Tân ngữ phải xác định (người nghe biết rõ là vật gì). 3. Không dùng cho động từ cảm xúc (喜欢, 觉得, 有, 是). 4. Phủ định (没) và Năng nguyện (想, 要) phải đứng TRƯỚC chữ 把.",
      "explanation": "Ví dụ phủ định: 我没把书带来 (ĐÚNG) / 我把书没带来 (SAI ❌).",
      "examples": [
        {
          "hanzi": "请你把门关上，外面很冷。",
          "pinyin": "Qǐng nǐ bǎ mén guānshàng, wàimiàn hěn lěng.",
          "meaning": "Xin bạn đóng cửa lại, bên ngoài rất lạnh."
        }
      ],
      "commonMistake": {
        "wrong": "我把书看 ❌ (động từ cô độc)",
        "correct": "我把书看完了 ✔️",
        "explanation": "Động từ câu chữ 把 bắt buộc có thành phần bổ trợ."
      }
    },
    "step5_listening": {
      "situation": "Sắp xếp phòng ốc và dọn dẹp nhà cửa với Câu chữ 把 căn bản",
      "context": "Hai bạn cùng phòng phân công dọn dẹp ký túc xá cuối tuần",
      "participants": "A: Bạn cùng phòng A, B: Bạn cùng phòng B",
      "targetGoal": "Nắm vững cấu trúc câu chữ 把: Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần bổ sung",
      "usageNotes": "Điều kiện dùng câu 把: Tân ngữ phải là đối tượng xác định (đã biết), và động từ phải có tác động làm thay đổi vị trí/trạng thái của tân ngữ.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "今天周末，我们一起把宿舍打扫干净吧！",
          "pinyin": "Jīntiān zhōumò, wǒmen yìqǐ bǎ sùshè dǎsǎo gānjìng ba!",
          "meaning": "Hôm nay cuối tuần, chúng mình cùng nhau dọn dẹp ký túc xá cho thật sạch sẽ nhé!"
        },
        {
          "speaker": "B",
          "hanzi": "好啊！你先把脏衣服洗了，我来擦桌子。",
          "pinyin": "Hǎo a! Nǐ xiān bǎ zāng yīfu xǐ le, wǒ lái cā zhuōzi.",
          "meaning": "Được chứ! Bạn giặt quần áo bẩn trước đi, để mình lau bàn."
        },
        {
          "speaker": "A",
          "hanzi": "别忘了把窗户关上，外边好像要刮大风了。",
          "pinyin": "Bié wàng le bǎ chuānghu guānshang, wàibiān hǎoxiàng yào guā dàfēng le.",
          "meaning": "Đừng quên đóng cửa sổ lại nhé, bên ngoài hình như sắp nổi gió to rồi."
        },
        {
          "speaker": "B",
          "hanzi": "我已经把窗户关好了，再把地上的垃圾扔出去就完成了。",
          "pinyin": "Wǒ yǐjīng bǎ chuānghu guān hǎo le, zài bǎ dìshang de lājī rēng chūqù jiù wánchéng le.",
          "meaning": "Mình đã đóng chặt cửa sổ rồi, gom rác trên sàn vứt ra ngoài nữa là xong xuôi."
        }
      ],
      "audioText": "今天周末，我们一起把宿舍打扫干净吧！好啊！你先把脏衣服洗了，我来擦桌子。别忘了把窗户关上，外边好像要刮大风了。我已经把窗户关好了，再把地上的垃圾扔出去就完成了。",
      "question": "Hai bạn cùng phòng đã phối hợp làm những công việc gì?",
      "options": [
        "Đi xem phim",
        "Giặt đồ bẩn, lau bàn, đóng cửa sổ và đổ rác (把宿舍打扫干净)",
        "Nấu bữa tối",
        "Đi đá bóng"
      ],
      "correctIndex": 1,
      "explanation": "Hai bạn phân công: giặt quần áo bẩn, lau bàn, đóng cửa sổ và vứt rác ra ngoài."
    },
    "step6_speaking": {
      "prompt": "Đọc câu chữ 把 yêu cầu đóng cửa:",
      "targetSentence": "请把门关上。",
      "targetPinyin": "Qǐng bǎ mén guānshàng.",
      "targetMeaning": "Xin hãy đóng cửa lại.",
      "hint": "Đọc bǎ mén guānshàng liền mạch."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu chữ 把: Tôi đã làm xong bài tập rồi",
      "words": [
        "做了完",
        "把作业",
        "我"
      ],
      "correctOrder": [
        "我",
        "把作业",
        "做了完"
      ],
      "explanation": "我 + 把作业 + 做完了."
    },
    "step8_quiz": [
      {
        "id": "q-308-1",
        "type": "multiple-choice",
        "question": "Trong câu chữ 把, từ phủ định '没' phải đứng ở vị trí nào?",
        "options": [
          "Đứng trước chữ 把 (S + 没 + 把 + O + V)",
          "Đứng sau chữ 把",
          "Đứng sau động từ",
          "Đứng cuối câu"
        ],
        "correctIndex": 0,
        "explanation": "Phó từ phủ định bắt buộc đứng trước 把: 我没把手机带来."
      },
      {
        "id": "q-308-2",
        "type": "multiple-choice",
        "question": "Câu nào sau đây phạm lỗi 'động từ đứng cô độc' trong câu chữ 把?",
        "options": [
          "我把苹果吃了",
          "我把书看",
          "我把衣服洗干净了",
          "我把门关上了"
        ],
        "correctIndex": 1,
        "explanation": "Câu '我把书看' sai vì động từ 看 không có thành phần bổ trợ."
      }
    ],
    "step9_challenge": {
      "title": "Bậc thầy chữ 把",
      "taskDesc": "Đọc to câu: 'Tôi đã giặt sạch quần áo và đặt lên giường rồi'.",
      "targetPhrase": "wǒ bǎ yīfu xǐ gānjìng le fàng zài chuáng shàng",
      "xpReward": 50,
      "badge": "Bậc Thầy Chữ 把"
    }
  },
  {
    "id": "l-309",
    "chapterId": "ch-10",
    "levelId": "lvl-3",
    "lessonNumber": 9,
    "title": "Câu chữ 把 nâng cao kết hợp Bổ ngữ kết quả & Xu hướng",
    "chineseTitle": "“把”字句进阶演练（把书交上去、把手机拿出来）",
    "subtitle": "Cấu trúc đỉnh cao của HSK 3: $S + 把 + O + V + Bổ ngữ kết quả / Bổ ngữ xu hướng phức hợp$.",
    "objective": "Kết hợp nhuần nhuyễn câu chữ 把 với các bổ ngữ xu hướng và bổ ngữ kết quả trong đàm thoại đời sống.",
    "prerequisite": "Đã hoàn thành Bài 308.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng câu chữ 把 nâng cao linh hoạt.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Câu chữ 把 nâng cao",
      "Bổ ngữ kết hợp",
      "Ngữ pháp đỉnh cao"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Cấu trúc 把 nâng cao: S + 把 + O + Động từ + (在 / 到 / 给 / 成 / 趋向补语)",
      "summary": "1. Thay đổi vị trí: 把书放到桌子上 (Để sách lên bàn). 2. Trao cho ai: 把作业交给老师 (Nộp bài cho thầy). 3. Chuyển dịch không gian: 把行李拿出来 (Lấy hành lý ra ngoài).",
      "audioDemoText": "qǐng bǎ zuòyè jiāo gěi lǎoshī, bǎ hùzhào ná chūlái, bǎ zhàopiàn fā gěi wǒ"
    },
    "step2_vocabulary": [
      {
        "id": "v-309-1",
        "hanzi": "交",
        "pinyin": "jiāo",
        "hanviet": "Giao",
        "meaning": "Giao nộp, kết bạn",
        "radical": "亠 (Đầu)",
        "example": {
          "hanzi": "交作业。",
          "pinyin": "Jiāo zuòyè.",
          "meaning": "Nộp bài tập."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-309-2",
        "hanzi": "发",
        "pinyin": "fā",
        "hanviet": "Phát",
        "meaning": "Gửi, phát ra (tin nhắn, mail)",
        "radical": "又 (Hựu)",
        "example": {
          "hanzi": "把照片发给我。",
          "pinyin": "Bǎ zhàopiàn fā gěi wǒ.",
          "meaning": "Gửi ảnh cho tôi."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-309-3",
        "hanzi": "搬",
        "pinyin": "bān",
        "hanviet": "Bàn",
        "meaning": "Chuyển, dọn (nhà, đồ nặng)",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "把桌子搬进去。",
          "pinyin": "Bǎ zhuōzi bān jìnqù.",
          "meaning": "Dọn bàn vào trong."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-309-4",
        "hanzi": "借",
        "pinyin": "jiè",
        "hanviet": "Tá",
        "meaning": "Mượn, vay",
        "radical": "亻 (Nhân đứng)",
        "example": {
          "hanzi": "把书借给我。",
          "pinyin": "Bǎ shū jiè gěi wǒ.",
          "meaning": "Cho tôi mượn sách."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "搬",
        "hanzi": "搬",
        "pinyin": "bān",
        "structure": {
          "code": "left_mid_right",
          "name": "Tả trung hữu (左中右结构)",
          "symbol": "⿲"
        },
        "ids": "⿲扌舟殳",
        "radical": {
          "char": "扌",
          "name": "Thủ",
          "strokes": 3
        },
        "meaning": "Chuyển dọn, khuân vác",
        "strokesCount": 13,
        "strokeOrderText": "Bộ Thủ 扌 (3 nét) -> Bộ Chu 舟 (6 nét) -> Bộ Thù 殳 (4 nét)",
        "components": [
          "扌",
          "舟",
          "殳"
        ],
        "mnemonic": "Dùng tay (扌) bốc dỡ hàng hóa lên thuyền (舟) và dùng gậy (殳) điều hướng khuân chuyển đồ."
      },
      {
        "char": "借",
        "hanzi": "借",
        "pinyin": "jiè",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰亻昔",
        "radical": {
          "char": "亻",
          "name": "Nhân đứng",
          "strokes": 2
        },
        "meaning": "Vay mượn, cho mượn",
        "strokesCount": 10,
        "strokeOrderText": "Phẩy -> Sổ (亻) -> Ngang -> Sổ -> Sổ -> Ngang -> Nhật 日 (昔)",
        "components": [
          "亻",
          "昔"
        ],
        "mnemonic": "Người (亻) nhớ lại ân tình ngày xưa (昔) sẵn lòng cho vay mượn giúp đỡ."
      }
    ],
    "step4_grammar": {
      "title": "Mô hình chuyển giao: S + 把 + O + V + 给 / 到 + Người / Nơi chốn",
      "formula": "S + 把 + Đồ vật + 寄/送/交/带 + 给 + Đối tượng nhận",
      "explanation": "Khi muốn nói chuyển giao một đồ vật cho ai hoặc gửi tới đâu, bắt buộc phải dùng câu chữ 把 kết hợp giới từ 给 hoặc 到.",
      "examples": [
        {
          "hanzi": "请你把这份文件发给经理。",
          "pinyin": "Qǐng nǐ bǎ zhè fèn wénjiàn fā gěi jīnglǐ.",
          "meaning": "Xin bạn gửi tập tài liệu này cho giám đốc."
        }
      ],
      "commonMistake": {
        "wrong": "发这份文件给经理 ❌ (thiếu tự nhiên)",
        "correct": "把这份文件发给经理 ✔️",
        "explanation": "Dùng 把 câu văn chuẩn ngữ pháp và đĩnh đạc."
      }
    },
    "step5_listening": {
      "situation": "Chuyển nhà và bàn giao công việc với Câu chữ 把 nâng cao",
      "context": "Tại văn phòng công ty khi chuyển sang trụ sở mới",
      "participants": "A: Quản lý văn phòng, B: Nhân viên",
      "targetGoal": "Thành thạo câu 把 kết hợp Bổ ngữ kết quả/xu hướng: 把...搬到..., 把...发给...",
      "usageNotes": "Khi tân ngữ dịch chuyển đến nơi chốn mới, bắt buộc dùng: 把 + Tân ngữ + Động từ + 到/在 + Nơi chốn.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "小李，你把这些重要的文件发给张经理了吗？",
          "pinyin": "Xiǎo Lǐ, nǐ bǎ zhèxiē zhòngyào de wénjiàn fā gěi Zhāng jīnglǐ le ma?",
          "meaning": "Tiểu Lý, bạn đã gửi những tập tài liệu quan trọng này cho giám đốc Trương chưa?"
        },
        {
          "speaker": "B",
          "hanzi": "我已经把文件发到他的电子邮箱里了。",
          "pinyin": "Wǒ yǐjīng bǎ wénjiàn fā dào tā de diànzǐ yóuxiāng lǐ le.",
          "meaning": "Tôi đã gửi tài liệu vào hòm thư điện tử của ông ấy rồi."
        },
        {
          "speaker": "A",
          "hanzi": "太好了。请大家帮忙把这几台电脑搬到三楼新办公室去。",
          "pinyin": "Tài hǎo le. Qǐng dàjiā bāngmáng bǎ zhè jǐ tái diànnǎo bān dào sānlóu xīn bàngōngshì qù.",
          "meaning": "Tốt quá. Xin mọi người giúp đỡ chuyển mấy chiếc máy tính này lên văn phòng mới ở tầng 3 nhé."
        },
        {
          "speaker": "B",
          "hanzi": "好的，我们马上把电脑搬上去，保证不弄坏。",
          "pinyin": "Hǎo de, wǒmen mǎshàng bǎ diànnǎo bān shàngqu, bǎozhèng bú nòng huài.",
          "meaning": "Vâng ạ, chúng tôi lập tức chuyển máy tính lên trên đó ngay, đảm bảo không làm hỏng."
        }
      ],
      "audioText": "小李，你把这些重要的文件发给张经理了吗？我已经把文件发到他的电子邮箱里了。太好了。请大家帮忙把这几台电脑搬到三楼新办公室去。好的，我们马上把电脑搬上去，保证不弄坏。",
      "question": "Tiểu Lý đã gửi các tập tài liệu quan trọng cho giám đốc qua phương thức nào?",
      "options": [
        "Gửi chuyển phát nhanh bưu điện",
        "Gửi vào hòm thư điện tử (发到他的电子邮箱里)",
        "In ra giấy trao tận tay",
        "Nhờ bảo vệ đưa"
      ],
      "correctIndex": 1,
      "explanation": "Tiểu Lý báo cáo: \"我已经把文件发到他的电子邮箱里了\"."
    },
    "step6_speaking": {
      "prompt": "Đọc câu nhờ gửi hình ảnh:",
      "targetSentence": "请把照片发给我。",
      "targetPinyin": "Qǐng bǎ zhàopiàn fā gěi wǒ.",
      "targetMeaning": "Xin hãy gửi ảnh cho tôi.",
      "hint": "Đọc fā gěi wǒ thanh 1, 3, 3."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Dọn chiếc bàn này vào trong phòng",
      "words": [
        "搬进房间去",
        "把这张桌子"
      ],
      "correctOrder": [
        "把这张桌子",
        "搬进房间去"
      ],
      "explanation": "把这张桌子 + 搬进房间去."
    },
    "step8_quiz": [
      {
        "id": "q-309-1",
        "type": "multiple-choice",
        "question": "Chọn câu đúng ngữ pháp nói 'Gửi tài liệu cho giám đốc':",
        "options": [
          "把文件发给经理",
          "发文件把经理",
          "经理把文件发",
          "给经理发把文件"
        ],
        "correctIndex": 0,
        "explanation": "Cấu trúc chuẩn: 把文件发给经理."
      },
      {
        "id": "q-309-2",
        "type": "multiple-choice",
        "question": "Cụm '交上来' (jiāo shànglái) có nghĩa là:",
        "options": [
          "Nộp lên đây",
          "Cầm đi",
          "Bỏ xuống",
          "Giấu đi"
        ],
        "correctIndex": 0,
        "explanation": "Nộp bài lên trên hướng về phía thầy giáo."
      }
    ],
    "step9_challenge": {
      "title": "Thực chiến công sở",
      "taskDesc": "Đọc to câu: 'Tôi đã gửi bản kế hoạch cho giám đốc và dọn dẹp văn phòng xong rồi'.",
      "targetPhrase": "wǒ bǎ jìhuà fā gěi jīnglǐ le",
      "xpReward": 50,
      "badge": "Chuyên Gia Văn Phòng"
    }
  },
  {
    "id": "l-310",
    "chapterId": "ch-10",
    "levelId": "lvl-3",
    "lessonNumber": 10,
    "title": "Câu bị động chữ 被 (S + 被 + Tác nhân + V + khác)",
    "chineseTitle": "“被”字句与被动表达（钱包被偷了、被看见了）",
    "subtitle": "Diễn đạt sự việc bị động hoặc chịu tác động không mong muốn với chữ 被 (bèi), 叫 (jiào), 让 (ràng).",
    "objective": "Sử dụng thành thạo câu bị động chữ 被 để miêu tả các tình huống bị động trong cuộc sống.",
    "prerequisite": "Đã hoàn thành Bài 309.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và chuyển đổi linh hoạt giữa câu chữ 把 và câu chữ 被.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Câu bị động chữ 被",
      "Bị động",
      "Ngữ pháp HSK 3"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Công thức Câu bị động: Chủ ngữ (Người/Vật bị tác động) + 被 (bèi) + (Tác nhân) + Động từ + Thành phần khác",
      "summary": "Câu chữ 被 thường dùng trong tình huống không may mắn hoặc nhấn mạnh kết quả của đối tượng chịu trận: 钱包被偷了 (Ví tiền bị trộm rồi), 蛋糕被人吃了 (Bánh ngọt bị ai đó ăn mất rồi).",
      "audioDemoText": "wǒ de qiánbāo bèi tōu le, bēizi bèi dǎ suì le, tā bèi gōngsī lùqǔ le"
    },
    "step2_vocabulary": [
      {
        "id": "v-310-1",
        "hanzi": "被",
        "pinyin": "bèi",
        "hanviet": "Bị",
        "meaning": "Bị, được (giới từ bị động)",
        "radical": "衤 (Y)",
        "example": {
          "hanzi": "被发现了。",
          "pinyin": "Bèi fāxiàn le.",
          "meaning": "Bị phát hiện rồi."
        },
        "pos": "Giới từ bị động"
      },
      {
        "id": "v-310-2",
        "hanzi": "偷",
        "pinyin": "tōu",
        "hanviet": "Thâu",
        "meaning": "Trộm, cắp",
        "radical": "亻 (Nhân đứng)",
        "example": {
          "hanzi": "自行车被偷了。",
          "pinyin": "Zìxíngchē bèi tōu le.",
          "meaning": "Xe đạp bị trộm mất rồi."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-310-3",
        "hanzi": "钱包",
        "pinyin": "qiánbāo",
        "hanviet": "Tiền bao",
        "meaning": "Ví tiền, bóp tiền",
        "radical": "钅 (Kim)",
        "example": {
          "hanzi": "我的钱包呢？",
          "pinyin": "Wǒ de qiánbāo ne?",
          "meaning": "Ví tiền của tôi đâu rồi?"
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-310-4",
        "hanzi": "打碎",
        "pinyin": "dǎsuì",
        "hanviet": "Đả toái",
        "meaning": "Đánh vỡ, làm bể",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "杯子被打碎了。",
          "pinyin": "Bēizi bèi dǎsuì le.",
          "meaning": "Cái ly bị làm vỡ rồi."
        },
        "pos": "Cụm bổ ngữ kết quả"
      },
      {
        "id": "v-310-5",
        "hanzi": "发现",
        "pinyin": "fāxiàn",
        "hanviet": "Phát hiện",
        "meaning": "Phát hiện, nhận ra",
        "radical": "又 (Hựu)",
        "example": {
          "hanzi": "被老师发现了。",
          "pinyin": "Bèi lǎoshī fāxiàn le.",
          "meaning": "Bị thầy giáo phát hiện rồi."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "被",
        "hanzi": "被",
        "pinyin": "bèi",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰衤皮",
        "radical": {
          "char": "衤",
          "name": "Y",
          "strokes": 5
        },
        "meaning": "Bị, được (bị động)",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Y 衤 (5 nét) -> Chữ Bì 皮 (5 nét)",
        "components": [
          "衤",
          "皮"
        ],
        "mnemonic": "Tấm chăn y phục (衤) đắp phủ lên lớp da (皮) của cơ thể."
      },
      {
        "char": "偷",
        "hanzi": "偷",
        "pinyin": "tōu",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰亻俞",
        "radical": {
          "char": "亻",
          "name": "Nhân đứng",
          "strokes": 2
        },
        "meaning": "Trộm cắp, lén lút",
        "strokesCount": 11,
        "strokeOrderText": "Phẩy -> Sổ (亻) -> Chữ Du 俞 (9 nét)",
        "components": [
          "亻",
          "俞"
        ],
        "mnemonic": "Kẻ xấu (亻) lén lút đục thuyền (俞) để ăn trộm của cải."
      }
    ],
    "step4_grammar": {
      "title": "Mối quan hệ chuyển đổi tương hỗ giữa Câu chữ 把 và Câu chữ 被",
      "formula": "Tác nhân + 把 + Đối tượng + V + khác  ⟷  Đối tượng + 被 + (Tác nhân) + V + khác",
      "explanation": "Ví dụ: 弟弟吃了蛋糕 (Chủ động) ➔ 弟弟把蛋糕吃了 (Nhấn mạnh xử lý) ➔ 蛋糕被弟弟吃了 (Nhấn mạnh bánh bị mất).",
      "examples": [
        {
          "hanzi": "小偷把我的自行车偷走了。 ➔ 我的自行车被小偷偷走了。",
          "pinyin": "Wǒ de zìxíngchē bèi xiǎotōu tōu zǒu le.",
          "meaning": "Chiếc xe đạp của tôi đã bị tên trộm lấy mất rồi."
        }
      ],
      "commonMistake": {
        "wrong": "自行车被 ❌ (thiếu động từ và kết quả)",
        "correct": "自行车被偷走了 ✔️",
        "explanation": "Câu chữ 被 luôn cần động từ và kết quả hành động."
      }
    },
    "step5_listening": {
      "situation": "Trình báo mất đồ và diễn đạt câu bị động với chữ 被 (Bị / Được)",
      "context": "Tại đồn công an khi một du khách làm mất ví tiền",
      "participants": "A: Cảnh sát tiếp nhận, B: Người bị hại",
      "targetGoal": "Thành thạo câu bị động chữ 被: Chủ ngữ (nạn nhân) + 被 + (Tác nhân) + Động từ + Thành phần khác",
      "usageNotes": "Câu 被 thường diễn đạt sự việc không may, không mong muốn xảy ra đối với chủ ngữ (ví dụ: 钱包被偷了).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "请坐，请问发生什么事了？",
          "pinyin": "Qǐng zuò, qǐngwèn fāshēng shénme shì le?",
          "meaning": "Mời ngồi, xin hỏi đã xảy ra chuyện gì vậy ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "警察同志，我的钱包在公交车上被小偷偷走了！",
          "pinyin": "Jǐngchá tóngzhì, wǒ de qiánbāo zài gōngjiāochē shang bèi xiǎotōu tōu zǒu le!",
          "meaning": "Đồng chí cảnh sát ơi, ví tiền của tôi trên xe buýt bị kẻ trộm móc mất rồi!"
        },
        {
          "speaker": "A",
          "hanzi": "你是什么时候发现钱包不见的？里面有什么贵重物品？",
          "pinyin": "Nǐ shì shénme shíhou fāxiàn qiánbāo bújiàn de? Lǐmiàn yǒu shénme guìzhòng wùpǐn?",
          "meaning": "Bạn phát hiện ví tiền bị mất từ lúc nào? Bên trong có đồ vật gì quý giá không?"
        },
        {
          "speaker": "B",
          "hanzi": "下车时我才发现。里面有我的身份证、银行卡和五百块现金。",
          "pinyin": "Xiàchē shí wǒ cái fāxiàn. Lǐmiàn yǒu wǒ de shēnfènzhèng, yínhángkǎ hé wǔbǎi kuài xiànjīn.",
          "meaning": "Lúc xuống xe tôi mới nhận ra. Bên trong có thẻ căn cước, thẻ ngân hàng và 500 tệ tiền mặt."
        }
      ],
      "audioText": "请坐，请问发生什么事了？警察同志，我的钱包在公交车上被小偷偷走了！你是什么时候发现钱包不见的？里面有什么贵重物品？下车时我才发现。里面有我的身份证、银行卡和五百块现金。",
      "question": "Ví tiền của người trình báo bị mất trong hoàn cảnh nào?",
      "options": [
        "Để quên ở khách sạn",
        "Bị kẻ trộm lấy mất trên xe buýt (在公交车上被小偷偷走了)",
        "Rơi ở quán ăn",
        "Bị bạn mượn"
      ],
      "correctIndex": 1,
      "explanation": "Người bị hại kể rõ: \"我的钱包在公交车上被小偷偷走了\"."
    },
    "step6_speaking": {
      "prompt": "Đọc câu miêu tả đồ vật bị vỡ:",
      "targetSentence": "杯子被人打碎了。",
      "targetPinyin": "Bēizi bèi rén dǎsuì le.",
      "targetMeaning": "Cái ly bị người ta làm vỡ rồi.",
      "hint": "Đọc bèi rén dǎsuì le dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu bị động: Ví tiền của tôi bị trộm mất rồi",
      "words": [
        "偷走了",
        "被",
        "我的钱包"
      ],
      "correctOrder": [
        "我的钱包",
        "被",
        "偷走了"
      ],
      "explanation": "我的钱包 + 被 + 偷走了."
    },
    "step8_quiz": [
      {
        "id": "q-310-1",
        "type": "multiple-choice",
        "question": "Trong câu chữ 被, tác nhân gây ra hành động có thể được lược bỏ không?",
        "options": [
          "Bắt buộc phải có",
          "Có thể lược bỏ (Ví dụ: 钱包被偷了)",
          "Không được dùng",
          "Chỉ dùng cho động vật"
        ],
        "correctIndex": 1,
        "explanation": "Trong câu chữ 被, tác nhân có thể được ẩn đi: 钱包被偷了."
      },
      {
        "id": "q-310-2",
        "type": "multiple-choice",
        "question": "Chuyển câu '他打破了杯子' sang câu chữ 被 đúng là:",
        "options": [
          "杯子被他打破了",
          "他被杯子打破了",
          "杯子他被打破",
          "被杯子他打破"
        ],
        "correctIndex": 0,
        "explanation": "Cấu trúc bị động: 杯子 (Vật bị vỡ) + 被他 + 打破了."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa Boss Chapter 10",
      "taskDesc": "Vượt qua thử thách câu chữ 把 và câu chữ 被 để mở khóa trận chiến ngữ pháp Boss 10!",
      "targetPhrase": "wǒ zhǎngwò le bǎ zì jù hé bèi zì jù",
      "xpReward": 60,
      "badge": "Vua Cú Pháp Tiếng Trung"
    }
  },
  {
    "id": "l-311",
    "chapterId": "ch-11",
    "levelId": "lvl-3",
    "lessonNumber": 11,
    "title": "Môi trường văn phòng & Đồng nghiệp (公司, 经理, 同事, 开会)",
    "chineseTitle": "职场环境与同事协作（开会、经理、同事）",
    "subtitle": "Kỹ năng công sở: Giám đốc (经理), đồng nghiệp (同事), họp hành (开会) và giao tiếp công việc.",
    "objective": "Giao tiếp cơ bản trong môi trường công sở tiếng Trung, sắp xếp lịch họp và trao đổi cùng đồng nghiệp.",
    "prerequisite": "Đã hoàn thành Module 3.2.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng các từ vựng công sở văn phòng.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Công sở",
      "Văn phòng",
      "经理",
      "同事",
      "开会"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Từ vựng công sở: 经理 (Jīnglǐ - Giám đốc), 同事 (Tóngshì - Đồng nghiệp), 开会 (Kāihuì - Họp)",
      "summary": "办公室 (bàngōngshì) là văn phòng làm việc. 经理 (jīnglǐ) là giám đốc/quản lý. 同事 (tóngshì) là đồng nghiệp. 开会 (kāihuì) là họp hành. 迟到 (chídào) là đi trễ.",
      "audioDemoText": "jīnglǐ ràng wǒmen xiàwǔ liǎng diǎn zài bàngōngshì kāihuì"
    },
    "step2_vocabulary": [
      {
        "id": "v-311-1",
        "hanzi": "经理",
        "pinyin": "jīnglǐ",
        "hanviet": "Kinh lý",
        "meaning": "Giám đốc, quản lý",
        "radical": "纟 (Mịch)",
        "example": {
          "hanzi": "王经理在开会。",
          "pinyin": "Wáng jīnglǐ zài kāihuì.",
          "meaning": "Giám đốc Vương đang họp."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-311-2",
        "hanzi": "同事",
        "pinyin": "tóngshì",
        "hanviet": "Đồng sự",
        "meaning": "Đồng nghiệp",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "我和同事们一起吃午饭。",
          "pinyin": "Wǒ hé tóngshìmen yìqǐ chī wǔfàn.",
          "meaning": "Tôi cùng các đồng nghiệp ăn cơm trưa."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-311-3",
        "hanzi": "开会",
        "pinyin": "kāihuì",
        "hanviet": "Khai hội",
        "meaning": "Họp, mở cuộc họp",
        "radical": "廾 (Củng)",
        "example": {
          "hanzi": "下午三点开会。",
          "pinyin": "Xiàwǔ sān diǎn kāihuì.",
          "meaning": "3 giờ chiều họp."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-311-4",
        "hanzi": "办公室",
        "pinyin": "bàngōngshì",
        "hanviet": "Biện công thất",
        "meaning": "Văn phòng làm việc",
        "radical": "力 (Lực)",
        "example": {
          "hanzi": "去办公室找我。",
          "pinyin": "Qù bàngōngshì zhǎo wǒ.",
          "meaning": "Đến văn phòng tìm tôi."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-311-5",
        "hanzi": "通知",
        "pinyin": "tōngzhī",
        "hanviet": "Thông tri",
        "meaning": "Thông báo",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "经理发通知了。",
          "pinyin": "Jīnglǐ fā tōngzhī le.",
          "meaning": "Giám đốc gửi thông báo rồi."
        },
        "pos": "Động từ / Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "同",
        "hanzi": "同",
        "pinyin": "tóng",
        "structure": {
          "code": "semi_down",
          "name": "Bán bao vi hở dưới (下三包围)",
          "symbol": "⿵"
        },
        "ids": "⿵冂一口",
        "radical": {
          "char": "口",
          "name": "Khẩu",
          "strokes": 3
        },
        "meaning": "Cùng nhau, đồng dạng",
        "strokesCount": 6,
        "strokeOrderText": "Sổ -> Ngang gập móc (冂) -> Ngang (一) -> Bộ Khẩu 口 (3 nét)",
        "components": [
          "冂",
          "一",
          "口"
        ],
        "mnemonic": "Cùng chung sống dưới một khung cửa (冂) và đồng lòng cùng một tiếng nói (一口)."
      },
      {
        "char": "经",
        "hanzi": "经",
        "pinyin": "jīng",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰纟𢀖",
        "radical": {
          "char": "纟",
          "name": "Mịch",
          "strokes": 3
        },
        "meaning": "Kinh qua, quản lý",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Mịch 纟 (3 nét) -> Chữ Kính 𢀖 (5 nét)",
        "components": [
          "纟",
          "𢀖"
        ],
        "mnemonic": "Sợi tơ dọc (纟) dệt nên khung cửi ngay ngắn làm nề nếp quản lý (经)."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc sai khiến công sở: 让 / 叫 / 请 (Bảo ai / Nhờ ai làm gì)",
      "formula": "Chủ ngữ 1 + 让 / 叫 + Người nhận lệnh + Động từ + Tân ngữ",
      "explanation": "Trong môi trường làm việc, chữ 让 được sử dụng với tần suất cực cao khi truyền đạt yêu cầu của cấp trên.",
      "examples": [
        {
          "hanzi": "经理让我通知大家下午两点半到一号会议室开会。",
          "pinyin": "Jīnglǐ ràng wǒ tōngzhī dàjiā xiàwǔ liǎng diǎn bàn dào yī hào huìyìshì kāihuì.",
          "meaning": "Giám đốc bảo tôi thông báo mọi người 2 giờ rưỡi chiều đến phòng họp số 1 để họp."
        }
      ],
      "commonMistake": {
        "wrong": "经理叫我让开会 ❌",
        "correct": "经理让我通知大家开会 ✔️",
        "explanation": "Cấu trúc sai khiến rõ ràng rành mạch."
      }
    },
    "step5_listening": {
      "situation": "Môi trường công sở, giao tiếp đồng nghiệp và thông báo họp",
      "context": "Tại khu vực hành lang văn phòng công ty trước giờ làm việc",
      "participants": "A: Vương Cương, B: Trần Lệ",
      "targetGoal": "Thành thạo các từ vựng công sở: 经理 (giám đốc), 同事 (đồng nghiệp), 开会 (họp), 办公室 (văn phòng)",
      "usageNotes": "Khi thông báo việc chính thức trong công ty, dùng cấu trúc: 经理通知大家 + Thời gian + Địa điểm + Hành động.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "陈丽，张经理今天来办公室了吗？",
          "pinyin": "Chén Lì, Zhāng jīnglǐ jīntiān lái bàngōngshì le ma?",
          "meaning": "Trần Lệ, giám đốc Trương hôm nay đã đến văn phòng chưa?"
        },
        {
          "speaker": "B",
          "hanzi": "张经理刚到。他通知所有同事下午两点到三楼会议室开会。",
          "pinyin": "Zhāng jīnglǐ gāng dào. Tā tōngzhī suǒyǒu tóngshì xiàwǔ liǎng diǎn dào sānlóu huìyìshì kāihuì.",
          "meaning": "Giám đốc Trương vừa tới. Ông ấy thông báo tất cả đồng nghiệp 2 giờ chiều lên phòng họp tầng 3 họp."
        },
        {
          "speaker": "A",
          "hanzi": "知道今天开会的主要内容是什么吗？",
          "pinyin": "Zhīdào jīntiān kāihuì de zhǔyào nèiróng shì shénme ma?",
          "meaning": "Bạn có biết nội dung chính của buổi họp hôm nay là gì không?"
        },
        {
          "speaker": "B",
          "hanzi": "讨论下个月的新产品计划，大家都要发言。",
          "pinyin": "Tǎolùn xià gè yuè de xīn chǎnpǐn jìhuà, dàjiā dōu yào fāyán.",
          "meaning": "Thảo luận kế hoạch sản phẩm mới của tháng sau, mọi người đều phải phát biểu ý kiến đấy."
        }
      ],
      "audioText": "陈丽，张经理今天来办公室了吗？张经理刚到。他通知所有同事下午两点到三楼会议室开会。知道今天开会的主要内容是什么吗？讨论下个月的新产品计划，大家都要发言。",
      "question": "Giám đốc Trương thông báo các đồng nghiệp họp vào lúc mấy giờ và ở đâu?",
      "options": [
        "8 giờ sáng tại phòng giám đốc",
        "2 giờ chiều tại phòng họp tầng 3 (下午两点在三楼会议室)",
        "9 giờ tối qua video call",
        "10 giờ trưa ở quán ăn"
      ],
      "correctIndex": 1,
      "explanation": "Trần Lệ báo tin: \"他通知所有同事下午两点到三楼会议室开会\"."
    },
    "step6_speaking": {
      "prompt": "Đọc câu thông báo giờ họp:",
      "targetSentence": "下午两点在办公室开会。",
      "targetPinyin": "Xiàwǔ liǎng diǎn zài bàngōngshì kāihuì.",
      "targetMeaning": "2 giờ chiều họp ở văn phòng.",
      "hint": "Đọc bàngōngshì kāihuì dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Giám đốc bảo tôi thông báo mọi người",
      "words": [
        "通知大家",
        "让我",
        "经理"
      ],
      "correctOrder": [
        "经理",
        "让我",
        "通知大家"
      ],
      "explanation": "经理 + 让我 + 通知大家."
    },
    "step8_quiz": [
      {
        "id": "q-311-1",
        "type": "multiple-choice",
        "question": "Từ mang nghĩa 'Đồng nghiệp' trong tiếng Trung là:",
        "options": [
          "朋友 (péngyou)",
          "同学 (tóngxué)",
          "同事 (tóngshì)",
          "邻居 (línjū)"
        ],
        "correctIndex": 2,
        "explanation": "同事 là đồng nghiệp cùng làm việc."
      },
      {
        "id": "q-311-2",
        "type": "multiple-choice",
        "question": "Trong câu '经理让我去买咖啡', từ '让' mang ý nghĩa gì?",
        "options": [
          "Nhường nhịn",
          "Bảo / Sai khiến / Yêu cầu",
          "Ngăn cản",
          "Mời chào"
        ],
        "correctIndex": 1,
        "explanation": "让 là động từ sai khiến (bảo làm gì)."
      }
    ],
    "step9_challenge": {
      "title": "Tác phong chuyên nghiệp",
      "taskDesc": "Đọc to câu: 'Giám đốc đã thông báo chiều nay 2 giờ họp ở phòng họp lớn'.",
      "targetPhrase": "jīnglǐ tōngzhī xiàwǔ liǎng diǎn kāihuì",
      "xpReward": 50,
      "badge": "Nhân Viên Xuất Sắc"
    }
  },
  {
    "id": "l-312",
    "chapterId": "ch-11",
    "levelId": "lvl-3",
    "lessonNumber": 12,
    "title": "Giải quyết vấn đề & Kế hoạch làm việc (解决, 问题, 认真, 完成)",
    "chineseTitle": "任务执行与工作计划（认真解决与按时完成）",
    "subtitle": "Kỹ năng hoàn thành nhiệm vụ: Thái độ nghiêm túc (认真), lập kế hoạch (计划), giải quyết (解决) và hoàn thành (完成).",
    "objective": "Trình bày kế hoạch làm việc, báo cáo hoàn thành nhiệm vụ đúng thời hạn.",
    "prerequisite": "Đã hoàn thành Bài 311.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng các từ vựng công việc.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Kế hoạch",
      "Giải quyết vấn đề",
      "认真",
      "完成"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Từ vựng hành động công việc: 计划 (Jìhuà), 完成 (Wánchéng), 解决 (Jiějué), 认真 (Rènzhēn)",
      "summary": "认真 (rènzhēn) là chăm chỉ, nghiêm túc. 完成 (wánchéng) là hoàn thành. 解决问题 (jiějué wèntí) là giải quyết vấn đề. 按时 (ànshí) là đúng giờ.",
      "audioDemoText": "wǒmen yào rènzhēn gōngzuò, ànshí wánchéng jìhuà, jiějué zhè ge wèntí"
    },
    "step2_vocabulary": [
      {
        "id": "v-312-1",
        "hanzi": "认真",
        "pinyin": "rènzhēn",
        "hanviet": "Nhận chân",
        "meaning": "Chăm chỉ, nghiêm túc",
        "radical": "讠 (Ngôn)",
        "example": {
          "hanzi": "认真学习。",
          "pinyin": "Rènzhēn xuéxí.",
          "meaning": "Chăm chỉ học tập."
        },
        "pos": "Tính từ / Phó từ"
      },
      {
        "id": "v-312-2",
        "hanzi": "完成",
        "pinyin": "wánchéng",
        "hanviet": "Hoàn thành",
        "meaning": "Hoàn thành",
        "radical": "宀 (Miên)",
        "example": {
          "hanzi": "按时完成任务。",
          "pinyin": "Ànshí wánchéng rènwu.",
          "meaning": "Hoàn thành nhiệm vụ đúng hạn."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-312-3",
        "hanzi": "计划",
        "pinyin": "jìhuà",
        "hanviet": "Kế hoạch",
        "meaning": "Kế hoạch, dự định",
        "radical": "讠 (Ngôn)",
        "example": {
          "hanzi": "下个月的工作计划。",
          "pinyin": "Xià gè yuè de gōngzuò jìhuà.",
          "meaning": "Kế hoạch làm việc tháng tới."
        },
        "pos": "Danh từ / Động từ"
      },
      {
        "id": "v-312-4",
        "hanzi": "按时",
        "pinyin": "ànshí",
        "hanviet": "Án thời",
        "meaning": "Đúng giờ, đúng hẹn",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "按时上班。",
          "pinyin": "Ànshí shàngbān.",
          "meaning": "Đi làm đúng giờ."
        },
        "pos": "Phó từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "认",
        "hanzi": "认",
        "pinyin": "rèn",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰讠人",
        "radical": {
          "char": "讠",
          "name": "Ngôn",
          "strokes": 2
        },
        "meaning": "Nhận biết, công nhận",
        "strokesCount": 4,
        "strokeOrderText": "Chấm -> Ngang gập hất (讠) -> Phẩy -> Mác (人)",
        "components": [
          "讠",
          "人"
        ],
        "mnemonic": "Dùng lời nói (讠) để nhận diện và xác nhận con người (人)."
      },
      {
        "char": "成",
        "hanzi": "成",
        "pinyin": "chéng",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "成",
        "radical": {
          "char": "戈",
          "name": "Qua",
          "strokes": 4
        },
        "meaning": "Thành công, hoàn thành",
        "strokesCount": 6,
        "strokeOrderText": "Ngang -> Phẩy -> Cong móc -> Ngang gập móc -> Phẩy -> Chấm",
        "components": [
          "成"
        ],
        "mnemonic": "Vũ khí (戈) hoàn tất việc phòng thủ mang lại hòa bình và thành công."
      }
    ],
    "step4_grammar": {
      "title": "Phó từ cách thức đứng trước động từ: 认真 + 地 + Động từ (Làm việc chăm chỉ)",
      "formula": "认真 + 地 + 工作 (Làm việc nghiêm túc) / 学习 (Học tập chăm chỉ)",
      "explanation": "Từ 认真 khi làm trạng ngữ biểu thị thái độ tận tụy, tỉ mỉ khi thực hiện một hành động.",
      "examples": [
        {
          "hanzi": "只要我们认真准备，就一定能按时完成工作。",
          "pinyin": "Zhǐyào wǒmen rènzhēn zhǔnbèi, jiù yídìng néng ànshí wánchéng gōngzuò.",
          "meaning": "Chỉ cần chúng ta chuẩn bị nghiêm túc, thì nhất định có thể hoàn thành công việc đúng hạn."
        }
      ],
      "commonMistake": {
        "wrong": "工作认真地 ❌",
        "correct": "认真地工作 ✔️",
        "explanation": "Trạng ngữ cách thức đứng trước động từ."
      }
    },
    "step5_listening": {
      "situation": "Thảo luận kế hoạch công tác và thái độ làm việc nghiêm túc",
      "context": "Phòng họp dự án khi chuẩn bị chạy chiến dịch mới",
      "participants": "A: Trưởng nhóm dự án, B: Thành viên nhóm",
      "targetGoal": "Vận dụng các từ vựng công việc: 认真 (nghiêm túc), 完成 (hoàn thành), 计划 (kế hoạch), 按时 (đúng hạn)",
      "usageNotes": "按时 hoàn thành công việc (按时完成) là tiêu chuẩn trách nhiệm cốt lõi trong môi trường chuyên nghiệp.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "这个月的项目计划大家都看明白了吗？",
          "pinyin": "Zhè gè yuè de xiàngmù jìhuà dàjiā dōu kàn míngbai le ma?",
          "meaning": "Kế hoạch dự án của tháng này mọi người đều xem hiểu rõ ràng rồi chứ?"
        },
        {
          "speaker": "B",
          "hanzi": "看明白了。这次任务时间很紧，我们必须认真对待。",
          "pinyin": "Kàn míngbai le. Zhè cì rènwu shíjiān hěn jǐn, wǒmen bìxū rènzhēn duìdài.",
          "meaning": "Xem hiểu rồi ạ. Lần này nhiệm vụ thời gian rất gấp, chúng ta bắt buộc phải nghiêm túc đối đãi."
        },
        {
          "speaker": "A",
          "hanzi": "你们组负责的部分，能按时完成吗？",
          "pinyin": "Nǐmen zǔ fùzé de bùfen, néng ànshí wánchéng ma?",
          "meaning": "Phần do nhóm các bạn phụ trách, có thể hoàn thành đúng hạn không?"
        },
        {
          "speaker": "B",
          "hanzi": "请组长放心，我们一定会按时保质完成任务！",
          "pinyin": "Qǐng zǔzhǎng fàngxīn, wǒmen yídìng huì ànshí bǎozhì wánchéng rènwu!",
          "meaning": "Xin tổ trưởng yên tâm, chúng tôi nhất định sẽ hoàn thành nhiệm vụ đúng hạn đảm bảo chất lượng!"
        }
      ],
      "audioText": "这个月的项目计划大家都看明白了吗？看明白了。这次任务时间很紧，我们必须认真对待。你们组负责的部分，能按时完成吗？请组长放心，我们一定会按时保质完成任务！",
      "question": "Thái độ của các thành viên trong nhóm đối với dự án lần này như thế nào?",
      "options": [
        "Làm qua loa đại khái",
        "Bỏ dở giữa chừng",
        "Nghiêm túc đối đãi và quyết tâm hoàn thành đúng hạn (认真对待，按时完成)",
        "Xin gia hạn thêm 3 tháng"
      ],
      "correctIndex": 2,
      "explanation": "Thành viên khẳng định: \"我们必须认真对待... 我们一定会按时保质完成任务\"."
    },
    "step6_speaking": {
      "prompt": "Khẳng định tinh thần trách nhiệm công việc:",
      "targetSentence": "我们一定能按时完成。",
      "targetPinyin": "Wǒmen yídìng néng ànshí wánchéng.",
      "targetMeaning": "Chúng tôi nhất định có thể hoàn thành đúng hạn.",
      "hint": "Đọc ànshí wánchéng dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Nghiêm túc giải quyết vấn đề",
      "words": [
        "解决问题",
        "认真"
      ],
      "correctOrder": [
        "认真",
        "解决问题"
      ],
      "explanation": "认真 + 解决问题."
    },
    "step8_quiz": [
      {
        "id": "q-312-1",
        "type": "multiple-choice",
        "question": "Từ mang nghĩa 'Nghiêm túc, chăm chỉ' trong tiếng Trung là:",
        "options": [
          "热情 (rèqíng)",
          "聪明 (cōngming)",
          "认真 (rènzhēn)",
          "努力 (nǔlì)"
        ],
        "correctIndex": 2,
        "explanation": "认真 là nghiêm túc, chăm chỉ."
      },
      {
        "id": "q-312-2",
        "type": "multiple-choice",
        "question": "Cụm '按时' (ànshí) mang nghĩa là gì?",
        "options": [
          "Muộn giờ",
          "Đúng giờ / Đúng hạn",
          "Thỉnh thoảng",
          "Bất cứ lúc nào"
        ],
        "correctIndex": 1,
        "explanation": "按时 là đúng giờ, đúng hạn định."
      }
    ],
    "step9_challenge": {
      "title": "Lời hứa tiến độ",
      "taskDesc": "Đọc to câu: 'Tôi sẽ làm việc nghiêm túc và giải quyết vấn đề này đúng giờ'.",
      "targetPhrase": "wǒ yídìng rènzhēn jiějué zhè ge wèntí",
      "xpReward": 50,
      "badge": "Nhà Quản Trị Dự Án"
    }
  },
  {
    "id": "l-313",
    "chapterId": "ch-11",
    "levelId": "lvl-3",
    "lessonNumber": 13,
    "title": "Môi trường đại học, thi cử & Điểm số (大学, 考试, 成绩, 努力)",
    "chineseTitle": "高校学习与学业成绩（大学、考试、努力）",
    "subtitle": "Kỹ năng học tập học đường: Đại học (大学), thi cử (考试), nỗ lực (努力) và điểm số thành tích (成绩).",
    "objective": "Trao đổi về môi trường học tập, thảo luận điểm số và chia sẻ mục tiêu học vấn.",
    "prerequisite": "Đã hoàn thành Bài 312.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng câu chia sẻ nỗ lực học tập.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Trường học",
      "Thi cử",
      "成绩",
      "努力",
      "大学"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Từ vựng học đường: 大学 (Dàxué - Đại học), 成绩 (Chéngjì - Điểm số), 努力 (Nǔlì - Nỗ lực)",
      "summary": "大学 (dàxué) là trường đại học. 考试 (kǎoshì) là thi cử. 努力 (nǔlì) là nỗ lực, cố gắng. 提高 (tígāo) là nâng cao. 复习 (fùxí) là ôn tập.",
      "audioDemoText": "zhǐyào nǔlì xuéxí, chéngjì jiù huì tígāo, kǎoshì méi wèntí"
    },
    "step2_vocabulary": [
      {
        "id": "v-313-1",
        "hanzi": "大学",
        "pinyin": "dàxué",
        "hanviet": "Đại học",
        "meaning": "Trường đại học",
        "radical": "大 (Đại)",
        "example": {
          "hanzi": "他在北京大学读书。",
          "pinyin": "Tā zài Běijīng Dàxué dúshū.",
          "meaning": "Anh ấy học ở Đại học Bắc Kinh."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-313-2",
        "hanzi": "成绩",
        "pinyin": "chéngjì",
        "hanviet": "Thành tích",
        "meaning": "Thành tích, điểm số",
        "radical": "戈 (Qua)",
        "example": {
          "hanzi": "期末考试成绩很好。",
          "pinyin": "Qīmò kǎoshì chéngjì hěn hǎo.",
          "meaning": "Điểm thi cuối kỳ rất tốt."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-313-3",
        "hanzi": "努力",
        "pinyin": "nǔlì",
        "hanviet": "Nỗ lực",
        "meaning": "Nỗ lực, cố gắng",
        "radical": "力 (Lực)",
        "example": {
          "hanzi": "努力学好汉语。",
          "pinyin": "Nǔlì xué hǎo Hànyǔ.",
          "meaning": "Cố gắng học giỏi tiếng Trung."
        },
        "pos": "Tính từ / Động từ"
      },
      {
        "id": "v-313-4",
        "hanzi": "提高",
        "pinyin": "tígāo",
        "hanviet": "Đề cao",
        "meaning": "Nâng cao, cải thiện",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "提高听力水平。",
          "pinyin": "Tígāo tīnglì shuǐpíng.",
          "meaning": "Nâng cao trình độ nghe."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-313-5",
        "hanzi": "复习",
        "pinyin": "fùxí",
        "hanviet": "Phục tập",
        "meaning": " n tập, xem lại bài",
        "radical": "羽 (Vũ)",
        "example": {
          "hanzi": "复习旧课。",
          "pinyin": "Fùxí jiù kè.",
          "meaning": " n tập bài cũ."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "努",
        "hanzi": "努",
        "pinyin": "nǔ",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱奴力",
        "radical": {
          "char": "力",
          "name": "Lực",
          "strokes": 2
        },
        "meaning": "Cố gắng, nỗ lực",
        "strokesCount": 7,
        "strokeOrderText": "Chữ Nô 奴 (5 nét) -> Bộ Lực 力 (2 nét)",
        "components": [
          "奴",
          "力"
        ],
        "mnemonic": "Dốc hết toàn bộ sức lực (力) phấn đấu vượt lên số phận."
      },
      {
        "char": "提",
        "hanzi": "提",
        "pinyin": "tí",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰扌是",
        "radical": {
          "char": "扌",
          "name": "Thủ",
          "strokes": 3
        },
        "meaning": "Nâng lên, đề đạt",
        "strokesCount": 12,
        "strokeOrderText": "Bộ Thủ 扌 (3 nét) -> Chữ Thị 是 (9 nét)",
        "components": [
          "扌",
          "是"
        ],
        "mnemonic": "Bàn tay (扌) giơ cao điều đúng đắn (是) để nâng tầm và đề xuất ý kiến."
      }
    ],
    "step4_grammar": {
      "title": "Cặp liên từ điều kiện duy nhất: 只要...就... (Chỉ cần...thì...)",
      "formula": "只要 + Điều kiện, 就 + Kết quả tất yếu",
      "explanation": "Biểu thị chỉ cần đáp ứng một điều kiện nhất định là sẽ đạt được kết quả mong muốn.",
      "examples": [
        {
          "hanzi": "只要每天坚持努力复习，汉语水平就一定能提高。",
          "pinyin": "Zhǐyào měitiān jiānchí nǔlì fùxí, Hànyǔ shuǐpíng jiù yídìng néng tígāo.",
          "meaning": "Chỉ cần mỗi ngày kiên trì nỗ lực ôn tập, thì trình độ tiếng Trung nhất định sẽ nâng cao."
        }
      ],
      "commonMistake": {
        "wrong": "只要努力才能 ❌",
        "correct": "只要努力就 ✔️",
        "explanation": "只要 luôn đi đôi với 就 (Chỉ 只有 mới đi với 才)."
      }
    },
    "step5_listening": {
      "situation": "Trao đổi về thành tích học tập và sự nỗ lực ở trường đại học",
      "context": "Sau khi có kết quả bảng điểm học kỳ tại trường đại học",
      "participants": "A: Bạn học cùng lớp, B: Sinh viên nhận học bổng",
      "targetGoal": "Thành thạo các từ vựng học đường: 大学 (đại học), 成绩 (thành tích), 努力 (nỗ lực), 提高 (nâng cao)",
      "usageNotes": "Thành ngữ dân gian: 一分耕耘，一分收获 (Có công mài sắt có ngày nên kim). Nỗ lực học tập: 努力复习提高成绩.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "小华，听说你这次期末考试成绩又是全班第一名！",
          "pinyin": "Xiǎohuá, tīngshuō nǐ zhè cì qīmò kǎoshì chéngjì yòu shì quánbān dì-yī míng!",
          "meaning": "Tiểu Hoa, nghe nói kỳ thi cuối kỳ này điểm số của bạn lại đứng nhất lớp đấy!"
        },
        {
          "speaker": "B",
          "hanzi": "谢谢！这学期我每天都在图书馆努力复习，才有了进步。",
          "pinyin": "Xièxie! Zhè xuéqī wǒ měitiān dōu zài túshūguǎn nǔlì fùxí, cái yǒu le jìnbù.",
          "meaning": "Cảm ơn bạn! Kỳ này ngày nào mình cũng ở thư viện nỗ lực ôn bài nên mới có tiến bộ."
        },
        {
          "speaker": "A",
          "hanzi": "你的听力和口语是怎么提高得这么快的？",
          "pinyin": "Nǐ de tīnglì hé kǒuyǔ shì zěnme tígāo de zhème kuài de?",
          "meaning": "Kỹ năng nghe và nói của bạn làm sao nâng cao được nhanh như vậy?"
        },
        {
          "speaker": "B",
          "hanzi": "多跟中国留学生交流，不懂的语法及时请教老师。",
          "pinyin": "Duō gēn Zhōngguó liúxuéshēng jiāoliú, bù dǒng de yǔfǎ jíshí qǐngjiào lǎoshī.",
          "meaning": "Chăm chỉ giao lưu với du học sinh Trung Quốc, ngữ pháp nào không hiểu thì kịp thời thỉnh giáo thầy cô."
        }
      ],
      "audioText": "小华，听说你这次期末考试成绩又是全班第一名！谢谢！这学期我每天都在图书馆努力复习，才有了进步。你的听力和口语是怎么提高得这么快的？多跟中国留学生交流，不懂的语法及时请教老师。",
      "question": "Bí quyết giúp bạn B nâng cao nhanh chóng kỹ năng nghe nói là gì?",
      "options": [
        "Chỉ ở nhà tự học một mình",
        "Chăm giao lưu với du học sinh và kịp thời hỏi thầy cô khi chưa hiểu (多交流，及时请教)",
        "Học thuộc lòng từ điển",
        "Không cần ôn tập"
      ],
      "correctIndex": 1,
      "explanation": "Bạn B chia sẻ: \"多跟中国留学生交流，不懂的语法及时请教老师\"."
    },
    "step6_speaking": {
      "prompt": "Khẳng định tinh thần nỗ lực học tập:",
      "targetSentence": "只要努力，成绩就会提高。",
      "targetPinyin": "Zhǐyào nǔlì, chéngjì jiù huì tígāo.",
      "targetMeaning": "Chỉ cần nỗ lực, điểm số sẽ nâng cao.",
      "hint": "Đọc zhǐyào nǔlì rõ ràng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Nâng cao trình độ tiếng Trung",
      "words": [
        "汉语水平",
        "提高"
      ],
      "correctOrder": [
        "提高",
        "汉语水平"
      ],
      "explanation": "提高 + 汉语水平."
    },
    "step8_quiz": [
      {
        "id": "q-313-1",
        "type": "multiple-choice",
        "question": "Điền từ thích hợp vào chỗ trống: 只要认真学习，___ 能考出好成绩。",
        "options": [
          "就 (jiù)",
          "才 (cái)",
          "但 (dàn)",
          "也 (yě)"
        ],
        "correctIndex": 0,
        "explanation": "Cặp liên từ cố định: 只要...就..."
      },
      {
        "id": "q-313-2",
        "type": "multiple-choice",
        "question": "Từ '复习' (fùxí) mang ý nghĩa là gì?",
        "options": [
          "Học bài mới",
          "Ôn tập / Xem lại bài",
          "Thi cử",
          "Nghỉ học"
        ],
        "correctIndex": 1,
        "explanation": "复习 là ôn tập bài học."
      }
    ],
    "step9_challenge": {
      "title": "Khát vọng thủ khoa",
      "taskDesc": "Đọc to câu: 'Tôi đang nỗ lực ôn tập mỗi ngày để đạt điểm cao trong kỳ thi HSK 3'.",
      "targetPhrase": "wǒ měitiān nǔlì fùxí kǎo hsk sān jí",
      "xpReward": 50,
      "badge": "Học Bá Siêu Đẳng"
    }
  },
  {
    "id": "l-314",
    "chapterId": "ch-11",
    "levelId": "lvl-3",
    "lessonNumber": 14,
    "title": "Cảm xúc, tính cách & Mối quan hệ (难过, 生气, 聪明, 热情)",
    "chineseTitle": "情绪表达与性格描摹（热情、聪明、难过、生气）",
    "subtitle": "Miêu tả cảm xúc con người: Buồn (难过), tức giận (生气), thông minh (聪明), nhiệt tình (热情).",
    "objective": "Bộc lộ trạng thái cảm xúc cá nhân và nhận xét tính cách của người khác một cách tế nhị.",
    "prerequisite": "Đã hoàn thành Bài 313.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng các tính từ tính cách, cảm xúc.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Cảm xúc",
      "Tính cách",
      "热情",
      "生气",
      "聪明"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Từ vựng tính cách & Cảm xúc: 热情 (Rèqíng - Nhiệt tình), 聪明 (Cōngming - Thông minh)",
      "summary": "难过 (nánguò) là đau lòng, buồn bã. 生气 (shēngqì) là tức giận. 热情 (rèqíng) là niềm nở, nhiệt tình. 聪明 (cōngming) là thông minh, nhanh nhạy.",
      "audioDemoText": "tā duì rén hěn rèqíng, tā yòu cōngming yòu nǔlì, bié shēngqì le"
    },
    "step2_vocabulary": [
      {
        "id": "v-314-1",
        "hanzi": "难过",
        "pinyin": "nánguò",
        "hanviet": "Nan quá",
        "meaning": "Buồn bã, đau lòng",
        "radical": "隹 (Chuy)",
        "example": {
          "hanzi": "别难过了。",
          "pinyin": "Bié nánguò le.",
          "meaning": "Đừng buồn nữa nhé."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-314-2",
        "hanzi": "生气",
        "pinyin": "shēngqì",
        "hanviet": "Sinh khí",
        "meaning": "Tức giận, giận hờn",
        "radical": "生 (Sinh)",
        "example": {
          "hanzi": "他生我的气了。",
          "pinyin": "Tā shēng wǒ de qì le.",
          "meaning": "Anh ấy giận tôi rồi."
        },
        "pos": "Cụm động từ / Tính từ"
      },
      {
        "id": "v-314-3",
        "hanzi": "聪明",
        "pinyin": "cōngming",
        "hanviet": "Thông minh",
        "meaning": "Thông minh, sáng dạ",
        "radical": "耳 (Nhĩ)",
        "example": {
          "hanzi": "这个孩子真聪明。",
          "pinyin": "Zhè ge háizi zhēn cōngming.",
          "meaning": "Đứa bé này thật thông minh."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-314-4",
        "hanzi": "热情",
        "pinyin": "rèqíng",
        "hanviet": "Nhiệt tình",
        "meaning": "Nhiệt tình, niềm nở",
        "radical": "灬 (Hỏa)",
        "example": {
          "hanzi": "中国人很热情。",
          "pinyin": "Zhōngguórén hěn rèqíng.",
          "meaning": "Người Trung Quốc rất nhiệt tình."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-314-5",
        "hanzi": "满意",
        "pinyin": "mǎnyì",
        "hanviet": "Mãn ý",
        "meaning": "Hài lòng",
        "radical": "氵 (Thủy)",
        "example": {
          "hanzi": "我很满意。",
          "pinyin": "Wǒ hěn mǎnyì.",
          "meaning": "Tôi rất hài lòng."
        },
        "pos": "Tính từ / Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "聪",
        "hanzi": "聪",
        "pinyin": "cōng",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰耳总",
        "radical": {
          "char": "耳",
          "name": "Nhĩ",
          "strokes": 6
        },
        "meaning": "Thông minh, sáng dạ",
        "strokesCount": 15,
        "strokeOrderText": "Bộ Nhĩ 耳 (6 nét) -> Chữ Tổng 总 (9 nét)",
        "components": [
          "耳",
          "总"
        ],
        "mnemonic": "Đôi tai (耳) biết lắng nghe và tổng hợp (总) mọi điều là người thông minh."
      },
      {
        "char": "情",
        "hanzi": "情",
        "pinyin": "qíng",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰忄青",
        "radical": {
          "char": "忄",
          "name": "Tâm",
          "strokes": 3
        },
        "meaning": "Tình cảm, nhiệt tình",
        "strokesCount": 11,
        "strokeOrderText": "Bộ Tâm 忄 (3 nét) -> Bộ Thanh 青 (8 nét)",
        "components": [
          "忄",
          "青"
        ],
        "mnemonic": "Trái tim (忄) luôn nồng nhiệt và trong sáng như màu trời xanh (青)."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc song hành phẩm chất: 又...又... (Vừa...lại vừa...)",
      "formula": "Chủ ngữ + 又 + Tính từ 1 + 又 + Tính từ 2",
      "explanation": "Biểu thị hai đặc điểm phẩm chất cùng tồn tại đồng thời trên một người hoặc sự vật (hai tính từ cùng tích cực hoặc cùng tiêu cực).",
      "examples": [
        {
          "hanzi": "李老师又聪明又热情，大家都喜欢他。",
          "pinyin": "Lǐ lǎoshī yòu cōngming yòu rèqíng, dàjiā dōu xǐhuan tā.",
          "meaning": "Thầy Lý vừa thông minh lại vừa nhiệt tình, mọi người đều yêu mến thầy."
        }
      ],
      "commonMistake": {
        "wrong": "又聪明又贵 ❌ (vừa tích cực vừa tiêu cực)",
        "correct": "Hai tính từ phải cùng hướng phẩm chất.",
        "explanation": "Quy tắc ngữ nghĩa của 又...又..."
      }
    },
    "step5_listening": {
      "situation": "Thấu hiểu cảm xúc, tính cách và an ủi bạn bè",
      "context": "Quán trà chiều khi an ủi một người bạn vừa gặp chuyện không vui",
      "participants": "A: Người bạn thấu cảm, B: Người bạn buồn bã",
      "targetGoal": "Biểu đạt cảm xúc và tính cách: 难过 (buồn), 生气 (tức giận), 聪明 (thông minh), 热情 (nhiệt tình), 满意 (hài lòng)",
      "usageNotes": "Khi an ủi người khác dùng: 别难过了 (đừng buồn nữa), 别生气了 (đừng giận nữa).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你看上去有点儿难过，怎么了？生谁的气呢？",
          "pinyin": "Nǐ kàn shàngqu yǒudiǎnr nánguò, zěnme le? Shēng shuí de qì ne?",
          "meaning": "Nhìn bạn có vẻ hơi buồn, làm sao thế? Đang giận ai vậy?"
        },
        {
          "speaker": "B",
          "hanzi": "今天面试的时候我太紧张了，面试官对我的回答不太满意。",
          "pinyin": "Jīntiān miànshì de shíhou wǒ tài jǐnzhāng le, miànshìguān duì wǒ de huídá bú tài mǎnyì.",
          "meaning": "Hôm nay lúc phỏng vấn mình căng thẳng quá, người phỏng vấn không hài lòng lắm với câu trả lời của mình."
        },
        {
          "speaker": "A",
          "hanzi": "别难过了！你平时那么聪明热情，下一次一定会发挥得更好。",
          "pinyin": "Bié nánguò le! Nǐ píngshí nàme cōngming rèqíng, xià yí cì yídìng huì fāhuī de gèng hǎo.",
          "meaning": "Đừng buồn nữa! Bình thường bạn thông minh nhiệt tình như thế, lần sau nhất định sẽ thể hiện tốt hơn."
        },
        {
          "speaker": "B",
          "hanzi": "谢谢你的鼓励，听你这么说，我心里舒服多了。",
          "pinyin": "Xièxie nǐ de gǔlì, tīng nǐ zhème shuō, wǒ xīnlǐ shūfu duō le.",
          "meaning": "Cảm ơn lời động viên của bạn, nghe bạn nói vậy lòng mình dễ chịu hơn nhiều rồi."
        }
      ],
      "audioText": "你看上去有点儿难过，怎么了？生谁的气呢？今天面试的时候我太紧张了，面试官对我的回答不太满意。别难过了！你平时那么聪明热情，下一次一定会发挥得更好。谢谢你的鼓励，听你这么说，我心里舒服多了。",
      "question": "Vì sao người bạn B lại cảm thấy buồn bã?",
      "options": [
        "Vì bị mất điện thoại",
        "Vì buổi phỏng vấn quá căng thẳng và người phỏng vấn chưa hài lòng (面试太紧张，不太满意)",
        "Vì bị cảm cúm",
        "Vì cãi nhau với người yêu"
      ],
      "correctIndex": 1,
      "explanation": "Bạn B tâm sự: \"今天面试的时候我太紧张了，面试官对我的回答不太满意\"."
    },
    "step6_speaking": {
      "prompt": "Đọc câu khen ngợi: Vừa thông minh vừa nhiệt tình:",
      "targetSentence": "他又聪明又热情。",
      "targetPinyin": "Tā yòu cōngming yòu rèqíng.",
      "targetMeaning": "Anh ấy vừa thông minh lại vừa nhiệt tình.",
      "hint": "Đọc mượt mà yòu cōngming yòu rèqíng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Xin bạn đừng giận nữa nhé",
      "words": [
        "生气了",
        "别",
        "请你"
      ],
      "correctOrder": [
        "请你",
        "别",
        "生气了"
      ],
      "explanation": "请你 + 别 + 生气了."
    },
    "step8_quiz": [
      {
        "id": "q-314-1",
        "type": "multiple-choice",
        "question": "Từ mang nghĩa 'Nhiệt tình, niềm nở' trong tiếng Trung là:",
        "options": [
          "生气 (shēngqì)",
          "难过 (nánguò)",
          "热情 (rèqíng)",
          "聪明 (cōngming)"
        ],
        "correctIndex": 2,
        "explanation": "热情 là nhiệt tình, hiếu khách."
      },
      {
        "id": "q-314-2",
        "type": "multiple-choice",
        "question": "Cấu trúc '又...又...' dùng để làm gì?",
        "options": [
          "So sánh hơn kém",
          "Biểu thị hai đặc điểm phẩm chất đồng thời (Vừa...lại vừa...)",
          "Nguyên nhân kết quả",
          "Câu hỏi lựa chọn"
        ],
        "correctIndex": 1,
        "explanation": "又...又... biểu thị hai phẩm chất song hành."
      }
    ],
    "step9_challenge": {
      "title": "Lan tỏa năng lượng tích cực",
      "taskDesc": "Đọc to câu: 'Xin đừng buồn nữa, mọi người đều rất nhiệt tình giúp đỡ bạn'.",
      "targetPhrase": "bié nánguò le dàjiā dōu hěn rèqíng",
      "xpReward": 50,
      "badge": "Sứ Giả Yêu Thương"
    }
  },
  {
    "id": "l-315",
    "chapterId": "ch-11",
    "levelId": "lvl-3",
    "lessonNumber": 15,
    "title": "Phân biệt triệt để 3 trợ từ kết cấu 的, 地, 得 (3 chữ Đích)",
    "chineseTitle": "结构助词“的、地、得”的终极区分与实战应用",
    "subtitle": "Giải quyết dứt điểm nỗi ám ảnh lớn nhất của người học: 白勺的 (Định ngữ), 土也地 (Trạng ngữ), 双人得 (Bổ ngữ).",
    "objective": "Phân biệt chính xác 100% cách dùng của 3 chữ 的, 地, 得 trong mọi kỳ thi và viết lách.",
    "prerequisite": "Đã hoàn thành Bài 314.",
    "completionCriteria": "Đạt >= 80% trắc nghiệm phân biệt 3 chữ 的, 地, 得.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "3 chữ Đích",
      "的",
      "地",
      "得",
      "Ngữ pháp kinh điển"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Tam giác vàng 3 chữ Đích: 的 (de) vs 地 (de) vs 得 (de)",
      "summary": "1. 的 (Bạch chước đích): Đứng trước DANH TỪ (漂亮的花, 我的书). 2. 地 (Thổ dã địa): Đứng trước ĐỘNG TỪ (认真地学习, 高兴地说). 3. 得 (Song nhân đắc): Đứng sau ĐỘNG TỪ/TÍNH TỪ chỉ mức độ (跑得快, 说得好).",
      "audioDemoText": "piàoliang de yīfu, rènzhēn de xuéxí, pǎo de hěn kuài"
    },
    "step2_vocabulary": [
      {
        "id": "v-315-1",
        "hanzi": "跑得快",
        "pinyin": "pǎo de kuài",
        "hanviet": "Bào đắc khoái",
        "meaning": "Chạy rất nhanh",
        "radical": "足 (Túc)",
        "example": {
          "hanzi": "他跑得真快！",
          "pinyin": "Tā pǎo de zhēn kuài!",
          "meaning": "Anh ấy chạy thật nhanh!"
        },
        "pos": "Cụm bổ ngữ trình độ"
      },
      {
        "id": "v-315-2",
        "hanzi": "高兴地说",
        "pinyin": "gāoxìng de shuō",
        "hanviet": "Cao hưng địa thuyết",
        "meaning": "Vui vẻ nói",
        "radical": "高 (Cao)",
        "example": {
          "hanzi": "他高兴地笑了。",
          "pinyin": "Tā gāoxìng de xiào le.",
          "meaning": "Anh ấy vui mừng cười tươi."
        },
        "pos": "Cụm trạng ngữ"
      },
      {
        "id": "v-315-3",
        "hanzi": "美丽的花",
        "pinyin": "měilì de huā",
        "hanviet": "Mỹ lệ đích hoa",
        "meaning": "Bông hoa xinh đẹp",
        "radical": "羊 (Dương)",
        "example": {
          "hanzi": "红色的美丽的花。",
          "pinyin": "Hóngsè de měilì de huā.",
          "meaning": "Bông hoa màu đỏ xinh đẹp."
        },
        "pos": "Cụm định trung"
      }
    ],
    "step3_hanzi": [
      {
        "char": "地",
        "hanzi": "地",
        "pinyin": "de",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰土也",
        "radical": {
          "char": "土",
          "name": "Thổ",
          "strokes": 3
        },
        "meaning": "Đất, trợ từ trạng thái",
        "strokesCount": 6,
        "strokeOrderText": "Ngang -> Sổ -> Hất (土) -> Ngang gập cong móc -> Sổ -> Sổ cong móc (也)",
        "components": [
          "土",
          "也"
        ],
        "mnemonic": "Mảnh đất (土) vững chãi (也) nâng đỡ cho mọi bước chân hành động."
      },
      {
        "char": "花",
        "hanzi": "花",
        "pinyin": "huā",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱艹化",
        "radical": {
          "char": "艹",
          "name": "Thảo",
          "strokes": 3
        },
        "meaning": "Bông hoa, hoa lệ",
        "strokesCount": 7,
        "strokeOrderText": "Ngang -> Sổ -> Sổ (艹) -> Phẩy -> Sổ -> Phẩy -> Sổ cong móc (化)",
        "components": [
          "艹",
          "化"
        ],
        "mnemonic": "Mầm cây cỏ (艹) biến hóa (化) nở rộ thành đóa hoa rực rỡ."
      }
    ],
    "step4_grammar": {
      "title": "Bí kíp thần chú phân biệt 3 chữ 的, 地, 得 trong 3 giây",
      "formula": "Tính từ + 的 + DANH TỪ  |  Tính từ + 地 + ĐỘNG TỪ  |  ĐỘNG TỪ + 得 + TÍNH TỪ/MỨC ĐỘ",
      "explanation": "Ghi nhớ thần chú: Sau 的 là Danh từ; Sau 地 là Động từ; Trước 得 là Động từ. Nhớ thần chú này bạn sẽ không bao giờ mắc lỗi.",
      "examples": [
        {
          "hanzi": "美丽的花儿（的 + Danh từ） / 认真地写作业（地 + Động từ） / 汉语说得很好（Động từ + 得 + Mức độ）",
          "pinyin": "Měilì de huār, rènzhēn de xiě zuòyè, Hànyǔ shuō de hěn hǎo.",
          "meaning": "Ba vị trí chuẩn xác của 3 chữ Đích."
        }
      ],
      "commonMistake": {
        "wrong": "跑的快 ❌ / 说地好 ❌",
        "correct": "跑得快 ✔️ / 说得好 ✔️",
        "explanation": "Động từ đi trước mức độ bắt buộc dùng 双人得 (得)."
      }
    },
    "step5_listening": {
      "situation": "Phân biệt thực chiến 3 trợ từ kết cấu 的, 地, 得 (3 chữ Đích)",
      "context": "Tại lớp học ngữ pháp nâng cao khi giáo viên chữa bài luận",
      "participants": "A: Giáo viên Hán ngữ, B: Học sinh",
      "targetGoal": "Nắm vững quy tắc vàng phân biệt: 的 (+ Danh từ), 地 (+ Động từ), 得 (sau Động từ/Tính từ)",
      "usageNotes": "Bí quyết ghi nhớ cho người Việt: \"Bạch thược ĐÍCH (的) đứng trước danh từ; Thổ dã ĐỊA (地) đứng trước động từ; Song nhân ĐẮC (得) đứng sau động từ\".",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "同学们，请注意句子中的三个“de”用法是完全不同的。",
          "pinyin": "Tóngxuémen, qǐng zhùyì jùzi zhōng de sān gè “de” yòngfǎ shì wánquán bùtóng de.",
          "meaning": "Các em chú ý, cách dùng của 3 chữ \"de\" trong câu là hoàn toàn khác nhau đấy."
        },
        {
          "speaker": "B",
          "hanzi": "老师，比如“美丽的花”、“高兴地说”和“跑得快”，对吗？",
          "pinyin": "Lǎoshī, bǐrú “měilì de huā”, “gāoxìng de shuō” hé “pǎo de kuài”, duì ma?",
          "meaning": "Thưa cô, ví dụ như \"美丽的花\", \"高兴地说\" và \"跑得快\", đúng không ạ?"
        },
        {
          "speaker": "A",
          "hanzi": "非常正确！修饰名词用白勺“的”，修饰动词用土也“地”，补充状态用双人“得”。",
          "pinyin": "Fēicháng zhèngquè! Xiūshì míngcí yòng bái sháo “de”, xiūshì dòngcí yòng tǔ yě “de”, bǔchōng zhuàngtài yòng shuāng rén “de”.",
          "meaning": "Rất chính xác! Bổ nghĩa danh từ dùng chữ 的, bổ nghĩa động từ dùng chữ 地, bổ sung trạng thái mức độ dùng chữ 得."
        },
        {
          "speaker": "B",
          "hanzi": "太形象了，这样总结我以后再也不会用错了！",
          "pinyin": "Tài xíngxiàng le, zhèyàng zǒngjié wǒ yǐhòu zài yě bú huì yòng cuò le!",
          "meaning": "Hình tượng quá, tổng kết như vậy từ nay về sau em sẽ không bao giờ dùng sai nữa!"
        }
      ],
      "audioText": "同学们，请注意句子中的三个“de”用法是完全不同的。老师，比如“美丽的花”、“高兴地说”和“跑得快”，对吗？非常正确！修饰名词用白勺“的”，修饰动词用土也“地”，补充状态用双人“得”。太形象了，这样总结我以后再也不会用错了！",
      "question": "Khi muốn bổ nghĩa cho một ĐỘNG TỪ (hành động được thực hiện như thế nào), ta dùng chữ \"de\" nào?",
      "options": [
        "Dùng chữ 的 (Bạch thược)",
        "Dùng chữ 地 (Thổ dã - 高兴地)",
        "Dùng chữ 得 (Song nhân)",
        "Dùng chữ nào cũng được"
      ],
      "correctIndex": 1,
      "explanation": "Giáo viên khẳng định: \"修饰动词用土也‘地’\" (Bổ nghĩa cho động từ dùng chữ 地)."
    },
    "step6_speaking": {
      "prompt": "Đọc câu áp dụng chuẩn cả 3 chữ:",
      "targetSentence": "她高兴地跳，跳得很高。",
      "targetPinyin": "Tā gāoxìng de tiào, tiào de hěn gāo.",
      "targetMeaning": "Cô ấy vui vẻ nhảy, nhảy rất cao.",
      "hint": "Phân biệt gāoxìng de (地) và tiào de (得)."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tiếng Trung anh ấy nói rất lưu loát",
      "words": [
        "很好",
        "说得",
        "他的汉语"
      ],
      "correctOrder": [
        "他的汉语",
        "说得",
        "很好"
      ],
      "explanation": "他的汉语 + 说得 + 很好."
    },
    "step8_quiz": [
      {
        "id": "q-315-1",
        "type": "multiple-choice",
        "question": "Điền từ thích hợp vào chỗ trống: 他认真 ___ 看着书。",
        "options": [
          "的",
          "地 (dì/de)",
          "得",
          "着"
        ],
        "correctIndex": 1,
        "explanation": "Đứng trước động từ (看着书) dùng trợ từ trạng ngữ 地."
      },
      {
        "id": "q-315-2",
        "type": "multiple-choice",
        "question": "Điền từ thích hợp vào chỗ trống: 他汉字写 ___ 非常漂亮。",
        "options": [
          "的",
          "地",
          "得 (de)",
          "了"
        ],
        "correctIndex": 2,
        "explanation": "Đứng sau động từ (写) và trước mức độ (非常漂亮) bắt buộc dùng 得."
      }
    ],
    "step9_challenge": {
      "title": "Bậc thầy 3 chữ Đích",
      "taskDesc": "Đọc to câu: 'Cậu bé thông minh vui vẻ học tập, học rất giỏi'.",
      "targetPhrase": "cōngming de háizi rènzhēn de xué xué de hěn hǎo",
      "xpReward": 60,
      "badge": "Thần Nhãn Phân Biệt"
    }
  },
  {
    "id": "l-316",
    "chapterId": "ch-12",
    "levelId": "lvl-3",
    "lessonNumber": 16,
    "title": "Thành ngữ 4 chữ thông dụng trong đời sống (成语入门)",
    "chineseTitle": "日常四字成语与文化典故（入乡随俗、马马虎虎）",
    "subtitle": "Bước chân vào thế giới văn hóa tinh hoa: Nhập gia tùy tục (入乡随俗), tàm tạm (马马虎虎), một lòng một dạ (一心一意).",
    "objective": "Hiểu và vận dụng chuẩn xác các thành ngữ 4 chữ thông dụng trong bài viết và giao tiếp thực tế.",
    "prerequisite": "Đã hoàn thành Module 3.3.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng ngữ cảnh của 2 thành ngữ.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Thành ngữ",
      "成语",
      "入乡随俗",
      "Văn hóa"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-8"
    ],
    "step1_learn": {
      "topic": "3 Thành ngữ 4 chữ kinh điển HSK 3: 入乡随俗, 马马虎虎, 一心一意",
      "summary": "1. 入乡随俗 (rù xiāng suí sú - Nhập gia tùy tục): Đến nơi nào tôn trọng phong tục nơi đó. 2. 马马虎虎 (mǎmǎhūhū - Mã mã hổ hổ): Tàm tạm, qua loa đại khái. 3. 一心一意 (yì xīn yí yì - Nhất tâm nhất ý): Toàn tâm toàn ý, tập trung cao độ.",
      "audioDemoText": "dào le zhōngguó yào rùxiāngsuísú, tā zuòshì yíxīnyíyì"
    },
    "step2_vocabulary": [
      {
        "id": "v-316-1",
        "hanzi": "入乡随俗",
        "pinyin": "rù xiāng suí sú",
        "hanviet": "Nhập hương tùy tục",
        "meaning": "Nhập gia tùy tục",
        "radical": "入 (Nhập)",
        "example": {
          "hanzi": "去中国要入乡随俗。",
          "pinyin": "Qù Zhōngguó yào rù xiāng suí sú.",
          "meaning": "Đến Trung Quốc phải nhập gia tùy tục."
        },
        "pos": "Thành ngữ"
      },
      {
        "id": "v-316-2",
        "hanzi": "马马虎虎",
        "pinyin": "mǎmǎhūhū",
        "hanviet": "Mã mã hổ hổ",
        "meaning": "Tàm tạm, qua loa",
        "radical": "马 (Mã)",
        "example": {
          "hanzi": "水平马马虎虎。",
          "pinyin": "Shuǐpíng mǎmǎhūhū.",
          "meaning": "Trình độ tàm tạm thôi."
        },
        "pos": "Thành ngữ / Tính từ"
      },
      {
        "id": "v-316-3",
        "hanzi": "一心一意",
        "pinyin": "yì xīn yí yì",
        "hanviet": "Nhất tâm nhất ý",
        "meaning": "Toàn tâm toàn ý, hết lòng",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "一心一意学汉语。",
          "pinyin": "Yì xīn yí yì xué Hànyǔ.",
          "meaning": "Hết lòng hết dạ học tiếng Trung."
        },
        "pos": "Thành ngữ"
      },
      {
        "id": "v-316-4",
        "hanzi": "文化",
        "pinyin": "wénhuà",
        "hanviet": "Văn hóa",
        "meaning": "Văn hóa",
        "radical": "文 (Văn)",
        "example": {
          "hanzi": "中国传统文化。",
          "pinyin": "Zhōngguó chuántǒng wénhuà.",
          "meaning": "Văn hóa truyền thống Trung Hoa."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "俗",
        "hanzi": "俗",
        "pinyin": "sú",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰亻谷",
        "radical": {
          "char": "亻",
          "name": "Nhân đứng",
          "strokes": 2
        },
        "meaning": "Phong tục, tập quán",
        "strokesCount": 9,
        "strokeOrderText": "Phẩy -> Sổ (亻) -> Chữ Cốc 谷 (7 nét)",
        "components": [
          "亻",
          "谷"
        ],
        "mnemonic": "Con người (亻) sống chung trong thung lũng (谷) tạo nên phong tục tập quán."
      },
      {
        "char": "虎",
        "hanzi": "虎",
        "pinyin": "hǔ",
        "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸"
        },
        "ids": "⿸虍几",
        "radical": {
          "char": "虍",
          "name": "Hô",
          "strokes": 6
        },
        "meaning": "Con hổ, chúa sơn lâm",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Hô 虍 (6 nét) -> Chữ Kỷ 几 (2 nét)",
        "components": [
          "虍",
          "几"
        ],
        "mnemonic": "Mô phỏng hình dáng chúa sơn lâm dũng mãnh đứng trên tảng đá."
      }
    ],
    "step4_grammar": {
      "title": "Cách đặt câu với thành ngữ 4 chữ: Làm vị ngữ, định ngữ hoặc trạng ngữ",
      "formula": "Chủ ngữ + (是) + Thành ngữ  HOẶC  Thành ngữ + 地 + Động từ",
      "explanation": "Thành ngữ 4 chữ tiếng Trung cực kỳ cô đọng. Ví dụ: 他一心一意地学习 (Anh ấy toàn tâm toàn ý học tập).",
      "examples": [
        {
          "hanzi": "到了一个新的国家，我们应该学会入乡随俗，尊重当地的生活习惯。",
          "pinyin": "Dào le yí gè xīn de guójiā, wǒmen yīnggāi xuéhuì rù xiāng suí sú, zūnzhòng dāngdì de shēnghuó xíguàn.",
          "meaning": "Đến một quốc gia mới, chúng ta nên học cách nhập gia tùy tục, tôn trọng thói quen sinh hoạt bản địa."
        }
      ],
      "commonMistake": {
        "wrong": "入乡随俗地吃 ❌",
        "correct": "学会入乡随俗 ✔️",
        "explanation": "Dùng thành ngữ đúng ngữ cảnh văn hóa."
      }
    },
    "step5_listening": {
      "situation": "Vận dụng thành ngữ 4 chữ thông dụng vào cuộc sống đời thường",
      "context": "Buổi giao lưu văn hóa Trung Hoa tại câu lạc bộ",
      "participants": "A: Du học sinh Việt Nam, B: Giáo viên văn hóa",
      "targetGoal": "Thành thạo các thành ngữ 4 chữ HSK 3: 入乡随俗 (nhập gia tùy tục), 马马虎虎 (tàm tạm/qua loa), 一心一意 (toàn tâm toàn ý)",
      "usageNotes": "Thành ngữ phản ánh tinh hoa trí tuệ nghìn năm. Sử dụng đúng thành ngữ giúp khẩu ngữ tiếng Trung phong phú, tinh tế.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "老师，我在中国生活感到很多习惯和越南不一样。",
          "pinyin": "Lǎoshī, wǒ zài Zhōngguó shēnghuó gǎndào hěn duō xíguàn hé Yuènán bù yíyàng.",
          "meaning": "Thưa thầy, em sống ở Trung Quốc thấy rất nhiều thói quen không giống với Việt Nam."
        },
        {
          "speaker": "B",
          "hanzi": "中国有句古话叫“入乡随俗”，多观察多体会就会慢慢适应的。",
          "pinyin": "Zhōngguó yǒu jù gǔhuà jiào “rù xiāng suí sú”, duō guānchá duō tǐhuì jiù huì mànman shìyìng de.",
          "meaning": "Trung Quốc có câu cổ ngữ \"Nhập gia tùy tục\", em quan sát nhiều cảm nhận nhiều thì sẽ từ từ thích nghi thôi."
        },
        {
          "speaker": "A",
          "hanzi": "学汉语也是这样，绝不能马马虎虎，必须一心一意。",
          "pinyin": "Xué Hànyǔ yě shì zhèyàng, jué bù néng mǎmǎhūhū, bìxū yì xīn yí yì.",
          "meaning": "Học tiếng Trung cũng vậy, tuyệt đối không được qua loa đại khái, mà phải toàn tâm toàn ý."
        },
        {
          "speaker": "B",
          "hanzi": "你能领会这几个成语的意思，说明你的文化水平已经很高了！",
          "pinyin": "Nǐ néng lǐnghuì zhè jǐ gè chéngyǔ de yìsi, shuōmíng nǐ de wénhuà shuǐpíng yǐjīng hěn gāo le!",
          "meaning": "Em lĩnh hội được ý nghĩa của các thành ngữ này, chứng tỏ trình độ văn hóa của em đã rất cao rồi đấy!"
        }
      ],
      "audioText": "老师，我在中国生活感到很多习惯和越南不一样。中国有句古话叫“入乡随俗”，多观察多体会就会慢慢适应的。学汉语也是这样，绝不能马马虎虎，必须一心一意。你能领会这几个成语的意思，说明你的文化水平已经很高了！",
      "question": "Thành ngữ nào khuyên con người khi đến một vùng đất mới nên tôn trọng và hòa nhập với phong tục địa phương?",
      "options": [
        "马马虎虎 (Mã mã hổ hổ)",
        "入乡随俗 (Nhập gia tùy tục)",
        "一心一意 (Nhất tâm nhất ý)",
        "走马观花 (Cưỡi ngựa xem hoa)"
      ],
      "correctIndex": 1,
      "explanation": "Thành ngữ \"入乡随俗\" (Nhập gia tùy tục) mang nghĩa đến nơi nào thì theo phong tục nơi đó."
    },
    "step6_speaking": {
      "prompt": "Đọc câu thành ngữ về sự thích nghi:",
      "targetSentence": "到了中国要入乡随俗。",
      "targetPinyin": "Dào le Zhōngguó yào rù xiāng suí sú.",
      "targetMeaning": "Đến Trung Quốc cần nhập gia tùy tục.",
      "hint": "Đọc rù xiāng suí sú dõng dạc."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Toàn tâm toàn ý học tập",
      "words": [
        "学习",
        "一心一意地"
      ],
      "correctOrder": [
        "一心一意地",
        "学习"
      ],
      "explanation": "一心一意地 + 学习."
    },
    "step8_quiz": [
      {
        "id": "q-316-1",
        "type": "multiple-choice",
        "question": "Thành ngữ '入乡随俗' tương đương với câu tục ngữ nào trong tiếng Việt?",
        "options": [
          "Nhập gia tùy tục",
          "Một nắng hai sương",
          "Uống nước nhớ nguồn",
          "Tay làm hàm nhai"
        ],
        "correctIndex": 0,
        "explanation": "Nhập hương tùy tục nghĩa là Nhập gia tùy tục."
      },
      {
        "id": "q-316-2",
        "type": "multiple-choice",
        "question": "Khi ai đó khiêm tốn nhận xét khả năng của mình 'tàm tạm thôi', họ thường dùng:",
        "options": [
          "入乡随俗",
          "马马虎虎 (mǎmǎhūhū)",
          "最好",
          "特别高"
        ],
        "correctIndex": 1,
        "explanation": "马马虎虎 là tàm tạm, bình thường."
      }
    ],
    "step9_challenge": {
      "title": "Nhà văn hóa tinh hoa",
      "taskDesc": "Đọc to câu: 'Tôi toàn tâm toàn ý học tiếng Trung và học cách nhập gia tùy tục'.",
      "targetPhrase": "wǒ yíxīnyíyì xué hànyǔ rùxiāngsuísú",
      "xpReward": 50,
      "badge": "Hiểu Sâu Văn Hóa"
    }
  },
  {
    "id": "l-317",
    "chapterId": "ch-12",
    "levelId": "lvl-3",
    "lessonNumber": 17,
    "title": "Kể chuyện & Tự thuật (首先, 然后, 最后)",
    "chineseTitle": "叙事逻辑与故事复述（首先、然后、最后）",
    "subtitle": "Kỹ năng kể chuyện mạch lạc: Đầu tiên (首先), sau đó (然后), cuối cùng (最后) và liên từ thời gian.",
    "objective": "Kể lại một chuyến đi, một sự việc hoàn chỉnh 3–4 phút bằng chuỗi liên từ tuần tự.",
    "prerequisite": "Đã hoàn thành Bài 316.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và kể lại một mẩu chuyện ngắn có mở đầu, diễn biến, kết thúc.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Kể chuyện",
      "首先然后最后",
      "Tự thuật",
      "Diễn đạt dài"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-8"
    ],
    "step1_learn": {
      "topic": "Bộ ba liên từ tự thuật mạch lạc: 首先 (Shǒuxiān) ➔ 然后 (Ránhòu) ➔ 最后 (Zuìhòu)",
      "summary": "1. 首先 (đầu tiên/trước hết): Nêu khởi đầu sự việc. 2. 然后 (sau đó): Diễn biến tiếp nối. 3. 最后 (cuối cùng): Kết cục và cảm nghĩ rút ra.",
      "audioDemoText": "shǒuxiān wǒ qù jīchǎng, ránhòu zuò fēijī, zuìhòu dào le běijīng"
    },
    "step2_vocabulary": [
      {
        "id": "v-317-1",
        "hanzi": "首先",
        "pinyin": "shǒuxiān",
        "hanviet": "Thủ tiên",
        "meaning": "Đầu tiên, trước hết",
        "radical": "首 (Thủ)",
        "example": {
          "hanzi": "首先要准时。",
          "pinyin": "Shǒuxiān yào zhǔnshí.",
          "meaning": "Trước hết phải đúng giờ."
        },
        "pos": "Liên từ"
      },
      {
        "id": "v-317-2",
        "hanzi": "然后",
        "pinyin": "ránhòu",
        "hanviet": "Nhiên hậu",
        "meaning": "Sau đó, tiếp theo",
        "radical": "灬 (Hỏa)",
        "example": {
          "hanzi": "然后去吃饭。",
          "pinyin": "Ránhòu qù chīfàn.",
          "meaning": "Sau đó đi ăn cơm."
        },
        "pos": "Liên từ"
      },
      {
        "id": "v-317-3",
        "hanzi": "最后",
        "pinyin": "zuìhòu",
        "hanviet": "Tối hậu",
        "meaning": "Cuối cùng",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "最后回家。",
          "pinyin": "Zuìhòu huí jiā.",
          "meaning": "Cuối cùng về nhà."
        },
        "pos": "Liên từ"
      },
      {
        "id": "v-317-4",
        "hanzi": "故事",
        "pinyin": "gùshi",
        "hanviet": "Cố sự",
        "meaning": "Câu chuyện",
        "radical": "攵 (Phác)",
        "example": {
          "hanzi": "讲一个故事。",
          "pinyin": "Jiǎng yí gè gùshi.",
          "meaning": "Kể một câu chuyện."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "首",
        "hanzi": "首",
        "pinyin": "shǒu",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "首",
        "radical": {
          "char": "首",
          "name": "Thủ",
          "strokes": 9
        },
        "meaning": "Đầu tiên, chiếc đầu",
        "strokesCount": 9,
        "strokeOrderText": "Chấm -> Phẩy -> Ngang dài -> Bộ Tự 自 (6 nét)",
        "components": [
          "首"
        ],
        "mnemonic": "Hình vẽ chiếc đầu người có tóc phía trên và gương mặt phía dưới."
      },
      {
        "char": "然",
        "hanzi": "然",
        "pinyin": "rán",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱肰灬",
        "radical": {
          "char": "灬",
          "name": "Hỏa",
          "strokes": 4
        },
        "meaning": "Tất nhiên, đúng vậy",
        "strokesCount": 12,
        "strokeOrderText": "Chữ Nhiên 肰 (8 nét) -> Bốn chấm hỏa 灬 (4 nét)",
        "components": [
          "肰",
          "灬"
        ],
        "mnemonic": "Thịt thú nướng trên lửa (灬) chín tự nhiên thơm lừng."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc mạch truyện hoàn chỉnh trong phần thi nói HSKK",
      "formula": "首先...， 然后...， 接着...， 最后...。",
      "explanation": "Trong bài thi nói HSKK Sơ cấp và Trung cấp, giám khảo chấm điểm rất cao thí sinh biết dùng chuỗi liên từ này để kể lại câu chuyện tranh.",
      "examples": [
        {
          "hanzi": "周末我首先去图书馆借了书，然后和朋友去吃了烤鸭，最后心满意足地回到了家。",
          "pinyin": "Zhōumò wǒ shǒuxiān qù túshūguǎn jiè le shū, ránhòu hé péngyou qù chī le kǎoyā, zuìhòu xīnmǎnyìzú de huí dào le jiā.",
          "meaning": "Cuối tuần đầu tiên tôi đến thư viện mượn sách, sau đó đi ăn vịt quay cùng bạn bè, cuối cùng hài lòng trở về nhà."
        }
      ],
      "commonMistake": {
        "wrong": "Kể chuyện lộn xộn nhảy cóc thời gian.",
        "correct": "Tuân thủ thứ tự: 首先 -> 然后 -> 最后.",
        "explanation": "Tư duy logic thời gian mạch lạc."
      }
    },
    "step5_listening": {
      "situation": "Kể chuyện và tự thuật trình tự với các liên từ 首先, 然后, 最后",
      "context": "Thuyết trình trước lớp về kế hoạch tổ chức chuyến đi dã ngoại",
      "participants": "A: Trưởng ban tổ chức, B: Cả lớp lắng nghe",
      "targetGoal": "Thành thạo cấu trúc tự thuật mạch lạc: 首先 (đầu tiên) -> 然后 (sau đó) -> 最后 (cuối cùng)",
      "usageNotes": "Cấu trúc này là khung xương mẫu mực để làm phần thi nói HSKK trung cấp và viết văn tự sự.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "大家好，今天我来介绍一下周末去长城旅游的计划。",
          "pinyin": "Dàjiā hǎo, jīntiān wǒ lái jièshào yíxià zhōumò qù Chángchéng lǚyóu de jìhuà.",
          "meaning": "Chào mọi người, hôm nay mình xin giới thiệu kế hoạch đi du lịch Trường Thành cuối tuần này."
        },
        {
          "speaker": "B",
          "hanzi": "太好了，我们大家都非常期待，请快说说具体安排吧！",
          "pinyin": "Tài hǎo le, wǒmen dàjiā dōu fēicháng qīdài, qǐng kuài shuōshuo jùtǐ ānpái ba!",
          "meaning": "Tốt quá, tất cả tụi mình đều rất mong đợi, bạn mau nói lịch trình cụ thể đi!"
        },
        {
          "speaker": "A",
          "hanzi": "首先，周六早上七点在校门口集合，然后一起坐旅游大巴出发。",
          "pinyin": "Shǒuxiān, zhōuliù zǎoshang qī diǎn zài xiàoménkǒu jíhé, ránhòu yìqǐ zuò lǚyóu dàbā chūfā.",
          "meaning": "Đầu tiên, sáng thứ Bảy 7 giờ tập trung ở cổng trường, sau đó cùng nhau đi xe buýt du lịch xuất phát."
        },
        {
          "speaker": "A",
          "hanzi": "爬完长城后我们吃烤鸭，最后在下午五点准时坐车回学校。",
          "pinyin": "Pá wán Chángchéng hòu wǒmen chī kǎoyā, zuìhòu zài xiàwǔ wǔ diǎn zhǔnshí zuòchē huí xuéxiào.",
          "meaning": "Sau khi leo Trường Thành xong chúng ta đi ăn vịt quay, cuối cùng 5 giờ chiều đúng giờ lên xe về trường."
        }
      ],
      "audioText": "大家好，今天我来介绍一下周末去长城旅游的计划。太好了，我们大家都非常期待，请快说说具体安排吧！首先，周六早上七点在校门口集合，然后一起坐旅游大巴出发。爬完长城后我们吃烤鸭，最后在下午五点准时坐车回学校。",
      "question": "Thời điểm cả đoàn kết thúc chuyến đi và đúng giờ lên xe trở về trường là lúc nào?",
      "options": [
        "12 giờ trưa",
        "3 giờ chiều",
        "5 giờ chiều đúng giờ (下午五点准时)",
        "8 giờ tối"
      ],
      "correctIndex": 2,
      "explanation": "Trưởng ban thông báo: \"最后在下午五点准时坐车回学校\"."
    },
    "step6_speaking": {
      "prompt": "Đọc câu kể lại trình tự một ngày:",
      "targetSentence": "首先学习，然后休息，最后睡觉。",
      "targetPinyin": "Shǒuxiān xuéxí, ránhòu xiūxi, zuìhòu shuìjiào.",
      "targetMeaning": "Trước hết học tập, sau đó nghỉ ngơi, cuối cùng đi ngủ.",
      "hint": "Đọc liền mạch 3 vế câu."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Trước hết học bài, sau đó đi chơi",
      "words": [
        "然后去玩",
        "首先学习"
      ],
      "correctOrder": [
        "首先学习",
        "然后去玩"
      ],
      "explanation": "首先学习 + 然后去玩."
    },
    "step8_quiz": [
      {
        "id": "q-317-1",
        "type": "multiple-choice",
        "question": "Liên từ mang nghĩa 'Đầu tiên, trước hết' là:",
        "options": [
          "然后 (ránhòu)",
          "首先 (shǒuxiān)",
          "最后 (zuìhòu)",
          "虽然 (suīrán)"
        ],
        "correctIndex": 1,
        "explanation": "首先 là đầu tiên, trước hết."
      },
      {
        "id": "q-317-2",
        "type": "multiple-choice",
        "question": "Chuỗi liên từ kể chuyện chuẩn mực trong tiếng Trung gồm:",
        "options": [
          "首先 ➔ 然后 ➔ 最后",
          "因为 ➔ 所以 ➔ 但是",
          "第一 ➔ 第二 ➔ 第四",
          "如果 ➔ 就 ➔ 那么"
        ],
        "correctIndex": 0,
        "explanation": "Cấu trúc kể chuyện: 首先 -> 然后 -> 最后."
      }
    ],
    "step9_challenge": {
      "title": "Bậc thầy kể chuyện",
      "taskDesc": "Đọc to câu chuyện 3 bước: 'Đầu tiên tôi học bài, sau đó ăn cơm, cuối cùng nghỉ ngơi'.",
      "targetPhrase": "shǒuxiān wǒ xuéxí ránhòu chīfàn zuìhòu xiūxi",
      "xpReward": 50,
      "badge": "Nhà Kể Chuyện Tài Ba"
    }
  },
  {
    "id": "l-318",
    "chapterId": "ch-12",
    "levelId": "lvl-3",
    "lessonNumber": 18,
    "title": "Đọc hiểu đoạn văn phân cấp HSK 3 & Chiến thuật thi cử",
    "chineseTitle": "HSK 3级分级阅读与全真解题策略",
    "subtitle": "Kỹ thuật đọc lướt (Skimming), quét từ khóa (Scanning) và xử lý 30 câu đọc hiểu HSK 3 trong 30 phút.",
    "objective": "Đọc hiểu trôi chảy đoạn văn ngắn 100–150 chữ không cần tra từ điển và nắm chắc điểm đọc hiểu.",
    "prerequisite": "Đã hoàn thành Bài 317.",
    "completionCriteria": "Đạt >= 80% trắc nghiệm đọc hiểu đoạn văn phân cấp.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Đọc hiểu",
      "Chiến thuật thi",
      "Kỹ năng đọc lướt"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "3 Bước vàng giải đề Đọc hiểu HSK 3",
      "summary": "1. Đọc câu hỏi và đáp án trước. 2. Quét nhanh từ khóa đối chiếu trong đoạn văn. 3. Xác định câu chủ đề (thường nằm ở đầu hoặc cuối đoạn).",
      "audioDemoText": "kuàisù yuèdú, zhǎo chū guānjiàncí, zhèngquè xuǎnzé dá'àn"
    },
    "step2_vocabulary": [
      {
        "id": "v-318-1",
        "hanzi": "阅读",
        "pinyin": "yuèdú",
        "hanviet": "Duyệt độc",
        "meaning": "Đọc hiểu",
        "radical": "门 (Môn)",
        "example": {
          "hanzi": "阅读理解。",
          "pinyin": "Yuèdú lǐjiě.",
          "meaning": "Đọc hiểu văn bản."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-318-2",
        "hanzi": "简单",
        "pinyin": "jiǎndān",
        "hanviet": "Giản đơn",
        "meaning": "Đơn giản",
        "radical": "竹 (Trúc)",
        "example": {
          "hanzi": "这个问题很简 đơn.",
          "pinyin": "Zhè ge wèntí hěn jiǎndān.",
          "meaning": "Vấn đề này rất đơn giản."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-318-3",
        "hanzi": "其实",
        "pinyin": "qíshí",
        "hanviet": "Kỳ thực",
        "meaning": "Thực ra, kỳ thực",
        "radical": "八 (Bát)",
        "example": {
          "hanzi": "其实并不难。",
          "pinyin": "Qíshí bìng bù nán.",
          "meaning": "Thực ra không khó chút nào."
        },
        "pos": "Phó từ"
      },
      {
        "id": "v-318-4",
        "hanzi": "选择",
        "pinyin": "xuǎnzé",
        "hanviet": "Tuyển trạch",
        "meaning": "Lựa chọn",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "做出正确的选择。",
          "pinyin": "Zuò chū zhèngquè de xuǎnzé.",
          "meaning": "Đưa ra sự lựa chọn đúng đắn."
        },
        "pos": "Động từ / Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "选",
        "hanzi": "选",
        "pinyin": "xuǎn",
        "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿺"
        },
        "ids": "⿺辶先",
        "radical": {
          "char": "辶",
          "name": "Sước",
          "strokes": 3
        },
        "meaning": "Lựa chọn, tuyển chọn",
        "strokesCount": 9,
        "strokeOrderText": "Chữ Tiên 先 (6 nét) -> Bộ Sước 辶 (3 nét)",
        "components": [
          "辶",
          "先"
        ],
        "mnemonic": "Bước chân (辶) tiến lên phía trước chọn người giỏi dẫn đầu (先)."
      },
      {
        "char": "择",
        "hanzi": "择",
        "pinyin": "zé",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰扌𠤕",
        "radical": {
          "char": "扌",
          "name": "Thủ",
          "strokes": 3
        },
        "meaning": "Chọn lựa",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Thủ 扌 (3 nét) -> Chữ Dịch 𠤕 (5 nét)",
        "components": [
          "扌",
          "𠤕"
        ],
        "mnemonic": "Dùng bàn tay (扌) tinh tường lựa chọn đồ tốt mang về."
      }
    ],
    "step4_grammar": {
      "title": "Phó từ chuyển ngoặt tinh tế: 其实 (qíshí - Thực ra / Kỳ thực)",
      "formula": "Tưởng là sự việc thế này, 其实 + Sự thật khách quan đằng sau",
      "explanation": "Từ 其实 thường dùng để sửa lại nhận thức chưa chính xác của người đối diện, hé lộ sự thật.",
      "examples": [
        {
          "hanzi": "很多人以为学中文很难，其实只要掌握了汉字规律，就会觉得非常有趣。",
          "pinyin": "Hěn duō rén yǐwéi xué Zhōngwén hěn nán, qíshí zhǐyào zhǎngwò le hànzì guīlǜ, jiù huì juéde fēicháng yǒuqù.",
          "meaning": "Rất nhiều người nghĩ học tiếng Trung khó, thực ra chỉ cần nắm chắc quy luật chữ Hán là sẽ thấy vô cùng thú vị."
        }
      ],
      "commonMistake": {
        "wrong": "其实放在句尾 ❌",
        "correct": "其实 đứng ở đầu vế câu thứ 2 ✔️",
        "explanation": "其实 làm liên từ nối mở đầu vế giải thích."
      }
    },
    "step5_listening": {
      "situation": "Chiến thuật đọc hiểu đoạn văn phân cấp HSK 3 và bí quyết chọn đáp án",
      "context": "Thầy giáo chia sẻ phương pháp làm bài đọc hiểu đạt điểm tối đa",
      "participants": "A: Giáo viên luyện thi HSK, B: Thí sinh",
      "targetGoal": "Thành thạo kỹ năng đọc hiểu: 阅读 (đọc hiểu), 简单 (đơn giản), 其实 (thực ra), 选择 (lựa chọn)",
      "usageNotes": "Bí quyết thi đọc HSK 3: Đọc câu hỏi trước, định vị từ khóa trong bài văn, sau đó mới đối chiếu 4 phương án lựa chọn.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "做HSK 3级阅读题的时候，千万不要一个字一个字去硬读。",
          "pinyin": "Zuò HSK sān jí yuèdú tí de shíhou, qiānwàn bú yào yí gè zì yí gè zì qù yìng dú.",
          "meaning": "Khi làm bài đọc hiểu HSK 3, ngàn vạn lần đừng đọc cắn câu từng chữ một."
        },
        {
          "speaker": "B",
          "hanzi": "老师，文章那么长，遇到不懂的生词该怎么办呢？",
          "pinyin": "Lǎoshī, wénzhāng nàme cháng, yù dào bù dǒng de shēngcí gāi zěnme bàn ne?",
          "meaning": "Thưa thầy, bài văn dài như vậy, gặp từ mới không hiểu thì phải làm sao ạ?"
        },
        {
          "speaker": "A",
          "hanzi": "其实阅读题很简单，首先看问题找关键词，然后回到文章里找答案。",
          "pinyin": "Qíshí yuèdú tí hěn jiǎndān, shǒuxiān kàn wèntí zhǎo guānjiàncí, ránhòu huí dào wénzhāng lǐ zhǎo dá’àn.",
          "meaning": "Thực ra đề đọc hiểu rất đơn giản, đầu tiên đọc câu hỏi tìm từ khóa, sau đó quay lại bài văn đối chiếu đáp án."
        },
        {
          "speaker": "B",
          "hanzi": "明白了！这样就能在最短的时间内做出最准确的选择。",
          "pinyin": "Míngbai le! Zhèyàng jiù néng zài zuì duǎn de shíjiān nèi zuò chū zuì zhǔnquè de xuǎnzé.",
          "meaning": "Em hiểu rồi ạ! Như vậy có thể trong thời gian ngắn nhất đưa ra lựa chọn chuẩn xác nhất."
        }
      ],
      "audioText": "做HSK 3级阅读题的时候，千万不要一个字一个字去硬读。老师，文章那么长，遇到不懂的生词该怎么办呢？其实阅读题很简单，首先看问题找关键词，然后回到文章里找答案。明白了！这样就能在最短的时间内做出最准确的选择。",
      "question": "Chiến thuật làm bài đọc hiểu HSK 3 hiệu quả được thầy giáo hướng dẫn là gì?",
      "options": [
        "Đọc bài văn 3 lần rồi mới xem câu hỏi",
        "Tra từ điển từng từ mới một",
        "Xem câu hỏi tìm từ khóa trước rồi quay lại bài văn đối chiếu đáp án (看问题找关键词)",
        "Chọn ngẫu nhiên đáp án A"
      ],
      "correctIndex": 2,
      "explanation": "Thầy giáo hướng dẫn: \"首先看问题找关键词，然后回到文章里找答案\"."
    },
    "step6_speaking": {
      "prompt": "Khẳng định sự thật học tiếng Trung:",
      "targetSentence": "其实汉语并不难。",
      "targetPinyin": "Qíshí Hànyǔ bìng bù nán.",
      "targetMeaning": "Thực ra tiếng Trung không khó chút nào.",
      "hint": "Đọc bìng bù nán nhấn mạnh."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Đưa ra lựa chọn đúng đắn",
      "words": [
        "正确的选择",
        "做出"
      ],
      "correctOrder": [
        "做出",
        "正确的选择"
      ],
      "explanation": "做出 + 正确的选择."
    },
    "step8_quiz": [
      {
        "id": "q-318-1",
        "type": "multiple-choice",
        "question": "Từ '其实' (qíshí) mang nghĩa là gì?",
        "options": [
          "Tất nhiên",
          "Thực ra / Kỳ thực",
          "Bởi vì",
          "Có lẽ"
        ],
        "correctIndex": 1,
        "explanation": "其实 là thực ra, trên thực tế."
      },
      {
        "id": "q-318-2",
        "type": "multiple-choice",
        "question": "Chiến thuật làm bài đọc hiểu HSK 3 tốt nhất là:",
        "options": [
          "Đọc kỹ từng chữ từ đầu đến cuối trước",
          "Đọc câu hỏi và từ khóa trước rồi quét tìm trong bài",
          "Đoán mò không cần đọc",
          "Bỏ qua phần đọc hiểu"
        ],
        "correctIndex": 1,
        "explanation": "Đọc câu hỏi trước để tìm mục tiêu thông tin nhanh chóng."
      }
    ],
    "step9_challenge": {
      "title": "Đọc quét thần tốc",
      "taskDesc": "Đọc to câu: 'Thực ra chỉ cần nắm chắc phương pháp thì bài đọc hiểu nào cũng làm được'.",
      "targetPhrase": "qíshí zhǐyào zhǎngwò fāngfǎ jiù néng zuò duì",
      "xpReward": 50,
      "badge": "Tốc Độ Đọc Đỉnh Cao"
    }
  },
  {
    "id": "l-319",
    "chapterId": "ch-12",
    "levelId": "lvl-3",
    "lessonNumber": 19,
    "title": "Tổng ôn tập toàn diện 600 từ vựng & Ngữ pháp HSK 1–3",
    "chineseTitle": "HSK 1-3级全景语法大一统与600核心词总揽",
    "subtitle": "Đại hội tổng duyệt kiến thức 3 cấp độ: Bổ ngữ kết quả, bổ ngữ khả năng, câu chữ 把, câu chữ 被, câu chữ 比.",
    "objective": "Hệ thống hóa toàn bộ 600 từ vựng cốt lõi và 144 điểm ngữ pháp của trọn bộ Giai đoạn Sơ cấp & Giao tiếp độc lập.",
    "prerequisite": "Đã hoàn thành Bài 301–318.",
    "completionCriteria": "Đạt >= 85% bài kiểm tra tổng hợp toàn diện Level 1–3.",
    "durationMinutes": 30,
    "xpReward": 80,
    "tags": [
      "HSK 3",
      "Tổng kết Giai đoạn 1",
      "600 từ vựng",
      "Review Checkpoint"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Đại hội đồ ngũ đại ngữ pháp tiếng Trung: 比 (So sánh) + 把 (Tác động) + 被 (Bị động) + Bổ ngữ + 3 chữ Đích",
      "summary": "Chúc mừng bạn đã đi qua trọn vẹn lộ trình 60 bài học nghiên cứu! Bạn đã trang bị: 1. Phát âm Pinyin bản ngữ. 2. 600 từ vựng cốt lõi. 3. Tự tin giao tiếp và xử lý mọi tình huống độc lập.",
      "audioDemoText": "hsk yī dào sān jí zǒngfùxí, wǒmen zhǔnbèi hǎo le, yídìng néng chénggōng"
    },
    "step2_vocabulary": [
      {
        "id": "v-319-1",
        "hanzi": "水平",
        "pinyin": "shuǐpíng",
        "hanviet": "Thủy bình",
        "meaning": "Trình độ",
        "radical": "水 (Thủy)",
        "example": {
          "hanzi": "汉语水平很高。",
          "pinyin": "Hànyǔ shuǐpíng hěn gāo.",
          "meaning": "Trình độ tiếng Trung rất cao."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-319-2",
        "hanzi": "成功",
        "pinyin": "chénggōng",
        "hanviet": "Thành công",
        "meaning": "Thành công",
        "radical": "戈 (Qua)",
        "example": {
          "hanzi": "祝你成功！",
          "pinyin": "Zhù nǐ chénggōng!",
          "meaning": "Chúc bạn thành công!"
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-319-3",
        "hanzi": "坚持",
        "pinyin": "jiānchí",
        "hanviet": "Kiên trì",
        "meaning": "Kiên trì",
        "radical": "土 (Thổ)",
        "example": {
          "hanzi": "坚持到底。",
          "pinyin": "Jiānchí dào dǐ.",
          "meaning": "Kiên trì đến cùng."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-319-4",
        "hanzi": "自信",
        "pinyin": "zìxìn",
        "hanviet": "Tự tín",
        "meaning": "Tự tin",
        "radical": "自 (Tự)",
        "example": {
          "hanzi": "充满自信。",
          "pinyin": "Chōngmǎn zìxìn.",
          "meaning": "Tràn đầy tự tin."
        },
        "pos": "Tính từ / Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "平",
        "hanzi": "平",
        "pinyin": "píng",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "平",
        "radical": {
          "char": "干",
          "name": "Can",
          "strokes": 3
        },
        "meaning": "Bằng phẳng, hòa bình",
        "strokesCount": 5,
        "strokeOrderText": "Ngang -> Chấm -> Phẩy -> Ngang dài -> Sổ thẳng chính giữa",
        "components": [
          "平"
        ],
        "mnemonic": "Mô phỏng chiếc cân đòn hai bên thăng bằng tuyệt đối."
      },
      {
        "char": "持",
        "hanzi": "持",
        "pinyin": "chí",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰扌寺",
        "radical": {
          "char": "扌",
          "name": "Thủ",
          "strokes": 3
        },
        "meaning": "Cầm giữ, kiên trì",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Thủ 扌 (3 nét) -> Chữ Tự 寺 (6 nét)",
        "components": [
          "扌",
          "寺"
        ],
        "mnemonic": "Bàn tay (扌) giữ vững niềm tin sắt son chốn tôn nghiêm (寺)."
      }
    ],
    "step4_grammar": {
      "title": "Bảng đồ họa ma trận 5 cấu trúc câu kinh điển nhất tiếng Trung",
      "formula": "1. Câu chữ 比: A 比 B + Tính từ. 2. Câu chữ 把: S + 把 + O + V + khác. 3. Câu chữ 被: O + 被 + S + V + khác. 4. Bổ ngữ kết quả: V + 完/好/懂/见/到. 5. Bổ ngữ khả năng: V + 得/不 + Kết quả.",
      "explanation": "Làm chủ 5 cấu trúc này đồng nghĩa với việc bạn đã có đủ 100% vũ khí ngữ pháp để đạt điểm tuyệt đối HSK 3.",
      "examples": [
        {
          "hanzi": "只要坚持到底，把学过的知识复习好，你就一定能取得成功！",
          "pinyin": "Zhǐyào jiānchí dào dǐ, bǎ xué guo de zhīshi fùxí hǎo, nǐ jiù yídìng néng qǔdé chénggōng!",
          "meaning": "Chỉ cần kiên trì đến cùng, ôn tập tốt kiến thức đã học, bạn nhất định sẽ gặt hái thành công!"
        }
      ],
      "commonMistake": {
        "wrong": "Học vẹt từng câu rời rạc.",
        "correct": "Kết nối các câu thành đoạn văn liền mạch.",
        "explanation": "Tư duy ngôn ngữ bậc trung cấp."
      }
    },
    "step5_listening": {
      "situation": "Tổng ôn tập hệ thống ngữ pháp HSK 1–3 và xây dựng sự tự tin",
      "context": "Buổi cố vấn học tập trước kỳ thi chuẩn hóa quốc tế",
      "participants": "A: Cố vấn học tập, B: Học viên",
      "targetGoal": "Hệ thống hóa toàn bộ kiến thức: 水平 (trình độ), 成功 (thành công), 坚持 (kiên trì), 自信 (tự tin)",
      "usageNotes": "600 từ vựng HSK 1-3 là nền tảng giao tiếp căn bản giúp người học tự tin nói chuyện với người bản xứ.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "经过系统复习，你现在掌握了600个核心词汇和重点语法了吗？",
          "pinyin": "Jīngguò xìtǒng fùxí, nǐ xiànzài zhǎngwò le liùbǎi gè héxīn cíhuì hé zhòngdiǎn yǔfǎ le ma?",
          "meaning": "Trải qua ôn tập có hệ thống, hiện tại em đã nắm vững 600 từ vựng cốt lõi và các ngữ pháp trọng điểm chưa?"
        },
        {
          "speaker": "B",
          "hanzi": "老师，我都认真梳理过了，感觉自己的汉语水平有了很大的提高。",
          "pinyin": "Lǎoshī, wǒ dōu rènzhēn shūlǐ guò le, gǎnjué zìjǐ de Hànyǔ shuǐpíng yǒu le hěn dà de tígāo.",
          "meaning": "Thưa cô, em đều đã xâu chuỗi nghiêm túc lại rồi, em cảm thấy trình độ tiếng Trung của mình có bước tiến rất lớn."
        },
        {
          "speaker": "A",
          "hanzi": "学语言贵在坚持，只要平时肯下功夫，考试就一定能成功。",
          "pinyin": "Xué yǔyán guì zài jiānchí, zhǐyào píngshí kěn xià gōngfu, kǎoshì jiù yídìng néng chénggōng.",
          "meaning": "Học ngôn ngữ quý ở lòng kiên trì, chỉ cần bình thường chịu bỏ công sức thì thi cử nhất định sẽ thành công."
        },
        {
          "speaker": "B",
          "hanzi": "谢谢老师！我现在对自己充满了自信，一定考出好成绩！",
          "pinyin": "Xièxie lǎoshī! Wǒ xiànzài duì zìjǐ chōngmǎn le zìxìn, yídìng kǎo chū hǎo chéngjì!",
          "meaning": "Em cảm ơn cô! Bây giờ em tràn đầy tự tin vào bản thân, nhất định sẽ đạt kết quả tốt!"
        }
      ],
      "audioText": "经过系统复习，你现在掌握了600个核心词汇和重点语法了吗？老师，我都认真梳理过了，感觉自己的汉语水平有了很大的提高。学语言贵在坚持，只要平时肯下功夫，考试就一定能成功。谢谢老师！我现在对自己充满了自信，一定考出好成绩！",
      "question": "Theo cô giáo cố vấn, yếu tố quý báu nhất trong việc học ngoại ngữ để đi đến thành công là gì?",
      "options": [
        "Học vẹt trong 1 đêm",
        "Sự kiên trì rèn luyện mỗi ngày (学语言贵在坚持)",
        "Chỉ làm bài tập ngữ pháp",
        "Mua nhiều sách tham khảo"
      ],
      "correctIndex": 1,
      "explanation": "Cô giáo nhấn mạnh: \"学语言贵在坚持，只要平时肯下功夫，考试就一定能成功\"."
    },
    "step6_speaking": {
      "prompt": "Khẳng định sự tự tin chinh phục HSK 3:",
      "targetSentence": "我相信我一定能成功！",
      "targetPinyin": "Wǒ xiāngxìn wǒ yídìng néng chénggōng!",
      "targetMeaning": "Tôi tin rằng tôi nhất định sẽ thành công!",
      "hint": "Đọc xiāngxìn dõng dạc và tự tin."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Kiên trì nhất định sẽ thành công",
      "words": [
        "一定会成功",
        "坚持"
      ],
      "correctOrder": [
        "坚持",
        "一定会成功"
      ],
      "explanation": "坚持 + 一定会成功."
    },
    "step8_quiz": [
      {
        "id": "q-319-1",
        "type": "multiple-choice",
        "question": "Hành trình HSK 1 đến HSK 3 của HanziGo trang bị bao nhiêu bài học sư phạm chuẩn hóa?",
        "options": [
          "20 bài",
          "40 bài",
          "60 bài học sư phạm khép kín (Levels 1–3)",
          "10 bài"
        ],
        "correctIndex": 2,
        "explanation": "Trọn bộ 60 bài học 9 bước sư phạm khép kín."
      },
      {
        "id": "q-319-2",
        "type": "multiple-choice",
        "question": "Khái niệm 'Stage 1: HSK 1–3' trong khung chương trình HanziGo mang tên là:",
        "options": [
          "Sơ cấp & Giao tiếp độc lập",
          "Dịch cabin",
          "Cổ phong thi họa",
          "Thương mại quốc tế"
        ],
        "correctIndex": 0,
        "explanation": "Stage 1 là giai đoạn Sơ cấp & Giao tiếp độc lập."
      }
    ],
    "step9_challenge": {
      "title": "Khúc khải hoàn 60 bài",
      "taskDesc": "Đọc to câu tuyên thệ tự tin: 'Tôi đã hoàn thành 60 bài học và sẵn sàng đại chiến Boss HSK 3!'.",
      "targetPhrase": "wǒ wánchéng le liùshí jié kèchéng zhǔnbèi dǎ boss",
      "xpReward": 80,
      "badge": "Chiến Binh 60 Bài"
    }
  },
  {
    "id": "l-320",
    "chapterId": "ch-12",
    "levelId": "lvl-3",
    "lessonNumber": 20,
    "title": "Boss Challenge HSK 3 (Đề thi thử 80 câu CTI & Thi nói HSKK)",
    "chineseTitle": "HSK 3级终极通关大考与HSKK口语模拟认证",
    "subtitle": "Đại kỳ thi sát hạch đỉnh cao Stage 1: 80 câu hỏi Nghe, Đọc, Viết chuẩn CTI kèm bài thi nói phản xạ HSKK.",
    "objective": "Chính thức tốt nghiệp Giai đoạn 1 (HSK 1–3): Đạt chứng chỉ quốc tế và hoàn toàn tự chủ trong thế giới tiếng Trung.",
    "prerequisite": "Đã hoàn thành toàn bộ Bài 101–319.",
    "completionCriteria": "Đạt >= 80% điểm bài thi để nhận Vương Miện Master Stage 1.",
    "durationMinutes": 45,
    "xpReward": 150,
    "tags": [
      "HSK 3",
      "Boss Challenge",
      "HSKK Thi nói",
      "Đại tốt nghiệp Stage 1"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Cấu trúc Đại kỳ thi HSK 3 & Khảo thí khẩu ngữ HSKK Sơ cấp",
      "summary": "HSK 3 gồm: 1. Nghe hiểu (40 câu, 35 phút). 2. Đọc hiểu (30 câu, 30 phút, KHÔNG CÒN PINYIN HỖ TRỢ). 3. Viết (10 câu, sắp xếp câu và viết chữ Hán điền từ). HSKK: Nghe nhắc lại và trả lời câu hỏi.",
      "audioDemoText": "gōngxǐ nǐ dàodá hsk sān jí zhōngjí zhànchǎng, qǐng zhǎnxiàn nǐ de shíli"
    },
    "step2_vocabulary": [
      {
        "id": "v-320-1",
        "hanzi": "毕业",
        "pinyin": "bìyè",
        "hanviet": "Tất nghiệp",
        "meaning": "Tốt nghiệp",
        "radical": "十 (Thập)",
        "example": {
          "hanzi": "大学毕业了。",
          "pinyin": "Dàxué bìyè le.",
          "meaning": "Tốt nghiệp đại học rồi."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-320-2",
        "hanzi": "梦想",
        "pinyin": "mèngxiǎng",
        "hanviet": "Mộng tưởng",
        "meaning": "Ước mơ, hoài bão",
        "radical": "夕 (Tịch)",
        "example": {
          "hanzi": "实现梦想。",
          "pinyin": "Shíxiàn mèngxiǎng.",
          "meaning": "Thực hiện ước mơ."
        },
        "pos": "Danh từ / Động từ"
      },
      {
        "id": "v-320-3",
        "hanzi": "未来",
        "pinyin": "wèilái",
        "hanviet": "Vị lai",
        "meaning": "Tương lai",
        "radical": "木 (Mộc)",
        "example": {
          "hanzi": "美好的未来。",
          "pinyin": "Měihǎo de wèilái.",
          "meaning": "Tương lai tốt đẹp."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-320-4",
        "hanzi": "加油",
        "pinyin": "jiāyóu",
        "hanviet": "Gia du",
        "meaning": "Cố lên, nỗ lực lên",
        "radical": "力 (Lực)",
        "example": {
          "hanzi": "一起加油！",
          "pinyin": "Yìqǐ jiāyóu!",
          "meaning": "Cùng nhau cố lên!"
        },
        "pos": "Thán từ / Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "毕",
        "hanzi": "毕",
        "pinyin": "bì",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱比十",
        "radical": {
          "char": "十",
          "name": "Thập",
          "strokes": 2
        },
        "meaning": "Tất cả, tốt nghiệp",
        "strokesCount": 6,
        "strokeOrderText": "Chữ Bỉ 比 (4 nét) -> Bộ Thập 十 (2 nét)",
        "components": [
          "比",
          "十"
        ],
        "mnemonic": "Đem so sánh (比) đạt trọn vẹn điểm mười (十) là đủ điều kiện tốt nghiệp."
      },
      {
        "char": "梦",
        "hanzi": "梦",
        "pinyin": "mèng",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱林夕",
        "radical": {
          "char": "夕",
          "name": "Tịch",
          "strokes": 3
        },
        "meaning": "Giấc mơ, hoài bão",
        "strokesCount": 11,
        "strokeOrderText": "Chữ Lâm 林 (8 nét) -> Bộ Tịch 夕 (3 nét)",
        "components": [
          "林",
          "夕"
        ],
        "mnemonic": "Khi đêm tối (夕) buông xuống rặng cây rừng (林) là lúc giấc mơ cất cánh."
      }
    ],
    "step4_grammar": {
      "title": "Lời dặn dò tâm huyết của Antigravity & HanziGo",
      "formula": "Ngôn ngữ không phải là gánh nặng thi cử, ngôn ngữ là cánh cửa mở ra thế giới mới",
      "explanation": "Từ Bài 101 với những thanh điệu ngọng nghịu đầu tiên, bạn đã kiên trì bước qua 60 bài học để chạm tới đỉnh cao HSK 3 hôm nay. Hãy tự hào về chính mình!",
      "examples": [
        {
          "hanzi": "今天，我用汉语走向更广阔的世界！",
          "pinyin": "Jīntiān, wǒ yòng Hànyǔ zǒuxiàng gèng guǎngkuò de shìjiè!",
          "meaning": "Hôm nay, tôi dùng tiếng Trung bước ra thế giới rộng lớn hơn!"
        }
      ],
      "commonMistake": {
        "wrong": "Nghĩ rằng dừng lại sau HSK 3.",
        "correct": "HSK 3 là bệ phóng vươn tới HSK 4, 5, 6 và dịch thuật chuyên nghiệp.",
        "explanation": "Hành trình học tập là suốt đời."
      }
    },
    "step5_listening": {
      "situation": "Tốt nghiệp cấp độ HSK 3, chúc mừng thành công và hướng tới tương lai",
      "context": "Lễ bế giảng khóa học HSK trung cấp và trao chứng nhận năng lực",
      "participants": "A: Đại diện giáo viên HanziGo, B: Toàn thể học viên",
      "targetGoal": "Tổng kết chặng đường: 毕业 (tốt nghiệp), 梦想 (ước mơ), 未来 (tương lai), 加油 (cố lên)",
      "usageNotes": "Hoàn thành HSK 3 là cột mốc trưởng thành vượt bậc, chuyển từ sơ cấp sang trung cấp tự tin làm việc.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "恭喜各位同学顺利完成了HSK 3级的全部课程，祝贺大家毕业！",
          "pinyin": "Gōngxǐ gèwèi tóngxué shùnlì wánchéng le HSK sān jí de quánbù kèchéng, zhùhè dàjiā bìyè!",
          "meaning": "Chúc mừng các bạn học sinh đã hoàn thành thuận lợi toàn bộ giáo trình HSK 3, chúc mừng mọi người tốt nghiệp!"
        },
        {
          "speaker": "B",
          "hanzi": "感谢老师们一路以来的悉心教导，我们终于实现了最初的梦想！",
          "pinyin": "Gǎnxiè lǎoshīmen yílù yǐlái de xīxīn jiàodǎo, wǒmen zhōngyú shíxiàn le zuìchū de mèngxiǎng!",
          "meaning": "Cảm ơn các thầy cô suốt chặng đường qua đã tận tâm dạy dỗ, cuối cùng chúng em đã hiện thực hóa ước mơ ban đầu!"
        },
        {
          "speaker": "A",
          "hanzi": "HSK 3级是通往更高境界的起点，希望大家在未来的道路上继续努力！",
          "pinyin": "HSK sān jí shì tōng wǎng gèng gāo jìngjiè de qǐdiǎn, xīwàng dàjiā zài wèilái de dàolù shang jìxù nǔlì!",
          "meaning": "HSK 3 là điểm khởi đầu bước tới cảnh giới cao hơn, mong mọi người trên con đường tương lai tiếp tục nỗ lực!"
        },
        {
          "speaker": "B",
          "hanzi": "我们一定会继续坚持，向着HSK 4级和更高的目标冲刺，大家一起加油！",
          "pinyin": "Wǒmen yídìng huì jìxù jiānchí, xiàngzhe HSK sì jí hé gèng gāo de mùbiāo chōngcì, dàjiā yìqǐ jiāyóu!",
          "meaning": "Chúng em nhất định sẽ tiếp tục kiên trì, bứt phá tiến tới mục tiêu HSK 4 và cao hơn nữa, tất cả cùng cố lên!"
        }
      ],
      "audioText": "恭喜各位同学顺利完成了HSK 3级的全部课程，祝贺大家毕业！感谢老师们一路以来的悉心教导，我们终于实现了最初的梦想！HSK 3级是通往更高境界的起点，希望大家在未来的道路上继续努力！我们一定会继续坚持，向着HSK 4级和更高的目标冲刺，大家一起加油！",
      "question": "Tâm thế và mục tiêu tiếp theo của các bạn học viên sau khi tốt nghiệp HSK 3 là gì?",
      "options": [
        "Dừng lại không học tiếp",
        "Tiếp tục kiên trì bứt phá tiến tới HSK 4 và những mục tiêu cao hơn (向着HSK 4级冲刺，大家一起加油)",
        "Bỏ quên tiếng Trung",
        "Chỉ học ngữ pháp cổ"
      ],
      "correctIndex": 1,
      "explanation": "Đại diện học viên khẳng định: \"我们一定会继续坚持，向着HSK 4级和更高的目标冲刺，大家一起加油！\"."
    },
    "step6_speaking": {
      "prompt": "Đọc to lời tuyên ngôn tốt nghiệp Stage 1:",
      "targetSentence": "中国，我来啦！",
      "targetPinyin": "Zhōngguó, wǒ lái la!",
      "targetMeaning": "Trung Quốc ơi, tôi đến đây!",
      "hint": "Đọc vang dội, hào sảng và tràn ngập niềm vui."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Thực hiện ước mơ của tôi",
      "words": [
        "我的梦想",
        "实现"
      ],
      "correctOrder": [
        "实现",
        "我的梦想"
      ],
      "explanation": "实现 + 我的梦想."
    },
    "step8_quiz": [
      {
        "id": "q-320-1",
        "type": "multiple-choice",
        "question": "Điểm khác biệt then chốt giữa phần Đọc hiểu HSK 3 và HSK 1-2 là gì?",
        "options": [
          "Có nhiều tranh hơn",
          "HSK 3 hoàn toàn KHÔNG CÒN PINYIN hỗ trợ trong đề thi đọc hiểu",
          "Bài thi ngắn hơn",
          "Dễ hơn HSK 1"
        ],
        "correctIndex": 1,
        "explanation": "HSK 3 là kỳ thi chính thức cắt bỏ hoàn toàn Pinyin trong bài đọc hiểu."
      },
      {
        "id": "q-320-2",
        "type": "multiple-choice",
        "question": "Sau khi hoàn thành 60 bài học Levels 1–3, bạn đã chính thức làm chủ:",
        "options": [
          "100 chữ Hán",
          "600 từ vựng cốt lõi, 144 điểm ngữ pháp và khả năng du lịch, sinh hoạt, làm việc độc lập",
          "Chỉ biết nghe bập bõm",
          "Không thể tự đi lại"
        ],
        "correctIndex": 1,
        "explanation": "Khẳng định trọn vẹn thành quả sư phạm nghiên cứu của HanziGo."
      }
    ],
    "step9_challenge": {
      "title": "VƯƠNG MIỆN ĐẠI TỐT NGHIỆP STAGE 1",
      "taskDesc": "Đọc to câu tuyên thệ tốt nghiệp trọn vẹn 60 bài học để mở khóa danh hiệu Bậc Thầy Giai Đoạn 1!",
      "targetPhrase": "wǒ chénggōng tōngguò le hsk sān jí bìyè la",
      "xpReward": 150,
      "badge": "Vương Miện Hanzi Master Stage 1"
    }
  }
];

export default HSK_3_LESSONS;
