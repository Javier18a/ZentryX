/* =========================================================
   ZENTRYX - DETALLE DEL SERVICIO
   servicio-detalle.js
========================================================= */

const SESSION_KEY = "zentryx_sesion";
const SERVICES_KEY = "zentryx_servicios";
const REQUESTS_KEY = "zentryxSolicitudes";
const NOTIFICATIONS_KEY = "zentryx_notificaciones";
const FAVORITES_KEY = "zentryx_favoritos";
const SELECTED_SERVICE_KEY = "zentryx_servicio_seleccionado";
const MESSAGES_KEY = "zentryx_mensajes";

let servicioActual = null;
let toastTimeout = null;


/* =========================================================
   INICIO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (!verificarSesion()) {
        return;
    }

    cargarUsuario();
    inicializarSidebar();
    inicializarLogout();
    inicializarNotificaciones();
    inicializarDetalle();
    inicializarModales();
    inicializarTeclado();
    inicializarResponsive();

});


/* =========================================================
   SESIÓN
========================================================= */

function obtenerSesion() {

    const local = localStorage.getItem(SESSION_KEY);
    const temporal = sessionStorage.getItem(SESSION_KEY);

    const datos = local || temporal;

    if (!datos) {
        return null;
    }

    try {

        const sesion = JSON.parse(datos);

        if (!sesion || typeof sesion !== "object") {
            return null;
        }

        return sesion;

    } catch (error) {

        console.error("Error leyendo sesión:", error);

        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);

        return null;
    }
}


function verificarSesion() {

    const sesion = obtenerSesion();

    if (!sesion) {

        window.location.href = "login.html";

        return false;
    }

    return true;
}


/* =========================================================
   USUARIO
========================================================= */

function obtenerUsuarioSesion() {

    const sesion = obtenerSesion();

    if (!sesion) {
        return null;
    }

    if (
        sesion.usuario &&
        typeof sesion.usuario === "object"
    ) {
        return sesion.usuario;
    }

    if (
        sesion.user &&
        typeof sesion.user === "object"
    ) {
        return sesion.user;
    }

    return sesion;
}


function cargarUsuario() {

    const usuario = obtenerUsuarioSesion();

    if (!usuario) {
        return;
    }

    const nombre = obtenerValor(usuario, [
        "nombre",
        "Nombre",
        "Nombre_Usuario",
        "nombreUsuario",
        "firstName",
        "name",
        "usuario"
    ]);

    const apellido = obtenerValor(usuario, [
        "apellido",
        "Apellido",
        "Apellido_Usuario",
        "apellidoUsuario",
        "lastName"
    ]);

    const nombreCompleto =
        `${nombre || ""} ${apellido || ""}`.trim();

    const nombreMostrar =
        nombreCompleto ||
        nombre ||
        "Usuario";

    const correo = obtenerValor(usuario, [
        "correo",
        "Correo",
        "email",
        "Email",
        "Correo_Usuario",
        "correoUsuario"
    ]) || "Sin correo";

    const rol = obtenerValor(usuario, [
        "rol",
        "Rol",
        "role",
        "tipoUsuario",
        "tipo",
        "Nivel_Acceso"
    ]) || "Usuario";

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

    const inicial = obtenerInicial(nombreMostrar);

    establecerTexto(
        "profileAvatar",
        inicial
    );

    establecerTexto(
        "topbarAvatar",
        inicial
    );
}


function obtenerUsuarioActual() {

    const usuario = obtenerUsuarioSesion();

    if (!usuario) {

        return {
            id: null,
            nombre: "Usuario",
            correo: "Sin correo",
            rol: "Usuario"
        };
    }

    const nombre = obtenerValor(usuario, [
        "nombre",
        "Nombre",
        "Nombre_Usuario",
        "nombreUsuario",
        "firstName",
        "name",
        "usuario"
    ]);

    const apellido = obtenerValor(usuario, [
        "apellido",
        "Apellido",
        "Apellido_Usuario",
        "apellidoUsuario",
        "lastName"
    ]);

    const nombreCompleto =
        `${nombre || ""} ${apellido || ""}`.trim();

    const correo = obtenerValor(usuario, [
        "correo",
        "Correo",
        "email",
        "Email",
        "Correo_Usuario",
        "correoUsuario"
    ]) || "Sin correo";

    const rol = obtenerValor(usuario, [
        "rol",
        "Rol",
        "role",
        "tipoUsuario",
        "tipo",
        "Nivel_Acceso"
    ]) || "Usuario";

    const id = obtenerValor(usuario, [
        "id",
        "Id",
        "ID",
        "usuarioId",
        "usuario_id",
        "idUsuario"
    ]);

    return {
        id: id || null,
        nombre:
            nombreCompleto ||
            nombre ||
            "Usuario",
        correo,
        rol
    };
}


