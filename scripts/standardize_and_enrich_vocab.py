import json
import sys
from standardize_vocab_helper import to_traditional, get_pos, get_en

# Replacements for the 4 duplicate entries
FIXED_ENTRIES = {
    456: {
        "id": 456,
        "hanzi": "申请",
        "traditional": "申請",
        "pinyin": "shēnqǐng",
        "hanviet": "Thân thỉnh",
        "meaning": "Xin, nộp đơn xin (học bổng, việc làm)",
        "pos": "Động từ",
        "en": "to apply for / application",
        "level": "HSK 4",
        "topic": "Công việc",
        "radical": "申 (Thân)",
        "strokes": 16,
        "mnemonic": "Bày tỏ thỉnh cầu (申) bằng lời nói tha thiết xin phép (请).",
        "example": {
            "hanzi": "我正在申请中国政府奖学金。",
            "pinyin": "Wǒ zhèngzài shēnqǐng Zhōngguó zhèngfǔ jiǎngxuéjīn.",
            "meaning": "Tôi đang nộp đơn xin học bổng chính phủ Trung Quốc."
        },
        "source": "CC-CEDICT & HSK Standard"
    },
    464: {
        "id": 464,
        "hanzi": "考虑",
        "traditional": "考慮",
        "pinyin": "kǎolǜ",
        "hanviet": "Khảo lự",
        "meaning": "Cân nhắc, suy nghĩ, xem xét kỹ lưỡng",
        "pos": "Động từ",
        "en": "to consider / to ponder / to think over",
        "level": "HSK 4",
        "topic": "Tư duy",
        "radical": "耂(Lão)",
        "strokes": 17,
        "mnemonic": "Bậc trưởng thượng (耂) suy nghĩ lo toan chu toàn việc lớn (虑).",
        "example": {
            "hanzi": "请给我们一点儿时间认真考虑一下。",
            "pinyin": "Qǐng gěi wǒmen yìdiǎnr shíjiān rènzhēn kǎolǜ yíxià.",
            "meaning": "Xin cho chúng tôi một chút thời gian để cân nhắc kỹ lưỡng."
        },
        "source": "CC-CEDICT & HSK Standard"
    },
    467: {
        "id": 467,
        "hanzi": "放弃",
        "traditional": "放棄",
        "pinyin": "fàngqì",
        "hanviet": "Phóng khí",
        "meaning": "Từ bỏ, bỏ cuộc, buông xuôi",
        "pos": "Động từ",
        "en": "to give up / to abandon / to renounce",
        "level": "HSK 4",
        "topic": "Tính cách",
        "radical": "攵 (Phác)",
        "strokes": 12,
        "mnemonic": "Buông thả phóng thích (放) vứt bỏ không màng tới (弃).",
        "example": {
            "hanzi": "无论遇到什么困难，我们都绝不轻易放弃。",
            "pinyin": "Wúlùn yù dào shénme kùnnan, wǒmen dōu jué bù qīngyì fàngqì.",
            "meaning": "Dù gặp khó khăn gì, chúng tôi cũng tuyệt đối không từ bỏ."
        },
        "source": "CC-CEDICT & HSK Standard"
    },
    469: {
        "id": 469,
        "hanzi": "优秀",
        "traditional": "優秀",
        "pinyin": "yōuxiù",
        "hanviet": "Ưu tú",
        "meaning": "Ưu tú, xuất sắc, xuất chúng",
        "pos": "Tính từ",
        "en": "outstanding / excellent / splendid",
        "level": "HSK 4",
        "topic": "Tính cách",
        "radical": "亻 (Nhân đứng)",
        "strokes": 14,
        "mnemonic": "Người tài giỏi nổi bật (优) tựa bông lúa trổ đòng ngát hương (秀).",
        "example": {
            "hanzi": "李明是一位非常优秀的软件工程师。",
            "pinyin": "Lǐ Míng shì yí wèi fēicháng yōuxiù de ruǎnjiàn gōngchéngshī.",
            "meaning": "Lý Minh là một kỹ sư phần mềm vô cùng xuất sắc."
        },
        "source": "CC-CEDICT & HSK Standard"
    }
}

