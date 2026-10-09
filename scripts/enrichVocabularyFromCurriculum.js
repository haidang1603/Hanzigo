import fs from 'fs';
import path from 'path';
import { CURRICULUM_60_LESSONS } from '../src/data/curriculumLessons.js';
import { VOCABULARY_LIST } from '../src/data/chineseData.js';

// Additional HSK 4 & Idioms from HANZIGO_CONSOLIDATED_DOCUMENTATION.md
const EXTRA_CONSOLIDATED_VOCAB = [
  // Thành ngữ 4 chữ (成语) & Câu líu lưỡi từ tài liệu
  {
    hanzi: '入乡随俗',
    pinyin: 'rù xiāng suí sú',
    hanviet: 'Nhập hương tùy tục',
    meaning: 'Nhập gia tùy tục (đến đâu theo phong tục ở đó)',
    level: 'HSK 5-6',
    topic: 'Thành ngữ',
    radical: '入 (Nhập)',
    strokes: 12,
    mnemonic: 'Đến làng xóm (乡) mới thì hòa nhập thuận theo phong tục (俗) tập quán nơi đó.',
    example: {
      hanzi: '到了中国生活，我们应该学会入乡随俗。',
      pinyin: 'Dào le Zhōngguó shēnghuó, wǒmen yīnggāi xuéhuì rù xiāng suí sú.',
      meaning: 'Đến sống ở Trung Quốc, chúng ta nên học cách nhập gia tùy tục.'
    }
  },
  {
    hanzi: '马马虎虎',
    pinyin: 'mǎmǎhūhū',
    hanviet: 'Mã mã hổ hổ',
    meaning: 'Tàm tạm, qua loa, đại khái',
    level: 'HSK 3',
    topic: 'Thành ngữ',
    radical: '马 (Mã)',
    strokes: 16,
    mnemonic: 'Trông như ngựa (马) lại tựa như hổ (虎), nửa nạc nửa mỡ không rõ ràng.',
    example: {
      hanzi: '他的中文水平马马虎虎，但日常交流没问题。',
      pinyin: 'Tā de Zhōngwén shuǐpíng mǎmǎhūhū, dàn rìcháng jiāoliú méi wèntí.',
      meaning: 'Trình độ tiếng Trung của anh ấy tàm tạm, nhưng giao tiếp thường nhật thì không vấn đề.'
    }
  },
  {
    hanzi: '一心一意',
    pinyin: 'yì xīn yí yì',
    hanviet: 'Nhất tâm nhất ý',
    meaning: 'Toàn tâm toàn ý, một lòng một dạ',
    level: 'HSK 5-6',
    topic: 'Thành ngữ',
    radical: '一 (Nhất)',
    strokes: 8,
    mnemonic: 'Một tấm lòng (心) một ý chí (意), tập trung cao độ không phân tâm.',
    example: {
      hanzi: '只要你一心一意地学习，就一定能通过HSK考试。',
      pinyin: 'Zhǐyào nǐ yì xīn yí yì de xuéxí, jiù yídìng néng tōngguò HSK kǎoshì.',
      meaning: 'Chỉ cần bạn toàn tâm toàn ý học tập thì nhất định sẽ đỗ kỳ thi HSK.'
    }
  },
  {
    hanzi: '半途而废',
    pinyin: 'bàn tú ér fèi',
    hanviet: 'Bán đồ nhi phế',
    meaning: 'Bỏ dở nửa chừng, đứt gánh giữa đường',
    level: 'HSK 5-6',
    topic: 'Thành ngữ',
    radical: '十 (Thập)',
    strokes: 15,
    mnemonic: 'Đi được nửa đường (半途) mà bỏ cuộc phế bỏ (废), không tới được đích.',
    example: {
      hanzi: '学外语贵在坚持，绝不能半途而废。',
      pinyin: 'Xué wàiyǔ guì zài jiānchí, jué bù néng bàn tú ér fèi.',
      meaning: 'Học ngoại ngữ quý ở sự kiên trì, tuyệt đối không được bỏ dở nửa chừng.'
    }
  },
  {
    hanzi: '画蛇添足',
    pinyin: 'huà shé tiān zú',
    hanviet: 'Họa xà thiêm túc',
    meaning: 'Vẽ rắn thêm chân (làm chuyện thừa thãi hỏng việc)',
    level: 'HSK 5-6',
    topic: 'Thành ngữ',
    radical: '一 (Nhất)',
    strokes: 28,
    mnemonic: 'Vẽ rắn vốn không chân lại tự ý vẽ thêm chân thành ra trò cười.',
    example: {
      hanzi: '这段话已经很完整了，再解释就是画蛇添足。',
      pinyin: 'Zhè duàn huà yǐjīng hěn wánzhěng le, zài jiěshì jiù shì huà shé tiān zú.',
      meaning: 'Đoạn này đã rất hoàn chỉnh rồi, giải thích thêm chỉ là vẽ rắn thêm chân.'
    }
  },
  {
    hanzi: '守株待兔',
    pinyin: 'shǒu zhū dài tù',
    hanviet: 'Thủ chu đãi thố',
    meaning: 'Ôm cây đợi thỏ (trông chờ may mắn, lười biếng)',
    level: 'HSK 5-6',
    topic: 'Thành ngữ',
    radical: '寸 (Thốn)',
    strokes: 25,
    mnemonic: 'Ngồi canh gốc cây (株) mong thỏ (兔) tự đâm đầu vào, không chịu làm lụng.',
    example: {
      hanzi: '成功需要脚踏实地，不能守株待兔。',
      pinyin: 'Chénggōng xūyào jiǎotàshídì, bù néng shǒu zhū dài tù.',
      meaning: 'Thành công cần thực tế nỗ lực, không thể ôm cây đợi thỏ.'
    }
  },
  {
    hanzi: '温故知新',
    pinyin: 'wēn gù zhī xīn',
    hanviet: 'Ôn cố tri tân',
    meaning: 'Ôn lại điều cũ để hiểu sâu điều mới',
    level: 'HSK 5-6',
    topic: 'Thành ngữ',
    radical: '氵(Thủy)',
    strokes: 32,
    mnemonic: 'Ôn lại điều đã học (故) thì sẽ lĩnh hội thêm những tri thức mới mẻ (新).',
    example: {
      hanzi: '每天复习生词就是温故知新的好方法。',
      pinyin: 'Měitiān fùxí shēngcí jiù shì wēn gù zhī xīn de hǎo fāngfǎ.',
      meaning: 'Mỗi ngày ôn tập từ mới chính là phương pháp ôn cố tri tân tuyệt vời.'
    }
  },
  {
    hanzi: '千里之行',
    pinyin: 'qiānlǐ zhī xíng',
    hanviet: 'Thiên lý chi hành',
    meaning: 'Chuyến đi ngàn dặm (bắt đầu từ bước chân đầu tiên)',
    level: 'HSK 5-6',
    topic: 'Danh ngôn',
    radical: '十 (Thập)',
    strokes: 16,
    mnemonic: 'Đường xa nghìn dặm (千里) đều bắt đầu từ một bước đi nhỏ dưới chân.',
    example: {
      hanzi: '千里之行，始于足下，学中文要天天坚持。',
      pinyin: 'Qiānlǐ zhī xíng, shǐ yú zú xià, xué Zhōngwén yào tiāntiān jiānchí.',
      meaning: 'Chuyến đi ngàn dặm bắt đầu từ một bước chân, học tiếng Trung phải kiên trì mỗi ngày.'
    }
  },

  // Từ vựng HSK 4 từ Đàm thoại 301 & Tài liệu Khảo thí HSK (Phần 7 & 11)
  {
    hanzi: '安排',
    pinyin: 'ānpái',
    hanviet: 'An bài',
    meaning: 'Sắp xếp, bố trí, kế hoạch',
    level: 'HSK 4',
    topic: 'Công việc',
    radical: '宀 (Miên)',
    strokes: 17,
    mnemonic: 'Giữ cho mọi việc an ổn (安) vào đúng hàng lối thứ tự (排).',
    example: {
      hanzi: '经理为我们安排了下周的商务行程。',
      pinyin: 'Jīnglǐ wèi wǒmen ānpái le xià zhōu de shāngwù xíngchéng.',
      meaning: 'Giám đốc đã sắp xếp lịch trình công tác tuần tới cho chúng tôi.'
    }
  },
  {
    hanzi: '保证',
    pinyin: 'bǎozhèng',
    hanviet: 'Bảo chứng',
    meaning: 'Đảm bảo, cam đoan',
    level: 'HSK 4',
    topic: 'Công việc',
    radical: '亻 (Nhân đứng)',
    strokes: 19,
    mnemonic: 'Dùng uy tín con người (亻) và lời nói (讠) làm chứng bảo đảm.',
    example: {
      hanzi: '我向你保证，明天下午一定把报告交给你。',
      pinyin: 'Wǒ xiàng nǐ bǎozhèng, míngtiān xiàwǔ yídìng bǎ bàogào jiāo gěi nǐ.',
      meaning: 'Tôi bảo đảm với bạn, chiều mai nhất định nộp báo cáo cho bạn.'
    }
  },
  {
    hanzi: '丰富',
    pinyin: 'fēngfù',
    hanviet: 'Phong phú',
    meaning: 'Phong phú, dồi dào, đa dạng',
    level: 'HSK 4',
    topic: 'Tính từ',
    radical: '豆 (Đậu)',
    strokes: 25,
    mnemonic: 'Mùa màng bội thu đầy ắp hoa màu (丰) và của cải trong nhà (富).',
    example: {
      hanzi: '他的工作经验非常丰富，大家都很信任他。',
      pinyin: 'Tā de gōngzuò jīngyàn fēicháng fēngfù, dàjiā dōu hěn xìnrèn tā.',
      meaning: 'Kinh nghiệm làm việc của anh ấy rất phong phú, mọi người đều rất tin tưởng anh ấy.'
    }
  },
  {
    hanzi: '经历',
    pinyin: 'jīnglì',
    hanviet: 'Kinh lịch',
    meaning: 'Trải qua, trải nghiệm, từng trải',
    level: 'HSK 4',
    topic: 'Đời sống',
    radical: '纟(Mịch)',
    strokes: 12,
    mnemonic: 'Những chặng đường sợi tơ cuộc đời đã kinh qua từng ngày tháng.',
    example: {
      hanzi: '这次在中国留学的经历让我学到了很多。',
      pinyin: 'Zhè cì zài Zhōngguó liúxué de jīnglì ràng wǒ xué dào le hěn duō.',
      meaning: 'Trải nghiệm du học Trung Quốc lần này giúp tôi học hỏi được rất nhiều.'
    }
  },
  {
    hanzi: '商量',
    pinyin: 'shāngliang',
    hanviet: 'Thương lượng',
    meaning: 'Bàn bạc, thảo luận, thương lượng',
    level: 'HSK 4',
    topic: 'Giao tiếp',
    radical: '口 (Khẩu)',
    strokes: 23,
    mnemonic: 'Dùng lời lẽ buôn bán suy xét đo lường (量) tìm giải pháp chung.',
    example: {
      hanzi: '遇到困难的时候，我们要互相商量。',
      pinyin: 'Yù dào kùnnan de shíhou, wǒmen yào hùxiāng shāngliang.',
      meaning: 'Khi gặp khó khăn, chúng ta nên cùng nhau bàn bạc.'
    }
  },
  {
    hanzi: '适应',
    pinyin: 'shìyìng',
    hanviet: 'Thích ứng',
    meaning: 'Thích nghi, làm quen, thích ứng',
    level: 'HSK 4',
    topic: 'Đời sống',
    radical: '辶 (Sước)',
    strokes: 16,
    mnemonic: 'Bước chân hòa hợp thích đáng (适) đáp lại (应) với hoàn cảnh mới.',
    example: {
      hanzi: '他很快就适应了北方寒冷干燥的气候。',
      pinyin: 'Tā hěn kuài jiù shìyìng le běifāng hánlěng gānzào de qìhòu.',
      meaning: 'Anh ấy rất nhanh đã thích nghi với khí hậu lạnh khô của phương Bắc.'
    }
  },
  {
    hanzi: '积累',
    pinyin: 'jīlěi',
    hanviet: 'Tích lũy',
    meaning: 'Tích lũy, tích góp (kinh nghiệm, kiến thức)',
    level: 'HSK 4',
    topic: 'Học tập',
    radical: '禾 (Hòa)',
    strokes: 27,
    mnemonic: 'Từng hạt lúa (禾) chất đống (累) từng ngày thành kho thóc lớn.',
    example: {
      hanzi: '学好一门外语需要每天积累词汇。',
      pinyin: 'Xué hǎo yì mén wàiyǔ xūyào měitiān jīlěi cíhuì.',
      meaning: 'Học tốt một ngoại ngữ cần tích lũy từ vựng mỗi ngày.'
    }
  },
  {
    hanzi: '坚持',
    pinyin: 'jiānchí',
    hanviet: 'Kiên trì',
    meaning: 'Kiên trì, giữ vững, bền bỉ',
    level: 'HSK 4',
    topic: 'Hành động',
    radical: '土 (Thổ)',
    strokes: 20,
    mnemonic: 'Vững vàng như núi đất kiên cố (坚) cầm chắc trong tay (持).',
    example: {
      hanzi: '只要坚持每天练习听力，你的汉语一定会进步。',
      pinyin: 'Zhǐyào jiānchí měitiān liànxí tīnglì, nǐ de Hànyǔ yídìng huì jìnbù.',
      meaning: 'Chỉ cần kiên trì luyện nghe mỗi ngày, tiếng Trung của bạn nhất định sẽ tiến bộ.'
    }
  },
  {
    hanzi: '顺利',
    pinyin: 'shùnlì',
    hanviet: 'Thuận lợi',
    meaning: 'Thuận lợi, suôn sẻ, trôi chảy',
    level: 'HSK 4',
    topic: 'Công việc',
    radical: '页 (Hiệt)',
    strokes: 16,
    mnemonic: 'Xuôi theo dòng nước thuận buồm xuôi gió gặt hái kết quả tốt lành.',
    example: {
      hanzi: '祝你的汉语水平考试一切顺利！',
      pinyin: 'Zhù nǐ de Hànyǔ Shuǐpíng Kǎoshì yíqiè shùnlì!',
      meaning: 'Chúc kỳ thi năng lực tiếng Trung của bạn mọi sự thuận lợi!'
    }
  },
  {
    hanzi: '流利',
    pinyin: 'liúlì',
    hanviet: 'Lưu lợi',
    meaning: 'Lưu loát, trôi chảy',
    level: 'HSK 4',
    topic: 'Kỹ năng',
    radical: '氵(Thủy)',
    strokes: 17,
    mnemonic: 'Lời nói tuôn trào như dòng nước chảy (流) sắc bén thuận lợi (利).',
    example: {
      hanzi: '经过两年的努力，她能说一口流利的普通话。',
      pinyin: 'Jīngguò liǎng nián de nǔlì, tā néng shuō yì kǒu liúlì de pǔtōnghuà.',
      meaning: 'Sau hai năm nỗ lực, cô ấy có thể nói một giọng phổ thông lưu loát.'
    }
  },
  {
    hanzi: '翻译',
    pinyin: 'fānyì',
    hanviet: 'Phiên dịch',
    meaning: 'Dịch thuật, phiên dịch, thông dịch viên',
    level: 'HSK 4',
    topic: 'Công việc',
    radical: '羽 (Vũ)',
    strokes: 22,
    mnemonic: 'Lật giở câu chữ (翻) chuyển đổi sang ngôn ngữ khác (译).',
    example: {
      hanzi: '你能帮我把这封中文邮件翻译成越南语吗？',
      pinyin: 'Nǐ néng bāng wǒ bǎ zhè fēng Zhōngwén yóujiàn fānyì chéng Yuènányǔ ma?',
      meaning: 'Bạn có thể giúp tôi dịch bức thư điện tử tiếng Trung này sang tiếng Việt không?'
    }
  }
];

