import crypto from 'node:crypto';

export const HSK_AUDIO_BUCKET = 'hsk-audio';
export const AZURE_OUTPUT_FORMAT = 'audio-24khz-48kbitrate-mono-mp3';
export const MAX_TTS_TEXT_LENGTH = 1200;

export const VOICE_PROFILES = Object.freeze({
  female: 'zh-CN-XiaoxiaoNeural',
  male: 'zh-CN-YunxiNeural',
  dialogue: 'dialogue',
});

const DIALOGUE_LABEL_REGEX = /(?:^|[\r\n]+|\s+)(男|女|A|B|甲|乙)\s*[：:]\s*/g;

/**
 * Normalize text by removing control characters (preserving line breaks for turn parsing)
 * and collapsing redundant horizontal whitespace.
 */
export function normalizeAudioText(text = '') {
  return String(text || '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/**
 * Escape all 5 XML special characters to prevent SSML injection.
 */
export function escapeXmlSsml(text = '') {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Detect dialogue turns like "男：...\n女：..." or "A：... B：..."
 * Returns an array of turns when >= 2 distinct speaker turns exist; otherwise [].
 */
export function parseDialogueTurns(text = '') {
  const normalized = normalizeAudioText(text);
  if (!normalized) return [];

  const matches = [];
  let match;
  DIALOGUE_LABEL_REGEX.lastIndex = 0;
  while ((match = DIALOGUE_LABEL_REGEX.exec(normalized)) !== null) {
    matches.push({
      label: match[1],
      matchStart: match.index,
      contentStart: match.index + match[0].length,
    });
  }

  if (matches.length < 2) return [];

  const turns = [];
  for (let i = 0; i < matches.length; i += 1) {
    const curr = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].matchStart : normalized.length;
    const utterance = normalized.slice(curr.contentStart, nextStart).trim();
    if (!utterance) continue;
    const isMale = curr.label === '男' || curr.label === 'A' || curr.label === '甲';
    turns.push({
      speaker: curr.label,
      gender: isMale ? 'Male' : 'Female',
      voiceId: isMale ? VOICE_PROFILES.male : VOICE_PROFILES.female,
      text: utterance,
    });
  }

  return turns.length >= 2 ? turns : [];
}

/**
 * Resolve canonical voice profile ('female' | 'male' | 'dialogue').
 */
export function resolveVoiceProfile(voiceInput, text = '') {
  const raw = String(voiceInput || '').trim().toLowerCase();
  if (raw === 'dialogue') return 'dialogue';
  if (raw === 'male' || raw === 'male_standard' || raw === 'zh-cn-yunxineural') {
    return 'male';
  }
  if (raw === 'female' || raw === 'female_standard' || raw === 'zh-cn-xiaoxiaoneural' || raw === 'zh-cn-xiaoyineural' || raw === 'female_news') {
    return 'female';
  }
  // Auto / omitted: upgrade to dialogue when multi-turn speakers are present
  if (parseDialogueTurns(text).length >= 2) {
    return 'dialogue';
  }
  return 'female';
}

/**
 * Build hardened Azure Speech Services SSML at fixed 1.0x rate (client adjusts playbackRate).
 */
export function buildAzureSsml(text, voiceInput = 'auto') {
  const normalized = normalizeAudioText(text);
  const profile = resolveVoiceProfile(voiceInput, normalized);

  if (profile === 'dialogue') {
    const turns = parseDialogueTurns(normalized);
    if (turns.length >= 2) {
      const voiceBlocks = turns.map(
        (t) => `<voice xml:lang='zh-CN' name='${t.voiceId}'>${escapeXmlSsml(t.text)}</voice>`
      );
      return `<speak version='1.0' xml:lang='zh-CN'>${voiceBlocks.join("<break time='350ms'/>")}</speak>`;
    }
  }

  const voiceId = profile === 'male' ? VOICE_PROFILES.male : VOICE_PROFILES.female;
  return `<speak version='1.0' xml:lang='zh-CN'><voice xml:lang='zh-CN' name='${voiceId}'>${escapeXmlSsml(normalized)}</voice></speak>`;
}

/**
 * Content-addressed deterministic SHA-256 hash (first 32 hex chars).
 * Independent of playbackRate (always 1.0x asset).
 */
export function computeCdnAudioHash(voiceProfile, text) {
  const normalized = normalizeAudioText(text).replace(/\s+/g, ' ');
  const profile = resolveVoiceProfile(voiceProfile, normalized);
  return crypto
    .createHash('sha256')
    .update(`v1|${profile}|${normalized}`)
    .digest('hex')
    .slice(0, 32);
}

export function buildCdnAudioStoragePath(voiceProfile, hash) {
  const profile = voiceProfile === 'male' || voiceProfile === 'dialogue' ? voiceProfile : 'female';
  return `v1/${profile}/${hash.slice(0, 2)}/${hash}.mp3`;
}

export function buildPublicCdnAudioUrl(supabaseUrl, storagePath) {
  const base = String(supabaseUrl || '').trim().replace(/\/+$/, '');
  if (!base || !storagePath) return null;
  return `${base}/storage/v1/object/public/${HSK_AUDIO_BUCKET}/${storagePath}`;
}
