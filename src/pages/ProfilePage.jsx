import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  User, 
  Flame, 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  Calendar,
  Award,
  CheckCircle2,
  Edit3,
  Camera,
  Upload,
  X,
  Check,
  Shield,
  Sparkles
} from 'lucide-react';
import PersonalizationSettingsModal from '../components/personalization/PersonalizationSettingsModal.jsx';
import { isPersonalizationEnabled } from '../services/learnerContextService.js';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { calculateTotalXp, getStreakStatus, getUserLevelInfo, getUserStorageKey } from '../utils/gamification';
import { evaluateUserAchievements } from '../services/gamificationService';
import StreakModal from '../components/learning/StreakModal';
import DataSubjectRequestModal from '../components/DataSubjectRequestModal';
import { updateUserProfile } from '../supabase/services.js';
import { 
  LEARNING_GOALS, 
  getUserLearningGoal, 
  saveUserLearningGoal, 
  getUserDailyGoalMinutes, 
  saveUserDailyGoalMinutes 
} from '../services/learningPathService.js';
import { 
  calculateScholarRank, 
  evaluateAcademicBadges,
  getLocalDateStringInTz 
} from '../utils/gamificationEngine.js';
import { calculate4SkillCompetency } from '../utils/competencyAnalytics.js';
import { 
  checkGraduationEligibility, 
  issueHskCertificate,
  getUserIssuedCertificates,
  CERTIFICATES_STORAGE_KEY 
} from '../utils/certificateEngine.js';
import CompetencyAnalyticsPanel from '../components/analytics/CompetencyAnalyticsPanel.jsx';
import CertificateGeneratorModal from '../components/certificate/CertificateGeneratorModal.jsx';
import CertificateVerificationModal from '../components/certificate/CertificateVerificationModal.jsx';


// Preset avatar collection
const PRESET_AVATARS = [
  { id: 'panda', name: 'Gấu trúc', emoji: '🐼', color: '#FFF5F2' },
  { id: 'tiger', name: 'Hổ dũng', emoji: '🐯', color: '#FEF7E9' },
  { id: 'dragon', name: 'Rồng vàng', emoji: '🐲', color: '#FFF8E6' },
  { id: 'scholar', name: 'Học sĩ', emoji: '🎓', color: '#EBF8F2' },
  { id: 'monkey', name: 'Đại Thánh', emoji: '🐒', color: '#FDEEEB' },
  { id: 'lantern', name: 'Lồng đèn', emoji: '🏮', color: '#FDEEEB' },
  { id: 'tea', name: 'Trà đạo', emoji: '🍵', color: '#EBF8F2' },
  { id: 'bamboo', name: 'Trúc xanh', emoji: '🎋', color: '#EBF8F2' }
];

const HSK_LEVEL_OPTIONS = [
  'Nhập môn - Pinyin & Nét bút',
  'HSK 1 - Sơ cấp',
  'HSK 2 - Sơ cấp nâng cao',
  'HSK 3 - Trung cấp 1',
  'HSK 4 - Trung cấp 2',
  'HSK 5 - Cao cấp 1',
  'HSK 6 - Cao cấp 2'
];