// Combine existing + curriculum + extra
const existingSet = new Set(VOCABULARY_LIST.map(v => v.hanzi));
let maxId = Math.max(...VOCABULARY_LIST.map(v => v.id || 0));

const newCurriculumItems = [];
CURRICULUM_60_LESSONS.forEach(lesson => {
  const levelStr = lesson.levelId === 'lvl-1' ? 'HSK 1' : lesson.levelId === 'lvl-2' ? 'HSK 2' : 'HSK 3';
  (lesson.step2_vocabulary || []).forEach(v => {
    if (!existingSet.has(v.hanzi)) {
      existingSet.add(v.hanzi);
      maxId++;
      newCurriculumItems.push({
        id: maxId,
        hanzi: v.hanzi,
        pinyin: v.pinyin,
        hanviet: v.hanviet || '',
        meaning: v.meaning,
        level: levelStr,
        topic: lesson.title.split('&')[0].trim() || 'Giáo trình HSK',
        radical: v.radical || '—',
        strokes: v.strokesCount || v.hanzi.length * 4,
        mnemonic: `Trích từ Bài ${lesson.lessonNumber}: ${lesson.title}`,
        example: v.example || {
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          meaning: v.meaning
        }
      });
    }
  });
});

const newExtraItems = [];
EXTRA_CONSOLIDATED_VOCAB.forEach(v => {
  if (!existingSet.has(v.hanzi)) {
    existingSet.add(v.hanzi);
    maxId++;
    newExtraItems.push({
      id: maxId,
      ...v
    });
  }
});

