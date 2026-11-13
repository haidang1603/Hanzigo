-- ============================================================================
-- MASTER SCHEMA RECONCILIATION & PRODUCTION SEED DATA: PHASE 27, 29 & 30
-- Đã chuẩn hóa tương thích 100% với các migration 20261112_* hiện có
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- 1. TASK 27.01: SMART CHINESE DICTIONARY (TỪ ĐIỂN ĐA PHƯƠNG THỨC & CHIẾT TỰ)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dictionary_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    simplified TEXT NOT NULL,
    traditional TEXT NOT NULL,
    pinyin_display TEXT NOT NULL,
    pinyin_numeric TEXT NOT NULL,
    pinyin_clean TEXT NOT NULL,
    han_viet TEXT NOT NULL,
    hsk_2_level SMALLINT CHECK (hsk_2_level BETWEEN 1 AND 6),
    hsk_3_level SMALLINT CHECK (hsk_3_level BETWEEN 1 AND 9),
    frequency_rank INT DEFAULT 5000,
    pos_meanings JSONB NOT NULL DEFAULT '[]'::jsonb,
    decomposition JSONB NOT NULL DEFAULT '{}'::jsonb,
    measure_words JSONB NOT NULL DEFAULT '[]'::jsonb,
    synonyms_antonyms JSONB NOT NULL DEFAULT '{}'::jsonb,
    examples JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Không tạo UNIQUE INDEX trên simplified vì từ điển CC-CEDICT có thể có nhiều mục đồng tự khác âm (vd: 霸)
