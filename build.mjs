// Genera la página final en la carpeta _site a partir de contenido/sitio.json.
// Uso:  node build.mjs
// GitHub lo ejecuta solo cada vez que se guarda un cambio desde el panel.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { render } from './src/plantilla.mjs';

const OUT = '_site';
const datos = JSON.parse(readFileSync('contenido/sitio.json', 'utf8'));

// Dirección pública (para la vista previa al compartir). GitHub la pasa sola.
let base = process.env.SITE_URL || '';
if (base && !base.endsWith('/')) base += '/';
datos.__base = base;

// Revisión básica para que un error en el panel no rompa la página
const faltan = [];
if (!datos.productos?.length) faltan.push('al menos un producto');
if (!datos.giros?.length) faltan.push('al menos un giro');
if (!datos.contacto?.whatsapp) faltan.push('el número de WhatsApp');
for (const g of datos.giros || []) {
  for (const k of ['img_venta', 'img_inventario', 'img_catalogo']) {
    const f = (g[k] || '').replace(/^\//, '');
    if (!f || !existsSync(f)) faltan.push(`la imagen "${k}" del giro ${g.boton || '?'} (${g[k] || 'vacía'})`);
  }
}
if (faltan.length) {
  console.error('No se pudo generar la página. Falta:\n - ' + faltan.join('\n - '));
  process.exit(1);
}

// Las rutas de imágenes subidas desde el panel empiezan con "/"; se vuelven relativas
const rel = (v) => (typeof v === 'string' && v.startsWith('/assets/') ? v.slice(1) : v);
const limpiar = (o) => Array.isArray(o) ? o.map(limpiar)
  : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, limpiar(v)]))
  : rel(o);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/index.html`, render(limpiar(datos)));
for (const dir of ['css', 'js', 'assets']) cpSync(dir, `${OUT}/${dir}`, { recursive: true });
writeFileSync(`${OUT}/.nojekyll`, '');
console.log(`Página generada en ${OUT}/ (${datos.productos.length} productos, ${datos.giros.length} giros, ${datos.clientes.lista.length} clientes)`);
