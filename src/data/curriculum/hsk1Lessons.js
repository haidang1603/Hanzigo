/**
 * =========================================================================
 * HANZI GO - HSK 1 CURRICULUM LESSONS (20 LESSONS)
 * =========================================================================
 * Tách biệt theo cơ chế Granular Chunking nhằm tối ưu dung lượng tải ban đầu.
 * Đảm bảo 100% ID bài học, ID từ vựng, âm Hán Việt và quy trình 9 bước sư phạm.
 */

export const HSK_1_LESSONS = [
  {
    "id": "l-101",
    "chapterId": "ch-1",
    "levelId": "lvl-1",
    "lessonNumber": 1,
    "title": "4 Thanh điệu & Nhóm thanh mẫu môi - đầu lưỡi",
    "chineseTitle": "四声与声母b, p, m, f; d, t, n, l",
    "subtitle": "Nắm vững 4 cao độ thanh điệu chuẩn Bắc Kinh và phát âm chuẩn xác các âm môi, âm đầu lưỡi.",
    "objective": "Nhận diện chuẩn 4 thanh điệu tiếng Trung, phân biệt âm bật hơi p/b và phát âm chính xác thanh mẫu b, p, m, f; d, t, n, l.",
    "prerequisite": "Không có (Bắt đầu từ con số 0)",
    "completionCriteria": "Đạt tối thiểu 70% điểm trắc nghiệm và đọc đúng mẫu câu phát âm.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Pinyin",
      "Thanh điệu",
      "Phát âm"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-8"
    ],
    "step1_learn": {
      "topic": "4 Thanh điệu căn bản & Nhóm thanh mẫu môi - đầu lưỡi",
      "summary": "Tiếng Trung có 4 thanh điệu chính và 1 thanh nhẹ. Độ cao của thanh điệu quyết định nghĩa của từ.",
      "toneGuide": [
        {
          "tone": 1,
          "name": "Thanh 1 (mā, 5-5)",
          "pitch": "5-5",
          "symbol": "ā",
          "desc": "Cao và phẳng, giữ đều hơi như nốt Sol",
          "example": "mā (Mẹ)"
        },
        {
          "tone": 2,
          "name": "Thanh 2 (má, 3-5)",
          "pitch": "3-5",
          "symbol": "á",
          "desc": "Vút từ vừa lên cao, giống dấu sắc tiếng Việt",
          "example": "má (Cây gai)"
        },
        {
          "tone": 3,
          "name": "Thanh 3 (mǎ, 2-1-4)",
          "pitch": "2-1-4",
          "symbol": "ǎ",
          "desc": "Xuống đáy cổ họng rồi hơi vút lên",
          "example": "mǎ (Ngựa)"
        },
        {
          "tone": 4,
          "name": "Thanh 4 (mà, 5-1)",
          "pitch": "5-1",
          "symbol": "à",
          "desc": "Rơi thẳng dứt khoát từ đỉnh xuống đáy, KHÔNG đọc thành dấu huyền tiếng Việt",
          "example": "mà (Mắng)"
        }
      ],
      "initialsGuide": [
        {
          "char": "b",
          "read": "Giống chữ [P] nhẹ tiếng Việt, không bật hơi",
          "example": "bā (Số 8)"
        },
        {
          "char": "p",
          "read": "Bật hơi mạnh luồng gió từ hai môi (tờ giấy ăn phải bay)",
          "example": "pà (Sợ)"
        },
        {
          "char": "d",
          "read": "Đọc giống chữ [T] tiếng Việt (không bật hơi)",
          "example": "dà (To lớn)"
        },
        {
          "char": "t",
          "read": "Đọc giống chữ [Th] tiếng Việt (bật hơi)",
          "example": "tā (Anh ấy)"
        }
      ],
      "audioDemoText": "bā pá mǎ mà dà tā"
    },
    "step2_vocabulary": [
      {
        "id": "v-101-1",
        "hanzi": "八",
        "pinyin": "bā",
        "hanviet": "Bát",
        "meaning": "Số 8",
        "radical": "八 (Bát)",
        "example": {
          "hanzi": "八本书。",
          "pinyin": "Bā běn shū.",
          "meaning": "Tám quyển sách."
        },
        "pos": "Số từ"
      },
      {
        "id": "v-101-2",
        "hanzi": "爸爸",
        "pinyin": "bàba",
        "hanviet": "Ba ba",
        "meaning": "Bố, ba",
        "radical": "父 (Phụ)",
        "example": {
          "hanzi": "爸爸很大。",
          "pinyin": "Bàba hěn dà.",
          "meaning": "Bố to lớn."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-101-3",
        "hanzi": "妈妈",
        "pinyin": "māma",
        "hanviet": "Ma ma",
        "meaning": "Mẹ",
        "radical": "女 (Nữ)",
        "example": {
          "hanzi": "妈妈好。",
          "pinyin": "Māma hǎo.",
          "meaning": "Mẹ tốt đẹp."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-101-4",
        "hanzi": "大",
        "pinyin": "dà",
        "hanviet": "Đại",
        "meaning": "To, lớn",
        "radical": "大 (Đại)",
        "example": {
          "hanzi": "很大。",
          "pinyin": "Hěn dà.",
          "meaning": "Rất to lớn."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-101-5",
        "hanzi": "不",
        "pinyin": "bù",
        "hanviet": "Bất",
        "meaning": "Không (phủ định)",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "不大。",
          "pinyin": "Bú dà.",
          "meaning": "Không to."
        },
        "pos": "Phó từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "八",
        "pinyin": "bā",
        "meaning": "Số 8",
        "strokesCount": 2,
        "strokeOrderText": "Phẩy trước (丿), mác sau (乀)",
        "components": "Bộ Bát (八)",
        "mnemonic": "Hai nét mở rộng sang hai phía thể hiện sự phân tách.",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "八",
        "radical": {
          "char": "八",
          "name": "Bộ Bát",
          "strokes": 2
        }
      },
      {
        "hanzi": "大",
        "pinyin": "dà",
        "meaning": "To lớn",
        "strokesCount": 3,
        "strokeOrderText": "Ngang (一) -> Phẩy (丿) -> Mác (乀)",
        "components": "Bộ Đại (大)",
        "mnemonic": "Hình tượng người dang rộng hai tay và hai chân.",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "大",
        "radical": {
          "char": "大",
          "name": "Bộ Đại",
          "strokes": 3
        }
      }
    ],
    "step4_grammar": {
      "formula": "Chủ ngữ + 不 (bù) + Tính từ / Động từ",
      "title": "Phủ định với phó từ 不 (bù)",
      "explanation": "Từ 不 luôn đứng trước tính từ hoặc động từ để biểu thị sự phủ định.",
      "examples": [
        {
          "hanzi": "爸爸不大。",
          "pinyin": "Bàba bú dà.",
          "meaning": "Bố không to lớn."
        },
        {
          "hanzi": "我不去。",
          "pinyin": "Wǒ bú qù.",
          "meaning": "Tôi không đi."
        }
      ],
      "commonMistake": {
        "wrong": "Đọc thanh 4 thành dấu huyền tiếng Việt (dà đọc thành đà).",
        "correct": "Phát âm dứt khoát rơi từ cao độ 5 xuống 1: dà (Đại).",
        "explanation": "Thanh 4 tiếng Trung cần lực rơi dứt khoát, không kéo dài ngân êm như dấu huyền."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "爸爸大吗？",
          "pinyin": "Bàba dà ma?",
          "meaning": "Bố to lớn không?"
        },
        {
          "speaker": "B",
          "hanzi": "爸爸不大，妈妈大。",
          "pinyin": "Bàba bú dà, māma dà.",
          "meaning": "Bố không to, mẹ to lớn."
        }
      ],
      "audioText": "爸爸大吗？爸爸不大，妈妈大。",
      "question": "Theo bài nghe, người bố như thế nào?",
      "options": [
        "Bố to lớn",
        "Bố không to lớn",
        "Bố rất bận",
        "Bố đang đi học"
      ],
      "correctIndex": 1,
      "explanation": "Người B nói \"爸爸不大\" (Bàba bú dà - Bố không to lớn)."
    },
    "step6_speaking": {
      "prompt": "Hãy đọc to mẫu câu phát âm chuẩn thanh điệu:",
      "targetSentence": "爸爸不大。",
      "targetPinyin": "Bàba bú dà.",
      "targetMeaning": "Bố không to lớn.",
      "hint": "Chú ý biến điệu chữ 不 đứng trước thanh 4 đọc thành \"bú\"."
    },
    "step7_writing": {
      "prompt": "Sắp xếp các từ thành câu phủ định hoàn chỉnh: \"Bố không to lớn\"",
      "words": [
        "大",
        "不",
        "爸爸"
      ],
      "correctOrder": [
        "爸爸",
        "不",
        "大"
      ],
      "explanation": "Trật tự: Chủ ngữ 爸爸 + Phó từ phủ định 不 + Tính từ 大."
    },
    "step8_quiz": [
      {
        "id": "q-101-1",
        "type": "multiple-choice",
        "question": "Thanh mẫu nào sau đây là âm bật hơi mạnh đẩy luồng gió ra môi?",
        "options": [
          "b",
          "p",
          "m",
          "d"
        ],
        "correctIndex": 1,
        "explanation": "Âm \"p\" là âm bật hơi mạnh, khi phát âm giấy ăn trước môi sẽ bay mạnh."
      },
      {
        "id": "q-101-2",
        "type": "multiple-choice",
        "question": "Chữ \"不\" khi đứng trước âm mang thanh 4 (ví dụ: 大 dà) sẽ đọc biến điệu thành thanh mấy?",
        "options": [
          "Thanh 1 (bū)",
          "Thanh 2 (bú)",
          "Thanh 3 (bǔ)",
          "Giữ nguyên thanh 4 (bù)"
        ],
        "correctIndex": 1,
        "explanation": "Chữ 不 (bù) khi đứng trước từ mang thanh 4 bắt buộc biến điệu thành thanh 2: bú dà."
      }
    ],
    "step9_challenge": {
      "title": "Luyện 4 thanh điệu chuẩn xác trong 10 giây",
      "taskDesc": "Đọc to 4 thanh điệu của âm \"ma\": mā - má - mǎ - mà.",
      "targetPhrase": "mā má mǎ mà",
      "xpReward": 50,
      "badge": "Khởi Đầu Phát Âm Chuẩn"
    }
  },
  {
    "id": "l-102",
    "chapterId": "ch-1",
    "levelId": "lvl-1",
    "lessonNumber": 2,
    "title": "Vận mẫu đơn a, o, e, i, u, ü & 8 Nét chữ Hán cơ bản",
    "chineseTitle": "单韵母与汉字八大基本笔画",
    "subtitle": "Nắm vững 6 nguyên âm đơn cốt lõi và làm chủ 8 nét bút nền móng để viết mọi chữ Hán.",
    "objective": "Phát âm chuẩn vận mẫu tròn môi ü, nhận diện và viết đúng 8 nét cơ bản: Ngang, Sổ, Phẩy, Mác, Hất, Chấm, Gập, Móc.",
    "prerequisite": "Đã hoàn thành Bài 101 về thanh mẫu và thanh điệu.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm nhận diện nét chữ và nguyên âm ü.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Vận mẫu",
      "Nét chữ Hán",
      "Bút thuận"
    ],
    "relatedMaterialIds": [
      "mat-4",
      "mat-9"
    ],
    "step1_learn": {
      "topic": "6 Vận mẫu đơn & 8 Nét chữ Hán cơ bản",
      "summary": "Vận mẫu đơn gồm a, o, e, i, u, ü. Đặc biệt âm ü cần giữ khẩu hình tròn môi từ đầu đến cuối.",
      "toneGuide": [
        {
          "tone": 1,
          "name": "Âm ü tròn môi",
          "pitch": "5-5",
          "symbol": "ǖ",
          "desc": "Phát âm chữ [i] nhưng giữ khẩu hình môi tròn chúm lại như chữ [u]",
          "example": "nǚ (Nữ - phụ nữ)"
        }
      ],
      "initialsGuide": [
        {
          "char": "Nét Ngang (横)",
          "read": "Viết từ trái qua phải, hơi chếch nhẹ lên",
          "example": "一 (Nhất)"
        },
        {
          "char": "Nét Sổ (竖)",
          "read": "Kéo thẳng từ trên xuống dưới vuông vức",
          "example": "十 (Thập)"
        },
        {
          "char": "Nét Phẩy (撇)",
          "read": "Kéo từ trên xiên thoai thoải sang trái",
          "example": "八 (Bát)"
        },
        {
          "char": "Nét Mác (捺)",
          "read": "Kéo từ trên xiên thoai thoải sang phải",
          "example": "人 (Nhân)"
        }
      ],
      "audioDemoText": "a o e i u ü nǚ lǜ"
    },
    "step2_vocabulary": [
      {
        "id": "v-102-1",
        "hanzi": "一",
        "pinyin": "yī",
        "hanviet": "Nhất",
        "meaning": "Số 1",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "一个人。",
          "pinyin": "Yí gè rén.",
          "meaning": "Một người."
        },
        "pos": "Số từ"
      },
      {
        "id": "v-102-2",
        "hanzi": "五",
        "pinyin": "wǔ",
        "hanviet": "Ngũ",
        "meaning": "Số 5",
        "radical": "二 (Nhị)",
        "example": {
          "hanzi": "五天。",
          "pinyin": "Wǔ tiān.",
          "meaning": "Năm ngày."
        },
        "pos": "Số từ"
      },
      {
        "id": "v-102-3",
        "hanzi": "女",
        "pinyin": "nǚ",
        "hanviet": "Nữ",
        "meaning": "Nữ, phụ nữ, con gái",
        "radical": "女 (Nữ)",
        "example": {
          "hanzi": "她是女人。",
          "pinyin": "Tā shì nǚrén.",
          "meaning": "Cô ấy là phụ nữ."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-102-4",
        "hanzi": "口",
        "pinyin": "kǒu",
        "hanviet": "Khẩu",
        "meaning": "Miệng, lượng từ người trong gia đình",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "三口人。",
          "pinyin": "Sān kǒu rén.",
          "meaning": "Ba người trong nhà."
        },
        "pos": "Lượng từ / Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "一",
        "pinyin": "yī",
        "meaning": "Số 1",
        "strokesCount": 1,
        "strokeOrderText": "Nét ngang duy nhất (横)",
        "components": "Bộ Nhất (一)",
        "mnemonic": "Một nét ngang tượng trưng cho sự khởi đầu vạn vật.",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "一",
        "radical": {
          "char": "一",
          "name": "Bộ Nhất",
          "strokes": 1
        }
      },
      {
        "hanzi": "口",
        "pinyin": "kǒu",
        "meaning": "Cái miệng",
        "strokesCount": 3,
        "strokeOrderText": "Sổ -> Ngang gập -> Ngang đóng đáy",
        "components": "Bộ Khẩu (口)",
        "mnemonic": "Hình vẽ chiếc miệng mở vuông vức.",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "口",
        "radical": {
          "char": "口",
          "name": "Bộ Khẩu",
          "strokes": 3
        }
      }
    ],
    "step4_grammar": {
      "formula": "Quy tắc thuận bút cơ bản: Ngang trước sổ sau (一 ➔ 十)",
      "title": "Quy tắc vào nhà đóng cửa chữ Hán",
      "explanation": "Khi viết chữ có khung bao quanh như 口, 日, 四: Viết khung ngoài trước, viết ruột bên trong rồi mới viết nét ngang đóng đáy sau cùng.",
      "examples": [
        {
          "hanzi": "十 (Thập - Số 10)",
          "pinyin": "shí",
          "meaning": "Ngang trước sổ sau."
        },
        {
          "hanzi": "日 (Nhật - Mặt trời)",
          "pinyin": "rì",
          "meaning": "Khung ngoài -> Nét trong -> Đóng đáy."
        }
      ],
      "commonMistake": {
        "wrong": "Đóng đáy trước khi viết các nét bên trong chữ.",
        "correct": "Phải viết hết thành phần bên trong rồi mới vẽ nét ngang khoá đáy.",
        "explanation": "Khẩu quyết: \"Vào phòng trước, đóng cửa sau\"."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "这是什么字？",
          "pinyin": "Zhè shì shénme zì?",
          "meaning": "Đây là chữ gì?"
        },
        {
          "speaker": "B",
          "hanzi": "这是口，口有一张。",
          "pinyin": "Zhè shì kǒu, kǒu yǒu yì zhāng.",
          "meaning": "Đây là chữ Khẩu, miệng có một chiếc."
        }
      ],
      "audioText": "这是口，口有一张。",
      "question": "Chữ Hán được nhắc tới mang ý nghĩa gì?",
      "options": [
        "Cái miệng (Khẩu)",
        "Mặt trời (Nhật)",
        "Số một (Nhất)",
        "Phụ nữ (Nữ)"
      ],
      "correctIndex": 0,
      "explanation": "Trong bài đối thoại nhắc tới chữ 口 (kǒu - Khẩu)."
    },
    "step6_speaking": {
      "prompt": "Luyện phát âm nguyên âm tròn môi ü:",
      "targetSentence": "nǚ ér",
      "targetPinyin": "nǚ ér",
      "targetMeaning": "Con gái (nữ nhi)",
      "hint": "Giữ môi tròn chúm lại khi phát âm chữ nǚ."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: \"Nhà tôi có năm người\"",
      "words": [
        "口人",
        "我家",
        "有",
        "五"
      ],
      "correctOrder": [
        "我家",
        "有",
        "五",
        "口人"
      ],
      "explanation": "Cấu trúc: 我家 (Nhà tôi) + 有 (Có) + 五口人 (Năm người)."
    },
    "step8_quiz": [
      {
        "id": "q-102-1",
        "type": "multiple-choice",
        "question": "Khi viết chữ \"十\" (Số 10), nét nào được viết trước?",
        "options": [
          "Nét sổ viết trước",
          "Nét ngang viết trước",
          "Nét chấm viết trước",
          "Tùy ý viết nét nào cũng được"
        ],
        "correctIndex": 1,
        "explanation": "Theo quy tắc thuận bút chữ Hán: Ngang trước sổ sau."
      },
      {
        "id": "q-102-2",
        "type": "multiple-choice",
        "question": "Vận mẫu ü trong tiếng Trung cần giữ khẩu hình thế nào?",
        "options": [
          "Môi bè rộng như cười",
          "Môi tròn chúm lại không thay đổi",
          "Há to miệng hết cỡ",
          "Uốn cong lưỡi lên ngạc cứng"
        ],
        "correctIndex": 1,
        "explanation": "Âm ü là âm tròn môi, phải giữ chặt khẩu hình chúm tròn từ đầu đến cuối."
      }
    ],
    "step9_challenge": {
      "title": "Tập viết đúng thuận bút chữ 口 và 女",
      "taskDesc": "Viết chữ 口 và chữ 女 đúng thứ tự nét ra giấy hoặc trên màn hình cảm ứng.",
      "targetPhrase": "kǒu nǚ",
      "xpReward": 50,
      "badge": "Vững Nét Thuận Bút"
    }
  },
  {
    "id": "l-103",
    "chapterId": "ch-1",
    "levelId": "lvl-1",
    "lessonNumber": 3,
    "title": "Nhóm âm khó: z, c, s vs zh, ch, sh, r & Quy tắc viết chữ Hán",
    "chineseTitle": "平翘舌音与汉字书写规则",
    "subtitle": "Đập tan nỗi sợ âm đầu lưỡi và âm cuốn lưỡi, chuẩn hóa ngữ âm như người Bắc Kinh.",
    "objective": "Phân biệt rạch ròi cặp âm thẳng lưỡi (z, c, s) và âm uốn lưỡi (zh, ch, sh, r), làm chủ 7 quy tắc thuận bút.",
    "prerequisite": "Đã hoàn thành Bài 101 và 102.",
    "completionCriteria": "Vượt qua bài kiểm tra phân biệt âm s và sh với điểm >= 70%.",
    "durationMinutes": 25,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Âm uốn lưỡi",
      "Quy tắc viết",
      "Pinyin khó"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Âm đầu lưỡi (z, c, s) đối chiếu Âm uốn lưỡi (zh, ch, sh, r)",
      "summary": "z, c, s: Đầu lưỡi thẳng chạm mặt sau răng trên. zh, ch, sh, r: Đầu lưỡi cong uốn lên vòm họng ngạc cứng.",
      "toneGuide": [
        {
          "tone": 1,
          "name": "Cặp âm đối chiếu",
          "pitch": "5-5",
          "symbol": "sī vs shī",
          "desc": "sī (thẳng lưỡi) khác với shī (uốn cong đầu lưỡi)",
          "example": "sān (Số 3) vs shān (Ngọn núi)"
        }
      ],
      "initialsGuide": [
        {
          "char": "z",
          "read": "Đầu lưỡi thẳng, đọc như chữ [ch] nhẹ không bật hơi",
          "example": "zǎo (Sớm)"
        },
        {
          "char": "c",
          "read": "Đầu lưỡi thẳng, bật luồng hơi xì qua khe răng",
          "example": "cài (Món ăn)"
        },
        {
          "char": "zh",
          "read": "Uốn cong đầu lưỡi lên ngạc cứng, không bật hơi",
          "example": "zhōng (Trung)"
        },
        {
          "char": "ch",
          "read": "Uốn cong đầu lưỡi và BẬT HƠI mạnh mẽ",
          "example": "chī (Ăn)"
        }
      ],
      "audioDemoText": "sān shān zǎo zhǎo cài chài"
    },
    "step2_vocabulary": [
      {
        "id": "v-103-1",
        "hanzi": "三",
        "pinyin": "sān",
        "hanviet": "Tam",
        "meaning": "Số 3",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "三个。",
          "pinyin": "Sān gè.",
          "meaning": "Ba cái."
        },
        "pos": "Số từ"
      },
      {
        "id": "v-103-2",
        "hanzi": "十",
        "pinyin": "shí",
        "hanviet": "Thập",
        "meaning": "Số 10",
        "radical": "十 (Thập)",
        "example": {
          "hanzi": "十四。",
          "pinyin": "Shí sì.",
          "meaning": "Mười bốn."
        },
        "pos": "Số từ"
      },
      {
        "id": "v-103-3",
        "hanzi": "吃",
        "pinyin": "chī",
        "hanviet": "Cật",
        "meaning": "Ăn",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "吃饭。",
          "pinyin": "Chī fàn.",
          "meaning": "Ăn cơm."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-103-4",
        "hanzi": "四",
        "pinyin": "sì",
        "hanviet": "Tứ",
        "meaning": "Số 4",
        "radical": "囗 (Vi)",
        "example": {
          "hanzi": "四天。",
          "pinyin": "Sì tiān.",
          "meaning": "Bốn ngày."
        },
        "pos": "Số từ"
      },
      {
        "id": "v-103-5",
        "hanzi": "人",
        "pinyin": "rén",
        "hanviet": "Nhân",
        "meaning": "Người",
        "radical": "人 (Nhân)",
        "example": {
          "hanzi": "中国人。",
          "pinyin": "Zhōngguó rén.",
          "meaning": "Người Trung Quốc."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "人",
        "pinyin": "rén",
        "meaning": "Con người",
        "strokesCount": 2,
        "strokeOrderText": "Phẩy trước (丿), Mác sau (乀)",
        "components": "Bộ Nhân (人)",
        "mnemonic": "Hình tượng con người đang bước đi trên hai chân vững chãi.",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "人",
        "radical": {
          "char": "人",
          "name": "Bộ Nhân",
          "strokes": 2
        }
      },
      {
        "hanzi": "十",
        "pinyin": "shí",
        "meaning": "Số 10",
        "strokesCount": 2,
        "strokeOrderText": "Ngang trước (一), Sổ sau (丨)",
        "components": "Bộ Thập (十)",
        "mnemonic": "Đầy đủ thập toàn thập mỹ theo bốn phương tám hướng.",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "十",
        "radical": {
          "char": "十",
          "name": "Bộ Thập",
          "strokes": 2
        }
      }
    ],
    "step4_grammar": {
      "formula": "Thần chú líu lưỡi kinh điển: 四是四，十是十 (sì shì sì, shí shì shí)",
      "title": "Phân biệt số 4 (sì - thẳng lưỡi) và số 10 (shí - uốn lưỡi)",
      "explanation": "Người Việt rất dễ nhầm lẫn hai âm này dẫn đến việc mua hàng nghe nhầm giá tiền từ 4 tệ thành 10 tệ.",
      "examples": [
        {
          "hanzi": "十四 (shísì)",
          "pinyin": "shísì",
          "meaning": "Mười bốn (uốn lưỡi trước, thẳng lưỡi sau)."
        },
        {
          "hanzi": "四十 (sìshí)",
          "pinyin": "sìshí",
          "meaning": "Bốn mươi (thẳng lưỡi trước, uốn lưỡi sau)."
        }
      ],
      "commonMistake": {
        "wrong": "Đọc số 4 và số 10 giống hệt nhau không uốn lưỡi.",
        "correct": "Số 4 đầu lưỡi sát răng (sì); số 10 đầu lưỡi uốn lên vòm họng (shí).",
        "explanation": "Hãy luyện tập câu líu lưỡi để phản xạ lưỡi linh hoạt."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你要吃什么？",
          "pinyin": "Nǐ yào chī shénme?",
          "meaning": "Bạn muốn ăn gì?"
        },
        {
          "speaker": "B",
          "hanzi": "我要吃四个包子。",
          "pinyin": "Wǒ yào chī sì gè bāozi.",
          "meaning": "Tôi muốn ăn 4 chiếc bánh bao."
        }
      ],
      "audioText": "你要吃什么？我要吃四个包子。",
      "question": "Người B muốn ăn bao nhiêu chiếc bánh bao?",
      "options": [
        "10 chiếc (shí)",
        "4 chiếc (sì)",
        "3 chiếc (sān)",
        "14 chiếc (shísì)"
      ],
      "correctIndex": 1,
      "explanation": "Người B nói \"四个\" (sì gè - bốn chiếc)."
    },
    "step6_speaking": {
      "prompt": "Đọc câu líu lưỡi kinh điển kiểm tra độ chuẩn của lưỡi:",
      "targetSentence": "四是四，十是十。",
      "targetPinyin": "Sì shì sì, shí shì shí.",
      "targetMeaning": "Bốn là bốn, mười là mười.",
      "hint": "Chữ sì thẳng lưỡi dứt khoát, chữ shí uốn cong đầu lưỡi lên ngạc cứng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: \"Người Trung Quốc ăn cơm\"",
      "words": [
        "吃饭",
        "中国人"
      ],
      "correctOrder": [
        "中国人",
        "吃饭"
      ],
      "explanation": "Chủ ngữ 中国人 + Động từ tân ngữ 吃饭."
    },
    "step8_quiz": [
      {
        "id": "q-103-1",
        "type": "multiple-choice",
        "question": "Khi phát âm thanh mẫu \"ch\" (trong chữ 吃 chī), đầu lưỡi và luồng hơi hoạt động thế nào?",
        "options": [
          "Lưỡi thẳng, không bật hơi",
          "Uốn cong đầu lưỡi lên ngạc cứng và bật hơi mạnh",
          "Đầu lưỡi chạm răng dưới",
          "Không dùng luồng hơi"
        ],
        "correctIndex": 1,
        "explanation": "ch là âm uốn lưỡi và có bật hơi mạnh mẽ từ khoang miệng."
      },
      {
        "id": "q-103-2",
        "type": "multiple-choice",
        "question": "Từ \"四十\" (bốn mươi) phát âm Pinyin chính xác là gì?",
        "options": [
          "shísì",
          "sìshí",
          "shíshí",
          "sìsì"
        ],
        "correctIndex": 1,
        "explanation": "Bốn mươi là sì (4) + shí (10) ➔ sìshí."
      }
    ],
    "step9_challenge": {
      "title": "Thử thách câu líu lưỡi 4 và 10 trong 8 giây",
      "taskDesc": "Đọc to không vấp: \"Sì shì sì, shí shì shí, shísì shì shísì\".",
      "targetPhrase": "sì shì sì shí shì shí",
      "xpReward": 50,
      "badge": "Bậc Thầy Líu Lưỡi Pinyin"
    }
  },
  {
    "id": "l-104",
    "chapterId": "ch-1",
    "levelId": "lvl-1",
    "lessonNumber": 4,
    "title": "Vận mẫu kép & 10 Bộ thủ thông dụng nhất (Phần 1)",
    "chineseTitle": "复韵母与前十大常用部首",
    "subtitle": "Nắm chắc các vận mẫu kép ai, ei, ao, ou, an, en, ang, eng và 10 bộ thủ giúp đoán nghĩa 500 chữ Hán.",
    "objective": "Phát âm chuẩn vận mẫu mũi (an/ang, en/eng), nhận diện 10 bộ thủ: Nhân đứng, Nữ, Khẩu, Thủy, Hỏa, Mộc, Nhật, Nguyệt, Tâm, Ngôn.",
    "prerequisite": "Đã nắm vững Bài 101–103.",
    "completionCriteria": "Nhận diện đúng bộ thủ và ý nghĩa liên kết trong trắc nghiệm >= 70%.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Vận mẫu kép",
      "Bộ thủ",
      "Chiết tự"
    ],
    "relatedMaterialIds": [
      "mat-4",
      "mat-8"
    ],
    "step1_learn": {
      "topic": "Vận mẫu mũi & 10 Bộ thủ đoán nghĩa thần thánh",
      "summary": "Vận mẫu kết thúc bằng n là âm mũi trước (an, en, in), kết thúc bằng ng là âm mũi sau mở rộng họng (ang, eng, ing, ong). Bộ thủ là chìa khóa mở kho báu chữ Hán.",
      "toneGuide": [
        {
          "tone": 1,
          "name": "Âm mũi an vs ang",
          "pitch": "5-5",
          "symbol": "ān vs āng",
          "desc": "an khép đầu lưỡi vào chân răng trên; ang mở rộng khoang miệng ngân họng",
          "example": "gān (Khô) vs gāng (Vừa mới)"
        }
      ],
      "initialsGuide": [
        {
          "char": "亻 (Nhân đứng)",
          "read": "Liên quan đến con người: 你 (bạn), 他 (anh ấy), 们 (chúng tôi)"
        },
        {
          "char": "氵 (Ba chấm thủy)",
          "read": "Liên quan đến nước, chất lỏng: 水 (nước), 河 (sông), 海 (biển)"
        },
        {
          "char": "讠 (Bộ Ngôn)",
          "read": "Liên quan đến lời nói, ngôn ngữ: 说 (nói), 话 (lời), 语 (ngôn ngữ)"
        }
      ],
      "audioDemoText": "bān bāng fēn fēng hán háng"
    },
    "step2_vocabulary": [
      {
        "id": "v-104-1",
        "hanzi": "水",
        "pinyin": "shuǐ",
        "hanviet": "Thủy",
        "meaning": "Nước",
        "radical": "水 (Thủy)",
        "example": {
          "hanzi": "喝水。",
          "pinyin": "Hē shuǐ.",
          "meaning": "Uống nước."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-104-2",
        "hanzi": "火",
        "pinyin": "huǒ",
        "hanviet": "Hỏa",
        "meaning": "Lửa",
        "radical": "火 (Hỏa)",
        "example": {
          "hanzi": "大火。",
          "pinyin": "Dà huǒ.",
          "meaning": "Lửa lớn."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-104-3",
        "hanzi": "木",
        "pinyin": "mù",
        "hanviet": "Mộc",
        "meaning": "Gỗ, cây cối",
        "radical": "木 (Mộc)",
        "example": {
          "hanzi": "树木。",
          "pinyin": "Shùmù.",
          "meaning": "Cây cối."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-104-4",
        "hanzi": "月",
        "pinyin": "yuè",
        "hanviet": "Nguyệt",
        "meaning": "Mặt trăng, tháng",
        "radical": "月 (Nguyệt)",
        "example": {
          "hanzi": "一月。",
          "pinyin": "Yī yuè.",
          "meaning": "Tháng một."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-104-5",
        "hanzi": "日",
        "pinyin": "rì",
        "hanviet": "Nhật",
        "meaning": "Mặt trời, ngày",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "今日。",
          "pinyin": "Jīnrì.",
          "meaning": "Hôm nay."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "水",
        "pinyin": "shuǐ",
        "meaning": "Nước",
        "strokesCount": 4,
        "strokeOrderText": "Sổ móc giữa trước -> Phẩy gập trái -> Phẩy phải -> Mác",
        "components": "Bộ Thủy (水)",
        "mnemonic": "Dòng nước chảy cuồn cuộn ở giữa và các bọt nước bắn ra hai bên.",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "水",
        "radical": {
          "char": "水",
          "name": "Bộ Thủy",
          "strokes": 4
        }
      },
      {
        "hanzi": "木",
        "pinyin": "mù",
        "meaning": "Cây cối, gỗ",
        "strokesCount": 4,
        "strokeOrderText": "Ngang -> Sổ -> Phẩy -> Mác",
        "components": "Bộ Mộc (木)",
        "mnemonic": "Hình thân cây với cành lá phía trên và rễ tỏa phía dưới.",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "木",
        "radical": {
          "char": "木",
          "name": "Bộ Mộc",
          "strokes": 4
        }
      }
    ],
    "step4_grammar": {
      "formula": "Bộ thủ chỉ ý + Thành phần chỉ âm = Chữ hình thanh (80% chữ Hán)",
      "title": "Bí mật đoán nghĩa chữ Hán qua bộ thủ",
      "explanation": "Nhìn thấy bộ Thủy (氵) là biết chữ đó liên quan đến nước; nhìn thấy bộ Mộc (木) là biết liên quan đến cây cối đồ gỗ.",
      "examples": [
        {
          "hanzi": "林 (Rừng thưa)",
          "pinyin": "lín",
          "meaning": "Hai chữ Mộc ghép lại (nhiều cây cối)."
        },
        {
          "hanzi": "森 (Rừng rậm)",
          "pinyin": "sēn",
          "meaning": "Ba chữ Mộc xếp chồng lên nhau thành đại ngàn."
        }
      ],
      "commonMistake": {
        "wrong": "Học vẹt từng nét mà không nắm bộ thủ.",
        "correct": "Phân tích bộ thủ giúp nhớ sâu và viết chữ chính xác gấp 3 lần.",
        "explanation": "Bộ thủ là bảng chữ cái tư duy tượng hình của người Trung Hoa."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你喝水吗？",
          "pinyin": "Nǐ hē shuǐ ma?",
          "meaning": "Bạn uống nước không?"
        },
        {
          "speaker": "B",
          "hanzi": "我喝水，谢谢！",
          "pinyin": "Wǒ hē shuǐ, xièxie!",
          "meaning": "Tôi uống nước, cảm ơn!"
        }
      ],
      "audioText": "你喝水吗？我喝水，谢谢！",
      "question": "Người B chọn uống gì?",
      "options": [
        "Uống trà",
        "Uống nước lọc",
        "Uống cà phê",
        "Không uống gì"
      ],
      "correctIndex": 1,
      "explanation": "Người B nói rõ: \"我喝水\" (Wǒ hē shuǐ - Tôi uống nước)."
    },
    "step6_speaking": {
      "prompt": "Nói câu đề nghị mời nước lịch sự:",
      "targetSentence": "请喝水。",
      "targetPinyin": "Qǐng hē shuǐ.",
      "targetMeaning": "Mời uống nước.",
      "hint": "Phát âm shuǐ với âm uốn lưỡi sh và thanh 3."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: \"Tôi uống nước\"",
      "words": [
        "水",
        "喝",
        "我"
      ],
      "correctOrder": [
        "我",
        "喝",
        "水"
      ],
      "explanation": "Thứ tự: Chủ ngữ 我 + Động từ 喝 + Tân ngữ 水."
    },
    "step8_quiz": [
      {
        "id": "q-104-1",
        "type": "multiple-choice",
        "question": "Bộ thủ \"氵\" (Ba chấm thủy) thường xuất hiện trong những chữ Hán mang nghĩa liên quan đến:",
        "options": [
          "Nước, sông hồ, chất lỏng",
          "Lửa, nhiệt độ cao",
          "Cây cối, rừng rậm",
          "Lời nói, giao tiếp"
        ],
        "correctIndex": 0,
        "explanation": "Bộ Ba chấm thủy (氵) biểu thị nước hoặc chất lỏng."
      },
      {
        "id": "q-104-2",
        "type": "multiple-choice",
        "question": "Chữ \"森\" (sēn - Rừng rậm) được tạo thành từ 3 chữ nào ghép lại?",
        "options": [
          "3 chữ Hỏa (火)",
          "3 chữ Mộc (木)",
          "3 chữ Thủy (水)",
          "3 chữ Nhật (日)"
        ],
        "correctIndex": 1,
        "explanation": "Chữ 森 gồm 3 chữ Mộc (木) hợp thành chỉ rừng rậm bạt ngàn."
      }
    ],
    "step9_challenge": {
      "title": "Nhận diện 5 bộ thủ trong văn bản thực tế",
      "taskDesc": "Chỉ ra bộ thủ của các chữ: 你 (Nhân đứng), 妈 (Nữ), 喝 (Khẩu), 河 (Thủy), 说 (Ngôn).",
      "targetPhrase": "rén nǚ kǒu shuǐ yán",
      "xpReward": 50,
      "badge": "Thần Nhãn Chiết Tự"
    }
  },
  {
    "id": "l-105",
    "chapterId": "ch-1",
    "levelId": "lvl-1",
    "lessonNumber": 5,
    "title": "Quy tắc biến điệu thực chiến & Ôn tập Module 1.1",
    "chineseTitle": "变调实战与模块一复习",
    "subtitle": "Làm chủ bí kíp biến điệu 2 thanh 3, biến điệu chữ 不 và chữ 一, tổng duyệt sẵn sàng đấu Boss.",
    "objective": "Nắm vững quy tắc biến điệu thanh 3, biến điệu chữ 一 (yī/yí/yì) và chữ 不 (bù/bú), đạt điều kiện mở khóa Boss 1.",
    "prerequisite": "Đã hoàn thành Bài 101–104.",
    "completionCriteria": "Đạt >= 80% điểm bài tập tổng kết Module 1.1.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 1",
      "Biến điệu",
      "Tổng kết Module",
      "Review Checkpoint"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-8"
    ],
    "step1_learn": {
      "topic": "3 Quy tắc biến điệu quan trọng nhất trong tiếng Trung",
      "summary": "1. Hai thanh 3 đi liền nhau -> 3+3 biến thành 2+3 (nǐ hǎo -> ní hǎo). 2. Chữ 不 đứng trước thanh 4 -> biến thành bú (bú shì). 3. Chữ 一 đứng trước thanh 4 biến thành yí (yí gè), trước thanh 1,2,3 biến thành yì (yì tiān, yì nián, yì qǐ).",
      "toneGuide": [
        {
          "tone": 1,
          "name": "Biến điệu chữ 一",
          "pitch": "Biến thanh",
          "symbol": "yí / yì",
          "desc": "Đứng trước thanh 4 đọc yí; đứng trước thanh 1, 2, 3 đọc yì",
          "example": "yí gè (một cái), yì tiān (một ngày)"
        }
      ],
      "initialsGuide": [
        {
          "char": "Biến điệu thanh 3",
          "read": "nǐ + hǎo ➔ ní hǎo; wǒ + hěn + hǎo ➔ wǒ hén hǎo"
        },
        {
          "char": "Biến điệu chữ 不",
          "read": "bù + shì ➔ bú shì; bù + dà ➔ bú dà"
        }
      ],
      "audioDemoText": "ní hǎo, bú shì, yí gè, yì tiān, yì qǐ"
    },
    "step2_vocabulary": [
      {
        "id": "v-105-1",
        "hanzi": "你好",
        "pinyin": "nǐ hǎo",
        "hanviet": "Nhĩ hảo",
        "meaning": "Xin chào",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "你好！很高兴认识你。",
          "pinyin": "Nǐ hǎo! Hěn gāoxìng rènshi nǐ.",
          "meaning": "Xin chào! Rất vui được quen bạn."
        },
        "pos": "Cụm giao tiếp"
      },
      {
        "id": "v-105-2",
        "hanzi": "不是",
        "pinyin": "bú shì",
        "hanviet": "Bất thị",
        "meaning": "Không phải là",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "我不是老师。",
          "pinyin": "Wǒ bú shì lǎoshī.",
          "meaning": "Tôi không phải là giáo viên."
        },
        "pos": "Cụm vị ngữ phủ định"
      },
      {
        "id": "v-105-3",
        "hanzi": "一个",
        "pinyin": "yí gè",
        "hanviet": "Nhất cá",
        "meaning": "Một cái / một người",
        "radical": "人 (Nhân)",
        "example": {
          "hanzi": "一个人。",
          "pinyin": "Yí gè rén.",
          "meaning": "Một người."
        },
        "pos": "Cụm số lượng từ"
      },
      {
        "id": "v-105-4",
        "hanzi": "一起",
        "pinyin": "yìqǐ",
        "hanviet": "Nhất khởi",
        "meaning": "Cùng nhau",
        "radical": "走 (Tẩu)",
        "example": {
          "hanzi": "我们一起去。",
          "pinyin": "Wǒmen yìqǐ qù.",
          "meaning": "Chúng ta cùng đi."
        },
        "pos": "Phó từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "个",
        "pinyin": "gè",
        "meaning": "Cái, chiếc (lượng từ phổ biến nhất)",
        "strokesCount": 3,
        "strokeOrderText": "Phẩy -> Sổ -> Nét sổ giữa",
        "components": "Bộ Nhân (人)",
        "mnemonic": "Một con người độc lập đơn lẻ.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱人丨",
        "radical": {
          "char": "人",
          "name": "Bộ Nhân",
          "strokes": 2
        }
      },
      {
        "hanzi": "起",
        "pinyin": "qǐ",
        "meaning": "Dậy, khởi đầu",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Tẩu (走) bên trái trước, chữ Kỷ (己) bên phải sau",
        "components": "Bộ Tẩu (走) + Kỷ (己)",
        "mnemonic": "Bản thân (己) cất bước chân đi (走) để bắt đầu hành trình.",
        "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿺"
        },
        "ids": "⿺走己",
        "radical": {
          "char": "走",
          "name": "Bộ Tẩu",
          "strokes": 7
        }
      }
    ],
    "step4_grammar": {
      "formula": "Nguyên tắc vàng: Biến âm khi nói, nhưng Pinyin gốc vẫn viết nguyên bản trên sách",
      "title": "Đọc biến điệu nhưng viết đúng âm gốc",
      "explanation": "Trong sách giáo khoa và từ điển, chữ 你好 vẫn in pinyin là nǐ hǎo, chữ 不是 vẫn in bù shì; người học phải tự động áp dụng quy tắc biến điệu khi phát âm.",
      "examples": [
        {
          "hanzi": "你好 (Viết: nǐ hǎo)",
          "pinyin": "ní hǎo",
          "meaning": "Đọc là ní hǎo."
        },
        {
          "hanzi": "不是 (Viết: bù shì)",
          "pinyin": "bú shì",
          "meaning": "Đọc là bú shì."
        }
      ],
      "commonMistake": {
        "wrong": "Viết trên bài thi Pinyin chữ nǐ biến thành ní.",
        "correct": "Pinyin viết vẫn giữ nguyên thanh 3 gốc, chỉ có miệng đọc thành thanh 2.",
        "explanation": "Khảo thí HSK quốc tế chấm điểm theo âm vị gốc."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你好！你是一个人吗？",
          "pinyin": "Nǐ hǎo! Nǐ shì yí gè rén ma?",
          "meaning": "Xin chào! Bạn đi một mình à?"
        },
        {
          "speaker": "B",
          "hanzi": "不是，我们一起去。",
          "pinyin": "Bú shì, wǒmen yìqǐ qù.",
          "meaning": "Không phải, chúng tôi cùng đi."
        }
      ],
      "audioText": "你好！你是一个人吗？不是，我们一起去。",
      "question": "Người B đi một mình hay đi cùng người khác?",
      "options": [
        "Đi một mình",
        "Cùng đi với người khác",
        "Không đi đâu cả",
        "Đang ở nhà ngủ"
      ],
      "correctIndex": 1,
      "explanation": "Người B nói: \"不是，我们一起去\" (Chúng tôi cùng đi)."
    },
    "step6_speaking": {
      "prompt": "Đọc to câu giao tiếp ứng dụng trọn vẹn cả 3 quy tắc biến điệu:",
      "targetSentence": "你好，我不是一个人。",
      "targetPinyin": "Nǐ hǎo, wǒ bú shì yí gè rén.",
      "targetMeaning": "Xin chào, tôi không phải đi một mình.",
      "hint": "Đọc mượt mà: ní hǎo - wǒ bú shì - yí gè rén."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu hoàn chỉnh: \"Chúng tôi cùng nhau ăn cơm\"",
      "words": [
        "吃饭",
        "一起",
        "我们"
      ],
      "correctOrder": [
        "我们",
        "一起",
        "吃饭"
      ],
      "explanation": "Chủ ngữ 我们 + Phó từ 一起 + Động từ 吃饭."
    },
    "step8_quiz": [
      {
        "id": "q-105-1",
        "type": "multiple-choice",
        "question": "Cụm từ \"一个\" (yī + gè) sẽ được phát âm biến điệu thế nào khi chữ 个 mang thanh 4?",
        "options": [
          "yī gè",
          "yí gè",
          "yì gè",
          "yǐ gè"
        ],
        "correctIndex": 1,
        "explanation": "Chữ 一 đứng trước thanh 4 biến thành thanh 2: yí gè."
      },
      {
        "id": "q-105-2",
        "type": "multiple-choice",
        "question": "Trong câu \"我很好\" (wǒ hěn hǎo), có ba thanh 3 đi liền nhau thì biến điệu thông thường ra sao?",
        "options": [
          "wǒ hén hǎo (2-2-3 hoặc 3-2-3)",
          "giữ nguyên cả ba thanh 3",
          "đổi cả ba thành thanh 1",
          "đổi thành wò hèn hào"
        ],
        "correctIndex": 0,
        "explanation": "Ba thanh 3 đi liền nhau thường ngắt cụm wǒ + (hén hǎo) đọc là wǒ hén hǎo."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa trận chiến Boss Chapter 1",
      "taskDesc": "Vượt qua bài tập Module 1.1 để bước vào đại chiến ngữ âm với Thầy Vương!",
      "targetPhrase": "nǐ hǎo bú shì yí gè",
      "xpReward": 60,
      "badge": "Sẵn Sàng Diệt Boss Ngữ Âm"
    }
  },
  {
    "id": "l-106",
    "chapterId": "ch-2",
    "levelId": "lvl-1",
    "lessonNumber": 6,
    "title": "Chào hỏi lịch sự, cảm ơn & tạm biệt",
    "chineseTitle": "礼貌问好、感谢与告别",
    "subtitle": "Tự tin xưng hô với kính ngữ 您, cảm ơn đúng mực và đáp lại lịch thiệp với 不客气.",
    "objective": "Chào hỏi tự tin trong mọi hoàn cảnh, biết dùng kính ngữ 您 với người lớn tuổi, đáp lại lời cảm ơn chuẩn mực.",
    "prerequisite": "Đã hoàn thành Module 1.1 (Bài 101–105).",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đóng vai chào hỏi lưu loát.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Chào hỏi",
      "Kính ngữ",
      "Giao tiếp"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-5"
    ],
    "step1_learn": {
      "topic": "Văn hóa chào hỏi & Kính ngữ 您 (nín)",
      "summary": "Kính ngữ 您 ghép từ chữ 你 (bạn) ở trên và chữ 心 (trái tim) ở dưới, biểu thị sự tôn kính tự đáy lòng.",
      "initialsGuide": [
        {
          "char": "你好 (nǐ hǎo)",
          "read": "Chào bạn bè đồng trang lứa"
        },
        {
          "char": "您好 (nín hǎo)",
          "read": "Chào người lớn tuổi, thầy cô, đối tác"
        },
        {
          "char": "不客气 (bú kèqi)",
          "read": "Đáp lại khi ai đó cảm ơn"
        },
        {
          "char": "再见 (zàijiàn)",
          "read": "Tạm biệt (hẹn gặp lại)"
        }
      ],
      "audioDemoText": "nín hǎo, xièxie nǐ, bú kèqi, zàijiàn"
    },
    "step2_vocabulary": [
      {
        "id": "v-106-1",
        "hanzi": "您",
        "pinyin": "nín",
        "hanviet": "Nhẫm",
        "meaning": "Ngài, ông, thầy (ngôi 2 tôn kính)",
        "radical": "心 (Tâm)",
        "example": {
          "hanzi": "老师，您好！",
          "pinyin": "Lǎoshī, nín hǎo!",
          "meaning": "Em chào thầy ạ!"
        },
        "pos": "Đại từ"
      },
      {
        "id": "v-106-2",
        "hanzi": "谢谢",
        "pinyin": "xièxie",
        "hanviet": "Tạ tạ",
        "meaning": "Cảm ơn",
        "radical": "讠 (Ngôn)",
        "example": {
          "hanzi": "太谢谢你了！",
          "pinyin": "Tài xièxie nǐ le!",
          "meaning": "Vô cùng cảm ơn bạn!"
        },
        "pos": "Động từ"
      },
      {
        "id": "v-106-3",
        "hanzi": "不客气",
        "pinyin": "bú kèqi",
        "hanviet": "Bất khách khí",
        "meaning": "Không có chi, đừng khách sáo",
        "radical": "宀 (Miên)",
        "example": {
          "hanzi": "不用谢，不客气。",
          "pinyin": "Bú yòng xiè, bú kèqi.",
          "meaning": "Không cần cảm ơn, đừng khách sáo."
        },
        "pos": "Cụm giao tiếp"
      },
      {
        "id": "v-106-4",
        "hanzi": "再见",
        "pinyin": "zàijiàn",
        "hanviet": "Tái kiến",
        "meaning": "Tạm biệt, hẹn gặp lại",
        "radical": "见 (Kiến)",
        "example": {
          "hanzi": "明天再见！",
          "pinyin": "Míngtiān zàijiàn!",
          "meaning": "Ngày mai gặp lại nhé!"
        },
        "pos": "Cụm giao tiếp"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "您",
        "pinyin": "nín",
        "meaning": "Ngài (kính ngữ)",
        "strokesCount": 11,
        "strokeOrderText": "Chữ 你 ở trên -> Bộ Tâm (心) ở dưới",
        "components": "你 + 心",
        "mnemonic": "Đặt bạn ở trong trái tim thể hiện sự tôn trọng tuyệt đối.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱你心",
        "radical": {
          "char": "心",
          "name": "Bộ Tâm",
          "strokes": 4
        }
      },
      {
        "hanzi": "见",
        "pinyin": "jiàn",
        "meaning": "Gặp gỡ",
        "strokesCount": 4,
        "strokeOrderText": "Sổ -> Ngang gập -> Phẩy -> Sổ cong móc",
        "components": "Bộ Kiến (见)",
        "mnemonic": "Đôi mắt to dõi theo đôi chân đi gặp gỡ bạn bè.",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "见",
        "radical": {
          "char": "见",
          "name": "Bộ Kiến",
          "strokes": 4
        }
      }
    ],
    "step4_grammar": {
      "formula": "Đối tượng xưng hô + 好！ (Ví dụ: 老师好！ 同学们好！)",
      "title": "Công thức chào hỏi lịch sự tiếng Trung",
      "explanation": "Trong tiếng Trung, khi chào ai đó một cách trang trọng, ta đặt danh xưng của người đó lên trước chữ 好.",
      "examples": [
        {
          "hanzi": "王老师好！",
          "pinyin": "Wáng lǎoshī hǎo!",
          "meaning": "Em chào thầy Vương ạ!"
        },
        {
          "hanzi": "大家晚上好！",
          "pinyin": "Dàjiā wǎnshang hǎo!",
          "meaning": "Chào buổi tối mọi người!"
        }
      ],
      "commonMistake": {
        "wrong": "Chào thầy giáo là \"好老师\".",
        "correct": "Phải nói: \"老师好！\" (Danh xưng đứng trước chữ 好).",
        "explanation": "Trật tự lời chào tiếng Trung ngược lại so với cách nói \"Chào thầy\" của tiếng Việt."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Học sinh",
          "hanzi": "李老师，您好！",
          "pinyin": "Lǐ lǎoshī, nín hǎo!",
          "meaning": "Thưa cô Lý, em chào cô ạ!"
        },
        {
          "speaker": "Cô Lý",
          "hanzi": "你好！谢谢你的花。",
          "pinyin": "Nǐ hǎo! Xièxie nǐ de huā.",
          "meaning": "Chào em! Cảm ơn bó hoa của em nhé."
        },
        {
          "speaker": "Học sinh",
          "hanzi": "老师不客气，老师再见！",
          "pinyin": "Lǎoshī bú kèqi, lǎoshī zàijiàn!",
          "meaning": "Dạ không có chi cô ạ, em chào cô em về!"
        }
      ],
      "audioText": "李老师，您好！你好！谢谢你的花。老师不客气，老师再见！",
      "question": "Người học sinh tặng cô giáo món quà gì?",
      "options": [
        "Quyển sách",
        "Bó hoa (huā)",
        "Ly trà sữa",
        "Chiếc bánh bao"
      ],
      "correctIndex": 1,
      "explanation": "Cô Lý nói: \"谢谢你的花\" (Cảm ơn bó hoa của em)."
    },
    "step6_speaking": {
      "prompt": "Gặp đối tác lớn tuổi, hãy chào họ bằng kính ngữ:",
      "targetSentence": "您好，很高兴认识您！",
      "targetPinyin": "Nín hǎo, hěn gāoxìng rènshi nín!",
      "targetMeaning": "Kính chào ngài, rất vui được làm quen với ngài!",
      "hint": "Dùng chữ nín để thể hiện thái độ tôn trọng cao nhất."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: \"Cảm ơn cô giáo, ngày mai gặp lại\"",
      "words": [
        "再见",
        "谢谢",
        "明天",
        "老师"
      ],
      "correctOrder": [
        "谢谢",
        "老师",
        "明天",
        "再见"
      ],
      "explanation": "Thứ tự: 谢谢老师 (Cảm ơn cô) + 明天再见 (Mai gặp lại)."
    },
    "step8_quiz": [
      {
        "id": "q-106-1",
        "type": "multiple-choice",
        "question": "Khi nói chuyện với khách hàng hoặc người lớn tuổi, ta nên dùng đại từ nào thay cho \"你\"?",
        "options": [
          "他 (tā)",
          "您 (nín)",
          "我 (wǒ)",
          "谁 (shéi)"
        ],
        "correctIndex": 1,
        "explanation": "您 (nín) là đại từ ngôi thứ 2 mang sắc thái tôn kính."
      },
      {
        "id": "q-106-2",
        "type": "multiple-choice",
        "question": "Khi ai đó giúp đỡ và nói \"谢谢\", câu đáp lại lịch thiệp nhất là:",
        "options": [
          "再见 (Zàijiàn)",
          "不客气 (Bú kèqi)",
          "你好 (Nǐ hǎo)",
          "对不起 (Duìbuqǐ)"
        ],
        "correctIndex": 1,
        "explanation": "不客气 (Đừng khách sáo) là câu đáp lại chuẩn mực cho lời cảm ơn."
      }
    ],
    "step9_challenge": {
      "title": "Đóng vai chào đối tác và tạm biệt",
      "taskDesc": "Nói trọn vẹn lời thoại: \"Lǎoshī nín hǎo! Xièxie nín! Zàijiàn!\".",
      "targetPhrase": "lǎoshī nín hǎo xièxie zàijiàn",
      "xpReward": 50,
      "badge": "Đại Sứ Lịch Thiệp"
    }
  },
  {
    "id": "l-107",
    "chapterId": "ch-2",
    "levelId": "lvl-1",
    "lessonNumber": 7,
    "title": "Câu chữ 是 & Trợ từ nghi vấn 吗",
    "chineseTitle": "是字句与吗字疑问句",
    "subtitle": "Nắm chắc cấu trúc khẳng định, phủ định với động từ 是 và tuyệt chiêu đặt câu hỏi Yes/No với chữ 吗.",
    "objective": "Sử dụng thành thạo câu chữ 是 (Chủ ngữ + 是 + Danh từ), câu phủ định 不是 và câu hỏi với trợ từ 吗.",
    "prerequisite": "Đã hoàn thành Bài 106.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm đặt câu hỏi và dịch câu chuẩn xác.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Câu chữ 是",
      "Trợ từ 吗",
      "Ngữ pháp cơ bản"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-5"
    ],
    "step1_learn": {
      "topic": "Câu chữ 是 & Đặt câu hỏi với chữ 吗",
      "summary": "Động từ 是 tương đương với \"là\" trong tiếng Việt. Để biến câu trần thuật thành câu hỏi Có/Không, chỉ cần thêm chữ 吗 vào cuối câu.",
      "toneGuide": [
        {
          "tone": 0,
          "name": "Trợ từ 吗 (ma)",
          "pitch": "Thanh nhẹ",
          "symbol": "ma",
          "desc": "Đọc nhẹ, ngắn và rơi tự nhiên",
          "example": "Nǐ shì lǎoshī ma?"
        }
      ],
      "initialsGuide": [
        {
          "char": "是 (shì)",
          "read": "Uốn lưỡi, thanh 4 dứt khoát: Tôi là học sinh (我是学生)"
        },
        {
          "char": "不是 (bú shì)",
          "read": "Chữ 不 biến điệu thành bú trước chữ shì"
        }
      ],
      "audioDemoText": "wǒ shì xuésheng, tā bú shì lǎoshī, nǐ shì lǎoshī ma?"
    },
    "step2_vocabulary": [
      {
        "id": "v-107-1",
        "hanzi": "是",
        "pinyin": "shì",
        "hanviet": "Thị",
        "meaning": "Là, phải, vâng",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "我是学生。",
          "pinyin": "Wǒ shì xuésheng.",
          "meaning": "Tôi là học sinh."
        },
        "pos": "Động từ hệ từ"
      },
      {
        "id": "v-107-2",
        "hanzi": "吗",
        "pinyin": "ma",
        "hanviet": "Ma",
        "meaning": "...phải không? (trợ từ nghi vấn)",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "你是老师吗？",
          "pinyin": "Nǐ shì lǎoshī ma?",
          "meaning": "Bạn là giáo viên phải không?"
        },
        "pos": "Trợ từ nghi vấn"
      },
      {
        "id": "v-107-3",
        "hanzi": "老师",
        "pinyin": "lǎoshī",
        "hanviet": "Lão sư",
        "meaning": "Thầy cô, giáo viên",
        "radical": "耂 (Lão)",
        "example": {
          "hanzi": "他是我的老师。",
          "pinyin": "Tā shì wǒ de lǎoshī.",
          "meaning": "Thầy ấy là giáo viên của tôi."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-107-4",
        "hanzi": "学生",
        "pinyin": "xuésheng",
        "hanviet": "Học sinh",
        "meaning": "Học sinh, sinh viên",
        "radical": "子 (Tử)",
        "example": {
          "hanzi": "我们都是学生。",
          "pinyin": "Wǒmen dōu shì xuésheng.",
          "meaning": "Chúng tôi đều là sinh viên."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "是",
        "pinyin": "shì",
        "meaning": "Là",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Nhật (日) ở trên -> Nét ngang -> Bộ Chỉ (疋) ở dưới",
        "components": "日 + 疋",
        "mnemonic": "Mặt trời chiếu sáng soi tỏ chân lý lẽ phải.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱日疋",
        "radical": {
          "char": "日",
          "name": "Bộ Nhật",
          "strokes": 4
        }
      },
      {
        "hanzi": "吗",
        "pinyin": "ma",
        "meaning": "Hỏi không?",
        "strokesCount": 6,
        "strokeOrderText": "Bộ Khẩu (口) bên trái -> Chữ Mã (马) bên phải",
        "components": "口 + 马",
        "mnemonic": "Dùng miệng (口) hỏi chuyện chú ngựa (马).",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰口马",
        "radical": {
          "char": "口",
          "name": "Bộ Khẩu",
          "strokes": 3
        }
      }
    ],
    "step4_grammar": {
      "formula": "Câu khẳng định: A + 是 + B | Câu hỏi: A + 是 + B + 吗？",
      "title": "Công thức câu chữ 是 và trợ từ nghi vấn 吗",
      "explanation": "Không cần đảo trật tự từ như tiếng Anh! Chỉ cần lấy nguyên câu khẳng định và gắn chữ 吗 vào đuôi câu.",
      "examples": [
        {
          "hanzi": "我是学生。",
          "pinyin": "Wǒ shì xuésheng.",
          "meaning": "Tôi là học sinh."
        },
        {
          "hanzi": "你是学生吗？",
          "pinyin": "Nǐ shì xuésheng ma?",
          "meaning": "Bạn là học sinh phải không?"
        }
      ],
      "commonMistake": {
        "wrong": "Đặt chữ 吗 ở đầu câu hoặc giữa câu.",
        "correct": "Trợ từ 吗 bắt buộc phải nằm ở vị trí CUỐI CÙNG của câu hỏi.",
        "explanation": "Trật tự cố định: [Mệnh đề trần thuật] + 吗？"
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "请问，您是李老师吗？",
          "pinyin": "Qǐngwèn, nín shì Lǐ lǎoshī ma?",
          "meaning": "Xin hỏi, thầy có phải là thầy Lý không ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "我不是李老师，我是王老师。",
          "pinyin": "Wǒ bú shì Lǐ lǎoshī, wǒ shì Wáng lǎoshī.",
          "meaning": "Tôi không phải thầy Lý, tôi là thầy Vương."
        }
      ],
      "audioText": "请问，您是李老师吗？我不是李老师，我是王老师。",
      "question": "Người B thực chất là ai?",
      "options": [
        "Thầy Lý",
        "Thầy Vương",
        "Một học sinh mới",
        "Hiệu trưởng trường học"
      ],
      "correctIndex": 1,
      "explanation": "Người B khẳng định: \"我是王老师\" (Tôi là thầy Vương)."
    },
    "step6_speaking": {
      "prompt": "Hỏi bạn cùng phòng xem họ có phải là học sinh không:",
      "targetSentence": "你是学生吗？",
      "targetPinyin": "Nǐ shì xuésheng ma?",
      "targetMeaning": "Bạn là học sinh phải không?",
      "hint": "Nói rõ ràng âm shì và kết thúc nhẹ nhàng với âm ma."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu phủ định: \"Chúng tôi không phải là giáo viên\"",
      "words": [
        "老师",
        "我们",
        "不是"
      ],
      "correctOrder": [
        "我们",
        "不是",
        "老师"
      ],
      "explanation": "Cấu trúc: Chủ ngữ 我们 + 不是 + Danh từ 老师."
    },
    "step8_quiz": [
      {
        "id": "q-107-1",
        "type": "multiple-choice",
        "question": "Dịch câu sau sang tiếng Trung: \"Anh ấy có phải là giáo viên không?\"",
        "options": [
          "他是老师吗？",
          "他是吗老师？",
          "吗他是老师？",
          "他老师是吗？"
        ],
        "correctIndex": 0,
        "explanation": "Cấu trúc câu hỏi Có/Không: 他是老师 (Khẳng định) + 吗？"
      },
      {
        "id": "q-107-2",
        "type": "multiple-choice",
        "question": "Từ phủ định đi với \"是\" để tạo thành \"không phải là\" đọc chuẩn Pinyin là gì?",
        "options": [
          "bù shì",
          "bú shì",
          "bǔ shì",
          "bū shì"
        ],
        "correctIndex": 1,
        "explanation": "Chữ 不 (bù) đứng trước thanh 4 biến điệu thành bú: bú shì."
      }
    ],
    "step9_challenge": {
      "title": "Hỏi đáp xác thực danh tính bạn học",
      "taskDesc": "Đặt 2 câu hỏi với 吗 và tự trả lời: \"Nǐ shì xuésheng ma? - Shì, wǒ shì xuésheng!\".",
      "targetPhrase": "nǐ shì xuésheng ma wǒ shì",
      "xpReward": 50,
      "badge": "Chuyên Gia Nghi Vấn 吗"
    }
  },
  {
    "id": "l-108",
    "chapterId": "ch-2",
    "levelId": "lvl-1",
    "lessonNumber": 8,
    "title": "Họ tên & Quốc tịch với đại từ 什么, 哪",
    "chineseTitle": "姓名与国籍（什么、哪）",
    "subtitle": "Tự tin hỏi tên (你叫什么名字) và hỏi quốc tịch (你是哪国人), giới thiệu bản thân là người Việt Nam.",
    "objective": "Làm chủ đại từ nghi vấn 什么 (cái gì) và 哪 (nào), biết nói \"Tôi là người Việt Nam\" bằng tiếng Trung.",
    "prerequisite": "Đã hoàn thành Bài 107.",
    "completionCriteria": "Tự giới thiệu họ tên và quốc tịch trôi chảy, đạt >= 70% trắc nghiệm.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Tên tuổi",
      "Quốc tịch",
      "Người Việt Nam"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-8"
    ],
    "step1_learn": {
      "topic": "Hỏi tên & Giới thiệu quốc tịch",
      "summary": "Để hỏi tên ta dùng động từ 叫 (jiào) kết hợp 什么 (shénme). Để hỏi quốc tịch ta dùng cấu trúc 哪国人 (nǎ guó rén).",
      "initialsGuide": [
        {
          "char": "叫 (jiào)",
          "read": "Kêu, gọi, tên là: 我叫... (Tôi tên là...)"
        },
        {
          "char": "越南 (Yuènán)",
          "read": "Việt Nam: 越南人 (Yuènán rén - Người Việt Nam)"
        },
        {
          "char": "中国 (Zhōngguó)",
          "read": "Trung Quốc: 中国人 (Zhōngguó rén - Người Trung Quốc)"
        }
      ],
      "audioDemoText": "nǐ jiào shénme míngzi, nǐ shì nǎ guó rén, wǒ shì Yuènán rén"
    },
    "step2_vocabulary": [
      {
        "id": "v-108-1",
        "hanzi": "叫",
        "pinyin": "jiào",
        "hanviet": "Khiếu",
        "meaning": "Tên là, gọi là",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "我叫海登。",
          "pinyin": "Wǒ jiào Hǎidēng.",
          "meaning": "Tôi tên là Hải Đăng."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-108-2",
        "hanzi": "什么",
        "pinyin": "shénme",
        "hanviet": "Thập ma",
        "meaning": "Cái gì, gì",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "这是什么？",
          "pinyin": "Zhè shì shénme?",
          "meaning": "Đây là cái gì?"
        },
        "pos": "Đại từ nghi vấn"
      },
      {
        "id": "v-108-3",
        "hanzi": "名字",
        "pinyin": "míngzi",
        "hanviet": "Danh tự",
        "meaning": "Tên, họ tên",
        "radical": "夕 (Tịch)",
        "example": {
          "hanzi": "你的名字。",
          "pinyin": "Nǐ de míngzi.",
          "meaning": "Tên của bạn."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-108-4",
        "hanzi": "哪",
        "pinyin": "nǎ",
        "hanviet": "Nả",
        "meaning": "Nào, đâu",
        "radical": "走 (Tẩu)",
        "example": {
          "hanzi": "哪国人？",
          "pinyin": "Nǎ guó rén?",
          "meaning": "Người nước nào?"
        },
        "pos": "Danh từ riêng"
      },
      {
        "id": "v-108-5",
        "hanzi": "越南",
        "pinyin": "Yuènán",
        "hanviet": "Việt Nam",
        "meaning": "Việt Nam",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "我是越南人。",
          "pinyin": "Wǒ shì Yuènán rén.",
          "meaning": "Tôi là người Việt Nam."
        },
        "pos": "Đại từ nghi vấn"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "国",
        "pinyin": "guó",
        "meaning": "Đất nước, quốc gia",
        "strokesCount": 8,
        "strokeOrderText": "Khung ngoài (囗) -> Chữ Ngọc (玉) bên trong -> Đóng đáy",
        "components": "囗 (Vi) + 玉 (Ngọc)",
        "mnemonic": "Đất nước có tường thành bao bọc (囗) để giữ gìn báu vật ngọc ngà (玉).",
        "structure": {
          "code": "full_enclosure",
          "name": "Toàn bao vi (全包围结构)",
          "symbol": "⿴"
        },
        "ids": "⿴囗玉",
        "radical": {
          "char": "囗",
          "name": "Bộ Vi",
          "strokes": 3
        }
      },
      {
        "hanzi": "名",
        "pinyin": "míng",
        "meaning": "Tên (Danh)",
        "strokesCount": 6,
        "strokeOrderText": "Bộ Tịch (夕) ở trên -> Bộ Khẩu (口) ở dưới",
        "components": "夕 + 口",
        "mnemonic": "Buổi tối trời tối (夕) phải dùng miệng (口) gọi tên nhau để nhận ra.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱夕口",
        "radical": {
          "char": "口",
          "name": "Bộ Khẩu",
          "strokes": 3
        }
      }
    ],
    "step4_grammar": {
      "formula": "Hỏi tên: 你叫什么名字？ | Hỏi quốc tịch: 你是哪国人？",
      "title": "Vị trí của đại từ nghi vấn trong câu hỏi",
      "explanation": "Trong tiếng Trung, đại từ nghi vấn (什么, 哪) nằm ngay tại vị trí của thông tin cần trả lời, không cần đảo trật tự từ ra đầu câu.",
      "examples": [
        {
          "hanzi": "你叫什么名字？➔ 我叫安。",
          "pinyin": "Nǐ jiào shénme míngzi? ➔ Wǒ jiào Ān.",
          "meaning": "Bạn tên gì? ➔ Tôi tên An."
        },
        {
          "hanzi": "你是哪国人？➔ 我是越南人。",
          "pinyin": "Nǐ shì nǎ guó rén? ➔ Wǒ shì Yuènán rén.",
          "meaning": "Bạn là người nước nào? ➔ Tôi là người Việt Nam."
        }
      ],
      "commonMistake": {
        "wrong": "Đảo đại từ nghi vấn ra đầu câu như tiếng Anh: \"什么你叫名字？\"",
        "correct": "Giữ nguyên trật tự ngữ pháp SVO: \"你叫什么名字？\"",
        "explanation": "Tiếng Trung giữ nguyên trật tự câu khẳng định khi thay đại từ nghi vấn."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你好！你叫什么名字？",
          "pinyin": "Nǐ hǎo! Nǐ jiào shénme míngzi?",
          "meaning": "Chào bạn! Bạn tên là gì?"
        },
        {
          "speaker": "B",
          "hanzi": "我叫阮明，我是越南人。你呢？",
          "pinyin": "Wǒ jiào Ruǎn Míng, wǒ shì Yuènán rén. Nǐ ne?",
          "meaning": "Tôi tên Nguyễn Minh, tôi là người Việt Nam. Còn bạn?"
        },
        {
          "speaker": "A",
          "hanzi": "我是中国人，我叫张华。",
          "pinyin": "Wǒ shì Zhōngguó rén, wǒ jiào Zhāng Huá.",
          "meaning": "Tôi là người Trung Quốc, tôi tên Trương Hoa."
        }
      ],
      "audioText": "你好！你叫什么名字？我叫阮明，我是越南人。我是中国人，我叫张华。",
      "question": "Bạn Nguyễn Minh mang quốc tịch nước nào?",
      "options": [
        "Trung Quốc",
        "Việt Nam",
        "Hàn Quốc",
        "Nhật Bản"
      ],
      "correctIndex": 1,
      "explanation": "Nguyễn Minh nói: \"我是越南人\" (Tôi là người Việt Nam)."
    },
    "step6_speaking": {
      "prompt": "Giới thiệu bản thân là người Việt Nam một cách tự hào:",
      "targetSentence": "我是越南人。",
      "targetPinyin": "Wǒ shì Yuènán rén.",
      "targetMeaning": "Tôi là người Việt Nam.",
      "hint": "Phát âm chuẩn Yuènán với thanh 4 rơi dứt khoát ở chữ Yuè và thanh 2 ở chữ nán."
    },
    "step7_writing": {
      "prompt": "Sắp xếp thành câu hỏi: \"Bạn tên là gì?\"",
      "words": [
        "名字",
        "叫",
        "什么",
        "你"
      ],
      "correctOrder": [
        "你",
        "叫",
        "什么",
        "名字"
      ],
      "explanation": "Cấu trúc: 你 (Bạn) + 叫 (Tên là) + 什么 (Gì) + 名字 (Tên)."
    },
    "step8_quiz": [
      {
        "id": "q-108-1",
        "type": "multiple-choice",
        "question": "Để hỏi một người bạn nước ngoài \"Bạn là người nước nào?\", câu nói chuẩn là:",
        "options": [
          "你是哪国人？",
          "你是谁人？",
          "你是什么国？",
          "你在哪里？"
        ],
        "correctIndex": 0,
        "explanation": "Cấu trúc chuẩn xác: 你是哪国人？ (Nǐ shì nǎ guó rén?)."
      },
      {
        "id": "q-108-2",
        "type": "multiple-choice",
        "question": "Chữ Hán nào mang nghĩa \"Việt Nam\"?",
        "options": [
          "中国 (Zhōngguó)",
          "越南 (Yuènán)",
          "美国 (Měiguó)",
          "英国 (Yīngguó)"
        ],
        "correctIndex": 1,
        "explanation": "越南 (Yuènán) âm Hán Việt là Việt Nam."
      }
    ],
    "step9_challenge": {
      "title": "Tự giới thiệu bản thân 3 câu hoàn chỉnh",
      "taskDesc": "Đọc to 3 câu: \"Nǐ hǎo! Wǒ jiào... Wǒ shì Yuènán rén!\".",
      "targetPhrase": "wǒ jiào wǒ shì Yuènán rén",
      "xpReward": 50,
      "badge": "Tự Tin Giới Thiệu Bản Thân"
    }
  },
  {
    "id": "l-109",
    "chapterId": "ch-2",
    "levelId": "lvl-1",
    "lessonNumber": 9,
    "title": "Số đếm 1–99 & Hỏi tuổi tác với 几, 多大",
    "chineseTitle": "数字1-99与年龄问答（几、多大）",
    "subtitle": "Nắm vững quy tắc ghép số đếm đến 99 và cách hỏi tuổi cho trẻ em (几岁) vs người lớn (多大).",
    "objective": "Đếm trôi chảy từ 1 đến 99, biết hỏi và trả lời tuổi tác của bản thân và người thân.",
    "prerequisite": "Đã hoàn thành Bài 108.",
    "completionCriteria": "Đếm số chính xác và trả lời câu hỏi tuổi tác đạt >= 70% điểm.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Số đếm",
      "Tuổi tác",
      "Số 1-99"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-8"
    ],
    "step1_learn": {
      "topic": "Quy luật số đếm 1-99 & Cách hỏi tuổi theo độ tuổi",
      "summary": "Số đếm tiếng Trung ghép cực kỳ logic giống tiếng Việt: 11 = 十一 (shíyī), 20 = 二十 (èrshí), 25 = 二十五 (èrshíwǔ). Hỏi tuổi trẻ em dưới 10 tuổi dùng 几岁 (jǐ suì), người lớn dùng 多大 (duō dà).",
      "initialsGuide": [
        {
          "char": "1-10",
          "read": "yī, èr, sān, sì, wǔ, liù, qī, bā, jiǔ, shí"
        },
        {
          "char": "几岁 (jǐ suì)",
          "read": "Mấy tuổi? (Dùng cho trẻ nhỏ dưới 10 tuổi)"
        },
        {
          "char": "多大 (duō dà)",
          "read": "Bao nhiêu tuổi? (Dùng cho bạn bè, thanh niên, người lớn)"
        }
      ],
      "audioDemoText": "yī èr sān sì wǔ liù qī bā jiǔ shí, nǐ duō dà, wǒ èrshí suì"
    },
    "step2_vocabulary": [
      {
        "id": "v-109-1",
        "hanzi": "岁",
        "pinyin": "suì",
        "hanviet": "Tuế",
        "meaning": "Tuổi",
        "radical": "山 (Sơn)",
        "example": {
          "hanzi": "我二十岁。",
          "pinyin": "Wǒ èrshí suì.",
          "meaning": "Tôi 20 tuổi."
        },
        "pos": "Lượng từ"
      },
      {
        "id": "v-109-2",
        "hanzi": "几",
        "pinyin": "jǐ",
        "hanviet": "Kỷ",
        "meaning": "Mấy (dưới 10)",
        "radical": "大 (Đại)",
        "example": {
          "hanzi": "你几岁？",
          "pinyin": "Nǐ jǐ suì?",
          "meaning": "Cháu mấy tuổi?"
        },
        "pos": "Cụm nghi vấn"
      },
      {
        "id": "v-109-3",
        "hanzi": "多大",
        "pinyin": "duō dà",
        "hanviet": "Đa đại",
        "meaning": "Bao nhiêu tuổi, lớn chừng nào",
        "radical": "几 (Kỷ)",
        "example": {
          "hanzi": "你多大？",
          "pinyin": "Nǐ duō dà?",
          "meaning": "Bạn bao nhiêu tuổi?"
        },
        "pos": "Đại từ nghi vấn"
      },
      {
        "id": "v-109-4",
        "hanzi": "二十",
        "pinyin": "èrshí",
        "hanviet": "Nhị thập",
        "meaning": "Số 20",
        "radical": "二 (Nhị)",
        "example": {
          "hanzi": "二十岁。",
          "pinyin": "Èrshí suì.",
          "meaning": "Hai mươi tuổi."
        },
        "pos": "Số từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "岁",
        "pinyin": "suì",
        "meaning": "Tuổi",
        "strokesCount": 6,
        "strokeOrderText": "Bộ Sơn (山) ở trên -> Nét phẩy gập -> Nét chấm ở dưới",
        "components": "山 + 夕",
        "mnemonic": "Núi non (山) trải qua bao đêm tối (夕) tính theo năm tháng tuổi tác.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱山夕",
        "radical": {
          "char": "山",
          "name": "Bộ Sơn",
          "strokes": 3
        }
      },
      {
        "hanzi": "几",
        "pinyin": "jǐ",
        "meaning": "Mấy",
        "strokesCount": 2,
        "strokeOrderText": "Nét phẩy (丿) -> Nét hoành triết loan câu (横折弯钩)",
        "components": "Bộ Kỷ (几)",
        "mnemonic": "Hình chiếc bàn trà nhỏ để vài ba chén nước.",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "几",
        "radical": {
          "char": "几",
          "name": "Bộ Kỷ",
          "strokes": 2
        }
      }
    ],
    "step4_grammar": {
      "formula": "Hỏi tuổi bạn bè: 你多大？ | Trả lời: 我 + [Số tuổi] + 岁。",
      "title": "Phân biệt cách hỏi tuổi với 几 và 多大",
      "explanation": "Từ 几 chỉ dùng khi dự đoán số lượng dưới 10 (hỏi em bé: 你几岁？). Với người lớn, phải dùng đại từ 多大: 你多大？ hoặc kính ngữ 您多大年纪？",
      "examples": [
        {
          "hanzi": "他儿子今年五岁。(Tā érzi jīnnián wǔ suì.)",
          "pinyin": "wǔ suì",
          "meaning": "Con trai anh ấy năm nay 5 tuổi."
        },
        {
          "hanzi": "我今年二十二岁。(Wǒ jīnnián èrshí'èr suì.)",
          "pinyin": "èrshí'èr suì",
          "meaning": "Tôi năm nay 22 tuổi."
        }
      ],
      "commonMistake": {
        "wrong": "Hỏi người lớn tuổi bằng câu \"你几岁？\".",
        "correct": "Hỏi người lớn bằng câu \"你多大？\" hoặc \"您多大年纪？\".",
        "explanation": "Dùng \"几岁\" với người lớn bị coi là thiếu tế nhị, coi họ như trẻ con."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "李明，你今年多大？",
          "pinyin": "Lǐ Míng, nǐ jīnnián duō dà?",
          "meaning": "Lý Minh, năm nay bạn bao nhiêu tuổi?"
        },
        {
          "speaker": "B",
          "hanzi": "我今年十八岁，我是大学生。",
          "pinyin": "Wǒ jīnnián shíbā suì, wǒ shì dàxuéshēng.",
          "meaning": "Tôi năm nay 18 tuổi, tôi là sinh viên đại học."
        }
      ],
      "audioText": "李明，你今年多大？我今年十八岁，我是大学生。",
      "question": "Lý Minh năm nay bao nhiêu tuổi?",
      "options": [
        "8 tuổi",
        "18 tuổi (shíbā)",
        "28 tuổi (èrshíbā)",
        "80 tuổi (bāshí)"
      ],
      "correctIndex": 1,
      "explanation": "Lý Minh nói: \"我今年十八岁\" (shíbā - 18 tuổi)."
    },
    "step6_speaking": {
      "prompt": "Hãy nói tuổi của bạn (Ví dụ: Tôi năm nay 20 tuổi):",
      "targetSentence": "我今年二十岁。",
      "targetPinyin": "Wǒ jīnnián èrshí suì.",
      "targetMeaning": "Năm nay tôi 20 tuổi.",
      "hint": "Ghép số tuổi của bạn vào trước chữ suì."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: \"Năm nay bạn bao nhiêu tuổi?\"",
      "words": [
        "今年",
        "你",
        "多大"
      ],
      "correctOrder": [
        "你",
        "今年",
        "多大"
      ],
      "explanation": "Trật tự: Chủ ngữ 你 + Thời gian 今年 + Đại từ hỏi 多大."
    },
    "step8_quiz": [
      {
        "id": "q-109-1",
        "type": "multiple-choice",
        "question": "Số 35 trong tiếng Trung ghép như thế nào?",
        "options": [
          "五十三 (wǔshísān)",
          "三十五 (sānshíwǔ)",
          "三五 (sānwǔ)",
          "五三 (wǔsān)"
        ],
        "correctIndex": 1,
        "explanation": "35 = sān (3) + shí (10) + wǔ (5) ➔ 三十五 (sānshíwǔ)."
      },
      {
        "id": "q-109-2",
        "type": "multiple-choice",
        "question": "Khi gặp một em bé khoảng 5 tuổi, câu hỏi tuổi phù hợp và tự nhiên nhất là:",
        "options": [
          "你多大？",
          "你几岁？",
          "你是谁？",
          "你叫什么？"
        ],
        "correctIndex": 1,
        "explanation": "Với trẻ nhỏ dưới 10 tuổi, ta dùng cấu trúc \"你几岁？\"."
      }
    ],
    "step9_challenge": {
      "title": "Đếm nhanh các số từ 1 đến 20 trong 10 giây",
      "taskDesc": "Đếm to các số từ 1 đến 20 không bị nhầm lẫn thanh điệu.",
      "targetPhrase": "yī èr sān sì wǔ shí èrshí",
      "xpReward": 50,
      "badge": "Thần Tốc Số Đếm 99"
    }
  },
  {
    "id": "l-110",
    "chapterId": "ch-2",
    "levelId": "lvl-1",
    "lessonNumber": 10,
    "title": "Ôn tập Module 1.2 & Thử thách giao tiếp nhập môn",
    "chineseTitle": "模块二总复习与入门沟通挑战",
    "subtitle": "Tổng hợp đàm thoại chào hỏi, giới thiệu họ tên, quốc tịch, tuổi tác và sẵn sàng khiêu chiến Boss.",
    "objective": "Tự tin đàm thoại một đoạn hội thoại làm quen hoàn chỉnh 4–5 lượt lời với người bản ngữ.",
    "prerequisite": "Đã hoàn thành Bài 106–109.",
    "completionCriteria": "Đạt >= 80% điểm bài tập tổng kết Module 1.2.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 1",
      "Tổng kết Module",
      "Giao tiếp thực tế",
      "Review Checkpoint"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-2",
      "mat-5"
    ],
    "step1_learn": {
      "topic": "Chuỗi đàm thoại làm quen kinh điển 4 bước",
      "summary": "Bước 1: Chào hỏi kính cẩn (你好 / 您好) -> Bước 2: Hỏi & Giới thiệu tên (你叫什么名字) -> Bước 3: Hỏi & Nêu quốc tịch (你是哪国人) -> Bước 4: Hỏi tuổi tác & Chào tạm biệt (你多大 / 再见).",
      "initialsGuide": [
        {
          "char": "Hội thoại mẫu",
          "read": "Nǐ hǎo! Wǒ jiào Ān, wǒ shì Yuènán rén, wǒ jīnnián èrshí suì. Hěn gāoxìng rènshi nǐ!"
        }
      ],
      "audioDemoText": "nǐ hǎo, wǒ jiào ruǎnmíng, wǒ shì Yuènán rén, hěn gāoxìng rènshi nǐ"
    },
    "step2_vocabulary": [
      {
        "id": "v-110-1",
        "hanzi": "认识",
        "pinyin": "rènshi",
        "hanviet": "Nhận thức",
        "meaning": "Quen biết, làm quen",
        "radical": "宀 (Miên)",
        "example": {
          "hanzi": "很高兴认识你！",
          "pinyin": "Hěn gāoxìng rènshi nǐ!",
          "meaning": "Rất vui được làm quen với bạn!"
        },
        "pos": "Danh từ / Lượng từ"
      },
      {
        "id": "v-110-2",
        "hanzi": "高兴",
        "pinyin": "gāoxìng",
        "hanviet": "Cao hưng",
        "meaning": "Vui vẻ, phấn khởi",
        "radical": "月 (Nguyệt)",
        "example": {
          "hanzi": "我也很高兴。",
          "pinyin": "Wǒ yě hěn gāoxìng.",
          "meaning": "Tôi cũng rất vui."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-110-3",
        "hanzi": "朋友",
        "pinyin": "péngyou",
        "hanviet": "Bằng hữu",
        "meaning": "Bạn bè",
        "radical": "氵 (Thủy)",
        "example": {
          "hanzi": "我们是好朋友。",
          "pinyin": "Wǒmen shì hǎo péngyou.",
          "meaning": "Chúng tôi là bạn tốt."
        },
        "pos": "Động từ / Phó từ phủ định"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "友",
        "pinyin": "yǒu",
        "meaning": "Bạn bè (Hữu)",
        "strokesCount": 4,
        "strokeOrderText": "Ngang -> Phẩy -> Nét bộ Hựu (又)",
        "components": "Bộ Hựu (又)",
        "mnemonic": "Hai bàn tay nắm lấy nhau tượng trưng cho tình bạn thân thiết.",
        "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸"
        },
        "ids": "⿸𠂇又",
        "radical": {
          "char": "又",
          "name": "Bộ Hựu",
          "strokes": 2
        }
      },
      {
        "hanzi": "朋",
        "pinyin": "péng",
        "meaning": "Bạn bè (Bằng)",
        "strokesCount": 8,
        "strokeOrderText": "Phẩy -> Ngang gập móc -> Ngang -> Ngang (hai chữ Nguyệt 月 ghép lại)",
        "components": "Hai chữ Nguyệt (月)",
        "mnemonic": "Hai vầng trăng song hành bên nhau tựa đôi bạn tri kỷ gắn bó.",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰月月",
        "radical": {
          "char": "月",
          "name": "Bộ Nguyệt",
          "strokes": 4
        }
      }
    ],
    "step4_grammar": {
      "formula": "Cụm từ giao tế kinh điển: 很高兴认识你！ (Hěn gāoxìng rènshi nǐ!)",
      "title": "Lời kết thúc hoàn hảo cho màn làm quen",
      "explanation": "Sau khi đã biết tên tuổi quốc tịch, người Trung Quốc luôn dùng câu \"很高兴认识你\" để thể hiện thiện chí hữu nghị.",
      "examples": [
        {
          "hanzi": "A: 很高兴认识你！ B: 认识你我也很高兴！",
          "pinyin": "A: Hěn gāoxìng rènshi nǐ! B: Rènshi nǐ wǒ yě hěn gāoxìng!",
          "meaning": "A: Rất vui được quen bạn! B: Quen bạn tôi cũng rất vui!"
        }
      ],
      "commonMistake": {
        "wrong": "Nói cộc lốc rồi bỏ đi sau khi hỏi xong tên.",
        "correct": "Luôn kết bằng câu \"很高兴认识你\" và \"再见\".",
        "explanation": "Giúp xây dựng hình ảnh người học lịch sự, văn minh."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你好！我是王老师，你叫什么名字？",
          "pinyin": "Nǐ hǎo! Wǒ shì Wáng lǎoshī, nǐ jiào shénme míngzi?",
          "meaning": "Chào em! Thầy là thầy Vương, em tên là gì?"
        },
        {
          "speaker": "B",
          "hanzi": "王老师您好！我叫陈兰，我是越南留学生，今年二十岁。",
          "pinyin": "Wáng lǎoshī nín hǎo! Wǒ jiào Chén Lán, wǒ shì Yuènán liúxuéshēng, jīnnián èrshí suì.",
          "meaning": "Em chào thầy Vương ạ! Em tên Trần Lan, em là du học sinh Việt Nam, năm nay 20 tuổi."
        },
        {
          "speaker": "A",
          "hanzi": "很好！欢迎你来到北京！",
          "pinyin": "Hěn hǎo! Huānyíng nǐ lái dào Běijīng!",
          "meaning": "Rất tốt! Chào mừng em đến với Bắc Kinh!"
        }
      ],
      "audioText": "你好！我是王老师，你叫什么名字？王老师您好！我叫陈兰，我是越南留学生，今年二十岁。",
      "question": "Bạn Trần Lan đến Bắc Kinh với tư cách là gì?",
      "options": [
        "Khách du lịch",
        "Du học sinh Việt Nam (liúxuéshēng)",
        "Giáo viên thỉnh giảng",
        "Nhân viên kinh doanh"
      ],
      "correctIndex": 1,
      "explanation": "Trần Lan giới thiệu: \"我是越南留学生\" (Du học sinh Việt Nam)."
    },
    "step6_speaking": {
      "prompt": "Đọc to trọn vẹn màn tự giới thiệu bản thân:",
      "targetSentence": "你好，我是越南人，很高兴认识你！",
      "targetPinyin": "Nǐ hǎo, wǒ shì Yuènán rén, hěn gāoxìng rènshi nǐ!",
      "targetMeaning": "Xin chào, tôi là người Việt Nam, rất vui được làm quen với bạn!",
      "hint": "Phát âm tự tin và mượt mà các từ gāoxìng, rènshi."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: \"Rất vui được làm quen với bạn\"",
      "words": [
        "认识",
        "你",
        "很高兴"
      ],
      "correctOrder": [
        "很高兴",
        "认识",
        "你"
      ],
      "explanation": "Cụm cố định: 很高兴 (Rất vui) + 认识你 (Quen biết bạn)."
    },
    "step8_quiz": [
      {
        "id": "q-110-1",
        "type": "multiple-choice",
        "question": "Khi đối tác nói \"很高兴认识你！\", bạn nên đáp lại tự nhiên nhất là:",
        "options": [
          "认识你我也很高兴！",
          "我不客气！",
          "明天见！",
          "你叫什么名字？"
        ],
        "correctIndex": 0,
        "explanation": "Đáp lại: \"认识你我也很高兴！\" (Được quen bạn tôi cũng rất vui!)."
      },
      {
        "id": "q-110-2",
        "type": "multiple-choice",
        "question": "Tổng hợp kiến thức Module 1.2: Từ nào sau đây KHÔNG phải là một đại từ?",
        "options": [
          "你 (nǐ)",
          "谁 (shéi)",
          "老师 (lǎoshī)",
          "什么 (shénme)"
        ],
        "correctIndex": 2,
        "explanation": "老师 là danh từ chỉ nghề nghiệp/người, không phải đại từ."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa Boss Chapter 2",
      "taskDesc": "Hoàn thành bài ôn tập để sẵn sàng thi đấu giao tiếp tại quán trà sữa Sanlitun!",
      "targetPhrase": "hěn gāoxìng rènshi nǐ péngyou",
      "xpReward": 60,
      "badge": "Bậc Thầy Giao Tiếp Nhập Môn"
    }
  },
  {
    "id": "l-111",
    "chapterId": "ch-3",
    "levelId": "lvl-1",
    "lessonNumber": 11,
    "title": "Gia đình & Động từ sở hữu 有 / 没有",
    "chineseTitle": "家庭与动词“有/没有”",
    "subtitle": "Nói về các thành viên gia đình, đếm người bằng lượng từ 口 và làm chủ động từ 有/没有.",
    "objective": "Giới thiệu trôi chảy số người trong gia đình và sử dụng chính xác phủ định 没有 (không dùng 不有).",
    "prerequisite": "Đã hoàn thành Module 1.2.",
    "completionCriteria": "Đạt >= 70% bài trắc nghiệm và giới thiệu đúng các thành viên gia đình.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Gia đình",
      "Động từ 有",
      "Lượng từ 口"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-5"
    ],
    "step1_learn": {
      "topic": "Động từ sở hữu 有 / 没有 & Thành viên trong gia đình",
      "summary": "Để diễn tả 'có' ta dùng 有 (yǒu), phủ định của 有 luôn luôn là 没有 (méiyǒu), tuyệt đối không dùng 不有. Đếm số người trong gia đình dùng lượng từ 口 (kǒu).",
      "audioDemoText": "nǐ jiā yǒu jǐ kǒu rén, wǒ jiā yǒu sì kǒu rén"
    },
    "step2_vocabulary": [
      {
        "id": "v-111-1",
        "hanzi": "有",
        "pinyin": "yǒu",
        "hanviet": "Hữu",
        "meaning": "Có",
        "radical": "人 (Nhân)",
        "example": {
          "hanzi": "我有两个姐姐。",
          "pinyin": "Wǒ yǒu liǎng gè jiějie.",
          "meaning": "Tôi có 2 người chị gái."
        },
        "pos": "Danh từ chỉ thời gian"
      },
      {
        "id": "v-111-2",
        "hanzi": "没有",
        "pinyin": "méiyǒu",
        "hanviet": "Một hữu",
        "meaning": "Không có",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "我没有哥哥。",
          "pinyin": "Wǒ méiyǒu gēge.",
          "meaning": "Tôi không có anh trai."
        },
        "pos": "Danh từ chỉ thời gian"
      },
      {
        "id": "v-111-3",
        "hanzi": "家",
        "pinyin": "jiā",
        "hanviet": "Gia",
        "meaning": "Nhà, gia đình",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "我家在北京。",
          "pinyin": "Wǒ jiā zài Běijīng.",
          "meaning": "Nhà tôi ở Bắc Kinh."
        },
        "pos": "Danh từ chỉ thời gian"
      },
      {
        "id": "v-111-4",
        "hanzi": "哥哥",
        "pinyin": "gēge",
        "hanviet": "Ca ca",
        "meaning": "Anh trai",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "我哥哥很高。",
          "pinyin": "Wǒ gēge hěn gāo.",
          "meaning": "Anh trai tôi rất cao."
        },
        "pos": "Danh từ / Lượng từ"
      },
      {
        "id": "v-111-5",
        "hanzi": "姐姐",
        "pinyin": "jiějie",
        "hanviet": "Tỷ tỷ",
        "meaning": "Chị gái",
        "radical": "月 (Nguyệt)",
        "example": {
          "hanzi": "姐姐是医生。",
          "pinyin": "Jiějie shì yīshēng.",
          "meaning": "Chị gái là bác sĩ."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-111-6",
        "hanzi": "和",
        "pinyin": "hé",
        "hanviet": "Hòa",
        "meaning": "Và, cùng với",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "爸爸和我。",
          "pinyin": "Bàba hé wǒ.",
          "meaning": "Bố và tôi."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "有",
        "pinyin": "yǒu",
        "meaning": "Có (sở hữu)",
        "strokesCount": 6,
        "strokeOrderText": "Ngang -> Phẩy -> Bộ Nguyệt (月)",
        "components": "Bộ Nguyệt",
        "mnemonic": "Bàn tay nắm miếng thịt tượng trưng sự sở hữu sung túc.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱𠂇月",
        "radical": {
          "char": "月",
          "name": "Bộ Nguyệt",
          "strokes": 4
        }
      },
      {
        "hanzi": "家",
        "pinyin": "jiā",
        "meaning": "Gia đình, nhà",
        "strokesCount": 10,
        "strokeOrderText": "Mái nhà (宀) -> Chữ Thỉ (豕)",
        "components": "宀 + 豕",
        "mnemonic": "Dưới mái nhà che chở có đàn gia súc sinh sống ấm no.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱宀豕",
        "radical": {
          "char": "宀",
          "name": "Bộ Miên",
          "strokes": 3
        }
      }
    ],
    "step4_grammar": {
      "title": "Phủ định của động từ 有 là 没有 (KHÔNG DÙNG 不有)",
      "formula": "Chủ ngữ + 有 / 没有 + Danh từ",
      "explanation": "Trong tiếng Trung, phủ định duy nhất của động từ sở hữu 有 là 没有. Tuyệt đối không dùng 不 có nghĩa là không để ghép với 有.",
      "examples": [
        {
          "hanzi": "我没有汉语书。",
          "pinyin": "Wǒ méiyǒu Hànyǔ shū.",
          "meaning": "Tôi không có sách tiếng Trung."
        }
      ],
      "commonMistake": {
        "wrong": "我不有书 ❌",
        "correct": "我没有书 ✔️",
        "explanation": "Phủ định của 有 luôn luôn là 没有."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你家有几口人？",
          "pinyin": "Nǐ jiā yǒu jǐ kǒu rén?",
          "meaning": "Nhà bạn có mấy người?"
        },
        {
          "speaker": "B",
          "hanzi": "我家有四口人：爸爸、妈妈、哥哥和我。",
          "pinyin": "Wǒ jiā yǒu sì kǒu rén: bàba, māma, gēge hé wǒ.",
          "meaning": "Nhà tôi có 4 người: bố, mẹ, anh trai và tôi."
        }
      ],
      "audioText": "你家有几口人？我家有四口人：爸爸、妈妈、哥哥和我。",
      "question": "Gia đình người B gồm những ai?",
      "options": [
        "3 người: bố, mẹ và B",
        "4 người: bố, mẹ, anh trai và B",
        "5 người",
        "2 người"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 四口人: bàba, māma, gēge hé wǒ (4 người)."
    },
    "step6_speaking": {
      "prompt": "Nói về số người trong nhà:",
      "targetSentence": "我家有四口人。",
      "targetPinyin": "Wǒ jiā yǒu sì kǒu rén.",
      "targetMeaning": "Nhà tôi có 4 người.",
      "hint": "Đọc kǒu rõ ràng với thanh 3."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi không có anh trai",
      "words": [
        "哥哥",
        "我",
        "没有"
      ],
      "correctOrder": [
        "我",
        "没有",
        "哥哥"
      ],
      "explanation": "我 + 没有 + 哥哥."
    },
    "step8_quiz": [
      {
        "id": "q-111-1",
        "type": "multiple-choice",
        "question": "Câu nào sau đây phủ định đúng về sở hữu?",
        "options": [
          "我不有姐姐",
          "我没有姐姐",
          "我没姐姐有",
          "我不姐姐"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định của 有 bắt buộc là 没有."
      },
      {
        "id": "q-111-2",
        "type": "multiple-choice",
        "question": "Lượng từ dùng để hỏi số người trong gia đình là:",
        "options": [
          "个 (gè)",
          "口 (kǒu)",
          "本 (běn)",
          "只 (zhī)"
        ],
        "correctIndex": 1,
        "explanation": "Đếm người trong gia đình dùng 口 (kǒu rén)."
      }
    ],
    "step9_challenge": {
      "title": "Giới thiệu gia đình bạn",
      "taskDesc": "Đọc to câu giới thiệu gia đình: Nhà tôi có mấy người, gồm những ai.",
      "targetPhrase": "wǒ jiā yǒu sì kǒu rén",
      "xpReward": 50,
      "badge": "Ấm Áp Tình Thân"
    }
  },
  {
    "id": "l-112",
    "chapterId": "ch-3",
    "levelId": "lvl-1",
    "lessonNumber": 12,
    "title": "Ngày tháng năm theo trật tự lớn đến bé",
    "chineseTitle": "年月日与星期表达",
    "subtitle": "Nắm vững quy tắc thời gian kinh điển của tiếng Trung: Năm -> Tháng -> Ngày -> Thứ trong tuần.",
    "objective": "Hỏi và nói chuẩn xác ngày, tháng, năm và thứ trong tuần bằng tiếng Trung.",
    "prerequisite": "Đã hoàn thành Bài 111.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng ngày hôm nay.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Thời gian",
      "Ngày tháng",
      "Thứ trong tuần"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Trật tự thời gian từ lớn đến bé: 年 (nián) -> 月 (yuè) -> 日/号 (hào) -> 星期 (xīngqī)",
      "summary": "Người Trung Quốc tư duy từ vĩ mô đến vi mô: Năm trước, tháng giữa, ngày sau, cuối cùng là thứ trong tuần. Trong văn nói thường dùng 号 thay cho 日.",
      "audioDemoText": "jīntiān jǐ yuè jǐ hào, jīntiān shí yuè jiǔ hào xīngqīwǔ"
    },
    "step2_vocabulary": [
      {
        "id": "v-112-1",
        "hanzi": "今天",
        "pinyin": "jīntiān",
        "hanviet": "Kim thiên",
        "meaning": "Hôm nay",
        "radical": "王 (Vương)",
        "example": {
          "hanzi": "今天很冷。",
          "pinyin": "Jīntiān hěn lěng.",
          "meaning": "Hôm nay rất lạnh."
        },
        "pos": "Danh từ chỉ thời gian"
      },
      {
        "id": "v-112-2",
        "hanzi": "明天",
        "pinyin": "míngtiān",
        "hanviet": "Minh thiên",
        "meaning": "Ngày mai",
        "radical": "灬 (Hỏa)",
        "example": {
          "hanzi": "明天见。",
          "pinyin": "Míngtiān jiàn.",
          "meaning": "Mai gặp lại nhé."
        },
        "pos": "Lượng từ thời gian"
      },
      {
        "id": "v-112-3",
        "hanzi": "昨天",
        "pinyin": "zuótiān",
        "hanviet": "Tạc thiên",
        "meaning": "Hôm qua",
        "radical": "刀 (Đao)",
        "example": {
          "hanzi": "昨天是星期四。",
          "pinyin": "Zuótiān shì xīngqīsì.",
          "meaning": "Hôm qua là thứ Năm."
        },
        "pos": "Lượng từ thời gian"
      },
      {
        "id": "v-112-4",
        "hanzi": "月",
        "pinyin": "yuè",
        "hanviet": "Nguyệt",
        "meaning": "Tháng",
        "radical": "十 (Thập)",
        "example": {
          "hanzi": "十月。",
          "pinyin": "Shí yuè.",
          "meaning": "Tháng 10."
        },
        "pos": "Số từ / Trạng từ"
      },
      {
        "id": "v-112-5",
        "hanzi": "号",
        "pinyin": "hào",
        "hanviet": "Hào",
        "meaning": "Ngày, mùng",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "九号。",
          "pinyin": "Jiǔ hào.",
          "meaning": "Mùng 9."
        },
        "pos": "Danh từ chỉ thời gian"
      },
      {
        "id": "v-112-6",
        "hanzi": "星期",
        "pinyin": "xīngqī",
        "hanviet": "Tinh kỳ",
        "meaning": "Thứ, tuần",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "星期五。",
          "pinyin": "Xīngqīwǔ.",
          "meaning": "Thứ Sáu."
        },
        "pos": "Danh từ chỉ thời gian"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "天",
        "pinyin": "tiān",
        "meaning": "Trời, ngày",
        "strokesCount": 4,
        "strokeOrderText": "Ngang trên -> Ngang dưới -> Phẩy -> Mác",
        "components": "一 + 大",
        "mnemonic": "Phía trên đỉnh đầu con người to lớn chính là bầu trời cao rộng.",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "天",
        "radical": {
          "char": "大",
          "name": "Bộ Đại",
          "strokes": 3
        }
      },
      {
        "hanzi": "月",
        "pinyin": "yuè",
        "meaning": "Mặt trăng, tháng",
        "strokesCount": 4,
        "strokeOrderText": "Phẩy đứng -> Ngang gập móc -> Hai nét ngang trong",
        "components": "Bộ Nguyệt",
        "mnemonic": "Hình tượng vầng trăng khuyết chiếu sáng ban đêm.",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "月",
        "radical": {
          "char": "月",
          "name": "Bộ Nguyệt",
          "strokes": 4
        }
      }
    ],
    "step4_grammar": {
      "title": "Trật tự thời gian từ lớn đến bé",
      "formula": "Năm (年) + Tháng (月) + Ngày (号) + Thứ (星期)",
      "explanation": "Quy tắc bất di bất dịch của tiếng Trung là đơn vị lớn luôn đứng trước đơn vị bé, ngược hoàn toàn với tiếng Việt.",
      "examples": [
        {
          "hanzi": "今天十月九号，星期五。",
          "pinyin": "Jīntiān shí yuè jiǔ hào, xīngqīwǔ.",
          "meaning": "Hôm nay ngày 9 tháng 10, thứ Sáu."
        }
      ],
      "commonMistake": {
        "wrong": "Nói ngày trước tháng sau theo tiếng Việt (9号10月 ❌)",
        "correct": "Tháng trước ngày sau: 10月9号 ✔️",
        "explanation": "Thời gian tiếng Trung luôn đi từ lớn đến bé."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "今天几月几号？",
          "pinyin": "Jīntiān jǐ yuè jǐ hào?",
          "meaning": "Hôm nay ngày mấy tháng mấy?"
        },
        {
          "speaker": "B",
          "hanzi": "今天十月九号，星期五。",
          "pinyin": "Jīntiān shí yuè jiǔ hào, xīngqīwǔ.",
          "meaning": "Hôm nay ngày 9 tháng 10, thứ Sáu."
        }
      ],
      "audioText": "今天十月九号，星期五。",
      "question": "Hôm nay là thứ mấy?",
      "options": [
        "Thứ Năm",
        "Thứ Sáu (xīngqīwǔ)",
        "Thứ Bảy",
        "Chủ nhật"
      ],
      "correctIndex": 1,
      "explanation": "星期五 là Thứ Sáu."
    },
    "step6_speaking": {
      "prompt": "Nói ngày hôm nay:",
      "targetSentence": "今天十月九号。",
      "targetPinyin": "Jīntiān shí yuè jiǔ hào.",
      "targetMeaning": "Hôm nay ngày 9 tháng 10.",
      "hint": "Tháng trước ngày sau: shí yuè jiǔ hào."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Ngày mai là thứ Bảy",
      "words": [
        "明天",
        "星期六",
        "是"
      ],
      "correctOrder": [
        "明天",
        "是",
        "星期六"
      ],
      "explanation": "明天 + 是 + 星期六."
    },
    "step8_quiz": [
      {
        "id": "q-112-1",
        "type": "multiple-choice",
        "question": "Trong tiếng Trung, 'Thứ Hai' được nói là gì?",
        "options": [
          "星期一",
          "星期二",
          "星期天",
          "星期日"
        ],
        "correctIndex": 0,
        "explanation": "Thứ Hai tương ứng số 1: 星期一."
      },
      {
        "id": "q-112-2",
        "type": "multiple-choice",
        "question": "Cách nói ngày 1 tháng 1 chuẩn là:",
        "options": [
          "一号一月",
          "一月一号",
          "一号月一",
          "一月号一"
        ],
        "correctIndex": 1,
        "explanation": "Tháng trước ngày sau: 一月一号."
      }
    ],
    "step9_challenge": {
      "title": "Đọc ngày sinh nhật của bạn",
      "taskDesc": "Đọc to ngày tháng sinh nhật của bản thân bằng tiếng Trung.",
      "targetPhrase": "jīntiān shí yuè jiǔ hào",
      "xpReward": 50,
      "badge": "Làm Chủ Lịch Trình"
    }
  },
  {
    "id": "l-113",
    "chapterId": "ch-3",
    "levelId": "lvl-1",
    "lessonNumber": 13,
    "title": "Giờ giấc & Hoạt động thường nhật",
    "chineseTitle": "时间点与日常活动（现在几点）",
    "subtitle": "Làm chủ cách hỏi giờ (现在几点), nói giờ hơn/phút và diễn đạt lịch trình sinh hoạt hàng ngày.",
    "objective": "Hỏi và trả lời giờ giấc chính xác (点 - giờ, 分 - phút, 半 - rưỡi), miêu tả lịch sinh hoạt cơ bản.",
    "prerequisite": "Đã hoàn thành Bài 112.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng giờ hiện tại.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Giờ giấc",
      "Hỏi giờ",
      "Lịch sinh hoạt"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Hỏi giờ: 现在几点？ (Xiànzài jǐ diǎn?) & Diễn đạt mốc thời gian",
      "summary": "点 (diǎn) là giờ, 分 (fēn) là phút, 半 (bàn) là 30 phút/rưỡi. Trạng ngữ chỉ thời gian luôn đứng trước động từ trong câu tiếng Trung.",
      "audioDemoText": "xiànzài jǐ diǎn, xiànzài bā diǎn bàn, wǒ qī diǎn qǐchuáng"
    },
    "step2_vocabulary": [
      {
        "id": "v-113-1",
        "hanzi": "现在",
        "pinyin": "xiànzài",
        "hanviet": "Hiện tại",
        "meaning": "Bây giờ, hiện nay",
        "radical": "囗 (Vi)",
        "example": {
          "hanzi": "现在几点了？",
          "pinyin": "Xiànzài jǐ diǎn le?",
          "meaning": "Bây giờ mấy giờ rồi?"
        },
        "pos": "Danh từ riêng"
      },
      {
        "id": "v-113-2",
        "hanzi": "点",
        "pinyin": "diǎn",
        "hanviet": "Điểm",
        "meaning": "Giờ",
        "radical": "亠 (Đầu)",
        "example": {
          "hanzi": "八点。",
          "pinyin": "Bā diǎn.",
          "meaning": "8 giờ."
        },
        "pos": "Danh từ riêng"
      },
      {
        "id": "v-113-3",
        "hanzi": "分",
        "pinyin": "fēn",
        "hanviet": "Phân",
        "meaning": "Phút",
        "radical": "木 (Mộc)",
        "example": {
          "hanzi": "十分。",
          "pinyin": "Shí fēn.",
          "meaning": "10 phút."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-113-4",
        "hanzi": "半",
        "pinyin": "bàn",
        "hanviet": "Bán",
        "meaning": "Rưỡi, nửa",
        "radical": "饣 (Thực)",
        "example": {
          "hanzi": "八点半。",
          "pinyin": "Bā diǎn bàn.",
          "meaning": "8 giờ rưỡi."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-113-5",
        "hanzi": "上午",
        "pinyin": "shàngwǔ",
        "hanviet": "Thượng ngọ",
        "meaning": "Buổi sáng",
        "radical": "广 (Quảng)",
        "example": {
          "hanzi": "上午好。",
          "pinyin": "Shàngwǔ hǎo.",
          "meaning": "Chào buổi sáng."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-113-6",
        "hanzi": "下午",
        "pinyin": "xiàwǔ",
        "hanviet": "Hạ ngọ",
        "meaning": "Buổi chiều",
        "radical": "土 (Thổ)",
        "example": {
          "hanzi": "下午三点。",
          "pinyin": "Xiàwǔ sān diǎn.",
          "meaning": "3 giờ chiều."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "现",
        "pinyin": "xiàn",
        "meaning": "Hiện tại, xuất hiện",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Vương (王) -> Bộ Kiến (见)",
        "components": "王 + 见",
        "mnemonic": "Viên ngọc quý xuất hiện rực rỡ ở hiện tại.",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰王见",
        "radical": {
          "char": "王",
          "name": "Bộ Vương",
          "strokes": 4
        }
      },
      {
        "hanzi": "点",
        "pinyin": "diǎn",
        "meaning": "Giờ, chấm nhỏ",
        "strokesCount": 9,
        "strokeOrderText": "Chữ Chiếm (占) ở trên -> Bốn chấm hỏa (灬) ở dưới",
        "components": "占 + 灬",
        "mnemonic": "Ngọn lửa nhỏ cháy tạo từng đốm sáng chỉ mốc giờ.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱占灬",
        "radical": {
          "char": "灬",
          "name": "Bộ Hỏa (4 chấm)",
          "strokes": 4
        }
      }
    ],
    "step4_grammar": {
      "title": "Vị trí của trạng ngữ thời gian trong câu",
      "formula": "Chủ ngữ + Thời gian + Động từ + Tân ngữ (HOẶC Thời gian + Chủ ngữ + Động từ)",
      "explanation": "Trong tiếng Trung, thời gian PHẢI đứng trước động từ. Tuyệt đối không để thời gian ở cuối câu như tiếng Việt.",
      "examples": [
        {
          "hanzi": "我上午八点去学校。",
          "pinyin": "Wǒ shàngwǔ bā diǎn qù xuéxiào.",
          "meaning": "Tôi đi đến trường lúc 8 giờ sáng."
        }
      ],
      "commonMistake": {
        "wrong": "我吃早饭在七点 ❌",
        "correct": "我七点吃早饭 ✔️",
        "explanation": "Thời gian luôn đứng trước hành động."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "请问，现在几点？",
          "pinyin": "Qǐngwèn, xiànzài jǐ diǎn?",
          "meaning": "Xin hỏi, bây giờ mấy giờ?"
        },
        {
          "speaker": "B",
          "hanzi": "现在下午三点半。",
          "pinyin": "Xiànzài xiàwǔ sān diǎn bàn.",
          "meaning": "Bây giờ là 3 giờ rưỡi chiều."
        }
      ],
      "audioText": "请问，现在几点？现在下午三点半。",
      "question": "Bây giờ là thời điểm nào?",
      "options": [
        "8 giờ sáng",
        "3 giờ rưỡi chiều (sān diǎn bàn)",
        "12 giờ trưa",
        "5 giờ chiều"
      ],
      "correctIndex": 1,
      "explanation": "3 giờ rưỡi chiều: 下午三点半."
    },
    "step6_speaking": {
      "prompt": "Trả lời câu hỏi bây giờ mấy giờ:",
      "targetSentence": "现在八点半。",
      "targetPinyin": "Xiànzài bā diǎn bàn.",
      "targetMeaning": "Bây giờ 8 giờ rưỡi.",
      "hint": "Đọc bā diǎn bàn dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi 8 giờ đi học",
      "words": [
        "去学校",
        "八点",
        "我"
      ],
      "correctOrder": [
        "我",
        "八点",
        "去学校"
      ],
      "explanation": "我 + 八点 + 去学校."
    },
    "step8_quiz": [
      {
        "id": "q-113-1",
        "type": "multiple-choice",
        "question": "Cách nói '8 giờ rưỡi' trong tiếng Trung là:",
        "options": [
          "八点半",
          "八分点",
          "半八点",
          "八点三十五"
        ],
        "correctIndex": 0,
        "explanation": "8 giờ rưỡi là 八点半 (bā diǎn bàn)."
      },
      {
        "id": "q-113-2",
        "type": "multiple-choice",
        "question": "Câu nào sau đây đúng trật tự thời gian?",
        "options": [
          "我去公司八点",
          "我八点去公司",
          "去公司我八点",
          "八点公司我去"
        ],
        "correctIndex": 1,
        "explanation": "Thời gian đứng trước động từ: 我八点去公司."
      }
    ],
    "step9_challenge": {
      "title": "Nói giờ hiện tại",
      "taskDesc": "Nhìn đồng hồ và đọc to giờ hiện tại bằng tiếng Trung.",
      "targetPhrase": "xiànzài jǐ diǎn le",
      "xpReward": 50,
      "badge": "Đồng Hồ Sống"
    }
  },
  {
    "id": "l-114",
    "chapterId": "ch-3",
    "levelId": "lvl-1",
    "lessonNumber": 14,
    "title": "Địa điểm & Động từ chỉ nơi chốn 在, 去",
    "chineseTitle": "地点与介词“在/去”（你在哪儿）",
    "subtitle": "Hỏi và nói vị trí ở đâu với 在 (zài), đi đâu với 去 (qù) và cấu trúc làm gì ở đâu.",
    "objective": "Hỏi nơi chốn (哪儿), nói phương hướng di chuyển (去) và diễn đạt cấu trúc 'ở đâu làm gì' chuẩn ngữ pháp.",
    "prerequisite": "Đã hoàn thành Bài 113.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cấu trúc 在 + Địa điểm + Động từ.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Địa điểm",
      "Giới từ 在",
      "Động từ 去"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Hỏi vị trí: 你在哪儿？ (Nǐ zài nǎr?) & Cấu trúc Ở ĐÂU LÀM GÌ",
      "summary": "Trong tiếng Trung, địa điểm xảy ra hành động PHẢI đứng trước hành động đó: S + 在 + Nơi chốn + V. Khác với tiếng Việt (Ăn cơm ở nhà -> Tiếng Trung: Ở nhà ăn cơm).",
      "audioDemoText": "nǐ zài nǎr, wǒ zài xuéxiào, wǒ zài jiā chīfàn"
    },
    "step2_vocabulary": [
      {
        "id": "v-114-1",
        "hanzi": "在",
        "pinyin": "zài",
        "hanviet": "Giá",
        "meaning": "Ở, tại",
        "radical": "辶 (Quai sước)",
        "example": {
          "hanzi": "你在哪儿？",
          "pinyin": "Nǐ zài nǎr?",
          "meaning": "Bạn đang ở đâu?"
        },
        "pos": "Đại từ chỉ thị"
      },
      {
        "id": "v-114-2",
        "hanzi": "哪儿",
        "pinyin": "nǎr",
        "hanviet": "Na",
        "meaning": "Ở đâu, chỗ nào",
        "radical": "阝 (Ấp)",
        "example": {
          "hanzi": "你去哪儿？",
          "pinyin": "Nǐ qù nǎr?",
          "meaning": "Bạn đi đâu đấy?"
        },
        "pos": "Đại từ chỉ thị"
      },
      {
        "id": "v-114-3",
        "hanzi": "去",
        "pinyin": "qù",
        "hanviet": "Khứ",
        "meaning": "Đi",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "我去学校。",
          "pinyin": "Wǒ qù xuéxiào.",
          "meaning": "Tôi đi đến trường."
        },
        "pos": "Đại từ nghi vấn"
      },
      {
        "id": "v-114-4",
        "hanzi": "学校",
        "pinyin": "xuéxiào",
        "hanviet": "Học hiệu",
        "meaning": "Trường học",
        "radical": "土 (Thổ)",
        "example": {
          "hanzi": "学校很大。",
          "pinyin": "Xuéxiào hěn dà.",
          "meaning": "Trường học rất to."
        },
        "pos": "Giới từ / Động từ"
      },
      {
        "id": "v-114-5",
        "hanzi": "饭馆",
        "pinyin": "fànguǎn",
        "hanviet": "Phạn quán",
        "meaning": "Quán ăn, nhà hàng",
        "radical": "夕 (Tịch)",
        "example": {
          "hanzi": "去饭馆吃饭。",
          "pinyin": "Qù fànguǎn chīfàn.",
          "meaning": "Đi quán ăn cơm."
        },
        "pos": "Đại từ nghi vấn"
      },
      {
        "id": "v-114-6",
        "hanzi": "商店",
        "pinyin": "shāngdiàn",
        "hanviet": "Thương điếm",
        "meaning": "Cửa hàng",
        "radical": "广 (Quảng)",
        "example": {
          "hanzi": "商店有水。",
          "pinyin": "Shāngdiàn yǒu shuǐ.",
          "meaning": "Cửa hàng có nước."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "在",
        "pinyin": "zài",
        "meaning": "Ở, tồn tại",
        "strokesCount": 6,
        "strokeOrderText": "Ngang -> Phẩy -> Sổ -> Ngang -> Sổ -> Ngang đóng (Bộ Thổ 土)",
        "components": "Bộ Thổ (土)",
        "mnemonic": "Cây cối đứng vững trên mặt đất (Thổ) biểu thị sự tồn tại.",
        "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸"
        },
        "ids": "⿸𠂇土",
        "radical": {
          "char": "土",
          "name": "Bộ Thổ",
          "strokes": 3
        }
      },
      {
        "hanzi": "去",
        "pinyin": "qù",
        "meaning": "Đi",
        "strokesCount": 5,
        "strokeOrderText": "Ngang -> Sổ -> Ngang -> Phẩy gập -> Chấm",
        "components": "土 + 厶",
        "mnemonic": "Rời khỏi mảnh đất quê hương để đi nơi khác.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱土厶",
        "radical": {
          "char": "土",
          "name": "Bộ Thổ",
          "strokes": 3
        }
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc vàng: Ở đâu làm gì (Chủ ngữ + 在 + Nơi chốn + Động từ)",
      "formula": "Chủ ngữ + 在 + Địa điểm + Hành động",
      "explanation": "Người Trung Quốc quy định: Phải đến địa điểm đó trước rồi mới thực hiện hành động. Do đó cụm 在 + Địa điểm luôn đứng trước Động từ.",
      "examples": [
        {
          "hanzi": "我在学校学汉语。",
          "pinyin": "Wǒ zài xuéxiào xué Hànyǔ.",
          "meaning": "Tôi học tiếng Trung ở trường."
        }
      ],
      "commonMistake": {
        "wrong": "我学汉语在学校 ❌",
        "correct": "我在学校学汉语 ✔️",
        "explanation": "Địa điểm phải đứng trước hành động."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "喂，你在哪儿？",
          "pinyin": "Wèi, nǐ zài nǎr?",
          "meaning": "Alo, bạn đang ở đâu thế?"
        },
        {
          "speaker": "B",
          "hanzi": "我在商店买东西，你呢？",
          "pinyin": "Wǒ zài shāngdiàn mǎi dōngxi, nǐ ne?",
          "meaning": "Tôi đang ở cửa hàng mua đồ, còn bạn?"
        },
        {
          "speaker": "A",
          "hanzi": "我在家看书。",
          "pinyin": "Wǒ zài jiā kàn shū.",
          "meaning": "Tôi đang ở nhà đọc sách."
        }
      ],
      "audioText": "你在哪儿？我在商店买东西。我在家看书。",
      "question": "Người B đang ở đâu và làm gì?",
      "options": [
        "Ở trường học",
        "Ở nhà đọc sách",
        "Ở cửa hàng mua đồ (shāngdiàn)",
        "Ở nhà hàng ăn cơm"
      ],
      "correctIndex": 2,
      "explanation": "Người B nói: 我在商店买东西."
    },
    "step6_speaking": {
      "prompt": "Nói bạn đang ở trường học:",
      "targetSentence": "我在学校。",
      "targetPinyin": "Wǒ zài xuéxiào.",
      "targetMeaning": "Tôi đang ở trường học.",
      "hint": "Đọc xuéxiào thanh 2 và thanh 4."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi ăn cơm ở nhà hàng",
      "words": [
        "吃饭",
        "在饭馆",
        "我"
      ],
      "correctOrder": [
        "我",
        "在饭馆",
        "吃饭"
      ],
      "explanation": "我 + 在饭馆 + 吃饭."
    },
    "step8_quiz": [
      {
        "id": "q-114-1",
        "type": "multiple-choice",
        "question": "Chọn câu đúng ngữ pháp nói 'Tôi đọc sách ở nhà':",
        "options": [
          "我看书在家",
          "我在家看书",
          "在家我书看",
          "我书看在家"
        ],
        "correctIndex": 1,
        "explanation": "Cấu trúc chuẩn: 在家 (Ở nhà) + 看书 (Đọc sách)."
      },
      {
        "id": "q-114-2",
        "type": "multiple-choice",
        "question": "Từ để hỏi 'Ở đâu' trong tiếng Trung là:",
        "options": [
          "什么 (shénme)",
          "哪儿 (nǎr)",
          "谁 (shéi)",
          "几 (jǐ)"
        ],
        "correctIndex": 1,
        "explanation": "哪儿 mang nghĩa là ở đâu, chỗ nào."
      }
    ],
    "step9_challenge": {
      "title": "Báo vị trí cho bạn bè",
      "taskDesc": "Nói trọn vẹn câu: Bạn đang ở đâu và đang làm gì.",
      "targetPhrase": "wǒ zài xuéxiào kàn shū",
      "xpReward": 50,
      "badge": "Định Vị Chuẩn Xác"
    }
  },
  {
    "id": "l-115",
    "chapterId": "ch-3",
    "levelId": "lvl-1",
    "lessonNumber": 15,
    "title": "Mua sắm cơ bản & Hỏi giá tiền 多少钱",
    "chineseTitle": "基础购物与问价（多少钱）",
    "subtitle": "Hỏi giá (多少钱), đơn vị tiền tệ 块 (kuài) và cấu trúc cảm thán 太...了 (quá...rồi).",
    "objective": "Tự tin hỏi giá đồ vật, hiểu số tiền người bán nói và biết cách kêu đắt (太贵了).",
    "prerequisite": "Đã hoàn thành Bài 114.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đàm thoại mua bán cơ bản.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Mua sắm",
      "Giá tiền",
      "多少钱",
      "太...了"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-2"
    ],
    "step1_learn": {
      "topic": "Hỏi giá: 这个多少钱？ (Zhège duōshao qián?) & Đơn vị tiền tệ",
      "summary": "Để hỏi giá ta dùng 多少钱. Đơn vị tiền tệ khẩu ngữ là 块 (kuài - đồng/tệ), 毛 (máo - hào). Cấu trúc cảm thán: 太 + Tính từ + 了! (太贵了 - Đắt quá rồi!).",
      "audioDemoText": "zhè ge duōshao qián, èrshí kuài qián, tài guì le"
    },
    "step2_vocabulary": [
      {
        "id": "v-115-1",
        "hanzi": "多少",
        "pinyin": "duōshao",
        "hanviet": "Đa thiểu",
        "meaning": "Bao nhiêu",
        "radical": "钅 (Kim)",
        "example": {
          "hanzi": "多少钱？",
          "pinyin": "Duōshao qián?",
          "meaning": "Bao nhiêu tiền?"
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-115-2",
        "hanzi": "钱",
        "pinyin": "qián",
        "hanviet": "Tiền",
        "meaning": "Tiền bạc",
        "radical": "月 (Nguyệt)",
        "example": {
          "hanzi": "我有钱。",
          "pinyin": "Wǒ yǒu qián.",
          "meaning": "Tôi có tiền."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-115-3",
        "hanzi": "块",
        "pinyin": "kuài",
        "hanviet": "Khối",
        "meaning": "Đồng tệ (khẩu ngữ)",
        "radical": "土 (Thổ)",
        "example": {
          "hanzi": "五块钱。",
          "pinyin": "Wǔ kuài qián.",
          "meaning": "5 đồng tệ."
        },
        "pos": "Lượng từ"
      },
      {
        "id": "v-115-4",
        "hanzi": "买",
        "pinyin": "mǎi",
        "hanviet": "Mãi",
        "meaning": "Mua",
        "radical": "乛 (Ất móc)",
        "example": {
          "hanzi": "我想买苹果。",
          "pinyin": "Wǒ xiǎng mǎi píngguǒ.",
          "meaning": "Tôi muốn mua táo."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-115-5",
        "hanzi": "太",
        "pinyin": "tài",
        "hanviet": "Thái",
        "meaning": "Quá, lắm",
        "radical": "大 (Đại)",
        "example": {
          "hanzi": "太好了！",
          "pinyin": "Tài hǎo le!",
          "meaning": "Tốt quá rồi!"
        },
        "pos": "Phó từ"
      },
      {
        "id": "v-115-6",
        "hanzi": "贵",
        "pinyin": "guì",
        "hanviet": "Quý",
        "meaning": "Đắt, quý",
        "radical": "贝 (Bối)",
        "example": {
          "hanzi": "太贵了！",
          "pinyin": "Tài guì le!",
          "meaning": "Đắt quá rồi!"
        },
        "pos": "Tính từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "钱",
        "pinyin": "qián",
        "meaning": "Tiền bạc",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Kim (钅) -> Hai nét ngang gập bên phải",
        "components": "钅 + 戋",
        "mnemonic": "Kim loại vàng bạc quý giá dùng làm tiền tệ trao đổi.",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰钅戋",
        "radical": {
          "char": "钅",
          "name": "Bộ Kim",
          "strokes": 5
        }
      },
      {
        "hanzi": "买",
        "pinyin": "mǎi",
        "meaning": "Mua",
        "strokesCount": 6,
        "strokeOrderText": "Ngang móc -> Chấm -> Phẩy -> Chấm ngang",
        "components": "Bộ Ất",
        "mnemonic": "Bỏ đầu óc và tiền của ra mua hàng hóa về.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱乛头",
        "radical": {
          "char": "乙",
          "name": "Bộ Ất",
          "strokes": 1
        }
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc cảm thán cố định 太...了",
      "formula": "太 + Tính từ + 了！ (Ví dụ: 太贵了 / 太好了 / 太大了)",
      "explanation": "Phó từ 太 luôn đi kèm với trợ từ 了 ở cuối câu để biểu thị mức độ cực độ hoặc lời than thở/khen ngợi.",
      "examples": [
        {
          "hanzi": "这个苹果太贵了！",
          "pinyin": "Zhège píngguǒ tài guì le!",
          "meaning": "Quả táo này đắt quá rồi!"
        }
      ],
      "commonMistake": {
        "wrong": "Quên chữ 了: 太贵 ❌",
        "correct": "Phải nói: 太贵了！ ✔️",
        "explanation": "太...了 đi thành cặp cố định."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你好，这个多少钱？",
          "pinyin": "Nǐ hǎo, zhè ge duōshao qián?",
          "meaning": "Chào bác, cái này bao nhiêu tiền ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "二十五块钱。",
          "pinyin": "Èrshíwǔ kuài qián.",
          "meaning": "25 đồng tệ cháu ơi."
        }
      ],
      "audioText": "你好，这个多少钱？二十五块钱。",
      "question": "Món đồ có giá bao nhiêu tiền?",
      "options": [
        "15 tệ",
        "20 tệ",
        "25 tệ (èrshíwǔ kuài)",
        "50 tệ"
      ],
      "correctIndex": 2,
      "explanation": "25 tệ: 二十五块钱."
    },
    "step6_speaking": {
      "prompt": "Hỏi giá đồ vật:",
      "targetSentence": "这个多少钱？",
      "targetPinyin": "Zhè ge duōshao qián?",
      "targetMeaning": "Cái này bao nhiêu tiền?",
      "hint": "Đọc duōshao nhẹ nhàng thanh nhẹ."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Cái này đắt quá rồi",
      "words": [
        "太贵了",
        "这个"
      ],
      "correctOrder": [
        "这个",
        "太贵了"
      ],
      "explanation": "这个 + 太贵了."
    },
    "step8_quiz": [
      {
        "id": "q-115-1",
        "type": "multiple-choice",
        "question": "Từ khẩu ngữ chỉ đồng tiền tệ Trung Quốc là:",
        "options": [
          "元 (yuán)",
          "块 (kuài)",
          "角 (jiǎo)",
          "分 (fēn)"
        ],
        "correctIndex": 1,
        "explanation": "Trong khẩu ngữ hàng ngày dùng 块 (kuài)."
      },
      {
        "id": "q-115-2",
        "type": "multiple-choice",
        "question": "Cụm '太好了！' mang ý nghĩa gì?",
        "options": [
          "Đắt quá",
          "Tuyệt vời / Tốt quá rồi",
          "Xấu quá",
          "Không tốt"
        ],
        "correctIndex": 1,
        "explanation": "Thái hảo liễu nghĩa là Tốt quá rồi."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa Boss Chapter 3",
      "taskDesc": "Vượt qua thử thách mua sắm để sẵn sàng khiêu chiến Boss!",
      "targetPhrase": "zhè ge duōshao qián tài guì le",
      "xpReward": 60,
      "badge": "Thánh Mặc Cả Sơ Cấp"
    }
  },
  {
    "id": "l-116",
    "chapterId": "ch-4",
    "levelId": "lvl-1",
    "lessonNumber": 16,
    "title": "Đồ ăn thức uống quen thuộc & Động từ 吃, 喝",
    "chineseTitle": "饮食与动词“吃/喝”（你喜欢吃什么）",
    "subtitle": "Nói về sở thích ẩm thực (喜欢), các món ăn và đồ uống thường nhật bằng tiếng Trung.",
    "objective": "Diễn đạt được bạn thích ăn gì, uống gì và gọi được món ăn/nước uống cơ bản.",
    "prerequisite": "Đã hoàn thành Module 1.3.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng câu sở thích ăn uống.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Ẩm thực",
      "Động từ 吃",
      "Động từ 喝",
      "喜欢"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-2"
    ],
    "step1_learn": {
      "topic": "Hỏi sở thích: 你喜欢吃什么？ (Nǐ xǐhuan chī shénme?)",
      "summary": "喜欢 (xǐhuan) là thích. 吃 (chī) là ăn, 喝 (hē) là uống. Cấu trúc: Chủ ngữ + 喜欢 + 吃/喝 + Đồ ăn/Thức uống.",
      "audioDemoText": "nǐ xǐhuan chī shénme, wǒ xǐhuan chī mǐfàn, wǒ xǐhuan hē chá"
    },
    "step2_vocabulary": [
      {
        "id": "v-116-1",
        "hanzi": "喜欢",
        "pinyin": "xǐhuan",
        "hanviet": "Hỷ hoan",
        "meaning": "Thích",
        "radical": "士 (Sĩ)",
        "example": {
          "hanzi": "我喜欢中国菜。",
          "pinyin": "Wǒ xǐhuan Zhōngguó cài.",
          "meaning": "Tôi thích món ăn Trung Quốc."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-116-2",
        "hanzi": "吃",
        "pinyin": "chī",
        "hanviet": "Cật",
        "meaning": "Ăn",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "你想吃什么？",
          "pinyin": "Nǐ xiǎng chī shénme?",
          "meaning": "Bạn muốn ăn gì?"
        },
        "pos": "Động từ"
      },
      {
        "id": "v-116-3",
        "hanzi": "喝",
        "pinyin": "hē",
        "hanviet": "Hát",
        "meaning": "Uống",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "请喝茶。",
          "pinyin": "Qǐng hē chá.",
          "meaning": "Mời uống trà."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-116-4",
        "hanzi": "米饭",
        "pinyin": "mǐfàn",
        "hanviet": "Mễ phạn",
        "meaning": "Cơm",
        "radical": "米 (Mễ)",
        "example": {
          "hanzi": "我吃米饭。",
          "pinyin": "Wǒ chī mǐfàn.",
          "meaning": "Tôi ăn cơm."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-116-5",
        "hanzi": "茶",
        "pinyin": "chá",
        "hanviet": "Trà",
        "meaning": "Trà, chè",
        "radical": "艹 (Thảo)",
        "example": {
          "hanzi": "中国茶很好喝。",
          "pinyin": "Zhōngguó chá hěn hǎohē.",
          "meaning": "Trà Trung Quốc rất ngon."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-116-6",
        "hanzi": "菜",
        "pinyin": "cài",
        "hanviet": "Thái",
        "meaning": "Món ăn, rau",
        "radical": "艹 (Thảo)",
        "example": {
          "hanzi": "这个菜很好吃。",
          "pinyin": "Zhège cài hěn hǎochī.",
          "meaning": "Món này rất ngon."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "吃",
        "pinyin": "chī",
        "meaning": "Ăn",
        "strokesCount": 6,
        "strokeOrderText": "Bộ Khẩu (口) -> Nét phẩy -> Nét ngang gập cong móc (乞)",
        "components": "口 + 乞",
        "mnemonic": "Cái miệng (口) mở ra đón nhận đồ ăn xin về.",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰口乞",
        "radical": {
          "char": "口",
          "name": "Bộ Khẩu",
          "strokes": 3
        }
      },
      {
        "hanzi": "茶",
        "pinyin": "chá",
        "meaning": "Trà",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Thảo (艹) ở trên -> Nét bộ Nhân (人) -> Bộ Mộc (木) ở dưới",
        "components": "艹 + 人 + 木",
        "mnemonic": "Con người (人) hái lá cỏ (艹) từ trên cây gỗ (木) về nấu trà.",
        "structure": {
          "code": "top_mid_bottom",
          "name": "Thượng trung hạ (上中下结构)",
          "symbol": "⿳"
        },
        "ids": "⿳艹人木",
        "radical": {
          "char": "艹",
          "name": "Bộ Thảo",
          "strokes": 3
        }
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc biểu đạt sở thích: 喜欢 + Động từ / Danh từ",
      "formula": "Chủ ngữ + 喜欢 + Động từ (吃 / 喝) + Tân ngữ",
      "explanation": "Từ 喜欢 có thể đi trực tiếp với danh từ (喜欢茶) hoặc đi với cụm động tân (喜欢喝茶). Phủ định là 不喜欢.",
      "examples": [
        {
          "hanzi": "我不喜欢喝咖啡，我喜欢喝茶。",
          "pinyin": "Wǒ bù xǐhuan hē kāfēi, wǒ xǐhuan hē chá.",
          "meaning": "Tôi không thích uống cà phê, tôi thích uống trà."
        }
      ],
      "commonMistake": {
        "wrong": "我没喜欢茶 ❌",
        "correct": "我不喜欢茶 ✔️",
        "explanation": "Phủ định tâm lý tình cảm dùng 不 (không dùng 没)."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "中午你想吃什么？",
          "pinyin": "Zhōngwǔ nǐ xiǎng chī shénme?",
          "meaning": "Buổi trưa bạn muốn ăn gì?"
        },
        {
          "speaker": "B",
          "hanzi": "我想吃米饭和中国菜。",
          "pinyin": "Wǒ xiǎng chī mǐfàn hé Zhōngguó cài.",
          "meaning": "Tôi muốn ăn cơm và món ăn Trung Quốc."
        }
      ],
      "audioText": "中午你想吃什么？我想吃米饭和中国菜。",
      "question": "Người B muốn ăn món gì buổi trưa?",
      "options": [
        "Bánh bao",
        "Cơm và món Trung Quốc (mǐfàn hé Zhōngguó cài)",
        "Trái cây",
        "Mì sợi"
      ],
      "correctIndex": 1,
      "explanation": "Người B nói rõ: 米饭和中国菜."
    },
    "step6_speaking": {
      "prompt": "Nói câu bạn thích uống trà:",
      "targetSentence": "我喜欢喝茶。",
      "targetPinyin": "Wǒ xǐhuan hē chá.",
      "targetMeaning": "Tôi thích uống trà.",
      "hint": "Đọc xǐhuan nhẹ nhàng, chá thanh 2."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi thích ăn cơm",
      "words": [
        "吃米饭",
        "喜欢",
        "我"
      ],
      "correctOrder": [
        "我",
        "喜欢",
        "吃米饭"
      ],
      "explanation": "我 + 喜欢 + 吃米饭."
    },
    "step8_quiz": [
      {
        "id": "q-116-1",
        "type": "multiple-choice",
        "question": "Từ nào sau đây mang nghĩa là 'Uống'?",
        "options": [
          "吃 (chī)",
          "喝 (hē)",
          "买 (mǎi)",
          "看 (kàn)"
        ],
        "correctIndex": 1,
        "explanation": "喝 (hē) là uống."
      },
      {
        "id": "q-116-2",
        "type": "multiple-choice",
        "question": "Phủ định của 'Tôi thích ăn cơm' là:",
        "options": [
          "我没喜欢吃米饭",
          "我不喜欢吃米饭",
          "我喜欢不吃米饭",
          "我不吃米饭喜欢"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định sở thích dùng 不: 我不喜欢吃米饭."
      }
    ],
    "step9_challenge": {
      "title": "Gọi món tại quán ăn",
      "taskDesc": "Đọc to câu gọi 1 món ăn và 1 loại đồ uống mà bạn thích.",
      "targetPhrase": "wǒ xǐhuan chī mǐfàn hē chá",
      "xpReward": 50,
      "badge": "Tín Đồ Ẩm Thực"
    }
  },
  {
    "id": "l-117",
    "chapterId": "ch-4",
    "levelId": "lvl-1",
    "lessonNumber": 17,
    "title": "Khả năng & Nguyện vọng với 会, 想",
    "chineseTitle": "能愿动词“会”与“想”（我会说汉语）",
    "subtitle": "Phân biệt năng nguyện động từ 会 (biết qua học tập rèn luyện) và 想 (mong muốn/dự định).",
    "objective": "Nói được bạn biết làm gì (会) và mong muốn làm gì (想) bằng tiếng Trung.",
    "prerequisite": "Đã hoàn thành Bài 116.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng chính xác 会 và 想.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Năng nguyện động từ",
      "会",
      "想",
      "Ngoại ngữ"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-8"
    ],
    "step1_learn": {
      "topic": "Năng nguyện động từ: 会 (huì - Biết) & 想 (xiǎng - Muốn)",
      "summary": "会 chỉ kỹ năng có được qua học tập (我会说汉语, 我会写汉字). 想 chỉ nguyện vọng/mong muốn (我想去北京). Phủ định là 不会 và 不想.",
      "audioDemoText": "wǒ huì shuō hànyǔ, wǒ huì xiě hànzì, wǒ xiǎng qù běijīng"
    },
    "step2_vocabulary": [
      {
        "id": "v-117-1",
        "hanzi": "会",
        "pinyin": "huì",
        "hanviet": "Hội",
        "meaning": "Biết (qua học tập)",
        "radical": "人 (Nhân)",
        "example": {
          "hanzi": "你会说汉语吗？",
          "pinyin": "Nǐ huì shuō Hànyǔ ma?",
          "meaning": "Bạn biết nói tiếng Trung không?"
        },
        "pos": "Động từ năng nguyện"
      },
      {
        "id": "v-117-2",
        "hanzi": "想",
        "pinyin": "xiǎng",
        "hanviet": "Tưởng",
        "meaning": "Muốn, nhớ, nghĩ",
        "radical": "心 (Tâm)",
        "example": {
          "hanzi": "我想学汉语。",
          "pinyin": "Wǒ xiǎng xué Hànyǔ.",
          "meaning": "Tôi muốn học tiếng Trung."
        },
        "pos": "Động từ năng nguyện"
      },
      {
        "id": "v-117-3",
        "hanzi": "说",
        "pinyin": "shuō",
        "hanviet": "Thuyết",
        "meaning": "Nói",
        "radical": "讠 (Ngôn)",
        "example": {
          "hanzi": "他说得很好。",
          "pinyin": "Tā shuō de hěn hǎo.",
          "meaning": "Anh ấy nói rất tốt."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-117-4",
        "hanzi": "写",
        "pinyin": "xiě",
        "hanviet": "Tả",
        "meaning": "Viết",
        "radical": "冖 (Mịch)",
        "example": {
          "hanzi": "写汉字。",
          "pinyin": "Xiě hànzì.",
          "meaning": "Viết chữ Hán."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-117-5",
        "hanzi": "汉字",
        "pinyin": "hànzì",
        "hanviet": "Hán tự",
        "meaning": "Chữ Hán",
        "radical": "宀 (Miên)",
        "example": {
          "hanzi": "汉字很有意思。",
          "pinyin": "Hànzì hěn yǒu yìsi.",
          "meaning": "Chữ Hán rất thú vị."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-117-6",
        "hanzi": "做",
        "pinyin": "zuò",
        "hanviet": "Tác",
        "meaning": "Làm",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "做中国菜。",
          "pinyin": "Zuò Zhōngguó cài.",
          "meaning": "Nấu món Trung Quốc."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "会",
        "pinyin": "huì",
        "meaning": "Biết, gặp gỡ",
        "strokesCount": 6,
        "strokeOrderText": "Bộ Nhân (人) ở trên -> Bộ Vân (云) ở dưới",
        "components": "人 + 云",
        "mnemonic": "Con người hội tụ dưới mây trời trao đổi tri thức và kỹ năng.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱人云",
        "radical": {
          "char": "人",
          "name": "Bộ Nhân",
          "strokes": 2
        }
      },
      {
        "hanzi": "想",
        "pinyin": "xiǎng",
        "meaning": "Muốn, nghĩ tưởng",
        "strokesCount": 13,
        "strokeOrderText": "Chữ Tướng (相) ở trên -> Bộ Tâm (心) ở dưới",
        "components": "相 + 心",
        "mnemonic": "Để hình ảnh sự vật trong trái tim chính là sự suy nghĩ mong muốn.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱相心",
        "radical": {
          "char": "心",
          "name": "Bộ Tâm",
          "strokes": 4
        }
      }
    ],
    "step4_grammar": {
      "title": "Vị trí của năng nguyện động từ 会 và 想",
      "formula": "Chủ ngữ + 会 / 想 + Động từ chính + Tân ngữ",
      "explanation": "Động từ năng nguyện luôn đứng trước động từ chính trong câu. Phủ định đặt 不 trước động từ năng nguyện (不会 / 不想).",
      "examples": [
        {
          "hanzi": "我会写这个汉字。",
          "pinyin": "Wǒ huì xiě zhège hànzì.",
          "meaning": "Tôi biết viết chữ Hán này."
        }
      ],
      "commonMistake": {
        "wrong": "我写会汉字 ❌",
        "correct": "我会写汉字 ✔️",
        "explanation": "会 đứng trước động từ chính 写."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你会说汉语吗？",
          "pinyin": "Nǐ huì shuō Hànyǔ ma?",
          "meaning": "Bạn biết nói tiếng Trung không?"
        },
        {
          "speaker": "B",
          "hanzi": "我会说一点儿汉语，我还会写汉字。",
          "pinyin": "Wǒ huì shuō yìdiǎnr Hànyǔ, wǒ hái huì xiě hànzì.",
          "meaning": "Tôi biết nói một chút tiếng Trung, tôi còn biết viết chữ Hán nữa."
        }
      ],
      "audioText": "你会说汉语吗？我会说一点儿汉语，我还会写汉字。",
      "question": "Người B có những kỹ năng nào?",
      "options": [
        "Chỉ biết nghe",
        "Biết nói một chút và biết viết chữ Hán",
        "Không biết tiếng Trung",
        "Chỉ biết đọc sách"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 会说一点儿... 会写汉字."
    },
    "step6_speaking": {
      "prompt": "Khẳng định khả năng nói tiếng Trung của bạn:",
      "targetSentence": "我会说汉语。",
      "targetPinyin": "Wǒ huì shuō Hànyǔ.",
      "targetMeaning": "Tôi biết nói tiếng Trung.",
      "hint": "Đọc shuō uốn lưỡi sh, Hànyǔ thanh 4 và 3."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi muốn đi Bắc Kinh",
      "words": [
        "去北京",
        "想",
        "我"
      ],
      "correctOrder": [
        "我",
        "想",
        "去北京"
      ],
      "explanation": "我 + 想 + 去北京."
    },
    "step8_quiz": [
      {
        "id": "q-117-1",
        "type": "multiple-choice",
        "question": "Để diễn tả 'kỹ năng biết làm gì qua học tập rèn luyện', ta dùng từ:",
        "options": [
          "想 (xiǎng)",
          "会 (huì)",
          "去 (qù)",
          "在 (zài)"
        ],
        "correctIndex": 1,
        "explanation": "Từ 会 biểu thị kỹ năng do học tập có được."
      },
      {
        "id": "q-117-2",
        "type": "multiple-choice",
        "question": "Chọn câu phủ định đúng:",
        "options": [
          "我不想去学校",
          "我没想去学校",
          "我去不想学校",
          "我不想学校去"
        ],
        "correctIndex": 0,
        "explanation": "Phủ định của 想 là 不想."
      }
    ],
    "step9_challenge": {
      "title": "Tự tin tuyên bố năng lực",
      "taskDesc": "Đọc to câu: 'Tôi biết nói tiếng Trung và tôi muốn đi du lịch Trung Quốc'.",
      "targetPhrase": "wǒ huì shuō hànyǔ wǒ xiǎng qù zhōngguó",
      "xpReward": 50,
      "badge": "Tự Tin Hội Nhập"
    }
  },
  {
    "id": "l-118",
    "chapterId": "ch-4",
    "levelId": "lvl-1",
    "lessonNumber": 18,
    "title": "Giải trí & Thời tiết sơ cấp (看书, 看电影, 冷, 热)",
    "chineseTitle": "休闲与初级天气表达（天气怎么样）",
    "subtitle": "Hỏi và nhận xét thời tiết với 怎么样 (zěnmeyàng), 冷 (lạnh), 热 (nóng) và các hoạt động giải trí.",
    "objective": "Hỏi thăm thời tiết, miêu tả nóng/lạnh/mưa và nói về sở thích xem phim, đọc sách.",
    "prerequisite": "Đã hoàn thành Bài 117.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và miêu tả được thời tiết hôm nay.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Thời tiết",
      "怎么样",
      "Giải trí",
      "Xem phim"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Hỏi thời tiết: 今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
      "summary": "天气 (tiānqì) là thời tiết. 怎么样 (zěnmeyàng) dùng để hỏi tính chất/tình hình như thế nào. 冷 (lěng) là lạnh, 热 (rè) là nóng, 下雨 (xiàyǔ) là trời mưa.",
      "audioDemoText": "jīntiān tiānqì zěnmeyàng, jīntiān tiānqì hěn hǎo, bù lěng yě bú rè"
    },
    "step2_vocabulary": [
      {
        "id": "v-118-1",
        "hanzi": "天气",
        "pinyin": "tiānqì",
        "hanviet": "Thiên khí",
        "meaning": "Thời tiết",
        "radical": "气 (Khí)",
        "example": {
          "hanzi": "今天天气很好。",
          "pinyin": "Jīntiān tiānqì hěn hǎo.",
          "meaning": "Hôm nay thời tiết rất đẹp."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-118-2",
        "hanzi": "怎么样",
        "pinyin": "zěnmeyàng",
        "hanviet": "Chẩm ma dạng",
        "meaning": "Như thế nào",
        "radical": "心 (Tâm)",
        "example": {
          "hanzi": "你觉得怎么样？",
          "pinyin": "Nǐ juéde zěnmeyàng?",
          "meaning": "Bạn thấy thế nào?"
        },
        "pos": "Đại từ nghi vấn"
      },
      {
        "id": "v-118-3",
        "hanzi": "冷",
        "pinyin": "lěng",
        "hanviet": "Lãnh",
        "meaning": "Lạnh",
        "radical": "冫 (Băng)",
        "example": {
          "hanzi": "太冷了！",
          "pinyin": "Tài lěng le!",
          "meaning": "Lạnh quá rồi!"
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-118-4",
        "hanzi": "热",
        "pinyin": "rè",
        "hanviet": "Nhiệt",
        "meaning": "Nóng",
        "radical": "灬 (Hỏa)",
        "example": {
          "hanzi": "今天很热。",
          "pinyin": "Jīntiān hěn rè.",
          "meaning": "Hôm nay rất nóng."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-118-5",
        "hanzi": "下雨",
        "pinyin": "xià yǔ",
        "hanviet": "Hạ vũ",
        "meaning": "Trời mưa",
        "radical": "雨 (Vũ)",
        "example": {
          "hanzi": "明天会下雨。",
          "pinyin": "Míngtiān huì xià yǔ.",
          "meaning": "Ngày mai trời sẽ mưa."
        },
        "pos": "Động từ ly hợp"
      },
      {
        "id": "v-118-6",
        "hanzi": "看电影",
        "pinyin": "kàn diànyǐng",
        "hanviet": "Khán điện ảnh",
        "meaning": "Xem phim",
        "radical": "目 (Mục)",
        "example": {
          "hanzi": "周末看电影。",
          "pinyin": "Zhōumò kàn diànyǐng.",
          "meaning": "Cuối tuần đi xem phim."
        },
        "pos": "Cụm động tân"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "冷",
        "pinyin": "lěng",
        "meaning": "Lạnh lẽo",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Băng (冫) bên trái -> Chữ Lệnh (令) bên phải",
        "components": "冫 + 令",
        "mnemonic": "Hai giọt nước đóng băng (冫) mang lại cảm giác lạnh giá.",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰冫令",
        "radical": {
          "char": "冫",
          "name": "Bộ Băng",
          "strokes": 2
        }
      },
      {
        "hanzi": "雨",
        "pinyin": "yǔ",
        "meaning": "Mưa",
        "strokesCount": 8,
        "strokeOrderText": "Ngang -> Sổ -> Ngang gập móc -> Sổ giữa -> Bốn chấm mưa",
        "components": "Bộ Vũ (雨)",
        "mnemonic": "Bầu trời giăng mây và 4 giọt nước mưa rơi xuống.",
        "structure": {
          "code": "single",
          "name": "Đơn thể (独体字)",
          "symbol": "◰"
        },
        "ids": "雨",
        "radical": {
          "char": "雨",
          "name": "Bộ Vũ",
          "strokes": 8
        }
      }
    ],
    "step4_grammar": {
      "title": "Hỏi ý kiến hoặc tình trạng với 怎么样",
      "formula": "Chủ ngữ (Người / Sự vật / Thời tiết) + 怎么样？",
      "explanation": "Từ 怎么样 đứng ở cuối câu để hỏi về tính chất, ý kiến hoặc thời tiết.",
      "examples": [
        {
          "hanzi": "北京的天气怎么样？",
          "pinyin": "Běijīng de tiānqì zěnmeyàng?",
          "meaning": "Thời tiết ở Bắc Kinh như thế nào?"
        }
      ],
      "commonMistake": {
        "wrong": "怎么样天气 ❌",
        "correct": "天气怎么样 ✔️",
        "explanation": "怎么样 luôn đứng sau chủ ngữ được hỏi."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "明天天气怎么样？",
          "pinyin": "Míngtiān tiānqì zěnmeyàng?",
          "meaning": "Ngày mai thời tiết thế nào?"
        },
        {
          "speaker": "B",
          "hanzi": "明天不下雨，不冷也不热，很舒服。",
          "pinyin": "Míngtiān bú xià yǔ, bù lěng yě bú rè, hěn shūfu.",
          "meaning": "Ngày mai không mưa, không lạnh cũng không nóng, rất dễ chịu."
        }
      ],
      "audioText": "明天天气怎么样？明天不下雨，不冷也不热。",
      "question": "Thời tiết ngày mai ra sao?",
      "options": [
        "Rất lạnh và có tuyết",
        "Mưa rất to",
        "Không mưa, không lạnh cũng không nóng",
        "Rất nóng bức"
      ],
      "correctIndex": 2,
      "explanation": "B nói: 不下雨，不冷也不热."
    },
    "step6_speaking": {
      "prompt": "Nhận xét thời tiết hôm nay rất đẹp:",
      "targetSentence": "今天天气很好。",
      "targetPinyin": "Jīntiān tiānqì hěn hǎo.",
      "targetMeaning": "Hôm nay thời tiết rất đẹp.",
      "hint": "Đọc tiānqì thanh 1 và 4."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Thời tiết hôm nay như thế nào?",
      "words": [
        "怎么样",
        "今天",
        "天气"
      ],
      "correctOrder": [
        "今天",
        "天气",
        "怎么样"
      ],
      "explanation": "今天 + 天气 + 怎么样."
    },
    "step8_quiz": [
      {
        "id": "q-118-1",
        "type": "multiple-choice",
        "question": "Từ nào sau đây mang nghĩa là 'Trời mưa'?",
        "options": [
          "下雪 (xià xuě)",
          "下雨 (xià yǔ)",
          "刮风 (guā fēng)",
          "晴天 (qíngtiān)"
        ],
        "correctIndex": 1,
        "explanation": "下雨 (xià yǔ) là trời mưa."
      },
      {
        "id": "q-118-2",
        "type": "multiple-choice",
        "question": "Cụm '不冷也不热' mang nghĩa:",
        "options": [
          "Vừa lạnh vừa nóng",
          "Không lạnh cũng không nóng",
          "Rất lạnh",
          "Rất nóng"
        ],
        "correctIndex": 1,
        "explanation": "Không lạnh cũng không nóng, thời tiết ôn hòa."
      }
    ],
    "step9_challenge": {
      "title": "Bản tin thời tiết bỏ túi",
      "taskDesc": "Đọc to bản tin dự báo thời tiết 2 câu miêu tả hôm nay nắng hay mưa, nóng hay lạnh.",
      "targetPhrase": "jīntiān tiānqì hěn hǎo bù lěng yě bú rè",
      "xpReward": 50,
      "badge": "Khí Tượng Viên Nhí"
    }
  },
  {
    "id": "l-119",
    "chapterId": "ch-4",
    "levelId": "lvl-1",
    "lessonNumber": 19,
    "title": "Tổng ôn tập toàn diện ngữ pháp & 150 từ vựng HSK 1",
    "chineseTitle": "HSK 1全真语法体系与150词总复习",
    "subtitle": "Hệ thống hóa toàn bộ ngữ pháp HSK 1: Trợ từ 的, 吗, 呢, 了; trật tự từ SVO và đòn bẩy Hán - Việt.",
    "objective": "Tổng kết vững chắc 150 từ vựng cốt lõi và 48 cấu trúc ngữ pháp trước kỳ thi Checkpoint Test.",
    "prerequisite": "Đã hoàn thành Bài 101–118.",
    "completionCriteria": "Đạt >= 80% trắc nghiệm tổng hợp toàn bộ Level 1.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 1",
      "Tổng ôn tập",
      "Ngữ pháp tổng hợp",
      "Review Checkpoint"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-4",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Hệ thống 4 trợ từ kinh điển HSK 1: 的 (sở hữu), 吗 (hỏi có/không), 呢 (còn...thì sao), 了 (đã/rồi)",
      "summary": "1. 的 biểu thị sở hữu (我的书). 2. 吗 biến câu kể thành câu hỏi nghi vấn (你好吗). 3. 呢 hỏi tiếp hoặc rút gọn (你呢). 4. 了 biểu thị sự thay đổi trạng thái hoặc hành động đã xảy ra (太贵了 / 我买了).",
      "audioDemoText": "wǒ de shū, nǐ hǎo ma, wǒ hěn hǎo nǐ ne, tài guì le"
    },
    "step2_vocabulary": [
      {
        "id": "v-119-1",
        "hanzi": "都",
        "pinyin": "dōu",
        "hanviet": "Đô",
        "meaning": "Đều",
        "radical": "阝 (Ấp)",
        "example": {
          "hanzi": "我们都是学生。",
          "pinyin": "Wǒmen dōu shì xuésheng.",
          "meaning": "Chúng tôi đều là học sinh."
        },
        "pos": "Phó từ"
      },
      {
        "id": "v-119-2",
        "hanzi": "很",
        "pinyin": "hěn",
        "hanviet": "Khẩn",
        "meaning": "Rất",
        "radical": "彳 (Xích)",
        "example": {
          "hanzi": "汉语很好听。",
          "pinyin": "Hànyǔ hěn hǎotīng.",
          "meaning": "Tiếng Trung rất hay."
        },
        "pos": "Phó từ"
      },
      {
        "id": "v-119-3",
        "hanzi": "真",
        "pinyin": "zhēn",
        "hanviet": "Chân",
        "meaning": "Thật, thực sự",
        "radical": "目 (Mục)",
        "example": {
          "hanzi": "真漂亮！",
          "pinyin": "Zhēn piàoliang!",
          "meaning": "Thật là đẹp!"
        },
        "pos": "Phó từ"
      },
      {
        "id": "v-119-4",
        "hanzi": "一点儿",
        "pinyin": "yìdiǎnr",
        "hanviet": "Nhất điểm nhi",
        "meaning": "Một chút, một ít",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "我会说一点儿。",
          "pinyin": "Wǒ huì shuō yìdiǎnr.",
          "meaning": "Tôi biết nói một chút."
        },
        "pos": "Cụm số lượng từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "都",
        "pinyin": "dōu",
        "meaning": "Đều, tất cả",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Giả (者) bên trái -> Bộ Ấp (阝) bên phải",
        "components": "者 + 阝",
        "mnemonic": "Mọi người dân trong thành thị đều bình đẳng như nhau.",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰者阝",
        "radical": {
          "char": "阝",
          "name": "Bộ Ấp",
          "strokes": 2
        }
      },
      {
        "hanzi": "真",
        "pinyin": "zhēn",
        "meaning": "Thật, chân thật",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Thập (十) -> Khung Mục (目) với 3 nét ngang -> Hai nét phẩy chấm dưới",
        "components": "十 + 目",
        "mnemonic": "Đôi mắt nhìn thấy mười phần sự thật rõ ràng.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱十具",
        "radical": {
          "char": "目",
          "name": "Bộ Mục",
          "strokes": 5
        }
      }
    ],
    "step4_grammar": {
      "title": "Bảng tổng kết 3 quy tắc trật tự từ tiếng Trung tối quan trọng",
      "formula": "1. Ai làm gì ở đâu: S + 在 + Địa điểm + V. 2. Thời gian trước hành động: S + Time + V. 3. Định ngữ trước trung tâm ngữ: Tính từ/Định ngữ + 的 + Danh từ.",
      "explanation": "Nắm vững 3 quy tắc vàng này là bạn đã giải quyết được 90% lỗi sai cú pháp khi làm bài thi HSK 1.",
      "examples": [
        {
          "hanzi": "我今天在学校买了一本书。",
          "pinyin": "Wǒ jīntiān zài xuéxiào mǎi le yì běn shū.",
          "meaning": "Hôm nay tôi đã mua một quyển sách ở trường."
        }
      ],
      "commonMistake": {
        "wrong": "我买一本书在学校今天 ❌",
        "correct": "我今天在学校买了一本书 ✔️",
        "explanation": "Thời gian và địa điểm luôn đứng trước hành động."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你们都是越南留学生吗？",
          "pinyin": "Nǐmen dōu shì Yuènán liúxuéshēng ma?",
          "meaning": "Các bạn đều là du học sinh Việt Nam à?"
        },
        {
          "speaker": "B",
          "hanzi": "对，我们都在北京大学学汉语。",
          "pinyin": "Duì, wǒmen dōu zài Běijīng Dàxué xué Hànyǔ.",
          "meaning": "Đúng vậy, chúng tôi đều học tiếng Trung tại Đại học Bắc Kinh."
        }
      ],
      "audioText": "你们都是越南留学生吗？对，我们都在北京大学学汉语。",
      "question": "Những người này đang làm gì ở đâu?",
      "options": [
        "Đang du lịch Thượng Hải",
        "Đang học tiếng Trung tại Đại học Bắc Kinh",
        "Đang đi làm ở công ty",
        "Đang đi mua sắm"
      ],
      "correctIndex": 1,
      "explanation": "都在北京大学学汉语."
    },
    "step6_speaking": {
      "prompt": "Đọc câu tổng hợp toàn diện:",
      "targetSentence": "我们都在学校学汉语。",
      "targetPinyin": "Wǒmen dōu zài xuéxiào xué Hànyǔ.",
      "targetMeaning": "Chúng tôi đều học tiếng Trung ở trường.",
      "hint": "Đọc mượt mà dōu zài xuéxiào."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Chúng tôi đều là bạn tốt",
      "words": [
        "好朋友",
        "我们",
        "都是"
      ],
      "correctOrder": [
        "我们",
        "都是",
        "好朋友"
      ],
      "explanation": "我们 + 都是 + 好朋友."
    },
    "step8_quiz": [
      {
        "id": "q-119-1",
        "type": "multiple-choice",
        "question": "Trong câu '这是 ___ 汉语书', điền từ sở hữu nào phù hợp nhất?",
        "options": [
          "我",
          "我的",
          "我很",
          "我都"
        ],
        "correctIndex": 1,
        "explanation": "Biểu thị sở hữu dùng 我的 (của tôi)."
      },
      {
        "id": "q-119-2",
        "type": "multiple-choice",
        "question": "Phó từ '都' (dōu - Đều) luôn đứng ở vị trí nào trong câu?",
        "options": [
          "Đầu câu trước chủ ngữ",
          "Sau chủ ngữ, trước động từ/tính từ",
          "Cuối câu",
          "Sau tân ngữ"
        ],
        "correctIndex": 1,
        "explanation": "都 đứng sau chủ ngữ số nhiều và trước động từ: 我们都去."
      }
    ],
    "step9_challenge": {
      "title": "Sẵn sàng thi Checkpoint HSK 1",
      "taskDesc": "Vượt qua thử thách phản xạ để mở khóa bài thi chuẩn hóa Level 1!",
      "targetPhrase": "wǒmen dōu zài xuéxiào xué hànyǔ",
      "xpReward": 60,
      "badge": "Chiến Binh Sẵn Sàng"
    }
  },
  {
    "id": "l-120",
    "chapterId": "ch-4",
    "levelId": "lvl-1",
    "lessonNumber": 20,
    "title": "Checkpoint Test HSK 1 (Thi thử mô phỏng chuẩn CTI)",
    "chineseTitle": "HSK 1级全真模拟考与阶段通关测试",
    "subtitle": "Đề thi sát hạch toàn diện 100% cấu trúc khảo thí quốc tế CTI: Nghe hiểu, Đọc hiểu và Viết câu.",
    "objective": "Đạt chuẩn đầu ra Level 1 (HSK 1): Nắm vững 150 từ vựng và tự tin vượt qua đề thi chứng chỉ.",
    "prerequisite": "Đã hoàn thành toàn bộ Bài 101–119.",
    "completionCriteria": "Đạt >= 80% điểm bài thi để nhận Huy hiệu Tốt nghiệp HSK 1.",
    "durationMinutes": 30,
    "xpReward": 100,
    "tags": [
      "HSK 1",
      "Thi thử CTI",
      "Checkpoint Test",
      "Tốt nghiệp Level 1"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Chiến thuật làm bài thi HSK 1 chuẩn quốc tế CTI",
      "summary": "Đề thi HSK 1 gồm 2 phần lớn: 1. Phần Nghe (20 câu, có tranh minh họa và audio đọc 2 lần). 2. Phần Đọc hiểu (20 câu, nối từ với hình ảnh, chọn đúng sai). Tất cả đều có Pinyin hỗ trợ.",
      "audioDemoText": "hsk yī jí kǎoshì xiànzài kāishǐ, qǐng tīng dì yī tí"
    },
    "step2_vocabulary": [
      {
        "id": "v-120-1",
        "hanzi": "考试",
        "pinyin": "kǎoshì",
        "hanviet": "Khảo thí",
        "meaning": "Thi cử, kiểm tra",
        "radical": "耂 (Lão)",
        "example": {
          "hanzi": "今天的考试不难。",
          "pinyin": "Jīntiān de kǎoshì bù nán.",
          "meaning": "Bài thi hôm nay không khó."
        },
        "pos": "Danh từ / Động từ"
      },
      {
        "id": "v-120-2",
        "hanzi": "准备",
        "pinyin": "zhǔnbèi",
        "hanviet": "Chuẩn bị",
        "meaning": "Chuẩn bị",
        "radical": "冫 (Băng)",
        "example": {
          "hanzi": "你准备好了吗？",
          "pinyin": "Nǐ zhǔnbèi hǎo le ma?",
          "meaning": "Bạn đã chuẩn bị xong chưa?"
        },
        "pos": "Động từ"
      },
      {
        "id": "v-120-3",
        "hanzi": "问题",
        "pinyin": "wèntí",
        "hanviet": "Vấn đề",
        "meaning": "Câu hỏi, vấn đề",
        "radical": "门 (Môn)",
        "example": {
          "hanzi": "没问题！",
          "pinyin": "Méi wèntí!",
          "meaning": "Không vấn đề gì cả!"
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-120-4",
        "hanzi": "开始",
        "pinyin": "kāishǐ",
        "hanviet": "Khai thủy",
        "meaning": "Bắt đầu",
        "radical": "门 (Môn)",
        "example": {
          "hanzi": "现在开始。",
          "pinyin": "Xiànzài kāishǐ.",
          "meaning": "Bây giờ bắt đầu."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "考",
        "pinyin": "kǎo",
        "meaning": "Khảo thí, thi",
        "strokesCount": 6,
        "strokeOrderText": "Ngang -> Sổ -> Ngang -> Phẩy -> Nét gập móc",
        "components": "Bộ Lão (耂)",
        "mnemonic": "Các vị khảo quan lớn tuổi (Lão) ngồi chấm thi.",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱耂丂",
        "radical": {
          "char": "耂",
          "name": "Bộ Lão",
          "strokes": 4
        }
      },
      {
        "hanzi": "试",
        "pinyin": "shì",
        "meaning": "Thử nghiệm, bài thi",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Ngôn (讠) bên trái -> Bộ Thức (式) bên phải",
        "components": "讠 + 式",
        "mnemonic": "Dùng lời nói (Ngôn) diễn đạt theo đúng quy thức (Thức) bài thi.",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰讠式",
        "radical": {
          "char": "讠",
          "name": "Bộ Ngôn",
          "strokes": 2
        }
      }
    ],
    "step4_grammar": {
      "title": "Mẹo tránh bẫy nghe và đọc đề thi HSK 1",
      "formula": "1. Nghe từ khóa (Số lượng, Thời gian, Đại từ). 2. Phân tích tranh trước khi audio phát.",
      "explanation": "Trong bài thi nghe, audio luôn có khoảng dừng 10 giây trước mỗi câu. Hãy tận dụng thời gian này nhìn nhanh vào các bức tranh để dự đoán từ vựng liên quan.",
      "examples": [
        {
          "hanzi": "没问题，我已经准备好了！",
          "pinyin": "Méi wèntí, wǒ yǐjīng zhǔnbèi hǎo le!",
          "meaning": "Không vấn đề gì, tôi đã chuẩn bị sẵn sàng rồi!"
        }
      ],
      "commonMistake": {
        "wrong": "Đợi nghe xong mới đọc câu hỏi dẫn đến bị cuống.",
        "correct": "Đọc lướt câu hỏi trước khi nghe audio.",
        "explanation": "Chiến thuật làm bài khảo thí chuẩn mực."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Khảo quan",
          "hanzi": "你好！请问你叫什么名字？你是哪国人？",
          "pinyin": "Nǐ hǎo! Qǐngwèn nǐ jiào shénme míngzi? Nǐ shì nǎ guó rén?",
          "meaning": "Xin chào! Xin hỏi em tên gì? Em là người nước nào?"
        },
        {
          "speaker": "Thí sinh",
          "hanzi": "老师您好！我叫阮明，我是越南人，今天我来参加HSK 1级考试。",
          "pinyin": "Lǎoshī nín hǎo! Wǒ jiào Ruǎn Míng, wǒ shì Yuènán rén, jīntiān wǒ lái cānjiā HSK yī jí kǎoshì.",
          "meaning": "Em chào thầy ạ! Em tên Nguyễn Minh, em là người Việt Nam, hôm nay em đến tham gia kỳ thi HSK 1."
        }
      ],
      "audioText": "我叫阮明，我是越南人，今天我来参加HSK 1级考试。",
      "question": "Thí sinh Nguyễn Minh đến đây để làm gì?",
      "options": [
        "Đi du lịch",
        "Tham gia kỳ thi HSK 1 (cānjiā HSK yī jí kǎoshì)",
        "Đi mua sách",
        "Đi ăn cơm"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 来参加HSK 1级考试."
    },
    "step6_speaking": {
      "prompt": "Khẳng định bạn đã sẵn sàng vượt qua kỳ thi:",
      "targetSentence": "没问题，我准备好了！",
      "targetPinyin": "Méi wèntí, wǒ zhǔnbèi hǎo le!",
      "targetMeaning": "Không vấn đề gì, tôi đã chuẩn bị xong rồi!",
      "hint": "Đọc méi wèntí dứt khoát và tự tin."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Kỳ thi tiếng Trung bắt đầu rồi",
      "words": [
        "开始了",
        "汉语考试"
      ],
      "correctOrder": [
        "汉语考试",
        "开始了"
      ],
      "explanation": "汉语考试 + 开始了."
    },
    "step8_quiz": [
      {
        "id": "q-120-1",
        "type": "multiple-choice",
        "question": "Chúc mừng bạn đến với câu hỏi tốt nghiệp HSK 1: Câu nào sau đây hoàn toàn đúng chuẩn ngữ pháp tiếng Trung?",
        "options": [
          "我今天下午在学校学汉语",
          "我学汉语在学校今天下午",
          "今天下午我学汉语在学校",
          "在学校我学汉语今天下午"
        ],
        "correctIndex": 0,
        "explanation": "Trật tự vàng: Chủ ngữ (我) + Thời gian (今天下午) + Địa điểm (在学校) + Động từ tân ngữ (学汉语)."
      },
      {
        "id": "q-120-2",
        "type": "multiple-choice",
        "question": "Số lượng từ vựng cốt lõi mà người học làm chủ sau khi hoàn thành Level 1 là:",
        "options": [
          "50 từ",
          "100 từ",
          "150 từ vựng cốt lõi",
          "1000 từ"
        ],
        "correctIndex": 2,
        "explanation": "HSK 1 trang bị chuẩn 150 từ vựng quốc tế và hệ thống ngữ âm nền móng."
      }
    ],
    "step9_challenge": {
      "title": "Vinh danh Tốt nghiệp HSK 1",
      "taskDesc": "Đọc to câu tuyên bố hoàn thành Level 1 và mở khóa Boss Đấu trường Sanlitun!",
      "targetPhrase": "wǒ zhǔnbèi hǎo le hsk yī jí tōngguān",
      "xpReward": 100,
      "badge": "Tốt Nghiệp HSK 1 Xuất Sắc"
    }
  }
];

export default HSK_1_LESSONS;
