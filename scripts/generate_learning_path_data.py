# -*- coding: utf-8 -*-
"""
Generate complete src/data/learningPathData.js
Combines:
- LEARNING_LEVELS (1-7)
- LEARNING_CHAPTERS (1-24, where 1-12 have moduleCode, unitTitle, prerequisite, reviewLessonId, relatedMaterialIds)
- LEARNING_LESSONS (imported and exported from CURRICULUM_60_LESSONS)
- BOSS_CHALLENGES (all 12 authentic bosses with full interactive stages)
- PLACEMENT_QUESTIONS & DEFAULT_DAILY_MISSIONS
"""
import sys
import os
import json
import re

# Add scripts directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from build_all_12_bosses import ALL_12_BOSSES
from append_bosses_5_to_12 import BOSSES_5_TO_12

# Read original learningPathData.js
target_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'learningPathData.js'))
with open(target_path, 'r', encoding='utf-8') as f:
    orig = f.read()

# 1. Extract LEARNING_LEVELS
levels_end = orig.find('export const LEARNING_CHAPTERS = [')
levels_code = orig[:levels_end].strip()

# 2. Extract Chapters 13 to 24
ch13_idx = orig.find('// --- LEVEL 4 (Chapters 13-16) ---')
ch_end_idx = orig.find('// =========================================================================\n// FLAGSHIP LESSONS')
ch13_to_24 = orig[ch13_idx:ch_end_idx].strip()
# remove trailing '];' if present
if ch13_to_24.endswith('];'):
    ch13_to_24 = ch13_to_24[:-2].strip()

# 3. Extract Boss 12
boss12_start = orig.find('// Boss Chapter 12')
boss12_end = orig.find('// =========================================================================\n// PLACEMENT TEST DATASET')
boss12_raw = orig[boss12_start:boss12_end].strip()
if boss12_raw.endswith('];'):
    boss12_raw = boss12_raw[:-2].strip()

# 4. Extract Placement & Daily Missions
placement_idx = orig.find('// =========================================================================\n// PLACEMENT TEST DATASET')
placement_code = orig[placement_idx:].strip()

