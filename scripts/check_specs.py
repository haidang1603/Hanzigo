import re

with open('scripts/curriculum_specs_50.py', 'r', encoding='utf-8') as f:
    text = f.read()

ids = re.findall(r'"id":\s*"(l-\d+)"', text)
print(f"Total lesson IDs found in curriculum_specs_50.py: {len(ids)}")
print(ids)
