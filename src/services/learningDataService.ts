/**
 * =========================================================================
 * HANZIGO — LEARNING DATA FOUNDATION (TASK 26.01)
 * =========================================================================
 * Unified TypeScript telemetry ingestion pipeline, event normalizer,
 * offline fallback queue, and granular Error Classifier Engine across:
 *   - lesson
 *   - srs_review
 *   - hanzi_writer
 *   - cbt_mock_exam
 *   - writing_eval
 * =========================================================================
 */

import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { isValidUuid } from './authService.js';

export const SOURCE_MODULES = [
  'lesson',
  'srs_review',
  'hanzi_writer',
  'cbt_mock_exam',
  'writing_eval',
] as const;

export type SourceModule = (typeof SOURCE_MODULES)[number];

export const SKILL_DOMAINS = [
  'listening',
  'reading',
  'writing',
  'translation',
  'speaking',
  'vocabulary',
  'grammar',
  'stroke_order',
] as const;

export type SkillDomain = (typeof SKILL_DOMAINS)[number];

export const ERROR_CATEGORIES = [
  'tone_confusion',
  'radical_stroke_error',
  'synonym_nuance',
  'word_order_syntax',
  'listening_homophone',
  'reading_inference',
  'translation_omission',
] as const;

export type ErrorCategory = (typeof ERROR_CATEGORIES)[number];

export const RESOLVED_STATUSES = ['active', 'reviewing', 'mastered'] as const;
export type ResolvedStatus = (typeof RESOLVED_STATUSES)[number];

export interface LearningEventInput {
  id?: string;
  userId?: string | null;
  sessionId?: string | null;
  sourceModule: SourceModule;
  hskLevel?: number | string;
  skillDomain?: SkillDomain;
  itemId: string;
  isCorrect?: boolean;
  scoreEarned?: number;
  scoreMax?: number;
  durationMs?: number;
  userAnswer?: unknown;
  expectedAnswer?: unknown;
  payload?: Record<string, unknown>;
  createdAt?: string;
}

export interface NormalizedLearningEvent {
  id: string;
  user_id: string | null;
  session_id: string;
  source_module: SourceModule;
  hsk_level: number;
  skill_domain: SkillDomain;
  item_id: string;
  is_correct: boolean;
  score_earned: number;
  score_max: number;
  duration_ms: number;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface MistakeClassificationResult {
  error_category: ErrorCategory;
  hsk_level: number;
  target_entity_id: string;
  user_answer: Record<string, unknown>;
  expected_answer: Record<string, unknown>;
  confidence: number;
  reason: string;
}

export interface UserMistakeRecord {
  id: string;
  user_id: string | null;
  error_category: ErrorCategory;
  hsk_level: number;
  target_entity_id: string;
  user_answer: Record<string, unknown>;
  expected_answer: Record<string, unknown>;
  occurrence_count: number;
  resolved_status: ResolvedStatus;
  last_mistake_at: string;
}

export interface RecordLearningEventResult {
  event: NormalizedLearningEvent;
  mistakeRecord: UserMistakeRecord | null;
  queuedOffline: boolean;
  flushed: boolean;
}

const OFFLINE_TELEMETRY_QUEUE_KEY = 'hanzigo_telemetry_offline_queue_v1';
const LOCAL_MISTAKE_RECORDS_KEY = 'hanzigo_user_mistake_records_v1';
const SESSION_STORAGE_KEY = 'hanzigo_learning_session_id';

const DEFAULT_FLUSH_DEBOUNCE_MS = 1500;
const MAX_BATCH_SIZE = 25;
const MAX_OFFLINE_QUEUE_SIZE = 500;

let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushDebounceMs = DEFAULT_FLUSH_DEBOUNCE_MS;
let isFlushing = false;
let onlineListenerRegistered = false;

const DEFAULT_SKILL_BY_MODULE: Record<SourceModule, SkillDomain> = {
  lesson: 'reading',
  srs_review: 'vocabulary',
  hanzi_writer: 'stroke_order',
  cbt_mock_exam: 'reading',
  writing_eval: 'writing',
};

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getActiveSessionId(): string {
  if (typeof sessionStorage === 'undefined') {
    return generateUuid();
  }
  try {
    const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing && isValidUuid(existing)) return existing;
    const fresh = generateUuid();
    sessionStorage.setItem(SESSION_STORAGE_KEY, fresh);
    return fresh;
  } catch {
    return generateUuid();
  }
}

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key: string, value: unknown): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('learningDataService storage write error:', err);
  }
}

