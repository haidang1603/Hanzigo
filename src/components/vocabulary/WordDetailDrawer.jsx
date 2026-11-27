import React from 'react';
import {
  Plus,
  X,
  PenTool,
  BookmarkPlus,
} from 'lucide-react';
import AudioButton from '../AudioButton';
import { QUICK_VOCAB_SUGGESTIONS } from './vocabularyConstants';

export function DictionaryWordDetailModal({
  selectedDictWord,
  setSelectedDictWord,
  handleSaveDictToSrs,
  onSelectWriting,
  setActiveTab,
}) {
  if (!selectedDictWord) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90dvh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-start justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-['Noto_Serif_SC'] text-4xl font-black text-[#243447] dark:text-white">
                {selectedDictWord.hanzi || selectedDictWord.simplified}
              </span>
              {selectedDictWord.traditional &&
                selectedDictWord.traditional !==
                  (selectedDictWord.hanzi || selectedDictWord.simplified) && (
                  <span
                    className="font-['Noto_Serif_SC'] text-lg text-slate-400"
                    title="Chữ phồn thể"
                  >
                    ({selectedDictWord.traditional})
                  </span>
                )}
              <AudioButton
                text={selectedDictWord.hanzi || selectedDictWord.simplified}
                size="md"
              />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base font-bold text-[#E85D3F]">
                {selectedDictWord.pinyin}
              </span>
              {selectedDictWord.hanviet && (
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  • {selectedDictWord.hanviet}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setSelectedDictWord(null)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedDictWord.level && (
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold">
              {selectedDictWord.level}
            </span>
          )}
          {selectedDictWord.pos && (
            <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold">
              {selectedDictWord.pos}
            </span>
          )}
          <span
            className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
              selectedDictWord.qualityStatus === 'verified_human'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {selectedDictWord.qualityStatus === 'verified_human'
              ? '✓ Nghĩa tiếng Việt đã kiểm duyệt'
              : 'Nguồn CC-CEDICT (CC BY-SA 4.0)'}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#748092]">
            Ý nghĩa &amp; Định nghĩa:
          </h4>
          {selectedDictWord.meaningVi && (
            <p className="text-sm font-bold text-[#45B97C] bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              {selectedDictWord.meaningVi}
            </p>
          )}
          {Array.isArray(selectedDictWord.definitions) &&
          selectedDictWord.definitions.length > 0 ? (
            <ul className="space-y-1 pl-4 list-disc text-xs text-[#243447] dark:text-slate-300">
              {selectedDictWord.definitions.map((def, dIdx) => (
                <li key={dIdx}>{def}</li>
              ))}
            </ul>
          ) : selectedDictWord.meaningEn ? (
            <p className="text-xs italic text-[#748092]">
              {selectedDictWord.meaningEn}
            </p>
          ) : null}
        </div>

        {selectedDictWord.decomposition && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
            <span className="font-bold text-[#243447] dark:text-white">
              Chiết tự &amp; Kết cấu:
            </span>
            <p className="text-[#748092] dark:text-slate-400">
              {selectedDictWord.decomposition.structureType} • Chuỗi IDS:{' '}
              <code className="font-mono text-amber-600">
                {selectedDictWord.decomposition.idsSequence}
              </code>
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedDictWord(null);
              if (onSelectWriting) onSelectWriting(selectedDictWord);
              else setActiveTab?.('writing');
            }}
            className="px-3 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center gap-1.5 hover:bg-orange-100 transition-colors cursor-pointer"
          >
            <PenTool size={14} />
            <span>Tập viết chữ</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              handleSaveDictToSrs(e, selectedDictWord);
            }}
            className="px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
          >
            <BookmarkPlus size={14} />
            <span>+ Thêm vào Flashcard SRS</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddCustomVocabModal({
  showAddModal,
  setShowAddModal,
  handleApplySuggestion,
  handleAddNewVocab,
  newHanzi,
  setNewHanzi,
  matchedVocabInDict,
  handleApplyDictMatch,
  newPinyin,
  setNewPinyin,
  newHanviet,
  setNewHanviet,
  newMeaning,
  setNewMeaning,
  newLevel,
  setNewLevel,
  newTopic,
  setNewTopic,
  newRadical,
  setNewRadical,
  newStrokes,
  setNewStrokes,
  newMnemonic,
  setNewMnemonic,
  newExampleHanzi,
  setNewExampleHanzi,
  newExamplePinyin,
  setNewExamplePinyin,
  newExampleMeaning,
  setNewExampleMeaning,
}) {
  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90dvh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
          <div>
            <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
              <Plus size={18} className="text-[#E85D3F]" />
              <span>Thêm Từ Vựng Mới Muốn Học</span>
            </h3>
            <p className="text-xs text-[#748092]">
              Tự tạo flashcard từ vựng riêng để ghi nhớ theo lộ trình học của bạn.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(false)}
            className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#748092] uppercase tracking-wider block">
            ⚡ Gợi ý từ thông dụng (Nhấn để điền nhanh):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_VOCAB_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySuggestion(sug)}
                className="px-2.5 py-1 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:text-[#E85D3F] transition-all font-medium flex items-center gap-1 cursor-pointer"
              >
                <span className="font-bold">{sug.hanzi}</span>
                <span className="text-[10px] text-[#748092]">({sug.meaning})</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleAddNewVocab} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#243447] dark:text-white">
              Chữ Hán (Hanzi) *
            </label>
            <input
              type="text"
              required
              value={newHanzi}
              onChange={(e) => setNewHanzi(e.target.value)}
              placeholder="Ví dụ: 猫, 咖啡 hoặc 赋能"
              className="w-full px-4 py-3 rounded-2xl text-lg font-['Noto_Serif_SC'] font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
            />
          </div>

          {matchedVocabInDict && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="text-xs text-amber-900 dark:text-amber-200">
                <p className="font-bold flex items-center gap-1">
                  <span>
                    💡 Tìm thấy &ldquo;{matchedVocabInDict.hanzi}&rdquo; trong từ điển!
                  </span>
                </p>
                <p className="text-[11px] opacity-80">
                  Pinyin: {matchedVocabInDict.pinyin} • Nghĩa:{' '}
                  {matchedVocabInDict.meaning}
                </p>
              </div>
              <button
                type="button"
                onClick={handleApplyDictMatch}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 transition-colors shadow-sm cursor-pointer"
              >
                Tự điền nhanh
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#243447] dark:text-white">
                Phiên âm Pinyin
              </label>
              <input
                type="text"
                value={newPinyin}
                onChange={(e) => setNewPinyin(e.target.value)}
                placeholder="Ví dụ: māo"
                className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#243447] dark:text-white">
                Âm Hán-Việt
              </label>
              <input
                type="text"
                value={newHanviet}
                onChange={(e) => setNewHanviet(e.target.value)}
                placeholder="Ví dụ: Miêu"
                className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#243447] dark:text-white">
                Nghĩa tiếng Việt *
              </label>
              <input
                type="text"
                required
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                placeholder="Ví dụ: Con mèo"
                className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#243447] dark:text-white">
                Cấp độ HSK
              </label>
              <select
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
              >
                <option value="HSK 1">HSK 1</option>
                <option value="HSK 2">HSK 2</option>
                <option value="HSK 3">HSK 3</option>
                <option value="HSK 4">HSK 4</option>
                <option value="HSK 5">HSK 5</option>
                <option value="HSK 6">HSK 6</option>
                <option value="HSK 7-9">HSK 7–9 (HSK 3.0 Cao cấp)</option>
                <option value="Tự học">Tự học</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#243447] dark:text-white">
                Chủ đề
              </label>
              <select
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
              >
                <option value="Đời sống">Đời sống</option>
                <option value="Ăn uống">Ăn uống</option>
                <option value="Chào hỏi">Chào hỏi</option>
                <option value="Gia đình">Gia đình</option>
                <option value="Trường học">Trường học</option>
                <option value="Mua sắm">Mua sắm</option>
                <option value="Công việc">Công việc</option>
                <option value="Du lịch">Du lịch</option>
                <option value="Công nghệ">Công nghệ</option>
                <option value="Cảm xúc">Cảm xúc</option>
                <option value="Thời gian">Thời gian</option>
                <option value="Kinh tế & Học thuật">Kinh tế &amp; Học thuật</option>
              </select>
            </div>
          </div>

          {/* Radical & Strokes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#243447] dark:text-white">
                Bộ thủ (Tùy chọn)
              </label>
              <input
                type="text"
                value={newRadical}
                onChange={(e) => setNewRadical(e.target.value)}
                placeholder="Ví dụ: 犭(Khuyển)"
                className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#243447] dark:text-white">
                Số nét bút (Tùy chọn)
              </label>
              <input
                type="number"
                value={newStrokes}
                onChange={(e) => setNewStrokes(e.target.value)}
                placeholder="Ví dụ: 11"
                className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
              />
            </div>
          </div>

          {/* Mnemonic Tip */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#243447] dark:text-white">
              Mẹo nhớ chữ qua chiết tự (Mnemonic)
            </label>
            <textarea
              rows={2}
              value={newMnemonic}
              onChange={(e) => setNewMnemonic(e.target.value)}
              placeholder="Ví dụ: Loài thú (犭) kêu meo meo trên đồng ruộng (苗)..."
              className="w-full px-3 py-2 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
            />
          </div>

          {/* Example Sentence Inputs */}
          <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
            <span className="text-[11px] font-bold text-[#E85D3F] uppercase tracking-wider block">
              Câu ví dụ thực tế (Tùy chọn)
            </span>

            <input
              type="text"
              value={newExampleHanzi}
              onChange={(e) => setNewExampleHanzi(e.target.value)}
              placeholder="Chữ Hán: 我家有一只可爱的小猫。"
              className="w-full px-3 py-2 rounded-xl text-base sm:text-sm bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
            />

            <input
              type="text"
              value={newExamplePinyin}
              onChange={(e) => setNewExamplePinyin(e.target.value)}
              placeholder="Pinyin: Wǒ jiā yǒu yì zhī kě’ài de xiǎomāo."
              className="w-full px-3 py-2 rounded-xl text-base sm:text-sm bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
            />

            <input
              type="text"
              value={newExampleMeaning}
              onChange={(e) => setNewExampleMeaning(e.target.value)}
              placeholder="Nghĩa: Nhà tôi có một chú mèo con rất đáng yêu."
              className="w-full px-3 py-2 rounded-xl text-base sm:text-sm bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={!newHanzi.trim() || !newMeaning.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} />
              <span>Lưu &amp; Học từ này ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function WordDetailDrawer({
  selectedDictWord,
  setSelectedDictWord,
  handleSaveDictToSrs,
  onSelectWriting,
  setActiveTab,
  showAddModal,
  setShowAddModal,
  handleApplySuggestion,
  handleAddNewVocab,
  newHanzi,
  setNewHanzi,
  matchedVocabInDict,
  handleApplyDictMatch,
  newPinyin,
  setNewPinyin,
  newHanviet,
  setNewHanviet,
  newMeaning,
  setNewMeaning,
  newLevel,
  setNewLevel,
  newTopic,
  setNewTopic,
  newRadical,
  setNewRadical,
  newStrokes,
  setNewStrokes,
  newMnemonic,
  setNewMnemonic,
  newExampleHanzi,
  setNewExampleHanzi,
  newExamplePinyin,
  setNewExamplePinyin,
  newExampleMeaning,
  setNewExampleMeaning,
}) {
  return (
    <>
      <DictionaryWordDetailModal
        selectedDictWord={selectedDictWord}
        setSelectedDictWord={setSelectedDictWord}
        handleSaveDictToSrs={handleSaveDictToSrs}
        onSelectWriting={onSelectWriting}
        setActiveTab={setActiveTab}
      />
      <AddCustomVocabModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        handleApplySuggestion={handleApplySuggestion}
        handleAddNewVocab={handleAddNewVocab}
        newHanzi={newHanzi}
        setNewHanzi={setNewHanzi}
        matchedVocabInDict={matchedVocabInDict}
        handleApplyDictMatch={handleApplyDictMatch}
        newPinyin={newPinyin}
        setNewPinyin={setNewPinyin}
        newHanviet={newHanviet}
        setNewHanviet={setNewHanviet}
        newMeaning={newMeaning}
        setNewMeaning={setNewMeaning}
        newLevel={newLevel}
        setNewLevel={setNewLevel}
        newTopic={newTopic}
        setNewTopic={setNewTopic}
        newRadical={newRadical}
        setNewRadical={setNewRadical}
        newStrokes={newStrokes}
        setNewStrokes={setNewStrokes}
        newMnemonic={newMnemonic}
        setNewMnemonic={setNewMnemonic}
        newExampleHanzi={newExampleHanzi}
        setNewExampleHanzi={setNewExampleHanzi}
        newExamplePinyin={newExamplePinyin}
        setNewExamplePinyin={setNewExamplePinyin}
        newExampleMeaning={newExampleMeaning}
        setNewExampleMeaning={setNewExampleMeaning}
      />
    </>
  );
}
