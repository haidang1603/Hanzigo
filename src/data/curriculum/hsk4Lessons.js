/**
 * =========================================================================
 * HANZI GO - HSK 4 CURRICULUM LESSONS (20 LESSONS)
 * =========================================================================
 * Tách biệt theo cơ chế Granular Chunking nhằm tối ưu dung lượng tải ban đầu.
 * Đảm bảo 100% ID bài học, ID từ vựng, âm Hán Việt và quy trình 9 bước sư phạm.
 */

export const HSK_4_LESSONS = [
  {
    "id": "l-401",
    "chapterId": "ch-13",
    "levelId": "lvl-4",
    "lessonNumber": 1,
    "title": "Kết bạn mới & Trao đổi WeChat",
    "chineseTitle": "结识新朋友与加微信",
    "subtitle": "Cách xin phương thức liên lạc lịch thiệp và làm quen qua mạng xã hội.",
    "objective": "Nắm vững cách xin WeChat, quét mã QR và mẫu câu kết nối ban đầu.",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-13"
    ],
    "step1_learn": {
      "topic": "Kết bạn mới & Trao đổi WeChat - Trọng tâm HSK 4",
      "summary": "Cách xin phương thức liên lạc lịch thiệp và làm quen qua mạng xã hội.",
      "keyTakeaways": [
        "Nắm vững cách xin WeChat, quét mã QR và mẫu câu kết nối ban đầu.",
        "Làm chủ điểm ngữ pháp: 不仅……而且…… (Không những... mà còn...)"
      ],
      "audioDemoText": "好的，我扫你的二维码吧。"
    },
    "step2_vocabulary": [
      {
        "id": "v-401-1",
        "hanzi": "微信",
        "pinyin": "wēixìn",
        "hanviet": "Vi tín",
        "meaning": "WeChat (mạng xã hội Trung Quốc)",
        "radical": "Bộ 彳",
        "example": {
          "hanzi": "我们可以加个微信吗？",
          "pinyin": "Wǒmen kěyǐ jiā gè wēixìn ma?",
          "meaning": "Chúng ta có thể kết bạn WeChat không?"
        },
        "pos": "Động từ"
      },
      {
        "id": "v-401-2",
        "hanzi": "扫",
        "pinyin": "sǎo",
        "hanviet": "Tảo",
        "meaning": "Quét (mã QR)",
        "radical": "Bộ 扌",
        "example": {
          "hanzi": "我扫你的二维码。",
          "pinyin": "Wǒ sǎo nǐ de èrwéimǎ.",
          "meaning": "Để tôi quét mã QR của bạn."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-401-3",
        "hanzi": "联系",
        "pinyin": "liánxì",
        "hanviet": "Liên hệ",
        "meaning": "Liên lạc, liên hệ",
        "radical": "Bộ 纟",
        "example": {
          "hanzi": "以后常联系！",
          "pinyin": "Yǐhòu cháng liánxì!",
          "meaning": "Sau này thường xuyên liên lạc nhé!"
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-401-4",
        "hanzi": "号码",
        "pinyin": "hàomǎ",
        "hanviet": "Hào mã",
        "meaning": "Số điện thoại, số hiệu",
        "radical": "Bộ 口",
        "example": {
          "hanzi": "这是我的电话号码。",
          "pinyin": "Zhè shì wǒ de diànhuà hàomǎ.",
          "meaning": "Đây là số điện thoại của tôi."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "结",
        "hanzi": "结",
        "pinyin": "jié",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰纟吉",
        "radical": {
          "char": "纟",
          "name": "Mịch",
          "strokes": 3
        },
        "meaning": "Kết nối, thắt nút, kết giao bạn bè",
        "strokesCount": 9,
        "strokeOrderText": "Phẩy gập -> Phẩy gập -> Hất (纟) -> Ngang -> Sổ -> Ngang -> Sổ -> Ngang gập -> Ngang (吉)",
        "components": [
          "纟",
          "吉"
        ],
        "mnemonic": "Dùng sợi tơ (纟) kết nối điều cát lành may mắn (吉): kết giao, kết bạn (结识)."
      },
      {
        "char": "扫",
        "hanzi": "扫",
        "pinyin": "sǎo",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰扌彐",
        "radical": {
          "char": "扌",
          "name": "Thủ",
          "strokes": 3
        },
        "meaning": "Quét dọn, lia camera quét mã",
        "strokesCount": 6,
        "strokeOrderText": "Ngang -> Sổ móc -> Hất (扌) -> Ngang gập -> Ngang -> Ngang (彐)",
        "components": [
          "扌",
          "彐"
        ],
        "mnemonic": "Bàn tay (扌) lia quét nhanh chóng như chổi quét (彐): quét mã QR (扫码)."
      }
    ],
    "step4_grammar": {
      "formula": "不仅……而且…… (Không những... mà còn...)",
      "title": "Cấu trúc liên từ tăng tiến 不仅……而且……",
      "explanation": "Dùng để nối hai mệnh đề biểu thị mức độ ý nghĩa tăng tiến. Đặt chủ ngữ trước 不仅 nếu cả hai vế cùng một chủ thể.",
      "examples": [
        {
          "hanzi": "他不仅会说汉语，而且说得非常流利。",
          "pinyin": "Tā bùjǐn huì shuō Hànyǔ, érqiě shuō de fēicháng liúlì.",
          "meaning": "Anh ấy không những biết nói tiếng Trung mà còn nói rất lưu loát."
        }
      ],
      "commonMistake": {
        "wrong": "不仅他会唱歌，而且会跳舞。",
        "correct": "他不仅会唱歌，而且会跳舞。",
        "explanation": "Chủ ngữ 他 đứng trước 不仅."
      }
    },
    "step5_listening": {
      "situation": "Kết bạn mới tại hội thảo công nghệ và xin tài khoản WeChat",
      "context": "Tại sảnh triển lãm công nghệ quốc tế Thượng Hải (Tech Summit)",
      "participants": "A: Trương Minh (Kỹ sư phần mềm Bắc Kinh), B: Minh Tuấn (Chuyên viên IT Việt Nam)",
      "targetGoal": "Thực hành mẫu câu làm quen chuyên nghiệp, quét mã QR WeChat và duy trì mạng lưới liên lạc nghề nghiệp",
      "usageNotes": "Khi xin phương thức liên lạc công sở Trung Quốc, WeChat là nền tảng phổ biến nhất. Câu \"我扫你还是你扫我？\" (Tôi quét bạn hay bạn quét tôi?) là câu cửa miệng thông dụng nhất.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你好，刚才听了你的技术分享，不仅内容丰富，而且案例非常实用！",
          "pinyin": "Nǐ hǎo, gāngcái tīng le nǐ de jìshù fēnxiǎng, bùjǐn nèiróng fēngfù, érqiě ànlì fēicháng shíyòng!",
          "meaning": "Chào anh, vừa rồi nghe bài chia sẻ kỹ thuật của anh, không những nội dung phong phú mà các ví dụ thực tế cũng rất hữu ích!"
        },
        {
          "speaker": "B",
          "hanzi": "谢谢您的夸奖，能在这里结识大家我也感到非常荣幸。",
          "pinyin": "Xièxie nín de kuājiǎng, néng zài zhèlǐ jiéshí dàjiā wǒ yě gǎndào fēicháng róngxìng.",
          "meaning": "Cảm ơn lời khen của anh, được làm quen với mọi người ở đây tôi cũng cảm thấy vô cùng vinh hạnh."
        },
        {
          "speaker": "A",
          "hanzi": "以后在软件开发方面我们可以多交流，方便加个微信吗？",
          "pinyin": "Yǐhòu zài ruǎnjiàn kāifā fāngmiàn wǒmen kěyǐ duō jiāoliú, fāngbiàn jiā gè wēixìn ma?",
          "meaning": "Sau này về mảng phát triển phần mềm chúng ta có thể trao đổi nhiều hơn, tiện cho tôi kết bạn WeChat được không?"
        },
        {
          "speaker": "B",
          "hanzi": "当然可以！这是我的二维码名片，你扫我还是我扫你？",
          "pinyin": "Dāngrán kěyǐ! Zhè shì wǒ de èrwéimǎ míngpiàn, nǐ sǎo wǒ háishì wǒ sǎo nǐ?",
          "meaning": "Tất nhiên là được rồi! Đây là danh thiếp mã QR của tôi, anh quét tôi hay tôi quét anh?"
        },
        {
          "speaker": "A",
          "hanzi": "好的，我已经扫码发送好友申请了，以后常联系！",
          "pinyin": "Hǎo de, wǒ yǐjīng sǎomǎ fāsòng hǎoyǒu shēnqǐng le, yǐhòu cháng liánxì!",
          "meaning": "Dạ được, tôi đã quét mã gửi lời mời kết bạn rồi, sau này thường xuyên giữ liên lạc nhé!"
        }
      ],
      "audioText": "你好，刚才听了你的技术分享，不仅内容丰富，而且案例非常实用！谢谢您的夸奖，能在这里结识大家我也感到非常荣幸。以后在软件开发方面我们可以多交流，方便加个微信吗？当然可以！这是我的二维码名片，你扫我还是我扫你？好的，我已经扫码发送好友申请了，以后常联系！",
      "question": "Hai người trong đoạn hội thoại trao đổi phương thức liên lạc bằng cách nào?",
      "options": [
        "Ghi số điện thoại ra giấy",
        "Quét mã QR WeChat (扫二维码名片)",
        "Gửi thư tay qua bưu điện",
        "Đọc địa chỉ nhà riêng"
      ],
      "correctIndex": 1,
      "explanation": "Người B đưa danh thiếp mã QR và người A nói: \"我已经扫码发送好友申请了\" (Tôi đã quét mã gửi lời mời kết bạn rồi)."
    },
    "step6_speaking": {
      "prompt": "Nói câu xin WeChat:",
      "targetSentence": "你扫我还是我扫你？",
      "targetPinyin": "Nǐ sǎo wǒ háishì wǒ sǎo nǐ?",
      "targetMeaning": "Bạn quét tôi hay tôi quét bạn?",
      "hint": "Nhấn giọng ở động từ sǎo."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Sau này chúng ta thường xuyên liên lạc nhé'",
      "words": [
        "以后",
        "常联系",
        "我们",
        "吧"
      ],
      "correctOrder": [
        "以后",
        "我们",
        "常联系",
        "吧"
      ],
      "explanation": "Trạng từ thời gian 以后 đứng đầu câu hoặc sau chủ ngữ."
    },
    "step8_quiz": [
      {
        "id": "q-401-1",
        "type": "multiple-choice",
        "question": "Mẫu câu nào dùng để xin phương thức liên lạc lịch sự nhất?",
        "options": [
          "可以加个微信吗？",
          "快把微信给我！",
          "我不需要你的微信。",
          "你在干什么？"
        ],
        "correctIndex": 0,
        "explanation": "Dùng 可以...吗？ thể hiện sự lịch thiệp."
      },
      {
        "id": "q-401-2",
        "type": "multiple-choice",
        "question": "Điền từ: '他____聪明，____非常勤奋。'",
        "options": [
          "因为...所以...",
          "不仅...而且...",
          "虽然...但是...",
          "如果...就..."
        ],
        "correctIndex": 1,
        "explanation": "Ý tăng tiến dùng 不仅...而且..."
      }
    ],
    "step9_challenge": {
      "title": "Trao đổi liên lạc",
      "taskDesc": "Luyện nói phản xạ xin WeChat và đối đáp tự nhiên.",
      "targetPhrase": "kěyǐ jiā gè wēixìn ma?",
      "xpReward": 60,
      "badge": "Sứ Giả Giao Tiếp HSK 4"
    }
  },
  {
    "id": "l-402",
    "chapterId": "ch-13",
    "levelId": "lvl-4",
    "lessonNumber": 2,
    "title": "Hẹn đi xem phim & Cà phê cuối tuần",
    "chineseTitle": "周末约会看电影喝咖啡",
    "subtitle": "Lên lịch hẹn hò, gợi ý địa điểm và chốt thời gian cuối tuần.",
    "objective": "Sử dụng thành thạo từ ngữ hẹn gặp và biểu đạt sự cam kết 不见不散.",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-13"
    ],
    "step1_learn": {
      "topic": "Hẹn đi xem phim & Cà phê cuối tuần - Trọng tâm HSK 4",
      "summary": "Lên lịch hẹn hò, gợi ý địa điểm và chốt thời gian cuối tuần.",
      "keyTakeaways": [
        "Sử dụng thành thạo từ ngữ hẹn gặp và biểu đạt sự cam kết 不见不散.",
        "Làm chủ điểm ngữ pháp: 既然……就…… (Đã... thì...)"
      ],
      "audioDemoText": "好的，不见不散！"
    },
    "step2_vocabulary": [
      {
        "id": "v-402-1",
        "hanzi": "约会",
        "pinyin": "yuēhuì",
        "hanviet": "Ước hội",
        "meaning": "Hẹn hò, cuộc hẹn",
        "radical": "Bộ 纟",
        "example": {
          "hanzi": "这个周末你有什么约会吗？",
          "pinyin": "Zhège zhōumò nǐ yǒu shénme yuēhuì ma?",
          "meaning": "Cuối tuần này bạn có cuộc hẹn nào không?"
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-402-2",
        "hanzi": "电影院",
        "pinyin": "diànyǐngyuàn",
        "hanviet": "Điện ảnh viện",
        "meaning": "Rạp chiếu phim",
        "radical": "Bộ 阝",
        "example": {
          "hanzi": "我们在电影院门口见。",
          "pinyin": "Wǒmen zài diànyǐngyuàn ménkǒu jiàn.",
          "meaning": "Chúng ta gặp ở cổng rạp chiếu phim nhé."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-402-3",
        "hanzi": "空儿",
        "pinyin": "kòngr",
        "hanviet": "Không nhi",
        "meaning": "Thời gian rảnh",
        "radical": "Bộ 穴",
        "example": {
          "hanzi": "明天下午你有空儿吗？",
          "pinyin": "Míngtiān xiàwǔ nǐ yǒu kòngr ma?",
          "meaning": "Chiều mai bạn có rảnh không?"
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-402-4",
        "hanzi": "建议",
        "pinyin": "jiànyì",
        "hanviet": "Kiến nghị",
        "meaning": "Gợi ý, đề xuất",
        "radical": "Bộ 言",
        "example": {
          "hanzi": "我建议去喝咖啡。",
          "pinyin": "Wǒ jiànyì qù hē kāfēi.",
          "meaning": "Tôi đề xuất đi uống cà phê."
        },
        "pos": "Động từ / Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "约",
        "hanzi": "约",
        "pinyin": "yuē",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰纟勺",
        "radical": {
          "char": "纟",
          "name": "Mịch",
          "strokes": 3
        },
        "meaning": "Hẹn ước, ước chừng",
        "strokesCount": 6,
        "strokeOrderText": "Phẩy gập -> Phẩy gập -> Hất (纟) -> Phẩy -> Ngang gập móc -> Chấm (勺)",
        "components": [
          "纟",
          "勺"
        ],
        "mnemonic": "Sợi dây tơ (纟) ràng buộc lời hẹn ước rót đầy chiếc muôi (勺): hẹn hò, ước hẹn (约会)."
      },
      {
        "char": "建",
        "hanzi": "建",
        "pinyin": "jiàn",
        "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿺"
        },
        "ids": "⿺廴聿",
        "radical": {
          "char": "廴",
          "name": "Dẫn",
          "strokes": 2
        },
        "meaning": "Xây dựng, kiến nghị, đề xuất",
        "strokesCount": 8,
        "strokeOrderText": "Chữ Duật 聿 (ngang, sổ, ngang...) -> Bộ Dẫn 廴 (ngang gập phẩy, mác dài)",
        "components": [
          "廴",
          "聿"
        ],
        "mnemonic": "Cầm bút (聿) vạch từng bước đi xa (廴) để kiến thiết tương lai: kiến nghị (建议)."
      }
    ],
    "step4_grammar": {
      "formula": "既然……就…… (Đã... thì...)",
      "title": "Cấu trúc suy luận nhân quả 既然……就……",
      "explanation": "Dùng khi đưa ra kết luận hoặc đề xuất hành động dựa trên thực tế đã biết trước.",
      "examples": [
        {
          "hanzi": "既然你有空儿，我们就一起去吧。",
          "pinyin": "Jìrán nǐ yǒu kòngr, wǒmen jiù yìqǐ qù ba.",
          "meaning": "Đã là bạn rảnh thì chúng ta cùng đi thôi."
        }
      ],
      "commonMistake": {
        "wrong": "因为你来了，就进去。",
        "correct": "既然你来了，就进去坐吧。",
        "explanation": "Đưa ra đề xuất dựa trên hiện thực trước mắt dùng 既然...就..."
      }
    },
    "step5_listening": {
      "situation": "Hẹn bạn đi xem phim và uống cà phê thư giãn cuối tuần",
      "context": "Tin nhắn thoại trao đổi kế hoạch thứ Bảy tại quán cà phê gần trường đại học",
      "participants": "A: Tiểu Lệ (Sinh viên Trung Quốc), B: Lan Anh (Du học sinh Việt Nam)",
      "targetGoal": "Vận dụng cấu trúc 既然……就…… để đưa ra quyết định dứt khoát khi có điều kiện tiền đề",
      "usageNotes": "Cấu trúc \"既然……就……\" dùng khi một sự việc hoặc tiền đề đã rõ ràng, vế sau đưa ra đề xuất hợp lý hiển nhiên.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "兰英，这周末你有什么安排吗？听说新上映了一部科幻电影，评价特别高。",
          "pinyin": "Lányīng, zhè zhōumò nǐ yǒu shénme ānpái ma? Tīngshuō xīn shàngyìng le yí bù kēhuàn diànyǐng, píngjià tèbié gāo.",
          "meaning": "Lan Anh, cuối tuần này cậu có kế hoạch gì chưa? Nghe nói rạp mới chiếu một bộ phim khoa học viễn tưởng được đánh giá rất cao."
        },
        {
          "speaker": "B",
          "hanzi": "我正好周六下午有空儿，最近复习准备考试有点儿累，正想放松一下。",
          "pinyin": "Wǒ zhènghǎo zhōuliù xiàwǔ yǒu kòngr, zuìjìn fùxí zhǔnbèi kǎoshì yǒudiǎnr lèi, zhèng xiǎng fàngsōng yíxià.",
          "meaning": "Tớ vừa vặn chiều thứ Bảy có thời gian rảnh, dạo này ôn thi hơi mệt nên cũng đang muốn thư giãn một chút."
        },
        {
          "speaker": "A",
          "hanzi": "既然你周六有空儿，那我们就定在周六下午两点见面吧！",
          "pinyin": "Jìrán nǐ zhōuliù yǒu kòngr, nà wǒmen jiù dìng zài zhōuliù xiàwǔ liǎng diǎn jiànmiàn ba!",
          "meaning": "Đã là cậu rảnh chiều thứ Bảy thì chúng mình chốt gặp nhau lúc 2 giờ chiều thứ Bảy nhé!"
        },
        {
          "speaker": "B",
          "hanzi": "好主意！看完电影以后，我建议去旁边那家咖啡馆坐坐，怎么样？",
          "pinyin": "Hǎo zhǔyi! Kàn wán diànyǐng yǐhòu, wǒ jiànyì qù pángbiān nà jiā kāfēiguǎn zuòzuo, zěnmeyàng?",
          "meaning": "Ý hay đấy! Xem phim xong, tớ gợi ý ghé quán cà phê bên cạnh ngồi trò chuyện, cậu thấy sao?"
        },
        {
          "speaker": "A",
          "hanzi": "没问题，那我先在网上把电影票订好，周六下午见！",
          "pinyin": "Méi wèntí, nà wǒ xiān zài wǎngshang bǎ diànyǐngpiào dìng hǎo, zhōuliù xiàwǔ jiàn!",
          "meaning": "Không vấn đề gì, thế để tớ đặt vé phim trên mạng trước nhé, hẹn chiều thứ Bảy gặp!"
        }
      ],
      "audioText": "兰英，这周末你有什么安排吗？听说新上映了一部科幻电影，评价特别高。我正好周六下午有空儿，最近复习准备考试有点儿累，正想放松一下。既然你周六有空儿，那我们就定在周六下午两点见面吧！好主意！看完电影以后，我建议去旁边那家咖啡馆坐坐，怎么样？没问题，那我先在网上把电影票订好，周六下午见！",
      "question": "Hai bạn dự định làm gì sau khi xem xong phim?",
      "options": [
        "Đi về nhà ngay",
        "Đến quán cà phê bên cạnh ngồi trò chuyện",
        "Đi trung tâm thương mại mua sắm",
        "Đi ăn lẩu ở trường"
      ],
      "correctIndex": 1,
      "explanation": "Người B gợi ý: \"看完电影以后，我建议去旁边那家咖啡馆坐坐\" (Sau khi xem phim xong, tôi gợi ý ghé quán cà phê bên cạnh ngồi)."
    },
    "step6_speaking": {
      "prompt": "Nói lời hứa hẹn cuộc gặp:",
      "targetSentence": "周六下午，不见不散！",
      "targetPinyin": "Zhōuliù xiàwǔ, bú jiàn bú sàn!",
      "targetMeaning": "Chiều thứ Bảy, không gặp không về nhé!",
      "hint": "Phát âm dứt khoát bú jiàn bú sàn."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Đã thích thì bạn mua đi'",
      "words": [
        "就买吧",
        "既然",
        "喜欢",
        "你"
      ],
      "correctOrder": [
        "既然",
        "你",
        "喜欢",
        "就买吧"
      ],
      "explanation": "Cấu trúc 既然...就..."
    },
    "step8_quiz": [
      {
        "id": "q-402-1",
        "type": "multiple-choice",
        "question": "Thành ngữ '不见不散' dùng trong ngữ cảnh nào?",
        "options": [
          "Khi chia tay vĩnh viễn",
          "Khi hẹn gặp chắc chắn với ai đó",
          "Khi từ chối cuộc hẹn",
          "Khi đi lạc đường"
        ],
        "correctIndex": 1,
        "explanation": "Dùng để khẳng định quyết tâm gặp mặt."
      },
      {
        "id": "q-402-2",
        "type": "multiple-choice",
        "question": "Điền liên từ: '____下雨了，我们____在室内看电影吧。'",
        "options": [
          "既然...就...",
          "因为...但...",
          "不仅...而且...",
          "虽然...所以..."
        ],
        "correctIndex": 0,
        "explanation": "Cặp từ phù hợp: 既然...就..."
      }
    ],
    "step9_challenge": {
      "title": "Lên lịch hẹn",
      "taskDesc": "Viết tin nhắn rủ bạn đi uống cà phê.",
      "targetPhrase": "bú jiàn bú sàn",
      "xpReward": 60,
      "badge": "Chuyên Gia Lên Lịch"
    }
  },
  {
    "id": "l-403",
    "chapterId": "ch-13",
    "levelId": "lvl-4",
    "lessonNumber": 3,
    "title": "Chia sẻ sở thích thể thao & Nghệ thuật",
    "chineseTitle": "谈论体育运动与艺术爱好",
    "subtitle": "Mô tả đam mê tập gym, nhiếp ảnh và lợi ích của rèn luyện.",
    "objective": "Diễn đạt sở thích cá nhân bằng cấu trúc 对...感兴趣 và 对...有好处.",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-13"
    ],
    "step1_learn": {
      "topic": "Chia sẻ sở thích thể thao & Nghệ thuật - Trọng tâm HSK 4",
      "summary": "Mô tả đam mê tập gym, nhiếp ảnh và lợi ích của rèn luyện.",
      "keyTakeaways": [
        "Diễn đạt sở thích cá nhân bằng cấu trúc 对...感兴趣 và 对...有好处.",
        "Làm chủ điểm ngữ pháp: 对……感兴趣 / 有好处 (Có hứng thú với... / Có lợi cho...)"
      ],
      "audioDemoText": "我对摄影特别感兴趣，经常出去拍照。"
    },
    "step2_vocabulary": [
      {
        "id": "v-403-1",
        "hanzi": "健身",
        "pinyin": "jiànshēn",
        "hanviet": "Kiện thân",
        "meaning": "Tập thể hình, rèn luyện",
        "radical": "Bộ 亻",
        "example": {
          "hanzi": "我喜欢去健身房。",
          "pinyin": "Wǒ xǐhuan qù jiànshēnfáng.",
          "meaning": "Tôi thích đến phòng gym."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-403-2",
        "hanzi": "摄影",
        "pinyin": "shèyǐng",
        "hanviet": "Nhiếp ảnh",
        "meaning": "Nhiếp ảnh, chụp ảnh",
        "radical": "Bộ 扌",
        "example": {
          "hanzi": "我对摄影很感兴趣。",
          "pinyin": "Wǒ duì shèyǐng hěn gǎn xìngqù.",
          "meaning": "Tôi rất có hứng thú với nhiếp ảnh."
        },
        "pos": "Danh từ / Động từ"
      },
      {
        "id": "v-403-3",
        "hanzi": "坚持",
        "pinyin": "jiānchí",
        "hanviet": "Kiên trì",
        "meaning": "Kiên trì, giữ vững",
        "radical": "Bộ 土",
        "example": {
          "hanzi": "坚持锻炼身体好。",
          "pinyin": "Jiānchí duànliàn shēntǐ hǎo.",
          "meaning": "Kiên trì rèn luyện sức khỏe sẽ tốt."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-403-4",
        "hanzi": "吸引",
        "pinyin": "xīyǐn",
        "hanviet": "Hấp dẫn",
        "meaning": "Thu hút, lôi cuốn",
        "radical": "Bộ 口",
        "example": {
          "hanzi": "这首歌吸引了很多人。",
          "pinyin": "Zhè shǒu gē xīyǐn le hěn duō rén.",
          "meaning": "Bài hát này thu hút rất nhiều người."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "毅",
        "hanzi": "毅",
        "pinyin": "yì",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰豖殳",
        "radical": {
          "char": "殳",
          "name": "Thù",
          "strokes": 4
        },
        "meaning": "Nghị lực, kiên quyết, dũng cảm",
        "strokesCount": 15,
        "strokeOrderText": "Phần Thốc 豖 (11 nét) -> Bộ Thù 殳 (4 nét)",
        "components": [
          "豖",
          "殳"
        ],
        "mnemonic": "Cầm gậy săn (殳) đối diện dã trư hung tợn (豖) không lùi bước: nghị lực phi thường (毅力)."
      },
      {
        "char": "摄",
        "hanzi": "摄",
        "pinyin": "shè",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰扌聂",
        "radical": {
          "char": "扌",
          "name": "Thủ",
          "strokes": 3
        },
        "meaning": "Nhiếp ảnh, thu nhận, chụp hình",
        "strokesCount": 13,
        "strokeOrderText": "Bộ Thủ 扌 (3 nét) -> Chữ Nhiếp 聂 (ba bộ Nhĩ 耳 xếp tầng)",
        "components": [
          "扌",
          "耳"
        ],
        "mnemonic": "Bàn tay (扌) nắm bắt mọi thanh âm hình ảnh lọt vào tai (耳): nhiếp ảnh (摄影)."
      }
    ],
    "step4_grammar": {
      "formula": "对……感兴趣 / 有好处 (Có hứng thú với... / Có lợi cho...)",
      "title": "Giới từ 对 biểu thị đối tượng",
      "explanation": "Đặt cụm '对 + Đối tượng' trước vị ngữ để biểu thị thái độ hoặc ảnh hưởng.",
      "examples": [
        {
          "hanzi": "多吃水果对身体有好处。",
          "pinyin": "Duō chī shuǐguǒ duì shēntǐ yǒu hǎochu.",
          "meaning": "Ăn nhiều hoa quả rất có lợi cho sức khỏe."
        }
      ],
      "commonMistake": {
        "wrong": "我很有兴趣对汉语。",
        "correct": "我对汉语很感兴趣。",
        "explanation": "'对汉语' phải đặt trước '感兴趣'."
      }
    },
    "step5_listening": {
      "situation": "Trao đổi về sở thích rèn luyện thể thao và niềm đam mê nhiếp ảnh nghệ thuật",
      "context": "Buổi sinh hoạt giao lưu câu lạc bộ văn hóa thanh niên cuối tuần",
      "participants": "A: Vương Cương (Người đam mê thể hình), B: Hồng Nhung (Người yêu thích nhiếp ảnh)",
      "targetGoal": "Thực hành cấu trúc 对……感兴趣 / 有好处 để diễn đạt sự say mê và lợi ích cho sức khỏe",
      "usageNotes": "Khi nói về sở thích cá nhân, người Trung Quốc thường dùng cụm \"坚持锻炼\" (kiên trì rèn luyện) và ca ngợi \"毅力\" (nghị lực).",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "红绒，平时下了班你都喜欢做些什么来放松身心呢？",
          "pinyin": "Hóngróng, píngshí xià le bān nǐ dōu xǐhuan zuò xiē shénme lái fàngsōng shēnxīn ne?",
          "meaning": "Hồng Nhung, bình thường tan làm cậu thích làm những gì để thư giãn thể chất và tinh thần?"
        },
        {
          "speaker": "B",
          "hanzi": "我对户外摄影非常感兴趣，经常带着相机去公园捕捉风景和人物。",
          "pinyin": "Wǒ duì hùwài shèyǐng fēicháng gǎnxìngqù, jīngcháng dài zhe xiàngjī qù gōngyuán bǔzhuō fēngjǐng hé rénwù.",
          "meaning": "Tớ cực kỳ có hứng thú với nhiếp ảnh dã ngoại, thường mang theo máy ảnh ra công viên chụp phong cảnh và con người."
        },
        {
          "speaker": "A",
          "hanzi": "难怪你拍的照片那么吸引人！我平时更喜欢去健身房跑步和举重。",
          "pinyin": "Nánguài nǐ pāi de zhàopiàn nàme xīyǐn rén! Wǒ píngshí gèng xǐhuan qù jiànshēnfáng pǎobù hé jǔzhòng.",
          "meaning": "Thảo nào ảnh cậu chụp lôi cuốn đến vậy! Tớ thì bình thường thích đến phòng gym chạy bộ và nâng tạ hơn."
        },
        {
          "speaker": "B",
          "hanzi": "坚持每天健身需要极大的毅力，运动对身体健康真的太有好处了。",
          "pinyin": "Jiānchí měitiān jiànshēn xūyào jídà de yìlì, yùndòng duì shēntǐ jiànkāng zhēn de tài yǒu hǎochu le.",
          "meaning": "Kiên trì tập gym mỗi ngày cần nghị lực to lớn lắm, vận động thực sự quá có lợi cho sức khỏe."
        },
        {
          "speaker": "A",
          "hanzi": "是的，既能强健体魄，又能减轻工作压力，我们都要坚持下去！",
          "pinyin": "Shì de, jì néng qiángjiàn tǐpò, yòu néng jiǎnqīng gōngzuò yālì, wǒmen dōu yào jiānchí xiàqu!",
          "meaning": "Đúng vậy, vừa rèn luyện thể chất cường tráng lại vừa giải tỏa áp lực công việc, chúng mình cùng kiên trì nhé!"
        }
      ],
      "audioText": "红绒，平时下了班你都喜欢做些什么来放松身心呢？我对户外摄影非常感兴趣，经常带着相机去公园捕捉风景和人物。难怪你拍的照片那么吸引人！我平时更喜欢去健身房跑步和举重。坚持每天健身需要极大的毅力，运动对身体健康真的太有好处了。是的，既能强健体魄，又能减轻工作压力，我们都要坚持下去！",
      "question": "Theo đoạn hội thoại, việc kiên trì tập thể hình đem lại những lợi ích gì?",
      "options": [
        "Chỉ để đi thi đấu chuyên nghiệp",
        "Vừa rèn luyện thể phách vừa giảm áp lực công việc",
        "Để chụp ảnh phong cảnh đẹp",
        "Để có nhiều thời gian rảnh rỗi"
      ],
      "correctIndex": 1,
      "explanation": "Người A kết luận: \"既能强健体魄，又能减轻工作压力\" (Vừa làm mạnh thể phách vừa giảm bớt áp lực công việc)."
    },
    "step6_speaking": {
      "prompt": "Nói về sự hứng thú:",
      "targetSentence": "我对中国书法很感兴趣。",
      "targetPinyin": "Wǒ duì Zhōngguó shūfǎ hěn gǎn xìngqù.",
      "targetMeaning": "Tôi rất có hứng thú với thư pháp Trung Quốc.",
      "hint": "Đọc liền mạch cụm duì Zhōngguó shūfǎ."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Kiên trì tập thể dục rất tốt cho sức khỏe'",
      "words": [
        "对身体",
        "锻炼",
        "很有好处",
        "坚持"
      ],
      "correctOrder": [
        "坚持",
        "锻炼",
        "对身体",
        "很有好处"
      ],
      "explanation": "Cấu trúc Chủ ngữ hành động + 对... + 很有好处."
    },
    "step8_quiz": [
      {
        "id": "q-403-1",
        "type": "multiple-choice",
        "question": "Chọn câu có trật tự từ đúng ngữ pháp:",
        "options": [
          "他对音乐很感兴趣。",
          "他很感兴趣对音乐。",
          "对音乐他感兴趣很。",
          "他感兴趣很对音乐。"
        ],
        "correctIndex": 0,
        "explanation": "Cấu trúc chuẩn: 对 + Đối tượng + 感兴趣."
      },
      {
        "id": "q-403-2",
        "type": "multiple-choice",
        "question": "Từ '坚持' mang ý nghĩa gì?",
        "options": [
          "Bỏ dở giữa chừng",
          "Kiên trì bền bỉ",
          "Thay đổi liên tục",
          "Chậm chạp"
        ],
        "correctIndex": 1,
        "explanation": "坚持 nghĩa là kiên trì không từ bỏ."
      }
    ],
    "step9_challenge": {
      "title": "Nói về sở thích",
      "taskDesc": "Ghi âm 30 giây chia sẻ môn thể thao bạn yêu thích.",
      "targetPhrase": "duì shēntǐ yǒu hǎochu",
      "xpReward": 60,
      "badge": "Phong Cách Năng Động"
    }
  },
  {
    "id": "l-404",
    "chapterId": "ch-13",
    "levelId": "lvl-4",
    "lessonNumber": 4,
    "title": "Thảo luận kế hoạch học tập & Thi cử",
    "chineseTitle": "讨论学习计划与备考策略",
    "subtitle": "Cách lập kế hoạch ôn thi HSK 4, vượt qua áp lực và kiên trì.",
    "objective": "Nắm vững cấu trúc điều kiện 只要……就…… và từ vựng thi cử.",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-13"
    ],
    "step1_learn": {
      "topic": "Thảo luận kế hoạch học tập & Thi cử - Trọng tâm HSK 4",
      "summary": "Cách lập kế hoạch ôn thi HSK 4, vượt qua áp lực và kiên trì.",
      "keyTakeaways": [
        "Nắm vững cấu trúc điều kiện 只要……就…… và từ vựng thi cử.",
        "Làm chủ điểm ngữ pháp: 只要……就…… (Chỉ cần... thì...)"
      ],
      "audioDemoText": "别慌，只要平时认真复习，就一定没问题。"
    },
    "step2_vocabulary": [
      {
        "id": "v-404-1",
        "hanzi": "复习",
        "pinyin": "fùxí",
        "hanviet": "Phục tập",
        "meaning": "Ôn tập",
        "radical": "Bộ 彳",
        "example": {
          "hanzi": "考前要认真复习。",
          "pinyin": "Kǎo qián yào rènzhēn fùxí.",
          "meaning": "Trước kỳ thi cần ôn tập chăm chỉ."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-404-2",
        "hanzi": "压力",
        "pinyin": "yālì",
        "hanviet": "Áp lực",
        "meaning": "Áp lực, căng thẳng",
        "radical": "Bộ 厂",
        "example": {
          "hanzi": "不要给自己太大压力。",
          "pinyin": "Bú yào gěi zìjǐ tài dà yālì.",
          "meaning": "Đừng tạo cho mình áp lực quá lớn."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-404-3",
        "hanzi": "严格",
        "pinyin": "yángé",
        "hanviet": "Nghiêm cách",
        "meaning": "Nghiêm khắc, chặt chẽ",
        "radical": "Bộ 木",
        "example": {
          "hanzi": "老师对我们要求很严格。",
          "pinyin": "Lǎoshī duì wǒmen yāoqiú hěn yángé.",
          "meaning": "Thầy cô yêu cầu chúng tôi rất nghiêm khắc."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-404-4",
        "hanzi": "通过",
        "pinyin": "tōngguò",
        "hanviet": "Thông quá",
        "meaning": "Vượt qua, đỗ kỳ thi",
        "radical": "Bộ 辶",
        "example": {
          "hanzi": "祝你顺利通过考试！",
          "pinyin": "Zhù nǐ shùnlì tōngguò kǎoshì!",
          "meaning": "Chúc bạn thuận lợi vượt qua kỳ thi!"
        },
        "pos": "Tính từ / Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "压",
        "hanzi": "压",
        "pinyin": "yā",
        "structure": {
          "code": "semi_top_left",
          "name": "Bán bao vi trên-trái (左上包围)",
          "symbol": "⿸"
        },
        "ids": "⿸厂土丶",
        "radical": {
          "char": "厂",
          "name": "Hán",
          "strokes": 2
        },
        "meaning": "Đè nén, áp lực",
        "strokesCount": 6,
        "strokeOrderText": "Ngang -> Phẩy (厂) -> Ngang -> Sổ -> Ngang (土) -> Chấm (丶)",
        "components": [
          "厂",
          "土",
          "丶"
        ],
        "mnemonic": "Khối đất đá (土) nặng ngàn cân dưới vách đá (厂) đè xuống: áp lực (压力)."
      },
      {
        "char": "严",
        "hanzi": "严",
        "pinyin": "yán",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱亚厂",
        "radical": {
          "char": "一",
          "name": "Nhất",
          "strokes": 1
        },
        "meaning": "Nghiêm khắc, chặt chẽ, trang nghiêm",
        "strokesCount": 7,
        "strokeOrderText": "Ngang -> Sổ -> Ngang -> Sổ -> Ngang -> Phẩy gập -> Phẩy (严)",
        "components": [
          "一",
          "亚",
          "厂"
        ],
        "mnemonic": "Quy củ thép dưới mái vòm (厂) không sai lệch một nét: nghiêm khắc (严格)."
      }
    ],
    "step4_grammar": {
      "formula": "只要……就…… (Chỉ cần... thì...)",
      "title": "Cấu trúc điều kiện đủ 只要……就……",
      "explanation": "Chỉ cần đáp ứng điều kiện ở phân câu trước thì sẽ dẫn đến kết quả ở phân câu sau.",
      "examples": [
        {
          "hanzi": "只要努力，就能通过考试。",
          "pinyin": "Zhǐyào nǔlì, jiù néng tōngguò kǎoshì.",
          "meaning": "Chỉ cần nỗ lực thì có thể vượt qua kỳ thi."
        }
      ],
      "commonMistake": {
        "wrong": "只要努力，才通过。",
        "correct": "只要努力，就能通过。",
        "explanation": "只要 đi với 就; còn 只有 mới đi với 才."
      }
    },
    "step5_listening": {
      "situation": "Thảo luận phương pháp soạn bài, đối diện áp lực thi cử và chuẩn đầu ra HSK 4",
      "context": "Tại thư viện đại học trước kỳ thi đánh giá năng lực Hán ngữ quốc tế",
      "participants": "A: Bạn học Trương (Lớp trưởng), B: Hoàng Nam (Học viên chuẩn bị thi HSK 4)",
      "targetGoal": "Vận dụng cấu trúc 只要……就…… để biểu thị điều kiện tiên quyết tất yếu dẫn đến thành công",
      "usageNotes": "Cấu trúc \"只要……就……\" biểu thị điều kiện duy nhất cần có là đủ để đạt kết quả. Từ \"严格\" mang sắc thái khen ngợi kỷ luật tốt.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "下个月就要考HSK四级了，你的词汇和真题复习得怎么样了？",
          "pinyin": "Xià gè yuè jiù yào kǎo HSK sìjí le, nǐ de cíhuì hé zhēntí fùxí de zěnmeyàng le?",
          "meaning": "Tháng sau là thi HSK 4 rồi, việc ôn từ vựng và đề thi thật của cậu tiến triển đến đâu rồi?"
        },
        {
          "speaker": "B",
          "hanzi": "我每天都认真预习新课和刷题，不过听力部分语速很快，感觉压力挺大的。",
          "pinyin": "Wǒ měitiān dōu rènzhēn yùxí xīnkè hé shuātí, búguò tīnglì bùfen yǔsù hěn kuài, gǎnjué yālì tǐng dà de.",
          "meaning": "Mỗi ngày tớ đều chăm chỉ soạn bài mới và làm đề, nhưng phần nghe tốc độ nói khá nhanh nên cảm thấy áp lực ghê."
        },
        {
          "speaker": "A",
          "hanzi": "老师对我们的要求虽然严格，但只要你坚持每天精听半小时，听力水平就一定会提高。",
          "pinyin": "Lǎoshī duì wǒmen de yāoqiú suīrán yángé, dàn zhǐyào nǐ jiānchí měitiān jīngtīng bàn xiǎoshí, tīnglì shuǐpíng jiù yídìng huì tígāo.",
          "meaning": "Thầy cô yêu cầu chúng mình tuy nghiêm khắc, nhưng chỉ cần cậu kiên trì nghe kỹ nửa tiếng mỗi ngày thì trình độ nghe nhất định sẽ tiến bộ."
        },
        {
          "speaker": "B",
          "hanzi": "你说得对！只要掌握了高频词汇和做题技巧，考出合格的分数就不成问题。",
          "pinyin": "Nǐ shuō de duì! Zhǐyào zhǎngwò le gāopín cíhuì hé zuòtí jìqiǎo, kǎo chū hégé de fēnshù jiù bù chéng wèntí.",
          "meaning": "Cậu nói rất đúng! Chỉ cần nắm vững các từ vựng xuất hiện nhiều và kỹ xảo làm bài, việc đạt điểm đỗ sẽ không thành vấn đề."
        },
        {
          "speaker": "A",
          "hanzi": "那我们互相监督，每天晚上在微信群里打卡总结吧！",
          "pinyin": "Nà wǒmen hùxiāng jiāndū, měitiān wǎnshang zài wēixìn qún lǐ dǎkǎ zǒngjié ba!",
          "meaning": "Vậy chúng mình cùng giám sát nhau, mỗi tối điểm danh tổng kết trong nhóm WeChat nhé!"
        }
      ],
      "audioText": "下个月就要考HSK四级了，你的词汇和真题复习得怎么样了？我每天都认真预习新课和刷题，不过听力部分语速很快，感觉压力挺大的。老师对我们的要求虽然严格，但只要你坚持每天精听半小时，听力水平就一定会提高。你说得对！只要掌握了高频词汇和做题技巧，考出合格的分数就不成问题。那我们互相监督，每天晚上在微信群里打卡总结吧！",
      "question": "Theo lời khuyên của bạn A, làm thế nào để nâng cao trình độ nghe hiểu?",
      "options": [
        "Chỉ học ngữ pháp trong sách",
        "Kiên trì nghe kỹ nửa tiếng mỗi ngày (坚持每天精听半小时)",
        "Bỏ qua bài tập nghe",
        "Đọc thuộc lòng đáp án"
      ],
      "correctIndex": 1,
      "explanation": "Bạn A khuyên: \"只要你坚持每天精听半小时，听力水平就一定会提高\" (Chỉ cần kiên trì nghe kỹ nửa tiếng mỗi ngày, trình độ nghe nhất định sẽ tăng)."
    },
    "step6_speaking": {
      "prompt": "Nói câu tự khích lệ:",
      "targetSentence": "只要坚持，就一定会成功！",
      "targetPinyin": "Zhǐyào jiānchí, jiù yídìng huì chénggōng!",
      "targetMeaning": "Chỉ cần kiên trì thì nhất định sẽ thành công!",
      "hint": "Nói với ngữ điệu kiên định."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Chỉ cần trời tạnh mưa thì chúng ta đi'",
      "words": [
        "只要",
        "雨停了",
        "就出发",
        "我们"
      ],
      "correctOrder": [
        "只要",
        "雨停了",
        "我们",
        "就出发"
      ],
      "explanation": "Cấu trúc 只要...就..."
    },
    "step8_quiz": [
      {
        "id": "q-404-1",
        "type": "multiple-choice",
        "question": "Điền từ phù hợp: '____你按时完成作业，____能取得好成绩。'",
        "options": [
          "因为...所以...",
          "只要...就...",
          "虽然...但是...",
          "宁可...也..."
        ],
        "correctIndex": 1,
        "explanation": "Điều kiện đủ dùng 只要...就..."
      },
      {
        "id": "q-404-2",
        "type": "multiple-choice",
        "question": "Trái nghĩa với '严格' (nghiêm khắc) là gì?",
        "options": [
          "随便 / 松懈",
          "认真",
          "努力",
          "勤劳"
        ],
        "correctIndex": 0,
        "explanation": "随便/松懈 mang nghĩa tùy tiện, buông lỏng."
      }
    ],
    "step9_challenge": {
      "title": "Mục tiêu vượt ải HSK",
      "taskDesc": "Ghi lại mục tiêu học tập hàng ngày bằng tiếng Trung.",
      "targetPhrase": "tōngguò kǎoshì",
      "xpReward": 60,
      "badge": "Tinh Thần Khảo Thí"
    }
  },
  {
    "id": "l-405",
    "chapterId": "ch-13",
    "levelId": "lvl-4",
    "lessonNumber": 5,
    "title": "Ôn tập & Phản xạ hội thoại kết bạn",
    "chineseTitle": "第十三章复习与社交情景实战",
    "subtitle": "Tổng hợp kỹ năng giao tiếp kết bạn và mẫu câu tạo ấn tượng.",
    "objective": "Hoàn thiện phản xạ giao tiếp xã hội và cấu trúc 给...留下深刻印象.",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-13"
    ],
    "step1_learn": {
      "topic": "Ôn tập & Phản xạ hội thoại kết bạn - Trọng tâm HSK 4",
      "summary": "Tổng hợp kỹ năng giao tiếp kết bạn và mẫu câu tạo ấn tượng.",
      "keyTakeaways": [
        "Hoàn thiện phản xạ giao tiếp xã hội và cấu trúc 给...留下深刻印象.",
        "Làm chủ điểm ngữ pháp: 给……留下深刻的印象 (Để lại ấn tượng sâu sắc cho...)"
      ],
      "audioDemoText": "他不仅工作认真，而且性格特别幽默。"
    },
    "step2_vocabulary": [
      {
        "id": "v-405-1",
        "hanzi": "交流",
        "pinyin": "jiāoliú",
        "hanviet": "Giao lưu",
        "meaning": "Giao lưu, trao đổi",
        "radical": "Bộ 亠",
        "example": {
          "hanzi": "多交流能提高口语。",
          "pinyin": "Duō jiāoliú néng tígāo kǒuyǔ.",
          "meaning": "Giao lưu nhiều giúp nâng cao khẩu ngữ."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-405-2",
        "hanzi": "印象",
        "pinyin": "yìnxiàng",
        "hanviet": "Ấn tượng",
        "meaning": "Ấn tượng",
        "radical": "Bộ 卩",
        "example": {
          "hanzi": "他对我的第一印象很好。",
          "pinyin": "Tā duì wǒ de dì-yī yìnxiàng hěn hǎo.",
          "meaning": "Anh ấy có ấn tượng đầu tiên rất tốt về tôi."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-405-3",
        "hanzi": "性格",
        "pinyin": "xìnggé",
        "hanviet": "Tính cách",
        "meaning": "Tính cách",
        "radical": "Bộ 忄",
        "example": {
          "hanzi": "她的性格很活泼。",
          "pinyin": "Tā de xìnggé hěn huópo.",
          "meaning": "Tính cách cô ấy rất hoạt bát."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-405-4",
        "hanzi": "幽默",
        "pinyin": "yōumò",
        "hanviet": "U mặc",
        "meaning": "Hài hước, hóm hỉnh",
        "radical": "Bộ 幺",
        "example": {
          "hanzi": "王老师说话很幽默。",
          "pinyin": "Wáng lǎoshī shuōhuà hěn yōumò.",
          "meaning": "Thầy Vương nói chuyện rất hài hước."
        },
        "pos": "Tính từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "印",
        "hanzi": "印",
        "pinyin": "yìn",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰𠂉卩",
        "radical": {
          "char": "卩",
          "name": "Tiết",
          "strokes": 2
        },
        "meaning": "In dấu, ấn tượng, con dấu",
        "strokesCount": 5,
        "strokeOrderText": "Phẩy -> Ngang (𠂉) -> Ngang gập móc -> Sổ (卩)",
        "components": [
          "𠂉",
          "卩"
        ],
        "mnemonic": "Bàn tay cầm con dấu (卩) đóng mạnh lên giấy khắc sâu dấu tích: ấn tượng (印象)."
      },
      {
        "char": "格",
        "hanzi": "格",
        "pinyin": "gé",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰木各",
        "radical": {
          "char": "木",
          "name": "Mộc",
          "strokes": 4
        },
        "meaning": "Khuôn khổ, phẩm cách, tiêu chuẩn",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Mộc 木 (4 nét) -> Chữ Các 各 (6 nét)",
        "components": [
          "木",
          "各"
        ],
        "mnemonic": "Từng khúc gỗ (木) đều có phẩm chất và tiêu chuẩn riêng biệt (各): tính cách (性格), hợp cách (合格)."
      }
    ],
    "step4_grammar": {
      "formula": "给……留下深刻的印象 (Để lại ấn tượng sâu sắc cho...)",
      "title": "Cấu trúc diễn đạt ấn tượng",
      "explanation": "Chủ thể tạo ấn tượng + 给 + Người tiếp nhận + 留下深刻的印象.",
      "examples": [
        {
          "hanzi": "这部电影给我留下了深刻的印象。",
          "pinyin": "Zhè bù diànyǐng gěi wǒ liúxià le shēnkè de yìnxiàng.",
          "meaning": "Bộ phim này để lại ấn tượng sâu sắc cho tôi."
        }
      ],
      "commonMistake": {
        "wrong": "我留下了很深的印象北京。",
        "correct": "北京给我留下了很深的印象。",
        "explanation": "Chủ thể tạo ấn tượng đứng trước 给."
      }
    },
    "step5_listening": {
      "situation": "Tổng kết kỹ năng giao tiếp, phân tích tính cách và tạo ấn tượng ban đầu",
      "context": "Buổi chia sẻ kinh nghiệm thích ứng văn hóa và giao tiếp công việc",
      "participants": "A: Chị Mỹ Hạnh (Trưởng nhóm nhân sự), B: Tuấn Kiệt (Thực tập sinh)",
      "targetGoal": "Vận dụng cụm từ 给……留下深刻的印象 để miêu tả ấn tượng giao tiếp tích cực",
      "usageNotes": "\"幽默\" (hài hước) là đức tính được đánh giá cao trong văn hóa giao tiếp công sở hiện đại, giúp hóa giải không khí căng thẳng.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "俊杰，今天在跨部门交流会上，你的发言给大家留下了非常深刻的印象！",
          "pinyin": "Jùnjié, jīntiān zài kuà bùmén jiāoliú huì shang, nǐ de fāyán gěi dàjiā liúxià le fēicháng shēnkè de yìnxiàng!",
          "meaning": "Tuấn Kiệt, hôm nay trong buổi họp giao lưu liên bộ phận, bài phát biểu của em đã để lại ấn tượng vô cùng sâu sắc cho mọi người!"
        },
        {
          "speaker": "B",
          "hanzi": "真的吗？谢谢主管！一开始我还挺紧张的，后来试着用幽默的开场白化解了尴尬。",
          "pinyin": "Zhēn de ma? Xièxie zhǔguǎn! Yì kāishǐ wǒ hái tǐng jǐnzhāng de, hòulái shì zhe yòng yōumò de kāichǎngbái huàjiě le gāngà.",
          "meaning": "Thật vậy ạ? Em cảm ơn quản lý! Ban đầu em cũng khá run, sau đó đã thử dùng lời mở đầu hài hước để xóa tan sự ngượng ngùng."
        },
        {
          "speaker": "A",
          "hanzi": "你的性格开朗大方，表达思路也很清晰，这种优秀的沟通能力很难得。",
          "pinyin": "Nǐ de xìnggé kāilǎng dàfang, biǎodá sīlù yě hěn qīngxī, zhè zhǒng yōuxiù de gōutōng nénglì hěn nándé.",
          "meaning": "Tính cách của em cởi mở phóng khoáng, tư duy diễn đạt cũng rất mạch lạc, năng lực giao tiếp xuất sắc thế này rất đáng quý."
        },
        {
          "speaker": "B",
          "hanzi": "我平时经常看中文脱口秀和商务案例，学到了不少实用的表达方式。",
          "pinyin": "Wǒ píngshí jīngcháng kàn Zhōngwén tuōkǒuxiù hé shāngwù ànlì, xué dào le bùshǎo shíyòng de biǎodá fāngshì.",
          "meaning": "Bình thường em thường xuyên xem talkshow tiếng Trung và các tình huống thương mại, nên học được không ít cách biểu đạt thực tế."
        },
        {
          "speaker": "A",
          "hanzi": "很好！继续保持，下周对客户的提案演示就由你来主讲吧。",
          "pinyin": "Hěn hǎo! Jìxù bǎochí, xià zhōu duì kèhù de tí'àn yǎnshì jiù yóu nǐ lái zhǔjiǎng ba.",
          "meaning": "Rất tốt! Hãy tiếp tục duy trì nhé, tuần tới buổi thuyết trình phương án cho khách hàng giao cho em chủ trì."
        }
      ],
      "audioText": "俊杰，今天在跨部门交流会上，你的发言给大家留下了非常深刻的印象！真的吗？谢谢主管！一开始我还挺紧张的，后来试着用幽默的开场白化解了尴尬。你的性格开朗大方，表达思路也很清晰，这种优秀的沟通能力很难得。我平时经常看中文脱口秀和商务案例，学到了不少实用的表达方式。很好！继续保持，下周对客户的提案演示就由你来主讲吧。",
      "question": "Điều gì đã giúp Tuấn Kiệt để lại ấn tượng tốt trong buổi họp?",
      "options": [
        "Nói chuyện thì thầm không ai nghe thấy",
        "Tính cách cởi mở, dùng sự hài hước và diễn đạt mạch lạc (开朗幽默，表达清晰)",
        "Không tham gia phát biểu",
        "Đến muộn buổi họp"
      ],
      "correctIndex": 1,
      "explanation": "Trưởng nhóm nhận xét bạn có tính cách cởi mở, lời mở đầu hài hước và tư duy diễn đạt mạch lạc để lại ấn tượng sâu sắc."
    },
    "step6_speaking": {
      "prompt": "Khen ngợi tính cách bạn bè:",
      "targetSentence": "他性格开朗，说话很幽默。",
      "targetPinyin": "Tā xìnggé kāilǎng, shuōhuà hěn yōumò.",
      "targetMeaning": "Anh ấy tính cách cởi mở, nói chuyện rất hài hước.",
      "hint": "Ngắt giọng rõ ràng sau kāilǎng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Thầy giáo để lại ấn tượng sâu sắc cho tôi'",
      "words": [
        "深刻的印象",
        "老师",
        "留下了",
        "给我"
      ],
      "correctOrder": [
        "老师",
        "给我",
        "留下了",
        "深刻的印象"
      ],
      "explanation": "Chủ ngữ + 给我 + 留下了 + 深刻的印象."
    },
    "step8_quiz": [
      {
        "id": "q-405-1",
        "type": "multiple-choice",
        "question": "Từ nào miêu tả người hay pha trò khiến người khác cười vui vẻ?",
        "options": [
          "严格",
          "幽默",
          "内向",
          "害羞"
        ],
        "correctIndex": 1,
        "explanation": "幽默 (hài hước)."
      },
      {
        "id": "q-405-2",
        "type": "multiple-choice",
        "question": "Điền từ: '北京的历史文化给游客留下了____的印象。'",
        "options": [
          "深刻",
          "严格",
          "马虎",
          "着急"
        ],
        "correctIndex": 0,
        "explanation": "深刻的印象 (ấn tượng sâu sắc)."
      }
    ],
    "step9_challenge": {
      "title": "Tổng kết Chương 13",
      "taskDesc": "Viết đoạn văn ngắn 50 chữ mô tả người bạn Trung Quốc của bạn.",
      "targetPhrase": "shēnkè de yìnxiàng",
      "xpReward": 60,
      "badge": "Hoàn Thành Chương 13"
    }
  },
  {
    "id": "l-406",
    "chapterId": "ch-14",
    "levelId": "lvl-4",
    "lessonNumber": 1,
    "title": "Đặt phòng khách sạn online & Loại phòng",
    "chineseTitle": "网上预订酒店与房型选择",
    "subtitle": "Tra cứu thông tin phòng, đặt phòng khách sạn trực tuyến và hỏi tiện ích.",
    "objective": "Làm chủ từ vựng về khách sạn: 预订, 标准间, 押金 và liên từ 无论……都……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-14"
    ],
    "step1_learn": {
      "topic": "Đặt phòng khách sạn online & Loại phòng - Trọng tâm HSK 4",
      "summary": "Tra cứu thông tin phòng, đặt phòng khách sạn trực tuyến và hỏi tiện ích.",
      "keyTakeaways": [
        "Làm chủ từ vựng về khách sạn: 预订, 标准间, 押金 và liên từ 无论……都……",
        "Làm chủ điểm ngữ pháp: 无论……都…… (Bất luận / Dù cho... đều...)"
      ],
      "audioDemoText": "好的，请出示护照，并交三百元押金。"
    },
    "step2_vocabulary": [
      {
        "id": "v-406-1",
        "hanzi": "预订",
        "pinyin": "yùdìng",
        "hanviet": "Dự đính",
        "meaning": "Đặt trước (phòng, vé)",
        "radical": "Bộ 言",
        "example": {
          "hanzi": "我在网上预订了一间大床房。",
          "pinyin": "Wǒ zài wǎngshang yùdìng le yì jiān dàchuángfáng.",
          "meaning": "Tôi đã đặt trước một phòng giường lớn trên mạng."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-406-2",
        "hanzi": "标准间",
        "pinyin": "biāozhǔnjiān",
        "hanviet": "Tiêu chuẩn gian",
        "meaning": "Phòng tiêu chuẩn (2 giường đơn)",
        "radical": "Bộ 木",
        "example": {
          "hanzi": "请问标准间一晚多少钱？",
          "pinyin": "Qǐngwèn biāozhǔnjiān yì wǎn duōshao qián?",
          "meaning": "Xin hỏi phòng tiêu chuẩn một đêm bao nhiêu tiền?"
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-406-3",
        "hanzi": "押金",
        "pinyin": "yājīn",
        "hanviet": "Áp kim",
        "meaning": "Tiền đặt cọc",
        "radical": "Bộ 金",
        "example": {
          "hanzi": "入住需要交五百块押金。",
          "pinyin": "Rùzhù xūyào jiāo wǔbǎi kuài yājīn.",
          "meaning": "Nhận phòng cần nộp 500 tệ tiền cọc."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-406-4",
        "hanzi": "免费",
        "pinyin": "miǎnfèi",
        "hanviet": "Miễn phí",
        "meaning": "Miễn phí",
        "radical": "Bộ 免",
        "example": {
          "hanzi": "酒店提供免费早餐和无线网络。",
          "pinyin": "Jiǔdiàn tígōng miǎnfèi zǎocān hé wúxiàn wǎngluò.",
          "meaning": "Khách sạn cung cấp bữa sáng và Wi-Fi miễn phí."
        },
        "pos": "Tính từ / Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "订",
        "hanzi": "订",
        "pinyin": "dìng",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰讠丁",
        "radical": {
          "char": "讠",
          "name": "Ngôn",
          "strokes": 2
        },
        "meaning": "Đặt trước, ký kết, đính chính",
        "strokesCount": 4,
        "strokeOrderText": "Chấm -> Hất (讠) -> Ngang -> Sổ móc (丁)",
        "components": [
          "讠",
          "丁"
        ],
        "mnemonic": "Lời nói (讠) cam kết chắc nịch như đóng đinh (丁): đặt phòng (订房), đặt cọc (定金)."
      },
      {
        "char": "标",
        "hanzi": "标",
        "pinyin": "biāo",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰木示",
        "radical": {
          "char": "木",
          "name": "Mộc",
          "strokes": 4
        },
        "meaning": "Tiêu chuẩn, ngọn cây, ký hiệu",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Mộc 木 (4 nét) -> Bộ Thị 示 (5 nét)",
        "components": [
          "木",
          "示"
        ],
        "mnemonic": "Dựng cột gỗ (木) làm biển chỉ dẫn biểu thị (示) cột mốc: tiêu chuẩn (标准)."
      }
    ],
    "step4_grammar": {
      "formula": "无论……都…… (Bất luận / Dù cho... đều...)",
      "title": "Cấu trúc liên từ điều kiện vô điều kiện",
      "explanation": "Biểu thị trong bất kỳ điều kiện nào thì kết quả cũng không thay đổi.",
      "examples": [
        {
          "hanzi": "无论遇到什么困难，我们都要坚持下去。",
          "pinyin": "Wúlùn yùdào shénme kùnnan, wǒmen dōu yào jiānchí xiàqù.",
          "meaning": "Bất luận gặp khó khăn gì, chúng ta đều phải kiên trì."
        }
      ],
      "commonMistake": {
        "wrong": "无论你去，我也去。",
        "correct": "无论你去不去，我都去。",
        "explanation": "Phía sau 无论 thường có đại từ nghi vấn hoặc phương án lựa chọn."
      }
    },
    "step5_listening": {
      "situation": "Đặt phòng khách sạn online và tư vấn các loại phòng (Standard / Suite)",
      "context": "Khách hàng gọi điện đến tổng đài khách sạn 5 sao tại Thành Đô để hỏi thủ tục giữ phòng",
      "participants": "A: Nhân viên chăm sóc khách hàng khách sạn, B: Doanh nhân đặt phòng",
      "targetGoal": "Vận dụng cấu trúc 无论……都…… và từ vựng chuyên ngành lưu trú (标准间, 套房, 定金, 免费)",
      "usageNotes": "\"标准间\" thường viết tắt là \"标间\" (phòng 2 giường đơn), còn \"套房\" là phòng suite có phòng khách riêng.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "您好，锦江大酒店预订部，请问有什么可以为您效劳？",
          "pinyin": "Nín hǎo, Jǐnjiāng Dàjiǔdiàn yùdìngbù, qǐngwèn yǒu shénme kěyǐ wèi nín xiàoláo?",
          "meaning": "Xin chào quý khách, bộ phận đặt phòng khách sạn Cẩm Giang, xin hỏi tôi có thể giúp gì cho quý khách?"
        },
        {
          "speaker": "B",
          "hanzi": "你好，我们公司下周要去成都出差，想了解一下商务套房和标准间的区别。",
          "pinyin": "Nǐ hǎo, wǒmen gōngsī xià zhōu yào qù Chéngdū chūchāi, xiǎng liǎojiě yíxià shāngwù tàofáng hé biāozhǔnjiān de qūbié.",
          "meaning": "Chào cô, công ty chúng tôi tuần tới đi công tác Thành Đô, muốn tìm hiểu sự khác biệt giữa phòng suite thương gia và phòng tiêu chuẩn."
        },
        {
          "speaker": "A",
          "hanzi": "无论您选择哪种房型，我们都会提供免费的双人早餐和健身房服务。套房面积更大，并配有独立的会客室。",
          "pinyin": "Wúlùn nín xuǎnzé nǎ zhǒng fángxíng, wǒmen dōu huì tígōng miǎnfèi de shuāngrén zǎocān hé jiànshēnfáng fúwù. Tàofáng miànjī gèng dà, bìng pèiyǒu dúlì de huìkèshì.",
          "meaning": "Bất luận quý khách chọn loại phòng nào, chúng tôi đều cung cấp bữa sáng miễn phí cho 2 người và dịch vụ phòng gym. Phòng suite diện tích rộng hơn và có phòng tiếp khách riêng biệt."
        },
        {
          "speaker": "B",
          "hanzi": "太好了，我们需要接待重要客户，那就预订两间商务套房吧。需要先交定金吗？",
          "pinyin": "Tài hǎo le, wǒmen xūyào jiēdài zhòngyào kèhù, nà jiù yùdìng liǎng jiān shāngwù tàofáng ba. Xūyào xiān jiāo dìngjīn ma?",
          "meaning": "Tuyệt quá, chúng tôi cần tiếp khách hàng quan trọng, vậy đặt 2 phòng suite thương gia nhé. Có cần đặt cọc trước không?"
        },
        {
          "speaker": "A",
          "hanzi": "是的，先生。请在今天下午六点前在线支付两百元定金即可为您保留房间。",
          "pinyin": "Shì de, xiānsheng. Qǐng zài jīntiān xiàwǔ liù diǎn qián zàixiàn zhīfù liǎngbǎi yuán dìngjīn jíkě wèi nín bǎoliú fángjiān.",
          "meaning": "Dạ có thưa quý khách. Xin quý khách thanh toán trực tuyến 200 tệ tiền cọc trước 6 giờ chiều nay là giữ phòng thành công."
        }
      ],
      "audioText": "您好，锦江大酒店预订部，请问有什么可以为您效劳？你好，我们公司下周要去成都出差，想了解一下商务套房和标准间的区别。无论您选择哪种房型，我们都会提供免费的双人早餐和健身房服务。套房面积更大，并配有独立的会客室。太好了，我们需要接待重要客户，那就预订两间商务套房吧。需要先交定金吗？是的，先生。请在今天下午六点前在线支付两百元定金即可为您保留房间。",
      "question": "Khách hàng quyết định đặt loại phòng nào sau khi được tư vấn?",
      "options": [
        "Hai phòng tiêu chuẩn (标准间)",
        "Hai phòng suite thương gia (两间商务套房)",
        "Một phòng đơn giá rẻ",
        "Hủy kế hoạch đặt phòng"
      ],
      "correctIndex": 1,
      "explanation": "Khách hàng nói: \"我们需要接待重要客户，那就预订两间商务套房吧\" (Chúng tôi cần tiếp khách quan trọng, vậy đặt 2 phòng suite thương gia nhé)."
    },
    "step6_speaking": {
      "prompt": "Hỏi về bữa sáng miễn phí:",
      "targetSentence": "酒店提供免费早餐吗？",
      "targetPinyin": "Jiǔdiàn tígōng miǎnfèi zǎocān ma?",
      "targetMeaning": "Khách sạn có cung cấp bữa sáng miễn phí không?",
      "hint": "Hỏi với ngữ điệu lễ phép."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Dù bận thế nào anh ấy cũng tập thể dục'",
      "words": [
        "无论",
        "多忙",
        "他都",
        "坚持锻炼"
      ],
      "correctOrder": [
        "无论",
        "多忙",
        "他都",
        "坚持锻炼"
      ],
      "explanation": "Cấu trúc 无论...都..."
    },
    "step8_quiz": [
      {
        "id": "q-406-1",
        "type": "multiple-choice",
        "question": "Phòng có 2 giường đơn trong khách sạn gọi là gì?",
        "options": [
          "大床房",
          "标准间 (标间)",
          "套房",
          "钟点房"
        ],
        "correctIndex": 1,
        "explanation": "标准间 là phòng tiêu chuẩn 2 giường đơn."
      },
      {
        "id": "q-406-2",
        "type": "multiple-choice",
        "question": "Điền từ: '____天气怎么样，比赛____会照常进行。'",
        "options": [
          "虽然...但是...",
          "无论...都...",
          "因为...所以...",
          "只要...才..."
        ],
        "correctIndex": 1,
        "explanation": "Vô điều kiện dùng 无论...都..."
      }
    ],
    "step9_challenge": {
      "title": "Đặt phòng khách sạn",
      "taskDesc": "Ghi âm hội thoại đặt phòng tiêu chuẩn 2 đêm có bữa sáng.",
      "targetPhrase": "yùdìng biāozhǔnjiān",
      "xpReward": 60,
      "badge": "Lữ Khách Tự Túc"
    }
  },
  {
    "id": "l-407",
    "chapterId": "ch-14",
    "levelId": "lvl-4",
    "lessonNumber": 2,
    "title": "Thủ tục nhận phòng & Trả phòng",
    "chineseTitle": "办理入住与退房手续",
    "subtitle": "Cách giao tiếp tại quầy lễ tân: Check-in, lấy thẻ phòng và gửi hành lý.",
    "objective": "Nắm vững các thuật ngữ: 办理, 手续, 房卡, 退房 và cấu trúc 连……也/都……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-14"
    ],
    "step1_learn": {
      "topic": "Thủ tục nhận phòng & Trả phòng - Trọng tâm HSK 4",
      "summary": "Cách giao tiếp tại quầy lễ tân: Check-in, lấy thẻ phòng và gửi hành lý.",
      "keyTakeaways": [
        "Nắm vững các thuật ngữ: 办理, 手续, 房卡, 退房 và cấu trúc 连……也/都……",
        "Làm chủ điểm ngữ pháp: 连……也/都…… (Ngay cả... cũng...)"
      ],
      "audioDemoText": "押金会原路退回到您的微信账户，请稍等。"
    },
    "step2_vocabulary": [
      {
        "id": "v-407-1",
        "hanzi": "办理",
        "pinyin": "bànlǐ",
        "hanviet": "Biện lý",
        "meaning": "Làm thủ tục, giải quyết",
        "radical": "Bộ 力",
        "example": {
          "hanzi": "请问在哪里办理入住？",
          "pinyin": "Qǐngwèn zài nǎlǐ bànlǐ rùzhù?",
          "meaning": "Xin hỏi làm thủ tục nhận phòng ở đâu?"
        },
        "pos": "Động từ"
      },
      {
        "id": "v-407-2",
        "hanzi": "手续",
        "pinyin": "shǒuxù",
        "hanviet": "Thủ tục",
        "meaning": "Thủ tục",
        "radical": "Bộ 手",
        "example": {
          "hanzi": "入住手续很快就办好了。",
          "pinyin": "Rùzhù shǒuxù hěn kuài jiù bàn hǎo le.",
          "meaning": "Thủ tục nhận phòng rất nhanh đã làm xong."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-407-3",
        "hanzi": "房卡",
        "pinyin": "fángkǎ",
        "hanviet": "Phòng tạp",
        "meaning": "Thẻ phòng",
        "radical": "Bộ 户",
        "example": {
          "hanzi": "这是您的房卡，房间在八楼。",
          "pinyin": "Zhè shì nín de fángkǎ, fángjiān zài bā lóu.",
          "meaning": "Đây là thẻ phòng của quý khách, phòng ở tầng 8."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-407-4",
        "hanzi": "退房",
        "pinyin": "tuìfáng",
        "hanviet": "Thoái phòng",
        "meaning": "Trả phòng",
        "radical": "Bộ 辶",
        "example": {
          "hanzi": "请在中午十二点以前退房。",
          "pinyin": "Qǐng zài zhōngwǔ shí'èr diǎn yǐqián tuìfáng.",
          "meaning": "Xin vui lòng trả phòng trước 12 giờ trưa."
        },
        "pos": "Cụm động tân"
      }
    ],
    "step3_hanzi": [
      {
        "char": "办",
        "hanzi": "办",
        "pinyin": "bàn",
        "structure": {
          "code": "left_mid_right",
          "name": "Tả trung hữu (左中右结构)",
          "symbol": "⿲"
        },
        "ids": "⿲丿力丶",
        "radical": {
          "char": "力",
          "name": "Lực",
          "strokes": 2
        },
        "meaning": "Biện lý, giải quyết, làm thủ tục",
        "strokesCount": 4,
        "strokeOrderText": "Ngang gập móc -> Phẩy (力) -> Phẩy (trái) -> Chấm (phải)",
        "components": [
          "力",
          "丿",
          "丶"
        ],
        "mnemonic": "Dốc sức lực (力) từ hai phía trái phải để hoàn tất công việc: giải quyết, biện pháp (办法, 办理)."
      },
      {
        "char": "卡",
        "hanzi": "卡",
        "pinyin": "kǎ",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱上卜",
        "radical": {
          "char": "卜",
          "name": "Bặc",
          "strokes": 2
        },
        "meaning": "Thẻ từ, thẻ ngân hàng, kẹt lại",
        "strokesCount": 5,
        "strokeOrderText": "Sổ -> Ngang -> Ngang (上) -> Sổ -> Chấm (卜)",
        "components": [
          "上",
          "卜"
        ],
        "mnemonic": "Không lên (上) cũng không xuống (卜) kẹt lại ở giữa: thẻ phòng (房卡), thẻ ngân hàng (卡片)."
      }
    ],
    "step4_grammar": {
      "formula": "连……也/都…… (Ngay cả... cũng...)",
      "title": "Cấu trúc nhấn mạnh trường hợp cực đoan",
      "explanation": "Dùng để nhấn mạnh một sự việc hiển nhiên hoặc cực đoan nhằm làm nổi bật ý.",
      "examples": [
        {
          "hanzi": "这个问题太难了，连老师都不知道答案。",
          "pinyin": "Zhè gè wèntí tài nán le, lián lǎoshī dōu bù zhīdào dá'àn.",
          "meaning": "Câu hỏi này khó quá, ngay cả thầy giáo cũng không biết đáp án."
        }
      ],
      "commonMistake": {
        "wrong": "他连昨天没来。",
        "correct": "他连昨天都没来。",
        "explanation": "Sau thành phần nhấn mạnh phải có 也 hoặc 都."
      }
    },
    "step5_listening": {
      "situation": "Thủ tục nhận phòng tại quầy lễ tân và kết toán thanh toán",
      "context": "Tại sảnh lễ tân khách sạn lúc 14:00 trưa",
      "participants": "A: Nhân viên lễ tân khách sạn, B: Khách lưu trú",
      "targetGoal": "Thực hành cấu trúc nhấn mạnh 连……也/都…… và thao tác thủ tục lưu trú (办理手续, 房卡, 结账)",
      "usageNotes": "\"办理手续\" (làm thủ tục) là cụm động tân cao cấp thường xuất hiện trong môi trường sân bay, khách sạn và hải quan.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "下午好，先生，请问是办理入住手续吗？请出示一下您的证件。",
          "pinyin": "Xiàwǔ hǎo, xiānsheng, qǐngwèn shì bànlǐ rùzhù shǒuxù ma? Qǐng chūshì yíxià nín de zhèngjiàn.",
          "meaning": "Chào buổi chiều quý khách, xin hỏi anh làm thủ tục nhận phòng phải không ạ? Xin vui lòng xuất trình giấy tờ tùy thân của anh."
        },
        {
          "speaker": "B",
          "hanzi": "你好，这是我的护照。我刚才在路上堵车，连午饭都没顾得上吃。",
          "pinyin": "Nǐ hǎo, zhè shì wǒ de hùzhào. Wǒ gāngcái zài lù shang dǔchē, lián wǔfàn dōu méi gùdeshàng chī.",
          "meaning": "Chào cô, đây là hộ chiếu của tôi. Vừa nãy đi trên đường bị tắc xe, ngay cả cơm trưa tôi cũng chưa kịp ăn nữa."
        },
        {
          "speaker": "A",
          "hanzi": "辛苦您了！入住手续已经办好了，这是您的房卡，房间在八楼808。酒店二楼有二十四小时自助餐厅。",
          "pinyin": "Xīnkǔ nín le! Rùzhù shǒuxù yǐjīng bàn hǎo le, zhè shì nín de fángkǎ, fángjiān zài bālóu bālíngbā. Jiǔdiàn èrlóu yǒu èrshísì xiǎoshí zìzhù cāntīng.",
          "meaning": "Vất vả cho anh quá! Thủ tục nhận phòng đã hoàn tất rồi ạ, đây là thẻ phòng của anh, phòng ở tầng 8 phòng 808. Tầng 2 khách sạn có nhà hàng buffet 24 giờ."
        },
        {
          "speaker": "B",
          "hanzi": "太贴心了！请问明天退房结账最晚是几点呢？",
          "pinyin": "Tài tiēxīn le! Qǐngwèn míngtiān tuìfáng jiézhàng zuìwǎn shì jǐdiǎn ne?",
          "meaning": "Chu đáo quá! Xin hỏi ngày mai trả phòng thanh toán muộn nhất là mấy giờ vậy cô?"
        },
        {
          "speaker": "A",
          "hanzi": "正常退房时间是中午十二点前，如果您需要延迟结账，可以随时通知前台。",
          "pinyin": "Zhèngcháng tuìfáng shíjiān shì zhōngwǔ shí'èr diǎn qián, rúguǒ nín xūyào yánchí jiézhàng, kěyǐ suíshí tōngzhī qiántái.",
          "meaning": "Giờ trả phòng bình thường là trước 12 giờ trưa, nếu anh cần lùi giờ thanh toán có thể báo trước quầy lễ tân bất cứ lúc nào ạ."
        }
      ],
      "audioText": "下午好，先生，请问是办理入住手续吗？请出示一下您的证件。你好，这是我的护照。我刚才在路上堵车，连午饭都没顾得上吃。辛苦您了！入住手续已经办好了，这是您的房卡，房间在八楼808。酒店二楼有二十四小时自助餐厅。太贴心了！请问明天退房结账最晚是几点呢？正常退房时间是中午十二点前，如果您需要延迟结账，可以随时通知前台。",
      "question": "Thời gian trả phòng bình thường của khách sạn là khi nào?",
      "options": [
        "Trước 9 giờ sáng",
        "Trước 12 giờ trưa (中午十二点前)",
        "Trước 6 giờ tối",
        "Bất kỳ lúc nào không cần báo"
      ],
      "correctIndex": 1,
      "explanation": "Lễ tân thông báo rõ: \"正常退房时间是中午十二点前\" (Thời gian trả phòng bình thường là trước 12 giờ trưa)."
    },
    "step6_speaking": {
      "prompt": "Nhắc nhở thời gian trả phòng:",
      "targetSentence": "退房时间是中午十二点。",
      "targetPinyin": "Tuìfáng shíjiān shì zhōngwǔ shí'èr diǎn.",
      "targetMeaning": "Thời gian trả phòng là 12 giờ trưa.",
      "hint": "Phát âm chuẩn tuìfáng shíjiān."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Ngay cả đứa trẻ 3 tuổi cũng biết điều này'",
      "words": [
        "连三岁的小孩",
        "都",
        "知道",
        "这件事"
      ],
      "correctOrder": [
        "这件事",
        "连三岁的小孩",
        "都",
        "知道"
      ],
      "explanation": "Cấu trúc 连...都..."
    },
    "step8_quiz": [
      {
        "id": "q-407-1",
        "type": "multiple-choice",
        "question": "Trước khi rời khách sạn bạn phải làm thủ tục gì?",
        "options": [
          "入住手续",
          "退房手续",
          "登机手续",
          "开户手续"
        ],
        "correctIndex": 1,
        "explanation": "Rời khách sạn là 退房手续 (trả phòng)."
      },
      {
        "id": "q-407-2",
        "type": "multiple-choice",
        "question": "Điền từ: '他太累了，____饭____不想吃。'",
        "options": [
          "连...都...",
          "虽然...但...",
          "不仅...而且...",
          "如果...就..."
        ],
        "correctIndex": 0,
        "explanation": "Nhấn mạnh cực đoan: 连...都/也..."
      }
    ],
    "step9_challenge": {
      "title": "Thủ tục khách sạn",
      "taskDesc": "Mô phỏng cuộc đối thoại trả phòng tại quầy lễ tân.",
      "targetPhrase": "bànlǐ tuìfáng",
      "xpReward": 60,
      "badge": "Thành Thạo Check-out"
    }
  },
  {
    "id": "l-408",
    "chapterId": "ch-14",
    "levelId": "lvl-4",
    "lessonNumber": 3,
    "title": "Đổi ngoại tệ & Rút tiền tại ATM",
    "chineseTitle": "货币兑换与银行提现",
    "subtitle": "Hỏi tỷ giá hối đoái, đổi tiền mặt tại ngân hàng và sử dụng cây ATM.",
    "objective": "Sử dụng từ vựng tài chính: 兑换, 汇率, 现金, 手续费 và giới từ 按照……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-14"
    ],
    "step1_learn": {
      "topic": "Đổi ngoại tệ & Rút tiền tại ATM - Trọng tâm HSK 4",
      "summary": "Hỏi tỷ giá hối đoái, đổi tiền mặt tại ngân hàng và sử dụng cây ATM.",
      "keyTakeaways": [
        "Sử dụng từ vựng tài chính: 兑换, 汇率, 现金, 手续费 và giới từ 按照……",
        "Làm chủ điểm ngữ pháp: 按照…… (Căn cứ vào... / Theo như...)"
      ],
      "audioDemoText": "不需要，我们直接按照今日牌价结算。"
    },
    "step2_vocabulary": [
      {
        "id": "v-408-1",
        "hanzi": "兑换",
        "pinyin": "duìhuàn",
        "hanviet": "Đoái hoán",
        "meaning": "Đổi (tiền tệ)",
        "radical": "Bộ 儿",
        "example": {
          "hanzi": "请问这里可以兑换人民币吗？",
          "pinyin": "Qǐngwèn zhèlǐ kěyǐ duìhuàn rénmínbì ma?",
          "meaning": "Xin hỏi ở đây có thể đổi Nhân dân tệ không?"
        },
        "pos": "Động từ"
      },
      {
        "id": "v-408-2",
        "hanzi": "汇率",
        "pinyin": "huìlǜ",
        "hanviet": "Hối suất",
        "meaning": "Tỷ giá hối đoái",
        "radical": "Bộ 氵",
        "example": {
          "hanzi": "今天的美元兑人民币汇率是多少？",
          "pinyin": "Jīntiān de měiyuán duì rénmínbì huìlǜ shì duōshao?",
          "meaning": "Tỷ giá USD đổi NDT hôm nay là bao nhiêu?"
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-408-3",
        "hanzi": "现金",
        "pinyin": "xiànjīn",
        "hanviet": "Hiện kim",
        "meaning": "Tiền mặt",
        "radical": "Bộ 王",
        "example": {
          "hanzi": "我身上没有带多少现金。",
          "pinyin": "Wǒ shēnshang méiyǒu dài duōshao xiànjīn.",
          "meaning": "Trên người tôi không mang theo nhiều tiền mặt."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-408-4",
        "hanzi": "手续费",
        "pinyin": "shǒuxùfèi",
        "hanviet": "Thủ tục phí",
        "meaning": "Phí dịch vụ, phí chuyển đổi",
        "radical": "Bộ 手",
        "example": {
          "hanzi": "跨行取款需要收手续费。",
          "pinyin": "Kuà háng qǔkuǎn xūyào shōu shǒuxùfèi.",
          "meaning": "Rút tiền khác ngân hàng cần thu phí dịch vụ."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "兑",
        "hanzi": "兑",
        "pinyin": "duì",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱丷兄",
        "radical": {
          "char": "儿",
          "name": "Nhi",
          "strokes": 2
        },
        "meaning": "Chuyển đổi, đổi tiền tệ",
        "strokesCount": 7,
        "strokeOrderText": "Chấm -> Phẩy (丷) -> Khẩu 口 (3 nét) -> Phẩy -> Cong móc (儿)",
        "components": [
          "丷",
          "口",
          "儿"
        ],
        "mnemonic": "Miệng (口) người anh (兄) tươi cười khi hoán đổi ngân tệ sòng phẳng: quy đổi (兑换)."
      },
      {
        "char": "率",
        "hanzi": "率",
        "pinyin": "lǜ",
        "structure": {
          "code": "top_mid_bottom",
          "name": "Thượng trung hạ (上中下结构)",
          "symbol": "⿳"
        },
        "ids": "⿳亠玄十",
        "radical": {
          "char": "玄",
          "name": "Huyền",
          "strokes": 5
        },
        "meaning": "Tỷ suất, tỷ lệ, dẫn dắt",
        "strokesCount": 11,
        "strokeOrderText": "Bộ Đầu 亠 -> Phần Huyền 玄 biến thể -> Bộ Thập 十",
        "components": [
          "亠",
          "玄",
          "十"
        ],
        "mnemonic": "Đo lường mối tương quan sâu kín (玄) đạt mức độ trọn mười (十): tỷ giá (汇率)."
      }
    ],
    "step4_grammar": {
      "formula": "按照…… (Căn cứ vào... / Theo như...)",
      "title": "Giới từ chỉ căn cứ, tiêu chuẩn",
      "explanation": "Dùng '按照 + Tiêu chuẩn / Quy định' đặt trước động từ chỉ hành động tuân thủ.",
      "examples": [
        {
          "hanzi": "银行按照当天的汇率为您兑换外币。",
          "pinyin": "Yínháng ànzhào dāngtiān de huìlǜ wèi nín duìhuàn wàibì.",
          "meaning": "Ngân hàng căn cứ theo tỷ giá hôm nay để đổi ngoại tệ cho quý khách."
        }
      ],
      "commonMistake": {
        "wrong": "我们按照规则做。",
        "correct": "我们要按照规则办事。",
        "explanation": "Cần có bổ ngữ hoặc tân ngữ hoàn chỉnh sau động từ."
      }
    },
    "step5_listening": {
      "situation": "Đổi ngoại tệ tại quầy giao dịch ngân hàng và tra cứu tỷ giá hối đoái",
      "context": "Tại chi nhánh Ngân hàng Trung Quốc (Bank of China) ở Bắc Kinh",
      "participants": "A: Nhân viên giao dịch ngân hàng, B: Khách hàng nước ngoài đổi tiền",
      "targetGoal": "Thực hành cấu trúc 按照…… (căn cứ vào / theo như) và nghiệp vụ tiền tệ (兑换, 汇率, 提款, 手续费)",
      "usageNotes": "\"外币兑换\" (đổi ngoại tệ) tại ngân hàng Trung Quốc bắt buộc phải xuất trình hộ chiếu bản gốc và điền phiếu xác nhận giao dịch.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "您好，请问您今天办理什么业务？",
          "pinyin": "Nín hǎo, qǐngwèn nín jīntiān bànlǐ shénme yèwù?",
          "meaning": "Xin chào quý khách, xin hỏi hôm nay anh làm thủ tục giao dịch gì ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "你好，我想把一千美元兑换成人民币，请问今天的实时汇率是多少？",
          "pinyin": "Nǐ hǎo, wǒ xiǎng bǎ yìqiān měiyuán duìhuàn chéng rénmínbì, qǐngwèn jīntiān de shíshí huìlǜ shì duōshao?",
          "meaning": "Chào chị, tôi muốn đổi 1000 USD sang đồng Nhân dân tệ, xin hỏi tỷ giá thời gian thực hôm nay là bao nhiêu?"
        },
        {
          "speaker": "A",
          "hanzi": "按照今天的牌价，一美元兑换七点二元人民币。请出示您的护照原件。",
          "pinyin": "Ànzhào jīntiān de páijià, yì měiyuán duìhuàn qī diǎn èr yuán rénmínbì. Qǐng chūshì nín de hùzhào yuánjiàn.",
          "meaning": "Theo như bảng giá niêm yết hôm nay, 1 USD đổi được 7.2 Nhân dân tệ. Xin vui lòng xuất trình hộ chiếu gốc của anh."
        },
        {
          "speaker": "B",
          "hanzi": "好的，护照给您。另外请问如果我直接用国际银行卡提款，手续费怎么算？",
          "pinyin": "Hǎo de, hùzhào gěi nín. Lìngwài qǐngwèn rúguǒ wǒ zhíjiē yòng guójì yínhángkǎ tíkuǎn, shǒuxùfèi zěnme suàn?",
          "meaning": "Vâng, hộ chiếu gửi chị. Ngoài ra xin hỏi nếu tôi rút tiền trực tiếp bằng thẻ ngân hàng quốc tế thì phí dịch vụ tính thế nào?"
        },
        {
          "speaker": "A",
          "hanzi": "在ATM机提款每笔收取百分之一的手续费。柜台兑换已经为您办妥，请在这里签字确认。",
          "pinyin": "Zài ATM jī tíkuǎn měi bǐ shōuqǔ bǎifēnzhīyī de shǒuxùfèi. Guìtái duìhuàn yǐjīng wèi nín bàntuǒ, qǐng zài zhèlǐ qiānzì quèrèn.",
          "meaning": "Rút tiền tại cây ATM mỗi giao dịch thu 1% phí dịch vụ. Giao dịch đổi tiền tại quầy đã hoàn tất cho anh rồi ạ, xin vui lòng ký xác nhận tại đây."
        }
      ],
      "audioText": "您好，请问您今天办理什么业务？你好，我想把一千美元兑换成人民币，请问今天的实时汇率是多少？按照今天的牌价，一美元兑换七点二元人民币。请出示您的护照原件。好的，护照给您。另外请问如果我直接用国际银行卡提款，手续费怎么算？在ATM机提款每笔收取百分之一的手续费。柜台兑换已经为您办妥，请在这里签字确认。",
      "question": "Tỷ giá quy đổi hôm nay là bao nhiêu Nhân dân tệ cho 1 USD?",
      "options": [
        "6.5 tệ",
        "7.0 tệ",
        "7.2 tệ (七点二元)",
        "8.0 tệ"
      ],
      "correctIndex": 2,
      "explanation": "Giao dịch viên thông báo: \"按照今天的牌价，一美元兑换七点二元人民币\" (Theo bảng giá hôm nay, 1 USD đổi 7.2 Nhân dân tệ)."
    },
    "step6_speaking": {
      "prompt": "Xin tiền lẻ:",
      "targetSentence": "请给我一些零钱现金。",
      "targetPinyin": "Qǐng gěi wǒ yìxiē língqián xiànjīn.",
      "targetMeaning": "Xin đổi cho tôi ít tiền mặt mệnh giá nhỏ.",
      "hint": "Phát âm chuẩn língqián xiànjīn."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Mọi người phải làm việc theo quy định'",
      "words": [
        "按照",
        "规定",
        "大家要",
        "办事"
      ],
      "correctOrder": [
        "大家要",
        "按照",
        "规定",
        "办事"
      ],
      "explanation": "Cấu trúc 按照 + Quy định + Làm việc."
    },
    "step8_quiz": [
      {
        "id": "q-408-1",
        "type": "multiple-choice",
        "question": "Từ nào chỉ tỷ giá trao đổi giữa hai loại tiền tệ?",
        "options": [
          "利率 (Lãi suất)",
          "汇率 (Tỷ giá)",
          "效率 (Hiệu suất)",
          "概率 (Xác suất)"
        ],
        "correctIndex": 1,
        "explanation": "汇率 (huìlǜ) là tỷ giá hối đoái."
      },
      {
        "id": "q-408-2",
        "type": "multiple-choice",
        "question": "Điền từ: '请____医生的建议按时服药。'",
        "options": [
          "按照",
          "既然",
          "不仅",
          "无论"
        ],
        "correctIndex": 0,
        "explanation": "Theo như lời khuyên của bác sĩ dùng 按照."
      }
    ],
    "step9_challenge": {
      "title": "Đổi ngoại tệ",
      "taskDesc": "Luyện nói câu hỏi tỷ giá và đổi tiền tại quầy ngân hàng.",
      "targetPhrase": "duìhuàn rénmínbì",
      "xpReward": 60,
      "badge": "Quản Lý Tài Chính"
    }
  },
  {
    "id": "l-409",
    "chapterId": "ch-14",
    "levelId": "lvl-4",
    "lessonNumber": 4,
    "title": "Thuê xe du lịch & Hỏi đường tham quan",
    "chineseTitle": "租车出行与旅游咨询",
    "subtitle": "Hỏi thủ tục thuê xe tự lái, lộ trình ngắm cảnh và giá vé tham quan.",
    "objective": "Nắm vững từ vựng du lịch: 租车, 路线, 门票, 导游 và cấu trúc 既……又……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-14"
    ],
    "step1_learn": {
      "topic": "Thuê xe du lịch & Hỏi đường tham quan - Trọng tâm HSK 4",
      "summary": "Hỏi thủ tục thuê xe tự lái, lộ trình ngắm cảnh và giá vé tham quan.",
      "keyTakeaways": [
        "Nắm vững từ vựng du lịch: 租车, 路线, 门票, 导游 và cấu trúc 既……又……",
        "Làm chủ điểm ngữ pháp: 既……又…… (Vừa... lại vừa...)"
      ],
      "audioDemoText": "每天两百元，既便宜又省心。"
    },
    "step2_vocabulary": [
      {
        "id": "v-409-1",
        "hanzi": "租车",
        "pinyin": "zūchē",
        "hanviet": "Tô xa",
        "meaning": "Thuê xe",
        "radical": "Bộ 禾",
        "example": {
          "hanzi": "在当地租车自驾非常方便。",
          "pinyin": "Zài dāngdì zūchē zìjià fēicháng fāngbiàn.",
          "meaning": "Thuê xe tự lái ở địa phương rất thuận tiện."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-409-2",
        "hanzi": "路线",
        "pinyin": "lùxiàn",
        "hanviet": "Lộ tuyến",
        "meaning": "Tuyến đường, lộ trình",
        "radical": "Bộ 纟",
        "example": {
          "hanzi": "请问去故宫的最佳路线是什么？",
          "pinyin": "Qǐngwèn qù Gùgōng de zuì jiā lùxiàn shì shénme?",
          "meaning": "Xin hỏi lộ trình tốt nhất đến Cố Cung là gì?"
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-409-3",
        "hanzi": "门票",
        "pinyin": "ménpiào",
        "hanviet": "Môn phiếu",
        "meaning": "Vé vào cửa",
        "radical": "Bộ 门",
        "example": {
          "hanzi": "景区的门票可以在网上提前购买。",
          "pinyin": "Jǐngqū de ménpiào kěyǐ zài wǎngshang tíqián gòumǎi.",
          "meaning": "Vé vào cổng danh lam có thể mua trước trên mạng."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-409-4",
        "hanzi": "导游",
        "pinyin": "dǎoyóu",
        "hanviet": "Đạo du",
        "meaning": "Hướng dẫn viên du lịch",
        "radical": "Bộ 寸",
        "example": {
          "hanzi": "这位导游讲解得生动有趣。",
          "pinyin": "Zhè wèi dǎoyóu jiǎngjiě de shēngdòng yǒuqù.",
          "meaning": "Người hướng dẫn viên này thuyết minh rất sinh động thú vị."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "租",
        "hanzi": "租",
        "pinyin": "zū",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰禾且",
        "radical": {
          "char": "禾",
          "name": "Hòa",
          "strokes": 5
        },
        "meaning": "Thuê mướn, địa tô, hoa lợi",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Hòa 禾 (5 nét) -> Chữ Thư/Thả 且 (5 nét)",
        "components": [
          "禾",
          "且"
        ],
        "mnemonic": "Đem lúa thóc (禾) trả tiền thuê mướn mảnh đất màu mỡ (且): thuê xe (租车), thuê nhà (租房)."
      },
      {
        "char": "导",
        "hanzi": "导",
        "pinyin": "dǎo",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱巳寸",
        "radical": {
          "char": "寸",
          "name": "Thốn",
          "strokes": 3
        },
        "meaning": "Dẫn dắt, chỉ đường, hướng dẫn",
        "strokesCount": 6,
        "strokeOrderText": "Bộ Tị 巳 (3 nét) -> Bộ Thốn 寸 (3 nét)",
        "components": [
          "巳",
          "寸"
        ],
        "mnemonic": "Bàn tay (寸) dẫn dắt em nhỏ (巳) đi đúng hướng trên đường: hướng dẫn viên (导游)."
      }
    ],
    "step4_grammar": {
      "formula": "既……又…… (Vừa... lại vừa...)",
      "title": "Cấu trúc liên từ đẳng lập song song",
      "explanation": "Dùng để nối hai tính chất hoặc hành động cùng tồn tại tích cực hoặc tiêu cực.",
      "examples": [
        {
          "hanzi": "坐高铁既快捷又安全。",
          "pinyin": "Zuò gāotiě jì kuàijié yòu ānquán.",
          "meaning": "Đi tàu cao tốc vừa nhanh chóng lại vừa an toàn."
        }
      ],
      "commonMistake": {
        "wrong": "他既高也帅。",
        "correct": "他既高又帅。",
        "explanation": "Cặp từ chuẩn là 既……又……, không dùng 既……也……"
      }
    },
    "step5_listening": {
      "situation": "Thuê xe du lịch tự lái và tham khảo lộ trình danh lam thắng cảnh",
      "context": "Tại công ty cho thuê xe du lịch ở thành phố Côn Minh",
      "participants": "A: Nhân viên công ty cho thuê xe, B: Du khách tự lái",
      "targetGoal": "Vận dụng cấu trúc 既……又…… (vừa... lại vừa...) để đánh giá lộ trình du lịch (租车, 路线, 门票, 导游)",
      "usageNotes": "\"租车自驾\" (thuê xe tự lái) là hình thức du lịch rất thịnh hành. Người nước ngoài cần bằng lái xe hợp lệ được Trung Quốc công nhận.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "先生您好，欢迎咨询自驾游服务！请问您打算租哪种车型，走哪条旅游路线呢？",
          "pinyin": "Xiānsheng nín hǎo, huānyíng zīxún zìjiàyóu fúwù! Qǐngwèn nín dǎsuàn zū nǎ zhǒng chēxíng, zǒu nǎ tiáo lǚyóu lùxiàn ne?",
          "meaning": "Chào anh, chào mừng anh đến tư vấn dịch vụ du lịch tự lái! Xin hỏi anh dự định thuê dòng xe nào và đi theo lộ trình du lịch nào ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "我们打算去大理和丽江，想要一辆空间大一些的SUV，既坐着舒适，又方便放行李。",
          "pinyin": "Wǒmen dǎsuàn qù Dàlǐ hé Lìjiāng, xiǎng yào yí liàng kōngjiān dà yìxiē de SUV, jì zuò zhe shūshì, yòu fāngbiàn fàng xíngli.",
          "meaning": "Chúng tôi dự định đi Đại Lý và Lệ Giang, muốn một chiếc SUV không gian rộng rãi một chút, vừa ngồi thoải mái lại vừa tiện để hành lý."
        },
        {
          "speaker": "A",
          "hanzi": "这条路线风景如画，我们这台越野车动力充足，还自带最新的GPS智能导航。",
          "pinyin": "Zhè tiáo lùxiàn fēngjǐng rú huà, wǒmen zhè tái yuèyěchē dònglì chōngzú, hái zìdài zuìxīn de GPS zhìnéng dǎoháng.",
          "meaning": "Tuyến đường này phong cảnh đẹp như tranh, chiếc xe địa hình này động cơ mạnh mẽ lại tích hợp định vị GPS thông minh mới nhất."
        },
        {
          "speaker": "B",
          "hanzi": "太棒了！景区的门票需要提前购买吗？有没有必要请一位当地的导游？",
          "pinyin": "Tài bàng le! Jǐngqū de ménpiào xūyào tíqián gòumǎi ma? Yǒu méiyǒu bìyào qǐng yí wèi dāngdì de dǎoyóu?",
          "meaning": "Tuyệt vời! Vé vào cổng các danh thắng có cần mua trước không? Có cần thiết thuê một hướng dẫn viên địa phương không?"
        },
        {
          "speaker": "A",
          "hanzi": "旺季门票建议提前在官方APP预约，如果您想深入了解纳西族历史，请导游会更有收获。",
          "pinyin": "Wàngjì ménpiào jiànyì tíqián zài guānfāng APP yùyuē, rúguǒ nín xiǎng shēnrù liǎojiě Nàxīzú lìshǐ, qǐng dǎoyóu huì gèng yǒu shōuhuò.",
          "meaning": "Mùa cao điểm vé vào cổng nên đặt trước qua ứng dụng chính thức, nếu anh muốn tìm hiểu sâu lịch sử dân tộc Nạp Tây thì thuê hướng dẫn viên sẽ thu hoạch được nhiều hơn."
        }
      ],
      "audioText": "先生您好，欢迎咨询自驾游服务！请问您打算租哪种车型，走哪条旅游路线呢？我们打算去大理和丽江，想要一辆空间大一些的SUV，既坐着舒适，又方便放行李。这条路线风景如画，我们这台越野车动力充足，还自带最新的GPS智能导航。太棒了！景区的门票需要提前购买吗？有没有必要请一位当地的导游？旺季门票建议提前在官方APP预约，如果您想深入了解纳西族历史，请导游会更有收获。",
      "question": "Vì sao du khách lại muốn thuê chiếc xe SUV không gian lớn?",
      "options": [
        "Vì xe rẻ nhất",
        "Vừa ngồi thoải mái vừa tiện để hành lý (既坐着舒适，又方便放行李)",
        "Vì không biết lái xe nhỏ",
        "Để đua xe trên đường"
      ],
      "correctIndex": 1,
      "explanation": "Du khách giải thích: \"想要一辆空间大一些的SUV，既坐着舒适，又方便放行李\" (Muốn một chiếc SUV rộng, vừa ngồi thoải mái vừa tiện để hành lý)."
    },
    "step6_speaking": {
      "prompt": "Khen tàu cao tốc:",
      "targetSentence": "坐高铁既方便又舒适。",
      "targetPinyin": "Zuò gāotiě jì fāngbiàn yòu shūshì.",
      "targetMeaning": "Đi tàu cao tốc vừa tiện lợi vừa dễ chịu.",
      "hint": "Phát âm rõ ràng jì... yòu..."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Món ăn này vừa ngon vừa rẻ'",
      "words": [
        "又便宜",
        "这道菜",
        "好吃",
        "既"
      ],
      "correctOrder": [
        "这道菜",
        "既",
        "好吃",
        "又便宜"
      ],
      "explanation": "Cấu trúc 既...又..."
    },
    "step8_quiz": [
      {
        "id": "q-409-1",
        "type": "multiple-choice",
        "question": "Người dẫn đường và giới thiệu thắng cảnh cho du khách gọi là gì?",
        "options": [
          "司机 (Tài xế)",
          "导游 (Hướng dẫn viên)",
          "经理 (Giám đốc)",
          "服务员 (Phục vụ)"
        ],
        "correctIndex": 1,
        "explanation": "导游 (dǎoyóu) là hướng dẫn viên."
      },
      {
        "id": "q-409-2",
        "type": "multiple-choice",
        "question": "Điền từ: '这里的风景____优美，环境____安静。'",
        "options": [
          "既...又...",
          "虽然...但...",
          "不仅...反而...",
          "因为...所以..."
        ],
        "correctIndex": 0,
        "explanation": "Đẳng lập hai đặc tính tốt dùng 既...又..."
      }
    ],
    "step9_challenge": {
      "title": "Hỏi đường thuê xe",
      "taskDesc": "Thực hành hỏi thuê xe du lịch và lộ trình tham quan.",
      "targetPhrase": "jì fāngbiàn yòu ānquán",
      "xpReward": 60,
      "badge": "Hướng Dẫn Viên Du Lịch"
    }
  },
  {
    "id": "l-410",
    "chapterId": "ch-14",
    "levelId": "lvl-4",
    "lessonNumber": 5,
    "title": "Xử lý sự cố khi du lịch & Mất đồ",
    "chineseTitle": "旅行突发情况与失物招领",
    "subtitle": "Cách ứng phó khi để quên đồ, mất hộ chiếu và báo cơ quan chức năng.",
    "objective": "Nắm vững từ vựng khẩn cấp: 丢失, 护照, 报警, 解决 và phó từ 千万……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-14"
    ],
    "step1_learn": {
      "topic": "Xử lý sự cố khi du lịch & Mất đồ - Trọng tâm HSK 4",
      "summary": "Cách ứng phó khi để quên đồ, mất hộ chiếu và báo cơ quan chức năng.",
      "keyTakeaways": [
        "Nắm vững từ vựng khẩn cấp: 丢失, 护照, 报警, 解决 và phó từ 千万……",
        "Làm chủ điểm ngữ pháp: 千万…… (Tuyệt đối / Nhất thiết phải...)"
      ],
      "audioDemoText": "别慌，记得出租车的车牌号吗？我们帮你查。"
    },
    "step2_vocabulary": [
      {
        "id": "v-410-1",
        "hanzi": "丢失",
        "pinyin": "diūshī",
        "hanviet": "Đâu thất",
        "meaning": "Đánh mất, thất lạc",
        "radical": "Bộ 大",
        "example": {
          "hanzi": "我不小心把钱包丢失了。",
          "pinyin": "Wǒ bù xiǎoxīn bǎ qiánbāo diūshī le.",
          "meaning": "Tôi sơ ý đánh mất ví tiền rồi."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-410-2",
        "hanzi": "护照",
        "pinyin": "hùzhào",
        "hanviet": "Hộ chiếu",
        "meaning": "Hộ chiếu",
        "radical": "Bộ 扌",
        "example": {
          "hanzi": "出门在外一定要保管好护照。",
          "pinyin": "Chūmén zàiwài yídìng yào bǎoguǎn hǎo hùzhào.",
          "meaning": "Khi đi xa nhất định phải giữ gìn cẩn thận hộ chiếu."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-410-3",
        "hanzi": "报警",
        "pinyin": "bàojǐng",
        "hanviet": "Báo cảnh",
        "meaning": "Báo cảnh sát",
        "radical": "Bộ 言",
        "example": {
          "hanzi": "遇到紧急情况请马上报警。",
          "pinyin": "Yùdào jǐnjí qíngkuàng qǐng mǎshàng bàojǐng.",
          "meaning": "Gặp tình huống khẩn cấp xin hãy báo cảnh sát ngay."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-410-4",
        "hanzi": "解决",
        "pinyin": "jiějué",
        "hanviet": "Giải quyết",
        "meaning": "Giải quyết (vấn đề)",
        "radical": "Bộ 角",
        "example": {
          "hanzi": "不用担心，这个问题一定能解决。",
          "pinyin": "Bú yòng dānxīn, zhè gè wèntí yídìng néng jiějué.",
          "meaning": "Đừng lo lắng, vấn đề này nhất định giải quyết được."
        },
        "pos": "Động từ / Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "丢",
        "hanzi": "丢",
        "pinyin": "diū",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱丿去",
        "radical": {
          "char": "丿",
          "name": "Phẩy",
          "strokes": 1
        },
        "meaning": "Đánh mất, ném bỏ, thất lạc",
        "strokesCount": 6,
        "strokeOrderText": "Phẩy (丿) -> Ngang -> Sổ -> Ngang -> Phẩy gập -> Chấm (去)",
        "components": [
          "丿",
          "去"
        ],
        "mnemonic": "Một nét phẩy (丿) rơi mất khi bước đi (去): đánh mất giấy tờ (丢失)."
      },
      {
        "char": "警",
        "hanzi": "警",
        "pinyin": "jǐng",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱敬言",
        "radical": {
          "char": "言",
          "name": "Ngôn",
          "strokes": 7
        },
        "meaning": "Cảnh sát, cảnh báo, cảnh giác",
        "strokesCount": 19,
        "strokeOrderText": "Chữ Kính 敬 (12 nét) -> Bộ Ngôn 言 (7 nét)",
        "components": [
          "敬",
          "言"
        ],
        "mnemonic": "Dùng lời lẽ (言) nghiêm trang tôn kính (敬) để răn đe giữ gìn trật tự: cảnh sát (报警, 警察)."
      }
    ],
    "step4_grammar": {
      "formula": "千万…… (Tuyệt đối / Nhất thiết phải...)",
      "title": "Phó từ nhấn mạnh lời răn đe, khuyên nhủ",
      "explanation": "Thường dùng trong câu phủ định '千万别……' hoặc '千万不要……' để dặn dò tha thiết.",
      "examples": [
        {
          "hanzi": "出门旅行千万不要把贵重物品放在显眼处。",
          "pinyin": "Chūmén lǚxíng qiānwàn bú yào bǎ guìzhòng wùpǐn fàng zài xiǎnyǎn chù.",
          "meaning": "Đi du lịch tuyệt đối đừng để đồ quý giá ở chỗ dễ thấy."
        }
      ],
      "commonMistake": {
        "wrong": "你千万来。",
        "correct": "你千万要来啊！",
        "explanation": "Trong câu khẳng định thường đi cùng 要 và trợ từ ngữ khí 啊."
      }
    },
    "step5_listening": {
      "situation": "Xử lý sự cố thất lạc ba lô túi xách khi du lịch và báo cảnh sát ga",
      "context": "Tại đồn công an ga tàu hỏa Tây Bắc Kinh lúc 20:30 tối",
      "participants": "A: Cảnh sát trực ban đồn công an, B: Du khách bị mất đồ",
      "targetGoal": "Vận dụng phó từ nhấn mạnh 千万…… (tuyệt đối / nhất thiết) trong tình huống khẩn cấp (丢失, 证件, 报警, 协助)",
      "usageNotes": "\"千万别慌\" (tuyệt đối đừng hoảng) là cách trấn an phổ biến. Khi mất giấy tờ tại Trung Quốc, biên bản báo án của cảnh sát là căn cứ để xin cấp lại visa.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "请坐，千万别着急，慢慢讲，发生什么事情了？",
          "pinyin": "Qǐng zuò, qiānwàn bié zháojí, mànmàn jiǎng, fāshēng shénme shìqing le?",
          "meaning": "Xin mời ngồi, bạn tuyệt đối đừng vội cuống, bình tĩnh kể lại xem có chuyện gì đã xảy ra?"
        },
        {
          "speaker": "B",
          "hanzi": "警官你好，我刚才在候车大厅不小心丢失了黑色背包，里面的护照和证件全没了！",
          "pinyin": "Jǐngguān nǐ hǎo, wǒ gāngcái zài hòuchē dàtīng bù xiǎoxīn diūshī le hēisè bēibāo, lǐmiàn de hùzhào hé zhèngjiàn quán méi le!",
          "meaning": "Chào anh cảnh sát, vừa nãy ở sảnh chờ tàu tôi sơ ý làm rơi mất chiếc ba lô màu đen, hộ chiếu và toàn bộ giấy tờ bên trong mất hết rồi!"
        },
        {
          "speaker": "A",
          "hanzi": "千万记住包里最特别的特征，比如有什么标志，里面大概有什么贵重物品？",
          "pinyin": "Qiānwàn jìzhù bāo lǐ zuì tèbié de tèzhēng, bǐrú yǒu shénme biāozhì, lǐmiàn dàgài yǒu shénme guìzhòng wùpǐn?",
          "meaning": "Bạn hãy cố gắng nhớ đặc điểm đặc biệt nhất của chiếc ba lô, ví dụ có dấu hiệu gì, bên trong đại khái có những đồ vật quý giá nào?"
        },
        {
          "speaker": "B",
          "hanzi": "背包上有个绿色的挂件，里面有一台笔记本电脑和钱包，希望警察同志能协助查找！",
          "pinyin": "Bēibāo shang yǒu gè lǜsè de guàjiàn, lǐmiàn yǒu yì tái bǐjìběn diànnǎo hé qiánbāo, xīwàng jǐngchá tóngzhì néng xiézhù cházhǎo!",
          "meaning": "Trên ba lô có gắn một chiếc móc khóa màu xanh lá, bên trong có một máy tính xách tay và ví tiền, hy vọng các đồng chí cảnh sát hỗ trợ tìm kiếm!"
        },
        {
          "speaker": "A",
          "hanzi": "好的，我们马上调取大厅的高清监控录像，并通知广播站协助寻找，你先登记信息。",
          "pinyin": "Hǎo de, wǒmen mǎshàng diàoqǔ dàtīng de gāoqīng jiānkòng lùxiàng, bìng tōngzhī guǎngbōzhàn xiézhù xúnzhǎo, nǐ xiān dēngjì xìnxī.",
          "meaning": "Được rồi, chúng tôi sẽ trích xuất camera giám sát độ nét cao ở sảnh ngay lập tức, đồng thời thông báo trạm phát thanh hỗ trợ tìm kiếm, bạn hãy đăng ký thông tin trước."
        }
      ],
      "audioText": "请坐，千万别着急，慢慢讲，发生什么事情了？警官你好，我刚才在候车大厅不小心丢失了黑色背包，里面的护照和证件全没了！千万记住包里最特别的特征，比如有什么标志，里面大概有什么贵重物品？背包上有个绿色的挂件，里面有一台笔记本电脑和钱包，希望警察同志能协助查找！好的，我们马上调取大厅的高清监控录像，并通知广播站协助寻找，你先登记信息。",
      "question": "Chiếc ba lô bị thất lạc có đặc điểm nhận dạng nổi bật nào?",
      "options": [
        "Chiếc túi màu đỏ rực rỡ",
        "Ba lô màu đen có móc khóa màu xanh lá (黑色背包，有绿色挂件)",
        "Chiếc vali kéo màu bạc",
        "Túi vải không có dấu hiệu gì"
      ],
      "correctIndex": 1,
      "explanation": "Du khách miêu tả: \"不小心丢失了黑色背包... 背包上有个绿色的挂件\" (Sơ ý mất ba lô đen... trên ba lô có móc khóa xanh lá)."
    },
    "step6_speaking": {
      "prompt": "Khuyên nhủ đi xa:",
      "targetSentence": "出门在外，千万要注意安全。",
      "targetPinyin": "Chūmén zàiwài, qiānwàn yào zhùyì ānquán.",
      "targetMeaning": "Đi ra ngoài, nhất định phải chú ý an toàn.",
      "hint": "Nhấn mạnh từ qiānwàn."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Bạn tuyệt đối đừng quên mang hộ chiếu nhé'",
      "words": [
        "千万别",
        "带护照",
        "忘了",
        "你"
      ],
      "correctOrder": [
        "你",
        "千万别",
        "忘了",
        "带护照"
      ],
      "explanation": "Cấu trúc 千万别 + V."
    },
    "step8_quiz": [
      {
        "id": "q-410-1",
        "type": "multiple-choice",
        "question": "Khi bị mất đồ quý giá ở nước ngoài, nơi cần tìm kiếm sự giúp đỡ đầu tiên là gì?",
        "options": [
          "警察局 (Đồn cảnh sát)",
          "电影院 (Rạp phim)",
          "理发店 (Tiệm cắt tóc)",
          "超市 (Siêu thị)"
        ],
        "correctIndex": 0,
        "explanation": "警察局 là nơi hỗ trợ báo án."
      },
      {
        "id": "q-410-2",
        "type": "multiple-choice",
        "question": "Điền từ: '这件事情很重要，你____要准时参加。'",
        "options": [
          "千万",
          "难道",
          "究竟",
          "忽然"
        ],
        "correctIndex": 0,
        "explanation": "Dặn dò nhấn mạnh dùng 千万."
      }
    ],
    "step9_challenge": {
      "title": "Xử lý tình huống",
      "taskDesc": "Mô phỏng trình báo rơi hộ chiếu tại đồn cảnh sát.",
      "targetPhrase": "qiānwàn zhùyì ānquán",
      "xpReward": 60,
      "badge": "Chuyên Gia Ứng Biến"
    }
  },
  {
    "id": "l-411",
    "chapterId": "ch-15",
    "levelId": "lvl-4",
    "lessonNumber": 1,
    "title": "Quy chuẩn nghe gọi điện thoại công sở",
    "chineseTitle": "职场商务通话规范",
    "subtitle": "Mẫu câu chào hỏi, xưng danh, chuyển máy và để lại lời nhắn qua điện thoại.",
    "objective": "Sử dụng thành thạo từ ngữ công sở: 转接, 稍等, 留言, 找哪位 và cấu trúc 请问……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-15"
    ],
    "step1_learn": {
      "topic": "Quy chuẩn nghe gọi điện thoại công sở - Trọng tâm HSK 4",
      "summary": "Mẫu câu chào hỏi, xưng danh, chuyển máy và để lại lời nhắn qua điện thoại.",
      "keyTakeaways": [
        "Sử dụng thành thạo từ ngữ công sở: 转接, 稍等, 留言, 找哪位 và cấu trúc 请问……",
        "Làm chủ điểm ngữ pháp: 请问…… (Xin hỏi / Cho hỏi...)"
      ],
      "audioDemoText": "您好，请帮我转接市场部王经理。"
    },
    "step2_vocabulary": [
      {
        "id": "v-411-1",
        "hanzi": "转接",
        "pinyin": "zhuǎnjiē",
        "hanviet": "Chuyển tiếp",
        "meaning": "Chuyển máy (điện thoại)",
        "radical": "Bộ 车",
        "example": {
          "hanzi": "请帮我转接一下李经理。",
          "pinyin": "Qǐng bāng wǒ zhuǎnjiē yíxià Lǐ jīnglǐ.",
          "meaning": "Xin giúp tôi chuyển máy tới Giám đốc Lý."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-411-2",
        "hanzi": "稍等",
        "pinyin": "shāoděng",
        "hanviet": "Sảo đẳng",
        "meaning": "Đợi một chút",
        "radical": "Bộ 禾",
        "example": {
          "hanzi": "好的，请您稍等，我为您转接。",
          "pinyin": "Hǎo de, qǐng nín shāoděng, wǒ wèi nín zhuǎnjiē.",
          "meaning": "Vâng, xin đợi một chút, tôi chuyển máy cho quý khách."
        },
        "pos": "Phó từ / Cụm động từ"
      },
      {
        "id": "v-411-3",
        "hanzi": "留言",
        "pinyin": "liúyán",
        "hanviet": "Lưu ngôn",
        "meaning": "Để lại lời nhắn",
        "radical": "Bộ 田",
        "example": {
          "hanzi": "他现在不在，需要给他留言吗？",
          "pinyin": "Tā xiànzài búzài, xūyào gěi tā liúyán ma?",
          "meaning": "Hiện tại anh ấy không có ở đây, có cần để lại lời nhắn không?"
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-411-4",
        "hanzi": "打扰",
        "pinyin": "dǎrǎo",
        "hanviet": "Đả nhiễu",
        "meaning": "Làm phiền",
        "radical": "Bộ 扌",
        "example": {
          "hanzi": "不好意思，打扰您休息了。",
          "pinyin": "Bù hǎoyìsi, dǎrǎo nín xiūxi le.",
          "meaning": "Thật ngại quá, làm phiền quý khách nghỉ ngơi rồi."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "稍",
        "hanzi": "稍",
        "pinyin": "shāo",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰禾肖",
        "radical": {
          "char": "禾",
          "name": "Hòa",
          "strokes": 5
        },
        "meaning": "Một chút, hơi hơi, đợi chút",
        "strokesCount": 12,
        "strokeOrderText": "Bộ Hòa 禾 (5 nét) -> Chữ Tiêu 肖 (7 nét)",
        "components": [
          "禾",
          "肖"
        ],
        "mnemonic": "Chỉ xin một nhánh lúa nhỏ (禾) mỏng manh (肖): xin đợi một chút (稍等)."
      },
      {
        "char": "留",
        "hanzi": "留",
        "pinyin": "liú",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱卯田",
        "radical": {
          "char": "田",
          "name": "Điền",
          "strokes": 5
        },
        "meaning": "Lưu lại, để lại, giữ lại",
        "strokesCount": 10,
        "strokeOrderText": "Phần Mão 卯 (5 nét) -> Bộ Điền 田 (5 nét)",
        "components": [
          "卯",
          "田"
        ],
        "mnemonic": "Ở lại canh giữ ruộng vườn (田) qua giờ Mão (卯): để lại lời nhắn (留言), lưu học sinh (留学生)."
      }
    ],
    "step4_grammar": {
      "formula": "请问…… (Xin hỏi / Cho hỏi...)",
      "title": "Mẫu câu mở đầu lịch sự trong đàm thoại",
      "explanation": "Dùng ở đầu câu để thể hiện sự lễ phép khi muốn dò hỏi thông tin qua điện thoại.",
      "examples": [
        {
          "hanzi": "请问张总在办公室吗？",
          "pinyin": "Qǐngwèn Zhāng zǒng zài bàngōngshì ma?",
          "meaning": "Xin hỏi Tổng giám đốc Trương có ở văn phòng không?"
        }
      ],
      "commonMistake": {
        "wrong": "问你张总在吗？",
        "correct": "请问张总在吗？",
        "explanation": "Phải thêm 请问 để bảo đảm văn phong công sở."
      }
    },
    "step5_listening": {
      "situation": "Quy chuẩn nghe gọi điện thoại văn phòng và chuyển máy đối tác lịch sự",
      "context": "Tại bàn làm việc phòng hành chính tổng hợp của công ty liên doanh",
      "participants": "A: Lễ tân công ty Minh Hoa, B: Đối tác gọi điện thoại đến",
      "targetGoal": "Thực hành ngôn ngữ điện thoại chuẩn mực (转接, 稍等, 留言, 打扰)",
      "usageNotes": "\"请问您哪位？\" (Xin hỏi quý danh của anh là?) và \"请稍等，我帮您转接\" (Xin đợi một chút, tôi chuyển máy giúp anh) là mẫu câu chuẩn mực nhất khi tiếp điện thoại.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "您好，明华科技，请问有什么可以帮您？",
          "pinyin": "Nín hǎo, Mínghuá Kējì, qǐngwèn yǒu shénme kěyǐ bāng nín?",
          "meaning": "Xin chào, Công nghệ Minh Hoa xin nghe, xin hỏi tôi có thể giúp gì cho quý khách?"
        },
        {
          "speaker": "B",
          "hanzi": "你好，不好意思打扰了。我想找一下市场部的陈经理，请问他在吗？",
          "pinyin": "Nǐ hǎo, bù hǎoyìsi dǎrǎo le. Wǒ xiǎng zhǎo yíxià shìchǎngbù de Chén jīnglǐ, qǐngwèn tā zài ma?",
          "meaning": "Chào cô, xin lỗi vì đã làm phiền. Tôi muốn gặp giám đốc Trần bên phòng Marketing, xin hỏi anh ấy có ở đó không?"
        },
        {
          "speaker": "A",
          "hanzi": "请问您怎么称呼？我这就帮您转接他的分机，请稍等。",
          "pinyin": "Qǐngwèn nín zěnme chēnghu? Wǒ zhè jiù bāng nín zhuǎnjiē tā de fēnjī, qǐng shāoděng.",
          "meaning": "Xin hỏi tôi có thể xưng hô với anh thế nào ạ? Tôi chuyển máy vào số máy nhánh của anh ấy cho anh ngay, xin đợi một chút."
        },
        {
          "speaker": "B",
          "hanzi": "我是越华贸易公司的李总，之前和他约好沟通合作项目的。",
          "pinyin": "Wǒ shì Yuèhuá Màoyì Gōngsī de Lǐ zǒng, zhīqián hé tā yuē hǎo gōutōng hézuò xiàngmù de.",
          "meaning": "Tôi là giám đốc Lý bên Công ty Thương mại Việt Hoa, trước đó đã hẹn với anh ấy để trao đổi về dự án hợp tác."
        },
        {
          "speaker": "A",
          "hanzi": "李总，陈经理正在主持会议。如果您有紧急事项，可以先留言，会议结束后我立刻让他回电给您。",
          "pinyin": "Lǐ zǒng, Chén jīnglǐ zhèngzài zhǔchí huìyì. Rúguǒ nín yǒu jǐnjí shìxiàng, kěyǐ xiān liúyán, huìyì jiéshù hòu wǒ lìkè ràng tā huídiàn gěi nín.",
          "meaning": "Giám đốc Lý, giám đốc Trần đang chủ trì cuộc họp ạ. Nếu anh có việc gấp có thể để lại lời nhắn, sau khi họp xong tôi sẽ báo anh ấy gọi lại cho anh ngay."
        }
      ],
      "audioText": "您好，明华科技，请问有什么可以帮您？你好，不好意思打扰了。我想找一下市场部的陈经理，请问他在吗？请问您怎么称呼？我这就帮您转接他的分机，请稍等。我是越华贸易公司的李总，之前和他约好沟通合作项目的。李总，陈经理正在主持会议。如果您有紧急事项，可以先留言，会议结束后我立刻让他回电给您。",
      "question": "Vì sao lễ tân không thể nối máy cho giám đốc Trần ngay lúc này?",
      "options": [
        "Giám đốc Trần đã tan làm về nhà",
        "Giám đốc Trần đang chủ trì cuộc họp (正在主持会议)",
        "Máy nhánh bị hỏng",
        "Không tìm thấy số điện thoại"
      ],
      "correctIndex": 1,
      "explanation": "Lễ tân giải thích: \"陈经理正在主持会议\" (Giám đốc Trần đang chủ trì cuộc họp) và đề xuất để lại lời nhắn."
    },
    "step6_speaking": {
      "prompt": "Nhận cuộc gọi lịch sự:",
      "targetSentence": "您好，请稍等，马上为您转接。",
      "targetPinyin": "Nín hǎo, qǐng shāoděng, mǎshàng wèi nín zhuǎnjiē.",
      "targetMeaning": "Xin chào, xin đợi một chút, tôi chuyển máy ngay.",
      "hint": "Giọng điệu nhã nhặn, chuyên nghiệp."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Xin hỏi Giám đốc Lý có ở văn phòng không'",
      "words": [
        "李经理",
        "请问",
        "在办公室吗"
      ],
      "correctOrder": [
        "请问",
        "李经理",
        "在办公室吗"
      ],
      "explanation": "请问 đứng đầu câu hỏi."
    },
    "step8_quiz": [
      {
        "id": "q-411-1",
        "type": "multiple-choice",
        "question": "Khi người nghe điện thoại bận hoặc vắng mặt, người nhận máy thường hỏi câu gì?",
        "options": [
          "需要留言吗？",
          "你找错人了！",
          "我不知道。",
          "别打了！"
        ],
        "correctIndex": 0,
        "explanation": "Cung cấp dịch vụ: 需要留言吗？ (Có cần để lại lời nhắn không?)."
      },
      {
        "id": "q-411-2",
        "type": "multiple-choice",
        "question": "Từ nào đồng nghĩa với 'xin đợi một lát'?",
        "options": [
          "稍等",
          "赶快",
          "马上走",
          "别等"
        ],
        "correctIndex": 0,
        "explanation": "稍等 nghĩa là đợi một lát."
      }
    ],
    "step9_challenge": {
      "title": "Giao tiếp điện thoại",
      "taskDesc": "Thực hành nghe và chuyển máy điện thoại văn phòng chuẩn mực.",
      "targetPhrase": "qǐng nín shāoděng",
      "xpReward": 60,
      "badge": "Lễ Tân Chuyên Nghiệp"
    }
  },
  {
    "id": "l-412",
    "chapterId": "ch-15",
    "levelId": "lvl-4",
    "lessonNumber": 2,
    "title": "Đặt lịch hẹn họp đối tác & Đổi lịch",
    "chineseTitle": "预约商务会议与改期",
    "subtitle": "Cách đặt lịch hẹn gặp đối tác, thống nhất thời gian và thông báo dời lịch.",
    "objective": "Sử dụng từ vựng hội nghị: 预约, 会议, 改期, 准时 và phó từ 提前……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-15"
    ],
    "step1_learn": {
      "topic": "Đặt lịch hẹn họp đối tác & Đổi lịch - Trọng tâm HSK 4",
      "summary": "Cách đặt lịch hẹn gặp đối tác, thống nhất thời gian và thông báo dời lịch.",
      "keyTakeaways": [
        "Sử dụng từ vựng hội nghị: 预约, 会议, 改期, 准时 và phó từ 提前……",
        "Làm chủ điểm ngữ pháp: 提前…… (Làm trước / Sớm hơn dự định)"
      ],
      "audioDemoText": "没问题，只要他们周五能准时出席就行。"
    },
    "step2_vocabulary": [
      {
        "id": "v-412-1",
        "hanzi": "预约",
        "pinyin": "yùyuē",
        "hanviet": "Dự ước",
        "meaning": "Hẹn trước, đặt lịch",
        "radical": "Bộ 言",
        "example": {
          "hanzi": "我已经提前预约了明天的会面。",
          "pinyin": "Wǒ yǐjīng tíqián yùyuē le míngtiān de huìmiàn.",
          "meaning": "Tôi đã hẹn trước cuộc gặp ngày mai."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-412-2",
        "hanzi": "会议",
        "pinyin": "huìyì",
        "hanviet": "Hội nghị",
        "meaning": "Cuộc họp, hội nghị",
        "radical": "Bộ 人",
        "example": {
          "hanzi": "下午两点有一个部门会议。",
          "pinyin": "Xiàwǔ liǎng diǎn yǒu yí gè bùmén huìyì.",
          "meaning": "2 giờ chiều có một cuộc họp phòng ban."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-412-3",
        "hanzi": "改期",
        "pinyin": "gǎiqī",
        "hanviet": "Cải kỳ",
        "meaning": "Đổi ngày hẹn, dời lịch",
        "radical": "Bộ 攵",
        "example": {
          "hanzi": "因为临时有事，会议不得不改期。",
          "pinyin": "Yīnwèi línshí yǒushì, huìyì bùdébù gǎiqī.",
          "meaning": "Vì có việc đột xuất, cuộc họp buộc phải dời lịch."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-412-4",
        "hanzi": "准时",
        "pinyin": "zhǔnshí",
        "hanviet": "Chuẩn thời",
        "meaning": "Đúng giờ",
        "radical": "Bộ 冫",
        "example": {
          "hanzi": "请大家准时出席会议。",
          "pinyin": "Qǐng dàjiā zhǔnshí chūxí huìyì.",
          "meaning": "Xin mọi người tham dự cuộc họp đúng giờ."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "改",
        "hanzi": "改",
        "pinyin": "gǎi",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰己攵",
        "radical": {
          "char": "攵",
          "name": "Phác",
          "strokes": 4
        },
        "meaning": "Sửa đổi, thay đổi, cải thiện",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Kỷ 己 (3 nét) -> Bộ Phác 攵 (4 nét)",
        "components": [
          "己",
          "攵"
        ],
        "mnemonic": "Dùng roi gậy (攵) tự răn đe bản thân mình (己) sửa chữa sai lầm: đổi lịch (改期), sửa đổi (改错)."
      },
      {
        "char": "迟",
        "hanzi": "迟",
        "pinyin": "chí",
        "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿺"
        },
        "ids": "⿺辶尺",
        "radical": {
          "char": "辶",
          "name": "Quai sước",
          "strokes": 3
        },
        "meaning": "Chậm trễ, muộn màng, hoãn lại",
        "strokesCount": 7,
        "strokeOrderText": "Chữ Xích 尺 (4 nét: ngang gập, ngang, phẩy, mác) -> Bộ Quai sước 辶 (3 nét)",
        "components": [
          "辶",
          "尺"
        ],
        "mnemonic": "Bước chân di chuyển (辶) từng tấc thước ngắn ngủi (尺): chậm trễ, hoãn lịch (推迟, 迟到)."
      }
    ],
    "step4_grammar": {
      "formula": "提前…… (Làm trước / Sớm hơn dự định)",
      "title": "Phó từ chỉ hành động diễn ra trước mốc thời gian",
      "explanation": "Đặt '提前 + Động từ' để biểu thị việc hoàn thành hoặc thông báo trước hạn.",
      "examples": [
        {
          "hanzi": "如果有变化，请提前通知我们。",
          "pinyin": "Rúguǒ yǒu biànhuà, qǐng tíqián tōngzhī wǒmen.",
          "meaning": "Nếu có thay đổi, xin vui lòng thông báo trước cho chúng tôi."
        }
      ],
      "commonMistake": {
        "wrong": "请通知提前我。",
        "correct": "请提前通知我。",
        "explanation": "提前 đứng TRƯỚC động từ."
      }
    },
    "step5_listening": {
      "situation": "Thương lượng đặt lại lịch hẹn họp đối tác do có sự cố phát sinh",
      "context": "Cuộc gọi thương thảo lịch làm việc giữa hai giám đốc dự án",
      "participants": "A: Trợ lý giám đốc dự án, B: Đối tác chiến lược",
      "targetGoal": "Vận dụng phó từ 提前…… (sớm hơn / trước thời hạn) và thao tác đổi lịch (预约, 会议, 改期, 推迟)",
      "usageNotes": "\"推迟\" (lùi lịch / hoãn lại) và \"提前\" (làm sớm hơn) là cặp từ trái nghĩa tần suất xuất hiện cực cao trong HSK 4.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "张总您好，关于原定于明天上午九点的新产品推介会议，我们可能需要跟您商量改期。",
          "pinyin": "Zhāng zǒng nín hǎo, guānyú yuándìng yú míngtiān shàngwǔ jiǔ diǎn de xīn chǎnpǐn tuījiè huìyì, wǒmen kěnéng xūyào gēn nín shāngliang gǎiqī.",
          "meaning": "Chào Giám đốc Trương, về cuộc họp giới thiệu sản phẩm mới ban đầu ấn định vào 9 giờ sáng mai, chúng tôi có lẽ cần thương lượng đổi lịch với anh."
        },
        {
          "speaker": "B",
          "hanzi": "发生什么意外情况了吗？这周我们的项目日程安排得非常满。",
          "pinyin": "Fāshēng shénme yìwài qíngkuàng le ma? Zhè zhōu wǒmen de xiàngmù rìchéng ānpái de fēicháng mǎn.",
          "meaning": "Đã xảy ra tình huống ngoài dự kiến gì vậy? Tuần này lịch trình dự án của chúng tôi sắp xếp kín lắm."
        },
        {
          "speaker": "A",
          "hanzi": "非常抱歉！由于我们的核心技术总监今天突发高烧，为了保证会议效果，我们建议将会议推迟到周五下午。",
          "pinyin": "Fēicháng bàoqiàn! Yóuyú wǒmen de héxīn jìshù zǒngjiān jīntiān tūfā gāoshāo, wèile bǎozhèng huìyì xiàoguǒ, wǒmen jiànyì jiāng huìyì tuīchí dào zhōuwǔ xiàwǔ.",
          "meaning": "Rất xin lỗi anh! Do Giám đốc kỹ thuật cốt lõi của chúng tôi hôm nay đột ngột sốt cao, nhằm đảm bảo hiệu quả cuộc họp, chúng tôi đề xuất hoãn cuộc họp sang chiều thứ Sáu."
        },
        {
          "speaker": "B",
          "hanzi": "周五下午两点我可以协调出一个小时。请你们提前把修改后的方案发到我的邮箱。",
          "pinyin": "Zhōuwǔ xiàwǔ liǎng diǎn wǒ kěyǐ xiétiáo chū yí gè xiǎoshí. Qǐng nǐmen tíqián bǎ xiūgǎi hòu de fāng'àn fā dào wǒ de yóuxiāng.",
          "meaning": "Chiều thứ Sáu lúc 2 giờ tôi có thể thu xếp được 1 tiếng. Xin phía các anh gửi trước phương án sau khi sửa đổi vào hòm thư của tôi nhé."
        },
        {
          "speaker": "A",
          "hanzi": "好的张总，我们一定提前发送资料，十分感谢您的理解与配合！",
          "pinyin": "Hǎo de Zhāng zǒng, wǒmen yídìng tíqián fāsòng zīliào, shífēn gǎnxiè nín de lǐjiě yǔ pèihé!",
          "meaning": "Vâng thưa Giám đốc Trương, chúng tôi nhất định sẽ gửi tài liệu trước, vô cùng cảm ơn sự thấu hiểu và hợp tác của anh!"
        }
      ],
      "audioText": "张总您好，关于原定于明天上午九点的新产品推介会议，我们可能需要跟您商量改期。发生什么意外情况了吗？这周我们的项目日程安排得非常满。非常抱歉！由于我们的核心技术总监今天突发高烧，为了保证会议效果，我们建议将会议推迟到周五下午。周五下午两点我可以协调出一个小时。请你们提前把修改后的方案发到我的邮箱。好的张总，我们一定提前发送资料，十分感谢您的理解与配合！",
      "question": "Hai bên đã thống nhất dời cuộc họp sang thời gian nào?",
      "options": [
        "Sáng thứ Bảy",
        "Chiều thứ Sáu lúc hai giờ (周五下午两点)",
        "Sáng thứ Hai tuần sau",
        "Hủy bỏ cuộc họp vĩnh viễn"
      ],
      "correctIndex": 1,
      "explanation": "Giám đốc B đồng ý điều chỉnh: \"周五下午两点我可以协调出一个小时\" (Chiều thứ Sáu lúc 2 giờ tôi có thể thu xếp được 1 tiếng)."
    },
    "step6_speaking": {
      "prompt": "Yêu cầu thông báo trước:",
      "targetSentence": "如有变动，请提前一天告知。",
      "targetPinyin": "Rú yǒu biàndòng, qǐng tíqián yì tiān gàozhī.",
      "targetMeaning": "Nếu có thay đổi, xin thông báo trước 1 ngày.",
      "hint": "Giọng điệu trang trọng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Xin vui lòng đến tham gia cuộc họp đúng giờ'",
      "words": [
        "准时",
        "出席会议",
        "请大家"
      ],
      "correctOrder": [
        "请大家",
        "准时",
        "出席会议"
      ],
      "explanation": "Trạng từ 准时 đứng trước động từ 出席."
    },
    "step8_quiz": [
      {
        "id": "q-412-1",
        "type": "multiple-choice",
        "question": "Khi muốn dời cuộc họp sang ngày khác, ta dùng từ nào?",
        "options": [
          "开会",
          "改期",
          "取消",
          "迟到"
        ],
        "correctIndex": 1,
        "explanation": "改期 nghĩa là đổi ngày hẹn."
      },
      {
        "id": "q-412-2",
        "type": "multiple-choice",
        "question": "Điền từ: '去机场前最好____两小时出发，以免堵车。'",
        "options": [
          "提前",
          "落后",
          "推迟",
          "准时"
        ],
        "correctIndex": 0,
        "explanation": "Xuất phát sớm hơn dùng 提前."
      }
    ],
    "step9_challenge": {
      "title": "Lên lịch họp đối tác",
      "taskDesc": "Thực hành soạn email hoặc gọi điện dời lịch hẹn gặp đối tác.",
      "targetPhrase": "tíqián yùyuē huìyì",
      "xpReward": 60,
      "badge": "Thư Ký Mẫn Cán"
    }
  },
  {
    "id": "l-413",
    "chapterId": "ch-15",
    "levelId": "lvl-4",
    "lessonNumber": 3,
    "title": "Soạn thảo email công việc & Tệp đính kèm",
    "chineseTitle": "发送商务邮件与确认信",
    "subtitle": "Cấu trúc thư tín thương mại, cách gửi kèm tệp và yêu cầu phản hồi.",
    "objective": "Nắm vững từ vựng văn phòng: 发送, 邮件, 附件, 确认 và phó từ 及时……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-15"
    ],
    "step1_learn": {
      "topic": "Soạn thảo email công việc & Tệp đính kèm - Trọng tâm HSK 4",
      "summary": "Cấu trúc thư tín thương mại, cách gửi kèm tệp và yêu cầu phản hồi.",
      "keyTakeaways": [
        "Nắm vững từ vựng văn phòng: 发送, 邮件, 附件, 确认 và phó từ 及时……",
        "Làm chủ điểm ngữ pháp: 请及时…… (Xin hãy kịp thời...)"
      ],
      "audioDemoText": "已经发了，我还随信附上了最新版本的合同方案。"
    },
    "step2_vocabulary": [
      {
        "id": "v-413-1",
        "hanzi": "发送",
        "pinyin": "fāsòng",
        "hanviet": "Phát tống",
        "meaning": "Gửi đi (email, tin nhắn)",
        "radical": "Bộ 又",
        "example": {
          "hanzi": "我已经把合同方案发送到您的邮箱了。",
          "pinyin": "Wǒ yǐjīng bǎ hétong fāng'àn fāsòng dào nín de yóuxiāng le.",
          "meaning": "Tôi đã gửi phương án hợp đồng vào hòm thư của ngài."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-413-2",
        "hanzi": "邮件",
        "pinyin": "yóujiàn",
        "hanviet": "Bưu kiện",
        "meaning": "Thư từ, bưu kiện, email",
        "radical": "Bộ 亻",
        "example": {
          "hanzi": "每天上班第一件事就是查看工作邮件。",
          "pinyin": "Měitiān shàngbān dì-yī jiàn shì jiù shì chákàn gōngzuò yóujiàn.",
          "meaning": "Mỗi ngày đi làm việc đầu tiên là kiểm tra email công việc."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-413-3",
        "hanzi": "附件",
        "pinyin": "fùjiàn",
        "hanviet": "Phụ kiện",
        "meaning": "Tệp đính kèm",
        "radical": "Bộ 阝",
        "example": {
          "hanzi": "详细报价单请查看邮件附件。",
          "pinyin": "Xiángxì bàojiàdān qǐng chákàn yóujiàn fùjiàn.",
          "meaning": "Bảng báo giá chi tiết xin vui lòng xem tệp đính kèm."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-413-4",
        "hanzi": "确认",
        "pinyin": "quèrèn",
        "hanviet": "Xác nhận",
        "meaning": "Xác nhận, khẳng định",
        "radical": "Bộ 石",
        "example": {
          "hanzi": "收到邮件后请回复确认。",
          "pinyin": "Shōudào yóujiàn hòu qǐng huífù quèrèn.",
          "meaning": "Sau khi nhận thư xin vui lòng phản hồi xác nhận."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "附",
        "hanzi": "附",
        "pinyin": "fù",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰阝付",
        "radical": {
          "char": "阝",
          "name": "Phụ (gò đất)",
          "strokes": 2
        },
        "meaning": "Đính kèm, gắn liền, phụ cận",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Phụ 阝 (2 nét) -> Chữ Phó 付 (5 nét)",
        "components": [
          "阝",
          "付"
        ],
        "mnemonic": "Trao gửi (付) tài liệu đặt nép cạnh gò đất (阝): tệp đính kèm (附件), phụ cận (附近)."
      },
      {
        "char": "确",
        "hanzi": "确",
        "pinyin": "què",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰石角",
        "radical": {
          "char": "石",
          "name": "Thạch",
          "strokes": 5
        },
        "meaning": "Xác thực, kiên định, chắc chắn",
        "strokesCount": 12,
        "strokeOrderText": "Bộ Thạch 石 (5 nét) -> Bộ Giác 角 (7 nét)",
        "components": [
          "石",
          "角"
        ],
        "mnemonic": "Tảng đá (石) cứng cáp như sừng hươu (角) không lung lay: xác nhận (确认), chính xác (准确)."
      }
    ],
    "step4_grammar": {
      "formula": "请及时…… (Xin hãy kịp thời...)",
      "title": "Phó từ biểu thị sự khẩn trương, không trì hoãn",
      "explanation": "Dùng trong thư từ công việc để nhắc nhở đối tác xử lý công việc đúng tiến độ.",
      "examples": [
        {
          "hanzi": "收到后请及时查收并确认。",
          "pinyin": "Shōudào hòu qǐng jíshí chāshōu bìng quèrèn.",
          "meaning": "Sau khi nhận xin hãy kịp thời kiểm tra và xác nhận."
        }
      ],
      "commonMistake": {
        "wrong": "请查收及时。",
        "correct": "请及时查收。",
        "explanation": "及时 đứng trước động từ 查收."
      }
    },
    "step5_listening": {
      "situation": "Soạn thảo email công việc trang trọng và gửi tệp đính kèm dự án",
      "context": "Trao đổi nghiệp vụ qua email giữa quản lý dự án và khách hàng",
      "participants": "A: Trưởng phòng dự án xuất nhập khẩu, B: Khách hàng nhận email",
      "targetGoal": "Thực hành mẫu câu thư tín công việc và yêu cầu xác nhận kịp thời (发送, 邮件, 附件, 确认)",
      "usageNotes": "\"请查收附件\" (xin vui lòng kiểm tra tệp đính kèm) và \"请及时回复确认\" (xin vui lòng phản hồi xác nhận kịp thời) là cấu trúc chuẩn mực trong email công sở Trung Quốc.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "李总您好，我已经将最新的合作合同草案通过电子邮件发送给您了，请查收附件。",
          "pinyin": "Lǐ zǒng nín hǎo, wǒ yǐjīng jiāng zuìxīn de hézuò hétong cǎofàn tōngguò diànzǐ yóujiàn fāsòng gěi nín le, qǐng cháshōu fùjiàn.",
          "meaning": "Chào Giám đốc Lý, tôi đã gửi bản thảo hợp đồng hợp tác mới nhất qua email cho anh rồi ạ, xin vui lòng kiểm tra tệp đính kèm."
        },
        {
          "speaker": "B",
          "hanzi": "好的，我已经收到了邮件。附件里的报价单和交付周期写得非常明确。",
          "pinyin": "Hǎo de, wǒ yǐjīng shōudào le yóujiàn. Fùjiàn lǐ de bàojiàdān hé jiāofù zhōuqī xiě de fēicháng míngquè.",
          "meaning": "Vâng, tôi đã nhận được email rồi. Bảng báo giá và chu kỳ bàn giao trong tệp đính kèm viết rất rõ ràng minh bạch."
        },
        {
          "speaker": "A",
          "hanzi": "请您和法务部门仔细核对条款，如果有任何疑问，请及时与我们沟通。",
          "pinyin": "Qǐng nín hé fǎwù bùmén zǐxì héduì tiáokuǎn, rúguǒ yǒu rènhé yíwèn, qǐng jíshí yǔ wǒmen gōutōng.",
          "meaning": "Xin anh và bộ phận pháp chế rà soát kỹ các điều khoản, nếu có bất kỳ thắc mắc nào, xin hãy kịp thời trao đổi với chúng tôi."
        },
        {
          "speaker": "B",
          "hanzi": "没问题，我们明天下午开会审议，最晚后天上午给你们发送正式的确认函。",
          "pinyin": "Méi wèntí, wǒmen míngtiān xiàwǔ kāihuì shěnyì, zuìwǎn hòutiān shàngwǔ gěi nǐmen fāsòng zhèngshì de quèrènhán.",
          "meaning": "Không vấn đề gì, chiều mai chúng tôi họp thẩm định, muộn nhất sáng ngày kia sẽ gửi thư xác nhận chính thức cho phía các anh."
        },
        {
          "speaker": "A",
          "hanzi": "太好了，期待我们的合作顺利推进，祝您工作愉快！",
          "pinyin": "Tài hǎo le, qīdài wǒmen de hézuò shùnlì tuījìn, zhù nín gōngzuò yúkuài!",
          "meaning": "Tuyệt quá, rất mong đợi sự hợp tác của chúng ta tiến triển thuận lợi, chúc anh làm việc vui vẻ!"
        }
      ],
      "audioText": "李总您好，我已经将最新的合作合同草案通过电子邮件发送给您了，请查收附件。好的，我已经收到了邮件。附件里的报价单和交付周期写得非常明确。请您和法务部门仔细核对条款，如果有任何疑问，请及时与我们沟通。没问题，我们明天下午开会审议，最晚后天上午给你们发送正式的确认函。太好了，期待我们的合作顺利推进，祝您工作愉快！",
      "question": "Bên khách hàng dự kiến gửi thư xác nhận chính thức vào thời điểm nào?",
      "options": [
        "Ngay lập tức",
        "Muộn nhất sáng ngày kia (最晚后天上午)",
        "Tháng sau",
        "Sau khi dự án kết thúc"
      ],
      "correctIndex": 1,
      "explanation": "Giám đốc B hẹn rõ ràng: \"最晚后天上午给你们发送正式的确认函\" (Muộn nhất sáng ngày kia gửi cho các bạn thư xác nhận chính thức)."
    },
    "step6_speaking": {
      "prompt": "Nhắc phản hồi thư tín:",
      "targetSentence": "查收后请及时回复邮件确认。",
      "targetPinyin": "Chāshōu hòu qǐng jíshí huífù yóujiàn quèrèn.",
      "targetMeaning": "Sau khi kiểm tra xin phản hồi email xác nhận kịp thời.",
      "hint": "Văn phong công sở chỉn chu."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Xin vui lòng xem bảng báo giá trong tệp đính kèm'",
      "words": [
        "请查看",
        "报价单",
        "附件中的"
      ],
      "correctOrder": [
        "请查看",
        "附件中的",
        "报价单"
      ],
      "explanation": "Định ngữ đứng trước trung tâm ngữ."
    },
    "step8_quiz": [
      {
        "id": "q-413-1",
        "type": "multiple-choice",
        "question": "Tài liệu gửi kèm theo email trong tiếng Trung gọi là gì?",
        "options": [
          "软件 (Phần mềm)",
          "附件 (Tệp đính kèm)",
          "硬件 (Phần cứng)",
          "条件 (Điều kiện)"
        ],
        "correctIndex": 1,
        "explanation": "附件 (fùjiàn) là tệp đính kèm."
      },
      {
        "id": "q-413-2",
        "type": "multiple-choice",
        "question": "Điền từ: '发现问题要____解决，不能拖延。'",
        "options": [
          "及时",
          "随时",
          "平时",
          "按时"
        ],
        "correctIndex": 0,
        "explanation": "Kịp thời xử lý không chậm trễ dùng 及时."
      }
    ],
    "step9_challenge": {
      "title": "Viết email công sở",
      "taskDesc": "Soạn thảo email ngắn gửi báo giá kèm file đính kèm cho khách hàng.",
      "targetPhrase": "chákàn yóujiàn fùjiàn",
      "xpReward": 60,
      "badge": "Chuyên Gia Thư Tín"
    }
  },
  {
    "id": "l-414",
    "chapterId": "ch-15",
    "levelId": "lvl-4",
    "lessonNumber": 4,
    "title": "Xin phép nghỉ việc & Giải thích lý do đến muộn",
    "chineseTitle": "请假申请与迟到说明",
    "subtitle": "Cách xin nghỉ phép, giải thích lý do kẹt xe hoặc ốm đau một cách thuyết phục.",
    "objective": "Nắm vững từ vựng xin phép: 抱歉, 迟到, 堵车, 请假 và liên từ 由于……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-15"
    ],
    "step1_learn": {
      "topic": "Xin phép nghỉ việc & Giải thích lý do đến muộn - Trọng tâm HSK 4",
      "summary": "Cách xin nghỉ phép, giải thích lý do kẹt xe hoặc ốm đau một cách thuyết phục.",
      "keyTakeaways": [
        "Nắm vững từ vựng xin phép: 抱歉, 迟到, 堵车, 请假 và liên từ 由于……",
        "Làm chủ điểm ngữ pháp: 由于……因此/所以…… (Do... cho nên...)"
      ],
      "audioDemoText": "没关系，安全第一，路上注意安全。"
    },
    "step2_vocabulary": [
      {
        "id": "v-414-1",
        "hanzi": "抱歉",
        "pinyin": "bàoqiàn",
        "hanviet": "Bão khiểm",
        "meaning": "Thành thật xin lỗi, áy náy",
        "radical": "Bộ 扌",
        "example": {
          "hanzi": "实在抱歉，今天路上严重堵车。",
          "pinyin": "Shízài bàoqiàn, jīntiān lùshang yánzhòng dǔchē.",
          "meaning": "Thật vô cùng xin lỗi, hôm nay trên đường tắc xe nghiêm trọng."
        },
        "pos": "Tính từ / Động từ"
      },
      {
        "id": "v-414-2",
        "hanzi": "迟到",
        "pinyin": "chídào",
        "hanviet": "Trì đáo",
        "meaning": "Đến muộn, trễ giờ",
        "radical": "Bộ 辶",
        "example": {
          "hanzi": "他上班从来不迟到。",
          "pinyin": "Tā shàngbān cónglái bù chídào.",
          "meaning": "Anh ấy đi làm chưa bao giờ đến muộn."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-414-3",
        "hanzi": "堵车",
        "pinyin": "dǔchē",
        "hanviet": "Đổ xa",
        "meaning": "Tắc đường, kẹt xe",
        "radical": "Bộ 土",
        "example": {
          "hanzi": "早高峰堵车非常厉害。",
          "pinyin": "Zǎogāofēng dǔchē fēicháng lìhai.",
          "meaning": "Giờ cao điểm buổi sáng tắc đường rất dữ dội."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-414-4",
        "hanzi": "请假",
        "pinyin": "qǐngjià",
        "hanviet": "Thỉnh giả",
        "meaning": "Xin nghỉ phép",
        "radical": "Bộ 言",
        "example": {
          "hanzi": "我身体不舒服，想请一天病假。",
          "pinyin": "Wǒ shēntǐ bù shūfu, xiǎng qǐng yì tiān bìngjià.",
          "meaning": "Người tôi không khỏe, muốn xin nghỉ ốm 1 ngày."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "堵",
        "hanzi": "堵",
        "pinyin": "dǔ",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰土者",
        "radical": {
          "char": "土",
          "name": "Thổ",
          "strokes": 3
        },
        "meaning": "Tắc nghẽn, ngăn chặn, bức tường",
        "strokesCount": 11,
        "strokeOrderText": "Bộ Thổ 土 (3 nét) -> Chữ Giả 者 (8 nét)",
        "components": [
          "土",
          "者"
        ],
        "mnemonic": "Đắp đất (土) chặn ngang lối đi của mọi người (者): tắc đường kẹt xe (堵车)."
      },
      {
        "char": "歉",
        "hanzi": "歉",
        "pinyin": "qiàn",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰兼欠",
        "radical": {
          "char": "欠",
          "name": "Khiếm",
          "strokes": 4
        },
        "meaning": "Áy náy, thiếu sót, xin lỗi",
        "strokesCount": 14,
        "strokeOrderText": "Chữ Kiêm 兼 (10 nét) -> Bộ Khiếm 欠 (4 nét)",
        "components": [
          "兼",
          "欠"
        ],
        "mnemonic": "Gánh vác nhiều bề (兼) mà vẫn thiếu sót (欠) chưa chu toàn: áy náy xin lỗi (抱歉)."
      }
    ],
    "step4_grammar": {
      "formula": "由于……因此/所以…… (Do... cho nên...)",
      "title": "Cấu trúc liên từ giải thích nguyên nhân trang trọng",
      "explanation": "Thường dùng trong văn viết và phát biểu công sở trang trọng hơn 因为...所以...",
      "examples": [
        {
          "hanzi": "由于突发暴雨，因此航班延误了两个小时。",
          "pinyin": "Yóuyú tūfā bàoyǔ, yīncǐ hángbān yánwù le liǎng gè xiǎoshí.",
          "meaning": "Do cơn mưa bão bất ngờ, cho nên chuyến bay bị hoãn 2 tiếng."
        }
      ],
      "commonMistake": {
        "wrong": "由于原因，所以迟到。",
        "correct": "由于路上堵车，所以我迟到了。",
        "explanation": "Sau 由于 phải nêu rõ nguyên nhân cụ thể."
      }
    },
    "step5_listening": {
      "situation": "Báo cáo lý do đến muộn do kẹt xe và xin phép lãnh đạo phê duyệt",
      "context": "Tin nhắn thoại khẩn cấp gửi lãnh đạo phòng kinh doanh vào buổi sáng",
      "participants": "A: Nhân viên kinh doanh gặp sự cố giao thông, B: Trưởng phòng",
      "targetGoal": "Vận dụng liên từ chỉ nguyên nhân kết quả 由于……因此/所以…… (抱歉, 耽误, 堵车, 批准)",
      "usageNotes": "\"由于……因此……\" là cấu trúc nguyên nhân kết quả mang văn phong trang trọng, thường dùng trong đơn từ xin phép và báo cáo văn phòng.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "王经理非常抱歉！由于今天早高峰主干道发生了交通事故，导致严重堵车，我可能要迟到半小时。",
          "pinyin": "Wáng jīnglǐ fēicháng bàoqiàn! Yóuyú jīntiān zǎogāofēng zhǔgàndào fāshēng le jiāotōng shìgù, dǎozhì yánzhòng dǔchē, wǒ kěnéng yào chídào bàn xiǎoshí.",
          "meaning": "Quản lý Vương, thật lòng rất xin lỗi anh! Do giờ cao điểm sáng nay trên đường trục chính xảy ra tai nạn giao thông dẫn đến kẹt xe nghiêm trọng, em có thể đến muộn nửa tiếng ạ."
        },
        {
          "speaker": "B",
          "hanzi": "收到，安全第一，路上千万别着急。今天上午九点半的早会你能赶上吗？",
          "pinyin": "Shōudào, ānquán dì-yī, lù shang qiānwàn bié zháojí. Jīntiān shàngwǔ jiǔ diǎn bàn de zǎohuì nǐ néng gǎnshàng ma?",
          "meaning": "Tôi nhận được rồi, an toàn là trên hết, đi trên đường tuyệt đối đừng vội. Cuộc họp đầu giờ lúc 9:30 sáng nay em có kịp đến không?"
        },
        {
          "speaker": "A",
          "hanzi": "我大约九点十分就能到达公司，绝对不会耽误上午的重要客户接待。",
          "pinyin": "Wǒ dàyuē jiǔ diǎn shí fēn jiù néng dàodá gōngsī, juéduì bú huì dānwu shàngwǔ de zhòngyào kèhù jiēdài.",
          "meaning": "Khoảng 9:10 là em có thể tới công ty rồi ạ, tuyệt đối sẽ không làm chậm trễ việc đón tiếp khách hàng quan trọng buổi sáng."
        },
        {
          "speaker": "B",
          "hanzi": "好的，我已经批准了你的迟到报备，安心开车吧。",
          "pinyin": "Hǎo de, wǒ yǐjīng pīzhǔn le nǐ de chídào bàobèi, ānxīn kāichē ba.",
          "meaning": "Được rồi, tôi đã phê duyệt báo cáo đến muộn của em rồi, yên tâm lái xe nhé."
        },
        {
          "speaker": "A",
          "hanzi": "谢谢经理的理解与支持，我到公司后立刻向您当面汇报！",
          "pinyin": "Xièxie jīnglǐ de lǐjiě yǔ zhīchí, wǒ dào gōngsī hòu lìkè xiàng nín dāngmiàn huìbào!",
          "meaning": "Em cảm ơn sự thông cảm và hỗ trợ của quản lý, đến công ty em sẽ lập tức báo cáo trực tiếp với anh ạ!"
        }
      ],
      "audioText": "王经理非常抱歉！由于今天早高峰主干道发生了交通事故，导致严重堵车，我可能要迟到半小时。收到，安全第一，路上千万别着急。今天上午九点半的早会你能赶上吗？我大约九点十分就能到达公司，绝对不会耽误上午的重要客户接待。好的，我已经批准了你的迟到报备，安心开车吧。谢谢经理的理解与支持，我到公司后立刻向您当面汇报！",
      "question": "Nguyên nhân khiến nhân viên xin đến muộn nửa tiếng là gì?",
      "options": [
        "Ngủ quên ở nhà",
        "Đường trục chính xảy ra tai nạn giao thông dẫn đến kẹt xe nghiêm trọng (严重堵车)",
        "Xe bị hỏng giữa đường",
        "Đi nhầm tuyến xe buýt"
      ],
      "correctIndex": 1,
      "explanation": "Nhân viên giải trình nguyên nhân: \"由于今天早高峰主干道发生了交通事故，导致严重堵车\" (Do giờ cao điểm xảy ra tai nạn dẫn đến tắc đường nghiêm trọng)."
    },
    "step6_speaking": {
      "prompt": "Giải thích lý do đến muộn:",
      "targetSentence": "实在抱歉，今天路上严重堵车。",
      "targetPinyin": "Shízài bàoqiàn, jīntiān lùshang yánzhòng dǔchē.",
      "targetMeaning": "Thật sự áy náy, hôm nay trên đường tắc xe quá nặng.",
      "hint": "Giọng điệu chân thành."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Do trời mưa lớn cho nên giao thông bị tắc nghẽn'",
      "words": [
        "由于",
        "交通十分拥堵",
        "下大雨",
        "因此"
      ],
      "correctOrder": [
        "由于",
        "下大雨",
        "因此",
        "交通十分拥堵"
      ],
      "explanation": "Cấu trúc 由于...因此..."
    },
    "step8_quiz": [
      {
        "id": "q-414-1",
        "type": "multiple-choice",
        "question": "Khi bị ốm cần xin nghỉ làm việc, bạn làm đơn xin nghỉ gì?",
        "options": [
          "事假 (Nghỉ việc riêng)",
          "病假 (Nghỉ ốm)",
          "年假 (Nghỉ phép năm)",
          "产假 (Nghỉ thai sản)"
        ],
        "correctIndex": 1,
        "explanation": "Nghỉ do ốm đau là 病假."
      },
      {
        "id": "q-414-2",
        "type": "multiple-choice",
        "question": "Điền từ: '____突发紧急情况，会议不得不推迟。'",
        "options": [
          "由于",
          "既然",
          "不仅",
          "即使"
        ],
        "correctIndex": 0,
        "explanation": "Nêu nguyên nhân trang trọng dùng 由于."
      }
    ],
    "step9_challenge": {
      "title": "Ứng xử văn phòng",
      "taskDesc": "Soạn tin nhắn xin phép sếp đến muộn do kẹt xe hoặc xin nghỉ ốm.",
      "targetPhrase": "qǐng yì tiān bìngjià",
      "xpReward": 60,
      "badge": "Giao Tiếp Thấu Tình"
    }
  },
  {
    "id": "l-415",
    "chapterId": "ch-15",
    "levelId": "lvl-4",
    "lessonNumber": 5,
    "title": "Tổng kết kỹ năng giao tiếp văn phòng HSK 4",
    "chineseTitle": "第十五章复习与职场实务综合",
    "subtitle": "Tổng hợp kỹ năng nghe gọi điện thoại, hẹn đối tác, gửi email và báo cáo công việc.",
    "objective": "Làm chủ toàn bộ phản xạ văn phòng chuyên nghiệp và từ vựng phối hợp công tác.",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-15"
    ],
    "step1_learn": {
      "topic": "Tổng kết kỹ năng giao tiếp văn phòng HSK 4 - Trọng tâm HSK 4",
      "summary": "Tổng hợp kỹ năng nghe gọi điện thoại, hẹn đối tác, gửi email và báo cáo công việc.",
      "keyTakeaways": [
        "Làm chủ toàn bộ phản xạ văn phòng chuyên nghiệp và từ vựng phối hợp công tác.",
        "Làm chủ điểm ngữ pháp: 向……汇报 (Báo cáo với...)"
      ],
      "audioDemoText": "大家沟通得很充分，项目进展也非常顺利。"
    },
    "step2_vocabulary": [
      {
        "id": "v-415-1",
        "hanzi": "沟通",
        "pinyin": "gōutōng",
        "hanviet": "Câu thông",
        "meaning": "Giao tiếp, trao đổi",
        "radical": "Bộ 氵",
        "example": {
          "hanzi": "良好的沟通是合作成功的关键。",
          "pinyin": "Liánghǎo de gōutōng shì hézuò chénggōng de guānjiàn.",
          "meaning": "Giao tiếp tốt là chìa khóa của hợp tác thành công."
        },
        "pos": "Động từ / Danh từ"
      },
      {
        "id": "v-415-2",
        "hanzi": "配合",
        "pinyin": "pèihé",
        "hanviet": "Phối hợp",
        "meaning": "Phối hợp, cộng tác",
        "radical": "Bộ 酉",
        "example": {
          "hanzi": "谢谢各位同事的全力配合。",
          "pinyin": "Xièxie gèwèi tóngshì de quánlì pèihé.",
          "meaning": "Cảm ơn sự phối hợp hết mình của các đồng nghiệp."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-415-3",
        "hanzi": "顺利",
        "pinyin": "shùnlì",
        "hanviet": "Thuận lợi",
        "meaning": "Thuận lợi, trôi chảy",
        "radical": "Bộ 页",
        "example": {
          "hanzi": "今天的商务谈判进行得非常顺利。",
          "pinyin": "Jīntiān de shāngwù tánpàn jìnxíng de fēicháng shùnlì.",
          "meaning": "Cuộc đàm phán thương mại hôm nay diễn ra rất thuận lợi."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-415-4",
        "hanzi": "汇报",
        "pinyin": "huìbào",
        "hanviet": "Hối báo",
        "meaning": "Báo cáo công việc (lên cấp trên)",
        "radical": "Bộ 扌",
        "example": {
          "hanzi": "下午我要向总经理汇报项目进展。",
          "pinyin": "Xiàwǔ wǒ yào xiàng zǒngjīnglǐ huìbào xiàngmù jìnzhǎn.",
          "meaning": "Chiều nay tôi phải báo cáo tiến độ dự án với Tổng giám đốc."
        },
        "pos": "Động từ / Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "沟",
        "hanzi": "沟",
        "pinyin": "gōu",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰氵勾",
        "radical": {
          "char": "氵",
          "name": "Thủy",
          "strokes": 3
        },
        "meaning": "Mương máng, kết nối, câu thông",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Thủy 氵 (3 nét) -> Chữ Câu 勾 (4 nét: phẩy, ngang gập móc, chấm)",
        "components": [
          "氵",
          "勾"
        ],
        "mnemonic": "Dòng nước chảy (氵) khơi thông rãnh kênh móc nối (勾) với nhau: giao tiếp thông suốt (沟通)."
      },
      {
        "char": "配",
        "hanzi": "配",
        "pinyin": "pèi",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰酉己",
        "radical": {
          "char": "酉",
          "name": "Dậu",
          "strokes": 7
        },
        "meaning": "Phối hợp, xứng đôi, phân phối",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Dậu 酉 (7 nét) -> Bộ Kỷ 己 (3 nét)",
        "components": [
          "酉",
          "己"
        ],
        "mnemonic": "Hũ rượu quý (酉) hòa cùng tấm lòng của chính mình (己): cộng tác phối hợp (配合)."
      }
    ],
    "step4_grammar": {
      "formula": "向……汇报 (Báo cáo với...)",
      "title": "Cấu trúc giới từ chỉ đối tượng tiếp nhận báo cáo",
      "explanation": "Dùng 'Chủ ngữ + 向 + Cấp trên + 汇报 + Nội dung' theo đúng tôn ty trật tự công sở.",
      "examples": [
        {
          "hanzi": "请向董事长汇报这次考察的结果。",
          "pinyin": "Qǐng xiàng dǒngshìzhǎng huìbào zhè cì kǎochá de jiéguǒ.",
          "meaning": "Xin hãy báo cáo kết quả chuyến khảo sát lần này với Chủ tịch."
        }
      ],
      "commonMistake": {
        "wrong": "汇报向经理。",
        "correct": "向经理汇报。",
        "explanation": "Cụm giới từ phải đặt trước động từ 汇报."
      }
    },
    "step5_listening": {
      "situation": "Báo cáo tổng kết tiến độ dự án quý và tinh thần phối hợp đội ngũ",
      "context": "Phòng họp ban giám đốc trong buổi họp giao ban định kỳ",
      "participants": "A: Giám đốc điều hành, B: Trưởng dự án HSK 4",
      "targetGoal": "Vận dụng cấu trúc 向……汇报 (báo cáo với...) và từ vựng tổng kết công sở (沟通, 配合, 顺利, 汇报)",
      "usageNotes": "\"向领导汇报工作\" (báo cáo công việc lên lãnh đạo) thể hiện thái độ tôn trọng thứ bậc trong văn hóa doanh nghiệp phương Đông.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "各位同事，今天请技术部负责人向大家汇报一下第三季度的系统开发进度。",
          "pinyin": "Gèwèi tóngshì, jīntiān qǐng jìshùbù fùzérén xiàng dàjiā huìbào yíxià dì-sān jīdù de xìtǒng kāifā jìndù.",
          "meaning": "Các bạn đồng nghiệp, hôm nay xin mời người phụ trách bộ phận kỹ thuật báo cáo với mọi người tiến độ phát triển hệ thống quý 3."
        },
        {
          "speaker": "B",
          "hanzi": "各位领导好，得益于跨部门的高效沟通与紧密配合，我们的核心功能模块已经顺利上线。",
          "pinyin": "Gèwèi lǐngdǎo hǎo, déyì yú kuà bùmén de gāoxiào gōutōng yǔ jǐnmì pèihé, wǒmen de héxīn gōngnéng mókuài yǐjīng shùnlì shàngxiàn.",
          "meaning": "Kính chào các vị lãnh đạo, nhờ có sự giao tiếp hiệu quả và phối hợp chặt chẽ giữa các bộ phận, các module tính năng cốt lõi của chúng ta đã lên sàn trôi chảy."
        },
        {
          "speaker": "A",
          "hanzi": "太棒了！在开发过程中，各团队之间的协作配合解决了不少突发难题。",
          "pinyin": "Tài bàng le! Zài kāifā guòchéng zhōng, gè tuánduì zhījiān de xiézuò pèihé jiějué le bùshǎo tūfā nántí.",
          "meaning": "Tuyệt vời lắm! Trong quá trình phát triển, sự hiệp đồng phối hợp giữa các nhóm đã giải quyết không ít khó khăn đột xuất."
        },
        {
          "speaker": "B",
          "hanzi": "是的，用户体验测试合格率达到了百分之九十八，下一步我们将全力准备全国推广。",
          "pinyin": "Shì de, yònghù tǐyàn cèshì hégé lǜ dádào le bǎifēnzhī jiǔshíbā, xià yí bù wǒmen jiāng quánlì zhǔnbèi quánguó tuīguǎng.",
          "meaning": "Vâng ạ, tỷ lệ đạt thử nghiệm trải nghiệm người dùng đạt 98%, bước tiếp theo chúng em sẽ dốc toàn lực chuẩn bị quảng bá toàn quốc."
        },
        {
          "speaker": "A",
          "hanzi": "非常圆满！希望大家继续保持密切沟通，预祝第四季度取得更辉煌的业绩。",
          "pinyin": "Fēicháng yuánmǎn! Xīwàng dàjiā jìxù bǎochí mìqiè gōutōng, yùzhù dì-sì jīdù qǔdé gèng huīhuáng de yèjì.",
          "meaning": "Rất mỹ mãn! Mong mọi người tiếp tục giữ vững trao đổi mật thiết, chúc quý 4 gặt hái thêm nhiều thành tích rực rỡ hơn nữa."
        }
      ],
      "audioText": "各位同事，今天请技术部负责人向大家汇报一下第三季度的系统开发进度。各位领导好，得益于跨部门的高效沟通与紧密配合，我们的核心功能模块已经顺利上线。太棒了！在开发过程中，各团队之间的协作配合解决了不少突发难题。是的，用户体验测试合格率达到了百分之九十八，下一步我们将全力准备全国推广。非常圆满！希望大家继续保持密切沟通，预祝第四季度取得更辉煌的业绩。",
      "question": "Tỷ lệ đạt chuẩn thử nghiệm trải nghiệm người dùng đạt mức bao nhiêu phần trăm?",
      "options": [
        "80%",
        "90%",
        "98% (百分之九十八)",
        "100%"
      ],
      "correctIndex": 2,
      "explanation": "Trưởng nhóm báo cáo số liệu chính xác: \"用户体验测试合格率达到了百分之九十八\" (Tỷ lệ đạt thử nghiệm trải nghiệm người dùng đạt 98%)."
    },
    "step6_speaking": {
      "prompt": "Báo cáo công việc:",
      "targetSentence": "项目进展非常顺利，谢谢大家配合。",
      "targetPinyin": "Xiàngmù jìnzhǎn fēicháng shùnlì, xièxie dàjiā pèihé.",
      "targetMeaning": "Tiến độ dự án rất thuận lợi, cảm ơn mọi người đã phối hợp.",
      "hint": "Phong thái đĩnh đạc."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Tôi muốn báo cáo tiến độ với giám đốc'",
      "words": [
        "向经理",
        "汇报进展",
        "我想"
      ],
      "correctOrder": [
        "我想",
        "向经理",
        "汇报进展"
      ],
      "explanation": "Cấu trúc 向...汇报..."
    },
    "step8_quiz": [
      {
        "id": "q-415-1",
        "type": "multiple-choice",
        "question": "Từ nào chỉ hành động trình bày công việc lên lãnh đạo cấp trên?",
        "options": [
          "汇报 (Báo cáo)",
          "通知 (Thông báo)",
          "打扰 (Làm phiền)",
          "批评 (Phê bình)"
        ],
        "correctIndex": 0,
        "explanation": "汇报 dùng khi báo cáo lên cấp trên."
      },
      {
        "id": "q-415-2",
        "type": "multiple-choice",
        "question": "Điền từ: '团队成员之间需要多____，才能减少误会。'",
        "options": [
          "沟通",
          "堵车",
          "改期",
          "请假"
        ],
        "correctIndex": 0,
        "explanation": "Giảm hiểu lầm cần tăng cường 沟通 (giao tiếp)."
      }
    ],
    "step9_challenge": {
      "title": "Tổng kết Chương 15",
      "taskDesc": "Viết bản báo cáo công việc ngắn 60 chữ gửi sếp tổng kết tuần làm việc.",
      "targetPhrase": "xiàng zǒngjīnglǐ huìbào",
      "xpReward": 60,
      "badge": "Ngôi Sao Công Sở"
    }
  },
  {
    "id": "l-416",
    "chapterId": "ch-16",
    "levelId": "lvl-4",
    "lessonNumber": 1,
    "title": "Mua sắm online & Chat với chủ shop 客服",
    "chineseTitle": "网购挑选与联系客服",
    "subtitle": "Cách mua hàng Taobao, áp mã giảm giá, hỏi kích cỡ và chat với chăm sóc khách hàng.",
    "objective": "Làm chủ từ vựng thương mại điện tử: 下单, 优惠券, 包邮, 客服 và phó từ 究竟……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-16"
    ],
    "step1_learn": {
      "topic": "Mua sắm online & Chat với chủ shop 客服 - Trọng tâm HSK 4",
      "summary": "Cách mua hàng Taobao, áp mã giảm giá, hỏi kích cỡ và chat với chăm sóc khách hàng.",
      "keyTakeaways": [
        "Làm chủ từ vựng thương mại điện tử: 下单, 优惠券, 包邮, 客服 và phó từ 究竟……",
        "Làm chủ điểm ngữ pháp: 究竟…… (Rốt cuộc... / Suy cho cùng...)"
      ],
      "audioDemoText": "亲，全店包邮哦！今天下午四点前下单当天发货。"
    },
    "step2_vocabulary": [
      {
        "id": "v-416-1",
        "hanzi": "下单",
        "pinyin": "xiàdān",
        "hanviet": "Hạ đơn",
        "meaning": "Đặt hàng, tạo đơn hàng",
        "radical": "Bộ 一",
        "example": {
          "hanzi": "我刚在网上拍下了这款商品，已经下单了。",
          "pinyin": "Wǒ gāng zài wǎngshang pāixià le zhè kuǎn shāngpǐn, yǐjīng xiàdān le.",
          "meaning": "Tôi vừa mua món hàng này trên mạng, đã đặt đơn rồi."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-416-2",
        "hanzi": "优惠券",
        "pinyin": "yōuhuìquàn",
        "hanviet": "Ưu huệ khoán",
        "meaning": "Phiếu giảm giá, voucher",
        "radical": "Bộ 亻",
        "example": {
          "hanzi": "别忘了领取店铺的优惠券再付款。",
          "pinyin": "Bié wàng le lǐngqǔ diànpù de yōuhuìquàn zài fùkuǎn.",
          "meaning": "Đừng quên nhận phiếu giảm giá của shop rồi hãy thanh toán."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-416-3",
        "hanzi": "包邮",
        "pinyin": "bāoyóu",
        "hanviet": "Bao bưu",
        "meaning": "Miễn phí vận chuyển (Freeship)",
        "radical": "Bộ 勹",
        "example": {
          "hanzi": "满九十九元全场包邮。",
          "pinyin": "Mǎn jiǔshíjiǔ yuán quánchǎng bāoyóu.",
          "meaning": "Đơn đủ 99 tệ miễn phí vận chuyển toàn bộ."
        },
        "pos": "Cụm động tân / Tính từ"
      },
      {
        "id": "v-416-4",
        "hanzi": "客服",
        "pinyin": "kèfú",
        "hanviet": "Khách phục",
        "meaning": "Nhân viên chăm sóc khách hàng",
        "radical": "Bộ 口",
        "example": {
          "hanzi": "如果有疑问，可以直接咨询在线客服。",
          "pinyin": "Rúguǒ yǒu yíwèn, kěyǐ zhíjiē zīxún zàixiàn kèfú.",
          "meaning": "Nếu có thắc mắc, có thể hỏi trực tiếp CSKH online."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "券",
        "hanzi": "券",
        "pinyin": "quàn",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱𢍉刀",
        "radical": {
          "char": "刀",
          "name": "Đao",
          "strokes": 2
        },
        "meaning": "Phiếu, voucher, vé chứng từ",
        "strokesCount": 8,
        "strokeOrderText": "Phần trên 𢍉 (6 nét) -> Bộ Đao 刀 (2 nét)",
        "components": [
          "𢍉",
          "刀"
        ],
        "mnemonic": "Dùng dao (刀) cắt đôi mảnh giao ước bằng gỗ làm bằng chứng: phiếu giảm giá (优惠券)."
      },
      {
        "char": "邮",
        "hanzi": "邮",
        "pinyin": "yóu",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰由阝",
        "radical": {
          "char": "阝",
          "name": "Ấp",
          "strokes": 2
        },
        "meaning": "Bưu điện, gửi thư chuyển phát",
        "strokesCount": 7,
        "strokeOrderText": "Chữ Do 由 (5 nét) -> Bộ Ấp 阝 (2 nét)",
        "components": [
          "由",
          "阝"
        ],
        "mnemonic": "Trạm ngựa chuyển phát từ xóm ấp (阝) vì lý do (由) khẩn cấp: bưu điện (邮局), bao bưu (包邮)."
      }
    ],
    "step4_grammar": {
      "formula": "究竟…… (Rốt cuộc... / Suy cho cùng...)",
      "title": "Phó từ biểu thị sự truy cứu, nhấn mạnh ngữ khí nghi vấn",
      "explanation": "Thường dùng trong câu hỏi để nhấn mạnh mong muốn biết được sự thật cuối cùng.",
      "examples": [
        {
          "hanzi": "这件衣服究竟有没有现货？",
          "pinyin": "Zhè jiàn yīfu jiūjìng yǒuméiyǒu xiànhuò?",
          "meaning": "Chiếc áo này rốt cuộc có sẵn hàng hay không?"
        }
      ],
      "commonMistake": {
        "wrong": "究竟你买不买？",
        "correct": "你究竟买不买？",
        "explanation": "究竟 thường đặt sau chủ ngữ hoặc đầu câu hỏi."
      }
    },
    "step5_listening": {
      "situation": "Mua sắm trực tuyến trên sàn thương mại điện tử và chat với nhân viên chăm sóc khách hàng",
      "context": "Cửa sổ chat trực tuyến giữa khách hàng và nhân viên hỗ trợ shop Taobao",
      "participants": "A: Nhân viên chăm sóc khách hàng (客服), B: Người mua hàng online",
      "targetGoal": "Vận dụng phó từ nghi vấn 究竟…… (rốt cuộc / thực chất) và thuật ngữ e-Commerce (下单, 优惠券, 包邮, 客服)",
      "usageNotes": "\"亲\" (người thương/quý khách thân mến) và \"包邮\" (miễn phí vận chuyển) là ngôn ngữ đặc trưng nhất của thương mại điện tử Trung Quốc.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "亲，您好！欢迎光临官方旗舰店，请问有什么可以为您解答的吗？",
          "pinyin": "Qīn, nín hǎo! Huānyíng guānglín guānfāng qíjiàndiàn, qǐngwèn yǒu shénme kěyǐ wèi nín jiědá de ma?",
          "meaning": "Khách quý ơi xin chào! Chào mừng bạn ghé thăm cửa hàng flagship chính hãng, xin hỏi có điều gì shop giải đáp giúp bạn được không ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "客服你好，我想下单这件外套，请问现在店铺有满减优惠券可以领取吗？",
          "pinyin": "Kèfú nǐ hǎo, wǒ xiǎng xiàdān zhè jiàn wàitào, qǐngwèn xiànzài diànpù yǒu mǎnjiǎn yōuhuìquàn kěyǐ lǐngqǔ ma?",
          "meaning": "Chào bạn CSKH, tôi muốn đặt chiếc áo khoác này, xin hỏi hiện tại shop có voucher giảm giá đơn hàng đủ mức để nhận không?"
        },
        {
          "speaker": "A",
          "hanzi": "有的亲！首页可以领取满三百减五十的优惠券，而且全场现货包邮，顺丰速运直达。",
          "pinyin": "Yǒu de qīn! Shǒuyè kěyǐ lǐngqǔ mǎn sānbǎi jiǎn wǔshí de yōuhuìquàn, érqiě quánchǎng xiànhuò bāoyóu, Shùnfēng sùyùn zhídá.",
          "meaning": "Có chứ bạn ơi! Trang chủ có thể nhận voucher đơn 300 giảm 50 tệ, hơn nữa toàn sàn hàng sẵn freeship, chuyển phát nhanh SF giao tận nơi."
        },
        {
          "speaker": "B",
          "hanzi": "请问我身高一米七五，体重六十五公斤，究竟该选L码还是XL码更合适呢？",
          "pinyin": "Qǐngwèn wǒ shēngāo yì mǐ qī wǔ, tǐzhòng liùshíwǔ gōngjīn, jiūjìng gāi xuǎn L mǎ háishì XL mǎ gèng héshì ne?",
          "meaning": "Xin hỏi tôi cao 1m75, nặng 65kg, rốt cuộc nên chọn size L hay XL thì vừa vặn hơn vậy?"
        },
        {
          "speaker": "A",
          "hanzi": "根据您的身材数据，建议选L码修身显精神，如果喜欢宽松内搭毛衣可以选XL码。今天四点前下单当天发货哦！",
          "pinyin": "Gēnjù nín de shēncái shùjù, jiànyì xuǎn L mǎ xiūshēn xiǎn jīngshen, rúguǒ xǐhuan kuānsōng nèidā máoyī kěyǐ xuǎn XL mǎ. Jīntiān sì diǎn qián xiàdān dāngtiān fāhuò ó!",
          "meaning": "Căn cứ số đo vóc dáng của bạn, gợi ý chọn size L vừa vặn tôn dáng, nếu thích mặc rộng để phối áo len bên trong thì chọn XL. Đặt trước 4 giờ chiều hôm nay gửi hàng trong ngày luôn nhé!"
        }
      ],
      "audioText": "亲，您好！欢迎光临官方旗舰店，请问有什么可以为您解答的吗？客服你好，我想下单这件外套，请问现在店铺有满减优惠券可以领取吗？有的亲！首页可以领取满三百减五十的优惠券，而且全场现货包邮，顺丰速运直达。请问我身高一米七五，体重六十五公斤，究竟该选L码还是XL码更合适呢？根据您的身材数据，建议选L码修身显精神，如果喜欢宽松内搭毛衣可以选XL码。今天四点前下单当天发货哦！",
      "question": "Chính sách ưu đãi và vận chuyển của cửa hàng trực tuyến hiện tại là gì?",
      "options": [
        "Không giảm giá và khách tự chịu tiền ship",
        "Đơn 300 giảm 50 và miễn phí vận chuyển toàn sàn (满三百减五十，现货包邮)",
        "Phải mua 10 món mới được giảm giá",
        "Chỉ giao hàng vào cuối tuần"
      ],
      "correctIndex": 1,
      "explanation": "Nhân viên CSKH thông báo: \"首页可以领取满三百减五十的优惠券，而且全场现货包邮\" (Trang chủ có voucher đơn 300 giảm 50 và toàn sàn có sẵn freeship)."
    },
    "step6_speaking": {
      "prompt": "Hỏi chăm sóc khách hàng:",
      "targetSentence": "亲，请问这件衣服包邮吗？",
      "targetPinyin": "Qīn, qǐngwèn zhè jiàn yīfu bāoyóu ma?",
      "targetMeaning": "Shop ơi, chiếc áo này có miễn phí vận chuyển không?",
      "hint": "Dùng từ xưng hô '亲' thân thiện của Taobao."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Rốt cuộc bạn thích chiếc nào'",
      "words": [
        "究竟",
        "你",
        "哪一件",
        "喜欢"
      ],
      "correctOrder": [
        "你",
        "究竟",
        "喜欢",
        "哪一件"
      ],
      "explanation": "Cấu trúc Chủ ngữ + 究竟 + V..."
    },
    "step8_quiz": [
      {
        "id": "q-416-1",
        "type": "multiple-choice",
        "question": "Từ thân mật mà người bán hàng online ở Trung Quốc hay gọi khách hàng là gì?",
        "options": [
          "亲 (Thân ái / Bạn ơi)",
          "老头",
          "朋友",
          "先生"
        ],
        "correctIndex": 0,
        "explanation": "Trên Taobao, chủ shop luôn gọi khách là '亲' (qīn)."
      },
      {
        "id": "q-416-2",
        "type": "multiple-choice",
        "question": "Điền từ: '满一百元即可使用二十元____。'",
        "options": [
          "优惠券",
          "发票",
          "护照",
          "房卡"
        ],
        "correctIndex": 0,
        "explanation": "Phiếu giảm giá là 优惠券."
      }
    ],
    "step9_challenge": {
      "title": "Mua sắm Taobao",
      "taskDesc": "Thực hành chat với chủ shop hỏi màu sắc, kích cỡ và xin mã freeship.",
      "targetPhrase": "quán diàn bāoyóu",
      "xpReward": 60,
      "badge": "Tín Đồ Mua Sắm"
    }
  },
  {
    "id": "l-417",
    "chapterId": "ch-16",
    "levelId": "lvl-4",
    "lessonNumber": 2,
    "title": "Theo dõi vận chuyển & Nhận bưu phẩm",
    "chineseTitle": "物流跟踪与包裹签收",
    "subtitle": "Tra cứu mã vận đơn, kiểm tra lộ trình giao hàng và nhận hàng tại tủ thông minh.",
    "objective": "Nắm vững từ vựng chuyển phát: 物流, 快递, 单号, 派送 và phó từ 差不多……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-16"
    ],
    "step1_learn": {
      "topic": "Theo dõi vận chuyển & Nhận bưu phẩm - Trọng tâm HSK 4",
      "summary": "Tra cứu mã vận đơn, kiểm tra lộ trình giao hàng và nhận hàng tại tủ thông minh.",
      "keyTakeaways": [
        "Nắm vững từ vựng chuyển phát: 物流, 快递, 单号, 派送 và phó từ 差不多……",
        "Làm chủ điểm ngữ pháp: 差不多…… (Gần như / Xấp xỉ...)"
      ],
      "audioDemoText": "差不多半小时后到你家楼下，请准备签收。"
    },
    "step2_vocabulary": [
      {
        "id": "v-417-1",
        "hanzi": "物流",
        "pinyin": "wùliú",
        "hanviet": "Vật lưu",
        "meaning": "Ngành logistics, vận chuyển hàng hóa",
        "radical": "Bộ 牛",
        "example": {
          "hanzi": "现在的电商物流速度越来越快了。",
          "pinyin": "Xiànzài de diànshāng wùliú sùdù yuèláiyuè kuài le.",
          "meaning": "Tốc độ vận chuyển thương mại điện tử hiện nay ngày càng nhanh."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-417-2",
        "hanzi": "快递",
        "pinyin": "kuàidì",
        "hanviet": "Khoái đệ",
        "meaning": "Chuyển phát nhanh, bưu phẩm chuyển phát",
        "radical": "Bộ 辶",
        "example": {
          "hanzi": "楼下有你的一个顺丰快递。",
          "pinyin": "Lóuxià yǒu nǐ de yí gè Shùnfēng kuàidì.",
          "meaning": "Dưới tầng có một kiện hàng chuyển phát Thuận Phong của bạn."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-417-3",
        "hanzi": "单号",
        "pinyin": "dānhào",
        "hanviet": "Đơn hào",
        "meaning": "Mã vận đơn",
        "radical": "Bộ 十",
        "example": {
          "hanzi": "输入快递单号就可以查询位置。",
          "pinyin": "Shūrù kuàidì dānhào jiù kěyǐ cháxún wèizhi.",
          "meaning": "Nhập mã vận đơn là có thể tra cứu vị trí."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-417-4",
        "hanzi": "签收",
        "pinyin": "qiānshōu",
        "hanviet": "Thiêm thu",
        "meaning": "Ký nhận (bưu kiện)",
        "radical": "Bộ 竹",
        "example": {
          "hanzi": "包裹已经由小区蜂巢柜代签收了。",
          "pinyin": "Bāoguǒ yǐjīng yóu xiǎoqū fēngcháoguì dài qiānshōu le.",
          "meaning": "Bưu kiện đã được tủ đồ thông minh ký nhận hộ rồi."
        },
        "pos": "Động từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "递",
        "hanzi": "递",
        "pinyin": "dì",
        "structure": {
          "code": "semi_bottom_left",
          "name": "Bán bao vi dưới-trái (左下包围)",
          "symbol": "⿺"
        },
        "ids": "⿺辶弟",
        "radical": {
          "char": "辶",
          "name": "Quai sước",
          "strokes": 3
        },
        "meaning": "Chuyển giao, đưa tiếp, chuyển phát",
        "strokesCount": 10,
        "strokeOrderText": "Chữ Đệ 弟 (7 nét) -> Bộ Quai sước 辶 (3 nét)",
        "components": [
          "辶",
          "弟"
        ],
        "mnemonic": "Người em trai (弟) bước đi nhanh (辶) mang thư từ bưu phẩm trao tận tay: chuyển phát nhanh (快递)."
      },
      {
        "char": "签",
        "hanzi": "签",
        "pinyin": "qiān",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱竹佥",
        "radical": {
          "char": "竹",
          "name": "Trúc",
          "strokes": 6
        },
        "meaning": "Ký tên, thẻ tre, ký kết hợp đồng",
        "strokesCount": 13,
        "strokeOrderText": "Bộ Trúc 竹 (6 nét) -> Chữ Thiêm 佥 (7 nét)",
        "components": [
          "竹",
          "佥"
        ],
        "mnemonic": "Cây bút tre (竹) viết lời cam kết chung lòng (佥) của đôi bên: ký nhận (签收), ký tên (签字)."
      }
    ],
    "step4_grammar": {
      "formula": "差不多…… (Gần như / Xấp xỉ...)",
      "title": "Phó từ biểu thị mức độ xấp xỉ, sai số rất nhỏ",
      "explanation": "Dùng để ước lượng thời gian, số lượng hoặc trạng thái gần như hoàn tất.",
      "examples": [
        {
          "hanzi": "包裹差不多今天下午就能送到。",
          "pinyin": "Bāoguǒ chàbuduō jīntiān xiàwǔ jiù néng sòngdào.",
          "meaning": "Bưu kiện xấp xỉ chiều nay là có thể giao tới."
        }
      ],
      "commonMistake": {
        "wrong": "他差不多高我。",
        "correct": "他和我差不多高。",
        "explanation": "Khi so sánh tương đương dùng A và B 差不多 + Tính từ."
      }
    },
    "step5_listening": {
      "situation": "Tra cứu hành trình vận chuyển hàng hóa qua mã vận đơn và ký nhận bưu phẩm",
      "context": "Tại quầy trạm nhận bưu phẩm chuyển phát nhanh khu chung cư (Cainiao Station)",
      "participants": "A: Nhân viên giao nhận bưu phẩm chuyển phát, B: Cư dân nhận hàng",
      "targetGoal": "Vận dụng phó từ ước lượng 差不多…… (xấp xỉ / gần như) và quy trình logistics (物流, 快递, 单号, 签收)",
      "usageNotes": "\"菜鸟驿站\" (Trạm chuyển phát bưu phẩm thông minh) là nơi nhận bưu kiện bằng mã nhận hàng (取件码) rất phổ biến tại các khu dân cư Trung Quốc.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "您好，请出示您的取件码或者快递单号，我帮您查找包裹。",
          "pinyin": "Nín hǎo, qǐng chūshì nín de qǔjiànmǎ huòzhě kuàidì dānhào, wǒ bāng nín cházhǎo bāoguǒ.",
          "meaning": "Chào anh, xin vui lòng xuất trình mã lấy hàng hoặc mã vận đơn chuyển phát, tôi tìm bưu kiện giúp anh."
        },
        {
          "speaker": "B",
          "hanzi": "你好，取件码是三杠五零八，手机尾号是六六八八。物流信息显示今天早上刚签收入库。",
          "pinyin": "Nǐ hǎo, qǔjiànmǎ shì sān gàng wǔ líng bā, shǒujī wěihào shì liù liù bā bā. Wùliú xìnxī xiǎnshì jīntiān zǎoshang gāng qiānshōu rùkù.",
          "meaning": "Chào bạn, mã lấy hàng là 3-508, số đuôi điện thoại là 6688. Thông tin logistics hiển thị sáng nay vừa ký nhận nhập kho."
        },
        {
          "speaker": "A",
          "hanzi": "找到了，这是从杭州发过来的加急快递，差不多昨天下午发货，今天就送达了，真快！",
          "pinyin": "Zhǎodào le, zhè shì cóng Hángzhōu fā guòlai de jiājí kuàidì, chàbuduō zuótiān xiàwǔ fāhuò, jīntiān jiù sòngdá le, zhēn kuài!",
          "meaning": "Tìm thấy rồi, đây là chuyển phát hỏa tốc gửi từ Hàng Châu, xấp xỉ chiều hôm qua gửi hàng mà hôm nay đã giao tới rồi, nhanh thật!"
        },
        {
          "speaker": "B",
          "hanzi": "现在的物流速度确实越来越给力了。包裹外包装完好，需要我当面签收确认吗？",
          "pinyin": "Xiànzài de wùliú sùdù quèshí yuèláiyuè gěilì le. Bāoguǒ wàibāozhuāng wánhǎo, xūyào wǒ dāngmiàn qiānshōu quèrèn ma?",
          "meaning": "Tốc độ vận chuyển bây giờ quả thật ngày càng tuyệt vời. Bao bì bên ngoài nguyên vẹn, có cần tôi ký nhận xác nhận trực tiếp không?"
        },
        {
          "speaker": "A",
          "hanzi": "请在这里扫描身份码并签名即可，祝您拆箱愉快！",
          "pinyin": "Qǐng zài zhèlǐ sǎomiáo shēnfènmǎ bìng qiānmíng jíkě, zhù nín chāixiāng yúkuài!",
          "meaning": "Xin vui lòng quét mã định danh tại đây và ký tên là xong ạ, chúc bạn mở hộp vui vẻ!"
        }
      ],
      "audioText": "您好，请出示您的取件码或者快递单号，我帮您查找包裹。你好，取件码是三杠五零八，手机尾号是六六八八。物流信息显示今天早上刚签收入库。找到了，这是从杭州发过来的加急快递，差不多昨天下午发货，今天就送达了，真快！现在的物流速度确实越来越给力了。包裹外包装完好，需要我当面签收确认吗？请在这里扫描身份码并签名即可，祝您拆箱愉快！",
      "question": "Bưu phẩm chuyển phát nhanh được gửi từ thành phố nào tới?",
      "options": [
        "Bắc Kinh",
        "Hàng Châu (从杭州发过来)",
        "Quảng Châu",
        "Thành Đô"
      ],
      "correctIndex": 1,
      "explanation": "Nhân viên trạm thông báo rõ nguồn gốc bưu kiện: \"这是从杭州发过来的加急快递\" (Đây là chuyển phát hỏa tốc gửi từ Hàng Châu)."
    },
    "step6_speaking": {
      "prompt": "Kiểm tra vận chuyển:",
      "targetSentence": "输入快递单号，随时查看物流进度。",
      "targetPinyin": "Shūrù kuàidì dānhào, suíshí chákàn wùliú jìndù.",
      "targetMeaning": "Nhập mã vận đơn, kiểm tra tiến độ giao hàng bất cứ lúc nào.",
      "hint": "Phát âm chuẩn dānhào."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Bưu phẩm này xấp xỉ ngày mai tới'",
      "words": [
        "差不多",
        "这个包裹",
        "能送到",
        "明天"
      ],
      "correctOrder": [
        "这个包裹",
        "差不多",
        "明天",
        "能送到"
      ],
      "explanation": "Cấu trúc 差不多 đặt trước mốc thời gian ước lượng."
    },
    "step8_quiz": [
      {
        "id": "q-417-1",
        "type": "multiple-choice",
        "question": "Khi bưu kiện được giao đến nơi an toàn, hành động ký nhận gọi là gì?",
        "options": [
          "退货",
          "签收",
          "催单",
          "投诉"
        ],
        "correctIndex": 1,
        "explanation": "Ký nhận hàng là 签收 (qiānshōu)."
      },
      {
        "id": "q-417-2",
        "type": "multiple-choice",
        "question": "Điền từ: '我和他的中文水平____，都能过HSK 4级。'",
        "options": [
          "差不多",
          "甚至",
          "究竟",
          "千万"
        ],
        "correctIndex": 0,
        "explanation": "Tương đương nhau dùng 差不多."
      }
    ],
    "step9_challenge": {
      "title": "Theo dõi bưu kiện",
      "taskDesc": "Luyện nói câu tra cứu vận đơn và đối đáp khi shipper gọi điện giao hàng.",
      "targetPhrase": "qiānshōu kuàidì bāoguǒ",
      "xpReward": 60,
      "badge": "Chuyên Gia Logistics"
    }
  },
  {
    "id": "l-418",
    "chapterId": "ch-16",
    "levelId": "lvl-4",
    "lessonNumber": 3,
    "title": "Thanh toán di động WeChat Pay & Alipay",
    "chineseTitle": "移动支付微信与支付宝",
    "subtitle": "Cách quét mã QR thanh toán tiền mặt, chuyển khoản và gửi bao lì xì điện tử.",
    "objective": "Nắm vững từ vựng thanh toán số: 扫码, 转账, 余额, 零钱 và phó từ 随时……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-16"
    ],
    "step1_learn": {
      "topic": "Thanh toán di động WeChat Pay & Alipay - Trọng tâm HSK 4",
      "summary": "Cách quét mã QR thanh toán tiền mặt, chuyển khoản và gửi bao lì xì điện tử.",
      "keyTakeaways": [
        "Nắm vững từ vựng thanh toán số: 扫码, 转账, 余额, 零钱 và phó từ 随时……",
        "Làm chủ điểm ngữ pháp: 随时…… (Bất cứ lúc nào / Tùy ý)"
      ],
      "audioDemoText": "支持的，墙上贴着收款码，您扫一下就行。"
    },
    "step2_vocabulary": [
      {
        "id": "v-418-1",
        "hanzi": "扫码",
        "pinyin": "sǎomǎ",
        "hanviet": "Tảo mã",
        "meaning": "Quét mã QR",
        "radical": "Bộ 扌",
        "example": {
          "hanzi": "买单时支持微信和支付宝扫码。",
          "pinyin": "Mǎidān shí zhīchí wēixìn hé zhīfùbǎo sǎomǎ.",
          "meaning": "Khi thanh toán hỗ trợ quét mã WeChat và Alipay."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-418-2",
        "hanzi": "转账",
        "pinyin": "zhuǎnzhàng",
        "hanviet": "Chuyển trướng",
        "meaning": "Chuyển khoản (ngân hàng/ví điện tử)",
        "radical": "Bộ 车",
        "example": {
          "hanzi": "我把饭钱通过微信转账给你了。",
          "pinyin": "Wǒ bǎ fànqián tōngguò wēixìn zhuǎnzhàng gěi nǐ le.",
          "meaning": "Tôi đã chuyển khoản tiền cơm cho bạn qua WeChat rồi."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-418-3",
        "hanzi": "余额",
        "pinyin": "yú'é",
        "hanviet": "Dư ngạch",
        "meaning": "Số dư tài khoản",
        "radical": "Bộ 亻",
        "example": {
          "hanzi": "我的微信零钱余额还剩下五十块。",
          "pinyin": "Wǒ de wēixìn língqián yú'é hái shèngxià wǔshí kuài.",
          "meaning": "Số dư ví WeChat của tôi còn lại 50 tệ."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-418-4",
        "hanzi": "快捷",
        "pinyin": "kuàijié",
        "hanviet": "Khoái tiệp",
        "meaning": "Nhanh chóng, mau lẹ, thuận tiện (thanh toán di động)",
        "radical": "Bộ 忄 (Tâm)",
        "example": {
          "hanzi": "移动支付不仅安全，而且操作非常快捷。",
          "pinyin": "Yídòng zhìfù bùjǐn ānquán, érqiě cāozuò fēicháng kuàijié.",
          "meaning": "Thanh toán di động không những an toàn mà thao tác còn vô cùng nhanh chóng, tiện lợi."
        },
        "pos": "Tính từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "额",
        "hanzi": "额",
        "pinyin": "é",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰客页",
        "radical": {
          "char": "页",
          "name": "Hiệt (đầu)",
          "strokes": 6
        },
        "meaning": "Hạn mức, số ngạch, vầng trán",
        "strokesCount": 15,
        "strokeOrderText": "Chữ Khách 客 (9 nét) -> Bộ Hiệt 页 (6 nét)",
        "components": [
          "客",
          "页"
        ],
        "mnemonic": "Ghi nhận số lượng định mức trên đầu (页) của mỗi vị khách (客): số dư (余额), định mức (额度)."
      },
      {
        "char": "账",
        "hanzi": "账",
        "pinyin": "zhàng",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰贝长",
        "radical": {
          "char": "贝",
          "name": "Bối (tiền tài)",
          "strokes": 4
        },
        "meaning": "Sổ sách, hóa đơn, tài khoản kế toán",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Bối 贝 (4 nét) -> Chữ Trường 长 (4 nét)",
        "components": [
          "贝",
          "长"
        ],
        "mnemonic": "Ghi chép tiền của (贝) qua năm tháng lâu dài (长) vào sổ sách: chuyển khoản (转账), kết toán (结账)."
      }
    ],
    "step4_grammar": {
      "formula": "随时…… (Bất cứ lúc nào / Tùy ý)",
      "title": "Phó từ chỉ sự sẵn sàng trong mọi thời điểm",
      "explanation": "Đặt trước động từ để biểu thị hành động có thể thực hiện bất kể thời điểm nào mà không bị ràng buộc.",
      "examples": [
        {
          "hanzi": "移动支付让大家可以随时随地完成付款。",
          "pinyin": "Yídòng zhīfù ràng dàjiā kěyǐ suíshí-suídì wánchéng fùkuǎn.",
          "meaning": "Thanh toán di động giúp mọi người có thể thanh toán mọi lúc mọi nơi."
        }
      ],
      "commonMistake": {
        "wrong": "随时你来都可以。",
        "correct": "你随时来都可以。",
        "explanation": "Chủ ngữ thường đứng trước 随时."
      }
    },
    "step5_listening": {
      "situation": "Thanh toán di động bằng mã QR, chuyển khoản ví điện tử và kiểm tra số dư",
      "context": "Tại quầy thanh toán tiệm bánh mì và đồ uống trung tâm thương mại",
      "participants": "A: Nhân viên thu ngân quầy bánh ngọt, B: Khách hàng trẻ dùng điện thoại thanh toán",
      "targetGoal": "Vận dụng phó từ 随时…… (bất cứ lúc nào / tùy ý) và từ vựng thanh toán số (二维码, 转账, 余额, 快捷)",
      "usageNotes": "\"你扫我还是我扫你？\" — Nếu người mua giơ mã付款码 (mã thanh toán), thu ngân sẽ quét; nếu quán dán mã收款码 (mã nhận tiền), người mua sẽ tự quét.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "您好，一共是六十八块五毛，请问微信还是支付宝？",
          "pinyin": "Nín hǎo, yígòng shì liùshíbā kuài wǔ máo, qǐngwèn Wēixìn háishì Zhīfùbǎo?",
          "meaning": "Chào quý khách, tổng cộng là 68 tệ 5 hào, xin hỏi thanh toán qua WeChat hay Alipay ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "微信支付吧。请问是我扫台上的收款二维码，还是你扫我的付款码？",
          "pinyin": "Wēixìn zhìfù ba. Qǐngwèn shì wǒ sǎo tái shang de shōukuǎnmǎ èrwéimǎ, háishì nǐ sǎo wǒ de fùkuǎnmǎ?",
          "meaning": "WeChat Pay nhé. Xin hỏi là tôi quét mã QR nhận tiền trên quầy hay bạn quét mã thanh toán của tôi?"
        },
        {
          "speaker": "A",
          "hanzi": "您随时打开手机出示付款码就可以，我拿扫码枪扫一下，非常快捷。",
          "pinyin": "Nín suíshí dǎkāi shǒujī chūshì fùkuǎnmǎ jiù kěyǐ, wǒ ná sǎomǎqiāng sǎo yíxià, fēicháng kuàijié.",
          "meaning": "Bạn tùy ý mở điện thoại đưa mã thanh toán ra là được, tôi cầm máy quét lia một cái là xong, vô cùng nhanh chóng."
        },
        {
          "speaker": "B",
          "hanzi": "滴！付款成功了。我顺便查了一下零钱余额，平时出门不带现金真是太轻松了。",
          "pinyin": "Dī! Fùkuǎn chénggōng le. Wǒ shùnbiàn chá le yíxià língqián yú'é, píngshí chūmén bú dài xiànjīn zhēn shì tài qīngsōng le.",
          "meaning": "Tít! Thanh toán thành công rồi. Tôi tiện thể kiểm tra lại số dư tiền lẻ trong ví, bình thường ra ngoài không mang tiền mặt thật sự quá nhẹ nhõm."
        },
        {
          "speaker": "A",
          "hanzi": "是的，无论吃饭还是坐车，移动支付都能随时转账付款。这是您的小票，请拿好！",
          "pinyin": "Shì de, wúlùn chīfàn háishì zuòchē, yídòng zhìfù dōu néng suíshí zhuǎnzhàng fùkuǎn. Zhè shì nín de xiǎopiào, qǐng ná hǎo!",
          "meaning": "Đúng vậy, bất luận ăn cơm hay đi xe, thanh toán di động đều có thể chuyển khoản thanh toán mọi lúc. Đây là hóa đơn của bạn, xin cầm lấy ạ!"
        }
      ],
      "audioText": "您好，一共是六十八块五毛，请问微信还是支付宝？微信支付吧。请问是我扫台上的收款二维码，还是你扫我的付款码？您随时打开手机出示付款码就可以，我拿扫码枪扫一下，非常快捷。滴！付款成功了。我顺便查了一下零钱余额，平时出门不带现金真是太轻松了。是的，无论吃饭还是坐车，移动支付都能随时转账付款。这是您的小票，请拿好！",
      "question": "Hóa đơn mua hàng của khách thanh toán hết bao nhiêu tiền?",
      "options": [
        "50 tệ",
        "68 tệ 5 hào (六十八块五毛)",
        "100 tệ",
        "Miễn phí không mất tiền"
      ],
      "correctIndex": 1,
      "explanation": "Thu ngân thông báo rõ tổng số tiền cần thanh toán: \"一共是六十八块五毛\" (Tổng cộng là 68 tệ 5 hào)."
    },
    "step6_speaking": {
      "prompt": "Hỏi thanh toán:",
      "targetSentence": "老板，请问可以微信扫码转账吗？",
      "targetPinyin": "Lǎobǎn, qǐngwèn kěyǐ wēixìn sǎomǎ zhuǎnzhàng ma?",
      "targetMeaning": "Ông chủ ơi, có thể quét mã chuyển khoản WeChat không?",
      "hint": "Khẩu ngữ đời sống tự nhiên."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Bạn có thể chuyển khoản cho tôi bất cứ lúc nào'",
      "words": [
        "随时",
        "微信转账",
        "可以",
        "给我",
        "你"
      ],
      "correctOrder": [
        "你",
        "随时",
        "可以",
        "给我",
        "微信转账"
      ],
      "explanation": "Cấu trúc Chủ ngữ + 随时 + Có thể + Hành động."
    },
    "step8_quiz": [
      {
        "id": "q-418-1",
        "type": "multiple-choice",
        "question": "Hai ứng dụng thanh toán di động phổ biến nhất tại Trung Quốc là gì?",
        "options": [
          "Facebook & Google",
          "微信 (WeChat) & 支付宝 (Alipay)",
          "Zalo & Momo",
          "Twitter & Youtube"
        ],
        "correctIndex": 1,
        "explanation": "微信 và 支付宝 là 2 nền tảng thanh toán quốc dân tại TQ."
      },
      {
        "id": "q-418-2",
        "type": "multiple-choice",
        "question": "Điền từ: '有问题请____联系我们的工作人员。'",
        "options": [
          "随时",
          "究竟",
          "差不多",
          "千万"
        ],
        "correctIndex": 0,
        "explanation": "Liên hệ bất cứ lúc nào dùng 随时."
      }
    ],
    "step9_challenge": {
      "title": "Thanh toán số",
      "taskDesc": "Mô phỏng quét mã thanh toán bữa ăn tại nhà hàng Trung Quốc.",
      "targetPhrase": "wēixìn zhīfù sǎomǎ",
      "xpReward": 60,
      "badge": "Thổ Địa Công Nghệ"
    }
  },
  {
    "id": "l-419",
    "chapterId": "ch-16",
    "levelId": "lvl-4",
    "lessonNumber": 4,
    "title": "Đổi trả hàng online & Khiếu nại chất lượng",
    "chineseTitle": "售后申请与退换货流程",
    "subtitle": "Quy trình xin đổi size, trả hàng hoàn tiền và đánh giá dịch vụ sau bán hàng.",
    "objective": "Nắm vững từ vựng dịch vụ: 退货, 换货, 质量, 评价 và liên từ 哪怕……也……",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-16"
    ],
    "step1_learn": {
      "topic": "Đổi trả hàng online & Khiếu nại chất lượng - Trọng tâm HSK 4",
      "summary": "Quy trình xin đổi size, trả hàng hoàn tiền và đánh giá dịch vụ sau bán hàng.",
      "keyTakeaways": [
        "Nắm vững từ vựng dịch vụ: 退货, 换货, 质量, 评价 và liên từ 哪怕……也……",
        "Làm chủ điểm ngữ pháp: 哪怕……也…… (Cho dù... cũng...)"
      ],
      "audioDemoText": "可以的亲，只要吊牌没剪，随时支持七天无理由换货！"
    },
    "step2_vocabulary": [
      {
        "id": "v-419-1",
        "hanzi": "退货",
        "pinyin": "tuìhuò",
        "hanviet": "Thoái hóa",
        "meaning": "Trả hàng (hoàn tiền)",
        "radical": "Bộ 辶",
        "example": {
          "hanzi": "衣服尺寸不合适，我申请了退货。",
          "pinyin": "Yīfu chǐcun bù héshì, wǒ shēnqǐng le tuìhuò.",
          "meaning": "Kích cỡ áo không vừa, tôi đã nộp đơn trả hàng."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-419-2",
        "hanzi": "换货",
        "pinyin": "huànhuò",
        "hanviet": "Hoán hóa",
        "meaning": "Đổi hàng (đổi size, đổi màu)",
        "radical": "Bộ 扌",
        "example": {
          "hanzi": "如果质量有问题，七天内无理由换货。",
          "pinyin": "Rúguǒ zhìliàng yǒu wèntí, qī tiān nèi wú lǐyóu huànhuò.",
          "meaning": "Nếu chất lượng có vấn đề, đổi hàng vô điều kiện trong 7 ngày."
        },
        "pos": "Cụm động tân"
      },
      {
        "id": "v-419-3",
        "hanzi": "质量",
        "pinyin": "zhìliàng",
        "hanviet": "Chất lượng",
        "meaning": "Chất lượng",
        "radical": "Bộ 贝",
        "example": {
          "hanzi": "这家店的商品质量非常可靠。",
          "pinyin": "Zhè jiā diàn de shāngpǐn zhìliàng fēicháng kěkào.",
          "meaning": "Chất lượng hàng hóa của shop này rất đáng tin cậy."
        },
        "pos": "Danh từ"
      },
      {
        "id": "v-419-4",
        "hanzi": "评价",
        "pinyin": "píngjià",
        "hanviet": "Bình giá",
        "meaning": "Đánh giá, review",
        "radical": "Bộ 言",
        "example": {
          "hanzi": "确认收货后记得给卖家写一个好评。",
          "pinyin": "Quèrèn shōuhuò hòu jìde gěi màijiā xiě yí gè hǎopíng.",
          "meaning": "Sau khi xác nhận nhận hàng nhớ viết đánh giá tốt cho người bán."
        },
        "pos": "Động từ / Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "换",
        "hanzi": "换",
        "pinyin": "huàn",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰扌奂",
        "radical": {
          "char": "扌",
          "name": "Thủ",
          "strokes": 3
        },
        "meaning": "Hoán đổi, đổi chác, thay thế",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Thủ 扌 (3 nét) -> Chữ Hoán 奂 (7 nét)",
        "components": [
          "扌",
          "奂"
        ],
        "mnemonic": "Bàn tay (扌) đưa ra trao đổi lấy món đồ sáng rực rỡ (奂): đổi hàng (换货), đổi tiền (换钱)."
      },
      {
        "char": "评",
        "hanzi": "评",
        "pinyin": "píng",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰讠平",
        "radical": {
          "char": "讠",
          "name": "Ngôn",
          "strokes": 2
        },
        "meaning": "Đánh giá, nhận xét, bình phẩm",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Ngôn 讠 (2 nét) -> Chữ Bình 平 (5 nét)",
        "components": [
          "讠",
          "平"
        ],
        "mnemonic": "Dùng lời lẽ (讠) công tâm công bằng (平) để đưa ra nhận xét: đánh giá nhận xét (评价)."
      }
    ],
    "step4_grammar": {
      "formula": "哪怕……也…… (Cho dù... cũng...)",
      "title": "Cấu trúc liên từ giả thiết nhượng bộ",
      "explanation": "Biểu thị một giả thiết cực đoan nhưng kết quả hoặc quyết tâm vẫn không thay đổi.",
      "examples": [
        {
          "hanzi": "哪怕工作再忙，我也要每天抽出时间学汉语。",
          "pinyin": "Nǎpà gōngzuò zài máng, wǒ yě yào měitiān chōuchū shíjiān xué Hànyǔ.",
          "meaning": "Cho dù công việc có bận hơn nữa, tôi cũng phải dành thời gian học tiếng Trung mỗi ngày."
        }
      ],
      "commonMistake": {
        "wrong": "哪怕下雨，我也去。",
        "correct": "哪怕下大雨，我也要去。",
        "explanation": "Sau 哪怕 thường có mức độ cực đoan hơn."
      }
    },
    "step5_listening": {
      "situation": "Khiếu nại chất lượng sản phẩm và làm thủ tục đổi trả hàng online",
      "context": "Khách hàng liên hệ bộ phận hậu mãi sau khi nhận chiếc áo bị nhầm kích cỡ",
      "participants": "A: Nhân viên hậu mãi xử lý đổi trả, B: Khách hàng yêu cầu đổi size",
      "targetGoal": "Vận dụng liên từ nhượng bộ 哪怕……也…… (cho dù... cũng...) và quy trình đổi trả hàng (退货, 换货, 质量, 评价)",
      "usageNotes": "\"七天无理由退换货\" (7 ngày đổi trả không cần lý do) là quy định bảo vệ người tiêu dùng bắt buộc trên các sàn thương mại điện tử lớn tại Trung Quốc.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "您好，这里是售后客服中心，请问您购买的商品遇到什么质量问题了吗？",
          "pinyin": "Nín hǎo, zhèlǐ shì shòuhòu kèfú zhōngxīn, qǐngwèn nín gòumǎi de shāngpǐn yùdào shénme zhìliàng wèntí le ma?",
          "meaning": "Xin chào quý khách, đây là trung tâm CSKH hậu mãi, xin hỏi sản phẩm anh mua gặp vấn đề chất lượng gì vậy ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "你好，我前天收到的运动鞋尺码偏小，穿起来夹脚，我想申请换货或者退货。",
          "pinyin": "Nǐ hǎo, wǒ qiántiān shōudào de yùndòngxié chǐmǎ piān xiǎo, chuān qǐlai jiājiǎo, wǒ xiǎng shēnqǐng huànhuò huòzhě tuìhuò.",
          "meaning": "Chào bạn, đôi giày thể thao tôi nhận hôm kia kích cỡ hơi nhỏ, đi vào bị kích chân, tôi muốn làm đơn xin đổi hàng hoặc trả hàng."
        },
        {
          "speaker": "A",
          "hanzi": "非常抱歉给您带来不便！我们支持七天无理由退货，哪怕吊牌已经剪开，只要未穿出门磨损也可以办理换货。",
          "pinyin": "Fēicháng bàoqiàn gěi nín dàilái búbiàn! Wǒmen zhīchí qī tiān wú lǐyóu tuìhuò, nǎpà diàopái yǐjīng jiǎnkāi, zhǐyào wèi chuān chūmén mósǔn yě kěyǐ bànlǐ huànhuò.",
          "meaning": "Rất xin lỗi vì đã mang lại sự bất tiện cho anh! Chúng tôi hỗ trợ 7 ngày đổi trả không cần lý do, cho dù mác áo đã cắt, chỉ cần chưa đi ra ngoài gây mòn đế cũng có thể làm thủ tục đổi hàng."
        },
        {
          "speaker": "B",
          "hanzi": "鞋子完全是崭新的。请问换成大一码需要我承担运费吗？",
          "pinyin": "Xiézi wánquán shì zhǎnxīn de. Qǐngwèn huàn chéng dà yì mǎ xūyào wǒ chéngdān yùnfèi ma?",
          "meaning": "Giày hoàn toàn mới tinh. Xin hỏi đổi sang size lớn hơn một số thì tôi có phải chịu phí vận chuyển không?"
        },
        {
          "speaker": "A",
          "hanzi": "您下单时购买了运费险，快递员会上门免费取件。换货完成后请您在平台上给我们一个五星好评哦！",
          "pinyin": "Nín xiàdān shí gòumǎi le yùnfèixiǎn, kuàidìyuán huì shàngmén miǎnfèi qǔjiàn. Huànhuò wánchéng hòu qǐng nín zài píngtái shang gěi wǒmen yí gè wǔxīng hǎopíng ó!",
          "meaning": "Khi đặt hàng anh có mua bảo hiểm cước vận chuyển, shipper sẽ đến tận nhà lấy hàng miễn phí. Đổi hàng xong xuôi xin anh đánh giá 5 sao cho shop trên nền tảng nhé!"
        }
      ],
      "audioText": "您好，这里是售后客服中心，请问您购买的商品遇到什么质量问题了吗？你好，我前天收到的运动鞋尺码偏小，穿起来夹脚，我想申请换货或者退货。非常抱歉给您带来不便！我们支持七天无理由退货，哪怕吊牌已经剪开，只要未穿出门磨损也可以办理换货。鞋子完全是崭新的。请问换成大一码需要我承担运费吗？您下单时购买了运费险，快递员会上门免费取件。换货完成后请您在平台上给我们一个五星好评哦！",
      "question": "Tại sao khách hàng được shipper đến tận nhà lấy hàng đổi trả miễn phí không mất tiền ship?",
      "options": [
        "Vì khách hàng là người nhà của shop",
        "Vì khi đặt hàng khách đã mua bảo hiểm cước phí (购买了运费险)",
        "Vì shipper quen biết khách hàng",
        "Vì hàng bị vứt bỏ"
      ],
      "correctIndex": 1,
      "explanation": "Nhân viên CSKH giải thích: \"您下单时购买了运费险，快递员会上门免费取件\" (Khi đặt hàng bạn đã mua bảo hiểm vận chuyển nên shipper sẽ đến lấy hàng miễn phí)."
    },
    "step6_speaking": {
      "prompt": "Yêu cầu hỗ trợ hậu mãi:",
      "targetSentence": "衣服质量很好，给卖家全五星好评！",
      "targetPinyin": "Yīfu zhìliàng hěn hǎo, gěi màijiā quán wǔxīng hǎopíng!",
      "targetMeaning": "Chất lượng áo rất tốt, tặng người bán đánh giá 5 sao trọn vẹn!",
      "hint": "Giọng điệu hài lòng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Cho dù gặp khó khăn tôi cũng không từ bỏ'",
      "words": [
        "我也",
        "哪怕",
        "遇到困难",
        "决不放弃"
      ],
      "correctOrder": [
        "哪怕",
        "遇到困难",
        "我也",
        "决不放弃"
      ],
      "explanation": "Cấu trúc 哪怕...也..."
    },
    "step8_quiz": [
      {
        "id": "q-419-1",
        "type": "multiple-choice",
        "question": "Chính sách mua sắm được đổi trả trong 7 ngày không cần lý do gọi là gì?",
        "options": [
          "七天无理由退换货",
          "随时退款",
          "概不退换",
          "假一赔十"
        ],
        "correctIndex": 0,
        "explanation": "Đó là chính sách bảo vệ người tiêu dùng nổi tiếng: 七天无理由退换货."
      },
      {
        "id": "q-419-2",
        "type": "multiple-choice",
        "question": "Điền từ: '____遇到挫折，我们____要保持乐观。'",
        "options": [
          "哪怕...也...",
          "既然...就...",
          "因为...所以...",
          "不仅...而且..."
        ],
        "correctIndex": 0,
        "explanation": "Giả thiết nhượng bộ dùng 哪怕...也..."
      }
    ],
    "step9_challenge": {
      "title": "Hậu mãi mua sắm",
      "taskDesc": "Thực hành liên hệ chăm sóc khách hàng xin đổi size áo len trên app mua sắm.",
      "targetPhrase": "qī tiān wú lǐyóu huànhuò",
      "xpReward": 60,
      "badge": "Người Mua Thông Thái"
    }
  },
  {
    "id": "l-420",
    "chapterId": "ch-16",
    "levelId": "lvl-4",
    "lessonNumber": 5,
    "title": "Đại khảo hạch HSK 4 — Chinh phục Level 4",
    "chineseTitle": "HSK 4级终极实战大考核",
    "subtitle": "Tổng ôn toàn diện 1200 từ vựng và các cấu trúc ngữ pháp trọng điểm của toàn bộ cấp độ HSK 4.",
    "objective": "Tự tin bước qua cột mốc trung cấp, sẵn sàng cho các bài thi và giao tiếp độc lập.",
    "prerequisite": "Hoàn thành các bài trước thuộc HSK 4",
    "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 4",
      "Giao tiếp nâng cao",
      "Ngữ pháp chuyên sâu"
    ],
    "relatedMaterialIds": [
      "mat-ch-16"
    ],
    "step1_learn": {
      "topic": "Đại khảo hạch HSK 4 — Chinh phục Level 4 - Trọng tâm HSK 4",
      "summary": "Tổng ôn toàn diện 1200 từ vựng và các cấu trúc ngữ pháp trọng điểm của toàn bộ cấp độ HSK 4.",
      "keyTakeaways": [
        "Tự tin bước qua cột mốc trung cấp, sẵn sàng cho các bài thi và giao tiếp độc lập.",
        "Làm chủ điểm ngữ pháp: 经过…… (Trải qua... / Qua một quá trình...)"
      ],
      "audioDemoText": "太感谢老师了！这几个月的坚持终于有了回报！"
    },
    "step2_vocabulary": [
      {
        "id": "v-420-1",
        "hanzi": "流利",
        "pinyin": "liúlì",
        "hanviet": "Lưu lợi",
        "meaning": "Lưu loát, trôi chảy",
        "radical": "Bộ 氵",
        "example": {
          "hanzi": "经过一年的努力，他的汉语越来越流利了。",
          "pinyin": "Jīngguò yì nián de nǔlì, tā de Hànyǔ yuèláiyuè liúlì le.",
          "meaning": "Trải qua 1 năm nỗ lực, tiếng Trung của anh ấy ngày càng lưu loát."
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-420-2",
        "hanzi": "掌握",
        "pinyin": "zhǎngwò",
        "hanviet": "Chưởng ác",
        "meaning": "Nắm vững, làm chủ",
        "radical": "Bộ 扌",
        "example": {
          "hanzi": "我已经熟练掌握了HSK 4级的全部语法。",
          "pinyin": "Wǒ yǐjīng shúliàn zhǎngwò le HSK sì jí de quánbù yǔfǎ.",
          "meaning": "Tôi đã nắm vững thành thạo toàn bộ ngữ pháp của HSK 4."
        },
        "pos": "Động từ"
      },
      {
        "id": "v-420-3",
        "hanzi": "顺利",
        "pinyin": "shùnlì",
        "hanviet": "Thuận lợi",
        "meaning": "Thuận lợi, trôi chảy",
        "radical": "Bộ 页",
        "example": {
          "hanzi": "祝愿大家都能顺利通过这次大考！",
          "pinyin": "Zhùyuàn dàjiā dōu néng shùnlì tōngguò zhè cì dàkǎo!",
          "meaning": "Chúc mọi người đều có thể thuận lợi vượt qua kỳ đại khảo hạch này!"
        },
        "pos": "Tính từ"
      },
      {
        "id": "v-420-4",
        "hanzi": "坚持",
        "pinyin": "jiānchí",
        "hanviet": "Kiên trì",
        "meaning": "Kiên trì bền bỉ",
        "radical": "Bộ 土",
        "example": {
          "hanzi": "只要坚持下去，就一定能取得更大的成功。",
          "pinyin": "Zhǐyào jiānchí xiàqù, jiù yídìng néng qǔdé gèng dà de chénggōng.",
          "meaning": "Chỉ cần kiên trì tiếp tục thì nhất định sẽ đạt được thành công lớn hơn."
        },
        "pos": "Danh từ"
      }
    ],
    "step3_hanzi": [
      {
        "char": "握",
        "hanzi": "握",
        "pinyin": "wò",
        "structure": {
          "code": "left_right",
          "name": "Tả hữu (左右结构)",
          "symbol": "⿰"
        },
        "ids": "⿰扌屋",
        "radical": {
          "char": "扌",
          "name": "Thủ",
          "strokes": 3
        },
        "meaning": "Nắm chặt, làm chủ, kiểm soát",
        "strokesCount": 12,
        "strokeOrderText": "Bộ Thủ 扌 (3 nét) -> Chữ Ốc 屋 (9 nét)",
        "components": [
          "扌",
          "屋"
        ],
        "mnemonic": "Bàn tay (扌) bảo bọc trọn vẹn ngôi nhà ấm êm (屋): nắm vững kiến thức (掌握), bắt tay (握手)."
      },
      {
        "char": "熟",
        "hanzi": "熟",
        "pinyin": "shú",
        "structure": {
          "code": "top_bottom",
          "name": "Thượng hạ (上下结构)",
          "symbol": "⿱"
        },
        "ids": "⿱孰灬",
        "radical": {
          "char": "灬",
          "name": "Hỏa",
          "strokes": 4
        },
        "meaning": "Thành thục, quen thuộc, chín muồi",
        "strokesCount": 15,
        "strokeOrderText": "Chữ Thục 孰 (11 nét) -> Bộ Hỏa 灬 (4 nét)",
        "components": [
          "孰",
          "灬"
        ],
        "mnemonic": "Nấu nướng thức ăn trên ngọn lửa (灬) kỹ càng chín thấu: quen thuộc, thuần thục (熟悉, 熟练)."
      }
    ],
    "step4_grammar": {
      "formula": "经过…… (Trải qua... / Qua một quá trình...)",
      "title": "Giới từ chỉ quá trình biến đổi dẫn đến kết quả",
      "explanation": "Đặt cụm '经过 + Thời gian / Nỗ lực' ở đầu câu để làm trạng ngữ chỉ nguyên nhân tạo nên sự tiến bộ.",
      "examples": [
        {
          "hanzi": "经过不懈的努力，他的口语水平有了显著提高。",
          "pinyin": "Jīngguò búxiè de nǔlì, tā de kǒuyǔ shuǐpíng yǒu le xiǎnzhù tígāo.",
          "meaning": "Trải qua nỗ lực không ngừng, trình độ khẩu ngữ của anh ấy đã nâng cao rõ rệt."
        }
      ],
      "commonMistake": {
        "wrong": "经过他聪明。",
        "correct": "经过他的努力。",
        "explanation": "Sau 经过 phải là một quá trình hoặc hành động, không đi trực tiếp với tính từ."
      }
    },
    "step5_listening": {
      "situation": "Đại khảo hạch tốt nghiệp HSK 4, chia sẻ thành tựu và kế hoạch nghề nghiệp tương lai",
      "context": "Phỏng vấn kết khóa học và định hướng học lên cao cấp HSK 5–6",
      "participants": "A: Giáo viên hướng dẫn HSK 4, B: Học viên hoàn thành toàn diện cấp độ",
      "targetGoal": "Vận dụng cấu trúc 经过…… (trải qua...) để đúc kết thành tựu học tập (流利, 掌握, 圆满, 恒心)",
      "usageNotes": "\"持之以恒\" (kiên trì bền bỉ) là chìa khóa để vượt ngưỡng từ HSK 4 lên các bậc cao cấp HSK 5 và 6 trong công việc chuyên môn.",
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "祝贺你顺利通过HSK四级综合考评！经过这半年的刻苦努力，你的听说读写都有了质的飞跃。",
          "pinyin": "Zhùhè nǐ shùnlì tōngguò HSK sìjí zōnghé kǎopíng! Jīngguò zhè bàn nián de kèkǔ nǔlì, nǐ de tīng shuō dú xiě dōu yǒu le zhì de fēiyuè.",
          "meaning": "Chúc mừng em đã vượt qua kỳ thi đánh giá tổng hợp HSK 4 thuận lợi! Trải qua nửa năm nỗ lực khổ luyện này, năng lực nghe-nói-đọc-viết của em đã có bước nhảy vọt về chất."
        },
        {
          "speaker": "B",
          "hanzi": "谢谢老师悉心指导！我现在已经能够掌握一千二百多个核心词汇，并能用中文流利地进行日常与职场交流。",
          "pinyin": "Xièxie lǎoshī xīxīn zhǐdǎo! Wǒ xiànzài yǐjīng nénggòu zhǎngwò yìqiān èrbǎi duō gè héxīn cíhuì, bìng néng yòng Zhōngwén liúlì de jìnxíng rìcháng yǔ zhíchǎng jiāoliú.",
          "meaning": "Em cảm ơn thầy cô đã tận tình chỉ dạy! Hiện tại em đã có thể nắm vững hơn 1200 từ vựng cốt lõi, và có thể dùng tiếng Trung lưu loát để giao tiếp đời sống và công sở."
        },
        {
          "speaker": "A",
          "hanzi": "能够圆满完成四级的所有挑战，充分证明了你非凡的毅力与恒心。下一步有什么长远打算吗？",
          "pinyin": "Nénggòu yuánmǎn wánchéng sìjí de suǒyǒu tiǎozhàn, chōngfèn zhèngmíng le nǐ fēifán de yìlì yǔ héngxīn. Xià yí bù yǒu shénme chángyuǎn dǎsuan ma?",
          "meaning": "Có thể hoàn thành viên mãn tất cả thử thách của cấp 4 đã chứng minh đầy đủ nghị lực và lòng kiên trì phi thường của em. Bước tiếp theo em có dự định dài hạn nào chưa?"
        },
        {
          "speaker": "B",
          "hanzi": "我打算继续挑战高级HSK五级和商务中文，争取明年去跨国企业应聘外贸经理岗位！",
          "pinyin": "Wǒ dǎsuan jìxù tiǎozhàn gāojí HSK wǔjí hé shāngwù Zhōngwén, zhēngqǔ míngnián qù kuàguó qǐyè yìngpìn wàimào jīnglǐ gǎngwèi!",
          "meaning": "Em dự định tiếp tục chinh phục cao cấp HSK 5 và tiếng Trung thương mại, phấn đấu năm tới ứng tuyển vị trí quản lý ngoại thương tại doanh nghiệp đa quốc gia!"
        },
        {
          "speaker": "A",
          "hanzi": "有志者事竟成！只要你保持这份恒心，未来在国际职场舞台上一定大有作为，加油！",
          "pinyin": "Yǒu zhì zhě shì jìng chéng! Zhǐyào nǐ bǎochí zhè fèn héngxīn, wèilái zài guójì zhíchǎng wǔtái shang yídìng dàyǒuzuòwéi, jiāyóu!",
          "meaning": "Có chí thì nên! Chỉ cần em giữ vững lòng kiên trì này, tương lai trên vũ đài nghề nghiệp quốc tế nhất định sẽ làm nên nghiệp lớn, cố lên!"
        }
      ],
      "audioText": "祝贺你顺利通过HSK四级综合考评！经过这半年的刻苦努力，你的听说读写都有了质的飞跃。谢谢老师悉心指导！我现在已经能够掌握一千二百多个核心词汇，并能用中文流利地进行日常与职场交流。能够圆满完成四级的所有挑战，充分证明了你非凡的毅力与恒心。下一步有什么长远打算吗？我打算继续挑战高级HSK五级和商务中文，争取明年去跨国企业应聘外贸经理岗位！有志者事竟成！只要你保持这份恒心，未来在国际职场舞台上一定大有作为，加油！",
      "question": "Mục tiêu nghề nghiệp dài hạn của bạn học sau khi hoàn thành HSK 4 là gì?",
      "options": [
        "Nghỉ học tiếng Trung",
        "Chinh phục HSK 5 và ứng tuyển vị trí quản lý ngoại thương ở doanh nghiệp đa quốc gia (挑战HSK五级，应聘跨国企业外贸经理)",
        "Đi làm nông dân ở quê",
        "Học ngôn ngữ khác"
      ],
      "correctIndex": 1,
      "explanation": "Học viên chia sẻ ước mơ nghề nghiệp rõ ràng: \"打算继续挑战高级HSK五级和商务中文，争取明年去跨国企业应聘外贸经理岗位\" (Dự định tiếp tục chinh phục HSK 5 và tiếng Trung thương mại, ứng tuyển vị trí quản lý ngoại thương)."
    },
    "step6_speaking": {
      "prompt": "Lời tuyên bố quyết tâm:",
      "targetSentence": "我已全面掌握HSK 4级核心内容！",
      "targetPinyin": "Wǒ yǐ quánmiàn zhǎngwò HSK sì jí héxīn nèiróng!",
      "targetMeaning": "Tôi đã hoàn toàn làm chủ nội dung cốt lõi của HSK 4!",
      "hint": "Khí thế tự tin, phát âm hào sảng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: 'Trải qua nỗ lực anh ấy đã thi đỗ HSK 4'",
      "words": [
        "顺利通过了",
        "他",
        "经过努力",
        "HSK 4级"
      ],
      "correctOrder": [
        "经过努力",
        "他",
        "顺利通过了",
        "HSK 4级"
      ],
      "explanation": "Cấu trúc 经过 + Quá trình, Chủ ngữ + Vượt qua..."
    },
    "step8_quiz": [
      {
        "id": "q-420-1",
        "type": "multiple-choice",
        "question": "Điểm đạt yêu cầu (Passing Score) của kỳ thi HSK 4 chính thức là bao nhiêu điểm?",
        "options": [
          "120 / 300",
          "180 / 300",
          "200 / 300",
          "250 / 300"
        ],
        "correctIndex": 1,
        "explanation": "Theo quy chuẩn CTI, tổng điểm 180/300 trở lên là Đạt."
      },
      {
        "id": "q-420-2",
        "type": "multiple-choice",
        "question": "Điền từ: '____长时间的训练，队员们的配合越来越默契。'",
        "options": [
          "经过",
          "既然",
          "不仅",
          "哪怕"
        ],
        "correctIndex": 0,
        "explanation": "Chỉ quá trình dẫn đến kết quả tốt dùng 经过."
      }
    ],
    "step9_challenge": {
      "title": "Đại khảo hạch HSK 4",
      "taskDesc": "Hoàn thành toàn bộ bài kiểm tra tổng hợp và sẵn sàng tiến lên Level 5.",
      "targetPhrase": "shúliàn zhǎngwò HSK sì jí",
      "xpReward": 60,
      "badge": "Bậc Thầy Trung Cấp HSK 4"
    }
  }
];

export default HSK_4_LESSONS;
