/**
 * =========================================================================
 * VERIFIABLE HSK CERTIFICATE ENGINE
 * =========================================================================
 * Quản lý điều kiện tốt nghiệp và cấp phát chứng nhận hoàn thành cấp độ HSK:
 * 1. Graduation Gatekeeper:
 *    - Điều kiện 1: Hoàn thành 100% số bài học của cấp độ HSK tương ứng (20/20 bài).
 *    - Điều kiện 2: Đạt kết quả thi thử HSK cấp độ đó với điểm số >= 80% (hoặc >= 180/200, >= 240/300).
 * 2. Deterministic Certificate ID Generator:
 *    - Sinh mã định danh chống giả mạo: HZG-HSK[Level]-[YYYYMMDD]-[DeterministicHash8Chars]
 *    - Băm xác định dựa trên userId + level + ngày cấp + điểm số.
 * 3. Certificate Registry & Verification:
 *    - Lưu trữ cục bộ & đồng bộ bảng public.issued_certificates trên Supabase.
 *    - Cung cấp hàm tra cứu xác thực công khai cho nhà tuyển dụng/giáo viên.
 * =========================================================================
 */

import { supabase, isSupabaseConfigured } from '../supabase/config.js';

export const HSK_LEVEL_LESSON_RANGES = {
  'HSK 1': { minLessonNum: 101, maxLessonNum: 120, totalRequired: 20 },
  'HSK 2': { minLessonNum: 201, maxLessonNum: 220, totalRequired: 20 },
  'HSK 3': { minLessonNum: 301, maxLessonNum: 320, totalRequired: 20 },
  'HSK 4': { minLessonNum: 401, maxLessonNum: 420, totalRequired: 20 },
  'HSK 5': { minLessonNum: 501, maxLessonNum: 520, totalRequired: 20 },
  'HSK 6': { minLessonNum: 601, maxLessonNum: 620, totalRequired: 20 }
};

export const CERTIFICATES_STORAGE_KEY = 'hanzigo_issued_certificates';

/**
 * Hàm băm chuỗi xác định (Deterministic DJB2 + FNV-1a Hash) tạo chuỗi hex 8 ký tự viết hoa.
 * Hoạt động trơn tru trên cả Browser và Node.js mà không cần import thêm thư viện ngoài.
 */
export function generateDeterministicHash8(inputString) {
  let hash1 = 5381;
  let hash2 = 2166136261;

  for (let i = 0; i < inputString.length; i++) {
    const charCode = inputString.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) ^ charCode;
    hash2 = (hash2 ^ charCode) * 16777619;
  }

  // Kết hợp hai giá trị băm 32-bit thành chuỗi hex 8 ký tự
  const combined = ((hash1 >>> 0) ^ (hash2 >>> 0)) >>> 0;
  return combined.toString(16).padStart(8, '0').toUpperCase();
}

/**
 * Sinh mã chứng nhận chuẩn quốc tế:
 * Định dạng: HZG-HSK[Level]-[YYYYMMDD]-[DeterministicHash8Chars]
 * Ví dụ: HZG-HSK1-20261025-A7B8C9D0
 */
export function generateCertificateId({
  userId,
  hskLevel,
  issueDateStr, // YYYY-MM-DD
  examScore = 100
}) {
  const cleanLevel = String(hskLevel || 'HSK 1').replace(/\s+/g, '').toUpperCase();
  const dateCompact = String(issueDateStr || '20261025').replace(/-/g, '');
  const seed = `${userId || 'guest'}_${cleanLevel}_${dateCompact}_${examScore}`;
  const hash8 = generateDeterministicHash8(seed);

  return `HZG-${cleanLevel}-${dateCompact}-${hash8}`;
}

/**
 * Kiểm tra điều kiện tốt nghiệp cấp độ HSK của học viên (Graduation Gatekeeper)
 */
