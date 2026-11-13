import React, { useEffect, useState } from 'react';
import { BookMarked } from 'lucide-react';
import {
  buildReviewSessionItems,
  createVocabDeck,
  listVocabDecks,
  listVocabItems,
  markVocabItemAsMastered,
  type MultiModalReviewCard,
  type ReviewModalMode,
  type UserVocabItem,
  type VocabDeck,
} from '../../services/vocabWorkspaceService.ts';
import { VocabWorkspaceDashboard } from './VocabWorkspaceDashboard.tsx';
import { SmartFlashcardSession } from './SmartFlashcardSession.tsx';

interface VocabularyWorkspaceProps {
  user?: { id?: string | null } | null;
}

export const VocabularyWorkspace: React.FC<VocabularyWorkspaceProps> = ({ user }) => {
  const [decks, setDecks] = useState<VocabDeck[]>([]);
  const [items, setItems] = useState<UserVocabItem[]>([]);
  const [activeCards, setActiveCards] = useState<MultiModalReviewCard[] | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([listVocabDecks(user), listVocabItems(user)]).then(([loadedDecks, loadedItems]) => {
      if (!active) return;
      setDecks(loadedDecks);
      setItems(loadedItems);
    });
    return () => {
      active = false;
    };
  }, [user]);

  const handleCreateDeck = async (name: string, description: string, colorHex: string) => {
    const created = await createVocabDeck({ name, description, color_hex: colorHex }, user);
    setDecks((prev) => [...prev, created]);
  };

  const handleStartReview = (
    targetItems: UserVocabItem[],
    mode: 'mixed' | ReviewModalMode
  ) => {
    if (targetItems.length === 0) return;
    const cards = buildReviewSessionItems(targetItems, items, mode);
    setActiveCards(cards);
  };

  const handleItemUpdated = (updated: UserVocabItem) => {
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
  };

  const handleMarkMastered = async (itemId: string) => {
    const updatedList = await markVocabItemAsMastered(itemId, user);
    setItems(updatedList);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <BookMarked className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Vocabulary Workspace</h1>
          <p className="text-xs text-slate-500">
            Quản lý Decks, ngữ cảnh nguồn, ghi chú cá nhân &amp; ôn tập SRS đa chiều
          </p>
        </div>
      </div>

      {activeCards ? (
        <SmartFlashcardSession
          cards={activeCards}
          user={user}
          onItemUpdated={handleItemUpdated}
          onExit={() => setActiveCards(null)}
        />
      ) : (
        <VocabWorkspaceDashboard
          decks={decks}
          items={items}
          onCreateDeck={handleCreateDeck}
          onStartReview={handleStartReview}
          onMarkMastered={(id) => void handleMarkMastered(id)}
        />
      )}
    </div>
  );
};

