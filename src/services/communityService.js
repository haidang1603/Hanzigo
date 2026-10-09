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
        image: row.image_url || row.image || null,
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
    const payload = {
      author_name: postData.author || postData.authorName || 'Học viên HanziGo',
      author_avatar: postData.avatar || null,
      author_level: postData.level || 'HSK 1',
      content: postData.content,
      tag: postData.tag || '',
      likes: postData.likes || 0,
      liked_by: postData.likedBy || [],
      comments: postData.comments || []
    };

    if (postData.image) {
      payload.image_url = postData.image;
    }

    let { data, error } = await supabase
      .from('community_posts')
      .insert([payload])
      .select('id')
      .single();

    if (error && error.message && error.message.includes('image_url')) {
      delete payload.image_url;
      const retry = await supabase
        .from('community_posts')
        .insert([payload])
        .select('id')
        .single();
      data = retry.data;
      error = retry.error;
    }

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

    return (data || []).map(row => {
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

      return {
        id: row.id,
        name,
        initial: name.charAt(0).toUpperCase(),
        level,
        targetLevel: level,
        goal,
        intro: goal,
        dailyTime: row.daily_time || '',
        contactMethod,
        contactInfo,
        qrImage: row.qr_image || row.qrImage || null,
        contact: row.contact || `${contactMethod}: ${contactInfo}`,
        createdAt: row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : 'Hôm nay'
      };
    });
  } catch (err) {
    console.warn('Could not fetch Supabase study partners:', err);
    return null;
  }
}

export async function addStudyPartnerToDb(partnerData) {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const contactMethod = partnerData.contactMethod || 'Zalo';
    const rawContact = partnerData.contactInfo || partnerData.contact || '';
    const formattedContact = rawContact.startsWith(contactMethod)
      ? rawContact
      : `${contactMethod}: ${rawContact}`;

    const goal = partnerData.goal || partnerData.intro || 'Luyện phản xạ giao tiếp';
    const level = partnerData.level || partnerData.targetLevel || 'HSK 1';

    const payload = {
      name: partnerData.name,
      target_level: level,
      daily_time: partnerData.dailyTime || goal,
      contact: formattedContact,
      intro: goal
    };

    if (partnerData.qrImage) {
      payload.qr_image = partnerData.qrImage;
    }

    let { data, error } = await supabase
      .from('study_partners')
      .insert([payload])
      .select('id')
      .single();

    if (error && error.message && error.message.includes('qr_image')) {
      delete payload.qr_image;
      const retry = await supabase
        .from('study_partners')
        .insert([payload])
        .select('id')
        .single();
      data = retry.data;
      error = retry.error;
    }

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

/**
 * Subscribe to realtime community feed updates (posts & study partners)
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

