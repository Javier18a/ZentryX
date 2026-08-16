/* =========================================================
   ZENTRYX - PUBLICAR SERVICIO
   publicar-servicio.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const SESSION_KEY = "zentryx_sesion";
    const SERVICES_KEY = "zentryx_servicios";
    const NOTIFICATIONS_KEY = "zentryx_notificaciones";


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const form = document.getElementById("serviceForm");

    const titleInput =
        document.getElementById("serviceTitle") ||
        document.getElementById("title") ||
        document.getElementById("titulo");

    const categoryInput =
        document.getElementById("serviceCategory") ||
        document.getElementById("category") ||
        document.getElementById("categoria");

    const descriptionInput =
        document.getElementById("serviceDescription") ||
        document.getElementById("description") ||
        document.getElementById("descripcion");

    const priceInput =
        document.getElementById("servicePrice") ||
        document.getElementById("price") ||
        document.getElementById("precio");

    const unitInput =
        document.getElementById("serviceUnit") ||
        document.getElementById("unit") ||
        document.getElementById("unidad");

    const locationInput =
        document.getElementById("serviceLocation") ||
        document.getElementById("location") ||
        document.getElementById("ubicacion");

    const providerInput =
        document.getElementById("serviceProvider") ||
        document.getElementById("provider") ||
        document.getElementById("proveedor");

    const featuredInput =
        document.getElementById("serviceFeatured") ||
        document.getElementById("featured") ||
        document.getElementById("destacado");

    const publishButton =
        document.getElementById("publishService") ||
        document.getElementById("submitService") ||
        document.querySelector(
            'button[type="submit"]'
        );


    /* =====================================================
       SESIÓN
    ===================================================== */

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


    function obtenerNombreUsuario(
        usuario
    ) {

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

        const completo =
            `${nombre || ""} ${apellido || ""}`
                .trim();

        return (
            completo ||
            nombre ||
            "Usuario"
        );
    }


    function obtenerCorreoUsuario(
        usuario
    ) {

        return (
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
            "usuario@zentryx.com"
        );
    }


    function obtenerRolUsuario(
        usuario
    ) {

        return (
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
            "Usuario"
        );
    }


    /* =====================================================
       VERIFICAR SESIÓN
    ===================================================== */

    const usuario =
        obtenerUsuario();

    if (!usuario) {

        window.location.href =
            "login.html";

        return;
    }


    /* =====================================================
       DATOS DEL USUARIO
    ===================================================== */

    const nombreUsuario =
        obtenerNombreUsuario(
            usuario
        );

    const correoUsuario =
        obtenerCorreoUsuario(
            usuario
        );

    const rolUsuario =
        obtenerRolUsuario(
            usuario
        );


    /* =====================================================
       IDENTIFICADOR DEL USUARIO
    ===================================================== */

    const usuarioId =
        obtenerValor(
            usuario,
            [
                "id",
                "Id",
                "ID",
                "usuarioId",
                "idUsuario",
                "UserId",
                "userId"
            ]
        ) ||
        correoUsuario;


    /* =====================================================
       CARGAR DATOS DEL USUARIO EN LA INTERFAZ
    ===================================================== */

    function cargarUsuarioEnInterfaz() {

        const elementos = {

            sidebarUserName:
                document.getElementById(
                    "sidebarUserName"
                ),

            sidebarUserRole:
                document.getElementById(
                    "sidebarUserRole"
                ),

            topbarUserName:
                document.getElementById(
                    "topbarUserName"
                ),

            topbarUserEmail:
                document.getElementById(
                    "topbarUserEmail"
                ),

            profileAvatar:
                document.getElementById(
                    "profileAvatar"
                ),

            topbarAvatar:
                document.getElementById(
                    "topbarAvatar"
                )

        };


        if (elementos.sidebarUserName) {

            elementos.sidebarUserName.textContent =
                nombreUsuario;
        }


        if (elementos.sidebarUserRole) {

            elementos.sidebarUserRole.textContent =
                rolUsuario;
        }


        if (elementos.topbarUserName) {

            elementos.topbarUserName.textContent =
                nombreUsuario;
        }


        if (elementos.topbarUserEmail) {

            elementos.topbarUserEmail.textContent =
                correoUsuario;
        }


        const inicial =
            obtenerInicial(
                nombreUsuario
            );


        if (elementos.profileAvatar) {

            elementos.profileAvatar.textContent =
                inicial;
        }


        if (elementos.topbarAvatar) {

            elementos.topbarAvatar.textContent =
                inicial;
        }

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


    cargarUsuarioEnInterfaz();


    /* =====================================================
       CATEGORÍAS
    ===================================================== */

    const categorias = {

        tecnologia: "Tecnología",

        diseno: "Diseño",

        marketing: "Marketing",

        educacion: "Educación",

        hogar: "Hogar",

        negocios: "Negocios",

        otros: "Otros"

    };


    function obtenerNombreCategoria(
        categoria
    ) {

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
       GENERAR ID
    ===================================================== */

    function generarIdServicio(
        servicios
    ) {

        let numero = 1;

        if (
            Array.isArray(servicios)
        ) {

            servicios.forEach(
                servicio => {

                    const id =
                        String(
                            servicio.id ||
                            ""
                        );

                    const match =
                        id.match(
                            /^SRV-(\d+)$/
                        );

                    if (match) {

                        numero =
                            Math.max(
                                numero,
                                Number(
                                    match[1]
                                ) + 1
                            );
                    }

                }
            );
        }


        return (
            "SRV-" +
            String(numero)
                .padStart(3, "0")
        );
    }


    /* =====================================================
       CARGAR SERVICIOS
    ===================================================== */

    function obtenerServicios() {

        try {

            const datos =
                localStorage.getItem(
                    SERVICES_KEY
                );

            if (!datos) {
                return [];
            }

            const servicios =
                JSON.parse(datos);

            if (
                Array.isArray(
                    servicios
                )
            ) {

                return servicios;
            }

        } catch (error) {

            console.error(
                "Error cargando servicios:",
                error
            );
        }

        return [];
    }


    /* =====================================================
       GUARDAR SERVICIOS
    ===================================================== */

    function guardarServicios(
        servicios
    ) {

        try {

            localStorage.setItem(
                SERVICES_KEY,
                JSON.stringify(
                    servicios
                )
            );

            return true;

        } catch (error) {

            console.error(
                "Error guardando servicios:",
                error
            );

            mostrarToast(
                "Error",
                "No se pudo guardar el servicio.",
                "error"
            );

            return false;
        }
    }


    /* =====================================================
       OBTENER VALOR DE INPUT
    ===================================================== */

    function obtenerInputValor(
        elemento
    ) {

        if (!elemento) {
            return "";
        }

        return String(
            elemento.value || ""
        ).trim();
    }


    /* =====================================================
       VALIDACIÓN
    ===================================================== */

    function validarFormulario() {

        let valido = true;


        const campos = [

            titleInput,

            categoryInput,

            descriptionInput,

            priceInput

        ];


        campos.forEach(
            campo => {

                if (!campo) {
                    return;
                }

                campo.classList.remove(
                    "error"
                );

            }
        );


        const titulo =
            obtenerInputValor(
                titleInput
            );

        const categoria =
            obtenerInputValor(
                categoryInput
            );

        const descripcion =
            obtenerInputValor(
                descriptionInput
            );

        const precioTexto =
            obtenerInputValor(
                priceInput
            );


        if (!titulo) {

            marcarError(
                titleInput
            );

            valido = false;
        }


        if (!categoria) {

            marcarError(
                categoryInput
            );

            valido = false;
        }


        if (!descripcion) {

            marcarError(
                descriptionInput
            );

            valido = false;
        }


        const precio =
            Number(
                precioTexto
            );


        if (
            !precioTexto ||
            Number.isNaN(precio) ||
            precio < 0
        ) {

            marcarError(
                priceInput
            );

            valido = false;
        }


        if (!valido) {

            mostrarToast(
                "Formulario incompleto",
                "Completa correctamente los campos requeridos.",
                "error"
            );
        }


        return valido;
    }


    function marcarError(
        elemento
    ) {

        if (!elemento) {
            return;
        }

        elemento.classList.add(
            "error"
        );

        elemento.focus();
    }


    /* =====================================================
       CREAR SERVICIO
    ===================================================== */

    function crearServicio() {

        const servicios =
            obtenerServicios();


        const titulo =
            obtenerInputValor(
                titleInput
            );

        const categoria =
            obtenerInputValor(
                categoryInput
            )
                .toLowerCase();


        const descripcion =
            obtenerInputValor(
                descriptionInput
            );


        const precio =
            Number(
                obtenerInputValor(
                    priceInput
                )
            );


        const unidad =
            obtenerInputValor(
                unitInput
            ) ||
            "servicio";


        const ubicacion =
            obtenerInputValor(
                locationInput
            ) ||
            "Nicaragua";


        const proveedor =
            obtenerInputValor(
                providerInput
            ) ||
            nombreUsuario;


        const destacado =
            featuredInput
                ? (
                    featuredInput.type ===
                    "checkbox"
                        ? featuredInput.checked
                        : (
                            obtenerInputValor(
                                featuredInput
                            ) === "true"
                        )
                )
                : false;


        const nuevoServicio = {

            id:
                generarIdServicio(
                    servicios
                ),

            titulo:
                titulo,

            descripcion:
                descripcion,

            categoria:
                categoria,

            categoriaNombre:
                obtenerNombreCategoria(
                    categoria
                ),

            precio:
                precio,

            unidad:
                unidad,

            proveedor:
                proveedor,

            proveedorId:
                usuarioId,

            proveedorCorreo:
                correoUsuario,

            usuarioId:
                usuarioId,

            ubicacion:
                ubicacion,

            location:
                ubicacion,

            rating:
                0,

            opiniones:
                0,

            reviews:
                0,

            fecha:
                new Date()
                    .toISOString(),

            date:
                new Date()
                    .toISOString(),

            destacado:
                destacado,

            estado:
                "activo",

            status:
                "activo"

        };


        servicios.push(
            nuevoServicio
        );


        const guardado =
            guardarServicios(
                servicios
            );


        if (!guardado) {
            return null;
        }


        return nuevoServicio;
    }


    /* =====================================================
       NOTIFICACIONES
    ===================================================== */

    function agregarNotificacion(
        servicio
    ) {

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
                    Array.isArray(
                        parsed
                    )
                ) {

                    notificaciones =
                        parsed;
                }
            }

        } catch (error) {

            console.error(
                "Error leyendo notificaciones:",
                error
            );
        }


        notificaciones.unshift({

            id:
                `NOT-${Date.now()}`,

            tipo:
                "success",

            titulo:
                "Servicio publicado",

            mensaje:
                `"${servicio.titulo}" fue publicado correctamente.`,

            fecha:
                new Date()
                    .toISOString(),

            leida:
                false

        });


        /*
         * Conservamos únicamente
         * las últimas 50.
         */

        notificaciones =
            notificaciones.slice(
                0,
                50
            );


        try {

            localStorage.setItem(
                NOTIFICATIONS_KEY,
                JSON.stringify(
                    notificaciones
                )
            );

        } catch (error) {

            console.error(
                "Error guardando notificación:",
                error
            );
        }
    }


    /* =====================================================
       LIMPIAR FORMULARIO
    ===================================================== */

    function limpiarFormulario() {

        if (!form) {
            return;
        }


        form.reset();


        form
            .querySelectorAll(
                ".error"
            )
            .forEach(
                elemento =>
                    elemento.classList.remove(
                        "error"
                    )
            );

    }


    /* =====================================================
       TOAST
    ===================================================== */

    const toast =
        document.getElementById(
            "toast"
        );

    const toastTitle =
        document.getElementById(
            "toastTitle"
        );

    const toastMessage =
        document.getElementById(
            "toastMessage"
        );

    const toastIcon =
        document.getElementById(
            "toastIcon"
        );


    let toastTimeout;


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


    /* =====================================================
       PUBLICAR
    ===================================================== */

    function publicarServicio(
        event
    ) {

        if (event) {
            event.preventDefault();
        }


        if (!validarFormulario()) {
            return;
        }


        if (
            publishButton
        ) {

            publishButton.disabled =
                true;

            publishButton.classList.add(
                "loading"
            );
        }


        const servicio =
            crearServicio();


        if (!servicio) {

            if (
                publishButton
            ) {

                publishButton.disabled =
                    false;

                publishButton.classList.remove(
                    "loading"
                );
            }

            return;
        }


        agregarNotificacion(
            servicio
        );


        mostrarToast(
            "Servicio publicado",
            "Tu servicio se publicó correctamente.",
            "success"
        );


        limpiarFormulario();


        if (
            publishButton
        ) {

            publishButton.disabled =
                false;

            publishButton.classList.remove(
                "loading"
            );
        }


        /*
         * Después de publicar,
         * regresamos a Mis Servicios.
         */

        setTimeout(
            () => {

                window.location.href =
                    "mis-servicios.html";

            },
            900
        );
    }


    /* =====================================================
       EVENTO FORMULARIO
    ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            publicarServicio
        );

    } else if (
        publishButton
    ) {

        publishButton.addEventListener(
            "click",
            publicarServicio
        );

    }


    /* =====================================================
       SIDEBAR
    ===================================================== */

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const sidebarOverlay =
        document.getElementById(
            "sidebarOverlay"
        );

    const menuButton =
        document.getElementById(
            "menuButton"
        );

    const sidebarClose =
        document.getElementById(
            "sidebarClose"
        );


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
       NOTIFICACIONES
    ===================================================== */

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );

    const notificationPanel =
        document.getElementById(
            "notificationPanel"
        );

    const closeNotifications =
        document.getElementById(
            "closeNotifications"
        );


    notificationButton?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            notificationPanel?.classList.toggle(
                "active"
            );
        }
    );


    closeNotifications?.addEventListener(
        "click",
        () => {

            notificationPanel?.classList.remove(
                "active"
            );
        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !notificationPanel ||
                !notificationButton
            ) {
                return;
            }


            if (
                !notificationPanel.contains(
                    event.target
                ) &&
                !notificationButton.contains(
                    event.target
                )
            ) {

                notificationPanel.classList.remove(
                    "active"
                );
            }

        }
    );


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );

    const logoutModal =
        document.getElementById(
            "logoutModal"
        );

    const logoutModalOverlay =
        document.getElementById(
            "logoutModalOverlay"
        );

    const cancelLogout =
        document.getElementById(
            "cancelLogout"
        );

    const confirmLogout =
        document.getElementById(
            "confirmLogout"
        );


    function abrirLogout() {

        logoutModal?.classList.add(
            "active"
        );
    }


    function cerrarLogout() {

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


        cerrarLogout();


        window.location.href =
            "login.html";
    }


    logoutButton?.addEventListener(
        "click",
        abrirLogout
    );


    cancelLogout?.addEventListener(
        "click",
        cerrarLogout
    );


    logoutModalOverlay?.addEventListener(
        "click",
        cerrarLogout
    );


    confirmLogout?.addEventListener(
        "click",
        cerrarSesion
    );


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


            notificationPanel?.classList.remove(
                "active"
            );


            cerrarLogout();
        }
    );


    /* =====================================================
       EXPONER API
    ===================================================== */

    window.ZentryXPublicar = {

        obtenerSesion,

        obtenerUsuario,

        obtenerServicios,

        guardarServicios,

        crearServicio,

        publicarServicio,

        cargarUsuarioEnInterfaz

    };

});