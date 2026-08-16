/* =========================================================
   ZENTRYX - CATEGORÍAS
   categorias.js
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const SESSION_KEY = "zentryx_sesion";
const CATEGORIES_KEY = "zentryx_categorias";
const ACTIVITY_KEY = "zentryx_actividad";
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

const toast =
    document.getElementById("toast");

const toastIcon =
    document.getElementById("toastIcon");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");

const categoryGrid =
    document.getElementById("categoryGrid");

const categorySearch =
    document.getElementById("categorySearch");

const categoryCount =
    document.getElementById("categoryCount");


/* =========================================================
   CATEGORÍAS PREDETERMINADAS
========================================================= */

const categoriasPredeterminadas = [

    {
        id: "tecnologia",
        nombre: "Tecnología",
        descripcion:
            "Desarrollo, programación, soporte técnico y soluciones digitales.",
        icono: "fa-solid fa-laptop-code",
        color: "purple"
    },

    {
        id: "diseno",
        nombre: "Diseño y creatividad",
        descripcion:
            "Diseño gráfico, logos, ilustraciones y contenido visual.",
        icono: "fa-solid fa-palette",
        color: "pink"
    },

    {
        id: "marketing",
        nombre: "Marketing y redes",
        descripcion:
            "Publicidad, redes sociales, branding y estrategias digitales.",
        icono: "fa-solid fa-bullhorn",
        color: "orange"
    },

    {
        id: "redaccion",
        nombre: "Redacción y traducción",
        descripcion:
            "Redacción de contenido, corrección, edición y traducciones.",
        icono: "fa-solid fa-pen-nib",
        color: "blue"
    },

    {
        id: "negocios",
        nombre: "Negocios y consultoría",
        descripcion:
            "Asesorías, administración, finanzas y soluciones empresariales.",
        icono: "fa-solid fa-briefcase",
        color: "green"
    },

    {
        id: "reparaciones",
        nombre: "Reparaciones",
        descripcion:
            "Mantenimiento y reparación de equipos, hogares y otros servicios.",
        icono: "fa-solid fa-screwdriver-wrench",
        color: "red"
    },

    {
        id: "educacion",
        nombre: "Educación y tutorías",
        descripcion:
            "Clases particulares, tutorías, cursos y apoyo académico.",
        icono: "fa-solid fa-graduation-cap",
        color: "cyan"
    },

    {
        id: "fotografia",
        nombre: "Fotografía y video",
        descripcion:
            "Fotografía, edición de video, producción audiovisual y eventos.",
        icono: "fa-solid fa-camera",
        color: "purple"
    },

    {
        id: "hogar",
        nombre: "Hogar y mantenimiento",
        descripcion:
            "Limpieza, jardinería, mantenimiento y servicios para el hogar.",
        icono: "fa-solid fa-house",
        color: "green"
    },

    {
        id: "transporte",
        nombre: "Transporte y logística",
        descripcion:
            "Entregas, transporte, mensajería y soluciones logísticas.",
        icono: "fa-solid fa-truck",
        color: "orange"
    },

    {
        id: "profesionales",
        nombre: "Servicios profesionales",
        descripcion:
            "Servicios especializados para personas, emprendedores y empresas.",
        icono: "fa-solid fa-user-tie",
        color: "blue"
    },

    {
        id: "otros",
        nombre: "Otros servicios",
        descripcion:
            "Encuentra servicios que no pertenecen a una categoría específica.",
        icono: "fa-solid fa-layer-group",
        color: "pink"
    }

];


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!verificarSesion()) {
            return;
        }

        cargarUsuario();

        cargarCategorias();

        inicializarBusqueda();

        inicializarMenu();

        inicializarLogout();

        inicializarNotificaciones();

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

        return JSON.parse(
            sesionGuardada
        );

    } catch (error) {

        console.error(
            "Error al obtener sesión:",
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

        id: sesion.id,

        nombre: sesion.nombre,

        apellido: sesion.apellido,

        usuario: sesion.usuario,

        correo: sesion.correo,

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
        "welcomeName",
        obtenerPrimerNombre(
            nombreMostrar
        )
    );

    establecerTexto(
        "profileAvatar",
        obtenerInicial(
            nombreMostrar
        )
    );

    establecerTexto(
        "topbarAvatar",
        obtenerInicial(
            nombreMostrar
        )
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
   PRIMER NOMBRE
========================================================= */

function obtenerPrimerNombre(
    nombre
) {

    if (!nombre) {
        return "Usuario";
    }

    return String(nombre)
        .trim()
        .split(/\s+/)[0];
}


/* =========================================================
   INICIAL
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
   CARGAR CATEGORÍAS
========================================================= */

function cargarCategorias() {

    let categorias =
        obtenerCategorias();

    if (
        !Array.isArray(categorias) ||
        categorias.length === 0
    ) {

        categorias =
            categoriasPredeterminadas;

        guardarCategorias(
            categorias
        );
    }

    mostrarCategorias(
        categorias
    );
}


/* =========================================================
   OBTENER CATEGORÍAS
========================================================= */

function obtenerCategorias() {

    try {

        const datos =
            localStorage.getItem(
                CATEGORIES_KEY
            );

        if (!datos) {
            return [];
        }

        const categorias =
            JSON.parse(datos);

        if (
            Array.isArray(categorias)
        ) {

            return categorias;
        }

    } catch (error) {

        console.error(
            "Error al cargar categorías:",
            error
        );
    }

    return [];
}


/* =========================================================
   GUARDAR CATEGORÍAS
========================================================= */

function guardarCategorias(
    categorias
) {

    try {

        localStorage.setItem(
            CATEGORIES_KEY,
            JSON.stringify(
                categorias
            )
        );

    } catch (error) {

        console.error(
            "Error al guardar categorías:",
            error
        );
    }
}


/* =========================================================
   MOSTRAR CATEGORÍAS
========================================================= */

function mostrarCategorias(
    categorias
) {

    if (!categoryGrid) {
        return;
    }

    categoryGrid.innerHTML = "";

    if (
        !Array.isArray(categorias) ||
        categorias.length === 0
    ) {

        mostrarEstadoVacio();

        actualizarContador(0);

        return;
    }

    actualizarContador(
        categorias.length
    );

    categorias.forEach(
        categoria => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "category-card";

            const nombre =
                categoria.nombre ||
                "Categoría";

            const descripcion =
                categoria.descripcion ||
                "Servicios disponibles en esta categoría.";

            const icono =
                categoria.icono ||
                "fa-solid fa-layer-group";

            const color =
                categoria.color ||
                "purple";

            const cantidad =
                obtenerCantidadServicios(
                    categoria.id
                );

            card.innerHTML = `

                <div class="category-card-top">

                    <div class="
                        category-icon
                        ${escaparHTML(color)}
                    ">
                        <i class="${escaparHTML(icono)}"></i>
                    </div>

                    <span class="category-arrow">
                        <i class="fa-solid fa-arrow-right"></i>
                    </span>

                </div>

                <div class="category-content">

                    <h3>
                        ${escaparHTML(nombre)}
                    </h3>

                    <p>
                        ${escaparHTML(
                            descripcion
                        )}
                    </p>

                </div>

                <div class="category-footer">

                    <span>
                        <i class="fa-solid fa-briefcase"></i>

                        ${cantidad}
                        ${cantidad === 1
                            ? " servicio"
                            : " servicios"}
                    </span>

                    <button
                        type="button"
                        class="category-button"
                        data-category="${escaparHTML(
                            categoria.id
                        )}"
                    >
                        Explorar
                    </button>

                </div>

            `;

            categoryGrid.appendChild(
                card
            );
        }
    );

    inicializarBotonesCategorias();
}


/* =========================================================
   CANTIDAD DE SERVICIOS
========================================================= */

function obtenerCantidadServicios(
    categoriaId
) {

    const posiblesClaves = [

        "zentryx_servicios",

        "zentryx_servicios_publicados",

        "zentryx_services"

    ];

    let servicios = [];

    for (
        const clave of posiblesClaves
    ) {

        try {

            const datos =
                localStorage.getItem(
                    clave
                );

            if (datos) {

                const parsed =
                    JSON.parse(datos);

                if (
                    Array.isArray(parsed)
                ) {

                    servicios = parsed;

                    break;
                }
            }

        } catch (error) {

            console.error(
                `Error leyendo ${clave}:`,
                error
            );
        }
    }

    if (
        !Array.isArray(servicios) ||
        servicios.length === 0
    ) {

        return 0;
    }

    return servicios.filter(
        servicio => {

            const categoria =
                servicio.categoria ||
                servicio.categoriaId ||
                servicio.category ||
                servicio.categoryId;

            return String(
                categoria || ""
            ).toLowerCase() ===
            String(
                categoriaId || ""
            ).toLowerCase();

        }
    ).length;
}


/* =========================================================
   BOTONES DE CATEGORÍA
========================================================= */

function inicializarBotonesCategorias() {

    document
        .querySelectorAll(
            ".category-button"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const categoriaId =
                            boton.dataset.category;

                        explorarCategoria(
                            categoriaId
                        );

                    }
                );
            }
        );
}