export function checkGraduationEligibility({
  hskLevel = 'HSK 1',
  completedLessonIds = [],
  examAttempts = []
} = {}) {
  const config = HSK_LEVEL_LESSON_RANGES[hskLevel] || HSK_LEVEL_LESSON_RANGES['HSK 1'];
  
  // 1. Kiểm tra 20/20 bài học hoàn thành
  const completedSet = new Set(
    (Array.isArray(completedLessonIds) ? completedLessonIds : [])
      .map(id => String(id).toLowerCase().trim())
  );

  let completedLevelLessonsCount = 0;
  for (let i = config.minLessonNum; i <= config.maxLessonNum; i++) {
    const lessonKey = `l-${i}`;
    if (completedSet.has(lessonKey)) {
      completedLevelLessonsCount++;
    }
  }

  const isLessonsCompleted = completedLevelLessonsCount >= config.totalRequired;
  const lessonsProgressPercent = Math.min(100, Math.round((completedLevelLessonsCount / config.totalRequired) * 100));

  // 2. Kiểm tra điểm thi thử HSK tương ứng (>= 80%)
  const cleanLevelLower = hskLevel.toLowerCase().replace(/\s+/g, '');
  const relevantAttempts = (Array.isArray(examAttempts) ? examAttempts : []).filter(att => {
    if (!att) return false;
    const examId = String(att.examId || att.exam_id || '').toLowerCase();
    const attLevel = String(att.level || '').toLowerCase().replace(/\s+/g, '');
    return examId.includes(cleanLevelLower) || attLevel === cleanLevelLower;
  });

  let bestExamScore = 0;
  let bestPercentage = 0;
  let hasPassedExam = false;

  relevantAttempts.forEach(att => {
    const accuracy = typeof att.accuracyPercentage === 'number' 
      ? att.accuracyPercentage 
      : (typeof att.percentage === 'number' ? att.percentage : 0);
    const score = typeof att.score === 'number' ? att.score : 0;
    
    if (accuracy > bestPercentage) {
      bestPercentage = accuracy;
    }
    if (score > bestExamScore) {
      bestExamScore = score;
    }
    if (accuracy >= 80 || att.passed === true) {
      hasPassedExam = true;
    }
  });

  const isEligible = isLessonsCompleted && hasPassedExam;

  const reasons = [];
  if (!isLessonsCompleted) {
    const missing = config.totalRequired - completedLevelLessonsCount;
    reasons.push(`Chưa hoàn thành đủ 20 bài học của cấp độ ${hskLevel} (Hiện đạt ${completedLevelLessonsCount}/20 bài, còn thiếu ${missing} bài).`);
  }
  if (!hasPassedExam) {
    reasons.push(`Chưa vượt qua Đề thi thử ${hskLevel} với điểm chuẩn tối thiểu >= 80% (Điểm cao nhất hiện tại: ${bestPercentage}%).`);
  }

  return {
    isEligible,
    hskLevel,
    completedLessons: completedLevelLessonsCount,
    totalRequiredLessons: config.totalRequired,
    lessonsProgressPercent,
    isLessonsCompleted,
    bestExamPercentage: bestPercentage,
    bestExamScore,
    hasPassedExam,
    reasons
  };
}

/**
 * Cấp và lưu trữ chứng nhận sau khi đã qua cổng kiểm tra (Graduation Gatekeeper)
 */