CREATE INDEX IF NOT EXISTS idx_dict_entries_simplified ON public.dictionary_entries (simplified);
CREATE INDEX IF NOT EXISTS idx_dict_simplified_trgm ON public.dictionary_entries USING GIN (simplified gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_dict_pinyin_clean_trgm ON public.dictionary_entries USING GIN (pinyin_clean gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_dict_han_viet_trgm ON public.dictionary_entries USING GIN (han_viet gin_trgm_ops);

-- Nới lỏng ràng buộc NOT NULL trên các cột legacy (vd: pinyin_tone) nếu bảng dictionary_entries đã tồn tại từ trước
DO $$
DECLARE
    col_rec RECORD;
BEGIN
    FOR col_rec IN
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'dictionary_entries'
          AND is_nullable = 'NO'
          AND column_default IS NULL
          AND column_name NOT IN (
              'id', 'simplified', 'traditional', 'pinyin_display',
              'pinyin_numeric', 'pinyin_clean', 'han_viet',
              'pos_meanings', 'decomposition', 'measure_words',
              'synonyms_antonyms', 'examples', 'created_at', 'updated_at', 'source'
          )
    LOOP
        EXECUTE format('ALTER TABLE public.dictionary_entries ALTER COLUMN %I DROP NOT NULL', col_rec.column_name);
    END LOOP;
END $$;

WITH seed_dict (
    simplified, traditional, pinyin_display, pinyin_numeric, pinyin_clean, han_viet,
    hsk_2_level, hsk_3_level, frequency_rank, pos_meanings, decomposition, measure_words, synonyms_antonyms, examples
) AS (
VALUES
(
    '坚持', '堅持', 'jiān chí', 'jian1 chi2', 'jianchi', 'KIÊN TRÌ',
    4, 3, 620,
    '[
      {
        "pos": "v",
        "definitions_vi": ["kiên trì, bền bỉ theo đuổi đến cùng", "giữ vững (nguyên tắc, lập trường)"],
        "definitions_en": ["to persevere in", "to insist on"],
        "collocations": [
          {"word": "坚持到底", "pinyin": "jiānchí dàodǐ", "meaning_vi": "kiên trì đến cùng"},
          {"word": "坚持原则", "pinyin": "jiānchí yuánzé", "meaning_vi": "giữ vững nguyên tắc"},
          {"word": "坚持锻炼", "pinyin": "jiānchí duànliàn", "meaning_vi": "kiên trì rèn luyện"}
        ]
      }
    ]'::jsonb,
    '{
      "radical": "土 (Thổ) / 扌 (Thủ)",
      "stroke_count": 16,
      "structure_type": "Thượng hạ (坚) + Tả hữu (持)",
      "components": [
        {"char": "坚", "pinyin": "jiān", "meaning_vi": "cứng rắn, vững chắc (bộ Thổ ở dưới)"},
        {"char": "持", "pinyin": "chí", "meaning_vi": "nắm giữ, duy trì (bộ Thủ 扌 + chữ Tự 寺)"}
      ],
      "mnemonic_vi": "Đứng vững trên mặt đất (坚 - Thổ) và dùng bàn tay nắm giữ không buông (持 - Thủ) chính là sự kiên trì."
    }'::jsonb,
    '[]'::jsonb,
    '{
      "synonyms": [{"word": "坚守", "diff_note_vi": "坚守 nhấn mạnh việc giữ chặt vị trí/cương vị không rời bỏ, còn 坚持 dùng rộng cho hành động và thói quen."}],
      "antonyms": ["放弃 (từ bỏ)", "半途而废 (bỏ cuộc giữa chừng)"]
    }'::jsonb,
    '[
      {"hanzi": "只要坚持下去，你的汉语水平一定会提高。", "pinyin": "Zhǐyào jiānchí xiàqù, nǐ de Hànyǔ shuǐpíng yídìng huì tígāo.", "vi": "Chỉ cần kiên trì tiếp tục, trình độ tiếng Trung của bạn nhất định sẽ nâng cao.", "hsk_level": 4},
      {"hanzi": "他每天都坚持写五十个汉字。", "pinyin": "Tā měitiān dōu jiānchí xiě wǔshí gè Hànzì.", "vi": "Anh ấy mỗi ngày đều kiên trì viết 50 chữ Hán.", "hsk_level": 3}
    ]'::jsonb
),
(
    '整理', '整理', 'zhěng lǐ', 'zheng3 li3', 'zhengli', 'CHỈNH LÝ',
    4, 3, 890,
    '[
      {
        "pos": "v",
        "definitions_vi": ["sắp xếp, dọn dẹp gọn gàng", "thu thập và hệ thống hóa (tài liệu, số liệu)"],
        "definitions_en": ["to arrange", "to tidy up", "to sort out"],
        "collocations": [
          {"word": "整理房间", "pinyin": "zhěnglǐ fángjiān", "meaning_vi": "dọn dẹp phòng ốc"},
          {"word": "整理资料", "pinyin": "zhěnglǐ zīliào", "meaning_vi": "hệ thống hóa tài liệu"},
          {"word": "整理行李", "pinyin": "zhěnglǐ xíngli", "meaning_vi": "sắp xếp hành lý"}
        ]
      }
    ]'::jsonb,
    '{
      "radical": "攵 (Phộc) & 王/玉 (Ngọc)",
      "stroke_count": 27,
      "structure_type": "Thượng hạ (整) + Tả hữu (理)",
      "components": [
        {"char": "整", "pinyin": "zhěng", "meaning_vi": "ngay ngắn, chỉnh tề (束 + 攵 + 正)"},
        {"char": "理", "pinyin": "lǐ", "meaning_vi": "chế tác ngọc, sắp xếp theo trật tự (王 + 里)"}
      ],
      "mnemonic_vi": "Xếp mọi thứ ngay ngắn (正) thành từng bó (束) và mài giũa như ngọc (理) là sắp xếp, chỉnh lý."
    }'::jsonb,
    '[]'::jsonb,
    '{
      "synonyms": [{"word": "收拾", "diff_note_vi": "收拾 thiên về khẩu ngữ (dọn đồ đạc, thu dọn), còn 整理 dùng được cả cho văn bản, tư liệu, suy nghĩ."}],
      "antonyms": ["弄乱 (làm bừa bộn)"]
    }'::jsonb,
    '[
      {"hanzi": "请把办公桌上的文件整理一下。", "pinyin": "Qǐng bǎ bàngōngzhuō shàng de wénjiàn zhěnglǐ yíxià.", "vi": "Hãy sắp xếp lại tài liệu trên bàn làm việc một chút.", "hsk_level": 4}
    ]'::jsonb
),
(
    '影响', '影響', 'yǐng xiǎng', 'ying3 xiang3', 'yingxiang', 'ẢNH HƯỞNG',
    3, 3, 310,
    '[
      {
        "pos": "v",
        "definitions_vi": ["ảnh hưởng, tác động đến"],
        "definitions_en": ["to influence", "to affect"],
        "collocations": [
          {"word": "影响健康", "pinyin": "yǐngxiǎng jiànkāng", "meaning_vi": "ảnh hưởng đến sức khỏe"},
          {"word": "受……影响", "pinyin": "shòu... yǐngxiǎng", "meaning_vi": "chịu ảnh hưởng của..."}
        ]
      },
      {
        "pos": "n",
        "definitions_vi": ["sự ảnh hưởng, tầm ảnh hưởng"],
        "definitions_en": ["influence", "impact"],
        "collocations": [
          {"word": "产生影响", "pinyin": "chǎnshēng yǐngxiǎng", "meaning_vi": "tạo ra ảnh hưởng"},
          {"word": "对……有影响", "pinyin": "duì... yǒu yǐngxiǎng", "meaning_vi": "có ảnh hưởng đối với..."}
        ]
      }
    ]'::jsonb,
    '{
      "radical": "彡 (Sam) & 口 (Khẩu)",
      "stroke_count": 24,
      "structure_type": "Tả hữu",
      "components": [
        {"char": "影", "pinyin": "yǐng", "meaning_vi": "cái bóng của ánh sáng (景 + 彡)"},
        {"char": "响", "pinyin": "xiǎng", "meaning_vi": "âm thanh vang vọng lại (口 + 向)"}
      ],
      "mnemonic_vi": "Như hình với bóng (影) và như tiếng vang vọng lại (响) chính là sự ảnh hưởng."
    }'::jsonb,
    '[{"simplified": "种", "pinyin": "zhǒng", "usage_note": "一种影响 (một loại ảnh hưởng)"}]'::jsonb,
    '{"synonyms": [], "antonyms": []}'::jsonb,
    '[
      {"hanzi": "环境对一个人的性格有很大的影响。", "pinyin": "Huánjìng duì yí gè rén de xìnggé yǒu hěn dà de yǐngxiǎng.", "vi": "Môi trường có ảnh hưởng rất lớn đối với tính cách của một con người.", "hsk_level": 4}
    ]'::jsonb
),
(
    '请教', '請教', 'qǐng jiào', 'qing3 jiao4', 'qingjiao', 'THỈNH GIÁO',
    5, 4, 1450,
    '[
      {
        "pos": "v",
        "definitions_vi": ["thỉnh giáo, xin chỉ bảo, hỏi ý kiến một cách khiêm tốn"],
        "definitions_en": ["to consult", "to ask for advice"],
        "collocations": [
          {"word": "向老师请教", "pinyin": "xiàng lǎoshī qǐngjiào", "meaning_vi": "xin thầy cô chỉ bảo"},
          {"word": "请教一个问题", "pinyin": "qǐngjiào yí gè wèntí", "meaning_vi": "thỉnh giáo một câu hỏi"}
        ]
      }
    ]'::jsonb,
    '{
      "radical": "讠 (Ngôn) & 攵 (Phộc)",
      "stroke_count": 21,
      "structure_type": "Tả hữu",
      "components": [
        {"char": "请", "pinyin": "qǐng", "meaning_vi": "thỉnh cầu, xin phép (讠 + 青)"},
        {"char": "教", "pinyin": "jiào", "meaning_vi": "chỉ dạy, dạy bảo (孝 + 攵)"}
      ],
      "mnemonic_vi": "Dùng lời nói lễ phép (请) để mong người khác chỉ dạy (教) cho mình."
    }'::jsonb,
    '[]'::jsonb,
    '{"synonyms": [{"word": "咨询", "diff_note_vi": "咨询 dùng cho tư vấn dịch vụ/chuyên môn chính thức, còn 请教 mang sắc thái kính trọng cá nhân người có kinh nghiệm."}], "antonyms": []}'::jsonb,
    '[
      {"hanzi": "遇到不懂的技术问题，他总是虚心向同事请教。", "pinyin": "Yùdào bù dǒng de jìshù wèntí, tā zǒngshì xūxīn xiàng tóngshì qǐngjiào.", "vi": "Gặp vấn đề kỹ thuật không hiểu, anh ấy luôn khiêm tốn học hỏi đồng nghiệp.", "hsk_level": 5}
    ]'::jsonb
),
(
    '倾盆大雨', '傾盆大雨', 'qīng pén dà yǔ', 'qing1 pen2 da4 yu3', 'qingpendayu', 'KHUYNH BỒN ĐẠI VŨ',
    6, 6, 3800,
    '[
      {
        "pos": "idiom",
        "definitions_vi": ["mưa như trút nước, mưa tầm tã"],
        "definitions_en": ["torrential rain", "downpour"],
        "collocations": [
          {"word": "下起倾盆大雨", "pinyin": "xià qǐ qīngpéndàyǔ", "meaning_vi": "đổ cơn mưa như trút nước"}
        ]
      }
    ]'::jsonb,
    '{
      "radical": "亻 (Nhân) & 雨 (Vũ)",
      "stroke_count": 32,
      "structure_type": "Thành ngữ 4 chữ (四字成语)",
      "components": [
        {"char": "倾", "pinyin": "qīng", "meaning_vi": "nghiêng đổ, dốc hết"},
        {"char": "盆", "pinyin": "pén", "meaning_vi": "cái chậu"}
      ],
      "mnemonic_vi": "Mưa lớn giống như ai đó nghiêng cả chậu nước (倾盆) đổ từ trên trời xuống."
    }'::jsonb,
    '[{"simplified": "场", "pinyin": "chǎng", "usage_note": "一场倾盆大雨 (một trận mưa như trút nước)"}]'::jsonb,
    '{"synonyms": [{"word": "滂沱大雨", "diff_note_vi": "Đồng nghĩa, đều miêu tả mưa cực lớn."}], "antonyms": ["毛毛雨 (mưa phùn)"]}'::jsonb,
    '[
      {"hanzi": "外面突然下起了倾盆大雨，我们只好留在旅馆里。", "pinyin": "Wàimiàn tūrán xià qǐ le qīngpéndàyǔ, wǒmen zhǐhǎo liú zài lǚguǎn lǐ.", "vi": "Bên ngoài đột nhiên đổ mưa như trút nước, chúng tôi đành phải ở lại trong khách sạn.", "hsk_level": 6}
    ]'::jsonb
)
),
updated_dict AS (
    UPDATE public.dictionary_entries d
    SET
        pos_meanings = s.pos_meanings,
        decomposition = s.decomposition,
        examples = s.examples
    FROM seed_dict s
    WHERE d.simplified = s.simplified AND d.pinyin_numeric = s.pinyin_numeric
    RETURNING d.simplified
)
INSERT INTO public.dictionary_entries (
    simplified, traditional, pinyin_display, pinyin_numeric, pinyin_clean, han_viet,
    hsk_2_level, hsk_3_level, frequency_rank, pos_meanings, decomposition, measure_words, synonyms_antonyms, examples
)
SELECT
    s.simplified, s.traditional, s.pinyin_display, s.pinyin_numeric, s.pinyin_clean, s.han_viet,
    s.hsk_2_level, s.hsk_3_level, s.frequency_rank, s.pos_meanings, s.decomposition, s.measure_words, s.synonyms_antonyms, s.examples
