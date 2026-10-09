# Leonardo Monay — Portfolio

Portfolio personal, bilingüe (español / inglés), exportado como sitio estático y publicado en GitHub Pages: **https://leomonay.github.io/**

Además de presentar mi trabajo, el proyecto es una muestra de cómo trabajo: i18n estático, temas sin parpadeo, accesibilidad, Lighthouse 95+ y contenido separado del código.

## Stack

| Área       | Elección                                                       |
| ---------- | -------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router) con `output: 'export'`                 |
| UI         | React 19, JavaScript (sin TypeScript)                          |
| Estilos    | Tailwind CSS 4 + daisyUI 5, `tailwind-variants` para variantes |
| i18n       | next-intl 4 con `next/root-params`                             |
| Tipografía | Bricolage Grotesque (títulos) + Inter (texto), vía `next/font` |
| Calidad    | ESLint 9 (flat config) + Prettier, husky + lint-staged         |
| Deploy     | GitHub Actions → GitHub Pages                                  |

## Cómo correrlo

Requiere **Node 24** (está fijado en `.nvmrc` y en `engines`).

```bash
nvm use            # o instalá la versión de .nvmrc
npm install        # instala dependencias y activa los git hooks (script "prepare")
npm run dev        # http://localhost:3000 → redirige a /es/ o /en/
```

Para probar exactamente lo que se publica:

```bash
npm run build      # genera out/
npm run serve      # sirve out/ en http://localhost:3000
```

### Scripts

| Script                   | Qué hace                                                            |
| ------------------------ | ------------------------------------------------------------------- |
| `npm run dev`            | Servidor de desarrollo                                              |
| `npm run build`          | Exportación estática en `out/`                                      |
| `npm run serve`          | Sirve `out/` localmente                                             |
| `npm run lint`           | ESLint                                                              |
| `npm run format`         | Prettier (escribe) — `format:check` solo verifica                   |
| `npm run check:messages` | Verifica que `en.json` tenga la misma estructura que `es.json`      |
| `npm run check:contrast` | Verifica contraste WCAG AA de ambos temas a partir de `globals.css` |

## Arquitectura

```
messages/                 Todo el texto del sitio, por idioma (es.json es la referencia)
scripts/                  Chequeos: paridad de mensajes y contraste WCAG
public/.nojekyll          Evita que Pages ignore la carpeta _next/
src/
  app/
    (root)/               "/" — layout + página mínima que redirige al idioma
    [locale]/             "/es/" y "/en/" — layout raíz, página, metadata, og.png
    global-not-found.js   404 bilingüe (out/404.html)
    icon.svg, sitemap.js, robots.js
  i18n/                   routing.js (idiomas) y request.js (carga de mensajes)
  components/
    navbar/               Navbar (server) + LanguageSwitcher, ThemeSwitcher, MobileMenu (client)
    sections/             Una sección por archivo; experience/ es la sección de referencia
    ui/                   Primitivas: Button, Card, Disclosure, Section
  animations/             Todas las animaciones: CSS por efecto + RevealObserver
  lib/                    site.js (URL, perfiles), sections.js (ids), theme*, fonts, inline-scripts
  styles/globals.css      Tailwind, temas daisyUI, clases @apply
```

### Cómo se arma una página

1. `[locale]/layout.js` es un **layout raíz** (no hay `app/layout.js` encima): define `<html lang>`, el script de tema en `<head>`, las fuentes y la metadata del idioma.
2. `[locale]/page.js` compone las secciones en orden. Cada sección es un **Server Component** que lee su namespace de mensajes (`getTranslations('experience')`).
3. Solo los Client Components mandan JavaScript propio al navegador: los dos selectores, el menú móvil, `Disclosure` y `RevealObserver`. Todo lo demás es HTML estático.

### i18n sin servidor

