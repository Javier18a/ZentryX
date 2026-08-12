/* =========================================================
   ZENTRYX - PERFIL
   perfil.js
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const STORAGE_USERS = "zentryx_usuarios";
const STORAGE_SESSION = "zentryx_sesion";
const STORAGE_ACTIVITY = "zentryx_actividad";
const STORAGE_NOTIFICATIONS = "zentryx_notificaciones";


/* =========================================================
   ELEMENTOS
========================================================= */

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarClose = document.getElementById("sidebarClose");
const menuButton = document.getElementById("menuButton");

const logoutButton = document.getElementById("logoutButton");

const editButton = document.getElementById("editButton");
const cancelButton = document.getElementById("cancelButton");

const profileForm = document.getElementById("profileForm");
const formActions = document.getElementById("formActions");

const notificationButton =
    document.getElementById("notificationButton");

const notificationPanel =
    document.getElementById("notificationPanel");

const closeNotifications =
    document.getElementById("closeNotifications");

const notificationDot =
    document.getElementById("notificationDot");

const logoutModal =
    document.getElementById("logoutModal");

const logoutModalOverlay =
    document.getElementById("logoutModalOverlay");

const cancelLogout =
    document.getElementById("cancelLogout");

const confirmLogout =
    document.getElementById("confirmLogout");

const passwordButton =
    document.getElementById("passwordButton");

const passwordModal =
    document.getElementById("passwordModal");

const passwordModalOverlay =
    document.getElementById("passwordModalOverlay");

const cancelPassword =
    document.getElementById("cancelPassword");

const passwordForm =
    document.getElementById("passwordForm");

const passwordMessage =
    document.getElementById("passwordMessage");

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");

const toastIcon =
    document.getElementById("toastIcon");


/* =========================================================
   CAMPOS
========================================================= */

const fields = {

    nombre:
        document.getElementById("nombre"),

    apellido:
        document.getElementById("apellido"),

    usuario:
        document.getElementById("usuario"),

    correo:
        document.getElementById("correo"),

    identificador:
        document.getElementById("identificador")

};


/* =========================================================
   ESTADO
========================================================= */

let currentUser = null;
let originalData = null;

let toastTimer = null;


/* =========================================================
   INICIO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initProfile
);


function initProfile() {

    const session = getSession();

    if (!session) {

        redirectToLogin();

        return;
    }


    currentUser = findUser(session);


    if (!currentUser) {

        clearSession();

        redirectToLogin();

        return;
    }


    loadProfile();

    loadNotifications();

    setupEvents();

}


/* =========================================================
   SESIÓN
========================================================= */

function getSession() {

    try {

        const session =
            localStorage.getItem(STORAGE_SESSION);

        if (!session) {
            return null;
        }

        return JSON.parse(session);

    } catch (error) {

        console.error(
            "Error leyendo la sesión:",
            error
        );

        return null;
    }
}


/* =========================================================
   USUARIOS
========================================================= */

function getUsers() {

    try {

        const users =
            localStorage.getItem(STORAGE_USERS);

        if (!users) {
            return [];
        }

        const parsed =
            JSON.parse(users);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Error leyendo usuarios:",
            error
        );

        return [];
    }
}


function saveUsers(users) {

    localStorage.setItem(
        STORAGE_USERS,
        JSON.stringify(users)
    );
}


/* =========================================================
   BUSCAR USUARIO
========================================================= */

function findUser(session) {

    const users = getUsers();

    if (!users.length) {
        return null;
    }


    /*
       Intentamos localizar al usuario utilizando
       diferentes identificadores para mantener
       compatibilidad con el registro/login.
    */

    return users.find(user => {

        if (
            session.id &&
            user.id &&
            String(user.id) === String(session.id)
        ) {

            return true;
        }


        if (
            session.usuario &&
            user.usuario &&
            user.usuario.toLowerCase() ===
            String(session.usuario).toLowerCase()
        ) {

            return true;
        }


        if (
            session.username &&
            user.usuario &&
            user.usuario.toLowerCase() ===
            String(session.username).toLowerCase()
        ) {

            return true;
        }


        if (
            session.correo &&
            user.correo &&
            user.correo.toLowerCase() ===
            String(session.correo).toLowerCase()
        ) {

            return true;
        }


        if (
            session.email &&
            user.correo &&
            user.correo.toLowerCase() ===
            String(session.email).toLowerCase()
        ) {

            return true;
        }


        return false;

    });

}


