import { supabase, isSupabaseConfigured } from '../supabase/config.js';

export async function getMaterialsFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(m => ({
      id: m.id,
      title: m.title,
      category: m.category,
      level: m.level,
      format: m.format,
      fileSize: m.file_size,
      author: m.author,
      description: m.description,
      downloadUrl: m.download_url,
      tags: m.tags ? m.tags.split(',').map(t => t.trim()) : []
    }));
  } catch (err) {
    console.warn('Supabase getMaterials notice:', err);
    return null;
  }
}

export async function addMaterialToDb(mat) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const payload = {
      id: mat.id || `mat-${Date.now()}`,
      title: mat.title,
      category: mat.category || 'Giáo trình chuẩn',
      level: mat.level || 'HSK 1',
      format: mat.format || 'PDF',
      file_size: mat.fileSize || '10 MB',
      author: mat.author || 'HanziGo Biên soạn',
      description: mat.description || '',
      download_url: mat.downloadUrl || '',
      tags: Array.isArray(mat.tags) ? mat.tags.join(', ') : (mat.tags || '')
    };
    const { data, error } = await supabase
      .from('materials')
      .upsert([payload])
      .select('id')
      .single();
    if (error) throw error;
    return data?.id;
  } catch (err) {
    console.warn('Supabase addMaterial error:', err);
    return null;
  }
}

export async function updateMaterialInDb(matId, matData) {
  if (!isSupabaseConfigured || !supabase || !matId) return false;
  try {
    const payload = {
      title: matData.title,
      category: matData.category || 'Giáo trình chuẩn',
      level: matData.level || 'HSK 1',
      format: matData.format || 'PDF',
      file_size: matData.fileSize || '10 MB',
      author: matData.author || 'HanziGo Biên soạn',
      description: matData.description || '',
      download_url: matData.downloadUrl || '',
      tags: Array.isArray(matData.tags) ? matData.tags.join(', ') : (matData.tags || '')
    };
    const { error } = await supabase
      .from('materials')
      .update(payload)
      .eq('id', String(matId));
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase updateMaterial error:', err);
    return false;
  }
}

export async function deleteMaterialFromDb(matId) {
  if (!isSupabaseConfigured || !supabase || !matId) return false;
  try {
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', String(matId));
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase deleteMaterial error:', err);
    return false;
  }
}

export async function getLessonsFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('number', { ascending: true });
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase getLessons notice:', err);
    return null;
  }
}

export async function addLessonToDb(lesson) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('lessons')
      .upsert([lesson])
      .select('id')
      .single();
    if (error) throw error;
    return data?.id;
  } catch (err) {
    console.warn('Supabase addLesson error:', err);
    return null;
  }
}