/* =========================================================
   UTILIDADES DOM
========================================================= */

function obtenerValor(objeto, propiedades) {

    if (!objeto || typeof objeto !== "object") {
        return "";
    }

    for (const propiedad of propiedades) {

        if (
            objeto[propiedad] !== undefined &&
            objeto[propiedad] !== null &&
            String(objeto[propiedad]).trim() !== ""
        ) {
            return objeto[propiedad];
        }
    }

    return "";
}


function establecerTexto(id, texto) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.textContent =
        texto !== undefined &&
        texto !== null
            ? texto
            : "";
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
   DETALLE DEL SERVICIO
========================================================= */

function inicializarDetalle() {

    const id = obtenerIdServicio();

    if (!id) {

        mostrarServicioNoEncontrado();

        return;
    }

    const servicio = buscarServicio(id);

    if (!servicio) {

        mostrarServicioNoEncontrado();

        return;
    }

    servicioActual = servicio;

    mostrarServicio(servicio);

    inicializarBotonSolicitud();
    inicializarBotonContacto();
}


function obtenerIdServicio() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const idURL = parametros.get("id");

    if (idURL) {
        return idURL;
    }

    try {

        const guardado =
            sessionStorage.getItem(
                SELECTED_SERVICE_KEY
            );

        if (!guardado) {
            return null;
        }

        const servicio =
            JSON.parse(guardado);

        if (!servicio) {
            return null;
        }

        const id =
            obtenerValor(servicio, [
                "id",
                "Id",
                "ID",
                "servicioId",
                "serviceId"
            ]);

        return id
            ? String(id)
            : null;

    } catch (error) {

        console.error(
            "Error leyendo servicio seleccionado:",
            error
        );

        return null;
    }
}


/* =========================================================
   BUSCAR SERVICIO
========================================================= */

function buscarServicio(id) {

    const claves = [
        SERVICES_KEY,
        "zentryxServicios",
        "servicios"
    ];

    for (const clave of claves) {

        try {

            const datos =
                localStorage.getItem(clave);

            if (!datos) {
                continue;
            }

            const servicios =
                JSON.parse(datos);

            if (!Array.isArray(servicios)) {
                continue;
            }

            const encontrado =
                servicios.find(servicio => {

                    const servicioId =
                        obtenerValor(servicio, [
                            "id",
                            "Id",
                            "ID",
                            "servicioId",
                            "serviceId"
                        ]);

                    return String(servicioId) ===
                        String(id);
                });

            if (encontrado) {

                return normalizarServicio(
                    encontrado
                );
            }

        } catch (error) {

            console.error(
                `Error buscando servicios en ${clave}:`,
                error
            );
        }
    }


    /* -----------------------------------------------------
       RESPALDO: SERVICIO SELECCIONADO
    ----------------------------------------------------- */

    try {

        const guardado =
            sessionStorage.getItem(
                SELECTED_SERVICE_KEY
            );

        if (guardado) {

            const servicio =
                JSON.parse(guardado);

            const servicioId =
                obtenerValor(servicio, [
                    "id",
                    "Id",
                    "ID",
                    "servicioId",
                    "serviceId"
                ]);

            if (
                servicio &&
                String(servicioId) === String(id)
            ) {

                return normalizarServicio(
                    servicio
                );
            }
        }

    } catch (error) {

        console.error(
            "Error recuperando servicio seleccionado:",
            error
        );
    }

    return null;
}


/* =========================================================
   NORMALIZAR SERVICIO
========================================================= */