FROM seed_dict s
WHERE NOT EXISTS (
    SELECT 1 FROM public.dictionary_entries d
    WHERE d.simplified = s.simplified AND d.pinyin_numeric = s.pinyin_numeric
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'dictionary_entries' AND column_name = 'pinyin_tone'
    ) THEN
        EXECUTE 'UPDATE public.dictionary_entries SET pinyin_tone = pinyin_display WHERE pinyin_tone IS NULL AND pinyin_display IS NOT NULL';
    END IF;
END $$;


-- ============================================================================
-- 2. TASK 27.02: CHINESE GRAMMAR EXPLORER (NGỮ PHÁP HSK & BẮT LỖI)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.grammar_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    title_vi TEXT NOT NULL,
    pattern_display TEXT NOT NULL,
    hsk_level SMALLINT NOT NULL CHECK (hsk_level BETWEEN 1 AND 9),
    category TEXT NOT NULL,
    formula_tokens JSONB NOT NULL DEFAULT '[]'::jsonb,
    explanation_vi TEXT NOT NULL,
    pragmatic_nuance TEXT,
    common_mistakes JSONB NOT NULL DEFAULT '[]'::jsonb,
    confusion_matrix JSONB NOT NULL DEFAULT '[]'::jsonb,
    examples JSONB NOT NULL DEFAULT '[]'::jsonb,
    mini_quizzes JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.grammar_points (
    code, title_vi, pattern_display, hsk_level, category,
    formula_tokens, explanation_vi, pragmatic_nuance, common_mistakes, confusion_matrix, examples, mini_quizzes
) VALUES
(
    'HSK3-BA-01',
    'Câu chữ 把 (Đưa tân ngữ lên trước động từ để xử lý/tác động)',
    'S + 把 + O + V + Thành phần khác',
    3,
    'Câu đặc biệt (特殊句式)',
    '[
      {"role": "S", "label_zh": "主语", "label_vi": "Chủ ngữ"},
      {"role": "Keyword", "label_zh": "把", "label_vi": "Giới từ 把"},
      {"role": "O", "label_zh": "宾语 (已知/特定)", "label_vi": "Tân ngữ xác định"},
      {"role": "V", "label_zh": "动作动词", "label_vi": "Động từ tác động"},
      {"role": "Complement", "label_zh": "结果/趋向/处所", "label_vi": "Bổ ngữ / 了 / Lặp lại V"}
    ]'::jsonb,
    'Câu chữ **把** dùng để nhấn mạnh sự tác động của chủ ngữ làm cho tân ngữ thay đổi vị trí, trạng thái hoặc có kết quả rõ rệt. Động từ trong câu chữ 把 **không bao giờ được đứng trơ trọi một mình** mà bắt buộc phải có thành phần đi kèm phía sau (như 了, bổ ngữ kết quả, bổ ngữ xu hướng, hoặc lặp lại động từ).',
    'Rất phổ biến trong cả giao tiếp hàng ngày lẫn văn viết. Khi muốn yêu cầu ai xử lý một vật xác định, người bản xứ luôn ưu tiên dùng câu chữ 把.',
    '[
      {
        "wrong_zh": "❌ 我把那本书看。",
        "right_zh": "✅ 我把那本书看完了。",
        "pinyin": "Wǒ bǎ nà běn shū kàn wán le.",
        "meaning_vi": "Tôi đọc xong cuốn sách đó rồi.",
        "reason_vi": "Động từ 看 không được đứng một mình ở cuối câu chữ 把 mà phải có bổ ngữ kết quả 完 + 了."
      },
      {
        "wrong_zh": "❌ 他把那件事没告诉我。",
        "right_zh": "✅ 他没把那件事告诉我。",
        "pinyin": "Tā méi bǎ nà jiàn shì gàosu wǒ.",
        "meaning_vi": "Anh ấy đã không nói chuyện đó cho tôi biết.",
        "reason_vi": "Phó từ phủ định (不, 没) và động từ năng nguyện (想, 要, 能, 应该) bắt buộc phải đặt TRƯỚC chữ 把."
      }
    ]'::jsonb,
    '[]'::jsonb,
    '[
      {"hanzi": "请把那本菜单拿过来。", "pinyin": "Qǐng bǎ nà běn càidān ná guòlái.", "vi": "Xin hãy mang quyển thực đơn kia lại đây.", "token_highlights": [1, 4, 5]},
      {"hanzi": "妹妹把房间整理得非常干净。", "pinyin": "Mèimei bǎ fángjiān zhěnglǐ de fēicháng gānjìng.", "vi": "Em gái dọn dẹp căn phòng vô cùng sạch sẽ.", "token_highlights": [1, 3, 4]}
    ]'::jsonb,
    '[
      {
        "quiz_type": "reorder",
        "prompt_vi": "Sắp xếp các từ sau thành câu chữ 把 đúng:",
        "tokens": ["把", "我", "已经", "发给你了", "资料"],
        "correct_sentence": "我已经把资料发给你了。",
        "explanation_vi": "Phó từ 已经 đứng trước 把 + Tân ngữ (资料) + Động từ kèm bổ ngữ (发给你了)."
      }
    ]'::jsonb
),
(
    'HSK4-CONJ-BUJIN',
    'Cấu trúc tăng tiến: Không những... mà còn... (不仅……而且/还……)',
    '不仅 + Vế 1 ，而且 / 还 + Vế 2',
    4,
    'Liên từ & Câu ghép (复句)',
    '[
      {"role": "Keyword", "label_zh": "不仅 / 不但", "label_vi": "Không những"},
      {"role": "V", "label_zh": "分句 1", "label_vi": "Mệnh đề 1 (Mức độ cơ bản)"},
      {"role": "Keyword", "label_zh": "而且 / 还 / 也", "label_vi": "Mà còn"},
      {"role": "Complement", "label_zh": "分句 2", "label_vi": "Mệnh đề 2 (Mức độ sâu hơn)"}
    ]'::jsonb,
    'Biểu thị quan hệ tăng tiến. **Quy tắc vị trí Chủ ngữ cực kỳ quan trọng:**\n1. Nếu 2 vế có **cùng 1 chủ ngữ**: Chủ ngữ đặt **trước** 不仅.\n2. Nếu 2 vế có **2 chủ ngữ khác nhau**: Chủ ngữ 1 phải đặt **sau** 不仅.',
    'Dùng rộng rãi trong bài thi Đọc phần 2 (Sắp xếp A-B-C) và Viết của HSK 4, HSK 5.',
    '[
      {
        "wrong_zh": "❌ 不仅他会说英语，而且还会说汉语。",
        "right_zh": "✅ 他不仅会说英语，而且还会说汉语。",
        "pinyin": "Tā bùjǐn huì shuō Yīngyǔ, érqiě hái huì shuō Hànyǔ.",
        "meaning_vi": "Anh ấy không những biết nói tiếng Anh mà còn biết nói tiếng Trung.",
        "reason_vi": "Vì cả hai vế đều nói về cùng một chủ ngữ là 他, nên 他 phải đứng trước 不仅."
      }
    ]'::jsonb,
    '[]'::jsonb,
    '[
      {"hanzi": "适当的运动不仅对身体健康有好处，还能让人心情变得愉快。", "pinyin": "Shìdàng de yùndòng bùjǐn duì shēntǐ jiànkāng yǒu hǎochù, hái néng ràng rén xīnqíng biàn de yúkuài.", "vi": "Vận động hợp lý không những có lợi cho sức khỏe mà còn giúp tâm trạng vui vẻ.", "token_highlights": [2, 8]}
    ]'::jsonb,
    '[
      {
        "quiz_type": "multiple_choice",
        "prompt_vi": "Chọn câu đúng ngữ pháp:",
        "options": [
          "A. 不仅这件衣服漂亮，而且很便宜。",
          "B. 这件衣服不仅漂亮，而且很便宜。",
          "C. 这件衣服漂亮不仅，而且很便宜。"
        ],
        "correct_option": "B",
        "explanation_vi": "Cùng một chủ ngữ (这件衣服) nên chủ ngữ phải đặt trước 不仅."
      }
    ]'::jsonb
),
(
    'HSK6-YUBING-MISSING-SUBJ',
    'Lỗi câu HSK 6: Lạm dụng giới từ làm mất Chủ ngữ (滥用介词掩盖主语)',
    '❌ 通过 / 经过 / 由于 / 在……中 + Vế 1 ，使 / 让 / 令 + Vế 2',
    6,
    'Bắt lỗi câu HSK 6 (病句辨析)',
    '[
      {"role": "Keyword", "label_zh": "通过 / 由于 (Giữ 1 trong 2)", "label_vi": "Cụm giới từ đầu câu"},
      {"role": "S", "label_zh": "主语 (Phải được lộ ra)", "label_vi": "Chủ ngữ thật"},
      {"role": "V", "label_zh": "使 / 让 (Hoặc giữ động từ sai khiến)", "label_vi": "Vị ngữ"}
    ]'::jsonb,
    'Đây là dạng lỗi xuất hiện với tần suất **90% trong đề thi HSK 6 Đọc hiểu Phần 1 (Câu 51-60)**. Khi vế đầu bắt đầu bằng giới từ (`通过…`, `经过…`, `由于…`, `随着…`, `在…下`) thì toàn bộ vế đầu chỉ là **Trạng ngữ**, không phải Chủ ngữ. Nếu vế thứ hai lại bắt đầu bằng động từ sai khiến (`使`, `让`, `令`) thì cả câu sẽ rơi vào trạng thái **Khuyết Chủ ngữ**.',
    'Mẹo giải nhanh trong 5 giây khi thi HSK 6: Hễ nhìn thấy cặp `通过……，使……` hoặc `由于……，让……` đi cùng nhau mà không có danh từ đứng riêng làm chủ ngữ thì chắc chắn câu đó là đáp án cần chọn (câu sai).',
    '[
      {
        "wrong_zh": "❌ 通过这次社会实践活动，使大学生们更加深入地了解了农村的现状。",
        "right_zh": "✅ 这次社会实践活动，使大学生们更加深入地了解了农村的现状。（Hoặc bỏ chữ 使）",
        "pinyin": "Zhè cì shèhuì shíjiàn huódòng, shǐ dàxuéshēngmen gèngjiā shēnrù de liǎojiě le nóngcūn de xiànzhuàng.",
        "meaning_vi": "Hoạt động thực tiễn xã hội lần này đã giúp các bạn sinh viên hiểu sâu sắc hơn về hiện trạng nông thôn.",
        "reason_vi": "Bỏ giới từ 通过 để “这次社会实践活动” đóng vai trò làm Chủ ngữ cho động từ 使."
      }
    ]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb
)
ON CONFLICT (code) DO UPDATE SET
    formula_tokens = EXCLUDED.formula_tokens,
    common_mistakes = EXCLUDED.common_mistakes;


