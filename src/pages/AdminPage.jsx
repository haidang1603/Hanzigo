import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  X, 
  ExternalLink, 
  Download, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  Upload, 
  ShieldCheck, 
  ArrowRight,
  Users,
  UserCheck,
  Lock,
  Unlock,
  Shield,
  Star,
  Eye,
  EyeOff,
  Crown,
  Activity,
  Check,
  Cpu,
  BarChart3,
  Filter,
  Sparkles,
  AlertTriangle,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Key,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import AiMonitoringDashboard from '../components/admin/AiMonitoringDashboard';
import CommunityModerationDashboard from '../components/admin/CommunityModerationDashboard';
import { 
  MATERIAL_CATEGORIES,
  MATERIAL_LEVELS,
  MATERIAL_FORMATS
} from '../utils/materialsStorage';
import {
  getCustomVocabularyFromDb,
  addCustomVocabularyToDb,
  updateCustomVocabularyInDb,
  deleteCustomVocabularyFromDb,
  checkVocabularyDuplicate,
  migrateLocalStorageCustomVocab
} from '../services/customVocabularyService';
import {
  getCustomLessonsFromDb,
  addCustomLessonToDb,
  updateCustomLessonInDb,
  deleteCustomLessonFromDb,
  checkLessonDuplicate,
  migrateLocalStorageCustomLessons
} from '../services/customLessonService';
import { 
  getAllProfilesFromDb, 
  updateUserRoleAndStatusInDb, 
  deleteUserProfileFromDb,
  updateUserProfile,
  adminCreateUser
} from '../supabase/services';
import {
  getMaterialsFromDb,
  addMaterialToDb,
  updateMaterialInDb,
  deleteMaterialFromDb
} from '../services/materialsService';
import { playClickSound, playSuccessSound, playErrorSound, speakChinese } from '../utils/audio';

function checkIsAdmin(user) {
  if (!user) return false;
  return (user.role === 'admin' || user.isAdmin === true) && user.status !== 'blocked';
}

