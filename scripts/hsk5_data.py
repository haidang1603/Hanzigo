# -*- coding: utf-8 -*-
"""
HSK 5 LESSON DATA: CHAPTERS 17 - 20 (l-501 to l-520 | 20 LESSONS)
"""

def get_hsk5_lessons(add_l):
    # =========================================================================
    # CHAPTER 17: Ẩm thực 8 trường phái & Trà đạo (l-501 to l-505)
    # =========================================================================
    add_l(
        "l-501", "ch-17", "lvl-5", 1, "Tám trường phái ẩm thực Trung Hoa", "中国八大菜系纵览",
        "Khám phá lịch sử, đặc trưng địa lý và phong cách nấu nướng của 8 trường phái ẩm thực lớn.",
        "Làm chủ từ vựng ẩm thực cao cấp: 菜系, 烹饪, 风味, 特色 và liên từ 所谓……",
        [
            ("菜系", "càixì", "Thái hệ", "Trường phái ẩm thực, phong cách món ăn", "艹", "中国饮食文化博大精深，有著名的八大菜系。", "Zhōngguó yǐnshí wénhuà bódà-jīngshēn, yǒu zhùmíng de bā dà càixì.", "Văn hóa ẩm thực Trung Quốc sâu rộng uyên bác, có 8 trường phái ẩm thực nổi tiếng."),
            ("烹饪", "pēngrèn", "Phanh nhẫm", "Nấu nướng, nghệ thuật chế biến ẩm thực", "灬", "中国烹饪讲究色、香、味、形俱全。", "Zhōngguó pēngrèn jiǎngjiu sè, xiāng, wèi, xíng jùquán.", "Nghệ thuật nấu ăn Trung Hoa chú trọng màu sắc, hương thơm, mùi vị và hình thức đều vẹn toàn."),
            ("风味", "fēngwèi", "Phong vị", "Hương vị đặc trưng vùng miền", "风", "每个地方的特色小吃都有独特的风味。", "Měi gè dìfang de tèsè xiǎochī dōu yǒu dútè de fēngwèi.", "Món ăn vặt đặc sản của mỗi vùng đều mang phong vị độc đáo."),
            ("所谓", "suǒwèi", "Sở vị", "Cái gọi là, cái được xem là", "斤", "所谓八大菜系，包括鲁菜、川菜、粤菜等。", "Suǒwèi bā dà càixì, bāokuò Lǔcài, Chuāncài, Yuècài děng.", "Cái gọi là 8 trường phái ẩm thực lớn bao gồm món Sơn Đông, món Tứ Xuyên, món Quảng Đông, v.v.")
        ],
        [("烹", "pēng", "Nấu nướng trên lửa", 11, "Ngang, khẩu...", "Bộ Hỏa (灬)", "Lửa đỏ nấu chín thực phẩm."),
         ("系", "xì", "Hệ thống, trường phái", 7, "Phẩy, ngang...", "Bộ Mịch (糸)", "Mối liên kết thành hệ thống.")],
        ("所谓…… (Cái gọi là... / Được định nghĩa là...)", "Cấu trúc giải thích khái niệm học thuật",
         "Dùng để dẫn dắt một định nghĩa hoặc giải thích rõ bản chất của một danh từ chuyên môn.",
         ("所谓工匠精神，就是精益求精的态度。", "Suǒwèi gōngjiàng jīngshén, jiù shì jīngyìqiújīng de tàidù.", "Cái gọi là tinh thần thợ thủ công chính là thái độ không ngừng hoàn thiện."),
         ("所谓是菜系。", "所谓的八大菜系。", "Không dùng 所谓 là động từ độc lập, thường đi cùng cụm danh từ.")),
        ([("A", "请问川菜和粤菜最大的区别是什么？", "Qǐngwèn Chuāncài hé Yuècài zuì dà de qūbié shì shénme?", "Xin hỏi sự khác biệt lớn nhất giữa món Tứ Xuyên và món Quảng Đông là gì?"),
          ("B", "川菜以麻辣浓郁著称，而粤菜则讲究原汁原味与鲜美清淡。", "Chuāncài yǐ málà nóngyù zhùchēng, ér Yuècài zé jiǎngjiu yuánzhī-yuánwèi yǔ xiānměi qīngdàn.", "Món Tứ Xuyên nổi tiếng với vị cay tê đậm đà, trong khi món Quảng Đông chú trọng vị nguyên bản và thanh ngọt tươi ngon.")],
         "川菜以麻辣浓郁著称，而粤菜则讲究原汁原味与鲜美清淡。", "Món Quảng Đông (粤菜) có đặc điểm nổi bật nào?", ["Cay nồng và nhiều ớt", "Tươi ngon, thanh đạm và giữ vị nguyên bản", "Rất ngọt và nhiều dầu mỡ", "Chua cay nồng nặc"], 1, "B giải thích: 粤菜讲究原汁原味与鲜美清淡."),
        ("Giới thiệu văn hóa ẩm thực:", "中国烹饪讲究色香味形俱全。", "Zhōngguó pēngrèn jiǎngjiu sè xiāng wèi xíng jùquán.", "Nấu nướng Trung Hoa chú trọng màu sắc, hương thơm, mùi vị và hình dạng vẹn toàn.", "Phát âm trang trọng, ngữ điệu truyền cảm."),
        ("Sắp xếp câu: 'Cái gọi là thành công chính là nỗ lực bền bỉ'", ["就是", "所谓的成功", "坚持不懈的努力"], ["所谓的成功", "就是", "坚持不懈的努力"], "Cấu trúc 所谓的... 就是..."),
        [("Tám trường phái ẩm thực lớn trong tiếng Trung được gọi là gì?", ["八大菜系", "八大名著", "四大发明", "四合院"], 0, "八大菜系 là 8 trường phái ẩm thực lớn của TQ."),
         ("Điền từ: '这道菜具有浓郁的四川本地____。'", ["风味", "附件", "押金", "房卡"], 0, "Hương vị vùng miền là 风味.")],
        ("Thuyết trình ẩm thực", "Giới thiệu ngắn 1 phút về một trường phái ẩm thực Trung Hoa mà bạn ấn tượng.", "sè xiāng wèi jùquán", "Học Giả Ẩm Thực HSK 5")
    )

    add_l(
        "l-502", "ch-17", "lvl-5", 2, "Vị cay tê Tứ Xuyên & Đậm đà Quảng Đông", "川菜麻辣与粤菜清鲜",
        "Phân tích sự khác biệt về gia vị, cách nêm nếm giữa vị cay nồng Tây Nam và vị thanh ngọt phương Nam.",
        "Nắm vững từ vựng khẩu vị: 麻辣, 清淡, 鲜美, 调料 và cấu trúc 与其……不如……",
        [
            ("麻辣", "málà", "Ma lạt", "Cay tê (vị cay kết hợp hoa tiêu và ớt)", "麻", "正宗的四川火锅以麻辣鲜香闻名。", "Zhèngzōng de Sìchuān huǒguō yǐ málà xiānxiāng wénmíng.", "Lẩu Tứ Xuyên chính gốc nổi tiếng bởi vị cay tê thơm nức."),
            ("清淡", "qīngdàn", "Thanh đạm", "Thanh đạm, ít dầu mỡ gia vị", "氵", "医生建议生病期间饮食尽量清淡。", "Yīshēng jiànyì shēngbìng qījiān yǐnshí jǐnliàng qīngdàn.", "Bác sĩ khuyên trong thời gian ốm ăn uống nên cố gắng thanh đạm."),
            ("鲜美", "xiānměi", "Tiên mỹ", "Tươi ngon, ngọt thịt/hải sản", "鱼", "广东的清蒸鲈鱼味道极其鲜美。", "Guǎngdōng de qīngzhēng lúyú wèidào jíqí xiānměi.", "Món cá vược hấp xì dầu của Quảng Đông vị cực kỳ tươi ngọt."),
            ("调料", "tiáoliào", "Điều liệu", "Gia vị nêm nếm", "讠", "烹饪时加入适量调料可以提升风味。", "Pēngrèn shí jiārù shìliàng tiáoliào kěyǐ tíshēng fēngwèi.", "Khi nấu ăn cho lượng gia vị thích hợp có thể tăng vị ngon.")
        ],
        [("辣", "là", "Cay nồng", 14, "Chấm, ngang...", "Bộ Tân (辛)", "Vị cay xé lưỡi."),
         ("鲜", "xiān", "Tươi sống, ngọt lành", 14, "Phẩy, ngang...", "Bộ Ngư (鱼)", "Kết hợp giữa Ngư (cá) và Dương (dê) tạo nên chữ Tiên tươi ngọt.")],
        ("与其……不如…… (Thà rằng... còn hơn... / Thay vì... thì thà...)", "Cấu trúc liên từ lựa chọn từ bỏ",
         "Biểu thị việc so sánh giữa hai phương án, dứt khoát chọn phương án sau và bỏ phương án trước.",
         ("与其在家里睡懒觉，不如去公园散步散心。", "Yǔqí zài jiālǐ shuìlǎnjiào, bùrú qù gōngyuán sànbù sànxīn.", "Thay vì ở nhà ngủ nướng, thà rằng đi dạo công viên thư giãn."),
         ("不如在家里，与其出去。", "与其在家里，不如出去。", "Vế 与其 luôn đứng trước vế 不如.")),
        ([("A", "今晚吃麻辣火锅还是吃粤式点心？", "Jīnwǎn chī málà huǒguō háishì chī Yuèshì diǎnxin?", "Tối nay ăn lẩu cay tê hay ăn dimsum Quảng Đông?"),
          ("B", "你嗓子不舒服，与其吃辛辣火锅，不如喝点清淡的热汤。", "Nǐ sǎngzi bù shūfu, yǔqí chī xīnlà huǒguō, bùrú hē diǎn qīngdàn de rètāng.", "Cổ họng bạn không khỏe, thay vì ăn lẩu cay nồng, thà húp chút canh nóng thanh đạm còn hơn.")],
         "与其吃辛辣火锅，不如喝点清淡的热汤。", "Người B đưa ra lựa chọn nào cho bữa tối?", ["Ăn lẩu cay tê Tứ Xuyên", "Uống chút canh nóng thanh đạm", "Nhịn ăn tối", "Ăn kem lạnh"], 1, "B khuyên: 不如喝点清淡的热汤."),
        ("Diễn đạt khẩu vị ăn uống:", "与其天天吃外卖，不如自己动手做饭。", "Yǔqí tiāntiān chī wàimài, bùrú zìjǐ dòngshǒu zuòfàn.", "Thay vì ngày nào cũng ăn đồ ship, thà rằng tự mình vào bếp nấu cơm.", "Ngắt giọng rõ ràng ở hai vế."),
        ("Sắp xếp câu: 'Thay vì phàn nàn thà hãy cố gắng hành động'", ["与其", "不如", "抱怨困难", "努力行动"], ["与其", "抱怨困难", "不如", "努力行动"], "Cấu trúc 与其...不如..."),
        [("Từ nào chỉ hương vị đặc trưng của ớt kết hợp với hoa tiêu trong món Tứ Xuyên?", ["麻辣 (Cay tê)", "酸甜 (Chua ngọt)", "苦涩 (Đắng chát)", "清淡 (Thanh đạm)"], 0, "麻辣 (málà) là hương vị cay tê trứ danh."),
         ("Điền từ: '与其坐着等待机会，____主动出击争取。'", ["不如", "甚至", "既然", "虽然"], 0, "Cặp từ lựa chọn: 与其……不如……")],
        ("So sánh khẩu vị", "So sánh khẩu vị ăn uống giữa miền Bắc và miền Nam Việt Nam bằng tiếng Trung.", "yǔqí... bùrú qīngdàn", "Chuyên Gia Ẩm Thực")
    )

    add_l(
        "l-503", "ch-17", "lvl-5", 3, "Nghệ thuật thưởng trà & Trà đạo", "中国传统茶文化与茶艺",
        "Văn hóa trà Trung Hoa: Lục trà, Hồng trà, Ô Long, Phổ Nhĩ và phong thái trà đạo.",
        "Làm chủ từ vựng trà nghệ: 品茶, 龙井, 普洱, 茶壶 và động từ 讲究……",
        [
            ("品茶", "pǐnchá", "Phẩm trà", "Thưởng thức trà, nhâm nhi trà", "口", "品茶不仅能解渴，更能修身养性。", "Pǐnchá bùjǐn néng jiěkě, gèng néng xiūshēn-yǎngxìng.", "Thưởng trà không chỉ giải khát mà còn có thể tu dưỡng tâm tính."),
            ("龙井", "lóngjǐng", "Long Tỉnh", "Trà Long Tỉnh (Tây Hồ, Hàng Châu)", "龙", "西湖龙井茶色泽翠绿，香气清高。", "Xīhú Lóngjǐng chá sèzé cuìlǜ, xiāngqì qīnggāo.", "Trà Long Tỉnh Tây Hồ sắc xanh biếc, hương thơm thanh khiết."),
            ("普洱", "pǔ'ěr", "Phổ Nhĩ", "Trà Phổ Nhĩ (Vân Nam)", "日", "云南普洱茶越陈越香，有助于消化。", "Yúnnán Pǔ'ěr chá yuè chén yuè xiāng, yǒuzhùyú xiāohuà.", "Trà Phổ Nhĩ Vân Nam càng để lâu càng thơm, giúp ích tiêu hóa."),
            ("讲究", "jiǎngjiu", "Giảng cứu", "Coi trọng, cầu kỳ, tinh tế", "讠", "中国茶艺冲泡过程非常讲究水温和时间。", "Zhōngguó cháyì chōngpào guòchéng fēicháng jiǎngjiu shuǐwēn hé shíjiān.", "Nghệ thuật pha trà Trung Quốc rất cầu kỳ về nhiệt độ nước và thời gian.")
        ],
        [("品", "pǐn", "Nếm, thưởng phẩm", 9, "Khẩu, khẩu...", "Bộ Khẩu (口)", "Ba chiếc miệng cùng nếm vị thơm ngon."),
         ("壶", "hú", "Ấm trà, bình nước", 10, "Ngang, thổ...", "Bộ Sĩ (士)", "Hình dáng chiếc ấm có nắp đậy.")],
        ("讲究…… (Coi trọng / Cầu kỳ về...)", "Động từ biểu thị sự chú trọng tiêu chuẩn cao",
         "Có thể làm động từ '讲究 + Tiêu chuẩn' hoặc làm tính từ biểu thị sự trang nhã, tinh tế.",
         ("茶道不仅讲究茶叶的品质，更讲究心境的平和。", "Chádào bùjǐn jiǎngjiu cháyè de pǐnzhì, gèng jiǎngjiu xīnjìng de pínghé.", "Trà đạo không chỉ coi trọng chất lượng lá trà mà còn chú trọng sự an yên của tâm cảnh."),
         ("他穿得很讲究衣服。", "他的穿着很讲究。", "Làm vị ngữ tính từ không mang tân ngữ danh từ sau nó.")),
        ([("A", "为什么冲泡不同种类的茶叶需要不同的水温？", "Wèishénme chōngpào bùtóng zhǒnglèi de cháyè xūyào bùtóng de shuǐwēn?", "Tại sao pha các loại trà khác nhau cần nhiệt độ nước khác nhau?"),
          ("B", "因为绿茶娇嫩讲究85度水温，而普洱熟茶则需要100度沸水激发醇香。", "Yīnwèi lǜchá jiāonèn jiǎngjiu bāshíwǔ dù shuǐwēn, ér Pǔ'ěr shúchá zé xūyào yìbǎi dù fèishuǐ jīfā chúnxiāng.", "Vì trà xanh non tơ chú trọng nước 85 độ, còn trà chín Phổ Nhĩ cần nước sôi 100 độ để đánh thức hương đậm đà.")],
         "因为绿茶娇嫩讲究85度水温，而普洱熟茶则需要100度沸水激发醇香。", "Pha trà xanh Long Tỉnh cần nhiệt độ nước bao nhiêu?", ["50 độ C", "85 độ C", "100 độ C", "Nước lạnh"], 1, "B giải thích: 绿茶娇嫩讲究85度水温."),
        ("Nói về nghệ thuật trà đạo:", "品茶在于静心，茶如人生。", "Pǐnchá zàiyú jìngxīn, chá rú rénshēng.", "Thưởng trà cốt ở tâm tĩnh, trà tựa đời người.", "Ngữ điệu sâu lắng, trầm ấm."),
        ("Sắp xếp câu: 'Nghệ thuật pha trà rất chú trọng việc chọn nước'", ["中国茶道", "非常讲究", "选水", "泡茶"], ["中国茶道", "泡茶", "非常讲究", "选水"], "Cấu trúc Chủ ngữ + Động từ + 讲究 + Tiêu chí."),
        [("Loại trà xanh trứ danh xuất xứ từ Hàng Châu có tên là gì?", ["铁观音 (Thiết Quan Âm)", "龙井茶 (Trà Long Tỉnh)", "大红袍 (Đại Hồng Bào)", "茉莉花茶 (Trà hoa nhài)"], 1, "西湖龙井 (Long Tỉnh Tây Hồ) là đệ nhất danh trà."),
         ("Điền từ: '这家茶馆的装修风格非常____。'", ["讲究", "甚至", "难免", "大略"], 0, "Trang trí tinh tế, cầu kỳ dùng 讲究.")],
        ("Trà đạo đàm đạo", "Ghi âm đoạn thuyết minh ngắn giới thiệu trà Phổ Nhĩ và tác dụng đối với sức khỏe.", "chádào jiǎngjiu xīnjìng", "Bậc Thầy Trà Nghệ")
    )

    add_l(
        "l-504", "ch-17", "lvl-5", 4, "Nghi thức trên bàn tiệc Trung Hoa", "中餐宴席礼仪与敬酒文化",
        "Quy tắc sắp xếp chỗ ngồi (chủ tọa, khách quý), nghi thức chúc rượu và phép lịch sự trên bàn ăn.",
        "Làm chủ từ vựng bàn tiệc: 座次, 敬酒, 规矩, 热情 và cấu trúc 不免……",
        [
            ("座次", "zuòcì", "Tọa thứ", "Thứ tự chỗ ngồi trên bàn tiệc", "广", "中餐宴席的座次安排非常体现长幼尊卑。", "Zhōngcān yànxí de zuòcì ānpái fēicháng tǐxiàn zhǎngyòu-zūnbēi.", "Việc sắp xếp chỗ ngồi trong tiệc Trung Hoa thể hiện rất rõ tôn ti trật tự."),
            ("敬酒", "jìngjiǔ", "Kính tửu", "Chúc rượu, mời rượu kính trọng", "攵", "敬酒时酒杯要稍微低于长辈或领导。", "Jìngjiǔ shí jiǔbēi yào shāowēi dīyú zhǎngbèi huò lǐngdǎo.", "Khi chúc rượu chén rượu phải hơi thấp hơn người lớn tuổi hoặc lãnh đạo."),
            ("规矩", "guīju", "Quy củ", "Quy củ, luật lệ, khuôn phép", "矢", "餐桌上的规矩虽然多，但也体现了传统礼仪。", "Cānzhuō shang de guīju suīrán duō, yě tǐxiàn le chuántǒng lǐyí.", "Quy củ trên bàn ăn tuy nhiều nhưng cũng thể hiện lễ nghi truyền thống."),
            ("不免", "bùmiǎn", "Bất miễn", "Khó tránh khỏi, không khỏi", "免", "初次参加正式宴席，年轻人不免有些拘谨。", "Chūcì cānjiā zhèngshì yànxí, niánqīngrén bùmiǎn yǒuxiē jūjǐn.", "Lần đầu tham gia yến tiệc trang trọng, người trẻ khó tránh khỏi có phần gượng gạo.")
        ],
        [("规", "guī", "Quy tắc, compa vẽ vòng", 8, "Ngang, phẩy...", "Bộ Kiến (见)", "Khuôn mẫu đo đạc."),
         ("矩", "jǔ", "Thước vuông, khuôn phép", 9, "Phẩy, ngang...", "Bộ Cự (巨)", "Thước vuông uốn nắn hành vi.")],
        ("不免…… (Khó tránh khỏi... / Không khỏi...)", "Phó từ chỉ xu hướng tất yếu của tâm lý hoặc hành vi",
         "Dùng để giải thích một trạng thái cảm xúc nảy sinh một cách tự nhiên trong hoàn cảnh nhất định.",
         ("离别之际，大家不免感到有些感伤。", "Líbié zhī jì, dàjiā bùmiǎn gǎndào yǒuxiē gǎnshāng.", "Thời khắc chia tay, mọi người khó tránh khỏi cảm thấy có chút ngậm ngùi."),
         ("他难免不免。", "他难免感到紧张 / 他不免有些紧张。", "不免 thường đi với trạng thái tâm lý; không dùng lặp lại难免.")),
        ([("A", "在中国参加商务宴请，敬酒有什么特别的礼仪吗？", "Zài Zhōngguó cānjiā shāngwù yànqǐng, jìngjiǔ yǒu shénme tèbié de lǐyí ma?", "Tham gia tiệc kinh doanh ở Trung Quốc, mời rượu có lễ nghi đặc biệt nào không?"),
          ("B", "敬酒时要双手持杯，并且自己的杯沿要略低于长辈或客户以示尊重。", "Jìngjiǔ shí yào shuāngshǒu chí bēi, bìngqiě zìjǐ de bēiyán yào lüè dīyú zhǎngbèi huò kèhù yǐ shì zūnzhòng.", "Khi chúc rượu phải cầm chén bằng hai tay, và vành chén của mình hơi thấp hơn người lớn hoặc khách hàng để tỏ lòng tôn trọng.")],
         "敬酒时要双手持杯，并且自己的杯沿要略低于长辈或客户以示尊重。", "Khi nâng chén chúc rượu người lớn tuổi, mép chén của mình nên đặt thế nào?", ["Cao hơn hẳn người lớn", "Hơi thấp hơn chén của người lớn tuổi", "Chạm vào đáy chén người khác", "Đặt xuống bàn"], 1, "Lễ nghi: 杯沿要略低于长辈以示尊重."),
        ("Lời chúc rượu lịch thiệp:", "借此机会，我敬各位一杯，祝大家合作共赢！", "Jiè cǐ jīhuì, wǒ jìng gèwèi yì bēi, zhù dàjiā hézuò gòngyíng!", "Nhân cơ hội này, tôi xin kính mọi người một chén, chúc chúng ta hợp tác đôi bên cùng thắng!", "Phong thái tự tin, nâng chén hai tay."),
        ("Sắp xếp câu: 'Lần đầu đi làm anh ấy khó tránh khỏi lo lắng'", ["初次上班", "感到紧张", "他", "不免"], ["初次上班", "他", "不免", "感到紧张"], "Cấu trúc Chủ ngữ + 不免 + Cảm xúc."),
        [("Khi cụng ly chúc rượu bậc tiền bối trong văn hóa Trung Hoa, hành động nào thể hiện sự khiêm nhường?", ["Đưa chén thật cao", "Để vành ly của mình thấp hơn đối phương", "Chỉ dùng một tay", "Quay lưng đi"], 1, "Hạ thấp vành ly thể hiện sự tôn kính và khiêm tốn."),
         ("Điền từ: '分别多年再次重逢，老同学心中____感慨万千。'", ["不免", "所谓", "究竟", "与其"], 0, "Cảm xúc khó tránh khỏi trào dâng dùng 不免.")],
        ("Nghi thức bàn tiệc", "Mô phỏng bài phát biểu chúc rượu ngắn gọn, trang trọng trong bữa tiệc ký kết hợp đồng.", "hézuò gòngyíng jìngjiǔ", "Ngoại Giao Yến Tiệc")
    )

    add_l(
        "l-505", "ch-17", "lvl-5", 5, "Giao lưu & Dung hợp văn hóa ẩm thực", "饮食文化交流与融合",
        "Sự giao thoa giữa phở Việt Nam và mì Trung Hoa, ẩm thực truyền thống thích nghi với hiện đại.",
        "Làm chủ từ vựng giao lưu văn hóa: 融合, 传承, 体验, 赞不绝口 và liên từ 总之……",
        [
            ("融合", "rónghé", "Dung hợp", "Dung hòa, hòa quyện, kết hợp", "虫", "现代饮食文化是传统与创新的完美融合。", "Xiàndài yǐnshí wénhuà shì chuántǒng yǔ chuàngxīn de wánměi rónghé.", "Văn hóa ẩm thực hiện đại là sự hòa quyện hoàn mỹ giữa truyền thống và đổi mới."),
            ("传承", "chuánchéng", "Truyền thừa", "Kế thừa và lưu truyền", "亻", "老字号手艺人默默传承着非物质文化遗产。", "Lǎozìhào shǒuyìrén mòmò chuánchéng zhe fēiwùzhì wénhuà yíchǎn.", "Nghệ nhân các hiệu lâu đời âm thầm kế thừa di sản văn hóa phi vật thể."),
            ("体验", "tǐyàn", "Thể nghiệm", "Trải nghiệm thực tế", "马", "来到北京一定要亲自体验一下地道的烤鸭。", "Láidào Běijīng yídìng yào qīnzì tǐyàn yíxià dìdao de kǎoyā.", "Đến Bắc Kinh nhất định phải đích thân trải nghiệm món vịt quay chính hiệu."),
            ("赞不绝口", "zànbùjuékǒu", "Tán bất tuyệt khẩu", "Khen ngợi không ngớt lời (Thành ngữ)", "言", "外国游客对越南的牛肉河粉赞不绝口。", "Wàiguó yóukè duì Yuènán de niúròu héfěn zànbùjuékǒu.", "Du khách nước ngoài khen ngợi phở bò Việt Nam không ngớt lời.")
        ],
        [("融", "róng", "Tan chảy, hòa hợp", 16, "Ngang, khẩu...", "Bộ Trùng (虫)", "Băng tuyết tan hòa vào dòng nước."),
         ("承", "chéng", "Gánh vác, đón nhận", 8, "Ngang gập, sổ móc...", "Bộ Thủ (手)", "Đôi tay nâng niu tiếp nối.")],
        ("总之…… (Nói tóm lại / Tóm lại...)", "Liên từ tổng kết, quy nạp luận điểm",
         "Đặt ở đầu câu kết đoạn để thâu tóm toàn bộ ý kiến đã trình bày phía trước.",
         ("总之，饮食不仅是满足口腹之欲，更是一种文化认同。", "Zǒngzhī, yǐnshí bùjǐn shì mǎnzú kǒufù zhī yù, gèng shì yì zhǒng wénhuà rèntóng.", "Tóm lại, ăn uống không chỉ thỏa mãn cơn thèm ăn mà còn là sự đồng điệu văn hóa."),
         ("总之很好。", "总之，这个方案很好。", "Sau 总之 thường có dấu phẩy ngắt nhịp.")),
        ([("A", "河内街头的中餐厅和北京的越南餐厅越来越多了。", "Hénèi jiētóu de zhōngcāntīng hé Běijīng de Yuènán cāntīng yuèláiyuè duō le.", "Quán ăn Trung Quốc trên phố Hà Nội và quán Việt Nam tại Bắc Kinh ngày càng nhiều."),
          ("B", "是的，美食是最好的文化桥梁，食客们都赞不绝口。", "Shì de, měishí shì zuì hǎo de wénhuà qiáoliáng, shíkè men dōu zànbùjuékǒu.", "Đúng vậy, ẩm thực là cây cầu văn hóa tuyệt vời nhất, thực khách đều tấm tắc khen ngợi.")],
         "美食是最好的文化桥梁，食客们都赞不绝口。", "Thực khách có thái độ thế nào đối với các món ăn giao lưu?", ["Chê bai không hợp khẩu vị", "Khen ngợi hết lời (赞不绝口)", "Không quan tâm", "Từ chối trải nghiệm"], 1, "Thái độ: 食客们都赞不绝口."),
        ("Thành ngữ khen ngợi:", "这道菜色香味俱全，令人赞不绝口！", "Zhè dào cài sè xiāng wèi jùquán, lìng rén zànbùjuékǒu!", "Món ăn này sắc hương vị vẹn toàn, khiến người ta khen không ngớt lời!", "Ngữ điệu trầm trồ thán phục."),
        ("Sắp xếp câu: 'Nói tóm lại ẩm thực chính là văn hóa'", ["饮食", "就是", "文化", "总之"], ["总之", "饮食", "就是", "文化"], "总之 đứng đầu câu tổng kết."),
        [("Thành ngữ bốn chữ nào mang nghĩa 'khen ngợi liên tục không ngừng miệng'?", ["赞不绝口", "不见不散", "半途而废", "塞翁失马"], 0, "赞不绝口 (zànbùjuékǒu) là khen không ngớt lời."),
         ("Điền từ: '____，只要我们共同努力，就一定能克服难关。'", ["总之", "不免", "与其", "哪怕"], 0, "Đầu câu tổng luận dùng 总之.")],
        ("Tổng kết Chương 17", "Viết đoạn văn ngắn 80 chữ về sự tương đồng và giao lưu giữa ẩm thực Việt - Trung.", "zànbùjuékǒu měishí", "Nhà Phê Bình Ẩm Thực")
    )

    # =========================================================================
    # CHAPTER 18: Ngôn ngữ mạng & Douyin Slang (l-506 to l-510)
    # =========================================================================
    add_l(
        "l-506", "ch-18", "lvl-5", 1, "Trào lưu ngôn ngữ mạng thịnh hành", "流行网络用语新风尚",
        "Hiểu và sử dụng các thuật ngữ mạng Douyin, Weibo: 点赞, 转发, 刷屏, 热门 và phó từ 甚至……",
        "Bắt kịp nhịp sống số của giới trẻ Trung Quốc và tránh dịch thô cứng.",
        [
            ("点赞", "diǎnzàn", "Điểm tán", "Thả tim, bấm like (trên mạng)", "言", "如果喜欢这条视频，别忘了点赞关注。", "Rúguǒ xǐhuan zhè tiáo shìpín, bié wàng le diǎnzàn guānzhù.", "Nếu thích video này, đừng quên thả tim theo dõi nhé."),
            ("转发", "zhuǎnfā", "Chuyển phát", "Chia sẻ lại, retweet, share", "车", "优质的内容很快就被网友疯狂转发。", "Yōuzhì de nèiróng hěn kuài jiù bèi wǎngyǒu fēngkuáng zhuǎnfā.", "Nội dung chất lượng nhanh chóng được cư dân mạng chia sẻ điên đảo."),
            ("刷屏", "shuāpíng", "Soát bính", "Spam ngập màn hình, viral phủ sóng", "刂", "这个震撼的新闻瞬间在朋友圈刷屏了。", "Zhè gè zhènhàn de xīnwén shùnjiān zài péngyǒuquān shuāpíng le.", "Tin tức chấn động này trong tích tắc đã phủ sóng ngập tràn Bảng tin WeChat."),
            ("甚至", "shènzhì", "Thậm chí", "Thậm chí, ngay cả (phó từ tăng tiến)", "至", "很多老年人甚至也会熟练使用智能手机直播。", "Hěn duō lǎoniánrén shènzhì yě huì shúliàn shǐyòng zhìnéng shǒujī zhībō.", "Rất nhiều người cao tuổi thậm chí cũng biết dùng thành thạo smartphone để livestream.")
        ],
        [("赞", "zàn", "Khen ngợi, giúp đỡ", 16, "Ngang, sổ...", "Bộ Bối (贝)", "Tặng lời khen quý như bảo bối."),
         ("屏", "píng", "Bức bình phong, màn hình", 9, "Ngang gập, phẩy...", "Bộ Thi (尸)", "Màn hình chắn trước mắt.")],
        ("甚至…… (Thậm chí... / Ngay cả...)", "Phó từ biểu thị mức độ tăng tiến đột biến",
         "Dùng để đưa ra một ví dụ nổi bật, bất ngờ vượt quá phạm vi thông thường nhằm nhấn mạnh.",
         ("他不仅会唱中文歌，甚至能背诵唐诗三百首。", "Tā bùjǐn huì chàng Zhōngwén gē, shènzhì néng bèisòng Tángshī sānbǎi shǒu.", "Anh ấy không những biết hát bài hát tiếng Trung, thậm chí còn thuộc lòng 300 bài thơ Đường."),
         ("甚至他去。", "他甚至去过南极。", "Chủ ngữ thường đứng trước 甚至.")),
        ([("A", "这条科普短视频太火了，点赞量居然破百万了！", "Zhè tiáo kēpǔ duǎnshìpín tài huǒ le, diǎnzàn liàng jūrán pò bǎiwàn le!", "Video ngắn phổ biến khoa học này hot quá, lượng thả tim lại vượt mốc 1 triệu rồi!"),
          ("B", "是啊，评论区全在讨论，甚至连大学教授都转发了。", "Shì a, pínglùnqū quán zài tǎolùn, shènzhì lián dàxué jiàoshòu dōu zhuǎnfā le.", "Đúng thế, khu bình luận đang bàn tán sôi nổi, thậm chí ngay cả giáo sư đại học cũng share lại.")],
         "甚至连大学教授都转发了。", "Video này có sức ảnh hưởng đến mức nào?", ["Bị cấm lưu hành", "Đạt hơn triệu like và thậm chí cả giáo sư đại học cũng chia sẻ", "Không có ai bình luận", "Bị gỡ xuống"], 1, "Ảnh hưởng: 点赞破百万，甚至连大学教授都转发了."),
        ("Kêu gọi tương tác trên mạng:", "老铁们，给主播点个赞加个关注！", "Lǎotiě men, gěi zhǔbō diǎn gè zàn jiā gè guānzhù!", "Các anh em ơi, thả tim và ấn follow cho chủ phòng nhé!", "Ngữ điệu hào hứng của livestream Douyin."),
        ("Sắp xếp câu: 'Anh ấy thậm chí quên cả ăn cơm'", ["忙得", "他", "甚至", "忘了吃饭"], ["他", "忙得", "甚至", "忘了吃饭"], "Cấu trúc 忙得 + 甚至 + V..."),
        [("Trên mạng xã hội Trung Quốc, cụm từ '一键三连' (1 chạm 3 hành động) gồm những gì?", ["点赞、投币、收藏 (Like, Coin, Bookmark)", "吃饭、睡觉、打豆豆", "打电话、发微信、加好友", "退货、换货、差评"], 0, "Văn hóa video Bilibili/Douyin: 点赞、投币、收藏."),
         ("Điền từ: '这个问题太深奥了，____专家都无法解答。'", ["甚至", "所谓", "究竟", "与其"], 0, "Tăng tiến vượt mức thông thường dùng 甚至.")],
        ("Ngôn ngữ mạng", "Viết một bình luận video Douyin bằng tiếng lóng tự nhiên của cư dân mạng Trung Quốc.", "diǎnzàn zhuǎnfā shuāpíng", "Dân Mạng Sành Điệu")
    )

    add_l(
        "l-507", "ch-18", "lvl-5", 2, "Tâm lý giới trẻ: Nằm phẳng vs Cuộn tròn", "青年社会心态：躺平与内卷",
        "Hiện tượng xã hội nóng hổi: 内卷 (cạnh tranh khốc liệt) và 躺平 (từ chối áp lực, sống tối giản).",
        "Nắm vững từ vựng xã hội học: 内卷, 躺平, 竞争, 焦虑 và phó từ 究竟……",
        [
            ("内卷", "nèijuǎn", "Nội quyển", "Cuộn vào trong, cạnh tranh kiệt sức vô nghĩa (Involution)", "人", "过度内卷导致年轻人普遍感到身心疲惫。", "Guòdù nèijuǎn dǎozhì niánqīngrén pǔbiàn gǎndào shēnxīn píbèi.", "Cạnh tranh tiêu cực quá đà khiến giới trẻ nhìn chung cảm thấy mệt mỏi cả thể xác lẫn tâm hồn."),
            ("躺平", "tǎngpíng", "Thảng bình", "Nằm phẳng, buông bỏ áp lực bon chen", "身", "所谓的躺平，并不是懒惰，而是一种自我调节。", "Suǒwèi de tǎngpíng, bìng bú shì lǎnduò, ér shì yì zhǒng zìwǒ tiáojié.", "Cái gọi là 'nằm phẳng' không phải là lười biếng mà là một cách tự điều chỉnh tâm lý."),
            ("竞争", "jìngzhēng", "Cạnh tranh", "Cạnh tranh, thi đua", "立", "良性的职场竞争有助于激发个人潜能。", "Liángxìng de zhíchǎng jìngzhēng yǒuzhùyú jīfā gèrén qiánnéng.", "Cạnh tranh nơi công sở lành mạnh giúp kích hoạt tiềm năng cá nhân."),
            ("焦虑", "jiāolǜ", "Tiêu lự", "Lo âu, căng thẳng, bất an", "心", "不要因为同龄人的成就而产生过多焦虑。", "Bú yào yīnwèi tónglíngrén de chéngjiù ér chǎnshēng guòduō jiāolǜ.", "Đừng vì thành tựu của bạn bè đồng trang lứa mà sinh ra quá nhiều lo âu.")
        ],
        [("卷", "juǎn", "Cuộn lại, cuốn chiếu", 8, "Chấm, phẩy...", "Bộ Nguy (厄)", "Cuộn chặt vào bên trong."),
         ("躺", "tǎng", "Nằm ngửa", 15, "Phẩy, sổ...", "Bộ Thân (身)", "Thân mình nằm dài trên giường.")],
        ("反思…… (Suy ngẫm / Nhìn nhận lại...)", "Động từ biểu thị tư duy phản biện xã hội",
         "Dùng khi muốn phân tích mặt trái của một trào lưu xã hội để tìm ra hướng đi đúng đắn.",
         ("我们需要深刻反思过度内卷带来的社会心理问题。", "Wǒmen xūyào shēnkè fǎnsī guòdù nèijuǎn dàilái de shèhuì xīnlǐ wèntí.", "Chúng ta cần suy ngẫm sâu sắc về những vấn đề tâm lý xã hội do cạnh tranh quá đà đem lại."),
         ("反思他错了。", "我们要反思自己的错误。", "反思 là động từ trừu tượng đòi hỏi tân ngữ danh từ hóa.")),
        ([("A", "最近大家都在讨论'内卷'和'躺平'，你赞同哪种生活方式？", "Zuìjìn dàjiā dōu zài tǎolùn 'nèijuǎn' hé 'tǎngpíng', nǐ zàntóng nǎ zhǒng shēnghuó fāngshì?", "Gần đây mọi người đều bàn về 'cuộn tròn' và 'nằm phẳng', bạn tán thành lối sống nào?"),
          ("B", "盲目内卷太累，彻底躺平也不现实，关键在于找到内心的平衡。", "Mángmù nèijuǎn tài lèi, chèdǐ tǎngpíng yě bú xiànshí, guānjiàn zàiyú zhǎodào nèixīn de pínghéng.", "Cạnh tranh mù quáng quá mệt mỏi, nằm phẳng hoàn toàn cũng không thực tế, mấu chốt là tìm thấy sự cân bằng trong tâm.")],
         "关键在于找到内心的平衡。", "Người B đề xuất giải pháp gì trước áp lực xã hội?", ["Nằm phẳng tuyệt đối không làm gì cả", "Lao đầu vào cạnh tranh bất chấp sức khỏe", "Tìm kiếm sự cân bằng trong tâm", "Bỏ việc chuyển về quê"], 2, "B kết luận: 关键在于找到内心的平衡."),
        ("Bày tỏ quan điểm sống:", "拒绝无意义的内卷，过好真实的每一天。", "Jùjué wú yìyì de nèijuǎn, guò hǎo zhēnshí de měi yì tiān.", "Từ chối cạnh tranh vô nghĩa, sống trọn vẹn từng ngày chân thật.", "Ngữ điệu sâu sắc, dứt khoát."),
        ("Sắp xếp câu: 'Cạnh tranh mù quáng chỉ tạo thêm lo âu'", ["盲目的内卷", "只会", "带来焦虑"], ["盲目的内卷", "只会", "带来焦虑"], "Chủ ngữ + 只会 + Động từ + Tân ngữ."),
        [("Thuật ngữ mạng chỉ trạng thái từ chối bon chen, sống an nhiên tối giản là gì?", ["内卷", "躺平", "种草", "刷屏"], 1, "躺平 (tǎngpíng) là trào lưu nằm phẳng."),
         ("Điền từ: '面对压力，我们应该积极面对，而不是一味地陷入____。'", ["焦虑", "风味", "菜系", "座次"], 0, "Rơi vào lo âu bất an là 陷入焦虑.")],
        ("Bình luận xã hội", "Viết một đoạn văn 70 chữ bằng tiếng Trung nêu quan điểm của bạn về hiện tượng '内卷' ở giới trẻ.", "jùjué nèijuǎn pínghéng", "Tư Duy Xã Hội HSK 5")
    )

    add_l(
        "l-508", "ch-18", "lvl-5", 3, "Trào lưu tiêu dùng: Gieo cỏ & Nhổ cỏ", "消费新趋势：种草与拔草",
        "Thuật ngữ mua sắm cực hot: 种草 (bị thu hút, mê mẩn món đồ) và 拔草 (xuống tiền mua thật hoặc bỏ qua sau khi xem review).",
        "Nắm vững từ vựng tiêu dùng: 种草, 拔草, 推荐, 踩雷 và phó từ 反而……",
        [
            ("种草", "zhòngcǎo", "Chủng thảo", "Gieo cỏ, bị review mê hoặc muốn mua (Slang)", "禾", "看了博主的测评，我被这台咖啡机深深种草了。", "Kàn le bózhu de cèpíng, wǒ bèi zhè tái kāfēijī shēnshēn zhòngcǎo le.", "Xem review của blogger xong, tôi bị chiếc máy pha cà phê này mê hoặc chết mê chết mệt."),
            ("拔草", "bácǎo", "Bạt thảo", "Nhổ cỏ, quyết định mua hoặc bỏ qua món đồ sau cân nhắc", "扌", "犹豫了一个月，我终于去专柜把那款包拔草了。", "Yóuyù le yí gè yuè, wǒ zhōngyú qù zhuānguì bǎ nà kuǎn bāo bácǎo le.", "Do dự một tháng, cuối cùng tôi đã ra quầy chính hãng 'nhổ cỏ' rước chiếc túi đó về."),
            ("踩雷", "cǎiléi", "Thải lôi", "Dẫm phải mìn, mua phải hàng dởm/thất vọng", "足", "盲目跟风网购，很容易踩雷买到次品。", "Mángmù gēnfēng wǎnggòu, hěn róngyì cǎiléi mǎidào cìpǐn.", "Mù quáng chạy theo phong trào mua sắm online rất dễ dẫm phải mìn mua trúng hàng kém chất lượng."),
            ("反而", "fǎn'ér", "Phản nhi", "Trái lại, ngược lại (phó từ nghịch chuyển)", "又", "价格便宜的往往质量不过关，反而浪费钱。", "Jiàgé piányi de wǎngwǎng zhìliàng bú guòguān, fǎn'ér làngfèi qián.", "Đồ rẻ thường chất lượng không đạt chuẩn, ngược lại còn tốn tiền hơn.")
        ],
        [("拔", "bá", "Nhổ lên, kéo ra", 8, "Ngang, sổ móc...", "Bộ Thủ (扌)", "Dùng sức tay nhổ bật gốc rễ."),
         ("雷", "léi", "Sấm sét, quả mìn", 13, "Ngang, móc...", "Bộ Vũ (雨)", "Sấm sét nổ bất ngờ.")],
        ("反而…… (Trái lại... / Ngược lại...)", "Phó từ biểu thị kết quả đi ngược lại dự đoán thông thường",
         "Đặt trước vị ngữ của phân câu thứ hai để nhấn mạnh sự bất ngờ, tương phản với phân câu trước.",
         ("吃了感冒药之后，他不仅没好，反而更困了。", "Chī le gǎnmàoyào zhīhòu, tā bùjǐn méi hǎo, fǎn'ér gèng kùn le.", "Sau khi uống thuốc cảm, anh ấy không những không khỏi mà ngược lại càng buồn ngủ hơn."),
         ("反而他很开心。", "他反而很开心。", "Chủ ngữ thường đứng trước 反而.")),
        ([("A", "你上周在网上被种草的那款护肤品，用着怎么样？", "Nǐ shàng zhōu zài wǎngshang bèi zhòngcǎo de nà kuǎn hùfūpǐn, yòng zhe zěnmeyàng?", "Món đồ dưỡng da bạn bị gieo cỏ trên mạng tuần trước dùng thấy thế nào?"),
          ("B", "别提了，严重踩雷！皮肤不仅没变好，反而过敏红肿了。", "Bié tí le, yánzhòng cǎiléi! Pífū bùjǐn méi biàn hǎo, fǎn'ér guòmǐn hóngzhǒng le.", "Đừng nhắc nữa, dẫm phải mìn to rồi! Da không những không đẹp lên mà trái lại còn bị dị ứng sưng đỏ.")],
         "皮肤不仅没变好，反而过敏红肿了。", "Trải nghiệm mua hàng của người B như thế nào?", ["Cực kỳ hài lòng", "Dẫm phải mìn, bị dị ứng da (踩雷)", "Sản phẩm dùng rất tốt", "Được hoàn tiền gấp đôi"], 1, "Kết quả tệ hại: 严重踩雷，反而过敏红肿."),
        ("Nói về việc mua sắm:", "理性消费，千万不要轻易盲目拔草。", "Lǐxìng xiāofèi, qiānwàn bú yào qīngyì mángmù bácǎo.", "Tiêu dùng lý trí, tuyệt đối đừng vội vàng mua sắm theo trào lưu mù quáng.", "Nhắc nhở chân thành."),
        ("Sắp xếp câu: 'Trời mưa không tạnh mà trái lại càng mưa to hơn'", ["雨不仅没停", "反而", "越下越大"], ["雨不仅没停", "反而", "越下越大"], "Cấu trúc 不仅没... 反而..."),
        [("Từ lóng mạng '踩雷' (cǎiléi) trong mua sắm có nghĩa là gì?", ["Mua được hàng rẻ đẹp", "Mua phải hàng dởm, trải nghiệm tệ", "Trúng thưởng lớn", "Được tặng quà"], 1, "踩雷 là dẫm phải bẫy hàng kém chất lượng."),
         ("Điền từ: '听了他的解释，大家不仅没释怀，心中____更加疑惑了。'", ["反而", "甚至", "究竟", "固然"], 0, "Kết quả trái ngược dự tính dùng 反而.")],
        ("Review sản phẩm", "Viết một mẩu review ngắn cảnh báo bạn bè không nên '踩雷' một món hàng trên mạng.", "bèi zhòngcǎo cǎiléi", "Tiêu Dùng Thông Minh")
    )

    add_l(
        "l-509", "ch-18", "lvl-5", 4, "Video ngắn Douyin & Bán hàng Livestream", "短视频创作与直播带货",
        "Ngành kinh tế số sôi động: 直播带货 (bán hàng phát sóng trực tiếp), 粉丝 (fan), 弹幕 (bình luận trôi).",
        "Làm chủ từ vựng kinh tế truyền thông: 短视频, 粉丝, 直播, 互动 và liên từ 从而……",
        [
            ("短视频", "duǎnshìpín", "Đoản thị tần", "Video ngắn (TikTok / Douyin)", "矢", "短视频已经成为当代人获取碎片化信息的主要途径。", "Duǎnshìpín yǐjīng chéngwéi dāngdàirén huòqǔ suìpiànhuà xìnxī de zhǔyào tújìng.", "Video ngắn đã trở thành con đường chính để người hiện đại tiếp nhận thông tin phân mảnh."),
            ("直播", "zhībō", "Trực bá", "Phát sóng trực tiếp, livestream", "目", "今晚八点知名主播将在直播间带货。", "Jīnwǎn bā diǎn zhīmíng zhǔbō jiāng zài zhībōjiān dàihuò.", "8 giờ tối nay thần tượng livestream nổi tiếng sẽ phát sóng bán hàng."),
            ("粉丝", "fěnsī", "Phấn ti", "Người hâm mộ, fan, người theo dõi", "米", "他在社交平台上拥有超过五百万的忠实粉丝。", "Tā zài shèjiāo píngtái shang yōngyǒu chāoguò wǔbǎiwàn de zhōngshí fěnsī.", "Anh ấy sở hữu hơn 5 triệu fan trung thành trên nền tảng mạng xã hội."),
            ("互动", "hùdòng", "Hỗ động", "Tương tác qua lại", "戈", "主播通过弹幕和观众实时互动，气氛非常热烈。", "Zhǔbō tōngguò dànmù hé guānzhòng shíshí hùdòng, qìfēn fēicháng rèliè.", "Chủ phòng thông qua bình luận bay tương tác trực tiếp với khán giả, không khí vô cùng sôi nổi.")
        ],
        [("播", "bō", "Gieo vãi, truyền phát", 15, "Ngang, sổ móc...", "Bộ Thủ (扌)", "Bàn tay phát tán thanh âm hình ảnh."),
         ("粉", "fěn", "Bột gạo, người hâm mộ", 10, "Chấm, phẩy...", "Bộ Mễ (米)", "Hạt gạo mịn màng, âm dịch của Fans.")],
        ("从而…… (Từ đó... / Nhờ vậy mà...)", "Liên từ chỉ kết quả logic tự nhiên",
         "Dùng để nối hai phân câu, vế sau biểu thị kết quả hoặc bước tiến phát sinh tự nhiên từ hành động ở vế trước.",
         ("直播带货缩短了流通环节，从而有效降低了商品成本。", "Zhībō dàihuò suōduǎn le liútōng huánjié, cóng'ér yǒuxiào jiàngdī le shāngpǐn chéngběn.", "Livestream bán hàng rút ngắn khâu lưu thông, nhờ vậy giảm giá thành sản phẩm một cách hiệu quả."),
         ("从而降低成本，缩短环节。", "缩短环节，从而降低成本。", "从而 luôn đứng ở đầu vế kết quả phía sau.")),
        ([("A", "为什么现在的电商平台都在大力发展'直播带货'？", "Wèishénme xiànzài de diànshāng píngtái dōu zài dàlì fāzhǎn 'zhībō dàihuò'?", "Tại sao các nền tảng thương mại điện tử hiện nay đều dốc sức phát triển 'livestream bán hàng'?"),
          ("B", "因为主播能实时展示商品细节，拉近与消费者的距离，从而大幅提高购买转化率。", "Yīnwèi zhǔbō néng shíshí zhǎnshì shāngpǐn xìjié, lājìn yǔ xiāofèizhě de jùlí, cóng'ér dàfú tígāo gòumǎi zhuǎnhuàlǜ.", "Bởi vì chủ phòng có thể trình diễn chi tiết sản phẩm trực tiếp, kéo gần cự ly với người tiêu dùng, nhờ đó tăng vọt tỷ lệ chốt đơn mua hàng.")],
         "拉近与消费者的距离，从而大幅提高购买转化率。", "Lợi ích nổi bật của bán hàng livestream là gì?", ["Làm hàng hóa đắt đỏ hơn", "Kéo gần khoảng cách và tăng vọt tỷ lệ mua hàng", "Không cần shipper giao hàng", "Khách hàng không được trả lại tiền"], 1, "Lợi ích: 拉近与消费者的距离，从而大幅提高购买转化率."),
        ("Câu chốt đơn livestream:", "三二一，上链接！手慢无！", "Sān èr yī, shàng liànjiē! Shǒu màn wú!", "3, 2, 1, lên đường link! Chậm tay là hết!", "Khẩu hiệu kinh điển của các chiến thần livestream Trung Quốc."),
        ("Sắp xếp câu: 'Tăng cường tương tác, nhờ vậy nâng cao gắn kết fan'", ["加强互动", "从而", "提高粉丝黏性"], ["加强互动", "从而", "提高粉丝黏性"], "Hành động + 从而 + Kết quả."),
        [("Từ '粉丝' (fěnsī) trong ngữ cảnh Internet có nghĩa là gì?", ["Sợi bún miến ăn liền", "Người hâm mộ, followers", "Quạt máy", "Tiền bạc"], 1, "粉丝 là từ mượn âm của từ Fans (người theo dõi)."),
         ("Điền từ: '提高生产效率，____降低了产品的最终售价。'", ["从而", "与其", "究竟", "不免"], 0, "Kết quả logic tất yếu dùng 从而.")],
        ("Livestream bán hàng", "Mô phỏng 1 phút kịch bản chào hàng, tung mã giảm giá trong phòng livestream Douyin.", "shàng liànjiē dàihuò", "Bậc Thầy Truyền Thông Số")
    )

    add_l(
        "l-510", "ch-18", "lvl-5", 5, "Tác động của mạng xã hội đến ngôn ngữ", "网络文化对现代汉语的影响",
        "Nhìn nhận khoa học về sự phong phú lẫn nguy cơ làm mai một ngữ pháp chuẩn mực của từ lóng mạng.",
        "Làm chủ từ vựng học thuật ngôn ngữ: 演变, 丰富, 规范, 沟通 và cấu trúc 显而易见……",
        [
            ("演变", "yǎnbiàn", "Diễn biến", "Diễn biến, biến đổi dần qua thời gian", "氵", "语言的演变生动地反映了时代的深刻变迁。", "Yǔyán de yǎnbiàn shēngdòng de fǎnyìng le shídài de shēnkè biànqiān.", "Sự diễn biến của ngôn ngữ phản ánh sinh động những biến đổi sâu sắc của thời đại."),
            ("丰富", "fēngfù", "Phong phú", "Làm phong phú, dồi dào", "豆", "网络流行语在一定程度上丰富了汉语的表达方式。", "Wǎngluò liúxíngyǔ zài yídìng chéngdù shang fēngfù le Hànyǔ de biǎodá fāngshì.", "Từ ngữ thịnh hành trên mạng ở mức độ nhất định đã làm phong phú cách diễn đạt của tiếng Hán."),
            ("规范", "guīfàn", "Quy phạm", "Quy chuẩn, chuẩn mực hóa", "木", "在正式公文和学术写作中，必须坚持语言规范。", "Zài zhèngshì gōngwén hé xuéshù xiězuò zhōng, bìxū jiānchí yǔyán guīfàn.", "Trong công văn chính thức và viết học thuật, bắt buộc phải giữ vững chuẩn mực ngôn ngữ."),
            ("显而易见", "xiǎn'éryìjiàn", "Hiển nhi dị kiến", "Rõ ràng ai cũng thấy (Thành ngữ)", "日", "互联网对青年交流模式的影响是显而易见的。", "Hùliánwǎng duì qīngnián jiāoliú móshì de yǐngxiǎng shì xiǎn'éryìjiàn de.", "Ảnh hưởng của Internet đối với mô thức giao lưu của giới trẻ là vô cùng rõ ràng.")
        ],
        [("范", "fàn", "Khuôn phép, chuẩn mực", 8, "Ngang, sổ...", "Bộ Thảo (艹)", "Khuôn đúc quy củ."),
         ("显", "xiǎn", "Rõ ràng, hiển lộ", 9, "Sổ, ngang gập...", "Bộ Nhật (日)", "Ánh mặt trời chiếu rọi rõ nét.")],
        ("显而易见…… (Rõ ràng ai cũng thấy là...)", "Thành ngữ làm vị ngữ hoặc trạng ngữ khẳng định",
         "Dùng để khẳng định một chân lý hoặc kết quả hiển nhiên không cần phải bàn cãi.",
         ("数字化时代带来的便利是显而易见的。", "Shùzìhuà shídài dàilái de biànlì shì xiǎn'éryìjiàn de.", "Sự tiện lợi mà thời đại số hóa đem lại là điều rõ ràng ai cũng thấy."),
         ("显而易见他错了道理。", "道理是显而易见的。", "Thường làm vị ngữ độc lập hoặc trạng ngữ đầu câu.")),
        ([("A", "有人认为网络热词破坏了汉语的纯洁性，你怎么看？", "Yǒurén rènwéi wǎngluò rècí pòhuài le Hànyǔ de chúnjiéxìng, nǐ zěnme kàn?", "Có người cho rằng từ nóng mạng phá hoại sự thuần khiết của tiếng Trung, bạn thấy thế nào?"),
          ("B", "语言是动态发展的，健康的新词汇能丰富表达，但正式场合仍需遵守规范。", "Yǔyán shì dòngtài fāzhǎn de, jiànkāng de xīn cíhuì néng fēngfù biǎodá, dàn zhèngshì chǎnghé réng xū zūnshǒu guīfàn.", "Ngôn ngữ phát triển động, từ vựng mới lành mạnh có thể làm giàu cách diễn đạt, nhưng trong bối cảnh trang trọng vẫn cần tuân thủ quy chuẩn.")],
         "健康的新词汇能丰富表达，但正式场合仍需遵守规范。", "Quan điểm đúng đắn về từ vựng mạng là gì?", ["Cấm tiệt mọi từ lóng mạng", "Dùng từ lóng bừa bãi trong văn bản pháp luật", "Chấp nhận sự làm phong phú nhưng bối cảnh trang trọng phải quy chuẩn", "Không quan tâm"], 2, "Quan điểm: 丰富表达，但正式场合仍需遵守规范."),
        ("Thành ngữ nhận định:", "网络用语的积极与消极影响是显而易见的。", "Wǎngluò yòngyǔ de jījí yǔ xiāojí yǐngxiǎng shì xiǎn'éryìjiàn de.", "Tác động tích cực và tiêu cực của từ ngữ mạng là điều rõ ràng ai cũng thấy.", "Phong thái nghị luận học thuật."),
        ("Sắp xếp câu: 'Kết quả của sự nỗ lực là điều rõ ràng ai cũng thấy'", ["他的努力成果", "是", "显而易见的"], ["他的努力成果", "是", "显而易见的"], "Cấu trúc Chủ ngữ + 是 + 显而易见的."),
        [("Thành ngữ nào mang ý nghĩa 'sự thật vô cùng rõ ràng, dễ nhìn thấy mà không cần chứng minh'?", ["显而易见", "赞不绝口", "不见不散", "半途而废"], 0, "显而易见 (xiǎn'éryìjiàn) là hiển nhiên, rõ như ban ngày."),
         ("Điền từ: '现代汉语在漫长的历史中不断____。'", ["演变", "扫码", "挂号", "退房"], 0, "Biến đổi dần qua năm tháng dùng 演变.")],
        ("Tổng kết Chương 18", "Viết bài luận ngắn 90 chữ trình bày suy nghĩ của bạn về từ lóng mạng trong kỳ thi HSK.", "xiǎn'éryìjiàn guīfàn", "Học Giả Ngôn Ngữ Học")
    )

    # =========================================================================
    # CHAPTER 19: Lễ hội truyền thống & Phong tục (l-511 to l-515)
    # =========================================================================
    add_l(
        "l-511", "ch-19", "lvl-5", 1, "Tết Nguyên Đán, Đêm trừ tịch & Bữa cơm tất niên", "春节除夕与年夜饭",
        "Khám phá phong tục Tết cổ truyền: 除夕 (đêm 30 Tết), 年夜饭 (cơm tất niên), 守岁 (đón giao thừa).",
        "Làm chủ từ vựng lễ hội: 除夕, 团圆, 年夜饭, 拜年 và động từ 意味着……",
        [
            ("除夕", "chúxī", "Trừ tịch", "Đêm giao thừa, chiều 30 Tết", "阝", "大年三十除夕之夜，家家户户灯火通明。", "Dànián sānshí chúxī zhī yè, jiājiā-hùhù dēnghuǒ tōngmíng.", "Đêm giao thừa 30 Tết, nhà nhà sáng rực ánh đèn."),
            ("团圆", "tuányuán", "Đoàn viên", "Đoàn tụ sum vầy, sum họp", "囗", "春节是全家老小团圆的最重要时刻。", "Chūnjié shì quánjiā lǎoxiǎo tuányuán de zuì zhòngyào shíkè.", "Tết Nguyên Đán là thời khắc quan trọng nhất để già trẻ cả nhà sum vầy."),
            ("年夜饭", "niányèfàn", "Niên dạ phạn", "Bữa cơm tất niên tối 30 Tết", "夕", "一家人围坐在一起吃丰盛的年夜饭。", "Yì jiā rén wéizuò zài yìqǐ chī fēngshèng de niányèfàn.", "Cả nhà quây quần bên nhau ăn bữa cơm tất niên thịnh soạn."),
            ("意味着", "yìwèizhe", "Ý vị trước", "Có nghĩa là, báo hiệu điều gì", "心", "春天的到来，意味着万物复苏与新的开始。", "Chūntiān de dàolái, yìwèizhe wànwù fùsū yǔ xīn de kāishǐ.", "Mùa xuân về báo hiệu vạn vật hồi sinh và những khởi đầu mới.")
        ],
        [("夕", "xī", "Hoàng hôn, đêm tối", 3, "Phẩy, ngang gập cong...", "Bộ Tịch (夕)", "Mặt trăng khuyết ló dạng buổi chiều tà."),
         ("圆", "yuán", "Tròn trịa, đoàn tụ", 10, "Sổ, ngang gập...", "Bộ Vi (囗)", "Vòng tròn bao bọc trọn vẹn.")],
        ("意味着…… (Có nghĩa là... / Báo hiệu...)", "Động từ biểu thị ý nghĩa sâu xa hoặc hệ quả tất yếu",
         "Đặt 'Sự việc + 意味着 + Ý nghĩa / Hệ quả' để khẳng định giá trị biểu tượng của hiện tượng.",
         ("除夕团圆，意味着告别过去的一年并迎来新生。", "Chúxī tuányuán, yìwèizhe gàobié guòqù de yì nián bìng yínglái xīnshēng.", "Giao thừa đoàn tụ mang ý nghĩa giã từ năm cũ và đón chào cuộc sống mới."),
         ("他意味着笑了。", "他的微笑意味着答应了。", "意味着 phải đi cùng một mệnh đề hoặc danh từ ý nghĩa.")),
        ([("A", "在北方过年，年夜饭餐桌上必不可少的传统美食是什么？", "Zài běifāng guònián, niányèfàn cānzhuō shang bì bù kě shǎo de chuántǒng měishí shì shénme?", "Ở miền Bắc ăn Tết, món ăn truyền thống không thể thiếu trên mâm cơm tất niên là gì?"),
          ("B", "当然是热腾腾的饺子，因为饺子的形状像元宝，包着好运与团圆。", "Dāngrán shì rètēngtēng de jiǎozi, yīnwèi jiǎozi de xíngzhuàng xiàng yuánbǎo, bāo zhe hǎoyùn yǔ tuányuán.", "Đương nhiên là sủi cảo nóng hổi, vì hình dáng sủi cảo giống đồng tiền vàng, gói trọn may mắn và đoàn viên.")],
         "当然是热腾腾的饺子，因为饺子的形状像元宝，包着好运与团圆。", "Tại sao người phương Bắc Trung Quốc nhất định phải ăn sủi cảo đêm giao thừa?", ["Vì không có cơm ăn", "Vì sủi cảo giống nén vàng, tượng trưng may mắn và đoàn viên", "Vì dễ nấu nhất", "Vì rẻ tiền"], 1, "Ý nghĩa biểu tượng: 形状像元宝，包着好运与团圆."),
        ("Chúc tết cổ truyền:", "祝全家除夕阖家团圆，新年万事如意！", "Zhù quánjiā chúxī héjiā tuányuán, xīnnián wànshì rúyì!", "Chúc cả nhà giao thừa sum vầy đoàn viên, năm mới vạn sự như ý!", "Lời chúc cát tường hoan hỷ."),
        ("Sắp xếp câu: 'Đoàn viên mang ý nghĩa hạnh phúc của gia đình'", ["家庭的幸福", "团圆", "意味着"], ["团圆", "意味着", "家庭的幸福"], "Chủ ngữ + 意味着 + Ý nghĩa."),
        [("Tối ngày 30 tháng Chạp âm lịch trong tiếng Trung gọi là gì?", ["除夕 (Đêm trừ tịch / Giao thừa)", "中秋", "端午", "清明"], 0, "除夕 (chúxī) là đêm 30 Tết."),
         ("Điền từ: '春风吹绿了柳树，____寒冷的冬天已经结束。'", ["意味着", "所谓", "究竟", "固然"], 0, "Báo hiệu điều gì dùng 意味着.")],
        ("Lời chúc giao thừa", "Ghi âm một đoạn lời chúc Tết Nguyên Đán ý nghĩa dành tặng gia đình và người thân.", "chúxī tuányuán niányèfàn", "Sứ Giả Văn Hóa Tết")
    )

    add_l(
        "l-512", "ch-19", "lvl-5", 2, "Tết Trung Thu & Ý nghĩa đoàn viên", "中秋赏月与团圆习俗",
        "Truyền thuyết Hằng Nga, phong tục ngắm trăng tròn, ăn bánh trung thu và gửi gắm nỗi nhớ người thân.",
        "Làm chủ từ vựng Trung Thu: 中秋, 赏月, 月饼, 思念 và động từ 寄托……",
        [
            ("中秋", "zhōngqiū", "Trung Thu", "Tết Trung Thu (rằm tháng Tám)", "禾", "八月十五中秋佳节，明月当空照。", "Bā yuè shíwǔ Zhōngqiū jiājié, míngyuè dāngkōng zhào.", "Rằm tháng Tám tết Trung Thu, trăng sáng vằng vặc giữa trời."),
            ("赏月", "shǎngyuè", "Thưởng nguyệt", "Ngắm trăng, thưởng trăng", "贝", "全家人聚在庭院里一边品茶一边赏月。", "Quánjiā rén jù zài tíngyuàn lǐ yìbiān pǐnchá yìbiān shǎngyuè.", "Cả nhà tụ họp trong sân vừa thưởng trà vừa ngắm trăng."),
            ("月饼", "yuèbǐng", "Nguyệt bính", "Bánh trung thu", "食", "中秋节吃月饼象征着生活的圆满与甜美。", "Zhōngqiūjié chī yuèbǐng xiàngzhēng zhe shēnghuó de yuánmǎn yǔ tiánměi.", "Tết Trung Thu ăn bánh trung thu tượng trưng cho cuộc sống viên mãn và ngọt ngào."),
            ("寄托", "jìtuō", "Ký thác", "Gửi gắm (tình cảm, nỗi nhớ)", "宀", "古代诗人常常借明月寄托对故乡亲人的思念。", "Gǔdài shīrén chángcháng jiè míngyuè jìtuō duì gùxiāng qīnrén de sīniàn.", "Các thi nhân thời xưa thường mượn ánh trăng sáng gửi gắm nỗi nhớ thương quê nhà và người thân.")
        ],
        [("赏", "shǎng", "Khen thưởng, thưởng ngoạn", 12, "Sổ, ngang...", "Bộ Bối (贝)", "Ban tặng ngọc ngà, chiêm ngưỡng cái đẹp."),
         ("饼", "bǐng", "Bánh tròn", 9, "Phẩy, ngang...", "Bộ Thực (饣)", "Bánh làm từ ngũ cốc chín vàng.")],
        ("寄托…… (Gửi gắm... vào...)", "Động từ biểu thị sự ký thác tâm tư, cảm xúc",
         "Thường dùng cấu trúc '借 / 把……寄托在……上' để diễn đạt việc gửi gắm tình cảm vào sự vật cụ thể.",
         ("诗人把对家乡深切的思念寄托在天边的明月上。", "Shīrén bǎ duì jiāxiāng shēnqiè de sīniàn jìtuō zài tiānbiān de míngyuè shang.", "Nhà thơ gửi gắm nỗi nhớ quê hương sâu sắc vào vầng trăng sáng chân trời."),
         ("寄托他在月亮。", "把思念寄托在明月上。", "Cần dùng giới từ 把 và 在 để tạo thành cụm hoàn chỉnh.")),
        ([("A", "苏轼的名句'但愿人长久，千里共婵娟'表达了什么情感？", "Sū Shì de míngjù 'Dàn yuàn rén chángjiǔ, qiānlǐ gòng chánjuān' biǎodá le shénme qínggǎn?", "Câu thơ nổi tiếng của Tô Thức 'Đãn nguyện nhân trường cửu, thiên lý cộng thiền quyên' biểu đạt tình cảm gì?"),
          ("B", "表达了对远方亲人的美好祝愿，即使相隔千里也能共享同一轮明月。", "Biǎodá le duì yuǎnfāng qīnrén de měihǎo zhùyuàn, jíshǐ xiānggé qiānlǐ yě néng gòngxiǎng tóng yì lún míngyuè.", "Biểu đạt lời chúc tốt đẹp gửi tới người thân nơi phương xa, cho dù cách trở ngàn dặm cũng cùng ngắm chung một vầng trăng sáng.")],
         "即使相隔千里也能共享同一轮明月。", "Câu thơ của Tô Thức chúc phúc điều gì?", ["Chúc phát tài nhanh chóng", "Chúc thi cử đỗ đạt", "Chúc sống lâu khỏe mạnh và cùng ngắm chung vầng trăng dù xa cách", "Chúc trúng mùa màng"], 2, "Ý nghĩa: 千里共婵娟 = dù xa ngàn dặm cùng ngắm chung vầng trăng đẹp."),
        ("Đọc câu thơ kinh điển:", "但愿人长久，千里共婵娟。", "Dàn yuàn rén chángjiǔ, qiānlǐ gòng chánjuān.", "Chỉ mong người bình an trường cửu, dẫu xa ngàn dặm cùng chung bóng trăng.", "Ngữ điệu sâu lắng thi vị."),
        ("Sắp xếp câu: 'Nhà thơ gửi gắm nỗi nhớ vào vầng trăng'", ["寄托在明月上", "诗人把", "深情的思念"], ["诗人把", "深情的思念", "寄托在明月上"], "Cấu trúc 把 + Nỗi nhớ + 寄托在..."),
        [("Tết Trung Thu rơi vào ngày nào trong lịch âm lịch?", ["Tám tháng Tư", "Mười lăm tháng Tám (八月十五)", "Mùng năm tháng Năm", "Tết Nguyên Tiêu rằm tháng Giêng"], 1, "Rằm tháng Tám: 农历八月十五."),
         ("Điền từ: '中秋月饼____了人们对美好团圆的向往。'", ["寄托", "甚至", "究竟", "与其"], 0, "Gửi gắm ước vọng dùng 寄托.")],
        ("Thơ Trung Thu", "Ngâm vịnh 2 câu thơ nổi tiếng về Tết Trung Thu và giải thích ý nghĩa bằng tiếng Trung.", "qiānlǐ gòng chánjuān", "Thi Sĩ Thưởng Nguyệt")
    )

    add_l(
        "l-513", "ch-19", "lvl-5", 3, "Tết Đoan Ngọ & Đua thuyền rồng", "端午赛龙舟与纪念屈原",
        "Khám phá ngày 5/5 âm lịch: Đua thuyền rồng (赛龙舟), ăn bánh ú lá tre (粽子) và tưởng nhớ Khuất Nguyên.",
        "Làm chủ từ vựng lễ hội Đoan Ngọ: 端午, 龙舟, 粽子, 纪念 và cấu trúc 源于……",
        [
            ("端午", "duānwǔ", "Đoan Ngọ", "Tết Đoan Ngọ (mùng 5 tháng 5 âm lịch)", "立", "五月初五端午节是中国的传统法定节日。", "Wǔ yuè chū wǔ Duānwǔjié shì Zhōngguó de chuántǒng fǎdìng jiérì.", "Mùng 5 tháng 5 Tết Đoan Ngọ là ngày lễ truyền thống theo luật định của Trung Quốc."),
            ("龙舟", "lóngzhōu", "Long chu", "Thuyền rồng (dùng để đua)", "舟", "江面上龙舟竞赛鼓声震天，气氛极其热烈。", "Jiāngmiàn shang lóngzhōu jìngsài gǔshēng zhèntiān, qìfēn jíqí rèliè.", "Trên mặt sông cuộc đua thuyền rồng tiếng trống vang trời, không khí vô cùng sôi động."),
            ("粽子", "zòngzi", "Túng tử", "Bánh ú, bánh chưng tro gói lá tre", "米", "端午节吃粽子的习俗已经流传了两千多年。", "Duānwǔjié chī zòngzi de xísú yǐjīng liúchuán le liǎngqiān duō nián.", "Phong tục ăn bánh ú tết Đoan Ngọ đã lưu truyền hơn 2000 năm."),
            ("源于", "yuányú", "Nguyên vu", "Bắt nguồn từ, có nguồn gốc từ", "氵", "端午节赛龙舟的习俗源于对伟大诗人屈原的纪念。", "Duānwǔjié sài lóngzhōu de xísú yuányú duì wěidà shīrén Qū Yuán de jìniàn.", "Tập tục đua thuyền rồng tết Đoan Ngọ bắt nguồn từ việc tưởng nhớ nhà thơ vĩ đại Khuất Nguyên.")
        ],
        [("舟", "zhōu", "Thuyền bè", 6, "Phẩy, ngang...", "Bộ Chu (舟)", "Chiếc thuyền gỗ lướt trên sóng nước."),
         ("粽", "zòng", "Bánh ú gói gạo nếp", 14, "Chấm, phẩy...", "Bộ Mễ (米)", "Hạt gạo nếp bọc trong lá tre hình kim tự tháp.")],
        ("源于…… (Bắt nguồn từ... / Có cội nguồn từ...)", "Động từ kết hợp giới từ chỉ nguồn gốc lịch sử",
         "Dùng trong các bài thuyết minh văn hóa để giải thích gốc gác cội nguồn của phong tục tập quán.",
         ("这项古老的传统体育运动源于两千年前的水上救援。", "Zhè xiàng gǔlǎo de chuántǒng tǐyù yùndòng yuányú liǎngqiān nián qián de shuǐshàng jiùyuán.", "Môn thể thao truyền thống cổ xưa này bắt nguồn từ hoạt động cứu hộ trên nước cách đây 2000 năm."),
         ("源于从中国。", "源于中国古代。", "源于 đã hàm chứa nghĩa 'từ', không dùng thêm 从.")),
        ([("A", "端午节人们为什么要把粽子扔进江里？", "Duānwǔjié rénmen wèishénme yào bǎ zòngzi rēng jìn jiāng lǐ?", "Tết Đoan Ngọ vì sao người ta lại ném bánh ú xuống dòng sông?"),
          ("B", "相传人们为了不让鱼虾损伤屈原的遗体，便投江喂鱼，后来演变成了吃粽子的习俗。", "Xiāngchuán rénmen wèile bú ràng yúxiā sǔnshāng Qū Yuán de yítǐ, biàn tóu jiāng wèi yú, hòulái yǎnbiàn chéng le chī zòngzi de xísú.", "Tương truyền người dân vì không muốn cá tôm làm tổn thương thi hài Khuất Nguyên, bèn ném bánh xuống sông cho cá ăn, sau này biến chuyển thành tập tục ăn bánh ú.")],
         "为了不让鱼虾损伤屈原的遗体，便投江喂鱼。", "Phong tục ném bánh ú xuống sông gắn liền với nhân vật lịch sử nào?", ["Khổng Tử", "Khuất Nguyên (屈原)", "Lý Bạch", "Tần Thủy Hoàng"], 1, "Nhân vật: 伟大爱国诗人屈原."),
        ("Giới thiệu ngày hội thuyền rồng:", "赛龙舟体现了团结拼搏的民族精神！", "Sài lóngzhōu tǐxiàn le tuánjié pīnbó de mínzú jīngshén!", "Đua thuyền rồng thể hiện tinh thần dân tộc đoàn kết kiên cường vượt khó!", "Giọng điệu hào sảng."),
        ("Sắp xếp câu: 'Tập tục này bắt nguồn từ thời cổ đại'", ["习俗", "源于", "这项", "古代"], ["这项", "习俗", "源于", "古代"], "Chủ ngữ + 源于 + Nguồn gốc."),
        [("Món ăn biểu tượng của Tết Đoan Ngọ mùng 5 tháng 5 là gì?", ["月饼", "粽子", "饺子", "年糕"], 1, "粽子 (zòngzi) là bánh ú Đoan Ngọ."),
         ("Điền từ: '很多现代医学理论实际上____古老的中医经验。'", ["源于", "所谓", "究竟", "与其"], 0, "Bắt nguồn từ dùng 源于.")],
        ("Kể chuyện Đoan Ngọ", "Dùng tiếng Trung kể lại ngắn gọn 1 phút câu chuyện Khuất Nguyên và phong tục đua thuyền rồng.", "sài lóngzhōu Qū Yuán", "Sứ Giả Đoan Ngọ")
    )

    add_l(
        "l-514", "ch-19", "lvl-5", 4, "Phong bao lì xì đỏ & 12 Con giáp", "红包压岁钱与生肖文化",
        "Văn hóa lì xì (压岁钱), ý nghĩa phong bao đỏ và biểu tượng 12 con giáp (生肖) trong vận mệnh con người.",
        "Làm chủ từ vựng may mắn: 红包, 压岁钱, 生肖, 吉祥 và động từ 象征……",
        [
            ("红包", "hóngbāo", "Hồng bao", "Bao lì xì đỏ, phong bao may mắn", "糸", "过年时长辈会给晚辈发红包传递祝福。", "Guònián shí zhǎngbèi huì gěi wǎnbèi fā hóngbāo chuándì zhùfú.", "Khi đón Tết người lớn sẽ phát bao lì xì cho con cháu để trao gửi lời chúc phúc."),
            ("压岁钱", "yāsuìqián", "Áp tuế tiền", "Tiền mừng tuổi đầu năm", "厂", "压岁钱寓意着平平安安度过新的一岁。", "Yāsuìqián yùyì zhe píngpíng'ān'ān dùguò xīn de yí suì.", "Tiền mừng tuổi hàm ý bình an suôn sẻ bước qua một tuổi mới."),
            ("生肖", "shēngxiào", "Sinh tiếu", "Con giáp, 12 con giáp (Cầm tinh)", "生", "请问你属什么生肖？我是属龙的。", "Qǐngwèn nǐ shǔ shénme shēngxiào? Wǒ shì shǔ lóng de.", "Xin hỏi bạn cầm tinh con giáp nào? Tôi cầm tinh con Rồng."),
            ("象征", "xiàngzhēng", "Tượng trưng", "Biểu tượng, tượng trưng cho", "木", "红色在中国文化中象征着喜庆、吉祥与繁荣。", "Hóngsè zài Zhōngguó wénhuà zhōng xiàngzhēng zhe xǐqìng, jíxiáng yǔ fánróng.", "Màu đỏ trong văn hóa Trung Hoa tượng trưng cho sự vui mừng, cát tường và thịnh vượng.")
        ],
        [("压", "yā", "Trấn áp, đè nén", 6, "Ngang, phẩy...", "Bộ Hán (厂)", "Đè tảng đá trừ tà ma."),
         ("肖", "xiào", "Tương tự, giống như", 7, "Sổ, chấm...", "Bộ Nhục (月)", "Hình dáng con thú tương đồng.")],
        ("象征着…… (Tượng trưng cho... / Là biểu tượng của...)", "Động từ biểu thị ý nghĩa biểu tượng văn hóa",
         "Dùng để giải thích ngụ ý tốt lành ẩn sau màu sắc, hoa văn, linh vật truyền thống.",
         ("龙在中国传统文化中象征着吉祥与尊贵。", "Lóng zài Zhōngguó chuántǒng wénhuà zhōng xiàngzhēng zhe jíxiáng yǔ zūnguì.", "Rồng trong văn hóa truyền thống Trung Quốc tượng trưng cho sự cát tường và cao quý."),
         ("象征是吉祥。", "象征着吉祥。", "Động từ 象征 đi kèm trợ từ 着 khi làm vị ngữ biểu đạt trạng thái tượng trưng.")),
        ([("A", "过年时给孩子们发压岁钱有什么美好的寓意吗？", "Guònián shí gěi háizi men fā yāsuìqián yǒu shénme měihǎo de yùyì ma?", "Năm mới phát tiền mừng tuổi cho trẻ em có ngụ ý tốt đẹp gì?"),
          ("B", "'岁'与'祟'谐音，压岁钱寓意着镇压邪崇，保佑孩子们健康成长。", "‘Suì’ yǔ ‘suì’ xiéyīn, yāsuìqián yùyì zhe zhènyā xiéchóng, bǎoyòu háizi men jiànkāng chéngzhǎng.", "Chữ 'Tuế' (năm) đồng âm với 'Túy' (tà ma), tiền áp tuế hàm ý trấn áp tà ma, phù hộ cho các em lớn lên khỏe mạnh.")],
         "压岁钱寓意着镇压邪崇，保佑孩子们健康成长。", "Nguồn gốc tên gọi '压岁钱' xuất phát từ hiện tượng ngôn ngữ nào?", ["Từ mượn tiếng Anh", "Chơi chữ đồng âm (谐音 '岁' và '祟')", "Tên một vị vua", "Không có ngụ ý"], 1, "Gốc gác: ‘岁’ yǔ ‘祟’ xiéyīn (chơi chữ đồng âm)."),
        ("Lời chúc đầu năm phát tài:", "恭喜发财，红包拿来！", "Gōngxǐ fācái, hóngbāo nálái!", "Cung hỷ phát tài, lì xì cầm lại đây!", "Câu nói đùa vui nhộn ngày Tết của trẻ em."),
        ("Sắp xếp câu: 'Màu đỏ tượng trưng cho hạnh phúc và may mắn'", ["幸福与吉祥", "红色", "象征着"], ["红色", "象征着", "幸福与吉祥"], "Chủ ngữ + 象征着 + Tân ngữ tượng trưng."),
        [("Màu sắc được xem là may mắn, cát tường nhất trong ngày Tết Trung Hoa là màu gì?", ["红色 (Màu đỏ)", "黑色 (Màu đen)", "白色 (Màu trắng)", "蓝色 (Màu xanh lam)"], 0, "红色 là màu sắc biểu tượng của hỷ sự."),
         ("Điền từ: '十二____文化反映了中国人对时间与生命的哲学思考。'", ["生肖", "菜系", "座次", "单号"], 0, "12 con giáp là 十二生肖.")],
        ("Hỏi tuổi con giáp", "Hỏi tuổi con giáp và giải thích tính cách tượng trưng của con giáp đó bằng tiếng Trung.", "xiàngzhēng jíxiáng hóngbāo", "Bậc Thầy Phong Tục")
    )

    add_l(
        "l-515", "ch-19", "lvl-5", 5, "So sánh phong tục lễ Tết Việt — Trung", "越中传统节日风俗比较",
        "Đối chiếu sự tương đồng và nét dị biệt thú vị giữa Tết Việt (bánh chưng vuông) và Tết Trung (sủi cảo, bánh trôi).",
        "Làm chủ từ vựng so sánh văn hóa: 异同, 习俗, 悠久, 亲切 và cấu trúc 固然……但是……",
        [
            ("异同", "yìtóng", "Dị đồng", "Điểm giống và khác nhau", "异", "越中两国的传统节日文化有许多有趣的异同。", "Yuè Zhōng liǎng guó de chuántǒng jiérì wénhuà yǒu xǔduō yǒuqù de yìtóng.", "Văn hóa lễ tết truyền thống của hai nước Việt - Trung có rất nhiều điểm giống và khác nhau thú vị."),
            ("习俗", "xísú", "Tập tục", "Phong tục tập quán", "习", "虽然地域不同，但过年祈求平安的习俗是一致的。", "Suīrán dìyù bùtóng, dàn guònián qíqiú píng'ān de xísú shì yízhì de.", "Tuy địa lý khác biệt nhưng tập tục đón Tết cầu bình an thì đồng nhất."),
            ("悠久", "yōujiǔ", "Du cửu", "Lâu đời, trường tồn qua năm tháng", "亻", "两国都拥有数千年悠久深厚的历史文化底蕴。", "Liǎng guó dōu yōngyǒu shùqiān nián yōujiǔ shēnhòu de lìshǐ wénhuà dǐyùn.", "Cả hai nước đều sở hữu bề dày lịch sử văn hóa lâu đời hàng ngàn năm."),
            ("亲切", "qīnqiè", "Thân thiết", "Thân thiết, gần gũi, ấm áp", "立", "在异国他乡看到熟悉的春联，感到格外亲切。", "Zài yìguó tāxiāng kàndào shúxi de chūnlián, gǎndào géwài qīnqiè.", "Ở nơi đất khách quê người nhìn thấy câu đối đỏ quen thuộc, cảm thấy vô cùng thân thương gần gũi.")
        ],
        [("异", "yì", "Khác biệt, dị thường", 6, "Ngang gập, phẩy...", "Bộ Dị (异)", "Hình thái khác lạ biệt lập."),
         ("悠", "yōu", "Xa xôi, thong thả", 11, "Phẩy, sổ...", "Bộ Tâm (心)", "Năm tháng trôi xa thong dong.")],
        ("固然……但是…… (Tuy rằng... nhưng mà...)", "Cấu trúc liên từ nhượng bộ khẳng định tiền đề",
         "Dùng để thừa nhận tính hợp lý của vế đầu (固然), sau đó chuyển hướng nhấn mạnh trọng tâm ở vế sau (但是).",
         ("外表的形式固然有所不同，但是对美好生活的期盼是一样的。", "Wàibiǎo de xíngshì gùrán yǒu suǒ bùtóng, dànshì duì měihǎo shēnghuó de qīpàn shì yíyàng de.", "Hình thức bề ngoài tuy rằng có điểm khác biệt, nhưng niềm mong ước cuộc sống tốt đẹp thì giống nhau."),
         ("固然好，不好。", "固然很好，但是成本太高。", "Vế sau bắt buộc phải có 但是/却 để hoàn chỉnh câu.")),
        ([("A", "越南过年吃方形的粽子（Bánh chưng），中国吃饺子，这反映了什么？", "Yuènán guònián chī fāngxíng de zòngzi, Zhōngguó chī jiǎozi, zhè fǎnyìng le shénme?", "Việt Nam ăn Tết ăn bánh chưng vuông, Trung Quốc ăn sủi cảo, điều này phản ánh điều gì?"),
          ("B", "这固然反映了农耕文明与饮食习惯的差异，但是两者都象征着全家团圆与感恩大地。", "Zhè gùrán fǎnyìng le nónggēng wénhuà yǔ yǐnshí xíguàn de chāyì, dànshì liǎngzhě dōu xiàngzhēng zhe quánjiā tuányuán yǔ gǎn'ēn dàdì.", "Điều này tuy rằng phản ánh sự khác biệt của văn minh nông nghiệp và thói quen ăn uống, nhưng cả hai đều tượng trưng cho gia đình đoàn viên và biết ơn đất mẹ.")],
         "两者都象征着全家团圆与感恩大地。", "Điểm tương đồng sâu sắc nhất giữa bánh chưng Việt và sủi cảo Trung là gì?", ["Đều làm từ bột mì", "Đều tượng trưng cho gia đình sum họp và tạ ơn đất trời", "Đều có hình tròn", "Đều luộc trong 2 tiếng"], 1, "Bản chất chung: 都象征着全家团圆与感恩大地."),
        ("Câu nhận định văn hóa:", "文化求同存异，传统节日连接两国民心。", "Wénhuà qiútóng-cúnyì, chuántǒng jiérì liánjiē liǎng guó mínxīn.", "Văn hóa tìm điểm chung giữ điểm riêng, lễ hội truyền thống kết nối lòng dân hai nước.", "Giọng điệu hữu nghị sâu sắc."),
        ("Sắp xếp câu: 'Nội dung tuy rằng tốt nhưng thời gian quá ngắn'", ["固然充实", "内容", "时间太紧张", "但是"], ["内容", "固然充实", "但是", "时间太紧张"], "Chủ ngữ + 固然... 但是..."),
        [("Món bánh truyền thống hình vuông gói bằng lá dong không thể thiếu trong ngày Tết cổ truyền Việt Nam là gì?", ["Bánh chưng (方形粽/越南粽)", "Bánh bao (包子)", "Sủi cảo (饺子)", "Bánh trôi (汤圆)"], 0, "Bánh chưng vuông là linh hồn Tết Việt."),
         ("Điền từ: '两国人民的友谊拥有____的历史根基。'", ["悠久", "甚至", "究竟", "差不多"], 0, "Lịch sử lâu đời dùng 悠久.")],
        ("Tổng kết Chương 19", "Viết bài so sánh 100 chữ bằng tiếng Trung về phong tục đón Tết Nguyên Đán tại Hà Nội và Bắc Kinh.", "gùrán dànshì tuányuán", "Cầu Nối Văn Hóa HSK 5")
    )

    # =========================================================================
    # CHAPTER 20: Xử lý tình huống y tế & Bệnh viện (l-516 to l-520)
    # =========================================================================
    add_l(
        "l-516", "ch-20", "lvl-5", 1, "Quy trình đăng ký khám bệnh tại bệnh viện", "医院门诊挂号与分诊",
        "Cách dùng thẻ bảo hiểm, phân khoa khám bệnh (nội, ngoại, tai mũi họng), lấy số thứ tự tại máy tự động.",
        "Làm chủ từ vựng y tế: 挂号, 门诊, 急诊, 科室 và giới từ 凭……",
        [
            ("挂号", "guàhào", "Quải hào", "Đăng ký khám bệnh, lấy số khám", "扌", "看病前请先在微信公众号或者自助机上挂号。", "Kànbìng qián qǐng xiān zài wēixìn gōngzhònghào huòzhě zìzhùjī shang guàhào.", "Trước khi khám bệnh xin hãy đăng ký khám trên kênh WeChat hoặc máy tự động."),
            ("门诊", "ménzhěn", "Môn chẩn", "Khoa khám bệnh ngoại trú", "门", "普通门诊在综合大楼的一层至三层。", "Pǔtōng ménzhěn zài zōnghé dàlóu de yì céng zhì sān céng.", "Khoa khám bệnh thông thường ở tầng 1 đến tầng 3 tòa nhà tổng hợp."),
            ("急诊", "jízhěn", "Cấp chẩn", "Khoa cấp cứu 24/7", "心", "如果有突发剧烈疼痛，请直接前往急诊室。", "Rúguǒ yǒu tūfā jùliè téngtòng, qǐng zhíjiē qiánwǎng jízhěnshì.", "Nếu có cơn đau dữ dội bất ngờ, xin đi thẳng đến phòng cấp cứu."),
            ("凭", "píng", "Bằng", "Dựa vào, căn cứ vào, xuất trình", "几", "患者凭医保卡或者身份证取号就诊。", "Huànzhě píng yībǎokǎ huòzhě shēnfènzhèng qǔhào jiùzhěn.", "Bệnh nhân xuất trình thẻ bảo hiểm y tế hoặc CCCD để lấy số vào khám.")
        ],
        [("诊", "zhěn", "Khám bệnh, chẩn đoán", 7, "Chấm, ngang...", "Bộ Ngôn (言)", "Bác sĩ hỏi han chẩn bệnh."),
         ("号", "hào", "Số thứ tự, tín hiệu", 5, "Khẩu, ngang gập cong...", "Bộ Khẩu (口)", "Tiếng còi hiệu, con số định danh.")],
        ("凭…… (Căn cứ vào... / Dựa vào...)", "Giới từ chỉ căn cứ giấy tờ, chứng từ",
         "Đặt '凭 + Giấy tờ / Chứng nhận' trước động từ để biểu thị điều kiện tiên quyết để nhận quyền lợi.",
         ("凭医生处方才能在药店购买处方药。", "Píng yīshēng chǔfāng cái néng zài yàodiàn gòumǎi chǔfāngyào.", "Phải căn cứ theo đơn của bác sĩ mới có thể mua thuốc kê đơn tại hiệu thuốc."),
         ("凭去医院。", "凭身份证挂号。", "Sau 凭 phải là giấy tờ cụ thể.")),
        ([("A", "请问头疼嗓子哑应该挂哪个科室的号？", "Qǐngwèn tóuténg sǎngzi yǎ yīnggāi guà nǎ gè kēshì de hào?", "Xin hỏi đau đầu khản giọng nên đăng ký khám khoa nào ạ?"),
          ("B", "如果伴有发烧请挂发热门诊，一般症状请挂耳鼻喉科。", "Rúguǒ bànyǒu fāshāo qǐng guà fārè ménzhěn, yìbān zhèngzhuàng qǐng guà ěrbíhóukē.", "Nếu kèm sốt xin đăng ký phòng khám sốt, triệu chứng thông thường xin đăng ký khoa Tai Mũi Họng.")],
         "如果伴有发烧请挂发热门诊，一般症状请挂耳鼻喉科。", "Người bệnh đau họng thông thường nên đăng ký khoa nào?", ["Khoa Ngoại", "Khoa Tai Mũi Họng (耳鼻喉科)", "Khoa Răng Hàm Mặt", "Khoa Mắt"], 1, "B hướng dẫn: 一般症状请挂耳鼻喉科."),
        ("Hỏi quầy chỉ dẫn bệnh viện:", "请问自助挂号机在哪里？", "Qǐngwèn zìzhù guàhàojī zài nǎlǐ?", "Xin hỏi máy đăng ký khám bệnh tự động ở đâu ạ?", "Phát âm rõ ràng guàhào."),
        ("Sắp xếp câu: 'Xuất trình thẻ bảo hiểm y tế để lấy số khám'", ["取号就诊", "凭医保卡", "患者"], ["患者", "凭医保卡", "取号就诊"], "Chủ ngữ + 凭... + Hành động."),
        [("Khoa khám và cấp cứu 24/24 trong bệnh viện gọi là gì?", ["门诊", "急诊", "挂号处", "收费处"], 1, "急诊 (jízhěn) là khoa cấp cứu."),
         ("Điền từ: '请大家____票有序入场参观。'", ["凭", "由于", "既然", "甚至"], 0, "Căn cứ theo vé vào cửa dùng 凭.")],
        ("Đăng ký khám bệnh", "Thực hành hỏi nhân viên bàn hướng dẫn bệnh viện cách chọn khoa khám bệnh phù hợp.", "píng yībǎokǎ guàhào", "Bệnh Nhân Thông Thái")
    )

    add_l(
        "l-517", "ch-20", "lvl-5", 2, "Miêu tả triệu chứng bệnh chi tiết", "描述病情症状与既往史",
        "Cách trình bày chính xác cảm giác khó chịu: chóng mặt, buồn nôn, dị ứng, đau âm ỉ.",
        "Làm chủ từ vựng miêu tả cơn đau: 头晕, 恶心, 过敏, 阵痛 và phó từ 隐隐……",
        [
            ("头晕", "tóuyūn", "Đầu vựng", "Chóng mặt, choáng váng", "日", "早晨起床时感到一阵阵头晕目眩。", "Zǎochén qǐchuáng shí gǎndào yízhènzhèn tóuyūn-mùxuàn.", "Sáng ngủ dậy cảm thấy từng cơn chóng mặt hoa mắt."),
            ("恶心", "ěxin", "Ác tâm", "Buồn nôn, lợm giọng", "心", "吃了油腻的食物后胃里特别恶心。", "Chī le yóunì de shíwù hòu wèi lǐ tèbié ěxin.", "Sau khi ăn đồ ăn nhiều dầu mỡ trong dạ dày rất buồn nôn."),
            ("过敏", "guòmǐn", "Quá mẫn", "Dị ứng (thuốc, phấn hoa, hải sản)", "心", "我对海鲜严重过敏，吃虾会浑身起红疹。", "Wǒ duì hǎixiān yánzhòng guòmǐn, chī xiā huì húnshēn qǐ hóngzhěn.", "Tôi bị dị ứng hải sản nghiêm trọng, ăn tôm sẽ nổi mẩn đỏ khắp người."),
            ("隐隐", "yǐnyǐn", "Ẩn ẩn", "Âm ỉ, thoang thoảng không dứt", "阝", "右上腹部总感到隐隐作痛，已经持续三天了。", "Yòushàng fùbù zǒng gǎndào yǐnyǐn zuòtòng, yǐjīng chíxù sān tiān le.", "Phần bụng trên bên phải luôn cảm thấy đau âm ỉ, đã kéo dài 3 ngày rồi.")
        ],
        [("晕", "yūn", "Chóng mặt, ngất xỉu", 10, "Sổ, ngang gập...", "Bộ Nhật (日)", "Mặt trời quay cuồng gây choáng."),
         ("敏", "mǐn", "Nhạy bén, dị ứng", 11, "Phẩy, ngang...", "Bộ Phộc (攵)", "Phản ứng cực nhanh với kích thích.")],
        ("隐隐作痛 (Đau âm ỉ / Đau nhức dai dẳng)", "Cụm cố định miêu tả mức độ đau đớn y khoa",
         "Dùng để phân biệt với '剧烈疼痛' (đau dữ dội quằn quại), giúp bác sĩ định lượng bệnh chính xác.",
         ("胃部隐隐作痛，建议做个胃镜检查。", "Wèibù yǐnyǐn zuòtòng, jiànyì zuò gè wèijìng jiǎncá.", "Dạ dày đau âm ỉ, khuyên bạn nên làm nội soi dạ dày."),
         ("他隐隐头疼作痛。", "他感到隐隐作痛。", "隐隐作痛 là một cụm trọn vẹn mô tả cảm giác đau.")),
        ([("A", "请问您哪里不舒服？有什么既往过敏史吗？", "Qǐngwèn nín nǎlǐ bù shūfu? Yǒu shénme jìwǎng guòmǐn shǐ ma?", "Xin hỏi bác khó chịu ở đâu? Có tiền sử dị ứng thuốc gì trước đây không?"),
          ("B", "大夫，我肚子隐隐作痛，伴有恶心，而且我对青霉素过敏。", "Dàifu, wǒ dùzi yǐnyǐn zuòtòng, bànyǒu ěxin, érqiě wǒ duì qīngméisù guòmǐn.", "Bác sĩ ơi, bụng tôi đau âm ỉ, kèm theo buồn nôn, và tôi bị dị ứng với Penicillin.")],
         "大夫，我肚子隐隐作痛，伴有恶心，而且我对青霉素过敏。", "Bệnh nhân có tiền sử dị ứng với loại thuốc nào?", ["Thuốc cảm cúm", "Kháng sinh Penicillin (青霉素)", "Thuốc hạ sốt", "Không dị ứng thuốc gì"], 1, "Bệnh nhân nhấn mạnh: 对青霉素过敏."),
        ("Kể bệnh với bác sĩ:", "大夫，我胸口隐隐作痛，喘不过气来。", "Dàifu, wǒ xiōngkǒu yǐnyǐn zuòtòng, chuǎn bú guò qì lái.", "Bác sĩ ơi, lồng ngực tôi đau âm ỉ, thở không ra hơi.", "Nói rõ ràng vị trí đau."),
        ("Sắp xếp câu: 'Tôi bị dị ứng nghiêm trọng với phấn hoa'", ["我对花粉", "过敏", "十分严重"], ["我对花粉", "十分严重", "过敏"], "Cấu trúc 对...过敏."),
        [("Từ nào diễn đạt cảm giác thức ăn dâng lên cổ họng muốn nôn ra?", ["恶心 (ěxin)", "头晕", "骨折", "贫血"], 0, "恶心 là cảm giác buồn nôn lợm giọng."),
         ("Điền từ: '伤口虽然缝合了，但依然感到____。'", ["隐隐作痛", "赞不绝口", "显而易见", "不见不散"], 0, "Đau âm ỉ là 隐隐作痛.")],
        ("Khai báo bệnh án", "Đóng vai bệnh nhân miêu tả đầy đủ 3 triệu chứng sốt, đau bụng âm ỉ và dị ứng cho bác sĩ.", "yǐnyǐn zuòtòng guòmǐn", "Giao Tiếp Y Khoa")
    )

    add_l(
        "l-518", "ch-20", "lvl-5", 3, "Xét nghiệm y tế & Nhận kết quả chẩn đoán", "医疗化验检查与诊断",
        "Quy trình lấy máu, chụp X-quang, đọc phiếu kết quả xét nghiệm và nghe bác sĩ chẩn đoán.",
        "Làm chủ từ vựng xét nghiệm: 化验, 抽血, 检查, 确诊 và phó từ 幸亏……",
        [
            ("化验", "huàyàn", "Hóa nghiệm", "Xét nghiệm, phân tích sinh hóa", "亻", "医生开了一张化验单，需要空腹抽血。", "Yīshēng kāi le yì zhāng huàyàndān, xūyào kōngfù chōuxuè.", "Bác sĩ kê một phiếu xét nghiệm, cần nhịn ăn lấy máu."),
            ("抽血", "chōuxuè", "Trừu huyết", "Lấy máu, rút máu xét nghiệm", "扌", "抽血化验需要保持空腹八小时以上。", "Chōuxuè huàyàn xūyào bǎochí kōngfù bā xiǎoshí yǐshàng.", "Lấy máu xét nghiệm cần giữ bụng đói trên 8 tiếng."),
            ("诊断", "zhěnduàn", "Chẩn đoạn", "Chẩn đoán bệnh tình", "言", "根据检查结果，医生诊断为急性肠胃炎。", "Gēnjù jiǎnchá jiéguǒ, yīshēng zhěnduàn wéi jíxìng chángwèiyán.", "Căn cứ kết quả kiểm tra, bác sĩ chẩn đoán là viêm dạ dày ruột cấp tính."),
            ("幸亏", "xìngkuī", "Hạnh khuy", "May mà, may mắn nhờ có (phó từ)", "土", "幸亏送医及时，病情很快得到了控制。", "Xìngkuī sòng yī jíshí, bìngqíng hěn kuài dédào le kòngzhì.", "May mà đưa đến bệnh viện kịp thời, bệnh tình rất nhanh đã được kiểm soát.")
        ],
        [("断", "duàn", "Chặt đứt, phán đoán", 11, "Ngang, phẩy...", "Bộ Cân (斤)", "Chiếc rìu bổ dứt khoát đưa ra kết luận."),
         ("亏", "kuī", "Thiệt thòi, may mắn", 3, "Ngang, ngang...", "Bộ Nhất", "Bù đắp phần khiếm khuyết.")],
        ("幸亏……不然/否则…… (May mà... nếu không thì...)", "Cấu trúc liên từ giải thích sự thoát nạn may mắn",
         "Vế trước chỉ sự việc may mắn xảy ra đúng lúc, vế sau chỉ hậu quả xấu đã được ngăn chặn kịp thời.",
         ("幸亏今天带了雨伞，否则肯定淋成落汤鸡。", "Xìngkuī jīntiān dài le yǔsǎn, fǒuzé kěndìng línchéng luòtāngjī.", "May mà hôm nay mang ô, nếu không nhất định ướt như chuột lột."),
         ("他幸亏来了，否则没赶上。", "幸亏他来了，否则就赶不上了。", "幸亏 thường đứng đầu câu trước chủ ngữ.")),
        ([("A", "大夫，我的血常规化验结果出来了，严重吗？", "Dàifu, wǒ de xuèchángguī huàyàn jiéguǒ chūlái le, yánzhòng ma?", "Bác sĩ ơi, kết quả xét nghiệm công thức máu của tôi có rồi, có nặng không?"),
          ("B", "白细胞指标略微偏高，确诊为轻微细菌感染，幸亏来得早，吃三天药就能好。", "Báixìbāo zhǐbiāo lüèwēi piāngāo, quèzhěn wéi qīngwēi xìjūn gǎnrǎn, xìngkuī lái de zǎo, chī sān tiān yào jiù néng hǎo.", "Chỉ số bạch cầu hơi cao một chút, chẩn đoán xác định là nhiễm khuẩn nhẹ, may mà đến sớm, uống thuốc 3 ngày là khỏi.")],
         "白细胞指标略微偏高，确诊为轻微细菌感染，幸亏来得早。", "Bác sĩ chẩn đoán bệnh nhân mắc bệnh gì?", ["Nhiễm khuẩn nhẹ (轻微细菌感染)", "Ung thư giai đoạn cuối", "Gãy xương sườn", "Viêm phổi nặng"], 0, "Bác sĩ chẩn đoán: 确诊为轻微细菌感染."),
        ("Bác sĩ động viên bệnh nhân:", "幸亏检查及时，按时吃药多休息就没事了。", "Xìngkuī jiǎnchá jíshí, ànshí chī yào duō xiūxi jiù méi shì le.", "May mà đi khám kịp thời, uống thuốc đúng giờ nghỉ ngơi nhiều là không sao rồi.", "Lời căn dặn ấm áp."),
        ("Sắp xếp câu: 'May mà có bạn nhắc nhở nếu không tôi đã quên mất'", ["我差点忘了", "幸亏有你提醒", "否则"], ["幸亏有你提醒", "否则", "我差点忘了"], "Cấu trúc 幸亏...否则..."),
        [("Yêu cầu quan trọng nhất trước khi đi lấy máu xét nghiệm sinh hóa vào buổi sáng là gì?", ["Ăn thật no", "Giữ bụng đói không ăn sáng (空腹)", "Uống nước ngọt", "Chạy bộ 5km"], 1, "Lấy máu xét nghiệm cần 空腹 (nhịn ăn)."),
         ("Điền từ: '____系了安全带，发生车祸时才没有受重伤。'", ["幸亏", "由于", "究竟", "固然"], 0, "May mắn thoát nạn dùng 幸亏.")],
        ("Đọc phiếu xét nghiệm", "Thực hành hội thoại trao đổi kết quả xét nghiệm máu và chẩn đoán với bác sĩ.", "xìngkuī jiǎnchá huàyàn", "Tự Tin Đi Khám")
    )

    add_l(
        "l-519", "ch-20", "lvl-5", 4, "Lấy thuốc theo đơn & Hướng dẫn sử dụng", "药房取药与用药医嘱",
        "Cách mua thuốc theo đơn tại quầy dược, hiểu liều lượng, tác dụng phụ và kiêng khem khi uống thuốc.",
        "Làm chủ từ vựng dùng thuốc: 处方, 服用, 剂量, 饭后 và giới từ 遵照……",
        [
            ("处方", "chǔfāng", "Xử phương", "Đơn thuốc, toa thuốc bác sĩ kê", "夂", "请拿着处方单去一楼大厅药房窗口缴费取药。", "Qǐng ná zhe chǔfāngdān qù yì lóu dàtīng yàofáng chuāngkǒu jiǎofèi qǔyào.", "Xin cầm đơn thuốc xuống quầy thuốc sảnh tầng 1 nộp tiền lấy thuốc."),
            ("服用", "fúyòng", "Phục dụng", "Uống thuốc, dùng thuốc", "月", "这种胶囊每日三次，每次两粒，饭后温水服用。", "Zhè zhǒng jiāonáng měi rì sān cì, měi cì liǎng lì, fànhòu wēnshuǐ fúyòng.", "Viên nang này ngày uống 3 lần, mỗi lần 2 viên, uống với nước ấm sau bữa ăn."),
            ("剂量", "jìliàng", "Tế lượng", "Liều lượng, liều dùng", "讠", "切不可随意增加药丸的剂量，以免引起不良反应。", "Qiè bù kě suíyì zēngjiā yàowán de jìliàng, yǐmiǎn yǐnqǐ bùliáng fǎnyìng.", "Tuyệt đối không được tùy tiện tăng liều lượng thuốc, tránh gây phản ứng phụ."),
            ("遵照", "zūnzhào", "Tuân chiếu", "Tuân theo, làm theo chỉ dẫn", "辶", "患者必须严格遵照医嘱按时服药。", "Huànzhě bìxū yángé zūnzhào yīzhǔ ànshí fúyào.", "Bệnh nhân phải tuân thủ nghiêm ngặt chỉ dẫn của bác sĩ uống thuốc đúng giờ.")
        ],
        [("剂", "jì", "Liều thuốc, thang thuốc", 8, "Văn, đao...", "Bộ Đao (刂)", "Phân liều cắt thang thuốc."),
         ("遵", "zūn", "Tuân thủ, kính phục", 15, "Chấm, phẩy...", "Bộ Sước (辶)", "Bước theo đường lối quy chuẩn.")],
        ("遵照…… (Tuân theo... / Làm theo lời dặn...)", "Giới từ chỉ sự phục tùng chỉ dẫn chuyên môn",
         "Thường dùng trong các hướng dẫn y tế, pháp lý '遵照 + Lời dặn / Quy định + Động từ'.",
         ("遵照医生的嘱咐，按疗程吃完所有消炎药。", "Zūnzhào yīshēng de zhǔfù, àn liáochéng chī wán suǒyǒu xiāoyányào.", "Tuân theo lời dặn của bác sĩ, uống hết toàn bộ thuốc chống viêm theo đúng liệu trình."),
         ("遵照你。", "遵照您的指示办理。", "Sau 遵照 phải là chỉ thị, lời dặn, quy định.")),
        ([("A", "药剂师您好，这两种药怎么吃？饭前还是饭后？", "Yàojìshī nín hǎo, zhè liǎng zhǒng yào zěnme chī? Fànqián háishì fànhòu?", "Chào dược sĩ, hai loại thuốc này uống thế nào? Trước ăn hay sau ăn?"),
          ("B", "黄色药片每天两次饭前吃，白色胶囊刺激胃，必须遵照医嘱饭后半小时服用。", "Huángsè yàopiàn měitiān liǎng cì fànqián chī, báisè jiāonáng cìjī wèi, bìxū zūnzhào yīzhǔ fànhòu bàn xiǎoshí fúyòng.", "Viên thuốc vàng ngày 2 lần uống trước ăn, viên nang trắng kích ứng dạ dày, bắt buộc phải tuân theo lời bác sĩ uống sau ăn nửa tiếng.")],
         "白色胶囊刺激胃，必须遵照医嘱饭后半小时服用。", "Viên nang trắng (白色胶囊) phải uống khi nào?", ["Uống trước khi đi ngủ", "Uống lúc đói", "Uống sau bữa ăn nửa tiếng (饭后半小时)", "Uống bất cứ lúc nào"], 2, "Dược sĩ dặn: 饭后半小时服用."),
        ("Dặn dò uống thuốc:", "遵照医嘱，一日三次，一次两片。", "Zūnzhào yīzhǔ, yí rì sān cì, yí cì liǎng piàn.", "Tuân theo lời bác sĩ dặn, một ngày 3 lần, mỗi lần 2 viên.", "Rõ ràng, dứt khoát."),
        ("Sắp xếp câu: 'Xin hãy tuân thủ chỉ dẫn của bác sĩ để uống thuốc đúng giờ'", ["遵照医嘱", "请患者", "按时服药"], ["请患者", "遵照医嘱", "按时服药"], "Chủ ngữ + 遵照... + Hành động."),
        [("Cụm từ chỉ thời điểm uống thuốc sau bữa ăn trong tiếng Trung là gì?", ["饭前 (Trước ăn)", "饭后 (Sau ăn)", "空腹 (Bụng đói)", "睡前 (Trước ngủ)"], 1, "饭后 (fànhòu) là sau bữa ăn."),
         ("Điền từ: '服药期间请____医嘱，戒烟戒酒。'", ["遵照", "究竟", "反而", "甚至"], 0, "Tuân thủ lời bác sĩ dặn dùng 遵照.")],
        ("Hướng dẫn dùng thuốc", "Đóng vai dược sĩ giải thích cặn kẽ cách uống 2 loại thuốc cho bệnh nhân người nước ngoài.", "zūnzhào yīzhǔ fúyòng", "Dược Sĩ Chu Đáo")
    )

    add_l(
        "l-520", "ch-20", "lvl-5", 5, "Đại khảo hạch HSK 5 — Chinh phục Level 5", "HSK 5级终极实战大考核",
        "Tổng ôn toàn diện 2500 từ vựng và các cặp liên từ phức hợp nâng cao của cấp độ HSK 5.",
        "Nâng cao tốc độ đọc hiểu báo chí, nghe hiểu sâu sắc và tự tin viết đoạn văn luận thuật mạch lạc.",
        [
            ("突破", "tūpò", "Đột phá", "Bứt phá, vượt qua giới hạn", "穴", "只要方法得当，词汇量一定能实现重大突破。", "Zhǐyào fāngfǎ dédàng, cíhuìliàng yídìng néng shíxiàn zhòngdà tūpò.", "Chỉ cần phương pháp đúng đắn, vốn từ vựng nhất định sẽ tạo nên bứt phá lớn."),
            ("巩固", "gǒnggù", "Củng cố", "Củng cố vững chắc, làm vững thêm", "工", "复习的目的在于巩固已经掌握的知识要点。", "Fùxí de mùdì zàiyú gǒnggù yǐjīng zhǎngwò de zhīshi yàodiǎn.", "Mục đích của ôn tập là để củng cố các trọng điểm kiến thức đã nắm vững."),
            ("冲刺", "chōngcì", "Xung thích", "Nước rút, bứt tốc về đích", "冫", "在考前最后的冲刺阶段，保持心态平稳最重要。", "Zài kǎo qián zuìhòu de chōngcì jiēduàn, bǎochí xīntài píngwěn zuì zhòngyào.", "Trong giai đoạn nước rút cuối cùng trước ngày thi, giữ vững tâm lý ổn định là quan trọng nhất."),
            ("循序渐进", "xúnxù-jiànjìn", "Tuần tự tiệm tiến", "Tiến bộ từng bước theo trình tự (Thành ngữ)", "彳", "学习外语没有捷径，必须循序渐进持之以恒。", "Xuéxí wàiyǔ méiyǒu jiéjìng, bìxū xúnxù-jiànjìn chízhīyǐhéng.", "Học ngoại ngữ không có đường tắt, bắt buộc phải tiến bộ từng bước và kiên trì đến cùng.")
        ],
        [("突", "tū", "Xông tới, đột ngột", 9, "Ngang, phẩy...", "Bộ Huyệt (穴)", "Chó phóng vọt ra từ trong hang."),
         ("循", "xún", "Men theo, tuân theo", 12, "Phẩy, phẩy...", "Bộ Xích (彳)", "Bước đi theo dấu chân đúng đắn.")],
        ("循序渐进 (Tiến bộ từng bước / Học tập bài bản)", "Thành ngữ chỉ phương pháp học tập khoa học",
         "Khuyên người học xây dựng nền móng vững chắc từ dễ đến khó, không nóng vội đốt cháy giai đoạn.",
         ("汉语学习应当循序渐进，打牢基础才能厚积薄发。", "Hànyǔ xuéxí yīngdāng xúnxù-jiànjìn, dǎ láo jīchǔ cái néng hòujī-bófā.", "Học tiếng Trung nên đi từng bước bài bản, xây chắc nền tảng mới có thể bùng nổ sức mạnh."),
         ("他循序渐进很聪明。", "学习要循序渐进。", "Thường làm vị ngữ hoặc định ngữ phương châm hành động.")),
        ([("A", "恭喜你顺利完成HSK 5级全部课程！模拟考试总分超过了240分！", "Gōngxǐ nǐ shùnlì wánchéng HSK wǔ jí quánbù kèchéng! Mónǐ kǎoshì zǒngfēn chāoguò le èrbǎi sìshí fēn!", "Chúc mừng bạn đã hoàn thành thuận lợi toàn bộ chương trình HSK 5! Điểm thi thử tổng đạt trên 240 điểm!"),
          ("B", "太棒了！从最初的听力困难到现在的流利理解，循序渐进的努力终于得到了回报！", "Tài bàng le! Cóng zuìchū de tīnglì kùnnan dào xiànzài de liúlì lǐjiě, xúnxù-jiànjìn de nǔlì zhōngyú dédào le huíbào!", "Tuyệt vời quá! Từ khó khăn nghe hiểu ban đầu đến sự thông hiểu lưu loát hiện nay, nỗ lực từng bước cuối cùng đã được đền đáp!")],
         "从最初的听力困难到现在的流利理解，循序渐进的努力终于得到了回报！", "Học viên đã trải qua hành trình tiến bộ như thế nào?", ["Gian lận thi cử", "Bỏ cuộc giữa chừng", "Nỗ lực từng bước (循序渐进) vượt qua khó khăn để thành công", "Học vẹt"], 2, "Hành trình: 循序渐进的努力终于得到了回报."),
        ("Lời tuyên thệ vượt ải HSK 5:", "我已全面攻克HSK 5级，向高阶殿堂迈进！", "Wǒ yǐ quánmiàn gōngkè HSK wǔ jí, xiàng gāojiē diàntáng màijìn!", "Tôi đã hoàn toàn chinh phục HSK 5, tự tin tiến bước lên nấc thang cao cấp!", "Khí phách ngút trời."),
        ("Sắp xếp câu: 'Học tập ngoại ngữ cần phải tiến bộ từng bước'", ["必须", "学外语", "循序渐进"], ["学外语", "必须", "循序渐进"], "Chủ ngữ + 必须 + 循序渐进."),
        [("Thành ngữ bốn chữ nào khuyên chúng ta học tập cần có trình tự từ dễ đến khó, không đốt cháy giai đoạn?", ["循序渐进", "半途而废", "显而易见", "不见不散"], 0, "循序渐进 (xúnxù-jiànjìn) là đi từng bước vững chắc."),
         ("Điền từ: '经过考前____训练，他的答题速度明显提升了。'", ["冲刺", "所谓", "挂号", "退房"], 0, "Luyện thi nước rút dùng 冲刺.")],
        ("Đại khảo hạch HSK 5", "Hoàn thành toàn bộ thử thách HSK 5, nhận chứng nhận sẵn sàng bước vào HSK 6 cao cấp.", "xúnxù jiànjìn HSK wǔ jí", "Bậc Thầy Cao Cấp HSK 5")
    )

print("HSK 5 (Chapters 17-20, 20 lessons) loaded successfully.")
