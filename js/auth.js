/* ============================================================
   HEBRASTOCK - auth.js
   Manejo de inicio de sesión y control de acceso.
   La sesión se guarda en sessionStorage: dura mientras la
   pestaña del navegador está abierta.
   ============================================================ */

const SESSION_KEY = "hebrastock_session";

const Auth = {
  // Intenta iniciar sesión. Devuelve el usuario si es correcto, o null.
  login(usuario, password) {
    const encontrado = UsuariosDB.buscarPorUsuario(usuario);
    if (!encontrado) return null;
    if (!encontrado.activo) return null;
    if (encontrado.password !== password) return null;

    const sesion = {
      id: encontrado.id,
      nombre: encontrado.nombre,
      usuario: encontrado.usuario,
      rol: encontrado.rol,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
    return sesion;
  },

  // Cierra la sesión actual y vuelve al login
  logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  },

  // Devuelve la sesión activa o null
  getSesion() {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Debe llamarse al inicio de cada página protegida.
  // Si no hay sesión activa, redirige al login.
  requerirSesion() {
    const sesion = this.getSesion();
    if (!sesion) {
      window.location.href = "index.html";
    }
    return sesion;
  },

  // Solo permite el acceso a ciertos roles. Si el rol actual no
  // está permitido, regresa al dashboard.
  requerirRol(rolesPermitidos) {
    const sesion = this.requerirSesion();
    if (sesion && !rolesPermitidos.includes(sesion.rol)) {
      alert("No tienes permisos para acceder a este módulo.");
      window.location.href = "dashboard.html";
    }
    return sesion;
  },
};