function clampHskLevel(level: number | string | undefined): number {
  if (typeof level === 'number' && Number.isFinite(level)) {
    return Math.min(9, Math.max(1, Math.round(level)));
  }
  if (typeof level === 'string') {
    const digits = parseInt(level.replace(/\D/g, ''), 10);
    if (Number.isFinite(digits)) {
      return Math.min(9, Math.max(1, digits));
    }
  }
  return 1;
}

function wrapAnswerJson(value: unknown): Record<string, unknown> {
  if (value === null || value === undefined) return {};
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return { value };
}

function extractTextValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const candidate = obj.pinyin ?? obj.text ?? obj.value ?? obj.answer ?? obj.hanzi ?? '';
    return typeof candidate === 'string' ? candidate.trim() : String(candidate ?? '').trim();
  }
  return '';
}

function extractPinyinValue(value: unknown, fallback = ''): string {
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.pinyin === 'string') return obj.pinyin.trim();
  }
  return fallback.trim();
}

const TONE_DIACRITICS_MAP: Record<string, string> = {
  ā: 'a', á: 'a', ǎ: 'a', à: 'a',
  ē: 'e', é: 'e', ě: 'e', è: 'e',
  ī: 'i', í: 'i', ǐ: 'i', ì: 'i',
  ō: 'o', ó: 'o', ǒ: 'o', ò: 'o',
  ū: 'u', ú: 'u', ǔ: 'u', ù: 'u',
  ǖ: 'v', ǘ: 'v', ǚ: 'v', ǜ: 'v', ü: 'v',
};

function stripPinyinTones(pinyin: string): string {
  return pinyin
    .toLowerCase()
    .replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, (ch) => TONE_DIACRITICS_MAP[ch] ?? ch)
    .replace(/[1-5]/g, '')
    .replace(/[\s'’]+/g, ' ')
    .trim();
}

function hasToneMarksOrNumbers(text: string): boolean {
  return /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]|[a-zü]+[1-5]\b/i.test(text);
}