export async function issueHskCertificate({
  user,
  hskLevel = 'HSK 1',
  completedLessonIds = [],
  examAttempts = [],
  issueDate = new Date()
}) {
  const eligibility = checkGraduationEligibility({
    hskLevel,
    completedLessonIds,
    examAttempts
  });

  if (!eligibility.isEligible) {
    return {
      success: false,
      error: 'NOT_ELIGIBLE',
      message: 'Học viên chưa đủ điều kiện tốt nghiệp cấp độ HSK này.',
      details: eligibility.reasons
    };
  }

  const userId = user?.uid || user?.id || 'guest';
  const userName = user?.name || user?.displayName || user?.email?.split('@')[0] || 'Học viên HanziGo';
  
  const y = issueDate.getFullYear();
  const m = String(issueDate.getMonth() + 1).padStart(2, '0');
  const d = String(issueDate.getDate()).padStart(2, '0');
  const issueDateStr = `${y}-${m}-${d}`;

  // 1. Nếu có kết nối mạng và tài khoản đăng nhập, thử cấp phát qua Server Authoritative API
  if (typeof fetch !== 'undefined' && user && (user.token || user.access_token)) {
    try {
      const token = user.token || user.access_token;
      const resp = await fetch('/api/hsk/issue-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hskLevel,
          completedLessonIds,
          examAttempts
        })
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json.success && json.certificate) {
          // Lưu vào localStorage bản sao để tra cứu offline
          try {
            if (typeof localStorage !== 'undefined') {
              const raw = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
              const list = raw ? JSON.parse(raw) : [];
              const idx = list.findIndex(c => c.id === json.certificate.id);
              if (idx >= 0) list[idx] = json.certificate;
              else list.push(json.certificate);
              localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(list));
            }
          } catch {}
          return { success: true, certificate: json.certificate };
        }
      }
    } catch (e) {
      console.warn('Server certificate issuance notice, falling back to local simulation:', e);
    }
  }

  const certificateId = generateCertificateId({
    userId,
    hskLevel,
    issueDateStr,
    examScore: eligibility.bestExamPercentage
  });

  const certificateData = {
    id: certificateId,
    certificateCode: certificateId,
    userId,
    userName,
    displayName: userName,
    hskLevel,
    issueDate: issueDateStr,
    examScore: eligibility.bestExamScore,
    examPercentage: eligibility.bestExamPercentage,
    completedLessonsCount: eligibility.completedLessons,
    isRevoked: false,
    disclaimer: HANZIGO_CERTIFICATE_DISCLAIMER,
    verificationUrl: `https://hanzigo-xi.vercel.app/verify?code=${certificateId}`,
    createdAt: new Date().toISOString()
  };

  // Lưu trữ cục bộ localStorage (Dành cho chế độ Local Simulation / Offline)
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const existingIdx = list.findIndex(c => c.id === certificateId);
      if (existingIdx >= 0) {
        list[existingIdx] = certificateData;
      } else {
        list.push(certificateData);
      }
      localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.warn('Lỗi khi lưu chứng nhận vào localStorage:', e);
  }

  // Đồng bộ lên Supabase nếu có cấu hình
  try {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('issued_certificates').upsert({
        certificate_code: certificateId,
        user_id: userId !== 'guest' ? userId : null,
        user_name: userName,
        hsk_level: hskLevel,
        exam_percentage: eligibility.bestExamPercentage,
        issue_date: issueDateStr,
        is_revoked: false,
        metadata: {
          completedLessonsCount: eligibility.completedLessons,
          disclaimer: HANZIGO_CERTIFICATE_DISCLAIMER
        }
      }, { onConflict: 'certificate_code' });
    }
  } catch (err) {
    console.warn('Supabase certificate sync notice:', err);
  }

  return {
    success: true,
    certificate: certificateData
  };
}

/**
 * Lấy danh sách các chứng nhận đã được cấp cho người dùng hiện tại
 * Kết hợp từ bộ nhớ cục bộ (localStorage) và truy vấn Supabase với RLS
 */
export async function getUserIssuedCertificates(user) {
  let localCerts = [];
  try {
    const raw = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
    if (raw) localCerts = JSON.parse(raw) || [];
  } catch {}

  const userId = user?.id || user?.uid;
  if (!userId || userId === 'guest' || !isSupabaseConfigured || !supabase) {
    return localCerts;
  }

  try {
    const { data, error } = await supabase
      .from('issued_certificates')
      .select('certificate_code, user_name, hsk_level, exam_percentage, issue_date, is_revoked, revoked_at, revocation_reason, metadata')
      .eq('user_id', userId);

    if (!error && Array.isArray(data)) {
      const mergedMap = new Map();
      localCerts.forEach(c => {
        const code = c?.certificateCode || c?.id;
        if (code) mergedMap.set(code, c);
      });

      data.forEach(row => {
        const certObj = {
          id: row.certificate_code,
          certificateCode: row.certificate_code,
          userName: row.user_name,
          displayName: row.user_name,
          hskLevel: row.hsk_level,
          examPercentage: row.exam_percentage,
          issueDate: row.issue_date,
          isRevoked: Boolean(row.is_revoked),
          revokedAt: row.revoked_at,
          revocationReason: row.revocation_reason,
          disclaimer: HANZIGO_CERTIFICATE_DISCLAIMER,
          verificationUrl: `https://hanzigo-xi.vercel.app/verify?code=${row.certificate_code}`
        };
        mergedMap.set(row.certificate_code, certObj);
      });

      const mergedList = Array.from(mergedMap.values());
      try {
        localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(mergedList));
      } catch {}
      return mergedList;
    }
  } catch (err) {
    console.warn('[certificateEngine] Cloud sync error:', err?.message);
  }

  return localCerts;
}

export const HANZIGO_CERTIFICATE_DISCLAIMER =
  'Chứng nhận hoàn thành chương trình đào tạo Hán ngữ HanziGo. Không thay thế chứng chỉ HSK quốc tế do CTI / Hanban cấp.';

