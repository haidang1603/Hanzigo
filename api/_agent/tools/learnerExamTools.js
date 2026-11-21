/**
 * =========================================================================
 * HANZIGO — LÃO SƯ AI AGENT: LEARNER, EXAM & SAFE-WRITE PROPOSAL TOOLS
 * =========================================================================
 * Medium-risk / context-sensitive tools with strict RBAC binding to
 * server-verified executionContext.user.id, CBT anti-answer-leakage guard,
 * and Human-in-the-Loop confirmation for any write proposal.
 */

import {
  RISK_LEVELS,
  createPendingConfirmationContract,
  createUiActionContract,
} from '../contracts.js';
import { redactSensitiveData } from '../guardrails.js';
import { retrieveLearnerAdaptiveProfile } from '../../_utils/ragRetriever.js';
import { HSK_QUESTIONS } from '../../../src/data/hskExamsData.js';

function requireAuthenticatedUser(context, args = {}) {
  const verifiedUserId = context?.user?.id;
  if (!verifiedUserId) {
    return {
      allowed: false,
      reason: 'Vui lòng đăng nhập để sử dụng công cụ dữ liệu học tập cá nhân.',
    };
  }
  if (args?.userId && String(args.userId) !== String(verifiedUserId)) {
    return {
      allowed: false,
      reason: 'Không được phép truy cập dữ liệu của học viên khác (cross-user IDOR blocked).',
    };
  }
  return { allowed: true };
}

function parseNumericHsk(hskLevel = 'HSK 1') {
  const m = String(hskLevel || '').match(/(\d+)/);
  const n = m ? Number.parseInt(m[1], 10) : 1;
  return Math.max(1, Math.min(9, n));
}

/**
 * 1. get_learner_adaptive_profile (Medium-risk · Read-Only Personal Data)
 */
export const getLearnerAdaptiveProfileTool = {
  name: 'get_learner_adaptive_profile',
  description: 'Lấy hồ sơ học tập cá nhân hóa của chính học viên đang đăng nhập (từ SRS đến hạn, ngữ pháp yếu, chữ Hán hay sai).',
  riskLevel: RISK_LEVELS.MEDIUM,
  permissionGuard: requireAuthenticatedUser,
  parameters: {
    type: 'object',
    properties: {
      hskLevel: { type: 'string', description: 'Cấp độ HSK mục tiêu.', maxLength: 20 },
      userId: { type: 'string', description: 'Không cần truyền; nếu truyền khác user hiện tại sẽ bị từ chối.', maxLength: 80 },
    },
    required: [],
  },
  async execute(args, context) {
    const verifiedUserId = String(context.user.id);
    const numericHsk = parseNumericHsk(args.hskLevel || context.user?.hskLevel || 'HSK 1');

    const profile = await retrieveLearnerAdaptiveProfile(verifiedUserId, numericHsk, {
      supabaseClient: context?.supabaseClient || null,
    });

    const sanitizedSummary = redactSensitiveData({
      hskLevel: `HSK ${numericHsk}`,
      dueVocabCount: profile?.targetVocabList?.length || 0,
      dueVocabSample: (profile?.targetVocabList || []).slice(0, 5),
      weakGrammarCount: profile?.targetGrammarList?.length || 0,
      weakGrammarSample: (profile?.targetGrammarList || []).slice(0, 4),
      problematicHanzi: (profile?.problematicHanzi || []).slice(0, 5),
      hasSparseData:
        (profile?.targetVocabList?.length || 0) === 0 &&
        (profile?.targetGrammarList?.length || 0) === 0 &&
        (profile?.problematicHanzi?.length || 0) === 0,
    });

    return {
      data: sanitizedSummary,
      sources: [
        {
          sourceId: 'rpc:get_user_adaptive_ai_context',
          title: 'Hồ sơ học tập cá nhân hóa HanziGo',
          type: 'learner_profile',
          verified: true,
        },
      ],
    };
  },
};

/**
 * 2. inspect_hsk_exam_question (Low/Medium-risk · Read-Only Exam Context)
 * Strictly hides answers when executionContext.isActiveExamSession === true.
 */
