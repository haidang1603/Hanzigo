import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import {
  parseCustomArticleToParagraphs,
  type ReadingParagraph,
  type ReadingToken,
} from '../utils/chineseTokenizer.ts';
import { createCustomReadingArticle, type ReadingArticle } from './readingStudioService.ts';

export interface HskDistribution {
  total_words: number;
  hsk1_3_count: number;
  hsk1_3_pct: number;
  hsk4_5_count: number;
  hsk4_5_pct: number;
  hsk6_plus_count: number;
  hsk6_plus_pct: number;
  unknown_user_words_count: number;
  comprehensible_input_ratio: number;
  readability_score: number;
  estimated_hsk_level: number;
}

export interface KeyVocabItem {
  text: string;
  pinyin: string;
  meaning_vi: string;
  hsk_level?: number;
  occurrences: number;
  is_known: boolean;
}

export interface ArticleVersions {
  original: ReadingParagraph[];
  simplified_hsk4?: ReadingParagraph[];
  simplified_hsk3?: ReadingParagraph[];
  glossed?: ReadingParagraph[];
}

export interface ImportedWebContent {
  id: string;
  user_id?: string | null;
  source_url?: string | null;
  domain_name: string;
  original_title_zh: string;
  hsk_distribution: HskDistribution;
  versions: ArticleVersions;
  extracted_key_vocab: KeyVocabItem[];
  converted_article_id?: string | null;
  created_at: string;
}

const LOCAL_STORAGE_KEY = 'hanzigo_imported_web_contents';

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota safe
  }
}

/**
 * Advanced literary / news words dictionary with HSK 3-4 simplified equivalents
 */
export const ADVANCED_SYNONYM_REPLACEMENTS: Record<
  string,
  { simplified: string; meaning_vi: string; hsk_level: number }
> = {
  据悉: { simplified: '根据报道', meaning_vi: 'theo báo cáo', hsk_level: 5 },
  莅临: { simplified: '来到', meaning_vi: 'đến thăm', hsk_level: 6 },
  磋商: { simplified: '商量', meaning_vi: 'thảo luận', hsk_level: 6 },
  骤降: { simplified: '突然下降', meaning_vi: 'giảm đột ngột', hsk_level: 6 },
  繁荣昌盛: { simplified: '非常发达', meaning_vi: 'phồn vinh phát đạt', hsk_level: 6 },
  屡见不鲜: { simplified: '经常看到', meaning_vi: 'thấy nhiều không lạ', hsk_level: 6 },
  毋庸置疑: { simplified: '不用怀疑', meaning_vi: 'không cần nghi ngờ', hsk_level: 6 },
  突飞猛进: { simplified: '进步很快', meaning_vi: 'tiến bộ vượt bậc', hsk_level: 5 },
  竭尽全力: { simplified: '非常努力', meaning_vi: 'dốc hết sức lực', hsk_level: 5 },
  举足轻重: { simplified: '非常重要', meaning_vi: 'vị thế quan trọng', hsk_level: 6 },
  当务之急: { simplified: '最急的事情', meaning_vi: 'việc cấp bách', hsk_level: 5 },
  有目共睹: { simplified: '大家都能看到', meaning_vi: 'ai cũng thấy rõ', hsk_level: 6 },
  日新月异: { simplified: '天天在变化', meaning_vi: 'thay đổi từng ngày', hsk_level: 5 },
  各抒己见: { simplified: '说出自己的想法', meaning_vi: 'mỗi người một ý', hsk_level: 5 },
  潜移默化: { simplified: '慢慢受到影响', meaning_vi: 'ngấm dần tự nhiên', hsk_level: 6 },
  循序渐进: { simplified: '一步一步来', meaning_vi: 'tuần tự từng bước', hsk_level: 5 },
  废寝忘食: { simplified: '非常专心', meaning_vi: 'quên ăn quên ngủ', hsk_level: 5 },
  脍炙人口: { simplified: '很受欢迎', meaning_vi: 'nổi tiếng ai cũng thích', hsk_level: 6 },
  络绎不绝: { simplified: '人来人往很多', meaning_vi: 'nườm nượp không ngớt', hsk_level: 5 },
  欣欣向荣: { simplified: '发展得很好', meaning_vi: 'phát triển mạnh mẽ', hsk_level: 5 },
  不可或缺: { simplified: '一定需要', meaning_vi: 'không thể thiếu', hsk_level: 5 },
  引人入胜: { simplified: '非常吸引人', meaning_vi: 'vô cùng lôi cuốn', hsk_level: 5 },
};

