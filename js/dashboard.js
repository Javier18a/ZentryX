/* =========================================================
   ZENTRYX - DASHBOARD
   dashboard.js
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const SESSION_KEY = "zentryx_sesion";
const USERS_KEY = "zentryx_usuarios";
const ACTIVITY_KEY = "zentryx_actividad";
const NOTIFICATIONS_KEY = "zentryx_notificaciones";


/* =========================================================
   ELEMENTOS
========================================================= */

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const menuButton = document.getElementById("menuButton");
const sidebarClose = document.getElementById("sidebarClose");

const logoutButton = document.getElementById("logoutButton");

const logoutModal = document.getElementById("logoutModal");
const logoutModalOverlay = document.getElementById("logoutModalOverlay");

const cancelLogout = document.getElementById("cancelLogout");
const confirmLogout = document.getElementById("confirmLogout");

const notificationButton =
    document.getElementById("notificationButton");

const notificationQuickButton =
    document.getElementById("notificationQuickButton");

const notificationPanel =
    document.getElementById("notificationPanel");

const closeNotifications =
    document.getElementById("closeNotifications");

const notificationDot =
    document.getElementById("notificationDot");

const notificationList =
    document.getElementById("notificationList");

const toast =
    document.getElementById("toast");

const toastIcon =
    document.getElementById("toastIcon");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");

const activityList =
    document.getElementById("activityList");


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    verificarSesion();

    cargarUsuario();

    cargarFecha();

    cargarActividad();

    cargarNotificaciones();

    inicializarMenu();

    inicializarLogout();

    inicializarNotificaciones();

});


/* =========================================================
   VERIFICAR SESIÓN
========================================================= */

function verificarSesion() {

    const sesion = obtenerSesion();

    if (!sesion) {

        window.location.href = "login.html";

        return false;
    }

    return true;
}


/* =========================================================
   OBTENER SESIÓN
========================================================= */

function obtenerSesion() {

    const sesionLocal =
        localStorage.getItem("zentryx_sesion");

    const sesionTemporal =
        sessionStorage.getItem("zentryx_sesion");


    /*
     * Primero buscamos una sesión permanente.
     * Si no existe, buscamos la sesión temporal.
     */

    const sesionGuardada =
        sesionLocal || sesionTemporal;


    if (!sesionGuardada) {

        return null;
    }


    try {

        const sesion =
            JSON.parse(sesionGuardada);


        if (!sesion) {

            return null;
        }


        return sesion;

    } catch (error) {

        console.error(
            "Error al obtener la sesión:",
            error
        );


        localStorage.removeItem(
            "zentryx_sesion"
        );

        sessionStorage.removeItem(
            "zentryx_sesion"
        );


        return null;
    }
}


/* =========================================================
   OBTENER USUARIO
========================================================= */

function obtenerUsuario() {

    const sesion = obtenerSesion();

    if (!sesion) {
        return null;
    }


    return {

        id: sesion.id,

        nombre: sesion.nombre,

        apellido: sesion.apellido,

        usuario: sesion.usuario,

        correo: sesion.correo,

        rol: sesion.rol || "usuario",

        estado: sesion.estado || "activo",

        inicioSesion:
            sesion.inicioSesion

    };
}


/* =========================================================
   CARGAR USUARIO
========================================================= */