- **Rutas:** `generateStaticParams` genera `/es/` y `/en/`. `dynamicParams = false` hace que cualquier otro idioma sea un 404.
- **Locale:** se resuelve con `next/root-params` en `i18n/request.js`. Es el reemplazo actual de `setRequestLocale`, que quedó deprecado en next-intl 4, y deja las páginas estáticas sin pasar `locale` por props.
- **Raíz `/`:** como no hay servidor, no se puede leer `Accept-Language`. Un script inline y bloqueante en el `<head>` decide antes de pintar:
  1. preferencia guardada (`localStorage`, la escribe el selector);
  2. el primer idioma `es` o `en` que aparezca en `navigator.languages`;
  3. inglés.

  Conserva el `#hash`. Sin JS se ven links a ambos idiomas.

- **Cambio de idioma:** los ids de sección son neutros (`#experience`), así que el selector navega a `/en/#<sección que se está leyendo>`. Son links reales, de modo que funcionan sin JS y los crawlers los siguen.
- **SEO:** `canonical`, `hreflang` (es, en, x-default), `og:locale` y `og:locale:alternate` por idioma, y un sitemap con alternates.

### Temas

- Dos temas propios de daisyUI, `leaf` (claro) y `forest` (oscuro), declarados con `@plugin "daisyui/theme"`. Los temas incluidos están deshabilitados (`themes: false`).
- Todos los colores salen de variables del tema (`bg-base-100`, `text-primary`, `border-base-300`…), así que cambiar el tema cambia todo el sitio.
- **Sin parpadeo:** `lib/inline-scripts.js` genera un script que corre en `<head>` antes del primer pintado. Lee la preferencia, resuelve "sistema" con `matchMedia` y pone `data-theme` en `<html>`. Por eso `<html>` lleva `suppressHydrationWarning`: el atributo difiere a propósito entre el HTML del servidor y el DOM. El flag solo afecta a ese elemento.
- **"Sistema"** escucha cambios de `prefers-color-scheme` mientras la página está abierta.
- **Sin JS:** se aplica `leaf` por defecto, o `forest` si el sistema prefiere oscuro (`prefersdark`).
- El contraste AA se verifica con `npm run check:contrast` (pares texto/fondo, incluido el texto atenuado `/75`).

### Estilos: `@apply` vs `tailwind-variants`

- **`@apply` (en `globals.css`)** para estilos repetidos sin props: `.container-page`, `.section`, `.section-title`, `.section-lead`, `.tag`.
- **`tailwind-variants`** para componentes con props: `Button` (`intent`, `size`, `square`) y `Card` (slots `root/header/title/meta/body`, variantes `tone` e `interactive`).
- **Por qué `tailwind-variants` y no `cva`:** resuelve conflictos de clases con tailwind-merge sin configuración (un `className="px-8"` reemplaza el padding de la variante en vez de competir con él) y soporta _slots_, que `Card` necesita para estilar varias partes desde una sola definición.

### Animaciones

Todo vive en `src/animations/`:

- `effects/reveal.css`: revelado al hacer scroll. Se activa con `data-reveal="fade" | "fade-up" | "scale"` y un stagger opcional con `style={{ '--reveal-delay': '120ms' }}`.
- `RevealObserver.js`: un único `IntersectionObserver` para toda la página. Así las secciones siguen siendo Server Components y solo necesitan el atributo.
- `effects/disclosure.css`: el desplegable anima `grid-template-rows: 0fr → 1fr`, que llega a la altura real sin medirla en JS. Cuando está cerrado aplica `visibility: hidden`, así el contenido sale del orden de tabulación.
- `effects/menu.css`: la transición del menú de tema y del menú móvil.

Hay dos reglas que valen para todo efecto:

- Los estados ocultos solo aplican con `@media (scripting: enabled)`, para que sin JS nunca quede contenido invisible.
- Todo movimiento va dentro de `@media (prefers-reduced-motion: no-preference)`.

### Accesibilidad

- Un solo `h1` (el nombre en el Hero). Cada `<section>` está etiquetada por su `h2`, y hay landmarks `header`, `nav`, `main` y `footer`, más un skip link.
- **Selector de tema:** patrón _menu button_.
  - `<button>` con `aria-haspopup`, `aria-expanded` y `aria-controls`, y nombre accesible con el estado ("Tema: Sistema. Cambiar tema").
  - Opciones `menuitemradio` con `aria-checked`, y un anuncio `aria-live` al cambiar.
  - Teclado: ↑/↓/Home/End para moverse, Esc para cerrar devolviendo el foco, Tab para cerrar.
