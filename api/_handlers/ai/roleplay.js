/**
 * =========================================================================
 * HANZIGO — ERROR-AWARE MISSION ROLEPLAY HANDLER (TASK 34.03)
 * =========================================================================
 * Supports:
 * 1. `action: 'start_session'` -> Loads learner's 5 SRS target words + 2 weak
 *    grammar points via `retrieveLearnerAdaptiveProfile`, creates `ai_roleplay_sessions`
 *    record, and generates persona opening greeting.
 * 2. `action: 'send_turn'` -> Detects completed vocab/grammar missions via
 *    `detectCompletedMissions`, awards SRS mastery via `update_vocab_dimension_score`,
 *    calls `aiProviderAdapter` for structured JSON evaluation + next-turn steering,
 *    with smart offline fallback.
 * 3. Legacy stateless mode (when `action` is omitted) for full backward compatibility.
 */

import crypto from 'crypto';
import { checkRateLimitAndQuota } from '../../_utils/distributedRateLimiter.js';
import { verifyRequestAuth } from '../../_utils/verifyAuth.js';
import { getSupabaseAdminClient } from '../../_utils/supabaseServer.js';
import { callUnifiedAiProvider, extractStructuredJson } from '../../_utils/aiProviderAdapter.js';
import { retrieveLearnerAdaptiveProfile } from '../../_utils/ragRetriever.js';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 25;
const DAILY_QUOTA_MAX_REQUESTS = 150;

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts)/i,
  /system\s+prompt\s+override/i,
  /you\s+are\s+now\s+(an\s+unrestricted|DAN|jailbreak)/i,
  /reveal\s+(your\s+)?(api[_\s]?key|secret|system\s+prompt)/i,
  /<script\b[^>]*>/i,
];

const SCENARIO_PERSONAS = {
  beijing_market_bargain: {
    title: 'Mặc cả ở chợ Bắc Kinh',
    personaName: 'Ông chủ Vương (Chợ Tú Thủy)',
    openingZh: '欢迎光临！看看这件衣服，今天刚到的新款，你觉得怎么样？',
    openingPinyin: 'Huānyíng guānglín! Kànkan zhè jiàn yīfu, jīntiān gāng dào de xīnkuǎn, nǐ juéde zěnmeyàng?',
    openingVi: 'Chào mừng quý khách! Xem thử chiếc áo này đi, mẫu mới vừa về hôm nay đấy, bạn thấy thế nào?',
  },
  it_job_interview: {
    title: 'Phỏng vấn IT tại Thượng Hải',
    personaName: 'Trưởng phòng Kỹ thuật Lý',
    openingZh: '你好，请坐！我们先用中文聊聊吧，请简单介绍一下你的项目经验。',
    openingPinyin: 'Nǐ hǎo, qǐng zuò! Wǒmen xiān yòng Zhōngwén liáoliao ba, qǐng jiǎndān jièshào yíxià nǐ de xiàngmù jīngyàn.',
    openingVi: 'Chào bạn, mời ngồi! Chúng ta nói chuyện bằng tiếng Trung trước nhé, bạn hãy giới thiệu ngắn gọn kinh nghiệm dự án của mình.',
  },
  hospital_symptom_check: {
    title: 'Khám bệnh tại bệnh viện',
    personaName: 'Bác sĩ Trần',
    openingZh: '请进，坐下吧。你今天觉得哪里不舒服？这种情况持续几天了？',
    openingPinyin: 'Qǐng jìn, zuòxià ba. Nǐ jīntiān juéde nǎlǐ bù shūfu? Zhè zhǒng qíngkuàng chíxù jǐ tiān le?',
    openingVi: 'Mời vào, ngồi xuống đi. Hôm nay bạn thấy khó chịu ở đâu? Tình trạng này kéo dài mấy ngày rồi?',
  },
  restaurant_ordering: {
    title: 'Đặt món tại nhà hàng',
    personaName: 'Nhân viên phục vụ Tiểu Mỹ',
    openingZh: '您好，欢迎来到我们餐厅！这是菜单，请问您今天想点什么菜？',
    openingPinyin: 'Nínhǎo, huānyíng láidào wǒmen cāntīng! Zhè shì càidān, qǐngwèn nín jīntiān xiǎng diǎn shénme cài?',
    openingVi: 'Xin chào quý khách, chào mừng đến nhà hàng! Đây là thực đơn, xin hỏi hôm nay quý khách muốn gọi món gì ạ?',
  },
};