/**
 * Analyze text readability and distribution across HSK levels (1-9)
 */
export function analyzeChineseReadability(
  paragraphs: ReadingParagraph[],
  knownWords?: Set<string>
): HskDistribution {
  let totalWords = 0;
  let hsk1_3 = 0;
  let hsk4_5 = 0;
  let hsk6_plus = 0;
  let unknownCount = 0;

  for (const para of paragraphs) {
    for (const sent of para.sentences) {
      for (const tok of sent.tokens) {
        if (tok.is_punctuation || !tok.text.trim()) continue;

        totalWords += 1;
        const lvl = tok.hsk_level ?? 6;

        if (lvl <= 3) {
          hsk1_3 += 1;
        } else if (lvl <= 5) {
          hsk4_5 += 1;
        } else {
          hsk6_plus += 1;
        }

        if (knownWords && !knownWords.has(tok.text)) {
          unknownCount += 1;
        }
      }
    }
  }

  const safeTotal = Math.max(1, totalWords);
  const hsk1_3_pct = Math.round((hsk1_3 / safeTotal) * 100);
  const hsk4_5_pct = Math.round((hsk4_5 / safeTotal) * 100);
  const hsk6_plus_pct = Math.round((hsk6_plus / safeTotal) * 100);

  // Comprehensible input: ratio of known words
  const knownRatio = knownWords && totalWords > 0
    ? Math.max(0, Math.min(1, (totalWords - unknownCount) / safeTotal))
    : Math.max(0.65, Math.min(0.95, (hsk1_3 + hsk4_5 * 0.7) / safeTotal));

  // Readability score: 0 to 100 (higher = easier to read)
  const readabilityScore = Math.max(
    15,
    Math.min(98, Math.round(100 - (hsk4_5_pct * 0.45 + hsk6_plus_pct * 0.95)))
  );

  let estimatedLevel = 3;
  if (hsk6_plus_pct >= 25 || hsk4_5_pct >= 40) {
    estimatedLevel = 6;
  } else if (hsk4_5_pct >= 25) {
    estimatedLevel = 5;
  } else if (hsk4_5_pct >= 15) {
    estimatedLevel = 4;
  } else {
    estimatedLevel = 3;
  }

  return {
    total_words: totalWords,
    hsk1_3_count: hsk1_3,
    hsk1_3_pct,
    hsk4_5_count: hsk4_5,
    hsk4_5_pct,
    hsk6_plus_count: hsk6_plus,
    hsk6_plus_pct,
    unknown_user_words_count: unknownCount,
    comprehensible_input_ratio: parseFloat(knownRatio.toFixed(2)),
    readability_score: readabilityScore,
    estimated_hsk_level: estimatedLevel,
  };
}

/**
 * Extract 10-15 key vocabulary items for Pre-reading Glossary
 */
export function extractKeyPreReadingVocab(
  paragraphs: ReadingParagraph[],
  knownWords?: Set<string>,
  limit = 10
): KeyVocabItem[] {
  const tokenFreq = new Map<string, { token: ReadingToken; count: number }>();

  for (const para of paragraphs) {
    for (const sent of para.sentences) {
      for (const tok of sent.tokens) {
        if (tok.is_punctuation || !tok.text.trim()) continue;
        const key = tok.text;
        const existing = tokenFreq.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          tokenFreq.set(key, { token: tok, count: 1 });
        }
      }
    }
  }

  const items: KeyVocabItem[] = [];

  for (const [text, { token, count }] of tokenFreq.entries()) {
    const isKnown = knownWords ? knownWords.has(text) : (token.hsk_level ?? 4) <= 2;
    items.push({
      text,
      pinyin: token.pinyin || '',
      meaning_vi: token.meaning_vi || 'Từ vựng quan trọng trong bài',
      hsk_level: token.hsk_level,
      occurrences: count,
      is_known: isKnown,
    });
  }

  // Sort by: priority to unknown or HSK 4+ words, then frequency
  items.sort((a, b) => {
    const aPriority = (!a.is_known ? 10 : 0) + ((a.hsk_level || 3) >= 4 ? 5 : 0);
    const bPriority = (!b.is_known ? 10 : 0) + ((b.hsk_level || 3) >= 4 ? 5 : 0);
    if (bPriority !== aPriority) return bPriority - aPriority;
    return b.occurrences - a.occurrences;
  });

  return items.slice(0, limit);
}

