/**
 * =========================================================================
 * HANZIGO - 214 KANGXI RADICALS CANONICAL DATASET (BẢNG 214 BỘ THỦ KHANG HY)
 * =========================================================================
 * Chuẩn hóa đầy đủ 214 bộ thủ tiếng Hán theo số nét bút tăng dần (1 đến 17 nét),
 * kèm biến thể Giản thể / dạng viết tắt, Pinyin, phiên âm Hán Việt, giải nghĩa ngữ dụng tiếng Việt
 * và các chữ Hán thông dụng tiêu biểu.
 * =========================================================================
 */

export const KANGXI_RADICALS = [
  // 1 NÉT (Strokes: 1)
  { id: 1, radical: '一', variants: [], strokes: 1, pinyin: 'yī', hanviet: 'Nhất', meaning: 'Một, số một, khởi đầu', commonChars: ['一', '七', '三', '下', '上', '不', '万', '与'] },
  { id: 2, radical: '丨', variants: [], strokes: 1, pinyin: 'gǔn', hanviet: 'Cổn', meaning: 'Nét sổ thẳng đứng', commonChars: ['中', '串', '个', '丰'] },
  { id: 3, radical: '丶', variants: [], strokes: 1, pinyin: 'diǎn', hanviet: 'Điểm', meaning: 'Dấu chấm, giọt nước', commonChars: ['丸', '丹', '主', '之'] },
  { id: 4, radical: '丿', variants: [], strokes: 1, pinyin: 'piě', hanviet: 'Phiệt', meaning: 'Nét phẩy, nghiêng từ phải qua trái', commonChars: ['久', '乏', '乎', '乒', '乓'] },
  { id: 5, radical: '乙', variants: ['乚', '乛'], strokes: 1, pinyin: 'yǐ', hanviet: 'Ất', meaning: 'Vị trí thứ 2 trong can chi, nét cong', commonChars: ['乙', '九', '乞', '也', '习'] },
  { id: 6, radical: '亅', variants: [], strokes: 1, pinyin: 'jué', hanviet: 'Quyết', meaning: 'Nét móc lên', commonChars: ['了', '矛', '事'] },

  // 2 NÉT (Strokes: 2)
  { id: 7, radical: '二', variants: [], strokes: 2, pinyin: 'èr', hanviet: 'Nhị', meaning: 'Số hai', commonChars: ['二', '于', '云', '五', '井', '些'] },
  { id: 8, radical: '亠', variants: [], strokes: 2, pinyin: 'tóu', hanviet: 'Đầu', meaning: 'Phần nắp che ở trên đầu', commonChars: ['亡', '交', '京', '亮', '市', '夜'] },
  { id: 9, radical: '人', variants: ['亻', '入'], strokes: 2, pinyin: 'rén', hanviet: 'Nhân', meaning: 'Con người, hành vi con người', commonChars: ['人', '你', '他', '们', '休', '体', '做', '什', '作', '住'] },
  { id: 10, radical: '儿', variants: [], strokes: 2, pinyin: 'ér', hanviet: 'Nhi', meaning: 'Trẻ con, chân người đứng', commonChars: ['儿', '先', '光', '克', '免', '亮'] },
  { id: 11, radical: '入', variants: [], strokes: 2, pinyin: 'rù', hanviet: 'Nhập', meaning: 'Đi vào, tham gia', commonChars: ['入', '内', '全', '两'] },
  { id: 12, radical: '八', variants: ['丷'], strokes: 2, pinyin: 'bā', hanviet: 'Bát', meaning: 'Số tám, tách ra hai bên', commonChars: ['八', '公', '六', '共', '分', '半', '兴'] },
  { id: 13, radical: '冂', variants: [], strokes: 2, pinyin: 'jiōng', hanviet: 'Quynh', meaning: 'Vùng đất xa xôi, khung ngoài', commonChars: ['网', '同', '周', '冈'] },
  { id: 14, radical: '冖', variants: [], strokes: 2, pinyin: 'mì', hanviet: 'Mịch', meaning: 'Khăn trùm, che phủ bên trên', commonChars: ['冗', '写', '军', '冠'] },
  { id: 15, radical: '冫', variants: [], strokes: 2, pinyin: 'bīng', hanviet: 'Băng', meaning: 'Băng giá, lạnh lẽo', commonChars: ['冷', '冰', '准', '减', '凉', '冬'] },
  { id: 16, radical: '几', variants: [], strokes: 2, pinyin: 'jī', hanviet: 'Kỷ', meaning: 'Cái bàn nhỏ, ghế thấp', commonChars: ['几', '凡', '凤', '凭', '凯'] },
  { id: 17, radical: '凵', variants: [], strokes: 2, pinyin: 'kǎn', hanviet: 'Khảm', meaning: 'Hố sâu, vật chứa trũng', commonChars: ['凶', '出', '函', '凿'] },
  { id: 18, radical: '刀', variants: ['刂'], strokes: 2, pinyin: 'dāo', hanviet: 'Đao', meaning: 'Dao, vũ khí bén, cắt gọt', commonChars: ['刀', '分', '切', '刑', '列', '别', '利', '到', '刻', '前'] },
  { id: 19, radical: '力', variants: [], strokes: 2, pinyin: 'lì', hanviet: 'Lực', meaning: 'Sức mạnh, năng lượng, nỗ lực', commonChars: ['力', '办', '功', '加', '助', '动', '务', '劳'] },
  { id: 20, radical: '勹', variants: [], strokes: 2, pinyin: 'bāo', hanviet: 'Bao', meaning: 'Bao bọc, ôm lấy', commonChars: ['包', '勺', '匀', '勾', '旬'] },
  { id: 21, radical: '匕', variants: [], strokes: 2, pinyin: 'bǐ', hanviet: 'Chuỷ', meaning: 'Cái thìa, muỗng, đoản đao', commonChars: ['匕', '化', '北', '匙'] },
  { id: 22, radical: '匚', variants: [], strokes: 2, pinyin: 'fāng', hanviet: 'Phương', meaning: 'Cái hộp đựng, ngăn tủ', commonChars: ['匠', '匡', '匣', '匪'] },
  { id: 23, radical: '匸', variants: [], strokes: 2, pinyin: 'xǐ', hanviet: 'Hệ', meaning: 'Che giấu, cất giữ kín đáo', commonChars: ['匹', '区', '医'] },
  { id: 24, radical: '十', variants: [], strokes: 2, pinyin: 'shí', hanviet: 'Thập', meaning: 'Số mười, hoàn chỉnh', commonChars: ['十', '千', '午', '半', '华', '协', '博'] },
  { id: 25, radical: '卜', variants: [], strokes: 2, pinyin: 'bǔ', hanviet: 'Bặc', meaning: 'Bói toán, đoán trước', commonChars: ['卜', '卡', '卢', '占', '卦'] },
  { id: 26, radical: '卩', variants: ['阝(tiết)'], strokes: 2, pinyin: 'jié', hanviet: 'Tiết', meaning: 'Đốt tre, con dấu, quỳ gối', commonChars: ['卫', '印', '危', '卷', '即', '却'] },
  { id: 27, radical: '厂', variants: [], strokes: 2, pinyin: 'chǎng', hanviet: 'Hán', meaning: 'Vách đá dốc, sườn núi, xưởng', commonChars: ['厅', '历', '厉', '压', '原', '厕'] },
  { id: 28, radical: '厶', variants: [], strokes: 2, pinyin: 'sī', hanviet: 'Khư', meaning: 'Riêng tư, bản thân, cá nhân', commonChars: ['去', '县', '参', '私'] },
  { id: 29, radical: '又', variants: [], strokes: 2, pinyin: 'yòu', hanviet: 'Hựu', meaning: 'Lại, bàn tay nắm lấy', commonChars: ['又', '叉', '友', '双', '反', '发', '取', '受'] },

  // 3 NÉT (Strokes: 3)
  { id: 30, radical: '口', variants: [], strokes: 3, pinyin: 'kǒu', hanviet: 'Khẩu', meaning: 'Miệng, lời nói, ăn uống, lối vào', commonChars: ['口', '古', '句', '叫', '可', '各', '吃', '听', '问', '同', '响', '唱'] },
  { id: 31, radical: '囗', variants: [], strokes: 3, pinyin: 'wéi', hanviet: 'Vi', meaning: 'Bờ cõi bao bọc bốn phía, thành trì', commonChars: ['四', '回', '国', '因', '团', '园', '图'] },
  { id: 32, radical: '土', variants: [], strokes: 3, pinyin: 'tǔ', hanviet: 'Thổ', meaning: 'Đất, bùn đất, địa lý', commonChars: ['土', '在', '地', '场', '城', '坏', '块', '基'] },
  { id: 33, radical: '士', variants: [], strokes: 3, pinyin: 'shì', hanviet: 'Sĩ', meaning: 'Kẻ sĩ, người tài giỏi, chiến sĩ', commonChars: ['士', '壬', '壮', '声', '壶'] },
  { id: 34, radical: '夂', variants: [], strokes: 3, pinyin: 'zhǐ', hanviet: 'Tri', meaning: 'Đi chậm theo sau', commonChars: ['处', '条', '务', '备'] },
  { id: 35, radical: '夊', variants: [], strokes: 3, pinyin: 'suī', hanviet: 'Tuy', meaning: 'Đi chậm rãi, khoan thai', commonChars: ['复', '夏'] },
  { id: 36, radical: '夕', variants: [], strokes: 3, pinyin: 'xī', hanviet: 'Tịch', meaning: 'Buổi chiều tối, đêm', commonChars: ['夕', '外', '多', '夜', '够'] },
  { id: 37, radical: '大', variants: [], strokes: 3, pinyin: 'dà', hanviet: 'Đại', meaning: 'To lớn, người dang rộng tay chân', commonChars: ['大', '天', '太', '夫', '央', '奇', '套'] },
  { id: 38, radical: '女', variants: [], strokes: 3, pinyin: 'nǚ', hanviet: 'Nữ', meaning: 'Phụ nữ, tính nữ, hôn nhân', commonChars: ['女', '好', '妈', '如', '她', '姐', '妹', '奶', '始', '姓'] },
  { id: 39, radical: '子', variants: ['孑'], strokes: 3, pinyin: 'zǐ', hanviet: 'Tử', meaning: 'Con cái, trẻ nhỏ, thế hệ sau', commonChars: ['子', '字', '学', '孩', '存', '孙', '孤'] },
  { id: 40, radical: '宀', variants: [], strokes: 3, pinyin: 'mián', hanviet: 'Miên', meaning: 'Mái nhà che chở, nơi cư ngụ', commonChars: ['安', '完', '定', '家', '客', '室', '字', '空'] },
  { id: 41, radical: '寸', variants: [], strokes: 3, pinyin: 'cùn', hanviet: 'Thốn', meaning: 'Tấc, đơn vị đo, quy củ gang tay', commonChars: ['寸', '对', '封', '射', '寿', '尊'] },
  { id: 42, radical: '小', variants: ['⺌', '⺍'], strokes: 3, pinyin: 'xiǎo', hanviet: 'Tiểu', meaning: 'Nhỏ bé, ít ỏi', commonChars: ['小', '少', '尖', '光', '当', '尚', '常'] },
  { id: 43, radical: '尢', variants: ['尣'], strokes: 3, pinyin: 'wāng', hanviet: 'Uông', meaning: 'Tật nguyền ở chân, què quặt', commonChars: ['尤', '就', '尴尬'] },
  { id: 44, radical: '尸', variants: [], strokes: 3, pinyin: 'shī', hanviet: 'Thi', meaning: 'Thân xác, chỗ ở, ngồi nghiêng', commonChars: ['尺', '尾', '层', '居', '屋', '展'] },
  { id: 45, radical: '屮', variants: [], strokes: 3, pinyin: 'chè', hanviet: 'Triệt', meaning: 'Mầm cây mới nảy mầm', commonChars: ['屯'] },
  { id: 46, radical: '山', variants: [], strokes: 3, pinyin: 'shān', hanviet: 'Sơn', meaning: 'Núi non, cao lớn, hiểm trở', commonChars: ['山', '岁', '岛', '岭', '岩', '岸'] },
  { id: 47, radical: '巛', variants: ['川', '巜'], strokes: 3, pinyin: 'chuān', hanviet: 'Xuyên', meaning: 'Dòng sông uốn lượn, sông ngòi', commonChars: ['川', '州', '巡', '顺'] },
  { id: 48, radical: '工', variants: [], strokes: 3, pinyin: 'gōng', hanviet: 'Công', meaning: 'Công cụ, thợ thuyền, chế tác', commonChars: ['工', '左', '巧', '巨', '差', '项'] },
  { id: 49, radical: '己', variants: ['已', '巳'], strokes: 3, pinyin: 'jǐ', hanviet: 'Kỷ', meaning: 'Bản thân, can thứ sáu', commonChars: ['己', '已', '巴', '改', '起'] },
  { id: 50, radical: '巾', variants: [], strokes: 3, pinyin: 'jīn', hanviet: 'Cân', meaning: 'Khăn vải, cờ xí, trang phục', commonChars: ['巾', '市', '布', '师', '希', '常', '带', '帮'] },
  { id: 51, radical: '干', variants: [], strokes: 3, pinyin: 'gān', hanviet: 'Can', meaning: 'Lá chắn, can thiệp, khô ráo', commonChars: ['干', '平', '年', '并', '幸'] },
  { id: 52, radical: '幺', variants: [], strokes: 3, pinyin: 'yāo', hanviet: 'Yêu', meaning: 'Nhỏ bé, non nớt, số một trong xúc xắc', commonChars: ['幻', '幼', '幽'] },
  { id: 53, radical: '广', variants: [], strokes: 3, pinyin: 'guǎng', hanviet: 'Quảng', meaning: 'Ngôi nhà rộng tựa lưng vào núi', commonChars: ['广', '床', '店', '府', '度', '座', '庭', '康'] },
  { id: 54, radical: '廴', variants: [], strokes: 3, pinyin: 'yǐn', hanviet: 'Dẫn', meaning: 'Bước dài chân, kéo dài', commonChars: ['延', '建', '廷'] },
  { id: 55, radical: '廾', variants: [], strokes: 3, pinyin: 'gǒng', hanviet: 'Củng', meaning: 'Hai tay chắp lại dâng lên', commonChars: ['开', '弁', '异', '弃', '弄'] },
  { id: 56, radical: '弋', variants: [], strokes: 3, pinyin: 'yì', hanviet: 'Dặc', meaning: 'Cái cọc gỗ, bắn tên có buộc dây', commonChars: ['弋', '式', '贰'] },
  { id: 57, radical: '弓', variants: [], strokes: 3, pinyin: 'gōng', hanviet: 'Cung', meaning: 'Cây cung, cong uốn lượn', commonChars: ['弓', '引', '张', '弱', '强', '弯', '弹'] },
  { id: 58, radical: '彐', variants: ['彑'], strokes: 3, pinyin: 'jì', hanviet: 'Kệ', meaning: 'Đầu con nhím, con lợn', commonChars: ['当', '归', '录', '急'] },
  { id: 59, radical: '彡', variants: [], strokes: 3, pinyin: 'shān', hanviet: 'Sam', meaning: 'Lông dài, hoa văn trang trí', commonChars: ['形', '影', '彩', '彰', '须'] },
  { id: 60, radical: '彳', variants: [], strokes: 3, pinyin: 'chì', hanviet: 'Xích', meaning: 'Bước chân trái, đi chậm trên đường', commonChars: ['行', '很', '得', '往', '待', '律', '微', '后'] },

  // 4 NÉT (Strokes: 4)
  { id: 61, radical: '心', variants: ['忄', '⺗'], strokes: 4, pinyin: 'xīn', hanviet: 'Tâm', meaning: 'Trái tim, tình cảm, tâm lý, suy nghĩ', commonChars: ['心', '想', '态', '意', '情', '快', '忙', '慢', '怕', '懂'] },
  { id: 62, radical: '戈', variants: [], strokes: 4, pinyin: 'gē', hanviet: 'Qua', meaning: 'Vũ khí cổ, giáo mác, chiến tranh', commonChars: ['我', '或', '战', '成', '戚', '戒'] },
  { id: 63, radical: '戶', variants: ['户', '戸'], strokes: 4, pinyin: 'hù', hanviet: 'Hộ', meaning: 'Cửa một cánh, hộ gia đình', commonChars: ['户', '房', '所', '扇', '扁'] },
  { id: 64, radical: '手', variants: ['扌'], strokes: 4, pinyin: 'shǒu', hanviet: 'Thủ', meaning: 'Bàn tay, động tác của tay', commonChars: ['手', '打', '找', '提', '拿', '排', '接', '把', '护', '指'] },
  { id: 65, radical: '支', variants: [], strokes: 4, pinyin: 'zhī', hanviet: 'Chi', meaning: 'Cành cây, chi nhánh, chống đỡ', commonChars: ['支', '攲'] },
  { id: 66, radical: '攴', variants: ['攵'], strokes: 4, pinyin: 'pū', hanviet: 'Phộc', meaning: 'Gõ khẽ, đánh roi, giáo dục', commonChars: ['收', '改', '攻', '放', '政', '故', '救', '敏', '教', '数'] },
  { id: 67, radical: '文', variants: [], strokes: 4, pinyin: 'wén', hanviet: 'Văn', meaning: 'Văn chương, chữ viết, hoa văn', commonChars: ['文', '齐', '斌', '斑'] },
  { id: 68, radical: '斗', variants: [], strokes: 4, pinyin: 'dǒu', hanviet: 'Đấu', meaning: 'Cái đấu đong gạo, cái muôi', commonChars: ['斗', '料', '斜', '斛'] },
  { id: 69, radical: '斤', variants: [], strokes: 4, pinyin: 'jīn', hanviet: 'Cân', meaning: 'Cái rìu, đơn vị cân lường', commonChars: ['斤', '斥', '斧', '斯', '断', '新'] },
  { id: 70, radical: '方', variants: [], strokes: 4, pinyin: 'fāng', hanviet: 'Phương', meaning: 'Vuông vức, hướng, phương pháp', commonChars: ['方', '放', '旅', '旁', '旋', '族'] },
  { id: 71, radical: '无', variants: ['旡'], strokes: 4, pinyin: 'wú', hanviet: 'Vô', meaning: 'Không có', commonChars: ['无', '既'] },
  { id: 72, radical: '日', variants: [], strokes: 4, pinyin: 'rì', hanviet: 'Nhật', meaning: 'Mặt trời, ban ngày, thời gian', commonChars: ['日', '早', '明', '星', '时', '昨', '晚', '晴', '春', '显'] },
  { id: 73, radical: '曰', variants: [], strokes: 4, pinyin: 'yuē', hanviet: 'Viết', meaning: 'Nói rằng, phát ngôn', commonChars: ['曰', '曲', '更', '曼', '替'] },
  { id: 74, radical: '月', variants: ['⺝'], strokes: 4, pinyin: 'yuè', hanviet: 'Nguyệt', meaning: 'Mặt trăng, tháng, phần thịt cơ thể (Nhục)', commonChars: ['月', '朋', '服', '望', '期', '朝', '肚', '胖', '背'] },
  { id: 75, radical: '木', variants: [], strokes: 4, pinyin: 'mù', hanviet: 'Mộc', meaning: 'Cây cối, gỗ, thực vật thân gỗ', commonChars: ['木', '本', '李', '机', '林', '校', '样', '树', '桌', '桥'] },
  { id: 76, radical: '欠', variants: [], strokes: 4, pinyin: 'qiàn', hanviet: 'Khiếm', meaning: 'Há miệng ngáp, thiếu thốn, nợ', commonChars: ['次', '欢', '欧', '歌', '歉'] },
  { id: 77, radical: '止', variants: [], strokes: 4, pinyin: 'zhǐ', hanviet: 'Chỉ', meaning: 'Dừng lại, bàn chân', commonChars: ['止', '正', '此', '步', '武', '歧'] },
  { id: 78, radical: '歹', variants: ['歺'], strokes: 4, pinyin: 'dǎi', hanviet: 'Đãi', meaning: 'Xương tàn, chết chóc, tai ương', commonChars: ['死', '殁', '残', '殊'] },
  { id: 79, radical: '殳', variants: [], strokes: 4, pinyin: 'shū', hanviet: 'Thù', meaning: 'Binh khí bằng tre gậy, đập đánh', commonChars: ['段', '殷', '毁', '毅'] },
  { id: 80, radical: '毋', variants: ['母'], strokes: 4, pinyin: 'wú', hanviet: 'Vô', meaning: 'Chớ, đừng, người mẹ nuôi con', commonChars: ['母', '每', '毒'] },
  { id: 81, radical: '比', variants: [], strokes: 4, pinyin: 'bǐ', hanviet: 'Tỉ', meaning: 'So sánh, kề cạnh nhau', commonChars: ['比', '毕', '皆', '毖'] },
  { id: 82, radical: '毛', variants: [], strokes: 4, pinyin: 'máo', hanviet: 'Mao', meaning: 'Lông tóc, lông thú, mỏng manh', commonChars: ['毛', '毫', '毯', '毡'] },
  { id: 83, radical: '氏', variants: [], strokes: 4, pinyin: 'shì', hanviet: 'Thị', meaning: 'Dòng họ, chi tộc', commonChars: ['氏', '民', '氓'] },
  { id: 84, radical: '气', variants: [], strokes: 4, pinyin: 'qì', hanviet: 'Khí', meaning: 'Không khí, mây bay, hơi thở', commonChars: ['气', '氛', '氢', '氧', '汽'] },
  { id: 85, radical: '水', variants: ['氵', '氺'], strokes: 4, pinyin: 'shuǐ', hanviet: 'Thủy', meaning: 'Nước, dòng chảy, chất lỏng', commonChars: ['水', '河', '海', '洗', '汉', '江', '洋', '没', '流', '清', '湖'] },
  { id: 86, radical: '火', variants: ['灬'], strokes: 4, pinyin: 'huǒ', hanviet: 'Hỏa', meaning: 'Lửa, nhiệt độ, nấu nướng, ánh sáng', commonChars: ['火', '灭', '灯', '灰', '热', '烤', '点', '照', '烧', '熊'] },
  { id: 87, radical: '爪', variants: ['爫'], strokes: 4, pinyin: 'zhǎo', hanviet: 'Trảo', meaning: 'Móng vuốt thú, chụp bắt', commonChars: ['爬', '爱', '受', '采'] },
  { id: 88, radical: '父', variants: [], strokes: 4, pinyin: 'fù', hanviet: 'Phụ', meaning: 'Cha, người đứng đầu gia đình', commonChars: ['父', '爷', '爸'] },
  { id: 89, radical: '爻', variants: [], strokes: 4, pinyin: 'yáo', hanviet: 'Hào', meaning: 'Vạch quẻ kinh Dịch, đan chéo', commonChars: ['爽'] },
  { id: 90, radical: '爿', variants: [], strokes: 4, pinyin: 'pán', hanviet: 'Tường', meaning: 'Tấm ván gỗ bên trái, giường ngủ', commonChars: ['壮', '状', '将'] },
  { id: 91, radical: '片', variants: [], strokes: 4, pinyin: 'piàn', hanviet: 'Phiến', meaning: 'Mảnh ván, lát mỏng, thẻ gỗ', commonChars: ['片', '版', '牌'] },
  { id: 92, radical: '牙', variants: [], strokes: 4, pinyin: 'yá', hanviet: 'Nha', meaning: 'Răng nanh, răng hàm', commonChars: ['牙', '邪', '雅'] },
  { id: 93, radical: '牛', variants: ['牜'], strokes: 4, pinyin: 'niú', hanviet: 'Ngưu', meaning: 'Trâu bò, gia súc kéo cày', commonChars: ['牛', '物', '特', '牵', '牲'] },
  { id: 94, radical: '犬', variants: ['犭'], strokes: 4, pinyin: 'quǎn', hanviet: 'Khuyển', meaning: 'Chó, thú săn bốn chân', commonChars: ['狗', '猫', '猪', '狂', '独', '犯', '狐', '狸'] },

  // 5 NÉT (Strokes: 5)
  { id: 95, radical: '玄', variants: [], strokes: 5, pinyin: 'xuán', hanviet: 'Huyền', meaning: 'Màu đen sâu thẳm, huyền bí', commonChars: ['玄', '率'] },
  { id: 96, radical: '玉', variants: ['王', '玊'], strokes: 5, pinyin: 'yù', hanviet: 'Ngọc', meaning: 'Ngọc quý, đá quý, vua chúa', commonChars: ['玉', '王', '球', '理', '现', '班', '玩', '环'] },
  { id: 97, radical: '瓜', variants: [], strokes: 5, pinyin: 'guā', hanviet: 'Qua', meaning: 'Quả dưa, cây leo', commonChars: ['瓜', '瓣'] },
  { id: 98, radical: '瓦', variants: [], strokes: 5, pinyin: 'wǎ', hanviet: 'Ngõa', meaning: 'Ngói lợp nhà, đồ đất nung', commonChars: ['瓦', '瓶', '瓷'] },
  { id: 99, radical: '甘', variants: [], strokes: 5, pinyin: 'gān', hanviet: 'Cam', meaning: 'Ngọt ngào, cam tâm', commonChars: ['甘', '甜', '甚'] },
  { id: 100, radical: '生', variants: [], strokes: 5, pinyin: 'shēng', hanviet: 'Sinh', meaning: 'Sinh trưởng, sống, sinh sôi', commonChars: ['生', '产', '甥'] },
  { id: 101, radical: '用', variants: [], strokes: 5, pinyin: 'yòng', hanviet: 'Dụng', meaning: 'Dùng, áp dụng, công dụng', commonChars: ['用', '甩', '甫'] },
  { id: 102, radical: '田', variants: [], strokes: 5, pinyin: 'tián', hanviet: 'Điền', meaning: 'Ruộng đất, cày cấy', commonChars: ['田', '申', '男', '界', '留', '略', '番'] },
  { id: 103, radical: '疋', variants: ['⺪'], strokes: 5, pinyin: 'pǐ', hanviet: 'Thất', meaning: 'Cuộn vải, chân chạy', commonChars: ['疋', '蛋', '疏'] },
  { id: 104, radical: '疒', variants: [], strokes: 5, pinyin: 'nè', hanviet: 'Nạch', meaning: 'Bệnh tật, đau ốm nằm giường', commonChars: ['病', '痛', '疼', '疯', '疫', '瘦', '疲'] },
  { id: 105, radical: '癶', variants: [], strokes: 5, pinyin: 'bō', hanviet: 'Bát', meaning: 'Hai chân dang ra bước đi', commonChars: ['登', '发'] },
  { id: 106, radical: '白', variants: [], strokes: 5, pinyin: 'bái', hanviet: 'Bạch', meaning: 'Màu trắng, sáng tỏ, rõ ràng', commonChars: ['白', '百', '的', '皆', '皇'] },
  { id: 107, radical: '皮', variants: [], strokes: 5, pinyin: 'pí', hanviet: 'Bì', meaning: 'Da, lớp vỏ ngoài cùng', commonChars: ['皮', '破', '波'] },
  { id: 108, radical: '皿', variants: [], strokes: 5, pinyin: 'mǐn', hanviet: 'Mãnh', meaning: 'Bát đĩa, đồ đựng thức ăn', commonChars: ['盘', '盆', '盛', '益', '盒', '盖'] },
  { id: 109, radical: '目', variants: [], strokes: 5, pinyin: 'mù', hanviet: 'Mục', meaning: 'Mắt, nhìn ngắm, danh mục', commonChars: ['目', '看', '睛', '眼', '睡', '直', '盲', '督'] },
  { id: 110, radical: '矛', variants: [], strokes: 5, pinyin: 'máo', hanviet: 'Mâu', meaning: 'Cây mâu đâm thủng', commonChars: ['矛', '柔', '矜'] },
  { id: 111, radical: '矢', variants: [], strokes: 5, pinyin: 'shǐ', hanviet: 'Thỉ', meaning: 'Mũi tên, bắn thẳng, thề thốt', commonChars: ['矢', '知', '短', '矮', '矩'] },
  { id: 112, radical: '石', variants: [], strokes: 5, pinyin: 'shí', hanviet: 'Thạch', meaning: 'Đá, khoáng vật, kiên cố', commonChars: ['石', '研', '确', '破', '硬', '矿', '碗'] },
  { id: 113, radical: '示', variants: ['礻'], strokes: 5, pinyin: 'shì', hanviet: 'Thị', meaning: 'Thần linh, tế lễ, phước lành', commonChars: ['社', '祝', '福', '神', '祖', '礼', '视'] },
  { id: 114, radical: '禸', variants: [], strokes: 5, pinyin: 'róu', hanviet: 'Nhựu', meaning: 'Dấu chân muông thú dẫm lên', commonChars: ['禹', '离', '禽'] },
  { id: 115, radical: '禾', variants: [], strokes: 5, pinyin: 'hé', hanviet: 'Hòa', meaning: 'Cây lúa, hoa màu, nông nghiệp', commonChars: ['禾', '和', '秋', '种', '科', '秒', '租', '程', '香'] },
  { id: 116, radical: '穴', variants: [], strokes: 5, pinyin: 'xué', hanviet: 'Huyệt', meaning: 'Hang hốc, hang đá trú ngụ', commonChars: ['究', '穷', '空', '突', '穿', '窝'] },
  { id: 117, radical: '立', variants: [], strokes: 5, pinyin: 'lì', hanviet: 'Lập', meaning: 'Đứng thẳng, thành lập', commonChars: ['立', '站', '端', '竞', '章'] },

  // 6 NÉT (Strokes: 6)
  { id: 118, radical: '竹', variants: ['⺮'], strokes: 6, pinyin: 'zhú', hanviet: 'Trúc', meaning: 'Cây tre, ống nứa, vật làm từ tre', commonChars: ['笑', '笔', '第', '简', '答', '等', '篇', '管'] },
  { id: 119, radical: '米', variants: [], strokes: 6, pinyin: 'mǐ', hanviet: 'Mễ', meaning: 'Gạo, hạt ngũ cốc, lương thực', commonChars: ['米', '粉', '糖', '类', '粗', '精', '粮'] },
  { id: 120, radical: '糸', variants: ['纟', '糹'], strokes: 6, pinyin: 'mì', hanviet: 'Mịch', meaning: 'Sợi tơ, dây nhợ, liên kết dệt may', commonChars: ['红', '级', '线', '练', '组', '结', '给', '细', '绝'] },
  { id: 121, radical: '缶', variants: [], strokes: 6, pinyin: 'fǒu', hanviet: 'Phẫu', meaning: 'Đồ gốm nung miệng nhỏ, lu sành', commonChars: ['缸', '缺', '罐'] },
  { id: 122, radical: '网', variants: ['罒', '⺲', '⺳'], strokes: 6, pinyin: 'wǎng', hanviet: 'Võng', meaning: 'Tấm lưới đánh cá, mạng lưới', commonChars: ['罗', '置', '罪', '署', '罩'] },
  { id: 123, radical: '羊', variants: ['⺶', '⺷'], strokes: 6, pinyin: 'yáng', hanviet: 'Dương', meaning: 'Con dê, cừu, tốt đẹp may mắn', commonChars: ['羊', '美', '群', '差', '着', '羞'] },
  { id: 124, radical: '羽', variants: [], strokes: 6, pinyin: 'yǔ', hanviet: 'Vũ', meaning: 'Lông chim, cánh bay', commonChars: ['羽', '习', '扇', '翠', '翼'] },
  { id: 125, radical: '老', variants: ['耂'], strokes: 6, pinyin: 'lǎo', hanviet: 'Lão', meaning: 'Già cả, tôn kính, từng trải', commonChars: ['老', '考', '者', '耆'] },
  { id: 126, radical: '而', variants: [], strokes: 6, pinyin: 'ér', hanviet: 'Nhi', meaning: 'Râu mép dưới cằm, liên từ mà', commonChars: ['而', '耐', '耍'] },
  { id: 127, radical: '耒', variants: [], strokes: 6, pinyin: 'lěi', hanviet: 'Lỗi', meaning: 'Cái cày xới đất', commonChars: ['耕', '耗', '耘'] },
  { id: 128, radical: '耳', variants: [], strokes: 6, pinyin: 'ěr', hanviet: 'Nhĩ', meaning: 'Cái tai, lắng nghe', commonChars: ['耳', '闻', '聪', '联', '听'] },
  { id: 129, radical: '聿', variants: ['⺻'], strokes: 6, pinyin: 'yù', hanviet: 'Duật', meaning: 'Cây bút lông viết chữ', commonChars: ['肃', '肆', '建', '书'] },
  { id: 130, radical: '肉', variants: ['月(nhục)'], strokes: 6, pinyin: 'ròu', hanviet: 'Nhục', meaning: 'Thịt, bắp cơ, cơ quan thân thể', commonChars: ['肉', '肚', '肥', '背', '胖', '胸', '脚', '脸'] },
  { id: 131, radical: '臣', variants: [], strokes: 6, pinyin: 'chén', hanviet: 'Thần', meaning: 'Quan thần, cúi đầu trung thành', commonChars: ['臣', '卧', '临', '坚'] },
  { id: 132, radical: '自', variants: [], strokes: 6, pinyin: 'zì', hanviet: 'Tự', meaning: 'Chính mình, từ đâu đến, cái mũi', commonChars: ['自', '息', '臭', '臬'] },
  { id: 133, radical: '至', variants: [], strokes: 6, pinyin: 'zhì', hanviet: 'Chí', meaning: 'Đến nơi, cùng tột, rất đỗi', commonChars: ['至', '致', '到', '室'] },
  { id: 134, radical: '臼', variants: [], strokes: 6, pinyin: 'jiù', hanviet: 'Cữu', meaning: 'Cái cối giã gạo', commonChars: ['臼', '舀', '插', '舅'] },
  { id: 135, radical: '舌', variants: [], strokes: 6, pinyin: 'shé', hanviet: 'Thiệt', meaning: 'Cái lưỡi, nếm vị, phát âm', commonChars: ['舌', '舍', '甜', '乱', '舒'] },
  { id: 136, radical: '舛', variants: [], strokes: 6, pinyin: 'chuǎn', hanviet: 'Suyễn', meaning: 'Sai lệch, hai bàn chân quay ngược', commonChars: ['舞', '舜'] },
  { id: 137, radical: '舟', variants: [], strokes: 6, pinyin: 'zhōu', hanviet: 'Chu', meaning: 'Thuyền bè, đi lại trên sông', commonChars: ['舟', '船', '航', '般', '舰'] },
  { id: 138, radical: '艮', variants: [], strokes: 6, pinyin: 'gèn', hanviet: 'Cấn', meaning: 'Quẻ Cấn, kiên định, dừng', commonChars: ['良', '艰', '狠', '退'] },
  { id: 139, radical: '色', variants: [], strokes: 6, pinyin: 'sè', hanviet: 'Sắc', meaning: 'Màu sắc, sắc đẹp, vẻ mặt', commonChars: ['色', '艳'] },
  { id: 140, radical: '艸', variants: ['艹'], strokes: 6, pinyin: 'cǎo', hanviet: 'Thảo', meaning: 'Cỏ cây hoa lá mọc trên đất', commonChars: ['草', '茶', '花', '蓝', '药', '英', '菜', '节', '落'] },
  { id: 141, radical: '虍', variants: [], strokes: 6, pinyin: 'hū', hanviet: 'Hổ', meaning: 'Vằn da hổ, chúa sơn lâm hung dữ', commonChars: ['虎', '虐', '虑', '虚', '号'] },
  { id: 142, radical: '虫', variants: [], strokes: 6, pinyin: 'chóng', hanviet: 'Trùng', meaning: 'Côn trùng, sâu bọ, rắn rết', commonChars: ['虽', '蛇', '蛋', '虽', '蜂', '虾', '蚊'] },
  { id: 143, radical: '血', variants: [], strokes: 6, pinyin: 'xuè', hanviet: 'Huyết', meaning: 'Máu chảy, sinh mạng', commonChars: ['血', '衄'] },
  { id: 144, radical: '行', variants: [], strokes: 6, pinyin: 'xíng', hanviet: 'Hành', meaning: 'Đi lại, hàng lối, thực thi', commonChars: ['行', '街', '衡', '衙'] },
  { id: 145, radical: '衣', variants: ['衤'], strokes: 6, pinyin: 'yī', hanviet: 'Y', meaning: 'Áo quần, trang phục, vải vóc', commonChars: ['初', '裤', '衬', '衫', '被', '裕', '裙'] },
  { id: 146, radical: '襾', variants: ['覀', '西'], strokes: 6, pinyin: 'yà', hanviet: 'Á', meaning: 'Che đậy, đậy nắp', commonChars: ['西', '要', '覆', '票'] },

  // 7 NÉT (Strokes: 7)
  { id: 147, radical: '見', variants: ['见'], strokes: 7, pinyin: 'jiàn', hanviet: 'Kiến', meaning: 'Thấy, gặp gỡ, nhận biết', commonChars: ['见', '规', '视', '觉', '观', '览'] },
  { id: 148, radical: '角', variants: [], strokes: 7, pinyin: 'jiǎo', hanviet: 'Giác', meaning: 'Góc nhọn, sừng thú, kèn', commonChars: ['角', '解', '触'] },
  { id: 149, radical: '言', variants: ['讠'], strokes: 7, pinyin: 'yán', hanviet: 'Ngôn', meaning: 'Lời nói, ngôn ngữ, đàm thoại', commonChars: ['话', '说', '语', '读', '写', '认', '让', '词', '课', '谁', '谢'] },
  { id: 150, radical: '谷', variants: [], strokes: 7, pinyin: 'gǔ', hanviet: 'Cốc', meaning: 'Thung lũng, khe núi sâu', commonChars: ['谷', '豁'] },
  { id: 151, radical: '豆', variants: [], strokes: 7, pinyin: 'dòu', hanviet: 'Đậu', meaning: 'Hạt đậu, cái chén cao chân đựng thịt', commonChars: ['豆', '短', '豉'] },
  { id: 152, radical: '豕', variants: [], strokes: 7, pinyin: 'shǐ', hanviet: 'Thỉ', meaning: 'Con heo, lợn nuôi', commonChars: ['家', '象', '豪', '聚'] },
  { id: 153, radical: '豸', variants: [], strokes: 7, pinyin: 'zhì', hanviet: 'Trĩ', meaning: 'Thú hoang dã bò dài thân', commonChars: ['豹', '豺', '貌'] },
  { id: 154, radical: '貝', variants: ['贝'], strokes: 7, pinyin: 'bèi', hanviet: 'Bối', meaning: 'Vỏ sò tiền cổ, tiền tài, của cải', commonChars: ['买', '卖', '贵', '货', '财', '贫', '贺', '费', '赚'] },
  { id: 155, radical: '赤', variants: [], strokes: 7, pinyin: 'chì', hanviet: 'Xích', meaning: 'Màu đỏ thắm, son trẻ, trần trụi', commonChars: ['赤', '赫'] },
  { id: 156, radical: '走', variants: ['赱'], strokes: 7, pinyin: 'zǒu', hanviet: 'Tẩu', meaning: 'Chạy, đi bộ, rời đi', commonChars: ['走', '起', '越', '超', '赶', '趣'] },
  { id: 157, radical: '足', variants: ['⻊'], strokes: 7, pinyin: 'zú', hanviet: 'Túc', meaning: 'Bàn chân, đầy đủ, động tác chân', commonChars: ['足', '跑', '跳', '跟', '踢', '路', '趴', '踩'] },
  { id: 158, radical: '身', variants: [], strokes: 7, pinyin: 'shēn', hanviet: 'Thân', meaning: 'Thân thể con người, mình', commonChars: ['身', '躺', '躯'] },
  { id: 159, radical: '車', variants: ['车'], strokes: 7, pinyin: 'chē', hanviet: 'Xa', meaning: 'Xe cộ, phương tiện đi lại có bánh', commonChars: ['车', '轮', '转', '轻', '载', '辆', '较', '输'] },
  { id: 160, radical: '辛', variants: [], strokes: 7, pinyin: 'xīn', hanviet: 'Tân', meaning: 'Vị cay, gian khổ, nhọc nhằn', commonChars: ['辛', '辣', '辞', '辨'] },
  { id: 161, radical: '辰', variants: [], strokes: 7, pinyin: 'chén', hanviet: 'Thần', meaning: 'Can chi Thìn, buổi sớm, thời khắc', commonChars: ['辰', '辱', '农'] },
  { id: 162, radical: '辵', variants: ['辶'], strokes: 7, pinyin: 'chuò', hanviet: 'Sước', meaning: 'Bước đi trên đường, di chuyển', commonChars: ['边', '过', '送', '进', '运', '道', '通', '追', '远', '近', '连'] },
  { id: 163, radical: '邑', variants: ['阝(phải)'], strokes: 7, pinyin: 'yì', hanviet: 'Ấp', meaning: 'Khu vực, đô thị, làng xã bên phải', commonChars: ['那', '部', '都', '邮', '邻', '郑'] },
  { id: 164, radical: '酉', variants: [], strokes: 7, pinyin: 'yǒu', hanviet: 'Dậu', meaning: 'Bình rượu ủ men, lên men say', commonChars: ['酒', '配', '酸', '酷', '醒', '醉'] },
  { id: 165, radical: '釆', variants: [], strokes: 7, pinyin: 'biàn', hanviet: 'Biện', meaning: 'Phân biệt, dấu móng vuốt', commonChars: ['番', '悉', '释'] },
  { id: 166, radical: '里', variants: [], strokes: 7, pinyin: 'lǐ', hanviet: 'Lý', meaning: 'Dặm đường, làng xóm bên trong', commonChars: ['里', '重', '野', '量'] },

  // 8 NÉT (Strokes: 8)
  { id: 167, radical: '金', variants: ['钅'], strokes: 8, pinyin: 'jīn', hanviet: 'Kim', meaning: 'Kim loại, vàng, sắc bén cơ khí', commonChars: ['钱', '银', '铁', '铜', '钟', '针', '错', '错', '键'] },
  { id: 168, radical: '長', variants: ['镸', '长'], strokes: 8, pinyin: 'cháng', hanviet: 'Trường', meaning: 'Dài lâu, lớn lên, trưởng', commonChars: ['长', '套'] },
  { id: 169, radical: '門', variants: ['门'], strokes: 8, pinyin: 'mén', hanviet: 'Môn', meaning: 'Cánh cửa hai cánh, môn học, lối vào', commonChars: ['门', '问', '间', '闻', '阔', '闹', '阅'] },
  { id: 170, radical: '阜', variants: ['阝(trái)'], strokes: 8, pinyin: 'fù', hanviet: 'Phụ', meaning: 'Gò đống đất đá, dốc núi bên trái', commonChars: ['院', '队', '阳', '阴', '阿', '陆', '阶'] },
  { id: 171, radical: '隶', variants: [], strokes: 8, pinyin: 'lì', hanviet: 'Đãi', meaning: 'Bắt kịp, người làm thuê', commonChars: ['隶', '康'] },
  { id: 172, radical: '隹', variants: [], strokes: 8, pinyin: 'zhuī', hanviet: 'Chuy', meaning: 'Chim đuôi ngắn', commonChars: ['难', '谁', '准', '虽', '集', '推', '雅'] },
  { id: 173, radical: '雨', variants: ['⻗'], strokes: 8, pinyin: 'yǔ', hanviet: 'Vũ', meaning: 'Mưa, hiện tượng thời tiết khí hậu', commonChars: ['雨', '雪', '零', '需', '雷', '震', '露', '霞'] },
  { id: 174, radical: '靑', variants: ['青'], strokes: 8, pinyin: 'qīng', hanviet: 'Thanh', meaning: 'Màu xanh lục, tuổi trẻ, thanh xuân', commonChars: ['青', '靓', '静'] },
  { id: 175, radical: '非', variants: [], strokes: 8, pinyin: 'fēi', hanviet: 'Phi', meaning: 'Không phải, trái ngược, sai trái', commonChars: ['非', '悲', '靠'] },

  // 9 NÉT (Strokes: 9)
  { id: 176, radical: '面', variants: ['靣'], strokes: 9, pinyin: 'miàn', hanviet: 'Diện', meaning: 'Mặt, bề mặt, diện mạo', commonChars: ['面', '靥'] },
  { id: 177, radical: '革', variants: [], strokes: 9, pinyin: 'gé', hanviet: 'Cách', meaning: 'Da thú đã thuộc, thay đổi cải cách', commonChars: ['革', '鞋', '靴', '鞭'] },
  { id: 178, radical: '韋', variants: ['韦'], strokes: 9, pinyin: 'wéi', hanviet: 'Vi', meaning: 'Da thú mềm dai, quay vòng', commonChars: ['韦', '韧', '韩'] },
  { id: 179, radical: '韭', variants: [], strokes: 9, pinyin: 'jiǔ', hanviet: 'Cửu', meaning: 'Cây rau hẹ', commonChars: ['韭'] },
  { id: 180, radical: '音', variants: [], strokes: 9, pinyin: 'yīn', hanviet: 'Âm', meaning: 'Âm thanh, giai điệu, tin tức', commonChars: ['音', '韵', '响'] },
  { id: 181, radical: '頁', variants: ['页'], strokes: 9, pinyin: 'yè', hanviet: 'Hiệt', meaning: 'Trang sách, đầu cổ con người', commonChars: ['页', '顶', '顺', '须', '烦', '领', '预', '顾', '颗'] },
  { id: 182, radical: '風', variants: ['风'], strokes: 9, pinyin: 'fēng', hanviet: 'Phong', meaning: 'Gió, phong thái, thói quen', commonChars: ['风', '飘', '扇'] },
  { id: 183, radical: '飛', variants: ['飞'], strokes: 9, pinyin: 'fēi', hanviet: 'Phi', meaning: 'Bay lượn trên không', commonChars: ['飞'] },
  { id: 184, radical: '食', variants: ['飠', '饣'], strokes: 9, pinyin: 'shí', hanviet: 'Thực', meaning: 'Ăn uống, thức ăn, bữa cơm', commonChars: ['饭', '饱', '饿', '饮', '馆', '饺', '饼'] },
  { id: 185, radical: '首', variants: [], strokes: 9, pinyin: 'shǒu', hanviet: 'Thủ', meaning: 'Đầu người, đứng đầu, bài thơ', commonChars: ['首', '道'] },
  { id: 186, radical: '香', variants: [], strokes: 9, pinyin: 'xiāng', hanviet: 'Hương', meaning: 'Mùi thơm ngan ngát của hạt thóc', commonChars: ['香', '馨'] },

  // 10 NÉT (Strokes: 10)
  { id: 187, radical: '馬', variants: ['马'], strokes: 10, pinyin: 'mǎ', hanviet: 'Mã', meaning: 'Con ngựa, chạy nhanh dũng mãnh', commonChars: ['马', '骑', '骗', '验', '驻', '驾', '惊'] },
  { id: 188, radical: '骨', variants: [], strokes: 10, pinyin: 'gǔ', hanviet: 'Cốt', meaning: 'Xương cốt, khung cơ thể', commonChars: ['骨', '骷', '髓'] },
  { id: 189, radical: '高', variants: ['髙'], strokes: 10, pinyin: 'gāo', hanviet: 'Cao', meaning: 'Chiều cao, cao quý, thượng lưu', commonChars: ['高', '亮'] },
  { id: 190, radical: '髟', variants: [], strokes: 10, pinyin: 'biāo', hanviet: 'Bưu', meaning: 'Tóc dài buông xõa', commonChars: ['髦', '髻'] },
  { id: 191, radical: '鬥', variants: ['斗(đấu)'], strokes: 10, pinyin: 'dòu', hanviet: 'Đấu', meaning: 'Chiến đấu, tranh đua', commonChars: ['闹'] },
  { id: 192, radical: '鬯', variants: [], strokes: 10, pinyin: 'chàng', hanviet: 'Sướng', meaning: 'Rượu thơm cúng tế trời đất', commonChars: ['郁'] },
  { id: 193, radical: '鬲', variants: [], strokes: 10, pinyin: 'lì', hanviet: 'Cách', meaning: 'Cái nồi ba chân thời cổ', commonChars: ['融'] },
  { id: 194, radical: '鬼', variants: [], strokes: 10, pinyin: 'guǐ', hanviet: 'Quỷ', meaning: 'Ma quỷ, tinh ranh khôn khéo', commonChars: ['鬼', '魂', '魄', '魔'] },

  // 11 NÉT (Strokes: 11)
  { id: 195, radical: '魚', variants: ['鱼'], strokes: 11, pinyin: 'yú', hanviet: 'Ngư', meaning: 'Con cá, loài thủy sinh dưới nước', commonChars: ['鱼', '鲜', '鲁', '鲜', '鲸', '鲨'] },
  { id: 196, radical: '鳥', variants: ['鸟'], strokes: 11, pinyin: 'niǎo', hanviet: 'Điểu', meaning: 'Con chim có lông vũ dài', commonChars: ['鸟', '鸡', '鸭', '鸣', '鸥', '鸽'] },
  { id: 197, radical: '鹵', variants: ['卤'], strokes: 11, pinyin: 'lǔ', hanviet: 'Lỗ', meaning: 'Đất mặn, nước muối khoáng', commonChars: ['卤', '咸'] },
  { id: 198, radical: '鹿', variants: [], strokes: 11, pinyin: 'lù', hanviet: 'Lộc', meaning: 'Con hươu sao, tài lộc may mắn', commonChars: ['鹿', '丽', '麟'] },
  { id: 199, radical: '麥', variants: ['麦'], strokes: 11, pinyin: 'mài', hanviet: 'Mạch', meaning: 'Lúa mì, lúa mạch', commonChars: ['麦', '面', '麸'] },
  { id: 200, radical: '麻', variants: [], strokes: 11, pinyin: 'má', hanviet: 'Ma', meaning: 'Cây gai dầu dệt vải, tê dại', commonChars: ['麻', '磨', '靡'] },

  // 12 NÉT (Strokes: 12)
  { id: 201, radical: '黃', variants: ['黄'], strokes: 12, pinyin: 'huáng', hanviet: 'Hoàng', meaning: 'Màu vàng của đất đai, vua chúa', commonChars: ['黄'] },
  { id: 202, radical: '黍', variants: [], strokes: 12, pinyin: 'shǔ', hanviet: 'Thử', meaning: 'Hạt kê, nếp dẻo làm rượu', commonChars: ['黍', '黏'] },
  { id: 203, radical: '黑', variants: [], strokes: 12, pinyin: 'hēi', hanviet: 'Hắc', meaning: 'Màu đen muội than, bóng tối', commonChars: ['黑', '默', '墨'] },
  { id: 204, radical: '黹', variants: [], strokes: 12, pinyin: 'zhǐ', hanviet: 'Chỉ', meaning: 'Thêu thùa, may vá hoa văn', commonChars: ['黼'] },

  // 13 NÉT (Strokes: 13)
  { id: 205, radical: '黽', variants: ['黾'], strokes: 13, pinyin: 'mǐn', hanviet: 'Mẫn', meaning: 'Con ếch, cóc, bò sát', commonChars: ['黾', '蝇'] },
  { id: 206, radical: '鼎', variants: [], strokes: 13, pinyin: 'dǐng', hanviet: 'Đỉnh', meaning: 'Đỉnh đồng ba chân biểu tượng uy quyền', commonChars: ['鼎'] },
  { id: 207, radical: '鼓', variants: [], strokes: 13, pinyin: 'gǔ', hanviet: 'Cổ', meaning: 'Trống da, gõ trống cổ vũ', commonChars: ['鼓'] },
  { id: 208, radical: '鼠', variants: [], strokes: 13, pinyin: 'shǔ', hanviet: 'Thử', meaning: 'Con chuột, linh thú đầu 12 con giáp', commonChars: ['鼠'] },

  // 14 NÉT (Strokes: 14)
  { id: 209, radical: '鼻', variants: [], strokes: 14, pinyin: 'bí', hanviet: 'Tị', meaning: 'Cái mũi, ngửi mùi, hô hấp', commonChars: ['鼻'] },
  { id: 210, radical: '齊', variants: ['齐'], strokes: 14, pinyin: 'qí', hanviet: 'Tề', meaning: 'Ngay ngắn bằng đều nhau', commonChars: ['齐', '斋'] },

  // 15 NÉT (Strokes: 15)
  { id: 211, radical: '齒', variants: ['齿'], strokes: 15, pinyin: 'chǐ', hanviet: 'Xỉ', meaning: 'Răng cửa, tuổi tác', commonChars: ['齿', '龄'] },

  // 16 NÉT (Strokes: 16)
  { id: 212, radical: '龍', variants: ['龙'], strokes: 16, pinyin: 'lóng', hanviet: 'Long', meaning: 'Con rồng, linh vật thần thoại', commonChars: ['龙', '龚'] },
  { id: 213, radical: '龜', variants: ['龟'], strokes: 16, pinyin: 'guī', hanviet: 'Quy', meaning: 'Con rùa, trường thọ vững chãi', commonChars: ['龟'] },

  // 17 NÉT (Strokes: 17)
  { id: 214, radical: '龠', variants: [], strokes: 17, pinyin: 'yuè', hanviet: 'Dược', meaning: 'Ống sáo trúc ba lỗ thời cổ', commonChars: ['龠', '钥'] }
];

/**
 * Lấy danh sách bộ thủ nhóm theo số nét (1 -> 17)
 */
export function getRadicalsGroupedByStrokes() {
  const groups = {};
  for (let s = 1; s <= 17; s++) {
    groups[s] = [];
  }
  KANGXI_RADICALS.forEach(r => {
    if (!groups[r.strokes]) groups[r.strokes] = [];
    groups[r.strokes].push(r);
  });
  return groups;
}

/**
 * Tra cứu bộ thủ theo ký tự hoặc phiên âm Hán Việt / Pinyin
 */
export function findRadical(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.trim().toLowerCase();

  return KANGXI_RADICALS.find(r => 
    r.radical === query ||
    r.variants.includes(query) ||
    r.pinyin.toLowerCase() === q ||
    r.hanviet.toLowerCase() === q ||
    r.meaning.toLowerCase().includes(q)
  ) || null;
}
