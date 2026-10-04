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
    // Strictly call secure admin stored procedure (enforces is_admin() on PostgreSQL)
    const { error: rpcError } = await supabase.rpc('admin_update_user_status', {
      target_user_id: userId,
      new_role: updates.role || null,
      new_status: updates.status || null
    });

    if (rpcError) {
      console.error('Supabase admin_update_user_status RPC failed:', rpcError.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Supabase updateUserRoleAndStatus error:', err);
    return false;
  }
}

/**
 * Admin: Delete user profile
 */
export async function deleteUserProfileFromDb(userId) {
  if (!isSupabaseConfigured || !supabase || !isValidUuid(userId)) return false;

  try {
    // Strictly call secure admin stored procedure for cascading deletion
    const { error: rpcError } = await supabase.rpc('admin_delete_user', {
      target_user_id: userId
    });

    if (rpcError) {
      console.error('Supabase admin_delete_user RPC failed:', rpcError.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Supabase deleteUserProfile error:', err);
    return false;
  }
}
