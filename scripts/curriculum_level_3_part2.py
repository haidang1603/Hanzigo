# -*- coding: utf-8 -*-
"""
Level 3 Curriculum Lessons (306 to 315) - Modules 3.2 & 3.3
Strictly adheres to docs/HANZIGO_CHINESE_CURRICULUM.md
"""

LEVEL_3_PART2 = [
  # =========================================================================
  # MODULE 3.2: BỔ NGỮ KẾT QUẢ & NGỮ PHÁP CỐT LÕI (BÀI 306-310, ch-10)
  # =========================================================================

  # --- LESSON 306 ---
  {
    "id": "l-306", "chapterId": "ch-10", "levelId": "lvl-3", "lessonNumber": 6,
    "title": "Bổ ngữ Kết quả cơ bản (做完, 学好, 听懂, 看见, 找到)",
    "chineseTitle": "结果补语核心（做完、学好、听懂、看见）",
    "subtitle": "Ngữ pháp linh hồn: Động từ + Bổ ngữ kết quả (完, 好, 懂, 见, 到) biểu thị hành động đã đạt kết quả.",
    "objective": "Sử dụng thành thạo bổ ngữ kết quả để diễn tả đã làm xong, học giỏi, nghe hiểu, nhìn thấy.",
    "prerequisite": "Đã hoàn thành Module 3.1.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng chính xác các bổ ngữ kết quả thông dụng.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 3", "Bổ ngữ kết quả", "做完", "听懂", "学好"],
    "relatedMaterialIds": ["mat-3", "mat-4"],
    "step1_learn": {
      "topic": "Công thức Bổ ngữ Kết quả: Động từ + Kết quả (完 / 好 / 懂 / 见 / 到)",
      "summary": "1. 完 (xong): 做完, 吃完, 看完. 2. 好 (chuẩn/tốt đẹp): 准备好, 学好. 3. 懂 (hiểu): 听懂, 看懂. 4. 见 (nhận thấy qua giác quan): 看见, 听见. 5. 到 (đạt được mục tiêu): 找到, 买到.",
      "audioDemoText": "wǒ zuò wán zuòyè le, wǒ tīng dǒng le, wǒ zhǎo dào shǒujī le"
    },
    "step2_vocabulary": [
      {"id": "v-306-1", "hanzi": "完", "pinyin": "wán", "hanviet": "Hoàn", "meaning": "Xong, hết", "radical": "宀 (Miên)", "example": {"hanzi": "做完练习。", "pinyin": "Zuò wán liànxí.", "meaning": "Làm xong bài tập."}},
      {"id": "v-306-2", "hanzi": "懂", "pinyin": "dǒng", "hanviet": "Đổng", "meaning": "Hiểu", "radical": "忄 (Tâm)", "example": {"hanzi": "我听懂了。", "pinyin": "Wǒ tīng dǒng le.", "meaning": "Tôi nghe hiểu rồi."}},
      {"id": "v-306-3", "hanzi": "看见", "pinyin": "kànjiàn", "hanviet": "Khán kiến", "meaning": "Nhìn thấy", "radical": "目 (Mục)", "example": {"hanzi": "看见他了吗？", "pinyin": "Kànjiàn tā le ma?", "meaning": "Nhìn thấy anh ấy chưa?"}},
      {"id": "v-306-4", "hanzi": "找到", "pinyin": "zhǎodào", "hanviet": "Trảo đáo", "meaning": "Tìm thấy, kiếm được", "radical": "扌 (Thủ)", "example": {"hanzi": "找到了钱包。", "pinyin": "Zhǎodào le qiánbāo.", "meaning": "Đã tìm thấy ví tiền."}},
      {"id": "v-306-5", "hanzi": "清楚", "pinyin": "qīngchu", "hanviet": "Thanh sở", "meaning": "Rõ ràng", "radical": "氵 (Thủy)", "example": {"hanzi": "听得清楚。", "pinyin": "Tīng de qīngchu.", "meaning": "Nghe được rõ ràng."}}
    ],
    "step3_hanzi": [
      {"hanzi": "完", "pinyin": "wán", "meaning": "Hoàn thành, trọn vẹn", "strokesCount": 7, "strokeOrderText": "Mái nhà (宀) -> Bộ Nguyên (元)", "components": "宀 + 元", "mnemonic": "Cất nóc mái nhà nguyên vẹn tượng trưng công trình đã hoàn thành."},
      {"hanzi": "懂", "pinyin": "dǒng", "meaning": "Hiểu biết (Đổng)", "strokesCount": 15, "strokeOrderText": "Bộ Tâm đứng (忄) bên trái -> Chữ Trọng (重) bên phải", "components": "忄 + 重", "mnemonic": "Con tim thấu hiểu những trọng tâm sâu sắc."}
    ],
    "step4_grammar": {
      "title": "Phủ định của Bổ ngữ Kết quả: 没 + Động từ + Kết quả (KHÔNG DÙNG 不)",
      "formula": "Khẳng định: V + Kết quả + 了. Phủ định: 没(有) + V + Kết quả (BỎ 了).",
      "explanation": "Bổ ngữ kết quả biểu thị việc đã xảy ra, nên phủ định BẮT BUỘC dùng 没. Tuyệt đối không dùng 不.",
      "examples": [{"hanzi": "我还没做完作业。（ĐÚNG）  /  我不做完作业。（SAI ❌）", "pinyin": "Wǒ hái méi zuò wán zuòyè.", "meaning": "Tôi vẫn chưa làm xong bài tập về nhà."}],
      "commonMistake": {"wrong": "我不听懂 ❌", "correct": "我没听懂 ✔️", "explanation": "Phủ định bổ ngữ kết quả luôn luôn dùng 没."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "今天的作业你写完了吗？", "pinyin": "Jīntiān de zuòyè nǐ xiě wán le ma?", "meaning": "Bài tập hôm nay bạn viết xong chưa?"},
        {"speaker": "B", "hanzi": "我都写完了，而且老师讲的新课我也全听懂了。", "pinyin": "Wǒ dōu xiě wán le, érqiě lǎoshī jiǎng de xīn kè wǒ yě quán tīng dǒng le.", "meaning": "Tôi viết xong hết rồi, vả lại bài mới thầy giảng tôi cũng nghe hiểu hết cả rồi."}
      ],
      "audioText": "我都写完了，而且老师讲的新课我也全听懂了。",
      "question": "Người B đã hoàn thành những gì?",
      "options": ["Chưa viết bài", "Viết xong bài và nghe hiểu toàn bộ bài giảng (xiě wán le, tīng dǒng le)", "Không hiểu bài", "Mới làm được một nửa"],
      "correctIndex": 1, "explanation": "B nói: 写完了，全听懂了."
    },
    "step6_speaking": {"prompt": "Khẳng định bạn đã nghe hiểu:", "targetSentence": "我全都听懂了。", "targetPinyin": "Wǒ quándōu tīng dǒng le.", "targetMeaning": "Tôi nghe hiểu toàn bộ rồi.", "hint": "Đọc tīng dǒng thanh 1 và 3 rõ ràng."},
    "step7_writing": {"prompt": "Sắp xếp câu: Tôi vẫn chưa làm xong bài tập", "words": ["作业", "还没做完", "我"], "correctOrder": ["我", "还没做完", "作业"], "explanation": "我 + 还没做完 + 作业."},
    "step8_quiz": [
      {"id": "q-306-1", "type": "multiple-choice", "question": "Chọn câu phủ định đúng với bổ ngữ kết quả:", "options": ["我不买到票", "我没买到票", "我买不到票了", "我买没票"], "correctIndex": 1, "explanation": "Phủ định bổ ngữ kết quả dùng 没: 我没买到票."},
      {"id": "q-306-2", "type": "multiple-choice", "question": "Từ '完' trong '吃完了' đóng vai trò ngữ pháp là gì?", "options": ["Bổ ngữ xu hướng", "Bổ ngữ kết quả", "Bổ ngữ thời lượng", "Trạng từ"], "correctIndex": 1, "explanation": "完 là bổ ngữ kết quả chỉ sự hoàn tất."}
    ],
    "step9_challenge": {"title": "Báo cáo tiến độ chuẩn", "taskDesc": "Đọc to câu: 'Tôi đã chuẩn bị xong tất cả và tìm thấy hộ chiếu rồi'.", "targetPhrase": "wǒ zhǔnbèi hǎo le zhǎodào hùzhào le", "xpReward": 50, "badge": "Hoàn Tất Xuất Sắc"}
  },

  # --- LESSON 307 ---
  {
    "id": "l-307", "chapterId": "ch-10", "levelId": "lvl-3", "lessonNumber": 7,
    "title": "Bổ ngữ Khả năng (看得懂, 听不清楚, 买不起)",
    "chineseTitle": "可能补语（动词 + 得/不 + 结果/趋向）",
    "subtitle": "Diễn đạt có thể hay không thể đạt được kết quả: V + 得/不 + Kết quả (看得懂 - xem hiểu được, 听不清 - nghe không rõ).",
    "objective": "Làm chủ bổ ngữ khả năng để phản xạ nhanh: có hiểu được không, có làm kịp không, có mua nổi không.",
    "prerequisite": "Đã hoàn thành Bài 306.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cấu trúc V+得/不+Bổ ngữ.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 3", "Bổ ngữ khả năng", "看得懂", "听不清楚", "Ngữ pháp HSK 3"],
    "relatedMaterialIds": ["mat-3", "mat-4"],
    "step1_learn": {
      "topic": "Công thức Bổ ngữ Khả năng: Khẳng định (V + 得 + Kết quả) vs Phủ định (V + 不 + Kết quả)",
      "summary": "Khẳng định: 看得懂 (Đọc hiểu được), 做得完 (Làm kịp/làm hết được). Phủ định: 看不懂 (Không đọc hiểu được), 做不完 (Không làm xuể/không kịp), 听不清楚 (Nghe không rõ ràng).",
      "audioDemoText": "nǐ kàn de dǒng ma, wǒ kàn bu dǒng, tài guì le wǒ mǎi bu qǐ"
    },
    "step2_vocabulary": [
      {"id": "v-307-1", "hanzi": "看得懂", "pinyin": "kàn de dǒng", "hanviet": "Khán đắc đổng", "meaning": "Xem/đọc hiểu được", "radical": "目 (Mục)", "example": {"hanzi": "你看得懂中文报纸吗？", "pinyin": "Nǐ kàn de dǒng Zhōngwén bàozhǐ ma?", "meaning": "Bạn đọc hiểu được báo tiếng Trung không?"}},
      {"id": "v-307-2", "hanzi": "听不懂", "pinyin": "tīng bu dǒng", "hanviet": "Thính bất đổng", "meaning": "Nghe không hiểu", "radical": "口 (Khẩu)", "example": {"hanzi": "说太快我听不懂。", "pinyin": "Shuō tài kuài wǒ tīng bu dǒng.", "meaning": "Nói nhanh quá tôi nghe không hiểu."}},
      {"id": "v-307-3", "hanzi": "买得起", "pinyin": "mǎi de qǐ", "hanviet": "Mãi đắc khởi", "meaning": "Mua nổi, đủ tiền mua", "radical": "乙 (Ất)", "example": {"hanzi": "太贵了买不起。", "pinyin": "Tài guì le mǎi bu qǐ.", "meaning": "Đắt quá mua không nổi."}},
      {"id": "v-307-4", "hanzi": "做不完", "pinyin": "zuò bu wán", "hanviet": "Tác bất hoàn", "meaning": "Làm không hết, không xong xuể", "radical": "亻 (Nhân)", "example": {"hanzi": "作业太多做不完。", "pinyin": "Zuòyè tài duō zuò bu wán.", "meaning": "Bài tập nhiều quá làm không hết."}}
    ],
    "step3_hanzi": [
      {"hanzi": "得", "pinyin": "de", "meaning": "Được (trong Bổ ngữ khả năng)", "strokesCount": 11, "strokeOrderText": "Bộ Xích (彳) bên trái -> Chữ Đắc (㝵) bên phải", "components": "彳 + 㝵", "mnemonic": "Bước chân đi (Xích) tìm được ánh mặt trời ban mai (Đán) và tấc đất (Thốn)."}
    ],
    "step4_grammar": {
      "title": "Phân biệt Bổ ngữ Khả năng (看得懂) vs 能 + Động từ (能看懂)",
      "formula": "Bổ ngữ khả năng (V + 得/不 + Kết quả) là khẩu ngữ tự nhiên số 1 của người bản xứ",
      "explanation": "Người Việt hay nói '能看懂' theo thói quen dịch từng chữ, nhưng người Trung Quốc 90% sẽ nói '看得懂' hoặc '看不懂'.",
      "examples": [{"hanzi": "你说得太快了，我听不清楚，请慢一点儿。", "pinyin": "Nǐ shuō de tài kuài le, wǒ tīng bu qīngchu, qǐng màn yìdiǎnr.", "meaning": "Bạn nói nhanh quá, tôi nghe không rõ, xin nói chậm lại một chút."}],
      "commonMistake": {"wrong": "不能看懂 (nghe cứng nhắc dịch máy)", "correct": "看不懂 ✔️", "explanation": "Bổ ngữ khả năng tự nhiên, bản xứ hơn nhiều."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "这本全中文的小说，你看得懂吗？", "pinyin": "Zhè běn quán Zhōngwén de xiǎoshuō, nǐ kàn de dǒng ma?", "meaning": "Cuốn tiểu thuyết toàn tiếng Trung này, bạn đọc có hiểu nổi không?"},
        {"speaker": "B", "hanzi": "借助生词表的话，大部分我都能看得懂！", "pinyin": "Jièzhù shēngcíbiǎo dehuà, dà bùfen wǒ dōu néng kàn de dǒng!", "meaning": "Nếu dựa vào bảng từ mới thì đại bộ phận tôi đều đọc hiểu được!"}
      ],
      "audioText": "这本全中文的小说，你看得懂吗？大部分我都能看得懂！",
      "question": "Người B có đọc hiểu được cuốn tiểu thuyết không?",
      "options": ["Không hiểu một chữ nào", "Đại bộ phận đều đọc hiểu được (dà bùfen kàn de dǒng)", "Chỉ đọc được mục lục", "Không thích đọc"],
      "correctIndex": 1, "explanation": "B nói: 大部分我都能看得懂."
    },
    "step6_speaking": {"prompt": "Nói bạn nghe không rõ, xin nói chậm lại:", "targetSentence": "我听不清楚，请慢一点儿。", "targetPinyin": "Wǒ tīng bu qīngchu, qǐng màn yìdiǎnr.", "targetMeaning": "Tôi nghe không rõ, xin chậm một chút.", "hint": "Đọc tīng bu qīngchu mượt mà."},
    "step7_writing": {"prompt": "Sắp xếp câu: Bạn có đọc hiểu không?", "words": ["看得懂吗", "你"], "correctOrder": ["你", "看得懂吗"], "explanation": "你 + 看得懂吗."},
    "step8_quiz": [
      {"id": "q-307-1", "type": "multiple-choice", "question": "Dạng phủ định của '看得懂' (Đọc hiểu được) là:", "options": ["不看懂", "看不懂 (kàn bu dǒng)", "没看得懂", "看得不懂"], "correctIndex": 1, "explanation": "Phủ định bổ ngữ khả năng thay 得 bằng 不: 看不懂."},
      {"id": "q-307-2", "type": "multiple-choice", "question": "Cụm '买不起' (mǎi bu qǐ) mang nghĩa:", "options": ["Không muốn mua", "Không mua nổi (vì quá đắt/không đủ tiền)", "Đã mua rồi", "Mua rẻ"], "correctIndex": 1, "explanation": "买不起 là không đủ năng lực tài chính để mua."}
    ],
    "step9_challenge": {"title": "Làm chủ khả năng", "taskDesc": "Đọc to câu: 'Bài tập này tuy khó nhưng tôi làm hết được'.", "targetPhrase": "zhè ge zuòyè wǒ zuò de wán", "xpReward": 50, "badge": "Khả Năng Vô Hạn"}
  },

  # --- LESSON 308 ---
  {
    "id": "l-308", "chapterId": "ch-10", "levelId": "lvl-3", "lessonNumber": 8,
    "title": "Linh hồn ngữ pháp: Câu chữ 把 căn bản (S + 把 + O + V + khác)",
    "chineseTitle": "“把”字句核心法则（S + 把 + O + 动词 + 其他成分）",
    "subtitle": "Ngữ pháp tối quan trọng của tiếng Trung: Đưa tân ngữ lên trước để diễn tả sự tác động, xử lý của chủ ngữ.",
    "objective": "Làm chủ 100% bản chất câu chữ 把 căn bản và chuyển đổi câu SVO thông thường sang câu chữ 把.",
    "prerequisite": "Đã hoàn thành Bài 307.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đổi đúng 3 câu SVO sang câu chữ 把.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 3", "Câu chữ 把", "Linh hồn ngữ pháp", "Ngữ pháp trọng điểm"],
    "relatedMaterialIds": ["mat-3", "mat-4"],
    "step1_learn": {
      "topic": "Công thức kinh điển Câu chữ 把: Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác",
      "summary": "Câu chữ 把 dùng khi chủ ngữ TÁC ĐỘNG vào tân ngữ làm tân ngữ THAY ĐỔI VỊ TRÍ HOẶC TRẠNG THÁI. Động từ không bao giờ đứng trơ trọi một mình, phải có thành phần khác đi kèm (了, Bổ ngữ, Trùng điệp).",
      "audioDemoText": "wǒ bǎ zuòyè zuò wán le, qǐng bǎ mén guān shàng, tā bǎ píngguǒ chī le"
    },
    "step2_vocabulary": [
      {"id": "v-308-1", "hanzi": "把", "pinyin": "bǎ", "hanviet": "Bả", "meaning": "Đem, lấy (giới từ câu chữ 把)", "radical": "扌 (Thủ)", "example": {"hanzi": "把书给我。", "pinyin": "Bǎ shū gěi wǒ.", "meaning": "Đưa sách cho tôi."}},
      {"id": "v-308-2", "hanzi": "放", "pinyin": "fàng", "hanviet": "Phóng", "meaning": "Đặt, để", "radical": "攵 (Phác)", "example": {"hanzi": "把包放在桌子上。", "pinyin": "Bǎ bāo fàng zài zhuōzi shàng.", "meaning": "Đặt túi xách lên trên bàn."}},
      {"id": "v-308-3", "hanzi": "关上", "pinyin": "guānshàng", "hanviet": "Quan thượng", "meaning": "Đóng lại", "radical": "丷 (Bát)", "example": {"hanzi": "把门关上。", "pinyin": "Bǎ mén guānshàng.", "meaning": "Đóng cửa lại."}},
      {"id": "v-308-4", "hanzi": "洗", "pinyin": "xǐ", "hanviet": "Tẩy", "meaning": "Rửa, giặt", "radical": "氵 (Thủy)", "example": {"hanzi": "把衣服洗干净。", "pinyin": "Bǎ yīfu xǐ gānjìng.", "meaning": "Giặt quần áo sạch sẽ."}},
      {"id": "v-308-5", "hanzi": "干净", "pinyin": "gānjìng", "hanviet": "Can tịnh", "meaning": "Sạch sẽ", "radical": "干 (Can)", "example": {"hanzi": "房间很干净。", "pinyin": "Fángjiān hěn gānjìng.", "meaning": "Căn phòng rất sạch sẽ."}}
    ],
    "step3_hanzi": [
      {"hanzi": "把", "pinyin": "bǎ", "meaning": "Cầm nắm, giới từ 把", "strokesCount": 7, "strokeOrderText": "Bộ Thủ (扌) bên trái -> Chữ Ba (巴) bên phải", "components": "扌 + 巴", "mnemonic": "Bàn tay (Thủ) nắm chặt lấy sự vật tác động xử lý."},
      {"hanzi": "洗", "pinyin": "xǐ", "meaning": "Tẩy rửa, giặt giũ", "strokesCount": 9, "strokeOrderText": "Bộ Thủy (氵) bên trái -> Chữ Tiên (先) bên phải", "components": "氵 + 先", "mnemonic": "Dùng nước sạch (Thủy) làm sạch trước tiên (Tiên)."}
    ],
    "step4_grammar": {
      "title": "4 Điều cấm kỵ tuyệt đối khi dùng Câu chữ 把",
      "formula": "1. Động từ không được đứng cô độc (phải có thành phần khác: 了, 在, 到, 成, Bổ ngữ). 2. Tân ngữ phải xác định (người nghe biết rõ là vật gì). 3. Không dùng cho động từ cảm xúc (喜欢, 觉得, 有, 是). 4. Phủ định (没) và Năng nguyện (想, 要) phải đứng TRƯỚC chữ 把.",
      "explanation": "Ví dụ phủ định: 我没把书带来 (ĐÚNG) / 我把书没带来 (SAI ❌).",
      "examples": [{"hanzi": "请你把门关上，外面很冷。", "pinyin": "Qǐng nǐ bǎ mén guānshàng, wàimiàn hěn lěng.", "meaning": "Xin bạn đóng cửa lại, bên ngoài rất lạnh."}],
      "commonMistake": {"wrong": "我把书看 ❌ (động từ cô độc)", "correct": "我把书看完了 ✔️", "explanation": "Động từ câu chữ 把 bắt buộc có thành phần bổ trợ."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Mẹ", "hanzi": "儿子，你快把桌子上的牛奶喝了，然后把房间整理干净！", "pinyin": "Érzi, nǐ kuài bǎ zhuōzi shàng de niúnǎi hē le, ránhòu bǎ fángjiān zhěnglǐ gānjìng!", "meaning": "Con trai, con mau uống cốc sữa trên bàn đi, sau đó dọn dẹp phòng cho sạch sẽ nhé!"},
        {"speaker": "Con", "hanzi": "知道了妈妈，我马上把牛奶喝完！", "pinyin": "Zhīdào le māma, wǒ mǎshàng bǎ niúnǎi hē wán!", "meaning": "Con biết rồi mẹ ơi, con uống hết sữa ngay đây!"}
      ],
      "audioText": "你快把桌子上的牛奶喝了，然后把房间整理干净！",
      "question": "Người mẹ yêu cầu con trai xử lý những việc gì?",
      "options": ["Đi ngủ", "Uống sữa trên bàn và dọn sạch phòng (bǎ niúnǎi hē le, bǎ fángjiān zhěnglǐ gānjìng)", "Đi ra ngoài chơi", "Nấu cơm"],
      "correctIndex": 1, "explanation": "Mẹ yêu cầu: 把牛奶喝了，把房间整理干净."
    },
    "step6_speaking": {"prompt": "Đọc câu chữ 把 yêu cầu đóng cửa:", "targetSentence": "请把门关上。", "targetPinyin": "Qǐng bǎ mén guānshàng.", "targetMeaning": "Xin hãy đóng cửa lại.", "hint": "Đọc bǎ mén guānshàng liền mạch."},
    "step7_writing": {"prompt": "Sắp xếp câu chữ 把: Tôi đã làm xong bài tập rồi", "words": ["做了完", "把作业", "我"], "correctOrder": ["我", "把作业", "做了完"], "explanation": "我 + 把作业 + 做完了."},
    "step8_quiz": [
      {"id": "q-308-1", "type": "multiple-choice", "question": "Trong câu chữ 把, từ phủ định '没' phải đứng ở vị trí nào?", "options": ["Đứng trước chữ 把 (S + 没 + 把 + O + V)", "Đứng sau chữ 把", "Đứng sau động từ", "Đứng cuối câu"], "correctIndex": 0, "explanation": "Phó từ phủ định bắt buộc đứng trước 把: 我没把手机带来."},
      {"id": "q-308-2", "type": "multiple-choice", "question": "Câu nào sau đây phạm lỗi 'động từ đứng cô độc' trong câu chữ 把?", "options": ["我把苹果吃了", "我把书看", "我把衣服洗干净了", "我把门关上了"], "correctIndex": 1, "explanation": "Câu '我把书看' sai vì động từ 看 không có thành phần bổ trợ."}
    ],
    "step9_challenge": {"title": "Bậc thầy chữ 把", "taskDesc": "Đọc to câu: 'Tôi đã giặt sạch quần áo và đặt lên giường rồi'.", "targetPhrase": "wǒ bǎ yīfu xǐ gānjìng le fàng zài chuáng shàng", "xpReward": 50, "badge": "Bậc Thầy Chữ 把"}
  },

  # --- LESSON 309 ---
  {
    "id": "l-309", "chapterId": "ch-10", "levelId": "lvl-3", "lessonNumber": 9,
    "title": "Câu chữ 把 nâng cao kết hợp Bổ ngữ kết quả & Xu hướng",
    "chineseTitle": "“把”字句进阶演练（把书交上去、把手机拿出来）",
    "subtitle": "Cấu trúc đỉnh cao của HSK 3: $S + 把 + O + V + Bổ ngữ kết quả / Bổ ngữ xu hướng phức hợp$.",
    "objective": "Kết hợp nhuần nhuyễn câu chữ 把 với các bổ ngữ xu hướng và bổ ngữ kết quả trong đàm thoại đời sống.",
    "prerequisite": "Đã hoàn thành Bài 308.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng câu chữ 把 nâng cao linh hoạt.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 3", "Câu chữ 把 nâng cao", "Bổ ngữ kết hợp", "Ngữ pháp đỉnh cao"],
    "relatedMaterialIds": ["mat-3", "mat-4"],
    "step1_learn": {
      "topic": "Cấu trúc 把 nâng cao: S + 把 + O + Động từ + (在 / 到 / 给 / 成 / 趋向补语)",
      "summary": "1. Thay đổi vị trí: 把书放到桌子上 (Để sách lên bàn). 2. Trao cho ai: 把作业交给老师 (Nộp bài cho thầy). 3. Chuyển dịch không gian: 把行李拿出来 (Lấy hành lý ra ngoài).",
      "audioDemoText": "qǐng bǎ zuòyè jiāo gěi lǎoshī, bǎ hùzhào ná chūlái, bǎ zhàopiàn fā gěi wǒ"
    },
    "step2_vocabulary": [
      {"id": "v-309-1", "hanzi": "交", "pinyin": "jiāo", "hanviet": "Giao", "meaning": "Giao nộp, kết bạn", "radical": "亠 (Đầu)", "example": {"hanzi": "交作业。", "pinyin": "Jiāo zuòyè.", "meaning": "Nộp bài tập."}},
      {"id": "v-309-2", "hanzi": "发", "pinyin": "fā", "hanviet": "Phát", "meaning": "Gửi, phát ra (tin nhắn, mail)", "radical": "又 (Hựu)", "example": {"hanzi": "把照片发给我。", "pinyin": "Bǎ zhàopiàn fā gěi wǒ.", "meaning": "Gửi ảnh cho tôi."}},
      {"id": "v-309-3", "hanzi": "搬", "pinyin": "bān", "hanviet": "Bàn", "meaning": "Chuyển, dọn (nhà, đồ nặng)", "radical": "扌 (Thủ)", "example": {"hanzi": "把桌子搬进去。", "pinyin": "Bǎ zhuōzi bān jìnqù.", "meaning": "Dọn bàn vào trong."}},
      {"id": "v-309-4", "hanzi": "借", "pinyin": "jiè", "hanviet": "Tá", "meaning": "Mượn, vay", "radical": "亻 (Nhân)", "example": {"hanzi": "把书借给我。", "pinyin": "Bǎ shū jiè gěi wǒ.", "meaning": "Cho tôi mượn sách."}}
    ],
    "step3_hanzi": [
      {"hanzi": "搬", "pinyin": "bān", "meaning": "Khuân vác, chuyển dọn", "strokesCount": 13, "strokeOrderText": "Bộ Thủ (扌) bên trái -> Chữ Bàn (般) bên phải", "components": "扌 + 般", "mnemonic": "Dùng bàn tay (Thủ) khuân vác thuyền bè đồ đạc dọn sang nơi mới."},
      {"hanzi": "借", "pinyin": "jiè", "meaning": "Mượn vay (Tá)", "strokesCount": 10, "strokeOrderText": "Bộ Nhân đứng (亻) bên trái -> Chữ Tích (昔) bên phải", "components": "亻 + 昔", "mnemonic": "Con người (亻) mượn lại ân tình của những ngày xưa cũ (Tích)."}
    ],
    "step4_grammar": {
      "title": "Mô hình chuyển giao: S + 把 + O + V + 给 / 到 + Người / Nơi chốn",
      "formula": "S + 把 + Đồ vật + 寄/送/交/带 + 给 + Đối tượng nhận",
      "explanation": "Khi muốn nói chuyển giao một đồ vật cho ai hoặc gửi tới đâu, bắt buộc phải dùng câu chữ 把 kết hợp giới từ 给 hoặc 到.",
      "examples": [{"hanzi": "请你把这份文件发给经理。", "pinyin": "Qǐng nǐ bǎ zhè fèn wénjiàn fā gěi jīnglǐ.", "meaning": "Xin bạn gửi tập tài liệu này cho giám đốc."}],
      "commonMistake": {"wrong": "发这份文件给经理 ❌ (thiếu tự nhiên)", "correct": "把这份文件发给经理 ✔️", "explanation": "Dùng 把 câu văn chuẩn ngữ pháp và đĩnh đạc."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "Thầy giáo", "hanzi": "同学们，考试时间到了，请大家把试卷交上来！", "pinyin": "Tóngxuémen, kǎoshì shíjiān dào le, qǐng dàjiā bǎ shìjuàn jiāo shànglái!", "meaning": "Các em học sinh, hết giờ làm bài rồi, xin mọi người nộp bài thi lên đây!"},
        {"speaker": "Học sinh", "hanzi": "老师，我已经把名字写好了，把试卷放在讲台上了。", "pinyin": "Lǎoshī, wǒ yǐjīng bǎ míngzi xiě hǎo le, bǎ shìjuàn fàng zài jiǎngtái shàng le.", "meaning": "Thưa thầy, em đã ghi xong tên rồi, và đặt bài thi lên trên bục giảng rồi ạ."}
      ],
      "audioText": "请大家把试卷交上来！我已经把试卷放在讲台上了。",
      "question": "Học sinh đã làm gì với bài thi?",
      "options": ["Mang về nhà", "Đặt bài thi lên bục giảng (bǎ shìjuàn fàng zài jiǎngtái shàng)", "Xé bài thi", "Chưa làm xong"],
      "correctIndex": 1, "explanation": "Học sinh nói: 把试卷放在讲台上了."
    },
    "step6_speaking": {"prompt": "Đọc câu nhờ gửi hình ảnh:", "targetSentence": "请把照片发给我。", "targetPinyin": "Qǐng bǎ zhàopiàn fā gěi wǒ.", "targetMeaning": "Xin hãy gửi ảnh cho tôi.", "hint": "Đọc fā gěi wǒ thanh 1, 3, 3."},
    "step7_writing": {"prompt": "Sắp xếp câu: Dọn chiếc bàn này vào trong phòng", "words": ["搬进房间去", "把这张桌子"], "correctOrder": ["把这张桌子", "搬进房间去"], "explanation": "把这张桌子 + 搬进房间去."},
    "step8_quiz": [
      {"id": "q-309-1", "type": "multiple-choice", "question": "Chọn câu đúng ngữ pháp nói 'Gửi tài liệu cho giám đốc':", "options": ["把文件发给经理", "发文件把经理", "经理把文件发", "给经理发把文件"], "correctIndex": 0, "explanation": "Cấu trúc chuẩn: 把文件发给经理."},
      {"id": "q-309-2", "type": "multiple-choice", "question": "Cụm '交上来' (jiāo shànglái) có nghĩa là:", "options": ["Nộp lên đây", "Cầm đi", "Bỏ xuống", "Giấu đi"], "correctIndex": 0, "explanation": "Nộp bài lên trên hướng về phía thầy giáo."}
    ],
    "step9_challenge": {"title": "Thực chiến công sở", "taskDesc": "Đọc to câu: 'Tôi đã gửi bản kế hoạch cho giám đốc và dọn dẹp văn phòng xong rồi'.", "targetPhrase": "wǒ bǎ jìhuà fā gěi jīnglǐ le", "xpReward": 50, "badge": "Chuyên Gia Văn Phòng"}
  },

  # --- LESSON 310 ---
  {
    "id": "l-310", "chapterId": "ch-10", "levelId": "lvl-3", "lessonNumber": 10,
    "title": "Câu bị động chữ 被 (S + 被 + Tác nhân + V + khác)",
    "chineseTitle": "“被”字句与被动表达（钱包被偷了、被看见了）",
    "subtitle": "Diễn đạt sự việc bị động hoặc chịu tác động không mong muốn với chữ 被 (bèi), 叫 (jiào), 让 (ràng).",
    "objective": "Sử dụng thành thạo câu bị động chữ 被 để miêu tả các tình huống bị động trong cuộc sống.",
    "prerequisite": "Đã hoàn thành Bài 309.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và chuyển đổi linh hoạt giữa câu chữ 把 và câu chữ 被.",
    "durationMinutes": 20, "xpReward": 50, "tags": ["HSK 3", "Câu bị động chữ 被", "Bị động", "Ngữ pháp HSK 3"],
    "relatedMaterialIds": ["mat-3", "mat-4"],
    "step1_learn": {
      "topic": "Công thức Câu bị động: Chủ ngữ (Người/Vật bị tác động) + 被 (bèi) + (Tác nhân) + Động từ + Thành phần khác",
      "summary": "Câu chữ 被 thường dùng trong tình huống không may mắn hoặc nhấn mạnh kết quả của đối tượng chịu trận: 钱包被偷了 (Ví tiền bị trộm rồi), 蛋糕被人吃了 (Bánh ngọt bị ai đó ăn mất rồi).",
      "audioDemoText": "wǒ de qiánbāo bèi tōu le, bēizi bèi dǎ suì le, tā bèi gōngsī lùqǔ le"
    },
    "step2_vocabulary": [
      {"id": "v-310-1", "hanzi": "被", "pinyin": "bèi", "hanviet": "Bị", "meaning": "Bị, được (giới từ bị động)", "radical": "衤 (Y)", "example": {"hanzi": "被发现了。", "pinyin": "Bèi fāxiàn le.", "meaning": "Bị phát hiện rồi."}},
      {"id": "v-310-2", "hanzi": "偷", "pinyin": "tōu", "hanviet": "Thâu", "meaning": "Trộm, cắp", "radical": "亻 (Nhân)", "example": {"hanzi": "自行车被偷了。", "pinyin": "Zìxíngchē bèi tōu le.", "meaning": "Xe đạp bị trộm mất rồi."}},
      {"id": "v-310-3", "hanzi": "钱包", "pinyin": "qiánbāo", "hanviet": "Tiền bao", "meaning": "Ví tiền, bóp tiền", "radical": "钅 (Kim)", "example": {"hanzi": "我的钱包呢？", "pinyin": "Wǒ de qiánbāo ne?", "meaning": "Ví tiền của tôi đâu rồi?"}},
      {"id": "v-310-4", "hanzi": "打碎", "pinyin": "dǎsuì", "hanviet": "Đả toái", "meaning": "Đánh vỡ, làm bể", "radical": "扌 (Thủ)", "example": {"hanzi": "杯子被打碎了。", "pinyin": "Bēizi bèi dǎsuì le.", "meaning": "Cái ly bị làm vỡ rồi."}},
      {"id": "v-310-5", "hanzi": "发现", "pinyin": "fāxiàn", "hanviet": "Phát hiện", "meaning": "Phát hiện, nhận ra", "radical": "又 (Hựu)", "example": {"hanzi": "被老师发现了。", "pinyin": "Bèi lǎoshī fāxiàn le.", "meaning": "Bị thầy giáo phát hiện rồi."}}
    ],
    "step3_hanzi": [
      {"hanzi": "被", "pinyin": "bèi", "meaning": "Bị, cái chăn", "strokesCount": 10, "strokeOrderText": "Bộ Y (衤) bên trái -> Bộ Bì (皮) bên phải", "components": "衤 + 皮", "mnemonic": "Tấm áo da khoác (Y + Bì) trùm phủ lên che chở hoặc bao phủ bị động."},
      {"hanzi": "偷", "pinyin": "tōu", "meaning": "Trộm cắp", "strokesCount": 11, "strokeOrderText": "Bộ Nhân đứng (亻) bên trái -> Chữ Du (俞) bên phải", "components": "亻 + 俞", "mnemonic": "Kẻ gian (Nhân) lén lút trộm đồ đạc của người khác."}
    ],
    "step4_grammar": {
      "title": "Mối quan hệ chuyển đổi tương hỗ giữa Câu chữ 把 và Câu chữ 被",
      "formula": "Tác nhân + 把 + Đối tượng + V + khác  ⟷  Đối tượng + 被 + (Tác nhân) + V + khác",
      "explanation": "Ví dụ: 弟弟吃了蛋糕 (Chủ động) ➔ 弟弟把蛋糕吃了 (Nhấn mạnh xử lý) ➔ 蛋糕被弟弟吃了 (Nhấn mạnh bánh bị mất).",
      "examples": [{"hanzi": "小偷把我的自行车偷走了。 ➔ 我的自行车被小偷偷走了。", "pinyin": "Wǒ de zìxíngchē bèi xiǎotōu tōu zǒu le.", "meaning": "Chiếc xe đạp của tôi đã bị tên trộm lấy mất rồi."}],
      "commonMistake": {"wrong": "自行车被 ❌ (thiếu động từ và kết quả)", "correct": "自行车被偷走了 ✔️", "explanation": "Câu chữ 被 luôn cần động từ và kết quả hành động."}
    },
    "step5_listening": {
      "dialogue": [
        {"speaker": "A", "hanzi": "你怎么看起来这么难过？发生什么事了？", "pinyin": "Nǐ zěnme kànqǐlai zhème nánguò? Fāshēng shénme shì le?", "meaning": "Sao trông bạn buồn thế? Đã xảy ra chuyện gì vậy?"},
        {"speaker": "B", "hanzi": "我刚才在地铁上，钱包被小偷偷走了，里面有我的护照和现金！", "pinyin": "Wǒ gāngcái zài dìtiě shàng, qiánbāo bèi xiǎotōu tōu zǒu le, lǐmiàn yǒu wǒ de hùzhào hé xiànjīn!", "meaning": "Hồi nãy trên tàu điện ngầm, ví tiền của tôi bị tên trộm lấy mất rồi, bên trong có cả hộ chiếu và tiền mặt của tôi!"}
      ],
      "audioText": "钱包被小偷偷走了，里面有我的护照和现金！",
      "question": "Chuyện không may gì đã xảy ra với người B?",
      "options": ["Bị trễ máy bay", "Ví tiền bị trộm mất trên tàu điện ngầm (qiánbāo bèi tōu zǒu le)", "Làm vỡ ly nước", "Bị ốm"],
      "correctIndex": 1, "explanation": "B nói: 钱包被小偷偷走了."
    },
    "step6_speaking": {"prompt": "Đọc câu miêu tả đồ vật bị vỡ:", "targetSentence": "杯子被人打碎了。", "targetPinyin": "Bēizi bèi rén dǎsuì le.", "targetMeaning": "Cái ly bị người ta làm vỡ rồi.", "hint": "Đọc bèi rén dǎsuì le dứt khoát."},
    "step7_writing": {"prompt": "Sắp xếp câu bị động: Ví tiền của tôi bị trộm mất rồi", "words": ["偷走了", "被", "我的钱包"], "correctOrder": ["我的钱包", "被", "偷走了"], "explanation": "我的钱包 + 被 + 偷走了."},
    "step8_quiz": [
      {"id": "q-310-1", "type": "multiple-choice", "question": "Trong câu chữ 被, tác nhân gây ra hành động có thể được lược bỏ không?", "options": ["Bắt buộc phải có", "Có thể lược bỏ (Ví dụ: 钱包被偷了)", "Không được dùng", "Chỉ dùng cho động vật"], "correctIndex": 1, "explanation": "Trong câu chữ 被, tác nhân có thể được ẩn đi: 钱包被偷了."},
      {"id": "q-310-2", "type": "multiple-choice", "question": "Chuyển câu '他打破了杯子' sang câu chữ 被 đúng là:", "options": ["杯子被他打破了", "他被杯子打破了", "杯子他被打破", "被杯子他打破"], "correctIndex": 0, "explanation": "Cấu trúc bị động: 杯子 (Vật bị vỡ) + 被他 + 打破了."}
    ],
    "step9_challenge": {"title": "Mở khóa Boss Chapter 10", "taskDesc": "Vượt qua thử thách câu chữ 把 và câu chữ 被 để mở khóa trận chiến ngữ pháp Boss 10!", "targetPhrase": "wǒ zhǎngwò le bǎ zì jù hé bèi zì jù", "xpReward": 60, "badge": "Vua Cú Pháp Tiếng Trung"}
  }
]

print(f"Loaded {len(LEVEL_3_PART2)} lessons for Level 3 Module 3.2")