export const inspectHskExamQuestionTool = {
  name: 'inspect_hsk_exam_question',
  description: 'Xem ngữ liệu câu hỏi đề thi HSK để giải thích phương pháp hoặc phân tích lỗi sai sau khi nộp bài.',
  riskLevel: RISK_LEVELS.LOW,
  parameters: {
    type: 'object',
    properties: {
      examId: { type: 'string', description: 'Mã đề thi HSK (ví dụ hsk1-mock-01).', maxLength: 60 },
      questionId: { type: 'string', description: 'Mã câu hỏi HSK (ví dụ q-hsk1-01-01).', maxLength: 80 },
    },
    required: [],
  },
  async execute(args, context = {}) {
    const examId = String(args.examId || '').trim();
    const questionId = String(args.questionId || '').trim();
    if (!examId && !questionId) {
      return {
        data: { found: false, reason: 'Cần cung cấp examId hoặc questionId.' },
        sources: [],
      };
    }

    let question = null;
    let sourceMeta = null;

    // 2a. Check Supabase hsk_question_bank if configured
    if (context?.supabaseClient && questionId) {
      try {
        const { data } = await context.supabaseClient
          .from('hsk_question_bank')
          .select('id, paper_code, hsk_level, section, question_number_start, question_type, stimulus_payload, sub_questions, target_vocab, target_grammar_codes')
          .eq('id', questionId)
          .maybeSingle();
        if (data) {
          question = {
            id: data.id,
            exam_id: data.paper_code,
            part_type: data.section,
            question_number: data.question_number_start,
            prompt: data.stimulus_payload?.prompt || data.stimulus_payload?.text || '',
            options: data.stimulus_payload?.options || [],
            target_grammar_codes: data.target_grammar_codes || [],
            correct_answer: data.sub_questions?.[0]?.correct_answer ?? null,
            explanation: data.sub_questions?.[0]?.explanation ?? null,
          };
          sourceMeta = {
            sourceId: `hsk_question_bank:${data.id}`,
            title: `Đề ${data.paper_code} (#${data.question_number_start})`,
            type: 'hsk_exam',
            verified: true,
          };
        }
      } catch {
        // Fallback to local dataset
      }
    }

    // 2b. Fallback to local HSK_QUESTIONS dataset
    if (!question) {
      const foundLocal = HSK_QUESTIONS.find((q) => {
        if (questionId && q.id === questionId) return true;
        if (!questionId && examId && q.exam_id === examId) return true;
        return false;
      });

      if (foundLocal) {
        question = foundLocal;
        sourceMeta = {
          sourceId: `hsk_exams:${foundLocal.exam_id}:${foundLocal.id}`,
          title: `Câu hỏi ${foundLocal.id} (${foundLocal.exam_id})`,
          type: 'hsk_exam',
          verified: true,
        };
      }
    }

    if (!question) {
      return { data: { found: false, question: null }, sources: [] };
    }

    const isActiveExam = Boolean(context?.isActiveExamSession);
    if (isActiveExam) {
      // STRICT CBT ANTI-ANSWER-LEAKAGE: strip all answer/explanation fields
      return {
        data: {
          found: true,
          answerHidden: true,
          examSessionGuard: 'active_exam_session_no_answer_leakage',
          question: {
            id: question.id,
            exam_id: question.exam_id,
            part_type: question.part_type,
            question_number: question.question_number,
            prompt: question.prompt,
            pinyin: question.pinyin || null,
            options: Array.isArray(question.options) ? question.options : [],
          },
          methodHint: 'Đang trong phiên thi CBT: hãy đọc kỹ từ khóa, xác định ngữ cảnh và loại trừ phương án sai. Đáp án chỉ hiển thị sau khi nộp bài.',
        },
        sources: sourceMeta ? [sourceMeta] : [],
      };
    }

    const resolvedCorrectAnswer =
      question.correct_answer ??
      (typeof question.correct_option_index === 'number' && Array.isArray(question.options)
        ? question.options[question.correct_option_index]
        : null);

    return {
      data: {
        found: true,
        answerHidden: false,
        question: {
          id: question.id,
          exam_id: question.exam_id,
          part_type: question.part_type,
          question_number: question.question_number,
          prompt: question.prompt,
          pinyin: question.pinyin || null,
          translation: question.translation || null,
          options: Array.isArray(question.options) ? question.options : [],
          correct_option_index: question.correct_option_index ?? null,
          correct_answer: resolvedCorrectAnswer,
          explanation: question.explanation || null,
          target_grammar_codes: question.target_grammar_codes || [],
        },
      },
      sources: sourceMeta ? [sourceMeta] : [],
    };
  },
};

