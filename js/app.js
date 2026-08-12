/* =========================================================
   ZENTRYX
   app.js
   ========================================================= */


/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeMobileMenu();

    initializeSmoothScroll();

    initializeSearch();

    initializeSearchSuggestions();

    initializeScrollEffects();

    initializeRevealAnimations();

});


/* =========================================================
   MENÚ MÓVIL
   ========================================================= */

function initializeMobileMenu() {

    const menuButton =
        document.getElementById("mobileMenuButton");

    const mobileMenu =
        document.getElementById("mobileMenu");

    if (!menuButton || !mobileMenu) {
        return;
    }


    menuButton.addEventListener("click", () => {

        const isOpen =
            mobileMenu.classList.contains("open");


        if (isOpen) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    });


    /*
     * Cerrar menú cuando se selecciona
     * alguna de sus opciones.
     */

    const mobileLinks =
        mobileMenu.querySelectorAll("a");


    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            closeMobileMenu();

        });

    });


    /*
     * Cerrar menú al hacer click fuera.
     */

    document.addEventListener("click", event => {

        const clickedInsideMenu =
            mobileMenu.contains(event.target);

        const clickedButton =
            menuButton.contains(event.target);


        if (
            !clickedInsideMenu &&
            !clickedButton &&
            mobileMenu.classList.contains("open")
        ) {

            closeMobileMenu();

        }

    });

}


/* =========================================================
   ABRIR MENÚ
   ========================================================= */

function openMobileMenu() {

    const mobileMenu =
        document.getElementById("mobileMenu");

    const menuButton =
        document.getElementById("mobileMenuButton");


    if (!mobileMenu) {
        return;
    }


    mobileMenu.style.display = "flex";

    mobileMenu.classList.add("open");


    if (menuButton) {

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        menuButton.textContent = "✕";

    }

}


/* =========================================================
   CERRAR MENÚ
   ========================================================= */

function closeMobileMenu() {

    const mobileMenu =
        document.getElementById("mobileMenu");

    const menuButton =
        document.getElementById("mobileMenuButton");


    if (!mobileMenu) {
        return;
    }


    mobileMenu.classList.remove("open");

    mobileMenu.style.display = "none";


    if (menuButton) {

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.textContent = "☰";

    }

}


/* =========================================================
   SCROLL SUAVE
   ========================================================= */

function initializeSmoothScroll() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");


            if (
                !targetId ||
                targetId === "#"
            ) {

                return;

            }


            const target =
                document.querySelector(targetId);


            if (!target) {
                return;
            }


            event.preventDefault();


            const navbar =
                document.querySelector(".navbar");


            const navbarHeight =
                navbar
                    ? navbar.offsetHeight
                    : 0;


            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight;


            window.scrollTo({

                top: targetPosition,

                behavior: "smooth"

            });

        });

    });

}


/* =========================================================
   BUSCADOR
   ========================================================= */

function initializeSearch() {

    const searchInput =
        document.getElementById("searchInput");

    const searchButton =
        document.getElementById("searchButton");


    if (!searchInput || !searchButton) {
        return;
    }


    /*
     * Buscar con el botón
     */

    searchButton.addEventListener("click", () => {

        performSearch(
            searchInput.value
        );

    });


    /*
     * Buscar presionando ENTER
     */

    searchInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            event.preventDefault();

            performSearch(
                searchInput.value
            );

        }

    });

}


/* =========================================================
   REALIZAR BÚSQUEDA
   ========================================================= */

function performSearch(searchTerm) {

    const term =
        searchTerm
            .trim()
            .toLowerCase();


    if (!term) {

        showSearchMessage(
            "Escribe algo para comenzar a buscar."
        );

        return;

    }


    /*
     * Por ahora redirigimos a explorar.html.
     *
     * Más adelante esta búsqueda será procesada
     * directamente por el catálogo de ZentryX.
     */

    const destination =
        `pages/explorar.html?buscar=${encodeURIComponent(
            searchTerm.trim()
        )}`;


    window.location.href = destination;

}


/* =========================================================
   MENSAJE DE BÚSQUEDA
   ========================================================= */

