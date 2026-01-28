# Optimización de Video

Este script optimiza el video de GENO32 para reducir el consumo de ancho de banda en Netlify.

## Requisitos

Necesitás tener `ffmpeg` instalado:

- **macOS**: `brew install ffmpeg`
- **Ubuntu/Debian**: `sudo apt-get install ffmpeg`
- **Windows**: Descargar desde https://ffmpeg.org/download.html

## Uso

```bash
npm run optimize-video
```

## Qué hace el script

1. **Genera versión optimizada MP4** (`geno32-optimized.mp4`)
   - Compresión H.264 con calidad balanceada
   - Reduce el tamaño significativamente manteniendo buena calidad
   - Incluye `faststart` para reproducción más rápida

2. **Genera versión WebM** (`geno32.webm`)
   - Formato WebM con codec VP9
   - Mejor compresión que MP4
   - Usado como primera opción en navegadores compatibles

3. **Genera versión móvil** (`geno32-mobile.mp4`)
   - Resolución 480p para dispositivos móviles
   - Menor tamaño de archivo
   - Se carga automáticamente en pantallas pequeñas

4. **Genera poster/thumbnail** (`geno32-poster.jpg`)
   - Frame del video a los 2 segundos
   - Se muestra mientras el video carga
   - Mejora la experiencia de usuario

## Resultado

Los videos optimizados se guardan en `public/img/video/`:
- `geno32-optimized.mp4` - Versión principal optimizada
- `geno32.webm` - Versión WebM (mejor compresión)
- `geno32-mobile.mp4` - Versión móvil 480p
- `geno32-poster.jpg` - Thumbnail/poster

## Notas

- El video original (`gen32v2.mp4`) se mantiene como fallback
- El componente de video usa automáticamente la mejor versión disponible
- Si no ejecutás el script, el video original se usará directamente (48MB)
