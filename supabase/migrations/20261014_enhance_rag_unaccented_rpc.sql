-- =========================================================================
-- HANZIGO RAG - NÂNG CẤP TRUY VẤN PINYIN KHÔNG DẤU & CHỮ PHỒN THỂ
-- Cập nhật cột pinyin_numbered, traditional và hàm RPC match_rag_knowledge
-- Dung lượng siêu nhẹ (~45KB), chạy trong 1 giây trên Supabase SQL Editor
-- =========================================================================

-- 1. Cập nhật cột search_tokens hỗ trợ đa biến thể Pinyin
ALTER TABLE public.rag_knowledge_chunks DROP COLUMN IF EXISTS search_tokens;
ALTER TABLE public.rag_knowledge_chunks ADD COLUMN search_tokens tsvector GENERATED ALWAYS AS (
  to_tsvector('simple', 
    coalesce(simplified, '') || ' ' || 
    coalesce(traditional, '') || ' ' || 
    coalesce(pinyin, '') || ' ' || 
    coalesce(pinyin_numbered, '') || ' ' || 
    coalesce(vietnamese_meaning, '') || ' ' || 
    coalesce(pedagogical_notes, '') || ' ' || 
    coalesce(grammar_pattern, '')
  )
) STORED;

CREATE INDEX IF NOT EXISTS idx_rag_chunks_search_tokens 
ON public.rag_knowledge_chunks 
USING gin (search_tokens);

