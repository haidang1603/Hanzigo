/**
 * =========================================================================
 * HSK EXAM STRUCTURE & OFFICIAL FORMAT VALIDATION DATASET
 * =========================================================================
 * Dữ liệu cấu trúc đề thi HSK chính thức được đối chiếu và xác minh từ:
 * - Nguồn chính thức: Chinese Testing International (CTI) & Trung tâm Hợp tác
 *   Giao lưu Ngôn ngữ Trung - Ngoại (CLEC) / http://www.chinesetest.cn/
 * - Tiêu chuẩn Đánh giá Năng lực Tiếng Trung Giáo dục Quốc tế (GF0025-2021)
 *
 * PHÂN BIỆT RÕ RÀNG:
 * 1. Phiên bản "2015-Standard" (HSK 2.0): Cấu trúc đang được áp dụng phổ biến
 *    và đồng nhất tại các điểm thi HSK trên toàn cầu trong thực tế.
 * 2. Phiên bản "HSK 3.0-2021": Tiêu chuẩn cấp bậc mới (3 giai đoạn 9 cấp).
 *    Hiện tại HSK 7-9 đã thi chính thức, trong khi HSK 1-6 đang trong lộ trình
 *    chuyển tiếp. Các thông số chưa chốt ngày áp dụng đề thi mới đều được
 *    đánh dấu minh bạch là "Chưa xác minh / Đang chuyển tiếp".
 * =========================================================================
 */

export const HSK_OFFICIAL_VERSIONS = [
  {
    id: '2015-Standard',
    name: 'HSK 2.0 (Khảo thí Hiện hành Toàn cầu)',
    shortName: 'HSK Hiện hành',
    status: 'active_official',
    statusLabel: 'Đang áp dụng thực tế tại điểm thi',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    description: 'Hệ thống đề thi 6 cấp độ truyền thống được CTI / chinesetest.cn sử dụng để cấp chứng chỉ du học và việc làm hiện nay.',
    verifiedDate: '2026-10-12',
    officialPortal: 'http://www.chinesetest.cn/'
  },
  {
    id: 'HSK 3.0-2021',
    name: 'HSK 3.0 (Tiêu chuẩn Khảo thí Mới GF0025-2021)',
    shortName: 'HSK 3.0 Mới',
    status: 'partially_implemented',
    statusLabel: 'HSK 7-9 đã áp dụng • HSK 1-6 đang chuyển tiếp',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    description: 'Khung năng lực ngôn ngữ quốc gia 3 giai đoạn 9 cấp. Cấp độ 7-9 đã chính thức thi từ tháng 11/2022; cấp độ 1-6 đang hoàn thiện ngân hàng đề.',
    verifiedDate: '2026-10-12',
    officialPortal: 'http://www.chinesetest.cn/'
  }
];

