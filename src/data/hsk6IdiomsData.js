/**
 * HANZIGO — HSK 6 FOUR-CHARACTER IDIOMS DATABASE (50 四字成语)
 * Chuẩn hóa 50 thành ngữ bốn chữ có giá trị thực tiễn và tính học thuật cao.
 * Phân bố thành 5 nhóm chủ đề chuyên sâu (10 thành ngữ/nhóm).
 */

export const HSK6_IDIOMS_DATABASE = [
  // ==========================================
  // NHÓM 1: TƯ DUY, HỌC TẬP & TRI THỨC (10 THÀNH NGỮ)
  // ==========================================
  {
    id: 'cy-601',
    chengyu: '坚持不懈',
    pinyin: 'jiānchí-búxiè',
    hanviet: 'Kiên trì bất giải',
    category: 'Tư duy, học tập & Tri thức',
    meaning: 'Kiên trì bền bỉ, không lơi lỏng chểnh mảng',
    literalMeaning: 'Kiên quyết giữ vững (坚持), không buông lỏng chểnh mảng (不懈).',
    figurativeMeaning: 'Thái độ kiên trì đến cùng trước mọi khó khăn thử thách trong học tập và nghiên cứu.',
    usage: 'Thường làm vị ngữ, định ngữ hoặc trạng ngữ trong văn nghị luận.',
    register: 'Trang trọng / Văn viết & Học thuật',
    example: '只要坚持不懈地努力，任何学术难题最终都能找到突破口。',
    examplePinyin: 'Zhǐyào jiānchí-búxiè de nǔlì, rènhé xuéshù nántí zuìzhōng dōu néng zhǎodào tūpòkǒu.',
    exampleMeaning: 'Chỉ cần nỗ lực kiên trì bền bỉ, bất kỳ vấn đề học thuật hóc búa nào cuối cùng cũng sẽ tìm ra đột phá.',
    relatedWords: {
      synonyms: ['持之以恒', '锲而不舍', '坚韧不拔'],
      antonyms: ['半途而废', '一暴十寒', '有始无终']
    },
    commonMistakes: 'Không viết sai chữ 懈 (xiè) thành 解 (jiě).',
    origin: 'Trích từ tác phẩm triết học kinh điển thời Thanh "Thính vũ lâu văn sao" của Tăng Quốc Phiên.',
    originSourceType: 'Tác phẩm văn học cổ điển'
  },
  {
    id: 'cy-602',
    chengyu: '半途而废',
    pinyin: 'bàntú\'érfèi',
    hanviet: 'Bán đồ nhi phế',
    category: 'Tư duy, học tập & Tri thức',
    meaning: 'Bỏ dở giữa chừng, đứt gánh giữa đường',
    literalMeaning: 'Đi đến nửa đường (半途) mà vứt bỏ, từ bỏ mục tiêu (废).',
    figurativeMeaning: 'Chỉ việc làm việc hay học tập thiếu ý chí, gặp khó khăn là thoái thác bỏ cuộc giữa chừng.',
    usage: 'Thường dùng làm vị ngữ hoặc bổ ngữ chỉ kết quả tiêu cực.',
    register: 'Trang trọng & Trung tính',
    example: '学习高级汉语最忌讳半途而废，唯有日积月累方能领略其精妙。',
    examplePinyin: 'Xuéxí gāojí Hànyǔ zuì jìhuì bàntú\'érfèi, wéiyǒu rìjī-yuèlěi fāng néng lǐnglüè qí jīngmiào.',
    exampleMeaning: 'Học tiếng Trung cao cấp tối kỵ nhất là bỏ dở giữa chừng, chỉ có tích lũy ngày qua tháng lại mới cảm nhận được sự tinh diệu của nó.',
    relatedWords: {
      synonyms: ['功亏一篑', '浅尝辄止', '前功尽弃'],
      antonyms: ['坚持不懈', '有始有终', '善始善终']
    },
    commonMistakes: 'Không nói "把事情半途而废", mà dùng "半途而废地放弃" hoặc "事情半途而废".',
    origin: 'Điển tích "Lễ Ký - Trung Dung": "Quân tử tu đạo nhi hành, bán đồ nhi phế, ngô phất năng dĩ hĩ".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-603',
    chengyu: '废寝忘食',
    pinyin: 'fèiqǐn-wàngshí',
    hanviet: 'Phế tẩm vong thực',
    category: 'Tư duy, học tập & Tri thức',
    meaning: 'Quên ăn quên ngủ vì say mê học tập, nghiên cứu',
    literalMeaning: 'Bỏ cả giấc ngủ (废寝), quên cả bữa ăn (忘食).',
    figurativeMeaning: 'Miêu tả sự chuyên tâm, cống hiến tột bậc cho công việc, khoa học hay nghệ thuật.',
    usage: 'Thường làm trạng ngữ hoặc vị ngữ mang sắc thái ngợi ca.',
    register: 'Trang trọng / Văn viết',
    example: '为了攻克这一技术瓶颈，整个科研团队连续数周废寝忘食地投入实验。',
    examplePinyin: 'Wèile gōngkè zhè yí jìshù píngjǐng, zhěnggè kēyán tuánduì liánxù shù zhōu fèiqǐn-wàngshí de tóurù shíyàn.',
    exampleMeaning: 'Nhằm khắc phục nút thắt cổ chai kỹ thuật này, toàn bộ đội ngũ nghiên cứu khoa học đã quên ăn quên ngủ lao vào thí nghiệm suốt nhiều tuần liền.',
    relatedWords: {
      synonyms: ['夜以继日', '焚膏继晷', '专心致志'],
      antonyms: ['饱食终日', '无所事事', '游手好闲']
    },
    commonMistakes: 'Chữ 寝 (qǐn) có nghĩa là ngủ, không đọc là qǐng.',
    origin: 'Sách "Tam quốc chí - Ngụy chí": "Vương Tư cần ư công sự, phế tẩm vong thực".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-604',
    chengyu: '聚精会神',
    pinyin: 'jùjīng-huìshén',
    hanviet: 'Tụ tinh hội thần',
    category: 'Tư duy, học tập & Tri thức',
    meaning: 'Tập trung cao độ tinh thần và trí lực',
    literalMeaning: 'Tập hợp toàn bộ tinh túy (聚精) và hội tụ thần khí (会神).',
    figurativeMeaning: 'Trạng thái chú ý tập trung toàn diện, không một mảy may xao nhãng.',
    usage: 'Thường làm trạng ngữ đứng trước động từ (聚精会神地听 / 读 / 想).',
    register: 'Trang trọng & Trung tính',
    example: '同学们都在聚精会神地听教授解析经济学模型的推导过程。',
    examplePinyin: 'Tóngxuémen dōu zài jùjīng-huìshén de tīng jiàoshòu jiěxī jīngjìxué móxíng de tuīdǎo guòchéng.',
    exampleMeaning: 'Các bạn học đều đang chăm chú tập trung tinh thần nghe giáo sư phân tích quá trình suy luận mô hình kinh tế học.',
    relatedWords: {
      synonyms: ['全神贯注', '屏息凝视', '目不转睛'],
      antonyms: ['心不在焉', '心猿意马', '漫不经心']
    },
    commonMistakes: 'Không dùng từ này cho các hoạt động giải trí buông thả.',
    origin: 'Hán thư - Vương Bao truyện: "Tập tư quảng ích, tụ tinh hội thần".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-605',
    chengyu: '深入浅出',
    pinyin: 'shēnrù-qiǎnchū',
    hanviet: 'Thâm nhập thiển xuất',
    category: 'Tư duy, học tập & Tri thức',
    meaning: 'Hiểu sâu sắc nhưng diễn giải giản dị dễ hiểu',
    literalMeaning: 'Đi vào chỗ sâu sắc uyên thâm (深入), nhưng đưa ra bằng hình thức đơn sơ dễ hiểu (浅出).',
    figurativeMeaning: 'Năng lực sư phạm và học thuật đỉnh cao: biến kiến thức phức tạp thành bài học sáng tỏ, đại chúng.',
    usage: 'Thường làm định ngữ hoặc vị ngữ đánh giá một bài thuyết trình, sách vở.',
    register: 'Trang trọng / Học thuật',
    example: '这篇论文深入浅出地阐述了复杂的人工智能算法，深得学术界赞誉。',
    examplePinyin: 'Zhè piān lùnwén shēnrù-qiǎnchū de chǎnshù le fùzá de réngōng zhìnéng suànfǎ, shēndé xuéshùjiè zànyù.',
    exampleMeaning: 'Bài luận văn này đã giải thích thuật toán trí tuệ nhân tạo phức tạp một cách sâu sắc mà vô cùng dễ hiểu, được giới học thuật tán thưởng nhiệt liệt.',
    relatedWords: {
      synonyms: ['通俗易懂', '微言大义', '言简意赅'],
      antonyms: ['深奥莫测', '晦涩难懂', '佶屈聱牙']
    },
    commonMistakes: 'Không nhầm lẫn với "nói suông thiếu chiều sâu" (浅尝辄止).',
    origin: 'Tác phẩm văn học thời Thanh: "Dục đắc thâm nhập thiển xuất chi diệu, phi đại học vấn giả bất năng".',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-606',
    chengyu: '循序渐进',
    pinyin: 'xúnxù-jiànjìn',
    hanviet: 'Tuần tự tiệm tiến',
    category: 'Tư duy, học tập & Tri thức',
    meaning: 'Làm theo trình tự, tiến dần từng bước chắc chắn',
    literalMeaning: 'Men theo thứ tự lớp lang (循序) mà từ từ tiến tới (渐进).',
    figurativeMeaning: 'Quy luật học tập và phát triển đúng đắn: không đốt cháy giai đoạn, đi từ cơ bản đến nâng cao.',
    usage: 'Làm vị ngữ, trạng ngữ hoặc định ngữ phương pháp luận.',
    register: 'Trang trọng & Học thuật',
    example: '掌握一门复杂的学科，必须遵循循序渐进的规律，不可急于求成。',
    examplePinyin: 'Zhǎngwò yì mén fùzá de xuékē, bìxū zūnxún xúnxù-jiànjìn de guīlǜ, bùkě jíyúqiúchéng.',
    exampleMeaning: 'Để nắm vững một môn học phức tạp, nhất thiết phải tuân thủ quy luật tuần tự tiến từng bước, không được nóng vội cầu thành.',
    relatedWords: {
      synonyms: ['按部就班', '由浅入深', '稳扎稳打'],
      antonyms: ['急于求成', '拔苗助长', '一步登天']
    },
    commonMistakes: 'Chữ 循 (xún) có bộ Xích (彳), không viết nhầm thành 盾 hay 顺.',
    origin: 'Luận Ngữ - Hiến Vấn: "Khổng Tử viết: Tuần tự nhi tiệm tiến, bỉ hữu sở chí".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-607',
    chengyu: '融会贯通',
    pinyin: 'rónghuì-guàntōng',
    hanviet: 'Dung hội quán thông',
    category: 'Tư duy, học tập & Tri thức',
    meaning: 'Hiểu thấu suốt và kết hợp nhuần nhuyễn mọi kiến thức',
    literalMeaning: 'Dung hòa hội tụ các nguồn tri thức (融会) và thông suốt thành một thể thống nhất (贯通).',
    figurativeMeaning: 'Đỉnh cao của sự học: không chỉ nhớ rời rạc mà liên kết kiến thức liên ngành một cách linh hoạt.',
    usage: 'Làm vị ngữ hoặc bổ ngữ chỉ mức độ lĩnh hội.',
    register: 'Trang trọng / Học thuật đỉnh cao',
    example: '只有把理论知识与实战经验融会贯通，才能在商业谈判中游刃有余。',
    examplePinyin: 'Zhǐyǒu bǎ lǐlùn zhīshi yǔ shízhàn jīngyàn rónghuì-guàntōng, cáinéng zài shāngyè tánpàn zhōng yóurèn-yǒuyú.',
    exampleMeaning: 'Chỉ khi kết hợp nhuần nhuyễn giữa kiến thức lý luận và kinh nghiệm thực chiến, bạn mới có thể ứng biến thoải mái tự tin trong đàm phán thương mại.',
    relatedWords: {
      synonyms: ['举一反三', '豁然贯通', '触类旁通'],
      antonyms: ['生搬硬套', '囫囵吞枣', '不求甚解']
    },
    commonMistakes: 'Chữ 贯 (guàn) có nghĩa là xâu chuỗi, không viết thành 惯 (quen thói).',
    origin: 'Chu Tử ngữ loại thời Tống: "Cử nhất sự nhi chư sự dĩ ứng, dung hội quán thông chi vị dã".',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-608',
    chengyu: '触类旁通',
    pinyin: 'chùlèi-pángtōng',
    hanviet: 'Xúc loại bàng thông',
    category: 'Tư duy, học tập & Tri thức',
    meaning: 'Hiểu rõ một vấn đề rồi suy rộng ra các việc cùng loại',
    literalMeaning: 'Chạm tới một việc tương tự (触类) liền thông suốt sang các khía cạnh bên cạnh (旁通).',
    figurativeMeaning: 'Khả năng tư duy loại suy, nhận biết quy luật chung từ một ví dụ cụ thể.',
    usage: 'Làm vị ngữ trong câu khẳng định về năng lực tư duy.',
    register: 'Trang trọng & Học thuật',
    example: '语言之间存在许多共性，学好古汉语往往能让你触类旁通，加深对现代汉语的理解。',
    examplePinyin: 'Yǔyán zhījiān cúnzài xǔduō gòngxìng, xué hǎo gǔ Hànyǔ wǎngwǎng néng ràng nǐ chùlèi-pángtōng, jiāshēn duì xiàndài Hànyǔ de lǐjiě.',
    exampleMeaning: 'Giữa các ngôn ngữ tồn tại nhiều điểm tương đồng, học tốt cổ Hán ngữ thường giúp bạn suy rộng ra các mặt khác, làm sâu sắc thêm hiểu biết về tiếng Trung hiện đại.',
    relatedWords: {
      synonyms: ['举一反三', '闻一知十', '融会贯通'],
      antonyms: ['食古不化', '冥顽不灵', '墨守成规']
    },
    commonMistakes: 'Không dùng cho những việc hoàn toàn khác biệt về bản chất.',
    origin: 'Kinh Dịch - Hệ Từ Hạ: "Dẫn nhi thân chi, xúc loại nhi trường chi, thiên hạ chi năng sự tất hĩ".',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-609',
    chengyu: '举一反三',
    pinyin: 'jǔyì-fǎnsān',
    hanviet: 'Cử nhất phản tam',
    category: 'Tư duy, học tập & Tri thức',
    meaning: 'Nêu ra một điều có thể suy đoán ra ba điều khác',
    literalMeaning: 'Đưa ra một góc (举一) người học tự phản chiếu suy ra ba góc còn lại (反三).',
    figurativeMeaning: 'Khen ngợi trí thông minh, khả năng học một biết mười, tư duy phản biện nhạy bén.',
    usage: 'Làm vị ngữ, định ngữ hoặc trạng ngữ.',
    register: 'Trang trọng & Phổ biến',
    example: '优秀的学者不仅善于吸收知识，更能举一反三，提出具有原创性的见解。',
    examplePinyin: 'Yōuxiù de xuézhě bùjǐn shànyú xīshōu zhīshi, gèng néng jǔyì-fǎnsān, tíchū jùyǒu yuánchuàngxìng de jiànjiě.',
    exampleMeaning: 'Một học giả ưu tú không những giỏi tiếp thu kiến thức mà còn biết suy rộng ra nhiều mặt, đưa ra các quan điểm mang tính sáng tạo nguyên bản.',
    relatedWords: {
      synonyms: ['闻一知十', '触类旁通', '由此及彼'],
      antonyms: ['按图索骥', '胶柱鼓瑟', '囫囵吞枣']
    },
    commonMistakes: 'Phản (反) ở đây mang nghĩa suy đoán, quy nạp, không phải phản đối.',
    origin: 'Luận Ngữ - Thuật Nhi: "Cử nhất ngung bất dĩ tam ngung phản, tắc ngô bất phục dã".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-610',
    chengyu: '温故知新',
    pinyin: 'wēngù-zhīxīn',
    hanviet: 'Ôn cố tri tân',
    category: 'Tư duy, học tập & Tri thức',
    meaning: 'Ôn lại điều cũ để thấu hiểu điều mới mẻ sâu sắc hơn',
    literalMeaning: 'Ôn tập những điều đã biết từ trước (温故) để nhận biết những tri thức mới mẻ (知新).',
    figurativeMeaning: 'Phương pháp rèn luyện tri thức truyền thống: nền tảng vững vàng là gốc rễ của sáng tạo.',
    usage: 'Làm vị ngữ, định ngữ hoặc khẩu hiệu học tập.',
    register: 'Trang trọng & Giáo dục',
    example: '阶段性的复习不仅能巩固记忆，更能让你温故知新，发现此前忽略的深层逻辑。',
    examplePinyin: 'Jiēduànxìng de fùxí bùjǐn néng gǒnggù jìyì, gèng néng ràng nǐ wēngù-zhīxīn, fāxiàn cǐqián hūlüè de shēncéng luóji.',
    exampleMeaning: 'Việc ôn tập theo từng giai đoạn không những củng cố trí nhớ mà còn giúp bạn ôn cũ biết mới, khám phá ra những logic tầng sâu từng bị bỏ qua.',
    relatedWords: {
      synonyms: ['教学相长', '数典不忘', '见贤思齐'],
      antonyms: ['喜新厌旧', '数典忘祖', '弃旧图新']
    },
    commonMistakes: 'Không đồng nghĩa với sự hoài cổ bảo thủ.',
    origin: 'Luận Ngữ - Vi Chính: "Ôn cố nhi tri tân, khả dĩ vi sư hĩ".',
    originSourceType: 'Điển cố lịch sử'
  },

  // ==========================================
  // NHÓM 2: CÔNG VIỆC, QUẢN TRỊ & SỰ NGHIỆP (10 THÀNH NGỮ)
  // ==========================================
  {
    id: 'cy-611',
    chengyu: '统筹兼顾',
    pinyin: 'tǒngchóu-jiāngù',
    hanviet: 'Thống trù kiêm cố',
    category: 'Công việc, quản trị & Sự nghiệp',
    meaning: 'Quy hoạch bao quát, quan tâm săn sóc hài hòa mọi phương diện',
    literalMeaning: 'Thống nhất trù tính tổng thể (统筹) và đồng thời để mắt chăm lo đầy đủ (兼顾).',
    figurativeMeaning: 'Tầm nhìn chiến lược của nhà quản lý: cân bằng lợi ích đa phương, không để sót bộ phận nào.',
    usage: 'Làm vị ngữ, định ngữ chính sách trong văn phong quản trị.',
    register: 'Trang trọng / Quản trị & Chính sách',
    example: '在推进数字化转型的过程中，企业必须统筹兼顾效率提升与员工技能培训。',
    examplePinyin: 'Zài tuījìn shùzìhuà zhuǎnxíng de guòchéng zhōng, qǐyè bìxū tǒngchóu-jiāngù xiàolǜ tíshēng yǔ yuángōng jìnéng péixùn.',
    exampleMeaning: 'Trong quá trình đẩy mạnh chuyển đổi số, doanh nghiệp nhất thiết phải tính toán bao quát hài hòa giữa nâng cao hiệu suất và đào tạo kỹ năng cho nhân viên.',
    relatedWords: {
      synonyms: ['通盘考虑', '兼筹并顾', '面面俱到'],
      antonyms: ['顾此失彼', '单打一', '挂一漏万']
    },
    commonMistakes: 'Chữ 兼顾 nghĩa là cùng chăm lo, không viết nhầm thành 兼顾.',
    origin: 'Văn kiện quản lý hành chính hiện đại kế thừa tư tưởng chính sách quốc gia.',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-612',
    chengyu: '各尽所能',
    pinyin: 'gèjìn-suǒnéng',
    hanviet: 'Các tận sở năng',
    category: 'Công việc, quản trị & Sự nghiệp',
    meaning: 'Mỗi người dốc hết sở trường và năng lực của mình',
    literalMeaning: 'Mỗi cá nhân (各) dốc trọn (尽) năng lực vốn có của mình (所能).',
    figurativeMeaning: 'Nguyên tắc quản trị nhân sự tối ưu: bố trí đúng người đúng việc để ai nấy phát huy cực điểm.',
    usage: 'Làm vị ngữ hoặc trạng ngữ trong hợp tác tổ chức.',
    register: 'Trang trọng & Quản trị',
    example: '项目成功的关键在于明确分工，让团队中每个成员都能各尽所能。',
    examplePinyin: 'Xiàngmù chénggōng de guānjiàn zàiyú míngquè fēngōng, ràng tuánduì zhōng měi gè chéngyuán dōu néng gèjìn-suǒnéng.',
    exampleMeaning: 'Mấu chốt thành công của dự án nằm ở việc phân công rõ ràng, khiến mọi thành viên trong đội ngũ đều có thể dốc hết sở trường của mình.',
    relatedWords: {
      synonyms: ['人尽其才', '各展其长', '全力以赴'],
      antonyms: ['大材小用', '尸位素餐', '才不配位']
    },
    commonMistakes: 'Thường đi kèm với "按劳分配" trong ngữ cảnh kinh tế xã hội.',
    origin: 'Học thuyết tổ chức xã hội và quản trị hiện đại.',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-613',
    chengyu: '群策群力',
    pinyin: 'qúncè-qúnlì',
    hanviet: 'Quần sách quần lực',
    category: 'Công việc, quản trị & Sự nghiệp',
    meaning: 'Góp chung trí tuệ và công sức của tập thể',
    literalMeaning: 'Tập thể cùng hiến kế sách (群策), tập thể cùng ra sức lực (群力).',
    figurativeMeaning: 'Sức mạnh tập thể vượt trội hơn chủ nghĩa anh hùng cá nhân khi giải quyết khủng hoảng.',
    usage: 'Làm vị ngữ hoặc trạng ngữ chỉ sự đồng lòng hiệp lực.',
    register: 'Trang trọng / Tổ chức & Doanh nghiệp',
    example: '面对激烈的市场竞争，只有群策群力，我们才能制定出最具颠覆性的产品策略。',
    examplePinyin: 'Miànduì jīliè de shìchǎng jìngzhēng, zhǐyǒu qúncè-qúnlì, wǒmen cáinéng zhìdìng chū zuì jù diānfùxìng de chǎnpǐn cèlüè.',
    exampleMeaning: 'Đối diện với sự cạnh tranh gay gắt của thị trường, chỉ có đồng lòng góp trí góp sức, chúng ta mới có thể đề ra chiến lược sản phẩm mang tính đột phá nhất.',
    relatedWords: {
      synonyms: ['集思广益', '齐心协力', '同心同德'],
      antonyms: ['独断专行', '孤军奋战', '群龙无首']
    },
    commonMistakes: 'Sách (策) là mưu kế, không viết nhầm thành 测 (đo lường).',
    origin: 'Pháp ngôn - Trọng Lê thiên: "Quần sách quần lực, tắc vô bất thắng dã".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-614',
    chengyu: '应对自如',
    pinyin: 'yìngduì-zìrú',
    hanviet: 'Ứng đối tự như',
    category: 'Công việc, quản trị & Sự nghiệp',
    meaning: 'Ứng phó thoải mái, giải quyết tình huống trôi chảy tự tin',
    literalMeaning: 'Ứng phó đối đáp (应对) tự nhiên như không (自如).',
    figurativeMeaning: 'Bản lĩnh của chuyên gia trước các câu hỏi phỏng vấn hóc búa hay tình huống áp lực cao.',
    usage: 'Làm vị ngữ hoặc bổ ngữ chỉ phong thái.',
    register: 'Trang trọng & Khen ngợi',
    example: '在严苛的媒体质询会上，新闻发言人沉着冷静，应对自如。',
    examplePinyin: 'Zài yánkē de méitǐ zhìxún huì shàng, xīnwén fāyánrén chénzhuó lěngjìng, yìngduì-zìrú.',
    exampleMeaning: 'Tại buổi chất vấn truyền thông khắt khe, người phát ngôn tin tức vẫn điềm tĩnh trầm ổn, đối đáp trôi chảy tự tin.',
    relatedWords: {
      synonyms: ['游刃有余', '从容不迫', '应付裕如'],
      antonyms: ['手足无措', '张皇失措', '捉襟见肘']
    },
    commonMistakes: 'Không nói "应对自如地问题", mà nói "应对自如".',
    origin: 'Tác phẩm văn học lịch sử đời Thanh diễn đạt phong thái ngoại giao.',
    originSourceType: 'Tác phẩm văn học cổ điển'
  },
  {
    id: 'cy-615',
    chengyu: '尽职尽责',
    pinyin: 'jìnzhí-jìnzé',
    hanviet: 'Tận chức tận trách',
    category: 'Công việc, quản trị & Sự nghiệp',
    meaning: 'Hết lòng hoàn thành chức trách và nhiệm vụ',
    literalMeaning: 'Dốc hết bổn phận của chức vụ (尽职), làm tròn mọi trách nhiệm (尽责).',
    figurativeMeaning: 'Đạo đức nghề nghiệp cao đẹp: tận tụy, trung thực và tận tâm với công việc được giao.',
    usage: 'Làm vị ngữ, định ngữ hoặc trạng ngữ.',
    register: 'Trang trọng / Công sở & Khen ngợi',
    example: '无论身处何种岗位，一名优秀的员工都会尽职尽责地做好本职工作。',
    examplePinyin: 'Wúlùn shēnchǔ hé zhǒng gǎngwèi, yì míng yōuxiù de yuángōng dōu huì jìnzhí-jìnzé de zuò hǎo běnzhí gōngzuò.',
    exampleMeaning: 'Bất luận ở cương vị nào, một nhân viên ưu tú cũng đều hết lòng hết trách nhiệm hoàn thành tốt công việc chuyên môn.',
    relatedWords: {
      synonyms: ['恪尽职守', '兢兢业业', '一丝不苟'],
      antonyms: ['玩忽职守', '敷衍了事', '擅离职守']
    },
    commonMistakes: 'Tránh viết nhầm chữ 责 thành 债.',
    origin: 'Văn phong hành chính và chuẩn mực công chức cổ kim.',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-616',
    chengyu: '任劳任怨',
    pinyin: 'rènláo-rènyuàn',
    hanviet: 'Nhậm lao nhậm oán',
    category: 'Công việc, quản trị & Sự nghiệp',
    meaning: 'Chịu thương chịu khó, gánh vác việc khó nhọc mà không than vãn oán trách',
    literalMeaning: 'Chấp nhận gian lao (任劳), gánh chịu lời oán thán hiểu lầm (任怨).',
    figurativeMeaning: 'Đức hy sinh và tinh thần cống hiến thầm lặng vì đại cuộc của người lãnh đạo hoặc trụ cột.',
    usage: 'Làm vị ngữ, định ngữ hoặc trạng ngữ mang sắc thái ca ngợi sâu sắc.',
    register: 'Trang trọng & Đạo đức',
    example: '老工程师数十年来任劳任怨，为国家重点工程奉献了毕生精力。',
    examplePinyin: 'Lǎo gōngchéngshī shù shí nián lái rènláo-rènyuàn, wèi guójiā zhòngdiǎn gōngchéng fèngxiàn le bìshēng jīnglì.',
    exampleMeaning: 'Vị kỹ sư lão thành hàng chục năm qua luôn chịu thương chịu khó không lời oán thán, cống hiến trọn vẹn sức lực cả đời cho công trình trọng điểm quốc gia.',
    relatedWords: {
      synonyms: ['吃苦耐劳', '默默奉献', '无怨无悔'],
      antonyms: ['怨天尤人', '斤斤计较', '好逸恶劳']
    },
    commonMistakes: 'Từ 任 ở đây đọc thanh 4 (rèn), mang nghĩa đảm đương gánh vác.',
    origin: 'Hán thư - Thạch Hiển truyện: "Cung thận tự sắc, nhậm lao nhậm oán".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-617',
    chengyu: '精益求精',
    pinyin: 'jīngyìqiújīng',
    hanviet: 'Tinh ích cầu tinh',
    category: 'Công việc, quản trị & Sự nghiệp',
    meaning: 'Đã hoàn thiện, tinh xảo lại muốn tinh xảo và hoàn mỹ hơn nữa',
    literalMeaning: 'Đã tinh xảo (精) càng muốn (求) tinh xảo hơn nữa (益精).',
    figurativeMeaning: 'Tinh thần thợ thủ công (工匠精神), không bao giờ tự mãn với chất lượng hiện tại.',
    usage: 'Làm vị ngữ, định ngữ phương châm chất lượng sản phẩm.',
    register: 'Trang trọng / Nghề nghiệp & Kỹ thuật',
    example: '制造业的转型升级，离不开对产品细节精益求精的工匠态度。',
    examplePinyin: 'Zhìzàoyè de zhuǎnxíng shēngjí, lí bù kāi duì chǎnpǐn xìjié jīngyìqiújīng de gōngjiàng tàidù.',
    exampleMeaning: 'Sự chuyển đổi và nâng cấp của ngành chế tạo không thể tách rời thái độ thợ thủ công luôn theo đuổi sự tinh ích cầu tinh đối với từng chi tiết sản phẩm.',
    relatedWords: {
      synonyms: ['锦上添花', '尽善尽美', '一丝不苟'],
      antonyms: ['粗制滥造', '得过且过', '草草了事']
    },
    commonMistakes: 'Chữ 益 mang nghĩa "ngày càng, càng thêm", không phải là "lợi ích".',
    origin: 'Luận Ngữ - Học Nhi: "Thi vân: Như thiết như tha, như trác như ma, kỳ tư chi vị dữ".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-618',
    chengyu: '实事求是',
    pinyin: 'shíshì-qiúshì',
    hanviet: 'Thực sự cầu thị',
    category: 'Công việc, quản trị & Sự nghiệp',
    meaning: 'Tìm kiếm chân lý từ thực tế khách quan, không nói khoác',
    literalMeaning: 'Dựa vào sự việc có thực (实事) để tìm tòi bản chất quy luật chân thực (求是).',
    figurativeMeaning: 'Tác phong khoa học và chuẩn mực quản lý tối cao: trung thực với số liệu, nói đúng làm thật.',
    usage: 'Làm vị ngữ, định ngữ hoặc trạng ngữ nguyên tắc làm việc.',
    register: 'Trang trọng / Triết học & Chính trị',
    example: '评估一项投资项目的风险，必须坚持实事求是的态度，不能盲目乐观。',
    examplePinyin: 'Pínggū yí xiàng tóuzī xiàngmù de fēngxiǎn, bìxū jiānchí shíshì-qiúshì de tàidù, bù néng mángmù lèguān.',
    exampleMeaning: 'Đánh giá rủi ro của một dự án đầu tư nhất thiết phải kiên trì thái độ thực sự cầu thị, không được lạc quan mù quáng.',
    relatedWords: {
      synonyms: ['脚踏实地', '量力而行', '按客观规律办事'],
      antonyms: ['弄虚作假', '闭门造车', '哗众取宠']
    },
    commonMistakes: 'Thị (是) ở đây là quy luật đúng đắn khách quan, không phải là động từ phán đoán thông thường.',
    origin: 'Hán thư - Hà Gian Hiến vương truyện: "Tu học hảo cổ, thực sự cầu thị".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-619',
    chengyu: '厚积薄发',
    pinyin: 'hòujī-bófā',
    hanviet: 'Hậu tích bạc phát',
    category: 'Công việc, quản trị & Sự nghiệp',
    meaning: 'Tích lũy sâu dày, phát tiết vững chãi và bùng nổ mạnh mẽ',
    literalMeaning: 'Tích lũy thật dày dặn (厚积) rồi mới thong thả tung ra có kiểm soát (薄发).',
    figurativeMeaning: 'Muốn có thành công lớn, phải chuẩn bị kiến thức và nguồn lực âm thầm trong thời gian dài.',
    usage: 'Làm vị ngữ, định ngữ khuyên răn người khởi nghiệp và nhà nghiên cứu.',
    register: 'Trang trọng / Văn chương & Doanh nghiệp',
    example: '一家高科技企业之所以能一夜成名，往往源于其在底层研发上十余年的厚积薄发。',
    examplePinyin: 'Yì jiā gāokējì qǐyè zhīsuǒyǐ néng yíyè-chéngmíng, wǎngwǎng yuányú qí zài dǐcéng yánfā shàng shí yú nián de hòujī-bófā.',
    exampleMeaning: 'Một doanh nghiệp công nghệ cao sở dĩ có thể nổi danh chỉ sau một đêm thường bắt nguồn từ sự tích lũy sâu dày trong hơn mười năm nghiên cứu phát triển cốt lõi.',
    relatedWords: {
      synonyms: ['蓄势待发', '韬光养晦', '水到渠成'],
      antonyms: ['急功近利', '拔苗助长', '外强中干']
    },
    commonMistakes: 'Bạc (薄) ở đây nghĩa là ít mà tinh, thận trọng tung ra, không phải bạc bẽo coi thường.',
    origin: 'Tô Thức thời Tống - "Hác đường ký": "Bác quan nhi ước thủ, hậu tích nhi bạc phát".',
    originSourceType: 'Tác phẩm văn học cổ điển'
  },
  {
    id: 'cy-620',
    chengyu: '独当一面',
    pinyin: 'dúdāng-yímiàn',
    hanviet: 'Độc đương nhất diện',
    category: 'Công việc, quản trị & Sự nghiệp',
    meaning: 'Một mình độc lập đảm đương một phương diện hay trọng trách lớn',
    literalMeaning: 'Một mình (独) ngăn chặn, gánh vác (当) một hướng trận địa (一面).',
    figurativeMeaning: 'Khen ngợi năng lực tự chủ tác chiến và bản lĩnh chỉ huy của nhân sự cấp cao.',
    usage: 'Làm vị ngữ hoặc định ngữ đánh giá cán bộ chủ chốt.',
    register: 'Trang trọng / Quản trị & Đánh giá',
    example: '经过几年的基层轮岗锻炼，他已经完全具备了独当一面的领导才能。',
    examplePinyin: 'Jīngguò jǐ nián de jīcéng lúngǎng duànliàn, tā yǐjīng wánquán jùbèi le dúdāng-yímiàn de lǐngdǎo cáinéng.',
    exampleMeaning: 'Qua vài năm rèn luyện luân chuyển ở cơ sở, anh ấy đã hoàn toàn sở hữu tài năng lãnh đạo đủ sức một mình đảm đương một hướng trọng trách.',
    relatedWords: {
      synonyms: ['挑起大梁', '独步一时', '自成一家'],
      antonyms: ['附庸风雅', '仰人鼻息', '无能为力']
    },
    commonMistakes: 'Đương (当) đọc thanh 1 (dāng), nghĩa là gánh vác đảm nhận.',
    origin: 'Sử Ký - Lưu Hầu thế gia: "Hán vương viết: Dữ ngô cộng thử giả, duy độc đương nhất diện nhĩ".',
    originSourceType: 'Điển cố lịch sử'
  },

  // ==========================================
  // NHÓM 3: XÃ HỘI, QUAN HỆ & ỨNG XỬ (10 THÀNH NGỮ)
  // ==========================================
  {
    id: 'cy-621',
    chengyu: '言行一致',
    pinyin: 'yánxíng-yízhì',
    hanviet: 'Ngôn hành nhất trí',
    category: 'Xã hội, quan hệ & Ứng xử',
    meaning: 'Lời nói đi đôi với việc làm, trước sau như một',
    literalMeaning: 'Lời nói (言) và hành động (行) hoàn toàn thống nhất (一致).',
    figurativeMeaning: 'Thước đo của người có chữ tín và nhân phẩm cao thượng trong các mối quan hệ xã hội.',
    usage: 'Làm vị ngữ, định ngữ biểu dương sự trung thực đáng tin cậy.',
    register: 'Trang trọng & Đạo đức',
    example: '在商业合作与人际交往中，言行一致是建立深层信任的基石。',
    examplePinyin: 'Zài shāngyè hézuò yǔ rénjì jiāowǎng zhōng, yánxíng-yízhì shì jiànlì shēncéng xìnrèn de jīshí.',
    exampleMeaning: 'Trong hợp tác thương mại và giao tiếp giữa người với người, lời nói đi đôi với việc làm chính là hòn đá tảng để thiết lập lòng tin tầng sâu.',
    relatedWords: {
      synonyms: ['表里如一', '言必信行必果', '名实相符'],
      antonyms: ['言行不一', '口是心非', '阳奉阴违']
    },
    commonMistakes: 'Hành (行) ở đây đọc là xíng (hành vi), không đọc là háng.',
    origin: 'Tuân Tử - Nho Hiệu: "Bất văn bất nhược văn chi, văn chi bất nhược kiến chi... ngôn hành nhất trí".',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-622',
    chengyu: '设身处地',
    pinyin: 'shèshēn-chǔdì',
    hanviet: 'Thiết thân xử địa',
    category: 'Xã hội, quan hệ & Ứng xử',
    meaning: 'Đặt mình vào hoàn cảnh của người khác để thấu cảm',
    literalMeaning: 'Đặt bản thân mình (设身) vào vị trí địa vị của người khác (处地).',
    figurativeMeaning: 'Kỹ năng thấu cảm và giao tiếp đỉnh cao: thấu hiểu nỗi khổ và góc nhìn của đối phương trước khi phê phán.',
    usage: 'Thường đi cùng phó từ "为……着想" (设身处地为对方着想).',
    register: 'Trang trọng & Tâm lý xã hội',
    example: '若能设身处地为对方考虑，许多看似无法调和的矛盾都能迎刃而解。',
    examplePinyin: 'Ruò néng shèshēn-chǔdì wèi duìfāng kǎolǜ, xǔduō kànsì wúfǎ tiáohé de máodùn dōu néng yíngrèn\'érjiě.',
    exampleMeaning: 'Nếu biết đặt mình vào hoàn cảnh của đối phương để suy nghĩ, nhiều mâu thuẫn tưởng như không thể hòa giải đều sẽ được tháo gỡ dễ dàng.',
    relatedWords: {
      synonyms: ['将心比心', '推己及人', '换位思考'],
      antonyms: ['自私自利', '漠不关心', '置身事外']
    },
    commonMistakes: 'Xử (处) đọc thanh 3 (chǔ), mang nghĩa ở tại vị trí đó.',
    origin: 'Chu Tử ngữ loại: "Nhân nhược năng thiết thân xử địa, tắc vạn sự giai bình".',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-623',
    chengyu: '彬彬有礼',
    pinyin: 'bīnbīn-yǒulǐ',
    hanviet: 'Bân bân hữu lễ',
    category: 'Xã hội, quan hệ & Ứng xử',
    meaning: 'Cư xử lịch thiệp, phong thái nho nhã có lễ phép',
    literalMeaning: 'Văn vẻ nho nhã (彬彬) và luôn tuân thủ lễ nghĩa phép tắc (有礼).',
    figurativeMeaning: 'Tác phong ứng xử chuẩn mực của bậc trí thức trong ngoại giao và nghi lễ quốc tế.',
    usage: 'Làm vị ngữ hoặc trạng ngữ miêu tả phong thái con người.',
    register: 'Trang trọng & Khen ngợi',
    example: '无论面对多么挑剔的客户，前台接待人员始终保持着彬彬有礼的态度。',
    examplePinyin: 'Wúlùn miànduì duōme tiāotì de kèhù, qiántái jiēdài rényuán shǐzhōng bǎochí zhe bīnbīn-yǒulǐ de tàidù.',
    exampleMeaning: 'Bất kể đối mặt với vị khách khó tính đến mức nào, nhân viên lễ tân tiếp đón luôn giữ vững thái độ lịch thiệp nhã nhặn.',
    relatedWords: {
      synonyms: ['温文尔雅', '雍容大雅', '和蔼可亲'],
      antonyms: ['蛮横无理', '粗暴野蛮', '出言不逊']
    },
    commonMistakes: 'Chữ 彬 gồm bộ Mộc (木) và ba nét Sam (彡), không viết nhầm thành 森.',
    origin: 'Sử Ký - Thái Sử Công tự tự: "Bân bân nhược anh tài, hữu lễ nhi bất vi".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-624',
    chengyu: '和睦相处',
    pinyin: 'hémù-xiāngchǔ',
    hanviet: 'Hòa mục tương xử',
    category: 'Xã hội, quan hệ & Ứng xử',
    meaning: 'Chung sống hòa thuận, thân thiện và êm ấm bên nhau',
    literalMeaning: 'Hòa nhã thân ái (和睦) cùng chung sống với nhau (相处).',
    figurativeMeaning: 'Mục tiêu xây dựng cộng đồng, xóm giềng, gia đình và quan hệ quốc tế hòa bình.',
    usage: 'Làm vị ngữ biểu thị mối quan hệ bình đẳng, ấm cúng.',
    register: 'Trang trọng & Xã hội',
    example: '社区应当营造包容多元的氛围，鼓励不同文化背景的居民和睦相处。',
    examplePinyin: 'Shèqū yīngdāng yíngzào bāoróng duōyuán de fēnwéi, gǔlì bùtóng wénhuà bèijǐng de jūmín hémù-xiāngchǔ.',
    exampleMeaning: 'Khu dân cư cần tạo dựng bầu không khí bao dung đa nguyên, khuyến khích các cư dân có bối cảnh văn hóa khác nhau cùng chung sống hòa thuận êm ấm.',
    relatedWords: {
      synonyms: ['天伦之乐', '安居乐业', '和平共处'],
      antonyms: ['同室操戈', '针锋相对', '反目成仇']
    },
    commonMistakes: 'Mục (睦) có bộ Mục (目 - mắt thân thiện), không viết nhầm thành 穆.',
    origin: 'Tả Truyện - Thành Công thập lục niên: "Huynh đệ hòa mục, dĩ ngự ngoại vũ".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-625',
    chengyu: '恰如其分',
    pinyin: 'qiàrú-qífèn',
    hanviet: 'Kháp như kỳ phận',
    category: 'Xã hội, quan hệ & Ứng xử',
    meaning: 'Vừa vặn thích đáng, chuẩn xác không thừa không thiếu',
    literalMeaning: 'Vừa đúng (恰) như chừng mực phân lượng vốn có của sự việc (其分).',
    figurativeMeaning: 'Khả năng đánh giá, phê bình hoặc khen ngợi đúng người đúng tội, đạt mức trung dung hoàn hảo.',
    usage: 'Làm vị ngữ, định ngữ hoặc trạng ngữ chỉ mức độ thích hợp.',
    register: 'Trang trọng & Văn học',
    example: '点评文艺作品时，既不能过分拔高，也不可随意贬低，应当给出恰如其分的评价。',
    examplePinyin: 'Diǎnpíng wényì zuòpǐn shí, jì bù néng guòfèn bágāo, yě bùkě suíyì biǎndī, yīngdāng gěichū qiàrú-qífèn de píngjià.',
    exampleMeaning: 'Khi nhận xét một tác phẩm văn nghệ, vừa không được tâng bốc quá đà, vừa chẳng thể tùy tiện hạ thấp, mà phải đưa ra một đánh giá vừa vặn thích đáng.',
    relatedWords: {
      synonyms: ['恰到好处', '不偏不倚', '中规中矩'],
      antonyms: ['过犹不及', '矫枉过正', '过分夸大']
    },
    commonMistakes: 'Chữ 分 ở đây đọc thanh 4 (fèn), mang nghĩa bổn phận, phân lượng.',
    origin: 'Chu Tử toàn thư - Luận Ngữ: "Kháp như kỳ phận, vô sở quá, vô sở bất cập".',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-626',
    chengyu: '同舟共济',
    pinyin: 'tóngzhōu-gòngjì',
    hanviet: 'Đồng chu cộng tế',
    category: 'Xã hội, quan hệ & Ứng xử',
    meaning: 'Cùng chung một con thuyền vượt qua sóng gió bão bùng',
    literalMeaning: 'Cùng ngồi chung chiếc thuyền (同舟), cùng nhau chèo chống vượt sông bão dữ (共济).',
    figurativeMeaning: 'Tinh thần tương trợ, sát cánh bên nhau lúc gặp nghịch cảnh hiểm nghèo.',
    usage: 'Làm vị ngữ, định ngữ hiệu triệu tinh thần đoàn kết.',
    register: 'Trang trọng & Ngoại giao',
    example: '面对全球气候变暖的挑战，世界各国必须同舟共济，共同守护人类的地球家园。',
    examplePinyin: 'Miànduì quánqiú qìhòu biànnuǎn de tiǎozhàn, shìjiè gèguó bìxū tóngzhōu-gòngjì, gòngtóng shǒuhù rénlèi de dìqiú jiāyuán.',
    exampleMeaning: 'Đối diện với thách thức nóng lên của khí hậu toàn cầu, các quốc gia trên thế giới nhất thiết phải cùng chung một thuyền vượt qua sóng gió, chung tay bảo vệ ngôi nhà Trái Đất của nhân loại.',
    relatedWords: {
      synonyms: ['风雨同舟', '休戚与共', '患难与共'],
      antonyms: ['各奔前程', '落井下石', '分道扬镳']
    },
    commonMistakes: 'Tế (济) nghĩa là vượt sông hiểm trở, không viết nhầm thành 际.',
    origin: 'Tôn Tử Binh Pháp - Cửu Địa: "Phù Ngô nhân dữ Việt nhân tương ố dã, đương kỳ đồng chu nhi tế ngộ phong, kỳ tương cứu dã như tả hữu thủ".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-627',
    chengyu: '推己及人',
    pinyin: 'tuījǐ-jírén',
    hanviet: 'Thôi kỷ cập nhân',
    category: 'Xã hội, quan hệ & Ứng xử',
    meaning: 'Suy từ lòng mình ra lòng người, lấy lòng mình đối đãi mọi người',
    literalMeaning: 'Suy xét từ chính bản thân mình (推己) mà đối đãi thấu hiểu đến người khác (及人).',
    figurativeMeaning: 'Cốt lõi của chữ "Nhân" trong đạo Nho: kỷ sở bất dục, vật thi ư nhân.',
    usage: 'Làm vị ngữ hoặc trạng ngữ tu dưỡng đạo đức.',
    register: 'Trang trọng & Triết lý',
    example: '学会推己及人，我们就能在日常交流中多一分包容，少一分无谓的指责。',
    examplePinyin: 'Xuéhuì tuījǐ-jírén, wǒmen jiù néng zài rìcháng jiāoliú zhōng duō yì fēn bāoróng, shǎo yì fēn wúwèi de zhǐzé.',
    exampleMeaning: 'Học được cách suy từ lòng mình ra lòng người, chúng ta sẽ có thêm một phần bao dung trong giao tiếp thường nhật và bớt đi một phần chỉ trích vô cớ.',
    relatedWords: {
      synonyms: ['设身处地', '将心比心', '反求诸己'],
      antonyms: ['以己度人', '独断专行', '自私自利']
    },
    commonMistakes: 'Khác với "以己度人" (thường mang sắc thái tiêu cực: lấy bụng dạ hẹp hòi của mình đo người khác).',
    origin: 'Mạnh Tử - Lương Huệ Vương thượng: "Thôi ân túc dĩ bảo tứ hải, bất thôi ân vô dĩ bảo thê tử".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-628',
    chengyu: '礼尚往来',
    pinyin: 'lǐshàng-wǎnglái',
    hanviet: 'Lễ thượng vãng lai',
    category: 'Xã hội, quan hệ & Ứng xử',
    meaning: 'Có qua có lại mới toại lòng nhau, tôn trọng phép tắc giao tế',
    literalMeaning: 'Lễ nghĩa coi trọng (尚) sự qua lại giao hảo song phương (往来).',
    figurativeMeaning: 'Quy tắc ứng xử văn minh trong giao lưu quà cáp, thăm hỏi và hợp tác ngoại giao.',
    usage: 'Làm vị ngữ, định ngữ trong quan hệ đối ngoại và ngoại giao.',
    register: 'Trang trọng & Phong tục',
    example: '国际交往讲究礼尚往来，互相尊重国家主权是深化外交关系的前提。',
    examplePinyin: 'Guójì jiāowǎng jiǎngjiu lǐshàng-wǎnglái, hùxiāng zūnzhòng guójiā zhǔquán shì shēnhuà wàijiāo guānxì de qiántí.',
    exampleMeaning: 'Giao lưu quốc tế coi trọng lễ nghĩa có qua có lại, tôn trọng chủ quyền quốc gia của nhau là tiền đề để làm sâu sắc thêm quan hệ ngoại giao.',
    relatedWords: {
      synonyms: ['投桃报李', '互通有无', '来而不往非礼也'],
      antonyms: ['一毛不拔', '只进不出', '忘恩负义']
    },
    commonMistakes: 'Thượng (尚) ở đây nghĩa là coi trọng, tôn sùng, không phải là "lên trên".',
    origin: 'Lễ Ký - Khúc Lễ thượng: "Lễ thượng vãng lai. Vãng nhi bất lai, phi lễ dã; lai nhi bất vãng, diệc phi lễ dã".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-629',
    chengyu: '求同存异',
    pinyin: 'qiútóng-cúnyì',
    hanviet: 'Cầu đồng tồn dị',
    category: 'Xã hội, quan hệ & Ứng xử',
    meaning: 'Tìm kiếm điểm tương đồng, bảo lưu các điểm khác biệt',
    literalMeaning: 'Mưu cầu sự thống nhất điểm chung (求同), giữ lại bảo lưu sự bất đồng (存异).',
    figurativeMeaning: 'Phương châm đàm phán và chung sống hòa bình trong môi trường đa phương phức tạp.',
    usage: 'Làm vị ngữ, định ngữ cốt lõi trong chính trị ngoại giao.',
    register: 'Trang trọng / Ngoại giao & Đàm phán',
    example: '在多边贸易谈判中，各方本着求同存异的原则，最终签署了互利合作框架协议。',
    examplePinyin: 'Zài duōbiān màoyì tánpàn zhōng, gè fāng běnzhe qiútóng-cúnyì de yuánzé, zuìzhōng qiānshǔ le hùlì hézuò kuàngjià xiéyì.',
    exampleMeaning: 'Trong đàm phán thương mại đa phương, các bên dựa trên nguyên tắc tìm kiếm điểm chung bảo lưu khác biệt, cuối cùng đã ký kết hiệp định khung hợp tác đôi bên cùng có lợi.',
    relatedWords: {
      synonyms: ['和平共处', '兼收并蓄', '协调并进'],
      antonyms: ['求全责备', '水火不容', '非此即彼']
    },
    commonMistakes: 'Dị (异) là sự khác biệt, không viết thành 疑 (nghi ngờ).',
    origin: 'Tuyên bố ngoại giao Hội nghị Bandung năm 1955 của Thủ tướng Chu Ân Lai.',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-630',
    chengyu: '互谅互让',
    pinyin: 'hùliàng-hùràng',
    hanviet: 'Hỗ lượng hỗ nhượng',
    category: 'Xã hội, quan hệ & Ứng xử',
    meaning: 'Cùng thông cảm thấu hiểu và cùng nhượng bộ lẫn nhau',
    literalMeaning: 'Cùng thông cảm thể tất (互谅), cùng nhường nhịn nhượng bộ (互让).',
    figurativeMeaning: 'Thái độ thiện chí hóa giải xung đột quyền lợi để đạt được thỏa hiệp bền vững.',
    usage: 'Làm vị ngữ, trạng ngữ giải quyết tranh chấp.',
    register: 'Trang trọng & Đàm phán',
    example: '商业纠纷的解决需要双方互谅互让，若一味坚持诉讼，只会两败俱伤。',
    examplePinyin: 'Shāngyè jiūfēn de jiějué xūyào shuāngfāng hùliàng-hùràng, ruò yíwèi jiānchí sùsòng, zhǐ huì liǎngbàijùshāng.',
    exampleMeaning: 'Việc giải quyết tranh chấp thương mại cần hai bên cùng thông cảm và nhượng bộ lẫn nhau, nếu chỉ khăng khăng kiện tụng thì chỉ khiến cả đôi bên cùng chịu thiệt hại.',
    relatedWords: {
      synonyms: ['各让一步', '握手言和', '化干戈为玉帛'],
      antonyms: ['针锋相对', '寸步不让', '你死我活']
    },
    commonMistakes: 'Lượng (谅) là tha thứ, lượng thứ thông cảm.',
    origin: 'Nguyên tắc hòa giải tranh chấp dân sự và đàm phán thương mại quốc tế.',
    originSourceType: 'Đúc kết triết học'
  },

  // ==========================================
  // NHÓM 4: NGHỊ LỰC, CẢM XÚC & PHẨM CHẤT (10 THÀNH NGỮ)
  // ==========================================
  {
    id: 'cy-631',
    chengyu: '卧薪尝胆',
    pinyin: 'wòxīn-chángdǎn',
    hanviet: 'Ngọa tân thường đổng',
    category: 'Nghị lực, cảm xúc & Phẩm chất',
    meaning: 'Nằm gai nếm mật, nhẫn nhục chịu đựng để phục thù báo quốc',
    literalMeaning: 'Nằm ngủ trên đống củi đóm (卧薪), nếm mật đắng mỗi sáng (尝胆).',
    figurativeMeaning: 'Ý chí kiên cường không chịu khuất phục trước nghịch cảnh, nuôi chí lớn phục thù hoặc phục hưng sự nghiệp.',
    usage: 'Làm vị ngữ, định ngữ ca ngợi tinh thần vượt khó phi thường.',
    register: 'Trang trọng / Điển cố lịch sử',
    example: '经历了这次惨痛的创业失败，他决定卧薪尝胆，潜心攻读技术，期待东山再起。',
    examplePinyin: 'Jīnglì le zhè cì cǎntòng de chuàngyè shībài, tā juédìng wòxīn-chángdǎn, qiánxīn gōngdú jìshù, qīdài dōngshān-zàiqǐ.',
    exampleMeaning: 'Trải qua lần thất bại khởi nghiệp đau đớn này, anh ấy quyết định nằm gai nếm mật, dồn hết tâm trí dùi mài kỹ thuật, mong chờ ngày trở lại vẻ vang.',
    relatedWords: {
      synonyms: ['奋发图强', '励精图治', '忍辱负重'],
      antonyms: ['自暴自弃', '得过且过', '醉生梦死']
    },
    commonMistakes: 'Tân (薪) là củi đóm thô ráp, không phải là tiền lương.',
    origin: 'Sử Ký - Việt Vương Câu Tiễn thế gia: Câu Tiễn chịu nhục làm nô lệ cho Ngô vương, về nước nằm trên củi gai, nếm mật đắng để không quên nỗi nhục nước mất.',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-632',
    chengyu: '破釜沉舟',
    pinyin: 'pòfǔ-chénzhōu',
    hanviet: 'Phá phủ trầm chu',
    category: 'Nghị lực, cảm xúc & Phẩm chất',
    meaning: 'Đập nồi dìm thuyền, quyết tử chiến đấu không màng đường lui',
    literalMeaning: 'Đập vỡ hết nồi nấu ăn (破釜), đánh chìm hết thuyền bè qua sông (沉舟).',
    figurativeMeaning: 'Quyết tâm đến cùng, đặt bản thân vào thế tuyệt cảnh để bùng nổ sức mạnh chiến thắng lớn.',
    usage: 'Làm vị ngữ, định ngữ biểu thị quyết tâm sắt đá.',
    register: 'Trang trọng / Điển cố lịch sử',
    example: '面对生死存亡的关键战役，公司决定破釜沉舟，将所有可用资金押注于下一代芯片研发。',
    examplePinyin: 'Miànduì shēngsǐ-cúnwáng de guānjiàn zhànyì, gōngsī juédìng pòfǔ-chénzhōu, jiāng suǒyǒu kěyòng zījīn yāzhù yú xià yí dài xīnpiàn yánfā.',
    exampleMeaning: 'Đối diện với trận chiến quyết định sống còn, công ty quyết định đập nồi dìm thuyền, dồn toàn bộ nguồn vốn khả dụng đặt cược vào việc nghiên cứu chip thế hệ tiếp theo.',
    relatedWords: {
      synonyms: ['背水一战', '义无反顾', '破釜绝粮'],
      antonyms: ['瞻前顾后', '优柔寡断', '举棋不定']
    },
    commonMistakes: 'Phủ (釜) là nồi nấu bằng kim loại thời cổ, không viết nhầm thành 斧 (rìu).',
    origin: 'Sử Ký - Hạng Vũ bản kỷ: Trận Cự Lộc, Hạng Vũ đem quân qua sông Chương rồi đập vỡ hết nồi niêu, đục chìm hết thuyền bè, chỉ mang lương ăn 3 ngày, tướng sĩ dũng mãnh lấy 1 chọi 10 đại phá quân Tần.',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-633',
    chengyu: '塞翁失马',
    pinyin: 'sàiwēng-shīmǎ',
    hanviet: 'Tái ông thất mã',
    category: 'Nghị lực, cảm xúc & Phẩm chất',
    meaning: 'Tái ông mất ngựa, trong rủi có may, họa phúc xoay vần',
    literalMeaning: 'Ông lão nơi biên ải (塞翁) bị mất đi con ngựa tốt (失马).',
    figurativeMeaning: 'Thái độ lạc quan điềm tĩnh trước biến cố: chuyện rủi ro trước mắt chưa chắc là điều xấu, ngược lại may mắn chưa chắc là phúc trọn vẹn.',
    usage: 'Thường dùng thành cụm "塞翁失马，焉知非福".',
    register: 'Trang trọng / Ngụ ngôn triết học',
    example: '失去了这份工作固然遗憾，但塞翁失马，焉知非福，它正好为你提供了创业的契机。',
    examplePinyin: 'Shīqù le zhè fèn gōngzuò gùrán yíhàn, dàn sàiwēng-shīmǎ, yān zhī fēi fú, tā zhènghǎo wèi nǐ tígōng le chuàngyè de qìjī.',
    exampleMeaning: 'Mất đi công việc này quả thực đáng tiếc, nhưng tái ông mất ngựa biết đâu lại là phúc, nó vừa vặn mở ra cho bạn một cơ hội khởi nghiệp tuyệt vời.',
    relatedWords: {
      synonyms: ['失之东隅，收之桑榆', '因祸得福', '否极泰来'],
      antonyms: ['乐极生悲', '祸不单行', '雪上加霜']
    },
    commonMistakes: 'Không nói "塞翁失马是一件坏事", vì bản chất nó nhấn mạnh sự chuyển hóa biện chứng giữa họa và phúc.',
    origin: 'Hoài Nam Tử - Nhân gian huấn: Ông già biên giới mất ngựa, sau đó ngựa dắt theo đàn ngựa quý về; con trai cưỡi ngựa gãy chân, nhờ đó thoát khỏi nạn bắt lính chết trận.',
    originSourceType: 'Ngụ ngôn dân gian'
  },
  {
    id: 'cy-634',
    chengyu: '百折不挠',
    pinyin: 'bǎizhé-bùnáo',
    hanviet: 'Bách chiết bất nạo',
    category: 'Nghị lực, cảm xúc & Phẩm chất',
    meaning: 'Dù trăm lần vấp ngã vẫn không khuất phục sờn lòng',
    literalMeaning: 'Uốn cong gãy gập hàng trăm lần (百折) vẫn không hề nhụt chí đầu hàng (不挠).',
    figurativeMeaning: 'Phẩm chất kiên định quật cường phi thường của con người trước nghịch cảnh khắc nghiệt.',
    usage: 'Làm vị ngữ, định ngữ hoặc trạng ngữ khen ngợi ý chí anh dũng.',
    register: 'Trang trọng & Ca ngợi',
    example: '凭借着百折不挠的坚强意志，科学家们终于在深海勘探领域取得了突破性进展。',
    examplePinyin: 'Píngjiè zhe bǎizhé-bùnáo de jiānqiáng yìzhì, kēxuéjiā men zhōngyú zài shēnhǎi kāntàn lǐngyù qǔdé le tūpòxìng jìnzhǎn.',
    exampleMeaning: 'Nhờ vào ý chí kiên cường trăm lần ngã không sờn lòng, các nhà khoa học cuối cùng đã đạt được tiến triển mang tính đột phá trong lĩnh vực thăm dò đáy biển sâu.',
    relatedWords: {
      synonyms: ['坚韧不拔', '坚定不移', '死里求生'],
      antonyms: ['知难而退', '一蹶不振', '半途而废']
    },
    commonMistakes: 'Nạo (挠) có nghĩa là uốn cong, nhụt chí, không đọc là ráo.',
    origin: 'Hán thư - Tự truyện: "Bách chiết bất nạo, lâm đại tiết nhi bất khả đoạt".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-635',
    chengyu: '迎难而上',
    pinyin: 'yíngnán\'érshàng',
    hanviet: 'Nghênh nan nhi thượng',
    category: 'Nghị lực, cảm xúc & Phẩm chất',
    meaning: 'Thấy khó khăn không lùi bước mà chủ động tiến lên chinh phục',
    literalMeaning: 'Đón đầu khó khăn hiểm trở (迎难) mà xốc tới xông lên (而上).',
    figurativeMeaning: 'Tinh thần dũng cảm, chủ động đối diện và hóa giải thử thách hiểm nghèo.',
    usage: 'Làm vị ngữ, trạng ngữ hiệu triệu hành động.',
    register: 'Trang trọng / Chính sách & Động viên',
    example: '在经济结构调整的关键时期，广大企业应当迎难而上，积极开拓新兴市场。',
    examplePinyin: 'Zài jīngjì jiégòu tiáozhěng de guānjiàn shíqī, guǎngdà qǐyè yīngdāng yíngnán\'érshàng, jījí kāituò xīnxīng shìchǎng.',
    exampleMeaning: 'Trong thời kỳ then chốt điều chỉnh cơ cấu kinh tế, đông đảo doanh nghiệp cần đón đầu thử thách tiến lên phía trước, tích cực khai phá thị trường mới nổi.',
    relatedWords: {
      synonyms: ['勇往直前', '知难而进', '无所畏惧'],
      antonyms: ['畏缩不前', '知难而退', '望而生畏']
    },
    commonMistakes: 'Không nói "迎难而下", chỉ có "迎难而上".',
    origin: 'Đúc kết từ tư tưởng lãnh đạo vượt khủng hoảng hiện đại.',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-636',
    chengyu: '自强不息',
    pinyin: 'zìqiáng-bùxī',
    hanviet: 'Tự cường bất tức',
    category: 'Nghị lực, cảm xúc & Phẩm chất',
    meaning: 'Tự lực tự cường, không ngừng nỗ lực vươn lên không ngừng nghỉ',
    literalMeaning: 'Tự mình làm cho mình mạnh mẽ (自强), không bao giờ ngừng lại (不息).',
    figurativeMeaning: 'Triết lý nhân sinh nền tảng của văn hóa Á Đông: chủ động làm chủ vận mệnh, không ỷ lại trông chờ.',
    usage: 'Làm vị ngữ, định ngữ phương châm sống.',
    register: 'Trang trọng / Triết học kinh điển',
    example: '自强不息是中华民族历经磨难而生生不息的精神支柱。',
    examplePinyin: 'Zìqiáng-bùxī shì Zhōnghuá mínzú lìjīng mónàn ér shēngshēng-bùxī de jīngshén zhīzhù.',
    exampleMeaning: 'Tự cường không ngừng nghỉ chính là trụ cột tinh thần giúp dân tộc Trung Hoa trải qua muôn vàn gian nan mà vẫn trường tồn sinh sôi nảy nở.',
    relatedWords: {
      synonyms: ['奋发图强', '生生不息', '自力更生'],
      antonyms: ['自甘堕落', '自暴自弃', '虚度年华']
    },
    commonMistakes: 'Tức (息) ở đây nghĩa là dừng lại, ngừng nghỉ, không phải là tin tức.',
    origin: 'Kinh Dịch - Càn quái tượng truyện: "Thiên hành kiện, quân tử dĩ tự cường bất tức".',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-637',
    chengyu: '临危不惧',
    pinyin: 'línwēi-bújù',
    hanviet: 'Lâm nguy bất cụ',
    category: 'Nghị lực, cảm xúc & Phẩm chất',
    meaning: 'Đối mặt với hiểm nguy cận kề mà không hề hoảng sợ',
    literalMeaning: 'Đứng trước bờ vực nguy hiểm (临危), tâm thế không hề sợ hãi (不惧).',
    figurativeMeaning: 'Bản lĩnh thép và sự tỉnh táo phi thường của bậc dũng tướng và phi hành đoàn khi xử lý sự cố.',
    usage: 'Làm vị ngữ hoặc trạng ngữ khen ngợi lòng can đảm.',
    register: 'Trang trọng & Khen ngợi',
    example: '当客机在空中遭遇严重气流颠簸时，机长临危不惧，成功化解了一场空中危机。',
    examplePinyin: 'Dāng kèjī zài kōngzhōng zāoyù yánzhòng qìliú diānbǒ shí, jīzhǎng línwēi-bújù, chénggōng huàjiě le yì chǎng kōngzhōng wēijī.',
    exampleMeaning: 'Khi máy bay chở khách gặp phải nhiễu động không khí dữ dội trên không trung, cơ trưởng vẫn đối mặt hiểm nguy không hề nao núng, hóa giải thành công một cuộc khủng hoảng trên không.',
    relatedWords: {
      synonyms: ['从容不迫', '泰然处之', '大义凛然'],
      antonyms: ['惊慌失措', '闻风丧胆', '六神无主']
    },
    commonMistakes: 'Cụ (惧) có nghĩa là sợ hãi, e dè.',
    origin: 'Trang Tử - Thu Thủy: "Lâm nguy bất cụ giả, dũng giả chi sự dã".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-638',
    chengyu: '心平气和',
    pinyin: 'xīnpíng-qìhé',
    hanviet: 'Tâm bình khí hòa',
    category: 'Nghị lực, cảm xúc & Phẩm chất',
    meaning: 'Tâm tính bình thản, lời lẽ ôn hòa điềm đạm',
    literalMeaning: 'Trái tim bình thản (心平), khí sắc hơi thở ôn hòa dịu dàng (气和).',
    figurativeMeaning: 'Thái độ bình tĩnh giải quyết xung đột bằng lý trí, không để cảm xúc kích động chi phối.',
    usage: 'Làm vị ngữ, trạng ngữ trong đối thoại.',
    register: 'Trang trọng & Giao tiếp',
    example: '双方只有心平气和地坐下来倾听彼此诉求，谈判才能取得建设性成果。',
    examplePinyin: 'Shuāngfāng zhǐyǒu xīnpíng-qìhé de zuò xiàlái qīngtīng bǐcǐ sùqiú, tánpàn cáinéng qǔdé jiànshèxìng chéngguǒ.',
    exampleMeaning: 'Chỉ khi hai bên cùng bình tâm hòa khí ngồi lại lắng nghe nguyện vọng của nhau, cuộc đàm phán mới có thể gặt hái được thành quả mang tính xây dựng.',
    relatedWords: {
      synonyms: ['平心静气', '心泰身宁', '不动声色'],
      antonyms: ['暴跳如雷', '大发雷霆', '心浮气躁']
    },
    commonMistakes: 'Tránh dùng khi biểu thị sự thờ ơ lạnh lùng.',
    origin: 'Tác phẩm đạo học đời Tống của Chu Hi về phép dưỡng sinh tu dưỡng nội tâm.',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-639',
    chengyu: '见义勇为',
    pinyin: 'jiànyì-yǒngwéi',
    hanviet: 'Kiến nghĩa dũng vi',
    category: 'Nghị lực, cảm xúc & Phẩm chất',
    meaning: 'Thấy việc nghĩa dũng cảm đứng ra làm',
    literalMeaning: 'Nhìn thấy việc chính nghĩa hợp đạo lý (见义), liền dũng cảm hành động (勇为).',
    figurativeMeaning: 'Phẩm chất hiệp nghĩa, không quản hiểm nguy xông vào cứu giúp người bị nạn.',
    usage: 'Làm vị ngữ, định ngữ trong văn phong pháp luật và biểu dương công dân.',
    register: 'Trang trọng / Đạo đức & Pháp luật',
    example: '他跳入冰冷刺骨的河水中救起落水儿童，这种见义勇为的高尚品德令人肃然起敬。',
    examplePinyin: 'Tā tiào rù bīnglěng cìgǔ de héshuǐ zhōng jiù qǐ luòshuǐ értóng, zhè zhǒng jiànyì-yǒngwéi de gāoshàng pǐndé lìng rén sùrán-qǐjìng.',
    exampleMeaning: 'Anh ấy đã nhảy xuống dòng nước sông lạnh thấu xương để cứu sống đứa trẻ bị rơi xuống nước, phẩm đức cao đẹp thấy việc nghĩa dũng cảm làm này khiến ai nấy đều kính phục.',
    relatedWords: {
      synonyms: ['挺身而出', '舍己为人', '匡扶正义'],
      antonyms: ['见死不救', '坐视不管', '袖手旁观']
    },
    commonMistakes: 'Nghĩa (义) ở đây là việc công chính hợp đạo đức, không dùng cho việc liều lĩnh trái luật.',
    origin: 'Luận Ngữ - Vi Chính: "Kiến nghĩa bất vi, vô dũng dã".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-640',
    chengyu: '光明磊落',
    pinyin: 'guāngmíng-lěiluò',
    hanviet: 'Quang minh lỗi lạc',
    category: 'Nghị lực, cảm xúc & Phẩm chất',
    meaning: 'Quang minh chính đại, ngay thẳng đàng hoàng không một chút khuất tất',
    literalMeaning: 'Ánh sáng rực rỡ (光明), sừng sững như đá xếp ngay ngắn vững vàng (磊落).',
    figurativeMeaning: 'Nhân cách trong sạch, hành vi minh bạch, không thẹn với lương tâm.',
    usage: 'Làm vị ngữ hoặc định ngữ đánh giá nhân cách.',
    register: 'Trang trọng & Đạo đức',
    example: '做人应当胸怀坦荡、光明磊落，绝不在背后搞见不得人的阴谋诡计。',
    examplePinyin: 'Zuòrén yīngdāng xiōnghuái tǎndàng, guāngmíng-lěiluò, jué bú zài bèihòu gǎo jiàn bù dé rén de yīnmóu guǐjì.',
    exampleMeaning: 'Làm người cần phải lòng dạ bao la, quang minh chính đại, tuyệt đối không được giở trò âm mưu quỷ kế mờ ám sau lưng người khác.',
    relatedWords: {
      synonyms: ['胸怀坦白', '光明正大', '正大光明'],
      antonyms: ['居心叵测', '鬼鬼祟祟', '卑鄙无耻']
    },
    commonMistakes: 'Lỗi (磊) gồm ba chữ Thạch (石), Lạc (落) có bộ Thảo (艹).',
    origin: 'Tấn thư - Thạch Lặc tái ký: "Đại trượng phu hành sự, đương lũy lạc quang minh, như nhật nguyệt đại thiên".',
    originSourceType: 'Điển cố lịch sử'
  },

  // ==========================================
  // NHÓM 5: CHIẾN LƯỢC, KINH TẾ & ĐÀM PHÁN (10 THÀNH NGỮ)
  // ==========================================
  {
    id: 'cy-641',
    chengyu: '争分夺秒',
    pinyin: 'zhēngfēn-duómiǎo',
    hanviet: 'Tranh phân đoạt miểu',
    category: 'Chiến lược, kinh tế & Đàm phán',
    meaning: 'Tranh thủ từng phút từng giây, chạy đua ráo riết với thời gian',
    literalMeaning: 'Tranh giành từng phút (争分), giật lấy từng giây (夺秒).',
    figurativeMeaning: 'Tác phong khẩn trương, thần tốc trong sản xuất công nghiệp, ứng cứu thảm họa hay mở rộng thị trường.',
    usage: 'Làm trạng ngữ hoặc vị ngữ chỉ sự khẩn trương cấp bách.',
    register: 'Trang trọng & Thời sự',
    example: '救援队伍正在争分夺秒地抢救被困群众，每一分钟都关乎生命的安危。',
    examplePinyin: 'Jiùyuán duìwù zhèngzài zhēngfēn-duómiǎo de qiǎngjiù bèi kùn qúnzhòng, měi yì fēnzhōng dōu guānhū shēngmìng de ānwēi.',
    exampleMeaning: 'Đội ngũ cứu hộ đang tranh thủ từng phút từng giây giải cứu quần chúng bị mắc kẹt, mỗi một phút trôi qua đều can hệ mật thiết tới an nguy sinh mạng.',
    relatedWords: {
      synonyms: ['分秒必争', '只争朝夕', '雷厉风行'],
      antonyms: ['虚度光阴', '消磨时间', '慢条斯理']
    },
    commonMistakes: 'Chữ Miểu (秒) có bộ Hòa (禾), chỉ đơn vị thời gian giây.',
    origin: 'Văn phong tin tức báo chí và chỉ đạo sản xuất kinh tế hiện đại.',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-642',
    chengyu: '千载难逢',
    pinyin: 'qiānzǎi-nánféng',
    hanviet: 'Thiên tải nan phùng',
    category: 'Chiến lược, kinh tế & Đàm phán',
    meaning: 'Ngàn năm khó gặp, cơ hội hiếm có nghìn năm có một',
    literalMeaning: 'Một ngàn năm (千载) khó lòng tao ngộ tao phùng (难逢).',
    figurativeMeaning: 'Thời cơ vàng trong kinh doanh, đàm phán hay học tập mà nếu bỏ lỡ sẽ không bao giờ có lại.',
    usage: 'Làm định ngữ đứng trước danh từ (千载难逢的良机 / 机遇).',
    register: 'Trang trọng / Kinh tế & Cơ hội',
    example: '共建跨境自由贸易区，是促进两国经贸腾飞千载难逢的战略机遇。',
    examplePinyin: 'Gòngjiàn kuàjìng zìyóu màoyì qū, shì cùjìn liǎng guó jīng-mào téngfēi qiānzǎi-nánféng de zhànlüè jīyù.',
    exampleMeaning: 'Cùng xây dựng khu mậu dịch tự do xuyên biên giới chính là cơ hội chiến lược ngàn năm có một nhằm thúc đẩy kinh tế thương mại hai nước cất cánh.',
    relatedWords: {
      synonyms: ['千载一时', '百年不遇', '间不容发'],
      antonyms: ['司空见惯', '屡见不鲜', '比比皆是']
    },
    commonMistakes: 'Tải (载) ở đây đọc thanh 3 (zǎi), mang nghĩa là năm tháng (nghìn năm).',
    origin: 'Văn Tuyển - Hàn Dũ "Triều Châu thứ sử tạ thượng biểu": "Thiên tải nhất thời, bất khả phùng dã".',
    originSourceType: 'Tác phẩm văn học cổ điển'
  },
  {
    id: 'cy-643',
    chengyu: '刻不容缓',
    pinyin: 'kèbùrónghuǎn',
    hanviet: 'Khắc bất dung hoãn',
    category: 'Chiến lược, kinh tế & Đàm phán',
    meaning: 'Vô cùng khẩn cấp, không thể chậm trễ dù chỉ một khoảnh khắc',
    literalMeaning: 'Một khắc thời gian ngắn ngủi (刻) cũng không cho phép trì hoãn (不容缓).',
    figurativeMeaning: 'Mức độ ưu tiên cao nhất trong xử lý khủng hoảng truyền thông hoặc tái cấu trúc chuỗi cung ứng.',
    usage: 'Làm vị ngữ hoặc định ngữ tình thế khẩn cấp.',
    register: 'Trang trọng / Tin tức & Đàm phán',
    example: '随着原材料供应链出现中断风险，寻找替代货源的工作已是刻不容缓。',
    examplePinyin: 'Suízhe yuáncáiliào gōngyìngliàn chūxiàn zhōngduàn fēngxiǎn, zhǎoxún tìdài huòyuán de gōngzuò yǐ shì kèbùrónghuǎn.',
    exampleMeaning: 'Trước nguy cơ đứt gãy chuỗi cung ứng nguyên vật liệu, công tác tìm kiếm nguồn hàng thay thế đã là việc khẩn cấp không thể chậm trễ.',
    relatedWords: {
      synonyms: ['迫在眉睫', '燃眉之急', '火烧眉毛'],
      antonyms: ['优哉游哉', '遥遥无期', '从容不迫']
    },
    commonMistakes: 'Khắc (刻) là đơn vị đo 15 phút thời cổ, hoãn (缓) là chậm chạp trì trệ.',
    origin: 'Tống sử - Chương Trạch truyện: "Sự thế như thử, khắc bất dung hoãn hĩ".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-644',
    chengyu: '稍纵即逝',
    pinyin: 'shāozòng-jíshì',
    hanviet: 'Sảo túng tức thệ',
    category: 'Chiến lược, kinh tế & Đàm phán',
    meaning: 'Thoảng qua trong gang tấc, buông lỏng một chút là vụt mất',
    literalMeaning: 'Hơi buông lơi (稍纵) là lập tức biến mất vùn vụt (即逝).',
    figurativeMeaning: 'Tính chất thoáng qua của thời cơ thị trường: nếu do dự không quyết định nhanh sẽ hối tiếc.',
    usage: 'Làm vị ngữ hoặc định ngữ của cơ hội, cảm hứng.',
    register: 'Trang trọng / Văn học & Kinh tế',
    example: '在金融二级市场上，套利交易的窗口期稍纵即逝，极其考验操盘手的敏锐直觉。',
    examplePinyin: 'Zài jīnróng èrjí shìchǎng shàng, tàolì jiāoyì de chuāngkǒuqī shāozòng-jíshì, jíqí kǎoyàn cāopánshǒu de mǐnruì zhíjué.',
    exampleMeaning: 'Trên thị trường tài chính thứ cấp, khung thời gian giao dịch chênh lệch giá thoảng qua trong chớp mắt, thử thách cực độ trực giác nhạy bén của nhà điều hành.',
    relatedWords: {
      synonyms: ['光阴似箭', '转瞬即逝', '昙花一现'],
      antonyms: ['旷日持久', '天长地久', '坚如磐石']
    },
    commonMistakes: 'Thệ (逝) nghĩa là trôi đi mất, có bộ Sước (辶), không viết thành 誓 (thề thốt).',
    origin: 'Tô Thức - "Văn Dữ Khả họa mặc trúc phái": "Chấn phong vãng vãng, sảo túng tắc thệ hĩ".',
    originSourceType: 'Tác phẩm văn học cổ điển'
  },
  {
    id: 'cy-645',
    chengyu: '互惠互利',
    pinyin: 'hùhuì-hùlì',
    hanviet: 'Hỗ huệ hỗ lợi',
    category: 'Chiến lược, kinh tế & Đàm phán',
    meaning: 'Đôi bên cùng có lợi, bình đẳng tương hỗ hợp tác cùng thắng',
    literalMeaning: 'Cùng mang lại ân huệ (互惠), cùng chia sẻ lợi ích thiết thực (互利).',
    figurativeMeaning: 'Nguyên tắc vàng của thương mại quốc tế (Win-Win): không bên nào bị chèn ép, quan hệ lâu dài.',
    usage: 'Làm vị ngữ, định ngữ hoặc mục tiêu đàm phán hợp đồng.',
    register: 'Trang trọng / Thương mại & Ngoại giao',
    example: '本着互惠互利的合作理念，我们愿与贵司在清洁能源领域开展全方位战略合作。',
    examplePinyin: 'Běnzhe hùhuì-hùlì de hézuò lǐniàn, wǒmen yuàn yǔ guì sī zài qīngjié néngyuán lǐngyù kāizhǎn quán-fāngwèi zhànlüè hézuò.',
    exampleMeaning: 'Trên tinh thần hợp tác đôi bên cùng có lợi, chúng tôi sẵn sàng triển khai hợp tác chiến lược toàn diện cùng quý công ty trong lĩnh vực năng lượng sạch.',
    relatedWords: {
      synonyms: ['合作共赢', '相得益彰', '互利双赢'],
      antonyms: ['损人利己', '两败俱伤', '损公肥私']
    },
    commonMistakes: 'Huệ (惠) nghĩa là lợi ích, ơn nghĩa, không viết nhầm thành 慧 (trí tuệ).',
    origin: 'Nguyên tắc cơ bản trong Luật thương mại quốc tế và quan hệ ngoại giao hiện đại.',
    originSourceType: 'Đúc kết triết học'
  },
  {
    id: 'cy-646',
    chengyu: '纸上谈兵',
    pinyin: 'zhǐshàng-tánbīng',
    hanviet: 'Chỉ thượng đàm binh',
    category: 'Chiến lược, kinh tế & Đàm phán',
    meaning: 'Bàn việc quân trên giấy, lý thuyết suông xa rời thực tiễn',
    literalMeaning: 'Nói chuyện việc quân đánh trận (谈兵) chỉ dựa trên trang giấy (纸上).',
    figurativeMeaning: 'Phê phán người chỉ giỏi lý thuyết suông nhưng thiếu kinh nghiệm thực tế, khi áp dụng gây tổn thất lớn.',
    usage: 'Làm vị ngữ hoặc định ngữ có tính cảnh tỉnh nghiêm khắc.',
    register: 'Trang trọng / Điển cố lịch sử',
    example: '脱离了实际市场调研的商业计划书，无论包装得多么精美，都不过是纸上谈兵。',
    examplePinyin: 'Tuōlí le shíjì shìchǎng diàoyán de shāngyè jìhuàshū, wúlùn bāozhuāng de duōme jīngměi, dōu búguò shì zhǐshàng-tánbīng.',
    exampleMeaning: 'Bản kế hoạch kinh doanh tách rời khỏi khảo sát thị trường thực tế thì dù có được đóng gói đẹp mắt đến đâu cũng chỉ là bàn việc quân trên giấy mà thôi.',
    relatedWords: {
      synonyms: ['空中楼阁', '画饼充饥', '闭门造车'],
      antonyms: ['身经百战', '脚踏实地', '实事求是']
    },
    commonMistakes: 'Chỉ (纸) là tờ giấy, không nói "书上谈兵".',
    origin: 'Sử Ký - Liêm Pha Lịch Nhĩ truyện: Triệu Quát từ nhỏ đọc làu binh thư của cha, bàn chuyện dùng binh thao thao bất tuyệt, nhưng khi ra trận Trường Bình máy móc đã khiến 40 vạn quân Triệu bị Bạch Khởi vùi lấp.',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-647',
    chengyu: '锦上添花',
    pinyin: 'jǐnshàng-tiānhuā',
    hanviet: 'Cẩm thượng thiêm hoa',
    category: 'Chiến lược, kinh tế & Đàm phán',
    meaning: 'Thêu hoa trên gấm, làm cho cái vốn đã rực rỡ lại càng rực rỡ tốt đẹp hơn',
    literalMeaning: 'Trên tấm gấm vóc ngũ sắc tươi đẹp (锦上) thêu thêm những đóa hoa tươi (添花).',
    figurativeMeaning: 'Gia tăng thêm giá trị và sự hoàn hảo cho một thành tựu vốn đã rất thành công.',
    usage: 'Làm vị ngữ hoặc định ngữ, đối sánh với "雪中送炭" (giúp đỡ lúc hoạn nạn).',
    register: 'Trang trọng & Khen ngợi',
    example: '这项权威国际认证的获得，为我们产品的海外上市起到了锦上添花的效果。',
    examplePinyin: 'Zhè xiàng quánwēi guójì rènzhèng de huòdé, wèi wǒmen chǎnpǐn de hǎiwài shàngshì qǐdào le jǐnshàng-tiānhuā de xiàoguǒ.',
    exampleMeaning: 'Việc đạt được chứng nhận quốc tế uy tín này đã tạo nên hiệu quả thêu hoa trên gấm cho màn ra mắt hải ngoại của sản phẩm chúng tôi.',
    relatedWords: {
      synonyms: ['精益求精', '如虎添翼', '画龙点睛'],
      antonyms: ['雪上加霜', '画蛇添足', '火上浇油']
    },
    commonMistakes: 'Cẩm (锦) có bộ Kim (钅), không viết nhầm thành 绵 (bông sợi).',
    origin: 'Vương An Thạch thời Tống - "Tạ an bình tự": "Cẩm thượng thiêm hoa sự sự tân".',
    originSourceType: 'Tác phẩm văn học cổ điển'
  },
  {
    id: 'cy-648',
    chengyu: '画龙点睛',
    pinyin: 'huàlóng-diǎnjīng',
    hanviet: 'Họa long điểm tinh',
    category: 'Chiến lược, kinh tế & Đàm phán',
    meaning: 'Vẽ rồng chấm mắt, nét chấm phá quyết định làm bừng sáng toàn bộ tác phẩm',
    literalMeaning: 'Vẽ con rồng (画龙) rồi chấm một nét vào con ngươi mắt (点睛).',
    figurativeMeaning: 'Thêm một chi tiết then chốt, một khẩu hiệu đắt giá hay một câu kết luận làm tác phẩm, bài phát biểu hoặc chiến dịch tỏa sáng.',
    usage: 'Làm vị ngữ, định ngữ ca ngợi sự tài hoa tinh tế.',
    register: 'Trang trọng / Nghệ thuật & Diễn thuyết',
    example: '报告结尾处的这句总结堪称画龙点睛，瞬间拔高了整篇分析的战略格局。',
    examplePinyin: 'Bàogào jiéwěi chù de zhè jù zǒngjié kānchēng huàlóng-diǎnjīng, shùnjiān bágāo le zhěng piān fēnxī de zhànlüè géjú.',
    exampleMeaning: 'Câu kết luận ở phần cuối báo cáo xứng đáng gọi là vẽ rồng điểm mắt, ngay lập tức nâng tầm tầm vóc chiến lược của toàn bộ bài phân tích.',
    relatedWords: {
      synonyms: ['点石成金', '神来之笔', '妙笔生花'],
      antonyms: ['画蛇添足', '弄巧成拙', '狗尾续貂']
    },
    commonMistakes: 'Tinh (睛) là con ngươi mắt có bộ Mục (目), tuyệt đối không viết thành 晴 (trời nắng) hay 精 (tinh thần).',
    origin: 'Lịch đại danh họa ký - Trương Tăng Do thời Lương: Vẽ 4 con rồng trên tường chùa An Lạc không chấm mắt vì bảo chấm mắt rồng sẽ bay mất. Người ta không tin ép chấm thử, chấm mắt xong sấm sét nổ vang, 2 con rồng phá tường bay thẳng lên trời.',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-649',
    chengyu: '居安思危',
    pinyin: 'jū\'ān-sīwēi',
    hanviet: 'Cư an tư nguy',
    category: 'Chiến lược, kinh tế & Đàm phán',
    meaning: 'Lúc yên ổn phải nghĩ đến lúc nguy nan hiểm nghèo',
    literalMeaning: 'Ở nơi bình yên an toàn (居安) mà trong lòng luôn lường trước mối nguy hại (思危).',
    figurativeMeaning: 'Tầm nhìn quản trị rủi ro chiến lược: không ngủ quên trên chiến thắng, luôn chuẩn bị phương án dự phòng.',
    usage: 'Làm vị ngữ, định ngữ hoặc khẩu hiệu quản trị doanh nghiệp.',
    register: 'Trang trọng / Chiến lược & Triết học',
    example: '企业在盈利巅峰期依然要保持居安思危的忧患意识，持续加大技术储备。',
    examplePinyin: 'Qǐyè zài yínglì diānfēng qī yīrán yào bǎochí jū\'ān-sīwēi de yōuhuàn yìshí, chíxù jiàdà jìshù chǔbèi.',
    exampleMeaning: 'Doanh nghiệp trong thời kỳ lợi nhuận đỉnh cao vẫn cần duy trì ý thức lo xa lúc yên nghĩ đến lúc nguy, không ngừng gia tăng dự trữ công nghệ.',
    relatedWords: {
      synonyms: ['未雨绸缪', '防患未然', '有备无患'],
      antonyms: ['高枕无忧', '盲目乐观', '临渴掘井']
    },
    commonMistakes: 'Không dùng trong ngữ cảnh tiêu cực bi quan thái quá.',
    origin: 'Tả Truyện - Tương Công thập nhất niên: "Cư an tư nguy, tư tắc hữu bị, hữu bị vô hoạn".',
    originSourceType: 'Điển cố lịch sử'
  },
  {
    id: 'cy-650',
    chengyu: '登峰造极',
    pinyin: 'dēngfēng-zàojí',
    hanviet: 'Đăng phong tạo cực',
    category: 'Chiến lược, kinh tế & Đàm phán',
    meaning: 'Trèo lên đỉnh cao nhất, đạt tới cảnh giới tột cùng hoàn mỹ',
    literalMeaning: 'Leo lên đỉnh núi cao nhất (登峰), đạt tới giới hạn cùng cực (造极).',
    figurativeMeaning: 'Khen ngợi học vấn, kỹ nghệ chế tác hoặc nghệ thuật biểu diễn đạt cảnh giới bậc thầy vô song.',
    usage: 'Làm vị ngữ, bổ ngữ hoặc định ngữ mức độ tinh thông tột bậc.',
    register: 'Trang trọng / Nghệ thuật & Tôn vinh',
    example: '他的书法技艺已达登峰造极之境，每一笔每一划都流淌着深厚的文化底蕴。',
    examplePinyin: 'Tā de shūfǎ jìyì yǐ dá dēngfēng-zàojí zhī jìng, měi yì bǐ měi yí huà dōu liútǎng zhe shēnhòu de wénhuà dǐyùn.',
    exampleMeaning: 'Kỹ nghệ thư pháp của ông ấy đã đạt tới cảnh giới đỉnh cao tột cùng, mỗi một nét bút đều tuôn trào bề dày nội hàm văn hóa sâu sắc.',
    relatedWords: {
      synonyms: ['无与伦比', '出神入化', '叹为观止'],
      antonyms: ['平淡无奇', '初出茅庐', '略知一二']
    },
    commonMistakes: 'Có thể dùng với nghĩa xấu châm biếm khi nói về thói hư tật xấu đến cực điểm.',
    origin: 'Thế thuyết tân ngữ - Văn học: "Lưu Doãn kiến sái diễm, thán viết: Thử đăng phong tạo cực giả dã".',
    originSourceType: 'Điển cố lịch sử'
  }
];

/**
 * Tra cứu thành ngữ theo chữ Hán hoặc ID
 */
export function getHsk6IdiomById(idOrChengyu) {
  if (!idOrChengyu) return null;
  return HSK6_IDIOMS_DATABASE.find(
    c => c.id === idOrChengyu || c.chengyu === idOrChengyu
  ) || null;
}

/**
 * Lấy danh sách thành ngữ theo nhóm chủ đề
 */
export function getHsk6IdiomsByCategory(category) {
  if (!category) return HSK6_IDIOMS_DATABASE;
  return HSK6_IDIOMS_DATABASE.filter(c => c.category === category);
}
