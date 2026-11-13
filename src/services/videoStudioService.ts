import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { recordLearningEvent } from './learningDataService.ts';
import { tokenizeChineseText, type ReadingToken } from '../utils/chineseTokenizer.ts';
import { saveWordToDeck, type DictionaryEntry } from './dictionaryService.ts';

export type VideoSourceType = 'youtube' | 'mp4_storage';
export type VideoSpeechSpeed = 'slow' | 'normal' | 'fast';

export interface SubtitleCueToken extends ReadingToken {
  meaning_vi?: string;
}

export interface SubtitleCue {
  cue_index: number;
  start_ms: number;
  end_ms: number;
  zh_raw: string;
  pinyin_full: string;
  vi_translation: string;
  grammar_notes?: string[];
  tokens: SubtitleCueToken[];
}

export interface ImmersionVideo {
  id: string;
  source_type: VideoSourceType;
  external_video_id: string;
  title_zh: string;
  title_vi: string;
  channel_name: string;
  thumbnail_url: string;
  duration_seconds: number;
  hsk_level: number;
  topic_tags: string[];
  speech_speed: VideoSpeechSpeed;
  subtitles: SubtitleCue[];
}

export interface UserVideoProgress {
  last_position_ms: number;
  saved_cues_indices: number[];
  shadowed_cues_indices: number[];
  completed: boolean;
  updated_at: string;
}

const STORAGE_VIDEO_PROGRESS_PREFIX = 'hanzigo_video_progress_';

function buildSubtitleCue(
  cue_index: number,
  start_ms: number,
  end_ms: number,
  zh_raw: string,
  pinyin_full: string,
  vi_translation: string,
  grammar_notes: string[] = []
): SubtitleCue {
  const tokens = tokenizeChineseText(zh_raw).map((t) => ({
    ...t,
    meaning_vi: t.meaning_vi || '',
  }));

  return {
    cue_index,
    start_ms,
    end_ms,
    zh_raw,
    pinyin_full,
    vi_translation,
    grammar_notes,
    tokens,
  };
}

