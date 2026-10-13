/**
 * =========================================================================
 * HANZI GO - CONVERSATION SCENARIOS & CATEGORIES
 * =========================================================================
 * Bộ kịch bản giao tiếp tiếng Trung cá nhân hóa:
 * - Hỗ trợ đầy đủ các phân hệ tình huống:
 *    1. daily (Đời sống hàng ngày / Làm quen)
 *    2. shopping (Nhà hàng & Mua sắm trả giá)
 *    3. travel (Hỏi đường & Khách sạn du lịch)
 *    4. school (Trường học & Thảo luận thi cử HSK)
 *    5. interview (Phỏng vấn xin việc tiếng Trung)
 *    6. business (Thương mại & Đàm phán hợp đồng)
 *    7. free (Trò chuyện tự do cùng Tiểu Hàm AI)
 * - Tùy chỉnh linh hoạt cấp độ HSK 1 đến HSK 6
 * - Minh bạch âm thanh & quyền riêng tư (Zero audio retention)
 * =========================================================================
 */

import { CONVERSATIONS_DATA } from './chineseData.js';

export const SCENARIO_CATEGORIES = [
  { id: 'all', label: 'Tất cả chủ đề', icon: '✨' },
  { id: 'daily', label: 'Đời sống', icon: '☕' },
  { id: 'shopping', label: 'Mua sắm & Ăn uống', icon: '🛍️' },
  { id: 'travel', label: 'Du lịch & Khách sạn', icon: '✈️' },
  { id: 'school', label: 'Trường học & Thi cử', icon: '🎓' },
  { id: 'interview', label: 'Phỏng vấn xin việc', icon: '💼' },
  { id: 'business', label: 'Thương mại & Đàm phán', icon: '🤝' },
  { id: 'free', label: 'Trò chuyện tự do', icon: '🤖' }
];

