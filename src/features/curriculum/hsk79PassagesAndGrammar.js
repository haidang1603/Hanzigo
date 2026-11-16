// =========================================================================
// HANZIGO HSK 7-9 MODULE PASSAGES (12/12) & GRAMMAR AST MATRIX (60/60)
// Eliminates 100% generic fallbacks across Modules 7.1–9.4 and Lessons 121–180
// =========================================================================

import { HSK_7_TO_9_GRAMMAR_AST_MAP } from './hsk7to9LexiconAndGrammarBank.js';

export const MODULE_PASSAGE_TEMPLATES = {
  '7.1': {
    paragraphsZh: [
      '在全球经济数字化浪潮的推动下，数字经济已不再仅仅停留在消费互联网层面，而是全面向制造、物流与金融等核心产业深度赋能，成为推动经济结构转型升级的关键引擎。',
      '然而，产业转型的推进过程并非一帆风顺。技术研发瓶颈尚且制约着部分中小企业的升级步伐，何况宏观环境波动叠加合规成本居高不下，更凸显了稳健调控与未雨绸缪的紧迫性。',
      '因此，政府引导与企业创新必须相辅相成。唯有持续打破制度与技术壁垒，充分激发内需潜力并优化供应链韧性，区域经济方能跻身高质量发展行列，实现持久的互利共赢。',
    ],
    translationVi:
      'Dưới sức đẩy của làn sóng số hóa kinh tế toàn cầu, kinh tế số không còn dừng ở tầng internet tiêu dùng mà đang tiếp sức sâu rộng cho sản xuất, logistics và tài chính, trở thành động cơ then chốt thúc đẩy chuyển đổi cơ cấu ngành. Tuy nhiên, tiến trình chuyển đổi không hề bằng phẳng: nút thắt nghiên cứu công nghệ còn đang kìm hãm bước tiến của doanh nghiệp vừa và nhỏ, huống hồ biến động vĩ mô cộng hưởng cùng chi phí tuân thủ neo cao càng làm nổi bật tính cấp bách của điều tiết ổn định và phòng bị từ sớm. Do đó, dẫn dắt chính sách và đổi mới doanh nghiệp phải bổ trợ lẫn nhau để kiến tạo tăng trưởng bền vững.',
  },
  '7.2': {
    paragraphsZh: [
      '以生成式人工智能为代表的新一代信息技术正以前所未有的速度重塑社会分工。与其说人工智能单纯取代了重复性岗位，毋宁说它正在倒逼整个劳动力市场进行能力结构的深度重构。',
      '与此同时，算法推荐与海量数据采集所衍生的“信息茧房”与隐私泄露隐患日益凸显。若缺乏有效的制度制约与透明审查，技术红利恐将被算法偏见所抵消，甚至动摇公众信任底线。',
      '正因如此，“科技向善”绝非一句空洞口号。如何在鼓励技术快速迭代与严守伦理安全边界之间取得动态平衡，既要依靠行业自律，亦离不开防微杜渐式的精准法治监管。',
    ],
    translationVi:
      'Công nghệ thông tin thế hệ mới mà đại diện là AI tạo sinh đang tái định hình phân công lao động xã hội với tốc độ chưa từng có. Thà nói AI đơn thuần thay thế công việc lặp lại, còn hơn nói nó đang buộc toàn bộ thị trường lao động tái cấu trúc sâu sắc về năng lực. Song song đó, hệ lụy "kén thông tin" và rủi ro rò rỉ dữ liệu từ thuật toán gợi ý ngày càng bộc lộ rõ. Vì vậy, "công nghệ vị nhân sinh" tuyệt đối không thể là khẩu hiệu sáo rỗng, mà đòi hỏi sự cân bằng giữa đổi mới nhanh và hành lang pháp lý phòng ngừa từ gốc.',
  },
  '7.3': {
    paragraphsZh: [
      '随着人口老龄化进程日益加速与城乡要素双向流动，构建覆盖全生命周期的公共治理体系已迫在眉睫。养老服务不再局限于基础生活照料，而是日益向医养结合与数字适老化配套升级，力求让每位长者真正老有所养、安居乐业。',
      '与此同时，教育公平与人才培养机制改革亦须统筹并重。一方面需通过政策倾斜缩小区域资源差距，另一方面更要破除唯分数论桎梏，因材施教激发青少年创新潜能，为社会储备高素质建设力量。',
      '此外，面对现代生活节奏加快带来的心理焦虑与隐性压力，完善基层心理疏导干预网络、防患未然，非但无损效率，反而能增强城市人口韧性，助力人民实现身心兼修与非遗文化的薪火相传。',
    ],
    translationVi:
      'Cùng với tốc độ già hóa dân số ngày càng nhanh và sự dịch chuyển hai chiều giữa đô thị – nông thôn, việc xây dựng hệ thống quản trị công bao phủ toàn vòng đời trở nên cấp bách. Dịch vụ dưỡng lão mở rộng sang kết hợp y tế và hạ tầng thân thiện người cao tuổi; đồng thời giáo dục cần cân bằng công bằng vùng miền và bồi dưỡng nhân tài theo năng lực cá nhân. Bên cạnh đó, khơi thông áp lực tâm lý xã hội và phòng ngừa từ sớm chẳng những không làm chậm tiến độ phát triển mà trái lại còn gia tăng sức bền cộng đồng.',
  },
  '7.4': {
    paragraphsZh: [
      '据权威能源统计公报显示，近五年来非化石清洁能源在总发电装机容量中的占比持续攀升，而传统煤炭消费比重则呈现温和回落态势，能源结构“此消彼长”的绿色替代格局已然显而易见。',
      '围绕新闻与政经文本的高阶编译实战，译者必须具备高度的语域敏感度。该类文件旨在阐明政策举措的落地实效，故而在越汉双向转换时切忌生硬直译，尤须谨防动宾搭配错位导致译意南辕北辙。',
      '在五百字以上议论文写作中，破题立论须做到画龙点睛、言简意赅，正文则须以翔实数据作为论据并首尾呼应。综上所述，唯有兼具语言精准与逻辑严谨，方能在HSK 7级考场中水到渠成。',
    ],
    translationVi:
      'Theo công báo thống kê năng lượng chính thống, tỷ trọng năng lượng sạch phi hóa thạch không ngừng leo dốc trong 5 năm qua trong khi than đá giảm nhẹ, tạo nên cục diện thay thế "bên giảm bên tăng" rõ rệt. Trong biên dịch báo chí – chính luận, người dịch cần nhận diện đúng sắc thái mục tiêu chính sách (旨在), tránh bẫy dịch từng chữ làm sai phối hợp Động – Tân. Ở bài nghị luận 500+ chữ, mở bài cần điểm đúng trọng tâm và kết bài phải hô ứng trọn vẹn để bài viết đạt chuẩn HSK 7.',
  },
  '8.1': {
    paragraphsZh: [
      '在跨国商事交易实践中，合同条款的严密性往往决定着风险分配的合理边界。凡因地震、战乱或突发公共事件导致客观履约不能者，均应依据事先约定的不可抗力条款予以审慎界定。',
      '然而，实务中部分企业常以市场价格剧烈波动为由主张免责，殊不知商业风险与法定不可抗力之间泾渭分明。除法定及约定情形外，任何一方概不得单方面中止履约，否则将依法承担违约赔偿责任。',
      '此外，随着技术壁垒与知识产权保护趋严，企业在出海布局前必须筑牢合规防线，在争议解决机制中明确管辖权与国际仲裁规则，并履行透明ESG信息披露义务，方能在复杂的国际市场中行稳致远。',
    ],
    translationVi:
      'Trong thực tiễn thương mại xuyên biên giới, tính chặt chẽ của điều khoản hợp đồng quyết định ranh giới phân bổ rủi ro. Phàm những trường hợp không thể thực hiện nghĩa vụ do động đất, chiến sự hay biến cố công cộng bất ngờ đều phải căn cứ điều khoản bất khả kháng để xác định thận trọng. Tuy nhiên, thực tế nhiều doanh nghiệp viện cớ biến động giá thị trường để xin miễn trách nhiệm, mà không biết rủi ro thương mại và bất khả kháng rạch ròi như hai dòng nước. Chỉ khi tuân thủ nghiêm pháp chế trọng tài và minh bạch ESG, doanh nghiệp mới có thể đi xa bền vững.',
  },
  '8.2': {
    paragraphsZh: [
      '着眼于应对全球极端气候挑战，着力于能源系统根本性重构，“碳达峰、碳中和”目标的推进绝非一蹴而就，而是一项功在千秋的系统性工程，亟须储能技术瓶颈突破与跨区域生态补偿机制协同并进。',
      '在生命科学与基因编辑前沿领域，新技术虽如一把双刃剑，既有望攻克遗传顽疾，倘若缺乏敬畏生命伦理的审慎底线，一经失控变异恐将引发不可逆转的社会风险，故科研实践更当谨言慎行。',
      '同样，基础科学研究贵在厚积薄发，难以强求立竿见影的短期暴利；唯有历经长期原创沉淀与科学孵化，方能在商业航天与低空经济等方兴未艾的新赛道上实现日新月异的突破。',
    ],
    translationVi:
      'Hướng tầm nhìn vào ứng phó biến đổi khí hậu cực đoan và tập trung tái cấu trúc hệ thống năng lượng, lộ trình trung hòa carbon tuyệt đối không thể thành công trong một bước mà đòi hỏi đột phá lưu trữ năng lượng và bồi hoàn sinh thái. Ở mũi nhọn chỉnh sửa gen và khoa học cơ bản, công nghệ là con dao hai lưỡi đòi hỏi sự thận trọng tuyệt đối trước ranh giới đạo đức sinh học và sự kiên trì tích lũy lâu dài ("hậu tích bạc phát") để bứt phá trên các đường đua công nghệ mới.',
  },
  '8.3': {
    paragraphsZh: [
      '现代汉语高级书面语之所以言简意赅、张力十足，很大程度上得益于对文言虚词与四字成语的精准承继。“乃”“鉴于”“尤以”等虚词的运用，使长句逻辑层次条分缕析，避免冗赘口语化。',
      '值得注意的是，成语不仅承载着历史典故的文化意蕴，更具有鲜明的褒贬色彩。例如“煞费苦心”重在肯定苦心孤诣之付出，而“处心积虑”则专指蓄意谋划之恶行，二者泾渭分明，万不可混为一谈。',
      '若能将古典审美意境与汉越文化词源的细微差异融会贯通，谨防“风尚”“讲究”等假朋友误区，学习者便能在跨文化写作与学术答辩中做到字斟句酌、恰如其分，真正迈入高级表达之境。',
    ],
    translationVi:
      'Văn viết cao cấp trong tiếng Hán hiện đại sở dĩ cô đọng và giàu sức nặng phần lớn nhờ kế thừa chính xác hư từ văn ngôn và thành ngữ Tứ tự. Việc vận dụng các hư từ như 乃, 鉴于, 尤以 giúp tầng bậc logic của câu dài rành mạch, tránh dài dòng khẩu ngữ. Đáng chú ý, thành ngữ mang sắc thái khen chê rạch ròi (như 煞费苦心 đối lập với 处心积虑), đồng thời cần tỉnh táo trước các "từ giả bạn" Hán–Việt như 风尚 hay 讲究 để đạt chuẩn HSK 8.',
  },
  '8.4': {
    paragraphsZh: [
      '面对六级至八级考试中结构盘根错节的超长学术文本，考生首须练就条分缕析抽出主谓宾主干之功底，方能及时识破成分赘余、句式杂糅或搭配不当等隐蔽语病，使长句衔接严丝合缝。',
      '在书面语体转换与三层递进式高级笔译实战中，仅仅做到字面准确尚显不足，更须体悟汉语重“意合”与外语重“形合”之差异，借由精准虚词与四字格凝练表达，实现语篇风貌脱胎换骨般的跃升，达致信、达、雅之境界。',
      '当步入学术研讨会专题陈述与质询答辩环节，学者既须以翔实数据佐证立论，更需保持从容不迫的学术风范，在起承转合间高屋建瓴、鞭辟入里，令整场论证有理有据、无懈可击。',
    ],
    translationVi:
      'Trước những câu học thuật dài tầng tầng lớp lớp trong đề HSK 8, người học trước hết phải nắm vững kỹ năng tách trục Chủ–Vị–Tân để nhận diện ngay lỗi thừa chữ (赘余), trộn câu (杂糅) hoặc phối hợp sai. Trong dịch thuật ba tầng và chuyển đổi ngữ vực từ khẩu ngữ sang văn viết trang trọng, cần dung hòa đặc trưng "ý hợp" tiếng Hán với "hình hợp" tiếng Việt để đạt trọn Tam chuẩn Tín – Đạt – Nhã, giữ vững phong thái điềm tĩnh sắc bén khi phản biện học thuật.',
  },
  '9.1': {
    paragraphsZh: [
      '纵观当前国际格局演变，多边主义虽屡遭单边博弈冲击，然各方在气候治理、金融稳定及公共安全等全球议题上的深层利益依然休戚与共。秉持求同存异、相向而行之外交精神，实乃化解结构性分歧的理性之道。',
      '在联合公报与多边谈判话语体系中，措辞的每一处微调皆折射出战略关切与谈判底线。高阶外交语言既讲求委婉周全、不失体面，又必须在面对无端揣测与恶意抹黑时阐明严正立场，做到有理有节、不卑不亢。',
      '正因如此，从事高级外交编译与政策白皮书汉译者，不仅需恪守《联合国宪章》宗旨并具备纵观全局之政治敏锐度，更需精研四字格推动合作走深走实，使译文在信、达、雅之间达到高度统一。',
    ],
    translationVi:
      'Nhìn tổng thể cục diện quốc tế hiện nay, chủ nghĩa đa phương tuy nhiều lần chịu tác động từ các cuộc đấu trí đơn phương, nhưng lợi ích sâu xa của các bên trong quản trị khí hậu và ổn định tài chính vẫn gắn bó sống còn. Giữ vững tinh thần cầu đồng tồn dị, tiến bước cùng chiều là con đường lý trí hóa giải bất đồng. Trong ngôn từ thông cáo chung, mỗi điều chỉnh câu chữ đều phản ánh quan ngại chiến lược và lằn ranh nguyên tắc, đòi hỏi biên phiên dịch HSK 9 dung hòa trọn vẹn ba chuẩn mực Tín – Đạt – Nhã.',
  },
  '9.2': {
    paragraphsZh: [
      '儒家“内圣外王、修身仁爱”之德治传统与道家“顺应规律、大巧若拙”之系统哲学，历经千年历史沉淀，依然为现代复杂组织治理提供着源头活水与深刻启迪。',
      '诚然，传统思想亦有历史局限，然究其根本，我们须坚持辩证取舍、古为今用之立场，剥离陈规糟粕而保留人文精华，促使其在当代社会语境中实现创造性诠释与革故鼎新。',
      '尤其面对现代性焦虑引发的异化与虚无困惑，重温东方审美中“留白之美”与“言有尽而意无穷”的精神维度，正可帮助个体于喧嚣世事中溯本求源、返璞归真，寻得安顿身心与跨文化共鸣之归属。',
    ],
    translationVi:
      'Truyền thống đức trị "nội thánh ngoại vương" Nho gia và triết lý "thuận theo quy luật, đại xảo nhược chuyết" Đạo gia sau hàng ngàn năm lắng đọng vẫn mang lại nguồn gợi mở sâu sắc cho quản trị tổ chức hiện đại. Bằng tư duy biện chứng gạn đục khơi trong ("cổ vi kim dụng"), kết hợp mỹ học "khoảng lặng lưu bạch" và "ý tại ngôn ngoại", triết học Đông Á giúp con người hiện đại hóa giải nỗi âu lo tha hóa và tìm lại điểm tựa bình an cho tâm hồn.',
  },
  '9.3': {
    paragraphsZh: [
      '在全球金融市场高度联动的背景下，主要经济体货币政策的转向往往产生显著的外溢效应，致使新兴市场在汇率稳定与跨境资本流动性上面临严峻承压。',
      '倘若金融机构在追求高收益的同时忽视杠杆率失控、并购尽调疏漏与资产泡沫积聚，风险便极易在不同市场间跨界传染，甚至“牵一发而动全身”，演变为难以收拾的系统性危机。',
      '唯有强化审慎监管、完善多边本币清算基础设施并引导企业稳健对冲汇率风险，诚蒙多方鼎力协同推进市场有序出清，方能在波谲云诡的全球金融博弈中乘风破浪，实现真正意义上的稳中求进。',
    ],
    translationVi:
      'Trong bối cảnh thị trường tài chính toàn cầu liên thông chặt chẽ, sự xoay trục chính sách tiền tệ của các nền kinh tế lớn thường tạo hiệu ứng lan tỏa mạnh mẽ, khiến các thị trường mới nổi chịu áp lực nặng nề về tỷ giá và thanh khoản dòng vốn. Nếu định chế tài chính chạy theo lợi nhuận mà xem nhẹ đòn bẩy mất kiểm soát hay sơ hở thẩm định M&A, rủi ro sẽ "chạm một sợi tóc mà động toàn thân". Chỉ bằng giám sát thận trọng, hoàn thiện hạ tầng thanh toán bản tệ và phòng ngừa rủi ro bài bản mới có thể vững tiến giữa sóng gió.',
  },
  '9.4': {
    paragraphsZh: [
      '步入同声传译与高阶即时辩论实战，译员核心破局之道在于打破源语定语羁绊，依托“意群切分、顺句驱动”策略实时组织自然流畅的目标语产出，面对突然反诘仍能沉着应变、力排众议。',
      '而在六百字深度议论文与超长跨学科文献精读考场上，考生既要能提纲挈领厘清七十字长难句脉络并洞察潜台词，更须以层层递进之思辨架构、字字珠玑之文采做到一目了然。',
      '综上所述，经过听、说、读、写、译五维立体锤炼与全真模拟淬火，学习者终将实现知识体系融会贯通、游刃有余，在巅峰冲刺中赢得实至名归的高等九级桂冠。',
    ],
    translationVi:
      'Bước vào thực chiến phiên dịch cabin và tranh biện tức thì, chìa khóa đột phá nằm ở chiến lược "tách cụm ý, dịch xuôi theo trục thông tin" (意群切分、顺句驱动), giữ bản lĩnh điềm tĩnh ứng biến trước mọi câu vặn hỏi. Trên trường thi viết 600 chữ và tinh đọc liên ngành, thí sinh vừa phải bắt trọn xương sống câu dài 70 chữ và hàm ý ẩn sau câu chữ, vừa lập luận tầng tầng lớp lớp cô đọng ngọc chu. Tích lũy dày dặn năm kỹ năng tất yếu mang lại đỉnh cao HSK 9 xứng đáng.',
  },
};

