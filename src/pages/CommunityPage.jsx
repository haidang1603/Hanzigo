import React, { useState, useEffect, useMemo } from 'react';
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
  QrCode,
  Image as ImageIcon,
  Download,
  Crown,
  ArrowRight,
  Volume2,
  HelpCircle,
  Calendar,
  MessageSquare,
  Compass,
  Filter,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import LeaderboardView from '../components/learning/LeaderboardView';
import ChineseChallengeCard from '../components/learning/ChineseChallengeCard';
import { COMMUNITY_POSTS } from '../data/chineseData';
import { playClickSound, playSuccessSound, playErrorSound, speakChinese } from '../utils/audio';
import { 
  getCommunityPosts, 
  addCommunityPost, 
  updateCommunityPost, 
  deleteCommunityPost,
  getStudyPartnersFromDb,
  addStudyPartnerToDb,
  deleteStudyPartnerFromDb,
  subscribeToCommunityRealtime
} from '../supabase/services';
import { awardXp } from '../utils/gamification';

// Helper nén ảnh cục bộ cho mã QR và tệp đính kèm (giữ độ sắc nét cho QR)
function compressImageFile(file, maxWidth = 600, maxHeight = 600) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const STORAGE_KEYS = {
  POSTS: 'hanzigo_community_posts',
  PARTNERS: 'hanzigo_study_partners',
  CHALLENGE: 'hanzigo_community_challenge',
  COMPLETED_LESSONS: 'hanzigo_completed_lessons',
  SAVED_POSTS: 'hanzigo_saved_post_ids',
  SOLVED_POSTS: 'hanzigo_community_solved_posts'
};

const TAG_FILTERS = [
  { id: 'all', label: 'Tất cả bài viết' },
  { id: '#HoiDapNguPhap', label: '💡 #HỏiĐápNgữPháp' },
  { id: '#ChuDeHomNay', label: '🏮 #ChủĐềHômNay' },
  { id: '#TimBanLuyenNoi', label: '🗣️ #TìmBạnLuyệnNói' },
  { id: '#KinhNghiemHoc', label: '📚 #KinhNghiệmHọc' },
  { id: '#ThiHSK', label: '🎯 #ThiHSK' },
  { id: 'saved', label: '⭐ Đã lưu' }
];

// Daily Discussion Topic of the day
const DAILY_DISCUSSION_TOPIC = {
  date: 'Hôm nay',
  title: 'Chủ đề đàm thoại: Mùa yêu thích trong năm',
  chinese: '你最喜欢哪个季节？为什么？',
  pinyin: 'Nǐ zuì xǐhuan nǎge jìjié? Wèishénme?',
  meaning: 'Bạn thích mùa nào nhất trong năm? Vì sao?',
  vocabHints: [
    { zh: '春天', py: 'chūntiān', vi: 'mùa xuân' },
    { zh: '夏天', py: 'xiàtiān', vi: 'mùa hè' },
    { zh: '秋天', py: 'qiūtiān', vi: 'mùa thu' },
    { zh: '冬天', py: 'dōngtiān', vi: 'mùa đông' },
    { zh: '天气暖和', py: 'tiānqì nuǎnhuo', vi: 'thời tiết ấm áp' }
  ]
};

