# -*- coding: utf-8 -*-
"""
Module 1.3 & 1.4 Lessons (111 to 120)
Strictly adheres to docs/HANZIGO_CHINESE_CURRICULUM.md
"""

MODULE_1_LESSONS = [
  # --- LESSON 111 ---
  {
    "id": "l-111", "chapterId": "ch-3", "levelId": "lvl-1", "lessonNumber": 11,
    "title": "Gia đình & Động từ sở hữu 有 / 没有",
    "chineseTitle": "家庭与动词“有/没有”",
    "subtitle": "Nói về các thành viên gia đình, đếm người bằng lượng từ 口 và làm chủ động từ 有/没有.",
    "objective": "Giới thiệu trôi chảy số người trong gia đình và sử dụng chính xác phủ định 没有 (không dùng 不有).",
    "prerequisite": "Đã hoàn thành Module 1.2.",
    "completionCriteria": "Đạt >= 70% bài trắc nghiệm và giới thiệu đúng các thành viên gia đình.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 1", "Gia đình", "Động từ 有", "Lượng từ 口"],
    "relatedMaterialIds": ["mat-1", "mat-5"],
    "step1_learn": {
      "topic": "Động từ sở hữu 有 / 没有 & Thành viên trong gia đình",
      "summary": "Để diễn tả 'có' ta dùng 有 (yǒu), phủ định của 有 luôn luôn là 没有 (méiyǒu), tuyệt đối không dùng 不有. Đếm số người trong gia đình dùng lượng từ 口 (kǒu).",
      "audioDemoText": "nǐ jiā yǒu jǐ kǒu rén, wǒ jiā yǒu sì kǒu rén"
    },
    "step2_vocabulary": [
      {"id": "v-111-1", "hanzi": "有", "pinyin": "yǒu", "hanviet": "Hữu", "meaning": "Có", "radical": "月 (Nguyệt)", "example": {"hanzi": "我有两个姐姐。", "pinyin": "Wǒ yǒu liǎng gè jiějie.", "meaning": "Tôi có 2 người chị gái."}},
      {"id": "v-111-2", "hanzi": "没有", "pinyin": "méiyǒu", "hanviet": "Một hữu", "meaning": "Không có", "radical": "氵 (Thủy)", "example": {"hanzi": "我没有哥哥。", "pinyin": "Wǒ méiyǒu gēge.", "meaning": "Tôi không có anh trai."}},
      {"id": "v-111-3", "hanzi": "家", "pinyin": "jiā", "hanviet": "Gia", "meaning": "Nhà, gia đình", "radical": "宀 (Miên)", "example": {"hanzi": "我家在北京。", "pinyin": "Wǒ jiā zài Běijīng.", "meaning": "Nhà tôi ở Bắc Kinh."}},
      {"id": "v-111-4", "hanzi": "哥哥", "pinyin": "gēge", "hanviet": "Ca ca", "meaning": "Anh trai", "radical": "口 (Khẩu)", "example": {"hanzi": "我哥哥很高。", "pinyin": "Wǒ gēge hěn gāo.", "meaning": "Anh trai tôi rất cao."}},
      {"id": "v-111-5", "hanzi": "姐姐", "pinyin": "jiějie", "hanviet": "Tỷ tỷ", "meaning": "Chị gái", "radical": "女 (Nữ)", "example": {"hanzi": "姐姐是医生。", "pinyin": "Jiějie shì yīshēng.", "meaning": "Chị gái là bác sĩ."}},
      {"id": "v-111-6", "hanzi": "和", "pinyin": "hé", "hanviet": "Hòa", "meaning": "Và, cùng với", "radical": "口 (Khẩu)", "example": {"hanzi": "爸爸和我。", "pinyin": "Bàba hé wǒ.", "meaning": "Bố và tôi."}}
    ],
    "step3_hanzi": [
      {"hanzi": "有", "pinyin": "yǒu", "meaning": "Có (sở hữu)", "strokesCount": 6, "strokeOrderText": "Ngang -> Phẩy -> Bộ Nguyệt (月)", "components": "Bộ Nguyệt", "mnemonic": "Bàn tay nắm miếng thịt tượng trưng sự sở hữu sung túc."},
      {"hanzi": "家", "pinyin": "jiā", "meaning": "Gia đình, nhà", "strokesCount": 10, "strokeOrderText": "Mái nhà (宀) -> Chữ Thỉ (豕)", "components": "宀 + 豕", "mnemonic": "Dưới mái nhà che chở có đàn gia súc sinh sống ấm no."}
    ],
    "step4_grammar": {
      "title": "Phủ định của động từ 有 là 没有 (KHÔNG DÙNG 不有)",
      "formula": "Chủ ngữ + 有 / 没有 + Danh từ",
      "explanation": "Trong tiếng Trung, phủ định duy nhất của động từ sở hữu 有 là 没有. Tuyệt đối không dùng 不 có nghĩa là không để ghép với 有.",
      "examples": [{"hanzi": "我没有汉语书。", "pinyin": "Wǒ méiyǒu Hànyǔ shū.", "meaning": "Tôi không có sách tiếng Trung."}],
      "commonMistake": {"wrong": "我不有书 ❌", "correct": "我没有书 ✔️", "explanation": "Phủ định của 有 luôn luôn là 没有."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "你家有几口人？", "pinyin": "Nǐ jiā yǒu jǐ kǒu rén?", "meaning": "Nhà bạn có mấy người?"},
        {"speaker": "B", "hanzi": "我家有四口人：爸爸、妈妈、哥哥和我。", "pinyin": "Wǒ jiā yǒu sì kǒu rén: bàba, māma, gēge hé wǒ.", "meaning": "Nhà tôi có 4 người: bố, mẹ, anh trai và tôi."}
      ],
      "audioText": "你家有几口人？我家有四口人：爸爸、妈妈、哥哥和我。",
      "question": "Gia đình người B gồm những ai?",
      "options": ["3 người: bố, mẹ và B", "4 người: bố, mẹ, anh trai và B", "5 người", "2 người"],
      "correctIndex": 1, "explanation": "B nói: 四口人: bàba, māma, gēge hé wǒ (4 người)."
    },
    "step6_speaking": {"prompt": "Nói về số người trong nhà:", "targetSentence": "我家有四口人。", "targetPinyin": "Wǒ jiā yǒu sì kǒu rén.", "targetMeaning": "Nhà tôi có 4 người.", "hint": "Đọc kǒu rõ ràng với thanh 3."},
    "step7_writing": {"prompt": "Sắp xếp câu: Tôi không có anh trai", "words": ["哥哥", "我", "没有"], "correctOrder": ["我", "没有", "哥哥"], "explanation": "我 + 没有 + 哥哥."},
    "step8_quiz": [
      {"id": "q-111-1", "type": "multiple-choice", "question": "Câu nào sau đây phủ định đúng về sở hữu?", "options": ["我不有姐姐", "我没有姐姐", "我没姐姐有", "我不姐姐"], "correctIndex": 1, "explanation": "Phủ định của 有 bắt buộc là 没有."},
      {"id": "q-111-2", "type": "multiple-choice", "question": "Lượng từ dùng để hỏi số người trong gia đình là:", "options": ["个 (gè)", "口 (kǒu)", "本 (běn)", "只 (zhī)"], "correctIndex": 1, "explanation": "Đếm người trong gia đình dùng 口 (kǒu rén)."}
    ],
    "step9_challenge": {"title": "Giới thiệu gia đình bạn", "taskDesc": "Đọc to câu giới thiệu gia đình: Nhà tôi có mấy người, gồm những ai.", "targetPhrase": "wǒ jiā yǒu sì kǒu rén", "xpReward": 50, "badge": "Ấm Áp Tình Thân"}
  },

  # --- LESSON 112 ---
  {
    "id": "l-112", "chapterId": "ch-3", "levelId": "lvl-1", "lessonNumber": 12,
    "title": "Ngày tháng năm theo trật tự lớn đến bé",
    "chineseTitle": "年月日与星期表达",
    "subtitle": "Nắm vững quy tắc thời gian kinh điển của tiếng Trung: Năm -> Tháng -> Ngày -> Thứ trong tuần.",
    "objective": "Hỏi và nói chuẩn xác ngày, tháng, năm và thứ trong tuần bằng tiếng Trung.",
    "prerequisite": "Đã hoàn thành Bài 111.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng ngày hôm nay.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 1", "Thời gian", "Ngày tháng", "Thứ trong tuần"],
    "relatedMaterialIds": ["mat-1", "mat-6"],
    "step1_learn": {
      "topic": "Trật tự thời gian từ lớn đến bé: 年 (nián) -> 月 (yuè) -> 日/号 (hào) -> 星期 (xīngqī)",
      "summary": "Người Trung Quốc tư duy từ vĩ mô đến vi mô: Năm trước, tháng giữa, ngày sau, cuối cùng là thứ trong tuần. Trong văn nói thường dùng 号 thay cho 日.",
      "audioDemoText": "jīntiān jǐ yuè jǐ hào, jīntiān shí yuè jiǔ hào xīngqīwǔ"
    },
    "step2_vocabulary": [
      {"id": "v-112-1", "hanzi": "今天", "pinyin": "jīntiān", "hanviet": "Kim thiên", "meaning": "Hôm nay", "radical": "人 (Nhân)", "example": {"hanzi": "今天很冷。", "pinyin": "Jīntiān hěn lěng.", "meaning": "Hôm nay rất lạnh."}},
      {"id": "v-112-2", "hanzi": "明天", "pinyin": "míngtiān", "hanviet": "Minh thiên", "meaning": "Ngày mai", "radical": "日 (Nhật)", "example": {"hanzi": "明天见。", "pinyin": "Míngtiān jiàn.", "meaning": "Mai gặp lại nhé."}},
      {"id": "v-112-3", "hanzi": "昨天", "pinyin": "zuótiān", "hanviet": "Tạc thiên", "meaning": "Hôm qua", "radical": "日 (Nhật)", "example": {"hanzi": "昨天是星期四。", "pinyin": "Zuótiān shì xīngqīsì.", "meaning": "Hôm qua là thứ Năm."}},
      {"id": "v-112-4", "hanzi": "月", "pinyin": "yuè", "hanviet": "Nguyệt", "meaning": "Tháng", "radical": "月 (Nguyệt)", "example": {"hanzi": "十月。", "pinyin": "Shí yuè.", "meaning": "Tháng 10."}},
      {"id": "v-112-5", "hanzi": "号", "pinyin": "hào", "hanviet": "Hào", "meaning": "Ngày, mùng", "radical": "口 (Khẩu)", "example": {"hanzi": "九号。", "pinyin": "Jiǔ hào.", "meaning": "Mùng 9."}},
      {"id": "v-112-6", "hanzi": "星期", "pinyin": "xīngqī", "hanviet": "Tinh kỳ", "meaning": "Thứ, tuần", "radical": "日 (Nhật)", "example": {"hanzi": "星期五。", "pinyin": "Xīngqīwǔ.", "meaning": "Thứ Sáu."}}
    ],
    "step3_hanzi": [
      {"hanzi": "天", "pinyin": "tiān", "meaning": "Trời, ngày", "strokesCount": 4, "strokeOrderText": "Ngang trên -> Ngang dưới -> Phẩy -> Mác", "components": "一 + 大", "mnemonic": "Phía trên đỉnh đầu con người to lớn chính là bầu trời cao rộng."},
      {"hanzi": "月", "pinyin": "yuè", "meaning": "Mặt trăng, tháng", "strokesCount": 4, "strokeOrderText": "Phẩy đứng -> Ngang gập móc -> Hai nét ngang trong", "components": "Bộ Nguyệt", "mnemonic": "Hình tượng vầng trăng khuyết chiếu sáng ban đêm."}
    ],
    "step4_grammar": {
      "title": "Trật tự thời gian từ lớn đến bé",
      "formula": "Năm (年) + Tháng (月) + Ngày (号) + Thứ (星期)",
      "explanation": "Quy tắc bất di bất dịch của tiếng Trung là đơn vị lớn luôn đứng trước đơn vị bé, ngược hoàn toàn với tiếng Việt.",
      "examples": [{"hanzi": "今天十月九号，星期五。", "pinyin": "Jīntiān shí yuè jiǔ hào, xīngqīwǔ.", "meaning": "Hôm nay ngày 9 tháng 10, thứ Sáu."}],
      "commonMistake": {"wrong": "Nói ngày trước tháng sau theo tiếng Việt (9号10月 ❌)", "correct": "Tháng trước ngày sau: 10月9号 ✔️", "explanation": "Thời gian tiếng Trung luôn đi từ lớn đến bé."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "今天几月几号？", "pinyin": "Jīntiān jǐ yuè jǐ hào?", "meaning": "Hôm nay ngày mấy tháng mấy?"},
        {"speaker": "B", "hanzi": "今天十月九号，星期五。", "pinyin": "Jīntiān shí yuè jiǔ hào, xīngqīwǔ.", "meaning": "Hôm nay ngày 9 tháng 10, thứ Sáu."}
      ],
      "audioText": "今天十月九号，星期五。",
      "question": "Hôm nay là thứ mấy?",
      "options": ["Thứ Năm", "Thứ Sáu (xīngqīwǔ)", "Thứ Bảy", "Chủ nhật"],
      "correctIndex": 1, "explanation": "星期五 là Thứ Sáu."
    },
    "step6_speaking": {"prompt": "Nói ngày hôm nay:", "targetSentence": "今天十月九号。", "targetPinyin": "Jīntiān shí yuè jiǔ hào.", "targetMeaning": "Hôm nay ngày 9 tháng 10.", "hint": "Tháng trước ngày sau: shí yuè jiǔ hào."},
    "step7_writing": {"prompt": "Sắp xếp câu: Ngày mai là thứ Bảy", "words": ["明天", "星期六", "是"], "correctOrder": ["明天", "是", "星期六"], "explanation": "明天 + 是 + 星期六."},
    "step8_quiz": [
      {"id": "q-112-1", "type": "multiple-choice", "question": "Trong tiếng Trung, 'Thứ Hai' được nói là gì?", "options": ["星期一", "星期二", "星期天", "星期日"], "correctIndex": 0, "explanation": "Thứ Hai tương ứng số 1: 星期一."},
      {"id": "q-112-2", "type": "multiple-choice", "question": "Cách nói ngày 1 tháng 1 chuẩn là:", "options": ["一号一月", "一月一号", "一号月一", "一月号一"], "correctIndex": 1, "explanation": "Tháng trước ngày sau: 一月一号."}
    ],
    "step9_challenge": {"title": "Đọc ngày sinh nhật của bạn", "taskDesc": "Đọc to ngày tháng sinh nhật của bản thân bằng tiếng Trung.", "targetPhrase": "jīntiān shí yuè jiǔ hào", "xpReward": 50, "badge": "Làm Chủ Lịch Trình"}
  },

  # --- LESSON 113 ---
  {
    "id": "l-113", "chapterId": "ch-3", "levelId": "lvl-1", "lessonNumber": 13,
    "title": "Giờ giấc & Hoạt động thường nhật",
    "chineseTitle": "时间点与日常活动（现在几点）",
    "subtitle": "Làm chủ cách hỏi giờ (现在几点), nói giờ hơn/phút và diễn đạt lịch trình sinh hoạt hàng ngày.",
    "objective": "Hỏi và trả lời giờ giấc chính xác (点 - giờ, 分 - phút, 半 - rưỡi), miêu tả lịch sinh hoạt cơ bản.",
    "prerequisite": "Đã hoàn thành Bài 112.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng giờ hiện tại.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 1", "Giờ giấc", "Hỏi giờ", "Lịch sinh hoạt"],
    "relatedMaterialIds": ["mat-1", "mat-6"],
    "step1_learn": {
      "topic": "Hỏi giờ: 现在几点？ (Xiànzài jǐ diǎn?) & Diễn đạt mốc thời gian",
      "summary": "点 (diǎn) là giờ, 分 (fēn) là phút, 半 (bàn) là 30 phút/rưỡi. Trạng ngữ chỉ thời gian luôn đứng trước động từ trong câu tiếng Trung.",
      "audioDemoText": "xiànzài jǐ diǎn, xiànzài bā diǎn bàn, wǒ qī diǎn qǐchuáng"
    },
    "step2_vocabulary": [
      {"id": "v-113-1", "hanzi": "现在", "pinyin": "xiànzài", "hanviet": "Hiện tại", "meaning": "Bây giờ, hiện nay", "radical": "玉 (Ngọc)", "example": {"hanzi": "现在几点了？", "pinyin": "Xiànzài jǐ diǎn le?", "meaning": "Bây giờ mấy giờ rồi?"}},
      {"id": "v-113-2", "hanzi": "点", "pinyin": "diǎn", "hanviet": "Điểm", "meaning": "Giờ", "radical": "灬 (Hỏa)", "example": {"hanzi": "八点。", "pinyin": "Bā diǎn.", "meaning": "8 giờ."}},
      {"id": "v-113-3", "hanzi": "分", "pinyin": "fēn", "hanviet": "Phân", "meaning": "Phút", "radical": "刀 (Đao)", "example": {"hanzi": "十分。", "pinyin": "Shí fēn.", "meaning": "10 phút."}},
      {"id": "v-113-4", "hanzi": "半", "pinyin": "bàn", "hanviet": "Bán", "meaning": "Rưỡi, nửa", "radical": "十 (Thập)", "example": {"hanzi": "八点半。", "pinyin": "Bā diǎn bàn.", "meaning": "8 giờ rưỡi."}},
      {"id": "v-113-5", "hanzi": "上午", "pinyin": "shàngwǔ", "hanviet": "Thượng ngọ", "meaning": "Buổi sáng", "radical": "十 (Thập)", "example": {"hanzi": "上午好。", "pinyin": "Shàngwǔ hǎo.", "meaning": "Chào buổi sáng."}},
      {"id": "v-113-6", "hanzi": "下午", "pinyin": "xiàwǔ", "hanviet": "Hạ ngọ", "meaning": "Buổi chiều", "radical": "一 (Nhất)", "example": {"hanzi": "下午三点。", "pinyin": "Xiàwǔ sān diǎn.", "meaning": "3 giờ chiều."}}
    ],
    "step3_hanzi": [
      {"hanzi": "现", "pinyin": "xiàn", "meaning": "Hiện tại, xuất hiện", "strokesCount": 8, "strokeOrderText": "Bộ Vương (王) -> Bộ Kiến (见)", "components": "王 + 见", "mnemonic": "Viên ngọc quý xuất hiện rực rỡ ở hiện tại."},
      {"hanzi": "点", "pinyin": "diǎn", "meaning": "Giờ, chấm nhỏ", "strokesCount": 9, "strokeOrderText": "Chữ Chiếm (占) ở trên -> Bốn chấm hỏa (灬) ở dưới", "components": "占 + 灬", "mnemonic": "Ngọn lửa nhỏ cháy tạo từng đốm sáng chỉ mốc giờ."}
    ],
    "step4_grammar": {
      "title": "Vị trí của trạng ngữ thời gian trong câu",
      "formula": "Chủ ngữ + Thời gian + Động từ + Tân ngữ (HOẶC Thời gian + Chủ ngữ + Động từ)",
      "explanation": "Trong tiếng Trung, thời gian PHẢI đứng trước động từ. Tuyệt đối không để thời gian ở cuối câu như tiếng Việt.",
      "examples": [{"hanzi": "我上午八点去学校。", "pinyin": "Wǒ shàngwǔ bā diǎn qù xuéxiào.", "meaning": "Tôi đi đến trường lúc 8 giờ sáng."}],
      "commonMistake": {"wrong": "我吃早饭在七点 ❌", "correct": "我七点吃早饭 ✔️", "explanation": "Thời gian luôn đứng trước hành động."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "请问，现在几点？", "pinyin": "Qǐngwèn, xiànzài jǐ diǎn?", "meaning": "Xin hỏi, bây giờ mấy giờ?"},
        {"speaker": "B", "hanzi": "现在下午三点半。", "pinyin": "Xiànzài xiàwǔ sān diǎn bàn.", "meaning": "Bây giờ là 3 giờ rưỡi chiều."}
      ],
      "audioText": "请问，现在几点？现在下午三点半。",
      "question": "Bây giờ là thời điểm nào?",
      "options": ["8 giờ sáng", "3 giờ rưỡi chiều (sān diǎn bàn)", "12 giờ trưa", "5 giờ chiều"],
      "correctIndex": 1, "explanation": "3 giờ rưỡi chiều: 下午三点半."
    },
    "step6_speaking": {"prompt": "Trả lời câu hỏi bây giờ mấy giờ:", "targetSentence": "现在八点半。", "targetPinyin": "Xiànzài bā diǎn bàn.", "targetMeaning": "Bây giờ 8 giờ rưỡi.", "hint": "Đọc bā diǎn bàn dứt khoát."},
    "step7_writing": {"prompt": "Sắp xếp câu: Tôi 8 giờ đi học", "words": ["去学校", "八点", "我"], "correctOrder": ["我", "八点", "去学校"], "explanation": "我 + 八点 + 去学校."},
    "step8_quiz": [
      {"id": "q-113-1", "type": "multiple-choice", "question": "Cách nói '8 giờ rưỡi' trong tiếng Trung là:", "options": ["八点半", "八分点", "半八点", "八点三十五"], "correctIndex": 0, "explanation": "8 giờ rưỡi là 八点半 (bā diǎn bàn)."},
      {"id": "q-113-2", "type": "multiple-choice", "question": "Câu nào sau đây đúng trật tự thời gian?", "options": ["我去公司八点", "我八点去公司", "去公司我八点", "八点公司我去"], "correctIndex": 1, "explanation": "Thời gian đứng trước động từ: 我八点去公司."}
    ],
    "step9_challenge": {"title": "Nói giờ hiện tại", "taskDesc": "Nhìn đồng hồ và đọc to giờ hiện tại bằng tiếng Trung.", "targetPhrase": "xiànzài jǐ diǎn le", "xpReward": 50, "badge": "Đồng Hồ Sống"}
  },

  # --- LESSON 114 ---
  {
    "id": "l-114", "chapterId": "ch-3", "levelId": "lvl-1", "lessonNumber": 14,
    "title": "Địa điểm & Động từ chỉ nơi chốn 在, 去",
    "chineseTitle": "地点与介词“在/去”（你在哪儿）",
    "subtitle": "Hỏi và nói vị trí ở đâu với 在 (zài), đi đâu với 去 (qù) và cấu trúc làm gì ở đâu.",
    "objective": "Hỏi nơi chốn (哪儿), nói phương hướng di chuyển (去) và diễn đạt cấu trúc 'ở đâu làm gì' chuẩn ngữ pháp.",
    "prerequisite": "Đã hoàn thành Bài 113.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cấu trúc 在 + Địa điểm + Động từ.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 1", "Địa điểm", "Giới từ 在", "Động từ 去"],
    "relatedMaterialIds": ["mat-1", "mat-7"],
    "step1_learn": {
      "topic": "Hỏi vị trí: 你在哪儿？ (Nǐ zài nǎr?) & Cấu trúc Ở ĐÂU LÀM GÌ",
      "summary": "Trong tiếng Trung, địa điểm xảy ra hành động PHẢI đứng trước hành động đó: S + 在 + Nơi chốn + V. Khác với tiếng Việt (Ăn cơm ở nhà -> Tiếng Trung: Ở nhà ăn cơm).",
      "audioDemoText": "nǐ zài nǎr, wǒ zài xuéxiào, wǒ zài jiā chīfàn"
    },
    "step2_vocabulary": [
      {"id": "v-114-1", "hanzi": "在", "pinyin": "zài", "hanviet": "Tại", "meaning": "Ở, tại", "radical": "土 (Thổ)", "example": {"hanzi": "你在哪儿？", "pinyin": "Nǐ zài nǎr?", "meaning": "Bạn đang ở đâu?"}},
      {"id": "v-114-2", "hanzi": "哪儿", "pinyin": "nǎr", "hanviet": "Na nhi", "meaning": "Ở đâu, chỗ nào", "radical": "口 (Khẩu)", "example": {"hanzi": "你去哪儿？", "pinyin": "Nǐ qù nǎr?", "meaning": "Bạn đi đâu đấy?"}},
      {"id": "v-114-3", "hanzi": "去", "pinyin": "qù", "hanviet": "Khứ", "meaning": "Đi", "radical": "厶 (Khứ)", "example": {"hanzi": "我去学校。", "pinyin": "Wǒ qù xuéxiào.", "meaning": "Tôi đi đến trường."}},
      {"id": "v-114-4", "hanzi": "学校", "pinyin": "xuéxiào", "hanviet": "Học hiệu", "meaning": "Trường học", "radical": "木 (Mộc)", "example": {"hanzi": "学校很大。", "pinyin": "Xuéxiào hěn dà.", "meaning": "Trường học rất to."}},
      {"id": "v-114-5", "hanzi": "饭馆", "pinyin": "fànguǎn", "hanviet": "Phạn quán", "meaning": "Quán ăn, nhà hàng", "radical": "饣 (Thực)", "example": {"hanzi": "去饭馆吃饭。", "pinyin": "Qù fànguǎn chīfàn.", "meaning": "Đi quán ăn cơm."}},
      {"id": "v-114-6", "hanzi": "商店", "pinyin": "shāngdiàn", "hanviet": "Thương điếm", "meaning": "Cửa hàng", "radical": "广 (Quảng)", "example": {"hanzi": "商店有水。", "pinyin": "Shāngdiàn yǒu shuǐ.", "meaning": "Cửa hàng có nước."}}
    ],
    "step3_hanzi": [
      {"hanzi": "在", "pinyin": "zài", "meaning": "Ở, tồn tại", "strokesCount": 6, "strokeOrderText": "Ngang -> Phẩy -> Sổ -> Ngang -> Sổ -> Ngang đóng (Bộ Thổ 土)", "components": "Bộ Thổ (土)", "mnemonic": "Cây cối đứng vững trên mặt đất (Thổ) biểu thị sự tồn tại."},
      {"hanzi": "去", "pinyin": "qù", "meaning": "Đi", "strokesCount": 5, "strokeOrderText": "Ngang -> Sổ -> Ngang -> Phẩy gập -> Chấm", "components": "土 + 厶", "mnemonic": "Rời khỏi mảnh đất quê hương để đi nơi khác."}
    ],
    "step4_grammar": {
      "title": "Cấu trúc vàng: Ở đâu làm gì (Chủ ngữ + 在 + Nơi chốn + Động từ)",
      "formula": "Chủ ngữ + 在 + Địa điểm + Hành động",
      "explanation": "Người Trung Quốc quy định: Phải đến địa điểm đó trước rồi mới thực hiện hành động. Do đó cụm 在 + Địa điểm luôn đứng trước Động từ.",
      "examples": [{"hanzi": "我在学校学汉语。", "pinyin": "Wǒ zài xuéxiào xué Hànyǔ.", "meaning": "Tôi học tiếng Trung ở trường."}],
      "commonMistake": {"wrong": "我学汉语在学校 ❌", "correct": "我在学校学汉语 ✔️", "explanation": "Địa điểm phải đứng trước hành động."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "喂，你在哪儿？", "pinyin": "Wèi, nǐ zài nǎr?", "meaning": "Alo, bạn đang ở đâu thế?"},
        {"speaker": "B", "hanzi": "我在商店买东西，你呢？", "pinyin": "Wǒ zài shāngdiàn mǎi dōngxi, nǐ ne?", "meaning": "Tôi đang ở cửa hàng mua đồ, còn bạn?"},
        {"speaker": "A", "hanzi": "我在家看书。", "pinyin": "Wǒ zài jiā kàn shū.", "meaning": "Tôi đang ở nhà đọc sách."}
      ],
      "audioText": "你在哪儿？我在商店买东西。我在家看书。",
      "question": "Người B đang ở đâu và làm gì?",
      "options": ["Ở trường học", "Ở nhà đọc sách", "Ở cửa hàng mua đồ (shāngdiàn)", "Ở nhà hàng ăn cơm"],
      "correctIndex": 2, "explanation": "Người B nói: 我在商店买东西."
    },
    "step6_speaking": {"prompt": "Nói bạn đang ở trường học:", "targetSentence": "我在学校。", "targetPinyin": "Wǒ zài xuéxiào.", "targetMeaning": "Tôi đang ở trường học.", "hint": "Đọc xuéxiào thanh 2 và thanh 4."},
    "step7_writing": {"prompt": "Sắp xếp câu: Tôi ăn cơm ở nhà hàng", "words": ["吃饭", "在饭馆", "我"], "correctOrder": ["我", "在饭馆", "吃饭"], "explanation": "我 + 在饭馆 + 吃饭."},
    "step8_quiz": [
      {"id": "q-114-1", "type": "multiple-choice", "question": "Chọn câu đúng ngữ pháp nói 'Tôi đọc sách ở nhà':", "options": ["我看书在家", "我在家看书", "在家我书看", "我书看在家"], "correctIndex": 1, "explanation": "Cấu trúc chuẩn: 在家 (Ở nhà) + 看书 (Đọc sách)."},
      {"id": "q-114-2", "type": "multiple-choice", "question": "Từ để hỏi 'Ở đâu' trong tiếng Trung là:", "options": ["什么 (shénme)", "哪儿 (nǎr)", "谁 (shéi)", "几 (jǐ)"], "correctIndex": 1, "explanation": "哪儿 mang nghĩa là ở đâu, chỗ nào."}
    ],
    "step9_challenge": {"title": "Báo vị trí cho bạn bè", "taskDesc": "Nói trọn vẹn câu: Bạn đang ở đâu và đang làm gì.", "targetPhrase": "wǒ zài xuéxiào kàn shū", "xpReward": 50, "badge": "Định Vị Chuẩn Xác"}
  },

  # --- LESSON 115 ---
  {
    "id": "l-115", "chapterId": "ch-3", "levelId": "lvl-1", "lessonNumber": 15,
    "title": "Mua sắm cơ bản & Hỏi giá tiền 多少钱",
    "chineseTitle": "基础购物与问价（多少钱）",
    "subtitle": "Hỏi giá (多少钱), đơn vị tiền tệ 块 (kuài) và cấu trúc cảm thán 太...了 (quá...rồi).",
    "objective": "Tự tin hỏi giá đồ vật, hiểu số tiền người bán nói và biết cách kêu đắt (太贵了).",
    "prerequisite": "Đã hoàn thành Bài 114.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đàm thoại mua bán cơ bản.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 1", "Mua sắm", "Giá tiền", "多少钱", "太...了"],
    "relatedMaterialIds": ["mat-1", "mat-2"],
    "step1_learn": {
      "topic": "Hỏi giá: 这个多少钱？ (Zhège duōshao qián?) & Đơn vị tiền tệ",
      "summary": "Để hỏi giá ta dùng 多少钱. Đơn vị tiền tệ khẩu ngữ là 块 (kuài - đồng/tệ), 毛 (máo - hào). Cấu trúc cảm thán: 太 + Tính từ + 了! (太贵了 - Đắt quá rồi!).",
      "audioDemoText": "zhè ge duōshao qián, èrshí kuài qián, tài guì le"
    },
    "step2_vocabulary": [
      {"id": "v-115-1", "hanzi": "多少", "pinyin": "duōshao", "hanviet": "Đa thiểu", "meaning": "Bao nhiêu", "radical": "夕 (Tịch)", "example": {"hanzi": "多少钱？", "pinyin": "Duōshao qián?", "meaning": "Bao nhiêu tiền?"}},
      {"id": "v-115-2", "hanzi": "钱", "pinyin": "qián", "hanviet": "Tiền", "meaning": "Tiền bạc", "radical": "钅 (Kim)", "example": {"hanzi": "我有钱。", "pinyin": "Wǒ yǒu qián.", "meaning": "Tôi có tiền."}},
      {"id": "v-115-3", "hanzi": "块", "pinyin": "kuài", "hanviet": "Khối", "meaning": "Đồng tệ (khẩu ngữ)", "radical": "土 (Thổ)", "example": {"hanzi": "五块钱。", "pinyin": "Wǔ kuài qián.", "meaning": "5 đồng tệ."}},
      {"id": "v-115-4", "hanzi": "买", "pinyin": "mǎi", "hanviet": "Mãi", "meaning": "Mua", "radical": "乙 (Ất)", "example": {"hanzi": "我想买苹果。", "pinyin": "Wǒ xiǎng mǎi píngguǒ.", "meaning": "Tôi muốn mua táo."}},
      {"id": "v-115-5", "hanzi": "太", "pinyin": "tài", "hanviet": "Thái", "meaning": "Quá, lắm", "radical": "大 (Đại)", "example": {"hanzi": "太好了！", "pinyin": "Tài hǎo le!", "meaning": "Tốt quá rồi!"}},
      {"id": "v-115-6", "hanzi": "贵", "pinyin": "guì", "hanviet": "Quý", "meaning": "Đắt, quý", "radical": "贝 (Bối)", "example": {"hanzi": "太贵了！", "pinyin": "Tài guì le!", "meaning": "Đắt quá rồi!"}}
    ],
    "step3_hanzi": [
      {"hanzi": "钱", "pinyin": "qián", "meaning": "Tiền bạc", "strokesCount": 10, "strokeOrderText": "Bộ Kim (钅) -> Hai nét ngang gập bên phải", "components": "钅 + 戋", "mnemonic": "Kim loại vàng bạc quý giá dùng làm tiền tệ trao đổi."},
      {"hanzi": "买", "pinyin": "mǎi", "meaning": "Mua", "strokesCount": 6, "strokeOrderText": "Ngang móc -> Chấm -> Phẩy -> Chấm ngang", "components": "Bộ Ất", "mnemonic": "Bỏ đầu óc và tiền của ra mua hàng hóa về."}
    ],
    "step4_grammar": {
      "title": "Cấu trúc cảm thán cố định 太...了",
      "formula": "太 + Tính từ + 了！ (Ví dụ: 太贵了 / 太好了 / 太大了)",
      "explanation": "Phó từ 太 luôn đi kèm với trợ từ 了 ở cuối câu để biểu thị mức độ cực độ hoặc lời than thở/khen ngợi.",
      "examples": [{"hanzi": "这个苹果太贵了！", "pinyin": "Zhège píngguǒ tài guì le!", "meaning": "Quả táo này đắt quá rồi!"}],
      "commonMistake": {"wrong": "Quên chữ 了: 太贵 ❌", "correct": "Phải nói: 太贵了！ ✔️", "explanation": "太...了 đi thành cặp cố định."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "你好，这个多少钱？", "pinyin": "Nǐ hǎo, zhè ge duōshao qián?", "meaning": "Chào bác, cái này bao nhiêu tiền ạ?"},
        {"speaker": "B", "hanzi": "二十五块钱。", "pinyin": "Èrshíwǔ kuài qián.", "meaning": "25 đồng tệ cháu ơi."}
      ],
      "audioText": "你好，这个多少钱？二十五块钱。",
      "question": "Món đồ có giá bao nhiêu tiền?",
      "options": ["15 tệ", "20 tệ", "25 tệ (èrshíwǔ kuài)", "50 tệ"],
      "correctIndex": 2, "explanation": "25 tệ: 二十五块钱."
    },
    "step6_speaking": {"prompt": "Hỏi giá đồ vật:", "targetSentence": "这个多少钱？", "targetPinyin": "Zhè ge duōshao qián?", "targetMeaning": "Cái này bao nhiêu tiền?", "hint": "Đọc duōshao nhẹ nhàng thanh nhẹ."},
    "step7_writing": {"prompt": "Sắp xếp câu: Cái này đắt quá rồi", "words": ["太贵了", "这个"], "correctOrder": ["这个", "太贵了"], "explanation": "这个 + 太贵了."},
    "step8_quiz": [
      {"id": "q-115-1", "type": "multiple-choice", "question": "Từ khẩu ngữ chỉ đồng tiền tệ Trung Quốc là:", "options": ["元 (yuán)", "块 (kuài)", "角 (jiǎo)", "分 (fēn)"], "correctIndex": 1, "explanation": "Trong khẩu ngữ hàng ngày dùng 块 (kuài)."},
      {"id": "q-115-2", "type": "multiple-choice", "question": "Cụm '太好了！' mang ý nghĩa gì?", "options": ["Đắt quá", "Tuyệt vời / Tốt quá rồi", "Xấu quá", "Không tốt"], "correctIndex": 1, "explanation": "Thái hảo liễu nghĩa là Tốt quá rồi."}
    ],
    "step9_challenge": {"title": "Mở khóa Boss Chapter 3", "taskDesc": "Vượt qua thử thách mua sắm để sẵn sàng khiêu chiến Boss!", "targetPhrase": "zhè ge duōshao qián tài guì le", "xpReward": 60, "badge": "Thánh Mặc Cả Sơ Cấp"}
  }
]

print(f"Loaded {len(MODULE_1_LESSONS)} lessons for Module 1.3")
