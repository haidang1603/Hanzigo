/**
 * Backward compatibility facade for HanziGo Supabase Services.
 * All logic has been modularized under src/services/
 */
export * from '../services/index.js';

// Backward compatibility helper for any legacy references
export async function loginWithGoogleInstant() {
  console.warn('loginWithGoogleInstant đã bị vô hiệu hóa vì lý do bảo mật. Vui lòng sử dụng loginWithGoogle (Google OAuth chuẩn).');
  throw new Error('Tính năng đăng nhập mô phỏng đã bị tắt trên môi trường sản xuất. Vui lòng sử dụng đăng nhập Google chính thức hoặc Email/Mật khẩu.');
}
