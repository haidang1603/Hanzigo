# -*- coding: utf-8 -*-
import json

def get_hsk3_mock01_questions():
    questions = []
    # 12 Listening
    listening = [
        ("q-hsk3-01-01", "听对话，选择正确答案：", "Tīng duìhuà, xuǎnzé zhèngquè dá'àn:", "Nghe đối thoại, chọn đáp án đúng:", "男：小王，请问会议室在几层？女：在五层，出电梯往左走就是。问：会议室在几层？", [("三层 (Tầng 3)", "Sān céng"), ("五层 (Tầng 5)", "Wǔ céng"), ("七层 (Tầng 7)", "Qī céng")], 1, "Lời thoại người nữ: '在五层，出电梯往左走就是'. Chọn Tầng 5."),
        ("q-hsk3-01-02", "听对话，判断女的打算买什么：", "Tīng duìhuà, pànduàn nǚ de dǎsuàn mǎi shénme:", "Nghe đối thoại, phán đoán người nữ định mua gì:", "男：天气越来越冷了，你得多穿点儿。女：是啊，我打算周末去商场买一件厚羽绒服。问：女的打算买什么？", [("羽绒服 (Áo phao lông vũ)", "Yǔróngfú"), ("衬衫 (Áo sơ mi)", "Chènshān"), ("雨伞 (Cái ô)", "Yǔsǎn")], 0, "Người nữ nói: '我打算周末去商场买一件厚羽绒服'."),
        ("q-hsk3-01-03", "听对话，选择男的为什么迟到：", "Tīng duìhuà, xuǎnzé nán de wèishénme chídào:", "Nghe đối thoại, chọn lý do người nam đến muộn:", "女：你怎么迟到了半个小时？男：真抱歉，路上堵车太严重了。问：男的为什么迟到？", [("Kẹt xe trên đường (路上堵车)", "Lùshang dǔchē"), ("Ngủ quên (睡过头)", "Shuì guòtóu"), ("Xe hỏng (车坏了)", "Chē huài le")], 0, "Lý do: 路上堵车太严重了 (kẹt xe nghiêm trọng)."),
        ("q-hsk3-01-04", "听对话，回答地点问题：", "Tīng duìhuà, huídá dìdiǎn wèntí:", "Nghe đối thoại, xác định địa điểm:", "男：请问，去故宫坐几路公共汽车？女：您得过马路，在对面坐103路车。问：男的要去哪里？", [("Cố Cung (故宫)", "Gùgōng"), ("Sân bay (机场)", "Jīchǎng"), ("Bệnh viện (医院)", "Yīyuàn")], 0, "Người nam hỏi đường đến Cố Cung (故宫)."),
        ("q-hsk3-01-05", "听短文，判断正误：[经理今天下午要开会。]", "Tīng duǎnwén, pànduàn zhèngwù: [Jīnglǐ jīntiān xiàwǔ yào kāihuì.]", "Nghe ghi âm, phán đoán đúng sai: 'Giám đốc chiều nay phải họp.'", "张经理今天下午两点在三楼会议室主持工作会议，请大家准时参加。", [("✓ Đúng (正确)", "Zhèngquè"), ("✗ Sai (错误)", "Cuòwù")], 0, "Giám đốc Trương chủ trì cuộc họp chiều nay: Đúng."),
        ("q-hsk3-01-06", "听对话，选择就医建议：", "Tīng duìhuà, xuǎnzé jiùyī jiànyì:", "Nghe đối thoại, chọn lời khuyên của bác sĩ:", "男：医生，我发烧38度，头很疼。女：你感冒了，回去多喝温水，按时吃药，好好休息两天。问：女的建议男的怎么做？", [("Nghỉ ngơi và uống nhiều nước (多喝水休息)", "Duō hē shuǐ xiūxi"), ("Đi làm việc ngay (去上班)", "Qù shàngbān"), ("Tập thể dục mạnh (去跑步)", "Qù pǎobù")], 0, "Lời khuyên: 多喝温水，按时吃药，好好休息两天."),
        ("q-hsk3-01-07", "听对话，选择人物的关系：", "Tīng duìhuà, xuǎnzé rénwù de guānxì:", "Nghe đối thoại, chọn mối quan hệ giữa hai người:", "男：服务员，请给我们换一个靠窗的桌子。女：好的先生，请随我来这边。问：他们是什么关系？", [("Khách và phục vụ (顾客和服务员)", "Gùkè hé fúwùyuán"), ("Đồng nghiệp (同事)", "Tóngshì"), ("Vợ chồng (夫妻)", "Fūqī")], 0, "Xưng hô '服务员' và '先生' là quan hệ khách - người phục vụ."),
        ("q-hsk3-01-08", "听对话，回答价格问题：", "Tīng duìhuà, huídá jiàgé wèntí:", "Nghe đối thoại, trả lời giá tiền:", "女：这双皮鞋原价八百块，今天打五折，只要四百块。男：太划算了，我买一双。问：男的要付多少钱？", [("400 đồng (四百块)", "Sìbǎi kuài"), ("800 đồng (八百块)", "Bābǎi kuài"), ("500 đồng (五百块)", "Wǔbǎi kuài")], 0, "Giảm 50% còn 400 tệ: 只要四百块."),
        ("q-hsk3-01-09", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại, trả lời câu hỏi:", "男：你学中国画学了多久了？女：三年了，我每逢周末都去文化宫跟老师练习。问：女的学中国画几年了？", [("3 năm (三年)", "Sān nián"), ("1 năm (一年)", "Yì nián"), ("5 năm (五年)", "Wǔ nián")], 0, "Học vẽ tranh Trung Quốc 3 năm: 三年了."),
        ("q-hsk3-01-10", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại, trả lời câu hỏi:", "女：你看见我的护照了吗？明天出国要用呢。男：放在客厅茶几上面的包里了，快去拿吧。问：护照在哪里？", [("Trong túi trên bàn trà (包里)", "Bāo lǐ"), ("Dưới giường (床下)", "Chuáng xià"), ("Trong văn phòng (办公室)", "Bàngōngshì")], 0, "放在客厅茶几上面的包里了 (trong túi xách trên bàn trà)."),
        ("q-hsk3-01-11", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại, trả lời câu hỏi:", "男：小李，这份报告写得非常清楚，数据也很准确。女：谢谢经理，都是大家共同努力的结果。问：经理对这份报告态度如何？", [("Khen ngợi, hài lòng (非常满意)", "Fēicháng mǎnyì"), ("Chê bai (不满意)", "Bù mǎnyì"), ("Yêu cầu viết lại (重写)", "Chóngxiě")], 0, "Giám đốc khen: '写得非常清楚，数据也很准确' (hài lòng)."),
        ("q-hsk3-01-12", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại, trả lời câu hỏi:", "女：听说你搬新家了？环境怎么样？男：小区绿化特别好，附近还有公园和超市，非常方便。问：男的新家附近有什么？", [("Công viên và siêu thị (公园和超市)", "Gōngyuán hé chāoshì"), ("Trường đại học (大学)", "Dàxué"), ("Bến xe khách (车站)", "Chēzhàn")], 0, "Gần công viên và siêu thị: 附近还有公园和超市.")
    ]
    for idx, (qid, prompt, pinyin, trans, script, opts, corr, exp) in enumerate(listening):
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk3-mock-01", "part_type": "listening", "part_number": 1 if idx < 4 else 2 if idx < 8 else 3,
            "question_number": idx + 1, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": script,
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 8
        })

    # 12 Reading
    reading = [
        ("q-hsk3-01-13", "选词填空：请大家在进入考场前，______把手机关机。", "Xuǎncí tiánkòng: Qǐng dàjiā zài jìnrù kǎochǎng qián, ______ bǎ shǒujī guānjī.", "Điền phó từ: Xin mọi người trước khi vào phòng thi, ______ phải tắt nguồn điện thoại.", [("一定要 (Nhất định phải)", "Yídìng yào"), ("随便 (Tùy tiện)", "Suíbiàn"), ("偶尔 (Thỉnh thoảng)", "Ǒu'ěr"), ("大概 (Đại khái)", "Dàgài")], 0, "Quy chế phòng thi: 一定要 (nhất định phải)."),
        ("q-hsk3-01-14", "选词填空：经过两年的努力，他的汉语水平有了很大的______。", "Xuǎncí tiánkòng: Jīngguò liǎng nián de nǔlì, tā de Hànyǔ shuǐpíng yǒu le hěn dà de ______.", "Điền danh từ kết hợp với水平 (trình độ):", [("提高 (Nâng cao / Tiến bộ)", "Tígāo"), ("发现 (Phát hiện)", "Fāxiàn"), ("检查 (Kiểm tra)", "Jiǎnchá"), ("同意 (Đồng ý)", "Tóngyì")], 0, "Cụm danh từ: 水平有了很大的提高 (trình độ được nâng cao lớn)."),
        ("q-hsk3-01-15", "选词填空：这道数学题太难了，我怎么算也算不______。", "Xuǎncí tiánkòng: Zhè dào shùxuétí tài nán le, wǒ zěnme suàn yě suàn bu ______.", "Chọn bổ ngữ khả năng: Đề toán này khó quá, tôi tính thế nào cũng không ______...", [("出来 (Ra được)", "Chūlai"), ("过去 (Qua được)", "Guòqu"), ("起来 (Lên được)", "Qǐlai"), ("下去 (Tiếp được)", "Xiàqu")], 0, "Bổ ngữ khả năng: 算不出来 (không tính ra được)."),
        ("q-hsk3-01-16", "选词填空：你最近工作太忙了，______要注意身体。", "Xuǎncí tiánkòng: Nǐ zuìjìn gōngzuò tài máng le, ______ yào zhùyì shēntǐ.", "Chọn liên từ phù hợp:", [("千万 (Nhất thiết / Tuyệt đối)", "Qiānwàn"), ("或者 (Hoặc)", "Huòzhě"), ("难道 (Chẳng lẽ)", "Nándào"), ("故意 (Cố ý)", "Gùyì")], 0, "Lời dặn dò khuyên can thiết tha: 千万要注意身体."),
        ("q-hsk3-01-17", "选择关联词：______明天下雨，运动会______推迟举行。", "Xuǎnzé guānliáncí: ______ míngtiān xià yǔ, yùndònghuì ______ tuīchí jǔxíng.", "Chọn cặp liên từ giả thiết:", [("如果...就... (Nếu...thì...)", "Rúguǒ...jiù..."), ("虽然...但是... (Tuy...nhưng...)", "Suīrán...dànshì..."), ("不仅...而且... (Không chỉ...mà còn...)", "Bùjǐn...érqiě..."), ("只有...才... (Chỉ có...mới...)", "Zhǐyǒu...cái...")], 0, "Giả thiết điều kiện: 如果明天下雨，就推迟."),
        ("q-hsk3-01-18", "选词填空：图书馆里必须保持安静，请不要大声______。", "Xuǎncí tiánkòng: Túshūguǎn lǐ bìxū bǎochí ānjìng, qǐng bú yào dàshēng ______.", "Chọn động từ phù hợp quy định thư viện:", [("说话 (Nói chuyện)", "Shuōhuà"), ("看书 (Đọc sách)", "Kàn shū"), ("借书 (Mượn sách)", "Jiè shū"), ("走路 (Đi bộ)", "Zǒu lù")], 0, "Giữ yên tĩnh, không được nói to: 不要大声说话."),
        ("q-hsk3-01-19", "阅读理解：[中国有句古话叫‘熟能生巧’。意思是说，无论做什么事情，只要经常练习，掌握了规律，就能做得又快又好。] 问：‘熟能生巧’的意思是什么？", "Yuèdú lǐjiě: Wèn: 'Shúnéngshēngqiǎo' de yìsi shì shénme?", "Đọc hiểu: Thành ngữ 'Thục năng sinh xảo' nghĩa là gì?", [("Luyện tập nhiều sẽ thành thạo và giỏi (经常练习就能做好)", "Jīngcháng liànxí jiù néng zuò hǎo"), ("Phải có tài năng bẩm sinh (需要天赋)", "Xūyào tiānfù"), ("Làm việc phải nhờ người khác (依靠别人)", "Yīkào biérén"), ("Không cần luyện tập (不用练习)", "Bú yòng liànxí")], 0, "Đoạn văn giải thích: 经常练习，掌握规律，就能做好."),
        ("q-hsk3-01-20", "阅读理解：[很多人认为只有吃药才能治病，其实保持心情愉快、规律作息和适量运动对健康更重要。] 问：作者认为什么对健康更重要？", "Yuèdú lǐjiě: Wèn: Zuòzhě rènwéi shénme duì jiànkāng gèng zhòngyào?", "Đọc hiểu: Tác giả cho rằng điều gì quan trọng hơn cho sức khỏe?", [("Tâm trạng tốt, sinh hoạt điều độ và thể dục (心情愉快、规律作息和运动)", "Xīnqíng yúkuài, guīlǜ zuòxī..."), ("Chỉ cần uống thật nhiều thuốc (多吃药)", "Duō chī yào"), ("Làm việc suốt ngày đêm (一直工作)", "Yìzhí gōngzuò"), ("Ăn nhiều đồ ngọt (多吃甜食)", "Duō chī tiánshí")], 0, "Tác giả chỉ ra: 保持心情愉快、规律作息和适量运动更重要."),
        ("q-hsk3-01-21", "阅读理解：[小李平时不爱说话，但是在今天的演讲比赛中，他的表现非常出色，赢得了所有评委的掌声。] 问：关于小李，下列哪项正确？", "Yuèdú lǐjiě: Wèn: Guānyú Xiǎolǐ, xiàliè nǎ xiàng zhèngquè?", "Đọc hiểu: Nhận định nào đúng về Tiểu Lý?", [("Cuộc thi diễn thuyết hôm nay thể hiện rất xuất sắc (今天演讲很出色)", "Jīntiān yǎnjiǎng hěn chūsè"), ("Thường ngày rất hoạt ngôn (平时爱说话)", "Píngshí ài shuōhuà"), ("Không tham gia thi (没参加比赛)", "Méi cānjiā bǐsài"), ("Giám khảo không vỗ tay (评委没鼓掌)", "Píngwěi méi gǔzhǎng")], 0, "Đoạn văn viết: 表现非常出色，赢得了掌声."),
        ("q-hsk3-01-22", "选词填空：这个问题很复杂，我们必须开会详细______一下。", "Xuǎncí tiánkòng: Zhè gè wèntí hěn fùzá, wǒmen bìxū kāihuì xiángxì ______ yíxià.", "Chọn động từ thảo luận bàn bạc:", [("讨论 (Thảo luận)", "Tǎolùn"), ("以为 (Tưởng rằng)", "Yǐwéi"), ("回答 (Trả lời)", "Huídá"), ("明白 (Hiểu rõ)", "Míngbai")], 0, "Họp để bàn bạc kỹ lưỡng: 详细讨论一下."),
        ("q-hsk3-01-23", "选词填空：天黑了，请把客厅的灯______开。", "Xuǎncí tiánkòng: Tiān hēi le, qǐng bǎ kètīng de dēng ______ kāi.", "Chọn động từ bật đèn:", [("打 (Bật)", "Dǎ"), ("拿 (Cầm)", "Ná"), ("拉 (Kéo)", "Lā"), ("推 (Đẩy)", "Tuī")], 0, "Bật đèn: 打开灯 / 把灯打开."),
        ("q-hsk3-01-24", "选词填空：虽然遇到很多困难，但他______坚持完成了这项任务。", "Xuǎncí tiánkòng: Suīrán yùdào hěn duō kùnnan, dàn tā ______ jiānchí wánchéng le zhè xiàng rènwu.", "Chọn phó từ biểu thị sự kiên trì liên tục:", [("仍然 (Vẫn / Vẫn cứ)", "Réngrán"), ("突然 (Đột nhiên)", "Tūrán"), ("马上 (Ngay lập tức)", "Mǎshàng"), ("特别 (Đặc biệt)", "Tèbié")], 0, "Vẫn kiên trì hoàn thành: 仍然坚持完成.")
    ]
    for idx, (qid, prompt, pinyin, trans, opts, corr, exp) in enumerate(reading):
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk3-mock-01", "part_type": "reading", "part_number": 2,
            "question_number": idx + 13, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": "",
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 8
        })

    # 6 Writing
    writing = [
        {
            "id": "q-hsk3-01-25", "exam_id": "hsk3-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 25, "question_type": "writing_reorder",
            "prompt": "连词成句（把字句）：排列下列词语成句：",
            "pinyin": "Liáncí chéng jù (Bǎ zì jù): Páiliè xiàliè cíyǔ chéng jù:",
            "translation": "Sắp xếp câu chữ 把: Hãy xếp các cụm từ sau thành câu hoàn chỉnh:",
            "words": ["请", "把", "空调", "关上"], "scrambledWords": ["把", "关上", "空调", "请"],
            "correct_order": ["请", "把", "空调", "关上"], "answerKey": ["请", "把", "空调", "关上"],
            "correct_sentence": "请把空调关上。",
            "options": [
                {"text": "请把空调关上。", "pinyin": "Qǐng bǎ kōngtiáo guānshang.", "translation": "Xin hãy tắt điều hòa."},
                {"text": "把空调请关上。", "pinyin": "Bǎ kōngtiáo qǐng guānshang.", "translation": "Sai vị trí từ thỉnh cầu"},
                {"text": "请关上把空调。", "pinyin": "Qǐng guānshang bǎ kōngtiáo.", "translation": "Sai cấu trúc câu chữ 把"}
            ],
            "correct_option_index": 0,
            "explanation": "Cấu trúc câu chữ 把: 主语 (请) + 把 + 宾语 (空调) + 动词及补语 (关上).", "points": 10
        },
        {
            "id": "q-hsk3-01-26", "exam_id": "hsk3-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 26, "question_type": "writing_reorder",
            "prompt": "连词成句（被字句）：排列下列词语成句：",
            "pinyin": "Liáncí chéng jù (Bèi zì jù): Páiliè xiàliè cíyǔ chéng jù:",
            "translation": "Sắp xếp câu bị động chữ 被:",
            "words": ["桌子上的蛋糕", "被", "弟弟", "吃光了"], "scrambledWords": ["被", "吃光了", "桌子上的蛋糕", "弟弟"],
            "correct_order": ["桌子上的蛋糕", "被", "弟弟", "吃光了"], "answerKey": ["桌子上的蛋糕", "被", "弟弟", "吃光了"],
            "correct_sentence": "桌子上的蛋糕被弟弟吃光了。",
            "options": [
                {"text": "桌子上的蛋糕被弟弟吃光了。", "pinyin": "Zhuōzi shang de dàngāo bèi dìdi chīguāng le.", "translation": "Bánh kem trên bàn bị em trai ăn sạch rồi."},
                {"text": "弟弟被桌子上的蛋糕吃光了。", "pinyin": "Dìdi bèi zhuōzi shang de dàngāo chīguāng le.", "translation": "Nghịch nghĩa logic"},
                {"text": "桌子上的蛋糕吃光了被弟弟。", "pinyin": "Zhuōzi shang de dàngāo chīguāng le bèi dìdi.", "translation": "Sai vị trí chữ 被"}
            ],
            "correct_option_index": 0,
            "explanation": "Cấu trúc câu chữ 被: 受事 (桌子上的蛋糕) + 被 + 施事 (弟弟) + 动词补语 (吃光了).", "points": 10
        },
        {
            "id": "q-hsk3-01-27", "exam_id": "hsk3-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 27, "question_type": "writing_reorder",
            "prompt": "连词成句（越...越...句型）：排列词语成句：",
            "pinyin": "Liáncí chéng jù (Yuè...yuè... jùxíng): Páiliè cíyǔ chéng jù:",
            "translation": "Sắp xếp câu cấu trúc 'Càng...càng...':",
            "words": ["雨", "越下", "越大", "了"], "scrambledWords": ["越大", "雨", "了", "越下"],
            "correct_order": ["雨", "越下", "越大", "了"], "answerKey": ["雨", "越下", "越大", "了"],
            "correct_sentence": "雨越下越大了。",
            "options": [
                {"text": "雨越下越大了。", "pinyin": "Yǔ yuè xià yuè dà le.", "translation": "Mưa càng rơi càng to."},
                {"text": "越下雨越大发。", "pinyin": "Yuè xià yǔ yuè dà fā.", "translation": "Sai cấu trúc"},
                {"text": "越大雨越下了。", "pinyin": "Yuè dà yǔ yuè xià le.", "translation": "Lộn trật tự"}
            ],
            "correct_option_index": 0,
            "explanation": "Cấu trúc: 主语 + 越 + 动词 + 越 + 形容词 + 了: 雨越下越大了.", "points": 10
        },
        {
            "id": "q-hsk3-01-28", "exam_id": "hsk3-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 28, "question_type": "writing_reorder",
            "prompt": "连词成句（比较句）：排列词语成句：",
            "pinyin": "Liáncí chéng jù (Bǐjiào jù): Páiliè cíyǔ chéng jù:",
            "translation": "Sắp xếp câu so sánh chữ 比 có bổ ngữ số lượng:",
            "words": ["妹妹", "比", "姐姐", "小两岁"], "scrambledWords": ["姐姐", "比", "小两岁", "妹妹"],
            "correct_order": ["妹妹", "比", "姐姐", "小两岁"], "answerKey": ["妹妹", "比", "姐姐", "小两岁"],
            "correct_sentence": "妹妹比姐姐小两岁。",
            "options": [
                {"text": "妹妹比姐姐小两岁。", "pinyin": "Mèimei bǐ jiějie xiǎo liǎng suì.", "translation": "Em gái nhỏ hơn chị gái 2 tuổi."},
                {"text": "妹妹小两岁比姐姐。", "pinyin": "Mèimei xiǎo liǎng suì bǐ jiějie.", "translation": "Sai trật tự bổ ngữ"},
                {"text": "姐姐比妹妹小两岁。", "pinyin": "Jiějie bǐ mèimei xiǎo liǎng suì.", "translation": "Sai logic gia đình"}
            ],
            "correct_option_index": 0,
            "explanation": "Cấu trúc: A + 比 + B + 形容词 + 数量差: 妹妹比姐姐小两岁.", "points": 10
        },
        {
            "id": "q-hsk3-01-29", "exam_id": "hsk3-mock-01", "part_type": "writing", "part_number": 2,
            "question_number": 29, "question_type": "fill_blank",
            "prompt": "读拼音写汉字：他是我最好的朋[yǒu]______。",
            "pinyin": "Dú pīnyīn xiě hànzì: Tā shì wǒ zuì hǎo de péng[yǒu]______.",
            "translation": "Điền chữ Hán tương ứng với phiên âm [yǒu]: Anh ấy là bạn [yǒu] thân nhất của tôi.",
            "accepted_answers": ["友", "朋友"], "sample_answer": "友",
            "options": [
                {"text": "友 (Bạn)", "pinyin": "yǒu", "translation": "Chữ Hán chính xác trong 朋友"},
                {"text": "有 (Có)", "pinyin": "yǒu", "translation": "Sai nghĩa từ vựng"},
                {"text": "又 (Lại)", "pinyin": "yòu", "translation": "Sai chữ Hán"}
            ],
            "correct_option_index": 0,
            "explanation": "Từ ghép '朋友' (péngyou). Chữ cần điền là '友'.", "points": 10
        },
        {
            "id": "q-hsk3-01-30", "exam_id": "hsk3-mock-01", "part_type": "writing", "part_number": 2,
            "question_number": 30, "question_type": "fill_blank",
            "prompt": "读拼音写汉字：我们明天下午三[diǎn]______在校门口集合。",
            "pinyin": "Dú pīnyīn xiě hànzì: Wǒmen míngtiān xiàwǔ sān [diǎn]______ zài xiàoménkǒu jíhé.",
            "translation": "Điền chữ Hán chỉ thời gian [diǎn]: Chúng ta chiều mai 3 giờ [diǎn] tập trung ở cổng trường.",
            "accepted_answers": ["点"], "sample_answer": "点",
            "options": [
                {"text": "点 (Giờ)", "pinyin": "diǎn", "translation": "Chữ Hán chính xác chỉ giờ giấc"},
                {"text": "电 (Điện)", "pinyin": "diàn", "translation": "Sai nghĩa"},
                {"text": "店 (Tiệm)", "pinyin": "diàn", "translation": "Sai nghĩa"}
            ],
            "correct_option_index": 0,
            "explanation": "Từ chỉ giờ: '点' (diǎn) trong '三点'.", "points": 10
        }
    ]
    questions.extend(writing)
    return questions