/* =========================================================
   CARGAR PERFIL
========================================================= */

function loadProfile() {

    const user = currentUser;


    const nombre =
        getUserValue(
            user,
            [
                "nombre",
                "Nombre",
                "firstName"
            ]
        );


    const apellido =
        getUserValue(
            user,
            [
                "apellido",
                "Apellido",
                "lastName"
            ]
        );


    const usuario =
        getUserValue(
            user,
            [
                "usuario",
                "username",
                "Usuario"
            ]
        );


    const correo =
        getUserValue(
            user,
            [
                "correo",
                "email",
                "Correo"
            ]
        );


    const identificador =
        getUserValue(
            user,
            [
                "id",
                "Id",
                "ID",
                "identificador"
            ]
        );


    fields.nombre.value =
        nombre || "";

    fields.apellido.value =
        apellido || "";

    fields.usuario.value =
        usuario || "";

    fields.correo.value =
        correo || "";

    fields.identificador.value =
        formatIdentifier(
            identificador,
            usuario
        );


    /* ================================================
       NOMBRE COMPLETO
    ================================================= */

    const fullName =
        `${nombre} ${apellido}`.trim()
        || usuario
        || "Usuario";


    setText(
        "profileFullName",
        fullName
    );


    setText(
        "profileUsername",
        usuario
            ? `@${usuario}`
            : "@usuario"
    );


    /* ================================================
       ROL
    ================================================= */

    const role =
        getUserValue(
            user,
            [
                "rol",
                "role",
                "tipo",
                "tipoUsuario",
                "nivel"
            ]
        )
        || "Usuario";


    setText(
        "profileRole",
        role
    );

    setText(
        "sidebarUserRole",
        role
    );

    setText(
        "accountType",
        role
    );


    /* ================================================
       NOMBRE SIDEBAR
    ================================================= */

    setText(
        "sidebarUserName",
        fullName
    );


    setText(
        "topbarUserName",
        fullName
    );


    setText(
        "topbarUserEmail",
        correo || "Sin correo"
    );


    /* ================================================
       AVATAR
    ================================================= */

    const initials =
        getInitials(
            nombre,
            apellido,
            usuario
        );


    setText(
        "profileAvatar",
        initials
    );

    setText(
        "topbarAvatar",
        initials
    );

    setText(
        "mainAvatar",
        initials
    );


    /* ================================================
       ESTADO
    ================================================= */

    const status =
        getUserValue(
            user,
            [
                "estado",
                "status"
            ]
        )
        || "Activo";


    setText(
        "accountStatus",
        capitalize(status)
    );


    /* ================================================
       FECHA
    ================================================= */

    const createdAt =
        getUserValue(
            user,
            [
                "fechaRegistro",
                "fecha_registro",
                "createdAt",
                "registro",
                "fecha"
            ]
        );


    setText(
        "memberSince",
        formatDate(createdAt)
    );


    /* ================================================
       IDENTIFICADOR
    ================================================= */

    setText(
        "accountId",
        formatIdentifier(
            identificador,
            usuario
        )
    );


    originalData =
        getEditableData();

}


/* =========================================================
   OBTENER VALOR
========================================================= */

function getUserValue(user, possibleKeys) {

    for (const key of possibleKeys) {

        if (
            user &&
            user[key] !== undefined &&
            user[key] !== null
        ) {

            return user[key];
        }

    }

    return "";

}


/* =========================================================
   IDENTIFICADOR
========================================================= */

