/* =========================================================
   ZENTRYX - NOTIFICACIONES
   notificaciones.js
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const SESSION_KEY = "zentryx_sesion";
const NOTIFICATIONS_KEY = "zentryx_notificaciones";


/* =========================================================
   ELEMENTOS
========================================================= */

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const menuButton =
    document.getElementById("menuButton");

const sidebarClose =
    document.getElementById("sidebarClose");

const logoutButton =
    document.getElementById("logoutButton");

const logoutModal =
    document.getElementById("logoutModal");

const logoutModalOverlay =
    document.getElementById("logoutModalOverlay");

const cancelLogout =
    document.getElementById("cancelLogout");

const confirmLogout =
    document.getElementById("confirmLogout");


/* =========================================================
   NOTIFICACIONES
========================================================= */

const notificationButton =
    document.getElementById("notificationButton");

const notificationPanel =
    document.getElementById("notificationPanel");

const closeNotifications =
    document.getElementById("closeNotifications");

const notificationDot =
    document.getElementById("notificationDot");

const notificationList =
    document.getElementById("notificationList");


/* =========================================================
   ELEMENTOS DE LA PÁGINA
========================================================= */

const messagesList =
    document.getElementById("messagesList");

const messagesEmpty =
    document.getElementById("messagesEmpty");

const unreadCount =
    document.getElementById("unreadCount");

const totalCount =
    document.getElementById("totalCount");

const readCount =
    document.getElementById("readCount");

const markAllButton =
    document.getElementById("markAllButton");

const refreshButton =
    document.getElementById("refreshButton");

const filterButtons =
    document.querySelectorAll(".filter-button");


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        verificarSesion();

        cargarUsuario();

        cargarFecha();

        cargarNotificaciones();

        inicializarMenu();

        inicializarLogout();

        inicializarNotificaciones();

        inicializarFiltros();

        inicializarAcciones();

    }
);


/* =========================================================
   VERIFICAR SESIÓN
========================================================= */

function verificarSesion() {

    const sesion =
        obtenerSesion();


    if (!sesion) {

        window.location.href =
            "login.html";

        return false;
    }


    return true;
}


/* =========================================================
   OBTENER SESIÓN
========================================================= */

function obtenerSesion() {

    const sesionLocal =
        localStorage.getItem(
            SESSION_KEY
        );


    const sesionTemporal =
        sessionStorage.getItem(
            SESSION_KEY
        );


    const sesionGuardada =
        sesionLocal ||
        sesionTemporal;


    if (!sesionGuardada) {

        return null;
    }


    try {

        const sesion =
            JSON.parse(
                sesionGuardada
            );


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
            SESSION_KEY
        );

        sessionStorage.removeItem(
            SESSION_KEY
        );


        return null;
    }
}


/* =========================================================
   OBTENER USUARIO
========================================================= */

function obtenerUsuario() {

    const sesion =
        obtenerSesion();


    if (!sesion) {

        return null;
    }


    return {

        id:
            sesion.id,

        nombre:
            sesion.nombre,

        apellido:
            sesion.apellido,

        usuario:
            sesion.usuario,

        correo:
            sesion.correo,

        rol:
            sesion.rol ||
            "usuario",

        estado:
            sesion.estado ||
            "activo",

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

        return;
    }


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


    /* -----------------------------------------------------
       SIDEBAR
    ----------------------------------------------------- */

    establecerTexto(
        "sidebarUserName",
        nombreMostrar
    );


    establecerTexto(
        "sidebarUserRole",
        rol
    );


    /* -----------------------------------------------------
       TOPBAR
    ----------------------------------------------------- */

    establecerTexto(
        "topbarUserName",
        nombreMostrar
    );


    establecerTexto(
        "topbarUserEmail",
        email
    );


    /* -----------------------------------------------------
       AVATARES
    ----------------------------------------------------- */

    const inicial =
        obtenerInicial(
            nombreMostrar
        );


    establecerTexto(
        "profileAvatar",
        inicial
    );


    establecerTexto(
        "topbarAvatar",
        inicial
    );


    window.zentryxUsuarioActual =
        usuario;
}


