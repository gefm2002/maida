import { useState } from 'react'

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

  // Determinar si las clases incluyen h-auto (para imágenes que deben mostrarse completas)
  const hasAutoHeight = className.includes('h-auto')
  const containerClasses = hasAutoHeight 
    ? `relative ${className}` 
    : `relative overflow-hidden ${className}`
  const imageClasses = hasAutoHeight
    ? `${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`
    : `h-full w-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`

  return (
    <div className={containerClasses} style={!hasAutoHeight ? { width, height } : undefined}>
      {/* Skeleton loader simple mientras carga */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-light-gray via-mint-light/30 to-light-gray animate-pulse" />
      )}

      {/* Imagen optimizada con WebP y srcset */}
      {useOptimized ? (
        <picture>
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
            className={imageClasses}
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
          className={imageClasses}
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
          className={hasAutoHeight ? className : "h-full w-full object-cover opacity-100"}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </div>
  )
}
