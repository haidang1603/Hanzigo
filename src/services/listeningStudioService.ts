import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { recordLearningEvent } from './learningDataService.ts';

export type ListeningCategory = 'dialogue' | 'podcast' | 'news' | 'hsk_mock';
export type DictationMode = 'hanzi' | 'pinyin';
export type DiffStatus = 'correct' | 'wrong' | 'missing' | 'extra';

export interface TranscriptSegment {
  index: number;
  speaker: string;
  start_ms: number;
  end_ms: number;
  hanzi: string;
  pinyin: string;
  vi: string;
  key_vocab: string[];
}

export interface ListeningQuestion {
  id: string;
  question_vi: string;
  question_zh: string;
  options: string[];
  correct_index: number;
  explanation_vi: string;
  evidence_segment_index: number;
}

export interface ListeningTrack {
  id: string;
  title_zh: string;
  title_vi: string;
  hsk_level: number;
  category: ListeningCategory;
  audio_url: string;
  duration_seconds: number;
  speech_rate_wpm: number;
  transcript_segments: TranscriptSegment[];
  listening_questions: ListeningQuestion[];
}

export interface DictationDiffToken {
  char: string;
  expected?: string;
  status: DiffStatus;
}

export interface DictationEvaluationResult {
  mode: DictationMode;
  accuracy: number;
  correctCount: number;
  totalExpected: number;
  diffs: DictationDiffToken[];
  homophoneHints: string[];
}

const LOGS_STORAGE_KEY = 'hanzigo_listening_studio_logs_v1';

const HOMOPHONE_NOTES: Record<string, string> = {
  '在': 'Chú ý phân biệt 在 (ở, đang) và 再 (lại, nữa) — cùng âm zài.',
  '再': 'Chú ý phân biệt 再 (lại, nữa) và 在 (ở, đang) — cùng âm zài.',
  '做': 'Phân biệt 做 (làm việc cụ thể) và 作 (sáng tác, tác phẩm) — cùng âm zuò.',
  '作': 'Phân biệt 作 (tác phẩm, công việc) và 做 (làm) — cùng âm zuò.',
  '的': 'Phân biệt 的 (định ngữ), 地 (trạng ngữ trước động từ), 得 (bổ ngữ sau động từ).',
  '地': 'Phân biệt 地 (trạng ngữ + V) với 的 và 得.',
  '得': 'Phân biệt 得 (V + 得 + bổ ngữ) với 的 và 地.',
  '他': 'Cùng âm tā: 他 (anh ấy), 她 (cô ấy), 它 (nó).',
  '她': 'Cùng âm tā: 她 (cô ấy), 他 (anh ấy), 它 (nó).',
  '买': 'Chú ý thanh điệu: 买 (mǎi - mua, thanh 3) vs 卖 (mài - bán, thanh 4).',
  '卖': 'Chú ý thanh điệu: 卖 (mài - bán, thanh 4) vs 买 (mǎi - mua, thanh 3).',
};

