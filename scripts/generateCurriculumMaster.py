# -*- coding: utf-8 -*-
"""
Master Curriculum Generator for HanziGo (HSK 1-3: 60 Lessons)
Produces src/data/curriculumLessons.js
"""
import json
import os

# Dictionary of specialized lesson contents
# Each entry contains authentic vocabulary, hanzi, grammar, dialogue, questions
LESSON_DETAILS = {
  101: {
    "topic": "4 Thanh điệu & Nhóm thanh mẫu môi - đầu lưỡi",
    "summary": "Nắm vững 4 cao độ thanh điệu chuẩn Bắc Kinh và phát âm chuẩn xác các âm môi, âm đầu lưỡi.",
    "audio": "bā pá mǎ mà dà tā",
    "vocab": [
      {"id": "v-101-1", "hanzi": "八", "pinyin": "bā", "hanviet": "Bát", "meaning": "Số 8", "radical": "八 (Bát)", "example": {"hanzi": "八本书。", "pinyin": "Bā běn shū.", "meaning": "Tám quyển sách."}},
      {"id": "v-101-2", "hanzi": "爸爸", "pinyin": "bàba", "hanviet": "Ba ba", "meaning": "Bố, ba", "radical": "父 (Phụ)", "example": {"hanzi": "爸爸很大。", "pinyin": "Bàba hěn dà.", "meaning": "Bố to lớn."}},
      {"id": "v-101-3", "hanzi": "妈妈", "pinyin": "māma", "hanviet": "Ma ma", "meaning": "Mẹ", "radical": "女 (Nữ)", "example": {"hanzi": "妈妈好。", "pinyin": "Māma hǎo.", "meaning": "Mẹ tốt đẹp."}},
      {"id": "v-101-4", "hanzi": "大", "pinyin": "dà", "hanviet": "Đại", "meaning": "To, lớn", "radical": "大 (Đại)", "example": {"hanzi": "很大。", "pinyin": "Hěn dà.", "meaning": "Rất to lớn."}},
      {"id": "v-101-5", "hanzi": "不", "pinyin": "bù", "hanviet": "Bất", "meaning": "Không (phủ định)", "radical": "一 (Nhất)", "example": {"hanzi": "不大。", "pinyin": "Bú dà.", "meaning": "Không to."}}
    ],
    "hanzi": [
      {"hanzi": "八", "pinyin": "bā", "meaning": "Số 8", "strokesCount": 2, "strokeOrderText": "Phẩy trước (丿), mác sau (乀)", "components": "Bộ Bát (八)", "mnemonic": "Hai nét mở rộng sang hai phía thể hiện sự phân tách."},
      {"hanzi": "大", "pinyin": "dà", "meaning": "To lớn", "strokesCount": 3, "strokeOrderText": "Ngang (一) -> Phẩy (丿) -> Mác (乀)", "components": "Bộ Đại (大)", "mnemonic": "Hình tượng người dang rộng hai tay và hai chân."}
    ],
    "grammar": {
      "title": "Phủ định với phó từ 不 (bù)",
      "formula": "Chủ ngữ + 不 (bù) + Tính từ / Động từ",
      "explanation": "Từ 不 luôn đứng trước tính từ hoặc động từ để biểu thị sự phủ định.",
      "examples": [{"hanzi": "爸爸不大。", "pinyin": "Bàba bú dà.", "meaning": "Bố không to lớn."}],
      "commonMistake": {"wrong": "Đọc thanh 4 thành dấu huyền tiếng Việt.", "correct": "Phát âm dứt khoát rơi từ cao độ 5 xuống 1: dà (Đại).", "explanation": "Thanh 4 tiếng Trung dứt khoát mạnh mẽ."}
    },
    "listen": {
      "dialogue": [{"speaker": "A", "hanzi": "爸爸大吗？", "pinyin": "Bàba dà ma?", "meaning": "Bố to lớn không?"}, {"speaker": "B", "hanzi": "爸爸不大，妈妈大。", "pinyin": "Bàba bú dà, māma dà.", "meaning": "Bố không to, mẹ to lớn."}],
      "audio": "爸爸大吗？爸爸不大，妈妈大。",
      "q": "Theo bài nghe, người bố như thế nào?", "opts": ["Bố to lớn", "Bố không to lớn", "Bố rất bận", "Bố đang đi học"], "correct": 1, "exp": "Người B nói: 爸爸不大."
    },
    "speak": {"prompt": "Đọc câu phủ định:", "target": "爸爸不大。", "pinyin": "Bàba bú dà.", "meaning": "Bố không to lớn.", "hint": "Đọc bú dà."},
    "write": {"prompt": "Ghép câu: Bố không to lớn", "words": ["大", "不", "爸爸"], "correct": ["爸爸", "不", "大"], "exp": "爸爸 + 不 + 大."},
    "quiz": [
      {"id": "q-101-1", "type": "multiple-choice", "question": "Thanh mẫu nào là âm bật hơi mạnh?", "options": ["b", "p", "m", "d"], "correctIndex": 1, "explanation": "Âm p là âm bật hơi mạnh."},
      {"id": "q-101-2", "type": "multiple-choice", "question": "Chữ 不 trước thanh 4 đọc biến điệu thành thanh mấy?", "options": ["Thanh 1", "Thanh 2 (bú)", "Thanh 3", "Thanh 4"], "correctIndex": 1, "explanation": "Đọc thành thanh 2: bú dà."}
    ],
    "challenge": {"title": "Luyện 4 thanh điệu", "desc": "Đọc to 4 thanh điệu mā má mǎ mà.", "phrase": "mā má mǎ mà", "badge": "Khởi Đầu Phát Âm Chuẩn"}
  }
}

print("Initialized base details")
