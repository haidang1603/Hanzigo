import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Zap, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowUpRight, 
  HelpCircle, 
  X, 
  RefreshCw, 
  User, 
  Award,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Eye,
  EyeOff,
  Calendar,
  Globe,
  School
} from 'lucide-react';
import { 
  getXpLeaderboard, 
  XP_HONORIFIC_TITLES,
  isUserLeaderboardOptedOut,
  setLeaderboardPrivacyOptOut
} from '../../services/leaderboardService';
import { playClickSound, playLevelUpSound } from '../../utils/audio';

export default function LeaderboardView({ user, onNavigateTab }) {
  const [data, setData] = useState({
    leaderboard: [],
    totalLearners: 0,
    currentUserRank: -1,
    currentUserEntry: null,
    gapToNext: 0,
    nextRankUser: null
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [timeframe, setTimeframe] = useState('all'); // 'all' | 'weekly' | 'monthly'
  const [scope, setScope] = useState('global'); // 'global' | 'class'
  const [isOptedOut, setIsOptedOut] = useState(() => isUserLeaderboardOptedOut(user));
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Load leaderboard data
  const loadData = async (showSpin = false, tf = timeframe, sc = scope) => {
    if (showSpin) setIsRefreshing(true);
    else setLoading(true);

    try {
      const result = await getXpLeaderboard(user, { timeframe: tf, scope: sc });
      setData(result);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false, timeframe, scope);
  }, [user, timeframe, scope]);

  const handleToggleOptOut = () => {
    playClickSound();
    const nextVal = !isOptedOut;
    setIsOptedOut(nextVal);
    setLeaderboardPrivacyOptOut(user, nextVal);
    loadData(true, timeframe, scope);
  };

  // Filtered leaderboard
  const filteredList = useMemo(() => {
    return data.leaderboard.filter(item => {
      const matchesSearch = !searchQuery.trim() || 
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (item.email || '').toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchesLevel = levelFilter === 'all' || 
        (item.level || '').toLowerCase().includes(levelFilter.toLowerCase());

      return matchesSearch && matchesLevel;
    });
  }, [data.leaderboard, searchQuery, levelFilter]);

  // Top 3 Podium
  const top1 = data.leaderboard[0] || null;
  const top2 = data.leaderboard[1] || null;
  const top3 = data.leaderboard[2] || null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E85D3F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Trophy size={14} className="text-amber-400" />
              <span>BẢNG VINH DANH HỌC VIÊN HANZIGO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Bảng Xếp Hạng Cao Thủ XP
            </h1>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Vinh danh những học viên kiên trì và tiến bộ vượt bậc nhất. Tích lũy điểm kinh nghiệm qua từng bài học, phát âm và tập viết để thăng hạng!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                playClickSound();
                loadData(true);
              }}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Đang cập nhật...' : 'Làm mới'}</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setShowRulesModal(true);
              }}
              className="px-3.5 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <HelpCircle size={14} />
              <span>Quy tắc kiếm XP</span>
            </button>
          </div>
        </div>

        {/* User live status card inside banner */}
        {data.currentUserEntry && (
          <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] flex items-center justify-center text-white text-lg font-black shadow-md border-2 border-white/20">
                {data.currentUserEntry.avatar ? (
                  <img src={data.currentUserEntry.avatar} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  (data.currentUserEntry.name || 'B').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {data.currentUserEntry.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E85D3F] text-white">
                    Vị trí của bạn: #{data.currentUserRank}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/70 mt-0.5">
                  <span className="flex items-center gap-1 font-mono font-bold text-amber-300">
                    <Zap size={12} className="fill-amber-300 text-amber-300" />
                    {data.currentUserEntry.xp.toLocaleString()} XP
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-orange-300 font-bold">
                    <Flame size={12} className="fill-orange-400 text-orange-400" />
                    {data.currentUserEntry.streak} ngày streak
                  </span>
                  <span>•</span>
                  <span className="text-emerald-300 font-semibold">
                    {data.currentUserEntry.honorific}
                  </span>
                </div>
              </div>
            </div>

            {data.currentUserRank > 1 && data.gapToNext > 0 ? (
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
                <div className="text-right">
                  <div className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Mục tiêu thăng hạng</div>
                  <div className="text-xs font-bold text-amber-300">
                    Cần thêm <span className="font-mono text-white text-sm font-black">+{data.gapToNext} XP</span> để lên hạng #{data.currentUserRank - 1}
                  </div>
                </div>
                {onNavigateTab && (
                  <button
                    onClick={() => {
                      playClickSound();
                      onNavigateTab('roadmap');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#E85D3F] text-white text-xs font-bold hover:opacity-95 transition-opacity shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <span>Cày điểm ngay</span>
                    <ArrowUpRight size={13} />
                  </button>
                )}
              </div>
            ) : (
              <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2">
                <Crown size={16} className="text-amber-400" />
                <span>Bạn đang dẫn đầu bảng xếp hạng! Hãy tiếp tục duy trì phong độ.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Top 3 Podium (Bục Vinh Quang) */}
      {!loading && data.leaderboard.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-[#243447] dark:text-white flex items-center justify-center gap-2">
              <Crown size={20} className="text-amber-500" />
              <span>Bục Vinh Quang Top 3 Cao Thủ</span>
            </h2>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Những cá nhân xuất sắc có tổng điểm cống hiến và học tập cao nhất
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end max-w-3xl mx-auto pt-4 pb-2">
            
            {/* Top 2: Silver (Left) */}
            <div className="order-2 sm:order-1 flex flex-col items-center">
              {top2 ? (
                <div className="w-full flex flex-col items-center space-y-3">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-white text-xl font-bold shadow-md border-2 border-slate-300 dark:border-slate-500">
                      {top2.avatar ? (
                        <img src={top2.avatar} alt="Top 2" className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        (top2.name || '2').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-slate-300 dark:bg-slate-700 border border-slate-400 text-slate-800 dark:text-slate-100 text-[10px] font-black shadow-xs">
                      🥈 #2
                    </div>
                  </div>

                  <div className="text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-bold text-[#243447] dark:text-white truncate max-w-[130px]">
                        {top2.name}
                      </span>
                      {top2.isCurrentUser && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E85D3F] text-white">Tôi</span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono font-black text-slate-600 dark:text-slate-300">
                      {top2.xp.toLocaleString()} XP
                    </div>
                    <div className="text-[10px] text-[#748092] flex items-center justify-center gap-1">
                      <Flame size={10} className="text-orange-500 fill-orange-500" />
                      <span>{top2.streak} ngày</span>
                    </div>
                  </div>

                  {/* Podium Stand */}
                  <div className="w-full h-24 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-black text-slate-400 dark:text-slate-600 text-2xl shadow-inner">
                    2
                  </div>
                </div>
              ) : (
                <div className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs text-slate-400">
                  Chờ bạn chinh phục #2
                </div>
              )}
            </div>

            {/* Top 1: Gold (Center, Highest) */}
            <div className="order-1 sm:order-2 flex flex-col items-center">
              {top1 ? (
                <div className="w-full flex flex-col items-center space-y-3">
                  <div className="relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-500 animate-bounce">
                      <Crown size={28} />
                    </div>
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-amber-500/25 border-4 border-amber-200 dark:border-amber-400">
                      {top1.avatar ? (
                        <img src={top1.avatar} alt="Top 1" className="w-full h-full rounded-3xl object-cover" />
                      ) : (
                        (top1.name || '1').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[11px] font-black shadow-md border border-amber-200">
                      🥇 #1
                    </div>
                  </div>

                  <div className="text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-bold text-[#243447] dark:text-white truncate max-w-[150px]">
                        {top1.name}
                      </span>
                      {top1.isCurrentUser && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E85D3F] text-white">Tôi</span>
                      )}
                    </div>
                    <div className="text-sm font-mono font-black text-amber-600 dark:text-amber-400">
                      {top1.xp.toLocaleString()} XP
                    </div>
                    <div className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                      {top1.honorific}
                    </div>
                    <div className="text-[10px] text-[#748092] flex items-center justify-center gap-1">
                      <Flame size={10} className="text-orange-500 fill-orange-500" />
                      <span>{top1.streak} ngày streak</span>
                    </div>
                  </div>

                  {/* Podium Stand */}
                  <div className="w-full h-32 rounded-2xl bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-950/60 dark:to-[#131B24] border-2 border-amber-300 dark:border-amber-700/60 flex flex-col items-center justify-center font-black text-amber-600 dark:text-amber-400 text-3xl shadow-inner">
                    <span>1</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Quán Quân</span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Top 3: Bronze (Right) */}
            <div className="order-3 flex flex-col items-center">
              {top3 ? (
                <div className="w-full flex flex-col items-center space-y-3">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white text-xl font-bold shadow-md border-2 border-amber-600">
                      {top3.avatar ? (
                        <img src={top3.avatar} alt="Top 3" className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        (top3.name || '3').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-amber-700 text-amber-100 text-[10px] font-black shadow-xs">
                      🥉 #3
                    </div>
                  </div>

                  <div className="text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-bold text-[#243447] dark:text-white truncate max-w-[130px]">
                        {top3.name}
                      </span>
                      {top3.isCurrentUser && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E85D3F] text-white">Tôi</span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono font-black text-amber-700 dark:text-amber-300">
                      {top3.xp.toLocaleString()} XP
                    </div>
                    <div className="text-[10px] text-[#748092] flex items-center justify-center gap-1">
                      <Flame size={10} className="text-orange-500 fill-orange-500" />
                      <span>{top3.streak} ngày</span>
                    </div>
                  </div>

                  {/* Podium Stand */}
                  <div className="w-full h-20 rounded-2xl bg-gradient-to-b from-orange-100 to-orange-200 dark:from-orange-950/40 dark:to-slate-900 border border-orange-300 dark:border-orange-800 flex items-center justify-center font-black text-orange-700 dark:text-orange-400 text-2xl shadow-inner">
                    3
                  </div>
                </div>
              ) : (
                <div className="w-full h-28 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs text-slate-400">
                  Chờ bạn chinh phục #3
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 2.5 Scope, Timeframe & Privacy Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs">
        {/* Timeframe tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FFF9F2] dark:bg-[#131B24] rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
          {[
            { id: 'all', label: 'Toàn thời gian', icon: Trophy },
            { id: 'weekly', label: 'Tuần này', icon: Zap },
            { id: 'monthly', label: 'Tháng này', icon: Calendar }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setTimeframe(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeframe === tab.id
                    ? 'bg-[#E85D3F] text-white shadow-xs'
                    : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scope tabs & Privacy opt-out */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-[#FFF9F2] dark:bg-[#131B24] rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <button
              onClick={() => {
                playClickSound();
                setScope('global');
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scope === 'global'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              <Globe size={13} />
              <span>Toàn quốc</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                setScope('class');
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scope === 'class'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              <School size={13} />
              <span>Lớp học</span>
            </button>
          </div>

          {/* Privacy Opt-out Toggle */}
          <button
            onClick={handleToggleOptOut}
            title={isOptedOut ? 'Nhấn để chuyển sang chế độ công khai' : 'Nhấn để ẩn danh trên bảng xếp hạng'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isOptedOut
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
            }`}
          >
            {isOptedOut ? <EyeOff size={14} className="text-slate-500" /> : <Eye size={14} className="text-emerald-600" />}
            <span>{isOptedOut ? 'Chế độ Ẩn danh: BẬT' : 'Hiển thị công khai'}</span>
          </button>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
          <input
            type="text"
            placeholder="Tìm tên học viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#748092] hover:text-[#243447]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-[#748092] shrink-0 mr-1 flex items-center gap-1">
            <Filter size={13} />
            <span>Cấp độ:</span>
          </span>
          {['all', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                playClickSound();
                setLevelFilter(lvl);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                levelFilter === lvl
                  ? 'bg-[#E85D3F] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              {lvl === 'all' ? 'Tất cả' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Leaderboard Table */}
      <div className="rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#E85D3F] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#748092] font-semibold">Đang tải bảng xếp hạng học viên...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Trophy size={36} className="text-[#748092] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-[#243447] dark:text-white">Không tìm thấy học viên phù hợp</h3>
            <p className="text-xs text-[#748092]">Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc cấp độ.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
            
            {/* Table Header */}
            <div className="grid grid-cols-12 px-5 py-3 text-[11px] font-bold text-[#748092] uppercase tracking-wider bg-[#FFF9F2]/60 dark:bg-[#131B24]/60">
              <div className="col-span-2 sm:col-span-1 text-center">Hạng</div>
              <div className="col-span-6 sm:col-span-5">Học viên</div>
              <div className="hidden sm:block sm:col-span-3 text-center">Danh hiệu</div>
              <div className="col-span-4 sm:col-span-3 text-right">Điểm kinh nghiệm</div>
            </div>

            {/* Rows */}
            {filteredList.map((item) => {
              const isTop1 = item.rank === 1;
              const isTop2 = item.rank === 2;
              const isTop3 = item.rank === 3;

              return (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 px-5 py-3.5 items-center transition-colors ${
                    item.isCurrentUser
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 border-l-4 border-l-[#E85D3F]'
                      : 'hover:bg-[#FFF9F2]/40 dark:hover:bg-[#131B24]/40'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-center font-black">
                    {isTop1 ? (
                      <span className="text-xl" title="Quán Quân">🥇</span>
                    ) : isTop2 ? (
                      <span className="text-xl" title="Á Quân 1">🥈</span>
                    ) : isTop3 ? (
                      <span className="text-xl" title="Á Quân 2">🥉</span>
                    ) : (
                      <span className="w-7 h-7 rounded-xl bg-[#F1E5D8]/60 dark:bg-[#2B3A4F]/60 text-[#243447] dark:text-white text-xs flex items-center justify-center font-mono">
                        #{item.rank}
                      </span>
                    )}
                  </div>

                  {/* Learner Info */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0 pr-2">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FEF7E9] to-[#FDE8BF] dark:from-[#2D2619] dark:to-[#382E19] flex items-center justify-center text-[#D97706] font-bold text-sm border border-[#F4B942]/30">
                        {item.avatar ? (
                          <img src={item.avatar} alt={item.name} className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                          (item.name || 'H').charAt(0).toUpperCase()
                        )}
                      </div>
                      {item.streak >= 3 && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[9px] shadow-xs" title={`${item.streak} ngày streak`}>
                          🔥
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-xs font-bold truncate ${item.isCurrentUser ? 'text-[#E85D3F]' : 'text-[#243447] dark:text-white'}`}>
                          {item.name}
                        </span>
                        {item.isCurrentUser && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E85D3F] text-white">
                            Tôi
                          </span>
                        )}
                        {item.role === 'admin' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Admin
                          </span>
                        )}
                        {item.isOptedOut && item.isCurrentUser && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            Ẩn danh
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#748092] dark:text-[#94A3B8] mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 font-semibold">
                          {item.level}
                        </span>
                        <span>•</span>
                        <span>🔥 {item.streak} ngày</span>
                        {item.maskedEmail && (
                          <>
                            <span className="hidden md:inline">•</span>
                            <span className="hidden md:inline font-mono text-[9px] opacity-75">{item.maskedEmail}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Honorific Badge */}
                  <div className="hidden sm:flex sm:col-span-3 items-center justify-center">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-xs ${item.honorificStyle}`}>
                      {item.honorific}
                    </span>
                  </div>

                  {/* Total XP */}
                  <div className="col-span-4 sm:col-span-3 text-right">
                    <div className="font-mono font-black text-sm text-[#E85D3F] flex items-center justify-end gap-1">
                      <Zap size={13} className="fill-[#E85D3F]" />
                      <span>{item.xp.toLocaleString()}</span>
                      <span className="text-[10px] font-sans font-bold text-[#748092]">XP</span>
                    </div>
                    <div className="text-[10px] text-[#748092] dark:text-[#94A3B8] sm:hidden truncate">
                      {item.honorific}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Modal: Quy tắc kiếm XP */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#243447] dark:text-white">
                    Quy Tắc Tích Lũy Điểm XP
                  </h3>
                  <p className="text-xs text-[#748092]">
                    Cách nhận điểm để thăng hạng trên HanziGo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="p-1.5 rounded-xl text-[#748092] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#243447] dark:text-white">Hoàn thành bài học lộ trình HSK</div>
                  <div className="text-[11px] text-[#748092]">Học qua 9 bước tương tác và vượt bài kiểm tra</div>
                </div>
                <span className="font-mono font-black text-[#E85D3F] text-sm">+50 XP</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#243447] dark:text-white">Vượt ải Boss kết thúc Level</div>
                  <div className="text-[11px] text-[#748092]">Thử thách tình huống thực tế áp lực cao</div>
                </div>
                <span className="font-mono font-black text-amber-500 text-sm">+200 XP</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#243447] dark:text-white">Luyện phát âm chuẩn xác với Mic</div>
                  <div className="text-[11px] text-[#748092]">AI phân tích thanh điệu và ngữ âm đạt chuẩn</div>
                </div>
                <span className="font-mono font-black text-emerald-600 text-sm">+15 XP</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#243447] dark:text-white">Tập viết chữ Hán đúng nét thuận bút</div>
                  <div className="text-[11px] text-[#748092]">Hoàn thành luyện viết từng nét theo mẫu</div>
                </div>
                <span className="font-mono font-black text-orange-500 text-sm">+15 XP</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#243447] dark:text-white">Nhiệm vụ ngày & Duy trì Streak</div>
                  <div className="text-[11px] text-[#748092]">Đăng nhập và học tập liên tục mỗi ngày</div>
                </div>
                <span className="font-mono font-black text-purple-600 text-sm">+20 - 30 XP</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#243447] dark:text-white">Tương tác và chia sẻ kinh nghiệm</div>
                  <div className="text-[11px] text-[#748092]">Đăng bài hỏi đáp và tìm bạn luyện nói 1-1</div>
                </div>
                <span className="font-mono font-black text-blue-600 text-sm">+20 XP</span>
              </div>
            </div>

            {/* Danh hiệu hệ thống */}
            <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
              <div className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
                <Award size={14} className="text-amber-500" />
                <span>Hệ thống danh hiệu HanziGo:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {XP_HONORIFIC_TITLES.map((t, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                    <span className="font-bold">{t.title}</span>
                    <span className="font-mono text-[#748092]">≥ {t.minXp} XP</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Đã hiểu, quay lại bảng xếp hạng
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
