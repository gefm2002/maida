import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const inputVideo = join(__dirname, '../public/img/gen32v2.mp4')
const outputDir = join(__dirname, '../public/img/video')

// Verificar si ffmpeg está instalado
function checkFFmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

async function optimizeVideo() {
  if (!existsSync(inputVideo)) {
    console.error(`✗ Video no encontrado: ${inputVideo}`)
    return
  }

  if (!checkFFmpeg()) {
    console.error('✗ ffmpeg no está instalado.')
    console.log('\nPara optimizar el video, necesitás instalar ffmpeg:')
    console.log('  macOS: brew install ffmpeg')
    console.log('  Ubuntu: sudo apt-get install ffmpeg')
    console.log('  Windows: https://ffmpeg.org/download.html')
    console.log('\nPor ahora, el video se usará sin optimizar.')
    return
  }

  console.log('Optimizando video...\n')

  try {
    // Crear directorio de salida
    execSync(`mkdir -p "${outputDir}"`, { stdio: 'inherit' })

    // Versión optimizada MP4 (H.264, calidad media, tamaño reducido)
    console.log('Generando versión MP4 optimizada...')
    execSync(
      `ffmpeg -i "${inputVideo}" -c:v libx264 -preset slow -crf 28 -c:a aac -b:a 128k -movflags +faststart "${outputDir}/geno32-optimized.mp4"`,
      { stdio: 'inherit' }
    )

    // Versión WebM (mejor compresión)
    console.log('\nGenerando versión WebM...')
    execSync(
      `ffmpeg -i "${inputVideo}" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 128k "${outputDir}/geno32.webm"`,
      { stdio: 'inherit' }
    )

    // Versión pequeña para móviles (480p)
    console.log('\nGenerando versión móvil (480p)...')
    execSync(
      `ffmpeg -i "${inputVideo}" -vf scale=854:480 -c:v libx264 -preset slow -crf 28 -c:a aac -b:a 96k -movflags +faststart "${outputDir}/geno32-mobile.mp4"`,
      { stdio: 'inherit' }
    )

    // Generar poster/thumbnail (frame a los 2 segundos)
    console.log('\nGenerando poster/thumbnail...')
    execSync(
      `ffmpeg -i "${inputVideo}" -ss 00:00:02 -vframes 1 -vf scale=1280:720 "${outputDir}/geno32-poster.jpg"`,
      { stdio: 'inherit' }
    )

    console.log('\n✓ Optimización completa!')
    console.log(`\nVideos generados en: ${outputDir}`)
    console.log('  - geno32-optimized.mp4 (versión principal optimizada)')
    console.log('  - geno32.webm (versión WebM, mejor compresión)')
    console.log('  - geno32-mobile.mp4 (versión móvil 480p)')
    console.log('  - geno32-poster.jpg (thumbnail)')
  } catch (error) {
    console.error('✗ Error optimizando video:', error.message)
  }
}

optimizeVideo()
