import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Send, 
  Users, 
  Trophy, 
  Flame, 
  Sparkles,
  Plus,
  CheckCircle2,
  Trash2,
  Copy,
  X,
  Search,
  Check,
  Award,
  Pin,
  Database,
  RefreshCw,
  PhoneCall,
  Calendar,
  Layers,
  HelpCircle,
  Clock
} from 'lucide-react';
import { COMMUNITY_POSTS } from '../data/chineseData';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { 
  getCommunityPosts, 
  addCommunityPost, 
  updateCommunityPost, 
  deleteCommunityPost,
  getStudyPartnersFromDb,
  addStudyPartnerToDb,
  deleteStudyPartnerFromDb
} from '../supabase/services';
import { awardXp } from '../utils/gamification';

const STORAGE_KEYS = {
  POSTS: 'hanzigo_community_posts',
  PARTNERS: 'hanzigo_study_partners',
  CHALLENGE: 'hanzigo_community_challenge',
  COMPLETED_LESSONS: 'hanzigo_completed_lessons',
  SAVED_POSTS: 'hanzigo_saved_post_ids'
};

const TAG_FILTERS = [
  { id: 'all', label: 'Tất cả bài viết' },
  { id: '#HoiDapNguPhap', label: '#HỏiĐápNgữPháp' },
  { id: '#TimBanLuyenNoi', label: '#TìmBạnLuyệnNói' },
  { id: '#KinhNghiemHoc', label: '#KinhNghiệmHọc' },
  { id: '#ThiHSK', label: '#ThiHSK' },
  { id: 'saved', label: '⭐ Đã lưu' }
];

const QUICK_POST_PROMPTS = [
  {
    tag: '#HoiDapNguPhap',
    label: '💡 Phân biệt câu chữ 把 & 被',
    prompt: 'Mọi người cho mình hỏi câu chữ 把 (Bǎ) và câu chữ 被 (Bèi) khác nhau cơ bản thế nào và khi nào bắt buộc phải dùng câu chữ 把 ạ? Xin cảm ơn cả nhà!'
  },
  {
    tag: '#TimBanLuyenNoi',
    label: '🗣️ Tìm bạn luyện nói tối nay',
    prompt: 'Chào các bạn! Mình đang học HSK 2 lên HSK 3, muốn tìm 1 bạn cùng luyện khẩu ngữ 20 - 30 phút mỗi tối qua Zalo hoặc Google Meet. Bạn nào cùng mục tiêu thì kết nối nhé!'
  },
  {
    tag: '#KinhNghiemHoc',
    label: '📚 Mẹo nhớ nhanh 214 bộ thủ',
    prompt: 'Chia sẻ kinh nghiệm: Mình thấy học chữ Hán qua chiết tự và 214 bộ thủ Khang Hy nhớ nhanh hơn rất nhiều so với chép tay từng nét. Mọi người hay áp dụng phương pháp nào?'
  },
  {
    tag: '#ThiHSK',
    label: '🎯 Kinh nghiệm phân bổ thời gian thi HSK',
    prompt: 'Các bạn từng thi HSK cho mình xin lời khuyên: Trong phần Nghe hiểu (听力) và Đọc hiểu (阅读), phần nào dễ bẫy nhất và cần lưu ý phân bổ thời gian làm bài thế nào ạ?'
  }
];

const FAKE_AUTHORS = [
  'Trần Thảo Ly', 
  'Đặng Quốc Anh', 
  'Phạm Thu Trang', 
  'Nguyễn Thu Trang', 
  'Trần Đăng Khoa', 
  'Lê Hoàng Nam'
];

const FAKE_PARTNERS = [
  'Nguyễn Thị Ánh Tuyết', 
  'Hoàng Minh Tuấn', 
  'Vũ Lan Phương', 
  'Nguyễn Thúy Hằng', 
  'Lê Tuấn Anh', 
  'Đặng Mai Phương'
];

export function isFakePost(p) {
  if (!p) return true;
  const author = (p.author_name || p.author || '').trim();
  return FAKE_AUTHORS.some(fake => author.includes(fake));
}

export function sanitizeCommunityPosts(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter(p => !isFakePost(p))
    .map(p => {
      const authorName = (p.author_name || p.author || '').trim();
      const isBqt = authorName.includes('Ban Quản Trị') || 
                    p.author_level === 'Quản trị viên' || 
                    p.level === 'Quản trị viên' || 
                    p.level === 'BQT' ||
                    p.id === 'system-welcome';
      const isLegacyUnsplash = (p.author_avatar && p.author_avatar.includes('photo-1534528741775-53994a69daeb')) ||
                               (p.avatar && p.avatar.includes('photo-1534528741775-53994a69daeb'));
      if (isBqt || isLegacyUnsplash) {
        return {
          ...p,
          avatar: '/hanzigo-logo.svg',
          author_avatar: '/hanzigo-logo.svg',
          level: p.level || p.author_level || 'Quản trị viên'
        };
      }
      return p;
    });
}

