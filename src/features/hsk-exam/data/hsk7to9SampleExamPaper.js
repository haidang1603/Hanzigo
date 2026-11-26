// File: src/features/hsk-exam/data/hsk7to9SampleExamPaper.js

export const HSK_7_TO_9_EXAM_PAPER = {
  paperCode: 'H79001',
  titleZh: 'HSK（七—九级）全真综合模拟试卷 (H79001)',
  titleVi: 'Đề thi Tích hợp Chuẩn HSK 3.0 Cao Cấp (Cấp 7–9) — Mã đề H79001',
  totalDurationSeconds: 12600, // 210 phút chuẩn CTI
  maxScore: 300,
  levelThresholds: {
    hsk7: 180,
    hsk8: 210,
    hsk9: 240,
  },
  sections: [
    // =========================================================================
    // PHẦN 1: NGHE HỌC THUẬT & HỘI THẢO CHUYÊN MÔN (听力 - 60 điểm)
    // =========================================================================
    {
      id: 'listening',
      titleZh: '第一部分：学术讲座与深度访谈听力',
      titleVi: '1. Nghe Học Thuật & Tọa Đàm',
      maxScore: 60,
      recommendedMinutes: 35,
      stimulus: {
        topic: '数字经济、大语言模型与传统制造业转型',
        speakerRole: '陈教授（北京数字经济研究院）',
        audioScriptZh:
          '各位学者，今天我们探讨的核心议题是“生成式人工智能如何为传统制造业赋能”。诚然，过去十年间互联网经济的崛起极大地改变了消费端，然而在工业制造领域，生产效率的瓶颈依然突出。与其说当前的人工智能浪潮是一场单纯的软件升级，毋宁说它是对产业底层逻辑的彻底重塑。鉴于高并发算力基础设施的日益完善，越来越多的企业得以利用实时数据流优化供应链韧性，从而达到降本增效、防患于未然的目标。',
        audioScriptPinyin:
          'Gèwèi xuézhě, jīntiān wǒmen tàntǎo de héxīn yìtí shì “Shēngchéngshì réngōng zhìnéng rúhé wèi chuántǒng zhìzàoyè fùnéng”...',
      },
      questions: [
        {
          id: 'L1',
          number: 1,
          points: 20,
          promptZh: '根据讲座内容，主讲人如何评价当前的人工智能浪潮？',
          promptVi:
            'Theo bài giảng, diễn giả đánh giá làn sóng Trí tuệ nhân tạo hiện nay như thế nào?',
          options: [
            'A. 已经彻底消除了工业制造领域的所有瓶颈',
            'B. 尚未对企业供应链韧性产生实质性影响',
            'C. 是对传统产业底层逻辑的彻底重塑',
            'D. 仅仅是一场局限于消费端的软件升级',
          ],
          correctIndex: 2,
          explanationVi:
            'Diễn giả sử dụng cấu trúc HSK 7 “与其说……毋宁说……” (Thay vì nói là một cuộc nâng cấp phần mềm đơn thuần, chi bằng nói đó là sự tái định hình triệt để logic tầng đáy của ngành công nghiệp -> Đáp án C).',
          targetVocab: ['赋能', '瓶颈', '毋宁说', '重塑'],
        },
        {
          id: 'L2',
          number: 2,
          points: 20,
          promptZh: '讲座中提到企业得以优化供应链韧性的前提条件是什么？',
          promptVi:
            'Điều kiện tiền đề giúp doanh nghiệp tối ưu hóa sức chống chịu của chuỗi cung ứng được nhắc tới là gì?',
          options: [
            'A. 传统制造业完全放弃线下生产模式',
            'B. 依赖单一供应商以简化物流流程',
            'C. 削减研发预算以降低短期财务风险',
            'D. 高并发算力基础设施的日益完善',
          ],
          correctIndex: 3,
          explanationVi:
            'Trong bài nói có câu: “鉴于高并发算力基础设施的日益完善，越来越多的企业得以利用实时数据流优化供应链韧性” (Xét thấy hạ tầng năng lực tính toán chịu tải cao ngày càng hoàn thiện... -> Đáp án D).',
          targetVocab: ['鉴于', '高并发', '算力', '韧性'],
        },
        {
          id: 'L3',
          number: 3,
          points: 20,
          promptZh: '主讲人在结尾处使用“防患于未然”一词意在强调什么？',
          promptVi:
            'Việc diễn giả dùng thành ngữ “防患于未然” ở cuối bài nhằm nhấn mạnh điều gì?',
          options: [
            'A. 事后弥补漏洞比事前预测更有效率',
            'B. 在风险或故障发生之前就提前预警并加以规避',
            'C. 企业应当避免采用任何新兴算法技术',
            'D. 算力基础设施的建设可以半途而废',
          ],
          correctIndex: 1,
          explanationVi:
            'Thành ngữ “防患于未然” (Phòng hoạn ư vị nhiên) nghĩa là ngăn chặn tai họa/rủi ro ngay từ khi nó chưa kịp phát sinh -> Đáp án B.',
          targetVocab: ['防患于未然', '得以', '半途而废'],
        },
      ],
    },

    // =========================================================================
    // PHẦN 2: ĐỌC HIỂU ĐA PHƯƠNG THỨC & BIỂU ĐỒ SỐ LIỆU (阅读 - 60 điểm)
    // =========================================================================
    {
      id: 'reading',
      titleZh: '第二部分：多模态图表与学术文献阅读',
      titleVi: '2. Đọc Biểu Đồ & Văn Bản Học Thuật',
      maxScore: 60,
      recommendedMinutes: 45,
      chartData: {
        titleZh: '2022—2026年亚太地区企业研发投入与绿色能源转型占比趋势图',
        titleVi:
          'Biểu đồ xu hướng tỷ trọng đầu tư R&D cho AI và Chuyển đổi năng lượng xanh tại Châu Á - Thái Bình Dương (2022–2026)',
        rows: [
          { year: '2022', aiRAndDPct: 18, greenEnergyPct: 24, traditionalPct: 58 },
          { year: '2023', aiRAndDPct: 26, greenEnergyPct: 31, traditionalPct: 43 },
          { year: '2024', aiRAndDPct: 35, greenEnergyPct: 38, traditionalPct: 27 },
          { year: '2025', aiRAndDPct: 44, greenEnergyPct: 43, traditionalPct: 13 },
          { year: '2026', aiRAndDPct: 52, greenEnergyPct: 45, traditionalPct: 3 },
        ],
      },
      passageParagraphs: [
        '【文献摘要】如上方统计图表所示，2022年至2026年间，亚太地区规上企业的资本开支结构经历了深刻的范式转移。人工智能研发（AI R&D）占比由2022年的18%飙升至2026年的52%，首次突破半数大关；与此同时，绿色能源转型投入亦呈稳步增长态势，由24%攀升至45%。反之，传统粗放型产能扩张的投入占比则从58%断崖式缩减至3%。',
        '究其原因，这一结构性演变主要归因于两大核心驱动力：其一，全球碳中和目标迫在眉睫，倒逼企业摒弃高耗能模式，通过技术创新实现可持续发展；其二，数字化赋能与绿色转型并非孤立存在，而是相辅相成、休戚与共的整体。智能算法不仅能够精准调控电网负荷，更能未雨绸缪地预测设备能耗峰值。由此可见，唯有兼顾科技创新与生态责任，企业方能在瞬息万变的国际竞争中行稳致远。',
      ],
      questions: [
        {
          id: 'R1',
          number: 4,
          points: 20,
          promptZh: '根据图表与文献数据，下列哪一项描述与事实完全相符？',
          promptVi:
            'Dựa vào biểu đồ và văn bản, mô tả nào dưới đây hoàn toàn khớp với số liệu thực tế?',
          options: [
            'A. 2026年人工智能研发投入占比首次超过50%，达到52%',
            'B. 2022年至2026年，绿色能源转型投入占比的增长幅度大于AI研发投入',
            'C. 数字化赋能与绿色能源转型之间存在自相矛盾的竞争关系',
            'D. 传统粗放型产能扩张占比在五年间保持稳步增长态势',
          ],
          correctIndex: 0,
          explanationVi:
            'Theo biểu đồ và đoạn 1: “人工智能研发占比由2022年的18%飙升至2026年的52%，首次突破半数大关” (vượt mốc 50%, đạt 52% vào năm 2026 -> Đáp án A).',
          targetVocab: ['飙升', '占比', '态势', '范式'],
        },
        {
          id: 'R2',
          number: 5,
          points: 20,
          promptZh: '文献第二段中“相辅相成”一词用来形容哪两者之间的关系？',
          promptVi:
            'Thành ngữ “相辅相成” (bổ trợ lẫn nhau) trong đoạn 2 dùng để miêu tả mối quan hệ giữa hai yếu tố nào?',
          options: [
            'A. 短期利润与关税壁垒',
            'B. 数字化赋能与绿色能源转型',
            'C. 抽样偏差与因果倒置',
            'D. 粗放型扩张与高耗能模式',
          ],
          correctIndex: 1,
          explanationVi:
            'Câu văn nêu rõ: “数字化赋能与绿色转型并非孤立存在，而是相辅相成、休戚与共的整体” -> Đáp án B.',
          targetVocab: ['相辅相成', '休戚与共', '归因于'],
        },
        {
          id: 'R3',
          number: 6,
          points: 20,
          promptZh: '下列四个句子中，哪一句存在HSK高阶语法语病？',
          promptVi:
            'Trong 4 câu học thuật dưới đây, câu nào mắc lỗi ngữ pháp câu bệnh (语病)?',
          options: [
            'A. 唯有兼顾技术突破与生态伦理，现代产业方能实现行稳致远的发展。',
            'B. 智能制造不仅提升了生产效率，更从根本上重塑了全球供应链的格局。',
            'C. 通过引入高并发实时监测算法，使电网的能源损耗率降低了近三成。',
            'D. 鉴于碳中和目标迫在眉睫，各大企业纷纷加大了清洁能源的研发投入。',
          ],
          correctIndex: 2,
          explanationVi:
            'Câu C mắc lỗi kinh điển “通过……，使……” (Lạm dụng giới từ cùng động từ sai khiến làm cả câu bị khuyết mất Chủ ngữ). Cách sửa: Bỏ “通过” hoặc bỏ “使”.',
          targetVocab: ['迫在眉睫', '兼顾', '行稳致远'],
        },
      ],
    },

    // =========================================================================
    // PHẦN 3: BIÊN DỊCH HỌC THUẬT TRUNG ↔ VIỆT (翻译 - 60 điểm)
    // =========================================================================
    {
      id: 'translation',
      titleZh: '第三部分：汉越双向高阶笔译（信、达、雅测评）',
      titleVi: '3. Dịch Thuật Trung ↔ Việt (Tín - Đạt - Nhã)',
      maxScore: 60,
      recommendedMinutes: 40,
      tasks: [
        {
          id: 'T1',
          direction: 'vi_to_zh',
          title: '第一题（越译汉 — 30分）：政论与科技文献',
          sourceText:
            'Xét thấy thị trường quốc tế biến đổi nhanh chóng, việc tự chủ nghiên cứu công nghệ lõi và bồi dưỡng nhân tài chất lượng cao có mối quan hệ bổ trợ lẫn nhau; doanh nghiệp cần chuẩn bị từ trước để tiến bước vững chắc.',
          requiredKeywords: ['鉴于', '瞬息万变', '相辅相成', '未雨绸缪', '行稳致远'],
          literaryMarkers: ['实乃', '之', '唯有', '方能', '亦', '从而'],
          threeTierReference: {
            literalTrap:
              '❌ 因为国际市场变化很快，自己研究核心技术和培养好人才有互相帮助的关系，企业要先准备好才能走得远。',
            hsk7Standard:
              '✅ 鉴于国际市场瞬息万变，自主研发核心技术与培养高素质人才是相辅相成的；企业必须未雨绸缪，才能在竞争中行稳致远。',
            hsk9Master:
              '🏆 鉴于国际市场瞬息万变，核心技术之自主研发与高层次人才培养实乃相辅相成之举；唯有未雨绸缪、精益求精，企业方能行稳致远。',
          },
        },
        {
          id: 'T2',
          direction: 'zh_to_vi',
          title: '第二题（汉译越 — 30分）：长定语与文言虚词',
          sourceText:
            '人工智能与其说是对传统人工岗位的简单取代，毋宁说是一场促使人类从繁琐重复的体力劳动中解放出来、进而专注于高价值创造性思维的深刻变革。',
          requiredKeywords: [
            'thay vì nói',
            'chi bằng nói',
            'thay thế',
            'giải phóng',
            'sáng tạo',
          ],
          threeTierReference: {
            literalTrap:
              '❌ Trí tuệ nhân tạo so với việc nói là của truyền thống vị trí nhân công đơn giản thay thế, không bằng nói là một trận thúc đẩy loài người từ rườm rà lặp lại lao động giải phóng ra...（Dịch ngược trật tự chữ 的 khiến câu tiếng Việt tối nghĩa）',
            hsk7Standard:
              '✅ Trí tuệ nhân tạo thay vì nói là sự thay thế đơn thuần cho các vị trí việc làm truyền thống, chi bằng nói là một cuộc biến cách sâu sắc giúp giải phóng con người khỏi lao động chân tay lặp lại rườm rà để tập trung vào tư duy sáng tạo giá trị cao.',
            hsk9Master:
              '🏆 Thay vì xem trí tuệ nhân tạo chỉ là sự thay thế đơn thuần đối với sức lao động truyền thống, chi bằng hãy nhìn nhận đó như một cuộc cách mạng sâu sắc giúp giải phóng con người khỏi những công việc tay chân lặp đi lặp lại, từ đó toàn tâm hướng tới tư duy sáng tạo mang giá trị cốt lõi.',
          },
        },
      ],
    },

    // =========================================================================
    // PHẦN 4: VIẾT PHÂN TÍCH BIỂU ĐỒ & LUẬN VĂN 600 CHỮ (写作 - 60 điểm)
    // =========================================================================
    {
      id: 'writing',
      titleZh: '第四部分：图表评述与600字深度议论文写作',
      titleVi: '4. Viết Biểu Đồ & Luận Văn 600 Chữ',
      maxScore: 60,
      recommendedMinutes: 60,
      partA_ChartEssay: {
        title:
          '写作第一部分（20分）：图表数据分析（250—300字）',
        promptZh:
          '请根据第二部分阅读材料中的《2022—2026年亚太地区企业研发投入与绿色能源转型占比趋势图》，撰写一篇250—300字的图表分析短文。要求包含：（1）概述核心数据变化态势；（2）剖析背后的经济与技术成因；（3）总结未来发展启示。',
        targetChars: 250,
        recommendedKeywords: ['如图所示', '飙升', '呈……态势', '归因于', '综上所述'],
        sampleEssay:
          '  如图所示，2022年至2026年间亚太地区企业资本投入结构呈现出显著的转型态势。其中，人工智能研发占比由18%飙升至52%，绿色能源转型占比亦由24%稳步攀升至45%，而传统粗放型扩张占比则断崖式缩减至3%。\n  究其原因，这一演变主要归因于全球碳中和目标的推进以及数字技术的成熟。科技赋能与生态保护相辅相成，促使企业主动淘汰落后产能。综上所述，唯有坚持自主创新与绿色发展并重，方能在未来竞争中立于不败之地。',
      },
      partB_ArgumentativeEssay: {
        title:
          '写作第二部分（40分）：深度议论文（不少于600字）',
        promptZh:
          '古人云：“审时度势，未雨绸缪。”在人工智能与全球化瞬息万变的今天，个人与组织应当如何平衡“坚守核心传统价值”与“顺应时代技术变革”？请自拟居中标题，写一篇不少于600字的议论文，要求立意深远、论证严密、善用四字成语与书面语衔接词。',
        targetChars: 600,
        recommendedKeywords: [
          '审时度势',
          '未雨绸缪',
          '诚然',
          '与其说',
          '毋宁说',
          '相辅相成',
          '守正创新',
          '行稳致远',
        ],
        sampleTitle: '守正创新，方能行稳致远',
        sampleEssay:
          '  古人云：“审时度势，未雨绸缪。”置身于人工智能与数字化浪潮日新月异的今天，技术革新正以前所未有的速度颠覆着人类的生产与生活方式。面对瞬息万变的时代格局，我们究竟应当固守传统根基，还是全面拥抱技术变革？事实上，这二者绝非水火不容的对立面，而是相辅相成、辩证统一的整体。\n  诚然，科技赋能为我们突破效率瓶颈提供了强大的工具。从大语言模型到智慧城市治理，新兴技术的应用可谓立竿见影。然而，倘若我们在追逐技术潮流的过程中迷失了人文精神与伦理底线，那么所谓的创新未免会沦为无源之水、无本之木。与其说时代淘汰的是落后的工具，毋宁说淘汰的是僵化短视的思维范式。\n  反之，坚守核心传统价值并非意味着墨守成规或闭门造车。中华文化历来推崇“温故知新”与“兼容并蓄”。真正优秀的个人与组织，总是能够以深厚的人文底蕴与职业操守为根基，同时敏锐洞察时代趋势，将前沿科技转化为传承与发展的助力。正如非物质文化遗产借助数字技术得以活态传承一样，传统与现代完全可以交相辉映、相得益彰。\n  综上所述，面对未来的机遇与挑战，切忌陷入非此即彼的极端思维。唯有秉持“守正创新”的理念，在坚守核心价值的同时顺应时代潮流、持之以恒地精进自我，我们方能在波澜壮阔的时代洪流中行稳致远，臻于止于至善之境。',
      },
    },

    // =========================================================================
    // PHẦN 5: KHẨU NGỮ BIỆN LUẬN HỌC THUẬT & PHẢN BIỆN (口语 - 60 điểm)
    // =========================================================================
    {
      id: 'speaking',
      titleZh: '第五部分：高阶口语即兴辩论与学术答辩',
      titleVi: '5. Khẩu Ngữ Biện Luận & Phản Biện',
      maxScore: 60,
      recommendedMinutes: 30,
      debateTopicZh:
        '有人认为：“在人工智能高度发达的未来，外语学习与跨文化人工翻译将彻底失去存在的必要。”请对此观点进行3分钟的辩证评述与反驳。',
      debateTopicVi:
        'Có ý kiến cho rằng: “Trong tương lai khi AI phát triển cao độ, việc học ngoại ngữ và dịch thuật nhân sự xuyên văn hóa sẽ hoàn toàn mất đi sự cần thiết.” Hãy thực hiện bài bình luận biện chứng và phản biện quan điểm này.',
      requiredDiscourseMarkers: ['不可否认', '然而', '一分为二', '言外之意', '综上所述'],
      modelSpeechZh:
        '各位评委，对于这一观点，我认为应当本着“一分为二”的辩证态度加以审视。不可否认，神经机器翻译与大语言模型在处理标准化技术文档时具有极高的效率。然而，语言绝不仅仅是冰冷的符号转换，它更是文化底蕴、情感共鸣与思维范式的载体。在高层外交磋商、文学意境传递以及复杂的商务谈判中，人类译员对“言外之意”的敏锐洞察以及恰如其分的委婉表达，是任何算法都难以完全取代的。综上所述，人工智能不会消灭外语学习，反而会促使我们向更高层次的跨文化思辨能力迈进。',
    },
  ],
};