function cargarUsuario() {

    const usuario =
        obtenerUsuario();


    if (!usuario) {

        console.warn(
            "No se encontró información del usuario."
        );

        return;
    }


    /* -----------------------------------------------------
       DATOS BÁSICOS
    ----------------------------------------------------- */

    const nombre =
        obtenerValor(
            usuario,
            [
                "nombre",
                "Nombre",
                "Nombre_Usuario",
                "nombreUsuario",
                "firstName"
            ]
        );


    const apellido =
        obtenerValor(
            usuario,
            [
                "apellido",
                "Apellido",
                "Apellido_Usuario",
                "apellidoUsuario",
                "lastName"
            ]
        );


    const nombreCompleto =
        `${nombre || ""} ${apellido || ""}`
            .trim();


    const nombreMostrar =
        nombreCompleto ||
        nombre ||
        "Usuario";


    const email =
        obtenerValor(
            usuario,
            [
                "email",
                "correo",
                "Correo",
                "Correo_Usuario",
                "correoUsuario"
            ]
        ) ||
        "Sin correo";


    const username =
        obtenerValor(
            usuario,
            [
                "username",
                "usuario",
                "Usuario",
                "Nombre_Usuario",
                "nombreUsuario"
            ]
        ) ||
        nombreMostrar;


    const rol =
        obtenerValor(
            usuario,
            [
                "rol",
                "Rol",
                "role",
                "tipo",
                "tipoUsuario",
                "Nivel_Acceso"
            ]
        ) ||
        "Usuario";


    const id =
        obtenerValor(
            usuario,
            [
                "id",
                "Usuario_Id",
                "usuarioId"
            ]
        ) ||
        "ZTX-USER";


    const fechaRegistro =
        obtenerValor(
            usuario,
            [
                "fechaRegistro",
                "Fecha_Registro",
                "fecha",
                "createdAt",
                "created_at"
            ]
        );


    const estado =
        obtenerValor(
            usuario,
            [
                "estado",
                "Estado",
                "status"
            ]
        ) ||
        "Activo";


    /* -----------------------------------------------------
       INSERTAR DATOS
    ----------------------------------------------------- */

    establecerTexto(
        "welcomeName",
        obtenerPrimerNombre(nombreMostrar)
    );


    establecerTexto(
        "sidebarUserName",
        nombreMostrar
    );


    establecerTexto(
        "sidebarUserRole",
        rol
    );


    establecerTexto(
        "topbarUserName",
        nombreMostrar
    );


    establecerTexto(
        "topbarUserEmail",
        email
    );


    establecerTexto(
        "accountFullName",
        nombreMostrar
    );


    establecerTexto(
        "accountUsername",
        username
    );


    establecerTexto(
        "accountEmail",
        email
    );


    establecerTexto(
        "accountId",
        id
    );


    establecerTexto(
        "accountRole",
        rol
    );


    establecerTexto(
        "accountStatus",
        capitalizar(estado)
    );


    establecerTexto(
        "memberSince",
        formatearFechaCorta(fechaRegistro)
    );


    /* -----------------------------------------------------
       AVATARES
    ----------------------------------------------------- */

    const inicial =
        obtenerInicial(nombreMostrar);


    establecerTexto(
        "profileAvatar",
        inicial
    );


    establecerTexto(
        "topbarAvatar",
        inicial
    );


    /*
     * Guardamos el usuario actualmente cargado
     * para que otros módulos puedan reutilizarlo.
     */

    window.zentryxUsuarioActual = usuario;
}


/* =========================================================
   OBTENER VALOR
========================================================= */

function obtenerValor(objeto, propiedades) {

    for (const propiedad of propiedades) {

        if (
            objeto &&
            objeto[propiedad] !== undefined &&
            objeto[propiedad] !== null &&
            String(objeto[propiedad]).trim() !== ""
        ) {

            return objeto[propiedad];
        }
    }

    return "";
}


/* =========================================================
   ESTABLECER TEXTO
========================================================= */

function establecerTexto(id, texto) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.textContent =
        texto ?? "";
}


/* =========================================================
   OBTENER PRIMER NOMBRE
========================================================= */

function obtenerPrimerNombre(nombre) {

    if (!nombre) {
        return "Usuario";
    }

    return String(nombre)
        .trim()
        .split(/\s+/)[0];
}


/* =========================================================
   OBTENER INICIAL
========================================================= */

function obtenerInicial(nombre) {

    if (!nombre) {
        return "U";
    }

    return String(nombre)
        .trim()
        .charAt(0)
        .toUpperCase();
}


/* =========================================================
   CAPITALIZAR
========================================================= */

