/**
 * =========================================================================
 * HANZIGO - CHINESE CHARACTER WORKSHEET GENERATOR UTILITIES
 * =========================================================================
 * Cung cấp logic cấu hình, trích xuất ký tự, sinh dòng ô Điền tự / Mễ tự
 * chuẩn quốc tế cho bảng in PDF A4 tập viết chữ Hán truyền thống.
 * =========================================================================
 */

import { getCharacterDetail } from '../services/characterDictionaryService.js';

export const GRID_STYLES = {
  TIANZIGE: {
    id: 'tianzige',
    name: 'Ô Điền tự (田字格)',
    shortName: 'Điền tự',
    desc: 'Đường chữ thập nét đứt (+) chia 4 góc cân đối, kinh điển trong sách giáo khoa'
  },
  MIZIGE: {
    id: 'mizige',
    name: 'Ô Mễ tự (米字格)',
    shortName: 'Mễ tự',
    desc: 'Đường chữ thập (+) và 2 đường chéo (x) 8 hướng định hình trọng tâm chữ'
  },
  JIUGONGGE: {
    id: 'jiugongge',
    name: 'Ô Cửu cung (九宫格)',
    shortName: 'Cửu cung',
    desc: 'Lưới 3x3 hỗ trợ định vị các bộ phận chữ phức tạp nhiều nét'
  },
  BLANK: {
    id: 'blank',
    name: 'Ô vuông trơn (方格)',
    shortName: 'Vuông trơn',
    desc: 'Ô vuông trơn không đường gióng, dành cho học viên đã vững nét'
  }
};

export const GRID_COLORS = {
  red: {
    id: 'red',
    name: 'Đỏ son truyền thống (Mễ tự Trung Hoa)',
    hex: '#DC2626',
    borderHex: '#EF4444',
    lineHex: '#FCA5A5',
    accentBg: '#FEF2F2'
  },
  slate: {
    id: 'slate',
    name: 'Xám tiêu chuẩn (Tiết kiệm mực in)',
    hex: '#475569',
    borderHex: '#94A3B8',
    lineHex: '#CBD5E1',
    accentBg: '#F8FAFC'
  },
  blue: {
    id: 'blue',
    name: 'Xanh mực học trò',
    hex: '#1D4ED8',
    borderHex: '#3B82F6',
    lineHex: '#BFDBFE',
    accentBg: '#EFF6FF'
  }
};

export const WORKSHEET_PRESETS = [
  {
    id: 'hsk1_starter',
    label: 'HSK 1 Khởi động',
    text: '你好我他们中国人大'
  },
  {
    id: 'greetings',
    label: 'Chào hỏi & Cảm ơn',
    text: '你好谢谢对不起没关系再见'
  },
  {
    id: 'numbers',
    label: 'Số đếm 1 đến 10',
    text: '一二三四五六七八九十'
  },
  {
    id: 'nature',
    label: 'Thiên nhiên & Bốn mùa',
    text: '日月水火山风春夏秋冬'
  },
  {
    id: 'family',
    label: 'Gia đình thân thuộc',
    text: '爸爸妈妈哥哥弟弟姐姐妹妹'
  }
];

/**
 * Trích xuất các chữ Hán hợp lệ từ văn bản người dùng nhập
 * @param {string} input 
 * @param {boolean} deduplicate Có loại bỏ chữ trùng lặp không (mặc định: false)
 * @returns {string[]} Mảng các chữ Hán CJK
 */
export function extractWorksheetCharacters(input = '', deduplicate = false) {
  if (!input || typeof input !== 'string') return [];
  const matches = input.match(/[\u4e00-\u9fa5]/g) || [];
  if (deduplicate) {
    return Array.from(new Set(matches));
  }
  return matches;
}

/**
 * Tạo cấu hình chi tiết cho từng ô trong một dòng tập viết
 * @param {Object} options
 * @returns {Array<Object>}
 */
export function generateRowCells({
  character = '',
  totalCells = 11,
  traceBoxesCount = 3,
  traceOpacity = 0.25,
  pinyin = '',
  showPinyin = true
}) {
  const cells = [];

  for (let i = 0; i < totalCells; i++) {
    let mode = 'blank'; // 'model', 'trace', 'blank'
    let opacity = 0;

    if (i === 0) {
      mode = 'model';
      opacity = 1;
    } else if (i <= traceBoxesCount) {
      mode = 'trace';
      opacity = traceOpacity;
    } else {
      mode = 'blank';
      opacity = 0;
    }

    cells.push({
      index: i,
      mode,
      char: character,
      pinyin: (i === 0 || i <= traceBoxesCount || showPinyin) ? pinyin : '',
      opacity
    });
  }

  return cells;
}

/**
 * Sinh toàn bộ mô hình dữ liệu cho tài liệu in A4
 */
export function buildWorksheetDocument({
  title = 'HanziGo — Bảng Tập Viết Chữ Hán',
  characters = [],
  rowsPerChar = 2,
  totalCellsPerRow = 11,
  gridStyle = 'tianzige',
  gridColor = 'red',
  traceBoxesCount = 3,
  traceOpacity = 0.25,
  showPinyin = true,
  showPinyinGrid = true,
  showSummaryCard = true,
  showHeaderInfo = true,
  studentName = '',
  className = '',
  date = ''
}) {
  const validChars = Array.isArray(characters) ? characters : extractWorksheetCharacters(characters);
  const colorConfig = GRID_COLORS[gridColor] || GRID_COLORS.red;
  const styleConfig = GRID_STYLES[gridStyle.toUpperCase()] || GRID_STYLES.TIANZIGE;

  const characterSections = validChars.map((char) => {
    const detail = getCharacterDetail(char);
    const rows = [];

    for (let r = 0; r < rowsPerChar; r++) {
      rows.push({
        rowIndex: r,
        cells: generateRowCells({
          character: char,
          totalCells: totalCellsPerRow,
          traceBoxesCount,
          traceOpacity,
          pinyin: detail.pinyin || '',
          showPinyin
        })
      });
    }

    return {
      char,
      detail,
      rows
    };
  });

  return {
    meta: {
      title,
      studentName,
      className,
      date: date || new Date().toLocaleDateString('vi-VN'),
      createdAt: new Date().toISOString()
    },
    settings: {
      gridStyle: styleConfig.id,
      gridColor: colorConfig,
      rowsPerChar,
      totalCellsPerRow,
      traceBoxesCount,
      traceOpacity,
      showPinyin,
      showPinyinGrid,
      showSummaryCard,
      showHeaderInfo
    },
    characterSections
  };
}