def get_hsk4_mock01_questions():
    questions = []
    # 12 Listening
    listening = [
        ("q-hsk4-01-01", "听对话，回答问题（只播放一次）：", "Tīng duìhuà, huídá wèntí:", "Nghe đối thoại (chỉ phát duy nhất 1 lần):", "男：李经理，这是我们部门下季度的广告预算方案，请您过目。女：好的，先放这儿吧，我今天下午仔细看看，明天上午咱们再开会讨论。问：女的打算什么时候开会讨论？", [("Thứ Hai tuần sau (下周一)", "Xià zhōuyī"), ("Sáng mai (明天上午)", "Míngtiān shàngwǔ"), ("Chiều nay (今天下午)", "Jīntiān xiàwǔ")], 1, "Lời thoại người nữ: '明天上午咱们再开会讨论'. Chọn Sáng mai."),
        ("q-hsk4-01-02", "听对话，判断男的对于换工作的态度：", "Tīng duìhuà, pànduàn nán de duìyú huàn gōngzuò de tàidu:", "Nghe đối thoại, phán đoán thái độ về việc đổi chỗ làm:", "女：听说你打算辞职去深圳发展？男：是的，虽然现在这份工作很稳定，但深圳的机会更多，我想趁年轻多去闯一闯。问：男的为什么想去深圳？", [("Muốn tìm thêm nhiều cơ hội thử thách (机会更多，想去闯闯)", "Jīhuì gèng duō..."), ("Vì bị sa thải (被开除)", "Bèi kāichú"), ("Vì không thích đồng nghiệp (不喜欢同事)", "Bù xǐhuan tóngshì")], 0, "Lý do: 深圳的机会更多，想趁年轻多闯一闯."),
        ("q-hsk4-01-03", "听对话，回答租房问题：", "Tīng duìhuà, huídá zūfáng wèntí:", "Nghe đối thoại, chọn thông tin căn hộ cho thuê:", "男：这套两居室一个月租金多少钱？女：押一付三，一个月三千五，包物业费和取暖费。问：租金一个月多少？", [("3500 tệ (三千五百块)", "Sānqiān wǔbǎi kuài"), ("2000 tệ (两千块)", "Liǎngqiān kuài"), ("4000 tệ (四千块)", "Sìqiān kuài")], 0, "Giá thuê: 一个月三千五 (3500 tệ/tháng)."),
        ("q-hsk4-01-04", "听对话，回答关于退换货的问题：", "Tīng duìhuà, huídá guānyú tuìhuànhuò de wèntí:", "Nghe đối thoại, chọn chính sách đổi trả hàng:", "女：先生，如果衣服不合身，七天之内凭小票可以无理由退换。男：好的，那请帮我开一下发票。问：退换货的要求是什么？", [("Trong vòng 7 ngày kèm hóa đơn (七天内凭小票)", "Qī tiān nèi píng xiǎopiào"), ("Trong vòng 1 tháng (一个月内)", "Yí gè yuè nèi"), ("Không được đổi (不能退换)", "Bù néng tuìhuàn")], 0, "Yêu cầu: 七天之内凭小票可以无理由退换."),
        ("q-hsk4-01-05", "听短文，回答问题：", "Tīng duǎnwén, huídá wèntí:", "Nghe đoạn văn ngắn, trả lời câu hỏi:", "现在越来越多的年轻人选择在网络上购买生活日用品。网购不仅价格相对便宜，而且送货上门，极大地方便了忙碌的上班族。问：年轻人喜欢网购的主要原因是什么？", [("Giá rẻ và tiện lợi giao tận nhà (便宜且方便)", "Piányi qiě fāngbiàn"), ("Vì không có tiền (因为没钱)", "Yīnwèi méi qián"), ("Vì không thích đi chơi (不爱出门)", "Bú ài chūmén")], 0, "Ưu điểm nêu trong bài: 价格便宜，送货上门，极大地方便了上班族."),
        ("q-hsk4-01-06", "听短文，回答关于健康的建议：", "Tīng duǎnwén, huídá guānyú jiànkāng de jiànyì:", "Nghe đoạn văn, chọn lời khuyên về bảo vệ mắt:", "长时间面对电脑屏幕会导致眼睛干涩。眼科专家建议，每工作四十五分钟，就应该站起来远眺几分钟，多看绿色的植物，放松眼部肌肉。问：专家建议工作45分钟后应该做什么？", [("Nhìn ra xa và thư giãn mắt (远眺放松眼睛)", "Yuǎntiào fàngsōng yǎnjing"), ("Uống cà phê (喝咖啡)", "Hē kāfēi"), ("Tiếp tục làm việc (继续工作)", "Jìxù gōngzuò")], 0, "Lời khuyên: 每工作四十五分钟，就应该站起来远眺几分钟."),
        ("q-hsk4-01-07", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại dài, trả lời câu hỏi:", "男：王主管，下周五的迎新晚会场地定好了吗？女：学校大礼堂已经被艺术团借用了，我们临时改在学生活动中心三楼多功能厅。问：迎新晚会最终改在哪个地点举行？", [("Hội trường đa năng tầng 3 trung tâm sinh viên (活动中心三楼多功能厅)", "Huódòng zhōngxīn sān lóu..."), ("Lễ đường trường (大礼堂)", "Dà lǐtáng"), ("Sân bóng đá (足球场)", "Zúqiú chǎng")], 0, "Địa điểm đổi sang: 学生活动中心三楼多功能厅."),
        ("q-hsk4-01-08", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại dài, trả lời câu hỏi:", "女：张教授，您对于当下青年人的创业热潮怎么看？男：创业需要热情，但更需要充分的市场调研和风险意识，盲目跟风往往会导致失败。问：张教授认为创业最不可取的心态是什么？", [("Chạy theo phong trào mù quáng (盲目跟风)", "Mángmù gēnfēng"), ("Thiếu vốn (缺少资金)", "Quēshǎo zījīn"), ("Không có bằng cấp (没有学历)", "Méiyǒu xuélì")], 0, "Giáo sư Trương cảnh báo: 盲目跟风往往会导致失败."),
        ("q-hsk4-01-09", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại, trả lời câu hỏi:", "男：小周，你最近的销售业绩非常突出，公司决定提前给你转正。女：太感谢您了陈总，我一定再接再厉，不辜负大家的期望！问：小周获得了什么奖励？", [("Được ký hợp đồng chính thức trước hạn (提前转正)", "Tíqián zhuǎnzhèng"), ("Được tặng xe hơi (发汽车)", "Fā qìchē"), ("Được đi du lịch châu Âu (去欧洲旅游)", "Qù Ōuzhōu lǚyóu")], 0, "Quyết định của công ty: 提前给你转正."),
        ("q-hsk4-01-10", "听短文，回答问题：", "Tīng duǎnwén, huídá wèntí:", "Nghe đoạn văn, trả lời câu hỏi:", "著名作家老舍曾经说过，生活是一本永远读不完的大书。只有深入观察生活中的点点滴滴，才能写出真正打动人心的优秀文学作品。问：文学创作怎样才能打动人心？", [("Quan sát sâu sắc từng chi tiết cuộc sống (深入观察生活)", "Shēnrù guānchá shēnghuó"), ("Chép sách của người khác (抄袭别人)", "Chāoxí biérén"), ("Chỉ tưởng tượng trong phòng (闭门造车)", "Bìmén zàochē")], 0, "Chìa khóa: 深入观察生活中的点点滴滴."),
        ("q-hsk4-01-11", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại, trả lời câu hỏi:", "女：这台空气净化器的噪音大不大？男：它采用了静音技术，睡眠模式下只有不到三十分贝，完全不会影响休息。问：这台机器的特点是什么？", [("Vận hành cực êm ái (非常安静/静音)", "Fēicháng ānjìng/jìngyīn"), ("Tiêu tốn điện (费电)", "Fèi diàn"), ("Kích thước to lớn (体积很大)", "Tǐjī hěn dà")], 0, "Đặc điểm: 采用了静音技术，不会影响休息."),
        ("q-hsk4-01-12", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại, trả lời câu hỏi:", "男：听说这次国际马拉松比赛有三万人参加？女：是的，不仅有来自各国的专业选手，还有许多业余长跑爱好者。问：关于这项比赛哪项正确？", [("Hàng vạn người thuộc nhiều lứa tuổi tham gia (规模盛大/选手众多)", "Guīmó shèngdà"), ("Chỉ có vận động viên chuyên nghiệp (只有专业选手)", "Zhǐyǒu zhuānyè xuǎnshǒu"), ("Bị hoãn thi (推迟举行)", "Tuīchí jǔxíng")], 0, "Có 3 vạn người cả chuyên nghiệp lẫn nghiệp dư: 规模盛大/选手众多.")
    ]
    for idx, (qid, prompt, pinyin, trans, script, opts, corr, exp) in enumerate(listening):
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk4-mock-01", "part_type": "listening", "part_number": 1 if idx < 6 else 2,
            "question_number": idx + 1, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": script,
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 8
        })

    # 12 Reading
    reading = [
        ("q-hsk4-01-13", "选词填空：无论遇到多大的困难，我们都不能轻易______放弃。", "Xuǎncí tiánkòng: Wúlùn yùdào duō dà de kùnnan, wǒmen dōu bù néng qīngyì ______ fàngqì.", "Điền phó từ liên kết: Bất luận gặp khó khăn lớn đến đâu, chúng ta đều không thể dễ dàng từ bỏ.", [("选择 (Lựa chọn)", "Xuǎnzé"), ("故意 (Cố ý)", "Gùyì"), ("随便 (Tùy tiện)", "Suíbiàn"), ("后悔 (Hối hận)", "Hòuhuǐ")], 0, "Ngữ pháp: 选择放弃 (lựa chọn từ bỏ)."),
        ("q-hsk4-01-14", "选词填空：人与人之间的沟通，最重要的是互相尊重和______理解。", "Xuǎncí tiánkòng: Rén yǔ rén zhījiān de gōutōng, zuì zhòngyào de shì hùxiāng zūnzhòng hé ______ lǐjiě.", "Chọn phó từ biểu thị tính tương hỗ:", [("彼此 (Lẫn nhau / Đôi bên)", "Bǐcǐ"), ("到处 (Khắp nơi)", "Dàochù"), ("平时 (Bình thường)", "Píngshí"), ("暂时 (Tạm thời)", "Zànshí")], 0, "Cụm cố định: 互相尊重和彼此理解."),
        ("q-hsk4-01-15", "选词填空：尽管这次比赛没有拿到冠军，但我们积累了宝贵的______。", "Xuǎncí tiánkòng: Jǐnguǎn zhè cì bǐsài méiyǒu nádào guànjūn, dàn wǒmen jīlěi le bǎoguì de ______.", "Điền danh từ kết hợp với 积累 (tích lũy):", [("经验 (Kinh nghiệm)", "Jīngyàn"), ("价格 (Giá cả)", "Jiàgé"), ("气候 (Khí hậu)", "Qìhòu"), ("交通 (Giao thông)", "Jiāotōng")], 0, "Cụm danh từ: 积累了宝贵的经验."),
        ("q-hsk4-01-16", "选词填空：这篇学术论文逻辑严密，具有很高的参考______。", "Xuǎncí tiánkòng: Zhè piān xuéshù lùnwén luójí yánmì, jùyǒu hěn gāo de cānkǎo ______.", "Chọn danh từ kết hợp với 参考 (tham khảo):", [("价值 (Giá trị)", "Jiàzhí"), ("速度 (Tốc độ)", "Sùdù"), ("温度 (Nhiệt độ)", "Wēndù"), ("态度 (Thái độ)", "Tàidu")], 0, "Cụm danh từ: 参考价值.")
    ]
    for idx, (qid, prompt, pinyin, trans, opts, corr, exp) in enumerate(reading):
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk4-mock-01", "part_type": "reading", "part_number": 1,
            "question_number": idx + 13, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": "",
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 8
        })

    # 4 sentence_order_abc
    order_abc = [
        {
            "id": "q-hsk4-01-17", "exam_id": "hsk4-mock-01", "part_type": "reading", "part_number": 2,
            "question_number": 17, "question_type": "sentence_order_abc",
            "prompt": "阅读下列三个句子，排列出最连贯合理的顺序（A-B-C）：",
            "pinyin": "Yuèdú xiàliè sān gè jùzi, páiliè chū zuì liánguàn hélǐ de shùnxù:",
            "translation": "Đọc 3 mệnh đề sau và sắp xếp theo trình tự mạch lạc logic:",
            "propositions": {
                "A": "因而赢得了广大消费者的高度信赖。",
                "B": "不仅注重科技创新与功能完善，",
                "C": "这家企业在产品研发过程中，"
            },
            "options": [
                {"text": "C - B - A", "pinyin": "C - B - A", "translation": "Thứ tự chuẩn logic: Chủ ngữ (C) + Hành động tăng tiến (B) + Kết quả (A)"},
                {"text": "B - A - C", "pinyin": "B - A - C", "translation": "Sai trật tự chủ ngữ"},
                {"text": "A - C - B", "pinyin": "A - C - B", "translation": "Đảo ngược nhân quả"}
            ],
            "correct_option_index": 0,
            "explanation": "Câu C nêu chủ ngữ (这家企业...), câu B nêu quá trình nỗ lực (不仅注重...), câu A là kết quả dẫn xuất (因而赢得...). Trình tự logic: C - B - A.", "points": 8
        },
        {
            "id": "q-hsk4-01-18", "exam_id": "hsk4-mock-01", "part_type": "reading", "part_number": 2,
            "question_number": 18, "question_type": "sentence_order_abc",
            "prompt": "排列顺序（A-B-C）：",
            "pinyin": "Páiliè shùnxù:",
            "translation": "Sắp xếp 3 câu theo thứ tự mạch lạc:",
            "propositions": {
                "A": "但是如果不坚持经常运动，",
                "B": "跑步是一项简单且成本较低的锻炼方式，",
                "C": "就很难达到理想的健身效果。"
            },
            "options": [
                {"text": "B - A - C", "pinyin": "B - A - C", "translation": "Đúng trật tự: Khái quát (B) -> Chuyển ý giả thiết (A) -> Hậu quả (C)"},
                {"text": "A - B - C", "pinyin": "A - B - C", "translation": "Sai vị trí liên từ chuyển tiếp"},
                {"text": "C - B - A", "pinyin": "C - B - A", "translation": "Lộn ngược trật tự"}
            ],
            "correct_option_index": 0,
            "explanation": "Câu B giới thiệu môn chạy bộ, câu A chuyển tiếp nhượng bộ (但是如果...), câu C nêu kết quả điều kiện (就很难...). Trình tự chuẩn: B - A - C.", "points": 8
        },
        {
            "id": "q-hsk4-01-19", "exam_id": "hsk4-mock-01", "part_type": "reading", "part_number": 2,
            "question_number": 19, "question_type": "sentence_order_abc",
            "prompt": "排列顺序（A-B-C）：",
            "pinyin": "Páiliè shùnxù:",
            "translation": "Sắp xếp 3 câu theo thứ tự mạch lạc:",
            "propositions": {
                "A": "甚至影响到了日常的睡眠质量，",
                "B": "他最近工作压力特别大，",
                "C": "整个人显得十分疲倦。"
            },
            "options": [
                {"text": "B - A - C", "pinyin": "B - A - C", "translation": "Trật tự mạch lạc: Nguyên nhân áp lực (B) -> Ảnh hưởng giấc ngủ (A) -> Hệ quả ngoại hình (C)"},
                {"text": "C - A - B", "pinyin": "C - A - B", "translation": "Sai logic nhân quả"},
                {"text": "A - B - C", "pinyin": "A - B - C", "translation": "Sai vị trí liên từ tăng tiến '甚至'"}
            ],
            "correct_option_index": 0,
            "explanation": "B nêu hoàn cảnh nguyên nhân (工作压力大), A tăng tiến tác hại (甚至影响睡眠), C kết luận hiện trạng (整个人显得疲倦). Thứ tự: B - A - C.", "points": 8
        },
        {
            "id": "q-hsk4-01-20", "exam_id": "hsk4-mock-01", "part_type": "reading", "part_number": 2,
            "question_number": 20, "question_type": "sentence_order_abc",
            "prompt": "排列顺序（A-B-C）：",
            "pinyin": "Páiliè shùnxù:",
            "translation": "Sắp xếp 3 câu theo thứ tự mạch lạc:",
            "propositions": {
                "A": "从而提高我们面对困难时的抗压能力。",
                "B": "阅读优秀的文学传记作品，",
                "C": "可以让我们从名人的奋斗经历中获得启发，"
            },
            "options": [
                {"text": "B - C - A", "pinyin": "B - C - A", "translation": "Trật tự chuẩn: Hành động đọc (B) -> Thu hoạch cảm hứng (C) -> Nâng cao năng lực (A)"},
                {"text": "A - B - C", "pinyin": "A - B - C", "translation": "Đảo ngược mục đích"},
                {"text": "C - B - A", "pinyin": "C - B - A", "translation": "Thiếu chủ ngữ mở đầu"}
            ],
            "correct_option_index": 0,
            "explanation": "B là chủ ngữ/hành động (阅读传记作品), C là tác dụng trực tiếp (可以获得启发), A là kết quả lâu dài (从而提高能力). Thứ tự: B - C - A.", "points": 8
        }
    ]
    questions.extend(order_abc)

    # 4 Reading passages
    passages = [
        ("q-hsk4-01-21", "阅读短文回答问题：[心理学研究表明，微笑不仅能表达善意，还能反过来改善人们的心情。当你感到沮丧时，强迫自己微笑三十秒，大脑也会分泌让人感到快乐的物质。] 问：这段话主要告诉我们什么？", "Yuèdú duǎnwén huídá wèntí:", "Đọc đoạn văn ngắn, chọn ý chính:", [("Nụ cười có thể giúp cải thiện tâm trạng (微笑能改善心情)", "Wēixiào néng gǎishàn xīnqíng"), ("Mỉm cười rất mệt mỏi (微笑很累)", "Wēixiào hěn lèi"), ("Không nên mỉm cười với người lạ (不要对陌生人微笑)", "Bú yào duì mòshēngrén wēixiào")], 0, "Trọng tâm: 微笑能反过来改善人们的心情."),
        ("q-hsk4-01-22", "阅读短文回答问题：[环保不仅是政府和企业的责任，更与每个普通人的生活息息相关。少用一个塑料袋，多乘一次公共交通，都是在为保护地球贡献力量。] 问：关于环境保护，作者强调了什么？", "Yuèdú duǎnwén huídá wèntí:", "Đọc hiểu: Tác giả nhấn mạnh điều gì về bảo vệ môi trường?", [("Mỗi cá nhân đều có thể hành động từ việc nhỏ (每个人从小事做起)", "Měi gèrén cóng xiǎoshì zuòqǐ"), ("Chỉ chính phủ mới giải quyết được (只有政府能解决)", "Zhǐyǒu zhèngfǔ néng jiějué"), ("Bảo vệ môi trường rất tốn kém (环保很费钱)", "Huánbǎo hěn fèiqián")], 0, "Nhấn mạnh: 与每个普通人息息相关，从小事贡献力量."),
        ("q-hsk4-01-23", "阅读短文回答问题：[现代职场中，终身学习已经成为一种必然趋势。科技的飞速发展使得许多传统岗位被替代，只有不断更新知识结构，才能保持长久的竞争力。] 问：怎样才能在职场保持长久竞争力？", "Yuèdú duǎnwén huídá wèntí:", "Đọc hiểu: Làm thế nào để giữ vững năng lực cạnh tranh trong sự nghiệp?", [("Không ngừng học tập và cập nhật kiến thức (不断更新知识/终身学习)", "Búduàn gēngxīn zhīshi..."), ("Chỉ làm một công việc cố định (只做一份工作)", "Zhǐ zuò yí fèn gōngzuò"), ("Từ chối dùng công nghệ (不用新技术)", "Bù yòng xīn jìshù")], 0, "Đáp án trong bài: 只有不断更新知识结构，才能保持竞争力."),
        ("q-hsk4-01-24", "阅读短文回答问题：[中国茶文化源远流长。喝茶不仅是一种解渴的生活习惯，更是一种品味人生、静心修性的艺术享受。] 问：关于中国茶文化，下列说法正确的是：", "Yuèdú duǎnwén huídá wèntí:", "Đọc hiểu: Nhận định nào đúng về văn hóa trà Trung Hoa?", [("Vừa đáp ứng nhu cầu sinh hoạt vừa mang giá trị tinh thần (既解渴又有精神享受)", "Jì jiěkě yòu yǒu jīngshén xiǎngshòu"), ("Chỉ có tác dụng chữa bệnh (只能治病)", "Zhǐ néng zhìbìng"), ("Mới xuất hiện gần đây (刚出现不久)", "Gāng chūxiàn bù jiǔ")], 0, "Bài viết: 不仅是解渴习惯，更是一种静心修性的艺术享受.")
    ]
    for idx, (qid, prompt, pinyin, trans, opts, corr, exp) in enumerate(passages):
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk4-mock-01", "part_type": "reading", "part_number": 3,
            "question_number": idx + 21, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": "",
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 8
        })

    # 6 Writing
    writing = [
        {
            "id": "q-hsk4-01-25", "exam_id": "hsk4-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 25, "question_type": "writing_reorder",
            "prompt": "连词成句（把字句复杂结构）：排列词语成句：",
            "pinyin": "Liáncí chéng jù (Bǎ zì jù): Páiliè cíyǔ chéng jù:",
            "translation": "Phần Viết HSK 4: Sắp xếp các cụm từ sau thành câu chữ 把 hoàn chỉnh:",
            "words": ["请把", "寄到", "这份文件", "北京分公司"], "scrambledWords": ["这份文件", "请把", "北京分公司", "寄到"],
            "correct_order": ["请把", "这份文件", "寄到", "北京分公司"], "answerKey": ["请把", "这份文件", "寄到", "北京分公司"],
            "correct_sentence": "请把这份文件寄到北京分公司。",
            "options": [
                {"text": "请把这份文件寄到北京分公司。", "pinyin": "Qǐng bǎ zhè fèn wénjiàn jì dào Běijīng fēn gōngsī.", "translation": "Xin hãy gửi tập tài liệu này đến chi nhánh Bắc Kinh."},
                {"text": "请寄到这份文件把北京分公司。", "pinyin": "Qǐng jì dào...", "translation": "Sai cấu trúc câu chữ 把"},
                {"text": "北京分公司请把这份文件寄到。", "pinyin": "Běijīng fēn gōngsī...", "translation": "Đảo ngữ sai chủ thể"}
            ],
            "correct_option_index": 0,
            "explanation": "Cấu trúc câu chữ 把 kết hợp động từ chỉ hướng: 主语 (请) + 把 + 宾语 (这份文件) + 动词 + 到 + 地点 (寄到北京分公司).", "points": 10
        },
        {
            "id": "q-hsk4-01-26", "exam_id": "hsk4-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 26, "question_type": "writing_reorder",
            "prompt": "连词成句（被字句复杂结构）：排列词语成句：",
            "pinyin": "Liáncí chéng jù (Bèi zì jù): Páiliè cíyǔ chéng jù:",
            "translation": "Sắp xếp câu bị động chữ 被 có bổ ngữ thời lượng:",
            "words": ["这次会议", "推迟了", "被", "一个小时"], "scrambledWords": ["一个小时", "被", "这次会议", "推迟了"],
            "correct_order": ["这次会议", "被", "推迟了", "一个小时"], "answerKey": ["这次会议", "被", "推迟了", "一个小时"],
            "correct_sentence": "这次会议被推迟了一个小时。",
            "options": [
                {"text": "这次会议被推迟了一个小时。", "pinyin": "Zhè cì huìyì bèi tuīchí le yí gè xiǎoshí.", "translation": "Cuộc họp lần này bị hoãn lại một tiếng đồng hồ."},
                {"text": "一个小时被这次会议推迟了。", "pinyin": "Yí gè xiǎoshí bèi zhè cì huìyì tuīchí le.", "translation": "Lộn tân ngữ và chủ ngữ"},
                {"text": "这次会议推迟了一个小时被。", "pinyin": "Zhè cì huìyì tuīchí le...", "translation": "Đặt sai chữ 被"}
            ],
            "correct_option_index": 0,
            "explanation": "Cấu trúc: 主语 (这次会议) + 被 + 动词 + 时量补语 (推迟了一个小时).", "points": 10
        },
        {
            "id": "q-hsk4-01-27", "exam_id": "hsk4-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 27, "question_type": "writing_reorder",
            "prompt": "连词成句（不仅...而且...递进复句）：排列词语成句：",
            "pinyin": "Liáncí chéng jù (Bùjǐn...érqiě...): Páiliè cíyǔ chéng jù:",
            "translation": "Sắp xếp câu phức tăng tiến 不仅...而且...:",
            "words": ["他不仅", "工作认真", "而且", "非常乐于助人"], "scrambledWords": ["非常乐于助人", "而且", "工作认真", "他不仅"],
            "correct_order": ["他不仅", "工作认真", "而且", "非常乐于助人"], "answerKey": ["他不仅", "工作认真", "而且", "非常乐于助人"],
            "correct_sentence": "他不仅工作认真，而且非常乐于助人。",
            "options": [
                {"text": "他不仅工作认真，而且非常乐于助人。", "pinyin": "Tā bùjǐn gōngzuò rènzhēn, érqiě fēicháng lèyú zhùrén.", "translation": "Anh ấy không chỉ làm việc nghiêm túc, mà còn rất thích giúp đỡ người khác."},
                {"text": "而且他工作认真，不仅非常乐于助人。", "pinyin": "Érqiě tā gōngzuò rènzhēn...", "translation": "Sai vị trí liên từ"},
                {"text": "他工作认真不仅，而且非常乐于助人。", "pinyin": "Tā gōngzuò rènzhēn bùjǐn...", "translation": "Sai trật tự liên từ"}
            ],
            "correct_option_index": 0,
            "explanation": "Cặp liên từ tăng tiến: 主语 + 不仅 + Vế 1, 而且 + Vế 2.", "points": 10
        },
        {
            "id": "q-hsk4-01-28", "exam_id": "hsk4-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 28, "question_type": "writing_reorder",
            "prompt": "连词成句（条件复句无论...都...）：排列词语成句：",
            "pinyin": "Liáncí chéng jù (Wúlùn...dōu...): Páiliè cíyǔ chéng jù:",
            "translation": "Sắp xếp câu điều kiện vô điều kiện 无论...都...:",
            "words": ["无论天气多么恶劣", "他都", "准时到达", "训练场"], "scrambledWords": ["训练场", "无论天气多么恶劣", "准时到达", "他都"],
            "correct_order": ["无论天气多么恶劣", "他都", "准时到达", "训练场"], "answerKey": ["无论天气多么恶劣", "他都", "准时到达", "训练场"],
            "correct_sentence": "无论天气多么恶劣，他都准时到达训练场。",
            "options": [
                {"text": "无论天气多么恶劣，他都准时到达训练场。", "pinyin": "Wúlùn tiānqì duōme èliè, tā dōu zhǔnshí dàodá xùnliànchǎng.", "translation": "Bất kể thời tiết khắc nghiệt thế nào, anh ấy đều đến sân tập đúng giờ."},
                {"text": "他都无论天气多么恶劣，准时到达训练场。", "pinyin": "Tā dōu wúlùn tiānqì...", "translation": "Đặt sai phó từ 都"},
                {"text": "准时到达训练场，无论天气多么恶劣他都。", "pinyin": "Zhǔnshí dàodá...", "translation": "Lộn vế câu"}
            ],
            "correct_option_index": 0,
            "explanation": "Cấu trúc: 无论 + 条件, 主语 + 都 + 结果/行为.", "points": 10
        },
        {
            "id": "q-hsk4-01-29", "exam_id": "hsk4-mock-01", "part_type": "writing", "part_number": 2,
            "question_number": 29, "question_type": "free_writing",
            "prompt": "看图并用所给词语写一个句子：[弹钢琴] (Đàn piano)",
            "pinyin": "Kàn tú bìng yòng suǒ gěi cíyǔ xiě yí gè jùzi: [tán gāngqín]",
            "translation": "Phần Viết tự luận HSK 4: Viết một câu hoàn chỉnh có chứa từ bắt buộc [弹钢琴 - Đánh đàn piano]:",
            "required_words": ["弹钢琴"], "min_words": 6, "max_words": 30,
            "sample_answer": "妹妹每天晚上都在客厅认真地弹钢琴。",
            "writing_criteria": [
                "Bắt buộc chứa từ khóa '弹钢琴'",
                "Câu đúng ngữ pháp tiếng Trung, có chủ ngữ, vị ngữ",
                "Độ dài từ 6 đến 30 chữ Hán"
            ],
            "points": 10,
            "explanation": "Gợi ý câu mẫu: 妹妹每天晚上都在客厅认真地弹钢琴。"
        },
        {
            "id": "q-hsk4-01-30", "exam_id": "hsk4-mock-01", "part_type": "writing", "part_number": 2,
            "question_number": 30, "question_type": "free_writing",
            "prompt": "看图并用所给词语写一个句子：[流利] (Lưu loát)",
            "pinyin": "Kàn tú bìng yòng suǒ gěi cíyǔ xiě yí gè jùzi: [liúlì]",
            "translation": "Phần Viết tự luận HSK 4: Viết một câu có chứa từ [流利 - Lưu loát/Trôi chảy]:",
            "required_words": ["流利"], "min_words": 6, "max_words": 30,
            "sample_answer": "在中国留学两年后，大卫能说一口流利的普通话。",
            "writing_criteria": [
                "Bắt buộc chứa từ tính từ '流利'",
                "Câu có cấu trúc ngữ pháp hoàn chỉnh",
                "Độ dài từ 6 đến 30 chữ Hán"
            ],
            "points": 10,
            "explanation": "Gợi ý câu mẫu: 在中国留学两年后，大卫能说一口流利的普通话。"
        }
    ]
    questions.extend(writing)
    return questions


