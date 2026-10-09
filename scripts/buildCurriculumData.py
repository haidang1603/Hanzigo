# -*- coding: utf-8 -*-
"""
Full Curriculum Generator for HanziGo (HSK 1-3: 60 Lessons)
Strictly adheres to docs/HANZIGO_CHINESE_CURRICULUM.md v2.0
"""
import json
import os

lessons_meta = [
  # L1 (1-20)
  (101, 'ch-1', 'lvl-1', 1, '4 Thanh điệu & Nhóm thanh mẫu môi - đầu lưỡi', '四声与声母b, p, m, f; d, t, n, l', 'Nắm vững 4 cao độ thanh điệu chuẩn Bắc Kinh.', 'Nhận diện chuẩn 4 thanh điệu, phân biệt p/b.', 'Không có', ['mat-1', 'mat-8']),
  (102, 'ch-1', 'lvl-1', 2, 'Vận mẫu đơn a, o, e, i, u, ü & 8 Nét chữ Hán cơ bản', '单韵母与汉字八大基本笔画', 'Nguyên âm đơn cốt lõi và 8 nét bút nền móng.', 'Phát âm chuẩn âm tròn môi ü và viết đúng 8 nét cơ bản.', 'Bài 101', ['mat-4', 'mat-9']),
  (103, 'ch-1', 'lvl-1', 3, 'Nhóm âm khó: z, c, s vs zh, ch, sh, r & Quy tắc viết', '平翘舌音与汉字书写规则', 'Đập tan nỗi sợ âm đầu lưỡi và âm cuốn lưỡi.', 'Phân biệt rạch ròi z,c,s và zh,ch,sh,r.', 'Bài 102', ['mat-1', 'mat-4']),
  (104, 'ch-1', 'lvl-1', 4, 'Vận mẫu kép & 10 Bộ thủ thông dụng nhất (Phần 1)', '复韵母与前十大常用部首', 'Vận mẫu mũi an/ang và bộ thủ đoán nghĩa.', 'Nhận diện 10 bộ thủ phổ biến và âm mũi.', 'Bài 103', ['mat-4', 'mat-8']),
  (105, 'ch-1', 'lvl-1', 5, 'Quy tắc biến điệu thực chiến & Ôn tập Module 1.1', '变调实战与模块一复习', 'Làm chủ biến điệu thanh 3, biến điệu 不 và 一.', 'Nắm chắc 3 quy tắc biến điệu thực chiến.', 'Bài 104', ['mat-1', 'mat-8']),
  (106, 'ch-2', 'lvl-1', 6, 'Chào hỏi lịch sự, cảm ơn & tạm biệt', '礼貌问好、感谢与告别', 'Tự tin xưng hô với kính ngữ 您, cảm ơn đúng mực.', 'Chào hỏi tự tin, dùng kính ngữ 您.', 'Module 1.1', ['mat-1', 'mat-5']),
  (107, 'ch-2', 'lvl-1', 7, 'Câu chữ 是 & Trợ từ nghi vấn 吗', '是字句与吗字疑问句', 'Cấu trúc khẳng định, phủ định 不是 và câu hỏi 吗.', 'Sử dụng thành thạo câu chữ 是 và trợ từ 吗.', 'Bài 106', ['mat-1', 'mat-5']),
  (108, 'ch-2', 'lvl-1', 8, 'Họ tên & Quốc tịch với đại từ 什么, 哪', '姓名与国籍（什么、哪）', 'Tự tin hỏi tên và hỏi quốc tịch.', 'Làm chủ đại từ nghi vấn 什么 và 哪.', 'Bài 107', ['mat-1', 'mat-8']),
  (109, 'ch-2', 'lvl-1', 9, 'Số đếm 1–99 & Hỏi tuổi tác với 几, 多大', '数字1-99与年龄问答（几、多大）', 'Quy tắc ghép số 1-99 và phân biệt 几/多大.', 'Đếm trôi chảy 1-99 và hỏi tuổi chuẩn mực.', 'Bài 108', ['mat-1', 'mat-8']),
  (110, 'ch-2', 'lvl-1', 10, 'Ôn tập Module 1.2 & Thử thách giao tiếp nhập môn', '模块二总复习与入门沟通挑战', 'Tổng hợp đàm thoại làm quen kết bạn.', 'Đàm thoại làm quen 4-5 lượt lời tự nhiên.', 'Bài 109', ['mat-1', 'mat-2']),
  (111, 'ch-3', 'lvl-1', 11, 'Gia đình & Động từ sở hữu 有 / 没有', '家庭与动词“有/没有”', 'Nói về gia đình, lượng từ 口 và sở hữu 有/没有.', 'Nắm vững 有 và phủ định duy nhất 没有.', 'Module 1.2', ['mat-1', 'mat-5']),
  (112, 'ch-3', 'lvl-1', 12, 'Ngày tháng năm theo trật tự lớn đến bé', '年月日与星期（大到小规则）', 'Quy tắc thời gian Á Đông (Năm -> Tháng -> Ngày).', 'Nói chuẩn xác ngày tháng năm và thứ trong tuần.', 'Bài 111', ['mat-1', 'mat-5']),
  (113, 'ch-3', 'lvl-1', 13, 'Giờ giấc & Hoạt động thường nhật', '时间点与日常活动（现在几点）', 'Hỏi giờ, nói giờ hơn phút và lịch sinh hoạt.', 'Làm chủ 点 (giờ), 分 (phút), 半 (rưỡi).', 'Bài 112', ['mat-1', 'mat-5']),
  (114, 'ch-3', 'lvl-1', 14, 'Địa điểm & Động từ chỉ nơi chốn 在, 去', '地点与处所动词“在/去”（在哪儿）', 'Hỏi vị trí 在哪儿 và trật tự nơi chốn trước hành động.', 'Dùng đúng 在 và 去 chỉ địa điểm.', 'Bài 113', ['mat-1', 'mat-5']),
  (115, 'ch-3', 'lvl-1', 15, 'Mua sắm cơ bản & Hỏi giá tiền 多少钱', '基础购物与询价（多少钱、块）', 'Hỏi giá tiền 多少钱, tiền tệ 块 và cảm thán 太...了.', 'Hỏi giá thành thạo và nói câu cảm thán.', 'Bài 114', ['mat-1', 'mat-2']),
  (116, 'ch-4', 'lvl-1', 16, 'Đồ ăn thức uống & Sở thích 喜欢, 吃, 喝', '饮食偏好与动词“喜欢/吃/喝”', 'Món ăn yêu thích, đồ uống và cấu trúc 喜欢.', 'Bày tỏ sở thích ăn uống hàng ngày.', 'Module 1.3', ['mat-1', 'mat-2']),
  (117, 'ch-4', 'lvl-1', 17, 'Khả năng & Nguyện vọng với năng nguyện động từ 会, 想', '能愿动词“会/想”（我会说汉语）', 'Phân biệt 会 (biết qua học tập) và 想 (muốn/nhớ).', 'Dùng 会 nói kỹ năng và 想 nói mong muốn.', 'Bài 116', ['mat-1', 'mat-5']),
  (118, 'ch-4', 'lvl-1', 18, 'Giải trí & Thời tiết sơ cấp 冷, 热, 下雨', '休闲娱乐与基础天气（冷/热/下雨）', 'Miêu tả giải trí (看电影) và thời tiết nóng lạnh mưa.', 'Nhận xét thời tiết và nói hoạt động giải trí.', 'Bài 117', ['mat-1', 'mat-5']),
  (119, 'ch-4', 'lvl-1', 19, 'Tổng ôn tập toàn diện từ vựng & ngữ pháp HSK 1', 'HSK 1全真语法与核心150词汇大串讲', 'Hệ thống hóa 150 từ vựng cốt lõi và 48 ngữ pháp.', 'Làm chủ các dạng bài thi Nghe và Đọc HSK 1.', 'Bài 118', ['mat-1', 'mat-5', 'mat-8']),
  (120, 'ch-4', 'lvl-1', 20, 'Checkpoint Test HSK 1 (Thi thử mô phỏng 100% CTI)', 'HSK 1全真模拟大考与毕业冲刺', 'Đề thi thử chính thức HSK 1 mô phỏng chuẩn CTI.', 'Đạt chuẩn chứng chỉ HSK 1 và tốt nghiệp Level 1.', 'Bài 119', ['mat-1', 'mat-6']),

  # L2 (21-40)
  (201, 'ch-5', 'lvl-2', 1, 'Giờ giấc chi tiết, thói quen thức dậy & đi ngủ', '作息时间与日常起居（起床、睡觉、差、刻）', 'Giờ kém 差, khắc 刻 (15 phút) và thói quen sinh hoạt.', 'Nói chuẩn giờ kém và lịch sinh hoạt cá nhân.', 'HSK 1', ['mat-2', 'mat-5']),
  (202, 'ch-5', 'lvl-2', 2, 'Phương tiện giao thông công cộng & Cách đi lại', '公共交通与出行方式（坐出租车、地铁、公交）', 'Phương tiện công cộng và phân biệt 坐 vs 骑.', 'Sử dụng cấu trúc liên động chỉ phương tiện.', 'Bài 201', ['mat-2', 'mat-5']),
  (203, 'ch-5', 'lvl-2', 3, 'Diễn đạt khoảng cách không gian với giới từ 离', '空间距离表达与介词“离”（离很近/很远）', 'Khoảng cách giữa hai địa điểm với chữ 离.', 'Làm chủ giới từ 离 chỉ cự ly không gian.', 'Bài 202', ['mat-2', 'mat-5']),
  (204, 'ch-5', 'lvl-2', 4, 'Hỏi đường & Chỉ hướng với giới từ 往', '问路与方向指引（往左拐、往前走、路口）', 'Phương hướng rẽ trái phải, đi thẳng với chữ 往.', 'Hỏi đường và chỉ đường trôi chảy.', 'Bài 203', ['mat-2', 'mat-5']),
  (205, 'ch-5', 'lvl-2', 5, 'Ôn tập Module 2.1 & Thử thách bắt taxi, chỉ đường', '模块一复习与出租车实战挑战', 'Tổng kết giao thông và thực hành bắt taxi.', 'Xử lý tình huống bắt taxi và hướng dẫn dừng xe.', 'Bài 204', ['mat-2', 'mat-5']),
  (206, 'ch-6', 'lvl-2', 6, 'Đi nhà hàng & Gọi món quen thuộc', '餐厅点菜与特色佳肴（服务员、菜单、点菜）', 'Đọc thực đơn, gọi món đặc sản và khen món ngon.', 'Gọi món tại nhà hàng Trung Hoa tự tin.', 'Module 2.1', ['mat-2', 'mat-5']),
  (207, 'ch-6', 'lvl-2', 7, 'Khẩu vị & Dặn dò nhà bếp', '口味偏好与厨房叮嘱（辣、甜、不要放辣椒）', 'Miêu tả vị cay chua ngọt mặn và dặn dò đầu bếp.', 'Diễn đạt khẩu vị ăn uống cá nhân chuẩn xác.', 'Bài 206', ['mat-2', 'mat-5']),
  (208, 'ch-6', 'lvl-2', 8, 'Mua sắm quần áo, màu sắc & Size', '服装挑选与试穿（衣服、件、颜色、穿、试）', 'Hỏi size áo, màu sắc, lượng từ 件 và thử đồ.', 'Mua sắm trang phục tự tin.', 'Bài 207', ['mat-2', 'mat-5']),
  (209, 'ch-6', 'lvl-2', 9, 'Thanh toán tiền & Mặc cả', '结算付款与砍价技巧（打折、便宜、微信支付）', 'Hỏi giảm giá 打折, mặc cả và quét mã WeChat Pay.', 'Làm chủ kỹ năng mua sắm thanh toán số.', 'Bài 208', ['mat-2', 'mat-5']),
  (210, 'ch-6', 'lvl-2', 10, 'Ôn tập Module 2.2 & Thử thách đi chợ đêm mua sắm', '模块二复习与夜市购物实战', 'Tổng kết ẩm thực mua sắm và thách thức chợ đêm.', 'Tự tin đàm phán mua hàng và gọi đồ ăn vặt.', 'Bài 209', ['mat-2', 'mat-5']),
  (211, 'ch-7', 'lvl-2', 11, 'Bốn mùa & Hiện tượng thời tiết', '四季变迁与气候现象（刮风、下雪、阴晴）', 'Nói về xuân hạ thu đông và hiện tượng gió tuyết.', 'Miêu tả khí hậu và bốn mùa trong năm.', 'Module 2.2', ['mat-2', 'mat-5']),
  (212, 'ch-7', 'lvl-2', 12, 'Câu so sánh hơn với chữ 比', '比字句比较级基础（今天比昨天冷）', 'Cấu trúc so sánh hơn kinh điển A 比 B + Tính từ.', 'Sử dụng thành thạo câu chữ 比 và phủ định 没有.', 'Bài 211', ['mat-2', 'mat-5']),
  (213, 'ch-7', 'lvl-2', 13, 'So sánh mức độ nâng cao với 更, 最', '递进比较与最高级表达（更漂亮、最好）', 'So sánh hơn nữa với 更 và bậc nhất với 最.', 'Diễn đạt cấp độ so sánh nâng cao trôi chảy.', 'Bài 212', ['mat-2', 'mat-5']),
  (214, 'ch-7', 'lvl-2', 14, 'Sức khỏe & Đi khám bệnh', '身体健康与就医看病（生病、感冒、发烧、吃药）', 'Miêu tả triệu chứng ốm, cảm cúm, sốt và uống thuốc.', 'Giao tiếp tình huống y tế khám bệnh cơ bản.', 'Bài 213', ['mat-2', 'mat-5']),
  (215, 'ch-7', 'lvl-2', 15, 'Xin nghỉ phép & Lời khuyên sức khỏe', '请假调休与健康关怀（请假、休息、多喝水）', 'Viết tin nhắn xin phép nghỉ ốm và lời động viên.', 'Biết viết đơn/tin nhắn xin nghỉ phép lịch sự.', 'Bài 214', ['mat-2', 'mat-5']),
  (216, 'ch-8', 'lvl-2', 16, 'Trợ từ động thái 着 diễn đạt trạng thái duy trì', '动态助词“着”与状态持续（门开着、穿着）', 'Biểu thị trạng thái đang tiếp diễn duy trì với 着.', 'Làm chủ trợ từ động thái 着 trong miêu tả cảnh.', 'Module 2.3', ['mat-2', 'mat-5']),
  (217, 'ch-8', 'lvl-2', 17, 'Trợ từ động thái 过 diễn đạt trải nghiệm quá khứ', '动态助词“过”与过往经历（我去过北京）', 'Diễn đạt từng làm gì trong đời với chữ 过.', 'Kể lại các trải nghiệm trong quá khứ.', 'Bài 216', ['mat-2', 'mat-5']),
  (218, 'ch-8', 'lvl-2', 18, 'Cặp liên từ nguyên nhân - kết quả 因为...所以...', '因果关联复句（因为...所以...、虽然...但是...）', 'Kết nối câu phức logic nguyên nhân kết quả.', 'Sử dụng liên từ ghép câu mạch lạc.', 'Bài 217', ['mat-2', 'mat-5']),
  (219, 'ch-8', 'lvl-2', 19, 'Tổng ôn tập toàn diện hệ thống ngữ pháp HSK 2', 'HSK 2全真语法系统与300核心词汇盘点', 'Hệ thống 300 từ vựng và 96 điểm ngữ pháp HSK 2.', 'Sẵn sàng chinh phục bài thi mô phỏng CTI HSK 2.', 'Bài 218', ['mat-2', 'mat-5']),
  (220, 'ch-8', 'lvl-2', 20, 'Checkpoint Test HSK 2 (Thi thử mô phỏng 100% CTI)', 'HSK 2全真模拟毕业大考（35题通关）', 'Đề thi thử chuẩn CTI 35 câu (Nghe & Đọc hiểu).', 'Tốt nghiệp Level 2 và mở khóa Level 3.', 'Bài 219', ['mat-2', 'mat-6']),

  # L3 (41-60)
  (301, 'ch-9', 'lvl-3', 1, 'Đặt phòng khách sạn & Làm thủ tục check-in', '酒店预订与入住手续（预订、押金、退房）', 'Đặt phòng online, check-in, đặt cọc 押金 và hộ chiếu.', 'Xử lý trọn vẹn thủ tục khách sạn bản ngữ.', 'HSK 2', ['mat-3', 'mat-5']),
  (302, 'ch-9', 'lvl-3', 2, 'Tại sân bay & Thủ tục hành lý', '机场值机与行李托运（登机、行李、起飞、准时）', 'Thủ tục làm thủ tục lên máy bay, gửi hành lý.', 'Giao tiếp thông thạo tại quầy sân bay.', 'Bài 301', ['mat-3', 'mat-5']),
  (303, 'ch-9', 'lvl-3', 3, 'Bổ ngữ Xu hướng Đơn với 来 và 去', '简单趋向补语（进/出/上/下/回/过/起 + 来/去）', 'Hành động hướng về người nói (来) hay xa người nói (去).', 'Làm chủ bổ ngữ xu hướng đơn.', 'Bài 302', ['mat-3', 'mat-5']),
  (304, 'ch-9', 'lvl-3', 4, 'Bổ ngữ Xu hướng Kép diễn tả chuyển động phức tạp', '复合趋向补语（跑出来、走过去、拿回来）', 'Chuyển động phức tạp đa tầng trong không gian.', 'Diễn đạt hành động chuyển động sinh động.', 'Bài 303', ['mat-3', 'mat-5']),
  (305, 'ch-9', 'lvl-3', 5, 'Ôn tập Module 3.1 & Xử lý tình huống du lịch tự túc', '模块一复习与自由行应变挑战', 'Tổng kết du lịch và xử lý phát sinh tại sân bay/khách sạn.', 'Tự xử lý chuyến du lịch độc lập tại Trung Quốc.', 'Bài 304', ['mat-3', 'mat-5']),
  (306, 'ch-10', 'lvl-3', 6, 'Bổ ngữ Kết quả cơ bản 完, 好, 懂, 见, 找到', '结果补语基础（做完、学好、听懂、看见）', 'Nền tảng của câu chữ 把: hành động và kết quả đạt được.', 'Làm chủ bổ ngữ kết quả sau động từ.', 'Module 3.1', ['mat-3', 'mat-5']),
  (307, 'ch-10', 'lvl-3', 7, 'Bổ ngữ Khả năng diễn đạt có thể hay không', '可能补语（看得懂、听不清楚、做不完）', 'Diễn đạt có thể hay không thể đạt được kết quả.', 'Phân biệt bổ ngữ khả năng và năng nguyện động từ.', 'Bài 306', ['mat-3', 'mat-5']),
  (308, 'ch-10', 'lvl-3', 8, 'Linh hồn ngữ pháp: Câu chữ 把 căn bản', '把字句核心精髓（S + 把 + O + V + 其他）', 'Cấu trúc tác động làm biến đổi tân ngữ xác định.', 'Làm chủ câu chữ 把 căn bản không sai sót.', 'Bài 307', ['mat-3', 'mat-5']),
  (309, 'ch-10', 'lvl-3', 9, 'Câu chữ 把 nâng cao với Bổ ngữ kết quả & Xu hướng', '把字句进阶演练（把书放好、把桌子擦干净）', 'Kết hợp câu chữ 把 với bổ ngữ kết quả và xu hướng.', 'Sử dụng câu chữ 把 uyển chuyển như bản ngữ.', 'Bài 308', ['mat-3', 'mat-5']),
  (310, 'ch-10', 'lvl-3', 10, 'Câu bị động chữ 被', '被动句语法解析（S + 被 + 施事者 + V + 其他）', 'Diễn đạt sự việc bị động hoặc sự cố ngoài ý muốn.', 'Phân biệt cấu trúc câu chữ 把 và câu chữ 被.', 'Bài 309', ['mat-3', 'mat-5']),
  (311, 'ch-11', 'lvl-3', 11, 'Môi trường văn phòng & Đồng nghiệp', '职场办公环境与同仁交往（经理、同事、开会）', 'Giao tiếp nơi công sở, chức danh quản lý và cuộc họp.', 'Sử dụng từ ngữ văn phòng chuẩn mực.', 'Module 3.2', ['mat-3', 'mat-5']),
  (312, 'ch-11', 'lvl-3', 12, 'Giải quyết vấn đề & Kế hoạch làm việc', '难题化解与工作计划（解决、问题、认真、完成）', 'Báo cáo tiến độ, giải quyết khúc mắc trong công việc.', 'Trình bày giải pháp công việc mạch lạc.', 'Bài 311', ['mat-3', 'mat-5']),
  (313, 'ch-11', 'lvl-3', 13, 'Môi trường đại học, thi cử & Điểm số', '大学校园、考试与成绩（大学、成绩、努力、毕业）', 'Đời sống giảng đường, cố gắng học tập và tốt nghiệp.', 'Kể về việc học tập đại học và mục tiêu tương lai.', 'Bài 312', ['mat-3', 'mat-5']),
  (314, 'ch-11', 'lvl-3', 14, 'Cảm xúc, tính cách & Mối quan hệ bạn bè', '情感情绪与性格特征（高兴、难过、生气、聪明）', 'Miêu tả tính cách con người và trạng thái cảm xúc.', 'Bộc lộ cảm xúc và nhận xét tính cách bạn bè.', 'Bài 313', ['mat-3', 'mat-5']),
  (315, 'ch-11', 'lvl-3', 15, 'Trợ từ kết cấu 的, 地, 得 (Phân biệt 3 chữ Đích)', '结构助词“的/地/得”全景辨析', 'Xóa tan nhầm lẫn kinh điển giữa 的, 地 và 得.', 'Dùng chính xác tuyệt đối 3 trợ từ kết cấu.', 'Bài 314', ['mat-3', 'mat-5']),
  (316, 'ch-12', 'lvl-3', 16, 'Thành ngữ 4 chữ thông dụng trong đời sống', '日常高频成语（入乡随俗、马马虎虎、干干净净）', 'Làm quen thành ngữ 4 chữ quen thuộc trong giao tiếp.', 'Ứng dụng thành ngữ đúng ngữ cảnh đời sống.', 'Module 3.3', ['mat-3', 'mat-10']),
  (317, 'ch-12', 'lvl-3', 17, 'Kể lại một câu chuyện ngắn bằng tiếng Trung', '短篇故事叙述与逻辑衔接（首先、然后、最后）', 'Sắp xếp trật tự tình tiết câu chuyện với liên từ chuỗi.', 'Kể lại một trải nghiệm cá nhân mạch lạc 2 phút.', 'Bài 316', ['mat-3', 'mat-5']),
  (318, 'ch-12', 'lvl-3', 18, 'Đọc hiểu đoạn văn phân cấp HSK 3 & Chiến thuật', 'HSK 3阅读段落实战与答题攻略', 'Kỹ thuật định vị từ khóa và đọc hiểu nhanh.', 'Nâng cao tốc độ đọc hiểu văn bản 150-200 từ.', 'Bài 317', ['mat-3', 'mat-6']),
  (319, 'ch-12', 'lvl-3', 19, 'Tổng ôn tập toàn diện hệ thống HSK 1–3', 'HSK 1-3全景语法大汇总之终极冲刺', 'Ôn tập 600 từ vựng và 144 điểm ngữ pháp HSK 1-3.', 'Đạt sự tự tin tối đa trước kỳ thi đánh giá năng lực.', 'Bài 318', ['mat-3', 'mat-5', 'mat-6']),
  (320, 'ch-12', 'lvl-3', 20, 'Boss Challenge HSK 3 (Đề thi thử 80 câu CTI & HSKK)', 'HSK 3终极挑战：80题全真大考与口语考核', 'Đại khảo hạch HSK 3 (Nghe, Đọc, Viết & Nói HSKK).', 'Chinh phục toàn diện mốc giao tiếp độc lập HSK 3.', 'Bài 319', ['mat-3', 'mat-6'])
]

print(f"Total lesson blueprints configured: {len(lessons_meta)}")

# We will load our detailed lessons from the previous file for 101-115,
# and programmatically synthesize complete, rich pedagogical data for 116-320!