const BUILT_IN_TRACKS: ListeningTrack[] = [
  {
    id: 'track-hsk2-cafe-order',
    title_zh: '在咖啡馆点单',
    title_vi: 'Gọi đồ tại quán cà phê',
    hsk_level: 2,
    category: 'dialogue',
    audio_url: '',
    duration_seconds: 26,
    speech_rate_wpm: 115,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Nhân viên',
        start_ms: 0,
        end_ms: 4200,
        hanzi: '你好，请问你想喝点儿什么？',
        pinyin: 'Nǐ hǎo, qǐngwèn nǐ xiǎng hē diǎnr shénme?',
        vi: 'Xin chào, xin hỏi bạn muốn uống chút gì ạ?',
        key_vocab: ['请问', '喝', '点儿'],
      },
      {
        index: 1,
        speaker: 'Minh',
        start_ms: 4200,
        end_ms: 9200,
        hanzi: '我想买一杯热拿铁，不要太甜。',
        pinyin: 'Wǒ xiǎng mǎi yì bēi rè nátiě, bú yào tài tián.',
        vi: 'Tôi muốn mua một ly latte nóng, đừng ngọt quá.',
        key_vocab: ['买', '拿铁', '甜'],
      },
      {
        index: 2,
        speaker: 'Nhân viên',
        start_ms: 9200,
        end_ms: 14800,
        hanzi: '好的，请问在这里喝还是带走？',
        pinyin: 'Hǎo de, qǐngwèn zài zhèlǐ hē háishi dàizǒu?',
        vi: 'Vâng ạ, xin hỏi bạn uống tại đây hay mang đi?',
        key_vocab: ['还是', '带走'],
      },
      {
        index: 3,
        speaker: 'Minh',
        start_ms: 14800,
        end_ms: 20500,
        hanzi: '在这里喝，顺便用一下你们的无线网。',
        pinyin: 'Zài zhèlǐ hē, shùnbiàn yòng yíxià nǐmen de wúxiànwǎng.',
        vi: 'Uống tại đây, nhân tiện dùng nhờ Wi-Fi của quán một lát.',
        key_vocab: ['顺便', '无线网'],
      },
      {
        index: 4,
        speaker: 'Nhân viên',
        start_ms: 20500,
        end_ms: 26000,
        hanzi: '没问题，一共二十八块钱，请稍等。',
        pinyin: 'Méi wèntí, yígòng èrshíbā kuài qián, qǐng shāoděng.',
        vi: 'Không vấn đề gì, tổng cộng 28 tệ, xin vui lòng đợi một lát.',
        key_vocab: ['一共', '稍等'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-cafe-1',
        question_vi: 'Khách hàng muốn gọi đồ uống gì?',
        question_zh: '客人想点什么饮料？',
        options: ['Trà sữa đá', 'Latte nóng ít ngọt', 'Cà phê đen đá', 'Nước cam'],
        correct_index: 1,
        explanation_vi: 'Minh nói "我想买一杯热拿铁，不要太甜" (Một ly latte nóng, đừng quá ngọt).',
        evidence_segment_index: 1,
      },
      {
        id: 'lq-cafe-2',
        question_vi: 'Tại sao Minh chọn uống tại quán?',
        question_zh: '为什么他选择在这里喝？',
        options: ['Vì trời đang mưa', 'Để gặp bạn bè', 'Để tiện dùng Wi-Fi', 'Vì không có ly mang đi'],
        correct_index: 2,
        explanation_vi: 'Câu 4 nêu rõ: "顺便用一下你们的无线网" (nhân tiện dùng Wi-Fi).',
        evidence_segment_index: 3,
      },
    ],
  },
  {
    id: 'track-hsk4-remote-work',
    title_zh: '远程办公的新习惯',
    title_vi: 'Thói quen mới khi làm việc từ xa',
    hsk_level: 4,
    category: 'podcast',
    audio_url: '',
    duration_seconds: 32,
    speech_rate_wpm: 145,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Host',
        start_ms: 0,
        end_ms: 7500,
        hanzi: '近年来，越来越多公司开始支持员工远程办公。',
        pinyin: 'Jìnnián lái, yuèláiyuè duō gōngsī kāishǐ zhīchí yuángōng yuǎnchéng bàngōng.',
        vi: 'Những năm gần đây, ngày càng nhiều công ty bắt đầu ủng hộ nhân viên làm việc từ xa.',
        key_vocab: ['近年来', '支持', '远程办公'],
      },
      {
        index: 1,
        speaker: 'Host',
        start_ms: 7500,
        end_ms: 15500,
        hanzi: '虽然这样节省了每天通勤的时间，但也需要更强的自律。',
        pinyin: 'Suīrán zhèyàng jiéshěng le měitiān tōngqín de shíjiān, dàn yě xūyào gèng qiáng de zìlǜ.',
        vi: 'Tuy cách này tiết kiệm thời gian đi lại mỗi ngày, nhưng cũng đòi hỏi tính tự giác cao hơn.',
        key_vocab: ['节省', '通勤', '自律'],
      },
      {
        index: 2,
        speaker: 'Host',
        start_ms: 15500,
        end_ms: 23500,
        hanzi: '如果工作和生活的边界不清楚，人很容易感到疲惫。',
        pinyin: 'Rúguǒ gōngzuò hé shēnghuó de biānjiè bù qīngchu, rén hěn róngyì gǎndào píbèi.',
        vi: 'Nếu ranh giới giữa công việc và cuộc sống không rõ ràng, con người rất dễ cảm thấy mệt mỏi.',
        key_vocab: ['边界', '清楚', '疲惫'],
      },
      {
        index: 3,
        speaker: 'Host',
        start_ms: 23500,
        end_ms: 32000,
        hanzi: '因此，每天按时下班并保持运动是非常重要的。',
        pinyin: 'Yīncǐ, měitiān ànshí xiàbān bìng bǎochí yùndòng shì fēicháng zhòngyào de.',
        vi: 'Vì vậy, tan làm đúng giờ mỗi ngày và duy trì vận động là điều vô cùng quan trọng.',
        key_vocab: ['按时', '保持', '重要'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-remote-1',
        question_vi: 'Theo bài podcast, làm việc từ xa đòi hỏi điều gì hơn?',
        question_zh: '根据录音，远程办公更需要什么？',
        options: ['Nhiều thiết bị đắt tiền', 'Tính tự giác cao hơn', 'Làm thêm cuối tuần', 'Họp trực tiếp mỗi sáng'],
        correct_index: 1,
        explanation_vi: 'Đoạn 2 nói rõ: "但也需要更强的自律" (nhưng cũng cần tính tự giác mạnh hơn).',
        evidence_segment_index: 1,
      },
    ],
  },
  {
    id: 'track-hsk5-city-library',
    title_zh: '城市夜间书房',
    title_vi: 'Phòng đọc sách ban đêm giữa lòng thành phố',
    hsk_level: 5,
    category: 'news',
    audio_url: '',
    duration_seconds: 28,
    speech_rate_wpm: 165,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Phát thanh viên',
        start_ms: 0,
        end_ms: 9000,
        hanzi: '为了满足上班族的阅读需求，这座城市开设了二十四小时书房。',
        pinyin: 'Wèile mǎnzú shàngbānzú de yuèdú xūqiú, zhè zuò chéngshì kāishè le èrshísì xiǎoshí shūfáng.',
        vi: 'Nhằm đáp ứng nhu cầu đọc sách của dân văn phòng, thành phố này đã mở phòng đọc 24 giờ.',
        key_vocab: ['满足', '上班族', '需求'],
      },
      {
        index: 1,
        speaker: 'Phát thanh viên',
        start_ms: 9000,
        end_ms: 18500,
        hanzi: '读者只需要刷身份证就能免费进入，在安静的环境里学习。',
        pinyin: 'Dúzhě zhǐ xūyào shuā shēnfènzhèng jiù néng miǎnfèi jìnrù, zài ānjìng de huánjìng lǐ xuéxí.',
        vi: 'Độc giả chỉ cần quẹt thẻ căn cước là có thể vào miễn phí để học tập trong không gian yên tĩnh.',
        key_vocab: ['身份证', '免费', '环境'],
      },
      {
        index: 2,
        speaker: 'Phát thanh viên',
        start_ms: 18500,
        end_ms: 28000,
        hanzi: '这种公共空间不仅丰富了夜生活，也提升了城市的文化氛围。',
        pinyin: 'Zhè zhǒng gōnggòng kōngjiān bùjǐn fēngfù le yèshēnghuó, yě tíshēng le chéngshì de wénhuà fēnwéi.',
        vi: 'Không gian công cộng này không chỉ làm phong phú đời sống về đêm mà còn nâng tầm bầu không khí văn hóa đô thị.',
        key_vocab: ['公共空间', '丰富', '氛围'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-lib-1',
        question_vi: 'Độc giả cần làm gì để vào phòng đọc 24 giờ?',
        question_zh: '读者怎么进入二十四小时书房？',
        options: ['Mua vé tháng', 'Quẹt thẻ căn cước để vào miễn phí', 'Đăng ký trước 1 tuần', 'Có thẻ sinh viên'],
        correct_index: 1,
        explanation_vi: 'Đoạn 2 nêu rõ: "只需要刷身份证就能免费进入".',
        evidence_segment_index: 1,
      },
    ],
  },
  {
    id: 'track-hsk1-morning-greeting',
    title_zh: '早上的校园问候',
    title_vi: 'Chào hỏi buổi sáng ở trường học',
    hsk_level: 1,
    category: 'dialogue',
    audio_url: '',
    duration_seconds: 18,
    speech_rate_wpm: 95,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Lan',
        start_ms: 0,
        end_ms: 4500,
        hanzi: '早上好！你今天去学校吗？',
        pinyin: 'Zǎoshang hǎo! Nǐ jīntiān qù xuéxiào ma?',
        vi: 'Chào buổi sáng! Hôm nay bạn có đi học ở trường không?',
        key_vocab: ['早上好', '今天', '学校'],
      },
      {
        index: 1,
        speaker: 'Nam',
        start_ms: 4500,
        end_ms: 10500,
        hanzi: '我去学校，上午九点有汉语课。',
        pinyin: 'Wǒ qù xuéxiào, shàngwǔ jiǔ diǎn yǒu Hànyǔ kè.',
        vi: 'Tôi có đi trường, 9 giờ sáng có tiết tiếng Trung.',
        key_vocab: ['上午', '点', '汉语课'],
      },
      {
        index: 2,
        speaker: 'Lan',
        start_ms: 10500,
        end_ms: 17500,
        hanzi: '太好了，我们一起走吧。',
        pinyin: 'Tài hǎo le, wǒmen yìqǐ zǒu ba.',
        vi: 'Tuyệt quá, chúng mình cùng đi nhé.',
        key_vocab: ['太好了', '一起'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-hsk1-morning-1',
        question_vi: 'Nam có tiết học tiếng Trung vào lúc mấy giờ?',
        question_zh: '他几点有汉语课？',
        options: ['7 giờ sáng', '8 giờ sáng', '9 giờ sáng', '2 giờ chiều'],
        correct_index: 2,
        explanation_vi: 'Đoạn 2 nói rõ: "上午九点有汉语课" (9 giờ sáng có tiết tiếng Trung).',
        evidence_segment_index: 1,
      },
    ],
  },
  {
    id: 'track-hsk3-travel-booking',
    title_zh: '预订酒店房间',
    title_vi: 'Đặt phòng khách sạn khi đi du lịch',
    hsk_level: 3,
    category: 'dialogue',
    audio_url: '',
    duration_seconds: 28,
    speech_rate_wpm: 125,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Khách',
        start_ms: 0,
        end_ms: 6800,
        hanzi: '你好，我在网上预订了一间双人房，一共住三个晚上。',
        pinyin: 'Nǐ hǎo, wǒ zài wǎngshàng yùdìng le yì jiān shuāngrénfáng, yígòng zhù sān gè wǎnshang.',
        vi: 'Xin chào, tôi đã đặt một phòng đôi trên mạng, ở tổng cộng 3 đêm.',
        key_vocab: ['网上', '预订', '双人房'],
      },
      {
        index: 1,
        speaker: 'Lễ tân',
        start_ms: 6800,
        end_ms: 14500,
        hanzi: '好的，请给我看一下您的护照。请问您需要安静一点的房间吗？',
        pinyin: 'Hǎo de, qǐng gěi wǒ kàn yíxià nín de hùzhào. Qǐngwèn nín xūyào ānjìng yìdiǎn de fángjiān ma?',
        vi: 'Vâng ạ, vui lòng cho tôi xem hộ chiếu của quý khách. Quý khách có cần phòng yên tĩnh một chút không?',
        key_vocab: ['护照', '安静'],
      },
      {
        index: 2,
        speaker: 'Khách',
        start_ms: 14500,
        end_ms: 23000,
        hanzi: '是的，尽量不要靠马路，谢谢。另外请问早餐几点开始？',
        pinyin: 'Shì de, jǐnliàng bú yào kào mǎlù, xièxie. Lìngwài qǐngwèn zǎocān jǐ diǎn kāishǐ?',
        vi: 'Đúng vậy, cố gắng đừng sát mặt đường nhé, cảm ơn. Ngoài ra xin hỏi bữa sáng mấy giờ bắt đầu?',
        key_vocab: ['尽量', '马路', '早餐'],
      },
      {
        index: 3,
        speaker: 'Lễ tân',
        start_ms: 23000,
        end_ms: 28000,
        hanzi: '早餐从早上六点半到九点半，在二楼餐厅。',
        pinyin: 'Zǎocān cóng zǎoshang liù diǎn bàn dào jiǔ diǎn bàn, zài èr lóu cāntīng.',
        vi: 'Bữa sáng phục vụ từ 6 giờ rưỡi đến 9 giờ rưỡi sáng tại nhà hàng tầng 2 ạ.',
        key_vocab: ['餐厅', '六点半'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-hsk3-hotel-1',
        question_vi: 'Khách hàng yêu cầu phòng có đặc điểm gì?',
        question_zh: '客人对房间有什么要求？',
        options: ['Phòng có ban công nhìn ra biển', 'Phòng yên tĩnh, cố gắng không sát mặt đường', 'Phòng ở tầng cao nhất', 'Phòng gần thang máy'],
        correct_index: 1,
        explanation_vi: 'Khách nói ở đoạn 3: "尽量不要靠马路" (cố gắng đừng sát mặt đường).',
        evidence_segment_index: 2,
      },
    ],
  },
  {
    id: 'track-hsk6-ai-society',
    title_zh: '人工智能与未来职业',
    title_vi: 'Trí tuệ nhân tạo và nghề nghiệp tương lai',
    hsk_level: 6,
    category: 'podcast',
    audio_url: '',
    duration_seconds: 32,
    speech_rate_wpm: 155,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Host',
        start_ms: 0,
        end_ms: 10500,
        hanzi: '近年来，生成式人工智能正以惊人的速度重塑各行各业的工作流程。',
        pinyin: 'Jìnnián lái, shēngchéngshì réngōng zhìnéng zhèng yǐ jīngrén de sùdù chóngsù gèháng-gèyè de gōngzuò liúchéng.',
        vi: 'Những năm gần đây, AI tạo sinh đang tái định hình quy trình làm việc của mọi ngành nghề với tốc độ kinh ngạc.',
        key_vocab: ['生成式', '重塑', '各行各业'],
      },
      {
        index: 1,
        speaker: 'Host',
        start_ms: 10500,
        end_ms: 21500,
        hanzi: '然而，技术变革并非意味着人类将被完全取代，而是促使人们转向更具创造力的岗位。',
        pinyin: 'Ránér, jìshù biàngé bìngfēi yìwèizhe rénlèi jiāng bèi wánquán qǔdài, érshì cùshǐ rénmen zhuǎnxiàng gèng jù chuàngzàolì de gǎngwèi.',
        vi: 'Tuy nhiên, biến đổi công nghệ không có nghĩa là con người sẽ bị thay thế hoàn toàn, mà thúc đẩy mọi người chuyển sang các vị trí giàu tính sáng tạo hơn.',
        key_vocab: ['变革', '取代', '创造力'],
      },
      {
        index: 2,
        speaker: 'Host',
        start_ms: 21500,
        end_ms: 32000,
        hanzi: '唯有保持终身学习的习惯，方能在时代浪潮中立于不败之地。',
        pinyin: 'Wéiyǒu bǎochí zhōngshēng xuéxí de xíguàn, fāngnéng zài shídài làngcháo zhōng lìyú búbài zhī dì.',
        vi: 'Chỉ có duy trì thói quen học tập suốt đời mới có thể đứng vững trước làn sóng thời đại.',
        key_vocab: ['终身学习', '立于不败之地'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-hsk6-ai-1',
        question_vi: 'Theo người dẫn chương trình, biến đổi công nghệ AI thúc đẩy con người chuyển sang hướng nào?',
        question_zh: '技术变革促使人们转向什么样的岗位？',
        options: ['Công việc thủ công lặp lại', 'Vị trí đòi hỏi tính sáng tạo cao hơn', 'Nghỉ hưu sớm hơn dự kiến', 'Giảm thời gian học tập'],
        correct_index: 1,
        explanation_vi: 'Đoạn 2 nói: "促使人们转向更具创造力的岗位".',
        evidence_segment_index: 1,
      },
    ],
  },
  {
    id: 'track-hsk79-economic-shift',
    title_zh: '数字经济与绿色转型',
    title_vi: 'Kinh tế số và chuyển đổi xanh (HSK 3.0)',
    hsk_level: 7,
    category: 'news',
    audio_url: '',
    duration_seconds: 34,
    speech_rate_wpm: 165,
    transcript_segments: [
      {
        index: 0,
        speaker: 'BTV Thời sự',
        start_ms: 0,
        end_ms: 11500,
        hanzi: '当前全球产业链正经历深刻调整，绿色低碳与数字化转型已成为高质量发展的核心引擎。',
        pinyin: 'Dāngqián quánqiú chǎnyèliàn zhèng jīnglì shēnkè tiáozhěng, lǜsè dītàn yǔ shùzìhuà zhuǎnxíng yǐ chéngwéi gāo zhìliàng fāzhǎn de héxīn yǐnqíng.',
        vi: 'Hiện nay chuỗi cung ứng toàn cầu đang trải qua sự điều chỉnh sâu sắc; chuyển đổi xanh carbon thấp và chuyển đổi số đã trở thành động lực cốt lõi cho phát triển chất lượng cao.',
        key_vocab: ['产业链', '低碳', '核心引擎'],
      },
      {
        index: 1,
        speaker: 'BTV Thời sự',
        start_ms: 11500,
        end_ms: 23000,
        hanzi: '诸多制造企业借助工业互联网平台，显著降低了单位产值的能耗与碳排放。',
        pinyin: 'Zhūduō zhìzào qǐyè jièzhù gōngyè hùliánwǎng píngtái, xiǎnzhù jiàngdī le dānwèi chǎnzhí de nénghào yǔ tàn páifàng.',
        vi: 'Nhiều doanh nghiệp sản xuất nhờ nền tảng internet công nghiệp đã giảm đáng kể mức tiêu hao năng lượng và phát thải carbon trên mỗi đơn vị giá trị sản lượng.',
        key_vocab: ['工业互联网', '能耗', '碳排放'],
      },
      {
        index: 2,
        speaker: 'BTV Thời sự',
        start_ms: 23000,
        end_ms: 34000,
        hanzi: '事实证明，经济发展与生态保护完全可以相辅相成，实现双赢。',
        pinyin: 'Shìshí zhèngmíng, jīngjì fāzhǎn yǔ shēngtài bǎohù wánquán kěyǐ xiāngfǔ-xiāngchéng, shíxiàn shuāngyíng.',
        vi: 'Thực tế chứng minh, phát triển kinh tế và bảo vệ sinh thái hoàn toàn có thể bổ trợ lẫn nhau để đạt mục tiêu cùng thắng.',
        key_vocab: ['相辅相成', '双赢'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-hsk79-eco-1',
        question_vi: 'Các doanh nghiệp sản xuất dùng công cụ gì để giảm tiêu hao năng lượng và khí thải?',
        question_zh: '制造企业借助什么来降低能耗与碳排放？',
        options: ['Thuê thêm lao động phổ thông', 'Nền tảng Internet công nghiệp', 'Tăng giá bán sản phẩm', 'Cắt giảm toàn bộ dây chuyền'],
        correct_index: 1,
        explanation_vi: 'Đoạn 2 nêu: "借助工业互联网平台，显著降低了单位产值的能耗与碳排放".',
        evidence_segment_index: 1,
      },
    ],
  },
];