def get_hsk5_mock01_questions():
    questions = []
    # 5 Listening
    listening = [
        ("q-hsk5-01-01", "听长对话，分析商务谈判核心焦点（听力第一部分）：", "Tīng cháng duìhuà, fēnxī shāngwù tánpàn...", "Nghe hội thoại dài, phân tích trọng tâm đàm phán thương mại:", "女：关于这次设备的交货期，如果贵方能在下个月底前全部交付，我们可以同意预付40%的货款。男：下个月底时间确实非常紧张，不过为了双方的长远合作，我们工厂可以安排加班赶工，尽最大努力满足贵方的需求。问：男方的最终态度是什么？", [("Khắc phục khó khăn để hoàn thành giao hàng đúng hạn (加班赶工满足需求)", "Jiābān gǎngōng..."), ("Từ chối đàm phán (拒绝谈判)", "Jùjué tánpàn"), ("Đòi tăng giá (要求提价)", "Yāoqiú tíjià")], 0, "Đại diện bên nam thể hiện thiện chí: 工厂可以安排加班赶工，尽最大努力满足需求."),
        ("q-hsk5-01-02", "听学术讲座片段，选择主旨：", "Tīng xuéshù jiǎngzuò piànduàn, xuǎnzé zhǔzhǐ:", "Nghe đoạn thuyết trình học thuật, chọn chủ đề chính:", "在人工智能迅速发展的背景下，跨学科复合型人才的需求呈现爆发式增长。未来的教育不仅要注重专业技能的传授，更要培养学生的批判性思维和终身学习能力。问：讲座强调未来教育的核心是什么？", [("Bồi dưỡng tư duy phản biện và năng lực học tập suốt đời (培养批判性思维与终身学习能力)", "Péiyǎng pīpànxìng sīwéi..."), ("Chỉ dạy lập trình (只学编程)", "Zhǐ xué biānchéng"), ("Cắt giảm môn xã hội (取消人文课程)", "Qūxiāo rénwén kèchéng")], 0, "Trọng tâm bài giảng: 培养批判性思维和终身学习能力."),
        ("q-hsk5-01-03", "听新闻报道，提取核心事实：", "Tīng xīnwén bàodào, tíqǔ héxīn shìshí:", "Nghe bản tin thời sự, trích xuất sự kiện cốt lõi:", "国家统计局今天发布数据显示，今年前三季度高技术制造业投资同比增长12.5%，绿色低碳转型步伐加快，展现了宏观经济强大的韧性与活力。问：这组数据主要反映了什么？", [("Sự chuyển đổi xanh và sức bật dẻo dai của nền kinh tế (经济韧性与高质量转型)", "Jīngjì rènxìng..."), ("Kinh tế đình đốn (经济衰退)", "Jīngjì shuāituì"), ("Đầu tư sụt giảm (投资下降)", "Tóuzī xiàjiàng")], 0, "Bản tin phản ánh: 宏观经济强大的韧性与活力，绿色转型步伐加快."),
        ("q-hsk5-01-04", "听对话，回答关于职场心理的问题：", "Tīng duìhuà, huídá guānyú zhíchǎng xīnlǐ de wèntí:", "Nghe đối thoại, phân tích giải pháp tâm lý nơi công sở:", "男：我最近感觉遭遇了职业瓶颈期，无论怎么做都没有成就感。女：这种心态很普遍，不妨把大目标拆解成每天可执行的微习惯，同时多与导师沟通，往往能找到新的突破口。问：女的提出了什么建议？", [("Chia nhỏ mục tiêu và tham khảo ý kiến người hướng dẫn (拆解目标并与导师沟通)", "Chāijiě mùbiāo..."), ("Nghỉ việc ngay (马上辞职)", "Mǎshàng cízhí"), ("Lơ là công việc (放弃努力)", "Fàngqì nǔlì")], 0, "Lời khuyên: 把大目标拆解成可执行的微习惯，多与导师沟通."),
        ("q-hsk5-01-05", "听文化访谈，回答问题：", "Tīng wénhuà fǎngtán, huídá wèntí:", "Nghe phỏng vấn văn hóa, trả lời câu hỏi:", "记者：您创作历史长篇小说的灵感通常来自哪里？作家：大部分来源于浩瀚的民间史料和方志。正史记载的是帝王将相，而民间叙事里才蕴藏着鲜活的人间烟火与生命温度。问：作家最珍视的创作灵感源泉是什么？", [("Tư liệu lịch sử dân gian và ký ức nhân gian (民间史料与人间烟火)", "Mínjiān shǐliào..."), ("Sách giáo khoa (教科书)", "Jiàokēshū"), ("Phim nước ngoài (外国电影)", "Wàiguó diànyǐng")], 0, "Nhà văn nhấn mạnh: 民间史料和方志，蕴藏着人间烟火与生命温度.")
    ]
    for idx, (qid, prompt, pinyin, trans, script, opts, corr, exp) in enumerate(listening):
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk5-mock-01", "part_type": "listening", "part_number": 1,
            "question_number": idx + 1, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": script,
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 10
        })

    # 5 Reading
    reading = [
        ("q-hsk5-01-06", "选词填空（语篇填空）：随着城镇化进程的加速，传统古村落的保护面临着严峻的______。如何在现代化开发与文化遗产保留之间找到平衡点，是摆在城市规划者面前的重要课题。", "Xuǎncí tiánkòng: Suízhe chéngzhènhuà jìnchéng...", "Điền danh từ kết hợp với 面临严峻的... (Đối mặt với...nghiêm trọng):", [("考验 (Thử thách / Khảo nghiệm)", "Kǎoyàn"), ("待遇 (Đãi ngộ)", "Dàiyù"), ("借口 (Cớ / Viện cớ)", "Jièkǒu"), ("比例 (Tỷ lệ)", "Bǐlì")], 0, "Cụm danh từ cao cấp HSK 5: 面临严峻的考验 (đối mặt với thử thách cam go)."),
        ("q-hsk5-01-07", "阅读理解：[中国成语‘居安思危’出自《左传》，意思是处在平安稳定的环境中，也要随时提防可能出现的危险与灾害。这种具有前瞻性的忧患意识，深刻影响了中华民族的处世哲学与治理智慧。] 问：‘居安思危’的核心哲学思想是什么？", "Yuèdú lǐjiě: Wèn: 'Jū'ānsīwēi' de héxīn zhéxué...", "Đọc hiểu: Tư tưởng cốt lõi của thành ngữ 'Cư an tư nguy' là gì?", [("Lúc yên bình cũng phải phòng xa hiểm họa (处在平安中也要提防危险)", "Chǔ zài píng'ān..."), ("Chỉ lo lắng khi tai họa ập đến (临渴掘井)", "Línkě juéjǐng"), ("Không cần nghĩ đến tương lai (得过且过)", "Déguò qiěguò")], 0, "Ý nghĩa thành ngữ: 处在平安环境中也要随时提防可能的危机."),
        ("q-hsk5-01-08", "选词填空：科研工作是一项艰苦卓绝的探索，绝非一朝一夕之功，需要科学家耐得住寂寞，经过______的积累方能有所突破。", "Xuǎncí tiánkòng: Kēyán gōngzuò...", "Chọn thành ngữ 4 chữ thích hợp chỉ quá trình tích lũy lâu dài từng bước:", [("循序渐进 (Tuần tự tiệm tiến - Theo thứ tự từng bước một)", "Xúnxù jiànjìn"), ("急功近利 (Hám lợi trước mắt)", "Jígōng jìnlì"), ("粗枝大叶 (Cẩu thả qua loa)", "Cūzhī dàyè"), ("半途而废 (Bỏ dở nửa chừng)", "Bàntú érfèi")], 0, "Thành ngữ '循序渐进' (từng bước vững chắc có thứ tự) là chuẩn xác nhất."),
        ("q-hsk5-01-09", "阅读理解：[生态系统的生物多样性是地球生命支持系统的基石。一个物种的灭绝往往会引发食物链的多米诺骨牌效应，最终危及整个生物圈的稳定。因此，保护野生动植物栖息地刻不容缓。] 问：作者通过‘多米诺骨牌效应’说明了什么？", "Yuèdú lǐjiě: Wèn: Zuòzhě shuōmíng le shénme?", "Đọc hiểu: Tác giả muốn chứng minh điều gì qua hiệu ứng Domino?", [("Sự liên đới mật thiết giữa các mắt xích sinh thái (物种灭绝会引发连锁危机)", "Wùzhǒng mièjué huì yǐnfā liánsuǒ wēijī"), ("Các loài vật không liên quan nhau (物种毫无关系)", "Wùzhǒng háo wú guānxì"), ("Đa dạng sinh học không quan trọng (多样性不重要)", "Duōyàngxìng bù zhòngyào")], 0, "Một loài biến mất gây phản ứng dây chuyền làm sụp đổ hệ sinh thái."),
        ("q-hsk5-01-10", "选词填空：面对复杂多变的国际经济形势，我国企业必须加快核心技术自主创新步伐，避免关键零部件受制于人的______局面。", "Xuǎncí tiánkòng: Miànduì fùzá duōbiàn...", "Chọn tính từ chỉ tình thế bế tắc, bị động:", [("被动 (Bị động / Yếu thế)", "Bèidòng"), ("灵活 (Linh hoạt)", "Línghuó"), ("主动 (Chủ động)", "Zhǔdòng"), ("乐观 (Lạc quan)", "Lèguān")], 0, "Cụm từ: 受制于人的被动局面 (cục diện bị động lệ thuộc người khác).")
    ]
    for idx, (qid, prompt, pinyin, trans, opts, corr, exp) in enumerate(reading):
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk5-mock-01", "part_type": "reading", "part_number": 2,
            "question_number": idx + 6, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": "",
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 10
        })

    # 5 Writing
    writing = [
        {
            "id": "q-hsk5-01-11", "exam_id": "hsk5-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 11, "question_type": "writing_reorder",
            "prompt": "连词成句（HSK 5 书写第一部分）：排列词语成句：",
            "pinyin": "Liáncí chéng jù: Páiliè cíyǔ chéng jù:",
            "translation": "Phần Viết HSK 5: Sắp xếp các cụm từ sau thành nhận định học thuật hoàn chỉnh:",
            "words": ["这项重大科学实验", "耗费了团队", "三年的心血", "整整"],
            "scrambledWords": ["整整", "这项重大科学实验", "三年的心血", "耗费了团队"],
            "correct_order": ["这项重大科学实验", "耗费了团队", "整整", "三年的心血"],
            "answerKey": ["这项重大科学实验", "耗费了团队", "整整", "三年的心血"],
            "correct_sentence": "这项重大科学实验耗费了团队整整三年的心血。",
            "options": [
                {"text": "这项重大科学实验耗费了团队整整三年的心血。", "pinyin": "Zhè xiàng zhòngdà kēxué shíyàn hàofèi le tuánduì zhěngzhěng sān nián de xīnxuè.", "translation": "Thí nghiệm khoa học trọng đại này đã tiêu tốn tròn ba năm tâm huyết của cả đội ngũ."},
                {"text": "整整三年的心血这项重大科学实验耗费了团队。", "pinyin": "Zhěngzhěng sān nián de xīnxuè...", "translation": "Lộn tân ngữ lên đầu sai ngữ pháp"},
                {"text": "这项重大科学实验整整耗费了三年的心血团队。", "pinyin": "Zhè xiàng zhòngdà...", "translation": "Đặt sai vị trí bổ ngữ gián tiếp"}
            ],
            "correct_option_index": 0,
            "explanation": "Cấu trúc: 主语 (这项重大科学实验) + 谓语动词 (耗费了) + 间接宾语 (团队) + 数量定语 (整整三年的) + 核心宾语 (心血).", "points": 10
        },
        {
            "id": "q-hsk5-01-12", "exam_id": "hsk5-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 12, "question_type": "writing_reorder",
            "prompt": "连词成句：排列词语成句：",
            "pinyin": "Liáncí chéng jù: Páiliè cíyǔ chéng jù:",
            "translation": "Sắp xếp câu phức liên từ 从而 (từ đó):",
            "words": ["合理的运动作息", "能够提高免疫力", "从而", "有效抵御外界病毒"],
            "scrambledWords": ["有效抵御外界病毒", "合理的运动作息", "从而", "能够提高免疫力"],
            "correct_order": ["合理的运动作息", "能够提高免疫力", "从而", "有效抵御外界病毒"],
            "answerKey": ["合理的运动作息", "能够提高免疫力", "从而", "有效抵御外界病毒"],
            "correct_sentence": "合理的运动作息能够提高免疫力，从而有效抵御外界病毒。",
            "options": [
                {"text": "合理的运动作息能够提高免疫力，从而有效抵御外界病毒。", "pinyin": "Hélǐ de yùndòng zuòxī nénggòu tígāo miǎnyìlì, cóng'ér yǒuxiào dǐyù wàijiè bìngdú.", "translation": "Chế độ vận động nghỉ ngơi hợp lý có thể nâng cao hệ miễn dịch, từ đó phòng ngự hữu hiệu virus bên ngoài."},
                {"text": "从而有效抵御外界病毒合理的运动作息能够提高免疫力。", "pinyin": "Cóng'ér...", "translation": "Đặt sai liên từ chỉ hệ quả 从而 lên đầu"},
                {"text": "能够提高免疫力合理的运动作息从而有效抵御外界病毒。", "pinyin": "Nénggòu tígāo...", "translation": "Lộn vế chủ vị"}
            ],
            "correct_option_index": 0,
            "explanation": "Cấu trúc liên từ hệ quả: Vế tiền đề + 从而 + Vế kết quả mục đích.", "points": 10
        },
        {
            "id": "q-hsk5-01-13", "exam_id": "hsk5-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 13, "question_type": "writing_reorder",
            "prompt": "连词成句：排列词语成句：",
            "pinyin": "Liáncí chéng jù: Páiliè cíyǔ chéng jù:",
            "translation": "Sắp xếp câu chữ 把 kết hợp động từ cao cấp:",
            "words": ["请把", "这些调查数据", "整理成", "一份完整的对比报告"],
            "scrambledWords": ["整理成", "请把", "一份完整的对比报告", "这些调查数据"],
            "correct_order": ["请把", "这些调查数据", "整理成", "一份完整的对比报告"],
            "answerKey": ["请把", "这些调查数据", "整理成", "一份完整的对比报告"],
            "correct_sentence": "请把这些调查数据整理成一份完整的对比报告。",
            "options": [
                {"text": "请把这些调查数据整理成一份完整的对比报告。", "pinyin": "Qǐng bǎ zhèxiē diàochá shùjù zhěnglǐ chéng yí fèn wánzhěng de duìbǐ bàogào.", "translation": "Xin hãy chỉnh lý các số liệu khảo sát này thành một bản báo cáo đối chiếu hoàn chỉnh."},
                {"text": "一份完整的对比报告请把这些调查数据整理成。", "pinyin": "Yí fèn wánzhěng...", "translation": "Lộn tân ngữ biến đổi lên đầu"},
                {"text": "请整理成这些调查数据把一份完整的对比报告。", "pinyin": "Qǐng zhěnglǐ chéng...", "translation": "Sai vị trí chữ 把"}
            ],
            "correct_option_index": 0,
            "explanation": "Cấu trúc chuyển hóa: 把 + Đối tượng gốc (这些调查数据) + Động từ + 成 + Đối tượng sau chuyển hóa (一份完整的对比报告).", "points": 10
        },
        {
            "id": "q-hsk5-01-14", "exam_id": "hsk5-mock-01", "part_type": "writing", "part_number": 2,
            "question_number": 14, "question_type": "free_writing",
            "prompt": "结合所给成语写一个80字左右的短文：[举一反三] (Cử nhất phản tam - Biết một suy ra ba, suy diễn linh hoạt)",
            "pinyin": "Jiéhé suǒ gěi chéngyǔ xiě yí gè duǎnwén: [jǔyīfǎnsān]",
            "translation": "Phần Viết tự luận HSK 5: Viết đoạn văn ngắn khoảng 80 chữ kết hợp thành ngữ [举一反三]:",
            "required_words": ["举一反三"], "min_words": 50, "max_words": 100,
            "sample_answer": "在学习过程中，死记硬背往往难以取得优异的成绩。我们应当注重掌握知识的核心规律与解题逻辑，学会举一反三，触类旁通。只有善于灵活变通，才能在面对复杂多变的新问题时游刃有余。",
            "writing_criteria": [
                "Bắt buộc chứa thành ngữ '举一反三'",
                "Bàn luận mạch lạc về phương pháp học tập hoặc tư duy",
                "Độ dài khoảng 50 - 100 chữ Hán"
            ],
            "points": 10,
            "explanation": "Gợi ý: Dùng thành ngữ '举一反三' trong bối cảnh học tập thông minh thay vì học vẹt."
        },
        {
            "id": "q-hsk5-01-15", "exam_id": "hsk5-mock-01", "part_type": "writing", "part_number": 2,
            "question_number": 15, "question_type": "free_writing",
            "prompt": "结合所给词语写一篇80字短文：[坚持]、[挑战]、[收获]",
            "pinyin": "Jiéhé suǒ gěi cíyǔ xiě yí piān duǎnwén: [jiānchí], [tiǎozhàn], [shōuhuò]",
            "translation": "Phần Viết HSK 5: Viết đoạn văn ngắn khoảng 80 chữ kết hợp 3 từ khóa: [坚持 - Kiên trì], [挑战 - Thách thức], [收获 - Thu hoạch]:",
            "required_words": ["坚持", "挑战", "收获"], "min_words": 60, "max_words": 100,
            "sample_answer": "人生就像一场充满未知的马拉松，沿途必然会遭遇各种各样的困难与挑战。只要我们坚定信念、持之以恒，勇敢地战胜每一次挫折，就一定能在奋斗的终点收获丰硕的果实与内心的成长。",
            "writing_criteria": [
                "Bắt buộc chứa cả 3 từ khóa: 坚持, 挑战, 收获",
                "Câu cú chuẩn mực, văn phong truyền cảm hứng",
                "Độ dài từ 60 đến 100 chữ Hán"
            ],
            "points": 10,
            "explanation": "Đoạn văn kết hợp tự nhiên 3 từ khóa thành triết lý sống nghị lực."
        }
    ]
    questions.extend(writing)
    return questions