-- ============================================================================
-- 3. TASK 27.04: CHINESE READING STUDIO (BÀI ĐỌC ĐÃ TÁCH TỪ & GÁN NHÃN HSK)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reading_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE,
    title_zh TEXT NOT NULL,
    title_vi TEXT NOT NULL,
    hsk_level SMALLINT NOT NULL CHECK (hsk_level BETWEEN 1 AND 9),
    topic TEXT NOT NULL,
    word_count INT NOT NULL,
    estimated_minutes SMALLINT DEFAULT 5,
    paragraphs JSONB NOT NULL DEFAULT '[]'::jsonb,
    comprehension_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_user_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reading_articles ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS uq_reading_articles_slug ON public.reading_articles (slug);

INSERT INTO public.reading_articles (
    slug, title_zh, title_vi, hsk_level, topic, word_count, estimated_minutes, paragraphs, comprehension_questions
) VALUES
(
    'hsk4-chongqing-mountain-city',
    '山城重庆的独特魅力',
    'Sức hút độc đáo của phố núi Trùng Khánh',
    4,
    'Văn hóa & Địa lý',
    95,
    4,
    '[
      {
        "paragraph_index": 0,
        "sentences": [
          {
            "sentence_id": "s1",
            "zh_raw": "重庆位于中国西南部，那里的房子大多依山而建，因此被人们称为“山城”。",
            "pinyin_full": "Chóngqìng wèiyú Zhōngguó xīnánbù, nàlǐ de fángzi dàduō yī shān ér jiàn, yīncǐ bèi rénmen chēngwéi “Shānchéng”.",
            "vi_translation": "Trùng Khánh nằm ở vùng Tây Nam Trung Quốc, nhà cửa ở đó phần lớn được xây tựa theo sườn núi, vì vậy được mọi người gọi là “Phố Núi”.",
            "tokens": [
              {"text": "重庆", "pinyin": "Chóngqìng", "hsk_level": 4, "pos": "nr", "meaning_vi": "Trùng Khánh", "is_punctuation": false},
              {"text": "位于", "pinyin": "wèiyú", "hsk_level": 5, "pos": "v", "meaning_vi": "nằm ở, tọa lạc tại", "is_punctuation": false},
              {"text": "中国", "pinyin": "Zhōngguó", "hsk_level": 1, "pos": "ns", "meaning_vi": "Trung Quốc", "is_punctuation": false},
              {"text": "西南部", "pinyin": "xīnánbù", "hsk_level": 4, "pos": "n", "meaning_vi": "miền Tây Nam", "is_punctuation": false},
              {"text": "，", "pinyin": "", "is_punctuation": true},
              {"text": "那里", "pinyin": "nàlǐ", "hsk_level": 2, "pos": "r", "meaning_vi": "nơi đó", "is_punctuation": false},
              {"text": "的", "pinyin": "de", "hsk_level": 1, "pos": "u", "meaning_vi": "của", "is_punctuation": false},
              {"text": "房子", "pinyin": "fángzi", "hsk_level": 2, "pos": "n", "meaning_vi": "ngôi nhà", "is_punctuation": false},
              {"text": "大多", "pinyin": "dàduō", "hsk_level": 4, "pos": "adv", "meaning_vi": "phần lớn, đa số", "is_punctuation": false},
              {"text": "依山而建", "pinyin": "yī shān ér jiàn", "hsk_level": 6, "pos": "idiom", "meaning_vi": "xây dựng dựa theo thế núi", "is_punctuation": false},
              {"text": "，", "pinyin": "", "is_punctuation": true},
              {"text": "因此", "pinyin": "yīncǐ", "hsk_level": 4, "pos": "c", "meaning_vi": "vì vậy, do đó", "is_punctuation": false},
              {"text": "被", "pinyin": "bèi", "hsk_level": 3, "pos": "p", "meaning_vi": "được/bị", "is_punctuation": false},
              {"text": "人们", "pinyin": "rénmen", "hsk_level": 2, "pos": "n", "meaning_vi": "mọi người", "is_punctuation": false},
              {"text": "称为", "pinyin": "chēngwéi", "hsk_level": 4, "pos": "v", "meaning_vi": "gọi là", "is_punctuation": false},
              {"text": "“山城”", "pinyin": "Shānchéng", "hsk_level": 3, "pos": "n", "meaning_vi": "Sơn Thành (Phố Núi)", "is_punctuation": false},
              {"text": "。", "pinyin": "", "is_punctuation": true}
            ]
          },
          {
            "sentence_id": "s2",
            "zh_raw": "来到重庆，你不仅能看到穿楼而过的轻轨，还能品尝到正宗的麻辣火锅。",
            "pinyin_full": "Láidào Chóngqìng, nǐ bùjǐn néng kàndào chuān lóu ér guò de qīngguǐ, hái néng pǐncháng dào zhèngzōng de málà huǒguō.",
            "vi_translation": "Đến với Trùng Khánh, bạn không những có thể nhìn thấy tàu điện trên cao xuyên qua tòa nhà, mà còn được thưởng thức món lẩu cay tê chính gốc.",
            "tokens": [
              {"text": "来到", "pinyin": "láidào", "hsk_level": 3, "pos": "v", "meaning_vi": "đến với", "is_punctuation": false},
              {"text": "重庆", "pinyin": "Chóngqìng", "hsk_level": 4, "pos": "nr", "meaning_vi": "Trùng Khánh", "is_punctuation": false},
              {"text": "，", "pinyin": "", "is_punctuation": true},
              {"text": "你", "pinyin": "nǐ", "hsk_level": 1, "pos": "r", "meaning_vi": "bạn", "is_punctuation": false},
              {"text": "不仅", "pinyin": "bùjǐn", "hsk_level": 4, "pos": "c", "meaning_vi": "không những", "is_punctuation": false},
              {"text": "能", "pinyin": "néng", "hsk_level": 1, "pos": "v", "meaning_vi": "có thể", "is_punctuation": false},
              {"text": "看到", "pinyin": "kàndào", "hsk_level": 2, "pos": "v", "meaning_vi": "nhìn thấy", "is_punctuation": false},
              {"text": "穿楼而过", "pinyin": "chuān lóu ér guò", "hsk_level": 5, "pos": "phr", "meaning_vi": "xuyên qua tòa nhà", "is_punctuation": false},
              {"text": "的", "pinyin": "de", "hsk_level": 1, "pos": "u", "meaning_vi": "mà", "is_punctuation": false},
              {"text": "轻轨", "pinyin": "qīngguǐ", "hsk_level": 5, "pos": "n", "meaning_vi": "tàu điện đường sắt nhẹ", "is_punctuation": false},
              {"text": "，", "pinyin": "", "is_punctuation": true},
              {"text": "还", "pinyin": "hái", "hsk_level": 2, "pos": "adv", "meaning_vi": "mà còn", "is_punctuation": false},
              {"text": "能", "pinyin": "néng", "hsk_level": 1, "pos": "v", "meaning_vi": "có thể", "is_punctuation": false},
              {"text": "品尝", "pinyin": "pǐncháng", "hsk_level": 5, "pos": "v", "meaning_vi": "thưởng thức, nếm thử", "is_punctuation": false},
              {"text": "到", "pinyin": "dào", "hsk_level": 2, "pos": "v", "meaning_vi": "được", "is_punctuation": false},
              {"text": "正宗", "pinyin": "zhèngzōng", "hsk_level": 6, "pos": "adj", "meaning_vi": "chính tông, chuẩn vị gốc", "is_punctuation": false},
              {"text": "的", "pinyin": "de", "hsk_level": 1, "pos": "u", "meaning_vi": "của", "is_punctuation": false},
              {"text": "麻辣火锅", "pinyin": "málà huǒguō", "hsk_level": 4, "pos": "n", "meaning_vi": "lẩu cay tê", "is_punctuation": false},
              {"text": "。", "pinyin": "", "is_punctuation": true}
            ]
          }
        ]
      }
    ]'::jsonb,
    '[
      {
        "question_id": "q1",
        "question_zh": "重庆为什么被称为“山城”？",
        "question_vi": "Tại sao Trùng Khánh lại được gọi là “Phố Núi”?",
        "options": [
          "A. 因为那里的轻轨穿楼而过",
          "B. 因为那里的房子大多依山而建",
          "C. 因为那里的麻辣火锅很有名"
        ],
        "correct_index": 1,
        "evidence_sentence_id": "s1",
        "explanation_vi": "Trong câu 1 có nêu rõ: 那里的房子大多依山而建，因此被人们称为“山城”."
      }
    ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    paragraphs = EXCLUDED.paragraphs,
    comprehension_questions = EXCLUDED.comprehension_questions;


