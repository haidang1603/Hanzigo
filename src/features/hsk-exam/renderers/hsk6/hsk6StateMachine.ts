export type Hsk6ErrorCategory =
  | '搭配不当'
  | '成分残缺或赘余'
  | '语序不当'
  | '结构混乱/句式杂糅'
  | '表意不明/歧义'
  | '不合逻辑'
  | '关联词误用'
  | '指代不明';

export interface Hsk6ErrorMeta {
  code: Hsk6ErrorCategory;
  labelVi: string;
  descriptionVi: string;
}

export const HSK6_ERROR_TAXONOMY: Record<Hsk6ErrorCategory, Hsk6ErrorMeta> = {
  搭配不当: {
    code: '搭配不当',
    labelVi: 'Kết hợp từ sai (Chủ-Vị / Động-Tân / Định-Trung)',
    descriptionVi:
      'Động từ không đi được với tân ngữ, chủ ngữ không tương thích vị ngữ, hoặc cặp "một mặt... hai mặt..." (能否/是否) mất cân xứng.',
  },
  成分残缺或赘余: {
    code: '成分残缺或赘余',
    labelVi: 'Thiếu thành phần câu hoặc thừa từ',
    descriptionVi:
      'Câu bị mất chủ ngữ do lạm dụng giới từ (通过...使...), thiếu tân ngữ cuối câu, hoặc lặp nghĩa thừa từ (ví dụ: 凯旋归来, 互相彼此).',
  },
  语序不当: {
    code: '语序不当',
    labelVi: 'Sai trật tự từ',
    descriptionVi:
      'Đảo lộn trật tự nhiều định ngữ, nhiều trạng ngữ, hoặc thứ tự diễn tiến logic của hành động (trước/sau).',
  },
  '结构混乱/句式杂糅': {
    code: '结构混乱/句式杂糅',
    labelVi: 'Trộn lẫn 2 cấu trúc câu (Cú thức tạp nhu)',
    descriptionVi:
      'Ghép 2 mẫu câu đúng riêng lẻ thành 1 câu lai tạp (ví dụ: 之所以...是因为... trộn với ...的原因).',
  },
  '表意不明/歧义': {
    code: '表意不明/歧义',
    labelVi: 'Câu tối nghĩa / Đa nghĩa (Kỳ nghĩa)',
    descriptionVi:
      'Một cụm từ hoặc ngắt nhịp có thể hiểu theo 2 nghĩa trái ngược nhau gây mơ hồ.',
  },
  不合逻辑: {
    code: '不合逻辑',
    labelVi: 'Sai logic (Phủ định kép, liệt kê chồng chéo)',
    descriptionVi:
      'Dùng 2–3 lần phủ định (避免不再发生) làm đảo ngược nghĩa, liệt kê khái niệm bao hàm nhau, hoặc mâu thuẫn số liệu.',
  },
  关联词误用: {
    code: '关联词误用',
    labelVi: 'Dùng sai liên từ / Sai vị trí liên từ',
    descriptionVi:
      'Đặt sai vị trí liên từ so với chủ ngữ (2 vế cùng chủ ngữ thì liên từ đứng sau chủ ngữ) hoặc ghép sai cặp liên từ.',
  },
  指代不明: {
    code: '指代不明',
    labelVi: 'Đại từ chỉ định / nhân xưng không rõ nghĩa',
    descriptionVi:
      'Dùng 他/她/这/其 khiến người đọc không xác định được đang thay thế cho danh từ nào phía trước.',
  },
};

export interface CorrectionSegment {
  text: string;
  kind: 'normal' | 'delete' | 'insert';
}

export interface Hsk6FaultySentenceQuestion {
  id: string;
  question_number: number;
  options: Record<'A' | 'B' | 'C' | 'D', string>;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  error_type: Hsk6ErrorCategory;
  correction_segments: CorrectionSegment[];
  explanation_vi: string;
  grammar_note?: string;
}

// ---------------------------------------------------------------------------
// Two-Phase Summary Writing State Machine (HSK 6 Question 101 - 缩写)
// ---------------------------------------------------------------------------

export const HSK6_READING_DURATION_SECONDS = 10 * 60; // 600s (10 minutes)
export const HSK6_WRITING_DURATION_SECONDS = 35 * 60; // 2100s (35 minutes)