# Define Chapters 1 to 12
chapters_1_to_12 = """export const LEARNING_CHAPTERS = [
  // --- LEVEL 1 (Modules 1.1 - 1.4 | Chapters 1-4) ---
  {
    id: 'ch-1',
    levelId: 'lvl-1',
    chapterNumber: 1,
    moduleCode: '1.1',
    unitTitle: 'Ngữ âm Pinyin cơ bản & Nét chữ Hán',
    title: 'Pinyin & 4 Thanh điệu căn bản',
    chineseTitle: '拼音与四声',
    desc: 'Làm quen hệ thống ngữ âm: Thanh mẫu b, p, m, f, d, t, n, l, 4 thanh điệu chuẩn Bắc Kinh và 8 nét cơ bản.',
    prerequisite: 'Không có (Bắt đầu từ con số 0)',
    reviewLessonId: 'l-105',
    relatedMaterialIds: ['mat-1', 'mat-7', 'mat-8'],
    lessonIds: ['l-101', 'l-102', 'l-103', 'l-104', 'l-105'],
    bossId: 'boss-ch-1'
  },
  {
    id: 'ch-2',
    levelId: 'lvl-1',
    chapterNumber: 2,
    moduleCode: '1.2',
    unitTitle: 'Giao tiếp mở đầu, Họ tên & Tuổi tác',
    title: 'Chào hỏi, Bản thân & Xưng hô',
    chineseTitle: '问好与自我介绍',
    desc: 'Chào hỏi lịch sự, cảm ơn, tạm biệt, câu chữ 是, hỏi tên tuổi, quốc tịch và số đếm 1-99.',
    prerequisite: 'Module 1.1: Ngữ âm Pinyin & Thuận bút Chữ Hán',
    reviewLessonId: 'l-110',
    relatedMaterialIds: ['mat-1', 'mat-7'],
    lessonIds: ['l-106', 'l-107', 'l-108', 'l-109', 'l-110'],
    bossId: 'boss-ch-2'
  },
  {
    id: 'ch-3',
    levelId: 'lvl-1',
    chapterNumber: 3,
    moduleCode: '1.3',
    unitTitle: 'Đời sống thường nhật, Lịch trình & Địa điểm',
    title: 'Gia đình, Thời gian & Nơi chốn',
    chineseTitle: '家庭、时间与处所',
    desc: 'Nói về gia đình với 有/没有, thứ ngày tháng năm, giờ giấc, địa điểm 在/去 và mua sắm sơ cấp.',
    prerequisite: 'Module 1.2: Chào hỏi, Bản thân & Xưng hô',
    reviewLessonId: 'l-115',
    relatedMaterialIds: ['mat-1', 'mat-5'],
    lessonIds: ['l-111', 'l-112', 'l-113', 'l-114', 'l-115'],
    bossId: 'boss-ch-3'
  },
  {
    id: 'ch-4',
    levelId: 'lvl-1',
    chapterNumber: 4,
    moduleCode: '1.4',
    unitTitle: 'Sở thích cá nhân & Checkpoint HSK 1',
    title: 'Thói quen, Sở thích & Tổng kết HSK 1',
    chineseTitle: '爱好习惯与HSK 1总评',
    desc: 'Đồ ăn thức uống, năng nguyện động từ 会/想, thời tiết, tổng ôn tập từ vựng ngữ pháp và Checkpoint HSK 1.',
    prerequisite: 'Module 1.3: Gia đình, Thời gian & Nơi chốn',
    reviewLessonId: 'l-120',
    relatedMaterialIds: ['mat-1', 'mat-6'],
    lessonIds: ['l-116', 'l-117', 'l-118', 'l-119', 'l-120'],
    bossId: 'boss-ch-4'
  },

  // --- LEVEL 2 (Modules 2.1 - 2.4 | Chapters 5-8) ---
  {
    id: 'ch-5',
    levelId: 'lvl-2',
    chapterNumber: 5,
    moduleCode: '2.1',
    unitTitle: 'Giao thông công cộng & Chỉ đường thực tế',
    title: 'Lịch trình, Phương tiện & Đi lại',
    chineseTitle: '日程交通与出行',
    desc: 'Giờ giấc chi tiết (差, 刻), phương tiện công cộng, khoảng cách với 离 và hỏi chỉ đường với 往.',
    prerequisite: 'Hoàn thành Cấp độ 1 (HSK 1 - Module 1.4)',
    reviewLessonId: 'l-205',
    relatedMaterialIds: ['mat-2', 'mat-5'],
    lessonIds: ['l-201', 'l-202', 'l-203', 'l-204', 'l-205'],
    bossId: 'boss-ch-5'
  },
  {
    id: 'ch-6',
    levelId: 'lvl-2',
    chapterNumber: 6,
    moduleCode: '2.2',
    unitTitle: 'Ẩm thực Trung Hoa & Kỹ năng mặc cả',
    title: 'Ẩm thực, Nhà hàng & Mua sắm',
    chineseTitle: '餐饮美食与购物',
    desc: 'Đi nhà hàng gọi món, dặn dò khẩu vị (ít cay, không rau mùi), mua sắm quần áo và thanh toán mặc cả.',
    prerequisite: 'Module 2.1: Lịch trình, Phương tiện & Đi lại',
    reviewLessonId: 'l-210',
    relatedMaterialIds: ['mat-2', 'mat-5'],
    lessonIds: ['l-206', 'l-207', 'l-208', 'l-209', 'l-210'],
    bossId: 'boss-ch-6'
  },
  {
    id: 'ch-7',
    levelId: 'lvl-2',
    chapterNumber: 7,
    moduleCode: '2.3',
    unitTitle: 'Bốn mùa khí hậu, Câu so sánh & Sức khỏe',
    title: 'Thời tiết, So sánh & Sức khỏe',
    chineseTitle: '气候比较与健康',
    desc: 'Hiện tượng thời tiết bốn mùa, câu so sánh chữ 比, so sánh 更/最, khám bệnh và xin nghỉ phép.',
    prerequisite: 'Module 2.2: Ẩm thực, Nhà hàng & Mua sắm',
    reviewLessonId: 'l-215',
    relatedMaterialIds: ['mat-2', 'mat-5'],
    lessonIds: ['l-211', 'l-212', 'l-213', 'l-214', 'l-215'],
    bossId: 'boss-ch-7'
  },
  {
    id: 'ch-8',
    levelId: 'lvl-2',
    chapterNumber: 8,
    moduleCode: '2.4',
    unitTitle: 'Trợ từ động thái & Checkpoint HSK 2',
    title: 'Trạng thái, Cảm xúc & Tổng kết HSK 2',
    chineseTitle: '动态助词与HSK 2总评',
    desc: 'Trợ từ động thái 着 duy trì trạng thái, 过 trải nghiệm quá khứ, liên từ 因为...所以..., ôn tập và Checkpoint HSK 2.',
    prerequisite: 'Module 2.3: Thời tiết, So sánh & Sức khỏe',
    reviewLessonId: 'l-220',
    relatedMaterialIds: ['mat-2', 'mat-6'],
    lessonIds: ['l-216', 'l-217', 'l-218', 'l-219', 'l-220'],
    bossId: 'boss-ch-8'
  },

  // --- LEVEL 3 (Modules 3.1 - 3.4 | Chapters 9-12) ---
  {
    id: 'ch-9',
    levelId: 'lvl-3',
    chapterNumber: 9,
    moduleCode: '3.1',
    unitTitle: 'Du lịch tự túc & Bổ ngữ xu hướng',
    title: 'Du lịch, Khách sạn & Giao tiếp Độc lập',
    chineseTitle: '自由行酒店与趋向补语',
    desc: 'Đặt phòng khách sạn, thủ tục sân bay, bổ ngữ xu hướng đơn 来/去 và bổ ngữ xu hướng kép.',
    prerequisite: 'Hoàn thành Cấp độ 2 (HSK 2 - Module 2.4)',
    reviewLessonId: 'l-305',
    relatedMaterialIds: ['mat-3', 'mat-5'],
    lessonIds: ['l-301', 'l-302', 'l-303', 'l-304', 'l-305'],
    bossId: 'boss-ch-9'
  },
  {
    id: 'ch-10',
    levelId: 'lvl-3',
    chapterNumber: 10,
    moduleCode: '3.2',
    unitTitle: 'Bổ ngữ kết quả, Câu chữ 把 & Câu chữ 被',
    title: 'Bổ ngữ Kết quả & Ngữ pháp Cốt lõi',
    chineseTitle: '结果可能补语与把被字句',
    desc: 'Bổ ngữ kết quả, bổ ngữ khả năng, cấu trúc linh hồn: Câu chữ 把 căn bản và nâng cao, câu bị động chữ 被.',
    prerequisite: 'Module 3.1: Du lịch, Khách sạn & Giao tiếp Độc lập',
    reviewLessonId: 'l-310',
    relatedMaterialIds: ['mat-3', 'mat-5'],
    lessonIds: ['l-306', 'l-307', 'l-308', 'l-309', 'l-310'],
    bossId: 'boss-ch-10'
  },
  {
    id: 'ch-11',
    levelId: 'lvl-3',
    chapterNumber: 11,
    moduleCode: '3.3',
    unitTitle: 'Công sở, Trường học & Trợ từ kết cấu 的/地/得',
    title: 'Công việc, Học tập & Giao tế Xã hội',
    chineseTitle: '职场学业与结构助词',
    desc: 'Môi trường công sở văn phòng, trường đại học thi cử, cảm xúc tính cách và phân biệt triệt để 3 chữ Đích 的, 地, 得.',
    prerequisite: 'Module 3.2: Bổ ngữ Kết quả & Ngữ pháp Cốt lõi',
    reviewLessonId: 'l-315',
    relatedMaterialIds: ['mat-3', 'mat-5'],
    lessonIds: ['l-311', 'l-312', 'l-313', 'l-314', 'l-315'],
    bossId: 'boss-ch-11'
  },
  {
    id: 'ch-12',
    levelId: 'lvl-3',
    chapterNumber: 12,
    moduleCode: '3.4',
    unitTitle: 'Thành ngữ, Kể chuyện & Đại Khảo Hạch HSK 3',
    title: 'Thành ngữ, Văn hóa & Tổng kết HSK 3',
    chineseTitle: '成语叙事与HSK 3终极挑战',
    desc: 'Thành ngữ 4 chữ thông dụng, kỹ năng kể chuyện với liên từ kết nối, đọc hiểu phân cấp, tổng ôn tập và Đại Khảo Hạch HSK 3.',
    prerequisite: 'Module 3.3: Công việc, Học tập & Giao tế Xã hội',
    reviewLessonId: 'l-320',
    relatedMaterialIds: ['mat-3', 'mat-6'],
    lessonIds: ['l-316', 'l-317', 'l-318', 'l-319', 'l-320'],
    bossId: 'boss-ch-12'
  },

  """

