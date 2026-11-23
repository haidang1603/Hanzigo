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
    name: 'HSK 2.0 (6 cấp — Khảo thí Hiện hành)',
    shortName: 'HSK 2.0 (Hiện hành)',
    status: 'active_official',
    statusLabel: 'Đang áp dụng thực tế tại điểm thi',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    description: 'Hệ thống đề thi 6 cấp độ truyền thống (HSK 1–6) đang được CTI / chinesetest.cn sử dụng.',
    verifiedDate: '2026-11-24',
    officialPortal: 'http://www.chinesetest.cn/'
  },
  {
    id: 'HSK 3.0-2021',
    name: 'HSK 3.0 (9 cấp — Chuẩn CTI 13/12/2026)',
    shortName: 'HSK 3.0 (Mới)',
    status: 'partially_implemented',
    statusLabel: 'HSK 7–9 đang thi • HSK 1–6 áp dụng từ 13/12/2026',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    description: 'Hệ thống 3 giai đoạn 9 cấp của CTI: HSK 1–6 thi riêng từng cấp (kèm Nói từ cấp 3) và HSK 7–9 thi chung 1 bài trên máy tính.',
    verifiedDate: '2026-11-24',
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
        verifiedDate: '2026-11-24',
        sourceReference: 'Đề cương HSK 3.0 CTI (Áp dụng toàn cầu từ 13/12/2026) & GF0025-2021',
        sourceUrl: 'http://www.chinesetest.cn/',
        totalDurationMinutes: 40,
        fillingInfoMinutes: 8,
        totalQuestions: 40,
        maxScore: 200,
        passingScore: 120,
        passingNote: 'Chưa xác minh đồng loạt trước 13/12/2026: Điểm chuẩn đạt ≥ 120/200 (Nghe 100đ + Đọc 100đ).',
        hasPinyin: true,
        audioPlayCount: 2,
        vocabularyRequirement: 500,
        characterRequirement: 300,
        unverifiedFields: ['Lộ trình áp dụng đồng bộ từ 13/12/2026'],
        notesVi: 'Chuẩn HSK 3.0 bậc 1: 40 câu (~40 phút, gồm 5p điền thông tin + 3p tô phiếu đáp án). Bỏ dạng nghe phán đoán Đúng/Sai của bản cũ, chuyển sang chọn tranh và chọn câu đối đáp.',
        sections: [
          {
            sectionId: 'listening',
            nameCn: '听力',
            nameVi: 'Nghe hiểu',
            questionCount: 20,
            durationMinutes: 12,
            maxScore: 100,
            audioRules: 'Mỗi câu phát 2 lần (có Pinyin). Không còn dạng Đúng/Sai.',
            parts: [
              { partNumber: 1, questionCount: 5, questionType: 'mcq', formatDescription: 'Nghe câu ngắn chọn bức tranh / tình huống phù hợp', skillsTested: 'Nhận diện từ vựng & tình huống cơ bản' },
              { partNumber: 2, questionCount: 5, questionType: 'mcq', formatDescription: 'Nghe câu thoại chọn tranh minh họa tương ứng', skillsTested: 'Nghe hiểu hành động, đối tượng' },
              { partNumber: 3, questionCount: 5, questionType: 'mcq', formatDescription: 'Nghe hội thoại 2 lượt chọn đáp án đúng', skillsTested: 'Nắm thông tin hội thoại ngắn' },
              { partNumber: 4, questionCount: 5, questionType: 'mcq', formatDescription: 'Nghe hội thoại & câu hỏi chọn câu đối đáp phù hợp', skillsTested: 'Phản xạ giao tiếp sơ cấp' }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 20,
            durationMinutes: 20,
            maxScore: 100,
            audioRules: 'Đề thi kèm Pinyin đầy đủ.',
            parts: [
              { partNumber: 1, questionCount: 5, questionType: 'true_false', formatDescription: 'Đối chiếu từ vựng / câu với hình ảnh hoặc ngữ nghĩa', skillsTested: 'Nhận diện mặt chữ & Pinyin' },
              { partNumber: 2, questionCount: 5, questionType: 'mcq', formatDescription: 'Chọn câu mô tả khớp với ngữ cảnh cho sẵn', skillsTested: 'Đọc hiểu câu đơn' },
              { partNumber: 3, questionCount: 5, questionType: 'mcq', formatDescription: 'Ghép cặp câu hỏi – đáp trong hội thoại ngắn', skillsTested: 'Logic hỏi đáp cơ bản' },
              { partNumber: 4, questionCount: 5, questionType: 'fill_blank', formatDescription: 'Chọn từ vựng phù hợp điền vào chỗ trống', skillsTested: 'Vận dụng từ loại HSK 1' }
            ]
          }
        ]
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
        verifiedDate: '2026-11-24',
        sourceReference: 'Đề cương HSK 3.0 CTI (Áp dụng toàn cầu từ 13/12/2026) & GF0025-2021',
        totalDurationMinutes: 60,
        fillingInfoMinutes: 8,
        totalQuestions: 60,
        maxScore: 300,
        passingScore: 180,
        passingNote: 'Chưa xác minh đồng loạt trước 13/12/2026: Thang 300đ (Nghe + Đọc + Viết), đạt ≥ 180đ.',
        hasPinyin: true,
        audioPlayCount: 2,
        vocabularyRequirement: 1272,
        characterRequirement: 600,
        unverifiedFields: ['Lộ trình áp dụng đồng bộ từ 13/12/2026'],
        notesVi: 'HSK 2 (3.0) gồm 60 câu (~60 phút, đã gồm 5p điền thông tin + 3p tô phiếu): Nghe 25, Đọc 25 và lần đầu đưa phần Viết vào cấp 2 với 10 câu (gồm viết chữ Hán theo Pinyin).',
        sections: [
          {
            sectionId: 'listening',
            nameCn: '听力',
            nameVi: 'Nghe hiểu',
            questionCount: 25,
            durationMinutes: 17,
            maxScore: 100,
            audioRules: 'Mỗi câu phát 2 lần.',
            parts: [
              { partNumber: 1, questionCount: 6, questionType: 'true_false', formatDescription: 'Nghe câu ngắn phán đoán Đúng/Sai', skillsTested: 'Nghe hiểu thông tin trực tiếp' },
              { partNumber: 2, questionCount: 6, questionType: 'mcq', formatDescription: 'Nghe hội thoại ngắn chọn tình huống phù hợp', skillsTested: 'Xác định bối cảnh giao tiếp' },
              { partNumber: 3, questionCount: 7, questionType: 'mcq', formatDescription: 'Nghe hội thoại 2–3 lượt chọn đáp án đúng', skillsTested: 'Hiểu ý chính & chi tiết' },
              { partNumber: 4, questionCount: 6, questionType: 'mcq', formatDescription: 'Nghe hội thoại dài & thông báo ngắn', skillsTested: 'Tổng hợp thông tin thời gian, địa điểm' }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 25,
            durationMinutes: 25,
            maxScore: 100,
            audioRules: 'Đọc câu & đoạn ngắn giao tiếp hàng ngày.',
            parts: [
              { partNumber: 1, questionCount: 6, questionType: 'mcq', formatDescription: 'Chọn câu phù hợp với tình huống', skillsTested: 'Đọc hiểu ngữ cảnh' },
              { partNumber: 2, questionCount: 6, questionType: 'fill_blank', formatDescription: 'Điền từ vựng thích hợp vào chỗ trống', skillsTested: 'Từ vựng & ngữ pháp HSK 2' },
              { partNumber: 3, questionCount: 7, questionType: 'mcq', formatDescription: 'Ghép cặp hội thoại hỏi – đáp', skillsTested: 'Mạch liên kết hội thoại' },
              { partNumber: 4, questionCount: 6, questionType: 'true_false', formatDescription: 'Đọc đoạn ngắn phán đoán Đúng/Sai', skillsTested: 'Đối chiếu chi tiết văn bản' }
            ]
          },
          {
            sectionId: 'writing',
            nameCn: '书写',
            nameVi: 'Viết (Mới ở HSK 2)',
            questionCount: 10,
            durationMinutes: 10,
            maxScore: 100,
            audioRules: 'Lần đầu đưa kỹ năng Viết vào cấp độ 2.',
            parts: [
              { partNumber: 1, questionCount: 5, questionType: 'reorder', formatDescription: 'Sắp xếp các từ gợi ý thành câu hoàn chỉnh', skillsTested: 'Trật tự từ tiếng Trung' },
              { partNumber: 2, questionCount: 5, questionType: 'fill_blank', formatDescription: 'Nhìn Pinyin viết chữ Hán đúng theo ngữ cảnh', skillsTested: 'Viết đúng chữ Hán thông dụng' }
            ]
          }
        ]
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
        verifiedDate: '2026-11-24',
        sourceReference: 'Đề cương HSK 3.0 CTI (Áp dụng toàn cầu từ 13/12/2026) & GF0025-2021',
        totalDurationMinutes: 83,
        fillingInfoMinutes: 10,
        totalQuestions: 70,
        maxScore: 300,
        passingScore: 180,
        passingNote: 'Chưa xác minh đồng loạt trước 13/12/2026: Bài viết 70 câu (~83p) + thi kèm 15 câu Nói (~15p).',
        hasPinyin: false,
        audioPlayCount: 1,
        vocabularyRequirement: 2245,
        characterRequirement: 900,
        unverifiedFields: ['Lộ trình áp dụng đồng bộ từ 13/12/2026'],
        notesVi: 'HSK 3 (3.0) bỏ hẳn Pinyin trên đề thi; gồm 70 câu viết (~83 phút, gồm 5p điền thông tin + 5p tô phiếu) và bắt buộc thi kèm bài Nói cấp 3 (15 câu · ~15 phút).',
        sections: [
          {
            sectionId: 'listening',
            nameCn: '听力',
            nameVi: 'Nghe hiểu',
            questionCount: 30,
            durationMinutes: 25,
            maxScore: 100,
            audioRules: 'Chỉ phát đúng 1 lần (chuẩn HSK 3.0).',
            parts: [
              { partNumber: 1, questionCount: 10, questionType: 'true_false', formatDescription: 'Nghe câu / đoạn ngắn phán đoán Đúng/Sai', skillsTested: 'Nghe hiểu thông tin trực tiếp' },
              { partNumber: 2, questionCount: 10, questionType: 'mcq', formatDescription: 'Nghe hội thoại ngắn chọn đáp án đúng', skillsTested: 'Nắm bắt ý chính & suy luận nhẹ' },
              { partNumber: 3, questionCount: 10, questionType: 'mcq', formatDescription: 'Nghe hội thoại dài & đoạn văn chọn đáp án', skillsTested: 'Nghe hiểu mạch truyện' }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 30,
            durationMinutes: 33,
            maxScore: 100,
            audioRules: 'Đề thi không in Pinyin.',
            parts: [
              { partNumber: 1, questionCount: 10, questionType: 'mcq', formatDescription: 'Nối câu / đoạn ngữ cảnh tương ứng', skillsTested: 'Đọc lướt tìm câu khớp' },
              { partNumber: 2, questionCount: 10, questionType: 'fill_blank', formatDescription: 'Điền từ vựng thích hợp vào chỗ trống', skillsTested: 'Từ vựng & kết hợp từ HSK 3' },
              { partNumber: 3, questionCount: 10, questionType: 'mcq', formatDescription: 'Đọc hiểu đoạn văn ngắn trả lời câu hỏi', skillsTested: 'Hiểu ý chính & chi tiết' }
            ]
          },
          {
            sectionId: 'writing',
            nameCn: '书写',
            nameVi: 'Viết',
            questionCount: 10,
            durationMinutes: 15,
            maxScore: 100,
            audioRules: 'Không còn Pinyin gợi ý ở phần sắp xếp câu.',
            parts: [
              { partNumber: 1, questionCount: 5, questionType: 'reorder', formatDescription: 'Sắp xếp từ thành câu (câu chữ 把/被, bổ ngữ)', skillsTested: 'Cấu trúc ngữ pháp HSK 3' },
              { partNumber: 2, questionCount: 5, questionType: 'fill_blank', formatDescription: 'Hoàn thành câu chữ Hán theo ngữ cảnh', skillsTested: 'Viết đúng chữ Hán' }
            ]
          },
          {
            sectionId: 'speaking',
            nameCn: '口语 (必考)',
            nameVi: 'Nói (Thi kèm riêng · 15 câu)',
            questionCount: 15,
            durationMinutes: 15,
            maxScore: 100,
            audioRules: 'Thi riêng cùng đợt (~15 phút gồm thời gian chuẩn bị).',
            parts: [
              { partNumber: 1, questionCount: 5, questionType: 'speaking', formatDescription: 'Nghe và nhắc lại câu chuẩn thanh điệu', skillsTested: 'Phát âm & trí nhớ ngắn hạn' },
              { partNumber: 2, questionCount: 5, questionType: 'speaking', formatDescription: 'Trả lời câu hỏi nhanh bằng 3–5 câu', skillsTested: 'Phản xạ giao tiếp' },
              { partNumber: 3, questionCount: 5, questionType: 'speaking', formatDescription: 'Trình bày ngắn chủ đề quen thuộc (1–2 phút)', skillsTested: 'Diễn đạt mạch lạc' }
            ]
          }
        ]
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
        verifiedDate: '2026-11-24',
        sourceReference: 'Đề cương HSK 3.0 CTI (Áp dụng toàn cầu từ 13/12/2026) & GF0025-2021',
        totalDurationMinutes: 85,
        fillingInfoMinutes: 10,
        totalQuestions: 70,
        maxScore: 300,
        passingScore: 180,
        passingNote: 'Chưa xác minh đồng loạt trước 13/12/2026: Bài viết 70 câu (~85p) + thi kèm 5 câu Nói (~20p).',
        hasPinyin: false,
        audioPlayCount: 1,
        vocabularyRequirement: 3245,
        characterRequirement: 1200,
        unverifiedFields: ['Lộ trình áp dụng đồng bộ từ 13/12/2026'],
        notesVi: 'HSK 4 (3.0) gồm 70 câu viết (~85 phút): Nghe 32, Đọc 32, Viết 6 (5 câu đặt câu theo tranh + 1 đoạn văn ngắn) và thi kèm 5 câu Nói (~20 phút).',
        sections: [
          {
            sectionId: 'listening',
            nameCn: '听力',
            nameVi: 'Nghe hiểu',
            questionCount: 32,
            durationMinutes: 20,
            maxScore: 100,
            audioRules: 'Chỉ phát đúng 1 lần.',
            parts: [
              { partNumber: 1, questionCount: 10, questionType: 'true_false', formatDescription: 'Nghe đoạn ngắn phán đoán Đúng/Sai', skillsTested: 'Nghe hiểu thông tin chi tiết' },
              { partNumber: 2, questionCount: 12, questionType: 'mcq', formatDescription: 'Nghe hội thoại 2 lượt chọn đáp án', skillsTested: 'Suy luận thái độ, ngữ cảnh' },
              { partNumber: 3, questionCount: 10, questionType: 'mcq', formatDescription: 'Nghe hội thoại dài & đoạn tự sự', skillsTested: 'Tổng hợp nội dung chính' }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 32,
            durationMinutes: 30,
            maxScore: 100,
            audioRules: 'Không có Pinyin.',
            parts: [
              { partNumber: 1, questionCount: 10, questionType: 'fill_blank', formatDescription: 'Chọn từ điền vào câu / đoạn văn ngắn', skillsTested: 'Từ vựng & collocation HSK 4' },
              { partNumber: 2, questionCount: 10, questionType: 'reorder', formatDescription: 'Sắp xếp thứ tự câu A-B-C thành đoạn logic', skillsTested: 'Tư duy liên kết văn bản' },
              { partNumber: 3, questionCount: 12, questionType: 'mcq', formatDescription: 'Đọc hiểu văn bản trả lời câu hỏi', skillsTested: 'Đọc hiểu phân tích' }
            ]
          },
          {
            sectionId: 'writing',
            nameCn: '书写',
            nameVi: 'Viết',
            questionCount: 6,
            durationMinutes: 25,
            maxScore: 100,
            audioRules: 'Bỏ dạng sắp xếp từ thành câu, chuyển sang đặt câu theo tranh & viết đoạn ngắn.',
            parts: [
              { partNumber: 1, questionCount: 5, questionType: 'essay', formatDescription: 'Đặt câu hoàn chỉnh theo tranh & từ gợi ý', skillsTested: 'Vận dụng ngữ pháp tạo câu' },
              { partNumber: 2, questionCount: 1, questionType: 'essay', formatDescription: 'Viết đoạn văn ngắn theo tình huống cho sẵn', skillsTested: 'Diễn đạt đoạn văn mạch lạc' }
            ]
          },
          {
            sectionId: 'speaking',
            nameCn: '口语 (必考)',
            nameVi: 'Nói (Thi kèm riêng · 5 câu)',
            questionCount: 5,
            durationMinutes: 20,
            maxScore: 100,
            audioRules: 'Thi riêng (~20 phút gồm thời gian chuẩn bị).',
            parts: [
              { partNumber: 1, questionCount: 2, questionType: 'speaking', formatDescription: 'Nghe và tóm tắt lại nội dung câu/đoạn', skillsTested: 'Tóm lược thông tin nghe' },
              { partNumber: 2, questionCount: 1, questionType: 'speaking', formatDescription: 'Trả lời câu hỏi tình huống / phỏng vấn', skillsTested: 'Phản xạ xử lý vấn đề' },
              { partNumber: 3, questionCount: 2, questionType: 'speaking', formatDescription: 'Trình bày quan điểm cá nhân (2 phút)', skillsTested: 'Lập luận trung cấp' }
            ]
          }
        ]
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
        verifiedDate: '2026-11-24',
        sourceReference: 'Đề cương HSK 3.0 CTI (Áp dụng toàn cầu từ 13/12/2026) & GF0025-2021',
        totalDurationMinutes: 110,
        fillingInfoMinutes: 10,
        totalQuestions: 72,
        maxScore: 300,
        passingScore: 180,
        passingNote: 'Chưa xác minh đồng loạt trước 13/12/2026: Bài viết 72 câu (~110p) + thi kèm 5 câu Nói (~23p).',
        hasPinyin: false,
        audioPlayCount: 1,
        vocabularyRequirement: 4316,
        characterRequirement: 1500,
        unverifiedFields: ['Lộ trình áp dụng đồng bộ từ 13/12/2026'],
        notesVi: 'HSK 5 (3.0) gồm 72 câu viết (~110 phút): Nghe 35, Đọc 35 (thêm dạng sắp xếp đoạn văn), Viết 2 bài (4 tranh ≥100 chữ & chủ đề ≥200 chữ) + 5 câu Nói (~23 phút).',
        sections: [
          {
            sectionId: 'listening',
            nameCn: '听力',
            nameVi: 'Nghe hiểu',
            questionCount: 35,
            durationMinutes: 25,
            maxScore: 100,
            audioRules: 'Chỉ phát đúng 1 lần.',
            parts: [
              { partNumber: 1, questionCount: 15, questionType: 'mcq', formatDescription: 'Nghe hội thoại ngắn chọn đáp án đúng', skillsTested: 'Nắm hàm ý & thái độ người nói' },
              { partNumber: 2, questionCount: 20, questionType: 'mcq', formatDescription: 'Nghe phỏng vấn, bản tin & tự sự dài', skillsTested: 'Nghe hiểu thông tin chuyên đề' }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 35,
            durationMinutes: 35,
            maxScore: 100,
            audioRules: 'Bổ sung dạng sắp xếp đoạn văn ở Phần 2.',
            parts: [
              { partNumber: 1, questionCount: 15, questionType: 'fill_blank', formatDescription: 'Điền từ vào đoạn văn (Cloze)', skillsTested: 'Phân biệt từ gần nghĩa & ngữ cảnh' },
              { partNumber: 2, questionCount: 10, questionType: 'mcq', formatDescription: 'Sắp xếp đoạn văn & đọc nhanh nắm ý chính', skillsTested: 'Mạch logic đoạn văn dài' },
              { partNumber: 3, questionCount: 10, questionType: 'mcq', formatDescription: 'Đọc sâu bài báo / nghị luận ngắn', skillsTested: 'Suy luận & tổng hợp ý' }
            ]
          },
          {
            sectionId: 'writing',
            nameCn: '书写',
            nameVi: 'Viết',
            questionCount: 2,
            durationMinutes: 40,
            maxScore: 100,
            audioRules: 'Rút xuống 2 bài tự luận (40 phút).',
            parts: [
              { partNumber: 1, questionCount: 1, questionType: 'essay', formatDescription: 'Nhìn 4 bức tranh liên hoàn viết truyện (≥ 100 chữ Hán)', skillsTested: 'Kể chuyện mạch lạc theo chuỗi ảnh' },
              { partNumber: 2, questionCount: 1, questionType: 'essay', formatDescription: 'Viết bài văn nghị luận / tự sự theo chủ đề (≥ 200 chữ Hán)', skillsTested: 'Triển khai luận điểm & từ vựng HSK 5' }
            ]
          },
          {
            sectionId: 'speaking',
            nameCn: '口语 (必考)',
            nameVi: 'Nói (Thi kèm riêng · 5 câu)',
            questionCount: 5,
            durationMinutes: 23,
            maxScore: 100,
            audioRules: 'Thi riêng (~23 phút gồm thời gian chuẩn bị).',
            parts: [
              { partNumber: 1, questionCount: 2, questionType: 'speaking', formatDescription: 'Nghe và phức thuật lại đoạn văn', skillsTested: 'Diễn đạt lại thông tin chính xác' },
              { partNumber: 2, questionCount: 1, questionType: 'speaking', formatDescription: 'Trả lời câu hỏi vấn đề xã hội / công việc', skillsTested: 'Lập luận đa chiều' },
              { partNumber: 3, questionCount: 2, questionType: 'speaking', formatDescription: 'Diễn thuyết chuyên đề (~2.5 phút)', skillsTested: 'Thuyết trình mạch lạc' }
            ]
          }
        ]
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
        verifiedDate: '2026-11-24',
        sourceReference: 'Đề cương HSK 3.0 CTI (Áp dụng toàn cầu từ 13/12/2026) & GF0025-2021',
        totalDurationMinutes: 125,
        fillingInfoMinutes: 10,
        totalQuestions: 82,
        maxScore: 300,
        passingScore: 180,
        passingNote: 'Chưa xác minh đồng loạt trước 13/12/2026: Bài viết 82 câu (~125p) + thi kèm 5 câu Nói (~23p).',
        hasPinyin: false,
        audioPlayCount: 1,
        vocabularyRequirement: 5456,
        characterRequirement: 1800,
        unverifiedFields: ['Lộ trình áp dụng đồng bộ từ 13/12/2026'],
        notesVi: 'HSK 6 (3.0) gồm 82 câu viết (~125 phút): Nghe 40, Đọc 40 (bỏ câu bệnh 语病), Viết 2 bài (Văn bản ứng dụng 应用文 ≥150 chữ & Nghị luận 议论文 ≥300 chữ) + 5 câu Nói (~23 phút).',
        sections: [
          {
            sectionId: 'listening',
            nameCn: '听力',
            nameVi: 'Nghe hiểu',
            questionCount: 40,
            durationMinutes: 30,
            maxScore: 100,
            audioRules: 'Chỉ phát đúng 1 lần tốc độ tự nhiên.',
            parts: [
              { partNumber: 1, questionCount: 15, questionType: 'mcq', formatDescription: 'Nghe độc thoại & bản tin thời sự', skillsTested: 'Nắm thông tin học thuật / xã hội' },
              { partNumber: 2, questionCount: 15, questionType: 'mcq', formatDescription: 'Nghe tọa đàm & phỏng vấn chuyên đề', skillsTested: 'Phân biệt quan điểm đa chiều' },
              { partNumber: 3, questionCount: 10, questionType: 'mcq', formatDescription: 'Nghe diễn thuyết & báo cáo học thuật', skillsTested: 'Tổng hợp luận điểm dài' }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 40,
            durationMinutes: 40,
            maxScore: 100,
            audioRules: 'Bỏ hoàn toàn dạng bắt lỗi câu bệnh (语病).',
            parts: [
              { partNumber: 1, questionCount: 10, questionType: 'mcq', formatDescription: 'Đọc hiểu ngữ cảnh & cụm từ học thuật (bỏ câu bệnh)', skillsTested: 'Hiểu sắc thái ngữ dụng học thuật' },
              { partNumber: 2, questionCount: 10, questionType: 'fill_blank', formatDescription: 'Điền từ vựng & thành ngữ vào đoạn văn', skillsTested: 'Thành ngữ & kết hợp từ nâng cao' },
              { partNumber: 3, questionCount: 10, questionType: 'mcq', formatDescription: 'Điền câu thích hợp vào đoạn văn', skillsTested: 'Liên kết mạch văn bản' },
              { partNumber: 4, questionCount: 10, questionType: 'mcq', formatDescription: 'Đọc hiểu văn bản dài chuyên sâu', skillsTested: 'Đọc phản biện & suy luận' }
            ]
          },
          {
            sectionId: 'writing',
            nameCn: '书写',
            nameVi: 'Viết',
            questionCount: 2,
            durationMinutes: 45,
            maxScore: 100,
            audioRules: 'Bỏ bài tóm tắt 1000 chữ (缩写), chuyển sang Văn bản ứng dụng & Nghị luận.',
            parts: [
              { partNumber: 1, questionCount: 1, questionType: 'essay', formatDescription: 'Viết văn bản ứng dụng thực tế (应用文 · ≥ 150 chữ Hán)', skillsTested: 'Soạn thảo thông báo, thư đề xuất chuẩn mực' },
              { partNumber: 2, questionCount: 1, questionType: 'essay', formatDescription: 'Viết bài nghị luận nêu quan điểm cá nhân (议论文 · ≥ 300 chữ Hán)', skillsTested: 'Lập luận sắc bén, văn phong học thuật' }
            ]
          },
          {
            sectionId: 'speaking',
            nameCn: '口语 (必考)',
            nameVi: 'Nói (Thi kèm riêng · 5 câu)',
            questionCount: 5,
            durationMinutes: 23,
            maxScore: 100,
            audioRules: 'Thi riêng (~23 phút gồm thời gian chuẩn bị).',
            parts: [
              { partNumber: 1, questionCount: 1, questionType: 'speaking', formatDescription: 'Tóm lược phát biểu chuyên đề', skillsTested: 'Diễn đạt lại luận điểm trang trọng' },
              { partNumber: 2, questionCount: 2, questionType: 'speaking', formatDescription: 'Trả lời phỏng vấn chiều sâu', skillsTested: 'Phản biện linh hoạt' },
              { partNumber: 3, questionCount: 2, questionType: 'speaking', formatDescription: 'Diễn thuyết phản biện chuyên đề (~3 phút)', skillsTested: 'Hùng biện cao cấp' }
            ]
          }
        ]
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
        verifiedDate: '2026-11-24',
        sourceReference: 'CTI chinesetest.cn — Đề mẫu HSK 7–9 cập nhật 2026 (bản 2022: 98 câu / ~210p)',
        sourceUrl: 'http://www.chinesetest.cn/',
        totalDurationMinutes: 200,
        fillingInfoMinutes: 10,
        totalQuestions: 91,
        maxScore: 'Quy đổi phân cấp',
        passingScore: 'Đạt cấp 7 / 8 / 9 theo phổ điểm',
        passingNote: 'Một đề thi duy nhất trên máy tính đánh giá 5 kỹ năng: Nghe (40), Đọc (40), Viết (2), Dịch (4), Nói (5) để xếp bậc 7, 8 hoặc 9.',
        notesVi: 'Đề mẫu HSK 3.0 cập nhật năm 2026 của CTI gồm 91 câu (~200 phút) với 40 câu Đọc; bản công bố giai đoạn đầu cuối 2022 trên một số trang cũ vẫn ghi 98 câu (~210 phút) với 47 câu Đọc.',
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
                formatDescription: 'Nghe hội thoại & phát biểu ngắn, chọn đáp án đúng.',
                skillsTested: 'Nghe hiểu thông tin sự kiện thời sự'
              },
              {
                partNumber: 2,
                questionCount: 9,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe phỏng vấn chuyên sâu & đàm phán.',
                skillsTested: 'Phân tích lập luận và lập trường'
              },
              {
                partNumber: 3,
                questionCount: 15,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe bài giảng học thuật, hội thảo chuyên ngành.',
                skillsTested: 'Tổng hợp và đối chiếu luận điểm phức tạp'
              },
              {
                partNumber: 4,
                questionCount: 6,
                questionType: 'multiple_choice',
                formatDescription: 'Nghe bản tin tổng hợp & tranh biện học thuật.',
                skillsTested: 'Đánh giá sắc thái & suy luận cao cấp'
              }
            ]
          },
          {
            sectionId: 'reading',
            nameCn: '阅读',
            nameVi: 'Đọc hiểu',
            questionCount: 40,
            durationMinutes: 50,
            maxScore: 'Thành phần',
            audioRules: 'Không có âm thanh.',
            parts: [
              {
                partNumber: 1,
                questionCount: 21,
                questionType: 'multiple_choice',
                formatDescription: 'Đọc bài báo học thuật, báo cáo chuyên ngành và trả lời câu hỏi.',
                skillsTested: 'Đọc hiểu văn bản thể loại hành chính, khoa học'
              },
              {
                partNumber: 2,
                questionCount: 5,
                questionType: 'multiple_choice',
                formatDescription: 'Đọc biểu đồ & dữ liệu đa phương thức.',
                skillsTested: 'Phân tích số liệu & cấu trúc bài luận dài'
              },
              {
                partNumber: 3,
                questionCount: 14,
                questionType: 'fill_blank',
                formatDescription: 'Tổng hợp & điền khuyết văn bản học thuật.',
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

export const HSK30_SUMMARY_TABLE = [
  { level: 'HSK 1', band: 'Sơ cấp', listening: '20 (~12p)', reading: '20 (20p)', writing: '—', translation: '—', speaking: 'Không', total: '40', duration: '~40 phút', note: 'Bỏ dạng Đúng/Sai ở phần Nghe, chuyển sang chọn tranh và đối đáp.' },
  { level: 'HSK 2', band: 'Sơ cấp', listening: '25 (~17p)', reading: '25 (25p)', writing: '10 (10p)', translation: '—', speaking: 'Không', total: '60', duration: '~60 phút', note: 'Lần đầu đưa phần Viết vào HSK 2, gồm viết chữ Hán theo Pinyin.' },
  { level: 'HSK 3', band: 'Sơ cấp', listening: '30 (25p)', reading: '30 (33p)', writing: '10 (15p)', translation: '—', speaking: '15 câu (~15p)', total: '70 (+15 nói)', duration: '~83 phút (+15p nói)', note: 'Không còn Pinyin trong đề; thi kèm bài Nói cấp 3 cùng đợt.' },
  { level: 'HSK 4', band: 'Trung cấp', listening: '32 (~20p)', reading: '32 (30p)', writing: '6 (25p)', translation: '—', speaking: '5 câu (~20p)', total: '70 (+5 nói)', duration: '~85 phút (+20p nói)', note: 'Viết bỏ sắp xếp từ, chuyển sang 5 câu đặt theo tranh + 1 đoạn văn ngắn.' },
  { level: 'HSK 5', band: 'Trung cấp', listening: '35 (~25p)', reading: '35 (35p)', writing: '2 (40p)', translation: '—', speaking: '5 câu (~23p)', total: '72 (+5 nói)', duration: '~110 phút (+23p nói)', note: 'Đọc thêm dạng sắp xếp đoạn văn; Viết: 1 bài 4 tranh (≥100 chữ) + 1 chủ đề (≥200 chữ).' },
  { level: 'HSK 6', band: 'Trung cấp', listening: '40 (~30p)', reading: '40 (40p)', writing: '2 (45p)', translation: '—', speaking: '5 câu (~23p)', total: '82 (+5 nói)', duration: '~125 phút (+23p nói)', note: 'Đọc bỏ lỗi câu bệnh (语病); Viết bỏ tóm tắt 1000 chữ, đổi sang 应用文 (≥150) & 议论文 (≥300).' },
  { level: 'HSK 7–9', band: 'Cao cấp', listening: '40 (~30p)', reading: '40* (50p)', writing: '2 (55p)', translation: '4 (41p)', speaking: '5 (tích hợp · 24p)', total: '91*', duration: '~200 phút*', note: 'Thi chung trên máy tính xếp bậc 7/8/9; bản CTI 2026: 91 câu (40 Đọc), bản 2022 cũ: 98 câu (47 Đọc, ~210p).' },
];

export const HSK20_VS_HSK30_COMPARISON = [
  { group: '1. Sơ cấp (HSK 1–3)', detail: 'HSK 1 (40 câu) bỏ phán đoán Đúng/Sai chuyển sang chọn tranh & đối đáp; HSK 2 (60 câu) lần đầu có 10 câu Viết chữ Hán theo Pinyin; HSK 3 (70 câu) bỏ hẳn Pinyin và thi kèm 15 câu Nói (~15 phút).' },
  { group: '2. Trung cấp (HSK 4–6)', detail: 'HSK 4 Viết bỏ sắp xếp từ (chuyển 5 câu theo tranh + 1 đoạn ngắn); HSK 5 Đọc bổ sung sắp xếp đoạn văn, Viết 4 tranh (≥100 chữ) + chủ đề (≥200 chữ); HSK 6 bỏ câu bệnh 语病 & tóm tắt 缩写, chuyển sang Văn bản ứng dụng (≥150 chữ) + Nghị luận (≥300 chữ). Tất cả HSK 4–6 kèm 5 câu Nói.' },
  { group: '3. Cao cấp (HSK 7–9)', detail: 'Một bài thi chung duy nhất trên máy tính tích hợp đủ 5 kỹ năng (Nghe 40, Đọc 40*, Viết 2, Dịch 4, Nói 5 = 91* câu · ~200 phút) để phân bậc HSK 7, 8 hoặc 9 dựa trên điểm đạt được.' },
];

/**
 * Lấy danh sách toàn bộ các cấp độ hỗ trợ
 */
export function getAllHskLevels(version = '2015-Standard') {
  return Object.keys(HSK_STRUCTURE_DEFINITIONS).map(key => {
    const item = HSK_STRUCTURE_DEFINITIONS[key];
    const ver = item.versions[version] || item.versions['2015-Standard'] || Object.values(item.versions)[0];
    return {
      key,
      level: item.level,
      nameVi: item.levelNameVi,
      tagline: item.tagline,
      vocabCount: ver?.vocabularyRequirement || item.vocabularyRequirement,
      questionCount: ver?.totalQuestions,
      durationMinutes: ver?.totalDurationMinutes,
      isSupportedInVersion: Boolean(item.versions[version]),
      availableVersions: Object.keys(item.versions)
    };
  });
}
