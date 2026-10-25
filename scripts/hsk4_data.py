# -*- coding: utf-8 -*-
"""
HSK 4 LESSON DATA: CHAPTERS 13 - 16 (l-401 to l-420)
"""

def get_hsk4_lessons(add_l):
    # =========================================================================
    # CHAPTER 13: Giao tiếp xã hội & Kết bạn (l-401 to l-405)
    # =========================================================================
    add_l(
        "l-401", "ch-13", "lvl-4", 1, "Kết bạn mới & Trao đổi WeChat", "结识新朋友与加微信",
        "Cách xin phương thức liên lạc lịch thiệp và làm quen qua mạng xã hội.",
        "Nắm vững cách xin WeChat, quét mã QR và mẫu câu kết nối ban đầu.",
        [
            ("微信", "wēixìn", "Vi tín", "WeChat (mạng xã hội Trung Quốc)", "彳", "我们可以加个微信吗？", "Wǒmen kěyǐ jiā gè wēixìn ma?", "Chúng ta có thể kết bạn WeChat không?"),
            ("扫", "sǎo", "Tảo", "Quét (mã QR)", "扌", "我扫你的二维码。", "Wǒ sǎo nǐ de èrwéimǎ.", "Để tôi quét mã QR của bạn."),
            ("联系", "liánxì", "Liên hệ", "Liên lạc, liên hệ", "纟", "以后常联系！", "Yǐhòu cháng liánxì!", "Sau này thường xuyên liên lạc nhé!"),
            ("号码", "hàomǎ", "Hào mã", "Số điện thoại, số hiệu", "口", "这是我的电话号码。", "Zhè shì wǒ de diànhuà hàomǎ.", "Đây là số điện thoại của tôi.")
        ],
        [("微", "wēi", "Nhỏ, vi mô", 13, "Phẩy, sổ, ngang...", "Bộ Xích (彳)", "Sự kết nối tinh tế nhỏ bé."),
         ("扫", "sǎo", "Quét", 11, "Ngang, sổ móc, hất...", "Bộ Thủ (扌)", "Bàn tay cầm chổi quét hoặc lia quét mã.")],
        ("不仅……而且…… (Không những... mà còn...)", "Cấu trúc liên từ tăng tiến 不仅……而且……",
         "Dùng để nối hai mệnh đề biểu thị mức độ ý nghĩa tăng tiến. Đặt chủ ngữ trước 不仅 nếu cả hai vế cùng một chủ thể.",
         ("他不仅会说汉语，而且说得非常流利。", "Tā bùjǐn huì shuō Hànyǔ, érqiě shuō de fēicháng liúlì.", "Anh ấy không những biết nói tiếng Trung mà còn nói rất lưu loát."),
         ("不仅他会唱歌，而且会跳舞。", "他不仅会唱歌，而且会跳舞。", "Chủ ngữ 他 đứng trước 不仅.")),
        ([("A", "很高兴认识你，可以加个微信吗？", "Hěn gāoxìng rènshí nǐ, kěyǐ jiā gè wēixìn ma?", "Rất vui được quen bạn, có thể kết bạn WeChat không?"),
          ("B", "好的，我扫你的二维码吧。", "Hǎo de, wǒ sǎo nǐ de èrwéimǎ ba.", "Được chứ, để tôi quét mã QR của bạn nhé.")],
         "好的，我扫你的二维码吧。", "Người B muốn làm gì?", ["Gọi điện", "Quét mã QR WeChat", "Gửi email", "Từ chối"], 1, "Người B đồng ý và quét mã QR."),
        ("Nói câu xin WeChat:", "你扫我还是我扫你？", "Nǐ sǎo wǒ háishì wǒ sǎo nǐ?", "Bạn quét tôi hay tôi quét bạn?", "Nhấn giọng ở động từ sǎo."),
        ("Sắp xếp câu: 'Sau này chúng ta thường xuyên liên lạc nhé'", ["以后", "常联系", "我们", "吧"], ["以后", "我们", "常联系", "吧"], "Trạng từ thời gian 以后 đứng đầu câu hoặc sau chủ ngữ."),
        [("Mẫu câu nào dùng để xin phương thức liên lạc lịch sự nhất?", ["可以加个微信吗？", "快把微信给我！", "我不需要你的微信。", "你在干什么？"], 0, "Dùng 可以...吗？ thể hiện sự lịch thiệp."),
         ("Điền từ: '他____聪明，____非常勤奋。'", ["因为...所以...", "不仅...而且...", "虽然...但是...", "如果...就..."], 1, "Ý tăng tiến dùng 不仅...而且...")],
        ("Trao đổi liên lạc", "Luyện nói phản xạ xin WeChat và đối đáp tự nhiên.", "kěyǐ jiā gè wēixìn ma?", "Sứ Giả Giao Tiếp HSK 4")
    )

    add_l(
        "l-402", "ch-13", "lvl-4", 2, "Hẹn đi xem phim & Cà phê cuối tuần", "周末约会看电影喝咖啡",
        "Lên lịch hẹn hò, gợi ý địa điểm và chốt thời gian cuối tuần.",
        "Sử dụng thành thạo từ ngữ hẹn gặp và biểu đạt sự cam kết 不见不散.",
        [
            ("约会", "yuēhuì", "Ước hội", "Hẹn hò, cuộc hẹn", "纟", "这个周末你有什么约会吗？", "Zhège zhōumò nǐ yǒu shénme yuēhuì ma?", "Cuối tuần này bạn có cuộc hẹn nào không?"),
            ("电影院", "diànyǐngyuàn", "Điện ảnh viện", "Rạp chiếu phim", "阝", "我们在电影院门口见。", "Wǒmen zài diànyǐngyuàn ménkǒu jiàn.", "Chúng ta gặp ở cổng rạp chiếu phim nhé."),
            ("空儿", "kòngr", "Không nhi", "Thời gian rảnh", "穴", "明天下午你有空儿吗？", "Míngtiān xiàwǔ nǐ yǒu kòngr ma?", "Chiều mai bạn có rảnh không?"),
            ("建议", "jiànyì", "Kiến nghị", "Gợi ý, đề xuất", "言", "我建议去喝咖啡。", "Wǒ jiànyì qù hē kāfēi.", "Tôi đề xuất đi uống cà phê.")
        ],
        [("约", "yuē", "Hẹn ước", 6, "Phẩy gập, ngang...", "Bộ Mịch (纟)", "Sợi tơ gắn kết lời hẹn."),
         ("建", "jiàn", "Xây dựng, kiến nghị", 8, "Ngang gập, sổ...", "Bộ Dẫn (廴)", "Đặt nền móng xây dựng.")],
        ("既然……就…… (Đã... thì...)", "Cấu trúc suy luận nhân quả 既然……就……",
         "Dùng khi đưa ra kết luận hoặc đề xuất hành động dựa trên thực tế đã biết trước.",
         ("既然你有空儿，我们就一起去吧。", "Jìrán nǐ yǒu kòngr, wǒmen jiù yìqǐ qù ba.", "Đã là bạn rảnh thì chúng ta cùng đi thôi."),
         ("因为你来了，就进去。", "既然你来了，就进去坐吧。", "Đưa ra đề xuất dựa trên hiện thực trước mắt dùng 既然...就...")),
        ([("A", "星期六下午三点电影院见，不见不散！", "Xīngqīliù xiàwǔ sān diǎn diànyǐngyuàn jiàn, bú jiàn bú sàn!", "Chiều thứ Bảy lúc 3 giờ gặp ở rạp phim, không gặp không về nhé!"),
          ("B", "好的，不见不散！", "Hǎo de, bú jiàn bú sàn!", "Được chứ, không gặp không về!")],
         "好的，不见不散！", "Hai người đã hẹn gặp nhau khi nào?", ["Sáng thứ Hai", "Chiều thứ Bảy lúc 3 giờ", "Chủ nhật tuần sau", "Tối thứ Sáu"], 1, "Lời hẹn: 星期六下午三点."),
        ("Nói lời hứa hẹn cuộc gặp:", "周六下午，不见不散！", "Zhōuliù xiàwǔ, bú jiàn bú sàn!", "Chiều thứ Bảy, không gặp không về nhé!", "Phát âm dứt khoát bú jiàn bú sàn."),
        ("Sắp xếp câu: 'Đã thích thì bạn mua đi'", ["就买吧", "既然", "喜欢", "你"], ["既然", "你", "喜欢", "就买吧"], "Cấu trúc 既然...就..."),
        [("Thành ngữ '不见不散' dùng trong ngữ cảnh nào?", ["Khi chia tay vĩnh viễn", "Khi hẹn gặp chắc chắn với ai đó", "Khi từ chối cuộc hẹn", "Khi đi lạc đường"], 1, "Dùng để khẳng định quyết tâm gặp mặt."),
         ("Điền liên từ: '____下雨了，我们____在室内看电影吧。'", ["既然...就...", "因为...但...", "不仅...而且...", "虽然...所以..."], 0, "Cặp từ phù hợp: 既然...就...")],
        ("Lên lịch hẹn", "Viết tin nhắn rủ bạn đi uống cà phê.", "bú jiàn bú sàn", "Chuyên Gia Lên Lịch")
    )

    add_l(
        "l-403", "ch-13", "lvl-4", 3, "Chia sẻ sở thích thể thao & Nghệ thuật", "谈论体育运动与艺术爱好",
        "Mô tả đam mê tập gym, nhiếp ảnh và lợi ích của rèn luyện.",
        "Diễn đạt sở thích cá nhân bằng cấu trúc 对...感兴趣 và 对...有好处.",
        [
            ("健身", "jiànshēn", "Kiện thân", "Tập thể hình, rèn luyện", "亻", "我喜欢去健身房。", "Wǒ xǐhuan qù jiànshēnfáng.", "Tôi thích đến phòng gym."),
            ("摄影", "shèyǐng", "Nhiếp ảnh", "Nhiếp ảnh, chụp ảnh", "扌", "我对摄影很感兴趣。", "Wǒ duì shèyǐng hěn gǎn xìngqù.", "Tôi rất có hứng thú với nhiếp ảnh."),
            ("坚持", "jiānchí", "Kiên trì", "Kiên trì, giữ vững", "土", "坚持锻炼身体好。", "Jiānchí duànliàn shēntǐ hǎo.", "Kiên trì rèn luyện sức khỏe sẽ tốt."),
            ("吸引", "xīyǐn", "Hấp dẫn", "Thu hút, lôi cuốn", "口", "这首歌吸引了很多人。", "Zhè shǒu gē xīyǐn le hěn duō rén.", "Bài hát này thu hút rất nhiều người.")
        ],
        [("持", "chí", "Nắm giữ, duy trì", 9, "Ngang, sổ...", "Bộ Thủ (扌)", "Bàn tay nắm giữ bền bỉ."),
         ("摄", "shè", "Thu nạp, chụp ảnh", 13, "Ngang, sổ...", "Bộ Thủ (扌)", "Đôi tay nắm bắt khoảnh khắc nghệ thuật.")],
        ("对……感兴趣 / 有好处 (Có hứng thú với... / Có lợi cho...)", "Giới từ 对 biểu thị đối tượng",
         "Đặt cụm '对 + Đối tượng' trước vị ngữ để biểu thị thái độ hoặc ảnh hưởng.",
         ("多吃水果对身体有好处。", "Duō chī shuǐguǒ duì shēntǐ yǒu hǎochu.", "Ăn nhiều hoa quả rất có lợi cho sức khỏe."),
         ("我很有兴趣对汉语。", "我对汉语很感兴趣。", "'对汉语' phải đặt trước '感兴趣'.")),
        ([("A", "你平时有什么爱好？", "Nǐ píngshí yǒu shénme àihào?", "Ngày thường bạn có sở thích gì?"),
          ("B", "我对摄影特别感兴趣，经常出去拍照。", "Wǒ duì shèyǐng tèbié gǎn xìngqù, jīngcháng chūqù pāizhào.", "Tôi đặc biệt có hứng thú với nhiếp ảnh, thường ra ngoài chụp ảnh.")],
         "我对摄影特别感兴趣，经常出去拍照。", "Người B có sở thích gì?", ["Đá bóng", "Nhiếp ảnh (Chụp ảnh)", "Nấu ăn", "Chơi game"], 1, "Người B nói rõ: 对摄影特别感兴趣."),
        ("Nói về sự hứng thú:", "我对中国书法很感兴趣。", "Wǒ duì Zhōngguó shūfǎ hěn gǎn xìngqù.", "Tôi rất có hứng thú với thư pháp Trung Quốc.", "Đọc liền mạch cụm duì Zhōngguó shūfǎ."),
        ("Sắp xếp câu: 'Kiên trì tập thể dục rất tốt cho sức khỏe'", ["对身体", "锻炼", "很有好处", "坚持"], ["坚持", "锻炼", "对身体", "很有好处"], "Cấu trúc Chủ ngữ hành động + 对... + 很有好处."),
        [("Chọn câu có trật tự từ đúng ngữ pháp:", ["他对音乐很感兴趣。", "他很感兴趣对音乐。", "对音乐他感兴趣很。", "他感兴趣很对音乐。"], 0, "Cấu trúc chuẩn: 对 + Đối tượng + 感兴趣."),
         ("Từ '坚持' mang ý nghĩa gì?", ["Bỏ dở giữa chừng", "Kiên trì bền bỉ", "Thay đổi liên tục", "Chậm chạp"], 1, "坚持 nghĩa là kiên trì không từ bỏ.")],
        ("Nói về sở thích", "Ghi âm 30 giây chia sẻ môn thể thao bạn yêu thích.", "duì shēntǐ yǒu hǎochu", "Phong Cách Năng Động")
    )

    add_l(
        "l-404", "ch-13", "lvl-4", 4, "Thảo luận kế hoạch học tập & Thi cử", "讨论学习计划与备考策略",
        "Cách lập kế hoạch ôn thi HSK 4, vượt qua áp lực và kiên trì.",
        "Nắm vững cấu trúc điều kiện 只要……就…… và từ vựng thi cử.",
        [
            ("复习", "fùxí", "Phục tập", "Ôn tập", "彳", "考前要认真复习。", "Kǎo qián yào rènzhēn fùxí.", "Trước kỳ thi cần ôn tập chăm chỉ."),
            ("压力", "yālì", "Áp lực", "Áp lực, căng thẳng", "厂", "不要给自己太大压力。", "Bú yào gěi zìjǐ tài dà yālì.", "Đừng tạo cho mình áp lực quá lớn."),
            ("严格", "yángé", "Nghiêm cách", "Nghiêm khắc, chặt chẽ", "木", "老师对我们要求很严格。", "Lǎoshī duì wǒmen yāoqiú hěn yángé.", "Thầy cô yêu cầu chúng tôi rất nghiêm khắc."),
            ("通过", "tōngguò", "Thông quá", "Vượt qua, đỗ kỳ thi", "辶", "祝你顺利通过考试！", "Zhù nǐ shùnlì tōngguò kǎoshì!", "Chúc bạn thuận lợi vượt qua kỳ thi!")
        ],
        [("压", "yā", "Đè, áp lực", 6, "Ngang, phẩy...", "Bộ Hán (厂)", "Đá tảng đè nặng."),
         ("严", "yán", "Nghiêm chỉnh", 7, "Ngang, sổ...", "Bộ Nhất", "Kỷ luật nghiêm trang.")],
        ("只要……就…… (Chỉ cần... thì...)", "Cấu trúc điều kiện đủ 只要……就……",
         "Chỉ cần đáp ứng điều kiện ở phân câu trước thì sẽ dẫn đến kết quả ở phân câu sau.",
         ("只要努力，就能通过考试。", "Zhǐyào nǔlì, jiù néng tōngguò kǎoshì.", "Chỉ cần nỗ lực thì có thể vượt qua kỳ thi."),
         ("只要努力，才通过。", "只要努力，就能通过。", "只要 đi với 就; còn 只有 mới đi với 才.")),
        ([("A", "下周就要考HSK 4了，我有点担心。", "Xià zhōu jiù yào kǎo HSK sì le, wǒ yǒudiǎn dānxīn.", "Tuần sau thi HSK 4 rồi, tôi hơi lo."),
          ("B", "别慌，只要平时认真复习，就一定没问题。", "Bié huāng, zhǐyào píngshí rènzhēn fùxí, jiù yídìng méi wèntí.", "Đừng hoảng, chỉ cần ngày thường ôn tập chăm chỉ là nhất định không sao.")],
         "别慌，只要平时认真复习，就一定没问题。", "Người B đưa ra lời khuyên gì?", ["Bỏ thi đi chơi", "Chỉ cần chăm chỉ ôn tập thì không lo", "Uống thuốc ngủ", "Đổi giáo viên"], 1, "B động viên: 只要平时认真复习，就一定没问题."),
        ("Nói câu tự khích lệ:", "只要坚持，就一定会成功！", "Zhǐyào jiānchí, jiù yídìng huì chénggōng!", "Chỉ cần kiên trì thì nhất định sẽ thành công!", "Nói với ngữ điệu kiên định."),
        ("Sắp xếp câu: 'Chỉ cần trời tạnh mưa thì chúng ta đi'", ["只要", "雨停了", "就出发", "我们"], ["只要", "雨停了", "我们", "就出发"], "Cấu trúc 只要...就..."),
        [("Điền từ phù hợp: '____你按时完成作业，____能取得好成绩。'", ["因为...所以...", "只要...就...", "虽然...但是...", "宁可...也..."], 1, "Điều kiện đủ dùng 只要...就..."),
         ("Trái nghĩa với '严格' (nghiêm khắc) là gì?", ["随便 / 松懈", "认真", "努力", "勤劳"], 0, "随便/松懈 mang nghĩa tùy tiện, buông lỏng.")],
        ("Mục tiêu vượt ải HSK", "Ghi lại mục tiêu học tập hàng ngày bằng tiếng Trung.", "tōngguò kǎoshì", "Tinh Thần Khảo Thí")
    )

    add_l(
        "l-405", "ch-13", "lvl-4", 5, "Ôn tập & Phản xạ hội thoại kết bạn", "第十三章复习与社交情景实战",
        "Tổng hợp kỹ năng giao tiếp kết bạn và mẫu câu tạo ấn tượng.",
        "Hoàn thiện phản xạ giao tiếp xã hội và cấu trúc 给...留下深刻印象.",
        [
            ("交流", "jiāoliú", "Giao lưu", "Giao lưu, trao đổi", "亠", "多交流能提高口语。", "Duō jiāoliú néng tígāo kǒuyǔ.", "Giao lưu nhiều giúp nâng cao khẩu ngữ."),
            ("印象", "yìnxiàng", "Ấn tượng", "Ấn tượng", "卩", "他对我的第一印象很好。", "Tā duì wǒ de dì-yī yìnxiàng hěn hǎo.", "Anh ấy có ấn tượng đầu tiên rất tốt về tôi."),
            ("性格", "xìnggé", "Tính cách", "Tính cách", "忄", "她的性格很活泼。", "Tā de xìnggé hěn huópo.", "Tính cách cô ấy rất hoạt bát."),
            ("幽默", "yōumò", "U mặc", "Hài hước, hóm hỉnh", "幺", "王老师说话很幽默。", "Wáng lǎoshī shuōhuà hěn yōumò.", "Thầy Vương nói chuyện rất hài hước.")
        ],
        [("印", "yìn", "Dấu ấn, in", 5, "Phẩy, ngang...", "Bộ Tiết (卩)", "Con dấu in sâu."),
         ("格", "gé", "Quy cách, phẩm cách", 10, "Ngang, sổ...", "Bộ Mộc (木)", "Khung gỗ chuẩn mực.")],
        ("给……留下深刻的印象 (Để lại ấn tượng sâu sắc cho...)", "Cấu trúc diễn đạt ấn tượng",
         "Chủ thể tạo ấn tượng + 给 + Người tiếp nhận + 留下深刻的印象.",
         ("这部电影给我留下了深刻的印象。", "Zhè bù diànyǐng gěi wǒ liúxià le shēnkè de yìnxiàng.", "Bộ phim này để lại ấn tượng sâu sắc cho tôi."),
         ("我留下了很深的印象北京。", "北京给我留下了很深的印象。", "Chủ thể tạo ấn tượng đứng trước 给.")),
        ([("A", "你觉得新来的同事怎么样？", "Nǐ juéde xīn lái de tóngshì zěnmeyàng?", "Bạn thấy đồng nghiệp mới đến thế nào?"),
          ("B", "他不仅工作认真，而且性格特别幽默。", "Tā bùjǐn gōngzuò rènzhēn, érqiě xìnggé tèbié yōumò.", "Anh ấy không những làm việc nghiêm túc mà tính cách còn rất hài hước.")],
         "他不仅工作认真，而且性格特别幽默。", "Người đồng nghiệp mới có đặc điểm gì?", ["Lười biếng", "Làm việc chăm chỉ và tính cách hài hước", "Ít nói", "Thường nổi nóng"], 1, "不仅工作认真，而且性格特别幽默."),
        ("Khen ngợi tính cách bạn bè:", "他性格开朗，说话很幽默。", "Tā xìnggé kāilǎng, shuōhuà hěn yōumò.", "Anh ấy tính cách cởi mở, nói chuyện rất hài hước.", "Ngắt giọng rõ ràng sau kāilǎng."),
        ("Sắp xếp câu: 'Thầy giáo để lại ấn tượng sâu sắc cho tôi'", ["深刻的印象", "老师", "留下了", "给我"], ["老师", "给我", "留下了", "深刻的印象"], "Chủ ngữ + 给我 + 留下了 + 深刻的印象."),
        [("Từ nào miêu tả người hay pha trò khiến người khác cười vui vẻ?", ["严格", "幽默", "内向", "害羞"], 1, "幽默 (hài hước)."),
         ("Điền từ: '北京的历史文化给游客留下了____的印象。'", ["深刻", "严格", "马虎", "着急"], 0, "深刻的印象 (ấn tượng sâu sắc).")],
        ("Tổng kết Chương 13", "Viết đoạn văn ngắn 50 chữ mô tả người bạn Trung Quốc của bạn.", "shēnkè de yìnxiàng", "Hoàn Thành Chương 13")
    )

    # =========================================================================
    # CHAPTER 14: Du lịch tự túc & Khách sạn (l-406 to l-410)
    # =========================================================================
    add_l(
        "l-406", "ch-14", "lvl-4", 1, "Đặt phòng khách sạn online & Loại phòng", "网上预订酒店与房型选择",
        "Tra cứu thông tin phòng, đặt phòng khách sạn trực tuyến và hỏi tiện ích.",
        "Làm chủ từ vựng về khách sạn: 预订, 标准间, 押金 và liên từ 无论……都……",
        [
            ("预订", "yùdìng", "Dự đính", "Đặt trước (phòng, vé)", "言", "我在网上预订了一间大床房。", "Wǒ zài wǎngshang yùdìng le yì jiān dàchuángfáng.", "Tôi đã đặt trước một phòng giường lớn trên mạng."),
            ("标准间", "biāozhǔnjiān", "Tiêu chuẩn gian", "Phòng tiêu chuẩn (2 giường đơn)", "木", "请问标准间一晚多少钱？", "Qǐngwèn biāozhǔnjiān yì wǎn duōshao qián?", "Xin hỏi phòng tiêu chuẩn một đêm bao nhiêu tiền?"),
            ("押金", "yājīn", "Áp kim", "Tiền đặt cọc", "金", "入住需要交五百块押金。", "Rùzhù xūyào jiāo wǔbǎi kuài yājīn.", "Nhận phòng cần nộp 500 tệ tiền cọc."),
            ("免费", "miǎnfèi", "Miễn phí", "Miễn phí", "免", "酒店提供免费早餐和无线网络。", "Jiǔdiàn tígōng miǎnfèi zǎocān hé wúxiàn wǎngluò.", "Khách sạn cung cấp bữa sáng và Wi-Fi miễn phí.")
        ],
        [("订", "dìng", "Đặt trước", 4, "Chấm, ngang...", "Bộ Ngôn (言)", "Dùng lời nói đặt chỗ trước."),
         ("标", "biāo", "Tiêu chuẩn, ngọn cờ", 9, "Ngang, sổ...", "Bộ Mộc (木)", "Cột mốc tiêu chuẩn.")],
        ("无论……都…… (Bất luận / Dù cho... đều...)", "Cấu trúc liên từ điều kiện vô điều kiện",
         "Biểu thị trong bất kỳ điều kiện nào thì kết quả cũng không thay đổi.",
         ("无论遇到什么困难，我们都要坚持下去。", "Wúlùn yùdào shénme kùnnan, wǒmen dōu yào jiānchí xiàqù.", "Bất luận gặp khó khăn gì, chúng ta đều phải kiên trì."),
         ("无论你去，我也去。", "无论你去不去，我都去。", "Phía sau 无论 thường có đại từ nghi vấn hoặc phương án lựa chọn.")),
        ([("A", "您好，我预订了一间标准间，住两晚。", "Nín hǎo, wǒ yùdìng le yì jiān biāozhǔnjiān, zhù liǎng wǎn.", "Xin chào, tôi đã đặt trước một phòng tiêu chuẩn, ở 2 đêm."),
          ("B", "好的，请出示护照，并交三百元押金。", "Hǎo de, qǐng chūshì hùzhào, bìng jiāo sānbǎi yuán yājīn.", "Vâng, xin vui lòng xuất trình hộ chiếu và nộp 300 tệ tiền cọc.")],
         "好的，请出示护照，并交三百元押金。", "Khách cần nộp bao nhiêu tiền đặt cọc?", ["100 tệ", "200 tệ", "300 tệ", "Miễn phí"], 2, "B thông báo: 并交三百元押金."),
        ("Hỏi về bữa sáng miễn phí:", "酒店提供免费早餐吗？", "Jiǔdiàn tígōng miǎnfèi zǎocān ma?", "Khách sạn có cung cấp bữa sáng miễn phí không?", "Hỏi với ngữ điệu lễ phép."),
        ("Sắp xếp câu: 'Dù bận thế nào anh ấy cũng tập thể dục'", ["无论", "多忙", "他都", "坚持锻炼"], ["无论", "多忙", "他都", "坚持锻炼"], "Cấu trúc 无论...都..."),
        [("Phòng có 2 giường đơn trong khách sạn gọi là gì?", ["大床房", "标准间 (标间)", "套房", "钟点房"], 1, "标准间 là phòng tiêu chuẩn 2 giường đơn."),
         ("Điền từ: '____天气怎么样，比赛____会照常进行。'", ["虽然...但是...", "无论...都...", "因为...所以...", "只要...才..."], 1, "Vô điều kiện dùng 无论...都...")],
        ("Đặt phòng khách sạn", "Ghi âm hội thoại đặt phòng tiêu chuẩn 2 đêm có bữa sáng.", "yùdìng biāozhǔnjiān", "Lữ Khách Tự Túc")
    )

    add_l(
        "l-407", "ch-14", "lvl-4", 2, "Thủ tục nhận phòng & Trả phòng", "办理入住与退房手续",
        "Cách giao tiếp tại quầy lễ tân: Check-in, lấy thẻ phòng và gửi hành lý.",
        "Nắm vững các thuật ngữ: 办理, 手续, 房卡, 退房 và cấu trúc 连……也/都……",
        [
            ("办理", "bànlǐ", "Biện lý", "Làm thủ tục, giải quyết", "力", "请问在哪里办理入住？", "Qǐngwèn zài nǎlǐ bànlǐ rùzhù?", "Xin hỏi làm thủ tục nhận phòng ở đâu?"),
            ("手续", "shǒuxù", "Thủ tục", "Thủ tục", "手", "入住手续很快就办好了。", "Rùzhù shǒuxù hěn kuài jiù bàn hǎo le.", "Thủ tục nhận phòng rất nhanh đã làm xong."),
            ("房卡", "fángkǎ", "Phòng tạp", "Thẻ phòng", "户", "这是您的房卡，房间在八楼。", "Zhè shì nín de fángkǎ, fángjiān zài bā lóu.", "Đây là thẻ phòng của quý khách, phòng ở tầng 8."),
            ("退房", "tuìfáng", "Thoái phòng", "Trả phòng", "辶", "请在中午十二点以前退房。", "Qǐng zài zhōngwǔ shí'èr diǎn yǐqián tuìfáng.", "Xin vui lòng trả phòng trước 12 giờ trưa.")
        ],
        [("办", "bàn", "Làm, giải quyết", 4, "Ngang gập, phẩy...", "Bộ Lực (力)", "Dùng sức lực hoàn thành việc."),
         ("卡", "kǎ", "Thẻ, kẹp", 5, "Sổ, ngang...", "Bộ Bốc (卜)", "Tấm thẻ từ mỏng.")],
        ("连……也/都…… (Ngay cả... cũng...)", "Cấu trúc nhấn mạnh trường hợp cực đoan",
         "Dùng để nhấn mạnh một sự việc hiển nhiên hoặc cực đoan nhằm làm nổi bật ý.",
         ("这个问题太难了，连老师都不知道答案。", "Zhè gè wèntí tài nán le, lián lǎoshī dōu bù zhīdào dá'àn.", "Câu hỏi này khó quá, ngay cả thầy giáo cũng không biết đáp án."),
         ("他连昨天没来。", "他连昨天都没来。", "Sau thành phần nhấn mạnh phải có 也 hoặc 都.")),
        ([("A", "您好，我想办理退房，押金怎么退？", "Nín hǎo, wǒ xiǎng bànlǐ tuìfáng, yājīn zěnme tuì?", "Xin chào, tôi muốn trả phòng, tiền cọc hoàn lại thế nào?"),
          ("B", "押金会原路退回到您的微信账户，请稍等。", "Yājīn huì yuánlù tuìhuí dào nín de wēixìn zhànghù, qǐng shāoděng.", "Tiền cọc sẽ hoàn lại theo đường cũ vào tài khoản WeChat của quý khách, xin đợi một lát.")],
         "押金会原路退回到您的微信账户，请稍等。", "Tiền đặt cọc sẽ được hoàn lại qua đâu?", ["Tiền mặt", "Thẻ tín dụng", "Tài khoản WeChat", "Không được hoàn lại"], 2, "B giải thích: 退回到您的微信账户."),
        ("Nhắc nhở thời gian trả phòng:", "退房时间是中午十二点。", "Tuìfáng shíjiān shì zhōngwǔ shí'èr diǎn.", "Thời gian trả phòng là 12 giờ trưa.", "Phát âm chuẩn tuìfáng shíjiān."),
        ("Sắp xếp câu: 'Ngay cả đứa trẻ 3 tuổi cũng biết điều này'", ["连三岁的小孩", "都", "知道", "这件事"], ["这件事", "连三岁的小孩", "都", "知道"], "Cấu trúc 连...都..."),
        [("Trước khi rời khách sạn bạn phải làm thủ tục gì?", ["入住手续", "退房手续", "登机手续", "开户手续"], 1, "Rời khách sạn là 退房手续 (trả phòng)."),
         ("Điền từ: '他太累了，____饭____不想吃。'", ["连...都...", "虽然...但...", "不仅...而且...", "如果...就..."], 0, "Nhấn mạnh cực đoan: 连...都/也...")],
        ("Thủ tục khách sạn", "Mô phỏng cuộc đối thoại trả phòng tại quầy lễ tân.", "bànlǐ tuìfáng", "Thành Thạo Check-out")
    )

    add_l(
        "l-408", "ch-14", "lvl-4", 3, "Đổi ngoại tệ & Rút tiền tại ATM", "货币兑换与银行提现",
        "Hỏi tỷ giá hối đoái, đổi tiền mặt tại ngân hàng và sử dụng cây ATM.",
        "Sử dụng từ vựng tài chính: 兑换, 汇率, 现金, 手续费 và giới từ 按照……",
        [
            ("兑换", "duìhuàn", "Đoái hoán", "Đổi (tiền tệ)", "儿", "请问这里可以兑换人民币吗？", "Qǐngwèn zhèlǐ kěyǐ duìhuàn rénmínbì ma?", "Xin hỏi ở đây có thể đổi Nhân dân tệ không?"),
            ("汇率", "huìlǜ", "Hối suất", "Tỷ giá hối đoái", "氵", "今天的美元兑人民币汇率是多少？", "Jīntiān de měiyuán duì rénmínbì huìlǜ shì duōshao?", "Tỷ giá USD đổi NDT hôm nay là bao nhiêu?"),
            ("现金", "xiànjīn", "Hiện kim", "Tiền mặt", "王", "我身上没有带多少现金。", "Wǒ shēnshang méiyǒu dài duōshao xiànjīn.", "Trên người tôi không mang theo nhiều tiền mặt."),
            ("手续费", "shǒuxùfèi", "Thủ tục phí", "Phí dịch vụ, phí chuyển đổi", "手", "跨行取款需要收手续费。", "Kuà háng qǔkuǎn xūyào shōu shǒuxùfèi.", "Rút tiền khác ngân hàng cần thu phí dịch vụ.")
        ],
        [("兑", "duì", "Đổi, tương hợp", 7, "Phẩy, chấm...", "Bộ Nhi (儿)", "Trao đổi bình đẳng."),
         ("率", "lǜ", "Tỷ lệ, suất", 11, "Chấm, ngang...", "Bộ Huyền (玄)", "Tỷ lệ tính toán.")],
        ("按照…… (Căn cứ vào... / Theo như...)", "Giới từ chỉ căn cứ, tiêu chuẩn",
         "Dùng '按照 + Tiêu chuẩn / Quy định' đặt trước động từ chỉ hành động tuân thủ.",
         ("银行按照当天的汇率为您兑换外币。", "Yínháng ànzhào dāngtiān de huìlǜ wèi nín duìhuàn wàibì.", "Ngân hàng căn cứ theo tỷ giá hôm nay để đổi ngoại tệ cho quý khách."),
         ("我们按照规则做。", "我们要按照规则办事。", "Cần có bổ ngữ hoặc tân ngữ hoàn chỉnh sau động từ.")),
        ([("A", "请问兑换一千美元需要收手续费吗？", "Qǐngwèn duìhuàn yìqiān měiyuán xūyào shōu shǒuxùfèi ma?", "Xin hỏi đổi 1000 USD có phải mất phí dịch vụ không?"),
          ("B", "不需要，我们直接按照今日牌价结算。", "Bù xūyào, wǒmen zhíjiē ànzhào jīnrì páijià jiésuàn.", "Không cần, chúng tôi thanh toán trực tiếp theo giá niêm yết hôm nay.")],
         "不需要，我们直接按照今日牌价结算。", "Đổi tiền tại đây có mất phí dịch vụ không?", ["Mất 1%", "Mất 50 tệ", "Hoàn toàn miễn phí dịch vụ", "Tùy thuộc số tiền"], 2, "B nói rõ: 不需要 (không cần)."),
        ("Xin tiền lẻ:", "请给我一些零钱现金。", "Qǐng gěi wǒ yìxiē língqián xiànjīn.", "Xin đổi cho tôi ít tiền mặt mệnh giá nhỏ.", "Phát âm chuẩn língqián xiànjīn."),
        ("Sắp xếp câu: 'Mọi người phải làm việc theo quy định'", ["按照", "规定", "大家要", "办事"], ["大家要", "按照", "规定", "办事"], "Cấu trúc 按照 + Quy định + Làm việc."),
        [("Từ nào chỉ tỷ giá trao đổi giữa hai loại tiền tệ?", ["利率 (Lãi suất)", "汇率 (Tỷ giá)", "效率 (Hiệu suất)", "概率 (Xác suất)"], 1, "汇率 (huìlǜ) là tỷ giá hối đoái."),
         ("Điền từ: '请____医生的建议按时服药。'", ["按照", "既然", "不仅", "无论"], 0, "Theo như lời khuyên của bác sĩ dùng 按照.")],
        ("Đổi ngoại tệ", "Luyện nói câu hỏi tỷ giá và đổi tiền tại quầy ngân hàng.", "duìhuàn rénmínbì", "Quản Lý Tài Chính")
    )

    add_l(
        "l-409", "ch-14", "lvl-4", 4, "Thuê xe du lịch & Hỏi đường tham quan", "租车出行与旅游咨询",
        "Hỏi thủ tục thuê xe tự lái, lộ trình ngắm cảnh và giá vé tham quan.",
        "Nắm vững từ vựng du lịch: 租车, 路线, 门票, 导游 và cấu trúc 既……又……",
        [
            ("租车", "zūchē", "Tô xa", "Thuê xe", "禾", "在当地租车自驾非常方便。", "Zài dāngdì zūchē zìjià fēicháng fāngbiàn.", "Thuê xe tự lái ở địa phương rất thuận tiện."),
            ("路线", "lùxiàn", "Lộ tuyến", "Tuyến đường, lộ trình", "纟", "请问去故宫的最佳路线是什么？", "Qǐngwèn qù Gùgōng de zuì jiā lùxiàn shì shénme?", "Xin hỏi lộ trình tốt nhất đến Cố Cung là gì?"),
            ("门票", "ménpiào", "Môn phiếu", "Vé vào cửa", "门", "景区的门票可以在网上提前购买。", "Jǐngqū de ménpiào kěyǐ zài wǎngshang tíqián gòumǎi.", "Vé vào cổng danh lam có thể mua trước trên mạng."),
            ("导游", "dǎoyóu", "Đạo du", "Hướng dẫn viên du lịch", "寸", "这位导游讲解得生动有趣。", "Zhè wèi dǎoyóu jiǎngjiě de shēngdòng yǒuqù.", "Người hướng dẫn viên này thuyết minh rất sinh động thú vị.")
        ],
        [("租", "zū", "Thuê, mướn", 10, "Phẩy, ngang...", "Bộ Hòa (禾)", "Nộp thóc thuê mướn."),
         ("导", "dǎo", "Dẫn đường, chỉ dẫn", 6, "Ngang gập, sổ...", "Bộ Thốn (寸)", "Dẫn dắt đúng hướng.")],
        ("既……又…… (Vừa... lại vừa...)", "Cấu trúc liên từ đẳng lập song song",
         "Dùng để nối hai tính chất hoặc hành động cùng tồn tại tích cực hoặc tiêu cực.",
         ("坐高铁既快捷又安全。", "Zuò gāotiě jì kuàijié yòu ānquán.", "Đi tàu cao tốc vừa nhanh chóng lại vừa an toàn."),
         ("他既高也帅。", "他既高又帅。", "Cặp từ chuẩn là 既……又……, không dùng 既……也……")),
        ([("A", "请问租一辆五座轿车一天需要多少钱？", "Qǐngwèn zū yí liàng wǔ zuò jiàochē yì tiān xūyào duōshao qián?", "Xin hỏi thuê một chiếc xe 5 chỗ một ngày bao nhiêu tiền?"),
          ("B", "每天两百元，既便宜又省心。", "Měitiān liǎngbǎi yuán, jì piányi yòu shěngxīn.", "Mỗi ngày 200 tệ, vừa rẻ lại vừa an tâm.")],
         "每天两百元，既便宜又省心。", "Giá thuê xe mỗi ngày là bao nhiêu?", ["100 tệ", "200 tệ", "300 tệ", "500 tệ"], 1, "B trả lời rõ: 每天两百元."),
        ("Khen tàu cao tốc:", "坐高铁既方便又舒适。", "Zuò gāotiě jì fāngbiàn yòu shūshì.", "Đi tàu cao tốc vừa tiện lợi vừa dễ chịu.", "Phát âm rõ ràng jì... yòu..."),
        ("Sắp xếp câu: 'Món ăn này vừa ngon vừa rẻ'", ["又便宜", "这道菜", "好吃", "既"], ["这道菜", "既", "好吃", "又便宜"], "Cấu trúc 既...又..."),
        [("Người dẫn đường và giới thiệu thắng cảnh cho du khách gọi là gì?", ["司机 (Tài xế)", "导游 (Hướng dẫn viên)", "经理 (Giám đốc)", "服务员 (Phục vụ)"], 1, "导游 (dǎoyóu) là hướng dẫn viên."),
         ("Điền từ: '这里的风景____优美，环境____安静。'", ["既...又...", "虽然...但...", "不仅...反而...", "因为...所以..."], 0, "Đẳng lập hai đặc tính tốt dùng 既...又...")],
        ("Hỏi đường thuê xe", "Thực hành hỏi thuê xe du lịch và lộ trình tham quan.", "jì fāngbiàn yòu ānquán", "Hướng Dẫn Viên Du Lịch")
    )

    add_l(
        "l-410", "ch-14", "lvl-4", 5, "Xử lý sự cố khi du lịch & Mất đồ", "旅行突发情况与失物招领",
        "Cách ứng phó khi để quên đồ, mất hộ chiếu và báo cơ quan chức năng.",
        "Nắm vững từ vựng khẩn cấp: 丢失, 护照, 报警, 解决 và phó từ 千万……",
        [
            ("丢失", "diūshī", "Đâu thất", "Đánh mất, thất lạc", "大", "我不小心把钱包丢失了。", "Wǒ bù xiǎoxīn bǎ qiánbāo diūshī le.", "Tôi sơ ý đánh mất ví tiền rồi."),
            ("护照", "hùzhào", "Hộ chiếu", "Hộ chiếu", "扌", "出门在外一定要保管好护照。", "Chūmén zàiwài yídìng yào bǎoguǎn hǎo hùzhào.", "Khi đi xa nhất định phải giữ gìn cẩn thận hộ chiếu."),
            ("报警", "bàojǐng", "Báo cảnh", "Báo cảnh sát", "言", "遇到紧急情况请马上报警。", "Yùdào jǐnjí qíngkuàng qǐng mǎshàng bàojǐng.", "Gặp tình huống khẩn cấp xin hãy báo cảnh sát ngay."),
            ("解决", "jiějué", "Giải quyết", "Giải quyết (vấn đề)", "角", "不用担心，这个问题一定能解决。", "Bú yòng dānxīn, zhè gè wèntí yídìng néng jiějué.", "Đừng lo lắng, vấn đề này nhất định giải quyết được.")
        ],
        [("丢", "diū", "Mất, ném", 6, "Phẩy, ngang...", "Bộ Nhất", "Đồ vật vuột mất khỏi tay."),
         ("警", "jǐng", "Cảnh sát, cảnh báo", 19, "Chấm, ngang...", "Bộ Ngôn (言)", "Lời cảnh báo nghiêm túc.")],
        ("千万…… (Tuyệt đối / Nhất thiết phải...)", "Phó từ nhấn mạnh lời răn đe, khuyên nhủ",
         "Thường dùng trong câu phủ định '千万别……' hoặc '千万不要……' để dặn dò tha thiết.",
         ("出门旅行千万不要把贵重物品放在显眼处。", "Chūmén lǚxíng qiānwàn bú yào bǎ guìzhòng wùpǐn fàng zài xiǎnyǎn chù.", "Đi du lịch tuyệt đối đừng để đồ quý giá ở chỗ dễ thấy."),
         ("你千万来。", "你千万要来啊！", "Trong câu khẳng định thường đi cùng 要 và trợ từ ngữ khí 啊.")),
        ([("A", "警察先生，我的护照好像掉在出租车上了！", "Jǐngchá xiānsheng, wǒ de hùzhào hǎoxiàng diào zài chūzūchē shang le!", "Chú cảnh sát ơi, hộ chiếu của cháu hình như rơi trên taxi rồi!"),
          ("B", "别慌，记得出租车的车牌号吗？我们帮你查。", "Bié huāng, jìde chūzūchē de chēpái hào ma? Wǒmen bāng nǐ chá.", "Đừng hoảng, có nhớ biển số xe taxi không? Chúng tôi giúp bạn tra cứu.")],
         "别慌，记得出租车的车牌号吗？我们帮你查。", "Cảnh sát yêu cầu người gặp nạn cung cấp thông tin gì?", ["Số điện thoại tài xế", "Biển số xe taxi", "Màu sắc xe", "Địa chỉ khách sạn"], 1, "Cảnh sát hỏi: 记得出租车的车牌号吗？"),
        ("Khuyên nhủ đi xa:", "出门在外，千万要注意安全。", "Chūmén zàiwài, qiānwàn yào zhùyì ānquán.", "Đi ra ngoài, nhất định phải chú ý an toàn.", "Nhấn mạnh từ qiānwàn."),
        ("Sắp xếp câu: 'Bạn tuyệt đối đừng quên mang hộ chiếu nhé'", ["千万别", "带护照", "忘了", "你"], ["你", "千万别", "忘了", "带护照"], "Cấu trúc 千万别 + V."),
        [("Khi bị mất đồ quý giá ở nước ngoài, nơi cần tìm kiếm sự giúp đỡ đầu tiên là gì?", ["警察局 (Đồn cảnh sát)", "电影院 (Rạp phim)", "理发店 (Tiệm cắt tóc)", "超市 (Siêu thị)"], 0, "警察局 là nơi hỗ trợ báo án."),
         ("Điền từ: '这件事情很重要，你____要准时参加。'", ["千万", "难道", "究竟", "忽然"], 0, "Dặn dò nhấn mạnh dùng 千万.")],
        ("Xử lý tình huống", "Mô phỏng trình báo rơi hộ chiếu tại đồn cảnh sát.", "qiānwàn zhùyì ānquán", "Chuyên Gia Ứng Biến")
    )

    # =========================================================================
    # CHAPTER 15: Điện thoại & Đặt lịch công việc (l-411 to l-415)
    # =========================================================================
    add_l(
        "l-411", "ch-15", "lvl-4", 1, "Quy chuẩn nghe gọi điện thoại công sở", "职场商务通话规范",
        "Mẫu câu chào hỏi, xưng danh, chuyển máy và để lại lời nhắn qua điện thoại.",
        "Sử dụng thành thạo từ ngữ công sở: 转接, 稍等, 留言, 找哪位 và cấu trúc 请问……",
        [
            ("转接", "zhuǎnjiē", "Chuyển tiếp", "Chuyển máy (điện thoại)", "车", "请帮我转接一下李经理。", "Qǐng bāng wǒ zhuǎnjiē yíxià Lǐ jīnglǐ.", "Xin giúp tôi chuyển máy tới Giám đốc Lý."),
            ("稍等", "shāoděng", "Sảo đẳng", "Đợi một chút", "禾", "好的，请您稍等，我为您转接。", "Hǎo de, qǐng nín shāoděng, wǒ wèi nín zhuǎnjiē.", "Vâng, xin đợi một chút, tôi chuyển máy cho quý khách."),
            ("留言", "liúyán", "Lưu ngôn", "Để lại lời nhắn", "田", "他现在不在，需要给他留言吗？", "Tā xiànzài búzài, xūyào gěi tā liúyán ma?", "Hiện tại anh ấy không có ở đây, có cần để lại lời nhắn không?"),
            ("打扰", "dǎrǎo", "Đả nhiễu", "Làm phiền", "扌", "不好意思，打扰您休息了。", "Bù hǎoyìsi, dǎrǎo nín xiūxi le.", "Thật ngại quá, làm phiền quý khách nghỉ ngơi rồi.")
        ],
        [("稍", "shāo", "Hơi, một chút", 12, "Phẩy, ngang...", "Bộ Hòa (禾)", "Thời gian ngắn ngủi."),
         ("留", "liú", "Ở lại, giữ lại", 10, "Chấm, ngang...", "Bộ Điền (田)", "Lưu lại dấu vết trên đồng ruộng.")],
        ("请问…… (Xin hỏi / Cho hỏi...)", "Mẫu câu mở đầu lịch sự trong đàm thoại",
         "Dùng ở đầu câu để thể hiện sự lễ phép khi muốn dò hỏi thông tin qua điện thoại.",
         ("请问张总在办公室吗？", "Qǐngwèn Zhāng zǒng zài bàngōngshì ma?", "Xin hỏi Tổng giám đốc Trương có ở văn phòng không?"),
         ("问你张总在吗？", "请问张总在吗？", "Phải thêm 请问 để bảo đảm văn phong công sở.")),
        ([("A", "您好，这里是汉字高科技有限公司，请问您找哪位？", "Nín hǎo, zhèlǐ shì Hànzìgāo kējì yǒuxiàn gōngsī, qǐngwèn nín zhǎo nǎ wèi?", "Xin chào, đây là Công ty Công nghệ HanziGo, xin hỏi quý khách tìm ai?"),
          ("B", "您好，请帮我转接市场部王经理。", "Nín hǎo, qǐng bāng wǒ zhuǎnjiē shìchǎngbù Wáng jīnglǐ.", "Xin chào, xin giúp tôi chuyển máy tới Giám đốc Vương phòng Marketing.")],
         "您好，请帮我转接市场部王经理。", "Người gọi điện muốn liên hệ với ai?", ["Giám đốc Trương phòng Kế toán", "Giám đốc Vương phòng Marketing", "Tổng giám đốc", "Nhân viên bảo vệ"], 1, "Khách yêu cầu: 转接市场部王经理."),
        ("Nhận cuộc gọi lịch sự:", "您好，请稍等，马上为您转接。", "Nín hǎo, qǐng shāoděng, mǎshàng wèi nín zhuǎnjiē.", "Xin chào, xin đợi một chút, tôi chuyển máy ngay.", "Giọng điệu nhã nhặn, chuyên nghiệp."),
        ("Sắp xếp câu: 'Xin hỏi Giám đốc Lý có ở văn phòng không'", ["李经理", "请问", "在办公室吗"], ["请问", "李经理", "在办公室吗"], "请问 đứng đầu câu hỏi."),
        [("Khi người nghe điện thoại bận hoặc vắng mặt, người nhận máy thường hỏi câu gì?", ["需要留言吗？", "你找错人了！", "我不知道。", "别打了！"], 0, "Cung cấp dịch vụ: 需要留言吗？ (Có cần để lại lời nhắn không?)."),
         ("Từ nào đồng nghĩa với 'xin đợi một lát'?", ["稍等", "赶快", "马上走", "别等"], 0, "稍等 nghĩa là đợi một lát.")],
        ("Giao tiếp điện thoại", "Thực hành nghe và chuyển máy điện thoại văn phòng chuẩn mực.", "qǐng nín shāoděng", "Lễ Tân Chuyên Nghiệp")
    )

    add_l(
        "l-412", "ch-15", "lvl-4", 2, "Đặt lịch hẹn họp đối tác & Đổi lịch", "预约商务会议与改期",
        "Cách đặt lịch hẹn gặp đối tác, thống nhất thời gian và thông báo dời lịch.",
        "Sử dụng từ vựng hội nghị: 预约, 会议, 改期, 准时 và phó từ 提前……",
        [
            ("预约", "yùyuē", "Dự ước", "Hẹn trước, đặt lịch", "言", "我已经提前预约了明天的会面。", "Wǒ yǐjīng tíqián yùyuē le míngtiān de huìmiàn.", "Tôi đã hẹn trước cuộc gặp ngày mai."),
            ("会议", "huìyì", "Hội nghị", "Cuộc họp, hội nghị", "人", "下午两点有一个部门会议。", "Xiàwǔ liǎng diǎn yǒu yí gè bùmén huìyì.", "2 giờ chiều có một cuộc họp phòng ban."),
            ("改期", "gǎiqī", "Cải kỳ", "Đổi ngày hẹn, dời lịch", "攵", "因为临时有事，会议不得不改期。", "Yīnwèi línshí yǒushì, huìyì bùdébù gǎiqī.", "Vì có việc đột xuất, cuộc họp buộc phải dời lịch."),
            ("准时", "zhǔnshí", "Chuẩn thời", "Đúng giờ", "冫", "请大家准时出席会议。", "Qǐng dàjiā zhǔnshí chūxí huìyì.", "Xin mọi người tham dự cuộc họp đúng giờ.")
        ],
        [("改", "gǎi", "Sửa đổi, dời", 7, "Ngang gập, phẩy...", "Bộ Phộc (攵)", "Chỉnh sửa cho hoàn thiện."),
         ("准", "zhǔn", "Chuẩn xác, cho phép", 10, "Chấm, hất...", "Bộ Băng (冫)", "Độ đo chính xác như mực nước đóng băng.")],
        ("提前…… (Làm trước / Sớm hơn dự định)", "Phó từ chỉ hành động diễn ra trước mốc thời gian",
         "Đặt '提前 + Động từ' để biểu thị việc hoàn thành hoặc thông báo trước hạn.",
         ("如果有变化，请提前通知我们。", "Rúguǒ yǒu biànhuà, qǐng tíqián tōngzhī wǒmen.", "Nếu có thay đổi, xin vui lòng thông báo trước cho chúng tôi."),
         ("请通知提前我。", "请提前通知我。", "提前 đứng TRƯỚC động từ.")),
        ([("A", "陈总，原定明天上午的商务会议，对方希望能改期到周五。", "Chén zǒng, yuándìng míngtiān shàngwǔ de shāngwù huìyì, duìfāng xīwàng néng gǎiqī dào zhōuwǔ.", "Tổng giám đốc Trần, cuộc họp kinh doanh dự kiến sáng mai đối tác mong muốn dời sang thứ Sáu."),
          ("B", "没问题，只要他们周五能准时出席就行。", "Méi wèntí, zhǐyào tāmen zhōuwǔ néng zhǔnshí chūxí jiù xíng.", "Không vấn đề, chỉ cần thứ Sáu họ tham dự đúng giờ là được.")],
         "没问题，只要他们周五能准时出席就行。", "Cuộc họp được dời sang ngày nào?", ["Thứ Tư", "Thứ Năm", "Thứ Sáu", "Tuần sau"], 2, "Đối tác xin: 改期到周五."),
        ("Yêu cầu thông báo trước:", "如有变动，请提前一天告知。", "Rú yǒu biàndòng, qǐng tíqián yì tiān gàozhī.", "Nếu có thay đổi, xin thông báo trước 1 ngày.", "Giọng điệu trang trọng."),
        ("Sắp xếp câu: 'Xin vui lòng đến tham gia cuộc họp đúng giờ'", ["准时", "出席会议", "请大家"], ["请大家", "准时", "出席会议"], "Trạng từ 准时 đứng trước động từ 出席."),
        [("Khi muốn dời cuộc họp sang ngày khác, ta dùng từ nào?", ["开会", "改期", "取消", "迟到"], 1, "改期 nghĩa là đổi ngày hẹn."),
         ("Điền từ: '去机场前最好____两小时出发，以免堵车。'", ["提前", "落后", "推迟", "准时"], 0, "Xuất phát sớm hơn dùng 提前.")],
        ("Lên lịch họp đối tác", "Thực hành soạn email hoặc gọi điện dời lịch hẹn gặp đối tác.", "tíqián yùyuē huìyì", "Thư Ký Mẫn Cán")
    )

    add_l(
        "l-413", "ch-15", "lvl-4", 3, "Soạn thảo email công việc & Tệp đính kèm", "发送商务邮件与确认信",
        "Cấu trúc thư tín thương mại, cách gửi kèm tệp và yêu cầu phản hồi.",
        "Nắm vững từ vựng văn phòng: 发送, 邮件, 附件, 确认 và phó từ 及时……",
        [
            ("发送", "fāsòng", "Phát tống", "Gửi đi (email, tin nhắn)", "又", "我已经把合同方案发送到您的邮箱了。", "Wǒ yǐjīng bǎ hétong fāng'àn fāsòng dào nín de yóuxiāng le.", "Tôi đã gửi phương án hợp đồng vào hòm thư của ngài."),
            ("邮件", "yóujiàn", "Bưu kiện", "Thư từ, bưu kiện, email", "亻", "每天上班第一件事就是查看工作邮件。", "Měitiān shàngbān dì-yī jiàn shì jiù shì chákàn gōngzuò yóujiàn.", "Mỗi ngày đi làm việc đầu tiên là kiểm tra email công việc."),
            ("附件", "fùjiàn", "Phụ kiện", "Tệp đính kèm", "阝", "详细报价单请查看邮件附件。", "Xiángxì bàojiàdān qǐng chákàn yóujiàn fùjiàn.", "Bảng báo giá chi tiết xin vui lòng xem tệp đính kèm."),
            ("确认", "quèrèn", "Xác nhận", "Xác nhận, khẳng định", "石", "收到邮件后请回复确认。", "Shōudào yóujiàn hòu qǐng huífù quèrèn.", "Sau khi nhận thư xin vui lòng phản hồi xác nhận.")
        ],
        [("附", "fù", "Kèm theo, phụ thêm", 7, "Ngang gập cong móc...", "Bộ Phụ (阝)", "Nương tựa, đính kèm bên cạnh."),
         ("确", "què", "Chắc chắn, xác thực", 12, "Ngang, phẩy...", "Bộ Thạch (石)", "Rắn chắc như hòn đá.")],
        ("请及时…… (Xin hãy kịp thời...)", "Phó từ biểu thị sự khẩn trương, không trì hoãn",
         "Dùng trong thư từ công việc để nhắc nhở đối tác xử lý công việc đúng tiến độ.",
         ("收到后请及时查收并确认。", "Shōudào hòu qǐng jíshí chāshōu bìng quèrèn.", "Sau khi nhận xin hãy kịp thời kiểm tra và xác nhận."),
         ("请查收及时。", "请及时查收。", "及时 đứng trước động từ 查收.")),
        ([("A", "李助理，给合作方的邮件发出去了吗？", "Lǐ zhùlǐ, gěi hézuòfāng de yóujiàn fā chūqù le ma?", "Trợ lý Lý, email gửi cho bên đối tác đã phát đi chưa?"),
          ("B", "已经发了，我还随信附上了最新版本的合同方案。", "Yǐjīng fā le, wǒ hái suí xìn fùshang le zuìxīn bǎnběn de hétong fāng'àn.", "Đã gửi rồi ạ, tôi còn đính kèm phương án hợp đồng bản mới nhất.")],
         "已经发了，我还随信附上了最新版本的合同方案。", "Trợ lý Lý đã đính kèm tài liệu gì trong thư?", ["Hồ sơ xin việc", "Bảng báo giá cũ", "Phương án hợp đồng bản mới nhất", "Ảnh phong cảnh"], 2, "Trợ lý trả lời: 附上了最新版本的合同方案."),
        ("Nhắc phản hồi thư tín:", "查收后请及时回复邮件确认。", "Chāshōu hòu qǐng jíshí huífù yóujiàn quèrèn.", "Sau khi kiểm tra xin phản hồi email xác nhận kịp thời.", "Văn phong công sở chỉn chu."),
        ("Sắp xếp câu: 'Xin vui lòng xem bảng báo giá trong tệp đính kèm'", ["请查看", "报价单", "附件中的"], ["请查看", "附件中的", "报价单"], "Định ngữ đứng trước trung tâm ngữ."),
        [("Tài liệu gửi kèm theo email trong tiếng Trung gọi là gì?", ["软件 (Phần mềm)", "附件 (Tệp đính kèm)", "硬件 (Phần cứng)", "条件 (Điều kiện)"], 1, "附件 (fùjiàn) là tệp đính kèm."),
         ("Điền từ: '发现问题要____解决，不能拖延。'", ["及时", "随时", "平时", "按时"], 0, "Kịp thời xử lý không chậm trễ dùng 及时.")],
        ("Viết email công sở", "Soạn thảo email ngắn gửi báo giá kèm file đính kèm cho khách hàng.", "chákàn yóujiàn fùjiàn", "Chuyên Gia Thư Tín")
    )

    add_l(
        "l-414", "ch-15", "lvl-4", 4, "Xin phép nghỉ việc & Giải thích lý do đến muộn", "请假申请与迟到说明",
        "Cách xin nghỉ phép, giải thích lý do kẹt xe hoặc ốm đau một cách thuyết phục.",
        "Nắm vững từ vựng xin phép: 抱歉, 迟到, 堵车, 请假 và liên từ 由于……",
        [
            ("抱歉", "bàoqiàn", "Bão khiểm", "Thành thật xin lỗi, áy náy", "扌", "实在抱歉，今天路上严重堵车。", "Shízài bàoqiàn, jīntiān lùshang yánzhòng dǔchē.", "Thật vô cùng xin lỗi, hôm nay trên đường tắc xe nghiêm trọng."),
            ("迟到", "chídào", "Trì đáo", "Đến muộn, trễ giờ", "辶", "他上班从来不迟到。", "Tā shàngbān cónglái bù chídào.", "Anh ấy đi làm chưa bao giờ đến muộn."),
            ("堵车", "dǔchē", "Đổ xa", "Tắc đường, kẹt xe", "土", "早高峰堵车非常厉害。", "Zǎogāofēng dǔchē fēicháng lìhai.", "Giờ cao điểm buổi sáng tắc đường rất dữ dội."),
            ("请假", "qǐngjià", "Thỉnh giả", "Xin nghỉ phép", "言", "我身体不舒服，想请一天病假。", "Wǒ shēntǐ bù shūfu, xiǎng qǐng yì tiān bìngjià.", "Người tôi không khỏe, muốn xin nghỉ ốm 1 ngày.")
        ],
        [("堵", "dǔ", "Tắc nghẽn, ngăn chặn", 12, "Ngang, sổ...", "Bộ Thổ (土)", "Bức tường đất chắn lối."),
         ("歉", "qiàn", "Thiếu sót, áy náy", 14, "Chấm, phẩy...", "Bộ Khiếm (欠)", "Cảm giác chưa trọn vẹn sinh áy náy.")],
        ("由于……因此/所以…… (Do... cho nên...)", "Cấu trúc liên từ giải thích nguyên nhân trang trọng",
         "Thường dùng trong văn viết và phát biểu công sở trang trọng hơn 因为...所以...",
         ("由于突发暴雨，因此航班延误了两个小时。", "Yóuyú tūfā bàoyǔ, yīncǐ hángbān yánwù le liǎng gè xiǎoshí.", "Do cơn mưa bão bất ngờ, cho nên chuyến bay bị hoãn 2 tiếng."),
         ("由于原因，所以迟到。", "由于路上堵车，所以我迟到了。", "Sau 由于 phải nêu rõ nguyên nhân cụ thể.")),
        ([("A", "王经理，实在抱歉，因为地铁故障，我可能要迟到二十分钟。", "Wáng jīnglǐ, shízài bàoqiàn, yīnwèi dìtiě gùzhàng, wǒ kěnéng yào chídào èrshí fēnzhōng.", "Giám đốc Vương, thật vô cùng xin lỗi, vì sự cố tàu điện ngầm, em có thể đến muộn 20 phút."),
          ("B", "没关系，安全第一，路上注意安全。", "Méi guānxi, ānquán dì-yī, lùshang zhùyì ānquán.", "Không sao, an toàn là trên hết, đi trên đường chú ý an toàn nhé.")],
         "没关系，安全第一，路上注意安全。", "Nhân viên xin phép vì lý do gì?", ["Ngủ quên", "Tàu điện ngầm gặp sự cố kỹ thuật", "Đi nhầm đường", "Xe hỏng lốp"], 1, "Lý do: 地铁故障 (tàu điện ngầm gặp sự cố)."),
        ("Giải thích lý do đến muộn:", "实在抱歉，今天路上严重堵车。", "Shízài bàoqiàn, jīntiān lùshang yánzhòng dǔchē.", "Thật sự áy náy, hôm nay trên đường tắc xe quá nặng.", "Giọng điệu chân thành."),
        ("Sắp xếp câu: 'Do trời mưa lớn cho nên giao thông bị tắc nghẽn'", ["由于", "交通十分拥堵", "下大雨", "因此"], ["由于", "下大雨", "因此", "交通十分拥堵"], "Cấu trúc 由于...因此..."),
        [("Khi bị ốm cần xin nghỉ làm việc, bạn làm đơn xin nghỉ gì?", ["事假 (Nghỉ việc riêng)", "病假 (Nghỉ ốm)", "年假 (Nghỉ phép năm)", "产假 (Nghỉ thai sản)"], 1, "Nghỉ do ốm đau là 病假."),
         ("Điền từ: '____突发紧急情况，会议不得不推迟。'", ["由于", "既然", "不仅", "即使"], 0, "Nêu nguyên nhân trang trọng dùng 由于.")],
        ("Ứng xử văn phòng", "Soạn tin nhắn xin phép sếp đến muộn do kẹt xe hoặc xin nghỉ ốm.", "qǐng yì tiān bìngjià", "Giao Tiếp Thấu Tình")
    )

    add_l(
        "l-415", "ch-15", "lvl-4", 5, "Tổng kết kỹ năng giao tiếp văn phòng HSK 4", "第十五章复习与职场实务综合",
        "Tổng hợp kỹ năng nghe gọi điện thoại, hẹn đối tác, gửi email và báo cáo công việc.",
        "Làm chủ toàn bộ phản xạ văn phòng chuyên nghiệp và từ vựng phối hợp công tác.",
        [
            ("沟通", "gōutōng", "Câu thông", "Giao tiếp, trao đổi", "氵", "良好的沟通是合作成功的关键。", "Liánghǎo de gōutōng shì hézuò chénggōng de guānjiàn.", "Giao tiếp tốt là chìa khóa của hợp tác thành công."),
            ("配合", "pèihé", "Phối hợp", "Phối hợp, cộng tác", "酉", "谢谢各位同事的全力配合。", "Xièxie gèwèi tóngshì de quánlì pèihé.", "Cảm ơn sự phối hợp hết mình của các đồng nghiệp."),
            ("顺利", "shùnlì", "Thuận lợi", "Thuận lợi, trôi chảy", "页", "今天的商务谈判进行得非常顺利。", "Jīntiān de shāngwù tánpàn jìnxíng de fēicháng shùnlì.", "Cuộc đàm phán thương mại hôm nay diễn ra rất thuận lợi."),
            ("汇报", "huìbào", "Hối báo", "Báo cáo công việc (lên cấp trên)", "扌", "下午我要向总经理汇报项目进展。", "Xiàwǔ wǒ yào xiàng zǒngjīnglǐ huìbào xiàngmù jìnzhǎn.", "Chiều nay tôi phải báo cáo tiến độ dự án với Tổng giám đốc.")
        ],
        [("沟", "gōu", "Con mương, kết nối", 11, "Chấm, chấm...", "Bộ Thủy (氵)", "Dòng nước khơi thông."),
         ("配", "pèi", "Ghép đôi, phối hợp", 10, "Ngang, sổ...", "Bộ Dậu (酉)", "Rượu nồng pha trộn hài hòa.")],
        ("向……汇报 (Báo cáo với...)", "Cấu trúc giới từ chỉ đối tượng tiếp nhận báo cáo",
         "Dùng 'Chủ ngữ + 向 + Cấp trên + 汇报 + Nội dung' theo đúng tôn ty trật tự công sở.",
         ("请向董事长汇报这次考察的结果。", "Qǐng xiàng dǒngshìzhǎng huìbào zhè cì kǎochá de jiéguǒ.", "Xin hãy báo cáo kết quả chuyến khảo sát lần này với Chủ tịch."),
         ("汇报向经理。", "向经理汇报。", "Cụm giới từ phải đặt trước động từ 汇报.")),
        ([("A", "今天的项目总结会议进行得怎么样？", "Jīntiān de xiàngmù zǒngjié huìyì jìnxíng de zěnmeyàng?", "Cuộc họp tổng kết dự án hôm nay diễn ra thế nào?"),
          ("B", "大家沟通得很充分，项目进展也非常顺利。", "Dàjiā gōutōng de hěn chōngfèn, xiàngmù jìnzhǎn yě fēicháng shùnlì.", "Mọi người trao đổi rất đầy đủ, tiến độ dự án cũng vô cùng thuận lợi.")],
         "大家沟通得很充分，项目进展也非常顺利。", "Cuộc họp dự án hôm nay kết quả thế nào?", ["Tranh cãi gay gắt", "Diễn ra rất thuận lợi và giao tiếp đầy đủ", "Bị hoãn vô thời hạn", "Không ai phát biểu"], 1, "Kết quả: 沟通得很充分，进展非常顺利."),
        ("Báo cáo công việc:", "项目进展非常顺利，谢谢大家配合。", "Xiàngmù jìnzhǎn fēicháng shùnlì, xièxie dàjiā pèihé.", "Tiến độ dự án rất thuận lợi, cảm ơn mọi người đã phối hợp.", "Phong thái đĩnh đạc."),
        ("Sắp xếp câu: 'Tôi muốn báo cáo tiến độ với giám đốc'", ["向经理", "汇报进展", "我想"], ["我想", "向经理", "汇报进展"], "Cấu trúc 向...汇报..."),
        [("Từ nào chỉ hành động trình bày công việc lên lãnh đạo cấp trên?", ["汇报 (Báo cáo)", "通知 (Thông báo)", "打扰 (Làm phiền)", "批评 (Phê bình)"], 0, "汇报 dùng khi báo cáo lên cấp trên."),
         ("Điền từ: '团队成员之间需要多____，才能减少误会。'", ["沟通", "堵车", "改期", "请假"], 0, "Giảm hiểu lầm cần tăng cường 沟通 (giao tiếp).")],
        ("Tổng kết Chương 15", "Viết bản báo cáo công việc ngắn 60 chữ gửi sếp tổng kết tuần làm việc.", "xiàng zǒngjīnglǐ huìbào", "Ngôi Sao Công Sở")
    )

    # =========================================================================
    # CHAPTER 16: Thương mại số Taobao & WeChat Pay (l-416 to l-420)
    # =========================================================================
    add_l(
        "l-416", "ch-16", "lvl-4", 1, "Mua sắm online & Chat với chủ shop 客服", "网购挑选与联系客服",
        "Cách mua hàng Taobao, áp mã giảm giá, hỏi kích cỡ và chat với chăm sóc khách hàng.",
        "Làm chủ từ vựng thương mại điện tử: 下单, 优惠券, 包邮, 客服 và phó từ 究竟……",
        [
            ("下单", "xiàdān", "Hạ đơn", "Đặt hàng, tạo đơn hàng", "一", "我刚在网上拍下了这款商品，已经下单了。", "Wǒ gāng zài wǎngshang pāixià le zhè kuǎn shāngpǐn, yǐjīng xiàdān le.", "Tôi vừa mua món hàng này trên mạng, đã đặt đơn rồi."),
            ("优惠券", "yōuhuìquàn", "Ưu huệ khoán", "Phiếu giảm giá, voucher", "亻", "别忘了领取店铺的优惠券再付款。", "Bié wàng le lǐngqǔ diànpù de yōuhuìquàn zài fùkuǎn.", "Đừng quên nhận phiếu giảm giá của shop rồi hãy thanh toán."),
            ("包邮", "bāoyóu", "Bao bưu", "Miễn phí vận chuyển (Freeship)", "勹", "满九十九元全场包邮。", "Mǎn jiǔshíjiǔ yuán quánchǎng bāoyóu.", "Đơn đủ 99 tệ miễn phí vận chuyển toàn bộ."),
            ("客服", "kèfú", "Khách phục", "Nhân viên chăm sóc khách hàng", "口", "如果有疑问，可以直接咨询在线客服。", "Rúguǒ yǒu yíwèn, kěyǐ zhíjiē zīxún zàixiàn kèfú.", "Nếu có thắc mắc, có thể hỏi trực tiếp CSKH online.")
        ],
        [("券", "quàn", "Phiếu, khoán", 8, "Ngang, phẩy...", "Bộ Đao (刀)", "Vé phiếu chứng nhận có đường cắt."),
         ("邮", "yóu", "Bưu phẩm, chuyển phát", 7, "Ngang, sổ...", "Bộ Phụ (阝)", "Trạm bưu chính lưu chuyển.")],
        ("究竟…… (Rốt cuộc... / Suy cho cùng...)", "Phó từ biểu thị sự truy cứu, nhấn mạnh ngữ khí nghi vấn",
         "Thường dùng trong câu hỏi để nhấn mạnh mong muốn biết được sự thật cuối cùng.",
         ("这件衣服究竟有没有现货？", "Zhè jiàn yīfu jiūjìng yǒuméiyǒu xiànhuò?", "Chiếc áo này rốt cuộc có sẵn hàng hay không?"),
         ("究竟你买不买？", "你究竟买不买？", "究竟 thường đặt sau chủ ngữ hoặc đầu câu hỏi.")),
        ([("A", "亲，请问这款鞋子包邮吗？今天下单什么时候能发货？", "Qīn, qǐngwèn zhè kuǎn xiézi bāoyóu ma? Jīntiān xiàdān shénme shíhou néng fāhuò?", "Bạn ơi, mẫu giày này có freeship không? Hôm nay đặt đơn khi nào phát hàng?"),
          ("B", "亲，全店包邮哦！今天下午四点前下单当天发货。", "Qīn, quán diàn bāoyóu o! Jīntiān xiàwǔ sì diǎn qián xiàdān dāngtiān fāhuò.", "Bạn ơi, toàn shop freeship ạ! Đặt trước 4h chiều hôm nay phát hàng trong ngày luôn.")],
         "亲，全店包邮哦！今天下午四点前下单当天发货。", "Đơn hàng đặt trước mấy giờ sẽ được gửi đi trong ngày?", ["12 giờ trưa", "4 giờ chiều", "8 giờ tối", "Không rõ"], 1, "Chủ shop trả lời: 下午四点前下单当天发货."),
        ("Hỏi chăm sóc khách hàng:", "亲，请问这件衣服包邮吗？", "Qīn, qǐngwèn zhè jiàn yīfu bāoyóu ma?", "Shop ơi, chiếc áo này có miễn phí vận chuyển không?", "Dùng từ xưng hô '亲' thân thiện của Taobao."),
        ("Sắp xếp câu: 'Rốt cuộc bạn thích chiếc nào'", ["究竟", "你", "哪一件", "喜欢"], ["你", "究竟", "喜欢", "哪一件"], "Cấu trúc Chủ ngữ + 究竟 + V..."),
        [("Từ thân mật mà người bán hàng online ở Trung Quốc hay gọi khách hàng là gì?", ["亲 (Thân ái / Bạn ơi)", "老头", "朋友", "先生"], 0, "Trên Taobao, chủ shop luôn gọi khách là '亲' (qīn)."),
         ("Điền từ: '满一百元即可使用二十元____。'", ["优惠券", "发票", "护照", "房卡"], 0, "Phiếu giảm giá là 优惠券.")],
        ("Mua sắm Taobao", "Thực hành chat với chủ shop hỏi màu sắc, kích cỡ và xin mã freeship.", "quán diàn bāoyóu", "Tín Đồ Mua Sắm")
    )

    add_l(
        "l-417", "ch-16", "lvl-4", 2, "Theo dõi vận chuyển & Nhận bưu phẩm", "物流跟踪与包裹签收",
        "Tra cứu mã vận đơn, kiểm tra lộ trình giao hàng và nhận hàng tại tủ thông minh.",
        "Nắm vững từ vựng chuyển phát: 物流, 快递, 单号, 派送 và phó từ 差不多……",
        [
            ("物流", "wùliú", "Vật lưu", "Ngành logistics, vận chuyển hàng hóa", "牛", "现在的电商物流速度越来越快了。", "Xiànzài de diànshāng wùliú sùdù yuèláiyuè kuài le.", "Tốc độ vận chuyển thương mại điện tử hiện nay ngày càng nhanh."),
            ("快递", "kuàidì", "Khoái đệ", "Chuyển phát nhanh, bưu phẩm chuyển phát", "辶", "楼下有你的一个顺丰快递。", "Lóuxià yǒu nǐ de yí gè Shùnfēng kuàidì.", "Dưới tầng có một kiện hàng chuyển phát Thuận Phong của bạn."),
            ("单号", "dānhào", "Đơn hào", "Mã vận đơn", "十", "输入快递单号就可以查询位置。", "Shūrù kuàidì dānhào jiù kěyǐ cháxún wèizhi.", "Nhập mã vận đơn là có thể tra cứu vị trí."),
            ("签收", "qiānshōu", "Thiêm thu", "Ký nhận (bưu kiện)", "竹", "包裹已经由小区蜂巢柜代签收了。", "Bāoguǒ yǐjīng yóu xiǎoqū fēngcháoguì dài qiānshōu le.", "Bưu kiện đã được tủ đồ thông minh ký nhận hộ rồi.")
        ],
        [("递", "dì", "Chuyển giao, đưa", 10, "Chấm, phẩy...", "Bộ Sước (辶)", "Chạy bộ chuyển thư."),
         ("签", "qiān", "Ký tên, thẻ tre", 13, "Phẩy, ngang...", "Bộ Trúc (竹)", "Viết ký hiệu lên thẻ tre.")],
        ("差不多…… (Gần như / Xấp xỉ...)", "Phó từ biểu thị mức độ xấp xỉ, sai số rất nhỏ",
         "Dùng để ước lượng thời gian, số lượng hoặc trạng thái gần như hoàn tất.",
         ("包裹差不多今天下午就能送到。", "Bāoguǒ chàbuduō jīntiān xiàwǔ jiù néng sòngdào.", "Bưu kiện xấp xỉ chiều nay là có thể giao tới."),
         ("他差不多高我。", "他和我差不多高。", "Khi so sánh tương đương dùng A và B 差不多 + Tính từ.")),
        ([("A", "师傅您好，我的快递显示派送中，大概什么时候到？", "Shīfu nín hǎo, wǒ de kuàidì xiǎnshì pàisòng zhōng, dàgài shénme shíhou dào?", "Chào bác shipper, hàng của cháu hiển thị đang giao, tầm khi nào tới ạ?"),
          ("B", "差不多半小时后到你家楼下，请准备签收。", "Chàbuduō bàn xiǎoshí hòu dào nǐ jiā lóuxià, qǐng zhǔnbèi qiānshōu.", "Tầm nửa tiếng nữa tới dưới nhà bạn, xin chuẩn bị ký nhận nhé.")],
         "差不多半小时后到你家楼下，请准备签收。", "Shipper dự kiến bao lâu nữa sẽ giao hàng đến?", ["10 phút", "Nửa tiếng nữa (30 phút)", "Chiều mai", "Đã giao xong"], 1, "Shipper hẹn: 差不多半小时后."),
        ("Kiểm tra vận chuyển:", "输入快递单号，随时查看物流进度。", "Shūrù kuàidì dānhào, suíshí chákàn wùliú jìndù.", "Nhập mã vận đơn, kiểm tra tiến độ giao hàng bất cứ lúc nào.", "Phát âm chuẩn dānhào."),
        ("Sắp xếp câu: 'Bưu phẩm này xấp xỉ ngày mai tới'", ["差不多", "这个包裹", "能送到", "明天"], ["这个包裹", "差不多", "明天", "能送到"], "Cấu trúc 差不多 đặt trước mốc thời gian ước lượng."),
        [("Khi bưu kiện được giao đến nơi an toàn, hành động ký nhận gọi là gì?", ["退货", "签收", "催单", "投诉"], 1, "Ký nhận hàng là 签收 (qiānshōu)."),
         ("Điền từ: '我和他的中文水平____，都能过HSK 4级。'", ["差不多", "甚至", "究竟", "千万"], 0, "Tương đương nhau dùng 差不多.")],
        ("Theo dõi bưu kiện", "Luyện nói câu tra cứu vận đơn và đối đáp khi shipper gọi điện giao hàng.", "qiānshōu kuàidì bāoguǒ", "Chuyên Gia Logistics")
    )

    add_l(
        "l-418", "ch-16", "lvl-4", 3, "Thanh toán di động WeChat Pay & Alipay", "移动支付微信与支付宝",
        "Cách quét mã QR thanh toán tiền mặt, chuyển khoản và gửi bao lì xì điện tử.",
        "Nắm vững từ vựng thanh toán số: 扫码, 转账, 余额, 零钱 và phó từ 随时……",
        [
            ("扫码", "sǎomǎ", "Tảo mã", "Quét mã QR", "扌", "买单时支持微信和支付宝扫码。", "Mǎidān shí zhīchí wēixìn hé zhīfùbǎo sǎomǎ.", "Khi thanh toán hỗ trợ quét mã WeChat và Alipay."),
            ("转账", "zhuǎnzhàng", "Chuyển trướng", "Chuyển khoản (ngân hàng/ví điện tử)", "车", "我把饭钱通过微信转账给你了。", "Wǒ bǎ fànqián tōngguò wēixìn zhuǎnzhàng gěi nǐ le.", "Tôi đã chuyển khoản tiền cơm cho bạn qua WeChat rồi."),
            ("余额", "yú'é", "Dư ngạch", "Số dư tài khoản", "亻", "我的微信零钱余额还剩下五十块。", "Wǒ de wēixìn língqián yú'é hái shèngxià wǔshí kuài.", "Số dư ví WeChat của tôi còn lại 50 tệ."),
            ("方便", "fāngbiàn", "Phương tiện", "Tiện lợi, thuận tiện", "方", "在中国出门不带钱包也非常方便。", "Zài Zhōngguó chūmén bú dài qiánbāo yě fēicháng fāngbiàn.", "Ở Trung Quốc ra ngoài không mang ví tiền cũng rất tiện lợi.")
        ],
        [("额", "é", "Hạn ngạch, số tiền", 15, "Chấm, phẩy...", "Bộ Hiệt (页)", "Định mức tính toán trên sổ sách."),
         ("账", "zhàng", "Tài khoản, sổ nợ", 8, "Sổ, ngang gập...", "Bộ Bối (贝)", "Tiền tệ ghi chép trên thẻ tre.")],
        ("随时…… (Bất cứ lúc nào / Tùy ý)", "Phó từ chỉ sự sẵn sàng trong mọi thời điểm",
         "Đặt trước động từ để biểu thị hành động có thể thực hiện bất kể thời điểm nào mà không bị ràng buộc.",
         ("移动支付让大家可以随时随地完成付款。", "Yídòng zhīfù ràng dàjiā kěyǐ suíshí-suídì wánchéng fùkuǎn.", "Thanh toán di động giúp mọi người có thể thanh toán mọi lúc mọi nơi."),
         ("随时你来都可以。", "你随时来都可以。", "Chủ ngữ thường đứng trước 随时.")),
        ([("A", "老板，结账！请问支持微信支付吗？", "Lǎobǎn, jiézhàng! Qǐngwèn zhīchí wēixìn zhīfù ma?", "Ông chủ, tính tiền! Xin hỏi có hỗ trợ thanh toán WeChat không?"),
          ("B", "支持的，墙上贴着收款码，您扫一下就行。", "Zhīchí de, qiáng shang tiē zhe shōukuǎnmǎ, nín sǎo yíxià jiù xíng.", "Có hỗ trợ chứ, trên tường có dán mã nhận tiền, bạn quét một cái là xong.")],
         "支持的，墙上贴着收款码，您扫一下就行。", "Khách hàng thanh toán tiền bằng cách nào?", ["Đưa tiền xu", "Quẹt thẻ tín dụng", "Quét mã QR trên tường", "Nợ tiền"], 2, "B chỉ dẫn: 墙上贴着收款码，您扫一下就行."),
        ("Hỏi thanh toán:", "老板，请问可以微信扫码转账吗？", "Lǎobǎn, qǐngwèn kěyǐ wēixìn sǎomǎ zhuǎnzhàng ma?", "Ông chủ ơi, có thể quét mã chuyển khoản WeChat không?", "Khẩu ngữ đời sống tự nhiên."),
        ("Sắp xếp câu: 'Bạn có thể chuyển khoản cho tôi bất cứ lúc nào'", ["随时", "微信转账", "可以", "给我", "你"], ["你", "随时", "可以", "给我", "微信转账"], "Cấu trúc Chủ ngữ + 随时 + Có thể + Hành động."),
        [("Hai ứng dụng thanh toán di động phổ biến nhất tại Trung Quốc là gì?", ["Facebook & Google", "微信 (WeChat) & 支付宝 (Alipay)", "Zalo & Momo", "Twitter & Youtube"], 1, "微信 và 支付宝 là 2 nền tảng thanh toán quốc dân tại TQ."),
         ("Điền từ: '有问题请____联系我们的工作人员。'", ["随时", "究竟", "差不多", "千万"], 0, "Liên hệ bất cứ lúc nào dùng 随时.")],
        ("Thanh toán số", "Mô phỏng quét mã thanh toán bữa ăn tại nhà hàng Trung Quốc.", "wēixìn zhīfù sǎomǎ", "Thổ Địa Công Nghệ")
    )

    add_l(
        "l-419", "ch-16", "lvl-4", 4, "Đổi trả hàng online & Khiếu nại chất lượng", "售后申请与退换货流程",
        "Quy trình xin đổi size, trả hàng hoàn tiền và đánh giá dịch vụ sau bán hàng.",
        "Nắm vững từ vựng dịch vụ: 退货, 换货, 质量, 评价 và liên từ 哪怕……也……",
        [
            ("退货", "tuìhuò", "Thoái hóa", "Trả hàng (hoàn tiền)", "辶", "衣服尺寸不合适，我申请了退货。", "Yīfu chǐcun bù héshì, wǒ shēnqǐng le tuìhuò.", "Kích cỡ áo không vừa, tôi đã nộp đơn trả hàng."),
            ("换货", "huànhuò", "Hoán hóa", "Đổi hàng (đổi size, đổi màu)", "扌", "如果质量有问题，七天内无理由换货。", "Rúguǒ zhìliàng yǒu wèntí, qī tiān nèi wú lǐyóu huànhuò.", "Nếu chất lượng có vấn đề, đổi hàng vô điều kiện trong 7 ngày."),
            ("质量", "zhìliàng", "Chất lượng", "Chất lượng", "贝", "这家店的商品质量非常可靠。", "Zhè jiā diàn de shāngpǐn zhìliàng fēicháng kěkào.", "Chất lượng hàng hóa của shop này rất đáng tin cậy."),
            ("评价", "píngjià", "Bình giá", "Đánh giá, review", "言", "确认收货后记得给卖家写一个好评。", "Quèrèn shōuhuò hòu jìde gěi màijiā xiě yí gè hǎopíng.", "Sau khi xác nhận nhận hàng nhớ viết đánh giá tốt cho người bán.")
        ],
        [("换", "huàn", "Đổi, hoán đổi", 12, "Ngang, sổ móc...", "Bộ Thủ (扌)", "Bàn tay cầm vật đem trao đổi."),
         ("评", "píng", "Đánh giá, bình phẩm", 7, "Chấm, ngang...", "Bộ Ngôn (言)", "Dùng lời lẽ công bằng nhận xét.")],
        ("哪怕……也…… (Cho dù... cũng...)", "Cấu trúc liên từ giả thiết nhượng bộ",
         "Biểu thị một giả thiết cực đoan nhưng kết quả hoặc quyết tâm vẫn không thay đổi.",
         ("哪怕工作再忙，我也要每天抽出时间学汉语。", "Nǎpà gōngzuò zài máng, wǒ yě yào měitiān chōuchū shíjiān xué Hànyǔ.", "Cho dù công việc có bận hơn nữa, tôi cũng phải dành thời gian học tiếng Trung mỗi ngày."),
         ("哪怕下雨，我也去。", "哪怕下大雨，我也要去。", "Sau 哪怕 thường có mức độ cực đoan hơn.")),
        ([("A", "客服你好，我买的毛衣尺寸偏小，可以申请换一件大号的吗？", "Kèfú nǐ hǎo, wǒ mǎi de máoyī chǐcun piān xiǎo, kěyǐ shēnqǐng huàn yí jiàn dàhào de ma?", "CSKH ơi, áo len tôi mua size hơi nhỏ, có thể xin đổi một chiếc size lớn hơn không?"),
          ("B", "可以的亲，只要吊牌没剪，随时支持七天无理由换货！", "Kěyǐ de qīn, zhǐyào diàopái méi jiǎn, suíshí zhīchí qī tiān wú lǐyóu huànhuò!", "Được chứ bạn ơi, chỉ cần tem mác chưa cắt, hỗ trợ đổi hàng vô điều kiện 7 ngày bất cứ lúc nào ạ!")],
         "可以的亲，只要吊牌没剪，随时支持七天无理由换货！", "Điều kiện để được đổi hàng là gì?", ["Phải trả thêm 50 tệ", "Tem mác chưa bị cắt", "Phải mua thêm đồ khác", "Không được đổi"], 1, "Chủ shop nhắc điều kiện: 只要吊牌没剪."),
        ("Yêu cầu hỗ trợ hậu mãi:", "衣服质量很好，给卖家全五星好评！", "Yīfu zhìliàng hěn hǎo, gěi màijiā quán wǔxīng hǎopíng!", "Chất lượng áo rất tốt, tặng người bán đánh giá 5 sao trọn vẹn!", "Giọng điệu hài lòng."),
        ("Sắp xếp câu: 'Cho dù gặp khó khăn tôi cũng không từ bỏ'", ["我也", "哪怕", "遇到困难", "决不放弃"], ["哪怕", "遇到困难", "我也", "决不放弃"], "Cấu trúc 哪怕...也..."),
        [("Chính sách mua sắm được đổi trả trong 7 ngày không cần lý do gọi là gì?", ["七天无理由退换货", "随时退款", "概不退换", "假一赔十"], 0, "Đó là chính sách bảo vệ người tiêu dùng nổi tiếng: 七天无理由退换货."),
         ("Điền từ: '____遇到挫折，我们____要保持乐观。'", ["哪怕...也...", "既然...就...", "因为...所以...", "不仅...而且..."], 0, "Giả thiết nhượng bộ dùng 哪怕...也...")],
        ("Hậu mãi mua sắm", "Thực hành liên hệ chăm sóc khách hàng xin đổi size áo len trên app mua sắm.", "qī tiān wú lǐyóu huànhuò", "Người Mua Thông Thái")
    )

    add_l(
        "l-420", "ch-16", "lvl-4", 5, "Đại khảo hạch HSK 4 — Chinh phục Level 4", "HSK 4级终极实战大考核",
        "Tổng ôn toàn diện 1200 từ vựng và các cấu trúc ngữ pháp trọng điểm của toàn bộ cấp độ HSK 4.",
        "Tự tin bước qua cột mốc trung cấp, sẵn sàng cho các bài thi và giao tiếp độc lập.",
        [
            ("流利", "liúlì", "Lưu lợi", "Lưu loát, trôi chảy", "氵", "经过一年的努力，他的汉语越来越流利了。", "Jīngguò yì nián de nǔlì, tā de Hànyǔ yuèláiyuè liúlì le.", "Trải qua 1 năm nỗ lực, tiếng Trung của anh ấy ngày càng lưu loát."),
            ("掌握", "zhǎngwò", "Chưởng ác", "Nắm vững, làm chủ", "扌", "我已经熟练掌握了HSK 4级的全部语法。", "Wǒ yǐjīng shúliàn zhǎngwò le HSK sì jí de quánbù yǔfǎ.", "Tôi đã nắm vững thành thạo toàn bộ ngữ pháp của HSK 4."),
            ("顺利", "shùnlì", "Thuận lợi", "Thuận lợi, trôi chảy", "页", "祝愿大家都能顺利通过这次大考！", "Zhùyuàn dàjiā dōu néng shùnlì tōngguò zhè cì dàkǎo!", "Chúc mọi người đều có thể thuận lợi vượt qua kỳ đại khảo hạch này!"),
            ("坚持", "jiānchí", "Kiên trì", "Kiên trì bền bỉ", "土", "只要坚持下去，就一定能取得更大的成功。", "Zhǐyào jiānchí xiàqù, jiù yídìng néng qǔdé gèng dà de chénggōng.", "Chỉ cần kiên trì tiếp tục thì nhất định sẽ đạt được thành công lớn hơn.")
        ],
        [("握", "wò", "Nắm giữ, bắt tay", 12, "Ngang, sổ móc...", "Bộ Thủ (扌)", "Bàn tay nắm chặt lấy cơ hội."),
         ("熟", "shú", "Thành thạo, chín", 15, "Chấm, ngang...", "Bộ Hỏa (灬)", "Nấu nướng chín kỹ, rèn luyện thuần thục.")],
        ("经过…… (Trải qua... / Qua một quá trình...)", "Giới từ chỉ quá trình biến đổi dẫn đến kết quả",
         "Đặt cụm '经过 + Thời gian / Nỗ lực' ở đầu câu để làm trạng ngữ chỉ nguyên nhân tạo nên sự tiến bộ.",
         ("经过不懈的努力，他的口语水平有了显著提高。", "Jīngguò búxiè de nǔlì, tā de kǒuyǔ shuǐpíng yǒu le xiǎnzhù tígāo.", "Trải qua nỗ lực không ngừng, trình độ khẩu ngữ của anh ấy đã nâng cao rõ rệt."),
         ("经过他聪明。", "经过他的努力。", "Sau 经过 phải là một quá trình hoặc hành động, không đi trực tiếp với tính từ.")),
        ([("A", "恭喜你！这次模拟测试你拿到了270分的高分！", "Gōngxǐ nǐ! Zhè cì mónǐ cèshì nǐ nádào le èrbǎi qīshí fēn de gāofēn!", "Chúc mừng bạn! Bài thi thử lần này bạn đạt điểm số rất cao 270 điểm!"),
          ("B", "太感谢老师了！这几个月的坚持终于有了回报！", "Tài gǎnxiè lǎoshī le! Zhè jǐ gè yuè de jiānchí zhōngyú yǒu le huíbào!", "Vô cùng cảm ơn thầy! Sự kiên trì mấy tháng qua cuối cùng đã được đền đáp!")],
         "太感谢老师了！这几个月的坚持终于有了回报！", "Học viên đạt được kết quả thi như thế nào?", ["Trượt kỳ thi", "Đạt điểm số rất cao 270 điểm", "Bỏ thi giữa chừng", "Không làm kịp bài"], 1, "Kết quả: 拿到了270分的高分."),
        ("Lời tuyên bố quyết tâm:", "我已全面掌握HSK 4级核心内容！", "Wǒ yǐ quánmiàn zhǎngwò HSK sì jí héxīn nèiróng!", "Tôi đã hoàn toàn làm chủ nội dung cốt lõi của HSK 4!", "Khí thế tự tin, phát âm hào sảng."),
        ("Sắp xếp câu: 'Trải qua nỗ lực anh ấy đã thi đỗ HSK 4'", ["顺利通过了", "他", "经过努力", "HSK 4级"], ["经过努力", "他", "顺利通过了", "HSK 4级"], "Cấu trúc 经过 + Quá trình, Chủ ngữ + Vượt qua..."),
        [("Điểm đạt yêu cầu (Passing Score) của kỳ thi HSK 4 chính thức là bao nhiêu điểm?", ["120 / 300", "180 / 300", "200 / 300", "250 / 300"], 1, "Theo quy chuẩn CTI, tổng điểm 180/300 trở lên là Đạt."),
         ("Điền từ: '____长时间的训练，队员们的配合越来越默契。'", ["经过", "既然", "不仅", "哪怕"], 0, "Chỉ quá trình dẫn đến kết quả tốt dùng 经过.")],
        ("Đại khảo hạch HSK 4", "Hoàn thành toàn bộ bài kiểm tra tổng hợp và sẵn sàng tiến lên Level 5.", "shúliàn zhǎngwò HSK sì jí", "Bậc Thầy Trung Cấp HSK 4")
    )

print("HSK 4 (Chapters 13-16, 20 lessons) loaded successfully.")