full_chapters = chapters_1_to_12 + ch13_to_24 + "\n];\n"

# 5. Format Bosses 1 to 11
bosses_1_to_11 = ALL_12_BOSSES + BOSSES_5_TO_12
bosses_json_parts = []
for b in bosses_1_to_11:
    b_json = json.dumps(b, ensure_ascii=False, indent=2)
    bosses_json_parts.append(b_json)

bosses_code_1_to_11 = ",\n\n".join(bosses_json_parts)

boss_section = f"""// =========================================================================
// 12 BOSS CHALLENGES (INTERACTIVE MULTI-STAGE SCENARIO COMBAT)
// =========================================================================
export const BOSS_CHALLENGES = [
{bosses_code_1_to_11},

{boss12_raw}
];
"""

# 6. Curriculum Lessons Import & Export
lessons_section = """// =========================================================================
// CURRICULUM 60 PEDAGOGICAL LESSONS (LEVELS 1 - 3: 60 COMPLETE LESSONS)
// Strictly follows docs/HANZIGO_CHINESE_CURRICULUM.md v2.0
// =========================================================================
import { CURRICULUM_60_LESSONS } from './curriculumLessons.js';
export const LEARNING_LESSONS = CURRICULUM_60_LESSONS;
"""

# Combine all parts
final_file_content = f"""{levels_code}

{full_chapters}
{lessons_section}
{boss_section}

{placement_code}
"""

with open(target_path, 'w', encoding='utf-8') as f:
    f.write(final_file_content)

print("Successfully written to", target_path)
print("File size:", len(final_file_content), "chars")
