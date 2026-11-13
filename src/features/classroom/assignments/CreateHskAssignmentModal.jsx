import React, { useState } from 'react';
import { X, Send, BookOpen, FileText, PenTool, Calendar, Sparkles } from 'lucide-react';
import { supabase } from '../../../supabase/config';

const RESOURCE_CATALOG = {
  hsk_mock_exam: [
    { id: 'H10901', label: 'Đề HSK 1 chuẩn — Mã H10901', level: 1 },
    { id: 'H21002', label: 'Đề HSK 2 chuẩn — Mã H21002', level: 2 },
    { id: 'H31329', label: 'Đề HSK 3 chuẩn — Mã H31329', level: 3 },
    { id: 'H41005', label: 'Đề HSK 4 chuẩn — Mã H41005', level: 4 },
    { id: 'H51328', label: 'Đề HSK 5 chuẩn — Mã H51328', level: 5 },
    { id: 'H61327', label: 'Đề HSK 6 chuẩn — Mã H61327', level: 6 },
  ],
  reading_article: [
    { id: 'RD-HSK3-01', label: 'Bài đọc HSK 3: Cuộc sống Bắc Kinh', level: 3 },
    { id: 'RD-HSK4-02', label: 'Bài đọc HSK 4: Thói quen làm việc hiện đại', level: 4 },
    { id: 'RD-HSK5-03', label: 'Bài đọc HSK 5: Văn hóa trà đạo Trung Hoa', level: 5 },
  ],
  hanzi_writing_drill: [
    { id: '整理汉字', label: 'Luyện viết: 整理汉字 (Chỉnh lý Hán tự)', level: 3 },
    { id: '坚持努力', label: 'Luyện viết: 坚持努力 (Kiên trì nỗ lực)', level: 4 },
    { id: '环境科学', label: 'Luyện viết: 环境科学 (Khoa học môi trường)', level: 5 },
  ],
};

export default function CreateHskAssignmentModal({
  isOpen,
  onClose,
  classrooms = [],
  defaultClassroomId = '',
  onCreated,
}) {
  const [classroomId, setClassroomId] = useState(defaultClassroomId || classrooms[0]?.id || '');
  const [assignmentType, setAssignmentType] = useState('hsk_mock_exam');
  const [targetResourceId, setTargetResourceId] = useState('H31329');
  const [hskLevel, setHskLevel] = useState(3);
  const [title, setTitle] = useState('Kiểm tra định kỳ — Đề HSK 3 (H31329)');
  const [instructions, setInstructions] = useState('Hoàn thành đầy đủ các phần Nghe, Đọc, Viết trước hạn nộp.');
  const [dueAt, setDueAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const activeCatalog = RESOURCE_CATALOG[assignmentType] || [];

  const handleTypeChange = (nextType) => {
    setAssignmentType(nextType);
    const first = (RESOURCE_CATALOG[nextType] || [])[0];
    if (first) {
      setTargetResourceId(first.id);
      setHskLevel(first.level);
      setTitle(first.label);
    }
  };

  const handleResourceChange = (nextId) => {
    setTargetResourceId(nextId);
    const found = activeCatalog.find((item) => item.id === nextId);
    if (found) {
      setHskLevel(found.level);
      setTitle(found.label);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const selectedClassId = classroomId || classrooms[0]?.id;
    if (!selectedClassId) {
      setErrorMsg('Vui lòng chọn lớp học.');
      return;
    }

    setSubmitting(true);
    try {
      const { data: sessionData } = (await supabase?.auth?.getSession?.()) || {};
      const token = sessionData?.session?.access_token;

      const res = await fetch('/api/classroom/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          action: 'create_assignment',
          classroomId: selectedClassId,
          title: title.trim() || `Bài tập ${targetResourceId}`,
          instructions: instructions.trim(),
          assignmentType,
          targetResourceId: targetResourceId.trim(),
          hskLevel,
          dueAt: dueAt ? new Date(dueAt).toISOString() : null,
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || 'Không thể giao bài tập.');
      }

      if (onCreated) onCreated(payload.assignment);
      onClose();
    } catch (err) {
      setErrorMsg(err?.message || 'Lỗi khi giao bài tập.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-[#E85D3F] to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h3 className="font-black text-base">Giao Bài Tập HSK Thông Minh</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-600 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Chọn lớp */}
          <div>
            <label className="block text-xs font-bold text-[#243447] dark:text-white/90 mb-1">
              Lớp học mục tiêu
            </label>
            <select
              value={classroomId || classrooms[0]?.id || ''}
              onChange={(e) => setClassroomId(e.target.value)}
              className="w-full rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFFDF9] dark:bg-[#0F172A] px-3 py-2 text-sm text-[#243447] dark:text-white"
            >
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.hsk_level || 'HSK'})
                </option>
              ))}
            </select>
          </div>

          {/* Loại bài tập */}
          <div>
            <label className="block text-xs font-bold text-[#243447] dark:text-white/90 mb-1.5">
              Loại bài tập
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'hsk_mock_exam', label: 'Đề thi HSK 1-6', icon: FileText },
                { id: 'reading_article', label: 'Bài đọc hiểu', icon: BookOpen },
                { id: 'hanzi_writing_drill', label: 'Luyện viết Hán tự', icon: PenTool },
              ].map((item) => {
                const Icon = item.icon;
                const active = assignmentType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTypeChange(item.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      active
                        ? 'border-[#E85D3F] bg-[#FFF5F2] dark:bg-[#E85D3F]/20 text-[#E85D3F]'
                        : 'border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-white/70'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mã đề từ kho */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#243447] dark:text-white/90 mb-1">
                Chọn mã đề / tài liệu
              </label>
              <select
                value={targetResourceId}
                onChange={(e) => handleResourceChange(e.target.value)}
                className="w-full rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFFDF9] dark:bg-[#0F172A] px-3 py-2 text-xs text-[#243447] dark:text-white"
              >
                {activeCatalog.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#243447] dark:text-white/90 mb-1 flex items-center gap-1">
                <Calendar size={12} /> Hạn nộp bài
              </label>
              <input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="w-full rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFFDF9] dark:bg-[#0F172A] px-3 py-2 text-xs text-[#243447] dark:text-white"
              />
            </div>
          </div>

          {/* Tiêu đề & dặn dò */}
          <div>
            <label className="block text-xs font-bold text-[#243447] dark:text-white/90 mb-1">
              Tiêu đề bài tập
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFFDF9] dark:bg-[#0F172A] px-3 py-2 text-sm text-[#243447] dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#243447] dark:text-white/90 mb-1">
              Hướng dẫn cho học viên
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFFDF9] dark:bg-[#0F172A] px-3 py-2 text-xs text-[#243447] dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#d84f31] text-white text-xs font-black flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send size={14} />
              {submitting ? 'Đang giao bài...' : 'Giao bài tập ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