export function isFakePartner(p) {
  if (!p) return true;
  const name = (p.name || '').trim();
  return FAKE_PARTNERS.some(fake => name.includes(fake));
}

export default function CommunityPage({ user }) {
  // Posts state initialized from localStorage with demo user purge and logo normalization
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = sanitizeCommunityPosts(parsed);
          localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(clean));
          return clean;
        }
      }
    } catch {}
    const defaultClean = sanitizeCommunityPosts(COMMUNITY_POSTS);
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(defaultClean));
    } catch {}
    return defaultClean;
  });

  // Study Partners state from localStorage with demo user purge
  const [studyPartners, setStudyPartners] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARTNERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(p => !isFakePartner(p));
          localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(clean));
          return clean;
        }
      }
    } catch {}
    try {
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify([]));
    } catch {}
    return [];
  });

  // Challenge state from localStorage
  const [challengeData, setChallengeData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHALLENGE);
      return saved ? JSON.parse(saved) : { joined: false, checkIns: 0, lastDate: null };
    } catch {
      return { joined: false, checkIns: 0, lastDate: null };
    }
  });

  // Completed lessons from localStorage for real learner progress
  const [completedLessonsCount] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.length : 0;
      }
      return 0;
    } catch {
      return 0;
    }
  });

  // State tracking Supabase DB sync
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load latest posts and study partners from Supabase DB on mount
  useEffect(() => {
    let isMounted = true;

    // Sync posts from Supabase (purging any demo data and normalizing logo)
    getCommunityPosts().then((dbPosts) => {
      if (isMounted && dbPosts) {
        const clean = sanitizeCommunityPosts(dbPosts);
        setPosts(clean);
        setIsCloudSynced(true);
        try {
          localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(clean));
        } catch (e) {
          console.error(e);
        }
      } else if (isMounted) {
        setIsCloudSynced(true);
      }
    }).catch(() => {
      if (isMounted) setIsCloudSynced(false);
    });

    // Sync study partners from Supabase (purging any demo data)
    getStudyPartnersFromDb().then((dbPartners) => {
      if (isMounted && dbPartners) {
        const clean = dbPartners.filter(p => !isFakePartner(p));
        setStudyPartners(clean);
        try {
          localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(clean));
        } catch (e) {
          console.error(e);
        }
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Post creation inputs
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('#HoiDapNguPhap');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  // Study partner filter
  const [partnerFilterLevel, setPartnerFilterLevel] = useState('all');
  const [partnerFilterMethod, setPartnerFilterMethod] = useState('all');

  // Comments toggled per post: { [postId]: boolean }
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Study partner modal
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [partnerForm, setPartnerForm] = useState({
    name: user?.name || '',
    level: user?.level || 'HSK 1',
    goal: '',
    contactMethod: 'Zalo',
    contactInfo: ''
  });

  // Contact view modal
  const [activeContactModal, setActiveContactModal] = useState(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Persist posts
  const persistPosts = (updatedPosts) => {
    setPosts(updatedPosts);
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts));
    } catch (e) {
      console.error('Error saving community posts', e);
    }
  };

  // Persist study partners
  const persistPartners = (updatedPartners) => {
    setStudyPartners(updatedPartners);
    try {
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(updatedPartners));
    } catch (e) {
      console.error('Error saving study partners', e);
    }
  };

  // Refresh data from Supabase
  const handleRefreshCloud = async () => {
    setIsRefreshing(true);
    playClickSound();
    try {
      const [dbPosts, dbPartners] = await Promise.all([
        getCommunityPosts(),
        getStudyPartnersFromDb()
      ]);
      if (dbPosts) {
        const cleanPosts = sanitizeCommunityPosts(dbPosts);
        setPosts(cleanPosts);
        setIsCloudSynced(true);
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(cleanPosts));
      }
      if (dbPartners) {
        const cleanPartners = dbPartners.filter(p => !isFakePartner(p));
        setStudyPartners(cleanPartners);
        localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(cleanPartners));
      }
      showToast('Đã làm mới dữ liệu cộng đồng từ Supabase!');
    } catch {
      showToast('Sử dụng dữ liệu lưu trữ cục bộ.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle post creation with dual-layer persistence (Supabase DB + Local)
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    playSuccessSound();
    awardXp(20);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch {}

    const tempId = `post-${Date.now()}`;
    const newPost = {
      id: tempId,
      author: user?.name || 'Học viên HanziGo',
      avatar: user?.avatar || null,
      initial: user?.name ? user.name.charAt(0).toUpperCase() : 'H',
      level: user?.level || 'HSK 1',
      time: 'Vừa xong',
      tag: newPostTag,
      content: newPostContent.trim(),
      likes: 0,
      liked: false,
      saved: false,
      isMyPost: true,
      comments: []
    };

    const updated = [newPost, ...posts];
    persistPosts(updated);
    setNewPostContent('');
    showToast('Đã đăng bài viết lên cộng đồng (+20 XP)!');

    // Asynchronously save to Supabase Cloud DB
    addCommunityPost({
      author: newPost.author,
      avatar: newPost.avatar,
      initial: newPost.initial,
      level: newPost.level,
      tag: newPost.tag,
      content: newPost.content,
      likes: 0,
      time: 'Vừa xong',
      comments: []
    }).then(cloudId => {
      if (cloudId) {
        setIsCloudSynced(true);
        setPosts(prev => {
          const withCloudId = prev.map(p => p.id === tempId ? { ...p, id: cloudId } : p);
          try {
            localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(withCloudId));
          } catch (err) {
            console.error(err);
          }
          return withCloudId;
        });
      }
    }).catch(err => {
      console.warn('Supabase cloud sync fallback to local storage:', err);
    });
  };

  // Apply quick starter prompt
  const handleApplyPrompt = (item) => {
    playClickSound();
    setNewPostTag(item.tag);
    setNewPostContent(item.prompt);
  };

  // Toggle like
  const handleToggleLike = (id) => {
    playClickSound();
    let newLikes = 0;
    const updated = posts.map(p => {
      if (p.id === id) {
        const isLiked = !p.liked;
        newLikes = isLiked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 0) - 1);
        return {
          ...p,
          liked: isLiked,
          likes: newLikes
        };
      }
      return p;
    });
    persistPosts(updated);
    updateCommunityPost(id, { likes: newLikes }).catch(() => {});
  };

  // Toggle save
  const handleToggleSave = (id) => {
    playClickSound();
    const updated = posts.map(p => {
      if (p.id === id) {
        const isSaved = !p.saved;
        showToast(isSaved ? 'Đã lưu bài viết vào mục yêu thích!' : 'Đã bỏ lưu bài viết!');
        return { ...p, saved: isSaved };
      }
      return p;
    });
    persistPosts(updated);
  };

  // Delete own post
  const handleDeletePost = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      playClickSound();
      const updated = posts.filter(p => p.id !== id);
      persistPosts(updated);
      deleteCommunityPost(id).catch(() => {});
      showToast('Đã xóa bài viết khỏi cộng đồng!');
    }
  };

  // Toggle comment section
  const handleToggleComments = (id) => {
    playClickSound();
    setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Submit comment
  const handleAddComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    playSuccessSound();
    awardXp(5);
    let allComments = [];
    const updated = posts.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: `comment-${Date.now()}`,
          author: user?.name || 'Bạn',
          content: text,
          time: 'Vừa xong'
        };
        allComments = [...(p.comments || []), newComment];
        return {
          ...p,
          comments: allComments
        };
      }
      return p;
    });

    persistPosts(updated);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    showToast('Đã gửi bình luận (+5 XP)!');
    updateCommunityPost(postId, { comments: allComments }).catch(() => {});
  };

  // Join 21-Day Challenge
  const handleJoinChallenge = () => {
    playSuccessSound();
    awardXp(20);
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 }
      });
    } catch {}

    const today = new Date().toISOString().slice(0, 10);
    const updated = {
      joined: true,
      checkIns: 1,
      lastDate: today
    };
    setChallengeData(updated);
    localStorage.setItem(STORAGE_KEYS.CHALLENGE, JSON.stringify(updated));
    showToast('Chúc mừng! Bạn đã bắt đầu Thử Thách 21 Ngày (+20 XP)!');
  };

  // Daily Check-in for Challenge
  const handleCheckIn = () => {
    const today = new Date().toISOString().slice(0, 10);
    if (challengeData.lastDate === today) {
      showToast('Hôm nay bạn đã điểm danh rồi! Hãy tiếp tục duy trì ngày mai nhé.');
      return;
    }

    playSuccessSound();
    awardXp(15);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    const updated = {
      ...challengeData,
      checkIns: Math.min(21, (challengeData.checkIns || 0) + 1),
      lastDate: today
    };
    setChallengeData(updated);
    localStorage.setItem(STORAGE_KEYS.CHALLENGE, JSON.stringify(updated));
    showToast(`Điểm danh thành công! Đã hoàn thành Ngày ${updated.checkIns}/21 (+15 XP) 🎉`);
  };

  // Save new study partner request
  const handleSavePartner = (e) => {
    e.preventDefault();
    if (!partnerForm.name.trim() || !partnerForm.contactInfo.trim()) {
      alert('Vui lòng nhập họ tên và thông tin liên hệ!');
      return;
    }

    playSuccessSound();
    awardXp(15);
    const tempPartnerId = `partner-${Date.now()}`;
    const newPartner = {
      id: tempPartnerId,
      name: partnerForm.name.trim(),
      initial: partnerForm.name.trim().charAt(0).toUpperCase(),
      level: partnerForm.level,
      goal: partnerForm.goal.trim() || 'Luyện phản xạ giao tiếp',
      contactMethod: partnerForm.contactMethod,
      contactInfo: partnerForm.contactInfo.trim(),
      createdAt: 'Hôm nay',
      isMyPartnerPost: true
    };

    const updated = [newPartner, ...studyPartners];
    persistPartners(updated);
    setIsPartnerModalOpen(false);
    setPartnerForm({
      name: user?.name || '',
      level: user?.level || 'HSK 1',
      goal: '',
      contactMethod: 'Zalo',
      contactInfo: ''
    });
    showToast('Đã đăng bài tìm bạn học (+15 XP)!');

    // Async sync study partner to Supabase
    addStudyPartnerToDb({
      name: newPartner.name,
      initial: newPartner.initial,
      level: newPartner.level,
      goal: newPartner.goal,
      contactMethod: newPartner.contactMethod,
      contactInfo: newPartner.contactInfo,
      createdAt: 'Hôm nay'
    }).then(cloudId => {
      if (cloudId) {
        setStudyPartners(prev => {
          const withCloudId = prev.map(p => p.id === tempPartnerId ? { ...p, id: cloudId } : p);
          try {
            localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(withCloudId));
          } catch (err) {
            console.error(err);
          }
          return withCloudId;
        });
      }
    }).catch(() => {});
  };

  // Delete own study partner request
  const handleDeletePartner = (id) => {
    if (window.confirm('Bạn có muốn xóa bài đăng tìm bạn này?')) {
      playClickSound();
      const updated = studyPartners.filter(p => p.id !== id);
      persistPartners(updated);
      deleteStudyPartnerFromDb(id).catch(() => {});
      showToast('Đã xóa thông tin tìm bạn học!');
    }
  };

  // Copy contact to clipboard
  const handleCopyContact = (info) => {
    playClickSound();
    navigator.clipboard.writeText(info);
    showToast(`Đã sao chép: ${info}`);
  };

  // Calculate real XP from user or completed lessons
  const totalUserXp = (user?.xp || 0) + (completedLessonsCount * 20) + ((challengeData.checkIns || 0) * 15);
  const currentStreak = user?.streak || (challengeData.checkIns > 0 ? challengeData.checkIns : 0);

  // Learner rank tier
  const getRankTier = (xp) => {
    if (xp >= 600) return { name: 'Bậc Thầy Vàng', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40', next: 'Tối đa', progress: 100 };
    if (xp >= 300) return { name: 'Học Giả Bạc', color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900', next: '600 XP', progress: Math.round(((xp - 300) / 300) * 100) };
    if (xp >= 100) return { name: 'Chiến Binh Đồng', color: 'text-amber-700', bg: 'bg-amber-100/50 dark:bg-amber-950/30', next: '300 XP', progress: Math.round(((xp - 100) / 200) * 100) };
    return { name: 'Tân Binh Hanzi', color: 'text-[#45B97C]', bg: 'bg-emerald-50 dark:bg-emerald-950/30', next: '100 XP', progress: Math.round((xp / 100) * 100) };
  };

  const rankTier = getRankTier(totalUserXp);
  const isCheckedInToday = challengeData.lastDate === new Date().toISOString().slice(0, 10);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tag.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedTag === 'all') return true;
    if (selectedTag === 'saved') return post.saved;
    return post.tag === selectedTag;
  });

  // Filter partners
  const filteredPartners = studyPartners.filter(p => {
    const matchesLevel = partnerFilterLevel === 'all' || p.level === partnerFilterLevel;
    const matchesMethod = partnerFilterMethod === 'all' || p.contactMethod === partnerFilterMethod;
    return matchesLevel && matchesMethod;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/10 animate-bounce">
          <CheckCircle2 size={16} className="text-[#45B97C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">
            Không Gian Học Tập Tương Tác
          </span>
          <button
            onClick={handleRefreshCloud}
            disabled={isRefreshing}
            title="Đồng bộ dữ liệu cộng đồng mới nhất từ Supabase"
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs transition-all ${
              isCloudSynced 
                ? 'bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] border-[#45B97C]/30 hover:bg-[#D7F2E6]' 
                : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#D97706] border-[#F4B942]/30 hover:bg-[#FDEEEB]'
            }`}
          >
            <Database size={11} className={isCloudSynced ? 'text-[#45B97C]' : 'text-[#D97706]'} />
            <span>{isCloudSynced ? 'Cloud DB: Supabase Đã kết nối' : 'Database: Local Storage Ready'}</span>
            <RefreshCw size={10} className={`ml-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#243447] dark:text-white font-['Noto_Serif_SC']">
          Cộng Đồng Người Học HanziGo
        </h1>
        <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8]">
          Giao lưu hỏi đáp ngữ pháp, tìm bạn ghép đôi luyện khẩu ngữ và cùng nhau duy trì thử thách 21 ngày.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Feed Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Post Creation Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                <Sparkles size={16} className="text-[#E85D3F]" />
                <span>Chia sẻ câu hỏi hoặc cảm nhận học tập</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                +20 XP khi đăng bài
              </span>
            </div>

            {/* Quick Starter Prompts */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#748092] uppercase tracking-wider block">
                ⚡ Gợi ý chủ đề nhanh (Nhấp để điền):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_POST_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPrompt(item)}
                    className="px-2.5 py-1 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:text-[#E85D3F] transition-all font-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Bạn đang vướng mắc điểm ngữ pháp nào, hoặc muốn tìm bạn cùng học? Hãy viết câu hỏi tại đây..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full p-4 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F] resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Chủ đề:</span>
                  <select
                    value={newPostTag}
                    onChange={(e) => setNewPostTag(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-medium focus:outline-none focus:border-[#E85D3F]"
                  >
                    <option value="#HoiDapNguPhap">#HỏiĐápNgữPháp</option>
                    <option value="#TimBanLuyenNoi">#TìmBạnLuyệnNói</option>
                    <option value="#KinhNghiemHoc">#KinhNghiệmHọc</option>
                    <option value="#ThiHSK">#ThiHSK</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span>Đăng bài (+20 XP)</span>
                  <Send size={13} />
                </button>
              </div>
            </form>
          </div>

          {/* Filter & Search Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết, tác giả hoặc chủ đề..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-xs font-medium text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#748092] hover:text-[#243447]"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Tag Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {TAG_FILTERS.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedTag(tag.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedTag === tag.id
                      ? 'bg-[#E85D3F] text-white shadow-sm'
                      : 'bg-white dark:bg-[#1E293B] text-[#748092] dark:text-[#94A3B8] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447] dark:hover:text-white'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Feed List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-3 shadow-sm">
                <MessageCircle size={36} className="mx-auto text-[#748092]/50" />
                <p className="text-sm font-bold text-[#243447] dark:text-white">Chưa có bài viết nào phù hợp</p>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                  Hãy thử tìm kiếm với từ khóa khác hoặc là người đầu tiên đăng bài trong chủ đề này!
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isExpanded = expandedComments[post.id];
                const comments = post.comments || [];

                return (
                  <div 
                    key={post.id}
                    className={`p-6 rounded-3xl bg-white dark:bg-[#1E293B] border shadow-sm space-y-4 transition-all ${
                      post.isPinned 
                        ? 'border-[#E85D3F]/50 bg-gradient-to-br from-white to-[#FEF7E9]/40 dark:from-[#1E293B] dark:to-[#2D2619]/30' 
                        : 'border-[#F1E5D8] dark:border-[#2B3A4F]'
                    }`}
                  >
                    {/* Author & Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const isBqt = (post.author || '').includes('Ban Quản Trị') || 
                                        post.level === 'Quản trị viên' || 
                                        post.level === 'BQT' || 
                                        post.avatar === '/hanzigo-logo.svg' ||
                                        (post.avatar && post.avatar.includes('photo-1534528741775-53994a69daeb'));
                          if (isBqt) {
                            return (
                              <div 
                                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#E85D3F] to-[#CB4529] flex items-center justify-center text-white font-bold shadow-md shadow-[#E85D3F]/25 shrink-0 border border-[#E85D3F] select-none group-hover:scale-105 transition-transform"
                                title="Ban Quản Trị HanziGo"
                              >
                                <span className="font-['Noto_Serif_SC'] text-xl font-black">汉</span>
                                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#F4B942] rounded-full border-2 border-white dark:border-[#1E293B]" />
                              </div>
                            );
                          }
                          if (post.avatar) {
                            return post.avatar.length <= 4 ? (
                              <div className="w-10 h-10 rounded-full bg-[#FFF5F2] dark:bg-[#2C1D1A] border border-[#E85D3F] flex items-center justify-center text-lg shadow-sm">
                                {post.avatar}
                              </div>
                            ) : (
                              <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border border-[#E85D3F]" />
                            );
                          }
                          return (
                            <div className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center border ${
                              post.isPinned 
                                ? 'bg-[#E85D3F] text-white border-[#E85D3F]' 
                                : 'bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] border-[#E85D3F]/40'
                            }`}>
                              {post.initial || (post.author ? post.author.charAt(0).toUpperCase() : 'H')}
                            </div>
                          );
                        })()}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#243447] dark:text-white">
                              {post.author}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              post.isPinned
                                ? 'bg-[#E85D3F] text-white'
                                : 'bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]'
                            }`}>
                              {post.level}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#748092] flex items-center gap-1">
                            {post.isPinned && <Pin size={10} className="text-[#E85D3F]" />}
                            <span>{post.time}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#E85D3F] bg-[#FDEEEB] dark:bg-[#2D1E1B] px-2.5 py-1 rounded-lg">
                          {post.tag}
                        </span>
                        {post.isMyPost && (
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 rounded-lg text-[#748092] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Xóa bài viết của bạn"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-xs sm:text-sm text-[#243447] dark:text-[#CBD5E1] leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Actions: Like, Comment, Save */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#748092]">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-1.5 transition-colors ${
                            post.liked ? 'text-[#E85D3F] font-bold' : 'hover:text-[#E85D3F]'
                          }`}
                        >
                          <Heart size={16} className={post.liked ? 'fill-[#E85D3F]' : ''} />
                          <span>{post.likes || 0}</span>
                        </button>

                        <button 
                          onClick={() => handleToggleComments(post.id)}
                          className="flex items-center gap-1.5 hover:text-[#243447] dark:hover:text-white transition-colors"
                        >
                          <MessageCircle size={16} />
                          <span>{comments.length} bình luận</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleSave(post.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            post.saved ? 'text-[#F4B942]' : 'hover:text-[#243447] dark:hover:text-white'
                          }`}
                          title="Lưu bài viết"
                        >
                          <Bookmark size={16} className={post.saved ? 'fill-[#F4B942]' : ''} />
                        </button>
                        <button 
                          onClick={() => {
                            playClickSound();
                            navigator.clipboard.writeText(`${window.location.origin}/#${post.id}`);
                            showToast('Đã sao chép liên kết bài viết!');
                          }}
                          className="p-1.5 rounded-lg hover:text-[#243447] dark:hover:text-white"
                          title="Chia sẻ"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Comments Drawer */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                        {comments.length > 0 ? (
                          <div className="space-y-2">
                            {comments.map((c) => (
                              <div 
                                key={c.id} 
                                className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1"
                              >
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-bold text-[#243447] dark:text-white">{c.author}</span>
                                  <span className="text-[#748092]">{c.time}</span>
                                </div>
                                <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
                                  {c.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#748092] italic">Chưa có bình luận nào. Hãy để lại ý kiến đầu tiên!</p>
                        )}

                        {/* Comment Input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Viết bình luận của bạn..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id);
                              }
                            }}
                            className="flex-1 px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentInputs[post.id]?.trim()}
                            className="px-3.5 py-2 rounded-xl bg-[#E85D3F] disabled:opacity-40 text-white font-bold text-xs hover:bg-[#D44C2E] transition-colors flex items-center gap-1"
                          >
                            <span>Gửi</span>
                            <Send size={11} />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Real Learner Progress & Milestones */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                <Trophy size={16} className="text-[#F4B942]" />
                <span>Thành tích của bạn</span>
              </h3>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${rankTier.bg} ${rankTier.color}`}>
                {rankTier.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <div className="flex items-center gap-1.5 text-xs text-[#748092] dark:text-[#94A3B8] font-semibold">
                  <Flame size={14} className="text-[#E85D3F]" />
                  <span>Chuỗi ngày</span>
                </div>
                <div className="text-lg font-black text-[#243447] dark:text-white mt-1">
                  {currentStreak} ngày
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <div className="flex items-center gap-1.5 text-xs text-[#748092] dark:text-[#94A3B8] font-semibold">
                  <Award size={14} className="text-[#F4B942]" />
                  <span>Tổng điểm XP</span>
                </div>
                <div className="text-lg font-black text-[#E85D3F] mt-1">
                  {totalUserXp} XP
                </div>
              </div>
            </div>

            {/* Next tier progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#748092] dark:text-[#94A3B8]">Mục tiêu kế tiếp:</span>
                <span className="text-[#243447] dark:text-white">{rankTier.next}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#FFF9F2] dark:bg-[#131B24] overflow-hidden border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <div 
                  className="h-full bg-gradient-to-r from-[#E85D3F] to-[#F4B942] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(5, rankTier.progress))}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] text-[#748092] dark:text-[#94A3B8] flex items-center justify-between pt-1">
              <span>Đã hoàn thành: {completedLessonsCount} bài học</span>
              <span className="text-[#45B97C] font-semibold">Duy trì đều đặn!</span>
            </div>
          </div>

          {/* 2. Interactive 21-Day Challenge Widget */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FEF7E9] to-[#FFF9F2] dark:from-[#2D2619] dark:to-[#1E293B] border border-[#F4B942]/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D97706] flex items-center gap-1.5 uppercase">
                <Flame size={14} className="fill-[#F4B942]" />
                <span>Thử thách 21 ngày</span>
              </span>
              {challengeData.joined && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#45B97C] text-white">
                  Đang tham gia
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-[#243447] dark:text-white">
                Thử thách 21 ngày: Chinh phục HSK
              </h4>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                Mỗi ngày học 15 phút, điểm danh để nhận huy hiệu Chiến Binh Hanzi độc quyền.
              </p>
            </div>

            {challengeData.joined ? (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#243447] dark:text-white">Tiến độ thử thách:</span>
                  <span className="text-[#E85D3F] font-black">{challengeData.checkIns} / 21 ngày</span>
                </div>

                {/* 21-Day Visual Progress Calendar */}
                <div className="grid grid-cols-7 gap-1.5 pt-1">
                  {Array.from({ length: 21 }, (_, i) => {
                    const dayNum = i + 1;
                    const isCompleted = dayNum <= (challengeData.checkIns || 0);
                    const isToday = dayNum === (challengeData.checkIns || 0) + 1 && !isCheckedInToday;

                    return (
                      <div
                        key={dayNum}
                        className={`h-7 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all ${
                          isCompleted
                            ? 'bg-[#45B97C] text-white border-[#45B97C]'
                            : isToday
                            ? 'bg-[#E85D3F]/15 text-[#E85D3F] border-[#E85D3F] animate-pulse'
                            : 'bg-white/60 dark:bg-black/20 text-[#748092] border-[#F1E5D8] dark:border-[#2B3A4F]'
                        }`}
                        title={`Ngày ${dayNum}${isCompleted ? ': Đã hoàn thành' : ''}`}
                      >
                        {isCompleted ? <Check size={11} strokeWidth={3} /> : dayNum}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleCheckIn}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    isCheckedInToday
                      ? 'bg-[#45B97C] text-white cursor-default'
                      : 'bg-[#E85D3F] hover:bg-[#CB4529] text-white'
                  }`}
                >
                  {isCheckedInToday ? (
                    <>
                      <Check size={14} />
                      <span>Hôm nay đã điểm danh thành công!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Điểm danh hôm nay (+15 XP)</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleJoinChallenge}
                className="w-full py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white font-bold text-xs shadow-md transition-all text-center active:scale-95"
              >
                Tham gia thử thách ngay (+20 XP)
              </button>
            )}
          </div>

          {/* 3. Study Partner Finder (Call 1-1) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                <Users size={16} className="text-[#45B97C]" />
                <span>Tìm bạn luyện nói (Call 1-1)</span>
              </h3>
              <button
                onClick={() => {
                  playClickSound();
                  setIsPartnerModalOpen(true);
                }}
                className="text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1"
              >
                <Plus size={13} />
                <span>Đăng tin</span>
              </button>
            </div>

            {/* Quick Partner Level & Method Filter */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={partnerFilterLevel}
                onChange={(e) => setPartnerFilterLevel(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[11px] font-semibold text-[#243447] dark:text-white focus:outline-none"
              >
                <option value="all">Mọi cấp độ</option>
                <option value="HSK 1">HSK 1</option>
                <option value="HSK 2">HSK 2</option>
                <option value="HSK 3">HSK 3</option>
                <option value="HSK 4">HSK 4</option>
                <option value="Giao tiếp tự do">Giao tiếp tự do</option>
              </select>

              <select
                value={partnerFilterMethod}
                onChange={(e) => setPartnerFilterMethod(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[11px] font-semibold text-[#243447] dark:text-white focus:outline-none"
              >
                <option value="all">Mọi kênh</option>
                <option value="Zalo">Zalo</option>
                <option value="Google Meet">Google Meet</option>
                <option value="WeChat">WeChat</option>
                <option value="Zoom">Zoom</option>
                <option value="Telegram">Telegram</option>
              </select>
            </div>

            {filteredPartners.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-2">
                <p className="text-xs font-bold text-[#243447] dark:text-white">Chưa có ai đăng ký phù hợp</p>
                <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                  Bạn muốn tìm bạn cùng luyện phản xạ khẩu ngữ? Hãy nhấn đăng tin để ghép đôi ngay nhé!
                </p>
                <button
                  onClick={() => {
                    playClickSound();
                    setIsPartnerModalOpen(true);
                  }}
                  className="mt-2 px-3 py-1.5 rounded-xl bg-[#45B97C] text-white text-xs font-bold hover:bg-[#3AA56E] transition-colors"
                >
                  Đăng ký tìm bạn học
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPartners.map((partner) => (
                  <div 
                    key={partner.id}
                    className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] font-bold text-xs flex items-center justify-center border border-[#F4B942]/40">
                          {partner.initial || 'H'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-[#243447] dark:text-white">{partner.name}</p>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C]">
                              {partner.level}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#748092]">{partner.goal}</p>
                        </div>
                      </div>

                      {partner.isMyPartnerPost && (
                        <button
                          onClick={() => handleDeletePartner(partner.id)}
                          className="text-[#748092] hover:text-red-500 p-1"
                          title="Hủy tin tìm bạn"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-[11px]">
                      <span className="text-[#748092]">Qua: {partner.contactMethod}</span>
                      <button 
                        onClick={() => {
                          playClickSound();
                          setActiveContactModal(partner);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#45B97C] text-white text-[10px] font-bold hover:bg-[#3AA56E] transition-colors"
                      >
                        Xem liên hệ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Modal: Đăng tin tìm bạn học */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
                <Users size={18} className="text-[#45B97C]" />
                <span>Đăng tin tìm bạn luyện nói 1-1</span>
              </h3>
              <button 
                onClick={() => setIsPartnerModalOpen(false)}
                className="p-1 rounded-lg text-[#748092] hover:text-[#243447] dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                  Họ tên hoặc biệt danh *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Nam"
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                    Cấp độ mục tiêu
                  </label>
                  <select
                    value={partnerForm.level}
                    onChange={(e) => setPartnerForm({ ...partnerForm, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none"
                  >
                    <option value="HSK 1">HSK 1</option>
                    <option value="HSK 2">HSK 2</option>
                    <option value="HSK 3">HSK 3</option>
                    <option value="HSK 4">HSK 4</option>
                    <option value="Giao tiếp tự do">Giao tiếp tự do</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                    Kênh liên hệ
                  </label>
                  <select
                    value={partnerForm.contactMethod}
                    onChange={(e) => setPartnerForm({ ...partnerForm, contactMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none"
                  >
                    <option value="Zalo">Zalo</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="WeChat">WeChat</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Telegram">Telegram</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                  Thông tin liên hệ (SĐT / Link / ID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 0912.xxx.xxx hoặc @nam_chinese"
                  value={partnerForm.contactInfo}
                  onChange={(e) => setPartnerForm({ ...partnerForm, contactInfo: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                  Mục tiêu luyện tập
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Luyện nói 30p mỗi tối, sửa thanh điệu cho nhau"
                  value={partnerForm.goal}
                  onChange={(e) => setPartnerForm({ ...partnerForm, goal: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#45B97C] hover:bg-[#3AA56E] text-white text-xs font-bold shadow-md transition-colors"
                >
                  Đăng tin ngay (+15 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Xem thông tin liên hệ của bạn học */}
      {activeContactModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-sm border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] font-black text-xl flex items-center justify-center mx-auto border-2 border-[#45B97C]">
              {activeContactModal.initial || 'H'}
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#243447] dark:text-white">
                {activeContactModal.name}
              </h3>
              <p className="text-xs text-[#E85D3F] font-bold">Mục tiêu: {activeContactModal.level}</p>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">{activeContactModal.goal}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
              <div className="text-left">
                <span className="text-[10px] text-[#748092] block font-bold uppercase">{activeContactModal.contactMethod}</span>
                <span className="text-xs font-mono font-bold text-[#243447] dark:text-white">{activeContactModal.contactInfo}</span>
              </div>
              <button
                onClick={() => handleCopyContact(activeContactModal.contactInfo)}
                className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] hover:bg-[#FDEEEB] transition-colors"
                title="Sao chép"
              >
                <Copy size={14} />
              </button>
            </div>

            <button
              onClick={() => setActiveContactModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#243447] dark:bg-[#334155] text-white text-xs font-bold hover:bg-black transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
