# -*- coding: utf-8 -*-
import json

def get_hsk1_ref_questions():
    questions = []
    # 10 Listening
    listening_items = [
        ("q-hsk1-ref-01", "听录音，判断对错：[看书]", "Tīng lùyīn, pànduàn duìcuò: [kàn shū]", "Nghe ghi âm, phán đoán đúng sai: [Đọc sách]", "他在看书呢。", [("✓ Đúng (一致)", "Yízhì"), ("✗ Sai (不一致)", "Bù yízhì")], 0, "Khớp lời thoại '看书'."),
        ("q-hsk1-ref-02", "听录音，选出对应的物品：", "Tīng lùyīn, xuǎn chū duìyìng de wùpǐn:", "Nghe ghi âm, chọn đồ vật tương ứng:", "桌子上有一个苹果。", [("Quả táo (苹果)", "Píngguǒ"), ("Cốc nước (水杯)", "Shuǐbēi"), ("Quyển sách (书)", "Shū")], 0, "Lời thoại nói về quả táo (苹果)."),
        ("q-hsk1-ref-03", "听句子，选择人物的职业：", "Tīng jùzi, xuǎnzé rénwù de zhíyè:", "Nghe câu, chọn nghề nghiệp của nhân vật:", "我爸爸在医院工作，他是医生。", [("Bác sĩ (医生)", "Yīshēng"), ("Thầy giáo (老师)", "Lǎoshī"), ("Sinh viên (学生)", "Xuésheng")], 0, "Nói rõ '他是医生'."),
        ("q-hsk1-ref-04", "听对话，选择正确的时间：", "Tīng duìhuà, xuǎnzé zhèngquè de shíjiān:", "Nghe đối thoại, chọn thời gian:", "男：现在几点了？女：现在上午九点半。问：现在几点？", [("9:30 (九点半)", "Jiǔ diǎn bàn"), ("8:30 (八点半)", "Bā diǎn bàn"), ("10:00 (十点)", "Shí diǎn")], 0, "Thời gian là 9 giờ 30 sáng."),
        ("q-hsk1-ref-05", "听录音，选出交通方式：", "Tīng lùyīn, xuǎn chū jiāotōng fāngshì:", "Nghe ghi âm, chọn phương tiện:", "我们坐出租车去火车站吧。", [("Xe taxi (出租车)", "Chūzūchē"), ("Máy bay (飞机)", "Fēijī"), ("Tàu hỏa (火车)", "Huǒchē")], 0, "Đi bằng taxi: 坐出租车."),
        ("q-hsk1-ref-06", "听对话，选择人物想喝什么：", "Tīng duìhuà, xuǎnzé rénwù xiǎng hē shénme:", "Nghe đối thoại, chọn thức uống:", "女：你想喝茶吗？男：不，我想喝冷水。问：男的想喝什么？", [("Nước lạnh (冷水)", "Lěngshuǐ"), ("Trà nóng (热茶)", "Rèchá"), ("Sữa tươi (牛奶)", "Niúnǎi")], 0, "Muốn uống nước lạnh: 喝冷水."),
        ("q-hsk1-ref-07", "听对话，判断地点：", "Tīng duìhuà, pànduàn dìdiǎn:", "Nghe đối thoại, xác định địa điểm:", "男：王小姐在学校吗？女：不在，她在商店买衣服。问：王小姐在哪儿？", [("Cửa hàng (商店)", "Shāngdiàn"), ("Trường học (学校)", "Xuéxiào"), ("Bệnh viện (医院)", "Yīyuàn")], 0, "Đang ở cửa hàng mua quần áo."),
        ("q-hsk1-ref-08", "听录音，选择天气：", "Tīng lùyīn, xuǎnzé tiānqì:", "Nghe ghi âm, chọn thời tiết:", "今天天气太冷了，你多穿点儿衣服。", [("Rất lạnh (很冷)", "Hěn lěng"), ("Rất nóng (很热)", "Hěn rè"), ("Mưa to (下雨)", "Xià yǔ")], 0, "Thời tiết quá lạnh: 太冷了."),
        ("q-hsk1-ref-09", "听对话，回答数量问题：", "Tīng duìhuà, huídá shùliàng wèntí:", "Nghe đối thoại, trả lời số lượng:", "男：你家有几口人？女：我家有四口人。问：她家有几口人？", [("4 người (四口人)", "Sì kǒu rén"), ("3 người (三口人)", "Sān kǒu rén"), ("5 người (五口人)", "Wǔ kǒu rén")], 0, "Có 4 người: 四口人."),
        ("q-hsk1-ref-10", "听对话，选择人物年龄：", "Tīng duìhuà, xuǎnzé rénwù niánlíng:", "Nghe đối thoại, chọn độ tuổi:", "女：你的儿子多大了？男：他今年八岁了。问：他儿子多大？", [("8 tuổi (八岁)", "Bā suì"), ("6 tuổi (六岁)", "Liù suì"), ("10 tuổi (十岁)", "Shí suì")], 0, "Con trai 8 tuổi: 八岁.")
    ]
    for idx, (qid, prompt, pinyin, trans, script, opts, correct, exp) in enumerate(listening_items):
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid,
            "exam_id": "hsk1-official-ref-01",
            "part_type": "listening",
            "part_number": 1 if idx < 5 else 2,
            "question_number": idx + 1,
            "question_type": "true_false" if idx == 0 else "multiple_choice",
            "prompt": prompt,
            "pinyin": pinyin,
            "translation": trans,
            "audio_url": "",
            "audio_script": script,
            "options": options,
            "correct_option_index": correct,
            "explanation": exp,
            "points": 10
        })

    # 10 Reading
    reading_items = [
        ("q-hsk1-ref-11", "看词语判断正误：[喝茶 —— uống trà]", "Kàn cíyǔ pànduàn zhèngwù: [hē chá —— uống trà]", "Đọc từ ngữ phán đoán đúng sai:", [("✓ Đúng (正确)", "Zhèngquè"), ("✗ Sai (错误)", "Cuòwù")], 0, "喝茶 nghĩa là uống trà."),
        ("q-hsk1-ref-12", "看词语判断正误：[电脑 —— điện thoại]", "Kàn cíyǔ pànduàn zhèngwù: [diànnǎo —— điện thoại]", "Đọc từ ngữ phán đoán đúng sai:", [("✓ Đúng (正确)", "Zhèngquè"), ("✗ Sai (错误)", "Cuòwù")], 1, "电脑 là máy tính, điện thoại là 电话."),
        ("q-hsk1-ref-13", "选词填空：这儿有三______学生。", "Xuǎncí tiánkòng: Zhèr yǒu sān ______ xuésheng.", "Chọn lượng từ: Ở đây có ba sinh viên.", [("个 (Gè)", "Gè"), ("本 (Běn)", "Běn"), ("张 (Zhāng)", "Zhāng")], 0, "Lượng từ cho người: 个人."),
        ("q-hsk1-ref-14", "问答配对：[你好！]", "Wèndá pèiduì: [Nǐ hǎo!]", "Chọn câu đáp lại: 'Xin chào!'", [("你好！", "Nǐ hǎo!"), ("谢谢！", "Xièxie!"), ("对不起！", "Duìbuqǐ!")], 0, "Đáp lại '你好' là '你好'."),
        ("q-hsk1-ref-15", "选词填空：我______北京大学的学生。", "Xuǎncí tiánkòng: Wǒ ______ Běijīng Dàxué de xuésheng.", "Điền từ: Tôi ______ sinh viên Đại học Bắc Kinh.", [("是 (Là)", "Shì"), ("有 (Có)", "Yǒu"), ("去 (Đi)", "Qù")], 0, "Cấu trúc phán đoán: 我是... (Tôi là...)."),
        ("q-hsk1-ref-16", "选择疑问词：你想买______？", "Xuǎnzé yíwèncí: Nǐ xiǎng mǎi ______?", "Chọn từ nghi vấn: Bạn muốn mua ______?", [("什么 (Gì)", "Shénme"), ("谁 (Ai)", "Shéi"), ("哪儿 (Ở đâu)", "Nǎr")], 0, "Tân ngữ đồ vật: 买什么."),
        ("q-hsk1-ref-17", "选择方位词：猫在桌子______面睡觉。", "Xuǎnzé fāngwèicí: Māo zài zhuōzi ______ mian shuìjiào.", "Chọn từ chỉ phương hướng: Mèo ở ______ bàn ngủ.", [("下 (Dưới)", "Xià"), ("大 (To)", "Dà"), ("小 (Nhỏ)", "Xiǎo")], 0, "Vị trí: 下面 (bên dưới)."),
        ("q-hsk1-ref-18", "连词成句：[①我 ②喝水 ③想]", "Liáncí chéng jù: [①wǒ ②hē shuǐ ③xiǎng]", "Sắp xếp từ thành câu:", [("①③② (我想喝水。)", "Wǒ xiǎng hē shuǐ."), ("③①② (想我喝水。)", "Xiǎng wǒ hē shuǐ."), ("②①③ (喝水我想。)", "Hē shuǐ wǒ xiǎng.")], 0, "Cấu trúc: Chủ ngữ + 想 + Động từ (我想喝水。)."),
        ("q-hsk1-ref-19", "看拼音选汉字：xuéxí (học tập)", "Kàn pīnyīn xuǎn hànzì: xuéxí (học tập)", "Nhìn phiên âm chọn chữ Hán:", [("学习", "xuéxí"), ("学校", "xuéxiào"), ("学生", "xuésheng")], 0, "学习 nghĩa là học tập."),
        ("q-hsk1-ref-20", "阅读理解：[我叫大卫，是美国人。我在清华大学学习中文。] 问：大卫学习什么？", "Yuèdú lǐjiě: [Wǒ jiào Dàwèi...] Wèn: Dàwèi xuéxí shénme?", "Đọc hiểu: David học ngành gì?", [("中文 (Tiếng Trung)", "Zhōngwén"), ("英语 (Tiếng Anh)", "Yīngyǔ"), ("法文 (Tiếng Pháp)", "Fǎwén")], 0, "Trong bài ghi rõ: 学习中文.")
    ]
    for idx, (qid, prompt, pinyin, trans, opts, correct, exp) in enumerate(reading_items):
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid,
            "exam_id": "hsk1-official-ref-01",
            "part_type": "reading",
            "part_number": 1 if idx < 5 else 2,
            "question_number": idx + 11,
            "question_type": "true_false" if idx < 2 else "multiple_choice",
            "prompt": prompt,
            "pinyin": pinyin,
            "translation": trans,
            "audio_url": "",
            "audio_script": "",
            "options": options,
            "correct_option_index": correct,
            "explanation": exp,
            "points": 10
        })

    return questions

print("HSK 1 Ref Questions:", len(get_hsk1_ref_questions()))