export function getBuiltInListeningTracks(): ListeningTrack[] {
  return BUILT_IN_TRACKS;
}

export function normalizeListeningQuestions(rawQuestions: unknown): ListeningQuestion[] {
  if (!Array.isArray(rawQuestions)) return [];

  return rawQuestions.map((item, idx) => {
    const q = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;

    let options: string[] = [];
    let correctIndex = typeof q.correct_index === 'number' ? q.correct_index : 0;

    if (Array.isArray(q.options)) {
      options = q.options.map((opt) => String(opt ?? ''));
    } else if (q.options && typeof q.options === 'object') {
      const entries = Object.entries(q.options as Record<string, unknown>);
      options = entries.map(([key, val]) => `${key}. ${String(val ?? '')}`);

      if (typeof q.correct_index !== 'number' && typeof q.correct_answer === 'string') {
        const answerKey = q.correct_answer.trim().toUpperCase();
        const foundIdx = entries.findIndex(([key]) => key.trim().toUpperCase() === answerKey);
        if (foundIdx >= 0) {
          correctIndex = foundIdx;
        }
      }
    }

    return {
      id: String(q.id || `lq-${q.question_number ?? idx + 1}`),
      question_vi: String(q.question_vi || q.question_zh || `Câu hỏi ${idx + 1}`),
      question_zh: String(q.question_zh || ''),
      options,
      correct_index: correctIndex,
      explanation_vi: String(q.explanation_vi || ''),
      evidence_segment_index:
        typeof q.evidence_segment_index === 'number' && Number.isFinite(q.evidence_segment_index)
          ? q.evidence_segment_index
          : 0,
    };
  });
}

