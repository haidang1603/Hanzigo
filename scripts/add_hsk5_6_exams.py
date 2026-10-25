import sys

def main():
    target_path = r"d:\DELL\Dowloads\HanziGo\src\data\hskExamsData.js"
    with open(target_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update HSK_EXAMS
    # We find the boundary "export const HSK_QUESTIONS"
    exam_marker = "export const HSK_QUESTIONS"
    if exam_marker not in content:
        print("Cannot find export const HSK_QUESTIONS")
        sys.exit(1)

    parts = content.split(exam_marker)
    exams_part = parts[0]
    rest_part = parts[1]

    # in exams_part, the last ]; closes HSK_EXAMS
    last_bracket_idx = exams_part.rfind("];")
    if last_bracket_idx == -1:
        print("Cannot find ]; in exams_part")
        sys.exit(1)

    hsk5_6_exams = """  {
    id: 'hsk5-mock-01',
    title: 'Đề Luyện Thi Thử HSK 5 Toàn Diện Số 1 (Mô Phỏng 3 Phân Môn)',
    level: 'HSK 5',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 125,
    total_questions: 6,
    passing_score: 180,
    max_score: 300,
    description: 'Đề mô phỏng định dạng HSK 5 toàn diện 3 kỹ năng Nghe hiểu, Đọc hiểu và Viết luận. Lưu ý: Đây là đề luyện tập mô phỏng rút gọn chuẩn năng lực HanziGo, không phải đề thi chính thức của CTI.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk5-01',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-24',
    is_published: true
  },
  {
    id: 'hsk6-mock-01',
    title: 'Đề Luyện Thi Thử HSK 6 Đỉnh Phong Số 1 (Mô Phỏng Nâng Cao & Bệnh Cú)',
    level: 'HSK 6',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 140,
    total_questions: 6,
    passing_score: 180,
    max_score: 300,
    description: 'Đề mô phỏng cấp độ cao nhất HSK 6 bao gồm nghe hiểu phóng sự, nhận diện lỗi ngữ pháp (病句), đọc hiểu báo chí học thuật và kỹ năng tóm tắt văn bản. Lưu ý: Đây là bài luyện tập mô phỏng rút gọn, không đại diện toàn bộ 101 câu của kỳ thi CTI.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk6-01',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-24',
    is_published: true
  }
];
"""
    new_exams_part = exams_part[:last_bracket_idx].rstrip() + ",\n" + hsk5_6_exams

    # 2. Update HSK_QUESTIONS in rest_part
    # Find boundary "export function getFullExamById"
    helper_marker = "export function getFullExamById"
    if helper_marker not in rest_part:
        print("Cannot find export function getFullExamById")
        sys.exit(1)

    q_parts = rest_part.split(helper_marker)
    questions_part = q_parts[0]
    helper_part = q_parts[1]

    # in questions_part, find last ];
    last_q_bracket_idx = questions_part.rfind("];")
    if last_q_bracket_idx == -1:
        print("Cannot find ]; in questions_part")
        sys.exit(1)

    hsk5_6_questions = """  // ==========================================
  // EXAM: hsk5-mock-01 (6 câu mô phỏng HSK 5)
  // ==========================================
  {
    id: 'q-hsk5-01-01',
    exam_id: 'hsk5-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 1,
    question_type: 'multiple_choice',
    prompt: '听对话，选择最符合内容的选项：',
    pinyin: 'Tīng duìhuà, xuǎnzé zuì fúhé nèiróng de xuǎnxiàng:',
    translation: 'Nghe hội thoại, chọn đáp án phù hợp nhất với nội dung:',
    audio_url: '',
    audio_script: '女：李总，关于这次跨国并购案，对方财务顾问提出了几项附带条款，似乎在估值上还有分歧。\\n男：我们必须坚持审慎原则。你立刻组织法律和审计团队，对他们的核心专利资产重新进行全面尽职调查。\\n问：男的主要要求女的做什么？',
    options: [
      { text: '重新对对方核心专利进行尽职调查 (Tái thẩm định độc lập bằng sáng chế cốt lõi)', pinyin: 'Chóngxīn duì duìfāng héxīn zhuānlì jìnxíng jìnzhí diàochá', translation: 'Thẩm định tài sản trí tuệ' },
      { text: '立即答应对方提出的估值要求 (Lập tức đồng ý định giá của đối tác)', pinyin: 'Lìjí dāyìng duìfāng tíchū de gūzhí yāoqiú', translation: 'Đồng ý định giá' },
      { text: '终止所有商务合作谈判 (Chấm dứt đàm phán hợp tác)', pinyin: 'Zhōngzhǐ suǒyǒu shāngwù hézuò tánpàn', translation: 'Chấm dứt đàm phán' },
      { text: '解散法务与审计团队 (Giải tán đội ngũ pháp lý)', pinyin: 'Jiěsàn fǎwù yǔ shěnjì tuánduì', translation: 'Giải tán nhóm pháp lý' }
    ],
    correct_option_index: 0,
    explanation: 'Người nam nói: "我们必须坚持审慎原则。你立刻组织法律和审计团队，对他们的核心专利资产重新进行全面尽职调查。" Do đó đáp án chính xác là tiến hành thẩm định chuyên sâu (尽职调查).',
    points: 15
  },
  {
    id: 'q-hsk5-01-02',
    exam_id: 'hsk5-mock-01',
    part_type: 'listening',
    part_number: 2,
    question_number: 2,
    question_type: 'multiple_choice',
    prompt: '听短文，判断讲话者的主要观点：',
    pinyin: 'Tīng duǎnwén, pànduàn jiǎnghuà zhě de zhǔyào guāndiǎn:',
    translation: 'Nghe bài phát biểu, xác định quan điểm chủ đạo của diễn giả:',
    audio_url: '',
    audio_script: '心理学研究表明，拖延症的本质并非时间管理能力欠缺，而往往是情绪调节困难的体现。当面对一项令人生畏的任务时，大脑本能地逃避当下的焦虑，转而寻求即时满足。因此，克服拖延的关键不是制定更密集的计划，而是学会接纳负面情绪并把任务分解至微不足道的行动。\\n问：根据短文，克服拖延的关键是什么？',
    options: [
      { text: '接纳负面情绪并拆解微小行动 (Chấp nhận cảm xúc tiêu cực và chia nhỏ hành động)', pinyin: 'Jiēnà fùmiàn qíngxù bìng chāijiě wēixiǎo xíngdòng', translation: 'Tiếp nhận cảm xúc và chia nhỏ nhiệm vụ' },
      { text: '制定更加严密繁重的时间表 (Lập thời gian biểu khắt khe hơn nữa)', pinyin: 'Zhìdìng gèngjiā yánmì fánzhòng de shíjiānbiǎo', translation: 'Thời gian biểu khắt khe' },
      { text: '完全逃避令人焦虑的任务 (Trốn tránh hoàn toàn nhiệm vụ)', pinyin: 'Wánquán táobì lìngrén jiāolǜ de rènwu', translation: 'Trốn tránh áp lực' },
      { text: '随时寻求即时的感官满足 (Luôn tìm kiếm thỏa mãn tức thời)', pinyin: 'Suíshí xúnqiú jíshí de gǎnguān mǎnzú', translation: 'Thỏa mãn tức thời' }
    ],
    correct_option_index: 0,
    explanation: 'Câu kết đoạn khẳng định: "克服拖延的关键不是制定更密集的计划，而是学会接纳负面情绪并把任务分解至微不足道的行动。"',
    points: 15
  },
  {
    id: 'q-hsk5-01-03',
    exam_id: 'hsk5-mock-01',
    part_type: 'reading',
    part_number: 1,
    question_number: 3,
    question_type: 'multiple_choice',
    prompt: '选词填空：选择最恰当的一组词语填入空格：',
    pinyin: 'Xuǎncí tiánkòng: Xuǎnzé zuì qiàdàng de yì zǔ cíyǔ tiánrù kònggé:',
    translation: 'Chọn từ điền chỗ trống thích hợp nhất:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '推卸 —— 忽视 —— 迫在眉睫 (Thoái thác — Coi nhẹ — Cấp bách ngay trước mắt)', pinyin: 'tuīxiè — hūshì — pòzàiméijié', translation: 'Đẩy trách nhiệm — ngó lơ — cấp bách' },
      { text: '承担 —— 重视 —— 息息相关 (Đảm đương — Coi trọng — Gắn bó mật thiết)', pinyin: 'chéngdān — zhòngshì — xīxīxiāngguān', translation: 'Gánh vác — coi trọng — liên quan mật thiết' },
      { text: '逃避 —— 抵触 —— 漫不经心 (Trốn tránh — Xung đột — Vô tâm)', pinyin: 'táobì — dǐchù — mànbùjīngxīn', translation: 'Trốn tránh — đối kháng — hờ hững' },
      { text: '放弃 —— 观察 —— 井井有条 (Từ bỏ — Quan sát — Ngăn nắp trật tự)', pinyin: 'fàngqì — guānchá — jǐngjǐngyǒutiáo', translation: 'Bỏ cuộc — quan sát — trật tự' }
    ],
    correct_option_index: 1,
    explanation: 'Văn cảnh bảo vệ môi trường: Doanh nghiệp cần [承担] trách nhiệm xã hội, [重视] phát triển bền vững vì tương lai nhân loại [息息相关] (liên quan mật thiết). Nhóm từ B mang tính học thuật và tương thích ngữ nghĩa chặt chẽ.',
    points: 15
  },
  {
    id: 'q-hsk5-01-04',
    exam_id: 'hsk5-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 4,
    question_type: 'multiple_choice',
    prompt: '阅读短文回答问题：作者对“失败”持何种态度？',
    pinyin: 'Yuèdú duǎnwén huídá wèntí: Zuòzhě duì “shībài” chí hézhǒng tàidu?',
    translation: 'Đọc đoạn văn và trả lời câu hỏi: Tác giả có thái độ như thế nào đối với "thất bại"?',
    audio_url: '',
    audio_script: '真正的探索者从不把失败视为终点，而将其视作排除错误路径的宝贵数据。在科学史上，无数突破性的发现恰恰诞生于对异常结果的重新审视。如果一味回避错误，创新的火花也将随之熄灭。',
    options: [
      { text: '失败是修正方向与激发创新的必要财富 (Thất bại là tài sản cần thiết để sửa hướng và khơi nguồn đổi mới)', pinyin: 'Shībài shì xiūzhèng fāngxiàng yǔ jīfā chuàngxīn de bìyào cáifù', translation: 'Thất bại là tài sản' },
      { text: '失败意味着彻底的无能与资源的浪费 (Thất bại đồng nghĩa với bất tài và lãng phí)', pinyin: 'Shībài yìwèizhe chèdǐ de wúnéng yǔ zīyuán de làngfèi', translation: 'Thất bại là bất tài' },
      { text: '应当竭尽全力隐瞒并避免一切错误 (Nên cố gắng che giấu sai sót)', pinyin: 'Yīngdāng jiéjìn quánlì yǐnmán bìng bìmiǎn yíqiè cuòwù', translation: 'Che giấu lỗi' },
      { text: '异常结果毫无科学探讨价值 (Kết quả dị thường không có giá trị)', pinyin: 'Yìcháng jiéguǒ háowú kēxué tàntǎo jiàzhí', translation: 'Không có giá trị' }
    ],
    correct_option_index: 0,
    explanation: 'Tác giả xem thất bại là "排除错误路径的宝贵数据" và là tiền đề cho "突破性的发现", do đó thái độ là xem thất bại như tài sản kích hoạt sáng tạo.',
    points: 15
  },
  {
    id: 'q-hsk5-01-05',
    exam_id: 'hsk5-mock-01',
    part_type: 'writing',
    part_number: 1,
    question_number: 5,
    question_type: 'ordering',
    prompt: '书写第一部分：连词成句（请排出正确的语序）：',
    pinyin: 'Shūxiě dì-yī bùfen: Lián cí chéng jù (Qǐng pǎi chū zhèngquè de yǔxù):',
    translation: 'Phần Viết 1: Sắp xếp các cụm từ thành câu hoàn chỉnh đúng ngữ pháp:',
    audio_url: '',
    audio_script: '',
    words: ['这场辩论赛', '双方辩手', '出色的表现', '充分展现了', '敏捷的思维'],
    options: [
      { text: '这场辩论赛 充分展现了 双方辩手 敏捷的思维 出色的表现', pinyin: '', translation: '' },
      { text: '双方辩手 出色的表现 充分展现了 这场辩论赛 敏捷的思维', pinyin: '', translation: '' },
      { text: '这场辩论赛 双方辩手的出色表现 充分展现了 敏捷的思维 (Cú pháp chuẩn)', pinyin: 'Zhè chǎng biànlùnsài shuāngfāng biànshǒu de chūsè biǎoxiàn chōngfèn zhǎnxiàn le mǐnjié de sīwéi', translation: 'Trận tranh biện đã thể hiện xuất sắc tư duy nhạy bén của các bên' },
      { text: '敏捷的思维 这场辩论赛 充分展现了 双方辩手', pinyin: '', translation: '' }
    ],
    correct_option_index: 2,
    explanation: 'Cấu trúc câu phức HSK 5: Định ngữ chỉ phạm vi [这场辩论赛] + Cụm chủ ngữ [双方辩手的出色表现] + Phó từ bổ nghĩa vị ngữ [充分展现了] + Tân ngữ [敏捷的思维].',
    points: 20
  },
  {
    id: 'q-hsk5-01-06',
    exam_id: 'hsk5-mock-01',
    part_type: 'writing',
    part_number: 2,
    question_number: 6,
    question_type: 'multiple_choice',
    prompt: '书写第二部分：结合给出的5个词语，选择最通顺且切题的80字短文段落：\\n词语：[契约、诚信、合作、长远、共赢]',
    pinyin: 'Shūxiě dì-èr bùfen: Jiéhé gěichū de 5 gè cíyǔ, xuǎnzé zuì tōngshùn qiě qiètí de 80 zì duǎnwén duànluò: [Qìyuē, chéngxìn, hézuò, chángyuǎn, gòngyíng]',
    translation: 'Phần Viết 2: Kết hợp 5 từ khóa [Khế ước, Thành tín, Hợp tác, Lâu dài, Cùng thắng], chọn đoạn văn viết chuẩn mực nhất:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '在商业往来中，严谨的契约精神与立足诚信的品格是建立深度合作的基础。唯有放下眼前短期私利，放眼长远发展，双方才能真正实现互利共赢的稳固局面。', pinyin: 'Zài shāngyè wǎnglái zhōng, yánjǐn de qìyuē jīngshén...', translation: 'Vận dụng chuẩn xác cả 5 từ khóa trong văn phong nghị luận thương mại.' },
      { text: '我今天去买东西，没有契约也没有诚信，合作很不开心，以后不能长远，也不能共赢。', pinyin: 'Wǒ jīntiān qù mǎi dōngxi...', translation: 'Văn phong khẩu ngữ thô sơ, không đạt chuẩn HSK 5.' },
      { text: '契约是纸张，诚信是说话，合作是两个人，长远是时间，共赢是大家赢。', pinyin: 'Qìyuē shì zhǐzhāng...', translation: 'Giải nghĩa từ vụn vặt, thiếu tính kết nối đoạn văn.' },
      { text: '由于没有钱，所以我们无法合作，契约也失效了。', pinyin: 'Yóuyú méiyǒu qián...', translation: 'Thiếu từ khóa và lạc đề.' }
    ],
    correct_option_index: 0,
    explanation: 'Đoạn A liên kết mượt mà cả 5 từ khóa [契约、诚信、合作、长远、共赢] bằng cấu trúc nghị luận: "在...中，...是...基础。唯有...，才能...". Đạt chuẩn mực tối đa của bài viết 80 chữ HSK 5.',
    points: 20
  },

  // ==========================================
  // EXAM: hsk6-mock-01 (6 câu đỉnh phong HSK 6)
  // ==========================================
  {
    id: 'q-hsk6-01-01',
    exam_id: 'hsk6-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 1,
    question_type: 'multiple_choice',
    prompt: '听高端访谈录音，选择核心主旨：',
    pinyin: 'Tīng gāoduān fǎngtán lùyīn, xuǎnzé héxīn zhǔzhǐ:',
    translation: 'Nghe đoạn phỏng vấn chuyên gia, chọn thông điệp cốt lõi:',
    audio_url: '',
    audio_script: '主持人：面对新一代生成式人工智能的爆发式增长，您如何评估它对传统产业劳动力生态的重塑？\\n学者：技术的迭代固然会淘汰一部分程序化、机械性的岗位，但这并不意味着人类劳动价值的贬损。恰恰相反，它迫使教育体系与职业培训向审辩式思维、审美鉴赏力以及复杂人文共情等深层素养转型。未来的核心竞争力绝非与算法比拼算力，而在于人机协同中对价值尺度的终极把控。\\n问：学者认为未来人类的核心竞争力是什么？',
    options: [
      { text: '人机协同中对价值尺度的终极把控 (Khả năng kiểm soát chuẩn mực giá trị trong tương tác người - máy)', pinyin: 'Rén-jī xiétóng zhōng duì jiàzhí chǐdù de zhōngjí bǎkòng', translation: 'Kiểm soát chuẩn mực giá trị' },
      { text: '在计算速度和记忆力上全面超越算法 (Vượt qua thuật toán về tốc độ và ghi nhớ)', pinyin: 'Zài jìsuàn sùdù hé jìyìlì shàng quánmiàn chāoyuè suànfǎ', translation: 'Cạnh tranh máy móc' },
      { text: '彻底抵制并禁止人工智能进入传统产业 (Tẩy chay trí tuệ nhân tạo)', pinyin: 'Chèdǐ dǐzhì bìng jìnzhǐ réngōng zhìnéng jìnrù chuántǒng chǎnyè', translation: 'Tẩy chay AI' },
      { text: '保留所有机械性与程序化的初级工作 (Duy trì công việc rập khuôn)', pinyin: 'Bǎoliú suǒyǒu jīxièxìng yǔ chéngxùhuà de chūjí gōngzuò', translation: 'Giữ việc cơ bản' }
    ],
    correct_option_index: 0,
    explanation: 'Học giả kết luận: "未来的核心竞争力绝非与算法比拼算力，而在于人机协同中对价值尺度的终极把控。" Đáp án A thể hiện chính xác bản chất.',
    points: 15
  },
  {
    id: 'q-hsk6-01-02',
    exam_id: 'hsk6-mock-01',
    part_type: 'listening',
    part_number: 2,
    question_number: 2,
    question_type: 'multiple_choice',
    prompt: '听学术报告短文，选出理解正确的一项：',
    pinyin: 'Tīng xuéshù bàogào duǎnwén, xuǎn chū lǐjiě zhèngquè de yí xiàng:',
    translation: 'Nghe báo cáo học thuật, chọn nhận định chính xác:',
    audio_url: '',
    audio_script: '深海热泉生态系统的发现彻底颠覆了以往生命完全依赖光合作用的经典假说。在数千米漆黑、高压、富含硫化氢的极端海底环境中，化能合成细菌构成了初级生产力，支撑起繁荣独特的化能自养生物圈。这不仅拓宽了生物圈的物理边界，更为地外天体如木卫二、土卫二是否存在生命提供了关键的地缘比对样本。\\n问：深海热泉生态系统带来的重大科学启示是什么？',
    options: [
      { text: '颠覆了生命全凭光合作用的传统假说，为地外生命探测提供理论支撑 (Lật đổ định kiến quang hợp độc tôn, mở ra cơ sở tìm kiếm sự sống ngoài vũ trụ)', pinyin: 'Diānfù le shēngmìng quán píng guānghé zuòyòng de chuántǒng jiǎshuō...', translation: 'Chứng minh hóa năng tự dưỡng' },
      { text: '证明深海极端环境没有任何生物生存 (Chứng minh đáy biển không có sự sống)', pinyin: 'Zhèngmíng shēnhǎi jíduān huánjìng méiyǒu rènhé shēngwù shēngcún', translation: 'Vô sinh quyển' },
      { text: '所有地球生物都必须依赖硫化氢生存 (Tất cả sinh vật đều cần H2S)', pinyin: 'Suǒyǒu dìqiú shēngwù dōu bìxū yīlài liúhuàqīng shēngcún', translation: 'Bắt buộc H2S' },
      { text: '木卫二的环境与地球热带雨林完全相同 (Môi trường Europa giống rừng nhiệt đới)', pinyin: 'Mùwèi èr de huánjìng yǔ dìqiú rèdài yǔlín wánquán xiāngtóng', translation: 'Giống rừng rậm' }
    ],
    correct_option_index: 0,
    explanation: 'Đoạn văn nhấn mạnh hai hệ quả: 颠覆了以往生命完全依赖光合作用的经典假说 và 为地外天体是否存在生命提供了关键的地缘比对样本.',
    points: 15
  },
  {
    id: 'q-hsk6-01-03',
    exam_id: 'hsk6-mock-01',
    part_type: 'reading',
    part_number: 1,
    question_number: 3,
    question_type: 'multiple_choice',
    prompt: '【HSK 6 特色题型：找病句】下列句子中，有语病的一句是：',
    pinyin: '【HSK 6 tèsè tíxíng: Zhǎo bìngjù】Xiàliè jùzi zhōng, yǒu yǔbìng de yí jù shì:',
    translation: '【Dạng bài đặc trưng HSK 6: Tìm câu có lỗi ngữ pháp】Trong các câu sau, câu nào mắc lỗi ngữ bệnh?',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '经过几代科研工作者的艰苦攻关，使该型号超导量子芯片终于突破了关键技术瓶颈。 (Câu khuyết chủ ngữ do lạm dụng giới từ)', pinyin: 'Jīngguò jǐ dài kēyán gōngzuòzhě de jiānkǔ gōngguān, shǐ gāi xínghào...', translation: 'Mắc bệnh lạm dụng "经过...使..." làm triệt tiêu chủ ngữ thực của câu' },
      { text: '在数字经济迅猛发展的今天，数据要素对实体产业的赋能效应日益凸显。', pinyin: 'Zài shùzì jīngjì xùnměng fāzhǎn de jīntiān, shùjù yàosù duì shítǐ chǎnyè...', translation: 'Câu chuẩn xác cấu trúc và sắc thái nghĩa' },
      { text: '博大精深的中华传统文化，正以崭新的姿态融入当代青年群体的日常生活。', pinyin: 'Bódà jīngshēn de zhōnghuá chuántǒng wénhuà, zhèng yǐ zhǎnxīn de zītài...', translation: 'Câu chuẩn ngữ pháp' },
      { text: '能否健全生态补偿长效机制，是守护绿水青山、实现区域协同发展的制度基石。', pinyin: 'Néng fǒu jiànquán shēngtài bǔcháng chángxiào jīzhì...', translation: 'Cấu trúc đối ứng hai mặt chuẩn xác' }
    ],
    correct_option_index: 0,
    explanation: 'Câu A là dạng bệnh cú kinh điển nhất HSK 6: "Lạm dụng giới từ dẫn đến khuyết chủ ngữ" (介词滥用导致主语残缺). Dùng "经过...使...", cả hai vế đều biến thành trạng ngữ, khiến câu không còn chủ ngữ. Sửa đúng: Bỏ "使" để "该型号超导量子芯片" làm chủ ngữ chính của câu.',
    points: 15
  },
  {
    id: 'q-hsk6-01-04',
    exam_id: 'hsk6-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 4,
    question_type: 'multiple_choice',
    prompt: '阅读学术评论，回答问题：文中的“和而不同”体现了何种哲学智慧？',
    pinyin: 'Yuèdú xuéshù pínglùn, huídá wèntí: Wénzhōng de “hé ér bù tóng” tǐxiàn le hézhǒng zhéxué zhìhuì?',
    translation: 'Đọc đoạn bình luận học thuật, giải nghĩa triết học của "Hòa nhi bất đồng" (和而不同):',
    audio_url: '',
    audio_script: '《论语》有云：“君子和而不同，小人同而不和。”所谓“和”，是在承认并尊重事物多样性与差异性的前提下，实现更高层面的动态和谐与互补协调；而“同”则是消解个性、强求划一的盲目顺从。“和而不同”不仅是中国古人处理人际关系的准则，更为当今跨文化交流与全球文明互鉴提供了超越冷战对抗思维的东方智慧。',
    options: [
      { text: '承认尊重差异多样性，在互补中追求动态和谐 (Tôn trọng dị biệt và đa nguyên, theo đuổi sự hài hòa phát triển tương hỗ)', pinyin: 'Chéngrèn zūnzhòng chāyì duōyàngxìng, zài hùbǔ zhōng zhuīqiú dòngtài héxié', translation: 'Tôn trọng sự đa dạng để hòa hợp' },
      { text: '强行抹杀所有不同声音，要求步调绝对统一 (Xóa bỏ mọi tiếng nói khác biệt để đồng nhất hóa)', pinyin: 'Qiángxíng mǒshā suǒyǒu bùtóng shēngyīn, yāoqiú bùdiào juéduì tǒngyī', translation: 'Cưỡng chế đồng nhất' },
      { text: '凡事盲目妥协奉承，缺乏独立人格 (Thỏa hiệp mù quáng thiếu nhân cách độc lập)', pinyin: 'Fánshì mángmù tuǒxié fèngcheng, quēfá dúlì réngé', translation: 'Thỏa hiệp vô nguyên tắc' },
      { text: '拒绝与任何不同观点的人产生交往 (Từ chối giao tiếp với người bất đồng chính kiến)', pinyin: 'Jùjué yǔ rènhé bùtóng guāndiǎn de rén chǎnshēng jiāowǎng', translation: 'Cô lập bài ngoại' }
    ],
    correct_option_index: 0,
    explanation: 'Đoạn văn phân tích rõ ràng: "所谓和，是在承认并尊重事物多样性与差异性的前提下，实现更高层面的动态和谐与互补协调".',
    points: 15
  },
  {
    id: 'q-hsk6-01-05',
    exam_id: 'hsk6-mock-01',
    part_type: 'reading',
    part_number: 3,
    question_number: 5,
    question_type: 'multiple_choice',
    prompt: '选词填空：选择最契合高级报刊政论语境的四字成语组合：',
    pinyin: 'Xuǎncí tiánkòng: Xuǎnzé zuì qìhé gāojí bàokān zhènglùn yǔjìng de sìzì chéngyǔ zǔhé:',
    translation: 'Chọn nhóm thành ngữ HSK 6 cao cấp thích hợp nhất với văn cảnh bình luận thời sự:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '居安思危 —— 防微杜渐 —— 运筹帷幄 (Lo xa lúc an bình — Ngăn chặn từ mầm mống — Bày mưu tính kế điều binh)', pinyin: 'jū\'ānsīwēi — fángwēidùjiàn — yùnchóuwéiwò', translation: 'Thành ngữ tư duy chiến lược đỉnh cao' },
      { text: '自相矛盾 —— 掩耳盗铃 —— 画蛇添足 (Mâu thuẫn — Bịt tai trộm chuông — Vẽ rắn thêm chân)', pinyin: 'zìxiāng máodùn — yǎn\'ěrdàolíng — huàshétiānzú', translation: 'Thành ngữ tiêu cực chỉ sự vụng về' },
      { text: '朝三暮四 —— 走马观花 —— 井底之蛙 (Sáng ba chiều bốn — Cưỡi ngựa xem hoa — Ếch ngồi đáy giếng)', pinyin: 'zhāosānmùsì — zǒumǎguānhuā — jǐngdǐzhīwā', translation: 'Thành ngữ chỉ sự thiển cận' },
      { text: '南辕北辙 —— 守株待兔 —— 拔苗助长 (Trống đánh xuôi kèn thổi ngược — Ôm cây đợi thỏ — Đốt cháy giai đoạn)', pinyin: 'nányuánběizhé — shǒuzhūdàitù — bámiáozhùzhǎng', translation: 'Thành ngữ phản tác dụng' }
    ],
    correct_option_index: 0,
    explanation: 'Trong hoạch định chiến lược kinh tế vĩ mô và phòng ngừa rủi ro, tam tấu thành ngữ HSK 6 [居安思危、防微杜渐、运筹帷幄] là chuẩn mực văn phong cao cấp.',
    points: 20
  },
  {
    id: 'q-hsk6-01-06',
    exam_id: 'hsk6-mock-01',
    part_type: 'writing',
    part_number: 1,
    question_number: 6,
    question_type: 'multiple_choice',
    prompt: '【HSK 6 书写缩写要领】阅读1000字叙事文后进行400字缩写，以下哪项操作符合官方评分准则？',
    pinyin: '【HSK 6 Shūxiě suōxiě yàolǐng】Yuèdú 1000 zì xùshìwén hòu jìnxíng 400 zì suōxiě, yǐxià nǎ xiàng cāozuò fúhé guānfāng píngfēn zhǔnzé?',
    translation: '【Kỹ năng viết tóm tắt HSK 6】Khi tóm tắt văn bản 1000 chữ thành 400 chữ, thao tác nào dưới đây chuẩn xác theo tiêu chuẩn khảo thí?',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '忠实于原文叙事主线与因果脉络，提炼核心事件，不得掺入个人主观评论 (Trung thực với mạch truyện và nhân quả nguyên tác, cô đọng biến cố cốt lõi, tuyệt đối KHÔNG lồng bình luận chủ quan cá nhân)', pinyin: 'Zhōngshí yú yuánwén xùshì zhǔxiàn...', translation: 'Quy tắc vàng tóm tắt văn bản HSK 6' },
      { text: '必须加入大量个人读后感和主观议论抒情 (Cần thêm nhiều cảm nghĩ và bình luận cá nhân)', pinyin: 'Bìxū jiārù dàliàng gèrén dúhòugǎn...', translation: 'Sai lầm làm trừ điểm nặng' },
      { text: '可以任意更改原著主角姓名和故事结局 (Có thể tự đổi kết thúc truyện)', pinyin: 'Kěyǐ rènyì gēnggǎi yuánzhù zhǔjiǎo xìngmíng...', translation: 'Xuyên tạc cốt truyện' },
      { text: '直接抄写原文前两段凑足400字 (Chép nguyên vẹn 2 đoạn đầu)', pinyin: 'Zhíjiē chāoxiě yuánwén qián liǎng duàn...', translation: 'Gian lận bị điểm liệt' }
    ],
    correct_option_index: 0,
    explanation: 'Tiêu chuẩn chấm thi Viết HSK 6: Đề bài yêu cầu "缩写" (tóm tắt khách quan). Thí sinh phải bảo lưu ngôi kể thứ 3, bám sát các sự kiện mấu chốt, tuyệt đối không được đưa quan điểm, cảm nhận cá nhân (không viết thành bài văn "读后感").',
    points: 20
  }
];
"""
    new_questions_part = questions_part[:last_q_bracket_idx].rstrip() + ",\n" + hsk5_6_questions

    final_content = new_exams_part + "\nexport const HSK_QUESTIONS" + new_questions_part + "\nexport function getFullExamById" + helper_part

    with open(target_path, "w", encoding="utf-8") as f:
        f.write(final_content)

    print("SUCCESS: Updated hskExamsData.js with HSK 5 and HSK 6 exams and questions!")

if __name__ == "__main__":
    main()