function normalizeTokens(text: string): string[] {
  const cleaned = text
    .toLowerCase()
    .replace(/[.,!?;:"'""''()（）【】[\]{}，。！？、；：]/g, ' ')
    .trim();
  if (!cleaned) return [];
  const spaceTokens = cleaned.split(/\s+/).filter(Boolean);
  if (spaceTokens.length > 1) return spaceTokens;
  // For unspaced Chinese strings, split into CJK characters
  return Array.from(cleaned.replace(/\s+/g, ''));
}

function hasSameMultisetDifferentOrder(a: string, b: string): boolean {
  if (!a || !b || a === b) return false;
  const tokensA = normalizeTokens(a);
  const tokensB = normalizeTokens(b);
  if (tokensA.length < 2 || tokensA.length !== tokensB.length) return false;
  const sortedA = [...tokensA].sort().join('|');
  const sortedB = [...tokensB].sort().join('|');
  return sortedA === sortedB;
}

/**
 * Configure debounce duration (primarily for testing).
 */
export function configureLearningDataService(options: { flushDebounceMs?: number } = {}): void {
  if (typeof options.flushDebounceMs === 'number' && options.flushDebounceMs >= 0) {
    flushDebounceMs = options.flushDebounceMs;
  }
}

/**
 * Normalize raw module telemetry into canonical `learning_telemetry_events` schema.
 */
export function normalizeLearningEvent(input: LearningEventInput): NormalizedLearningEvent {
  if (!input || !SOURCE_MODULES.includes(input.sourceModule)) {
    throw new Error(`Invalid sourceModule: ${String(input?.sourceModule)}`);
  }
  if (!input.itemId || String(input.itemId).trim() === '') {
    throw new Error('LearningEventInput.itemId is required');
  }

  const skillDomain: SkillDomain =
    input.skillDomain && SKILL_DOMAINS.includes(input.skillDomain)
      ? input.skillDomain
      : DEFAULT_SKILL_BY_MODULE[input.sourceModule];

  const scoreMax =
    typeof input.scoreMax === 'number' && Number.isFinite(input.scoreMax) && input.scoreMax > 0
      ? input.scoreMax
      : 1;

  const scoreEarned =
    typeof input.scoreEarned === 'number' && Number.isFinite(input.scoreEarned)
      ? Math.max(0, input.scoreEarned)
      : input.isCorrect === true
      ? scoreMax
      : 0;

  const isCorrect =
    typeof input.isCorrect === 'boolean'
      ? input.isCorrect
      : scoreEarned >= scoreMax * 0.6;

  const durationMs =
    typeof input.durationMs === 'number' && Number.isFinite(input.durationMs)
      ? Math.max(0, Math.round(input.durationMs))
      : 0;

  const payload: Record<string, unknown> = {
    ...(input.payload ?? {}),
  };

  if (input.userAnswer !== undefined && payload.userAnswer === undefined) {
    payload.userAnswer = input.userAnswer;
  }
  if (input.expectedAnswer !== undefined && payload.expectedAnswer === undefined) {
    payload.expectedAnswer = input.expectedAnswer;
  }

  return {
    id: input.id && isValidUuid(input.id) ? input.id : generateUuid(),
    user_id: input.userId && isValidUuid(input.userId) ? input.userId : null,
    session_id:
      input.sessionId && isValidUuid(input.sessionId)
        ? input.sessionId
        : getActiveSessionId(),
    source_module: input.sourceModule,
    hsk_level: clampHskLevel(input.hskLevel),
    skill_domain: skillDomain,
    item_id: String(input.itemId).trim(),
    is_correct: isCorrect,
    score_earned: scoreEarned,
    score_max: scoreMax,
    duration_ms: durationMs,
    payload,
    created_at: input.createdAt ?? new Date().toISOString(),
  };
}

/**
 * Automatic Error Classifier Engine:
 * Inspects wrong answers across CBT Reading/Listening, SRS flashcards,
 * Hanzi Writer stroke mismatches, lessons, and writing evaluations.
 */
export function classifyLearningError(
  eventOrInput: NormalizedLearningEvent | LearningEventInput
): MistakeClassificationResult | null {
  const event =
    'source_module' in eventOrInput
      ? eventOrInput
      : normalizeLearningEvent(eventOrInput);

  if (event.is_correct) return null;

  const payload = event.payload ?? {};
  const rawUserAnswer = payload.userAnswer;
  const rawExpectedAnswer = payload.expectedAnswer;

  const userAnswer = wrapAnswerJson(rawUserAnswer);
  const expectedAnswer = wrapAnswerJson(rawExpectedAnswer);

  const userText = extractTextValue(rawUserAnswer);
  const expectedText = extractTextValue(rawExpectedAnswer);
  const userPinyin = extractPinyinValue(rawUserAnswer, String(payload.userPinyin ?? ''));
  const expectedPinyin = extractPinyinValue(rawExpectedAnswer, String(payload.expectedPinyin ?? ''));

  const strokeMistakes = Number(payload.strokeMistakes ?? payload.totalMistakes ?? 0);
  const toneScore = typeof payload.toneScore === 'number' ? payload.toneScore : null;
  const questionType = String(payload.questionType ?? payload.errorHint ?? '').toLowerCase();

  let error_category: ErrorCategory;
  let confidence = 0.85;
  let reason = '';

  // 1. Hanzi Writer / Stroke order / Radical mismatch
  if (
    event.source_module === 'hanzi_writer' ||
    event.skill_domain === 'stroke_order' ||
    strokeMistakes > 0 ||
    payload.radicalMismatch === true
  ) {
    error_category = 'radical_stroke_error';
    confidence = 0.96;
    reason = 'Stroke order or radical mismatch detected in Hanzi Writer / stroke_order';
  }
  // 2. Tone confusion (same base syllable, different tone marks/numbers or low toneScore)
  else if (
    (toneScore !== null && toneScore < 65) ||
    (userPinyin &&
      expectedPinyin &&
      userPinyin.toLowerCase() !== expectedPinyin.toLowerCase() &&
      stripPinyinTones(userPinyin) === stripPinyinTones(expectedPinyin)) ||
    (userText &&
      expectedText &&
      hasToneMarksOrNumbers(userText) &&
      hasToneMarksOrNumbers(expectedText) &&
      userText.toLowerCase() !== expectedText.toLowerCase() &&
      stripPinyinTones(userText) === stripPinyinTones(expectedText))
  ) {
    error_category = 'tone_confusion';
    confidence = 0.94;
    reason = 'Pinyin base syllable matches but tone diacritic/number differs';
  }
  // 3. Word order / syntax (reordering or grammar syntax error)
  else if (
    questionType.includes('order') ||
    questionType.includes('syntax') ||
    questionType.includes('reorder') ||
    event.skill_domain === 'grammar' ||
    hasSameMultisetDifferentOrder(userText, expectedText)
  ) {
    error_category = 'word_order_syntax';
    confidence = 0.9;
    reason = 'Grammar syntax or token ordering mismatch';
  }
  // 4. Listening homophone
  else if (
    event.skill_domain === 'listening' ||
    payload.isHomophone === true
  ) {
    error_category = 'listening_homophone';
    confidence = payload.isHomophone === true ? 0.95 : 0.86;
    reason = 'Listening comprehension mismatch or homophone confusion';
  }
  // 5. Translation omission (missing keywords/clauses or writing/translation truncation)
  else if (
    event.skill_domain === 'translation' ||
    questionType.includes('translation') ||
    (Array.isArray(payload.missingKeywords) && payload.missingKeywords.length > 0) ||
    (event.source_module === 'writing_eval' &&
      expectedText.length > 0 &&
      userText.length < expectedText.length * 0.75)
  ) {
    error_category = 'translation_omission';
    confidence = 0.88;
    reason = 'Missing expected keywords or incomplete translation/writing';
  }
  // 6. Vocabulary / SRS synonym nuance
  else if (
    event.source_module === 'srs_review' ||
    event.skill_domain === 'vocabulary' ||
    payload.isSynonymTrap === true
  ) {
    error_category = 'synonym_nuance';
    confidence = 0.87;
    reason = 'Vocabulary / SRS meaning or synonym distinction mismatch';
  }
  // 7. Reading inference (CBT Reading / Lesson comprehension)
  else {
    error_category = 'reading_inference';
    confidence = 0.84;
    reason = 'Reading comprehension / inference mismatch';
  }

  return {
    error_category,
    hsk_level: event.hsk_level,
    target_entity_id: String(payload.targetEntityId ?? event.item_id),
    user_answer: userAnswer,
    expected_answer: expectedAnswer,
    confidence,
    reason,
  };
}

function upsertLocalMistakeRecord(
  userId: string | null,
  classification: MistakeClassificationResult,
  timestampIso: string
): UserMistakeRecord {
  const records = safeReadJson<UserMistakeRecord[]>(LOCAL_MISTAKE_RECORDS_KEY, []);
  const idx = records.findIndex(
    (r) =>
      r.user_id === userId &&
      r.error_category === classification.error_category &&
      r.target_entity_id === classification.target_entity_id
  );

  let updated: UserMistakeRecord;
  if (idx >= 0) {
    const existing = records[idx];
    updated = {
      ...existing,
      hsk_level: classification.hsk_level,
      user_answer: classification.user_answer,
      expected_answer: classification.expected_answer,
      occurrence_count: (existing.occurrence_count || 1) + 1,
      resolved_status: 'active',
      last_mistake_at: timestampIso,
    };
    records[idx] = updated;
  } else {
    updated = {
      id: generateUuid(),
      user_id: userId,
      error_category: classification.error_category,
      hsk_level: classification.hsk_level,
      target_entity_id: classification.target_entity_id,
      user_answer: classification.user_answer,
      expected_answer: classification.expected_answer,
      occurrence_count: 1,
      resolved_status: 'active',
      last_mistake_at: timestampIso,
    };
    records.unshift(updated);
  }

  safeWriteJson(LOCAL_MISTAKE_RECORDS_KEY, records.slice(0, MAX_OFFLINE_QUEUE_SIZE));
  return updated;
}

export function getLocalMistakeRecords(userId?: string | null): UserMistakeRecord[] {
  const records = safeReadJson<UserMistakeRecord[]>(LOCAL_MISTAKE_RECORDS_KEY, []);
  if (userId === undefined) return records;
  return records.filter((r) => r.user_id === userId);
}

export function getPendingLearningEvents(): NormalizedLearningEvent[] {
  return safeReadJson<NormalizedLearningEvent[]>(OFFLINE_TELEMETRY_QUEUE_KEY, []);
}

function enqueueOfflineTelemetry(event: NormalizedLearningEvent): void {
  const queue = getPendingLearningEvents();
  queue.push(event);
  const trimmed =
    queue.length > MAX_OFFLINE_QUEUE_SIZE
      ? queue.slice(queue.length - MAX_OFFLINE_QUEUE_SIZE)
      : queue;
  safeWriteJson(OFFLINE_TELEMETRY_QUEUE_KEY, trimmed);
}

function isBrowserOnline(): boolean {
  if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
    return navigator.onLine;
  }
  return true;
}

function ensureOnlineListener(): void {
  if (onlineListenerRegistered) return;
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('online', () => {
      void flushLearningEvents();
    });
    onlineListenerRegistered = true;
  }
}