function capitalizar(texto) {

    if (!texto) {
        return "";
    }

    const valor =
        String(texto).trim();

    return valor.charAt(0).toUpperCase() +
        valor.slice(1).toLowerCase();
}


/* =========================================================
   FECHA ACTUAL
========================================================= */

function cargarFecha() {

    const elemento =
        document.getElementById("currentDate");

    if (!elemento) {
        return;
    }


    const fecha =
        new Date();


    const opciones = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };


    let fechaTexto =
        fecha.toLocaleDateString(
            "es-NI",
            opciones
        );


    fechaTexto =
        fechaTexto.charAt(0).toUpperCase() +
        fechaTexto.slice(1);


    elemento.textContent =
        fechaTexto;
}


/* =========================================================
   FORMATEAR FECHA
========================================================= */

function formatearFechaCorta(fecha) {

    if (!fecha) {
        return "Reciente";
    }


    try {

        const fechaObjeto =
            new Date(fecha);


        if (Number.isNaN(
            fechaObjeto.getTime()
        )) {

            return String(fecha);
        }


        return fechaObjeto.toLocaleDateString(
            "es-NI",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    } catch (error) {

        return String(fecha);
    }
}


/* =========================================================
   ACTIVIDAD
========================================================= */

function cargarActividad() {

    if (!activityList) {
        return;
    }


    let actividades = [];


    try {

        const datos =
            localStorage.getItem(
                ACTIVITY_KEY
            );


        if (datos) {

            const parsed =
                JSON.parse(datos);


            if (Array.isArray(parsed)) {
                actividades = parsed;
            }
        }

    } catch (error) {

        console.error(
            "Error al cargar actividad:",
            error
        );
    }


    /*
     * Si todavía no existen actividades,
     * mostramos actividad inicial.
     */

    if (actividades.length === 0) {

        actividades = crearActividadInicial();
    }


    mostrarActividad(actividades);
}


/* =========================================================
   ACTIVIDAD INICIAL
========================================================= */

function crearActividadInicial() {

    const usuario =
        obtenerUsuario();


    const nombre =
        usuario
            ? obtenerValor(
                usuario,
                [
                    "nombre",
                    "Nombre",
                    "Nombre_Usuario"
                ]
            )
            : "Usuario";


    return [

        {
            tipo: "login",
            titulo: "Inicio de sesión",
            descripcion:
                `${nombre || "Usuario"} inició sesión en ZentryX.`,
            fecha: new Date().toISOString()
        },

        {
            tipo: "account",
            titulo: "Cuenta creada",
            descripcion:
                "Tu cuenta de ZentryX está disponible.",
            fecha: new Date().toISOString()
        }

    ];
}


/* =========================================================
   MOSTRAR ACTIVIDAD
========================================================= */

function mostrarActividad(actividades) {

    if (!activityList) {
        return;
    }


    activityList.innerHTML = "";


    const actividadesLimitadas =
        actividades.slice(0, 6);


    if (actividadesLimitadas.length === 0) {

        activityList.innerHTML = `

            <div class="empty-activity">

                <div class="empty-activity-icon">
                    ◷
                </div>

                <p>
                    Todavía no tienes actividad reciente.
                </p>

            </div>

        `;

        return;
    }


    actividadesLimitadas.forEach(
        actividad => {

            const item =
                document.createElement("div");


            item.className =
                "activity-item";


            const icon =
                obtenerIconoActividad(
                    actividad.tipo
                );


            const titulo =
                actividad.titulo ||
                "Actividad";


            const descripcion =
                actividad.descripcion ||
                "Actividad registrada en ZentryX.";


            const fecha =
                actividad.fecha ||
                actividad.createdAt;


            item.innerHTML = `

                <div class="activity-icon">
                    ${icon}
                </div>

                <div class="activity-content">

                    <strong>
                        ${escaparHTML(titulo)}
                    </strong>

                    <p>
                        ${escaparHTML(descripcion)}
                    </p>

                    <span class="activity-time">
                        ${escaparHTML(
                            obtenerTiempoRelativo(fecha)
                        )}
                    </span>

                </div>

            `;


            activityList.appendChild(item);
        }
    );
}


/* =========================================================
   ICONO ACTIVIDAD
========================================================= */

function obtenerIconoActividad(tipo) {

    switch (String(tipo || "").toLowerCase()) {

        case "login":
            return '<i class="fa-solid fa-right-to-bracket"></i>';

        case "logout":
            return '<i class="fa-solid fa-right-from-bracket"></i>';

        case "profile":
            return '<i class="fa-solid fa-user"></i>';

        case "security":
            return '<i class="fa-solid fa-shield-halved"></i>';

        case "register":
            return '<i class="fa-solid fa-user-plus"></i>';

        case "account":
            return '<i class="fa-solid fa-circle-check"></i>';

        default:
            return '<i class="fa-solid fa-circle"></i>';
    }
}


/* =========================================================
   TIEMPO RELATIVO
========================================================= */

function obtenerTiempoRelativo(fecha) {

    if (!fecha) {
        return "Recientemente";
    }


    const fechaObjeto =
        new Date(fecha);


    if (
        Number.isNaN(
            fechaObjeto.getTime()
        )
    ) {

        return "Recientemente";
    }


    const ahora =
        new Date();


    const diferencia =
        ahora.getTime() -
        fechaObjeto.getTime();


    const segundos =
        Math.floor(
            diferencia / 1000
        );


    if (segundos < 60) {
        return "Hace unos segundos";
    }


    const minutos =
        Math.floor(
            segundos / 60
        );


    if (minutos < 60) {

        return minutos === 1
            ? "Hace 1 minuto"
            : `Hace ${minutos} minutos`;
    }


    const horas =
        Math.floor(
            minutos / 60
        );


    if (horas < 24) {

        return horas === 1
            ? "Hace 1 hora"
            : `Hace ${horas} horas`;
    }


    const dias =
        Math.floor(
            horas / 24
        );


    if (dias < 7) {

        return dias === 1
            ? "Ayer"
            : `Hace ${dias} días`;
    }


    return formatearFechaCorta(fecha);
}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function cargarNotificaciones() {

    if (!notificationList) {
        return;
    }


    let notificaciones = [];


    try {

        const datos =
            localStorage.getItem(
                NOTIFICATIONS_KEY
            );


        if (datos) {

            const parsed =
                JSON.parse(datos);


            if (Array.isArray(parsed)) {

                notificaciones =
                    parsed;
            }
        }

    } catch (error) {

        console.error(
            "Error al cargar notificaciones:",
            error
        );
    }


    mostrarNotificaciones(
        notificaciones
    );
}


/* =========================================================
   MOSTRAR NOTIFICACIONES
========================================================= */

function mostrarNotificaciones(
    notificaciones
) {

    notificationList.innerHTML = "";


    if (
        !Array.isArray(notificaciones) ||
        notificaciones.length === 0
    ) {

        notificationList.innerHTML = `

            <div class="notification-empty">

                <div>
                    ♢
                </div>

                <p>
                    No tienes notificaciones nuevas.
                </p>

            </div>

        `;


        notificationDot.classList.remove(
            "active"
        );


        return;
    }


    const noLeidas =
        notificaciones.filter(
            notificacion =>
                !notificacion.leida
        );


    if (noLeidas.length > 0) {

        notificationDot.classList.add(
            "active"
        );

    } else {

        notificationDot.classList.remove(
            "active"
        );
    }


    notificaciones
        .slice(0, 10)
        .forEach(notificacion => {

            const item =
                document.createElement("div");


            item.className =
                "notification-item";


            item.innerHTML = `

                <div class="notification-item-icon">
                    ${obtenerIconoNotificacion(
                        notificacion.tipo
                    )}
                </div>

                <div class="notification-item-content">

                    <strong>
                        ${escaparHTML(
                            notificacion.titulo ||
                            "Notificación"
                        )}
                    </strong>

                    <p>
                        ${escaparHTML(
                            notificacion.mensaje ||
                            notificacion.descripcion ||
                            ""
                        )}
                    </p>

                    <div class="notification-item-time">
                        ${escaparHTML(
                            obtenerTiempoRelativo(
                                notificacion.fecha
                            )
                        )}
                    </div>

                </div>

            `;


            item.addEventListener(
                "click",
                () => {

                    notificacion.leida = true;

                    guardarNotificaciones(
                        notificaciones
                    );

                    mostrarNotificaciones(
                        notificaciones
                    );
                }
            );


            notificationList.appendChild(item);
        });
}


/* =========================================================
   ICONO NOTIFICACIÓN
========================================================= */

function obtenerIconoNotificacion(tipo) {

    switch (String(tipo || "").toLowerCase()) {

        case "security":
            return '<i class="fa-solid fa-shield-halved"></i>';

        case "success":
            return '<i class="fa-solid fa-circle-check"></i>';

        case "warning":
            return '<i class="fa-solid fa-triangle-exclamation"></i>';

        case "system":
            return '<i class="fa-solid fa-gear"></i>';

        default:
            return '<i class="fa-solid fa-bell"></i>';
    }
}


/* =========================================================
   GUARDAR NOTIFICACIONES
========================================================= */

function guardarNotificaciones(
    notificaciones
) {

    try {

        localStorage.setItem(
            NOTIFICATIONS_KEY,
            JSON.stringify(notificaciones)
        );

    } catch (error) {

        console.error(
            "No se pudieron guardar las notificaciones:",
            error
        );
    }
}


/* =========================================================
   MENÚ RESPONSIVE
========================================================= */

function inicializarMenu() {

    if (menuButton) {

        menuButton.addEventListener(
            "click",
            abrirSidebar
        );
    }


    if (sidebarClose) {

        sidebarClose.addEventListener(
            "click",
            cerrarSidebar
        );
    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            cerrarSidebar
        );
    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 760
                    ) {

                        cerrarSidebar();
                    }

                }
            );
        });
}


