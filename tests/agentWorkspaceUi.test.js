import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { askAiTutor } from '../src/services/aiGateway.js';
import {
  setLearnerMemoryEnabled,
  updateControlledLearnerMemory,
  getControlledLearnerMemory,
} from '../src/services/learnerContextService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function withMockBrowserEnv(fn) {
  const origFetch = globalThis.fetch;
  const origStorage = globalThis.localStorage;
  const store = new Map();
  globalThis.localStorage = {
    get length() {
      return store.size;
    },
    key: (i) => Array.from(store.keys())[i] ?? null,
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      globalThis.fetch = origFetch;
      if (origStorage === undefined) delete globalThis.localStorage;
      else globalThis.localStorage = origStorage;
    });
}

describe('Task 10: Lão Sư Learning Workspace UI & Client Gateway', () => {
  test('1. askAiTutor forwards memory_enabled & session_summary and preserves Agent additive fields', async () => {
    await withMockBrowserEnv(async () => {
      const user = { id: 'student-ui-1', role: 'student' };
      setLearnerMemoryEnabled(user, true);
      updateControlledLearnerMemory(user, { sessionSummary: 'Đang ôn câu chữ 把' });

      let sentBody = null;
      globalThis.fetch = async (_url, init) => {
        sentBody = JSON.parse(init.body);
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: { answer: 'Giải thích chữ 把', hanzi: '把' },
            citations: [],
            evidence_status: 'grounded',
            tools_used: [{ toolName: 'lookup_grammar_pattern', ok: true }],
            ui_actions: [{ type: 'navigate', key: 'lesson', label: 'Vào bài học', route: '#lesson' }],
            pending_confirmations: [{ actionType: 'save_vocab_to_srs', label: 'Lưu 把', payload: { hanzi: '把', meaning: 'Xử lý' } }],
            agent_metadata: { trace_id: 'tr-1', memory_applied: true, cache_hit: false },
          }),
        };
      };

      const res = await askAiTutor({
        question: 'Giải thích chữ 把',
        user,
        bypassCache: true,
      });

      assert.equal(sentBody.memory_enabled, true);
      assert.equal(sentBody.session_summary, 'Đang ôn câu chữ 把');
      assert.equal(res.tools_used.length, 1);
      assert.equal(res.ui_actions.length, 1);
      assert.equal(res.pending_confirmations.length, 1);
      assert.equal(res.agent_metadata.trace_id, 'tr-1');
      assert.ok(getControlledLearnerMemory(user).recentTopics.includes('把'));
    });
  });

  test('2. AiTutorChatView renders transparency chips, Human-in-the-Loop confirmation, ui_actions & memory controls', () => {
    const src = fs.readFileSync(
      path.join(ROOT, 'src/components/depth/AiTutorChatView.jsx'),
      'utf8'
    );

    // Transparency chips
    assert.match(src, /TOOL_LABELS/);
    assert.match(src, /msg\.tools_used/);
    assert.match(src, /Cache tức thì/);

    // Human-in-the-loop confirmation card (min-h-11 touch target)
    assert.match(src, /msg\.pending_confirmations/);
    assert.match(src, /saveUserVocabSrsCard/);
    assert.match(src, /Lưu vào sổ SRS/);
    assert.match(src, /min-h-11/);

    // Smart UI action buttons
    assert.match(src, /msg\.ui_actions/);

    // Controlled Learner Memory toggle & clear button
    assert.match(src, /setLearnerMemoryEnabled/);
    assert.match(src, /clearControlledLearnerMemory/);
    assert.match(src, /Xóa ký ức AI/);

    // Mobile responsive safety (break-words, no forbidden new arbitrary CSS)
    assert.match(src, /break-words/);

    // Workspace UI Redesign checks: Slim Header, Zero-State Launchpad, Collapsible Process Pill & Docked Composer
    assert.match(src, /Cài đặt AI/);
    assert.match(src, /Tra từ & Chiết tự/);
    assert.match(src, /Ôn tập theo hồ sơ/);
    assert.match(src, /Đã tra cứu:/);
    assert.match(src, /border-l-4/);
    assert.match(src, /Lão Sư HanziGo là trợ lý AI/);
  });
});