function formatIdentifier(id, username) {

    if (
        id !== undefined &&
        id !== null &&
        String(id).trim() !== ""
    ) {

        return `ZENTRYX-${id}`;

    }


    if (username) {

        return `ZENTRYX-${String(username)
            .toUpperCase()
            .replace(/\s+/g, "-")}`;

    }


    return "ZENTRYX-USER";

}


/* =========================================================
   INICIALES
========================================================= */

function getInitials(
    nombre,
    apellido,
    usuario
) {

    const first =
        String(nombre || "")
            .trim()
            .charAt(0);

    const last =
        String(apellido || "")
            .trim()
            .charAt(0);


    if (first || last) {

        return (
            `${first}${last}`
        ).toUpperCase();

    }


    if (usuario) {

        return String(usuario)
            .trim()
            .substring(0, 2)
            .toUpperCase();

    }


    return "U";

}


/* =========================================================
   EVENTOS
========================================================= */

function setupEvents() {


    /* ================================================
       SIDEBAR
    ================================================= */

    menuButton?.addEventListener(
        "click",
        openSidebar
    );


    sidebarClose?.addEventListener(
        "click",
        closeSidebar
    );


    sidebarOverlay?.addEventListener(
        "click",
        closeSidebar
    );


    /* ================================================
       EDITAR
    ================================================= */

    editButton?.addEventListener(
        "click",
        enableEditing
    );


    cancelButton?.addEventListener(
        "click",
        cancelEditing
    );


    profileForm?.addEventListener(
        "submit",
        saveProfile
    );


    /* ================================================
       LOGOUT
    ================================================= */

    logoutButton?.addEventListener(
        "click",
        openLogoutModal
    );


    cancelLogout?.addEventListener(
        "click",
        closeLogoutModal
    );


    logoutModalOverlay?.addEventListener(
        "click",
        closeLogoutModal
    );


    confirmLogout?.addEventListener(
        "click",
        logout
    );


    /* ================================================
       PASSWORD
    ================================================= */

    passwordButton?.addEventListener(
        "click",
        openPasswordModal
    );


    cancelPassword?.addEventListener(
        "click",
        closePasswordModal
    );


    passwordModalOverlay?.addEventListener(
        "click",
        closePasswordModal
    );


    passwordForm?.addEventListener(
        "submit",
        changePassword
    );


    /* ================================================
       NOTIFICACIONES
    ================================================= */

    notificationButton?.addEventListener(
        "click",
        toggleNotifications
    );


    closeNotifications?.addEventListener(
        "click",
        closeNotificationsPanel
    );


    /* ================================================
       ESC
    ================================================= */

    document.addEventListener(
        "keydown",
        handleEscape
    );

}


/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar() {

    sidebar?.classList.add("open");

    sidebarOverlay?.classList.add("active");

}


function closeSidebar() {

    sidebar?.classList.remove("open");

    sidebarOverlay?.classList.remove("active");

}


/* =========================================================
   EDITAR PERFIL
========================================================= */

function enableEditing() {

    Object.values(fields)
        .forEach(input => {

            if (
                input.id !==
                "identificador"
            ) {

                input.disabled = false;

            }

        });


    formActions?.classList.add(
        "active"
    );


    editButton.style.display =
        "none";


    fields.nombre.focus();

}


/* =========================================================
   CANCELAR EDICIÓN
========================================================= */

function cancelEditing() {

    if (!originalData) {
        return;
    }


    fields.nombre.value =
        originalData.nombre;

    fields.apellido.value =
        originalData.apellido;

    fields.usuario.value =
        originalData.usuario;

    fields.correo.value =
        originalData.correo;


    disableEditing();

}


/* =========================================================
   DESACTIVAR EDICIÓN
========================================================= */

function disableEditing() {

    Object.values(fields)
        .forEach(input => {

            input.disabled = true;

        });


    formActions?.classList.remove(
        "active"
    );


    editButton.style.display =
        "inline-flex";

}


/* =========================================================
   DATOS EDITABLES
========================================================= */