export const ADDITIONAL_SCENARIOS = [
  {
    id: 'conv-hotel',
    category: 'travel',
    level: 'HSK 2',
    title: 'Khách sạn & Du lịch (酒店入住)',
    scenario: 'Bạn làm thủ tục nhận phòng (Check-in) tại một khách sạn ở thành phố Hàng Châu.',
    aiName: 'Lễ tân Trần (陈前台)',
    aiRole: 'Nhân viên lễ tân khách sạn',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230EA5E9"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">陈</text></svg>',
    dialogue: [
      {
        speaker: 'ai',
        hanzi: '您好！欢迎光临西湖国际酒店。请问您有预订吗？',
        pinyin: 'Nín hǎo! Huānyíng guānglín Xīhú Guójì Jiǔdiàn. Qǐngwèn nín yǒu yùdìng ma?',
        meaning: 'Xin chào quý khách! Chào mừng đến với khách sạn Quốc tế Tây Hồ. Xin hỏi quý khách đã đặt phòng trước chưa ạ?'
      },
      {
        speaker: 'user',
        hanzi: '你好，我在网上预订了一间大床房，住两晚。',
        pinyin: 'Nǐ hǎo, wǒ zài wǎngshang yùdìng le yì jiān dàchuáng fáng, zhù liǎng wǎn.',
        meaning: 'Chào bạn, tôi đã đặt trực tuyến một phòng giường đôi, ở 2 đêm.'
      },
      {
        speaker: 'ai',
        hanzi: '好的，请出示您的护照办理入住手续。房间含双人早餐。',
        pinyin: 'Hǎo de, qǐng chūshì nín de hùzhào bànlǐ rùzhù shǒuxù. Fángjiān hán shuāngrén zǎocān.',
        meaning: 'Vâng, xin vui lòng xuất trình hộ chiếu để làm thủ tục nhận phòng. Tiền phòng đã bao gồm bữa sáng cho 2 người ạ.'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '这是我的护照，请问无线网络密码是多少？',
        pinyin: 'Zhè shì wǒ de hùzhào, qǐngwèn wúxiàn wǎngluò mìmǎ shì duōshao?',
        meaning: 'Đây là hộ chiếu của tôi, cho hỏi mật khẩu Wi-Fi là bao nhiêu vậy?'
      },
      {
        hanzi: '请问明天早餐时间是几点到几点？',
        pinyin: 'Qǐngwèn míngtiān zǎocān shíjiān shì jǐ diǎn dào jǐ diǎn?',
        meaning: 'Xin hỏi giờ ăn sáng ngày mai là từ mấy giờ đến mấy giờ ạ?'
      }
    ]
  },
  {
    id: 'conv-school',
    category: 'school',
    level: 'HSK 3',
    title: 'Trường học & Thi cử HSK (学校与考试)',
    scenario: 'Bạn cùng bạn học cùng lớp thảo luận về bài tập ngữ pháp và kế hoạch thi chứng chỉ HSK.',
    aiName: 'Bạn cùng lớp Trương (张同学)',
    aiRole: 'Học viên lớp tiếng Trung cao cấp',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%238B5CF6"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">学</text></svg>',
    dialogue: [
      {
        speaker: 'ai',
        hanzi: '明，下周我们就要进行HSK模拟考试了，你准备得怎么样了？',
        pinyin: 'Míng, xià zhōu wǒmen jiù yào jìnxíng HSK mónǐ kǎoshì le, nǐ zhǔnbèi de zěnmeyàng le?',
        meaning: 'Minh ơi, tuần sau chúng mình thi thử HSK rồi đấy, bạn chuẩn bị đến đâu rồi?'
      },
      {
        speaker: 'user',
        hanzi: '我听力部分还可以，但是阅读理解的长句子还是觉得有点难。',
        pinyin: 'Wǒ tīnglì bùfen hái kěyǐ, dànshì yuèdú lǐjiě de cháng jùzi háishì juéde yǒudiǎn nán.',
        meaning: 'Phần nghe của mình tạm ổn, nhưng mấy câu dài trong phần đọc hiểu mình vẫn thấy hơi khó.'
      },
      {
        speaker: 'ai',
        hanzi: '别担心，长句子最关键的是找主语和谓语。今晚我们一起在图书馆刷一套真题吧！',
        pinyin: 'Bié dānxīn, cháng jùzi zuì guānjiàn de shì zhǎo zhǔyǔ hé wèiyǔ. Jīnwǎn wǒmen yìqǐ zài túshūguǎn shuā yí tào zhēntí ba!',
        meaning: 'Đừng lo, câu dài mấu chốt nhất là tìm chủ ngữ và vị ngữ. Tối nay chúng mình cùng lên thư viện cày một bộ đề thật nhé!'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '太好了！今晚七点图书馆门口见。',
        pinyin: 'Tài hǎo le! Jīnwǎn qī diǎn túshūguǎn ménkǒu jiàn.',
        meaning: 'Tuyệt quá! Tối nay 7 giờ hẹn gặp ở cổng thư viện nhé.'
      },
      {
        hanzi: '好的，我把这几篇阅读理解打印出来。',
        pinyin: 'Hǎo de, wǒ bǎ zhè jǐ piān yuèdú lǐjiě dǎyìn chūlái.',
        meaning: 'Được, mình sẽ in mấy bài đọc hiểu này ra.'
      }
    ]
  },
  {
    id: 'conv-interview',
    category: 'interview',
    level: 'HSK 4',
    title: 'Phỏng vấn xin việc (求职面试)',
    scenario: 'Bạn tham gia buổi phỏng vấn vị trí Chuyên viên Biên dịch & Đối ngoại tại một công ty công nghệ.',
    aiName: 'Giám đốc nhân sự Vương (王总监)',
    aiRole: 'Trưởng phòng tuyển dụng',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%2310B981"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">王</text></svg>',
    dialogue: [
      {
        speaker: 'ai',
        hanzi: '你好，请坐。我看过你的简历，你的中文水平非常出色。请先做个简短的自我介绍吧。',
        pinyin: 'Nǐ hǎo, qǐng zuò. Wǒ kàn guò nǐ de jiǎnlì, nǐ de Zhōngwén shuǐpíng fēicháng chūsè. Qǐng xiān zuò gè jiǎnduǎn de zìwǒ jièshào ba.',
        meaning: 'Chào bạn, mời ngồi. Tôi đã xem qua CV của bạn, trình độ tiếng Trung của bạn rất ấn tượng. Hãy giới thiệu ngắn gọn về bản thân trước nhé.'
      },
      {
        speaker: 'user',
        hanzi: '您好，王总监。我毕业于河内大学中文系，有两年的跨国贸易翻译经验。',
        pinyin: 'Nín hǎo, Wáng zǒngjiān. Wǒ bìyè yú Hénèi Dàxué Zhōngwén xì, yǒu liǎng nián de kuàguó màoyì fānyì jīngyàn.',
        meaning: 'Chào giám đốc Vương. Tôi tốt nghiệp khoa tiếng Trung Đại học Hà Nội, có 2 năm kinh nghiệm biên phiên dịch thương mại xuyên biên giới.'
      },
      {
        speaker: 'ai',
        hanzi: '很好。在我们团队，经常需要处理突发的商务谈判，你认为自己最大的优势是什么？',
        pinyin: 'Hěn hǎo. Zài wǒmen tuánduì, jīngcháng xūyào chǔlǐ tūfā de shāngwù tánpàn, nǐ rènwéi zìjǐ zuì dà de yōushì shì shénme?',
        meaning: 'Rất tốt. Trong đội ngũ của chúng tôi thường cần xử lý các cuộc đàm phán thương mại đột xuất, bạn thấy ưu thế lớn nhất của mình là gì?'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '我的优势是沟通反应迅速，且熟悉中越两国的商务礼仪。',
        pinyin: 'Wǒ de yōushì shì gōutōng fǎnyìng xùnsù, qiě shúxī Zhōng-Yuè liǎng guó de shāngwù lǐyí.',
        meaning: 'Ưu thế của tôi là phản xạ giao tiếp nhanh nhạy và nắm vững văn hóa lễ nghi thương mại Trung - Việt.'
      },
      {
        hanzi: '我有很强的抗压能力，能高效完成紧急文件翻译。',
        pinyin: 'Wǒ yǒu hěn qiáng de kàngyā nénglì, néng gāoxiào wánchéng jǐnjí wénjiàn fānyì.',
        meaning: 'Tôi có khả năng chịu áp lực cao và có thể hoàn thành xuất sắc các bản dịch tài liệu khẩn cấp.'
      }
    ]
  },
  {
    id: 'conv-business',
    category: 'business',
    level: 'HSK 4',
    title: 'Thương mại & Đàm phán Hợp đồng (商务谈判)',
    scenario: 'Bạn đại diện doanh nghiệp đàm phán về số lượng đặt hàng tối thiểu và chiết khấu thanh toán.',
    aiName: 'Giám đốc Lý (李经理)',
    aiRole: 'Đại diện đối tác Thâm Quyến',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23F59E0B"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">李</text></svg>',
    dialogue: [
      {
        speaker: 'ai',
        hanzi: '贵公司的采购意向我们已经仔细研究过了。关于这批货物的单价，我们最多只能优惠百分之三。',
        pinyin: 'Guì gōngsī de cǎigòu yìxiàng wǒmen yǐjīng zǐxì yánjiū guò le. Guānyú zhè pī huòwù de dānjià, wǒmen zuìduō zhǐ néng yōuhuì bǎifēnzhī sān.',
        meaning: 'Ý định thu mua của quý công ty chúng tôi đã nghiên cứu kỹ. Về đơn giá của lô hàng này, chúng tôi tối đa chỉ có thể chiết khấu 3%.'
      },
      {
        speaker: 'user',
        hanzi: '如果我们将首批订购量增加一倍，贵公司能否考虑给予百分之五的折扣？',
        pinyin: 'Rúguǒ wǒmen jiāng shǒupī dìnggòuliàng zēngjiā yíbèi, guì gōngsī néngfǒu kǎolǜ jǐyǔ bǎifēnzhī wǔ de zhékòu?',
        meaning: 'Nếu chúng tôi tăng gấp đôi khối lượng đơn hàng đợt đầu, liệu quý công ty có thể cân nhắc mức chiết khấu 5% không?'
      },
      {
        speaker: 'ai',
        hanzi: '如果订购量增加一倍，我们确实可以向上级申请百分之五的优惠，但付款方式需要改为即期信用证。',
        pinyin: 'Rúguǒ dìnggòuliàng zēngjiā yíbèi, wǒmen quèshí kěyǐ xiàng shàngjí shēnqǐng bǎifēnzhī wǔ de yōuhuì, dàn fùkuǎn fāngshì xūyào gǎi wéi jíqī xìnyòngzhèng.',
        meaning: 'Nếu số lượng đặt tăng gấp đôi, chúng tôi hoàn toàn có thể xin ý kiến cấp trên mức giảm 5%, nhưng phương thức thanh toán cần đổi sang L/C trả ngay.'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '没问题，关于信用证条款，我们明天起草具体合同细节。',
        pinyin: 'Méi wèntí, guānyú xìnyòngzhèng tiáokuǎn, wǒmen míngtiān qǐcǎo jùtǐ hétong xìjié.',
        meaning: 'Không vấn đề gì, về các điều khoản L/C, ngày mai chúng tôi sẽ soạn thảo chi tiết hợp đồng.'
      },
      {
        hanzi: '希望我们双方能够长期友好合作，互利共赢。',
        pinyin: 'Xīwàng wǒmen shuāngfāng nénggòu chángqī yǒuhǎo hézuò, hùlì gòngyíng.',
        meaning: 'Hy vọng hai bên chúng ta sẽ hợp tác hữu nghị lâu dài, đôi bên cùng có lợi.'
      }
    ]
  }
];

// Gán nhãn phân loại chuẩn cho các kịch bản có sẵn
export const ALL_CONVERSATION_SCENARIOS = [
  ...CONVERSATIONS_DATA.map(c => {
    let cat = 'daily';
    let lvl = c.level || 'HSK 1';
    if (c.id === 'conv-2' || c.id === 'conv-4') {
      cat = 'shopping';
      lvl = c.id === 'conv-2' ? 'HSK 2' : 'HSK 3';
    } else if (c.id === 'conv-3') {
      cat = 'travel';
      lvl = 'HSK 2';
    } else if (c.id === 'conv-free') {
      cat = 'free';
      lvl = 'HSK 1';
    }
    return { ...c, category: cat, level: lvl };
  }),
  ...ADDITIONAL_SCENARIOS
];