function showSearchMessage(message) {

    const existing =
        document.querySelector(
            ".search-message"
        );


    if (existing) {
        existing.remove();
    }


    const messageElement =
        document.createElement("div");


    messageElement.className =
        "search-message";


    messageElement.textContent =
        message;


    const searchSection =
        document.querySelector(
            ".search-section"
        );


    if (!searchSection) {
        return;
    }


    searchSection.appendChild(
        messageElement
    );


    /*
     * Estilos directamente desde JS
     * para que no sea necesario modificar
     * el CSS principal solamente por este aviso.
     */

    Object.assign(
        messageElement.style,
        {

            textAlign: "center",

            marginTop: "8px",

            color: "#697080",

            fontSize: "12px",

            fontWeight: "500",

            opacity: "0",

            transition: "opacity 0.25s ease"

        }
    );


    requestAnimationFrame(() => {

        messageElement.style.opacity = "1";

    });


    setTimeout(() => {

        messageElement.style.opacity = "0";


        setTimeout(() => {

            messageElement.remove();

        }, 250);

    }, 2500);

}


/* =========================================================
   BÚSQUEDAS RÁPIDAS
   ========================================================= */

function initializeSearchSuggestions() {

    const suggestions =
        document.querySelectorAll(
            "[data-search]"
        );


    if (!suggestions.length) {
        return;
    }


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    suggestions.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    button.dataset.search;


                if (searchInput) {

                    searchInput.value =
                        value;

                }


                performSearch(value);

            }
        );

    });

}


/* =========================================================
   EFECTOS DEL NAVBAR
   ========================================================= */

