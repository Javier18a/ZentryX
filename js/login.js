/* =========================================================
   ZENTRYX - LOGIN
   login.js
   ========================================================= */


/* =========================================================
   ELEMENTOS
   ========================================================= */

const loginForm = document.getElementById("loginForm");

const loginUsuario =
    document.getElementById("loginUsuario");

const loginPassword =
    document.getElementById("loginPassword");

const rememberSession =
    document.getElementById("rememberSession");

const btnLogin =
    document.getElementById("btnLogin");

const loginBtnText =
    document.getElementById("loginBtnText");

const loginBtnLoader =
    document.getElementById("loginBtnLoader");

const loginMessage =
    document.getElementById("loginMessage");

const loginUsuarioError =
    document.getElementById("loginUsuarioError");

const loginPasswordError =
    document.getElementById("loginPasswordError");

const toggleLoginPassword =
    document.getElementById("toggleLoginPassword");


/* =========================================================
   MODAL RECUPERACIÓN
   ========================================================= */

const forgotPassword =
    document.getElementById("forgotPassword");

const forgotModal =
    document.getElementById("forgotModal");

const forgotModalOverlay =
    document.getElementById("forgotModalOverlay");

const forgotModalClose =
    document.getElementById("forgotModalClose");

const recoveryEmail =
    document.getElementById("recoveryEmail");

const recoveryError =
    document.getElementById("recoveryError");

const recoveryMessage =
    document.getElementById("recoveryMessage");

const recoveryButton =
    document.getElementById("recoveryButton");


/* =========================================================
   OBTENER USUARIOS
   ========================================================= */

function obtenerUsuarios() {

    const usuarios =
        localStorage.getItem("zentryx_usuarios");

    if (!usuarios) {
        return [];
    }

    try {

        return JSON.parse(usuarios);

    } catch (error) {

        console.error(
            "Error al obtener usuarios:",
            error
        );

        return [];
    }
}


/* =========================================================
   NORMALIZAR TEXTO
   ========================================================= */

function normalizarTexto(texto) {

    return texto
        .trim()
        .toLowerCase();
}


/* =========================================================
   VALIDAR CORREO
   ========================================================= */

function correoValido(correo) {

    const expresion =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expresion.test(correo);
}


/* =========================================================
   LIMPIAR ERRORES
   ========================================================= */

function limpiarErrores() {

    loginUsuarioError.textContent = "";

    loginPasswordError.textContent = "";

    const grupos =
        document.querySelectorAll(".form-group");

    grupos.forEach(grupo => {

        grupo.classList.remove(
            "input-error",
            "input-success"
        );

    });
}


/* =========================================================
   MOSTRAR ERROR EN INPUT
   ========================================================= */

function mostrarError(input, elemento, mensaje) {

    const grupo =
        input.closest(".form-group");

    if (grupo) {

        grupo.classList.add("input-error");

        grupo.classList.remove("input-success");
    }

    elemento.textContent = mensaje;
}


/* =========================================================
   MOSTRAR ÉXITO EN INPUT
   ========================================================= */

function mostrarExito(input, elemento) {

    const grupo =
        input.closest(".form-group");

    if (grupo) {

        grupo.classList.remove("input-error");

        grupo.classList.add("input-success");
    }

    elemento.textContent = "";
}


/* =========================================================
   MOSTRAR MENSAJE GENERAL
   ========================================================= */

function mostrarMensaje(mensaje, tipo) {

    loginMessage.textContent = mensaje;

    loginMessage.className =
        "login-message " + tipo;
}


/* =========================================================
   LIMPIAR MENSAJE GENERAL
   ========================================================= */

function limpiarMensaje() {

    loginMessage.textContent = "";

    loginMessage.className =
        "login-message";
}


/* =========================================================
   VALIDAR CAMPOS
   ========================================================= */

function validarCampos() {

    limpiarErrores();

    let valido = true;


    /* Usuario */

    const identificador =
        normalizarTexto(loginUsuario.value);

    loginUsuario.value = identificador;

    if (identificador === "") {

        mostrarError(
            loginUsuario,
            loginUsuarioError,
            "Ingresa tu usuario o correo."
        );

        valido = false;
    }


    /* Contraseña */

    if (loginPassword.value === "") {

        mostrarError(
            loginPassword,
            loginPasswordError,
            "Ingresa tu contraseña."
        );

        valido = false;
    }


    return valido;
}


