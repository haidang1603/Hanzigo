# -*- coding: utf-8 -*-
import json

def get_hsk2_mock01_questions():
    questions = []
    
    # Listening: 20 questions (Q1 - Q20)
    # Part 1: True / False (Q1 - Q5)
    p1 = [
        ("q-hsk2-01-01", "听对话，判断对错：[男的今天晚上有空。]", "Tīng duìhuà, pànduàn duì cuò: [Nán de jīntiān wǎnshang yǒu kòng.]", "Nghe đối thoại, đoán đúng sai: 'Người nam tối nay rảnh rỗi.'", "女：今天晚上一起去看电影吧？男：真不巧，我今晚要加班。", [("✓ Đúng (对)", "Duì"), ("✗ Sai (错)", "Cuò")], 1, "Người nam phải tăng ca (加班), nên không rảnh rỗi. Chọn Sai."),
        ("q-hsk2-01-02", "听对话，判断对错：[外面现在在下雪。]", "Tīng duìhuà, pànduàn duì cuò: [Wàimiàn xiànzài zài xià xuě.]", "Nghe đối thoại, đoán đúng sai: 'Bên ngoài trời đang đổ tuyết.'", "女：外面天气怎么样？男：太阳很大，非常热。", [("✓ Đúng (对)", "Duì"), ("✗ Sai (错)", "Cuò")], 1, "Trời nắng to và rất nóng (太阳很大，非常热), không phải đổ tuyết. Chọn Sai."),
        ("q-hsk2-01-03", "听对话，判断对错：[他们打算坐出租车去机场。]", "Tīng duìhuà, pànduàn duì cuò: [Tāmen dǎsuàn zuò chūzūchē qù jīchǎng.]", "Nghe đối thoại: 'Họ dự định đi taxi ra sân bay.'", "男：我们怎么去机场？女：坐出租车吧，又快又方便。", [("✓ Đúng (对)", "Duì"), ("✗ Sai (错)", "Cuò")], 0, "Hai người đồng ý đi taxi (坐出租车). Khớp hoàn toàn."),
        ("q-hsk2-01-04", "听对话，判断对错：[女的觉得这件衣服太贵了。]", "Tīng duìhuà, pànduàn duì cuò: [Nǚ de juéde zhè jiàn yīfu tài guì le.]", "Nghe đối thoại: 'Người nữ thấy chiếc áo này đắt quá.'", "男：这件衣服两千块，怎么样？女：太贵了，我们再去别家看看吧。", [("✓ Đúng (对)", "Duì"), ("✗ Sai (错)", "Cuò")], 0, "Người nữ chê đắt: 太贵了."),
        ("q-hsk2-01-05", "听对话，判断对错：[生病的人是李老师。]", "Tīng duìhuà, pànduàn duì cuò: [Shēngbìng de rén shì Lǐ lǎoshī.]", "Nghe đối thoại: 'Người bị ốm là thầy Lý.'", "女：李老师今天怎么没来上班？男：他感冒生病了，在医院看病呢。", [("✓ Đúng (对)", "Duì"), ("✗ Sai (错)", "Cuò")], 0, "Thầy Lý bị cảm ốm: 他感冒生病了.")
    ]
    for qid, prompt, pinyin, trans, script, opts, corr, exp in p1:
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk2-mock-01", "part_type": "listening", "part_number": 1,
            "question_number": len(questions) + 1, "question_type": "true_false",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": script,
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 5
        })

    # Part 2: Chọn tranh / đồ vật (Q6 - Q10)
    p2 = [
        ("q-hsk2-01-06", "听录音，选出说话人提到的运动：", "Tīng lùyīn, xuǎn chū shuōhuà rén tídào de yùndòng:", "Nghe ghi âm, chọn môn thể thao được nhắc tới:", "每天早晨我都去公园跑步半个小时。", [("Chạy bộ (跑步)", "Pǎobù"), ("Bơi lội (游泳)", "Yóuyǒng"), ("Đá bóng (踢足球)", "Tī zúqiú")], 0, "Đang nói về môn chạy bộ: 跑步."),
        ("q-hsk2-01-07", "听录音，选出男的想买的物品：", "Tīng lùyīn, xuǎn chū nán de xiǎng mǎi de wùpǐn:", "Nghe ghi âm, chọn đồ người nam muốn mua:", "女：您需要买点儿什么？男：我想买一件黑色的羽绒服。问：男的想买什么？", [("Áo khoác lông vũ (羽绒服)", "Yǔróngfú"), ("Giày thể thao (运动鞋)", "Yùndòngxié"), ("Mũ nón (帽子)", "Màozi")], 0, "Người nam nói muốn mua 羽绒服."),
        ("q-hsk2-01-08", "听录音，选择人物所在地点：", "Tīng lùyīn, xuǎnzé rénwù suǒzài dìdiǎn:", "Nghe ghi âm, chọn nơi chốn:", "服务员，请给我们拿一份菜单。", [("Nhà hàng (餐馆)", "Cānguǎn"), ("Hiệu sách (书店)", "Shūdiàn"), ("Ngân hàng (银行)", "Yínháng")], 0, "Gọi người phục vụ và xin thực đơn (菜单) là ở nhà hàng."),
        ("q-hsk2-01-09", "听录音，选择交通工具：", "Tīng lùyīn, xuǎnzé jiāotōng gōngjù:", "Nghe ghi âm, chọn phương tiện giao thông:", "路上车太多了，我骑自行车去学校更快。", [("Xe đạp (自行车)", "Zìxíngchē"), ("Tàu điện ngầm (地铁)", "Dìtiě"), ("Xe buýt (公共汽车)", "Gōnggòng qìchē")], 0, "Người nói chọn đi xe đạp: 骑自行车."),
        ("q-hsk2-01-10", "听录音，选出说话人身体不适的部位：", "Tīng lùyīn, xuǎn chū shuōhuà rén shēntǐ búshì de bùwèi:", "Nghe ghi âm, chọn bộ phận cơ thể bị đau:", "我今天眼睛有点儿不舒服，想休息一下。", [("Mắt (眼睛)", "Yǎnjing"), ("Chân (腿)", "Tuǐ"), ("Cánh tay (手臂)", "Shǒubì")], 0, "Nói rõ '眼睛有点儿不舒服' (mắt hơi khó chịu).")
    ]
    for qid, prompt, pinyin, trans, script, opts, corr, exp in p2:
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk2-mock-01", "part_type": "listening", "part_number": 2,
            "question_number": len(questions) + 1, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": script,
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 5
        })

    # Part 3: Đối thoại ngắn MCQ (Q11 - Q15)
    p3 = [
        ("q-hsk2-01-11", "听对话，回答问题：", "Tīng duìhuà, huídá wèntí:", "Nghe đối thoại, trả lời câu hỏi:", "男：这块手表真漂亮，多少钱买的？女：不贵，只要三百多块。问：这块手表多少钱？", [("300 hơn đồng (三百多块)", "Sānbǎi duō kuài"), ("1000 đồng (一千块)", "Yìqiān kuài"), ("500 đồng (五百块)", "Wǔbǎi kuài")], 0, "Người nữ nói: '只要三百多块' (chỉ hơn 300 tệ)."),
        ("q-hsk2-01-12", "听对话，回答问题：", "Tīng duìhuà, huídá wèntí:", "Nghe đối thoại, trả lời câu hỏi:", "女：你学汉语学了多长时间了？男：我已经学了一年多了。问：男的学汉语多久了？", [("Hơn 1 năm (一年多)", "Yì nián duō"), ("Mấy tháng (几个月)", "Jǐ gè yuè"), ("Ba năm (三年)", "Sān nián")], 0, "Đã học hơn 1 năm: 一年多了."),
        ("q-hsk2-01-13", "听对话，回答问题：", "Tīng duìhuà, huídá wèntí:", "Nghe đối thoại, trả lời câu hỏi:", "男：从这里到火车站远吗？女：不远，走路十分钟就到了。问：去火车站远不远？", [("Không xa, đi bộ 10 phút (不远，走路十分钟)", "Bù yuǎn, zǒulù shí fēnzhōng"), ("Rất xa, phải đi xe bus (很远)", "Hěn yuǎn"), ("Cần 1 tiếng (要一个小时)", "Yào yí gè xiǎoshí")], 0, "Người nữ nói không xa, đi bộ 10 phút là tới."),
        ("q-hsk2-01-14", "听对话，回答问题：", "Tīng duìhuà, huídá wèntí:", "Nghe đối thoại, trả lời câu hỏi:", "女：先生，您看这件红色的衣服怎么样？男：颜色很好看，但我更喜欢白色的。问：男的喜欢什么颜色的？", [("Màu trắng (白色的)", "Báisè de"), ("Màu đỏ (红色的)", "Hóngsè de"), ("Màu đen (黑色的)", "Hēisè de")], 0, "Người nam thích màu trắng: 我更喜欢白色的."),
        ("q-hsk2-01-15", "听对话，回答问题：", "Tīng duìhuà, huídá wèntí:", "Nghe đối thoại, trả lời câu hỏi:", "男：听说你要去北京旅游？女：对，下个星期一出发。问：女的什么时候出发？", [("Thứ Hai tuần sau (下个星期一)", "Xià gè xīngqīyī"), ("Hôm nay (今天)", "Jīntiān"), ("Tháng sau (下个月)", "Xià gè yuè")], 0, "Khởi hành vào thứ Hai tuần sau: 下个星期一出发.")
    ]
    for qid, prompt, pinyin, trans, script, opts, corr, exp in p3:
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk2-mock-01", "part_type": "listening", "part_number": 3,
            "question_number": len(questions) + 1, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": script,
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 5
        })

    # Part 4: Đối thoại dài hơn (Q16 - Q20)
    p4 = [
        ("q-hsk2-01-16", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại, trả lời câu hỏi:", "男：小丽，周末有时间一起去打篮球吗？女：不行，这个周末我要准备汉语考试。男：那祝你考出好成绩！问：女的周末要做什么？", [("Chuẩn bị thi tiếng Trung (准备汉语考试)", "Zhǔnbèi Hànyǔ kǎoshì"), ("Đi chơi bóng rổ (去打篮球)", "Qù dǎ lánqiú"), ("Đi xem phim (去看电影)", "Qù kàn diànyǐng")], 0, "Người nữ bận chuẩn bị cho kỳ thi tiếng Trung: 准备汉语考试."),
        ("q-hsk2-01-17", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại, trả lời câu hỏi:", "女：服务员，我们点的西瓜还没上来。男：不好意思，现在客人比较多，我马上给您催一下。问：女的在等什么？", [("Dưa hấu (西瓜)", "Xīguā"), ("Trà (茶)", "Chá"), ("Cơm chiên (炒饭)", "Chǎofàn")], 0, "Món dưa hấu chưa mang lên: 西瓜还没上来."),
        ("q-hsk2-01-18", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại, trả lời câu hỏi:", "男：你每天怎么去公司上班？女：以前我坐公交车，现在我每天骑共享单车，既锻炼身体又环保。问：女的现在怎么上班？", [("Đi xe đạp (骑自行车)", "Qí zìxíngchē"), ("Đi xe bus (坐公交车)", "Zuò gōngjiāochē"), ("Lái xe hơi (开车)", "Kāichē")], 0, "Hiện tại đi xe đạp: 骑共享单车/自行车."),
        ("q-hsk2-01-19", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại, trả lời câu hỏi:", "女：外面风很大，快把窗户关上吧。男：好，今天晚上气温可能降到零度以下呢。问：男的接下来要做什么？", [("Đóng cửa sổ (关上窗户)", "Guānshang chuānghu"), ("Mở cửa sổ (开窗户)", "Kāi chuānghu"), ("Đi ra ngoài (出去)", "Chūqù")], 0, "Người nam sẽ đi đóng cửa sổ theo đề nghị: 把窗户关上."),
        ("q-hsk2-01-20", "听长对话，回答问题：", "Tīng cháng duìhuà, huídá wèntí:", "Nghe hội thoại, trả lời câu hỏi:", "男：喂，王阿姨，大卫在家吗？女：他不在，他跟同学去图书馆借书了，下午四点才回来。问：大卫去了哪里？", [("Thư viện (图书馆)", "Túshūguǎn"), ("Rạp chiếu phim (电影院)", "Diànyǐngyuàn"), ("Bệnh viện (医院)", "Yīyuàn")], 0, "Đến thư viện mượn sách: 去图书馆借书.")
    ]
    for qid, prompt, pinyin, trans, script, opts, corr, exp in p4:
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk2-mock-01", "part_type": "listening", "part_number": 4,
            "question_number": len(questions) + 1, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": script,
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 5
        })

    # Reading: 15 questions (Q21 - Q35)
    r_items = [
        ("q-hsk2-01-21", "选词填空：今天比昨天______多了，快穿上外套吧。", "Xuǎncí tiánkòng: Jīntiān bǐ zuótiān ______ duō le, kuài chuān shang wàitào ba.", "Điền từ câu so sánh 比: Hôm nay lạnh hơn hôm qua nhiều...", [("冷 (Lạnh)", "Lěng"), ("热 (Nóng)", "Rè"), ("远 (Xa)", "Yuǎn"), ("快 (Nhanh)", "Kuài")], 0, "Vế sau bảo mặc áo khoác (快穿上外套), nên chọn '冷' (lạnh). Cấu trúc A + 比 + B + Adj + 多了."),
        ("q-hsk2-01-22", "选词填空：虽然汉语很难，______我非常喜欢。", "Xuǎncí tiánkòng: Suīrán Hànyǔ hěn nán, ______ wǒ fēicháng xǐhuan.", "Điền liên từ nhượng bộ: Tuy tiếng Hán rất khó, ______ tôi rất thích.", [("但是 (Nhưng)", "Dànshì"), ("所以 (Cho nên)", "Suǒyǐ"), ("因为 (Bởi vì)", "Yīnwèi"), ("或者 (Hoặc)", "Huòzhě")], 0, "Cặp liên từ: 虽然...但是... (Tuy...nhưng...)."),
        ("q-hsk2-01-23", "选择正确的动词：他正在教室里______作业呢。", "Xuǎnzé zhèngquè de dòngcí: Tā zhèngzài jiàoshì lǐ ______ zuòyè ne.", "Chọn động từ kết hợp với bài tập (作业):", [("做 (Làm)", "Zuò"), ("吃 (Ăn)", "Chī"), ("买 (Mua)", "Mǎi"), ("听 (Nghe)", "Tīng")], 0, "Cụm cố định: 做作业 (làm bài tập)."),
        ("q-hsk2-01-24", "选词填空：我家离学校很______，每天走路五分钟就到了。", "Xuǎncí tiánkòng: Wǒ jiā lí xuéxiào hěn ______, měitiān zǒulù wǔ fēnzhōng jiù dào le.", "Điền từ chỉ khoảng cách: Nhà tôi cách trường rất ______...", [("近 (Gần)", "Jìn"), ("远 (Xa)", "Yuǎn"), ("高 (Cao)", "Gāo"), ("长 (Dài)", "Cháng")], 0, "Đi bộ 5 phút tới nơi chứng tỏ rất gần: 近 (jìn)."),
        ("q-hsk2-01-25", "选词填空：因为今天下大雨，______我们不去踢足球了。", "Xuǎncí tiánkòng: Yīnwèi jīntiān xià dàyǔ, ______ wǒmen bú qù tī zúqiú le.", "Điền liên từ nguyên nhân - kết quả: Bởi vì hôm nay mưa to, ______ chúng tôi không đi đá bóng nữa.", [("所以 (Cho nên / Vì vậy)", "Suǒyǐ"), ("虽然 (Tuy rằng)", "Suīrán"), ("如果 (Nếu như)", "Rúguǒ"), ("而且 (Hơn nữa)", "Érqiě")], 0, "Cặp liên từ nhân quả: 因为...所以... (Bởi vì...cho nên...)."),
        ("q-hsk2-01-26", "选择补语：这本书我已经看______了，你可以拿去看。", "Xuǎnzé bǔyǔ: Zhè běn shū wǒ yǐjīng kàn ______ le, nǐ kěyǐ ná qù kàn.", "Chọn bổ ngữ kết quả: Cuốn sách này tôi đã đọc ______ rồi...", [("完 (Xong)", "Wán"), ("懂 (Hiểu)", "Dǒng"), ("错 (Sai)", "Cuò"), ("见 (Thấy)", "Jiàn")], 0, "Đọc xong: 看完了."),
        ("q-hsk2-01-27", "选择动词：请大家______进，外边太冷了。", "Xuǎnzé dòngcí: Qǐng dàjiā ______ jìn, wàibian tài lěng le.", "Chọn động từ hướng di chuyển:", [("快 (Mau / Nhanh)", "Kuài"), ("慢 (Chậm)", "Màn"), ("远 (Xa)", "Yuǎn"), ("高 (Cao)", "Gāo")], 0, "Mời mọi người mau vào: 请大家快进."),
        ("q-hsk2-01-28", "选词填空：我想去商店买两______铅笔和一个笔记本。", "Xuǎncí tiánkòng: Wǒ xiǎng qù shāngdiàn mǎi liǎng ______ qiānbǐ hé yí gè bǐjìběn.", "Chọn lượng từ cho bút chì (铅笔):", [("支 (Cây / Chiếc)", "Zhī"), ("本 (Quyển)", "Běn"), ("张 (Tờ)", "Zhāng"), ("块 (Miếng)", "Kuài")], 0, "Lượng từ cho bút là 支: 两支铅笔."),
        ("q-hsk2-01-29", "选词填空：这件衣服太小了，您有______大一点儿的吗？", "Xuǎncí tiánkòng: Zhè jiàn yīfu tài xiǎo le, nín yǒu ______ dà yìdiǎnr de ma?", "Chọn phó từ mức độ:", [("更 (Càng / Hơn)", "Gèng"), ("最 (Nhất)", "Zuì"), ("都 (Đều)", "Dōu"), ("很 (Rất)", "Hěn")], 0, "So sánh hơn: 更大一点儿 (cỡ to hơn một chút)."),
        ("q-hsk2-01-30", "选词填空：王医生，我头疼，应该吃什么______？", "Xuǎncí tiánkòng: Wáng yīshēng, wǒ tóuténg, yīnggāi chī shénme ______?", "Chọn danh từ y tế: Bác sĩ Vương, tôi đau đầu, nên uống ______ gì?", [("药 (Thuốc)", "Yào"), ("茶 (Trà)", "Chá"), ("饭 (Cơm)", "Fàn"), ("菜 (Thức ăn)", "Cài")], 0, "Uống thuốc là 吃药 (chī yào)."),
        ("q-hsk2-01-31", "问答配对：[请问，洗手间在几楼？]", "Wèndá pèiduì: [Qǐngwèn, xǐshǒujiān zài jǐ lóu?]", "Chọn câu đáp lại: 'Xin hỏi, nhà vệ sinh ở tầng mấy?'", [("在二楼，电梯旁边。 (Ở tầng 2, bên cạnh thang máy)", "Zài èr lóu..."), ("我不要。 (Tôi không cần)", "Wǒ bú yào."), ("三十块钱。 (Ba mươi đồng)", "Sānshí kuài."), ("昨天去的。 (Đi hôm qua)", "Zuótiān qù de.")], 0, "Chỉ vị trí tầng: 在二楼."),
        ("q-hsk2-01-32", "阅读理解：[北京的秋天天气最好，不冷也不热，树叶都变黄了，非常漂亮。] 问：北京什么时候天气最好？", "Yuèdú lǐjiě: [Běijīng de qiūtiān tiānqì zuì hǎo...] Wèn: Běijīng shénme shíhou tiānqì zuì hǎo?", "Đọc đoạn văn ngắn: Mùa nào ở Bắc Kinh thời tiết đẹp nhất?", [("秋天 (Mùa thu)", "Qiūtiān"), ("春天 (Mùa xuân)", "Chūntiān"), ("夏天 (Mùa hè)", "Xiàtiān"), ("冬天 (Mùa đông)", "Dōngtiān")], 0, "Đoạn văn viết: 北京的秋天天气最好 (Mùa thu ở Bắc Kinh thời tiết đẹp nhất)."),
        ("q-hsk2-01-33", "阅读理解：[我和哥哥都喜欢运动。我喜欢跑步，哥哥比我更喜欢游泳，他每天都游一个小时。] 问：哥哥喜欢什么运动？", "Yuèdú lǐjiě: Wèn: Gēge xǐhuan shénme yùndòng?", "Đọc hiểu: Người anh trai thích môn thể thao nào?", [("游泳 (Bơi lội)", "Yóuyǒng"), ("跑步 (Chạy bộ)", "Pǎobù"), ("打篮球 (Bóng rổ)", "Dǎ lánqiú"), ("踢足球 (Đá bóng)", "Tī zúqiú")], 0, "Đoạn văn nói rõ: 哥哥比我更喜欢游泳 (Anh trai thích bơi hơn)."),
        ("q-hsk2-01-34", "连词成句：[①比 ②哥哥 ③弟弟 ④高]", "Liáncí chéng jù: [①bǐ ②gēge ③dìdi ④gāo]", "Sắp xếp câu so sánh đúng:", [("②①③④ (哥哥比弟弟高。)", "Gēge bǐ dìdi gāo."), ("①③②④ (比弟弟哥哥高。)", "Bǐ dìdi gēge gāo."), ("③④①② (弟弟高比哥哥。)", "Dìdi gāo bǐ gēge."), ("②④①③ (哥哥高比弟弟。)", "Gēge gāo bǐ dìdi.")], 0, "Cấu trúc: A + 比 + B + Tính từ (哥哥比弟弟高。)."),
        ("q-hsk2-01-35", "阅读判断：[小王今天穿了一件新的白衬衫，非常帅。] 问：小王今天穿了什么？", "Yuèdú pànduàn: Wèn: Xiǎowáng jīntiān chuān le shénme?", "Đọc hiểu: Hôm nay Tiểu Vương mặc trang phục gì?", [("白衬衫 (Áo sơ mi trắng)", "Bái chènshān"), ("红外套 (Áo khoác đỏ)", "Hóng wàitào"), ("黑毛衣 (Áo len đen)", "Hēi máoyī"), ("运动裤 (Quần thể thao)", "Yùndòngkù")], 0, "Nội dung: 穿了一件新的白衬衫 (mặc chiếc áo sơ mi trắng mới).")
    ]
    for qid, prompt, pinyin, trans, opts, corr, exp in r_items:
        options = [{"text": o[0], "pinyin": o[1], "translation": o[0]} for o in opts]
        questions.append({
            "id": qid, "exam_id": "hsk2-mock-01", "part_type": "reading", "part_number": 2,
            "question_number": len(questions) + 1, "question_type": "multiple_choice",
            "prompt": prompt, "pinyin": pinyin, "translation": trans, "audio_url": "", "audio_script": "",
            "options": options, "correct_option_index": corr, "explanation": exp, "points": 6
        })

    return questions

print("HSK 2 questions generated:", len(get_hsk2_mock01_questions()))
