import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

/**
 * UserAvatar: Thành phần hiển thị Avatar đồng bộ chuẩn cho toàn bộ ứng dụng
 * Ưu tiên:
 * 1. user.avatar
 * 2. localStorage.getItem('hanzigo_custom_avatar')
 * 3. user.avatar_url / user.photoURL / user.user_metadata
 * Tự động đồng bộ thời gian thực khi người dùng đổi ảnh đại diện trong ProfilePage
 */
export default function UserAvatar({
  user,
  size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl'
  className = '',
  border = true,
  alt = ''
}) {
  const [avatarSrc, setAvatarSrc] = useState(() => {
    return (
      user?.avatar ||
      localStorage.getItem('hanzigo_custom_avatar') ||
      user?.avatar_url ||
      user?.photoURL ||
      user?.user_metadata?.avatar_url ||
      user?.user_metadata?.picture ||
      null
    );
  });
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const resolveAvatar = () => {
      const src =
        user?.avatar ||
        localStorage.getItem('hanzigo_custom_avatar') ||
        user?.avatar_url ||
        user?.photoURL ||
        user?.user_metadata?.avatar_url ||
        user?.user_metadata?.picture ||
        null;
      setAvatarSrc(src);
      setImgError(false);
    };

    resolveAvatar();

    const handleAvatarUpdate = (e) => {
      if (e?.detail !== undefined) {
        setAvatarSrc(e.detail || null);
        setImgError(false);
      } else {
        resolveAvatar();
      }
    };

    window.addEventListener('hanzigo_avatar_updated', handleAvatarUpdate);
    window.addEventListener('storage', resolveAvatar);

    return () => {
      window.removeEventListener('hanzigo_avatar_updated', handleAvatarUpdate);
      window.removeEventListener('storage', resolveAvatar);
    };
  }, [user]);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-14 h-14 text-base'
  };

  const chosenSize = sizeClasses[size] || sizeClasses.md;
  const borderClass = border ? 'border-2 border-[#E85D3F]' : '';

  // 1. Emoji avatar (độ dài <= 4 ký tự: 🐼, 🦊, 🐉, 🎋, ...)
  if (avatarSrc && avatarSrc.length <= 4 && !imgError) {
    return (
      <div
        className={`${chosenSize} rounded-full bg-[#FFF5F2] dark:bg-[#2C1D1A] ${borderClass} flex items-center justify-center shadow-xs shrink-0 select-none overflow-hidden ${className}`}
      >
        <span className="leading-none text-sm">{avatarSrc}</span>
      </div>
    );
  }

  // 2. Image avatar (URL hoặc Base64 data URL)
  if (avatarSrc && !imgError) {
    return (
      <div
        className={`${chosenSize} rounded-full bg-[#FFF5F2] dark:bg-[#2C1D1A] ${borderClass} shadow-xs shrink-0 overflow-hidden ${className}`}
      >
        <img
          src={avatarSrc}
          alt={alt || user?.name || 'Avatar'}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // 3. Fallback: Ký tự đầu của tên hoặc icon User
  return (
    <div
      className={`${chosenSize} rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] ${borderClass} flex items-center justify-center text-[#E85D3F] font-bold shadow-xs shrink-0 select-none ${className}`}
    >
      {user?.name ? (
        <span>{user.name.charAt(0).toUpperCase()}</span>
      ) : (
        <User size={size === 'xs' ? 12 : size === 'sm' ? 13 : size === 'lg' ? 18 : size === 'xl' ? 24 : 14} />
      )}
    </div>
  );
}

