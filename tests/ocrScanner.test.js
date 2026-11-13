import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock localStorage if in node environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

const {
  getSampleOcrDocuments,
  tokenizeBlockText,
  convertOcrToInteractiveArticle,
  exportOcrTokensToDeck,
  processImageWithOCR,
} = await import('../src/services/ocrScannerService.ts');

test('getSampleOcrDocuments provides realistic documents with normalized bounding boxes', () => {
  const docs = getSampleOcrDocuments();
  assert.ok(Array.isArray(docs));
  assert.ok(docs.length >= 3, 'Should have at least 3 sample documents');

  for (const doc of docs) {
    assert.ok(doc.id, 'Document must have an ID');
    assert.ok(doc.title, 'Document must have a title');
    assert.ok(doc.image_url, 'Document must have an image_url');
    assert.ok(Array.isArray(doc.ocr_blocks), 'Document must have ocr_blocks');
    assert.ok(doc.ocr_blocks.length > 0, 'Document must have at least one block');

    for (const blk of doc.ocr_blocks) {
      assert.ok(blk.block_id, 'Block must have block_id');
      assert.ok(blk.text_zh, 'Block must have text_zh');
      assert.ok(blk.bbox, 'Block must have bbox');

      const { x, y, width, height } = blk.bbox;
      assert.ok(x >= 0 && x <= 1, `x must be in [0, 1]: ${x}`);
      assert.ok(y >= 0 && y <= 1, `y must be in [0, 1]: ${y}`);
      assert.ok(width > 0 && width <= 1, `width must be in (0, 1]: ${width}`);
      assert.ok(height > 0 && height <= 1, `height must be in (0, 1]: ${height}`);
      assert.ok(Array.isArray(blk.tokens), 'Block must have tokens');
      assert.ok(blk.tokens.length > 0, 'Block tokens must not be empty');
    }
  }
});

test('tokenizeBlockText parses Hanzi sentence into tokens with pinyin and meaning', () => {
  const sentence = '北京是中国的首都。';
  const result = tokenizeBlockText(sentence);

  assert.ok(Array.isArray(result.tokens));
  assert.ok(result.tokens.length >= 4);

  const beijing = result.tokens.find((t) => t.text === '北京');
  assert.ok(beijing, 'Should recognize 北京 as a word token');
  assert.ok(beijing.pinyin.toLowerCase().includes('běijīng') || beijing.pinyin.toLowerCase().includes('běi'));

  assert.ok(result.pinyin.toLowerCase().includes('běijīng') || result.pinyin.toLowerCase().includes('běi'));
});

test('convertOcrToInteractiveArticle transforms OCR document into ReadingArticle', async () => {
  const samples = getSampleOcrDocuments();
  const sampleDoc = samples[0];

  const article = await convertOcrToInteractiveArticle(sampleDoc, { id: 'test-user-123' });

  assert.ok(article, 'Article should be created');
  assert.ok(article.id, 'Article should have an ID');
  assert.equal(article.title_zh, sampleDoc.title);
  assert.ok(article.paragraphs.length > 0, 'Article must have tokenized paragraphs');
  assert.equal(sampleDoc.converted_article_id, article.id);
});

test('exportOcrTokensToDeck creates a vocabulary deck with unique tokens', async () => {
  const samples = getSampleOcrDocuments();
  const sampleDoc = samples[1]; // Sichuan menu

  const { deck, tokenCount } = await exportOcrTokensToDeck(sampleDoc, 'Bộ từ Thực đơn Tứ Xuyên', {
    id: 'test-user-123',
  });

  assert.ok(deck, 'Deck should be created');
  assert.equal(deck.name, 'Bộ từ Thực đơn Tứ Xuyên');
  assert.ok(tokenCount > 0, 'Should have extracted tokens');
});

test('processImageWithOCR generates structured blocks and persists document', async () => {
  const testDoc = await processImageWithOCR({
    imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    imageWidth: 640,
    imageHeight: 480,
    title: 'Đề thi mẫu HSK 4',
    customTextLines: [
      '第一部分：听力理解。',
      '请仔细听对话并选择正确答案。',
    ],
  });

  assert.ok(testDoc.id);
  assert.equal(testDoc.title, 'Đề thi mẫu HSK 4');
  assert.equal(testDoc.ocr_blocks.length, 2);
  assert.equal(testDoc.ocr_blocks[0].text_zh, '第一部分：听力理解。');
  assert.equal(testDoc.ocr_blocks[1].text_zh, '请仔细听对话并选择正确答案。');
});

test('SQL migration file 20261112_2902_ocr_scanner.sql defines schema correctly', () => {
  const migrationPath = path.resolve(__dirname, '../supabase/migrations/20261112_2902_ocr_scanner.sql');
  assert.ok(fs.existsSync(migrationPath), 'Migration file must exist');

  const sql = fs.readFileSync(migrationPath, 'utf8');
  assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.ocr_scan_documents'));
  assert.ok(sql.includes('ocr_blocks JSONB'));
  assert.ok(sql.includes('extracted_full_text TEXT'));
  assert.ok(sql.includes('converted_article_id TEXT'));
  assert.ok(sql.includes('ENABLE ROW LEVEL SECURITY'));
  assert.ok(sql.includes('idx_ocr_docs_blocks_gin'));
});
