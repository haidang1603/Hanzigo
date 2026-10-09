# Python generator for HanziGo Curriculum 60 Lessons
# Strictly follows docs/HANZIGO_CHINESE_CURRICULUM.md v2.0
import json

# We will construct all 60 lessons with authentic pedagogical steps
lessons = []

# Helper function
def make_lesson(
    lid, ch_id, lvl_id, num, title, cn_title, subtitle, objective, prereq, criteria,
    duration, xp, tags, materials,
    learn_topic, learn_summary, audio_demo,
    vocab_list, hanzi_list,
    grammar_title, grammar_formula, grammar_desc, grammar_examples, grammar_mistake,
    listen_dialogue, listen_audio, listen_q, listen_options, listen_correct, listen_exp,
    speak_prompt, speak_target, speak_pinyin, speak_meaning, speak_hint,
    write_prompt, write_words, write_correct, write_exp,
    quiz_list,
    challenge_title, challenge_desc, challenge_phrase, challenge_badge
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
            "topic": learn_topic,
            "summary": learn_summary,
            "audioDemoText": audio_demo
        },
        "step2_vocabulary": vocab_list,
        "step3_hanzi": hanzi_list,
        "step4_grammar": {
            "title": grammar_title,
            "formula": grammar_formula,
            "explanation": grammar_desc,
            "examples": grammar_examples,
            "commonMistake": grammar_mistake
        },
        "step5_listening": {
            "dialogue": listen_dialogue,
            "audioText": listen_audio,
            "question": listen_q,
            "options": listen_options,
            "correctIndex": listen_correct,
            "explanation": listen_exp
        },
        "step6_speaking": {
            "prompt": speak_prompt,
            "targetSentence": speak_target,
            "targetPinyin": speak_pinyin,
            "targetMeaning": speak_meaning,
            "hint": speak_hint
        },
        "step7_writing": {
            "prompt": write_prompt,
            "words": write_words,
            "correctOrder": write_correct,
            "explanation": write_exp
        },
        "step8_quiz": quiz_list,
        "step9_challenge": {
            "title": challenge_title,
            "taskDesc": challenge_desc,
            "targetPhrase": challenge_phrase,
            "xpReward": xp,
            "badge": challenge_badge
        }
    }

print("Generator helper defined successfully")
