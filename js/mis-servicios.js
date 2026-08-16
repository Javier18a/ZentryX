/* =========================================================
   ZENTRYX - MIS SERVICIOS
   mis-servicios.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const SESSION_KEY = "zentryx_sesion";
    const SERVICES_KEY = "zentryx_servicios";
    const NOTIFICATIONS_KEY = "zentryx_notificaciones";


    /* =====================================================
       ESTADO
    ===================================================== */

    let services = [];

    let filteredServices = [];

    let currentSearch = "";

    let currentStatus = "todos";

    let currentSort = "recent";

    let serviceToDelete = null;


    /* =====================================================
       DOM
    ===================================================== */

    const servicesGrid =
        document.getElementById("servicesGrid");

    const servicesEmpty =
        document.getElementById("servicesEmpty");

    const searchInput =
        document.getElementById("serviceSearch");

    const clearSearch =
        document.getElementById("clearSearch");

    const statusFilter =
        document.getElementById("statusFilter");

    const sortServices =
        document.getElementById("sortServices");

    const resultsCount =
        document.getElementById("resultsCount");

    const clearFilters =
        document.getElementById("clearFilters");

    const emptyClearFilters =
        document.getElementById("emptyClearFilters");


    /* =====================================================
       SIDEBAR
    ===================================================== */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarClose =
        document.getElementById("sidebarClose");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const menuButton =
        document.getElementById("menuButton");


    /* =====================================================
       LOGOUT
    ===================================================== */

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


    /* =====================================================
       NOTIFICACIONES
    ===================================================== */

    const notificationButton =
        document.getElementById("notificationButton");

    const notificationPanel =
        document.getElementById("notificationPanel");

    const closeNotifications =
        document.getElementById("closeNotifications");

    const notificationList =
        document.getElementById("notificationList");

    const notificationDot =
        document.getElementById("notificationDot");


    /* =====================================================
       TOAST
    ===================================================== */

    const toast =
        document.getElementById("toast");

    const toastIcon =
        document.getElementById("toastIcon");

    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");

    let toastTimeout = null;


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    if (!verificarSesion()) {
        return;
    }

    cargarUsuario();

    cargarServicios();

    inicializarSidebar();

    inicializarBusqueda();

    inicializarFiltros();

    inicializarAccionesServicios();

    inicializarLogout();

    inicializarNotificaciones();

    inicializarTeclado();

});


/* =========================================================
   SESIÓN
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


function obtenerSesion() {

    const local =
        localStorage.getItem(
            "zentryx_sesion"
        );

    const temporal =
        sessionStorage.getItem(
            "zentryx_sesion"
        );

    const datos =
        local || temporal;

    if (!datos) {
        return null;
    }

    try {

        return JSON.parse(datos);

    } catch (error) {

        console.error(
            "Error leyendo sesión:",
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
   USUARIO
========================================================= */