function getEditableData() {

    return {

        nombre:
            fields.nombre.value.trim(),

        apellido:
            fields.apellido.value.trim(),

        usuario:
            fields.usuario.value.trim(),

        correo:
            fields.correo.value.trim()

    };

}


/* =========================================================
   GUARDAR PERFIL
========================================================= */

function saveProfile(event) {

    event.preventDefault();


    const data =
        getEditableData();


    /* ================================================
       VALIDACIÓN
    ================================================= */

    if (!data.nombre) {

        showToast(
            "Error",
            "El nombre es obligatorio.",
            "error"
        );

        fields.nombre.focus();

        return;
    }


    if (!data.apellido) {

        showToast(
            "Error",
            "El apellido es obligatorio.",
            "error"
        );

        fields.apellido.focus();

        return;
    }


    if (!data.usuario) {

        showToast(
            "Error",
            "El nombre de usuario es obligatorio.",
            "error"
        );

        fields.usuario.focus();

        return;
    }


    if (!isValidEmail(data.correo)) {

        showToast(
            "Error",
            "Ingresa un correo electrónico válido.",
            "error"
        );

        fields.correo.focus();

        return;
    }


    const users =
        getUsers();


    /* ================================================
       COMPROBAR USUARIO DUPLICADO
    ================================================= */

    const duplicateUsername =
        users.some(user => {

            const userId =
                user.id ??
                user.identificador;

            const currentId =
                currentUser.id ??
                currentUser.identificador;


            if (
                userId !== undefined &&
                currentId !== undefined &&
                String(userId) ===
                String(currentId)
            ) {

                return false;
            }


            const existingUsername =
                user.usuario ??
                user.username;


            return existingUsername &&
                String(existingUsername)
                    .toLowerCase() ===
                data.usuario.toLowerCase();

        });


    if (duplicateUsername) {

        showToast(
            "Error",
            "Ese nombre de usuario ya está registrado.",
            "error"
        );

        fields.usuario.focus();

        return;
    }


    /* ================================================
       COMPROBAR CORREO DUPLICADO
    ================================================= */

    const duplicateEmail =
        users.some(user => {

            const userId =
                user.id ??
                user.identificador;

            const currentId =
                currentUser.id ??
                currentUser.identificador;


            if (
                userId !== undefined &&
                currentId !== undefined &&
                String(userId) ===
                String(currentId)
            ) {

                return false;
            }


            const existingEmail =
                user.correo ??
                user.email;


            return existingEmail &&
                String(existingEmail)
                    .toLowerCase() ===
                data.correo.toLowerCase();

        });


    if (duplicateEmail) {

        showToast(
            "Error",
            "Ese correo ya está registrado.",
            "error"
        );

        fields.correo.focus();

        return;
    }


    /* ================================================
       ACTUALIZAR USUARIO
    ================================================= */

    const index =
        users.findIndex(user => {

            const userId =
                user.id ??
                user.identificador;

            const currentId =
                currentUser.id ??
                currentUser.identificador;


            if (
                userId !== undefined &&
                currentId !== undefined
            ) {

                return String(userId) ===
                    String(currentId);

            }


            return (
                user.usuario &&
                currentUser.usuario &&
                user.usuario ===
                currentUser.usuario
            );

        });


    if (index === -1) {

        showToast(
            "Error",
            "No se pudo localizar la cuenta.",
            "error"
        );

        return;
    }


    const user =
        users[index];


    /* ================================================
       MANTENER ESTRUCTURA EXISTENTE
    ================================================= */

    user.nombre =
        data.nombre;

    user.apellido =
        data.apellido;

    user.usuario =
        data.usuario;

    user.correo =
        data.correo;


    /*
       Compatibilidad con estructuras
       alternativas.
    */

    if (
        Object.prototype.hasOwnProperty.call(
            user,
            "username"
        )
    ) {

        user.username =
            data.usuario;

    }


    if (
        Object.prototype.hasOwnProperty.call(
            user,
            "email"
        )
    ) {

        user.email =
            data.correo;

    }


    saveUsers(users);


    currentUser =
        user;


    updateSession(user);


    originalData =
        data;


    loadProfile();

    disableEditing();


    registerActivity(
        "Perfil actualizado",
        "Se actualizaron los datos de tu cuenta."
    );


    showToast(
        "Perfil actualizado",
        "Tus datos fueron guardados correctamente.",
        "success"
    );

}


