// Helper for managing Documents, Materials, and Custom Content in HanziGo
import { triggerCloudSync } from '../firebase/services';

export const DEFAULT_MATERIALS = [
  {
    id: 'mat-1',
    title: 'Giáo trình Chuẩn HSK 1 - Standard Course (Từ vựng, Ngữ pháp & Audio)',
    category: 'Giáo trình chuẩn',
    level: 'HSK 1',
    format: 'Trực tuyến & MP3',
    fileSize: '150 từ vựng cốt lõi',
    author: 'Đại học Ngôn ngữ Bắc Kinh (BLCU)',
    description: 'Tài liệu học và tra cứu chuẩn HSK 1 chính thức. Bao gồm 150 chữ Hán, phát âm Audio bản ngữ, âm Hán Việt, câu ví dụ và bài tập thực hành theo giáo trình chuẩn.',
    downloadUrl: 'https://www.hsk.academy/en/hsk_1',
    tags: ['HSK 1', 'Giáo trình', 'Có Audio', 'Nhập môn'],
    createdAt: '2026-03-01',
    downloadsCount: 1420
  },
  {
    id: 'mat-2',
    title: 'Giáo trình Chuẩn HSK 2 - Standard Course (Sách bài học & Từ vựng đàm thoại)',
    category: 'Giáo trình chuẩn',
    level: 'HSK 2',
    format: 'Trực tuyến & MP3',
    fileSize: '300 từ vựng đàm thoại',
    author: 'Đại học Ngôn ngữ Bắc Kinh (BLCU)',
    description: 'Tiếp nối HSK 1, trang bị thêm 150 từ vựng và các cấu trúc ngữ pháp đàm thoại sinh hoạt hàng ngày, mua sắm, thời tiết và giao thông kèm file nghe chuẩn.',
    downloadUrl: 'https://www.hsk.academy/en/hsk_2',
    tags: ['HSK 2', 'Giáo trình', 'Đàm thoại', 'Có Audio'],
    createdAt: '2026-03-05',
    downloadsCount: 1180
  },
  {
    id: 'mat-3',
    title: 'Giáo trình Chuẩn HSK 3 - Standard Course (Trọn bộ Trung cấp 1)',
    category: 'Giáo trình chuẩn',
    level: 'HSK 3',
    format: 'Trực tuyến & MP3',
    fileSize: '600 từ vựng',
    author: 'Khổng Tử Học Viện & BLCU',
    description: 'Chinh phục trình độ Trung cấp 1 với 600 từ vựng cốt lõi. Giúp bạn tự tin du lịch Trung Quốc tự túc và trao đổi công việc thường ngày.',
    downloadUrl: 'https://www.hsk.academy/en/hsk_3',
    tags: ['HSK 3', 'Giáo trình', 'Trung cấp', 'Công việc'],
    createdAt: '2026-03-10',
    downloadsCount: 950
  },
  {
    id: 'mat-4',
    title: 'Cẩm Nang 214 Bộ Thủ Chữ Hán Khang Hy (Hình vẽ, Pinyin & Bút thuận)',
    category: 'Bộ thủ & Hán tự',
    level: 'Tất cả',
    format: 'Tương tác & In PDF',
    fileSize: 'Trọn bộ 214 bộ thủ',
    author: 'Ban Học thuật HanziGo',
    description: 'Tài liệu chiết tự chữ Hán độc quyền với bảng tra cứu đầy đủ 214 bộ thủ, âm Hán Việt, phiên âm Pinyin, nét viết và các chữ Hán ví dụ tạo thành. Có nút in ra giấy hoặc lưu PDF.',
    downloadUrl: '/214-bo-thu-chu-han.html',
    tags: ['Bộ thủ', 'Chiết tự', 'Tập viết', 'Tượng hình'],
    createdAt: '2026-02-15',
    downloadsCount: 2850
  },
  {
    id: 'mat-5',
    title: '100 Điểm Ngữ Pháp Tiếng Trung Trọng Tâm HSK 1 - 4 (Chinese Grammar Wiki)',
    category: 'Ngữ pháp chuyên sâu',
    level: 'HSK 1 - 4',
    format: 'Bách khoa Ngữ pháp',
    fileSize: '185 điểm ngữ pháp',
    author: 'AllSet Learning Chinese Grammar',
    description: 'Bách khoa toàn thư ngữ pháp tiếng Trung uy tín nhất thế giới: Câu chữ 把, câu chữ 被, câu so sánh 比, trợ từ trạng thái 了/着/过, bổ ngữ kết quả và xu hướng kèm ví dụ chi tiết.',
    downloadUrl: 'https://resources.allsetlearning.com/chinese/grammar/HSK_1_grammar_points',
    tags: ['Ngữ pháp', 'Câu chữ 把', 'Song ngữ', 'HSK 1-4'],
    createdAt: '2026-02-20',
    downloadsCount: 3100
  },
  {
    id: 'mat-6',
    title: 'Cổng Tải Đề Thi Thử HSK & Audio Chính Thức (Chinese Testing International)',
    category: 'Đề thi HSK',
    level: 'HSK 3',
    format: 'PDF + MP3 Chính thức',
    fileSize: 'Kho đề thi CTI',
    author: 'Trung tâm Khảo thí Quốc tế HSK (CTI chinesetest.cn)',
    description: 'Kho đề thi mô phỏng và đề thi thật các kỳ thi HSK của đơn vị tổ chức thi chính thức CTI. Bao gồm đầy đủ đề thi PDF, đáp án và file nghe Audio chất lượng cao.',
    downloadUrl: 'https://www.chinesetest.cn/godownload.do',
    tags: ['Đề thi', 'HSK 3', 'Luyện thi', 'Có đáp án'],
    createdAt: '2026-03-12',
    downloadsCount: 890
  },
  {
    id: 'mat-7',
    title: 'Bộ Đề Thi Thử & Luyện Thi HSK 4 Chuẩn Mới (CTI Download Center)',
    category: 'Đề thi HSK',
    level: 'HSK 4',
    format: 'PDF + MP3',
    fileSize: 'Đề thi chuẩn quốc tế',
    author: 'Trung tâm Khảo thí Quốc tế HSK (chinesetest.cn)',
    description: 'Tài liệu luyện thi HSK 4 chính thức với các dạng bài đọc hiểu nghị luận ngắn, sắp xếp trật tự câu và viết đoạn văn theo tranh mẫu đạt điểm cao.',
    downloadUrl: 'https://www.chinesetest.cn/godownload.do',
    tags: ['Đề thi', 'HSK 4', 'Luyện thi', 'Audio'],
    createdAt: '2026-03-15',
    downloadsCount: 760
  },
  {
    id: 'mat-8',
    title: 'Bảng Quy Tắc Chuyển Âm Hán Việt & Pinyin Tiếng Trung',
    category: 'Bộ thủ & Hán tự',
    level: 'Tất cả',
    format: 'Trực tuyến & In A4',
    fileSize: 'Bảng quy tắc vàng',
    author: 'HanziGo Research',
    description: 'Bí quyết giúp người Việt học tiếng Trung nhanh gấp 3 lần: Quy tắc đối chiếu phụ âm đầu (B, C, Đ, H, L, M, N, T, V...) và vần tương ứng sang thanh mẫu/vận mẫu Pinyin.',
    downloadUrl: '/bang-doi-chieu-han-viet.html',
    tags: ['Hán Việt', 'Bảng tra', 'Quy tắc', 'Tốc hành'],
    createdAt: '2026-02-10',
    downloadsCount: 4200
  },
  {
    id: 'mat-9',
    title: 'Vở Tập Viết Chữ Hán Chuẩn Ô Mễ Tự (Mizige A4 In Ngay & Lưu PDF)',
    category: 'Bộ thủ & Hán tự',
    level: 'Nhập môn',
    format: 'PDF In A4 Vector',
    fileSize: 'Khổ A4 chuẩn nét',
    author: 'HanziGo Studio',
    description: 'Tệp giấy tập viết kẻ sẵn ô mễ tự (米字格) 8 hướng chuẩn và dòng kẻ pinyin phía trên, độ nét vector cao khổ A4. Bấm vào là in ra giấy hoặc lưu PDF ngay lập tức.',
    downloadUrl: '/vo-tap-viet-chu-han-a4.html',
    tags: ['Tập viết', 'Ô mễ tự', 'In A4', 'Nét bút'],
    createdAt: '2026-01-25',
    downloadsCount: 5120
  },
  {
    id: 'mat-10',
    title: '500 Thành Ngữ Tiếng Trung Thông Dụng (Thành ngữ 4 chữ 成语 Wiktionary)',
    category: 'Thành ngữ & Giao tiếp',
    level: 'HSK 4 - 6',
    format: 'Từ điển Trực tuyến',
    fileSize: '500 thành ngữ',
    author: 'Wiktionary Appendix',
    description: 'Tra cứu 500 thành ngữ 4 chữ (成语) quen thuộc nhất trong đời sống, phim ảnh và văn học Trung Hoa kèm chữ Hán, Pinyin, giải nghĩa và ngữ cảnh sử dụng.',
    downloadUrl: 'https://en.wiktionary.org/wiki/Appendix:Mandarin_chengyu',
    tags: ['Thành ngữ', 'Thành ngữ 4 chữ', 'Cao cấp', 'Văn hóa'],
    createdAt: '2026-03-18',
    downloadsCount: 680
  }
];