export const GRAMMAR_AST_BY_CODE = {
  'HSK7-WRITTEN-SHANGQIE': {
    formula_tokens: [
      { token: 'S1 / Vế 1', role: 'Trạng thái nhẹ hơn', note: 'Sự việc mức độ cơ bản vốn còn gặp trở ngại' },
      { token: '尚且', role: 'Phó từ nhượng bộ', note: 'Huống chi / Ngay cả... còn...' },
      { token: '……何况', role: 'Liên từ tăng tiến', note: 'Chuyển lên vế nặng hơn' },
      { token: 'Vế 2 + 呢？', role: 'Kết luận tất yếu', note: 'Hỏi tu từ hoặc khẳng định mức độ tất nhiên cao hơn' },
    ],
    wrong: '这么小的问题都难解决，何况大问题呢。(Thiếu 尚且 dẫn dắt tương phản)',
    correct: '这么小的问题尚且难以解决，更何况如此棘手的宏观瓶颈呢？',
    reason: 'Trong văn viết HSK 7, cặp 尚且……（更）何况…… bắt buộc phải có hai vế chênh lệch bậc thang rõ ràng từ nhẹ đến nặng.',
  },
  'HSK7-WRITTEN-ZHISUOYI': {
    formula_tokens: [
      { token: 'S + 之所以 + Kết quả', role: 'Mệnh đề hệ quả đặt trước', note: 'Đảo kết quả lên đầu để nhấn mạnh nguyên nhân' },
      { token: '乃是因为 / 在于', role: 'Hệ từ giải thích trang trọng', note: 'Trang trọng hơn 因为 trong khẩu ngữ' },
      { token: 'Căn nguyên sâu xa', role: 'Mệnh đề nguyên nhân', note: 'Giải thích lý do cốt lõi' },
    ],
    wrong: '之所以通胀居高不下，所以央行加强调控。(Sai nghiêm trọng ghép nhầm 之所以 với 所以)',
    correct: '之所以通胀压力居高不下，乃是因为供应链衍生风险与需求端失衡叠加所致。',
    reason: 'Tuyệt đối không dùng 之所以 đi với 所以; vế sau bắt buộc là 是因为 / 乃是因为 / 在于.',
  },
  'HSK7-WRITTEN-JIANYU': {
    formula_tokens: [
      { token: '鉴于 + Bối cảnh khách quan', role: 'Giới từ nêu căn cứ', note: 'Xét thấy tình hình thực tế là...' },
      { token: '有鉴于此 / 特此', role: 'Cụm chuyển tiếp công văn', note: 'Do xét thấy điều đó, nay đặc biệt...' },
      { token: 'Quyết sách / Biện pháp', role: 'Mệnh đề hành động', note: 'Hành động cụ thể tương ứng' },
    ],
    wrong: '鉴于于目前的壁垒很高，我们决定调整路线。(Dư giới từ 于)',
    correct: '鉴于当前跨境贸易壁垒抬升，企业特此重塑区域供应链布局。',
    reason: 'Trong từ 鉴于 bản thân chữ 于 đã là giới từ, không được thêm 于 nữa và phía sau không đứng một mệnh đề quá khẩu ngữ.',
  },
  'HSK7-WRITTEN-CHENGRAN': {
    formula_tokens: [
      { token: '诚然 + Thừa nhận vế A', role: 'Nhượng bộ thực tế', note: 'Quả thực là đúng như vậy...' },
      { token: '然而 / 然', role: 'Chuyển ngoặt sắc bén', note: 'Tuy nhiên xét chiều sâu hơn...' },
      { token: 'Luận điểm phản biện B', role: 'Trọng tâm tác giả', note: 'Khẳng định chiều cạnh quyết định' },
    ],
    wrong: '虽然这个方案很好，但是我们还是要改进。(Khẩu ngữ Sơ-Trung cấp)',
    correct: '诚然，该方案在提振内需方面颇具成效，然而仍须不断迭代以契合消费升级趋势。',
    reason: 'HSK 7 yêu cầu chuyển từ cặp 虽然…但是 sang 诚然…然而… để tạo sắc thái khách quan sắc sảo trong văn chính luận.',
  },
  'HSK7-WRITTEN-WUGUAIHU': {
    formula_tokens: [
      { token: 'Nguyên nhân đã nêu', role: 'Cơ sở suy luận', note: 'Dữ kiện có trước' },
      { token: '无怪乎 / 难怪乎', role: 'Đoản ngữ suy luận văn viết', note: 'Chẳng trách mà...' },
      { token: 'Kết quả hợp logic', role: 'Hệ quả hiển nhiên', note: 'Điều hoàn toàn dễ hiểu' },
    ],
    wrong: '难怪着区域金融发展这么快。(Dư trợ từ 着 không hợp chuẩn)',
    correct: '绿色融资渠道与产业协同并举，无怪乎区域一体化成果屡创佳绩。',
    reason: '无怪乎 đi thẳng với vế câu hoặc cụm danh-động mà không kẹp trợ từ động thái 着 hay 了 ngay sau 乎.',
  },
  'HSK7-WRITTEN-YUQISHUO': {
    formula_tokens: [
      { token: '与其说 + Nhận định A', role: 'Góc nhìn bề mặt', note: 'Thay vì nói chỉ là A...' },
      { token: '毋宁说 + Bản chất B', role: 'Khẳng định chiều sâu', note: 'Thà nói thực chất là B thì đúng hơn' },
    ],
    wrong: '与其说AI帮助人，不如说还是重构劳动。(Trộn ngữ vực thấp với văn viết)',
    correct: '与其说人工智能单纯取代岗位，毋宁说它正在倒逼就业结构实现赋能升级。',
    reason: 'Trong văn viết học thuật HSK 7, cặp 与其说……毋宁说…… sắc bén và giàu sức nặng biện luận hơn hẳn 与其……不如…….',
  },
  'HSK7-WRITTEN-ZHIYU': {
    formula_tokens: [
      { token: 'Thực trạng / Nguyên nhân', role: 'Tiền đề', note: 'Vế tạo ra hệ lụy' },
      { token: '以致于 / 乃至', role: 'Liên từ kéo theo / mở rộng', note: 'Đến mức độ... thậm chí tới cả...' },
      { token: 'Hệ quả tiêu cực / Phạm vi cực đại', role: 'Kết cục', note: 'Thường là kết quả ngoài mong muốn (以致)' },
    ],
    wrong: '大家努力甄别信息，以致取得了大成功。(Dùng sai 以致 cho kết quả tích cực)',
    correct: '部分用户长期盲从推荐算法，以致形成认知偏见，乃至陷入信息茧房之桎梏。',
    reason: '以致(于) chuyên kéo theo hệ quả tiêu cực ngoài ý muốn; kết quả tích cực phải dùng 从而 hoặc 进而.',
  },
  'HSK7-WRITTEN-BINGFEI': {
    formula_tokens: [
      { token: 'Chủ đề', role: 'Chủ ngữ', note: 'Vấn đề đang bàn' },
      { token: '并非 + Lầm tưởng A', role: 'Phủ định sắc gọn', note: 'Hoàn toàn không phải là A' },
      { token: '而是 + Bản chất B', role: 'Khẳng định đối lập', note: 'Mà thực chất là B' },
    ],
    wrong: '隐私泄露不是一个技术小问题，其实是制度漏洞。(Khẩu ngữ rườm rà)',
    correct: '数据安全治理并非单纯的技术防护，而是有法可依且防微杜渐的系统工程。',
    reason: 'Cặp 并非……而是…… (hoặc 绝非……) tạo lực phủ định chắc nịch cho câu định nghĩa học thuật.',
  },
  'HSK7-WRITTEN-SHOUXIANYOU': {
    formula_tokens: [
      { token: '诚如 + Chủ thể + 所言', role: 'Trích dẫn đồng tình', note: 'Đúng như học giả/chuyên gia... đã nhận định' },
      { token: '不容忽视的是……', role: 'Mệnh đề chuyển trọng tâm', note: 'Điều không thể xem nhẹ là...' },
    ],
    wrong: '就像专家说的一样，不能忽略道德问题。(Khẩu ngữ)',
    correct: '诚如学界专家所言，科技向善不容忽视的是伦理底线与合理制度制约。',
    reason: 'Sử dụng cụm cố định văn ngôn 诚如……所言 và danh từ hóa mệnh đề 不容忽视的是…… để tăng tính thuyết phục.',
  },
  'HSK7-WRITTEN-YIWEI': {
    formula_tokens: [
      { token: 'A + 固然 + Nhận định đúng', role: 'Thừa nhận vế trước', note: 'Dẫu đúng là A có ưu thế...' },
      { token: '但亦不可 + Cực đoan ngược lại', role: 'Cảnh báo cân bằng', note: 'Nhưng cũng tuyệt đối không thể...' },
    ],
    wrong: '智慧城市当然好，但是也不可以不管老人。(Thiếu tính cô đọng)',
    correct: '城市智慧化固然便利高效，但亦不可忽视数字鸿沟而忽略适老化普及。',
    reason: 'Khung 固然……但亦不可…… giúp bài luận HSK 7 đạt tính biện chứng hai chiều ngay trong một câu.',
  },
  'HSK7-WRITTEN-RIYI': {
    formula_tokens: [
      { token: 'Xu hướng vĩ mô', role: 'Chủ ngữ', note: 'Hiện tượng biến đổi theo thời gian' },
      { token: '日益 / 愈发', role: 'Phó từ tăng tiến', note: 'Ngày càng rõ rệt hơn (chỉ đứng trước cụm mang nghĩa biến đổi)' },
      { token: 'Adj / Mental V', role: 'Vị ngữ tính chất', note: '凸现, 紧迫, 突出, 严峻' },
    ],
    wrong: '今天天气日益晴天了。(Lỗi: 日益 không đi với sự vật tĩnh hoặc hiện tượng đơn lẻ trong 1 ngày)',
    correct: '伴随老龄化程度加深，完善社会养老与赡养保障体系的紧迫性日益凸显。',
    reason: '日益 và 愈发 biểu thị sự biến đổi tiệm tiến dài hạn, đi cùng tính từ hoặc động từ trừu tượng.',
  },
  'HSK7-WRITTEN-SHOUYI': {
    formula_tokens: [
      { token: 'Thành quả đạt được', role: 'Chủ ngữ kết quả', note: 'Thành tựu cụ thể' },
      { token: '得益于 / 归因于', role: 'Động từ dẫn nguyên nhân', note: 'Có được nhờ vào (tích cực) / Quy nguyên từ' },
      { token: 'Yếu tố thúc đẩy', role: 'Tân ngữ nguyên nhân', note: 'Cụm danh từ chính sách/nội lực' },
    ],
    wrong: '城市富裕归咎于因地制宜的政策。(Dùng sai 归咎于 — vốn chỉ đổ lỗi thất bại — cho thành công)',
    correct: '城乡融合稳步推进，主要得益于户籍配套改革与因地制宜的产业振兴举措。',
    reason: '得益于 chỉ dùng cho kết quả TỐT; 归咎于 chỉ dùng quy trách nhiệm kết quả XẤU; 归因于 mang nghĩa trung tính.',
  },
  'HSK7-WRITTEN-BINGZHONG': {
    formula_tokens: [
      { token: 'Yếu tố A + 与 + Yếu tố B', role: 'Hai trụ cột song hành', note: 'Hai mục tiêu chính sách' },
      { token: '并重 / 兼顾……与……', role: 'Vị ngữ cân bằng', note: 'Coi trọng ngang nhau, hài hòa cả hai' },
    ],
    wrong: '教育要公平也要质量，两个都重。(Lủng củng khẩu ngữ)',
    correct: '教育改革须兼顾资源倾斜公平与拔尖素质培养，坚持因材施教与百年树人并重。',
    reason: 'Động từ 并重 làm vị ngữ cho chủ ngữ kép (A与B并重); 兼顾 nhận tân ngữ kép (兼顾A与B).',
  },
  'HSK7-WRITTEN-KEJIAN': {
    formula_tokens: [
      { token: 'Luận cứ đã chứng minh', role: 'Vế tiền đề', note: 'Các phân tích trước đó' },
      { token: '由此可见 / 换言之', role: 'Đoản ngữ quy nạp / diễn giải', note: 'Từ đó có thể thấy / Nói cách khác' },
      { token: 'Kết luận cô đọng', role: 'Mệnh đề chốt', note: 'Chân lý tất yếu rút ra' },
    ],
    wrong: '由此我们可以看到出来心理健康很重要。(Thừa động từ lai tạp 看 và 出来)',
    correct: '由此可见，完善心理疏导干预网络对于增强社会韧性及防患未然至关重要。',
    reason: 'Cụm cố định 由此可见 đã mang đầy đủ nghĩa "từ đó có thể thấy", không tự ý chèn thêm chủ ngữ hay bổ ngữ.',
  },
  'HSK7-WRITTEN-BUJINJINYUE': {
    formula_tokens: [
      { token: 'Chủ ngữ', role: 'Đối tượng', note: 'Dự án, di sản hoặc hành động' },
      { token: '非但 + Phủ định điều dự đoán A', role: 'Vế phủ nhận kỳ vọng thông thường', note: 'Không những không bị A...' },
      { token: '反而 + Khẳng định kết quả trái ngược B', role: 'Nghịch chuyển mạnh', note: 'Mà trái lại còn B...' },
    ],
    wrong: '非但老手艺没消失，而且年轻人还创新了。(Trộn lẫn cặp 非但…反而 với 而且)',
    correct: '数字化赋能非但未令濒危非遗失传，反而在匠心创新中实现了推陈出新、薪火相传。',
    reason: 'Cặp 非但……反而…… thường mang hướng nghịch chuyển ngược kỳ vọng (chú ý vị trí sau Chủ ngữ nếu cùng 1 chủ ngữ).',
  },
  'HSK7-ESSAY-DATA': {
    formula_tokens: [
      { token: '据 + Nguồn thống kê + 显示', role: 'Mở đầu dẫn nguồn khách quan', note: 'Theo số liệu từ... cho thấy' },
      { token: 'Chỉ số + 呈 + Tính chất + 态势', role: 'Khung mô tả biểu đồ', note: 'Thể hiện xu hướng tăng/giảm' },
    ],
    wrong: '图表画了干净能源占了越来越多比例。(Lối kể miêu tả thô sơ)',
    correct: '据最新能源统计数据显示，清洁能源占比呈逐年攀升态势，与化石能源构成此消彼长格局。',
    reason: 'Bài viết biểu đồ 图表作文 HSK 7 bắt buộc dùng cụm danh–động chuẩn xác như 占比, 攀升, 回落, 呈……态势.',
  },
  'HSK7-TRANS-SHIZAI': {
    formula_tokens: [
      { token: 'Chính sách / Dự án', role: 'Chủ thể', note: 'Sáng kiến hoặc đạo luật' },
      { token: '旨在 / 力图 + Động từ mục tiêu', role: 'Hệ từ mục đích văn viết', note: 'Nhằm mục đích... / Nỗ lực hướng tới...' },
    ],
    wrong: '这项政策的目的主要是为了想要提高实效。(Lặp nghĩa nặng nề: 目的 + 为了 + 想要)',
    correct: '新出台的一系列务实举措旨在打通落地瓶颈，力图取得显著政策实效。',
    reason: 'Trong tiếng Hán không viết "目的是为了" (lỗi 杂糅 kinh điển của người Việt); dùng gọn hai chữ 旨在 thay cả cụm.',
  },
  'HSK7-ESSAY-THESIS': {
    formula_tokens: [
      { token: '毋庸置疑 + Luận đề nền', role: 'Khẳng định tiền đề không bàn cãi', note: 'Không còn nghi ngờ gì nữa...' },
      { token: '然而 + Nút thắt phản biện', role: 'Mở hướng mổ xẻ', note: 'Song vấn đề cốt lõi nằm ở...' },
    ],
    wrong: '没有怀疑数字时代很重要，但是有很多困难。(Chữ Hán tự ghép từ tiếng Việt)',
    correct: '毋庸置疑，数字转型已成大势所趋；然而如何立论破题并确保论据呼应，仍值得深思。',
    reason: 'Mở bài nghị luận 500 chữ cần câu chủ đề đĩnh đạc 毋庸置疑 để đặt nền và câu ngoặt sắc nét.',
  },
  'HSK7-TRANS-COLLOCATION': {
    formula_tokens: [
      { token: 'Động từ chuẩn ngữ vực (V)', role: 'Vị ngữ học thuật', note: '提振 / 突破 / 化解 / 营造' },
      { token: 'Tân ngữ cố định (O)', role: 'Danh từ đối tượng', note: '信心 / 瓶颈 / 风险 / 氛围' },
    ],
    wrong: '提高市场信心 / 进步技术 / 修理错误习惯。(Bẫy dịch từng chữ Động-Tân Việt sang Trung)',
    correct: '提振市场信心 / 推动技术突破 / 克服固有习惯。(Phối hợp 动宾搭配 chuẩn bản ngữ)',
    reason: 'Học từ vựng HSK 7 phải học theo cặp khối Động–Tân cố định thay vì ghép từng chữ từ điển Việt-Trung.',
  },
  'HSK7-CAPSTONE': {
    formula_tokens: [
      { token: '综上所述，', role: 'Từ nối chốt toàn bài', note: 'Tổng hợp lại toàn bộ phân tích' },
      { token: '唯有 + Điều kiện tiên quyết，', role: 'Nhấn mạnh giải pháp duy nhất', note: 'Chỉ có con đường...' },
      { token: '方能 + Kết quả mong đợi。', role: 'Kết cục tất yếu', note: 'Thì mới có thể đạt được...' },
    ],
    wrong: '总的来说，只有做好准备就可以成功。(Trộn cặp 只有…才 với 就)',
    correct: '综上所述，唯有有的放矢地统筹实效与长远规划，方能令转型大业水到渠成。',
    reason: 'Tổng kết bài viết/diễn văn HSK 7 phải khớp bộ 综上所述……唯有……方能…… chuẩn xác ngữ pháp cổ kim.',
  },
};

