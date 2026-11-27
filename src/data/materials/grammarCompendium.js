/**
 * Self-authored HanziGo Grammar Compendium Pack (HSK 1 -> HSK 7-9)
 * Loaded lazily via dynamic import when a learner opens a grammar guide.
 */

export const GRAMMAR_COMPENDIUM_PACK = [
  {
    id: 'hz-gram-hsk1-2-core',
    title: 'Cẩm Nang Ngữ Pháp Nền Tảng HSK 1–2: Trật Tự Câu & Động Từ Cốt Lõi',
    title_cn: 'HSK 1–2 基础语法手册：语序与核心句型',
    category: 'Ngữ pháp chuyên sâu',
    guideType: 'Ngữ pháp',
    academic_category: 'grammar',
    examSystem: 'both',
    exam_version: 'both',
    level: 'HSK 1-2',
    practiceLevel: 'HSK 1',
    skill: 'grammar',
    skills: ['Ngữ pháp', 'Đọc hiểu', 'Viết & Thuận bút'],
    estimatedMinutes: 15,
    summary: 'Tổng hợp 5 cấu trúc xương sống HSK 1–2: 是/有/在, trật tự Thời gian + Địa điểm + Động tác, phân biệt 不 vs 没 và trợ từ 了/吗/呢.',
    description: 'Bộ quy tắc cú pháp nhập môn giúp học viên Việt Nam đặt câu chuẩn tiếng Trung ngay từ tuần đầu, tránh lỗi dịch ngược trật tự danh từ và dùng sai 不/没.',
    tags: ['Ngữ pháp', 'HSK 1', 'HSK 2', 'Trật tự câu', '了', '不 và 没'],
    pinyinKeywords: ['yuxu', 'shi', 'you', 'zai', 'bu', 'mei', 'le', 'ngu phap'],
    updatedAt: '2026-11-28',
    verified_date: '2026-11-28',
    host_type: 'hanzigo_original',
    verificationStatus: 'curated',
    license: 'Tài liệu Giáo dục Mở HanziGo',
    publisher: 'Ban Học thuật HanziGo',
    author: 'Ban Học thuật HanziGo',
    format: 'Cẩm nang tương tác',
    sourceUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    downloadUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    worksheetChars: '是 有 在 吗 呢 了 没 不 很 的',
    isInteractiveGuide: true,
    packKey: 'grammar',
    contentBlocks: [
      {
        type: 'formula',
        heading: 'Công thức vàng trật tự câu & phủ định HSK 1–2',
        formula: 'Chủ ngữ (S) + Thời gian + Nơi chốn + Cách thức + Động từ (V) + Tân ngữ (O)',
        explanation: 'Khác với tiếng Việt (địa điểm và thời gian thường đứng cuối câu), tiếng Trung đặt trạng ngữ Thời gian và Nơi chốn đứng TRƯỚC động từ chính. Ngoài ra, tính từ làm vị ngữ nối trực tiếp bằng phó từ mức độ (很, 真, 非常) chứ KHÔNG dùng 是.',
        notes: [
          '不 (bù): phủ định hiện tại, tương lai, thói quen hoặc ý chí (我不去 / Tôi không đi).',
          '没 / 没有 (méi / méiyǒu): phủ định hành động đã xảy ra trong quá khứ hoặc phủ định động từ 有 (昨天我没去 / Hôm qua tôi đã không đi).',
          'Định ngữ luôn đứng TRƯỚC trung tâm ngữ kèm 的 (我的朋友 / bạn của tôi, tiếng Việt ngược lại).'
        ]
      },
      {
        type: 'examples',
        heading: 'Ví dụ minh họa chuẩn ngữ cảnh',
        items: [
          {
            hanzi: '我明天上午在图书馆学习汉语。',
            pinyin: 'Wǒ míngtiān shàngwǔ zài túshūguǎn xuéxí Hànyǔ.',
            vietnamese: 'Sáng mai tôi học tiếng Trung ở thư viện.',
            note: 'Thời gian (明天上午) + Nơi chốn (在图书馆) đều đứng trước động từ 学习.'
          },
          {
            hanzi: '昨天他没有来上课，因为身体不太舒服。',
            pinyin: 'Zuótiān tā méiyǒu lái shàngkè, yīnwèi shēntǐ bú tài shūfu.',
            vietnamese: 'Hôm qua anh ấy đã không đến lớp vì trong người không được khỏe.',
            note: 'Quá khứ dùng 没有 + V; hiện tại/trạng thái dùng 不.'
          },
          {
            hanzi: '今天天气很冷，你多穿一点儿衣服吧。',
            pinyin: 'Jīntiān tiānqì hěn lěng, nǐ duō chuān yìdiǎnr yīfu ba.',
            vietnamese: 'Hôm nay thời tiết rất lạnh, bạn mặc thêm chút áo đi nhé.',
            note: 'Tính từ 冷 dùng với 很, không thêm 是.'
          }
        ]
      },
      {
        type: 'pitfall',
        heading: 'Lỗi người Việt hay mắc',
        items: [
          {
            wrong: '今天天气是冷。',
            wrongNote: 'Dịch từng chữ "Hôm nay thời tiết LÀ lạnh" nên chèn nhầm 是 trước tính từ.',
            right: '今天天气很冷。',
            rightPinyin: 'Jīntiān tiānqì hěn lěng.',
            rightMeaning: 'Hôm nay thời tiết rất lạnh.'
          },
          {
            wrong: '我吃饭在食堂。',
            wrongNote: 'Đặt cụm nơi chốn 在食堂 ra cuối câu theo thói quen tiếng Việt.',
            right: '我在食堂吃饭。',
            rightPinyin: 'Wǒ zài shítáng chīfàn.',
            rightMeaning: 'Tôi ăn cơm ở nhà ăn.'
          }
        ]
      },
      {
        type: 'key_terms',
        heading: 'Từ vựng & Cấu trúc trọng tâm cần lưu SRS',
        terms: [
          { hanzi: '因为', pinyin: 'yīnwèi', hanviet: 'Nhân vị', meaning: 'Bởi vì', level: 'HSK 2' },
          { hanzi: '没有', pinyin: 'méiyǒu', hanviet: 'Một hữu', meaning: 'Không có / Đã không', level: 'HSK 1' },
          { hanzi: '图书馆', pinyin: 'túshūguǎn', hanviet: 'Đồ thư quán', meaning: 'Thư viện', level: 'HSK 2' }
        ]
      }
    ]
  },
  {
    id: 'hz-gram-hsk3-ba-bei',
    title: 'Câu Chữ 把 (Bǎ), Câu Chữ 被 (Bèi) & So Sánh 比 (Bǐ) — HSK 3',
    title_cn: 'HSK 3 核心句式：“把”字句、“被”字句与“比”字句',
    category: 'Ngữ pháp chuyên sâu',
    guideType: 'Ngữ pháp',
    academic_category: 'grammar',
    examSystem: 'both',
    exam_version: 'both',
    level: 'HSK 3',
    practiceLevel: 'HSK 3',
    skill: 'grammar',
    skills: ['Ngữ pháp', 'Đọc hiểu', 'Viết & Thuận bút'],
    estimatedMinutes: 18,
    summary: 'Làm chủ 3 cấu trúc phân loại điểm thi HSK 3: xử lý tân ngữ xác định với 把, câu bị động với 被/叫/让 và cấu trúc so sánh 比.',
    description: 'Giải thích rõ điều kiện bắt buộc của thành phần phụ sau động từ trong câu 把/被 và những từ cấm đặt sau câu so sánh 比.',
    tags: ['Ngữ pháp', 'HSK 3', '把', '被', '比', 'Cú pháp'],
    pinyinKeywords: ['ba', 'bei', 'bi', 'baju', 'beiju', 'ngu phap'],
    updatedAt: '2026-11-28',
    verified_date: '2026-11-28',
    host_type: 'hanzigo_original',
    verificationStatus: 'curated',
    license: 'Tài liệu Giáo dục Mở HanziGo',
    publisher: 'Ban Học thuật HanziGo',
    author: 'Ban Học thuật HanziGo',
    format: 'Cẩm nang tương tác',
    sourceUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    downloadUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    worksheetChars: '把 被 比 更 最 完 放 拿 关 送',
    isInteractiveGuide: true,
    packKey: 'grammar',
    contentBlocks: [
      {
        type: 'formula',
        heading: 'Công thức chuẩn & điều kiện bắt buộc',
        formula: 'A + 把 + Tân ngữ (O xác định) + Động từ (V) + Thành phần khác (了 / 在… / 给… / Bổ ngữ)',
        explanation: 'Câu chữ 把 nhấn mạnh việc chủ thể xử lý, di chuyển hoặc làm biến đổi trạng thái của tân ngữ. Động từ trong câu 把 KHÔNG BAO GIỜ đứng trơ trọi một mình, mà phải có bổ ngữ kết quả, bổ ngữ xu hướng, 了 hoặc trạng ngữ phương hướng đi kèm. Với câu bị động 被: S + 被 + (Tác nhân) + V + Thành phần khác. Với so sánh 比: A + 比 + B + Tính từ + (一点儿 / 得多 / Cụm số lượng).',
        notes: [
          'Phó từ phủ định (不 / 没) và động từ năng nguyện (想 / 要 / 应该) đặt TRƯỚC 把 hoặc 被, không đặt trước động từ.',
          'Trong câu 比, TUYỆT ĐỐI KHÔNG dùng 很 / 非常 / 真 trước tính từ (sai: 比他很高).'
        ]
      },
      {
        type: 'examples',
        heading: 'Ví dụ minh họa chuẩn ngữ cảnh',
        items: [
          {
            hanzi: '请把桌面上的文件整理好，然后发给我。',
            pinyin: 'Qǐng bǎ zhuōmiàn shàng de wénjiàn zhěnglǐ hǎo, ránhòu fā gěi wǒ.',
            vietnamese: 'Làm ơn sắp xếp gọn tài liệu trên bàn rồi gửi cho tôi.',
            note: 'Động từ 整理 đi kèm bổ ngữ kết quả 好.'
          },
          {
            hanzi: '我把护照放在包里了，你别担心。',
            pinyin: 'Wǒ bǎ hùzhào fàng zài bāo lǐ le, nǐ bié dānxīn.',
            vietnamese: 'Tôi đã để hộ chiếu vào trong túi rồi, bạn đừng lo.',
            note: 'Động từ 放 đi kèm 在包里了 để chỉ vị trí mới của tân ngữ.'
          },
          {
            hanzi: '我的手机被弟弟借走了，今天下午才还回来。',
            pinyin: 'Wǒ de shǒujī bèi dìdi jiè zǒu le, jīntiān xiàwǔ cái huán huílai.',
            vietnamese: 'Điện thoại của tôi bị em trai mượn đi mất rồi, chiều nay mới trả lại.',
            note: '被 + tác nhân (弟弟) + động từ + bổ ngữ xu hướng (走).'
          },
          {
            hanzi: '坐高铁比坐飞机便宜得多，而且不用提前两小时到。',
            pinyin: 'Zuò gāotiě bǐ zuò fēijī piányi de duō, érqiě búyòng tíqián liǎng xiǎoshí dào.',
            vietnamese: 'Đi tàu cao tốc rẻ hơn đi máy bay nhiều, hơn nữa không cần tới trước hai tiếng.',
            note: 'Dùng 得多 sau tính từ để nhấn mạnh mức độ chênh lệch lớn.'
          }
        ]
      },
      {
        type: 'pitfall',
        heading: 'Lỗi người Việt hay mắc',
        items: [
          {
            wrong: '我把那本书看。',
            wrongNote: 'Động từ 看 đứng trơ trọi cuối câu, thiếu kết quả tác động lên cuốn sách.',
            right: '我把那本书看完了。',
            rightPinyin: 'Wǒ bǎ nà běn shū kàn wán le.',
            rightMeaning: 'Tôi đã đọc xong cuốn sách đó rồi.'
          },
          {
            wrong: '今天比昨天很热。',
            wrongNote: 'Chèn 很 vào sau động từ/giới từ so sánh 比.',
            right: '今天比昨天热得多。',
            rightPinyin: 'Jīntiān bǐ zuótiān rè de duō.',
            rightMeaning: 'Hôm nay nóng hơn hôm qua nhiều.'
          }
        ]
      },
      {
        type: 'key_terms',
        heading: 'Từ khóa & Bổ ngữ hay đi kèm 把 / 被',
        terms: [
          { hanzi: '整理好', pinyin: 'zhěnglǐ hǎo', hanviet: 'Chỉnh lý hảo', meaning: 'Sắp xếp ổn thỏa, gọn gàng', level: 'HSK 3' },
          { hanzi: '借走', pinyin: 'jiè zǒu', hanviet: 'Tá tẩu', meaning: 'Mượn mang đi', level: 'HSK 3' },
          { hanzi: '得多', pinyin: 'de duō', hanviet: 'Đắc đa', meaning: 'Hơn rất nhiều (dùng trong so sánh)', level: 'HSK 3' }
        ]
      }
    ]
  },
  {
    id: 'hz-gram-hsk3-4-complements',
    title: 'Hệ Thống Bổ Ngữ Tiếng Trung: Kết Quả, Xu Hướng & Khả Năng (HSK 3–4)',
    title_cn: 'HSK 3–4 补语系统：结果补语、趋向补语与可能补语',
    category: 'Ngữ pháp chuyên sâu',
    guideType: 'Ngữ pháp',
    academic_category: 'grammar',
    examSystem: 'both',
    exam_version: 'both',
    level: 'HSK 3-4',
    practiceLevel: 'HSK 4',
    skill: 'grammar',
    skills: ['Ngữ pháp', 'Đọc hiểu', 'Nghe hiểu'],
    estimatedMinutes: 20,
    summary: 'Phân biệt rành mạch 3 loại bổ ngữ dễ nhầm nhất từ HSK 3 lên HSK 4, đặc biệt là nghĩa mở rộng của 下来, 起来, 出来 và dạng khả năng 得/不.',
    description: 'Giúp bạn hiểu tại sao 听懂了 khác với 听得懂 và 写出来 khác với 想起来 trong các đề đọc hiểu và viết câu HSK 4.',
    tags: ['Ngữ pháp', 'HSK 3', 'HSK 4', 'Bổ ngữ', 'Xu hướng', 'Khả năng'],
    pinyinKeywords: ['buyu', 'jieguo', 'quxiang', 'keneng', 'qilai', 'xialai', 'ngu phap'],
    updatedAt: '2026-11-28',
    verified_date: '2026-11-28',
    host_type: 'hanzigo_original',
    verificationStatus: 'curated',
    license: 'Tài liệu Giáo dục Mở HanziGo',
    publisher: 'Ban Học thuật HanziGo',
    author: 'Ban Học thuật HanziGo',
    format: 'Cẩm nang tương tác',
    sourceUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    downloadUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    worksheetChars: '懂 完 见 错 进 出 起 来 去 下',
    isInteractiveGuide: true,
    packKey: 'grammar',
    contentBlocks: [
      {
        type: 'formula',
        heading: 'So sánh nhanh 3 hệ bổ ngữ cốt lõi',
        formula: 'Kết quả: V + 完/好/懂/错/见/到  |  Xu hướng: V + 来/去/起来/下来/出来  |  Khả năng: V + 得 / 不 + Bổ ngữ',
        explanation: 'Bổ ngữ kết quả nói về KẾT QUẢ thực tế đã đạt được; bổ ngữ xu hướng chỉ HƯỚNG di chuyển hoặc nghĩa bóng (起来 = bắt đầu/hiện lên; 下来 = duy trì/ổn định dần; 出来 = nhận ra/sáng tạo ra); còn bổ ngữ khả năng dùng 得 (có thể) / 不 (không thể) chèn giữa động từ và bổ ngữ để nói về NĂNG LỰC hoặc ĐIỀU KIỆN cho phép.',
        notes: [
          'Phủ định của bổ ngữ kết quả đã làm nhưng không đạt dùng 没 + V + Bổ ngữ (我没听懂 / Tôi nghe nhưng không hiểu).',
          'Bổ ngữ khả năng dùng 不 trong chính cụm động từ (我听不懂 / Tôi không thể nghe hiểu nổi, dù có nghe).'
        ]
      },
      {
        type: 'examples',
        heading: 'Ví dụ phân biệt sắc thái thực chiến',
        items: [
          {
            hanzi: '老师说得太快，我根本听不清楚，更别说记下来了。',
            pinyin: 'Lǎoshī shuō de tài kuài, wǒ gēnběn tīng bu qīngchu, gèng bié shuō jì xialai le.',
            vietnamese: 'Cô giáo nói nhanh quá, tôi hoàn toàn không nghe rõ nổi, huống chi là ghi chép lại.',
            note: '听不清楚 (khả năng không đạt) + 记下来 (lưu giữ thông tin lại).'
          },
          {
            hanzi: '他突然笑了起来，大家才看出来他其实很开心。',
            pinyin: 'Tā tūrán xiào le qǐlai, dàjiā cái kàn chūlai tā qíshí hěn kāixīn.',
            vietnamese: 'Anh ấy đột nhiên bật cười, mọi người mới nhìn ra thật ra anh ấy rất vui.',
            note: 'V + 起来 biểu thị hành động bắt đầu; 看出来 biểu thị nhận ra sự thật.'
          },
          {
            hanzi: '教室里坐得下五十个人吗？如果坐不下，我们换大一点儿的房间。',
            pinyin: 'Jiàoshì lǐ zuò de xià wǔshí gè rén ma? Rúguǒ zuò bu xià, wǒmen huàn dà yìdiǎnr de fángjiān.',
            vietnamese: 'Trong phòng học có đủ chỗ ngồi cho 50 người không? Nếu không đủ chỗ thì chúng ta đổi phòng lớn hơn.',
            note: 'V + 得下 / 不下 là dạng khả năng kinh điển về sức chứa trong HSK 4.'
          }
        ]
      },
      {
        type: 'pitfall',
        heading: 'Lỗi người Việt hay mắc',
        items: [
          {
            wrong: '我不能听懂他说的话。',
            wrongNote: 'Dịch thẳng "không thể nghe hiểu" thành 不能 + 听懂 thay vì cụm khả năng chuẩn.',
            right: '我听不懂他说的话。',
            rightPinyin: 'Wǒ tīng bu dǒng tā shuō de huà.',
            rightMeaning: 'Tôi nghe không hiểu lời anh ấy nói.'
          },
          {
            wrong: '把书拿来回去吧。',
            wrongNote: 'Ghép sai cả 来 và 去 sau động từ đơn âm.',
            right: '把书拿回去吧。',
            rightPinyin: 'Bǎ shū ná huíqu ba.',
            rightMeaning: 'Hãy mang sách về đi (rời xa vị trí người nói).'
          }
        ]
      },
      {
        type: 'key_terms',
        heading: 'Cụm bổ ngữ tần suất cao HSK 3–4',
        terms: [
          { hanzi: '听不清楚', pinyin: 'tīng bu qīngchu', hanviet: 'Thính bất thanh sở', meaning: 'Nghe không rõ nổi', level: 'HSK 4' },
          { hanzi: '看出来', pinyin: 'kàn chūlai', hanviet: 'Khán xuất lai', meaning: 'Nhìn ra, phát hiện ra', level: 'HSK 4' },
          { hanzi: '坐不下', pinyin: 'zuò bu xià', hanviet: 'Tọa bất hạ', meaning: 'Không đủ chỗ ngồi', level: 'HSK 4' }
        ]
      }
    ]
  },
  {
    id: 'hz-gram-hsk4-connectors',
    title: 'Hệ Thống Liên Từ Phức & Câu Điều Kiện HSK 4',
    title_cn: 'HSK 4 复句关联词与条件句精讲',
    category: 'Ngữ pháp chuyên sâu',
    guideType: 'Ngữ pháp',
    academic_category: 'grammar',
    examSystem: 'both',
    exam_version: 'both',
    level: 'HSK 4',
    practiceLevel: 'HSK 4',
    skill: 'grammar',
    skills: ['Ngữ pháp', 'Đọc hiểu', 'Viết & Thuận bút'],
    estimatedMinutes: 20,
    summary: 'Phân biệt chính xác các cặp liên từ dễ mất điểm trong đề đọc điền khuyết HSK 4: 只要…就 vs 只有…才, 既然…就, 即使…也 và 不管/无论.',
    description: 'Trang bị bản đồ logic 5 nhóm câu phức nhân quả, điều kiện, nhượng bộ và tăng tiến thường xuất hiện trong phần Đọc Hiểu & Sắp Xếp Câu HSK 4.',
    tags: ['Ngữ pháp', 'HSK 4', 'Liên từ', '只要', '只有', '即使', '既然'],
    pinyinKeywords: ['lianci', 'zhiyao', 'zhiyou', 'jiran', 'jishi', 'bujin', 'ngu phap'],
    updatedAt: '2026-11-28',
    verified_date: '2026-11-28',
    host_type: 'hanzigo_original',
    verificationStatus: 'curated',
    license: 'Tài liệu Giáo dục Mở HanziGo',
    publisher: 'Ban Học thuật HanziGo',
    author: 'Ban Học thuật HanziGo',
    format: 'Cẩm nang tương tác',
    sourceUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    downloadUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    worksheetChars: '只 要 就 才 既 然 即 使 越 论',
    isInteractiveGuide: true,
    packKey: 'grammar',
    contentBlocks: [
      {
        type: 'formula',
        heading: 'Cặp điều kiện & nhượng bộ HSK 4',
        formula: '只要 + Điều kiện đủ, 就 + Kết quả  ≠  只有 + Điều kiện duy nhất, 才 + Kết quả',
        explanation: '只要…就… nhấn mạnh điều kiện CẦN ĐỦ dễ đạt (chỉ cần… là…). 只有…才… nhấn mạnh điều kiện DUY NHẤT không có cách khác (chỉ có… mới…). Tương tự, 既然…就… dùng khi sự việc ở vế đầu ĐÃ LÀ SỰ THẬT ai cũng biết ("Đã… thì…"), khác với 如果 ("Nếu giả sử…").',
        notes: [
          '即使 + Giả thiết cực đoan, 也… ("Cho dù… thì cũng…") nói về tình huống chưa xảy ra.',
          '虽然 / 尽管…, 但是 / 可是… dùng khi tình huống ĐÃ có thật.'
        ]
      },
      {
        type: 'examples',
        heading: 'Ví dụ minh họa chuẩn đề thi HSK 4',
        items: [
          {
            hanzi: '只要每天坚持听二十分钟，你的听力水平就会慢慢提高。',
            pinyin: 'Zhǐyào měitiān jiānchí tīng èrshí fēnzhōng, nǐ de tīnglì shuǐpíng jiù huì mànmàn tígāo.',
            vietnamese: 'Chỉ cần mỗi ngày kiên trì nghe 20 phút thì trình độ nghe của bạn sẽ nâng cao dần.',
            note: '只要 đi cặp cố định với 就.'
          },
          {
            hanzi: '只有通过不断的练习，我们才能真正掌握这些语法规律。',
            pinyin: 'Zhǐyǒu tōngguò búduàn de liànxí, wǒmen cái néng zhēnzhèng zhǎngwò zhèxiē yǔfǎ guīlǜ.',
            vietnamese: 'Chỉ có thông qua luyện tập không ngừng, chúng ta mới có thể thực sự nắm vững các quy luật ngữ pháp này.',
            note: '只有 luôn đòi hỏi vế sau đi với 才.'
          },
          {
            hanzi: '既然你已经决定参加比赛，就应该认真准备，不要半途而废。',
            pinyin: 'Jìrán nǐ yǐjīng juédìng cānjiā bǐsài, jiù yīnggāi rènzhēn zhǔnbèi, búyào bàntú-érfèi.',
            vietnamese: 'Đã quyết định tham gia cuộc thi rồi thì nên chuẩn bị nghiêm túc, đừng bỏ cuộc giữa chừng.',
            note: '既然 dựa vào sự thật đã diễn ra (已经决定) để đưa ra lời khuyên ở vế 就.'
          }
        ]
      },
      {
        type: 'pitfall',
        heading: 'Lỗi người Việt hay mắc',
        items: [
          {
            wrong: '只有努力学习，你就能考上好大学。',
            wrongNote: 'Trộn 只有 (chỉ có) với 就 thay vì 才.',
            right: '只有努力学习，你才能考上好大学。',
            rightPinyin: 'Zhǐyǒu nǔlì xuéxí, nǐ cái néng kǎoshàng hǎo dàxué.',
            rightMeaning: 'Chỉ có chăm chỉ học tập bạn mới thi đỗ đại học tốt được.'
          },
          {
            wrong: '不但他会说汉语，而且还会写汉字。',
            wrongNote: 'Đặt 不但 trước chủ ngữ 他 dù hai vế CÙNG MỘT CHỦ NGỮ.',
            right: '他不但会说汉语，而且还会写汉字。',
            rightPinyin: 'Tā búdàn huì shuō Hànyǔ, érqiě hái huì xiě Hànzì.',
            rightMeaning: 'Anh ấy không chỉ biết nói tiếng Trung mà còn biết viết chữ Hán.'
          }
        ]
      },
      {
        type: 'key_terms',
        heading: 'Liên từ cốt lõi HSK 4 cần nhớ chắc cặp',
        terms: [
          { hanzi: '只要', pinyin: 'zhǐyào', hanviet: 'Chỉ yếu', meaning: 'Chỉ cần (đi với 就)', level: 'HSK 4' },
          { hanzi: '既然', pinyin: 'jìrán', hanviet: 'Ký nhiên', meaning: 'Đã… rồi thì (đi với 就)', level: 'HSK 4' },
          { hanzi: '即使', pinyin: 'jíshǐ', hanviet: 'Tức sử', meaning: 'Cho dù giả sử (đi với 也)', level: 'HSK 4' }
        ]
      }
    ]
  },
  {
    id: 'hz-gram-hsk5-discourse',
    title: 'Ngữ Pháp Trung–Cao Cấp & Tam Trợ Từ 的 / 地 / 得 — HSK 5',
    title_cn: 'HSK 5 书面语连接与“的、地、得”辨析',
    category: 'Ngữ pháp chuyên sâu',
    guideType: 'Ngữ pháp',
    academic_category: 'grammar',
    examSystem: 'both',
    exam_version: 'both',
    level: 'HSK 5',
    practiceLevel: 'HSK 5',
    skill: 'grammar',
    skills: ['Ngữ pháp', 'Viết & Thuận bút', 'Đọc hiểu'],
    estimatedMinutes: 22,
    summary: 'Nắm trọn cấu trúc chọn lựa/nhượng bộ HSK 5 (与其…不如, 宁可…也不, 之所以…是因为) và quy tắc bất di bất dịch của 的 / 地 / 得.',
    description: 'Chinh phục bài viết đoạn văn và điền khuyết Cloze HSK 5 bằng cách phân định rạch ròi trợ từ kết cấu và liên từ lập luận.',
    tags: ['Ngữ pháp', 'HSK 5', '的 地 得', '与其 不如', '宁可', '之所以'],
    pinyinKeywords: ['de', 'di', 'yuqi', 'buru', 'ningke', 'zhisuoyi', 'ngu phap'],
    updatedAt: '2026-11-28',
    verified_date: '2026-11-28',
    host_type: 'hanzigo_original',
    verificationStatus: 'curated',
    license: 'Tài liệu Giáo dục Mở HanziGo',
    publisher: 'Ban Học thuật HanziGo',
    author: 'Ban Học thuật HanziGo',
    format: 'Cẩm nang tương tác',
    sourceUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    downloadUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    worksheetChars: '的 地 得 与 其 不 如 宁 所 以',
    isInteractiveGuide: true,
    packKey: 'grammar',
    contentBlocks: [
      {
        type: 'formula',
        heading: 'Công thức phân biệt 的 / 地 / 得 & liên từ HSK 5',
        formula: 'Định ngữ + 的 + Danh từ   |   Trạng ngữ + 地 + Động từ   |   Động từ / Tính từ + 得 + Bổ ngữ mức độ',
        explanation: '的 bổ nghĩa cho DANH TỪ đứng sau; 地 bổ nghĩa cho ĐỘNG TỪ đứng sau (chỉ cách thức, trạng thái thực hiện hành động); 得 nối ĐỘNG TỪ/TÍNH TỪ với phần ĐÁNH GIÁ hoặc MỨC ĐỘ đứng sau nó. Về lập luận HSK 5: 与其 A，不如 B ("Thà B còn hơn A" — chọn B); 宁可 A，也不 B ("Thà A chứ quyết không B" — chọn A).',
        notes: [
          '之所以 + Kết quả + 是因为 + Nguyên nhân ("Sở dĩ có kết quả… là vì nguyên nhân…").',
          '无论 / 不管 + (Từ để hỏi hoặc A 还是 B) + 都… ("Bất kể… đều…").'
        ]
      },
      {
        type: 'examples',
        heading: 'Ví dụ minh họa chuẩn văn phong HSK 5',
        items: [
          {
            hanzi: '她认真地整理着重要的资料，桌上的一切摆放得井井有条。',
            pinyin: 'Tā rènzhēn de zhěnglǐ zhe zhòngyào de zīliào, zhuō shàng de yíqiè bǎifàng de jǐngjǐng-yǒutiáo.',
            vietnamese: 'Cô ấy chăm chú sắp xếp tài liệu quan trọng, mọi thứ trên bàn được bày trí vô cùng ngăn nắp.',
            note: '认真地 + V (cách thức), 重要的 + N (tính chất), 摆放得 + đánh giá kết quả.'
          },
          {
            hanzi: '与其在这里抱怨困难，不如立刻动手寻找解决的办法。',
            pinyin: 'Yǔqí zài zhèlǐ bàoyuàn kùnnan, bùrú lìkè dòngshǒu xúnzhǎo jiějué de bànfǎ.',
            vietnamese: 'Thay vì ngồi đây than phiền khó khăn, chi bằng lập tức bắt tay tìm cách giải quyết.',
            note: '与其 A，不如 B luôn chọn vế B.'
          },
          {
            hanzi: '这个项目之所以能够按时完成，是因为整个团队分工明确、配合默契。',
            pinyin: 'Zhège xiàngmù zhīsuǒyǐ nénggòu ànshí wánchéng, shì yīnwèi zhěnggè tuánduì fēngōng míngquè, pèihé mòqì.',
            vietnamese: 'Sở dĩ dự án này có thể hoàn thành đúng hạn là vì cả đội phân công rõ ràng và phối hợp ăn ý.',
            note: 'Cấu trúc đảo nguyên nhân ra sau giúp câu viết học thuật chặt chẽ.'
          }
        ]
      },
      {
        type: 'pitfall',
        heading: 'Lỗi người Việt hay mắc',
        items: [
          {
            wrong: '他跑的很快，而且非常努力得学习。',
            wrongNote: 'Đánh đồng cả 3 chữ cùng đọc là de nên nhầm 的 (cần 得) và 得 (cần 地).',
            right: '他跑得很快，而且非常努力地学习。',
            rightPinyin: 'Tā pǎo de hěn kuài, érqiě fēicháng nǔlì de xuéxí.',
            rightMeaning: 'Anh ấy chạy rất nhanh, hơn nữa học tập vô cùng chăm chỉ.'
          },
          {
            wrong: '与其坐车，不如走路；所以我决定坐车。',
            wrongNote: 'Hiểu nhầm 与其 A，不如 B là chọn vế A.',
            right: '与其坐车，不如走路；所以我想走路去。',
            rightPinyin: 'Yǔqí zuòchē, bùrú zǒulù; suǒyǐ wǒ xiǎng zǒulù qù.',
            rightMeaning: 'Thay vì đi xe chi bằng đi bộ; nên tôi muốn đi bộ.'
          }
        ]
      },
      {
        type: 'key_terms',
        heading: 'Cấu trúc & Từ vựng viết đoạn HSK 5',
        terms: [
          { hanzi: '与其', pinyin: 'yǔqí', hanviet: 'Dữ kỳ', meaning: 'Thay vì / So với việc (đi với 不如)', level: 'HSK 5' },
          { hanzi: '之所以', pinyin: 'zhīsuǒyǐ', hanviet: 'Chi sở dĩ', meaning: 'Sở dĩ (đi với 是因为)', level: 'HSK 5' },
          { hanzi: '宁可', pinyin: 'nìngkě', hanviet: 'Ninh khả', meaning: 'Thà rằng (đi với 也不)', level: 'HSK 5' }
        ]
      }
    ]
  },
  {
    id: 'hz-gram-hsk6-written',
    title: 'Cú Pháp Văn Viết & Sửa Lỗi Câu Bệnh (病句) — HSK 6',
    title_cn: 'HSK 6 书面句式与常见病句辨析',
    category: 'Ngữ pháp chuyên sâu',
    guideType: 'Ngữ pháp',
    academic_category: 'grammar',
    examSystem: 'both',
    exam_version: 'both',
    level: 'HSK 6',
    practiceLevel: 'HSK 6',
    skill: 'grammar',
    skills: ['Ngữ pháp', 'Đọc hiểu', 'Viết & Thuận bút'],
    estimatedMinutes: 25,
    summary: 'Phân tích khung câu văn viết HSK 6 (以…为…, 非…不可, 固然…但是…, 以免/免得) và 4 nhóm lỗi câu bệnh kinh điển (thiếu chủ ngữ, phối hợp sai, logic hai mặt).',
    description: 'Trong HSK 2.0 phần Đọc 1 thi trực tiếp nhận diện câu bệnh (病句), còn HSK 3.0 yêu cầu viết văn bản ứng dụng & nghị luận sạch lỗi cú pháp. Bài học này hệ thống hóa toàn bộ quy tắc kiểm tra nhanh câu chuẩn.',
    tags: ['Ngữ pháp', 'HSK 6', 'Câu bệnh', 'Văn viết', '以 为', '固然', '以免'],
    pinyinKeywords: ['bingju', 'yiwei', 'guran', 'yimian', 'feibuke', 'ngu phap'],
    updatedAt: '2026-11-28',
    verified_date: '2026-11-28',
    host_type: 'hanzigo_original',
    verificationStatus: 'curated',
    license: 'Tài liệu Giáo dục Mở HanziGo',
    publisher: 'Ban Học thuật HanziGo',
    author: 'Ban Học thuật HanziGo',
    format: 'Cẩm nang tương tác',
    sourceUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    downloadUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    worksheetChars: '以 为 固 然 免 非 可 由 于 致',
    isInteractiveGuide: true,
    packKey: 'grammar',
    contentBlocks: [
      {
        type: 'formula',
        heading: 'Checklist rà soát câu chuẩn văn viết HSK 6',
        formula: '1) Có đủ Chủ–Vị?  2) Động từ–Tân ngữ phối hợp đúng?  3) Hai mặt (能否/是否) có khớp vế sau?  4) 避免/防止/以免 có bị phủ định kép sai?',
        explanation: 'Hai mẫu văn viết tần suất cao ở HSK 6 gồm: 以 + A + 为 + B ("lấy A làm B", vd 以质量为核心), 固然 + Vế thừa nhận, 但是/不过 + Chuyển ý ("dĩ nhiên là…, nhưng…"), và 非 + V/N + 不可 ("nhất định phải…"). Ngoài ra, khi mở đầu bằng 通过/经过/由于… thì vế sau KHÔNG dùng 使/让 nếu làm mất chủ ngữ cả câu.',
        notes: [
          'Tránh phủ định kép vô tình với 避免 (tránh), 防止 (phòng ngừa), 以免 (để khỏi): đã dùng 避免 thì không thêm 不 ở sau.',
          'Nếu vế đầu có từ hai mặt (能否, 是否, 好坏, 胜败), vế sau phải tương ứng hai mặt hoặc bỏ tính từ một chiều.'
        ]
      },
      {
        type: 'examples',
        heading: 'Ví dụ câu chuẩn văn viết HSK 6',
        items: [
          {
            hanzi: '这家企业始终以技术创新为核心竞争力，因此才能在市场中立于不败之地。',
            pinyin: 'Zhè jiā qǐyè shǐzhōng yǐ jìshù chuàngxīn wéi héxīn jìngzhēnglì, yīncǐ cái néng zài shìchǎng zhōng lìyú-búbài-zhīdì.',
            vietnamese: 'Doanh nghiệp này luôn lấy đổi mới công nghệ làm năng lực cạnh tranh cốt lõi, nhờ vậy mới có thể đứng vững trên thị trường.',
            note: 'Cấu trúc văn viết 以…为… ngắn gọn, trang trọng.'
          },
          {
            hanzi: '丰富的经验固然重要，但持续学习的能力同样不可或缺。',
            pinyin: 'Fēngfù de jīngyàn gùrán zhòngyào, dàn chíxù xuéxí de nénglì tóngyàng bùkě-huòquē.',
            vietnamese: 'Kinh nghiệm phong phú dĩ nhiên quan trọng, nhưng năng lực học tập liên tục cũng không thể thiếu.',
            note: '固然…但… thừa nhận giá trị vế trước để nhấn mạnh vế sau.'
          },
          {
            hanzi: '请提前核对好各项数据，以免正式汇报时出现差错。',
            pinyin: 'Qǐng tíqián héduì hǎo gè xiàng shùjù, yǐmiǎn zhèngshì huìbào shí chūxiàn chācuò.',
            vietnamese: 'Xin vui lòng đối chiếu kỹ các số liệu trước, để tránh xảy ra sai sót khi báo cáo chính thức.',
            note: 'Sau 以免 đi thẳng kết quả xấu (出现差错), không chèn 不.'
          }
        ]
      },
      {
        type: 'pitfall',
        heading: 'Lỗi người Việt hay mắc (và bẫy Câu bệnh HSK 6)',
        items: [
          {
            wrong: '通过这次交流活动，使我们学到了很多宝贵经验。',
            wrongNote: 'Vướng đồng thời giới từ 通过 và động từ sai khiến 使 làm câu mất chủ ngữ.',
            right: '这次交流活动使我们学到了很多宝贵经验。',
            rightPinyin: 'Zhè cì jiāoliú huódòng shǐ wǒmen xuédào le hěn duō bǎoguì jīngyàn.',
            rightMeaning: 'Hoạt động giao lưu lần này khiến chúng tôi học được rất nhiều kinh nghiệm quý báu.'
          },
          {
            wrong: '我们要提高和保护生态环境的意识。',
            wrongNote: 'Động từ 保护 không đi với tân ngữ 意识 ("ý thức"), chỉ đi với 环境.',
            right: '我们要提高保护生态环境的意识。',
            rightPinyin: 'Wǒmen yào tígāo bǎohù shēngtài huánjìng de yìshí.',
            rightMeaning: 'Chúng ta cần nâng cao ý thức bảo vệ môi trường sinh thái.'
          }
        ]
      },
      {
        type: 'key_terms',
        heading: 'Từ nối & Cụm văn viết HSK 6 cần ghi nhớ',
        terms: [
          { hanzi: '固然', pinyin: 'gùrán', hanviet: 'Cố nhiên', meaning: 'Dĩ nhiên là, quả thật là (nhượng bộ)', level: 'HSK 6' },
          { hanzi: '以免', pinyin: 'yǐmiǎn', hanviet: 'Dĩ miễn', meaning: 'Để tránh, để khỏi', level: 'HSK 6' },
          { hanzi: '不可或缺', pinyin: 'bùkě-huòquē', hanviet: 'Bất khả hoặc khuyết', meaning: 'Không thể thiếu', level: 'HSK 6' }
        ]
      }
    ]
  },
  {
    id: 'hz-gram-hsk79-academic',
    title: 'Cú Pháp Học Thuật & Hư Từ Văn Ngôn Hiện Đại — HSK 7–9',
    title_cn: 'HSK 7–9 学术语体与现代汉语中的文言虚词',
    category: 'Ngữ pháp chuyên sâu',
    guideType: 'Ngữ pháp',
    academic_category: 'grammar',
    examSystem: 'hsk_3_0',
    exam_version: '3.0',
    level: 'HSK 7-9',
    practiceLevel: 'HSK 7-9',
    skill: 'grammar',
    skills: ['Ngữ pháp', 'Đọc hiểu', 'Viết & Thuận bút'],
    estimatedMinutes: 25,
    summary: 'Giải mã lớp hư từ văn ngôn tồn tại trong báo chí, văn bản học thuật và đề đọc-viết HSK 7–9: 鉴于, 倘若, 唯独, 之, 所, 而, 其.',
    description: 'Cấp 7–9 của HSK 3.0 đòi hỏi khả năng đọc hiểu văn bản học thuật, chính luận và viết luận văn 600 chữ. Tài liệu này hệ thống hóa cách dùng chính xác các hư từ cô đọng.',
    tags: ['Ngữ pháp', 'HSK 7-9', 'HSK 3.0', 'Học thuật', 'Văn ngôn', '鉴于', '之 所 而'],
    pinyinKeywords: ['jianyu', 'tangruo', 'weidu', 'zhi', 'suo', 'xueshu', 'ngu phap'],
    updatedAt: '2026-11-28',
    verified_date: '2026-11-28',
    host_type: 'hanzigo_original',
    verificationStatus: 'curated',
    license: 'Tài liệu Giáo dục Mở HanziGo',
    publisher: 'Ban Học thuật HanziGo',
    author: 'Ban Học thuật HanziGo',
    format: 'Cẩm nang tương tác',
    sourceUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    downloadUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    worksheetChars: '鉴 于 倘 若 唯 独 之 所 而 其',
    isInteractiveGuide: true,
    packKey: 'grammar',
    contentBlocks: [
      {
        type: 'formula',
        heading: 'Chức năng 4 hư từ cốt lõi & liên từ học thuật HSK 7–9',
        formula: '鉴于 + Căn cứ thực tế  |  倘若 + Giả thiết trang trọng  |  所 + Động từ (thành danh từ)  |  而 (chuyển ý / song song / nối trạng ngữ)',
        explanation: '鉴于 dùng để dẫn cứ liệu hoặc bối cảnh đã xác lập làm tiền đề đề xuất giải pháp ("Xét thấy…"). 所 đứng trước ngoại động từ biến hành động thành đối tượng được tác động (所面临的挑战 = thách thức đang đối mặt). 其 thay cho đại từ sở hữu ngôi 3 hoặc chỉ thị ("của nó / việc đó") giúp tránh lặp từ.',
        notes: [
          '之 trong văn học thuật hiện đại tương đương 的 trang trọng (当务之急 = việc cấp bách trước mắt).',
          'Không lạm dụng khẩu ngữ như 然后, 所以 quá nhiều trong bài luận 600 chữ; thay bằng 进而, 由此可见, 综上所述.'
        ]
      },
      {
        type: 'examples',
        heading: 'Ví dụ trích văn phong nghị luận HSK 7–9',
        items: [
          {
            hanzi: '鉴于当前气候变化日趋严峻，各国亟须在清洁能源领域展开实质性合作。',
            pinyin: 'Jiànyú dāngqián qìhòu biànhuà rìqū yánjùn, gè guó jíxū zài qīngjié néngyuán lǐngyù zhǎnkāi shízhìxìng hézuò.',
            vietnamese: 'Xét thấy biến đổi khí hậu hiện nay ngày càng nghiêm trọng, các quốc gia cấp thiết phải triển khai hợp tác thực chất trong lĩnh vực năng lượng sạch.',
            note: '鉴于 dẫn tiền đề + 亟须 nêu kiến nghị.'
          },
          {
            hanzi: '这项改革所带来的长期红利，远非短期数据所能完全体现。',
            pinyin: 'Zhè xiàng gǎigé suǒ dàilái de chángqī hónglì, yuǎnfēi duǎnqī shùjù suǒ néng wánquán tǐxiàn.',
            vietnamese: 'Lợi ích dài hạn mà cuộc cải cách này mang lại vượt xa những gì số liệu ngắn hạn có thể phản ánh trọn vẹn.',
            note: '所 + V + 的 tạo định ngữ danh hóa chặt chẽ; 远非…所能… tạo lập luận phản biện sắc bén.'
          },
          {
            hanzi: '人们往往注重技术的突破，却忽视了其背后蕴含的伦理风险。',
            pinyin: 'Rénmen wǎngwǎng zhùzhòng jìshù de tūpò, què hūshì le qí bèihòu yùnhán de lúnlǐ fēngxiǎn.',
            vietnamese: 'Con người thường chú trọng đột phá công nghệ mà lại xem nhẹ rủi ro đạo đức tiềm ẩn phía sau nó.',
            note: '其 thay cho "技术的突破" giúp câu cô đọng, tránh lặp danh từ.'
          }
        ]
      },
      {
        type: 'pitfall',
        heading: 'Lỗi người Việt hay mắc ở bậc Cao cấp',
        items: [
          {
            wrong: '鉴于如果明天不下雨，我们就去调研。',
            wrongNote: 'Dùng 鉴于 (dẫn căn cứ thực tế đã biết) cho giả định tương lai 如果.',
            right: '倘若明天天气晴朗，我们便按原计划前往调研。',
            rightPinyin: 'Tǎngruò míngtiān tiānqì qínglǎng, wǒmen biàn àn yuán jìhuà qiánwǎng diàoyán.',
            rightMeaning: 'Ví thử ngày mai trời quang tạnh, chúng tôi sẽ theo đúng kế hoạch đi khảo sát.'
          },
          {
            wrong: '这是我们应该思考的之问题。',
            wrongNote: 'Dùng dư thừa cả 的 và 之 cạnh nhau.',
            right: '这是当今社会亟待解决之难题。',
            rightPinyin: 'Zhè shì dāngjīn shèhuì jídài jiějué zhī nántí.',
            rightMeaning: 'Đây là bài toán nan giải mà xã hội đương đại cần gấp rút giải quyết.'
          }
        ]
      },
      {
        type: 'key_terms',
        heading: 'Từ ngữ học thuật chuẩn nghị luận HSK 7–9',
        terms: [
          { hanzi: '鉴于', pinyin: 'jiànyú', hanviet: 'Giám vu', meaning: 'Xét thấy, căn cứ vào', level: 'HSK 7-9' },
          { hanzi: '亟须', pinyin: 'jíxū', hanviet: 'Cấp tu', meaning: 'Rất cần thiết, cấp thiết phải', level: 'HSK 7-9' },
          { hanzi: '进而', pinyin: 'jìn ér', hanviet: 'Tiến nhi', meaning: 'Từ đó tiến tới, rồi tiếp đó', level: 'HSK 7-9' }
        ]
      }
    ]
  },
  {
    id: 'hz-gram-hsk79-translation-rhetoric',
    title: 'Kỹ Thuật Dịch Thuật & Phân Tích Số Liệu Văn Bản — HSK 7–9',
    title_cn: 'HSK 7–9 翻译转换与图表分析句型精要',
    category: 'Ngữ pháp chuyên sâu',
    guideType: 'Ngữ pháp',
    academic_category: 'reading_writing',
    examSystem: 'hsk_3_0',
    exam_version: '3.0',
    level: 'HSK 7-9',
    practiceLevel: 'HSK 7-9',
    skill: 'writing',
    skills: ['Viết & Thuận bút', 'Đọc hiểu', 'Ngữ pháp'],
    estimatedMinutes: 25,
    summary: 'Mẫu câu mô tả xu hướng biểu đồ (250 chữ) và 4 chiến lược chuyển ngữ Việt–Trung trong bài thi Dịch HSK 7–9: vô nhân xưng, bị động ẩn và danh hóa.',
    description: 'Bám sát 2 phần đặc thù của HSK 3.0 cấp 7–9 (Dịch 4 câu / 41 phút và Viết tóm tắt biểu đồ 250 chữ). Cung cấp bộ khung câu chuẩn xác để diễn đạt khách quan.',
    tags: ['HSK 7-9', 'HSK 3.0', 'Dịch thuật', 'Biểu đồ', 'Nghị luận', 'Ngữ pháp'],
    pinyinKeywords: ['fanyi', 'tubiao', 'shuju', 'xiezuo', 'hsk 7-9', 'dich thuat'],
    updatedAt: '2026-11-28',
    verified_date: '2026-11-28',
    host_type: 'hanzigo_original',
    verificationStatus: 'curated',
    license: 'Tài liệu Giáo dục Mở HanziGo',
    publisher: 'Ban Học thuật HanziGo',
    author: 'Ban Học thuật HanziGo',
    format: 'Cẩm nang tương tác',
    sourceUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    downloadUrl: '/so-tay-ngu-phap-hsk-cot-loi.html',
    worksheetChars: '据 图 显 示 呈 现 占 比 攀 升',
    isInteractiveGuide: true,
    packKey: 'grammar',
    contentBlocks: [
      {
        type: 'formula',
        heading: 'Khung viết biểu đồ & nguyên tắc chuyển dịch Việt → Trung',
        formula: '如图所示，从 A 年至 B 年，X 呈现出持续攀升 / 稳步回落的态势，其中 Y 占比达 Z%。',
        explanation: 'Khi tóm tắt biểu đồ 250 chữ, tuyệt đối tránh liệt kê thô từng con số rời rạc; hãy nhóm theo XU HƯỚNG TỔNG QUÁT → ĐIỂM ĐỘT BIẾN / TỶ TRỌNG CHÍNH → HÀM Ý KHÁI QUÁT. Khi dịch Việt → Trung, hạn chế dịch máy móc chữ "được/bị" sang 被 nếu câu mang nghĩa trung tính hoặc tích cực; hãy dùng động từ chủ động vô nhân xưng hoặc cặp 是…的.',
        notes: [
          'Từ vựng tăng/giảm chuẩn báo cáo: 稳步攀升 (tăng đều), 急剧下滑 (giảm mạnh), 趋于平稳 (đi vào ổn định), 位居首位 (đứng đầu).',
          'Câu bị động mang nghĩa trang trọng không dùng 被: 该方案已于去年正式实施 (Phương án đã được triển khai chính thức năm ngoái).'
        ]
      },
      {
        type: 'examples',
        heading: 'Ví dụ chuẩn đề Viết biểu đồ & Dịch HSK 7–9',
        items: [
          {
            hanzi: '从统计数据来看，高学历人群在数字技能培训中的参与度显著高于其他群体。',
            pinyin: 'Cóng tǒngjì shùjù lái kàn, gāo xuélì rénqún zài shùzì jìnéng péixùn zhōng de cānyùdù xiǎnzhù gāoyú qítā qúntǐ.',
            vietnamese: 'Xét từ số liệu thống kê, mức độ tham gia đào tạo kỹ năng số của nhóm có học vấn cao vượt trội rõ rệt so với các nhóm khác.',
            note: 'Dùng danh từ hóa 参与度 + 显著高于 thay cho lặp 很/高.'
          },
          {
            hanzi: '该项政策自实施以来，有效缓解了城市核心区的交通拥堵状况。',
            pinyin: 'Gāi xiàng zhèngcè zì shíshī yǐlái, yǒuxiào huǎnjiě le chéngshì héxīnqū de jiāotōng yōngdǔ zhuàngkuàng.',
            vietnamese: 'Chính sách này kể từ khi được thực thi đã làm dịu hiệu quả tình trạng ùn tắc giao thông tại khu vực trung tâm đô thị.',
            note: 'Không cần chữ 被 sau 政策 để diễn đạt "kể từ khi được thực thi".'
          }
        ]
      },
      {
        type: 'pitfall',
        heading: 'Lỗi người Việt hay mắc khi dịch & viết cao cấp',
        items: [
          {
            wrong: '这座桥在2020年被建成了，它被大家很喜欢。',
            wrongNote: 'Lạm dụng 被 theo chữ "được" trong tiếng Việt.',
            right: '这座桥于2020年建成，广受民众好评。',
            rightPinyin: 'Zhè zuò qiáo yú èrlíngèrlíng nián jiànchéng, guǎng shòu mínzhòng hǎopíng.',
            rightMeaning: 'Cây cầu này được hoàn thành năm 2020 và nhận được sự đánh giá cao rộng rãi từ người dân.'
          }
        ]
      },
      {
        type: 'key_terms',
        heading: 'Cụm từ chuyên dụng cho phần Viết & Dịch HSK 7–9',
        terms: [
          { hanzi: '呈现出', pinyin: 'chéngxiàn chū', hanviet: 'Trình hiện xuất', meaning: 'Cho thấy, bộc lộ xu hướng', level: 'HSK 7-9' },
          { hanzi: '占比', pinyin: 'zhànbǐ', hanviet: 'Chiếm tỷ', meaning: 'Tỷ trọng chiếm (%)', level: 'HSK 7-9' },
          { hanzi: '缓解', pinyin: 'huǎnjiě', hanviet: 'Hoãn giải', meaning: 'Làm dịu, giảm bớt (áp lực/ùn tắc)', level: 'HSK 7-9' }
        ]
      }
    ]
  }
];