export default function AdminPage({ user, onUpdateUser, setActiveTab }) {
  // Current active admin sub-tab: 'overview' | 'users' | 'materials' | 'vocab' | 'lessons' | 'ai_metrics' | 'backup'
  const [adminTab, setAdminTab] = useState('overview');

  // Verify Admin role
  const isAdmin = checkIsAdmin(user);
  const currentRole = isAdmin ? 'admin' : (user?.role || 'student');

  // 1. Users Directory State
  const [usersList, setUsersList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [fetchUsersError, setFetchUsersError] = useState(null);

  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [userSortBy, setUserSortBy] = useState('xp');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reset pagination when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [userSearch, userRoleFilter, userStatusFilter, userSortBy]);

  // User Modals State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    level: 'HSK 1 - Sơ cấp',
    status: 'active',
    xp: 0,
    streak: 0
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createUserError, setCreateUserError] = useState('');
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);

  // Admin Profile Name Editing State
  const [isEditingAdminName, setIsEditingAdminName] = useState(false);
  const [adminNameInput, setAdminNameInput] = useState(user?.name || 'Quản trị viên');
  const [isSavingAdminName, setIsSavingAdminName] = useState(false);

  useEffect(() => {
    if (!isEditingAdminName && user?.name) {
      setAdminNameInput(user.name);
    }
  }, [user?.name, isEditingAdminName]);

  // 2. Materials State (Authoritative source: Supabase)
  const [materials, setMaterials] = useState([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [materialsError, setMaterialsError] = useState(null);
  const [matSearch, setMatSearch] = useState('');
  const [matCategoryFilter, setMatCategoryFilter] = useState('Tất cả');
  const [matLevelFilter, setMatLevelFilter] = useState('Tất cả');
  const [isMatFormOpen, setIsMatFormOpen] = useState(false);
  const [editingMatId, setEditingMatId] = useState(null);
  const [matForm, setMatForm] = useState({
    title: '',
    category: 'Giáo trình chuẩn',
    level: 'HSK 1',
    format: 'PDF',
    fileSize: '10 MB',
    author: 'HanziGo Biên soạn',
    publisher: 'BLCU Press / CTI',
    sourceUrl: '',
    skills: 'Từ vựng, Ngữ pháp',
    language: 'Song ngữ Trung - Việt',
    license: 'Bản quyền Giáo trình (Trích dẫn học thuật)',
    verificationStatus: 'verified_official',
    relatedLessonId: 'Module 1.1',
    verificationNotes: '',
    description: '',
    downloadUrl: '',
    tags: '',
    isFeatured: false,
    isHidden: false
  });

  // 3. Custom Vocab State (Supabase Authoritative DB)
  const [customVocab, setCustomVocab] = useState([]);
  const [isLoadingVocab, setIsLoadingVocab] = useState(false);
  const [vocabError, setVocabError] = useState(null);
  const [editingVocabId, setEditingVocabId] = useState(null);
  const [isSavingVocab, setIsSavingVocab] = useState(false);
  const [vocabSearch, setVocabSearch] = useState('');
  const [vocabHskFilter, setVocabHskFilter] = useState('all');
  const [vocabFormOpen, setVocabFormOpen] = useState(false);
  const [vocabForm, setVocabForm] = useState({
    hanzi: '',
    pinyin: '',
    hanviet: '',
    meaning: '',
    hsk: 'hsk1',
    topic: 'Giao tiếp hàng ngày',
    example: '',
    examplePinyin: '',
    exampleMeaning: '',
    memoryTip: ''
  });

  // 4. Custom Lesson State (Supabase Authoritative DB)
  const [customLessons, setCustomLessons] = useState([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [lessonsError, setLessonsError] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [lessonSearch, setLessonSearch] = useState('');
  const [lessonLevelFilter, setLessonLevelFilter] = useState('all');
  const [lessonFormOpen, setLessonFormOpen] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    level: 'HSK 1',
    duration: '20',
    xp: '50',
    description: '',
    grammarPoints: ''
  });

  // Toast Notification
  const [toastMsg, setToastMsg] = useState(null);

  // Fetch users directly from Supabase
  const loadCloudProfiles = async () => {
    setIsLoadingUsers(true);
    setFetchUsersError(null);
    try {
      const cloudProfiles = await getAllProfilesFromDb();
      if (Array.isArray(cloudProfiles)) {
        const mapped = cloudProfiles.map(cp => ({
          id: cp.id,
          name: cp.name || cp.full_name || 'Học viên',
          email: cp.email || '',
          role: cp.role || 'student',
          level: cp.level || 'HSK 1 - Sơ cấp',
          xp: typeof cp.xp === 'number' ? cp.xp : 0,
          streak: typeof cp.streak === 'number' ? cp.streak : 0,
          wordsLearned: cp.words_learned || 0,
          status: cp.status || 'active',
          avatar: cp.avatar || cp.avatar_url || null,
          joinedDate: cp.created_at ? cp.created_at.split('T')[0] : '2026-01-01',
          lastActive: 'Gần đây'
        }));
        setUsersList(mapped);
      } else {
        setUsersList([]);
      }
    } catch (err) {
      console.warn('Notice loading Supabase profiles:', err);
      setFetchUsersError(err.message || 'Không thể tải danh sách người dùng từ máy chủ.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Sync users from Supabase on mount
  useEffect(() => {
    loadCloudProfiles();
  }, []);

  const saveUsersList = (newList) => {
    setUsersList(newList);
  };

  const showToast = (message, type = 'success') => {
    setToastMsg({ message, type });
    if (type === 'success') playSuccessSound();
    else playErrorSound();
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Save Admin Name
  const handleSaveAdminName = async (e) => {
    if (e) e.preventDefault();
    const newName = adminNameInput.trim();
    if (!newName) {
      alert('Vui lòng nhập tên quản trị viên!');
      return;
    }
    setIsSavingAdminName(true);
    const updatedUser = { ...(user || {}), name: newName };

    try {
      localStorage.setItem('hanzigo_user', JSON.stringify(updatedUser));
    } catch {}

    const uid = user?.uid || user?.id;
    if (uid) {
      try {
        await updateUserProfile(uid, { name: newName });
      } catch {}
    }

    if (onUpdateUser) onUpdateUser(updatedUser);

    setUsersList(prev => prev.map(u => 
      (u.id === uid || u.email === user?.email) ? { ...u, name: newName } : u
    ));

    setIsSavingAdminName(false);
    setIsEditingAdminName(false);
    showToast(`Đã đổi tên quản trị viên thành: "${newName}"!`);
  };

  // Generate strong random password
  const handleGenerateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let pwd = '';
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUserForm(prev => ({ ...prev, password: pwd }));
    setShowNewUserPassword(true);
  };

  // User Actions
  const handleChangeUserRole = async (targetUser, newRole) => {
    const isSelf = user && (user.id === targetUser.id || user.email === targetUser.email || user.uid === targetUser.id);
    if (isSelf) {
      alert('Quản trị viên không thể tự thay đổi vai trò của chính mình!');
      return;
    }

    if (newRole === 'admin') {
      const confirmAdmin = window.confirm(
        `CẢNH BÁO: Cấp quyền Quản trị viên (Admin) cho "${targetUser.name}" (${targetUser.email}) sẽ trao toàn bộ quyền kiểm soát hệ thống cho tài khoản này. Bạn có chắc chắn muốn tiếp tục?`
      );
      if (!confirmAdmin) return;
    }

    playClickSound();
    const oldUsers = [...usersList];
    setUsersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, role: newRole } : u));

    const ok = await updateUserRoleAndStatusInDb(targetUser.id, { role: newRole });
    if (!ok) {
      setUsersList(oldUsers);
      showToast('Cập nhật quyền thất bại trên máy chủ.', 'error');
      return;
    }

    if (user && (user.id === targetUser.id || user.email === targetUser.email)) {
      if (onUpdateUser) onUpdateUser({ ...user, role: newRole });
    }
    showToast(`Đã đổi quyền cho ${targetUser.name} thành ${newRole.toUpperCase()}!`);
  };

  const handleToggleUserStatus = async (targetUser) => {
    const isSelf = user && (user.id === targetUser.id || user.email === targetUser.email || user.uid === targetUser.id);
    if (isSelf) {
      alert('Quản trị viên không thể tự khóa tài khoản của chính mình!');
      return;
    }

    playClickSound();
    const nextStatus = targetUser.status === 'blocked' ? 'active' : 'blocked';
    const oldUsers = [...usersList];
    setUsersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, status: nextStatus } : u));

    const ok = await updateUserRoleAndStatusInDb(targetUser.id, { status: nextStatus });
    if (!ok) {
      setUsersList(oldUsers);
      showToast('Cập nhật trạng thái người dùng thất bại trên máy chủ.', 'error');
      return;
    }

    showToast(`Đã ${nextStatus === 'blocked' ? 'khóa' : 'mở khóa'} tài khoản: ${targetUser.name}!`);
  };

  const handleDeleteUser = async (targetUser) => {
    const isSelf = user && (user.id === targetUser.id || user.email === targetUser.email || user.uid === targetUser.id);
    if (isSelf) {
      alert('Quản trị viên không thể tự xóa tài khoản của chính mình!');
      return;
    }

    if (!window.confirm(`CẢNH BÁO: Xác nhận xóa vĩnh viễn tài khoản "${targetUser.name}" (${targetUser.email}) khỏi hệ thống? Thao tác này không thể hoàn tác!`)) {
      return;
    }

    playClickSound();
    const oldUsers = [...usersList];
    setUsersList(prev => prev.filter(u => u.id !== targetUser.id));

    const ok = await deleteUserProfileFromDb(targetUser.id);
    if (!ok) {
      setUsersList(oldUsers);
      showToast('Xóa tài khoản người dùng thất bại trên máy chủ.', 'error');
      return;
    }

    showToast(`Đã xóa vĩnh viễn tài khoản: ${targetUser.name}!`);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateUserError(null);

    const name = newUserForm.name.trim();
    const email = newUserForm.email.trim();
    const role = newUserForm.role;
    const password = (newUserForm.password || '').trim();
    const level = newUserForm.level;

    if (!name || !email) {
      setCreateUserError('Vui lòng nhập đầy đủ họ tên và email!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setCreateUserError('Địa chỉ email không đúng định dạng hợp lệ!');
      return;
    }

    if (role !== 'student' && role !== 'teacher') {
      setCreateUserError('Chỉ cho phép tạo tài khoản vai trò Học viên hoặc Giáo viên.');
      return;
    }

    if (!password || password.length < 8) {
      setCreateUserError('Mật khẩu khởi tạo phải chứa ít nhất 8 ký tự!');
      return;
    }

    playClickSound();
    setIsCreatingUser(true);

    try {
      await adminCreateUser({
        name,
        email,
        role,
        password,
        level,
        status: 'active'
      });

      showToast(`Đã tạo thành công tài khoản cho ${name} (${email})!`);
      setIsAddUserModalOpen(false);
      setNewUserForm({
        name: '',
        email: '',
        role: 'student',
        password: '',
        level: 'HSK 1 - Sơ cấp'
      });
      setShowNewUserPassword(false);

      // Refresh real list from Supabase
      await loadCloudProfiles();
    } catch (err) {
      console.error('adminCreateUser failed:', err);
      setCreateUserError(err.message || 'Không thể tạo tài khoản trên máy chủ.');
      playErrorSound();
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser || !editingUser.name.trim()) return;

    const isSelf = user && (user.id === editingUser.id || user.email === editingUser.email || user.uid === editingUser.id);
    if (isSelf && (editingUser.role !== 'admin' || editingUser.status !== 'active')) {
      alert('Quản trị viên không thể tự thay đổi vai trò hoặc tự khóa tài khoản của chính mình!');
      return;
    }

    playClickSound();
    const updated = usersList.map(u => u.id === editingUser.id ? editingUser : u);
    saveUsersList(updated);
    await updateUserRoleAndStatusInDb(editingUser.id, {
      name: editingUser.name,
      level: editingUser.level,
      role: editingUser.role,
      status: editingUser.status,
      xp: editingUser.xp,
      streak: editingUser.streak
    });
    setIsEditUserModalOpen(false);
    showToast(`Đã lưu thay đổi cho tài khoản ${editingUser.name}!`);
  };

  // Fetch materials directly from Supabase DB (authoritative)
  const loadMaterialsData = async () => {
    setIsLoadingMaterials(true);
    setMaterialsError(null);
    try {
      const dbItems = await getMaterialsFromDb();
      if (Array.isArray(dbItems)) {
        setMaterials(dbItems);
      } else {
        setMaterials([]);
      }
    } catch (err) {
      console.error('Failed to load materials from DB:', err);
      setMaterialsError('Không thể nạp danh sách tài liệu từ cơ sở dữ liệu.');
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  useEffect(() => {
    loadMaterialsData();
    const handleRemoteMaterialsSync = () => {
      loadMaterialsData();
    };
    window.addEventListener('hanzigo:materials_updated', handleRemoteMaterialsSync);
    return () => window.removeEventListener('hanzigo:materials_updated', handleRemoteMaterialsSync);
  }, []);

  // Load Custom Vocab directly from Supabase DB (authoritative)
  const loadCustomVocabData = async () => {
    setIsLoadingVocab(true);
    setVocabError(null);
    try {
      const items = await getCustomVocabularyFromDb();
      setCustomVocab(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to load custom vocab from DB:', err);
      setVocabError('Không thể nạp danh sách từ vựng bổ sung từ cơ sở dữ liệu.');
    } finally {
      setIsLoadingVocab(false);
    }
  };

  // Load Custom Lessons directly from Supabase DB (authoritative)
  const loadCustomLessonsData = async () => {
    setIsLoadingLessons(true);
    setLessonsError(null);
    try {
      const items = await getCustomLessonsFromDb();
      setCustomLessons(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to load custom lessons from DB:', err);
      setLessonsError('Không thể nạp danh sách bài học bổ sung từ cơ sở dữ liệu.');
    } finally {
      setIsLoadingLessons(false);
    }
  };

  useEffect(() => {
    const initializeCustomContent = async () => {
      try {
        await migrateLocalStorageCustomVocab(user);
      } catch (err) {
        console.warn('Custom vocab migration notice:', err);
      }
      try {
        await migrateLocalStorageCustomLessons(user);
      } catch (err) {
        console.warn('Custom lessons migration notice:', err);
      }
      await Promise.all([loadCustomVocabData(), loadCustomLessonsData()]);
    };

    initializeCustomContent();

    const handleRemoteVocabSync = () => loadCustomVocabData();
    const handleRemoteLessonsSync = () => loadCustomLessonsData();

    window.addEventListener('hanzigo:custom_vocab_updated', handleRemoteVocabSync);
    window.addEventListener('hanzigo:custom_lessons_updated', handleRemoteLessonsSync);

    return () => {
      window.removeEventListener('hanzigo:custom_vocab_updated', handleRemoteVocabSync);
      window.removeEventListener('hanzigo:custom_lessons_updated', handleRemoteLessonsSync);
    };
  }, [user]);


  // Materials Actions
  const handleOpenCreateMat = () => {
    playClickSound();
    setEditingMatId(null);
    setMatForm({
      title: '',
      category: 'Giáo trình chuẩn',
      level: 'HSK 1',
      format: 'PDF',
      fileSize: '10 MB',
      author: 'HanziGo Biên soạn',
      publisher: 'BLCU Press / CTI',
      sourceUrl: '',
      skills: 'Từ vựng, Ngữ pháp',
      language: 'Song ngữ Trung - Việt',
      license: 'Bản quyền Giáo trình (Trích dẫn học thuật)',
      verificationStatus: 'verified_official',
      relatedLessonId: 'Module 1.1',
      verificationNotes: '',
      description: '',
      downloadUrl: '',
      tags: '',
      isFeatured: false,
      isHidden: false
    });
    setIsMatFormOpen(true);
  };

  const handleOpenEditMat = (mat) => {
    playClickSound();
    setEditingMatId(mat.id);
    setMatForm({
      ...mat,
      tags: Array.isArray(mat.tags) ? mat.tags.join(', ') : (mat.tags || '')
    });
    setIsMatFormOpen(true);
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    if (!matForm.title.trim()) {
      alert('Vui lòng nhập tiêu đề tài liệu!');
      return;
    }
    playClickSound();
    const tagsArray = typeof matForm.tags === 'string'
      ? matForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : (Array.isArray(matForm.tags) ? matForm.tags : []);

    const payload = { ...matForm, tags: tagsArray };

    try {
      if (editingMatId) {
        await updateMaterialInDb(editingMatId, payload);
        showToast(`Đã cập nhật tài liệu: ${payload.title}!`);
      } else {
        await addMaterialToDb(payload);
        showToast(`Đã thêm tài liệu mới: ${payload.title}!`);
      }
      window.dispatchEvent(new CustomEvent('hanzigo:materials_updated'));
      await loadMaterialsData();
    } catch (err) {
      console.error('Error saving material:', err);
      showToast('Có lỗi xảy ra khi lưu tài liệu lên cơ sở dữ liệu.');
    }
    setIsMatFormOpen(false);
  };

  const handleDeleteMaterial = async (id, title) => {
    if (window.confirm(`Xác nhận xóa tài liệu "${title}" khỏi hệ thống?`)) {
      playClickSound();
      try {
        await deleteMaterialFromDb(id);
        window.dispatchEvent(new CustomEvent('hanzigo:materials_updated'));
        await loadMaterialsData();
        showToast(`Đã xóa tài liệu: ${title}!`);
      } catch (err) {
        console.error('Error deleting material:', err);
        showToast('Có lỗi xảy ra khi xóa tài liệu.');
      }
    }
  };

  const handleToggleMaterialFeatured = async (mat) => {
    playClickSound();
    try {
      await updateMaterialInDb(mat.id, { isFeatured: !mat.isFeatured });
      window.dispatchEvent(new CustomEvent('hanzigo:materials_updated'));
      await loadMaterialsData();
      showToast(`Đã ${!mat.isFeatured ? 'ghim nổi bật' : 'bỏ ghim'} tài liệu: ${mat.title}`);
    } catch (err) {
      console.error('Error toggling featured material:', err);
    }
  };

  const handleToggleMaterialHidden = async (mat) => {
    playClickSound();
    try {
      await updateMaterialInDb(mat.id, { isHidden: !mat.isHidden });
      window.dispatchEvent(new CustomEvent('hanzigo:materials_updated'));
      await loadMaterialsData();
      showToast(`Đã ${!mat.isHidden ? 'ẩn' : 'hiển thị'} tài liệu: ${mat.title}`);
    } catch (err) {
      console.error('Error toggling hidden material:', err);
    }
  };

  const handleRefreshMaterials = async () => {
    playClickSound();
    await loadMaterialsData();
    showToast('Đã làm mới danh sách tài liệu từ cơ sở dữ liệu!');
  };

  // Vocab Actions (Supabase DB Authoritative)
  const handleOpenCreateVocab = () => {
    playClickSound();
    setEditingVocabId(null);
    setVocabForm({
      hanzi: '',
      pinyin: '',
      hanviet: '',
      meaning: '',
      hsk: 'hsk1',
      topic: 'Giao tiếp hàng ngày',
      example: '',
      examplePinyin: '',
      exampleMeaning: '',
      memoryTip: ''
    });
    setVocabFormOpen(true);
  };

  const handleOpenEditVocab = (v) => {
    playClickSound();
    setEditingVocabId(v.id);
    setVocabForm({
      hanzi: v.hanzi || '',
      pinyin: v.pinyin || '',
      hanviet: v.hanviet || '',
      meaning: v.meaning || '',
      hsk: v.hsk || 'hsk1',
      topic: v.topic || 'Giao tiếp hàng ngày',
      example: v.exampleSentence || v.example || '',
      examplePinyin: v.examplePinyin || '',
      exampleMeaning: v.exampleMeaning || '',
      memoryTip: v.mnemonic || v.memoryTip || ''
    });
    setVocabFormOpen(true);
  };

  const handleSaveVocab = async (e) => {
    e.preventDefault();
    const cleanHanzi = (vocabForm.hanzi || '').trim();
    const cleanMeaning = (vocabForm.meaning || '').trim();

    if (!cleanHanzi || !cleanMeaning) {
      alert('Vui lòng nhập chữ Hán và ý nghĩa!');
      return;
    }

    setIsSavingVocab(true);
    try {
      const isDup = await checkVocabularyDuplicate(cleanHanzi, editingVocabId);
      if (isDup) {
        alert(`Từ vựng chữ Hán "${cleanHanzi}" đã tồn tại trong từ điển hệ thống hoặc danh sách bổ sung!`);
        setIsSavingVocab(false);
        return;
      }

      playClickSound();
      if (editingVocabId) {
        const updated = await updateCustomVocabularyInDb(editingVocabId, vocabForm);
        setCustomVocab(prev => prev.map(item => String(item.id) === String(editingVocabId) ? updated : item));
        showToast(`Đã cập nhật từ vựng: ${cleanHanzi}!`);
      } else {
        const created = await addCustomVocabularyToDb(vocabForm, user);
        setCustomVocab(prev => [created, ...prev]);
        showToast(`Đã thêm từ vựng: ${cleanHanzi} (${vocabForm.pinyin || ''})!`);
      }

      setVocabFormOpen(false);
      setEditingVocabId(null);
      setVocabForm({
        hanzi: '',
        pinyin: '',
        hanviet: '',
        meaning: '',
        hsk: 'hsk1',
        topic: 'Giao tiếp hàng ngày',
        example: '',
        examplePinyin: '',
        exampleMeaning: '',
        memoryTip: ''
      });
    } catch (err) {
      console.error('Save vocab error:', err);
      showToast(err.message || 'Lỗi lưu từ vựng!', 'error');
    } finally {
      setIsSavingVocab(false);
    }
  };

  const handleDeleteVocab = async (id, hanzi) => {
    if (window.confirm(`Xóa từ vựng: ${hanzi}? Dữ liệu sẽ được cập nhật trực tiếp trên cơ sở dữ liệu Supabase.`)) {
      playClickSound();
      try {
        await deleteCustomVocabularyFromDb(id);
        setCustomVocab(prev => prev.filter(item => String(item.id) !== String(id)));
        showToast(`Đã xóa từ vựng: ${hanzi}!`);
      } catch (err) {
        console.error('Delete vocab error:', err);
        showToast(err.message || 'Lỗi khi xóa từ vựng!', 'error');
      }
    }
  };

  const handleRefreshVocab = async () => {
    playClickSound();
    await loadCustomVocabData();
    showToast('Đã làm mới danh sách từ vựng bổ sung!');
  };

  // Lesson Actions (Supabase DB Authoritative)
  const handleOpenCreateLesson = () => {
    playClickSound();
    setEditingLessonId(null);
    setLessonForm({
      title: '',
      level: 'HSK 1',
      duration: '20',
      xp: '50',
      description: '',
      grammarPoints: ''
    });
    setLessonFormOpen(true);
  };

  const handleOpenEditLesson = (l) => {
    playClickSound();
    setEditingLessonId(l.id);
    setLessonForm({
      title: l.title || '',
      level: l.level || 'HSK 1',
      duration: String(l.duration || '20'),
      xp: String(l.xp || '50'),
      description: l.description || '',
      grammarPoints: l.grammarPoints || ''
    });
    setLessonFormOpen(true);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    const cleanTitle = (lessonForm.title || '').trim();

    if (!cleanTitle) {
      alert('Vui lòng nhập tên bài học!');
      return;
    }

    setIsSavingLesson(true);
    try {
      const isDup = await checkLessonDuplicate(cleanTitle, editingLessonId);
      if (isDup) {
        alert(`Bài học có tiêu đề "${cleanTitle}" đã tồn tại!`);
        setIsSavingLesson(false);
        return;
      }

      playClickSound();
      if (editingLessonId) {
        const updated = await updateCustomLessonInDb(editingLessonId, lessonForm);
        setCustomLessons(prev => prev.map(item => String(item.id) === String(editingLessonId) ? updated : item));
        showToast(`Đã cập nhật bài học: ${cleanTitle}!`);
      } else {
        const created = await addCustomLessonToDb(lessonForm, user);
        setCustomLessons(prev => [created, ...prev]);
        showToast(`Đã thêm bài học: ${cleanTitle}!`);
      }

      setLessonFormOpen(false);
      setEditingLessonId(null);
      setLessonForm({
        title: '',
        level: 'HSK 1',
        duration: '20',
        xp: '50',
        description: '',
        grammarPoints: ''
      });
    } catch (err) {
      console.error('Save lesson error:', err);
      showToast(err.message || 'Lỗi lưu bài học!', 'error');
    } finally {
      setIsSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (id, title) => {
    if (window.confirm(`Xóa bài học: ${title}? Dữ liệu sẽ được cập nhật trực tiếp trên cơ sở dữ liệu Supabase.`)) {
      playClickSound();
      try {
        await deleteCustomLessonFromDb(id);
        setCustomLessons(prev => prev.filter(item => String(item.id) !== String(id)));
        showToast(`Đã xóa bài học: ${title}!`);
      } catch (err) {
        console.error('Delete lesson error:', err);
        showToast(err.message || 'Lỗi khi xóa bài học!', 'error');
      }
    }
  };

  const handleRefreshLessons = async () => {
    playClickSound();
    await loadCustomLessonsData();
    showToast('Đã làm mới danh sách bài học bổ sung!');
  };

  // Purge Mock Data
  const handlePurgeAllMockData = () => {
    if (!window.confirm('CẢNH BÁO: Thao tác này sẽ xóa toàn bộ số liệu thử nghiệm, lịch sử thi thử HSK, điểm phát âm, và chat đàm thoại trên trình duyệt này để đưa về trạng thái sạch sẽ. Bạn có chắc chắn không?')) {
      return;
    }

    try {
      const keysToPurge = [
        'hanzigo_pronounce_history',
        'hanzigo_pronounce_scores',
        'hanzigo_custom_pronounce_list',
        'hanzigo_hsk_attempts',
        'hanzigo_hsk_history',
        'hanzigo_hsk_mistakes',
        'hanzigo_hsk_analytics',
        'hanzigo_chat_history',
        'hanzigo_daily_missions',
        'hanzigo_study_minutes_map'
      ];
      keysToPurge.forEach(k => {
        try { localStorage.removeItem(k); } catch {}
      });
      showToast('Đã xóa sạch toàn bộ số liệu rác thử nghiệm thành công!');
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  // Export JSON Backup
  const handleExportData = () => {
    playClickSound();
    const backupData = {
      version: '3.0',
      timestamp: new Date().toISOString(),
      materials,
      users: usersList,
      customVocab,
      customLessons
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HanziGo_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Đã xuất file sao lưu dữ liệu toàn hệ thống!');
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchSearch = !userSearch.trim() || 
        (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) || 
        (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.level && u.level.toLowerCase().includes(userSearch.toLowerCase()));
      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      const matchStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
      return matchSearch && matchRole && matchStatus;
    }).sort((a, b) => {
      if (userSortBy === 'xp') return (b.xp || 0) - (a.xp || 0);
      if (userSortBy === 'streak') return (b.streak || 0) - (a.streak || 0);
      if (userSortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return (b.joinedDate || '').localeCompare(a.joinedDate || '');
    });
  }, [usersList, userSearch, userRoleFilter, userStatusFilter, userSortBy]);

  // Paginated Users Calculation
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, safeCurrentPage, pageSize]);

  // Filtered Materials
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchSearch = !matSearch.trim() || 
        m.title.toLowerCase().includes(matSearch.toLowerCase()) || 
        (m.author && m.author.toLowerCase().includes(matSearch.toLowerCase())) ||
        (Array.isArray(m.tags) && m.tags.some(t => t.toLowerCase().includes(matSearch.toLowerCase())));
      const matchCat = matCategoryFilter === 'Tất cả' || m.category === matCategoryFilter;
      const matchLevel = matLevelFilter === 'Tất cả' || m.level === matLevelFilter;
      return matchSearch && matchCat && matchLevel;
    }).sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }, [materials, matSearch, matCategoryFilter, matLevelFilter]);

  // Filtered Vocab
  const filteredVocab = useMemo(() => {
    return customVocab.filter(v => {
      const matchSearch = !vocabSearch.trim() || 
        v.hanzi.toLowerCase().includes(vocabSearch.toLowerCase()) ||
        v.pinyin.toLowerCase().includes(vocabSearch.toLowerCase()) ||
        v.meaning.toLowerCase().includes(vocabSearch.toLowerCase()) ||
        (v.hanviet && v.hanviet.toLowerCase().includes(vocabSearch.toLowerCase()));
      const matchHsk = vocabHskFilter === 'all' || v.hsk === vocabHskFilter;
      return matchSearch && matchHsk;
    });
  }, [customVocab, vocabSearch, vocabHskFilter]);

  // Filtered Lessons
  const filteredLessons = useMemo(() => {
    return customLessons.filter(l => {
      const matchSearch = !lessonSearch.trim() || 
        (l.title && l.title.toLowerCase().includes(lessonSearch.toLowerCase())) ||
        (l.description && l.description.toLowerCase().includes(lessonSearch.toLowerCase()));
      const matchLevel = lessonLevelFilter === 'all' || 
        (l.level && l.level.toLowerCase().replace(/\s+/g, '') === lessonLevelFilter.toLowerCase().replace(/\s+/g, ''));
      return matchSearch && matchLevel;
    });
  }, [customLessons, lessonSearch, lessonLevelFilter]);

  // Total User Stats
  const userStats = useMemo(() => {
    const total = usersList.length;
    const admins = usersList.filter(u => u.role === 'admin').length;
    const teachers = usersList.filter(u => u.role === 'teacher').length;
    const active = usersList.filter(u => u.status === 'active').length;
    const blocked = usersList.filter(u => u.status === 'blocked').length;
    const totalXp = usersList.reduce((acc, cur) => acc + (cur.xp || 0), 0);
    return { total, admins, teachers, active, blocked, totalXp };
  }, [usersList]);

  // Navigation tab definitions
  const adminTabsList = [
    { id: 'overview', label: 'Tổng quan & KPI', icon: BarChart3 },
    { id: 'users', label: `Người dùng (${usersList.length})`, icon: Users },
    { id: 'moderation', label: 'Kiểm duyệt', icon: ShieldAlert },
    { id: 'materials', label: `Kho Tài liệu (${materials.length})`, icon: FileText },
    { id: 'vocab', label: `Từ vựng (${customVocab.length})`, icon: Layers },
    { id: 'lessons', label: `Bài học (${customLessons.length})`, icon: BookOpen },
    { id: 'ai_metrics', label: 'Giám sát AI & Chi phí', icon: Cpu },
    { id: 'backup', label: 'Sao lưu & Dọn dẹp', icon: Upload }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl border border-white/10 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 size={18} className="text-[#45B97C]" />
          <span>{toastMsg.message}</span>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white p-6 sm:p-8 border border-white/10 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-[#E85D3F]/20 text-[#E85D3F] border border-[#E85D3F]/30">
                <ShieldCheck size={14} />
                Bảng Điều Khiển Quản Trị Hệ Thống
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Crown size={13} />
                <span>Toàn quyền quản trị viên</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Trung Tâm Quản Trị HanziGo
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Theo dõi toàn diện học viên, quản lý kho tài liệu, chỉnh sửa ngân hàng từ vựng, điều chỉnh bài học và giám sát tải AI theo thời gian thực.
            </p>
          </div>

          {/* Authenticated Admin Identity Badge & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {isEditingAdminName ? (
              <form 
                onSubmit={handleSaveAdminName}
                className="p-2 px-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-emerald-400/40 flex items-center gap-2.5 shadow-xl animate-in fade-in duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
                  <Crown size={16} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={adminNameInput}
                    onChange={(e) => setAdminNameInput(e.target.value)}
                    placeholder="Nhập họ và tên..."
                    autoFocus
                    maxLength={40}
                    className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-emerald-400 w-36 sm:w-44"
                  />
                  <button
                    type="submit"
                    disabled={isSavingAdminName}
                    title="Lưu tên"
                    className="p-1.5 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white transition-all cursor-pointer flex items-center justify-center font-bold text-xs gap-1"
                  >
                    <Check size={14} />
                    <span>Lưu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminNameInput(user?.name || 'Quản trị viên');
                      setIsEditingAdminName(false);
                    }}
                    title="Hủy"
                    className="p-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-all cursor-pointer flex items-center justify-center text-xs"
                  >
                    <X size={14} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/[0.14] backdrop-blur-md border border-white/15 transition-all flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 border border-emerald-400/30 shadow-inner">
                  <Crown size={17} />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Quản trị viên:</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs sm:text-sm font-black text-white truncate max-w-[160px]">
                      {user?.name || 'Quản trị viên HanziGo'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminNameInput(user?.name || 'Quản trị viên');
                        setIsEditingAdminName(true);
                      }}
                      title="Chỉnh sửa họ tên"
                      className="p-1 rounded-lg bg-white/10 hover:bg-emerald-500/30 text-gray-300 hover:text-emerald-300 transition-all cursor-pointer"
                    >
                      <Edit3 size={12} />
                    </button>
                  </div>
                  <p className="text-[10px] font-medium text-gray-400 truncate max-w-[180px]">
                    {user?.email || 'admin@hanzigo.com'}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleExportData}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Download size={15} />
              <span>Xuất sao lưu</span>
            </button>
          </div>
        </div>

        {/* System Overview KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-xs text-[#94A3B8] font-semibold flex items-center gap-1.5">
              <Users size={14} className="text-[#E85D3F]" />
              <span>Tổng học viên</span>
            </p>
            <p className="text-2xl font-black text-white mt-1">{userStats.total}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-xs text-[#94A3B8] font-semibold flex items-center gap-1.5">
              <Crown size={14} className="text-emerald-400" />
              <span>Quản trị & Giáo viên</span>
            </p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{userStats.admins + userStats.teachers}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-xs text-[#94A3B8] font-semibold flex items-center gap-1.5">
              <FileText size={14} className="text-[#F4B942]" />
              <span>Tài liệu & Bài học</span>
            </p>
            <p className="text-2xl font-black text-[#F4B942] mt-1">{materials.length + customLessons.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-xs text-[#94A3B8] font-semibold flex items-center gap-1.5">
              <Activity size={14} className="text-sky-400" />
              <span>Tổng XP tích lũy</span>
            </p>
            <p className="text-2xl font-black text-sky-400 mt-1">{userStats.totalXp.toLocaleString()} XP</p>
          </div>
        </div>
      </div>

      {/* 2. Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-2 overflow-x-auto">
        {adminTabsList.map((t) => {
          const Icon = t.icon;
          const isActive = adminTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                playClickSound();
                setAdminTab(t.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                  : 'text-[#748092] dark:text-[#94A3B8] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 0: OVERVIEW & SYSTEM ANALYTICS */}
      {/* ============================================================== */}
      {adminTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Quick Summary Card 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Tình trạng tài khoản</span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <UserCheck size={18} />
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-[#243447] dark:text-white">
                  {userStats.active} <span className="text-xs text-[#45B97C] font-bold">hoạt động</span>
                </p>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                  {userStats.blocked} tài khoản đang bị tạm khóa
                </p>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#45B97C] h-2 rounded-full" 
                  style={{ width: `${userStats.total ? (userStats.active / userStats.total) * 100 : 100}%` }}
                />
              </div>
            </div>

            {/* Quick Summary Card 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Dung lượng học liệu</span>
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <FileText size={18} />
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-[#243447] dark:text-white">
                  {materials.length} <span className="text-xs text-[#D97706] font-bold">tài liệu PDF & Audio</span>
                </p>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                  {materials.filter(m => m.isFeatured).length} tài liệu được ghim nổi bật
                </p>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Quick Summary Card 3 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Hệ thống AI Lão Sư</span>
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <Cpu size={18} />
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-[#243447] dark:text-white">
                  Hoạt động <span className="text-xs text-purple-500 font-bold">100% Sẵn sàng</span>
                </p>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                  xKiro Free Tier & Dự phòng Gemini tự động
                </p>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 rounded-3xl bg-[#FFF9F2] dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <h3 className="text-base font-black text-[#243447] dark:text-white mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-[#E85D3F]" />
              <span>Lối tắt quản trị nhanh</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => {
                  playClickSound();
                  setAdminTab('users');
                  setIsAddUserModalOpen(true);
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#E85D3F] transition-all cursor-pointer group shadow-xs"
              >
                <Plus size={20} className="text-[#E85D3F] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-[#243447] dark:text-white">Thêm học viên</p>
                <p className="text-[10px] text-[#748092]">Tạo tài khoản mới</p>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setAdminTab('materials');
                  handleOpenCreateMat();
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#E85D3F] transition-all cursor-pointer group shadow-xs"
              >
                <FileText size={20} className="text-[#D97706] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-[#243447] dark:text-white">Thêm tài liệu</p>
                <p className="text-[10px] text-[#748092]">Tải lên giáo trình</p>
              </button>

              <button
                onClick={() => {
                  setAdminTab('vocab');
                  handleOpenCreateVocab();
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#E85D3F] transition-all cursor-pointer group shadow-xs"
              >
                <Layers size={20} className="text-[#45B97C] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-[#243447] dark:text-white">Thêm từ vựng</p>
                <p className="text-[10px] text-[#748092]">Bổ sung từ mới</p>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setAdminTab('ai_metrics');
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#E85D3F] transition-all cursor-pointer group shadow-xs"
              >
                <Cpu size={20} className="text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-[#243447] dark:text-white">Xem tải AI</p>
                <p className="text-[10px] text-[#748092]">Giám sát token</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: USER MANAGEMENT */}
      {/* ============================================================== */}
      {adminTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Controls: Search, Filters & Add User */}
          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
                <input 
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Tìm học viên theo tên, email, trình độ HSK..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Action Buttons: Refresh & Add User */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    loadCloudProfiles();
                  }}
                  disabled={isLoadingUsers}
                  title="Tải lại danh sách từ cơ sở dữ liệu"
                  className="p-2.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-black/5 dark:hover:bg-white/5 text-[#748092] dark:text-[#94A3B8] transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isLoadingUsers ? 'animate-spin text-[#E85D3F]' : ''} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setCreateUserError(null);
                    setIsAddUserModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Tạo tài khoản người dùng</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#748092] dark:text-[#94A3B8]">Vai trò:</span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'admin', label: 'Quản trị viên' },
                  { id: 'teacher', label: 'Giáo viên' },
                  { id: 'student', label: 'Học viên' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setUserRoleFilter(r.id)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      userRoleFilter === r.id
                        ? 'bg-[#E85D3F] text-white'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] hover:bg-black/5'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#748092] dark:text-[#94A3B8]">Trạng thái:</span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'active', label: 'Hoạt động' },
                  { id: 'blocked', label: 'Bị khóa' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setUserStatusFilter(s.id)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      userStatusFilter === s.id
                        ? 'bg-[#243447] dark:bg-white text-white dark:text-[#243447]'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] hover:bg-black/5'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}

                <select
                  value={userSortBy}
                  onChange={(e) => setUserSortBy(e.target.value)}
                  className="ml-2 px-3 py-1 rounded-xl font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
                >
                  <option value="xp">Sắp xếp: Điểm XP</option>
                  <option value="streak">Sắp xếp: Chuỗi ngày</option>
                  <option value="name">Sắp xếp: Tên A-Z</option>
                  <option value="date">Sắp xếp: Mới nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#FFF9F2] dark:bg-[#131B24] border-b border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8] font-bold">
                    <th className="p-4 pl-6">Người dùng</th>
                    <th className="p-4">Phân quyền</th>
                    <th className="p-4">Cấp độ học</th>
                    <th className="p-4 text-center">Chuỗi ngày</th>
                    <th className="p-4 text-right">Điểm XP</th>
                    <th className="p-4 text-center">Trạng thái</th>
                    <th className="p-4 pr-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
                  {isLoadingUsers ? (
                    <tr>
                      <td colSpan="7" className="p-12 text-center text-[#748092] dark:text-[#94A3B8]">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 size={28} className="animate-spin text-[#E85D3F]" />
                          <p className="font-semibold text-sm">Đang tải danh sách người dùng từ máy chủ...</p>
                        </div>
                      </td>
                    </tr>
                  ) : fetchUsersError ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-rose-500 dark:text-rose-400">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <AlertTriangle size={28} />
                          <p className="font-bold text-sm">{fetchUsersError}</p>
                          <button
                            type="button"
                            onClick={loadCloudProfiles}
                            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                          >
                            <RefreshCw size={14} />
                            <span>Thử lại</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-12 text-center text-[#748092] dark:text-[#94A3B8]">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users size={32} className="opacity-40" />
                          <p className="font-bold text-sm">
                            {usersList.length === 0
                              ? 'Chưa có người dùng nào trong cơ sở dữ liệu.'
                              : 'Không tìm thấy người dùng nào phù hợp với bộ lọc tìm kiếm.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u) => {
                      const isSelf = user && (user.id === u.id || user.email === u.email || user.uid === u.id);
                      return (
                        <tr key={u.id} className="hover:bg-[#FFFDF9] dark:hover:bg-white/5 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#E85D3F]/10 text-[#E85D3F] font-black flex items-center justify-center shrink-0 border border-[#E85D3F]/20">
                                {u.avatar ? (
                                  <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  u.name ? u.name.charAt(0).toUpperCase() : 'U'
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-[#243447] dark:text-white truncate flex items-center gap-1.5">
                                  <span>{u.name || 'Người dùng'}</span>
                                  {isSelf && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                                      Bạn
                                    </span>
                                  )}
                                </p>
                                <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] truncate">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <select
                              value={u.role || 'student'}
                              disabled={isSelf}
                              onChange={(e) => handleChangeUserRole(u, e.target.value)}
                              className="px-2.5 py-1 rounded-xl text-xs font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#131B24] text-[#243447] dark:text-white cursor-pointer disabled:opacity-60"
                            >
                              <option value="student">Học viên</option>
                              <option value="teacher">Giáo viên</option>
                              <option value="admin">Quản trị viên</option>
                            </select>
                          </td>

                          <td className="p-4 font-semibold text-[#243447] dark:text-[#CBD5E1]">
                            {u.level || 'HSK 1 - Sơ cấp'}
                          </td>

                          <td className="p-4 text-center font-bold text-[#D97706]">
                            🔥 {u.streak || 0}
                          </td>

                          <td className="p-4 text-right font-black text-[#E85D3F]">
                            {(u.xp || 0).toLocaleString()} XP
                          </td>

                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              u.status === 'blocked'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}>
                              {u.status === 'blocked' ? 'Bị khóa' : 'Hoạt động'}
                            </span>
                          </td>

                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  playClickSound();
                                  setEditingUser(u);
                                  setIsEditUserModalOpen(true);
                                }}
                                title="Sửa thông tin"
                                className="p-1.5 rounded-lg text-gray-500 hover:text-[#E85D3F] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                              >
                                <Edit3 size={15} />
                              </button>

                              {!isSelf && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleUserStatus(u)}
                                    title={u.status === 'blocked' ? 'Mở khóa' : 'Khóa tài khoản'}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-amber-500 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                                  >
                                    {u.status === 'blocked' ? <Unlock size={15} /> : <Lock size={15} />}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u)}
                                    title="Xóa tài khoản"
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-rose-500 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {!isLoadingUsers && !fetchUsersError && filteredUsers.length > 0 && (
              <div className="p-4 px-6 border-t border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2]/50 dark:bg-[#131B24]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="text-[#748092] dark:text-[#94A3B8] font-medium">
                  Trang <span className="font-bold text-[#243447] dark:text-white">{safeCurrentPage}</span> / <span className="font-bold text-[#243447] dark:text-white">{totalPages}</span> (Tổng cộng <span className="font-bold text-[#243447] dark:text-white">{filteredUsers.length}</span> người dùng)
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={safeCurrentPage <= 1}
                    className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft size={14} />
                    <span>Trước</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl font-bold transition-all cursor-pointer ${
                        safeCurrentPage === pageNum
                          ? 'bg-[#E85D3F] text-white shadow-sm'
                          : 'border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage >= totalPages}
                    className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                  >
                    <span>Sau</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: COMMUNITY MODERATION (Phase 24 Task 24.08D) */}
      {/* ============================================================== */}
      {adminTab === 'moderation' && (
        <CommunityModerationDashboard user={user} />
      )}

      {/* ============================================================== */}
      {/* TAB 2: MATERIALS HUB */}
      {/* ============================================================== */}
      {adminTab === 'materials' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
                <input 
                  type="text"
                  value={matSearch}
                  onChange={(e) => setMatSearch(e.target.value)}
                  placeholder="Tìm tài liệu theo tiêu đề, tác giả, thẻ tag..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenCreateMat}
                  className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Plus size={16} />
                  <span>Thêm tài liệu mới</span>
                </button>

                <button
                  onClick={handleRefreshMaterials}
                  disabled={isLoadingMaterials}
                  className="px-3.5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-[#131B24] dark:hover:bg-gray-800 text-[#748092] dark:text-[#94A3B8] text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  title="Tải lại tài liệu từ cơ sở dữ liệu"
                >
                  <RefreshCw size={15} className={isLoadingMaterials ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#748092] dark:text-[#94A3B8]">Danh mục:</span>
                {['Tất cả', 'Giáo trình chuẩn', 'Ngữ pháp chuyên sâu', 'Đề thi HSK', 'Bộ thủ & Hán tự', 'Thành ngữ & Giao tiếp'].map(c => (
                  <button
                    key={c}
                    onClick={() => setMatCategoryFilter(c)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      matCategoryFilter === c
                        ? 'bg-[#E85D3F] text-white'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] hover:bg-black/5'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#748092] dark:text-[#94A3B8]">Cấp độ:</span>
                <select
                  value={matLevelFilter}
                  onChange={(e) => setMatLevelFilter(e.target.value)}
                  className="px-3 py-1 rounded-xl font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
                >
                  {MATERIAL_LEVELS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Materials Content: Loading, Error, Empty, or Grid */}
          {isLoadingMaterials ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 size={36} className="text-[#E85D3F] animate-spin" />
              <p className="text-sm font-bold text-[#748092] dark:text-[#94A3B8]">
                Đang tải danh sách tài liệu từ cơ sở dữ liệu...
              </p>
            </div>
          ) : materialsError ? (
            <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 text-center space-y-3">
              <AlertTriangle size={32} className="text-red-500 mx-auto" />
              <p className="text-sm font-bold text-red-600 dark:text-red-400">{materialsError}</p>
              <button
                onClick={loadMaterialsData}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <BookOpen size={40} className="text-gray-300 dark:text-gray-600" />
              <h4 className="text-base font-black text-[#243447] dark:text-white">
                Không tìm thấy tài liệu phù hợp
              </h4>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] max-w-sm">
                Chưa có tài liệu nào trong cơ sở dữ liệu hoặc không khớp với tiêu chí tìm kiếm/lọc hiện tại.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((mat) => (
              <div 
                key={mat.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {mat.isFeatured && (
                  <div className="absolute top-0 right-0 bg-[#E85D3F] text-white text-[10px] font-black px-3 py-0.5 rounded-bl-xl shadow-xs">
                    Nổi bật
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-lg bg-orange-100 text-[#E85D3F] dark:bg-orange-950/50 text-[10px] font-bold">
                      {mat.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-[#748092] dark:text-gray-300 text-[10px] font-bold">
                      {mat.level}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#243447] dark:text-white text-base line-clamp-2">
                    {mat.title}
                  </h3>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1">
                    Tác giả: {mat.author || 'HanziGo'} • {mat.format || 'PDF'}
                  </p>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-2 line-clamp-2">
                    {mat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleMaterialFeatured(mat)}
                      title={mat.isFeatured ? 'Bỏ nổi bật' : 'Ghim nổi bật'}
                      className={`p-1.5 rounded-lg cursor-pointer ${mat.isFeatured ? 'text-[#F4B942]' : 'text-gray-400 hover:text-[#F4B942]'}`}
                    >
                      <Star size={16} className={mat.isFeatured ? 'fill-current' : ''} />
                    </button>
                    <button
                      onClick={() => handleToggleMaterialHidden(mat)}
                      title={mat.isHidden ? 'Hiển thị' : 'Ẩn'}
                      className={`p-1.5 rounded-lg cursor-pointer ${mat.isHidden ? 'text-rose-500' : 'text-gray-400 hover:text-emerald-500'}`}
                    >
                      {mat.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditMat(mat)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-[#E85D3F] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: CUSTOM VOCABULARY */}
      {/* ============================================================== */}
      {adminTab === 'vocab' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
              <input 
                type="text"
                value={vocabSearch}
                onChange={(e) => setVocabSearch(e.target.value)}
                placeholder="Tìm chữ Hán, Pinyin, Hán-Việt, ý nghĩa..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={vocabHskFilter}
                onChange={(e) => setVocabHskFilter(e.target.value)}
                className="px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
              >
                <option value="all">Mọi cấp độ HSK</option>
                <option value="hsk1">HSK 1</option>
                <option value="hsk2">HSK 2</option>
                <option value="hsk3">HSK 3</option>
                <option value="hsk4">HSK 4</option>
                <option value="hsk5">HSK 5</option>
                <option value="hsk6">HSK 6</option>
              </select>

              <button
                onClick={handleRefreshVocab}
                disabled={isLoadingVocab}
                className="p-2.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#E85D3F] hover:bg-orange-50 dark:hover:bg-[#131B24] transition-all cursor-pointer shrink-0"
                title="Làm mới từ cơ sở dữ liệu"
              >
                <RefreshCw size={16} className={isLoadingVocab ? 'animate-spin text-[#E85D3F]' : ''} />
              </button>

              <button
                onClick={handleOpenCreateVocab}
                className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus size={16} />
                <span>Thêm từ vựng</span>
              </button>
            </div>
          </div>

          {/* Loading / Error States */}
          {isLoadingVocab && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-[#E85D3F]" size={32} />
              <p className="text-sm font-bold text-[#748092]">Đang tải từ vựng từ cơ sở dữ liệu Supabase...</p>
            </div>
          )}

          {!isLoadingVocab && vocabError && (
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-rose-600 shrink-0" size={24} />
                <p className="text-sm font-bold text-rose-700 dark:text-rose-300">{vocabError}</p>
              </div>
              <button
                onClick={loadCustomVocabData}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          )}

          {!isLoadingVocab && !vocabError && filteredVocab.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
              <Layers size={40} className="mx-auto text-gray-400" />
              <h4 className="text-base font-bold text-[#243447] dark:text-white">Không tìm thấy từ vựng bổ sung nào</h4>
              <p className="text-xs text-[#748092]">
                {vocabSearch || vocabHskFilter !== 'all' 
                  ? 'Thử thay đổi từ khóa hoặc bộ lọc cấp độ HSK.'
                  : 'Hãy thêm từ vựng mới để đồng bộ vào cơ sở dữ liệu và sổ tay từ vựng của học viên.'}
              </p>
              <button
                onClick={handleOpenCreateVocab}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold cursor-pointer"
              >
                <Plus size={14} />
                <span>Thêm từ vựng đầu tiên</span>
              </button>
            </div>
          )}

          {!isLoadingVocab && !vocabError && filteredVocab.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVocab.map((v) => (
                <div 
                  key={v.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex items-center justify-between group hover:border-[#E85D3F] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] font-['Noto_Serif_SC'] text-2xl font-black flex items-center justify-center shrink-0">
                      {v.hanzi}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#243447] dark:text-white truncate">
                        {v.pinyin} <span className="text-xs font-semibold text-[#D97706]">({v.hanviet || 'Hán-Việt'})</span>
                      </p>
                      <p className="text-xs text-[#748092] dark:text-[#94A3B8] truncate">{v.meaning}</p>
                      <span className="text-[10px] font-bold text-[#E85D3F] uppercase">{v.hsk}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => speakChinese(v.hanzi)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#E85D3F] cursor-pointer"
                      title="Nghe phát âm"
                    >
                      <Volume2 size={16} />
                    </button>
                    <button
                      onClick={() => handleOpenEditVocab(v)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#E85D3F] cursor-pointer"
                      title="Chỉnh sửa từ vựng"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteVocab(v.id, v.hanzi)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 cursor-pointer"
                      title="Xóa từ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: LESSONS MANAGEMENT */}
      {/* ============================================================== */}
      {adminTab === 'lessons' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
              <input 
                type="text"
                value={lessonSearch}
                onChange={(e) => setLessonSearch(e.target.value)}
                placeholder="Tìm tiêu đề, mô tả bài học bổ sung..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={lessonLevelFilter}
                onChange={(e) => setLessonLevelFilter(e.target.value)}
                className="px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
              >
                <option value="all">Mọi cấp độ</option>
                <option value="Nhập môn">Nhập môn</option>
                <option value="HSK 1">HSK 1</option>
                <option value="HSK 2">HSK 2</option>
                <option value="HSK 3">HSK 3</option>
                <option value="HSK 4">HSK 4</option>
                <option value="HSK 5">HSK 5</option>
                <option value="HSK 6">HSK 6</option>
              </select>

              <button
                onClick={handleRefreshLessons}
                disabled={isLoadingLessons}
                className="p-2.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#E85D3F] hover:bg-orange-50 dark:hover:bg-[#131B24] transition-all cursor-pointer shrink-0"
                title="Làm mới từ cơ sở dữ liệu"
              >
                <RefreshCw size={16} className={isLoadingLessons ? 'animate-spin text-[#E85D3F]' : ''} />
              </button>

              <button
                onClick={handleOpenCreateLesson}
                className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus size={16} />
                <span>Tạo bài học mới</span>
              </button>
            </div>
          </div>

          {/* Loading / Error States */}
          {isLoadingLessons && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-[#E85D3F]" size={32} />
              <p className="text-sm font-bold text-[#748092]">Đang tải bài học từ cơ sở dữ liệu Supabase...</p>
            </div>
          )}

          {!isLoadingLessons && lessonsError && (
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-rose-600 shrink-0" size={24} />
                <p className="text-sm font-bold text-rose-700 dark:text-rose-300">{lessonsError}</p>
              </div>
              <button
                onClick={loadCustomLessonsData}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          )}

          {!isLoadingLessons && !lessonsError && filteredLessons.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
              <BookOpen size={40} className="mx-auto text-gray-400" />
              <h4 className="text-base font-bold text-[#243447] dark:text-white">Không tìm thấy bài học bổ sung nào</h4>
              <p className="text-xs text-[#748092]">
                {lessonSearch || lessonLevelFilter !== 'all' 
                  ? 'Thử thay đổi từ khóa hoặc bộ lọc cấp độ.'
                  : 'Hãy tạo bài học bổ sung đầu tiên để lưu vào cơ sở dữ liệu Supabase.'}
              </p>
              <button
                onClick={handleOpenCreateLesson}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold cursor-pointer"
              >
                <Plus size={14} />
                <span>Tạo bài học đầu tiên</span>
              </button>
            </div>
          )}

          {!isLoadingLessons && !lessonsError && filteredLessons.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLessons.map((l) => (
                <div 
                  key={l.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col justify-between space-y-3 group hover:border-[#E85D3F] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-[#E85D3F]">
                        {l.level}
                      </span>
                      <span className="text-xs text-[#748092]">+{l.xp} XP</span>
                    </div>
                    <h4 className="text-base font-bold text-[#243447] dark:text-white">{l.title}</h4>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1 line-clamp-2">{l.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                    <span className="text-xs text-[#748092]">Thời lượng: {l.duration} phút</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditLesson(l)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#E85D3F] cursor-pointer"
                        title="Chỉnh sửa bài học"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(l.id, l.title)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                        title="Xóa bài học"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: AI MONITORING & COST */}
      {/* ============================================================== */}
      {adminTab === 'ai_metrics' && (
        <AiMonitoringDashboard />
      )}

      {/* ============================================================== */}
      {/* TAB 6: BACKUP & SYSTEM PURGE */}
      {/* ============================================================== */}
      {adminTab === 'backup' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Export Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Download size={24} />
              </div>
              <h3 className="text-lg font-black text-[#243447] dark:text-white">
                Xuất Toàn Bộ Dữ Liệu Hệ Thống
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                Tải về toàn bộ danh sách người dùng, kho tài liệu, từ vựng và bài học dưới dạng file JSON chuẩn hóa để lưu trữ hoặc di chuyển máy chủ.
              </p>
              <button
                onClick={handleExportData}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Download size={16} />
                <span>Tải file backup JSON</span>
              </button>
            </div>

            {/* Clean Mock Data Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-rose-200 dark:border-rose-950/60 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-black text-[#243447] dark:text-white">
                Dọn Dẹp Dữ Liệu Thử Nghiệm (Purge)
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                Xóa sạch các số liệu rác, lịch sử thi thử HSK và tin nhắn chat test trên trình duyệt để đưa hệ thống về trạng thái sạch sẽ.
              </p>
              <button
                onClick={handlePurgeAllMockData}
                className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Xóa dữ liệu rác trên thiết bị</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: ADD USER MODAL */}
      {/* ============================================================== */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <UserCheck size={20} className="text-[#E85D3F]" />
                <span>Tạo Tài Khoản Người Dùng Mới</span>
              </h3>
              <button 
                type="button"
                onClick={() => {
                  if (!isCreatingUser) setIsAddUserModalOpen(false);
                }}
                disabled={isCreatingUser}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            {createUserError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5 text-rose-500" />
                <span className="flex-1">{createUserError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                  Họ và tên người dùng *
                </label>
                <input 
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="Ví dụ: Hoàng Đức Anh"
                  disabled={isCreatingUser}
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F] disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                  Địa chỉ Email đăng nhập *
                </label>
                <input 
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="ducanh@gmail.com"
                  disabled={isCreatingUser}
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F] disabled:opacity-60"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
                    Mật khẩu khởi tạo * (tối thiểu 8 ký tự)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPassword}
                    disabled={isCreatingUser}
                    className="text-[11px] font-bold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Key size={12} />
                    <span>Tạo ngẫu nhiên</span>
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type={showNewUserPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newUserForm.password || ''}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="Nhập ít nhất 8 ký tự..."
                    disabled={isCreatingUser}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F] disabled:opacity-60 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showNewUserPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Phân quyền vai trò
                  </label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    disabled={isCreatingUser}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold disabled:opacity-60"
                  >
                    <option value="student">Học viên (Student)</option>
                    <option value="teacher">Giáo viên (Teacher)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Cấp độ HSK khởi đầu
                  </label>
                  <select
                    value={newUserForm.level}
                    onChange={(e) => setNewUserForm({ ...newUserForm, level: e.target.value })}
                    disabled={isCreatingUser}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold disabled:opacity-60"
                  >
                    <option value="HSK 1 - Sơ cấp">HSK 1 - Sơ cấp</option>
                    <option value="HSK 2 - Cơ bản">HSK 2 - Cơ bản</option>
                    <option value="HSK 3 - Trung cấp">HSK 3 - Trung cấp</option>
                    <option value="HSK 4 - Độc lập">HSK 4 - Độc lập</option>
                    <option value="HSK 5 - Cao cấp">HSK 5 - Cao cấp</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  disabled={isCreatingUser}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-black/5 cursor-pointer disabled:opacity-40"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCreatingUser ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Đang tạo tài khoản...</span>
                    </>
                  ) : (
                    <span>Tạo tài khoản</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EDIT USER MODAL */}
      {/* ============================================================== */}
      {isEditUserModalOpen && editingUser && (() => {
        const isEditingSelf = user && (user.id === editingUser.id || user.email === editingUser.email || user.uid === editingUser.id);
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <Edit3 size={20} className="text-[#E85D3F]" />
                <span>Chỉnh Sửa Người Dùng</span>
              </h3>
              <button 
                type="button"
                onClick={() => setIsEditUserModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                  Họ và tên
                </label>
                <input 
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Cấp độ HSK
                  </label>
                  <select
                    value={editingUser.level}
                    onChange={(e) => setEditingUser({ ...editingUser, level: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  >
                    <option value="HSK 1 - Sơ cấp">HSK 1 - Sơ cấp</option>
                    <option value="HSK 2 - Cơ bản">HSK 2 - Cơ bản</option>
                    <option value="HSK 3 - Trung cấp">HSK 3 - Trung cấp</option>
                    <option value="HSK 4 - Độc lập">HSK 4 - Độc lập</option>
                    <option value="HSK 5 - Cao cấp">HSK 5 - Cao cấp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Trạng thái {isEditingSelf && <span className="text-[10px] text-gray-400">(Không thể tự khóa)</span>}
                  </label>
                  <select
                    value={editingUser.status}
                    disabled={isEditingSelf}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold disabled:opacity-60"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="blocked">Khóa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Điểm XP
                  </label>
                  <input 
                    type="number"
                    value={editingUser.xp || 0}
                    onChange={(e) => setEditingUser({ ...editingUser, xp: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Chuỗi ngày streak
                  </label>
                  <input 
                    type="number"
                    value={editingUser.streak || 0}
                    onChange={(e) => setEditingUser({ ...editingUser, streak: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-black/5 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
        );
      })()}

      {/* ============================================================== */}
      {/* MODAL 3: ADD / EDIT MATERIAL MODAL */}
      {/* ============================================================== */}
      {isMatFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-[#E85D3F]" />
                <span>{editingMatId ? 'Cập Nhật Tài Liệu' : 'Thêm Tài Liệu Mới'}</span>
              </h3>
              <button onClick={() => setIsMatFormOpen(false)} className="cursor-pointer">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#748092] mb-1">Tiêu đề tài liệu *</label>
                <input 
                  type="text" 
                  required 
                  value={matForm.title}
                  onChange={(e) => setMatForm({ ...matForm, title: e.target.value })}
                  placeholder="Ví dụ: Giáo trình Chuẩn HSK 1"
                  className="w-full px-4 py-2 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Danh mục</label>
                  <select
                    value={matForm.category}
                    onChange={(e) => setMatForm({ ...matForm, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl text-xs font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  >
                    {MATERIAL_CATEGORIES.filter(c => c !== 'Tất cả').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Cấp độ</label>
                  <select
                    value={matForm.level}
                    onChange={(e) => setMatForm({ ...matForm, level: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl text-xs font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  >
                    {MATERIAL_LEVELS.filter(l => l !== 'Tất cả').map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] mb-1">Mô tả tóm tắt</label>
                <textarea 
                  rows={2}
                  value={matForm.description}
                  onChange={(e) => setMatForm({ ...matForm, description: e.target.value })}
                  placeholder="Nội dung, phương pháp và đối tượng học..."
                  className="w-full px-4 py-2 rounded-xl text-xs border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Link tải (URL)</label>
                  <input 
                    type="url"
                    value={matForm.downloadUrl || ''}
                    onChange={(e) => setMatForm({ ...matForm, downloadUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 rounded-xl text-xs border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Dung lượng / Định dạng</label>
                  <input 
                    type="text"
                    value={matForm.fileSize || '10 MB'}
                    onChange={(e) => setMatForm({ ...matForm, fileSize: e.target.value })}
                    placeholder="10 MB"
                    className="w-full px-4 py-2 rounded-xl text-xs border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#243447] dark:text-white">
                  <input 
                    type="checkbox"
                    checked={matForm.isFeatured}
                    onChange={(e) => setMatForm({ ...matForm, isFeatured: e.target.checked })}
                    className="rounded text-[#E85D3F]"
                  />
                  <span>Ghim nổi bật</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#243447] dark:text-white">
                  <input 
                    type="checkbox"
                    checked={matForm.isHidden}
                    onChange={(e) => setMatForm({ ...matForm, isHidden: e.target.checked })}
                    className="rounded text-[#E85D3F]"
                  />
                  <span>Tạm ẩn</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setIsMatFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingMatId ? 'Lưu cập nhật' : 'Thêm tài liệu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: ADD / EDIT CUSTOM VOCAB */}
      {/* ============================================================== */}
      {vocabFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <Layers size={20} className="text-[#E85D3F]" />
                <span>{editingVocabId ? 'Chỉnh Sửa Từ Vựng Bổ Sung' : 'Thêm Từ Vựng Mới'}</span>
              </h3>
              <button 
                onClick={() => {
                  setVocabFormOpen(false);
                  setEditingVocabId(null);
                }} 
                className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveVocab} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Chữ Hán *</label>
                  <input 
                    type="text" 
                    required 
                    value={vocabForm.hanzi}
                    onChange={(e) => setVocabForm({ ...vocabForm, hanzi: e.target.value })}
                    placeholder="你好"
                    className="w-full px-4 py-2 rounded-xl text-lg font-black border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Pinyin</label>
                  <input 
                    type="text" 
                    value={vocabForm.pinyin}
                    onChange={(e) => setVocabForm({ ...vocabForm, pinyin: e.target.value })}
                    placeholder="nǐ hǎo"
                    className="w-full px-4 py-2 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Hán-Việt</label>
                  <input 
                    type="text" 
                    value={vocabForm.hanviet}
                    onChange={(e) => setVocabForm({ ...vocabForm, hanviet: e.target.value })}
                    placeholder="Nhĩ Hảo"
                    className="w-full px-4 py-2 rounded-xl text-xs border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Cấp độ HSK</label>
                  <select
                    value={vocabForm.hsk}
                    onChange={(e) => setVocabForm({ ...vocabForm, hsk: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl text-xs font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  >
                    <option value="hsk1">HSK 1</option>
                    <option value="hsk2">HSK 2</option>
                    <option value="hsk3">HSK 3</option>
                    <option value="hsk4">HSK 4</option>
                    <option value="hsk5">HSK 5</option>
                    <option value="hsk6">HSK 6</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] mb-1">Ý nghĩa tiếng Việt *</label>
                <input 
                  type="text" 
                  required 
                  value={vocabForm.meaning}
                  onChange={(e) => setVocabForm({ ...vocabForm, meaning: e.target.value })}
                  placeholder="Xin chào"
                  className="w-full px-4 py-2 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] mb-1">Câu ví dụ (tùy chọn)</label>
                <input 
                  type="text" 
                  value={vocabForm.example}
                  onChange={(e) => setVocabForm({ ...vocabForm, example: e.target.value })}
                  placeholder="你好！很高兴认识你。"
                  className="w-full px-4 py-2 rounded-xl text-xs border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => {
                    setVocabFormOpen(false);
                    setEditingVocabId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingVocab}
                  className="px-6 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingVocab && <Loader2 size={14} className="animate-spin" />}
                  <span>{isSavingVocab ? 'Đang lưu...' : (editingVocabId ? 'Cập nhật từ vựng' : 'Lưu từ vựng')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: ADD / EDIT CUSTOM LESSON */}
      {/* ============================================================== */}
      {lessonFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <BookOpen size={20} className="text-[#E85D3F]" />
                <span>{editingLessonId ? 'Chỉnh Sửa Bài Học Bổ Sung' : 'Thêm Bài Học Mới'}</span>
              </h3>
              <button 
                onClick={() => {
                  setLessonFormOpen(false);
                  setEditingLessonId(null);
                }} 
                className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#748092] mb-1">Tên bài học *</label>
                <input 
                  type="text" 
                  required 
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="Bài 5: Đi lại & Đặt vé tàu cao tốc"
                  className="w-full px-4 py-2 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Cấp độ HSK</label>
                  <select
                    value={lessonForm.level}
                    onChange={(e) => setLessonForm({ ...lessonForm, level: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl text-xs font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  >
                    <option value="Nhập môn">Nhập môn</option>
                    <option value="HSK 1">HSK 1</option>
                    <option value="HSK 2">HSK 2</option>
                    <option value="HSK 3">HSK 3</option>
                    <option value="HSK 4">HSK 4</option>
                    <option value="HSK 5">HSK 5</option>
                    <option value="HSK 6">HSK 6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Thời lượng (phút)</label>
                  <input 
                    type="number" 
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl text-xs font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] mb-1">Mô tả tóm tắt</label>
                <textarea 
                  rows={2}
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  placeholder="Mô tả nội dung bài học..."
                  className="w-full px-4 py-2 rounded-xl text-xs border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => {
                    setLessonFormOpen(false);
                    setEditingLessonId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingLesson}
                  className="px-6 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingLesson && <Loader2 size={14} className="animate-spin" />}
                  <span>{isSavingLesson ? 'Đang lưu...' : (editingLessonId ? 'Cập nhật bài học' : 'Lưu bài học')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
