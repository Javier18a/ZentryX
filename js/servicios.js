/* =========================================================
   ZENTRYX - EXPLORAR SERVICIOS
   servicios.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const SESSION_KEY = "zentryx_sesion";
    const SERVICES_KEY = "zentryx_servicios";
    const FAVORITES_KEY = "zentryx_favoritos";
    const NOTIFICATIONS_KEY = "zentryx_notificaciones";


    /* =====================================================
       ESTADO
    ===================================================== */

    let servicios = [];

    let categoriaActual = "todos";

    let terminoBusqueda = "";

    let ordenActual = "recent";


    /* =====================================================
       ELEMENTOS
    ===================================================== */

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

    const notificationDot =
        document.getElementById("notificationDot");

    const closeNotifications =
        document.getElementById("closeNotifications");

    const notificationList =
        document.getElementById("notificationList");

    const searchInput =
        document.getElementById("searchInput");

    const clearSearch =
        document.getElementById("clearSearch");

    const filterButton =
        document.getElementById("filterButton");

    const categoryList =
        document.getElementById("categoryList");

    const servicesGrid =
        document.getElementById("servicesGrid");

    const emptyResults =
        document.getElementById("emptyResults");

    const resetFilters =
        document.getElementById("resetFilters");

    const resultsCount =
        document.getElementById("resultsCount");

    const sortSelect =
        document.getElementById("sortSelect");

    const toast =
        document.getElementById("toast");

    const toastIcon =
        document.getElementById("toastIcon");

    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    if (!verificarSesion()) {
        return;
    }

    cargarUsuario();

    cargarServicios();

    inicializarMenu();

    inicializarLogout();

    inicializarNotificaciones();

    inicializarBusqueda();

    inicializarCategorias();

    inicializarOrdenamiento();

    inicializarFiltros();


    /* =====================================================
       SESIÓN
    ===================================================== */

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
                SESSION_KEY
            );

        const temporal =
            sessionStorage.getItem(
                SESSION_KEY
            );

        const datos =
            local || temporal;


        if (!datos) {
            return null;
        }


        try {

            const sesion =
                JSON.parse(datos);


            if (
                sesion &&
                typeof sesion === "object"
            ) {

                return sesion;
            }

        } catch (error) {

            console.error(
                "Error leyendo sesión:",
                error
            );

            localStorage.removeItem(
                SESSION_KEY
            );

            sessionStorage.removeItem(
                SESSION_KEY
            );
        }


        return null;
    }


    function obtenerUsuario() {

        return obtenerSesion();
    }


    /* =====================================================
       USUARIO
    ===================================================== */

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

        if (!objeto) {
            return "";
        }


        for (
            const propiedad of propiedades
        ) {

            if (
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


    /* =====================================================
       SERVICIOS
    ===================================================== */

    function cargarServicios() {

        servicios = [];


        try {

            const datos =
                localStorage.getItem(
                    SERVICES_KEY
                );


            if (!datos) {

                mostrarServicios([]);

                return;
            }


            const parsed =
                JSON.parse(datos);


            if (
                Array.isArray(parsed)
            ) {

                servicios =
                    normalizarServicios(
                        parsed
                    );

            }

        } catch (error) {

            console.error(
                "Error cargando servicios:",
                error
            );

            servicios = [];
        }


        aplicarFiltros();
    }


    function normalizarServicios(
        lista
    ) {

        if (
            !Array.isArray(lista)
        ) {

            return [];
        }


        return lista.map(
            servicio => {

                const categoria =
                    String(
                        servicio.categoria ||
                        "otros"
                    ).toLowerCase();


                const titulo =
                    servicio.titulo ||
                    servicio.title ||
                    "Servicio";


                const descripcion =
                    servicio.descripcion ||
                    servicio.description ||
                    "Sin descripción disponible.";


                const precio =
                    Number(
                        servicio.precio ??
                        servicio.price ??
                        0
                    );


                const fecha =
                    servicio.fecha ||
                    servicio.date ||
                    new Date().toISOString();


                return {

                    ...servicio,

                    id:
                        servicio.id ||
                        `SRV-${Date.now()}`,

                    titulo:
                        titulo,

                    descripcion:
                        descripcion,

                    categoria:
                        categoria,

                    categoriaNombre:
                        servicio.categoriaNombre ||
                        obtenerNombreCategoria(
                            categoria
                        ),

                    precio:
                        Number.isNaN(precio)
                            ? 0
                            : precio,

                    unidad:
                        servicio.unidad ||
                        "servicio",

                    proveedor:
                        servicio.proveedor ||
                        "Usuario",

                    proveedorId:
                        servicio.proveedorId ||
                        servicio.usuarioId ||
                        "",

                    usuarioId:
                        servicio.usuarioId ||
                        servicio.proveedorId ||
                        "",

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

                    fecha:
                        fecha,

                    destacado:
                        Boolean(
                            servicio.destacado
                        ),

                    estado:
                        servicio.estado ||
                        servicio.status ||
                        "activo"

                };

            }
        );
    }


    function obtenerNombreCategoria(
        categoria
    ) {

        const categorias = {

            tecnologia: "Tecnología",

            diseno: "Diseño",

            marketing: "Marketing",

            educacion: "Educación",

            hogar: "Hogar",

            negocios: "Negocios",

            otros: "Otros"

        };


        return (
            categorias[
                String(
                    categoria || ""
                ).toLowerCase()
            ] ||
            "Otros"
        );
    }


    /* =====================================================
       FILTROS
    ===================================================== */

    function aplicarFiltros() {

        let resultados =
            [...servicios];


        if (
            categoriaActual !== "todos"
        ) {

            resultados =
                resultados.filter(
                    servicio =>
                        String(
                            servicio.categoria ||
                            ""
                        ).toLowerCase() ===
                        categoriaActual
                );
        }


        if (
            terminoBusqueda.trim() !== ""
        ) {

            const termino =
                terminoBusqueda
                    .toLowerCase()
                    .trim();


            resultados =
                resultados.filter(
                    servicio => {

                        const contenido = [

                            servicio.titulo,

                            servicio.descripcion,

                            servicio.categoriaNombre,

                            servicio.proveedor,

                            servicio.ubicacion,

                            servicio.location

                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();


                        return contenido.includes(
                            termino
                        );
                    }
                );
        }


        resultados =
            ordenarServicios(
                resultados
            );


        mostrarServicios(
            resultados
        );
    }


    /* =====================================================
       ORDENAMIENTO
    ===================================================== */

    function ordenarServicios(
        lista
    ) {

        const copia =
            [...lista];


        switch (ordenActual) {

            case "price-low":

                copia.sort(
                    (a, b) =>
                        Number(
                            a.precio || 0
                        ) -
                        Number(
                            b.precio || 0
                        )
                );

                break;


            case "price-high":

                copia.sort(
                    (a, b) =>
                        Number(
                            b.precio || 0
                        ) -
                        Number(
                            a.precio || 0
                        )
                );

                break;


            case "name":

                copia.sort(
                    (a, b) =>
                        String(
                            a.titulo || ""
                        ).localeCompare(
                            String(
                                b.titulo || ""
                            ),
                            "es"
                        )
                );

                break;


            case "recent":

            default:

                copia.sort(
                    (a, b) =>
                        new Date(
                            b.fecha || 0
                        ) -
                        new Date(
                            a.fecha || 0
                        )
                );

                break;
        }


        return copia;
    }


    /* =====================================================
       MOSTRAR SERVICIOS
    ===================================================== */

    function mostrarServicios(
        lista
    ) {

        if (!servicesGrid) {
            return;
        }


        servicesGrid.innerHTML =
            "";


        actualizarContador(
            lista.length
        );


        if (
            !Array.isArray(lista) ||
            lista.length === 0
        ) {

            if (emptyResults) {

                emptyResults.classList.add(
                    "active"
                );
            }

            return;
        }


        if (emptyResults) {

            emptyResults.classList.remove(
                "active"
            );
        }


        lista.forEach(
            servicio => {

                const tarjeta =
                    crearTarjetaServicio(
                        servicio
                    );


                servicesGrid.appendChild(
                    tarjeta
                );
            }
        );
    }


    /* =====================================================
       CONTADOR
    ===================================================== */

    function actualizarContador(
        cantidad
    ) {

        if (!resultsCount) {
            return;
        }


        resultsCount.textContent =
            cantidad === 1
                ? "1 servicio"
                : `${cantidad} servicios`;
    }


    /* =====================================================
       TARJETA
    ===================================================== */

    function crearTarjetaServicio(
        servicio
    ) {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "service-card";


        const destacado =
            servicio.destacado
                ? `
                    <span class="service-featured">
                        <i class="fa-solid fa-star"></i>
                        Destacado
                    </span>
                `
                : "";


        const favoritoActivo =
            estaEnFavoritos(
                servicio.id
            );


        const favoritoIcono =
            favoritoActivo
                ? "fa-solid fa-heart"
                : "fa-regular fa-heart";


        const favoritoClase =
            favoritoActivo
                ? "active"
                : "";


        const rating =
            Number(
                servicio.rating || 0
            ).toFixed(1);


        article.innerHTML = `

            <div class="service-card-top">

                <div class="service-category-icon">

                    ${obtenerIconoCategoria(
                        servicio.categoria
                    )}

                </div>


                <button
                    class="favorite-button ${favoritoClase}"
                    type="button"
                    data-favorite="${escaparHTML(
                        servicio.id
                    )}"
                    aria-label="Agregar a favoritos">

                    <i class="${favoritoIcono}"></i>

                </button>


                ${destacado}

            </div>


            <div class="service-card-body">

                <span class="service-category">

                    ${escaparHTML(
                        servicio.categoriaNombre ||
                        "Servicio"
                    )}

                </span>


                <h3>

                    ${escaparHTML(
                        servicio.titulo
                    )}

                </h3>


                <p>

                    ${escaparHTML(
                        servicio.descripcion
                    )}

                </p>


                <div class="service-provider">

                    <div class="provider-avatar">

                        ${escaparHTML(
                            obtenerInicial(
                                servicio.proveedor
                            )
                        )}

                    </div>


                    <span>

                        ${escaparHTML(
                            servicio.proveedor
                        )}

                    </span>

                </div>


                <div class="service-rating">

                    <i class="fa-solid fa-star"></i>

                    <strong>
                        ${rating}
                    </strong>

                    <span>
                        (${Number(
                            servicio.opiniones || 0
                        )})
                    </span>

                </div>

            </div>


            <div class="service-card-footer">

                <div class="service-price">

                    <small>
                        Desde
                    </small>

                    <strong>
                        $${formatearPrecio(
                            servicio.precio
                        )}
                    </strong>

                    <span>
                        / ${escaparHTML(
                            servicio.unidad ||
                            "servicio"
                        )}
                    </span>

                </div>


                <button
                    class="view-service-button"
                    type="button"
                    data-service-id="${escaparHTML(
                        servicio.id
                    )}">

                    Ver servicio

                    <i class="fa-solid fa-arrow-right"></i>

                </button>

            </div>

        `;


        const favoriteButton =
            article.querySelector(
                "[data-favorite]"
            );


        if (favoriteButton) {

            favoriteButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    toggleFavorito(
                        servicio.id,
                        favoriteButton
                    );
                }
            );
        }


        const viewButton =
            article.querySelector(
                ".view-service-button"
            );


        if (viewButton) {

            viewButton.addEventListener(
                "click",
                () => {

                    verServicio(
                        servicio.id
                    );
                }
            );
        }


        return article;
    }


    /* =====================================================
       ICONOS
    ===================================================== */

    function obtenerIconoCategoria(
        categoria
    ) {

        switch (
            String(
                categoria || ""
            ).toLowerCase()
        ) {

            case "tecnologia":

                return `
                    <i class="fa-solid fa-code"></i>
                `;


            case "diseno":

                return `
                    <i class="fa-solid fa-pen-nib"></i>
                `;


            case "marketing":

                return `
                    <i class="fa-solid fa-bullhorn"></i>
                `;


            case "educacion":

                return `
                    <i class="fa-solid fa-graduation-cap"></i>
                `;


            case "hogar":

                return `
                    <i class="fa-solid fa-house"></i>
                `;


            case "negocios":

                return `
                    <i class="fa-solid fa-briefcase"></i>
                `;


            default:

                return `
                    <i class="fa-solid fa-layer-group"></i>
                `;
        }
    }


    /* =====================================================
       FAVORITOS
    ===================================================== */

    function obtenerFavoritos() {

        try {

            const datos =
                localStorage.getItem(
                    FAVORITES_KEY
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

            console.error(
                "Error leyendo favoritos:",
                error
            );

            return [];
        }
    }


    function guardarFavoritos(
        favoritos
    ) {

        try {

            localStorage.setItem(
                FAVORITES_KEY,
                JSON.stringify(
                    favoritos
                )
            );

            return true;

        } catch (error) {

            console.error(
                "Error guardando favoritos:",
                error
            );

            return false;
        }
    }


    function estaEnFavoritos(
        id
    ) {

        const favoritos =
            obtenerFavoritos();


        return favoritos.some(
            favorito =>
                String(favorito) ===
                String(id)
        );
    }


    function toggleFavorito(
        id,
        boton
    ) {

        let favoritos =
            obtenerFavoritos();


        const posicion =
            favoritos.findIndex(
                favorito =>
                    String(favorito) ===
                    String(id)
            );


        const icono =
            boton?.querySelector(
                "i"
            );


        if (posicion === -1) {

            favoritos.push(
                id
            );


            boton?.classList.add(
                "active"
            );


            if (icono) {

                icono.className =
                    "fa-solid fa-heart";
            }


            guardarFavoritos(
                favoritos
            );


            mostrarToast(
                "Agregado a favoritos",
                "El servicio se agregó a tus favoritos.",
                "success"
            );


        } else {

            favoritos.splice(
                posicion,
                1
            );


            boton?.classList.remove(
                "active"
            );


            if (icono) {

                icono.className =
                    "fa-regular fa-heart";
            }


            guardarFavoritos(
                favoritos
            );


            mostrarToast(
                "Eliminado de favoritos",
                "El servicio se eliminó de tus favoritos.",
                "success"
            );
        }
    }


    /* =====================================================
       VER SERVICIO
    ===================================================== */

    function verServicio(
        id
    ) {

        const servicio =
            servicios.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!servicio) {

            mostrarToast(
                "Servicio no encontrado",
                "No fue posible encontrar este servicio.",
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

            console.error(
                "Error guardando servicio seleccionado:",
                error
            );
        }


        window.location.href =
            `servicio-detalle.html?id=${encodeURIComponent(
                servicio.id
            )}`;
    }


    /* =====================================================
       BÚSQUEDA
    ===================================================== */

    function inicializarBusqueda() {

        searchInput?.addEventListener(
            "input",
            () => {

                terminoBusqueda =
                    searchInput.value;


                aplicarFiltros();
            }
        );


        clearSearch?.addEventListener(
            "click",
            limpiarBusqueda
        );
    }


    function limpiarBusqueda() {

        if (searchInput) {

            searchInput.value =
                "";
        }


        terminoBusqueda =
            "";


        aplicarFiltros();


        searchInput?.focus();
    }


    /* =====================================================
       CATEGORÍAS
    ===================================================== */

    function inicializarCategorias() {

        if (!categoryList) {
            return;
        }


        categoryList
            .querySelectorAll(
                ".category-chip"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            categoryList
                                .querySelectorAll(
                                    ".category-chip"
                                )
                                .forEach(
                                    item =>
                                        item.classList.remove(
                                            "active"
                                        )
                                );


                            boton.classList.add(
                                "active"
                            );


                            categoriaActual =
                                boton.dataset.category ||
                                "todos";


                            aplicarFiltros();
                        }
                    );
                }
            );
    }


    /* =====================================================
       ORDENAMIENTO
    ===================================================== */

    function inicializarOrdenamiento() {

        sortSelect?.addEventListener(
            "change",
            () => {

                ordenActual =
                    sortSelect.value;


                aplicarFiltros();
            }
        );
    }


    /* =====================================================
       FILTROS
    ===================================================== */

    function inicializarFiltros() {

        filterButton?.addEventListener(
            "click",
            () => {

                mostrarToast(
                    "Filtros",
                    "Selecciona una categoría o utiliza la búsqueda para encontrar servicios.",
                    "success"
                );
            }
        );


        resetFilters?.addEventListener(
            "click",
            reiniciarFiltros
        );
    }


    function reiniciarFiltros() {

        categoriaActual =
            "todos";


        terminoBusqueda =
            "";


        ordenActual =
            "recent";


        if (searchInput) {

            searchInput.value =
                "";
        }


        if (sortSelect) {

            sortSelect.value =
                "recent";
        }


        if (categoryList) {

            categoryList
                .querySelectorAll(
                    ".category-chip"
                )
                .forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


            const todos =
                categoryList.querySelector(
                    '[data-category="todos"]'
                );


            todos?.classList.add(
                "active"
            );
        }


        aplicarFiltros();
    }


    /* =====================================================
       SIDEBAR
    ===================================================== */

    function inicializarMenu() {

        menuButton?.addEventListener(
            "click",
            abrirSidebar
        );


        sidebarClose?.addEventListener(
            "click",
            cerrarSidebar
        );


        sidebarOverlay?.addEventListener(
            "click",
            cerrarSidebar
        );


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
                                window.innerWidth <=
                                760
                            ) {

                                cerrarSidebar();
                            }
                        }
                    );
                }
            );
    }


    function abrirSidebar() {

        sidebar?.classList.add(
            "open"
        );


        sidebarOverlay?.classList.add(
            "active"
        );
    }


    function cerrarSidebar() {

        sidebar?.classList.remove(
            "open"
        );


        sidebarOverlay?.classList.remove(
            "active"
        );
    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    function inicializarLogout() {

        logoutButton?.addEventListener(
            "click",
            abrirModalLogout
        );


        cancelLogout?.addEventListener(
            "click",
            cerrarModalLogout
        );


        logoutModalOverlay?.addEventListener(
            "click",
            cerrarModalLogout
        );


        confirmLogout?.addEventListener(
            "click",
            cerrarSesion
        );
    }


    function abrirModalLogout() {

        logoutModal?.classList.add(
            "active"
        );
    }


    function cerrarModalLogout() {

        logoutModal?.classList.remove(
            "active"
        );
    }


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


    /* =====================================================
       NOTIFICACIONES
    ===================================================== */

    function inicializarNotificaciones() {

        notificationButton?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleNotificaciones();
            }
        );


        closeNotifications?.addEventListener(
            "click",
            cerrarNotificaciones
        );


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
                    notificationButton?.contains(
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
                    JSON.parse(
                        datos
                    );


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


            notificationDot?.classList.remove(
                "active"
            );


            return;
        }


        const noLeidas =
            notificaciones.filter(
                item =>
                    !item.leida
            );


        notificationDot?.classList.toggle(
            "active",
            noLeidas.length > 0
        );


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


    function obtenerIconoNotificacion(
        tipo
    ) {

        switch (
            String(
                tipo || ""
            ).toLowerCase()
        ) {

            case "security":

                return `
                    <i class="fa-solid fa-shield-halved"></i>
                `;


            case "success":

                return `
                    <i class="fa-solid fa-check"></i>
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
                "Error guardando notificaciones:",
                error
            );
        }
    }


    function toggleNotificaciones() {

        notificationPanel?.classList.toggle(
            "active"
        );
    }


    function cerrarNotificaciones() {

        notificationPanel?.classList.remove(
            "active"
        );
    }


    /* =====================================================
       TOAST
    ===================================================== */

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

            toastIcon.innerHTML =
                tipo === "error"
                    ? `<i class="fa-solid fa-xmark"></i>`
                    : `<i class="fa-solid fa-check"></i>`;
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


    /* =====================================================
       TIEMPO RELATIVO
    ===================================================== */

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


        if (diferencia < 0) {
            return "Recientemente";
        }


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


    /* =====================================================
       FORMATEAR PRECIO
    ===================================================== */

    function formatearPrecio(
        precio
    ) {

        const numero =
            Number(precio);


        if (
            Number.isNaN(numero)
        ) {

            return "0.00";
        }


        return numero.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    }


    /* =====================================================
       ESCAPAR HTML
    ===================================================== */

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


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {
                return;
            }


            cerrarSidebar();

            cerrarModalLogout();

            cerrarNotificaciones();
        }
    );


    /* =====================================================
       RESPONSIVE
    ===================================================== */

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


    /* =====================================================
       ACTUALIZAR SI CAMBIA LOCALSTORAGE
    ===================================================== */

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key ===
                SERVICES_KEY
            ) {

                cargarServicios();
            }


            if (
                event.key ===
                NOTIFICATIONS_KEY
            ) {

                cargarNotificaciones();
            }
        }
    );


    /* =====================================================
       API
    ===================================================== */

    window.ZentryXServicios = {

        obtenerSesion,

        obtenerUsuario,

        cargarServicios,

        mostrarServicios,

        aplicarFiltros,

        reiniciarFiltros,

        mostrarToast,

        verServicio,

        toggleFavorito

    };

});