export default function ProfilePage({ 
  user, 
  onUpdateUser,
  onLogout, 
  darkMode, 
  setDarkMode, 
  soundEnabled, 
  setSoundEnabled,
  setActiveTab
}) {
  const [reminderTime, setReminderTime] = useState('20:00');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(() => String(getUserDailyGoalMinutes(user)));
  const [learningGoal, setLearningGoal] = useState(() => getUserLearningGoal(user));
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isPersonalizationModalOpen, setIsPersonalizationModalOpen] = useState(false);
  const [isDsarModalOpen, setIsDsarModalOpen] = useState(false);

  // Edit Profile Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editLevel, setEditLevel] = useState(user?.level || 'HSK 1 - Sơ cấp');
  const [editAvatar, setEditAvatar] = useState(() => user?.avatar || localStorage.getItem('hanzigo_custom_avatar') || '');
  const [editBio, setEditBio] = useState(() => user?.bio || localStorage.getItem('hanzigo_user_bio') || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileToast, setProfileToast] = useState('');

  const fileInputRef = useRef(null);

  const [gamificationTick, setGamificationTick] = useState(0);

  useEffect(() => {
    const handleGamificationUpdated = () => setGamificationTick(t => t + 1);
    window.addEventListener('hanzigo_gamification_updated', handleGamificationUpdated);
    window.addEventListener('storage', handleGamificationUpdated);
    return () => {
      window.removeEventListener('hanzigo_gamification_updated', handleGamificationUpdated);
      window.removeEventListener('storage', handleGamificationUpdated);
    };
  }, []);

  const streakStatus = useMemo(() => getStreakStatus(user), [user, gamificationTick]);
  const streakCount = useMemo(() => {
    const s = streakStatus.streak || 0;
    const uStreak = typeof user?.streak === 'number' && !isNaN(user.streak) ? user.streak : 0;
    let localKeyVal = 0;
    let globalVal = 0;
    try {
      const k = getUserStorageKey('hanzigo_streak_count', user);
      localKeyVal = parseInt(localStorage.getItem(k) || '0', 10) || 0;
      globalVal = parseInt(localStorage.getItem('hanzigo_streak_count') || '0', 10) || 0;
    } catch {}
    return Math.max(s, uStreak, localKeyVal, globalVal);
  }, [streakStatus, user]);

  // Dynamic learning stats from storage for this specific user
  const rememberedIds = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_vocab_remembered', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_vocab_remembered'));
      const parsed = s ? JSON.parse(s) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [user, gamificationTick]);

  const completedLessonIds = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_completed_lessons', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_completed_lessons'));
      const parsed = s ? JSON.parse(s) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [user, gamificationTick]);

  const pronounceHistory = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_pronounce_history', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_pronounce_history'));
      const parsed = s ? JSON.parse(s) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [user, gamificationTick]);

  const customWritingChars = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_custom_writing_chars', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_custom_writing_chars'));
      const parsed = s ? JSON.parse(s) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [user, gamificationTick]);

  const wordsLearnedCount = rememberedIds.length > 0 ? rememberedIds.length : (user?.wordsLearned || 0);

  const totalStudyHours = useMemo(() => {
    const mins = (completedLessonIds.length * 15) + (rememberedIds.length * 2) + (pronounceHistory.length * 3) + (customWritingChars.length * 3);
    return mins > 0 ? (mins / 60).toFixed(1) : (user ? '0.5' : '0');
  }, [completedLessonIds, rememberedIds, pronounceHistory, customWritingChars, user]);

  const totalXp = useMemo(() => calculateTotalXp(user), [user, gamificationTick]);
  const levelInfo = useMemo(() => getUserLevelInfo(totalXp), [totalXp]);

  // Phase 12: 10 Scholar Ranks & 18 Academic Badges
  const scholarRank = useMemo(() => calculateScholarRank(totalXp), [totalXp]);

  // Exam attempts from local/cloud
  const examAttempts = useMemo(() => {
    try {
      const raw = localStorage.getItem('hanzigo_hsk_attempts');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  }, [gamificationTick]);

  // 4-Skill Competency calculation (Pure mathematical formulation)
  const targetHskLevel = useMemo(() => {
    const raw = user?.level || 'HSK 1 - Sơ cấp';
    const match = raw.match(/HSK\s*([1-6])/i);
    return match ? `HSK ${match[1]}` : 'HSK 1';
  }, [user?.level]);

  const roleplayHistory = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_roleplay_history', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_roleplay_history'));
      const parsed = s ? JSON.parse(s) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [user, gamificationTick]);

  const smartReaderHistory = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_reader_completed', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_reader_completed'));
      const parsed = s ? JSON.parse(s) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [user, gamificationTick]);

  const competencyScores = useMemo(() => {
    const examListening = examAttempts
      .map(a => a?.skillBreakdown?.listening?.accuracy ?? (a?.passed ? a?.accuracyPercentage : null))
      .filter(n => typeof n === 'number' && !isNaN(n));
    const examReading = examAttempts
      .map(a => a?.skillBreakdown?.reading?.accuracy ?? (a?.passed ? a?.accuracyPercentage : null))
      .filter(n => typeof n === 'number' && !isNaN(n));

    const realPronounceScores = pronounceHistory
      .map(p => (typeof p === 'object' && typeof p?.score === 'number' ? p.score : null))
      .filter(s => s !== null);

    const realWritingScores = customWritingChars
      .map(c => (typeof c === 'object' && typeof c?.score === 'number' ? c.score : null))
      .filter(s => s !== null);

    const completedMissionsCount = roleplayHistory.reduce((acc, r) => acc + (r?.completedMissions?.length || r?.missionsCompleted || 0), 0);
    const totalMissionsCount = roleplayHistory.reduce((acc, r) => acc + (r?.totalMissions || 3), 0);

    return calculate4SkillCompetency({
      targetLevel: targetHskLevel,
      completedAudioSteps: Math.min(20, completedLessonIds.length),
      totalTargetAudioSteps: 20,
      examListeningScores: examListening,
      blindAudioSessionsCount: Math.min(10, completedLessonIds.length),
      pronunciationScores: realPronounceScores,
      roleplayCompletedMissions: completedMissionsCount,
      roleplayTotalMissions: totalMissionsCount,
      matureSrsCardsCount: rememberedIds.length,
      examReadingScores: examReading,
      smartReaderCompletedArticles: smartReaderHistory.length,
      writingStrokeScores: realWritingScores,
      uniqueCharsPracticedCount: customWritingChars.length
    });
  }, [targetHskLevel, completedLessonIds, examAttempts, pronounceHistory, rememberedIds, customWritingChars, roleplayHistory, smartReaderHistory]);

  // Phase 12: 18 Academic Badges
  const academicBadges = useMemo(() => {
    const graduations = {};
    ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'].forEach(lvl => {
      const eligibility = checkGraduationEligibility({
        hskLevel: lvl,
        completedLessonIds,
        examAttempts
      });
      if (eligibility.isEligible) {
        graduations[lvl] = true;
      }
    });

    const hasPerfect = examAttempts.some(a => a && ((a.accuracyPercentage || a.score) >= 100));
    const maxExam = examAttempts.reduce((max, a) => Math.max(max, (a && (a.accuracyPercentage || a.score)) || 0), 0);

    return evaluateAcademicBadges({
      currentStreak: streakCount,
      longestStreak: streakCount,
      hskGraduations: graduations,
      hskLessonCounts: { [targetHskLevel]: completedLessonIds.length },
      highScoreWritingCharsCount: customWritingChars.filter(c => (typeof c === 'object' && c && (c.score || 0) >= 90)).length,
      matureSrsCardsCount: rememberedIds.length,
      smartReaderCompletedCount: smartReaderHistory.length,
      roleplayFullMissionsCount: roleplayHistory.filter(r => (r?.completedMissions?.length || 0) >= 3 || r?.allCompleted).length,
      hasPerfectExamScore: hasPerfect,
      maxExamPercentage: maxExam,
      completedLessonsTotal: completedLessonIds.length,
      vocabRememberedTotal: rememberedIds.length,
      highAccuracyListeningCount: Math.min(completedLessonIds.length, 30)
    });
  }, [streakCount, completedLessonIds, examAttempts, targetHskLevel, customWritingChars, rememberedIds, smartReaderHistory, roleplayHistory]);

  // 365-day Activity Log synthesized from user progress & test attempts
  const activityLog = useMemo(() => {
    const log = {};
    const todayStr = getLocalDateStringInTz(new Date());
    if (streakCount > 0 && todayStr) {
      log[todayStr] = { count: Math.max(1, completedLessonIds.length), xp: Math.min(totalXp, 100) };
    }
    examAttempts.forEach(att => {
      const dateStr = (att?.created_at || att?.date || '').slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        if (!log[dateStr]) log[dateStr] = { count: 0, xp: 0 };
        log[dateStr].count += 1;
        log[dateStr].xp += att.score || 50;
      }
    });
    return log;
  }, [streakCount, completedLessonIds.length, totalXp, examAttempts]);

  // Direct navigation router for analytics recommendations
  const handleAnalyticsNavigate = (rawTab) => {
    const tab = String(rawTab || '').replace(/^\//, '');
    let target = tab;
    if (tab === 'learning-path') target = 'roadmap';
    if (tab === 'srs') target = 'vocabulary';
    if (setActiveTab) {
      setActiveTab(target);
    } else {
      window.location.hash = `#${target}`;
    }
  };

  // Certificates list & modal state
  const [issuedCertificates, setIssuedCertificates] = useState([]);
  const [selectedCertForView, setSelectedCertForView] = useState(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [certActionMessage, setCertActionMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    getUserIssuedCertificates(user).then(certs => {
      if (isMounted && Array.isArray(certs)) {
        setIssuedCertificates(certs);
      }
    }).catch(() => {
      try {
        const raw = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
        if (raw && isMounted) {
          setIssuedCertificates(JSON.parse(raw));
        }
      } catch {}
    });
    return () => { isMounted = false; };
  }, [user, gamificationTick]);

  const handleClaimCertificate = async (level) => {
    playClickSound();
    const result = await issueHskCertificate({
      user,
      hskLevel: level,
      completedLessonIds,
      examAttempts,
      issueDate: new Date()
    });

    if (result.success) {
      playSuccessSound();
      setSelectedCertForView(result.certificate);
      setIssuedCertificates(prev => [result.certificate, ...prev.filter(c => c.id !== result.certificate.id)]);
      setCertActionMessage(`Chúc mừng bạn đã nhận Chứng nhận Tốt nghiệp ${level}!`);
    } else {
      alert(`Chưa đủ điều kiện: ${result.details?.join('\n') || result.message}`);
    }
  };


  const handleOpenEditModal = () => {
    playClickSound();
    setEditName(user?.name || '');
    setEditLevel(user?.level || 'HSK 1 - Sơ cấp');
    setEditAvatar(user?.avatar || localStorage.getItem('hanzigo_custom_avatar') || '');
    setEditBio(user?.bio || localStorage.getItem('hanzigo_user_bio') || '');
    setIsEditModalOpen(true);
  };

  // Helper: Compress and center-crop uploaded image to compact 256x256 DataURL (~20KB)
  const compressAvatarImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const targetSize = 256;
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');

          // Center-crop to square
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, targetSize, targetSize);

          // Compress to JPEG with 0.85 quality (~15-25KB, safe for localStorage & DB)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressedDataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle local image file upload with instant compression
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh có kích thước dưới 10MB.');
      return;
    }

    try {
      const compressedDataUrl = await compressAvatarImage(file);
      setEditAvatar(compressedDataUrl);
      playClickSound();
    } catch (err) {
      console.error('Image compression failed:', err);
      // Fallback to direct read if canvas fails
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditAvatar(event.target.result);
        playClickSound();
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes to local state & Supabase
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    setIsSavingProfile(true);
    playSuccessSound();

    const finalAvatar = editAvatar || null;

    const updatedData = {
      name: editName.trim(),
      level: editLevel,
      avatar: finalAvatar,
      bio: editBio.trim()
    };

    // 1. Persist custom avatar locally immediately
    try {
      if (finalAvatar) {
        localStorage.setItem('hanzigo_custom_avatar', finalAvatar);
      } else {
        localStorage.removeItem('hanzigo_custom_avatar');
      }
      localStorage.setItem('hanzigo_user_bio', updatedData.bio);
    } catch (err) {
      console.warn('LocalStorage avatar save error:', err);
    }

    // 2. Update Supabase if user is logged in
    const uid = user?.uid || user?.id;
    if (uid) {
      try {
        await updateUserProfile(uid, {
          name: updatedData.name,
          level: updatedData.level,
          avatar: updatedData.avatar
        });
      } catch (err) {
        console.warn('Could not sync profile to Supabase:', err);
      }
    }

    // 3. Update global user state in App.jsx
    if (onUpdateUser) {
      onUpdateUser(prev => {
        const next = {
          ...(prev || {}),
          name: updatedData.name,
          level: updatedData.level,
          avatar: updatedData.avatar,
          bio: updatedData.bio
        };
        try {
          localStorage.setItem('hanzigo_user', JSON.stringify(next));
        } catch (e) {
          console.warn('LocalStorage save hanzigo_user error:', e);
        }
        return next;
      });
    }

    setIsSavingProfile(false);
    setIsEditModalOpen(false);
    setProfileToast('Đã cập nhật thông tin cá nhân và ảnh đại diện thành công!');
    setTimeout(() => setProfileToast(''), 3000);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveUserDailyGoalMinutes(Number(dailyGoalMinutes), user);
    saveUserLearningGoal(learningGoal, user);

    if (onUpdateUser) {
      onUpdateUser(prev => {
        const next = {
          ...(prev || {}),
          dailyGoalMinutes: Number(dailyGoalMinutes),
          learningGoal: learningGoal
        };
        try {
          localStorage.setItem('hanzigo_user', JSON.stringify(next));
        } catch {}
        return next;
      });
    }

    playSuccessSound();
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {profileToast && (
        <div className="fixed top-20 right-5 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 size={20} />
          <span className="text-xs sm:text-sm font-bold">{profileToast}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Subtle background ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#E85D3F]/10 via-[#F4B942]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
          
          {/* Avatar with Camera Action Button */}
          <div 
            className="relative group cursor-pointer"
            onClick={handleOpenEditModal}
            title="Bấm để đổi ảnh đại diện"
          >
            {(() => {
              const activeAvatar = user?.avatar || localStorage.getItem('hanzigo_custom_avatar') || null;
              if (activeAvatar) {
                return activeAvatar.length <= 4 ? (
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#FFF5F2] dark:bg-[#2C1D1A] border-4 border-[#E85D3F] flex items-center justify-center text-4xl shadow-md group-hover:scale-105 transition-transform">
                    {activeAvatar}
                  </div>
                ) : (
                  <img 
                    src={activeAvatar} 
                    alt={user?.name || 'Avatar'}
                    className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover border-4 border-[#E85D3F] shadow-md group-hover:scale-105 transition-transform"
                  />
                );
              }
              return (
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] border-4 border-[#E85D3F] flex items-center justify-center text-[#E85D3F] font-black text-3xl shadow-md group-hover:scale-105 transition-transform">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={40} />}
                </div>
              );
            })()}

            <button 
              type="button"
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#E85D3F] hover:bg-[#CB4529] text-white shadow-md border-2 border-white dark:border-[#1E293B] transition-transform group-hover:scale-110"
              title="Đổi ảnh đại diện"
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
                {user?.name || 'Học viên HanziGo'}
              </h1>
              {user?.role === 'teacher' ? (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] text-[11px] font-bold border border-[#E85D3F]/30 w-fit mx-auto sm:mx-0">
                  🧑‍🏫 Giáo viên
                </span>
              ) : user?.role === 'admin' ? (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-300 dark:border-emerald-800 w-fit mx-auto sm:mx-0">
                  🛡️ Quản trị viên
                </span>
              ) : (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[11px] font-bold border border-blue-200 dark:border-blue-800 w-fit mx-auto sm:mx-0">
                  🎓 Học viên
                </span>
              )}
              {user?.level && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] text-[11px] font-bold border border-[#F4B942]/30 w-fit mx-auto sm:mx-0">
                  {user.level}
                </span>
              )}
            </div>

            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              {user?.email || 'Tài khoản học viên'}
            </p>

            {(user?.bio || localStorage.getItem('hanzigo_user_bio')) && (
              <p className="text-xs text-[#E85D3F] dark:text-[#F7A693] font-medium italic pt-0.5">
                “{user?.bio || localStorage.getItem('hanzigo_user_bio')}”
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] text-xs font-bold flex items-center gap-1 border border-[#45B97C]/20">
                <span>{levelInfo.badge}</span>
                <span>{levelInfo.title}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsStreakModalOpen(true);
                }}
                className="px-2.5 py-0.5 rounded-full bg-[#FEF7E9] dark:bg-[#2D2619] hover:bg-[#FDE8BF] dark:hover:bg-[#3E3422] text-[#D97706] text-xs font-bold flex items-center gap-1 border border-[#F4B942]/30 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Nhấn để xem chi tiết chuỗi học và nhận thưởng"
              >
                <Flame size={12} className="fill-[#F4B942]" />
                <span>Streak {streakCount} ngày</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 self-center md:self-start z-10">
          <button
            onClick={handleOpenEditModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#D44B2E] hover:to-[#B53B22] text-white text-xs font-bold transition-all shadow-md shadow-[#E85D3F]/25 hover:shadow-lg hover:shadow-[#E85D3F]/35 flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 size={14} />
            <span>Chỉnh sửa hồ sơ</span>
          </button>
          
          <button
            onClick={() => {
              playClickSound();
              onLogout();
            }}
            className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/60 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Đăng xuất</span>
          </button>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#E85D3F] to-[#CB4529] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Edit3 size={20} />
                <h3 className="text-base sm:text-lg font-bold">Chỉnh sửa hồ sơ cá nhân</h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-6">
              
              {/* 1. Avatar Selection Section */}
              <div className="space-y-3 pb-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
                <label className="block text-xs font-bold text-[#243447] dark:text-white uppercase tracking-wider">
                  Ảnh đại diện (Avatar)
                </label>

                <div className="flex items-center gap-4">
                  {/* Avatar Preview */}
                  <div className="relative">
                    {editAvatar ? (
                      editAvatar.length <= 4 ? (
                        <div className="w-20 h-20 rounded-full bg-[#FFF5F2] dark:bg-[#2C1D1A] border-4 border-[#E85D3F] flex items-center justify-center text-4xl shadow-md">
                          {editAvatar}
                        </div>
                      ) : (
                        <img 
                          src={editAvatar} 
                          alt="Avatar preview" 
                          className="w-20 h-20 rounded-full object-cover border-4 border-[#E85D3F] shadow-md"
                        />
                      )
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] border-4 border-[#E85D3F] flex items-center justify-center text-[#E85D3F] font-black text-2xl shadow-md">
                        {editName ? editName.charAt(0).toUpperCase() : <User size={36} />}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageFileChange} 
                    />
                    
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#E85D3F]/40 text-[#E85D3F] hover:bg-[#FDEEEB] dark:hover:bg-[#2D1E1B] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Upload size={14} />
                        <span>Tải ảnh từ máy</span>
                      </button>

                      {editAvatar && (
                        <button
                          type="button"
                          onClick={() => setEditAvatar('')}
                          className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 text-[#748092] hover:text-red-500 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Xóa ảnh
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                      Hỗ trợ định dạng JPG, PNG, WEBP (Tối đa 4MB).
                    </p>
                  </div>
                </div>

                {/* Preset Avatars Grid */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-2">
                    Hoặc chọn linh vật may mắn có sẵn:
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PRESET_AVATARS.map((p) => {
                      const isSelected = editAvatar === p.emoji;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setEditAvatar(p.emoji);
                          }}
                          className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#FDEEEB] dark:bg-[#2D1E1B] border-[#E85D3F] scale-105 shadow-sm' 
                              : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/50'
                          }`}
                        >
                          <span className="text-2xl">{p.emoji}</span>
                          <span className="text-[9px] font-bold text-[#748092] dark:text-[#94A3B8] truncate w-full text-center">
                            {p.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Personal Information Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                    Họ và tên hiển thị *
                  </label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                    Trình độ hiện tại / Mục tiêu
                  </label>
                  <select 
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  >
                    {HSK_LEVEL_OPTIONS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                    Châm ngôn / Mục tiêu học tập cá nhân
                  </label>
                  <textarea 
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Ví dụ: Mục tiêu đạt HSK 3 trong 3 tháng tới! Mỗi ngày học 15 phút."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-medium text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1.5 flex items-center gap-1.5">
                    <Shield size={13} />
                    <span>Email đăng nhập (Không thể thay đổi)</span>
                  </label>
                  <input 
                    type="email" 
                    value={user?.email || 'Chưa đăng nhập'}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 text-xs font-medium text-[#748092] cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-[#748092] hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#D44B2E] hover:to-[#B53B22] text-white text-xs font-bold transition-all shadow-md shadow-[#E85D3F]/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <span>Đang lưu...</span>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Lưu thay đổi</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Level Progress Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#FFF9F2] to-amber-500/10 dark:from-[#1E293B] dark:via-[#131B24] dark:to-[#1E293B] border border-amber-200 dark:border-amber-900/40 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">{levelInfo.badge}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-amber-500 text-white">
                  Cấp {levelInfo.level}
                </span>
                <h3 className="text-sm sm:text-base font-black text-[#243447] dark:text-white">
                  {levelInfo.title}
                </h3>
                <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
                  • {levelInfo.hskEquivalent}
                </span>
              </div>
              <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] mt-0.5">
                {levelInfo.xpToNextLevel > 0 
                  ? `Cần thêm ${levelInfo.xpToNextLevel} XP để thăng cấp tiếp theo` 
                  : 'Đã đạt đẳng cấp cao nhất!'}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-black text-amber-600 dark:text-amber-400">
              {totalXp} XP / {levelInfo.maxXp} XP
            </span>
            <p className="text-[10px] text-[#748092] font-semibold">{levelInfo.currentProgressPercent}% hoàn thành cấp</p>
          </div>
        </div>

        <div className="w-full h-3 bg-amber-100 dark:bg-amber-950/40 rounded-full overflow-hidden border border-amber-200 dark:border-amber-900/40">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-[#E85D3F] rounded-full transition-all duration-500"
            style={{ width: `${levelInfo.currentProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => {
            playClickSound();
            setIsStreakModalOpen(true);
          }}
          className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center cursor-pointer hover:border-[#E85D3F]/60 hover:shadow-md transition-all active:scale-95 group relative overflow-hidden"
          title="Nhấn để xem lịch chuỗi học, khiên bảo vệ và quà mốc streak"
        >
          <div className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300 opacity-80 group-hover:opacity-100">
            Xem thưởng ✨
          </div>
          <p className="text-[10px] uppercase font-bold text-[#748092]">Chuỗi học</p>
          <p className="text-2xl font-black text-[#E85D3F] mt-1 group-hover:scale-105 transition-transform">{streakCount} ngày 🔥</p>
          <p className="text-[10px] text-[#45B97C] font-semibold mt-0.5">
            {streakStatus.hasStudiedToday ? 'Đã học hôm nay ✅' : 'Chưa học hôm nay'}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center">
          <p className="text-[10px] uppercase font-bold text-[#748092]">Từ vựng vững</p>
          <p className="text-2xl font-black text-[#45B97C] mt-1">{wordsLearnedCount} từ 📚</p>
          <p className="text-[10px] text-[#748092] font-semibold mt-0.5">Đã ghi nhớ</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center">
          <p className="text-[10px] uppercase font-bold text-[#748092]">Tổng giờ học</p>
          <p className="text-2xl font-black text-[#3B82F6] mt-1">{totalStudyHours} giờ ⏱️</p>
          <p className="text-[10px] text-[#748092] font-semibold mt-0.5">Thời gian tích lũy</p>
        </div>
        <div 
          onClick={() => {
            playClickSound();
            if (setActiveTab) setActiveTab('leaderboard');
            else window.location.hash = '#leaderboard';
          }}
          className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center cursor-pointer hover:border-[#E85D3F]/60 hover:shadow-md transition-all active:scale-95 group relative overflow-hidden"
          title="Nhấn để xem Bảng Vàng vinh danh cao thủ XP ⚡"
        >
          <div className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 opacity-80 group-hover:opacity-100">
            Bảng Vàng 🏆
          </div>
          <p className="text-[10px] uppercase font-bold text-[#748092]">Tổng EXP</p>
          <p className="text-2xl font-black text-[#F4B942] mt-1 group-hover:scale-105 transition-transform">{totalXp} XP ⚡</p>
          <p className="text-[10px] text-[#D97706] font-semibold mt-0.5">Điểm kinh nghiệm</p>
        </div>
      </div>

      {/* =========================================================================
          PHASE 12: COMPETENCY ANALYTICS PANEL & RADAR CHART
          ========================================================================= */}
      <CompetencyAnalyticsPanel
        competencyScores={competencyScores}
        activityLog={activityLog}
        targetLevel={targetHskLevel}
        streak={streakCount}
        scholarRank={scholarRank}
        onNavigate={handleAnalyticsNavigate}
      />

      {/* =========================================================================
          PHASE 12: 18 ACADEMIC ACHIEVEMENT BADGES
          ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
            <Award size={18} className="text-[#F4B942]" />
            <span>Bộ 18 Huy Hiệu Học Thuật ({academicBadges.filter(a => a.isUnlocked).length}/18)</span>
          </h3>
          <span className="text-xs text-[#748092]">Theo chuẩn khảo thí & chuyên cần</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {academicBadges.map((badge) => (
            <div 
              key={badge.id}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                badge.isUnlocked 
                  ? 'bg-gradient-to-b from-[#FFFDF9] to-[#FFF5F2] dark:from-[#1E293B] dark:to-[#172231] border-amber-300 dark:border-amber-900/60 shadow-sm' 
                  : 'bg-gray-50/80 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 opacity-50 grayscale'
              }`}
            >
              <span className="text-3xl block mb-1.5">{badge.icon}</span>
              <p className="text-xs font-black text-[#243447] dark:text-white truncate">{badge.title}</p>
              <p className="text-[10px] text-[#E85D3F] font-bold">{badge.chineseTitle}</p>
              <p className="text-[9px] text-[#748092] mt-1 line-clamp-2">{badge.description}</p>
              
              <div className="mt-2">
                {badge.isUnlocked ? (
                  <span className="inline-block text-[9px] font-black text-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] px-2 py-0.5 rounded-full">
                    Đã mở khóa
                  </span>
                ) : (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#E85D3F] h-full rounded-full" 
                      style={{ width: `${badge.progress}%` }} 
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PHASE 12: VERIFIABLE HSK CERTIFICATES SECTION
          ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-[#243447] dark:text-white flex items-center gap-2">
              <span className="text-xl">📜</span>
              <span>Chứng Nhận Tốt Nghiệp HSK Chuẩn Quốc Tế</span>
            </h3>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-0.5">
              Cấp phát chứng nhận hoàn thành khi học viên đạt đủ 20/20 bài học và vượt qua kỳ thi Mock Exam (≥ 80%).
            </p>
          </div>

          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Tra cứu mã chứng nhận</span>
          </button>
        </div>

        {certActionMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{certActionMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'].map((lvl) => {
            const eligibility = checkGraduationEligibility({
              hskLevel: lvl,
              completedLessonIds,
              examAttempts
            });

            const issued = (Array.isArray(issuedCertificates) ? issuedCertificates : []).find(c => c && c.hskLevel === lvl);

            return (
              <div
                key={lvl}
                className={`p-5 rounded-2xl border transition-all ${
                  issued 
                    ? 'border-emerald-300 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/20' 
                    : eligibility.isEligible
                      ? 'border-amber-300 bg-amber-50/30 dark:border-amber-800 dark:bg-amber-950/20'
                      : 'border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-[#E85D3F] text-white">
                    {lvl}
                  </span>
                  {issued ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Đã cấp bằng
                    </span>
                  ) : eligibility.isEligible ? (
                    <span className="text-[11px] font-bold text-amber-600">Đủ điều kiện nhận</span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-semibold">Đang tích lũy</span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-[#243447] dark:text-white mb-1">
                  Chứng nhận Hoàn thành {lvl}
                </h4>

                <div className="text-[11px] text-slate-500 space-y-1 mb-4">
                  <div className="flex justify-between">
                    <span>Bài học ({eligibility.completedLessons}/20):</span>
                    <strong className={eligibility.isLessonsCompleted ? 'text-emerald-600' : 'text-slate-600'}>
                      {eligibility.lessonsProgressPercent}%
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Điểm thi thử:</span>
                    <strong className={eligibility.hasPassedExam ? 'text-emerald-600' : 'text-slate-600'}>
                      {eligibility.bestExamPercentage}% (Chuẩn ≥80%)
                    </strong>
                  </div>
                </div>

                {issued ? (
                  <button
                    onClick={() => setSelectedCertForView(issued)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Xem & In Chứng Nhận A4
                  </button>
                ) : eligibility.isEligible ? (
                  <button
                    onClick={() => handleClaimCertificate(lvl)}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-[#E85D3F] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-transform"
                  >
                    Nhận Chứng Nhận Ngay ✨
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed"
                  >
                    Chưa đủ điều kiện
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>


      {/* Account Settings Form */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
          <Settings size={16} className="text-[#748092]" />
          <span>Cài đặt học tập & Thông báo</span>
        </h3>

        {showSavedToast && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Đã lưu thành công các cài đặt cá nhân!</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-4 max-w-lg">
          
          <div>
            <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
              Giờ nhắc nhở học mỗi tối
            </label>
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#E85D3F]" />
              <input 
                type="time" 
                value={reminderTime} 
                onChange={(e) => setReminderTime(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
              />
              <span className="text-xs text-[#748092]">Hệ thống gửi thông báo nhắc vào giờ này</span>
            </div>
          </div>

          {/* Learning Goal Selector */}
          <div>
            <label className="block text-xs font-bold text-[#243447] dark:text-white mb-2">
              Mục tiêu học tập ưu tiên
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(LEARNING_GOALS).map((g) => {
                const isSelected = learningGoal === g.id;
                return (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => {
                      playClickSound();
                      setLearningGoal(g.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-[#FFF5F2] dark:bg-[#2C1D1A] border-[#E85D3F] shadow-xs'
                        : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/40'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{g.icon}</span>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-black ${isSelected ? 'text-[#E85D3F]' : 'text-[#243447] dark:text-white'}`}>
                          {g.name}
                        </span>
                        {isSelected && (
                          <Check size={12} className="text-[#E85D3F]" />
                        )}
                      </div>
                      <p className="text-[10px] text-[#748092] dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {g.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Study Time */}
          <div>
            <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
              Thời gian học mục tiêu mỗi ngày
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {['10', '15', '20', '30', '45', '60'].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => {
                    playClickSound();
                    setDailyGoalMinutes(mins);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    dailyGoalMinutes === mins 
                      ? 'bg-[#E85D3F] text-white shadow-xs' 
                      : 'border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] dark:hover:text-white'
                  }`}
                >
                  {mins} phút
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#243447] dark:text-white">Hiệu ứng âm thanh khi làm bài</p>
              <p className="text-[10px] text-[#748092] dark:text-[#94A3B8]">Âm thanh vui tươi khi trả lời đúng câu hỏi</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playClickSound();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-[#45B97C]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
                {darkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
                <span>Giao diện tối (Dark Mode)</span>
              </p>
              <p className="text-[10px] text-[#748092] dark:text-[#94A3B8]">Giảm mỏi mắt khi học vào ban đêm</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDarkMode(!darkMode);
                playClickSound();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                darkMode ? 'bg-[#E85D3F]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* AI Personalization Deep Settings Banner */}
          <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-gray-800/60 border border-orange-200/80 dark:border-gray-700 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#E85D3F]" />
                <span className="text-xs font-bold text-[#243447] dark:text-white">
                  Động cơ Cá nhân hóa AI (Lão Sư HanziGo)
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isPersonalizationEnabled(user)
                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {isPersonalizationEnabled(user) ? 'Đang kích hoạt' : 'Đã tắt'}
              </span>
            </div>
            <p className="text-[11px] text-[#748092] dark:text-gray-400">
              Tùy biến cấp độ HSK mục tiêu, ngày thi đếm ngược, ngôn ngữ giảng giải, xuất dữ liệu học tập hoặc xóa lịch sử phân tích.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsPersonalizationModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-gray-700 border border-orange-200 dark:border-gray-600 text-[#E85D3F] dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-gray-600 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                <span>Mở Cài đặt Cá nhân hóa AI & Dữ liệu</span>
              </button>
            </div>
          </div>

          {/* Privacy Rights & DSAR Management Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-emerald-600" />
                <span className="text-xs font-bold text-[#243447] dark:text-white">
                  Quyền Riêng Tư & Quản Lý Dữ Liệu (Nghị định 13/2023/NĐ-CP)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                DSAR Ready
              </span>
            </div>
            <p className="text-[11px] text-[#748092] dark:text-gray-400">
              Xem xét quyền dữ liệu cá nhân, xuất bản sao lưu học tập (JSON), hoặc yêu cầu xóa vĩnh viễn tài khoản và bản ghi học tập.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsDsarModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-gray-700 border border-emerald-200 dark:border-gray-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-gray-600 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Shield size={13} />
                <span>Quản lý Quyền Dữ Liệu & Xóa Tài Khoản (DSAR)</span>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Lưu cài đặt
            </button>
          </div>

        </form>
      </div>

      {/* Streak Details Modal */}
      <StreakModal 
        isOpen={isStreakModalOpen} 
        onClose={() => setIsStreakModalOpen(false)} 
        user={user} 
        onNavigateTab={setActiveTab}
      />

      {/* AI Personalization Deep Settings Modal */}
      <PersonalizationSettingsModal
        isOpen={isPersonalizationModalOpen}
        onClose={() => setIsPersonalizationModalOpen(false)}
        user={user}
      />

      {/* Data Subject Rights & Deletion Modal (DSAR) */}
      <DataSubjectRequestModal
        isOpen={isDsarModalOpen}
        onClose={() => setIsDsarModalOpen(false)}
        user={user}
        onLogout={onLogout}
      />

      {/* Phase 12: Certificate Generator & Preview Modal (Canvas 2x & A4 Print) */}
      <CertificateGeneratorModal
        isOpen={Boolean(selectedCertForView)}
        onClose={() => setSelectedCertForView(null)}
        certificate={selectedCertForView}
      />

      {/* Phase 12: Public Certificate Verification Modal */}
      <CertificateVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />

    </div>
  );
}