/* =========================================================
   OBTENER VALOR
========================================================= */

function obtenerValor(
    objeto,
    propiedades
) {

    for (
        const propiedad of propiedades
    ) {

        if (
            objeto &&
            objeto[propiedad] !== undefined &&
            objeto[propiedad] !== null &&
            String(
                objeto[propiedad]
            ).trim() !== ""
        ) {

            return objeto[propiedad];
        }
    }


    return "";
}


/* =========================================================
   ESTABLECER TEXTO
========================================================= */

function establecerTexto(
    id,
    texto
) {

    const elemento =
        document.getElementById(id);


    if (!elemento) {

        return;
    }


    elemento.textContent =
        texto ?? "";
}


/* =========================================================
   OBTENER INICIAL
========================================================= */

function obtenerInicial(
    nombre
) {

    if (!nombre) {

        return "U";
    }


    return String(nombre)
        .trim()
        .charAt(0)
        .toUpperCase();
}


/* =========================================================
   FECHA ACTUAL
========================================================= */

function cargarFecha() {

    const elemento =
        document.getElementById(
            "currentDate"
        );


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


    let texto =
        fecha.toLocaleDateString(
            "es-NI",
            opciones
        );


    texto =
        texto.charAt(0).toUpperCase() +
        texto.slice(1);


    elemento.textContent =
        texto;
}


/* =========================================================
   CARGAR NOTIFICACIONES
========================================================= */

function cargarNotificaciones() {

    let notificaciones = [];


    try {

        const datos =
            localStorage.getItem(
                NOTIFICATIONS_KEY
            );


        if (datos) {

            const parsed =
                JSON.parse(datos);


            if (
                Array.isArray(parsed)
            ) {

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

    if (!messagesList) {

        return;
    }


    messagesList.innerHTML = "";


    if (
        !Array.isArray(notificaciones) ||
        notificaciones.length === 0
    ) {

        mostrarEstadoVacio();

        actualizarContadores([]);

        return;
    }


    ocultarEstadoVacio();


    notificaciones.forEach(
        notificacion => {

            const tarjeta =
                crearNotificacion(
                    notificacion
                );


            messagesList.appendChild(
                tarjeta
            );
        }
    );


    actualizarContadores(
        notificaciones
    );


    actualizarIndicador(
        notificaciones
    );


    cargarNotificacionesRapidas(
        notificaciones
    );
}


/* =========================================================
   CREAR NOTIFICACIÓN
========================================================= */

function crearNotificacion(
    notificacion
) {

    const tarjeta =
        document.createElement(
            "article"
        );


    const leida =
        Boolean(
            notificacion.leida
        );


    tarjeta.className =
        `message-card ${
            leida
                ? "read"
                : "unread"
        }`;


    tarjeta.dataset.id =
        notificacion.id ||
        "";


    const tipo =
        String(
            notificacion.tipo ||
            "system"
        ).toLowerCase();


    const titulo =
        notificacion.titulo ||
        "Notificación";


    const mensaje =
        notificacion.mensaje ||
        notificacion.descripcion ||
        "Tienes una nueva notificación en ZentryX.";


    const categoria =
        obtenerCategoria(
            tipo
        );


    const fecha =
        notificacion.fecha ||
        notificacion.createdAt;


    tarjeta.innerHTML = `

        <div class="message-icon ${obtenerClaseIcono(tipo)}">
            ${obtenerIconoNotificacion(tipo)}
        </div>

        <div class="message-content">

            <div class="message-top">

                <div>

                    <span class="message-category">
                        ${escaparHTML(categoria)}
                    </span>

                    <h3>
                        ${escaparHTML(titulo)}
                    </h3>

                </div>

                <span class="message-time">
                    ${escaparHTML(
                        obtenerTiempoRelativo(fecha)
                    )}
                </span>

            </div>

            <p>
                ${escaparHTML(mensaje)}
            </p>

            <div class="message-footer">

                <span class="message-status ${
                    leida
                        ? "read"
                        : ""
                }">

                    <i class="fa-solid ${
                        leida
                            ? "fa-check-double"
                            : "fa-circle"
                    }"></i>

                    ${
                        leida
                            ? "Leída"
                            : "No leída"
                    }

                </span>

                <button
                    type="button"
                    class="message-action"
                    data-action="read"
                >
                    ${
                        leida
                            ? "Marcar no leída"
                            : "Marcar como leída"
                    }
                </button>

            </div>

        </div>

        <span class="message-indicator"></span>

    `;


    const boton =
        tarjeta.querySelector(
            ".message-action"
        );


    boton.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            notificacion.leida =
                !notificacion.leida;


            guardarNotificaciones(
                notificacionesActuales()
            );


            cargarNotificaciones();
        }
    );


    tarjeta.addEventListener(
        "click",
        () => {

            if (
                !notificacion.leida
            ) {

                notificacion.leida =
                    true;


                guardarNotificaciones(
                    notificacionesActuales()
                );


                cargarNotificaciones();
            }
        }
    );


    return tarjeta;
}


/* =========================================================
   OBTENER NOTIFICACIONES ACTUALES
========================================================= */

function notificacionesActuales() {

    try {

        const datos =
            localStorage.getItem(
                NOTIFICATIONS_KEY
            );


        if (!datos) {

            return [];
        }


        const parsed =
            JSON.parse(datos);


        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(error);

        return [];
    }
}


/* =========================================================
   CONTADORES
========================================================= */

function actualizarContadores(
    notificaciones
) {

    const total =
        notificaciones.length;


    const noLeidas =
        notificaciones.filter(
            notificacion =>
                !notificacion.leida
        ).length;


    const leidas =
        total -
        noLeidas;


    establecerTexto(
        "totalCount",
        total
    );


    establecerTexto(
        "unreadCount",
        noLeidas
    );


    establecerTexto(
        "readCount",
        leidas
    );


    document
        .querySelectorAll(
            "[data-count='all']"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    total;
            }
        );


    document
        .querySelectorAll(
            "[data-count='unread']"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    noLeidas;
            }
        );


    document
        .querySelectorAll(
            "[data-count='read']"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    leidas;
            }
        );
}


