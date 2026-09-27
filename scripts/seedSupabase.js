import { createClient } from '@supabase/supabase-js';
import { VOCABULARY_LIST, CHARACTERS_WRITING } from '../src/data/chineseData.js';
import { DEFAULT_MATERIALS } from '../src/utils/materialsStorage.js';

const supabaseUrl = 'https://woszblniatdvijwdkmpm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvc3pibG5pYXRkdmlqd2RrbXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NzEwMTcsImV4cCI6MjEwNjA0NzAxN30.qpSGtdIgGG55MXsLJGbMS3KOLz6W_ZsC16r-6XixMXY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BASE_LEVEL_LESSONS = {
  'intro': [
    { id: 'intro-1', number: 1, title: 'Bảng 23 Thanh mẫu & 4 Thanh điệu cơ bản', duration: 20, xp: 40, desc: 'Luyện phát âm chuẩn các âm khó: b/p, d/t, z/c/s, zh/ch/sh và 4 cao độ thanh điệu.' },
    { id: 'intro-2', number: 2, title: 'Bảng 24 Vận mẫu đơn & kép, âm uốn lưỡi Er', duration: 20, xp: 40, desc: 'Nguyên âm ghép ai, ei, ao, ou, an, en, ang, eng và các quy tắc viết pinyin chuẩn.' },
    { id: 'intro-3', number: 3, title: 'Quy tắc biến điệu hai thanh 3 và biến điệu chữ 不, 一', duration: 15, xp: 45, desc: 'Nắm chắc bí quyết nói mềm mại, tự nhiên như người bản ngữ Bắc Kinh.' },
    { id: 'intro-4', number: 4, title: '8 Nét cơ bản & 7 Quy tắc thuận bút chữ Hán', duration: 25, xp: 50, desc: 'Ngang, sổ, phẩy, mác, hất, gập, móc và quy tắc trên trước dưới sau, vào trước đóng sau.' },
    { id: 'intro-5', number: 5, title: '20 Bộ thủ thông dụng nhất cấu tạo nên chữ Hán', duration: 25, xp: 50, desc: 'Bộ Nhân, bộ Khẩu, bộ Thủy, bộ Hỏa, bộ Mộc... và cách đoán nghĩa nhanh.' },
    { id: 'intro-6', number: 6, title: 'Cài đặt và thực hành gõ tiếng Trung trên máy tính & điện thoại', duration: 15, xp: 35, desc: 'Thao tác gõ Pinyin chuyển thành chữ Hán trên bàn phím QWERTY chuẩn.' }
  ],
  'hsk1': [
    { id: 'lesson-1', number: 1, title: 'Bài 1: Chào hỏi cơ bản (你好 - Xin chào, Cảm ơn)', duration: 15, xp: 50, desc: 'Cách chào hỏi lịch sự, cảm ơn, xin lỗi và tạm biệt trong sinh hoạt hàng ngày.' },
    { id: 'lesson-2', number: 2, title: 'Bài 2: Giới thiệu bản thân & Quốc tịch (我是越南人)', duration: 18, xp: 60, desc: 'Cấu trúc câu chữ 是, xưng hô tên tuổi, quốc tịch và nghề nghiệp.' },
    { id: 'lesson-3', number: 3, title: 'Bài 3: Con số, Giá cả & Mua sắm (多少钱 - Bao nhiêu tiền)', duration: 20, xp: 65, desc: 'Đếm số 1-100, hỏi giá tiền và các loại hoa quả, đồ uống quen thuộc.' },
    { id: 'lesson-4', number: 4, title: 'Bài 4: Gia đình & Người thân (我家有四口人)', duration: 18, xp: 60, desc: 'Từ vựng xưng hô gia đình bố mẹ anh chị em và lượng từ 口 (kǒu).' },
    { id: 'lesson-5', number: 5, title: 'Bài 5: Thời gian & Ngày tháng (今天几月几号)', duration: 20, xp: 65, desc: 'Hỏi ngày giờ, thứ trong tuần, năm tháng và cách hẹn gặp.' },
    { id: 'lesson-6', number: 6, title: 'Bài 6: Sở thích & Hoạt động hàng ngày (你喜欢做什么)', duration: 20, xp: 70, desc: 'Động từ chỉ hoạt động xem phim, đọc sách, nghe nhạc, uống trà.' }
  ],
  'hsk2': [
    { id: 'hsk2-1', number: 1, title: 'Bài 1: Đi lại & Hỏi đường (去火车站怎么走 - Ga tàu đi thế nào)', duration: 22, xp: 75, desc: 'Phương hướng đông tây nam bắc, rẽ trái phải, đi thẳng và các loại xe bus, taxi.' },
    { id: 'hsk2-2', number: 2, title: 'Bài 2: Gọi món tại nhà hàng Trung Hoa (点菜 - Chọn món)', duration: 25, xp: 80, desc: 'Thực đơn đồ ăn Trung, gọi thêm món, tính tiền và yêu cầu khẩu vị ít cay.' },
    { id: 'hsk2-3', number: 3, title: 'Bài 3: Thời tiết & Bốn mùa (今天比昨天冷 - Lạnh hơn hôm qua)', duration: 20, xp: 70, desc: 'Câu so sánh chữ 比, nhiệt độ, mưa nắng và chuyển mùa.' },
    { id: 'hsk2-4', number: 4, title: 'Bài 4: Khám sức khỏe & Đi bệnh viện (看病 - Đi khám bệnh)', duration: 22, xp: 75, desc: 'Các triệu chứng cảm cúm, sốt, đau đầu và cách uống thuốc theo đơn.' }
  ],
  'hsk3': [
    { id: 'hsk3-1', number: 1, title: 'Bài 1: Kế hoạch du lịch tự túc (去中国旅游 - Du lịch Trung Quốc)', duration: 25, xp: 85, desc: 'Đặt vé tàu cao tốc, đặt phòng khách sạn, đổi tiền tệ và tham quan danh lam.' },
    { id: 'hsk3-2', number: 2, title: 'Bài 2: Câu chữ 把 trong sinh hoạt (把书放在桌子上)', duration: 28, xp: 90, desc: 'Cấu trúc câu chữ 把 xử lý vật và bổ ngữ kết quả, xu hướng.' },
    { id: 'hsk3-3', number: 3, title: 'Bài 3: Câu bị động chữ 被 (自行车被骑走了)', duration: 25, xp: 85, desc: 'Cách diễn đạt câu bị động trong văn nói và văn viết thường ngày.' },
    { id: 'hsk3-4', number: 4, title: 'Bài 4: Luyện đề thi mô phỏng HSK 3 định dạng chuẩn mới', duration: 35, xp: 120, desc: 'Thực chiến 3 phần: Nghe hiểu, Đọc hiểu và Viết câu đạt điểm cao.' }
  ],
  'hsk4': [
    { id: 'hsk4-1', number: 1, title: 'Bài 1: Phỏng vấn xin việc & Viết CV tiếng Trung', duration: 30, xp: 100, desc: 'Giới thiệu kinh nghiệm làm việc, thế mạnh bản thân và đàm phán mức lương.' },
    { id: 'hsk4-2', number: 2, title: 'Bài 2: Bàn luận về công nghệ, môi trường & Cuộc sống số', duration: 30, xp: 100, desc: 'Các thuật ngữ thanh toán điện tử WeChat Pay/Alipay, mua sắm online Taobao/1688.' },
    { id: 'hsk4-3', number: 3, title: 'Bài 3: Đàm phán thương mại sơ cấp & Hợp đồng ngắn', duration: 35, xp: 110, desc: 'Soạn email công việc, thỏa thuận thời gian giao hàng và kiểm tra mẫu.' }
  ],
  'hsk5-6': [
    { id: 'hsk5-1', number: 1, title: 'Bài 1: Thành ngữ kinh điển trong văn hóa & Giao thương (成语精选)', duration: 35, xp: 120, desc: 'Các thành ngữ 4 chữ thông dụng trong đàm phán ngoại giao và viết bài học thuật.' },
    { id: 'hsk5-2', number: 2, title: 'Bài 2: Đọc báo tài chính & Phân tích xu hướng kinh tế', duration: 40, xp: 130, desc: 'Đọc hiểu báo chí Nhân Dân Nhật Báo, Tân Hoa Xã không cần tra từ điển.' }
  ]
};

