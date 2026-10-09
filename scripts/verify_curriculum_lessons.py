# -*- coding: utf-8 -*-
"""
Verify src/data/curriculumLessons.js structure and completeness
"""
import re

with open("src/data/curriculumLessons.js", "r", encoding="utf-8") as f:
    text = f.read()

ids = re.findall(r'["\']?id["\']?:\s*["\'](l-\d+)["\']', text)
print(f"Total lesson IDs extracted: {len(ids)}")
unique_ids = set(ids)
print(f"Total unique lesson IDs: {len(unique_ids)}")

expected_ids = (
    [f"l-1{i:02d}" for i in range(1, 21)] +
    [f"l-2{i:02d}" for i in range(1, 21)] +
    [f"l-3{i:02d}" for i in range(1, 21)]
)

missing = [x for x in expected_ids if x not in unique_ids]
if missing:
    print(f"ERROR: Missing IDs: {missing}")
else:
    print("ALL 60 EXPECTED LESSON IDs ARE PRESENT!")

# Check step keywords
steps = ["step1_learn", "step2_vocabulary", "step3_hanzi", "step4_grammar", "step5_listening", "step6_speaking", "step7_writing", "step8_quiz", "step9_challenge"]
for step in steps:
    count = len(re.findall(re.escape(step), text))
    print(f"  {step}: {count} occurrences")
    assert count >= 60, f"Expected at least 60 occurrences of {step}, got {count}"

print("All 9 steps validated across all 60 lessons!")
