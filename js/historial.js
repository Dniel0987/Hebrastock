/* ============================================================
   HEBRASTOCK - historial.js
   Muestra todas las ventas registradas y permite filtrarlas por
   un rango de fechas.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  renderNav("historial.html");
  renderHistorial();

  document
    .getElementById("filtro-desde")
    .addEventListener("change", renderHistorial);
  document
    .getElementById("filtro-hasta")
    .addEventListener("change", renderHistorial);
});

function formatoMoneda(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}

function formatoFechaHora(fechaISO) {
  const f = new Date(fechaISO);
  return f.toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function limpiarFiltrosHistorial() {
  document.getElementById("filtro-desde").value = "";
  document.getElementById("filtro-hasta").value = "";
  renderHistorial();
}

function renderHistorial() {
  const desde = document.getElementById("filtro-desde").value;
  const hasta = document.getElementById("filtro-hasta").value;

  let ventas = VentasDB.listar();

  if (desde) {
    ventas = ventas.filter((v) => v.fecha.slice(0, 10) >= desde);
  }
  if (hasta) {
    ventas = ventas.filter((v) => v.fecha.slice(0, 10) <= hasta);
  }

  const tbody = document.getElementById("tabla-historial");

  if (ventas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="hs-tabla-vacia">No hay ventas registradas en este periodo.</td></tr>`;
  } else {
    tbody.innerHTML = ventas
      .map(
        (v) => `
        <tr>
          <td>${formatoFechaHora(v.fecha)}</td>
          <td>${v.items
            .map((i) => `${i.nombre} (x${i.cantidad})`)
            .join(", ")}</td>
          <td>${formatoMoneda(v.total)}</td>
        </tr>`
      )
      .join("");
  }

  const total = ventas.reduce((acc, v) => acc + v.total, 0);
  document.getElementById("historial-total").textContent = formatoMoneda(total);
}