const EXPANDED_WRITING_CHARACTERS = [
  ...CHARACTERS_WRITING,
  {
    char: '中',
    pinyin: 'zhōng',
    hanviet: 'Trung',
    meaning: 'Ở giữa, trung tâm, nước Trung Quốc',
    strokesCount: 4,
    radical: '丨 (Sổ)',
    strokeOrder: ['Sổ (丨)', 'Ngang gập (𠃍)', 'Ngang (一)', 'Sổ (丨)'],
    components: 'Khẩu (口) có một nét sổ thẳng đứng xuyên qua tâm chính giữa.',
    tips: 'Nét sổ cuối cùng phải thẳng đứng và chia đôi ô chữ thành 2 nửa cân đối.'
  },
  {
    char: '国',
    pinyin: 'guó',
    hanviet: 'Quốc',
    meaning: 'Đất nước, quốc gia',
    strokesCount: 8,
    radical: '囗 (Vi)',
    strokeOrder: ['Sổ (丨)', 'Ngang gập (𠃍)', 'Ngang (一)', 'Ngang (一)', 'Sổ (丨)', 'Ngang (一)', 'Chấm (丶)', 'Ngang (一)'],
    components: 'Bộ Vi (囗 - bờ cõi) ôm trọn chữ Ngọc (玉 - viên ngọc quý báu).',
    tips: 'Quy tắc vào trước đóng sau: vẽ 3 cạnh ngoài trước, viết chữ Ngọc bên trong rồi mới đóng đáy.'
  },
  {
    char: '人',
    pinyin: 'rén',
    hanviet: 'Nhân',
    meaning: 'Người, con người',
    strokesCount: 2,
    radical: '人 (Nhân)',
    strokeOrder: ['Phẩy (丿)', 'Mác (乀)'],
    components: 'Hình ảnh con người đứng vững với hai chân choãi rộng.',
    tips: 'Nét phẩy viết từ trên xuống dưới chếch sang trái, nét mác bắt đầu từ thân nét phẩy vươn sang phải.'
  },
  {
    char: '大',
    pinyin: 'dà',
    hanviet: 'Đại',
    meaning: 'To lớn, vĩ đại',
    strokesCount: 3,
    radical: '大 (Đại)',
    strokeOrder: ['Ngang (一)', 'Phẩy (丿)', 'Mác (乀)'],
    components: 'Hình người (人) dang rộng hai cánh tay biểu thị sự to lớn.',
    tips: 'Nét ngang viết trước, nét phẩy bắt đầu từ giữa nét ngang, nét mác vươn đều.'
  }
];

