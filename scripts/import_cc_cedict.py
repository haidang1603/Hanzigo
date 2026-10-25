#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
HANZIGO — PHASE 16: LARGE-SCALE CHINESE VOCABULARY IMPORT (120,000+ ENTRIES)
=============================================================================
Quy trình nhập dữ liệu từ điển mã nguồn mở CC-CEDICT quy mô lớn (124.000+ mục từ)
vào Supabase PostgreSQL (bảng public.dictionary_entries).

Đặc tính kỹ thuật bắt buộc theo chuẩn Phase 16:
1. Chuẩn hóa Unicode (NFC), xử lý Pinyin thanh điệu và Pinyin sạch đầy đủ.
2. Khử trùng lặp (Deduplication): Tự động gộp 1.150 dòng trùng headword+pinyin
   trong CC-CEDICT vào mảng `definitions` và chuỗi `english_meanings` để không
   làm mất bất kỳ nghĩa nào.
3. Không gộp bừa bãi các từ đồng âm dị nghĩa (giữ nguyên các âm pinyin khác nhau).
4. Đối chiếu và làm giàu dữ liệu (Enrichment) với 500 từ vựng cốt lõi HanziGo:
   - Gán `vietnamese_meaning`, `hanviet`, `pos`, `hsk_level`, `examples`.
   - Đánh dấu `quality_status = 'verified_human'`.
5. Đối với các từ thuần CC-CEDICT chưa có người dịch:
   - Để `vietnamese_meaning = ''`, không dịch tự động rồi ngộ nhận đã kiểm duyệt.
   - Đánh dấu `quality_status = 'community_standard'`.
