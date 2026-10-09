# -*- coding: utf-8 -*-
"""
Curriculum specifications for Level 1, Level 2, Level 3
Matches docs/HANZIGO_CHINESE_CURRICULUM.md v2.0
"""

# We build standard lesson objects
def create_lesson_obj(
    lid, ch_id, lvl_id, num, title, cn_title, subtitle, objective, prereq, criteria,
    duration, xp, tags, materials,
    l_topic, l_summary, l_audio,
    vocab, hanzi,
    g_title, g_formula, g_desc, g_examples, g_mistake,
    lis_dialogue, lis_audio, lis_q, lis_options, lis_correct, lis_exp,
    sp_prompt, sp_target, sp_pinyin, sp_meaning, sp_hint,
    wr_prompt, wr_words, wr_correct, wr_exp,
    quiz,
    ch_title, ch_desc, ch_phrase, ch_badge
):
    return {
        "id": lid,
        "chapterId": ch_id,
        "levelId": lvl_id,
        "lessonNumber": num,
        "title": title,
        "chineseTitle": cn_title,
        "subtitle": subtitle,
        "objective": objective,
        "prerequisite": prereq,
        "completionCriteria": criteria,
        "durationMinutes": duration,
        "xpReward": xp,
        "tags": tags,
        "relatedMaterialIds": materials,
        "step1_learn": {
            "topic": l_topic,
            "summary": l_summary,
            "audioDemoText": l_audio
        },
        "step2_vocabulary": vocab,
        "step3_hanzi": hanzi,
        "step4_grammar": {
            "title": g_title,
            "formula": g_formula,
            "explanation": g_desc,
            "examples": g_examples,
            "commonMistake": g_mistake
        },
        "step5_listening": {
            "dialogue": lis_dialogue,
            "audioText": lis_audio,
            "question": lis_q,
            "options": lis_options,
            "correctIndex": lis_correct,
            "explanation": lis_exp
        },
        "step6_speaking": {
            "prompt": sp_prompt,
            "targetSentence": sp_target,
            "targetPinyin": sp_pinyin,
            "targetMeaning": sp_meaning,
            "hint": sp_hint
        },
        "step7_writing": {
            "prompt": wr_prompt,
            "words": wr_words,
            "correctOrder": wr_correct,
            "explanation": wr_exp
        },
        "step8_quiz": quiz,
        "step9_challenge": {
            "title": ch_title,
            "taskDesc": ch_desc,
            "targetPhrase": ch_phrase,
            "xpReward": xp,
            "badge": ch_badge
        }
    }

print("Helper ready")