const FINAL_VOCAB_LIST = [
  ...VOCABULARY_LIST,
  ...newCurriculumItems,
  ...newExtraItems
];

console.log(`Original: ${VOCABULARY_LIST.length}`);
console.log(`Curriculum added: ${newCurriculumItems.length}`);
console.log(`Consolidated extra added: ${newExtraItems.length}`);
console.log(`Total Final Vocab: ${FINAL_VOCAB_LIST.length}`);

// Count by level
const stats = {};
FINAL_VOCAB_LIST.forEach(v => {
  stats[v.level] = (stats[v.level] || 0) + 1;
});
console.log('Final Level Distribution:', stats);

// Serialize to chineseData.js
const targetFile = path.resolve('src/data/chineseData.js');
let fileContent = fs.readFileSync(targetFile, 'utf8');

// Replace VOCABULARY_LIST
const vocabStartRegex = /export const VOCABULARY_LIST = \[/;
const vocabEndRegex = /\];\s*\n\s*export const TOPIC_FILTERS = \[/;

const startIndex = fileContent.search(vocabStartRegex);
const matchEnd = fileContent.match(vocabEndRegex);

if (startIndex === -1 || !matchEnd) {
  console.error('Failed to locate VOCABULARY_LIST boundary in chineseData.js');
  process.exit(1);
}

const endIndex = matchEnd.index;

const newVocabCode = `export const VOCABULARY_LIST = ${JSON.stringify(FINAL_VOCAB_LIST, null, 2)};\n\n`;

const updatedContent = fileContent.slice(0, startIndex) + newVocabCode + fileContent.slice(endIndex + 3);

fs.writeFileSync(targetFile, updatedContent, 'utf8');
console.log('Successfully updated src/data/chineseData.js with enriched vocabulary!');