/* =========================================================
   EXPLORAR CATEGORÍA
========================================================= */

function explorarCategoria(
    categoriaId
) {

    if (!categoriaId) {
        return;
    }

    const categoria =
        obtenerCategorias()
            .find(
                item =>
                    String(item.id) ===
                    String(categoriaId)
            );

    if (!categoria) {
        return;
    }

    registrarActividad({

        tipo: "category",

        titulo:
            "Categoría explorada",

        descripcion:
            `Exploraste la categoría "${categoria.nombre}".`,

        fecha:
            new Date().toISOString()

    });

    const url =
        `servicios.html?categoria=${encodeURIComponent(
            categoria.id
        )}`;

    window.location.href =
        url;
}


/* =========================================================
   BÚSQUEDA
========================================================= */

function inicializarBusqueda() {

    if (!categorySearch) {
        return;
    }

    categorySearch.addEventListener(
        "input",
        () => {

            filtrarCategorias(
                categorySearch.value
            );

        }
    );
}


/* =========================================================
   FILTRAR CATEGORÍAS
========================================================= */

function filtrarCategorias(
    texto
) {

    const categorias =
        obtenerCategorias();

    const busqueda =
        String(texto || "")
            .trim()
            .toLowerCase();

    if (!busqueda) {

        mostrarCategorias(
            categorias
        );

        return;
    }

    const resultados =
        categorias.filter(
            categoria => {

                const nombre =
                    String(
                        categoria.nombre || ""
                    ).toLowerCase();

                const descripcion =
                    String(
                        categoria.descripcion || ""
                    ).toLowerCase();

                return (
                    nombre.includes(
                        busqueda
                    ) ||
                    descripcion.includes(
                        busqueda
                    )
                );
            }
        );

    mostrarCategorias(
        resultados
    );
}