const BUILT_IN_VIDEOS: ImmersionVideo[] = [
  {
    id: 'vid-tea-culture-01',
    source_type: 'youtube',
    external_video_id: 'ysz5S6PUM-U', // Safe fallback educational clip
    title_zh: '中国茶文化初体验',
    title_vi: 'Trải nghiệm đầu tiên về văn hóa trà Trung Hoa',
    channel_name: 'HanziGo Chinese Immersion',
    thumbnail_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    duration_seconds: 45,
    hsk_level: 3,
    topic_tags: ['Văn hóa', 'Đời sống', 'Ẩm thực'],
    speech_speed: 'normal',
    subtitles: [
      buildSubtitleCue(
        0,
        0,
        4500,
        '欢迎来到今天的中国茶文化体验馆。',
        'Huānyíng lái dào jīntiān de Zhōngguó chá wénhuà tǐyànguǎn.',
        'Chào mừng các bạn đến với bảo tàng trải nghiệm văn hóa trà Trung Hoa hôm nay.',
        ['Cấu trúc 欢迎来到...: Hoan nghênh/Chào mừng đến...']
      ),
      buildSubtitleCue(
        1,
        4500,
        11200,
        '在中国，喝茶不仅是一种习惯，更是一种生活艺术。',
        'Zài Zhōngguó, hē chá bùjǐn shì yì zhǒng xíguàn, gèng shì yì zhǒng shēnghuó yìshù.',
        'Ở Trung Quốc, uống trà không chỉ là một thói quen, mà còn là một nghệ thuật sống.',
        ['不仅…更…: Không những… mà còn… (tăng tiến)']
      ),
      buildSubtitleCue(
        2,
        11200,
        18500,
        '泡茶的时候，水温和时间都非常讲究。',
        'Pào chá de shíhou, shuǐwēn hé shíjiān dōu fēicháng jiǎngjiu.',
        'Khi pha trà, nhiệt độ nước và thời gian đều vô cùng tinh tế và kỹ lưỡng.',
        ['讲究: Cầu kỳ, tỉ mỉ, có yêu cầu cao']
      ),
      buildSubtitleCue(
        3,
        18500,
        27000,
        '绿茶适合用八十五度的温水，而红茶可以用开水。',
        'Lǜchá shìhé yòng bāshíwǔ dù de wēnshuǐ, ér hóngchá kěyǐ yòng kāishuǐ.',
        'Trà xanh thích hợp dùng nước ấm 85 độ, trong khi hồng trà có thể dùng nước sôi.',
        ['适合: Thích hợp; 而: Biểu thị liên kết đối lập']
      ),
      buildSubtitleCue(
        4,
        27000,
        36000,
        '慢慢品尝一口，你会感受到淡淡的茶香和清甜。',
        'Mànmàn pǐncháng yì kǒu, nǐ huì gǎnshòudào dàndàn de cháxiāng hé qīngtián.',
        'Chậm rãi nhấp một ngụm, bạn sẽ cảm nhận được hương trà thoang thoảng và vị ngọt thanh.',
        ['慢慢: Lặp tính từ biểu thị mức độ nhẹ nhàng, từ tốn']
      ),
      buildSubtitleCue(
        5,
        36000,
        45000,
        '希望大家也能在忙碌的生活中享受一杯好茶。',
        'Xīwàng dàjiā yě néng zài mánglù de shēnghuó zhōng xiǎngshòu yì bēi hǎo chá.',
        'Hy vọng mọi người cũng có thể tận hưởng một tách trà ngon giữa cuộc sống bận rộn.',
        ['在…中: Trong bối cảnh/quá trình']
      ),
    ],
  },
  {
    id: 'vid-beijing-subway-02',
    source_type: 'youtube',
    external_video_id: 'jNQXAC9IVRw',
    title_zh: '在北京坐地铁出行',
    title_vi: 'Đi tàu điện ngầm tại Bắc Kinh',
    channel_name: 'Beijing Life Guide',
    thumbnail_url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
    duration_seconds: 32,
    hsk_level: 2,
    topic_tags: ['Giao thông', 'Bắc Kinh', 'Du lịch'],
    speech_speed: 'slow',
    subtitles: [
      buildSubtitleCue(
        0,
        0,
        6000,
        '在北京，坐地铁是最方便快捷的出行方式。',
        'Zài Běijīng, zuò dìtiě shì zuì fāngbiàn kuàijié de chūxíng fāngshì.',
        'Ở Bắc Kinh, đi tàu điện ngầm là phương thức di chuyển thuận tiện và nhanh chóng nhất.'
      ),
      buildSubtitleCue(
        1,
        6000,
        14000,
        '进站以前，请先准备好乘车码或者交通卡。',
        'Jìn zhàn yǐqián, qǐng xiān zhǔnbèi hǎo chéngchēmǎ huòzhě jiāotōng kǎ.',
        'Trước khi vào ga, vui lòng chuẩn bị sẵn mã đi xe hoặc thẻ giao thông.'
      ),
      buildSubtitleCue(
        2,
        14000,
        22500,
        '高峰期人很多，大家一定要注意随身物品的安全。',
        'Gāofēngqī rén hěn duō, dàjiā yídìng yào zhùyì suíshēn wùpǐn de ānquán.',
        'Giờ cao điểm rất đông người, mọi người nhất định phải chú ý an toàn tư trang.'
      ),
      buildSubtitleCue(
        3,
        22500,
        32000,
        '下一站就是天安门东，请从右侧车门下车。',
        'Xià yí zhàn jiù shì Tiān\'ānmén Dōng, qǐng cóng yòucè chēmén xià chē.',
        'Ga kế tiếp là Đông Thiên An Môn, vui lòng xuống xe từ cửa bên phải.'
      ),
    ],
  },
  {
    id: 'vid-hsk2-street-food-03',
    source_type: 'youtube',
    external_video_id: 'ysz5S6PUM-U',
    title_zh: '成都街头小吃探店',
    title_vi: 'Khám phá ẩm thực đường phố Thành Đô',
    channel_name: 'HanziGo Travel & Food',
    thumbnail_url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80',
    duration_seconds: 34,
    hsk_level: 2,
    topic_tags: ['Ẩm thực', 'Du lịch', 'Giao tiếp'],
    speech_speed: 'slow',
    subtitles: [
      buildSubtitleCue(
        0,
        0,
        7500,
        '老板，我要一碗担担面，少放一点儿辣。',
        'Lǎobǎn, wǒ yào yì wǎn Dàndànmiàn, shǎo fàng yìdiǎnr là.',
        'Ông chủ ơi, cho tôi một bát mì Đản Đản, bỏ ít cay một chút nhé.',
        ['一碗...: Một bát...', '少放一点儿...: Bỏ ít một chút...']
      ),
      buildSubtitleCue(
        1,
        7500,
        16000,
        '没问题！我们的面都是现做的，味道特别香。',
        'Méi wèntí! Wǒmen de miàn dōu shì xiàn zuò de, wèidào tèbié xiāng.',
        'Không thành vấn đề! Mì của quán tôi đều làm tươi tại chỗ, hương vị cực kỳ thơm ngon.',
        ['现做的: Làm tươi tại chỗ ngay lúc gọi']
      ),
      buildSubtitleCue(
        2,
        16000,
        25000,
        '请问你们这里可以扫码付款吗？',
        'Qǐngwèn nǐmen zhèlǐ kěyǐ sǎomǎ fùkuǎn ma?',
        'Xin hỏi ở đây có thể quét mã thanh toán được không?',
        ['扫码付款: Quét mã QR thanh toán']
      ),
      buildSubtitleCue(
        3,
        25000,
        34000,
        '可以，支付宝和微信都支持，一共十八块钱。',
        'Kěyǐ, Zhīfùbǎo hé Wēixìn dōu zhīchí, yígòng shíbā kuài qián.',
        'Được ạ, Alipay và WeChat đều hỗ trợ, tổng cộng 18 tệ.',
        ['一共...: Tổng cộng...']
      ),
    ],
  },
  {
    id: 'vid-hsk4-tech-interview-04',
    source_type: 'youtube',
    external_video_id: 'ysz5S6PUM-U',
    title_zh: '中文技术面试实战',
    title_vi: 'Phỏng vấn xin việc ngành Công nghệ bằng tiếng Trung',
    channel_name: 'HanziGo Career Lab',
    thumbnail_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    duration_seconds: 36,
    hsk_level: 4,
    topic_tags: ['Công sở', 'Phỏng vấn', 'CNTT'],
    speech_speed: 'normal',
    subtitles: [
      buildSubtitleCue(
        0,
        0,
        8500,
        '请简单介绍一下你在上一家公司负责的核心项目。',
        'Qǐng jiǎndān jièshào yíxià nǐ zài shàng yì jiā gōngsī fùzé de héxīn xiàngmù.',
        'Bạn hãy giới thiệu ngắn gọn về dự án cốt lõi mà bạn phụ trách ở công ty trước.',
        ['负责: Phụ trách, đảm nhiệm']
      ),
      buildSubtitleCue(
        1,
        8500,
        18000,
        '我主要负责后端接口开发，同时协助团队优化数据库查询速度。',
        'Wǒ zhǔyào fùzé hòuduān jiēkǒu kāifā, tóngshí xiézhù tuánduì yōuhuà shùjùkù cháxún sùdù.',
        'Tôi chủ yếu phụ trách phát triển API backend, đồng thời hỗ trợ nhóm tối ưu tốc độ truy vấn cơ sở dữ liệu.',
        ['协助: Hỗ trợ, phối hợp']
      ),
      buildSubtitleCue(
        2,
        18000,
        27500,
        '在上线之前，我们都会通过自动化测试来保障系统稳定性。',
        'Zài shàngxiàn zhīqián, wǒmen dōu huì tōngguò zìdònghuà cèshì lái bǎozhàng xìtǒng wěndìngxìng.',
        'Trước khi đưa lên production, chúng tôi đều thông qua kiểm thử tự động để bảo đảm độ ổn định hệ thống.',
        ['通过...来...: Thông qua... để...']
      ),
      buildSubtitleCue(
        3,
        27500,
        36000,
        '非常棒！请问你最快什么时候可以入职？',
        'Fēicháng bàng! Qǐngwèn nǐ zuì kuài shénme shíhou kěyǐ rùzhí?',
        'Tuyệt lắm! Xin hỏi sớm nhất khi nào bạn có thể nhận việc?',
        ['入职: Nhập chức, bắt đầu đi làm']
      ),
    ],
  },
  {
    id: 'vid-hsk5-chengyu-story-05',
    source_type: 'youtube',
    external_video_id: 'ysz5S6PUM-U',
    title_zh: '成语故事：画蛇添足',
    title_vi: 'Kể chuyện Thành ngữ: Vẽ rắn thêm chân (画蛇添足)',
    channel_name: 'HanziGo Culture Studio',
    thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    duration_seconds: 34,
    hsk_level: 5,
    topic_tags: ['Thành ngữ', 'Văn học', 'HSK 5'],
    speech_speed: 'normal',
    subtitles: [
      buildSubtitleCue(
        0,
        0,
        8000,
        '古代有个故事，几个人比赛画蛇，谁先画完就能喝一壶美酒。',
        'Gǔdài yǒu gè gùshi, jǐ gè rén bǐsài huà shé, shuí xiān huà wán jiù néng hē yì hú měijiǔ.',
        'Thời xưa có câu chuyện, mấy người thi vẽ rắn, ai vẽ xong trước sẽ được uống một bình rượu ngon.',
        ['谁先...就...: Ai ... trước thì...']
      ),
      buildSubtitleCue(
        1,
        8000,
        17500,
        '其中一个人画得很快，见别人还没画完，便得意地给蛇添上了几只脚。',
        'Qízhōng yí gè rén huà de hěn kuài, jiàn biérén hái méi huà wán, biàn déyì de gěi shé tiānshàng le jǐ zhī jiǎo.',
        'Một người trong số đó vẽ rất nhanh, thấy người khác chưa vẽ xong liền đắc ý vẽ thêm cho con rắn mấy cái chân.',
        ['得意地...: Một cách đắc ý...']
      ),
      buildSubtitleCue(
        2,
        17500,
        26000,
        '结果旁边的人抢过酒壶说：“蛇本来就没有脚，你画的不是蛇！”',
        'Jiéguǒ pángbiān de rén qiǎng guò jiǔhú shuō: "Shé běnlái jiù méiyǒu jiǎo, nǐ huà de bú shì shé!"',
        'Kết quả người bên cạnh giật lấy bình rượu nói: "Rắn vốn dĩ không có chân, thứ anh vẽ đâu phải rắn!"',
        ['本来就...: Vốn dĩ đã...']
      ),
      buildSubtitleCue(
        3,
        26000,
        34000,
        '这个成语告诉我们，做多余的事反而会把事情办坏。',
        'Zhège chéngyǔ gàosu wǒmen, zuò duōyú de shì fǎnér huì bǎ shìqing bàn huài.',
        'Thành ngữ này nhắc nhở chúng ta rằng làm việc thừa thãi trái lại sẽ làm hỏng việc.',
        ['反而: Trái lại, ngược lại']
      ),
    ],
  },
  {
    id: 'vid-hsk6-classical-gardens-06',
    source_type: 'youtube',
    external_video_id: 'ysz5S6PUM-U',
    title_zh: '苏州古典园林的造景美学',
    title_vi: 'Mỹ học tạo cảnh trong Hoa viên cổ điển Tô Châu',
    channel_name: 'HanziGo Masterclass',
    thumbnail_url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=800&q=80',
    duration_seconds: 38,
    hsk_level: 6,
    topic_tags: ['Kiến trúc', 'Nghệ thuật', 'HSK 6'],
    speech_speed: 'fast',
    subtitles: [
      buildSubtitleCue(
        0,
        0,
        9500,
        '苏州园林之所以闻名于世，在于其将自然山水浓缩于方寸之间的造园智慧。',
        'Sūzhōu yuánlín zhī suǒyǐ wénmíng yú shì, zàiyú qí jiāng zìrán shānshuǐ nóngsuō yú fāngcùn zhī jiān de zàoyuán zhìhuì.',
        'Hoa viên Tô Châu sở dĩ nổi tiếng thế giới nằm ở trí tuệ kiến tạo vườn tược thu gọn non nước tự nhiên vào trong không gian tấc đất.',
        ['之所以...在于...: Sở dĩ... nằm ở...']
      ),
      buildSubtitleCue(
        1,
        9500,
        19500,
        '工匠们巧妙运用借景与框景的手法，使园内景致与远方山色融为一体。',
        'Gōngjiàngmen qiǎomiào yùnyòng jièjǐng yǔ kuàngjǐng de shǒufǎ, shǐ yuán nèi jǐngzhì yǔ yuǎnfāng shānsè róng wéi yìtǐ.',
        'Các nghệ nhân khéo léo vận dụng thủ pháp "mượn cảnh" và "đóng khung cảnh", khiến cảnh sắc trong vườn hòa làm một với non xa.',
        ['融为一体: Hòa quyện làm một thể']
      ),
      buildSubtitleCue(
        2,
        19500,
        29000,
        '漫步其中，每转过一道回廊，眼前的构图便随之变化，可谓步移景异。',
        'Mànbù qízhōng, měi zhuǎnguò yí dào huíláng, yǎnqián de gòutú biàn suízhī biànhuà, kěwèi bùyí-jǐngyì.',
        'Dạo bước bên trong, mỗi lần rẽ qua một dãy hành lang, bố cục trước mắt lại đổi thay theo từng bước chân.',
        ['可谓: Có thể gọi là / Đúng là']
      ),
      buildSubtitleCue(
        3,
        29000,
        38000,
        '这不仅体现了天人合一的哲学观，更是东方审美情趣的集中展现。',
        'Zhè bùjǐn tǐxiàn le tiān-rén héyī de zhéxuéguān, gèng shì dōngfāng shěnměi qíngqù de jízhōng zhǎnxiàn.',
        'Điều này không chỉ thể hiện triết lý Thiên Nhân Hợp Nhất, mà còn là sự kết tinh của gu thẩm mỹ phương Đông.',
        ['天人合一: Thiên nhân hợp nhất']
      ),
    ],
  },
  {
    id: 'vid-hsk1-daily-intro-07',
    source_type: 'youtube',
    external_video_id: 'ysz5S6PUM-U',
    title_zh: '你好！初次见面自我介绍',
    title_vi: 'Xin chào! Tự giới thiệu bản thân lần đầu gặp mặt',
    channel_name: 'HanziGo Starter Lab',
    thumbnail_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    duration_seconds: 26,
    hsk_level: 1,
    topic_tags: ['Giao tiếp', 'Nhập môn', 'Làm quen'],
    speech_speed: 'slow',
    subtitles: [
      buildSubtitleCue(
        0,
        0,
        6500,
        '你好！我叫小明，我是越南人。',
        'Nǐ hǎo! Wǒ jiào Xiǎomíng, wǒ shì Yuènán rén.',
        'Xin chào! Tôi tên là Tiểu Minh, tôi là người Việt Nam.',
        ['叫: Tên là / Gọi là']
      ),
      buildSubtitleCue(
        1,
        6500,
        13000,
        '我今年二十岁，我在学习汉语。',
        'Wǒ jīnnián èrshí suì, wǒ zài xuéxí Hànyǔ.',
        'Năm nay tôi 20 tuổi, tôi đang học tiếng Trung.',
        ['在 + Động từ: Đang làm gì']
      ),
      buildSubtitleCue(
        2,
        13000,
        19500,
        '我喜欢喝茶，也喜欢看中国电影。',
        'Wǒ xǐhuan hē chá, yě xǐhuan kàn Zhōngguó diànyǐng.',
        'Tôi thích uống trà, cũng thích xem phim Trung Quốc.',
        ['也: Cũng (đặt trước động từ)']
      ),
      buildSubtitleCue(
        3,
        19500,
        26000,
        '认识你很高兴，请多指教！',
        'Rènshi nǐ hěn gāoxìng, qǐng duō zhǐjiào!',
        'Rất vui được làm quen với bạn, mong được chỉ giáo nhiều hơn!'
      ),
    ],
  },
];