function normalizarServicio(servicio) {

    const proveedorOriginal =
        servicio.proveedor ||
        servicio.provider ||
        servicio.usuario ||
        servicio.user ||
        servicio.proveedorNombre ||
        servicio.providerName ||
        "Proveedor";

    let proveedorNombre = "Proveedor";

    let proveedorId = null;

    let proveedorRating = 0;

    let proveedorUbicacion = "Managua";


    if (
        proveedorOriginal &&
        typeof proveedorOriginal === "object"
    ) {

        proveedorNombre =
            obtenerValor(
                proveedorOriginal,
                [
                    "nombreCompleto",
                    "nombre",
                    "Nombre",
                    "name",
                    "usuario",
                    "username"
                ]
            ) || "Proveedor";

        proveedorId =
            obtenerValor(
                proveedorOriginal,
                [
                    "id",
                    "Id",
                    "ID",
                    "usuarioId",
                    "idUsuario"
                ]
            ) || null;

        proveedorRating =
            Number(
                obtenerValor(
                    proveedorOriginal,
                    [
                        "rating",
                        "valoracion",
                        "calificacion"
                    ]
                ) || 0
            );

        proveedorUbicacion =
            obtenerValor(
                proveedorOriginal,
                [
                    "ubicacion",
                    "location",
                    "ciudad",
                    "municipio"
                ]
            ) || "Managua";

    } else {

        proveedorNombre =
            String(
                proveedorOriginal ||
                "Proveedor"
            );

        proveedorId =
            obtenerValor(
                servicio,
                [
                    "proveedorId",
                    "providerId",
                    "usuarioId",
                    "idUsuario",
                    "idProveedor"
                ]
            ) || null;

        proveedorRating =
            Number(
                obtenerValor(
                    servicio,
                    [
                        "providerRating",
                        "proveedorRating",
                        "ratingProveedor"
                    ]
                ) || 0
            );

        proveedorUbicacion =
            obtenerValor(
                servicio,
                [
                    "proveedorUbicacion",
                    "providerLocation",
                    "ubicacionProveedor"
                ]
            ) || "Managua";
    }


    const categoria =
        obtenerValor(
            servicio,
            [
                "categoria",
                "category",
                "categoriaId",
                "categoryId"
            ]
        ) || "otros";


    const categoriaNombre =
        obtenerValor(
            servicio,
            [
                "categoriaNombre",
                "categoryName",
                "nombreCategoria"
            ]
        ) ||
        getCategoryName(categoria);


    const titulo =
        obtenerValor(
            servicio,
            [
                "titulo",
                "title",
                "nombre",
                "nombreServicio",
                "serviceName"
            ]
        ) ||
        "Servicio";


    const descripcion =
        obtenerValor(
            servicio,
            [
                "descripcion",
                "description",
                "descripcionCompleta",
                "detalle"
            ]
        ) ||
        "Sin descripción disponible.";


    const descripcionCorta =
        obtenerValor(
            servicio,
            [
                "descripcionCorta",
                "shortDescription",
                "resumen",
                "descripcionBreve"
            ]
        ) ||
        crearDescripcionCorta(
            descripcion
        );


    const precio =
        obtenerValor(
            servicio,
            [
                "precio",
                "price",
                "precioInicial",
                "valor"
            ]
        );


    const unidad =
        obtenerValor(
            servicio,
            [
                "unidad",
                "unit",
                "tipoPrecio"
            ]
        ) ||
        "servicio";


    const rating =
        Number(
            obtenerValor(
                servicio,
                [
                    "rating",
                    "valoracion",
                    "calificacion"
                ]
            ) || 0
        );


    const opiniones =
        Number(
            obtenerValor(
                servicio,
                [
                    "opiniones",
                    "reviews",
                    "resenas",
                    "reseñas",
                    "cantidadResenas",
                    "cantidadReseñas"
                ]
            ) || 0
        );


    const fecha =
        obtenerValor(
            servicio,
            [
                "fecha",
                "date",
                "fechaPublicacion",
                "fechaCreacion",
                "createdAt",
                "created_at"
            ]
        ) ||
        null;


    const estado =
        obtenerValor(
            servicio,
            [
                "estado",
                "status"
            ]
        ) ||
        "activo";


    return {

        id:
            obtenerValor(
                servicio,
                [
                    "id",
                    "Id",
                    "ID",
                    "servicioId",
                    "serviceId"
                ]
            ),

        titulo,

        descripcion,

        descripcionCorta,

        categoria,

        categoriaNombre,

        precio:
            precio !== ""
                ? precio
                : 0,

        unidad,

        proveedor:
            proveedorNombre,

        proveedorId,

        proveedorRating,

        proveedorUbicacion,

        rating,

        opiniones,

        fecha,

        estado

    };
}


/* =========================================================
   MOSTRAR SERVICIO
========================================================= */