/**
 * AI Adaptive Text Simplifier:
 * - 'rewrite': replaces high-level words with HSK 3-4 equivalents
 * - 'gloss': appends inline bracketed glosses after complex terms
 */
export function adaptTextToHskLevel(
  rawText: string,
  targetHsk: 3 | 4,
  mode: 'rewrite' | 'gloss'
): string {
  let output = rawText;

  for (const [advancedWord, info] of Object.entries(ADVANCED_SYNONYM_REPLACEMENTS)) {
    if (output.includes(advancedWord)) {
      if (mode === 'rewrite') {
        output = output.replaceAll(advancedWord, info.simplified);
      } else {
        output = output.replaceAll(advancedWord, `${advancedWord} [${info.simplified}]`);
      }
    }
  }

  // Additional sentence simplification for HSK 3: shorten connecting clauses
  if (targetHsk === 3 && mode === 'rewrite') {
    output = output
      .replaceAll('尽管如此，', '但是，')
      .replaceAll('与此同时，', '同时，')
      .replaceAll('毋庸置疑的是，', '大家都知道，');
  }

  return output;
}

/**
 * Clean and extract domain from URL
 */
export function extractDomainFromUrl(url?: string | null): string {
  if (!url) return 'custom_input';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace('www.', '');
  } catch {
    return 'web_source';
  }
}

/**
 * Pre-packaged Sample Web Articles representing real-world Chinese journalism:
 */
export function getSampleWebArticles(): ImportedWebContent[] {
  const article1Raw =
    '随着中国人工智能技术的突飞猛进，各行各业都迎来了日新月异的变化。\n据悉，新一代大语言模型在医疗、教育与自动驾驶领域取得了举足轻重的成就。\n毋庸置疑，科技创新将为年轻一代带来前所未有的发展机遇。';

  const article2Raw =
    '中国高速铁路网络的繁荣昌盛让各大城市的出行变得更加便捷。\n四通八达的高铁线路将旅游、商业和文化紧密联系在一起。\n每逢节假日，车站里旅客络绎不绝，大家共同感受科技发展的速度。';

  const article3Raw =
    '中国传统茶文化源远流长，在现代年轻人生活中依然不可或缺。\n无论是在繁忙的工作之余品尝一杯清茶，还是与好友相聚，茶道都让人感到身心平静。\n这种古老习俗正在焕发新的青春活力。';

  const buildArticle = (id: string, title: string, url: string, domain: string, raw: string): ImportedWebContent => {
    const { paragraphs: original } = parseCustomArticleToParagraphs(raw);
    const rewritten4 = adaptTextToHskLevel(raw, 4, 'rewrite');
    const rewritten3 = adaptTextToHskLevel(raw, 3, 'rewrite');
    const glossedRaw = adaptTextToHskLevel(raw, 4, 'gloss');

    const { paragraphs: simplified_hsk4 } = parseCustomArticleToParagraphs(rewritten4);
    const { paragraphs: simplified_hsk3 } = parseCustomArticleToParagraphs(rewritten3);
    const { paragraphs: glossed } = parseCustomArticleToParagraphs(glossedRaw);

    const dist = analyzeChineseReadability(original);
    const keyVocab = extractKeyPreReadingVocab(original);

    return {
      id,
      source_url: url,
      domain_name: domain,
      original_title_zh: title,
      hsk_distribution: dist,
      versions: {
        original,
        simplified_hsk4,
        simplified_hsk3,
        glossed,
      },
      extracted_key_vocab: keyVocab,
      created_at: new Date('2026-11-10T10:00:00Z').toISOString(),
    };
  };

  return [
    buildArticle(
      'sample-web-ai-tech',
      '中国人工智能技术的快速发展与行业应用',
      'https://tech.china.com/articles/2026/ai-innovation',
      'tech.china.com',
      article1Raw
    ),
    buildArticle(
      'sample-web-bullet-train',
      '高铁网络连接全国各大城市与现代出行生活',
      'https://travel.xinhuanet.com/bullet-train-network',
      'xinhuanet.com',
      article2Raw
    ),
    buildArticle(
      'sample-web-tea-culture',
      '中国传统茶文化在现代都市年轻人中的传承',
      'https://culture.people.cn/traditional-tea-lifestyle',
      'people.cn',
      article3Raw
    ),
  ];
}

/**
 * List imported web contents (local cache + remote Supabase)
 */