export function getBuiltInVideos(): ImmersionVideo[] {
  return BUILT_IN_VIDEOS;
}

export async function listImmersionVideos(): Promise<ImmersionVideo[]> {
  if (!isSupabaseConfigured || !supabase) {
    return BUILT_IN_VIDEOS;
  }

  try {
    const { data, error } = await supabase
      .from('immersion_videos')
      .select('*')
      .order('hsk_level', { ascending: true });

    if (error || !Array.isArray(data) || data.length === 0) {
      return BUILT_IN_VIDEOS;
    }

    return data.map((row) => ({
      id: String(row.id),
      source_type: (row.source_type as VideoSourceType) || 'youtube',
      external_video_id: String(row.external_video_id),
      title_zh: String(row.title_zh),
      title_vi: String(row.title_vi),
      channel_name: String(row.channel_name || ''),
      thumbnail_url: String(row.thumbnail_url || ''),
      duration_seconds: Number(row.duration_seconds || 60),
      hsk_level: Number(row.hsk_level || 3),
      topic_tags: Array.isArray(row.topic_tags) ? (row.topic_tags as string[]) : [],
      speech_speed: (row.speech_speed as VideoSpeechSpeed) || 'normal',
      subtitles: Array.isArray(row.subtitles) ? (row.subtitles as SubtitleCue[]) : [],
    }));
  } catch {
    return BUILT_IN_VIDEOS;
  }
}