function cargarUsuario() {

    const usuario =
        obtenerSesion();

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


    const correo =
        obtenerValor(
            usuario,
            [
                "correo",
                "Correo",
                "email",
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
        correo
    );


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
}


function obtenerValor(
    objeto,
    propiedades
) {

    for (const propiedad of propiedades) {

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
   SERVICIOS
========================================================= */

function cargarServicios() {

    services = [];


    try {

        const datos =
            localStorage.getItem(
                "zentryx_servicios"
            );


        if (datos) {

            const parsed =
                JSON.parse(datos);


            if (Array.isArray(parsed)) {

                services =
                    parsed;
            }
        }

    } catch (error) {

        console.error(
            "Error cargando servicios:",
            error
        );
    }


    /*
     * Normalizamos los servicios para que
     * funcionen aunque hayan sido creados
     * desde Publicar o desde versiones
     * anteriores del proyecto.
     */

    services =
        services.map(
            normalizarServicio
        );


    /*
     * Mis servicios solamente debe mostrar
     * los servicios publicados por el usuario
     * actual cuando existe información del
     * propietario.
     */

    const usuario =
        obtenerSesion();


    if (usuario) {

        const usuarioId =
            obtenerValor(
                usuario,
                [
                    "id",
                    "Id",
                    "usuarioId",
                    "UsuarioId",
                    "userId",
                    "UserId",
                    "idUsuario",
                    "Id_Usuario"
                ]
            );


        const correo =
            obtenerValor(
                usuario,
                [
                    "correo",
                    "Correo",
                    "email",
                    "Correo_Usuario",
                    "correoUsuario"
                ]
            );


        const tienePropietario =
            services.some(
                servicio =>
                    servicio.usuarioId ||
                    servicio.proveedorId ||
                    servicio.autorId ||
                    servicio.usuarioCorreo
            );


        if (tienePropietario) {

            services =
                services.filter(
                    servicio => {

                        if (
                            usuarioId &&
                            servicio.usuarioId
                        ) {

                            return String(
                                servicio.usuarioId
                            ) === String(
                                usuarioId
                            );
                        }


                        if (
                            usuarioId &&
                            servicio.proveedorId
                        ) {

                            return String(
                                servicio.proveedorId
                            ) === String(
                                usuarioId
                            );
                        }


                        if (
                            usuarioId &&
                            servicio.autorId
                        ) {

                            return String(
                                servicio.autorId
                            ) === String(
                                usuarioId
                            );
                        }


                        if (
                            correo &&
                            servicio.usuarioCorreo
                        ) {

                            return String(
                                servicio.usuarioCorreo
                            ).toLowerCase() ===
                            String(
                                correo
                            ).toLowerCase();
                        }


                        return false;
                    }
                );
        }
    }


    filteredServices =
        [...services];


    filterServices();
}


function normalizarServicio(
    servicio
) {

    const categoria =
        servicio.categoria ||
        servicio.category ||
        "otros";


    const titulo =
        servicio.titulo ||
        servicio.title ||
        "Servicio sin título";


    const descripcion =
        servicio.descripcion ||
        servicio.description ||
        "Sin descripción disponible.";


    const precio =
        servicio.precio !== undefined
            ? servicio.precio
            : servicio.price;


    const fecha =
        servicio.fecha ||
        servicio.date ||
        new Date().toISOString();


    return {

        ...servicio,

        id:
            servicio.id ??
            `SRV-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 7)}`,

        titulo,

        title: titulo,

        descripcion,

        description: descripcion,

        categoria,

        category: categoria,

        categoriaNombre:
            servicio.categoriaNombre ||
            getCategoryName(categoria),

        precio:
            Number(
                precio || 0
            ),

        price:
            Number(
                precio || 0
            ),

        fecha,

        date: fecha,

        unidad:
            servicio.unidad ||
            "servicio",

        rating:
            Number(
                servicio.rating || 0
            ),

        opiniones:
            Number(
                servicio.opiniones ??
                servicio.reviews ??
                0
            ),

        reviews:
            Number(
                servicio.reviews ??
                servicio.opiniones ??
                0
            ),

        ubicacion:
            servicio.ubicacion ||
            servicio.location ||
            "Nicaragua",

        location:
            servicio.location ||
            servicio.ubicacion ||
            "Nicaragua",

        estado:
            servicio.estado ||
            servicio.status ||
            "activo",

        status:
            servicio.status ||
            servicio.estado ||
            "activo",

        icon:
            servicio.icon ||
            obtenerIconoServicio(
                categoria
            )
    };
}


/* =========================================================
   GUARDAR SERVICIOS
========================================================= */

function guardarServicios() {

    try {

        /*
         * No sobrescribimos los servicios de
         * otros usuarios con el contenido filtrado.
         *
         * Se modifica directamente el arreglo
         * completo almacenado en localStorage
         * cuando sea necesario.
         */

        localStorage.setItem(
            "zentryx_servicios",
            JSON.stringify(
                services
            )
        );

    } catch (error) {

        console.error(
            "Error guardando servicios:",
            error
        );
    }
}


/* =========================================================
   CATEGORÍAS
========================================================= */

function getCategoryName(
    category
) {

    const categories = {

        tecnologia:
            "Tecnología",

        diseno:
            "Diseño",

        educacion:
            "Educación",

        hogar:
            "Hogar",

        negocios:
            "Negocios",

        marketing:
            "Marketing",

        otros:
            "Otros"
    };


    return categories[
        String(
            category || ""
        ).toLowerCase()
    ] || "Otros";
}


/* =========================================================
   ICONO
========================================================= */

function obtenerIconoServicio(
    categoria
) {

    switch (
        String(
            categoria || ""
        ).toLowerCase()
    ) {

        case "tecnologia":
            return "fa-laptop-code";

        case "diseno":
            return "fa-pen-ruler";

        case "educacion":
            return "fa-graduation-cap";

        case "hogar":
            return "fa-house";

        case "negocios":
            return "fa-briefcase";

        case "marketing":
            return "fa-bullhorn";

        default:
            return "fa-layer-group";
    }
}


/* =========================================================
   ESTADOS
========================================================= */

function getStatusName(
    status
) {

    const statuses = {

        activo:
            "Activo",

        pausado:
            "Pausado",

        pendiente:
            "Pendiente",

        inactivo:
            "Inactivo"
    };


    return statuses[
        String(
            status || ""
        ).toLowerCase()
    ] || "Sin estado";
}


function getStatusIcon(
    status
) {

    switch (
        String(
            status || ""
        ).toLowerCase()
    ) {

        case "activo":
            return "fa-circle-check";

        case "pausado":
            return "fa-circle-pause";

        case "pendiente":
            return "fa-clock";

        case "inactivo":
            return "fa-circle-xmark";

        default:
            return "fa-circle";
    }
}


/* =========================================================
   FILTRAR
========================================================= */

function filterServices() {

    const search =
        currentSearch
            .toLowerCase()
            .trim();


    filteredServices =
        services.filter(
            service => {

                const titulo =
                    String(
                        service.titulo ||
                        service.title ||
                        ""
                    ).toLowerCase();


                const descripcion =
                    String(
                        service.descripcion ||
                        service.description ||
                        ""
                    ).toLowerCase();


                const categoria =
                    String(
                        service.categoria ||
                        service.category ||
                        ""
                    ).toLowerCase();


                const categoriaNombre =
                    String(
                        service.categoriaNombre ||
                        getCategoryName(
                            service.categoria
                        )
                    ).toLowerCase();


                const ubicacion =
                    String(
                        service.ubicacion ||
                        service.location ||
                        ""
                    ).toLowerCase();


                const coincideBusqueda =
                    !search ||
                    titulo.includes(search) ||
                    descripcion.includes(search) ||
                    categoria.includes(search) ||
                    categoriaNombre.includes(search) ||
                    ubicacion.includes(search);


                const estado =
                    String(
                        service.estado ||
                        service.status ||
                        "activo"
                    ).toLowerCase();


                const coincideEstado =
                    currentStatus === "todos" ||
                    estado === currentStatus;


                return (
                    coincideBusqueda &&
                    coincideEstado
                );
            }
        );


    sortServicesList();

    renderServices();
}


/* =========================================================
   ORDENAR
========================================================= */

function sortServicesList() {

    filteredServices.sort(
        (a, b) => {

            switch (currentSort) {

                case "oldest":

                    return (
                        new Date(
                            a.fecha || a.date || 0
                        ) -
                        new Date(
                            b.fecha || b.date || 0
                        )
                    );


                case "rating":

                    return (
                        Number(
                            b.rating || 0
                        ) -
                        Number(
                            a.rating || 0
                        )
                    );


                case "price-low":

                    return (
                        Number(
                            a.precio ??
                            a.price ??
                            0
                        ) -
                        Number(
                            b.precio ??
                            b.price ??
                            0
                        )
                    );


                case "price-high":

                    return (
                        Number(
                            b.precio ??
                            b.price ??
                            0
                        ) -
                        Number(
                            a.precio ??
                            a.price ??
                            0
                        )
                    );


                case "recent":

                default:

                    return (
                        new Date(
                            b.fecha ||
                            b.date ||
                            0
                        ) -
                        new Date(
                            a.fecha ||
                            a.date ||
                            0
                        )
                    );
            }
        }
    );
}


/* =========================================================
   RENDERIZAR
========================================================= */

function renderServices() {

    if (!servicesGrid) {
        return;
    }


    servicesGrid.innerHTML = "";


    updateResultsCount();


    if (
        filteredServices.length === 0
    ) {

        if (servicesEmpty) {

            servicesEmpty.hidden =
                false;
        }

        return;
    }


    if (servicesEmpty) {

        servicesEmpty.hidden =
            true;
    }


    filteredServices.forEach(
        service => {

            servicesGrid.appendChild(
                createServiceCard(
                    service
                )
            );
        }
    );
}


/* =========================================================
   TARJETA
========================================================= */

function createServiceCard(
    service
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "service-card";


    article.dataset.id =
        service.id;


    const categoria =
        service.categoria ||
        service.category ||
        "otros";


    const estado =
        service.estado ||
        service.status ||
        "activo";


    const titulo =
        service.titulo ||
        service.title ||
        "Servicio";


    const descripcion =
        service.descripcion ||
        service.description ||
        "Sin descripción disponible.";


    const precio =
        Number(
            service.precio ??
            service.price ??
            0
        );


    const rating =
        Number(
            service.rating || 0
        );


    const opiniones =
        Number(
            service.opiniones ??
            service.reviews ??
            0
        );


    const ubicacion =
        service.ubicacion ||
        service.location ||
        "Nicaragua";


    const icono =
        service.icon ||
        obtenerIconoServicio(
            categoria
        );


    article.innerHTML = `

        <div class="service-image">

            <i class="fa-solid ${escapeHTML(icono)}"></i>

            <span class="service-category">

                ${escapeHTML(
                    getCategoryName(
                        categoria
                    )
                )}

            </span>

            <span class="service-status ${escapeHTML(estado)}">

                <i class="fa-solid ${getStatusIcon(estado)}"></i>

                ${escapeHTML(
                    getStatusName(
                        estado
                    )
                )}

            </span>

        </div>


        <div class="service-body">

            <h3 class="service-title">

                ${escapeHTML(titulo)}

            </h3>


            <p class="service-description">

                ${escapeHTML(descripcion)}

            </p>


            <div class="service-meta">

                <div class="service-rating">

                    <i class="fa-solid fa-star"></i>

                    <strong>
                        ${rating.toFixed(1)}
                    </strong>

                    <span>
                        (${opiniones})
                    </span>

                </div>


                <div class="service-location">

                    <i class="fa-solid fa-location-dot"></i>

                    ${escapeHTML(ubicacion)}

                </div>

            </div>


            <div class="service-footer">

                <div class="service-provider">

                    <div class="provider-avatar">

                        ${obtenerInicial(
                            obtenerNombreUsuario()
                        )}

                    </div>


                    <div class="provider-info">

                        <strong>
                            Mi servicio
                        </strong>

                        <span>
                            Publicado por ti
                        </span>

                    </div>

                </div>


                <div class="service-price">

                    <span>
                        Desde
                    </span>

                    <strong>
                        ${formatPrice(precio)}
                    </strong>

                </div>

            </div>


            <div class="service-actions">

                <button
                    type="button"
                    class="service-action edit-service"
                    data-id="${escapeHTML(service.id)}">

                    <i class="fa-solid fa-pen"></i>

                    Editar

                </button>


                <button
                    type="button"
                    class="service-action view-service"
                    data-id="${escapeHTML(service.id)}">

                    <i class="fa-solid fa-eye"></i>

                    Ver

                </button>


                <button
                    type="button"
                    class="service-action delete-service"
                    data-id="${escapeHTML(service.id)}">

                    <i class="fa-solid fa-trash"></i>

                    Eliminar

                </button>

            </div>

        </div>

    `;


    return article;
}


/* =========================================================
   NOMBRE USUARIO
========================================================= */

function obtenerNombreUsuario() {

    const usuario =
        obtenerSesion();

    if (!usuario) {
        return "Usuario";
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


    return `${nombre || ""} ${apellido || ""}`
        .trim() ||
        "Usuario";
}


/* =========================================================
   PRECIO
========================================================= */

function formatPrice(
    price
) {

    const numero =
        Number(price);


    if (
        Number.isNaN(numero)
    ) {

        return "$0.00";
    }


    return numero.toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)
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
   CONTADOR
========================================================= */

function updateResultsCount() {

    if (!resultsCount) {
        return;
    }


    const total =
        filteredServices.length;


    resultsCount.textContent =
        `${total} ${
            total === 1
                ? "servicio"
                : "servicios"
        }`;
}


/* =========================================================
   BÚSQUEDA
========================================================= */

function inicializarBusqueda() {

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                currentSearch =
                    searchInput.value;

                updateClearSearch();

                filterServices();
            }
        );
    }


    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            () => {

                if (searchInput) {

                    searchInput.value =
                        "";
                }


                currentSearch =
                    "";


                updateClearSearch();

                filterServices();
            }
        );
    }
}


