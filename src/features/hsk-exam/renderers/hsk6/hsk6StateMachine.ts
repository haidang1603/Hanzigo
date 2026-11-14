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
  {
    id: 'hsk6-q54-sample',
    question_number: 54,
    options: {
      A: '博物馆最近展出了两千多年前新出土的一批珍贵漆器。',
      B: '在全体科研人员的共同努力下，这项技术终于取得了突破性进展。',
      C: '大家在讨论中各抒己见，气氛十分热烈。',
      D: '良好的沟通能力是现代职场人不可或缺的核心竞争力之一。',
    },
    correct_answer: 'A',
    error_type: '语序不当',
    correction_segments: [
      { text: '博物馆最近展出了', kind: 'normal' },
      { text: '两千多年前', kind: 'delete' },
      { text: '新出土的一批两千多年前的', kind: 'insert' },
      { text: '珍贵漆器。', kind: 'normal' },
    ],
    explanation_vi:
      'Câu A sai trật tự nhiều định ngữ (语序不当): "两千多年前" đứng trước "新出土" thành ra đồ vật vừa mới khai quật cách đây 2.000 năm (phi logic). Phải đưa "新出土的一批" lên trước hoặc viết "最近新出土的一批两千多年前的珍贵漆器".',
    grammar_note: 'Thứ tự định ngữ chuẩn: Sở hữu/Thời gian → Số lượng → Động tính từ miêu tả → Danh từ trung tâm.',
  },
  {
    id: 'hsk6-q55-sample',
    question_number: 55,
    options: {
      A: '随着数字经济的快速发展，传统零售业正积极探索线上线下融合之路。',
      B: '能否保持高度自律，是一个人在长期学术研究中取得成功的重要保障。',
      C: '许多年轻人在快节奏的都市生活中，越来越渴望拥有片刻的宁静。',
      D: '这部纪录片以细腻的镜头语言，真实记录了非遗传承人的坚守与付出。',
    },
    correct_answer: 'B',
    error_type: '搭配不当',
    correction_segments: [
      { text: '能否保持高度自律，是一个人在长期学术研究中', kind: 'normal' },
      { text: '能否', kind: 'insert' },
      { text: '取得成功的重要保障。', kind: 'normal' },
    ],
    explanation_vi:
      'Câu B mắc lỗi "hai mặt ứng một mặt" (两面对一面 / 搭配不当): Vế đầu dùng "能否" (có thể hay không — 2 khả năng), nhưng vế sau chỉ nói "取得成功的重要保障" (chỉ nói 1 mặt thành công). Phải sửa thành "保持高度自律" (1 mặt) hoặc thêm "能否" ở vế sau.',
    grammar_note: 'Luôn kiểm tra các từ 2 mặt: 能否, 是否, 好坏, 高低, 成败 khi đứng đầu câu!',
  },
  {
    id: 'hsk6-q56-sample',
    question_number: 56,
    options: {
      A: '记者深入灾区一线，采访了许多感人至深的抗洪救灾事迹。',
      B: '清晨的湖面薄雾缭绕，几只白鹭静静地伫立在芦苇丛中。',
      C: '为了提升社区服务质量，街道办增设了便民驿站和老年食堂。',
      D: '这位青年画家将东方水墨意境融入现代油画创作，作品备受好评。',
    },
    correct_answer: 'A',
    error_type: '搭配不当',
    correction_segments: [
      { text: '记者深入灾区一线，', kind: 'normal' },
      { text: '采访', kind: 'delete' },
      { text: '报道', kind: 'insert' },
      { text: '了许多感人至深的抗洪救灾事迹。', kind: 'normal' },
    ],
    explanation_vi:
      'Câu A kết hợp động-tân sai (动宾搭配不当): "采访" (phỏng vấn) chỉ đi với người (người dân, nhân vật), không đi trực tiếp với "事迹" (sự tích/câu chuyện). Phải đổi thành "报道" hoặc "挖掘".',
  },
  {
    id: 'hsk6-q57-sample',
    question_number: 57,
    options: {
      A: '在国际航运市场上，绿色甲醇动力船舶的订单量近年来持续攀升。',
      B: '李明和张华约定在图书馆门口见面，他提前十分钟就到了那里。',
      C: '城市更新不仅要保留历史街区的文化肌理，也要改善居民的居住环境。',
      D: '通过反复实验与数据分析，研究团队终于验证了这一科学假说。',
    },
    correct_answer: 'B',
    error_type: '指代不明',
    correction_segments: [
      { text: '李明和张华约定在图书馆门口见面，', kind: 'normal' },
      { text: '他', kind: 'delete' },
      { text: '李明', kind: 'insert' },
      { text: '提前十分钟就到了那里。', kind: 'normal' },
    ],
    explanation_vi:
      'Câu B mắc lỗi đại từ nhân xưng không rõ đối tượng (指代不明): phía trước nhắc đến cả hai người "李明" và "张华", nên chữ "他" ở vế sau gây mơ hồ không biết là ai đến sớm.',
  },
  {
    id: 'hsk6-q58-sample',
    question_number: 58,
    options: {
      A: '由于连日暴雨，山区的部分道路出现了不同程度的塌方。',
      B: '这本书不仅内容丰富，而且语言生动，深受广大青少年读者喜爱。',
      C: '不仅小王擅长古典钢琴演奏，而且在软件工程领域也颇有建树。',
      D: '人工智能在医疗影像识别方面的应用，大大提高了早期筛查的准确率。',
    },
    correct_answer: 'C',
    error_type: '关联词误用',
    correction_segments: [
      { text: '不仅', kind: 'delete' },
      { text: '小王', kind: 'normal' },
      { text: '不仅', kind: 'insert' },
      { text: '擅长古典钢琴演奏，而且在软件工程领域也颇有建树。', kind: 'normal' },
    ],
    explanation_vi:
      'Câu C sai vị trí liên từ (关联词位置不当): Hai vế có chung một chủ ngữ là "小王", vì vậy liên từ "不仅" bắt buộc phải đứng SAU chủ ngữ ("小王不仅……，而且……"). Chỉ khi hai vế khác chủ ngữ thì liên từ mới đứng trước chủ ngữ.',
    grammar_note: 'Mẹo nhớ: 同主语 -> 主语 + 关联词; 异主语 -> 关联词 + 主语.',
  },
  {
    id: 'hsk6-q59-sample',
    question_number: 59,
    options: {
      A: '几个学校的领导今天上午齐聚一堂，共同商讨教学改革方案。',
      B: '老城区改造工程注重保留原有的青砖灰瓦风貌，留住了城市记忆。',
      C: '面对复杂多变的国际贸易环境，企业必须提升自身的核心竞争力。',
      D: '适量阅读纸质书有助于缓解长时间使用电子屏幕带来的视觉疲劳。',
    },
    correct_answer: 'A',
    error_type: '表意不明/歧义',
    correction_segments: [
      { text: '几个学校', kind: 'delete' },
      { text: '来自不同学校的几位', kind: 'insert' },
      { text: '领导今天上午齐聚一堂，共同商讨教学改革方案。', kind: 'normal' },
    ],
    explanation_vi:
      'Câu A mắc lỗi đa nghĩa (歧义): "几个学校的领导" có thể hiểu là "vài vị lãnh đạo (của một trường)" HOẶC "lãnh đạo của vài ngôi trường khác nhau". Cần viết rõ "几位来自不同学校的领导" hoặc "几所学校的领导".',
  },
  {
    id: 'hsk6-q60-sample',
    question_number: 60,
    options: {
      A: '这项节能减排政策实施以来，重工业园区的空气质量明显好转。',
      B: '在刚刚结束的国际展会上，我国自主研发的新能源汽车吸引了众多客商。',
      C: '超市货架上摆满了苹果、香蕉、橘子、西红柿以及各类时令水果。',
      D: '只有充分尊重科研规律，才能激发创新团队源源不断的内生动力。',
    },
    correct_answer: 'C',
    error_type: '不合逻辑',
    correction_segments: [
      { text: '超市货架上摆满了苹果、香蕉、橘子', kind: 'normal' },
      { text: '、西红柿', kind: 'delete' },
      { text: '以及各类', kind: 'delete' },
      { text: '等多种', kind: 'insert' },
      { text: '时令水果。', kind: 'normal' },
    ],
    explanation_vi:
      'Câu C mắc hai lỗi logic cùng lúc (不合逻辑 — 并列不当): (1) "西红柿" (cà chua) thuộc rau củ, không cùng loại với nhóm "时令水果"; (2) Liệt kê cụ thể (táo, chuối, quýt) rồi lại dùng "以及各类水果" (bao hàm cả nhóm đã nêu ở trước, gây chồng chéo khái niệm).',
  },
];