const GRAMMAR_REGEX_CATALOG = [
  { key: 'BA', regex: /把.+(了|完|好|过来|出去|进去|下来|起来|给|放|拿|送)/ },
  { key: 'BUJIN', regex: /不仅.+(而且|还|也)/ },
  { key: 'SUIRAN', regex: /虽然.+(但是|可是|不过)/ },
  { key: 'YINWEI', regex: /因为.+所以/ },
  { key: 'BI', regex: /比.+(更|还|得多|一点儿|多了)/ },
  { key: 'BEI', regex: /被.+(了|走|拿|吃|打|发现)/ },
  { key: 'YUE', regex: /越.+越.+/ },
  { key: 'CHULE', regex: /除了.+(以外|之外)?.*(还|也|都)/ },
];

export function detectAbuseOrInjection(text) {
  if (!text || typeof text !== 'string') return false;
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

function matchesGrammarPattern(messageZh, grammarPoint) {
  const code = String(grammarPoint?.code || '').toUpperCase();
  const pattern = String(grammarPoint?.pattern_display || '');

  for (const rule of GRAMMAR_REGEX_CATALOG) {
    if (code.includes(rule.key) && rule.regex.test(messageZh)) {
      return true;
    }
  }

  if (pattern.includes('把') && /把.+(了|完|好|过来|出去)/.test(messageZh)) return true;
  if (pattern.includes('不仅') && /不仅.*(而且|还)/.test(messageZh)) return true;
  if (pattern.includes('虽然') && /虽然.*(但是|可是)/.test(messageZh)) return true;
  if (pattern.includes('因为') && /因为.*所以/.test(messageZh)) return true;

  return false;
}

/**
 * Automated mission detector for target SRS vocab & target grammar points.
 */
export function detectCompletedMissions(
  userMessageZh = '',
  targetVocabWords = [],
  targetGrammarPoints = []
) {
  const cleanMsg = String(userMessageZh || '').trim();
  const newlyUsedVocab = [];
  const updatedVocab = targetVocabWords.map((item) => {
    const word = item?.simplified || item?.hanzi || '';
    if (word && cleanMsg.includes(word)) {
      if (!item.used) newlyUsedVocab.push(word);
      return { ...item, used: true };
    }
    return { ...item, used: Boolean(item?.used) };
  });

  const newlyMatchedGrammar = [];
  const updatedGrammar = targetGrammarPoints.map((g) => {
    if (matchesGrammarPattern(cleanMsg, g)) {
      if (!g.used) newlyMatchedGrammar.push(g.code);
      return { ...g, used: true };
    }
    return { ...g, used: Boolean(g?.used) };
  });

  const totalMissions = updatedVocab.length + updatedGrammar.length;
  const completedMissions =
    updatedVocab.filter((v) => v.used).length +
    updatedGrammar.filter((g) => g.used).length;
  const missionCompletionPct =
    totalMissions > 0
      ? Number(((completedMissions / totalMissions) * 100).toFixed(2))
      : 0;

  return {
    updatedVocab,
    updatedGrammar,
    newlyUsedVocab,
    newlyMatchedGrammar,
    missionCompletionPct,
  };
}

/**
 * Legacy-compatible offline pedagogical reply generator.
 */
export function generateOfflinePedagogicalReply(userMessage, scenario = {}, targetVocab = []) {
  const clean = (userMessage || '').trim().toLowerCase();
  const matchedVocab = targetVocab
    .filter((v) => (v.hanzi || v.simplified) && clean.includes((v.hanzi || v.simplified).toLowerCase()))
    .map((v) => v.hanzi || v.simplified);

  let replyHanzi = '我明白了，你说得很好！我们继续练习吧。';
  let replyPinyin = 'Wǒ míngbai le, nǐ shuō de hěn hǎo! Wǒmen jìxù liànxí ba.';
  let replyVietnamese = 'Tôi hiểu rồi, bạn nói rất tốt! Chúng ta tiếp tục luyện tập nhé.';
  const grammarFeedback =
    matchedVocab.length > 0
      ? `Rất xuất sắc! Bạn đã áp dụng thành công từ vựng mục tiêu: ${matchedVocab.join(', ')}.`
      : 'Câu nói rõ ràng, dễ hiểu. Bạn hãy thử kết hợp thêm các từ vựng mục tiêu trong bài nhé.';

  if (clean.includes('你好') || clean.includes('您好')) {
    replyHanzi = '你好！很高兴和你聊天。请问你今天想聊些什么？';
    replyPinyin = 'Nǐ hǎo! Hěn gāoxìng hé nǐ liáotiān. Qǐngwèn nǐ jīntiān xiǎng liáo xiē shénme?';
    replyVietnamese = 'Chào bạn! Rất vui được trò chuyện cùng bạn. Cho hỏi hôm nay bạn muốn trò chuyện về điều gì?';
  } else if (clean.includes('多少钱') || clean.includes('贵') || clean.includes('便宜')) {
    replyHanzi = '这个不算贵，质量非常好。如果你买两个，我可以给你打折。';
    replyPinyin = 'Zhè ge bù suàn guì, zhìliàng fēicháng hǎo. Rúguǒ nǐ mǎi liǎng gè, wǒ kěyǐ gěi nǐ dǎzhé.';
    replyVietnamese = 'Cái này không tính là đắt đâu, chất lượng rất tốt. Nếu bạn mua 2 cái, tôi có thể giảm giá cho bạn.';
  } else if (clean.includes('谢谢') || clean.includes('再见')) {
    replyHanzi = '不客气！祝你今天过得愉快，下次见！';
    replyPinyin = 'Bú kèqi! Zhù nǐ jīntiān guò de yúkuài, xià cì jiàn!';
    replyVietnamese = 'Không có gì! Chúc bạn một ngày vui vẻ, hẹn gặp lại lần sau!';
  } else if (clean.includes('吃') || clean.includes('菜') || clean.includes('点')) {
    replyHanzi = '好的，我们的特色菜味道特别好，你要不要尝一尝？';
    replyPinyin = 'Hǎo de, wǒmen de tèsè cài wèidào tèbié hǎo, nǐ yào bu yào cháng yi cháng?';
    replyVietnamese = 'Vâng, món đặc sản của chúng tôi vị rất ngon, bạn có muốn nếm thử một chút không?';
  }

  const suggestedReplies = [
    { hanzi: '好的，请给我一份。', pinyin: 'Hǎo de, qǐng gěi wǒ yí fèn.', vietnamese: 'Được rồi, xin cho tôi một phần.', vi: 'Được rồi, xin cho tôi một phần.' },
    { hanzi: '请问还有别的推荐吗？', pinyin: 'Qǐngwèn hái yǒu bié de tuījiàn ma?', vietnamese: 'Cho hỏi còn gợi ý nào khác không ạ?', vi: 'Cho hỏi còn gợi ý nào khác không ạ?' },
    { hanzi: '太感谢了，今天就到这里吧。', pinyin: 'Tài gǎnxiè le, jīntiān jiù dào zhèlǐ ba.', vietnamese: 'Cảm ơn nhiều lắm, hôm nay đến đây nhé.', vi: 'Cảm ơn nhiều lắm, hôm nay đến đây nhé.' },
  ];

  return {
    replyHanzi,
    replyPinyin,
    replyVietnamese,
    grammarFeedback,
    correctedHanzi: userMessage,
    usedTargetItems: matchedVocab,
    completedObjectives: matchedVocab.length > 0 ? [1, 2] : [1],
    suggestedReplies,
    mode: 'pedagogical_offline_fallback',
  };
}

function buildStructuredOfflineTurn(userMessageZh, hskLevel, missionResult) {
  const remainingWords = missionResult.updatedVocab.filter((v) => !v.used);
  const nextWord = remainingWords[0];
  const baseReply = generateOfflinePedagogicalReply(
    userMessageZh,
    {},
    missionResult.updatedVocab.map((v) => ({ hanzi: v.simplified }))
  );

  const aiReplyZh = nextWord
    ? `${baseReply.replyHanzi} 你能试着用“${nextWord.simplified}”再说一句吗？`
    : baseReply.replyHanzi;
  const aiReplyPinyin = nextWord
    ? `${baseReply.replyPinyin} Nǐ néng shìzhe yòng “${nextWord.pinyin || nextWord.simplified}” zài shuō yí jù ma?`
    : baseReply.replyPinyin;
  const aiReplyVi = nextWord
    ? `${baseReply.replyVietnamese} Bạn thử dùng từ "${nextWord.simplified}" nói thêm một câu nhé?`
    : baseReply.replyVietnamese;

  return {
    ai_reply_zh: aiReplyZh,
    ai_reply_pinyin: aiReplyPinyin,
    ai_reply_vi: aiReplyVi,
    turn_evaluation: {
      is_grammatically_correct: true,
      grammar_score: missionResult.newlyMatchedGrammar.length > 0 ? 95 : 88,
      corrected_user_sentence_zh: userMessageZh,
      explanation_vi:
        missionResult.newlyUsedVocab.length > 0
          ? `Tuyệt vời! Bạn đã dùng chuẩn từ mục tiêu: ${missionResult.newlyUsedVocab.join(', ')} (HSK ${hskLevel}).`
          : 'Câu giao tiếp tự nhiên, đúng ngữ cảnh.',
      matched_grammar_code: missionResult.newlyMatchedGrammar[0] || null,
    },
    next_turn_hints: remainingWords.slice(0, 2).map((w) => ({
      target_word_to_use: w.simplified,
      suggested_reply_zh: `我觉得“${w.simplified}”在这个情况很有用。`,
      suggested_reply_pinyin: `Wǒ juéde “${w.pinyin || w.simplified}” zài zhège qíngkuàng hěn yǒuyòng.`,
    })),
    mode: 'pedagogical_offline_fallback',
  };
}

async function handleStartSession({ user, body, admin, res }) {
  const scenarioSlug = String(body.scenarioSlug || 'beijing_market_bargain').trim();
  const hskLevel = Math.max(1, Math.min(9, Number(body.hskLevel) || 3));
  const persona = SCENARIO_PERSONAS[scenarioSlug] || SCENARIO_PERSONAS.beijing_market_bargain;

  const adaptive = await retrieveLearnerAdaptiveProfile(user.id, hskLevel, {
    supabaseClient: admin,
  });

  const targetVocabWords = adaptive.targetVocabList.slice(0, 5).map((v) => ({
    simplified: v.simplified,
    pinyin: v.pinyin,
    meaning_vi: v.meaning_vi,
    used: false,
  }));

  const targetGrammarPoints = adaptive.targetGrammarList.slice(0, 2).map((g) => ({
    code: g.code,
    pattern_display: g.pattern_display,
    title_vi: g.title_vi,
    used: false,
  }));

  let sessionId = crypto.randomUUID();
  const initialMessages = [
    {
      role: 'assistant',
      zh: persona.openingZh,
      pinyin: persona.openingPinyin,
      vi: persona.openingVi,
      created_at: new Date().toISOString(),
    },
  ];

  if (admin) {
    try {
      const { data: inserted, error } = await admin
        .from('ai_roleplay_sessions')
        .insert({
          user_id: user.id,
          scenario_slug: scenarioSlug,
          hsk_level: hskLevel,
          target_vocab_words: targetVocabWords,
          target_grammar_points: targetGrammarPoints,
          messages: initialMessages,
          mission_completion_pct: 0,
          status: 'active',
        })
        .select('id')
        .single();
      if (!error && inserted?.id) {
        sessionId = inserted.id;
      }
    } catch {
      // Fallback gracefully with ephemeral sessionId in local/test env
    }
  }

  return res.status(200).json({
    action: 'start_session',
    sessionId,
    scenarioSlug,
    scenarioTitle: persona.title,
    personaName: persona.personaName,
    hskLevel,
    target_vocab_words: targetVocabWords,
    target_grammar_points: targetGrammarPoints,
    ai_reply_zh: persona.openingZh,
    ai_reply_pinyin: persona.openingPinyin,
    ai_reply_vi: persona.openingVi,
    next_turn_hints: targetVocabWords.slice(0, 2).map((w) => ({
      target_word_to_use: w.simplified,
      suggested_reply_zh: `请问，这里有“${w.simplified}”吗？`,
      suggested_reply_pinyin: `Qǐngwèn, zhèlǐ yǒu “${w.pinyin || w.simplified}” ma?`,
    })),
  });
}

async function handleSendTurn({ user, body, admin, res }) {
  const sessionId = String(body.sessionId || '').trim();
  const userMessageZh = String(body.userMessageZh || body.userMessage || '').trim();
  const audioDurationMs = Number(body.audioDurationMs || 0);

  if (!userMessageZh || userMessageZh.length > 500 || detectAbuseOrInjection(userMessageZh)) {
    return res.status(400).json({
      error: 'Tin nhắn không hợp lệ hoặc chứa nội dung vi phạm chính sách an toàn.',
    });
  }

  let sessionRecord = null;
  if (admin && sessionId) {
    try {
      const { data } = await admin
        .from('ai_roleplay_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .maybeSingle();
      sessionRecord = data || null;
    } catch {
      sessionRecord = null;
    }
  }

  const hskLevel = Number(sessionRecord?.hsk_level || body.hskLevel || 3);
  const targetVocabWords = Array.isArray(sessionRecord?.target_vocab_words)
    ? sessionRecord.target_vocab_words
    : Array.isArray(body.targetVocabWords)
      ? body.targetVocabWords
      : [];
  const targetGrammarPoints = Array.isArray(sessionRecord?.target_grammar_points)
    ? sessionRecord.target_grammar_points
    : Array.isArray(body.targetGrammarPoints)
      ? body.targetGrammarPoints
      : [];

  const missionResult = detectCompletedMissions(
    userMessageZh,
    targetVocabWords,
    targetGrammarPoints
  );

  // Build strict structured prompt for LLM
  const remainingWords = missionResult.updatedVocab
    .filter((w) => !w.used)
    .map((w) => `${w.simplified} (${w.pinyin})`)
    .join(', ');

  const systemPrompt = [
    `Bạn là nhân vật bản ngữ Trung Quốc trong kịch bản "${sessionRecord?.scenario_slug || body.scenarioSlug || 'giao tiếp HSK'}".`,
    `Trình độ người học: HSK ${hskLevel}. Hãy trả lời tự nhiên bằng tiếng Trung vừa sức HSK ${hskLevel}.`,
    remainingWords
      ? `Khéo léo đặt câu hỏi tiếp theo để gợi ý học viên dùng các từ mục tiêu CHƯA SỬ DỤNG: ${remainingWords}.`
      : 'Học viên đã hoàn thành tất cả từ mục tiêu, hãy khen ngợi và kết thúc hội thoại tự nhiên.',
    `BẮT BUỘC trả về JSON hợp lệ theo schema: { "ai_reply_zh", "ai_reply_pinyin", "ai_reply_vi", "turn_evaluation": { "is_grammatically_correct", "grammar_score", "corrected_user_sentence_zh", "explanation_vi", "matched_grammar_code" }, "next_turn_hints": [{ "target_word_to_use", "suggested_reply_zh", "suggested_reply_pinyin" }] }.`,
  ].join('\n');

  let aiPayload = null;
  const llmResult = await callUnifiedAiProvider({
    systemPrompt,
    userPrompt: `Học viên nói: "${userMessageZh}" (thời lượng audio: ${audioDurationMs}ms).`,
    temperature: 0.4,
    maxTokens: 700,
    feature: 'roleplay',
  });

  if (llmResult?.ok && llmResult.text) {
    aiPayload = extractStructuredJson(llmResult.text);
  }

  if (!aiPayload || !aiPayload.ai_reply_zh) {
    aiPayload = buildStructuredOfflineTurn(userMessageZh, hskLevel, missionResult);
  }

  // Award SRS mastery if turn is grammatically valid and new target words were used
  const isGrammaticallyCorrect =
    aiPayload?.turn_evaluation?.is_grammatically_correct !== false;
  if (admin && isGrammaticallyCorrect && missionResult.newlyUsedVocab.length > 0) {
    await Promise.all(
      missionResult.newlyUsedVocab.map((word) =>
        Promise.resolve(
          admin.rpc('update_vocab_dimension_score', {
            p_user_id: user.id,
            p_simplified: word,
            p_dimension: 'meaning',
            p_score: 90,
          })
        ).catch(() => {})
      )
    );
  }

  // Persist updated session state
  if (admin && sessionRecord?.id) {
    const nextMessages = [
      ...(Array.isArray(sessionRecord.messages) ? sessionRecord.messages : []),
      { role: 'user', zh: userMessageZh, audio_duration_ms: audioDurationMs, created_at: new Date().toISOString() },
      {
        role: 'assistant',
        zh: aiPayload.ai_reply_zh,
        pinyin: aiPayload.ai_reply_pinyin,
        vi: aiPayload.ai_reply_vi,
        turn_evaluation: aiPayload.turn_evaluation,
        created_at: new Date().toISOString(),
      },
    ];
    const isCompleted = missionResult.missionCompletionPct >= 100;
    Promise.resolve(
      admin
        .from('ai_roleplay_sessions')
        .update({
          target_vocab_words: missionResult.updatedVocab,
          target_grammar_points: missionResult.updatedGrammar,
          messages: nextMessages,
          mission_completion_pct: missionResult.missionCompletionPct,
          grammar_accuracy_score: Number(aiPayload?.turn_evaluation?.grammar_score || 85),
          status: isCompleted ? 'completed' : 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionRecord.id)
    ).catch(() => {});
  }

  return res.status(200).json({
    action: 'send_turn',
    sessionId: sessionId || null,
    ...aiPayload,
    target_vocab_words: missionResult.updatedVocab,
    target_grammar_points: missionResult.updatedGrammar,
    newly_used_vocab: missionResult.newlyUsedVocab,
    newly_matched_grammar: missionResult.newlyMatchedGrammar,
    mission_completion_pct: missionResult.missionCompletionPct,
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-User-Id');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  try {
    // 1. Zero-Trust Auth
    const auth = await verifyRequestAuth(req);
    if (!auth.authenticated || !auth.user) {
      return res.status(401).json({
        error: 'Unauthorized: Vui lòng đăng nhập với Bearer Token hợp lệ để sử dụng AI Roleplay Studio.',
      });
    }

    // 2. Distributed Rate Limit & Quota
    const rateCheck = await checkRateLimitAndQuota({
      clientKey: auth.user.id,
      windowMs: RATE_LIMIT_WINDOW_MS,
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      dailyQuotaMax: DAILY_QUOTA_MAX_REQUESTS,
      prefix: 'roleplay',
    });

    if (!rateCheck.allowed) {
      return res.status(rateCheck.statusCode || 429).json({
        error: rateCheck.reason || 'Bạn đã vượt quá giới hạn lượt sử dụng AI Roleplay.',
      });
    }

    const body = req.body || {};
    const admin = getSupabaseAdminClient();

    if (body.action === 'start_session') {
      return handleStartSession({ user: auth.user, body, admin, res });
    }

    if (body.action === 'send_turn') {
      return handleSendTurn({ user: auth.user, body, admin, res });
    }

    // 3. Legacy Stateless Roleplay Mode (backward compatibility)
    const userMessage = String(body.userMessage || '').trim();
    if (!userMessage || userMessage.length > 500 || detectAbuseOrInjection(userMessage)) {
      return res.status(400).json({
        error: 'Tin nhắn không hợp lệ hoặc chứa nội dung vi phạm chính sách an toàn.',
      });
    }

    const scenario = body.scenario || {};
    const targetVocab = Array.isArray(body.targetVocab) ? body.targetVocab : [];
    const hskLevel = Number(body.hskLevel || scenario.hskLevel || 3);

    const llmRes = await callUnifiedAiProvider({
      systemPrompt: `Bạn là nhân vật bản ngữ Trung Quốc trong kịch bản "${scenario.title || 'Giao tiếp'}". Trình độ HSK ${hskLevel}. Trả về JSON gồm replyHanzi, replyPinyin, replyVietnamese, grammarFeedback, correctedHanzi, usedTargetItems, completedObjectives, suggestedReplies.`,
      userPrompt: userMessage,
      temperature: 0.4,
      maxTokens: 600,
      feature: 'roleplay',
    });

    if (llmRes?.ok && llmRes.text) {
      const parsed = extractStructuredJson(llmRes.text);
      if (parsed?.replyHanzi) {
        return res.status(200).json(parsed);
      }
    }

    return res.status(200).json(generateOfflinePedagogicalReply(userMessage, scenario, targetVocab));
  } catch {
    return res.status(200).json(
      generateOfflinePedagogicalReply(req.body?.userMessage || req.body?.userMessageZh || '', req.body?.scenario, [])
    );
  }
}
