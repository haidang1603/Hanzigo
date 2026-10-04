import React, { useState, useMemo, useCallback } from 'react';
import { 
  CheckCircle2, 
  Play, 
  Sparkles, 
  Target, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Download, 
  Mic, 
  PenTool, 
  FolderDown, 
  Check, 
  Plus, 
  Trash2, 
  X, 
  BookOpen, 
  MessageCircle,
  Compass,
  BarChart3,
  Calendar
} from 'lucide-react';
import { ROADMAP_LEVELS } from '../data/chineseData';
import { 
  getStoredMaterials, 
  getStoredCustomLessons, 
  saveCustomLesson, 
  deleteCustomLesson 
} from '../utils/materialsStorage';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { triggerCloudSync } from '../supabase/services';
import LearningJourneyMap from '../components/learning/LearningJourneyMap';
import InteractiveLessonPlayer from '../components/learning/InteractiveLessonPlayer';
import BossChallengeModal from '../components/learning/BossChallengeModal';
import PlacementTestModal from '../components/learning/PlacementTestModal';
import DailyMissionsModal from '../components/learning/DailyMissionsModal';
import SkillMasteryCard from '../components/learning/SkillMasteryCard';
import { getLessonById } from '../services/learningPathService';

// Base curriculums for each roadmap level
const BASE_LEVEL_LESSONS = {
  'intro': [
    { id: 'intro-1', number: 1, title: 'Bảng 23 Thanh mẫu & 4 Thanh điệu cơ bản', duration: 20, xp: 40, desc: 'Luyện phát âm chuẩn các âm khó: b/p, d/t, z/c/s, zh/ch/sh và 4 cao độ thanh điệu.' },
    { id: 'intro-2', number: 2, title: 'Bảng 24 Vận mẫu đơn & kép, âm uốn lưỡi Er', duration: 20, xp: 40, desc: 'Nguyên âm ghép ai, ei, ao, ou, an, en, ang, eng và các quy tắc viết pinyin chuẩn.' },
    { id: 'intro-3', number: 3, title: 'Quy tắc biến điệu hai thanh 3 và biến điệu chữ 不, 一', duration: 15, xp: 45, desc: 'Nắm chắc bí quyết nói mềm mại, tự nhiên như người bản ngữ Bắc Kinh.' },
    { id: 'intro-4', number: 4, title: '8 Nét cơ bản & 7 Quy tắc thuận bút chữ Hán', duration: 25, xp: 50, desc: 'Ngang, sổ, phẩy, mác, hất, gập, móc và quy tắc trên trước dưới sau, vào trước đóng sau.' },
    { id: 'intro-5', number: 5, title: '20 Bộ thủ thông dụng nhất cấu tạo nên chữ Hán', duration: 25, xp: 50, desc: 'Bộ Nhân, bộ Khẩu, bộ Thủy, bộ Hỏa, bộ Mộc... và cách đoán nghĩa nhanh.' },
    { id: 'intro-6', number: 6, title: 'Cài đặt và thực hành gõ tiếng Trung trên máy tính & điện thoại', duration: 15, xp: 35, desc: 'Thao tác gõ Pinyin chuyển thành chữ Hán trên bàn phím QWERTY chuẩn.' }
  ],
  'hsk1': [
    { id: 'lesson-1', number: 1, title: 'Bài 1: Chào hỏi cơ bản (你好 - Xin chào, Cảm ơn)', duration: 15, xp: 50, desc: 'Cách chào hỏi lịch sự, cảm ơn, xin lỗi và tạm biệt trong sinh hoạt hàng ngày.' },
    { id: 'lesson-2', number: 2, title: 'Bài 2: Giới thiệu bản thân & Quốc tịch (我是越南人)', duration: 18, xp: 60, desc: 'Cấu trúc câu chữ 是, xưng hô tên tuổi, quốc tịch và nghề nghiệp.' },
    { id: 'lesson-3', number: 3, title: 'Bài 3: Con số, Giá cả & Mua sắm (多少钱 - Bao nhiêu tiền)', duration: 20, xp: 65, desc: 'Đếm số 1-100, hỏi giá tiền và các loại hoa quả, đồ uống quen thuộc.' },
    { id: 'lesson-4', number: 4, title: 'Bài 4: Gia đình & Người thân (我家有四口人)', duration: 18, xp: 60, desc: 'Từ vựng xưng hô gia đình bố mẹ anh chị em và lượng từ 口 (kǒu).' },
    { id: 'lesson-5', number: 5, title: 'Bài 5: Thời gian & Ngày tháng (今天几月几号)', duration: 20, xp: 65, desc: 'Hỏi ngày giờ, thứ trong tuần, năm tháng và cách hẹn gặp.' },
    { id: 'lesson-6', number: 6, title: 'Bài 6: Sở thích & Hoạt động hàng ngày (你喜欢做什么)', duration: 20, xp: 70, desc: 'Động từ chỉ hoạt động xem phim, đọc sách, nghe nhạc, uống trà.' }
  ],
  'hsk2': [
    { id: 'hsk2-1', number: 1, title: 'Bài 1: Đi lại & Hỏi đường (去火车站怎么走 - Ga tàu đi thế nào)', duration: 22, xp: 75, desc: 'Phương hướng đông tây nam bắc, rẽ trái phải, đi thẳng và các loại xe bus, taxi.' },
    { id: 'hsk2-2', number: 2, title: 'Bài 2: Gọi món tại nhà hàng Trung Hoa (点菜 - Chọn món)', duration: 25, xp: 80, desc: 'Thực đơn đồ ăn Trung, gọi thêm món, tính tiền và yêu cầu khẩu vị ít cay.' },
    { id: 'hsk2-3', number: 3, title: 'Bài 3: Thời tiết & Bốn mùa (今天比昨天冷 - Lạnh hơn hôm qua)', duration: 20, xp: 70, desc: 'Câu so sánh chữ 比, nhiệt độ, mưa nắng và chuyển mùa.' },
    { id: 'hsk2-4', number: 4, title: 'Bài 4: Khám sức khỏe & Đi bệnh viện (看病 - Đi khám bệnh)', duration: 22, xp: 75, desc: 'Các triệu chứng cảm cúm, sốt, đau đầu và cách uống thuốc theo đơn.' }
  ],
  'hsk3': [
    { id: 'hsk3-1', number: 1, title: 'Bài 1: Kế hoạch du lịch tự túc (去中国旅游 - Du lịch Trung Quốc)', duration: 25, xp: 85, desc: 'Đặt vé tàu cao tốc, đặt phòng khách sạn, đổi tiền tệ và tham quan danh lam.' },
    { id: 'hsk3-2', number: 2, title: 'Bài 2: Câu chữ 把 trong sinh hoạt (把书放在桌子上)', duration: 28, xp: 90, desc: 'Cấu trúc câu chữ 把 xử lý vật và bổ ngữ kết quả, xu hướng.' },
    { id: 'hsk3-3', number: 3, title: 'Bài 3: Câu bị động chữ 被 (自行车被骑走了)', duration: 25, xp: 85, desc: 'Cách diễn đạt câu bị động trong văn nói và văn viết thường ngày.' },
    { id: 'hsk3-4', number: 4, title: 'Bài 4: Luyện đề thi mô phỏng HSK 3 định dạng chuẩn mới', duration: 35, xp: 120, desc: 'Thực chiến 3 phần: Nghe hiểu, Đọc hiểu và Viết câu đạt điểm cao.' }
  ],
  'hsk4': [
    { id: 'hsk4-1', number: 1, title: 'Bài 1: Phỏng vấn xin việc & Viết CV tiếng Trung', duration: 30, xp: 100, desc: 'Giới thiệu kinh nghiệm làm việc, thế mạnh bản thân và đàm phán mức lương.' },
    { id: 'hsk4-2', number: 2, title: 'Bài 2: Bàn luận về công nghệ, môi trường & Cuộc sống số', duration: 30, xp: 100, desc: 'Các thuật ngữ thanh toán điện tử WeChat Pay/Alipay, mua sắm online Taobao/1688.' },
    { id: 'hsk4-3', number: 3, title: 'Bài 3: Đàm phán thương mại sơ cấp & Hợp đồng ngắn', duration: 35, xp: 110, desc: 'Soạn email công việc, thỏa thuận thời gian giao hàng và kiểm tra mẫu.' }
  ],
  'hsk5-6': [
    { id: 'hsk5-1', number: 1, title: 'Bài 1: Thành ngữ kinh điển trong văn hóa & Giao thương (成语精选)', duration: 35, xp: 120, desc: 'Các thành ngữ 4 chữ thông dụng trong đàm phán ngoại giao và viết bài học thuật.' },
    { id: 'hsk5-2', number: 2, title: 'Bài 2: Đọc báo tài chính & Phân tích xu hướng kinh tế', duration: 40, xp: 130, desc: 'Đọc hiểu báo chí Nhân Dân Nhật Báo, Tân Hoa Xã không cần tra từ điển.' }
  ]
};

