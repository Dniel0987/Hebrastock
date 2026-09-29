/* ============================================================
   HEBRASTOCK - dashboard.js
   Calcula los indicadores del panel principal a partir de los
   datos guardados en localStorage (productos y ventas).
   ============================================================ */

function formatoMoneda(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}

function formatoFecha(fechaISO) {
  const f = new Date(fechaISO);
  return f.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNav("dashboard.html");

  const productos = ProductosDB.listar();
  const ventas = VentasDB.listar();
  const bajoStock = ProductosDB.bajoStock();

  // KPIs
  document.getElementById("kpi-productos").textContent = productos.length;
  document.getElementById("kpi-bajo-stock").textContent = bajoStock.length;
  document.getElementById("kpi-ventas").textContent = ventas.length;

  const totalVentas = ventas.reduce((acc, v) => acc + v.total, 0);
  document.getElementById("kpi-total-ventas").textContent =
    formatoMoneda(totalVentas);

  // Últimas 5 ventas
  const tablaVentas = document.getElementById("tabla-ventas-recientes");
  if (ventas.length === 0) {
    tablaVentas.innerHTML = `<tr><td colspan="3" class="hs-tabla-vacia">Todavía no se han registrado ventas.</td></tr>`;
  } else {
    tablaVentas.innerHTML = ventas
      .slice(0, 5)
      .map(
        (v) => `
        <tr>
          <td>${formatoFecha(v.fecha)}</td>
          <td>${v.items.map((i) => i.nombre).join(", ")}</td>
          <td>${formatoMoneda(v.total)}</td>
        </tr>`
      )
      .join("");
  }

  // Productos con bajo stock
  const tablaBajoStock = document.getElementById("tabla-bajo-stock");
  if (bajoStock.length === 0) {
    tablaBajoStock.innerHTML = `<tr><td colspan="2" class="hs-tabla-vacia">Todos los productos tienen stock suficiente.</td></tr>`;
  } else {
    tablaBajoStock.innerHTML = bajoStock
      .map(
        (p) => `
        <tr>
          <td>${p.nombre} <span class="hs-etiqueta hs-etiqueta-azul">${p.talla} · ${p.color}</span></td>
          <td><span class="hs-etiqueta ${
            p.cantidad === 0 ? "hs-etiqueta-roja" : "hs-etiqueta-ambar"
          }">${p.cantidad} und.</span></td>
        </tr>`
      )
      .join("");
  }
});
