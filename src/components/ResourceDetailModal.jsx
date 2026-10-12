import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  FileText, 
  Compass, 
  Sparkles, 
  Copy, 
  Check, 
  Flag, 
  Printer, 
  AlertCircle, 
  Globe, 
  Layers, 
  Calendar, 
  UserCheck 
} from 'lucide-react';
import { CURRICULUM_60_LESSONS } from '../data/curriculumLessons.js';
import { HSK_EXAMS } from '../data/hskExamsData.js';

export default function ResourceDetailModal({ 
  resource, 
  onClose, 
  onSelectLesson, 
  onNavigateExam, 
  onOpenReport 
}) {
  const [copied, setCopied] = useState(false);

  if (!resource) return null;

  const handleCopyLink = () => {
    const url = resource.source_url || resource.download_url || window.location.href;
    try {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Find related lesson details from CURRICULUM_60_LESSONS
  const relatedLessons = (resource.related_lesson_ids || []).map(lid => {
    const found = CURRICULUM_60_LESSONS.find(l => l.id === lid);
    return found ? { id: lid, title: found.title, level: found.levelId } : { id: lid, title: `Bài học ${lid}`, level: '' };
  });

  // Find related exams from HSK_EXAMS
  const relatedExams = (resource.related_exam_ids || []).map(eid => {
    const found = HSK_EXAMS.find(e => e.id === eid);
    return found ? { id: eid, title: found.title, level: found.level } : { id: eid, title: `Đề thi ${eid}`, level: '' };
  });

  const isHanziGoOriginal = resource.host_type === 'hanzigo_original' || (resource.source_author && resource.source_author.includes('HanziGo'));
  const isOfficial = resource.host_type === 'official_published' || (resource.source_author && (resource.source_author.includes('CTI') || resource.source_author.includes('CLEC')));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                {resource.level === 'All' ? 'Mọi cấp độ' : resource.level}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {resource.exam_version || '2015-Standard'}
              </span>
              {isHanziGoOriginal ? (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <Sparkles size={12} />
                  <span>HanziGo Độc Quyền</span>
                </span>
              ) : isOfficial ? (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>CTI / CLEC Chính Thức</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 flex items-center gap-1">
                  <Globe size={12} />
                  <span>Tài Liệu Mở OER</span>
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
              {resource.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-200">
          
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Giới thiệu nội dung
            </h3>
            <p className="leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              {resource.description}
            </p>
          </div>

          {/* Learning Objectives */}
          {Array.isArray(resource.learning_objectives) && resource.learning_objectives.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen size={14} className="text-amber-500" />
                <span>Mục tiêu học tập & Kỹ năng đạt được</span>
              </h3>
              <ul className="space-y-2">
                {resource.learning_objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5 bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-100/80 dark:border-amber-900/30 text-xs sm:text-sm">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Two-Way Connection: Related Roadmap Lessons */}
          {relatedLessons.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass size={14} className="text-emerald-500" />
                <span>Bài học liên quan trong Lộ trình HanziGo</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {relatedLessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      if (onSelectLesson) {
                        onSelectLesson(lesson.id);
                        onClose();
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                  >
                    <span>{lesson.id.toUpperCase()}: {lesson.title}</span>
                    <ExternalLink size={12} className="text-emerald-600 dark:text-emerald-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Two-Way Connection: Related HSK Practice Exams */}
          {relatedExams.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award size={14} className="text-rose-500" />
                <span>Đề thi thử HSK tương ứng</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {relatedExams.map(exam => (
                  <button
                    key={exam.id}
                    onClick={() => {
                      if (onNavigateExam) {
                        onNavigateExam(exam.id);
                        onClose();
                      } else {
                        window.location.hash = `#hsk/exam/${exam.id}`;
                        onClose();
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                  >
                    <span>{exam.title}</span>
                    <ExternalLink size={12} className="text-rose-600 dark:text-rose-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">Tác giả / Cơ quan xuất bản</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <UserCheck size={13} className="text-slate-400" />
                {resource.source_author || resource.publisher || 'Ban Học Thuật'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">Ngôn ngữ thể hiện</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {resource.language_of_instruction || 'Song ngữ Trung - Việt'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">Giấy phép & Bản quyền</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {resource.license_status || 'Giáo dục công khai'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">Ngày thẩm định cuối</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Calendar size={13} className="text-slate-400" />
                {resource.verified_date || '2026-10-12'}
              </span>
            </div>
          </div>

          {/* Copyright Transparency Notice */}
          <div className="bg-slate-100/70 dark:bg-slate-800/50 rounded-2xl p-4 text-xs space-y-1 border border-slate-200/60 dark:border-slate-700/60">
            <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-amber-500" />
              <span>Chính sách bản quyền & Bản quyền lưu trữ:</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {resource.permission_status === 'linked_only'
                ? 'Tài liệu này thuộc bản quyền của cơ quan phát hành gốc (CTI / CLEC / BLCU). HanziGo chỉ lưu trữ metadata và cung cấp đường link trích dẫn hợp pháp, không lưu trữ lại file có bản quyền.'
                : 'Tài liệu được phát hành theo giấy phép Giáo dục Mở Creative Commons (CC BY-NC-SA 4.0) hoặc bản quyền của HanziGo. Người học được phép in ấn, học tập và phân phối phi thương mại.'}
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép liên kết'}</span>
            </button>

            {onOpenReport && (
              <button
                onClick={() => {
                  onOpenReport(resource);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Flag size={14} />
                <span>Báo link hỏng</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
            >
              Đóng
            </button>

            {isHanziGoOriginal && resource.download_url ? (
              <a
                href={resource.download_url}
                target={resource.download_url.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                {resource.format === 'practice_exam' ? <Sparkles size={14} /> : <Printer size={14} />}
                <span>Mở công cụ trực tuyến</span>
              </a>
            ) : (
              <a
                href={resource.source_url || resource.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Mở nguồn gốc</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