function updateClearSearch() {

    if (!clearSearch) {
        return;
    }


    if (
        searchInput &&
        searchInput.value.trim()
    ) {

        clearSearch.classList.add(
            "active"
        );

    } else {

        clearSearch.classList.remove(
            "active"
        );
    }
}


/* =========================================================
   FILTROS
========================================================= */

function inicializarFiltros() {

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            () => {

                currentStatus =
                    statusFilter.value ||
                    "todos";

                filterServices();
            }
        );
    }


    if (sortServices) {

        sortServices.addEventListener(
            "change",
            () => {

                currentSort =
                    sortServices.value ||
                    "recent";

                filterServices();
            }
        );
    }


    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            resetFilters
        );
    }


    if (emptyClearFilters) {

        emptyClearFilters.addEventListener(
            "click",
            resetFilters
        );
    }
}


function resetFilters() {

    currentSearch =
        "";

    currentStatus =
        "todos";

    currentSort =
        "recent";


    if (searchInput) {
        searchInput.value = "";
    }


    if (statusFilter) {
        statusFilter.value = "todos";
    }


    if (sortServices) {
        sortServices.value = "recent";
    }


    updateClearSearch();

    filterServices();
}


/* =========================================================
   ACCIONES
========================================================= */

function inicializarAccionesServicios() {

    if (!servicesGrid) {
        return;
    }


    servicesGrid.addEventListener(
        "click",
        event => {

            const editButton =
                event.target.closest(
                    ".edit-service"
                );


            const viewButton =
                event.target.closest(
                    ".view-service"
                );


            const deleteButton =
                event.target.closest(
                    ".delete-service"
                );


            if (editButton) {

                editarServicio(
                    editButton.dataset.id
                );

                return;
            }


            if (viewButton) {

                verServicio(
                    viewButton.dataset.id
                );

                return;
            }


            if (deleteButton) {

                abrirModalEliminar(
                    deleteButton.dataset.id
                );
            }
        }
    );
}


