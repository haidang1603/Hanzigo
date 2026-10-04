import { supabase, isSupabaseConfigured } from '../supabase/config.js';

export async function getCommunityPosts() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => {
      const isBqt = (row.author_name || '').includes('Ban Quản Trị') || (row.author_level === 'Quản trị viên');
      const avatarUrl = isBqt || (row.author_avatar && row.author_avatar.includes('photo-1534528741775-53994a69daeb'))
        ? '/hanzigo-logo.svg'
        : (row.author_avatar || null);

      return {
        id: row.id,
        author: row.author_name || 'Học viên HanziGo',
        avatar: avatarUrl,
        level: row.author_level || 'HSK 1',
        content: row.content,
        tag: row.tag || '',
        likes: row.likes || 0,
        likedBy: row.liked_by || [],
        comments: row.comments || [],
        time: row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : 'Vừa xong'
      };
    });
  } catch (err) {
    console.warn('Could not fetch Supabase community posts:', err);
    return null;
  }
}

export async function addCommunityPost(postData) {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([{
        author_name: postData.author || postData.authorName || 'Học viên HanziGo',
        author_avatar: postData.avatar || null,
        author_level: postData.level || 'HSK 1',
        content: postData.content,
        tag: postData.tag || '',
        likes: postData.likes || 0,
        liked_by: postData.likedBy || [],
        comments: postData.comments || []
      }])
      .select('id')
      .single();

    if (error) throw error;
    return data?.id;
  } catch (err) {
    console.error('Could not create Supabase post:', err);
    return null;
  }
}

export async function updateCommunityPost(postId, updateData) {
  if (!isSupabaseConfigured || !supabase || !postId) return false;

  try {
    const payload = {};
    if (updateData.likes !== undefined) payload.likes = updateData.likes;
    if (updateData.likedBy !== undefined) payload.liked_by = updateData.likedBy;
    if (updateData.comments !== undefined) payload.comments = updateData.comments;
    if (updateData.content !== undefined) payload.content = updateData.content;

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

export async function getStudyPartnersFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('study_partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      targetLevel: row.target_level || '',
      dailyTime: row.daily_time || '',
      contact: row.contact || '',
      intro: row.intro || '',
      time: row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : 'Vừa xong'
    }));
  } catch (err) {
    console.warn('Could not fetch Supabase study partners:', err);
    return null;
  }
}

export async function addStudyPartnerToDb(partnerData) {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('study_partners')
      .insert([{
        name: partnerData.name,
        target_level: partnerData.targetLevel || partnerData.level || '',
        daily_time: partnerData.dailyTime || '',
        contact: partnerData.contact || '',
        intro: partnerData.intro || ''
      }])
      .select('id')
      .single();

    if (error) throw error;
    return data?.id;
  } catch (err) {
    console.error('Could not create Supabase study partner:', err);
    return null;
  }
}

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