-- ============================================================================
-- 4. TASK 27.05: CHINESE LISTENING STUDIO (BÀI NGHE ĐỒNG BỘ MỐC THỜI GIAN)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.listening_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE,
    title_zh TEXT NOT NULL,
    title_vi TEXT NOT NULL,
    hsk_level SMALLINT NOT NULL CHECK (hsk_level BETWEEN 1 AND 9),
    category TEXT NOT NULL CHECK (category IN ('dialogue', 'podcast', 'news', 'hsk_mock')),
    audio_url TEXT NOT NULL,
    duration_seconds INT NOT NULL,
    speech_rate_wpm SMALLINT DEFAULT 160,
    transcript_segments JSONB NOT NULL DEFAULT '[]'::jsonb,
    listening_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.listening_tracks ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS uq_listening_tracks_slug ON public.listening_tracks (slug);

INSERT INTO public.listening_tracks (
    slug, title_zh, title_vi, hsk_level, category, audio_url, duration_seconds, speech_rate_wpm, transcript_segments, listening_questions
) VALUES
(
    'hsk4-listening-job-interview',
    '面试前的准备与建议',
    'Chuẩn bị và lời khuyên trước buổi phỏng vấn',
    4,
    'dialogue',
    '/audio/hsk4/interview_prep_dialogue.mp3',
    28,
    170,
    '[
      {
        "index": 0,
        "speaker": "男",
        "start_ms": 0,
        "end_ms": 6200,
        "hanzi": "明天就要去那家软件公司面试了，我心里还是有点儿紧张。",
        "pinyin": "Míngtiān jiù yào qù nà jiā ruǎnjiàn gōngsī miànshì le, wǒ xīnlǐ háishì yǒudiǎnr jǐnzhāng.",
        "vi": "Ngày mai đã phải đi phỏng vấn ở công ty phần mềm đó rồi, trong lòng tôi vẫn hơi hồi hộp.",
        "key_vocab": ["软件", "面试", "紧张"]
      },
      {
        "index": 1,
        "speaker": "女",
        "start_ms": 6500,
        "end_ms": 14800,
        "hanzi": "别担心，你平时专业知识学得很扎实，刚才我帮你检查简历，也没发现什么问题。",
        "pinyin": "Bié dānxīn, nǐ píngshí zhuānyè zhīshi xué de hěn zhāshi, gāngcái wǒ bāng nǐ jiǎnchá jiǎnlì, yě méi fāxiàn shénme wèntí.",
        "vi": "Đừng lo lắng, bình thường kiến thức chuyên ngành bạn học rất vững, vừa nãy mình giúp bạn kiểm tra CV cũng không phát hiện vấn đề gì.",
        "key_vocab": ["专业", "扎实", "简历"]
      },
      {
        "index": 2,
        "speaker": "男",
        "start_ms": 15100,
        "end_ms": 21000,
        "hanzi": "话是这么说，但听说这次应聘的人特别多，竞争非常激烈。",
        "pinyin": "Huà shì zhème shuō, dàn tīngshuō zhè cì yìngpìn de rén tèbié duō, jìngzhēng fēicháng jīliè.",
        "vi": "Nói thì nói vậy, nhưng nghe bảo lần này người ứng tuyển đông lắm, cạnh tranh vô cùng khốc liệt.",
        "key_vocab": ["应聘", "竞争", "激烈"]
      },
      {
        "index": 3,
        "speaker": "女",
        "start_ms": 21300,
        "end_ms": 28000,
        "hanzi": "你只要把自己的项目经验清楚地表达出来，肯定能给面试官留下好印象。",
        "pinyin": "Nǐ zhǐyào bǎ zìjǐ de xiàngmù jīngyàn qīngchu de biǎodá chūlái, kěndìng néng gěi miànshìguān liúxià hǎo yìnxiàng.",
        "vi": "Bạn chỉ cần trình bày rõ ràng kinh nghiệm làm dự án của mình thì chắc chắn sẽ để lại ấn tượng tốt cho nhà tuyển dụng.",
        "key_vocab": ["经验", "表达", "印象"]
      }
    ]'::jsonb,
    '[
      {
        "question_number": 1,
        "question_zh": "男的为什么觉得紧张？",
        "options": {
          "A": "简历还没写好",
          "B": "明天要去参加面试",
          "C": "迟到了"
        },
        "correct_answer": "B",
        "explanation_vi": "Người nam nói ngay ở câu đầu: 明天就要去那家软件公司面试了，我心里还是有点儿紧张。"
      }
    ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    transcript_segments = EXCLUDED.transcript_segments;