def main():
    target_path = r"d:\DELL\Dowloads\HanziGo\src\data\chineseData.js"
    with open(target_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find VOCABULARY_LIST array bounds
    start_marker = "export const VOCABULARY_LIST = ["
    end_marker = "export const TOPIC_FILTERS = ["

    if start_marker not in content or end_marker not in content:
        print("Markers not found in chineseData.js")
        sys.exit(1)

    parts_pre = content.split(start_marker)
    prefix = parts_pre[0] + start_marker

    parts_post = parts_pre[1].split(end_marker)
    vocab_raw = parts_post[0]
    suffix = end_marker + parts_post[1]

    last_bracket_idx = vocab_raw.rfind("];")
    if last_bracket_idx == -1:
        print("Closing bracket not found in vocab block")
        sys.exit(1)

    json_text = "[" + vocab_raw[:last_bracket_idx].strip() + "]"
    
    # Parse existing vocabulary
    try:
        vocab_list = json.loads(json_text)
    except Exception as e:
        print("JSON parse error:", e)
        # Try JS object parse using node if needed
        sys.exit(1)

    print(f"Loaded {len(vocab_list)} items from chineseData.js")

    seen_hanzi = set()
    duplicates_found = 0
    enriched_list = []

    for item in vocab_list:
        v_id = item["id"]

        # Check if this item is one of the 4 duplicates to be replaced
        if v_id in FIXED_ENTRIES:
            new_item = FIXED_ENTRIES[v_id]
            enriched_list.append(new_item)
            seen_hanzi.add(new_item["hanzi"])
            continue

        hanzi = item["hanzi"]
        if hanzi in seen_hanzi:
            print(f"Warning: Unexpected duplicate '{hanzi}' (id {v_id})")
            duplicates_found += 1
        seen_hanzi.add(hanzi)

        # Enrich with traditional, pos, en, source
        trad = item.get("traditional") or to_traditional(hanzi)
        pos = item.get("pos") or get_pos(hanzi, item.get("meaning", ""), item.get("hanviet", ""))
        en = item.get("en") or get_en(hanzi, item.get("meaning", ""))

        enriched_item = {
            "id": item["id"],
            "hanzi": item["hanzi"],
            "traditional": trad,
            "pinyin": item["pinyin"],
            "hanviet": item["hanviet"],
            "meaning": item["meaning"],
            "pos": pos,
            "en": en,
            "level": item.get("level", "HSK 1"),
            "topic": item.get("topic", "Đời sống"),
            "radical": item.get("radical", "—"),
            "strokes": item.get("strokes", 5),
            "mnemonic": item.get("mnemonic", ""),
            "example": item.get("example", {
                "hanzi": f"{hanzi}很好。",
                "pinyin": "",
                "meaning": ""
            }),
            "source": "CC-CEDICT & HSK Standard"
        }
        enriched_list.append(enriched_item)

    print(f"Enriched {len(enriched_list)} items.")
    print(f"Total unique hanzi: {len(seen_hanzi)}")
    if len(seen_hanzi) != 500:
        print(f"Error: expected 500 unique hanzi, got {len(seen_hanzi)}")
        sys.exit(1)

    # Format output JSON
    json_entries = ",\n".join(json.dumps(it, ensure_ascii=False, indent=2) for it in enriched_list)
    new_vocab_block = "\n" + json_entries + "\n];\n\n\n"

    new_content = prefix + new_vocab_block + suffix

    with open(target_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print("SUCCESS: Standardized all 500 vocabulary items with traditional, pos, en, source, and 0 duplicates!")

if __name__ == "__main__":
    main()