export const MATERIAL_CATEGORIES = [
  'Tất cả',
  'Giáo trình chuẩn',
  'Ngữ pháp chuyên sâu',
  'Đề thi HSK',
  'Bộ thủ & Hán tự',
  'Thành ngữ & Giao tiếp'
];

export const MATERIAL_LEVELS = [
  'Tất cả',
  'Nhập môn',
  'HSK 1',
  'HSK 2',
  'HSK 3',
  'HSK 4',
  'HSK 5',
  'HSK 6'
];

export const MATERIAL_FORMATS = [
  'PDF',
  'PDF + MP3',
  'ZIP (PDF + MP3)',
  'PDF In A4 Vector',
  'Tương tác & In PDF',
  'Trực tuyến & MP3',
  'Trực tuyến & In A4',
  'Bách khoa Ngữ pháp',
  'Từ điển Trực tuyến',
  'Google Drive',
  'Video Bài giảng'
];

// Helper functions for Materials
export function getStoredMaterials() {
  try {
    const saved = localStorage.getItem('hanzigo_materials');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Auto-migrate if any item still has old dummy placeholder link
        const hasLegacySampleLinks = parsed.some(
          (m) => m.downloadUrl && m.downloadUrl.includes('sample-')
        );
        if (hasLegacySampleLinks) {
          localStorage.setItem('hanzigo_materials', JSON.stringify(DEFAULT_MATERIALS));
          return DEFAULT_MATERIALS;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading stored materials:', err);
  }
  // Fallback to default
  localStorage.setItem('hanzigo_materials', JSON.stringify(DEFAULT_MATERIALS));
  return DEFAULT_MATERIALS;
}

export function saveMaterial(material) {
  const current = getStoredMaterials();
  const newMaterial = {
    ...material,
    id: material.id || `mat-${Date.now()}`,
    createdAt: material.createdAt || new Date().toISOString().split('T')[0],
    downloadsCount: material.downloadsCount || 0
  };
  const updated = [newMaterial, ...current];
  localStorage.setItem('hanzigo_materials', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function updateMaterial(id, updatedData) {
  const current = getStoredMaterials();
  const updated = current.map((item) => (item.id === id ? { ...item, ...updatedData } : item));
  localStorage.setItem('hanzigo_materials', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function deleteMaterial(id) {
  const current = getStoredMaterials();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem('hanzigo_materials', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function resetMaterials() {
  localStorage.setItem('hanzigo_materials', JSON.stringify(DEFAULT_MATERIALS));
  triggerCloudSync();
  return DEFAULT_MATERIALS;
}

// Custom Vocabulary Helpers
export function getStoredCustomVocab() {
  try {
    const saved = localStorage.getItem('hanzigo_custom_vocab');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading stored custom vocab:', err);
  }
  return [];
}

export function saveCustomVocab(vocab) {
  const current = getStoredCustomVocab();
  const newItem = {
    ...vocab,
    id: vocab.id || `custom-vocab-${Date.now()}`,
    isCustom: true
  };
  const updated = [newItem, ...current];
  localStorage.setItem('hanzigo_custom_vocab', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function deleteCustomVocab(id) {
  const current = getStoredCustomVocab();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem('hanzigo_custom_vocab', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

// Custom Lessons Helpers
export function getStoredCustomLessons() {
  try {
    const saved = localStorage.getItem('hanzigo_custom_lessons');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading stored custom lessons:', err);
  }
  return [];
}

export function saveCustomLesson(lesson) {
  const current = getStoredCustomLessons();
  const newItem = {
    ...lesson,
    id: lesson.id || `custom-lesson-${Date.now()}`,
    isCustom: true
  };
  const updated = [newItem, ...current];
  localStorage.setItem('hanzigo_custom_lessons', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function deleteCustomLesson(id) {
  const current = getStoredCustomLessons();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem('hanzigo_custom_lessons', JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}