export type Hsk6SummaryPhase = 'READING_ONLY' | 'WRITING_ONLY' | 'SUBMITTED';

export interface Hsk6SummaryPersistedState {
  attemptKey: string;
  phase: Hsk6SummaryPhase;
  phase_started_at: number; // epoch ms
  reading_ended_at?: number;
  title: string;
  summary: string;
  submitted_at?: number;
}

export function createInitialSummaryState(
  attemptKey: string,
  nowMs: number = Date.now()
): Hsk6SummaryPersistedState {
  return {
    attemptKey,
    phase: 'READING_ONLY',
    phase_started_at: nowMs,
    title: '',
    summary: '',
  };
}

/**
 * Tính số giây còn lại của pha hiện tại dựa trên `phase_started_at`
 */
export function computePhaseRemainingSeconds(
  state: Hsk6SummaryPersistedState,
  nowMs: number = Date.now()
): number {
  if (state.phase === 'SUBMITTED') return 0;
  const duration =
    state.phase === 'READING_ONLY'
      ? HSK6_READING_DURATION_SECONDS
      : HSK6_WRITING_DURATION_SECONDS;
  const elapsedSec = Math.max(0, Math.floor((nowMs - state.phase_started_at) / 1000));
  return Math.max(0, duration - elapsedSec);
}

/**
 * Chuyển pha tự động nếu đồng hồ đã hết hạn (chống gian lận khi F5 / đóng mở tab)
 */
export function normalizeSummaryPhaseState(
  state: Hsk6SummaryPersistedState,
  nowMs: number = Date.now()
): Hsk6SummaryPersistedState {
  if (state.phase === 'READING_ONLY') {
    const readingEndMs = state.phase_started_at + HSK6_READING_DURATION_SECONDS * 1000;
    if (nowMs >= readingEndMs) {
      const writingEndMs = readingEndMs + HSK6_WRITING_DURATION_SECONDS * 1000;
      if (nowMs >= writingEndMs) {
        return {
          ...state,
          phase: 'SUBMITTED',
          reading_ended_at: readingEndMs,
          phase_started_at: readingEndMs,
          submitted_at: writingEndMs,
        };
      }
      return {
        ...state,
        phase: 'WRITING_ONLY',
        reading_ended_at: readingEndMs,
        phase_started_at: readingEndMs,
      };
    }
    return state;
  }

  if (state.phase === 'WRITING_ONLY') {
    const writingEndMs = state.phase_started_at + HSK6_WRITING_DURATION_SECONDS * 1000;
    if (nowMs >= writingEndMs) {
      return {
        ...state,
        phase: 'SUBMITTED',
        submitted_at: writingEndMs,
      };
    }
  }

  return state;
}

export function transitionToWritingPhase(
  state: Hsk6SummaryPersistedState,
  nowMs: number = Date.now()
): Hsk6SummaryPersistedState {
  if (state.phase !== 'READING_ONLY') return state;
  return {
    ...state,
    phase: 'WRITING_ONLY',
    reading_ended_at: nowMs,
    phase_started_at: nowMs,
  };
}

export function transitionToSubmittedPhase(
  state: Hsk6SummaryPersistedState,
  nowMs: number = Date.now()
): Hsk6SummaryPersistedState {
  if (state.phase === 'SUBMITTED') return state;
  return {
    ...state,
    phase: 'SUBMITTED',
    submitted_at: nowMs,
  };
}

const memoryStorageMap = new Map<string, string>();

export function loadPersistedSummaryState(
  storageKey: string,
  attemptKey: string,
  nowMs: number = Date.now()
): Hsk6SummaryPersistedState {
  try {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(storageKey)
        : memoryStorageMap.get(storageKey) ?? null;
    if (raw) {
      const parsed = JSON.parse(raw) as Hsk6SummaryPersistedState;
      if (parsed && parsed.attemptKey === attemptKey && typeof parsed.phase_started_at === 'number') {
        const normalized = normalizeSummaryPhaseState(parsed, nowMs);
        savePersistedSummaryState(storageKey, normalized);
        return normalized;
      }
    }
  } catch {
    // ignore malformed storage
  }
  const initial = createInitialSummaryState(attemptKey, nowMs);
  savePersistedSummaryState(storageKey, initial);
  return initial;
}