- **Desplegables** (`Disclosure`, menú móvil): `<button>` con `aria-expanded` y `aria-controls`, foco visible. El texto de "Ver detalle" incluye la empresa solo para lectores de pantalla.
- **Selector de idioma:** el código visible (ES/EN) forma parte del nombre accesible ("ES (Español)") y cada link lleva `lang` y `hreflang`.
- Los links externos avisan "(se abre en una pestaña nueva)" para lectores de pantalla.

## Cómo agregar contenido

Todo el texto está en `messages/es.json` y `messages/en.json`, y los componentes no tienen texto escrito a mano. Después de editar, `npm run check:messages` (también corre en el pre-commit) avisa si un idioma quedó desparejo.

### Agregar una experiencia

Agregá un objeto al array `experience.items`, **en los dos archivos y en la misma posición**:

```json
{
  "id": "empresa-x",
  "company": "Empresa X",
  "role": "Frontend Developer",
  "period": "ene 2026 – actualidad",
  "context": "Opcional: una línea de contexto",
  "url": "Opcional: https://… (para usar <link>…</link> en un texto)",
  "tech": ["React", "TailwindCSS"],
  "highlights": ["Logro visible 1", "Logro visible 2"],
  "details": [{ "title": "Opcional", "text": "Párrafo que aparece al expandir" }]
}
```

- Sin `details`, el trabajo se muestra sin desplegable.
- `id` tiene que ser único: es la `key` de React.

### Construir una sección (el patrón de Experiencia)

1. Definí el contenido en un namespace propio de los dos archivos de mensajes. Las listas van como arrays.
2. Creá `src/components/sections/MiSeccion.js` como Server Component:
   ```js
   const t = await getTranslations('miSeccion');
   const items = t.raw('items'); // solo para saber qué renderizar
   items.map((_, i) => t(`items.${i}.title`)); // cada texto pasa por t / t.rich
   ```
   `t.raw` se usa solo para la estructura. Los textos pasan por `t` o `t.rich` para que funcionen el formato ICU y los tags como `<link>`.
3. Envolvé el contenido en `<Section id={SECTIONS.miSeccion} title={t('title')}>`. Agregá el id en `lib/sections.js` y, si va en la navbar, en `NAV_SECTIONS` y en `nav.sections`.
4. Usá `.tag`, `.section-lead`, `Card`, `Button` y `data-reveal` antes de inventar estilos nuevos.
5. Si necesitás interactividad, aislala en un Client Component chico (como `Disclosure`).

### Usar traducciones en un Client Component

Agregá el namespace a `CLIENT_NAMESPACES` en `src/app/[locale]/layout.js`. Solo esos namespaces se serializan en la página: el resto del texto se renderiza en el servidor y no viaja dos veces.

### Agregar un efecto de animación

Creá `src/animations/effects/<nombre>.css` con el estado oculto (`[data-reveal='<nombre>']:not([data-revealed])`) dentro de las dos media queries de arriba, importalo en `animations.css` y usá `data-reveal="<nombre>"`.

### Agregar un idioma

1. Creá `messages/<código>.json` copiando la estructura de `es.json`.
2. Sumá el código a `locales` en `src/i18n/routing.js`.
3. Revisá en `lib/inline-scripts.js` la regla de detección del navegador, que hoy elige entre `es` y `en`.

### Link a la demo de Tecnoclima

Completá `featured.demo.url` en los dos archivos de mensajes. El botón aparece solo cuando hay URL.

## Decisiones técnicas principales