// Dynamic contextual AST & mistake builder for HSK 8-9 codes (60/60 complete)
const EXTRA_GRAMMAR_AST_DETAILS = {
  'HSK8-LEGAL-FANER': {
    tokens: ['凡 + Điều kiện pháp định + 者，', '均应 + Nghĩa vụ bắt buộc', '/ 除……外，概不……'],
    wrong: '所有地震发生的话，公司都应该免责。(Khẩu ngữ thiếu tính quy phạm hợp đồng)',
    correct: '凡因不可抗力导致客观履约不能者，均应依约启动免责或国际仲裁程序；除法定情形外，概不得单方毁约。',
    reason: 'Văn bản hợp đồng dùng chữ 凡……均应…… và 除……外，概不…… để khóa chặt ngoại lệ pháp lý không tạo kẽ hở.',
  },
  'HSK8-LEGAL-YIJU': {
    tokens: ['依据 + Văn bản/Điều khoản pháp luật', '予以 + Hình thức xử lý', '/ 依法追究……责任'],
    wrong: '按照法律来看，我们要赔偿给版权人。(Thiếu trang trọng tố tụng)',
    correct: '依据现行知识产权法规，对恶意专利侵权行为依法予以严惩并追究赔偿责任。',
    reason: 'Động từ hình thức 予以 đứng trước danh–động từ 2 âm tiết (予以驳回, 予以赔偿, 予以追究) là dấu ấn của công văn pháp chế.',
  },
  'HSK8-LEGAL-YANJIN': {
    tokens: ['严禁 / 不得', '以 + Danh nghĩa tốt đẹp + 之名', '行 + Hành vi trục lợi/độc quyền + 之实'],
    wrong: '不能拿保护隐私的借口来做市场垄断。(Câu kể dài dòng)',
    correct: '监管部门严禁平台企业以数据安全之名行市场垄断与不正当兼并之实。',
    reason: 'Khuôn vàng 以……之名行……之实 vạch trần mâu thuẫn giữa hình thức và bản chất trong hai nhịp cân xứng.',
  },
  'HSK8-LEGAL-SHUANGFANG': {
    tokens: ['双方经友好协商未果，', '则 + Điều khoản tài phán mặc định', '（管辖权 / 仲裁效力）'],
    wrong: '如果两个人商量不成了以后再去找法院吧。(Khẩu ngữ đời thường)',
    correct: '如双方经友好协商与诉前调解未果，则任何一方均有权将争议提交约定仲裁机构作出终局裁决。',
    reason: 'Cụm 协商未果……则…… chuẩn hóa điều khoản giải quyết tranh chấp thương mại đa phương.',
  },
  'HSK8-LEGAL-ZHONGZAI': {
    tokens: ['不仅 + Nghĩa vụ trước mắt，', '更系 + Lợi ích cốt lõi', '+ 所系 / 所在'],
    wrong: 'ESG不仅重要，而且关系到企业以后能不能行稳致远。(Thiếu nhịp đối ngẫu văn viết)',
    correct: '完善ESG信息披露与透明问责，不仅关乎短期合规声誉，更系百年企业行稳致远之根基所在。',
    reason: 'Cặp 系……所系 nhấn mạnh mối liên hệ sống còn trực tiếp với sự tồn vong bền vững.',
  },
  'HSK8-SCI-WEILE': {
    tokens: ['着眼于 + Tầm nhìn dài hạn，', '着力于 + Trọng tâm hành động hiện tại'],
    wrong: '为了未来的双碳目标，现在我们集中做储能。(Thiếu nhịp song hành bốn chữ)',
    correct: '推进“双碳”目标须着眼于全球生态长期安全，着力于新型储能突破与减排技术协同。',
    reason: '着眼于 (tầm mắt vĩ mô) phối với 着力于 (biện pháp thực thi) tạo cấu trúc giải pháp kép sắc bén.',
  },
  'HSK8-SCI-JIRU': {
    tokens: ['一经 + Thao tác/Phát sinh，', '便 + Hệ quả tất yếu', '/ 倘若……恐将……'],
    wrong: '如果基因改错了就以后再也改不回来了很危险。(Khẩu ngữ dài dòng)',
    correct: '基因序列一经人为编辑引入不可逆变异，便恐将引发跨代生态风险；倘若疏于伦理审慎，后果不堪设想。',
    reason: '一经……便…… diễn tả cơ chế kích hoạt tức thì không thể đảo ngược; 倘若……恐将…… dùng cảnh báo giả định rủi ro.',
  },
  'HSK8-SCI-BINGFEIYICHAO': {
    tokens: ['Mục tiêu dài hạn', '绝非一日之功 / 岂能一蹴而就？'],
    wrong: '气候治理不可能一天做完。(Nhẹ, thiếu lực hùng biện)',
    correct: '极端气候系统修复与跨区生态补偿绝非一日之功，岂能幻想一蹴而就？',
    reason: 'Câu phản vấn với 岂能…… nhấn mạnh gấp đôi nhận thức rằng biến đổi hệ sinh thái đòi hỏi kiên trì.',
  },
  'HSK8-SCI-XIANGFUXIANGCHENG': {
    tokens: ['Vế A + 固然可贵，', '然若缺乏 + Điều kiện B，', '则 + Hạn chế tất yếu'],
    wrong: '基础科学很好，可是不转化的话也没用。(Khẩu ngữ)',
    correct: '基础研究之原创沉淀固然可贵，然若缺乏高效孵化机制，则难以立竿见影地转化为现实生产力。',
    reason: 'Khuôn 固然可贵，然若……则…… chuyên phân tích điều kiện cần (tiền đề) và điều kiện đủ (hiện thực hóa).',
  },
  'HSK8-SCI-FANGXINGWEIAI': {
    tokens: ['Ngành mới nổi', '方兴未艾 / 蓄势待发'],
    wrong: '金融诈骗最近正在方兴未艾。(Sai sắc thái: 方兴未艾 chỉ dùng cho hiện tượng TÍCH CỰC)',
    correct: '伴随火箭可回收与北斗导航普及，商业航天与低空经济新赛道正方兴未艾、日新月异。',
    reason: 'Thành ngữ 方兴未艾 mang sắc thái khen tích cực (褒义), tuyệt đối không gán cho tệ nạn hay rủi ro tiêu cực.',
  },
  'HSK8-CLASSICAL-XUCI': {
    tokens: ['……之所在', '/ 以……为……', '/ 实乃……'],
    wrong: '把简单当成最好的文章。(Khẩu ngữ khi bàn mỹ học văn chương)',
    correct: '现代书面语往往以言简意赅为至高追求，这乃其逻辑条分缕析之优势所在。',
    reason: 'Hư từ văn ngôn 之, 其, 乃, 以 giúp nén nghĩa và xóa bỏ sự lủng củng của giới từ khẩu ngữ.',
  },
  'HSK8-IDIOM-REGISTER': {
    tokens: ['Thành ngữ 褒义 (Khen)', 'VS', 'Thành ngữ 贬义 (Chê)'],
    wrong: '科研团队处心积虑地攻克了技术难关。(Sai sắc thái trầm trọng: 处心积虑 là mưu đồ XẤU)',
    correct: '科研团队煞费苦心地攻坚克难；而造假团伙则是处心积虑、趋之若鹜地牟取暴利。',
    reason: 'HSK 8 khảo sát trực diện bẫy sắc thái khen–chê (褒贬误用): 煞费苦心/深思熟虑 (Tốt) đối lập 处心积虑/趋之若鹜 (Xấu).',
  },
  'HSK8-RHETORIC-METAPHOR': {
    tokens: ['Phép đối ngẫu cân chỉnh', 'Ẩn dụ ý tượng (意象寄托)'],
    wrong: '诗里的月亮就是作者想念妈妈的意思。(Dịch thô mất hết dư vị thơ)',
    correct: '诗人借孤月寄托家国情怀，笔墨含蓄却神形兼备，令全篇意境隽永、回味无穷。',
    reason: 'Khi phân tích và dịch tản văn/thơ ca, giữ cấu trúc đối xứng giúp truyền tải cả "thần" lẫn "hình".',
  },
  'HSK8-QUOTE-CLASSICS': {
    tokens: ['古人云：“……”', '/ 正所谓……'],
    wrong: '古代人经常说我们要从历史中学习。(Rời rạc thiếu điểm nhấn)',
    correct: '正所谓“前事不忘，后事之师”，善用历史典故以史为鉴，方能给予现代治理深刻启迪。',
    reason: 'Dẫn điển cố qua từ khóa 正所谓 hoặc 古人云 tạo nhịp dừng trang trọng nâng tầm thuyết phục cho diễn văn.',
  },
  'HSK8-TRANS-CULTURE': {
    tokens: ['Phát hiện "False Friends"', 'Chuyển nghĩa theo ngữ cảnh thực tế'],
    wrong: '他今天穿得很体面，而且十分讲究学术方法。(Dịch thẳng "thể diện" / "giảng cứu" theo nghĩa Việt sẽ gây hiểu sai)',
    correct: '“体面”常指端庄体统，“讲究”强调注重规制细节，“风尚”多指时代良好风气——跨文化翻译须慎防汉越同形异义误区。',
    reason: 'Nhiều từ Hán–Việt (như 讲究, 风尚, 体面, 姑且) mang nghĩa khác xa tiếng Việt hiện đại.',
  },
  'HSK8-SYNTAX-ERROR': {
    tokens: ['Rút gọn 主语 – 谓语 – 宾语', 'Kiểm tra 赘余 / 杂糅 / 歧义 / 搭配不当'],
    wrong: '通过这次严丝合缝的培训，使我们的长句解析水平得到了极大提升。(Thiếu chủ ngữ vì 通过…使… triệt tiêu nhau)',
    correct: '这次严丝合缝的培训使我们的长句解析水平得到了极大提升（bỏ 通过 hoặc bỏ 使）。',
    reason: 'Rút gọn phần định ngữ dài để kiểm tra khung Chủ–Vị–Tân giúp phát hiện 90% lỗi thiếu chủ ngữ và câu hỗn tạp.',
  },
  'HSK8-REGISTER-SHIFT': {
    tokens: ['Khẩu ngữ (虽然/挺/搞)', '→', 'Văn viết (诚然/颇具/推进)'],
    wrong: '这事搞得挺庄重的，一点也不口语。(Dùng khẩu ngữ "搞/挺" ngay trong văn bình luận ngữ vực)',
    correct: '经过字斟句酌的语体润色，行文显得更为庄重凝练，从而实现文风脱胎换骨的提升。',
    reason: 'Mỗi từ trong tiếng Hán thuộc một tầng ngữ vực; tuyệt đối không trộn từ khẩu ngữ (搞, 弄, 特别, 挺) vào công văn.',
  },
  'HSK8-TRANS-3TIER': {
    tokens: ['Tín (信 - Chuẩn xác)', 'Đạt (达 - Mượt mà)', 'Nhã (雅 - Thanh tao 4 chữ)'],
    wrong: '把中国文字直接按照原来顺序翻出来越南语。(Lệ thuộc trật tự cú pháp gốc)',
    correct: '高阶笔译须兼顾汉语“意合”与外语“形合”之长，于字里行间追求信、达、雅的高度统一。',
    reason: 'Tầng Đạt đòi hỏi đổi trật tự định ngữ tiếng Hán cho thuận tiếng Việt; tầng Nhã nâng từ đơn lẻ lên tứ tự cách.',
  },
  'HSK8-SPEAK-DEFENSE': {
    tokens: ['诚如您所质疑……（Tiếp nhận lịch sự）', '然从另一维度观之……（Phản biện sắc bén）'],
    wrong: '你的问题不对，完全没有根据。(Cứng nhắc, dễ gây đối đầu tại hội đồng)',
    correct: '诚如您所质疑，短期成本确有上升；然从全周期维度观之，长期制度红利足以支撑该有理有据的结论。',
    reason: 'Chiến lược "Nhận một bước hợp lý để phản biện chín bước còn lại" giúp giữ phong thái từ tốn mà thuyết phục tuyệt đối.',
  },
  'HSK8-CAPSTONE': {
    tokens: ['起 (Đặt đề)', '承 (Triển khai)', '转 (Phản biện ngoặt ý)', '合 (Chốt toàn cục)'],
    wrong: 'Viết dàn trải một chiều suốt 600 chữ thiếu đoạn phản biện chuyển ý (转).',
    correct: '文章依起承转合构篇，于高屋建瓴立论之后巧设辩证转折，令论证鞭辟入里、首尾呼应。',
    reason: 'Khác biệt lớn nhất giữa 450 chữ đạt chuẩn và 600 chữ xuất sắc là bước "Chuyển" (转) nhìn sâu mặt trái vấn đề.',
  },
  'HSK9-DIPLO-TONE': {
    tokens: ['秉持 + Nguyên tắc/Tinh thần，', '致力于 + Mục tiêu dài hạn', '（求同存异、相向而行）'],
    wrong: '我们坚持和平原则，想一起解决矛盾。(Thiếu tầm vóc thông cáo chung đa phương)',
    correct: '各方应秉持求同存异精神，通过建设性斡旋凝聚广泛共识，致力于推动关系相向而行。',
    reason: 'Động từ 秉持 và 致力于 là bộ khung chuẩn mực trong diễn ngôn ngoại giao đỉnh cao HSK 9.',
  },
  'HSK9-DIPLO-CONTRAST': {
    tokens: ['纵观 + Cục diện tổng thể，', '既不 + Cực đoan A，', '亦不 + Cực đoan B'],
    wrong: '我们既不靠这边也不靠那边，只看整体情况。(Khẩu ngữ thiếu tính đối xứng)',
    correct: '纵观地缘经济格局演变大局，战略自主既不陷于零和博弈，亦不丧失合作韧性与回旋纵深。',
    reason: 'Cấu trúc 既不……亦不…… phối hợp cùng 纵观 tạo thế cân bằng đa cực đĩnh đạc trong bình luận chiến lược.',
  },
  'HSK9-DIPLO-REBUTTAL': {
    tokens: ['……之举实乃 + Định tính bản chất', '/ 奉劝 + Chủ thể + 悬崖勒马'],
    wrong: '他们的说法很坏，不要这样做了。(Thiếu cấp độ sắc thái ngoại giao)',
    correct: '任何无端揣测与恶意抹黑之举实乃颠倒黑白，奉劝有关方面尊重事实真相、恪守言行底线。',
    reason: 'Ngôn từ họp báo HSK 9 phân biệt rõ mức độ: ôn hòa phản bác (事实不言自明) đến cảnh báo nghiêm khắc (实乃…… / 奉劝……).',
  },
  'HSK9-DIPLO-RESPONSIBILITY': {
    tokens: ['坚持 + “共同但有区别的责任”原则', '恪守框架 + 兑现承诺'],
    wrong: '所有国家应该负一样的责任保护环境。(Sai lệch nguyên tắc công bằng khí hậu quốc tế)',
    correct: '各国唯有秉持共同但有区别的责任原则，恪守多边框架并切实兑现减排融资承诺，方能同舟共济。',
    reason: 'Hiểu đúng mệnh đề phức đẳng lập "共同但有区别" (Chung nhưng có phân biệt theo năng lực lịch sử) là trọng tâm HSK 9.',
  },
  'HSK9-DIPLO-DOC': {
    tokens: ['特此重申 + Lập trường cốt lõi，', '旨在推动 + Hợp tác + 走深走实'],
    wrong: '我们再说一次以前的决定，希望做得更好。(Không đạt chuẩn văn bản công văn trắng)',
    correct: '双方在纲领性白皮书中特此重申互利宗旨，倡导推动务实合作走深走实、行远自迩。',
    reason: 'Sách trắng và công văn đối ngoại dùng động từ nghi thức 特此重申, kết cặp bốn chữ đối nhịp 走深走实.',
  },
  'HSK9-PHILO-NEISHENG': {
    tokens: ['内圣外王（修身立德）', '己所不欲，勿施于人（仁爱推己）'],
    wrong: '领导只要管制度就好，不用自己先做好。(Trái tinh thần cốt lõi quản trị Nho gia)',
    correct: '现代组织治理可借鉴儒家修身仁爱之道，坚持以德服人与克己复礼，方能凝聚长久团队认同。',
    reason: 'Vận dụng nguyên lý Nho gia đòi hỏi giải thích rõ cầu nối từ tu dưỡng cá nhân (修身) đến cảm hóa tập thể (以德服人).',
  },
  'HSK9-PHILO-DAO': {
    tokens: ['顺其自然', '而', '无所不为 / 制衡调节'],
    wrong: '“无为”的意思是什么都不做只等着。(Hiểu sai hoàn toàn khái niệm Đạo gia)',
    correct: '道家“无为而治”并非消极无作为，而是顺应系统演化规律、巧妙借力制衡以实现大巧若拙式治理。',
    reason: 'Sĩ tử HSK 9 cần phân biệt "Vô vi" (không can thiệp thô bạo trái quy luật) với "Không làm gì" (不作为).',
  },
  'HSK9-PHILO-RONGHE': {
    tokens: ['既……复……（Kế thừa kép）', '取其精华，去其糟粕（Phê phán chọn lọc）'],
    wrong: '古代文化很好我们要全部照搬过来。(Thiếu tính biện chứng lịch sử)',
    correct: '面对传统文化，须学会理性取舍、古为今用，既保留人文沉淀，复于革故鼎新中完成时代蜕变。',
    reason: 'Kết cấu cổ điển 既……复…… đi với phương châm 取其精华，去其糟粕 giúp bài nghị luận cân bằng hai chiều.',
  },
  'HSK9-PHILO-LIUBAI': {
    tokens: ['留白之美', '言有尽而意无穷（含蓄共鸣）'],
    wrong: '翻译诗歌要把所有背景典故全塞进正文里解释清楚。(Phá vỡ mỹ học Ý tại ngôn ngoại)',
    correct: '跨文化传播贵在尊重含蓄留白之美，力求言有尽而意无穷，令不同语境受众触发深层意境共鸣。',
    reason: 'Thủ pháp lưu bạch (khoảng lặng) tạo sức gợi sâu hơn lời giải thích trực diện dài dòng.',
  },
  'HSK9-PHILO-DIALECTIC': {
    tokens: ['……固然 + Hiện tượng bề mặt，', '然究其根本 + Căn nguyên triết học……'],
    wrong: '现代人工作太忙所以都焦虑了，没有别的办法。(Phân tích nông bề mặt)',
    correct: '技术加速固然带来效率跃升，然究其根本，现代性异化焦虑唯有通过溯本求源、返璞归真方能安顿身心。',
    reason: 'Biện chứng HSK 9 chuyển từ nhận xét kỹ thuật bề nổi sang truy nguyên ý nghĩa tồn tại bằng cặp 固然……然究其根本…….',
  },
  'HSK9-FIN-SPILLOVER': {
    tokens: ['……外溢效应', '致使 + Đối tượng chịu tác động', '+ 承压（汇率 / 流动性）'],
    wrong: '美联储加息让发展中国家受不了。(Khẩu ngữ thiếu thuật ngữ kinh tế định lượng)',
    correct: '主要央行持续加息产生显著跨市场外溢效应，致使新兴经济体汇率稳定与资本流动性双重承压。',
    reason: 'Từ khóa 外溢效应……致使……承压 chuẩn hóa câu nhân quả trong bản tin kinh tế vĩ mô quốc tế.',
  },
  'HSK9-FIN-HEDGE': {
    tokens: ['若不加以 + Kiểm soát，', '恐将引发 + Hệ lụy', '+ 连锁反应（牵一发而动全身）'],
    wrong: '不控制金融泡沫的话大家都会出事。(Khẩu ngữ chung chung)',
    correct: '若不及时对高杠杆金融衍生品与资产泡沫加以审慎出清，恐将引发牵一发而动全身的连锁危机。',
    reason: 'Động từ hình thức 加以 + động từ 2 âm tiết (加以防范, 加以出清) tạo độ nén học thuật cực cao.',
  },
  'HSK9-FIN-NEGO': {
    tokens: ['基于 + Điều kiện tiên quyết + 前提下，', '我方拟 + Đề xuất ràng buộc（对赌 / 估值）'],
    wrong: '如果尽调没问题我们就想按这个价格买下。(Thiếu tính ràng buộc hợp đồng M&A)',
    correct: '基于尽调全面合规且估值模型核实无误的前提下，我方拟签署附带业绩对赌条款的并购协议。',
    reason: 'Trong đàm phán tài chính, 拟 biểu thị phương án đề xuất chính thức có tính cân nhắc chiến lược (khác 打算 khẩu ngữ).',
  },
  'HSK9-FIN-TECH': {
    tokens: ['不仅有望 + Giá trị trước mắt，', '更将重构 + Cấu trúc tương lai'],
    wrong: '数字货币以后可能很有用，也会改变很多。(Yếu về ngữ khí dự báo chuyên môn)',
    correct: '去中心化跨境本币清算基础设施不仅有望显著降本增效，更将全面赋能并重构全球金融信任体系。',
    reason: 'Cặp 有望……更将…… phân tách rõ hai tầng thời gian: triển vọng khả thi gần và tác động tái cấu trúc dài hạn.',
  },
  'HSK9-FIN-LETTER': {
    tokens: ['承蒙诸位 + 鼎力支持（Kính ngữ cổ đông）', '携手乘风破浪、行稳致远（Khích lệ tầm nhìn）'],
    wrong: '感谢大家一直给我们投资，明年我们肯定鼎力回报你们。(Lỗi kính ngữ: tự dùng 鼎力 cho bản thân mình!)',
    correct: '承蒙诸位股东长期鼎力支持，公司主营营收展现出强劲韧性；展望未来，必将乘风破浪、行稳致远。',
    reason: 'Cẩn trọng tuyệt đối: 承蒙 và 鼎力 là kính ngữ dành tôn vinh sự giúp đỡ từ đối tác/cổ đông dành cho mình.',
  },
  'HSK9-INTERP-CHUNK': {
    tokens: ['Tách Ý quần (意群切分)', '→', 'Dịch xuôi tuyến tính (顺句驱动)'],
    wrong: 'Đợi diễn giả đọc hết câu định ngữ 50 chữ mới dịch ngược từ danh từ cuối lên.',
    correct: '遇到超长前置定语时，借助“其”“并”“该现象表明”等衔接词及时意群切分，实现同声传译顺句驱动与从容应变。',
    reason: 'Khi phiên dịch cabin, giữ nhịp 顺句驱动 bằng các mệnh đề nối ngắn giúp bộ nhớ đệm không bị quá tải.',
  },
  'HSK9-DEBATE-PIVOT': {
    tokens: ['……诚非虚言（Nhận vế hợp lý），', '然若换言之（Chuyển trục lập luận）……'],
    wrong: '你的观点错了，完全不值得讨论。(Phản bác thô bạo dễ mất điểm thái độ phản biện)',
    correct: '反对者对短期成本之担忧诚非虚言，然若换言之、将时间轴拉长至十年维度，审慎思辨后的最优解便不言自明。',
    reason: 'Kỹ thuật Pivot (nhận một phần hợp lý rồi xoay trục tham chiếu) thể hiện bản lĩnh lập luận đỉnh cao.',
  },
  'HSK9-ESSAY-STYLE': {
    tokens: ['Bốn chữ đối xứng (四字格)', 'Câu ghép tăng tiến 3 tầng (层层递进)'],
    wrong: 'Viết liên tiếp các câu đơn giống hệt cấu trúc suốt bài 600 chữ.',
    correct: '全篇行文兼具思辨深度与语言文采，既有四字短语凝练收束，复以层层递进句式令结语意味隽永、字字珠玑。',
    reason: 'Đoạn văn HSK 9 cần phối hợp đan xen câu dài phân tích đa tầng và cụm 4 chữ chốt hạ nhịp nhàng.',
  },
  'HSK9-READ-MACRO': {
    tokens: ['Gạch bỏ trạng/định ngữ dài', 'Khóa trục 主语 – 谓语 – 宾语 & 潜台词'],
    wrong: 'Đọc từng chữ từ trái sang phải rồi quên mất chủ ngữ là ai khi gặp câu 80 chữ.',
    correct: '面对跨学科超长文献，首须提纲挈领锁定句子主干脉络并敏锐洞察潜台词，方能融会贯通、一目了然。',
    reason: 'Kỹ thuật 提纲挈领 (nắm trục chính) tăng gấp đôi tốc độ xử lý 98 câu trong 210 phút CBT.',
  },
  'HSK9-FINAL-CAPSTONE': {
    tokens: ['听 · 说 · 读 · 写 · 译', '融会贯通（98 câu / 210 phút / ≥ 240đ）'],
    wrong: 'Ôn lệch kỹ năng hoặc viết luận thiếu chuẩn ngữ vực 书面语.',
    correct: '经过五维能力全面淬炼与厚积薄发，考生必能于HSK九级巅峰考场游刃有余、登峰造极且实至名归。',
    reason: 'HSK 9 đòi hỏi đồng bộ 5 năng lực Nghe – Đọc – Viết – Biên dịch – Khẩu ngữ biện luận không có điểm yếu chí mạng.',
  },
};