function mostrarServicio(servicio) {

    const loading =
        document.getElementById(
            "detailLoading"
        );

    const detail =
        document.getElementById(
            "serviceDetail"
        );

    const notFound =
        document.getElementById(
            "serviceNotFound"
        );


    if (loading) {
        loading.hidden = true;
    }

    if (notFound) {
        notFound.hidden = true;
    }

    if (detail) {
        detail.hidden = false;
    }


    /* -----------------------------------------------------
       CATEGORÍA
    ----------------------------------------------------- */

    establecerTexto(
        "serviceCategory",
        servicio.categoriaNombre
    );

    establecerTexto(
        "extraCategory",
        servicio.categoriaNombre
    );


    /* -----------------------------------------------------
       ICONO CATEGORÍA
    ----------------------------------------------------- */

    establecerIconoCategoria(
        servicio.categoria
    );


    /* -----------------------------------------------------
       ESTADO
    ----------------------------------------------------- */

    mostrarEstadoServicio(
        servicio.estado
    );


    /* -----------------------------------------------------
       TÍTULO
    ----------------------------------------------------- */

    establecerTexto(
        "serviceTitle",
        servicio.titulo
    );


    /* -----------------------------------------------------
       DESCRIPCIÓN CORTA
    ----------------------------------------------------- */

    establecerTexto(
        "serviceShortDescription",
        servicio.descripcionCorta
    );


    /* -----------------------------------------------------
       DESCRIPCIÓN COMPLETA
    ----------------------------------------------------- */

    establecerTexto(
        "serviceDescription",
        servicio.descripcion
    );


    /* -----------------------------------------------------
       VALORACIÓN
    ----------------------------------------------------- */

    establecerTexto(
        "serviceRating",
        Number(
            servicio.rating || 0
        ).toFixed(1)
    );


    /* -----------------------------------------------------
       RESEÑAS
    ----------------------------------------------------- */

    establecerTexto(
        "serviceReviews",
        servicio.opiniones || 0
    );


    /* -----------------------------------------------------
       UBICACIÓN
    ----------------------------------------------------- */

    const ubicacionServicio =
        obtenerValor(
            servicio,
            [
                "ubicacion",
                "location"
            ]
        ) ||
        servicio.proveedorUbicacion ||
        "Managua";

    establecerTexto(
        "serviceLocation",
        ubicacionServicio
    );


    /* -----------------------------------------------------
       FECHA
    ----------------------------------------------------- */

    establecerTexto(
        "serviceDate",
        formatearFecha(
            servicio.fecha
        )
    );

    establecerTexto(
        "extraDate",
        formatearFecha(
            servicio.fecha
        )
    );


    /* -----------------------------------------------------
       PRECIO
    ----------------------------------------------------- */

    establecerTexto(
        "servicePrice",
        `$${formatearPrecio(
            servicio.precio
        )}`
    );


    /* -----------------------------------------------------
       PROVEEDOR
    ----------------------------------------------------- */

    establecerTexto(
        "providerName",
        servicio.proveedor
    );

    establecerTexto(
        "providerRole",
        "Proveedor de servicios"
    );

    establecerTexto(
        "providerRating",
        Number(
            servicio.proveedorRating ||
            servicio.rating ||
            0
        ).toFixed(1)
    );

    establecerTexto(
        "providerLocation",
        servicio.proveedorUbicacion ||
        ubicacionServicio ||
        "Managua"
    );


    /* -----------------------------------------------------
       AVATAR PROVEEDOR
    ----------------------------------------------------- */

    establecerTexto(
        "providerAvatar",
        obtenerInicial(
            servicio.proveedor
        )
    );


    /* -----------------------------------------------------
       MODAL DE SOLICITUD
    ----------------------------------------------------- */

    const requestMessage =
        document.getElementById(
            "requestModalMessage"
        );

    if (requestMessage) {

        requestMessage.textContent =
            `Estás a punto de enviar una solicitud para "${servicio.titulo}" al proveedor ${servicio.proveedor}.`;
    }
}


/* =========================================================
   ESTADO DEL SERVICIO
========================================================= */

function mostrarEstadoServicio(estado) {

    const estadoNormalizado =
        String(
            estado || "activo"
        )
        .toLowerCase()
        .trim();


    let activo = true;

    let texto = "Activo";

    let icono = "fa-circle-check";


    if (
        estadoNormalizado === "inactivo" ||
        estadoNormalizado === "inactive" ||
        estadoNormalizado === "cerrado" ||
        estadoNormalizado === "cancelado" ||
        estadoNormalizado === "agotado"
    ) {

        activo = false;

        texto =
            capitalizar(
                estadoNormalizado
            );

        icono =
            "fa-circle-xmark";
    }


    if (
        estadoNormalizado === "pendiente"
    ) {

        activo = false;

        texto = "Pendiente";

        icono =
            "fa-clock";
    }


    establecerTexto(
        "serviceStatusText",
        texto
    );

    establecerTexto(
        "extraStatus",
        texto
    );


    const status =
        document.getElementById(
            "serviceStatus"
        );

    const icon =
        document.getElementById(
            "serviceStatusIcon"
        );


    if (status) {

        status.classList.toggle(
            "inactive",
            !activo
        );
    }


    if (icon) {

        icon.className =
            `fa-solid ${icono}`;
    }
}


/* =========================================================
   ICONO DE CATEGORÍA
========================================================= */

function establecerIconoCategoria(
    categoria
) {

    const icon =
        document.getElementById(
            "serviceCategoryIcon"
        );

    if (!icon) {
        return;
    }


    const categoriaNormalizada =
        String(
            categoria || ""
        )
        .toLowerCase()
        .trim();


    const iconos = {

        tecnologia:
            "fa-solid fa-code",

        tecnologia_web:
            "fa-solid fa-laptop-code",

        diseno:
            "fa-solid fa-pen-nib",

        diseño:
            "fa-solid fa-pen-nib",

        marketing:
            "fa-solid fa-bullhorn",

        educacion:
            "fa-solid fa-graduation-cap",

        educación:
            "fa-solid fa-graduation-cap",

        hogar:
            "fa-solid fa-house",

        negocios:
            "fa-solid fa-briefcase",

        otros:
            "fa-solid fa-layer-group"
    };


    icon.className =
        iconos[categoriaNormalizada] ||
        "fa-solid fa-layer-group";
}


