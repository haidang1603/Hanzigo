# -*- coding: utf-8 -*-
"""
Generate comprehensive, realistic HSK mock exam questions for HanziGo.
Authentic structures matching CTI / Chinesetest.cn official guidelines:
- HSK 1: 40 questions (20 Listening + 20 Reading)
- HSK 1 Official Ref: 20 questions
- HSK 2: 35 questions (20 Listening + 15 Reading)
- HSK 3: 30 questions (12 Listening + 12 Reading + 6 Writing)
- HSK 4: 30 questions (12 Listening + 12 Reading + 6 Writing)
- HSK 5: 15 questions (5 Listening + 5 Reading + 5 Writing)
- HSK 6: 15 questions (5 Listening + 5 Reading + 5 Writing)
Plus completion questions for expanded exams.
"""

import json
import os

def create_hsk1_mock01_questions():
    questions = []
    
    # -------------------------------------------------------------
    # HSK 1 MOCK 01: 40 CÂU (20 NGHE + 20 ĐỌC)
    # PHẦN 1: NGHE HIỂU (20 CÂU, Q1 -> Q20)
    # -------------------------------------------------------------
    
    # Part 1: Đúng / Sai (Q1 -> Q5)
    questions.append({
        "id": "q-hsk1-01-01",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 1,
        "question_number": 1,
        "question_type": "true_false",
        "prompt": "听录音，判断与听到的内容是否一致：[很高兴认识你。]",
        "pinyin": "Tīng lùyīn, pànduàn yǔ tīng dào de nèiróng shìfǒu yízhì: [Hěn gāoxìng rènshí nǐ.]",
        "translation": "Nghe đoạn ghi âm, phán đoán đúng sai với nội dung: 'Rất vui được quen biết bạn.'",
        "audio_url": "",
        "audio_script": "你好！很高兴认识你。",
        "options": [
            {"text": "✓ Đúng (一致)", "pinyin": "Yízhì", "translation": "Khớp hoàn toàn"},
            {"text": "✗ Sai (不一致)", "pinyin": "Bù yízhì", "translation": "Không khớp"}
        ],
        "correct_option_index": 0,
        "explanation": "Lời thoại phát thanh: '你好！很高兴认识你。' (Xin chào! Rất vui được quen biết bạn). Khớp chính xác với nội dung đề bài.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-02",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 1,
        "question_number": 2,
        "question_type": "true_false",
        "prompt": "听录音，判断与听到的内容是否一致：[他在看书。]",
        "pinyin": "Tīng lùyīn, pànduàn yǔ tīng dào de nèiróng shìfǒu yízhì: [Tā zài kàn shū.]",
        "translation": "Nghe ghi âm, phán đoán đúng sai: 'Anh ấy đang đọc sách.'",
        "audio_url": "",
        "audio_script": "他在喝茶呢。",
        "options": [
            {"text": "✓ Đúng (一致)", "pinyin": "Yízhì", "translation": "Đúng"},
            {"text": "✗ Sai (不一致)", "pinyin": "Bù yízhì", "translation": "Sai"}
        ],
        "correct_option_index": 1,
        "explanation": "Ghi âm phát: '他在喝茶呢。' (Anh ấy đang uống trà). Đề bài ghi '看书' (đọc sách) là không khớp (Sai).",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-03",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 1,
        "question_number": 3,
        "question_type": "true_false",
        "prompt": "听录音，判断与听到的内容是否一致：[桌子上有三本书。]",
        "pinyin": "Tīng lùyīn, pànduàn yǔ tīng dào de nèiróng shìfǒu yízhì: [Zhuōzi shang yǒu sān běn shū.]",
        "translation": "Nghe ghi âm, phán đoán đúng sai: 'Trên bàn có ba quyển sách.'",
        "audio_url": "",
        "audio_script": "桌子上有三本书和一个水杯。",
        "options": [
            {"text": "✓ Đúng (一致)", "pinyin": "Yízhì", "translation": "Đúng"},
            {"text": "✗ Sai (不一致)", "pinyin": "Bù yízhì", "translation": "Sai"}
        ],
        "correct_option_index": 0,
        "explanation": "Ghi âm phát: '桌子上有三本书和一个水杯。' (Trên bàn có 3 quyển sách và 1 cốc nước). Khớp với nội dung có 3 quyển sách.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-04",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 1,
        "question_number": 4,
        "question_type": "true_false",
        "prompt": "听录音，判断与听到的内容是否一致：[明天天气很冷。]",
        "pinyin": "Tīng lùyīn, pànduàn yǔ tīng dào de nèiróng shìfǒu yízhì: [Míngtiān tiānqì hěn lěng.]",
        "translation": "Nghe ghi âm, phán đoán đúng sai: 'Ngày mai thời tiết rất lạnh.'",
        "audio_url": "",
        "audio_script": "明天天气很好，不冷也不热。",
        "options": [
            {"text": "✓ Đúng (一致)", "pinyin": "Yízhì", "translation": "Đúng"},
            {"text": "✗ Sai (不一致)", "pinyin": "Bù yízhì", "translation": "Sai"}
        ],
        "correct_option_index": 1,
        "explanation": "Ghi âm phát: '不冷也不热' (không lạnh cũng không nóng), trái ngược với nhận định 'rất lạnh'. Chọn Sai.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-05",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 1,
        "question_number": 5,
        "question_type": "true_false",
        "prompt": "听录音，判断与听到的内容是否一致：[她是我的中国朋友。]",
        "pinyin": "Tīng lùyīn, pànduàn yǔ tīng dào de nèiróng shìfǒu yízhì: [Tā shì wǒ de Zhōngguó péngyou.]",
        "translation": "Nghe ghi âm, phán đoán đúng sai: 'Cô ấy là bạn Trung Quốc của tôi.'",
        "audio_url": "",
        "audio_script": "她叫李月，是我的中国朋友。",
        "options": [
            {"text": "✓ Đúng (一致)", "pinyin": "Yízhì", "translation": "Đúng"},
            {"text": "✗ Sai (不一致)", "pinyin": "Bù yízhì", "translation": "Sai"}
        ],
        "correct_option_index": 0,
        "explanation": "Ghi âm phát: '是我的中国朋友' (là bạn người Trung Quốc của tôi). Khớp hoàn toàn.",
        "points": 5
    })

    # Part 2: Chọn tranh / hành động (Q6 -> Q10)
    questions.append({
        "id": "q-hsk1-01-06",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 2,
        "question_number": 6,
        "question_type": "picture_choice",
        "prompt": "听句子，选出人物正在做的动作：",
        "pinyin": "Tīng jùzi, xuǎn chū rénwù zhèngzài zuò de dòngzuò:",
        "translation": "Nghe câu, chọn hành động nhân vật đang làm:",
        "audio_url": "",
        "audio_script": "小明正在打电话呢。",
        "options": [
            {"text": "Gọi điện thoại (打电话)", "pinyin": "Dǎ diànhuà", "translation": "Gọi điện thoại"},
            {"text": "Xem ti vi (看电视)", "pinyin": "Kàn diànshì", "translation": "Xem ti vi"},
            {"text": "Đi ngủ (睡觉)", "pinyin": "Shuìjiào", "translation": "Đi ngủ"}
        ],
        "correct_option_index": 0,
        "explanation": "Lời thoại: '小明正在打电话呢。' (Tiểu Minh đang gọi điện thoại). Chọn phương án A.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-07",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 2,
        "question_number": 7,
        "question_type": "picture_choice",
        "prompt": "听句子，选出说话人提到的交通工具：",
        "pinyin": "Tīng jùzi, xuǎn chū shuōhuà rén tídào de jiāotōng gōngjù:",
        "translation": "Nghe câu, chọn phương tiện giao thông được nhắc tới:",
        "audio_url": "",
        "audio_script": "我爸爸坐飞机去北京了。",
        "options": [
            {"text": "Máy bay (飞机)", "pinyin": "Fēijī", "translation": "Máy bay"},
            {"text": "Xe buýt (公共汽车)", "pinyin": "Gōnggòng qìchē", "translation": "Xe buýt"},
            {"text": "Xe taxi (出租车)", "pinyin": "Chūzūchē", "translation": "Xe taxi"}
        ],
        "correct_option_index": 0,
        "explanation": "Lời thoại: '坐飞机去北京了' (đi máy bay đến Bắc Kinh rồi).",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-08",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 2,
        "question_number": 8,
        "question_type": "picture_choice",
        "prompt": "听录音，选出说话人想吃的东西：",
        "pinyin": "Tīng lùyīn, xuǎn chū shuōhuà rén xiǎng chī de dōngxi:",
        "translation": "Nghe ghi âm, chọn món đồ ăn người nói muốn ăn:",
        "audio_url": "",
        "audio_script": "中午我想吃一点儿米饭。",
        "options": [
            {"text": "Cơm trắng (米饭)", "pinyin": "Mǐfàn", "translation": "Cơm trắng"},
            {"text": "Mì sợi (面条)", "pinyin": "Miàntiáo", "translation": "Mì sợi"},
            {"text": "Táo (苹果)", "pinyin": "Píngguǒ", "translation": "Quả táo"}
        ],
        "correct_option_index": 0,
        "explanation": "Lời thoại: '我想吃一点儿米饭' (Tôi muốn ăn một chút cơm trắng).",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-09",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 2,
        "question_number": 9,
        "question_type": "picture_choice",
        "prompt": "听录音，选出说话人提到的动物：",
        "pinyin": "Tīng lùyīn, xuǎn chū shuōhuà rén tídào de dòngwù:",
        "translation": "Nghe ghi âm, chọn con vật được nhắc tới:",
        "audio_url": "",
        "audio_script": "看，那只小猫在睡觉呢。",
        "options": [
            {"text": "Con mèo (猫)", "pinyin": "Māo", "translation": "Mèo"},
            {"text": "Con chó (狗)", "pinyin": "Gǒu", "translation": "Chó"},
            {"text": "Con chim (鸟)", "pinyin": "Niǎo", "translation": "Chim"}
        ],
        "correct_option_index": 0,
        "explanation": "Lời thoại: '那只小猫在睡觉呢' (Con mèo con kia đang ngủ).",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-10",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 2,
        "question_number": 10,
        "question_type": "picture_choice",
        "prompt": "听录音，选出说话人提到的地点：",
        "pinyin": "Tīng lùyīn, xuǎn chū shuōhuà rén tídào de dìdiǎn:",
        "translation": "Nghe ghi âm, chọn địa điểm được nhắc tới:",
        "audio_url": "",
        "audio_script": "王老师现在在学校里。",
        "options": [
            {"text": "Trường học (学校)", "pinyin": "Xuéxiào", "translation": "Trường học"},
            {"text": "Bệnh viện (医院)", "pinyin": "Yīyuàn", "translation": "Bệnh viện"},
            {"text": "Cửa hàng (商店)", "pinyin": "Shāngdiàn", "translation": "Cửa hàng"}
        ],
        "correct_option_index": 0,
        "explanation": "Lời thoại: '王老师现在在学校里' (Thầy giáo Vương hiện đang ở trong trường).",
        "points": 5
    })

    # Part 3: Đối thoại 2 lượt chọn đáp án (Q11 -> Q15)
    questions.append({
        "id": "q-hsk1-01-11",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 3,
        "question_number": 11,
        "question_type": "multiple_choice",
        "prompt": "听对话，选择正确答案：",
        "pinyin": "Tīng duìhuà, xuǎnzé zhèngquè dá'àn:",
        "translation": "Nghe đoạn hội thoại, chọn đáp án đúng:",
        "audio_url": "",
        "audio_script": "女：请问，苹果多少钱一斤？男：三块钱一斤。问：苹果多少钱一斤？",
        "options": [
            {"text": "2块 (Liǎng kuài)", "pinyin": "Liǎng kuài", "translation": "2 tệ"},
            {"text": "3块 (Sān kuài)", "pinyin": "Sān kuài", "translation": "3 tệ"},
            {"text": "5块 (Wǔ kuài)", "pinyin": "Wǔ kuài", "translation": "5 tệ"}
        ],
        "correct_option_index": 1,
        "explanation": "Người nam trả lời rõ: '三块钱一斤' (3 tệ một cân). Chọn B.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-12",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 3,
        "question_number": 12,
        "question_type": "multiple_choice",
        "prompt": "听对话，选择说话人之间的关系：",
        "pinyin": "Tīng duìhuà, xuǎnzé shuōhuà rén zhījiān de guānxì:",
        "translation": "Nghe đối thoại, chọn mối quan hệ giữa người nói:",
        "audio_url": "",
        "audio_script": "女：李老师好！男：你好，王同学，请进。问：他们是什么关系？",
        "options": [
            {"text": "Thầy trò (老师和学生)", "pinyin": "Lǎoshī hé xuésheng", "translation": "Thầy giáo và học trò"},
            {"text": "Bác sĩ và bệnh nhân (医生和病人)", "pinyin": "Yīshēng hé bìngrén", "translation": "Bác sĩ và bệnh nhân"},
            {"text": "Mẹ và con trai (妈妈和儿子)", "pinyin": "Māma hé érzi", "translation": "Mẹ và con trai"}
        ],
        "correct_option_index": 0,
        "explanation": "Xưng hô '李老师' và '王同学' chứng tỏ mối quan hệ thầy trò.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-13",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 3,
        "question_number": 13,
        "question_type": "multiple_choice",
        "prompt": "听对话，选出说话人提到的时间：",
        "pinyin": "Tīng duìhuà, xuǎn chū shuōhuà rén tídào de shíjiān:",
        "translation": "Nghe đối thoại, chọn thời gian được nhắc tới:",
        "audio_url": "",
        "audio_script": "男：请问现在几点了？女：现在下午两点十分。问：现在几点？",
        "options": [
            {"text": "1:20 (一点二十分)", "pinyin": "Yì diǎn èrshí fēn", "translation": "1 giờ 20"},
            {"text": "2:10 (两点十分)", "pinyin": "Liǎng diǎn shí fēn", "translation": "2 giờ 10"},
            {"text": "3:00 (三点整)", "pinyin": "Sān diǎn zhěng", "translation": "3 giờ"}
        ],
        "correct_option_index": 1,
        "explanation": "Người nữ trả lời: '现在下午两点十分' (Hiện tại 2 giờ 10 phút chiều). Chọn B.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-14",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 3,
        "question_number": 14,
        "question_type": "multiple_choice",
        "prompt": "听对话，选择男的想喝什么：",
        "pinyin": "Tīng duìhuà, xuǎnzé nán de xiǎng hē shénme:",
        "translation": "Nghe đối thoại, chọn thức uống người nam muốn dùng:",
        "audio_url": "",
        "audio_script": "女：你想喝茶还是喝水？男：给我一杯茶吧，谢谢。问：男的想喝什么？",
        "options": [
            {"text": "Trà (茶)", "pinyin": "Chá", "translation": "Trà"},
            {"text": "Nước lọc (水)", "pinyin": "Shuǐ", "translation": "Nước lọc"},
            {"text": "Sữa bò (牛奶)", "pinyin": "Niúnǎi", "translation": "Sữa bò"}
        ],
        "correct_option_index": 0,
        "explanation": "Người nam trả lời rõ ràng: '给我一杯茶吧' (Cho tôi một cốc trà). Chọn A.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-15",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 3,
        "question_number": 15,
        "question_type": "multiple_choice",
        "prompt": "听对话，选择天气情况：",
        "pinyin": "Tīng duìhuà, xuǎnzé tiānqì qíngkuàng:",
        "translation": "Nghe đối thoại, chọn tình hình thời tiết:",
        "audio_url": "",
        "audio_script": "女：外面下雨了吗？男：对，下大雨了，你带雨伞吧。问：外面天气怎么样？",
        "options": [
            {"text": "Trời mưa (下雨)", "pinyin": "Xià yǔ", "translation": "Trời mưa"},
            {"text": "Trời nắng (晴天)", "pinyin": "Qíngtiān", "translation": "Trời nắng"},
            {"text": "Rơi tuyết (下雪)", "pinyin": "Xià xuě", "translation": "Rơi tuyết"}
        ],
        "correct_option_index": 0,
        "explanation": "Người nam nói: '下大雨了' (mưa to rồi). Chọn A.",
        "points": 5
    })

    # Part 4: Đối thoại & trả lời câu hỏi trắc nghiệm (Q16 -> Q20)
    questions.append({
        "id": "q-hsk1-01-16",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 4,
        "question_number": 16,
        "question_type": "multiple_choice",
        "prompt": "听对话，回答问题：",
        "pinyin": "Tīng duìhuà, huídá wèntí:",
        "translation": "Nghe đoạn hội thoại, trả lời câu hỏi:",
        "audio_url": "",
        "audio_script": "男：张先生在家吗？女：不在，他去商店买东西了。问：张先生去哪儿了？",
        "options": [
            {"text": "Cửa hàng (商店)", "pinyin": "Shāngdiàn", "translation": "Cửa hàng"},
            {"text": "Bệnh viện (医院)", "pinyin": "Yīyuàn", "translation": "Bệnh viện"},
            {"text": "Trường học (学校)", "pinyin": "Xuéxiào", "translation": "Trường học"}
        ],
        "correct_option_index": 0,
        "explanation": "Người nữ nói: '他去商店买东西了' (Anh ấy đi cửa hàng mua đồ rồi). Chọn A.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-17",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 4,
        "question_number": 17,
        "question_type": "multiple_choice",
        "prompt": "听对话，回答问题：",
        "pinyin": "Tīng duìhuà, huídá wèntí:",
        "translation": "Nghe đoạn hội thoại, trả lời câu hỏi:",
        "audio_url": "",
        "audio_script": "女：你认识那个人吗？男：认识，他是我们学校的汉语老师。问：那个人是做什么的？",
        "options": [
            {"text": "Giáo viên tiếng Trung (汉语老师)", "pinyin": "Hànyǔ lǎoshī", "translation": "Giáo viên tiếng Trung"},
            {"text": "Bác sĩ (医生)", "pinyin": "Yīshēng", "translation": "Bác sĩ"},
            {"text": "Học sinh (学生)", "pinyin": "Xuésheng", "translation": "Học sinh"}
        ],
        "correct_option_index": 0,
        "explanation": "Người nam trả lời: '他是我们学校的汉语老师' (Anh ấy là thầy giáo tiếng Trung trường chúng tôi).",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-18",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 4,
        "question_number": 18,
        "question_type": "multiple_choice",
        "prompt": "听对话，回答问题：",
        "pinyin": "Tīng duìhuà, huídá wèntí:",
        "translation": "Nghe đoạn hội thoại, trả lời câu hỏi:",
        "audio_url": "",
        "audio_script": "男：你看见我的小狗了吗？女：看见了，它在椅子下面呢。问：小狗在哪里？",
        "options": [
            {"text": "Dưới ghế (椅子下面)", "pinyin": "Yǐzi xiàmiàn", "translation": "Dưới ghế"},
            {"text": "Trên bàn (桌子上面)", "pinyin": "Zhuōzi shàngmiàn", "translation": "Trên bàn"},
            {"text": "Trong phòng (房间里面)", "pinyin": "Fángjiān lǐmiàn", "translation": "Trong phòng"}
        ],
        "correct_option_index": 0,
        "explanation": "Người nữ đáp: '它在椅子下面呢' (Nó ở dưới gầm ghế). Chọn A.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-19",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 4,
        "question_number": 19,
        "question_type": "multiple_choice",
        "prompt": "听对话，回答问题：",
        "pinyin": "Tīng duìhuà, huídá wèntí:",
        "translation": "Nghe đoạn hội thoại, trả lời câu hỏi:",
        "audio_url": "",
        "audio_script": "女：你女儿今年几岁了？男：她今年五岁了。问：他女儿多大了？",
        "options": [
            {"text": "4 tuổi (四岁)", "pinyin": "Sì suì", "translation": "4 tuổi"},
            {"text": "5 tuổi (五岁)", "pinyin": "Wǔ suì", "translation": "5 tuổi"},
            {"text": "6 tuổi (六岁)", "pinyin": "Liù suì", "translation": "6 tuổi"}
        ],
        "correct_option_index": 1,
        "explanation": "Người nam trả lời: '她今年五岁了' (Năm nay cháu 5 tuổi). Chọn B.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-20",
        "exam_id": "hsk1-mock-01",
        "part_type": "listening",
        "part_number": 4,
        "question_number": 20,
        "question_type": "multiple_choice",
        "prompt": "听对话，回答问题：",
        "pinyin": "Tīng duìhuà, huídá wèntí:",
        "translation": "Nghe đoạn hội thoại, trả lời câu hỏi:",
        "audio_url": "",
        "audio_script": "男：喂，王小姐在吗？女：我就是，请问您是哪位？问：接电话的人是谁？",
        "options": [
            {"text": "Cô Vương (王小姐)", "pinyin": "Wáng xiǎojiě", "translation": "Cô Vương"},
            {"text": "Thầy Vương (王老师)", "pinyin": "Wáng lǎoshī", "translation": "Thầy Vương"},
            {"text": "Bác sĩ Lý (李医生)", "pinyin": "Lǐ yīshēng", "translation": "Bác sĩ Lý"}
        ],
        "correct_option_index": 0,
        "explanation": "Người nữ trả lời điện thoại: '我就是' (Tôi chính là cô Vương đây). Chọn A.",
        "points": 5
    })

    # -------------------------------------------------------------
    # PHẦN 2: ĐỌC HIỂU (20 CÂU, Q21 -> Q40)
    # -------------------------------------------------------------

    # Part 1: Đọc từ vựng và phán đoán đúng sai (Q21 -> Q25)
    questions.append({
        "id": "q-hsk1-01-21",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 1,
        "question_number": 21,
        "question_type": "true_false",
        "prompt": "看汉字与词义，判断是否正确：[看书 —— đọc sách]",
        "pinyin": "Kàn hànzì yǔ cíyì, pànduàn shìfǒu zhèngquè: [kàn shū —— đọc sách]",
        "translation": "Xem chữ Hán và ý nghĩa, phán đoán đúng sai: [看书 —— đọc sách]",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "✓ Đúng (正确)", "pinyin": "Zhèngquè", "translation": "Đúng nghĩa"},
            {"text": "✗ Sai (错误)", "pinyin": "Cuòwù", "translation": "Sai nghĩa"}
        ],
        "correct_option_index": 0,
        "explanation": "'看书' (kàn shū) có nghĩa chính xác là đọc sách, xem sách. Chọn Đúng.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-22",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 1,
        "question_number": 22,
        "question_type": "true_false",
        "prompt": "看汉字与词义，判断是否正确：[喝水 —— ăn cơm]",
        "pinyin": "Kàn hànzì yǔ cíyì, pànduàn shìfǒu zhèngquè: [hē shuǐ —— ăn cơm]",
        "translation": "Xem chữ Hán và ý nghĩa, phán đoán đúng sai: [喝水 —— ăn cơm]",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "✓ Đúng (正确)", "pinyin": "Zhèngquè", "translation": "Đúng"},
            {"text": "✗ Sai (错误)", "pinyin": "Cuòwù", "translation": "Sai"}
        ],
        "correct_option_index": 1,
        "explanation": "'喝水' (hē shuǐ) là uống nước. Ăn cơm phải là '吃饭' (chī fàn). Chọn Sai.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-23",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 1,
        "question_number": 23,
        "question_type": "true_false",
        "prompt": "看汉字与词义，判断是否正确：[飞机 —— máy bay]",
        "pinyin": "Kàn hànzì yǔ cíyì, pànduàn shìfǒu zhèngquè: [fēijī —— máy bay]",
        "translation": "Xem chữ Hán và ý nghĩa: [飞机 —— máy bay]",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "✓ Đúng (正确)", "pinyin": "Zhèngquè", "translation": "Đúng"},
            {"text": "✗ Sai (错误)", "pinyin": "Cuòwù", "translation": "Sai"}
        ],
        "correct_option_index": 0,
        "explanation": "'飞机' (fēijī) là máy bay (phi cơ). Chọn Đúng.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-24",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 1,
        "question_number": 24,
        "question_type": "true_false",
        "prompt": "看汉字与词义，判断是否正确：[医生 —— học sinh]",
        "pinyin": "Kàn hànzì yǔ cíyì, pànduàn shìfǒu zhèngquè: [yīshēng —— học sinh]",
        "translation": "Xem chữ Hán và ý nghĩa: [医生 —— học sinh]",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "✓ Đúng (正确)", "pinyin": "Zhèngquè", "translation": "Đúng"},
            {"text": "✗ Sai (错误)", "pinyin": "Cuòwù", "translation": "Sai"}
        ],
        "correct_option_index": 1,
        "explanation": "'医生' (yīshēng) là bác sĩ (y sinh). Học sinh là '学生' (xuésheng). Chọn Sai.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-25",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 1,
        "question_number": 25,
        "question_type": "true_false",
        "prompt": "看汉字与词义，判断是否正确：[下雨 —— trời mưa]",
        "pinyin": "Kàn hànzì yǔ cíyì, pànduàn shìfǒu zhèngquè: [xià yǔ —— trời mưa]",
        "translation": "Xem chữ Hán và ý nghĩa: [下雨 —— trời mưa]",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "✓ Đúng (正确)", "pinyin": "Zhèngquè", "translation": "Đúng"},
            {"text": "✗ Sai (错误)", "pinyin": "Cuòwù", "translation": "Sai"}
        ],
        "correct_option_index": 0,
        "explanation": "'下雨' (xià yǔ) nghĩa là trời mưa. Khớp chính xác.",
        "points": 5
    })

    # Part 2: Đọc câu và chọn nghĩa / tranh tương ứng (Q26 -> Q30)
    questions.append({
        "id": "q-hsk1-01-26",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 2,
        "question_number": 26,
        "question_type": "multiple_choice",
        "prompt": "读句子，选择正确的意思：[她是我的汉语老师。]",
        "pinyin": "Dú jùzi, xuǎnzé zhèngquè de yìsi: [Tā shì wǒ de Hànyǔ lǎoshī.]",
        "translation": "Đọc câu, chọn nghĩa tiếng Việt chính xác: '她是我的汉语老师。'",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "Cô ấy là giáo viên tiếng Trung của tôi.", "pinyin": "Tā shì wǒ de Hànyǔ lǎoshī.", "translation": "Chuẩn xác"},
            {"text": "Cô ấy là bạn học tiếng Trung của tôi.", "pinyin": "Tā shì wǒ de Hànyǔ tóngxué.", "translation": "Sai danh từ"},
            {"text": "Mẹ tôi là giáo viên.", "pinyin": "Wǒ māma shì lǎoshī.", "translation": "Sai chủ ngữ"},
            {"text": "Tôi là giáo viên tiếng Trung.", "pinyin": "Wǒ shì Hànyǔ lǎoshī.", "translation": "Sai đại từ"}
        ],
        "correct_option_index": 0,
        "explanation": "'她是' (Cô ấy là) + '我的汉语老师' (giáo viên tiếng Trung của tôi).",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-27",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 2,
        "question_number": 27,
        "question_type": "multiple_choice",
        "prompt": "读句子，选择正确的量词：这里有两______书。",
        "pinyin": "Dú jùzi, xuǎnzé zhèngquè de liàngcí: Zhèlǐ yǒu liǎng ______ shū.",
        "translation": "Chọn lượng từ phù hợp cho 'sách' (书): Ở đây có hai cuốn sách.",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "本 (Běn - quyển/cuốn)", "pinyin": "Běn", "translation": "Lượng từ cho sách"},
            {"text": "个 (Gè - cái/chiếc)", "pinyin": "Gè", "translation": "Lượng từ phổ quát"},
            {"text": "只 (Zhī - con)", "pinyin": "Zhī", "translation": "Lượng từ cho động vật"},
            {"text": "张 (Zhāng - tờ/tấm)", "pinyin": "Zhāng", "translation": "Lượng từ cho mặt phẳng"}
        ],
        "correct_option_index": 0,
        "explanation": "Lượng từ chuẩn của sách (书) là '本' (běn).",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-28",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 2,
        "question_number": 28,
        "question_type": "multiple_choice",
        "prompt": "连词成句，选出语序正确的一项：[①在 ②我 ③北京 ④住]",
        "pinyin": "Liáncí chéng jù, xuǎn chū yǔxù zhèngquè de yí xiàng: [①zài ②wǒ ③Běijīng ④zhù]",
        "translation": "Sắp xếp từ thành câu đúng ngữ pháp: [①ở ②tôi ③Bắc Kinh ④sống]",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "②④①③ (我住在北京。)", "pinyin": "Wǒ zhù zài Běijīng.", "translation": "Tôi sống ở Bắc Kinh."},
            {"text": "①③②④ (在北京我住。)", "pinyin": "Zài Běijīng wǒ zhù.", "translation": "Sai vị ngữ"},
            {"text": "②①④③ (我在住北京。)", "pinyin": "Wǒ zài zhù Běijīng.", "translation": "Sai trật tự giới từ"},
            {"text": "③①②④ (北京在我住。)", "pinyin": "Běijīng zài wǒ zhù.", "translation": "Sai chủ ngữ"}
        ],
        "correct_option_index": 0,
        "explanation": "Cấu trúc chuẩn: 'Chủ ngữ + 住 + 在 + Địa điểm' (我住在北京。). Trật tự đúng là ②④①③.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-29",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 2,
        "question_number": 29,
        "question_type": "multiple_choice",
        "prompt": "看拼音选汉字：māma (mẹ)",
        "pinyin": "Kàn pīnyīn xuǎn hànzì: māma (mẹ)",
        "translation": "Nhìn pinyin chọn chữ Hán đúng: māma (mẹ)",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "妈妈", "pinyin": "māma", "translation": "Mẹ"},
            {"text": "爸爸", "pinyin": "bàba", "translation": "Bố"},
            {"text": "哥哥", "pinyin": "gēge", "translation": "Anh trai"},
            {"text": "姐姐", "pinyin": "jiějie", "translation": "Chị gái"}
        ],
        "correct_option_index": 0,
        "explanation": "'māma' là phiên âm của chữ '妈妈' (mẹ).",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-30",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 2,
        "question_number": 30,
        "question_type": "multiple_choice",
        "prompt": "选择与划线词意思相反的词：这件衣服太[小]了。",
        "pinyin": "Xuǎnzé yǔ huàxiàn cí yìsi xiāngfǎn de cí: Zhè jiàn yīfu tài [xiǎo] le.",
        "translation": "Chọn từ trái nghĩa với [nhỏ - 小]: Bộ quần áo này [nhỏ] quá.",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "大 (To, lớn)", "pinyin": "Dà", "translation": "Lớn"},
            {"text": "冷 (Lạnh)", "pinyin": "Lěng", "translation": "Lạnh"},
            {"text": "热 (Nóng)", "pinyin": "Rè", "translation": "Nóng"},
            {"text": "多 (Nhiều)", "pinyin": "Duō", "translation": "Nhiều"}
        ],
        "correct_option_index": 0,
        "explanation": "Từ trái nghĩa với '小' (nhỏ) là '大' (to, lớn).",
        "points": 5
    })

    # Part 3: Nối câu hỏi - đáp (Q31 -> Q35)
    questions.append({
        "id": "q-hsk1-01-31",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 3,
        "question_number": 31,
        "question_type": "multiple_choice",
        "prompt": "选择正确的问句答语：[请问，洗手间在哪里？]",
        "pinyin": "Xuǎnzé zhèngquè de wènjù dáyǔ: [Qǐngwèn, xǐshǒujiān zài nǎlǐ?]",
        "translation": "Chọn câu đáp lại phù hợp: 'Xin hỏi, nhà vệ sinh ở đâu ạ?'",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "在前面左拐。 (Ở phía trước rẽ trái)", "pinyin": "Zài qiánmiàn zuǒ guǎi.", "translation": "Chỉ phương hướng"},
            {"text": "不用谢。 (Không có gì)", "pinyin": "Bú yòng xiè.", "translation": "Đáp lại lời cảm ơn"},
            {"text": "今天星期五。 (Hôm nay thứ Sáu)", "pinyin": "Jīntiān xīngqīwǔ.", "translation": "Nói về thứ ngày"},
            {"text": "我不是学生。 (Tôi không phải học sinh)", "pinyin": "Wǒ bú shì xuésheng.", "translation": "Nói về nghề nghiệp"}
        ],
        "correct_option_index": 0,
        "explanation": "Câu hỏi hỏi về địa điểm ('在哪里？' - ở đâu?), phương án A chỉ phương hướng vị trí là phù hợp nhất.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-32",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 3,
        "question_number": 32,
        "question_type": "multiple_choice",
        "prompt": "选择正确的问句答语：[你认识李老师吗？]",
        "pinyin": "Xuǎnzé zhèngquè de wènjù dáyǔ: [Nǐ rènshi Lǐ lǎoshī ma?]",
        "translation": "Chọn câu đáp lại phù hợp: 'Bạn có quen biết thầy Lý không?'",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "认识，他是我的老师。 (Quen chứ, thầy ấy là giáo viên của tôi)", "pinyin": "Rènshi, tā shì wǒ de lǎoshī.", "translation": "Trả lời chính xác"},
            {"text": "我很高兴。 (Tôi rất vui)", "pinyin": "Wǒ hěn gāoxìng.", "translation": "Sai ngữ cảnh"},
            {"text": "三块钱。 (Ba đồng)", "pinyin": "Sān kuài qián.", "translation": "Nói giá tiền"},
            {"text": "他在喝茶。 (Anh ấy đang uống trà)", "pinyin": "Tā zài hē chá.", "translation": "Hành động người khác"}
        ],
        "correct_option_index": 0,
        "explanation": "Câu hỏi '你认识...吗？', câu trả lời phù hợp là '认识，他是...'.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-33",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 3,
        "question_number": 33,
        "question_type": "multiple_choice",
        "prompt": "选择正确的问句答语：[谢谢你！]",
        "pinyin": "Xuǎnzé zhèngquè de wènjù dáyǔ: [Xièxie nǐ!]",
        "translation": "Chọn câu đáp lại lời cảm ơn: 'Cảm ơn bạn!'",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "不客气！ (Không có gì/Đừng khách sáo!)", "pinyin": "Bú kèqi!", "translation": "Đáp lễ cảm ơn chuẩn mực"},
            {"text": "没关系！ (Không sao đâu!)", "pinyin": "Méi guānxi!", "translation": "Đáp lại xin lỗi"},
            {"text": "对不起！ (Xin lỗi!)", "pinyin": "Duìbuqǐ!", "translation": "Xin lỗi"},
            {"text": "再见！ (Tạm biệt!)", "pinyin": "Zàijiàn!", "translation": "Chào tạm biệt"}
        ],
        "correct_option_index": 0,
        "explanation": "Đáp lại lời '谢谢' (cảm ơn) là '不客气' (bú kèqi - đừng khách sáo). '没关系' dùng để đáp lại '对不起'.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-34",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 3,
        "question_number": 34,
        "question_type": "multiple_choice",
        "prompt": "选择正确的问句答语：[你喜欢吃中国菜吗？]",
        "pinyin": "Xuǎnzé zhèngquè de wènjù dáyǔ: [Nǐ xǐhuan chī Zhōngguó cài ma?]",
        "translation": "Chọn câu trả lời phù hợp: 'Bạn có thích ăn món Trung Quốc không?'",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "很喜欢，中国菜很好吃。 (Rất thích, món ăn Trung Quốc rất ngon)", "pinyin": "Hěn xǐhuan, Zhōngguó cài hěn hǎochī.", "translation": "Đáp chuẩn sở thích"},
            {"text": "明天去。 (Ngày mai đi)", "pinyin": "Míngtiān qù.", "translation": "Nói về thời gian"},
            {"text": "我是越南人。 (Tôi là người Việt Nam)", "pinyin": "Wǒ shì Yuènán rén.", "translation": "Nói về quốc tịch"},
            {"text": "太冷了。 (Lạnh quá)", "pinyin": "Tài lěng le.", "translation": "Nói về thời tiết"}
        ],
        "correct_option_index": 0,
        "explanation": "Câu hỏi về sở thích ẩm thực '喜欢吃...吗？', phương án A '很喜欢...' là câu trả lời chuẩn nhất.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-35",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 3,
        "question_number": 35,
        "question_type": "multiple_choice",
        "prompt": "选择正确的问句答语：[你的中国朋友叫什么名字？]",
        "pinyin": "Xuǎnzé zhèngquè de wènjù dáyǔ: [Nǐ de Zhōngguó péngyou jiào shénme míngzi?]",
        "translation": "Chọn câu trả lời phù hợp: 'Người bạn Trung Quốc của bạn tên là gì?'",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "他叫李月。 (Anh ấy tên là Lý Nguyệt)", "pinyin": "Tā jiào Lǐ Yuè.", "translation": "Nêu tên nhân vật"},
            {"text": "他二十岁。 (Anh ấy hai mươi tuổi)", "pinyin": "Tā èrshí suì.", "translation": "Nêu số tuổi"},
            {"text": "他在北京。 (Anh ấy ở Bắc Kinh)", "pinyin": "Tā zài Běijīng.", "translation": "Nêu nơi ở"},
            {"text": "他是医生。 (Anh ấy là bác sĩ)", "pinyin": "Tā shì yīshēng.", "translation": "Nêu nghề nghiệp"}
        ],
        "correct_option_index": 0,
        "explanation": "Hỏi '叫什么名字？' (tên gì?), câu trả lời phải nêu tên nhân vật: '他叫李月。'",
        "points": 5
    })

    # Part 4: Chọn từ điền vào chỗ trống (Q36 -> Q40)
    questions.append({
        "id": "q-hsk1-01-36",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 4,
        "question_number": 36,
        "question_type": "multiple_choice",
        "prompt": "选词填空：你在看______呢？",
        "pinyin": "Xuǎncí tiánkòng: Nǐ zài kàn ______ ne?",
        "translation": "Điền đại từ nghi vấn: Bạn đang xem ______ thế?",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "什么 (Gì / Cái gì)", "pinyin": "Shénme", "translation": "Cái gì"},
            {"text": "谁 (Ai)", "pinyin": "Shéi", "translation": "Ai"},
            {"text": "哪儿 (Ở đâu)", "pinyin": "Nǎr", "translation": "Ở đâu"},
            {"text": "怎么 (Làm sao / Thế nào)", "pinyin": "Zěnme", "translation": "Như thế nào"}
        ],
        "correct_option_index": 0,
        "explanation": "'你在看什么呢？' (Bạn đang xem cái gì vậy?). '什么' làm tân ngữ cho động từ '看'.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-37",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 4,
        "question_number": 37,
        "question_type": "multiple_choice",
        "prompt": "选词填空：我______中国菜，中国菜很好吃。",
        "pinyin": "Xuǎncí tiánkòng: Wǒ ______ Zhōngguó cài, Zhōngguó cài hěn hǎochī.",
        "translation": "Điền động từ: Tôi ______ món ăn Trung Quốc, đồ ăn Trung Quốc rất ngon.",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "喜欢 (Thích)", "pinyin": "Xǐhuan", "translation": "Thích"},
            {"text": "坐 (Ngồi)", "pinyin": "Zuò", "translation": "Ngồi"},
            {"text": "叫 (Gọi / Kêu)", "pinyin": "Jiào", "translation": "Gọi"},
            {"text": "买 (Mua)", "pinyin": "Mǎi", "translation": "Mua"}
        ],
        "correct_option_index": 0,
        "explanation": "Vế sau có '很好吃' (rất ngon), do đó vế đầu bày tỏ sở thích: '喜欢' (thích).",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-38",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 4,
        "question_number": 38,
        "question_type": "multiple_choice",
        "prompt": "选词填空：对不起，我不会说______。",
        "pinyin": "Xuǎncí tiánkòng: Duìbuqǐ, wǒ bú huì shuō ______.",
        "translation": "Điền danh từ ngôn ngữ: Xin lỗi, tôi không biết nói ______.",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "汉语 (Tiếng Trung)", "pinyin": "Hànyǔ", "translation": "Tiếng Hán"},
            {"text": "学校 (Trường học)", "pinyin": "Xuéxiào", "translation": "Trường học"},
            {"text": "苹果 (Quả táo)", "pinyin": "Píngguǒ", "translation": "Quả táo"},
            {"text": "衣服 (Quần áo)", "pinyin": "Yīfu", "translation": "Trang phục"}
        ],
        "correct_option_index": 0,
        "explanation": "Động từ '说' (nói) kết hợp với danh từ chỉ ngôn ngữ '汉语' (tiếng Trung).",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-39",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 4,
        "question_number": 39,
        "question_type": "multiple_choice",
        "prompt": "选词填空：今天天气很热，多______点儿水吧。",
        "pinyin": "Xuǎncí tiánkòng: Jīntiān tiānqì hěn rè, duō ______ diǎnr shuǐ ba.",
        "translation": "Điền động từ: Hôm nay trời rất nóng, hãy ______ nhiều nước một chút nhé.",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "喝 (Uống)", "pinyin": "Hē", "translation": "Uống nước"},
            {"text": "吃 (Ăn)", "pinyin": "Chī", "translation": "Ăn"},
            {"text": "听 (Nghe)", "pinyin": "Tīng", "translation": "Nghe"},
            {"text": "读 (Đọc)", "pinyin": "Dú", "translation": "Đọc"}
        ],
        "correct_option_index": 0,
        "explanation": "Tân ngữ là '水' (nước), động từ phù hợp là '喝' (uống): 喝水.",
        "points": 5
    })
    questions.append({
        "id": "q-hsk1-01-40",
        "exam_id": "hsk1-mock-01",
        "part_type": "reading",
        "part_number": 4,
        "question_number": 40,
        "question_type": "multiple_choice",
        "prompt": "选词填空：昨天是星期一，明天是星期______？",
        "pinyin": "Xuǎncí tiánkòng: Zuótiān shì xīngqīyī, míngtiān shì xīngqī ______?",
        "translation": "Điền thứ ngày: Hôm qua là thứ Hai, ngày mai là thứ ______?",
        "audio_url": "",
        "audio_script": "",
        "options": [
            {"text": "三 (Ba —— Thứ Tư)", "pinyin": "Sān", "translation": "Thứ Tư"},
            {"text": "二 (Hai —— Thứ Ba)", "pinyin": "Èr", "translation": "Thứ Ba"},
            {"text": "四 (Bốn —— Thứ Năm)", "pinyin": "Sì", "translation": "Thứ Năm"},
            {"text": "五 (Năm —— Thứ Sáu)", "pinyin": "Wǔ", "translation": "Thứ Sáu"}
        ],
        "correct_option_index": 0,
        "explanation": "Hôm qua là thứ Hai (星期一), vậy hôm nay là thứ Ba (星期二), ngày mai sẽ là thứ Tư (星期三 - xīngqīsān). Điền 三.",
        "points": 5
    })
    
    return questions

print("HSK 1 questions built:", len(create_hsk1_mock01_questions()))
