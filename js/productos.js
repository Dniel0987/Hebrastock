/* ============================================================
   HEBRASTOCK - productos.js
   Gestión de inventario: listar, buscar, filtrar, crear, editar
   y eliminar productos. También genera la alerta visual de
   bajo stock en la tabla.
   ============================================================ */

const STOCK_BAJO_UI = 5;

document.addEventListener("DOMContentLoaded", () => {
  renderNav("productos.html");
  cargarOpcionesFiltro();
  renderTablaProductos();

  document
    .getElementById("filtro-texto")
    .addEventListener("input", renderTablaProductos);
  document
    .getElementById("filtro-categoria")
    .addEventListener("change", renderTablaProductos);
  document
    .getElementById("filtro-talla")
    .addEventListener("change", renderTablaProductos);
  document
    .getElementById("filtro-color")
    .addEventListener("change", renderTablaProductos);
  document
    .getElementById("filtro-estado")
    .addEventListener("change", renderTablaProductos);

  document
    .getElementById("form-producto")
    .addEventListener("submit", guardarProducto);
});

// Llena los <select> de filtros con los valores únicos existentes
function cargarOpcionesFiltro() {
  const productos = ProductosDB.listar();
  const categorias = [...new Set(productos.map((p) => p.categoria))];
  const tallas = [...new Set(productos.map((p) => p.talla))];
  const colores = [...new Set(productos.map((p) => p.color))];

  const selectCategoria = document.getElementById("filtro-categoria");
  categorias.forEach((c) => {
    selectCategoria.innerHTML += `<option value="${c}">${c}</option>`;
  });

  const selectTalla = document.getElementById("filtro-talla");
  tallas.forEach((t) => {
    selectTalla.innerHTML += `<option value="${t}">${t}</option>`;
  });

  const selectColor = document.getElementById("filtro-color");
  colores.forEach((c) => {
    selectColor.innerHTML += `<option value="${c}">${c}</option>`;
  });
}

// Aplica el texto de búsqueda y los filtros seleccionados
function obtenerProductosFiltrados() {
  const texto = document.getElementById("filtro-texto").value.toLowerCase();
  const categoria = document.getElementById("filtro-categoria").value;
  const talla = document.getElementById("filtro-talla").value;
  const color = document.getElementById("filtro-color").value;
  const estado = document.getElementById("filtro-estado").value;

  return ProductosDB.listar().filter((p) => {
    const coincideTexto =
      !texto ||
      p.nombre.toLowerCase().includes(texto) ||
      p.codigo.toLowerCase().includes(texto);
    const coincideCategoria = !categoria || p.categoria === categoria;
    const coincideTalla = !talla || p.talla === talla;
    const coincideColor = !color || p.color === color;
    const coincideEstado = !estado || p.estado === estado;
    return (
      coincideTexto &&
      coincideCategoria &&
      coincideTalla &&
      coincideColor &&
      coincideEstado
    );
  });
}

function renderTablaProductos() {
  const productos = obtenerProductosFiltrados();
  const tbody = document.getElementById("tabla-productos");

  if (productos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="hs-tabla-vacia">No se encontraron productos con esos criterios.</td></tr>`;
    return;
  }

  tbody.innerHTML = productos
    .map((p) => {
      const etiquetaStock =
        p.cantidad === 0
          ? `<span class="hs-etiqueta hs-etiqueta-roja">Agotado</span>`
          : p.cantidad <= STOCK_BAJO_UI
          ? `<span class="hs-etiqueta hs-etiqueta-ambar">${p.cantidad} und. · Bajo stock</span>`
          : `<span class="hs-etiqueta hs-etiqueta-verde">${p.cantidad} und.</span>`;

      const etiquetaEstado =
        p.estado === "Activo"
          ? `<span class="hs-etiqueta hs-etiqueta-azul">Activo</span>`
          : `<span class="hs-etiqueta">Inactivo</span>`;

      return `
        <tr>
          <td>${p.codigo}</td>
          <td>${p.nombre}</td>
          <td>${p.categoria}</td>
          <td>${p.talla}</td>
          <td>${p.color}</td>
          <td>$${Number(p.precio).toLocaleString("es-CO")}</td>
          <td>${etiquetaStock}</td>
          <td>${etiquetaEstado}</td>
          <td>
            <button class="hs-btn hs-btn-secundario hs-btn-chico" onclick="abrirModalProducto('${p.codigo}')">Editar</button>
            <button class="hs-btn hs-btn-peligro hs-btn-chico" onclick="eliminarProducto('${p.codigo}')">Eliminar</button>
          </td>
        </tr>`;
    })
    .join("");
}

/* ------------------------------------------------------------
   Modal de creación / edición
   ------------------------------------------------------------ */
function abrirModalProducto(codigo) {
  const modal = document.getElementById("modal-producto");
  const form = document.getElementById("form-producto");
  form.reset();

  if (codigo) {
    const p = ProductosDB.obtener(codigo);
    document.getElementById("modal-producto-titulo").textContent =
      "Editar producto";
    document.getElementById("p-codigo-original").value = p.codigo;
    document.getElementById("p-codigo").value = p.codigo;
    document.getElementById("p-codigo").disabled = true; // el código no se cambia al editar
    document.getElementById("p-nombre").value = p.nombre;
    document.getElementById("p-categoria").value = p.categoria;
    document.getElementById("p-talla").value = p.talla;
    document.getElementById("p-color").value = p.color;
    document.getElementById("p-precio").value = p.precio;
    document.getElementById("p-cantidad").value = p.cantidad;
    document.getElementById("p-estado").value = p.estado;
    document.getElementById("p-descripcion").value = p.descripcion || "";
  } else {
    document.getElementById("modal-producto-titulo").textContent =
      "Nuevo producto";
    document.getElementById("p-codigo-original").value = "";
    document.getElementById("p-codigo").disabled = false;
  }

  modal.classList.remove("hs-oculto");
}

function cerrarModalProducto() {
  document.getElementById("modal-producto").classList.add("hs-oculto");
}

function guardarProducto(e) {
  e.preventDefault();

  const codigoOriginal = document.getElementById("p-codigo-original").value;
  const codigo = document.getElementById("p-codigo").value.trim();

  const datos = {
    codigo,
    nombre: document.getElementById("p-nombre").value.trim(),
    categoria: document.getElementById("p-categoria").value.trim(),
    talla: document.getElementById("p-talla").value.trim(),
    color: document.getElementById("p-color").value.trim(),
    precio: Number(document.getElementById("p-precio").value),
    cantidad: Number(document.getElementById("p-cantidad").value),
    estado: document.getElementById("p-estado").value,
    descripcion: document.getElementById("p-descripcion").value.trim(),
  };

  if (codigoOriginal) {
    // Edición
    ProductosDB.actualizar(codigoOriginal, datos);
  } else {
    // Creación: valida que el código no exista
    if (ProductosDB.existeCodigo(codigo)) {
      alert("Ya existe un producto con ese código. Usa uno diferente.");
      return;
    }
    ProductosDB.crear(datos);
  }

  cerrarModalProducto();
  cargarOpcionesFiltro();
  renderTablaProductos();
}

function eliminarProducto(codigo) {
  if (!confirm("¿Seguro que deseas eliminar este producto del inventario?")) {
    return;
  }
  ProductosDB.eliminar(codigo);
  renderTablaProductos();
}