export function savePersistedSummaryState(
  storageKey: string,
  state: Hsk6SummaryPersistedState
): void {
  const serialized = JSON.stringify(state);
  memoryStorageMap.set(storageKey, serialized);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, serialized);
    }
  } catch {
    // ignore quota errors
  }
}

export function clearPersistedSummaryState(storageKey: string): void {
  memoryStorageMap.delete(storageKey);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  } catch {
    // ignore
  }
}

/**
 * Đếm số chữ Hán & dấu câu chuẩn HSK 6 (bỏ qua khoảng trắng/xuống dòng)
 */
export function countChineseSummaryChars(text: string): number {
  if (!text) return 0;
  return text.replace(/\s+/g, '').length;
}

/**
 * Phát hiện dấu ngoặc kép trích dẫn trực tiếp (cấm dùng trong bài tóm tắt 缩写)
 */
export function detectDirectQuotes(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/[“"「][^”"」]{1,120}[”"」]/g) || [];
  if (matches.length > 0) return matches;
  if (/[“”「」]/.test(text)) {
    return ['Phát hiện dấu ngoặc kép trích dẫn trực tiếp'];
  }
  return [];
}

// ---------------------------------------------------------------------------
// Curated HSK 6 Practice Samples
// ---------------------------------------------------------------------------

export const SAMPLE_HSK6_FAULTY_QUESTIONS: Hsk6FaultySentenceQuestion[] = [
  {
    id: 'hsk6-q51-sample',
    question_number: 51,
    options: {
      A: '通过这次社会实践活动，使同学们深刻体会到了团队合作的重要性。',
      B: '无论遇到多大的困难，我们都要保持乐观积极的心态去面对。',
      C: '这座古老的桥梁经历了数百年的风雨，至今依然十分坚固。',
      D: '专家建议每天坚持适量运动，这有助于改善睡眠质量。',
    },
    correct_answer: 'A',
    error_type: '成分残缺或赘余',
    correction_segments: [
      { text: '通过', kind: 'delete' },
      { text: '这次社会实践活动，', kind: 'normal' },
      { text: '使', kind: 'normal' },
      { text: '同学们深刻体会到了团队合作的重要性。', kind: 'normal' },
    ],
    explanation_vi:
      'Câu A mắc lỗi thiếu chủ ngữ (成分残缺) vì dùng đồng thời giới từ "通过" ở đầu câu và động từ sai khiến "使" ở vế sau, khiến cả câu không có chủ ngữ. Cần bỏ "通过" (hoặc bỏ "使").',
    grammar_note: 'Quy tắc vàng HSK 6: Thấy "通过/经过/由于... + 使/让/令..." -> 90% bị mất chủ ngữ!',
  },
  {
    id: 'hsk6-q52-sample',
    question_number: 52,
    options: {
      A: '为了防止此类交通事故不再发生，交警部门加大了路面巡查力度。',
      B: '随着人工智能技术的普及，越来越多的传统行业正在经历深刻变革。',
      C: '他在演讲中结合自身经历，生动地讲述了创业过程中的酸甜苦辣。',
      D: '图书馆不仅收藏了大量纸质书籍，还提供了丰富的数字资源。',
    },
    correct_answer: 'A',
    error_type: '不合逻辑',
    correction_segments: [
      { text: '为了防止此类交通事故', kind: 'normal' },
      { text: '不再', kind: 'delete' },
      { text: '再次', kind: 'insert' },
      { text: '发生，交警部门加大了路面巡查力度。', kind: 'normal' },
    ],
    explanation_vi:
      'Câu A sai logic (不合逻辑) do phủ định kép: "防止" (phòng tránh) bản thân đã mang nghĩa phủ định, đi cùng "不再" (không còn... nữa) sẽ thành "ngăn chặn tai nạn KHÔNG xảy ra nữa" = mong tai nạn tiếp tục xảy ra. Phải bỏ "不" hoặc đổi thành "再次".',
    grammar_note: 'Các động từ mang sẵn nghĩa phủ định: 避免, 防止, 禁止, 杜绝, 切忌 -> Không đi kèm 不/没.',
  },
  {
    id: 'hsk6-q53-sample',
    question_number: 53,
    options: {
      A: '这家百年老店之所以能够经久不衰，是因为它始终坚持真材实料的原因。',
      B: '春天的江南水乡风景如画，每年都吸引着大批游客前来观光。',
      C: '面对突如其来的暴雨，志愿者们迅速行动起来，协助疏散群众。',
      D: '阅读经典文学作品能够开阔视野，提升我们的审美情趣。',
    },
    correct_answer: 'A',
    error_type: '结构混乱/句式杂糅',
    correction_segments: [
      { text: '这家百年老店之所以能够经久不衰，是因为它始终坚持真材实料', kind: 'normal' },
      { text: '的原因', kind: 'delete' },
      { text: '。', kind: 'normal' },
    ],
    explanation_vi:
      'Câu A mắc lỗi trộn lẫn 2 cấu trúc câu (句式杂糅): "之所以...是因为..." bị ghép thừa với "...的原因". Chỉ giữ lại một trong hai cấu trúc.',
  },
];

export const SAMPLE_HSK6_SUMMARY_PASSAGE = {
  id: 'hsk6-q101-clockmaker',
  title_hint: 'Bài đọc tự sự mẫu (~1.000 chữ)',
  paragraphs: [
    '在江南一座安静的小镇尽头，住着一位名叫陈伯的修表匠。陈伯今年七十二岁了，他的修表铺子不过十平方米大小，墙上挂满了各式各样停摆的老式挂钟，柜台里摆着放大镜、镊子和一排排细小的螺丝刀。街坊邻居都习惯叫他“时间医生”。',
    '年轻时，陈伯曾在上海一家著名的钟表厂工作，专攻精密机械表的维修。后来工厂改制，许多同事转行去做了生意，只有陈伯带着一身手艺回到了家乡小镇，租下这间临街的小屋，一修就是四十年。如今人们大多看手机时间，戴机械表的人越来越少，铺子的生意也日渐冷清。儿子多次劝他关掉铺子，搬到城里去享清福，陈伯却总是笑着摇摇头说：“老物件里藏着人的念想，我不修，谁来修呢？”',
    '去年秋天的一个雨夜，铺子正准备打烊，一位神色焦急的中年女士推门走了进来。她手里小心翼翼地捧着一块已经生锈的怀表，表盘上的玻璃也裂了一道口子。女士名叫林敏，她说这是父亲生前留下的唯一遗物。三天后就是她女儿的婚礼，她多么希望在婚礼上能让这块承载着外公记忆的怀表重新走动起来。然而她跑遍了市里好几家大商场的手表专柜，维修师都因为零件早已停产而婉拒了。',
    '陈伯戴上放大镜，借着台灯柔和的光线仔细检查了半个多小时。怀表内部的发条已经断裂，几个关键齿轮也严重磨损，确实很难找到现成的替换零件。面对林敏充满期盼的眼神，陈伯没有立刻答应，也没有直接拒绝，只是沉思片刻后轻声说道：“我尽力试一试，两天后的傍晚你再来。”',
    '接下来的两天里，陈伯几乎没有合眼。他翻遍了自己积攒几十年的旧零件铁盒，终于找到了一枚尺寸相近的古董齿轮，但边缘仍需手工打磨。在台灯下，七十二岁的老人屏住呼吸，用细如发丝的锉刀一点一点地修整着齿轮的齿距，稍有偏差便前功尽弃。手指磨出了水泡，眼睛酸痛得直掉眼泪，他就用热毛巾敷一敷再继续。第二天深夜，当最后一颗微小的螺丝拧紧时，那块沉睡了十多年的怀表忽然发出了清脆而规律的“嘀嗒、嘀嗒”声。',
    '婚礼前一天傍晚，林敏如约来到铺子。当她接过焕然一新、正在稳稳走动的怀表时，激动得热泪盈眶，当即拿出一笔丰厚的酬金想要重谢陈伯。陈伯却只收了最普通的几十元手工费，他温和地解释道：“修表修的是人心里的那份牵挂，看到它能赶上孩子的婚礼，比什么报酬都强。”',
    '后来，林敏把这段经历写成了文章发到网上，许多年轻人慕名来到小镇，有的带来祖辈的老表，有的只是想听听时间的故事。陈伯的小铺子又热闹了起来，而他依然每天坐在台灯下，用一双布满老茧的手，静静守护着每一份不愿被遗忘的时光。',
  ],
};