def get_hsk6_mock01_questions():
    questions = []
    # 5 Listening
    listening = [
        ("q-hsk6-01-01", "听新闻公报，捕捉宏观政策核心（听力第一部分）：", "Tīng xīnwén gōngbào, bǔzhuō hóngguān...", "Nghe công báo thời sự, trích xuất chính sách vĩ mô:", "国务院日前印发《数字中国建设整体布局规划》，明确指出要打通数字基础设施大动脉，畅通数据资源大循环，推动数字技术与实体经济深度融合，以数字化驱动中国式现代化进程。问：规划的核心战略方向是什么？", [("Thúc đẩy kỹ thuật số kết hợp sâu rộng với kinh tế thực thể (数字技术与实体经济深度融合)", "Shùzì jìshù..."), ("Hạn chế chuyển đổi số (限制数字化)", "Xiànzhì shùzìhuà"), ("Chỉ phát triển nông nghiệp truyền thống (只发展传统农业)", "Zhǐ fāzhǎn nóngyè")], 0, "Trọng tâm văn kiện: 推动数字技术与实体经济深度融合，驱动现代化."),
        ("q-hsk6-01-02", "听社科访谈，理解社会学概念：", "Tīng shèkē fǎngtán, lǐjiě shèhuìxué gàiniàn:", "Nghe phỏng vấn xã hội học, nắm bắt khái niệm chuyên môn:", "学者指出，过度城市化过程中出现的‘职住分离’现象，不仅加剧了早晚高峰的潮汐式交通拥堵，更在无形中剥夺了通勤者的闲暇时光，对家庭陪伴和社区公共生活的构建造成了深层次冲击。问：‘职住分离’带来了什么负面影响？", [("Gia tăng áp lực đi lại và làm suy giảm đời sống gia đình (加剧通勤压力与挤压闲暇时光)", "Jiājù tōngqín yālì..."), ("Giảm giá nhà (降低房价)", "Jiàngdī fángjià"), ("Tăng thời gian nghỉ ngơi (增加休息时间)", "Zēngjiā xiūxi shíjiān")], 0, "Hệ quả: 加剧交通拥堵，剥夺闲暇时光，对家庭社区造成冲击."),
        ("q-hsk6-01-03", "听科技前沿动态，回答技术瓶颈问题：", "Tīng kējì qiányán dòngtài, huídá...", "Nghe bản tin công nghệ đỉnh cao, phân tích điểm nghẽn kỹ thuật:", "虽然量子计算展现了指数级超越传统超级计算机的潜在算力，但在实际工程落地中，量子比特的退相干效应以及极低温环境的严苛维持，依然是全球物理学界面临的巨大工程壁垒。问：量子计算实际落地面临的主要瓶颈是什么？", [("Hiện tượng mất liên kết lượng tử và đòi hỏi nhiệt độ cực thấp (退相干效应与维持极低温环境)", "Tuìxiānggān xiàoyìng..."), ("Thiếu tiền (缺少资金)", "Quēshǎo zījīn"), ("Không có máy tính điện tử (没有电子计算机)", "Méiyǒu suànlì")], 0, "Điểm nghẽn then chốt: 退相干效应以及极低温环境的维持壁垒."),
        ("q-hsk6-01-04", "听艺术鉴赏讲座，分析中国美学特征：", "Tīng yìshù jiànshǎng jiǎngzuò, fēnxī...", "Nghe giảng về mỹ học hội họa thủy mặc truyền thống:", "中国传统水墨山水画贵在‘计白当黑’与‘意到笔不到’。空白绝非虚无，而是蕴藉着气韵流转与无限时空的哲理留白，给予观赏者以广阔的心理共鸣与审美再创造空间。问：中国画‘留白’的核心美学价值是什么？", [("Gợi mở không gian triết lý và sự đồng sáng tạo của người thưởng lãm (蕴藉无限时空与审美再创造)", "Yùnjiè wúxiàn shíkōng..."), ("Tiết kiệm mực vẽ (节约墨水)", "Jiéyuē mòshuǐ"), ("Họa sĩ chưa vẽ xong (没画完)", "Méi huà wán")], 0, "Giá trị mỹ học: 空白绝非虚无，而是蕴藉无限时空与审美再创造空间."),
        ("q-hsk6-01-05", "听生态学演讲，回答保护机制：", "Tīng shēngtàixué yǎnjiǎng, huídá...", "Nghe bài giảng sinh thái học, phân tích cơ chế bảo tồn:", "国家公园体制建设之所以被视为生态文明的最高形态，是因为它打破了传统行政区划的碎片化分割，实现了全流域、全生态系统的整体性原真保护，为顶级旗舰物种提供了无障碍繁衍廊道。问：国家公园体制的根本优势在于？", [("Bảo tồn nguyên vẹn tính toàn thể của hệ sinh thái (实现生态系统整体性原真保护)", "Shíxiàn zhěngtǐxìng bǎohù..."), ("Phát triển du lịch ồ ạt (大规模旅游)", "Dàguīmó lǚyóu"), ("Ngăn chặn nghiên cứu khoa học (禁止科学考察)", "Jìnzhǐ kēkǎo")], 0, "Ưu thế căn bản: 打破行政区划碎片化，实现全生态系统的整体性原真保护.")
    ]
    for idx, (qid, prompt, pinyin, trans, script, opts, corr, exp) in enumerate(listening):
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk6-mock-01", "part_type": "listening", "part_number": 1,
            "question_number": idx + 1, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": script,
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 10
        })

    # 5 Reading (Bệnh cú 病句辨析 - Đặc sản HSK 6)
    reading = [
        ("q-hsk6-01-06", "【HSK 6 病句辨析】下列各项中，没有语病、表意明确的一项是：", "【HSK 6 Bìngjù biànxī】Xiàliè gè xiàng zhōng, méiyǒu yǔbìng...", "Phần Đọc HSK 6: Tìm câu chuẩn xác, KHÔNG mắc lỗi ngữ bệnh (病句):", [
            ("经过专家组深入现场的周密调研，这份关于运河流域生态修复的长远规划终于顺利通过了评审。", "Jīngguò zhuānjiāzǔ shēnrù xiànchǎng de zhōumì diàoyán, zhè fèn guīhuà tōngguò le píngshěn."),
            ("通过这次防灾减灾宣传周活动，使广大市民的自救互救能力得到了显著的增强。", "Tōngguò zhè cì huódòng, shǐ shìmín néng lì... (Lỗi thiếu chủ ngữ do lạm dụng 通过...使...)"),
            ("为了防止这类恶性交通事故不再发生，交管部门进一步升级了全路段的智能测速预警系统。", "Wèile fángzhǐ bù zài fāshēng... (Lỗi phủ định kép ngược nghĩa: 防止 + 不)"),
            ("他的革命先烈事迹不仅感染了在场的每一位听众，也深深地教育了我们大家。", "Tā de gémìng xiānliè shìjì... (Lỗi kết hợp từ lủng củng)")
        ], 0, "Phương án A hoàn toàn chuẩn xác. B mắc lỗi khuyết chủ ngữ do dùng '通过...使...'; C mắc lỗi phủ định nghịch lý ('防止...不再发生' biến thành mong tai nạn xảy ra); D kết hợp ngữ nghĩa lủng củng."),
        ("q-hsk6-01-07", "【HSK 6 病句辨析】下列各项中，有语病的一项是：", "【HSK 6 Bìngjù biànxī】Xiàliè gè xiàng zhōng, yǒu yǔbìng de yí xiàng shì:", "Tìm câu BỊ LỖI ngữ pháp (病句):", [
            ("能否持之以恒地加强自主核心技术研发，是决定这家制造企业在激烈市场博弈中立于不败之地的关键因素。", "Néngfǒu chízhīyǐhéng... shì juédìng... de guānjiàn yīnsù. (Lỗi hai mặt đối chiếu một mặt: 能否 đối với 立于不败之地)"),
            ("这部纪录片以生动质朴的镜头语言，客观记录了塞罕坝林场建设者半个世纪的绿色奉献历程。", "Zhè bù jìlùpiàn... (Chuẩn)"),
            ("人工智能在赋能传统制造业的同时，也对劳动者的数字素养和再培训机制提出了全新的命题。", "Réngōng zhìnéng... (Chuẩn)"),
            ("文化交流的真谛在于增进理解与互信，而不是单向的价值输出或文化优越感的宣示。", "Wénhuà jiāoliú... (Chuẩn)")
        ], 0, "Phương án A mắc lỗi kinh điển HSK 6: '两面对一面' (vế đầu có '能否' gồm 2 mặt được/không được, nhưng vế sau chỉ khẳng định 1 mặt '立于不败之地')."),
        ("q-hsk6-01-08", "成语辨析：在战略决策中，既要______预判宏观风险，又要______从微观细节切入，方能做到______掌控全局。", "Chéngyǔ biànxī: Zài zhànlüè juécè zhōng...", "Chọn chuỗi thành ngữ HSK 6 cao cấp thích hợp với văn cảnh bình luận kinh tế vĩ mô:", [
            ("居安思危 —— 防微杜渐 —— 运筹帷幄 (Lo xa lúc an bình — Ngăn chặn từ mầm mống — Bày mưu tính kế điều binh)", "jū'ānsīwēi — fángwēidùjiàn — yùnchóuwéiwò"),
            ("自相矛盾 —— 掩耳盗铃 —— 画蛇添足 (Mâu thuẫn — Bịt tai trộm chuông — Vẽ rắn thêm chân)", "zìxiāng máodùn — yǎn'ěrdàolíng — huàshétiānzú"),
            ("朝三暮四 —— 走马观花 —— 井底之蛙 (Sáng ba chiều bốn — Cưỡi ngựa xem hoa — Ếch ngồi đáy giếng)", "zhāosānmùsì — zǒumǎguānhuā — jǐngdǐzhīwā"),
            ("南辕北辙 —— 守株待兔 —— 拔苗助长 (Trống đánh xuôi kèn thổi ngược — Ôm cây đợi thỏ — Đốt cháy giai đoạn)", "nányuánběizhé — shǒuzhūdàitù — bámiáozhùzhǎng")
        ], 0, "Trong hoạch định chiến lược kinh tế và phòng ngừa rủi ro, tam tấu thành ngữ HSK 6 [居安思危、防微杜渐、运筹帷幄] là chuẩn mực văn phong cao cấp."),
        ("q-hsk6-01-09", "阅读理解：[中国古代典籍《易经》有云：‘天地之大德曰生。’生生不息不仅是自然界的演进法则，更是中国人宇宙观的精神原点。它启示人类应当顺应自然之道，以包容化育之德看待万物的存续与发展。] 问：这段古文引言意在阐明什么哲学智慧？", "Yuèdú lǐjiě: Wèn: Zhè duàn gǔwén yì zài chǎnmíng shénme zhéxué zhìhuì?", "Đọc hiểu: Đoạn văn mượn câu kinh điển 'Thiên địa chi đại đức viết sinh' để làm sáng tỏ điều gì?", [("Tôn trọng quy luật sinh sôi tự nhiên và giữ lòng bao dung với muôn loài (顺应自然、包容万物生息)", "Shùnyìng zìrán..."), ("Phủ nhận sức mạnh con người (否定人类)", "Fǒudìng rénlèi"), ("Khuyên con người tàn phá thiên nhiên (征服自然)", "Zhēngfú zìrán")], 0, "Triết lý '生生不息' nhấn mạnh con người thuận theo tự nhiên và bao dung vạn vật."),
        ("q-hsk6-01-10", "【HSK 6 篇章指瑕】阅读段落判断逻辑承接：[科学探索从来不是一帆风顺的坦途，其间充满着试错与曲折。______。只有拥有耐得住寂寞的定力与百折不挠的坚韧，才能穿越科学探索的迷雾，迎来真理的曙光。] 填入横线处最恰当的衔接句是：", "【HSK 6 Piānzhāng zhǐxiá】...", "Chọn câu chuyển tiếp liên kết đoạn văn chặt chẽ nhất:", [
            ("每一次看似失败的实验，实际上都在为最终的成功排除错误的路径", "Měi yí cì kànsì shībài de shíyàn, shíjìshang dōu zài wèi zuìzhōng de chénggōng páichú cuòwù de lùjìng"),
            ("所以科学家都不愿意做实验", "Suǒyǐ kēxuéjiā dōu bú yuànyì zuò shíyàn"),
            ("因此只要有钱就一定能出成果", "Yīncǐ zhǐyào yǒu qián jiù yídìng néng chū chéngguǒ")
        ], 0, "Vế trước nói về '充满试错与曲折' (đầy rẫy thử sai và trắc trở), câu kết nối giải thích giá trị của việc thất bại để loại bỏ con đường sai là mạch lạc và học thuật nhất.")
    ]
    for idx, (qid, prompt, pinyin, trans, opts, corr, exp) in enumerate(reading):
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk6-mock-01", "part_type": "reading", "part_number": 2,
            "question_number": idx + 6, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": "",
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 10
        })

    # 5 Writing
    writing = [
        {
            "id": "q-hsk6-01-11", "exam_id": "hsk6-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 11, "question_type": "multiple_choice",
            "prompt": "【HSK 6 书写缩写要领】阅读1000字叙事文后进行400字缩写，以下哪项操作符合官方评分准则？",
            "pinyin": "【HSK 6 Shūxiě suōxiě yàolǐng】Yuèdú 1000 zì xùshìwén hòu jìnxíng 400 zì suōxiě...",
            "translation": "【Kỹ năng viết tóm tắt HSK 6】Khi tóm tắt văn bản 1000 chữ thành 400 chữ, thao tác nào dưới đây chuẩn xác theo tiêu chuẩn khảo thí?",
            "audio_url": "", "audio_script": "",
            "options": [
                {"text": "忠实于原文叙事主线与因果脉络，提炼核心事件，不得掺入个人主观评论 (Trung thực với mạch truyện và nhân quả nguyên tác, cô đọng biến cố cốt lõi, tuyệt đối KHÔNG lồng bình luận chủ quan cá nhân)", "pinyin": "Zhōngshí yú yuánwén xùshì zhǔxiàn...", "translation": "Quy tắc vàng tóm tắt văn bản HSK 6"},
                {"text": "必须加入大量个人读后感和主观议论抒情 (Cần thêm nhiều cảm nghĩ và bình luận cá nhân)", "pinyin": "Bìxū jiārù dàliàng gèrén dúhòugǎn...", "translation": "Sai lầm làm trừ điểm nặng"},
                {"text": "可以任意更改原著主角姓名和故事结局 (Có thể tự đổi kết thúc truyện)", "pinyin": "Kěyǐ rènyì gēnggǎi...", "translation": "Xuyên tạc cốt truyện"},
                {"text": "直接抄写原文前两段凑足400字 (Chép nguyên vẹn 2 đoạn đầu)", "pinyin": "Zhíjiē chāoxiě yuánwén...", "translation": "Gian lận bị điểm liệt"}
            ],
            "correct_option_index": 0,
            "explanation": "Tiêu chuẩn chấm thi Viết HSK 6: Đề bài yêu cầu '缩写' (tóm tắt khách quan). Thí sinh phải bảo lưu ngôi kể thứ 3, bám sát các sự kiện mấu chốt, tuyệt đối không được đưa quan điểm, cảm nhận cá nhân.", "points": 10
        },
        {
            "id": "q-hsk6-01-12", "exam_id": "hsk6-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 12, "question_type": "writing_reorder",
            "prompt": "【学术政论句法】排列下列短语组成逻辑严谨的复句：",
            "pinyin": "【Xuéshù zhènglùn jùfǎ】Páiliè xiàliè duǎnyǔ...",
            "translation": "Phần Viết HSK 6: Sắp xếp các cụm từ sau thành nhận định học thuật về bảo tồn di sản:",
            "words": ["非物质文化遗产的保护", "不仅在于静态典藏", "更在于", "在现代化转型中", "实现创造性转化"],
            "scrambledWords": ["在现代化转型中", "非物质文化遗产的保护", "实现创造性转化", "更在于", "不仅在于静态典藏"],
            "correct_order": ["非物质文化遗产的保护", "不仅在于静态典藏", "更在于", "在现代化转型中", "实现创造性转化"],
            "answerKey": ["非物质文化遗产的保护", "不仅在于静态典藏", "更在于", "在现代化转型中", "实现创造性转化"],
            "correct_sentence": "非物质文化遗产的保护不仅在于静态典藏，更在于在现代化转型中实现创造性转化。",
            "options": [
                {"text": "非物质文化遗产的保护不仅在于静态典藏，更在于在现代化转型中实现创造性转化。", "pinyin": "Fēiwùzhì wénhuà yíchǎn de bǎohù bùjǐn zàiyú jìngtài diǎncáng, gèng zàiyú zài xiàndàihuà zhuǎnxíng zhōng shíxiàn chuàngzàoxìng zhuǎnhuà.", "translation": "Việc bảo tồn di sản văn hóa phi vật thể không chỉ dừng ở việc lưu trữ tĩnh, mà quan trọng hơn là thực hiện chuyển hóa sáng tạo trong quá trình chuyển mình hiện đại hóa."},
                {"text": "在现代化转型中不仅在于静态典藏非物质文化遗产的保护更在于实现创造性转化。", "pinyin": "Zài xiàndàihuà zhuǎnxíng zhōng...", "translation": "Trật tự các vế câu lộn xộn"},
                {"text": "更在于实现创造性转化非物质文化遗产的保护不仅在于静态典藏。", "pinyin": "Gèng zàiyú...", "translation": "Đảo ngược thứ tự liên từ"}
            ],
            "correct_option_index": 0,
            "explanation": "Cấu trúc câu tăng tiến: '不仅在于 (Không chỉ ở) ... 更在于 (Càng ở chỗ) ...': 非物质文化遗产的保护不仅在于静态典藏，更在于在现代化转型中实现创造性转化。", "points": 10
        },
        {
            "id": "q-hsk6-01-13", "exam_id": "hsk6-mock-01", "part_type": "writing", "part_number": 1,
            "question_number": 13, "question_type": "writing_reorder",
            "prompt": "排列下列短语组成逻辑严谨的复句：",
            "pinyin": "Páiliè xiàliè duǎnyǔ...",
            "translation": "Sắp xếp cụm từ thành luận điểm kinh tế học hoàn chỉnh:",
            "words": ["只有构建开放型世界经济", "促进贸易和投资自由化", "才能有效抵御逆全球化思潮", "推动全球繁荣"],
            "scrambledWords": ["推动全球繁荣", "才能有效抵御逆全球化思潮", "只有构建开放型世界经济", "促进贸易和投资自由化"],
            "correct_order": ["只有构建开放型世界经济", "促进贸易和投资自由化", "才能有效抵御逆全球化思潮", "推动全球繁荣"],
            "answerKey": ["只有构建开放型世界经济", "促进贸易和投资自由化", "才能有效抵御逆全球化思潮", "推动全球繁荣"],
            "correct_sentence": "只有构建开放型世界经济，促进贸易和投资自由化，才能有效抵御逆全球化思潮，推动全球繁荣。",
            "options": [
                {"text": "只有构建开放型世界经济，促进贸易和投资自由化，才能有效抵御逆全球化思潮，推动全球繁荣。", "pinyin": "Zhǐyǒu gòujiàn kāifàngxíng shìjiè jīngjì, cùjìn màoyì hé tóuzī zìyóuhuà, cáinéng yǒuxiào dǐyù nìquánqiúhuà sīcháo, tuīdòng quánqiú fánróng.", "translation": "Chỉ có xây dựng nền kinh tế thế giới mở, thúc đẩy tự do hóa thương mại và đầu tư, mới có thể chống lại làn sóng chống toàn cầu hóa và thúc đẩy thịnh vượng toàn cầu hữu hiệu."},
                {"text": "才能有效抵御逆全球化思潮只有构建开放型世界经济促进贸易和投资自由化推动全球繁荣。", "pinyin": "Cáinéng yǒuxiào...", "translation": "Lộn vế điều kiện và kết quả"},
                {"text": "推动全球繁荣促进贸易和投资自由化只有构建开放型世界经济才能有效抵御逆全球化思潮。", "pinyin": "Tuīdòng...", "translation": "Đảo ngữ sai liên từ 只有...才能"}
            ],
            "correct_option_index": 0,
            "explanation": "Cấu trúc điều kiện duy nhất: 只有 + Điều kiện hành động, 才能 + Kết quả mục tiêu.", "points": 10
        },
        {
            "id": "q-hsk6-01-14", "exam_id": "hsk6-mock-01", "part_type": "writing", "part_number": 2,
            "question_number": 14, "question_type": "free_writing",
            "prompt": "【HSK 6 书写拟题训练】阅读寓言缩写材料后，提炼一个生动凝练、契合哲理的文章标题：",
            "pinyin": "【HSK 6 Shūxiě nǐtí xùnliàn】Tíliàn yí gè shēngdòng níngliàn de wénzhāng biāotí:",
            "translation": "Đặt tiêu đề cho bài văn tóm tắt HSK 6: Nêu một tiêu đề ngắn gọn (4-10 chữ Hán) khái quát chủ đề vượt khó vươn lên:",
            "min_words": 4, "max_words": 15,
            "sample_answer": "绝处逢生的智慧",
            "writing_criteria": [
                "Độ dài từ 4 đến 15 chữ Hán",
                "Mang tính khái quát triết lý, không đặt tiêu đề quá dài dòng",
                "Phù hợp văn phong nghị luận/tự sự HSK 6"
            ],
            "points": 10,
            "explanation": "Tiêu đề mẫu xuất sắc: '绝处逢生的智慧' (Trí tuệ tìm thấy đường sống nơi tuyệt lộ) hoặc '逆境中的坚守' (Kiên định trong nghịch cảnh)."
        },
        {
            "id": "q-hsk6-01-15", "exam_id": "hsk6-mock-01", "part_type": "writing", "part_number": 2,
            "question_number": 15, "question_type": "free_writing",
            "prompt": "【HSK 6 核心立意总结】用一句话（30-50字）高度凝练《塞翁失马》的辩证法思想：",
            "pinyin": "【HSK 6 Héxīn lìyì zǒngjié】Yòng yí jù huà gāodù níngliàn 'Sàiwēng shī mǎ' de biànzhèngfǎ sīxiǎng:",
            "translation": "Đúc kết triết lý biện chứng câu chuyện Tái ông thất mã (30-50 chữ Hán):",
            "min_words": 20, "max_words": 60,
            "sample_answer": "祸兮福所倚，福兮祸所伏。顺境中不可得意忘形，逆境中更需抱持希望，辩证看待人生的得失起伏。",
            "writing_criteria": [
                "Nêu bật tư tưởng phúc họa tương sinh, biện chứng",
                "Văn phong hàm súc, học thuật",
                "Độ dài khoảng 25 đến 60 chữ Hán"
            ],
            "points": 10,
            "explanation": "Đúc kết mẫu: '祸兮福所倚，福兮祸所伏。顺境中不可得意忘形，逆境中更需抱持希望，辩证看待人生的得失起伏。'"
        }
    ]
    questions.extend(writing)
    return questions