/* =========================================================
   ACTUALIZAR SESIÓN
========================================================= */

function updateSession(user) {

    const currentSession =
        getSession() || {};


    const updatedSession = {
        ...currentSession
    };


    if (user.id !== undefined) {

        updatedSession.id =
            user.id;

    }


    if (user.usuario !== undefined) {

        updatedSession.usuario =
            user.usuario;

        updatedSession.username =
            user.usuario;

    }


    if (user.correo !== undefined) {

        updatedSession.correo =
            user.correo;

        updatedSession.email =
            user.correo;

    }


    if (user.nombre !== undefined) {

        updatedSession.nombre =
            user.nombre;

    }


    if (user.apellido !== undefined) {

        updatedSession.apellido =
            user.apellido;

    }


    localStorage.setItem(
        STORAGE_SESSION,
        JSON.stringify(updatedSession)
    );

}


/* =========================================================
   VALIDAR EMAIL
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   CAMBIAR CONTRASEÑA
========================================================= */

function openPasswordModal() {

    passwordForm?.reset();

    passwordMessage.textContent = "";

    passwordMessage.classList.remove(
        "success"
    );


    passwordModal?.classList.add(
        "active"
    );


    setTimeout(() => {

        document
            .getElementById("currentPassword")
            ?.focus();

    }, 100);

}


function closePasswordModal() {

    passwordModal?.classList.remove(
        "active"
    );

}


/* =========================================================
   OBTENER CONTRASEÑA
========================================================= */

function getUserPassword(user) {

    return (
        user.password ??
        user.contrasena ??
        user.contraseña ??
        ""
    );

}


/* =========================================================
   CAMBIAR CONTRASEÑA
========================================================= */

function changePassword(event) {

    event.preventDefault();


    const currentPassword =
        document
            .getElementById("currentPassword")
            .value;


    const newPassword =
        document
            .getElementById("newPassword")
            .value;


    const confirmPassword =
        document
            .getElementById("confirmPassword")
            .value;


    const storedPassword =
        getUserPassword(currentUser);


    /* ================================================
       CONTRASEÑA ACTUAL
    ================================================= */

    if (
        String(currentPassword) !==
        String(storedPassword)
    ) {

        showPasswordMessage(
            "La contraseña actual no es correcta.",
            false
        );

        return;
    }


    /* ================================================
       LONGITUD
    ================================================= */

    if (newPassword.length < 8) {

        showPasswordMessage(
            "La nueva contraseña debe tener al menos 8 caracteres.",
            false
        );

        return;
    }


    /* ================================================
       CONFIRMACIÓN
    ================================================= */

    if (
        newPassword !==
        confirmPassword
    ) {

        showPasswordMessage(
            "Las contraseñas nuevas no coinciden.",
            false
        );

        return;
    }


    if (
        newPassword ===
        currentPassword
    ) {

        showPasswordMessage(
            "La nueva contraseña debe ser diferente a la actual.",
            false
        );

        return;
    }


    /* ================================================
       ACTUALIZAR
    ================================================= */

    const users =
        getUsers();


    const index =
        users.findIndex(user => {

            const userId =
                user.id ??
                user.identificador;

            const currentId =
                currentUser.id ??
                currentUser.identificador;


            if (
                userId !== undefined &&
                currentId !== undefined
            ) {

                return String(userId) ===
                    String(currentId);

            }


            return (
                user.usuario ===
                currentUser.usuario
            );

        });


    if (index === -1) {

        showPasswordMessage(
            "No se pudo actualizar la cuenta.",
            false
        );

        return;
    }


    /*
       Guardamos utilizando la propiedad
       de contraseña que ya exista.
    */

    if (
        Object.prototype.hasOwnProperty.call(
            users[index],
            "password"
        )
    ) {

        users[index].password =
            newPassword;

    } else if (
        Object.prototype.hasOwnProperty.call(
            users[index],
            "contrasena"
        )
    ) {

        users[index].contrasena =
            newPassword;

    } else if (
        Object.prototype.hasOwnProperty.call(
            users[index],
            "contraseña"
        )
    ) {

        users[index].contraseña =
            newPassword;

    } else {

        users[index].password =
            newPassword;

    }


    saveUsers(users);


    currentUser =
        users[index];


    showPasswordMessage(
        "Contraseña actualizada correctamente.",
        true
    );


    registerActivity(
        "Contraseña actualizada",
        "Se cambió la contraseña de tu cuenta."
    );


    setTimeout(() => {

        closePasswordModal();


        showToast(
            "Contraseña actualizada",
            "Tu contraseña fue cambiada correctamente.",
            "success"
        );

    }, 900);

}


