# -*- coding: utf-8 -*-
"""
Full Curriculum Generator for HanziGo (HSK 1-3: 60 Lessons)
Strictly adheres to docs/HANZIGO_CHINESE_CURRICULUM.md v2.0
"""
import json
import os

RAW_CURRICULUM = [
  # =========================================================================
  # LEVEL 1: KHỞI ĐẦU & NỀN MÓNG (20 BÀI HỌC)
  # =========================================================================

  # --- MODULE 1.1: Ngữ âm Pinyin & Thuận bút (Bài 101-105) ---
  {
    "id": "l-101", "chapterId": "ch-1", "levelId": "lvl-1", "lessonNumber": 1,
    "title": "4 Thanh điệu & Nhóm thanh mẫu môi - đầu lưỡi",
    "chineseTitle": "四声与声母b, p, m, f; d, t, n, l",
    "subtitle": "Nắm vững 4 cao độ thanh điệu chuẩn Bắc Kinh và phát âm chuẩn xác các âm môi, âm đầu lưỡi.",
    "objective": "Nhận diện chuẩn 4 thanh điệu, phân biệt p/b và phát âm chính xác b, p, m, f; d, t, n, l.",
    "prerequisite": "Không có (Bắt đầu từ con số 0)",
    "completionCriteria": "Đạt tối thiểu 70% điểm trắc nghiệm và đọc đúng mẫu câu phát âm.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 1", "Pinyin", "Thanh điệu", "Phát âm"],
    "relatedMaterialIds": ["mat-1", "mat-8"],
    "step1_learn": {
      "topic": "4 Thanh điệu căn bản & Nhóm thanh mẫu môi - đầu lưỡi",
      "summary": "Tiếng Trung có 4 thanh điệu chính và 1 thanh nhẹ. Độ cao thanh điệu quyết định nghĩa của từ.",
      "audioDemoText": "bā pá mǎ mà dà tā"
    },
    "step2_vocabulary": [
      {"id": "v-101-1", "hanzi": "八", "pinyin": "bā", "hanviet": "Bát", "meaning": "Số 8", "radical": "八 (Bát)", "example": {"hanzi": "八本书。", "pinyin": "Bā běn shū.", "meaning": "Tám quyển sách."}},
      {"id": "v-101-2", "hanzi": "爸爸", "pinyin": "bàba", "hanviet": "Ba ba", "meaning": "Bố, ba", "radical": "父 (Phụ)", "example": {"hanzi": "爸爸很大。", "pinyin": "Bàba hěn dà.", "meaning": "Bố to lớn."}},
      {"id": "v-101-3", "hanzi": "妈妈", "pinyin": "māma", "hanviet": "Ma ma", "meaning": "Mẹ", "radical": "女 (Nữ)", "example": {"hanzi": "妈妈好。", "pinyin": "Māma hǎo.", "meaning": "Mẹ tốt đẹp."}},
      {"id": "v-101-4", "hanzi": "大", "pinyin": "dà", "hanviet": "Đại", "meaning": "To, lớn", "radical": "大 (Đại)", "example": {"hanzi": "很大。", "pinyin": "Hěn dà.", "meaning": "Rất to lớn."}},
      {"id": "v-101-5", "hanzi": "不", "pinyin": "bù", "hanviet": "Bất", "meaning": "Không (phủ định)", "radical": "一 (Nhất)", "example": {"hanzi": "不大。", "pinyin": "Bú dà.", "meaning": "Không to."}}
    ],
    "step3_hanzi": [
      {"hanzi": "八", "pinyin": "bā", "meaning": "Số 8", "strokesCount": 2, "strokeOrderText": "Phẩy trước (丿), mác sau (乀)", "components": "Bộ Bát (八)", "mnemonic": "Hai nét mở rộng sang hai phía thể hiện sự phân tách."},
      {"hanzi": "大", "pinyin": "dà", "meaning": "To lớn", "strokesCount": 3, "strokeOrderText": "Ngang (一) -> Phẩy (丿) -> Mác (乀)", "components": "Bộ Đại (大)", "mnemonic": "Hình tượng người dang rộng hai tay và hai chân."}
    ],
    "step4_grammar": {
      "title": "Phủ định với phó từ 不 (bù)",
      "formula": "Chủ ngữ + 不 (bù) + Tính từ / Động từ",
      "explanation": "Từ 不 luôn đứng trước tính từ hoặc động từ để biểu thị sự phủ định.",
      "examples": [{"hanzi": "爸爸不大。", "pinyin": "Bàba bú dà.", "meaning": "Bố không to lớn."}],
      "commonMistake": {"wrong": "Đọc thanh 4 thành dấu huyền tiếng Việt.", "correct": "Phát âm dứt khoát rơi từ cao độ 5 xuống 1: dà (Đại).", "explanation": "Thanh 4 tiếng Trung cần lực rơi dứt khoát."}
    },
    "step5_listening": {
      "dialogue": [{"speaker": "A", "hanzi": "爸爸大吗？", "pinyin": "Bàba dà ma?", "meaning": "Bố to lớn không?"}, {"speaker": "B", "hanzi": "爸爸不大，妈妈大。", "pinyin": "Bàba bú dà, māma dà.", "meaning": "Bố không to, mẹ to lớn."}],
      "audioText": "爸爸大吗？爸爸不大，妈妈大。",
      "question": "Theo bài nghe, người bố như thế nào?", "options": ["Bố to lớn", "Bố không to lớn", "Bố rất bận", "Bố đang đi học"], "correctIndex": 1, "explanation": "Người B nói 爸爸不大."
    },
    "step6_speaking": {"prompt": "Đọc to câu phát âm chuẩn:", "targetSentence": "爸爸不大。", "targetPinyin": "Bàba bú dà.", "targetMeaning": "Bố không to lớn.", "hint": "Đọc bú dà biến điệu thanh 2."},
    "step7_writing": {"prompt": "Sắp xếp câu: Bố không to lớn", "words": ["大", "不", "爸爸"], "correctOrder": ["爸爸", "不", "大"], "explanation": "爸爸 + 不 + 大."},
    "step8_quiz": [
      {"id": "q-101-1", "type": "multiple-choice", "question": "Thanh mẫu nào sau đây là âm bật hơi đẩy luồng gió mạnh?", "options": ["b", "p", "m", "d"], "correctIndex": 1, "explanation": "Âm p là âm bật hơi mạnh."},
      {"id": "q-101-2", "type": "multiple-choice", "question": "Chữ 不 trước thanh 4 biến điệu thành thanh mấy?", "options": ["Thanh 1", "Thanh 2 (bú)", "Thanh 3", "Thanh 4"], "correctIndex": 1, "explanation": "Biến điệu thành thanh 2: bú dà."}
    ],
    "step9_challenge": {"title": "Luyện 4 thanh điệu", "taskDesc": "Đọc to 4 thanh điệu của âm ma: mā - má - mǎ - mà.", "targetPhrase": "mā má mǎ mà", "xpReward": 50, "badge": "Khởi Đầu Phát Âm Chuẩn"}
  },

  {
    "id": "l-102", "chapterId": "ch-1", "levelId": "lvl-1", "lessonNumber": 2,
    "title": "Vận mẫu đơn a, o, e, i, u, ü & 8 Nét chữ Hán cơ bản",
    "chineseTitle": "单韵母与汉字八大基本笔画",
    "subtitle": "Nắm vững 6 nguyên âm đơn cốt lõi và làm chủ 8 nét bút nền móng để viết mọi chữ Hán.",
    "objective": "Phát âm chuẩn vận mẫu tròn môi ü, nhận diện và viết đúng 8 nét cơ bản.",
    "prerequisite": "Đã hoàn thành Bài 101.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm nhận diện nét chữ và nguyên âm ü.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 1", "Vận mẫu", "Nét chữ Hán", "Bút thuận"],
    "relatedMaterialIds": ["mat-4", "mat-9"],
    "step1_learn": {
      "topic": "6 Vận mẫu đơn & 8 Nét chữ Hán cơ bản",
      "summary": "Vận mẫu đơn gồm a, o, e, i, u, ü. Âm ü cần giữ khẩu hình tròn môi từ đầu đến cuối.",
      "audioDemoText": "a o e i u ü nǚ lǜ"
    },
    "step2_vocabulary": [
      {"id": "v-102-1", "hanzi": "一", "pinyin": "yī", "hanviet": "Nhất", "meaning": "Số 1", "radical": "一 (Nhất)", "example": {"hanzi": "一个人。", "pinyin": "Yí gè rén.", "meaning": "Một người."}},
      {"id": "v-102-2", "hanzi": "五", "pinyin": "wǔ", "hanviet": "Ngũ", "meaning": "Số 5", "radical": "二 (Nhị)", "example": {"hanzi": "五天。", "pinyin": "Wǔ tiān.", "meaning": "Năm ngày."}},
      {"id": "v-102-3", "hanzi": "女", "pinyin": "nǚ", "hanviet": "Nữ", "meaning": "Nữ, con gái", "radical": "女 (Nữ)", "example": {"hanzi": "她是女人。", "pinyin": "Tā shì nǚrén.", "meaning": "Cô ấy là phụ nữ."}},
      {"id": "v-102-4", "hanzi": "口", "pinyin": "kǒu", "hanviet": "Khẩu", "meaning": "Cái miệng, lượng từ", "radical": "口 (Khẩu)", "example": {"hanzi": "三口人。", "pinyin": "Sān kǒu rén.", "meaning": "Ba người trong nhà."}}
    ],
    "step3_hanzi": [
      {"hanzi": "一", "pinyin": "yī", "meaning": "Số 1", "strokesCount": 1, "strokeOrderText": "Nét ngang duy nhất", "components": "Bộ Nhất", "mnemonic": "Nét ngang khởi đầu vạn vật."},
      {"hanzi": "口", "pinyin": "kǒu", "meaning": "Cái miệng", "strokesCount": 3, "strokeOrderText": "Sổ -> Ngang gập -> Ngang đóng đáy", "components": "Bộ Khẩu", "mnemonic": "Hình chiếc miệng mở vuông vức."}
    ],
    "step4_grammar": {
      "title": "Quy tắc thuận bút cơ bản: Ngang trước sổ sau",
      "formula": "Ngang trước sổ sau (一 ➔ 十)",
      "explanation": "Khi viết chữ Hán có khung bao quanh: Vào phòng trước đóng cửa sau.",
      "examples": [{"hanzi": "十 (Thập - Số 10)", "pinyin": "shí", "meaning": "Ngang trước sổ sau."}],
      "commonMistake": {"wrong": "Đóng đáy trước khi viết nét bên trong.", "correct": "Viết hết nét trong rồi mới đóng đáy ngang.", "explanation": "Vào phòng trước, đóng cửa sau."}
    },
    "step5_listening": {
      "dialogue": [{"speaker": "A", "hanzi": "这是什么字？", "pinyin": "Zhè shì shénme zì?", "meaning": "Đây là chữ gì?"}, {"speaker": "B", "hanzi": "这是口，口有一张。", "pinyin": "Zhè shì kǒu, kǒu yǒu yì zhāng.", meaning: "Đây là chữ Khẩu."}],
      "audioText": "这是口，口有一张。", "question": "Chữ Hán được nhắc tới là gì?", "options": ["Chữ Khẩu (口)", "Chữ Nhật (日)", "Chữ Nhất (一)", "Chữ Nữ (女)"], "correctIndex": 0, "explanation": "Chữ 口 (kǒu)."
    },
    "step6_speaking": {"prompt": "Luyện phát âm âm ü tròn môi:", "targetSentence": "nǚ ér", "targetPinyin": "nǚ ér", "targetMeaning": "Con gái", "hint": "Giữ tròn môi khi đọc nǚ."},
    "step7_writing": {"prompt": "Sắp xếp câu: Nhà tôi có năm người", "words": ["口人", "我家", "有", "五"], "correctOrder": ["我家", "有", "五", "口人"], "explanation": "我家 + 有 + 五 + 口人."},
    "step8_quiz": [
      {"id": "q-102-1", "type": "multiple-choice", "question": "Khi viết chữ 十, nét nào viết trước?", "options": ["Nét sổ", "Nét ngang", "Nét chấm", "Tùy ý"], "correctIndex": 1, "explanation": "Ngang trước sổ sau."},
      {"id": "q-102-2", "type": "multiple-choice", "question": "Khẩu hình của vận mẫu ü là:", "options": ["Môi bè rộng", "Môi tròn chúm lại", "Há to hết cỡ", "Uốn cong lưỡi"], "correctIndex": 1, "explanation": "Môi tròn chúm lại."}
    ],
    "step9_challenge": {"title": "Tập viết chữ 口 và 女", "taskDesc": "Viết chữ 口 và 女 đúng thuận bút.", "targetPhrase": "kǒu nǚ", "xpReward": 50, "badge": "Vững Nét Thuận Bút"}
  },

  {
    "id": "l-103", "chapterId": "ch-1", "levelId": "lvl-1", "lessonNumber": 3,
    "title": "Nhóm âm khó: z, c, s vs zh, ch, sh, r & Quy tắc viết chữ Hán",
    "chineseTitle": "平翘舌音与汉字书写规则",
    "subtitle": "Đập tan nỗi sợ âm đầu lưỡi và âm cuốn lưỡi, chuẩn hóa ngữ âm như người Bắc Kinh.",
    "objective": "Phân biệt rạch ròi cặp âm thẳng lưỡi (z, c, s) và âm uốn lưỡi (zh, ch, sh, r).",
    "prerequisite": "Đã hoàn thành Bài 102.",
    "completionCriteria": "Vượt qua bài kiểm tra phân biệt s và sh với điểm >= 70%.",
    "durationMinutes": 25, "xpReward": 50, "tags": ["HSK 1", "Âm uốn lưỡi", "Quy tắc viết", "Pinyin khó"],
    "relatedMaterialIds": ["mat-1", "mat-4"],
    "step1_learn": {
      "topic": "Âm đầu lưỡi (z, c, s) vs Âm uốn lưỡi (zh, ch, sh, r)",
      "summary": "z, c, s: Đầu lưỡi thẳng chạm mặt sau răng trên. zh, ch, sh, r: Đầu lưỡi cong uốn lên ngạc cứng.",
      "audioDemoText": "sān shān zǎo zhǎo cài chài"
    },
    "step2_vocabulary": [
      {"id": "v-103-1", "hanzi": "三", "pinyin": "sān", "hanviet": "Tam", "meaning": "Số 3", "radical": "一 (Nhất)", "example": {"hanzi": "三个。", "pinyin": "Sān gè.", "meaning": "Ba cái."}},
      {"id": "v-103-2", "hanzi": "十", "pinyin": "shí", "hanviet": "Thập", "meaning": "Số 10", "radical": "十 (Thập)", "example": {"hanzi": "十四。", "pinyin": "Shí sì.", "meaning": "Mười bốn."}},
      {"id": "v-103-3", "hanzi": "吃", "pinyin": "chī", "hanviet": "Ngật", "meaning": "Ăn", "radical": "口 (Khẩu)", "example": {"hanzi": "吃饭。", "pinyin": "Chī fàn.", "meaning": "Ăn cơm."}},
      {"id": "v-103-4", "hanzi": "四", "pinyin": "sì", "hanviet": "Tứ", "meaning": "Số 4", "radical": "囗 (Vi)", "example": {"hanzi": "四天。", "pinyin": "Sì tiān.", "meaning": "Bốn ngày."}},
      {"id": "v-103-5", "hanzi": "人", "pinyin": "rén", "hanviet": "Nhân", "meaning": "Người", "radical": "人 (Nhân)", "example": {"hanzi": "中国人。", "pinyin": "Zhōngguó rén.", "meaning": "Người Trung Quốc."}}
    ],
    "step3_hanzi": [
      {"hanzi": "人", "pinyin": "rén", "meaning": "Con người", "strokesCount": 2, "strokeOrderText": "Phẩy trước (丿), Mác sau (乀)", "components": "Bộ Nhân (人)", "mnemonic": "Hình tượng con người đang bước đi trên hai chân."},
      {"hanzi": "十", "pinyin": "shí", "meaning": "Số 10", "strokesCount": 2, "strokeOrderText": "Ngang trước (一), Sổ sau (丨)", "components": "Bộ Thập (十)", "mnemonic": "Đầy đủ thập toàn thập mỹ."}
    ],
    "step4_grammar": {
      "title": "Phân biệt số 4 (sì - thẳng lưỡi) và số 10 (shí - uốn lưỡi)",
      "formula": "四是四，十是十 (sì shì sì, shí shì shí)",
      "explanation": "Số 4 đầu lưỡi sát răng (sì); số 10 đầu lưỡi uốn lên vòm họng (shí).",
      "examples": [{"hanzi": "十四 (shísì) vs 四十 (sìshí)", "pinyin": "shísì / sìshí", "meaning": "14 vs 40."}],
      "commonMistake": {"wrong": "Đọc số 4 và số 10 không phân biệt uốn lưỡi.", "correct": "Luyện líu lưỡi 四是四，十是十.", "explanation": "Đầu lưỡi thẳng vs uốn lưỡi."}
    },
    "step5_listening": {
      "dialogue": [{"speaker": "A", "hanzi": "你要吃什么？", "pinyin": "Nǐ yào chī shénme?", "meaning": "Bạn muốn ăn gì?"}, {"speaker": "B", "hanzi": "我要吃四个包子。", "pinyin": "Wǒ yào chī sì gè bāozi.", meaning: "Tôi muốn ăn 4 bánh bao."}],
      "audioText": "我要吃四个包子。", "question": "Người B muốn ăn bao nhiêu bánh bao?", "options": ["10 chiếc", "4 chiếc (sì gè)", "3 chiếc", "14 chiếc"], "correctIndex": 1, "explanation": "Bốn chiếc bánh bao."
    },
    "step6_speaking": {"prompt": "Đọc câu líu lưỡi kinh điển:", "targetSentence": "四是四，十是十。", "targetPinyin": "Sì shì sì, shí shì shí.", "targetMeaning": "Bốn là bốn, mười là mười.", hint": "Chữ sì thẳng lưỡi, chữ shí uốn cong đầu lưỡi."},
    "step7_writing": {"prompt": "Sắp xếp câu: Người Trung Quốc ăn cơm", "words": ["吃饭", "中国人"], "correctOrder": ["中国人", "吃饭"], "explanation": "中国人 + 吃饭."},
    "step8_quiz": [
      {"id": "q-103-1", "type": "multiple-choice", "question": "Khi phát âm ch trong 吃 (chī), lưỡi và hơi như thế nào?", "options": ["Lưỡi thẳng không bật hơi", "Uốn lưỡi lên ngạc cứng và bật hơi mạnh", "Lưỡi chạm răng dưới", "Không dùng hơi"], "correctIndex": 1, "explanation": "ch là âm uốn lưỡi bật hơi."},
      {"id": "q-103-2", "type": "multiple-choice", "question": "Số 40 trong tiếng Trung đọc là gì?", "options": ["shísì", "sìshí", "shíshí", "sìsì"], "correctIndex": 1, "explanation": "40 là sìshí."}
    ],
    "step9_challenge": {"title": "Luyện líu lưỡi 4 và 10", "taskDesc": "Đọc to: Sì shì sì, shí shì shí, shísì shì shísì.", "targetPhrase": "sì shì sì shí shì shí", "xpReward": 50, "badge": "Bậc Thầy Líu Lưỡi Pinyin"}
  },

  {
    "id": "l-104", "chapterId": "ch-1", "levelId": "lvl-1", "lessonNumber": 4,
    "title": "Vận mẫu kép & 10 Bộ thủ thông dụng nhất (Phần 1)",
    "chineseTitle": "复韵母与前十大常用部首",
    "subtitle": "Nắm chắc các vận mẫu kép ai, ei, ao, ou, an, en, ang, eng và 10 bộ thủ giúp đoán nghĩa 500 chữ Hán.",
    "objective": "Phát âm chuẩn vận mẫu mũi an/ang, en/eng, nhận diện 10 bộ thủ phổ biến.",
    "prerequisite": "Đã hoàn thành Bài 101–103.",
    "completionCriteria": "Nhận diện đúng bộ thủ và ý nghĩa liên kết trong trắc nghiệm >= 70%.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 1", "Vận mẫu kép", "Bộ thủ", "Chiết tự"],
    "relatedMaterialIds": ["mat-4", "mat-8"],
    "step1_learn": {
      "topic": "Vận mẫu mũi & 10 Bộ thủ đoán nghĩa thần thánh",
      "summary": "Vận mẫu kết thúc bằng n là âm mũi trước (an, en), kết thúc bằng ng là âm mũi sau mở rộng họng (ang, eng). Bộ thủ là chìa khóa mở kho báu chữ Hán.",
      "audioDemoText": "bān bāng fēn fēng hán háng"
    },
    "step2_vocabulary": [
      {"id": "v-104-1", "hanzi": "水", "pinyin": "shuǐ", "hanviet": "Thủy", "meaning": "Nước", "radical": "水 (Thủy)", "example": {"hanzi": "喝水。", "pinyin": "Hē shuǐ.", "meaning": "Uống nước."}},
      {"id": "v-104-2", "hanzi": "火", "pinyin": "huǒ", "hanviet": "Hỏa", "meaning": "Lửa", "radical": "火 (Hỏa)", "example": {"hanzi": "大火。", "pinyin": "Dà huǒ.", "meaning": "Lửa lớn."}},
      {"id": "v-104-3", "hanzi": "木", "pinyin": "mù", "hanviet": "Mộc", "meaning": "Gỗ, cây cối", "radical": "木 (Mộc)", "example": {"hanzi": "树木。", "pinyin": "Shùmù.", "meaning": "Cây cối."}},
      {"id": "v-104-4", "hanzi": "月", "pinyin": "yuè", "hanviet": "Nguyệt", "meaning": "Mặt trăng, tháng", "radical": "月 (Nguyệt)", "example": {"hanzi": "一月。", "pinyin": "Yī yuè.", "meaning": "Tháng một."}},
      {"id": "v-104-5", "hanzi": "日", "pinyin": "rì", "hanviet": "Nhật", "meaning": "Mặt trời, ngày", "radical": "日 (Nhật)", "example": {"hanzi": "今日。", "pinyin": "Jīnrì.", "meaning": "Hôm nay."}}
    ],
    "step3_hanzi": [
      {"hanzi": "水", "pinyin": "shuǐ", "meaning": "Nước", "strokesCount": 4, "strokeOrderText": "Sổ móc giữa trước -> Phẩy gập trái -> Phẩy phải -> Mác", "components": "Bộ Thủy (水)", "mnemonic": "Dòng nước chảy cuồn cuộn ở giữa và các giọt nước bắn sang hai bên."},
      {"hanzi": "木", "pinyin": "mù", "meaning": "Cây cối, gỗ", "strokesCount": 4, "strokeOrderText": "Ngang -> Sổ -> Phẩy -> Mác", "components": "Bộ Mộc (木)", "mnemonic": "Hình thân cây với cành lá phía trên và rễ phía dưới."}
    ],
    "step4_grammar": {
      "title": "Bí mật đoán nghĩa chữ Hán qua bộ thủ",
      "formula": "Bộ thủ chỉ ý + Thành phần chỉ âm = Chữ hình thanh (80% chữ Hán)",
      "explanation": "Nhìn thấy bộ Thủy (氵) là biết liên quan đến nước; nhìn thấy bộ Mộc (木) là biết liên quan đến cây cối đồ gỗ.",
      "examples": [{"hanzi": "林 (Lâm - Rừng thưa) vs 森 (Sâm - Rừng rậm)", "pinyin": "lín / sēn", "meaning": "Hai cây vs Ba cây."}],
      "commonMistake": {"wrong": "Học vẹt từng nét rời rạc.", "correct": "Học qua bộ thủ và chiết tự.", "explanation": "Bộ thủ giúp ghi nhớ nhanh gấp 3 lần."}
    },
    "step5_listening": {
      "dialogue": [{"speaker": "A", "hanzi": "你喝水吗？", "pinyin": "Nǐ hē shuǐ ma?", meaning: "Bạn uống nước không?"}, {"speaker": "B", "hanzi": "我喝水，谢谢！", "pinyin": "Wǒ hē shuǐ, xièxie!", meaning: "Tôi uống nước, cảm ơn!"}],
      "audioText": "你喝水吗？我喝水，谢谢！", "question": "Người B chọn uống gì?", "options": ["Uống trà", "Uống nước lọc (shuǐ)", "Uống cà phê", "Không uống gì"], "correctIndex": 1, "explanation": "Người B nói: 我喝水."
    },
    "step6_speaking": {"prompt": "Nói câu mời uống nước:", "targetSentence": "请喝水。", "targetPinyin": "Qǐng hē shuǐ.", "targetMeaning": "Mời uống nước.", hint": "Phát âm shuǐ với âm uốn lưỡi sh."},
    "step7_writing": {"prompt": "Sắp xếp câu: Tôi uống nước", "words": ["水", "喝", "我"], "correctOrder": ["我", "喝", "水"], "explanation": "我 + 喝 + 水."},
    "step8_quiz": [
      {"id": "q-104-1", "type": "multiple-choice", "question": "Bộ Ba chấm thủy (氵) liên quan đến điều gì?", "options": ["Nước, chất lỏng", "Lửa, nhiệt độ", "Cây cối", "Lời nói"], "correctIndex": 0, "explanation": "Liên quan đến nước hoặc chất lỏng."},
      {"id": "q-104-2", "type": "multiple-choice", "question": "Chữ 森 (sēn - Rừng rậm) gồm 3 chữ nào ghép lại?", "options": ["3 chữ Hỏa", "3 chữ Mộc (木)", "3 chữ Thủy", "3 chữ Nhật"], "correctIndex": 1, "explanation": "Gồm 3 chữ Mộc (木)."}
    ],
    "step9_challenge": {"title": "Nhận diện 5 bộ thủ", "taskDesc": "Chỉ ra bộ thủ của 你, 妈, 喝, 河, 说.", "targetPhrase": "rén nǚ kǒu shuǐ yán", "xpReward": 50, "badge": "Thần Nhãn Chiết Tự"}
  },

  {
    "id": "l-105", "chapterId": "ch-1", "levelId": "lvl-1", "lessonNumber": 5,
    "title": "Quy tắc biến điệu thực chiến & Ôn tập Module 1.1",
    "chineseTitle": "变调实战与模块一复习",
    "subtitle": "Làm chủ bí kíp biến điệu 2 thanh 3, biến điệu chữ 不 và chữ 一, tổng duyệt sẵn sàng đấu Boss.",
    "objective": "Nắm vững quy tắc biến điệu thanh 3, biến điệu chữ 一 và chữ 不, đạt điều kiện mở khóa Boss 1.",
    "prerequisite": "Đã hoàn thành Bài 101–104.",
    "completionCriteria": "Đạt >= 80% điểm bài tập tổng kết Module 1.1.",
    "durationMinutes": 25, "xpReward": 60, "tags": ["HSK 1", "Biến điệu", "Tổng kết Module", "Review Checkpoint"],
    "relatedMaterialIds": ["mat-1", "mat-8"],
    "step1_learn": {
      "topic": "3 Quy tắc biến điệu quan trọng nhất trong tiếng Trung",
      "summary": "1. Hai thanh 3 liền nhau: 3+3 -> 2+3 (nǐ hǎo -> ní hǎo). 2. 不 trước thanh 4: bù -> bú (bú shì). 3. 一 trước thanh 4 -> yí; trước thanh 1,2,3 -> yì.",
      "audioDemoText": "ní hǎo, bú shì, yí gè, yì tiān, yì qǐ"
    },
    "step2_vocabulary": [
      {"id": "v-105-1", "hanzi": "你好", "pinyin": "nǐ hǎo", "hanviet": "Nhĩ hảo", "meaning": "Xin chào", "radical": "亻 (Nhân)", "example": {"hanzi": "你好！", "pinyin": "Nǐ hǎo!", "meaning": "Xin chào!"}},
      {"id": "v-105-2", "hanzi": "不是", "pinyin": "bú shì", "hanviet": "Bất thị", "meaning": "Không phải là", "radical": "日 (Nhật)", "example": {"hanzi": "我不是老师。", "pinyin": "Wǒ bú shì lǎoshī.", "meaning": "Tôi không phải là giáo viên."}},
      {"id": "v-105-3", "hanzi": "一个", "pinyin": "yí gè", "hanviet": "Nhất cá", "meaning": "Một cái / một người", "radical": "人 (Nhân)", "example": {"hanzi": "一个人。", "pinyin": "Yí gè rén.", "meaning": "Một người."}},
      {"id": "v-105-4", "hanzi": "一起", "pinyin": "yìqǐ", "hanviet": "Nhất khởi", "meaning": "Cùng nhau", "radical": "走 (Tẩu)", "example": {"hanzi": "我们一起去。", "pinyin": "Wǒmen yìqǐ qù.", "meaning": "Chúng ta cùng đi."}}
    ],
    "step3_hanzi": [
      {"hanzi": "个", "pinyin": "gè", "meaning": "Cái, chiếc", "strokesCount": 3, "strokeOrderText": "Phẩy -> Sổ -> Sổ giữa", "components": "Bộ Nhân (人)", "mnemonic": "Một cá nhân độc lập."},
      {"hanzi": "起", "pinyin": "qǐ", "meaning": "Dậy, khởi đầu", "strokesCount": 10, strokeOrderText": "Bộ Tẩu (走) -> Kỷ (己)", "components": "走 + 己", mnemonic": "Bản thân cất bước đi bắt đầu hành trình."}
    ],
    "step4_grammar": {
      "title": "Đọc biến điệu nhưng viết đúng âm gốc",
      "formula": "Biến âm khi nói, Pinyin sách giữ nguyên thanh gốc",
      "explanation": "Trong từ điển chữ 你好 in nǐ hǎo, miệng đọc ní hǎo; chữ 不是 in bù shì, miệng đọc bú shì.",
      "examples": [{"hanzi": "你好 (Viết: nǐ hǎo, Đọc: ní hǎo)", "pinyin": "ní hǎo", "meaning": "Xin chào."}],
      "commonMistake": {"wrong": "Viết bài thi Pinyin chữ nǐ thành ní.", "correct": "Giữ nguyên dấu thanh 3 gốc trên giấy thi.", "explanation": "Khảo thí quốc tế chấm theo âm gốc."}
    },
    "step5_listening": {
      "dialogue": [{"speaker": "A", "hanzi": "你好！你是一个人吗？", "pinyin": "Nǐ hǎo! Nǐ shì yí gè rén ma?", meaning: "Xin chào! Bạn đi một mình à?"}, {"speaker": "B", "hanzi": "不是，我们一起去。", "pinyin": "Bú shì, wǒmen yìqǐ qù.", meaning: "Không phải, chúng tôi cùng đi."}],
      "audioText": "你好！你是一个人吗？不是，我们一起去。", "question": "Người B đi với ai?", "options": ["Đi một mình", "Cùng đi với người khác", "Không đi đâu", "Ở nhà ngủ"], "correctIndex": 1, "explanation": "Chúng tôi cùng đi."
    },
    "step6_speaking": {"prompt": "Đọc câu áp dụng cả 3 quy tắc biến điệu:", "targetSentence": "你好，我不是一个人。", "targetPinyin": "Nǐ hǎo, wǒ bú shì yí gè rén.", "targetMeaning": "Xin chào, tôi không phải đi một mình.", hint": "Đọc mượt: ní hǎo - wǒ bú shì - yí gè rén."},
    "step7_writing": {"prompt": "Sắp xếp câu: Chúng tôi cùng nhau ăn cơm", "words": ["吃饭", "一起", "我们"], "correctOrder": ["我们", "一起", "吃饭"], "explanation": "我们 + 一起 + 吃饭."},
    "step8_quiz": [
      {"id": "q-105-1", "type": "multiple-choice", "question": "Cụm 一个 (yī + gè) phát âm biến điệu thế nào trước thanh 4?", "options": ["yī gè", "yí gè", "yì gè", "yǐ gè"], "correctIndex": 1, "explanation": "Chữ 一 trước thanh 4 đọc yí gè."},
      {"id": "q-105-2", "type": "multiple-choice", "question": "Trong câu 我很好 (wǒ hěn hǎo), ba thanh 3 liền nhau đọc thành:", "options": ["wǒ hén hǎo (3-2-3)", "giữ nguyên cả 3", "đổi thành thanh 1", "đổi thành thanh 4"], "correctIndex": 0, "explanation": "Đọc thành wǒ hén hǎo."}
    ],
    "step9_challenge": {"title": "Mở khóa Boss Chapter 1", "taskDesc": "Vượt qua bài tập Module 1.1 để bước vào đại chiến ngữ âm với Thầy Vương!", "targetPhrase": "nǐ hǎo bú shì yí gè", "xpReward": 60, "badge": "Sẵn Sàng Diệt Boss Ngữ Âm"}
  }
]

print("Base 5 lessons loaded into RAW_CURRICULUM")
