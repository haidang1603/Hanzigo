# -*- coding: utf-8 -*-
"""
Generate complete 60-lesson curriculum for HanziGo (Levels 1-3)
Aligned with docs/HANZIGO_CHINESE_CURRICULUM.md v2.0
"""
import json

# Master specs for all 60 lessons:
# (id_num, ch_num, lvl_num, lesson_num, title, cn_title, subtitle, objective, prereq, criteria, dur, xp, tags, mats,
#  vocab_tuples, hanzi_tuples, grammar_tuple, listen_tuple, speak_tuple, write_tuple, quiz_tuples, challenge_tuple)

from curriculum_data_specs import SPECS_L1, SPECS_L2, SPECS_L3

print("Loading specs...")