- **Exportación estática:** un portfolio no necesita servidor. GitHub Pages es gratis, rápido y no tiene nada que mantener. El costo es que no hay proxy ni headers, así que la detección de idioma y de tema se resuelve con scripts inline.
- **Dos layouts raíz** (`(root)` y `[locale]`): la raíz `/` no tiene idioma propio y `[locale]` necesita controlar `<html lang>`. Por eso hace falta `global-not-found.js` (flag `experimental.globalNotFound`) para generar el 404.
- **`next/root-params`:** forma actual de next-intl 4 para renderizado estático. `setRequestLocale` y `requestLocale` quedaron deprecados.
- **Imagen OG como route handler** (`[locale]/og.png/route.js`) y no con la convención `opengraph-image`: esa convención solo acepta un `alt` fijo, y su variante dinámica (`generateImageMetadata`) no recibe `[locale]` en una exportación estática. Así cada idioma tiene su imagen y su `alt` traducido.
- **Server Components por defecto:** la navbar, las secciones y las tarjetas son HTML estático, y el JS se limita a lo interactivo.
- **Contenido duplicado en el HTML:** Next serializa el árbol RSC además del HTML. Para no sumar una tercera copia, solo se pasan al cliente los mensajes que usa un Client Component (`CLIENT_NAMESPACES`).
- **ESLint 9 y no 10:** `eslint-config-next@16` trae plugins (`react`, `import`, `jsx-a11y`) que todavía no soportan ESLint 10.
- **Contenido del desplegable en el HTML:** los detalles se renderizan siempre y se ocultan con CSS. Así están disponibles para SEO y, sin JS, quedan visibles.
- **`.gitattributes` con `eol=lf`:** Prettier usa LF y Windows convierte a CRLF por defecto. Sin esto, cada commit en Windows reformatearía todo.

## Calidad

- **Pre-commit (husky + lint-staged):** ESLint y Prettier sobre los archivos staged, y la paridad de mensajes si cambia algún `messages/*.json`.
- **CI:** lint, formato, paridad de mensajes y contraste antes del build. Si algo falla, no se publica.
- **Lighthouse:** el objetivo es 95+ en Performance, Accessibility, Best Practices y SEO.

## Publicación

La URL final es `https://leomonay.github.io/`, un sitio de _usuario_ de GitHub Pages, por lo que no lleva `basePath`. Hoy esa URL se publica desde otro repo que ya se llama `leomonay.github.io`, así que el cambio se hace en este orden:

1. **Mergear** la rama `portfolio-v2` en `main` de este repo (`Leomonay/portfolio`).
2. **Renombrar el repo viejo:** en `Leomonay/leomonay.github.io` → _Settings → General → Repository name_ → `portfolio-legacy`. Desde ese momento, `https://leomonay.github.io/` deja de servirse hasta el paso 5.
3. **Renombrar este repo:** en `Leomonay/portfolio` → _Settings → General → Repository name_ → `leomonay.github.io`. GitHub redirige el nombre viejo, pero conviene actualizar el remoto local:
   ```bash
   git remote set-url origin git@github.com:Leomonay/leomonay.github.io.git
   ```
4. **Configurar Pages:** en el repo renombrado → _Settings → Pages → Build and deployment → Source_ → **GitHub Actions**.
5. **Publicar:** un push a `main` (o _Actions → Deploy to GitHub Pages → Run workflow_) corre `.github/workflows/deploy.yml`, que construye `out/` y lo publica.
6. **Verificar** que `/` redirija, que `/es/` y `/en/` carguen con estilos (si no cargan, revisar que exista `out/.nojekyll`) y que una URL inexistente muestre el 404 bilingüe.

Opcional: en `portfolio-legacy`, desactivar Pages o archivar el repo.

## Pendiente

Navbar y Experiencia están completas. Estas secciones ya tienen los datos conectados y les falta el diseño (buscar `TODO(` en `src/`):

- **Hero:** layout final y estilo diferenciado del stack secundario. Falta decidir si se usa `hero.role`, que hoy no se muestra.
- **Sobre mí**
- **Proyecto destacado (Tecnoclima):** diseño, si el detalle va en desplegable, capturas y la URL de la demo.
- **Trayectoria previa**
- **Formación**
- **Recomendaciones**
- **Contacto** y **footer**
