import { supabase, isSupabaseConfigured } from '../supabase/config.js';

/**
 * Format relative or localized date string for community posts and comments
 */
export function formatCommunityTime(timestamp) {
  if (!timestamp) return 'Vừa xong';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Vừa xong';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString('vi-VN');
  } catch {
    return 'Vừa xong';
  }
}

/**
 * Normalizes raw post record from database into standardized frontend model.
 * Enforces string serialization for post.id to avoid 64-bit float precision loss.
 */
export function normalizePostData(row, currentUserId = null, userLikedSet = new Set()) {
  if (!row) return null;

  const postIdStr = String(row.id);
  const authorName = (row.author_name || '').trim();
  const isBqt = authorName.includes('Ban Quản Trị') || 
                row.author_level === 'Quản trị viên' || 
                row.author_level === 'BQT' ||
                postIdStr === 'system-welcome';

  const isLegacyUnsplash = (row.author_avatar && row.author_avatar.includes('photo-1534528741775-53994a69daeb'));
  const avatarUrl = (isBqt || isLegacyUnsplash)
    ? '/hanzigo-logo.svg'
    : (row.author_avatar || null);

  const initial = isBqt 
    ? 'HZ' 
    : (authorName ? authorName.charAt(0).toUpperCase() : 'H');

  return {
    id: postIdStr,
    author: authorName || 'Học viên HanziGo',
    avatar: avatarUrl,
    initial,
    level: isBqt ? 'Quản trị viên' : (row.author_level || 'HSK 1'),
    content: row.content || '',
    tag: row.tag || '',
    image: row.image_url || row.image || null,
    likes: Number(row.likes_count ?? row.likes ?? 0),
    liked: userLikedSet.has(postIdStr),
    commentsCount: Number(row.comments_count ?? (Array.isArray(row.comments) ? row.comments.length : 0)),
    comments: [], // Comments loaded relationally via getPostComments(postId)
    isPinned: Boolean(row.is_pinned),
    isSolved: Boolean(row.is_solved),
    isMyPost: Boolean(currentUserId && row.author_id === currentUserId),
    time: formatCommunityTime(row.created_at),
    createdAt: row.created_at || new Date().toISOString()
  };
}

/**
 * Fetch paginated community posts using compound cursor pagination.
 * Single Source of Truth from Supabase `public.community_posts`.
 *
 * @param {Object} options
 * @param {number} [options.limit=20]
 * @param {Object|string|null} [options.cursor=null]
 * @param {string} [options.tag='all']
 * @returns {Promise<{posts: Array, nextCursor: Object|null, hasMore: boolean}>}
 */