/* =========================================================
   ABRIR SIDEBAR
========================================================= */

function abrirSidebar() {

    sidebar.classList.add("open");

    sidebarOverlay.classList.add(
        "active"
    );
}


/* =========================================================
   CERRAR SIDEBAR
========================================================= */

function cerrarSidebar() {

    sidebar.classList.remove("open");

    sidebarOverlay.classList.remove(
        "active"
    );
}


/* =========================================================
   LOGOUT
========================================================= */

function inicializarLogout() {

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            abrirModalLogout
        );
    }


    if (cancelLogout) {

        cancelLogout.addEventListener(
            "click",
            cerrarModalLogout
        );
    }


    if (logoutModalOverlay) {

        logoutModalOverlay.addEventListener(
            "click",
            cerrarModalLogout
        );
    }


    if (confirmLogout) {

        confirmLogout.addEventListener(
            "click",
            cerrarSesion
        );
    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                cerrarModalLogout();

                cerrarNotificaciones();

                cerrarSidebar();
            }
        }
    );
}


/* =========================================================
   ABRIR MODAL LOGOUT
========================================================= */

function abrirModalLogout() {

    if (!logoutModal) {
        return;
    }

    logoutModal.classList.add(
        "active"
    );
}


/* =========================================================
   CERRAR MODAL LOGOUT
========================================================= */

