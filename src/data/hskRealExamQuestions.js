/**
 * =========================================================================
 * HSK REAL EXAM QUESTIONS DATASET — 100% CTI OFFICIAL FORMAT CONFORMANCE
 * =========================================================================
 * Ngân hàng câu hỏi mô phỏng quy chuẩn đề thi thật HSK quốc tế:
 * - HSK 1 Mock 01: 40 câu chuẩn CTI (20 Nghe + 20 Đọc) — 200 điểm
 * - HSK 1 Mock 02: 30 câu mở rộng
 * - HSK 2 Mock 01: 35 câu toàn diện (20 Nghe + 15 Đọc) — 200 điểm
 * - HSK 3 Mock 01: 30 câu chuẩn thực chiến (12 Nghe + 12 Đọc + 6 Viết) — 300 điểm
 * - HSK 4 Mock 01: 30 câu chuyên sâu (12 Nghe + 12 Đọc + 6 Viết) — 300 điểm
 * - HSK 5 Mock 01: 15 câu nâng cao (5 Nghe + 5 Đọc + 5 Viết) — 300 điểm
 * - HSK 6 Mock 01: 15 câu cao cấp (5 Nghe + 5 Đọc + 5 Viết) — 300 điểm
 */

export const REAL_SIMULATION_QUESTIONS = [
  {
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
      {
        "text": "✓ Đúng (一致)",
        "pinyin": "Yízhì",
        "translation": "Khớp hoàn toàn"
      },
      {
        "text": "✗ Sai (不一致)",
        "pinyin": "Bù yízhì",
        "translation": "Không khớp"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lời thoại phát thanh: '你好！很高兴认识你。' (Xin chào! Rất vui được quen biết bạn). Khớp chính xác với nội dung đề bài.",
    "points": 5
  },
  {
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
      {
        "text": "✓ Đúng (一致)",
        "pinyin": "Yízhì",
        "translation": "Đúng"
      },
      {
        "text": "✗ Sai (不一致)",
        "pinyin": "Bù yízhì",
        "translation": "Sai"
      }
    ],
    "correct_option_index": 1,
    "explanation": "Ghi âm phát: '他在喝茶呢。' (Anh ấy đang uống trà). Đề bài ghi '看书' (đọc sách) là không khớp (Sai).",
    "points": 5
  },
  {
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
      {
        "text": "✓ Đúng (一致)",
        "pinyin": "Yízhì",
        "translation": "Đúng"
      },
      {
        "text": "✗ Sai (不一致)",
        "pinyin": "Bù yízhì",
        "translation": "Sai"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Ghi âm phát: '桌子上有三本书和一个水杯。' (Trên bàn có 3 quyển sách và 1 cốc nước). Khớp với nội dung có 3 quyển sách.",
    "points": 5
  },
  {
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
      {
        "text": "✓ Đúng (一致)",
        "pinyin": "Yízhì",
        "translation": "Đúng"
      },
      {
        "text": "✗ Sai (不一致)",
        "pinyin": "Bù yízhì",
        "translation": "Sai"
      }
    ],
    "correct_option_index": 1,
    "explanation": "Ghi âm phát: '不冷也不热' (không lạnh cũng không nóng), trái ngược với nhận định 'rất lạnh'. Chọn Sai.",
    "points": 5
  },
  {
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
      {
        "text": "✓ Đúng (一致)",
        "pinyin": "Yízhì",
        "translation": "Đúng"
      },
      {
        "text": "✗ Sai (不一致)",
        "pinyin": "Bù yízhì",
        "translation": "Sai"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Ghi âm phát: '是我的中国朋友' (là bạn người Trung Quốc của tôi). Khớp hoàn toàn.",
    "points": 5
  },
  {
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
      {
        "text": "Gọi điện thoại (打电话)",
        "pinyin": "Dǎ diànhuà",
        "translation": "Gọi điện thoại"
      },
      {
        "text": "Xem ti vi (看电视)",
        "pinyin": "Kàn diànshì",
        "translation": "Xem ti vi"
      },
      {
        "text": "Đi ngủ (睡觉)",
        "pinyin": "Shuìjiào",
        "translation": "Đi ngủ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lời thoại: '小明正在打电话呢。' (Tiểu Minh đang gọi điện thoại). Chọn phương án A.",
    "points": 5
  },
  {
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
      {
        "text": "Máy bay (飞机)",
        "pinyin": "Fēijī",
        "translation": "Máy bay"
      },
      {
        "text": "Xe buýt (公共汽车)",
        "pinyin": "Gōnggòng qìchē",
        "translation": "Xe buýt"
      },
      {
        "text": "Xe taxi (出租车)",
        "pinyin": "Chūzūchē",
        "translation": "Xe taxi"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lời thoại: '坐飞机去北京了' (đi máy bay đến Bắc Kinh rồi).",
    "points": 5
  },
  {
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
      {
        "text": "Cơm trắng (米饭)",
        "pinyin": "Mǐfàn",
        "translation": "Cơm trắng"
      },
      {
        "text": "Mì sợi (面条)",
        "pinyin": "Miàntiáo",
        "translation": "Mì sợi"
      },
      {
        "text": "Táo (苹果)",
        "pinyin": "Píngguǒ",
        "translation": "Quả táo"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lời thoại: '我想吃一点儿米饭' (Tôi muốn ăn một chút cơm trắng).",
    "points": 5
  },
  {
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
      {
        "text": "Con mèo (猫)",
        "pinyin": "Māo",
        "translation": "Mèo"
      },
      {
        "text": "Con chó (狗)",
        "pinyin": "Gǒu",
        "translation": "Chó"
      },
      {
        "text": "Con chim (鸟)",
        "pinyin": "Niǎo",
        "translation": "Chim"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lời thoại: '那只小猫在睡觉呢' (Con mèo con kia đang ngủ).",
    "points": 5
  },
  {
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
      {
        "text": "Trường học (学校)",
        "pinyin": "Xuéxiào",
        "translation": "Trường học"
      },
      {
        "text": "Bệnh viện (医院)",
        "pinyin": "Yīyuàn",
        "translation": "Bệnh viện"
      },
      {
        "text": "Cửa hàng (商店)",
        "pinyin": "Shāngdiàn",
        "translation": "Cửa hàng"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lời thoại: '王老师现在在学校里' (Thầy giáo Vương hiện đang ở trong trường).",
    "points": 5
  },
  {
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
      {
        "text": "2块 (Liǎng kuài)",
        "pinyin": "Liǎng kuài",
        "translation": "2 tệ"
      },
      {
        "text": "3块 (Sān kuài)",
        "pinyin": "Sān kuài",
        "translation": "3 tệ"
      },
      {
        "text": "5块 (Wǔ kuài)",
        "pinyin": "Wǔ kuài",
        "translation": "5 tệ"
      }
    ],
    "correct_option_index": 1,
    "explanation": "Người nam trả lời rõ: '三块钱一斤' (3 tệ một cân). Chọn B.",
    "points": 5
  },
  {
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
      {
        "text": "Thầy trò (老师和学生)",
        "pinyin": "Lǎoshī hé xuésheng",
        "translation": "Thầy giáo và học trò"
      },
      {
        "text": "Bác sĩ và bệnh nhân (医生和病人)",
        "pinyin": "Yīshēng hé bìngrén",
        "translation": "Bác sĩ và bệnh nhân"
      },
      {
        "text": "Mẹ và con trai (妈妈和儿子)",
        "pinyin": "Māma hé érzi",
        "translation": "Mẹ và con trai"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Xưng hô '李老师' và '王同学' chứng tỏ mối quan hệ thầy trò.",
    "points": 5
  },
  {
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
      {
        "text": "1:20 (一点二十分)",
        "pinyin": "Yì diǎn èrshí fēn",
        "translation": "1 giờ 20"
      },
      {
        "text": "2:10 (两点十分)",
        "pinyin": "Liǎng diǎn shí fēn",
        "translation": "2 giờ 10"
      },
      {
        "text": "3:00 (三点整)",
        "pinyin": "Sān diǎn zhěng",
        "translation": "3 giờ"
      }
    ],
    "correct_option_index": 1,
    "explanation": "Người nữ trả lời: '现在下午两点十分' (Hiện tại 2 giờ 10 phút chiều). Chọn B.",
    "points": 5
  },
  {
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
      {
        "text": "Trà (茶)",
        "pinyin": "Chá",
        "translation": "Trà"
      },
      {
        "text": "Nước lọc (水)",
        "pinyin": "Shuǐ",
        "translation": "Nước lọc"
      },
      {
        "text": "Sữa bò (牛奶)",
        "pinyin": "Niúnǎi",
        "translation": "Sữa bò"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nam trả lời rõ ràng: '给我一杯茶吧' (Cho tôi một cốc trà). Chọn A.",
    "points": 5
  },
  {
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
      {
        "text": "Trời mưa (下雨)",
        "pinyin": "Xià yǔ",
        "translation": "Trời mưa"
      },
      {
        "text": "Trời nắng (晴天)",
        "pinyin": "Qíngtiān",
        "translation": "Trời nắng"
      },
      {
        "text": "Rơi tuyết (下雪)",
        "pinyin": "Xià xuě",
        "translation": "Rơi tuyết"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nam nói: '下大雨了' (mưa to rồi). Chọn A.",
    "points": 5
  },
  {
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
      {
        "text": "Cửa hàng (商店)",
        "pinyin": "Shāngdiàn",
        "translation": "Cửa hàng"
      },
      {
        "text": "Bệnh viện (医院)",
        "pinyin": "Yīyuàn",
        "translation": "Bệnh viện"
      },
      {
        "text": "Trường học (学校)",
        "pinyin": "Xuéxiào",
        "translation": "Trường học"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nữ nói: '他去商店买东西了' (Anh ấy đi cửa hàng mua đồ rồi). Chọn A.",
    "points": 5
  },
  {
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
      {
        "text": "Giáo viên tiếng Trung (汉语老师)",
        "pinyin": "Hànyǔ lǎoshī",
        "translation": "Giáo viên tiếng Trung"
      },
      {
        "text": "Bác sĩ (医生)",
        "pinyin": "Yīshēng",
        "translation": "Bác sĩ"
      },
      {
        "text": "Học sinh (学生)",
        "pinyin": "Xuésheng",
        "translation": "Học sinh"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nam trả lời: '他是我们学校的汉语老师' (Anh ấy là thầy giáo tiếng Trung trường chúng tôi).",
    "points": 5
  },
  {
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
      {
        "text": "Dưới ghế (椅子下面)",
        "pinyin": "Yǐzi xiàmiàn",
        "translation": "Dưới ghế"
      },
      {
        "text": "Trên bàn (桌子上面)",
        "pinyin": "Zhuōzi shàngmiàn",
        "translation": "Trên bàn"
      },
      {
        "text": "Trong phòng (房间里面)",
        "pinyin": "Fángjiān lǐmiàn",
        "translation": "Trong phòng"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nữ đáp: '它在椅子下面呢' (Nó ở dưới gầm ghế). Chọn A.",
    "points": 5
  },
  {
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
      {
        "text": "4 tuổi (四岁)",
        "pinyin": "Sì suì",
        "translation": "4 tuổi"
      },
      {
        "text": "5 tuổi (五岁)",
        "pinyin": "Wǔ suì",
        "translation": "5 tuổi"
      },
      {
        "text": "6 tuổi (六岁)",
        "pinyin": "Liù suì",
        "translation": "6 tuổi"
      }
    ],
    "correct_option_index": 1,
    "explanation": "Người nam trả lời: '她今年五岁了' (Năm nay cháu 5 tuổi). Chọn B.",
    "points": 5
  },
  {
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
      {
        "text": "Cô Vương (王小姐)",
        "pinyin": "Wáng xiǎojiě",
        "translation": "Cô Vương"
      },
      {
        "text": "Thầy Vương (王老师)",
        "pinyin": "Wáng lǎoshī",
        "translation": "Thầy Vương"
      },
      {
        "text": "Bác sĩ Lý (李医生)",
        "pinyin": "Lǐ yīshēng",
        "translation": "Bác sĩ Lý"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nữ trả lời điện thoại: '我就是' (Tôi chính là cô Vương đây). Chọn A.",
    "points": 5
  },
  {
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
      {
        "text": "✓ Đúng (正确)",
        "pinyin": "Zhèngquè",
        "translation": "Đúng nghĩa"
      },
      {
        "text": "✗ Sai (错误)",
        "pinyin": "Cuòwù",
        "translation": "Sai nghĩa"
      }
    ],
    "correct_option_index": 0,
    "explanation": "'看书' (kàn shū) có nghĩa chính xác là đọc sách, xem sách. Chọn Đúng.",
    "points": 5
  },
  {
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
      {
        "text": "✓ Đúng (正确)",
        "pinyin": "Zhèngquè",
        "translation": "Đúng"
      },
      {
        "text": "✗ Sai (错误)",
        "pinyin": "Cuòwù",
        "translation": "Sai"
      }
    ],
    "correct_option_index": 1,
    "explanation": "'喝水' (hē shuǐ) là uống nước. Ăn cơm phải là '吃饭' (chī fàn). Chọn Sai.",
    "points": 5
  },
  {
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
      {
        "text": "✓ Đúng (正确)",
        "pinyin": "Zhèngquè",
        "translation": "Đúng"
      },
      {
        "text": "✗ Sai (错误)",
        "pinyin": "Cuòwù",
        "translation": "Sai"
      }
    ],
    "correct_option_index": 0,
    "explanation": "'飞机' (fēijī) là máy bay (phi cơ). Chọn Đúng.",
    "points": 5
  },
  {
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
      {
        "text": "✓ Đúng (正确)",
        "pinyin": "Zhèngquè",
        "translation": "Đúng"
      },
      {
        "text": "✗ Sai (错误)",
        "pinyin": "Cuòwù",
        "translation": "Sai"
      }
    ],
    "correct_option_index": 1,
    "explanation": "'医生' (yīshēng) là bác sĩ (y sinh). Học sinh là '学生' (xuésheng). Chọn Sai.",
    "points": 5
  },
  {
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
      {
        "text": "✓ Đúng (正确)",
        "pinyin": "Zhèngquè",
        "translation": "Đúng"
      },
      {
        "text": "✗ Sai (错误)",
        "pinyin": "Cuòwù",
        "translation": "Sai"
      }
    ],
    "correct_option_index": 0,
    "explanation": "'下雨' (xià yǔ) nghĩa là trời mưa. Khớp chính xác.",
    "points": 5
  },
  {
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
      {
        "text": "Cô ấy là giáo viên tiếng Trung của tôi.",
        "pinyin": "Tā shì wǒ de Hànyǔ lǎoshī.",
        "translation": "Chuẩn xác"
      },
      {
        "text": "Cô ấy là bạn học tiếng Trung của tôi.",
        "pinyin": "Tā shì wǒ de Hànyǔ tóngxué.",
        "translation": "Sai danh từ"
      },
      {
        "text": "Mẹ tôi là giáo viên.",
        "pinyin": "Wǒ māma shì lǎoshī.",
        "translation": "Sai chủ ngữ"
      },
      {
        "text": "Tôi là giáo viên tiếng Trung.",
        "pinyin": "Wǒ shì Hànyǔ lǎoshī.",
        "translation": "Sai đại từ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "'她是' (Cô ấy là) + '我的汉语老师' (giáo viên tiếng Trung của tôi).",
    "points": 5
  },
  {
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
      {
        "text": "本 (Běn - quyển/cuốn)",
        "pinyin": "Běn",
        "translation": "Lượng từ cho sách"
      },
      {
        "text": "个 (Gè - cái/chiếc)",
        "pinyin": "Gè",
        "translation": "Lượng từ phổ quát"
      },
      {
        "text": "只 (Zhī - con)",
        "pinyin": "Zhī",
        "translation": "Lượng từ cho động vật"
      },
      {
        "text": "张 (Zhāng - tờ/tấm)",
        "pinyin": "Zhāng",
        "translation": "Lượng từ cho mặt phẳng"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lượng từ chuẩn của sách (书) là '本' (běn).",
    "points": 5
  },
  {
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
      {
        "text": "②④①③ (我住在北京。)",
        "pinyin": "Wǒ zhù zài Běijīng.",
        "translation": "Tôi sống ở Bắc Kinh."
      },
      {
        "text": "①③②④ (在北京我住。)",
        "pinyin": "Zài Běijīng wǒ zhù.",
        "translation": "Sai vị ngữ"
      },
      {
        "text": "②①④③ (我在住北京。)",
        "pinyin": "Wǒ zài zhù Běijīng.",
        "translation": "Sai trật tự giới từ"
      },
      {
        "text": "③①②④ (北京在我住。)",
        "pinyin": "Běijīng zài wǒ zhù.",
        "translation": "Sai chủ ngữ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc chuẩn: 'Chủ ngữ + 住 + 在 + Địa điểm' (我住在北京。). Trật tự đúng là ②④①③.",
    "points": 5
  },
  {
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
      {
        "text": "妈妈",
        "pinyin": "māma",
        "translation": "Mẹ"
      },
      {
        "text": "爸爸",
        "pinyin": "bàba",
        "translation": "Bố"
      },
      {
        "text": "哥哥",
        "pinyin": "gēge",
        "translation": "Anh trai"
      },
      {
        "text": "姐姐",
        "pinyin": "jiějie",
        "translation": "Chị gái"
      }
    ],
    "correct_option_index": 0,
    "explanation": "'māma' là phiên âm của chữ '妈妈' (mẹ).",
    "points": 5
  },
  {
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
      {
        "text": "大 (To, lớn)",
        "pinyin": "Dà",
        "translation": "Lớn"
      },
      {
        "text": "冷 (Lạnh)",
        "pinyin": "Lěng",
        "translation": "Lạnh"
      },
      {
        "text": "热 (Nóng)",
        "pinyin": "Rè",
        "translation": "Nóng"
      },
      {
        "text": "多 (Nhiều)",
        "pinyin": "Duō",
        "translation": "Nhiều"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Từ trái nghĩa với '小' (nhỏ) là '大' (to, lớn).",
    "points": 5
  },
  {
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
      {
        "text": "在前面左拐。 (Ở phía trước rẽ trái)",
        "pinyin": "Zài qiánmiàn zuǒ guǎi.",
        "translation": "Chỉ phương hướng"
      },
      {
        "text": "不用谢。 (Không có gì)",
        "pinyin": "Bú yòng xiè.",
        "translation": "Đáp lại lời cảm ơn"
      },
      {
        "text": "今天星期五。 (Hôm nay thứ Sáu)",
        "pinyin": "Jīntiān xīngqīwǔ.",
        "translation": "Nói về thứ ngày"
      },
      {
        "text": "我不是学生。 (Tôi không phải học sinh)",
        "pinyin": "Wǒ bú shì xuésheng.",
        "translation": "Nói về nghề nghiệp"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Câu hỏi hỏi về địa điểm ('在哪里？' - ở đâu?), phương án A chỉ phương hướng vị trí là phù hợp nhất.",
    "points": 5
  },
  {
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
      {
        "text": "认识，他是我的老师。 (Quen chứ, thầy ấy là giáo viên của tôi)",
        "pinyin": "Rènshi, tā shì wǒ de lǎoshī.",
        "translation": "Trả lời chính xác"
      },
      {
        "text": "我很高兴。 (Tôi rất vui)",
        "pinyin": "Wǒ hěn gāoxìng.",
        "translation": "Sai ngữ cảnh"
      },
      {
        "text": "三块钱。 (Ba đồng)",
        "pinyin": "Sān kuài qián.",
        "translation": "Nói giá tiền"
      },
      {
        "text": "他在喝茶。 (Anh ấy đang uống trà)",
        "pinyin": "Tā zài hē chá.",
        "translation": "Hành động người khác"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Câu hỏi '你认识...吗？', câu trả lời phù hợp là '认识，他是...'.",
    "points": 5
  },
  {
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
      {
        "text": "不客气！ (Không có gì/Đừng khách sáo!)",
        "pinyin": "Bú kèqi!",
        "translation": "Đáp lễ cảm ơn chuẩn mực"
      },
      {
        "text": "没关系！ (Không sao đâu!)",
        "pinyin": "Méi guānxi!",
        "translation": "Đáp lại xin lỗi"
      },
      {
        "text": "对不起！ (Xin lỗi!)",
        "pinyin": "Duìbuqǐ!",
        "translation": "Xin lỗi"
      },
      {
        "text": "再见！ (Tạm biệt!)",
        "pinyin": "Zàijiàn!",
        "translation": "Chào tạm biệt"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đáp lại lời '谢谢' (cảm ơn) là '不客气' (bú kèqi - đừng khách sáo). '没关系' dùng để đáp lại '对不起'.",
    "points": 5
  },
  {
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
      {
        "text": "很喜欢，中国菜很好吃。 (Rất thích, món ăn Trung Quốc rất ngon)",
        "pinyin": "Hěn xǐhuan, Zhōngguó cài hěn hǎochī.",
        "translation": "Đáp chuẩn sở thích"
      },
      {
        "text": "明天去。 (Ngày mai đi)",
        "pinyin": "Míngtiān qù.",
        "translation": "Nói về thời gian"
      },
      {
        "text": "我是越南人。 (Tôi là người Việt Nam)",
        "pinyin": "Wǒ shì Yuènán rén.",
        "translation": "Nói về quốc tịch"
      },
      {
        "text": "太冷了。 (Lạnh quá)",
        "pinyin": "Tài lěng le.",
        "translation": "Nói về thời tiết"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Câu hỏi về sở thích ẩm thực '喜欢吃...吗？', phương án A '很喜欢...' là câu trả lời chuẩn nhất.",
    "points": 5
  },
  {
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
      {
        "text": "他叫李月。 (Anh ấy tên là Lý Nguyệt)",
        "pinyin": "Tā jiào Lǐ Yuè.",
        "translation": "Nêu tên nhân vật"
      },
      {
        "text": "他二十岁。 (Anh ấy hai mươi tuổi)",
        "pinyin": "Tā èrshí suì.",
        "translation": "Nêu số tuổi"
      },
      {
        "text": "他在北京。 (Anh ấy ở Bắc Kinh)",
        "pinyin": "Tā zài Běijīng.",
        "translation": "Nêu nơi ở"
      },
      {
        "text": "他是医生。 (Anh ấy là bác sĩ)",
        "pinyin": "Tā shì yīshēng.",
        "translation": "Nêu nghề nghiệp"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Hỏi '叫什么名字？' (tên gì?), câu trả lời phải nêu tên nhân vật: '他叫李月。'",
    "points": 5
  },
  {
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
      {
        "text": "什么 (Gì / Cái gì)",
        "pinyin": "Shénme",
        "translation": "Cái gì"
      },
      {
        "text": "谁 (Ai)",
        "pinyin": "Shéi",
        "translation": "Ai"
      },
      {
        "text": "哪儿 (Ở đâu)",
        "pinyin": "Nǎr",
        "translation": "Ở đâu"
      },
      {
        "text": "怎么 (Làm sao / Thế nào)",
        "pinyin": "Zěnme",
        "translation": "Như thế nào"
      }
    ],
    "correct_option_index": 0,
    "explanation": "'你在看什么呢？' (Bạn đang xem cái gì vậy?). '什么' làm tân ngữ cho động từ '看'.",
    "points": 5
  },
  {
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
      {
        "text": "喜欢 (Thích)",
        "pinyin": "Xǐhuan",
        "translation": "Thích"
      },
      {
        "text": "坐 (Ngồi)",
        "pinyin": "Zuò",
        "translation": "Ngồi"
      },
      {
        "text": "叫 (Gọi / Kêu)",
        "pinyin": "Jiào",
        "translation": "Gọi"
      },
      {
        "text": "买 (Mua)",
        "pinyin": "Mǎi",
        "translation": "Mua"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Vế sau có '很好吃' (rất ngon), do đó vế đầu bày tỏ sở thích: '喜欢' (thích).",
    "points": 5
  },
  {
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
      {
        "text": "汉语 (Tiếng Trung)",
        "pinyin": "Hànyǔ",
        "translation": "Tiếng Hán"
      },
      {
        "text": "学校 (Trường học)",
        "pinyin": "Xuéxiào",
        "translation": "Trường học"
      },
      {
        "text": "苹果 (Quả táo)",
        "pinyin": "Píngguǒ",
        "translation": "Quả táo"
      },
      {
        "text": "衣服 (Quần áo)",
        "pinyin": "Yīfu",
        "translation": "Trang phục"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Động từ '说' (nói) kết hợp với danh từ chỉ ngôn ngữ '汉语' (tiếng Trung).",
    "points": 5
  },
  {
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
      {
        "text": "喝 (Uống)",
        "pinyin": "Hē",
        "translation": "Uống nước"
      },
      {
        "text": "吃 (Ăn)",
        "pinyin": "Chī",
        "translation": "Ăn"
      },
      {
        "text": "听 (Nghe)",
        "pinyin": "Tīng",
        "translation": "Nghe"
      },
      {
        "text": "读 (Đọc)",
        "pinyin": "Dú",
        "translation": "Đọc"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Tân ngữ là '水' (nước), động từ phù hợp là '喝' (uống): 喝水.",
    "points": 5
  },
  {
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
      {
        "text": "三 (Ba —— Thứ Tư)",
        "pinyin": "Sān",
        "translation": "Thứ Tư"
      },
      {
        "text": "二 (Hai —— Thứ Ba)",
        "pinyin": "Èr",
        "translation": "Thứ Ba"
      },
      {
        "text": "四 (Bốn —— Thứ Năm)",
        "pinyin": "Sì",
        "translation": "Thứ Năm"
      },
      {
        "text": "五 (Năm —— Thứ Sáu)",
        "pinyin": "Wǔ",
        "translation": "Thứ Sáu"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Hôm qua là thứ Hai (星期一), vậy hôm nay là thứ Ba (星期二), ngày mai sẽ là thứ Tư (星期三 - xīngqīsān). Điền 三.",
    "points": 5
  },
  {
    "id": "q-hsk1-02-11",
    "exam_id": "hsk1-mock-02",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 11,
    "question_type": "true_false",
    "prompt": "听录音，判断对错：[看书]",
    "pinyin": "Tīng lùyīn, pànduàn duìcuò: [kàn shū]",
    "translation": "Nghe ghi âm, phán đoán đúng sai: [Đọc sách]",
    "audio_url": "",
    "audio_script": "他在看书呢。",
    "options": [
      {
        "text": "✓ Đúng (一致)",
        "pinyin": "Yízhì",
        "translation": "✓ Đúng (一致)"
      },
      {
        "text": "✗ Sai (不一致)",
        "pinyin": "Bù yízhì",
        "translation": "✗ Sai (不一致)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Khớp lời thoại '看书'.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-12",
    "exam_id": "hsk1-mock-02",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 12,
    "question_type": "multiple_choice",
    "prompt": "听录音，选出对应的物品：",
    "pinyin": "Tīng lùyīn, xuǎn chū duìyìng de wùpǐn:",
    "translation": "Nghe ghi âm, chọn đồ vật tương ứng:",
    "audio_url": "",
    "audio_script": "桌子上有一个苹果。",
    "options": [
      {
        "text": "Quả táo (苹果)",
        "pinyin": "Píngguǒ",
        "translation": "Quả táo (苹果)"
      },
      {
        "text": "Cốc nước (水杯)",
        "pinyin": "Shuǐbēi",
        "translation": "Cốc nước (水杯)"
      },
      {
        "text": "Quyển sách (书)",
        "pinyin": "Shū",
        "translation": "Quyển sách (书)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lời thoại nói về quả táo (苹果).",
    "points": 10
  },
  {
    "id": "q-hsk1-02-13",
    "exam_id": "hsk1-mock-02",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 13,
    "question_type": "multiple_choice",
    "prompt": "听句子，选择人物的职业：",
    "pinyin": "Tīng jùzi, xuǎnzé rénwù de zhíyè:",
    "translation": "Nghe câu, chọn nghề nghiệp của nhân vật:",
    "audio_url": "",
    "audio_script": "我爸爸在医院工作，他是医生。",
    "options": [
      {
        "text": "Bác sĩ (医生)",
        "pinyin": "Yīshēng",
        "translation": "Bác sĩ (医生)"
      },
      {
        "text": "Thầy giáo (老师)",
        "pinyin": "Lǎoshī",
        "translation": "Thầy giáo (老师)"
      },
      {
        "text": "Sinh viên (学生)",
        "pinyin": "Xuésheng",
        "translation": "Sinh viên (学生)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Nói rõ '他是医生'.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-14",
    "exam_id": "hsk1-mock-02",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 14,
    "question_type": "multiple_choice",
    "prompt": "听对话，选择正确的时间：",
    "pinyin": "Tīng duìhuà, xuǎnzé zhèngquè de shíjiān:",
    "translation": "Nghe đối thoại, chọn thời gian:",
    "audio_url": "",
    "audio_script": "男：现在几点了？女：现在上午九点半。问：现在几点？",
    "options": [
      {
        "text": "9:30 (九点半)",
        "pinyin": "Jiǔ diǎn bàn",
        "translation": "9:30 (九点半)"
      },
      {
        "text": "8:30 (八点半)",
        "pinyin": "Bā diǎn bàn",
        "translation": "8:30 (八点半)"
      },
      {
        "text": "10:00 (十点)",
        "pinyin": "Shí diǎn",
        "translation": "10:00 (十点)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Thời gian là 9 giờ 30 sáng.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-15",
    "exam_id": "hsk1-mock-02",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 15,
    "question_type": "multiple_choice",
    "prompt": "听录音，选出交通方式：",
    "pinyin": "Tīng lùyīn, xuǎn chū jiāotōng fāngshì:",
    "translation": "Nghe ghi âm, chọn phương tiện:",
    "audio_url": "",
    "audio_script": "我们坐出租车去火车站吧。",
    "options": [
      {
        "text": "Xe taxi (出租车)",
        "pinyin": "Chūzūchē",
        "translation": "Xe taxi (出租车)"
      },
      {
        "text": "Máy bay (飞机)",
        "pinyin": "Fēijī",
        "translation": "Máy bay (飞机)"
      },
      {
        "text": "Tàu hỏa (火车)",
        "pinyin": "Huǒchē",
        "translation": "Tàu hỏa (火车)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đi bằng taxi: 坐出租车.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-16",
    "exam_id": "hsk1-mock-02",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 16,
    "question_type": "multiple_choice",
    "prompt": "听对话，选择人物想喝什么：",
    "pinyin": "Tīng duìhuà, xuǎnzé rénwù xiǎng hē shénme:",
    "translation": "Nghe đối thoại, chọn thức uống:",
    "audio_url": "",
    "audio_script": "女：你想喝茶吗？男：不，我想喝冷水。问：男的想喝什么？",
    "options": [
      {
        "text": "Nước lạnh (冷水)",
        "pinyin": "Lěngshuǐ",
        "translation": "Nước lạnh (冷水)"
      },
      {
        "text": "Trà nóng (热茶)",
        "pinyin": "Rèchá",
        "translation": "Trà nóng (热茶)"
      },
      {
        "text": "Sữa tươi (牛奶)",
        "pinyin": "Niúnǎi",
        "translation": "Sữa tươi (牛奶)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Muốn uống nước lạnh: 喝冷水.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-17",
    "exam_id": "hsk1-mock-02",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 17,
    "question_type": "multiple_choice",
    "prompt": "听对话，判断地点：",
    "pinyin": "Tīng duìhuà, pànduàn dìdiǎn:",
    "translation": "Nghe đối thoại, xác định địa điểm:",
    "audio_url": "",
    "audio_script": "男：王小姐在学校吗？女：不在，她在商店买衣服。问：王小姐在哪儿？",
    "options": [
      {
        "text": "Cửa hàng (商店)",
        "pinyin": "Shāngdiàn",
        "translation": "Cửa hàng (商店)"
      },
      {
        "text": "Trường học (学校)",
        "pinyin": "Xuéxiào",
        "translation": "Trường học (学校)"
      },
      {
        "text": "Bệnh viện (医院)",
        "pinyin": "Yīyuàn",
        "translation": "Bệnh viện (医院)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đang ở cửa hàng mua quần áo.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-18",
    "exam_id": "hsk1-mock-02",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 18,
    "question_type": "multiple_choice",
    "prompt": "听录音，选择天气：",
    "pinyin": "Tīng lùyīn, xuǎnzé tiānqì:",
    "translation": "Nghe ghi âm, chọn thời tiết:",
    "audio_url": "",
    "audio_script": "今天天气太冷了，你多穿点儿衣服。",
    "options": [
      {
        "text": "Rất lạnh (很冷)",
        "pinyin": "Hěn lěng",
        "translation": "Rất lạnh (很冷)"
      },
      {
        "text": "Rất nóng (很热)",
        "pinyin": "Hěn rè",
        "translation": "Rất nóng (很热)"
      },
      {
        "text": "Mưa to (下雨)",
        "pinyin": "Xià yǔ",
        "translation": "Mưa to (下雨)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Thời tiết quá lạnh: 太冷了.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-19",
    "exam_id": "hsk1-mock-02",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 19,
    "question_type": "multiple_choice",
    "prompt": "听对话，回答数量问题：",
    "pinyin": "Tīng duìhuà, huídá shùliàng wèntí:",
    "translation": "Nghe đối thoại, trả lời số lượng:",
    "audio_url": "",
    "audio_script": "男：你家有几口人？女：我家有四口人。问：她家有几口人？",
    "options": [
      {
        "text": "4 người (四口人)",
        "pinyin": "Sì kǒu rén",
        "translation": "4 người (四口人)"
      },
      {
        "text": "3 người (三口人)",
        "pinyin": "Sān kǒu rén",
        "translation": "3 người (三口人)"
      },
      {
        "text": "5 người (五口人)",
        "pinyin": "Wǔ kǒu rén",
        "translation": "5 người (五口人)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Có 4 người: 四口人.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-20",
    "exam_id": "hsk1-mock-02",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 20,
    "question_type": "multiple_choice",
    "prompt": "听对话，选择人物年龄：",
    "pinyin": "Tīng duìhuà, xuǎnzé rénwù niánlíng:",
    "translation": "Nghe đối thoại, chọn độ tuổi:",
    "audio_url": "",
    "audio_script": "女：你的儿子多大了？男：他今年八岁了。问：他儿子多大？",
    "options": [
      {
        "text": "8 tuổi (八岁)",
        "pinyin": "Bā suì",
        "translation": "8 tuổi (八岁)"
      },
      {
        "text": "6 tuổi (六岁)",
        "pinyin": "Liù suì",
        "translation": "6 tuổi (六岁)"
      },
      {
        "text": "10 tuổi (十岁)",
        "pinyin": "Shí suì",
        "translation": "10 tuổi (十岁)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Con trai 8 tuổi: 八岁.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-21",
    "exam_id": "hsk1-mock-02",
    "part_type": "reading",
    "part_number": 1,
    "question_number": 21,
    "question_type": "true_false",
    "prompt": "看词语判断正误：[喝茶 —— uống trà]",
    "pinyin": "Kàn cíyǔ pànduàn zhèngwù: [hē chá —— uống trà]",
    "translation": "Đọc từ ngữ phán đoán đúng sai:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "✓ Đúng (正确)",
        "pinyin": "Zhèngquè",
        "translation": "✓ Đúng (正确)"
      },
      {
        "text": "✗ Sai (错误)",
        "pinyin": "Cuòwù",
        "translation": "✗ Sai (错误)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "喝茶 nghĩa là uống trà.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-22",
    "exam_id": "hsk1-mock-02",
    "part_type": "reading",
    "part_number": 1,
    "question_number": 22,
    "question_type": "true_false",
    "prompt": "看词语判断正误：[电脑 —— điện thoại]",
    "pinyin": "Kàn cíyǔ pànduàn zhèngwù: [diànnǎo —— điện thoại]",
    "translation": "Đọc từ ngữ phán đoán đúng sai:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "✓ Đúng (正确)",
        "pinyin": "Zhèngquè",
        "translation": "✓ Đúng (正确)"
      },
      {
        "text": "✗ Sai (错误)",
        "pinyin": "Cuòwù",
        "translation": "✗ Sai (错误)"
      }
    ],
    "correct_option_index": 1,
    "explanation": "电脑 là máy tính, điện thoại là 电话.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-23",
    "exam_id": "hsk1-mock-02",
    "part_type": "reading",
    "part_number": 1,
    "question_number": 23,
    "question_type": "multiple_choice",
    "prompt": "选词填空：这儿有三______学生。",
    "pinyin": "Xuǎncí tiánkòng: Zhèr yǒu sān ______ xuésheng.",
    "translation": "Chọn lượng từ: Ở đây có ba sinh viên.",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "个 (Gè)",
        "pinyin": "Gè",
        "translation": "个 (Gè)"
      },
      {
        "text": "本 (Běn)",
        "pinyin": "Běn",
        "translation": "本 (Běn)"
      },
      {
        "text": "张 (Zhāng)",
        "pinyin": "Zhāng",
        "translation": "张 (Zhāng)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lượng từ cho người: 个人.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-24",
    "exam_id": "hsk1-mock-02",
    "part_type": "reading",
    "part_number": 1,
    "question_number": 24,
    "question_type": "multiple_choice",
    "prompt": "问答配对：[你好！]",
    "pinyin": "Wèndá pèiduì: [Nǐ hǎo!]",
    "translation": "Chọn câu đáp lại: 'Xin chào!'",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "你好！",
        "pinyin": "Nǐ hǎo!",
        "translation": "你好！"
      },
      {
        "text": "谢谢！",
        "pinyin": "Xièxie!",
        "translation": "谢谢！"
      },
      {
        "text": "对不起！",
        "pinyin": "Duìbuqǐ!",
        "translation": "对不起！"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đáp lại '你好' là '你好'.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-25",
    "exam_id": "hsk1-mock-02",
    "part_type": "reading",
    "part_number": 1,
    "question_number": 25,
    "question_type": "multiple_choice",
    "prompt": "选词填空：我______北京大学的学生。",
    "pinyin": "Xuǎncí tiánkòng: Wǒ ______ Běijīng Dàxué de xuésheng.",
    "translation": "Điền từ: Tôi ______ sinh viên Đại học Bắc Kinh.",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "是 (Là)",
        "pinyin": "Shì",
        "translation": "是 (Là)"
      },
      {
        "text": "有 (Có)",
        "pinyin": "Yǒu",
        "translation": "有 (Có)"
      },
      {
        "text": "去 (Đi)",
        "pinyin": "Qù",
        "translation": "去 (Đi)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc phán đoán: 我是... (Tôi là...).",
    "points": 10
  },
  {
    "id": "q-hsk1-02-26",
    "exam_id": "hsk1-mock-02",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 26,
    "question_type": "multiple_choice",
    "prompt": "选择疑问词：你想买______？",
    "pinyin": "Xuǎnzé yíwèncí: Nǐ xiǎng mǎi ______?",
    "translation": "Chọn từ nghi vấn: Bạn muốn mua ______?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "什么 (Gì)",
        "pinyin": "Shénme",
        "translation": "什么 (Gì)"
      },
      {
        "text": "谁 (Ai)",
        "pinyin": "Shéi",
        "translation": "谁 (Ai)"
      },
      {
        "text": "哪儿 (Ở đâu)",
        "pinyin": "Nǎr",
        "translation": "哪儿 (Ở đâu)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Tân ngữ đồ vật: 买什么.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-27",
    "exam_id": "hsk1-mock-02",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 27,
    "question_type": "multiple_choice",
    "prompt": "选择方位词：猫在桌子______面睡觉。",
    "pinyin": "Xuǎnzé fāngwèicí: Māo zài zhuōzi ______ mian shuìjiào.",
    "translation": "Chọn từ chỉ phương hướng: Mèo ở ______ bàn ngủ.",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "下 (Dưới)",
        "pinyin": "Xià",
        "translation": "下 (Dưới)"
      },
      {
        "text": "大 (To)",
        "pinyin": "Dà",
        "translation": "大 (To)"
      },
      {
        "text": "小 (Nhỏ)",
        "pinyin": "Xiǎo",
        "translation": "小 (Nhỏ)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Vị trí: 下面 (bên dưới).",
    "points": 10
  },
  {
    "id": "q-hsk1-02-28",
    "exam_id": "hsk1-mock-02",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 28,
    "question_type": "multiple_choice",
    "prompt": "连词成句：[①我 ②喝水 ③想]",
    "pinyin": "Liáncí chéng jù: [①wǒ ②hē shuǐ ③xiǎng]",
    "translation": "Sắp xếp từ thành câu:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "①③② (我想喝水。)",
        "pinyin": "Wǒ xiǎng hē shuǐ.",
        "translation": "①③② (我想喝水。)"
      },
      {
        "text": "③①② (想我喝水。)",
        "pinyin": "Xiǎng wǒ hē shuǐ.",
        "translation": "③①② (想我喝水。)"
      },
      {
        "text": "②①③ (喝水我想。)",
        "pinyin": "Hē shuǐ wǒ xiǎng.",
        "translation": "②①③ (喝水我想。)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc: Chủ ngữ + 想 + Động từ (我想喝水。).",
    "points": 10
  },
  {
    "id": "q-hsk1-02-29",
    "exam_id": "hsk1-mock-02",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 29,
    "question_type": "multiple_choice",
    "prompt": "看拼音选汉字：xuéxí (học tập)",
    "pinyin": "Kàn pīnyīn xuǎn hànzì: xuéxí (học tập)",
    "translation": "Nhìn phiên âm chọn chữ Hán:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "学习",
        "pinyin": "xuéxí",
        "translation": "学习"
      },
      {
        "text": "学校",
        "pinyin": "xuéxiào",
        "translation": "学校"
      },
      {
        "text": "学生",
        "pinyin": "xuésheng",
        "translation": "学生"
      }
    ],
    "correct_option_index": 0,
    "explanation": "学习 nghĩa là học tập.",
    "points": 10
  },
  {
    "id": "q-hsk1-02-30",
    "exam_id": "hsk1-mock-02",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 30,
    "question_type": "multiple_choice",
    "prompt": "阅读理解：[我叫大卫，是美国人。我在清华大学学习中文。] 问：大卫学习什么？",
    "pinyin": "Yuèdú lǐjiě: [Wǒ jiào Dàwèi...] Wèn: Dàwèi xuéxí shénme?",
    "translation": "Đọc hiểu: David học ngành gì?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "中文 (Tiếng Trung)",
        "pinyin": "Zhōngwén",
        "translation": "中文 (Tiếng Trung)"
      },
      {
        "text": "英语 (Tiếng Anh)",
        "pinyin": "Yīngyǔ",
        "translation": "英语 (Tiếng Anh)"
      },
      {
        "text": "法文 (Tiếng Pháp)",
        "pinyin": "Fǎwén",
        "translation": "法文 (Tiếng Pháp)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Trong bài ghi rõ: 学习中文.",
    "points": 10
  },
  {
    "id": "q-hsk2-01-01",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 1,
    "question_type": "true_false",
    "prompt": "听对话，判断对错：[男的今天晚上有空。]",
    "pinyin": "Tīng duìhuà, pànduàn duì cuò: [Nán de jīntiān wǎnshang yǒu kòng.]",
    "translation": "Nghe đối thoại, đoán đúng sai: 'Người nam tối nay rảnh rỗi.'",
    "audio_url": "",
    "audio_script": "女：今天晚上一起去看电影吧？男：真不巧，我今晚要加班。",
    "options": [
      {
        "text": "✓ Đúng (对)",
        "pinyin": "Duì",
        "translation": "✓ Đúng (对)"
      },
      {
        "text": "✗ Sai (错)",
        "pinyin": "Cuò",
        "translation": "✗ Sai (错)"
      }
    ],
    "correct_option_index": 1,
    "explanation": "Người nam phải tăng ca (加班), nên không rảnh rỗi. Chọn Sai.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-02",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 2,
    "question_type": "true_false",
    "prompt": "听对话，判断对错：[外面现在在下雪。]",
    "pinyin": "Tīng duìhuà, pànduàn duì cuò: [Wàimiàn xiànzài zài xià xuě.]",
    "translation": "Nghe đối thoại, đoán đúng sai: 'Bên ngoài trời đang đổ tuyết.'",
    "audio_url": "",
    "audio_script": "女：外面天气怎么样？男：太阳很大，非常热。",
    "options": [
      {
        "text": "✓ Đúng (对)",
        "pinyin": "Duì",
        "translation": "✓ Đúng (对)"
      },
      {
        "text": "✗ Sai (错)",
        "pinyin": "Cuò",
        "translation": "✗ Sai (错)"
      }
    ],
    "correct_option_index": 1,
    "explanation": "Trời nắng to và rất nóng (太阳很大，非常热), không phải đổ tuyết. Chọn Sai.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-03",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 3,
    "question_type": "true_false",
    "prompt": "听对话，判断对错：[他们打算坐出租车去机场。]",
    "pinyin": "Tīng duìhuà, pànduàn duì cuò: [Tāmen dǎsuàn zuò chūzūchē qù jīchǎng.]",
    "translation": "Nghe đối thoại: 'Họ dự định đi taxi ra sân bay.'",
    "audio_url": "",
    "audio_script": "男：我们怎么去机场？女：坐出租车吧，又快又方便。",
    "options": [
      {
        "text": "✓ Đúng (对)",
        "pinyin": "Duì",
        "translation": "✓ Đúng (对)"
      },
      {
        "text": "✗ Sai (错)",
        "pinyin": "Cuò",
        "translation": "✗ Sai (错)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Hai người đồng ý đi taxi (坐出租车). Khớp hoàn toàn.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-04",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 4,
    "question_type": "true_false",
    "prompt": "听对话，判断对错：[女的觉得这件衣服太贵了。]",
    "pinyin": "Tīng duìhuà, pànduàn duì cuò: [Nǚ de juéde zhè jiàn yīfu tài guì le.]",
    "translation": "Nghe đối thoại: 'Người nữ thấy chiếc áo này đắt quá.'",
    "audio_url": "",
    "audio_script": "男：这件衣服两千块，怎么样？女：太贵了，我们再去别家看看吧。",
    "options": [
      {
        "text": "✓ Đúng (对)",
        "pinyin": "Duì",
        "translation": "✓ Đúng (对)"
      },
      {
        "text": "✗ Sai (错)",
        "pinyin": "Cuò",
        "translation": "✗ Sai (错)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nữ chê đắt: 太贵了.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-05",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 5,
    "question_type": "true_false",
    "prompt": "听对话，判断对错：[生病的人是李老师。]",
    "pinyin": "Tīng duìhuà, pànduàn duì cuò: [Shēngbìng de rén shì Lǐ lǎoshī.]",
    "translation": "Nghe đối thoại: 'Người bị ốm là thầy Lý.'",
    "audio_url": "",
    "audio_script": "女：李老师今天怎么没来上班？男：他感冒生病了，在医院看病呢。",
    "options": [
      {
        "text": "✓ Đúng (对)",
        "pinyin": "Duì",
        "translation": "✓ Đúng (对)"
      },
      {
        "text": "✗ Sai (错)",
        "pinyin": "Cuò",
        "translation": "✗ Sai (错)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Thầy Lý bị cảm ốm: 他感冒生病了.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-06",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 6,
    "question_type": "multiple_choice",
    "prompt": "听录音，选出说话人提到的运动：",
    "pinyin": "Tīng lùyīn, xuǎn chū shuōhuà rén tídào de yùndòng:",
    "translation": "Nghe ghi âm, chọn môn thể thao được nhắc tới:",
    "audio_url": "",
    "audio_script": "每天早晨我都去公园跑步半个小时。",
    "options": [
      {
        "text": "Chạy bộ (跑步)",
        "pinyin": "Pǎobù",
        "translation": "Chạy bộ (跑步)"
      },
      {
        "text": "Bơi lội (游泳)",
        "pinyin": "Yóuyǒng",
        "translation": "Bơi lội (游泳)"
      },
      {
        "text": "Đá bóng (踢足球)",
        "pinyin": "Tī zúqiú",
        "translation": "Đá bóng (踢足球)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đang nói về môn chạy bộ: 跑步.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-07",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 7,
    "question_type": "multiple_choice",
    "prompt": "听录音，选出男的想买的物品：",
    "pinyin": "Tīng lùyīn, xuǎn chū nán de xiǎng mǎi de wùpǐn:",
    "translation": "Nghe ghi âm, chọn đồ người nam muốn mua:",
    "audio_url": "",
    "audio_script": "女：您需要买点儿什么？男：我想买一件黑色的羽绒服。问：男的想买什么？",
    "options": [
      {
        "text": "Áo khoác lông vũ (羽绒服)",
        "pinyin": "Yǔróngfú",
        "translation": "Áo khoác lông vũ (羽绒服)"
      },
      {
        "text": "Giày thể thao (运动鞋)",
        "pinyin": "Yùndòngxié",
        "translation": "Giày thể thao (运动鞋)"
      },
      {
        "text": "Mũ nón (帽子)",
        "pinyin": "Màozi",
        "translation": "Mũ nón (帽子)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nam nói muốn mua 羽绒服.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-08",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 8,
    "question_type": "multiple_choice",
    "prompt": "听录音，选择人物所在地点：",
    "pinyin": "Tīng lùyīn, xuǎnzé rénwù suǒzài dìdiǎn:",
    "translation": "Nghe ghi âm, chọn nơi chốn:",
    "audio_url": "",
    "audio_script": "服务员，请给我们拿一份菜单。",
    "options": [
      {
        "text": "Nhà hàng (餐馆)",
        "pinyin": "Cānguǎn",
        "translation": "Nhà hàng (餐馆)"
      },
      {
        "text": "Hiệu sách (书店)",
        "pinyin": "Shūdiàn",
        "translation": "Hiệu sách (书店)"
      },
      {
        "text": "Ngân hàng (银行)",
        "pinyin": "Yínháng",
        "translation": "Ngân hàng (银行)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Gọi người phục vụ và xin thực đơn (菜单) là ở nhà hàng.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-09",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 9,
    "question_type": "multiple_choice",
    "prompt": "听录音，选择交通工具：",
    "pinyin": "Tīng lùyīn, xuǎnzé jiāotōng gōngjù:",
    "translation": "Nghe ghi âm, chọn phương tiện giao thông:",
    "audio_url": "",
    "audio_script": "路上车太多了，我骑自行车去学校更快。",
    "options": [
      {
        "text": "Xe đạp (自行车)",
        "pinyin": "Zìxíngchē",
        "translation": "Xe đạp (自行车)"
      },
      {
        "text": "Tàu điện ngầm (地铁)",
        "pinyin": "Dìtiě",
        "translation": "Tàu điện ngầm (地铁)"
      },
      {
        "text": "Xe buýt (公共汽车)",
        "pinyin": "Gōnggòng qìchē",
        "translation": "Xe buýt (公共汽车)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nói chọn đi xe đạp: 骑自行车.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-10",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 10,
    "question_type": "multiple_choice",
    "prompt": "听录音，选出说话人身体不适的部位：",
    "pinyin": "Tīng lùyīn, xuǎn chū shuōhuà rén shēntǐ búshì de bùwèi:",
    "translation": "Nghe ghi âm, chọn bộ phận cơ thể bị đau:",
    "audio_url": "",
    "audio_script": "我今天眼睛有点儿不舒服，想休息一下。",
    "options": [
      {
        "text": "Mắt (眼睛)",
        "pinyin": "Yǎnjing",
        "translation": "Mắt (眼睛)"
      },
      {
        "text": "Chân (腿)",
        "pinyin": "Tuǐ",
        "translation": "Chân (腿)"
      },
      {
        "text": "Cánh tay (手臂)",
        "pinyin": "Shǒubì",
        "translation": "Cánh tay (手臂)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Nói rõ '眼睛有点儿不舒服' (mắt hơi khó chịu).",
    "points": 5
  },
  {
    "id": "q-hsk2-01-11",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 3,
    "question_number": 11,
    "question_type": "multiple_choice",
    "prompt": "听对话，回答问题：",
    "pinyin": "Tīng duìhuà, huídá wèntí:",
    "translation": "Nghe đối thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "男：这块手表真漂亮，多少钱买的？女：不贵，只要三百多块。问：这块手表多少钱？",
    "options": [
      {
        "text": "300 hơn đồng (三百多块)",
        "pinyin": "Sānbǎi duō kuài",
        "translation": "300 hơn đồng (三百多块)"
      },
      {
        "text": "1000 đồng (一千块)",
        "pinyin": "Yìqiān kuài",
        "translation": "1000 đồng (一千块)"
      },
      {
        "text": "500 đồng (五百块)",
        "pinyin": "Wǔbǎi kuài",
        "translation": "500 đồng (五百块)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nữ nói: '只要三百多块' (chỉ hơn 300 tệ).",
    "points": 5
  },
  {
    "id": "q-hsk2-01-12",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 3,
    "question_number": 12,
    "question_type": "multiple_choice",
    "prompt": "听对话，回答问题：",
    "pinyin": "Tīng duìhuà, huídá wèntí:",
    "translation": "Nghe đối thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "女：你学汉语学了多长时间了？男：我已经学了一年多了。问：男的学汉语多久了？",
    "options": [
      {
        "text": "Hơn 1 năm (一年多)",
        "pinyin": "Yì nián duō",
        "translation": "Hơn 1 năm (一年多)"
      },
      {
        "text": "Mấy tháng (几个月)",
        "pinyin": "Jǐ gè yuè",
        "translation": "Mấy tháng (几个月)"
      },
      {
        "text": "Ba năm (三年)",
        "pinyin": "Sān nián",
        "translation": "Ba năm (三年)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đã học hơn 1 năm: 一年多了.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-13",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 3,
    "question_number": 13,
    "question_type": "multiple_choice",
    "prompt": "听对话，回答问题：",
    "pinyin": "Tīng duìhuà, huídá wèntí:",
    "translation": "Nghe đối thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "男：从这里到火车站远吗？女：不远，走路十分钟就到了。问：去火车站远不远？",
    "options": [
      {
        "text": "Không xa, đi bộ 10 phút (不远，走路十分钟)",
        "pinyin": "Bù yuǎn, zǒulù shí fēnzhōng",
        "translation": "Không xa, đi bộ 10 phút (不远，走路十分钟)"
      },
      {
        "text": "Rất xa, phải đi xe bus (很远)",
        "pinyin": "Hěn yuǎn",
        "translation": "Rất xa, phải đi xe bus (很远)"
      },
      {
        "text": "Cần 1 tiếng (要一个小时)",
        "pinyin": "Yào yí gè xiǎoshí",
        "translation": "Cần 1 tiếng (要一个小时)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nữ nói không xa, đi bộ 10 phút là tới.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-14",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 3,
    "question_number": 14,
    "question_type": "multiple_choice",
    "prompt": "听对话，回答问题：",
    "pinyin": "Tīng duìhuà, huídá wèntí:",
    "translation": "Nghe đối thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "女：先生，您看这件红色的衣服怎么样？男：颜色很好看，但我更喜欢白色的。问：男的喜欢什么颜色的？",
    "options": [
      {
        "text": "Màu trắng (白色的)",
        "pinyin": "Báisè de",
        "translation": "Màu trắng (白色的)"
      },
      {
        "text": "Màu đỏ (红色的)",
        "pinyin": "Hóngsè de",
        "translation": "Màu đỏ (红色的)"
      },
      {
        "text": "Màu đen (黑色的)",
        "pinyin": "Hēisè de",
        "translation": "Màu đen (黑色的)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nam thích màu trắng: 我更喜欢白色的.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-15",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 3,
    "question_number": 15,
    "question_type": "multiple_choice",
    "prompt": "听对话，回答问题：",
    "pinyin": "Tīng duìhuà, huídá wèntí:",
    "translation": "Nghe đối thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "男：听说你要去北京旅游？女：对，下个星期一出发。问：女的什么时候出发？",
    "options": [
      {
        "text": "Thứ Hai tuần sau (下个星期一)",
        "pinyin": "Xià gè xīngqīyī",
        "translation": "Thứ Hai tuần sau (下个星期一)"
      },
      {
        "text": "Hôm nay (今天)",
        "pinyin": "Jīntiān",
        "translation": "Hôm nay (今天)"
      },
      {
        "text": "Tháng sau (下个月)",
        "pinyin": "Xià gè yuè",
        "translation": "Tháng sau (下个月)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Khởi hành vào thứ Hai tuần sau: 下个星期一出发.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-16",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 4,
    "question_number": 16,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "男：小丽，周末有时间一起去打篮球吗？女：不行，这个周末我要准备汉语考试。男：那祝你考出好成绩！问：女的周末要做什么？",
    "options": [
      {
        "text": "Chuẩn bị thi tiếng Trung (准备汉语考试)",
        "pinyin": "Zhǔnbèi Hànyǔ kǎoshì",
        "translation": "Chuẩn bị thi tiếng Trung (准备汉语考试)"
      },
      {
        "text": "Đi chơi bóng rổ (去打篮球)",
        "pinyin": "Qù dǎ lánqiú",
        "translation": "Đi chơi bóng rổ (去打篮球)"
      },
      {
        "text": "Đi xem phim (去看电影)",
        "pinyin": "Qù kàn diànyǐng",
        "translation": "Đi xem phim (去看电影)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nữ bận chuẩn bị cho kỳ thi tiếng Trung: 准备汉语考试.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-17",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 4,
    "question_number": 17,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "女：服务员，我们点的西瓜还没上来。男：不好意思，现在客人比较多，我马上给您催一下。问：女的在等什么？",
    "options": [
      {
        "text": "Dưa hấu (西瓜)",
        "pinyin": "Xīguā",
        "translation": "Dưa hấu (西瓜)"
      },
      {
        "text": "Trà (茶)",
        "pinyin": "Chá",
        "translation": "Trà (茶)"
      },
      {
        "text": "Cơm chiên (炒饭)",
        "pinyin": "Chǎofàn",
        "translation": "Cơm chiên (炒饭)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Món dưa hấu chưa mang lên: 西瓜还没上来.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-18",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 4,
    "question_number": 18,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "男：你每天怎么去公司上班？女：以前我坐公交车，现在我每天骑共享单车，既锻炼身体又环保。问：女的现在怎么上班？",
    "options": [
      {
        "text": "Đi xe đạp (骑自行车)",
        "pinyin": "Qí zìxíngchē",
        "translation": "Đi xe đạp (骑自行车)"
      },
      {
        "text": "Đi xe bus (坐公交车)",
        "pinyin": "Zuò gōngjiāochē",
        "translation": "Đi xe bus (坐公交车)"
      },
      {
        "text": "Lái xe hơi (开车)",
        "pinyin": "Kāichē",
        "translation": "Lái xe hơi (开车)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Hiện tại đi xe đạp: 骑共享单车/自行车.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-19",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 4,
    "question_number": 19,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "女：外面风很大，快把窗户关上吧。男：好，今天晚上气温可能降到零度以下呢。问：男的接下来要做什么？",
    "options": [
      {
        "text": "Đóng cửa sổ (关上窗户)",
        "pinyin": "Guānshang chuānghu",
        "translation": "Đóng cửa sổ (关上窗户)"
      },
      {
        "text": "Mở cửa sổ (开窗户)",
        "pinyin": "Kāi chuānghu",
        "translation": "Mở cửa sổ (开窗户)"
      },
      {
        "text": "Đi ra ngoài (出去)",
        "pinyin": "Chūqù",
        "translation": "Đi ra ngoài (出去)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nam sẽ đi đóng cửa sổ theo đề nghị: 把窗户关上.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-20",
    "exam_id": "hsk2-mock-01",
    "part_type": "listening",
    "part_number": 4,
    "question_number": 20,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "男：喂，王阿姨，大卫在家吗？女：他不在，他跟同学去图书馆借书了，下午四点才回来。问：大卫去了哪里？",
    "options": [
      {
        "text": "Thư viện (图书馆)",
        "pinyin": "Túshūguǎn",
        "translation": "Thư viện (图书馆)"
      },
      {
        "text": "Rạp chiếu phim (电影院)",
        "pinyin": "Diànyǐngyuàn",
        "translation": "Rạp chiếu phim (电影院)"
      },
      {
        "text": "Bệnh viện (医院)",
        "pinyin": "Yīyuàn",
        "translation": "Bệnh viện (医院)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đến thư viện mượn sách: 去图书馆借书.",
    "points": 5
  },
  {
    "id": "q-hsk2-01-21",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 21,
    "question_type": "multiple_choice",
    "prompt": "选词填空：今天比昨天______多了，快穿上外套吧。",
    "pinyin": "Xuǎncí tiánkòng: Jīntiān bǐ zuótiān ______ duō le, kuài chuān shang wàitào ba.",
    "translation": "Điền từ câu so sánh 比: Hôm nay lạnh hơn hôm qua nhiều...",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "冷 (Lạnh)",
        "pinyin": "Lěng",
        "translation": "冷 (Lạnh)"
      },
      {
        "text": "热 (Nóng)",
        "pinyin": "Rè",
        "translation": "热 (Nóng)"
      },
      {
        "text": "远 (Xa)",
        "pinyin": "Yuǎn",
        "translation": "远 (Xa)"
      },
      {
        "text": "快 (Nhanh)",
        "pinyin": "Kuài",
        "translation": "快 (Nhanh)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Vế sau bảo mặc áo khoác (快穿上外套), nên chọn '冷' (lạnh). Cấu trúc A + 比 + B + Adj + 多了.",
    "points": 6
  },
  {
    "id": "q-hsk2-01-22",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 22,
    "question_type": "multiple_choice",
    "prompt": "选词填空：虽然汉语很难，______我非常喜欢。",
    "pinyin": "Xuǎncí tiánkòng: Suīrán Hànyǔ hěn nán, ______ wǒ fēicháng xǐhuan.",
    "translation": "Điền liên từ nhượng bộ: Tuy tiếng Hán rất khó, ______ tôi rất thích.",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "但是 (Nhưng)",
        "pinyin": "Dànshì",
        "translation": "但是 (Nhưng)"
      },
      {
        "text": "所以 (Cho nên)",
        "pinyin": "Suǒyǐ",
        "translation": "所以 (Cho nên)"
      },
      {
        "text": "因为 (Bởi vì)",
        "pinyin": "Yīnwèi",
        "translation": "因为 (Bởi vì)"
      },
      {
        "text": "或者 (Hoặc)",
        "pinyin": "Huòzhě",
        "translation": "或者 (Hoặc)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cặp liên từ: 虽然...但是... (Tuy...nhưng...).",
    "points": 6
  },
  {
    "id": "q-hsk2-01-23",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 23,
    "question_type": "multiple_choice",
    "prompt": "选择正确的动词：他正在教室里______作业呢。",
    "pinyin": "Xuǎnzé zhèngquè de dòngcí: Tā zhèngzài jiàoshì lǐ ______ zuòyè ne.",
    "translation": "Chọn động từ kết hợp với bài tập (作业):",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "做 (Làm)",
        "pinyin": "Zuò",
        "translation": "做 (Làm)"
      },
      {
        "text": "吃 (Ăn)",
        "pinyin": "Chī",
        "translation": "吃 (Ăn)"
      },
      {
        "text": "买 (Mua)",
        "pinyin": "Mǎi",
        "translation": "买 (Mua)"
      },
      {
        "text": "听 (Nghe)",
        "pinyin": "Tīng",
        "translation": "听 (Nghe)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cụm cố định: 做作业 (làm bài tập).",
    "points": 6
  },
  {
    "id": "q-hsk2-01-24",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 24,
    "question_type": "multiple_choice",
    "prompt": "选词填空：我家离学校很______，每天走路五分钟就到了。",
    "pinyin": "Xuǎncí tiánkòng: Wǒ jiā lí xuéxiào hěn ______, měitiān zǒulù wǔ fēnzhōng jiù dào le.",
    "translation": "Điền từ chỉ khoảng cách: Nhà tôi cách trường rất ______...",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "近 (Gần)",
        "pinyin": "Jìn",
        "translation": "近 (Gần)"
      },
      {
        "text": "远 (Xa)",
        "pinyin": "Yuǎn",
        "translation": "远 (Xa)"
      },
      {
        "text": "高 (Cao)",
        "pinyin": "Gāo",
        "translation": "高 (Cao)"
      },
      {
        "text": "长 (Dài)",
        "pinyin": "Cháng",
        "translation": "长 (Dài)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đi bộ 5 phút tới nơi chứng tỏ rất gần: 近 (jìn).",
    "points": 6
  },
  {
    "id": "q-hsk2-01-25",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 25,
    "question_type": "multiple_choice",
    "prompt": "选词填空：因为今天下大雨，______我们不去踢足球了。",
    "pinyin": "Xuǎncí tiánkòng: Yīnwèi jīntiān xià dàyǔ, ______ wǒmen bú qù tī zúqiú le.",
    "translation": "Điền liên từ nguyên nhân - kết quả: Bởi vì hôm nay mưa to, ______ chúng tôi không đi đá bóng nữa.",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "所以 (Cho nên / Vì vậy)",
        "pinyin": "Suǒyǐ",
        "translation": "所以 (Cho nên / Vì vậy)"
      },
      {
        "text": "虽然 (Tuy rằng)",
        "pinyin": "Suīrán",
        "translation": "虽然 (Tuy rằng)"
      },
      {
        "text": "如果 (Nếu như)",
        "pinyin": "Rúguǒ",
        "translation": "如果 (Nếu như)"
      },
      {
        "text": "而且 (Hơn nữa)",
        "pinyin": "Érqiě",
        "translation": "而且 (Hơn nữa)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cặp liên từ nhân quả: 因为...所以... (Bởi vì...cho nên...).",
    "points": 6
  },
  {
    "id": "q-hsk2-01-26",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 26,
    "question_type": "multiple_choice",
    "prompt": "选择补语：这本书我已经看______了，你可以拿去看。",
    "pinyin": "Xuǎnzé bǔyǔ: Zhè běn shū wǒ yǐjīng kàn ______ le, nǐ kěyǐ ná qù kàn.",
    "translation": "Chọn bổ ngữ kết quả: Cuốn sách này tôi đã đọc ______ rồi...",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "完 (Xong)",
        "pinyin": "Wán",
        "translation": "完 (Xong)"
      },
      {
        "text": "懂 (Hiểu)",
        "pinyin": "Dǒng",
        "translation": "懂 (Hiểu)"
      },
      {
        "text": "错 (Sai)",
        "pinyin": "Cuò",
        "translation": "错 (Sai)"
      },
      {
        "text": "见 (Thấy)",
        "pinyin": "Jiàn",
        "translation": "见 (Thấy)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đọc xong: 看完了.",
    "points": 6
  },
  {
    "id": "q-hsk2-01-27",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 27,
    "question_type": "multiple_choice",
    "prompt": "选择动词：请大家______进，外边太冷了。",
    "pinyin": "Xuǎnzé dòngcí: Qǐng dàjiā ______ jìn, wàibian tài lěng le.",
    "translation": "Chọn động từ hướng di chuyển:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "快 (Mau / Nhanh)",
        "pinyin": "Kuài",
        "translation": "快 (Mau / Nhanh)"
      },
      {
        "text": "慢 (Chậm)",
        "pinyin": "Màn",
        "translation": "慢 (Chậm)"
      },
      {
        "text": "远 (Xa)",
        "pinyin": "Yuǎn",
        "translation": "远 (Xa)"
      },
      {
        "text": "高 (Cao)",
        "pinyin": "Gāo",
        "translation": "高 (Cao)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Mời mọi người mau vào: 请大家快进.",
    "points": 6
  },
  {
    "id": "q-hsk2-01-28",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 28,
    "question_type": "multiple_choice",
    "prompt": "选词填空：我想去商店买两______铅笔和一个笔记本。",
    "pinyin": "Xuǎncí tiánkòng: Wǒ xiǎng qù shāngdiàn mǎi liǎng ______ qiānbǐ hé yí gè bǐjìběn.",
    "translation": "Chọn lượng từ cho bút chì (铅笔):",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "支 (Cây / Chiếc)",
        "pinyin": "Zhī",
        "translation": "支 (Cây / Chiếc)"
      },
      {
        "text": "本 (Quyển)",
        "pinyin": "Běn",
        "translation": "本 (Quyển)"
      },
      {
        "text": "张 (Tờ)",
        "pinyin": "Zhāng",
        "translation": "张 (Tờ)"
      },
      {
        "text": "块 (Miếng)",
        "pinyin": "Kuài",
        "translation": "块 (Miếng)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lượng từ cho bút là 支: 两支铅笔.",
    "points": 6
  },
  {
    "id": "q-hsk2-01-29",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 29,
    "question_type": "multiple_choice",
    "prompt": "选词填空：这件衣服太小了，您有______大一点儿的吗？",
    "pinyin": "Xuǎncí tiánkòng: Zhè jiàn yīfu tài xiǎo le, nín yǒu ______ dà yìdiǎnr de ma?",
    "translation": "Chọn phó từ mức độ:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "更 (Càng / Hơn)",
        "pinyin": "Gèng",
        "translation": "更 (Càng / Hơn)"
      },
      {
        "text": "最 (Nhất)",
        "pinyin": "Zuì",
        "translation": "最 (Nhất)"
      },
      {
        "text": "都 (Đều)",
        "pinyin": "Dōu",
        "translation": "都 (Đều)"
      },
      {
        "text": "很 (Rất)",
        "pinyin": "Hěn",
        "translation": "很 (Rất)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "So sánh hơn: 更大一点儿 (cỡ to hơn một chút).",
    "points": 6
  },
  {
    "id": "q-hsk2-01-30",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 30,
    "question_type": "multiple_choice",
    "prompt": "选词填空：王医生，我头疼，应该吃什么______？",
    "pinyin": "Xuǎncí tiánkòng: Wáng yīshēng, wǒ tóuténg, yīnggāi chī shénme ______?",
    "translation": "Chọn danh từ y tế: Bác sĩ Vương, tôi đau đầu, nên uống ______ gì?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "药 (Thuốc)",
        "pinyin": "Yào",
        "translation": "药 (Thuốc)"
      },
      {
        "text": "茶 (Trà)",
        "pinyin": "Chá",
        "translation": "茶 (Trà)"
      },
      {
        "text": "饭 (Cơm)",
        "pinyin": "Fàn",
        "translation": "饭 (Cơm)"
      },
      {
        "text": "菜 (Thức ăn)",
        "pinyin": "Cài",
        "translation": "菜 (Thức ăn)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Uống thuốc là 吃药 (chī yào).",
    "points": 6
  },
  {
    "id": "q-hsk2-01-31",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 31,
    "question_type": "multiple_choice",
    "prompt": "问答配对：[请问，洗手间在几楼？]",
    "pinyin": "Wèndá pèiduì: [Qǐngwèn, xǐshǒujiān zài jǐ lóu?]",
    "translation": "Chọn câu đáp lại: 'Xin hỏi, nhà vệ sinh ở tầng mấy?'",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "在二楼，电梯旁边。 (Ở tầng 2, bên cạnh thang máy)",
        "pinyin": "Zài èr lóu...",
        "translation": "在二楼，电梯旁边。 (Ở tầng 2, bên cạnh thang máy)"
      },
      {
        "text": "我不要。 (Tôi không cần)",
        "pinyin": "Wǒ bú yào.",
        "translation": "我不要。 (Tôi không cần)"
      },
      {
        "text": "三十块钱。 (Ba mươi đồng)",
        "pinyin": "Sānshí kuài.",
        "translation": "三十块钱。 (Ba mươi đồng)"
      },
      {
        "text": "昨天去的。 (Đi hôm qua)",
        "pinyin": "Zuótiān qù de.",
        "translation": "昨天去的。 (Đi hôm qua)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Chỉ vị trí tầng: 在二楼.",
    "points": 6
  },
  {
    "id": "q-hsk2-01-32",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 32,
    "question_type": "multiple_choice",
    "prompt": "阅读理解：[北京的秋天天气最好，不冷也不热，树叶都变黄了，非常漂亮。] 问：北京什么时候天气最好？",
    "pinyin": "Yuèdú lǐjiě: [Běijīng de qiūtiān tiānqì zuì hǎo...] Wèn: Běijīng shénme shíhou tiānqì zuì hǎo?",
    "translation": "Đọc đoạn văn ngắn: Mùa nào ở Bắc Kinh thời tiết đẹp nhất?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "秋天 (Mùa thu)",
        "pinyin": "Qiūtiān",
        "translation": "秋天 (Mùa thu)"
      },
      {
        "text": "春天 (Mùa xuân)",
        "pinyin": "Chūntiān",
        "translation": "春天 (Mùa xuân)"
      },
      {
        "text": "夏天 (Mùa hè)",
        "pinyin": "Xiàtiān",
        "translation": "夏天 (Mùa hè)"
      },
      {
        "text": "冬天 (Mùa đông)",
        "pinyin": "Dōngtiān",
        "translation": "冬天 (Mùa đông)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đoạn văn viết: 北京的秋天天气最好 (Mùa thu ở Bắc Kinh thời tiết đẹp nhất).",
    "points": 6
  },
  {
    "id": "q-hsk2-01-33",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 33,
    "question_type": "multiple_choice",
    "prompt": "阅读理解：[我和哥哥都喜欢运动。我喜欢跑步，哥哥比我更喜欢游泳，他每天都游一个小时。] 问：哥哥喜欢什么运动？",
    "pinyin": "Yuèdú lǐjiě: Wèn: Gēge xǐhuan shénme yùndòng?",
    "translation": "Đọc hiểu: Người anh trai thích môn thể thao nào?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "游泳 (Bơi lội)",
        "pinyin": "Yóuyǒng",
        "translation": "游泳 (Bơi lội)"
      },
      {
        "text": "跑步 (Chạy bộ)",
        "pinyin": "Pǎobù",
        "translation": "跑步 (Chạy bộ)"
      },
      {
        "text": "打篮球 (Bóng rổ)",
        "pinyin": "Dǎ lánqiú",
        "translation": "打篮球 (Bóng rổ)"
      },
      {
        "text": "踢足球 (Đá bóng)",
        "pinyin": "Tī zúqiú",
        "translation": "踢足球 (Đá bóng)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đoạn văn nói rõ: 哥哥比我更喜欢游泳 (Anh trai thích bơi hơn).",
    "points": 6
  },
  {
    "id": "q-hsk2-01-34",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 34,
    "question_type": "multiple_choice",
    "prompt": "连词成句：[①比 ②哥哥 ③弟弟 ④高]",
    "pinyin": "Liáncí chéng jù: [①bǐ ②gēge ③dìdi ④gāo]",
    "translation": "Sắp xếp câu so sánh đúng:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "②①③④ (哥哥比弟弟高。)",
        "pinyin": "Gēge bǐ dìdi gāo.",
        "translation": "②①③④ (哥哥比弟弟高。)"
      },
      {
        "text": "①③②④ (比弟弟哥哥高。)",
        "pinyin": "Bǐ dìdi gēge gāo.",
        "translation": "①③②④ (比弟弟哥哥高。)"
      },
      {
        "text": "③④①② (弟弟高比哥哥。)",
        "pinyin": "Dìdi gāo bǐ gēge.",
        "translation": "③④①② (弟弟高比哥哥。)"
      },
      {
        "text": "②④①③ (哥哥高比弟弟。)",
        "pinyin": "Gēge gāo bǐ dìdi.",
        "translation": "②④①③ (哥哥高比弟弟。)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc: A + 比 + B + Tính từ (哥哥比弟弟高。).",
    "points": 6
  },
  {
    "id": "q-hsk2-01-35",
    "exam_id": "hsk2-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 35,
    "question_type": "multiple_choice",
    "prompt": "阅读判断：[小王今天穿了一件新的白衬衫，非常帅。] 问：小王今天穿了什么？",
    "pinyin": "Yuèdú pànduàn: Wèn: Xiǎowáng jīntiān chuān le shénme?",
    "translation": "Đọc hiểu: Hôm nay Tiểu Vương mặc trang phục gì?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "白衬衫 (Áo sơ mi trắng)",
        "pinyin": "Bái chènshān",
        "translation": "白衬衫 (Áo sơ mi trắng)"
      },
      {
        "text": "红外套 (Áo khoác đỏ)",
        "pinyin": "Hóng wàitào",
        "translation": "红外套 (Áo khoác đỏ)"
      },
      {
        "text": "黑毛衣 (Áo len đen)",
        "pinyin": "Hēi máoyī",
        "translation": "黑毛衣 (Áo len đen)"
      },
      {
        "text": "运动裤 (Quần thể thao)",
        "pinyin": "Yùndòngkù",
        "translation": "运动裤 (Quần thể thao)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Nội dung: 穿了一件新的白衬衫 (mặc chiếc áo sơ mi trắng mới).",
    "points": 6
  },
  {
    "id": "q-hsk3-01-01",
    "exam_id": "hsk3-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 1,
    "question_type": "multiple_choice",
    "prompt": "听对话，选择正确答案：",
    "pinyin": "Tīng duìhuà, xuǎnzé zhèngquè dá'àn:",
    "translation": "Nghe đối thoại, chọn đáp án đúng:",
    "audio_url": "",
    "audio_script": "男：小王，请问会议室在几层？女：在五层，出电梯往左走就是。问：会议室在几层？",
    "options": [
      {
        "text": "三层 (Tầng 3)",
        "pinyin": "Sān céng",
        "translation": "三层 (Tầng 3)"
      },
      {
        "text": "五层 (Tầng 5)",
        "pinyin": "Wǔ céng",
        "translation": "五层 (Tầng 5)"
      },
      {
        "text": "七层 (Tầng 7)",
        "pinyin": "Qī céng",
        "translation": "七层 (Tầng 7)"
      }
    ],
    "correct_option_index": 1,
    "explanation": "Lời thoại người nữ: '在五层，出电梯往左走就是'. Chọn Tầng 5.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-02",
    "exam_id": "hsk3-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 2,
    "question_type": "multiple_choice",
    "prompt": "听对话，判断女的打算买什么：",
    "pinyin": "Tīng duìhuà, pànduàn nǚ de dǎsuàn mǎi shénme:",
    "translation": "Nghe đối thoại, phán đoán người nữ định mua gì:",
    "audio_url": "",
    "audio_script": "男：天气越来越冷了，你得多穿点儿。女：是啊，我打算周末去商场买一件厚羽绒服。问：女的打算买什么？",
    "options": [
      {
        "text": "羽绒服 (Áo phao lông vũ)",
        "pinyin": "Yǔróngfú",
        "translation": "羽绒服 (Áo phao lông vũ)"
      },
      {
        "text": "衬衫 (Áo sơ mi)",
        "pinyin": "Chènshān",
        "translation": "衬衫 (Áo sơ mi)"
      },
      {
        "text": "雨伞 (Cái ô)",
        "pinyin": "Yǔsǎn",
        "translation": "雨伞 (Cái ô)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nữ nói: '我打算周末去商场买一件厚羽绒服'.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-03",
    "exam_id": "hsk3-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 3,
    "question_type": "multiple_choice",
    "prompt": "听对话，选择男的为什么迟到：",
    "pinyin": "Tīng duìhuà, xuǎnzé nán de wèishénme chídào:",
    "translation": "Nghe đối thoại, chọn lý do người nam đến muộn:",
    "audio_url": "",
    "audio_script": "女：你怎么迟到了半个小时？男：真抱歉，路上堵车太严重了。问：男的为什么迟到？",
    "options": [
      {
        "text": "Kẹt xe trên đường (路上堵车)",
        "pinyin": "Lùshang dǔchē",
        "translation": "Kẹt xe trên đường (路上堵车)"
      },
      {
        "text": "Ngủ quên (睡过头)",
        "pinyin": "Shuì guòtóu",
        "translation": "Ngủ quên (睡过头)"
      },
      {
        "text": "Xe hỏng (车坏了)",
        "pinyin": "Chē huài le",
        "translation": "Xe hỏng (车坏了)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lý do: 路上堵车太严重了 (kẹt xe nghiêm trọng).",
    "points": 8
  },
  {
    "id": "q-hsk3-01-04",
    "exam_id": "hsk3-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 4,
    "question_type": "multiple_choice",
    "prompt": "听对话，回答地点问题：",
    "pinyin": "Tīng duìhuà, huídá dìdiǎn wèntí:",
    "translation": "Nghe đối thoại, xác định địa điểm:",
    "audio_url": "",
    "audio_script": "男：请问，去故宫坐几路公共汽车？女：您得过马路，在对面坐103路车。问：男的要去哪里？",
    "options": [
      {
        "text": "Cố Cung (故宫)",
        "pinyin": "Gùgōng",
        "translation": "Cố Cung (故宫)"
      },
      {
        "text": "Sân bay (机场)",
        "pinyin": "Jīchǎng",
        "translation": "Sân bay (机场)"
      },
      {
        "text": "Bệnh viện (医院)",
        "pinyin": "Yīyuàn",
        "translation": "Bệnh viện (医院)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nam hỏi đường đến Cố Cung (故宫).",
    "points": 8
  },
  {
    "id": "q-hsk3-01-05",
    "exam_id": "hsk3-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 5,
    "question_type": "multiple_choice",
    "prompt": "听短文，判断正误：[经理今天下午要开会。]",
    "pinyin": "Tīng duǎnwén, pànduàn zhèngwù: [Jīnglǐ jīntiān xiàwǔ yào kāihuì.]",
    "translation": "Nghe ghi âm, phán đoán đúng sai: 'Giám đốc chiều nay phải họp.'",
    "audio_url": "",
    "audio_script": "张经理今天下午两点在三楼会议室主持工作会议，请大家准时参加。",
    "options": [
      {
        "text": "✓ Đúng (正确)",
        "pinyin": "Zhèngquè",
        "translation": "✓ Đúng (正确)"
      },
      {
        "text": "✗ Sai (错误)",
        "pinyin": "Cuòwù",
        "translation": "✗ Sai (错误)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Giám đốc Trương chủ trì cuộc họp chiều nay: Đúng.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-06",
    "exam_id": "hsk3-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 6,
    "question_type": "multiple_choice",
    "prompt": "听对话，选择就医建议：",
    "pinyin": "Tīng duìhuà, xuǎnzé jiùyī jiànyì:",
    "translation": "Nghe đối thoại, chọn lời khuyên của bác sĩ:",
    "audio_url": "",
    "audio_script": "男：医生，我发烧38度，头很疼。女：你感冒了，回去多喝温水，按时吃药，好好休息两天。问：女的建议男的怎么做？",
    "options": [
      {
        "text": "Nghỉ ngơi và uống nhiều nước (多喝水休息)",
        "pinyin": "Duō hē shuǐ xiūxi",
        "translation": "Nghỉ ngơi và uống nhiều nước (多喝水休息)"
      },
      {
        "text": "Đi làm việc ngay (去上班)",
        "pinyin": "Qù shàngbān",
        "translation": "Đi làm việc ngay (去上班)"
      },
      {
        "text": "Tập thể dục mạnh (去跑步)",
        "pinyin": "Qù pǎobù",
        "translation": "Tập thể dục mạnh (去跑步)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lời khuyên: 多喝温水，按时吃药，好好休息两天.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-07",
    "exam_id": "hsk3-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 7,
    "question_type": "multiple_choice",
    "prompt": "听对话，选择人物的关系：",
    "pinyin": "Tīng duìhuà, xuǎnzé rénwù de guānxì:",
    "translation": "Nghe đối thoại, chọn mối quan hệ giữa hai người:",
    "audio_url": "",
    "audio_script": "男：服务员，请给我们换一个靠窗的桌子。女：好的先生，请随我来这边。问：他们是什么关系？",
    "options": [
      {
        "text": "Khách và phục vụ (顾客和服务员)",
        "pinyin": "Gùkè hé fúwùyuán",
        "translation": "Khách và phục vụ (顾客和服务员)"
      },
      {
        "text": "Đồng nghiệp (同事)",
        "pinyin": "Tóngshì",
        "translation": "Đồng nghiệp (同事)"
      },
      {
        "text": "Vợ chồng (夫妻)",
        "pinyin": "Fūqī",
        "translation": "Vợ chồng (夫妻)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Xưng hô '服务员' và '先生' là quan hệ khách - người phục vụ.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-08",
    "exam_id": "hsk3-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 8,
    "question_type": "multiple_choice",
    "prompt": "听对话，回答价格问题：",
    "pinyin": "Tīng duìhuà, huídá jiàgé wèntí:",
    "translation": "Nghe đối thoại, trả lời giá tiền:",
    "audio_url": "",
    "audio_script": "女：这双皮鞋原价八百块，今天打五折，只要四百块。男：太划算了，我买一双。问：男的要付多少钱？",
    "options": [
      {
        "text": "400 đồng (四百块)",
        "pinyin": "Sìbǎi kuài",
        "translation": "400 đồng (四百块)"
      },
      {
        "text": "800 đồng (八百块)",
        "pinyin": "Bābǎi kuài",
        "translation": "800 đồng (八百块)"
      },
      {
        "text": "500 đồng (五百块)",
        "pinyin": "Wǔbǎi kuài",
        "translation": "500 đồng (五百块)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Giảm 50% còn 400 tệ: 只要四百块.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-09",
    "exam_id": "hsk3-mock-01",
    "part_type": "listening",
    "part_number": 3,
    "question_number": 9,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "男：你学中国画学了多久了？女：三年了，我每逢周末都去文化宫跟老师练习。问：女的学中国画几年了？",
    "options": [
      {
        "text": "3 năm (三年)",
        "pinyin": "Sān nián",
        "translation": "3 năm (三年)"
      },
      {
        "text": "1 năm (一年)",
        "pinyin": "Yì nián",
        "translation": "1 năm (一年)"
      },
      {
        "text": "5 năm (五年)",
        "pinyin": "Wǔ nián",
        "translation": "5 năm (五年)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Học vẽ tranh Trung Quốc 3 năm: 三年了.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-10",
    "exam_id": "hsk3-mock-01",
    "part_type": "listening",
    "part_number": 3,
    "question_number": 10,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "女：你看见我的护照了吗？明天出国要用呢。男：放在客厅茶几上面的包里了，快去拿吧。问：护照在哪里？",
    "options": [
      {
        "text": "Trong túi trên bàn trà (包里)",
        "pinyin": "Bāo lǐ",
        "translation": "Trong túi trên bàn trà (包里)"
      },
      {
        "text": "Dưới giường (床下)",
        "pinyin": "Chuáng xià",
        "translation": "Dưới giường (床下)"
      },
      {
        "text": "Trong văn phòng (办公室)",
        "pinyin": "Bàngōngshì",
        "translation": "Trong văn phòng (办公室)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "放在客厅茶几上面的包里了 (trong túi xách trên bàn trà).",
    "points": 8
  },
  {
    "id": "q-hsk3-01-11",
    "exam_id": "hsk3-mock-01",
    "part_type": "listening",
    "part_number": 3,
    "question_number": 11,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "男：小李，这份报告写得非常清楚，数据也很准确。女：谢谢经理，都是大家共同努力的结果。问：经理对这份报告态度如何？",
    "options": [
      {
        "text": "Khen ngợi, hài lòng (非常满意)",
        "pinyin": "Fēicháng mǎnyì",
        "translation": "Khen ngợi, hài lòng (非常满意)"
      },
      {
        "text": "Chê bai (不满意)",
        "pinyin": "Bù mǎnyì",
        "translation": "Chê bai (不满意)"
      },
      {
        "text": "Yêu cầu viết lại (重写)",
        "pinyin": "Chóngxiě",
        "translation": "Yêu cầu viết lại (重写)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Giám đốc khen: '写得非常清楚，数据也很准确' (hài lòng).",
    "points": 8
  },
  {
    "id": "q-hsk3-01-12",
    "exam_id": "hsk3-mock-01",
    "part_type": "listening",
    "part_number": 3,
    "question_number": 12,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "女：听说你搬新家了？环境怎么样？男：小区绿化特别好，附近还有公园和超市，非常方便。问：男的新家附近有什么？",
    "options": [
      {
        "text": "Công viên và siêu thị (公园和超市)",
        "pinyin": "Gōngyuán hé chāoshì",
        "translation": "Công viên và siêu thị (公园和超市)"
      },
      {
        "text": "Trường đại học (大学)",
        "pinyin": "Dàxué",
        "translation": "Trường đại học (大学)"
      },
      {
        "text": "Bến xe khách (车站)",
        "pinyin": "Chēzhàn",
        "translation": "Bến xe khách (车站)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Gần công viên và siêu thị: 附近还有公园和超市.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-13",
    "exam_id": "hsk3-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 13,
    "question_type": "multiple_choice",
    "prompt": "选词填空：请大家在进入考场前，______把手机关机。",
    "pinyin": "Xuǎncí tiánkòng: Qǐng dàjiā zài jìnrù kǎochǎng qián, ______ bǎ shǒujī guānjī.",
    "translation": "Điền phó từ: Xin mọi người trước khi vào phòng thi, ______ phải tắt nguồn điện thoại.",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "一定要 (Nhất định phải)",
        "pinyin": "Yídìng yào",
        "translation": "一定要 (Nhất định phải)"
      },
      {
        "text": "随便 (Tùy tiện)",
        "pinyin": "Suíbiàn",
        "translation": "随便 (Tùy tiện)"
      },
      {
        "text": "偶尔 (Thỉnh thoảng)",
        "pinyin": "Ǒu'ěr",
        "translation": "偶尔 (Thỉnh thoảng)"
      },
      {
        "text": "大概 (Đại khái)",
        "pinyin": "Dàgài",
        "translation": "大概 (Đại khái)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Quy chế phòng thi: 一定要 (nhất định phải).",
    "points": 8
  },
  {
    "id": "q-hsk3-01-14",
    "exam_id": "hsk3-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 14,
    "question_type": "multiple_choice",
    "prompt": "选词填空：经过两年的努力，他的汉语水平有了很大的______。",
    "pinyin": "Xuǎncí tiánkòng: Jīngguò liǎng nián de nǔlì, tā de Hànyǔ shuǐpíng yǒu le hěn dà de ______.",
    "translation": "Điền danh từ kết hợp với水平 (trình độ):",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "提高 (Nâng cao / Tiến bộ)",
        "pinyin": "Tígāo",
        "translation": "提高 (Nâng cao / Tiến bộ)"
      },
      {
        "text": "发现 (Phát hiện)",
        "pinyin": "Fāxiàn",
        "translation": "发现 (Phát hiện)"
      },
      {
        "text": "检查 (Kiểm tra)",
        "pinyin": "Jiǎnchá",
        "translation": "检查 (Kiểm tra)"
      },
      {
        "text": "同意 (Đồng ý)",
        "pinyin": "Tóngyì",
        "translation": "同意 (Đồng ý)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cụm danh từ: 水平有了很大的提高 (trình độ được nâng cao lớn).",
    "points": 8
  },
  {
    "id": "q-hsk3-01-15",
    "exam_id": "hsk3-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 15,
    "question_type": "multiple_choice",
    "prompt": "选词填空：这道数学题太难了，我怎么算也算不______。",
    "pinyin": "Xuǎncí tiánkòng: Zhè dào shùxuétí tài nán le, wǒ zěnme suàn yě suàn bu ______.",
    "translation": "Chọn bổ ngữ khả năng: Đề toán này khó quá, tôi tính thế nào cũng không ______...",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "出来 (Ra được)",
        "pinyin": "Chūlai",
        "translation": "出来 (Ra được)"
      },
      {
        "text": "过去 (Qua được)",
        "pinyin": "Guòqu",
        "translation": "过去 (Qua được)"
      },
      {
        "text": "起来 (Lên được)",
        "pinyin": "Qǐlai",
        "translation": "起来 (Lên được)"
      },
      {
        "text": "下去 (Tiếp được)",
        "pinyin": "Xiàqu",
        "translation": "下去 (Tiếp được)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Bổ ngữ khả năng: 算不出来 (không tính ra được).",
    "points": 8
  },
  {
    "id": "q-hsk3-01-16",
    "exam_id": "hsk3-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 16,
    "question_type": "multiple_choice",
    "prompt": "选词填空：你最近工作太忙了，______要注意身体。",
    "pinyin": "Xuǎncí tiánkòng: Nǐ zuìjìn gōngzuò tài máng le, ______ yào zhùyì shēntǐ.",
    "translation": "Chọn liên từ phù hợp:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "千万 (Nhất thiết / Tuyệt đối)",
        "pinyin": "Qiānwàn",
        "translation": "千万 (Nhất thiết / Tuyệt đối)"
      },
      {
        "text": "或者 (Hoặc)",
        "pinyin": "Huòzhě",
        "translation": "或者 (Hoặc)"
      },
      {
        "text": "难道 (Chẳng lẽ)",
        "pinyin": "Nándào",
        "translation": "难道 (Chẳng lẽ)"
      },
      {
        "text": "故意 (Cố ý)",
        "pinyin": "Gùyì",
        "translation": "故意 (Cố ý)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lời dặn dò khuyên can thiết tha: 千万要注意身体.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-17",
    "exam_id": "hsk3-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 17,
    "question_type": "multiple_choice",
    "prompt": "选择关联词：______明天下雨，运动会______推迟举行。",
    "pinyin": "Xuǎnzé guānliáncí: ______ míngtiān xià yǔ, yùndònghuì ______ tuīchí jǔxíng.",
    "translation": "Chọn cặp liên từ giả thiết:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "如果...就... (Nếu...thì...)",
        "pinyin": "Rúguǒ...jiù...",
        "translation": "如果...就... (Nếu...thì...)"
      },
      {
        "text": "虽然...但是... (Tuy...nhưng...)",
        "pinyin": "Suīrán...dànshì...",
        "translation": "虽然...但是... (Tuy...nhưng...)"
      },
      {
        "text": "不仅...而且... (Không chỉ...mà còn...)",
        "pinyin": "Bùjǐn...érqiě...",
        "translation": "不仅...而且... (Không chỉ...mà còn...)"
      },
      {
        "text": "只有...才... (Chỉ có...mới...)",
        "pinyin": "Zhǐyǒu...cái...",
        "translation": "只有...才... (Chỉ có...mới...)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Giả thiết điều kiện: 如果明天下雨，就推迟.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-18",
    "exam_id": "hsk3-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 18,
    "question_type": "multiple_choice",
    "prompt": "选词填空：图书馆里必须保持安静，请不要大声______。",
    "pinyin": "Xuǎncí tiánkòng: Túshūguǎn lǐ bìxū bǎochí ānjìng, qǐng bú yào dàshēng ______.",
    "translation": "Chọn động từ phù hợp quy định thư viện:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "说话 (Nói chuyện)",
        "pinyin": "Shuōhuà",
        "translation": "说话 (Nói chuyện)"
      },
      {
        "text": "看书 (Đọc sách)",
        "pinyin": "Kàn shū",
        "translation": "看书 (Đọc sách)"
      },
      {
        "text": "借书 (Mượn sách)",
        "pinyin": "Jiè shū",
        "translation": "借书 (Mượn sách)"
      },
      {
        "text": "走路 (Đi bộ)",
        "pinyin": "Zǒu lù",
        "translation": "走路 (Đi bộ)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Giữ yên tĩnh, không được nói to: 不要大声说话.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-19",
    "exam_id": "hsk3-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 19,
    "question_type": "multiple_choice",
    "prompt": "阅读理解：[中国有句古话叫‘熟能生巧’。意思是说，无论做什么事情，只要经常练习，掌握了规律，就能做得又快又好。] 问：‘熟能生巧’的意思是什么？",
    "pinyin": "Yuèdú lǐjiě: Wèn: 'Shúnéngshēngqiǎo' de yìsi shì shénme?",
    "translation": "Đọc hiểu: Thành ngữ 'Thục năng sinh xảo' nghĩa là gì?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "Luyện tập nhiều sẽ thành thạo và giỏi (经常练习就能做好)",
        "pinyin": "Jīngcháng liànxí jiù néng zuò hǎo",
        "translation": "Luyện tập nhiều sẽ thành thạo và giỏi (经常练习就能做好)"
      },
      {
        "text": "Phải có tài năng bẩm sinh (需要天赋)",
        "pinyin": "Xūyào tiānfù",
        "translation": "Phải có tài năng bẩm sinh (需要天赋)"
      },
      {
        "text": "Làm việc phải nhờ người khác (依靠别人)",
        "pinyin": "Yīkào biérén",
        "translation": "Làm việc phải nhờ người khác (依靠别人)"
      },
      {
        "text": "Không cần luyện tập (不用练习)",
        "pinyin": "Bú yòng liànxí",
        "translation": "Không cần luyện tập (不用练习)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đoạn văn giải thích: 经常练习，掌握规律，就能做好.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-20",
    "exam_id": "hsk3-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 20,
    "question_type": "multiple_choice",
    "prompt": "阅读理解：[很多人认为只有吃药才能治病，其实保持心情愉快、规律作息和适量运动对健康更重要。] 问：作者认为什么对健康更重要？",
    "pinyin": "Yuèdú lǐjiě: Wèn: Zuòzhě rènwéi shénme duì jiànkāng gèng zhòngyào?",
    "translation": "Đọc hiểu: Tác giả cho rằng điều gì quan trọng hơn cho sức khỏe?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "Tâm trạng tốt, sinh hoạt điều độ và thể dục (心情愉快、规律作息和运动)",
        "pinyin": "Xīnqíng yúkuài, guīlǜ zuòxī...",
        "translation": "Tâm trạng tốt, sinh hoạt điều độ và thể dục (心情愉快、规律作息和运动)"
      },
      {
        "text": "Chỉ cần uống thật nhiều thuốc (多吃药)",
        "pinyin": "Duō chī yào",
        "translation": "Chỉ cần uống thật nhiều thuốc (多吃药)"
      },
      {
        "text": "Làm việc suốt ngày đêm (一直工作)",
        "pinyin": "Yìzhí gōngzuò",
        "translation": "Làm việc suốt ngày đêm (一直工作)"
      },
      {
        "text": "Ăn nhiều đồ ngọt (多吃甜食)",
        "pinyin": "Duō chī tiánshí",
        "translation": "Ăn nhiều đồ ngọt (多吃甜食)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Tác giả chỉ ra: 保持心情愉快、规律作息和适量运动更重要.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-21",
    "exam_id": "hsk3-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 21,
    "question_type": "multiple_choice",
    "prompt": "阅读理解：[小李平时不爱说话，但是在今天的演讲比赛中，他的表现非常出色，赢得了所有评委的掌声。] 问：关于小李，下列哪项正确？",
    "pinyin": "Yuèdú lǐjiě: Wèn: Guānyú Xiǎolǐ, xiàliè nǎ xiàng zhèngquè?",
    "translation": "Đọc hiểu: Nhận định nào đúng về Tiểu Lý?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "Cuộc thi diễn thuyết hôm nay thể hiện rất xuất sắc (今天演讲很出色)",
        "pinyin": "Jīntiān yǎnjiǎng hěn chūsè",
        "translation": "Cuộc thi diễn thuyết hôm nay thể hiện rất xuất sắc (今天演讲很出色)"
      },
      {
        "text": "Thường ngày rất hoạt ngôn (平时爱说话)",
        "pinyin": "Píngshí ài shuōhuà",
        "translation": "Thường ngày rất hoạt ngôn (平时爱说话)"
      },
      {
        "text": "Không tham gia thi (没参加比赛)",
        "pinyin": "Méi cānjiā bǐsài",
        "translation": "Không tham gia thi (没参加比赛)"
      },
      {
        "text": "Giám khảo không vỗ tay (评委没鼓掌)",
        "pinyin": "Píngwěi méi gǔzhǎng",
        "translation": "Giám khảo không vỗ tay (评委没鼓掌)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đoạn văn viết: 表现非常出色，赢得了掌声.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-22",
    "exam_id": "hsk3-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 22,
    "question_type": "multiple_choice",
    "prompt": "选词填空：这个问题很复杂，我们必须开会详细______一下。",
    "pinyin": "Xuǎncí tiánkòng: Zhè gè wèntí hěn fùzá, wǒmen bìxū kāihuì xiángxì ______ yíxià.",
    "translation": "Chọn động từ thảo luận bàn bạc:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "讨论 (Thảo luận)",
        "pinyin": "Tǎolùn",
        "translation": "讨论 (Thảo luận)"
      },
      {
        "text": "以为 (Tưởng rằng)",
        "pinyin": "Yǐwéi",
        "translation": "以为 (Tưởng rằng)"
      },
      {
        "text": "回答 (Trả lời)",
        "pinyin": "Huídá",
        "translation": "回答 (Trả lời)"
      },
      {
        "text": "明白 (Hiểu rõ)",
        "pinyin": "Míngbai",
        "translation": "明白 (Hiểu rõ)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Họp để bàn bạc kỹ lưỡng: 详细讨论一下.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-23",
    "exam_id": "hsk3-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 23,
    "question_type": "multiple_choice",
    "prompt": "选词填空：天黑了，请把客厅的灯______开。",
    "pinyin": "Xuǎncí tiánkòng: Tiān hēi le, qǐng bǎ kètīng de dēng ______ kāi.",
    "translation": "Chọn động từ bật đèn:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "打 (Bật)",
        "pinyin": "Dǎ",
        "translation": "打 (Bật)"
      },
      {
        "text": "拿 (Cầm)",
        "pinyin": "Ná",
        "translation": "拿 (Cầm)"
      },
      {
        "text": "拉 (Kéo)",
        "pinyin": "Lā",
        "translation": "拉 (Kéo)"
      },
      {
        "text": "推 (Đẩy)",
        "pinyin": "Tuī",
        "translation": "推 (Đẩy)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Bật đèn: 打开灯 / 把灯打开.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-24",
    "exam_id": "hsk3-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 24,
    "question_type": "multiple_choice",
    "prompt": "选词填空：虽然遇到很多困难，但他______坚持完成了这项任务。",
    "pinyin": "Xuǎncí tiánkòng: Suīrán yùdào hěn duō kùnnan, dàn tā ______ jiānchí wánchéng le zhè xiàng rènwu.",
    "translation": "Chọn phó từ biểu thị sự kiên trì liên tục:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "仍然 (Vẫn / Vẫn cứ)",
        "pinyin": "Réngrán",
        "translation": "仍然 (Vẫn / Vẫn cứ)"
      },
      {
        "text": "突然 (Đột nhiên)",
        "pinyin": "Tūrán",
        "translation": "突然 (Đột nhiên)"
      },
      {
        "text": "马上 (Ngay lập tức)",
        "pinyin": "Mǎshàng",
        "translation": "马上 (Ngay lập tức)"
      },
      {
        "text": "特别 (Đặc biệt)",
        "pinyin": "Tèbié",
        "translation": "特别 (Đặc biệt)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Vẫn kiên trì hoàn thành: 仍然坚持完成.",
    "points": 8
  },
  {
    "id": "q-hsk3-01-25",
    "exam_id": "hsk3-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 25,
    "question_type": "reorder_sentence",
    "prompt": "连词成句（把字句）：排列下列词语成句：",
    "pinyin": "Liáncí chéng jù (Bǎ zì jù): Páiliè xiàliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu chữ 把: Hãy xếp các cụm từ sau thành câu hoàn chỉnh:",
    "words": [
      "请",
      "把",
      "空调",
      "关上"
    ],
    "scrambledWords": [
      "把",
      "关上",
      "空调",
      "请"
    ],
    "correct_order": [
      "请",
      "把",
      "空调",
      "关上"
    ],
    "answerKey": [
      "请",
      "把",
      "空调",
      "关上"
    ],
    "correct_sentence": "请把空调关上。",
    "options": [
      {
        "text": "请把空调关上。",
        "pinyin": "Qǐng bǎ kōngtiáo guānshang.",
        "translation": "Xin hãy tắt điều hòa."
      },
      {
        "text": "把空调请关上。",
        "pinyin": "Bǎ kōngtiáo qǐng guānshang.",
        "translation": "Sai vị trí từ thỉnh cầu"
      },
      {
        "text": "请关上把空调。",
        "pinyin": "Qǐng guānshang bǎ kōngtiáo.",
        "translation": "Sai cấu trúc câu chữ 把"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc câu chữ 把: 主语 (请) + 把 + 宾语 (空调) + 动词及补语 (关上).",
    "points": 10
  },
  {
    "id": "q-hsk3-01-26",
    "exam_id": "hsk3-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 26,
    "question_type": "reorder_sentence",
    "prompt": "连词成句（被字句）：排列下列词语成句：",
    "pinyin": "Liáncí chéng jù (Bèi zì jù): Páiliè xiàliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu bị động chữ 被:",
    "words": [
      "桌子上的蛋糕",
      "被",
      "弟弟",
      "吃光了"
    ],
    "scrambledWords": [
      "被",
      "吃光了",
      "桌子上的蛋糕",
      "弟弟"
    ],
    "correct_order": [
      "桌子上的蛋糕",
      "被",
      "弟弟",
      "吃光了"
    ],
    "answerKey": [
      "桌子上的蛋糕",
      "被",
      "弟弟",
      "吃光了"
    ],
    "correct_sentence": "桌子上的蛋糕被弟弟吃光了。",
    "options": [
      {
        "text": "桌子上的蛋糕被弟弟吃光了。",
        "pinyin": "Zhuōzi shang de dàngāo bèi dìdi chīguāng le.",
        "translation": "Bánh kem trên bàn bị em trai ăn sạch rồi."
      },
      {
        "text": "弟弟被桌子上的蛋糕吃光了。",
        "pinyin": "Dìdi bèi zhuōzi shang de dàngāo chīguāng le.",
        "translation": "Nghịch nghĩa logic"
      },
      {
        "text": "桌子上的蛋糕吃光了被弟弟。",
        "pinyin": "Zhuōzi shang de dàngāo chīguāng le bèi dìdi.",
        "translation": "Sai vị trí chữ 被"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc câu chữ 被: 受事 (桌子上的蛋糕) + 被 + 施事 (弟弟) + 动词补语 (吃光了).",
    "points": 10
  },
  {
    "id": "q-hsk3-01-27",
    "exam_id": "hsk3-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 27,
    "question_type": "reorder_sentence",
    "prompt": "连词成句（越...越...句型）：排列词语成句：",
    "pinyin": "Liáncí chéng jù (Yuè...yuè... jùxíng): Páiliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu cấu trúc 'Càng...càng...':",
    "words": [
      "雨",
      "越下",
      "越大",
      "了"
    ],
    "scrambledWords": [
      "越大",
      "雨",
      "了",
      "越下"
    ],
    "correct_order": [
      "雨",
      "越下",
      "越大",
      "了"
    ],
    "answerKey": [
      "雨",
      "越下",
      "越大",
      "了"
    ],
    "correct_sentence": "雨越下越大了。",
    "options": [
      {
        "text": "雨越下越大了。",
        "pinyin": "Yǔ yuè xià yuè dà le.",
        "translation": "Mưa càng rơi càng to."
      },
      {
        "text": "越下雨越大发。",
        "pinyin": "Yuè xià yǔ yuè dà fā.",
        "translation": "Sai cấu trúc"
      },
      {
        "text": "越大雨越下了。",
        "pinyin": "Yuè dà yǔ yuè xià le.",
        "translation": "Lộn trật tự"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc: 主语 + 越 + 动词 + 越 + 形容词 + 了: 雨越下越大了.",
    "points": 10
  },
  {
    "id": "q-hsk3-01-28",
    "exam_id": "hsk3-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 28,
    "question_type": "reorder_sentence",
    "prompt": "连词成句（比较句）：排列词语成句：",
    "pinyin": "Liáncí chéng jù (Bǐjiào jù): Páiliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu so sánh chữ 比 có bổ ngữ số lượng:",
    "words": [
      "妹妹",
      "比",
      "姐姐",
      "小两岁"
    ],
    "scrambledWords": [
      "姐姐",
      "比",
      "小两岁",
      "妹妹"
    ],
    "correct_order": [
      "妹妹",
      "比",
      "姐姐",
      "小两岁"
    ],
    "answerKey": [
      "妹妹",
      "比",
      "姐姐",
      "小两岁"
    ],
    "correct_sentence": "妹妹比姐姐小两岁。",
    "options": [
      {
        "text": "妹妹比姐姐小两岁。",
        "pinyin": "Mèimei bǐ jiějie xiǎo liǎng suì.",
        "translation": "Em gái nhỏ hơn chị gái 2 tuổi."
      },
      {
        "text": "妹妹小两岁比姐姐。",
        "pinyin": "Mèimei xiǎo liǎng suì bǐ jiějie.",
        "translation": "Sai trật tự bổ ngữ"
      },
      {
        "text": "姐姐比妹妹小两岁。",
        "pinyin": "Jiějie bǐ mèimei xiǎo liǎng suì.",
        "translation": "Sai logic gia đình"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc: A + 比 + B + 形容词 + 数量差: 妹妹比姐姐小两岁.",
    "points": 10
  },
  {
    "id": "q-hsk3-01-29",
    "exam_id": "hsk3-mock-01",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 29,
    "question_type": "fill_blank",
    "prompt": "读拼音写汉字：他是我最好的朋[yǒu]______。",
    "pinyin": "Dú pīnyīn xiě hànzì: Tā shì wǒ zuì hǎo de péng[yǒu]______.",
    "translation": "Điền chữ Hán tương ứng với phiên âm [yǒu]: Anh ấy là bạn [yǒu] thân nhất của tôi.",
    "accepted_answers": [
      "友",
      "朋友"
    ],
    "sample_answer": "友",
    "options": [
      {
        "text": "友 (Bạn)",
        "pinyin": "yǒu",
        "translation": "Chữ Hán chính xác trong 朋友"
      },
      {
        "text": "有 (Có)",
        "pinyin": "yǒu",
        "translation": "Sai nghĩa từ vựng"
      },
      {
        "text": "又 (Lại)",
        "pinyin": "yòu",
        "translation": "Sai chữ Hán"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Từ ghép '朋友' (péngyou). Chữ cần điền là '友'.",
    "points": 10
  },
  {
    "id": "q-hsk3-01-30",
    "exam_id": "hsk3-mock-01",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 30,
    "question_type": "fill_blank",
    "prompt": "读拼音写汉字：我们明天下午三[diǎn]______在校门口集合。",
    "pinyin": "Dú pīnyīn xiě hànzì: Wǒmen míngtiān xiàwǔ sān [diǎn]______ zài xiàoménkǒu jíhé.",
    "translation": "Điền chữ Hán chỉ thời gian [diǎn]: Chúng ta chiều mai 3 giờ [diǎn] tập trung ở cổng trường.",
    "accepted_answers": [
      "点"
    ],
    "sample_answer": "点",
    "options": [
      {
        "text": "点 (Giờ)",
        "pinyin": "diǎn",
        "translation": "Chữ Hán chính xác chỉ giờ giấc"
      },
      {
        "text": "电 (Điện)",
        "pinyin": "diàn",
        "translation": "Sai nghĩa"
      },
      {
        "text": "店 (Tiệm)",
        "pinyin": "diàn",
        "translation": "Sai nghĩa"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Từ chỉ giờ: '点' (diǎn) trong '三点'.",
    "points": 10
  },
  {
    "id": "q-hsk4-01-01",
    "exam_id": "hsk4-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 1,
    "question_type": "multiple_choice",
    "prompt": "听对话，回答问题（只播放一次）：",
    "pinyin": "Tīng duìhuà, huídá wèntí:",
    "translation": "Nghe đối thoại (chỉ phát duy nhất 1 lần):",
    "audio_url": "",
    "audio_script": "男：李经理，这是我们部门下季度的广告预算方案，请您过目。女：好的，先放这儿吧，我今天下午仔细看看，明天上午咱们再开会讨论。问：女的打算什么时候开会讨论？",
    "options": [
      {
        "text": "Thứ Hai tuần sau (下周一)",
        "pinyin": "Xià zhōuyī",
        "translation": "Thứ Hai tuần sau (下周一)"
      },
      {
        "text": "Sáng mai (明天上午)",
        "pinyin": "Míngtiān shàngwǔ",
        "translation": "Sáng mai (明天上午)"
      },
      {
        "text": "Chiều nay (今天下午)",
        "pinyin": "Jīntiān xiàwǔ",
        "translation": "Chiều nay (今天下午)"
      }
    ],
    "correct_option_index": 1,
    "explanation": "Lời thoại người nữ: '明天上午咱们再开会讨论'. Chọn Sáng mai.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-02",
    "exam_id": "hsk4-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 2,
    "question_type": "multiple_choice",
    "prompt": "听对话，判断男的对于换工作的态度：",
    "pinyin": "Tīng duìhuà, pànduàn nán de duìyú huàn gōngzuò de tàidu:",
    "translation": "Nghe đối thoại, phán đoán thái độ về việc đổi chỗ làm:",
    "audio_url": "",
    "audio_script": "女：听说你打算辞职去深圳发展？男：是的，虽然现在这份工作很稳定，但深圳的机会更多，我想趁年轻多去闯一闯。问：男的为什么想去深圳？",
    "options": [
      {
        "text": "Muốn tìm thêm nhiều cơ hội thử thách (机会更多，想去闯闯)",
        "pinyin": "Jīhuì gèng duō...",
        "translation": "Muốn tìm thêm nhiều cơ hội thử thách (机会更多，想去闯闯)"
      },
      {
        "text": "Vì bị sa thải (被开除)",
        "pinyin": "Bèi kāichú",
        "translation": "Vì bị sa thải (被开除)"
      },
      {
        "text": "Vì không thích đồng nghiệp (不喜欢同事)",
        "pinyin": "Bù xǐhuan tóngshì",
        "translation": "Vì không thích đồng nghiệp (不喜欢同事)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lý do: 深圳的机会更多，想趁年轻多闯一闯.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-03",
    "exam_id": "hsk4-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 3,
    "question_type": "multiple_choice",
    "prompt": "听对话，回答租房问题：",
    "pinyin": "Tīng duìhuà, huídá zūfáng wèntí:",
    "translation": "Nghe đối thoại, chọn thông tin căn hộ cho thuê:",
    "audio_url": "",
    "audio_script": "男：这套两居室一个月租金多少钱？女：押一付三，一个月三千五，包物业费和取暖费。问：租金一个月多少？",
    "options": [
      {
        "text": "3500 tệ (三千五百块)",
        "pinyin": "Sānqiān wǔbǎi kuài",
        "translation": "3500 tệ (三千五百块)"
      },
      {
        "text": "2000 tệ (两千块)",
        "pinyin": "Liǎngqiān kuài",
        "translation": "2000 tệ (两千块)"
      },
      {
        "text": "4000 tệ (四千块)",
        "pinyin": "Sìqiān kuài",
        "translation": "4000 tệ (四千块)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Giá thuê: 一个月三千五 (3500 tệ/tháng).",
    "points": 8
  },
  {
    "id": "q-hsk4-01-04",
    "exam_id": "hsk4-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 4,
    "question_type": "multiple_choice",
    "prompt": "听对话，回答关于退换货的问题：",
    "pinyin": "Tīng duìhuà, huídá guānyú tuìhuànhuò de wèntí:",
    "translation": "Nghe đối thoại, chọn chính sách đổi trả hàng:",
    "audio_url": "",
    "audio_script": "女：先生，如果衣服不合身，七天之内凭小票可以无理由退换。男：好的，那请帮我开一下发票。问：退换货的要求是什么？",
    "options": [
      {
        "text": "Trong vòng 7 ngày kèm hóa đơn (七天内凭小票)",
        "pinyin": "Qī tiān nèi píng xiǎopiào",
        "translation": "Trong vòng 7 ngày kèm hóa đơn (七天内凭小票)"
      },
      {
        "text": "Trong vòng 1 tháng (一个月内)",
        "pinyin": "Yí gè yuè nèi",
        "translation": "Trong vòng 1 tháng (一个月内)"
      },
      {
        "text": "Không được đổi (不能退换)",
        "pinyin": "Bù néng tuìhuàn",
        "translation": "Không được đổi (不能退换)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Yêu cầu: 七天之内凭小票可以无理由退换.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-05",
    "exam_id": "hsk4-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 5,
    "question_type": "multiple_choice",
    "prompt": "听短文，回答问题：",
    "pinyin": "Tīng duǎnwén, huídá wèntí:",
    "translation": "Nghe đoạn văn ngắn, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "现在越来越多的年轻人选择在网络上购买生活日用品。网购不仅价格相对便宜，而且送货上门，极大地方便了忙碌的上班族。问：年轻人喜欢网购的主要原因是什么？",
    "options": [
      {
        "text": "Giá rẻ và tiện lợi giao tận nhà (便宜且方便)",
        "pinyin": "Piányi qiě fāngbiàn",
        "translation": "Giá rẻ và tiện lợi giao tận nhà (便宜且方便)"
      },
      {
        "text": "Vì không có tiền (因为没钱)",
        "pinyin": "Yīnwèi méi qián",
        "translation": "Vì không có tiền (因为没钱)"
      },
      {
        "text": "Vì không thích đi chơi (不爱出门)",
        "pinyin": "Bú ài chūmén",
        "translation": "Vì không thích đi chơi (不爱出门)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Ưu điểm nêu trong bài: 价格便宜，送货上门，极大地方便了上班族.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-06",
    "exam_id": "hsk4-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 6,
    "question_type": "multiple_choice",
    "prompt": "听短文，回答关于健康的建议：",
    "pinyin": "Tīng duǎnwén, huídá guānyú jiànkāng de jiànyì:",
    "translation": "Nghe đoạn văn, chọn lời khuyên về bảo vệ mắt:",
    "audio_url": "",
    "audio_script": "长时间面对电脑屏幕会导致眼睛干涩。眼科专家建议，每工作四十五分钟，就应该站起来远眺几分钟，多看绿色的植物，放松眼部肌肉。问：专家建议工作45分钟后应该做什么？",
    "options": [
      {
        "text": "Nhìn ra xa và thư giãn mắt (远眺放松眼睛)",
        "pinyin": "Yuǎntiào fàngsōng yǎnjing",
        "translation": "Nhìn ra xa và thư giãn mắt (远眺放松眼睛)"
      },
      {
        "text": "Uống cà phê (喝咖啡)",
        "pinyin": "Hē kāfēi",
        "translation": "Uống cà phê (喝咖啡)"
      },
      {
        "text": "Tiếp tục làm việc (继续工作)",
        "pinyin": "Jìxù gōngzuò",
        "translation": "Tiếp tục làm việc (继续工作)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lời khuyên: 每工作四十五分钟，就应该站起来远眺几分钟.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-07",
    "exam_id": "hsk4-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 7,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại dài, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "男：王主管，下周五的迎新晚会场地定好了吗？女：学校大礼堂已经被艺术团借用了，我们临时改在学生活动中心三楼多功能厅。问：迎新晚会最终改在哪个地点举行？",
    "options": [
      {
        "text": "Hội trường đa năng tầng 3 trung tâm sinh viên (活动中心三楼多功能厅)",
        "pinyin": "Huódòng zhōngxīn sān lóu...",
        "translation": "Hội trường đa năng tầng 3 trung tâm sinh viên (活动中心三楼多功能厅)"
      },
      {
        "text": "Lễ đường trường (大礼堂)",
        "pinyin": "Dà lǐtáng",
        "translation": "Lễ đường trường (大礼堂)"
      },
      {
        "text": "Sân bóng đá (足球场)",
        "pinyin": "Zúqiú chǎng",
        "translation": "Sân bóng đá (足球场)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Địa điểm đổi sang: 学生活动中心三楼多功能厅.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-08",
    "exam_id": "hsk4-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 8,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại dài, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "女：张教授，您对于当下青年人的创业热潮怎么看？男：创业需要热情，但更需要充分的市场调研和风险意识，盲目跟风往往会导致失败。问：张教授认为创业最不可取的心态是什么？",
    "options": [
      {
        "text": "Chạy theo phong trào mù quáng (盲目跟风)",
        "pinyin": "Mángmù gēnfēng",
        "translation": "Chạy theo phong trào mù quáng (盲目跟风)"
      },
      {
        "text": "Thiếu vốn (缺少资金)",
        "pinyin": "Quēshǎo zījīn",
        "translation": "Thiếu vốn (缺少资金)"
      },
      {
        "text": "Không có bằng cấp (没有学历)",
        "pinyin": "Méiyǒu xuélì",
        "translation": "Không có bằng cấp (没有学历)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Giáo sư Trương cảnh báo: 盲目跟风往往会导致失败.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-09",
    "exam_id": "hsk4-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 9,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "男：小周，你最近的销售业绩非常突出，公司决定提前给你转正。女：太感谢您了陈总，我一定再接再厉，不辜负大家的期望！问：小周获得了什么奖励？",
    "options": [
      {
        "text": "Được ký hợp đồng chính thức trước hạn (提前转正)",
        "pinyin": "Tíqián zhuǎnzhèng",
        "translation": "Được ký hợp đồng chính thức trước hạn (提前转正)"
      },
      {
        "text": "Được tặng xe hơi (发汽车)",
        "pinyin": "Fā qìchē",
        "translation": "Được tặng xe hơi (发汽车)"
      },
      {
        "text": "Được đi du lịch châu Âu (去欧洲旅游)",
        "pinyin": "Qù Ōuzhōu lǚyóu",
        "translation": "Được đi du lịch châu Âu (去欧洲旅游)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Quyết định của công ty: 提前给你转正.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-10",
    "exam_id": "hsk4-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 10,
    "question_type": "multiple_choice",
    "prompt": "听短文，回答问题：",
    "pinyin": "Tīng duǎnwén, huídá wèntí:",
    "translation": "Nghe đoạn văn, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "著名作家老舍曾经说过，生活是一本永远读不完的大书。只有深入观察生活中的点点滴滴，才能写出真正打动人心的优秀文学作品。问：文学创作怎样才能打动人心？",
    "options": [
      {
        "text": "Quan sát sâu sắc từng chi tiết cuộc sống (深入观察生活)",
        "pinyin": "Shēnrù guānchá shēnghuó",
        "translation": "Quan sát sâu sắc từng chi tiết cuộc sống (深入观察生活)"
      },
      {
        "text": "Chép sách của người khác (抄袭别人)",
        "pinyin": "Chāoxí biérén",
        "translation": "Chép sách của người khác (抄袭别人)"
      },
      {
        "text": "Chỉ tưởng tượng trong phòng (闭门造车)",
        "pinyin": "Bìmén zàochē",
        "translation": "Chỉ tưởng tượng trong phòng (闭门造车)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Chìa khóa: 深入观察生活中的点点滴滴.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-11",
    "exam_id": "hsk4-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 11,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "女：这台空气净化器的噪音大不大？男：它采用了静音技术，睡眠模式下只有不到三十分贝，完全不会影响休息。问：这台机器的特点是什么？",
    "options": [
      {
        "text": "Vận hành cực êm ái (非常安静/静音)",
        "pinyin": "Fēicháng ānjìng/jìngyīn",
        "translation": "Vận hành cực êm ái (非常安静/静音)"
      },
      {
        "text": "Tiêu tốn điện (费电)",
        "pinyin": "Fèi diàn",
        "translation": "Tiêu tốn điện (费电)"
      },
      {
        "text": "Kích thước to lớn (体积很大)",
        "pinyin": "Tǐjī hěn dà",
        "translation": "Kích thước to lớn (体积很大)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đặc điểm: 采用了静音技术，不会影响休息.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-12",
    "exam_id": "hsk4-mock-01",
    "part_type": "listening",
    "part_number": 2,
    "question_number": 12,
    "question_type": "multiple_choice",
    "prompt": "听长对话，回答问题：",
    "pinyin": "Tīng cháng duìhuà, huídá wèntí:",
    "translation": "Nghe hội thoại, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "男：听说这次国际马拉松比赛有三万人参加？女：是的，不仅有来自各国的专业选手，还有许多业余长跑爱好者。问：关于这项比赛哪项正确？",
    "options": [
      {
        "text": "Hàng vạn người thuộc nhiều lứa tuổi tham gia (规模盛大/选手众多)",
        "pinyin": "Guīmó shèngdà",
        "translation": "Hàng vạn người thuộc nhiều lứa tuổi tham gia (规模盛大/选手众多)"
      },
      {
        "text": "Chỉ có vận động viên chuyên nghiệp (只有专业选手)",
        "pinyin": "Zhǐyǒu zhuānyè xuǎnshǒu",
        "translation": "Chỉ có vận động viên chuyên nghiệp (只有专业选手)"
      },
      {
        "text": "Bị hoãn thi (推迟举行)",
        "pinyin": "Tuīchí jǔxíng",
        "translation": "Bị hoãn thi (推迟举行)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Có 3 vạn người cả chuyên nghiệp lẫn nghiệp dư: 规模盛大/选手众多.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-13",
    "exam_id": "hsk4-mock-01",
    "part_type": "reading",
    "part_number": 1,
    "question_number": 13,
    "question_type": "multiple_choice",
    "prompt": "选词填空：无论遇到多大的困难，我们都不能轻易______放弃。",
    "pinyin": "Xuǎncí tiánkòng: Wúlùn yùdào duō dà de kùnnan, wǒmen dōu bù néng qīngyì ______ fàngqì.",
    "translation": "Điền phó từ liên kết: Bất luận gặp khó khăn lớn đến đâu, chúng ta đều không thể dễ dàng từ bỏ.",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "选择 (Lựa chọn)",
        "pinyin": "Xuǎnzé",
        "translation": "选择 (Lựa chọn)"
      },
      {
        "text": "故意 (Cố ý)",
        "pinyin": "Gùyì",
        "translation": "故意 (Cố ý)"
      },
      {
        "text": "随便 (Tùy tiện)",
        "pinyin": "Suíbiàn",
        "translation": "随便 (Tùy tiện)"
      },
      {
        "text": "后悔 (Hối hận)",
        "pinyin": "Hòuhuǐ",
        "translation": "后悔 (Hối hận)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Ngữ pháp: 选择放弃 (lựa chọn từ bỏ).",
    "points": 8
  },
  {
    "id": "q-hsk4-01-14",
    "exam_id": "hsk4-mock-01",
    "part_type": "reading",
    "part_number": 1,
    "question_number": 14,
    "question_type": "multiple_choice",
    "prompt": "选词填空：人与人之间的沟通，最重要的是互相尊重和______理解。",
    "pinyin": "Xuǎncí tiánkòng: Rén yǔ rén zhījiān de gōutōng, zuì zhòngyào de shì hùxiāng zūnzhòng hé ______ lǐjiě.",
    "translation": "Chọn phó từ biểu thị tính tương hỗ:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "彼此 (Lẫn nhau / Đôi bên)",
        "pinyin": "Bǐcǐ",
        "translation": "彼此 (Lẫn nhau / Đôi bên)"
      },
      {
        "text": "到处 (Khắp nơi)",
        "pinyin": "Dàochù",
        "translation": "到处 (Khắp nơi)"
      },
      {
        "text": "平时 (Bình thường)",
        "pinyin": "Píngshí",
        "translation": "平时 (Bình thường)"
      },
      {
        "text": "暂时 (Tạm thời)",
        "pinyin": "Zànshí",
        "translation": "暂时 (Tạm thời)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cụm cố định: 互相尊重和彼此理解.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-15",
    "exam_id": "hsk4-mock-01",
    "part_type": "reading",
    "part_number": 1,
    "question_number": 15,
    "question_type": "multiple_choice",
    "prompt": "选词填空：尽管这次比赛没有拿到冠军，但我们积累了宝贵的______。",
    "pinyin": "Xuǎncí tiánkòng: Jǐnguǎn zhè cì bǐsài méiyǒu nádào guànjūn, dàn wǒmen jīlěi le bǎoguì de ______.",
    "translation": "Điền danh từ kết hợp với 积累 (tích lũy):",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "经验 (Kinh nghiệm)",
        "pinyin": "Jīngyàn",
        "translation": "经验 (Kinh nghiệm)"
      },
      {
        "text": "价格 (Giá cả)",
        "pinyin": "Jiàgé",
        "translation": "价格 (Giá cả)"
      },
      {
        "text": "气候 (Khí hậu)",
        "pinyin": "Qìhòu",
        "translation": "气候 (Khí hậu)"
      },
      {
        "text": "交通 (Giao thông)",
        "pinyin": "Jiāotōng",
        "translation": "交通 (Giao thông)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cụm danh từ: 积累了宝贵的经验.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-16",
    "exam_id": "hsk4-mock-01",
    "part_type": "reading",
    "part_number": 1,
    "question_number": 16,
    "question_type": "multiple_choice",
    "prompt": "选词填空：这篇学术论文逻辑严密，具有很高的参考______。",
    "pinyin": "Xuǎncí tiánkòng: Zhè piān xuéshù lùnwén luójí yánmì, jùyǒu hěn gāo de cānkǎo ______.",
    "translation": "Chọn danh từ kết hợp với 参考 (tham khảo):",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "价值 (Giá trị)",
        "pinyin": "Jiàzhí",
        "translation": "价值 (Giá trị)"
      },
      {
        "text": "速度 (Tốc độ)",
        "pinyin": "Sùdù",
        "translation": "速度 (Tốc độ)"
      },
      {
        "text": "温度 (Nhiệt độ)",
        "pinyin": "Wēndù",
        "translation": "温度 (Nhiệt độ)"
      },
      {
        "text": "态度 (Thái độ)",
        "pinyin": "Tàidu",
        "translation": "态度 (Thái độ)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cụm danh từ: 参考价值.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-17",
    "exam_id": "hsk4-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 17,
    "question_type": "sentence_order_abc",
    "prompt": "阅读下列三个句子，排列出最连贯合理的顺序（A-B-C）：",
    "pinyin": "Yuèdú xiàliè sān gè jùzi, páiliè chū zuì liánguàn hélǐ de shùnxù:",
    "translation": "Đọc 3 mệnh đề sau và sắp xếp theo trình tự mạch lạc logic:",
    "propositions": {
      "A": "因而赢得了广大消费者的高度信赖。",
      "B": "不仅注重科技创新与功能完善，",
      "C": "这家企业在产品研发过程中，"
    },
    "options": [
      {
        "text": "C - B - A",
        "pinyin": "C - B - A",
        "translation": "Thứ tự chuẩn logic: Chủ ngữ (C) + Hành động tăng tiến (B) + Kết quả (A)"
      },
      {
        "text": "B - A - C",
        "pinyin": "B - A - C",
        "translation": "Sai trật tự chủ ngữ"
      },
      {
        "text": "A - C - B",
        "pinyin": "A - C - B",
        "translation": "Đảo ngược nhân quả"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Câu C nêu chủ ngữ (这家企业...), câu B nêu quá trình nỗ lực (不仅注重...), câu A là kết quả dẫn xuất (因而赢得...). Trình tự logic: C - B - A.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-18",
    "exam_id": "hsk4-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 18,
    "question_type": "sentence_order_abc",
    "prompt": "排列顺序（A-B-C）：",
    "pinyin": "Páiliè shùnxù:",
    "translation": "Sắp xếp 3 câu theo thứ tự mạch lạc:",
    "propositions": {
      "A": "但是如果不坚持经常运动，",
      "B": "跑步是一项简单且成本较低的锻炼方式，",
      "C": "就很难达到理想的健身效果。"
    },
    "options": [
      {
        "text": "B - A - C",
        "pinyin": "B - A - C",
        "translation": "Đúng trật tự: Khái quát (B) -> Chuyển ý giả thiết (A) -> Hậu quả (C)"
      },
      {
        "text": "A - B - C",
        "pinyin": "A - B - C",
        "translation": "Sai vị trí liên từ chuyển tiếp"
      },
      {
        "text": "C - B - A",
        "pinyin": "C - B - A",
        "translation": "Lộn ngược trật tự"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Câu B giới thiệu môn chạy bộ, câu A chuyển tiếp nhượng bộ (但是如果...), câu C nêu kết quả điều kiện (就很难...). Trình tự chuẩn: B - A - C.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-19",
    "exam_id": "hsk4-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 19,
    "question_type": "sentence_order_abc",
    "prompt": "排列顺序（A-B-C）：",
    "pinyin": "Páiliè shùnxù:",
    "translation": "Sắp xếp 3 câu theo thứ tự mạch lạc:",
    "propositions": {
      "A": "甚至影响到了日常的睡眠质量，",
      "B": "他最近工作压力特别大，",
      "C": "整个人显得十分疲倦。"
    },
    "options": [
      {
        "text": "B - A - C",
        "pinyin": "B - A - C",
        "translation": "Trật tự mạch lạc: Nguyên nhân áp lực (B) -> Ảnh hưởng giấc ngủ (A) -> Hệ quả ngoại hình (C)"
      },
      {
        "text": "C - A - B",
        "pinyin": "C - A - B",
        "translation": "Sai logic nhân quả"
      },
      {
        "text": "A - B - C",
        "pinyin": "A - B - C",
        "translation": "Sai vị trí liên từ tăng tiến '甚至'"
      }
    ],
    "correct_option_index": 0,
    "explanation": "B nêu hoàn cảnh nguyên nhân (工作压力大), A tăng tiến tác hại (甚至影响睡眠), C kết luận hiện trạng (整个人显得疲倦). Thứ tự: B - A - C.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-20",
    "exam_id": "hsk4-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 20,
    "question_type": "sentence_order_abc",
    "prompt": "排列顺序（A-B-C）：",
    "pinyin": "Páiliè shùnxù:",
    "translation": "Sắp xếp 3 câu theo thứ tự mạch lạc:",
    "propositions": {
      "A": "从而提高我们面对困难时的抗压能力。",
      "B": "阅读优秀的文学传记作品，",
      "C": "可以让我们从名人的奋斗经历中获得启发，"
    },
    "options": [
      {
        "text": "B - C - A",
        "pinyin": "B - C - A",
        "translation": "Trật tự chuẩn: Hành động đọc (B) -> Thu hoạch cảm hứng (C) -> Nâng cao năng lực (A)"
      },
      {
        "text": "A - B - C",
        "pinyin": "A - B - C",
        "translation": "Đảo ngược mục đích"
      },
      {
        "text": "C - B - A",
        "pinyin": "C - B - A",
        "translation": "Thiếu chủ ngữ mở đầu"
      }
    ],
    "correct_option_index": 0,
    "explanation": "B là chủ ngữ/hành động (阅读传记作品), C là tác dụng trực tiếp (可以获得启发), A là kết quả lâu dài (从而提高能力). Thứ tự: B - C - A.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-21",
    "exam_id": "hsk4-mock-01",
    "part_type": "reading",
    "part_number": 3,
    "question_number": 21,
    "question_type": "multiple_choice",
    "prompt": "阅读短文回答问题：[心理学研究表明，微笑不仅能表达善意，还能反过来改善人们的心情。当你感到沮丧时，强迫自己微笑三十秒，大脑也会分泌让人感到快乐的物质。] 问：这段话主要告诉我们什么？",
    "pinyin": "Yuèdú duǎnwén huídá wèntí:",
    "translation": "Đọc đoạn văn ngắn, chọn ý chính:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "Nụ cười có thể giúp cải thiện tâm trạng (微笑能改善心情)",
        "pinyin": "Wēixiào néng gǎishàn xīnqíng",
        "translation": "Nụ cười có thể giúp cải thiện tâm trạng (微笑能改善心情)"
      },
      {
        "text": "Mỉm cười rất mệt mỏi (微笑很累)",
        "pinyin": "Wēixiào hěn lèi",
        "translation": "Mỉm cười rất mệt mỏi (微笑很累)"
      },
      {
        "text": "Không nên mỉm cười với người lạ (不要对陌生人微笑)",
        "pinyin": "Bú yào duì mòshēngrén wēixiào",
        "translation": "Không nên mỉm cười với người lạ (不要对陌生人微笑)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Trọng tâm: 微笑能反过来改善人们的心情.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-22",
    "exam_id": "hsk4-mock-01",
    "part_type": "reading",
    "part_number": 3,
    "question_number": 22,
    "question_type": "multiple_choice",
    "prompt": "阅读短文回答问题：[环保不仅是政府和企业的责任，更与每个普通人的生活息息相关。少用一个塑料袋，多乘一次公共交通，都是在为保护地球贡献力量。] 问：关于环境保护，作者强调了什么？",
    "pinyin": "Yuèdú duǎnwén huídá wèntí:",
    "translation": "Đọc hiểu: Tác giả nhấn mạnh điều gì về bảo vệ môi trường?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "Mỗi cá nhân đều có thể hành động từ việc nhỏ (每个人从小事做起)",
        "pinyin": "Měi gèrén cóng xiǎoshì zuòqǐ",
        "translation": "Mỗi cá nhân đều có thể hành động từ việc nhỏ (每个人从小事做起)"
      },
      {
        "text": "Chỉ chính phủ mới giải quyết được (只有政府能解决)",
        "pinyin": "Zhǐyǒu zhèngfǔ néng jiějué",
        "translation": "Chỉ chính phủ mới giải quyết được (只有政府能解决)"
      },
      {
        "text": "Bảo vệ môi trường rất tốn kém (环保很费钱)",
        "pinyin": "Huánbǎo hěn fèiqián",
        "translation": "Bảo vệ môi trường rất tốn kém (环保很费钱)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Nhấn mạnh: 与每个普通人息息相关，从小事贡献力量.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-23",
    "exam_id": "hsk4-mock-01",
    "part_type": "reading",
    "part_number": 3,
    "question_number": 23,
    "question_type": "multiple_choice",
    "prompt": "阅读短文回答问题：[现代职场中，终身学习已经成为一种必然趋势。科技的飞速发展使得许多传统岗位被替代，只有不断更新知识结构，才能保持长久的竞争力。] 问：怎样才能在职场保持长久竞争力？",
    "pinyin": "Yuèdú duǎnwén huídá wèntí:",
    "translation": "Đọc hiểu: Làm thế nào để giữ vững năng lực cạnh tranh trong sự nghiệp?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "Không ngừng học tập và cập nhật kiến thức (不断更新知识/终身学习)",
        "pinyin": "Búduàn gēngxīn zhīshi...",
        "translation": "Không ngừng học tập và cập nhật kiến thức (不断更新知识/终身学习)"
      },
      {
        "text": "Chỉ làm một công việc cố định (只做一份工作)",
        "pinyin": "Zhǐ zuò yí fèn gōngzuò",
        "translation": "Chỉ làm một công việc cố định (只做一份工作)"
      },
      {
        "text": "Từ chối dùng công nghệ (不用新技术)",
        "pinyin": "Bù yòng xīn jìshù",
        "translation": "Từ chối dùng công nghệ (不用新技术)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đáp án trong bài: 只有不断更新知识结构，才能保持竞争力.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-24",
    "exam_id": "hsk4-mock-01",
    "part_type": "reading",
    "part_number": 3,
    "question_number": 24,
    "question_type": "multiple_choice",
    "prompt": "阅读短文回答问题：[中国茶文化源远流长。喝茶不仅是一种解渴的生活习惯，更是一种品味人生、静心修性的艺术享受。] 问：关于中国茶文化，下列说法正确的是：",
    "pinyin": "Yuèdú duǎnwén huídá wèntí:",
    "translation": "Đọc hiểu: Nhận định nào đúng về văn hóa trà Trung Hoa?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "Vừa đáp ứng nhu cầu sinh hoạt vừa mang giá trị tinh thần (既解渴又有精神享受)",
        "pinyin": "Jì jiěkě yòu yǒu jīngshén xiǎngshòu",
        "translation": "Vừa đáp ứng nhu cầu sinh hoạt vừa mang giá trị tinh thần (既解渴又有精神享受)"
      },
      {
        "text": "Chỉ có tác dụng chữa bệnh (只能治病)",
        "pinyin": "Zhǐ néng zhìbìng",
        "translation": "Chỉ có tác dụng chữa bệnh (只能治病)"
      },
      {
        "text": "Mới xuất hiện gần đây (刚出现不久)",
        "pinyin": "Gāng chūxiàn bù jiǔ",
        "translation": "Mới xuất hiện gần đây (刚出现不久)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Bài viết: 不仅是解渴习惯，更是一种静心修性的艺术享受.",
    "points": 8
  },
  {
    "id": "q-hsk4-01-25",
    "exam_id": "hsk4-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 25,
    "question_type": "writing_reorder",
    "prompt": "连词成句（把字句复杂结构）：排列词语成句：",
    "pinyin": "Liáncí chéng jù (Bǎ zì jù): Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết HSK 4: Sắp xếp các cụm từ sau thành câu chữ 把 hoàn chỉnh:",
    "words": [
      "请把",
      "寄到",
      "这份文件",
      "北京分公司"
    ],
    "scrambledWords": [
      "这份文件",
      "请把",
      "北京分公司",
      "寄到"
    ],
    "correct_order": [
      "请把",
      "这份文件",
      "寄到",
      "北京分公司"
    ],
    "answerKey": [
      "请把",
      "这份文件",
      "寄到",
      "北京分公司"
    ],
    "correct_sentence": "请把这份文件寄到北京分公司。",
    "options": [
      {
        "text": "请把这份文件寄到北京分公司。",
        "pinyin": "Qǐng bǎ zhè fèn wénjiàn jì dào Běijīng fēn gōngsī.",
        "translation": "Xin hãy gửi tập tài liệu này đến chi nhánh Bắc Kinh."
      },
      {
        "text": "请寄到这份文件把北京分公司。",
        "pinyin": "Qǐng jì dào...",
        "translation": "Sai cấu trúc câu chữ 把"
      },
      {
        "text": "北京分公司请把这份文件寄到。",
        "pinyin": "Běijīng fēn gōngsī...",
        "translation": "Đảo ngữ sai chủ thể"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc câu chữ 把 kết hợp động từ chỉ hướng: 主语 (请) + 把 + 宾语 (这份文件) + 动词 + 到 + 地点 (寄到北京分公司).",
    "points": 10
  },
  {
    "id": "q-hsk4-01-26",
    "exam_id": "hsk4-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 26,
    "question_type": "writing_reorder",
    "prompt": "连词成句（被字句复杂结构）：排列词语成句：",
    "pinyin": "Liáncí chéng jù (Bèi zì jù): Páiliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu bị động chữ 被 có bổ ngữ thời lượng:",
    "words": [
      "这次会议",
      "推迟了",
      "被",
      "一个小时"
    ],
    "scrambledWords": [
      "一个小时",
      "被",
      "这次会议",
      "推迟了"
    ],
    "correct_order": [
      "这次会议",
      "被",
      "推迟了",
      "一个小时"
    ],
    "answerKey": [
      "这次会议",
      "被",
      "推迟了",
      "一个小时"
    ],
    "correct_sentence": "这次会议被推迟了一个小时。",
    "options": [
      {
        "text": "这次会议被推迟了一个小时。",
        "pinyin": "Zhè cì huìyì bèi tuīchí le yí gè xiǎoshí.",
        "translation": "Cuộc họp lần này bị hoãn lại một tiếng đồng hồ."
      },
      {
        "text": "一个小时被这次会议推迟了。",
        "pinyin": "Yí gè xiǎoshí bèi zhè cì huìyì tuīchí le.",
        "translation": "Lộn tân ngữ và chủ ngữ"
      },
      {
        "text": "这次会议推迟了一个小时被。",
        "pinyin": "Zhè cì huìyì tuīchí le...",
        "translation": "Đặt sai chữ 被"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc: 主语 (这次会议) + 被 + 动词 + 时量补语 (推迟了一个小时).",
    "points": 10
  },
  {
    "id": "q-hsk4-01-27",
    "exam_id": "hsk4-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 27,
    "question_type": "writing_reorder",
    "prompt": "连词成句（不仅...而且...递进复句）：排列词语成句：",
    "pinyin": "Liáncí chéng jù (Bùjǐn...érqiě...): Páiliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu phức tăng tiến 不仅...而且...:",
    "words": [
      "他不仅",
      "工作认真",
      "而且",
      "非常乐于助人"
    ],
    "scrambledWords": [
      "非常乐于助人",
      "而且",
      "工作认真",
      "他不仅"
    ],
    "correct_order": [
      "他不仅",
      "工作认真",
      "而且",
      "非常乐于助人"
    ],
    "answerKey": [
      "他不仅",
      "工作认真",
      "而且",
      "非常乐于助人"
    ],
    "correct_sentence": "他不仅工作认真，而且非常乐于助人。",
    "options": [
      {
        "text": "他不仅工作认真，而且非常乐于助人。",
        "pinyin": "Tā bùjǐn gōngzuò rènzhēn, érqiě fēicháng lèyú zhùrén.",
        "translation": "Anh ấy không chỉ làm việc nghiêm túc, mà còn rất thích giúp đỡ người khác."
      },
      {
        "text": "而且他工作认真，不仅非常乐于助人。",
        "pinyin": "Érqiě tā gōngzuò rènzhēn...",
        "translation": "Sai vị trí liên từ"
      },
      {
        "text": "他工作认真不仅，而且非常乐于助人。",
        "pinyin": "Tā gōngzuò rènzhēn bùjǐn...",
        "translation": "Sai trật tự liên từ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cặp liên từ tăng tiến: 主语 + 不仅 + Vế 1, 而且 + Vế 2.",
    "points": 10
  },
  {
    "id": "q-hsk4-01-28",
    "exam_id": "hsk4-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 28,
    "question_type": "writing_reorder",
    "prompt": "连词成句（条件复句无论...都...）：排列词语成句：",
    "pinyin": "Liáncí chéng jù (Wúlùn...dōu...): Páiliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu điều kiện vô điều kiện 无论...都...:",
    "words": [
      "无论天气多么恶劣",
      "他都",
      "准时到达",
      "训练场"
    ],
    "scrambledWords": [
      "训练场",
      "无论天气多么恶劣",
      "准时到达",
      "他都"
    ],
    "correct_order": [
      "无论天气多么恶劣",
      "他都",
      "准时到达",
      "训练场"
    ],
    "answerKey": [
      "无论天气多么恶劣",
      "他都",
      "准时到达",
      "训练场"
    ],
    "correct_sentence": "无论天气多么恶劣，他都准时到达训练场。",
    "options": [
      {
        "text": "无论天气多么恶劣，他都准时到达训练场。",
        "pinyin": "Wúlùn tiānqì duōme èliè, tā dōu zhǔnshí dàodá xùnliànchǎng.",
        "translation": "Bất kể thời tiết khắc nghiệt thế nào, anh ấy đều đến sân tập đúng giờ."
      },
      {
        "text": "他都无论天气多么恶劣，准时到达训练场。",
        "pinyin": "Tā dōu wúlùn tiānqì...",
        "translation": "Đặt sai phó từ 都"
      },
      {
        "text": "准时到达训练场，无论天气多么恶劣他都。",
        "pinyin": "Zhǔnshí dàodá...",
        "translation": "Lộn vế câu"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc: 无论 + 条件, 主语 + 都 + 结果/行为.",
    "points": 10
  },
  {
    "id": "q-hsk4-01-29",
    "exam_id": "hsk4-mock-01",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 29,
    "question_type": "free_writing",
    "prompt": "看图并用所给词语写一个句子：[弹钢琴] (Đàn piano)",
    "pinyin": "Kàn tú bìng yòng suǒ gěi cíyǔ xiě yí gè jùzi: [tán gāngqín]",
    "translation": "Phần Viết tự luận HSK 4: Viết một câu hoàn chỉnh có chứa từ bắt buộc [弹钢琴 - Đánh đàn piano]:",
    "required_words": [
      "弹钢琴"
    ],
    "min_words": 6,
    "max_words": 30,
    "sample_answer": "妹妹每天晚上都在客厅认真地弹钢琴。",
    "writing_criteria": [
      "Bắt buộc chứa từ khóa '弹钢琴'",
      "Câu đúng ngữ pháp tiếng Trung, có chủ ngữ, vị ngữ",
      "Độ dài từ 6 đến 30 chữ Hán"
    ],
    "points": 10,
    "explanation": "Gợi ý câu mẫu: 妹妹每天晚上都在客厅认真地弹钢琴。",
    "is_subjective": true,
    "options": [
      {
        "text": "Đoạn văn mẫu tham khảo: 妹妹每天晚上都在客厅认真地弹钢琴。",
        "pinyin": "",
        "translation": "Câu/đoạn văn mẫu đạt chuẩn ngữ pháp HSK"
      },
      {
        "text": "Bài làm tự luận của thí sinh (Tự đánh giá theo thang điểm)",
        "pinyin": "",
        "translation": "Hệ thống đối sánh tiêu chí Rubric và lưu bài tự luận"
      }
    ],
    "correct_option_index": 0
  },
  {
    "id": "q-hsk4-01-30",
    "exam_id": "hsk4-mock-01",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 30,
    "question_type": "writing_reorder",
    "prompt": "连词成句（程度补语）：排列下列词语成句：",
    "pinyin": "Liáncí chéng jù (Chéngdù bǔyǔ): Páiliè xiàliè cíyǔ chéng jù:",
    "translation": "Phần Viết HSK 4 - Sắp xếp câu bổ ngữ chỉ mức độ: Hãy xếp các cụm từ sau thành câu hoàn chỉnh:",
    "words": [
      "在中国留学两年后",
      "大卫",
      "说得",
      "很流利",
      "汉语"
    ],
    "scrambledWords": [
      "说得",
      "很流利",
      "大卫",
      "在中国留学两年后",
      "汉语"
    ],
    "correct_order": [
      "在中国留学两年后",
      "大卫",
      "汉语",
      "说得",
      "很流利"
    ],
    "answerKey": [
      "在中国留学两年后",
      "大卫",
      "汉语",
      "说得",
      "很流利"
    ],
    "correct_sentence": "在中国留学两年后，大卫汉语说得很流利。",
    "options": [
      {
        "text": "在中国留学两年后，大卫汉语说得很流利。",
        "pinyin": "Zài Zhōngguó liúxué liǎng nián hòu, Dàwèi Hànyǔ shuō de hěn liúlì.",
        "translation": "Sau hai năm du học tại Trung Quốc, David nói tiếng Trung rất lưu loát."
      },
      {
        "text": "大卫在中国留学两年后很流利说得汉语。",
        "pinyin": "Dàwèi zài Zhōngguó liúxué liǎng nián hòu hěn liúlì shuō de Hànyǔ.",
        "translation": "Sai trật tự bổ ngữ mức độ"
      },
      {
        "text": "在汉语说得大卫很流利留学两年后。",
        "pinyin": "Zài Hànyǔ shuō de Dàwèi hěn liúlì liúxué liǎng nián hòu.",
        "translation": "Trật tự câu lộn xộn"
      }
    ],
    "correct_option_index": 0,
    "points": 10,
    "explanation": "Cấu trúc bổ ngữ mức độ: Chủ ngữ + Tân ngữ + Động từ + 得 + Phó từ + Tính từ (大卫汉语说得很流利)."
  },
  {
    "id": "q-hsk5-01-01",
    "exam_id": "hsk5-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 1,
    "question_type": "multiple_choice",
    "prompt": "听长对话，分析商务谈判核心焦点（听力第一部分）：",
    "pinyin": "Tīng cháng duìhuà, fēnxī shāngwù tánpàn...",
    "translation": "Nghe hội thoại dài, phân tích trọng tâm đàm phán thương mại:",
    "audio_url": "",
    "audio_script": "女：关于这次设备的交货期，如果贵方能在下个月底前全部交付，我们可以同意预付40%的货款。男：下个月底时间确实非常紧张，不过为了双方的长远合作，我们工厂可以安排加班赶工，尽最大努力满足贵方的需求。问：男方的最终态度是什么？",
    "options": [
      {
        "text": "Khắc phục khó khăn để hoàn thành giao hàng đúng hạn (加班赶工满足需求)",
        "pinyin": "Jiābān gǎngōng...",
        "translation": "Khắc phục khó khăn để hoàn thành giao hàng đúng hạn (加班赶工满足需求)"
      },
      {
        "text": "Từ chối đàm phán (拒绝谈判)",
        "pinyin": "Jùjué tánpàn",
        "translation": "Từ chối đàm phán (拒绝谈判)"
      },
      {
        "text": "Đòi tăng giá (要求提价)",
        "pinyin": "Yāoqiú tíjià",
        "translation": "Đòi tăng giá (要求提价)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đại diện bên nam thể hiện thiện chí: 工厂可以安排加班赶工，尽最大努力满足需求.",
    "points": 10
  },
  {
    "id": "q-hsk5-01-02",
    "exam_id": "hsk5-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 2,
    "question_type": "multiple_choice",
    "prompt": "听学术讲座片段，选择主旨：",
    "pinyin": "Tīng xuéshù jiǎngzuò piànduàn, xuǎnzé zhǔzhǐ:",
    "translation": "Nghe đoạn thuyết trình học thuật, chọn chủ đề chính:",
    "audio_url": "",
    "audio_script": "在人工智能迅速发展的背景下，跨学科复合型人才的需求呈现爆发式增长。未来的教育不仅要注重专业技能的传授，更要培养学生的批判性思维和终身学习能力。问：讲座强调未来教育的核心是什么？",
    "options": [
      {
        "text": "Bồi dưỡng tư duy phản biện và năng lực học tập suốt đời (培养批判性思维与终身学习能力)",
        "pinyin": "Péiyǎng pīpànxìng sīwéi...",
        "translation": "Bồi dưỡng tư duy phản biện và năng lực học tập suốt đời (培养批判性思维与终身学习能力)"
      },
      {
        "text": "Chỉ dạy lập trình (只学编程)",
        "pinyin": "Zhǐ xué biānchéng",
        "translation": "Chỉ dạy lập trình (只学编程)"
      },
      {
        "text": "Cắt giảm môn xã hội (取消人文课程)",
        "pinyin": "Qūxiāo rénwén kèchéng",
        "translation": "Cắt giảm môn xã hội (取消人文课程)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Trọng tâm bài giảng: 培养批判性思维和终身学习能力.",
    "points": 10
  },
  {
    "id": "q-hsk5-01-03",
    "exam_id": "hsk5-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 3,
    "question_type": "multiple_choice",
    "prompt": "听新闻报道，提取核心事实：",
    "pinyin": "Tīng xīnwén bàodào, tíqǔ héxīn shìshí:",
    "translation": "Nghe bản tin thời sự, trích xuất sự kiện cốt lõi:",
    "audio_url": "",
    "audio_script": "国家统计局今天发布数据显示，今年前三季度高技术制造业投资同比增长12.5%，绿色低碳转型步伐加快，展现了宏观经济强大的韧性与活力。问：这组数据主要反映了什么？",
    "options": [
      {
        "text": "Sự chuyển đổi xanh và sức bật dẻo dai của nền kinh tế (经济韧性与高质量转型)",
        "pinyin": "Jīngjì rènxìng...",
        "translation": "Sự chuyển đổi xanh và sức bật dẻo dai của nền kinh tế (经济韧性与高质量转型)"
      },
      {
        "text": "Kinh tế đình đốn (经济衰退)",
        "pinyin": "Jīngjì shuāituì",
        "translation": "Kinh tế đình đốn (经济衰退)"
      },
      {
        "text": "Đầu tư sụt giảm (投资下降)",
        "pinyin": "Tóuzī xiàjiàng",
        "translation": "Đầu tư sụt giảm (投资下降)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Bản tin phản ánh: 宏观经济强大的韧性与活力，绿色转型步伐加快.",
    "points": 10
  },
  {
    "id": "q-hsk5-01-04",
    "exam_id": "hsk5-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 4,
    "question_type": "multiple_choice",
    "prompt": "听对话，回答关于职场心理的问题：",
    "pinyin": "Tīng duìhuà, huídá guānyú zhíchǎng xīnlǐ de wèntí:",
    "translation": "Nghe đối thoại, phân tích giải pháp tâm lý nơi công sở:",
    "audio_url": "",
    "audio_script": "男：我最近感觉遭遇了职业瓶颈期，无论怎么做都没有成就感。女：这种心态很普遍，不妨把大目标拆解成每天可执行的微习惯，同时多与导师沟通，往往能找到新的突破口。问：女的提出了什么建议？",
    "options": [
      {
        "text": "Chia nhỏ mục tiêu và tham khảo ý kiến người hướng dẫn (拆解目标并与导师沟通)",
        "pinyin": "Chāijiě mùbiāo...",
        "translation": "Chia nhỏ mục tiêu và tham khảo ý kiến người hướng dẫn (拆解目标并与导师沟通)"
      },
      {
        "text": "Nghỉ việc ngay (马上辞职)",
        "pinyin": "Mǎshàng cízhí",
        "translation": "Nghỉ việc ngay (马上辞职)"
      },
      {
        "text": "Lơ là công việc (放弃努力)",
        "pinyin": "Fàngqì nǔlì",
        "translation": "Lơ là công việc (放弃努力)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lời khuyên: 把大目标拆解成可执行的微习惯，多与导师沟通.",
    "points": 10
  },
  {
    "id": "q-hsk5-01-05",
    "exam_id": "hsk5-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 5,
    "question_type": "multiple_choice",
    "prompt": "听文化访谈，回答问题：",
    "pinyin": "Tīng wénhuà fǎngtán, huídá wèntí:",
    "translation": "Nghe phỏng vấn văn hóa, trả lời câu hỏi:",
    "audio_url": "",
    "audio_script": "记者：您创作历史长篇小说的灵感通常来自哪里？作家：大部分来源于浩瀚的民间史料和方志。正史记载的是帝王将相，而民间叙事里才蕴藏着鲜活的人间烟火与生命温度。问：作家最珍视的创作灵感源泉是什么？",
    "options": [
      {
        "text": "Tư liệu lịch sử dân gian và ký ức nhân gian (民间史料与人间烟火)",
        "pinyin": "Mínjiān shǐliào...",
        "translation": "Tư liệu lịch sử dân gian và ký ức nhân gian (民间史料与人间烟火)"
      },
      {
        "text": "Sách giáo khoa (教科书)",
        "pinyin": "Jiàokēshū",
        "translation": "Sách giáo khoa (教科书)"
      },
      {
        "text": "Phim nước ngoài (外国电影)",
        "pinyin": "Wàiguó diànyǐng",
        "translation": "Phim nước ngoài (外国电影)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Nhà văn nhấn mạnh: 民间史料和方志，蕴藏着人间烟火与生命温度.",
    "points": 10
  },
  {
    "id": "q-hsk5-01-06",
    "exam_id": "hsk5-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 6,
    "question_type": "multiple_choice",
    "prompt": "选词填空（语篇填空）：随着城镇化进程的加速，传统古村落的保护面临着严峻的______。如何在现代化开发与文化遗产保留之间找到平衡点，是摆在城市规划者面前的重要课题。",
    "pinyin": "Xuǎncí tiánkòng: Suízhe chéngzhènhuà jìnchéng...",
    "translation": "Điền danh từ kết hợp với 面临严峻的... (Đối mặt với...nghiêm trọng):",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "考验 (Thử thách / Khảo nghiệm)",
        "pinyin": "Kǎoyàn",
        "translation": "考验 (Thử thách / Khảo nghiệm)"
      },
      {
        "text": "待遇 (Đãi ngộ)",
        "pinyin": "Dàiyù",
        "translation": "待遇 (Đãi ngộ)"
      },
      {
        "text": "借口 (Cớ / Viện cớ)",
        "pinyin": "Jièkǒu",
        "translation": "借口 (Cớ / Viện cớ)"
      },
      {
        "text": "比例 (Tỷ lệ)",
        "pinyin": "Bǐlì",
        "translation": "比例 (Tỷ lệ)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cụm danh từ cao cấp HSK 5: 面临严峻的考验 (đối mặt với thử thách cam go).",
    "points": 10
  },
  {
    "id": "q-hsk5-01-07",
    "exam_id": "hsk5-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 7,
    "question_type": "multiple_choice",
    "prompt": "阅读理解：[中国成语‘居安思危’出自《左传》，意思是处在平安稳定的环境中，也要随时提防可能出现的危险与灾害。这种具有前瞻性的忧患意识，深刻影响了中华民族的处世哲学与治理智慧。] 问：‘居安思危’的核心哲学思想是什么？",
    "pinyin": "Yuèdú lǐjiě: Wèn: 'Jū'ānsīwēi' de héxīn zhéxué...",
    "translation": "Đọc hiểu: Tư tưởng cốt lõi của thành ngữ 'Cư an tư nguy' là gì?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "Lúc yên bình cũng phải phòng xa hiểm họa (处在平安中也要提防危险)",
        "pinyin": "Chǔ zài píng'ān...",
        "translation": "Lúc yên bình cũng phải phòng xa hiểm họa (处在平安中也要提防危险)"
      },
      {
        "text": "Chỉ lo lắng khi tai họa ập đến (临渴掘井)",
        "pinyin": "Línkě juéjǐng",
        "translation": "Chỉ lo lắng khi tai họa ập đến (临渴掘井)"
      },
      {
        "text": "Không cần nghĩ đến tương lai (得过且过)",
        "pinyin": "Déguò qiěguò",
        "translation": "Không cần nghĩ đến tương lai (得过且过)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Ý nghĩa thành ngữ: 处在平安环境中也要随时提防可能的危机.",
    "points": 10
  },
  {
    "id": "q-hsk5-01-08",
    "exam_id": "hsk5-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 8,
    "question_type": "multiple_choice",
    "prompt": "选词填空：科研工作是一项艰苦卓绝的探索，绝非一朝一夕之功，需要科学家耐得住寂寞，经过______的积累方能有所突破。",
    "pinyin": "Xuǎncí tiánkòng: Kēyán gōngzuò...",
    "translation": "Chọn thành ngữ 4 chữ thích hợp chỉ quá trình tích lũy lâu dài từng bước:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "循序渐进 (Tuần tự tiệm tiến - Theo thứ tự từng bước một)",
        "pinyin": "Xúnxù jiànjìn",
        "translation": "循序渐进 (Tuần tự tiệm tiến - Theo thứ tự từng bước một)"
      },
      {
        "text": "急功近利 (Hám lợi trước mắt)",
        "pinyin": "Jígōng jìnlì",
        "translation": "急功近利 (Hám lợi trước mắt)"
      },
      {
        "text": "粗枝大叶 (Cẩu thả qua loa)",
        "pinyin": "Cūzhī dàyè",
        "translation": "粗枝大叶 (Cẩu thả qua loa)"
      },
      {
        "text": "半途而废 (Bỏ dở nửa chừng)",
        "pinyin": "Bàntú érfèi",
        "translation": "半途而废 (Bỏ dở nửa chừng)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Thành ngữ '循序渐进' (từng bước vững chắc có thứ tự) là chuẩn xác nhất.",
    "points": 10
  },
  {
    "id": "q-hsk5-01-09",
    "exam_id": "hsk5-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 9,
    "question_type": "multiple_choice",
    "prompt": "阅读理解：[生态系统的生物多样性是地球生命支持系统的基石。一个物种的灭绝往往会引发食物链的多米诺骨牌效应，最终危及整个生物圈的稳定。因此，保护野生动植物栖息地刻不容缓。] 问：作者通过‘多米诺骨牌效应’说明了什么？",
    "pinyin": "Yuèdú lǐjiě: Wèn: Zuòzhě shuōmíng le shénme?",
    "translation": "Đọc hiểu: Tác giả muốn chứng minh điều gì qua hiệu ứng Domino?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "Sự liên đới mật thiết giữa các mắt xích sinh thái (物种灭绝会引发连锁危机)",
        "pinyin": "Wùzhǒng mièjué huì yǐnfā liánsuǒ wēijī",
        "translation": "Sự liên đới mật thiết giữa các mắt xích sinh thái (物种灭绝会引发连锁危机)"
      },
      {
        "text": "Các loài vật không liên quan nhau (物种毫无关系)",
        "pinyin": "Wùzhǒng háo wú guānxì",
        "translation": "Các loài vật không liên quan nhau (物种毫无关系)"
      },
      {
        "text": "Đa dạng sinh học không quan trọng (多样性不重要)",
        "pinyin": "Duōyàngxìng bù zhòngyào",
        "translation": "Đa dạng sinh học không quan trọng (多样性不重要)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Một loài biến mất gây phản ứng dây chuyền làm sụp đổ hệ sinh thái.",
    "points": 10
  },
  {
    "id": "q-hsk5-01-10",
    "exam_id": "hsk5-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 10,
    "question_type": "multiple_choice",
    "prompt": "选词填空：面对复杂多变的国际经济形势，我国企业必须加快核心技术自主创新步伐，避免关键零部件受制于人的______局面。",
    "pinyin": "Xuǎncí tiánkòng: Miànduì fùzá duōbiàn...",
    "translation": "Chọn tính từ chỉ tình thế bế tắc, bị động:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "被动 (Bị động / Yếu thế)",
        "pinyin": "Bèidòng",
        "translation": "被动 (Bị động / Yếu thế)"
      },
      {
        "text": "灵活 (Linh hoạt)",
        "pinyin": "Línghuó",
        "translation": "灵活 (Linh hoạt)"
      },
      {
        "text": "主动 (Chủ động)",
        "pinyin": "Zhǔdòng",
        "translation": "主动 (Chủ động)"
      },
      {
        "text": "乐观 (Lạc quan)",
        "pinyin": "Lèguān",
        "translation": "乐观 (Lạc quan)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cụm từ: 受制于人的被动局面 (cục diện bị động lệ thuộc người khác).",
    "points": 10
  },
  {
    "id": "q-hsk5-01-11",
    "exam_id": "hsk5-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 11,
    "question_type": "writing_reorder",
    "prompt": "连词成句（HSK 5 书写第一部分）：排列词语成句：",
    "pinyin": "Liáncí chéng jù: Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết HSK 5: Sắp xếp các cụm từ sau thành nhận định học thuật hoàn chỉnh:",
    "words": [
      "这项重大科学实验",
      "耗费了团队",
      "三年的心血",
      "整整"
    ],
    "scrambledWords": [
      "整整",
      "这项重大科学实验",
      "三年的心血",
      "耗费了团队"
    ],
    "correct_order": [
      "这项重大科学实验",
      "耗费了团队",
      "整整",
      "三年的心血"
    ],
    "answerKey": [
      "这项重大科学实验",
      "耗费了团队",
      "整整",
      "三年的心血"
    ],
    "correct_sentence": "这项重大科学实验耗费了团队整整三年的心血。",
    "options": [
      {
        "text": "这项重大科学实验耗费了团队整整三年的心血。",
        "pinyin": "Zhè xiàng zhòngdà kēxué shíyàn hàofèi le tuánduì zhěngzhěng sān nián de xīnxuè.",
        "translation": "Thí nghiệm khoa học trọng đại này đã tiêu tốn tròn ba năm tâm huyết của cả đội ngũ."
      },
      {
        "text": "整整三年的心血这项重大科学实验耗费了团队。",
        "pinyin": "Zhěngzhěng sān nián de xīnxuè...",
        "translation": "Lộn tân ngữ lên đầu sai ngữ pháp"
      },
      {
        "text": "这项重大科学实验整整耗费了三年的心血团队。",
        "pinyin": "Zhè xiàng zhòngdà...",
        "translation": "Đặt sai vị trí bổ ngữ gián tiếp"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc: 主语 (这项重大科学实验) + 谓语动词 (耗费了) + 间接宾语 (团队) + 数量定语 (整整三年的) + 核心宾语 (心血).",
    "points": 10
  },
  {
    "id": "q-hsk5-01-12",
    "exam_id": "hsk5-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 12,
    "question_type": "writing_reorder",
    "prompt": "连词成句：排列词语成句：",
    "pinyin": "Liáncí chéng jù: Páiliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu phức liên từ 从而 (từ đó):",
    "words": [
      "合理的运动作息",
      "能够提高免疫力",
      "从而",
      "有效抵御外界病毒"
    ],
    "scrambledWords": [
      "有效抵御外界病毒",
      "合理的运动作息",
      "从而",
      "能够提高免疫力"
    ],
    "correct_order": [
      "合理的运动作息",
      "能够提高免疫力",
      "从而",
      "有效抵御外界病毒"
    ],
    "answerKey": [
      "合理的运动作息",
      "能够提高免疫力",
      "从而",
      "有效抵御外界病毒"
    ],
    "correct_sentence": "合理的运动作息能够提高免疫力，从而有效抵御外界病毒。",
    "options": [
      {
        "text": "合理的运动作息能够提高免疫力，从而有效抵御外界病毒。",
        "pinyin": "Hélǐ de yùndòng zuòxī nénggòu tígāo miǎnyìlì, cóng'ér yǒuxiào dǐyù wàijiè bìngdú.",
        "translation": "Chế độ vận động nghỉ ngơi hợp lý có thể nâng cao hệ miễn dịch, từ đó phòng ngự hữu hiệu virus bên ngoài."
      },
      {
        "text": "从而有效抵御外界病毒合理的运动作息能够提高免疫力。",
        "pinyin": "Cóng'ér...",
        "translation": "Đặt sai liên từ chỉ hệ quả 从而 lên đầu"
      },
      {
        "text": "能够提高免疫力合理的运动作息从而有效抵御外界病毒。",
        "pinyin": "Nénggòu tígāo...",
        "translation": "Lộn vế chủ vị"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc liên từ hệ quả: Vế tiền đề + 从而 + Vế kết quả mục đích.",
    "points": 10
  },
  {
    "id": "q-hsk5-01-13",
    "exam_id": "hsk5-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 13,
    "question_type": "writing_reorder",
    "prompt": "连词成句：排列词语成句：",
    "pinyin": "Liáncí chéng jù: Páiliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu chữ 把 kết hợp động từ cao cấp:",
    "words": [
      "请把",
      "这些调查数据",
      "整理成",
      "一份完整的对比报告"
    ],
    "scrambledWords": [
      "整理成",
      "请把",
      "一份完整的对比报告",
      "这些调查数据"
    ],
    "correct_order": [
      "请把",
      "这些调查数据",
      "整理成",
      "一份完整的对比报告"
    ],
    "answerKey": [
      "请把",
      "这些调查数据",
      "整理成",
      "一份完整的对比报告"
    ],
    "correct_sentence": "请把这些调查数据整理成一份完整的对比报告。",
    "options": [
      {
        "text": "请把这些调查数据整理成一份完整的对比报告。",
        "pinyin": "Qǐng bǎ zhèxiē diàochá shùjù zhěnglǐ chéng yí fèn wánzhěng de duìbǐ bàogào.",
        "translation": "Xin hãy chỉnh lý các số liệu khảo sát này thành một bản báo cáo đối chiếu hoàn chỉnh."
      },
      {
        "text": "一份完整的对比报告请把这些调查数据整理成。",
        "pinyin": "Yí fèn wánzhěng...",
        "translation": "Lộn tân ngữ biến đổi lên đầu"
      },
      {
        "text": "请整理成这些调查数据把一份完整的对比报告。",
        "pinyin": "Qǐng zhěnglǐ chéng...",
        "translation": "Sai vị trí chữ 把"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc chuyển hóa: 把 + Đối tượng gốc (这些调查数据) + Động từ + 成 + Đối tượng sau chuyển hóa (一份完整的对比报告).",
    "points": 10
  },
  {
    "id": "q-hsk5-01-14",
    "exam_id": "hsk5-mock-01",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 14,
    "question_type": "free_writing",
    "prompt": "结合所给成语写一个80字左右的短文：[举一反三] (Cử nhất phản tam - Biết một suy ra ba, suy diễn linh hoạt)",
    "pinyin": "Jiéhé suǒ gěi chéngyǔ xiě yí gè duǎnwén: [jǔyīfǎnsān]",
    "translation": "Phần Viết tự luận HSK 5: Viết đoạn văn ngắn khoảng 80 chữ kết hợp thành ngữ [举一反三]:",
    "required_words": [
      "举一反三"
    ],
    "min_words": 50,
    "max_words": 100,
    "sample_answer": "在学习过程中，死记硬背往往难以取得优异的成绩。我们应当注重掌握知识的核心规律与解题逻辑，学会举一反三，触类旁通。只有善于灵活变通，才能在面对复杂多变的新问题时游刃有余。",
    "writing_criteria": [
      "Bắt buộc chứa thành ngữ '举一反三'",
      "Bàn luận mạch lạc về phương pháp học tập hoặc tư duy",
      "Độ dài khoảng 50 - 100 chữ Hán"
    ],
    "points": 10,
    "explanation": "Gợi ý: Dùng thành ngữ '举一反三' trong bối cảnh học tập thông minh thay vì học vẹt.",
    "is_subjective": true,
    "options": [
      {
        "text": "Đoạn văn mẫu tham khảo: 在学习过程中，死记硬背往往难以取得优异的成绩。我们应当注重掌握知识的核心规律与解题逻辑，学会举一反三，触类旁通。只有善于灵活变通，才能在面对复杂多变的新问题时游刃有余。",
        "pinyin": "",
        "translation": "Câu/đoạn văn mẫu đạt chuẩn ngữ pháp HSK"
      },
      {
        "text": "Bài làm tự luận của thí sinh (Tự đánh giá theo thang điểm)",
        "pinyin": "",
        "translation": "Hệ thống đối sánh tiêu chí Rubric và lưu bài tự luận"
      }
    ],
    "correct_option_index": 0
  },
  {
    "id": "q-hsk5-01-15",
    "exam_id": "hsk5-mock-01",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 15,
    "question_type": "free_writing",
    "prompt": "结合所给词语写一篇80字短文：[坚持]、[挑战]、[收获]",
    "pinyin": "Jiéhé suǒ gěi cíyǔ xiě yí piān duǎnwén: [jiānchí], [tiǎozhàn], [shōuhuò]",
    "translation": "Phần Viết HSK 5: Viết đoạn văn ngắn khoảng 80 chữ kết hợp 3 từ khóa: [坚持 - Kiên trì], [挑战 - Thách thức], [收获 - Thu hoạch]:",
    "required_words": [
      "坚持",
      "挑战",
      "收获"
    ],
    "min_words": 60,
    "max_words": 100,
    "sample_answer": "人生就像一场充满未知的马拉松，沿途必然会遭遇各种各样的困难与挑战。只要我们坚定信念、持之以恒，勇敢地战胜每一次挫折，就一定能在奋斗的终点收获丰硕的果实与内心的成长。",
    "writing_criteria": [
      "Bắt buộc chứa cả 3 từ khóa: 坚持, 挑战, 收获",
      "Câu cú chuẩn mực, văn phong truyền cảm hứng",
      "Độ dài từ 60 đến 100 chữ Hán"
    ],
    "points": 10,
    "explanation": "Đoạn văn kết hợp tự nhiên 3 từ khóa thành triết lý sống nghị lực.",
    "is_subjective": true,
    "options": [
      {
        "text": "Đoạn văn mẫu tham khảo: 人生就像一场充满未知的马拉松，沿途必然会遭遇各种各样的困难与挑战。只要我们坚定信念、持之以恒，勇敢地战胜每一次挫折，就一定能在奋斗的终点收获丰硕的果实与内心的成长。",
        "pinyin": "",
        "translation": "Câu/đoạn văn mẫu đạt chuẩn ngữ pháp HSK"
      },
      {
        "text": "Bài làm tự luận của thí sinh (Tự đánh giá theo thang điểm)",
        "pinyin": "",
        "translation": "Hệ thống đối sánh tiêu chí Rubric và lưu bài tự luận"
      }
    ],
    "correct_option_index": 0
  },
  {
    "id": "q-hsk6-01-01",
    "exam_id": "hsk6-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 1,
    "question_type": "multiple_choice",
    "prompt": "听新闻公报，捕捉宏观政策核心（听力第一部分）：",
    "pinyin": "Tīng xīnwén gōngbào, bǔzhuō hóngguān...",
    "translation": "Nghe công báo thời sự, trích xuất chính sách vĩ mô:",
    "audio_url": "",
    "audio_script": "国务院日前印发《数字中国建设整体布局规划》，明确指出要打通数字基础设施大动脉，畅通数据资源大循环，推动数字技术与实体经济深度融合，以数字化驱动中国式现代化进程。问：规划的核心战略方向是什么？",
    "options": [
      {
        "text": "Thúc đẩy kỹ thuật số kết hợp sâu rộng với kinh tế thực thể (数字技术与实体经济深度融合)",
        "pinyin": "Shùzì jìshù...",
        "translation": "Thúc đẩy kỹ thuật số kết hợp sâu rộng với kinh tế thực thể (数字技术与实体经济深度融合)"
      },
      {
        "text": "Hạn chế chuyển đổi số (限制数字化)",
        "pinyin": "Xiànzhì shùzìhuà",
        "translation": "Hạn chế chuyển đổi số (限制数字化)"
      },
      {
        "text": "Chỉ phát triển nông nghiệp truyền thống (只发展传统农业)",
        "pinyin": "Zhǐ fāzhǎn nóngyè",
        "translation": "Chỉ phát triển nông nghiệp truyền thống (只发展传统农业)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Trọng tâm văn kiện: 推动数字技术与实体经济深度融合，驱动现代化.",
    "points": 10
  },
  {
    "id": "q-hsk6-01-02",
    "exam_id": "hsk6-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 2,
    "question_type": "multiple_choice",
    "prompt": "听社科访谈，理解社会学概念：",
    "pinyin": "Tīng shèkē fǎngtán, lǐjiě shèhuìxué gàiniàn:",
    "translation": "Nghe phỏng vấn xã hội học, nắm bắt khái niệm chuyên môn:",
    "audio_url": "",
    "audio_script": "学者指出，过度城市化过程中出现的‘职住分离’现象，不仅加剧了早晚高峰的潮汐式交通拥堵，更在无形中剥夺了通勤者的闲暇时光，对家庭陪伴和社区公共生活的构建造成了深层次冲击。问：‘职住分离’带来了什么负面影响？",
    "options": [
      {
        "text": "Gia tăng áp lực đi lại và làm suy giảm đời sống gia đình (加剧通勤压力与挤压闲暇时光)",
        "pinyin": "Jiājù tōngqín yālì...",
        "translation": "Gia tăng áp lực đi lại và làm suy giảm đời sống gia đình (加剧通勤压力与挤压闲暇时光)"
      },
      {
        "text": "Giảm giá nhà (降低房价)",
        "pinyin": "Jiàngdī fángjià",
        "translation": "Giảm giá nhà (降低房价)"
      },
      {
        "text": "Tăng thời gian nghỉ ngơi (增加休息时间)",
        "pinyin": "Zēngjiā xiūxi shíjiān",
        "translation": "Tăng thời gian nghỉ ngơi (增加休息时间)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Hệ quả: 加剧交通拥堵，剥夺闲暇时光，对家庭社区造成冲击.",
    "points": 10
  },
  {
    "id": "q-hsk6-01-03",
    "exam_id": "hsk6-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 3,
    "question_type": "multiple_choice",
    "prompt": "听科技前沿动态，回答技术瓶颈问题：",
    "pinyin": "Tīng kējì qiányán dòngtài, huídá...",
    "translation": "Nghe bản tin công nghệ đỉnh cao, phân tích điểm nghẽn kỹ thuật:",
    "audio_url": "",
    "audio_script": "虽然量子计算展现了指数级超越传统超级计算机的潜在算力，但在实际工程落地中，量子比特的退相干效应以及极低温环境的严苛维持，依然是全球物理学界面临的巨大工程壁垒。问：量子计算实际落地面临的主要瓶颈是什么？",
    "options": [
      {
        "text": "Hiện tượng mất liên kết lượng tử và đòi hỏi nhiệt độ cực thấp (退相干效应与维持极低温环境)",
        "pinyin": "Tuìxiānggān xiàoyìng...",
        "translation": "Hiện tượng mất liên kết lượng tử và đòi hỏi nhiệt độ cực thấp (退相干效应与维持极低温环境)"
      },
      {
        "text": "Thiếu tiền (缺少资金)",
        "pinyin": "Quēshǎo zījīn",
        "translation": "Thiếu tiền (缺少资金)"
      },
      {
        "text": "Không có máy tính điện tử (没有电子计算机)",
        "pinyin": "Méiyǒu suànlì",
        "translation": "Không có máy tính điện tử (没有电子计算机)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Điểm nghẽn then chốt: 退相干效应以及极低温环境的维持壁垒.",
    "points": 10
  },
  {
    "id": "q-hsk6-01-04",
    "exam_id": "hsk6-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 4,
    "question_type": "multiple_choice",
    "prompt": "听艺术鉴赏讲座，分析中国美学特征：",
    "pinyin": "Tīng yìshù jiànshǎng jiǎngzuò, fēnxī...",
    "translation": "Nghe giảng về mỹ học hội họa thủy mặc truyền thống:",
    "audio_url": "",
    "audio_script": "中国传统水墨山水画贵在‘计白当黑’与‘意到笔不到’。空白绝非虚无，而是蕴藉着气韵流转与无限时空的哲理留白，给予观赏者以广阔的心理共鸣与审美再创造空间。问：中国画‘留白’的核心美学价值是什么？",
    "options": [
      {
        "text": "Gợi mở không gian triết lý và sự đồng sáng tạo của người thưởng lãm (蕴藉无限时空与审美再创造)",
        "pinyin": "Yùnjiè wúxiàn shíkōng...",
        "translation": "Gợi mở không gian triết lý và sự đồng sáng tạo của người thưởng lãm (蕴藉无限时空与审美再创造)"
      },
      {
        "text": "Tiết kiệm mực vẽ (节约墨水)",
        "pinyin": "Jiéyuē mòshuǐ",
        "translation": "Tiết kiệm mực vẽ (节约墨水)"
      },
      {
        "text": "Họa sĩ chưa vẽ xong (没画完)",
        "pinyin": "Méi huà wán",
        "translation": "Họa sĩ chưa vẽ xong (没画完)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Giá trị mỹ học: 空白绝非虚无，而是蕴藉无限时空与审美再创造空间.",
    "points": 10
  },
  {
    "id": "q-hsk6-01-05",
    "exam_id": "hsk6-mock-01",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 5,
    "question_type": "multiple_choice",
    "prompt": "听生态学演讲，回答保护机制：",
    "pinyin": "Tīng shēngtàixué yǎnjiǎng, huídá...",
    "translation": "Nghe bài giảng sinh thái học, phân tích cơ chế bảo tồn:",
    "audio_url": "",
    "audio_script": "国家公园体制建设之所以被视为生态文明的最高形态，是因为它打破了传统行政区划的碎片化分割，实现了全流域、全生态系统的整体性原真保护，为顶级旗舰物种提供了无障碍繁衍廊道。问：国家公园体制的根本优势在于？",
    "options": [
      {
        "text": "Bảo tồn nguyên vẹn tính toàn thể của hệ sinh thái (实现生态系统整体性原真保护)",
        "pinyin": "Shíxiàn zhěngtǐxìng bǎohù...",
        "translation": "Bảo tồn nguyên vẹn tính toàn thể của hệ sinh thái (实现生态系统整体性原真保护)"
      },
      {
        "text": "Phát triển du lịch ồ ạt (大规模旅游)",
        "pinyin": "Dàguīmó lǚyóu",
        "translation": "Phát triển du lịch ồ ạt (大规模旅游)"
      },
      {
        "text": "Ngăn chặn nghiên cứu khoa học (禁止科学考察)",
        "pinyin": "Jìnzhǐ kēkǎo",
        "translation": "Ngăn chặn nghiên cứu khoa học (禁止科学考察)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Ưu thế căn bản: 打破行政区划碎片化，实现全生态系统的整体性原真保护.",
    "points": 10
  },
  {
    "id": "q-hsk6-01-06",
    "exam_id": "hsk6-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 6,
    "question_type": "multiple_choice",
    "prompt": "【HSK 6 病句辨析】下列各项中，没有语病、表意明确的一项是：",
    "pinyin": "【HSK 6 Bìngjù biànxī】Xiàliè gè xiàng zhōng, méiyǒu yǔbìng...",
    "translation": "Phần Đọc HSK 6: Tìm câu chuẩn xác, KHÔNG mắc lỗi ngữ bệnh (病句):",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "经过专家组深入现场的周密调研，这份关于运河流域生态修复的长远规划终于顺利通过了评审。",
        "pinyin": "Jīngguò zhuānjiāzǔ shēnrù xiànchǎng de zhōumì diàoyán, zhè fèn guīhuà tōngguò le píngshěn.",
        "translation": "经过专家组深入现场的周密调研，这份关于运河流域生态修复的长远规划终于顺利通过了评审。"
      },
      {
        "text": "通过这次防灾减灾宣传周活动，使广大市民的自救互救能力得到了显著的增强。",
        "pinyin": "Tōngguò zhè cì huódòng, shǐ shìmín néng lì... (Lỗi thiếu chủ ngữ do lạm dụng 通过...使...)",
        "translation": "通过这次防灾减灾宣传周活动，使广大市民的自救互救能力得到了显著的增强。"
      },
      {
        "text": "为了防止这类恶性交通事故不再发生，交管部门进一步升级了全路段的智能测速预警系统。",
        "pinyin": "Wèile fángzhǐ bù zài fāshēng... (Lỗi phủ định kép ngược nghĩa: 防止 + 不)",
        "translation": "为了防止这类恶性交通事故不再发生，交管部门进一步升级了全路段的智能测速预警系统。"
      },
      {
        "text": "他的革命先烈事迹不仅感染了在场的每一位听众，也深深地教育了我们大家。",
        "pinyin": "Tā de gémìng xiānliè shìjì... (Lỗi kết hợp từ lủng củng)",
        "translation": "他的革命先烈事迹不仅感染了在场的每一位听众，也深深地教育了我们大家。"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Phương án A hoàn toàn chuẩn xác. B mắc lỗi khuyết chủ ngữ do dùng '通过...使...'; C mắc lỗi phủ định nghịch lý ('防止...不再发生' biến thành mong tai nạn xảy ra); D kết hợp ngữ nghĩa lủng củng.",
    "points": 10
  },
  {
    "id": "q-hsk6-01-07",
    "exam_id": "hsk6-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 7,
    "question_type": "multiple_choice",
    "prompt": "【HSK 6 病句辨析】下列各项中，有语病的一项是：",
    "pinyin": "【HSK 6 Bìngjù biànxī】Xiàliè gè xiàng zhōng, yǒu yǔbìng de yí xiàng shì:",
    "translation": "Tìm câu BỊ LỖI ngữ pháp (病句):",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "能否持之以恒地加强自主核心技术研发，是决定这家制造企业在激烈市场博弈中立于不败之地的关键因素。",
        "pinyin": "Néngfǒu chízhīyǐhéng... shì juédìng... de guānjiàn yīnsù. (Lỗi hai mặt đối chiếu một mặt: 能否 đối với 立于不败之地)",
        "translation": "能否持之以恒地加强自主核心技术研发，是决定这家制造企业在激烈市场博弈中立于不败之地的关键因素。"
      },
      {
        "text": "这部纪录片以生动质朴的镜头语言，客观记录了塞罕坝林场建设者半个世纪的绿色奉献历程。",
        "pinyin": "Zhè bù jìlùpiàn... (Chuẩn)",
        "translation": "这部纪录片以生动质朴的镜头语言，客观记录了塞罕坝林场建设者半个世纪的绿色奉献历程。"
      },
      {
        "text": "人工智能在赋能传统制造业的同时，也对劳动者的数字素养和再培训机制提出了全新的命题。",
        "pinyin": "Réngōng zhìnéng... (Chuẩn)",
        "translation": "人工智能在赋能传统制造业的同时，也对劳动者的数字素养和再培训机制提出了全新的命题。"
      },
      {
        "text": "文化交流的真谛在于增进理解与互信，而不是单向的价值输出或文化优越感的宣示。",
        "pinyin": "Wénhuà jiāoliú... (Chuẩn)",
        "translation": "文化交流的真谛在于增进理解与互信，而不是单向的价值输出或文化优越感的宣示。"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Phương án A mắc lỗi kinh điển HSK 6: '两面对一面' (vế đầu có '能否' gồm 2 mặt được/không được, nhưng vế sau chỉ khẳng định 1 mặt '立于不败之地').",
    "points": 10
  },
  {
    "id": "q-hsk6-01-08",
    "exam_id": "hsk6-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 8,
    "question_type": "multiple_choice",
    "prompt": "成语辨析：在战略决策中，既要______预判宏观风险，又要______从微观细节切入，方能做到______掌控全局。",
    "pinyin": "Chéngyǔ biànxī: Zài zhànlüè juécè zhōng...",
    "translation": "Chọn chuỗi thành ngữ HSK 6 cao cấp thích hợp với văn cảnh bình luận kinh tế vĩ mô:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "居安思危 —— 防微杜渐 —— 运筹帷幄 (Lo xa lúc an bình — Ngăn chặn từ mầm mống — Bày mưu tính kế điều binh)",
        "pinyin": "jū'ānsīwēi — fángwēidùjiàn — yùnchóuwéiwò",
        "translation": "居安思危 —— 防微杜渐 —— 运筹帷幄 (Lo xa lúc an bình — Ngăn chặn từ mầm mống — Bày mưu tính kế điều binh)"
      },
      {
        "text": "自相矛盾 —— 掩耳盗铃 —— 画蛇添足 (Mâu thuẫn — Bịt tai trộm chuông — Vẽ rắn thêm chân)",
        "pinyin": "zìxiāng máodùn — yǎn'ěrdàolíng — huàshétiānzú",
        "translation": "自相矛盾 —— 掩耳盗铃 —— 画蛇添足 (Mâu thuẫn — Bịt tai trộm chuông — Vẽ rắn thêm chân)"
      },
      {
        "text": "朝三暮四 —— 走马观花 —— 井底之蛙 (Sáng ba chiều bốn — Cưỡi ngựa xem hoa — Ếch ngồi đáy giếng)",
        "pinyin": "zhāosānmùsì — zǒumǎguānhuā — jǐngdǐzhīwā",
        "translation": "朝三暮四 —— 走马观花 —— 井底之蛙 (Sáng ba chiều bốn — Cưỡi ngựa xem hoa — Ếch ngồi đáy giếng)"
      },
      {
        "text": "南辕北辙 —— 守株待兔 —— 拔苗助长 (Trống đánh xuôi kèn thổi ngược — Ôm cây đợi thỏ — Đốt cháy giai đoạn)",
        "pinyin": "nányuánběizhé — shǒuzhūdàitù — bámiáozhùzhǎng",
        "translation": "南辕北辙 —— 守株待兔 —— 拔苗助长 (Trống đánh xuôi kèn thổi ngược — Ôm cây đợi thỏ — Đốt cháy giai đoạn)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Trong hoạch định chiến lược kinh tế và phòng ngừa rủi ro, tam tấu thành ngữ HSK 6 [居安思危、防微杜渐、运筹帷幄] là chuẩn mực văn phong cao cấp.",
    "points": 10
  },
  {
    "id": "q-hsk6-01-09",
    "exam_id": "hsk6-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 9,
    "question_type": "multiple_choice",
    "prompt": "阅读理解：[中国古代典籍《易经》有云：‘天地之大德曰生。’生生不息不仅是自然界的演进法则，更是中国人宇宙观的精神原点。它启示人类应当顺应自然之道，以包容化育之德看待万物的存续与发展。] 问：这段古文引言意在阐明什么哲学智慧？",
    "pinyin": "Yuèdú lǐjiě: Wèn: Zhè duàn gǔwén yì zài chǎnmíng shénme zhéxué zhìhuì?",
    "translation": "Đọc hiểu: Đoạn văn mượn câu kinh điển 'Thiên địa chi đại đức viết sinh' để làm sáng tỏ điều gì?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "Tôn trọng quy luật sinh sôi tự nhiên và giữ lòng bao dung với muôn loài (顺应自然、包容万物生息)",
        "pinyin": "Shùnyìng zìrán...",
        "translation": "Tôn trọng quy luật sinh sôi tự nhiên và giữ lòng bao dung với muôn loài (顺应自然、包容万物生息)"
      },
      {
        "text": "Phủ nhận sức mạnh con người (否定人类)",
        "pinyin": "Fǒudìng rénlèi",
        "translation": "Phủ nhận sức mạnh con người (否定人类)"
      },
      {
        "text": "Khuyên con người tàn phá thiên nhiên (征服自然)",
        "pinyin": "Zhēngfú zìrán",
        "translation": "Khuyên con người tàn phá thiên nhiên (征服自然)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Triết lý '生生不息' nhấn mạnh con người thuận theo tự nhiên và bao dung vạn vật.",
    "points": 10
  },
  {
    "id": "q-hsk6-01-10",
    "exam_id": "hsk6-mock-01",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 10,
    "question_type": "multiple_choice",
    "prompt": "【HSK 6 篇章指瑕】阅读段落判断逻辑承接：[科学探索从来不是一帆风顺的坦途，其间充满着试错与曲折。______。只有拥有耐得住寂寞的定力与百折不挠的坚韧，才能穿越科学探索的迷雾，迎来真理的曙光。] 填入横线处最恰当的衔接句是：",
    "pinyin": "【HSK 6 Piānzhāng zhǐxiá】...",
    "translation": "Chọn câu chuyển tiếp liên kết đoạn văn chặt chẽ nhất:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "每一次看似失败的实验，实际上都在为最终的成功排除错误的路径",
        "pinyin": "Měi yí cì kànsì shībài de shíyàn, shíjìshang dōu zài wèi zuìzhōng de chénggōng páichú cuòwù de lùjìng",
        "translation": "每一次看似失败的实验，实际上都在为最终的成功排除错误的路径"
      },
      {
        "text": "所以科学家都不愿意做实验",
        "pinyin": "Suǒyǐ kēxuéjiā dōu bú yuànyì zuò shíyàn",
        "translation": "所以科学家都不愿意做实验"
      },
      {
        "text": "因此只要有钱就一定能出成果",
        "pinyin": "Yīncǐ zhǐyào yǒu qián jiù yídìng néng chū chéngguǒ",
        "translation": "因此只要有钱就一定能出成果"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Vế trước nói về '充满试错与曲折' (đầy rẫy thử sai và trắc trở), câu kết nối giải thích giá trị của việc thất bại để loại bỏ con đường sai là mạch lạc và học thuật nhất.",
    "points": 10
  },
  {
    "id": "q-hsk6-01-11",
    "exam_id": "hsk6-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 11,
    "question_type": "multiple_choice",
    "prompt": "【HSK 6 书写缩写要领】阅读1000字叙事文后进行400字缩写，以下哪项操作符合官方评分准则？",
    "pinyin": "【HSK 6 Shūxiě suōxiě yàolǐng】Yuèdú 1000 zì xùshìwén hòu jìnxíng 400 zì suōxiě...",
    "translation": "【Kỹ năng viết tóm tắt HSK 6】Khi tóm tắt văn bản 1000 chữ thành 400 chữ, thao tác nào dưới đây chuẩn xác theo tiêu chuẩn khảo thí?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "忠实于原文叙事主线与因果脉络，提炼核心事件，不得掺入个人主观评论 (Trung thực với mạch truyện và nhân quả nguyên tác, cô đọng biến cố cốt lõi, tuyệt đối KHÔNG lồng bình luận chủ quan cá nhân)",
        "pinyin": "Zhōngshí yú yuánwén xùshì zhǔxiàn...",
        "translation": "Quy tắc vàng tóm tắt văn bản HSK 6"
      },
      {
        "text": "必须加入大量个人读后感和主观议论抒情 (Cần thêm nhiều cảm nghĩ và bình luận cá nhân)",
        "pinyin": "Bìxū jiārù dàliàng gèrén dúhòugǎn...",
        "translation": "Sai lầm làm trừ điểm nặng"
      },
      {
        "text": "可以任意更改原著主角姓名和故事结局 (Có thể tự đổi kết thúc truyện)",
        "pinyin": "Kěyǐ rènyì gēnggǎi...",
        "translation": "Xuyên tạc cốt truyện"
      },
      {
        "text": "直接抄写原文前两段凑足400字 (Chép nguyên vẹn 2 đoạn đầu)",
        "pinyin": "Zhíjiē chāoxiě yuánwén...",
        "translation": "Gian lận bị điểm liệt"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Tiêu chuẩn chấm thi Viết HSK 6: Đề bài yêu cầu '缩写' (tóm tắt khách quan). Thí sinh phải bảo lưu ngôi kể thứ 3, bám sát các sự kiện mấu chốt, tuyệt đối không được đưa quan điểm, cảm nhận cá nhân.",
    "points": 10
  },
  {
    "id": "q-hsk6-01-12",
    "exam_id": "hsk6-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 12,
    "question_type": "writing_reorder",
    "prompt": "【学术政论句法】排列下列短语组成逻辑严谨的复句：",
    "pinyin": "【Xuéshù zhènglùn jùfǎ】Páiliè xiàliè duǎnyǔ...",
    "translation": "Phần Viết HSK 6: Sắp xếp các cụm từ sau thành nhận định học thuật về bảo tồn di sản:",
    "words": [
      "非物质文化遗产的保护",
      "不仅在于静态典藏",
      "更在于",
      "在现代化转型中",
      "实现创造性转化"
    ],
    "scrambledWords": [
      "在现代化转型中",
      "非物质文化遗产的保护",
      "实现创造性转化",
      "更在于",
      "不仅在于静态典藏"
    ],
    "correct_order": [
      "非物质文化遗产的保护",
      "不仅在于静态典藏",
      "更在于",
      "在现代化转型中",
      "实现创造性转化"
    ],
    "answerKey": [
      "非物质文化遗产的保护",
      "不仅在于静态典藏",
      "更在于",
      "在现代化转型中",
      "实现创造性转化"
    ],
    "correct_sentence": "非物质文化遗产的保护不仅在于静态典藏，更在于在现代化转型中实现创造性转化。",
    "options": [
      {
        "text": "非物质文化遗产的保护不仅在于静态典藏，更在于在现代化转型中实现创造性转化。",
        "pinyin": "Fēiwùzhì wénhuà yíchǎn de bǎohù bùjǐn zàiyú jìngtài diǎncáng, gèng zàiyú zài xiàndàihuà zhuǎnxíng zhōng shíxiàn chuàngzàoxìng zhuǎnhuà.",
        "translation": "Việc bảo tồn di sản văn hóa phi vật thể không chỉ dừng ở việc lưu trữ tĩnh, mà quan trọng hơn là thực hiện chuyển hóa sáng tạo trong quá trình chuyển mình hiện đại hóa."
      },
      {
        "text": "在现代化转型中不仅在于静态典藏非物质文化遗产的保护更在于实现创造性转化。",
        "pinyin": "Zài xiàndàihuà zhuǎnxíng zhōng...",
        "translation": "Trật tự các vế câu lộn xộn"
      },
      {
        "text": "更在于实现创造性转化非物质文化遗产的保护不仅在于静态典藏。",
        "pinyin": "Gèng zàiyú...",
        "translation": "Đảo ngược thứ tự liên từ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc câu tăng tiến: '不仅在于 (Không chỉ ở) ... 更在于 (Càng ở chỗ) ...': 非物质文化遗产的保护不仅在于静态典藏，更在于在现代化转型中实现创造性转化。",
    "points": 10
  },
  {
    "id": "q-hsk6-01-13",
    "exam_id": "hsk6-mock-01",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 13,
    "question_type": "writing_reorder",
    "prompt": "排列下列短语组成逻辑严谨的复句：",
    "pinyin": "Páiliè xiàliè duǎnyǔ...",
    "translation": "Sắp xếp cụm từ thành luận điểm kinh tế học hoàn chỉnh:",
    "words": [
      "只有构建开放型世界经济",
      "促进贸易和投资自由化",
      "才能有效抵御逆全球化思潮",
      "推动全球繁荣"
    ],
    "scrambledWords": [
      "推动全球繁荣",
      "才能有效抵御逆全球化思潮",
      "只有构建开放型世界经济",
      "促进贸易和投资自由化"
    ],
    "correct_order": [
      "只有构建开放型世界经济",
      "促进贸易和投资自由化",
      "才能有效抵御逆全球化思潮",
      "推动全球繁荣"
    ],
    "answerKey": [
      "只有构建开放型世界经济",
      "促进贸易和投资自由化",
      "才能有效抵御逆全球化思潮",
      "推动全球繁荣"
    ],
    "correct_sentence": "只有构建开放型世界经济，促进贸易和投资自由化，才能有效抵御逆全球化思潮，推动全球繁荣。",
    "options": [
      {
        "text": "只有构建开放型世界经济，促进贸易和投资自由化，才能有效抵御逆全球化思潮，推动全球繁荣。",
        "pinyin": "Zhǐyǒu gòujiàn kāifàngxíng shìjiè jīngjì, cùjìn màoyì hé tóuzī zìyóuhuà, cáinéng yǒuxiào dǐyù nìquánqiúhuà sīcháo, tuīdòng quánqiú fánróng.",
        "translation": "Chỉ có xây dựng nền kinh tế thế giới mở, thúc đẩy tự do hóa thương mại và đầu tư, mới có thể chống lại làn sóng chống toàn cầu hóa và thúc đẩy thịnh vượng toàn cầu hữu hiệu."
      },
      {
        "text": "才能有效抵御逆全球化思潮只有构建开放型世界经济促进贸易和投资自由化推动全球繁荣。",
        "pinyin": "Cáinéng yǒuxiào...",
        "translation": "Lộn vế điều kiện và kết quả"
      },
      {
        "text": "推动全球繁荣促进贸易和投资自由化只有构建开放型世界经济才能有效抵御逆全球化思潮。",
        "pinyin": "Tuīdòng...",
        "translation": "Đảo ngữ sai liên từ 只有...才能"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc điều kiện duy nhất: 只有 + Điều kiện hành động, 才能 + Kết quả mục tiêu.",
    "points": 10
  },
  {
    "id": "q-hsk6-01-14",
    "exam_id": "hsk6-mock-01",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 14,
    "question_type": "free_writing",
    "prompt": "【HSK 6 书写拟题训练】阅读寓言缩写材料后，提炼一个生动凝练、契合哲理的文章标题：",
    "pinyin": "【HSK 6 Shūxiě nǐtí xùnliàn】Tíliàn yí gè shēngdòng níngliàn de wénzhāng biāotí:",
    "translation": "Đặt tiêu đề cho bài văn tóm tắt HSK 6: Nêu một tiêu đề ngắn gọn (4-10 chữ Hán) khái quát chủ đề vượt khó vươn lên:",
    "min_words": 4,
    "max_words": 15,
    "sample_answer": "绝处逢生的智慧",
    "writing_criteria": [
      "Độ dài từ 4 đến 15 chữ Hán",
      "Mang tính khái quát triết lý, không đặt tiêu đề quá dài dòng",
      "Phù hợp văn phong nghị luận/tự sự HSK 6"
    ],
    "points": 10,
    "explanation": "Tiêu đề mẫu xuất sắc: '绝处逢生的智慧' (Trí tuệ tìm thấy đường sống nơi tuyệt lộ) hoặc '逆境中的坚守' (Kiên định trong nghịch cảnh).",
    "is_subjective": true,
    "options": [
      {
        "text": "Đoạn văn mẫu tham khảo: 绝处逢生的智慧",
        "pinyin": "",
        "translation": "Câu/đoạn văn mẫu đạt chuẩn ngữ pháp HSK"
      },
      {
        "text": "Bài làm tự luận của thí sinh (Tự đánh giá theo thang điểm)",
        "pinyin": "",
        "translation": "Hệ thống đối sánh tiêu chí Rubric và lưu bài tự luận"
      }
    ],
    "correct_option_index": 0
  },
  {
    "id": "q-hsk6-01-15",
    "exam_id": "hsk6-mock-01",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 15,
    "question_type": "free_writing",
    "prompt": "【HSK 6 核心立意总结】用一句话（30-50字）高度凝练《塞翁失马》的辩证法思想：",
    "pinyin": "【HSK 6 Héxīn lìyì zǒngjié】Yòng yí jù huà gāodù níngliàn 'Sàiwēng shī mǎ' de biànzhèngfǎ sīxiǎng:",
    "translation": "Đúc kết triết lý biện chứng câu chuyện Tái ông thất mã (30-50 chữ Hán):",
    "min_words": 20,
    "max_words": 60,
    "sample_answer": "祸兮福所倚，福兮祸所伏。顺境中不可得意忘形，逆境中更需抱持希望，辩证看待人生的得失起伏。",
    "writing_criteria": [
      "Nêu bật tư tưởng phúc họa tương sinh, biện chứng",
      "Văn phong hàm súc, học thuật",
      "Độ dài khoảng 25 đến 60 chữ Hán"
    ],
    "points": 10,
    "explanation": "Đúc kết mẫu: '祸兮福所倚，福兮祸所伏。顺境中不可得意忘形，逆境中更需抱持希望，辩证看待人生的得失起伏。'",
    "is_subjective": true,
    "options": [
      {
        "text": "Đoạn văn mẫu tham khảo: 祸兮福所倚，福兮祸所伏。顺境中不可得意忘形，逆境中更需抱持希望，辩证看待人生的得失起伏。",
        "pinyin": "",
        "translation": "Câu/đoạn văn mẫu đạt chuẩn ngữ pháp HSK"
      },
      {
        "text": "Bài làm tự luận của thí sinh (Tự đánh giá theo thang điểm)",
        "pinyin": "",
        "translation": "Hệ thống đối sánh tiêu chí Rubric và lưu bài tự luận"
      }
    ],
    "correct_option_index": 0
  },
  {
    "id": "q-hsk1-03-05",
    "exam_id": "hsk1-mock-03",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 5,
    "question_type": "multiple_choice",
    "prompt": "听句子，选出人物关系：",
    "pinyin": "Tīng jùzi, xuǎn chū rénwù guānxì:",
    "translation": "Nghe câu, chọn quan hệ nhân vật:",
    "audio_url": "",
    "audio_script": "这是我的大学同学，他叫大卫。",
    "options": [
      {
        "text": "Bạn học (同学)",
        "pinyin": "Tóngxué",
        "translation": "Bạn học (同学)"
      },
      {
        "text": "Giáo viên (老师)",
        "pinyin": "Lǎoshī",
        "translation": "Giáo viên (老师)"
      },
      {
        "text": "Bác sĩ (医生)",
        "pinyin": "Yīshēng",
        "translation": "Bác sĩ (医生)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Nói rõ '这是我的大学同学'.",
    "points": 10
  },
  {
    "id": "q-hsk1-03-06",
    "exam_id": "hsk1-mock-03",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 6,
    "question_type": "multiple_choice",
    "prompt": "听句子，选择交通工具：",
    "pinyin": "Tīng jùzi, xuǎnzé jiāotōng gōngjù:",
    "translation": "Nghe câu, chọn phương tiện giao thông:",
    "audio_url": "",
    "audio_script": "我爸爸坐出租车去火车站了。",
    "options": [
      {
        "text": "Xe taxi (出租车)",
        "pinyin": "Chūzūchē",
        "translation": "Xe taxi (出租车)"
      },
      {
        "text": "Máy bay (飞机)",
        "pinyin": "Fēijī",
        "translation": "Máy bay (飞机)"
      },
      {
        "text": "Xe đạp (自行车)",
        "pinyin": "Zìxíngchē",
        "translation": "Xe đạp (自行车)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "坐出租车去火车站.",
    "points": 10
  },
  {
    "id": "q-hsk1-03-07",
    "exam_id": "hsk1-mock-03",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 7,
    "question_type": "multiple_choice",
    "prompt": "选词填空：你在看______呢？",
    "pinyin": "Xuǎncí tiánkòng: Nǐ zài kàn ______ ne?",
    "translation": "Điền đại từ nghi vấn: Bạn đang xem ______ thế?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "什么 (Gì)",
        "pinyin": "Shénme",
        "translation": "什么 (Gì)"
      },
      {
        "text": "谁 (Ai)",
        "pinyin": "Shéi",
        "translation": "谁 (Ai)"
      },
      {
        "text": "哪儿 (Ở đâu)",
        "pinyin": "Nǎr",
        "translation": "哪儿 (Ở đâu)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Tân ngữ đồ vật: 看什么.",
    "points": 10
  },
  {
    "id": "q-hsk1-03-08",
    "exam_id": "hsk1-mock-03",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 8,
    "question_type": "multiple_choice",
    "prompt": "选词填空：今天天气很冷，多穿点儿______吧。",
    "pinyin": "Xuǎncí tiánkòng: Jīntiān tiānqì hěn lěng, duō chuān diǎnr ______ ba.",
    "translation": "Điền danh từ trang phục:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "衣服 (Quần áo)",
        "pinyin": "Yīfu",
        "translation": "衣服 (Quần áo)"
      },
      {
        "text": "米饭 (Cơm)",
        "pinyin": "Mǐfàn",
        "translation": "米饭 (Cơm)"
      },
      {
        "text": "水 (Nước)",
        "pinyin": "Shuǐ",
        "translation": "水 (Nước)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Động từ '穿' (mặc) đi với '衣服' (quần áo).",
    "points": 10
  },
  {
    "id": "q-hsk1-03-09",
    "exam_id": "hsk1-mock-03",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 9,
    "question_type": "multiple_choice",
    "prompt": "问答配对：[你想喝茶还是喝水？]",
    "pinyin": "Wèndá pèiduì: [Nǐ xiǎng hē chá háishì hē shuǐ?]",
    "translation": "Chọn câu đáp lại: Bạn muốn uống trà hay nước?",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "给我一杯茶吧，谢谢。 (Cho tôi cốc trà, cảm ơn)",
        "pinyin": "Gěi wǒ yì bēi chá ba...",
        "translation": "给我一杯茶吧，谢谢。 (Cho tôi cốc trà, cảm ơn)"
      },
      {
        "text": "明天去。 (Ngày mai đi)",
        "pinyin": "Míngtiān qù.",
        "translation": "明天去。 (Ngày mai đi)"
      },
      {
        "text": "他是学生。 (Cậu ấy là học sinh)",
        "pinyin": "Tā shì xuésheng.",
        "translation": "他是学生。 (Cậu ấy là học sinh)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Trả lời lựa chọn đồ uống: 给我一杯茶吧.",
    "points": 10
  },
  {
    "id": "q-hsk1-03-10",
    "exam_id": "hsk1-mock-03",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 10,
    "question_type": "multiple_choice",
    "prompt": "看拼音选汉字：xuéxiào (trường học)",
    "pinyin": "Kàn pīnyīn xuǎn hànzì: xuéxiào",
    "translation": "Nhìn pinyin chọn chữ Hán:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "学校",
        "pinyin": "xuéxiào",
        "translation": "学校"
      },
      {
        "text": "学生",
        "pinyin": "xuésheng",
        "translation": "学生"
      },
      {
        "text": "学习",
        "pinyin": "xuéxí",
        "translation": "学习"
      }
    ],
    "correct_option_index": 0,
    "explanation": "xuéxiào là chữ 学校 (trường học).",
    "points": 10
  },
  {
    "id": "q-hsk2-03-05",
    "exam_id": "hsk2-mock-03",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 5,
    "question_type": "multiple_choice",
    "prompt": "听对话，回答地点：",
    "pinyin": "Tīng duìhuà, huídá dìdiǎn:",
    "translation": "Nghe đối thoại, xác định địa điểm:",
    "audio_url": "",
    "audio_script": "女：请问还有空房间吗？男：对不起，今天所有的客房都住满了。问：他们最可能在哪里？",
    "options": [
      {
        "text": "Khách sạn (宾馆/酒店)",
        "pinyin": "Bīnguǎn",
        "translation": "Khách sạn (宾馆/酒店)"
      },
      {
        "text": "Trường học (学校)",
        "pinyin": "Xuéxiào",
        "translation": "Trường học (学校)"
      },
      {
        "text": "Bệnh viện (医院)",
        "pinyin": "Yīyuàn",
        "translation": "Bệnh viện (医院)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Hỏi về phòng trống (空房间) và phòng khách (客房) là ở khách sạn.",
    "points": 10
  },
  {
    "id": "q-hsk2-03-06",
    "exam_id": "hsk2-mock-03",
    "part_type": "listening",
    "part_number": 1,
    "question_number": 6,
    "question_type": "multiple_choice",
    "prompt": "听对话，选择男的想法：",
    "pinyin": "Tīng duìhuà, xuǎnzé nán de xiǎngfǎ:",
    "translation": "Nghe đối thoại, chọn suy nghĩ của người nam:",
    "audio_url": "",
    "audio_script": "女：今天我们去吃烤鸭怎么样？男：好啊，听说附近那家全聚德味道特别地道。问：男的同意去吃烤鸭吗？",
    "options": [
      {
        "text": "Rất đồng ý (非常赞同)",
        "pinyin": "Fēicháng zàntóng",
        "translation": "Rất đồng ý (非常赞同)"
      },
      {
        "text": "Không muốn đi (不想去)",
        "pinyin": "Bù xiǎng qù",
        "translation": "Không muốn đi (不想去)"
      },
      {
        "text": "Không thích ăn thịt (不喜欢吃肉)",
        "pinyin": "Bù xǐhuan chī ròu",
        "translation": "Không thích ăn thịt (不喜欢吃肉)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nam khen và đồng ý: 好啊，味道特别地道.",
    "points": 10
  },
  {
    "id": "q-hsk2-03-07",
    "exam_id": "hsk2-mock-03",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 7,
    "question_type": "multiple_choice",
    "prompt": "选词填空：这件大衣比那件______两百块钱。",
    "pinyin": "Xuǎncí tiánkòng: Zhè jiàn dàyī bǐ nà jiàn ______ liǎngbǎi kuài qián.",
    "translation": "Chọn tính từ câu so sánh giá cả:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "贵 (Đắt)",
        "pinyin": "Guì",
        "translation": "贵 (Đắt)"
      },
      {
        "text": "长 (Dài)",
        "pinyin": "Cháng",
        "translation": "长 (Dài)"
      },
      {
        "text": "快 (Nhanh)",
        "pinyin": "Kuài",
        "translation": "快 (Nhanh)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đắt hơn 200 tệ: 贵两百块钱.",
    "points": 10
  },
  {
    "id": "q-hsk2-03-08",
    "exam_id": "hsk2-mock-03",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 8,
    "question_type": "multiple_choice",
    "prompt": "选词填空：快要迟到了，我们______走吧。",
    "pinyin": "Xuǎncí tiánkòng: Kuàiyào chídào le, wǒmen ______ zǒu ba.",
    "translation": "Chọn phó từ di chuyển:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "快点儿 (Nhanh lên chút)",
        "pinyin": "Kuài diǎnr",
        "translation": "快点儿 (Nhanh lên chút)"
      },
      {
        "text": "慢慢 (Từ từ)",
        "pinyin": "Mànman",
        "translation": "慢慢 (Từ từ)"
      },
      {
        "text": "已经 (Đã)",
        "pinyin": "Yǐjīng",
        "translation": "已经 (Đã)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Sắp muộn rồi thì phải đi nhanh: 快点儿走吧.",
    "points": 10
  },
  {
    "id": "q-hsk2-03-09",
    "exam_id": "hsk2-mock-03",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 9,
    "question_type": "multiple_choice",
    "prompt": "问答配对：[你怎么了？脸色这么苍白。]",
    "pinyin": "Wèndá pèiduì: [Nǐ zěnme le? Liǎnsè zhème cāngbái.]",
    "translation": "Chọn câu đáp lại: 'Bạn sao thế? Mặt mũi nhợt nhạt vậy.'",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "我肚子有点儿疼，想去医务室。 (Tôi đau bụng, muốn đi phòng y tế)",
        "pinyin": "Wǒ dùzi...",
        "translation": "我肚子有点儿疼，想去医务室。 (Tôi đau bụng, muốn đi phòng y tế)"
      },
      {
        "text": "今天天气很好。 (Hôm nay trời đẹp)",
        "pinyin": "Jīntiān tiānqì...",
        "translation": "今天天气很好。 (Hôm nay trời đẹp)"
      },
      {
        "text": "他是新来的。 (Cậu ấy mới tới)",
        "pinyin": "Tā shì xīn lái de.",
        "translation": "他是新来的。 (Cậu ấy mới tới)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đáp lại trạng thái sức khỏe: 我肚子有点儿疼.",
    "points": 10
  },
  {
    "id": "q-hsk2-03-10",
    "exam_id": "hsk2-mock-03",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 10,
    "question_type": "multiple_choice",
    "prompt": "连词成句：[①看完了 ②这本小说 ③我]",
    "pinyin": "Liáncí chéng jù: [①kànwán le ②zhè běn xiǎoshuō ③wǒ]",
    "translation": "Sắp xếp từ thành câu:",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "③①② (我这本小说看完了 / 我看完了这本小说。)",
        "pinyin": "Wǒ kànwán le zhè běn xiǎoshuō.",
        "translation": "③①② (我这本小说看完了 / 我看完了这本小说。)"
      },
      {
        "text": "②①③ (这本小说看完了我。)",
        "pinyin": "Zhè běn xiǎoshuō...",
        "translation": "②①③ (这本小说看完了我。)"
      },
      {
        "text": "①③② (看完了我这本小说。)",
        "pinyin": "Kànwán le wǒ...",
        "translation": "①③② (看完了我这本小说。)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc: 我看完了这本小说。",
    "points": 10
  },
  {
    "id": "q-hsk3-03-07",
    "exam_id": "hsk3-mock-03",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 7,
    "question_type": "writing_reorder",
    "prompt": "连词成句：排列下列词语成句：",
    "pinyin": "Liáncí chéng jù: Páiliè xiàliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu chữ 把:",
    "words": [
      "请把",
      "护照和机票",
      "拿出来"
    ],
    "scrambledWords": [
      "拿出来",
      "护照和机票",
      "请把"
    ],
    "correct_order": [
      "请把",
      "护照和机票",
      "拿出来"
    ],
    "answerKey": [
      "请把",
      "护照和机票",
      "拿出来"
    ],
    "correct_sentence": "请把护照和机票拿出来。",
    "options": [
      {
        "text": "请把护照和机票拿出来。",
        "pinyin": "Qǐng bǎ hùzhào hé jīpiào ná chūlai.",
        "translation": "Xin hãy lấy hộ chiếu và vé máy bay ra."
      },
      {
        "text": "护照和机票请拿出来把。",
        "pinyin": "Hùzhào hé jīpiào...",
        "translation": "Sai vị trí chữ 把"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc: 请 + 把 + Tân ngữ + 拿出来.",
    "points": 34
  },
  {
    "id": "q-hsk3-03-08",
    "exam_id": "hsk3-mock-03",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 8,
    "question_type": "writing_reorder",
    "prompt": "连词成句：排列词语成句：",
    "pinyin": "Liáncí chéng jù: Páiliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu cảm thán:",
    "words": [
      "这里的风景",
      "太美丽了",
      "真让人流连忘返"
    ],
    "scrambledWords": [
      "真让人流连忘返",
      "这里的风景",
      "太美丽了"
    ],
    "correct_order": [
      "这里的风景",
      "太美丽了",
      "真让人流连忘返"
    ],
    "answerKey": [
      "这里的风景",
      "太美丽了",
      "真让人流连忘返"
    ],
    "correct_sentence": "这里的风景太美丽了，真让人流连忘返。",
    "options": [
      {
        "text": "这里的风景太美丽了，真让人流连忘返。",
        "pinyin": "Zhèlǐ de fēngjǐng tài měilì le, zhēn ràng rén liúlián wàngfǎn.",
        "translation": "Phong cảnh nơi đây đẹp quá, thật khiến lòng người lưu luyến."
      },
      {
        "text": "真让人流连忘返这里的风景太美丽了。",
        "pinyin": "Zhēn ràng rén...",
        "translation": "Đảo ngữ sai"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Chủ ngữ (这里的风景) + Tính từ (太美丽了) + Hệ quả cảm xúc.",
    "points": 33
  },
  {
    "id": "q-hsk3-03-09",
    "exam_id": "hsk3-mock-03",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 9,
    "question_type": "fill_blank",
    "prompt": "根据拼音写汉字：他每天都去操场跑[bù]______。",
    "pinyin": "Gēnjù pīnyīn xiě hànzì: Tā měitiān dōu qù cāochǎng pǎo[bù]______.",
    "translation": "Điền chữ Hán tương ứng phiên âm [bù] trong 'chạy bộ' (跑步):",
    "accepted_answers": [
      "步"
    ],
    "sample_answer": "步",
    "options": [
      {
        "text": "步 (bù)",
        "pinyin": "bù",
        "translation": "Chữ Hán chính xác trong 跑步"
      },
      {
        "text": "不 (bù)",
        "pinyin": "bù",
        "translation": "Sai nghĩa từ vựng"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Từ ghép 跑步 (chạy bộ), chữ cần điền là 步 (bộ).",
    "points": 33
  },
  {
    "id": "q-hsk4-03-07",
    "exam_id": "hsk4-mock-03",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 7,
    "question_type": "writing_reorder",
    "prompt": "连词成句：排列下列词语成句：",
    "pinyin": "Liáncí chéng jù: Páiliè xiàliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu chữ 被:",
    "words": [
      "那篇优秀的科幻小说",
      "翻译成了",
      "被",
      "多种外语"
    ],
    "scrambledWords": [
      "多种外语",
      "被",
      "那篇优秀的科幻小说",
      "翻译成了"
    ],
    "correct_order": [
      "那篇优秀的科幻小说",
      "被",
      "翻译成了",
      "多种外语"
    ],
    "answerKey": [
      "那篇优秀的科幻小说",
      "被",
      "翻译成了",
      "多种外语"
    ],
    "correct_sentence": "那篇优秀的科幻小说被翻译成了多种外语。",
    "options": [
      {
        "text": "那篇优秀的科幻小说被翻译成了多种外语。",
        "pinyin": "Nà piān yōuxiù de kēhuàn xiǎoshuō bèi fānyì chéng le duō zhǒng wàiyǔ.",
        "translation": "Cuốn tiểu thuyết khoa học viễn tưởng xuất sắc đó đã được dịch ra nhiều thứ tiếng nước ngoài."
      },
      {
        "text": "多种外语被那篇优秀的科幻小说翻译成了。",
        "pinyin": "Duō zhǒng wàiyǔ...",
        "translation": "Lộn tân ngữ và chủ ngữ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc: 主语 + 被 + 翻译成了 + 目标语言.",
    "points": 34
  },
  {
    "id": "q-hsk4-03-08",
    "exam_id": "hsk4-mock-03",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 8,
    "question_type": "writing_reorder",
    "prompt": "连词成句：排列词语成句：",
    "pinyin": "Liáncí chéng jù: Páiliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu phức liên từ 无论...都...:",
    "words": [
      "无论遇到任何挑战",
      "我们都要",
      "充满信心"
    ],
    "scrambledWords": [
      "充满信心",
      "无论遇到任何挑战",
      "我们都要"
    ],
    "correct_order": [
      "无论遇到任何挑战",
      "我们都要",
      "充满信心"
    ],
    "answerKey": [
      "无论遇到任何挑战",
      "我们都要",
      "充满信心"
    ],
    "correct_sentence": "无论遇到任何挑战，我们都要充满信心。",
    "options": [
      {
        "text": "无论遇到任何挑战，我们都要充满信心。",
        "pinyin": "Wúlùn yùdào rènhé tiǎozhàn, wǒmen dōu yào chōngmǎn xìnxīn.",
        "translation": "Dù gặp bất kỳ thách thức nào, chúng ta đều phải tràn đầy tự tin."
      },
      {
        "text": "我们都要充满信心无论遇到任何挑战。",
        "pinyin": "Wǒmen dōu yào...",
        "translation": "Đảo ngữ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "无论 + 条件, 主语 + 都要 + 态度.",
    "points": 33
  },
  {
    "id": "q-hsk4-03-09",
    "exam_id": "hsk4-mock-03",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 9,
    "question_type": "free_writing",
    "prompt": "看图并用所给词语写一个句子：[节约] (Tiết kiệm)",
    "pinyin": "Kàn tú bìng yòng suǒ gěi cíyǔ xiě yí gè jùzi: [jiéyuē]",
    "translation": "Viết câu hoàn chỉnh có từ [节约 - Tiết kiệm]:",
    "required_words": [
      "节约"
    ],
    "min_words": 6,
    "max_words": 30,
    "sample_answer": "在日常生活中，我们每个人都应当养成节约用水的好习惯。",
    "writing_criteria": [
      "Bắt buộc chứa từ '节约'",
      "Độ dài từ 6 đến 30 chữ Hán"
    ],
    "points": 33,
    "explanation": "Gợi ý: 我们应当养成节约用水的好习惯。",
    "is_subjective": true,
    "options": [
      {
        "text": "Đoạn văn mẫu tham khảo: 在日常生活中，我们每个人都应当养成节约用水的好习惯。",
        "pinyin": "",
        "translation": "Câu/đoạn văn mẫu đạt chuẩn ngữ pháp HSK"
      },
      {
        "text": "Bài làm tự luận của thí sinh (Tự đánh giá theo thang điểm)",
        "pinyin": "",
        "translation": "Hệ thống đối sánh tiêu chí Rubric và lưu bài tự luận"
      }
    ],
    "correct_option_index": 0
  },
  {
    "id": "q-hsk5-mock-02-07",
    "exam_id": "hsk5-mock-02",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 7,
    "question_type": "writing_reorder",
    "prompt": "连词成句：排列下列词语成句：",
    "pinyin": "Liáncí chéng jù: Páiliè xiàliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu chữ 把 trong văn phong thương mại:",
    "words": [
      "请把合同草案",
      "发给法务部门",
      "尽快",
      "审核"
    ],
    "scrambledWords": [
      "尽快",
      "发给法务部门",
      "请把合同草案",
      "审核"
    ],
    "correct_order": [
      "请把合同草案",
      "尽快",
      "发给法务部门",
      "审核"
    ],
    "answerKey": [
      "请把合同草案",
      "尽快",
      "发给法务部门",
      "审核"
    ],
    "correct_sentence": "请把合同草案尽快发给法务部门审核。",
    "options": [
      {
        "text": "请把合同草案尽快发给法务部门审核。",
        "pinyin": "Qǐng bǎ hétong cǎo'àn jìnkuài fā gěi fǎwù bùmén shěnhè.",
        "translation": "Xin hãy nhanh chóng gửi bản thảo hợp đồng cho phòng pháp chế xét duyệt."
      },
      {
        "text": "发给法务部门审核请把合同草案尽快。",
        "pinyin": "Fā gěi...",
        "translation": "Lộn vế câu"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc: 请把 + 宾语 + 状语 (尽快) + 动词 (发给) + 目的 (审核).",
    "points": 34
  },
  {
    "id": "q-hsk5-mock-02-08",
    "exam_id": "hsk5-mock-02",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 8,
    "question_type": "writing_reorder",
    "prompt": "连词成句：排列词语成句：",
    "pinyin": "Liáncí chéng jù: Páiliè cíyǔ chéng jù:",
    "translation": "Sắp xếp nhận định triết lý văn hóa:",
    "words": [
      "优秀传统文化的传承",
      "必须与现代文明相融合",
      "才能焕发生机"
    ],
    "scrambledWords": [
      "才能焕发生机",
      "优秀传统文化的传承",
      "必须与现代文明相融合"
    ],
    "correct_order": [
      "优秀传统文化的传承",
      "必须与现代文明相融合",
      "才能焕发生机"
    ],
    "answerKey": [
      "优秀传统文化的传承",
      "必须与现代文明相融合",
      "才能焕发生机"
    ],
    "correct_sentence": "优秀传统文化的传承必须与现代文明相融合才能焕发生机。",
    "options": [
      {
        "text": "优秀传统文化的传承必须与现代文明相融合才能焕发生机。",
        "pinyin": "Yōuxiù chuántǒng wénhuà de chuánchéng bìxū yǔ xiàndài wénmíng xiāng rónghé cáinéng huànfā shēngjī.",
        "translation": "Sự kế thừa văn hóa truyền thống ưu tú phải dung hợp với văn minh hiện đại mới có thể bừng lên sức sống."
      },
      {
        "text": "才能焕发生机优秀传统文化的传承必须与现代文明相融合。",
        "pinyin": "Cáinéng huànfā...",
        "translation": "Sai trật tự liên từ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Chủ ngữ (文化传承) + 必须... + 才能...",
    "points": 33
  },
  {
    "id": "q-hsk5-mock-02-09",
    "exam_id": "hsk5-mock-02",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 9,
    "question_type": "free_writing",
    "prompt": "结合成语写80字短文：[脚踏实地] (Chân đạp thực địa - Làm việc thiết thực, chắc chắn)",
    "pinyin": "Jiéhé chéngyǔ xiě duǎnwén: [jiǎotàshídì]",
    "translation": "Viết đoạn văn ngắn khoảng 80 chữ kết hợp thành ngữ [脚踏实地]:",
    "required_words": [
      "脚踏实地"
    ],
    "min_words": 50,
    "max_words": 100,
    "sample_answer": "任何远大的理想如果脱离了实干，都不过是空中楼阁。只有脚踏实地做好当下的每一件小事，持之以恒地积累经验，我们才能在通往成功的道路上走得更加稳健从容。",
    "writing_criteria": [
      "Bắt buộc chứa '脚踏实地'",
      "Độ dài từ 50 đến 100 chữ Hán"
    ],
    "points": 33,
    "explanation": "Gợi ý: 只有脚踏实地做好当下的每一件小事，才能走得更稳健。",
    "is_subjective": true,
    "options": [
      {
        "text": "Đoạn văn mẫu tham khảo: 任何远大的理想如果脱离了实干，都不过是空中楼阁。只有脚踏实地做好当下的每一件小事，持之以恒地积累经验，我们才能在通往成功的道路上走得更加稳健从容。",
        "pinyin": "",
        "translation": "Câu/đoạn văn mẫu đạt chuẩn ngữ pháp HSK"
      },
      {
        "text": "Bài làm tự luận của thí sinh (Tự đánh giá theo thang điểm)",
        "pinyin": "",
        "translation": "Hệ thống đối sánh tiêu chí Rubric và lưu bài tự luận"
      }
    ],
    "correct_option_index": 0
  },
  {
    "id": "q-hsk5-mock-03-07",
    "exam_id": "hsk5-mock-03",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 7,
    "question_type": "writing_reorder",
    "prompt": "连词成句：排列下列词语成句：",
    "pinyin": "Liáncí chéng jù: Páiliè xiàliè cíyǔ chéng jù:",
    "translation": "Sắp xếp câu chữ 把 trong văn phong thương mại:",
    "words": [
      "请把合同草案",
      "发给法务部门",
      "尽快",
      "审核"
    ],
    "scrambledWords": [
      "尽快",
      "发给法务部门",
      "请把合同草案",
      "审核"
    ],
    "correct_order": [
      "请把合同草案",
      "尽快",
      "发给法务部门",
      "审核"
    ],
    "answerKey": [
      "请把合同草案",
      "尽快",
      "发给法务部门",
      "审核"
    ],
    "correct_sentence": "请把合同草案尽快发给法务部门审核。",
    "options": [
      {
        "text": "请把合同草案尽快发给法务部门审核。",
        "pinyin": "Qǐng bǎ hétong cǎo'àn jìnkuài fā gěi fǎwù bùmén shěnhè.",
        "translation": "Xin hãy nhanh chóng gửi bản thảo hợp đồng cho phòng pháp chế xét duyệt."
      },
      {
        "text": "发给法务部门审核请把合同草案尽快。",
        "pinyin": "Fā gěi...",
        "translation": "Lộn vế câu"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc: 请把 + 宾语 + 状语 (尽快) + 动词 (发给) + 目的 (审核).",
    "points": 34
  },
  {
    "id": "q-hsk5-mock-03-08",
    "exam_id": "hsk5-mock-03",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 8,
    "question_type": "writing_reorder",
    "prompt": "连词成句：排列词语成句：",
    "pinyin": "Liáncí chéng jù: Páiliè cíyǔ chéng jù:",
    "translation": "Sắp xếp nhận định triết lý văn hóa:",
    "words": [
      "优秀传统文化的传承",
      "必须与现代文明相融合",
      "才能焕发生机"
    ],
    "scrambledWords": [
      "才能焕发生机",
      "优秀传统文化的传承",
      "必须与现代文明相融合"
    ],
    "correct_order": [
      "优秀传统文化的传承",
      "必须与现代文明相融合",
      "才能焕发生机"
    ],
    "answerKey": [
      "优秀传统文化的传承",
      "必须与现代文明相融合",
      "才能焕发生机"
    ],
    "correct_sentence": "优秀传统文化的传承必须与现代文明相融合才能焕发生机。",
    "options": [
      {
        "text": "优秀传统文化的传承必须与现代文明相融合才能焕发生机。",
        "pinyin": "Yōuxiù chuántǒng wénhuà de chuánchéng bìxū yǔ xiàndài wénmíng xiāng rónghé cáinéng huànfā shēngjī.",
        "translation": "Sự kế thừa văn hóa truyền thống ưu tú phải dung hợp với văn minh hiện đại mới có thể bừng lên sức sống."
      },
      {
        "text": "才能焕发生机优秀传统文化的传承必须与现代文明相融合。",
        "pinyin": "Cáinéng huànfā...",
        "translation": "Sai trật tự liên từ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Chủ ngữ (文化传承) + 必须... + 才能...",
    "points": 33
  },
  {
    "id": "q-hsk5-mock-03-09",
    "exam_id": "hsk5-mock-03",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 9,
    "question_type": "free_writing",
    "prompt": "结合成语写80字短文：[脚踏实地] (Chân đạp thực địa - Làm việc thiết thực, chắc chắn)",
    "pinyin": "Jiéhé chéngyǔ xiě duǎnwén: [jiǎotàshídì]",
    "translation": "Viết đoạn văn ngắn khoảng 80 chữ kết hợp thành ngữ [脚踏实地]:",
    "required_words": [
      "脚踏实地"
    ],
    "min_words": 50,
    "max_words": 100,
    "sample_answer": "任何远大的理想如果脱离了实干，都不过是空中楼阁。只有脚踏实地做好当下的每一件小事，持之以恒地积累经验，我们才能在通往成功的道路上走得更加稳健从容。",
    "writing_criteria": [
      "Bắt buộc chứa '脚踏实地'",
      "Độ dài từ 50 đến 100 chữ Hán"
    ],
    "points": 33,
    "explanation": "Gợi ý: 只有脚踏实地做好当下的每一件小事，才能走得更稳健。",
    "is_subjective": true,
    "options": [
      {
        "text": "Đoạn văn mẫu tham khảo: 任何远大的理想如果脱离了实干，都不过是空中楼阁。只有脚踏实地做好当下的每一件小事，持之以恒地积累经验，我们才能在通往成功的道路上走得更加稳健从容。",
        "pinyin": "",
        "translation": "Câu/đoạn văn mẫu đạt chuẩn ngữ pháp HSK"
      },
      {
        "text": "Bài làm tự luận của thí sinh (Tự đánh giá theo thang điểm)",
        "pinyin": "",
        "translation": "Hệ thống đối sánh tiêu chí Rubric và lưu bài tự luận"
      }
    ],
    "correct_option_index": 0
  },
  {
    "id": "q-hsk6-mock-02-07",
    "exam_id": "hsk6-mock-02",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 7,
    "question_type": "multiple_choice",
    "prompt": "【HSK 6 病句辨析】下列句子中没有语病的一项是：",
    "pinyin": "【HSK 6 Bìngjù biànxī】Xiàliè jùzi zhōng méiyǒu yǔbìng de yí xiàng shì:",
    "translation": "Tìm câu chuẩn xác KHÔNG mắc lỗi ngữ bệnh (病句):",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "在深化经济体制改革的过程中，我们必须破除一切阻碍高质量发展的体制机制弊端。",
        "pinyin": "Zài shēnhuà jīngjì tǐzhì gǎigé de guòchéng zhōng..."
      },
      {
        "text": "由于缺乏科学合理的规划，使这座历史文化古城的原有风貌遭到了难以逆转的破坏。",
        "pinyin": "Yóuyú... shǐ... (Lỗi khuyết chủ ngữ do dùng 由于...使...)"
      },
      {
        "text": "能否切实减轻中小学生的课业负担，关键在于各级教育部门彻底转变唯升学率论的观念。",
        "pinyin": "Néngfǒu... guānjiàn zàiyú... (Lỗi hai mặt đối chiếu một mặt)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "A hoàn toàn chuẩn xác. B mắc lỗi khuyết chủ ngữ; C mắc lỗi '两面对一面'.",
    "points": 34
  },
  {
    "id": "q-hsk6-mock-02-08",
    "exam_id": "hsk6-mock-02",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 8,
    "question_type": "writing_reorder",
    "prompt": "排列下列短语组成逻辑严谨的学术论断：",
    "pinyin": "Páiliè xiàliè duǎnyǔ...",
    "translation": "Sắp xếp cụm từ thành luận điểm khoa học:",
    "words": [
      "生态环境保护和经济发展",
      "绝非相互对立的矛盾体",
      "而是内在统一的有机整体"
    ],
    "scrambledWords": [
      "而是内在统一的有机整体",
      "生态环境保护和经济发展",
      "绝非相互对立的矛盾体"
    ],
    "correct_order": [
      "生态环境保护和经济发展",
      "绝非相互对立的矛盾体",
      "而是内在统一的有机整体"
    ],
    "answerKey": [
      "生态环境保护和经济发展",
      "绝非相互对立的矛盾体",
      "而是内在统一的有机整体"
    ],
    "correct_sentence": "生态环境保护和经济发展绝非相互对立的矛盾体，而是内在统一的有机整体。",
    "options": [
      {
        "text": "生态环境保护和经济发展绝非相互对立的矛盾体，而是内在统一的有机整体。",
        "pinyin": "Shēngtài huánjìng bǎohù hé jīngjì fāzhǎn juéfēi xiānghù duìlì de máodùntǐ, ér shì nèizài tǒngyī de yǒujī zhěngtǐ.",
        "translation": "Bảo vệ môi trường sinh thái và phát triển kinh tế tuyệt nhiên không phải hai thực thể mâu thuẫn đối lập nhau, mà là một chỉnh thể hữu cơ thống nhất nội tại."
      },
      {
        "text": "而是内在统一的有机整体绝非相互对立的矛盾体生态环境保护和经济发展。",
        "pinyin": "Ér shì...",
        "translation": "Lộn vế câu"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc phản đề: 主语 + 绝非 A, 而是 B.",
    "points": 33
  },
  {
    "id": "q-hsk6-mock-02-09",
    "exam_id": "hsk6-mock-02",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 9,
    "question_type": "free_writing",
    "prompt": "【HSK 6 缩写概括训练】用一句学术政论文风格的句子（40-60字）概括绿色发展的核心内涵：",
    "pinyin": "【HSK 6 Suōxiě gàikuò xùnliàn】Gàikuò lǜsè fāzhǎn de héxīn nèihán:",
    "translation": "Đúc kết nội hàm phát triển xanh theo văn phong học thuật chính luận (40-60 chữ Hán):",
    "min_words": 30,
    "max_words": 70,
    "sample_answer": "绿色发展的本质在于摒弃以牺牲资源环境为代价的粗放型增长模式，推动人与自然和谐共生的可持续发展道路。",
    "writing_criteria": [
      "Văn phong học thuật chính luận chuẩn mực HSK 6",
      "Độ dài từ 30 đến 70 chữ Hán"
    ],
    "points": 33,
    "explanation": "Gợi ý: 绿色发展的本质在于摒弃粗放型增长，走人与自然和谐共生的可持续发展道路。",
    "is_subjective": true,
    "options": [
      {
        "text": "Đoạn văn mẫu tham khảo: 绿色发展的本质在于摒弃以牺牲资源环境为代价的粗放型增长模式，推动人与自然和谐共生的可持续发展道路。",
        "pinyin": "",
        "translation": "Câu/đoạn văn mẫu đạt chuẩn ngữ pháp HSK"
      },
      {
        "text": "Bài làm tự luận của thí sinh (Tự đánh giá theo thang điểm)",
        "pinyin": "",
        "translation": "Hệ thống đối sánh tiêu chí Rubric và lưu bài tự luận"
      }
    ],
    "correct_option_index": 0
  },
  {
    "id": "q-hsk6-mock-03-07",
    "exam_id": "hsk6-mock-03",
    "part_type": "reading",
    "part_number": 2,
    "question_number": 7,
    "question_type": "multiple_choice",
    "prompt": "【HSK 6 病句辨析】下列句子中没有语病的一项是：",
    "pinyin": "【HSK 6 Bìngjù biànxī】Xiàliè jùzi zhōng méiyǒu yǔbìng de yí xiàng shì:",
    "translation": "Tìm câu chuẩn xác KHÔNG mắc lỗi ngữ bệnh (病句):",
    "audio_url": "",
    "audio_script": "",
    "options": [
      {
        "text": "在深化经济体制改革的过程中，我们必须破除一切阻碍高质量发展的体制机制弊端。",
        "pinyin": "Zài shēnhuà jīngjì tǐzhì gǎigé de guòchéng zhōng..."
      },
      {
        "text": "由于缺乏科学合理的规划，使这座历史文化古城的原有风貌遭到了难以逆转的破坏。",
        "pinyin": "Yóuyú... shǐ... (Lỗi khuyết chủ ngữ do dùng 由于...使...)"
      },
      {
        "text": "能否切实减轻中小学生的课业负担，关键在于各级教育部门彻底转变唯升学率论的观念。",
        "pinyin": "Néngfǒu... guānjiàn zàiyú... (Lỗi hai mặt đối chiếu một mặt)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "A hoàn toàn chuẩn xác. B mắc lỗi khuyết chủ ngữ; C mắc lỗi '两面对一面'.",
    "points": 34
  },
  {
    "id": "q-hsk6-mock-03-08",
    "exam_id": "hsk6-mock-03",
    "part_type": "writing",
    "part_number": 1,
    "question_number": 8,
    "question_type": "writing_reorder",
    "prompt": "排列下列短语组成逻辑严谨的学术论断：",
    "pinyin": "Páiliè xiàliè duǎnyǔ...",
    "translation": "Sắp xếp cụm từ thành luận điểm khoa học:",
    "words": [
      "生态环境保护和经济发展",
      "绝非相互对立的矛盾体",
      "而是内在统一的有机整体"
    ],
    "scrambledWords": [
      "而是内在统一的有机整体",
      "生态环境保护和经济发展",
      "绝非相互对立的矛盾体"
    ],
    "correct_order": [
      "生态环境保护和经济发展",
      "绝非相互对立的矛盾体",
      "而是内在统一的有机整体"
    ],
    "answerKey": [
      "生态环境保护和经济发展",
      "绝非相互对立的矛盾体",
      "而是内在统一的有机整体"
    ],
    "correct_sentence": "生态环境保护和经济发展绝非相互对立的矛盾体，而是内在统一的有机整体。",
    "options": [
      {
        "text": "生态环境保护和经济发展绝非相互对立的矛盾体，而是内在统一的有机整体。",
        "pinyin": "Shēngtài huánjìng bǎohù hé jīngjì fāzhǎn juéfēi xiānghù duìlì de máodùntǐ, ér shì nèizài tǒngyī de yǒujī zhěngtǐ.",
        "translation": "Bảo vệ môi trường sinh thái và phát triển kinh tế tuyệt nhiên không phải hai thực thể mâu thuẫn đối lập nhau, mà là một chỉnh thể hữu cơ thống nhất nội tại."
      },
      {
        "text": "而是内在统一的有机整体绝非相互对立的矛盾体生态环境保护和经济发展。",
        "pinyin": "Ér shì...",
        "translation": "Lộn vế câu"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc phản đề: 主语 + 绝非 A, 而是 B.",
    "points": 33
  },
  {
    "id": "q-hsk6-mock-03-09",
    "exam_id": "hsk6-mock-03",
    "part_type": "writing",
    "part_number": 2,
    "question_number": 9,
    "question_type": "free_writing",
    "prompt": "【HSK 6 缩写概括训练】用一句学术政论文风格的句子（40-60字）概括绿色发展的核心内涵：",
    "pinyin": "【HSK 6 Suōxiě gàikuò xùnliàn】Gàikuò lǜsè fāzhǎn de héxīn nèihán:",
    "translation": "Đúc kết nội hàm phát triển xanh theo văn phong học thuật chính luận (40-60 chữ Hán):",
    "min_words": 30,
    "max_words": 70,
    "sample_answer": "绿色发展的本质在于摒弃以牺牲资源环境为代价的粗放型增长模式，推动人与自然和谐共生的可持续发展道路。",
    "writing_criteria": [
      "Văn phong học thuật chính luận chuẩn mực HSK 6",
      "Độ dài từ 30 đến 70 chữ Hán"
    ],
    "points": 33,
    "explanation": "Gợi ý: 绿色发展的本质在于摒弃粗放型增长，走人与自然和谐共生的可持续发展道路。",
    "is_subjective": true,
    "options": [
      {
        "text": "Đoạn văn mẫu tham khảo: 绿色发展的本质在于摒弃以牺牲资源环境为代价的粗放型增长模式，推动人与自然和谐共生的可持续发展道路。",
        "pinyin": "",
        "translation": "Câu/đoạn văn mẫu đạt chuẩn ngữ pháp HSK"
      },
      {
        "text": "Bài làm tự luận của thí sinh (Tự đánh giá theo thang điểm)",
        "pinyin": "",
        "translation": "Hệ thống đối sánh tiêu chí Rubric và lưu bài tự luận"
      }
    ],
    "correct_option_index": 0
  }
];