/**
 * 3. generate_study_prescription (Medium-risk · Read-Only Recommendation)
 */
export const generateStudyPrescriptionTool = {
  name: 'generate_study_prescription',
  description: 'Kê đơn tối đa 3-4 nhiệm vụ ôn tập ưu tiên hôm nay dựa trên hồ sơ thật của học viên kèm nút điều hướng.',
  riskLevel: RISK_LEVELS.MEDIUM,
  permissionGuard: requireAuthenticatedUser,
  parameters: {
    type: 'object',
    properties: {
      hskLevel: { type: 'string', description: 'Cấp độ HSK mục tiêu.', maxLength: 20 },
      userId: { type: 'string', description: 'Không cần truyền; nếu truyền khác user hiện tại sẽ bị từ chối.', maxLength: 80 },
    },
    required: [],
  },
  async execute(args, context) {
    const verifiedUserId = String(context.user.id);
    const numericHsk = parseNumericHsk(args.hskLevel || context.user?.hskLevel || 'HSK 1');

    const profile = await retrieveLearnerAdaptiveProfile(verifiedUserId, numericHsk, {
      supabaseClient: context?.supabaseClient || null,
    });

    const prescriptions = [];
    const uiActions = [];

    if ((profile?.targetVocabList?.length || 0) > 0) {
      prescriptions.push({
        id: 'rx-srs-vocab',
        priority: 'high',
        title: `Ôn tập ${profile.targetVocabList.length} từ vựng SRS đến hạn`,
        reason: 'Các từ này đang đến chu kỳ rơi trí nhớ hoặc có số lần quên cao.',
        route: '#vocabulary',
      });
      uiActions.push(
        createUiActionContract({
          type: 'navigate',
          key: 'vocabulary',
          label: 'Mở Thẻ Từ Vựng SRS',
          route: '#vocabulary',
        })
      );
    }

    if ((profile?.targetGrammarList?.length || 0) > 0) {
      const topG = profile.targetGrammarList[0];
      prescriptions.push({
        id: 'rx-weak-grammar',
        priority: 'high',
        title: `Củng cố ngữ pháp: ${topG.pattern_display || topG.code}`,
        reason: topG.title_vi || 'Điểm ngữ pháp cần luyện thêm từ kết quả bài tập.',
        route: '#lesson',
      });
      uiActions.push(
        createUiActionContract({
          type: 'navigate',
          key: 'lesson',
          label: 'Luyện Bài Học Lộ Trình',
          route: '#lesson',
        })
      );
    }

    if ((profile?.problematicHanzi?.length || 0) > 0) {
      const topChar = profile.problematicHanzi[0];
      prescriptions.push({
        id: 'rx-writing-hanzi',
        priority: 'medium',
        title: `Luyện viết lại chữ ${topChar.character} (${topChar.avg_accuracy}%)`,
        reason: 'Độ chính xác bút thuận còn thấp trong các lần tập viết gần đây.',
        route: '#writing',
      });
      uiActions.push(
        createUiActionContract({
          type: 'navigate',
          key: 'writing',
          label: `Luyện Viết Chữ ${topChar.character}`,
          route: '#writing',
        })
      );
    }

    // Cold-start deterministic defaults so new learners always get 3-4 actionable items
    if (prescriptions.length === 0) {
      prescriptions.push(
        {
          id: 'rx-cold-lesson',
          priority: 'high',
          title: `Bắt đầu bài học lộ trình HSK ${numericHsk}`,
          reason: 'Chưa có lịch sử luyện tập; nên khởi động từ bài học nền tảng.',
          route: '#lesson',
        },
        {
          id: 'rx-cold-pronunciation',
          priority: 'medium',
          title: 'Luyện phát âm & 4 thanh điệu chuẩn',
          reason: 'Xây nền tảng nghe-nói chuẩn ngay từ đầu.',
          route: '#pronunciation',
        },
        {
          id: 'rx-cold-vocab',
          priority: 'medium',
          title: 'Làm quen thẻ từ vựng cốt lõi',
          reason: 'Tạo bộ thẻ SRS đầu tiên để ghi nhớ lâu dài.',
          route: '#vocabulary',
        }
      );
      uiActions.push(
        createUiActionContract({ type: 'navigate', key: 'lesson', label: 'Vào Bài Học', route: '#lesson' }),
        createUiActionContract({ type: 'navigate', key: 'pronunciation', label: 'Luyện Phát Âm', route: '#pronunciation' }),
        createUiActionContract({ type: 'navigate', key: 'vocabulary', label: 'Học Từ Vựng', route: '#vocabulary' })
      );
    }

    return {
      data: {
        hskLevel: `HSK ${numericHsk}`,
        isColdStart:
          (profile?.targetVocabList?.length || 0) === 0 &&
          (profile?.targetGrammarList?.length || 0) === 0 &&
          (profile?.problematicHanzi?.length || 0) === 0,
        prescriptions: prescriptions.slice(0, 4),
        uiActions: uiActions.slice(0, 4),
      },
      sources: [
        {
          sourceId: 'engine:study_prescription',
          title: 'Đơn ôn tập cá nhân hóa HanziGo',
          type: 'recommendation',
          verified: true,
        },
      ],
    };
  },
};

