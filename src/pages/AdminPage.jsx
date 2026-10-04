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
  Check
} from 'lucide-react';
import { 
  getStoredMaterials, 
  saveMaterial, 
  updateMaterial, 
  deleteMaterial, 
  resetMaterials,
  getStoredCustomVocab,
  saveCustomVocab,
  deleteCustomVocab,
  getStoredCustomLessons,
  saveCustomLesson,
  deleteCustomLesson,
  MATERIAL_CATEGORIES,
  MATERIAL_LEVELS,
  MATERIAL_FORMATS
} from '../utils/materialsStorage';
import { 
  getAllProfilesFromDb, 
  updateUserRoleAndStatusInDb, 
  deleteUserProfileFromDb,
  addMaterialToDb,
  updateMaterialInDb,
  deleteMaterialFromDb,
  updateUserProfile
} from '../supabase/services';
import { playClickSound, playSuccessSound } from '../utils/audio';

// Helper to identify and purge fake/demo accounts
function isDemoUser(u) {
  if (!u) return true;
  const id = String(u.id || '');
  const email = String(u.email || '').toLowerCase();
  const demoIds = ['user-admin-1', 'user-mod-1', 'user-stu-1', 'user-stu-2', 'user-stu-3', 'user-stu-4'];
  const demoEmails = [
    'hoang.tran@hanzigo.com',
    'mai.nguyen@gmail.com',
    'dat.le@outlook.com',
    'quynhanh.pham@yahoo.com',
    'thinh.vu.learner@gmail.com'
  ];
  return demoIds.includes(id) || 
         demoEmails.includes(email) || 
         id.startsWith('user-admin-') || 
         id.startsWith('user-mod-') || 
         id.startsWith('user-stu-');
}

const ADMIN_EMAILS = ['lehaidang16032006@gmail.com', 'admin@hanzigo.com'];

function checkIsAdmin(user) {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  return ADMIN_EMAILS.includes(email) || user.role === 'admin';
}

