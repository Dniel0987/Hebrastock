# HEBRASTOCK

Sistema de gestión de inventario para tiendas de ropa. Incluye gestión de
usuarios, productos, ventas e inventario, con un panel principal (dashboard)
de indicadores.

Construido con **HTML, CSS y JavaScript puro (sin frameworks)**. No requiere
Node.js, npm, ni ninguna instalación. Los datos se guardan en el
`localStorage` del navegador, así que funciona por completo de forma local.

---

## 1. Estructura del proyecto

```
HEBRASTOCK/
├── index.html          → Página de inicio de sesión (login)
├── dashboard.html       → Panel principal con indicadores
├── productos.html        → Gestión de inventario (CRUD de productos)
├── ventas.html            → Registro de ventas
├── historial.html          → Historial de ventas
├── usuarios.html            → Gestión de usuarios y roles
├── css/
│   └── styles.css            → Estilos de toda la aplicación (tema azul/blanco)
├── js/
│   ├── storage.js              → "Base de datos": guarda todo en localStorage
│   ├── auth.js                   → Inicio de sesión y control de acceso
│   ├── nav.js                      → Menú lateral y barra superior compartidos
│   ├── dashboard.js                  → Lógica del panel principal
│   ├── productos.js                    → Lógica de inventario
│   ├── ventas.js                         → Lógica de registro de ventas
│   ├── historial.js                        → Lógica del historial de ventas
│   └── usuarios.js                           → Lógica de gestión de usuarios
└── README.md
```

Cada página HTML es una "pantalla" del sistema, y cada archivo `.js` del
mismo nombre contiene la lógica de esa pantalla. `storage.js`, `auth.js` y
`nav.js` se comparten en todas las páginas internas.

---

## 2. ¿Cómo funciona sin instalar nada?

- **No hay servidor ni base de datos externa.** Toda la información
  (usuarios, productos, ventas) se guarda en el `localStorage` del
  navegador mediante el archivo `js/storage.js`.
- **No hay dependencias que instalar.** No existe `package.json` ni se usa
  `npm install`. Todo el código es HTML, CSS y JavaScript que el navegador
  entiende directamente.
- La primera vez que abras la página, `storage.js` crea automáticamente
  usuarios y productos de ejemplo para que puedas probar el sistema de
  inmediato.

> ⚠️ Ten en cuenta que, al ser datos guardados en el navegador, si limpias
> la caché/almacenamiento del navegador o cambias de navegador, los datos
> de ejemplo se vuelven a generar y los cambios que hayas hecho se pierden.
> Esto es normal en un proyecto sin base de datos externa.

---

## 3. Cómo ejecutar el proyecto en Visual Studio Code

Tienes dos formas de hacerlo, **ninguna requiere instalar librerías**:

### Opción A (la más simple): abrir el archivo directamente
1. Abre la carpeta `HEBRASTOCK` en Visual Studio Code (`Archivo > Abrir carpeta`).
2. En el explorador de archivos de VS Code, haz clic derecho sobre
   `index.html`.
3. Selecciona **"Revelar en el explorador de archivos"** (o ábrelo desde tu
   explorador de Windows/Finder) y haz **doble clic** sobre `index.html`.
4. Se abrirá en tu navegador predeterminado y el sistema ya estará
   funcionando.

### Opción B: usar la extensión "Live Server" (opcional, recomendada)
Esta opción no es obligatoria, pero permite que la página se recargue sola
cada vez que edites el código:
1. En VS Code, ve a la pestaña de Extensiones e instala **"Live Server"**
   (de Ritwick Dey). Es una extensión oficial del propio VS Code, no una
   librería de programación ni una dependencia del proyecto.
2. Haz clic derecho sobre `index.html` y elige **"Open with Live Server"**.
3. Se abrirá automáticamente en tu navegador en una dirección como
   `http://127.0.0.1:5500`.

Con cualquiera de las dos opciones el sistema queda funcionando igual; la
Opción A es la más directa si no quieres instalar ni siquiera una extensión.

---

## 4. Usuarios de prueba

| Usuario    | Contraseña | Rol            |
|------------|------------|----------------|
| `admin`    | `admin123` | Administrador  |
| `vendedor` | `venta123` | Vendedor       |

El rol **Administrador** tiene acceso a todos los módulos, incluyendo
**Usuarios**. El rol **Vendedor** no ve el módulo de Usuarios en el menú
(y si intenta entrar por la URL directamente, el sistema lo redirige).

---

## 5. Módulos incluidos

- **Inicio de sesión** (`index.html`): valida usuario/contraseña contra los
  usuarios guardados y crea una sesión en `sessionStorage`.
- **Panel principal** (`dashboard.html`): productos registrados, productos
  con bajo stock, número de ventas, total vendido, ventas recientes y
  alertas de bajo stock.
- **Inventario** (`productos.html`): crear, editar, eliminar, buscar por
  nombre/código y filtrar por categoría, talla, color y estado. Cada
  producto muestra su cantidad disponible con una etiqueta de color
  (verde = stock normal, ámbar = bajo stock, rojo = agotado).
- **Ventas** (`ventas.html`): arma una venta agregando productos con
  cantidad, calcula el total automáticamente y, al confirmar, registra la
  fecha, descuenta el inventario y guarda la venta.
- **Historial de ventas** (`historial.html`): lista todas las ventas y
  permite filtrar por rango de fechas.
- **Usuarios** (`usuarios.html`): crear, editar, eliminar usuarios y
  asignar el rol (Administrador / Vendedor). Solo visible para
  Administradores.

---

## 6. Cómo modificar el proyecto

- **Cambiar colores**: todo el tema de color está centralizado en las
  variables `:root` al inicio de `css/styles.css` (por ejemplo `--azul-700`).
- **Cambiar el umbral de bajo stock**: la constante `STOCK_BAJO` en
  `js/storage.js` (y `STOCK_BAJO_UI` en `js/productos.js`).
- **Agregar un nuevo módulo**: crea `nuevo.html` + `js/nuevo.js`, agrégalo
  al arreglo `HS_MENU` en `js/nav.js`, e incluye los scripts
  `storage.js`, `auth.js`, `nav.js` antes del tuyo, igual que en las demás
  páginas.

---

## 7. Notas técnicas

- El código está comentado en español dentro de cada archivo `.js` para
  facilitar su comprensión y modificación.
- No se usa ningún framework (React, Vue, Angular, etc.), ni Bootstrap, ni
  jQuery: todo el diseño y la interactividad están hechos con CSS y
  JavaScript nativos del navegador.
- Los precios se muestran formateados con separador de miles en formato
  colombiano (`es-CO`); puedes cambiarlo en las funciones `formatoMoneda`
  de cada archivo `.js` si lo necesitas en otro formato.
