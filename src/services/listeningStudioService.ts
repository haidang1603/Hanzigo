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
  {
    id: 'track-hsk1-supermarket-fruit',
    title_zh: '在超市买水果',
    title_vi: 'Mua hoa quả ở siêu thị',
    hsk_level: 1,
    category: 'dialogue',
    audio_url: '',
    duration_seconds: 22,
    speech_rate_wpm: 95,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Khách',
        start_ms: 0,
        end_ms: 5000,
        hanzi: '请问，苹果多少钱一斤？',
        pinyin: 'Qǐngwèn, píngguǒ duōshao qián yì jīn?',
        vi: 'Xin hỏi, táo bao nhiêu tiền một cân (500g)?',
        key_vocab: ['请问', '苹果', '多少钱'],
      },
      {
        index: 1,
        speaker: 'Nhân viên',
        start_ms: 5000,
        end_ms: 10500,
        hanzi: '这种红苹果今天打折，六块钱一斤。',
        pinyin: 'Zhè zhǒng hóng píngguǒ jīntiān dǎzhé, liù kuài qián yì jīn.',
        vi: 'Loại táo đỏ này hôm nay giảm giá, 6 tệ một cân.',
        key_vocab: ['打折', '红苹果'],
      },
      {
        index: 2,
        speaker: 'Khách',
        start_ms: 10500,
        end_ms: 16000,
        hanzi: '很便宜！那我买三斤，再来两串香蕉。',
        pinyin: 'Hěn piányi! Nà wǒ mǎi sān jīn, zài lái liǎng chuàn xiāngjiāo.',
        vi: 'Rẻ quá! Vậy tôi mua 3 cân, thêm hai nải chuối nữa.',
        key_vocab: ['便宜', '香蕉'],
      },
      {
        index: 3,
        speaker: 'Nhân viên',
        start_ms: 16000,
        end_ms: 22000,
        hanzi: '好的，一共三十块，请在这里扫码付款。',
        pinyin: 'Hǎo de, yígòng sānshí kuài, qǐng zài zhèlǐ sǎomǎ fùkuǎn.',
        vi: 'Vâng, tổng cộng 30 tệ, mời bạn quét mã thanh toán ở đây.',
        key_vocab: ['一共', '扫码'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-fruit-1',
        question_vi: 'Giá táo đỏ hôm nay là bao nhiêu một cân?',
        question_zh: '今天红苹果多少钱一斤？',
        options: ['5 tệ', '6 tệ', '8 tệ', '10 tệ'],
        correct_index: 1,
        explanation_vi: 'Nhân viên nói: "这种红苹果今天打折，六块钱一斤".',
        evidence_segment_index: 1,
      },
      {
        id: 'lq-fruit-2',
        question_vi: 'Khách hàng thanh toán bằng cách nào?',
        question_zh: '客人怎么付款？',
        options: ['Tiền mặt', 'Thẻ tín dụng', 'Quét mã QR', 'Chuyển khoản ngân hàng'],
        correct_index: 2,
        explanation_vi: 'Câu cuối nhắc: "请在这里扫码付款" (vui lòng quét mã thanh toán).',
        evidence_segment_index: 3,
      },
    ],
  },
  {
    id: 'track-hsk1-family-weekend',
    title_zh: '周末和家人吃饭',
    title_vi: 'Ăn cơm cuối tuần cùng gia đình',
    hsk_level: 1,
    category: 'dialogue',
    audio_url: '',
    duration_seconds: 22,
    speech_rate_wpm: 98,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Mẹ',
        start_ms: 0,
        end_ms: 5200,
        hanzi: '明天是星期天，你中午回家吃饭吗？',
        pinyin: 'Míngtiān shì Xīngqītiān, nǐ zhōngwǔ huí jiā chīfàn ma?',
        vi: 'Ngày mai là Chủ nhật, buổi trưa con có về nhà ăn cơm không?',
        key_vocab: ['星期天', '回家'],
      },
      {
        index: 1,
        speaker: 'Tiểu Minh',
        start_ms: 5200,
        end_ms: 11000,
        hanzi: '回！我十一点半就到家，顺便买爸爸爱喝的茶。',
        pinyin: 'Huí! Wǒ shíyī diǎn bàn jiù dào jiā, shùnbiàn mǎi bàba ài hē de chá.',
        vi: 'Có ạ! 11 rưỡi con về tới nhà, tiện mua trà bố thích uống.',
        key_vocab: ['十一点半', '顺便'],
      },
      {
        index: 2,
        speaker: 'Mẹ',
        start_ms: 11000,
        end_ms: 16500,
        hanzi: '太好了，妈妈给你做你最喜欢的鱼和青菜。',
        pinyin: 'Tài hǎo le, māma gěi nǐ zuò nǐ zuì xǐhuan de yú hé qīngcài.',
        vi: 'Tuyệt quá, mẹ sẽ làm món cá và rau xanh mà con thích nhất.',
        key_vocab: ['最喜欢', '青菜'],
      },
      {
        index: 3,
        speaker: 'Tiểu Minh',
        start_ms: 16500,
        end_ms: 22000,
        hanzi: '谢谢妈妈，明天见！',
        pinyin: 'Xièxie māma, míngtiān jiàn!',
        vi: 'Cảm ơn mẹ, mai gặp mẹ nhé!',
        key_vocab: ['明天见'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-family-1',
        question_vi: 'Tiểu Minh mấy giờ sẽ về đến nhà?',
        question_zh: '小明几点到家？',
        options: ['10 giờ rưỡi', '11 giờ', '11 giờ rưỡi', '12 giờ'],
        correct_index: 2,
        explanation_vi: 'Tiểu Minh nói: "我十一点半就到家" (11 giờ 30 phút).',
        evidence_segment_index: 1,
      },
    ],
  },
  {
    id: 'track-hsk2-ask-directions',
    title_zh: '问路去地铁站',
    title_vi: 'Hỏi đường đến ga tàu điện ngầm',
    hsk_level: 2,
    category: 'dialogue',
    audio_url: '',
    duration_seconds: 24,
    speech_rate_wpm: 110,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Du khách',
        start_ms: 0,
        end_ms: 5800,
        hanzi: '不好意思，请问最近的地铁站怎么走？',
        pinyin: 'Bù hǎoyìsi, qǐngwèn zuìjìn de dìtiězhàn zěnme zǒu?',
        vi: 'Xin lỗi, cho hỏi ga tàu điện ngầm gần nhất đi đường nào ạ?',
        key_vocab: ['不好意思', '最近', '地铁站'],
      },
      {
        index: 1,
        speaker: 'Người dân',
        start_ms: 5800,
        end_ms: 12000,
        hanzi: '你一直往前走，过两个红绿灯，再往左拐。',
        pinyin: 'Nǐ yìzhí wǎng qián zǒu, guò liǎng gè hónglǜdēng, zài wǎng zuǒ guǎi.',
        vi: 'Bạn cứ đi thẳng về phía trước, qua hai cái đèn đỏ rồi rẽ trái.',
        key_vocab: ['往前走', '红绿灯', '往左拐'],
      },
      {
        index: 2,
        speaker: 'Du khách',
        start_ms: 12000,
        end_ms: 17800,
        hanzi: '走路大概要多长时间？我怕赶不上火车。',
        pinyin: 'Zǒulù dàgài yào duō cháng shíjiān? Wǒ pà gǎnbushàng huǒchē.',
        vi: 'Đi bộ mất khoảng bao lâu ạ? Tôi sợ không kịp tàu hỏa.',
        key_vocab: ['大概', '赶不上'],
      },
      {
        index: 3,
        speaker: 'Người dân',
        start_ms: 17800,
        end_ms: 24000,
        hanzi: '不远，走快一点儿五分钟就到了。',
        pinyin: 'Bù yuǎn, zǒu kuài yìdiǎnr wǔ fēnzhōng jiù dào le.',
        vi: 'Không xa đâu, đi nhanh một chút khoảng 5 phút là tới.',
        key_vocab: ['五分钟'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-dir-1',
        question_vi: 'Sau khi qua hai đèn đỏ, du khách cần rẽ hướng nào?',
        question_zh: '过了两个红绿灯后应该往哪边拐？',
        options: ['Rẽ phải', 'Rẽ trái', 'Quay đầu lại', 'Đi thẳng tiếp'],
        correct_index: 1,
        explanation_vi: 'Người dân chỉ đường: "过两个红绿灯，再往左拐" (rẽ trái).',
        evidence_segment_index: 1,
      },
    ],
  },
  {
    id: 'track-hsk2-seeing-doctor',
    title_zh: '感冒看医生',
    title_vi: 'Đi khám bác sĩ vì cảm cúm',
    hsk_level: 2,
    category: 'hsk_mock',
    audio_url: '',
    duration_seconds: 25,
    speech_rate_wpm: 112,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Bác sĩ',
        start_ms: 0,
        end_ms: 5500,
        hanzi: '你哪里不舒服？什么时候开始的？',
        pinyin: 'Nǐ nǎlǐ bù shūfu? Shénme shíhou kāishǐ de?',
        vi: 'Bạn thấy khó chịu ở đâu? Bắt đầu từ khi nào?',
        key_vocab: ['不舒服', '开始'],
      },
      {
        index: 1,
        speaker: 'Bệnh nhân',
        start_ms: 5500,
        end_ms: 12000,
        hanzi: '从昨天晚上开始有点儿发烧，嗓子也很疼。',
        pinyin: 'Cóng zuótiān wǎnshang kāishǐ yǒudiǎnr fāshāo, sǎngzi yě hěn téng.',
        vi: 'Từ tối hôm qua bắt đầu hơi sốt, cổ họng cũng rất đau.',
        key_vocab: ['发烧', '嗓子', '疼'],
      },
      {
        index: 2,
        speaker: 'Bác sĩ',
        start_ms: 12000,
        end_ms: 18500,
        hanzi: '应该是受凉感冒了。我给你开点儿药，每天吃三次。',
        pinyin: 'Yīnggāi shì shòuliáng gǎnmào le. Wǒ gěi nǐ kāi diǎnr yào, měitiān chī sān cì.',
        vi: 'Chắc là bị nhiễm lạnh cảm cúm rồi. Tôi kê cho bạn ít thuốc, mỗi ngày uống 3 lần.',
        key_vocab: ['感冒', '开药'],
      },
      {
        index: 3,
        speaker: 'Bác sĩ',
        start_ms: 18500,
        end_ms: 25000,
        hanzi: '这几天记得多喝温水，早点儿休息。',
        pinyin: 'Zhè jǐ tiān jìde duō hē wēnshuǐ, zǎodiǎnr xiūxi.',
        vi: 'Mấy ngày này nhớ uống nhiều nước ấm, nghỉ ngơi sớm nhé.',
        key_vocab: ['温水', '休息'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-doc-1',
        question_vi: 'Bệnh nhân cần uống thuốc mấy lần một ngày?',
        question_zh: '病人每天要吃几次药？',
        options: ['1 lần', '2 lần', '3 lần', '4 lần'],
        correct_index: 2,
        explanation_vi: 'Bác sĩ dặn: "每天吃三次" (mỗi ngày uống 3 lần).',
        evidence_segment_index: 2,
      },
    ],
  },
  {
    id: 'track-hsk3-renting-apartment',
    title_zh: '租房子看房',
    title_vi: 'Xem phòng thuê nhà',
    hsk_level: 3,
    category: 'dialogue',
    audio_url: '',
    duration_seconds: 26,
    speech_rate_wpm: 125,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Người thuê',
        start_ms: 0,
        end_ms: 6000,
        hanzi: '这套两居室的采光真不错，家具都是新的吗？',
        pinyin: 'Zhè tào liǎng jūshì de cǎiguāng zhēn búcuò, jiājù dōu shì xīn de ma?',
        vi: 'Căn hộ 2 phòng ngủ này ánh sáng tự nhiên tốt thật, nội thất đều là đồ mới ạ?',
        key_vocab: ['两居室', '采光', '家具'],
      },
      {
        index: 1,
        speaker: 'Chủ nhà',
        start_ms: 6000,
        end_ms: 13000,
        hanzi: '对，空调、洗衣机和冰箱都是去年刚换的，拎包就能入住。',
        pinyin: 'Duì, kōngtiáo, xǐyījī hé bīngxiāng dōu shì qùnián gāng huàn de, līnbāo jiù néng rùzhù.',
        vi: 'Đúng rồi, điều hòa, máy giặt và tủ lạnh đều mới thay năm ngoái, xách vali vào là ở được ngay.',
        key_vocab: ['空调', '拎包入住'],
      },
      {
        index: 2,
        speaker: 'Người thuê',
        start_ms: 13000,
        end_ms: 19500,
        hanzi: '月租怎么算？水费和网费包含在里面吗？',
        pinyin: 'Yuèzū zěnme suàn? Shuǐfèi hé wǎngfèi bāohán zài lǐmiàn ma?',
        vi: 'Tiền thuê hàng tháng tính thế nào ạ? Tiền nước và tiền mạng đã bao gồm trong đó chưa?',
        key_vocab: ['月租', '包含'],
      },
      {
        index: 3,
        speaker: 'Chủ nhà',
        start_ms: 19500,
        end_ms: 26000,
        hanzi: '房租每月三千五，包含物业费和宽带，水电按表另算。',
        pinyin: 'Fángzū měiyuè sānqiān wǔ, bāohán wùyèfèi hé kuāndài, shuǐdiàn àn biǎo lìng suàn.',
        vi: 'Tiền thuê mỗi tháng 3.500 tệ, đã bao gồm phí quản lý và internet, điện nước tính riêng theo đồng hồ.',
        key_vocab: ['房租', '物业费', '水电'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-rent-1',
        question_vi: 'Khoản phí nào KHÔNG bao gồm trong tiền thuê nhà 3.500 tệ?',
        question_zh: '3500元房租里不包含哪项费用？',
        options: ['Phí quản lý', 'Internet băng thông rộng', 'Tiền điện và nước', 'Nội thất có sẵn'],
        correct_index: 2,
        explanation_vi: 'Chủ nhà nói rõ: "包含物业费和宽带，水电按表另算" (điện nước tính riêng).',
        evidence_segment_index: 3,
      },
    ],
  },
  {
    id: 'track-hsk3-chinese-tea-podcast',
    title_zh: '每天一杯茶',
    title_vi: 'Podcast: Thói quen mỗi ngày một tách trà',
    hsk_level: 3,
    category: 'podcast',
    audio_url: '',
    duration_seconds: 26,
    speech_rate_wpm: 122,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Host',
        start_ms: 0,
        end_ms: 8500,
        hanzi: '在快节奏的城市生活里，越来越多年轻人开始喜欢上自己泡茶。',
        pinyin: 'Zài kuài jiézòu de chéngshì shēnghuó lǐ, yuèláiyuè duō niánqīngrén kāishǐ xǐhuan shàng zìjǐ pàochá.',
        vi: 'Trong nhịp sống đô thị hối hả, ngày càng nhiều bạn trẻ bắt đầu thích tự tay pha trà.',
        key_vocab: ['快节奏', '泡茶'],
      },
      {
        index: 1,
        speaker: 'Host',
        start_ms: 8500,
        end_ms: 17500,
        hanzi: '相比含糖饮料，清淡的绿茶和乌龙茶不仅解渴，还能帮助提神。',
        pinyin: 'Xiāngbǐ hán táng yǐnliào, qīngdàn de lǜchá hé wūlóngchá bùjǐn jiěkě, hái néng bāngzhù tíshén.',
        vi: 'So với đồ uống có đường, trà xanh và trà ô long thanh đạm không chỉ giải khát mà còn giúp tỉnh táo.',
        key_vocab: ['相比', '清淡', '提神'],
      },
      {
        index: 2,
        speaker: 'Host',
        start_ms: 17500,
        end_ms: 26000,
        hanzi: '花十分钟安静地喝一杯热茶，也是给心情放一个小假。',
        pinyin: 'Huā shí fēnzhōng ānjìng de hē yì bēi rè chá, yě shì gěi xīnqíng fàng yí ge xiǎo jià.',
        vi: 'Dành 10 phút yên tĩnh uống một tách trà nóng cũng là cho tâm trạng nghỉ ngơi một chút.',
        key_vocab: ['心情', '放假'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-tea-1',
        question_vi: 'Theo podcast, trà xanh và trà ô long có lợi ích gì so với nước ngọt?',
        question_zh: '和含糖饮料相比，绿茶和乌龙茶有什么好处？',
        options: ['Giúp tăng cân nhanh', 'Vừa giải khát vừa giúp tỉnh táo', 'Ngọt hơn nhiều', 'Uống vào buổi tối dễ ngủ hơn'],
        correct_index: 1,
        explanation_vi: 'Đoạn 2 nói: "不仅解渴，还能帮助提神" (vừa giải khát vừa giúp tỉnh táo).',
        evidence_segment_index: 1,
      },
    ],
  },
  {
    id: 'track-hsk4-job-interview',
    title_zh: '求职面试准备',
    title_vi: 'Chuẩn bị phỏng vấn xin việc',
    hsk_level: 4,
    category: 'hsk_mock',
    audio_url: '',
    duration_seconds: 28,
    speech_rate_wpm: 138,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Nhà tuyển dụng',
        start_ms: 0,
        end_ms: 6800,
        hanzi: '请你用两分钟时间，简单介绍一下自己的工作经验。',
        pinyin: 'Qǐng nǐ yòng liǎng fēnzhōng shíjiān, jiǎndān jièshào yíxià zìjǐ de gōngzuò jīngyàn.',
        vi: 'Mời bạn dùng 2 phút giới thiệu ngắn gọn về kinh nghiệm làm việc của bản thân.',
        key_vocab: ['经验', '介绍'],
      },
      {
        index: 1,
        speaker: 'Ứng viên',
        start_ms: 6800,
        end_ms: 14500,
        hanzi: '我毕业后一直从事市场推广，曾独立负责过三个线上项目。',
        pinyin: 'Wǒ bìyè hòu yìzhí cóngshì shìchǎng tuīguǎng, céng dúlì fùzé guo sān gè xiànshàng xiàngmù.',
        vi: 'Sau khi tốt nghiệp tôi luôn làm mảng tiếp thị, từng phụ trách độc lập 3 dự án trực tuyến.',
        key_vocab: ['从事', '市场推广', '负责'],
      },
      {
        index: 2,
        speaker: 'Nhà tuyển dụng',
        start_ms: 14500,
        end_ms: 21000,
        hanzi: '在团队合作中遇到意见分歧时，你通常怎么解决？',
        pinyin: 'Zài tuánduì hézuò zhōng yùdào yìjiàn fēnqí shí, nǐ tōngcháng zěnme jiějué?',
        vi: 'Khi gặp bất đồng ý kiến trong làm việc nhóm, bạn thường giải quyết thế nào?',
        key_vocab: ['团队合作', '分歧', '解决'],
      },
      {
        index: 3,
        speaker: 'Ứng viên',
        start_ms: 21000,
        end_ms: 28000,
        hanzi: '我会先认真听取同事的想法，再用真实数据来对比不同方案的优缺点。',
        pinyin: 'Wǒ huì xiān rènzhēn tīngqǔ tóngshì de xiǎngfǎ, zài yòng zhēnshí shùjù lái duìbǐ bùtóng fāng’àn de yōuquēdiǎn.',
        vi: 'Tôi sẽ lắng nghe kỹ ý kiến đồng nghiệp trước, sau đó dùng dữ liệu thực tế để so sánh ưu nhược điểm các phương án.',
        key_vocab: ['听取', '数据', '方案'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-int-1',
        question_vi: 'Ứng viên giải quyết bất đồng trong nhóm bằng cách nào?',
        question_zh: '应聘者如何解决团队中的意见分歧？',
        options: ['Làm theo ý kiến của riêng mình', 'Nhờ sếp quyết định ngay', 'Lắng nghe đồng nghiệp và đối chiếu bằng dữ liệu thực tế', 'Bỏ qua dự án'],
        correct_index: 2,
        explanation_vi: 'Ứng viên trả lời ở câu 4: lắng nghe đồng nghiệp và dùng dữ liệu thực tế để so sánh phương án.',
        evidence_segment_index: 3,
      },
    ],
  },
  {
    id: 'track-hsk4-highspeed-rail',
    title_zh: '高铁改变出行方式',
    title_vi: 'Tin tức: Tàu cao tốc thay đổi thói quen đi lại',
    hsk_level: 4,
    category: 'news',
    audio_url: '',
    duration_seconds: 28,
    speech_rate_wpm: 142,
    transcript_segments: [
      {
        index: 0,
        speaker: 'BTV Tin tức',
        start_ms: 0,
        end_ms: 9500,
        hanzi: '随着高铁网络不断完善，跨城市当日往返已经成为许多商务人士的常态。',
        pinyin: 'Suízhe gāotiě wǎngluò búduàn wánshàn, kuà chéngshì dāngrì wǎngfǎn yǐjīng chéngwéi xǔduō shāngwù rénshì de chángtài.',
        vi: 'Cùng với mạng lưới tàu cao tốc không ngừng hoàn thiện, việc đi về trong ngày giữa các thành phố đã trở thành bình thường với nhiều doanh nhân.',
        key_vocab: ['完善', '往返', '常态'],
      },
      {
        index: 1,
        speaker: 'BTV Tin tức',
        start_ms: 9500,
        end_ms: 19000,
        hanzi: '相比坐飞机，高铁站大多位于市区，准点率高，也不受天气变化太大影响。',
        pinyin: 'Xiāngbǐ zuò fēijī, gāotiězhàn dàduō wèiyú shìqū, zhǔndiǎnlǜ gāo, yě bú shòu tiānqì biànhuà tài dà yǐngxiǎng.',
        vi: 'So với đi máy bay, ga tàu cao tốc phần lớn nằm trong nội đô, tỷ lệ đúng giờ cao và ít bị ảnh hưởng lớn bởi thời tiết.',
        key_vocab: ['准点率', '市区'],
      },
      {
        index: 2,
        speaker: 'BTV Tin tức',
        start_ms: 19000,
        end_ms: 28000,
        hanzi: '如今乘客只需刷身份证就能快速进站，出行效率大幅提升。',
        pinyin: 'Rújīn chéngkè zhǐ xū shuā shēnfènzhèng jiù néng kuàisù jìnzhàn, chūxíng xiàolǜ dàfú tíshēng.',
        vi: 'Ngày nay hành khách chỉ cần quẹt căn cước là có thể vào ga nhanh chóng, hiệu suất di chuyển tăng mạnh.',
        key_vocab: ['身份证', '效率'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-hsr-1',
        question_vi: 'Ưu điểm của tàu cao tốc so với máy bay được nêu trong bản tin là gì?',
        question_zh: '新闻中提到的高铁相比飞机的优势是什么？',
        options: ['Giá vé luôn miễn phí', 'Ga nằm ở nội đô, đúng giờ và ít bị ảnh hưởng thời tiết', 'Không cần mua vé trước', 'Chở được nhiều hành lý hơn không giới hạn'],
        correct_index: 1,
        explanation_vi: 'Đoạn 2 nêu rõ: nằm ở nội đô (位于市区), đúng giờ cao (准点率高), ít bị ảnh hưởng bởi thời tiết.',
        evidence_segment_index: 1,
      },
    ],
  },
  {
    id: 'track-hsk5-digital-minimalism',
    title_zh: '远离手机焦虑',
    title_vi: 'Podcast: Giảm lệ thuộc vào điện thoại',
    hsk_level: 5,
    category: 'podcast',
    audio_url: '',
    duration_seconds: 30,
    speech_rate_wpm: 150,
    transcript_segments: [
      {
        index: 0,
        speaker: 'Host',
        start_ms: 0,
        end_ms: 10000,
        hanzi: '你是不是也习惯了每隔十分钟就下意识地解锁手机，看一眼有没有新消息？',
        pinyin: 'Nǐ shì bu shì yě xíguàn le měi gé shí fēnzhōng jiù xiàyìshí de jiěsuǒ shǒujī, kàn yì yǎn yǒu méiyǒu xīn xiāoxi?',
        vi: 'Có phải bạn cũng quen cứ cách 10 phút lại vô thức mở khóa điện thoại xem có tin nhắn mới hay không?',
        key_vocab: ['下意识', '解锁'],
      },
      {
        index: 1,
        speaker: 'Host',
        start_ms: 10000,
        end_ms: 20500,
        hanzi: '碎片化的信息虽然看似丰富，却往往打断了我们的深度思考，让人感到莫名的疲惫。',
        pinyin: 'Suìpiànhuà de xìnxī suīrán kànsì fēngfù, què wǎngwǎng dǎduàn le wǒmen de shēndù sīkǎo, ràng rén gǎndào mòmíng de píbèi.',
        vi: 'Thông tin phân mảnh tuy có vẻ phong phú nhưng lại thường cắt ngang tư duy sâu của chúng ta, khiến con người thấy mệt mỏi khó tả.',
        key_vocab: ['碎片化', '深度思考', '疲惫'],
      },
      {
        index: 2,
        speaker: 'Host',
        start_ms: 20500,
        end_ms: 30000,
        hanzi: '试着在睡前一小时关闭通知，把注意力重新还给阅读与真实的交流。',
        pinyin: 'Shìzhe zài shuì qián yì xiǎoshí guānbì tōngzhī, bǎ zhùyìlì chóngxīn huán gěi yuèdú yǔ zhēnshí de jiāoliú.',
        vi: 'Hãy thử tắt thông báo một tiếng trước khi ngủ, trả lại sự tập trung cho việc đọc sách và giao tiếp thực tế.',
        key_vocab: ['关闭通知', '注意力'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-dig-1',
        question_vi: 'Tác giả khuyên nên làm gì một giờ trước khi đi ngủ?',
        question_zh: '主播建议睡前一小时做什么？',
        options: ['Xem thêm video ngắn', 'Tắt thông báo, dành sự tập trung cho đọc sách và giao tiếp thật', 'Kiểm tra email công việc', 'Đặt báo thức mỗi 10 phút'],
        correct_index: 1,
        explanation_vi: 'Đoạn 3 khuyên: "关闭通知，把注意力重新还给阅读与真实的交流".',
        evidence_segment_index: 2,
      },
    ],
  },
  {
    id: 'track-hsk6-cultural-heritage',
    title_zh: '非物质文化遗产的传承',
    title_vi: 'Tin tức: Bảo tồn di sản văn hóa phi vật thể',
    hsk_level: 6,
    category: 'news',
    audio_url: '',
    duration_seconds: 32,
    speech_rate_wpm: 158,
    transcript_segments: [
      {
        index: 0,
        speaker: 'BTV Văn hóa',
        start_ms: 0,
        end_ms: 10500,
        hanzi: '近年来，许多传统手工艺面临后继乏人的困境，如何在现代社会焕发新生备受关注。',
        pinyin: 'Jìnniánlái, xǔduō chuántǒng shǒugōngyì miànlín hòujì-fárén de kùnjìng, rúhé zài xiàndài shèhuì huànfā xīnshēng bèishòu guānzhù.',
        vi: 'Những năm gần đây, nhiều nghề thủ công truyền thống đối mặt nguy cơ thiếu người kế thừa; làm sao để hồi sinh trong xã hội hiện đại rất được quan tâm.',
        key_vocab: ['后继乏人', '焕发新生'],
      },
      {
        index: 1,
        speaker: 'BTV Văn hóa',
        start_ms: 10500,
        end_ms: 21500,
        hanzi: '不少年轻设计师将古老纹样融入日常服饰与文创产品，使非遗真正走进大众视野。',
        pinyin: 'Bùshǎo niánqīng shèjìshī jiāng gǔlǎo wényàng róngrù rìcháng fúshì yǔ wénchuàng chǎnpǐn, shǐ fēiyí zhēnzhèng zǒujìn dàzhòng shìyě.',
        vi: 'Không ít nhà thiết kế trẻ đưa hoa văn cổ vào trang phục thường ngày và sản phẩm sáng tạo văn hóa, giúp di sản phi vật thể đến gần công chúng.',
        key_vocab: ['纹样', '文创产品', '非遗'],
      },
      {
        index: 2,
        speaker: 'BTV Văn hóa',
        start_ms: 21500,
        end_ms: 32000,
        hanzi: '事实表明，唯有与当代审美相结合，传统文化才能在传承中持续创新。',
        pinyin: 'Shìshí biǎomíng, wéiyǒu yǔ dāngdài shěnměi xiāng jiéhé, chuántǒng wénhuà cái néng zài chuánchéng zhōng chíxù chuàngxīn.',
        vi: 'Thực tế cho thấy, chỉ khi kết hợp với thẩm mỹ đương đại, văn hóa truyền thống mới có thể tiếp tục đổi mới trong quá trình kế thừa.',
        key_vocab: ['当代审美', '传承', '持续创新'],
      },
    ],
    listening_questions: [
      {
        id: 'lq-her-1',
        question_vi: 'Các nhà thiết kế trẻ đã làm gì để di sản phi vật thể đến gần công chúng hơn?',
        question_zh: '年轻设计师如何让非遗走进大众视野？',
        options: ['Chỉ trưng bày trong bảo tàng đóng kín', 'Đưa hoa văn cổ vào trang phục thường ngày và sản phẩm văn hóa sáng tạo', 'Thay thế hoàn toàn bằng công nghệ 3D', 'Cấm bán sản phẩm thủ công'],
        correct_index: 1,
        explanation_vi: 'Đoạn 2 nêu: "将古老纹样融入日常服饰与文创产品".',
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

    const remoteTracks: ListeningTrack[] = data.map((row) => ({
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

    const seenKeys = new Set(
      remoteTracks.map((t) => `${t.id}::${t.title_zh.trim()}`)
    );
    const seenIds = new Set(remoteTracks.map((t) => t.id));
    const seenTitles = new Set(remoteTracks.map((t) => t.title_zh.trim()));

    const merged = [
      ...remoteTracks,
      ...BUILT_IN_TRACKS.filter(
        (t) =>
          !seenKeys.has(`${t.id}::${t.title_zh.trim()}`) &&
          !seenIds.has(t.id) &&
          !seenTitles.has(t.title_zh.trim())
      ),
    ];

    return merged.sort((a, b) => a.hsk_level - b.hsk_level);
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
