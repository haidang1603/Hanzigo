/**
 * Practical HanziGo Study Handbooks:
 * - 60 Core Radicals & 7 Stroke-Order Principles
 * - Measure Words Handbook (量词)
 * - Near-Synonyms Contrast (近义词辨析 HSK 3-5 & HSK 5-9)
 * - HSK 2.0 vs HSK 3.0 Official Exam Blueprint Comparison (synced with hskExamBlueprints.js)
 * - Printable A4 Worksheet Presets Pack (connected to WorksheetGeneratorModal)
 */

export const PRACTICAL_GUIDES_PACK = [
  {
    id: 'hz-radicals-60-core',
    title: '60 Bộ Thủ Cốt Lõi & 7 Quy Tắc Bút Thuận Chuẩn Khang Hy',
    title_cn: '60个核心部首与汉字笔顺七大规则',
    category: 'Bộ thủ & Hán tự',
    guideType: 'Bộ thủ & Bút thuận',
    academic_category: 'chinese_characters',
    examSystem: 'both',
    exam_version: 'both',
    level: 'HSK 1-6',
    practiceLevel: 'HSK 1',
    skill: 'writing',
    skills: ['Viết & Thuận bút', 'Từ vựng'],
    estimatedMinutes: 25,
    summary: 'Bảng tra cứu 60 bộ thủ có tần suất xuất hiện trên 80% trong chữ Hán HSK kèm 7 quy tắc bút thuận chuẩn quốc tế và ví dụ chiết tự.',
    description: 'Thay vì học vẹt từng chữ Hán rời rạc, nắm chắc 60 bộ thủ phổ biến nhất theo ngữ nghĩa (người, nước, tim, lời nói, hành động...) giúp bạn đoán nghĩa và nhớ mặt chữ nhanh gấp 3 lần.',
    tags: ['Bộ thủ', 'Bút thuận', 'Hán tự', '214 bộ thủ', 'Viết chữ'],
    pinyinKeywords: ['bushou', 'bishun', 'hanzi', 'bo thu', 'but thuan'],
    updatedAt: '2026-11-28',
    verified_date: '2026-11-28',
    host_type: 'hanzigo_original',
    verificationStatus: 'curated',
    license: 'Tài liệu Giáo dục Mở HanziGo',
    publisher: 'Ban Học thuật HanziGo',
    author: 'Ban Học thuật HanziGo',
    format: 'Cẩm nang & Luyện viết',
    sourceUrl: '/214-bo-thu-chu-han.html',
    downloadUrl: '/214-bo-thu-chu-han.html',
    worksheetChars: '人 水 心 言 木 口 手 足 日 月',
    isInteractiveGuide: true,
    packKey: 'practical',
    contentBlocks: [
      {
        type: 'checklist',
        heading: '7 Quy tắc Bút thuận vàng (先…后…) bắt buộc khi tập viết',
        items: [
          '1. Ngang trước, sổ sau (先横后竖): Ví dụ 十, 干, 王.',
          '2. Phẩy trước, mác sau (先撇后捺): Ví dụ 人, 八, 入, 天.',
          '3. Trên trước, dưới sau (从上到下): Ví dụ 三, 合, 是.',
          '4. Trái trước, phải sau (从左到右): Ví dụ 你, 好, 明, 林.',
          '5. Ngoài trước, trong sau (先外后内): Ví dụ 月, 同, 问, 凤.',
          '6. Vào trong trước, đóng khung sau (先里头后封口): Ví dụ 日, 回, 国, 园.',
          '7. Giữa trước, hai bên sau (先中间后两边): Ví dụ 小, 水, 山, 办.'
        ]
      },
      {
        type: 'table',
        heading: 'Bảng 60 Bộ thủ tần suất cao nhất trong tiếng Trung hiện đại',
        columns: ['Bộ (Biến thể)', 'Nét', 'Pinyin', 'Hán-Việt', 'Nghĩa cốt lõi & Chữ tiêu biểu'],
        rows: [
          ['一', '1', 'yī', 'Nhất', 'Số một, ngang — 三, 上, 下, 不'],
          ['丨', '1', 'gǔn', 'Cổn', 'Nét sổ thẳng — 中, 串, 丰'],
          ['丶', '1', 'diǎn', 'Điểm', 'Chấm, giọt — 主, 丹, 为'],
          ['丿', '1', 'piě', 'Phiệt', 'Nét phẩy — 久, 乎, 么'],
          ['乙 (乚)', '1', 'yǐ', 'Ất', 'Cong, uốn — 九, 也, 习'],
          ['二', '2', 'èr', 'Nhị', 'Số hai — 于, 云, 五'],
          ['亠', '2', 'tóu', 'Đầu', 'Nắp trên đầu — 京, 交, 夜, 亮'],
          ['人 (亻)', '2', 'rén', 'Nhân', 'Con người — 你, 他, 们, 休, 作'],
          ['儿', '2', 'ér', 'Nhi', 'Trẻ nhỏ, chân — 先, 光, 免'],
          ['八 (丷)', '2', 'bā', 'Bát', 'Tách đôi — 公, 六, 分, 共'],
          ['冖', '2', 'mì', 'Mịch', 'Khăn trùm — 写, 军, 农'],
          ['冫', '2', 'bīng', 'Băng', 'Băng giá, lạnh — 冷, 冰, 准, 凉'],
          ['刀 (刂)', '2', 'dāo', 'Đao', 'Dao, cắt — 别, 到, 刻, 利'],
          ['力', '2', 'lì', 'Lực', 'Sức lực — 办, 加, 动, 助, 劳'],
          ['十', '2', 'shí', 'Thập', 'Mười, giao nhau — 千, 午, 华, 协'],
          ['厂', '2', 'chǎng', 'Hán', 'Vách đá, xưởng — 厅, 历, 原, 厨'],
          ['又', '2', 'yòu', 'Hựu', 'Bàn tay, lặp lại — 友, 双, 反, 发, 取'],
          ['口', '3', 'kǒu', 'Khẩu', 'Miệng, ăn nói — 吃, 喝, 叫, 听, 问'],
          ['囗', '3', 'wéi', 'Vi', 'Bao vây — 国, 回, 因, 园, 图'],
          ['土', '3', 'tǔ', 'Thổ', 'Đất đai — 在, 地, 场, 城, 块'],
          ['夕', '3', 'xī', 'Tịch', 'Chiều tối — 外, 多, 夜, 够'],
          ['大', '3', 'dà', 'Đại', 'To lớn — 天, 太, 夫, 奇'],
          ['女', '3', 'nǚ', 'Nữ', 'Phụ nữ — 好, 妈, 姐, 妹, 她'],
          ['子', '3', 'zǐ', 'Tử', 'Con cái — 字, 学, 孩, 孙'],
          ['宀', '3', 'mián', 'Miên', 'Mái nhà — 家, 安, 定, 客, 室'],
          ['寸', '3', 'cùn', 'Thốn', 'Tấc, phép đo — 对, 导, 封, 尊'],
          ['小', '3', 'xiǎo', 'Tiểu', 'Nhỏ bé — 少, 尖, 常, 光'],
          ['尸', '3', 'shī', 'Thi', 'Thân thể, mái che — 居, 屋, 层, 展'],
          ['山', '3', 'shān', 'Sơn', 'Núi non — 岁, 岛, 岭, 岸'],
          ['工', '3', 'gōng', 'Công', 'Thợ, chế tác — 左, 差, 巧, 项'],
          ['巾', '3', 'jīn', 'Cân', 'Khăn vải — 市, 布, 师, 常, 帮'],
          ['广', '3', 'guǎng', 'Quảng', 'Nhà rộng — 店, 床, 度, 座, 康'],
          ['弓', '3', 'gōng', 'Cung', 'Cây cung — 引, 张, 强, 弹'],
          ['彳', '3', 'chì', 'Xích', 'Bước chân — 行, 很, 得, 往, 待'],
          ['心 (忄)', '4', 'xīn', 'Tâm', 'Trái tim, cảm xúc — 想, 意, 快, 忙, 怕'],
          ['手 (扌)', '4', 'shǒu', 'Thủ', 'Bàn tay, hành động — 打, 把, 拿, 拉, 找'],
          ['日', '4', 'rì', 'Nhật', 'Mặt trời, ngày — 明, 早, 时, 星, 晚'],
          ['月', '4', 'yuè', 'Nguyệt', 'Mặt trăng, tháng/thịt — 期, 朋, 脸, 脑'],
          ['木', '4', 'mù', 'Mộc', 'Cây cối, gỗ — 林, 桌, 椅, 校, 杯'],
          ['水 (氵)', '4', 'shuǐ', 'Thủy', 'Nước, chất lỏng — 河, 海, 洗, 渴, 汤'],
          ['火 (灬)', '4', 'huǒ', 'Hỏa', 'Lửa, nhiệt — 热, 烧, 烤, 点, 照'],
          ['犬 (犭)', '4', 'quǎn', 'Khuyển', 'Loài thú — 狗, 猫, 猪, 独, 猜'],
          ['王 (⺩)', '4', 'wáng', 'Vương/Ngọc', 'Vua, ngọc quý — 玩, 球, 现, 班'],
          ['田', '5', 'tián', 'Điền', 'Ruộng đồng — 男, 界, 留, 画'],
          ['目', '5', 'mù', 'Mục', 'Con mắt — 看, 眼, 睡, 省'],
          ['石', '5', 'shí', 'Thạch', 'Đá cứng — 破, 碗, 研, 硬'],
          ['示 (礻)', '5', 'shì', 'Thị', 'Thần linh, tế lễ — 祝, 社, 礼, 福'],
          ['禾', '5', 'hé', 'Hòa', 'Lúa má — 秋, 种, 科, 积'],
          ['竹 (⺮)', '6', 'zhú', 'Trúc', 'Cây tre — 笔, 等, 第, 笑, 篮'],
          ['米', '6', 'mǐ', 'Mễ', 'Gạo, hạt — 粉, 粮, 精, 糖'],
          ['糸 (纟)', '6', 'mì', 'Mịch', 'Sợi tơ, kết nối — 红, 绿, 线, 练, 经'],
          ['耳', '6', 'ěr', 'Nhĩ', 'Cái tai — 闻, 聪, 联, 职'],
          ['肉 (月)', '6', 'ròu', 'Nhục', 'Thịt, cơ thể — 肚, 腿, 胖, 脚'],
          ['艹 (艸)', '3', 'cǎo', 'Thảo', 'Cỏ cây — 草, 花, 茶, 药, 菜'],
          ['辵 (辶)', '3', 'chuò', 'Sước', 'Bước đi — 进, 远, 近, 送, 还'],
          ['言 (讠)', '2', 'yán', 'Ngôn', 'Lời nói — 语, 话, 请, 说, 读'],
          ['贝', '4', 'bèi', 'Bối', 'Vỏ sò, tiền tài — 买, 卖, 贵, 费, 财'],
          ['车', '4', 'chē', 'Xa', 'Xe cộ — 轻, 较, 辆, 输'],
          ['金 (钅)', '5', 'jīn', 'Kim', 'Kim loại — 钱, 银, 错, 铁, 钟'],
          ['食 (饣)', '3', 'shí', 'Thực', 'Thức ăn — 饭, 饿, 饮, 饼']
        ]
      },
      {
        type: 'pitfall',
        heading: 'Lỗi người Việt hay mắc khi viết bộ thủ',
        items: [
          {
            wrong: 'Nhầm bộ Thị (礻 — 1 chấm) với bộ Y (衤 — 2 chấm) ở các chữ như 衬衫, 福.',
            wrongNote: 'Hai bộ trông gần giống nhau nhưng khác hoàn toàn nghĩa.',
            right: '福 / 礼 dùng 礻 (phúc, lễ nghi); 衬衫 / 裤 dùng 衤 (áo sơ mi, quần).',
            rightPinyin: 'fú / lǐ  vs  chènshān / kù',
            rightMeaning: 'Thần linh/lễ (1 chấm) vs Quần áo/vải vóc (2 chấm).'
          }
        ]
      },
      {
        type: 'key_terms',
        heading: 'Chữ ghép bộ thủ tiêu biểu nên lưu SRS',
        terms: [
          { hanzi: '谢谢', pinyin: 'xièxie', hanviet: 'Tạ tạ', meaning: 'Cảm ơn (bộ Ngôn 讠)', level: 'HSK 1' },
          { hanzi: '休假', pinyin: 'xiūjià', hanviet: 'Hưu giá', meaning: 'Nghỉ phép (亻 tựa gốc 木)', level: 'HSK 3' },
          { hanzi: '清晰', pinyin: 'qīngxī', hanviet: 'Thanh tích', meaning: 'Rõ ràng (bộ Thủy 氵)', level: 'HSK 5' }
        ]
      }
    ]
  },
  {
    id: 'hz-measure-words-handbook',
    title: 'Sổ Tay Lượng Từ Tiếng Trung (量词) HSK 1–6 Chuẩn Xác Theo Ngữ Nghĩa',
    title_cn: 'HSK 1–6 汉语量词实用分类手册',
    category: 'Từ vựng & Giao tiếp',
    guideType: 'Lượng từ',
    academic_category: 'vocabulary',
    examSystem: 'both',
    exam_version: 'both',
    level: 'HSK 1-6',
    practiceLevel: 'HSK 2',
    skill: 'vocabulary',
    skills: ['Từ vựng', 'Ngữ pháp', 'Nói & Khẩu ngữ'],
    estimatedMinutes: 18,
    summary: 'Phân loại lượng từ theo hình dáng, chức năng & phép lịch sự: 个/位/名, 条/张/把/支, 本/册/份/篇, 辆/架/艘 và 次/遍/趟.',
    description: 'Khắc phục thói quen dùng "个" cho mọi danh từ. Bảng tra cứu trực quan giúp bạn chọn đúng lượng từ trong khẩu ngữ hàng ngày và bài thi viết HSK.',
    tags: ['Lượng từ', '量词', '个 và 位', '条 và 张', 'HSK 1-6'],
    pinyinKeywords: ['liangci', 'ge', 'wei', 'tiao', 'zhang', 'ba', 'luong tu'],
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
    worksheetChars: '个 位 名 条 张 把 支 本 份 次',
    isInteractiveGuide: true,
    packKey: 'practical',
    contentBlocks: [
      {
        type: 'table',
        heading: 'Bảng đối chiếu các nhóm lượng từ dễ nhầm nhất',
        columns: ['Nhóm chủ đề', 'Lượng từ & Pinyin', 'Tiêu chí dùng chuẩn', 'Ví dụ đi kèm'],
        rows: [
          ['Con người', '个 (gè) / 位 (wèi) / 名 (míng)', '个 thân mật; 位 kính trọng; 名 trang trọng/nghề nghiệp', '一个朋友 / 一位老师 / 两名医生'],
          ['Dài, uốn dẻo', '条 (tiáo) / 根 (gēn)', '条 cho vật dài mềm, đường, cá, quần; 根 mảnh thẳng', '一条河 / 一条裤子 / 一根筷子'],
          ['Phẳng, bề mặt', '张 (zhāng) / 面 (miàn)', '张 cho giấy, vé, bàn, ảnh, giường; 面 gương, cờ', '一张票 / 一张桌子 / 一面镜子'],
          ['Có tay cầm', '把 (bǎ)', 'Đồ vật cầm nắm hoặc một nắm', '一把伞 / 一把椅子 / 一把钥匙'],
          ['Sách, bài, tờ', '本 (běn) / 篇 (piān) / 份 (fèn)', '本 quyển; 篇 bài văn; 份 hợp đồng, phần ăn, báo', '一本书 / 一篇文章 / 一份简历'],
          ['Phương tiện', '辆 (liàng) / 架 (jià) / 艘 (sōu)', '辆 xe có bánh; 架 máy bay, đàn piano; 艘 tàu lớn', '一辆汽车 / 一架飞机 / 一艘轮船'],
          ['Động lượng (lần)', '次 (cì) / 遍 (biàn) / 趟 (tàng)', '次 số lần nói chung; 遍 từ đầu đến cuối; 趟 chuyến đi', '去过三次 / 读了两遍 / 去了一趟北京']
        ]
      },
      {
        type: 'examples',
        heading: 'Ví dụ phân biệt cặp lượng từ kinh điển',
        items: [
          {
            hanzi: '欢迎各位老师今天来参加我们的毕业典礼。',
            pinyin: 'Huānyíng gè wèi lǎoshī jīntiān lái cānjiā wǒmen de bìyè diǎnlǐ.',
            vietnamese: 'Chào mừng quý thầy cô hôm nay đến tham dự lễ tốt nghiệp của chúng em.',
            note: 'Dùng 位 thể hiện sự kính trọng với giáo viên/khách.'
          },
          {
            hanzi: '请把这张表填好，连同两份简历一起交到前台。',
            pinyin: 'Qǐng bǎ zhè zhāng biǎo tián hǎo, liántóng liǎng fèn jiǎnlì yìqǐ jiāo dào qiántái.',
            vietnamese: 'Vui lòng điền xong tờ biểu mẫu này, nộp cùng hai bản hồ sơ xin việc tới quầy lễ tân.',
            note: '表 (biểu mẫu 1 tờ) dùng 张; 简历 (bộ hồ sơ gồm nhiều trang) dùng 份.'
          },
          {
            hanzi: '这篇课文很长，我已经从头到尾朗读了三遍。',
            pinyin: 'Zhè piān kèwén hěn cháng, wǒ yǐjīng cóngtóu-dàowěi lǎngdú le sān biàn.',
            vietnamese: 'Bài khóa này rất dài, tôi đã đọc to từ đầu đến cuối ba lượt rồi.',
            note: '遍 nhấn mạnh quy trình trọn vẹn từ đầu tới cuối.'
          }
        ]
      },
      {
        type: 'pitfall',
        heading: 'Lỗi người Việt hay mắc với Lượng từ',
        items: [
          {
            wrong: '我买了一个裤子和一个雨伞。',
            wrongNote: 'Dịch "một cái quần / một cái ô" thành 个 thay vì lượng từ đặc trưng.',
            right: '我买了一条裤子和一把雨伞。',
            rightPinyin: 'Wǒ mǎi le yì tiáo kùzi hé yì bǎ yǔsǎn.',
            rightMeaning: 'Tôi đã mua một chiếc quần và một chiếc ô.'
          }
        ]
      },
      {
        type: 'key_terms',
        heading: 'Lượng từ tần suất cao cần lưu SRS',
        terms: [
          { hanzi: '一张票', pinyin: 'yì zhāng piào', hanviet: 'Nhất trương phiếu', meaning: 'Một tấm vé', level: 'HSK 2' },
          { hanzi: '一份简历', pinyin: 'yí fèn jiǎnlì', hanviet: 'Nhất phần giản lịch', meaning: 'Một bộ sơ yếu lý lịch', level: 'HSK 4' },
          { hanzi: '一趟', pinyin: 'yí tàng', hanviet: 'Nhất thảng', meaning: 'Một chuyến (đi lại)', level: 'HSK 4' }
        ]
      }
    ]
  },
  {
    id: 'hz-synonyms-hsk3-5',
    title: 'Phân Biệt Từ Gần Nghĩa Trọng Tâm (近义词辨析) — HSK 3–5',
    title_cn: 'HSK 3–5 高频近义词辨析精讲',
    category: 'Ngữ pháp chuyên sâu',
    guideType: 'Từ gần nghĩa',
    academic_category: 'vocabulary',
    examSystem: 'both',
    exam_version: 'both',
    level: 'HSK 3-5',
    practiceLevel: 'HSK 4',
    skill: 'vocabulary',
    skills: ['Từ vựng', 'Ngữ pháp', 'Đọc hiểu'],
    estimatedMinutes: 20,
    summary: 'Giải thích dứt điểm 8 cặp từ dễ sai nhất khi làm bài chọn từ điền vào chỗ trống: 二/两, 还是/或者, 终于/到底, 适合/合适, 往往/常常, 刚才/刚刚.',
    description: 'Người học tiếng Trung thường dịch 2 từ ra cùng 1 nghĩa tiếng Việt nên chọn nhầm từ loại hoặc ngữ cảnh. Bảng đối chiếu này chỉ rõ điểm khác biệt về từ loại, vị trí và sắc thái.',
    tags: ['Từ gần nghĩa', '近义词', 'HSK 3', 'HSK 4', 'HSK 5', '二 và 两'],
    pinyinKeywords: ['jinyici', 'liang', 'haishi', 'huozhe', 'shihe', 'heshi', 'tu gan nghia'],
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
    worksheetChars: '二 两 还 或 适 合 往 常 必 需',
    isInteractiveGuide: true,
    packKey: 'practical',
    contentBlocks: [
      {
        type: 'table',
        heading: 'Bảng phân biệt 8 cặp từ gần nghĩa HSK 3–5',
        columns: ['Cặp từ', 'Từ A (Từ loại & Cách dùng)', 'Từ B (Từ loại & Cách dùng)'],
        rows: [
          ['二 (èr) vs 两 (liǎng)', 'Đọc số đếm, số thứ tự, ngày/tháng, hàng chục/đơn vị (第二, 十二)', 'Đứng trước lượng từ, 千/万/亿 (两个人, 两千块)'],
          ['还是 (háishi) vs 或者 (huòzhě)', 'Dùng trong CÂU HỎI lựa chọn hoặc câu gián tiếp chưa rõ (你喝茶还是咖啡？)', 'Dùng trong CÂU TRẦN THUẬT (茶或者咖啡都可以)'],
          ['终于 (zhōngyú) vs 到底 (dàodǐ)', 'Diễn tả kết quả mong chờ đã thành hiện thực; không dùng để hỏi', 'Dùng trong câu hỏi gặng ("rốt cuộc") hoặc kết cục ("tới cùng")'],
          ['适合 (shìhé) vs 合适 (héshì)', 'ĐỘNG TỪ: mang được tân ngữ (适合我, 适合年轻人)', 'TÍNH TỪ: KHÔNG mang tân ngữ trực tiếp (很合适, 合适的时间)'],
          ['往往 (wǎngwǎng) vs 常常 (chángcháng)', 'Thói quen có QUY LUẬT trong quá khứ/hiện tại; không dùng cho tương lai hay mệnh lệnh', 'Tần suất nhiều đơn thuần; dùng được cho tương lai ("Hãy thường xuyên…")'],
          ['了解 (liǎojiě) vs 知道 (zhīdào)', 'Hiểu sâu, nắm rõ tình hình/tính cách đối tượng', 'Biết thông tin, sự việc bề mặt; hay đi với mệnh đề'],
          ['刚才 (gāngcái) vs 刚刚 (gānggāng)', 'DANH TỪ chỉ thời gian ("lúc nãy"), đứng trước hoặc sau chủ ngữ', 'PHÓ TỪ ("vừa mới"), bắt buộc đứng trước động từ'],
          ['必须 (bìxū) vs 必需 (bìxū)', 'PHÓ TỪ ("bắt buộc phải"): cộng động từ (必须按时到)', 'ĐỘNG/TÍNH TỪ ("thiết yếu"): làm định ngữ (生活必需品)']
        ]
      },
      {
        type: 'examples',
        heading: 'Ví dụ đối chiếu trong đề HSK',
        items: [
          {
            hanzi: '这件衣服的颜色很适合你，而且大小也非常合适。',
            pinyin: 'Zhè jiàn yīfu de yánsè hěn shìhé nǐ, érqiě dàxiǎo yě fēicháng héshì.',
            vietnamese: 'Màu sắc chiếc áo này rất hợp với bạn, hơn nữa kích cỡ cũng rất vừa vặn.',
            note: '适合 + 你 (có tân ngữ); 非常 + 合适 (tính từ đứng cuối).'
          },
          {
            hanzi: '周末大家往往去郊外散心，但下个月我打算常常去体育馆锻炼。',
            pinyin: 'Zhōumò dàjiā wǎngwǎng qù jiāowài sànxīn, dàn xià gè yuè wǒ dǎsuàn chángcháng qù tǐyùguǎn duànliàn.',
            vietnamese: 'Cuối tuần mọi người thường hay ra ngoại ô thư giãn, nhưng tháng sau tôi dự định thường xuyên tới nhà thi đấu tập luyện.',
            note: 'Dự định tương lai (下个月…打算) chỉ dùng 常常/经常, không dùng 往往.'
          }
        ]
      },
      {
        type: 'pitfall',
        heading: 'Lỗi người Việt hay mắc',
        items: [
          {
            wrong: '明天或者后天去比较方便吗？',
            wrongNote: 'Dùng 或者 trong câu hỏi lựa chọn trực tiếp.',
            right: '明天还是后天去比较方便？',
            rightPinyin: 'Míngtiān háishi hòutiān qù bǐjiào fāngbiàn?',
            rightMeaning: 'Ngày mai hay ngày kia đi thì tiện hơn?'
          }
        ]
      },
      {
        type: 'key_terms',
        heading: 'Từ cặp dễ nhầm nên ôn bằng SRS',
        terms: [
          { hanzi: '适合', pinyin: 'shìhé', hanviet: 'Thích hợp', meaning: 'Phù hợp với (+ Tân ngữ)', level: 'HSK 4' },
          { hanzi: '合适', pinyin: 'héshì', hanviet: 'Hợp thích', meaning: 'Thích hợp, vừa vặn (Tính từ)', level: 'HSK 4' },
          { hanzi: '往往', pinyin: 'wǎngwǎng', hanviet: 'Vãng vãng', meaning: 'Thường hay (có tính quy luật)', level: 'HSK 4' }
        ]
      }
    ]
  },
  {
    id: 'hz-synonyms-hsk5-9',
    title: 'Phân Biệt Từ Gần Nghĩa Cao Cấp (近义词辨析) — HSK 5–9',
    title_cn: 'HSK 5–9 中高级近义词辨析与搭配',
    category: 'Ngữ pháp chuyên sâu',
    guideType: 'Từ gần nghĩa',
    academic_category: 'vocabulary',
    examSystem: 'both',
    exam_version: 'both',
    level: 'HSK 5-9',
    practiceLevel: 'HSK 6',
    skill: 'vocabulary',
    skills: ['Từ vựng', 'Đọc hiểu', 'Viết & Thuận bút'],
    estimatedMinutes: 25,
    summary: 'Làm rõ khác biệt kết hợp từ (搭配) ở trình độ cao cấp: 反应/反映, 改进/改善, 发挥/发扬, 充分/充足, 启发/启示, 居然/竟然, 实施/实行.',
    description: 'Trong HSK 5–9, câu hỏi hiếm khi kiểm tra nghĩa từ đơn mà kiểm tra kết hợp từ cố định (collocation) và sắc thái trang trọng. Tài liệu này giúp bạn chốt điểm phần Đọc điền từ.',
    tags: ['Từ gần nghĩa', 'HSK 5', 'HSK 6', 'HSK 7-9', 'Kết hợp từ', '近义词'],
    pinyinKeywords: ['fanying', 'gaijin', 'gaishan', 'fahui', 'fayang', 'qifa', 'shishi'],
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
    worksheetChars: '反 应 映 改 进 善 挥 扬 启 示',
    isInteractiveGuide: true,
    packKey: 'practical',
    contentBlocks: [
      {
        type: 'table',
        heading: 'Bảng đối chiếu kết hợp từ (搭配) chuẩn HSK 5–9',
        columns: ['Cặp từ & Pinyin', 'Đi với danh từ / ngữ cảnh A', 'Đi với danh từ / ngữ cảnh B'],
        rows: [
          ['反应 (fǎnyìng) vs 反映 (fǎnyìng)', 'Phản ứng sinh lý/tâm lý/hóa học (反应很快, 过敏反应)', 'Phản ánh sự thật hoặc trình bày ý kiến lên cấp trên (反映情况/问题)'],
          ['改进 (gǎijìn) vs 改善 (gǎishàn)', 'Cải tiến kỹ thuật, phương pháp, quy trình (改进方法/技术)', 'Cải thiện đời sống, môi trường, quan hệ (改善生活/环境/关系)'],
          ['发挥 (fāhuī) vs 发扬 (fāyáng)', 'Phát huy năng lực, vai trò, ưu thế vốn có (发挥作用/优势)', 'Phát huy và nhân rộng truyền thống, tinh thần (发扬传统/精神)'],
          ['充分 (chōngfèn) vs 充足 (chōngzú)', 'Đầy đủ về mức độ trừu tượng: lý do, chuẩn bị (充分准备/利用)', 'Dồi dào về số lượng cụ thể: thời gian, tiền, ánh sáng (充足时间/资金)'],
          ['启发 (qǐfā) vs 启示 (qǐshì)', 'Gợi mở tư duy từ lời nói/hiện tượng (受到启发, 启发思考)', 'Bài học sâu sắc rút ra mang tính khai sáng (带来深刻的启示)'],
          ['居然 (jūrán) vs 竟然 (jìngrán)', 'Thường có chút bất ngờ pha bất mãn hoặc nhấn mạnh thái độ', 'Văn phong trang trọng hơn; cả hai dùng trong việc ngoài dự đoán'],
          ['实施 (shíshī) vs 实行 (shíxíng)', 'Thực thi kế hoạch, dự án, pháp luật cụ thể (实施计划/工程)', 'Thi hành chế độ, chính sách, biện pháp (实行制度/政策)'],
          ['遏制 (èzhì) vs 控制 (kòngzhì)', 'Kiềm chế xu hướng tiêu cực/đà lan rộng (遏制犯罪/通胀)', 'Kiểm soát trung tính vật chất hoặc cảm xúc (控制情绪/速度)']
        ]
      },
      {
        type: 'examples',
        heading: 'Ví dụ chuẩn văn phong học thuật & báo chí',
        items: [
          {
            hanzi: '这次调查报告真实地反映了基层群众在医疗保障方面的实际诉求。',
            pinyin: 'Zhè cì diàochá bàogào zhēnshí de fǎnyìng le jīcéng qúnzhòng zài yīliáo bǎozhàng fāngmiàn de shíjì sùqiú.',
            vietnamese: 'Bản báo cáo khảo sát lần này đã phản ánh chân thực nguyện vọng thực tế của người dân cơ sở về bảo hiểm y tế.',
            note: 'Phản ánh tình hình/nguyện vọng bắt buộc dùng 反映 (bộ Nhật).'
          },
          {
            hanzi: '只有在充足资金的支持下，团队才能充分发挥自身的技术优势。',
            pinyin: 'Zhǐyǒu zài chōngzú zījīn de zhīchí xià, tuánduì cái néng chōngfèn fāhuī zìshēn de jìshù yōushì.',
            vietnamese: 'Chỉ dưới sự hỗ trợ của nguồn vốn dồi dào, đội ngũ mới có thể phát huy trọn vẹn ưu thế kỹ thuật của mình.',
            note: '充足 + 资金 (vật chất hữu hình); 充分 + 发挥 (mức độ hành động).'
          }
        ]
      },
      {
        type: 'pitfall',
        heading: 'Lỗi người Việt hay mắc ở HSK 5–9',
        items: [
          {
            wrong: '我们需要改进当地的生活环境。',
            wrongNote: 'Đánh đồng "cải thiện" và "cải tiến"; 生活/环境 không đi với 改进.',
            right: '我们需要改善当地的生活环境，并改进生产工艺。',
            rightPinyin: 'Wǒmen xūyào gǎishàn dāngdì de shēnghuó huánjìng, bìng gǎijìn shēngchǎn gōngyì.',
            rightMeaning: 'Chúng ta cần cải thiện môi trường sống địa phương, đồng thời cải tiến quy trình sản xuất.'
          }
        ]
      },
      {
        type: 'key_terms',
        heading: 'Cặp từ kết hợp cao cấp HSK 5–9',
        terms: [
          { hanzi: '改善环境', pinyin: 'gǎishàn huánjìng', hanviet: 'Cải thiện hoàn cảnh', meaning: 'Cải thiện môi trường', level: 'HSK 5' },
          { hanzi: '反映情况', pinyin: 'fǎnyìng qíngkuàng', hanviet: 'Phản ánh tình huống', meaning: 'Phản ánh tình hình', level: 'HSK 5' },
          { hanzi: '遏制', pinyin: 'èzhì', hanviet: 'Át chế', meaning: 'Kiềm chế, ngăn chặn xu hướng xấu', level: 'HSK 7-9' }
        ]
      }
    ]
  },
  {
    id: 'hz-exam-blueprint-hsk20-vs-30',
    title: 'Cẩm Nang Chiến Thuật & Bảng So Sánh Đề Thi HSK 2.0 vs HSK 3.0 (Cấp 1–9)',
    title_cn: 'HSK 2.0 与 HSK 3.0（1–9级）考试结构及应试策略',
    category: 'Đề thi HSK',
    guideType: 'Chiến thuật HSK',
    academic_category: 'hsk_preparation',
    examSystem: 'both',
    exam_version: 'both',
    level: 'HSK 1-9',
    practiceLevel: 'HSK 3',
    skill: 'listening',
    skills: ['Luyện thi HSK', 'Nghe hiểu', 'Đọc hiểu', 'Viết & Thuận bút'],
    estimatedMinutes: 20,
    summary: 'Đối chiếu số câu, thời lượng, thang điểm đỗ chính xác của HSK 2.0 (1–6) và HSK 3.0 (1–9 hiệu lực 2026-12-13) cùng chiến thuật phân bổ thời gian phòng thi.',
    description: 'Toàn bộ số liệu trong cẩm nang được đồng bộ trực tiếp với ma trận đề thi thực hành trên HanziGo, giúp thí sinh chọn đúng hệ thi và phân bổ thời gian từng kỹ năng hợp lý.',
    tags: ['HSK 2.0', 'HSK 3.0', 'Cấu trúc đề thi', 'Chiến thuật', 'HSK 1-9'],
    pinyinKeywords: ['kaoshi', 'hsk', 'celue', 'chien thuat', 'de thi'],
    updatedAt: '2026-11-28',
    verified_date: '2026-11-28',
    host_type: 'hanzigo_original',
    verificationStatus: 'verified_official',
    license: 'Đối chiếu Khung Khảo thí CTI & HanziGo',
    publisher: 'Ban Khảo thí HanziGo',
    author: 'Ban Khảo thí HanziGo',
    format: 'Cẩm nang chiến thuật',
    sourceUrl: 'https://www.chinesetest.cn/',
    downloadUrl: 'https://www.chinesetest.cn/',
    worksheetChars: '听 说 读 写 译 题 卷 考 过 级',
    isInteractiveGuide: true,
    packKey: 'practical',
    contentBlocks: [
      {
        type: 'table',
        heading: 'Bảng cấu trúc đề thi HSK 2.0 (Cấp 1–6)',
        columns: ['Cấp độ', 'Tổng câu', 'Phân bổ kỹ năng (Nghe / Đọc / Viết)', 'Thời lượng', 'Thang điểm (Đạt)'],
        rows: [
          ['HSK 1 (2.0)', '40 câu', '20 Nghe + 20 Đọc', '40 phút', '200 điểm (120)'],
          ['HSK 2 (2.0)', '60 câu', '35 Nghe + 25 Đọc', '55 phút', '200 điểm (120)'],
          ['HSK 3 (2.0)', '80 câu', '40 Nghe + 30 Đọc + 10 Viết (Nói riêng)', '90 phút', '300 điểm (180)'],
          ['HSK 4 (2.0)', '100 câu', '45 Nghe + 40 Đọc + 15 Viết (Nói riêng)', '105 phút', '300 điểm (180)'],
          ['HSK 5 (2.0)', '100 câu', '45 Nghe + 45 Đọc + 10 Viết (Nói riêng)', '125 phút', '300 điểm (180)'],
          ['HSK 6 (2.0)', '101 câu', '50 Nghe + 50 Đọc + 1 Viết tóm tắt (Nói riêng)', '140 phút', '300 điểm (180)']
        ]
      },
      {
        type: 'table',
        heading: 'Bảng cấu trúc đề thi HSK 3.0 (Cấp 1–9, hiệu lực 2026-12-13)',
        columns: ['Cấp độ', 'Tổng câu', 'Cấu trúc kỹ năng chính', 'Thời lượng', 'Điểm chuẩn / Ghi chú Nói'],
        rows: [
          ['HSK 1 (3.0)', '40 câu', '20 Nghe (12p) + 20 Đọc (20p)', '40 phút', '200đ / đạt 120 • Không thi Nói'],
          ['HSK 2 (3.0)', '60 câu', '25 Nghe (17p) + 25 Đọc (25p) + 10 Viết (10p)', '60 phút', '300đ / đạt 180 • Có phần Viết câu'],
          ['HSK 3 (3.0)', '70 câu', '30 Nghe (25p) + 30 Đọc (33p) + 10 Viết (15p)', '83 phút', '300đ / đạt 180 • Nói riêng 15 câu/15p'],
          ['HSK 4 (3.0)', '70 câu', '32 Nghe (20p) + 32 Đọc (30p) + 6 Viết (25p)', '85 phút', '300đ / đạt 180 • Nói riêng 5 câu/20p'],
          ['HSK 5 (3.0)', '72 câu', '35 Nghe (25p) + 35 Đọc (35p) + 2 Viết bài văn (40p)', '110 phút', '300đ / đạt 180 • Nói riêng 5 câu/23p'],
          ['HSK 6 (3.0)', '82 câu', '40 Nghe (30p) + 40 Đọc (40p) + 2 Viết ứng dụng & nghị luận (45p)', '125 phút', '300đ / đạt 180 • Bỏ câu bệnh, Nói riêng 5 câu/23p'],
          ['HSK 7–9 (3.0)', '91 câu', '40 Nghe (30p) + 40 Đọc (50p) + 2 Viết (55p) + 4 Dịch (41p) + 5 Nói (24p)', '200 phút', '300đ tích hợp: HSK7 ≥ 180, HSK8 ≥ 210, HSK9 ≥ 240']
        ]
      },
      {
        type: 'checklist',
        heading: 'Chiến thuật phân bổ thời gian & xử lý phòng thi',
        items: [
          'Phần Nghe: Đọc lướt đáp án 4 lựa chọn TRƯỚC khi băng chạy để khoanh vùng từ khóa ai/ở đâu/làm gì; lỡ 1 câu lập tức bỏ qua để không mất dây câu kế tiếp.',
          'Phần Đọc: Với HSK 4–6, đọc câu hỏi trước khi đọc đoạn văn dài (kỹ thuật scan thông tin); không sa lầy quá 60 giây cho một câu điền khuyết.',
          'Phần Viết HSK 3.0 cấp 5–6: Dành 5 phút lập dàn ý 3 luận điểm trước khi gõ/viết; HSK 6 Phần 1 phải giữ đúng thể thức văn bản ứng dụng (tiêu đề, lời chào, ký tên).',
          'Phần Dịch & Đọc biểu đồ HSK 7–9: Chú trọng cấu trúc câu bị động ẩn và giữ nguyên số liệu chuẩn khi tóm tắt biểu đồ 250 chữ.'
        ]
      },
      {
        type: 'key_terms',
        heading: 'Từ vựng phòng thi cần nắm chắc',
        terms: [
          { hanzi: '议论文', pinyin: 'yìlùnwén', hanviet: 'Nghị luận văn', meaning: 'Bài văn nghị luận nêu quan điểm (HSK 6/7-9)', level: 'HSK 6' },
          { hanzi: '应用文', pinyin: 'yìngyòngwén', hanviet: 'Ứng dụng văn', meaning: 'Văn bản ứng dụng thực tế (thư, thông báo)', level: 'HSK 6' },
          { hanzi: '复述', pinyin: 'fùshù', hanviet: 'Phức thuật', meaning: 'Thuật lại/tóm tắt bằng lời nói', level: 'HSK 7-9' }
        ]
      }
    ]
  },
  {
    id: 'hz-worksheets-printable-pack',
    title: 'Bộ Phiếu Luyện Viết Chữ Hán Ô Mễ Tự In A4 (HSK 1–6 & Bộ Thủ)',
    title_cn: 'HSK 1–6 米字格A4字帖与手写练习包',
    category: 'Bộ thủ & Hán tự',
    guideType: 'Phiếu in ấn',
    academic_category: 'chinese_characters',
    examSystem: 'both',
    exam_version: 'both',
    level: 'HSK 1-6',
    practiceLevel: 'HSK 1',
    skill: 'writing',
    skills: ['Viết & Thuận bút', 'Bộ thủ & Hán tự'],
    estimatedMinutes: 15,
    summary: 'Mở nhanh trình tạo phiếu luyện viết Ô Mễ Tự / Điền Tự chuẩn A4 với các bộ chữ mẫu chia sẵn theo cấp độ HSK 1, HSK 2, HSK 3, HSK 4–6 và Bộ thủ.',
    description: 'Tích hợp trực tiếp với công cụ tạo Worksheet in ấn của HanziGo. Bạn có thể chọn bộ chữ mẫu theo cấp độ hoặc nhập chữ bất kỳ để in PDF luyện viết bút mực.',
    tags: ['Phiếu in ấn', 'Ô Mễ Tự', 'A4', 'Luyện viết', 'Tập viết'],
    pinyinKeywords: ['mizige', 'tianzige', 'xiezi', 'phieu in', 'luyen viet'],
    updatedAt: '2026-11-28',
    verified_date: '2026-11-28',
    host_type: 'hanzigo_original',
    verificationStatus: 'curated',
    license: 'Tài liệu Giáo dục Mở HanziGo',
    publisher: 'Ban Học thuật HanziGo',
    author: 'Ban Học thuật HanziGo',
    format: 'In ấn A4 tương tác',
    sourceUrl: '/vo-tap-viet-chu-han-a4.html',
    downloadUrl: '/vo-tap-viet-chu-han-a4.html',
    worksheetChars: '你好谢谢学习中国汉语',
    isInteractiveGuide: true,
    packKey: 'practical',
    contentBlocks: [
      {
        type: 'worksheet_presets',
        heading: 'Chọn bộ chữ mẫu để mở Phiếu Luyện Viết A4 ngay',
        presets: [
          {
            label: 'Phiếu HSK 1 — Chữ nền tảng & Chào hỏi',
            level: 'HSK 1',
            description: '20 chữ mở đầu: 你好谢谢再见学习中国汉语人我他',
            chars: '你好谢谢再见学习中国汉语'
          },
          {
            label: 'Phiếu HSK 2 — Đời sống & Thời gian',
            level: 'HSK 2',
            description: 'Luyện nét chữ hai phần trái–phải, trên–dưới hay dùng ở HSK 2.',
            chars: '准备帮助打算意思问题介绍'
          },
          {
            label: 'Phiếu HSK 3 — Bổ ngữ & Câu chữ 把/被',
            level: 'HSK 3',
            description: 'Tập viết chính xác các chữ dễ sai nét trong bài thi viết HSK 3.',
            chars: '整理决定习惯解决影响环境'
          },
          {
            label: 'Phiếu HSK 4–6 — Chữ nhiều nét & Thành ngữ',
            level: 'HSK 4-6',
            description: 'Luyện cân bằng kết cấu cho các chữ ghép phức tạp trình độ trung–cao cấp.',
            chars: '鼓舞谦虚默契严谨繁华巩固'
          },
          {
            label: 'Phiếu Bộ thủ căn bản — Vĩnh Tự Bát Pháp',
            level: 'Nhập môn',
            description: '8 nét cơ bản trong chữ 永 cùng nhóm bộ thủ 1–4 nét.',
            chars: '永人水火木土口心手言'
          }
        ]
      },
      {
        type: 'checklist',
        heading: 'Hướng dẫn luyện viết hiệu quả đạt chuẩn chữ đẹp',
        items: [
          'Dùng bút gel 0.5mm hoặc 0.7mm trên giấy A4 định lượng 80–100gsm để giữ nét thanh đậm rõ.',
          'Viết chậm theo thứ tự nét đúng 3 ô mờ đầu, sau đó tự viết vào các ô trống còn lại mà không nhìn mẫu.',
          'Kiểm tra tỷ lệ 4 góc trong khung 米字格 để chữ cân tâm, không lệch sang một bên.'
        ]
      }
    ]
  }
];