function cerrarModalLogout() {

    if (!logoutModal) {
        return;
    }

    logoutModal.classList.remove(
        "active"
    );
}


/* =========================================================
   CERRAR SESIÓN
========================================================= */

function cerrarSesion() {

    const usuario =
        obtenerUsuario();


    /*
     * Registramos la actividad antes
     * de eliminar la sesión.
     */

    if (usuario) {

        registrarActividad({

            tipo: "logout",

            titulo:
                "Cierre de sesión",

            descripcion:
                "Se cerró correctamente la sesión de ZentryX.",

            fecha:
                new Date().toISOString()

        });
    }


    /*
     * Eliminamos únicamente la sesión.
     * NO eliminamos la cuenta registrada.
     */

    localStorage.removeItem(
        SESSION_KEY
    );


    cerrarModalLogout();


    mostrarToast(
        "Sesión cerrada",
        "Has cerrado sesión correctamente.",
        "success"
    );


    setTimeout(() => {

        window.location.href =
            "login.html";

    }, 900);
}


/* =========================================================
   REGISTRAR ACTIVIDAD
========================================================= */

function registrarActividad(
    actividad
) {

    let actividades = [];


    try {

        const datos =
            localStorage.getItem(
                ACTIVITY_KEY
            );


        if (datos) {

            const parsed =
                JSON.parse(datos);


            if (Array.isArray(parsed)) {

                actividades =
                    parsed;
            }
        }

    } catch (error) {

        console.error(error);
    }


    actividades.unshift(
        actividad
    );


    /*
     * Conservamos las últimas 30.
     */

    actividades =
        actividades.slice(0, 30);


    try {

        localStorage.setItem(
            ACTIVITY_KEY,
            JSON.stringify(actividades)
        );

    } catch (error) {

        console.error(
            "No se pudo guardar la actividad:",
            error
        );
    }
}


