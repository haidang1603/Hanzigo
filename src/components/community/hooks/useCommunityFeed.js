import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessSound, speakChinese } from '../../../utils/audio';
import {
  getCommunityPosts as defaultGetCommunityPosts,
  getCommunityPostById as defaultGetCommunityPostById,
  createCommunityPost as defaultCreateCommunityPost,
  updateCommunityPost as defaultUpdateCommunityPost,
  deleteCommunityPost as defaultDeleteCommunityPost,
  moderateCommunityPost as defaultModerateCommunityPost,
  getPostComments as defaultGetPostComments,
  createCommunityComment as defaultCreateCommunityComment,
  updateCommunityComment as defaultUpdateCommunityComment,
  deleteCommunityComment as defaultDeleteCommunityComment,
  togglePostReaction as defaultTogglePostReaction,
  getStudyPartnersFromDb as defaultGetStudyPartnersFromDb,
  addStudyPartnerToDb as defaultAddStudyPartnerToDb,
  updateStudyPartnerInDb as defaultUpdateStudyPartnerInDb,
  toggleStudyPartnerStatusInDb as defaultToggleStudyPartnerStatusInDb,
  deleteStudyPartnerFromDb as defaultDeleteStudyPartnerFromDb,
  subscribeToCommunityRealtime as defaultSubscribeToCommunityRealtime,
} from '../../../services/communityService';
import { getPastAttempts } from '../../../services/hskService';
import { awardXp, getLocalDateString } from '../../../utils/gamification';
import { STORAGE_KEYS } from '../communityConstants.js';
import {
  formatStructuredPostContent,
  validateCommunityPostInput,
  validateCommunityCommentInput,
  toggleLikeOptimisticList,
  isFakePost,
  sanitizeCommunityPosts,
  isFakePartner,
  getRankTier,
  filterAndSortPosts,
  filterStudyPartners,
  resolveContactAction,
} from '../communityHelpers.js';

