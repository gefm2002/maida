import sharp from 'sharp'
import { readdir, stat, mkdir } from 'fs/promises'
import { join, dirname, extname, basename } from 'path'
import { existsSync } from 'fs'

const inputDir = 'public/img/stock'
const outputDir = 'public/img/optimized'

// Tamaños responsivos para diferentes breakpoints
const sizes = {
  thumbnail: 120,
  small: 400,
  medium: 800,
  large: 1200,
}

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
}

async function optimizeImage(inputPath, outputBase) {
  const ext = extname(inputPath).toLowerCase()
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    console.log(`Skipping ${inputPath} (not a supported image format)`)
    return
  }

  const name = basename(inputPath, ext)
  const results = []

  try {
    // Generar versiones WebP en diferentes tamaños
    for (const [sizeName, width] of Object.entries(sizes)) {
      const webpPath = join(outputDir, `${name}-${sizeName}.webp`)
      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({ quality: 85 })
        .toFile(webpPath)
      results.push({ format: 'webp', size: sizeName, path: webpPath })

      // También generar versión original en tamaño reducido para fallback
      const originalPath = join(outputDir, `${name}-${sizeName}${ext}`)
      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .toFile(originalPath)
      results.push({ format: ext.slice(1), size: sizeName, path: originalPath })
    }

    // Generar placeholder blur (imagen muy pequeña y borrosa)
    const placeholderPath = join(outputDir, `${name}-placeholder.webp`)
    await sharp(inputPath)
      .resize(20, 20, { fit: 'cover' })
      .blur(10)
      .webp({ quality: 50 })
      .toFile(placeholderPath)
    results.push({ format: 'webp', size: 'placeholder', path: placeholderPath })

    console.log(`✓ Optimized ${inputPath}`)
  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error.message)
  }

  return results
}

async function main() {
  console.log('Starting image optimization...\n')

  await ensureDir(outputDir)

  try {
    const files = await readdir(inputDir)
    const imageFiles = files.filter((file) => {
      const ext = extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png'].includes(ext)
    })

    console.log(`Found ${imageFiles.length} images to optimize\n`)

    for (const file of imageFiles) {
      const inputPath = join(inputDir, file)
      await optimizeImage(inputPath, join(outputDir, basename(file, extname(file))))
    }

    console.log(`\n✓ Optimization complete! Images saved to ${outputDir}`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
