# Cómo administrar la página de Rodriguez IT Solutions

## Dirección gratis (mientras no haya dominio)

**https://itsolutions07.github.io/**

Es gratis, tiene candado de seguridad (HTTPS) y aguanta hasta 100 GB de visitas al mes.
La app de salón sigue funcionando igual en https://itsolutions07.github.io/drc-salon/.
Cuando compre un dominio (por ejemplo `rodriguezit.com`), se conecta a esta misma página sin rehacer nada.

---

## 1. Configuración inicial (se hace una sola vez)

1. Entre a https://github.com con la cuenta **Itsolutions07**.
2. Botón **New** (nuevo repositorio).
   - Nombre: **itsolutions07.github.io** (exactamente así).
   - Público.
   - No marque ninguna casilla (ni README ni .gitignore).
   - **Create repository**.
3. Avísele a Claude: él sube la página.
4. En el repositorio: **Settings → Pages → Source: GitHub Actions**.
5. En unos 2 minutos la página queda en línea.

## 2. Activar el panel de edición (una sola vez)

1. Entre a **https://app.pagescms.org**.
2. **Sign in with GitHub** con la cuenta Itsolutions07.
3. Autorice el acceso al repositorio **itsolutions07.github.io**.
4. Elija ese repositorio y verá **Página principal** con todas las secciones.

---

## 3. Cambiar textos (día a día)

1. Entre a https://app.pagescms.org → **Página principal**.
2. Abra la sección que quiere cambiar (Portada, Productos, Clientes…).
3. Escriba el cambio.
4. Toque **Save** (Guardar).
5. Espere 1 o 2 minutos y recargue la página. Ya está publicado.

**Truco de la cursiva de color:** en títulos y frases, lo que ponga entre asteriscos sale en cursiva azul (o del color del producto).
`Cobre rápido y *con factura legal.*` → Cobre rápido y *con factura legal.*

## 4. Agregar o cambiar imágenes

1. En el campo de imagen toque el recuadro → **Upload** y elija la foto de su computadora o celular.
2. Las fotos nuevas se guardan en la carpeta `subidas`.
3. **Recomendaciones:**
   - Pantallas de computadora: horizontales, unos 1440 × 900 px.
   - Catálogos de celular: capturas verticales largas, 480 px de ancho.
   - Portadas de clientes: verticales 9:16 (como un video de TikTok).
   - Peso: menos de 500 KB por foto. Formato **.webp** o **.jpg**.
   - Videos: MP4 vertical de menos de 10 MB.
   - Si una foto pesa mucho, pásela a Claude para que la optimice.

## 5. Agregar un producto, un giro o un cliente

- En la lista correspondiente toque **Add** (Agregar), llene los campos y guarde.
- Para cambiar el orden, arrastre los elementos.
- Para quitar uno, use el ícono de basura.

**Giros:** cada giro necesita 3 imágenes (pantalla de venta, de inventario y catálogo).
Si falta alguna, la página **no se publica** y conserva la versión anterior. Así nunca queda rota.

## 6. Si algo sale mal

- **No se actualizó:** en GitHub, pestaña **Actions**. Si hay una ✗ roja, ábrala; el mensaje dice en español qué falta.
- **Quiero volver a la versión anterior:** en GitHub, pestaña **Commits**, busque el cambio y use **Revert**. O pídaselo a Claude.
- Todo cambio queda guardado con fecha, así que nada se pierde.

---

## Qué se puede cambiar desde el panel

| Sección | Qué se edita |
|---|---|
| General y Google | Título de la pestaña, descripción en Google, pie de página |
| Contacto | Número de WhatsApp (cambia en todos los botones), Instagram |
| Portada | Titular, párrafo, botones y sus mensajes |
| Cinta de giros | Las palabras que se desplazan |
| Productos | Nombre, frase, 3 puntos, colores, imágenes, botón y mensaje de WhatsApp |
| ¿Qué vende usted? | Título y los giros con sus 3 pantallas |
| Antes / Después | Título y los catálogos del lado "Después" |
| Mantenimiento | Servicios y modalidades (a distancia / a domicilio) |
| Clientes | Negocios, portada y video |
| Cierre | Título final y mensaje de WhatsApp |

**Cambios de diseño** (colores generales, animaciones, secciones nuevas) se hacen en el código: pídaselos a Claude.

---

## Para Claude (parte técnica)

- Contenido: `contenido/sitio.json` · Panel: `.pages.yml` · Plantilla: `src/plantilla.mjs` · Estilos: `css/styles.css` · Interacción: `js/main.js`
- Generar localmente: `node build.mjs` → carpeta `_site/` (no se sube; GitHub la crea).
- Publicación: `.github/workflows/publicar.yml` en cada push a `main`.
- Con dominio propio: agregar archivo `CNAME` dentro de `_site` desde `build.mjs` y configurar el DNS.
