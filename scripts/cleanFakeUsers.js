import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://woszblniatdvijwdkmpm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvc3pibG5pYXRkdmlqd2RrbXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NzEwMTcsImV4cCI6MjEwNjA0NzAxN30.qpSGtdIgGG55MXsLJGbMS3KOLz6W_ZsC16r-6XixMXY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clean() {
  console.log('🔍 Kiểm tra và xóa người dùng ảo trong Supabase...');

  // 1. Check & delete fake posts
  const fakeAuthors = ['Trần Thảo Ly', 'Đặng Quốc Anh', 'Phạm Thu Trang', 'Nguyễn Thu Trang', 'Trần Đăng Khoa', 'Lê Hoàng Nam'];
  const { data: posts, error: pErr } = await supabase.from('community_posts').select('*');
  if (pErr) console.warn('Lỗi đọc posts:', pErr);
  else {
    console.log('Tổng số bài viết hiện tại:', posts?.length);
    for (const post of posts || []) {
      if (fakeAuthors.includes(post.author_name) || fakeAuthors.includes(post.author)) {
        console.log(`Xóa bài viết của tác giả ảo: ${post.author_name || post.author} (id: ${post.id})`);
        await supabase.from('community_posts').delete().eq('id', post.id);
      }
    }
  }

  // 2. Check & delete fake study partners
  const fakePartners = ['Nguyễn Thị Ánh Tuyết', 'Hoàng Minh Tuấn', 'Vũ Lan Phương', 'Nguyễn Thúy Hằng', 'Lê Tuấn Anh', 'Đặng Mai Phương'];
  const { data: partners, error: spErr } = await supabase.from('study_partners').select('*');
  if (spErr) console.warn('Lỗi đọc study_partners:', spErr);
  else {
    console.log('Tổng số bạn học ghép đôi hiện tại:', partners?.length);
    for (const sp of partners || []) {
      if (fakePartners.includes(sp.name)) {
        console.log(`Xóa bạn học ảo: ${sp.name} (id: ${sp.id})`);
        await supabase.from('study_partners').delete().eq('id', sp.id);
      }
    }
  }

  // 3. Check fake profiles in profiles table
  const { data: profiles, error: prErr } = await supabase.from('profiles').select('*');
  if (prErr) console.warn('Lỗi đọc profiles:', prErr);
  else {
    console.log('Tổng số hồ sơ trong profiles:', profiles?.length);
    for (const pr of profiles || []) {
      const email = (pr.email || '').toLowerCase();
      if (email !== 'lehaidang16032006@gmail.com' && (
        pr.name?.includes('Demo') || 
        email.includes('hanzigo.com') ||
        email.includes('example.com')
      )) {
        console.log(`Xóa hồ sơ người dùng ảo: ${pr.name} (${pr.email})`);
        await supabase.from('profiles').delete().eq('id', pr.id);
      }
    }
  }

  console.log('✅ Hoàn tất xóa dữ liệu ảo trong Supabase!');
}

clean().catch(console.error);
