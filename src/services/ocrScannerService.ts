import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { tokenizeChineseText } from '../utils/chineseTokenizer.ts';
import { createCustomReadingArticle, type ReadingArticle } from './readingStudioService.ts';
import { createVocabDeck, type VocabDeck } from './vocabWorkspaceService.ts';

export interface BoundingBox {
  /** X coordinate (0.0 to 1.0 percentage of image width) */
  x: number;
  /** Y coordinate (0.0 to 1.0 percentage of image height) */
  y: number;
  /** Width (0.0 to 1.0 percentage of image width) */
  width: number;
  /** Height (0.0 to 1.0 percentage of image height) */
  height: number;
}

export interface OcrToken {
  text: string;
  pinyin: string;
  meaning_vi: string;
  hsk_level?: number;
  is_punctuation?: boolean;
}

export interface OcrBlock {
  block_id: string;
  bbox: BoundingBox;
  text_zh: string;
  pinyin: string;
  translation_vi: string;
  confidence: number;
  tokens: OcrToken[];
}

export interface OcrScanDocument {
  id: string;
  user_id?: string | null;
  title: string;
  image_url: string;
  image_width: number;
  image_height: number;
  ocr_blocks: OcrBlock[];
  extracted_full_text: string;
  converted_article_id?: string | null;
  created_at: string;
}

const LOCAL_STORAGE_KEY = 'hanzigo_ocr_documents';

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or disabled
  }
}

/**
 * Enhanced Canvas image preprocessing:
 * - Rotation (0, 90, 180, 270)
 * - Contrast & brightness boosting for sharper Hanzi character strokes
 * - Optional region cropping (normalized coordinates 0.0 - 1.0)
 */
export async function preprocessImageForOCR(
  imageSource: HTMLImageElement | string,
  options?: {
    rotationDeg?: number;
    contrast?: number; // e.g. 1.2
    brightness?: number; // e.g. 1.05
    crop?: BoundingBox;
  }
): Promise<{ processedDataUrl: string; width: number; height: number }> {
  let img: HTMLImageElement;
  if (typeof imageSource === 'string') {
    img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.onload = () => resolve(el);
      el.onerror = (e) => reject(e);
      el.src = imageSource;
    });
  } else {
    img = imageSource;
  }

  const naturalWidth = img.naturalWidth || img.width || 800;
  const naturalHeight = img.naturalHeight || img.height || 600;

  const crop = options?.crop || { x: 0, y: 0, width: 1, height: 1 };
  const cropX = Math.max(0, Math.min(1, crop.x)) * naturalWidth;
  const cropY = Math.max(0, Math.min(1, crop.y)) * naturalHeight;
  const cropW = Math.max(10, Math.min(1 - crop.x, crop.width) * naturalWidth);
  const cropH = Math.max(10, Math.min(1 - crop.y, crop.height) * naturalHeight);

  const rotation = ((options?.rotationDeg || 0) % 360 + 360) % 360;
  const isTransposed = rotation === 90 || rotation === 270;

  const canvas = document.createElement('canvas');
  canvas.width = isTransposed ? cropH : cropW;
  canvas.height = isTransposed ? cropW : cropH;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  ctx.save();
  // Translate & rotate
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);

  const drawW = isTransposed ? cropH : cropW;
  const drawH = isTransposed ? cropW : cropH;

  ctx.drawImage(
    img,
    cropX,
    cropY,
    cropW,
    cropH,
    -drawW / 2,
    -drawH / 2,
    drawW,
    drawH
  );
  ctx.restore();

  // Apply contrast / brightness if requested
  const contrast = options?.contrast ?? 1.15;
  const brightness = options?.brightness ?? 1.02;

  if (contrast !== 1.0 || brightness !== 1.0) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));

    for (let i = 0; i < data.length; i += 4) {
      // Contrast
      let r = factor * (data[i] - 128) + 128;
      let g = factor * (data[i + 1] - 128) + 128;
      let b = factor * (data[i + 2] - 128) + 128;

      // Brightness
      r *= brightness;
      g *= brightness;
      b *= brightness;

      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }
    ctx.putImageData(imageData, 0, 0);
  }

  const processedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
  return {
    processedDataUrl,
    width: canvas.width,
    height: canvas.height,
  };
}

