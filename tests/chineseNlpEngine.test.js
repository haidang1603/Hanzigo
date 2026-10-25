import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  extractContextualPinyinArray, 
  segmentSentenceWithPinyin, 
  analyzeChineseText, 
  HETERONYM_COMPOUND_RULES 
} from '../src/utils/chineseNlpEngine.js';
import { getHanziDecomposition, IDS_STRUCTURE_TYPES } from '../src/data/hanziDecomposition.js';

test('CHINESE NLP ENGINE — HETERONYM RESOLUTION & CONTEXT-FIRST ALIGNMENT', async (t) => {
  
  // 1. Cặp từ đa âm: 行 (háng vs xíng)
  await t.test('1. Heteronym 行: 银行 / 一行人 (háng) vs 行动 / 行李 (xíng)', () => {
    const s1 = '我明天去银行办业务。';
    const s2 = '路上有一行人走过。';
    const s3 = '我们要立刻采取行动。';

    const p1 = extractContextualPinyinArray(s1);
    const p2 = extractContextualPinyinArray(s2);
    const p3 = extractContextualPinyinArray(s3);

    // Tìm chữ 行 trong câu s1 (ngân hàng)
    const hangChar1 = p1.find(c => c.char === '行');
    assert.equal(hangChar1.pinyin, 'háng');

    // Tìm chữ 行 trong câu s2 (nhóm người)
    const hangChar2 = p2.find(c => c.char === '行');
    assert.equal(hangChar2.pinyin, 'háng');

    // Tìm chữ 行 trong câu s3 (hành động)
    const hangChar3 = p3.find(c => c.char === '行');
    assert.equal(hangChar3.pinyin, 'xíng');
  });

  // 2. Cặp từ đa âm: 觉 (jiào vs jué)
  await t.test('2. Heteronym 觉: 睡觉 (jiào) vs 觉得 / 感觉 (jué)', () => {
    const s1 = '小明在房间里睡觉。';
    const s2 = '我觉得今天的天气很好。';

    const p1 = extractContextualPinyinArray(s1);
    const p2 = extractContextualPinyinArray(s2);

    const jiao = p1.find(c => c.char === '觉');
    const jue = p2.find(c => c.char === '觉');

    assert.equal(jiao.pinyin, 'jiào');
    assert.equal(jue.pinyin, 'jué');
  });

  // 3. Cặp từ đa âm: 长 (zhǎng vs cháng)
  await t.test('3. Heteronym 长: 长大 / 校长 (zhǎng) vs 长城 / 长短 (cháng)', () => {
    const s1 = '小树渐渐长大了。';
    const s2 = '长城是一座伟大的古建筑。';

    const p1 = extractContextualPinyinArray(s1);
    const p2 = extractContextualPinyinArray(s2);

    const zhang = p1.find(c => c.char === '长');
    const chang = p2.find(c => c.char === '长');

    assert.equal(zhang.pinyin, 'zhǎng');
    assert.equal(chang.pinyin, 'cháng');
  });

  // 4. Cặp từ đa âm: 乐 (lè vs yuè)
  await t.test('4. Heteronym 乐: 快乐 (lè) vs 音乐 (yuè)', () => {
    const s1 = '祝你生日快乐！';
    const s2 = '我非常喜欢听古典音乐。';

    const p1 = extractContextualPinyinArray(s1);
    const p2 = extractContextualPinyinArray(s2);

    const le = p1.find(c => c.char === '乐');
    const yue = p2.find(c => c.char === '乐');

    assert.equal(le.pinyin, 'lè');
    assert.equal(yue.pinyin, 'yuè');
  });

  // 5. Cặp từ đa âm: 还 (huán vs hái)
  await t.test('5. Heteronym 还: 还钱 / 归还 (huán) vs 还有 / 还是 (hái)', () => {
    const s1 = '借了钱就一定要按时还钱。';
    const s2 = '家里还有很多新鲜水果。';

    const p1 = extractContextualPinyinArray(s1);
    const p2 = extractContextualPinyinArray(s2);

    const huan = p1.find(c => c.char === '还');
    const hai = p2.find(c => c.char === '还');

    assert.equal(huan.pinyin, 'huán');
    assert.equal(hai.pinyin, 'hái');
  });

  // 6. Cặp từ đa âm: 得 (děi vs de vs dé)
  await t.test('6. Heteronym 得: 得去 (děi) vs 跑得快 (de) vs 得到 (dé)', () => {
    const s1 = '时间不早了，我得去上班了。';
    const s2 = '运动员跑得飞快。';
    const s3 = '经过努力，他得到了大家的认可。';

    const p1 = extractContextualPinyinArray(s1);
    const p2 = extractContextualPinyinArray(s2);
    const p3 = extractContextualPinyinArray(s3);

    const dei = p1.find(c => c.char === '得');
    const de = p2.find(c => c.char === '得');
    const deVerb = p3.find(c => c.char === '得');

    assert.equal(dei.pinyin, 'děi');
    assert.equal(de.pinyin, 'de');
    assert.equal(deVerb.pinyin, 'dé');
  });

  // 7. Cặp từ đa âm: 看 (kān vs kàn)
  await t.test('7. Heteronym 看: 看门 (kān) vs 看书 (kàn)', () => {
    const s1 = '看门的老大爷很和气。';
    const s2 = '小华在安静地看书。';

    const p1 = extractContextualPinyinArray(s1);
    const p2 = extractContextualPinyinArray(s2);

    const kan1 = p1.find(c => c.char === '看');
    const kan2 = p2.find(c => c.char === '看');

    assert.equal(kan1.pinyin, 'kān');
    assert.equal(kan2.pinyin, 'kàn');
  });

  // 8. Cặp từ đa âm: 重 (chóng vs zhòng)
  await t.test('8. Heteronym 重: 重新 (chóng) vs 重要 (zhòng)', () => {
    const s1 = '请把这篇文章重新写一遍。';
    const s2 = '身体健康是最重要的事情。';

    const p1 = extractContextualPinyinArray(s1);
    const p2 = extractContextualPinyinArray(s2);

    const chong = p1.find(c => c.char === '重');
    const zhong = p2.find(c => c.char === '重');

    assert.equal(chong.pinyin, 'chóng');
    assert.equal(zhong.pinyin, 'zhòng');
  });

  // 9. Cặp từ đa âm: 便 (pián vs biàn)
  await t.test('9. Heteronym 便: 便宜 (pián) vs 方便 (biàn)', () => {
    const s1 = '这家超市的苹果非常便宜。';
    const s2 = '坐地铁出门很方便。';

    const p1 = extractContextualPinyinArray(s1);
    const p2 = extractContextualPinyinArray(s2);

    const pian = p1.find(c => c.char === '便');
    const bian = p2.find(c => c.char === '便');

    assert.equal(pian.pinyin, 'pián');
    assert.equal(bian.pinyin, 'biàn');
  });

  // 10. Cặp từ đa âm: 着 (zháo vs zhe)
  await t.test('10. Heteronym 着: 着急 (zháo) vs 看着 (zhe)', () => {
    const s1 = '你别着急，慢慢说。';
    const s2 = '老师正微笑着看着我们。';

    const p1 = extractContextualPinyinArray(s1);
    const p2 = extractContextualPinyinArray(s2);

    const zhao = p1.find(c => c.char === '着');
    const zhe = p2.find(c => c.char === '着');

    assert.equal(zhao.pinyin, 'zháo');
    assert.equal(zhe.pinyin, 'zhe');
  });

  // 11. Cặp từ đa âm: 为 (wèi vs wéi)
  await t.test('11. Heteronym 为: 因为 (wèi) vs 成为 (wéi)', () => {
    const s1 = '因为下雨，我们不去了。';
    const s2 = '他想成为一名优秀的老师。';

    const p1 = extractContextualPinyinArray(s1);
    const p2 = extractContextualPinyinArray(s2);

    const wei1 = p1.find(c => c.char === '为');
    const wei2 = p2.find(c => c.char === '为');

    assert.equal(wei1.pinyin, 'wèi');
    assert.equal(wei2.pinyin, 'wéi');
  });

  // 12. Cặp từ đa âm: 地 (dì vs de)
  await t.test('12. Heteronym 地: 地方 (dì) vs 慢慢地 (de)', () => {
    const s1 = '这是一个美丽的地方。';
    const s2 = '老人慢慢地走着。';

    const p1 = extractContextualPinyinArray(s1);
    const p2 = extractContextualPinyinArray(s2);

    const di = p1.find(c => c.char === '地');
    const de = p2.find(c => c.char === '地');

    assert.equal(di.pinyin, 'dì');
    assert.equal(de.pinyin, 'de');
  });
});

