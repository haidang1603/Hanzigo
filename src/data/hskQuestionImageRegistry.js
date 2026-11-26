/**
 * =========================================================================
 * HANZI GO — HSK 1–5 LOCAL QUESTION IMAGE ASSET REGISTRY
 * =========================================================================
 * Ánh xạ 100% cục bộ tại /images/hsk/... cho:
 * - HSK 1 & 2 Listening P1–P2, Reading P1–P2 (HSK 2.0 & HSK 3.0 + Supplements)
 * - HSK 4 & 5 Writing 看图写话 / 看图造句 / 四幅连环画
 *
 * Bảo đảm:
 * - Không hotlink URL ngoài, không base64 data URI
 * - imageAlt trung lập (không chứa chữ Hán, Pinyin hay đáp án câu hỏi)
 * - Tương thích động lực học nhẹ để giữ chunk data-hsk-core <= 180 KB gzip
 */

const PROMPT_BASE =
  'Clean flat vector textbook illustration for Chinese language exam, soft pastel palette, warm daylight, simple clear silhouettes, light cream background, friendly modern educational style, absolutely no text/characters/watermarks.';

export const HSK_IMAGE_ASSET_CATALOG = Object.freeze([
  // Kênh 1 — Sourced Flat-Vector SVGs (Nhóm A: Đồ vật & Khái niệm HSK 1–2)
  { path: '/images/hsk/sourced/apple-book-desk.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector study desk with book and red apples (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/clock-time.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector analog wall clock face with tick marks (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/phone-call.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector smartphone call illustration (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/train-rail.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector high-speed train on railway tracks (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/airplane-sky.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector airplane flying across bright clouds (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/television-screen.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector living room television screen (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/pencil-paper.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector yellow pencil and blank lined paper (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/tea-cup.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector steaming green teacup on saucer (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/coffee-cup.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector warm coffee mug with steam (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/weather-sunny.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector sunny sky with soft white clouds (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/weather-rainy.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector rain clouds with falling droplets (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/white-dog.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector playful white puppy running on grass (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/key-ring.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector brass key and ring (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/movie-tickets.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector pair of cinema tickets with star emblem (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/happy-smile.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector joyful smiling face emblem (CC0 textbook pack)' },
  { path: '/images/hsk/sourced/open-window.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: 'Flat vector sunlit bedroom window with curtains (CC0 textbook pack)' },

  // Kênh 2A — AI Generated WebP Scenes (HSK 1–2)
  { path: '/images/hsk/generated/hsk12-classroom-teacher.webp', sourceType: 'ai_generated_webp', license: 'AI-Generated-Custom', sourceUrlOrPrompt: `${PROMPT_BASE} Teacher beside green chalkboard with two students in sunlit classroom.` },
  { path: '/images/hsk/generated/hsk12-library-reading.webp', sourceType: 'ai_generated_webp', license: 'AI-Generated-Custom', sourceUrlOrPrompt: `${PROMPT_BASE} Student reading an open book quietly at library desk.` },
  { path: '/images/hsk/generated/hsk12-drinking-tea.webp', sourceType: 'ai_generated_webp', license: 'AI-Generated-Custom', sourceUrlOrPrompt: `${PROMPT_BASE} Young woman smiling warmly while holding a steaming ceramic teacup.` },

  // Kênh 2B — Bespoke Pastel Textbook Vector Scenes (HSK 1–2)
  { path: '/images/hsk/generated/hsk12-cat-under-chair.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Cute orange tabby cat curled asleep under a wooden chair.` },
  { path: '/images/hsk/generated/hsk12-kitchen-cooking.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Mother cooking fresh meal at warm home kitchen stove.` },
  { path: '/images/hsk/generated/hsk12-taxi-station.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Traveler boarding yellow taxi outside modern train station.` },
  { path: '/images/hsk/generated/hsk12-family-dinner.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Happy family dining around round table with bowls and dishes.` },
  { path: '/images/hsk/generated/hsk12-doctor-patient.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Friendly doctor with stethoscope consulting patient in bright clinic.` },
  { path: '/images/hsk/generated/hsk12-watching-movie-home.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Person relaxing on cozy living room sofa watching television.` },
  { path: '/images/hsk/generated/hsk12-walking-to-office.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Office worker with briefcase walking along tree-lined sidewalk.` },
  { path: '/images/hsk/generated/hsk12-sleeping-waking.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Person resting peacefully under cozy blanket at night.` },
  { path: '/images/hsk/generated/hsk12-shopping-red-dress.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Parents admiring a red dress hanging on boutique rack.` },
  { path: '/images/hsk/generated/hsk12-basketball-friends.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Friends playing basketball on sunny outdoor court.` },
  { path: '/images/hsk/generated/hsk12-airport-welcome.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Man greeting arriving traveler with suitcase in airport hall.` },
  { path: '/images/hsk/generated/hsk12-rainy-mountain.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Rain clouds over scenic green hills with colorful umbrella.` },

  // Kênh 2C — Pastel Textbook Vector Scenes (HSK 4–5 看图写话)
  { path: '/images/hsk/generated/hsk4-playing-piano.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Pianist playing piano gracefully in warm sunlit music room.` },
  { path: '/images/hsk/generated/hsk4-saving-water.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Hand turning off dripping water faucet above clean ceramic sink.` },
  { path: '/images/hsk/generated/hsk4-library-tablet-discuss.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Two university students discussing over a tablet in quiet library.` },
  { path: '/images/hsk/generated/hsk4-mom-tying-shoelaces.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Mother patiently teaching young son how to tie shoelaces by home doorway.` },
  { path: '/images/hsk/generated/hsk4-basketball-celebration.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} College basketball teammates celebrating victory enthusiastically on court.` },
  { path: '/images/hsk/generated/hsk4-office-whiteboard-discuss.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Two office colleagues discussing work in front of blank whiteboard.` },
  { path: '/images/hsk/generated/hsk4-park-morning-jog.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Young woman with headphones jogging along sunlit park trail.` },
  { path: '/images/hsk/generated/hsk4-family-making-dumplings.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Family gathered around festive table wrapping dumplings together.` },
  { path: '/images/hsk/generated/hsk4-volunteer-directions-station.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Volunteer in red vest holding blank map pointing directions outside train station.` },
  { path: '/images/hsk/generated/hsk4-student-tidying-desk.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Student neatly organizing stacked books and notebooks on study desk.` },
  { path: '/images/hsk/generated/hsk5-four-panel-growth.svg', sourceType: 'custom_svg', license: 'CC0-1.0', sourceUrlOrPrompt: `${PROMPT_BASE} Four-panel visual comic grid showing personal growth from leaving home to city career success.` },
]);

const EXPLICIT_QUESTION_IMAGE_MAP = Object.freeze({
  // HSK 4 & HSK 5 看图写话 / 看四幅连环画
  'q-hsk4-01-29': { url: '/images/hsk/generated/hsk4-playing-piano.svg', alt: 'Tranh minh họa nhiệm vụ viết câu HSK 4' },
  'q-hsk4-03-09': { url: '/images/hsk/generated/hsk4-saving-water.svg', alt: 'Tranh minh họa nhiệm vụ viết câu HSK 4' },
  'hsk4-mock-01-sup-68': { url: '/images/hsk/generated/hsk4-library-tablet-discuss.svg', alt: 'Tranh minh họa hai sinh viên trong thư viện HSK 4' },
  'hsk4-mock-01-sup-69': { url: '/images/hsk/generated/hsk4-mom-tying-shoelaces.svg', alt: 'Tranh minh họa cảnh sinh hoạt gia đình HSK 4' },
  'hsk4-mock-01-sup-70': { url: '/images/hsk/generated/hsk4-basketball-celebration.svg', alt: 'Tranh minh họa trận đấu thể thao HSK 4' },
  'hsk30-l4-wri-p1-01': { url: '/images/hsk/generated/hsk4-office-whiteboard-discuss.svg', alt: 'Tranh minh họa tình huống công sở HSK 4' },
  'hsk30-l4-wri-p1-02': { url: '/images/hsk/generated/hsk4-park-morning-jog.svg', alt: 'Tranh minh họa hoạt động ngoài trời buổi sáng HSK 4' },
  'hsk30-l4-wri-p1-03': { url: '/images/hsk/generated/hsk4-family-making-dumplings.svg', alt: 'Tranh minh họa bữa cơm sum họp gia đình HSK 4' },
  'hsk30-l4-wri-p1-04': { url: '/images/hsk/generated/hsk4-volunteer-directions-station.svg', alt: 'Tranh minh họa cảnh trước nhà ga HSK 4' },
  'hsk30-l4-wri-p1-05': { url: '/images/hsk/generated/hsk4-student-tidying-desk.svg', alt: 'Tranh minh họa góc bàn học tập HSK 4' },
  'hsk30-l5-wri-p1-01': { url: '/images/hsk/generated/hsk5-four-panel-growth.svg', alt: 'Bộ bốn bức tranh liên hoàn nhiệm vụ viết đoạn văn HSK 5' },

  // HSK 3.0 Level 1 Listening P1-P2 & Reading P1-P2
  'hsk30-l1-lis-p1-01': { url: '/images/hsk/generated/hsk12-classroom-teacher.webp', alt: 'Hình minh họa tình huống lớp học HSK 1' },
  'hsk30-l1-lis-p1-02': { url: '/images/hsk/sourced/weather-sunny.svg', alt: 'Hình minh họa thời tiết trong bài nghe HSK 1' },
  'hsk30-l1-lis-p1-03': { url: '/images/hsk/sourced/apple-book-desk.svg', alt: 'Hình minh họa đồ vật trên bàn HSK 1' },
  'hsk30-l1-lis-p1-04': { url: '/images/hsk/generated/hsk12-library-reading.webp', alt: 'Hình minh họa hoạt động đọc sách HSK 1' },
  'hsk30-l1-lis-p1-05': { url: '/images/hsk/generated/hsk12-drinking-tea.webp', alt: 'Hình minh họa sinh hoạt hằng ngày HSK 1' },
  'hsk30-l1-lis-p2-01': { url: '/images/hsk/generated/hsk12-cat-under-chair.svg', alt: 'Hình minh họa vị trí đồ vật và thú cưng HSK 1' },
  'hsk30-l1-lis-p2-02': { url: '/images/hsk/generated/hsk12-kitchen-cooking.svg', alt: 'Hình minh họa hoạt động trong bếp HSK 1' },
  'hsk30-l1-lis-p2-03': { url: '/images/hsk/generated/hsk12-taxi-station.svg', alt: 'Hình minh họa phương tiện đi lại HSK 1' },
  'hsk30-l1-lis-p2-04': { url: '/images/hsk/generated/hsk12-classroom-teacher.webp', alt: 'Hình minh họa khung cảnh lớp học HSK 1' },
  'hsk30-l1-lis-p2-05': { url: '/images/hsk/sourced/clock-time.svg', alt: 'Hình minh họa thời gian trong bài nghe HSK 1' },
  'hsk30-l1-rea-p1-01': { url: '/images/hsk/generated/hsk12-doctor-patient.svg', alt: 'Hình minh họa phòng khám bệnh HSK 1' },
  'hsk30-l1-rea-p1-02': { url: '/images/hsk/sourced/train-rail.svg', alt: 'Hình minh họa phương tiện giao thông HSK 1' },
  'hsk30-l1-rea-p1-03': { url: '/images/hsk/sourced/phone-call.svg', alt: 'Hình minh họa thiết bị liên lạc HSK 1' },
  'hsk30-l1-rea-p1-04': { url: '/images/hsk/sourced/television-screen.svg', alt: 'Hình minh họa đồ dùng phòng khách HSK 1' },
  'hsk30-l1-rea-p1-05': { url: '/images/hsk/sourced/happy-smile.svg', alt: 'Hình minh họa biểu cảm gương mặt HSK 1' },
  'hsk30-l1-rea-p2-01': { url: '/images/hsk/sourced/clock-time.svg', alt: 'Hình minh họa tình huống giao tiếp HSK 1' },
  'hsk30-l1-rea-p2-02': { url: '/images/hsk/generated/hsk12-classroom-teacher.webp', alt: 'Hình minh họa hội thoại làm quen HSK 1' },
  'hsk30-l1-rea-p2-03': { url: '/images/hsk/generated/hsk12-family-dinner.svg', alt: 'Hình minh họa bữa ăn gia đình HSK 1' },
  'hsk30-l1-rea-p2-04': { url: '/images/hsk/sourced/tea-cup.svg', alt: 'Hình minh họa đồ uống tại quán trà HSK 1' },
  'hsk30-l1-rea-p2-05': { url: '/images/hsk/sourced/weather-rainy.svg', alt: 'Hình minh họa thời tiết bài đọc HSK 1' },

  // HSK 3.0 Level 2 Listening P1-P2 & Reading P1-P2
  'hsk30-l2-lis-p1-01': { url: '/images/hsk/generated/hsk12-watching-movie-home.svg', alt: 'Hình minh họa sinh hoạt cuối tuần HSK 2' },
  'hsk30-l2-lis-p1-02': { url: '/images/hsk/sourced/white-dog.svg', alt: 'Hình minh họa thú cưng ngoài sân HSK 2' },
  'hsk30-l2-lis-p1-03': { url: '/images/hsk/generated/hsk12-walking-to-office.svg', alt: 'Hình minh họa đường đi làm HSK 2' },
  'hsk30-l2-lis-p1-04': { url: '/images/hsk/generated/hsk12-sleeping-waking.svg', alt: 'Hình minh họa thói quen sinh hoạt HSK 2' },
  'hsk30-l2-lis-p1-05': { url: '/images/hsk/sourced/movie-tickets.svg', alt: 'Hình minh họa vé xem phim HSK 2' },
  'hsk30-l2-lis-p1-06': { url: '/images/hsk/sourced/key-ring.svg', alt: 'Hình minh họa đồ vật cá nhân HSK 2' },
  'hsk30-l2-lis-p2-01': { url: '/images/hsk/generated/hsk12-family-dinner.svg', alt: 'Hình minh họa tình huống hỏi đường trong nhà hàng HSK 2' },
  'hsk30-l2-lis-p2-02': { url: '/images/hsk/generated/hsk12-shopping-red-dress.svg', alt: 'Hình minh họa mua sắm trang phục HSK 2' },
  'hsk30-l2-lis-p2-03': { url: '/images/hsk/generated/hsk12-basketball-friends.svg', alt: 'Hình minh họa hoạt động thể thao HSK 2' },
  'hsk30-l2-lis-p2-04': { url: '/images/hsk/generated/hsk12-airport-welcome.svg', alt: 'Hình minh họa tình huống sân bay HSK 2' },
  'hsk30-l2-lis-p2-05': { url: '/images/hsk/sourced/pencil-paper.svg', alt: 'Hình minh họa văn phòng phẩm HSK 2' },
  'hsk30-l2-lis-p2-06': { url: '/images/hsk/generated/hsk12-doctor-patient.svg', alt: 'Hình minh họa chăm sóc sức khỏe HSK 2' },
  'hsk30-l2-rea-p1-01': { url: '/images/hsk/sourced/airplane-sky.svg', alt: 'Hình minh họa chuyến đi bằng máy bay HSK 2' },
  'hsk30-l2-rea-p1-02': { url: '/images/hsk/generated/hsk12-basketball-friends.svg', alt: 'Hình minh họa hai anh em trong đời sống HSK 2' },
  'hsk30-l2-rea-p1-03': { url: '/images/hsk/generated/hsk12-doctor-patient.svg', alt: 'Hình minh họa tình huống y tế HSK 2' },
  'hsk30-l2-rea-p1-04': { url: '/images/hsk/sourced/clock-time.svg', alt: 'Hình minh họa thời gian khởi hành HSK 2' },
  'hsk30-l2-rea-p1-05': { url: '/images/hsk/sourced/open-window.svg', alt: 'Hình minh họa khung cửa sổ trong phòng HSK 2' },
  'hsk30-l2-rea-p1-06': { url: '/images/hsk/sourced/train-rail.svg', alt: 'Hình minh họa du lịch bằng tàu hỏa HSK 2' },
  'hsk30-l2-rea-p2-01': { url: '/images/hsk/generated/hsk12-rainy-mountain.svg', alt: 'Hình minh họa thời tiết leo núi HSK 2' },
  'hsk30-l2-rea-p2-02': { url: '/images/hsk/sourced/pencil-paper.svg', alt: 'Hình minh họa bài tập học tập HSK 2' },
  'hsk30-l2-rea-p2-03': { url: '/images/hsk/sourced/happy-smile.svg', alt: 'Hình minh họa hoạt động giải trí HSK 2' },
  'hsk30-l2-rea-p2-04': { url: '/images/hsk/sourced/pencil-paper.svg', alt: 'Hình minh họa giấy viết và bút chì HSK 2' },
  'hsk30-l2-rea-p2-05': { url: '/images/hsk/sourced/airplane-sky.svg', alt: 'Hình minh họa chuyến bay trên bầu trời HSK 2' },
  'hsk30-l2-rea-p2-06': { url: '/images/hsk/generated/hsk12-kitchen-cooking.svg', alt: 'Hình minh họa món ăn gia đình HSK 2' },
});

const HSK12_KEYWORD_RULES = [
  [/猫|椅子/, '/images/hsk/generated/hsk12-cat-under-chair.svg'],
  [/苹果|桌子|书包|水果/, '/images/hsk/sourced/apple-book-desk.svg'],
  [/图书馆|看书|读书/, '/images/hsk/generated/hsk12-library-reading.webp'],
  [/老师|教室|同学|学生|汉语|学校|写字/, '/images/hsk/generated/hsk12-classroom-teacher.webp'],
  [/喝茶|茶馆|热茶/, '/images/hsk/sourced/tea-cup.svg'],
  [/咖啡/, '/images/hsk/sourced/coffee-cup.svg'],
  [/做饭|厨房|菜|米饭/, '/images/hsk/generated/hsk12-kitchen-cooking.svg'],
  [/晚饭|吃饭|家|朋友|爸爸|妈妈/, '/images/hsk/generated/hsk12-family-dinner.svg'],
  [/出租车|坐车|火车站/, '/images/hsk/generated/hsk12-taxi-station.svg'],
  [/火车/, '/images/hsk/sourced/train-rail.svg'],
  [/飞机|机场|旅游/, '/images/hsk/generated/hsk12-airport-welcome.svg'],
  [/天气|晴天|热|不冷/, '/images/hsk/sourced/weather-sunny.svg'],
  [/下雨|雨|阴天|冷/, '/images/hsk/sourced/weather-rainy.svg'],
  [/医院|医生|看病|药|感冒/, '/images/hsk/generated/hsk12-doctor-patient.svg'],
  [/打电话|电话|手机/, '/images/hsk/sourced/phone-call.svg'],
  [/电视|看电视|电影|游泳/, '/images/hsk/generated/hsk12-watching-movie-home.svg'],
  [/几点|点|分钟|星期|昨天|明天|早/, '/images/hsk/sourced/clock-time.svg'],
  [/睡觉|起床|休息/, '/images/hsk/generated/hsk12-sleeping-waking.svg'],
  [/狗/, '/images/hsk/sourced/white-dog.svg'],
  [/衣服|裙子|买|商店/, '/images/hsk/generated/hsk12-shopping-red-dress.svg'],
  [/篮球|踢足球|跑步|运动/, '/images/hsk/generated/hsk12-basketball-friends.svg'],
  [/工作|公司|上班/, '/images/hsk/generated/hsk12-walking-to-office.svg'],
  [/铅笔|写|作业|纸/, '/images/hsk/sourced/pencil-paper.svg'],
  [/窗户/, '/images/hsk/sourced/open-window.svg'],
  [/高兴|开心/, '/images/hsk/sourced/happy-smile.svg'],
];

const HSK12_FALLBACK_POOL = [
  '/images/hsk/generated/hsk12-classroom-teacher.webp',
  '/images/hsk/generated/hsk12-library-reading.webp',
  '/images/hsk/generated/hsk12-drinking-tea.webp',
  '/images/hsk/sourced/apple-book-desk.svg',
  '/images/hsk/sourced/clock-time.svg',
  '/images/hsk/sourced/phone-call.svg',
  '/images/hsk/generated/hsk12-family-dinner.svg',
  '/images/hsk/generated/hsk12-walking-to-office.svg',
  '/images/hsk/sourced/weather-sunny.svg',
  '/images/hsk/generated/hsk12-doctor-patient.svg',
  '/images/hsk/generated/hsk12-kitchen-cooking.svg',
  '/images/hsk/sourced/tea-cup.svg',
];

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function normalizeHsk12Level(q, levelHint) {
  const raw = String(q?.level || levelHint || q?.exam_id || '').toUpperCase();
  if (/HSK\s*1\b|HSK1[-_]|HSK30-L1/.test(raw)) return 'HSK 1';
  if (/HSK\s*2\b|HSK2[-_]|HSK30-L2/.test(raw)) return 'HSK 2';
  return '';
}

function buildNeutralAlt(skill, level) {
  const skillLabel =
    skill === 'listening' ? 'nghe hiểu' : skill === 'writing' ? 'viết' : 'đọc hiểu';
  return `Hình minh họa câu hỏi ${skillLabel} ${level || 'HSK'}`.trim();
}

export function resolveQuestionImageAsset(q = {}, levelHint = '') {
  if (!q || typeof q !== 'object') return null;

  if (q.imageUrl && String(q.imageUrl).startsWith('/images/hsk/')) {
    return {
      imageUrl: q.imageUrl,
      imageAlt: q.imageAlt || buildNeutralAlt(q.part_type || q.skill, q.level || levelHint),
    };
  }

  const explicit = q.id ? EXPLICIT_QUESTION_IMAGE_MAP[q.id] : null;
  if (explicit) {
    return {
      imageUrl: explicit.url,
      imageAlt: explicit.alt,
    };
  }

  const hsk12Level = normalizeHsk12Level(q, levelHint);
  const skill = String(q.part_type || q.skill || q.section || '').toLowerCase();
  const part = Number(q.part_number || q.part || 1);

  if (hsk12Level && (skill === 'listening' || skill === 'reading') && (part === 1 || part === 2)) {
    const corpus = `${q.prompt || ''} ${q.audio_script || ''} ${q.audioScript || ''} ${q.audioText || ''} ${
      Array.isArray(q.options) ? q.options.map((o) => (typeof o === 'string' ? o : o?.text || '')).join(' ') : ''
    }`;
    for (const [regex, assetUrl] of HSK12_KEYWORD_RULES) {
      if (regex.test(corpus)) {
        return {
          imageUrl: assetUrl,
          imageAlt: buildNeutralAlt(skill, hsk12Level),
        };
      }
    }
    const idx = hashString(String(q.id || corpus || 'hsk')) % HSK12_FALLBACK_POOL.length;
    return {
      imageUrl: HSK12_FALLBACK_POOL[idx],
      imageAlt: buildNeutralAlt(skill, hsk12Level),
    };
  }

  return null;
}

export function enrichQuestionWithImageAsset(q = {}, levelHint = '') {
  const resolved = resolveQuestionImageAsset(q, levelHint);
  if (!resolved) return q;
  return {
    ...q,
    imageUrl: resolved.imageUrl,
    imageAlt: resolved.imageAlt,
  };
}