/**
 * Tra cứu và xác minh tính hợp lệ của mã chứng nhận (Minimal Disclosure)
 */
export async function verifyCertificate(certificateCode) {
  if (!certificateCode || typeof certificateCode !== 'string') {
    return { 
      isValid: false, 
      status: 'invalid_code',
      message: 'Mã chứng nhận không được để trống.' 
    };
  }

  const cleanCode = certificateCode.trim().toUpperCase();

  // Kiểm tra định dạng Regex: HZG-HSK[1-6]-YYYYMMDD-[A-F0-9]{8}
  const certRegex = /^HZG-HSK([1-6])-(\d{8})-([A-F0-9]{8})$/;
  const match = cleanCode.match(certRegex);
  if (!match) {
    return {
      isValid: false,
      status: 'invalid_format',
      message: 'Định dạng mã chứng nhận không hợp lệ. Chuẩn định dạng: HZG-HSK[Cấp]-[Ngày]-[8KýTựHex].'
    };
  }

  // 1. Thử gọi API backend chuyên dụng nếu có trong môi trường Web
  if (typeof fetch !== 'undefined') {
    try {
      const resp = await fetch(`/api/hsk/verify-certificate?code=${encodeURIComponent(cleanCode)}`);
      if (resp.ok) {
        const data = await resp.json();
        return data;
      }
    } catch {}
  }

  // 2. Thử tra cứu trên Supabase nếu đã cấu hình
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('issued_certificates')
        .select('certificate_code, user_name, hsk_level, issue_date, is_revoked, revoked_at, revocation_reason')
        .eq('certificate_code', cleanCode)
        .maybeSingle();

      if (!error && data) {
        if (data.is_revoked) {
          return {
            isValid: false,
            status: 'revoked',
            message: `Chứng nhận này ĐÃ BỊ THU HỒI bởi Hội đồng Khảo thí HanziGo: ${data.revocation_reason || 'Vi phạm điều lệ hoặc dữ liệu không chính xác.'}`,
            certificate: {
              certificateCode: data.certificate_code,
              displayName: data.user_name,
              hskLevel: data.hsk_level,
              issueDate: data.issue_date,
              isRevoked: true,
              revokedAt: data.revoked_at,
              revocationReason: data.revocation_reason,
              disclaimer: HANZIGO_CERTIFICATE_DISCLAIMER
            }
          };
        }

        return {
          isValid: true,
          status: 'valid',
          message: 'Chứng nhận hợp lệ và đã được xác thực bởi Hệ thống Khảo thí HanziGo.',
          certificate: {
            certificateCode: data.certificate_code,
            displayName: data.user_name,
            hskLevel: data.hsk_level,
            issueDate: data.issue_date,
            isRevoked: false,
            disclaimer: HANZIGO_CERTIFICATE_DISCLAIMER
          },
          source: 'verified_cloud'
        };
      }
    }
  } catch {}

  // 3. Fallback tìm trong localStorage (môi trường mô phỏng offline)
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
      if (raw) {
        const list = JSON.parse(raw);
        const found = list.find(c => c.certificateCode === cleanCode || c.id === cleanCode);
        if (found) {
          if (found.isRevoked || found.is_revoked) {
            return {
              isValid: false,
              status: 'revoked',
              message: `Chứng nhận này ĐÃ BỊ THU HỒI: ${found.revocationReason || 'Đã bị hủy hiệu lực.'}`,
              certificate: {
                certificateCode: found.certificateCode,
                displayName: found.userName || found.displayName,
                hskLevel: found.hskLevel,
                issueDate: found.issueDate,
                isRevoked: true,
                revocationReason: found.revocationReason,
                disclaimer: HANZIGO_CERTIFICATE_DISCLAIMER
              }
            };
          }
          return {
            isValid: true,
            status: 'valid',
            certificate: {
              certificateCode: found.certificateCode,
              displayName: found.userName || found.displayName,
              hskLevel: found.hskLevel,
              issueDate: found.issueDate,
              isRevoked: false,
              disclaimer: HANZIGO_CERTIFICATE_DISCLAIMER
            },
            source: 'verified_local'
          };
        }
      }
    }
  } catch {}

  return {
    isValid: false,
    status: 'not_found',
    message: 'Không tìm thấy chứng nhận này trong cơ sở dữ liệu xác thực HanziGo.'
  };
}