/* =========================================================
   EDITAR
========================================================= */

function editarServicio(
    id
) {

    const servicio =
        services.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!servicio) {

        mostrarToast(
            "Servicio no encontrado",
            "No fue posible encontrar el servicio.",
            "error"
        );

        return;
    }


    try {

        sessionStorage.setItem(
            "zentryx_servicio_seleccionado",
            JSON.stringify(
                servicio
            )
        );

    } catch (error) {

        console.error(error);
    }


    window.location.href =
        `editar-servicio.html?id=${encodeURIComponent(id)}`;
}


/* =========================================================
   VER
========================================================= */

function verServicio(
    id
) {

    const servicio =
        services.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!servicio) {

        mostrarToast(
            "Servicio no encontrado",
            "No fue posible encontrar el servicio.",
            "error"
        );

        return;
    }


    try {

        sessionStorage.setItem(
            "zentryx_servicio_seleccionado",
            JSON.stringify(
                servicio
            )
        );

    } catch (error) {

        console.error(error);
    }


    window.location.href =
        `servicio-detalle.html?id=${encodeURIComponent(id)}`;
}


/* =========================================================
   MODAL ELIMINAR
========================================================= */

function abrirModalEliminar(
    id
) {

    serviceToDelete =
        String(id);


    const modal =
        document.getElementById(
            "deleteModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );
    }
}