export function useCommunityFeed({
  user,
  api = {},
  realtimeDispatcher = null,
  getTodayDateKey = getLocalDateString,
}) {
  const fetchPosts = api.getCommunityPosts || defaultGetCommunityPosts;
  const fetchPostById = api.getCommunityPostById || defaultGetCommunityPostById;
  const submitNewPost = api.createCommunityPost || defaultCreateCommunityPost;
  const editPost = api.updateCommunityPost || defaultUpdateCommunityPost;
  const removePost = api.deleteCommunityPost || defaultDeleteCommunityPost;
  const moderatePost = api.moderateCommunityPost || defaultModerateCommunityPost;
  const loadComments = api.loadPostComments || defaultGetPostComments;
  const createComment = api.createComment || defaultCreateCommunityComment;
  const editComment = api.updateCommunityComment || defaultUpdateCommunityComment;
  const removeComment = api.deleteComment || defaultDeleteCommunityComment;
  const toggleLike =
    api.toggleLikeReaction || ((idStr) => defaultTogglePostReaction(idStr, 'like'));
  const fetchPartners = api.getStudyPartnersFromDb || defaultGetStudyPartnersFromDb;
  const createPartner = api.addStudyPartnerToDb || defaultAddStudyPartnerToDb;
  const editPartner = api.updateStudyPartnerInDb || defaultUpdateStudyPartnerInDb;
  const togglePartnerStatus = api.toggleStudyPartnerStatusInDb || defaultToggleStudyPartnerStatusInDb;
  const removePartner = api.deleteStudyPartnerFromDb || defaultDeleteStudyPartnerFromDb;
  const subscribeRealtime = api.subscribeToCommunityRealtime || defaultSubscribeToCommunityRealtime;

  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeCommunityPosts(parsed);
        }
      }
    } catch {}
    return [];
  });

  // Cursor-based pagination state
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [nextPostCursor, setNextPostCursor] = useState(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);

  // Relational comments state per post
  const [postCommentsMap, setPostCommentsMap] = useState({});
  const [loadingCommentsMap, setLoadingCommentsMap] = useState({});
  const [submittingCommentMap, setSubmittingCommentMap] = useState({});

  // Report Modal State
  const [reportModalState, setReportModalState] = useState({
    isOpen: false,
    targetType: 'post',
    targetId: null,
    targetContent: '',
    targetAuthor: '',
  });

  // Solved posts tracking
  const [solvedPostIds] = useState(() => {
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
          const clean = parsed.filter((p) => !isFakePartner(p));
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

  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Tag, HSK level group & sort state
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedHskGroup, setSelectedHskGroup] = useState('all');
  const [postSort, setPostSort] = useState('newest');

  // Post creation & edit inputs
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('#ThiHSK');
  const [newPostHskLevel, setNewPostHskLevel] = useState(user?.level || 'HSK 1');
  const [newPostChinese, setNewPostChinese] = useState('');
  const [newPostPinyin, setNewPostPinyin] = useState('');
  const [showSnippetInputs, setShowSnippetInputs] = useState(false);
  const [postContactMethod, setPostContactMethod] = useState('Zalo');
  const [postContactInfo, setPostContactInfo] = useState('');
  const [postImage, setPostImage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostDraft, setEditPostDraft] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentDraft, setEditCommentDraft] = useState('');

  // Study partner filters & state
  const [partnerFilterLevel, setPartnerFilterLevel] = useState('all');
  const [partnerFilterMethod, setPartnerFilterMethod] = useState('all');
  const [partnerFilterStatus, setPartnerFilterStatus] = useState('all');
  const [partnerSearchTerm, setPartnerSearchTerm] = useState('');
  const [showPartnerFilters, setShowPartnerFilters] = useState(false);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);

  // Comments toggled per post
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Study partner modal
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [partnerForm, setPartnerForm] = useState({
    name: user?.name || '',
    level: user?.level || 'HSK 1',
    goal: '',
    dailyTime: 'Tối 20h - 21h',
    skills: 'Luyện khẩu ngữ',
    contactMethod: 'Zalo',
    contactInfo: '',
    isContactPublic: true,
    isActive: true,
    qrImage: '',
  });

  const [activeContactModal, setActiveContactModal] = useState(null);
  const [zoomImageModal, setZoomImageModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Load paginated community posts from Supabase
  useEffect(() => {
    let isMounted = true;
    setIsLoadingPosts(true);

    fetchPosts({ limit: 15, tag: selectedTag, sort: postSort })
      .then((res) => {
        if (!isMounted) return;
        const fetched = res?.posts || (Array.isArray(res) ? res : []);
        const clean = sanitizeCommunityPosts(fetched);
        setPosts(clean);
        setHasMorePosts(Boolean(res?.hasMore));
        setNextPostCursor(res?.nextCursor || null);
        setIsCloudSynced(true);
        try {
          localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(clean.slice(0, 20)));
        } catch {}
      })
      .catch((err) => {
        console.warn('Could not fetch Supabase community posts:', err);
        if (isMounted) setIsCloudSynced(false);
      })
      .finally(() => {
        if (isMounted) setIsLoadingPosts(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedTag, postSort]);

  // Load study partners on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoadingPartners(true);
    fetchPartners({ currentUserId: user?.id, onlyActive: false })
      .then((dbPartners) => {
        if (isMounted && dbPartners) {
          const clean = dbPartners.filter((p) => !isFakePartner(p));
          setStudyPartners(clean);
          try {
            localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(clean));
          } catch (e) {
            console.error(e);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoadingPartners(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Real-time subscription for posts, comments, reactions, and partners
  useEffect(() => {
    const handlePostRealtime = (payload) => {
      const { eventType, new: newRow, old: oldRow } = payload;
      if (eventType === 'INSERT' && newRow) {
        const isBqt =
          (newRow.author_name || '').includes('Ban Quản Trị') ||
          newRow.author_level === 'Quản trị viên';
        const avatarUrl =
          isBqt ||
          (newRow.author_avatar && newRow.author_avatar.includes('photo-1534528741775-53994a69daeb'))
            ? '/hanzigo-logo.svg'
            : (newRow.author_avatar || null);

        const mapped = {
          id: String(newRow.id),
          author: newRow.author_name || 'Học viên HanziGo',
          avatar: avatarUrl,
          initial: isBqt
            ? 'HZ'
            : newRow.author_name
              ? newRow.author_name.charAt(0).toUpperCase()
              : 'H',
          level: isBqt ? 'Quản trị viên' : (newRow.author_level || 'HSK 1'),
          content: newRow.content,
          tag: newRow.tag || '',
          image: newRow.image_url || newRow.image || null,
          likes: Number(newRow.likes_count ?? newRow.likes ?? 0),
          liked: false,
          commentsCount: Number(newRow.comments_count ?? 0),
          comments: [],
          isPinned: Boolean(newRow.is_pinned),
          isSolved: Boolean(newRow.is_solved),
          isMyPost: Boolean(user?.id && newRow.author_id === user.id),
          time: 'Vừa xong',
          createdAt: newRow.created_at || new Date().toISOString(),
        };

        if (!isFakePost(mapped)) {
          setPosts((prev) => {
            if (prev.some((p) => String(p.id) === String(mapped.id))) return prev;
            return [mapped, ...prev];
          });
        }
      } else if (eventType === 'UPDATE' && newRow) {
        if (newRow.status === 'hidden' || newRow.deleted_at) {
          setPosts((prev) => prev.filter((p) => String(p.id) !== String(newRow.id)));
        } else {
          setPosts((prev) =>
            prev.map((p) => {
              if (String(p.id) === String(newRow.id)) {
                return {
                  ...p,
                  content: newRow.content ?? p.content,
                  tag: newRow.tag ?? p.tag,
                  image: newRow.image_url ?? p.image,
                  likes: Number(newRow.likes_count ?? p.likes),
                  commentsCount: Number(newRow.comments_count ?? p.commentsCount),
                  isPinned: Boolean(newRow.is_pinned ?? p.isPinned),
                  isSolved: Boolean(newRow.is_solved ?? p.isSolved),
                };
              }
              return p;
            })
          );
        }
      } else if (eventType === 'DELETE' && oldRow?.id) {
        setPosts((prev) => prev.filter((p) => String(p.id) !== String(oldRow.id)));
      }
    };

    const handleCommentRealtime = (payload) => {
      const { eventType, new: newCommentRow, old: oldCommentRow } = payload;
      if (eventType === 'INSERT' && newCommentRow) {
        if (newCommentRow.status === 'published' && !newCommentRow.deleted_at) {
          const postIdStr = String(newCommentRow.post_id);
          setPosts((prev) =>
            prev.map((p) =>
              String(p.id) === postIdStr
                ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
                : p
            )
          );
          setPostCommentsMap((prev) => {
            if (!prev[postIdStr]) return prev;
            if (prev[postIdStr].some((c) => String(c.id) === String(newCommentRow.id))) return prev;
            const newComment = {
              id: String(newCommentRow.id),
              postId: postIdStr,
              authorId: newCommentRow.author_id,
              author: 'Học viên HanziGo',
              avatar: null,
              level: 'HSK 1',
              content: newCommentRow.content,
              time: 'Vừa xong',
              createdAt: newCommentRow.created_at,
              isMyComment: Boolean(user?.id && newCommentRow.author_id === user.id),
            };
            return {
              ...prev,
              [postIdStr]: [...prev[postIdStr], newComment],
            };
          });
        }
      } else if (eventType === 'UPDATE' && newCommentRow) {
        const postIdStr = String(newCommentRow.post_id);
        if (newCommentRow.status === 'hidden' || newCommentRow.deleted_at) {
          setPostCommentsMap((prev) => {
            if (!prev[postIdStr]) return prev;
            return {
              ...prev,
              [postIdStr]: prev[postIdStr].filter((c) => String(c.id) !== String(newCommentRow.id)),
            };
          });
          setPosts((prev) =>
            prev.map((p) =>
              String(p.id) === postIdStr
                ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 1) - 1) }
                : p
            )
          );
        }
      } else if (eventType === 'DELETE' && oldCommentRow) {
        const postIdStr = String(oldCommentRow.post_id);
        setPosts((prev) =>
          prev.map((p) =>
            String(p.id) === postIdStr
              ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 1) - 1) }
              : p
          )
        );
        setPostCommentsMap((prev) => {
          if (!prev[postIdStr]) return prev;
          return {
            ...prev,
            [postIdStr]: prev[postIdStr].filter((c) => String(c.id) !== String(oldCommentRow.id)),
          };
        });
      }
    };

    const handleReactionRealtime = (payload) => {
      const { new: newRow, old: oldRow } = payload;
      const targetPostId = newRow?.post_id || oldRow?.post_id;
      if (targetPostId) {
        fetchPostById(targetPostId)
          .then((updatedPost) => {
            if (updatedPost) {
              setPosts((prev) =>
                prev.map((p) =>
                  String(p.id) === String(targetPostId) ? { ...p, likes: updatedPost.likes } : p
                )
              );
            }
          })
          .catch(() => {});
      }
    };

    const handlePartnerRealtime = () => {
      fetchPartners({ currentUserId: user?.id, onlyActive: false }).then((dbPartners) => {
        if (dbPartners) {
          const clean = dbPartners.filter((p) => !isFakePartner(p));
          setStudyPartners(clean);
        }
      });
    };

    const unsubscribe = subscribeRealtime((event) => {
      if (realtimeDispatcher) {
        realtimeDispatcher(event, {
          handlePostRealtime,
          handleCommentRealtime,
          handleReactionRealtime,
          handlePartnerRealtime,
        });
        return;
      }
      if (event.type === 'POST_CHANGE') {
        handlePostRealtime(event.payload);
      } else if (event.type === 'COMMENT_CHANGE') {
        handleCommentRealtime(event.payload);
      } else if (event.type === 'REACTION_CHANGE') {
        handleReactionRealtime(event.payload);
      } else if (event.type === 'PARTNER_CHANGE') {
        handlePartnerRealtime(event.payload);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleOpenReportModal = (targetType, targetId, item) => {
    playClickSound();
    if (!user) {
      alert('Vui lòng đăng nhập tài khoản HanziGo để gửi báo cáo vi phạm.');
      return;
    }
    setReportModalState({
      isOpen: true,
      targetType,
      targetId: String(targetId),
      targetContent: item?.content || '',
      targetAuthor:
        item?.author || item?.author_name || (targetType === 'post' ? 'Tác giả bài viết' : 'Học viên'),
    });
  };

  const persistPartners = (updatedPartners) => {
    setStudyPartners(updatedPartners);
    try {
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(updatedPartners));
    } catch (e) {
      console.error('Error saving study partners', e);
    }
  };

  const handleRefreshCloud = async () => {
    setIsRefreshing(true);
    playClickSound();
    try {
      const [resPosts, dbPartners] = await Promise.all([
        fetchPosts({ limit: 15, tag: selectedTag, sort: postSort }),
        fetchPartners(),
      ]);
      if (resPosts?.posts) {
        const cleanPosts = sanitizeCommunityPosts(resPosts.posts);
        setPosts(cleanPosts);
        setHasMorePosts(Boolean(resPosts.hasMore));
        setNextPostCursor(resPosts.nextCursor || null);
        setIsCloudSynced(true);
        try {
          localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(cleanPosts.slice(0, 20)));
        } catch {}
      }
      if (dbPartners) {
        const cleanPartners = dbPartners.filter((p) => !isFakePartner(p));
        setStudyPartners(cleanPartners);
        try {
          localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(cleanPartners));
        } catch {}
      }
      showToast('Đã làm mới dữ liệu cộng đồng từ Supabase!');
    } catch {
      showToast('Sử dụng dữ liệu lưu trữ cục bộ an toàn.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLoadMorePosts = async () => {
    if (isLoadingMorePosts || !hasMorePosts || !nextPostCursor) return;
    setIsLoadingMorePosts(true);
    playClickSound();
    try {
      const res = await fetchPosts({
        limit: 15,
        cursor: nextPostCursor,
        tag: selectedTag,
        sort: postSort,
      });
      const newPosts = res?.posts || [];
      const cleanNew = sanitizeCommunityPosts(newPosts);
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => String(p.id)));
        const filtered = cleanNew.filter((p) => !existingIds.has(String(p.id)));
        return [...prev, ...filtered];
      });
      setHasMorePosts(Boolean(res?.hasMore));
      setNextPostCursor(res?.nextCursor || null);
    } catch (err) {
      console.warn('Error loading more community posts:', err);
    } finally {
      setIsLoadingMorePosts(false);
    }
  };

  const requireAuthForCommunity = (actionLabel = 'thao tác này') => {
    if (user?.id || user?.uid) return true;
    showToast(`Vui lòng đăng nhập tài khoản HanziGo để thực hiện ${actionLabel}.`);
    return false;
  };

  const totalUserXp =
    (user?.xp || 0) + completedLessonsCount * 20 + (challengeData.checkIns || 0) * 15;
  const currentStreak =
    user?.streak || (challengeData.checkIns > 0 ? challengeData.checkIns : 0);

  const handleShareAchievement = async () => {
    playClickSound();
    if (!requireAuthForCommunity('chia sẻ thành tích')) return;
    try {
      const attempts = await getPastAttempts(user);
      const latest = Array.isArray(attempts) && attempts.length > 0 ? attempts[0] : null;
      if (latest) {
        setNewPostTag('#ThiHSK');
        setNewPostHskLevel(latest.examLevel || user?.level || 'HSK 1');
        setNewPostTitle(`Chia sẻ kết quả ${latest.examTitle || latest.examLevel || 'HSK'}`);
        setNewPostContent(
          `Mình vừa hoàn thành "${latest.examTitle || 'bài thi thử HSK'}" đạt ${latest.score}/${latest.maxScore} điểm (chính xác ${latest.accuracyPercentage}%) ở chế độ ${latest.examMode === 'simulation' ? 'Phòng thi CBT' : 'Luyện tập'}! Cùng cố gắng giữ phong độ nhé 💪`
        );
        showToast('Đã điền nhanh thành tích thật của bạn vào khung soạn bài!');
        return;
      }
    } catch {}
    setNewPostTag('#KinhNghiemHoc');
    setNewPostTitle(`Cập nhật chuỗi học ${currentStreak || 1} ngày cùng HanziGo`);
    setNewPostContent(
      `Hôm nay mình đã tích lũy ${totalUserXp} XP và duy trì chuỗi ${currentStreak} ngày học tiếng Trung liên tục. Mọi người cùng cố gắng nhé!`
    );
    showToast('Đã điền thành tích chuỗi học vào khung soạn bài!');
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!requireAuthForCommunity('đăng bài')) return;

    const validation = validateCommunityPostInput({
      title: newPostTitle,
      content: newPostContent,
      chineseSnippet: newPostChinese,
      pinyinSnippet: newPostPinyin,
      imageUrl: postImage,
    });
    if (!validation.valid) {
      showToast(validation.error);
      return;
    }

    let finalBody = validation.sanitized.content;
    if (postContactInfo.trim()) {
      finalBody += `\n\n📌 Thông tin liên hệ (${postContactMethod}): ${postContactInfo.trim().slice(0, 120)}`;
    }

    const formattedContent = formatStructuredPostContent({
      title: validation.sanitized.title,
      hskLevel: newPostHskLevel,
      chineseSnippet: validation.sanitized.chineseSnippet,
      pinyinSnippet: validation.sanitized.pinyinSnippet,
      content: finalBody,
    });

    const payload = {
      content: formattedContent,
      tag: newPostTag,
      image_url: validation.sanitized.imageUrl,
    };

    try {
      const res = await submitNewPost(payload);
      if (res?.success && res.post) {
        playSuccessSound();
        awardXp(20);
        try {
          confetti({ particleCount: 45, spread: 60, origin: { y: 0.5 } });
        } catch {}
        setIsCloudSynced(true);
        setPosts((prev) => [res.post, ...prev]);
        setNewPostTitle('');
        setNewPostContent('');
        setNewPostChinese('');
        setNewPostPinyin('');
        setPostContactInfo('');
        setPostImage('');
        setShowSnippetInputs(false);
        showToast('Đã đăng bài viết thành công (+20 XP)!');
      } else {
        showToast(res?.error || 'Không thể đăng bài viết. Vui lòng thử lại!');
      }
    } catch (err) {
      console.warn('Error creating community post:', err);
      showToast('Lỗi khi đăng bài viết.');
    }
  };

  const handleSaveEditPost = async (postId) => {
    if (!requireAuthForCommunity('chỉnh sửa bài viết')) return;
    const validation = validateCommunityPostInput({ content: editPostDraft });
    if (!validation.valid) {
      showToast(validation.error);
      return;
    }
    const ok = await editPost(postId, { content: validation.sanitized.content });
    if (ok) {
      setPosts((prev) =>
        prev.map((p) =>
          String(p.id) === String(postId) ? { ...p, content: validation.sanitized.content } : p
        )
      );
      setEditingPostId(null);
      setEditPostDraft('');
      showToast('Đã cập nhật bài viết!');
    } else {
      showToast('Không thể cập nhật bài viết.');
    }
  };

  const handleModeratePost = async (postId, action) => {
    if (!requireAuthForCommunity('kiểm duyệt')) return;
    playClickSound();
    const res = await moderatePost(postId, action);
    if (res?.success) {
      if (action === 'hide') {
        setPosts((prev) => prev.filter((p) => String(p.id) !== String(postId)));
        showToast('Đã ẩn bài viết vi phạm.');
      } else {
        const pinned = action === 'pin';
        setPosts((prev) =>
          prev.map((p) => (String(p.id) === String(postId) ? { ...p, isPinned: pinned } : p))
        );
        showToast(pinned ? 'Đã ghim bài viết!' : 'Đã bỏ ghim bài viết.');
      }
    } else {
      showToast(res?.error || 'Không có quyền thực hiện thao tác.');
    }
  };

  const handleApplyPrompt = (item) => {
    playClickSound();
    setNewPostTag(item.tag);
    setNewPostContent(item.prompt);
  };

  const handleToggleLike = async (postId) => {
    playClickSound();
    if (!requireAuthForCommunity('thích bài viết')) return;
    const idStr = String(postId);

    setPosts((prev) => toggleLikeOptimisticList(prev, idStr));

    const res = await toggleLike(idStr);
    if (res?.success && res.data) {
      setPosts((prev) =>
        prev.map((p) => {
          if (String(p.id) === idStr) {
            return {
              ...p,
              liked: res.data.action === 'added',
              likes: res.data.likes_count,
            };
          }
          return p;
        })
      );
    } else {
      setPosts((prev) => toggleLikeOptimisticList(prev, idStr));
      showToast(res?.error || 'Không thể cập nhật lượt thích. Vui lòng đăng nhập!');
    }
  };

  const handleToggleSave = (id) => {
    playClickSound();
    const idStr = String(id);
    const updated = posts.map((p) => {
      if (String(p.id) === idStr) {
        const isSaved = !p.saved;
        showToast(isSaved ? 'Đã lưu bài viết vào mục yêu thích!' : 'Đã bỏ lưu bài viết!');
        return { ...p, saved: isSaved };
      }
      return p;
    });
    setPosts(updated);
  };

  const handleToggleSolved = async (id) => {
    if (!requireAuthForCommunity('đánh dấu giải đáp')) return;
    playClickSound();
    const idStr = String(id);
    const targetPost = posts.find((p) => String(p.id) === idStr);
    const prevSolved = Boolean(targetPost?.isSolved);
    const newSolved = !prevSolved;

    setPosts((prev) => prev.map((p) => (String(p.id) === idStr ? { ...p, isSolved: newSolved } : p)));
    if (newSolved) {
      playSuccessSound();
      showToast('Đã đánh dấu câu hỏi: Đã được giải đáp! ✅');
    } else {
      showToast('Đã bỏ đánh dấu giải đáp.');
    }

    try {
      const ok = await editPost(idStr, { is_solved: newSolved });
      if (!ok) {
        setPosts((prev) =>
          prev.map((p) => (String(p.id) === idStr ? { ...p, isSolved: prevSolved } : p))
        );
        showToast('Không thể cập nhật trạng thái giải đáp.');
      }
    } catch (err) {
      console.warn('Error updating solved status on Supabase:', err);
      setPosts((prev) =>
        prev.map((p) => (String(p.id) === idStr ? { ...p, isSolved: prevSolved } : p))
      );
    }
  };

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

  const handleDeletePost = async (id) => {
    const idStr = String(id);
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      playClickSound();
      setPosts((prev) => prev.filter((p) => String(p.id) !== idStr));
      try {
        await removePost(idStr);
        showToast('Đã xóa bài viết khỏi cộng đồng!');
      } catch (err) {
        console.warn('Error deleting post:', err);
        showToast('Lỗi khi xóa bài viết.');
      }
    }
  };

  const handleToggleComments = async (id) => {
    playClickSound();
    const idStr = String(id);
    const willExpand = !expandedComments[idStr];
    setExpandedComments((prev) => ({
      ...prev,
      [idStr]: willExpand,
    }));

    if (willExpand && !postCommentsMap[idStr]) {
      setLoadingCommentsMap((prev) => ({ ...prev, [idStr]: true }));
      try {
        const comments = await loadComments(idStr);
        setPostCommentsMap((prev) => ({ ...prev, [idStr]: comments }));
      } catch (err) {
        console.warn(`Could not load comments for post ${idStr}:`, err);
      } finally {
        setLoadingCommentsMap((prev) => ({ ...prev, [idStr]: false }));
      }
    }
  };

  const handleAddComment = async (postId) => {
    const idStr = String(postId);
    if (!requireAuthForCommunity('bình luận')) return;
    if (submittingCommentMap[idStr]) return;

    const validation = validateCommunityCommentInput(commentInputs[idStr] || '');
    if (!validation.valid) {
      showToast(validation.error);
      return;
    }

    setSubmittingCommentMap((prev) => ({ ...prev, [idStr]: true }));

    try {
      const newComment = await createComment(idStr, validation.sanitizedContent);
      if (newComment) {
        playSuccessSound();
        awardXp(5);
        setPostCommentsMap((prev) => ({
          ...prev,
          [idStr]: [...(prev[idStr] || []), newComment],
        }));
        setPosts((prev) =>
          prev.map((p) =>
            String(p.id) === idStr ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p
          )
        );
        setCommentInputs((prev) => ({ ...prev, [idStr]: '' }));
        showToast('Đã gửi bình luận (+5 XP)!');
      } else {
        showToast('Không thể gửi bình luận. Vui lòng thử lại sau vài giây!');
      }
    } catch (err) {
      console.warn('Error submitting comment:', err);
      showToast('Lỗi khi gửi bình luận.');
    } finally {
      setSubmittingCommentMap((prev) => ({ ...prev, [idStr]: false }));
    }
  };

  const handleSaveEditComment = async (postId, commentId) => {
    if (!requireAuthForCommunity('chỉnh sửa bình luận')) return;
    const validation = validateCommunityCommentInput(editCommentDraft);
    if (!validation.valid) {
      showToast(validation.error);
      return;
    }
    const ok = await editComment(commentId, validation.sanitizedContent);
    if (ok) {
      const postIdStr = String(postId);
      setPostCommentsMap((prev) => ({
        ...prev,
        [postIdStr]: (prev[postIdStr] || []).map((c) =>
          String(c.id) === String(commentId) ? { ...c, content: validation.sanitizedContent } : c
        ),
      }));
      setEditingCommentId(null);
      setEditCommentDraft('');
      showToast('Đã cập nhật bình luận!');
    } else {
      showToast('Không thể cập nhật bình luận.');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!requireAuthForCommunity('xóa bình luận')) return;
    const idStr = String(postId);
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
    playClickSound();

    try {
      const ok = await removeComment(commentId);
      if (ok) {
        setPostCommentsMap((prev) => ({
          ...prev,
          [idStr]: (prev[idStr] || []).filter((c) => String(c.id) !== String(commentId)),
        }));
        setPosts((prev) =>
          prev.map((p) =>
            String(p.id) === idStr
              ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 1) - 1) }
              : p
          )
        );
        showToast('Đã xóa bình luận!');
      }
    } catch (err) {
      console.warn('Error deleting comment:', err);
    }
  };

  const handleJoinChallenge = () => {
    playSuccessSound();
    awardXp(20);
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
      });
    } catch {}

    const today = getTodayDateKey();
    const updated = {
      joined: true,
      checkIns: 1,
      lastDate: today,
    };
    setChallengeData(updated);
    localStorage.setItem(STORAGE_KEYS.CHALLENGE, JSON.stringify(updated));
    showToast('Chúc mừng! Bạn đã bắt đầu Thử Thách 21 Ngày (+20 XP)!');
  };

  const handleCheckIn = () => {
    const today = getTodayDateKey();
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
        origin: { y: 0.6 },
      });
    } catch {}

    const updated = {
      ...challengeData,
      checkIns: Math.min(21, (challengeData.checkIns || 0) + 1),
      lastDate: today,
    };
    setChallengeData(updated);
    localStorage.setItem(STORAGE_KEYS.CHALLENGE, JSON.stringify(updated));
    showToast(`Điểm danh thành công! Đã hoàn thành Ngày ${updated.checkIns}/21 (+15 XP) 🎉`);
  };

  const handleOpenCreatePartnerModal = () => {
    playClickSound();
    setEditingPartnerId(null);
    setPartnerForm({
      name: user?.name || '',
      level: user?.level || 'HSK 1',
      goal: '',
      dailyTime: 'Tối 20h - 21h',
      skills: 'Luyện khẩu ngữ',
      contactMethod: 'Zalo',
      contactInfo: '',
      isContactPublic: true,
      isActive: true,
      qrImage: '',
    });
    setIsPartnerModalOpen(true);
  };

  const handleOpenEditPartnerModal = (partner) => {
    playClickSound();
    setEditingPartnerId(partner.id);
    setPartnerForm({
      name: partner.name || '',
      level: partner.level || partner.targetLevel || 'HSK 1',
      goal: partner.goal || partner.intro || '',
      dailyTime: partner.dailyTime || '',
      skills: partner.skills || 'Luyện khẩu ngữ',
      contactMethod: partner.contactMethod || 'Zalo',
      contactInfo: partner.contactInfo || '',
      isContactPublic: partner.isContactPublic !== false,
      isActive: partner.isActive !== false,
      qrImage: partner.qrImage || '',
    });
    setIsPartnerModalOpen(true);
  };

  const handleTogglePartnerStatus = async (partner) => {
    playClickSound();
    const newStatus = !partner.isActive;
    const actionLabel = newStatus ? 'kích hoạt lại' : 'tạm ngưng';

    const updated = studyPartners.map((p) =>
      p.id === partner.id ? { ...p, isActive: newStatus } : p
    );
    persistPartners(updated);
    showToast(`Đã ${actionLabel} hiển thị hồ sơ tìm bạn!`);

    await togglePartnerStatus(partner.id, newStatus);
  };

  const handleSavePartner = async (e) => {
    e.preventDefault();
    if (!partnerForm.name.trim()) {
      alert('Vui lòng nhập họ tên hoặc biệt danh!');
      return;
    }

    playSuccessSound();

    if (editingPartnerId) {
      const updated = studyPartners.map((p) => {
        if (p.id === editingPartnerId) {
          return {
            ...p,
            name: partnerForm.name.trim(),
            initial: partnerForm.name.trim().charAt(0).toUpperCase(),
            level: partnerForm.level,
            targetLevel: partnerForm.level,
            goal: partnerForm.goal.trim() || 'Luyện phản xạ giao tiếp',
            intro: partnerForm.goal.trim() || 'Luyện phản xạ giao tiếp',
            dailyTime: partnerForm.dailyTime.trim(),
            skills: partnerForm.skills.trim() || 'Luyện khẩu ngữ',
            contactMethod: partnerForm.contactMethod,
            contactInfo: partnerForm.contactInfo.trim(),
            isContactPublic: partnerForm.isContactPublic,
            isActive: partnerForm.isActive,
            qrImage: partnerForm.qrImage || null,
          };
        }
        return p;
      });
      persistPartners(updated);
      setIsPartnerModalOpen(false);
      showToast('Đã cập nhật hồ sơ tìm bạn cùng tiến!');

      await editPartner(editingPartnerId, {
        name: partnerForm.name.trim(),
        level: partnerForm.level,
        goal: partnerForm.goal.trim() || 'Luyện phản xạ giao tiếp',
        dailyTime: partnerForm.dailyTime.trim(),
        skills: partnerForm.skills.trim() || 'Luyện khẩu ngữ',
        contactMethod: partnerForm.contactMethod,
        contactInfo: partnerForm.contactInfo.trim(),
        isContactPublic: partnerForm.isContactPublic,
        isActive: partnerForm.isActive,
        qrImage: partnerForm.qrImage || null,
      });
    } else {
      awardXp(15);
      const tempPartnerId = `partner-${Date.now()}`;
      const newPartner = {
        id: tempPartnerId,
        userId: user?.id || null,
        name: partnerForm.name.trim(),
        initial: partnerForm.name.trim().charAt(0).toUpperCase(),
        level: partnerForm.level,
        targetLevel: partnerForm.level,
        goal: partnerForm.goal.trim() || 'Luyện phản xạ giao tiếp',
        intro: partnerForm.goal.trim() || 'Luyện phản xạ giao tiếp',
        dailyTime: partnerForm.dailyTime.trim(),
        skills: partnerForm.skills.trim() || 'Luyện khẩu ngữ',
        contactMethod: partnerForm.contactMethod,
        contactInfo: partnerForm.contactInfo.trim(),
        isContactPublic: partnerForm.isContactPublic,
        isActive: partnerForm.isActive,
        qrImage: partnerForm.qrImage || null,
        createdAt: 'Hôm nay',
        isMyPartnerPost: true,
      };

      const updated = [newPartner, ...studyPartners];
      persistPartners(updated);
      setIsPartnerModalOpen(false);
      showToast('Đã đăng bài tìm bạn học (+15 XP)!');

      try {
        const cloudId = await createPartner({
          name: newPartner.name,
          level: newPartner.level,
          goal: newPartner.goal,
          dailyTime: newPartner.dailyTime,
          skills: newPartner.skills,
          contactMethod: newPartner.contactMethod,
          contactInfo: newPartner.contactInfo,
          isContactPublic: newPartner.isContactPublic,
          isActive: newPartner.isActive,
          qrImage: newPartner.qrImage,
          userId: user?.id || null,
        });

        if (cloudId) {
          setStudyPartners((prev) => {
            const withCloudId = prev.map((p) =>
              p.id === tempPartnerId ? { ...p, id: cloudId } : p
            );
            try {
              localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(withCloudId));
            } catch (err) {
              console.error(err);
            }
            return withCloudId;
          });
        }
      } catch (err) {
        console.warn('Không thể đồng bộ Study Partner lên Cloud:', err);
      }
    }
  };

  const handleDeletePartner = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài đăng tìm bạn học này?')) {
      playClickSound();
      const updated = studyPartners.filter((p) => p.id !== id);
      persistPartners(updated);
      await removePartner(id).catch(() => {});
      showToast('Đã xóa thông tin tìm bạn học!');
    }
  };

  const handleCopyContact = (info) => {
    playClickSound();
    navigator.clipboard.writeText(info);
    showToast(`Đã sao chép: ${info}`);
  };

  const handleOpenContactLink = (contactMethod, contactInfo) => {
    playClickSound();
    const action = resolveContactAction(contactMethod, contactInfo);
    if (action.type === 'url') {
      window.open(action.target, '_blank', 'noopener,noreferrer');
    } else if (action.type === 'tel') {
      window.open(action.target, '_self');
    } else if (action.type === 'copy') {
      handleCopyContact(action.target);
    }
  };

  const rankTier = useMemo(() => getRankTier(totalUserXp), [totalUserXp]);
  const isCheckedInToday = challengeData.lastDate === getTodayDateKey();

  const filteredPosts = useMemo(
    () =>
      filterAndSortPosts(posts, {
        searchTerm,
        selectedTag,
        selectedHskGroup,
        postSort,
      }),
    [posts, searchTerm, selectedTag, selectedHskGroup, postSort]
  );

  const myPartnerProfile = useMemo(
    () =>
      studyPartners.find((p) =>
        Boolean((user?.id && p.userId && String(user.id) === String(p.userId)) || p.isMyPartnerPost)
      ),
    [studyPartners, user]
  );

  const filteredPartners = useMemo(
    () =>
      filterStudyPartners(studyPartners, {
        partnerFilterLevel,
        partnerFilterMethod,
        partnerFilterStatus,
        partnerSearchTerm,
        user,
      }),
    [studyPartners, partnerFilterLevel, partnerFilterMethod, partnerFilterStatus, partnerSearchTerm, user]
  );

  const activePartnerFilterCount =
    (partnerFilterLevel !== 'all' ? 1 : 0) +
    (partnerFilterMethod !== 'all' ? 1 : 0) +
    (partnerFilterStatus !== 'all' ? 1 : 0);

  return {
    posts,
    hasMorePosts,
    nextPostCursor,
    isLoadingPosts,
    isLoadingMorePosts,
    postCommentsMap,
    loadingCommentsMap,
    submittingCommentMap,
    reportModalState,
    setReportModalState,
    solvedPostIds,
    studyPartners,
    challengeData,
    completedLessonsCount,
    isCloudSynced,
    isRefreshing,
    selectedTag,
    setSelectedTag,
    selectedHskGroup,
    setSelectedHskGroup,
    postSort,
    setPostSort,
    newPostTitle,
    setNewPostTitle,
    newPostContent,
    setNewPostContent,
    newPostTag,
    setNewPostTag,
    newPostHskLevel,
    setNewPostHskLevel,
    newPostChinese,
    setNewPostChinese,
    newPostPinyin,
    setNewPostPinyin,
    showSnippetInputs,
    setShowSnippetInputs,
    postContactMethod,
    setPostContactMethod,
    postContactInfo,
    setPostContactInfo,
    postImage,
    setPostImage,
    searchTerm,
    setSearchTerm,
    editingPostId,
    setEditingPostId,
    editPostDraft,
    setEditPostDraft,
    editingCommentId,
    setEditingCommentId,
    editCommentDraft,
    setEditCommentDraft,
    partnerFilterLevel,
    setPartnerFilterLevel,
    partnerFilterMethod,
    setPartnerFilterMethod,
    partnerFilterStatus,
    setPartnerFilterStatus,
    partnerSearchTerm,
    setPartnerSearchTerm,
    showPartnerFilters,
    setShowPartnerFilters,
    isLoadingPartners,
    expandedComments,
    commentInputs,
    setCommentInputs,
    isPartnerModalOpen,
    setIsPartnerModalOpen,
    editingPartnerId,
    partnerForm,
    setPartnerForm,
    activeContactModal,
    setActiveContactModal,
    zoomImageModal,
    setZoomImageModal,
    toastMessage,
    totalUserXp,
    currentStreak,
    rankTier,
    isCheckedInToday,
    filteredPosts,
    myPartnerProfile,
    filteredPartners,
    activePartnerFilterCount,
    showToast,
    handleOpenReportModal,
    handleRefreshCloud,
    handleLoadMorePosts,
    handleShareAchievement,
    handleCreatePost,
    handleSaveEditPost,
    handleModeratePost,
    handleApplyPrompt,
    handleToggleLike,
    handleToggleSave,
    handleToggleSolved,
    handleSpeakChinesePost,
    handleDeletePost,
    handleToggleComments,
    handleAddComment,
    handleSaveEditComment,
    handleDeleteComment,
    handleJoinChallenge,
    handleCheckIn,
    handleOpenCreatePartnerModal,
    handleOpenEditPartnerModal,
    handleTogglePartnerStatus,
    handleSavePartner,
    handleDeletePartner,
    handleOpenContactLink,
    handleCopyContact,
  };
}