/* =========================================================
   INDICADOR
========================================================= */

function actualizarIndicador(
    notificaciones
) {

    const hayNoLeidas =
        notificaciones.some(
            notificacion =>
                !notificacion.leida
        );


    if (!notificationDot) {

        return;
    }


    notificationDot.classList.toggle(
        "active",
        hayNoLeidas
    );
}


/* =========================================================
   ESTADO VACÍO
========================================================= */

function mostrarEstadoVacio() {

    if (messagesEmpty) {

        messagesEmpty.hidden =
            false;
    }
}


function ocultarEstadoVacio() {

    if (messagesEmpty) {

        messagesEmpty.hidden =
            true;
    }
}


/* =========================================================
   FILTROS
========================================================= */

function inicializarFiltros() {

    filterButtons.forEach(
        boton => {

            boton.addEventListener(
                "click",
                () => {

                    filterButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );
                        }
                    );


                    boton.classList.add(
                        "active"
                    );


                    const filtro =
                        boton.dataset.filter ||
                        "all";


                    aplicarFiltro(
                        filtro
                    );
                }
            );
        }
    );
}


/* =========================================================
   APLICAR FILTRO
========================================================= */

function aplicarFiltro(
    filtro
) {

    const notificaciones =
        notificacionesActuales();


    let resultado =
        notificaciones;


    if (
        filtro === "unread"
    ) {

        resultado =
            notificaciones.filter(
                notificacion =>
                    !notificacion.leida
            );
    }


    if (
        filtro === "read"
    ) {

        resultado =
            notificaciones.filter(
                notificacion =>
                    Boolean(
                        notificacion.leida
                    )
            );
    }


    mostrarNotificaciones(
        resultado
    );
}


/* =========================================================
   ACCIONES
========================================================= */