/* =========================================================
   CATEGORÍAS
========================================================= */

function getCategoryName(categoria) {

    const categorias = {

        tecnologia:
            "Tecnología",

        tecnologia_web:
            "Tecnología",

        diseno:
            "Diseño",

        diseño:
            "Diseño",

        educacion:
            "Educación",

        educación:
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


    const clave =
        String(
            categoria || ""
        )
        .toLowerCase()
        .trim();


    return categorias[clave] ||
        "Otros";
}


/* =========================================================
   SERVICIO NO ENCONTRADO
========================================================= */

function mostrarServicioNoEncontrado() {

    const loading =
        document.getElementById(
            "detailLoading"
        );

    const detail =
        document.getElementById(
            "serviceDetail"
        );

    const notFound =
        document.getElementById(
            "serviceNotFound"
        );


    if (loading) {
        loading.hidden = true;
    }

    if (detail) {
        detail.hidden = true;
    }

    if (notFound) {
        notFound.hidden = false;
    }
}


/* =========================================================
   SOLICITAR SERVICIO
========================================================= */

function inicializarBotonSolicitud() {

    const button =
        document.getElementById(
            "requestServiceButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        abrirModalSolicitud
    );
}


function abrirModalSolicitud() {

    if (!servicioActual) {
        return;
    }


    const sesion =
        obtenerSesion();

    if (!sesion) {

        window.location.href =
            "login.html";

        return;
    }


    const modal =
        document.getElementById(
            "requestModal"
        );

    if (!modal) {
        return;
    }


    const mensaje =
        document.getElementById(
            "requestModalMessage"
        );


    if (mensaje) {

        mensaje.textContent =
            `Estás a punto de enviar una solicitud para "${servicioActual.titulo}" al proveedor ${servicioActual.proveedor}.`;
    }


    modal.hidden = false;

    document.body.classList.add(
        "modal-open"
    );
}


function cerrarModalSolicitud() {

    const modal =
        document.getElementById(
            "requestModal"
        );

    if (modal) {
        modal.hidden = true;
    }

    actualizarEstadoBodyModal();
}


function enviarSolicitud() {

    if (!servicioActual) {
        return;
    }


    const usuario =
        obtenerUsuarioActual();


    let solicitudes =
        obtenerArrayLocalStorage(
            REQUESTS_KEY
        );


    const solicitudExistente =
        solicitudes.some(
            solicitud => {

                const servicioId =
                    solicitud.servicioId ||
                    solicitud.serviceId;

                const usuarioId =
                    solicitud.usuarioId ||
                    solicitud.userId;

                if (
                    usuario.id &&
                    usuarioId
                ) {

                    return (
                        String(servicioId) ===
                        String(servicioActual.id) &&
                        String(usuarioId) ===
                        String(usuario.id)
                    );
                }

                return (
                    String(servicioId) ===
                    String(servicioActual.id) &&
                    String(
                        solicitud.usuarioEmail ||
                        solicitud.correo ||
                        ""
                    ).toLowerCase() ===
                    String(
                        usuario.correo ||
                        ""
                    ).toLowerCase()
                );
            }
        );


    if (solicitudExistente) {

        cerrarModalSolicitud();

        mostrarToast(
            "Solicitud existente",
            "Ya tienes una solicitud para este servicio."
        );

        return;
    }


    const nuevaSolicitud = {

        id:
            generarIdSolicitud(),

        servicioId:
            servicioActual.id,

        servicio:
            servicioActual.titulo,

        tituloServicio:
            servicioActual.titulo,

        proveedor:
            servicioActual.proveedor,

        proveedorId:
            servicioActual.proveedorId,

        precio:
            Number(
                servicioActual.precio
            ) || 0,

        unidad:
            servicioActual.unidad,

        usuario:
            usuario.nombre,

        usuarioId:
            usuario.id,

        usuarioEmail:
            usuario.correo,

        estado:
            "pendiente",

        fecha:
            new Date().toISOString()
    };


    solicitudes.push(
        nuevaSolicitud
    );


    const guardado =
        guardarArrayLocalStorage(
            REQUESTS_KEY,
            solicitudes
        );


    if (!guardado) {

        mostrarToast(
            "Error",
            "No fue posible guardar la solicitud."
        );

        return;
    }


    crearNotificacionSolicitud(
        nuevaSolicitud
    );


    cerrarModalSolicitud();


    mostrarToast(
        "Solicitud enviada",
        "Tu solicitud fue registrada correctamente."
    );
}


function generarIdSolicitud() {

    return `SOL-${Date.now()}-${Math.floor(
        Math.random() * 10000
    )}`;
}


/* =========================================================
   CONTACTAR PROVEEDOR
========================================================= */

function inicializarBotonContacto() {

    const button =
        document.getElementById(
            "contactProviderButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        abrirModalContacto
    );
}


function abrirModalContacto() {

    if (!servicioActual) {
        return;
    }


    const sesion =
        obtenerSesion();

    if (!sesion) {

        window.location.href =
            "login.html";

        return;
    }


    const modal =
        document.getElementById(
            "contactModal"
        );

    if (!modal) {
        return;
    }


    const mensaje =
        document.getElementById(
            "contactModalMessage"
        );


    if (mensaje) {

        mensaje.textContent =
            `Puedes enviar un mensaje a ${servicioActual.proveedor} sobre el servicio "${servicioActual.titulo}".`;
    }


    const textarea =
        document.getElementById(
            "contactMessage"
        );


    if (textarea) {
        textarea.value = "";
    }


    modal.hidden = false;

    document.body.classList.add(
        "modal-open"
    );


    setTimeout(() => {

        textarea?.focus();

    }, 100);
}


function cerrarModalContacto() {

    const modal =
        document.getElementById(
            "contactModal"
        );

    if (modal) {
        modal.hidden = true;
    }

    actualizarEstadoBodyModal();
}


function enviarMensajeProveedor() {

    if (!servicioActual) {
        return;
    }


    const textarea =
        document.getElementById(
            "contactMessage"
        );


    const mensaje =
        textarea?.value.trim() || "";


    if (!mensaje) {

        mostrarToast(
            "Mensaje vacío",
            "Escribe un mensaje antes de enviarlo."
        );

        textarea?.focus();

        return;
    }


    const usuario =
        obtenerUsuarioActual();


    let mensajes =
        obtenerArrayLocalStorage(
            MESSAGES_KEY
        );


    const nuevoMensaje = {

        id:
            `MSG-${Date.now()}-${Math.floor(
                Math.random() * 10000
            )}`,

        servicioId:
            servicioActual.id,

        servicio:
            servicioActual.titulo,

        proveedor:
            servicioActual.proveedor,

        proveedorId:
            servicioActual.proveedorId,

        remitente:
            usuario.nombre,

        remitenteId:
            usuario.id,

        remitenteEmail:
            usuario.correo,

        mensaje,

        fecha:
            new Date().toISOString(),

        leido:
            false
    };


    mensajes.push(
        nuevoMensaje
    );


    const guardado =
        guardarArrayLocalStorage(
            MESSAGES_KEY,
            mensajes
        );


    if (!guardado) {

        mostrarToast(
            "Error",
            "No fue posible guardar el mensaje."
        );

        return;
    }


    crearNotificacionMensaje(
        nuevoMensaje
    );


    cerrarModalContacto();


    mostrarToast(
        "Mensaje enviado",
        "Tu mensaje fue enviado correctamente."
    );
}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function inicializarNotificaciones() {

    const button =
        document.getElementById(
            "notificationButton"
        );

    const panel =
        document.getElementById(
            "notificationPanel"
        );

    const close =
        document.getElementById(
            "closeNotifications"
        );


    cargarNotificaciones();


    button?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            panel?.classList.toggle(
                "active"
            );
        }
    );


    close?.addEventListener(
        "click",
        cerrarNotificaciones
    );


    document.addEventListener(
        "click",
        event => {

            if (!panel || !button) {
                return;
            }

            if (
                !panel.contains(event.target) &&
                !button.contains(event.target)
            ) {

                panel.classList.remove(
                    "active"
                );
            }
        }
    );
}