function cerrarModalEliminar() {

    serviceToDelete =
        null;


    const modal =
        document.getElementById(
            "deleteModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );
    }
}


function inicializarModalEliminar() {

    const overlay =
        document.getElementById(
            "deleteModalOverlay"
        );


    const cancel =
        document.getElementById(
            "cancelDelete"
        );


    const confirm =
        document.getElementById(
            "confirmDelete"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            cerrarModalEliminar
        );
    }


    if (cancel) {

        cancel.addEventListener(
            "click",
            cerrarModalEliminar
        );
    }


    if (confirm) {

        confirm.addEventListener(
            "click",
            eliminarServicio
        );
    }
}


function eliminarServicio() {

    if (
        serviceToDelete === null
    ) {

        return;
    }


    const id =
        String(
            serviceToDelete
        );


    const servicioEliminado =
        services.find(
            servicio =>
                String(
                    servicio.id
                ) === id
        );


    if (!servicioEliminado) {

        cerrarModalEliminar();

        mostrarToast(
            "Servicio no encontrado",
            "El servicio ya no está disponible.",
            "error"
        );

        return;
    }


    /*
     * Eliminamos el servicio del arreglo
     * que se encuentra en memoria.
     */

    services =
        services.filter(
            servicio =>
                String(
                    servicio.id
                ) !== id
        );


    /*
     * Guardamos nuevamente todos los
     * servicios en localStorage.
     */

    guardarServicios();


    /*
     * También eliminamos favoritos
     * asociados al servicio.
     */

    eliminarFavorito(
        servicioEliminado.id
    );


    cerrarModalEliminar();

    filterServices();


    crearNotificacion(
        "success",
        "Servicio eliminado",
        `"${servicioEliminado.titulo}" fue eliminado correctamente.`
    );


    mostrarToast(
        "Servicio eliminado",
        `"${servicioEliminado.titulo}" fue eliminado correctamente.`,
        "success"
    );
}