export default function AdminPage({ user, onUpdateUser, setActiveTab }) {
  // Current active admin sub-tab: 'users' | 'materials' | 'vocab' | 'lessons' | 'backup'
  const [adminTab, setAdminTab] = useState('users');

  // Strict Admin verification
  const isAdmin = checkIsAdmin(user);
  const currentRole = isAdmin ? 'admin' : (user?.role || 'student');

  // 1. Users Management State - Only real users (Current user & real DB profiles)
  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem('hanzigo_admin_users_directory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(u => !isDemoUser(u));
          localStorage.setItem('hanzigo_admin_users_directory', JSON.stringify(cleaned));
          return cleaned;
        }
      }
    } catch {}
    return [];
  });

  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all'); // 'all' | 'admin' | 'moderator' | 'student'
  const [userStatusFilter, setUserStatusFilter] = useState('all'); // 'all' | 'active' | 'blocked'
  const [userSortBy, setUserSortBy] = useState('xp'); // 'xp' | 'streak' | 'date' | 'name'

  // User Modals State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'student',
    level: 'HSK 1 - Sơ cấp',
    status: 'active',
    xp: 50,
    streak: 1
  });

  // Admin Name Editing State
  const [isEditingAdminName, setIsEditingAdminName] = useState(false);
  const [adminNameInput, setAdminNameInput] = useState(user?.name || 'Lê Hải Đăng');
  const [isSavingAdminName, setIsSavingAdminName] = useState(false);

  useEffect(() => {
    if (!isEditingAdminName && user?.name) {
      setAdminNameInput(user.name);
    }
  }, [user?.name, isEditingAdminName]);

  // 2. Materials Management State
  const [materials, setMaterials] = useState(() => getStoredMaterials());
  const [matSearch, setMatSearch] = useState('');
  const [matCategoryFilter, setMatCategoryFilter] = useState('Tất cả');
  const [matLevelFilter, setMatLevelFilter] = useState('Tất cả');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMatId, setEditingMatId] = useState(null);
  const [matForm, setMatForm] = useState({
    title: '',
    category: 'Giáo trình chuẩn',
    level: 'HSK 1',
    format: 'PDF',
    fileSize: '10 MB',
    author: 'HanziGo Biên soạn',
    description: '',
    downloadUrl: '',
    tags: '',
    isFeatured: false,
    isHidden: false
  });

  // 3. Custom Vocab State
  const [customVocab, setCustomVocab] = useState(() => getStoredCustomVocab());
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

  // 4. Custom Lesson State
  const [customLessons, setCustomLessons] = useState(() => getStoredCustomLessons());
  const [lessonFormOpen, setLessonFormOpen] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    level: 'HSK 1',
    duration: '20',
    xp: '50',
    description: '',
    grammarPoints: ''
  });

  // Notifications
  const [toastMsg, setToastMsg] = useState(null);

  // Sync users with Supabase on mount
  useEffect(() => {
    async function loadCloudProfiles() {
      try {
        const cloudProfiles = await getAllProfilesFromDb();
        if (Array.isArray(cloudProfiles) && cloudProfiles.length > 0) {
          setUsersList(prev => {
            const combinedMap = new Map();
            // Start with current local users (clean demo users)
            prev.filter(u => !isDemoUser(u)).forEach(u => combinedMap.set(u.email || u.id, u));
            // Merge cloud profiles (clean demo users)
            cloudProfiles.filter(cp => !isDemoUser(cp)).forEach(cp => {
              const key = cp.email || cp.id;
              const existing = combinedMap.get(key) || {};
              combinedMap.set(key, {
                ...existing,
                id: cp.id,
                name: cp.name || existing.name || 'Học viên',
                email: cp.email || existing.email || '',
                role: cp.role || existing.role || 'student',
                level: cp.level || existing.level || 'HSK 1 - Sơ cấp',
                xp: cp.xp !== undefined ? cp.xp : (existing.xp || 50),
                streak: cp.streak !== undefined ? cp.streak : (existing.streak || 1),
                wordsLearned: cp.words_learned || existing.wordsLearned || 0,
                status: cp.status || existing.status || 'active',
                avatar: cp.avatar || existing.avatar || null,
                joinedDate: cp.created_at ? cp.created_at.split('T')[0] : (existing.joinedDate || '2026-01-01'),
                lastActive: 'Gần đây'
              });
            });
            const merged = Array.from(combinedMap.values());
            localStorage.setItem('hanzigo_admin_users_directory', JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn('Notice loading Supabase profiles:', err);
      }
    }
    loadCloudProfiles();
  }, []);

  // Sync current user into directory if missing
  useEffect(() => {
    if (user && user.email) {
      setUsersList(prev => {
        const cleaned = prev.filter(u => !isDemoUser(u));
        const idx = cleaned.findIndex(u => u.email === user.email || u.id === user.uid || u.id === user.id);
        if (idx >= 0) {
          const updated = [...cleaned];
          updated[idx] = {
            ...updated[idx],
            name: user.name || updated[idx].name,
            level: user.level || updated[idx].level,
            avatar: user.avatar || updated[idx].avatar,
            role: currentRole
          };
          localStorage.setItem('hanzigo_admin_users_directory', JSON.stringify(updated));
          return updated;
        } else {
          const newEntry = {
            id: user.uid || user.id || `user-${Date.now()}`,
            name: user.name || 'Học viên HanziGo',
            email: user.email,
            role: currentRole,
            level: user.level || 'HSK 1 - Sơ cấp',
            xp: user.xp || 100,
            streak: user.streak || 1,
            wordsLearned: user.wordsLearned || 20,
            status: 'active',
            avatar: user.avatar || null,
            joinedDate: new Date().toISOString().split('T')[0],
            lastActive: 'Vừa xong'
          };
          const updated = [newEntry, ...cleaned];
          localStorage.setItem('hanzigo_admin_users_directory', JSON.stringify(updated));
          return updated;
        }
      });
    }
  }, [user, currentRole]);

  // Persist usersList changes
  const saveUsersList = (newList) => {
    setUsersList(newList);
    try {
      localStorage.setItem('hanzigo_admin_users_directory', JSON.stringify(newList));
    } catch {}
  };

  const showToast = (message, type = 'success') => {
    setToastMsg({ message, type });
    playSuccessSound();
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Save edited Admin Name to local state, localStorage & Supabase
  const handleSaveAdminName = async (e) => {
    if (e) e.preventDefault();
    const newName = adminNameInput.trim();
    if (!newName) {
      alert('Vui lòng nhập tên quản trị viên!');
      return;
    }
    setIsSavingAdminName(true);

    const updatedUser = {
      ...(user || {}),
      name: newName
    };

    // 1. Update localStorage
    try {
      localStorage.setItem('hanzigo_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    // 2. Sync to Supabase profiles
    const uid = user?.uid || user?.id;
    if (uid) {
      try {
        await updateUserProfile(uid, { name: newName });
      } catch (err) {
        console.warn('Supabase profile name sync warning:', err);
      }
    }

    // 3. Update global user in App.jsx
    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    // 4. Update in local directory if present
    setUsersList(prev => prev.map(u => 
      (u.id === uid || u.email === user?.email || (user?.email && u.email?.toLowerCase() === user.email.toLowerCase()))
        ? { ...u, name: newName }
        : u
    ));

    setIsSavingAdminName(false);
    setIsEditingAdminName(false);
    showToast(`Đã đổi tên quản trị viên thành: "${newName}" thành công!`);
  };

  // -------------------------------------------------------------
  // USER MANAGEMENT ACTIONS
  // -------------------------------------------------------------
  const handleChangeUserRole = async (targetUser, newRole) => {
    if (currentRole !== 'admin') {
      alert('Chỉ Quản trị viên (Admin) mới có quyền thay đổi vai trò người dùng!');
      return;
    }
    playClickSound();
    const updated = usersList.map(u => u.id === targetUser.id ? { ...u, role: newRole } : u);
    saveUsersList(updated);
    
    // Sync to Supabase
    await updateUserRoleAndStatusInDb(targetUser.id, { role: newRole });

    // Update active user state if modifying self
    if (user && (user.id === targetUser.id || user.email === targetUser.email)) {
      if (onUpdateUser) {
        onUpdateUser({ ...user, role: newRole });
      }
    }
    showToast(`Đã đổi quyền cho ${targetUser.name} thành ${newRole.toUpperCase()}!`);
  };

  const handleToggleUserStatus = async (targetUser) => {
    if (currentRole !== 'admin') {
      alert('Chỉ Quản trị viên (Admin) mới có quyền khóa/mở khóa tài khoản!');
      return;
    }
    playClickSound();
    const nextStatus = targetUser.status === 'blocked' ? 'active' : 'blocked';
    const updated = usersList.map(u => u.id === targetUser.id ? { ...u, status: nextStatus } : u);
    saveUsersList(updated);

    // Sync to Supabase
    await updateUserRoleAndStatusInDb(targetUser.id, { status: nextStatus });

    showToast(`Đã ${nextStatus === 'blocked' ? 'khóa' : 'mở khóa'} tài khoản: ${targetUser.name}!`);
  };

  const handleDeleteUser = async (targetUser) => {
    if (currentRole !== 'admin') {
      alert('Chỉ Quản trị viên (Admin) mới có quyền xóa người dùng!');
      return;
    }
    if (window.confirm(`Xác nhận xóa tài khoản "${targetUser.name}" (${targetUser.email}) khỏi hệ thống?`)) {
      playClickSound();
      const updated = usersList.filter(u => u.id !== targetUser.id);
      saveUsersList(updated);
      await deleteUserProfileFromDb(targetUser.id);
      showToast(`Đã xóa tài khoản: ${targetUser.name}!`);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) {
      alert('Vui lòng nhập họ tên và email người dùng!');
      return;
    }
    playClickSound();
    const created = {
      id: `user-${Date.now()}`,
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      role: newUserForm.role,
      level: newUserForm.level,
      xp: Number(newUserForm.xp) || 50,
      streak: Number(newUserForm.streak) || 1,
      wordsLearned: 0,
      status: newUserForm.status,
      avatar: null,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Vừa tạo'
    };
    const updated = [created, ...usersList];
    saveUsersList(updated);
    setIsAddUserModalOpen(false);
    setNewUserForm({
      name: '',
      email: '',
      role: 'student',
      level: 'HSK 1 - Sơ cấp',
      status: 'active',
      xp: 50,
      streak: 1
    });
    showToast(`Đã tạo tài khoản mới: ${created.name}!`);
  };

  const handleOpenEditUser = (u) => {
    playClickSound();
    setEditingUser(u);
    setIsEditUserModalOpen(true);
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser.name.trim()) return;
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
    setEditingUser(null);
    showToast(`Cập nhật thông tin ${editingUser.name} thành công!`);
  };

  // -------------------------------------------------------------
  // MATERIAL ACTIONS
  // -------------------------------------------------------------
  const handleOpenCreateMat = () => {
    playClickSound();
    setEditingMatId(null);
    setMatForm({
      title: '',
      category: 'Giáo trình chuẩn',
      level: 'HSK 1',
      format: 'PDF',
      fileSize: '15 MB',
      author: 'HanziGo Biên soạn',
      description: '',
      downloadUrl: '',
      tags: '',
      isFeatured: false,
      isHidden: false
    });
    setIsFormOpen(true);
  };

  const handleOpenEditMat = (mat) => {
    playClickSound();
    setEditingMatId(mat.id);
    setMatForm({
      title: mat.title,
      category: mat.category,
      level: mat.level,
      format: mat.format,
      fileSize: mat.fileSize || '10 MB',
      author: mat.author || 'HanziGo Biên soạn',
      description: mat.description || '',
      downloadUrl: mat.downloadUrl || '',
      tags: Array.isArray(mat.tags) ? mat.tags.join(', ') : (mat.tags || ''),
      isFeatured: Boolean(mat.isFeatured),
      isHidden: Boolean(mat.isHidden)
    });
    setIsFormOpen(true);
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    if (!matForm.title.trim() || !matForm.downloadUrl.trim()) {
      alert('Vui lòng điền tiêu đề tài liệu và đường dẫn tải / xem!');
      return;
    }

    const tagsArray = matForm.tags
      ? matForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [matForm.level, matForm.format];

    if (editingMatId) {
      const updated = updateMaterial(editingMatId, {
        ...matForm,
        tags: tagsArray
      });
      setMaterials(updated);
      await updateMaterialInDb(editingMatId, { ...matForm, tags: tagsArray });
      showToast('Cập nhật tài liệu thành công!');
    } else {
      const updated = saveMaterial({
        ...matForm,
        tags: tagsArray
      });
      setMaterials(updated);
      await addMaterialToDb({ ...matForm, tags: tagsArray });
      showToast('Thêm tài liệu mới vào hệ thống thành công!');
    }

    setIsFormOpen(false);
    setEditingMatId(null);
  };

  const handleDeleteMaterial = async (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài liệu: "${title}"?`)) {
      playClickSound();
      const updated = deleteMaterial(id);
      setMaterials(updated);
      await deleteMaterialFromDb(id);
      showToast('Đã xóa tài liệu khỏi hệ thống!');
    }
  };

  const handleTogglePinMaterial = (mat) => {
    playClickSound();
    const updated = updateMaterial(mat.id, { isFeatured: !mat.isFeatured });
    setMaterials(updated);
    showToast(`${mat.isFeatured ? 'Bỏ ghim' : 'Ghim nổi bật'} tài liệu: ${mat.title}!`);
  };

  const handleToggleHideMaterial = (mat) => {
    playClickSound();
    const updated = updateMaterial(mat.id, { isHidden: !mat.isHidden });
    setMaterials(updated);
    showToast(`${mat.isHidden ? 'Đã hiển thị' : 'Đã tạm ẩn'} tài liệu: ${mat.title}!`);
  };

  const handleResetMaterials = () => {
    if (window.confirm('Khôi phục danh sách tài liệu chuẩn mặc định của HanziGo?')) {
      playClickSound();
      const def = resetMaterials();
      setMaterials(def);
      showToast('Đã khôi phục kho tài liệu chuẩn!');
    }
  };

  // -------------------------------------------------------------
  // VOCAB ACTIONS
  // -------------------------------------------------------------
  const handleSaveVocab = (e) => {
    e.preventDefault();
    if (!vocabForm.hanzi.trim() || !vocabForm.meaning.trim()) {
      alert('Vui lòng điền chữ Hán và ý nghĩa tiếng Việt!');
      return;
    }
    const updated = saveCustomVocab(vocabForm);
    setCustomVocab(updated);
    showToast(`Đã thêm từ vựng mới: ${vocabForm.hanzi}!`);
    setVocabFormOpen(false);
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
  };

  const handleDeleteVocab = (id, hanzi) => {
    if (window.confirm(`Xóa từ vựng: ${hanzi}?`)) {
      playClickSound();
      const updated = deleteCustomVocab(id);
      setCustomVocab(updated);
      showToast('Đã xóa từ vựng!');
    }
  };

  // -------------------------------------------------------------
  // LESSON ACTIONS
  // -------------------------------------------------------------
  const handleSaveLesson = (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) {
      alert('Vui lòng nhập tên bài học!');
      return;
    }
    const updated = saveCustomLesson(lessonForm);
    setCustomLessons(updated);
    showToast(`Đã thêm bài học mới: ${lessonForm.title}!`);
    setLessonFormOpen(false);
    setLessonForm({
      title: '',
      level: 'HSK 1',
      duration: '20',
      xp: '50',
      description: '',
      grammarPoints: ''
    });
  };

  const handleDeleteLesson = (id, title) => {
    if (window.confirm(`Xóa bài học: ${title}?`)) {
      playClickSound();
      const updated = deleteCustomLesson(id);
      setCustomLessons(updated);
      showToast('Đã xóa bài học!');
    }
  };

  // Export JSON Backup
  const handleExportData = () => {
    playClickSound();
    const backupData = {
      version: '2.0',
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
    link.download = `HanziGo_Admin_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Đã xuất file sao lưu dữ liệu toàn hệ thống!');
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchSearch = !userSearch.trim() || 
        u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.level.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      const matchStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
      return matchSearch && matchRole && matchStatus;
    }).sort((a, b) => {
      if (userSortBy === 'xp') return (b.xp || 0) - (a.xp || 0);
      if (userSortBy === 'streak') return (b.streak || 0) - (a.streak || 0);
      if (userSortBy === 'name') return a.name.localeCompare(b.name);
      return (b.joinedDate || '').localeCompare(a.joinedDate || '');
    });
  }, [usersList, userSearch, userRoleFilter, userStatusFilter, userSortBy]);

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

  // Total User Stats
  const userStats = useMemo(() => {
    const total = usersList.length;
    const admins = usersList.filter(u => u.role === 'admin').length;
    const mods = usersList.filter(u => u.role === 'moderator').length;
    const active = usersList.filter(u => u.status === 'active').length;
    const blocked = usersList.filter(u => u.status === 'blocked').length;
    const totalXp = usersList.reduce((acc, cur) => acc + (cur.xp || 0), 0);
    return { total, admins, mods, active, blocked, totalXp };
  }, [usersList]);

  // -------------------------------------------------------------
  // ACCESS GATE IF NOT AUTHORIZED ADMIN
  // -------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 shadow-inner">
            <Lock size={40} />
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900">
              <Shield size={14} />
              <span>Khu vực Quản trị Bảo mật (Admin Only)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">
              Quyền Truy Cập Bị Giới Hạn
            </h2>
            <p className="text-sm text-[#748092] dark:text-[#94A3B8] leading-relaxed">
              Trang này chỉ dành riêng cho tài khoản Quản trị viên hệ thống HanziGo (<strong className="text-[#E85D3F]">lehaidang16032006@gmail.com</strong>).
            </p>
            {user ? (
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Tài khoản hiện tại của bạn: <span className="font-semibold text-[#243447] dark:text-white">{user.email}</span> (Không có quyền quản trị).
              </p>
            ) : (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                Bạn chưa đăng nhập. Vui lòng đăng nhập với tài khoản Quản trị viên để truy cập.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('home')}
              className="px-6 py-3 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#E85D3F]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowRight size={16} className="rotate-180" />
              <span>Quay về Trang chủ</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl border border-white/10 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 size={18} className="text-[#45B97C]" />
          <span>{toastMsg.message}</span>
        </div>
      )}

      {/* 1. Header Banner & RBAC Role Switcher */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white p-6 sm:p-8 border border-white/10 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-[#E85D3F]/20 text-[#E85D3F] border border-[#E85D3F]/30">
                <ShieldCheck size={14} />
                Trung Tâm Quản Trị Hệ Thống
              </span>

              {/* Current Role Badge */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                currentRole === 'admin'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
              }`}>
                {currentRole === 'admin' ? <Crown size={13} /> : <Shield size={13} />}
                <span>Vai trò: {currentRole === 'admin' ? 'Quản trị viên (Toàn quyền)' : 'Kiểm duyệt viên (Moderator)'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Quản Lý Người Dùng & Kho Tài Liệu
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Theo dõi và phân quyền học viên, quản lý tài liệu học tiếng Trung, duyệt bài học và sao lưu dữ liệu toàn diện trên nền tảng HanziGo.
            </p>
          </div>

          {/* Authenticated Admin Identity Badge & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {isEditingAdminName ? (
              <form 
                onSubmit={handleSaveAdminName}
                className="p-2 px-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-emerald-400/40 flex items-center gap-2.5 shadow-xl shadow-black/25 animate-in fade-in zoom-in-95 duration-200"
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
                    className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-emerald-400 w-36 sm:w-48 placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={isSavingAdminName}
                    title="Lưu tên mới"
                    className="p-1.5 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white transition-all cursor-pointer flex items-center justify-center disabled:opacity-50 shadow-md font-bold text-xs gap-1"
                  >
                    <Check size={14} />
                    <span className="hidden sm:inline">Lưu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminNameInput(user?.name || 'Lê Hải Đăng');
                      setIsEditingAdminName(false);
                    }}
                    title="Hủy"
                    className="p-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-gray-300 transition-all cursor-pointer flex items-center justify-center text-xs"
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
                  <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Quản trị viên xác thực:</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs sm:text-sm font-black text-white truncate max-w-[150px] sm:max-w-[210px]">
                      {user?.name || 'Lê Hải Đăng'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminNameInput(user?.name || 'Lê Hải Đăng');
                        setIsEditingAdminName(true);
                      }}
                      title="Chỉnh sửa họ tên quản trị viên"
                      className="p-1 rounded-lg bg-white/10 hover:bg-emerald-500/30 text-gray-300 hover:text-emerald-300 transition-all cursor-pointer flex items-center justify-center"
                    >
                      <Edit3 size={12} />
                    </button>
                  </div>
                  <p className="text-[10px] font-medium text-gray-400 truncate max-w-[180px] sm:max-w-[230px]">
                    {user?.email || 'lehaidang16032006@gmail.com'}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleExportData}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Download size={15} />
              <span>Sao lưu dữ liệu</span>
            </button>
          </div>
        </div>

        {/* System Overview KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-xs text-[#94A3B8] font-semibold flex items-center gap-1.5">
              <Users size={14} className="text-[#E85D3F]" />
              <span>Tổng học viên</span>
            </p>
            <p className="text-2xl font-black text-white mt-1">{userStats.total}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-xs text-[#94A3B8] font-semibold flex items-center gap-1.5">
              <Crown size={14} className="text-emerald-400" />
              <span>Quản trị & Mod</span>
            </p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{userStats.admins + userStats.mods}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-xs text-[#94A3B8] font-semibold flex items-center gap-1.5">
              <FileText size={14} className="text-[#F4B942]" />
              <span>Tài liệu hệ thống</span>
            </p>
            <p className="text-2xl font-black text-[#F4B942] mt-1">{materials.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-xs text-[#94A3B8] font-semibold flex items-center gap-1.5">
              <Activity size={14} className="text-sky-400" />
              <span>Tổng điểm tích lũy</span>
            </p>
            <p className="text-2xl font-black text-sky-400 mt-1">{userStats.totalXp.toLocaleString()} XP</p>
          </div>
        </div>
      </div>

      {/* 2. Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-2 overflow-x-auto">
        <button
          onClick={() => {
            playClickSound();
            setAdminTab('users');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === 'users'
              ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
              : 'text-[#748092] dark:text-[#94A3B8] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Users size={16} />
          <span>Quản lý Người dùng ({usersList.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setAdminTab('materials');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === 'materials'
              ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
              : 'text-[#748092] dark:text-[#94A3B8] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <FileText size={16} />
          <span>Kho Tài liệu & Giáo trình ({materials.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setAdminTab('vocab');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === 'vocab'
              ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
              : 'text-[#748092] dark:text-[#94A3B8] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Layers size={16} />
          <span>Từ vựng tùy chỉnh ({customVocab.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setAdminTab('lessons');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === 'lessons'
              ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
              : 'text-[#748092] dark:text-[#94A3B8] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <BookOpen size={16} />
          <span>Bài học lộ trình ({customLessons.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setAdminTab('backup');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === 'backup'
              ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
              : 'text-[#748092] dark:text-[#94A3B8] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Upload size={16} />
          <span>Sao lưu & Hệ thống</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: USER MANAGEMENT (QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN) */}
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

              {/* Action: Add User */}
              {currentRole === 'admin' ? (
                <button
                  onClick={() => {
                    playClickSound();
                    setIsAddUserModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
                >
                  <Plus size={16} />
                  <span>Tạo tài khoản học viên</span>
                </button>
              ) : (
                <div className="px-3 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-1.5">
                  <Shield size={14} />
                  <span>Chế độ xem (Mod)</span>
                </div>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#748092] dark:text-[#94A3B8]">Vai trò:</span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'admin', label: 'Quản trị viên' },
                  { id: 'moderator', label: 'Kiểm duyệt viên' },
                  { id: 'student', label: 'Học viên' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setUserRoleFilter(r.id)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${
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
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${
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
                    <th className="p-4 pl-6">Học viên</th>
                    <th className="p-4">Phân quyền</th>
                    <th className="p-4">Cấp độ học</th>
                    <th className="p-4 text-center">Chuỗi ngày</th>
                    <th className="p-4 text-right">Điểm XP</th>
                    <th className="p-4 text-center">Trạng thái</th>
                    <th className="p-4 pr-6 text-right">Thao tác quản trị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-[#748092]">
                        {usersList.length === 0 ? (
                          <div className="space-y-3 max-w-sm mx-auto">
                            <Users size={32} className="mx-auto text-[#748092]/50" />
                            <p className="font-bold text-[#243447] dark:text-white text-base">Chưa có học viên nào</p>
                            <p className="text-xs">Học viên khi đăng ký hoặc đăng nhập sẽ tự động hiển thị trong danh bạ quản trị này.</p>
                            {currentRole === 'admin' && (
                              <button
                                onClick={() => setIsAddUserModalOpen(true)}
                                className="px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                              >
                                <Plus size={14} />
                                <span>Tạo tài khoản học viên mới</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          'Không tìm thấy học viên nào phù hợp với bộ lọc tìm kiếm.'
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isAdmin = u.role === 'admin';
                      const isMod = u.role === 'moderator';
                      const isBlocked = u.status === 'blocked';

                      return (
                        <tr 
                          key={u.id}
                          className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                        >
                          {/* User Name & Email */}
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              {u.avatar ? (
                                <img 
                                  src={u.avatar} 
                                  alt={u.name}
                                  className="w-10 h-10 rounded-2xl object-cover border border-[#F1E5D8] dark:border-[#2B3A4F]" 
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] text-white font-black flex items-center justify-center text-sm shadow-sm">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {user && (user.id === u.id || user.email === u.email) && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-bold">
                                      Bạn
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Role Badge & Quick Switch */}
                          <td className="p-4">
                            {currentRole === 'admin' ? (
                              <select
                                value={u.role}
                                onChange={(e) => handleChangeUserRole(u, e.target.value)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  isAdmin
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                    : isMod
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
                                    : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                                }`}
                              >
                                <option value="admin">👑 Admin (Quản trị)</option>
                                <option value="moderator">🛡️ Moderator (Kiểm duyệt)</option>
                                <option value="student">🎓 Student (Học viên)</option>
                              </select>
                            ) : (
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border ${
                                isAdmin
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                                  : isMod
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300'
                                  : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300'
                              }`}>
                                {isAdmin ? <Crown size={12} /> : isMod ? <Shield size={12} /> : null}
                                <span>{isAdmin ? 'Admin' : isMod ? 'Moderator' : 'Học viên'}</span>
                              </span>
                            )}
                          </td>

                          {/* Study Level */}
                          <td className="p-4">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white">
                              {u.level}
                            </span>
                          </td>

                          {/* Streak */}
                          <td className="p-4 text-center">
                            <span className="font-bold text-[#E85D3F] flex items-center justify-center gap-1">
                              🔥 {u.streak || 0}
                            </span>
                          </td>

                          {/* XP */}
                          <td className="p-4 text-right font-black text-[#45B97C]">
                            {(u.xp || 0).toLocaleString()} XP
                          </td>

                          {/* Status */}
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isBlocked
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                              <span>{isBlocked ? 'Đã khóa' : 'Hoạt động'}</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* Edit User Button */}
                              <button
                                onClick={() => handleOpenEditUser(u)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-[#E85D3F] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                                title="Chỉnh sửa thông tin học viên"
                              >
                                <Edit3 size={15} />
                              </button>

                              {/* Lock / Unlock Toggle Button */}
                              {currentRole === 'admin' && (
                                <button
                                  onClick={() => handleToggleUserStatus(u)}
                                  className={`p-1.5 rounded-lg transition-all ${
                                    isBlocked
                                      ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                      : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                  }`}
                                  title={isBlocked ? 'Mở khóa tài khoản' : 'Tạm khóa tài khoản'}
                                >
                                  {isBlocked ? <Unlock size={15} /> : <Lock size={15} />}
                                </button>
                              )}

                              {/* Delete User Button */}
                              {currentRole === 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                                  title="Xóa tài khoản vĩnh viễn"
                                >
                                  <Trash2 size={15} />
                                </button>
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

            {/* Table Footer Summary */}
            <div className="p-4 bg-[#FFF9F2] dark:bg-[#131B24] border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center justify-between gap-3 text-xs text-[#748092] dark:text-[#94A3B8]">
              <span>Hiển thị <strong>{filteredUsers.length}</strong> / <strong>{usersList.length}</strong> tài khoản học viên</span>
              <div className="flex items-center gap-4">
                <span>🟢 {userStats.active} Đang hoạt động</span>
                <span>🔴 {userStats.blocked} Bị khóa</span>
                <span>👑 {userStats.admins} Quản trị viên</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MATERIALS MANAGEMENT (QUẢN LÝ KHO TÀI LIỆU) */}
      {/* ============================================================== */}
      {adminTab === 'materials' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Materials Filter and Action Toolbar */}
          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              
              {/* Search input */}
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

              {/* Add Material Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenCreateMat}
                  className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
                >
                  <Plus size={16} />
                  <span>Thêm tài liệu mới</span>
                </button>

                <button
                  onClick={handleResetMaterials}
                  className="px-3.5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-[#131B24] dark:hover:bg-gray-800 text-[#748092] dark:text-[#94A3B8] text-xs font-bold transition-all"
                  title="Khôi phục kho mẫu chuẩn"
                >
                  <RefreshCw size={15} />
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
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${
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

          {/* Materials Table */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#FFF9F2] dark:bg-[#131B24] border-b border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8] font-bold">
                    <th className="p-4 pl-6">Tài liệu & Giáo trình</th>
                    <th className="p-4">Danh mục</th>
                    <th className="p-4">Cấp độ</th>
                    <th className="p-4">Định dạng & Dung lượng</th>
                    <th className="p-4 text-center">Nổi bật / Trạng thái</th>
                    <th className="p-4 pr-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
                  {filteredMaterials.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-[#748092]">
                        Không tìm thấy tài liệu nào phù hợp với bộ lọc tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    filteredMaterials.map((m) => (
                      <tr 
                        key={m.id}
                        className={`hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors ${
                          m.isHidden ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Title and Author */}
                        <td className="p-4 pl-6 max-w-sm">
                          <div className="space-y-1">
                            <p className="font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
                              {m.isFeatured && (
                                <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />
                              )}
                              <span>{m.title}</span>
                            </p>
                            <p className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-1">
                              {m.description || m.author || 'Tài liệu chuẩn'}
                            </p>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4 font-semibold text-[#748092] dark:text-[#94A3B8]">
                          {m.category}
                        </td>

                        {/* Level */}
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C]">
                            {m.level}
                          </span>
                        </td>

                        {/* Format & Size */}
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white">
                              {m.format}
                            </span>
                            <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">{m.fileSize || '10 MB'}</p>
                          </div>
                        </td>

                        {/* Featured and Visibility Toggles */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleTogglePinMaterial(m)}
                              className={`p-1.5 rounded-lg transition-all ${
                                m.isFeatured 
                                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' 
                                  : 'text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
                              }`}
                              title={m.isFeatured ? 'Bỏ ghim nổi bật' : 'Ghim nổi bật cho học viên'}
                            >
                              <Star size={14} className={m.isFeatured ? 'fill-amber-500' : ''} />
                            </button>

                            <button
                              onClick={() => handleToggleHideMaterial(m)}
                              className={`p-1.5 rounded-lg transition-all ${
                                m.isHidden
                                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                                  : 'text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
                              }`}
                              title={m.isHidden ? 'Hiển thị tài liệu' : 'Ẩn tài liệu'}
                            >
                              {m.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Direct Open Link */}
                            {m.downloadUrl && (
                              <a
                                href={m.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-gray-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-all"
                                title="Mở link tải / xem tài liệu"
                              >
                                <ExternalLink size={15} />
                              </a>
                            )}

                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditMat(m)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-[#E85D3F] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                              title="Chỉnh sửa tài liệu"
                            >
                              <Edit3 size={15} />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteMaterial(m.id, m.title)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                              title="Xóa tài liệu"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 bg-[#FFF9F2] dark:bg-[#131B24] border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center justify-between gap-3 text-xs text-[#748092] dark:text-[#94A3B8]">
              <span>Hiển thị <strong>{filteredMaterials.length}</strong> / <strong>{materials.length}</strong> tài liệu</span>
              <span>⭐ {materials.filter(m => m.isFeatured).length} Tài liệu được ghim nổi bật</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: CUSTOM VOCABULARY */}
      {/* ============================================================== */}
      {adminTab === 'vocab' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
            <div>
              <h3 className="text-base font-black text-[#243447] dark:text-white">Từ vựng tự biên soạn</h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">Thêm từ mới vào từ điển hệ thống để học viên cùng luyện tập.</p>
            </div>
            <button
              onClick={() => {
                playClickSound();
                setVocabFormOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus size={16} />
              <span>Thêm từ vựng mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customVocab.map((v) => (
              <div 
                key={v.id} 
                className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-[#E85D3F]">{v.hanzi}</span>
                    <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">({v.pinyin})</span>
                  </div>
                  <p className="text-sm font-bold text-[#243447] dark:text-white">{v.meaning}</p>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8]">{v.topic} • {v.hsk?.toUpperCase()}</p>
                </div>
                <button
                  onClick={() => handleDeleteVocab(v.id, v.hanzi)}
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                  title="Xóa từ vựng"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: CUSTOM LESSONS */}
      {/* ============================================================== */}
      {adminTab === 'lessons' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
            <div>
              <h3 className="text-base font-black text-[#243447] dark:text-white">Bài học lộ trình tùy chỉnh</h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">Tạo bài giảng mới tích hợp vào chặng học HSK của ứng dụng.</p>
            </div>
            <button
              onClick={() => {
                playClickSound();
                setLessonFormOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus size={16} />
              <span>Thêm bài học mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customLessons.map((l) => (
              <div 
                key={l.id}
                className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex items-start justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E85D3F]/10 text-[#E85D3F]">
                      {l.level}
                    </span>
                    <span className="text-xs text-[#748092]">{l.duration} phút • {l.xp} XP</span>
                  </div>
                  <h4 className="text-base font-black text-[#243447] dark:text-white">{l.title}</h4>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8]">{l.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteLesson(l.id, l.title)}
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                  title="Xóa bài học"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: BACKUP & SYSTEM */}
      {/* ============================================================== */}
      {adminTab === 'backup' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] p-8 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <Upload size={20} className="text-[#E85D3F]" />
                <span>Sao Lưu & Đồng Bộ Hệ Thống</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] mt-1">
                Xuất toàn bộ cơ sở dữ liệu học tập gồm Người dùng, Kho tài liệu, Từ vựng và Bài giảng để lưu trữ an toàn hoặc chuyển giao dữ liệu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                <h4 className="font-bold text-[#243447] dark:text-white text-sm">Xuất bản sao lưu (Export JSON)</h4>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                  Tải về tệp JSON chứa tất cả {materials.length} tài liệu, {usersList.length} người dùng, {customVocab.length} từ vựng tùy chỉnh.
                </p>
                <button
                  onClick={handleExportData}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/25 flex items-center gap-2"
                >
                  <Download size={15} />
                  <span>Tải file sao lưu ngay</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                <h4 className="font-bold text-[#243447] dark:text-white text-sm">Khôi phục kho tài liệu chuẩn</h4>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                  Đặt lại danh mục giáo trình HSK, sách ngữ pháp và tài liệu mẫu chính thức của HanziGo.
                </p>
                <button
                  onClick={handleResetMaterials}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-[#243447] dark:text-white text-xs font-bold flex items-center gap-2"
                >
                  <RefreshCw size={15} />
                  <span>Khôi phục mẫu chuẩn</span>
                </button>
              </div>
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
                <span>Tạo Tài Khoản Học Viên Mới</span>
              </h3>
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                  Họ và tên học viên *
                </label>
                <input 
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="Ví dụ: Hoàng Đức Anh"
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
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
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Phân quyền (Role)
                  </label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  >
                    <option value="student">🎓 Học viên (Student)</option>
                    <option value="moderator">🛡️ Kiểm duyệt (Moderator)</option>
                    <option value="admin">👑 Quản trị viên (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Cấp độ học ban đầu
                  </label>
                  <select
                    value={newUserForm.level}
                    onChange={(e) => setNewUserForm({ ...newUserForm, level: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  >
                    <option value="Nhập môn - Pinyin">Nhập môn - Pinyin</option>
                    <option value="HSK 1 - Sơ cấp">HSK 1 - Sơ cấp</option>
                    <option value="HSK 2 - Sơ cấp nâng cao">HSK 2 - Sơ cấp nâng cao</option>
                    <option value="HSK 3 - Trung cấp 1">HSK 3 - Trung cấp 1</option>
                    <option value="HSK 4 - Trung cấp 2">HSK 4 - Trung cấp 2</option>
                    <option value="HSK 5 - Cao cấp 1">HSK 5 - Cao cấp 1</option>
                    <option value="HSK 6 - Cao cấp 2">HSK 6 - Cao cấp 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Điểm XP khởi tạo
                  </label>
                  <input 
                    type="number"
                    value={newUserForm.xp}
                    onChange={(e) => setNewUserForm({ ...newUserForm, xp: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Chuỗi Streak ban đầu
                  </label>
                  <input 
                    type="number"
                    value={newUserForm.streak}
                    onChange={(e) => setNewUserForm({ ...newUserForm, streak: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EDIT USER MODAL */}
      {/* ============================================================== */}
      {isEditUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <Edit3 size={20} className="text-[#E85D3F]" />
                <span>Chỉnh Sửa Thông Tin Học Viên</span>
              </h3>
              <button 
                onClick={() => setIsEditUserModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-black/5 dark:hover:bg-white/5"
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
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                  Địa chỉ Email
                </label>
                <input 
                  type="email"
                  disabled
                  value={editingUser.email}
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Phân quyền (Role)
                  </label>
                  <select
                    disabled={currentRole !== 'admin'}
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  >
                    <option value="student">🎓 Học viên</option>
                    <option value="moderator">🛡️ Kiểm duyệt</option>
                    <option value="admin">👑 Quản trị viên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Trạng thái
                  </label>
                  <select
                    disabled={currentRole !== 'admin'}
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  >
                    <option value="active">🟢 Đang hoạt động</option>
                    <option value="blocked">🔴 Tạm khóa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Cấp độ HSK
                  </label>
                  <input 
                    type="text"
                    value={editingUser.level}
                    onChange={(e) => setEditingUser({ ...editingUser, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Điểm XP
                  </label>
                  <input 
                    type="number"
                    value={editingUser.xp}
                    onChange={(e) => setEditingUser({ ...editingUser, xp: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Chuỗi Streak
                  </label>
                  <input 
                    type="number"
                    value={editingUser.streak}
                    onChange={(e) => setEditingUser({ ...editingUser, streak: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: ADD / EDIT MATERIAL MODAL */}
      {/* ============================================================== */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-2xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                {editingMatId ? <Edit3 size={20} className="text-[#E85D3F]" /> : <FileText size={20} className="text-[#E85D3F]" />}
                <span>{editingMatId ? 'Chỉnh Sửa Tài Liệu Học' : 'Thêm Tài Liệu Mới Vào Kho'}</span>
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                  Tiêu đề tài liệu / Tên sách giáo trình *
                </label>
                <input 
                  type="text"
                  required
                  value={matForm.title}
                  onChange={(e) => setMatForm({ ...matForm, title: e.target.value })}
                  placeholder="Ví dụ: Giáo trình Chuẩn HSK 4 - Trọn bộ bài học & Audio"
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Danh mục tài liệu
                  </label>
                  <select
                    value={matForm.category}
                    onChange={(e) => setMatForm({ ...matForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  >
                    {MATERIAL_CATEGORIES.filter(c => c !== 'Tất cả').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Trình độ HSK
                  </label>
                  <select
                    value={matForm.level}
                    onChange={(e) => setMatForm({ ...matForm, level: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  >
                    {MATERIAL_LEVELS.filter(l => l !== 'Tất cả').map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Định dạng file
                  </label>
                  <select
                    value={matForm.format}
                    onChange={(e) => setMatForm({ ...matForm, format: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  >
                    {MATERIAL_FORMATS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Tác giả / Nhà xuất bản
                  </label>
                  <input 
                    type="text"
                    value={matForm.author}
                    onChange={(e) => setMatForm({ ...matForm, author: e.target.value })}
                    placeholder="Đại học Ngôn ngữ Bắc Kinh / BLCU"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Dung lượng file
                  </label>
                  <input 
                    type="text"
                    value={matForm.fileSize}
                    onChange={(e) => setMatForm({ ...matForm, fileSize: e.target.value })}
                    placeholder="Ví dụ: 25 MB hoặc 150 trang"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                  Đường dẫn tải xuống / Link Google Drive trực tiếp *
                </label>
                <input 
                  type="url"
                  required
                  value={matForm.downloadUrl}
                  onChange={(e) => setMatForm({ ...matForm, downloadUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/... hoặc https://..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                  Mô tả chi tiết nội dung tài liệu
                </label>
                <textarea 
                  rows={3}
                  value={matForm.description}
                  onChange={(e) => setMatForm({ ...matForm, description: e.target.value })}
                  placeholder="Tóm tắt nội dung chính, hướng dẫn học tập và lợi ích của tài liệu này đối với học viên..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                  Thẻ phân loại (Tags, cách nhau bởi dấu phẩy)
                </label>
                <input 
                  type="text"
                  value={matForm.tags}
                  onChange={(e) => setMatForm({ ...matForm, tags: e.target.value })}
                  placeholder="Giáo trình, Đàm thoại, Có Audio, Luyện thi"
                  className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#243447] dark:text-white">
                  <input 
                    type="checkbox"
                    checked={matForm.isFeatured}
                    onChange={(e) => setMatForm({ ...matForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#E85D3F] focus:ring-[#E85D3F]"
                  />
                  <span>⭐ Ghim tài liệu nổi bật lên đầu trang</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#243447] dark:text-white">
                  <input 
                    type="checkbox"
                    checked={matForm.isHidden}
                    onChange={(e) => setMatForm({ ...matForm, isHidden: e.target.checked })}
                    className="w-4 h-4 rounded text-[#E85D3F] focus:ring-[#E85D3F]"
                  />
                  <span>👁️‍🗨️ Tạm ẩn tài liệu (Chỉ Admin nhìn thấy)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30"
                >
                  {editingMatId ? 'Lưu cập nhật' : 'Thêm tài liệu ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: ADD CUSTOM VOCAB */}
      {/* ============================================================== */}
      {vocabFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <Layers size={20} className="text-[#E85D3F]" />
                <span>Thêm Từ Vựng Mới Vào Hệ Thống</span>
              </h3>
              <button onClick={() => setVocabFormOpen(false)}>
                <X size={18} className="text-gray-400" />
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
                    className="w-full px-4 py-2.5 rounded-xl text-lg font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Pinyin phiên âm</label>
                  <input 
                    type="text" 
                    value={vocabForm.pinyin}
                    onChange={(e) => setVocabForm({ ...vocabForm, pinyin: e.target.value })}
                    placeholder="nǐ hǎo"
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  />
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
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setVocabFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md"
                >
                  Lưu từ vựng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: ADD CUSTOM LESSON */}
      {/* ============================================================== */}
      {lessonFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <BookOpen size={20} className="text-[#E85D3F]" />
                <span>Thêm Bài Học Mới</span>
              </h3>
              <button onClick={() => setLessonFormOpen(false)}>
                <X size={18} className="text-gray-400" />
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
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Cấp độ HSK</label>
                  <select
                    value={lessonForm.level}
                    onChange={(e) => setLessonForm({ ...lessonForm, level: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
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
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] mb-1">Mô tả tóm tắt</label>
                <textarea 
                  rows={3}
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  placeholder="Mô tả nội dung bài học..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setLessonFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md"
                >
                  Lưu bài học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
