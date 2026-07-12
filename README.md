# museofmusic.art — Fase 1

Galería estática (Astro) donde cada canción es una ilustración simbólica con su ficha.
Objetivo Fase 1: web presentable para la charla de octubre. Sin automatización todavía.

## Stack
- **Astro 5** (static, sin JS de cliente salvo lo mínimo).
- Fuentes **autoalojadas** (`@fontsource`): sin llamadas a Google → privacidad + offline.
- Contenido en `src/content/obras/*.md` (una obra = un archivo).

## Arrancar en local (WSL/Docker o node directo)
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera /dist (lo que subes al VPS)
npm run preview    # sirve /dist para revisar el build final
```

## Añadir una obra (Fase 1, manual)
1. Copia un `.md` de `src/content/obras/` y renómbralo (el nombre = slug/URL).
2. Rellena el frontmatter. Campos en `src/content.config.ts`.
3. Deja el PNG real en `public/obras/<slug>.png` y apunta `imagen: "/obras/<slug>.png"`.
4. `npm run build`. La página de ficha y la home se regeneran solas.

## Placeholders
Las imágenes en `public/obras/*.svg` son **marcadores**, no el arte final.
Sustitúyelas por tus PNG de ChatGPT (mismo slug) y actualiza `imagen` en cada `.md`.
Generador de placeholders: `node scripts/gen-placeholders.mjs` (regenera los SVG).

## Desplegar en el VPS
El build es estático: todo lo servible queda en `/dist`.
1. `npm run build` en local.
2. Sube el contenido de `dist/` al docroot del sitio con **WinSCP**.
3. Sirve como sitio estático (Nginx `root /ruta/dist; try_files $uri $uri/ =404;`).

No hay base de datos, PHP ni panel. Rollback = volver a la copia anterior de `dist/`.

## Antes de publicar
- `astro.config.mjs` → `site: 'https://museofmusic.art'` (canonical, og, sitemap).
- Sustituye placeholders por arte real.
- Revisa/reescribe las fichas con tu voz (los textos actuales son borrador).
- Añade `public/og-default.png` (imagen social por defecto).

## Reglas legales (innegociables, van en el diseño)
- Nunca letra de canciones (ni un verso) en imagen, ficha ni metadatos.
- Nunca caras reconocibles de personas reales.
- En la ficha sí se nombra autor/año (son hechos).
