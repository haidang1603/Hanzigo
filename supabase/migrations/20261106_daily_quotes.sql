-- =========================================================================
-- HANZI GO - MIGRATION: DAILY PROVERBS & QUOTES
-- =========================================================================
-- Bảng daily_quotes: 60 câu châm ngôn, danh ngôn Hán học đổi mỗi ngày
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.daily_quotes (
  id SERIAL PRIMARY KEY,
  hanzi TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  meaning TEXT NOT NULL,
  author TEXT DEFAULT '',
  hsk_level TEXT DEFAULT 'HSK 1',
  is_hidden BOOLEAN DEFAULT false,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_daily_quotes_hanzi UNIQUE (hanzi)
);

-- Chỉ mục tối ưu
CREATE INDEX IF NOT EXISTS idx_daily_quotes_level ON public.daily_quotes(hsk_level, is_hidden);
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_quotes_hanzi ON public.daily_quotes(hanzi);

-- Kích hoạt Row Level Security (RLS)
ALTER TABLE public.daily_quotes ENABLE ROW LEVEL SECURITY;

-- Chính sách bảo mật RLS (Công chúng đọc, Admin quản trị)
DROP POLICY IF EXISTS "daily_quotes_select_public" ON public.daily_quotes;
CREATE POLICY "daily_quotes_select_public" ON public.daily_quotes 
  FOR SELECT USING (is_hidden = false OR public.is_admin());

