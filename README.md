# Maida Smirlian Odontología

Sitio single-page para consultorio odontológico premium en Recoleta, CABA.

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

## Configuración de Google Analytics (GA4)

1. Crear el archivo `.env` en la raíz con el ID de GA4:

```bash
VITE_GA_ID=G-XXXXXXXXXX
```

2. Reiniciar el servidor de desarrollo para que tome el cambio.

## Datos editables

Toda la información vive en JSON dentro de `src/data`:

- `site.json`: datos generales, WhatsApp, dirección, links y hero.
- `services.json`: servicios y mensajes de WhatsApp.
- `gallery.json`: galería (imágenes de stock).
- `testimonials.json`: testimonios.
- `faqs.json`: preguntas frecuentes.

## Deploy en Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Configurar la variable `VITE_GA_ID` en el panel de Netlify.

## Nota de placeholders

Revisar los placeholders de WhatsApp, links de reservas y dominio del sitemap antes de publicar.