// Quick suggestions for adding custom lessons
const QUICK_LESSON_SUGGESTIONS = [
  {
    title: 'Luyện đàm thoại đặt đồ ăn & trà sữa trên app Meituan / Eleme',
    level: 'HSK 2',
    duration: 25,
    xp: 80,
    desc: 'Học cách nhập địa chỉ giao hàng, ghi chú ít đường ít đá và liên hệ shipper tiếng Trung.'
  },
  {
    title: 'Bí quyết mặc cả & hỏi kích thước size đồ trên Taobao / 1688',
    level: 'HSK 2',
    duration: 20,
    xp: 75,
    desc: 'Các mẫu câu chat với chủ shop (客服), xin mã giảm giá, kiểm tra phí vận chuyển và đổi trả hàng.'
  },
  {
    title: 'Luyện dịch văn bản ngắn tin nhắn WeChat và mạng xã hội Douyin',
    level: 'HSK 3',
    duration: 30,
    xp: 90,
    desc: 'Hiểu ngôn ngữ viết tắt, từ lóng mạng và cách rep tin nhắn tự nhiên như người bản xứ.'
  },
  {
    title: 'Thủ tục check-in sân bay, hải quan và đổi tiền tệ tại Trung Quốc',
    level: 'HSK 3',
    duration: 25,
    xp: 85,
    desc: 'Giao tiếp trôi chảy khi làm thủ tục xuất nhập cảnh, khai báo hành lý và kích hoạt sim thẻ.'
  }
];