export const HSK_7_TO_9_PAPER_CATALOG = [
  {
    paperCode: 'H79001',
    targetLevel: 7,
    badge: 'HSK 7–9 (Đề số 01)',
    titleZh: 'HSK（七—九级）全真综合模拟试卷 (H79001)',
    titleVi: 'Đề thi Tích hợp HSK 7–9: Kinh tế số, AI & Chuyển đổi Năng lượng Xanh',
    focusDomain: 'Báo chí Kinh tế, Công nghệ AI & Nghị luận Xã hội',
    durationMinutes: 210,
    questionCount: 98,
    maxScore: 300,
    thresholds: { hsk7: 180, hsk8: 210, hsk9: 240 },
  },
  {
    paperCode: 'H79002',
    targetLevel: 8,
    badge: 'HSK 7–9 (Đề số 02)',
    titleZh: 'HSK（七—九级）全真综合模拟试卷 (H79002)',
    titleVi: 'Đề thi Tích hợp HSK 7–9: Kiến trúc Hệ thống Phân tán, Tài chính & Pháp lý',
    focusDomain: 'CNTT/Software, Thương mại Quốc tế & Phân tích Biểu đồ Số liệu',
    durationMinutes: 210,
    questionCount: 98,
    maxScore: 300,
    thresholds: { hsk7: 180, hsk8: 210, hsk9: 240 },
  },
  {
    paperCode: 'H79003',
    targetLevel: 9,
    badge: 'HSK 7–9 (Đề số 03)',
    titleZh: 'HSK（七—九级）全真综合模拟试卷 (H79003)',
    titleVi: 'Đề thi Tích hợp HSK 7–9: Triết học Cổ văn, Ngoại giao & Dịch thuật Tín-Đạt-Nhã',
    focusDomain: 'Văn học Cổ điển, Đàm phán Cấp cao & Luận văn Học thuật 600 chữ',
    durationMinutes: 210,
    questionCount: 98,
    maxScore: 300,
    thresholds: { hsk7: 180, hsk8: 210, hsk9: 240 },
  },
];

