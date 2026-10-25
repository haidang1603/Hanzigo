import json
import sys

# 45 new words for HSK 4 (15), HSK 5 (15), HSK 6 (15)
new_vocab = [
  # --- HSK 4 (15 items: 456 - 470) ---
  {
    "id": 456,
    "hanzi": "安排",
    "pinyin": "ānpái",
    "hanviet": "An bài",
    "meaning": "Sắp xếp, bố trí, thu xếp công việc",
    "level": "HSK 4",
    "topic": "Công việc",
    "radical": "扌 (Thủ)",
    "strokes": 17,
    "mnemonic": "Yên ổn (安) xếp thành hàng bài (排) trật tự chu đáo.",
    "example": {
      "hanzi": "经理已经安排好了下周的行程。",
      "pinyin": "Jīnglǐ yǐjīng ānpái hǎo le xià zhōu de xíngchéng.",
      "meaning": "Giám đốc đã sắp xếp xong lịch trình tuần sau."
    }
  },
  {
    "id": 457,
    "hanzi": "招聘",
    "pinyin": "zhāopìn",
    "hanviet": "Chiêu sính",
    "meaning": "Tuyển dụng, chiêu mộ nhân tài",
    "level": "HSK 4",
    "topic": "Công việc",
    "radical": "扌 (Thủ)",
    "strokes": 20,
    "mnemonic": "Vẫy tay mời gọi (招) người tài về làm việc (聘).",
    "example": {
      "hanzi": "我们公司正在招聘市场部经理。",
      "pinyin": "Wǒmen gōngsī zhèngzài zhāopìn shìchǎngbù jīnglǐ.",
      "meaning": "Công ty chúng tôi đang tuyển dụng trưởng phòng marketing."
    }
  },
  {
    "id": 458,
    "hanzi": "简历",
    "pinyin": "jiǎnlì",
    "hanviet": "Giản lịch",
    "meaning": "Sơ yếu lý lịch, CV",
    "level": "HSK 4",
    "topic": "Công việc",
    "radical": "竹 (Trúc)",
    "strokes": 17,
    "mnemonic": "Ghi chép tóm lược (简) các trải nghiệm đã qua (历).",
    "example": {
      "hanzi": "请在今天之内将个人简历发到人事部邮箱。",
      "pinyin": "Qǐng zài jīntiān zhīnèi jiāng gèrén jiǎnlì fā dào rénshìbù yóuxiāng.",
      "meaning": "Xin vui lòng gửi CV cá nhân vào hòm thư phòng nhân sự trong hôm nay."
    }
  },
  {
    "id": 459,
    "hanzi": "合同",
    "pinyin": "hétong",
    "hanviet": "Hợp đồng",
    "meaning": "Hợp đồng, khế ước ký kết",
    "level": "HSK 4",
    "topic": "Công việc",
    "radical": "口 (Khẩu)",
    "strokes": 12,
    "mnemonic": "Hai bên cùng miệng đồng thuận (同) hiệp nhất ý chí (合).",
    "example": {
      "hanzi": "双方已经在正式劳动合同上签字盖章。",
      "pinyin": "Shuāngfāng yǐjīng zài zhèngshì láodòng hétong shang qiānzì gàizhāng.",
      "meaning": "Hai bên đã ký tên đóng dấu vào hợp đồng lao động chính thức."
    }
  },
  {
    "id": 460,
    "hanzi": "负责",
    "pinyin": "fùzé",
    "hanviet": "Phụ trách",
    "meaning": "Chịu trách nhiệm, phụ trách, tận tâm",
    "level": "HSK 4",
    "topic": "Tính cách",
    "radical": "贝 (Bối)",
    "strokes": 20,
    "mnemonic": "Gánh trên lưng (负) trọng trách của tập thể (责).",
    "example": {
      "hanzi": "王经理对这个项目非常负责。",
      "pinyin": "Wáng jīnglǐ duì zhège xiàngmù fēicháng fùzé.",
      "meaning": "Giám đốc Vương rất có tinh thần trách nhiệm với dự án này."
    }
  },
  {
    "id": 461,
    "hanzi": "工资",
    "pinyin": "gōngzī",
    "hanviet": "Công tư",
    "meaning": "Tiền lương, thu nhập hàng tháng",
    "level": "HSK 4",
    "topic": "Đời sống",
    "radical": "工 (Công)",
    "strokes": 12,
    "mnemonic": "Thù lao tư tài (资) nhận được từ công sức bỏ ra (工).",
    "example": {
      "hanzi": "每个月十号是公司发工资的日子。",
      "pinyin": "Měi gè yuè shí hào shì gōngsī fā gōngzī de rìzi.",
      "meaning": "Mùng 10 hàng tháng là ngày công ty trả lương."
    }
  },
  {
    "id": 462,
    "hanzi": "奖金",
    "pinyin": "jiǎngjīn",
    "hanviet": "Tưởng kim",
    "meaning": "Tiền thưởng, hoa hồng",
    "level": "HSK 4",
    "topic": "Đời sống",
    "radical": "金 (Kim)",
    "strokes": 17,
    "mnemonic": "Tiền vàng (金) khen thưởng (奖) cho thành tích xuất sắc.",
    "example": {
      "hanzi": "因为业绩达标，团队获得了丰厚的年终奖金。",
      "pinyin": "Yīnwèi yèjì dābiāo, tuánduì huòdé le fēnghòu de niánzhōng jiǎngjīn.",
      "meaning": "Vì đạt chỉ tiêu KPI, đội ngũ đã nhận được tiền thưởng cuối năm hậu hĩnh."
    }
  },
  {
    "id": 463,
    "hanzi": "建议",
    "pinyin": "jiànyì",
    "hanviet": "Kiến nghị",
    "meaning": "Đề xuất, kiến nghị, lời khuyên",
    "level": "HSK 4",
    "topic": "Giao tiếp",
    "radical": "言 (Ngôn)",
    "strokes": 20,
    "mnemonic": "Nêu lên quan kiến (建) bằng lời nói chân thành (议).",
    "example": {
      "hanzi": "我建议大家在做决定前先做充分调研。",
      "pinyin": "Wǒ jiànyì dàjiā zài zuò juédìng qián xiān zuò chōngfèn diàoyán.",
      "meaning": "Tôi kiến nghị mọi người nên khảo sát kỹ trước khi ra quyết định."
    }
  },
  {
    "id": 464,
    "hanzi": "商量",
    "pinyin": "shāngliang",
    "hanviet": "Thương lượng",
    "meaning": "Bàn bạc, thảo luận, trao đổi ý kiến",
    "level": "HSK 4",
    "topic": "Giao tiếp",
    "radical": "口 (Khẩu)",
    "strokes": 23,
    "mnemonic": "Mở miệng thương lượng (商) đong đo cân nhắc kỹ càng (量).",
    "example": {
      "hanzi": "这件事需要跟家里人好好商量一下。",
      "pinyin": "Zhè jiàn shì xūyào gēn jiālǐ rén hǎohāo shāngliang yíxià.",
      "meaning": "Chuyện này cần bàn bạc kỹ lưỡng với người nhà một chút."
    }
  },
  {
    "id": 465,
    "hanzi": "态度",
    "pinyin": "tàidu",
    "hanviet": "Thái độ",
    "meaning": "Thái độ, tác phong làm việc",
    "level": "HSK 4",
    "topic": "Tính cách",
    "radical": "心 (Tâm)",
    "strokes": 17,
    "mnemonic": "Tâm thái bên trong (心) bộc lộ ra phong độ cử chỉ (度).",
    "example": {
      "hanzi": "积极乐观的态度能帮助我们克服许多困难。",
      "pinyin": "Jījí lèguān de tàidu néng bāngzhù wǒmen kèfú xǔduō kùnnan.",
      "meaning": "Thái độ tích cực lạc quan có thể giúp chúng ta vượt qua nhiều gian nan."
    }
  },
  {
    "id": 466,
    "hanzi": "礼貌",
    "pinyin": "lǐmào",
    "hanviet": "Lễ mạo",
    "meaning": "Lịch sự, lễ phép, phép tắc",
    "level": "HSK 4",
    "topic": "Tính cách",
    "radical": "礻 (Thị)",
    "strokes": 19,
    "mnemonic": "Lễ nghi chuẩn mực (礼) thể hiện qua diện mạo tác phong (貌).",
    "example": {
      "hanzi": "对长辈说话要有礼貌。",
      "pinyin": "Duì zhǎngbèi shuōhuà yào yǒu lǐmào.",
      "meaning": "Nói chuyện với người lớn tuổi phải có lễ phép."
    }
  },
  {
    "id": 467,
    "hanzi": "坚持",
    "pinyin": "jiānchí",
    "hanviet": "Kiên trì",
    "meaning": "Kiên trì, bền bỉ, giữ vững lập trường",
    "level": "HSK 4",
    "topic": "Tính cách",
    "radical": "土 (Thổ)",
    "strokes": 18,
    "mnemonic": "Vững như đá đất (坚) tay nắm chắc không buông (持).",
    "example": {
      "hanzi": "只要坚持每天背单词，你的词汇量一定会大增。",
      "pinyin": "Zhǐyào jiānchí měitiān bèi dāncí, nǐ de cíhuìliàng yídìng huì dà zēng.",
      "meaning": "Chỉ cần kiên trì học từ mỗi ngày, vốn từ của bạn nhất định sẽ tăng mạnh."
    }
  },
  {
    "id": 468,
    "hanzi": "精彩",
    "pinyin": "jīngcǎi",
    "hanviet": "Tinh thải",
    "meaning": "Đặc sắc, tuyệt vời, ấn tượng",
    "level": "HSK 4",
    "topic": "Nghệ thuật",
    "radical": "米 (Mễ)",
    "strokes": 28,
    "mnemonic": "Hạt ngọc tinh hoa (精) khoác lên sắc thái rực rỡ (彩).",
    "example": {
      "hanzi": "今晚的京剧表演非常精彩，赢得了满堂喝彩。",
      "pinyin": "Jīnwǎn de jīngjù biǎoyǎn fēicháng jīngcǎi, yíngdé le mǎntáng hècǎi.",
      "meaning": "Màn biểu diễn kinh kịch tối nay vô cùng đặc sắc, nhận trọn vẹn tràng pháo tay."
    }
  },
  {
    "id": 469,
    "hanzi": "丰富",
    "pinyin": "fēngfù",
    "hanviet": "Phong phú",
    "meaning": "Phong phú, dồi dào, đa dạng",
    "level": "HSK 4",
    "topic": "Học tập",
    "radical": "豆 (Đậu)",
    "strokes": 24,
    "mnemonic": "Đậu đầy mâm phong phú (丰) của cải sung túc đầy nhà (富).",
    "example": {
      "hanzi": "旅行能丰富我们的阅历和眼界。",
      "pinyin": "Lǚxíng néng fēngfù wǒmen de yuèlì hé yǎnjiè.",
      "meaning": "Du lịch có thể làm phong phú thêm trải nghiệm và tầm nhìn của chúng ta."
    }
  },
  {
    "id": 470,
    "hanzi": "保护",
    "pinyin": "bǎohù",
    "hanviet": "Bảo hộ",
    "meaning": "Bảo vệ, giữ gìn môi trường",
    "level": "HSK 4",
    "topic": "Môi trường",
    "radical": "亻 (Nhân đứng)",
    "strokes": 16,
    "mnemonic": "Người che chở bảo bọc (保) che chắn che chở cho nhau (护).",
    "example": {
      "hanzi": "保护环境是每一个公民应尽的责任。",
      "pinyin": "Bǎohù huánjìng shì měi yí gè gōngmín yīng jìn de zérèn.",
      "meaning": "Bảo vệ môi trường là trách nhiệm mà mỗi công dân nên thực hiện."
    }
  },

  # --- HSK 5 (15 items: 471 - 485) ---
  {
    "id": 471,
    "hanzi": "导致",
    "pinyin": "dǎozhì",
    "hanviet": "Đạo trí",
    "meaning": "Dẫn đến, gây ra (thường chỉ kết quả tiêu cực)",
    "level": "HSK 5-6",
    "topic": "Học thuật",
    "radical": "寸 (Thốn)",
    "strokes": 12,
    "mnemonic": "Dẫn đường chỉ lối (导) đi đến kết cục xấu (致).",
    "example": {
      "hanzi": "长期的熬夜会导致身体免疫力严重下降。",
      "pinyin": "Chángqī de áoyè huì dǎozhì shēntǐ miǎnyìlì yánzhòng xiàjiàng.",
      "meaning": "Thức đêm dài ngày sẽ dẫn đến hệ miễn dịch cơ thể suy giảm nghiêm trọng."
    }
  },
  {
    "id": 472,
    "hanzi": "甚至",
    "pinyin": "shènzhì",
    "hanviet": "Thậm chí",
    "meaning": "Thậm chí, ngay cả (liên từ tăng tiến)",
    "level": "HSK 5-6",
    "topic": "Ngữ pháp",
    "radical": "至 (Chí)",
    "strokes": 15,
    "mnemonic": "Mức độ cực điểm (甚) chạm tới tận cùng (至).",
    "example": {
      "hanzi": "他忙得连吃午饭的时间都没有，甚至忘了喝水。",
      "pinyin": "Tā máng de lián chī wǔfàn de shíjiān dōu méiyǒu, shènzhì wàng le hē shuǐ.",
      "meaning": "Anh ấy bận đến mức thời gian ăn trưa cũng không có, thậm chí quên cả uống nước."
    }
  },
  {
    "id": 473,
    "hanzi": "缓解",
    "pinyin": "huǎnjiě",
    "hanviet": "Hoãn giải",
    "meaning": "Xoa dịu, giảm bớt căng thẳng/áp lực",
    "level": "HSK 5-6",
    "topic": "Đời sống",
    "radical": "纟(Mịch)",
    "strokes": 24,
    "mnemonic": "Nới lỏng dây thắt từ từ (缓) cởi bỏ gút mắc (解).",
    "example": {
      "hanzi": "听轻音乐有助于缓解工作带来的焦虑情绪。",
      "pinyin": "Tīng qīng yīnyuè yǒuzhùyú huǎnjiě gōngzuò dàilái de jiāolǜ qíngxù.",
      "meaning": "Nghe nhạc nhẹ có tác dụng xoa dịu cảm giác âu lo do công việc gây ra."
    }
  },
  {
    "id": 474,
    "hanzi": "深刻",
    "pinyin": "shēnkè",
    "hanviet": "Thâm khắc",
    "meaning": "Sâu sắc, khắc sâu trong tâm trí",
    "level": "HSK 5-6",
    "topic": "Tư tưởng",
    "radical": "氵(Thủy)",
    "strokes": 18,
    "mnemonic": "Nước sâu nghìn trượng (深) khắc sâu vết tích không phai (刻).",
    "example": {
      "hanzi": "这次跨国志愿服务给我留下了极其深刻的印象。",
      "pinyin": "Zhè cì kuàguó zhìyuàn fúwù gěi wǒ liúxià le jíqí shēnkè de yìnxiàng.",
      "meaning": "Chuyến tình nguyện quốc tế lần này đã để lại ấn tượng vô cùng sâu sắc trong tôi."
    }
  },
  {
    "id": 475,
    "hanzi": "挑战",
    "pinyin": "tiǎozhàn",
    "hanviet": "Khiêu chiến",
    "meaning": "Thử thách, thách thức, đương đầu",
    "level": "HSK 5-6",
    "topic": "Công việc",
    "radical": "扌 (Thủ)",
    "strokes": 18,
    "mnemonic": "Dùng gậy khiêu khích (挑) bước vào trận chiến tôi luyện (战).",
    "example": {
      "hanzi": "敢于迎接未知挑战是年轻人成长的必经之路。",
      "pinyin": "Gǎnyú yíngjiē wèizhī tiǎozhàn shì niánqīngrén chéngzhǎng de bì jīng zhī lù.",
      "meaning": "Dám đón nhận thử thách chưa biết là con đường tất yếu để người trẻ trưởng thành."
    }
  },
  {
    "id": 476,
    "hanzi": "贡献",
    "pinyin": "gòngxiàn",
    "hanviet": "Cống hiến",
    "meaning": "Cống hiến, đóng góp công sức",
    "level": "HSK 5-6",
    "topic": "Xã hội",
    "radical": "贝 (Bối)",
    "strokes": 20,
    "mnemonic": "Dâng nộp vật báu (贡) hiến dâng hết mình cho cộng đồng (献).",
    "example": {
      "hanzi": "屠呦呦因发现青蒿素为全球疟疾防治作出了巨大贡献。",
      "pinyin": "Tú Yōuyōu yīn fāxiàn qīnghāosù wèi quánqiú nüèjí fángzhì zuòchū le jùdà gòngxiàn.",
      "meaning": "Đồ U U nhờ phát hiện Artemisinin đã đóng góp to lớn cho phòng chống sốt rét toàn cầu."
    }
  },
  {
    "id": 477,
    "hanzi": "独特",
    "pinyin": "dútè",
    "hanviet": "Độc đặc",
    "meaning": "Độc đáo, riêng biệt, khác biệt",
    "level": "HSK 5-6",
    "topic": "Nghệ thuật",
    "radical": "犭(Khuyển)",
    "strokes": 19,
    "mnemonic": "Đơn độc một mình (独) nổi trội xuất sắc (特).",
    "example": {
      "hanzi": "北京胡同拥有极其独特的市井建筑风格。",
      "pinyin": "Běijīng hútòng yōngyǒu jíqí dútè de shìjǐng jiànzhù fēnggé.",
      "meaning": "Ngõ hẻm Hồ Đồng Bắc Kinh sở hữu phong cách kiến trúc phố thị vô cùng độc đáo."
    }
  },
  {
    "id": 478,
    "hanzi": "逻辑",
    "pinyin": "luóji",
    "hanviet": "La tập",
    "meaning": "Logic, mạch lạc, lập luận chặt chẽ",
    "level": "HSK 5-6",
    "topic": "Tư duy",
    "radical": "糸 (Mịch)",
    "strokes": 23,
    "mnemonic": "Phiên âm từ Logic: dệt từng sợi tơ (逻) thu thập sắp xếp trật tự (辑).",
    "example": {
      "hanzi": "这篇学术论文论据严密，逻辑非常清晰。",
      "pinyin": "Zhè piān xuéshù lùnwén lùnjù yánmì, luóji fēicháng qīngxī.",
      "meaning": "Luận văn học thuật này dẫn chứng chặt chẽ, tư duy logic rất rõ ràng."
    }
  },
  {
    "id": 479,
    "hanzi": "趋势",
    "pinyin": "qūshì",
    "hanviet": "Xu thế",
    "meaning": "Xu thế, trào lưu, xu hướng phát triển",
    "level": "HSK 5-6",
    "topic": "Kinh tế",
    "radical": "走 (Tẩu)",
    "strokes": 27,
    "mnemonic": "Bước chân chạy theo (趋) thế trận dòng chảy tương lai (势).",
    "example": {
      "hanzi": "新能源汽车的普及已成为全球汽车产业的必然趋势。",
      "pinyin": "Xīnnéngyuán qìchē de pǔjí yǐ chéngwéi quánqiú qìchē chǎnyè de bìrán qūshì.",
      "meaning": "Sự phổ cập của xe năng lượng mới đã trở thành xu thế tất yếu của ngành ô tô toàn cầu."
    }
  },
  {
    "id": 480,
    "hanzi": "核心",
    "pinyin": "héxīn",
    "hanviet": "Hạch tâm",
    "meaning": "Cốt lõi, trọng tâm, hạt nhân",
    "level": "HSK 5-6",
    "topic": "Kinh tế",
    "radical": "木 (Mộc)",
    "strokes": 14,
    "mnemonic": "Hạt nhân bên trong quả cây (核) nằm ngay chính giữa trái tim (心).",
    "example": {
      "hanzi": "掌握自主知识产权是高新技术企业的核心竞争力。",
      "pinyin": "Zhǎngwò zìzhǔ zhīshichǎnquán shì gāoxīnjìshù qǐyè de héxīn jìngzhēnglì.",
      "meaning": "Nắm vững sở hữu trí tuệ tự chủ là năng lực cạnh tranh cốt lõi của doanh nghiệp công nghệ cao."
    }
  },
  {
    "id": 481,
    "hanzi": "体现",
    "pinyin": "tǐxiàn",
    "hanviet": "Thể hiện",
    "meaning": "Thể hiện, bộc lộ bản chất, phản ánh",
    "level": "HSK 5-6",
    "topic": "Tư tưởng",
    "radical": "亻 (Nhân đứng)",
    "strokes": 15,
    "mnemonic": "Toàn bộ cơ thể (体) hiện rõ diện mạo ra bên ngoài (现).",
    "example": {
      "hanzi": "无障碍设施的普及体现了城市对残障人士的人文关怀。",
      "pinyin": "Wúzhàng'ài shèshī de pǔjí tǐxiàn le chéngshì duì cánzhàng rénshì de rénwén guānhuái.",
      "meaning": "Việc phổ cập tiện ích không rào cản thể hiện sự quan tâm nhân văn của đô thị với người khuyết tật."
    }
  },
  {
    "id": 482,
    "hanzi": "协调",
    "pinyin": "xiétiáo",
    "hanviet": "Hiệp điều",
    "meaning": "Phối hợp, điều phối, hài hòa các bên",
    "level": "HSK 5-6",
    "topic": "Quản lý",
    "radical": "十 (Thập)",
    "strokes": 21,
    "mnemonic": "Hiệp lực cùng nhau (协) điều hòa nhịp điệu ăn ý (调).",
    "example": {
      "hanzi": "跨部门项目需要项目经理具备极强的沟通与协调能力。",
      "pinyin": "Kuà bìmén xiàngmù xūyào xiàngmù jīnglǐ jùbèi jí qiáng de gōutōng yǔ xiétiáo nénglì.",
      "meaning": "Dự án liên phòng ban đòi hỏi giám đốc dự án có năng lực giao tiếp và điều phối xuất sắc."
    }
  },
  {
    "id": 483,
    "hanzi": "启发",
    "pinyin": "qǐfā",
    "hanviet": "Khải phát",
    "meaning": "Khai sáng, gợi mở, truyền cảm hứng",
    "level": "HSK 5-6",
    "topic": "Giáo dục",
    "radical": "口 (Khẩu)",
    "strokes": 12,
    "mnemonic": "Mở miệng khơi nguồn (启) bộc phát tiềm năng trí tuệ (发).",
    "example": {
      "hanzi": "导师的一番话启发了我对毕业论文题目的新思考。",
      "pinyin": "Dǎoshī de yì fān huà qǐfā le wǒ duì bìyè lùnwén tímù de xīn sīkǎo.",
      "meaning": "Lời nói của thầy hướng dẫn đã gợi mở cho tôi suy nghĩ mới về đề tài luận văn tốt nghiệp."
    }
  },
  {
    "id": 484,
    "hanzi": "原则",
    "pinyin": "yuánzé",
    "hanviet": "Nguyên tắc",
    "meaning": "Nguyên tắc, chuẩn mực, ranh giới đạo đức",
    "level": "HSK 5-6",
    "topic": "Đạo đức",
    "radical": "厂 (Hán)",
    "strokes": 16,
    "mnemonic": "Cội nguồn gốc rễ (原) lập thành phép tắc quy chuẩn (则).",
    "example": {
      "hanzi": "在涉及法律与学术道德的问题上，绝不能放弃原则。",
      "pinyin": "Zài shèjí fǎlǜ yǔ xuéshù dàodé de wèntí shang, jué bù néng fàngqì yuánzé.",
      "meaning": "Đối với các vấn đề liên quan đến pháp luật và đạo đức học thuật, tuyệt đối không được từ bỏ nguyên tắc."
    }
  },
  {
    "id": 485,
    "hanzi": "综合",
    "pinyin": "zōnghé",
    "hanviet": "Tổng hợp",
    "meaning": "Tổng hợp, toàn diện, đa chiều",
    "level": "HSK 5-6",
    "topic": "Học thuật",
    "radical": "纟(Mịch)",
    "strokes": 17,
    "mnemonic": "Đan kết nhiều mối tơ (综) hợp nhất thành chỉnh thể (合).",
    "example": {
      "hanzi": "学生的期末成绩由平时表现和期末考卷综合评定。",
      "pinyin": "Xuéshēng de qīmò chéngjì yóu píngshí biǎoxiàn hé qīmò kǎojuàn zōnghé píngdìng.",
      "meaning": "Điểm cuối kỳ của học sinh được đánh giá tổng hợp từ biểu hiện thường ngày và bài thi kết thúc học phần."
    }
  },

  # --- HSK 6 (15 items: 486 - 500) ---
  {
    "id": 486,
    "hanzi": "和而不同",
    "pinyin": "hé ér bù tóng",
    "hanviet": "Hòa nhi bất đồng",
    "meaning": "Hòa hợp nhưng vẫn giữ nét riêng, tôn trọng dị biệt",
    "level": "HSK 5-6",
    "topic": "Thành ngữ",
    "radical": "口 (Khẩu)",
    "strokes": 24,
    "mnemonic": "Trích Luận Ngữ: Quân tử hòa hợp tương trợ mà không a dua theo nhau.",
    "example": {
      "hanzi": "不同文明之间应当倡导“和而不同”，在交流互鉴中共同繁荣。",
      "pinyin": "Bùtóng wénmíng zhījiān yīngdāng chàngdǎo “hé ér bù tóng”, zài jiāoliú hùjiàn zhōng gòngtóng fánróng.",
      "meaning": "Giữa các nền văn minh khác nhau nên chủ trương 'hòa nhi bất đồng', cùng phồn vinh trong giao lưu học hỏi."
    }
  },
  {
    "id": 487,
    "hanzi": "居安思危",
    "pinyin": "jū ān sī wēi",
    "hanviet": "Cư an tư nguy",
    "meaning": "Sống trong an bình phải nghĩ tới cơn nguy khó, lo xa",
    "level": "HSK 5-6",
    "topic": "Thành ngữ",
    "radical": "尸 (Thi)",
    "strokes": 26,
    "mnemonic": "Ở nơi bình an (居安) mà luôn suy xét hiểm họa tiềm tàng (思危).",
    "example": {
      "hanzi": "企业即使在盈利高峰期也应居安思危，预留足够的抗风险现金流。",
      "pinyin": "Qǐyè jíshǐ zài yínglì gāofēngqī yě yīng jū'ānsīwēi, yùliú zúgòu de kàng fēngxiǎn xiànjīnliú.",
      "meaning": "Doanh nghiệp ngay cả lúc đỉnh cao lợi nhuận cũng phải lo xa, dự phòng đủ dòng tiền chống chọi rủi ro."
    }
  },
  {
    "id": 488,
    "hanzi": "防微杜渐",
    "pinyin": "fáng wēi dù jiàn",
    "hanviet": "Phòng vi đỗ tiệm",
    "meaning": "Ngăn chặn mầm mống sai phạm từ lúc mới phát sinh",
    "level": "HSK 5-6",
    "topic": "Thành ngữ",
    "radical": "阝(Phụ)",
    "strokes": 38,
    "mnemonic": "Phòng ngừa cái vi tế nhỏ nhoi (防微) chặn đứng nguy cơ lan tràn (杜渐).",
    "example": {
      "hanzi": "工程质量安全必须防微杜渐，不放过任何细小的安全隐患。",
      "pinyin": "Gōngchéng zhìliàng ānquán bìxū fángwēidùjiàn, bú fàngguò rènhé xìxiǎo de ānquán yǐnhuàn.",
      "meaning": "Chất lượng an toàn công trình phải ngăn ngừa từ mầm mống, không bỏ qua bất cứ nguy cơ tiềm ẩn nhỏ nào."
    }
  },
  {
    "id": 489,
    "hanzi": "运筹帷幄",
    "pinyin": "yùn chóu wéi wò",
    "hanviet": "Vận trù duy ác",
    "meaning": "Bày mưu tính kế trong màn trướng, chỉ huy chiến lược tài tình",
    "level": "HSK 5-6",
    "topic": "Thành ngữ",
    "radical": "辶 (Sước)",
    "strokes": 45,
    "mnemonic": "Điển cố Hán Cao Tổ khen Trương Lương ngồi trong trướng trù tính chiến thắng ngàn dặm.",
    "example": {
      "hanzi": "凭借管理团队的运筹帷幄，公司成功在海外新兴市场站稳了脚跟。",
      "pinyin": "Píngjiè guǎnlǐ tuánduì de yùnchóuwéiwò, gōngsī chénggōng zài hǎiwài xīnxīng shìchǎng zhànwěn le jiǎogēn.",
      "meaning": "Nhờ vào sự hoạch định chiến lược tài tình của ban điều hành, công ty đã đứng vững tại thị trường mới nổi ở hải ngoại."
    }
  },
  {
    "id": 490,
    "hanzi": "源远流长",
    "pinyin": "yuán yuǎn liú cháng",
    "hanviet": "Nguyên viễn lưu trường",
    "meaning": "Nguồn gốc xa xưa dòng chảy dài lâu, lịch sử lâu đời",
    "level": "HSK 5-6",
    "topic": "Thành ngữ",
    "radical": "氵(Thủy)",
    "strokes": 38,
    "mnemonic": "Nguồn cội nước chảy (源) từ xa xưa (远) trường tồn mãi mãi (长).",
    "example": {
      "hanzi": "越中两国人民的传统友谊源远流长，历久弥坚。",
      "pinyin": "Yuè-Zhōng liǎng guó rénmín de chuántǒng yǒuyì yuányuǎnliúcháng, lì jiǔ mí jiān.",
      "meaning": "Tình hữu nghị truyền thống giữa nhân dân hai nước Việt - Trung có nguồn cội lâu đời, càng qua thử thách càng thêm bền chặt."
    }
  },
  {
    "id": 491,
    "hanzi": "颠覆",
    "pinyin": "diānfù",
    "hanviet": "Điên phúc",
    "meaning": "Lật đổ, đảo lộn hoàn toàn trật tự cũ",
    "level": "HSK 5-6",
    "topic": "Công nghệ",
    "radical": "页 (Hiệt)",
    "strokes": 34,
    "mnemonic": "Đỉnh đầu (颠) bị lật úp lại (覆).",
    "example": {
      "hanzi": "移动支付的普及彻底颠覆了人们传统的现金消费习惯。",
      "pinyin": "Yídòng zhīfù de pǔjí chèdǐ diānfù le rénmen chuántǒng de xiànjīn xiāofèi xíguàn.",
      "meaning": "Sự phổ biến của thanh toán di động đã hoàn toàn đảo lộn thói quen tiêu tiền mặt truyền thống."
    }
  },
  {
    "id": 492,
    "hanzi": "迭代",
    "pinyin": "diédài",
    "hanviet": "Điệp đại",
    "meaning": "Lặp vòng cải tiến, lặp thế hệ (công nghệ phần mềm)",
    "level": "HSK 5-6",
    "topic": "Công nghệ",
    "radical": "亻 (Nhân đứng)",
    "strokes": 16,
    "mnemonic": "Nhiều lần liên tiếp (叠) thay thế thế hệ cũ (代).",
    "example": {
      "hanzi": "软件开发团队通过快速敏捷迭代，每周向用户推送功能优化。",
      "pinyin": "Ruǎnjiàn kāifā tuánduì tōngguò kuàisù mǐnjié diédài, měi zhōu xiàng yònghù tuīsòng gōngnéng yōuhuà.",
      "meaning": "Đội ngũ phát triển phần mềm thông qua vòng lặp nhanh nhạy đã cập nhật tối ưu tính năng hàng tuần cho người dùng."
    }
  },
  {
    "id": 493,
    "hanzi": "赋能",
    "pinyin": "fùnéng",
    "hanviet": "Phú năng",
    "meaning": "Trao quyền năng, kích hoạt tiềm lực phát triển",
    "level": "HSK 5-6",
    "topic": "Kinh tế",
    "radical": "贝 (Bối)",
    "strokes": 22,
    "mnemonic": "Ban phú trao tặng (赋) năng lực và tiềm năng (能).",
    "example": {
      "hanzi": "大数据与云计算技术正全方位赋能现代农业与智能制造业。",
      "pinyin": "Dàshùjù yǔ yúnjìsuàn jìshù zhèng quánfāngwèi fùnéng xiàndài nóngyè yǔ zhìnéng zhìzàoyè.",
      "meaning": "Công nghệ dữ liệu lớn và điện toán đám mây đang trao quyền toàn diện cho nông nghiệp hiện đại và sản xuất thông minh."
    }
  },
  {
    "id": 494,
    "hanzi": "审辩",
    "pinyin": "shěnbiàn",
    "hanviet": "Thẩm biện",
    "meaning": "Tư duy phản biện, suy xét thấu đáo",
    "level": "HSK 5-6",
    "topic": "Tư duy",
    "radical": "宀 (Miên)",
    "strokes": 24,
    "mnemonic": "Thẩm tra kỹ càng (审) phân biệt lý lẽ chân ngụy (辩).",
    "example": {
      "hanzi": "大学教育的核心目标之一是培养具有独立审辩式思维的公民。",
      "pinyin": "Dàxué jiàoyù de héxīn mùbiāo zhī yī shì péiyǎng jùyǒu dúlì shěnbiànshì sīwéi de gōngmín.",
      "meaning": "Một trong những mục tiêu cốt lõi của giáo dục đại học là bồi dưỡng những công dân có tư duy phản biện độc lập."
    }
  },
  {
    "id": 495,
    "hanzi": "博大精深",
    "pinyin": "bó dà jīng shēn",
    "hanviet": "Bác đại tinh thâm",
    "meaning": "Rộng lớn uyên bác và tinh tế sâu sắc (văn hóa, tri thức)",
    "level": "HSK 5-6",
    "topic": "Thành ngữ",
    "radical": "十 (Thập)",
    "strokes": 40,
    "mnemonic": "Uyên bác rộng khắp (博大) tinh tế thâm sâu (精深).",
    "example": {
      "hanzi": "中医理论博大精深，蕴含着天人合一的东方系统思维。",
      "pinyin": "Zhōngyī lǐlùn bódà jīngshēn, yùnhán zhe tiānrén héyī de dōngfāng xìtǒng sīwéi.",
      "meaning": "Lý luận Đông y bác đại tinh thâm, hàm chứa tư duy hệ thống phương Đông về 'thiên nhân hợp nhất'."
    }
  },
  {
    "id": 496,
    "hanzi": "契约",
    "pinyin": "qìyuē",
    "hanviet": "Khế ước",
    "meaning": "Khế ước, cam kết ràng buộc pháp lý, tinh thần trọng tín",
    "level": "HSK 5-6",
    "topic": "Pháp luật",
    "radical": "大 (Đại)",
    "strokes": 15,
    "mnemonic": "Khắc dấu hẹn ước (契) ước định kết nối giữa hai bên (约).",
    "example": {
      "hanzi": "现代商业社会的健康运行必须建立在崇高的契约精神之上。",
      "pinyin": "Xiàndài shāngyè shèhuì de jiànkāng yùnxíng bìxū jiànlì zài chónggāo de qìyuē jīngshén zhī shàng.",
      "meaning": "Sự vận hành lành mạnh của xã hội thương mại hiện đại phải dựa trên tinh thần khế ước cao thượng."
    }
  },
  {
    "id": 497,
    "hanzi": "共赢",
    "pinyin": "gòngyíng",
    "hanviet": "Cộng doanh",
    "meaning": "Đôi bên cùng thắng, cùng có lợi (win-win)",
    "level": "HSK 5-6",
    "topic": "Kinh tế",
    "radical": "八 (Bát)",
    "strokes": 23,
    "mnemonic": "Cùng nhau hiệp sức (共) đạt được thắng lợi vinh quang (赢).",
    "example": {
      "hanzi": "坚持互利共赢的经贸策略是跨国企业立足国际市场的基石。",
      "pinyin": "Jiānchí hùlì gòngyíng de jīngmào cèlüè shì kuàguó qǐyè lìzú guójì shìchǎng de jīshí.",
      "meaning": "Kiên trì chiến lược kinh tế đôi bên cùng có lợi là nền tảng để doanh nghiệp đa quốc gia đứng vững trên thị trường quốc tế."
    }
  },
  {
    "id": 498,
    "hanzi": "鉴赏",
    "pinyin": "jiànshǎng",
    "hanviet": "Giám thưởng",
    "meaning": "Thưởng thức và thẩm định nghệ thuật",
    "level": "HSK 5-6",
    "topic": "Nghệ thuật",
    "radical": "金 (Kim)",
    "strokes": 27,
    "mnemonic": "Soi gương giám định (鉴) thưởng ngoạn giá trị tinh hoa (赏).",
    "example": {
      "hanzi": "阅读古代诗词不仅能陶冶情操，还能提升艺术鉴赏力。",
      "pinyin": "Yuèdú gǔdài shīcí bùjǐn néng táoyě qíngcáo, hái néng tíshēng yìshù jiànshǎnglì.",
      "meaning": "Đọc thơ từ cổ đại không chỉ bồi dưỡng tâm hồn mà còn nâng cao năng lực thẩm định nghệ thuật."
    }
  },
  {
    "id": 499,
    "hanzi": "宏观",
    "pinyin": "hóngguān",
    "hanviet": "Hoành quan",
    "meaning": "Vĩ mô, tầm nhìn bao quát toàn cục",
    "level": "HSK 5-6",
    "topic": "Kinh tế",
    "radical": "宀 (Miên)",
    "strokes": 25,
    "mnemonic": "To lớn bao la (宏) quan sát bao quát từ trên cao (观).",
    "example": {
      "hanzi": "国家采取积极的财政政策以加强宏观经济调控。",
      "pinyin": "Guójiā cǎiqǔ jījí de cáizhèng zhèngcè yǐ jiāqiáng hóngguān jīngjì tiáokòng.",
      "meaning": "Nhà nước áp dụng chính sách tài khóa tích cực để tăng cường điều tiết kinh tế vĩ mô."
    }
  },
  {
    "id": 500,
    "hanzi": "微观",
    "pinyin": "wēiguān",
    "hanviet": "Vi quan",
    "meaning": "Vi mô, chi tiết cụ thể ở mức phân tử/cá thể",
    "level": "HSK 5-6",
    "topic": "Khoa học",
    "radical": "彳 (Xích)",
    "strokes": 31,
    "mnemonic": "Vi tế nhỏ nhoi (微) quan sát tỉ mỉ từng chi tiết (观).",
    "example": {
      "hanzi": "从微观层面研究细胞衰老机制对于开发抗癌药物至关重要。",
      "pinyin": "Cóng wēiguān céngmiàn yánjiū xìbāo shuāilǎo jīzhì duìyú kāifā kàng'ái yàowù zhìguān zhòngyào.",
      "meaning": "Nghiên cứu cơ chế lão hóa tế bào từ góc độ vi mô có ý nghĩa sống còn đối với phát triển thuốc chống ung thư."
    }
  }
]

def main():
    target_path = r"d:\DELL\Dowloads\HanziGo\src\data\chineseData.js"
    with open(target_path, "r", encoding="utf-8") as f:
        content = f.read()

    marker = "export const TOPIC_FILTERS = ["
    if marker not in content:
        print("Cannot find TOPIC_FILTERS marker")
        sys.exit(1)

    parts = content.split(marker)
    vocab_part = parts[0]
    rest_part = parts[1]

    last_bracket_idx = vocab_part.rfind("];")
    if last_bracket_idx == -1:
        print("Cannot find ]; in vocab_part")
        sys.exit(1)

    items_json_str = ",\n" + ",\n".join(json.dumps(item, ensure_ascii=False, indent=2) for item in new_vocab)
    
    new_vocab_part = vocab_part[:last_bracket_idx].rstrip() + items_json_str + "\n];\n\n\n"
    final_content = new_vocab_part + marker + rest_part

    with open(target_path, "w", encoding="utf-8") as f:
        f.write(final_content)

    print(f"SUCCESS: Added {len(new_vocab)} words (456-500) to chineseData.js!")

if __name__ == "__main__":
    main()
