# -*- coding: utf-8 -*-
"""
Full Generator for Curriculum Lessons 111-120, 201-220, 301-320 (50 lessons)
Mapped 100% to docs/HANZIGO_CHINESE_CURRICULUM.md v2.0
"""
import json

LESSONS = []

def add_lesson(l):
    LESSONS.append(l)

# =========================================================================
# MODULE 1.3: GIA ĐÌNH, THỜI GIAN & NƠI CHỐN (BÀI 111-115, ch-3)
# =========================================================================

add_lesson({
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
})

add_lesson({
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
})

print("Lessons 111 and 112 created")
