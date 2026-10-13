/**
 * =========================================================================
 * HANZI GO - USE AI PERSONALIZATION HOOK
 * =========================================================================
 * Hook React tái sử dụng cung cấp toàn bộ trạng thái và điều khiển cá nhân hóa:
 * - Trạng thái hồ sơ: Mục tiêu học, cấp độ mục tiêu, ngày thi, thời lượng học
 * - Kế hoạch học tập hôm nay (Today's Plan) kèm lý do sư phạm giải thích được
 * - Chẩn đoán điểm yếu thực tế (Weakness Diagnosis)
 * - Tự động đồng bộ với Storage và Custom Event giữa các tab/trang
 * - Hỗ trợ làm mới bộ đệm (Refresh / Invalidate Cache)
 * - Hỗ trợ bật/tắt cá nhân hóa & xóa/xuất dữ liệu an toàn
 * =========================================================================
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getLearnerPreferences, 
  saveLearnerPreferences, 
  buildComprehensiveLearnerContext,
  clearLearnerPersonalizationData,
  exportLearnerPersonalizationData,
  isPersonalizationEnabled
} from '../services/learnerContextService.js';

import { getPersonalizedStudyPlan } from '../services/aiGateway.js';

export function useAiPersonalization(user = null) {
  const [preferences, setPreferences] = useState(() => getLearnerPreferences(user));
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const [version, setVersion] = useState(0);

  // Lắng nghe sự kiện đồng bộ tùy chọn cá nhân hóa
  useEffect(() => {
    const handlePrefsUpdated = (e) => {
      if (e?.detail) setPreferences(e.detail);
      else setPreferences(getLearnerPreferences(user));
      setVersion(v => v + 1);
    };

    const handleCleared = () => {
      setPreferences(getLearnerPreferences(user));
      setStudyPlan(null);
      setVersion(v => v + 1);
    };

    window.addEventListener('hanzigo_preferences_updated', handlePrefsUpdated);
    window.addEventListener('hanzigo_personalization_cleared', handleCleared);
    window.addEventListener('storage', handlePrefsUpdated);

    return () => {
      window.removeEventListener('hanzigo_preferences_updated', handlePrefsUpdated);
      window.removeEventListener('hanzigo_personalization_cleared', handleCleared);
      window.removeEventListener('storage', handlePrefsUpdated);
    };
  }, [user]);

  // Cập nhật preferences khi prop user thay đổi
  useEffect(() => {
    setPreferences(getLearnerPreferences(user));
  }, [user]);

  // Tải kế hoạch học tập cá nhân hóa
  const loadStudyPlan = useCallback(async (bypassCache = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPersonalizedStudyPlan(user, { bypassCache });
      if (res && res.success && res.data) {
        setStudyPlan(res.data);
        setIsOffline(Boolean(res.isOffline));
        setIsFromCache(Boolean(res.fromCache));
      } else {
        setError(res?.error || 'Không tải được kế hoạch học tập.');
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối dịch vụ cá nhân hóa.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Tự động tải kế hoạch khi mount hoặc khi preferences/user thay đổi
  useEffect(() => {
    loadStudyPlan(false);
  }, [loadStudyPlan, version]);

  // Cập nhật tùy chọn
  const updatePreferences = useCallback((newPrefs) => {
    const updated = saveLearnerPreferences(newPrefs, user);
    setPreferences(updated);
    setVersion(v => v + 1);
    return updated;
  }, [user]);

  // Bật / tắt cá nhân hóa
  const togglePersonalization = useCallback((enabled) => {
    return updatePreferences({ personalizationEnabled: enabled });
  }, [updatePreferences]);

  // Xóa dữ liệu cá nhân hóa
  const clearData = useCallback(() => {
    const res = clearLearnerPersonalizationData(user);
    if (res.success) {
      setPreferences(getLearnerPreferences(user));
      setStudyPlan(null);
      setVersion(v => v + 1);
    }
    return res;
  }, [user]);

  // Xuất dữ liệu cá nhân hóa
  const exportData = useCallback(() => {
    return exportLearnerPersonalizationData(user);
  }, [user]);

  // Ngữ cảnh học tập hiện tại
  const learnerContext = useMemo(() => {
    return buildComprehensiveLearnerContext(user);
  }, [user, version]);

  return {
    preferences,
    updatePreferences,
    togglePersonalization,
    isPersonalizationEnabled: preferences.personalizationEnabled !== false,
    studyPlan,
    learnerContext,
    loading,
    error,
    isOffline,
    isFromCache,
    refreshStudyPlan: () => loadStudyPlan(true),
    clearPersonalizationData: clearData,
    exportPersonalizationData: exportData
  };
}

export default useAiPersonalization;