function inicializarAcciones() {

    if (markAllButton) {

        markAllButton.addEventListener(
            "click",
            marcarTodasLeidas
        );
    }


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            () => {

                cargarNotificaciones();
            }
        );
    }
}


/* =========================================================
   MARCAR TODAS COMO LEÍDAS
========================================================= */

function marcarTodasLeidas() {

    const notificaciones =
        notificacionesActuales();


    if (
        notificaciones.length === 0
    ) {

        return;
    }


    notificaciones.forEach(
        notificacion => {

            notificacion.leida =
                true;
        }
    );


    guardarNotificaciones(
        notificaciones
    );


    cargarNotificaciones();


    mostrarToast(
        "Notificaciones actualizadas",
        "Todas las notificaciones fueron marcadas como leídas.",
        "success"
    );
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
            JSON.stringify(
                notificaciones
            )
        );

    } catch (error) {

        console.error(
            "No se pudieron guardar las notificaciones:",
            error
        );
    }
}


/* =========================================================
   ICONO
========================================================= */

function obtenerIconoNotificacion(
    tipo
) {

    switch (
        String(tipo || "")
            .toLowerCase()
    ) {

        case "request":
            return '<i class="fa-solid fa-file-circle-plus"></i>';

        case "security":
            return '<i class="fa-solid fa-shield-halved"></i>';

        case "success":
            return '<i class="fa-solid fa-circle-check"></i>';

        case "warning":
            return '<i class="fa-solid fa-triangle-exclamation"></i>';

        case "info":
            return '<i class="fa-solid fa-circle-info"></i>';

        case "system":
            return '<i class="fa-solid fa-gear"></i>';

        case "service":
            return '<i class="fa-solid fa-briefcase"></i>';

        case "payment":
            return '<i class="fa-solid fa-credit-card"></i>';

        default:
            return '<i class="fa-solid fa-bell"></i>';
    }
}


/* =========================================================
   CLASE DEL ICONO
========================================================= */

function obtenerClaseIcono(
    tipo
) {

    switch (
        String(tipo || "")
            .toLowerCase()
    ) {

        case "success":
            return "success";

        case "security":
            return "security";

        case "warning":
            return "warning";

        case "info":
            return "info";

        case "request":
            return "request";

        case "service":
            return "purple";

        default:
            return "purple";
    }
}


/* =========================================================
   CATEGORÍA
========================================================= */

function obtenerCategoria(
    tipo
) {

    switch (
        String(tipo || "")
            .toLowerCase()
    ) {

        case "request":
            return "SOLICITUD";

        case "security":
            return "SEGURIDAD";

        case "success":
            return "COMPLETADO";

        case "warning":
            return "ADVERTENCIA";

        case "info":
            return "INFORMACIÓN";

        case "service":
            return "SERVICIOS";

        case "payment":
            return "PAGOS";

        case "system":
            return "SISTEMA";

        default:
            return "NOTIFICACIÓN";
    }
}


/* =========================================================
   NOTIFICACIONES RÁPIDAS
========================================================= */

function cargarNotificacionesRapidas(
    notificaciones
) {

    if (!notificationList) {

        return;
    }


    notificationList.innerHTML = "";


    const recientes =
        notificaciones
            .slice(0, 5);


    if (
        recientes.length === 0
    ) {

        notificationList.innerHTML = `

            <div class="notification-empty">

                <div>
                    <i class="fa-regular fa-bell-slash"></i>
                </div>

                <p>
                    No tienes notificaciones nuevas.
                </p>

            </div>

        `;

        return;
    }


    recientes.forEach(
        notificacion => {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "quick-notification";


            if (
                !notificacion.leida
            ) {

                elemento.classList.add(
                    "unread"
                );
            }


            const tipo =
                String(
                    notificacion.tipo ||
                    "system"
                ).toLowerCase();


            elemento.innerHTML = `

                <div class="quick-notification-icon ${obtenerClaseIcono(tipo)}">

                    ${obtenerIconoNotificacion(tipo)}

                </div>

                <div>

                    <strong>
                        ${escaparHTML(
                            notificacion.titulo ||
                            "Notificación"
                        )}
                    </strong>

                    <span>
                        ${escaparHTML(
                            obtenerTiempoRelativo(
                                notificacion.fecha
                            )
                        )}
                    </span>

                </div>

            `;


            elemento.addEventListener(
                "click",
                () => {

                    notificacion.leida =
                        true;


                    guardarNotificaciones(
                        notificaciones
                    );


                    cargarNotificaciones();
                }
            );


            notificationList.appendChild(
                elemento
            );
        }
    );
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


            if (
                notificationPanel.contains(
                    event.target
                ) ||
                (
                    notificationButton &&
                    notificationButton.contains(
                        event.target
                    )
                )
            ) {

                return;
            }


            cerrarNotificaciones();
        }
    );
}


