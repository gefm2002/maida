import { useState, useEffect } from 'react'

type OptimizedImageProps = {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
}

const getImagePaths = (originalSrc: string) => {
  const basePath = originalSrc.replace('/img/stock/', '/img/optimized/').replace(/\.(jpg|jpeg|png)$/i, '')
  const ext = originalSrc.match(/\.(jpg|jpeg|png)$/i)?.[1]?.toLowerCase() || 'jpg'

  return {
    webp: {
      thumbnail: `${basePath}-thumbnail.webp`,
      small: `${basePath}-small.webp`,
      medium: `${basePath}-medium.webp`,
      large: `${basePath}-large.webp`,
    },
    fallback: {
      thumbnail: `${basePath}-thumbnail.${ext}`,
      small: `${basePath}-small.${ext}`,
      medium: `${basePath}-medium.${ext}`,
      large: `${basePath}-large.${ext}`,
    },
    placeholder: `${basePath}-placeholder.webp`,
    original: originalSrc,
  }
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const paths = getImagePaths(src)

  useEffect(() => {
    // Preload placeholder para mejor UX
    const placeholderImg = new Image()
    placeholderImg.src = paths.placeholder
  }, [paths.placeholder])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    // Si falla la imagen optimizada, intentar con la original
    if (!hasError) {
      setHasError(true)
      setIsLoaded(true)
    }
  }

  // Usar imágenes optimizadas si están disponibles (no están en la ruta original)
  const useOptimized = !src.includes('/optimized/')

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Placeholder blur mientras carga */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-light-gray blur-sm"
          style={{
            backgroundImage: `url(${paths.placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Imagen optimizada con WebP y srcset */}
      {useOptimized ? (
        <picture className={isLoaded ? 'block' : 'hidden'}>
          <source
            srcSet={`
              ${paths.webp.thumbnail} 120w,
              ${paths.webp.small} 400w,
              ${paths.webp.medium} 800w,
              ${paths.webp.large} 1200w
            `}
            sizes={sizes}
            type="image/webp"
          />
          <source
            srcSet={`
              ${paths.fallback.thumbnail} 120w,
              ${paths.fallback.small} 400w,
              ${paths.fallback.medium} 800w,
              ${paths.fallback.large} 1200w
            `}
            sizes={sizes}
          />
          <img
            src={paths.fallback.medium}
            srcSet={`
              ${paths.fallback.thumbnail} 120w,
              ${paths.fallback.small} 400w,
              ${paths.fallback.medium} 800w,
              ${paths.fallback.large} 1200w
            `}
            sizes={sizes}
            alt={alt}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
      ) : (
        <img
          src={paths.original}
          alt={alt}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Fallback a imagen original si hay error */}
      {hasError && (
        <img
          src={paths.original}
          alt={alt}
          className="h-full w-full object-cover"
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}

      {/* Skeleton loader mientras carga */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-mint-light/20" />
      )}
    </div>
  )
}