export const HSK_STRUCTURE_DEFINITIONS = {
  // =========================================================================
  // HSK 1
  // =========================================================================
  'hsk-1': {
    level: 'HSK 1',
    levelCode: '1',
    levelNameVi: 'Cấp độ 1 — Nhập môn',
    tagline: 'Hiểu và sử dụng được các cụm từ, câu tiếng Trung vô cùng đơn giản để đáp ứng nhu cầu giao tiếp cụ thể.',
    vocabularyRequirement: 150,
    characterRequirement: 174,
    versions: {
      '2015-Standard': {
        isOfficial: true,
        verificationStatus: 'verified',
        verifiedDate: '2026-10-12',
        sourceReference: 'CTI chinesetest.cn — HSK (一级) 考试大纲',
        sourceUrl: 'http://www.chinesetest.cn/godownload.do',
        totalDurationMinutes: 40,
        fillingInfoMinutes: 5,
        totalQuestions: 40,
        maxScore: 200,
        passingScore: 120,
        passingNote: 'Điểm tổng đạt từ 120/200 trở lên là Đỗ. Không yêu cầu điểm liệt theo từng phần thi.',
        hasPinyin: true,
        audioPlayCount: 2,
        sections: [
          {
            sectionId: 'listening',
            nameCn: '听力',
            nameVi: 'Nghe hiểu',
            questionCount: 20,
            durationMinutes: 15,
            maxScore: 100,
            audioRules: 'Mỗi câu nghe được phát đúng 2 lần. Có thời gian chuẩn bị và điền đáp án.',
            parts: [
              {
                partNumber: 1,
                questionCount: 5,
                questionType: 'true_false',
                formatDescription: 'Nghe một từ/cụm từ và nhìn tranh, phán đoán đúng/sai (一致 / 不一致).',
                skillsTested: 'Nhận biết từ vựng đơn qua hình ảnh và âm thanh'
              },
              {
                partNumber: 2,
                questionCount: 5,
                questionType: 'picture_choice',
                formatDescription: 'Nghe một câu ngắn, chọn 1 trong 3 bức tranh (A, B, C) tương ứng.',
                skillsTested: 'Hiểu câu trần thuật hoặc câu hỏi cơ bản'
              },
              {
                partNumber: 3,
                questionCount: 5,
                questionType: 'picture_matching',
                formatDescription: 'Nghe hội thoại 2 lượt ngắn, chọn hình ảnh phù hợp trong nhóm tranh.',
                skillsTested: 'Nắm bắt ngữ cảnh đối thoại giao tiếp ngắn'
              },
              {
                partNumber: 4,
                questionCount: 5,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe câu hoặc đối thoại ngắn, chọn 1 trong 3 đáp án bằng chữ/Pinyin.',
                skillsTested: 'Trích xuất thông tin nhân vật, số lượng, thời gian'
              }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 20,
            durationMinutes: 17,
            maxScore: 100,
            audioRules: 'Không có âm thanh. Thí sinh tự phân bổ thời gian.',
            parts: [
              {
                partNumber: 1,
                questionCount: 5,
                questionType: 'true_false',
                formatDescription: 'Đọc từ vựng và đối chiếu với hình ảnh minh họa, phán đoán đúng/sai.',
                skillsTested: 'Nhận diện mặt chữ Hán và Pinyin cơ bản'
              },
              {
                partNumber: 2,
                questionCount: 5,
                questionType: 'picture_matching',
                formatDescription: 'Đọc 5 câu ngắn và ghép nối với 5 bức tranh tương ứng (A - F).',
                skillsTested: 'Hiểu nghĩa câu đơn giản và hành động'
              },
              {
                partNumber: 3,
                questionCount: 5,
                questionType: 'sentence_matching',
                formatDescription: 'Nối câu hỏi với câu trả lời tương ứng phù hợp ngữ cảnh.',
                skillsTested: 'Logic hỏi - đáp thường nhật'
              },
              {
                partNumber: 4,
                questionCount: 5,
                questionType: 'fill_blank',
                formatDescription: 'Chọn từ thích hợp trong khung cho sẵn để điền vào chỗ trống trong câu.',
                skillsTested: 'Ngữ pháp cơ bản, đại từ, lượng từ và số từ'
              }
            ]
          },
          {
            sectionId: 'writing',
            nameCn: '书写',
            nameVi: 'Viết',
            questionCount: 0,
            durationMinutes: 0,
            maxScore: 0,
            audioRules: 'Không có phần thi viết ở HSK 1.',
            parts: []
          }
        ]
      },
      'HSK 3.0-2021': {
        isOfficial: false,
        verificationStatus: 'unverified_transition',
        verifiedDate: '2026-10-12',
        sourceReference: 'Tiêu chuẩn GF0025-2021 (Định hướng cấp độ mới — Đề thi thực tế chưa triển khai đồng bộ)',
        sourceUrl: 'http://www.moe.gov.cn/jyb_sjzl/ziliao/A19/202103/t20210331_523671.html',
        totalDurationMinutes: 40, // Chưa xác minh chính thức
        fillingInfoMinutes: 5,
        totalQuestions: 40, // Chưa xác minh định dạng đề mới
        maxScore: 200,
        passingScore: 120,
        passingNote: 'Chưa xác minh: CTI chưa chính thức ban hành đề thi HSK 1 theo form 3.0 độc lập tại các điểm thi thông thường.',
        hasPinyin: true,
        vocabularyRequirement: 500, // Chuẩn mới yêu cầu 500 từ
        characterRequirement: 300,
        unverifiedFields: ['Cấu trúc phần thi chi tiết', 'Số lượng câu hỏi chính thức', 'Thời gian làm bài chính xác'],
        notesVi: 'Tiêu chuẩn HSK 3.0 nâng lượng từ HSK 1 từ 150 lên 500 từ, bổ sung kỹ năng ngữ âm và chữ Hán, tuy nhiên định dạng đề thi thực tế chưa được áp dụng thay thế đề 2015.'
      }
    }
  },

  // =========================================================================
  // HSK 2
  // =========================================================================
  'hsk-2': {
    level: 'HSK 2',
    levelCode: '2',
    levelNameVi: 'Cấp độ 2 — Sơ cấp',
    tagline: 'Sử dụng tiếng Trung đơn giản trong các tình huống sinh hoạt hàng ngày quen thuộc, đạt sơ cấp giai đoạn 2.',
    vocabularyRequirement: 300,
    characterRequirement: 347,
    versions: {
      '2015-Standard': {
        isOfficial: true,
        verificationStatus: 'verified',
        verifiedDate: '2026-10-12',
        sourceReference: 'CTI chinesetest.cn — HSK (二级) 考试大纲',
        sourceUrl: 'http://www.chinesetest.cn/godownload.do',
        totalDurationMinutes: 55,
        fillingInfoMinutes: 5,
        totalQuestions: 60,
        maxScore: 200,
        passingScore: 120,
        passingNote: 'Tổng điểm 120/200 trở lên là Đạt.',
        hasPinyin: true,
        audioPlayCount: 2,
        sections: [
          {
            sectionId: 'listening',
            nameCn: '听力',
            nameVi: 'Nghe hiểu',
            questionCount: 35,
            durationMinutes: 25,
            maxScore: 100,
            audioRules: 'Mỗi câu nghe được phát đúng 2 lần. Có 3 phút chuyển đáp án.',
            parts: [
              {
                partNumber: 1,
                questionCount: 10,
                questionType: 'true_false',
                formatDescription: 'Nghe câu ngắn và đối chiếu hình ảnh, phán đoán đúng/sai.',
                skillsTested: 'Nghe hiểu câu mô tả hành động, trạng thái'
              },
              {
                partNumber: 2,
                questionCount: 10,
                questionType: 'picture_matching',
                formatDescription: 'Nghe hội thoại 2 lượt và chọn bức tranh phù hợp.',
                skillsTested: 'Hội thoại giao tiếp mua sắm, hỏi đường'
              },
              {
                partNumber: 3,
                questionCount: 10,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe hội thoại 2 lượt và một câu hỏi, chọn 1 trong 3 đáp án A, B, C.',
                skillsTested: 'Suy luận chi tiết nhân vật, địa điểm, thời gian'
              },
              {
                partNumber: 4,
                questionCount: 5,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe đoạn hội thoại dài hơn (4-5 lượt) và trả lời câu hỏi trắc nghiệm.',
                skillsTested: 'Nắm bắt cốt truyện và nguyên nhân kết quả'
              }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 25,
            durationMinutes: 22,
            maxScore: 100,
            audioRules: 'Không có âm thanh.',
            parts: [
              {
                partNumber: 1,
                questionCount: 5,
                questionType: 'picture_matching',
                formatDescription: 'Đọc câu và chọn bức tranh tương ứng.',
                skillsTested: 'Đọc hiểu ngữ nghĩa câu sơ cấp'
              },
              {
                partNumber: 2,
                questionCount: 5,
                questionType: 'fill_blank',
                formatDescription: 'Chọn từ thích hợp điền vào chỗ trống trong câu.',
                skillsTested: 'Từ loại, phó từ chỉ mức độ, trợ từ'
              },
              {
                partNumber: 3,
                questionCount: 5,
                questionType: 'true_false',
                formatDescription: 'Đọc 2 câu và phán đoán câu thứ hai có đúng với ý câu thứ nhất không.',
                skillsTested: 'Hiểu liên hệ logic giữa hai câu đơn'
              },
              {
                partNumber: 4,
                questionCount: 10,
                questionType: 'sentence_matching',
                formatDescription: 'Ghép 5 cặp câu hỏi và câu đáp lại phù hợp trong 2 phần nhỏ.',
                skillsTested: 'Phản xạ giao tiếp hội thoại viết'
              }
            ]
          },
          {
            sectionId: 'writing',
            nameCn: '书写',
            nameVi: 'Viết',
            questionCount: 0,
            durationMinutes: 0,
            maxScore: 0,
            audioRules: 'Không có phần thi viết ở HSK 2.',
            parts: []
          }
        ]
      },
      'HSK 3.0-2021': {
        isOfficial: false,
        verificationStatus: 'unverified_transition',
        verifiedDate: '2026-10-12',
        sourceReference: 'Tiêu chuẩn GF0025-2021',
        totalDurationMinutes: 55,
        fillingInfoMinutes: 5,
        totalQuestions: 60,
        maxScore: 200,
        passingScore: 120,
        passingNote: 'Chưa xác minh định dạng thi độc lập mới của CTI.',
        hasPinyin: true,
        vocabularyRequirement: 1272,
        unverifiedFields: ['Cấu trúc bài thi chính thức', 'Số câu hỏi thực tế'],
        notesVi: 'Chuẩn mới mở rộng 1272 từ vựng, tuy nhiên hiện tại các kỳ thi quốc tế vẫn sử dụng định dạng 2015.'
      }
    }
  },

  // =========================================================================
  // HSK 3
  // =========================================================================
  'hsk-3': {
    level: 'HSK 3',
    levelCode: '3',
    levelNameVi: 'Cấp độ 3 — Trung cấp cơ sở',
    tagline: 'Hoàn thành các nhiệm vụ giao tiếp cơ bản trong cuộc sống, học tập và công việc. Bắt đầu bỏ Pinyin và có phần thi Viết.',
    vocabularyRequirement: 600,
    characterRequirement: 617,
    versions: {
      '2015-Standard': {
        isOfficial: true,
        verificationStatus: 'verified',
        verifiedDate: '2026-10-12',
        sourceReference: 'CTI chinesetest.cn — HSK (三级) 考试大纲',
        sourceUrl: 'http://www.chinesetest.cn/godownload.do',
        totalDurationMinutes: 90,
        fillingInfoMinutes: 5,
        totalQuestions: 80,
        maxScore: 300,
        passingScore: 180,
        passingNote: 'Tổng điểm 3 phần Nghe, Đọc, Viết đạt từ 180/300 trở lên là Đạt. Mỗi phần tối đa 100 điểm.',
        hasPinyin: false,
        pinyinNote: 'Từ HSK 3 đề thi hoàn toàn bằng chữ Hán, không còn Pinyin hỗ trợ.',
        audioPlayCount: 2,
        sections: [
          {
            sectionId: 'listening',
            nameCn: '听力',
            nameVi: 'Nghe hiểu',
            questionCount: 40,
            durationMinutes: 35,
            maxScore: 100,
            audioRules: 'Mỗi câu nghe được phát 2 lần. Có 5 phút chuyển đáp án vào phiếu.',
            parts: [
              {
                partNumber: 1,
                questionCount: 10,
                questionType: 'picture_matching',
                formatDescription: 'Nghe hội thoại và chọn tranh thích hợp (A - F).',
                skillsTested: 'Liên tưởng hình ảnh và nội dung đàm thoại'
              },
              {
                partNumber: 2,
                questionCount: 10,
                questionType: 'true_false',
                formatDescription: 'Nghe một đoạn ngắn và đọc một câu khẳng định, phán đoán Đúng / Sai.',
                skillsTested: 'Hiểu ý cốt lõi của người nói'
              },
              {
                partNumber: 3,
                questionCount: 10,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe hội thoại 2 lượt và trả lời câu hỏi trắc nghiệm 3 lựa chọn.',
                skillsTested: 'Trích xuất thông tin cụ thể'
              },
              {
                partNumber: 4,
                questionCount: 10,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe hội thoại dài 4-5 lượt và chọn đáp án chính xác trong 3 phương án.',
                skillsTested: 'Phân tích ngữ cảnh, cảm xúc, nguyên do'
              }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 30,
            durationMinutes: 30,
            maxScore: 100,
            audioRules: 'Không có âm thanh.',
            parts: [
              {
                partNumber: 1,
                questionCount: 10,
                questionType: 'sentence_matching',
                formatDescription: 'Ghép nối các câu có mối quan hệ liên kết ý nghĩa chặt chẽ với nhau.',
                skillsTested: 'Liên kết logic câu, đại từ thay thế'
              },
              {
                partNumber: 2,
                questionCount: 10,
                questionType: 'fill_blank',
                formatDescription: 'Chọn từ đúng trong danh sách cho sẵn điền vào câu đơn hoặc đoạn hội thoại.',
                skillsTested: 'Từ vựng, liên từ, hư từ'
              },
              {
                partNumber: 3,
                questionCount: 10,
                questionType: 'multiple_choice',
                formatDescription: 'Đọc một đoạn văn ngắn 2-3 câu và trả lời 1 câu hỏi trắc nghiệm.',
                skillsTested: 'Đọc hiểu nhanh thông tin cốt lõi'
              }
            ]
          },
          {
            sectionId: 'writing',
            nameCn: '书写',
            nameVi: 'Viết',
            questionCount: 10,
            durationMinutes: 15,
            maxScore: 100,
            audioRules: 'Không có âm thanh.',
            parts: [
              {
                partNumber: 1,
                questionCount: 5,
                questionType: 'reorder_sentence',
                formatDescription: 'Sắp xếp các từ/cụm từ xáo trộn thành một câu hoàn chỉnh đúng ngữ pháp.',
                skillsTested: 'Cấu trúc câu, trật tự từ, câu chữ 把, chữ 被, câu so sánh'
              },
              {
                partNumber: 2,
                questionCount: 5,
                questionType: 'fill_character',
                formatDescription: 'Điền đúng chữ Hán vào ô trống dựa theo phiên âm Pinyin và ngữ cảnh câu.',
                skillsTested: 'Chính tả chữ Hán cơ bản, quy tắc viết chữ'
              }
            ]
          }
        ]
      },
      'HSK 3.0-2021': {
        isOfficial: false,
        verificationStatus: 'unverified_transition',
        verifiedDate: '2026-10-12',
        sourceReference: 'Tiêu chuẩn GF0025-2021',
        totalDurationMinutes: 90,
        fillingInfoMinutes: 5,
        totalQuestions: 80,
        maxScore: 300,
        passingScore: 180,
        passingNote: 'Chưa xác minh định dạng thi độc lập mới của CTI.',
        hasPinyin: false,
        vocabularyRequirement: 2245,
        unverifiedFields: ['Cấu trúc đề chi tiết', 'Tỷ lệ tự luận và trắc nghiệm'],
        notesVi: 'Chuẩn 3.0 quy định 2245 từ vựng cho cấp độ 3.'
      }
    }
  },

  // =========================================================================
  // HSK 4
  // =========================================================================
  'hsk-4': {
    level: 'HSK 4',
    levelCode: '4',
    levelNameVi: 'Cấp độ 4 — Trung cấp nâng cao',
    tagline: 'Có thể thảo luận bằng tiếng Trung về nhiều chủ đề đa dạng, giao tiếp lưu loát với người bản ngữ.',
    vocabularyRequirement: 1200,
    characterRequirement: 1064,
    versions: {
      '2015-Standard': {
        isOfficial: true,
        verificationStatus: 'verified',
        verifiedDate: '2026-10-12',
        sourceReference: 'CTI chinesetest.cn — HSK (四级) 考试大纲',
        sourceUrl: 'http://www.chinesetest.cn/godownload.do',
        totalDurationMinutes: 105,
        fillingInfoMinutes: 5,
        totalQuestions: 100,
        maxScore: 300,
        passingScore: 180,
        passingNote: 'Tổng điểm 3 phần đạt từ 180/300 trở lên là Đạt.',
        hasPinyin: false,
        audioPlayCount: 1,
        audioRuleNote: 'Từ HSK 4, toàn bộ phần Nghe chỉ phát DUY NHẤT 1 LẦN.',
        sections: [
          {
            sectionId: 'listening',
            nameCn: '听力',
            nameVi: 'Nghe hiểu',
            questionCount: 45,
            durationMinutes: 30,
            maxScore: 100,
            audioRules: 'Audio chỉ phát duy nhất 1 lần. Có 5 phút chuyển đáp án.',
            parts: [
              {
                partNumber: 1,
                questionCount: 10,
                questionType: 'true_false',
                formatDescription: 'Nghe một đoạn ngắn (khoảng 3 câu), phán đoán câu cho trước Đúng hay Sai.',
                skillsTested: 'Nắm bắt trọng tâm và suy luận logic'
              },
              {
                partNumber: 2,
                questionCount: 15,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe hội thoại 2 lượt ngắn và chọn 1 trong 4 đáp án (A, B, C, D).',
                skillsTested: 'Giao tiếp công sở, học đường, xã hội'
              },
              {
                partNumber: 3,
                questionCount: 20,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe hội thoại 4-5 lượt hoặc đoạn văn ngắn, trả lời 1-2 câu hỏi trắc nghiệm.',
                skillsTested: 'Khả năng ghi nhớ thông tin chi tiết và khái quát'
              }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 40,
            durationMinutes: 40,
            maxScore: 100,
            audioRules: 'Không có âm thanh.',
            parts: [
              {
                partNumber: 1,
                questionCount: 10,
                questionType: 'fill_blank',
                formatDescription: 'Chọn từ thích hợp điền vào câu đơn hoặc đối thoại ngắn.',
                skillsTested: 'Từ vựng, phó từ, cụm từ cố định'
              },
              {
                partNumber: 2,
                questionCount: 10,
                questionType: 'order_sentences',
                formatDescription: 'Sắp xếp 3 câu (A, B, C) theo trật tự đoạn văn logic đúng nghĩa.',
                skillsTested: 'Tư duy liên kết câu, mạch văn'
              },
              {
                partNumber: 3,
                questionCount: 20,
                questionType: 'multiple_choice',
                formatDescription: 'Đọc đoạn văn ngắn (2-4 câu) và chọn đáp án đúng cho câu hỏi tương ứng.',
                skillsTested: 'Kỹ năng đọc quét, đọc lướt và phân tích ngữ liệu'
              }
            ]
          },
          {
            sectionId: 'writing',
            nameCn: '书写',
            nameVi: 'Viết',
            questionCount: 15,
            durationMinutes: 25,
            maxScore: 100,
            audioRules: 'Không có âm thanh.',
            parts: [
              {
                partNumber: 1,
                questionCount: 10,
                questionType: 'reorder_sentence',
                formatDescription: 'Sắp xếp các từ ngữ thành câu hoàn chỉnh đúng ngữ pháp.',
                skillsTested: 'Ngữ pháp trung cấp phức tạp'
              },
              {
                partNumber: 2,
                questionCount: 5,
                questionType: 'picture_sentence',
                formatDescription: 'Nhìn tranh và sử dụng từ cho sẵn để đặt một câu hoàn chỉnh.',
                skillsTested: 'Kỹ năng vận dụng từ vào văn cảnh thực tế'
              }
            ]
          }
        ]
      },
      'HSK 3.0-2021': {
        isOfficial: false,
        verificationStatus: 'unverified_transition',
        verifiedDate: '2026-10-12',
        sourceReference: 'Tiêu chuẩn GF0025-2021',
        totalDurationMinutes: 105,
        fillingInfoMinutes: 5,
        totalQuestions: 100,
        maxScore: 300,
        passingScore: 180,
        passingNote: 'Chưa xác minh định dạng đề thi mới.',
        hasPinyin: false,
        vocabularyRequirement: 3245,
        unverifiedFields: ['Định dạng đề thi mới', 'Thời gian làm bài chính xác'],
        notesVi: 'Chuẩn mới mở rộng 3245 từ vựng tích lũy.'
      }
    }
  },

  // =========================================================================
  // HSK 5
  // =========================================================================
  'hsk-5': {
    level: 'HSK 5',
    levelCode: '5',
    levelNameVi: 'Cấp độ 5 — Cao cấp cơ sở',
    tagline: 'Đọc báo, tạp chí tiếng Trung, thưởng thức phim ảnh tiếng Trung và thuyết trình một bài nói hoàn chỉnh.',
    vocabularyRequirement: 2500,
    characterRequirement: 1685,
    versions: {
      '2015-Standard': {
        isOfficial: true,
        verificationStatus: 'verified',
        verifiedDate: '2026-10-12',
        sourceReference: 'CTI chinesetest.cn — HSK (五级) 考试大纲',
        sourceUrl: 'http://www.chinesetest.cn/godownload.do',
        totalDurationMinutes: 125,
        fillingInfoMinutes: 5,
        totalQuestions: 100,
        maxScore: 300,
        passingScore: 180,
        passingNote: 'Tổng điểm 180/300 trở lên là Đạt.',
        hasPinyin: false,
        audioPlayCount: 1,
        sections: [
          {
            sectionId: 'listening',
            nameCn: '听力',
            nameVi: 'Nghe hiểu',
            questionCount: 45,
            durationMinutes: 30,
            maxScore: 100,
            audioRules: 'Audio chỉ phát duy nhất 1 lần. Có 5 phút chuyển đáp án.',
            parts: [
              {
                partNumber: 1,
                questionCount: 20,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe đối thoại 2 lượt và trả lời câu hỏi trắc nghiệm.',
                skillsTested: 'Nghe hiểu hội thoại tự nhiên tốc độ thực'
              },
              {
                partNumber: 2,
                questionCount: 25,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe đối thoại dài 4-5 lượt hoặc bài phát biểu, phỏng vấn, trả lời 2-3 câu hỏi.',
                skillsTested: 'Nghe hiểu phỏng vấn, diễn thuyết, bản tin ngắn'
              }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 45,
            durationMinutes: 45,
            maxScore: 100,
            audioRules: 'Không có âm thanh.',
            parts: [
              {
                partNumber: 1,
                questionCount: 15,
                questionType: 'cloze_passage',
                formatDescription: 'Đọc đoạn văn và chọn các từ/cụm từ đúng điền vào nhiều chỗ trống.',
                skillsTested: 'Vốn từ rộng, ngữ cảm và liên kết văn bản'
              },
              {
                partNumber: 2,
                questionCount: 10,
                questionType: 'multiple_choice',
                formatDescription: 'Đọc đoạn văn ngắn và chọn câu diễn đạt đúng nhất nội dung đoạn văn.',
                skillsTested: 'Khái quát nội dung cốt lõi và tư tưởng'
              },
              {
                partNumber: 3,
                questionCount: 20,
                questionType: 'multiple_choice',
                formatDescription: 'Đọc các bài văn dài (300-500 từ) và trả lời các câu hỏi đọc hiểu chi tiết.',
                skillsTested: 'Đọc hiểu bài luận, văn bản xã hội và triết lý'
              }
            ]
          },
          {
            sectionId: 'writing',
            nameCn: '书写',
            nameVi: 'Viết',
            questionCount: 10,
            durationMinutes: 40,
            maxScore: 100,
            audioRules: 'Không có âm thanh.',
            parts: [
              {
                partNumber: 1,
                questionCount: 8,
                questionType: 'reorder_sentence',
                formatDescription: 'Sắp xếp các từ ngữ phức tạp thành câu hoàn chỉnh đúng ngữ pháp.',
                skillsTested: 'Ngữ pháp cao cấp, câu phức hợp, cấu trúc tu từ'
              },
              {
                partNumber: 2,
                questionCount: 2,
                questionType: 'free_writing',
                formatDescription: 'Đề 1: Dùng 5 từ cho sẵn viết đoạn văn ~80 từ. Đề 2: Nhìn tranh viết đoạn văn ~80 từ.',
                skillsTested: 'Viết văn mạch lạc, lập luận và mô tả tình huống',
                gradingNoticeVi: 'Bài viết tự luận cần được đánh giá theo tiêu chí: ngữ pháp, độ dài ~80 từ, mạch lạc và chính tả.'
              }
            ]
          }
        ]
      },
      'HSK 3.0-2021': {
        isOfficial: false,
        verificationStatus: 'unverified_transition',
        verifiedDate: '2026-10-12',
        sourceReference: 'Tiêu chuẩn GF0025-2021',
        totalDurationMinutes: 125,
        fillingInfoMinutes: 5,
        totalQuestions: 100,
        maxScore: 300,
        passingScore: 180,
        passingNote: 'Chưa xác minh định dạng đề thi mới.',
        hasPinyin: false,
        vocabularyRequirement: 4316,
        unverifiedFields: ['Định dạng đề mới', 'Cách thức chấm thi'],
        notesVi: 'Chuẩn mới mở rộng 4316 từ vựng.'
      }
    }
  },

  // =========================================================================
  // HSK 6
  // =========================================================================
  'hsk-6': {
    level: 'HSK 6',
    levelCode: '6',
    levelNameVi: 'Cấp độ 6 — Cao cấp tinh thông',
    tagline: 'Dễ dàng hiểu thông tin nghe hoặc đọc bằng tiếng Trung, biểu đạt ý kiến một cách trôi chảy cả bằng lời nói lẫn chữ viết.',
    vocabularyRequirement: 5000,
    characterRequirement: 2663,
    versions: {
      '2015-Standard': {
        isOfficial: true,
        verificationStatus: 'verified',
        verifiedDate: '2026-10-12',
        sourceReference: 'CTI chinesetest.cn — HSK (六级) 考试大纲',
        sourceUrl: 'http://www.chinesetest.cn/godownload.do',
        totalDurationMinutes: 140,
        fillingInfoMinutes: 5,
        totalQuestions: 101, // 100 câu trắc nghiệm + 1 bài tóm tắt
        maxScore: 300,
        passingScore: 180,
        passingNote: 'Tổng điểm 180/300 trở lên là mức tham chiếu đạt chuẩn thông thường. Phiếu điểm ghi rõ điểm từng kỹ năng.',
        hasPinyin: false,
        audioPlayCount: 1,
        sections: [
          {
            sectionId: 'listening',
            nameCn: '听力',
            nameVi: 'Nghe hiểu',
            questionCount: 50,
            durationMinutes: 35,
            maxScore: 100,
            audioRules: 'Audio chỉ phát duy nhất 1 lần. Có 5 phút chuyển đáp án.',
            parts: [
              {
                partNumber: 1,
                questionCount: 15,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe đoạn văn ngắn và chọn câu đúng nhất trong 4 phương án.',
                skillsTested: 'Nghe hiểu nhanh câu chuyện ngụ ngôn, trích đoạn văn học'
              },
              {
                partNumber: 2,
                questionCount: 15,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe 3 bài phỏng vấn người nổi tiếng/chuyên gia, mỗi bài 5 câu hỏi.',
                skillsTested: 'Nắm bắt ý kiến, quan điểm chuyên sâu'
              },
              {
                partNumber: 3,
                questionCount: 20,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe các đoạn văn dài khoa học, văn hóa, xã hội và trả lời các câu hỏi.',
                skillsTested: 'Nghe hiểu bài diễn thuyết, báo cáo chuyên đề'
              }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 50,
            durationMinutes: 50,
            maxScore: 100,
            audioRules: 'Không có âm thanh.',
            parts: [
              {
                partNumber: 1,
                questionCount: 10,
                questionType: 'error_spotting',
                formatDescription: 'Chọn câu bị lỗi ngữ pháp/bệnh cú trong 4 câu (A, B, C, D).',
                skillsTested: 'Phân tích ngữ pháp nâng cao, trật tự từ, hư từ, logic ngữ nghĩa'
              },
              {
                partNumber: 2,
                questionCount: 10,
                questionType: 'cloze_words',
                formatDescription: 'Điền nhóm từ đồng nghĩa/cận nghĩa vào các chỗ trống trong đoạn văn.',
                skillsTested: 'Phân biệt sắc thái từ vựng tinh tế'
              },
              {
                partNumber: 3,
                questionCount: 10,
                questionType: 'sentence_cloze',
                formatDescription: 'Đọc 2 đoạn văn và điền các câu bị khuyết (A - E) vào đúng vị trí.',
                skillsTested: 'Cấu trúc và mạch lập luận văn bản'
              },
              {
                partNumber: 4,
                questionCount: 20,
                questionType: 'multiple_choice',
                formatDescription: 'Đọc 4 bài luận học thuật/văn hóa dài và trả lời các câu hỏi chuyên sâu.',
                skillsTested: 'Đọc hiểu sâu văn bản học thuật và nghị luận'
              }
            ]
          },
          {
            sectionId: 'writing',
            nameCn: '书写',
            nameVi: 'Viết',
            questionCount: 1,
            durationMinutes: 45,
            maxScore: 100,
            audioRules: 'Không có âm thanh.',
            parts: [
              {
                partNumber: 1,
                questionCount: 1,
                questionType: 'essay_summary',
                formatDescription: 'Đọc bài văn tự sự khoảng 1000 chữ trong 10 phút (bị thu lại đề), sau đó tóm tắt thành đoạn văn khoảng 400 chữ trong 35 phút kèm tự đặt tiêu đề. Không được thêm ý riêng.',
                skillsTested: 'Ghi nhớ, chọn lọc thông tin, tái diễn đạt mạch lạc bằng chữ Hán',
                gradingNoticeVi: 'Bài tóm tắt chấm theo tiêu chí: nắm đúng cốt truyện, không bịa chi tiết, độ dài ~400 chữ, tiêu đề phù hợp.'
              }
            ]
          }
        ]
      },
      'HSK 3.0-2021': {
        isOfficial: false,
        verificationStatus: 'unverified_transition',
        verifiedDate: '2026-10-12',
        sourceReference: 'Tiêu chuẩn GF0025-2021',
        totalDurationMinutes: 140,
        fillingInfoMinutes: 5,
        totalQuestions: 101,
        maxScore: 300,
        passingScore: 180,
        passingNote: 'Chưa xác minh định dạng đề mới.',
        hasPinyin: false,
        vocabularyRequirement: 5456,
        unverifiedFields: ['Định dạng đề mới', 'Thời điểm chuyển giao chính thức'],
        notesVi: 'Chuẩn mới mở rộng 5456 từ vựng.'
      }
    }
  },

  // =========================================================================
  // HSK 7-9 (Advanced — Triển khai chính thức từ 11/2022)
  // =========================================================================
  'hsk-7-9': {
    level: 'HSK 7–9',
    levelCode: '7-9',
    levelNameVi: 'Cấp độ 7–9 — Cấp Cao Tiến Tiến (HSK 3.0)',
    tagline: 'Kỳ thi chung dành cho người học trình độ cao cấp. Dựa trên tổng điểm để xếp hạng tương ứng vào Cấp 7, Cấp 8 hoặc Cấp 9.',
    vocabularyRequirement: 11092, // Toàn bộ vốn từ chuẩn 3.0
    characterRequirement: 3000,
    versions: {
      'HSK 3.0-2021': {
        isOfficial: true,
        verificationStatus: 'verified',
        verifiedDate: '2026-10-12',
        sourceReference: 'CTI chinesetest.cn — HSK (七-九级) 考试实施办法 (Áp dụng chính thức từ 26/11/2022)',
        sourceUrl: 'http://www.chinesetest.cn/',
        totalDurationMinutes: 210,
        fillingInfoMinutes: 10,
        totalQuestions: 98, // 67 câu khách quan + 31 câu chủ quan
        maxScore: 'Quy đổi phân cấp',
        passingScore: 'Đạt cấp 7 / 8 / 9 theo phổ điểm',
        passingNote: 'Một đề thi duy nhất đánh giá 5 kỹ năng: Nghe, Đọc, Viết, Dịch, Nói. Điểm tổng quy định việc xếp cấp bậc tương ứng.',
        hasPinyin: false,
        audioPlayCount: 1,
        sections: [
          {
            sectionId: 'listening',
            nameCn: '听力',
            nameVi: 'Nghe hiểu',
            questionCount: 40,
            durationMinutes: 30,
            maxScore: 'Thành phần',
            audioRules: 'Audio tốc độ người bản ngữ, chỉ phát 1 lần.',
            parts: [
              {
                partNumber: 1,
                questionCount: 10,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe bản tin, thông báo chuyên nghiệp và chọn đáp án đúng.',
                skillsTested: 'Nghe hiểu thông tin sự kiện thời sự'
              },
              {
                partNumber: 2,
                questionCount: 12,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe đàm phán thương mại, tranh biện học thuật.',
                skillsTested: 'Phân tích lập luận và lập trường'
              },
              {
                partNumber: 3,
                questionCount: 18,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe bài giảng học thuật, phim tài liệu, hội thảo chuyên ngành.',
                skillsTested: 'Tổng hợp và đối chiếu luận điểm phức tạp'
              }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 47,
            durationMinutes: 60,
            maxScore: 'Thành phần',
            audioRules: 'Không có âm thanh.',
            parts: [
              {
                partNumber: 1,
                questionCount: 28,
                questionType: 'multiple_choice',
                formatDescription: 'Đọc bài báo, báo cáo điều tra và trả lời câu hỏi trắc nghiệm.',
                skillsTested: 'Đọc hiểu văn bản thể loại hành chính, khoa học'
              },
              {
                partNumber: 2,
                questionCount: 5,
                questionType: 'paragraph_cloze',
                formatDescription: 'Điền các đoạn văn thích hợp vào bài luận văn hóa.',
                skillsTested: 'Cấu trúc bài luận dài'
              },
              {
                partNumber: 3,
                questionCount: 14,
                questionType: 'deep_comprehension',
                formatDescription: 'Đọc văn kiện, tài liệu lịch sử, xã luận và trả lời câu hỏi chuyên sâu.',
                skillsTested: 'Tư duy phản biện và phân tích văn bản học thuật'
              }
            ]
          },
          {
            sectionId: 'writing',
            nameCn: '写作',
            nameVi: 'Viết',
            questionCount: 2,
            durationMinutes: 55,
            maxScore: 'Thành phần',
            audioRules: 'Không có âm thanh.',
            parts: [
              {
                partNumber: 1,
                questionCount: 1,
                questionType: 'chart_argument',
                formatDescription: 'Mô tả, phân tích số liệu biểu đồ và trình bày quan điểm logic.',
                skillsTested: 'Phân tích dữ liệu và lập luận văn phong học thuật'
              },
              {
                partNumber: 2,
                questionCount: 1,
                questionType: 'topic_essay',
                formatDescription: 'Viết bài luận nghị luận xã hội sâu sắc về chủ đề cho sẵn.',
                skillsTested: 'Biểu đạt văn bản học thuật cao cấp'
              }
            ]
          },
          {
            sectionId: 'translation',
            nameCn: '翻译',
            nameVi: 'Biên dịch & Phiên dịch',
            questionCount: 4,
            durationMinutes: 41,
            maxScore: 'Thành phần',
            audioRules: 'Bao gồm cả dịch viết và dịch nói.',
            parts: [
              {
                partNumber: 1,
                questionCount: 2,
                questionType: 'written_translation',
                formatDescription: 'Dịch 2 đoạn văn bản tiếng nước ngoài sang tiếng Trung viết.',
                skillsTested: 'Kỹ năng biên dịch chính xác, trôi chảy'
              },
              {
                partNumber: 2,
                questionCount: 2,
                questionType: 'oral_interpretation',
                formatDescription: 'Phiên dịch nói trực tiếp qua micro từ ngoại ngữ sang tiếng Trung.',
                skillsTested: 'Kỹ năng phiên dịch phản xạ tức thì'
              }
            ]
          },
          {
            sectionId: 'speaking',
            nameCn: '口语',
            nameVi: 'Khẩu ngữ',
            questionCount: 5,
            durationMinutes: 24,
            maxScore: 'Thành phần',
            audioRules: 'Thu âm câu trả lời trực tiếp.',
            parts: [
              {
                partNumber: 1,
                questionCount: 1,
                questionType: 'oral_paraphrase',
                formatDescription: 'Nghe và nhắc lại, diễn giải ý tưởng tài liệu ứng dụng.',
                skillsTested: 'Truyền đạt thông tin lời nói'
              },
              {
                partNumber: 2,
                questionCount: 3,
                questionType: 'oral_presentation',
                formatDescription: 'Thuyết trình theo chủ đề cho sẵn.',
                skillsTested: 'Hùng biện và cấu trúc diễn đạt miệng'
              },
              {
                partNumber: 3,
                questionCount: 1,
                questionType: 'oral_debate',
                formatDescription: 'Phản biện ý kiến và bảo vệ luận điểm.',
                skillsTested: 'Tư duy phản biện và phản ứng nhanh'
              }
            ]
          }
        ]
      }
    }
  }
};

/**
 * Lấy cấu trúc đề thi theo cấp độ và phiên bản
 */
export function getHskStructure(levelKey = 'hsk-1', version = '2015-Standard') {
  const normKey = levelKey.toLowerCase().replace(/\s+/g, '-');
  const levelDef = HSK_STRUCTURE_DEFINITIONS[normKey] || HSK_STRUCTURE_DEFINITIONS['hsk-1'];
  const versionData = levelDef.versions[version] || levelDef.versions['2015-Standard'] || Object.values(levelDef.versions)[0];

  const rawNotice = versionData.unverifiedNotice || versionData.notesVi || 'Cấu trúc đề thi thực tế chưa được triển khai đồng bộ tại các điểm thi.';
  const unverifiedNotice = versionData.verificationStatus === 'unverified_transition'
    ? (rawNotice.includes('Chưa xác minh') ? rawNotice : `Chưa xác minh: ${rawNotice}`)
    : null;

  return {
    level: levelDef.level,
    levelCode: levelDef.levelCode,
    levelNameVi: levelDef.levelNameVi,
    tagline: levelDef.tagline,
    vocabularyRequirement: versionData.vocabularyRequirement || levelDef.vocabularyRequirement,
    characterRequirement: versionData.characterRequirement || levelDef.characterRequirement,
    version,
    ...versionData,
    unverifiedNotice
  };
}

/**
 * Lấy danh sách toàn bộ các cấp độ hỗ trợ
 */
export function getAllHskLevels() {
  return Object.keys(HSK_STRUCTURE_DEFINITIONS).map(key => {
    const item = HSK_STRUCTURE_DEFINITIONS[key];
    return {
      key,
      level: item.level,
      nameVi: item.levelNameVi,
      tagline: item.tagline,
      vocabCount: item.vocabularyRequirement,
      availableVersions: Object.keys(item.versions)
    };
  });
}