/* =========================================================
   NOTIFICACIONES UI
========================================================= */

function inicializarNotificaciones() {

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            toggleNotificaciones
        );
    }


    if (notificationQuickButton) {

        notificationQuickButton.addEventListener(
            "click",
            toggleNotificaciones
        );
    }


    if (closeNotifications) {

        closeNotifications.addEventListener(
            "click",
            cerrarNotificaciones
        );
    }


    document.addEventListener(
        "click",
        event => {

            if (
                !notificationPanel ||
                !notificationPanel.classList.contains(
                    "active"
                )
            ) {

                return;
            }


            const estaDentro =
                notificationPanel.contains(
                    event.target
                );


            const esBoton =
                notificationButton &&
                notificationButton.contains(
                    event.target
                );


            const esQuick =
                notificationQuickButton &&
                notificationQuickButton.contains(
                    event.target
                );


            if (
                !estaDentro &&
                !esBoton &&
                !esQuick
            ) {

                cerrarNotificaciones();
            }
        }
    );
}


/* =========================================================
   TOGGLE NOTIFICACIONES
========================================================= */

function toggleNotificaciones() {

    if (!notificationPanel) {
        return;
    }


    notificationPanel.classList.toggle(
        "active"
    );
}


/* =========================================================
   CERRAR NOTIFICACIONES
========================================================= */

function cerrarNotificaciones() {

    if (!notificationPanel) {
        return;
    }


    notificationPanel.classList.remove(
        "active"
    );
}


/* =========================================================
   TOAST
========================================================= */

function mostrarToast(
    titulo,
    mensaje,
    tipo = "success"
) {

    if (!toast) {
        return;
    }


    toastTitle.textContent =
        titulo;


    toastMessage.textContent =
        mensaje;


    if (tipo === "error") {

        toastIcon.textContent = "!";

        toastIcon.style.background =
            "rgba(231, 76, 60, 0.1)";

        toastIcon.style.color =
            "#e74c3c";

    } else {

        toastIcon.textContent = "✓";

        toastIcon.style.background =
            "rgba(32, 180, 134, 0.1)";

        toastIcon.style.color =
            "#20b486";
    }


    toast.classList.add(
        "active"
    );


    clearTimeout(
        window.zentryxToastTimeout
    );


    window.zentryxToastTimeout =
        setTimeout(() => {

            toast.classList.remove(
                "active"
            );

        }, 3500);
}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";
    }


    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   CAMBIO DE TAMAÑO
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 760
        ) {

            cerrarSidebar();
        }
    }
);


/* =========================================================
   EXPONER FUNCIONES
========================================================= */

window.ZentryXDashboard = {

    obtenerSesion,

    obtenerUsuario,

    registrarActividad,

    mostrarToast,

    cargarActividad,

    cargarNotificaciones

};