function cargarNotificaciones() {

    const list =
        document.getElementById(
            "notificationList"
        );

    const dot =
        document.getElementById(
            "notificationDot"
        );


    if (!list) {
        return;
    }


    const notificaciones =
        obtenerArrayLocalStorage(
            NOTIFICATIONS_KEY
        );


    list.innerHTML = "";


    const noLeidas =
        notificaciones.filter(
            item => !item.leida
        );


    if (dot) {

        dot.classList.toggle(
            "active",
            noLeidas.length > 0
        );
    }


    if (!notificaciones.length) {

        list.innerHTML = `

            <div class="notification-empty">

                <div>
                    <i class="fa-regular fa-bell"></i>
                </div>

                <p>
                    No tienes notificaciones nuevas.
                </p>

            </div>

        `;

        return;
    }


    notificaciones
        .slice(0, 10)
        .forEach(notificacion => {

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

                    guardarArrayLocalStorage(
                        NOTIFICATIONS_KEY,
                        notificaciones
                    );

                    cargarNotificaciones();
                }
            );


            list.appendChild(item);

        });
}


function crearNotificacionSolicitud(
    solicitud
) {

    const notificaciones =
        obtenerArrayLocalStorage(
            NOTIFICATIONS_KEY
        );


    notificaciones.unshift({

        id:
            `NOT-${Date.now()}`,

        tipo:
            "success",

        titulo:
            "Solicitud enviada",

        mensaje:
            `Tu solicitud para "${solicitud.servicio}" fue registrada correctamente.`,

        fecha:
            new Date().toISOString(),

        leida:
            false
    });


    guardarArrayLocalStorage(
        NOTIFICATIONS_KEY,
        notificaciones
    );


    cargarNotificaciones();
}