def get_completion_questions():
    questions = []
    
    # 1. hsk1-mock-03: Q5 - Q10 (6 questions)
    hsk1_03_extras = [
        ("q-hsk1-03-05", "hsk1-mock-03", "listening", 1, 5, "听句子，选出人物关系：", "Tīng jùzi, xuǎn chū rénwù guānxì:", "Nghe câu, chọn quan hệ nhân vật:", "这是我的大学同学，他叫大卫。", [("Bạn học (同学)", "Tóngxué"), ("Giáo viên (老师)", "Lǎoshī"), ("Bác sĩ (医生)", "Yīshēng")], 0, "Nói rõ '这是我的大学同学'."),
        ("q-hsk1-03-06", "hsk1-mock-03", "listening", 1, 6, "听句子，选择交通工具：", "Tīng jùzi, xuǎnzé jiāotōng gōngjù:", "Nghe câu, chọn phương tiện giao thông:", "我爸爸坐出租车去火车站了。", [("Xe taxi (出租车)", "Chūzūchē"), ("Máy bay (飞机)", "Fēijī"), ("Xe đạp (自行车)", "Zìxíngchē")], 0, "坐出租车去火车站."),
        ("q-hsk1-03-07", "hsk1-mock-03", "reading", 2, 7, "选词填空：你在看______呢？", "Xuǎncí tiánkòng: Nǐ zài kàn ______ ne?", "Điền đại từ nghi vấn: Bạn đang xem ______ thế?", "", [("什么 (Gì)", "Shénme"), ("谁 (Ai)", "Shéi"), ("哪儿 (Ở đâu)", "Nǎr")], 0, "Tân ngữ đồ vật: 看什么."),
        ("q-hsk1-03-08", "hsk1-mock-03", "reading", 2, 8, "选词填空：今天天气很冷，多穿点儿______吧。", "Xuǎncí tiánkòng: Jīntiān tiānqì hěn lěng, duō chuān diǎnr ______ ba.", "Điền danh từ trang phục:", "", [("衣服 (Quần áo)", "Yīfu"), ("米饭 (Cơm)", "Mǐfàn"), ("水 (Nước)", "Shuǐ")], 0, "Động từ '穿' (mặc) đi với '衣服' (quần áo)."),
        ("q-hsk1-03-09", "hsk1-mock-03", "reading", 2, 9, "问答配对：[你想喝茶还是喝水？]", "Wèndá pèiduì: [Nǐ xiǎng hē chá háishì hē shuǐ?]", "Chọn câu đáp lại: Bạn muốn uống trà hay nước?", "", [("给我一杯茶吧，谢谢。 (Cho tôi cốc trà, cảm ơn)", "Gěi wǒ yì bēi chá ba..."), ("明天去。 (Ngày mai đi)", "Míngtiān qù."), ("他是学生。 (Cậu ấy là học sinh)", "Tā shì xuésheng.")], 0, "Trả lời lựa chọn đồ uống: 给我一杯茶吧."),
        ("q-hsk1-03-10", "hsk1-mock-03", "reading", 2, 10, "看拼音选汉字：xuéxiào (trường học)", "Kàn pīnyīn xuǎn hànzì: xuéxiào", "Nhìn pinyin chọn chữ Hán:", "", [("学校", "xuéxiào"), ("学生", "xuésheng"), ("学习", "xuéxí")], 0, "xuéxiào là chữ 学校 (trường học).")
    ]
    for qid, exid, part, pnum, qnum, prompt, pinyin, trans, script, opts, corr, exp in hsk1_03_extras:
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": exid, "part_type": part, "part_number": pnum,
            "question_number": qnum, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans,
            "audio_url": "", "audio_script": script,
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 10
        })

    # 2. hsk2-mock-03: Q5 - Q10 (6 questions)
    hsk2_03_extras = [
        ("q-hsk2-03-05", "hsk2-mock-03", "listening", 1, 5, "听对话，回答地点：", "Tīng duìhuà, huídá dìdiǎn:", "Nghe đối thoại, xác định địa điểm:", "女：请问还有空房间吗？男：对不起，今天所有的客房都住满了。问：他们最可能在哪里？", [("Khách sạn (宾馆/酒店)", "Bīnguǎn"), ("Trường học (学校)", "Xuéxiào"), ("Bệnh viện (医院)", "Yīyuàn")], 0, "Hỏi về phòng trống (空房间) và phòng khách (客房) là ở khách sạn."),
        ("q-hsk2-03-06", "hsk2-mock-03", "listening", 1, 6, "听对话，选择男的想法：", "Tīng duìhuà, xuǎnzé nán de xiǎngfǎ:", "Nghe đối thoại, chọn suy nghĩ của người nam:", "女：今天我们去吃烤鸭怎么样？男：好啊，听说附近那家全聚德味道特别地道。问：男的同意去吃烤鸭吗？", [("Rất đồng ý (非常赞同)", "Fēicháng zàntóng"), ("Không muốn đi (不想去)", "Bù xiǎng qù"), ("Không thích ăn thịt (不喜欢吃肉)", "Bù xǐhuan chī ròu")], 0, "Người nam khen và đồng ý: 好啊，味道特别地道."),
        ("q-hsk2-03-07", "hsk2-mock-03", "reading", 2, 7, "选词填空：这件大衣比那件______两百块钱。", "Xuǎncí tiánkòng: Zhè jiàn dàyī bǐ nà jiàn ______ liǎngbǎi kuài qián.", "Chọn tính từ câu so sánh giá cả:", "", [("贵 (Đắt)", "Guì"), ("长 (Dài)", "Cháng"), ("快 (Nhanh)", "Kuài")], 0, "Đắt hơn 200 tệ: 贵两百块钱."),
        ("q-hsk2-03-08", "hsk2-mock-03", "reading", 2, 8, "选词填空：快要迟到了，我们______走吧。", "Xuǎncí tiánkòng: Kuàiyào chídào le, wǒmen ______ zǒu ba.", "Chọn phó từ di chuyển:", "", [("快点儿 (Nhanh lên chút)", "Kuài diǎnr"), ("慢慢 (Từ từ)", "Mànman"), ("已经 (Đã)", "Yǐjīng")], 0, "Sắp muộn rồi thì phải đi nhanh: 快点儿走吧."),
        ("q-hsk2-03-09", "hsk2-mock-03", "reading", 2, 9, "问答配对：[你怎么了？脸色这么苍白。]", "Wèndá pèiduì: [Nǐ zěnme le? Liǎnsè zhème cāngbái.]", "Chọn câu đáp lại: 'Bạn sao thế? Mặt mũi nhợt nhạt vậy.'", "", [("我肚子有点儿疼，想去医务室。 (Tôi đau bụng, muốn đi phòng y tế)", "Wǒ dùzi..."), ("今天天气很好。 (Hôm nay trời đẹp)", "Jīntiān tiānqì..."), ("他是新来的。 (Cậu ấy mới tới)", "Tā shì xīn lái de.")], 0, "Đáp lại trạng thái sức khỏe: 我肚子有点儿疼."),
        ("q-hsk2-03-10", "hsk2-mock-03", "reading", 2, 10, "连词成句：[①看完了 ②这本小说 ③我]", "Liáncí chéng jù: [①kànwán le ②zhè běn xiǎoshuō ③wǒ]", "Sắp xếp từ thành câu:", "", [("③①② (我这本小说看完了 / 我看完了这本小说。)", "Wǒ kànwán le zhè běn xiǎoshuō."), ("②①③ (这本小说看完了我。)", "Zhè běn xiǎoshuō..."), ("①③② (看完了我这本小说。)", "Kànwán le wǒ...")], 0, "Cấu trúc: 我看完了这本小说。")
    ]
    for qid, exid, part, pnum, qnum, prompt, pinyin, trans, script, opts, corr, exp in hsk2_03_extras:
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": exid, "part_type": part, "part_number": pnum,
            "question_number": qnum, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans,
            "audio_url": "", "audio_script": script,
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 10
        })

    # 3. hsk3-mock-03: Q7 - Q9 (3 Writing questions)
    questions.append({
        "id": "q-hsk3-03-07", "exam_id": "hsk3-mock-03", "part_type": "writing", "part_number": 1,
        "question_number": 7, "question_type": "writing_reorder",
        "prompt": "连词成句：排列下列词语成句：",
        "pinyin": "Liáncí chéng jù: Páiliè xiàliè cíyǔ chéng jù:",
        "translation": "Sắp xếp câu chữ 把:",
        "words": ["请把", "护照和机票", "拿出来"], "scrambledWords": ["拿出来", "护照和机票", "请把"],
        "correct_order": ["请把", "护照和机票", "拿出来"], "answerKey": ["请把", "护照和机票", "拿出来"],
        "correct_sentence": "请把护照和机票拿出来。",
        "options": [
            {"text": "请把护照和机票拿出来。", "pinyin": "Qǐng bǎ hùzhào hé jīpiào ná chūlai.", "translation": "Xin hãy lấy hộ chiếu và vé máy bay ra."},
            {"text": "护照和机票请拿出来把。", "pinyin": "Hùzhào hé jīpiào...", "translation": "Sai vị trí chữ 把"}
        ],
        "correct_option_index": 0, "explanation": "Cấu trúc: 请 + 把 + Tân ngữ + 拿出来.", "points": 34
    })
    questions.append({
        "id": "q-hsk3-03-08", "exam_id": "hsk3-mock-03", "part_type": "writing", "part_number": 1,
        "question_number": 8, "question_type": "writing_reorder",
        "prompt": "连词成句：排列词语成句：",
        "pinyin": "Liáncí chéng jù: Páiliè cíyǔ chéng jù:",
        "translation": "Sắp xếp câu cảm thán:",
        "words": ["这里的风景", "太美丽了", "真让人流连忘返"], "scrambledWords": ["真让人流连忘返", "这里的风景", "太美丽了"],
        "correct_order": ["这里的风景", "太美丽了", "真让人流连忘返"], "answerKey": ["这里的风景", "太美丽了", "真让人流连忘返"],
        "correct_sentence": "这里的风景太美丽了，真让人流连忘返。",
        "options": [
            {"text": "这里的风景太美丽了，真让人流连忘返。", "pinyin": "Zhèlǐ de fēngjǐng tài měilì le, zhēn ràng rén liúlián wàngfǎn.", "translation": "Phong cảnh nơi đây đẹp quá, thật khiến lòng người lưu luyến."},
            {"text": "真让人流连忘返这里的风景太美丽了。", "pinyin": "Zhēn ràng rén...", "translation": "Đảo ngữ sai"}
        ],
        "correct_option_index": 0, "explanation": "Chủ ngữ (这里的风景) + Tính từ (太美丽了) + Hệ quả cảm xúc.", "points": 33
    })
    questions.append({
        "id": "q-hsk3-03-09", "exam_id": "hsk3-mock-03", "part_type": "writing", "part_number": 2,
        "question_number": 9, "question_type": "fill_blank",
        "prompt": "根据拼音写汉字：他每天都去操场跑[bù]______。",
        "pinyin": "Gēnjù pīnyīn xiě hànzì: Tā měitiān dōu qù cāochǎng pǎo[bù]______.",
        "translation": "Điền chữ Hán tương ứng phiên âm [bù] trong 'chạy bộ' (跑步):",
        "accepted_answers": ["步"], "sample_answer": "步",
        "options": [
            {"text": "步 (bù)", "pinyin": "bù", "translation": "Chữ Hán chính xác trong 跑步"},
            {"text": "不 (bù)", "pinyin": "bù", "translation": "Sai nghĩa từ vựng"}
        ],
        "correct_option_index": 0, "explanation": "Từ ghép 跑步 (chạy bộ), chữ cần điền là 步 (bộ).", "points": 33
    })

    # 4. hsk4-mock-03: Q7 - Q9 (3 Writing questions)
    questions.append({
        "id": "q-hsk4-03-07", "exam_id": "hsk4-mock-03", "part_type": "writing", "part_number": 1,
        "question_number": 7, "question_type": "writing_reorder",
        "prompt": "连词成句：排列下列词语成句：",
        "pinyin": "Liáncí chéng jù: Páiliè xiàliè cíyǔ chéng jù:",
        "translation": "Sắp xếp câu chữ 被:",
        "words": ["那篇优秀的科幻小说", "翻译成了", "被", "多种外语"], "scrambledWords": ["多种外语", "被", "那篇优秀的科幻小说", "翻译成了"],
        "correct_order": ["那篇优秀的科幻小说", "被", "翻译成了", "多种外语"], "answerKey": ["那篇优秀的科幻小说", "被", "翻译成了", "多种外语"],
        "correct_sentence": "那篇优秀的科幻小说被翻译成了多种外语。",
        "options": [
            {"text": "那篇优秀的科幻小说被翻译成了多种外语。", "pinyin": "Nà piān yōuxiù de kēhuàn xiǎoshuō bèi fānyì chéng le duō zhǒng wàiyǔ.", "translation": "Cuốn tiểu thuyết khoa học viễn tưởng xuất sắc đó đã được dịch ra nhiều thứ tiếng nước ngoài."},
            {"text": "多种外语被那篇优秀的科幻小说翻译成了。", "pinyin": "Duō zhǒng wàiyǔ...", "translation": "Lộn tân ngữ và chủ ngữ"}
        ],
        "correct_option_index": 0, "explanation": "Cấu trúc: 主语 + 被 + 翻译成了 + 目标语言.", "points": 34
    })
    questions.append({
        "id": "q-hsk4-03-08", "exam_id": "hsk4-mock-03", "part_type": "writing", "part_number": 1,
        "question_number": 8, "question_type": "writing_reorder",
        "prompt": "连词成句：排列词语成句：",
        "pinyin": "Liáncí chéng jù: Páiliè cíyǔ chéng jù:",
        "translation": "Sắp xếp câu phức liên từ 无论...都...:",
        "words": ["无论遇到任何挑战", "我们都要", "充满信心"], "scrambledWords": ["充满信心", "无论遇到任何挑战", "我们都要"],
        "correct_order": ["无论遇到任何挑战", "我们都要", "充满信心"], "answerKey": ["无论遇到任何挑战", "我们都要", "充满信心"],
        "correct_sentence": "无论遇到任何挑战，我们都要充满信心。",
        "options": [
            {"text": "无论遇到任何挑战，我们都要充满信心。", "pinyin": "Wúlùn yùdào rènhé tiǎozhàn, wǒmen dōu yào chōngmǎn xìnxīn.", "translation": "Dù gặp bất kỳ thách thức nào, chúng ta đều phải tràn đầy tự tin."},
            {"text": "我们都要充满信心无论遇到任何挑战。", "pinyin": "Wǒmen dōu yào...", "translation": "Đảo ngữ"}
        ],
        "correct_option_index": 0, "explanation": "无论 + 条件, 主语 + 都要 + 态度.", "points": 33
    })
    questions.append({
        "id": "q-hsk4-03-09", "exam_id": "hsk4-mock-03", "part_type": "writing", "part_number": 2,
        "question_number": 9, "question_type": "free_writing",
        "prompt": "看图并用所给词语写一个句子：[节约] (Tiết kiệm)",
        "pinyin": "Kàn tú bìng yòng suǒ gěi cíyǔ xiě yí gè jùzi: [jiéyuē]",
        "translation": "Viết câu hoàn chỉnh có từ [节约 - Tiết kiệm]:",
        "required_words": ["节约"], "min_words": 6, "max_words": 30,
        "sample_answer": "在日常生活中，我们每个人都应当养成节约用水的好习惯。",
        "writing_criteria": ["Bắt buộc chứa từ '节约'", "Độ dài từ 6 đến 30 chữ Hán"],
        "points": 33, "explanation": "Gợi ý: 我们应当养成节约用水的好习惯。"
    })

    # 5. hsk5-mock-02 & hsk5-mock-03: Q7 - Q9 (Writing)
    for exid in ["hsk5-mock-02", "hsk5-mock-03"]:
        questions.append({
            "id": f"q-{exid}-07", "exam_id": exid, "part_type": "writing", "part_number": 1,
            "question_number": 7, "question_type": "writing_reorder",
            "prompt": "连词成句：排列下列词语成句：",
            "pinyin": "Liáncí chéng jù: Páiliè xiàliè cíyǔ chéng jù:",
            "translation": "Sắp xếp câu chữ 把 trong văn phong thương mại:",
            "words": ["请把合同草案", "发给法务部门", "尽快", "审核"],
            "scrambledWords": ["尽快", "发给法务部门", "请把合同草案", "审核"],
            "correct_order": ["请把合同草案", "尽快", "发给法务部门", "审核"],
            "answerKey": ["请把合同草案", "尽快", "发给法务部门", "审核"],
            "correct_sentence": "请把合同草案尽快发给法务部门审核。",
            "options": [
                {"text": "请把合同草案尽快发给法务部门审核。", "pinyin": "Qǐng bǎ hétong cǎo'àn jìnkuài fā gěi fǎwù bùmén shěnhè.", "translation": "Xin hãy nhanh chóng gửi bản thảo hợp đồng cho phòng pháp chế xét duyệt."},
                {"text": "发给法务部门审核请把合同草案尽快。", "pinyin": "Fā gěi...", "translation": "Lộn vế câu"}
            ],
            "correct_option_index": 0, "explanation": "Cấu trúc: 请把 + 宾语 + 状语 (尽快) + 动词 (发给) + 目的 (审核).", "points": 34
        })
        questions.append({
            "id": f"q-{exid}-08", "exam_id": exid, "part_type": "writing", "part_number": 1,
            "question_number": 8, "question_type": "writing_reorder",
            "prompt": "连词成句：排列词语成句：",
            "pinyin": "Liáncí chéng jù: Páiliè cíyǔ chéng jù:",
            "translation": "Sắp xếp nhận định triết lý văn hóa:",
            "words": ["优秀传统文化的传承", "必须与现代文明相融合", "才能焕发生机"],
            "scrambledWords": ["才能焕发生机", "优秀传统文化的传承", "必须与现代文明相融合"],
            "correct_order": ["优秀传统文化的传承", "必须与现代文明相融合", "才能焕发生机"],
            "answerKey": ["优秀传统文化的传承", "必须与现代文明相融合", "才能焕发生机"],
            "correct_sentence": "优秀传统文化的传承必须与现代文明相融合才能焕发生机。",
            "options": [
                {"text": "优秀传统文化的传承必须与现代文明相融合才能焕发生机。", "pinyin": "Yōuxiù chuántǒng wénhuà de chuánchéng bìxū yǔ xiàndài wénmíng xiāng rónghé cáinéng huànfā shēngjī.", "translation": "Sự kế thừa văn hóa truyền thống ưu tú phải dung hợp với văn minh hiện đại mới có thể bừng lên sức sống."},
                {"text": "才能焕发生机优秀传统文化的传承必须与现代文明相融合。", "pinyin": "Cáinéng huànfā...", "translation": "Sai trật tự liên từ"}
            ],
            "correct_option_index": 0, "explanation": "Chủ ngữ (文化传承) + 必须... + 才能...", "points": 33
        })
        questions.append({
            "id": f"q-{exid}-09", "exam_id": exid, "part_type": "writing", "part_number": 2,
            "question_number": 9, "question_type": "free_writing",
            "prompt": "结合成语写80字短文：[脚踏实地] (Chân đạp thực địa - Làm việc thiết thực, chắc chắn)",
            "pinyin": "Jiéhé chéngyǔ xiě duǎnwén: [jiǎotàshídì]",
            "translation": "Viết đoạn văn ngắn khoảng 80 chữ kết hợp thành ngữ [脚踏实地]:",
            "required_words": ["脚踏实地"], "min_words": 50, "max_words": 100,
            "sample_answer": "任何远大的理想如果脱离了实干，都不过是空中楼阁。只有脚踏实地做好当下的每一件小事，持之以恒地积累经验，我们才能在通往成功的道路上走得更加稳健从容。",
            "writing_criteria": ["Bắt buộc chứa '脚踏实地'", "Độ dài từ 50 đến 100 chữ Hán"],
            "points": 33, "explanation": "Gợi ý: 只有脚踏实地做好当下的每一件小事，才能走得更稳健。"
        })

    # 6. hsk6-mock-02 & hsk6-mock-03: Q7 - Q9
    for exid in ["hsk6-mock-02", "hsk6-mock-03"]:
        questions.append({
            "id": f"q-{exid}-07", "exam_id": exid, "part_type": "reading", "part_number": 2,
            "question_number": 7, "question_type": "multiple_choice",
            "prompt": "【HSK 6 病句辨析】下列句子中没有语病的一项是：",
            "pinyin": "【HSK 6 Bìngjù biànxī】Xiàliè jùzi zhōng méiyǒu yǔbìng de yí xiàng shì:",
            "translation": "Tìm câu chuẩn xác KHÔNG mắc lỗi ngữ bệnh (病句):",
            "audio_url": "", "audio_script": "",
            "options": [
                {"text": "在深化经济体制改革的过程中，我们必须破除一切阻碍高质量发展的体制机制弊端。", "pinyin": "Zài shēnhuà jīngjì tǐzhì gǎigé de guòchéng zhōng..."},
                {"text": "由于缺乏科学合理的规划，使这座历史文化古城的原有风貌遭到了难以逆转的破坏。", "pinyin": "Yóuyú... shǐ... (Lỗi khuyết chủ ngữ do dùng 由于...使...)"},
                {"text": "能否切实减轻中小学生的课业负担，关键在于各级教育部门彻底转变唯升学率论的观念。", "pinyin": "Néngfǒu... guānjiàn zàiyú... (Lỗi hai mặt đối chiếu một mặt)"}
            ],
            "correct_option_index": 0, "explanation": "A hoàn toàn chuẩn xác. B mắc lỗi khuyết chủ ngữ; C mắc lỗi '两面对一面'.", "points": 34
        })
        questions.append({
            "id": f"q-{exid}-08", "exam_id": exid, "part_type": "writing", "part_number": 1,
            "question_number": 8, "question_type": "writing_reorder",
            "prompt": "排列下列短语组成逻辑严谨的学术论断：",
            "pinyin": "Páiliè xiàliè duǎnyǔ...",
            "translation": "Sắp xếp cụm từ thành luận điểm khoa học:",
            "words": ["生态环境保护和经济发展", "绝非相互对立的矛盾体", "而是内在统一的有机整体"],
            "scrambledWords": ["而是内在统一的有机整体", "生态环境保护和经济发展", "绝非相互对立的矛盾体"],
            "correct_order": ["生态环境保护和经济发展", "绝非相互对立的矛盾体", "而是内在统一的有机整体"],
            "answerKey": ["生态环境保护和经济发展", "绝非相互对立的矛盾体", "而是内在统一的有机整体"],
            "correct_sentence": "生态环境保护和经济发展绝非相互对立的矛盾体，而是内在统一的有机整体。",
            "options": [
                {"text": "生态环境保护和经济发展绝非相互对立的矛盾体，而是内在统一的有机整体。", "pinyin": "Shēngtài huánjìng bǎohù hé jīngjì fāzhǎn juéfēi xiānghù duìlì de máodùntǐ, ér shì nèizài tǒngyī de yǒujī zhěngtǐ.", "translation": "Bảo vệ môi trường sinh thái và phát triển kinh tế tuyệt nhiên không phải hai thực thể mâu thuẫn đối lập nhau, mà là một chỉnh thể hữu cơ thống nhất nội tại."},
                {"text": "而是内在统一的有机整体绝非相互对立的矛盾体生态环境保护和经济发展。", "pinyin": "Ér shì...", "translation": "Lộn vế câu"}
            ],
            "correct_option_index": 0, "explanation": "Cấu trúc phản đề: 主语 + 绝非 A, 而是 B.", "points": 33
        })
        questions.append({
            "id": f"q-{exid}-09", "exam_id": exid, "part_type": "writing", "part_number": 2,
            "question_number": 9, "question_type": "free_writing",
            "prompt": "【HSK 6 缩写概括训练】用一句学术政论文风格的句子（40-60字）概括绿色发展的核心内涵：",
            "pinyin": "【HSK 6 Suōxiě gàikuò xùnliàn】Gàikuò lǜsè fāzhǎn de héxīn nèihán:",
            "translation": "Đúc kết nội hàm phát triển xanh theo văn phong học thuật chính luận (40-60 chữ Hán):",
            "min_words": 30, "max_words": 70,
            "sample_answer": "绿色发展的本质在于摒弃以牺牲资源环境为代价的粗放型增长模式，推动人与自然和谐共生的可持续发展道路。",
            "writing_criteria": ["Văn phong học thuật chính luận chuẩn mực HSK 6", "Độ dài từ 30 đến 70 chữ Hán"],
            "points": 33, "explanation": "Gợi ý: 绿色发展的本质在于摒弃粗放型增长，走人与自然和谐共生的可持续发展道路。"
        })

    return questions
