/**
 * =========================================================================
 * HSK REVIEW, PUBLISHING & USER REPORT SERVICE
 * =========================================================================
 * Quản lý trạng thái duyệt đề (Review Workflow: draft -> approved -> published),
 * quản trị kho tài nguyên công khai, và xử lý báo cáo sự cố từ học viên.
 * =========================================================================
 */

import { HSK_RESOURCES } from '../data/hskResourcesData.js';
import { supabase } from '../supabase/config.js';

const VALID_REVIEW_STATES = ['draft', 'needs_review', 'approved', 'published', 'rejected', 'archived'];
const STORAGE_REPORTS_KEY = 'hanzigo_hsk_reports';
const STORAGE_RESOURCES_KEY = 'hanzigo_hsk_resources_cache';

/**
 * Lấy danh sách tài nguyên HSK công khai kèm bộ lọc
 */
export async function getPublicHskResources({ 
  level = 'all', 
  category = 'all', 
  skill = 'all', 
  format = 'all', 
  search = '' 
} = {}) {
  let list = [...HSK_RESOURCES].filter(r => r.is_published && r.review_status === 'published');

  // Thử đọc từ Supabase nếu có cấu hình
  if (supabase) {
    try {
      let query = supabase
        .from('hsk_resources')
        .select('*')
        .eq('is_published', true)
        .eq('review_status', 'published');

      if (level && level !== 'all') query = query.eq('level', level);
      if (category && category !== 'all') query = query.eq('category', category);
      if (skill && skill !== 'all') query = query.eq('skill', skill);
      if (format && format !== 'all') query = query.eq('format', format);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        list = data;
      }
    } catch {}
  }

  // Áp dụng bộ lọc cục bộ
  if (level && level !== 'all') {
    list = list.filter(r => r.level.toLowerCase() === level.toLowerCase() || r.level.toLowerCase() === 'all');
  }

  if (category && category !== 'all') {
    list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  if (skill && skill !== 'all') {
    list = list.filter(r => r.skill.toLowerCase() === skill.toLowerCase() || r.skill.toLowerCase() === 'mixed');
  }

  if (format && format !== 'all') {
    list = list.filter(r => r.format.toLowerCase() === format.toLowerCase());
  }

  if (search && search.trim()) {
    const s = search.toLowerCase().trim();
    list = list.filter(r => 
      (r.title && r.title.toLowerCase().includes(s)) ||
      (r.description && r.description.toLowerCase().includes(s)) ||
      (r.source_author && r.source_author.toLowerCase().includes(s)) ||
      (r.source_url && r.source_url.toLowerCase().includes(s)) ||
      (Array.isArray(r.tags) && r.tags.some(t => t.toLowerCase().includes(s)))
    );
  }

  return list;
}

/**
 * Chuyển đổi trạng thái duyệt nội dung (Chỉ dành cho Admin)
 * @param {Object} params - { contentId, contentType, targetState, user }
 */
export async function transitionContentState({ 
  contentId, 
  contentType = 'exam', 
  targetState, 
  user = null 
}) {
  const isAdmin = user && (user.role === 'admin' || user.isAdmin === true);
  if (!isAdmin) {
    return {
      success: false,
      error: 'Từ chối truy cập: Chỉ Quản trị viên (Admin) mới có quyền duyệt và xuất bản nội dung.'
    };
  }

  if (!VALID_REVIEW_STATES.includes(targetState)) {
    return {
      success: false,
      error: `Trạng thái mục tiêu (${targetState}) không hợp lệ. Phải là: ${VALID_REVIEW_STATES.join(', ')}.`
    };
  }

  const isPublished = targetState === 'published';

  try {
    const table = contentType === 'exam' ? 'hsk_exams' : 'hsk_resources';

    if (supabase) {
      const { error } = await supabase
        .from(table)
        .update({
          review_status: targetState,
          is_published: isPublished,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId);

      if (error) {
        throw new Error(error.message);
      }
    }

    // Cập nhật local storage cache nếu đang chạy offline
    try {
      const cacheKey = contentType === 'exam' ? 'hanzigo_imported_exams' : STORAGE_RESOURCES_KEY;
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.map(item => {
          if (item.id === contentId) {
            return { ...item, review_status: targetState, is_published: isPublished };
          }
          return item;
        });
        localStorage.setItem(cacheKey, JSON.stringify(updated));
      }
    } catch {}

    return {
      success: true,
      contentId,
      newState: targetState,
      isPublished,
      message: `Đã chuyển nội dung [${contentId}] sang trạng thái [${targetState}].`
    };
  } catch (err) {
    return {
      success: false,
      error: `Không thể chuyển đổi trạng thái: ${err.message}`
    };
  }
}

/**
 * Gửi báo cáo lỗi, liên kết hỏng hoặc nghi vấn câu hỏi từ học viên
 */
export async function submitContentReport({
  resourceId = null,
  examId = null,
  questionId = null,
  reportType,
  description,
  reporterEmail = null
}) {
  if (!reportType || !description || description.trim().length < 5) {
    return {
      success: false,
      error: 'Vui lòng chọn loại sự cố và cung cấp mô tả chi tiết tối thiểu 5 ký tự.'
    };
  }

  const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const reportItem = {
    id: reportId,
    resource_id: resourceId || null,
    exam_id: examId || null,
    question_id: questionId || null,
    report_type: reportType,
    description: description.trim(),
    reporter_email: reporterEmail ? reporterEmail.trim() : null,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  try {
    if (supabase) {
      await supabase.from('hsk_reports').insert(reportItem);
    }
  } catch {}

  try {
    const raw = localStorage.getItem(STORAGE_REPORTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify([reportItem, ...list]));
  } catch {}

  return {
    success: true,
    reportId,
    message: 'Cảm ơn bạn! Ban Học Thuật HanziGo đã tiếp nhận phản hồi và sẽ rà soát nội dung.'
  };
}

/**
 * Lấy danh sách báo cáo sự cố (Dành riêng cho Admin)
 */
export async function getAdminReports({ user = null, status = 'all' } = {}) {
  const isAdmin = user && (user.role === 'admin' || user.isAdmin === true);
  if (!isAdmin) {
    return [];
  }

  let list = [];
  try {
    const raw = localStorage.getItem(STORAGE_REPORTS_KEY);
    if (raw) list = JSON.parse(raw);
  } catch {}

  if (status && status !== 'all') {
    list = list.filter(r => r.status === status);
  }

  return list;
}
