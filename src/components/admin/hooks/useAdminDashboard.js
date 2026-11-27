import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getCustomVocabularyFromDb,
  addCustomVocabularyToDb,
  updateCustomVocabularyInDb,
  deleteCustomVocabularyFromDb,
  checkVocabularyDuplicate,
} from '../../../services/customVocabularyService';
import {
  getCustomLessonsFromDb,
  addCustomLessonToDb,
  updateCustomLessonInDb,
  deleteCustomLessonFromDb,
  checkLessonDuplicate,
} from '../../../services/customLessonService';
import {
  getAllProfilesFromDb,
  updateUserRoleAndStatusInDb,
  deleteUserProfileFromDb,
  updateUserProfile,
} from '../../../supabase/services';
import { fetchAdminDashboardSummary } from '../../../services/adminService';
import { supabase, isSupabaseConfigured } from '../../../supabase/config';
import { playClickSound, playSuccessSound, playErrorSound } from '../../../utils/audio';
import {
  ADMIN_TAB_GROUPS,
  DEFAULT_NEW_USER_FORM,
  DEFAULT_VOCAB_FORM,
  DEFAULT_LESSON_FORM,
  MOCK_STORAGE_KEYS_TO_PURGE,
} from '../adminConstants';
import {
  checkIsAdmin,
  canModifyTargetUser,
  createEmptyDashboardSummary,
  generateRandomPassword,
  mapCloudProfileToUser,
  filterAndSortUsers,
  filterCustomVocab,
  filterCustomLessons,
  computeUserStats,
} from '../adminHelpers';

const VALID_ADMIN_TAB_IDS = new Set(ADMIN_TAB_GROUPS.map((t) => t.id));