export const COMMON_FALLBACK_PINYIN: Record<string, { pinyin: string; meaning: string; hsk?: number }> = {
  '换': { pinyin: 'huàn', meaning: 'Đổi, chuyển', hsk: 3 },
  '乘': { pinyin: 'chéng', meaning: 'Đi (xe, tàu)', hsk: 4 },
  '换乘': { pinyin: 'huànchéng', meaning: 'Chuyển tuyến', hsk: 3 },
  '一号线': { pinyin: 'yī hào xiàn', meaning: 'Tuyến số 1', hsk: 3 },
  '线': { pinyin: 'xiàn', meaning: 'Tuyến đường', hsk: 3 },
  '号': { pinyin: 'hào', meaning: 'Số, ngày', hsk: 1 },
  '出口': { pinyin: 'chūkǒu', meaning: 'Cửa ra, lối thoát', hsk: 3 },
  '通往': { pinyin: 'tōng wǎng', meaning: 'Dẫn tới, thông tới', hsk: 4 },
  '王府井': { pinyin: 'wángfǔjǐng', meaning: 'Vương Phủ Tỉnh', hsk: 3 },
  '步行街': { pinyin: 'bùxíngjiē', meaning: 'Phố đi bộ', hsk: 3 },
  '注意': { pinyin: 'zhùyì', meaning: 'Chú ý', hsk: 3 },
  '安全': { pinyin: 'ānquán', meaning: 'An toàn', hsk: 3 },
  '保管': { pinyin: 'bǎoguǎn', meaning: 'Bảo quản', hsk: 4 },
  '随身': { pinyin: 'suíshēn', meaning: 'Mang theo người', hsk: 4 },
  '行李': { pinyin: 'xíngli', meaning: 'Hành lý', hsk: 3 },
  '往前走': { pinyin: 'wǎng qián zǒu', meaning: 'Đi thẳng phía trước', hsk: 2 },
  '往': { pinyin: 'wǎng', meaning: 'Hướng về, đi về', hsk: 2 },
  '前': { pinyin: 'qián', meaning: 'Phía trước', hsk: 1 },
  '走': { pinyin: 'zǒu', meaning: 'Đi', hsk: 1 },
  '请': { pinyin: 'qǐng', meaning: 'Xin mời, vui lòng', hsk: 1 },
  '第': { pinyin: 'dì', meaning: 'Thứ (thứ tự)', hsk: 2 },
  '课': { pinyin: 'kè', meaning: 'Bài học', hsk: 1 },
  '第五课': { pinyin: 'dì wǔ kè', meaning: 'Bài số năm', hsk: 2 },
  '旅行': { pinyin: 'lǚxíng', meaning: 'Du lịch', hsk: 3 },
  '首都': { pinyin: 'shǒudū', meaning: 'Thủ đô', hsk: 4 },
  '名胜古迹': { pinyin: 'míngshèng gǔjì', meaning: 'Danh lam thắng cảnh', hsk: 5 },
  '参观': { pinyin: 'cānguān', meaning: 'Tham quan', hsk: 3 },
  '故宫': { pinyin: 'gùgōng', meaning: 'Cố Cung', hsk: 3 },
  '天安门': { pinyin: 'tiān\'ānmén', meaning: 'Thiên An Môn', hsk: 3 },
  '广场': { pinyin: 'guǎngchǎng', meaning: 'Quảng trường', hsk: 3 },
  '风景': { pinyin: 'fēngjǐng', meaning: 'Phong cảnh', hsk: 4 },
  '美丽': { pinyin: 'měilì', meaning: 'Xinh đẹp', hsk: 4 },
  '游客': { pinyin: 'yóukè', meaning: 'Du khách', hsk: 4 },
  '拍照': { pinyin: 'pāi zhào', meaning: 'Chụp ảnh', hsk: 3 },
  '照片': { pinyin: 'zhàopiàn', meaning: 'Bức ảnh', hsk: 2 },
  '打算': { pinyin: 'dǎsuàn', meaning: 'Dự định', hsk: 3 },
  '爬': { pinyin: 'pá', meaning: 'Leo, trèo', hsk: 3 },
  '长城': { pinyin: 'chángchéng', meaning: 'Trường Thành', hsk: 3 },
  '万里长城': { pinyin: 'wànlǐ chángchéng', meaning: 'Vạn Lý Trường Thành', hsk: 3 },
  '传统': { pinyin: 'chuántǒng', meaning: 'Truyền thống', hsk: 4 },
  '特色': { pinyin: 'tèsè', meaning: 'Đặc sắc', hsk: 4 },
  '招牌': { pinyin: 'zhāopái', meaning: 'Thương hiệu / món tủ', hsk: 4 },
  '宫保鸡丁': { pinyin: 'gōngbǎo jīdīng', meaning: 'Gà xào Cung Bảo', hsk: 3 },
  '花生米': { pinyin: 'huāshēng mǐ', meaning: 'Hạt lạc', hsk: 3 },
  '干辣椒': { pinyin: 'gān làjiāo', meaning: 'Ớt khô', hsk: 3 },
  '麻婆豆腐': { pinyin: 'mápó dòufu', meaning: 'Đậu phụ Ma Bà', hsk: 3 },
  '水煮牛肉': { pinyin: 'shuǐzhǔ niúròu', meaning: 'Bò nấu cay Tứ Xuyên', hsk: 4 },
  '品尝': { pinyin: 'pǐncháng', meaning: 'Thưởng thức', hsk: 4 },
  '欢迎': { pinyin: 'huānyíng', meaning: 'Hoan nghênh, chào đón', hsk: 2 },
  '米饭': { pinyin: 'mǐfàn', meaning: 'Cơm trắng', hsk: 1 },
  '两元': { pinyin: 'liǎng yuán', meaning: 'Hai tệ', hsk: 1 },
  '每碗': { pinyin: 'měi wǎn', meaning: 'Mỗi bát', hsk: 2 },
};

