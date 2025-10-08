import React from 'react';

export default function OptimizedImage({
  src,
  alt,
  className,
  loading = 'lazy',
  decoding = 'async',
  sizes,
  ...props
}) {
  // If src is already WebP, use it directly
  if (src.includes('.webp')) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        sizes={sizes}
        {...props}
      />
    );
  }

  // Extract filename and extension for fallback
  const pathParts = src.split('/');
  const filename = pathParts[pathParts.length - 1];
  const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg)$/i, '');
  const optimizedDir = src.replace(filename, 'optimized/');
  
  // Generate WebP and optimized versions
  const webpSrc = `${optimizedDir}${nameWithoutExt}.webp`;
  const optimizedSrc = `${optimizedDir}${filename}`;

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={optimizedSrc}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        sizes={sizes}
        {...props}
      />
    </picture>
  );
}
