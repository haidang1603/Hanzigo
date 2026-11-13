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

