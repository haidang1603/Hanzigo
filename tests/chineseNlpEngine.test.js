import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  extractContextualPinyinArray, 
  segmentSentenceWithPinyin, 
  analyzeChineseText, 
  extractGrammarPatterns,
  calculateReadabilityScore,
  extractKeyTermsAndChengyu,
  generateExtractiveSummary,
  tagTokenPos,
  CHINESE_POS_MAP,
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

test('CHINESE NLP ENGINE — EXPANDED HETERONYMS', async (t) => {
  await t.test('Heteronym 会: 会计 (kuài) vs 开会 (huì)', () => {
    const p1 = extractContextualPinyinArray('他在公司当会计。');
    const p2 = extractContextualPinyinArray('经理正在会议室开会。');
    assert.equal(p1.find(c => c.char === '会').pinyin, 'kuài');
    assert.equal(p2.find(c => c.char === '会').pinyin, 'huì');
  });

  await t.test('Heteronym 调: 调查 (diào) vs 空调 (tiáo)', () => {
    const p1 = extractContextualPinyinArray('警方正在仔细调查案情。');
    const p2 = extractContextualPinyinArray('夏天一定要开空调。');
    assert.equal(p1.find(c => c.char === '调').pinyin, 'diào');
    assert.equal(p2.find(c => c.char === '调').pinyin, 'tiáo');
  });

  await t.test('Heteronym 种: 种子 / 各种 (zhǒng) vs 种花 (zhòng)', () => {
    const p1 = extractContextualPinyinArray('春天我们在公园里种花。');
    const p2 = extractContextualPinyinArray('超市里有各种新鲜蔬菜。');
    assert.equal(p1.find(c => c.char === '种').pinyin, 'zhòng');
    assert.equal(p2.find(c => c.char === '种').pinyin, 'zhǒng');
  });

  await t.test('Heteronym 教: 教室 (jiào) vs 教书 (jiāo)', () => {
    const p1 = extractContextualPinyinArray('同学们都在教室里看书。');
    const p2 = extractContextualPinyinArray('李老师在山村小学教书三十年。');
    assert.equal(p1.find(c => c.char === '教').pinyin, 'jiào');
    assert.equal(p2.find(c => c.char === '教').pinyin, 'jiāo');
  });

  await t.test('Heteronym 假: 假装 (jiǎ) vs 放假 (jià)', () => {
    const p1 = extractContextualPinyinArray('猫咪在地上假装睡觉。');
    const p2 = extractContextualPinyinArray('下周学校放假三天。');
    assert.equal(p1.find(c => c.char === '假').pinyin, 'jiǎ');
    assert.equal(p2.find(c => c.char === '假').pinyin, 'jià');
  });
});

test('CHINESE NLP ENGINE — PART-OF-SPEECH (POS) TAGGING', async (t) => {
  await t.test('Accurately tags grammatical roles (Pronoun, Prep, Particle, Adv, Noun, Verb)', () => {
    const res = analyzeChineseText('这是我的书，我在学校认真学习汉语。');
    const tokens = res.paragraphs[0].tokens.filter(t => t.isChinese);

    const wo = tokens.find(t => t.raw === '我');
    assert.ok(wo);
    assert.equal(wo.posCode, 'pron');
    assert.equal(wo.posLabel, 'Đại từ');

    const zai = tokens.find(t => t.raw === '在');
    assert.ok(zai);
    assert.equal(zai.posCode, 'prep');
    assert.equal(zai.posLabel, 'Giới từ');

    const de = tokens.find(t => t.raw === '的');
    assert.ok(de);
    assert.equal(de.posCode, 'part');
    assert.equal(de.posLabel, 'Trợ từ');

    const xuexi = tokens.find(t => t.raw === '学习');
    assert.ok(xuexi);
    assert.equal(xuexi.posCode, 'v');
    assert.equal(xuexi.posLabel, 'Động từ');
  });
});

test('CHINESE NLP ENGINE — GRAMMAR PATTERNS EXTRACTION', async (t) => {
  await t.test('Detects Ba-sentence, Bei-sentence and Bi-comparison', () => {
    const text = '他把作业做完了。杯子被猫打破了。高铁比汽车快得多。';
    const patterns = extractGrammarPatterns(text);

    assert.ok(patterns.some(p => p.id === 'ba_structure'), 'Must detect ba-sentence');
    assert.ok(patterns.some(p => p.id === 'bei_structure'), 'Must detect bei-sentence');
    assert.ok(patterns.some(p => p.id === 'bi_comparison'), 'Must detect bi-comparison');

    const ba = patterns.find(p => p.id === 'ba_structure');
    assert.ok(ba.explanation.includes('把'));
    assert.equal(ba.level, 'HSK 3');
  });

  await t.test('Detects compound connective structures (不仅...而且..., 只要...就...)', () => {
    const text = '小华不仅会说流利的汉语，而且还会弹优美的钢琴。只要坚持努力练习，就一定能取得成功。';
    const patterns = extractGrammarPatterns(text);

    assert.ok(patterns.some(p => p.id === 'bujin_erqie'), 'Must detect bujin...erqie');
    assert.ok(patterns.some(p => p.id === 'zhiyao_jiu'), 'Must detect zhiyao...jiu');
  });
});

test('CHINESE NLP ENGINE — READABILITY, KEY TERMS & EXTRACTIVE SUMMARY', async (t) => {
  await t.test('Computes readability score and recommended HSK level', () => {
    const easyText = '你好。我是学生。我喜欢喝茶，吃米饭。';
    const analysisEasy = analyzeChineseText(easyText);
    assert.ok(analysisEasy.readability.hskScore <= 2.5);
    assert.ok(analysisEasy.readability.recommendedLevel.includes('HSK 1') || analysisEasy.readability.recommendedLevel.includes('HSK 2'));

    const advText = '现代脑机接口与神经调控技术正以颠覆性的速度跨越临床医疗边界，引发关于人类主体意识本体论边界的深刻哲学反思。';
    const analysisAdv = analyzeChineseText(advText);
    assert.ok(analysisAdv.readability.hskScore >= 3.5);
    assert.ok(analysisAdv.readability.advancedWordRatio > 0);
  });

  await t.test('Extracts key topical keywords and Chengyu', () => {
    const text = '学习汉语需要一心一意、持之以恒。很多外国留学生在北京大学学习中国历史与传统文化。';
    const res = analyzeChineseText(text);

    assert.ok(res.keyTerms.topKeywords.length > 0);
    const keywords = res.keyTerms.topKeywords.map(k => k.hanzi);
    assert.ok(keywords.includes('汉语') || keywords.includes('学习') || keywords.includes('文化'));

    // Chengyu extraction
    assert.ok(res.keyTerms.chengyuList.length > 0 || res.keyTerms.topKeywords.some(k => k.hanzi.length === 4));
  });

  await t.test('Generates informative extractive summary for paragraphs', () => {
    const longText = '大熊猫是中国特有的珍稀国宝动物，全世界人民都非常喜爱大熊猫。近年来中国建立了大熊猫国家公园，有效保护了它们的野生栖息地。志愿者们每年都会前往卧龙保护区协助照顾大熊猫。';
    const res = analyzeChineseText(longText);

    assert.ok(typeof res.summary === 'string');
    assert.ok(res.summary.length >= 10);
    assert.ok(res.summary.includes('大熊猫'));
  });
});