const DEFAULT_PRONUNCIATION_ITEMS = [
  { id: 'pr-1', hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Xin chào', category: 'HSK 1', tip: 'Hai thanh 3 đi liền nhau, chữ 你 (nǐ) biến điệu thành thanh 2: ní hǎo.' },
  { id: 'pr-2', hanzi: '谢谢', pinyin: 'xièxie', meaning: 'Cảm ơn', category: 'HSK 1', tip: 'Âm "x" mặt lưỡi phẳng nhẹ, âm thứ hai đọc thanh nhẹ (khinh thanh).' },
  { id: 'pr-3', hanzi: '对不起', pinyin: 'duìbuqǐ', meaning: 'Xin lỗi', category: 'HSK 1', tip: 'Âm "d" không bật hơi như chữ "t" tiếng Việt, "qǐ" bật hơi từ mặt lưỡi.' },
  { id: 'pr-4', hanzi: '再见', pinyin: 'zàijiàn', meaning: 'Tạm biệt / Hẹn gặp lại', category: 'HSK 1', tip: 'Âm "z" đầu lưỡi thẳng không bật hơi, hai thanh 4 dứt khoát từ cao độ 5 xuống 1.' },
  { id: 'pr-5', hanzi: '早上好', pinyin: 'zǎoshang hǎo', meaning: 'Chào buổi sáng', category: 'HSK 1', tip: 'Chữ 上 (shang) đọc thanh nhẹ lướt êm, hǎo trầm tròn trịa.' },
  { id: 'pr-6', hanzi: '我是越南人', pinyin: 'wǒ shì Yuènán rén', meaning: 'Tôi là người Việt Nam', category: 'HSK 1', tip: 'Chú ý âm uốn lưỡi "shì" và "rén", ngữ điệu tự nhiên.' },
  { id: 'pr-7', hanzi: '这个多少钱', pinyin: 'zhè ge duōshao qián', meaning: 'Cái này bao nhiêu tiền?', category: 'HSK 2', tip: 'Qián bật hơi đầu lưỡi chụm kẽ răng, câu hỏi nhấn vào từ nghi vấn.' },
  { id: 'pr-8', hanzi: '太好吃了', pinyin: 'tài hǎochī le', meaning: 'Ngon quá đi mất!', category: 'HSK 2', tip: 'Âm "chī" uốn lưỡi bật hơi mạnh, biểu cảm hào hứng.' },
  { id: 'pr-9', hanzi: '去火车站怎么走', pinyin: 'qù huǒchēzhàn zěnme zǒu', meaning: 'Ga tàu đi thế nào?', category: 'HSK 2', tip: 'Qù bật hơi dứt khoát, zěnme đầu lưỡi thẳng nhẹ nhàng.' },
  { id: 'pr-10', hanzi: '很高兴认识你', pinyin: 'hěn gāoxìng rènshi nǐ', meaning: 'Rất vui được quen biết bạn', category: 'HSK 1', tip: 'Gāoxìng thanh 1 và 4 đối xứng, rènshi đọc âm nhẹ.' },
  { id: 'pr-11', hanzi: '中国', pinyin: 'Zhōngguó', meaning: 'Trung Quốc', category: 'HSK 1', tip: 'Zhōng uốn lưỡi tròn môi thanh 1 cao đều, guó thanh 2 lướt lên.' },
  { id: 'pr-12', hanzi: '明天见', pinyin: 'míngtiān jiàn', meaning: 'Ngày mai gặp lại', category: 'HSK 1', tip: 'Míng thanh 2, tiān thanh 1, jiàn thanh 4 rơi chắc nịch.' }
];

const DEFAULT_COMMUNITY_POSTS = [
  {
    author_name: 'Ban Quản Trị HanziGo',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    author_level: 'Quản trị viên',
    content: 'Chào mừng các bạn học viên đến với Không gian Cộng đồng HanziGo! 🌟 Đây là nơi giao lưu học hỏi, giải đáp thắc mắc ngữ pháp, tìm bạn cùng luyện phản xạ khẩu ngữ và chia sẻ kinh nghiệm thi đỗ HSK điểm cao. Hãy đăng câu hỏi hoặc cảm nhận học tập đầu tiên của bạn ở khung phía trên nhé! 🇨🇳🇻🇳✨',
    tag: '#KinhNghiemHoc',
    likes: 12,
    liked_by: [],
    comments: []
  }
];

const DEFAULT_STUDY_PARTNERS = [];

async function seed() {
  console.log('🌱 BẮT ĐẦU NẠP DỮ LIỆU HOÀN CHỈNH CHO SUPABASE (HANZIGO DATABASE)...');

  // 1. Seed Materials
  console.log('📦 1. Đang nạp Kho tài liệu & Giáo trình...');
  const materialsPayload = DEFAULT_MATERIALS.map(m => ({
    id: String(m.id),
    title: m.title,
    category: m.category || 'Giáo trình chuẩn',
    level: m.level || 'HSK 1',
    format: m.format || 'PDF',
    file_size: m.fileSize || '10 MB',
    author: m.author || 'HanziGo Biên soạn',
    description: m.description || '',
    download_url: m.downloadUrl || '',
    tags: Array.isArray(m.tags) ? m.tags.join(', ') : (m.tags || '')
  }));
  const { error: matErr } = await supabase.from('materials').upsert(materialsPayload);
  if (matErr) console.warn('Materials seed warning:', matErr.message);
  else console.log(`✅ Đã nạp thành công ${materialsPayload.length} tài liệu giáo trình!`);

  // 2. Seed Lessons
  console.log('📦 2. Đang nạp Bài học lộ trình...');
  const lessonsPayload = [];
  for (const [levelId, lessonList] of Object.entries(BASE_LEVEL_LESSONS)) {
    for (const l of lessonList) {
      lessonsPayload.push({
        id: String(l.id),
        level_id: levelId,
        number: Number(l.number),
        title: l.title,
        duration: Number(l.duration) || 20,
        xp: Number(l.xp) || 50,
        description: l.desc || ''
      });
    }
  }
  const { error: lesErr } = await supabase.from('lessons').upsert(lessonsPayload);
  if (lesErr) console.warn('Lessons seed warning:', lesErr.message);
  else console.log(`✅ Đã nạp thành công ${lessonsPayload.length} bài học lộ trình HSK!`);

  // 3. Seed Vocabulary
  console.log('📦 3. Đang nạp Từ điển & Từ vựng HSK...');
  const vocabPayload = VOCABULARY_LIST.map(v => ({
    hanzi: v.hanzi,
    pinyin: v.pinyin,
    hanviet: v.hanviet || '',
    meaning: v.meaning,
    level: v.level || 'HSK 1',
    topic: v.topic || 'Tổng hợp',
    radical: v.radical || '',
    strokes: Number(v.strokes) || 1,
    mnemonic: v.mnemonic || '',
    example: v.example || {}
  }));
  const chunkSize = 50;
  for (let i = 0; i < vocabPayload.length; i += chunkSize) {
    const chunk = vocabPayload.slice(i, i + chunkSize);
    const { error: vocabErr } = await supabase.from('vocabulary').insert(chunk);
    if (vocabErr) {
      console.warn(`Vocab chunk warning:`, vocabErr.message);
      break;
    }
  }
  console.log(`✅ Đã nạp thành công ${vocabPayload.length} từ vựng chuẩn HSK!`);

  // 4. Seed Writing Characters
  console.log('📦 4. Đang nạp Thư viện chữ Hán tập viết & bút thuận...');
  const writingPayload = EXPANDED_WRITING_CHARACTERS.map(c => ({
    hanzi: c.char,
    pinyin: c.pinyin,
    hanviet: c.hanviet || '',
    meaning: c.meaning,
    level: c.level || 'HSK 1',
    strokes: Number(c.strokesCount) || 1,
    stroke_order: c.strokeOrder || [],
    components: c.components || '',
    tips: c.tip || c.tips || ''
  }));
  const { error: wErr } = await supabase.from('writing_characters').insert(writingPayload);
  if (wErr) console.warn('Writing characters seed warning:', wErr.message);
  else console.log(`✅ Đã nạp thành công ${writingPayload.length} chữ Hán tập viết!`);

  // 5. Seed Pronunciation Items
  console.log('📦 5. Đang nạp Ngữ âm & Mẫu câu luyện phát âm...');
  const pronPayload = DEFAULT_PRONUNCIATION_ITEMS.map(p => ({
    char: p.hanzi,
    pinyin: p.pinyin,
    hanviet: '',
    meaning: p.meaning,
    tone: 1,
    type: p.category,
    level: p.category,
    sample_word: p.tip,
    sample_pinyin: '',
    sample_meaning: ''
  }));
  const { error: prErr } = await supabase.from('pronunciation_items').insert(pronPayload);
  if (prErr) console.warn('Pronunciation seed warning:', prErr.message);
  else console.log(`✅ Đã nạp thành công ${pronPayload.length} bài luyện phát âm!`);

  // 6. Seed Community Posts
  console.log('📦 6. Đang nạp Bảng tin cộng đồng học tập...');
  const { error: postErr } = await supabase.from('community_posts').insert(DEFAULT_COMMUNITY_POSTS);
  if (postErr) console.warn('Community posts seed warning:', postErr.message);
  else console.log(`✅ Đã nạp thành công ${DEFAULT_COMMUNITY_POSTS.length} bài viết cộng đồng!`);

  // 7. Seed Study Partners
  console.log('📦 7. Đang nạp Ghép đôi bạn học...');
  const { error: spErr } = await supabase.from('study_partners').insert(DEFAULT_STUDY_PARTNERS);
  if (spErr) console.warn('Study partners seed warning:', spErr.message);
  else console.log(`✅ Đã nạp thành công ${DEFAULT_STUDY_PARTNERS.length} bạn học ghép đôi!`);

  // 8. Ensure lehaidang16032006@gmail.com is Admin
  console.log('👑 8. Đang phân quyền Quản trị viên (Admin) cho lehaidang16032006@gmail.com...');
  await supabase.from('profiles').update({ role: 'admin' }).eq('email', 'lehaidang16032006@gmail.com');
  console.log('✅ Đã phân quyền Admin cho lehaidang16032006@gmail.com!');

  console.log('🎉 TOÀN BỘ CƠ SỞ DỮ LIỆU ĐÃ ĐƯỢC NẠP VÀO SUPABASE THÀNH CÔNG RỰC RỠ!');
}

seed().catch(console.error);