export interface Hsk6SummaryPassage {
  id: string;
  title_hint: string;
  reference_title: string;
  paragraphs: string[];
}

export const HSK6_SUMMARY_PASSAGES: Hsk6SummaryPassage[] = [
  {
    id: 'hsk6-q101-clockmaker',
    title_hint: 'Đề 1: Người thợ sửa đồng hồ trấn Giang Nam (~1.000 chữ)',
    reference_title: '修表匠陈伯的时光守护',
    paragraphs: [
      '在江南一座安静的小镇尽头，住着一位名叫陈伯的修表匠。陈伯今年七十二岁了，他的修表铺子不过十平方米大小，墙上挂满了各式各样停摆的老式挂钟，柜台里摆着放大镜、镊子和一排排细小的螺丝刀。街坊邻居都习惯叫他“时间医生”。',
      '年轻时，陈伯曾在上海一家著名的钟表厂工作，专攻精密机械表的维修。后来工厂改制，许多同事转行去做了生意，只有陈伯带着一身手艺回到了家乡小镇，租下这间临街的小屋，一修就是四十年。如今人们大多看手机时间，戴机械表的人越来越少，铺子的生意也日渐冷清。儿子多次劝他关掉铺子，搬到城里去享清福，陈伯却总是笑着摇摇头说：“老物件里藏着人的念想，我不修，谁来修呢？”',
      '去年秋天的一个雨夜，铺子正准备打烊，一位神色焦急的中年女士推门走了进来。她手里小心翼翼地捧着一块已经生锈的怀表，表盘上的玻璃也裂了一道口子。女士名叫林敏，她说这是父亲生前留下的唯一遗物。三天后就是她女儿的婚礼，她多么希望在婚礼上能让这块承载着外公记忆的怀表重新走动起来。然而她跑遍了市里好几家大商场的手表专柜，维修师都因为零件早已停产而婉拒了。',
      '陈伯戴上放大镜，借着台灯柔和的光线仔细检查了半个多小时。怀表内部的发条已经断裂，几个关键齿轮也严重磨损，确实很难找到现成的替换零件。面对林敏充满期盼的眼神，陈伯没有立刻答应，也没有直接拒绝，只是沉思片刻后轻声说道：“我尽力试一试，两天后的傍晚你再来。”',
      '接下来的两天里，陈伯几乎没有合眼。他翻遍了自己积攒几十年的旧零件铁盒，终于找到了一枚尺寸相近的古董齿轮，但边缘仍需手工打磨。在台灯下，七十二岁的老人屏住呼吸，用细如发丝的锉刀一点一点地修整着齿轮的齿距，稍有偏差便前功尽弃。手指磨出了水泡，眼睛酸痛得直掉眼泪，他就用热毛巾敷一敷再继续。第二天深夜，当最后一颗微小的螺丝拧紧时，那块沉睡了十多年的怀表忽然发出了清脆而规律的“嘀嗒、嘀嗒”声。',
      '婚礼前一天傍晚，林敏如约来到铺子。当她接过焕然一新、正在稳稳走动的怀表时，激动得热泪盈眶，当即拿出一笔丰厚的酬金想要重谢陈伯。陈伯却只收了最普通的几十元手工费，他温和地解释道：“修表修的是人心里的那份牵挂，看到它能赶上孩子的婚礼，比什么报酬都强。”',
      '后来，林敏把这段经历写成了文章发到网上，许多年轻人慕名来到小镇，有的带来祖辈的老表，有的只是想听听时间的故事。陈伯的小铺子又热闹了起来，而他依然每天坐在台灯下，用一双布满老茧的手，静静守护着每一份不愿被遗忘的时光。',
    ],
  },
  {
    id: 'hsk6-q101-bamboo-craftsman',
    title_hint: 'Đề 2: Nghệ nhân đan tre & Chiếc cầu tre ký ức (~980 chữ)',
    reference_title: '山村竹匠周师傅的匠心传承',
    paragraphs: [
      '浙西南的大山深处有个叫竹溪的小村子，村如其名，漫山遍野都是翠绿的毛竹。六十八岁的周师傅是村里最后一位传统竹编老匠人。五十多年来，他只靠一把竹刀和一双巧手，把寻常的竹子编成了背篓、茶笼和精细得像丝绸一样的竹灯罩。',
      '前些年，村里通了柏油路，塑料制品既便宜又耐用，一下子抢走了竹器的全部市场。周师傅的两个徒弟先后进城打工去了，老伴劝他也别再受这份累，免得整天手腕酸痛。周师傅嘴上没说什么，却依然每天天没亮就上山选竹、破篾、晒丝，屋檐下堆满了按粗细分类的竹条。每当乡亲问他何必这么执着，他总抚摸着光滑的竹皮说，塑料虽然轻便却没有生命，竹子是大山给乡亲的馈赠，破成篾条、编进灯罩，才能把山里的呼吸留在家家户户的案头。',
      '转机出现在去年夏天。省城一家艺术学院的年轻设计师苏晴下乡采风，偶然在雨后走进了周师傅的小院。屋檐下挂着一盏周师傅十年前编的六角竹丝灯，灯光透过不到半毫米宽的竹丝洒出来，在墙面上织出细密的水波纹。苏晴看得入了迷，当即提出想把传统竹编和现代极简灯具结合起来，开发一套“山居光影”文创产品，参加年底的国际设计展。',
      '刚开始合作时，两人差点闹得不欢而散。周师傅习惯凭几十年手感决定竹篾弧度，认为图纸上的精确毫米数据束缚了竹子的灵性；而苏晴坚持现代工艺必须具备标准化尺寸，否则无法量产和装配。连续两周，两人在工作台前争论得面红耳赤，周师傅甚至气得把竹刀搁在桌上说不干了。',
      '冷静下来后，苏晴没有催促老人妥协，而是主动拿起刨子跟周师傅学了半个月剖竹丝，亲手体会竹节纤维在不同湿度下的张力变化。周师傅看在眼里，深受触动，也试着用游标卡尺校准最关键的接口尺寸。传统手艺的温润曲线与现代设计的几何精度第一次完美契合。为了赶出参展样品，周师傅连续四十天泡在作坊里，双手被竹刺扎出无数细小伤口，终于在截止前夜完成了六件惊艳的竹艺灯具。',
      '设计展上，“山居光影”一举摘得金奖，不少海外买手纷纷下单。展厅里，柔和的光影穿过细密的竹丝洒向四周，不少观众蹲下身久久端详那些看似朴素却暗藏巧思的榫卯接缝。消息传回竹溪村，曾经离开的两个徒弟主动辞掉城里的活赶回村里拜师学艺，村里还成立了竹编合作社，十几户留守家庭因此增加了稳定收入。',
      '如今，周师傅依然住在那座小院里，只是院子里不再冷清。他常对围在身边的年轻人说，手艺不是放在博物馆里的古董，只要找到贴近今天生活的方式，竹子的清香就能一直飘下去。',
    ],
  },
  {
    id: 'hsk6-q101-piano-tuner',
    title_hint: 'Đề 3: Người lên dây đàn khiếm thị & Buổi hòa nhạc vùng cao (~960 chữ)',
    reference_title: '盲人调音师许老师的微光',
    paragraphs: [
      '在北方一座小城的街头，许明远经营着一间不起眼的乐器维修室。许明远十五岁那年因一次眼疾彻底失去了光明，但在音乐老师王教授的鼓励下，他凭借过人的听觉天赋学习钢琴调音，一干就是二十八年。他说，虽然世界在眼前熄灭了，但八十八个琴键替他点亮了另一种色彩。',
      '去年十月，许明远接到一通来自百里外山区小学的求助电话。电话那头，年轻的乡村音乐老师李娜焦急地介绍，学校两年前获赠了一台二手立式钢琴，可由于山区潮湿加上长期无人维护，如今至少有十几个琴键按下后回弹无力，音准也严重跑偏。下周省里将举办中小学艺术汇演，山里的孩子们排练了整整半年，眼看却因为钢琴失声而面临退赛。',
      '李娜也曾联系过市里两家大型琴行，但听说山路崎岖、往返耗时且学校经费微薄，对方都委婉推辞了。她甚至试着上网找维修视频自己动手，却因为不敢贸然拆解精密机芯而作罢，急得整夜失眠。许明远了解情况后，二话没说便让徒弟帮自己收拾好重达十多公斤的工具箱，第二天清晨顶着寒风搭上了开往山区的长途班车，一路颠簸了三个多小时才在山坳里下车。',
      '抵达学校时已是正午。由于连续雨雪，教室里阴冷潮湿，许明远打开琴盖后发现问题比想象中更棘手：内部毛毡受潮膨胀，几根低音琴弦出现锈蚀，击弦机联动木件也发生了轻微变形。若按常规流程，必须运回维修室烘烤更换零件，可距离汇演只剩三天，时间根本不允许。',
      '许明远当即向校方借来电吹风和干燥的棉布，凭借指尖极其敏锐的触感，逐个拆卸、除潮、打磨变形木件，并用微调扳手反复校准两百多根琴弦的张力。从中午一点到深夜十一点，除了喝几口热水，他几乎没有离开过琴凳。冷风从门缝钻进来，他的手指冻得发红却丝毫不敢抖动。每调准一个八度，站在旁边的李娜老师和几名学生都会惊喜地捂住嘴巴。',
      '经过整整十个小时的精细修复，那台沉寂已久的钢琴终于重新发出清亮饱满的共鸣。汇演当天，当悠扬的琴声在礼堂里缓缓流淌开来，山里的孩子们站在台上自信地跟着节奏放声歌唱，流畅地弹奏完整首合奏曲，赢得了全场最热烈的掌声。事后学校凑齐了一笔劳务费想塞给许明远，他却执意把信封留在了教室讲台上，嘱咐用于给孩子购买乐谱。',
      '后来，这所小学专门设立了校园音乐角，李娜常带领学生在琴盖上贴满写给“许叔叔”的感谢卡。而许明远依然每天背着那只沉重的工具箱穿行在城市街巷，在一次次清脆的叩弦声里，守护着每一份向往美好的声音。',
    ],
  },
];

export const SAMPLE_HSK6_SUMMARY_PASSAGE = HSK6_SUMMARY_PASSAGES[0];