test('CHINESE NLP ENGINE — SEGMENTATION, PUNCTUATION & SAFETY', async (t) => {

  await t.test('Correctly preserves Chinese & English punctuation', () => {
    const sentence = '你好，“中国”！这是《西游记》吗？是的，很好。';
    const pinyinArr = extractContextualPinyinArray(sentence);
    const tokens = segmentSentenceWithPinyin(sentence, pinyinArr);

    const punctuations = tokens.filter(tok => tok.isPunctuation).map(tok => tok.raw);
    assert.deepEqual(punctuations, ['，', '“', '”', '！', '《', '》', '？', '，', '。']);
  });

  await t.test('Handles whitespace and newlines without dropping', () => {
    const text = '第一段\n第二段 含有空格';
    const analysis = analyzeChineseText(text);

    assert.equal(analysis.paragraphs.length, 2);
    assert.equal(analysis.paragraphs[0].rawText, '第一段');
    assert.equal(analysis.paragraphs[1].rawText, '第二段 含有空格');
  });

  await t.test('Safely handles empty string and non-Chinese text', () => {
    const emptyRes = analyzeChineseText('');
    assert.equal(emptyRes.paragraphs.length, 0);
    assert.equal(emptyRes.stats.totalChars, 0);

    const nullRes = analyzeChineseText(null);
    assert.equal(nullRes.paragraphs.length, 0);

    const latinRes = analyzeChineseText('Hello world 123! 😊');
    assert.ok(latinRes.paragraphs.length > 0);
    assert.equal(latinRes.stats.chineseChars, 0);
  });

  await t.test('Enriches tokens with Pinyin, Hán-Việt, Meaning & HSK level', () => {
    const sentence = '我喜欢学习汉语。';
    const pinyinArr = extractContextualPinyinArray(sentence);
    const tokens = segmentSentenceWithPinyin(sentence, pinyinArr);

    const xuexiToken = tokens.find(t => t.raw === '学习');
    assert.ok(xuexiToken, 'Phải tìm thấy token 学习');
    assert.equal(xuexiToken.pinyin, 'xué xí');
    assert.equal(xuexiToken.hanviet, 'Học tập');
    assert.ok(xuexiToken.meaningVi.includes('Học tập') || xuexiToken.meaningVi.includes('rèn luyện'));
    assert.equal(xuexiToken.level, 'HSK 1');
  });
});

test('HANZI IDS DECOMPOSITION — STRUCTURAL DATA VALIDATION', async (t) => {

  await t.test('Decomposes key HSK characters into IDS format', () => {
    const xiu = getHanziDecomposition('休');
    assert.ok(xiu);
    assert.equal(xiu.symbol, '⿰'); // Tả hữu
    assert.equal(xiu.ids, '⿰亻木');
    assert.equal(xiu.components.length, 2);
    assert.equal(xiu.components[0].char, '亻');
    assert.equal(xiu.components[1].char, '木');

    const xiang = getHanziDecomposition('想');
    assert.ok(xiang);
    assert.equal(xiang.symbol, '⿱'); // Thượng hạ
    assert.equal(xiang.components[1].char, '心');

    const guo = getHanziDecomposition('国');
    assert.ok(guo);
    assert.equal(guo.symbol, '⿴'); // Toàn bao vi
  });

  await t.test('Falls back gracefully for unmapped characters', () => {
    const unknown = getHanziDecomposition('龘');
    assert.ok(unknown);
    assert.equal(unknown.char, '龘');
    assert.ok(unknown.structure);
  });
});