export function parseAdminTabFromHash(hashValue = typeof window !== 'undefined' ? window.location.hash : '') {
  try {
    const raw = String(hashValue || '').replace(/^#\/?/, '');
    if (!raw.toLowerCase().startsWith('admin')) return 'overview';

    const [pathPart = '', queryPart = ''] = raw.split('?');
    if (queryPart) {
      const params = new URLSearchParams(queryPart);
      const tabParam = (params.get('tab') || '').trim().toLowerCase();
      if (VALID_ADMIN_TAB_IDS.has(tabParam)) return tabParam;
    }

    const segments = pathPart.split(/[/#]/).filter(Boolean);
    const candidate = (segments[1] || '').trim().toLowerCase();
    if (VALID_ADMIN_TAB_IDS.has(candidate)) return candidate;
  } catch {}
  return 'overview';
}

export function useAdminDashboard({ user, onUpdateUser, onCreateUser }) {
  const [adminTab, setAdminTab] = useState(() => parseAdminTabFromHash());
  const [showMobileKpis, setShowMobileKpis] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleHashSync = () => {
      const nextTab = parseAdminTabFromHash(window.location.hash);
      if (window.location.hash.toLowerCase().startsWith('#admin')) {
        setAdminTab(nextTab);
      }
    };
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  const isAdmin = checkIsAdmin(user);
  const currentRole = isAdmin ? 'admin' : user?.role || 'student';

  // 1. Users Directory State
  const [usersList, setUsersList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [fetchUsersError, setFetchUsersError] = useState(null);

  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [userSortBy, setUserSortBy] = useState('xp');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [userSearch, userRoleFilter, userStatusFilter, userSortBy]);

  // User Modals State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUserForm, setNewUserForm] = useState(DEFAULT_NEW_USER_FORM);
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

  // 3. Custom Vocab State (Supabase Authoritative DB)
  const [customVocab, setCustomVocab] = useState([]);
  const [isLoadingVocab, setIsLoadingVocab] = useState(false);
  const [vocabError, setVocabError] = useState(null);
  const [editingVocabId, setEditingVocabId] = useState(null);
  const [isSavingVocab, setIsSavingVocab] = useState(false);
  const [vocabSearch, setVocabSearch] = useState('');
  const [vocabHskFilter, setVocabHskFilter] = useState('all');
  const [vocabFormOpen, setVocabFormOpen] = useState(false);
  const [vocabForm, setVocabForm] = useState(DEFAULT_VOCAB_FORM);

  // 4. Custom Lesson State (Supabase Authoritative DB)
  const [customLessons, setCustomLessons] = useState([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [lessonsError, setLessonsError] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [lessonSearch, setLessonSearch] = useState('');
  const [lessonLevelFilter, setLessonLevelFilter] = useState('all');
  const [lessonFormOpen, setLessonFormOpen] = useState(false);
  const [lessonForm, setLessonForm] = useState(DEFAULT_LESSON_FORM);

  // Consolidated Server Dashboard Summary State (zero mock)
  const [dashboardSummary, setDashboardSummary] = useState(() => createEmptyDashboardSummary());
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  // Production Client Error Logs State
  const [clientErrorLogs, setClientErrorLogs] = useState([]);
  const [isLoadingErrorLogs, setIsLoadingErrorLogs] = useState(false);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToastMsg({ message, type });
    if (type === 'success') playSuccessSound();
    else playErrorSound();
    setTimeout(() => setToastMsg(null), 3500);
  }, []);

  const loadDashboardSummary = useCallback(async () => {
    if (!isAdmin) {
      setDashboardSummary(createEmptyDashboardSummary());
      return;
    }
    setIsLoadingDashboard(true);
    setDashboardError(null);
    try {
      const data = await fetchAdminDashboardSummary();
      if (data && typeof data === 'object') {
        setDashboardSummary({ ...createEmptyDashboardSummary(), ...data });
        if (Array.isArray(data.clientErrorLogs)) {
          setClientErrorLogs(data.clientErrorLogs);
        }
      }
    } catch (err) {
      setDashboardError(err.message || 'Không thể tải thống kê tổng quan từ máy chủ.');
    } finally {
      setIsLoadingDashboard(false);
    }
  }, [isAdmin]);

  // Fetch users directly from Supabase (strictly guarded by isAdmin)
  const loadCloudProfiles = useCallback(async () => {
    if (!isAdmin) {
      setUsersList([]);
      setIsLoadingUsers(false);
      return;
    }
    setIsLoadingUsers(true);
    setFetchUsersError(null);
    try {
      const cloudProfiles = await getAllProfilesFromDb();
      if (Array.isArray(cloudProfiles)) {
        setUsersList(cloudProfiles.map(mapCloudProfileToUser));
      } else {
        setUsersList([]);
      }
    } catch (err) {
      console.warn('Notice loading Supabase profiles:', err);
      setFetchUsersError(err.message || 'Không thể tải danh sách người dùng từ máy chủ.');
    } finally {
      setIsLoadingUsers(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    loadDashboardSummary();
    loadCloudProfiles();
  }, [isAdmin, loadDashboardSummary, loadCloudProfiles]);

  // Fetch recent production client error telemetry logs when AI/Health tab is opened
  const loadClientErrorLogs = useCallback(async () => {
    if (!isAdmin || !isSupabaseConfigured || !supabase) {
      setClientErrorLogs([]);
      return;
    }
    setIsLoadingErrorLogs(true);
    try {
      const { data, error } = await supabase
        .from('client_error_logs')
        .select('id, created_at, route, error_name, error_message, component_stack_short, app_version, fingerprint')
        .order('created_at', { ascending: false })
        .limit(50);
      if (!error && Array.isArray(data)) {
        setClientErrorLogs(data);
      } else {
        setClientErrorLogs([]);
      }
    } catch {
      setClientErrorLogs([]);
    } finally {
      setIsLoadingErrorLogs(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin && adminTab === 'ai_metrics') {
      loadClientErrorLogs();
    }
  }, [isAdmin, adminTab, loadClientErrorLogs]);

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

    setUsersList((prev) =>
      prev.map((u) =>
        u.id === uid || u.email === user?.email ? { ...u, name: newName } : u
      )
    );

    setIsSavingAdminName(false);
    setIsEditingAdminName(false);
    showToast(`Đã đổi tên quản trị viên thành: "${newName}"!`);
  };

  const handleGenerateRandomPassword = () => {
    setNewUserForm((prev) => ({ ...prev, password: generateRandomPassword(12) }));
    setShowNewUserPassword(true);
  };

  const handleChangeUserRole = async (targetUser, newRole) => {
    const guard = canModifyTargetUser(user, targetUser);
    if (!guard.allowed) {
      alert(guard.reason);
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
    setUsersList((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
    );

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
    const guard = canModifyTargetUser(user, targetUser);
    if (!guard.allowed) {
      alert(guard.reason);
      return;
    }

    playClickSound();
    const nextStatus = targetUser.status === 'blocked' ? 'active' : 'blocked';
    const oldUsers = [...usersList];
    setUsersList((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, status: nextStatus } : u))
    );

    const ok = await updateUserRoleAndStatusInDb(targetUser.id, { status: nextStatus });
    if (!ok) {
      setUsersList(oldUsers);
      showToast('Cập nhật trạng thái người dùng thất bại trên máy chủ.', 'error');
      return;
    }

    showToast(
      `Đã ${nextStatus === 'blocked' ? 'khóa' : 'mở khóa'} tài khoản: ${targetUser.name}!`
    );
  };

  const handleDeleteUser = async (targetUser) => {
    const guard = canModifyTargetUser(user, targetUser);
    if (!guard.allowed) {
      alert(guard.reason);
      return;
    }

    if (
      !window.confirm(
        `CẢNH BÁO: Xác nhận xóa vĩnh viễn tài khoản "${targetUser.name}" (${targetUser.email}) khỏi hệ thống? Thao tác này không thể hoàn tác!`
      )
    ) {
      return;
    }

    playClickSound();
    const oldUsers = [...usersList];
    setUsersList((prev) => prev.filter((u) => u.id !== targetUser.id));

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
      await onCreateUser({
        name,
        email,
        role,
        password,
        level,
        status: 'active',
      });

      showToast(`Đã tạo thành công tài khoản cho ${name} (${email})!`);
      setIsAddUserModalOpen(false);
      setNewUserForm({
        name: '',
        email: '',
        role: 'student',
        password: '',
        level: 'HSK 1 - Sơ cấp',
      });
      setShowNewUserPassword(false);

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

    const guard = canModifyTargetUser(user, editingUser);
    if (!guard.allowed && (editingUser.role !== 'admin' || editingUser.status !== 'active')) {
      alert(guard.reason);
      return;
    }

    playClickSound();
    setUsersList((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u))
    );
    await updateUserRoleAndStatusInDb(editingUser.id, {
      name: editingUser.name,
      level: editingUser.level,
      role: editingUser.role,
      status: editingUser.status,
      xp: editingUser.xp,
      streak: editingUser.streak,
    });
    setIsEditUserModalOpen(false);
    showToast(`Đã lưu thay đổi cho tài khoản ${editingUser.name}!`);
  };

  // Load Custom Vocab directly from Supabase DB
  const loadCustomVocabData = useCallback(async () => {
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
  }, []);

  // Load Custom Lessons directly from Supabase DB
  const loadCustomLessonsData = useCallback(async () => {
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
  }, []);

  // Vocab Actions
  const handleOpenCreateVocab = () => {
    playClickSound();
    setEditingVocabId(null);
    setVocabForm(DEFAULT_VOCAB_FORM);
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
      memoryTip: v.mnemonic || v.memoryTip || '',
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
        alert(
          `Từ vựng chữ Hán "${cleanHanzi}" đã tồn tại trong từ điển hệ thống hoặc danh sách bổ sung!`
        );
        setIsSavingVocab(false);
        return;
      }

      playClickSound();
      if (editingVocabId) {
        const updated = await updateCustomVocabularyInDb(editingVocabId, vocabForm);
        setCustomVocab((prev) =>
          prev.map((item) => (String(item.id) === String(editingVocabId) ? updated : item))
        );
        showToast(`Đã cập nhật từ vựng: ${cleanHanzi}!`);
      } else {
        const created = await addCustomVocabularyToDb(vocabForm, user);
        setCustomVocab((prev) => [created, ...prev]);
        showToast(`Đã thêm từ vựng: ${cleanHanzi} (${vocabForm.pinyin || ''})!`);
      }

      setVocabFormOpen(false);
      setEditingVocabId(null);
      setVocabForm(DEFAULT_VOCAB_FORM);
    } catch (err) {
      console.error('Save vocab error:', err);
      showToast(err.message || 'Lỗi lưu từ vựng!', 'error');
    } finally {
      setIsSavingVocab(false);
    }
  };

  const handleDeleteVocab = async (id, hanzi) => {
    if (
      window.confirm(
        `Xóa từ vựng: ${hanzi}? Dữ liệu sẽ được cập nhật trực tiếp trên cơ sở dữ liệu Supabase.`
      )
    ) {
      playClickSound();
      try {
        await deleteCustomVocabularyFromDb(id);
        setCustomVocab((prev) => prev.filter((item) => String(item.id) !== String(id)));
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

  // Lesson Actions
  const handleOpenCreateLesson = () => {
    playClickSound();
    setEditingLessonId(null);
    setLessonForm(DEFAULT_LESSON_FORM);
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
      grammarPoints: l.grammarPoints || '',
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
        setCustomLessons((prev) =>
          prev.map((item) => (String(item.id) === String(editingLessonId) ? updated : item))
        );
        showToast(`Đã cập nhật bài học: ${cleanTitle}!`);
      } else {
        const created = await addCustomLessonToDb(lessonForm, user);
        setCustomLessons((prev) => [created, ...prev]);
        showToast(`Đã thêm bài học: ${cleanTitle}!`);
      }

      setLessonFormOpen(false);
      setEditingLessonId(null);
      setLessonForm(DEFAULT_LESSON_FORM);
    } catch (err) {
      console.error('Save lesson error:', err);
      showToast(err.message || 'Lỗi lưu bài học!', 'error');
    } finally {
      setIsSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (id, title) => {
    if (
      window.confirm(
        `Xóa bài học: ${title}? Dữ liệu sẽ được cập nhật trực tiếp trên cơ sở dữ liệu Supabase.`
      )
    ) {
      playClickSound();
      try {
        await deleteCustomLessonFromDb(id);
        setCustomLessons((prev) => prev.filter((item) => String(item.id) !== String(id)));
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
    if (
      !window.confirm(
        'CẢNH BÁO: Thao tác này sẽ xóa toàn bộ số liệu thử nghiệm, lịch sử thi thử HSK, điểm phát âm, và chat đàm thoại trên trình duyệt này để đưa về trạng thái sạch sẽ. Bạn có chắc chắn không?'
      )
    ) {
      return;
    }

    try {
      MOCK_STORAGE_KEYS_TO_PURGE.forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch {}
      });
      showToast('Đã xóa sạch toàn bộ số liệu rác thử nghiệm thành công!');
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const filteredUsers = useMemo(
    () =>
      filterAndSortUsers(usersList, {
        userSearch,
        userRoleFilter,
        userStatusFilter,
        userSortBy,
      }),
    [usersList, userSearch, userRoleFilter, userStatusFilter, userSortBy]
  );

  const filteredVocab = useMemo(
    () => filterCustomVocab(customVocab, { vocabSearch, vocabHskFilter }),
    [customVocab, vocabSearch, vocabHskFilter]
  );

  const filteredLessons = useMemo(
    () => filterCustomLessons(customLessons, { lessonSearch, lessonLevelFilter }),
    [customLessons, lessonSearch, lessonLevelFilter]
  );

  const handleRefreshAll = useCallback(async () => {
    if (!isAdmin) return;
    playClickSound();
    await Promise.all([loadDashboardSummary(), loadCloudProfiles()]);
    if (adminTab === 'ai_metrics') {
      await loadClientErrorLogs();
    }
    showToast('Đã làm mới toàn bộ dữ liệu quản trị!');
  }, [isAdmin, adminTab, loadDashboardSummary, loadCloudProfiles, loadClientErrorLogs, showToast]);

  const userStats = useMemo(() => computeUserStats(usersList), [usersList]);

  return {
    adminTab,
    setAdminTab,
    showMobileKpis,
    setShowMobileKpis,
    isAdmin,
    currentRole,
    dashboardSummary,
    isLoadingDashboard,
    dashboardError,
    loadDashboardSummary,
    handleRefreshAll,
    usersList,
    isLoadingUsers,
    fetchUsersError,
    userSearch,
    setUserSearch,
    userRoleFilter,
    setUserRoleFilter,
    userStatusFilter,
    setUserStatusFilter,
    userSortBy,
    setUserSortBy,
    currentPage,
    setCurrentPage,
    isAddUserModalOpen,
    setIsAddUserModalOpen,
    isEditUserModalOpen,
    setIsEditUserModalOpen,
    editingUser,
    setEditingUser,
    newUserForm,
    setNewUserForm,
    isCreatingUser,
    createUserError,
    setCreateUserError,
    showNewUserPassword,
    setShowNewUserPassword,
    isEditingAdminName,
    setIsEditingAdminName,
    adminNameInput,
    setAdminNameInput,
    isSavingAdminName,
    customVocab,
    isLoadingVocab,
    vocabError,
    editingVocabId,
    setEditingVocabId,
    isSavingVocab,
    vocabSearch,
    setVocabSearch,
    vocabHskFilter,
    setVocabHskFilter,
    vocabFormOpen,
    setVocabFormOpen,
    vocabForm,
    setVocabForm,
    customLessons,
    isLoadingLessons,
    lessonsError,
    editingLessonId,
    setEditingLessonId,
    isSavingLesson,
    lessonSearch,
    setLessonSearch,
    lessonLevelFilter,
    setLessonLevelFilter,
    lessonFormOpen,
    setLessonFormOpen,
    lessonForm,
    setLessonForm,
    clientErrorLogs,
    isLoadingErrorLogs,
    loadClientErrorLogs,
    toastMsg,
    showToast,
    loadCloudProfiles,
    handleSaveAdminName,
    handleGenerateRandomPassword,
    handleChangeUserRole,
    handleToggleUserStatus,
    handleDeleteUser,
    handleCreateUser,
    handleSaveEditUser,
    loadCustomVocabData,
    loadCustomLessonsData,
    handleOpenCreateVocab,
    handleOpenEditVocab,
    handleSaveVocab,
    handleDeleteVocab,
    handleRefreshVocab,
    handleOpenCreateLesson,
    handleOpenEditLesson,
    handleSaveLesson,
    handleDeleteLesson,
    handleRefreshLessons,
    handlePurgeAllMockData,
    filteredUsers,
    filteredVocab,
    filteredLessons,
    userStats,
  };
}