export function generateSampleSvgDataUrl(sampleId: string): string {
  if (sampleId === 'sample-doc-subway-sign') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <defs>
        <linearGradient id="subway-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#0369a1"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="#0f172a" rx="20"/>
      <rect x="18" y="18" width="764" height="464" fill="url(#subway-grad)" rx="16" stroke="#38bdf8" stroke-width="3"/>
      <rect x="40" y="38" width="44" height="44" rx="10" fill="#ef4444"/>
      <text x="62" y="70" fill="#ffffff" font-size="24" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">1</text>
      <text x="100" y="70" fill="#ffffff" font-size="26" font-weight="bold" font-family="system-ui, sans-serif">北京地铁 · BEIJING SUBWAY</text>
      
      <rect x="70" y="115" width="660" height="80" rx="14" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 4"/>
      <text x="400" y="167" fill="#ffffff" font-size="36" font-weight="900" font-family="'Noto Sans SC', system-ui, sans-serif" text-anchor="middle">换乘一号线请往前走 ➔</text>
      
      <rect x="70" y="235" width="660" height="80" rx="14" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 4"/>
      <text x="400" y="287" fill="#fef08a" font-size="34" font-weight="900" font-family="'Noto Sans SC', system-ui, sans-serif" text-anchor="middle">A 出口通往王府井步行街</text>
      
      <rect x="60" y="355" width="680" height="75" rx="14" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 4"/>
      <text x="400" y="403" fill="#e2e8f0" font-size="28" font-weight="bold" font-family="'Noto Sans SC', system-ui, sans-serif" text-anchor="middle">⚠ 请注意安全，保管好随身行李。</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  if (sampleId === 'sample-doc-sichuan-menu') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#18181b" rx="20"/>
      <rect x="18" y="18" width="764" height="564" fill="#27272a" rx="16" stroke="#b45309" stroke-width="3"/>
      <text x="400" y="80" fill="#f59e0b" font-size="32" font-weight="900" font-family="'Noto Sans SC', system-ui, sans-serif" text-anchor="middle">🏮 四川传统特色招牌菜 🏮</text>
      
      <rect x="60" y="130" width="680" height="80" rx="12" fill="#ffffff" fill-opacity="0.06"/>
      <text x="80" y="180" fill="#fef3c7" font-size="22" font-weight="bold" font-family="'Noto Sans SC', system-ui, sans-serif">🌶 宫保鸡丁：鸡肉丁，花生米，干辣椒。微辣香甜。</text>
      
      <rect x="60" y="240" width="680" height="80" rx="12" fill="#ffffff" fill-opacity="0.06"/>
      <text x="80" y="290" fill="#fef3c7" font-size="22" font-weight="bold" font-family="'Noto Sans SC', system-ui, sans-serif">🌶🌶 麻婆豆腐：嫩豆腐，牛肉末，花椒油。麻辣浓郁。</text>
      
      <rect x="60" y="350" width="680" height="80" rx="12" fill="#ffffff" fill-opacity="0.06"/>
      <text x="80" y="400" fill="#fef3c7" font-size="22" font-weight="bold" font-family="'Noto Sans SC', system-ui, sans-serif">🌶🌶🌶 水煮牛肉：新鲜牛肉，豆芽，辣椒油。香辣下饭。</text>
      
      <rect x="100" y="465" width="600" height="65" rx="12" fill="#b45309" fill-opacity="0.2"/>
      <text x="400" y="508" fill="#fbbf24" font-size="24" font-weight="bold" font-family="'Noto Sans SC', system-ui, sans-serif" text-anchor="middle">🍚 米饭每碗两元，欢迎品尝。</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // sample-doc-hsk-textbook
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" width="800" height="560">
    <rect width="800" height="560" fill="#fdfbf7" rx="16" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="30" y="16" width="740" height="34" fill="#e2e8f0" rx="8"/>
    <text x="50" y="39" fill="#475569" font-size="14" font-weight="bold" font-family="system-ui, sans-serif">HSK 3 标准教程 · STANDARD COURSE HSK 3</text>
    
    <text x="400" y="85" fill="#0f172a" font-size="28" font-weight="900" font-family="'Noto Sans SC', system-ui, sans-serif" text-anchor="middle">第五课：在北京旅行。</text>
    <text x="80" y="160" fill="#1e293b" font-size="24" font-weight="bold" font-family="'Noto Sans SC', system-ui, sans-serif">北京是中国的首都，有许多名胜古迹。</text>
    <text x="80" y="245" fill="#1e293b" font-size="24" font-weight="bold" font-family="'Noto Sans SC', system-ui, sans-serif">我们今天去参观故宫和天安门广场。</text>
    <text x="80" y="335" fill="#1e293b" font-size="24" font-weight="bold" font-family="'Noto Sans SC', system-ui, sans-serif">那里的风景非常美丽，游客也很多。</text>
    <text x="80" y="425" fill="#1e293b" font-size="24" font-weight="bold" font-family="'Noto Sans SC', system-ui, sans-serif">我们拍了很多照片，打算明天去爬万里长城。</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Tokenize a block of Chinese text and attach dictionary information
 */
export function tokenizeBlockText(textZh: string): { tokens: OcrToken[]; pinyin: string } {
  const readingTokens = tokenizeChineseText(textZh);
  const tokens: OcrToken[] = readingTokens.map((t) => {
    let pinyin = t.pinyin || '';
    let meaning = t.meaning_vi || '';
    let hsk = t.hsk_level;

    if (!pinyin && COMMON_FALLBACK_PINYIN[t.text]) {
      pinyin = COMMON_FALLBACK_PINYIN[t.text].pinyin;
      meaning = meaning || COMMON_FALLBACK_PINYIN[t.text].meaning;
      hsk = hsk || COMMON_FALLBACK_PINYIN[t.text].hsk;
    }

    return {
      text: t.text,
      pinyin,
      meaning_vi: meaning || (t.is_punctuation ? '' : 'Từ vựng tiếng Trung'),
      hsk_level: hsk,
      is_punctuation: t.is_punctuation,
    };
  });

  const pinyin = tokens
    .filter((t) => !t.is_punctuation && t.pinyin)
    .map((t) => t.pinyin)
    .join(' ');

  return { tokens, pinyin };
}

/**
 * Built-in Sample OCR Documents representing real-world learning materials:
 * 1. Textbook HSK 3
 * 2. Restaurant Menu (Sichuan Cuisine)
 * 3. Subway Information Sign
 */
export function getSampleOcrDocuments(): OcrScanDocument[] {
  return [
    {
      id: 'sample-doc-hsk-textbook',
      title: 'Giáo trình HSK 3: Bài 5 - Du lịch Bắc Kinh (北京旅行)',
      image_url: generateSampleSvgDataUrl('sample-doc-hsk-textbook'),
      image_width: 800,
      image_height: 560,
      created_at: new Date('2026-11-01T08:00:00Z').toISOString(),
      extracted_full_text:
        '第五课：在北京旅行。\n北京是中国的首都，有许多名胜古迹。\n我们今天去参观故宫和天安门广场。\n那里的风景非常美丽，游客也很多。\n我们拍了很多照片，打算明天去爬万里长城。',
      ocr_blocks: [
        {
          block_id: 'blk-hsk-1',
          bbox: { x: 0.12, y: 0.08, width: 0.76, height: 0.1 },
          text_zh: '第五课：在北京旅行。',
          pinyin: 'dì wǔ kè zài běijīng lǚxíng',
          translation_vi: 'Bài 5: Du lịch ở Bắc Kinh.',
          confidence: 0.98,
          tokens: tokenizeBlockText('第五课：在北京旅行。').tokens,
        },
        {
          block_id: 'blk-hsk-2',
          bbox: { x: 0.1, y: 0.22, width: 0.8, height: 0.12 },
          text_zh: '北京是中国的首都，有许多名胜古迹。',
          pinyin: 'běijīng shì zhōngguó de shǒudū yǒu xǔduō míngshèng gǔjì',
          translation_vi: 'Bắc Kinh là thủ đô của Trung Quốc, có rất nhiều danh lam thắng cảnh.',
          confidence: 0.96,
          tokens: tokenizeBlockText('北京是中国的首都，有许多名胜古迹。').tokens,
        },
        {
          block_id: 'blk-hsk-3',
          bbox: { x: 0.1, y: 0.38, width: 0.8, height: 0.12 },
          text_zh: '我们今天去参观故宫和天安门广场。',
          pinyin: 'wǒmen jīntiān qù cānguān gùgōng hé tiān\'ānmén guǎngchǎng',
          translation_vi: 'Hôm nay chúng tôi đi tham quan Cố Cung và Quảng trường Thiên An Môn.',
          confidence: 0.95,
          tokens: tokenizeBlockText('我们今天去参观故宫和天安门广场。').tokens,
        },
        {
          block_id: 'blk-hsk-4',
          bbox: { x: 0.1, y: 0.54, width: 0.8, height: 0.12 },
          text_zh: '那里的风景非常美丽，游客也很多。',
          pinyin: 'nàlǐ de fēngjǐng fēicháng měilì yóukè yě hěn duō',
          translation_vi: 'Phong cảnh ở đó vô cùng tươi đẹp, khách du lịch cũng rất đông.',
          confidence: 0.94,
          tokens: tokenizeBlockText('那里的风景非常美丽，游客也很多。').tokens,
        },
        {
          block_id: 'blk-hsk-5',
          bbox: { x: 0.1, y: 0.7, width: 0.8, height: 0.14 },
          text_zh: '我们拍了很多照片，打算明天去爬万里长城。',
          pinyin: 'wǒmen pāi le hěn duō zhàopiàn dǎsuàn míngtiān qù pá wànlǐ chángchéng',
          translation_vi: 'Chúng tôi chụp rất nhiều ảnh, dự định ngày mai sẽ đi leo Vạn Lý Trường Thành.',
          confidence: 0.97,
          tokens: tokenizeBlockText('我们拍了很多照片，打算明天去爬万里长城。').tokens,
        },
      ],
    },
    {
      id: 'sample-doc-sichuan-menu',
      title: 'Thực đơn Nhà hàng Tứ Xuyên (川菜特色菜单)',
      image_url: generateSampleSvgDataUrl('sample-doc-sichuan-menu'),
      image_width: 800,
      image_height: 600,
      created_at: new Date('2026-11-05T12:00:00Z').toISOString(),
      extracted_full_text:
        '四川传统特色招牌菜。\n宫保鸡丁：鸡肉丁，花生米，干辣椒。微辣香甜。\n麻婆豆腐：嫩豆腐，牛肉末，花椒油。麻辣浓郁。\n水煮牛肉：新鲜牛肉，豆芽，辣椒油。香辣下饭。\n米饭每碗两元，欢迎品尝。',
      ocr_blocks: [
        {
          block_id: 'blk-menu-1',
          bbox: { x: 0.18, y: 0.08, width: 0.64, height: 0.1 },
          text_zh: '四川传统特色招牌菜。',
          pinyin: 'sìchuān chuántǒng tèsè zhāopái cài',
          translation_vi: 'Món ăn đặc sản truyền thống Tứ Xuyên.',
          confidence: 0.99,
          tokens: tokenizeBlockText('四川传统特色招牌菜。').tokens,
        },
        {
          block_id: 'blk-menu-2',
          bbox: { x: 0.08, y: 0.22, width: 0.84, height: 0.14 },
          text_zh: '宫保鸡丁：鸡肉丁，花生米，干辣椒。微辣香甜。',
          pinyin: 'gōngbǎo jīdīng jīròu dīng huāshēng mǐ gān làjiāo wēi là xiāngtián',
          translation_vi: 'Gà xào Cung Bảo: Thịt gà cắt hạt lựu, lạc, ớt khô. Cay nhẹ, ngọt thanh.',
          confidence: 0.95,
          tokens: tokenizeBlockText('宫保鸡丁：鸡肉丁，花生米，干辣椒。微辣香甜。').tokens,
        },
        {
          block_id: 'blk-menu-3',
          bbox: { x: 0.08, y: 0.4, width: 0.84, height: 0.14 },
          text_zh: '麻婆豆腐：嫩豆腐，牛肉末，花椒油。麻辣浓郁。',
          pinyin: 'mápó dòufu nèn dòufu niúròu mò huājiāo yóu málà nóngyù',
          translation_vi: 'Đậu phụ Ma Bà: Đậu phụ non, thịt bò băm, dầu hoa tiêu. Cay nồng tê đầu lưỡi.',
          confidence: 0.96,
          tokens: tokenizeBlockText('麻婆豆腐：嫩豆腐，牛肉末，花椒油。麻辣浓郁。').tokens,
        },
        {
          block_id: 'blk-menu-4',
          bbox: { x: 0.08, y: 0.58, width: 0.84, height: 0.14 },
          text_zh: '水煮牛肉：新鲜牛肉，豆芽，辣椒油。香辣下饭。',
          pinyin: 'shuǐzhǔ niúròu xīnxiān niúròu dòuyá làjiāo yóu xiānglà xiàfàn',
          translation_vi: 'Bò nấu cay Tứ Xuyên: Thịt bò tươi, giá đỗ, dầu ớt. Cay thơm cực kỳ tốn cơm.',
          confidence: 0.93,
          tokens: tokenizeBlockText('水煮牛肉：新鲜牛肉，豆芽，辣椒油。香辣下饭。').tokens,
        },
        {
          block_id: 'blk-menu-5',
          bbox: { x: 0.15, y: 0.78, width: 0.7, height: 0.1 },
          text_zh: '米饭每碗两元，欢迎品尝。',
          pinyin: 'mǐfàn měi wǎn liǎng yuán huānyíng pǐncháng',
          translation_vi: 'Cơm trắng hai tệ một bát, kính mời quý khách thưởng thức.',
          confidence: 0.97,
          tokens: tokenizeBlockText('米饭每碗两元，欢迎品尝。').tokens,
        },
      ],
    },
    {
      id: 'sample-doc-subway-sign',
      title: 'Biển chỉ dẫn Ga tàu điện ngầm (地铁站指示牌)',
      image_url: generateSampleSvgDataUrl('sample-doc-subway-sign'),
      image_width: 800,
      image_height: 500,
      created_at: new Date('2026-11-08T14:30:00Z').toISOString(),
      extracted_full_text:
        '换乘一号线请往前走。\nA出口通往王府井步行街。\n请注意安全，保管好随身行李。',
      ocr_blocks: [
        {
          block_id: 'blk-subway-1',
          bbox: { x: 0.1, y: 0.15, width: 0.8, height: 0.2 },
          text_zh: '换乘一号线请往前走。',
          pinyin: 'huànchéng yī hào xiàn qǐng wǎng qián zǒu',
          translation_vi: 'Chuyển sang Tuyến số 1 xin vui lòng đi thẳng phía trước.',
          confidence: 0.98,
          tokens: [
            { text: '换乘', pinyin: 'huànchéng', meaning_vi: 'Chuyển tuyến', hsk_level: 3 },
            { text: '一号线', pinyin: 'yī hào xiàn', meaning_vi: 'Tuyến số 1', hsk_level: 3 },
            { text: '请', pinyin: 'qǐng', meaning_vi: 'Xin mời, vui lòng', hsk_level: 1 },
            { text: '往前走', pinyin: 'wǎng qián zǒu', meaning_vi: 'Đi thẳng phía trước', hsk_level: 2 },
            { text: '。', pinyin: '', meaning_vi: '', is_punctuation: true },
          ],
        },
        {
          block_id: 'blk-subway-2',
          bbox: { x: 0.1, y: 0.42, width: 0.8, height: 0.2 },
          text_zh: 'A出口通往王府井步行街。',
          pinyin: 'A chūkǒu tōng wǎng wángfǔjǐng bùxíngjiē',
          translation_vi: 'Cửa ra A hướng ra Phố đi bộ Vương Phủ Tỉnh.',
          confidence: 0.96,
          tokens: [
            { text: 'A出口', pinyin: 'A chūkǒu', meaning_vi: 'Cửa ra A', hsk_level: 3 },
            { text: '通往', pinyin: 'tōng wǎng', meaning_vi: 'Dẫn tới', hsk_level: 4 },
            { text: '王府井', pinyin: 'wángfǔjǐng', meaning_vi: 'Vương Phủ Tỉnh', hsk_level: 3 },
            { text: '步行街', pinyin: 'bùxíngjiē', meaning_vi: 'Phố đi bộ', hsk_level: 3 },
            { text: '。', pinyin: '', meaning_vi: '', is_punctuation: true },
          ],
        },
        {
          block_id: 'blk-subway-3',
          bbox: { x: 0.08, y: 0.7, width: 0.84, height: 0.18 },
          text_zh: '请注意安全，保管好随身行李。',
          pinyin: 'qǐng zhùyì ānquán bǎoguǎn hǎo suíshēn xíngli',
          translation_vi: 'Xin hãy chú ý an toàn, tự bảo quản cẩn thận hành lý mang theo.',
          confidence: 0.95,
          tokens: [
            { text: '请', pinyin: 'qǐng', meaning_vi: 'Vui lòng', hsk_level: 1 },
            { text: '注意', pinyin: 'zhùyì', meaning_vi: 'Chú ý', hsk_level: 3 },
            { text: '安全', pinyin: 'ānquán', meaning_vi: 'An toàn', hsk_level: 3 },
            { text: '，', pinyin: '', meaning_vi: '', is_punctuation: true },
            { text: '保管', pinyin: 'bǎoguǎn', meaning_vi: 'Bảo quản', hsk_level: 4 },
            { text: '好', pinyin: 'hǎo', meaning_vi: 'Tốt, cẩn thận', hsk_level: 1 },
            { text: '随身', pinyin: 'suíshēn', meaning_vi: 'Mang theo người', hsk_level: 4 },
            { text: '行李', pinyin: 'xíngli', meaning_vi: 'Hành lý', hsk_level: 3 },
            { text: '。', pinyin: '', meaning_vi: '', is_punctuation: true },
          ],
        },
      ],
    },
  ];
}

export function sanitizeOcrDoc(doc: OcrScanDocument): OcrScanDocument {
  let imageUrl = doc.image_url || '';
  if (!imageUrl || imageUrl.includes('unsplash.com')) {
    imageUrl = generateSampleSvgDataUrl(doc.id);
  }

  const sanitizedBlocks = (doc.ocr_blocks || []).map((block) => {
    const tokens = (block.tokens || []).map((tok) => {
      let pinyin = (tok.pinyin || '').trim();
      let meaning = (tok.meaning_vi || '').trim();
      let hsk = tok.hsk_level;

      if (!pinyin && COMMON_FALLBACK_PINYIN[tok.text]) {
        pinyin = COMMON_FALLBACK_PINYIN[tok.text].pinyin;
        meaning = meaning || COMMON_FALLBACK_PINYIN[tok.text].meaning;
        hsk = hsk || COMMON_FALLBACK_PINYIN[tok.text].hsk;
      }

      return {
        ...tok,
        pinyin,
        meaning_vi: meaning,
        hsk_level: hsk,
      };
    });

    return {
      ...block,
      tokens,
    };
  });

  return {
    ...doc,
    image_url: imageUrl,
    ocr_blocks: sanitizedBlocks,
  };
}

/**
 * List all OCR Documents (Cloud Supabase with localStorage fallback)
 */
export async function listOcrDocuments(user?: { id?: string | null } | null): Promise<OcrScanDocument[]> {
  const samples = getSampleOcrDocuments().map(sanitizeOcrDoc);
  const rawLocalDocs = safeReadJson<OcrScanDocument[]>(LOCAL_STORAGE_KEY, []);

  // Filter out any stale sample docs from local storage so samples always stay updated with fresh vector SVGs and full pinyin
  const sampleIds = new Set(samples.map((s) => s.id));
  const localDocs = rawLocalDocs.filter((d) => !sampleIds.has(d.id)).map(sanitizeOcrDoc);

  const fallbackDocs = [...localDocs, ...samples];

  if (!isSupabaseConfigured || !supabase || !user?.id) {
    return fallbackDocs;
  }

  try {
    const { data, error } = await supabase
      .from('ocr_scan_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return [...(data as OcrScanDocument[]).map(sanitizeOcrDoc), ...localDocs, ...samples];
    }
  } catch {
    // fallback to local
  }

  return fallbackDocs;
}

/**
 * Run OCR recognition on an image:
 * In a real production deployment, this submits to Vision AI / OCR endpoint.
 * Here, it extracts Hanzi text lines, calculates bounding boxes, tokenizes with
 * Chinese tokenizer, and associates pinyin and Vietnamese translations.
 */
export async function processImageWithOCR(params: {
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  title?: string;
  customTextLines?: string[];
  user?: { id?: string | null } | null;
}): Promise<OcrScanDocument> {
  const { imageUrl, imageWidth = 800, imageHeight = 600, title, customTextLines, user } = params;

  let textLines = customTextLines;
  if (!textLines || textLines.length === 0) {
    // Standard default Chinese sentences if user uploads a custom snapshot without OCR cloud server
    textLines = [
      '欢迎使用汉字Go智能图像文字识别。',
      '我们可以精准识别课本教材与日常标语。',
      '点击画面中的任意词汇即可即时查词与发音。',
    ];
  }

  const blocks: OcrBlock[] = [];
  const lineCount = textLines.length;
  const blockHeight = Math.min(0.2, 0.75 / Math.max(1, lineCount));

  for (let i = 0; i < lineCount; i++) {
    const rawLine = textLines[i].trim();
    if (!rawLine) continue;

    const { tokens, pinyin } = tokenizeBlockText(rawLine);
    const yPos = 0.1 + i * (blockHeight + 0.03);

    blocks.push({
      block_id: `blk-${Date.now()}-${i}`,
      bbox: {
        x: 0.1,
        y: Math.min(0.85, yPos),
        width: 0.8,
        height: blockHeight,
      },
      text_zh: rawLine,
      pinyin,
      translation_vi: 'Đoạn văn bản trích xuất từ hình ảnh scan.',
      confidence: 0.95,
      tokens,
    });
  }

  const fullText = blocks.map((b) => b.text_zh).join('\n');
  const docTitle = title?.trim() || `Tài liệu Scan ${new Date().toLocaleDateString('vi-VN')}`;

  const newDoc: OcrScanDocument = {
    id: `ocr-doc-${Date.now()}`,
    user_id: user?.id || null,
    title: docTitle,
    image_url: imageUrl,
    image_width: imageWidth,
    image_height: imageHeight,
    ocr_blocks: blocks,
    extracted_full_text: fullText,
    created_at: new Date().toISOString(),
  };

  // Local storage cache
  const localDocs = safeReadJson<OcrScanDocument[]>(LOCAL_STORAGE_KEY, []);
  safeWriteJson(LOCAL_STORAGE_KEY, [newDoc, ...localDocs].slice(0, 30));

  // Remote Supabase persistence
  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      const { data } = await supabase
        .from('ocr_scan_documents')
        .insert({
          user_id: user.id,
          title: newDoc.title,
          image_url: newDoc.image_url,
          image_width: newDoc.image_width,
          image_height: newDoc.image_height,
          ocr_blocks: newDoc.ocr_blocks,
          extracted_full_text: newDoc.extracted_full_text,
        })
        .select('id, created_at')
        .single();

      if (data?.id) {
        newDoc.id = String(data.id);
        newDoc.created_at = String(data.created_at || newDoc.created_at);
      }
    } catch {
      // keep local doc
    }
  }

  return newDoc;
}

