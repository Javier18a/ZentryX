/* =========================================================
   ZENTRYX - REGISTRO
   registro.js
   ========================================================= */


/* =========================================================
   ELEMENTOS
   ========================================================= */

const registroForm = document.getElementById("registroForm");

const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const usuario = document.getElementById("usuario");
const correo = document.getElementById("correo");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const terminos = document.getElementById("terminos");

const btnRegistro = document.getElementById("btnRegistro");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");

const formMessage = document.getElementById("formMessage");

const strengthProgress = document.getElementById("strengthProgress");
const strengthText = document.getElementById("strengthText");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");


/* =========================================================
   MENSAJES DE ERROR
   ========================================================= */

const nombreError = document.getElementById("nombreError");
const apellidoError = document.getElementById("apellidoError");
const usuarioError = document.getElementById("usuarioError");
const correoError = document.getElementById("correoError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError =
    document.getElementById("confirmPasswordError");
const terminosError = document.getElementById("terminosError");


/* =========================================================
   MODAL
   ========================================================= */

const terminosLink = document.getElementById("terminosLink");
const terminosModal = document.getElementById("terminosModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const acceptTerms = document.getElementById("acceptTerms");


/* =========================================================
   OBTENER USUARIOS
   ========================================================= */

function obtenerUsuarios() {

    const usuarios = localStorage.getItem("zentryx_usuarios");

    if (!usuarios) {
        return [];
    }

    try {
        return JSON.parse(usuarios);
    } catch (error) {

        console.error(
            "Error al leer los usuarios:",
            error
        );

        return [];
    }
}


/* =========================================================
   GUARDAR USUARIOS
   ========================================================= */

function guardarUsuarios(usuarios) {

    localStorage.setItem(
        "zentryx_usuarios",
        JSON.stringify(usuarios)
    );
}


/* =========================================================
   LIMPIAR TEXTO
   ========================================================= */

function limpiarTexto(texto) {

    return texto
        .trim()
        .replace(/\s+/g, " ");
}


/* =========================================================
   NORMALIZAR CORREO
   ========================================================= */

function normalizarCorreo(correo) {

    return correo
        .trim()
        .toLowerCase();
}


/* =========================================================
   NORMALIZAR USUARIO
   ========================================================= */

function normalizarUsuario(usuario) {

    return usuario
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
   VALIDAR USUARIO
   ========================================================= */

function usuarioValido(usuario) {

    const expresion =
        /^[a-zA-Z0-9._-]{4,30}$/;

    return expresion.test(usuario);
}


/* =========================================================
   VALIDAR NOMBRE
   ========================================================= */

function nombreValido(nombre) {

    const expresion =
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,50}$/;

    return expresion.test(nombre);
}


/* =========================================================
   VALIDAR CONTRASEÑA
   ========================================================= */

function contraseñaValida(password) {

    /*
       Requisitos:

       - mínimo 8 caracteres
       - al menos una letra
       - al menos un número
    */

    return (
        password.length >= 8 &&
        /[A-Za-z]/.test(password) &&
        /[0-9]/.test(password)
    );
}


/* =========================================================
   MOSTRAR ERROR
   ========================================================= */

function mostrarError(input, elementoError, mensaje) {

    const grupo = input.closest(".form-group");

    if (grupo) {
        grupo.classList.add("input-error");
        grupo.classList.remove("input-success");
    }

    elementoError.textContent = mensaje;
}


/* =========================================================
   MOSTRAR ÉXITO
   ========================================================= */

function mostrarExito(input, elementoError) {

    const grupo = input.closest(".form-group");

    if (grupo) {
        grupo.classList.remove("input-error");
        grupo.classList.add("input-success");
    }

    elementoError.textContent = "";
}


/* =========================================================
   LIMPIAR ERROR
   ========================================================= */

function limpiarError(input, elementoError) {

    const grupo = input.closest(".form-group");

    if (grupo) {
        grupo.classList.remove("input-error");
        grupo.classList.remove("input-success");
    }

    elementoError.textContent = "";
}


/* =========================================================
   VALIDAR NOMBRE
   ========================================================= */

function validarNombre() {

    const valor = limpiarTexto(nombre.value);

    nombre.value = valor;

    if (valor === "") {

        mostrarError(
            nombre,
            nombreError,
            "Ingresa tu nombre."
        );

        return false;
    }

    if (!nombreValido(valor)) {

        mostrarError(
            nombre,
            nombreError,
            "Ingresa un nombre válido."
        );

        return false;
    }

    mostrarExito(nombre, nombreError);

    return true;
}


/* =========================================================
   VALIDAR APELLIDO
   ========================================================= */

function validarApellido() {

    const valor = limpiarTexto(apellido.value);

    apellido.value = valor;

    if (valor === "") {

        mostrarError(
            apellido,
            apellidoError,
            "Ingresa tu apellido."
        );

        return false;
    }

    if (!nombreValido(valor)) {

        mostrarError(
            apellido,
            apellidoError,
            "Ingresa un apellido válido."
        );

        return false;
    }

    mostrarExito(apellido, apellidoError);

    return true;
}


/* =========================================================
   VALIDAR USUARIO
   ========================================================= */

function validarUsuario() {

    const valor = normalizarUsuario(usuario.value);

    usuario.value = valor;

    if (valor === "") {

        mostrarError(
            usuario,
            usuarioError,
            "Ingresa un nombre de usuario."
        );

        return false;
    }

    if (!usuarioValido(valor)) {

        mostrarError(
            usuario,
            usuarioError,
            "Usa entre 4 y 30 caracteres: letras, números, . _ o -."
        );

        return false;
    }

    const usuarios = obtenerUsuarios();

    const existe = usuarios.some(
        u => normalizarUsuario(u.usuario) === valor
    );

    if (existe) {

        mostrarError(
            usuario,
            usuarioError,
            "Este nombre de usuario ya está registrado."
        );

        return false;
    }

    mostrarExito(usuario, usuarioError);

    return true;
}


/* =========================================================
   VALIDAR CORREO
   ========================================================= */

function validarCorreo() {

    const valor = normalizarCorreo(correo.value);

    correo.value = valor;

    if (valor === "") {

        mostrarError(
            correo,
            correoError,
            "Ingresa tu correo electrónico."
        );

        return false;
    }

    if (!correoValido(valor)) {

        mostrarError(
            correo,
            correoError,
            "Ingresa un correo electrónico válido."
        );

        return false;
    }

    const usuarios = obtenerUsuarios();

    const existe = usuarios.some(
        u => normalizarCorreo(u.correo) === valor
    );

    if (existe) {

        mostrarError(
            correo,
            correoError,
            "Este correo ya está registrado."
        );

        return false;
    }

    mostrarExito(correo, correoError);

    return true;
}


/* =========================================================
   CALCULAR SEGURIDAD DE CONTRASEÑA
   ========================================================= */

function calcularSeguridad(password) {

    let puntuacion = 0;

    if (password.length >= 8) {
        puntuacion++;
    }

    if (password.length >= 12) {
        puntuacion++;
    }

    if (/[a-z]/.test(password)) {
        puntuacion++;
    }

    if (/[A-Z]/.test(password)) {
        puntuacion++;
    }

    if (/[0-9]/.test(password)) {
        puntuacion++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        puntuacion++;
    }

    return puntuacion;
}


/* =========================================================
   ACTUALIZAR SEGURIDAD
   ========================================================= */

function actualizarSeguridad() {

    const valor = password.value;

    if (valor.length === 0) {

        strengthProgress.style.width = "0%";

        strengthText.textContent =
            "Seguridad de la contraseña";

        return;
    }

    const puntuacion =
        calcularSeguridad(valor);

    const porcentajes = [
        15,
        30,
        50,
        65,
        82,
        100
    ];

    const textos = [
        "Muy débil",
        "Débil",
        "Regular",
        "Buena",
        "Fuerte",
        "Muy fuerte"
    ];

    const indice =
        Math.min(puntuacion, 6) - 1;

    strengthProgress.style.width =
        porcentajes[indice] + "%";

    strengthText.textContent =
        textos[indice];
}


/* =========================================================
   VALIDAR CONTRASEÑA
   ========================================================= */

function validarPassword() {

    const valor = password.value;

    if (valor === "") {

        mostrarError(
            password,
            passwordError,
            "Ingresa una contraseña."
        );

        return false;
    }

    if (!contraseñaValida(valor)) {

        mostrarError(
            password,
            passwordError,
            "Debe tener al menos 8 caracteres, una letra y un número."
        );

        return false;
    }

    mostrarExito(password, passwordError);

    return true;
}


/* =========================================================
   VALIDAR CONFIRMACIÓN
   ========================================================= */

function validarConfirmPassword() {

    const valor = confirmPassword.value;

    if (valor === "") {

        mostrarError(
            confirmPassword,
            confirmPasswordError,
            "Confirma tu contraseña."
        );

        return false;
    }

    if (valor !== password.value) {

        mostrarError(
            confirmPassword,
            confirmPasswordError,
            "Las contraseñas no coinciden."
        );

        return false;
    }

    mostrarExito(
        confirmPassword,
        confirmPasswordError
    );

    return true;
}


/* =========================================================
   VALIDAR TÉRMINOS
   ========================================================= */

function validarTerminos() {

    if (!terminos.checked) {

        terminosError.textContent =
            "Debes aceptar los términos y condiciones.";

        document
            .querySelector(".checkbox-container")
            .classList.add("error");

        return false;
    }

    terminosError.textContent = "";

    document
        .querySelector(".checkbox-container")
        .classList.remove("error");

    return true;
}


/* =========================================================
   MOSTRAR MENSAJE GENERAL
   ========================================================= */

function mostrarMensaje(mensaje, tipo) {

    formMessage.textContent = mensaje;

    formMessage.className =
        "form-message " + tipo;
}


/* =========================================================
   LIMPIAR MENSAJE GENERAL
   ========================================================= */

function limpiarMensaje() {

    formMessage.textContent = "";

    formMessage.className =
        "form-message";
}


/* =========================================================
   CAMBIAR ESTADO DEL BOTÓN
   ========================================================= */

function cambiarEstadoBoton(cargando) {

    btnRegistro.disabled = cargando;

    if (cargando) {

        btnText.hidden = true;
        btnLoader.hidden = false;

    } else {

        btnText.hidden = false;
        btnLoader.hidden = true;
    }
}


/* =========================================================
   REGISTRAR USUARIO
   ========================================================= */

registroForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        limpiarMensaje();

        const nombreCorrecto =
            validarNombre();

        const apellidoCorrecto =
            validarApellido();

        const usuarioCorrecto =
            validarUsuario();

        const correoCorrecto =
            validarCorreo();

        const passwordCorrecto =
            validarPassword();

        const confirmPasswordCorrecto =
            validarConfirmPassword();

        const terminosCorrectos =
            validarTerminos();


        const formularioValido =
            nombreCorrecto &&
            apellidoCorrecto &&
            usuarioCorrecto &&
            correoCorrecto &&
            passwordCorrecto &&
            confirmPasswordCorrecto &&
            terminosCorrectos;


        if (!formularioValido) {

            mostrarMensaje(
                "Revisa los datos ingresados antes de continuar.",
                "error"
            );

            return;
        }


        cambiarEstadoBoton(true);


        /*
           Pequeña espera para simular
           el procesamiento del registro.
        */

        setTimeout(() => {

            const usuarios =
                obtenerUsuarios();


            const nuevoUsuario = {

                id:
                    Date.now(),

                nombre:
                    limpiarTexto(nombre.value),

                apellido:
                    limpiarTexto(apellido.value),

                usuario:
                    normalizarUsuario(usuario.value),

                correo:
                    normalizarCorreo(correo.value),

                password:
                    password.value,

                fechaRegistro:
                    new Date().toISOString(),

                rol:
                    "usuario",

                estado:
                    "activo"
            };


            usuarios.push(nuevoUsuario);

            guardarUsuarios(usuarios);


            cambiarEstadoBoton(false);


            mostrarMensaje(
                "¡Cuenta creada correctamente! Ya puedes iniciar sesión.",
                "success"
            );


            registroForm.reset();

            strengthProgress.style.width = "0%";

            strengthText.textContent =
                "Seguridad de la contraseña";


            document
                .querySelectorAll(".form-group")
                .forEach(grupo => {

                    grupo.classList.remove(
                        "input-error",
                        "input-success"
                    );
                });


        }, 900);

    }
);


