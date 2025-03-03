import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  lowQualitySrc?: string;
}

export function ProgressiveImage({
  src,
  lowQualitySrc,
  alt,
  className,
  ...props
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Low quality placeholder */}
      {lowQualitySrc && isLoading && (
        <img
          src={lowQualitySrc}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full object-cover blur-lg scale-105',
            className
          )}
          {...props}
        />
      )}

      {/* Main image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading && 'opacity-0',
          error && 'hidden',
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
        {...props}
      />

      {/* Loading skeleton */}
      {isLoading && !lowQualitySrc && (
        <div className={cn(
          'absolute inset-0 bg-gray-200 animate-pulse',
          className
        )} />
      )}

      {/* Error state */}
      {error && (
        <div className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className
        )}>
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
}