/**
 * 4. suggest_save_vocab_to_srs (Medium-risk · Safe-Write Human-in-the-Loop)
 * NEVER writes directly to DB; returns pendingConfirmation for UI user approval.
 */
export const suggestSaveVocabToSrsTool = {
  name: 'suggest_save_vocab_to_srs',
  description: 'Tạo đề xuất lưu từ vựng vào sổ ôn tập SRS (chờ người học bấm xác nhận trên giao diện, không tự ghi DB).',
  riskLevel: RISK_LEVELS.MEDIUM,
  permissionGuard: requireAuthenticatedUser,
  parameters: {
    type: 'object',
    properties: {
      hanzi: { type: 'string', description: 'Từ chữ Hán giản thể cần lưu.', maxLength: 32 },
      pinyin: { type: 'string', description: 'Phiên âm Pinyin có dấu.', maxLength: 80 },
      meaning: { type: 'string', description: 'Nghĩa tiếng Việt ngắn gọn.', maxLength: 200 },
      hskLevel: { type: 'string', description: 'Cấp độ HSK.', maxLength: 20 },
      userId: { type: 'string', description: 'Không cần truyền; nếu truyền khác user hiện tại sẽ bị từ chối.', maxLength: 80 },
    },
    required: ['hanzi', 'meaning'],
  },
  async execute(args, context) {
    const hanzi = String(args.hanzi || '').trim();
    if (!/[\u4e00-\u9fa5\u3400-\u4dbf]/.test(hanzi)) {
      throw new Error('Từ vựng đề xuất lưu phải chứa chữ Hán hợp lệ.');
    }

    const pendingConfirmation = createPendingConfirmationContract({
      actionType: 'save_vocab_to_srs',
      label: `Lưu "${hanzi}" vào sổ từ vựng SRS`,
      riskLevel: RISK_LEVELS.MEDIUM,
      requiresConfirmation: true,
      payload: {
        userId: String(context.user.id),
        hanzi,
        pinyin: String(args.pinyin || '').trim(),
        meaning: String(args.meaning || '').trim(),
        hskLevel: String(args.hskLevel || 'HSK 1').trim(),
      },
    });

    return {
      data: {
        savedDirectly: false,
        pendingConfirmation,
      },
      sources: [
        {
          sourceId: `proposal:save_vocab_srs:${hanzi}`,
          title: `Đề xuất lưu từ ${hanzi} vào SRS`,
          type: 'safe_write_proposal',
          verified: true,
        },
      ],
    };
  },
};

export const LEARNER_EXAM_TOOLS = Object.freeze([
  getLearnerAdaptiveProfileTool,
  inspectHskExamQuestionTool,
  generateStudyPrescriptionTool,
  suggestSaveVocabToSrsTool,
]);

export function registerLearnerExamTools(registry) {
  for (const tool of LEARNER_EXAM_TOOLS) {
    registry.register(tool);
  }
  return registry;
}