function crearNotificacionMensaje(
    mensaje
) {

    const notificaciones =
        obtenerArrayLocalStorage(
            NOTIFICATIONS_KEY
        );


    notificaciones.unshift({

        id:
            `NOT-${Date.now()}`,

        tipo:
            "system",

        titulo:
            "Mensaje enviado",

        mensaje:
            `Tu mensaje fue enviado al proveedor ${mensaje.proveedor}.`,

        fecha:
            new Date().toISOString(),

        leida:
            false
    });


    guardarArrayLocalStorage(
        NOTIFICATIONS_KEY,
        notificaciones
    );


    cargarNotificaciones();
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

        case "warning":

            return `
                <i class="fa-solid fa-triangle-exclamation"></i>
            `;

        case "security":

            return `
                <i class="fa-solid fa-shield-halved"></i>
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


function cerrarNotificaciones() {

    document
        .getElementById(
            "notificationPanel"
        )
        ?.classList.remove(
            "active"
        );
}


/* =========================================================
   SIDEBAR
========================================================= */

function inicializarSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );

    const menuButton =
        document.getElementById(
            "menuButton"
        );

    const closeButton =
        document.getElementById(
            "sidebarClose"
        );


    menuButton?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            sidebar?.classList.add(
                "open"
            );

            overlay?.classList.add(
                "active"
            );
        }
    );


    closeButton?.addEventListener(
        "click",
        cerrarSidebar
    );


    overlay?.addEventListener(
        "click",
        cerrarSidebar
    );


    document
        .querySelectorAll(
            ".sidebar .nav-item"
        )
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 800
                    ) {

                        cerrarSidebar();
                    }
                }
            );

        });
}


function cerrarSidebar() {

    document
        .getElementById(
            "sidebar"
        )
        ?.classList.remove(
            "open"
        );


    document
        .getElementById(
            "sidebarOverlay"
        )
        ?.classList.remove(
            "active"
        );
}


/* =========================================================
   LOGOUT
========================================================= */

function inicializarLogout() {

    const button =
        document.getElementById(
            "logoutButton"
        );

    const modal =
        document.getElementById(
            "logoutModal"
        );

    const overlay =
        document.getElementById(
            "logoutModalOverlay"
        );

    const cancel =
        document.getElementById(
            "cancelLogout"
        );

    const confirm =
        document.getElementById(
            "confirmLogout"
        );


    button?.addEventListener(
        "click",
        () => {

            if (modal) {

                modal.hidden = false;

                document.body.classList.add(
                    "modal-open"
                );
            }
        }
    );


    cancel?.addEventListener(
        "click",
        cerrarLogout
    );


    overlay?.addEventListener(
        "click",
        cerrarLogout
    );


    confirm?.addEventListener(
        "click",
        cerrarSesion
    );
}


function cerrarLogout() {

    const modal =
        document.getElementById(
            "logoutModal"
        );

    if (modal) {
        modal.hidden = true;
    }

    actualizarEstadoBodyModal();
}


function cerrarSesion() {

    localStorage.removeItem(
        SESSION_KEY
    );

    sessionStorage.removeItem(
        SESSION_KEY
    );

    window.location.href =
        "login.html";
}


/* =========================================================
   MODALES
========================================================= */

function inicializarModales() {

    /* -----------------------------------------------------
       SOLICITUD
    ----------------------------------------------------- */

    const requestOverlay =
        document.getElementById(
            "requestModalOverlay"
        );

    const cancelRequest =
        document.getElementById(
            "cancelRequest"
        );

    const confirmRequest =
        document.getElementById(
            "confirmRequest"
        );


    requestOverlay?.addEventListener(
        "click",
        cerrarModalSolicitud
    );


    cancelRequest?.addEventListener(
        "click",
        cerrarModalSolicitud
    );


    confirmRequest?.addEventListener(
        "click",
        enviarSolicitud
    );


    /* -----------------------------------------------------
       CONTACTO
    ----------------------------------------------------- */

    const contactOverlay =
        document.getElementById(
            "contactModalOverlay"
        );

    const cancelContact =
        document.getElementById(
            "cancelContact"
        );

    const sendContact =
        document.getElementById(
            "sendContact"
        );


    contactOverlay?.addEventListener(
        "click",
        cerrarModalContacto
    );


    cancelContact?.addEventListener(
        "click",
        cerrarModalContacto
    );


    sendContact?.addEventListener(
        "click",
        enviarMensajeProveedor
    );
}


/* =========================================================
   BODY MODAL
========================================================= */

function actualizarEstadoBodyModal() {

    const modales =
        document.querySelectorAll(
            ".modal:not([hidden])"
        );


    document.body.classList.toggle(
        "modal-open",
        modales.length > 0
    );
}


/* =========================================================
   FAVORITOS
========================================================= */

function obtenerFavoritos() {

    return obtenerArrayLocalStorage(
        FAVORITES_KEY
    );
}


function guardarFavoritos(
    favoritos
) {

    return guardarArrayLocalStorage(
        FAVORITES_KEY,
        favoritos
    );
}


function toggleFavorito() {

    if (!servicioActual) {
        return;
    }


    const favoritos =
        obtenerFavoritos();


    const posicion =
        favoritos.findIndex(
            id =>
                String(id) ===
                String(
                    servicioActual.id
                )
        );


    if (posicion === -1) {

        favoritos.push(
            servicioActual.id
        );


        guardarFavoritos(
            favoritos
        );


        mostrarToast(
            "Agregado a favoritos",
            "El servicio se agregó a tus favoritos."
        );

    } else {

        favoritos.splice(
            posicion,
            1
        );


        guardarFavoritos(
            favoritos
        );


        mostrarToast(
            "Eliminado de favoritos",
            "El servicio se eliminó de tus favoritos."
        );
    }
}


/* =========================================================
   FECHAS
========================================================= */

function formatearFecha(fecha) {

    if (!fecha) {
        return "No disponible";
    }


    const fechaObjeto =
        new Date(fecha);


    if (
        Number.isNaN(
            fechaObjeto.getTime()
        )
    ) {

        return "No disponible";
    }


    return fechaObjeto.toLocaleDateString(
        "es-NI",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}


/* =========================================================
   PRECIO
========================================================= */

function formatearPrecio(precio) {

    let numero =
        Number(
            String(
                precio ?? 0
            ).replace(
                /[^0-9.-]/g,
                ""
            )
        );


    if (Number.isNaN(numero)) {
        numero = 0;
    }


    return numero.toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


/* =========================================================
   DESCRIPCIÓN CORTA
========================================================= */

function crearDescripcionCorta(
    descripcion
) {

    if (!descripcion) {
        return "Servicio profesional disponible en ZentryX.";
    }


    const texto =
        String(descripcion)
            .replace(/\s+/g, " ")
            .trim();


    if (texto.length <= 120) {
        return texto;
    }


    return `${texto.substring(0, 117)}...`;
}


/* =========================================================
   CAPITALIZAR
========================================================= */

function capitalizar(texto) {

    if (!texto) {
        return "";
    }


    const valor =
        String(texto)
            .trim();


    return valor.charAt(0).toUpperCase() +
        valor.slice(1);
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


    if (diferencia < 0) {
        return "Ahora";
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


    return dias === 1
        ? "Ayer"
        : `Hace ${dias} días`;
}


/* =========================================================
   STORAGE
========================================================= */

function obtenerArrayLocalStorage(
    clave
) {

    try {

        const datos =
            localStorage.getItem(
                clave
            );

        if (!datos) {
            return [];
        }


        const resultado =
            JSON.parse(datos);


        return Array.isArray(resultado)
            ? resultado
            : [];

    } catch (error) {

        console.error(
            `Error leyendo ${clave}:`,
            error
        );

        return [];
    }
}


function guardarArrayLocalStorage(
    clave,
    datos
) {

    try {

        localStorage.setItem(
            clave,
            JSON.stringify(datos)
        );

        return true;

    } catch (error) {

        console.error(
            `Error guardando ${clave}:`,
            error
        );

        return false;
    }
}


/* =========================================================
   TOAST
========================================================= */

function mostrarToast(
    titulo,
    mensaje
) {

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


    const icon =
        document.getElementById(
            "toastIcon"
        );


    if (icon) {

        icon.innerHTML =
            `<i class="fa-solid fa-circle-check"></i>`;
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


            cerrarSidebar();

            cerrarNotificaciones();

            cerrarModalSolicitud();

            cerrarModalContacto();

            cerrarLogout();

        }
    );
}


/* =========================================================
   RESPONSIVE
========================================================= */

function inicializarResponsive() {

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 800
            ) {

                cerrarSidebar();
            }

        }
    );
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