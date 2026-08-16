/* =========================================================
   ZENTRYX — SOLICITUDES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const REQUESTS_KEY = "zentryxRequests";
    const REQUESTS_KEY_ALT = "zentryx_solicitudes";

    const SESSION_KEY = "zentryx_sesion";
    const ACTIVITY_KEY = "zentryx_actividad";
    const NOTIFICATIONS_KEY = "zentryx_notificaciones";

    const USERS_KEY = "zentryx_usuarios";


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarClose = document.getElementById("sidebarClose");

    const newRequestButton =
        document.getElementById("newRequestButton");

    const requestModal =
        document.getElementById("requestModal");

    const closeRequestModalButton =
        document.getElementById("closeRequestModal");

    const cancelRequest =
        document.getElementById("cancelRequest");

    const requestForm =
        document.getElementById("requestForm");

    const requestSearch =
        document.getElementById("requestSearch");

    const requestsList =
        document.getElementById("requestsList");

    const emptyState =
        document.getElementById("emptyState");

    const filterButtons =
        document.querySelectorAll(".filter-button");

    const detailModal =
        document.getElementById("detailModal");

    const closeDetailModal =
        document.getElementById("closeDetailModal");

    const closeDetailButton =
        document.getElementById("closeDetailButton");

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

    const requestDescription =
        document.getElementById("requestDescription");

    const characterCount =
        document.querySelector(".character-count");

    const requestFile =
        document.getElementById("requestFile");

    const selectedFile =
        document.getElementById("selectedFile");

    const selectedFileName =
        document.getElementById("selectedFileName");

    const removeFile =
        document.getElementById("removeFile");


    /* =====================================================
       VARIABLES
    ===================================================== */

    let currentFilter = "all";
    let requests = [];
    let currentUser = null;


    /* =====================================================
       UTILIDADES DE DATOS
    ===================================================== */

    function parseJSON(value, fallback = null) {

        if (!value) {
            return fallback;
        }

        try {
            return JSON.parse(value);
        } catch (error) {
            return fallback;
        }
    }


    function limpiarTexto(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value).trim();
    }


    function obtenerPrimero(...valores) {

        for (const valor of valores) {

            if (
                valor !== undefined &&
                valor !== null &&
                String(valor).trim() !== ""
            ) {
                return valor;
            }
        }

        return "";
    }


    /* =====================================================
       SESIÓN
    ===================================================== */

    function obtenerSesion() {

        const fuentes = [];

        try {

            const local =
                localStorage.getItem(SESSION_KEY);

            if (local) {
                fuentes.push(local);
            }

        } catch (error) {}


        try {

            const temporal =
                sessionStorage.getItem(SESSION_KEY);

            if (temporal) {
                fuentes.push(temporal);
            }

        } catch (error) {}


        for (const datos of fuentes) {

            const parsed =
                parseJSON(datos, null);

            if (!parsed) {
                continue;
            }

            let sesion = parsed;

            if (
                parsed.data &&
                typeof parsed.data === "object"
            ) {
                sesion = parsed.data;
            }

            if (
                parsed.usuario &&
                typeof parsed.usuario === "object"
            ) {
                sesion = parsed.usuario;
            }

            if (
                parsed.user &&
                typeof parsed.user === "object"
            ) {
                sesion = parsed.user;
            }

            if (
                parsed.usuarioActual &&
                typeof parsed.usuarioActual === "object"
            ) {
                sesion = parsed.usuarioActual;
            }

            if (
                parsed.usuarioLogueado &&
                typeof parsed.usuarioLogueado === "object"
            ) {
                sesion = parsed.usuarioLogueado;
            }

            return sesion;
        }


        return null;
    }


    function normalizarUsuario(sesion) {

        if (!sesion) {
            return null;
        }


        const usuario = {

            id: limpiarTexto(
                obtenerPrimero(
                    sesion.id,
                    sesion.Id,
                    sesion.ID,
                    sesion.Usuario_Id,
                    sesion.usuarioId,
                    sesion.usuario_id,
                    sesion.id_usuario,
                    sesion.idUsuario
                )
            ),

            nombre: limpiarTexto(
                obtenerPrimero(
                    sesion.nombre,
                    sesion.Nombre,
                    sesion.Nombre_Usuario,
                    sesion.nombreUsuario,
                    sesion.firstName,
                    sesion.nombres
                )
            ),

            apellido: limpiarTexto(
                obtenerPrimero(
                    sesion.apellido,
                    sesion.Apellido,
                    sesion.Apellido_Usuario,
                    sesion.apellidoUsuario,
                    sesion.lastName,
                    sesion.apellidos
                )
            ),

            usuario: limpiarTexto(
                obtenerPrimero(
                    sesion.usuario,
                    sesion.username,
                    sesion.Usuario,
                    sesion.userName,
                    sesion.Nombre_Usuario,
                    sesion.nombreUsuario
                )
            ),

            correo: limpiarTexto(
                obtenerPrimero(
                    sesion.correo,
                    sesion.email,
                    sesion.Correo,
                    sesion.Correo_Usuario,
                    sesion.Email,
                    sesion.emailUsuario
                )
            ),

            rol: limpiarTexto(
                obtenerPrimero(
                    sesion.rol,
                    sesion.Rol,
                    sesion.role,
                    sesion.tipoUsuario,
                    sesion.tipo
                )
            ) || "usuario"

        };


        if (
            !usuario.id &&
            !usuario.usuario &&
            !usuario.correo &&
            !usuario.nombre
        ) {
            return null;
        }


        return usuario;
    }


    function obtenerUsuario() {

        const sesion =
            obtenerSesion();

        if (sesion) {

            const usuario =
                normalizarUsuario(sesion);

            if (usuario) {
                return usuario;
            }
        }


        /*
         * Compatibilidad adicional:
         * si la sesión solamente guarda un ID.
         */

        try {

            const usuarioId =
                localStorage.getItem("zentryx_usuario_actual");

            if (usuarioId) {

                const usuarios =
                    parseJSON(
                        localStorage.getItem(USERS_KEY),
                        []
                    );

                if (Array.isArray(usuarios)) {

                    const encontrado =
                        usuarios.find(usuario =>
                            String(
                                usuario.id ||
                                usuario.Usuario_Id ||
                                usuario.usuarioId ||
                                usuario.id_usuario ||
                                ""
                            ) ===
                            String(usuarioId)
                        );

                    if (encontrado) {
                        return normalizarUsuario(
                            encontrado
                        );
                    }
                }
            }

        } catch (error) {}

        return null;
    }


    currentUser =
        obtenerUsuario();


    /* =====================================================
       VERIFICAR SESIÓN
    ===================================================== */

    if (!currentUser) {

        console.warn(
            "ZentryX: no se encontró una sesión activa."
        );

        window.location.href =
            "login.html";

        return;
    }


    /* =====================================================
       DATOS DEL USUARIO
    ===================================================== */

    function obtenerNombreCompleto() {

        const nombre =
            limpiarTexto(
                currentUser.nombre
            );

        const apellido =
            limpiarTexto(
                currentUser.apellido
            );


        const completo =
            `${nombre} ${apellido}`.trim();


        return (
            completo ||
            currentUser.usuario ||
            currentUser.correo ||
            "Usuario"
        );
    }


    function actualizarDatosUsuario() {

        const nombreCompleto =
            obtenerNombreCompleto();

        const nombreCorto =
            currentUser.nombre ||
            currentUser.usuario ||
            "Usuario";


        const elementosNombre =
            document.querySelectorAll(
                "#userName, #userNameSidebar, #profileName, #sidebarUserName, .user-name, .profile-name, .sidebar-user-name"
            );


        elementosNombre.forEach(elemento => {

            elemento.textContent =
                nombreCompleto;
        });


        const elementosNombreCorto =
            document.querySelectorAll(
                "#welcomeName, #userFirstName, .welcome-name, .user-first-name"
            );


        elementosNombreCorto.forEach(elemento => {

            elemento.textContent =
                nombreCorto;
        });


        const elementosCorreo =
            document.querySelectorAll(
                "#userEmail, #profileEmail, #sidebarUserEmail, .user-email, .profile-email"
            );


        elementosCorreo.forEach(elemento => {

            elemento.textContent =
                currentUser.correo ||
                "";
        });


        const elementosUsuario =
            document.querySelectorAll(
                "#username, #profileUsername, .username, .profile-username"
            );


        elementosUsuario.forEach(elemento => {

            elemento.textContent =
                currentUser.usuario ||
                "";
        });


        const elementosRol =
            document.querySelectorAll(
                "#userRole, #profileRole, #sidebarUserRole, .user-role, .profile-role"
            );


        elementosRol.forEach(elemento => {

            elemento.textContent =
                currentUser.rol ||
                "Usuario";
        });


        const iniciales =
            obtenerIniciales();


        document
            .querySelectorAll(
                "#userAvatar, #profileAvatar, .user-avatar, .profile-avatar"
            )
            .forEach(elemento => {

                if (
                    elemento.tagName === "IMG"
                ) {

                    elemento.alt =
                        nombreCompleto;

                } else {

                    elemento.textContent =
                        iniciales;
                }
            });
    }


    function obtenerIniciales() {

        const nombre =
            currentUser.nombre || "";

        const apellido =
            currentUser.apellido || "";

        let iniciales = "";


        if (nombre) {
            iniciales +=
                nombre.charAt(0).toUpperCase();
        }

        if (apellido) {
            iniciales +=
                apellido.charAt(0).toUpperCase();
        }


        if (!iniciales && currentUser.usuario) {

            iniciales =
                currentUser.usuario
                    .substring(0, 2)
                    .toUpperCase();
        }


        if (!iniciales && currentUser.correo) {

            iniciales =
                currentUser.correo
                    .substring(0, 2)
                    .toUpperCase();
        }


        return iniciales || "ZX";
    }


    actualizarDatosUsuario();


    /* =====================================================
       SOLICITUDES DE DEMOSTRACIÓN
    ===================================================== */

    const defaultRequests = [

        {
            id: "ZX-00125",
            userId: "",
            title: "Desarrollo de sitio web",
            description:
                "Desarrollo de plataforma web empresarial para ZentryX.",
            service: "Desarrollo web",
            date: "12 Ago 2026",
            createdAt: "2026-08-12T10:00:00",
            priority: "Alta",
            status: "processing"
        },

        {
            id: "ZX-00124",
            userId: "",
            title: "Diseño de identidad visual",
            description:
                "Creación de identidad visual para una nueva marca.",
            service: "Diseño",
            date: "10 Ago 2026",
            createdAt: "2026-08-10T10:00:00",
            priority: "Media",
            status: "pending"
        },

        {
            id: "ZX-00118",
            userId: "",
            title: "Sistema de gestión empresarial",
            description:
                "Desarrollo de sistema para administrar operaciones internas.",
            service: "Software",
            date: "05 Ago 2026",
            createdAt: "2026-08-05T10:00:00",
            priority: "Alta",
            status: "completed"
        },

        {
            id: "ZX-00112",
            userId: "",
            title: "Automatización empresarial",
            description:
                "Automatización de procesos administrativos.",
            service: "Automatización",
            date: "01 Ago 2026",
            createdAt: "2026-08-01T10:00:00",
            priority: "Media",
            status: "pending"
        },

        {
            id: "ZX-00109",
            userId: "",
            title: "Consultoría tecnológica",
            description:
                "Evaluación y recomendaciones para optimizar procesos.",
            service: "Consultoría",
            date: "29 Jul 2026",
            createdAt: "2026-07-29T10:00:00",
            priority: "Baja",
            status: "completed"
        }

    ];


    /* =====================================================
       IDENTIDAD DE SOLICITUD
    ===================================================== */

    function normalizarSolicitud(solicitud) {

        if (!solicitud) {
            return null;
        }


        const copia = {
            ...solicitud
        };


        copia.id =
            limpiarTexto(
                obtenerPrimero(
                    solicitud.id,
                    solicitud.Id,
                    solicitud.requestId,
                    solicitud.codigo
                )
            );


        copia.userId =
            limpiarTexto(
                obtenerPrimero(
                    solicitud.userId,
                    solicitud.usuarioId,
                    solicitud.usuario_id,
                    solicitud.Usuario_Id,
                    solicitud.id_usuario,
                    solicitud.idUsuario
                )
            );


        copia.username =
            limpiarTexto(
                obtenerPrimero(
                    solicitud.username,
                    solicitud.usuario,
                    solicitud.Usuario,
                    solicitud.nombreUsuario
                )
            );


        copia.email =
            limpiarTexto(
                obtenerPrimero(
                    solicitud.email,
                    solicitud.correo,
                    solicitud.Correo
                )
            );


        return copia;
    }


    function solicitudPerteneceAlUsuario(
        solicitud
    ) {

        if (!solicitud || !currentUser) {
            return false;
        }


        const userId =
            limpiarTexto(
                currentUser.id
            );

        const username =
            limpiarTexto(
                currentUser.usuario
            ).toLowerCase();

        const email =
            limpiarTexto(
                currentUser.correo
            ).toLowerCase();


        const solicitudUserId =
            limpiarTexto(
                solicitud.userId
            );

        const solicitudUsername =
            limpiarTexto(
                solicitud.username
            ).toLowerCase();

        const solicitudEmail =
            limpiarTexto(
                solicitud.email
            ).toLowerCase();


        if (
            userId &&
            solicitudUserId &&
            solicitudUserId === userId
        ) {
            return true;
        }


        if (
            username &&
            solicitudUsername &&
            solicitudUsername === username
        ) {
            return true;
        }


        if (
            email &&
            solicitudEmail &&
            solicitudEmail === email
        ) {
            return true;
        }


        /*
         * Las solicitudes de demostración antiguas
         * tenían userId = "demo".
         *
         * Si no existe ninguna solicitud real del usuario,
         * se permiten como datos iniciales de demostración.
         */
        if (
            solicitudUserId === "demo" ||
            !solicitudUserId
        ) {
            return true;
        }


        return false;
    }


    /* =====================================================
       CARGAR TODAS LAS SOLICITUDES
    ===================================================== */

    function obtenerTodasLasSolicitudes() {

        const claves = [
            REQUESTS_KEY,
            REQUESTS_KEY_ALT
        ];


        for (const clave of claves) {

            try {

                const datos =
                    localStorage.getItem(clave);

                if (!datos) {
                    continue;
                }


                const parsed =
                    JSON.parse(datos);


                if (
                    Array.isArray(parsed)
                ) {

                    return parsed
                        .map(normalizarSolicitud)
                        .filter(Boolean);
                }

            } catch (error) {

                console.error(
                    "Error leyendo solicitudes:",
                    error
                );
            }
        }


        return [];
    }


    /* =====================================================
       CARGAR SOLICITUDES DEL USUARIO
    ===================================================== */

    function cargarSolicitudes() {

        try {

            let todas =
                obtenerTodasLasSolicitudes();


            /*
             * Primera ejecución:
             * si no existen solicitudes,
             * se crean las de demostración.
             */

            if (!todas.length) {

                todas =
                    defaultRequests.map(
                        solicitud => ({
                            ...solicitud,

                            userId:
                                currentUser.id ||
                                "",

                            username:
                                currentUser.usuario ||
                                "",

                            email:
                                currentUser.correo ||
                                ""
                        })
                    );


                localStorage.setItem(
                    REQUESTS_KEY,
                    JSON.stringify(todas)
                );
            }


            /*
             * Migrar solicitudes antiguas
             * que tenían userId = demo.
             */

            todas =
                todas.map(solicitud => {

                    const copia =
                        normalizarSolicitud(
                            solicitud
                        );


                    if (
                        copia.userId === "demo" ||
                        !copia.userId
                    ) {

                        copia.userId =
                            currentUser.id ||
                            "";

                        copia.username =
                            currentUser.usuario ||
                            copia.username ||
                            "";

                        copia.email =
                            currentUser.correo ||
                            copia.email ||
                            "";
                    }


                    return copia;
                });


            /*
             * Filtrar las solicitudes del usuario.
             */

            requests =
                todas.filter(
                    solicitud =>
                        solicitudPerteneceAlUsuario(
                            solicitud
                        )
                );


            /*
             * Si el usuario actual no tenía
             * solicitudes, se muestran los datos
             * de demostración para que la interfaz
             * no aparezca vacía.
             */

            if (!requests.length) {

                requests =
                    defaultRequests.map(
                        solicitud => ({
                            ...solicitud,

                            userId:
                                currentUser.id ||
                                "",

                            username:
                                currentUser.usuario ||
                                "",

                            email:
                                currentUser.correo ||
                                ""
                        })
                    );


                guardarSolicitudes();
            }

        } catch (error) {

            console.error(
                "Error al cargar solicitudes:",
                error
            );


            requests =
                defaultRequests.map(
                    solicitud => ({
                        ...solicitud,

                        userId:
                            currentUser.id ||
                            "",

                        username:
                            currentUser.usuario ||
                            "",

                        email:
                            currentUser.correo ||
                            ""
                    })
                );
        }
    }


    /* =====================================================
       GUARDAR SOLICITUDES
    ===================================================== */

    function guardarSolicitudes() {

        try {

            const todas =
                obtenerTodasLasSolicitudes();


            const userId =
                limpiarTexto(
                    currentUser.id
                );


            const username =
                limpiarTexto(
                    currentUser.usuario
                ).toLowerCase();


            const email =
                limpiarTexto(
                    currentUser.correo
                ).toLowerCase();


            /*
             * Eliminar de la colección únicamente
             * las solicitudes pertenecientes al usuario actual.
             */

            const otrasSolicitudes =
                todas.filter(
                    solicitud => {

                        const solicitudUserId =
                            limpiarTexto(
                                solicitud.userId
                            );

                        const solicitudUsername =
                            limpiarTexto(
                                solicitud.username
                            ).toLowerCase();

                        const solicitudEmail =
                            limpiarTexto(
                                solicitud.email
                            ).toLowerCase();


                        if (
                            userId &&
                            solicitudUserId === userId
                        ) {
                            return false;
                        }


                        if (
                            username &&
                            solicitudUsername === username
                        ) {
                            return false;
                        }


                        if (
                            email &&
                            solicitudEmail === email
                        ) {
                            return false;
                        }


                        return true;
                    }
                );


            const solicitudesUsuario =
                requests.map(
                    solicitud => ({

                        ...solicitud,

                        userId:
                            solicitud.userId ||
                            currentUser.id ||
                            "",

                        username:
                            solicitud.username ||
                            currentUser.usuario ||
                            "",

                        email:
                            solicitud.email ||
                            currentUser.correo ||
                            ""
                    })
                );


            const resultado = [

                ...otrasSolicitudes,

                ...solicitudesUsuario

            ];


            localStorage.setItem(
                REQUESTS_KEY,
                JSON.stringify(resultado)
            );


            /*
             * Mantener también la clave alternativa
             * para compatibilidad con otras páginas.
             */

            localStorage.setItem(
                REQUESTS_KEY_ALT,
                JSON.stringify(resultado)
            );

        } catch (error) {

            console.error(
                "No se pudieron guardar las solicitudes:",
                error
            );
        }
    }


    cargarSolicitudes();


    /* =====================================================
       SIDEBAR
    ===================================================== */

    function openSidebar() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.add("open");

        if (sidebarOverlay) {

            sidebarOverlay.classList.add(
                "active"
            );
        }
    }


    function closeSidebar() {

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


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            openSidebar
        );
    }


    if (sidebarClose) {

        sidebarClose.addEventListener(
            "click",
            closeSidebar
        );
    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );
    }


    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 800
                    ) {

                        closeSidebar();
                    }
                }
            );
        });


    /* =====================================================
       MODAL NUEVA SOLICITUD
    ===================================================== */

    function openRequestModal() {

        if (!requestModal) {
            return;
        }

        requestModal.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";
    }


    function closeRequestModal() {

        if (!requestModal) {
            return;
        }

        requestModal.classList.remove(
            "active"
        );

        if (
            !detailModal ||
            !detailModal.classList.contains(
                "active"
            )
        ) {

            document.body.style.overflow =
                "";
        }
    }


    if (newRequestButton) {

        newRequestButton.addEventListener(
            "click",
            openRequestModal
        );
    }


    if (closeRequestModalButton) {

        closeRequestModalButton.addEventListener(
            "click",
            closeRequestModal
        );
    }


    if (cancelRequest) {

        cancelRequest.addEventListener(
            "click",
            closeRequestModal
        );
    }


    if (requestModal) {

        requestModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    requestModal
                ) {

                    closeRequestModal();
                }
            }
        );
    }


    /* =====================================================
       CONTADOR DE CARACTERES
    ===================================================== */

    function updateCharacterCount() {

        if (
            !requestDescription ||
            !characterCount
        ) {
            return;
        }


        characterCount.textContent =
            `${requestDescription.value.length} / 500`;
    }


    if (requestDescription) {

        requestDescription.addEventListener(
            "input",
            updateCharacterCount
        );
    }


    /* =====================================================
       ARCHIVOS
    ===================================================== */

    if (requestFile) {

        requestFile.addEventListener(
            "change",
            () => {

                const file =
                    requestFile.files &&
                    requestFile.files[0];


                if (!file) {

                    if (selectedFile) {
                        selectedFile.hidden = true;
                    }

                    return;
                }


                if (
                    file.size >
                    5 * 1024 * 1024
                ) {

                    alert(
                        "El archivo no puede superar los 5 MB."
                    );

                    requestFile.value = "";


                    if (selectedFile) {
                        selectedFile.hidden = true;
                    }

                    return;
                }


                if (selectedFileName) {

                    selectedFileName.textContent =
                        file.name;
                }


                if (selectedFile) {

                    selectedFile.hidden =
                        false;
                }
            }
        );
    }


    if (removeFile) {

        removeFile.addEventListener(
            "click",
            () => {

                if (requestFile) {
                    requestFile.value = "";
                }

                if (selectedFile) {
                    selectedFile.hidden = true;
                }
            }
        );
    }


    /* =====================================================
       GENERAR ID
    ===================================================== */

    function generateRequestId() {

        const allRequests =
            obtenerTodasLasSolicitudes();


        const numbers =
            allRequests
                .map(request => {

                    if (
                        !request ||
                        !request.id
                    ) {
                        return 0;
                    }


                    const match =
                        String(
                            request.id
                        ).match(
                            /(\d+)$/
                        );


                    return match
                        ? parseInt(
                            match[1],
                            10
                        )
                        : 0;
                })
                .filter(
                    number =>
                        !Number.isNaN(number)
                );


        const highest =
            numbers.length
                ? Math.max(...numbers)
                : 0;


        return `ZX-${String(
            highest + 1
        ).padStart(5, "0")}`;
    }


    /* =====================================================
       FECHAS
    ===================================================== */

    function getCurrentDate() {

        const date =
            new Date();


        const months = [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic"
        ];


        return `${date.getDate()} ${
            months[date.getMonth()]
        } ${date.getFullYear()}`;
    }


    function formatInputDate(value) {

        if (!value) {
            return getCurrentDate();
        }


        const date =
            new Date(
                `${value}T00:00:00`
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return getCurrentDate();
        }


        const months = [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic"
        ];


        return `${date.getDate()} ${
            months[date.getMonth()]
        } ${date.getFullYear()}`;
    }


    /* =====================================================
       FORMULARIO
    ===================================================== */

    if (requestForm) {

        requestForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const serviceElement =
                    document.getElementById(
                        "requestService"
                    );

                const titleElement =
                    document.getElementById(
                        "requestTitle"
                    );

                const priorityElement =
                    document.getElementById(
                        "requestPriority"
                    );

                const dateElement =
                    document.getElementById(
                        "requestDate"
                    );


                const service =
                    serviceElement
                        ? serviceElement.value.trim()
                        : "";


                const title =
                    titleElement
                        ? titleElement.value.trim()
                        : "";


                const description =
                    requestDescription
                        ? requestDescription.value.trim()
                        : "";


                const priorityValue =
                    priorityElement
                        ? priorityElement.value
                        : "";


                const date =
                    dateElement
                        ? dateElement.value
                        : "";


                if (
                    !service ||
                    !title ||
                    !description ||
                    !priorityValue
                ) {

                    alert(
                        "Completa todos los campos obligatorios."
                    );

                    return;
                }


                if (
                    description.length >
                    500
                ) {

                    alert(
                        "La descripción no puede superar los 500 caracteres."
                    );

                    return;
                }


                const priorityMap = {

                    low: "Baja",

                    medium: "Media",

                    high: "Alta"

                };


                const now =
                    new Date();


                const newRequest = {

                    id:
                        generateRequestId(),

                    userId:
                        currentUser.id || "",

                    username:
                        currentUser.usuario || "",

                    email:
                        currentUser.correo || "",

                    userName:
                        obtenerNombreCompleto(),

                    title:
                        title,

                    description:
                        description,

                    service:
                        service,

                    date:
                        date
                            ? formatInputDate(date)
                            : getCurrentDate(),

                    createdAt:
                        now.toISOString(),

                    priority:
                        priorityMap[
                            priorityValue
                        ] ||
                        "Media",

                    status:
                        "pending",

                    fileName:
                        requestFile &&
                        requestFile.files &&
                        requestFile.files[0]
                            ? requestFile.files[0].name
                            : ""

                };


                requests.unshift(
                    newRequest
                );


                guardarSolicitudes();


                registrarActividad({

                    tipo:
                        "request",

                    titulo:
                        "Nueva solicitud enviada",

                    descripcion:
                        `Creaste la solicitud "${title}".`,

                    fecha:
                        now.toISOString()

                });


                crearNotificacion({

                    tipo:
                        "success",

                    titulo:
                        "Solicitud enviada",

                    mensaje:
                        `Tu solicitud "${title}" fue registrada correctamente.`,

                    fecha:
                        now.toISOString(),

                    leida:
                        false

                });


                renderRequests();

                updateCounters();


                requestForm.reset();

                updateCharacterCount();


                if (selectedFile) {

                    selectedFile.hidden =
                        true;
                }


                closeRequestModal();


                showSuccessMessage(
                    "Tu solicitud fue registrada correctamente."
                );
            }
        );
    }


    /* =====================================================
       ESTADOS
    ===================================================== */

    function getStatusText(status) {

        const statuses = {

            pending:
                "Pendiente",

            processing:
                "En proceso",

            completed:
                "Completada",

            rejected:
                "Rechazada"

        };


        return (
            statuses[status] ||
            "Pendiente"
        );
    }


    /* =====================================================
       ICONOS
    ===================================================== */

    function getServiceIcon(service) {

        const icons = {

            "Desarrollo web":
                "fa-code",

            "Diseño":
                "fa-palette",

            "Software":
                "fa-database",

            "Automatización":
                "fa-gears",

            "Consultoría":
                "fa-lightbulb",

            "Marketing":
                "fa-bullhorn",

            "Soporte":
                "fa-headset",

            "Aplicación móvil":
                "fa-mobile-screen-button",

            "E-commerce":
                "fa-cart-shopping"

        };


        return (
            icons[service] ||
            "fa-file-lines"
        );
    }


    /* =====================================================
       CREAR TARJETA
    ===================================================== */

    function createRequestCard(request) {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "request-card";


        article.dataset.status =
            request.status;


        article.dataset.search =
            `${request.title}
             ${request.description}
             ${request.service}
             ${request.id}`
                .toLowerCase();


        article.innerHTML = `

            <div class="request-main">

                <div class="request-icon">

                    <i class="fa-solid ${
                        getServiceIcon(
                            request.service
                        )
                    }"></i>

                </div>

                <div class="request-info">

                    <div class="request-title-row">

                        <h3>
                            ${escapeHTML(
                                request.title
                            )}
                        </h3>

                        <span class="status status-${
                            escapeHTML(
                                request.status
                            )
                        }">

                            ${getStatusText(
                                request.status
                            )}

                        </span>

                    </div>

                    <p>
                        ${escapeHTML(
                            request.description
                        )}
                    </p>

                    <div class="request-meta">

                        <span>

                            <i class="fa-solid fa-hashtag"></i>

                            ${escapeHTML(
                                request.id
                            )}

                        </span>

                        <span>

                            <i class="fa-regular fa-calendar"></i>

                            ${escapeHTML(
                                request.date
                            )}

                        </span>

                        <span>

                            <i class="fa-solid fa-layer-group"></i>

                            ${escapeHTML(
                                request.service
                            )}

                        </span>

                    </div>

                </div>

            </div>

            <button
                type="button"
                class="request-action"
                data-request="${escapeHTML(
                    request.id
                )}"
            >

                Ver detalle

                <i class="fa-solid fa-arrow-right"></i>

            </button>

        `;


        const action =
            article.querySelector(
                ".request-action"
            );


        if (action) {

            action.addEventListener(
                "click",
                () => {

                    openDetailModal(
                        request
                    );
                }
            );
        }


        return article;
    }


    /* =====================================================
       RENDER SOLICITUDES
    ===================================================== */

    function renderRequests() {

        if (!requestsList) {
            return;
        }


        requestsList.innerHTML =
            "";


        const searchTerm =
            requestSearch
                ? requestSearch.value
                    .toLowerCase()
                    .trim()
                : "";


        const filteredRequests =
            requests.filter(
                request => {

                    const matchesFilter =
                        currentFilter ===
                            "all" ||
                        request.status ===
                            currentFilter;


                    const searchable =
                        `${request.title}
                         ${request.description}
                         ${request.service}
                         ${request.id}`
                            .toLowerCase();


                    const matchesSearch =
                        searchable.includes(
                            searchTerm
                        );


                    return (
                        matchesFilter &&
                        matchesSearch
                    );
                }
            );


        if (
            !filteredRequests.length
        ) {

            if (emptyState) {
                emptyState.hidden = false;
            }

            return;
        }


        if (emptyState) {
            emptyState.hidden = true;
        }


        filteredRequests.forEach(
            request => {

                requestsList.appendChild(
                    createRequestCard(
                        request
                    )
                );
            }
        );
    }


    /* =====================================================
       FILTROS
    ===================================================== */

    filterButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    filterButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.filter ||
                        "all";


                    renderRequests();
                }
            );
        }
    );


    /* =====================================================
       BUSCADOR
    ===================================================== */

    if (requestSearch) {

        requestSearch.addEventListener(
            "input",
            renderRequests
        );
    }


    /* =====================================================
       CONTADORES
    ===================================================== */

    function updateCounters() {

        const total =
            requests.length;


        const pending =
            requests.filter(
                request =>
                    request.status ===
                    "pending"
            ).length;


        const processing =
            requests.filter(
                request =>
                    request.status ===
                    "processing"
            ).length;


        const completed =
            requests.filter(
                request =>
                    request.status ===
                    "completed"
            ).length;


        const rejected =
            requests.filter(
                request =>
                    request.status ===
                    "rejected"
            ).length;


        establecerTexto(
            "totalRequests",
            total
        );


        establecerTexto(
            "pendingRequests",
            pending
        );


        establecerTexto(
            "processingRequests",
            processing
        );


        establecerTexto(
            "completedRequests",
            completed
        );


        const filterMap = {

            all:
                total,

            pending:
                pending,

            processing:
                processing,

            completed:
                completed,

            rejected:
                rejected

        };


        filterButtons.forEach(
            button => {

                const filter =
                    button.dataset.filter;


                const counter =
                    button.querySelector(
                        "span"
                    );


                if (counter) {

                    counter.textContent =
                        filterMap[
                            filter
                        ] ?? 0;
                }
            }
        );
    }


    function establecerTexto(
        id,
        valor
    ) {

        const elemento =
            document.getElementById(id);


        if (!elemento) {
            return;
        }


        elemento.textContent =
            valor ?? "";
    }


    /* =====================================================
       MODAL DETALLE
    ===================================================== */

    function openDetailModal(
        request
    ) {

        if (!detailModal) {
            return;
        }


        establecerTexto(
            "detailTitle",
            request.title
        );


        establecerTexto(
            "detailCode",
            `Solicitud #${request.id}`
        );


        const statusElement =
            document.getElementById(
                "detailStatus"
            );


        if (statusElement) {

            statusElement.className =
                `status status-${request.status}`;


            statusElement.textContent =
                getStatusText(
                    request.status
                );
        }


        establecerTexto(
            "detailService",
            request.service
        );


        establecerTexto(
            "detailDate",
            request.date
        );


        establecerTexto(
            "detailPriority",
            request.priority
        );


        establecerTexto(
            "detailDescription",
            request.description
        );


        updateTimeline(
            request.status
        );


        detailModal.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";
    }


    /* =====================================================
       TIMELINE
    ===================================================== */

    function updateTimeline(
        status
    ) {

        const timelineItems =
            document.querySelectorAll(
                ".timeline-item"
            );


        timelineItems.forEach(
            item => {

                item.classList.remove(
                    "completed",
                    "active"
                );
            }
        );


        if (!timelineItems.length) {
            return;
        }


        const statusIndex = {

            pending:
                0,

            processing:
                1,

            completed:
                3,

            rejected:
                2

        };


        const currentIndex =
            statusIndex[
                status
            ] ?? 0;


        timelineItems.forEach(
            (item, index) => {

                if (
                    index <
                    currentIndex
                ) {

                    item.classList.add(
                        "completed"
                    );
                }


                if (
                    index ===
                    currentIndex
                ) {

                    item.classList.add(
                        status ===
                            "completed"
                            ? "completed"
                            : "active"
                    );
                }
            }
        );


        if (
            status ===
            "rejected"
        ) {

            const item =
                timelineItems[2];


            if (item) {

                const title =
                    item.querySelector(
                        "strong"
                    );

                const text =
                    item.querySelector(
                        "span"
                    );


                if (title) {
                    title.textContent =
                        "Solicitud rechazada";
                }


                if (text) {
                    text.textContent =
                        "La solicitud no pudo ser procesada.";
                }
            }
        }
    }


    /* =====================================================
       CERRAR DETALLE
    ===================================================== */

    function closeDetail() {

        if (!detailModal) {
            return;
        }


        detailModal.classList.remove(
            "active"
        );


        if (
            !requestModal ||
            !requestModal.classList.contains(
                "active"
            )
        ) {

            document.body.style.overflow =
                "";
        }
    }


    if (closeDetailModal) {

        closeDetailModal.addEventListener(
            "click",
            closeDetail
        );
    }


    if (closeDetailButton) {

        closeDetailButton.addEventListener(
            "click",
            closeDetail
        );
    }


    if (detailModal) {

        detailModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    detailModal
                ) {

                    closeDetail();
                }
            }
        );
    }


    /* =====================================================
       ACTIVIDAD
    ===================================================== */

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
                    Array.isArray(
                        parsed
                    )
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
                "No se pudo guardar la actividad:",
                error
            );
        }
    }


    /* =====================================================
       NOTIFICACIONES
    ===================================================== */

    function obtenerNotificaciones() {

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

            console.error(
                "Error al cargar notificaciones:",
                error
            );

            return [];
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
                "No se pudieron guardar las notificaciones:",
                error
            );
        }
    }


    function crearNotificacion(
        notificacion
    ) {

        const notificaciones =
            obtenerNotificaciones();


        notificaciones.unshift(
            notificacion
        );


        guardarNotificaciones(
            notificaciones.slice(
                0,
                30
            )
        );


        cargarNotificaciones();
    }


    function cargarNotificaciones() {

        if (
            !notificationList
        ) {
            return;
        }


        const notificaciones =
            obtenerNotificaciones();


        mostrarNotificaciones(
            notificaciones
        );
    }


    function mostrarNotificaciones(
        notificaciones
    ) {

        if (
            !notificationList
        ) {
            return;
        }


        notificationList.innerHTML =
            "";


        if (
            !notificaciones.length
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


                    if (
                        !notificacion.leida
                    ) {

                        item.classList.add(
                            "unread"
                        );
                    }


                    item.innerHTML = `

                        <div class="notification-item-icon">

                            ${getNotificationIcon(
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

                            <span>
                                ${escapeHTML(
                                    getRelativeTime(
                                        notificacion.fecha
                                    )
                                )}
                            </span>

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


    function getNotificationIcon(
        type
    ) {

        switch (
            String(
                type || ""
            ).toLowerCase()
        ) {

            case "security":

                return `
                    <i class="fa-solid fa-shield-halved"></i>
                `;

            case "success":

                return `
                    <i class="fa-solid fa-circle-check"></i>
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
                    <i class="fa-solid fa-bell"></i>
                `;
        }
    }


    /* =====================================================
       NOTIFICACIONES — TOGGLE
    ===================================================== */

    function toggleNotifications(
        event
    ) {

        if (event) {
            event.stopPropagation();
        }


        if (!notificationPanel) {
            return;
        }


        notificationPanel.classList.toggle(
            "active"
        );
    }


    function closeNotificationsPanel() {

        if (!notificationPanel) {
            return;
        }


        notificationPanel.classList.remove(
            "active"
        );
    }


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            toggleNotifications
        );
    }


    if (notificationQuickButton) {

        notificationQuickButton.addEventListener(
            "click",
            toggleNotifications
        );
    }


    if (closeNotifications) {

        closeNotifications.addEventListener(
            "click",
            closeNotificationsPanel
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


            const insidePanel =
                notificationPanel.contains(
                    event.target
                );


            const insideButton =
                notificationButton &&
                notificationButton.contains(
                    event.target
                );


            const insideQuickButton =
                notificationQuickButton &&
                notificationQuickButton.contains(
                    event.target
                );


            if (
                !insidePanel &&
                !insideButton &&
                !insideQuickButton
            ) {

                closeNotificationsPanel();
            }
        }
    );


    /* =====================================================
       TIEMPO RELATIVO
    ===================================================== */

    function getRelativeTime(
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


        if (
            segundos < 60
        ) {
            return "Hace unos segundos";
        }


        const minutos =
            Math.floor(
                segundos / 60
            );


        if (
            minutos < 60
        ) {

            return minutos === 1
                ? "Hace 1 minuto"
                : `Hace ${minutos} minutos`;
        }


        const horas =
            Math.floor(
                minutos / 60
            );


        if (
            horas < 24
        ) {

            return horas === 1
                ? "Hace 1 hora"
                : `Hace ${horas} horas`;
        }


        const dias =
            Math.floor(
                horas / 24
            );


        if (
            dias < 7
        ) {

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
       MENSAJE DE ÉXITO
    ===================================================== */

    function showSuccessMessage(
        message
    ) {

        const existing =
            document.querySelector(
                ".zentryx-toast"
            );


        if (existing) {
            existing.remove();
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "zentryx-toast";


        toast.innerHTML = `

            <div class="toast-icon">

                <i class="fa-solid fa-check"></i>

            </div>

            <div>

                <strong>
                    Solicitud enviada
                </strong>

                <span>
                    ${escapeHTML(
                        message
                    )}
                </span>

            </div>

        `;


        document.body.appendChild(
            toast
        );


        requestAnimationFrame(
            () => {

                toast.classList.add(
                    "show"
                );
            }
        );


        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );


                setTimeout(
                    () => {

                        if (
                            toast.parentNode
                        ) {

                            toast.remove();
                        }

                    },
                    300
                );

            },
            3500
        );
    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

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
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }


    /* =====================================================
       TECLA ESC
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


            if (
                requestModal &&
                requestModal.classList.contains(
                    "active"
                )
            ) {

                closeRequestModal();

                return;
            }


            if (
                detailModal &&
                detailModal.classList.contains(
                    "active"
                )
            ) {

                closeDetail();

                return;
            }


            if (
                notificationPanel &&
                notificationPanel.classList.contains(
                    "active"
                )
            ) {

                closeNotificationsPanel();

                return;
            }


            if (
                sidebar &&
                sidebar.classList.contains(
                    "open"
                )
            ) {

                closeSidebar();
            }
        }
    );


    /* =====================================================
       CAMBIO DE TAMAÑO
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth >
                800
            ) {

                closeSidebar();
            }
        }
    );


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    actualizarDatosUsuario();

    cargarNotificaciones();

    renderRequests();

    updateCounters();

    updateCharacterCount();


    /* =====================================================
       API ZENTRYX
    ===================================================== */

    window.ZentryXSolicitudes = {

        obtenerSolicitudes:
            () => [...requests],


        crearSolicitud:
            request => {

                if (!request) {
                    return;
                }


                const nuevaSolicitud = {

                    ...request,

                    id:
                        request.id ||
                        generateRequestId(),

                    userId:
                        request.userId ||
                        currentUser.id ||
                        "",

                    username:
                        request.username ||
                        currentUser.usuario ||
                        "",

                    email:
                        request.email ||
                        currentUser.correo ||
                        ""

                };


                requests.unshift(
                    nuevaSolicitud
                );


                guardarSolicitudes();

                renderRequests();

                updateCounters();
            },


        actualizarSolicitudes:
            () => {

                cargarSolicitudes();

                renderRequests();

                updateCounters();
            },


        obtenerUsuarioActual:
            () => ({
                ...currentUser
            }),


        registrarActividad,

        crearNotificacion,

        cargarNotificaciones

    };

});