export function getGrammarAstDetail(lessonMeta) {
  const fromBank = HSK_7_TO_9_GRAMMAR_AST_MAP[lessonMeta.grammarCode];
  if (fromBank) {
    return {
      formula_tokens: (fromBank.formulaTokens || []).map((t) => ({
        token: t.label_zh,
        role: t.label_vi,
        note: t.role,
      })),
      wrong: fromBank.wrong_zh,
      correct: fromBank.right_zh,
      reason: `${fromBank.explanationVi} (${fromBank.reason_vi})`,
    };
  }

  const manual = EXTRA_GRAMMAR_AST_DETAILS[lessonMeta.grammarCode];
  if (manual) {
    return {
      formula_tokens: manual.tokens.map((t, i) => ({
        token: t,
        role: i === 0 ? 'Tiền đề / Thành phần đầu' : i === 1 ? 'Cầu nối / Cấu trúc lõi' : 'Vế chốt / Hệ quả',
      })),
      wrong: manual.wrong,
      correct: manual.correct,
      reason: manual.reason,
    };
  }

  // Also check Part 1 dictionary inside this module:
  if (GRAMMAR_AST_BY_CODE[lessonMeta.grammarCode]) {
    return GRAMMAR_AST_BY_CODE[lessonMeta.grammarCode];
  }

  // HSK 9 specific dynamic-precision synthesis derived directly from lessonMeta tokens (no generic filler)
  const parts = String(lessonMeta.grammarPattern || '')
    .split(/[/……→——]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const [v1 = lessonMeta.zh, v2 = '统筹'] = lessonMeta.keyVocab || [];
  const lastIdiom = (lessonMeta.keyVocab || [])[lessonMeta.keyVocab?.length - 1] || v1;

  return {
    formula_tokens: (parts.length > 0 ? parts : [lessonMeta.grammarPattern]).map((p, i) => ({
      token: p,
      role: i === 0 ? `Khung cú pháp cốt lõi (${lessonMeta.grammarCode})` : `Thành tố triển khai #${i + 1}`,
    })),
    wrong: `[Lỗi khẩu ngữ/trực dịch] Ở bài "${lessonMeta.vi}", tránh thay "${lessonMeta.grammarPattern}" bằng từ nối đơn giản kiểu 所以 / 但是 hoặc ghép sai "${v1}" vào văn phong giao tiếp xuồng xã.`,
    correct: `[Chuẩn HSK ${lessonMeta.level}] 围绕“${lessonMeta.zh}”，当依托“${lessonMeta.grammarPattern}”统筹运用${v1}与${v2}，以臻${lastIdiom}之境。`,
    reason: `Cấu trúc ${lessonMeta.grammarPattern} (${lessonMeta.grammarTitleVi}) đòi hỏi đúng ngữ vực trang trọng bậc HSK ${lessonMeta.level}, đồng thời giữ chặt mối phối hợp từ "${v1}" và thành ngữ "${lastIdiom}".`,
  };
}