/* =========================================================
   FAVORITO
========================================================= */

function eliminarFavorito(
    id
) {

    try {

        const datos =
            localStorage.getItem(
                "zentryx_favoritos"
            );


        if (!datos) {
            return;
        }


        const favoritos =
            JSON.parse(datos);


        if (!Array.isArray(favoritos)) {
            return;
        }


        const nuevos =
            favoritos.filter(
                favorito =>
                    String(favorito) !==
                    String(id)
            );


        localStorage.setItem(
            "zentryx_favoritos",
            JSON.stringify(
                nuevos
            )
        );

    } catch (error) {

        console.error(
            "Error actualizando favoritos:",
            error
        );
    }
}


/* =========================================================
   SIDEBAR
========================================================= */

function inicializarSidebar() {

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


function abrirSidebar() {

    if (sidebar) {

        sidebar.classList.add(
            "open"
        );
    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.add(
            "active"
        );
    }
}


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
   NOTIFICACIONES
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


    cargarNotificaciones();


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


            const dentro =
                notificationPanel.contains(
                    event.target
                );


            const boton =
                notificationButton &&
                notificationButton.contains(
                    event.target
                );


            if (
                !dentro &&
                !boton
            ) {

                cerrarNotificaciones();
            }
        }
    );
}


function cargarNotificaciones() {

    let notificaciones = [];


    try {

        const datos =
            localStorage.getItem(
                "zentryx_notificaciones"
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
            "Error cargando notificaciones:",
            error
        );
    }


    mostrarNotificaciones(
        notificaciones
    );
}