export async function listListeningTracks(): Promise<ListeningTrack[]> {
  if (!isSupabaseConfigured || !supabase) {
    return BUILT_IN_TRACKS;
  }

  try {
    const { data, error } = await supabase
      .from('listening_tracks')
      .select('*')
      .order('hsk_level', { ascending: true });

    if (error || !Array.isArray(data) || data.length === 0) {
      return BUILT_IN_TRACKS;
    }

    return data.map((row) => ({
      id: String(row.id),
      title_zh: String(row.title_zh || ''),
      title_vi: String(row.title_vi || ''),
      hsk_level: Number(row.hsk_level || 2),
      category: (row.category as ListeningCategory) || 'dialogue',
      audio_url: String(row.audio_url || ''),
      duration_seconds: Number(row.duration_seconds || 60),
      speech_rate_wpm: Number(row.speech_rate_wpm || 130),
      transcript_segments: Array.isArray(row.transcript_segments)
        ? (row.transcript_segments as TranscriptSegment[])
        : [],
      listening_questions: normalizeListeningQuestions(row.listening_questions),
    }));
  } catch {
    return BUILT_IN_TRACKS;
  }
}

function stripPunctuationForHanzi(text: string): string[] {
  return Array.from(
    (text || '')
      .replace(/[，。！？、；：“”‘’（）《》【】—…,.!?;:"'()[\]\s]/g, '')
      .trim()
  );
}

function normalizePinyinSyllable(syllable: string): string {
  return syllable
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[1-5]/g, '')
    .toLowerCase()
    .replace(/ü/g, 'v')
    .trim();
}

function stripPunctuationForPinyin(text: string): string[] {
  return (text || '')
    .replace(/[，。！？、；：“”‘’（）《》【】—…,.!?;:"'()[\]]/g, ' ')
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Align user dictation tokens against expected tokens using edit distance DP
 * and return token-level diff (`correct` | `wrong` | `missing` | `extra`).
 */
export function evaluateDictationDiff(
  userInput: string,
  targetSegment: Pick<TranscriptSegment, 'hanzi' | 'pinyin'>,
  mode: DictationMode = 'hanzi'
): DictationEvaluationResult {
  const expectedTokens =
    mode === 'hanzi'
      ? stripPunctuationForHanzi(targetSegment.hanzi)
      : stripPunctuationForPinyin(targetSegment.pinyin);

  const actualTokens =
    mode === 'hanzi'
      ? stripPunctuationForHanzi(userInput)
      : stripPunctuationForPinyin(userInput);

  const isEqual = (a: string, b: string): boolean => {
    if (mode === 'hanzi') return a === b;
    return normalizePinyinSyllable(a) === normalizePinyinSyllable(b);
  };

  const m = expectedTokens.length;
  const n = actualTokens.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (isEqual(expectedTokens[i - 1], actualTokens[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const diffs: DictationDiffToken[] = [];
  const homophoneSet = new Set<string>();
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && isEqual(expectedTokens[i - 1], actualTokens[j - 1])) {
      diffs.push({ char: actualTokens[j - 1], expected: expectedTokens[i - 1], status: 'correct' });
      i -= 1;
      j -= 1;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      const exp = expectedTokens[i - 1];
      diffs.push({ char: actualTokens[j - 1], expected: exp, status: 'wrong' });
      if (mode === 'hanzi' && HOMOPHONE_NOTES[exp]) {
        homophoneSet.add(HOMOPHONE_NOTES[exp]);
      }
      i -= 1;
      j -= 1;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      const exp = expectedTokens[i - 1];
      diffs.push({ char: exp, expected: exp, status: 'missing' });
      if (mode === 'hanzi' && HOMOPHONE_NOTES[exp]) {
        homophoneSet.add(HOMOPHONE_NOTES[exp]);
      }
      i -= 1;
    } else {
      diffs.push({ char: actualTokens[j - 1], status: 'extra' });
      j -= 1;
    }
  }

  diffs.reverse();

  const correctCount = diffs.filter((d) => d.status === 'correct').length;
  const totalExpected = expectedTokens.length;
  const penaltyExtras = diffs.filter((d) => d.status === 'extra').length;
  const denominator = Math.max(1, totalExpected + penaltyExtras);
  const accuracy = Number(((correctCount / denominator) * 100).toFixed(2));

  return {
    mode,
    accuracy,
    correctCount,
    totalExpected,
    diffs,
    homophoneHints: Array.from(homophoneSet),
  };
}

export async function recordListeningProgress(params: {
  user?: { id?: string | null } | null;
  track: ListeningTrack;
  dictationAccuracy: number;
  completedSegments: number[];
  quizScore: number;
}): Promise<void> {
  const { user = null, track, dictationAccuracy, completedSegments, quizScore } = params;

  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(LOGS_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      parsed[track.id] = {
        dictationAccuracy,
        completedSegments,
        quizScore,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(parsed));
    }
  } catch {
    // ignore storage errors
  }

  void recordLearningEvent({
    userId: user?.id ?? null,
    sourceModule: 'lesson',
    hskLevel: track.hsk_level,
    skillDomain: 'listening',
    itemId: track.id,
    isCorrect: dictationAccuracy >= 70 || quizScore >= 60,
    scoreEarned: Math.round(Math.max(dictationAccuracy, quizScore)),
    scoreMax: 100,
    durationMs: track.duration_seconds * 1000,
    payload: { completedSegmentsCount: completedSegments.length },
  });

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      await supabase.from('user_listening_logs').upsert(
        {
          user_id: user.id,
          track_id: track.id,
          dictation_accuracy: dictationAccuracy,
          completed_segments: completedSegments,
          quiz_score: quizScore,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,track_id' }
      );
    } catch {
      // non-fatal when track is built-in local id
    }
  }
}