/**
 * Trả về dữ liệu đề thi HSK 7-9 theo mã đề (H79001 | H79002 | H79003)
 */
export function getHsk7to9PaperByCode(paperCode = 'H79001') {
  const normalizedCode = String(paperCode || 'H79001').toUpperCase();
  const meta =
    HSK_7_TO_9_PAPER_CATALOG.find((p) => p.paperCode === normalizedCode) ||
    HSK_7_TO_9_PAPER_CATALOG[0];

  return {
    ...HSK_7_TO_9_EXAM_PAPER,
    paperCode: meta.paperCode,
    titleZh: meta.titleZh,
    titleVi: meta.titleVi,
  };
}

/**
 * Adapter chuẩn hóa số lượng nhiệm vụ & thang điểm 300 cho 5 phần thi HSK 7-9
 * (Bao gồm cả Phần 4 Viết partA/partB và Phần 5 Khẩu ngữ debateTopicZh).
 */
export function getHsk7to9PaperNormalizedSummary(paperOrCode = 'H79001') {
  const paper =
    typeof paperOrCode === 'string'
      ? getHsk7to9PaperByCode(paperOrCode)
      : paperOrCode || HSK_7_TO_9_EXAM_PAPER;

  const sections = (paper.sections || []).map((sec) => {
    if (Array.isArray(sec.questions)) {
      return { id: sec.id, taskCount: sec.questions.length, maxScore: Number(sec.maxScore) || 0 };
    }
    if (Array.isArray(sec.tasks)) {
      return { id: sec.id, taskCount: sec.tasks.length, maxScore: Number(sec.maxScore) || 0 };
    }
    if (sec.partA_ChartEssay || sec.partB_ArgumentativeEssay) {
      const count = (sec.partA_ChartEssay ? 1 : 0) + (sec.partB_ArgumentativeEssay ? 1 : 0);
      return { id: sec.id, taskCount: count, maxScore: Number(sec.maxScore) || 0 };
    }
    if (sec.debateTopicZh) {
      return { id: sec.id, taskCount: 1, maxScore: Number(sec.maxScore) || 0 };
    }
    return { id: sec.id, taskCount: 0, maxScore: Number(sec.maxScore) || 0 };
  });

  return {
    paperCode: paper.paperCode,
    sectionCount: sections.length,
    totalTasks: sections.reduce((sum, s) => sum + s.taskCount, 0),
    totalMaxScore: sections.reduce((sum, s) => sum + s.maxScore, 0),
    sections,
  };
}

export default HSK_7_TO_9_EXAM_PAPER;