function scheduleDebouncedFlush(): void {
  ensureOnlineListener();
  if (flushDebounceMs === 0) {
    void flushLearningEvents();
    return;
  }
  if (flushTimer !== null) {
    clearTimeout(flushTimer);
  }
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushLearningEvents();
  }, flushDebounceMs);
}

/**
 * Flush queued telemetry events to Supabase (`learning_telemetry_events` &
 * `upsert_user_mistake_record`). Retains un-synced events in `localStorage`
 * whenever offline or if a network error occurs.
 */
export async function flushLearningEvents(): Promise<{
  flushedCount: number;
  remainingCount: number;
}> {
  if (isFlushing) {
    return { flushedCount: 0, remainingCount: getPendingLearningEvents().length };
  }

  if (flushTimer !== null) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  const pending = getPendingLearningEvents();
  if (pending.length === 0) {
    return { flushedCount: 0, remainingCount: 0 };
  }

  if (!isBrowserOnline() || !isSupabaseConfigured || !supabase) {
    return { flushedCount: 0, remainingCount: pending.length };
  }

  const syncable = pending.filter((ev) => ev.user_id && isValidUuid(ev.user_id));
  const localOnly = pending.filter((ev) => !ev.user_id || !isValidUuid(ev.user_id));

  if (syncable.length === 0) {
    return { flushedCount: 0, remainingCount: pending.length };
  }

  isFlushing = true;
  let flushedCount = 0;

  try {
    const batch = syncable.slice(0, MAX_BATCH_SIZE);
    const { error } = await supabase.from('learning_telemetry_events').insert(batch);
    if (error) {
      return { flushedCount: 0, remainingCount: pending.length };
    }

    // Also sync classified mistakes for failed items in this batch
    for (const ev of batch) {
      if (!ev.is_correct) {
        const classified = classifyLearningError(ev);
        if (classified) {
          await supabase.rpc('upsert_user_mistake_record', {
            p_error_category: classified.error_category,
            p_hsk_level: classified.hsk_level,
            p_target_entity_id: classified.target_entity_id,
            p_user_answer: classified.user_answer,
            p_expected_answer: classified.expected_answer,
            p_last_mistake_at: ev.created_at,
          });
        }
      }
    }

    flushedCount = batch.length;
    const remaining = [...syncable.slice(MAX_BATCH_SIZE), ...localOnly];
    safeWriteJson(OFFLINE_TELEMETRY_QUEUE_KEY, remaining);
    return { flushedCount, remainingCount: remaining.length };
  } catch (err) {
    console.warn('flushLearningEvents failed, keeping offline queue:', err);
    return { flushedCount: 0, remainingCount: pending.length };
  } finally {
    isFlushing = false;
  }
}