/* =========================================================
   TOGGLE
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
   CERRAR
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
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            item => {

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
            }
        );
}


/* =========================================================
   ABRIR SIDEBAR
========================================================= */

function abrirSidebar() {

    if (!sidebar) {

        return;
    }


    sidebar.classList.add(
        "open"
    );


    if (sidebarOverlay) {

        sidebarOverlay.classList.add(
            "active"
        );
    }
}


/* =========================================================
   CERRAR SIDEBAR
========================================================= */

function cerrarSidebar() {

    if (sidebar) {

        sidebar.classList.remove(
            "open"
        );
    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "active"
        );
    }
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
   MODAL LOGOUT
========================================================= */

function abrirModalLogout() {

    if (!logoutModal) {

        return;
    }


    logoutModal.classList.add(
        "active"
    );
}


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

    localStorage.removeItem(
        SESSION_KEY
    );


    sessionStorage.removeItem(
        SESSION_KEY
    );


    cerrarModalLogout();


    window.location.href =
        "login.html";
}


/* =========================================================
   TOAST
========================================================= */

function mostrarToast(
    titulo,
    mensaje,
    tipo = "success"
) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastIcon =
        document.getElementById(
            "toastIcon"
        );


    const toastTitle =
        document.getElementById(
            "toastTitle"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    if (!toast) {

        return;
    }


    if (toastTitle) {

        toastTitle.textContent =
            titulo;
    }


    if (toastMessage) {

        toastMessage.textContent =
            mensaje;
    }


    if (toastIcon) {

        if (
            tipo === "error"
        ) {

            toastIcon.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';

        } else {

            toastIcon.innerHTML =
                '<i class="fa-solid fa-check"></i>';
        }
    }


    toast.classList.add(
        "active"
    );


    clearTimeout(
        window.zentryxToastTimeout
    );


    window.zentryxToastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "active"
                );

            },
            3500
        );
}


/* =========================================================
   TIEMPO RELATIVO
========================================================= */

function obtenerTiempoRelativo(
    fecha
) {

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


    const diferencia =
        Date.now() -
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


    return formatearFecha(
        fecha
    );
}


/* =========================================================
   FORMATEAR FECHA
========================================================= */

function formatearFecha(
    fecha
) {

    try {

        const objeto =
            new Date(fecha);


        if (
            Number.isNaN(
                objeto.getTime()
            )
        ) {

            return "Recientemente";
        }


        return objeto.toLocaleDateString(
            "es-NI",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    } catch (error) {

        return "Recientemente";
    }
}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(
    valor
) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";
    }


    return String(valor)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
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
   EVENTOS DE STORAGE
========================================================= */

/*
 * Si otro apartado de ZentryX crea una
 * notificación mientras esta página está abierta,
 * actualizamos automáticamente la pantalla.
 */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            NOTIFICATIONS_KEY
        ) {

            cargarNotificaciones();
        }
    }
);


/* =========================================================
   EXPONER FUNCIONES
========================================================= */

window.ZentryXNotificaciones = {

    obtenerSesion,

    obtenerUsuario,

    cargarNotificaciones,

    guardarNotificaciones,

    marcarTodasLeidas,

    mostrarToast

};