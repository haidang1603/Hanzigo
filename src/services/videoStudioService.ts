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
const STORAGE_CUSTOM_VIDEOS_KEY = 'hanzigo_custom_youtube_videos_v1';

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

  const resolvedPinyin =
    pinyin_full.trim() ||
    tokens
      .map((t) => (t.is_punctuation ? t.text : t.pinyin || t.text))
      .join(' ')
      .replace(/\s+([，。！？；：、,.!?;:])/g, '$1');

  return {
    cue_index,
    start_ms,
    end_ms,
    zh_raw,
    pinyin_full: resolvedPinyin,
    vi_translation,
    grammar_notes,
    tokens,
  };
}

/**
 * Extract a valid 11-character YouTube video ID from any YouTube URL or raw ID.
 */
export function parseYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./i, '').toLowerCase();

    let candidate: string | null = null;
    if (host === 'youtu.be') {
      candidate = url.pathname.split('/').filter(Boolean)[0] || null;
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') {
        candidate = url.searchParams.get('v');
      } else {
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts[0] === 'shorts' || parts[0] === 'embed' || parts[0] === 'live' || parts[0] === 'v') {
          candidate = parts[1] || null;
        }
      }
    }

    if (candidate && /^[a-zA-Z0-9_-]{11}$/.test(candidate)) {
      return candidate;
    }
  } catch {
    return null;
  }

  return null;
}

function parseTimestampToMs(raw: string): number {
  const cleaned = raw.trim().replace(',', '.');
  const parts = cleaned.split(':').map((p) => Number(p));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 3) {
    return Math.round((parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000);
  }
  if (parts.length === 2) {
    return Math.round((parts[0] * 60 + parts[1]) * 1000);
  }
  return 0;
}

/**
 * Parse SRT, WebVTT, or plain Chinese lines (optionally "中文 | Tiếng Việt") into SubtitleCue[].
 */
export function parseSubtitlesInput(rawText: string): SubtitleCue[] {
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (!normalized) return [];

  const timeRangeRegex =
    /(\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d{1,3})?)\s*-->\s*(\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d{1,3})?)/;

  if (timeRangeRegex.test(normalized)) {
    const blocks = normalized
      .replace(/^WEBVTT[^\n]*\n*/i, '')
      .split(/\n{2,}/)
      .map((b) => b.trim())
      .filter(Boolean);

    const cues: SubtitleCue[] = [];
    for (const block of blocks) {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      const timeLineIdx = lines.findIndex((l) => timeRangeRegex.test(l));
      if (timeLineIdx === -1) continue;

      const match = lines[timeLineIdx].match(timeRangeRegex);
      if (!match) continue;

      const startMs = parseTimestampToMs(match[1]);
      const endMs = Math.max(startMs + 500, parseTimestampToMs(match[2]));
      const textLines = lines.slice(timeLineIdx + 1).map((l) => l.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
      if (textLines.length === 0) continue;

      const zhRaw = textLines[0];
      const viTranslation = textLines.length >= 2 ? textLines[textLines.length - 1] : '';
      const pinyinFull = textLines.length >= 3 ? textLines[1] : '';

      cues.push(
        buildSubtitleCue(cues.length, startMs, endMs, zhRaw, pinyinFull, viTranslation)
      );
    }
    return cues;
  }

  // Fallback: plain lines ("中文 | Nghĩa tiếng Việt" or just "中文")
  const plainLines = normalized
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return plainLines.map((line, idx) => {
    const [zhPart, viPart = ''] = line.split('|').map((s) => s.trim());
    const startMs = idx * 5000;
    const endMs = startMs + 5000;
    return buildSubtitleCue(idx, startMs, endMs, zhPart, '', viPart);
  });
}

