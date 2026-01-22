# Scripts de Optimización

## optimize-images.js

Este script convierte todas las imágenes de `public/img/stock/` a formatos optimizados:

- **WebP**: Versiones en formato WebP (30-50% más pequeñas que PNG/JPG)
- **Versiones responsivas**: Genera 4 tamaños diferentes:
  - `thumbnail`: 120px (para miniaturas)
  - `small`: 400px (para móviles)
  - `medium`: 800px (para tablets)
  - `large`: 1200px (para desktop)
- **Placeholders**: Imágenes pequeñas y borrosas para mostrar mientras carga la imagen real

### Uso

```bash
npm run optimize-images
```

### Resultado

Las imágenes optimizadas se guardan en `public/img/optimized/` con el siguiente formato:
- `{nombre}-{tamaño}.webp` (WebP)
- `{nombre}-{tamaño}.{ext}` (formato original en tamaño reducido)
- `{nombre}-placeholder.webp` (placeholder blur)

### Notas

- El script mantiene la calidad visual (85% para WebP)
- Las imágenes se redimensionan sin deformar (fit: 'inside')
- Si agregás nuevas imágenes a `/img/stock/`, ejecutá el script nuevamente
