# -*- coding: utf-8 -*-
"""
Fix unquoted keys like hanzi:, pinyin:, meaning:, strokeOrderText:, mnemonic:, hint:
"""
import re
import glob

files = [
    "scripts/curriculum_module_1_3.py",
    "scripts/curriculum_module_1_4.py",
    "scripts/curriculum_level_2_part1.py",
    "scripts/curriculum_level_2_part2.py",
    "scripts/curriculum_level_2_part3.py",
    "scripts/curriculum_level_3_part1.py",
    "scripts/curriculum_level_3_part2.py",
    "scripts/curriculum_level_3_part3.py"
]

patterns = [
    (r'(?<=[{,\s])hanzi:', '"hanzi":'),
    (r'(?<=[{,\s])pinyin:', '"pinyin":'),
    (r'(?<=[{,\s])meaning:', '"meaning":'),
    (r'(?<=[{,\s])strokeOrderText:', '"strokeOrderText":'),
    (r'(?<=[{,\s])mnemonic:', '"mnemonic":'),
    (r'(?<=[{,\s])hint:', '"hint":'),
    (r'(?<=[{,\s])speaker:', '"speaker":'),
    (r'(?<=[{,\s])components:', '"components":'),
]

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    changed = False
    for pat, repl in patterns:
        new_content, count = re.subn(pat, repl, content)
        if count > 0:
            content = new_content
            changed = True
            print(f"Fixed {count} instances of {repl} in {file_path}")

    if changed:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

print("Key fixing completed!")
