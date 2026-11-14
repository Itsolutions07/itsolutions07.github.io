// Genera la página final en la carpeta _site a partir de contenido/sitio.json.
// Uso:  node build.mjs
// GitHub lo ejecuta solo cada vez que se guarda un cambio desde el panel.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { render } from './src/plantilla.mjs';

const OUT = '_site';
const datos = JSON.parse(readFileSync('contenido/sitio.json', 'utf8'));

// Dirección pública (para la vista previa al compartir). GitHub la pasa sola.
let base = process.env.SITE_URL || '';
if (base && !base.endsWith('/')) base += '/';
datos.__base = base;
datos.__ver = Date.now().toString(36);
datos.__ogv = createHash('md5').update(readFileSync('assets/img/og-image.jpg')).digest('hex').slice(0, 8); // evita que los celulares usen archivos viejos

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
// y se les agrega una huella del archivo (?v=...) para que los celulares no muestren una foto vieja.
const huellas = new Map();
const huella = (f) => {
  if (!huellas.has(f)) huellas.set(f, existsSync(f) ? createHash('md5').update(readFileSync(f)).digest('hex').slice(0, 8) : '');
  return huellas.get(f);
};
const rel = (v) => {
  if (typeof v !== 'string' || !v.startsWith('/assets/')) return v;
  const f = v.slice(1);
  const h = huella(f);
  return h ? `${f}?v=${h}` : f;
};
const limpiar = (o) => Array.isArray(o) ? o.map(limpiar)
  : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, limpiar(v)]))
  : rel(o);

// Vaciar la carpeta de salida. Si un archivo está abierto (p. ej. un video en la vista previa local),
// se deja y se sobrescribe después en lugar de detener todo.
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) {
  try { rmSync(`${OUT}/${f}`, { recursive: true, force: true, maxRetries: 3 }); } catch { /* se sobrescribe abajo */ }
}
writeFileSync(`${OUT}/index.html`, render(limpiar(datos)));
for (const dir of ['css', 'js', 'assets']) cpSync(dir, `${OUT}/${dir}`, { recursive: true });
writeFileSync(`${OUT}/.nojekyll`, '');
cpSync('assets/img/favicon.ico', `${OUT}/favicon.ico`);
console.log(`Página generada en ${OUT}/ (${datos.productos.length} productos, ${datos.giros.length} giros, ${datos.clientes.lista.length} clientes)`);