/* =========================================================
   VALIDACIONES EN TIEMPO REAL
   ========================================================= */

nombre.addEventListener(
    "blur",
    validarNombre
);

apellido.addEventListener(
    "blur",
    validarApellido
);

usuario.addEventListener(
    "blur",
    validarUsuario
);

correo.addEventListener(
    "blur",
    validarCorreo
);

password.addEventListener(
    "input",
    function () {

        actualizarSeguridad();

        if (password.value.length > 0) {
            validarPassword();
        }

        if (confirmPassword.value.length > 0) {
            validarConfirmPassword();
        }
    }
);

password.addEventListener(
    "blur",
    validarPassword
);

confirmPassword.addEventListener(
    "input",
    function () {

        if (confirmPassword.value.length > 0) {
            validarConfirmPassword();
        }
    }
);

confirmPassword.addEventListener(
    "blur",
    validarConfirmPassword
);

terminos.addEventListener(
    "change",
    validarTerminos
);


/* =========================================================
   MOSTRAR / OCULTAR CONTRASEÑA
   ========================================================= */

togglePassword.addEventListener(
    "click",
    function () {

        if (password.type === "password") {

            password.type = "text";

            togglePassword.textContent =
                "Ocultar";

        } else {

            password.type = "password";

            togglePassword.textContent =
                "Mostrar";
        }
    }
);


toggleConfirmPassword.addEventListener(
    "click",
    function () {

        if (confirmPassword.type === "password") {

            confirmPassword.type = "text";

            toggleConfirmPassword.textContent =
                "Ocultar";

        } else {

            confirmPassword.type = "password";

            toggleConfirmPassword.textContent =
                "Mostrar";
        }
    }
);


/* =========================================================
   MODAL DE TÉRMINOS
   ========================================================= */

function abrirModal() {

    terminosModal.classList.add("active");

    terminosModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";
}


function cerrarModal() {

    terminosModal.classList.remove("active");

    terminosModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";
}


terminosLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        abrirModal();
    }
);


modalClose.addEventListener(
    "click",
    cerrarModal
);


modalOverlay.addEventListener(
    "click",
    cerrarModal
);


acceptTerms.addEventListener(
    "click",
    function () {

        terminos.checked = true;

        validarTerminos();

        cerrarModal();
    }
);


/* =========================================================
   ESC PARA CERRAR MODAL
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            terminosModal.classList.contains("active")
        ) {
            cerrarModal();
        }
    }
);