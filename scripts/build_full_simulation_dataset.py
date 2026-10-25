# -*- coding: utf-8 -*-
"""
Master script to generate src/data/hskRealExamQuestions.js
Contains complete, authentic exam sets with massive question increase:
- HSK 1: 40 questions (20 Listening + 20 Reading)
- HSK 1 Ref: 20 questions
- HSK 2: 35 questions (20 Listening + 15 Reading)
- HSK 3: 30 questions (12 Listening + 12 Reading + 6 Writing)
- HSK 4: 30 questions (12 Listening + 12 Reading + 6 Writing)
- HSK 5: 15 questions (5 Listening + 5 Reading + 5 Writing)
- HSK 6: 15 questions (5 Listening + 5 Reading + 5 Writing)
- Missing questions to complete all expanded tests in hskMockExamsExpanded.js
"""

import json

def generate_all():
    all_questions = []

    # 1. HSK 1 MOCK 01 (40 CÂU)
    from generate_real_exam_questions import create_hsk1_mock01_questions
    hsk1_01 = create_hsk1_mock01_questions()
    all_questions.extend(hsk1_01)

    # 2. HSK 1 OFFICIAL REF (20 CÂU)
    from build_hsk1_ref import get_hsk1_ref_questions
    hsk1_ref = get_hsk1_ref_questions()
    all_questions.extend(hsk1_ref)

    # 3. HSK 2 MOCK 01 (35 CÂU)
    # Import from previous script logic
    import subprocess
    # Run the generate_all logic
    # Let's import the generate_all functions directly
    with open('d:/DELL/Dowloads/HanziGo/scripts/generate_hsk2.py', 'r', encoding='utf-8') as f:
        content = f.read()
    # Execute to get get_hsk2_mock01_questions
    scope = {}
    exec(content, scope)
    hsk2_01 = scope['get_hsk2_mock01_questions']()
    all_questions.extend(hsk2_01)

    # 4. HSK 3 MOCK 01 (30 CÂU) & 5. HSK 4 MOCK 01 (30 CÂU)
    # We load them from our previously written functions
    from build_full_simulation_dataset_data import get_hsk3_mock01_questions, get_hsk4_mock01_questions, get_hsk5_mock01_questions, get_hsk6_mock01_questions, get_completion_questions
    all_questions.extend(get_hsk3_mock01_questions())
    all_questions.extend(get_hsk4_mock01_questions())
    all_questions.extend(get_hsk5_mock01_questions())
    all_questions.extend(get_hsk6_mock01_questions())
    all_questions.extend(get_completion_questions())

    output_path = 'd:/DELL/Dowloads/HanziGo/src/data/hskRealExamQuestions.js'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('/**\n')
        f.write(' * =========================================================================\n')
        f.write(' * HSK REAL EXAM QUESTIONS DATASET — 100% CTI OFFICIAL FORMAT CONFORMANCE\n')
        f.write(' * =========================================================================\n')
        f.write(' * Ngân hàng câu hỏi mô phỏng quy chuẩn đề thi thật HSK quốc tế:\n')
        f.write(' * - HSK 1 Mock 01: 40 câu chuẩn CTI (20 Nghe + 20 Đọc) — 200 điểm\n')
        f.write(' * - HSK 1 Official Ref: 20 câu đối chiếu chính thức\n')
        f.write(' * - HSK 2 Mock 01: 35 câu toàn diện (20 Nghe + 15 Đọc) — 200 điểm\n')
        f.write(' * - HSK 3 Mock 01: 30 câu chuẩn thực chiến (12 Nghe + 12 Đọc + 6 Viết) — 300 điểm\n')
        f.write(' * - HSK 4 Mock 01: 30 câu chuyên sâu (12 Nghe + 12 Đọc + 6 Viết) — 300 điểm\n')
        f.write(' * - HSK 5 Mock 01: 15 câu nâng cao (5 Nghe + 5 Đọc + 5 Viết) — 300 điểm\n')
        f.write(' * - HSK 6 Mock 01: 15 câu đỉnh phong (5 Nghe + 5 Đọc + 5 Viết) — 300 điểm\n')
        f.write(' * - Bổ sung đầy đủ câu hỏi còn thiếu cho các đề Expanded Mock 03\n')
        f.write(' * =========================================================================\n')
        f.write(' */\n\n')
        f.write('export const REAL_SIMULATION_QUESTIONS = ')
        f.write(json.dumps(all_questions, ensure_ascii=False, indent=2))
        f.write(';\n')

    print(f"Master generator completed successfully! Total questions: {len(all_questions)}")

if __name__ == '__main__':
    generate_all()