/**
 * Unified event ingestion pipeline:
 * 1. Normalizes raw event across all 5 source modules.
 * 2. Runs Error Classifier Engine on wrong answers & upserts local mistake records.
 * 3. Persists to offline queue + schedules debounced batch sync to Supabase.
 */
export async function recordLearningEvent(
  input: LearningEventInput,
  options: { immediate?: boolean } = {}
): Promise<RecordLearningEventResult> {
  const event = normalizeLearningEvent(input);

  let mistakeRecord: UserMistakeRecord | null = null;
  if (!event.is_correct) {
    const classification = classifyLearningError(event);
    if (classification) {
      mistakeRecord = upsertLocalMistakeRecord(
        event.user_id,
        classification,
        event.created_at
      );
    }
  }

  enqueueOfflineTelemetry(event);

  if (options.immediate) {
    const { flushedCount } = await flushLearningEvents();
    return {
      event,
      mistakeRecord,
      queuedOffline: flushedCount === 0,
      flushed: flushedCount > 0,
    };
  }

  scheduleDebouncedFlush();
  return {
    event,
    mistakeRecord,
    queuedOffline: true,
    flushed: false,
  };
}

/**
 * Update resolved status ('active' | 'reviewing' | 'mastered') on a mistake record.
 */
export async function updateMistakeResolvedStatus(
  targetEntityId: string,
  errorCategory: ErrorCategory,
  resolvedStatus: ResolvedStatus,
  userId?: string | null
): Promise<boolean> {
  const records = safeReadJson<UserMistakeRecord[]>(LOCAL_MISTAKE_RECORDS_KEY, []);
  let updatedAny = false;

  const nextRecords = records.map((rec) => {
    const userMatches = userId === undefined || rec.user_id === userId;
    if (
      userMatches &&
      rec.target_entity_id === targetEntityId &&
      rec.error_category === errorCategory
    ) {
      updatedAny = true;
      return { ...rec, resolved_status: resolvedStatus };
    }
    return rec;
  });

  if (updatedAny) {
    safeWriteJson(LOCAL_MISTAKE_RECORDS_KEY, nextRecords);
  }

  if (isBrowserOnline() && isSupabaseConfigured && supabase && userId && isValidUuid(userId)) {
    try {
      await supabase
        .from('user_mistake_records')
        .update({ resolved_status: resolvedStatus, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('target_entity_id', targetEntityId)
        .eq('error_category', errorCategory);
    } catch (err) {
      console.warn('Failed to sync mistake status update:', err);
    }
  }

  return updatedAny;
}