export async function fetchYouTubeOEmbedMeta(videoId: string): Promise<{
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
} | null> {
  if (typeof fetch === 'undefined') return null;
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 4000) : null;
  try {
    const targetUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`,
      controller ? { signal: controller.signal } : undefined
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: typeof data?.title === 'string' ? data.title : undefined,
      author_name: typeof data?.author_name === 'string' ? data.author_name : undefined,
      thumbnail_url: typeof data?.thumbnail_url === 'string' ? data.thumbnail_url : undefined,
    };
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function getCustomYouTubeVideos(): ImmersionVideo[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_CUSTOM_VIDEOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ImmersionVideo[]) : [];
  } catch {
    return [];
  }
}

function persistCustomYouTubeVideos(videos: ImmersionVideo[]): ImmersionVideo[] {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_CUSTOM_VIDEOS_KEY, JSON.stringify(videos));
    }
  } catch {
    // ignore storage errors
  }
  return videos;
}

export function createCustomYouTubeVideo(params: {
  videoId: string;
  title?: string;
  channelName?: string;
  thumbnailUrl?: string;
  hskLevel?: number;
  rawSubtitles?: string;
}): ImmersionVideo {
  const subtitles = params.rawSubtitles ? parseSubtitlesInput(params.rawSubtitles) : [];
  const lastCueEndSec =
    subtitles.length > 0 ? Math.ceil(subtitles[subtitles.length - 1].end_ms / 1000) : 600;
  const cleanTitle = params.title?.trim() || `YouTube (${params.videoId})`;

  return {
    id: `yt-${params.videoId}-${Date.now()}`,
    source_type: 'youtube',
    external_video_id: params.videoId,
    title_zh: cleanTitle,
    title_vi: cleanTitle,
    channel_name: params.channelName?.trim() || 'YouTube',
    thumbnail_url:
      params.thumbnailUrl?.trim() || `https://i.ytimg.com/vi/${params.videoId}/hqdefault.jpg`,
    duration_seconds: Math.max(60, lastCueEndSec),
    hsk_level: params.hskLevel ?? 3,
    topic_tags: ['YouTube'],
    speech_speed: 'normal',
    subtitles,
  };
}

export function saveCustomYouTubeVideo(video: ImmersionVideo): ImmersionVideo[] {
  const existing = getCustomYouTubeVideos().filter(
    (v) => v.external_video_id !== video.external_video_id && v.id !== video.id
  );
  return persistCustomYouTubeVideos([video, ...existing]);
}

export function updateCustomYouTubeVideoSubtitles(
  videoId: string,
  rawSubtitles: string
): ImmersionVideo[] {
  const subtitles = parseSubtitlesInput(rawSubtitles);
  const existing = getCustomYouTubeVideos();
  const updated = existing.map((v) => {
    if (v.id !== videoId) return v;
    const lastCueEndSec =
      subtitles.length > 0 ? Math.ceil(subtitles[subtitles.length - 1].end_ms / 1000) : v.duration_seconds;
    return {
      ...v,
      duration_seconds: Math.max(v.duration_seconds, lastCueEndSec),
      subtitles,
    };
  });
  return persistCustomYouTubeVideos(updated);
}

export function deleteCustomYouTubeVideo(videoId: string): ImmersionVideo[] {
  const filtered = getCustomYouTubeVideos().filter((v) => v.id !== videoId);
  return persistCustomYouTubeVideos(filtered);
}

const BUILT_IN_VIDEOS: ImmersionVideo[] = [];

export function getBuiltInVideos(): ImmersionVideo[] {
  return BUILT_IN_VIDEOS;
}

export async function listImmersionVideos(): Promise<ImmersionVideo[]> {
  const customVideos = getCustomYouTubeVideos();
  if (!isSupabaseConfigured || !supabase) {
    return customVideos;
  }

  try {
    const { data, error } = await supabase
      .from('immersion_videos')
      .select('*')
      .order('hsk_level', { ascending: true });

    if (error || !Array.isArray(data) || data.length === 0) {
      return customVideos;
    }

    const remoteVideos = data.map((row) => ({
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

    return [...customVideos, ...remoteVideos];
  } catch {
    return customVideos;
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
    sourceModule: 'srs_review',
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
  }).catch(() => {});
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

