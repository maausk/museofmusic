#!/bin/bash
# Convierte los PNG de public/obras/ a WebP optimizado (1200px, q82).
# Los PNG originales se apartan a ../originales/ (fuera de public: no se sirven,
# pero no se pierden: son tus másteres).
set -e
PROY="/var/www/museofmusic/museofmusic"
OBRAS="$PROY/public/obras"
MASTERS="$PROY/../originales"
mkdir -p "$MASTERS"

shopt -s nullglob
for png in "$OBRAS"/*.png; do
  base=$(basename "$png" .png)
  webp="$OBRAS/$base.webp"
  echo "→ $base.png"
  cwebp -quiet -q 82 -resize 1200 0 "$png" -o "$webp"
  antes=$(du -k "$png" | cut -f1)
  despues=$(du -k "$webp" | cut -f1)
  echo "   ${antes}KB → ${despues}KB"
  mv "$png" "$MASTERS/"
done

echo "✓ Hecho. Recuerda: los .md deben apuntar a .webp"