/* =========================================================
   MENSAJE PASSWORD
========================================================= */

function showPasswordMessage(
    message,
    success
) {

    passwordMessage.textContent =
        message;


    passwordMessage.classList.toggle(
        "success",
        success
    );

}


/* =========================================================
   LOGOUT MODAL
========================================================= */

function openLogoutModal() {

    logoutModal?.classList.add(
        "active"
    );

}


function closeLogoutModal() {

    logoutModal?.classList.remove(
        "active"
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    registerActivity(
        "Sesión cerrada",
        "Se cerró la sesión de ZentryX."
    );


    clearSession();


    window.location.href =
        "login.html";

}


/* =========================================================
   LIMPIAR SESIÓN
========================================================= */

function clearSession() {

    localStorage.removeItem(
        STORAGE_SESSION
    );

}


/* =========================================================
   REDIRECCIÓN LOGIN
========================================================= */

function redirectToLogin() {

    window.location.replace(
        "login.html"
    );

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function getNotifications() {

    try {

        const notifications =
            localStorage.getItem(
                STORAGE_NOTIFICATIONS
            );


        if (!notifications) {
            return [];
        }


        const parsed =
            JSON.parse(notifications);


        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Error leyendo notificaciones:",
            error
        );

        return [];
    }

}


/* =========================================================
   CARGAR NOTIFICACIONES
========================================================= */

function loadNotifications() {

    const notifications =
        getNotifications();


    const userId =
        currentUser.id ??
        currentUser.identificador;


    const userNotifications =
        notifications.filter(notification => {

            if (
                notification.userId ===
                undefined
            ) {

                return true;
            }


            return String(
                notification.userId
            ) === String(userId);

        });


    renderNotifications(
        userNotifications
    );


    const unread =
        userNotifications.filter(
            notification =>
                notification.read !== true
        );


    if (unread.length > 0) {

        notificationDot?.classList.add(
            "active"
        );

    } else {

        notificationDot?.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   RENDER NOTIFICACIONES
========================================================= */

function renderNotifications(
    notifications
) {

    const list =
        document.getElementById(
            "notificationList"
        );


    if (!list) {
        return;
    }


    if (!notifications.length) {

        list.innerHTML = `
            <div class="notification-empty">

                <div>♢</div>

                <p>
                    No tienes notificaciones nuevas.
                </p>

            </div>
        `;

        return;
    }


    list.innerHTML =
        notifications
            .map(notification => {

                const title =
                    escapeHTML(
                        notification.title ||
                        "Notificación"
                    );


                const message =
                    escapeHTML(
                        notification.message ||
                        ""
                    );


                const date =
                    formatDate(
                        notification.date ||
                        notification.createdAt
                    );


                return `
                    <div
                        class="notification-item"
                        data-notification-id="${escapeHTML(
                            notification.id || ""
                        )}">

                        <div
                            class="notification-item-icon">

                            ♢

                        </div>

                        <div
                            class="notification-item-content">

                            <strong>
                                ${title}
                            </strong>

                            <p>
                                ${message}
                            </p>

                            <div
                                class="notification-item-time">

                                ${date}

                            </div>

                        </div>

                    </div>
                `;

            })
            .join("");

}


/* =========================================================
   TOGGLE NOTIFICACIONES
========================================================= */

function toggleNotifications(event) {

    event?.stopPropagation();


    notificationPanel?.classList.toggle(
        "active"
    );


    if (
        notificationPanel?.classList.contains(
            "active"
        )
    ) {

        markNotificationsAsRead();

    }

}


/* =========================================================
   CERRAR NOTIFICACIONES
========================================================= */

function closeNotificationsPanel() {

    notificationPanel?.classList.remove(
        "active"
    );

}


/* =========================================================
   MARCAR COMO LEÍDAS
========================================================= */

function markNotificationsAsRead() {

    const notifications =
        getNotifications();


    if (!notifications.length) {
        return;
    }


    const userId =
        currentUser.id ??
        currentUser.identificador;


    let changed = false;


    notifications.forEach(notification => {

        const belongsToUser =
            notification.userId ===
            undefined ||
            String(
                notification.userId
            ) === String(userId);


        if (
            belongsToUser &&
            notification.read !== true
        ) {

            notification.read = true;

            changed = true;

        }

    });


    if (changed) {

        localStorage.setItem(
            STORAGE_NOTIFICATIONS,
            JSON.stringify(notifications)
        );

    }


    notificationDot?.classList.remove(
        "active"
    );

}


/* =========================================================
   ACTIVIDAD
========================================================= */

function registerActivity(
    title,
    description
) {

    let activities = [];


    try {

        const stored =
            localStorage.getItem(
                STORAGE_ACTIVITY
            );


        if (stored) {

            const parsed =
                JSON.parse(stored);


            if (Array.isArray(parsed)) {

                activities = parsed;

            }

        }

    } catch (error) {

        console.error(
            "Error leyendo actividad:",
            error
        );

    }


    activities.unshift({

        id:
            Date.now(),

        userId:
            currentUser?.id ??
            currentUser?.identificador ??
            null,

        title:
            title,

        description:
            description,

        date:
            new Date().toISOString()

    });


    /*
       Conservamos solamente
       las últimas 50 actividades.
    */

    activities =
        activities.slice(0, 50);


    localStorage.setItem(
        STORAGE_ACTIVITY,
        JSON.stringify(activities)
    );

}


/* =========================================================
   ESC
========================================================= */

function handleEscape(event) {

    if (event.key !== "Escape") {
        return;
    }


    closeSidebar();

    closeLogoutModal();

    closePasswordModal();

    closeNotificationsPanel();

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    title,
    message,
    type = "success"
) {

    clearTimeout(
        toastTimer
    );


    toastTitle.textContent =
        title;


    toastMessage.textContent =
        message;


    if (type === "error") {

        toastIcon.textContent =
            "!";

        toastIcon.style.background =
            "rgba(231, 76, 60, 0.1)";

        toastIcon.style.color =
            "var(--error)";

    } else {

        toastIcon.textContent =
            "✓";

        toastIcon.style.background =
            "rgba(32, 180, 134, 0.1)";

        toastIcon.style.color =
            "var(--success)";

    }


    toast.classList.add(
        "active"
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "active"
            );

        }, 3500);

}


/* =========================================================
   FECHA
========================================================= */

function formatDate(date) {

    if (!date) {
        return "--";
    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return String(date);

    }


    return parsed.toLocaleDateString(
        "es-NI",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   CAPITALIZAR
========================================================= */

function capitalize(value) {

    if (!value) {
        return "";
    }


    const text =
        String(value);


    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}


/* =========================================================
   TEXTO SEGURO
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "";

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   CERRAR NOTIFICACIONES AL HACER CLICK AFUERA
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            !notificationPanel ||
            !notificationButton
        ) {

            return;
        }


        if (
            notificationPanel.contains(
                event.target
            ) ||
            notificationButton.contains(
                event.target
            )
        ) {

            return;
        }


        closeNotificationsPanel();

    }
);