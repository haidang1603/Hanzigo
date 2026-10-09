# -*- coding: utf-8 -*-
"""
Level 3 Curriculum Lessons (301 to 310) - Modules 3.1 & 3.2
Strictly adheres to docs/HANZIGO_CHINESE_CURRICULUM.md
"""

LEVEL_3_PART1 = [
  # =========================================================================
  # MODULE 3.1: DU LỊCH, KHÁCH SẠN & GIAO TIẾP ĐỘC LẬP (BÀI 301-305, ch-9)
  # =========================================================================

  # --- LESSON 301 ---
  {
    "id": "l-301", "chapterId": "ch-9", "levelId": "lvl-3", "lessonNumber": 1,
    "title": "Đặt phòng khách sạn & Làm thủ tục check-in (预订酒店)",
    "chineseTitle": "酒店入住与预订手续（押金、护照、房卡）",
    "subtitle": "Xử lý thủ tục khách sạn: Đặt phòng trước (预订), hộ chiếu (护照), tiền đặt cọc (押金), thẻ phòng (房卡).",
    "objective": "Tự tin check-in khách sạn, hỏi mật khẩu wifi và giải quyết các yêu cầu phòng nghỉ độc lập.",
    "prerequisite": "Đã hoàn thành Level 2.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đàm thoại check-in khách sạn trôi chảy.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 3", "Du lịch", "Khách sạn", "预订", "护照", "押金"],
    "relatedMaterialIds": ["mat-3", "mat-7"],
    "step1_learn": {
      "topic": "Hội thoại quầy lễ tân khách sạn: 办理入住 (Bànlǐ rùzhù)",
      "summary": "预订 (yùdìng) là đặt trước. 护照 (hùzhào) là hộ chiếu. 押金 (yājīn) là tiền đặt cọc. 房卡 (fángkǎ) là thẻ phòng. 退房 (tuìfáng) là trả phòng.",
      "audioDemoText": "nǐ hǎo, wǒ zài wǎngshang yùdìng le yí jiān fángjiān, zhè shì wǒ de hùzhào"
    },
    "step2_vocabulary": [
      {"id": "v-301-1", "hanzi": "预订", "pinyin": "yùdìng", "hanviet": "Dự đính", "meaning": "Đặt trước (phòng, vé)", "radical": "页 (Hiệp)", "example": {"hanzi": "预订两晚房间。", "pinyin": "Yùdìng liǎng wǎn fángjiān.", "meaning": "Đặt phòng 2 đêm."}},
      {"id": "v-301-2", "hanzi": "护照", "pinyin": "hùzhào", "hanviet": "Hộ chiếu", "meaning": "Hộ chiếu", "radical": "扌 (Thủ)", "example": {"hanzi": "请出示您的护照。", "pinyin": "Qǐng chūshì nín de hùzhào.", "meaning": "Xin xuất trình hộ chiếu của quý khách."}},
      {"id": "v-301-3", "hanzi": "押金", "pinyin": "yājīn", "hanviet": "Áp kim", "meaning": "Tiền đặt cọc", "radical": "扌 (Thủ)", "example": {"hanzi": "押金两百元。", "pinyin": "Yājīn liǎng bǎi yuán.", "meaning": "Tiền đặt cọc 200 tệ."}},
      {"id": "v-301-4", "hanzi": "退房", "pinyin": "tuìfáng", "hanviet": "Thoái phòng", "meaning": "Trả phòng, check-out", "radical": "辶 (Sước)", "example": {"hanzi": "明天中午退房。", "pinyin": "Míngtiān zhōngwǔ tuìfáng.", "meaning": "Trưa mai trả phòng."}},
      {"id": "v-301-5", "hanzi": "单人房", "pinyin": "dānrénfáng", "hanviet": "Đơn nhân phòng", "meaning": "Phòng đơn", "radical": "十 (Thập)", "example": {"hanzi": "一间单人房。", "pinyin": "Yì jiān dānrénfáng.", "meaning": "Một phòng đơn."}},
      {"id": "v-301-6", "hanzi": "网络", "pinyin": "wǎnglùo", "hanviet": "Võng lạc", "meaning": "Mạng internet, Wifi", "radical": "糸 (Mịch)", "example": {"hanzi": "房间有无线网络吗？", "pinyin": "Fángjiān yǒu wúxiàn wǎnglùo ma?", "meaning": "Phòng có wifi không?"}}
    ],
    "step3_hanzi": [
      {"hanzi": "护", "pinyin": "hù", "meaning": "Bảo hộ, che chở", "strokesCount": 7, "strokeOrderText": "Bộ Ngôn (讠) bên trái -> Chữ Hộ (户) bên phải", "components": "讠 + 户", "mnemonic": "Lời nói văn bản (Ngôn) bảo vệ an toàn cho từng hộ gia đình (Hộ)."},
      {"hanzi": "照", "pinyin": "zhào", "meaning": "Soi sáng, chiếu chụp", "strokesCount": 13, "strokeOrderText": "Chữ Chiêu (昭) ở trên -> Bốn chấm hỏa (灬) ở dưới", "components": "昭 + 灬", "mnemonic": "Ánh sáng rực rỡ soi rọi rõ chân dung tấm ảnh hộ chiếu."}
    ],
    "step4_grammar": {
      "title": "Mẫu câu thực hiện thủ tục: 办理 + Danh từ (办理入住 / 办理退房)",
      "formula": "我想办理 + 入住 (Check-in) / 退房 (Check-out) / 签证 (Visa)",
      "explanation": "Từ 办理 (bànlǐ - xử lý/làm thủ tục) là động từ trang trọng cốt lõi của trình độ HSK 3 trong mọi bối cảnh hành chính, sân bay, khách sạn.",
      "examples": [{"hanzi": "您好，我想办理入住手续，这是我的护照。", "pinyin": "Nín hǎo, wǒ xiǎng bànlǐ rùzhù shǒuxù, zhè shì wǒ de hùzhào.", "meaning": "Xin chào, tôi muốn làm thủ tục nhận phòng, đây là hộ chiếu của tôi."}],
      "commonMistake": {"wrong": "我做住 ❌", "correct": "办理入住 ✔️", "explanation": "Dùng cụm thuật ngữ chuẩn 办理入住."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Lễ tân", "hanzi": "您好，请问有什么可以帮您？", "pinyin": "Nín hǎo, qǐngwèn yǒu shénme kěyǐ bāng nín?", "meaning": "Kính chào quý khách, xin hỏi em có thể giúp gì cho quý khách ạ?"},
        {"speaker": "Khách", "hanzi": "你好，我在网上预订了一间大床房，住两晚，这是我的护照。", "pinyin": "Nǐ hǎo, wǒ zài wǎngshang yùdìng le yì jiān dàchuángfáng, zhù liǎng wǎn, zhè shì wǒ de hùzhào.", "meaning": "Chào bạn, tôi đã đặt trên mạng một phòng giường đôi, ở 2 đêm, đây là hộ chiếu của tôi."}
      ],
      "audioText": "我在网上预订了一间大床房，住两晚，这是我的护照。",
      "question": "Khách hàng đã đặt phòng bằng hình thức nào và ở mấy đêm?",
      "options": ["Gọi điện thoại ở 1 đêm", "Đặt trên mạng ở 2 đêm (wǎngshang yùdìng, zhù liǎng wǎn)", "Đến trực tiếp mua phòng", "Ở 1 tháng"],
      "correctIndex": 1, "explanation": "Khách nói: 在网上预订了一间... 住两晚."
    },
    "step6_speaking": {"prompt": "Đọc câu làm thủ tục nhận phòng:", "targetSentence": "你好，我想办理入住手续。", "targetPinyin": "Nǐ hǎo, wǒ xiǎng bànlǐ rùzhù shǒuxù.", "targetMeaning": "Xin chào, tôi muốn làm thủ tục nhận phòng.", "hint": "Đọc bànlǐ rùzhù shǒuxù dứt khoát."},
    "step7_writing": {"prompt": "Sắp xếp câu: Đây là hộ chiếu của tôi", "words": ["护照", "这是", "我的"], "correctOrder": ["这是", "我的", "护照"], "explanation": "这是 + 我的 + 护照."},
    "step8_quiz": [
      {"id": "q-301-1", "type": "multiple-choice", "question": "Từ mang nghĩa 'Hộ chiếu' trong tiếng Trung là:", "options": ["签证 (qiānzhèng)", "护照 (hùzhào)", "机票 (jīpiào)", "身份证 (shēnfènzhèng)"], "correctIndex": 1, "explanation": "护照 (Hộ chiếu) là passport."},
      {"id": "q-301-2", "type": "multiple-choice", "question": "Khoản tiền đặt cọc tạm thời tại khách sạn gọi là:", "options": ["房费 (fángfèi)", "押金 (yājīn)", "现金 (xiànjīn)", "小费 (xiǎofèi)"], "correctIndex": 1, "explanation": "押金 là tiền cọc bảo đảm."}
    ],
    "step9_challenge": {"title": "Check-in thành công", "taskDesc": "Đọc to màn đối thoại: Chào bạn, tôi đã đặt phòng trước, đây là hộ chiếu và tiền cọc.", "targetPhrase": "wǒ yùdìng le fángjiān zhè shì hùzhào hé yājīn", "xpReward": 50, "badge": "Khách Hàng VIP"}
  },

  # --- LESSON 302 ---
  {
    "id": "l-302", "chapterId": "ch-9", "levelId": "lvl-3", "lessonNumber": 2,
    "title": "Tại sân bay & Thủ tục hành lý (机场办理登机与行李托运)",
    "chineseTitle": "机场登机与行李手续（准时、起飞、迟到）",
    "subtitle": "Kỹ năng hàng không: Thẻ lên máy bay (登机牌), gửi hành lý (托运行李), cất cánh (起飞) và đúng giờ (准时).",
    "objective": "Tự xử lý thủ tục check-in tại sân bay, cân hành lý và tìm đúng cửa lên máy bay.",
    "prerequisite": "Đã hoàn thành Bài 301.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và hiểu thông báo tại sân bay.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 3", "Sân bay", "Hành lý", "起飞", "准时", "迟到"],
    "relatedMaterialIds": ["mat-3", "mat-7"],
    "step1_learn": {
      "topic": "Thủ tục hàng không: 登机 (Dēngjī - Lên máy bay) & 行李 (Xíngli - Hành lý)",
      "summary": "机场 (jīchǎng) là sân bay. 登机牌 (dēngjīpái) là thẻ lên máy bay. 行李 (xíngli) là hành lý. 起飞 (qǐfēi) là cất cánh. 准时 (zhǔnshí) là đúng giờ. 迟到 (chídào) là đến muộn.",
      "audioDemoText": "fēijī zhǔnshí qǐfēi, qǐng chūshì dēngjīpái hé hùzhào, zhè jiàn xíngli yào tuōyùn"
    },
    "step2_vocabulary": [
      {"id": "v-302-1", "hanzi": "机场", "pinyin": "jīchǎng", "hanviet": "Cơ trường", "meaning": "Sân bay", "radical": "木 (Mộc)", "example": {"hanzi": "去首都机场。", "pinyin": "Qù Shǒudū Jīchǎng.", "meaning": "Đi sân bay Thủ Đô."}},
      {"id": "v-302-2", "hanzi": "行李", "pinyin": "xíngli", "hanviet": "Hành lý", "meaning": "Hành lý, vali", "radical": "行 (Hành)", "example": {"hanzi": "托运行李。", "pinyin": "Tuōyùn xíngli.", "meaning": "Ký gửi hành lý."}},
      {"id": "v-302-3", "hanzi": "准时", "pinyin": "zhǔnshí", "hanviet": "Chuẩn thời", "meaning": "Đúng giờ", "radical": "冫 (Băng)", "example": {"hanzi": "飞机准时起飞。", "pinyin": "Fēijī zhǔnshí qǐfēi.", "meaning": "Máy bay cất cánh đúng giờ."}},
      {"id": "v-302-4", "hanzi": "起飞", "pinyin": "qǐfēi", "hanviet": "Khởi phi", "meaning": "Cất cánh", "radical": "走 (Tẩu)", "example": {"hanzi": "飞机要起飞了。", "pinyin": "Fēijī yào qǐfēi le.", "meaning": "Máy bay sắp cất cánh rồi."}},
      {"id": "v-302-5", "hanzi": "迟到", "pinyin": "chídào", "hanviet": "Trì đáo", "meaning": "Đến muộn, trễ giờ", "radical": "辶 (Sước)", "example": {"hanzi": "不要迟到！", "pinyin": "Bú yào chídào!", "meaning": "Đừng đến muộn nhé!"}},
      {"id": "v-302-6", "hanzi": "登机牌", "pinyin": "dēngjīpái", "hanviet": "Đăng cơ bài", "meaning": "Thẻ lên máy bay", "radical": "癶 (Bát)", "example": {"hanzi": "这是您的登机牌。", "pinyin": "Zhè shì nín de dēngjīpái.", "meaning": "Đây là thẻ lên tàu bay của quý khách."}}
    ],
    "step3_hanzi": [
      {"hanzi": "准", "pinyin": "zhǔn", "meaning": "Chuẩn xác, cho phép", "strokesCount": 10, "strokeOrderText": "Bộ Băng (冫) bên trái -> Chữ Chuy (隹) bên phải", "components": "冫 + 隹", "mnemonic": "Hình thước đo chim đậu chuẩn mực trên băng tuyết."},
      {"hanzi": "飞", "pinyin": "fēi", "meaning": "Bay lượn (trong Máy bay 飞机)", "strokesCount": 3, "strokeOrderText": "Ngang gập nghiêng móc -> Phẩy -> Chấm", "components": "Bộ Phi (飞)", "mnemonic": "Hình cánh chim dang rộng chao liệng trên không trung."}
    ],
    "step4_grammar": {
      "title": "Cấu trúc sắp diễn ra: 快要 / 就要...了 (Sắp...rồi)",
      "formula": "Chủ ngữ + 快要 / 就要 + Động từ + 了",
      "explanation": "Biểu thị một hành động sắp sửa xảy ra trong tương lai rất gần. Rất hay dùng trong thông báo sân bay.",
      "examples": [{"hanzi": "飞机快要起飞了，请大家系好安全带。", "pinyin": "Fēijī kuàiyào qǐfēi le, qǐng dàjiā jì hǎo ānquándài.", "meaning": "Máy bay sắp cất cánh rồi, xin mọi người thắt chặt dây an toàn."}],
      "commonMistake": {"wrong": "飞机快起飞 ❌", "correct": "飞机快要起飞了 ✔️", "explanation": "快要 luôn đi cùng 了 ở cuối câu."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Phát thanh", "hanzi": "前往北京的VN512次航班现在开始登机，飞机将于半小时后准时起飞，请各位旅客前往15号登机口。", "pinyin": "Qiánwǎng Běijīng de VN512 cì hángbān xiànzài kāishǐ dēngjī, fēijī jiāng yú bàn xiǎoshí hòu zhǔnshí qǐfēi, qǐng gèwèi lǚkè qiánwǎng shíwǔ hào dēngjīkǒu.", "meaning": "Chuyến bay VN512 đi Bắc Kinh hiện bắt đầu lên máy bay, máy bay sẽ cất cánh đúng giờ sau nửa tiếng, xin mời quý khách đến cửa số 15."}
      ],
      "audioText": "飞机将于半小时后准时起飞，请各位旅客前往15号登机口。",
      "question": "Hành khách cần đến cửa lên máy bay số mấy?",
      "options": ["Cửa số 5", "Cửa số 15 (shíwǔ hào dēngjīkǒu)", "Cửa số 20", "Cửa số 1"],
      "correctIndex": 1, "explanation": "Thông báo: 前往15号登机口."
    },
    "step6_speaking": {"prompt": "Nói chuyến bay cất cánh đúng giờ:", "targetSentence": "飞机准时起飞。", "targetPinyin": "Fēijī zhǔnshí qǐfēi.", "targetMeaning": "Máy bay cất cánh đúng giờ.", "hint": "Đọc zhǔnshí qǐfēi dứt khoát."},
    "step7_writing": {"prompt": "Sắp xếp câu: Máy bay sắp cất cánh rồi", "words": ["快要起飞了", "飞机"], "correctOrder": ["飞机", "快要起飞了"], "explanation": "飞机 + 快要起飞了."},
    "step8_quiz": [
      {"id": "q-302-1", "type": "multiple-choice", "question": "Từ nào sau đây mang nghĩa là 'Thẻ lên máy bay'?", "options": ["护照 (hùzhào)", "登机牌 (dēngjīpái)", "门票 (ménpiào)", "车票 (chēpiào)"], "correctIndex": 1, "explanation": "登机牌 là Boarding pass."},
      {"id": "q-302-2", "type": "multiple-choice", "question": "Cụm '准时' (zhǔnshí) mang nghĩa là:", "options": ["Đúng giờ", "Chậm trễ", "Hủy bỏ", "Đặt trước"], "correctIndex": 0, "explanation": "Chuẩn thời nghĩa là đúng giờ."}
    ],
    "step9_challenge": {"title": "Làm chủ cổng sân bay", "taskDesc": "Đọc to câu: 'Chuyến bay của tôi cất cánh đúng giờ, tôi không bị trễ'.", "targetPhrase": "wǒ de fēijī zhǔnshí qǐfēi wǒ méi chídào", "xpReward": 50, "badge": "Phi Công Vũ Trụ"}
  },

  # --- LESSON 303 ---
  {
    "id": "l-303", "chapterId": "ch-9", "levelId": "lvl-3", "lessonNumber": 3,
    "title": "Bổ ngữ Xu hướng Đơn với 来 và 去 (进来, 出去, 上来, 下去)",
    "chineseTitle": "简单趋向补语“来/去”（进来、出去、上来、下去）",
    "subtitle": "Quy tắc phương hướng kinh điển: Hướng về phía người nói dùng 来, rời xa người nói dùng 去.",
    "objective": "Sử dụng chính xác bổ ngữ xu hướng đơn 来 và 去 kết hợp 7 động từ chuyển động cơ bản.",
    "prerequisite": "Đã hoàn thành Bài 302.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cặp 来/去 theo điểm đứng của người nói.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 3", "Bổ ngữ xu hướng đơn", "来", "去", "Ngữ pháp cốt lõi"],
    "relatedMaterialIds": ["mat-3", "mat-4"],
    "step1_learn": {
      "topic": "7 Động từ chuyển động + 来 (Lại - về phía mình) / 去 (Khứ - ra xa mình)",
      "summary": "7 Động từ: 进 (vào), 出 (ra), 上 (lên), 下 (xuống), 回 (về), 过 (qua), 起 (dậy). Người nói ở trong phòng: Gọi người khác vào -> 进来; Người nói ở ngoài phòng: Bảo người khác vào trong -> 进去.",
      "audioDemoText": "qǐng jìnlái, tā zǒu chūqu le, nǐ shénme shíhou huílái"
    },
    "step2_vocabulary": [
      {"id": "v-303-1", "hanzi": "进来", "pinyin": "jìnlái", "hanviet": "Tiến lai", "meaning": "Vào đây (hướng về phía người nói)", "radical": "辶 (Sước)", "example": {"hanzi": "请进来坐！", "pinyin": "Qǐng jìnlái zuò!", "meaning": "Mời vào đây ngồi!"}},
      {"id": "v-303-2", "hanzi": "出去", "pinyin": "chūqù", "hanviet": "Xuất khứ", "meaning": "Ra ngoài (xa người nói)", "radical": "出 (Xuất)", "example": {"hanzi": "他出去了。", "pinyin": "Tā chūqù le.", "meaning": "Anh ấy ra ngoài rồi."}},
      {"id": "v-303-3", "hanzi": "上来", "pinyin": "shànglái", "hanviet": "Thượng lai", "meaning": "Lên đây", "radical": "一 (Nhất)", "example": {"hanzi": "快上来！", "pinyin": "Kuài shànglái!", "meaning": "Mau lên đây!"}},
      {"id": "v-303-4", "hanzi": "下去", "pinyin": "xiàqù", "hanviet": "Hạ khứ", "meaning": "Xuống dưới kia", "radical": "一 (Nhất)", "example": {"hanzi": "走下去。", "pinyin": "Zǒu xiàqù.", "meaning": "Đi bộ xuống dưới kia."}},
      {"id": "v-303-5", "hanzi": "回来", "pinyin": "huílái", "hanviet": "Hồi lai", "meaning": "Trở về đây", "radical": "囗 (Vi)", "example": {"hanzi": "爸爸回来了。", "pinyin": "Bàba huílái le.", "meaning": "Bố đã về rồi."}},
      {"id": "v-303-6", "hanzi": "过去", "pinyin": "guòqù", "hanviet": "Quá khứ", "meaning": "Đi qua đằng kia, quá khứ", "radical": "辶 (Sước)", "example": {"hanzi": "走过去看看。", "pinyin": "Zǒu guòqù kànkan.", "meaning": "Đi qua bên kia xem thử."}}
    ],
    "step3_hanzi": [
      {"hanzi": "进", "pinyin": "jìn", "meaning": "Tiến vào", "strokesCount": 7, "strokeOrderText": "Chữ Tỉnh (井) bên trong -> Bộ Sước (辶) bao ngoài", "components": "井 + 辶", "mnemonic": "Bước chân (Sước) tiến thẳng vào trong giếng sâu (Tỉnh)."},
      {"hanzi": "出", "pinyin": "chū", "meaning": "Đi ra ngoài, xuất hiện", "strokesCount": 5, "strokeOrderText": "Sổ giữa -> Ngang gập -> Sổ -> Ngang gập -> Sổ giữa nối", "components": "Bộ Khảm (凵)", "mnemonic": "Hai ngọn núi chồng lên nhau nhô ra ngoài mặt đất."}
    ],
    "step4_grammar": {
      "title": "Vị trí của Tân ngữ nơi chốn trong Bổ ngữ Xu hướng",
      "formula": "Động từ + NƠI CHỐN + 来 / 去 (Ví dụ: 回家来, 进教室去)",
      "explanation": "Quy tắc bắt buộc: Nếu tân ngữ là ĐỊA ĐIỂM NƠI CHỐN, nó BẮT BUỘC phải chen vào giữa động từ và 来/去. Tuyệt đối không được nói: 回来家 ❌.",
      "examples": [{"hanzi": "他已经进教室去了。（ĐÚNG）  /  他已经进去教室了。（SAI ❌）", "pinyin": "Tā yǐjīng jìn jiàoshì qù le.", "meaning": "Anh ấy đã bước vào trong lớp học rồi."}],
      "commonMistake": {"wrong": "回学校去 ➔ nói thành 回去学校 ❌", "correct": "回学校去 ✔️", "explanation": "Địa điểm nơi chốn phải nằm kẹp ở giữa."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A (Ở trên lầu)", "hanzi": "小明，你在楼下做什么呢？快点儿上来吧！", "pinyin": "Xiǎomíng, nǐ zài lóuxià zuò shénme ne? Kuài diǎnr shànglái ba!", "meaning": "Tiểu Minh ơi, em làm gì dưới lầu thế? Mau lên đây đi!"},
        {"speaker": "B (Ở dưới lầu)", "hanzi": "哥哥，我马上拿行李上去！", "pinyin": "Gēge, wǒ mǎshàng ná xíngli shàngqù!", "meaning": "Anh ơi, em mang hành lý lên trên đó ngay đây!"}
      ],
      "audioText": "快点儿上来吧！我马上拿行李上去！",
      "question": "Vì sao người A nói '上来' còn người B nói '上去'?",
      "options": ["Nói bừa không có quy tắc", "Người A ở trên lầu (hướng về mình dùng 来), người B ở dưới lầu (hướng xa mình dùng 去)", "Cả hai đều ở dưới lầu", "Cả hai đều ở trên lầu"],
      "correctIndex": 1, "explanation": "Nguyên lý tâm điểm người nói: Về phía mình là 来, xa mình là 去."
    },
    "step6_speaking": {"prompt": "Mời ai đó bước vào phòng:", "targetSentence": "请进，快请进来！", "targetPinyin": "Qǐng jìn, kuài qǐng jìnlái!", "targetMeaning": "Mời vào, mau vào đây đi!", "hint": "Đọc jìnlái thanh 4 và thanh nhẹ."},
    "step7_writing": {"prompt": "Sắp xếp câu: Anh ấy đã về nhà rồi", "words": ["回家去了", "他已经"], "correctOrder": ["他已经", "回家去了"], "explanation": "他已经 + 回家去了."},
    "step8_quiz": [
      {"id": "q-303-1", "type": "multiple-choice", "question": "Chọn câu đúng ngữ pháp có tân ngữ nơi chốn:", "options": ["他进去了教室", "他进教室去了", "教室进他去", "他去进教室"], "correctIndex": 1, "explanation": "Nơi chốn bắt buộc nằm kẹp ở giữa: 进教室去."},
      {"id": "q-303-2", "type": "multiple-choice", "question": "Nếu bạn đang ở trong nhà và gọi bạn bè ngoài sân vào, bạn sẽ nói:", "options": ["你出去吧", "你进来吧", "你上去吧", "你下去吧"], "correctIndex": 1, "explanation": "Vào về phía mình đang đứng trong nhà dùng 进来."}
    ],
    "step9_challenge": {"title": "Điều hướng không gian", "taskDesc": "Đọc to câu: 'Xin mời bước vào đây ngồi, bố tôi đã về nhà rồi'.", "targetPhrase": "qǐng jìnlái zuò wǒ bàba huí jiā lái le", "xpReward": 50, "badge": "La Bàn Đa Chiều"}
  },

  # --- LESSON 304 ---
  {
    "id": "l-304", "chapterId": "ch-9", "levelId": "lvl-3", "lessonNumber": 4,
    "title": "Bổ ngữ Xu hướng Kép (跑出来, 走过去, 拿出来)",
    "chineseTitle": "复合趋向补语（动词 + 上/下/进/出/回/过/起 + 来/去）",
    "subtitle": "Diễn đạt chuyển động phức tạp tinh tế: V + Bổ ngữ xu hướng kép (跑出来 - chạy vụt ra, 拿出来 - lấy đồ ra).",
    "objective": "Nắm vững cấu trúc Bổ ngữ xu hướng kép và miêu tả sinh động mọi chuyển động trong đời sống.",
    "prerequisite": "Đã hoàn thành Bài 303.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng bổ ngữ xu hướng kép.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 3", "Bổ ngữ xu hướng kép", "跑出来", "拿出来", "Ngữ pháp nâng cao"],
    "relatedMaterialIds": ["mat-3", "mat-4"],
    "step1_learn": {
      "topic": "Công thức Bổ ngữ Xu hướng Kép: Động từ + (上/下/进/出/回/过/起) + (来/去)",
      "summary": "Kết hợp động từ hành động cụ thể với hướng di chuyển: 跑出来 (Chạy lao ra ngoài), 走过去 (Đi bước sang bên kia), 拿出来 (Lấy lôi từ trong túi ra ngoài).",
      "audioDemoText": "tā cóng fángjiān pǎo chūlái le, qǐng bǎ hùzhào ná chūlái"
    },
    "step2_vocabulary": [
      {"id": "v-304-1", "hanzi": "跑", "pinyin": "pǎo", "hanviet": "Bào", "meaning": "Chạy", "radical": "足 (Túc)", "example": {"hanzi": "跑得很快。", "pinyin": "Pǎo de hěn kuài.", "meaning": "Chạy rất nhanh."}},
      {"id": "v-304-2", "hanzi": "跑出来", "pinyin": "pǎo chūlái", "hanviet": "Bào xuất lai", "meaning": "Chạy vọt ra ngoài này", "radical": "足 (Túc)", "example": {"hanzi": "小狗跑出来了。", "pinyin": "Xiǎogǒu pǎo chūlái le.", "meaning": "Chú chó con chạy vọt ra ngoài rồi."}},
      {"id": "v-304-3", "hanzi": "拿出来", "pinyin": "ná chūlái", "hanviet": "Nã xuất lai", "meaning": "Lấy ra, rút ra", "radical": "手 (Thủ)", "example": {"hanzi": "把护照拿出来。", "pinyin": "Bǎ hùzhào ná chūlái.", "meaning": "Lấy cuốn hộ chiếu ra."}},
      {"id": "v-304-4", "hanzi": "站起来", "pinyin": "zhàn qǐlái", "hanviet": "Trạm khởi lai", "meaning": "Đứng dậy", "radical": "立 (Lập)", "example": {"hanzi": "请大家站起来。", "pinyin": "Qǐng dàjiā zhàn qǐlái.", "meaning": "Mời mọi người đứng dậy."}},
      {"id": "v-304-5", "hanzi": "带回去", "pinyin": "dài huíqù", "hanviet": "Đái hồi khứ", "meaning": "Mang về lại bên đó", "radical": "巾 (Cân)", "example": {"hanzi": "把礼物带回去。", "pinyin": "Bǎ lǐwù dài huíqù.", "meaning": "Mang món quà về lại."}}
    ],
    "step3_hanzi": [
      {"hanzi": "跑", "pinyin": "pǎo", "meaning": "Chạy nhảy", "strokesCount": 12, "strokeOrderText": "Bộ Túc (足) bên trái -> Chữ Bao (包) bên phải", "components": "足 + 包", "mnemonic": "Đôi chân (Túc) thoăn thoắt ôm bao đồ (Bao) chạy thật nhanh."},
      {"hanzi": "带", "pinyin": "dài", "meaning": "Mang theo, dải băng", "strokesCount": 9, "strokeOrderText": "Ba nét trên -> Khung Mịch (冖) -> Bộ Cân (巾) ở dưới", "components": "廿 + 冖 + 巾", "mnemonic": "Thắt dải đai lưng (Cân) để mang theo đồ đạc bên mình."}
    ],
    "step4_grammar": {
      "title": "Vị trí của Tân ngữ chỉ sự vật trong Bổ ngữ Xu hướng Kép",
      "formula": "Động từ + (Xu hướng 1) + TÂN NGỮ ĐỒ VẬT + 来/去  HOẶC  Động từ + Xu hướng kép + Tân ngữ",
      "explanation": "Ví dụ: 拿出护照来 HOẶC 拿出来护照 (Cả hai cách đều đúng khi tân ngữ là đồ vật thông thường).",
      "examples": [{"hanzi": "安检的时候，请把电脑从包里拿出来。", "pinyin": "Ānjiǎn de shíhou, qǐng bǎ diànnǎo cóng bāo lǐ ná chūlái.", "meaning": "Khi kiểm tra an ninh, xin hãy lấy máy tính từ trong túi xách ra."}],
      "commonMistake": {"wrong": "站起去 ❌", "correct": "站起来 ✔️", "explanation": "Chuyển động từ thấp lên cao luôn đi với 起来 (Khởi lai)."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Nhân viên an ninh", "hanzi": "先生您好，请把您包里的笔记本电脑和水瓶拿出来放在盒子里。", "pinyin": "Xiānsheng nín hǎo, qǐng bǎ nín bāo lǐ de bǐjìběn diànnǎo hé shuǐpíng ná chūlái fàng zài hézi lǐ.", "meaning": "Chào anh, xin hãy lấy máy tính xách tay và chai nước trong túi ra đặt vào trong khay nhé."}
      ],
      "audioText": "请把您包里的笔记本电脑和水瓶拿出来放在盒子里。",
      "question": "Nhân viên an ninh yêu cầu hành khách làm gì?",
      "options": ["Đóng túi lại", "Lấy máy tính và chai nước ra (ná chūlái)", "Uống hết nước", "Bỏ máy tính đi"],
      "correctIndex": 1, "explanation": "Yêu cầu: 拿出来放在盒子里."
    },
    "step6_speaking": {"prompt": "Đọc câu hướng dẫn đứng dậy:", "targetSentence": "请大家站起来。", "targetPinyin": "Qǐng dàjiā zhàn qǐlái.", "targetMeaning": "Mời mọi người đứng dậy.", "hint": "Đọc zhàn qǐlái dứt khoát."},
    "step7_writing": {"prompt": "Sắp xếp câu: Lấy hộ chiếu ra", "words": ["拿出来", "把护照"], "correctOrder": ["把护照", "拿出来"], "explanation": "把护照 + 拿出来."},
    "step8_quiz": [
      {"id": "q-304-1", "type": "multiple-choice", "question": "Hành động 'Đứng dậy' trong tiếng Trung nói là:", "options": ["站下去", "站出来", "站起来 (zhàn qǐlái)", "站过去"], "correctIndex": 2, "explanation": "Hướng từ dưới lên dùng 起来: 站起来."},
      {"id": "q-304-2", "type": "multiple-choice", "question": "Từ '拿出来' (ná chūlái) có nghĩa là gì?", "options": ["Cất vào trong", "Lấy ra / Lôi ra ngoài này", "Vứt đi", "Mua về"], "correctIndex": 1, "explanation": "拿出来 là lấy ra ngoài."}
    ],
    "step9_challenge": {"title": "Khẩu lệnh chuẩn xác", "taskDesc": "Đọc to câu: 'Khi qua an ninh, xin hãy lấy hộ chiếu và máy tính ra'.", "targetPhrase": "qǐng bǎ hùzhào hé diànnǎo ná chūlái", "xpReward": 50, "badge": "Bậc Thầy Chuyển Động"}
  },

  # --- LESSON 305 ---
  {
    "id": "l-305", "chapterId": "ch-9", "levelId": "lvl-3", "lessonNumber": 5,
    "title": "Ôn tập Module 3.1 & Xử lý tình huống du lịch tự túc",
    "chineseTitle": "模块3.1总复习与自由行独立沟通挑战",
    "subtitle": "Tổng kết đàm thoại du lịch độc lập: Check-in, sân bay, chỉ hướng bổ ngữ xu hướng và đấu Boss Chapter 9.",
    "objective": "Tự tin xử lý 100% tình huống du lịch tự túc tại Trung Quốc không cần người phiên dịch đi kèm.",
    "prerequisite": "Đã hoàn thành Bài 301–304.",
    "completionCriteria": "Đạt >= 80% điểm bài tập tổng kết Module 3.1.",
    "durationMinutes": 25, "xpReward": 60, "tags": ["HSK 3", "Tổng kết Module", "Du lịch tự túc", "Review Checkpoint"],
    "relatedMaterialIds": ["mat-3", "mat-7"],
    "step1_learn": {
      "topic": "Bộ cẩm nang sinh tồn du lịch tự túc 3 ngày tại Trung Quốc",
      "summary": "1. Sân bay: 办理登机, 托运行李, 准时起飞. 2. Khách sạn: 办理入住, 交押金, 拿房卡. 3. Không gian: 进教室去, 拿出来, 站起来.",
      "audioDemoText": "zìyóuxíng hěn fāngbiàn, wǒ néng dúlì jiějué wèntí"
    },
    "step2_vocabulary": [
      {"id": "v-305-1", "hanzi": "自由行", "pinyin": "zìyóuxíng", "hanviet": "Tự do hành", "meaning": "Du lịch tự túc", "radical": "自 (Tự)", "example": {"hanzi": "我喜欢自由行。", "pinyin": "Wǒ xǐhuan zìyóuxíng.", "meaning": "Tôi thích du lịch tự túc."}},
      {"id": "v-305-2", "hanzi": "独立", "pinyin": "dúlì", "hanviet": "Độc lập", "meaning": "Độc lập, tự chủ", "radical": "犭 (Khuyển)", "example": {"hanzi": "独立生活。", "pinyin": "Dúlì shēnghuó.", "meaning": "Cuộc sống độc lập."}},
      {"id": "v-305-3", "hanzi": "解决", "pinyin": "jiějué", "hanviet": "Giải quyết", "meaning": "Giải quyết", "radical": "角 (Giác)", "example": {"hanzi": "解决问题。", "pinyin": "Jiějué wèntí.", "meaning": "Giải quyết vấn đề."}}
    ],
    "step3_hanzi": [
      {"hanzi": "独", "pinyin": "dú", "meaning": "Một mình, độc lập", "strokesCount": 9, "strokeOrderText": "Bộ Khuyển (犭) bên trái -> Bộ Trùng (虫) bên phải", "components": "犭 + 虫", "mnemonic": "Con thú đơn độc kiên cường tự lập giữa thiên nhiên."},
      {"hanzi": "解", "pinyin": "jiě", "meaning": "Mở ra, giải tỏa (Giải)", "strokesCount": 13, "strokeOrderText": "Bộ Giác (角) -> Chữ Đao (刀) -> Bộ Ngưu (牛)", "components": "角 + 刀 + 牛", "mnemonic": "Cầm con dao sắc (Đao) mổ trâu (Ngưu) tách sừng (Giác) giải quyết công việc."}
    ],
    "step4_grammar": {
      "title": "Mẫu câu tự tin giải quyết vấn đề của học viên HSK 3",
      "formula": "没问题，我自己可以解决！ (Méi wèntí, wǒ zìjǐ kěyǐ jiějué!)",
      "explanation": "Khẳng định bước chuyển mình từ người học thụ động sang người sử dụng tiếng Trung độc lập trong mọi hoàn cảnh.",
      "examples": [{"hanzi": "虽然这是我第一次来中国，但是这些问题我都能独立解决。", "pinyin": "Suīrán zhè shì wǒ dì yī cì lái Zhōngguó, dànshì zhèxiē wèntí wǒ dōu néng dúlì jiějué.", "meaning": "Mặc dù đây là lần đầu tiên tôi đến Trung Quốc, nhưng những vấn đề này tôi đều có thể tự mình giải quyết."}],
      "commonMistake": {"wrong": "Nói ngập ngừng thiếu tự tin.", "correct": "Sử dụng câu ngắn dứt khoát kết hợp bổ ngữ xu hướng.", "explanation": "Khí chất của người giao tiếp độc lập."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Bạn bè", "hanzi": "你一个人去北京旅游，不用找导游吗？", "pinyin": "Nǐ yí gè rén qù Běijīng lǚyóu, bú yòng zhǎo dǎoyóu ma?", "meaning": "Bạn đi du lịch Bắc Kinh một mình, không cần tìm hướng dẫn viên à?"},
        {"speaker": "Thí sinh", "hanzi": "不用，我已经通过了HSK 2级，现在学到了HSK 3级，订酒店、坐地铁、买东西我都能自己搞定！", "pinyin": "Bú yòng, wǒ yǐjīng tōngguò le HSK èr jí, xiànzài xué dào le HSK sān jí, dìng jiǔdiàn, zuò dìtiě, mǎi dōngxi wǒ dōu néng zìjǐ gǎodìng!", "meaning": "Không cần đâu, tôi đã thi đậu HSK 2 và đang học HSK 3 rồi, đặt phòng, đi tàu điện, mua sắm tôi đều tự lo được hết!"}
      ],
      "audioText": "订酒店、坐地铁、买东西我都能自己搞定！",
      "question": "Thí sinh tự tin làm được những việc gì một mình?",
      "options": ["Không làm được gì", "Tự đặt phòng, đi lại, mua sắm độc lập (zìjǐ gǎodìng)", "Cần người phiên dịch kè kè", "Đi lạc đường"],
      "correctIndex": 1, "explanation": "Thí sinh khẳng định: 都能自己搞定."
    },
    "step6_speaking": {"prompt": "Tuyên bố khả năng tự lập của bạn:", "targetSentence": "没问题，我能自己解决！", "targetPinyin": "Méi wèntí, wǒ néng zìjǐ jiějué!", "targetMeaning": "Không vấn đề gì, tôi có thể tự giải quyết!", "hint": "Đọc tràn đầy năng lượng và tự tin."},
    "step7_writing": {"prompt": "Sắp xếp câu: Tôi thích đi du lịch tự túc", "words": ["自由行", "喜欢", "我"], "correctOrder": ["我", "喜欢", "自由行"], "explanation": "我 + 喜欢 + 自由行."},
    "step8_quiz": [
      {"id": "q-305-1", "type": "multiple-choice", "question": "Từ '自由行' (zìyóuxíng) mang nghĩa là hình thức du lịch nào?", "options": ["Du lịch theo đoàn tour", "Du lịch tự túc / Tự do khám phá", "Đi công tác", "Về quê"], "correctIndex": 1, "explanation": "自由行 là du lịch tự túc."},
      {"id": "q-305-2", "type": "multiple-choice", "question": "Dấu mốc của Level 3 (HSK 3) được gọi là:", "options": ["Khởi đầu bỡ ngỡ", "Mốc chuyển mình: Giao tiếp độc lập", "Bậc thầy dịch thuật", "Chuyên gia văn học"], "correctIndex": 1, "explanation": "HSK 3 là cột mốc chuyển mình sang giao tiếp độc lập."}
    ],
    "step9_challenge": {"title": "Mở khóa Boss Chapter 9", "taskDesc": "Vượt qua thử thách du lịch độc lập để sẵn sàng đối đầu Boss Sân bay Bắc Kinh!", "targetPhrase": "wǒ néng dúlì zài zhōngguó zìyóuxíng", "xpReward": 60, "badge": "Phượt Thủ Tự Lập"}
  }
]

print(f"Loaded {len(LEVEL_3_PART1)} lessons for Level 3 Module 3.1")