-- ============================================================================
-- 5. TASK 27.07: CHINESE PRONUNCIATION LAB (BÀI TẬP THANH ĐIỆU & BIẾN ĐIỆU)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pronunciation_drills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('initials_finals', 'tone_pairs', 'tone_sandhi', 'minimal_pairs', 'sentence_shadowing')),
    hsk_level SMALLINT DEFAULT 1,
    hanzi TEXT NOT NULL,
    pinyin_underlying TEXT NOT NULL,
    pinyin_surface TEXT NOT NULL,
    meaning_vi TEXT NOT NULL,
    phonetic_focus TEXT NOT NULL,
    articulation_tip_vi TEXT NOT NULL,
    reference_pitch_contour JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pronunciation_drills ADD COLUMN IF NOT EXISTS code TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS uq_pronunciation_drills_code ON public.pronunciation_drills (code);

INSERT INTO public.pronunciation_drills (
    code, category, hsk_level, hanzi, pinyin_underlying, pinyin_surface, meaning_vi,
    phonetic_focus, articulation_tip_vi, reference_pitch_contour
) VALUES
(
    'SANDHI-33-01',
    'tone_sandhi',
    1,
    '展览馆',
    'zhǎn lǎn guǎn',
    'zhán lán guǎn',
    'Nhà triển lãm',
    'Quy tắc biến điệu 3 Thanh 3 liên tiếp (3 + 3 + 3 -> 2 + 2 + 3)',
    'Vì “展览” là một cụm từ song âm tiết gắn kết chặt chẽ đi với danh từ “馆”, nên 2 chữ đầu đều biến thành Thanh 2 (cao độ 35), chỉ giữ nguyên Thanh 3 (214) ở chữ cuối cùng “馆”.',
    '[{"syllable": "zhán", "contour": [30, 38, 48, 55]}, {"syllable": "lán", "contour": [30, 40, 50, 58]}, {"syllable": "guǎn", "contour": [25, 15, 12, 42]}]'::jsonb
),
(
    'SANDHI-BU-YI-01',
    'tone_sandhi',
    2,
    '一不小心',
    'yī bù xiǎo xīn',
    'yí bù xiǎo xīn',
    'Chỉ sơ suất một chút / Lỡ không cẩn thận',
    'Kết hợp biến điệu của 一 (yī) và 不 (bù)',
    'Chữ “一” đứng trước chữ “不” (thanh 4) nên biến điệu thành Thanh 2 (yí). Trong khi đó chữ “不” đứng trước chữ “小” (thanh 3) nên giữ nguyên Thanh 4 (bù).',
    '[{"syllable": "yí", "contour": [32, 45, 58]}, {"syllable": "bù", "contour": [85, 50, 15]}, {"syllable": "xiǎo", "contour": [25, 12, 20]}, {"syllable": "xīn", "contour": [78, 78, 78]}]'::jsonb
),
(
    'MINIMAL-JQX-ZCS',
    'minimal_pairs',
    2,
    '休息 vs 收拾',
    'xiū xi vs shōu shi',
    'xiū xi vs shōu shi',
    'Nghỉ ngơi vs Thu dọn',
    'Phân biệt âm mặt lưỡi (x) và âm quặt lưỡi (sh)',
    'Khi phát âm “x” (休息), đầu lưỡi hạ xuống chạm nhẹ mặt sau răng cửa dưới, mặt lưỡi nâng lên sát ngạc cứng. Khi phát âm “sh” (收拾), đầu lưỡi phải cong ngược lên phía vòm họng trên.',
    '[]'::jsonb
)
ON CONFLICT (code) DO UPDATE SET
    articulation_tip_vi = EXCLUDED.articulation_tip_vi;


