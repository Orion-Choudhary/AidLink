import React from 'react';

/**
 * Skeleton Primitive Component
 * Renders an animated shimmering placeholder for content while data loads.
 */
export default function Skeleton({
  variant = 'rectangular', // 'text' | 'circular' | 'rectangular' | 'badge'
  width,
  height,
  className = '',
  style = {},
  rounded = 'rounded-md',
  ...props
}) {
  let defaultClasses = 'skeleton-shimmer relative overflow-hidden border border-slate-300/50 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ';

  switch (variant) {
    case 'circular':
      defaultClasses += 'rounded-full ';
      break;
    case 'text':
      defaultClasses += `${rounded} h-4 my-1 `;
      break;
    case 'badge':
      defaultClasses += 'rounded-full h-6 px-3 ';
      break;
    case 'rectangular':
    default:
      defaultClasses += `${rounded} `;
      break;
  }

  const customStyle = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style,
  };

  return (
    <div
      className={`${defaultClasses} ${className}`}
      style={customStyle}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonText({ lines = 2, className = '', lastLineWidth = '70%' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className="w-full"
          style={i === lines - 1 ? { width: lastLineWidth } : {}}
        />
      ))}
    </div>
  );
}