export async function getCommunityPosts(options = {}) {
  if (!isSupabaseConfigured || !supabase) {
    return { posts: [], nextCursor: null, hasMore: false };
  }

  const { limit = 20, cursor = null, tag = 'all' } = options;

  try {
    // 1. Get current authenticated user ID for reaction and ownership resolution
    let currentUserId = null;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      currentUserId = sessionData?.session?.user?.id || null;
    } catch {
      currentUserId = null;
    }

    // 2. Query posts from community_posts table
    let query = supabase
      .from('community_posts')
      .select('id, author_id, author_name, author_avatar, author_level, content, tag, image_url, likes_count, comments_count, is_pinned, is_solved, status, created_at, updated_at')
      .neq('status', 'hidden')
      .is('deleted_at', null);

    // Apply tag filter if specified
    if (tag && tag !== 'all' && tag !== 'saved') {
      query = query.eq('tag', tag);
    }

    // 3-Tuple cursor filtering: (is_pinned DESC, created_at DESC, id DESC)
    // Mathematical condition to fetch strictly following rows:
    // If cursor.is_pinned is true:
    //   (is_pinned = true AND (created_at < cursor.created_at OR (created_at = cursor.created_at AND id < cursor.id)))
    //   OR (is_pinned = false)
    // If cursor.is_pinned is false:
    //   (is_pinned = false AND (created_at < cursor.created_at OR (created_at = cursor.created_at AND id < cursor.id)))
    if (cursor) {
      if (typeof cursor === 'object' && cursor.created_at && cursor.id) {
        const cursorPinned = Boolean(cursor.is_pinned);
        const cursorCreatedAt = cursor.created_at;
        const cursorId = cursor.id;

        if (cursorPinned) {
          query = query.or(
            `and(is_pinned.eq.true,or(created_at.lt.${cursorCreatedAt},and(created_at.eq.${cursorCreatedAt},id.lt.${cursorId}))),is_pinned.eq.false`
          );
        } else {
          query = query
            .eq('is_pinned', false)
            .or(`created_at.lt.${cursorCreatedAt},and(created_at.eq.${cursorCreatedAt},id.lt.${cursorId})`);
        }
      } else if (typeof cursor === 'object' && cursor.created_at) {
        query = query.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`);
      } else if (typeof cursor === 'string') {
        query = query.lt('created_at', cursor);
      }
    }

    // Stable deterministic order: pinned first, then newest created_at, then highest id
    query = query
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit + 1);

    const { data, error } = await query;
    if (error) throw error;

    const rawRows = data || [];
    const hasMore = rawRows.length > limit;
    const pagedRows = hasMore ? rawRows.slice(0, limit) : rawRows;

    // 3. Resolve user reactions in batch for returned posts
    const userLikedSet = new Set();
    if (currentUserId && pagedRows.length > 0) {
      const postIds = pagedRows.map(r => r.id);
      try {
        const { data: reactionsData } = await supabase
          .from('community_reactions')
          .select('post_id')
          .eq('user_id', currentUserId)
          .in('post_id', postIds);

        if (reactionsData) {
          reactionsData.forEach(r => userLikedSet.add(String(r.post_id)));
        }
      } catch (err) {
        console.warn('Could not batch fetch user community reactions:', err);
      }
    }

    const posts = pagedRows.map(row => normalizePostData(row, currentUserId, userLikedSet));

    let nextCursor = null;
    if (hasMore && pagedRows.length > 0) {
      const lastItem = pagedRows[pagedRows.length - 1];
      nextCursor = {
        is_pinned: Boolean(lastItem.is_pinned),
        created_at: lastItem.created_at,
        id: String(lastItem.id)
      };
    }

    return { posts, nextCursor, hasMore };
  } catch (err) {
    console.warn('Could not fetch Supabase community posts:', err);
    return { posts: [], nextCursor: null, hasMore: false };
  }
}

/**
 * Fetch a single community post by ID
 * @param {string|number} postId
 */
export async function getCommunityPostById(postId) {
  if (!isSupabaseConfigured || !supabase || !postId) return null;

  try {
    let currentUserId = null;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      currentUserId = sessionData?.session?.user?.id || null;
    } catch {
      currentUserId = null;
    }

    const { data: row, error } = await supabase
      .from('community_posts')
      .select('id, author_id, author_name, author_avatar, author_level, content, tag, image_url, likes_count, comments_count, is_pinned, is_solved, status, created_at, updated_at')
      .eq('id', postId)
      .is('deleted_at', null)
      .single();

    if (error || !row) return null;

    const userLikedSet = new Set();
    if (currentUserId) {
      const { data: reaction } = await supabase
        .from('community_reactions')
        .select('post_id')
        .eq('post_id', row.id)
        .eq('user_id', currentUserId)
        .maybeSingle();

      if (reaction) {
        userLikedSet.add(String(row.id));
      }
    }

    return normalizePostData(row, currentUserId, userLikedSet);
  } catch (err) {
    console.warn('Could not fetch community post by id:', err);
    return null;
  }
}

/**
 * Create a new community post.
 * Author metadata, likes_count (0), and comments_count (0) are enforced by database triggers.
 *
 * @param {Object} payload
 * @param {string} payload.content
 * @param {string} [payload.tag]
 * @param {string} [payload.image_url]
 * @param {string} [payload.image]
 * @returns {Promise<{success: boolean, id: string|null, post: Object|null}>}
 */
export async function createCommunityPost(payload) {
  if (!isSupabaseConfigured || !supabase) return { success: false, id: null, post: null };

  try {
    const insertPayload = {
      content: payload.content ? payload.content.trim() : '',
      tag: payload.tag || '#HoiDapNguPhap',
      image_url: payload.image_url || payload.image || null
    };

    const { data, error } = await supabase
      .from('community_posts')
      .insert([insertPayload])
      .select('id, author_id, author_name, author_avatar, author_level, content, tag, image_url, likes_count, comments_count, is_pinned, is_solved, status, created_at, updated_at')
      .single();

    if (error) throw error;

    const currentUserId = (await supabase.auth.getSession())?.data?.session?.user?.id || null;
    const normalized = normalizePostData(data, currentUserId, new Set());

    return {
      success: true,
      id: String(data.id),
      post: normalized
    };
  } catch (err) {
    console.error('Could not create Supabase post:', err);
    return { success: false, id: null, post: null };
  }
}

/**
 * Backward compatibility alias for createCommunityPost
 */
export async function addCommunityPost(postData) {
  const result = await createCommunityPost(postData);
  return result?.id || null;
}

/**
 * Update an existing community post.
 * Strict column whitelist: only mutable content fields (content, tag, image_url, is_solved) are allowed.
 * Counter fields and metadata are blocked from direct client mutation.
 *
 * @param {string|number} postId
 * @param {Object} updateData
 * @returns {Promise<boolean>}
 */
export async function updateCommunityPost(postId, updateData = {}) {
  if (!isSupabaseConfigured || !supabase || !postId) return false;

  try {
    const payload = {};
    if (updateData.content !== undefined) payload.content = updateData.content.trim();
    if (updateData.tag !== undefined) payload.tag = updateData.tag;
    if (updateData.image_url !== undefined) payload.image_url = updateData.image_url;
    if (updateData.image !== undefined) payload.image_url = updateData.image;
    if (updateData.is_solved !== undefined) payload.is_solved = Boolean(updateData.is_solved);

    if (Object.keys(payload).length === 0) return false;

    payload.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('community_posts')
      .update(payload)
      .eq('id', postId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Could not update Supabase post:', err);
    return false;
  }
}

/**
 * Delete a community post (soft delete or hard delete based on RLS).
 * @param {string|number} postId
 * @returns {Promise<boolean>}
 */
export async function deleteCommunityPost(postId) {
  if (!isSupabaseConfigured || !supabase || !postId) return false;

  try {
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Could not delete Supabase post:', err);
    return false;
  }
}

// =========================================================================
// COMMENTS API (RELATIONAL SINGLE SOURCE OF TRUTH)
// =========================================================================

/**
 * Map comment row into standardized frontend comment object
 */
function mapCommentRow(row, currentUserId) {
  const profile = row.profiles || {};
  const authorName = (row.author_id && (profile.name || profile.full_name))
    ? (profile.name || profile.full_name)
    : (row.legacy_author_name || (!row.author_id ? 'Học viên ẩn danh' : 'Học viên HanziGo'));
  const isBqt = (profile.role === 'admin') || authorName.includes('Ban Quản Trị');
  const avatarUrl = isBqt 
    ? '/hanzigo-logo.svg' 
    : (profile.avatar || profile.avatar_url || null);

  return {
    id: String(row.id),
    postId: String(row.post_id),
    authorId: row.author_id,
    author: authorName,
    avatar: avatarUrl,
    level: profile.level || (isBqt ? 'Quản trị viên' : 'HSK 1'),
    content: row.content,
    legacySourceId: row.legacy_source_id || null,
    legacyAuthorName: row.legacy_author_name || null,
    time: formatCommunityTime(row.created_at),
    createdAt: row.created_at,
    isMyComment: Boolean(currentUserId && row.author_id === currentUserId)
  };
}

/**
 * Fetch comments for a specific community post.
 * @param {string|number} postId
 * @param {Object} [options]
 * @param {number} [options.limit=50]
 * @returns {Promise<Array>}
 */
export async function getPostComments(postId, options = {}) {
  if (!isSupabaseConfigured || !supabase || !postId) return [];

  const { limit = 50 } = options;

  try {
    let currentUserId = null;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      currentUserId = sessionData?.session?.user?.id || null;
    } catch {
      currentUserId = null;
    }

    // Note: legacy_source_id and legacy_author_name are queried safely if present
    const { data, error } = await supabase
      .from('community_comments')
      .select(`
        id,
        post_id,
        author_id,
        content,
        status,
        created_at,
        updated_at,
        legacy_source_id,
        legacy_author_name,
        profiles:author_id (
          id,
          name,
          avatar,
          level,
          role
        )
      `)
      .eq('post_id', postId)
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      // Graceful fallback if legacy columns are not yet applied on cloud
      if (error.code === '42703') {
        const { data: fallbackData, error: fallbackErr } = await supabase
          .from('community_comments')
          .select(`
            id,
            post_id,
            author_id,
            content,
            status,
            created_at,
            updated_at,
            profiles:author_id (
              id,
              name,
              avatar,
              level,
              role
            )
          `)
          .eq('post_id', postId)
          .eq('status', 'published')
          .is('deleted_at', null)
          .order('created_at', { ascending: true })
          .limit(limit);
        if (fallbackErr) throw fallbackErr;
        return (fallbackData || []).map(row => mapCommentRow(row, currentUserId));
      }
      throw error;
    }

    return (data || []).map(row => mapCommentRow(row, currentUserId));
  } catch (err) {
    console.warn(`Could not fetch comments for post ${postId}:`, err);
    return [];
  }
}

/**
 * Create a new relational comment on a community post.
 * Automatically triggers database counter synchronization on `community_posts.comments_count`.
 *
 * @param {string|number} postId
 * @param {string} content
 * @returns {Promise<Object|null>}
 */
export async function createCommunityComment(postId, content) {
  if (!isSupabaseConfigured || !supabase || !postId || !content?.trim()) return null;

  try {
    const { data, error } = await supabase
      .from('community_comments')
      .insert([{
        post_id: postId,
        content: content.trim()
      }])
      .select(`
        id,
        post_id,
        author_id,
        content,
        status,
        created_at,
        updated_at,
        profiles:author_id (
          id,
          name,
          avatar,
          level,
          role
        )
      `)
      .single();

    if (error) throw error;

    const currentUserId = (await supabase.auth.getSession())?.data?.session?.user?.id || null;
    const profile = data.profiles || {};
    const authorName = profile.name || profile.full_name || 'Học viên HanziGo';
    const isBqt = (profile.role === 'admin') || authorName.includes('Ban Quản Trị');

    return {
      id: String(data.id),
      postId: String(data.post_id),
      authorId: data.author_id,
      author: authorName,
      avatar: isBqt ? '/hanzigo-logo.svg' : (profile.avatar || profile.avatar_url || null),
      level: profile.level || (isBqt ? 'Quản trị viên' : 'HSK 1'),
      content: data.content,
      time: formatCommunityTime(data.created_at),
      createdAt: data.created_at,
      isMyComment: Boolean(currentUserId && data.author_id === currentUserId)
    };
  } catch (err) {
    console.error('Could not create community comment:', err);
    return null;
  }
}

/**
 * Update an existing comment content.
 * @param {string} commentId
 * @param {string} content
 * @returns {Promise<boolean>}
 */
export async function updateCommunityComment(commentId, content) {
  if (!isSupabaseConfigured || !supabase || !commentId || !content?.trim()) return false;

  try {
    const { error } = await supabase
      .from('community_comments')
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Could not update community comment:', err);
    return false;
  }
}

/**
 * Delete a comment.
 * Database trigger automatically decrements `community_posts.comments_count`.
 * @param {string} commentId
 * @returns {Promise<boolean>}
 */
export async function deleteCommunityComment(commentId) {
  if (!isSupabaseConfigured || !supabase || !commentId) return false;

  try {
    const { error } = await supabase
      .from('community_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Could not delete community comment:', err);
    return false;
  }
}

// =========================================================================
// ATOMIC REACTION API (RPC INTEGRATION)
// =========================================================================

/**
 * Atomic post reaction toggle using PostgreSQL RPC `toggle_community_post_reaction`.
 * Guarantees zero client-side increment/decrement and prevents tampering.
 *
 * @param {string|number} postId
 * @param {string} [reactionType='like']
 * @returns {Promise<{success: boolean, data?: {action: string, likes_count: number, user_reaction: string|null, post_id: string}, error?: string}>}
 */
export async function togglePostReaction(postId, reactionType = 'like') {
  if (!isSupabaseConfigured || !supabase || !postId) {
    return { success: false, error: 'Supabase is not configured or postId is missing.' };
  }

  try {
    const { data, error } = await supabase.rpc('toggle_community_post_reaction', {
      p_post_id: Number(postId) || postId,
      p_reaction_type: reactionType
    });

    if (error) throw error;

    return {
      success: true,
      data: {
        action: data.action,
        likes_count: Number(data.likes_count),
        user_reaction: data.user_reaction,
        post_id: String(data.post_id)
      }
    };
  } catch (err) {
    console.warn(`Could not toggle reaction for post ${postId}:`, err);
    return { success: false, error: err.message || 'Error executing reaction RPC' };
  }
}

// =========================================================================
// STUDY PARTNERS API (PHASE 24 / TASK 24.08E HARDENED)
// =========================================================================

/**
 * Validates study partner profile input
 */
export function validateStudyPartnerInput(partnerData = {}) {
  const name = (partnerData.name || '').trim();
  if (!name) {
    return { valid: false, error: 'Họ tên hoặc biệt danh là bắt buộc.' };
  }
  if (name.length > 60) {
    return { valid: false, error: 'Tên không được vượt quá 60 ký tự.' };
  }

  const level = (partnerData.level || partnerData.targetLevel || 'HSK 1').trim();
  const validLevels = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'Giao tiếp tự do'];
  const matchedLevel = validLevels.find(l => level.toLowerCase().startsWith(l.toLowerCase())) || level;

  const contactInfo = (partnerData.contactInfo || partnerData.contact || '').trim();
  if (contactInfo.length > 200) {
    return { valid: false, error: 'Thông tin liên hệ không được vượt quá 200 ký tự.' };
  }

  const goal = (partnerData.goal || partnerData.intro || 'Luyện phản xạ giao tiếp').trim();
  if (goal.length > 300) {
    return { valid: false, error: 'Mục tiêu luyện tập không được vượt quá 300 ký tự.' };
  }

  const dailyTime = (partnerData.dailyTime || partnerData.daily_time || '').trim();
  if (dailyTime.length > 100) {
    return { valid: false, error: 'Thời gian học phù hợp không được vượt quá 100 ký tự.' };
  }

  const skills = (partnerData.skills || 'Luyện khẩu ngữ').trim();
  if (skills.length > 150) {
    return { valid: false, error: 'Kỹ năng muốn luyện tập không được vượt quá 150 ký tự.' };
  }

  const qrImage = partnerData.qrImage || partnerData.qr_image || null;
  if (qrImage && typeof qrImage === 'string' && qrImage.length > 350000) {
    return { valid: false, error: 'Ảnh mã QR quá lớn (tối đa 250KB sau khi nén).' };
  }

  return {
    valid: true,
    sanitized: {
      name,
      level: matchedLevel,
      targetLevel: matchedLevel,
      contactMethod: partnerData.contactMethod || 'Zalo',
      contactInfo,
      goal,
      intro: goal,
      dailyTime,
      skills,
      qrImage,
      isActive: partnerData.isActive !== false,
      isContactPublic: partnerData.isContactPublic !== false,
      userId: partnerData.userId || partnerData.user_id || null
    }
  };
}

/**
 * Normalizes a raw Supabase study_partners DB row
 */
export function normalizePartnerData(row, currentUserId = null) {
  if (!row) return null;

  let contactMethod = row.contact_method || 'Zalo';
  let contactInfo = row.contact_info || row.contact || '';

  if (!row.contact_info && row.contact && row.contact.includes(':')) {
    const parts = row.contact.split(':');
    const first = parts[0].trim();
    const knownMethods = ['zalo', 'wechat', 'google meet', 'zoom', 'telegram', 'facebook', 'sđt', 'phone', 'email'];
    if (knownMethods.some(m => first.toLowerCase().includes(m))) {
      contactMethod = first;
      contactInfo = parts.slice(1).join(':').trim();
    }
  }

  const name = row.name || 'Học viên';
  const level = row.target_level || row.level || 'HSK 1';
  const goal = row.intro || row.goal || row.daily_time || 'Luyện phản xạ giao tiếp';
  const isOwner = Boolean(currentUserId && row.user_id && String(currentUserId) === String(row.user_id));

  return {
    id: String(row.id),
    userId: row.user_id || null,
    name,
    initial: name.charAt(0).toUpperCase(),
    level,
    targetLevel: level,
    goal,
    intro: goal,
    dailyTime: row.daily_time || '',
    skills: row.skills || 'Luyện khẩu ngữ',
    contactMethod,
    contactInfo,
    contact: row.contact || `${contactMethod}: ${contactInfo}`,
    qrImage: row.qr_image || row.qrImage || null,
    isActive: row.is_active !== false,
    isContactPublic: row.is_contact_public !== false,
    isMyPartnerPost: isOwner,
    createdAt: row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : 'Hôm nay'
  };
}

/**
 * Fetches study partners from Supabase with optional filtering
 */
export async function getStudyPartnersFromDb(options = {}) {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const {
      level = 'all',
      search = '',
      contactMethod = 'all',
      onlyActive = true,
      currentUserId = null,
      limit = 50
    } = options;

    let query = supabase
      .from('study_partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (onlyActive) {
      // In Supabase SQL: is_active = true OR is_active IS NULL
      query = query.or('is_active.eq.true,is_active.is.null');
    }

    if (limit && Number.isInteger(limit) && limit > 0) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    let partners = (data || []).map(row => normalizePartnerData(row, currentUserId));

    // In-memory normalization filters for client-side resilience
    if (level && level !== 'all') {
      partners = partners.filter(p => p.level.toLowerCase().startsWith(level.toLowerCase()));
    }

    if (contactMethod && contactMethod !== 'all') {
      partners = partners.filter(p => p.contactMethod.toLowerCase() === contactMethod.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      partners = partners.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.goal.toLowerCase().includes(q) ||
        p.skills.toLowerCase().includes(q) ||
        p.level.toLowerCase().includes(q)
      );
    }

    return partners;
  } catch (err) {
    console.warn('Could not fetch Supabase study partners:', err);
    return null;
  }
}

/**
 * Creates a new study partner profile in Supabase
 */
export async function addStudyPartnerToDb(partnerData) {
  if (!isSupabaseConfigured || !supabase) return null;

  const validation = validateStudyPartnerInput(partnerData);
  if (!validation.valid) {
    console.error('Validation error adding study partner:', validation.error);
    throw new Error(validation.error);
  }

  const { sanitized } = validation;

  try {
    let currentAuthUid = null;
    try {
      const authUser = await supabase.auth.getUser();
      currentAuthUid = authUser?.data?.user?.id || null;
    } catch {}

    const contactMethod = sanitized.contactMethod || 'Zalo';
    const rawContact = sanitized.contactInfo;
    const formattedContact = rawContact.startsWith(contactMethod)
      ? rawContact
      : `${contactMethod}: ${rawContact}`;

    const payload = {
      name: sanitized.name,
      target_level: sanitized.level,
      daily_time: sanitized.dailyTime || sanitized.goal,
      contact: formattedContact,
      intro: sanitized.goal,
      user_id: sanitized.userId || currentAuthUid,
      is_active: sanitized.isActive,
      is_contact_public: sanitized.isContactPublic,
      skills: sanitized.skills
    };

    if (sanitized.qrImage) {
      payload.qr_image = sanitized.qrImage;
    }

    let { data, error } = await supabase
      .from('study_partners')
      .insert([payload])
      .select('id')
      .single();

    // Fallback: If modern columns (qr_image, is_active, skills, is_contact_public) do not exist yet on legacy schema
    if (error && error.message) {
      const msg = error.message.toLowerCase();
      let hasRemovedField = false;

      if (msg.includes('qr_image')) {
        delete payload.qr_image;
        hasRemovedField = true;
      }
      if (msg.includes('is_active')) {
        delete payload.is_active;
        hasRemovedField = true;
      }
      if (msg.includes('is_contact_public')) {
        delete payload.is_contact_public;
        hasRemovedField = true;
      }
      if (msg.includes('skills')) {
        delete payload.skills;
        hasRemovedField = true;
      }

      if (hasRemovedField) {
        const retry = await supabase
          .from('study_partners')
          .insert([payload])
          .select('id')
          .single();
        data = retry.data;
        error = retry.error;
      }
    }

    if (error) throw error;
    return String(data?.id);
  } catch (err) {
    console.error('Could not create Supabase study partner:', err);
    return null;
  }
}

/**
 * Updates an existing study partner profile in Supabase
 */
export async function updateStudyPartnerInDb(partnerId, updateData) {
  if (!isSupabaseConfigured || !supabase || !partnerId) return false;

  const validation = validateStudyPartnerInput(updateData);
  if (!validation.valid) {
    console.error('Validation error updating study partner:', validation.error);
    throw new Error(validation.error);
  }

  const { sanitized } = validation;

  try {
    const contactMethod = sanitized.contactMethod || 'Zalo';
    const rawContact = sanitized.contactInfo;
    const formattedContact = rawContact.startsWith(contactMethod)
      ? rawContact
      : `${contactMethod}: ${rawContact}`;

    const payload = {
      name: sanitized.name,
      target_level: sanitized.level,
      daily_time: sanitized.dailyTime || sanitized.goal,
      contact: formattedContact,
      intro: sanitized.goal,
      is_active: sanitized.isActive,
      is_contact_public: sanitized.isContactPublic,
      skills: sanitized.skills
    };

    if (sanitized.qrImage !== undefined) {
      payload.qr_image = sanitized.qrImage;
    }

    let { error } = await supabase
      .from('study_partners')
      .update(payload)
      .eq('id', partnerId);

    // Fallback if modern columns are missing in legacy DB
    if (error && error.message) {
      const msg = error.message.toLowerCase();
      let hasRemovedField = false;

      if (msg.includes('qr_image')) {
        delete payload.qr_image;
        hasRemovedField = true;
      }
      if (msg.includes('is_active')) {
        delete payload.is_active;
        hasRemovedField = true;
      }
      if (msg.includes('is_contact_public')) {
        delete payload.is_contact_public;
        hasRemovedField = true;
      }
      if (msg.includes('skills')) {
        delete payload.skills;
        hasRemovedField = true;
      }

      if (hasRemovedField) {
        const retry = await supabase
          .from('study_partners')
          .update(payload)
          .eq('id', partnerId);
        error = retry.error;
      }
    }

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Could not update Supabase study partner:', err);
    return false;
  }
}

/**
 * Toggles study partner active status (pause vs resume)
 */
export async function toggleStudyPartnerStatusInDb(partnerId, isActive) {
  if (!isSupabaseConfigured || !supabase || !partnerId) return false;

  try {
    const { error } = await supabase
      .from('study_partners')
      .update({ is_active: Boolean(isActive) })
      .eq('id', partnerId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Could not toggle study partner active state:', err);
    return false;
  }
}

/**
 * Deletes a study partner from Supabase
 */
export async function deleteStudyPartnerFromDb(partnerId) {
  if (!isSupabaseConfigured || !supabase || !partnerId) return false;

  try {
    const { error } = await supabase
      .from('study_partners')
      .delete()
      .eq('id', partnerId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Could not delete Supabase study partner:', err);
    return false;
  }
}

// =========================================================================
// REALTIME SUBSCRIPTION (POSTS, COMMENTS, REACTIONS, PARTNERS)
// =========================================================================

/**
 * Subscribe to realtime community feed updates.
 * Dispatches POST_CHANGE, COMMENT_CHANGE, REACTION_CHANGE, and PARTNER_CHANGE events.
 */
export function subscribeToCommunityRealtime(onEvent) {
  if (!isSupabaseConfigured || !supabase || typeof onEvent !== 'function') {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('community_realtime_feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_posts' },
        (payload) => {
          onEvent({ type: 'POST_CHANGE', payload });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_comments' },
        (payload) => {
          onEvent({ type: 'COMMENT_CHANGE', payload });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_reactions' },
        (payload) => {
          onEvent({ type: 'REACTION_CHANGE', payload });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'study_partners' },
        (payload) => {
          onEvent({ type: 'PARTNER_CHANGE', payload });
        }
      )
      .subscribe((status, err) => {
        if (err) console.warn('Community Realtime status error:', err);
      });

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        console.warn('Error removing community realtime channel:', e);
      }
    };
  } catch (err) {
    console.warn('subscribeToCommunityRealtime init error:', err);
    return () => {};
  }
}

// =========================================================================
// COMMUNITY REPORTS & MODERATION (Phase 24 Task 24.08D)
// =========================================================================

export const REPORT_REASONS = [
  { id: 'spam', label: 'Spam hoặc quảng cáo trái phép' },
  { id: 'harassment', label: 'Nội dung xúc phạm, quấy rối hoặc công kích cá nhân' },
  { id: 'misinformation', label: 'Nội dung sai lệch hoặc gây hiểu lầm về kiến thức Hán ngữ' },
  { id: 'inappropriate', label: 'Nội dung không phù hợp với môi trường học tập' },
  { id: 'other', label: 'Lý do khác' }
];

export const REPORT_STATUSES = [
  { id: 'all', label: 'Tất cả trạng thái' },
  { id: 'pending', label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' },
  { id: 'reviewing', label: 'Đang xem xét', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300' },
  { id: 'resolved', label: 'Đã giải quyết', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' },
  { id: 'dismissed', label: 'Đã bác bỏ', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' }
];

/**
 * Validate community report parameters before network operations.
 *
 * @param {Object} params
 * @param {'post'|'comment'} params.targetType
 * @param {string|number} params.targetId
 * @param {string} params.reason
 * @param {string} [params.details]
 * @returns {{targetType: string, targetId: string, reason: string, details: string}}
 */
export function validateCommunityReportInput({ targetType, targetId, reason, details = '' }) {
  if (!targetType || !['post', 'comment'].includes(targetType)) {
    throw new Error('Loại đối tượng báo cáo không hợp lệ (phải là post hoặc comment).');
  }

  if (!targetId || !String(targetId).trim()) {
    throw new Error('Mã định danh đối tượng báo cáo không được để trống.');
  }

  const validReasonIds = REPORT_REASONS.map(r => r.id);
  if (!reason || !validReasonIds.includes(reason)) {
    throw new Error('Vui lòng chọn một lý do báo cáo hợp lệ.');
  }

  const cleanDetails = (details || '').trim();
  if (cleanDetails.length > 500) {
    throw new Error('Mô tả bổ sung không được vượt quá 500 ký tự.');
  }

  return {
    targetType,
    targetId: String(targetId).trim(),
    reason,
    details: cleanDetails
  };
}

/**
 * Submit a community content report (Student UI).
 * Requires authenticated user, validates target & reason, and blocks duplicate active reports.
 *
 * @param {Object} params
 * @param {'post'|'comment'} params.targetType
 * @param {string|number} params.targetId
 * @param {string} params.reason
 * @param {string} [params.details]
 * @returns {Promise<{success: boolean, duplicate?: boolean, message?: string, data?: any}>}
 */
export async function submitCommunityReport({ targetType, targetId, reason, details = '' }) {
  // 1. Client-side input validation
  const validated = validateCommunityReportInput({ targetType, targetId, reason, details });

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase chưa được cấu hình.');
  }

  const session = (await supabase.auth.getSession())?.data?.session;
  const currentUserId = session?.user?.id;
  if (!currentUserId) {
    throw new Error('Vui lòng đăng nhập để gửi báo cáo vi phạm.');
  }

  const cleanTargetId = validated.targetId;
  const cleanDetails = validated.details;

  // 1. Check for active duplicate report by the same user on this target
  try {
    const { data: existingReports } = await supabase
      .from('community_reports')
      .select('id, status')
      .eq('reporter_id', currentUserId)
      .eq('target_type', targetType)
      .eq('target_id', cleanTargetId)
      .in('status', ['pending', 'reviewing'])
      .limit(1);

    if (existingReports && existingReports.length > 0) {
      return {
        success: false,
        duplicate: true,
        message: 'Bạn đã gửi báo cáo cho nội dung này rồi. Ban Quản Trị đang tiến hành xem xét và xử lý.'
      };
    }
  } catch (dupErr) {
    console.warn('Duplicate check warning:', dupErr);
  }

  // 2. Prepare payload
  const payload = {
    reporter_id: currentUserId,
    post_id: targetType === 'post' ? Number(cleanTargetId) : null,
    comment_id: targetType === 'comment' ? cleanTargetId : null,
    target_type: targetType,
    target_id: cleanTargetId,
    reason: reason,
    details: cleanDetails || null,
    status: 'pending'
  };

  try {
    let { data, error } = await supabase
      .from('community_reports')
      .insert([payload])
      .select()
      .single();

    // Fallback if older schema does not have 'misinformation' in CHECK constraint
    if (error && (error.message?.includes('chk_community_reports_reason') || error.message?.includes('reason'))) {
      payload.reason = 'inappropriate';
      payload.details = cleanDetails ? `[Sai lệch thông tin] ${cleanDetails}` : '[Sai lệch thông tin]';
      const retry = await supabase
        .from('community_reports')
        .insert([payload])
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      if (error.code === '23505' || error.message?.includes('duplicate key')) {
        return {
          success: false,
          duplicate: true,
          message: 'Bạn đã gửi báo cáo cho nội dung này rồi. Ban Quản Trị đang xử lý.'
        };
      }
      throw error;
    }

    return {
      success: true,
      data,
      message: 'Cảm ơn bạn đã báo cáo. Ban Quản Trị sẽ xem xét và xử lý vi phạm trong thời gian sớm nhất.'
    };
  } catch (err) {
    console.error('Error submitting community report:', err);
    throw err;
  }
}

/**
 * Fetch paginated community reports for Admin Dashboard.
 *
 * @param {Object} options
 * @param {string} [options.status='all']
 * @param {string} [options.targetType='all']
 * @param {string} [options.reason='all']
 * @param {string} [options.search='']
 * @param {number} [options.page=1]
 * @param {number} [options.pageSize=10]
 * @returns {Promise<{reports: Array, totalCount: number, page: number, totalPages: number}>}
 */
export async function getCommunityReports(options = {}) {
  if (!isSupabaseConfigured || !supabase) {
    return { reports: [], totalCount: 0, page: 1, totalPages: 1 };
  }

  const {
    status = 'all',
    targetType = 'all',
    reason = 'all',
    search = '',
    page = 1,
    pageSize = 10
  } = options;

  try {
    let query = supabase
      .from('community_reports')
      .select(`
        id,
        reporter_id,
        post_id,
        comment_id,
        target_type,
        target_id,
        reason,
        details,
        status,
        resolved_by,
        resolved_at,
        created_at,
        reporter:reporter_id (
          id,
          name,
          avatar,
          email,
          role
        ),
        resolver:resolved_by (
          id,
          name,
          avatar
        )
      `, { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (targetType && targetType !== 'all') {
      query = query.eq('target_type', targetType);
    }

    if (reason && reason !== 'all') {
      query = query.eq('reason', reason);
    }

    if (search && search.trim()) {
      query = query.ilike('details', `%${search.trim()}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    const totalCount = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      reports: data || [],
      totalCount,
      page,
      totalPages
    };
  } catch (err) {
    console.error('getCommunityReports error:', err);
    return { reports: [], totalCount: 0, page: 1, totalPages: 1 };
  }
}