-- ============================================================================
-- 6. PHASE 29 (29.04, 29.05, 29.07): IMMERSION & CHUYÊN NGÀNH
-- ============================================================================

-- 6.1. Task 29.04: Kho Thành ngữ Tứ tự (四字成语)
CREATE TABLE IF NOT EXISTS public.chengyu_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chengyu CHAR(4) UNIQUE NOT NULL,
    pinyin TEXT NOT NULL,
    han_viet TEXT NOT NULL,
    literal_meaning_vi TEXT NOT NULL,
    figurative_meaning_vi TEXT NOT NULL,
    vietnamese_equivalent_idiom TEXT,
    char_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
    origin_story_vi TEXT NOT NULL,
    sentiment_polarity TEXT NOT NULL CHECK (sentiment_polarity IN ('positive_褒义', 'neutral_中性', 'negative_贬义')),
    syntactic_function TEXT[] DEFAULT '{}',
    hsk_level SMALLINT DEFAULT 6,
    examples JSONB NOT NULL DEFAULT '[]'::jsonb
);

INSERT INTO public.chengyu_entries (
    chengyu, pinyin, han_viet, literal_meaning_vi, figurative_meaning_vi, vietnamese_equivalent_idiom,
    char_breakdown, origin_story_vi, sentiment_polarity, syntactic_function, hsk_level, examples
) VALUES
(
    '入乡随俗', 'rù xiāng suí sú', 'NHẬP HƯƠNG TÙY TỤC',
    'Bước vào làng nào thì làm theo phong tục của làng đó',
    'Khi đến một vùng đất hoặc môi trường mới thì nên tôn trọng và thích nghi với tập quán, văn hóa của người bản địa.',
    'Nhập gia tùy tục',
    '[
      {"char": "入", "pinyin": "rù", "han_viet": "NHẬP", "classical_meaning_vi": "đi vào, bước vào"},
      {"char": "乡", "pinyin": "xiāng", "han_viet": "HƯƠNG", "classical_meaning_vi": "vùng quê, xứ sở khác"},
      {"char": "随", "pinyin": "suí", "han_viet": "TÙY", "classical_meaning_vi": "thuận theo, làm theo"},
      {"char": "俗", "pinyin": "sú", "han_viet": "TỤC", "classical_meaning_vi": "phong tục, tập quán"}
    ]'::jsonb,
    'Xuất phát từ sách “Trang Tử”: Khi đi sang một nước khác hay vùng đất mới, người hiểu lễ nghĩa sẽ quan sát phong tục bản địa để ứng xử hòa hợp thay vì áp đặt thói quen cũ của mình.',
    'positive_褒义',
    ARRAY['Làm vị ngữ', 'Làm trạng ngữ'],
    5,
    '[{"hanzi": "既然来到了中国留学，我们就要入乡随俗，体验当地的生活方式。", "pinyin": "Jìrán láidào le Zhōngguó liúxué, wǒmen jiù yào rùxiāngsuísú, tǐyàn dāngdì de shēnghuó fāngshì.", "vi": "Đã đến Trung Quốc du học thì chúng ta nên nhập gia tùy tục, trải nghiệm lối sống bản địa."}]'::jsonb
),
(
    '半途而废', 'bàn tú ér fèi', 'BÁN ĐỒ NHI PHẾ',
    'Đi được nửa đường thì dừng lại bỏ cuộc',
    'Làm việc hoặc học tập không kiên trì đến cùng, bỏ dở giữa chừng.',
    'Đứt gánh giữa đường / Bỏ cuộc giữa chừng',
    '[
      {"char": "半", "pinyin": "bàn", "han_viet": "BÁN", "classical_meaning_vi": "một nửa"},
      {"char": "途", "pinyin": "tú", "han_viet": "ĐỒ", "classical_meaning_vi": "con đường, hành trình"},
      {"char": "而", "pinyin": "ér", "han_viet": "NHI", "classical_meaning_vi": "liền, mà (liên từ nối)"},
      {"char": "废", "pinyin": "fèi", "han_viet": "PHẾ", "classical_meaning_vi": "dừng lại, hủy bỏ"}
    ]'::jsonb,
    'Bắt nguồn từ câu chuyện “Lạc Dương Thê” của Nhạc Dương Tử thời Đông Hán: Ông đi xa tầm sư học đạo nhưng mới ít lâu đã nhớ nhà bỏ về. Vợ ông liền cầm kéo cắt đứt tấm lụa đang dệt dở trên khung cửi để khuyên chồng rằng: Học tập mà bỏ dở giữa chừng cũng vô ích như tấm lụa bị cắt đứt.',
    'negative_贬义',
    ARRAY['Làm vị ngữ', 'Làm tân ngữ'],
    6,
    '[{"hanzi": "学习外语贵在坚持，绝不能半途而废。", "pinyin": "Xuéxí wàiyǔ guì zài jiānchí, jué bù néng bàntúérfèi.", "vi": "Học ngoại ngữ quý ở sự kiên trì, tuyệt đối không được bỏ cuộc giữa chừng."}]'::jsonb
)
ON CONFLICT (chengyu) DO UPDATE SET
    origin_story_vi = EXCLUDED.origin_story_vi;

-- 6.2. Task 29.05: Gói Tiếng Trung Chuyên Ngành IT/Software & Luyện Dịch
CREATE TABLE IF NOT EXISTS public.specialized_domain_packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_vi TEXT NOT NULL,
    description_vi TEXT NOT NULL,
    terminology_list JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.specialized_domain_packs (slug, title_vi, description_vi, terminology_list)