const QUICK_POST_PROMPTS = [
  {
    tag: '#ChuDeHomNay',
    label: '🏮 Trả lời chủ đề hôm nay',
    prompt: 'Trả lời chủ đề hôm nay: 我最喜欢秋天，因为秋天的天气不冷也不热，非常舒服。(Tôi thích nhất mùa thu vì thời tiết không lạnh cũng không nóng, rất dễ chịu).'
  },
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

function isFakePost(p) {
  if (!p) return true;
  const author = (p.author_name || p.author || '').trim();
  return FAKE_AUTHORS.some(fake => author.includes(fake));
}

function sanitizeCommunityPosts(list) {
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

function isFakePartner(p) {
  if (!p) return true;
  const name = (p.name || '').trim();
  return FAKE_PARTNERS.some(fake => name.includes(fake));
}

export default function CommunityPage({ user, setActiveTab, initialView = 'feed' }) {
  const [communityView, setCommunityView] = useState(() => {
    if (initialView === 'leaderboard') return 'leaderboard';
    try {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('leaderboard')) return 'leaderboard';
      if (hash.includes('partners')) return 'partners';
      if (hash.includes('challenge')) return 'challenge';
    } catch {}
    return 'feed';
  });

  useEffect(() => {
    if (initialView === 'leaderboard') {
      setCommunityView('leaderboard');
    }
  }, [initialView]);

  // Posts state initialized from localStorage
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

  // Solved posts tracking
  const [solvedPostIds, setSolvedPostIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOLVED_POSTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Study Partners state from localStorage
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

  // Completed lessons from localStorage
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

  // Real-time subscription for new posts, likes, comments, and partners
  useEffect(() => {
    const unsubscribe = subscribeToCommunityRealtime((event) => {
      if (event.type === 'POST_CHANGE') {
        const { eventType, new: newRow, old: oldRow } = event.payload;

        if (eventType === 'INSERT' && newRow) {
          const isBqt = (newRow.author_name || '').includes('Ban Quản Trị') || (newRow.author_level === 'Quản trị viên');
          const avatarUrl = isBqt || (newRow.author_avatar && newRow.author_avatar.includes('photo-1534528741775-53994a69daeb'))
            ? '/hanzigo-logo.svg'
            : (newRow.author_avatar || null);

          const mapped = {
            id: newRow.id,
            author: newRow.author_name || 'Học viên HanziGo',
            avatar: avatarUrl,
            level: newRow.author_level || 'HSK 1',
            content: newRow.content,
            tag: newRow.tag || '',
            image: newRow.image_url || newRow.image || null,
            likes: newRow.likes || 0,
            likedBy: newRow.liked_by || [],
            comments: newRow.comments || [],
            time: 'Vừa xong'
          };

          if (!isFakePost(mapped)) {
            setPosts(prev => {
              if (prev.some(p => p.id === mapped.id)) return prev;
              const next = [mapped, ...prev];
              try { localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(next)); } catch {}
              return next;
            });
          }
        } else if (eventType === 'UPDATE' && newRow) {
          setPosts(prev => {
            const next = prev.map(p => {
              if (p.id === newRow.id) {
                return {
                  ...p,
                  content: newRow.content,
                  likes: newRow.likes ?? p.likes,
                  likedBy: newRow.liked_by ?? p.likedBy,
                  comments: newRow.comments ?? p.comments
                };
              }
              return p;
            });
            try { localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(next)); } catch {}
            return next;
          });
        } else if (eventType === 'DELETE' && oldRow?.id) {
          setPosts(prev => {
            const next = prev.filter(p => p.id !== oldRow.id);
            try { localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(next)); } catch {}
            return next;
          });
        }
      } else if (event.type === 'PARTNER_CHANGE') {
        getStudyPartnersFromDb().then(dbPartners => {
          if (dbPartners) {
            const clean = dbPartners.filter(p => !isFakePartner(p));
            setStudyPartners(clean);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);


  // Post creation inputs
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('#HoiDapNguPhap');
  const [postContactMethod, setPostContactMethod] = useState('Zalo');
  const [postContactInfo, setPostContactInfo] = useState('');
  const [postImage, setPostImage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  // Study partner filter
  const [partnerFilterLevel, setPartnerFilterLevel] = useState('all');
  const [partnerFilterMethod, setPartnerFilterMethod] = useState('all');

  // Comments toggled per post
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Study partner modal
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [partnerForm, setPartnerForm] = useState({
    name: user?.name || '',
    level: user?.level || 'HSK 1',
    goal: '',
    contactMethod: 'Zalo',
    contactInfo: '',
    qrImage: ''
  });

  // Contact view modal & image zoom modal
  const [activeContactModal, setActiveContactModal] = useState(null);
  const [zoomImageModal, setZoomImageModal] = useState(null);

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
      showToast('Sử dụng dữ liệu lưu trữ cục bộ an toàn.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle post creation with dual-layer persistence
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
    let finalContent = newPostContent.trim();
    if (postContactInfo.trim()) {
      finalContent += `\n\n📌 Thông tin liên hệ (${postContactMethod}): ${postContactInfo.trim()}`;
    }

    const newPost = {
      id: tempId,
      author: user?.name || 'Học viên HanziGo',
      avatar: user?.avatar || null,
      initial: user?.name ? user.name.charAt(0).toUpperCase() : 'H',
      level: user?.level || 'HSK 1',
      time: 'Vừa xong',
      tag: newPostTag,
      content: finalContent,
      image: postImage || null,
      likes: 0,
      liked: false,
      saved: false,
      isMyPost: true,
      comments: []
    };

    const updated = [newPost, ...posts];
    persistPosts(updated);
    setNewPostContent('');
    setPostContactInfo('');
    setPostImage('');
    showToast('Đã đăng bài viết lên cộng đồng (+20 XP)!');

    addCommunityPost({
      author: newPost.author,
      avatar: newPost.avatar,
      initial: newPost.initial,
      level: newPost.level,
      tag: newPost.tag,
      content: newPost.content,
      image: newPost.image,
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

  // Toggle Solved status for questions
  const handleToggleSolved = (id) => {
    playClickSound();
    let nextSolved;
    if (solvedPostIds.includes(id)) {
      nextSolved = solvedPostIds.filter(pid => pid !== id);
      showToast('Đã bỏ đánh dấu giải đáp.');
    } else {
      nextSolved = [...solvedPostIds, id];
      playSuccessSound();
      showToast('Đã đánh dấu câu hỏi: Đã được giải đáp! ✅');
    }
    setSolvedPostIds(nextSolved);
    try {
      localStorage.setItem(STORAGE_KEYS.SOLVED_POSTS, JSON.stringify(nextSolved));
    } catch {}
  };

  // Speak Chinese text contained in post
  const handleSpeakChinesePost = (text) => {
    playClickSound();
    const chineseChars = text.match(/[\u4e00-\u9fa5]+/g);
    if (chineseChars && chineseChars.length > 0) {
      const sentence = chineseChars.join('，');
      speakChinese(sentence);
      showToast(`🔊 Đang phát âm giọng đọc: "${sentence}"`);
    } else {
      showToast('Bài viết này không có ký tự chữ Hán để phát âm.');
    }
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
      qrImage: partnerForm.qrImage || null,
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
      contactInfo: '',
      qrImage: ''
    });
    showToast('Đã đăng bài tìm bạn học (+15 XP)!');

    addStudyPartnerToDb({
      name: newPartner.name,
      initial: newPartner.initial,
      level: newPartner.level,
      goal: newPartner.goal,
      contactMethod: newPartner.contactMethod,
      contactInfo: newPartner.contactInfo,
      qrImage: newPartner.qrImage,
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

  // Calculate real XP
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/10 animate-bounce">
          <CheckCircle2 size={16} className="text-[#45B97C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HERO HEADER BANNER (ASIAN-MODERN PALETTE) */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#E85D3F] via-[#CB4529] to-[#991B1B] text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-rose-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-xs">
              <Users size={14} className="text-amber-300" />
              <span>Không gian Học tập & Giao lưu Trực tuyến HanziGo</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-['Noto_Serif_SC'] leading-tight">
              Cộng Đồng Người Học HanziGo
            </h1>
            
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
              Không gian hỏi đáp ngữ pháp, thảo luận kinh nghiệm thi HSK, ghép đôi luyện nói 1-1 và vinh danh bảng vàng thành tích cao thủ chữ Hán.
            </p>
            
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                💬 <strong>{posts.length}</strong> bài thảo luận
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                🤝 <strong>{studyPartners.length}</strong> học viên tìm bạn
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-amber-300">
                🔥 <strong>{totalUserXp} XP</strong> điểm tích lũy của bạn
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
            <button
              onClick={() => {
                playClickSound();
                setIsPartnerModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-gray-900 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-100 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Users size={16} />
              <span>Đăng tin tìm bạn luyện nói</span>
            </button>

            <button
              onClick={handleRefreshCloud}
              disabled={isRefreshing}
              title="Đồng bộ dữ liệu cộng đồng mới nhất từ Supabase"
              className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Đang tải...' : 'Làm mới máy chủ'}</span>
            </button>
          </div>
        </div>

        {/* Decorative Chinese watermark */}
        <div className="absolute right-6 -bottom-8 font-['Noto_Serif_SC'] text-8xl sm:text-9xl font-black text-white/10 select-none pointer-events-none">
          志同道合
        </div>
      </div>

      {/* 2. COMMUNITY NAVIGATION SWITCHER (4 VIEWS) */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs max-w-2xl mx-auto overflow-x-auto">
        <button
          onClick={() => {
            playClickSound();
            setCommunityView('feed');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            communityView === 'feed'
              ? 'bg-[#E85D3F] text-white shadow-sm'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <MessageCircle size={15} />
          <span>Diễn đàn thảo luận</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setCommunityView('leaderboard');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            communityView === 'leaderboard'
              ? 'bg-gradient-to-r from-amber-500 to-[#E85D3F] text-white shadow-sm'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <Trophy size={15} className={communityView === 'leaderboard' ? 'text-white' : 'text-amber-500'} />
          <span>Bảng Vàng XP</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setCommunityView('partners');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            communityView === 'partners'
              ? 'bg-[#45B97C] text-white shadow-sm'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <Users size={15} />
          <span>Ghép đôi 1-1 ({studyPartners.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setCommunityView('challenge');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            communityView === 'challenge'
              ? 'bg-[#3B82F6] text-white shadow-sm'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <Flame size={15} />
          <span>Thử thách 21 ngày</span>
        </button>
      </div>

      {/* VIEW: LEADERBOARD */}
      {communityView === 'leaderboard' && (
        <LeaderboardView user={user} onNavigateTab={setActiveTab} />
      )}

      {/* VIEW: STUDY PARTNERS MATCHING */}
      {communityView === 'partners' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div>
                <h2 className="text-xl font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <Users size={20} className="text-[#45B97C]" />
                  <span>Trung Tâm Ghép Đôi Luyện Nói (Call 1-1)</span>
                </h2>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1">
                  Tìm bạn bè cùng cấp độ để cùng luyện đàm thoại 20–30 phút mỗi ngày qua Zalo, Google Meet hoặc WeChat.
                </p>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  setIsPartnerModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#45B97C] hover:bg-[#3AA56E] text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus size={15} />
                <span>Đăng tin tìm bạn ngay (+15 XP)</span>
              </button>
            </div>

            {/* Partner Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#748092]">Cấp độ:</span>
                <select
                  value={partnerFilterLevel}
                  onChange={(e) => setPartnerFilterLevel(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="all">Mọi cấp độ</option>
                  <option value="HSK 1">HSK 1</option>
                  <option value="HSK 2">HSK 2</option>
                  <option value="HSK 3">HSK 3</option>
                  <option value="HSK 4">HSK 4</option>
                  <option value="Giao tiếp tự do">Giao tiếp tự do</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#748092]">Kênh liên hệ:</span>
                <select
                  value={partnerFilterMethod}
                  onChange={(e) => setPartnerFilterMethod(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="all">Mọi kênh liên hệ</option>
                  <option value="Zalo">Zalo</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="WeChat">WeChat</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Telegram">Telegram</option>
                </select>
              </div>
            </div>

            {/* Partner Grid */}
            {filteredPartners.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                <Users size={40} className="mx-auto text-[#748092]/50" />
                <p className="text-sm font-bold text-[#243447] dark:text-white">Chưa có ai đăng ký phù hợp</p>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] max-w-md mx-auto">
                  Bạn muốn tìm bạn cùng luyện phản xạ khẩu ngữ? Hãy nhấn đăng tin để ghép đôi ngay nhé!
                </p>
                <button
                  onClick={() => setIsPartnerModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#45B97C] text-white text-xs font-bold hover:bg-[#3AA56E] transition-colors cursor-pointer"
                >
                  Đăng ký tìm bạn học
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPartners.map((partner) => (
                  <div 
                    key={partner.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] font-black text-sm flex items-center justify-center border border-[#F4B942]/40">
                            {partner.initial || 'H'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-bold text-[#243447] dark:text-white">{partner.name}</h3>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C]">
                                {partner.level}
                              </span>
                            </div>
                            <p className="text-xs text-[#748092] mt-0.5">{partner.goal}</p>
                          </div>
                        </div>

                        {partner.isMyPartnerPost && (
                          <button
                            onClick={() => handleDeletePartner(partner.id)}
                            className="text-[#748092] hover:text-red-500 p-1 cursor-pointer"
                            title="Hủy tin tìm bạn"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      {/* Contact Preview Strip */}
                      <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-[#E85D3F] uppercase block">
                            {partner.contactMethod || 'Liên hệ'}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#243447] dark:text-white truncate block">
                            {partner.contactInfo || 'Chưa cung cấp'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyContact(partner.contactInfo)}
                          className="p-1.5 rounded-lg bg-white dark:bg-[#131B24] text-[#748092] hover:text-[#E85D3F] transition-colors cursor-pointer"
                          title="Sao chép"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
                      {partner.qrImage ? (
                        <button
                          onClick={() => {
                            playClickSound();
                            setZoomImageModal({ url: partner.qrImage, title: `Mã QR kết bạn - ${partner.name}` });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#45B97C] text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <QrCode size={13} />
                          <span>Xem mã QR</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#748092]">Sẵn sàng kết nối</span>
                      )}

                      <button
                        onClick={() => {
                          playClickSound();
                          setActiveContactModal(partner);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#45B97C] text-white text-xs font-bold hover:bg-[#3AA56E] transition-colors cursor-pointer"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: 21-DAY CHALLENGE & ENGINE */}
      {communityView === 'challenge' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8">
              <ChineseChallengeCard user={user} onAddXp={awardXp} />
            </div>

            <div className="md:col-span-4 space-y-6">
              {/* Challenge Check-in summary */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                    <Flame size={16} className="text-[#E85D3F]" />
                    <span>Hành Trình 21 Ngày</span>
                  </h3>
                  <span className="text-xs font-bold text-[#45B97C]">
                    Ngày {challengeData.checkIns || 0}/21
                  </span>
                </div>

                <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                  Duy trì việc học ít nhất 15 phút mỗi ngày để tạo thói quen bền vững và rèn luyện phản xạ ngôn ngữ.
                </p>

                <div className="w-full h-2.5 rounded-full bg-[#FFF9F2] dark:bg-[#131B24] overflow-hidden border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#E85D3F] to-[#F4B942] rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round(((challengeData.checkIns || 0) / 21) * 100))}%` }}
                  />
                </div>

                {!challengeData.joined ? (
                  <button
                    onClick={handleJoinChallenge}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs shadow-md hover:brightness-105 transition-all cursor-pointer"
                  >
                    Bắt đầu thử thách (+20 XP)
                  </button>
                ) : (
                  <button
                    onClick={handleCheckIn}
                    disabled={isCheckedInToday}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                      isCheckedInToday 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 cursor-default'
                        : 'bg-[#45B97C] hover:bg-[#3AA56E] text-white'
                    }`}
                  >
                    {isCheckedInToday ? '✓ Đã điểm danh hôm nay' : '🔥 Điểm danh ngày hôm nay (+15 XP)'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MAIN FORUM FEED */}
      {communityView === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. DAILY TOPIC STICKY CARD */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#FEF7E9] via-white to-[#FFF9F2] dark:from-[#1E293B] dark:via-[#1B2636] dark:to-[#131B24] border-2 border-[#F4B942]/60 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#D97706] bg-[#FEF7E9] dark:bg-[#2D2619] px-2.5 py-0.5 rounded-full border border-[#F4B942]/40 flex items-center gap-1">
                  <span>🏮</span>
                  <span>Chủ Đề Đàm Thoại Hôm Nay</span>
                </span>
                <button
                  onClick={() => speakChinese(DAILY_DISCUSSION_TOPIC.chinese)}
                  className="text-xs text-[#E85D3F] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 size={14} />
                  <span>Nghe câu hỏi</span>
                </button>
              </div>

              <div>
                <h3 className="font-['Noto_Serif_SC'] text-lg sm:text-xl font-black text-[#243447] dark:text-white">
                  {DAILY_DISCUSSION_TOPIC.chinese}
                </h3>
                <p className="text-xs font-semibold text-[#D97706] mt-0.5">{DAILY_DISCUSSION_TOPIC.pinyin}</p>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1">{DAILY_DISCUSSION_TOPIC.meaning}</p>
              </div>

              {/* Vocab Hints */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-[#748092]">Gợi ý từ:</span>
                {DAILY_DISCUSSION_TOPIC.vocabHints.map((vh, vIdx) => (
                  <span
                    key={vIdx}
                    onClick={() => speakChinese(vh.zh)}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:border-[#E85D3F] cursor-pointer"
                    title={`Nhấp để nghe đọc: ${vh.py} (${vh.vi})`}
                  >
                    {vh.zh} ({vh.vi})
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 flex items-center justify-between">
                <span className="text-[11px] text-[#748092]">Đăng bài trả lời để nhận +20 XP và cùng luyện phản xạ</span>
                <button
                  onClick={() => {
                    playClickSound();
                    setNewPostTag('#ChuDeHomNay');
                    setNewPostContent(`Trả lời chủ đề hôm nay (${DAILY_DISCUSSION_TOPIC.chinese}): `);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Send size={12} />
                  <span>Tham gia trả lời</span>
                </button>
              </div>
            </div>

            {/* 2. Post Creation Box */}
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
                      className="px-2.5 py-1 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:text-[#E85D3F] transition-all font-medium cursor-pointer"
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

                {/* Contact info strip */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-[#F1E5D8]/80 dark:border-[#2B3A4F]/80">
                  <span className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] shrink-0">
                    Thông tin liên hệ (tùy chọn):
                  </span>
                  <div className="flex items-center gap-2 flex-1">
                    <select
                      value={postContactMethod}
                      onChange={(e) => setPostContactMethod(e.target.value)}
                      className="text-xs px-2.5 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-medium focus:outline-none focus:border-[#E85D3F] shrink-0 cursor-pointer"
                    >
                      <option value="Zalo">Zalo</option>
                      <option value="SĐT">SĐT</option>
                      <option value="WeChat">WeChat</option>
                      <option value="Telegram">Telegram</option>
                      <option value="Facebook">Facebook</option>
                    </select>
                    <input
                      type="text"
                      placeholder="SĐT / Zalo / ID để bạn bè liên hệ trực tiếp..."
                      value={postContactInfo}
                      onChange={(e) => setPostContactInfo(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>
                </div>

                {/* Attached image preview */}
                {postImage && (
                  <div className="relative inline-block mt-1">
                    <div className="p-1 rounded-xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs">
                      <img 
                        src={postImage} 
                        alt="Ảnh đính kèm" 
                        className="h-20 w-auto rounded-lg object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setPostImage('')}
                      className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition-colors cursor-pointer"
                      title="Xóa ảnh"
                    >
                      <X size={11} />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Chủ đề:</span>
                      <select
                        value={newPostTag}
                        onChange={(e) => setNewPostTag(e.target.value)}
                        className="text-xs px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-medium focus:outline-none focus:border-[#E85D3F] cursor-pointer"
                      >
                        <option value="#HoiDapNguPhap">#HỏiĐápNgữPháp</option>
                        <option value="#ChuDeHomNay">#ChủĐềHômNay</option>
                        <option value="#TimBanLuyenNoi">#TìmBạnLuyệnNói</option>
                        <option value="#KinhNghiemHoc">#KinhNghiệmHọc</option>
                        <option value="#ThiHSK">#ThiHSK</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#E85D3F] hover:border-[#E85D3F] cursor-pointer font-medium transition-colors shrink-0">
                      <ImageIcon size={14} className="text-[#E85D3F]" />
                      <span>{postImage ? 'Đổi ảnh/QR' : 'Ảnh / Mã QR'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 10 * 1024 * 1024) {
                            alert('Kích thước ảnh tối đa 10MB');
                            return;
                          }
                          try {
                            const dataUrl = await compressImageFile(file, 800, 800);
                            setPostImage(dataUrl);
                            playClickSound();
                          } catch {
                            alert('Không thể tải ảnh, vui lòng thử lại.');
                          }
                        }}
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!newPostContent.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <span>Đăng bài (+20 XP)</span>
                    <Send size={13} />
                  </button>
                </div>
              </form>
            </div>

            {/* 3. Filter & Search Bar */}
            <div className="space-y-3">
              <div className="relative">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#748092] hover:text-[#243447] cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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

            {/* 4. Posts Feed List */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-3 shadow-sm">
                  <MessageCircle size={40} className="mx-auto text-[#748092]/50" />
                  <p className="text-sm font-bold text-[#243447] dark:text-white">Chưa có bài viết nào phù hợp</p>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                    Hãy thử tìm kiếm với từ khóa khác hoặc là người đầu tiên đăng bài trong chủ đề này!
                  </p>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isExpanded = expandedComments[post.id];
                  const comments = post.comments || [];
                  const isSolved = solvedPostIds.includes(post.id);
                  const hasChinese = /[\u4e00-\u9fa5]/.test(post.content);

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
                                  className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#E85D3F] to-[#CB4529] flex items-center justify-center text-white font-bold shadow-md shadow-[#E85D3F]/25 shrink-0 border border-[#E85D3F] select-none"
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
                          {isSolved && (
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                              <CheckCircle size={12} />
                              <span>Đã giải đáp</span>
                            </span>
                          )}

                          <span className="text-xs font-bold text-[#E85D3F] bg-[#FDEEEB] dark:bg-[#2D1E1B] px-2.5 py-1 rounded-lg">
                            {post.tag}
                          </span>
                          {post.isMyPost && (
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-1.5 rounded-lg text-[#748092] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                              title="Xóa bài viết của bạn"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm text-[#243447] dark:text-[#CBD5E1] leading-relaxed whitespace-pre-line">
                          {post.content}
                        </p>

                        {/* Audio reader button if post contains Chinese characters */}
                        {hasChinese && (
                          <button
                            onClick={() => handleSpeakChinesePost(post.content)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] text-xs font-bold hover:bg-orange-100 transition-colors cursor-pointer"
                            title="Nghe phát âm các từ chữ Hán trong bài viết"
                          >
                            <Volume2 size={13} />
                            <span>Nghe phát âm chữ Hán</span>
                          </button>
                        )}
                      </div>

                      {/* Image / QR preview */}
                      {post.image && (
                        <div className="pt-1">
                          <div className="relative inline-block group">
                            <img 
                              src={post.image} 
                              alt="Ảnh đính kèm" 
                              onClick={() => setZoomImageModal(post.image)}
                              className="max-h-64 sm:max-h-80 w-auto max-w-full rounded-2xl object-contain border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#0F172A] p-1.5 cursor-zoom-in group-hover:opacity-95 shadow-xs transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setZoomImageModal(post.image)}
                              className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer shadow-md"
                            >
                              <QrCode size={12} />
                              <span>Xem ảnh lớn / QR</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Actions: Like, Comment, Save, Solved */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#748092]">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleToggleLike(post.id)}
                            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                              post.liked ? 'text-[#E85D3F] font-bold' : 'hover:text-[#E85D3F]'
                            }`}
                          >
                            <Heart size={16} className={post.liked ? 'fill-[#E85D3F]' : ''} />
                            <span>{post.likes || 0}</span>
                          </button>

                          <button 
                            onClick={() => handleToggleComments(post.id)}
                            className="flex items-center gap-1.5 hover:text-[#243447] dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <MessageCircle size={16} />
                            <span>{comments.length} bình luận</span>
                          </button>

                          {/* Solved toggle button for Q&A */}
                          {post.tag === '#HoiDapNguPhap' && (
                            <button
                              onClick={() => handleToggleSolved(post.id)}
                              className={`text-[11px] font-semibold flex items-center gap-1 hover:text-emerald-600 transition-colors cursor-pointer ${
                                isSolved ? 'text-emerald-600 font-bold' : ''
                              }`}
                            >
                              <CheckCircle size={14} />
                              <span>{isSolved ? 'Đã giải đáp' : 'Chưa giải đáp'}</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleToggleSave(post.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
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
                            className="p-1.5 rounded-lg hover:text-[#243447] dark:hover:text-white cursor-pointer"
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
                              className="px-3.5 py-2 rounded-xl bg-[#E85D3F] disabled:opacity-40 text-white font-bold text-xs hover:bg-[#D44C2E] transition-colors flex items-center gap-1 cursor-pointer"
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

            {/* 2. Mini XP Leaderboard Teaser Widget */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white border border-white/10 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase">
                  <Trophy size={14} className="text-amber-400" />
                  <span>Bảng Xếp Hạng XP</span>
                </span>
                <button
                  onClick={() => {
                    playClickSound();
                    setCommunityView('leaderboard');
                  }}
                  className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Xem Top 50</span>
                  <ArrowRight size={12} />
                </button>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Bạn đang có <span className="font-mono font-bold text-amber-300">{totalUserXp.toLocaleString()} XP</span>. Hãy thi đua cùng các học viên khác để ghi tên lên bục vinh quang!
              </p>
              <button
                onClick={() => {
                  playClickSound();
                  setCommunityView('leaderboard');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#E85D3F] text-white font-bold text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Crown size={14} />
                <span>Xem Bảng Xếp Hạng Chi Tiết</span>
              </button>
            </div>

            {/* 3. Real Interactive Chinese Daily Challenge */}
            <ChineseChallengeCard user={user} onAddXp={awardXp} />

            {/* 4. Mini Study Partner Call 1-1 Widget */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                  <Users size={16} className="text-[#45B97C]" />
                  <span>Tìm bạn luyện nói 1-1</span>
                </h3>
                <button
                  onClick={() => {
                    playClickSound();
                    setCommunityView('partners');
                  }}
                  className="text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Hiện có <strong className="text-[#243447] dark:text-white">{studyPartners.length} học viên</strong> đang tìm bạn ghép đôi luyện khẩu ngữ.
              </p>

              <button
                onClick={() => {
                  playClickSound();
                  setIsPartnerModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-[#45B97C] hover:bg-[#3AA56E] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Đăng tin tìm bạn ngay</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Modal: Đăng tin tìm bạn học */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
                <Users size={18} className="text-[#45B97C]" />
                <span>Đăng tin tìm bạn luyện nói 1-1</span>
              </h3>
              <button 
                onClick={() => setIsPartnerModalOpen(false)}
                className="p-1 rounded-lg text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
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
                    className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none cursor-pointer"
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
                    className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none cursor-pointer"
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

              {/* Tải ảnh mã QR */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
                    <QrCode size={14} className="text-[#45B97C]" />
                    <span>Mã QR kết bạn (Zalo / WeChat - Tùy chọn)</span>
                  </label>
                  {partnerForm.qrImage && (
                    <button
                      type="button"
                      onClick={() => setPartnerForm(prev => ({ ...prev, qrImage: '' }))}
                      className="text-[10px] text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Trash2 size={11} />
                      <span>Xóa ảnh QR</span>
                    </button>
                  )}
                </div>

                {partnerForm.qrImage ? (
                  <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center gap-3">
                    <img 
                      src={partnerForm.qrImage} 
                      alt="Mã QR xem trước" 
                      className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-[#F1E5D8] shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#243447] dark:text-white truncate">Đã đính kèm ảnh mã QR</p>
                      <p className="text-[10px] text-[#748092]">Bạn bè có thể quét trực tiếp để kết bạn nhanh</p>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#45B97C] bg-[#FFF9F2]/50 dark:bg-[#131B24]/50 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#748092] dark:text-[#94A3B8] group-hover:text-[#45B97C]">
                      <QrCode size={18} className="text-[#45B97C]" />
                      <span>Tải ảnh mã QR (Zalo, WeChat,...) từ máy</span>
                    </div>
                    <span className="text-[10px] text-[#748092] mt-0.5">Hỗ trợ PNG, JPG (Tối đa 10MB, tự động nén tối ưu)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 10 * 1024 * 1024) {
                          alert('Kích thước ảnh tối đa 10MB');
                          return;
                        }
                        try {
                          const dataUrl = await compressImageFile(file, 600, 600);
                          setPartnerForm(prev => ({ ...prev, qrImage: dataUrl }));
                          playClickSound();
                        } catch {
                          alert('Không thể xử lý ảnh này, vui lòng thử lại.');
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#45B97C] hover:bg-[#3AA56E] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-sm border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] font-black text-xl flex items-center justify-center mx-auto border-2 border-[#45B97C]">
              {activeContactModal.initial || 'H'}
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#243447] dark:text-white">
                {activeContactModal.name}
              </h3>
              <p className="text-xs text-[#E85D3F] font-bold">Mục tiêu: {activeContactModal.level || 'HSK 1'}</p>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">{activeContactModal.goal || 'Luyện phản xạ giao tiếp'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
              <div className="text-left min-w-0">
                <span className="text-[10px] text-[#748092] block font-bold uppercase">
                  {activeContactModal.contactMethod || 'Kênh liên hệ'}
                </span>
                <span className="text-xs font-mono font-bold text-[#243447] dark:text-white truncate block">
                  {activeContactModal.contactInfo || activeContactModal.contact || 'Chưa cung cấp'}
                </span>
              </div>
              <button
                onClick={() => handleCopyContact(activeContactModal.contactInfo || activeContactModal.contact)}
                className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] hover:bg-[#FDEEEB] transition-colors cursor-pointer shrink-0"
                title="Sao chép"
              >
                <Copy size={14} />
              </button>
            </div>

            {/* Mã QR kết bạn nếu có */}
            {activeContactModal.qrImage && (
              <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#243447] dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <QrCode size={14} className="text-[#45B97C]" />
                    <span>Mã QR kết bạn</span>
                  </span>
                  <button
                    onClick={() => setZoomImageModal({ url: activeContactModal.qrImage, title: `Mã QR kết bạn - ${activeContactModal.name}` })}
                    className="text-[10px] text-[#45B97C] hover:underline cursor-pointer"
                  >
                    Phóng to
                  </button>
                </div>
                <div
                  onClick={() => setZoomImageModal({ url: activeContactModal.qrImage, title: `Mã QR kết bạn - ${activeContactModal.name}` })}
                  className="p-2 bg-white rounded-xl border border-[#F1E5D8] cursor-pointer hover:shadow-md transition-shadow group flex items-center justify-center"
                  title="Bấm để phóng to hoặc quét mã QR"
                >
                  <img
                    src={activeContactModal.qrImage}
                    alt="Mã QR kết bạn"
                    className="w-40 h-40 object-contain mx-auto group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-[10px] text-[#748092]">Mở camera hoặc app {activeContactModal.contactMethod || 'Zalo'} để quét kết bạn</p>
              </div>
            )}

            <button
              onClick={() => setActiveContactModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#243447] dark:bg-[#334155] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal phóng to ảnh / Mã QR */}
      {zoomImageModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomImageModal(null)}
        >
          <div 
            className="bg-white dark:bg-[#1E293B] rounded-3xl p-5 w-full max-w-md border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-3 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="flex items-center gap-2">
                <QrCode size={18} className="text-[#45B97C]" />
                <h4 className="text-sm font-bold text-[#243447] dark:text-white truncate">
                  {typeof zoomImageModal === 'object' ? zoomImageModal.title : 'Xem ảnh / Mã QR'}
                </h4>
              </div>
              <button 
                onClick={() => setZoomImageModal(null)}
                className="p-1 rounded-lg text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-[#FFF9F2] dark:bg-[#131B24] rounded-2xl flex items-center justify-center">
              <img 
                src={typeof zoomImageModal === 'object' ? zoomImageModal.url : zoomImageModal} 
                alt="Ảnh phóng to" 
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl bg-white p-2 shadow-xs"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <p className="text-[11px] text-[#748092]">
                Có thể quét trực tiếp bằng camera hoặc app
              </p>
              <a
                href={typeof zoomImageModal === 'object' ? zoomImageModal.url : zoomImageModal}
                download="hanzigo-qr-image.png"
                className="px-3 py-1.5 rounded-xl bg-[#45B97C] text-white text-xs font-bold hover:bg-[#3AA56E] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Download size={13} />
                <span>Tải ảnh về máy</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