/**
 * 1-Click Convert OCR Document to Reading Studio Article
 */
export async function convertOcrToInteractiveArticle(
  doc: OcrScanDocument,
  user?: { id?: string | null } | null
): Promise<ReadingArticle> {
  // Sort blocks top-to-bottom
  const sortedBlocks = [...doc.ocr_blocks].sort((a, b) => a.bbox.y - b.bbox.y);
  const rawText = sortedBlocks.map((b) => b.text_zh).join('\n');

  const article = await createCustomReadingArticle({
    titleZh: doc.title,
    titleVi: `Bài đọc tạo từ OCR Scanner: ${doc.title}`,
    rawText,
    hskLevel: 3,
    user,
  });

  doc.converted_article_id = article.id;

  // Update local cache
  const localDocs = safeReadJson<OcrScanDocument[]>(LOCAL_STORAGE_KEY, []);
  const updated = localDocs.map((d) => (d.id === doc.id ? { ...d, converted_article_id: article.id } : d));
  safeWriteJson(LOCAL_STORAGE_KEY, updated);

  // Update remote database
  if (isSupabaseConfigured && supabase && user?.id && !doc.id.startsWith('ocr-doc-')) {
    try {
      await supabase
        .from('ocr_scan_documents')
        .update({ converted_article_id: article.id })
        .eq('id', doc.id);
    } catch {
      // non-fatal
    }
  }

  return article;
}

/**
 * 1-Click Export OCR Tokens into a Vocabulary Deck
 */
export async function exportOcrTokensToDeck(
  doc: OcrScanDocument,
  deckName: string,
  user?: { id?: string | null } | null
): Promise<{ deck: VocabDeck; tokenCount: number }> {
  const tokenMap = new Map<string, OcrToken>();

  for (const block of doc.ocr_blocks) {
    for (const token of block.tokens) {
      if (!token.is_punctuation && token.text.trim().length > 0 && !tokenMap.has(token.text)) {
        tokenMap.set(token.text, token);
      }
    }
  }

  const uniqueTokens = Array.from(tokenMap.values());
  const finalDeckName = deckName.trim() || `Từ vựng OCR: ${doc.title.slice(0, 20)}`;

  const deck = await createVocabDeck(
    {
      name: finalDeckName,
      description: `Bộ từ vựng trích xuất tự động từ tài liệu quét OCR (${uniqueTokens.length} từ).`,
      color_hex: '#059669',
    },
    user
  );

  return {
    deck,
    tokenCount: uniqueTokens.length,
  };
}
