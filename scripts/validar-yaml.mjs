#!/usr/bin/env node
// Valida el frontmatter YAML de todas las fichas antes de construir.
// Uso: node scripts/validar-yaml.mjs [ruta-a-un-md-concreto]
// Sale con código 1 y mensaje claro si alguna ficha está malformada.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const DIR = new URL('../src/content/obras/', import.meta.url).pathname;
const REQUERIDOS = ['titulo', 'autor', 'anio', 'catalogo', 'imagen', 'simbolo', 'historia', 'emocion', 'ilustracion'];

const archivos = process.argv[2]
  ? [process.argv[2]]
  : readdirSync(DIR).filter((f) => f.endsWith('.md')).map((f) => join(DIR, f));

let errores = 0;
const catalogos = new Map();

for (const ruta of archivos) {
  const nombre = ruta.split('/').pop();
  const texto = readFileSync(ruta, 'utf8');

  const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) {
    console.error(`? ${nombre}: no se encuentra el bloque frontmatter (--- ... ---)`);
    errores++; continue;
  }

  let data;
  try {
    data = yaml.load(m[1]);
  } catch (e) {
    const linea = e.mark ? e.mark.line + 2 : '?'; // +2: el --- inicial desplaza una línea
    console.error(`? ${nombre}: YAML inválido en la línea ${linea} — ${e.reason}`);
    console.error(`  Pista habitual: dentro de historia:/emocion:/ilustracion: | todas`);
    console.error(`  las líneas de texto deben ir indentadas con dos espacios.`);
    errores++; continue;
  }

  for (const campo of REQUERIDOS) {
    if (data?.[campo] === undefined || data[campo] === '') {
      console.error(`? ${nombre}: falta el campo '${campo}'`);
      errores++;
    }
  }

  if (data?.catalogo) {
    if (catalogos.has(data.catalogo)) {
      console.error(`? ${nombre}: catálogo ${data.catalogo} DUPLICADO (también en ${catalogos.get(data.catalogo)})`);
      errores++;
    } else {
      catalogos.set(data.catalogo, nombre);
    }
  }
}

if (errores > 0) {
  console.error(`\n? ${errores} problema(s). NO se publica hasta corregir.`);
  process.exit(1);
}
console.log(`? ${archivos.length} ficha(s) válidas, sin catálogos duplicados.`);