DROP POLICY IF EXISTS "daily_quotes_admin_all" ON public.daily_quotes;
CREATE POLICY "daily_quotes_admin_all" ON public.daily_quotes 
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Dữ liệu khởi tạo (Seed data): 60 câu châm ngôn tiếng Trung
INSERT INTO public.daily_quotes (hanzi, pinyin, meaning, author)
VALUES
  ('千里之行，始于足下', 'Qiānlǐ zhī xíng, shǐ yú zúxià', 'Hành trình vạn dặm bắt đầu từ một bước chân.', 'Lão Tử — Đạo Đức Kinh'),
  ('学而时习之，不亦说乎', 'Xué ér shí xí zhī, bù yì yuè hū', 'Học rồi thường xuyên ôn tập rèn luyện, chẳng phải vui lắm sao!', 'Khổng Tử — Luận Ngữ'),
  ('温故而知新，可以为师矣', 'Wēn gù ér zhī xīn, kě yǐ wéi shī yǐ', 'Ôn lại điều cũ để thấu hiểu điều mới, xứng đáng làm người dẫn đường.', 'Khổng Tử — Luận Ngữ'),
  ('书山有路勤为径，学海无涯苦作舟', 'Shū shān yǒu lù qín wéi jìng, xué hǎi wú yá kǔ zuò zhōu', 'Núi sách có đường, siêng năng là lối; biển học vô bờ, khổ luyện làm thuyền.', 'Hàn Dũ'),
  ('业精于勤，荒于嬉', 'Yè jīng yú qín, huāng yú xī', 'Sự nghiệp tinh tường nhờ chăm chỉ, tiêu tán vì lười biếng ham chơi.', 'Hàn Dũ — Tiến Học Giải'),
  ('活到老，学到老', 'Huó dào lǎo, xué dào lǎo', 'Sống đến già, học đến già — Học tập là hành trình trọn đời.', 'Ngạn ngữ dân gian'),
  ('敏而好学，不耻下问', 'Mǐn ér hào xué, bù chǐ xià wèn', 'Thông minh chăm học, không ngại thắc mắc và học hỏi từ bất cứ ai.', 'Khổng Tử — Luận Ngữ'),
  ('三人行，必有我师焉', 'Sān rén xíng, bì yǒu wǒ shī yān', 'Ba người cùng đi, ắt có người là thầy của ta.', 'Khổng Tử — Luận Ngữ'),
  ('水滴石穿，绳锯木断', 'Shuǐ dī shí chuān, shéng jù mù duàn', 'Nước chảy đá mòn, dây cưa gỗ đứt — Kiên trì ắt làm nên đại sự.', 'La Đại Kinh — Hạc Lâm Ngọc Lộ'),
  ('持之以恒，金石可镂', 'Chí zhī yǐ héng, jīn shí kě lòu', 'Kiên trì bền bỉ, sắt đá ngàn năm cũng có thể khắc chạm thành tác phẩm.', 'Tuân Tử — Khuyến Học'),
  ('读万卷书，行万里路', 'Dú wàn juàn shū, xíng wàn lǐ lù', 'Đọc vạn cuốn sách, đi vạn dặm đường — Kết hợp tri thức và trải nghiệm.', 'Đổng Kỳ Xương'),
  ('宝剑锋从磨砺出，梅花香自苦寒来', 'Bǎojiàn fēng cóng mólì chū, méihuā xiāng zì kǔhán lái', 'Gươm báu sắc bén nhờ mài giũa, hoa mai ngát hương vượt gió sương.', 'Cảnh Thế Hiền Văn'),
  ('不积跬步，无以至千里', 'Bù jī kuǐbù, wú yǐ zhì qiānlǐ', 'Không tích lũy từng bước nhỏ, khó mà chạm đến đỉnh cao ngàn dặm.', 'Tuân Tử — Khuyến Học'),
  ('一寸光阴一寸金，寸金难买寸光阴', 'Yí cùn guāngyīn yí cùn jīn, cùn jīn nán mǎi cùn guāngyīn', 'Một tấc thời gian một tấc vàng, tấc vàng khó mua tấc thời gian.', 'Hoài Nam Tử'),
  ('少壮不努力，老大徒伤悲', 'Shào zhuàng bù nǔlì, lǎo dà tú shāngbēi', 'Thời trẻ không gắng sức học hỏi, về già đành xót xa nuối tiếc.', 'Trường Ca Hành — Nhạc Phủ Thi Tập'),
  ('知之者不如好之者，好之者不如乐之者', 'Zhī zhī zhě bùrú hào zhī zhě, hào zhī zhě bùrú lè zhī zhě', 'Biết học không bằng thích học, thích học không bằng say mê tìm tòi.', 'Khổng Tử — Luận Ngữ'),
  ('发奋图强，坚持不懈', 'Fā fèn tú qiáng, jiān chí bú xiè', 'Quyết chí vươn lên, kiên trì bền bỉ không chùn bước.', 'Thành ngữ Hán Việt'),
  ('风雨过后，终见彩虹', 'Fēng yǔ guò hòu, zhōng jiàn cǎi hóng', 'Vượt qua gió mưa giông bão, cầu vồng rạng rỡ sẽ hiện ra.', 'Tục ngữ hiện đại'),
  ('师傅领进门，修行在个人', 'Shīfu lǐng jìn mén, xiūxíng zài gèrén', 'Thầy dẫn dắt vào cửa, thành tựu sâu sắc phụ thuộc nỗ lực bản thân.', 'Ngạn ngữ truyền thống'),
  ('路遥知马力，日久见人心', 'Lù yáo zhī mǎ lì, rì jiǔ jiàn rén xīn', 'Đường xa mới tỏ sức bền của ngựa, ngày dài mới thấu lòng dạ chân thành.', 'Vô Danh Thị'),
  ('有志者，事竟成', 'Yǒu zhì zhě, shì jìng chéng', 'Người có ý chí kiên định thì mọi việc đều có thể hoàn thành.', 'Phạm Diệp — Hậu Hán Thư'),
  ('熟能生巧', 'Shú néng shēng qiǎo', 'Trăm hay không bằng tay quen — Luyện tập đều đặn ắt trở nên tinh tế.', 'Âu Dương Tu — Quy Điền Lục'),
  ('欲速则不达', 'Yù sù zé bù dá', 'Dục tốc bất đạt — Nóng vội muốn nhanh thì không chạm tới đích bền vững.', 'Khổng Tử — Luận Ngữ'),
  ('海纳百川，有容乃大', 'Hǎi nà bǎi chuān, yǒu róng nǎi dà', 'Biển dung nạp trăm sông nên hóa bao la; người bao dung mới thành bậc lớn.', 'Lâm Tắc Từ'),
  ('学如逆水行舟，不进则退', 'Xué rú nì shuǐ xíng zhōu, bù jìn zé tuì', 'Học tập tựa thuyền bơi ngược dòng nước, nếu không tiến ắt phải lùi.', 'Lương Khải Siêu'),
  ('千里之堤，溃于蚁穴', 'Qiānlǐ zhī dī, kuì yú yǐ xué', 'Đê dài ngàn dặm có thể sụp vì tổ kiến nhỏ — Cẩn trọng từng chi tiết.', 'Hàn Phi Tử — Dụ Lão'),
  ('博学之，审问之，慎思之，明辨之，笃行之', 'Bó xué zhī, shěn wèn zhī, shèn sī zhī, míng biàn zhī, dǔ xíng zhī', 'Học rộng, hỏi kỹ, suy nghĩ cẩn trọng, phân định sáng tỏ, dốc lòng thực hành.', 'Lễ Ký — Trung Dung'),
  ('学而不思则罔，思而不学则殆', 'Xué ér bù sī zé wǎng, sī ér bù xué zé dài', 'Học mà không suy nghĩ thì mơ hồ, suy nghĩ mà không học thì nguy hại.', 'Khổng Tử — Luận Ngữ'),
  ('日日行，不怕千万里；常常做，不怕千万事', 'Rì rì xíng, bú pà qiān wàn lǐ; cháng cháng zuò, bú pà qiān wàn shì', 'Mỗi ngày đều bước đi chẳng ngại vạn dặm xa; thường xuyên bắt tay làm chẳng ngại muôn việc.', 'Tục ngữ Khuyến học'),
  ('锲而不舍，朽木不折；锲而舍之，金石可镂', 'Qiè ér bù shě, xiǔ mù bù zhé; qiè ér shě zhī, jīn shí kě lòu', 'Chỉ cần không bỏ dở giữa chừng, thì vàng đá cũng có thể khắc nên hoa gấm.', 'Tuân Tử — Khuyến Học'),
  ('冰冻三尺，非一日之寒', 'Bīng dòng sān chǐ, fēi yī rì zhī hán', 'Băng dày ba thước chẳng phải vì cái rét một ngày — Thành quả do tích lũy dài lâu.', 'Vương Sung — Luận Hành'),
  ('世上无难事，只怕有心人', 'Shìshàng wú nánshì, zhǐ pà yǒuxīnrén', 'Trên đời không có việc gì khó, chỉ sợ lòng người không bền chí.', 'Tục ngữ kinh điển'),
  ('只要功夫深，铁杵磨成针', 'Zhǐ yào gōngfu shēn, tiěchǔ mó chéng zhēn', 'Chỉ cần có lòng kiên nhẫn và công phu sâu dày, chày sắt cũng có ngày mài thành kim.', 'Ngạn ngữ dân gian'),
  ('博观而约取，厚积而薄发', 'Bó guān ér yuē qǔ, hòu jī ér bó fā', 'Đọc rộng để chắt lọc tinh hoa, tích lũy kiến thức sâu dày rồi mới bộc lộ sắc sảo.', 'Tô Thức — Tạ Giáo Thụ Thư'),
  ('工欲善其事，必先利其器', 'Gōng yù shàn qí shì, bì xiān lì qí qì', 'Người thợ muốn làm tốt công việc, trước hết ắt phải mài sắc công cụ.', 'Khổng Tử — Luận Ngữ'),
  ('天行健，君子以自强不息', 'Tiān xíng jiàn, jūnzǐ yǐ zìqiáng bù xī', 'Đạo trời vận hành mạnh mẽ khôn cùng, người quân tử noi theo không ngừng tự rèn luyện vươn lên.', 'Chu Dịch — Càn Quái'),
  ('知之为知之，不知为不知，是知也', 'Zhī zhī wéi zhī zhī, bù zhī wéi bù zhī, shì zhī yě', 'Biết thì nói là biết, không biết thì nhận là không biết, ấy mới đích thực là người hiểu biết.', 'Khổng Tử — Luận Ngữ'),
  ('玉不琢，不成器；人不学，不知义', 'Yù bù zhuó, bù chéng qì; rén bù xué, bù zhī yì', 'Ngọc chẳng qua mài giũa khó thành ngọc quý; người không chăm học sao hiểu nghĩa nhân và thấu tỏ đạo lý ở đời.', 'Tam Tự Kinh'),
  ('见贤思齐焉，见不贤而内自省也', 'Jiàn xián sī qí yān, jiàn bù xián ér nèi zì xǐng yě', 'Thấy người đức tài thì mong học theo, thấy người chưa tốt thì tự soi lại tâm mình.', 'Khổng Tử — Luận Ngữ'),
  ('非淡泊无以明志，非宁静无以致远', 'Fēi dànbó wú yǐ míng zhì, fēi níngjìng wú yǐ zhì yuǎn', 'Tâm không thanh đạm khó tỏ tường ý chí, lòng không tĩnh lặng khó nhìn thấy chân trời xa.', 'Gia Cát Lượng — Giới Tử Thư'),
  ('精诚所至，金石为开', 'Jīngchéng suǒ zhì, jīnshí wéi kāi', 'Lòng chân thành sâu sắc tột bậc, đến cả sắt đá ngàn năm cũng phải mở lối.', 'Hậu Hán Thư — Quảng Lăng Hư Liệt Truyện'),
  ('己所不欲，勿施于人', 'Jǐ suǒ bù yù, wù shī yú rén', 'Điều bản thân mình không muốn thì chớ đem áp đặt lên người khác; lấy lòng khoan dung đối đãi thế gian.', 'Khổng Tử — Luận Ngữ'),
  ('莫等闲，白了少年头，空悲切', 'Mò děng xián, bái le shàonián tóu, kōng bēi qiè', 'Chớ để thời gian tuổi trẻ trôi qua uổng phí, kẻo đến khi đầu bạc lại luống ngậm ngùi đau xót.', 'Nhạc Phi — Mãn Giang Hồng'),
  ('路漫漫其修远兮，吾将上下而求索', 'Lù mànmàn qí xiūyuǎn xī, wú jiāng shàngxià ér qiúsuǒ', 'Đường đời dẫu thăm thẳm xa xôi muôn trùng, ta vẫn quyết chí kiếm tìm chân lý tới cùng.', 'Khuất Nguyên — Ly Tao'),
  ('问渠那得清如许？为有源头活水来', 'Wèn qú nǎ dé qīng rú xǔ? Wèi yǒu yuántóu huóshuǐ lái', 'Hỏi dòng kênh sao mà trong trẻo đến nhường ấy? Bởi vì luôn có dòng nước nguồn tươi mới rót về.', 'Chu Hi — Quan Thư Hữu Cảm'),
  ('知己知彼，百战不殆', 'Zhī jǐ zhī bǐ, bǎi zhàn bù dài', 'Biết mình biết người, trăm trận không nguy khốn.', 'Tôn Tử — Tôn Tử Binh Pháp'),
  ('纸上得来终觉浅，绝知此事要躬行', 'Zhǐ shàng dé lái zhōng jué qiǎn, jué zhī cǐ shì yào gōng xíng', 'Tri thức học trên trang giấy rốt cuộc vẫn nông cạn, muốn hiểu thấu triệt ắt phải đích thân thực hành.', 'Lục Du — Đông Dạ Độc Thư Ký Tử Du'),
  ('欲穷千里目，更上一层楼', 'Yù qióng qiānlǐ mù, gèng shàng yì céng lóu', 'Muốn thu vào tầm mắt cảnh sắc vạn dặm xa xôi, hãy bước chân lên thêm một tầng lầu nữa.', 'Vương Chi Hoán — Đăng Quán Tước Lâu'),
  ('合抱之木，生于毫末；九层之台，起于累土', 'Hébào zhī mù, shēng yú háomò; jiǔ céng zhī tái, qǐ yú lěi tǔ', 'Cây to một ôm tay nảy mầm từ hạt non bé xíu; đài cao chín tầng khởi dựng từ từng vốc đất gom lại.', 'Lão Tử — Đạo Đức Kinh'),
  ('学而不厌，诲人不倦', 'Xué ér bù yàn, huì rén bù juàn', 'Học tập cho bản thân không bao giờ biết chán, truyền dạy cho người khác không bao giờ biết mệt mỏi.', 'Khổng Tử — Luận Ngữ'),
  ('不入虎穴，焉得虎子', 'Bù rù hǔ xué, yān dé hǔ zǐ', 'Không mạo hiểm vào tận hang hùm, sao có thể bắt được cọp con — Dám dấn thân mới gặt hái đại thành.', 'Ban Siêu — Hậu Hán Thư'),
  ('近朱者赤，近墨者黑', 'Jìn zhū zhě chì, jìn mò zhě hēi', 'Gần son thì đỏ, gần mực thì đen — Môi trường học tập và bạn đồng hành quyết định tương lai.', 'Phó Huyền — Thái Tử Thiểu Phó Châm'),
  ('良药苦口利于病，忠言逆耳利于行', 'Liáng yào kǔ kǒu lì yú bìng, zhōng yán nì ěr lì yú xíng', 'Thuốc tốt đắng miệng nhưng chữa được bệnh tật; lời can ngăn chân thành nghịch tai nhưng giúp ích hành xử.', 'Khổng Tử Gia Ngữ'),
  ('盛年不重来，一日难再晨。及时当勉励，岁月不待人', 'Shèngnián bù chóng lái, yí rì nán zài chén. Jíshí dāng miǎnlì, suìyuè bù dài rén', 'Tuổi xuân chẳng đến hai lần, một ngày không có hai sớm mai. Hãy tự nhủ nỗ lực ngay hôm nay, năm tháng chẳng chờ ai.', 'Đào Uyên Minh — Tạp Thi'),
  ('临渊羡鱼，不如退而结网', 'Lín yuān xiàn yú, bù rú tuì ér jié wǎng', 'Đứng trông xuống vực thẳm ao ước có cá, chi bằng lùi lại đan chiếc lưới cho thật chắc chắn.', 'Hoài Nam Tử'),
  ('尺有所短，寸有所长', 'Chǐ yǒu suǒ duǎn, cùn yǒu suǒ cháng', 'Thước dài cũng có lúc ngắn, tấc nhỏ cũng có điểm sở trường — Ai cũng có điểm mạnh để phát huy.', 'Sở Từ — Bốc Cư'),
  ('读书破万卷，下笔如有神', 'Dú shū pò wàn juàn, xià bǐ rú yǒu shén', 'Đọc thấu vạn cuốn sách hay, khi hạ bút câu chữ tuôn trào tựa có thần trợ giúp.', 'Đỗ Phủ — Phụng Tặng Vi Tả Thừa'),
  ('行百里者半九十', 'Xíng bǎilǐ zhě bàn jiǔshí', 'Người đi đường trăm dặm, đi được chín mươi dặm mới xem như xong một nửa — Càng gần đích càng phải kiên cường.', 'Chiến Quốc Sách — Tần Sách'),
  ('苟日新，日日新，又日新', 'Gǒu rì xīn, rì rì xīn, yòu rì xīn', 'Nếu ngày hôm nay đổi mới tiến bộ, hãy giữ cho mỗi ngày đều tiến bộ, ngày ngày không ngừng tự vượt lên mình.', 'Lễ Ký — Đại Học'),
  ('海阔凭鱼跃，天高任鸟飞', 'Hǎi kuò píng yú yuè, tiān gāo rèn niǎo fēi', 'Biển rộng thênh thang thỏa sức cá nhảy lượn, trời cao lồng lộng mặc cho chim tung cánh bay xa.', 'Nguyễn Duyệt — Thi Thoại')
ON CONFLICT (hanzi) DO UPDATE SET
  pinyin = EXCLUDED.pinyin,
  meaning = EXCLUDED.meaning,
  author = EXCLUDED.author;
