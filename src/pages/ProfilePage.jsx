import React, { useState, useMemo, useRef } from 'react';
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
  Sparkles,
  Shield,
  BookOpen
} from 'lucide-react';
import { USER_ACHIEVEMENTS } from '../data/chineseData';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { calculateTotalXp, getStreakStatus, getUserLevelInfo, getUserStorageKey } from '../utils/gamification';
import { updateUserProfile } from '../supabase/services.js';

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
  setSoundEnabled 
}) {
  const [reminderTime, setReminderTime] = useState('20:00');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState('15');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Edit Profile Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editLevel, setEditLevel] = useState(user?.level || 'HSK 1 - Sơ cấp');
  const [editAvatar, setEditAvatar] = useState(() => user?.avatar || localStorage.getItem('hanzigo_custom_avatar') || '');
  const [editBio, setEditBio] = useState(() => user?.bio || localStorage.getItem('hanzigo_user_bio') || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileToast, setProfileToast] = useState('');

  const fileInputRef = useRef(null);

  const streakStatus = useMemo(() => getStreakStatus(user), [user]);
  const streakCount = streakStatus.streak;

  // Dynamic learning stats from storage for this specific user
  const rememberedIds = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_vocab_remembered', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_vocab_remembered'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user]);

  const completedLessonIds = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_completed_lessons', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_completed_lessons'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user]);

  const pronounceHistory = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_pronounce_history', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_pronounce_history'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user]);

  const customWritingChars = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_custom_writing_chars', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_custom_writing_chars'));
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }, [user]);

  const aiChatHistory = useMemo(() => {
    try {
      const key = getUserStorageKey('hanzigo_ai_chat_history', user);
      const s = localStorage.getItem(key) || (user ? null : localStorage.getItem('hanzigo_ai_chat_history'));
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  }, [user]);

  const wordsLearnedCount = rememberedIds.length > 0 ? rememberedIds.length : (user?.wordsLearned || 0);

  const totalStudyHours = useMemo(() => {
    const mins = (completedLessonIds.length * 15) + (rememberedIds.length * 2) + (pronounceHistory.length * 3) + (customWritingChars.length * 3);
    return mins > 0 ? (mins / 60).toFixed(1) : (user ? '0.5' : '0');
  }, [completedLessonIds, rememberedIds, pronounceHistory, customWritingChars, user]);

  const totalXp = calculateTotalXp(user);
  const levelInfo = useMemo(() => getUserLevelInfo(totalXp), [totalXp]);

  // Real Dynamic Achievements
  const dynamicAchievements = useMemo(() => {
    const hasFinishedLesson = completedLessonIds.length > 0;
    const hasLearnedVocab = rememberedIds.length >= 5;
    const hasPracticedPronounce = pronounceHistory.length > 0;
    const hasWrittenChar = customWritingChars.length > 0;
    const hasChattedAI = Object.keys(aiChatHistory).length > 0;

    return USER_ACHIEVEMENTS.map(ach => {
      let isUnlocked = ach.unlocked;
      if (ach.id === 'first-step' && hasFinishedLesson) isUnlocked = true;
      if (ach.id === 'vocab-100' && hasLearnedVocab) isUnlocked = true;
      if (ach.id === 'pinyin-master' && hasPracticedPronounce) isUnlocked = true;
      if (ach.id === 'calligraphy' && hasWrittenChar) isUnlocked = true;
      if (ach.id === 'conversation-star' && hasChattedAI) isUnlocked = true;
      if (ach.id === 'streak-7' && streakCount >= 7) isUnlocked = true;
      return { ...ach, unlocked: isUnlocked };
    });
  }, [completedLessonIds, rememberedIds, pronounceHistory, customWritingChars, aiChatHistory, streakCount]);

  // Heatmap: 12 weeks of 7 days (84 days) with streak tail highlighted
  const heatmapData = useMemo(() => {
    return Array.from({ length: 84 }, (_, index) => {
      const daysFromEnd = 83 - index;
      if (daysFromEnd === 0 && streakStatus.hasStudiedToday) {
        return { level: 4 };
      }
      if (daysFromEnd < streakCount) {
        return { level: Math.min(4, Math.max(1, (daysFromEnd % 3) + 2)) };
      }
      return { level: 0 };
    });
  }, [streakCount, streakStatus.hasStudiedToday]);

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
              <span className="px-2.5 py-0.5 rounded-full bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] text-xs font-bold flex items-center gap-1 border border-[#F4B942]/20">
                <Flame size={12} className="fill-[#F4B942]" />
                <span>Streak {streakCount} ngày</span>
              </span>
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
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center">
          <p className="text-[10px] uppercase font-bold text-[#748092]">Chuỗi học</p>
          <p className="text-2xl font-black text-[#E85D3F] mt-1">{streakCount} ngày 🔥</p>
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
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center">
          <p className="text-[10px] uppercase font-bold text-[#748092]">Tổng EXP</p>
          <p className="text-2xl font-black text-[#F4B942] mt-1">{totalXp} XP ⚡</p>
          <p className="text-[10px] text-[#D97706] font-semibold mt-0.5">Điểm kinh nghiệm</p>
        </div>
      </div>

      {/* Learning Activity Heatmap */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
            <Calendar size={16} className="text-[#E85D3F]" />
            <span>Lịch sử học tập 12 tuần gần nhất</span>
          </h3>
          <span className="text-xs text-[#748092]">Đều đặn mỗi ngày</span>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[500px]">
            {heatmapData.map((d, i) => {
              const bgColors = [
                'bg-gray-100 dark:bg-gray-800',
                'bg-[#FDEEEB] dark:bg-[#2D1E1B]',
                'bg-[#F7A693]',
                'bg-[#E85D3F]',
                'bg-[#CB4529]'
              ];
              return (
                <div 
                  key={i}
                  className={`w-3.5 h-3.5 rounded-sm ${bgColors[d.level]} transition-colors`}
                  title={`Ngày học cấp độ ${d.level}`}
                />
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-2 text-[10px] text-[#748092]">
          <span>Ít</span>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-gray-100 dark:bg-gray-800" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#FDEEEB]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#F7A693]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#E85D3F]" />
          </div>
          <span>Nhiều</span>
        </div>
      </div>

      {/* Badges Collection Showcase */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
            <Award size={16} className="text-[#F4B942]" />
            <span>Kho Huy Hiệu Thành Tích ({dynamicAchievements.filter(a => a.unlocked).length}/{dynamicAchievements.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {dynamicAchievements.map((ach) => (
            <div 
              key={ach.id}
              className={`p-4 rounded-2xl border text-center transition-all ${
                ach.unlocked 
                  ? 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F4B942]/40 shadow-sm' 
                  : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 opacity-40 grayscale'
              }`}
            >
              <span className="text-3xl block mb-2">{ach.icon}</span>
              <p className="text-xs font-bold text-[#243447] dark:text-white">{ach.name}</p>
              <p className="text-[10px] text-[#748092] mt-1">{ach.desc}</p>
              {ach.unlocked && (
                <span className="inline-block mt-2 text-[9px] font-bold text-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] px-2 py-0.5 rounded-full">
                  Đã mở khóa
                </span>
              )}
            </div>
          ))}
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

          <div>
            <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
              Mục tiêu học mỗi ngày
            </label>
            <div className="flex items-center gap-2">
              {['10', '15', '30', '45'].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDailyGoalMinutes(mins)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    dailyGoalMinutes === mins 
                      ? 'bg-[#E85D3F] text-white' 
                      : 'border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092]'
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

    </div>
  );
}
