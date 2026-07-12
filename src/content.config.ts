import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Cada obra = un archivo Markdown en src/content/obras/.
// El cuerpo del .md es libre; los campos estructurados van en el frontmatter.
// Para añadir una obra nueva basta con dejar caer un .md aquí (Fase 2 automatiza esto).
const obras = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/obras' }),
  schema: z.object({
    // Bloque 1 de la ficha: la "solución" del juego.
    titulo: z.string(),
    autor: z.string(),
    anio: z.number().int(),

    // Bloque 4: qué símbolo se eligió y por qué.
    simbolo: z.string(), // resumen corto del símbolo, se usa en alt/caption
    ilustracion: z.string(), // texto largo: el porqué del símbolo

    // Bloques 2 y 3.
    historia: z.string(),
    emocion: z.string(),

    // Imagen: ruta relativa a /public. Sustituye el placeholder por el PNG real.
    imagen: z.string(),
    imagenAlt: z.string().optional(),

    // Acento cálido de la obra (el color que "brilla"). Se usa en el marco/placard.
    acento: z.string().default('#E8622C'),

    // Portada / obra destacada del home.
    destacada: z.boolean().default(false),

    // Orden de catálogo y control de publicación.
    catalogo: z.string(), // p.ej. "MOS-001"
    orden: z.number().default(999),
    borrador: z.boolean().default(false),
  }),
});

export const collections = { obras };
