import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { isValidUuid } from './authService.js';

/**
 * Admin: Fetch all registered user profiles
 */
export async function getAllProfilesFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase getAllProfiles notice:', err);
    return null;
  }
}

/**
 * Admin: Update user role and status
 */
export async function updateUserRoleAndStatusInDb(userId, updates) {
  if (!isSupabaseConfigured || !supabase || !isValidUuid(userId)) return false;

  try {
    // Try calling admin RPC if available
    const { error: rpcError } = await supabase.rpc('admin_update_user_status', {
      target_user_id: userId,
      new_role: updates.role || null,
      new_status: updates.status || null
    });

    if (!rpcError) return true;

    // Fallback direct update (guarded by DB trigger & RLS)
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase updateUserRoleAndStatus error:', err);
    return false;
  }
}

/**
 * Admin: Delete user profile
 */
export async function deleteUserProfileFromDb(userId) {
  if (!isSupabaseConfigured || !supabase || !isValidUuid(userId)) return false;

  try {
    // Try server-side RPC for clean cascading deletion
    const { error: rpcError } = await supabase.rpc('admin_delete_user', {
      target_user_id: userId
    });

    if (!rpcError) return true;

    // Fallback direct delete guarded by RLS
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase deleteUserProfile error:', err);
    return false;
  }
}