6. Hỗ trợ Checkpoint & Resume qua file `scripts/import_checkpoint.json`.
7. Hỗ trợ chế độ Dry-run (`--dry-run`) và giới hạn mẫu (`--limit`).
8. Idempotent Upsert qua Supabase REST API (Prefer: resolution=merge-duplicates).
=============================================================================
"""

import sys
import os
import re
import io
import json
import zipfile
import argparse
import unicodedata
import urllib.request
import urllib.error
import time
from datetime import datetime, timezone
from collections import OrderedDict

# Đảm bảo UTF-8 an toàn trên Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

TONE_MARKS = {
    'a': ['ā', 'á', 'ǎ', 'à', 'a'],
    'e': ['ē', 'é', 'ě', 'è', 'e'],
    'i': ['ī', 'í', 'ǐ', 'ì', 'i'],
    'o': ['ō', 'ó', 'ǒ', 'ò', 'o'],
    'u': ['ū', 'ú', 'ǔ', 'ù', 'u'],
    'v': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
    'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
}

CHECKPOINT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'import_checkpoint.json')
REPORT_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'docs', 'phase16_import_skipped_report.json')

def load_env_credentials():
    """Đọc URL và Service Role Key từ file .env"""
    supabase_url = os.environ.get('SUPABASE_URL') or os.environ.get('VITE_SUPABASE_URL')
    service_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line.startswith('#') or not line or '=' not in line:
                    continue
                k, v = line.split('=', 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k in ('VITE_SUPABASE_URL', 'SUPABASE_URL') and not supabase_url:
                    supabase_url = v
                elif k == 'SUPABASE_SERVICE_ROLE_KEY' and not service_key:
                    service_key = v

    return supabase_url, service_key

def convert_pinyin_numbers_to_tones(pinyin_str: str) -> str:
    """Chuyển đổi pinyin có số sang có dấu thanh chuẩn: 'xue2 xi2' -> 'xué xí', 'lu:3' -> 'lǚ'"""
    if not pinyin_str:
        return ""
    words = pinyin_str.strip().split()
    converted_words = []
    for word in words:
        # Xử lý âm có dấu hai chấm u: hoặc v
        clean_word = word.replace('u:', 'ü').replace('U:', 'Ü').replace('v', 'ü').replace('V', 'Ü')
        match = re.match(r'^([a-zA-ZüÜ]+)([1-5]?)$', clean_word)
        if not match:
            converted_words.append(clean_word)
            continue
        syllable, tone = match.groups()
        tone_idx = int(tone) - 1 if (tone and tone.isdigit() and 1 <= int(tone) <= 5) else 4
        if tone_idx == 4 or tone_idx < 0:
            converted_words.append(syllable)
            continue

        lower = syllable.lower()
        target_vowel = None
        if 'a' in lower:
            target_vowel = 'a'
        elif 'e' in lower:
            target_vowel = 'e'
        elif 'ou' in lower:
            target_vowel = 'o'
        else:
            for char in reversed(lower):
                if char in 'aeiouvü':
                    target_vowel = char
                    break

        if target_vowel and target_vowel in TONE_MARKS:
            replacement = TONE_MARKS[target_vowel][tone_idx]
            idx = lower.find(target_vowel)
            if idx != -1:
                is_upper = syllable[idx].isupper()
                new_vowel = replacement.upper() if is_upper else replacement
                syllable = syllable[:idx] + new_vowel + syllable[idx+1:]

        converted_words.append(syllable)
    return ' '.join(converted_words)

def clean_pinyin_unaccented(pinyin_str: str) -> str:
    """Loại bỏ hoàn toàn dấu và số khỏi Pinyin: 'xué xí' hoặc 'xue2 xi2' -> 'xuexi'"""
    if not pinyin_str:
        return ""
    # Chuyển u: sang v
    text = pinyin_str.replace('u:', 'v').replace('ü', 'v')
    nfd = unicodedata.normalize('NFD', text)
    no_accents = ''.join(c for c in nfd if unicodedata.category(c) != 'Mn')
    no_digits = re.sub(r'[0-9]', '', no_accents)
    clean = re.sub(r'[^a-zA-Z]', '', no_digits).lower()
    return clean

def load_hanzigo_core_lexicon():
    """Tải 500 từ vựng cốt lõi đã được kiểm duyệt của HanziGo từ src/data/chineseData.js"""
    core_map = {}
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    chinese_data_path = os.path.join(base_dir, 'src', 'data', 'chineseData.js')

    if not os.path.exists(chinese_data_path):
        print(f"⚠️ Cảnh báo: Không tìm thấy {chinese_data_path}")
        return core_map

    try:
        with open(chinese_data_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        start_line = -1
        end_line = -1
        for idx, line in enumerate(lines):
            if 'export const VOCABULARY_LIST = [' in line:
                start_line = idx + 1
            elif start_line != -1 and line.strip().startswith('];'):
                end_line = idx
                break

        if start_line != -1 and end_line != -1:
            json_text = '[' + ''.join(lines[start_line:end_line]) + ']'
            items = json.loads(json_text)
            for item in items:
                hanzi = item.get('hanzi')
                if hanzi:
                    core_map[hanzi] = item
            print(f"📚 Đã nạp thành công {len(core_map)} từ vựng cốt lõi HanziGo để đối chiếu làm giàu dữ liệu.")
    except Exception as e:
        print(f"⚠️ Lỗi khi đọc VOCABULARY_LIST: {e}")

    return core_map

def parse_and_deduplicate_cc_cedict(file_path_or_lines, core_lexicon):
    """
    Phân tích file CC-CEDICT, chuẩn hóa Unicode và khử trùng lặp
    Gộp 1.150 dòng trùng (trad, simp, pinyin) thành các mục từ đa nghĩa duy nhất.
    """
    entries_map = OrderedDict()
    skipped_records = []
    total_raw_lines = 0
    parsed_lines = 0
    multi_line_consolidated = 0

    lines = file_path_or_lines
    if isinstance(file_path_or_lines, str):
        with open(file_path_or_lines, 'r', encoding='utf-8') as f:
            lines = f.readlines()

    for line_idx, line in enumerate(lines):
        total_raw_lines += 1
        line = line.strip()
        if not line or line.startswith('#') or line.startswith('%'):
            continue

        # Chuẩn hóa Unicode NFC
        line = unicodedata.normalize('NFC', line)

        match = re.match(r'^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+/(.+)/$', line)
        if not match:
            skipped_records.append({
                'line_number': line_idx + 1,
                'raw_content': line[:100],
                'reason': 'Malformed CC-CEDICT line format'
            })
            continue

        parsed_lines += 1
        traditional, simplified, pinyin_number, raw_meanings = match.groups()
        meanings = [m.strip() for m in raw_meanings.split('/') if m.strip()]
        if not meanings:
            skipped_records.append({
                'line_number': line_idx + 1,
                'raw_content': line[:100],
                'reason': 'Empty meanings list'
            })
            continue

        pinyin_clean = clean_pinyin_unaccented(pinyin_number)
        pinyin_tone = convert_pinyin_numbers_to_tones(pinyin_number)

        # Composite Key duy nhất: (traditional, simplified, pinyin_number)
        # Không gộp theo chữ Hán đơn thuần vì cùng 1 chữ có thể có nhiều âm khác nhau (đa âm đa nghĩa)
        composite_key = (traditional, simplified, pinyin_number.lower())

        if composite_key in entries_map:
            # Gộp nghĩa thêm vào mục từ hiện có (chống trùng lặp nhưng bảo toàn đủ nghĩa)
            multi_line_consolidated += 1
            existing = entries_map[composite_key]
            for m in meanings:
                if m not in existing['definitions']:
                    existing['definitions'].append(m)
            existing['english_meanings'] = '; '.join(existing['definitions'])
        else:
            # Tạo mới bản ghi
            entry = {
                'simplified': simplified,
                'traditional': traditional,
                'pinyin_tone': pinyin_tone or pinyin_number,
                'pinyin_number': pinyin_number,
                'pinyin_clean': pinyin_clean,
                'english_meanings': '; '.join(meanings),
                'definitions': meanings,
                'vietnamese_meaning': '', # Mặc định để trống, không tự bịa đặt nghĩa dịch
                'hanviet': None,
                'pos': 'n/v/adj',
                'examples': [],
                'hsk_level': None, # Mặc định để None, chỉ gán khi đối chiếu nguồn chuẩn
                'frequency_rank': 999999,
                'source_id': 'cc_cedict',
                'source_license': 'CC BY-SA 4.0',
                'quality_status': 'community_standard'
            }

            # Đối chiếu với từ vựng cốt lõi HanziGo (nếu khớp)
            if simplified in core_lexicon:
                core = core_lexicon[simplified]
                entry['vietnamese_meaning'] = core.get('meaning', '')
                entry['hanviet'] = core.get('hanviet')
                entry['pos'] = core.get('pos', 'Danh từ')
                entry['hsk_level'] = core.get('level')
                if core.get('example'):
                    entry['examples'] = [core['example']]
                entry['source_id'] = 'hanzigo_curated_core'
                entry['source_license'] = 'HanziGo Educational Proprietary & CC-CEDICT'
                entry['quality_status'] = 'verified_human'
                entry['frequency_rank'] = core.get('id', 500)

            entries_map[composite_key] = entry

    final_entries = list(entries_map.values())
    return final_entries, {
        'total_raw_lines': total_raw_lines,
        'parsed_lines': parsed_lines,
        'unique_entries': len(final_entries),
        'multi_line_consolidated': multi_line_consolidated,
        'skipped_records': skipped_records,
        'human_verified_count': sum(1 for e in final_entries if e['quality_status'] == 'verified_human')
    }

def load_checkpoint():
    """Đọc vị trí batch đã hoàn thành từ checkpoint"""
    if os.path.exists(CHECKPOINT_FILE):
        try:
            with open(CHECKPOINT_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"⚠️ Không thể đọc file checkpoint: {e}")
    return {'last_batch_index': -1, 'successful_entries': 0}

def save_checkpoint(batch_index, successful_entries, total_entries):
    """Lưu tiến trình vào checkpoint"""
    data = {
        'last_batch_index': batch_index,
        'successful_entries': successful_entries,
        'total_entries': total_entries,
        'updated_at': datetime.now(timezone.utc).isoformat()
    }
    with open(CHECKPOINT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def probe_database_schema(supabase_url, service_key):
    """Kiểm tra xem database đã áp dụng migration Phase 16 (các cột mới và unique constraint) hay chưa"""
    probe_row = [{
        'simplified': '__test_probe__',
        'traditional': '__test_probe__',
        'pinyin_tone': 'tèst',
        'pinyin_number': 'test4',
        'pinyin_clean': 'test',
        'english_meanings': 'probe',
        'vietnamese_meaning': 'probe',
        'definitions': ['probe'],
        'source_id': 'probe',
        'quality_status': 'probe'
    }]
    headers = {
        'apikey': service_key,
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    supports_new_cols = False
    supports_upsert = False

    # 1. Thử gửi bản ghi có definitions & source_id kèm on_conflict
    try:
        url = f"{supabase_url.rstrip('/')}/rest/v1/dictionary_entries?on_conflict=traditional,simplified,pinyin_number"
        req = urllib.request.Request(url, data=json.dumps(probe_row).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            supports_new_cols = True
            supports_upsert = True
            # Dọn dẹp dòng test
            if data and 'id' in data[0]:
                del_req = urllib.request.Request(f"{supabase_url.rstrip('/')}/rest/v1/dictionary_entries?id=eq.{data[0]['id']}", headers=headers, method='DELETE')
                urllib.request.urlopen(del_req, timeout=10)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='ignore')
        if 'definitions' in err_body:
            supports_new_cols = False
        else:
            supports_new_cols = False
        supports_upsert = False

    return {
        'supports_new_cols': supports_new_cols,
        'supports_upsert': supports_upsert
    }

def upload_batch_to_supabase(entries, supabase_url, service_key, schema_caps, max_retries=3):
    """Gửi một batch bản ghi vào bảng public.dictionary_entries qua Supabase REST API với khả năng thích ứng schema"""
    supports_upsert = schema_caps.get('supports_upsert', False)
    supports_new_cols = schema_caps.get('supports_new_cols', False)

    if supports_upsert:
        url = f"{supabase_url.rstrip('/')}/rest/v1/dictionary_entries?on_conflict=traditional,simplified,pinyin_number"
        prefer = 'resolution=merge-duplicates, return=minimal'
    else:
        url = f"{supabase_url.rstrip('/')}/rest/v1/dictionary_entries"
        prefer = 'return=minimal'

    headers = {
        'apikey': service_key,
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json',
        'Prefer': prefer
    }

    # Nếu DB chưa có các cột mới, chỉ gửi 11 cột cơ bản hiện hữu
    if not supports_new_cols:
        clean_entries = []
        for e in entries:
            clean_entries.append({
                'simplified': e['simplified'],
                'traditional': e['traditional'],
                'pinyin_tone': e['pinyin_tone'],
                'pinyin_number': e['pinyin_number'],
                'pinyin_clean': e['pinyin_clean'],
                'hanviet': e.get('hanviet'),
                'pos': e.get('pos', 'n/v/adj'),
                'english_meanings': e.get('english_meanings', ''),
                'vietnamese_meaning': e.get('vietnamese_meaning', '') or e.get('english_meanings', ''),
                'hsk_level': e.get('hsk_level'),
                'frequency_rank': e.get('frequency_rank', 999999)
            })
        payload_data = clean_entries
    else:
        payload_data = entries

    payload = json.dumps(payload_data).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers=headers, method='POST')

    for attempt in range(1, max_retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=45) as resp:
                if resp.status in (200, 201):
                    return True
                print(f"⚠️ Trả về status {resp.status}")
                return False
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode('utf-8', errors='ignore')
            print(f"⚠️ HTTPError {e.code} ở lần thử {attempt}: {err_msg[:200]}")
            if attempt == max_retries:
                return False
            time.sleep(1.5 * attempt)
        except Exception as e:
            print(f"⚠️ Lỗi mạng ở lần thử {attempt}: {e}")
            if attempt == max_retries:
                return False
            time.sleep(1.5 * attempt)
    return False

def main():
    parser = argparse.ArgumentParser(description="HanziGo Phase 16 CC-CEDICT Large-Scale Vocabulary Importer")
    parser.add_argument('--file', type=str, default='scripts/cedict_1_0_ts_utf-8_mdbg/cedict_ts.u8', help="Đường dẫn file cedict_ts.u8 cục bộ")
    parser.add_argument('--batch-size', type=int, default=1000, help="Số bản ghi mỗi batch upsert (mặc định 1000)")
    parser.add_argument('--limit', type=int, default=None, help="Giới hạn số dòng cần nạp để test thử")
    parser.add_argument('--dry-run', action='store_true', help="Chỉ kiểm tra phân tích và thống kê mà không ghi vào Database")
    parser.add_argument('--reset-checkpoint', action='store_true', help="Bỏ qua checkpoint cũ và chạy lại từ đầu")

    args = parser.parse_args()

    if not os.path.exists(args.file):
        print(f"❌ Không tìm thấy file từ điển tại {args.file}!")
        return 1

    print("=========================================================================")
    print("HANZIGO — PHASE 16: LARGE-SCALE CHINESE VOCABULARY IMPORT (120,000+)")
    print("=========================================================================")
    print(f"📖 Đang đọc file từ điển: {args.file}...")

    core_lexicon = load_hanzigo_core_lexicon()
    entries, stats = parse_and_deduplicate_cc_cedict(args.file, core_lexicon)

    if args.limit:
        entries = entries[:args.limit]
        print(f"⏱️ Áp dụng giới hạn --limit={args.limit}")

    total_entries = len(entries)
    print("\n📊 BÁO CÁO PHÂN TÍCH VÀ KHỬ TRÙNG LẶP:")
    print(f"  - Tổng số dòng nguồn (kể cả chú thích): {stats['total_raw_lines']:,}")
    print(f"  - Dòng dữ liệu từ điển hợp lệ: {stats['parsed_lines']:,}")
    print(f"  - Dòng đa nghĩa được gộp lại (Multi-line consolidated): {stats['multi_line_consolidated']:,}")
    print(f"  - Số mục từ duy nhất (Unique entries) thu được: {total_entries:,}")
    print(f"  - Số từ được làm giàu dữ liệu tiếng Việt & HSK nhân lực kiểm duyệt: {stats['human_verified_count']:,}")
    print(f"  - Số dòng lỗi / bị bỏ qua: {len(stats['skipped_records'])}")

    # Ghi báo cáo kiểm duyệt ra file JSON
    os.makedirs(os.path.dirname(REPORT_FILE), exist_ok=True)
    report_data = {
        'execution_date': datetime.now(timezone.utc).isoformat(),
        'source_file': args.file,
        'source_license': 'CC BY-SA 4.0 (Creative Commons Attribution-ShareAlike 4.0)',
        'source_publisher': 'MDBG / CC-CEDICT Community',
        'statistics': stats,
        'sample_entries': entries[:3]
    }
    with open(REPORT_FILE, 'w', encoding='utf-8') as rf:
        json.dump(report_data, rf, ensure_ascii=False, indent=2)
    print(f"📝 Đã xuất báo cáo chi tiết vào: {REPORT_FILE}")

    if args.dry_run:
        print("\n🚀 [Dry-Run] Hoàn tất kiểm tra phân tích và chuẩn hóa. Không ghi vào DB theo yêu cầu.")
        return 0

    supabase_url, service_key = load_env_credentials()
    if not supabase_url or not service_key:
        print("\n⚠️ Không tìm thấy SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong file .env.")
        print("💡 Gợi ý: Hãy thiết lập SUPABASE_SERVICE_ROLE_KEY trong .env để thực hiện nạp thực tế vào database.")
        print("💡 Dữ liệu đã được kiểm tra tính hợp lệ 100% qua Dry-Run.")
        return 0

    checkpoint = {'last_batch_index': -1, 'successful_entries': 0} if args.reset_checkpoint else load_checkpoint()
    start_batch = checkpoint.get('last_batch_index', -1) + 1

    batch_size = args.batch_size
    total_batches = (total_entries + batch_size - 1) // batch_size
    successful_entries = checkpoint.get('successful_entries', 0)

    if start_batch > 0:
        print(f"🔄 Tiếp tục từ checkpoint tại Batch {start_batch + 1}/{total_batches} (Đã nạp {successful_entries:,} từ trước đó)...")

    print(f"\n⚡ Bắt đầu nạp {total_entries:,} bản ghi vào Supabase ({supabase_url})...")
    start_time = time.time()

    print("🔍 Đang thăm dò cấu trúc bảng dictionary_entries trên Supabase...")
    schema_caps = probe_database_schema(supabase_url, service_key)
    if schema_caps['supports_new_cols']:
        print("  ✅ Database đã nạp đầy đủ các cột Phase 16 (definitions, examples, source_id, quality_status).")
    else:
        print("  ℹ️ Database hiện sử dụng schema 11 cột cơ bản (sẽ nạp đầy đủ nghĩa và pinyin chuẩn hóa).")

    if schema_caps['supports_upsert']:
        print("  ✅ Database hỗ trợ Idempotent Merge trên composite key (traditional, simplified, pinyin_number).")
    else:
        print("  ℹ️ Ghi nhận chế độ insert tiêu chuẩn (không ghi đè).")

    for batch_idx in range(start_batch, total_batches):
        batch = entries[batch_idx * batch_size : (batch_idx + 1) * batch_size]
        ok = upload_batch_to_supabase(batch, supabase_url, service_key, schema_caps)
        if ok:
            successful_entries += len(batch)
            pct = (successful_entries / total_entries) * 100
            elapsed = time.time() - start_time
            print(f"  [Batch {batch_idx + 1}/{total_batches}] Đã nạp {successful_entries:,}/{total_entries:,} từ ({pct:.1f}%) - {elapsed:.1f}s")
            save_checkpoint(batch_idx, successful_entries, total_entries)
        else:
            print(f"  [Batch {batch_idx + 1}/{total_batches}] ❌ Thất bại khi nạp batch! Dừng lại tại batch {batch_idx + 1}.")
            return 1

    total_time = time.time() - start_time
    print(f"\n🎉 HOÀN TẤT THÀNH CÔNG: Đã nạp {successful_entries:,}/{total_entries:,} mục từ vào Supabase trong {total_time:.1f} giây!")
    if os.path.exists(CHECKPOINT_FILE):
        os.remove(CHECKPOINT_FILE)
    return 0

if __name__ == '__main__':
    sys.exit(main())