-- 2. Cập nhật pinyin_numbered (biến thể không dấu) và chữ phồn thể
DO $$
BEGIN
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'wo',
    traditional = '我'
  WHERE chunk_key = 'c580c549f1012256b95adc9dae7ba4ed';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ni',
    traditional = '你'
  WHERE chunk_key = '383f7c5930daea1e25c7e576b454befa';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ta',
    traditional = '他'
  WHERE chunk_key = 'aa96f7ceb1707aa8a8ceaf59d09832ad';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ta',
    traditional = '她'
  WHERE chunk_key = 'a1fa1e3370df2edcd44cd95fc429a00b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'women',
    traditional = '我们'
  WHERE chunk_key = '8ab715b6a6b974cf5657d0ce142b12a8';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhe',
    traditional = '这'
  WHERE chunk_key = 'add5d43fffd23a08e8b7fa1de9c73053';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'na',
    traditional = '那'
  WHERE chunk_key = 'f2ee09fc43b6770a557415cb0ee662a0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'na',
    traditional = '哪'
  WHERE chunk_key = 'af57043dbc5fa4385a5625c02067446e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shei',
    traditional = '谁'
  WHERE chunk_key = '9f8b20a3b92b63e5756f476e54dbcb1e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shenme',
    traditional = '什么'
  WHERE chunk_key = '4c6191408aec2c2973701b3f99b80c23';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ji',
    traditional = '幾'
  WHERE chunk_key = '1dc8ab3565d74095e03cdc3a9b6ed5bd';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zenme',
    traditional = '怎么'
  WHERE chunk_key = 'f4a2e4ae95d4d89f805534dea094b051';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zenmeyang',
    traditional = '怎么样'
  WHERE chunk_key = 'ca26b63bd04623826a4c93fb331a9691';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ni hao nihao',
    traditional = '你好'
  WHERE chunk_key = '47ee689f29b867c1f45c8dad5164f088';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiexie',
    traditional = '謝謝'
  WHERE chunk_key = '8dd27679d86a1a4e06245244247c56c5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zaijian',
    traditional = '再見'
  WHERE chunk_key = '14f9ccaa6614c021a468fc9075597bb2';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'bu keqi bukeqi',
    traditional = '不客气'
  WHERE chunk_key = '3cb67220ccdbec01fa0d3c6a1ba9e17c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'duibuqi',
    traditional = '對不起'
  WHERE chunk_key = 'dc609399e673fe8b585e8840e776f020';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mei guanxi meiguanxi',
    traditional = '沒關係'
  WHERE chunk_key = '225d37f629598101ff10ea2f38418b1c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qing',
    traditional = '请'
  WHERE chunk_key = 'e3aea7d6eff221a607d0dcb38a916c4b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ling',
    traditional = '零'
  WHERE chunk_key = '776cd65133b8da2a9666713bb254ad1b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yi',
    traditional = '一'
  WHERE chunk_key = 'b4243684cc91e98dc9f82a38783d322c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'er',
    traditional = '二'
  WHERE chunk_key = '2b2b09b4c515b759d66797991c7ad6a1';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'san',
    traditional = '三'
  WHERE chunk_key = '409895cc134dc80e391b5615193c7f51';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'si',
    traditional = '四'
  WHERE chunk_key = '93c14be7d94782a76c50650b65a52dc8';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'wu',
    traditional = '五'
  WHERE chunk_key = '067b833ad97616a3c5c5be44a7904655';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'liu',
    traditional = '六'
  WHERE chunk_key = '263a09583a4e80e2117e32c715e879cf';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qi',
    traditional = '七'
  WHERE chunk_key = 'bf0226b7b2dd177271a172a884394b5d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ba',
    traditional = '八'
  WHERE chunk_key = 'c03ffaefd2f3dec0a0c3f6bca7b8ef17';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jiu',
    traditional = '九'
  WHERE chunk_key = '8b762a87aab2579487e807e2cf70781c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shi',
    traditional = '十'
  WHERE chunk_key = '5dd131784df9612e88933d0633a13c20';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'bai',
    traditional = '百'
  WHERE chunk_key = 'e5a1d6abb130d63df3a48725546212d6';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'baba',
    traditional = '爸爸'
  WHERE chunk_key = '0ab2e507169ebcfe9647c7e3ac64fb3d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mama',
    traditional = '妈妈'
  WHERE chunk_key = 'c20a930a6f1605603e7c2e94c0f7102a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'erzi',
    traditional = '儿子'
  WHERE chunk_key = '5d3dfc726acc809cdbf5de14d0ca893d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'nü’er nv’er nu’er',
    traditional = '女儿'
  WHERE chunk_key = '7abdb26fd83182afa74f823006796936';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jia',
    traditional = '家'
  WHERE chunk_key = 'a5b67a7c2dbce872b1e7219a68cee435';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ren',
    traditional = '人'
  WHERE chunk_key = 'd9e162f8afcf27ae54d2ece5745c19e4';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'pengyou',
    traditional = '朋友'
  WHERE chunk_key = '705b7c2c0e367f19c3af240e3f2b71f2';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'laoshi',
    traditional = '老師'
  WHERE chunk_key = '51544afae1e3c6b120a3058e1ec8317c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xuesheng',
    traditional = '學生'
  WHERE chunk_key = 'babed24ae1779cbc4369bb88d7aad831';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'tongxue',
    traditional = '同学'
  WHERE chunk_key = '9ed73c0030d0a775b6c28a4039630df9';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiansheng',
    traditional = '先生'
  WHERE chunk_key = '323a5eeb1b955bf0080ee6596909a68a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiaojie',
    traditional = '小姐'
  WHERE chunk_key = '35a8a9041820c6c7d59dd0d74f7b2ae8';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yisheng',
    traditional = '醫生'
  WHERE chunk_key = 'e935bea9e4ee207c5b7f94b08c896b06';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xuexiao',
    traditional = '學校'
  WHERE chunk_key = 'eec889e492fe58fb6663f734d42b09fc';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fandian',
    traditional = '飯店'
  WHERE chunk_key = 'e350e3d8f3fb6c9e48587ed88d8f8d78';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shangdian',
    traditional = '商店'
  WHERE chunk_key = 'ed08beb3fe2933e9ed164df9cb7ccbfd';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yiyuan',
    traditional = '醫院'
  WHERE chunk_key = '321c222048f045f605f4cce5e02aa064';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhōngguó zhongguo',
    traditional = '中國'
  WHERE chunk_key = 'b17e82411b62ae77ed2a00a7d7e4149f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'běijīng beijing',
    traditional = '北京'
  WHERE chunk_key = 'ab799f2cad50f42861d6b33e5d5e7820';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'feiji',
    traditional = '飛機'
  WHERE chunk_key = 'c24e0d10969ccfe5bb8b700deac0bedb';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'chuzuche',
    traditional = '出租車'
  WHERE chunk_key = '77111f5a9aa0aa77233510aacc52b7ee';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'diannao',
    traditional = '電腦'
  WHERE chunk_key = 'f36068f46cdfe39870af306aac7f62ab';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dianshi',
    traditional = '電視'
  WHERE chunk_key = '6e3be815db2744c15800d60fab6f358d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dianying',
    traditional = '電影'
  WHERE chunk_key = 'feb9bd77dcd5ddabfa72e27087851873';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shouji',
    traditional = '手机'
  WHERE chunk_key = 'dab59c7b17362d50a70ba38d681e610b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shu',
    traditional = '書'
  WHERE chunk_key = '35482e427baaca945d560a3ecd2d89f2';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhuozi',
    traditional = '桌子'
  WHERE chunk_key = 'bdf0550793430b93a38b83e80bd41fac';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yizi',
    traditional = '椅子'
  WHERE chunk_key = 'f7971589e69d0fdee66173260997c5c0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yifu',
    traditional = '衣服'
  WHERE chunk_key = '9f4456d821175cfacadd587ab8055bfd';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shui',
    traditional = '水'
  WHERE chunk_key = 'b0f473984e9a264b0ad10b220adb73e6';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'cha',
    traditional = '茶'
  WHERE chunk_key = 'ec3f664ccba2274842494bd8399b564e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mifan',
    traditional = '米饭'
  WHERE chunk_key = '8ca011fb1c920470583009f58836b04e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'cai',
    traditional = '菜'
  WHERE chunk_key = '2d27c40ded216dd06185914b4a4477cc';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'pingguo',
    traditional = '苹果'
  WHERE chunk_key = '1e3c5785d66eb196b57447d0c6b1e536';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qian',
    traditional = '錢'
  WHERE chunk_key = 'f6c3d551fd276c7eff0bd223d3447c24';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dongxi',
    traditional = '東西'
  WHERE chunk_key = 'f8c5900514b25dfc46cf38246b074791';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mao',
    traditional = '貓'
  WHERE chunk_key = '1eb6eb522193c2ac6b7db7d2170b957d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'gou',
    traditional = '狗'
  WHERE chunk_key = '626681cacd9a8458e40ac494464c3f66';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'nian',
    traditional = '年'
  WHERE chunk_key = 'c746a5050a742a2bc30c75c95a28fa3f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yue',
    traditional = '月'
  WHERE chunk_key = 'e366bc854f3cf97e0dd28f2754544a13';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ri',
    traditional = '日'
  WHERE chunk_key = '016ad63296837a99e53ad9e41d02a107';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'hao',
    traditional = '號'
  WHERE chunk_key = 'eb4d83bf6723f3227a6ffaf424fa81a8';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xingqi',
    traditional = '星期'
  WHERE chunk_key = 'e7a0bdd4d99769db79bc7e3295dfdf99';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dian',
    traditional = '點'
  WHERE chunk_key = '6e51ae4c31636ca3e84ab8a119df1ce1';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fenzhong',
    traditional = '分钟'
  WHERE chunk_key = '7b00066ea9004c017d2f03c4070ba5c5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xianzai',
    traditional = '现在'
  WHERE chunk_key = '930b1712851f47d81bea9280da017e79';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jintian',
    traditional = '今天'
  WHERE chunk_key = '9b5a558410fc634934b820d5f1b2fc14';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mingtian',
    traditional = '明天'
  WHERE chunk_key = 'f2cedc001faabdafa5185d9191b75b18';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zuotian',
    traditional = '昨天'
  WHERE chunk_key = '32ac4dfb06a9bef74b8d396cf1ea122b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shangwu',
    traditional = '上午'
  WHERE chunk_key = 'd5ce0fa186122ee5c9e134f0519d2407';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhongwu',
    traditional = '中午'
  WHERE chunk_key = '1bbe989af7a25587fb54f2271796d10e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiawu',
    traditional = '下午'
  WHERE chunk_key = '90b04b319cd8e3baa36df1ff5be69547';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shihou',
    traditional = '时候'
  WHERE chunk_key = '52a09da75ed3372ec5f11da4f3e8aa3f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shang',
    traditional = '上'
  WHERE chunk_key = '405a9351d1a6161f52a19b60110828a0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xia',
    traditional = '下'
  WHERE chunk_key = '6e347e9449c9c15faadd544cbe045930';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qian',
    traditional = '前'
  WHERE chunk_key = '76b9aec10bdbb80c21268197d8033eb2';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'hou',
    traditional = '后'
  WHERE chunk_key = 'b121f8f33611ddbb2dbd4e7c7e263386';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'li',
    traditional = '里'
  WHERE chunk_key = '413ab5b5649813c26e94d8a9e82e4163';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shi',
    traditional = '是'
  WHERE chunk_key = 'f9b798ecfac8b188d809161ef0aae1e4';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'you',
    traditional = '有'
  WHERE chunk_key = '1ab602d74878b6a119b3ecf64d5e80e6';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kan',
    traditional = '看'
  WHERE chunk_key = '9c187e134a6ed4b7ddfa599aa425cc51';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ting',
    traditional = '聽'
  WHERE chunk_key = '26c163ede52ab20a458867dd315679b7';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shuo',
    traditional = '說'
  WHERE chunk_key = '980af62dcc28586243d4ecc3ab766d3d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'du',
    traditional = '读'
  WHERE chunk_key = 'ffc67cf7b4afa967712e2a0048d20c3f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xie',
    traditional = '写'
  WHERE chunk_key = '3a0f99061d6054f027432bac1516e628';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'chi',
    traditional = '吃'
  WHERE chunk_key = 'c70836bf6dddefff91b4ba8d202c8dd8';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'he',
    traditional = '喝'
  WHERE chunk_key = '38c7c2a62fdf0cdf748a144bf2e8f635';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mai',
    traditional = '買'
  WHERE chunk_key = 'bebf5c96267c910d592eed216596d81a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qu',
    traditional = '去'
  WHERE chunk_key = '2f1155164a9c683caca9ef22cb301c45';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'lai',
    traditional = '来'
  WHERE chunk_key = '3f4c8d159b297f301b164bbf5b996686';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'hui',
    traditional = '回'
  WHERE chunk_key = '19f62850d5781c27f2ec6ce97e0a37de';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zuo',
    traditional = '做'
  WHERE chunk_key = '7fd55352d8a79e722f5f75ff567433c1';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zuo',
    traditional = '坐'
  WHERE chunk_key = 'adcbfe500f36e0d1e9d856ee6b317c03';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhu',
    traditional = '住'
  WHERE chunk_key = 'facbfc2f78bf38afd3917b19eb246b4e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jiao',
    traditional = '叫'
  WHERE chunk_key = '93e3ea32050c4e337e07d45d0744f541';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ai',
    traditional = '爱'
  WHERE chunk_key = 'd0449d0a5269b67d36361d725b06fb8a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xihuan',
    traditional = '喜欢'
  WHERE chunk_key = 'f5508c7f0dd01505c7e04aac53bc1094';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiang',
    traditional = '想'
  WHERE chunk_key = '74675e61c3c2d3f3e8bea0be08f96af0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'hui',
    traditional = '会'
  WHERE chunk_key = '64674f9263cc2e555786c16c35d01563';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'neng',
    traditional = '能'
  WHERE chunk_key = 'f64c30c8acc09b1457d082039d7f6d49';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'renshi',
    traditional = '認識'
  WHERE chunk_key = 'cb469cbfa143cf19c6a3d1ae12c9e098';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shuijiao',
    traditional = '睡觉'
  WHERE chunk_key = '456f0c0484f834203846362dcfb8bde0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'gongzuo',
    traditional = '工作'
  WHERE chunk_key = '3992dca2482fd433b43eab283628516d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xuexi',
    traditional = '學習'
  WHERE chunk_key = '941fbc1eff619792f14c0b7ca345a248';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'hao',
    traditional = '好'
  WHERE chunk_key = 'b0994fb18323aee2c2b92410a21c6593';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'da',
    traditional = '大'
  WHERE chunk_key = '940d58bc9f280c4bcffaf3006768006a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiao',
    traditional = '小'
  WHERE chunk_key = '865c53ab27c11daeea5fe2bdb3d4006c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'duo',
    traditional = '多'
  WHERE chunk_key = '435f4f16525ef875a1998db8bcdd3f54';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shao',
    traditional = '少'
  WHERE chunk_key = '026d598df00efe6f047dbc9170e63138';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'leng',
    traditional = '冷'
  WHERE chunk_key = '660ec6ae23eeb78d50a283998a5947d3';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 're',
    traditional = '熱'
  WHERE chunk_key = 'f0dc2b0908be47b30211bde3d5152678';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'gaoxing',
    traditional = '高興'
  WHERE chunk_key = 'cd102fc67e01f71af990cd0556c4a502';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'piaoliang',
    traditional = '漂亮'
  WHERE chunk_key = '6bf169b00b8f939e3db0e9b939468491';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'bu',
    traditional = '不'
  WHERE chunk_key = 'e892c1aaada7897293bee70827f6dcce';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mei',
    traditional = '没'
  WHERE chunk_key = '0e44bf388faab706ccfd4a512c65b333';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'hen',
    traditional = '很'
  WHERE chunk_key = 'a4fde145f4dc5facf5f90b7a72ac3750';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'tai',
    traditional = '太'
  WHERE chunk_key = 'ddc487ae576750ed613b5ee1c1146a53';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dou',
    traditional = '都'
  WHERE chunk_key = 'fdac3896416a6c620df9a4cb24cd204f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'bangzhu',
    traditional = '幫助'
  WHERE chunk_key = 'fc25c820e710b96c8f431522f2cbcf9d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'paobu',
    traditional = '跑步'
  WHERE chunk_key = '365484434476ac5049f359146ef8e46f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ti zuqiu tizuqiu',
    traditional = '踢足球'
  WHERE chunk_key = '34ef4f38b034821c8610a68e8cb4aec4';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'youyong',
    traditional = '游泳'
  WHERE chunk_key = '662b17f8b39218a4ee3e5f25e0d1a528';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'changge',
    traditional = '唱歌'
  WHERE chunk_key = 'b35b54dd5ec8117fbfbde6cd9341996a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'tiaowu',
    traditional = '跳舞'
  WHERE chunk_key = 'ec8c86e6296cb0d0cda5f95b01e3650c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'lüyou lvyou luyou',
    traditional = '旅游'
  WHERE chunk_key = 'e0c1cf075547084f3547ecb0a0aec84d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shengbing',
    traditional = '生病'
  WHERE chunk_key = '5569d4ca7733625ee7f06fcbe0e1b65d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shenti',
    traditional = '身体'
  WHERE chunk_key = '1c4e4147010ed1edd7d1fdc8d47f251e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yanjing',
    traditional = '眼睛'
  WHERE chunk_key = 'be11d886b312248aa6b436018c7acc52';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'gege',
    traditional = '哥哥'
  WHERE chunk_key = '8b4e0220fc110ef6d844af40dafa995f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jiejie',
    traditional = '姐姐'
  WHERE chunk_key = '540831e2b55b9f26498cb93e188eab9b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'didi',
    traditional = '弟弟'
  WHERE chunk_key = 'cd119e731370621f37da1c984478c3ef';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'meimei',
    traditional = '妹妹'
  WHERE chunk_key = '7ad5f03c01da10ce186174dd96bd1439';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhangfu',
    traditional = '丈夫'
  WHERE chunk_key = 'af7391d56c8d07d02d1edcf1bf9b440e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qizi',
    traditional = '妻子'
  WHERE chunk_key = '822c3d65729adb50ac5e1a3c343970ca';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'haizi',
    traditional = '孩子'
  WHERE chunk_key = '4209af84a9b73275d0c153e1e7b70192';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kafei',
    traditional = '咖啡'
  WHERE chunk_key = 'ea94c757bd1897bd49221199f1ed53c9';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'niunai',
    traditional = '牛奶'
  WHERE chunk_key = '01ff5f7cf7f4490c5fbe6e2dfbbfb887';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jidan',
    traditional = '鸡蛋'
  WHERE chunk_key = '2a7217552644355695668c8828684cd9';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xigua',
    traditional = '西瓜'
  WHERE chunk_key = '8ec3829b55bf51631de5d8c18998193f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yangrou',
    traditional = '羊肉'
  WHERE chunk_key = '79e04afb32ab8bf04a22c0bce76b12fa';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yu',
    traditional = '鱼'
  WHERE chunk_key = '4b6f7af0d5c9fac1f27a7ea91f1fe7d5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yanse',
    traditional = '颜色'
  WHERE chunk_key = '2584c7b7e928cb56ea9ff9272e6ecade';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'hong',
    traditional = '红'
  WHERE chunk_key = 'c3095eb613a24515c32078220648665e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'bai',
    traditional = '白'
  WHERE chunk_key = '5c13a6dbd3aebb62ac43fe54eccff763';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'hei',
    traditional = '黑'
  WHERE chunk_key = 'cebb3d02f6a6bc6d2258594245a76fa0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'gui',
    traditional = '貴'
  WHERE chunk_key = '19e65075b4a4a9896dfb88d33a0b5174';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'pianyi',
    traditional = '便宜'
  WHERE chunk_key = '187ca9107d3f86f025c298072983f0ad';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xin',
    traditional = '新'
  WHERE chunk_key = '857e9c93754ce57312d419f1e6624436';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kuai',
    traditional = '快'
  WHERE chunk_key = '01c983e4d56a78ff4a02fb2353cb761c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'man',
    traditional = '慢'
  WHERE chunk_key = '1acaeaf3c34d346e06aeb0b0b0b4be1b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yuan',
    traditional = '远'
  WHERE chunk_key = '468beceaed175f5a1f6d2efc1e03af11';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jin',
    traditional = '近'
  WHERE chunk_key = '725aa59ee59808e72d31f0bb63e35c0e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'lei',
    traditional = '累'
  WHERE chunk_key = '032930e81c59431b1f78f34e667c96cd';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'cuo',
    traditional = '错'
  WHERE chunk_key = '5e4c92e16cfeb246c553bcab287c5471';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dui',
    traditional = '对'
  WHERE chunk_key = '0c1bb939381675e8178021678b886f7e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'huochezhan',
    traditional = '火车站'
  WHERE chunk_key = '015b635c75a3537ccdb1f07227404a24';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jichang',
    traditional = '机场'
  WHERE chunk_key = 'f1537592b40d61d1962905435ef84056';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'gonggong qiche gonggongqiche',
    traditional = '公共汽车'
  WHERE chunk_key = '48ff84ba55df03ddffa9ea51bfcbfac1';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'lu',
    traditional = '路'
  WHERE chunk_key = '5ff9eadfb27757c97a96c7f0c503ad80';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'men',
    traditional = '門'
  WHERE chunk_key = '88194c598519ab320eec5e67963c3787';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kaishi',
    traditional = '開始'
  WHERE chunk_key = '40a55ed948b7c34ecf9856ee46dcefde';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhunbei',
    traditional = '準備'
  WHERE chunk_key = 'd18d2cee3af5f170883493c19db5e089';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kaoshi',
    traditional = '考试'
  WHERE chunk_key = '9dcf56757fe1f6a181daf9110030386a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dong',
    traditional = '懂'
  WHERE chunk_key = '8f3af33525f5d863c29f77b2e3264cde';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jieshao',
    traditional = '介紹'
  WHERE chunk_key = '4b5df241e3b4640440a23650bb16ee14';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fangbian',
    traditional = '方便'
  WHERE chunk_key = '15b0a108d95b6ecdab97ab4bc1167bc4';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jiandan',
    traditional = '简单'
  WHERE chunk_key = '765dcd9f696bc2cc420b226c2fb20fb0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'renzhen',
    traditional = '认真'
  WHERE chunk_key = '9414845617d89f985e2232e0078aa389';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'reqing',
    traditional = '热情'
  WHERE chunk_key = 'bc33a441691a3db4f1e1c9c830ea7161';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'nuli',
    traditional = '努力'
  WHERE chunk_key = 'f60da78345050f5ae84e35b50960a9a4';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'congming',
    traditional = '聪明'
  WHERE chunk_key = '04e18e4916a3adad096ebcb4f0903651';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shufu',
    traditional = '舒服'
  WHERE chunk_key = 'a200659d5d3de83cc6a7a5cefc5cdce7';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'tebie',
    traditional = '特别'
  WHERE chunk_key = 'fd8a48002bc42ed08f9d36157f367507';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mashang',
    traditional = '马上'
  WHERE chunk_key = 'c2a18936f0b3790edce9a172af82a05e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yijing',
    traditional = '已经'
  WHERE chunk_key = '2607148e6174740587f8b1e3307394b8';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jingchang',
    traditional = '经常'
  WHERE chunk_key = '1f3791bf79ced025c81570432b0e5ccd';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dangran',
    traditional = '当然'
  WHERE chunk_key = '20df37b250e6a8b9f61d0a96a2c8b319';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'chaoshi',
    traditional = '超市'
  WHERE chunk_key = '1348a52dd53f9e6837141019bd7fbc89';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yinhang',
    traditional = '银行'
  WHERE chunk_key = 'c8563ec1e55bf7f2b8e277259df622b8';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xishoujian',
    traditional = '洗手间'
  WHERE chunk_key = '4e05ecaa2885333ac7dcf3d4ef182a26';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'hànyǔ hanyu',
    traditional = '漢語'
  WHERE chunk_key = '447add01cfc85f3cd5331814162c6e5a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zi',
    traditional = '字'
  WHERE chunk_key = 'f5fb6a9fbd017f976c216fa4fb6920bc';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mingzi',
    traditional = '名字'
  WHERE chunk_key = '83a5461e120cc74d041bf814856943bb';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'tianqi',
    traditional = '天气'
  WHERE chunk_key = 'cd976c21d4c97ebeca8abd8d6371b6bc';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'da dianhua dadianhua',
    traditional = '打电话'
  WHERE chunk_key = '2e27903a147abebe9b6c3b4c40da6d78';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zaoshang',
    traditional = '早上'
  WHERE chunk_key = 'b1a090c9ca34f1197dd73493138578e1';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'wanshang',
    traditional = '晚上'
  WHERE chunk_key = '25a72a96f8254e80da616e18a85f66c1';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qianbi',
    traditional = '鉛筆'
  WHERE chunk_key = 'acdf62e2de4b9ba876888af4266a7309';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'baozhi',
    traditional = '报纸'
  WHERE chunk_key = '36cb69ad377100da7f6baccc8a5848cf';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fangjian',
    traditional = '房间'
  WHERE chunk_key = '3ebe92677218a53089c02f38f76c0dd3';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shoubiao',
    traditional = '手表'
  WHERE chunk_key = '82d4a99b945b3d2750669054a3461795';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qingtian',
    traditional = '晴天'
  WHERE chunk_key = '32a1f761c83394e6912d40564fd70e30';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yintian',
    traditional = '阴天'
  WHERE chunk_key = 'c10a3f08d4073dc0c91bb01d52bd12a8';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiaxue',
    traditional = '下雪'
  WHERE chunk_key = '1bd3ec038773d3189dfd49d45b482976';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiayu',
    traditional = '下雨'
  WHERE chunk_key = '48fbdb77f029ec577bf962a2b2a08cf2';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'chuan',
    traditional = '穿'
  WHERE chunk_key = '865501956f7a579878fa2a92bcfbd031';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'song',
    traditional = '送'
  WHERE chunk_key = 'ca2ae38f6532e32020e0447063fdec80';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'gei',
    traditional = '給'
  WHERE chunk_key = '4f35c16f451e559ebdaed2f7208039ba';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'wen',
    traditional = '問'
  WHERE chunk_key = '48f191b3e374f27fa2307501a7b3c632';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhao',
    traditional = '找'
  WHERE chunk_key = '56a85c5ea82b02449baad2043f7e2bfc';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'gaosu',
    traditional = '告诉'
  WHERE chunk_key = '75a6993e9e7de9fb8d46d0ecd50770b2';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'deng',
    traditional = '等'
  WHERE chunk_key = 'a61e7d174b4de1718a06e9b32cff8d54';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'rang',
    traditional = '讓'
  WHERE chunk_key = 'dff8caccbf138e332f0d4c9ea7eb1256';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiwang',
    traditional = '希望'
  WHERE chunk_key = 'dcd69b94f5a67079fe992df75e4c5201';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yinwei',
    traditional = '因为'
  WHERE chunk_key = 'a783ee789797471b3ec341650c60ffcf';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'suoyi',
    traditional = '所以'
  WHERE chunk_key = '5b57f3087db45e8b904745b20bec818e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'danshi',
    traditional = '但是'
  WHERE chunk_key = '3c46941529bf527eba32c9308e6d146d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'suiran',
    traditional = '虽然'
  WHERE chunk_key = '21221ba7cfbcfa73a33fd82ed16d2c63';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhengzai',
    traditional = '正在'
  WHERE chunk_key = '57e3b9e4c1e0665747d7e0c5aa9576b5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhen',
    traditional = '真'
  WHERE chunk_key = '804edbbeda2aacfff964b861b0df3690';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zui',
    traditional = '最'
  WHERE chunk_key = 'f7c3f5933ddc39490fe8f44b0c549232';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jian',
    traditional = '件'
  WHERE chunk_key = '45343fd9d6c20eb4b94674477b6711f9';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jin',
    traditional = '斤'
  WHERE chunk_key = '0ad9cf3ffca998c7e80314338b1b979c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'liang',
    traditional = '兩'
  WHERE chunk_key = 'a95fdbdb49e9953a13f2b26302a8380c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qian',
    traditional = '千'
  WHERE chunk_key = '93b8ea3cbaf6f76907b0282838271ae4';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dasuan',
    traditional = '打算'
  WHERE chunk_key = '8df45e0062b828a1dfcaa9250b66e0d0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jieshu',
    traditional = '结束'
  WHERE chunk_key = 'e51466765c459746c2735fdff1f748be';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jueding',
    traditional = '决定'
  WHERE chunk_key = '942df816b5e0bba2d0327291a8f42680';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jiejue',
    traditional = '解决'
  WHERE chunk_key = '1a5e88d5535cb20b89c7b44eb1056bbe';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'tigao',
    traditional = '提高'
  WHERE chunk_key = '218e788cdbf59ecbeea788675b505581';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'wancheng',
    traditional = '完成'
  WHERE chunk_key = 'ce849d8f2b1196cc2dcd922e9f2e3e75';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xuanze',
    traditional = '选择'
  WHERE chunk_key = '86b81a06bcfe35743d7cc966d421dcf9';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yuanyi',
    traditional = '愿意'
  WHERE chunk_key = '74e36b88d3405ea78ba2b6f33c6da1bb';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'canjia',
    traditional = '参加'
  WHERE chunk_key = '6f5eda2dce91b8a0e12c0288ba4b51a5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'lianxi',
    traditional = '练习'
  WHERE chunk_key = '8eb2f391b079fc8e969a8489ddda73fa';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jiancha',
    traditional = '检查'
  WHERE chunk_key = '22d68fe7d6b68c0791afa93ce81e7ce9';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qingchu',
    traditional = '清楚'
  WHERE chunk_key = '8b9be34082046f63d17bd14a7467928e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fangxin',
    traditional = '放心'
  WHERE chunk_key = '9d28fbf14b1e0e350b6205b05e910b4a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhaogu',
    traditional = '照顾'
  WHERE chunk_key = '5be10e0e762790df44b5405f30a91685';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'likai',
    traditional = '离开'
  WHERE chunk_key = '0676a6cc01545ffd2047a11d089feaa5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'chidao',
    traditional = '迟到'
  WHERE chunk_key = 'eb10b44d0232b0951cea6b50da12f70f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'faxian',
    traditional = '发现'
  WHERE chunk_key = '7f069c093766f075d8ade6bb14aaf688';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jie',
    traditional = '借'
  WHERE chunk_key = 'ba186e33eb4e9bdac52717d67dbb94d9';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiguan',
    traditional = '习惯'
  WHERE chunk_key = '0996d4cfe3e74cae8961ed3fb81f3dd9';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qishi',
    traditional = '其实'
  WHERE chunk_key = '3fd774df34ef037c51dd1ced136ae6df';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'turan',
    traditional = '突然'
  WHERE chunk_key = 'ce7bd833f409ed30f4badaa822b563fd';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhongyu',
    traditional = '终于'
  WHERE chunk_key = '7bada6a6857950242f9775e58683c67c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yiding',
    traditional = '一定'
  WHERE chunk_key = 'b4b64d0dc7421536557142c006e91291';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dangao',
    traditional = '蛋糕'
  WHERE chunk_key = '15d452ff5432242b3fa6b4e83ce0f6e5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'miantiao',
    traditional = '面条'
  WHERE chunk_key = '3b52ad2eb30a346fe15f4ef4e495c0e2';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mianbao',
    traditional = '面包'
  WHERE chunk_key = '38fe7c7d9b0a54f08fe9996bdf6e2c75';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yinliao',
    traditional = '饮料'
  WHERE chunk_key = 'a91ed5926ec968c048a0bab5c4357d02';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kongtiao',
    traditional = '空调'
  WHERE chunk_key = '62c5cd5e6dd8b13ddc32312278a9e03f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'bingxiang',
    traditional = '冰箱'
  WHERE chunk_key = '93e0fcbe5e7ea0930e076459828e7b11';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'san',
    traditional = '伞'
  WHERE chunk_key = '11c08fe99e3c9b530d42444f12d269a0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qunzi',
    traditional = '裙子'
  WHERE chunk_key = '2386b364f222f940ecae2f3c88aaac26';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kuzi',
    traditional = '裤子'
  WHERE chunk_key = '0741ebee1bad0975ccad4ead3ac24009';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xie',
    traditional = '鞋'
  WHERE chunk_key = '80d8c02bd8d5a957f44c1fac336a3d38';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'maozi',
    traditional = '帽子'
  WHERE chunk_key = 'c4dfa600687751db409701dcef611d4d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'huzhao',
    traditional = '护照'
  WHERE chunk_key = '870f988281be7f5192411fb6e0494eeb';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xinyongka',
    traditional = '信用卡'
  WHERE chunk_key = '29de79d590518654a3c108d47575966d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qianbao',
    traditional = '钱包'
  WHERE chunk_key = '6959cc31565104ed86f0854c30c36a5b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'linju',
    traditional = '邻居'
  WHERE chunk_key = '042af276560403df8d18f313a84b24d5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'siji',
    traditional = '司机'
  WHERE chunk_key = 'fc2dc85279f3f635bf2599948299516c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'taiyang',
    traditional = '太阳'
  WHERE chunk_key = '8f59ad013cfc3ba31580d2d04055a6f5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yueliang',
    traditional = '月亮'
  WHERE chunk_key = '22de7cc5fa5d7f56ae2b0bc842962362';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shu',
    traditional = '树'
  WHERE chunk_key = '8066343807fcaf613dd4ba12e7b2f0ec';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'hua',
    traditional = '花'
  WHERE chunk_key = '6a6cc89297cbc4eab3ed16eb4dec5dda';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'cao',
    traditional = '草'
  WHERE chunk_key = 'fea8b219acf54869d509931da7ed3cc3';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'niao',
    traditional = '鸟'
  WHERE chunk_key = 'd44304811c718a5c1027078754b5d6eb';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiongmao',
    traditional = '熊猫'
  WHERE chunk_key = '41f7f48098551a51812a43a5e7028197';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jijie',
    traditional = '季节'
  WHERE chunk_key = 'bc08d98383152ddc8585d5dc133fa088';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'chuntian',
    traditional = '春天'
  WHERE chunk_key = 'ffa585c7392e077925e67b30df93b970';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiatian',
    traditional = '夏天'
  WHERE chunk_key = '04c2df2163fb6c6b7c2a395cbf8b7961';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qiutian',
    traditional = '秋天'
  WHERE chunk_key = '064d586f0a38f906073ce85310cdf0b6';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dongtian',
    traditional = '冬天'
  WHERE chunk_key = '250400cc52d83a02cc1403fe61d22683';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'nü nv nu',
    traditional = '女'
  WHERE chunk_key = 'd227fe41ec425d485f404d6dba0b0f39';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kou',
    traditional = '口'
  WHERE chunk_key = '6e0f69b43c4c034c6c19bd230e78525a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'huo',
    traditional = '火'
  WHERE chunk_key = 'b31fc93b11386365b2affc338f31c306';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mu',
    traditional = '木'
  WHERE chunk_key = 'ddef84748344d5492c50e98922b8ca51';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'bu shi bushi',
    traditional = '不是'
  WHERE chunk_key = '2565a72cb73a3ae6157c88517c39fed6';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yi ge yige',
    traditional = '一个'
  WHERE chunk_key = 'd850c543254642c11ced58ba48d8492f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yiqi',
    traditional = '一起'
  WHERE chunk_key = '9ad4762ef5b23bd0952f7677c818273a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'nin',
    traditional = '您'
  WHERE chunk_key = 'b90f42e0e5782df774e03cec222bbd94';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = '',
    traditional = '吗'
  WHERE chunk_key = 'c4c067523b6cebc41dfa27d68feedac8';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yuènán yuenan',
    traditional = '越南'
  WHERE chunk_key = '0b3586d0e102aac3a637a3f8ccd15ac6';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'sui',
    traditional = '歲'
  WHERE chunk_key = '3b036e64145729f53e667edfdff60fb6';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'duo da duoda',
    traditional = '多大'
  WHERE chunk_key = 'e056aca3617849dbd281b8d3c5c799c7';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ershi',
    traditional = '二十'
  WHERE chunk_key = '017f1608f5f5c6fdf865464aeabad6dc';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'meiyou',
    traditional = '没有'
  WHERE chunk_key = '1d08febc6a0ac581f044ca8db7c0e74e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'he',
    traditional = '和'
  WHERE chunk_key = '30096f011187a1cd26ffe7d5de556719';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fen',
    traditional = '分'
  WHERE chunk_key = '97bdb6919c9370eafdd143c3c79a8f6d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ban',
    traditional = '半'
  WHERE chunk_key = '4204fe5948df960d9d6c439cb8214ae2';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zai',
    traditional = '在'
  WHERE chunk_key = '0ef678a7ba6990ed110da03df573172e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'nar',
    traditional = '哪儿'
  WHERE chunk_key = '79bc88b19924c410324581312ac01220';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fanguan',
    traditional = '饭馆'
  WHERE chunk_key = '5b4d8aca93cb58d2a38d3551f1296c4a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'duoshao',
    traditional = '多少'
  WHERE chunk_key = 'cff6b1b2bedcd6a33c1f2ba8e883381a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kuai',
    traditional = '块'
  WHERE chunk_key = '2a2e42bb9b66646252a90971af078408';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'hanzi',
    traditional = '汉字'
  WHERE chunk_key = 'db163b73e84c228e217109bad73b1cb0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kan dianying kandianying',
    traditional = '看电影'
  WHERE chunk_key = 'bbea8c46aae35862d3dc511af700792b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yidianr',
    traditional = '一点儿'
  WHERE chunk_key = '2e84ce0d3f2e10a1a65569394d8e52bc';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'wenti',
    traditional = '問題'
  WHERE chunk_key = '9b42ee775af6790e1d97df5686288aff';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qichuang',
    traditional = '起床'
  WHERE chunk_key = 'bcb69152e7bc9a09a2da39cf6969fddf';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'cha',
    traditional = '差'
  WHERE chunk_key = 'c2c8a1e271427126d471fe70b84a2164';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ke',
    traditional = '刻'
  WHERE chunk_key = '7b2fee954a08c6c2385f9a9dc9522b81';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'meitian',
    traditional = '每天'
  WHERE chunk_key = 'd1b38ad1a0ad6b958dc270ec1f40dbfd';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zaofan',
    traditional = '早饭'
  WHERE chunk_key = '8ba0b9441ee065a4fd7649abdc166182';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ditie',
    traditional = '地铁'
  WHERE chunk_key = '7cd33b04bd37a32e966d6390f71e4aa4';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qi',
    traditional = '骑'
  WHERE chunk_key = 'ac6dec419f2f326417465f24cf4b497b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zixingche',
    traditional = '自行车'
  WHERE chunk_key = '80b0dd482dfed6bf9f3a5526afa3332c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'li',
    traditional = '离'
  WHERE chunk_key = '308226e1bfa8a22a1acb8ab0ae8d250a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'gongli',
    traditional = '公里'
  WHERE chunk_key = 'bb14807d7c9607e1d5260175a37dbf2b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zoulu',
    traditional = '走路'
  WHERE chunk_key = '5395203ea755fa24393c3c87c0fb1447';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'wang',
    traditional = '往'
  WHERE chunk_key = 'fccad6812e335e0b9aaae384f958456e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zuo',
    traditional = '左'
  WHERE chunk_key = '163c4305d0c94809f3f9490f644faffe';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'you',
    traditional = '右'
  WHERE chunk_key = '1d29f2e6d1d351f0ea2f5c8f7d48f7b1';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'guai',
    traditional = '拐'
  WHERE chunk_key = '550b0d1ff421c425284a61c297662be1';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'lukou',
    traditional = '路口'
  WHERE chunk_key = 'b58b630c807cfb8c41cb902440043b64';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'honglüdeng honglvdeng hongludeng',
    traditional = '红绿灯'
  WHERE chunk_key = '6e401b921caf2899096a86a268bc24c5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shifu',
    traditional = '师傅'
  WHERE chunk_key = 'd7f26c746d70164a07eac9f2dac74d1b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dagai',
    traditional = '大概'
  WHERE chunk_key = 'd7f2e4872c5d6a3bebda67dcf9d07f85';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'tingche',
    traditional = '停车'
  WHERE chunk_key = '91409f06bf86553c22b8e78a071afbbd';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fuwuyuan',
    traditional = '服务员'
  WHERE chunk_key = 'abd42ec3d488b1ef900a76ad39b2ad80';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'caidan',
    traditional = '菜单'
  WHERE chunk_key = '5af90ad95373726813ec81a5c5663889';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'diancai',
    traditional = '点菜'
  WHERE chunk_key = '599b41fd2844b011a3d178fcf46d6c63';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jiaozi',
    traditional = '饺子'
  WHERE chunk_key = '93b1ef5ae556ebaaaef76e500ceec578';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'haochi',
    traditional = '好吃'
  WHERE chunk_key = '9dd13c4cb5f4d944c304178506e2b1fb';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kaoya',
    traditional = '烤鸭'
  WHERE chunk_key = 'df6fe5af1474cdfab0800f2a7375cc49';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'la',
    traditional = '辣'
  WHERE chunk_key = 'f4c3ebff71dc3c13be5394bb7256d523';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'tian',
    traditional = '甜'
  WHERE chunk_key = '304d7434735fe20f4eea646446ac7e83';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'suan',
    traditional = '酸'
  WHERE chunk_key = 'ffdd8690e28137c8ab196b243c37c708';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fang',
    traditional = '放'
  WHERE chunk_key = '73b55dedab0b06ca58bf37135305c64c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'lajiao',
    traditional = '辣椒'
  WHERE chunk_key = 'a8ad7b5ec905cca2b119ea12ccb61013';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shi',
    traditional = '试'
  WHERE chunk_key = 'e450b05068112489fa81c09c184971de';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dazhe',
    traditional = '打折'
  WHERE chunk_key = 'a01d55faa809f89a276b3dc6be5ab1d2';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'wēixìn weixin',
    traditional = '微信'
  WHERE chunk_key = '003d77215603b99ff56eeab926228428';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhīfùbǎo zhifubao',
    traditional = '支付宝'
  WHERE chunk_key = '412e270c87ef20c4013c2d7a931f3cdb';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'saoma',
    traditional = '扫码'
  WHERE chunk_key = '4fbd404e4b62575134bf84e5d377bc8f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xianjin',
    traditional = '现金'
  WHERE chunk_key = '10f7c8e2f740934a44247e2185e90415';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yeshi',
    traditional = '夜市'
  WHERE chunk_key = 'ed2ea0eb0268ce119dfe3f8934002da3';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'renao',
    traditional = '热闹'
  WHERE chunk_key = '5a89fa8d76ab371e622fc0ca6b1e2118';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yigong',
    traditional = '一共'
  WHERE chunk_key = '5b15f0343dc6520015593c627211c92c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'gua feng guafeng',
    traditional = '刮风'
  WHERE chunk_key = 'b708a06ef0bc184377754c59ee7b308c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'bi',
    traditional = '比'
  WHERE chunk_key = '5d527981b12e9197554198dfa16711a5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'gao',
    traditional = '高'
  WHERE chunk_key = 'e1f147f357ff0ed350e20eb13273e24b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ai',
    traditional = '矮'
  WHERE chunk_key = '63fbb86e76fdbaa35ac01c71b4f7dbea';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'chang',
    traditional = '長'
  WHERE chunk_key = 'd31909b9d1a3aa9e92427dfe03b7a778';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'duan',
    traditional = '短'
  WHERE chunk_key = 'c837cb7837715622f3453f415d14ce8b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'geng',
    traditional = '更'
  WHERE chunk_key = '309c8e8a44fca2a46dacc5bf7db35ea4';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ganmao',
    traditional = '感冒'
  WHERE chunk_key = 'bc38468b06845ec87d3dfadd10c477e7';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fashao',
    traditional = '发烧'
  WHERE chunk_key = '0cea6c2e49c9f96316d28d21c0decd46';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yao',
    traditional = '药'
  WHERE chunk_key = '7a623cc896f0a47202efca4d1642e8ac';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qingjia',
    traditional = '请假'
  WHERE chunk_key = '1872933be54c81732c9617f8aebe7964';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiuxi',
    traditional = '休息'
  WHERE chunk_key = '1c60e48de07dc9f3a700f52d191ce474';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'neng bu neng nengbuneng',
    traditional = '能不能'
  WHERE chunk_key = 'aaa7650cf2b8908d8fab9f7bc4b03b03';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = '',
    traditional = '着'
  WHERE chunk_key = 'b84ec780732f7db7e23156a9ba843b85';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kai',
    traditional = '開'
  WHERE chunk_key = 'fe7b879286a82305bb3051f277d18337';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'guan',
    traditional = '关'
  WHERE chunk_key = 'd6993054da1ff6ba6d50fa08b2c3901b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'na',
    traditional = '拿'
  WHERE chunk_key = 'def9d523851ad9b39aae5fa7bebc9c58';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhan',
    traditional = '站'
  WHERE chunk_key = '222c75b5ea588959046efa7440f9a06d';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = '',
    traditional = '过'
  WHERE chunk_key = '860cebfc67b193af1dc60b67878bd10c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ci',
    traditional = '次'
  WHERE chunk_key = '7112359048d1098e77dd31f2ce43a75b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yiqian',
    traditional = '以前'
  WHERE chunk_key = '1caef4a77cc8115e674de1cab3e14e33';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'haishi',
    traditional = '还是'
  WHERE chunk_key = 'cea09d40dd5accc89b876f0849a39a61';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'chengji',
    traditional = '成绩'
  WHERE chunk_key = '6ca2d7a1a7403298b26e19745221b378';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'tongguo',
    traditional = '通过'
  WHERE chunk_key = '0a4cdba1254fdb596cd4498bf4c9b5f6';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhuhe',
    traditional = '祝贺'
  WHERE chunk_key = '1d37f434cb34409abd39f70c9fc1f743';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yuding',
    traditional = '预订'
  WHERE chunk_key = '78ed5611a8ddd300e330ef0b21228442';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yajin',
    traditional = '押金'
  WHERE chunk_key = 'ee8b577d2ff18efe3a1d70d1c7dcb762';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'tuifang',
    traditional = '退房'
  WHERE chunk_key = '224299342aab97de41d00e2a136ca671';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'danrenfang',
    traditional = '单人房'
  WHERE chunk_key = '4376f7bbe08e62d865a7fec65e9e45e4';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'wangluo',
    traditional = '网络'
  WHERE chunk_key = '7763d64dc5282fb150247055b104d484';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xingli',
    traditional = '行李'
  WHERE chunk_key = 'c28cedb00d817ee083c184a6ec5b1873';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhunshi',
    traditional = '准时'
  WHERE chunk_key = 'c2826042e5f6e7cecc2fead99c79e0dc';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qifei',
    traditional = '起飞'
  WHERE chunk_key = '204072184e251e125025d8c3c22f93a0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dengjipai',
    traditional = '登机牌'
  WHERE chunk_key = '1a13e13593b2e7335d287fe333a70fac';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jinlai',
    traditional = '进来'
  WHERE chunk_key = '9124ebd5c12e646be2a9dbb90efc881c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'chuqu',
    traditional = '出去'
  WHERE chunk_key = '9b50886a2b2f83fbb3197e747f66e74c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shanglai',
    traditional = '上来'
  WHERE chunk_key = 'a42dffd1ea11edf281459a984db81fa0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xiaqu',
    traditional = '下去'
  WHERE chunk_key = 'c4aeb4e8b989aec6c3e183bf09c0ebc4';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'huilai',
    traditional = '回来'
  WHERE chunk_key = '051802842aba2a445665449945f5eae2';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'guoqu',
    traditional = '过去'
  WHERE chunk_key = '0ffb191a892a332afd51581d70916b94';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'pao',
    traditional = '跑'
  WHERE chunk_key = 'd25fe0776525938de4af3ad64117dfbd';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'pao chulai paochulai',
    traditional = '跑出来'
  WHERE chunk_key = '61ace505aef0e35aea484f07acfdf4a1';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'na chulai nachulai',
    traditional = '拿出来'
  WHERE chunk_key = '5b6b6d3e14ac388aa1c80205aebec6cf';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhan qilai zhanqilai',
    traditional = '站起来'
  WHERE chunk_key = 'bc1b6a6057b8b5ec41c1550b87c18f7e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dai huiqu daihuiqu',
    traditional = '带回去'
  WHERE chunk_key = 'cc70d45d987d89cb2fe6f394bb861357';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ziyouxing',
    traditional = '自由行'
  WHERE chunk_key = '173b6765cf42873027961d329bc0cdfb';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'duli',
    traditional = '独立'
  WHERE chunk_key = '95df8c913eaa3ca69a007acc8ec8c98c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'wan',
    traditional = '完'
  WHERE chunk_key = 'bebd941b0bba5a5485db98c1e9306d0b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kanjian',
    traditional = '看见'
  WHERE chunk_key = '34c59c89e7b664e564c859336b14a2b2';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zhaodao',
    traditional = '找到'
  WHERE chunk_key = '23100f182f3360a79ae7ad073c2445fe';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kan de dong kandedong',
    traditional = '看得懂'
  WHERE chunk_key = '04a723c7252adfe04e386eb03162b71a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ting bu dong tingbudong',
    traditional = '听不懂'
  WHERE chunk_key = 'b4ba8754dc21b5eb5bda61df73d15ae1';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mai de qi maideqi',
    traditional = '买得起'
  WHERE chunk_key = '510e30627f8353b492b546c6f22034fd';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zuo bu wan zuobuwan',
    traditional = '做不完'
  WHERE chunk_key = '183d74b47f14339c1d22db8046200cbe';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ba',
    traditional = '把'
  WHERE chunk_key = '1a3eceddf97369e3437c962921d8880e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'guanshang',
    traditional = '关上'
  WHERE chunk_key = '79d45a7d8d4b06b2dbb417234e48d7af';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'xi',
    traditional = '洗'
  WHERE chunk_key = '28072e0d1b26053e5652c575d839cb5a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ganjing',
    traditional = '干净'
  WHERE chunk_key = 'b37ca3a2d0bd1f721a1d753c41398461';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jiao',
    traditional = '交'
  WHERE chunk_key = 'b3f6d6c82ceaf383253c7446a882d2e1';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fa',
    traditional = '发'
  WHERE chunk_key = '46dd4d7a8dbbca8e3e880a502fc0598c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ban',
    traditional = '搬'
  WHERE chunk_key = '03fdc48c568265b59e3151965876e363';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'bei',
    traditional = '被'
  WHERE chunk_key = '35416683c3538773da7e13d60eec10f5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'tou',
    traditional = '偷'
  WHERE chunk_key = 'b9c816e5451e801b5848b401d82a4bcf';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'dasui',
    traditional = '打碎'
  WHERE chunk_key = '9a9f1c560aca551ac3d0f63a4207448a';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jingli',
    traditional = '经理'
  WHERE chunk_key = 'efc8a736304a5cf7fef6bf528da1483c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'tongshi',
    traditional = '同事'
  WHERE chunk_key = 'a9a7f651ce6d98daf4980ebcefc56e4c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'kaihui',
    traditional = '开会'
  WHERE chunk_key = '60073ce752d87fac225855e5de8e603c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'bangongshi',
    traditional = '办公室'
  WHERE chunk_key = '362dd9ffd524e5c8a89f0cabc3fd730f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'tongzhi',
    traditional = '通知'
  WHERE chunk_key = 'ff32f8ab2a6f5e6c604e3e79b412dc6e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jihua',
    traditional = '计划'
  WHERE chunk_key = '0db51023db8b521746fc0b6f1a6478c3';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'anshi',
    traditional = '按时'
  WHERE chunk_key = '4e236fe2e8cb5069b446d849304f8c5b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'daxue',
    traditional = '大学'
  WHERE chunk_key = 'fcd10d64d830a31a98fde8f3afecf72c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fuxi',
    traditional = '复习'
  WHERE chunk_key = '5f30f5633ac37eb313dc9327f45feb40';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'nanguo',
    traditional = '难过'
  WHERE chunk_key = '29f63a44dc81e606619c14f5183670cc';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shengqi',
    traditional = '生气'
  WHERE chunk_key = '0ecaef024a6b00a99f69a67077339f26';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'manyi',
    traditional = '满意'
  WHERE chunk_key = 'ac60c22ee4bcff59374b1a7ff16c7e84';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'pao de kuai paodekuai',
    traditional = '跑得快'
  WHERE chunk_key = '2876df8e27d0500a18bbcd4344a81ed2';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'gaoxing de shuo gaoxingdeshuo',
    traditional = '高兴地说'
  WHERE chunk_key = 'c0aef9783d8d924efc80f70a77c4e4d8';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'meili de hua meilidehua',
    traditional = '美丽的花'
  WHERE chunk_key = '5dc95717c87f350073a55179fd5cee90';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ru xiang sui su ruxiangsuisu',
    traditional = '入乡随俗'
  WHERE chunk_key = '843dbbaa790da4e1dea2dc1ce2442226';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mamahuhu',
    traditional = '马马虎虎'
  WHERE chunk_key = '7ceae76583a2bccb28f45005b19feefd';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yi xin yi yi yixinyiyi',
    traditional = '一心一意'
  WHERE chunk_key = '6d76ca48f035b31f82199b83dc4ee89e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'wenhua',
    traditional = '文化'
  WHERE chunk_key = '1c055c43c0b4f00d94a4eb6dabde99a9';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shouxian',
    traditional = '首先'
  WHERE chunk_key = 'd8fd5f301b144db92c794d846a6a53e5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ranhou',
    traditional = '然后'
  WHERE chunk_key = 'f7b1fde56d03107b047450dac8c30b07';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zuihou',
    traditional = '最后'
  WHERE chunk_key = 'cc08e88c0ad32df5474c280316272149';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'gushi',
    traditional = '故事'
  WHERE chunk_key = 'be452f1f0b36d3add7558610fc7054e0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'yuedu',
    traditional = '阅读'
  WHERE chunk_key = '06c4d2bdc71c204d4a47528b6585c116';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shuiping',
    traditional = '水平'
  WHERE chunk_key = '148f5abacf402ab04b36aeed4e221f67';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'chenggong',
    traditional = '成功'
  WHERE chunk_key = '389aa3fdfaeef0164a9b1166e88373f1';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jianchi',
    traditional = '坚持'
  WHERE chunk_key = '5a7dc2e36dd6b825dfa505830c325182';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'zixin',
    traditional = '自信'
  WHERE chunk_key = '2927ef7b48b7bddf4659bfead67a8ed5';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'biye',
    traditional = '毕业'
  WHERE chunk_key = '6266a44acf0068da37d16c0e7ab6b899';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'mengxiang',
    traditional = '梦想'
  WHERE chunk_key = '256bf29cea89bf4b8f00dc2d0f651cdf';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'weilai',
    traditional = '未来'
  WHERE chunk_key = 'b726f6d61bb428717af3f6e646d79daf';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jiayou',
    traditional = '加油'
  WHERE chunk_key = 'dccc5104881f495525c844fc50e2ef01';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'ban tu er fei bantuerfei',
    traditional = '半途而废'
  WHERE chunk_key = '059f6f8398f1b4f85e772cdd0bdaf1d3';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'hua she tian zu huashetianzu',
    traditional = '画蛇添足'
  WHERE chunk_key = '2986536ddb614f00d9dab2e7ffa70bb0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shou zhu dai tu shouzhudaitu',
    traditional = '守株待兔'
  WHERE chunk_key = 'd72c98e986575ae385ff42c94151b926';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'wen gu zhi xin wenguzhixin',
    traditional = '温故知新'
  WHERE chunk_key = '1d8042e61351b74c01a71e9489fef2a7';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'qianli zhi xing qianlizhixing',
    traditional = '千里之行'
  WHERE chunk_key = '23b315b83039683201d1f66ef238dde9';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'anpai',
    traditional = '安排'
  WHERE chunk_key = '217a53f41d5970db6bb1f63fbdc425d0';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'baozheng',
    traditional = '保证'
  WHERE chunk_key = 'c7aaded396390574d3c24471f9c6c54b';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fengfu',
    traditional = '丰富'
  WHERE chunk_key = '3313b762810a11e85969f2077f9a76e3';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jingli',
    traditional = '经历'
  WHERE chunk_key = 'ab35187d6246868a72a68ec65e2b2d3e';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shangliang',
    traditional = '商量'
  WHERE chunk_key = 'd43a81c5ba4607af6a72be96dc056382';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shiying',
    traditional = '适应'
  WHERE chunk_key = '475bdde263a8da61173086b6f634420f';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'jilei',
    traditional = '积累'
  WHERE chunk_key = 'fa99b604992cf90f6aed42e478148a5c';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'shunli',
    traditional = '顺利'
  WHERE chunk_key = '90b1cf16deb84f7aeb85787dfd5b9bb8';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'liuli',
    traditional = '流利'
  WHERE chunk_key = '5d87d0b4fc2c7368ed52d4f60d1132a8';
  UPDATE public.rag_knowledge_chunks
  SET 
    pinyin_numbered = 'fanyi',
    traditional = '翻译'
  WHERE chunk_key = '3d2240d17a98a96463f6a60ec89d77e0';