/* =========================================================
   CONTADOR
========================================================= */

function actualizarContador(
    cantidad
) {

    if (!categoryCount) {
        return;
    }

    categoryCount.textContent =
        cantidad;
}


/* =========================================================
   ESTADO VACÍO
========================================================= */

function mostrarEstadoVacio() {

    categoryGrid.innerHTML = `

        <div class="categories-empty">

            <div class="categories-empty-icon">

                <i class="fa-solid fa-magnifying-glass"></i>

            </div>

            <h3>
                No encontramos categorías
            </h3>

            <p>
                Intenta realizar otra búsqueda.
            </p>

        </div>

    `;
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

    localStorage.removeItem(
        SESSION_KEY
    );

    sessionStorage.removeItem(
        SESSION_KEY
    );

    cerrarModalLogout();

    mostrarToast(
        "Sesión cerrada",
        "Has cerrado sesión correctamente.",
        "success"
    );

    setTimeout(
        () => {

            window.location.href =
                "login.html";

        },
        900
    );
}


/* =========================================================
   ACTIVIDAD
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

            if (
                Array.isArray(parsed)
            ) {

                actividades =
                    parsed;
            }
        }

    } catch (error) {

        console.error(
            "Error al cargar actividad:",
            error
        );
    }

    actividades.unshift(
        actividad
    );

    actividades =
        actividades.slice(
            0,
            30
        );

    try {

        localStorage.setItem(
            ACTIVITY_KEY,
            JSON.stringify(
                actividades
            )
        );

    } catch (error) {

        console.error(
            "No se pudo guardar actividad:",
            error
        );
    }
}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function inicializarNotificaciones() {

    cargarNotificaciones();

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

            const estaDentro =
                notificationPanel.contains(
                    event.target
                );

            const esBoton =
                notificationButton &&
                notificationButton.contains(
                    event.target
                );

            if (
                !estaDentro &&
                !esBoton
            ) {

                cerrarNotificaciones();
            }
        }
    );
}


/* =========================================================
   CARGAR NOTIFICACIONES
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

    if (!notificationList) {
        return;
    }

    notificationList.innerHTML = "";

    if (
        !Array.isArray(notificaciones) ||
        notificaciones.length === 0
    ) {

        notificationList.innerHTML = `

            <div class="notification-empty">

                <div>
                    <i class="fa-solid fa-bell-slash"></i>
                </div>

                <p>
                    No tienes notificaciones nuevas.
                </p>

            </div>

        `;

        if (notificationDot) {

            notificationDot.classList.remove(
                "active"
            );
        }

        return;
    }

    const noLeidas =
        notificaciones.filter(
            notificacion =>
                !notificacion.leida
        );

    if (
        notificationDot
    ) {

        notificationDot.classList.toggle(
            "active",
            noLeidas.length > 0
        );
    }

    notificaciones
        .slice(0, 10)
        .forEach(
            notificacion => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "notification-item";

                item.innerHTML = `

                    <div class="notification-item-icon">

                        <i class="fa-solid fa-bell"></i>

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

                        notificacion.leida =
                            true;

                        guardarNotificaciones(
                            notificaciones
                        );

                        mostrarNotificaciones(
                            notificaciones
                        );

                    }
                );

                notificationList.appendChild(
                    item
                );
            }
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

    if (toastTitle) {

        toastTitle.textContent =
            titulo;
    }

    if (toastMessage) {

        toastMessage.textContent =
            mensaje;
    }

    if (toastIcon) {

        if (tipo === "error") {

            toastIcon.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';

            toastIcon.style.background =
                "rgba(231, 76, 60, 0.1)";

            toastIcon.style.color =
                "#e74c3c";

        } else {

            toastIcon.innerHTML =
                '<i class="fa-solid fa-check"></i>';

            toastIcon.style.background =
                "rgba(32, 180, 134, 0.1)";

            toastIcon.style.color =
                "#20b486";
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

    return "Hace varios días";
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
   EXPONER FUNCIONES
========================================================= */

window.ZentryXCategorias = {

    obtenerSesion,

    obtenerUsuario,

    obtenerCategorias,

    guardarCategorias,

    cargarCategorias,

    filtrarCategorias,

    explorarCategoria,

    registrarActividad,

    mostrarToast,

    cargarNotificaciones

};