/**
 * Fetch detailed report information including target content and moderation history.
 *
 * @param {string} reportId
 * @returns {Promise<{report: Object|null, targetItem: Object|null, isTargetDeleted: boolean, moderationLogs: Array}>}
 */
export async function getCommunityReportDetails(reportId) {
  if (!isSupabaseConfigured || !supabase || !reportId) {
    return { report: null, targetItem: null, isTargetDeleted: false, moderationLogs: [] };
  }

  try {
    // 1. Fetch Report
    const { data: report, error: repError } = await supabase
      .from('community_reports')
      .select(`
        id,
        reporter_id,
        post_id,
        comment_id,
        target_type,
        target_id,
        reason,
        details,
        status,
        resolved_by,
        resolved_at,
        created_at,
        reporter:reporter_id (
          id,
          name,
          avatar,
          email,
          role
        ),
        resolver:resolved_by (
          id,
          name,
          avatar
        )
      `)
      .eq('id', reportId)
      .single();

    if (repError || !report) return { report: null, targetItem: null, isTargetDeleted: false, moderationLogs: [] };

    let targetItem = null;
    let isTargetDeleted = false;

    // 2. Fetch Target Item (Even if hidden/deleted)
    if (report.target_type === 'post') {
      const postId = report.post_id || Number(report.target_id);
      if (postId) {
        const { data: postData } = await supabase
          .from('community_posts')
          .select('id, author_id, author_name, author_avatar, content, tag, image_url, likes_count, comments_count, status, deleted_at, created_at')
          .eq('id', postId)
          .single();
        if (postData) {
          targetItem = postData;
          isTargetDeleted = Boolean(postData.deleted_at);
        } else {
          isTargetDeleted = true;
        }
      }
    } else if (report.target_type === 'comment') {
      const commentId = report.comment_id || report.target_id;
      if (commentId) {
        const { data: commentData } = await supabase
          .from('community_comments')
          .select(`
            id,
            post_id,
            author_id,
            content,
            status,
            deleted_at,
            created_at,
            profiles:author_id (
              id,
              name,
              avatar,
              role
            )
          `)
          .eq('id', commentId)
          .single();
        if (commentData) {
          targetItem = commentData;
          isTargetDeleted = Boolean(commentData.deleted_at);
        } else {
          isTargetDeleted = true;
        }
      }
    }

    // 3. Fetch Moderation Logs for this target
    let moderationLogs = [];
    try {
      const { data: logs } = await supabase
        .from('community_moderation_logs')
        .select(`
          id,
          admin_id,
          target_type,
          target_id,
          action,
          reason,
          created_at,
          admin:admin_id (
            id,
            name,
            avatar,
            email
          )
        `)
        .eq('target_id', report.target_id)
        .order('created_at', { ascending: false });
      moderationLogs = logs || [];
    } catch (logErr) {
      console.warn('Error fetching moderation logs:', logErr);
    }

    return {
      report,
      targetItem,
      isTargetDeleted,
      moderationLogs
    };
  } catch (err) {
    console.error('getCommunityReportDetails error:', err);
    return { report: null, targetItem: null, isTargetDeleted: false, moderationLogs: [] };
  }
}