export async function listImportedWebArticles(
  user?: { id?: string | null } | null
): Promise<ImportedWebContent[]> {
  const samples = getSampleWebArticles();
  const local = safeReadJson<ImportedWebContent[]>(LOCAL_STORAGE_KEY, []);

  if (!isSupabaseConfigured || !supabase || !user?.id) {
    return [...local, ...samples];
  }

  try {
    const { data, error } = await supabase
      .from('imported_web_contents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return [...(data as ImportedWebContent[]), ...local, ...samples];
    }
  } catch {
    // fallback
  }

  return [...local, ...samples];
}

/**
 * Import a new web content or pasted Chinese text
 */
export async function importWebContentOrText(params: {
  url?: string | null;
  text: string;
  title?: string;
  user?: { id?: string | null } | null;
  knownWords?: Set<string>;
}): Promise<ImportedWebContent> {
  const { url, text, title, user, knownWords } = params;
  const rawText = text.trim();
  const domain = extractDomainFromUrl(url);

  // Extract title from first line if not provided
  let inferredTitle = title?.trim();
  if (!inferredTitle) {
    const firstLine = rawText.split('\n')[0].replace(/[#*]/g, '').trim();
    inferredTitle = firstLine ? firstLine.slice(0, 35) : `Bài báo nhập ${domain}`;
  }

  const { paragraphs: original } = parseCustomArticleToParagraphs(rawText);
  const rewritten4 = adaptTextToHskLevel(rawText, 4, 'rewrite');
  const rewritten3 = adaptTextToHskLevel(rawText, 3, 'rewrite');
  const glossedRaw = adaptTextToHskLevel(rawText, 4, 'gloss');

  const { paragraphs: simplified_hsk4 } = parseCustomArticleToParagraphs(rewritten4);
  const { paragraphs: simplified_hsk3 } = parseCustomArticleToParagraphs(rewritten3);
  const { paragraphs: glossed } = parseCustomArticleToParagraphs(glossedRaw);

  const hsk_distribution = analyzeChineseReadability(original, knownWords);
  const extracted_key_vocab = extractKeyPreReadingVocab(original, knownWords);

  const newDoc: ImportedWebContent = {
    id: `web-art-${Date.now()}`,
    user_id: user?.id || null,
    source_url: url || null,
    domain_name: domain,
    original_title_zh: inferredTitle,
    hsk_distribution,
    versions: {
      original,
      simplified_hsk4,
      simplified_hsk3,
      glossed,
    },
    extracted_key_vocab,
    created_at: new Date().toISOString(),
  };

  const local = safeReadJson<ImportedWebContent[]>(LOCAL_STORAGE_KEY, []);
  safeWriteJson(LOCAL_STORAGE_KEY, [newDoc, ...local].slice(0, 30));

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      const { data } = await supabase
        .from('imported_web_contents')
        .insert({
          user_id: user.id,
          source_url: newDoc.source_url,
          domain_name: newDoc.domain_name,
          original_title_zh: newDoc.original_title_zh,
          hsk_distribution: newDoc.hsk_distribution,
          versions: newDoc.versions,
          extracted_key_vocab: newDoc.extracted_key_vocab,
        })
        .select('id, created_at')
        .single();

      if (data?.id) {
        newDoc.id = String(data.id);
        newDoc.created_at = String(data.created_at || newDoc.created_at);
      }
    } catch {
      // non-fatal
    }
  }

  return newDoc;
}

/**
 * Convert an imported web article version into a full Reading Studio Article
 */
export async function convertWebArticleToReadingStudio(
  doc: ImportedWebContent,
  versionType: 'original' | 'simplified_hsk4' | 'simplified_hsk3' | 'glossed' = 'original',
  user?: { id?: string | null } | null
): Promise<ReadingArticle> {
  const versionParagraphs = doc.versions[versionType] || doc.versions.original;
  const rawText = versionParagraphs
    .map((p) => p.sentences.map((s) => s.zh_raw).join(''))
    .join('\n');

  const suffix =
    versionType === 'simplified_hsk3'
      ? ' (Rút gọn HSK 3)'
      : versionType === 'simplified_hsk4'
      ? ' (Rút gọn HSK 4)'
      : versionType === 'glossed'
      ? ' (Chú thích từ khó)'
      : '';

  const article = await createCustomReadingArticle({
    titleZh: `${doc.original_title_zh}${suffix}`,
    titleVi: `Bài báo trích xuất từ ${doc.domain_name}`,
    rawText,
    hskLevel: doc.hsk_distribution.estimated_hsk_level,
    user,
  });

  doc.converted_article_id = article.id;

  return article;
}