END $$;

-- 3. Nâng cấp RPC match_rag_knowledge với cơ chế kết hợp Lexical thông minh
CREATE OR REPLACE FUNCTION public.match_rag_knowledge (
  query_embedding vector(768) DEFAULT NULL,
  query_text text DEFAULT '',
  match_threshold float DEFAULT 0.25,
  match_count int DEFAULT 5,
  filter_hsk text DEFAULT NULL,
  filter_type text DEFAULT NULL
)
RETURNS TABLE (
  chunk_id UUID,
  source_id UUID,
  source_title TEXT,
  source_url TEXT,
  license_identifier TEXT,
  attribution TEXT,
  chunk_type TEXT,
  hsk_level TEXT,
  topic TEXT,
  simplified TEXT,
  traditional TEXT,
  pinyin TEXT,
  vietnamese_meaning TEXT,
  pedagogical_notes TEXT,
  grammar_pattern TEXT,
  example_sentences JSONB,
  similarity_score float,
  lexical_score float,
  hybrid_score float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_query text := lower(trim(coalesce(query_text, '')));
  has_vector boolean := query_embedding IS NOT NULL;
  has_text boolean := length(clean_query) > 0;
  ts_q tsquery := CASE WHEN has_text THEN plainto_tsquery('simple', clean_query) ELSE NULL END;
BEGIN
  RETURN QUERY
  WITH scored_candidates AS (
    SELECT
      c.id AS c_chunk_id,
      s.id AS c_source_id,
      s.title AS c_source_title,
      s.source_url AS c_source_url,
      c.license_identifier AS c_license,
      c.attribution AS c_attribution,
      c.chunk_type AS c_chunk_type,
      c.hsk_level AS c_hsk_level,
      c.topic AS c_topic,
      c.simplified AS c_simplified,
      c.traditional AS c_traditional,
      c.pinyin AS c_pinyin,
      c.vietnamese_meaning AS c_vietnamese_meaning,
      c.pedagogical_notes AS c_pedagogical_notes,
      c.grammar_pattern AS c_grammar_pattern,
      c.example_sentences AS c_example_sentences,
      -- 1. Điểm tương đồng Vector Cosine (0.0 - 1.0)
      CASE 
        WHEN has_vector AND c.embedding IS NOT NULL THEN (1.0 - (c.embedding <=> query_embedding))
        ELSE 0.0 
      END AS c_sim_score,
      -- 2. Điểm Lexical đa tầng: Exact Match chữ Hán/Pinyin > Full-text Search
      CASE 
        -- Khớp chính xác Giản thể hoặc Phồn thể
        WHEN has_text AND (lower(c.simplified) = clean_query OR lower(coalesce(c.traditional, '')) = clean_query) THEN 1.0
        -- Khớp Pinyin có dấu chính xác
        WHEN has_text AND lower(c.pinyin) = clean_query THEN 0.95
        -- Khớp Pinyin không dấu / dính liền trong pinyin_numbered (ví dụ 'nihao', 'xiexie', 'lvse')
        WHEN has_text AND coalesce(c.pinyin_numbered, '') ~* ('(^|\s)' || clean_query || '(\s|$)') THEN 0.90
        WHEN has_text AND coalesce(c.pinyin_numbered, '') ILIKE ('%' || clean_query || '%') THEN 0.80
        -- Khớp Full-text Search tsvector qua ts_rank_cd
        WHEN has_text AND ts_q IS NOT NULL AND c.search_tokens @@ ts_q THEN LEAST(ts_rank_cd(c.search_tokens, ts_q) * 2.5, 0.75)
        ELSE 0.0 
      END AS c_lex_score
    FROM public.rag_knowledge_chunks c
    JOIN public.rag_knowledge_sources s ON s.id = c.source_id
    WHERE s.is_verified = true 
      AND s.review_status = 'curated_verified'
      AND s.is_active = true
      AND c.is_verified = true
      AND c.review_status = 'curated_verified'
      AND (filter_hsk IS NULL OR c.hsk_level = filter_hsk OR c.hsk_level = 'All')
      AND (filter_type IS NULL OR c.chunk_type = filter_type)
  ),
  hybrid_scored AS (
    SELECT
      sc.*,
      -- Trọng số lai: Lấy giá trị lớn nhất giữa điểm kết hợp và điểm tín hiệu vượt trội
      CASE
        WHEN has_vector AND has_text THEN GREATEST(
          sc.c_sim_score * 0.50 + sc.c_lex_score * 0.50,
          sc.c_lex_score * 0.90,
          sc.c_sim_score * 0.90
        )
        WHEN has_vector THEN sc.c_sim_score
        ELSE sc.c_lex_score
      END AS c_hybrid_score
    FROM scored_candidates sc
  )
  SELECT
    hs.c_chunk_id,
    hs.c_source_id,
    hs.c_source_title,
    hs.c_source_url,
    hs.c_license,
    hs.c_attribution,
    hs.c_chunk_type,
    hs.c_hsk_level,
    hs.c_topic,
    hs.c_simplified,
    hs.c_traditional,
    hs.c_pinyin,
    hs.c_vietnamese_meaning,
    hs.c_pedagogical_notes,
    hs.c_grammar_pattern,
    hs.c_example_sentences,
    hs.c_sim_score::float,
    hs.c_lex_score::float,
    hs.c_hybrid_score::float
  FROM hybrid_scored hs
  WHERE hs.c_hybrid_score >= match_threshold
  ORDER BY hs.c_hybrid_score DESC
  LIMIT match_count;
END;
$$;
