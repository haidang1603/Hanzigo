# -*- coding: utf-8 -*-
"""
Merger script: Assembles all 60 curriculum lessons into src/data/curriculumLessons.js
"""
import json
import re

# Import all modules
from curriculum_module_1_3 import MODULE_1_LESSONS
from curriculum_module_1_4 import MODULE_1_4_LESSONS
from curriculum_level_2_part1 import LEVEL_2_LESSONS
from curriculum_level_2_part2 import LEVEL_2_REMAINING
from curriculum_level_2_part3 import LEVEL_2_MODULES_3_AND_4
from curriculum_level_3_part1 import LEVEL_3_PART1
from curriculum_level_3_part2 import LEVEL_3_PART2
from curriculum_level_3_part3 import LEVEL_3_MODULES_3_AND_4

all_50_lessons = (
    MODULE_1_LESSONS +
    MODULE_1_4_LESSONS +
    LEVEL_2_LESSONS +
    LEVEL_2_REMAINING +
    LEVEL_2_MODULES_3_AND_4 +
    LEVEL_3_PART1 +
    LEVEL_3_PART2 +
    LEVEL_3_MODULES_3_AND_4
)

print(f"Total new lessons prepared: {len(all_50_lessons)}")
ids = [l["id"] for l in all_50_lessons]
print(f"IDs: {ids[0]} ... {ids[-1]}")
assert len(all_50_lessons) == 50, f"Expected 50 lessons, got {len(all_50_lessons)}"

# Read the first 10 lessons from src/data/curriculumLessons.js
with open("src/data/curriculumLessons.js", "r", encoding="utf-8") as f:
    orig_text = f.read()

# Find the end of lesson 110 object
# In lesson 110, badge is 'Bậc Thầy Giao Tiếp Nhập Môn'
badge_marker = "badge: 'Bậc Thầy Giao Tiếp Nhập Môn'"
idx = orig_text.find(badge_marker)
if idx == -1:
    badge_marker = 'badge: "Bậc Thầy Giao Tiếp Nhập Môn"'
    idx = orig_text.find(badge_marker)
assert idx != -1, "Could not find lesson 110 badge marker"

# Find the closing brace of lesson 110
end_l110 = orig_text.find("}", idx)
end_l110 = orig_text.find("}", end_l110 + 1) # closing challenge
end_l110 = orig_text.find("}", end_l110 + 1) # closing lesson object

base_10_lessons = orig_text[:end_l110 + 1]

# Convert all 50 lessons into formatted JavaScript
def lesson_to_js(l):
    # json.dumps with indent 2, then adjust indent
    js_str = json.dumps(l, ensure_ascii=False, indent=2)
    # indent each line with 2 spaces
    indented = "\n".join("  " + line for line in js_str.split("\n"))
    return indented

all_50_js = ",\n\n" + ",\n\n".join(lesson_to_js(l) for l in all_50_lessons)

full_file_content = (
    base_10_lessons
    + all_50_js
    + "\n];\n\n"
    + "// Helper: Find lesson by id from curriculum dataset\n"
    + "export function getCurriculumLessonById(lessonId) {\n"
    + "  return CURRICULUM_60_LESSONS.find(l => l.id === lessonId);\n"
    + "}\n"
)

# Write to src/data/curriculumLessons.js
with open("src/data/curriculumLessons.js", "w", encoding="utf-8") as f:
    f.write(full_file_content)

print(f"Successfully wrote full 60-lesson curriculum to src/data/curriculumLessons.js! File size: {len(full_file_content)} chars")
