/* ============================================================
   HEBRASTOCK - usuarios.js
   Gestión de usuarios: listar, crear, editar, eliminar y
   asignar roles/permisos. Solo accesible para el rol
   "Administrador" (ver Auth.requerirRol).
   ============================================================ */

let sesionActual = null;

document.addEventListener("DOMContentLoaded", () => {
  renderNav("usuarios.html");
  sesionActual = Auth.requerirRol(["Administrador"]);
  renderTablaUsuarios();

  document
    .getElementById("form-usuario")
    .addEventListener("submit", guardarUsuario);
});

function renderTablaUsuarios() {
  const usuarios = UsuariosDB.listar();
  const tbody = document.getElementById("tabla-usuarios");

  if (usuarios.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="hs-tabla-vacia">No hay usuarios registrados.</td></tr>`;
    return;
  }

  tbody.innerHTML = usuarios
    .map((u) => {
      const etiquetaRol =
        u.rol === "Administrador"
          ? `<span class="hs-etiqueta hs-etiqueta-azul">${u.rol}</span>`
          : `<span class="hs-etiqueta">${u.rol}</span>`;
      const etiquetaEstado = u.activo
        ? `<span class="hs-etiqueta hs-etiqueta-verde">Activo</span>`
        : `<span class="hs-etiqueta hs-etiqueta-roja">Inactivo</span>`;

      return `
        <tr>
          <td>${u.nombre}</td>
          <td>${u.usuario}</td>
          <td>${etiquetaRol}</td>
          <td>${etiquetaEstado}</td>
          <td>
            <button class="hs-btn hs-btn-secundario hs-btn-chico" onclick="abrirModalUsuario('${u.id}')">Editar</button>
            <button class="hs-btn hs-btn-peligro hs-btn-chico" onclick="eliminarUsuario('${u.id}')">Eliminar</button>
          </td>
        </tr>`;
    })
    .join("");
}

function abrirModalUsuario(id) {
  const modal = document.getElementById("modal-usuario");
  const form = document.getElementById("form-usuario");
  form.reset();

  if (id) {
    const u = UsuariosDB.obtener(id);
    document.getElementById("modal-usuario-titulo").textContent =
      "Editar usuario";
    document.getElementById("u-id").value = u.id;
    document.getElementById("u-nombre").value = u.nombre;
    document.getElementById("u-usuario").value = u.usuario;
    document.getElementById("u-password").value = u.password;
    document.getElementById("u-rol").value = u.rol;
    document.getElementById("u-activo").value = String(u.activo);
  } else {
    document.getElementById("modal-usuario-titulo").textContent =
      "Nuevo usuario";
    document.getElementById("u-id").value = "";
  }

  modal.classList.remove("hs-oculto");
}

function cerrarModalUsuario() {
  document.getElementById("modal-usuario").classList.add("hs-oculto");
}

function guardarUsuario(e) {
  e.preventDefault();

  const id = document.getElementById("u-id").value;
  const usuario = document.getElementById("u-usuario").value.trim();

  // Evita usuarios duplicados
  const existente = UsuariosDB.buscarPorUsuario(usuario);
  if (existente && existente.id !== id) {
    alert("Ya existe otro usuario con ese nombre de usuario.");
    return;
  }

  const datos = {
    nombre: document.getElementById("u-nombre").value.trim(),
    usuario,
    password: document.getElementById("u-password").value,
    rol: document.getElementById("u-rol").value,
    activo: document.getElementById("u-activo").value === "true",
  };

  if (id) {
    UsuariosDB.actualizar(id, datos);
  } else {
    UsuariosDB.crear(datos);
  }

  cerrarModalUsuario();
  renderTablaUsuarios();
}

function eliminarUsuario(id) {
  if (id === sesionActual.id) {
    alert("No puedes eliminar el usuario con el que iniciaste sesión.");
    return;
  }
  if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
  UsuariosDB.eliminar(id);
  renderTablaUsuarios();
}