/* =========================================================
   BUSCAR USUARIO
   ========================================================= */

function buscarUsuario(identificador) {

    const usuarios =
        obtenerUsuarios();

    const valor =
        normalizarTexto(identificador);


    return usuarios.find(usuario => {

        const nombreUsuario =
            normalizarTexto(
                usuario.usuario || ""
            );

        const correo =
            normalizarTexto(
                usuario.correo || ""
            );

        return (
            nombreUsuario === valor ||
            correo === valor
        );

    });
}


/* =========================================================
   CREAR SESIÓN
   ========================================================= */

function crearSesion(usuario) {

    const sesion = {

        id:
            usuario.id,

        nombre:
            usuario.nombre,

        apellido:
            usuario.apellido,

        usuario:
            usuario.usuario,

        correo:
            usuario.correo,

        rol:
            usuario.rol || "usuario",

        estado:
            usuario.estado || "activo",

        inicioSesion:
            new Date().toISOString()

    };


    /*
       Si el usuario selecciona
       "Mantener mi sesión iniciada",
       utilizamos localStorage.

       De lo contrario utilizamos
       sessionStorage.
    */

    if (rememberSession.checked) {

        localStorage.setItem(
            "zentryx_sesion",
            JSON.stringify(sesion)
        );

        sessionStorage.removeItem(
            "zentryx_sesion"
        );

    } else {

        sessionStorage.setItem(
            "zentryx_sesion",
            JSON.stringify(sesion)
        );

        localStorage.removeItem(
            "zentryx_sesion"
        );
    }


    return sesion;
}


/* =========================================================
   OBTENER SESIÓN
   ========================================================= */

function obtenerSesion() {

    const sesionLocal =
        localStorage.getItem("zentryx_sesion");

    const sesionTemporal =
        sessionStorage.getItem("zentryx_sesion");


    const sesion =
        sesionLocal || sesionTemporal;


    if (!sesion) {
        return null;
    }


    try {

        return JSON.parse(sesion);

    } catch (error) {

        console.error(
            "Error al obtener sesión:",
            error
        );

        return null;
    }
}


/* =========================================================
   REDIRECCIÓN
   ========================================================= */

function redirigirUsuario(sesion) {

    /*
       Por ahora todos los usuarios
       llegan al dashboard.

       Más adelante podemos crear:

       /dashboard/
       /admin/
       /usuario/
       etc.
    */

    if (sesion.rol === "admin") {

        window.location.href =
            "dashboard.html";

        return;
    }


    window.location.href =
        "dashboard.html";
}


/* =========================================================
   ESTADO BOTÓN
   ========================================================= */

function cambiarEstadoBoton(cargando) {

    btnLogin.disabled =
        cargando;


    if (cargando) {

        loginBtnText.hidden =
            true;

        loginBtnLoader.hidden =
            false;

    } else {

        loginBtnText.hidden =
            false;

        loginBtnLoader.hidden =
            true;
    }
}


/* =========================================================
   LOGIN
   ========================================================= */

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        limpiarMensaje();


        if (!validarCampos()) {

            mostrarMensaje(
                "Completa los campos requeridos.",
                "error"
            );

            return;
        }


        const identificador =
            normalizarTexto(
                loginUsuario.value
            );


        const password =
            loginPassword.value;


        const usuario =
            buscarUsuario(identificador);


        /*
           Usuario no encontrado
        */

        if (!usuario) {

            mostrarError(
                loginUsuario,
                loginUsuarioError,
                "No encontramos una cuenta con estos datos."
            );

            mostrarMensaje(
                "El usuario o correo no está registrado.",
                "error"
            );

            return;
        }


        /*
           Verificar estado
        */

        if (
            usuario.estado &&
            usuario.estado !== "activo"
        ) {

            mostrarMensaje(
                "Esta cuenta no se encuentra activa.",
                "error"
            );

            return;
        }


        /*
           Verificar contraseña
        */

        if (usuario.password !== password) {

            mostrarError(
                loginPassword,
                loginPasswordError,
                "La contraseña es incorrecta."
            );

            mostrarMensaje(
                "No se pudo iniciar sesión con las credenciales proporcionadas.",
                "error"
            );

            return;
        }


        /*
           Credenciales correctas
        */

        mostrarExito(
            loginUsuario,
            loginUsuarioError
        );

        mostrarExito(
            loginPassword,
            loginPasswordError
        );


        cambiarEstadoBoton(true);


        mostrarMensaje(
            "Inicio de sesión correcto. Preparando tu sesión...",
            "success"
        );


        /*
           Crear sesión
        */

        const sesion =
            crearSesion(usuario);


        /*
           Pequeña espera visual
        */

        setTimeout(() => {

            redirigirUsuario(sesion);

        }, 900);

    }
);


