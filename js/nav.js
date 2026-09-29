/* ============================================================
   HEBRASTOCK - nav.js
   Construye el menú lateral (sidebar) y la barra superior que
   se repiten en todas las páginas internas del sistema.
   Se inyectan dentro de <div id="hs-sidebar"></div> y
   <div id="hs-topbar"></div>, que deben existir en el HTML.
   ============================================================ */

const HS_MENU = [
  { href: "dashboard.html", icono: "grid", texto: "Panel principal" },
  { href: "productos.html", icono: "tag", texto: "Inventario" },
  { href: "ventas.html", icono: "cart", texto: "Registrar venta" },
  { href: "historial.html", icono: "clock", texto: "Historial de ventas" },
  {
    href: "usuarios.html",
    icono: "user",
    texto: "Usuarios",
    rolMinimo: "Administrador",
  },
];

const HS_ICONOS = {
  grid: '<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"/></svg>',
  tag: '<svg viewBox="0 0 24 24"><path d="M20.59 13.41 12 22l-9-9V4a1 1 0 0 1 1-1h9l7.59 7.59a2 2 0 0 1 0 2.82zM7 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>',
  cart: '<svg viewBox="0 0 24 24"><path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>',
  logout: '<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
};

function renderNav(paginaActual) {
  const sesion = Auth.requerirSesion();
  if (!sesion) return;

  const sidebar = document.getElementById("hs-sidebar");
  const topbar = document.getElementById("hs-topbar");
  if (!sidebar || !topbar) return;

  const opciones = HS_MENU.filter(
    (item) => !item.rolMinimo || item.rolMinimo === sesion.rol
  )
    .map((item) => {
      const activo = item.href === paginaActual ? "hs-link-activo" : "";
      return `
        <a class="hs-link ${activo}" href="${item.href}">
          <span class="hs-link-icono">${HS_ICONOS[item.icono]}</span>
          <span>${item.texto}</span>
        </a>`;
    })
    .join("");

  sidebar.innerHTML = `
    <div class="hs-logo">
      <span class="hs-logo-marca">
        <svg viewBox="0 0 40 40" class="hs-logo-hilo">
          <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M11 15c4 6 6-8 10-2s6 8 9 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="20" cy="20" r="2" fill="currentColor"/>
        </svg>
      </span>
      <div>
        <div class="hs-logo-texto">HEBRASTOCK</div>
        <div class="hs-logo-sub">Gestión de inventario</div>
      </div>
    </div>
    <nav class="hs-nav">${opciones}</nav>
    <div class="hs-sidebar-footer">
      <button class="hs-link hs-logout" onclick="Auth.logout()">
        <span class="hs-link-icono">${HS_ICONOS.logout}</span>
        <span>Cerrar sesión</span>
      </button>
    </div>
  `;

  topbar.innerHTML = `
    <div class="hs-topbar-titulo">${
      HS_MENU.find((m) => m.href === paginaActual)?.texto || ""
    }</div>
    <div class="hs-topbar-usuario">
      <div class="hs-avatar">${sesion.nombre.charAt(0).toUpperCase()}</div>
      <div>
        <div class="hs-usuario-nombre">${sesion.nombre}</div>
        <div class="hs-usuario-rol">${sesion.rol}</div>
      </div>
    </div>
  `;

  return sesion;
}