/**
 * Execute an atomic moderation action via Supabase RPC or direct admin query.
 *
 * @param {Object} params
 * @param {'hide'|'restore'|'delete'|'review_report'|'resolve_report'|'dismiss_report'|'pin'|'unpin'} params.action
 * @param {'post'|'comment'|'report'} params.targetType
 * @param {string|number} params.targetId
 * @param {string} [params.reason]
 * @param {string} [params.reportId]
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function moderateCommunityContent({ action, targetType, targetId, reason = '', reportId = null }) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase chưa được cấu hình.');
  }

  const session = (await supabase.auth.getSession())?.data?.session;
  const currentUserId = session?.user?.id;
  if (!currentUserId) {
    throw new Error('Yêu cầu quyền Quản trị viên để thực hiện thao tác kiểm duyệt.');
  }

  const cleanTargetId = String(targetId).trim();
  const cleanReason = (reason || '').trim();

  // Try executing via Atomic RPC first
  try {
    const { data, error } = await supabase.rpc('moderate_community_content', {
      p_action: action,
      p_target_type: targetType,
      p_target_id: cleanTargetId,
      p_reason: cleanReason || null,
      p_report_id: reportId || null
    });

    if (!error && data?.success) {
      return { success: true, message: 'Thao tác kiểm duyệt đã được thực hiện thành công.' };
    }

    if (error && !error.message?.includes('function public.moderate_community_content') && !error.message?.includes('schema cache')) {
      throw error;
    }
  } catch (rpcErr) {
    // If permission denied error, propagate immediately
    if (rpcErr.message?.includes('Quyền hạn bị từ chối') || rpcErr.code === '42501') {
      throw rpcErr;
    }
    console.warn('RPC moderate_community_content failed, falling back to direct admin execution:', rpcErr);
  }

  // Fallback: Direct RLS-backed Admin operations
  try {
    if (action === 'hide') {
      if (targetType === 'post') {
        await supabase.from('community_posts').update({ status: 'hidden', updated_at: new Date().toISOString() }).eq('id', cleanTargetId);
      } else if (targetType === 'comment') {
        await supabase.from('community_comments').update({ status: 'hidden', updated_at: new Date().toISOString() }).eq('id', cleanTargetId);
      }
      if (reportId) {
        await supabase.from('community_reports').update({ status: 'resolved', resolved_by: currentUserId, resolved_at: new Date().toISOString() }).eq('id', reportId);
      }
    } else if (action === 'restore') {
      if (targetType === 'post') {
        await supabase.from('community_posts').update({ status: 'published', updated_at: new Date().toISOString() }).eq('id', cleanTargetId);
      } else if (targetType === 'comment') {
        await supabase.from('community_comments').update({ status: 'published', updated_at: new Date().toISOString() }).eq('id', cleanTargetId);
      }
    } else if (action === 'delete') {
      if (targetType === 'post') {
        await supabase.from('community_posts').update({ deleted_at: new Date().toISOString(), status: 'hidden' }).eq('id', cleanTargetId);
      } else if (targetType === 'comment') {
        await supabase.from('community_comments').update({ deleted_at: new Date().toISOString(), status: 'hidden' }).eq('id', cleanTargetId);
      }
      if (reportId) {
        await supabase.from('community_reports').update({ status: 'resolved', resolved_by: currentUserId, resolved_at: new Date().toISOString() }).eq('id', reportId);
      }
    } else if (action === 'review_report') {
      await supabase.from('community_reports').update({ status: 'reviewing', resolved_by: currentUserId }).eq('id', cleanTargetId);
    } else if (action === 'resolve_report') {
      await supabase.from('community_reports').update({ status: 'resolved', resolved_by: currentUserId, resolved_at: new Date().toISOString() }).eq('id', cleanTargetId);
    } else if (action === 'dismiss_report') {
      await supabase.from('community_reports').update({ status: 'dismissed', resolved_by: currentUserId, resolved_at: new Date().toISOString() }).eq('id', cleanTargetId);
    }

    // Insert into moderation logs
    await supabase.from('community_moderation_logs').insert([{
      admin_id: currentUserId,
      target_type: targetType,
      target_id: cleanTargetId,
      action: action,
      reason: cleanReason || null,
      created_at: new Date().toISOString()
    }]);

    return { success: true, message: 'Thao tác kiểm duyệt đã được thực hiện thành công.' };
  } catch (directErr) {
    console.error('Direct moderation error:', directErr);
    throw directErr;
  }
}

/**
 * Fetch moderation logs for audit display in Admin Dashboard.
 *
 * @param {Object} options
 * @param {string} [options.targetId]
 * @param {number} [options.page=1]
 * @param {number} [options.pageSize=20]
 * @returns {Promise<{logs: Array, totalCount: number, page: number, totalPages: number}>}
 */
export async function getCommunityModerationLogs(options = {}) {
  if (!isSupabaseConfigured || !supabase) {
    return { logs: [], totalCount: 0, page: 1, totalPages: 1 };
  }

  const { targetId = null, page = 1, pageSize = 20 } = options;

  try {
    let query = supabase
      .from('community_moderation_logs')
      .select(`
        id,
        admin_id,
        target_type,
        target_id,
        action,
        reason,
        created_at,
        admin:admin_id (
          id,
          name,
          avatar,
          email
        )
      `, { count: 'exact' });

    if (targetId) {
      query = query.eq('target_id', String(targetId));
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      logs: data || [],
      totalCount: count || 0,
      page,
      totalPages: Math.max(1, Math.ceil((count || 0) / pageSize))
    };
  } catch (err) {
    console.error('getCommunityModerationLogs error:', err);
    return { logs: [], totalCount: 0, page: 1, totalPages: 1 };
  }
}
