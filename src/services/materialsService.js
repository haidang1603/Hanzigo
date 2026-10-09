import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { getStoredMaterials } from '../utils/materialsStorage.js';

export async function getMaterialsFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(m => {
      const skillsArray = m.skills
        ? (Array.isArray(m.skills) ? m.skills : String(m.skills).split(',').map(s => s.trim()).filter(Boolean))
        : ['Tổng hợp đa kỹ năng'];
      
      const tagsArray = m.tags
        ? (Array.isArray(m.tags) ? m.tags : String(m.tags).split(',').map(t => t.trim()).filter(Boolean))
        : [];

      return {
        id: m.id,
        title: m.title,
        category: m.category || 'Giáo trình chuẩn',
        level: m.level || 'HSK 1',
        skills: skillsArray,
        format: m.format || 'PDF',
        fileSize: m.file_size || 'Tài liệu số',
        author: m.author || m.publisher || 'HanziGo Biên soạn',
        publisher: m.publisher || m.author || 'HanziGo Academic',
        description: m.description || '',
        downloadUrl: m.download_url || '',
        sourceUrl: m.source_url || m.download_url || '',
        language: m.language || 'Song ngữ Trung - Việt',
        license: m.license || 'Tài liệu giáo dục công cộng',
        verificationStatus: m.verification_status || 'verified',
        relatedLessonId: m.related_lesson_id || null,
        verificationNotes: m.verification_notes || '',
        tags: tagsArray,
        isFeatured: Boolean(m.is_featured),
        isHidden: Boolean(m.is_hidden),
        downloadsCount: Number(m.downloads_count) || 0,
        createdAt: m.created_at ? m.created_at.split('T')[0] : '2026-01-01'
      };
    });
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
      skills: Array.isArray(mat.skills) ? mat.skills.join(', ') : (mat.skills || 'Tổng hợp đa kỹ năng'),
      format: mat.format || 'PDF',
      file_size: mat.fileSize || '10 MB',
      author: mat.author || mat.publisher || 'HanziGo Biên soạn',
      publisher: mat.publisher || mat.author || 'HanziGo Academic',
      description: mat.description || '',
      download_url: mat.downloadUrl || mat.sourceUrl || '',
      source_url: mat.sourceUrl || mat.downloadUrl || '',
      language: mat.language || 'Song ngữ Trung - Việt',
      license: mat.license || 'Tài liệu giáo dục công cộng',
      verification_status: mat.verificationStatus || 'verified',
      related_lesson_id: mat.relatedLessonId || null,
      verification_notes: mat.verificationNotes || '',
      tags: Array.isArray(mat.tags) ? mat.tags.join(', ') : (mat.tags || ''),
      is_featured: Boolean(mat.isFeatured),
      is_hidden: Boolean(mat.isHidden),
      downloads_count: mat.downloadsCount || 0
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
      skills: Array.isArray(matData.skills) ? matData.skills.join(', ') : (matData.skills || 'Tổng hợp đa kỹ năng'),
      format: matData.format || 'PDF',
      file_size: matData.fileSize || '10 MB',
      author: matData.author || matData.publisher || 'HanziGo Biên soạn',
      publisher: matData.publisher || matData.author || 'HanziGo Academic',
      description: matData.description || '',
      download_url: matData.downloadUrl || matData.sourceUrl || '',
      source_url: matData.sourceUrl || matData.downloadUrl || '',
      language: matData.language || 'Song ngữ Trung - Việt',
      license: matData.license || 'Tài liệu giáo dục công cộng',
      verification_status: matData.verificationStatus || 'verified',
      related_lesson_id: matData.relatedLessonId || null,
      verification_notes: matData.verificationNotes || '',
      tags: Array.isArray(matData.tags) ? matData.tags.join(', ') : (matData.tags || ''),
      is_featured: Boolean(matData.isFeatured),
      is_hidden: Boolean(matData.isHidden)
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

export async function getMaterialsForLesson(lessonId) {
  if (!lessonId) return [];
  const dbItems = await getMaterialsFromDb();
  const all = (dbItems && dbItems.length > 0) ? dbItems : getStoredMaterials();
  if (!all) return [];
  return all.filter(m => m.relatedLessonId && m.relatedLessonId.toLowerCase().includes(String(lessonId).toLowerCase()));
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