function mostrarNotificaciones(
    notificaciones
) {

    if (!notificationList) {
        return;
    }


    notificationList.innerHTML =
        "";


    if (
        !Array.isArray(
            notificaciones
        ) ||
        notificaciones.length === 0
    ) {

        notificationList.innerHTML = `

            <div class="notification-empty">

                <div>

                    <i class="fa-regular fa-bell"></i>

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
            item =>
                !item.leida
        );


    if (notificationDot) {

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

                        ${obtenerIconoNotificacion(
                            notificacion.tipo
                        )}

                    </div>


                    <div class="notification-item-content">

                        <strong>
                            ${escapeHTML(
                                notificacion.titulo ||
                                "Notificación"
                            )}
                        </strong>


                        <p>
                            ${escapeHTML(
                                notificacion.mensaje ||
                                notificacion.descripcion ||
                                ""
                            )}
                        </p>


                        <div class="notification-item-time">

                            ${obtenerTiempoRelativo(
                                notificacion.fecha
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


function guardarNotificaciones(
    notificaciones
) {

    try {

        localStorage.setItem(
            "zentryx_notificaciones",
            JSON.stringify(
                notificaciones
            )
        );

    } catch (error) {

        console.error(
            "Error guardando notificaciones:",
            error
        );
    }
}


function crearNotificacion(
    tipo,
    titulo,
    mensaje
) {

    let notificaciones = [];


    try {

        const datos =
            localStorage.getItem(
                "zentryx_notificaciones"
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

        console.error(error);
    }


    notificaciones.unshift({

        id:
            `NOT-${Date.now()}`,

        tipo,

        titulo,

        mensaje,

        fecha:
            new Date().toISOString(),

        leida:
            false
    });


    guardarNotificaciones(
        notificaciones
    );
}


function obtenerIconoNotificacion(
    tipo
) {

    switch (
        String(
            tipo || ""
        ).toLowerCase()
    ) {

        case "success":

            return `
                <i class="fa-solid fa-check"></i>
            `;


        case "security":

            return `
                <i class="fa-solid fa-shield-halved"></i>
            `;


        case "warning":

            return `
                <i class="fa-solid fa-triangle-exclamation"></i>
            `;


        case "system":

            return `
                <i class="fa-solid fa-gear"></i>
            `;


        default:

            return `
                <i class="fa-regular fa-bell"></i>
            `;
    }
}


function toggleNotificaciones() {

    if (!notificationPanel) {
        return;
    }


    notificationPanel.classList.toggle(
        "active"
    );


    if (
        notificationPanel.classList.contains(
            "active"
        )
    ) {

        cargarNotificaciones();
    }
}


function cerrarNotificaciones() {

    if (!notificationPanel) {
        return;
    }


    notificationPanel.classList.remove(
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
}


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


function cerrarSesion() {

    localStorage.removeItem(
        "zentryx_sesion"
    );

    sessionStorage.removeItem(
        "zentryx_sesion"
    );


    cerrarModalLogout();


    window.location.href =
        "login.html";
}


/* =========================================================
   TECLADO
========================================================= */

function inicializarTeclado() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {

                return;
            }


            cerrarModalEliminar();

            cerrarModalLogout();

            cerrarNotificaciones();

            cerrarSidebar();
        }
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


    return fechaObjeto.toLocaleDateString(
        "es-NI",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
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

        if (
            tipo === "error"
        ) {

            toastIcon.innerHTML = `
                <i class="fa-solid fa-xmark"></i>
            `;

        } else {

            toastIcon.innerHTML = `
                <i class="fa-solid fa-check"></i>
            `;
        }
    }


    toast.classList.add(
        "active"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
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
   RESPONSIVE
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
   API ZENTRYX
========================================================= */

window.ZentryXMisServicios = {

    cargarServicios,

    filterServices,

    renderServices,

    resetFilters,

    editarServicio,

    verServicio,

    eliminarServicio,

    mostrarToast

};