import React from 'react';

// The eight-ray sun from the Philippine flag, reused throughout the site
// as a section marker instead of generic numbering — it stands for the
// eight provinces that rose first, and here for the communities across
// Japan's prefectures that make up the samahan.
export default function Sunburst({ size = 28, color = 'var(--color-sun)', style }) {
  const rays = Array.from({ length: 8 });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={style}
      aria-hidden="true"
    >
      <g transform="translate(50,50)">
        {rays.map((_, i) => {
          const angle = (360 / 8) * i;
          return (
            <path
              key={i}
              d="M0,-14 L6,-40 L0,-48 L-6,-40 Z"
              fill={color}
              transform={`rotate(${angle})`}
            />
          );
        })}
        <circle r="13" fill={color} />
      </g>
    </svg>
  );
}