export default function RoadmapPage({ user, setActiveTab, onSelectLesson, onAddXp }) {
  const [roadmapView, setRoadmapView] = useState('journey'); // 'journey' | 'curriculum' | 'skills'
  const [activeLessonToPlay, setActiveLessonToPlay] = useState(null);
  const [activeBossChallenge, setActiveBossChallenge] = useState(null);
  const [showPlacementTest, setShowPlacementTest] = useState(false);
  const [showDailyMissions, setShowDailyMissions] = useState(false);

  const [stageFilter, setStageFilter] = useState('all'); // all | Sơ cấp | Trung cấp | Cao cấp | in-progress | completed
  const [expandedLevel, setExpandedLevel] = useState('intro');

  // Completed lessons tracked in localStorage
  const [completedLessonIds, setCompletedLessonIds] = useState(() => {
    try {
      const saved = localStorage.getItem('hanzigo_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Custom lessons state (persisted via materialsStorage)
  const [customLessons, setCustomLessons] = useState(() => getStoredCustomLessons());

  // Add Lesson Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTargetLevel, setSelectedTargetLevel] = useState('HSK 1');
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('20');
  const [newXp, setNewXp] = useState('60');
  const [newDesc, setNewDesc] = useState('');

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };


  // Load all authentic materials
  const allMaterials = useMemo(() => getStoredMaterials(), []);

  // Combine base lessons with user-created custom lessons (memoized)
  const getLevelLessons = useCallback((levelId) => {
    const base = BASE_LEVEL_LESSONS[levelId] || [];
    const matchingCustom = customLessons
      .filter((cl) => {
        if (levelId === 'intro') return cl.level === 'Nhập môn';
        if (levelId === 'hsk1') return cl.level === 'HSK 1';
        if (levelId === 'hsk2') return cl.level === 'HSK 2';
        if (levelId === 'hsk3') return cl.level === 'HSK 3';
        if (levelId === 'hsk4') return cl.level === 'HSK 4';
        if (levelId === 'hsk5-6') return cl.level === 'HSK 5-6';
        return false;
      })
      .map((cl, idx) => ({
        id: cl.id,
        number: base.length + idx + 1,
        title: cl.title,
        duration: parseInt(cl.duration || 20, 10),
        xp: parseInt(cl.xp || 50, 10),
        desc: cl.description || cl.desc || 'Bài học do người học tự bổ sung vào lộ trình.',
        isCustom: true
      }));

    return [...base, ...matchingCustom];
  }, [customLessons]);

  // Toggle lesson completed state
  const handleToggleLessonComplete = (e, lessonId) => {
    e.stopPropagation();
    playClickSound();
    let updated;
    if (completedLessonIds.includes(lessonId)) {
      updated = completedLessonIds.filter((id) => id !== lessonId);
      showToast('Đã bỏ đánh dấu hoàn thành bài học');
    } else {
      updated = [...completedLessonIds, lessonId];
      playSuccessSound();
      showToast('🎉 Chúc mừng! Đã hoàn thành thêm một bài học');
    }
    setCompletedLessonIds(updated);
    localStorage.setItem('hanzigo_completed_lessons', JSON.stringify(updated));
    triggerCloudSync();
  };

  // Compute real progress for each level
  const computeLevelProgress = (levelId) => {
    const lessons = getLevelLessons(levelId);
    if (!lessons.length) return { percent: 0, completedCount: 0, totalCount: 0, status: 'not-started' };
    
    const completedCount = lessons.filter(l => completedLessonIds.includes(l.id)).length;
    const percent = Math.round((completedCount / lessons.length) * 100);
    
    let status = 'not-started';
    if (percent === 100) status = 'completed';
    else if (percent > 0) status = 'in-progress';

    return { percent, completedCount, totalCount: lessons.length, status };
  };

  // Filter levels dynamically
  const filteredLevels = ROADMAP_LEVELS.filter((lvl) => {
    const progress = computeLevelProgress(lvl.id);
    if (stageFilter === 'all') return true;
    if (stageFilter === 'in-progress') return progress.status === 'in-progress';
    if (stageFilter === 'completed') return progress.status === 'completed';
    return lvl.stage === stageFilter;
  });

  // Calculate overall metrics
  const totalRoadmapLessons = useMemo(() => {
    return ROADMAP_LEVELS.reduce((acc, lvl) => acc + getLevelLessons(lvl.id).length, 0);
  }, [getLevelLessons]);

  const totalCompleted = completedLessonIds.length;
  const overallPercent = totalRoadmapLessons > 0 ? Math.min(100, Math.round((totalCompleted / totalRoadmapLessons) * 100)) : 0;

  // Open lesson handler
  const handleStartLevel = (levelId) => {
    playClickSound();
    if (levelId === 'intro') {
      setActiveTab('pronunciation');
      return;
    }
    if (onSelectLesson) {
      onSelectLesson(0);
    } else {
      setActiveTab('lesson');
    }
  };

  const handleOpenLesson = (levelId, lessonIdx) => {
    playClickSound();
    if (levelId === 'intro') {
      setActiveTab('pronunciation');
      return;
    }
    if (levelId === 'hsk1' && onSelectLesson) {
      onSelectLesson(lessonIdx);
    } else if (onSelectLesson) {
      onSelectLesson(0);
    } else {
      setActiveTab('lesson');
    }
  };

  // Add custom lesson
  const handleAddNewLesson = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    playClickSound();
    const newLessonObj = {
      id: `custom-lesson-${Date.now()}`,
      title: newTitle.trim(),
      level: selectedTargetLevel,
      duration: parseInt(newDuration, 10) || 20,
      xp: parseInt(newXp, 10) || 60,
      description: newDesc.trim() || 'Bài học tự tạo trong lộ trình học tập cá nhân.',
      isCustom: true
    };

    saveCustomLesson(newLessonObj);
    const updated = [newLessonObj, ...customLessons];
    setCustomLessons(updated);

    playSuccessSound();
    setShowAddModal(false);
    showToast(`Đã thêm bài học vào chặng ${selectedTargetLevel}!`);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
  };

  // Delete custom lesson
  const handleDeleteCustomLesson = (lessonId, e) => {
    if (e) e.stopPropagation();
    playClickSound();
    if (!window.confirm('Bạn có chắc muốn xóa bài học này khỏi lộ trình?')) return;

    deleteCustomLesson(lessonId);
    const updated = customLessons.filter(cl => cl.id !== lessonId);
    setCustomLessons(updated);
    showToast('Đã xóa bài học.');
  };

  // Apply quick suggestion in Add Modal
  const handleApplySuggestion = (sug) => {
    playClickSound();
    setNewTitle(sug.title);
    setSelectedTargetLevel(sug.level);
    setNewDuration(String(sug.duration));
    setNewXp(String(sug.xp));
    setNewDesc(sug.desc);
  };

  // Materials mapped to each level
  const getMaterialsForLevel = (levelId) => {
    switch (levelId) {
      case 'intro':
        return allMaterials.filter(m => 
          m.id === 'mat-9' || m.id === 'mat-4' || m.id === 'mat-8' || m.level === 'Nhập môn' || m.level === 'Tất cả'
        ).slice(0, 3);
      case 'hsk1':
        return allMaterials.filter(m => 
          m.id === 'mat-1' || m.id === 'mat-5' || m.level === 'HSK 1'
        );
      case 'hsk2':
        return allMaterials.filter(m => 
          m.id === 'mat-2' || m.id === 'mat-5' || m.level === 'HSK 2'
        );
      case 'hsk3':
        return allMaterials.filter(m => 
          m.id === 'mat-3' || m.id === 'mat-6' || m.level === 'HSK 3'
        );
      case 'hsk4':
        return allMaterials.filter(m => 
          m.id === 'mat-7' || m.id === 'mat-5' || m.level === 'HSK 4'
        );
      case 'hsk5-6':
        return allMaterials.filter(m => 
          m.id === 'mat-10' || m.id === 'mat-6' || m.level === 'HSK 5' || m.level === 'HSK 4 - 6'
        );
      default:
        return allMaterials.slice(0, 2);
    }
  };

  // If a lesson is being played in the 9-step Interactive Player
  if (activeLessonToPlay) {
    return (
      <InteractiveLessonPlayer
        lesson={activeLessonToPlay}
        user={user}
        onBack={() => setActiveLessonToPlay(null)}
        onCompleteNext={() => {
          const num = activeLessonToPlay.lessonNumber || 1;
          const nextLessonId = `l-10${num + 1}`;
          const nextLesson = getLessonById(nextLessonId);
          if (nextLesson) {
            setActiveLessonToPlay(nextLesson);
          } else {
            setActiveLessonToPlay(null);
            showToast('🎉 Chúc mừng bạn đã hoàn thành chặng bài này!');
          }
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 p-4 rounded-2xl bg-[#E85D3F] text-white shadow-xl flex items-center gap-3 animate-in slide-in-from-right duration-200">
          <CheckCircle2 size={18} className="shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{toast}</p>
        </div>
      )}

      {/* Page Header Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#243447] via-[#1E293B] to-[#0F172A] text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E85D3F]/20 text-[#E85D3F] border border-[#E85D3F]/30 text-xs font-bold">
              <Sparkles size={14} />
              <span>Khung Chuẩn HSK 3.0 & Quốc Tế BLCU</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-['Noto_Serif_SC'] tracking-tight">
              Lộ Trình Học Tiếng Trung Toàn Diện
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Lộ trình 6 chặng từ con số 0 đến thành thạo giao tiếp và chinh phục HSK cao cấp. Tích hợp giáo trình chuẩn, sách bài tập, audio và liên kết bài học tương tác.
            </p>

            {/* Quick KPI stats */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-white/10 font-medium backdrop-blur-sm">
                🎯 <strong>{totalRoadmapLessons}</strong> bài học toàn lộ trình
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 font-medium backdrop-blur-sm">
                ✅ <strong>{totalCompleted}</strong> bài đã hoàn thành ({overallPercent}%)
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 font-medium backdrop-blur-sm">
                🌟 <strong>{customLessons.length}</strong> bài học tự bổ sung
              </span>
            </div>
          </div>

          {/* Right Action: Add Lesson to Roadmap */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
            <button
              onClick={() => {
                playClickSound();
                setShowAddModal(true);
              }}
              className="px-5 py-3 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white font-bold text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-100 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus size={18} />
              <span>Thêm bài học vào lộ trình</span>
            </button>

            {/* Overall Progress Meter */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-right min-w-[200px]">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-[#94A3B8]">Tiến độ chung:</span>
                <span className="text-[#E85D3F]">{overallPercent}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#E85D3F] to-[#45B97C] rounded-full transition-all duration-500" 
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Chinese watermark */}
        <div className="absolute right-4 -bottom-6 font-['Noto_Serif_SC'] text-9xl font-black text-white/5 select-none pointer-events-none">
          登攀
        </div>
      </div>

      {/* 3 View Tabs Switcher */}
      <div className="flex items-center justify-center p-1.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => { playClickSound(); setRoadmapView('journey'); }}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            roadmapView === 'journey'
              ? 'bg-[#E85D3F] text-white shadow-xs'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <Compass size={15} />
          <span>Bản đồ hành trình</span>
        </button>
        <button
          type="button"
          onClick={() => { playClickSound(); setRoadmapView('curriculum'); }}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            roadmapView === 'curriculum'
              ? 'bg-[#E85D3F] text-white shadow-xs'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <BookOpen size={15} />
          <span>Khung giáo trình HSK</span>
        </button>
        <button
          type="button"
          onClick={() => { playClickSound(); setRoadmapView('skills'); }}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            roadmapView === 'skills'
              ? 'bg-[#E85D3F] text-white shadow-xs'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <BarChart3 size={15} />
          <span>Kỹ năng & Mục tiêu</span>
        </button>
      </div>

      {/* VIEW 1: 🗺️ JOURNEY MAP (Default gamified view) */}
      {roadmapView === 'journey' && (
        <LearningJourneyMap
          user={user}
          onSelectLesson={(lesson) => setActiveLessonToPlay(lesson)}
          onOpenBoss={(boss) => setActiveBossChallenge(boss)}
          onOpenPlacementTest={() => setShowPlacementTest(true)}
          onOpenDailyMissions={() => setShowDailyMissions(true)}
          onOpenSkills={() => setRoadmapView('skills')}
        />
      )}

      {/* VIEW 2: 📊 SKILL MASTERY & DAILY MISSIONS */}
      {roadmapView === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          <div className="lg:col-span-2 space-y-6">
            <SkillMasteryCard user={user} onNavigateTab={setActiveTab} />
          </div>
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-[#E85D3F] flex items-center justify-center mx-auto text-2xl">
                🔥
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#243447] dark:text-white">
                  Nhiệm vụ hàng ngày
                </h3>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                  Duy trì streak và nhận rương hoàn thành ngày +100 XP
                </p>
              </div>
              <button
                type="button"
                onClick={() => { playClickSound(); setShowDailyMissions(true); }}
                className="w-full py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar size={14} />
                <span>Mở bảng nhiệm vụ ngày</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: 📚 CURRICULUM OVERVIEW */}
      {roadmapView === 'curriculum' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Visual Roadmap Stepper Route */}
          <div className="bg-white dark:bg-[#1E293B] p-4 sm:p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] gap-2">
          {ROADMAP_LEVELS.map((lvl, idx) => {
            const { percent, status } = computeLevelProgress(lvl.id);
            const isCurrent = expandedLevel === lvl.id;

            return (
              <React.Fragment key={lvl.id}>
                <button
                  onClick={() => {
                    playClickSound();
                    setExpandedLevel(lvl.id);
                  }}
                  className={`flex flex-col items-center p-2.5 rounded-2xl transition-all ${
                    isCurrent 
                      ? 'bg-[#FDEEEB] dark:bg-[#2D1E1B] scale-105 shadow-sm' 
                      : 'hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]'
                  }`}
                >
                  <div 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-sm mb-1.5 transition-transform ${
                      status === 'completed' ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: lvl.color }}
                  >
                    {status === 'completed' ? <Check size={18} /> : lvl.code}
                  </div>
                  <span className="text-xs font-bold text-[#243447] dark:text-white whitespace-nowrap">
                    {lvl.level}
                  </span>
                  <span className="text-[10px] text-[#748092] font-semibold">
                    {percent}%
                  </span>
                </button>

                {idx < ROADMAP_LEVELS.length - 1 && (
                  <div className="flex-1 h-0.5 bg-[#F1E5D8] dark:bg-[#2B3A4F] relative mx-1">
                    <div 
                      className="h-full bg-[#E85D3F] transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: 'all', label: 'Tất cả các chặng (6)' },
          { id: 'Sơ cấp', label: 'Sơ cấp (Nhập môn, HSK 1, 2)' },
          { id: 'Trung cấp', label: 'Trung cấp (HSK 3, 4)' },
          { id: 'Cao cấp', label: 'Cao cấp (HSK 5-6)' },
          { id: 'in-progress', label: 'Đang học' },
          { id: 'completed', label: 'Đã hoàn thành' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playClickSound();
              setStageFilter(tab.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              stageFilter === tab.id
                ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                : 'bg-white dark:bg-[#1E293B] text-[#748092] dark:text-[#94A3B8] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-6">
        {filteredLevels.map((level) => {
          const isExpanded = expandedLevel === level.id;
          const levelMaterials = getMaterialsForLevel(level.id);
          const levelLessons = getLevelLessons(level.id);
          const { percent, completedCount, totalCount, status } = computeLevelProgress(level.id);

          return (
            <div 
              key={level.id}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden bg-white dark:bg-[#1E293B] ${
                status === 'in-progress' 
                  ? 'border-[#E85D3F] shadow-lg ring-1 ring-[#E85D3F]/20' 
                  : status === 'completed'
                  ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                  : 'border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md'
              }`}
            >
              {/* Level Card Header */}
              <div 
                onClick={() => {
                  playClickSound();
                  setExpandedLevel(isExpanded ? null : level.id);
                }}
                className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
              >
                <div className="flex items-start md:items-center gap-4">
                  {/* Badge Icon */}
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md shrink-0"
                    style={{ backgroundColor: level.color }}
                  >
                    {level.code}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-[#243447] dark:text-white">
                        {level.level}: {level.title}
                      </h3>
                      
                      {/* Dynamic Real Badge */}
                      {status === 'completed' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] text-xs font-bold">
                          <CheckCircle2 size={14} />
                          <span>Đã hoàn thành 100%</span>
                        </span>
                      ) : status === 'in-progress' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] text-xs font-bold">
                          <Play size={12} className="fill-[#E85D3F]" />
                          <span>Đang học ({completedCount}/{totalCount} bài)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold">
                          <span>Sẵn sàng học ({totalCount} bài)</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-1">
                      {level.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#748092] dark:text-[#94A3B8] pt-1">
                      <span className="font-semibold text-[#243447] dark:text-white">
                        {levelLessons.length} bài học
                      </span>
                      <span>•</span>
                      <span>{level.vocabCount} từ vựng</span>
                      <span>•</span>
                      <span className="text-[#E85D3F] font-bold">
                        {levelMaterials.length} tài liệu số
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#E85D3F]">{percent}%</span>
                    <div className="w-24 h-2 bg-[#FFF9F2] dark:bg-[#131B24] rounded-full overflow-hidden mt-1 border border-[#F1E5D8] dark:border-[#2B3A4F]">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%`, backgroundColor: level.color }}
                      />
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} className="text-[#748092]" /> : <ChevronDown size={20} className="text-[#748092]" />}
                </div>
              </div>

              {/* Level Expanded Details */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2]/40 dark:bg-[#131B24]/40 space-y-6 animate-in slide-in-from-top-2 duration-150">
                  
                  {/* 3 Core Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    
                    {/* Target */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#E85D3F] flex items-center gap-1.5">
                        <Target size={14} />
                        <span>Mục tiêu đầu ra</span>
                      </h4>
                      <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
                        {level.target}
                      </p>
                    </div>

                    {/* Grammar Focus */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4B942] flex items-center gap-1.5">
                        <BookOpen size={14} />
                        <span>Trọng tâm ngữ pháp</span>
                      </h4>
                      <ul className="text-xs text-[#243447] dark:text-[#CBD5E1] space-y-1">
                        {level.grammarPoints.map((gp, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F4B942]" />
                            <span>{gp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills Acquired */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#45B97C] flex items-center gap-1.5">
                        <Award size={14} />
                        <span>Kỹ năng làm chủ</span>
                      </h4>
                      <ul className="text-xs text-[#243447] dark:text-[#CBD5E1] space-y-1">
                        {level.skills.map((sk, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-[#45B97C] shrink-0" />
                            <span>{sk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* REAL MATERIALS ATTACHED TO THIS LEVEL */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#E85D3F] flex items-center gap-2">
                        <FolderDown size={16} />
                        <span>Tài liệu & Giáo trình số đính kèm ({levelMaterials.length})</span>
                      </h4>
                      {setActiveTab && (
                        <button
                          onClick={() => {
                            playClickSound();
                            setActiveTab('materials');
                          }}
                          className="text-xs font-semibold text-[#748092] hover:text-[#E85D3F] flex items-center gap-1"
                        >
                          <span>Thư viện toàn diện</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {levelMaterials.map((mat) => (
                        <div 
                          key={mat.id}
                          className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:border-[#E85D3F] transition-all flex flex-col justify-between space-y-3"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
                                {mat.format}
                              </span>
                              {mat.fileSize && (
                                <span className="text-[10px] text-[#748092]">{mat.fileSize}</span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-[#243447] dark:text-white line-clamp-2 leading-snug">
                              {mat.title}
                            </h5>
                            <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] line-clamp-2">
                              {mat.description}
                            </p>
                          </div>

                          <a
                            href={mat.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#E85D3F] hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Download size={13} />
                            <span>Mở / Tải tài liệu</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* REAL LESSONS LIST WITH DYNAMIC CHECKMARKS & ADD BUTTON */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#243447] dark:text-white flex items-center gap-2">
                        <BookOpen size={16} className="text-[#E85D3F]" />
                        <span>Chương trình các bài học ({completedCount}/{levelLessons.length} bài đã hoàn thành)</span>
                      </h4>
                      
                      <button
                        onClick={() => {
                          playClickSound();
                          setSelectedTargetLevel(level.level === 'Nhập môn' ? 'Nhập môn' : level.code);
                          setShowAddModal(true);
                        }}
                        className="text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1"
                      >
                        <Plus size={14} />
                        <span>Thêm bài học vào chặng này</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {levelLessons.map((les, lIdx) => {
                        const isDone = completedLessonIds.includes(les.id);

                        return (
                          <div
                            key={les.id || lIdx}
                            onClick={() => handleOpenLesson(level.id, lIdx)}
                            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-sm ${
                              isDone
                                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                                : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Completion toggle button */}
                              <button
                                type="button"
                                title={isDone ? 'Đã hoàn thành (Bấm để hủy)' : 'Đánh dấu đã học'}
                                onClick={(e) => handleToggleLessonComplete(e, les.id)}
                                className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-transform hover:scale-110 ${
                                  isDone
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : 'bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]'
                                }`}
                              >
                                {isDone ? <Check size={16} /> : les.number}
                              </button>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h5 className={`text-xs font-bold truncate group-hover:text-[#E85D3F] transition-colors ${
                                    isDone ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-80' : 'text-[#243447] dark:text-white'
                                  }`}>
                                    {les.title}
                                  </h5>
                                  {les.isCustom && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold shrink-0">
                                      Tự thêm
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] truncate">
                                  {les.desc}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] text-[#748092] hidden sm:inline">
                                {les.duration}p • +{les.xp}XP
                              </span>

                              {les.isCustom && (
                                <button
                                  type="button"
                                  title="Xóa bài học này"
                                  onClick={(e) => handleDeleteCustomLesson(les.id, e)}
                                  className="p-1 rounded-md text-[#748092] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}

                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                                isDone
                                  ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                                  : 'bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] group-hover:bg-[#E85D3F] group-hover:text-white'
                              }`}>
                                <Play size={12} className="fill-current ml-0.5" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Action Tools Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <div className="flex flex-wrap items-center gap-2">
                      {setActiveTab && (
                        <>
                          <button
                            onClick={() => {
                              playClickSound();
                              setActiveTab('vocabulary');
                            }}
                            className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[11px] font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white flex items-center gap-1.5 transition-colors"
                          >
                            <BookOpen size={13} className="text-[#E85D3F]" />
                            <span>Từ vựng chặng này</span>
                          </button>
                          
                          {level.id === 'intro' ? (
                            <button
                              onClick={() => {
                                playClickSound();
                                setActiveTab('writing');
                              }}
                              className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[11px] font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white flex items-center gap-1.5 transition-colors"
                            >
                              <PenTool size={13} className="text-[#E85D3F]" />
                              <span>Tập viết chữ Hán</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  playClickSound();
                                  setActiveTab('pronunciation');
                                }}
                                className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[11px] font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <Mic size={13} className="text-[#E85D3F]" />
                                <span>Luyện phát âm</span>
                              </button>

                              <button
                                onClick={() => {
                                  playClickSound();
                                  setActiveTab('conversation');
                                }}
                                className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[11px] font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <MessageCircle size={13} className="text-[#E85D3F]" />
                                <span>Hội thoại AI</span>
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => handleStartLevel(level.id)}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#D44B2E] hover:to-[#B53B22] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>{status === 'completed' ? 'Ôn tập lại chặng này' : 'Bắt đầu học ngay'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD CUSTOM LESSON */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <Plus size={18} className="text-[#E85D3F]" />
                  <span>Thêm Bài Học Mới Vào Lộ Trình</span>
                </h3>
                <p className="text-xs text-[#748092]">
                  Tự thiết kế thêm các bài học thực tế để cá nhân hóa lộ trình của bạn.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#748092] uppercase tracking-wider block">
                ⚡ Gợi ý bài học thực tế chọn nhanh:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_LESSON_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplySuggestion(sug)}
                    className="px-2.5 py-1 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:text-[#E85D3F] transition-all font-medium text-left truncate max-w-full"
                  >
                    {sug.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAddNewLesson} className="space-y-4">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Tên bài học *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Đàm thoại đặt đồ ăn qua Meituan..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Level Target & Duration & XP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Chặng lộ trình
                  </label>
                  <select
                    value={selectedTargetLevel}
                    onChange={(e) => setSelectedTargetLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  >
                    <option value="Nhập môn">Nhập môn</option>
                    <option value="HSK 1">HSK 1</option>
                    <option value="HSK 2">HSK 2</option>
                    <option value="HSK 3">HSK 3</option>
                    <option value="HSK 4">HSK 4</option>
                    <option value="HSK 5-6">HSK 5-6</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Thời lượng (phút)
                  </label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Điểm XP thưởng
                  </label>
                  <input
                    type="number"
                    value={newXp}
                    onChange={(e) => setNewXp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Tóm tắt nội dung bài học & ngữ pháp
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Mô tả các mẫu câu, từ vựng và tình huống ứng dụng trong bài học này..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5"
                >
                  <Plus size={15} />
                  <span>Lưu bài học vào lộ trình</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Close VIEW 3: CURRICULUM OVERVIEW */}
      </div>
      )}

      {/* Boss Challenge Modal */}
      {activeBossChallenge && (
        <BossChallengeModal
          bossChallenge={activeBossChallenge}
          user={user}
          onClose={() => setActiveBossChallenge(null)}
          onBossBeaten={() => {
            showToast('🎉 Chúc mừng bạn đã đánh bại Boss (+200 XP)!');
            if (onAddXp) onAddXp(200);
          }}
        />
      )}

      {/* Placement Test Modal */}
      {showPlacementTest && (
        <PlacementTestModal
          user={user}
          onClose={() => setShowPlacementTest(false)}
          onTestCompleted={(res) => {
            showToast(`🎉 Đã đánh giá trình độ: ${res.levelTitle}!`);
            if (onAddXp) onAddXp(100);
          }}
        />
      )}

      {/* Daily Missions Modal */}
      {showDailyMissions && (
        <DailyMissionsModal
          user={user}
          onClose={() => setShowDailyMissions(false)}
          onRewardClaimed={(xp) => {
            showToast(`🎉 Nhận thành công +${xp} XP!`);
            if (onAddXp) onAddXp(xp);
          }}
        />
      )}

    </div>
  );
}