/**
 * Binary Search on subtitles by current time in milliseconds: O(log n).
 */
export function findActiveSubtitleCueIndex(
  subtitles: SubtitleCue[],
  currentTimeMs: number
): number {
  if (subtitles.length === 0) return -1;
  let low = 0;
  let high = subtitles.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const cue = subtitles[mid];

    if (currentTimeMs >= cue.start_ms && currentTimeMs < cue.end_ms) {
      return mid;
    }

    if (currentTimeMs < cue.start_ms) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  // Fallback: If in a gap between two cues, find nearest upcoming or active
  for (let i = 0; i < subtitles.length; i += 1) {
    if (currentTimeMs >= subtitles[i].start_ms && currentTimeMs < subtitles[i].end_ms) {
      return i;
    }
  }

  return -1;
}

/**
 * Mine a video subtitle sentence into the user's SRS Vocabulary Workspace.
 */
export async function mineVideoSentenceToSRS(params: {
  video: ImmersionVideo;
  cue: SubtitleCue;
  token: SubtitleCueToken;
  user?: { id?: string | null } | null;
}): Promise<void> {
  const { video, cue, token, user } = params;

  const entry: DictionaryEntry = {
    id: `vidsrs_${token.text}_${cue.start_ms}`,
    simplified: token.text,
    traditional: token.text,
    pinyin_display: token.pinyin || '',
    pinyin_numeric: token.pinyin || '',
    pinyin_clean: (token.pinyin || token.text).replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
    han_viet: token.han_viet || '',
    hsk_2_level: token.hsk_level && token.hsk_level <= 6 ? token.hsk_level : null,
    hsk_3_level: token.hsk_level || null,
    frequency_rank: 5000,
    pos_meanings: [
      {
        pos: 'n',
        definitions_vi: [token.meaning_vi || 'Từ vựng lưu từ phụ đề video'],
        definitions_en: [],
        collocations: [],
      },
    ],
    examples: [
      {
        hanzi: cue.zh_raw,
        pinyin: cue.pinyin_full,
        vi: cue.vi_translation,
        hsk_level: video.hsk_level,
      },
    ],
  };

  await saveWordToDeck(entry, user);

  void recordLearningEvent({
    userId: user?.id ?? null,
    sourceModule: 'vocab',
    hskLevel: video.hsk_level,
    skillDomain: 'vocabulary',
    itemId: token.text,
    isCorrect: true,
    scoreEarned: 100,
    scoreMax: 100,
    durationMs: 3000,
    payload: {
      sourceType: 'video',
      videoId: video.id,
      cueIndex: cue.cue_index,
      timestampMs: cue.start_ms,
    },
  });
}

