# -*- coding: utf-8 -*-
"""
HANZIGO — MASTER ASSEMBLER FOR HSK 4-6 CURRICULUM
Assembles 60 lessons from hsk4_data, hsk5_data, hsk6_data
and writes src/data/curriculumLessonsHsk4to6.js.
"""

import json
import os
import sys

# Ensure scripts dir is on sys.path
sys.path.insert(0, os.path.dirname(__file__))

from hsk4_data import get_hsk4_lessons
from hsk5_data import get_hsk5_lessons
from hsk6_data import get_hsk6_lessons

LESSONS = []

def add_l(lid, ch_id, lvl_id, num, title, ch_title, sub, obj,
          vocab, hanzi, gram, listen, speak, write, quizzes, chall):
    hsk = "HSK 4" if lvl_id == "lvl-4" else ("HSK 5" if lvl_id == "lvl-5" else "HSK 6")
    v_objs = []
    for idx, v in enumerate(vocab, 1):
        v_objs.append({
            "id": f"v-{lid[2:]}-{idx}",
            "hanzi": v[0], "pinyin": v[1], "hanviet": v[2], "meaning": v[3], "radical": f"Bộ {v[4]}",
            "example": {"hanzi": v[5], "pinyin": v[6], "meaning": v[7]}
        })
    h_objs = []
    for h in hanzi:
        h_objs.append({
            "hanzi": h[0], "pinyin": h[1], "meaning": h[2], "strokesCount": h[3],
            "strokeOrderText": h[4], "components": h[5], "mnemonic": h[6]
        })
    d_objs = []
    for d in listen[0]:
        d_objs.append({"speaker": d[0], "hanzi": d[1], "pinyin": d[2], "meaning": d[3]})

    q_objs = []
    for idx, q in enumerate(quizzes, 1):
        q_objs.append({
            "id": f"q-{lid[2:]}-{idx}", "type": "multiple-choice",
            "question": q[0], "options": q[1], "correctIndex": q[2], "explanation": q[3]
        })

    lesson = {
        "id": lid, "chapterId": ch_id, "levelId": lvl_id, "lessonNumber": num,
        "title": title, "chineseTitle": ch_title, "subtitle": sub, "objective": obj,
        "prerequisite": f"Hoàn thành các bài trước thuộc {hsk}",
        "completionCriteria": "Đạt tối thiểu 70% bài tập trắc nghiệm và hoàn thành phát âm.",
        "durationMinutes": 25, "xpReward": 60,
        "tags": [hsk, "Giao tiếp nâng cao", "Ngữ pháp chuyên sâu"],
        "relatedMaterialIds": [f"mat-{ch_id}"],
        "step1_learn": {
            "topic": f"{title} - Trọng tâm {hsk}",
            "summary": sub,
            "keyTakeaways": [obj, f"Làm chủ điểm ngữ pháp: {gram[0]}"],
            "audioDemoText": listen[1]
        },
        "step2_vocabulary": v_objs,
        "step3_hanzi": h_objs,
        "step4_grammar": {
            "formula": gram[0], "title": gram[1], "explanation": gram[2],
            "examples": [{"hanzi": gram[3][0], "pinyin": gram[3][1], "meaning": gram[3][2]}],
            "commonMistake": {"wrong": gram[4][0], "correct": gram[4][1], "explanation": gram[4][2]}
        },
        "step5_listening": {
            "dialogue": d_objs, "audioText": listen[1], "question": listen[2],
            "options": listen[3], "correctIndex": listen[4], "explanation": listen[5]
        },
        "step6_speaking": {
            "prompt": speak[0], "targetSentence": speak[1], "targetPinyin": speak[2],
            "targetMeaning": speak[3], "hint": speak[4]
        },
        "step7_writing": {
            "prompt": write[0], "words": write[1], "correctOrder": write[2], "explanation": write[3]
        },
        "step8_quiz": q_objs,
        "step9_challenge": {
            "title": chall[0], "taskDesc": chall[1], "targetPhrase": chall[2], "xpReward": 60, "badge": chall[3]
        }
    }
    LESSONS.append(lesson)

print("Assembling HSK 4...")
get_hsk4_lessons(add_l)
print(f"Total after HSK 4: {len(LESSONS)}")

print("Assembling HSK 5...")
get_hsk5_lessons(add_l)
print(f"Total after HSK 5: {len(LESSONS)}")

print("Assembling HSK 6...")
get_hsk6_lessons(add_l)
print(f"Total after HSK 6: {len(LESSONS)}")

# Verify all 60 IDs
expected_ids = []
for i in range(401, 421): expected_ids.append(f"l-{i}")
for i in range(501, 521): expected_ids.append(f"l-{i}")
for i in range(601, 621): expected_ids.append(f"l-{i}")

actual_ids = [l["id"] for l in LESSONS]
assert len(LESSONS) == 60, f"Expected 60 lessons, got {len(LESSONS)}"
assert actual_ids == expected_ids, f"ID mismatch: {set(expected_ids) - set(actual_ids)}"

# Output file path
output_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "curriculumLessonsHsk4to6.js")
output_path = os.path.abspath(output_path)

header = """// =========================================================================
// HANZIGO RESEARCH-BASED CHINESE CURRICULUM LESSONS (LEVELS 4 - 6: 60 LESSONS)
// Covers Chapters 13 to 24 (l-401 to l-620)
// Complete 9-step pedagogical architecture:
// Objectives, Prerequisites, Vocabulary, Hanzi breakdown, Grammar,
// Listening dialogues with audio scripts, Speaking, Writing sentence formation,
// Multiple-choice quizzes with explanations, Challenges & badges.
// =========================================================================

export const CURRICULUM_HSK4_6_LESSONS = """

json_str = json.dumps(LESSONS, ensure_ascii=False, indent=2)
footer = ";\n"

with open(output_path, "w", encoding="utf-8") as f:
    f.write(header + json_str + footer)

print(f"Successfully generated: {output_path} with {len(LESSONS)} complete lessons.")
