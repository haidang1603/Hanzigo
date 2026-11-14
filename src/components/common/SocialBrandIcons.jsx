import React from 'react';

export function ZaloBrandIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="12" fill="#0068FF" />
      <path
        d="M36.8 34.4C33.7 37.3 29.1 39 24 39C21.7 39 19.5 38.6 17.5 37.9L10.5 40L12.6 34.1C10.3 31.6 9 28.4 9 24.9C9 16.7 15.7 10 24 10C32.3 10 39 16.7 39 24.9C39 28.6 38.2 31.9 36.8 34.4Z"
        fill="#FFFFFF"
      />
      <text
        x="24"
        y="28.2"
        textAnchor="middle"
        fill="#0068FF"
        fontSize="11.5"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-0.4"
      >
        Zalo
      </text>
    </svg>
  );
}

export function FacebookBrandIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="24" fill="#1877F2" />
      <path
        d="M26.7 47.8V30.1H32.6L33.5 23.2H26.7V18.8C26.7 16.8 27.3 15.4 30.1 15.4H33.7V9.2C33.1 9.1 30.9 8.9 28.4 8.9C23.1 8.9 19.5 12.1 19.5 18.1V23.2H13.5V30.1H19.5V47.5C21 47.8 22.5 48 24 48C24.9 48 25.8 47.9 26.7 47.8Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