/* =========================================================
   MOSTRAR / OCULTAR CONTRASEÑA
   ========================================================= */

toggleLoginPassword.addEventListener(
    "click",
    function () {

        if (
            loginPassword.type ===
            "password"
        ) {

            loginPassword.type =
                "text";

            toggleLoginPassword.textContent =
                "Ocultar";

        } else {

            loginPassword.type =
                "password";

            toggleLoginPassword.textContent =
                "Mostrar";
        }
    }
);


/* =========================================================
   VALIDACIÓN EN TIEMPO REAL
   ========================================================= */

loginUsuario.addEventListener(
    "input",
    function () {

        if (
            loginUsuario.value.trim() !== ""
        ) {

            const grupo =
                loginUsuario.closest(
                    ".form-group"
                );

            grupo.classList.remove(
                "input-error"
            );

            loginUsuarioError.textContent =
                "";
        }

    }
);


loginPassword.addEventListener(
    "input",
    function () {

        if (
            loginPassword.value !== ""
        ) {

            const grupo =
                loginPassword.closest(
                    ".form-group"
                );

            grupo.classList.remove(
                "input-error"
            );

            loginPasswordError.textContent =
                "";
        }

    }
);


/* =========================================================
   MODAL RECUPERACIÓN
   ========================================================= */

function abrirRecoveryModal() {

    forgotModal.classList.add(
        "active"
    );

    forgotModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    recoveryEmail.focus();
}


function cerrarRecoveryModal() {

    forgotModal.classList.remove(
        "active"
    );

    forgotModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    recoveryEmail.value = "";

    recoveryError.textContent = "";

    recoveryMessage.textContent = "";

    recoveryMessage.className =
        "recovery-message";
}


/* =========================================================
   ABRIR RECUPERACIÓN
   ========================================================= */

forgotPassword.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        abrirRecoveryModal();

    }
);


/* =========================================================
   CERRAR RECUPERACIÓN
   ========================================================= */

forgotModalClose.addEventListener(
    "click",
    cerrarRecoveryModal
);


forgotModalOverlay.addEventListener(
    "click",
    cerrarRecoveryModal
);


/* =========================================================
   RECUPERACIÓN DE CONTRASEÑA
   ========================================================= */

recoveryButton.addEventListener(
    "click",
    function () {

        const email =
            normalizarTexto(
                recoveryEmail.value
            );


        recoveryError.textContent =
            "";

        recoveryMessage.textContent =
            "";

        recoveryMessage.className =
            "recovery-message";


        if (email === "") {

            recoveryError.textContent =
                "Ingresa tu correo electrónico.";

            return;
        }


        if (!correoValido(email)) {

            recoveryError.textContent =
                "Ingresa un correo electrónico válido.";

            return;
        }


        const usuarios =
            obtenerUsuarios();


        const usuario =
            usuarios.find(
                u =>
                    normalizarTexto(
                        u.correo || ""
                    ) === email
            );


        /*
           En esta versión de demostración
           no enviaremos correos reales.

           Simplemente comprobamos si existe
           una cuenta.
        */

        if (!usuario) {

            recoveryMessage.textContent =
                "No encontramos una cuenta asociada a ese correo.";

            recoveryMessage.classList.add(
                "error"
            );

            return;
        }


        recoveryMessage.textContent =
            "La cuenta fue encontrada. En una versión con backend, aquí se enviaría el enlace de recuperación.";

        recoveryMessage.classList.add(
            "success"
        );

    }
);


/* =========================================================
   TECLA ESC
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            forgotModal.classList.contains(
                "active"
            )
        ) {

            cerrarRecoveryModal();
        }

    }
);


/* =========================================================
   COMPROBAR SESIÓN EXISTENTE
   ========================================================= */

(function comprobarSesion() {

    const sesion =
        obtenerSesion();


    if (!sesion) {
        return;
    }


    /*
       Si ya existe una sesión,
       podemos evitar que el usuario
       vuelva al login innecesariamente.

       Actualmente lo dejamos comentado
       para facilitar las pruebas durante
       el desarrollo.
    */

    /*
    redirigirUsuario(sesion);
    */

})();