VALUES
(
    'it-software-engineering',
    'Tiếng Trung cho Kỹ sư CNTT & Phát triển Phần mềm',
    'Bộ thuật ngữ thực chiến trong phát triển Full-stack, Cơ sở dữ liệu, Kiến trúc hệ thống và Họp dự án Agile/Scrum tại các doanh nghiệp công nghệ.',
    '[
      {"simplified": "数据库索引", "pinyin": "shùjùkù suǒyǐn", "han_viet": "THỐ CỨ KHỐ SÁCH DẪN", "meaning_vi": "Chỉ mục cơ sở dữ liệu (Database Index)", "english_equiv": "Database Index", "sample_sentence_zh": "为了提高查询性能，我们需要为这张表建立合适的数据库索引。", "sample_sentence_vi": "Để nâng cao hiệu năng truy vấn, chúng ta cần đánh index phù hợp cho bảng này."},
      {"simplified": "消息队列", "pinyin": "xiāoxi duìliè", "han_viet": "TIÊU TỨC ĐỘI LIỆT", "meaning_vi": "Hàng đợi tin nhắn (Message Queue - RabbitMQ/Kafka)", "english_equiv": "Message Queue", "sample_sentence_zh": "我们将耗时的后台任务放入消息队列中进行异步处理。", "sample_sentence_vi": "Chúng tôi đưa các tác vụ ngầm tốn thời gian vào Message Queue để xử lý bất đồng bộ."},
      {"simplified": "接口文档", "pinyin": "jiēkǒu wéndàng", "han_viet": "TIẾP KHẨU VĂN ĐÁNG", "meaning_vi": "Tài liệu đặc tả API (API Documentation)", "english_equiv": "API Documentation", "sample_sentence_zh": "前端开发前，请先确认后端的接口文档已经更新。", "sample_sentence_vi": "Trước khi code Frontend, hãy xác nhận tài liệu API của Backend đã được cập nhật."}
    ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    terminology_list = EXCLUDED.terminology_list;

-- 6.3. Task 29.07: Đồng bộ Giáo trình HSK Standard Course (dùng series_id theo schema 29.07)
ALTER TABLE public.textbook_units ADD COLUMN IF NOT EXISTS unit_grammar_codes TEXT[] DEFAULT '{}'::text[];

INSERT INTO public.textbook_series (series_slug, title_vi, publisher, total_volumes)
VALUES ('hsk-standard-course', 'Giáo trình Chuẩn HSK (HSK标准教程 1-6)', 'Đại học Ngôn ngữ Bắc Kinh (BLCU Press)', 6)
ON CONFLICT (series_slug) DO NOTHING;

INSERT INTO public.textbook_units (series_id, volume_number, unit_number, title_zh, title_vi, unit_vocab_list, unit_grammar_codes)
SELECT
    s.id,
    3,
    5,
    '发烧了怎么办',
    'Bị sốt rồi thì làm thế nào?',
    '[
      {"order": 1, "simplified": "发烧", "pinyin": "fāshāo", "pos": "v", "meaning_vi": "bị sốt"},
      {"order": 2, "simplified": "为", "pinyin": "wèi", "pos": "p", "meaning_vi": "vì, cho"},
      {"order": 3, "simplified": "照顾", "pinyin": "zhàogù", "pos": "v", "meaning_vi": "chăm sóc"},
      {"order": 4, "simplified": "用", "pinyin": "yòng", "pos": "v", "meaning_vi": "cần (dùng trong 不用)"},
      {"order": 5, "simplified": "感冒", "pinyin": "gǎnmào", "pos": "v", "meaning_vi": "bị cảm cúm"}
    ]'::jsonb,
    ARRAY['HSK3-BA-01']
FROM public.textbook_series s
WHERE s.series_slug = 'hsk-standard-course'
ON CONFLICT (series_id, volume_number, unit_number) DO UPDATE SET
    unit_vocab_list = EXCLUDED.unit_vocab_list,
    unit_grammar_codes = EXCLUDED.unit_grammar_codes;


-- ============================================================================
-- 7. TASK 27.06 & 27.08: VOCABULARY WORKSPACE & ĐỒNG BỘ MASTERY ĐA CHIỀU
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.vocab_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color_hex TEXT DEFAULT '#00D4FF',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_vocab_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    deck_id UUID REFERENCES public.vocab_decks(id) ON DELETE SET NULL,
    simplified TEXT NOT NULL,
    pinyin TEXT NOT NULL,
    han_viet TEXT,
    meaning_vi TEXT NOT NULL,
    hsk_level SMALLINT DEFAULT 1,
    personal_mnemonic TEXT,
    source_context JSONB DEFAULT '[]'::jsonb,
    srs_state TEXT DEFAULT 'new' CHECK (srs_state IN ('new', 'learning', 'review', 'relearning')),
    ease_factor REAL DEFAULT 2.5,
    interval_days INT DEFAULT 0,
    repetitions INT DEFAULT 0,
    lapses INT DEFAULT 0,
    meaning_mastery SMALLINT DEFAULT 0 CHECK (meaning_mastery BETWEEN 0 AND 100),
    writing_mastery SMALLINT DEFAULT 0 CHECK (writing_mastery BETWEEN 0 AND 100),
    pronunciation_mastery SMALLINT DEFAULT 0 CHECK (pronunciation_mastery BETWEEN 0 AND 100),
    overall_mastery NUMERIC(5,2) GENERATED ALWAYS AS (
        ROUND((meaning_mastery * 0.40) + (writing_mastery * 0.30) + (pronunciation_mastery * 0.30), 2)
    ) STORED,
    next_review_at TIMESTAMPTZ DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ,
    UNIQUE(user_id, simplified)
);

-- RPC đồng bộ Mastery đa chiều từ Writing Studio, Pronunciation Lab & SRS
CREATE OR REPLACE FUNCTION public.update_vocab_dimension_score(
    p_user_id UUID,
    p_simplified TEXT,
    p_dimension TEXT, -- 'meaning' | 'writing' | 'pronunciation'
    p_score SMALLINT
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    IF p_dimension = 'meaning' THEN
        UPDATE public.user_vocab_items SET meaning_mastery = p_score, last_reviewed_at = NOW()
        WHERE user_id = p_user_id AND simplified = p_simplified;
    ELSIF p_dimension = 'writing' THEN
        UPDATE public.user_vocab_items SET writing_mastery = GREATEST(writing_mastery, p_score), last_reviewed_at = NOW()
        WHERE user_id = p_user_id AND simplified = p_simplified;
    ELSIF p_dimension = 'pronunciation' THEN
        UPDATE public.user_vocab_items SET pronunciation_mastery = GREATEST(pronunciation_mastery, p_score), last_reviewed_at = NOW()
        WHERE user_id = p_user_id AND simplified = p_simplified;
    END IF;
END;
$$;