function initializeScrollEffects() {

    const navbar =
        document.querySelector(".navbar");


    if (!navbar) {
        return;
    }


    function updateNavbar() {

        if (window.scrollY > 30) {

            navbar.classList.add(
                "navbar-scrolled"
            );

        } else {

            navbar.classList.remove(
                "navbar-scrolled"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );


    updateNavbar();

}


/* =========================================================
   ANIMACIONES REVEAL
   ========================================================= */

function initializeRevealAnimations() {

    const elements =
        document.querySelectorAll(
            ".category-card, " +
            ".business-card, " +
            ".step-card, " +
            ".plan-card, " +
            ".entrepreneur-content, " +
            ".entrepreneur-card"
        );


    if (!elements.length) {
        return;
    }


    /*
     * Estado inicial
     */

    elements.forEach(element => {

        element.classList.add(
            "reveal-element"
        );

    });


    /*
     * Intersection Observer
     */

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "revealed"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {

                threshold: 0.12

            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });


    /*
     * Agregamos los estilos de la animación
     * desde JavaScript.
     */

    addRevealStyles();

}


/* =========================================================
   ESTILOS PARA REVEAL
   ========================================================= */

function addRevealStyles() {

    if (
        document.getElementById(
            "zentryx-reveal-styles"
        )
    ) {

        return;

    }


    const style =
        document.createElement("style");


    style.id =
        "zentryx-reveal-styles";


    style.textContent = `

        .reveal-element {

            opacity: 0;

            transform:
                translateY(25px);

            transition:
                opacity 0.65s ease,
                transform 0.65s ease;

        }


        .reveal-element.revealed {

            opacity: 1;

            transform:
                translateY(0);

        }


        .navbar-scrolled {

            box-shadow:
                0 8px 25px
                rgba(20, 24, 40, 0.07);

        }

    `;


    document.head.appendChild(style);

}


/* =========================================================
   DATOS BASE DE ZENTRYX
   ========================================================= */

/*
 * Estos datos NO son todavía una base de datos.
 *
 * Son solamente la estructura que posteriormente
 * utilizaremos para construir:
 *
 * - Explorar
 * - Perfiles
 * - Catálogos
 * - Búsqueda
 * - Filtros
 *
 * Más adelante podremos mover estos datos a
 * localStorage o archivos JSON.
 */

const zentryxData = {

    categories: [

        {
            id: 1,
            name: "Tecnología",
            slug: "tecnologia",
            icon: "💻"
        },

        {
            id: 2,
            name: "Diseño",
            slug: "diseno",
            icon: "🎨"
        },

        {
            id: 3,
            name: "Comercio",
            slug: "comercio",
            icon: "🛍️"
        },

        {
            id: 4,
            name: "Servicios",
            slug: "servicios",
            icon: "🛠️"
        }

    ],


    businesses: [

        {
            id: 1,

            name: "CodeNova",

            category: "Tecnología",

            location: "Managua",

            verified: true,

            description:
                "Desarrollo de soluciones digitales para emprendimientos.",

            services: [
                "Desarrollo web",
                "Aplicaciones",
                "Sistemas empresariales"
            ]

        },


        {
            id: 2,

            name: "Pixel Studio",

            category: "Diseño",

            location: "Managua",

            verified: true,

            description:
                "Diseño gráfico, identidad visual y contenido creativo.",

            services: [
                "Branding",
                "Diseño gráfico",
                "Contenido digital"
            ]

        },


        {
            id: 3,

            name: "Nica Market",

            category: "Comercio",

            location: "Managua",

            verified: true,

            description:
                "Productos locales y propuestas para consumidores.",

            services: [
                "Productos locales",
                "Comercio",
                "Ventas"
            ]

        }

    ],


    plans: [

        {
            id: "individual",

            name: "Individual",

            price: 9.99

        },

        {
            id: "grup",

            name: "Grup",

            price: 19.99

        },

        {
            id: "enterprise",

            name: "Enterprise",

            price: 49.99

        }

    ]

};


/* =========================================================
   UTILIDADES
   ========================================================= */


/*
 * Obtener negocios
 */

function getBusinesses() {

    return zentryxData.businesses;

}


/*
 * Buscar negocios
 */

function searchBusinesses(term) {

    const search =
        term
            .trim()
            .toLowerCase();


    if (!search) {

        return getBusinesses();

    }


    return getBusinesses()
        .filter(business => {

            return (

                business.name
                    .toLowerCase()
                    .includes(search)

                ||

                business.category
                    .toLowerCase()
                    .includes(search)

                ||

                business.description
                    .toLowerCase()
                    .includes(search)

            );

        });

}


/*
 * Buscar por categoría
 */

function getBusinessesByCategory(
    category
) {

    return getBusinesses()
        .filter(
            business =>
                business.category
                    .toLowerCase() ===
                category
                    .toLowerCase()
        );

}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

/*
 * ZentryX utilizará localStorage durante
 * la etapa frontend del proyecto.
 *
 * Esto nos permitirá simular:
 *
 * - Usuarios
 * - Sesiones
 * - Perfiles
 * - Negocios
 * - Productos
 *
 * sin utilizar todavía un servidor.
 */


/*
 * Guardar usuario
 */

function saveUser(user) {

    const users =
        getUsers();


    users.push(user);


    localStorage.setItem(
        "zentryx_users",
        JSON.stringify(users)
    );

}


/*
 * Obtener usuarios
 */

function getUsers() {

    const users =
        localStorage.getItem(
            "zentryx_users"
        );


    if (!users) {

        return [];

    }


    try {

        return JSON.parse(users);

    } catch {

        return [];

    }

}


/*
 * Obtener sesión actual
 */

function getCurrentUser() {

    const session =
        localStorage.getItem(
            "zentryx_current_user"
        );


    if (!session) {

        return null;

    }


    try {

        return JSON.parse(session);

    } catch {

        return null;

    }

}


/*
 * Crear sesión
 */

function createSession(user) {

    localStorage.setItem(
        "zentryx_current_user",
        JSON.stringify(user)
    );

}


/*
 * Cerrar sesión
 */

function logout() {

    localStorage.removeItem(
        "zentryx_current_user"
    );


    window.location.href =
        "../index.html";

}


/* =========================================================
   EXPONER FUNCIONES
   ========================================================= */

/*
 * Las dejamos disponibles globalmente para
 * las siguientes páginas del proyecto.
 */

window.ZentryX = {

    data: zentryxData,

    getBusinesses,

    searchBusinesses,

    getBusinessesByCategory,

    saveUser,

    getUsers,

    getCurrentUser,

    createSession,

    logout

};