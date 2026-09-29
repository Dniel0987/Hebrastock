/* ============================================================
   HEBRASTOCK - ventas.js
   Permite armar una venta seleccionando productos y cantidades,
   calcula el total automáticamente y, al confirmar, registra la
   venta y descuenta el stock del inventario.
   ============================================================ */

let carrito = []; // { codigo, nombre, cantidad, precioUnitario, subtotal }

document.addEventListener("DOMContentLoaded", () => {
  renderNav("ventas.html");
  cargarSelectProductos();
  renderCarrito();

  document
    .getElementById("v-producto")
    .addEventListener("change", actualizarDisponible);
});

function formatoMoneda(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}

// Solo se pueden vender productos activos y con stock
function cargarSelectProductos() {
  const select = document.getElementById("v-producto");
  const productos = ProductosDB.listar().filter(
    (p) => p.estado === "Activo" && p.cantidad > 0
  );

  if (productos.length === 0) {
    select.innerHTML = `<option value="">No hay productos disponibles</option>`;
    return;
  }

  select.innerHTML = productos
    .map(
      (p) =>
        `<option value="${p.codigo}">${p.nombre} · ${p.talla} · ${p.color} (${p.codigo})</option>`
    )
    .join("");

  actualizarDisponible();
}

function actualizarDisponible() {
  const codigo = document.getElementById("v-producto").value;
  const producto = ProductosDB.obtener(codigo);
  document.getElementById("v-disponible").value = producto
    ? `${producto.cantidad} unidades`
    : "";
}

function agregarAlCarrito() {
  const codigo = document.getElementById("v-producto").value;
  const cantidad = Number(document.getElementById("v-cantidad").value);

  if (!codigo) {
    alert("No hay un producto seleccionado.");
    return;
  }
  if (!cantidad || cantidad <= 0) {
    alert("Ingresa una cantidad válida.");
    return;
  }

  const producto = ProductosDB.obtener(codigo);

  // Cantidad ya agregada previamente de este mismo producto
  const yaEnCarrito = carrito
    .filter((i) => i.codigo === codigo)
    .reduce((acc, i) => acc + i.cantidad, 0);

  if (cantidad + yaEnCarrito > producto.cantidad) {
    alert(
      `Solo hay ${producto.cantidad} unidades disponibles de "${producto.nombre}".`
    );
    return;
  }

  const existente = carrito.find((i) => i.codigo === codigo);
  if (existente) {
    existente.cantidad += cantidad;
    existente.subtotal = existente.cantidad * existente.precioUnitario;
  } else {
    carrito.push({
      codigo: producto.codigo,
      nombre: producto.nombre,
      cantidad,
      precioUnitario: producto.precio,
      subtotal: cantidad * producto.precio,
    });
  }

  document.getElementById("v-cantidad").value = 1;
  renderCarrito();
}

function quitarDelCarrito(codigo) {
  carrito = carrito.filter((i) => i.codigo !== codigo);
  renderCarrito();
}

function vaciarCarrito() {
  carrito = [];
  renderCarrito();
}

function renderCarrito() {
  const cont = document.getElementById("carrito-lista");

  if (carrito.length === 0) {
    cont.innerHTML = `<p class="hs-tabla-vacia">Todavía no has agregado productos.</p>`;
  } else {
    cont.innerHTML = carrito
      .map(
        (i) => `
        <div class="hs-carrito-fila">
          <span>${i.nombre}</span>
          <span>${i.cantidad} und.</span>
          <span>${formatoMoneda(i.subtotal)}</span>
          <button class="hs-btn hs-btn-peligro hs-btn-chico" onclick="quitarDelCarrito('${i.codigo}')">Quitar</button>
        </div>`
      )
      .join("");
  }

  const total = carrito.reduce((acc, i) => acc + i.subtotal, 0);
  document.getElementById("carrito-total").textContent = formatoMoneda(total);
}

function confirmarVenta() {
  if (carrito.length === 0) {
    alert("Agrega al menos un producto antes de confirmar la venta.");
    return;
  }

  const total = carrito.reduce((acc, i) => acc + i.subtotal, 0);

  const venta = {
    fecha: new Date().toISOString(),
    items: carrito,
    total,
  };

  VentasDB.crear(venta); // también descuenta el inventario automáticamente

  alert("¡Venta registrada con éxito!");
  carrito = [];
  renderCarrito();
  cargarSelectProductos(); // refresca disponibilidad
}