export async function saveVideoProgress(params: {
  user?: { id?: string | null } | null;
  videoId: string;
  positionMs: number;
  savedCueIndex?: number;
  shadowedCueIndex?: number;
  completed?: boolean;
}): Promise<void> {
  const { user = null, videoId, positionMs, savedCueIndex, shadowedCueIndex, completed = false } = params;
  const key = `${STORAGE_VIDEO_PROGRESS_PREFIX}${videoId}`;

  try {
    if (typeof localStorage !== 'undefined') {
      const existingRaw = localStorage.getItem(key);
      const existing: UserVideoProgress = existingRaw
        ? JSON.parse(existingRaw)
        : {
            last_position_ms: 0,
            saved_cues_indices: [],
            shadowed_cues_indices: [],
            completed: false,
            updated_at: new Date().toISOString(),
          };

      if (typeof savedCueIndex === 'number' && !existing.saved_cues_indices.includes(savedCueIndex)) {
        existing.saved_cues_indices.push(savedCueIndex);
      }
      if (typeof shadowedCueIndex === 'number' && !existing.shadowed_cues_indices.includes(shadowedCueIndex)) {
        existing.shadowed_cues_indices.push(shadowedCueIndex);
      }

      existing.last_position_ms = positionMs;
      existing.completed = existing.completed || completed;
      existing.updated_at = new Date().toISOString();

      localStorage.setItem(key, JSON.stringify(existing));
    }
  } catch {
    // ignore local storage error
  }

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      await supabase.from('user_video_progress').upsert({
        user_id: user.id,
        video_id: videoId,
        last_position_ms: positionMs,
        completed,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // non-fatal
    }
  }
}

