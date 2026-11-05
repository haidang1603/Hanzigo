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
  Volume2
} from 'lucide-react';
import AiMonitoringDashboard from '../components/admin/AiMonitoringDashboard';
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
import { playClickSound, playSuccessSound, playErrorSound, speakChinese } from '../utils/audio';

// Helper to filter demo/mock dummy accounts
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
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [userSortBy, setUserSortBy] = useState('xp');

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
    xp: 0,
    streak: 0
  });

  // Admin Profile Name Editing State
  const [isEditingAdminName, setIsEditingAdminName] = useState(false);
  const [adminNameInput, setAdminNameInput] = useState(user?.name || 'Quản trị viên');
  const [isSavingAdminName, setIsSavingAdminName] = useState(false);

  useEffect(() => {
    if (!isEditingAdminName && user?.name) {
      setAdminNameInput(user.name);
    }
  }, [user?.name, isEditingAdminName]);

  // 2. Materials State
  const [materials, setMaterials] = useState(() => getStoredMaterials());
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

  // 3. Custom Vocab State
  const [customVocab, setCustomVocab] = useState(() => getStoredCustomVocab());
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

  // Toast Notification
  const [toastMsg, setToastMsg] = useState(null);

  // Sync users from Supabase on mount
  useEffect(() => {
    async function loadCloudProfiles() {
      try {
        const cloudProfiles = await getAllProfilesFromDb();
        if (Array.isArray(cloudProfiles) && cloudProfiles.length > 0) {
          setUsersList(prev => {
            const combinedMap = new Map();
            prev.filter(u => !isDemoUser(u)).forEach(u => combinedMap.set(u.email || u.id, u));
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
            name: user.name || 'Quản trị viên HanziGo',
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

  const saveUsersList = (newList) => {
    setUsersList(newList);
    try {
      localStorage.setItem('hanzigo_admin_users_directory', JSON.stringify(newList));
    } catch {}
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

  // User Actions
  const handleChangeUserRole = async (targetUser, newRole) => {
    playClickSound();
    const updated = usersList.map(u => u.id === targetUser.id ? { ...u, role: newRole } : u);
    saveUsersList(updated);
    await updateUserRoleAndStatusInDb(targetUser.id, { role: newRole });
    if (user && (user.id === targetUser.id || user.email === targetUser.email)) {
      if (onUpdateUser) onUpdateUser({ ...user, role: newRole });
    }
    showToast(`Đã đổi quyền cho ${targetUser.name} thành ${newRole.toUpperCase()}!`);
  };

  const handleToggleUserStatus = async (targetUser) => {
    playClickSound();
    const nextStatus = targetUser.status === 'blocked' ? 'active' : 'blocked';
    const updated = usersList.map(u => u.id === targetUser.id ? { ...u, status: nextStatus } : u);
    saveUsersList(updated);
    await updateUserRoleAndStatusInDb(targetUser.id, { status: nextStatus });
    showToast(`Đã ${nextStatus === 'blocked' ? 'khóa' : 'mở khóa'} tài khoản: ${targetUser.name}!`);
  };

  const handleDeleteUser = async (targetUser) => {
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
      alert('Vui lòng nhập họ tên và email!');
      return;
    }
    playClickSound();
    const created = {
      id: `user-${Date.now()}`,
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      role: newUserForm.role,
      level: newUserForm.level,
      xp: Number(newUserForm.xp) || 0,
      streak: Number(newUserForm.streak) || 0,
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
      xp: 0,
      streak: 0
    });
    showToast(`Đã tạo tài khoản mới: ${created.name}!`);
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
    showToast(`Đã lưu thay đổi cho tài khoản ${editingUser.name}!`);
  };

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
      : matForm.tags;

    const payload = { ...matForm, tags: tagsArray };

    if (editingMatId) {
      const updated = updateMaterial(editingMatId, payload);
      setMaterials(updated);
      await updateMaterialInDb(editingMatId, payload).catch(() => {});
      showToast(`Đã cập nhật tài liệu: ${payload.title}!`);
    } else {
      const updated = saveMaterial(payload);
      setMaterials(updated);
      await addMaterialToDb(payload).catch(() => {});
      showToast(`Đã thêm tài liệu mới: ${payload.title}!`);
    }
    setIsMatFormOpen(false);
  };

  const handleDeleteMaterial = async (id, title) => {
    if (window.confirm(`Xác nhận xóa tài liệu "${title}" khỏi hệ thống?`)) {
      playClickSound();
      const updated = deleteMaterial(id);
      setMaterials(updated);
      await deleteMaterialFromDb(id).catch(() => {});
      showToast(`Đã xóa tài liệu: ${title}!`);
    }
  };

  const handleToggleMaterialFeatured = (mat) => {
    playClickSound();
    const updated = updateMaterial(mat.id, { isFeatured: !mat.isFeatured });
    setMaterials(updated);
    showToast(`Đã ${!mat.isFeatured ? 'ghim nổi bật' : 'bỏ ghim'} tài liệu: ${mat.title}`);
  };

  const handleToggleMaterialHidden = (mat) => {
    playClickSound();
    const updated = updateMaterial(mat.id, { isHidden: !mat.isHidden });
    setMaterials(updated);
    showToast(`Đã ${!mat.isHidden ? 'ẩn' : 'hiển thị'} tài liệu: ${mat.title}`);
  };

  const handleResetMaterials = () => {
    if (window.confirm('Khôi phục danh sách tài liệu về bộ 20 tài liệu chuẩn ban đầu?')) {
      playClickSound();
      const reset = resetMaterials();
      setMaterials(reset);
      showToast('Đã khôi phục kho tài liệu chuẩn!');
    }
  };

  // Vocab Actions
  const handleSaveVocab = (e) => {
    e.preventDefault();
    if (!vocabForm.hanzi.trim() || !vocabForm.meaning.trim()) {
      alert('Vui lòng nhập chữ Hán và ý nghĩa!');
      return;
    }
    playClickSound();
    const updated = saveCustomVocab(vocabForm);
    setCustomVocab(updated);
    showToast(`Đã thêm từ vựng: ${vocabForm.hanzi} (${vocabForm.pinyin})!`);
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

  // Lesson Actions
  const handleSaveLesson = (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) {
      alert('Vui lòng nhập tên bài học!');
      return;
    }
    playClickSound();
    const updated = saveCustomLesson(lessonForm);
    setCustomLessons(updated);
    showToast(`Đã thêm bài học: ${lessonForm.title}!`);
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
                  playClickSound();
                  setAdminTab('vocab');
                  setVocabFormOpen(true);
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

              {/* Action: Add User */}
              <button
                onClick={() => {
                  playClickSound();
                  setIsAddUserModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
              >
                <Plus size={16} />
                <span>Tạo tài khoản học viên</span>
              </button>
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
                    <th className="p-4 pl-6">Học viên</th>
                    <th className="p-4">Phân quyền</th>
                    <th className="p-4">Cấp độ học</th>
                    <th className="p-4 text-center">Chuỗi ngày</th>
                    <th className="p-4 text-right">Điểm XP</th>
                    <th className="p-4 text-center">Trạng thái</th>
                    <th className="p-4 pr-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-[#748092] dark:text-[#94A3B8]">
                        Không tìm thấy học viên nào phù hợp với bộ lọc tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isSelf = user && (user.id === u.id || user.email === u.email);
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
                                  <span>{u.name || 'Học viên'}</span>
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
                                    onClick={() => handleToggleUserStatus(u)}
                                    title={u.status === 'blocked' ? 'Mở khóa' : 'Khóa tài khoản'}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-amber-500 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                                  >
                                    {u.status === 'blocked' ? <Unlock size={15} /> : <Lock size={15} />}
                                  </button>

                                  <button
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
          </div>

        </div>
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
                  onClick={handleResetMaterials}
                  className="px-3.5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-[#131B24] dark:hover:bg-gray-800 text-[#748092] dark:text-[#94A3B8] text-xs font-bold transition-all cursor-pointer"
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

          {/* Materials Grid */}
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
                onClick={() => {
                  playClickSound();
                  setVocabFormOpen(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus size={16} />
                <span>Thêm từ vựng</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVocab.map((v) => (
              <div 
                key={v.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex items-center justify-between"
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

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => speakChinese(v.hanzi)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#E85D3F] cursor-pointer"
                    title="Nghe phát âm"
                  >
                    <Volume2 size={16} />
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
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: LESSONS MANAGEMENT */}
      {/* ============================================================== */}
      {adminTab === 'lessons' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-[#243447] dark:text-white">
              Danh Sách Bài Học Bổ Sung ({customLessons.length})
            </h3>
            <button
              onClick={() => {
                playClickSound();
                setLessonFormOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Tạo bài học mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customLessons.map((l) => (
              <div 
                key={l.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-[#E85D3F]">
                      {l.level}
                    </span>
                    <span className="text-xs text-[#748092]">+{l.xp} XP</span>
                  </div>
                  <h4 className="text-base font-bold text-[#243447] dark:text-white">{l.title}</h4>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1">{l.description}</p>
                </div>

                <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                  <span className="text-xs text-[#748092]">Thời lượng: {l.duration} phút</span>
                  <button
                    onClick={() => handleDeleteLesson(l.id, l.title)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
                <span>Tạo Tài Khoản Học Viên Mới</span>
              </h3>
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 cursor-pointer"
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
                    Phân quyền vai trò
                  </label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  >
                    <option value="student">Học viên</option>
                    <option value="teacher">Giáo viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Cấp độ HSK khởi đầu
                  </label>
                  <select
                    value={newUserForm.level}
                    onChange={(e) => setNewUserForm({ ...newUserForm, level: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  >
                    <option value="HSK 1 - Sơ cấp">HSK 1 - Sơ cấp</option>
                    <option value="HSK 2 - Cơ bản">HSK 2 - Cơ bản</option>
                    <option value="HSK 3 - Trung cấp">HSK 3 - Trung cấp</option>
                    <option value="HSK 4 - Độc lập">HSK 4 - Độc lập</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-black/5 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md cursor-pointer"
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
                <span>Chỉnh Sửa Học Viên</span>
              </h3>
              <button 
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
                    Trạng thái
                  </label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
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
      )}

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
      {/* MODAL 4: ADD CUSTOM VOCAB */}
      {/* ============================================================== */}
      {vocabFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <Layers size={20} className="text-[#E85D3F]" />
                <span>Thêm Từ Vựng Mới</span>
              </h3>
              <button onClick={() => setVocabFormOpen(false)} className="cursor-pointer">
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setVocabFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md cursor-pointer"
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
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <BookOpen size={20} className="text-[#E85D3F]" />
                <span>Thêm Bài Học Mới</span>
              </h3>
              <button onClick={() => setLessonFormOpen(false)} className="cursor-pointer">
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
                  onClick={() => setLessonFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md cursor-pointer"
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
