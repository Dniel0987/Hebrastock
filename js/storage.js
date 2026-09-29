/* ============================================================
   HEBRASTOCK - storage.js
   Capa de datos del sistema.
   Todo el "backend" de HEBRASTOCK vive en el localStorage del
   navegador. No se necesita servidor, base de datos ni instalar
   nada: al abrir la página, este archivo crea la información
   inicial si todavía no existe.
   ============================================================ */

// Claves usadas dentro de localStorage
const LS_KEYS = {
  usuarios: "hebrastock_usuarios",
  productos: "hebrastock_productos",
  ventas: "hebrastock_ventas",
};

// Umbral para considerar que un producto tiene bajo stock
const STOCK_BAJO = 5;

/* ------------------------------------------------------------
   Utilidades genéricas
   ------------------------------------------------------------ */
function generarId(prefijo) {
  return `${prefijo}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function leer(clave) {
  const data = localStorage.getItem(clave);
  return data ? JSON.parse(data) : [];
}

function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

/* ------------------------------------------------------------
   Inicialización de datos de ejemplo (solo la primera vez)
   ------------------------------------------------------------ */
function inicializarDatos() {
  // Usuarios de ejemplo
  if (!localStorage.getItem(LS_KEYS.usuarios)) {
    const usuarios = [
      {
        id: generarId("USR"),
        nombre: "Administrador General",
        usuario: "admin",
        password: "admin123",
        rol: "Administrador",
        activo: true,
      },
      {
        id: generarId("USR"),
        nombre: "Vendedor Demo",
        usuario: "vendedor",
        password: "venta123",
        rol: "Vendedor",
        activo: true,
      },
    ];
    guardar(LS_KEYS.usuarios, usuarios);
  }

  // Productos de ejemplo
  if (!localStorage.getItem(LS_KEYS.productos)) {
    const productos = [
      {
        codigo: "CAM-001",
        nombre: "Camiseta básica algodón",
        categoria: "Camisetas",
        talla: "M",
        color: "Blanco",
        precio: 39900,
        cantidad: 20,
        descripcion: "Camiseta unisex de algodón 100%.",
        estado: "Activo",
      },
      {
        codigo: "CAM-002",
        nombre: "Camiseta estampada",
        categoria: "Camisetas",
        talla: "L",
        color: "Negro",
        precio: 45900,
        cantidad: 4,
        descripcion: "Camiseta con estampado frontal.",
        estado: "Activo",
      },
      {
        codigo: "PAN-001",
        nombre: "Pantalón jean recto",
        categoria: "Pantalones",
        talla: "32",
        color: "Azul",
        precio: 89900,
        cantidad: 12,
        descripcion: "Jean corte recto, tela stretch.",
        estado: "Activo",
      },
      {
        codigo: "CHQ-001",
        nombre: "Chaqueta impermeable",
        categoria: "Chaquetas",
        talla: "S",
        color: "Azul oscuro",
        precio: 159900,
        cantidad: 3,
        descripcion: "Chaqueta rompevientos con capucha.",
        estado: "Activo",
      },
      {
        codigo: "VES-001",
        nombre: "Vestido casual",
        categoria: "Vestidos",
        talla: "M",
        color: "Rojo",
        precio: 119900,
        cantidad: 8,
        descripcion: "Vestido casual manga corta.",
        estado: "Activo",
      },
    ];
    guardar(LS_KEYS.productos, productos);
  }

  // Ventas de ejemplo (vacío al inicio)
  if (!localStorage.getItem(LS_KEYS.ventas)) {
    guardar(LS_KEYS.ventas, []);
  }
}

/* ------------------------------------------------------------
   CRUD Usuarios
   ------------------------------------------------------------ */
const UsuariosDB = {
  listar: () => leer(LS_KEYS.usuarios),
  obtener: (id) => leer(LS_KEYS.usuarios).find((u) => u.id === id),
  buscarPorUsuario: (usuario) =>
    leer(LS_KEYS.usuarios).find(
      (u) => u.usuario.toLowerCase() === usuario.toLowerCase()
    ),
  crear: (usuario) => {
    const usuarios = leer(LS_KEYS.usuarios);
    usuario.id = generarId("USR");
    usuarios.push(usuario);
    guardar(LS_KEYS.usuarios, usuarios);
    return usuario;
  },
  actualizar: (id, cambios) => {
    const usuarios = leer(LS_KEYS.usuarios);
    const idx = usuarios.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    usuarios[idx] = { ...usuarios[idx], ...cambios };
    guardar(LS_KEYS.usuarios, usuarios);
    return usuarios[idx];
  },
  eliminar: (id) => {
    const usuarios = leer(LS_KEYS.usuarios).filter((u) => u.id !== id);
    guardar(LS_KEYS.usuarios, usuarios);
  },
};

/* ------------------------------------------------------------
   CRUD Productos (inventario)
   ------------------------------------------------------------ */
const ProductosDB = {
  listar: () => leer(LS_KEYS.productos),
  obtener: (codigo) =>
    leer(LS_KEYS.productos).find((p) => p.codigo === codigo),
  existeCodigo: (codigo) =>
    leer(LS_KEYS.productos).some((p) => p.codigo === codigo),
  crear: (producto) => {
    const productos = leer(LS_KEYS.productos);
    productos.push(producto);
    guardar(LS_KEYS.productos, productos);
    return producto;
  },
  actualizar: (codigo, cambios) => {
    const productos = leer(LS_KEYS.productos);
    const idx = productos.findIndex((p) => p.codigo === codigo);
    if (idx === -1) return null;
    productos[idx] = { ...productos[idx], ...cambios };
    guardar(LS_KEYS.productos, productos);
    return productos[idx];
  },
  eliminar: (codigo) => {
    const productos = leer(LS_KEYS.productos).filter(
      (p) => p.codigo !== codigo
    );
    guardar(LS_KEYS.productos, productos);
  },
  descontarStock: (codigo, cantidad) => {
    const productos = leer(LS_KEYS.productos);
    const idx = productos.findIndex((p) => p.codigo === codigo);
    if (idx === -1) return;
    productos[idx].cantidad = Math.max(
      0,
      productos[idx].cantidad - cantidad
    );
    guardar(LS_KEYS.productos, productos);
  },
  bajoStock: () =>
    leer(LS_KEYS.productos).filter((p) => p.cantidad <= STOCK_BAJO),
};

/* ------------------------------------------------------------
   CRUD Ventas
   ------------------------------------------------------------ */
const VentasDB = {
  listar: () => leer(LS_KEYS.ventas),
  crear: (venta) => {
    const ventas = leer(LS_KEYS.ventas);
    venta.id = generarId("VTA");
    ventas.unshift(venta); // las más recientes primero
    guardar(LS_KEYS.ventas, ventas);

    // Actualiza automáticamente el inventario
    venta.items.forEach((item) => {
      ProductosDB.descontarStock(item.codigo, item.cantidad);
    });

    return venta;
  },
};

// Se ejecuta apenas se carga este archivo en cualquier página
inicializarDatos();
