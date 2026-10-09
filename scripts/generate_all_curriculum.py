# -*- coding: utf-8 -*-
"""
Generate complete 60-lesson curriculum for HanziGo (Levels 1-3)
Directly maps docs/HANZIGO_CHINESE_CURRICULUM.md into src/data/curriculumLessons.js
"""
import json

# Read the first 10 lessons from src/data/curriculumLessons.js up to line 1050
with open("src/data/curriculumLessons.js", "r", encoding="utf-8") as f:
    text = f.read()

# We know the first 10 lessons are defined in text up to `// --- LESSON 110 ---`
# Let's inspect where lesson 110 ends
idx = text.rfind("badge: 'Bậc Thầy Giao Tiếp Nhập Môn'")
if idx == -1:
    print("Could not find lesson 110 badge")
    exit(1)

# Find the closing brace of lesson 110
end_l110 = text.find("}", idx)
end_l110 = text.find("}", end_l110 + 1) # closing challenge
end_l110 = text.find("}", end_l110 + 1) # closing lesson object

base_content = text[:end_l110 + 1]
print(f"Base content extracted up to lesson 110, length: {len(base_content)}")
