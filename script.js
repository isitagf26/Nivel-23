// ==================================================
// CONFIGURACIÓN
// ==================================================

const XP_MAXIMA = 350;


// ==================================================
// JUGADOR
// ==================================================

let experiencia = 0;
let monedas = 0;
let vidas = 3;

let monedasConseguidas = 0;
let monedasGastadas = 0;


// ==================================================
// MISIONES
// ==================================================

let estadoDesayuno = "bloqueada";

let estadoMision1 = "bloqueada";
let estadoMision2 = "bloqueada";
let estadoMision3 = "bloqueada";

let estadoCena = "oculta";


let recompensaDesayunoRecogida = false;
let recompensaMision1Recogida = false;
let recompensaMision2Recogida = false;
let recompensaMision3Recogida = false;


// ==================================================
// INVENTARIO INTERNO
// ==================================================

let segundosIntentos = 0;

let intentosRasca = 0;
let rascaActivo = null;
let eleccionJugador = 0;
let eleccionJugadorComprada = false;

let mensajeSecretoComprado = false;

let llaveCenaComprada = false;
let llaveCenaUsada = false;

let llave23Comprada = false;


// ==================================================
// STARTER PACK
// ==================================================

let objetosStarter = [];


// ==================================================
// RETOS
// ==================================================

let retos = {

    fotoJuntos: {
        nombre: "📸 RECUERDO DE LA AVENTURA",
        descripcion: "Haz una foto juntos durante la aventura.",
        recompensa: 5,
        desbloqueado: true,
        completado: false
    },

    videojuegoCalle: {
        nombre: "🎮 OBJETO FUERA DE SU MUNDO",
        descripcion: "Encuentra algo relacionado con videojuegos por la calle.",
        recompensa: 15,
        desbloqueado: true,
        completado: false
    },

    objetoRosa: {
        nombre: "🩷 TODO DE ROSA",
        descripcion: "Encuentra un objeto rosa y hazle una foto.",
        recompensa: 10,
        desbloqueado: true,
        completado: false
    },

    tripleA: {
        nombre: "🔤 TRIPLE A",
        descripcion: "Encuentra 3 objetos que empiecen por la letra A.",
        recompensa: 30,
        desbloqueado: true,
        completado: false
    },

    juegoInfancia: {
        nombre: "🕹️ VIAJE AL PASADO",
        descripcion: "Encuentra en OXO un videojuego al que jugaras de pequeño.",
        recompensa: 15,
        desbloqueado: false,
        completado: false
    },

    japon: {
        nombre: "🇯🇵 CAMINO A JAPÓN",
        descripcion: "Encuentra algo relacionado con Japón.",
        recompensa: 20,
        desbloqueado: false,
        completado: false
    },

    peru: {
        nombre: "🇵🇪 CONEXIÓN PERUANA",
        descripcion: "Encuentra algo relacionado con Perú.",
        recompensa: 30,
        desbloqueado: false,
        completado: false
    },

    platoGenko: {
        nombre: "🍣 CRÍTICO GASTRONÓMICO",
        descripcion: "Elige tu plato favorito de Genko.",
        recompensa: 10,
        desbloqueado: false,
        completado: false
    },

    lavaSinAbandonar: {
        nombre: "🌋 SUPERVIVIENTE",
        descripcion: "Completa El Suelo es Lava sin abandonar.",
        recompensa: 200,
        desbloqueado: false,
        completado: false
    }

};

// ==================================================
// RASCA Y GANA
// ==================================================

function elegirPremioRasca() {

    const n = Math.random() * 100;

    if (n < 25) return 0;
    if (n < 45) return 5;
    if (n < 65) return 10;
    if (n < 80) return 15;
    if (n < 90) return 25;
    if (n < 97) return 50;

    return 100;
}



/* ==================================================
   COMPRAR RASCA
================================================== */

function comprarRasca() {

    if (intentosRasca >= 3) {

        resultadoTienda(
            "🎟️ Ya has utilizado tus 3 boletos."
        );

        return;
    }


    /*
       Si existe un boleto pendiente,
       volvemos a él sin cobrar otro.
    */

    if (
        rascaActivo &&
        !rascaActivo.cobrado
    ) {

        mostrarPantalla(
            "pantalla-rasca"
        );

        setTimeout(function () {
            prepararRasca();
        }, 50);

        return;
    }


    /* COBRAR PRECIO DEL BOLETO */

    if (!gastarMonedas(10)) {

        resultadoTienda(
            "❌ No tienes suficientes monedas."
        );

        return;
    }


    /* NUEVO BOLETO */

    intentosRasca++;

    rascaActivo = {

        premio:
            elegirPremioRasca(),

        revelado:
            false,

        cobrado:
            false

    };


    guardarPartida();

    actualizarTienda();


    mostrarPantalla(
        "pantalla-rasca"
    );


    /*
       Esperamos un instante para que
       la pantalla ya tenga dimensiones.
    */

    setTimeout(function () {

        prepararRasca();

    }, 50);
}



/* ==================================================
   REINICIAR VISUALMENTE EL BOLETO
================================================== */

function resetearRasca() {

    const canvas =
        document.getElementById(
            "canvas-rasca"
        );

    const premio =
        document.getElementById(
            "premio-rasca"
        );

    const estado =
        document.getElementById(
            "estado-rasca"
        );

    const cobrar =
        document.getElementById(
            "cobrar-rasca"
        );


    if (canvas) {

        /*
           MUY IMPORTANTE:
           restauramos el canvas del
           boleto anterior.
        */

        canvas.style.opacity = "1";

        canvas.style.pointerEvents =
            "auto";


        canvas.onpointerdown = null;
        canvas.onpointermove = null;
        canvas.onpointerup = null;
        canvas.onpointercancel = null;


        const ctx =
            canvas.getContext("2d");


        if (ctx) {

            ctx.setTransform(
                1,
                0,
                0,
                1,
                0,
                0
            );

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

        }

    }


    if (premio) {

        premio.textContent =
            "🪙 ?";

    }


    if (estado) {

        estado.textContent =
            "Mantén pulsado y mueve el ratón, o desliza el dedo.";

    }


    if (cobrar) {

        cobrar.disabled =
            true;

        cobrar.textContent =
            "DESCUBRE EL PREMIO";

    }

}



/* ==================================================
   PREPARAR BOLETO
================================================== */

function prepararRasca() {

    const zona =
        document.getElementById(
            "zona-rasca"
        );

    const canvas =
        document.getElementById(
            "canvas-rasca"
        );

    const premio =
        document.getElementById(
            "premio-rasca"
        );

    const estado =
        document.getElementById(
            "estado-rasca"
        );

    const cobrar =
        document.getElementById(
            "cobrar-rasca"
        );


    if (
        !zona ||
        !canvas ||
        !premio ||
        !estado ||
        !cobrar ||
        !rascaActivo
    ) {

        return;

    }


    /*
       LIMPIAMOS COMPLETAMENTE
       EL BOLETO ANTERIOR
    */

    resetearRasca();


    /* PREMIO OCULTO */

    if (
        rascaActivo.premio === 100
    ) {

        premio.textContent =
            "👑 JACKPOT · +100 🪙";

    }

    else if (
        rascaActivo.premio === 0
    ) {

        premio.textContent =
            "💀 0 🪙";

    }

    else {

        premio.textContent =
            "🪙 +" +
            rascaActivo.premio;

    }



    requestAnimationFrame(
        function () {

            const rect =
                zona.getBoundingClientRect();

            const dpr =
                window.devicePixelRatio ||
                1;


            /*
               NUEVO CANVAS
            */

            canvas.width =
                Math.max(
                    1,
                    Math.floor(
                        rect.width *
                        dpr
                    )
                );

            canvas.height =
                Math.max(
                    1,
                    Math.floor(
                        rect.height *
                        dpr
                    )
                );


            canvas.style.width =
                rect.width + "px";

            canvas.style.height =
                rect.height + "px";


            canvas.style.opacity =
                "1";

            canvas.style.pointerEvents =
                "auto";


            const ctx =
                canvas.getContext("2d");


            /*
               Evita acumular escalados
               entre boleto y boleto.
            */

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );


            ctx.globalCompositeOperation =
                "source-over";


            /* CAPA PLATEADA */

            const grad =
                ctx.createLinearGradient(
                    0,
                    0,
                    rect.width,
                    rect.height
                );


            grad.addColorStop(
                0,
                "#8d8d99"
            );

            grad.addColorStop(
                0.5,
                "#d7d7de"
            );

            grad.addColorStop(
                1,
                "#777783"
            );


            ctx.fillStyle =
                grad;


            ctx.fillRect(
                0,
                0,
                rect.width,
                rect.height
            );


            /* TEXTO */

            ctx.fillStyle =
                "rgba(25, 22, 39, .72)";

            ctx.font =
                "bold 18px sans-serif";

            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";


            ctx.fillText(
                "RASCA AQUÍ",
                rect.width / 2,
                rect.height / 2
            );


            let rascando =
                false;

            let descubierto =
                false;



            /* ==============================
               RASCAR
            ============================== */

            function rascar(ev) {

                if (
                    !rascando ||
                    descubierto
                ) {

                    return;

                }


                ev.preventDefault();


                const r =
                    canvas.getBoundingClientRect();


                const x =
                    ev.clientX -
                    r.left;

                const y =
                    ev.clientY -
                    r.top;


                ctx.globalCompositeOperation =
                    "destination-out";


                ctx.beginPath();


                ctx.arc(
                    x,
                    y,
                    25,
                    0,
                    Math.PI * 2
                );


                ctx.fill();


                comprobarRascado();

            }



            /* ==============================
               COMPROBAR %
            ============================== */

            function comprobarRascado() {

                const img =
                    ctx.getImageData(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    ).data;


                let transparentes =
                    0;

                let muestras =
                    0;


                for (
                    let i = 3;
                    i < img.length;
                    i += 4 * 30
                ) {

                    muestras++;


                    if (
                        img[i] < 80
                    ) {

                        transparentes++;

                    }

                }


                /*
                   Al rascar aproximadamente
                   el 42%, se descubre.
                */

                if (
                    muestras > 0 &&
                    transparentes /
                    muestras >=
                    0.42
                ) {

                    descubierto =
                        true;


                    rascaActivo.revelado =
                        true;


                    canvas.style.opacity =
                        "0";


                    canvas.style.pointerEvents =
                        "none";


                    cobrar.disabled =
                        false;


                    cobrar.textContent =
                        "COBRAR PREMIO";


                    if (
                        rascaActivo.premio ===
                        100
                    ) {

                        estado.textContent =
                            "👑 ¡JACKPOT!";

                    }

                    else if (
                        rascaActivo.premio ===
                        0
                    ) {

                        estado.textContent =
                            "💀 Esta vez no ha habido suerte.";

                    }

                    else {

                        estado.textContent =
                            "✨ ¡Premio descubierto!";

                    }

                }

            }



            /* ==============================
               RATÓN + TÁCTIL
            ============================== */

            canvas.onpointerdown =
                function (ev) {

                    rascando =
                        true;


                    try {

                        canvas.setPointerCapture(
                            ev.pointerId
                        );

                    }

                    catch (_) {}


                    rascar(ev);

                };


            canvas.onpointermove =
                rascar;


            canvas.onpointerup =
                function () {

                    rascando =
                        false;

                };


            canvas.onpointercancel =
                function () {

                    rascando =
                        false;

                };

        }
    );

}



/* ==================================================
   COBRAR PREMIO
================================================== */

function cobrarRasca() {

    if (
        !rascaActivo ||
        rascaActivo.cobrado
    ) {

        return;

    }


    const premio =
        rascaActivo.premio;


    /*
       Entregamos el premio
       UNA SOLA VEZ.
    */

    monedas +=
        premio;


    rascaActivo.cobrado =
        true;


    /*
       IMPORTANTE:
       destruimos el boleto actual.
    */

    rascaActivo =
        null;


    guardarPartida();


    /*
       Limpiamos el canvas ANTES
       de volver a la tienda.
    */

    resetearRasca();


    actualizarTodo();

    actualizarTienda();



    /* MENSAJE */

    if (
        premio === 100
    ) {

        resultadoTienda(
            "👑 JACKPOT: has ganado 100 monedas."
        );

    }

    else if (
        premio === 0
    ) {

        resultadoTienda(
            "💀 El boleto no tenía premio."
        );

    }

    else {

        resultadoTienda(
            "🎟️ Has ganado " +
            premio +
            " monedas."
        );

    }


    /*
       AHORA SÍ SALIMOS
       DEL RASCA.
    */

    mostrarPantalla(
        "pantalla-tienda"
    );

}



/* ==================================================
   VOLVER A TIENDA
================================================== */

function volverTiendaDesdeRasca() {

    /*
       Si el boleto ya se cobró,
       simplemente salimos.
    */

    if (!rascaActivo) {

        resetearRasca();

        actualizarTienda();

        mostrarPantalla(
            "pantalla-tienda"
        );

        return;
    }


    guardarPartida();

    actualizarTienda();

    mostrarPantalla(
        "pantalla-tienda"
    );
}

// ==================================================
// LOGROS
// ==================================================

let logros = {

    desayuno: {
        icono: "🥐",
        nombre: "CON EL ESTÓMAGO LLENO",
        descripcion: "Completa la misión del desayuno.",
        desbloqueado: false
    },

    player2: {
        icono: "📸",
        nombre: "PLAYER 2",
        descripcion: "Completa el reto de la foto juntos.",
        desbloqueado: false
    },

    insertCoin: {
        icono: "🪙",
        nombre: "INSERT COIN",
        descripcion: "Consigue tus primeras monedas.",
        desbloqueado: false
    },

    nostalgia: {
        icono: "🕹️",
        nombre: "NOSTALGIA DESBLOQUEADA",
        descripcion: "Encuentra un juego de tu infancia en OXO.",
        desbloqueado: false
    },

    japon: {
        icono: "🇯🇵",
        nombre: "CAMINO A JAPÓN",
        descripcion: "Completa el reto relacionado con Japón.",
        desbloqueado: false
    },

    genko: {
        icono: "🍣",
        nombre: "ITADAKIMASU!",
        descripcion: "Completa la misión de Genko.",
        desbloqueado: false
    },

    gameMaster: {
        icono: "👑",
        nombre: "AQUÍ MANDO YO",
        descripcion: "Utiliza Elección del jugador.",
        desbloqueado: false
    },

    primeraCompra: {
        icono: "🛒",
        nombre: "CAPITALISMO DESBLOQUEADO",
        descripcion: "Realiza tu primera compra.",
        desbloqueado: false
    },

    ahorrador: {
        icono: "💰",
        nombre: "AHORRADOR PROFESIONAL",
        descripcion: "Consigue tener 100 monedas a la vez.",
        desbloqueado: false
    },

    superviviente: {
        icono: "🌋",
        nombre: "SUPERVIVIENTE",
        descripcion: "Supera El Suelo es Lava sin abandonar.",
        desbloqueado: false
    },

    llaveCena: {
        icono: "🔑",
        nombre: "¿QUÉ ABRIRÁ ESTO?",
        descripcion: "Consigue una llave secreta.",
        desbloqueado: false
    },

    cena: {
        icono: "🍽️",
        nombre: "UNA AVENTURA NO TERMINA CON EL ESTÓMAGO VACÍO",
        descripcion: "Completa la misión secreta.",
        desbloqueado: false
    },

    nivel23: {
        icono: "🗝️",
        nombre: "NIVEL 23",
        descripcion: "Consigue la llave legendaria.",
        desbloqueado: false
    },

    secreto: {
        icono: "🥚",
        nombre: "FUERA DE LOS LÍMITES",
        descripcion: "Logro secreto.",
        desbloqueado: false,
        secreto: true
    }

};


// ==================================================
// LAVA
// ==================================================

let rutaCorrectaLava = [
    "E5",
    "D5",
    "D4",
    "C4",
    "C3",
    "C2",
    "B2",
    "A2"
];

let rutaJugadorLava = [];

let intentosLava = 1;

let bloqueoLava = false;


// ==================================================
// PANTALLAS
// ==================================================

function mostrarPantalla(id) {

    document
        .querySelectorAll(".pantalla")
        .forEach(function (pantalla) {

            pantalla.classList.remove(
                "pantalla-activa"
            );

        });


    const destino =
        document.getElementById(id);


    if (destino) {

        destino.classList.add(
            "pantalla-activa"
        );

    }


    window.scrollTo(0, 0);

    setTimeout(function () {
        actualizarHudPersonajes();
    }, 0);
}


function comenzarJuego() {

    actualizarTodo();

    mostrarPantalla(
        "pantalla-juego"
    );
}


function volverJuego() {

    actualizarTodo();

    mostrarPantalla(
        "pantalla-juego"
    );
}



// ==================================================
// PRUEBAS PENDIENTES
// ==================================================

function obtenerPruebaPendiente() {

    // Starter Pack realizado, pero LoL todavía no superado.
    if (
        estadoDesayuno !== "bloqueada" &&
        estadoMision1 === "bloqueada"
    ) {
        return "lol";
    }

    // OXO completado y recompensa recogida, pero Nikkei pendiente.
    if (
        estadoMision1 === "completada" &&
        recompensaMision1Recogida &&
        estadoMision2 === "bloqueada"
    ) {
        return "nikkei";
    }

    // Genko completado y recompensa recogida, pero ruta de lava pendiente.
    if (
        estadoMision2 === "completada" &&
        recompensaMision2Recogida &&
        estadoMision3 === "bloqueada"
    ) {
        return "lava";
    }

    return null;
}


function actualizarBotonPruebaPendiente() {

    const boton =
        document.getElementById(
            "boton-prueba-pendiente"
        );

    if (!boton) {
        return;
    }

    const prueba =
        obtenerPruebaPendiente();

    if (!prueba) {

        boton.classList.add(
            "zona-oculta"
        );

        return;
    }

    boton.classList.remove(
        "zona-oculta"
    );

    if (prueba === "lol") {
        boton.textContent =
            "⚔️ PRUEBA PENDIENTE · LEAGUE OF LEGENDS";
    }

    else if (prueba === "nikkei") {
        boton.textContent =
            "⚔️ PRUEBA PENDIENTE · NIKKEI";
    }

    else if (prueba === "lava") {
        boton.textContent =
            "⚔️ PRUEBA PENDIENTE · RUTA DE LAVA";
    }
}


function abrirPruebaPendiente() {

    const prueba =
        obtenerPruebaPendiente();

    if (prueba === "lol") {

        mostrarPantalla(
            "pantalla-reto-lol"
        );

        return;
    }

    if (prueba === "nikkei") {

        mostrarPantalla(
            "pantalla-reto-nikkei"
        );

        return;
    }

    if (prueba === "lava") {

        mostrarPantalla(
            "pantalla-reto-lava"
        );

        return;
    }

    notificar(
        "✓",
        "SIN PRUEBAS PENDIENTES",
        "No hay ninguna prueba de acceso pendiente."
    );

    volverJuego();
}



// ==================================================
// PERSONAJES
// ==================================================

function abrirPersonajes() {

    let xp =
        document.getElementById(
            "personaje-xp"
        );

    let hp =
        document.getElementById(
            "personaje-vidas"
        );

    let oro =
        document.getElementById(
            "personaje-monedas"
        );


    if (xp) {
        xp.textContent =
            experiencia;
    }


    if (hp) {
        hp.textContent =
            vidas;
    }


    if (oro) {
        oro.textContent =
            monedas;
    }


    mostrarPantalla(
        "pantalla-personajes"
    );
}
function cerrarFichaPersonaje() {

    const modal = document.getElementById("modal-personaje");

    if (modal) {
        modal.remove();
    }
}


function actualizarHudPersonajes() {

    const hud = document.getElementById("hud-personajes");

    if (!hud) {
        return;
    }

    const pantallaActiva =
        document.querySelector(".pantalla.pantalla-activa");

    if (!pantallaActiva) {
        hud.classList.add("zona-oculta");
        return;
    }

    const ocultarEn = [
        "pantalla-inicio",
        "pantalla-lol-1",
        "pantalla-lol-2",
        "pantalla-lol-3",
        "pantalla-tablero-lava",
        "pantalla-resultado-starter"
    ];

    if (ocultarEn.includes(pantallaActiva.id)) {
        hud.classList.add("zona-oculta");
    }
    else {
        hud.classList.remove("zona-oculta");
    }
}

// ==================================================
// NOTIFICACIONES
// ==================================================

function notificar(
    icono,
    titulo,
    texto
) {

    let caja =
        document.getElementById(
            "notificacion"
        );


    if (!caja) {
        return;
    }


    document.getElementById(
        "notificacion-icono"
    ).textContent =
        icono;


    document.getElementById(
        "notificacion-titulo"
    ).textContent =
        titulo;


    document.getElementById(
        "notificacion-texto"
    ).textContent =
        texto;


    caja.classList.add(
        "visible"
    );


    setTimeout(function () {

        caja.classList.remove(
            "visible"
        );

    }, 3500);
}


// ==================================================
// INTERFAZ
// ==================================================

function actualizarTodo() {

    actualizarJugador();

    actualizarMapa();

    actualizarDashboard();

    actualizarBotonFinal();

    actualizarBotonPruebaPendiente();

    // actualizarMisiones();

    comprobarLogrosAutomaticos();
}
function abrirMisiones() {

    actualizarMisiones();

    mostrarPantalla("pantalla-misiones");

}


function actualizarMisiones() {

    /* DESAYUNO */

    actualizarTarjetaMision(
        "desayuno",
        estadoDesayuno,
        abrirDesayunoMapa
    );


    /* OXO = MISIÓN 1 */

    actualizarTarjetaMision(
        "oxo",
        estadoMision1,
        abrirZona1
    );


    /* GENKO = MISIÓN 2 */

    actualizarTarjetaMision(
        "genko",
        estadoMision2,
        abrirMision2
    );


    /* SUELO ES LAVA = MISIÓN 3 */

    actualizarTarjetaMision(
        "lava",
        estadoMision3,
        abrirMision3
    );


    /* CENA */

    actualizarTarjetaMision(
        "cena",
        estadoCena,
        abrirCenaMapa
    );

}
function actualizarTarjetaMision(
    id,
    estado,
    accion
) {

    const tarjeta =
        document.getElementById(
            "tarjeta-mision-" + id
        );

    const icono =
        document.getElementById(
            "icono-mision-" + id
        );

    const texto =
        document.getElementById(
            "estado-texto-" + id
        );

    const nombre =
        document.getElementById(
            "nombre-mision-" + id
        );


    if (
        !tarjeta ||
        !icono ||
        !texto ||
        !nombre
    ) {
        return;
    }


    /* =========================================
       NOMBRES DE LAS MISIONES
    ========================================= */

    const nombresMisiones = {

        desayuno:
            "DESAYUNO",

        oxo:
            "OXO · MUSEO DE LOS VIDEOJUEGOS",

        genko:
            "GENKO",

        lava:
            "EL SUELO ES LAVA",

        cena:
            "RECARGA NOCTURNA"

    };


    /* =========================================
       IMAGEN PROPIA DE CADA MISIÓN
    ========================================= */

    const iconosMisiones = {

        desayuno:
            "assets/iconos/desayuno.png",

        oxo:
            "assets/iconos/oxo.png",

        genko:
            "assets/iconos/genko.png",

        lava:
            "assets/iconos/lava.png",

        cena:
            "assets/iconos/cena.png"

    };


    /* =========================================
       LIMPIAR ESTADOS ANTERIORES
    ========================================= */

    tarjeta.classList.remove(
        "bloqueada",
        "disponible",
        "enCurso",
        "completada"
    );


    /* =========================================
       MISIÓN COMPLETADA
    ========================================= */

 if (estado === "completada") {

    const iconosCompletadas = {
        desayuno: "assets/iconos/desayuno.png",
        oxo: "assets/iconos/oxo.png",
        genko: "assets/iconos/genko.png",
        lava: "assets/iconos/lava.png",
        cena: "assets/iconos/cena.png"
    };

    icono.src =
        iconosCompletadas[id] ||
        "assets/iconos/mision completada.png";

    texto.textContent =
        "MISIÓN COMPLETADA";

    tarjeta.onclick = null;

    return;
}

    /* =========================================
       MISIÓN DISPONIBLE
       → APARECE SU IMAGEN
    ========================================= */

    if (estado === "disponible") {

        tarjeta.classList.add(
            "disponible"
        );

        nombre.textContent =
            nombresMisiones[id];

        icono.src =
            iconosMisiones[id];

        texto.textContent =
            "MISIÓN DISPONIBLE";

        tarjeta.onclick =
            accion || null;

        return;
    }


    /* =========================================
       MISIÓN EN CURSO
       → MANTIENE SU IMAGEN
    ========================================= */

    if (estado === "enCurso") {

        tarjeta.classList.add(
            "enCurso"
        );

        nombre.textContent =
            nombresMisiones[id];

        icono.src =
            iconosMisiones[id];

        texto.textContent =
            "MISIÓN EN CURSO";

        tarjeta.onclick =
            accion || null;

        return;
    }


    /* =========================================
       MISIÓN BLOQUEADA / OCULTA
       → PERGAMINO CON CANDADO
    ========================================= */

    tarjeta.classList.add(
        "bloqueada"
    );

    nombre.textContent =
        "???";

    icono.src =
        "assets/iconos/mision bloqueada.png";

    texto.textContent =
        "MISIÓN BLOQUEADA";

    tarjeta.onclick =
        null;
}
// ==================================================
// DASHBOARD PRINCIPAL
// ==================================================

function actualizarDashboard() {

    actualizarMapaDashboard();
    actualizarAventuraDashboard();

}


// ==================================================
// MAPA DEL DASHBOARD
// ==================================================

function actualizarMapaDashboard() {

    const fase = obtenerFaseMapa();
    const datos = mapasNivel23[fase];

    if (!datos) {
        return;
    }


    const imagen =
        document.getElementById(
            "imagen-mapa-dashboard"
        );

    const titulo =
        document.getElementById(
            "titulo-mapa-dashboard"
        );

    const descripcion =
        document.getElementById(
            "descripcion-mapa-dashboard"
        );


    if (imagen) {

        if (
            imagen.getAttribute("src") !==
            datos.imagen
        ) {

            imagen.classList.add(
                "dashboard-mapa-cambiando"
            );


            setTimeout(function () {

                imagen.src =
                    datos.imagen;

                imagen.classList.remove(
                    "dashboard-mapa-cambiando"
                );

            }, 180);
        }
    }


    if (titulo) {

        titulo.textContent =
            datos.numero +
            " · " +
            datos.titulo;
    }


    if (descripcion) {

        descripcion.textContent =
            datos.descripcion;
    }
}


// ==================================================
// OBJETIVO ACTUAL DEL DASHBOARD
// ==================================================

function obtenerObjetivoDashboard() {

    // ------------------------------------------
    // 1 · STARTER PACK
    // ------------------------------------------

    if (
        estadoDesayuno === "bloqueada"
    ) {

        return {

            icono: "🎒",

            etiqueta:
                "MISIÓN INICIAL",

            titulo:
                "PREPARA TU STARTER PACK",

            descripcion:
                "Elige los objetos necesarios para comenzar la aventura.",

            boton:
                "ABRIR STARTER PACK",

            accion:
                function () {

                    mostrarPantalla(
                        "pantalla-starter-pack"
                    );
                }

        };
    }


    // ------------------------------------------
    // 2 · DESAYUNO
    // ------------------------------------------

    if (
        estadoDesayuno === "disponible"
    ) {

        return {

            icono: "☕",

            etiqueta:
                "MISIÓN SECUNDARIA",

            titulo:
                "RECUPERA ENERGÍA",

            descripcion:
                "Una nueva ubicación ha sido descubierta.",

            boton:
                "IR AL DESAYUNO",

            accion:
                abrirDesayunoMapa

        };
    }


    if (
        estadoDesayuno === "enCurso"
    ) {

        return {

            icono: "🥐",

            etiqueta:
                "MISIÓN EN CURSO",

            titulo:
                "DESAYUNO",

            descripcion:
                "Completa la misión para continuar la aventura.",

            boton:
                "CONTINUAR MISIÓN",

            accion:
                abrirDesayunoMapa

        };
    }


    if (
        estadoDesayuno === "completada" &&
        !recompensaDesayunoRecogida
    ) {

        return {

            icono: "🎁",

            etiqueta:
                "RECOMPENSA DISPONIBLE",

            titulo:
                "MISIÓN COMPLETADA",

            descripcion:
                "Recoge tu recompensa para desbloquear la siguiente prueba.",

            boton:
                "RECOGER RECOMPENSA",

            accion:
                abrirDesayunoMapa

        };
    }


    // ------------------------------------------
    // 3 · PRUEBA LOL
    // ------------------------------------------

    if (
        estadoMision1 === "bloqueada"
    ) {

        return {

            icono: "⚔️",

            etiqueta:
                "PRUEBA DE ACCESO",

            titulo:
                "LEAGUE OF LEGENDS",

            descripcion:
                "Supera la prueba para revelar la siguiente ubicación.",

            boton:
                "INICIAR PRUEBA",

            accion:
                abrirPruebaPendiente

        };
    }


    // ------------------------------------------
    // 4 · OXO
    // ------------------------------------------

    if (
        estadoMision1 === "disponible"
    ) {

        return {

            icono: "🎮",

            etiqueta:
                "MISIÓN 01",

            titulo:
                "OXO",

            descripcion:
                "La primera misión principal ya está disponible.",

            boton:
                "IR A OXO",

            accion:
                abrirZona1

        };
    }


    if (
        estadoMision1 === "enCurso"
    ) {

        return {

            icono: "🕹️",

            etiqueta:
                "MISIÓN EN CURSO",

            titulo:
                "OXO",

            descripcion:
                "Continúa explorando esta parte de la aventura.",

            boton:
                "CONTINUAR OXO",

            accion:
                abrirZona1

        };
    }


    if (
        estadoMision1 === "completada" &&
        !recompensaMision1Recogida
    ) {

        return {

            icono: "🎁",

            etiqueta:
                "RECOMPENSA DISPONIBLE",

            titulo:
                "OXO COMPLETADO",

            descripcion:
                "Recoge tu recompensa para descubrir la siguiente prueba.",

            boton:
                "RECOGER RECOMPENSA",

            accion:
                abrirZona1

        };
    }


    // ------------------------------------------
    // 5 · PRUEBA NIKKEI
    // ------------------------------------------

    if (
        estadoMision1 === "completada" &&
        recompensaMision1Recogida &&
        estadoMision2 === "bloqueada"
    ) {

        return {

            icono: "🇯🇵",

            etiqueta:
                "PRUEBA DE ACCESO",

            titulo:
                "NIKKEI",

            descripcion:
                "Descifra la transmisión para revelar una nueva ubicación.",

            boton:
                "INICIAR PRUEBA",

            accion:
                abrirPruebaPendiente

        };
    }


    // ------------------------------------------
    // 6 · GENKO
    // ------------------------------------------

    if (
        estadoMision2 === "disponible"
    ) {

        return {

            icono: "🍣",

            etiqueta:
                "MISIÓN 02",

            titulo:
                "GENKO",

            descripcion:
                "Una nueva ubicación ha aparecido en el mapa.",

            boton:
                "IR A GENKO",

            accion:
                abrirMision2

        };
    }


    if (
        estadoMision2 === "enCurso"
    ) {

        return {

            icono: "🍱",

            etiqueta:
                "MISIÓN EN CURSO",

            titulo:
                "GENKO",

            descripcion:
                "La aventura gastronómica continúa.",

            boton:
                "CONTINUAR GENKO",

            accion:
                abrirMision2

        };
    }


    if (
        estadoMision2 === "completada" &&
        !recompensaMision2Recogida
    ) {

        return {

            icono: "🎁",

            etiqueta:
                "RECOMPENSA DISPONIBLE",

            titulo:
                "GENKO COMPLETADO",

            descripcion:
                "Recoge tu recompensa para continuar.",

            boton:
                "RECOGER RECOMPENSA",

            accion:
                abrirMision2

        };
    }


    // ------------------------------------------
    // 7 · PRUEBA DE LAVA
    // ------------------------------------------

    if (
        estadoMision2 === "completada" &&
        recompensaMision2Recogida &&
        estadoMision3 === "bloqueada"
    ) {

        return {

            icono: "🔥",

            etiqueta:
                "PRUEBA DE ACCESO",

            titulo:
                "RUTA DE LAVA",

            descripcion:
                "Encuentra el camino correcto para desbloquear la siguiente misión.",

            boton:
                "INICIAR PRUEBA",

            accion:
                abrirPruebaPendiente

        };
    }


    // ------------------------------------------
    // 8 · SUELO ES LAVA
    // ------------------------------------------

    if (
        estadoMision3 === "disponible"
    ) {

        return {

            icono: "🌋",

            etiqueta:
                "MISIÓN 03",

            titulo:
                "EL SUELO ES LAVA",

            descripcion:
                "La siguiente misión ya está disponible.",

            boton:
                "ABRIR MISIÓN",

            accion:
                abrirMision3

        };
    }


    if (
        estadoMision3 === "enCurso"
    ) {

        return {

            icono: "🔥",

            etiqueta:
                "MISIÓN EN CURSO",

            titulo:
                "EL SUELO ES LAVA",

            descripcion:
                "Sobrevive y completa la misión.",

            boton:
                "CONTINUAR MISIÓN",

            accion:
                abrirMision3

        };
    }


    if (
        estadoMision3 === "completada" &&
        !recompensaMision3Recogida
    ) {

        return {

            icono: "🎁",

            etiqueta:
                "RECOMPENSA DISPONIBLE",

            titulo:
                "MISIÓN 03 COMPLETADA",

            descripcion:
                "Recoge la recompensa antes de continuar.",

            boton:
                "RECOGER RECOMPENSA",

            accion:
                abrirMision3

        };
    }


    // ------------------------------------------
    // 9 · CONSEGUIR LLAVE DE LA CENA
    // ------------------------------------------

    if (
        estadoMision3 === "completada" &&
        recompensaMision3Recogida &&
        !llaveCenaComprada
    ) {

        return {

            icono: "🔑",

            etiqueta:
                "OBJETO NECESARIO",

            titulo:
                "BUSCA UNA LLAVE",

            descripcion:
                "Hay una ubicación secreta, pero necesitas un objeto de la tienda para descubrirla.",

            boton:
                "IR A LA TIENDA",

            accion:
                abrirTienda

        };
    }


    // ------------------------------------------
    // 10 · LLAVE COMPRADA
    // ------------------------------------------

    if (
        llaveCenaComprada &&
        !llaveCenaUsada
    ) {

        return {

            icono: "🔐",

            etiqueta:
                "UBICACIÓN SECRETA",

            titulo:
                "UNA PUERTA TE ESPERA",

            descripcion:
                "Has conseguido la llave. La nueva ubicación ya aparece en el mapa.",

            boton:
                "IR A LA UBICACIÓN",

            accion:
                abrirCenaMapa

        };
    }


    // ------------------------------------------
    // 11 · CENA
    // ------------------------------------------

    if (
        estadoCena === "disponible"
    ) {

        return {

            icono: "🍽️",

            etiqueta:
                "MISIÓN SECRETA",

            titulo:
                "RECARGA NOCTURNA",

            descripcion:
                "La misión secreta ha sido desbloqueada.",

            boton:
                "INICIAR MISIÓN",

            accion:
                abrirCenaMapa

        };
    }


    if (
        estadoCena === "enCurso"
    ) {

        return {

            icono: "🌙",

            etiqueta:
                "MISIÓN EN CURSO",

            titulo:
                "RECARGA NOCTURNA",

            descripcion:
                "Disfruta de la última parada antes del final.",

            boton:
                "CONTINUAR MISIÓN",

            accion:
                abrirCenaMapa

        };
    }


    // ------------------------------------------
    // 12 · CASTILLO
    // ------------------------------------------

    if (
        estadoCena === "completada"
    ) {

        return {

            icono: "🏰",

            etiqueta:
                "DESTINO FINAL",

            titulo:
                "EL CASTILLO",

            descripcion:
                "La última zona del Nivel 23 ha sido revelada.",

            boton:
                puedeVerFinal()
                    ? "ENTRAR AL CASTILLO"
                    : "VER MAPA FINAL",

            accion:
                puedeVerFinal()
                    ? abrirFinal
                    : abrirMapa

        };
    }


    // ------------------------------------------
    // SEGURIDAD
    // ------------------------------------------

    return {

        icono: "🗺️",

        etiqueta:
            "AVENTURA",

        titulo:
            "CONTINÚA EXPLORANDO",

        descripcion:
            "Consulta el mapa para descubrir tu siguiente objetivo.",

        boton:
            "VER MAPA",

        accion:
            abrirMapa

    };
}


// ==================================================
// PINTAR OBJETIVO EN EL DASHBOARD
// ==================================================

function actualizarAventuraDashboard() {

    const panel =
        document.querySelector(
            ".estado-aventura"
        );

    const boton =
        document.querySelector(
            ".boton-dashboard-principal"
        );


    if (!panel || !boton) {
        return;
    }


    const objetivo =
        obtenerObjetivoDashboard();


    panel.innerHTML = `

        <small>
            ${objetivo.etiqueta}
        </small>

        <div class="icono-aventura">
            ${objetivo.icono}
        </div>

        <h2>
            ${objetivo.titulo}
        </h2>

        <p>
            ${objetivo.descripcion}
        </p>

    `;


    boton.textContent =
        objetivo.boton;


    boton.onclick =
        objetivo.accion;
}

function actualizarJugador() {

    let xp =
        document.getElementById(
            "experiencia"
        );

    let coins =
        document.getElementById(
            "monedas"
        );

    let hp =
        document.getElementById(
            "vidas"
        );

    let numero =
        document.getElementById(
            "numero-logros"
        );


    if (xp) {
        xp.textContent = experiencia;
    }

    if (coins) {
        coins.textContent = monedas;
    }

    if (hp) {
        hp.textContent = vidas;
    }

    if (numero) {
        numero.textContent =
            contarLogros();
    }


    let porcentaje =
        Math.min(
            experiencia / XP_MAXIMA * 100,
            100
        );


    let barra =
        document.getElementById(
            "barra-xp"
        );


    if (barra) {
        barra.style.width =
            porcentaje + "%";
    }


    let texto =
        document.getElementById(
            "texto-nivel"
        );


    if (texto) {

        texto.textContent =
            experiencia >= XP_MAXIMA
                ? "⭐ NIVEL 23 COMPLETADO"
                : "NIVEL 23 EN PROGRESO";
    }
}


// ==================================================
// MONEDAS
// ==================================================

function darMonedas(cantidad) {

    monedas += cantidad;

    monedasConseguidas += cantidad;

    comprobarLogrosAutomaticos();
}


function gastarMonedas(cantidad) {

    if (monedas < cantidad) {
        return false;
    }

    monedas -= cantidad;

    monedasGastadas += cantidad;

    desbloquearLogro(
        "primeraCompra"
    );

    guardarPartida();

    return true;
}

// ==================================================
// MAPA INTERACTIVO
// ==================================================

const mapasNivel23 = {

    1: {
        imagen:
            "assets/mapa/mapa-01-casa.png",

        numero: "01",

        titulo:
            "LA CASA",

        descripcion:
            "Solo el comienzo"
    },


    2: {
        imagen:
            "assets/mapa/mapa-02-desayuno.png",

        numero: "02",

        titulo:
            "MISIÓN SECUNDARIA",

        descripcion:
            "Desayuno descubierto"
    },


    3: {
        imagen:
            "assets/mapa/mapa-03-oxo.png",

        numero: "03",

        titulo:
            "OXO",

        descripcion:
            "El camino se abre"
    },


    4: {
        imagen:
            "assets/mapa/mapa-04-genko.png",

        numero: "04",

        titulo:
            "GENKO",

        descripcion:
            "Nuevos horizontes"
    },


    5: {
        imagen:
            "assets/mapa/mapa-05-lava.png",

        numero: "05",

        titulo:
            "EL SUELO ES LAVA",

        descripcion:
            "Casi todo a la vista"
    },


    6: {
        imagen:
            "assets/mapa/mapa-06-cena.png",

        numero: "06",

        titulo:
            "LA CENA",

        descripcion:
            "Todo revelado"
    },


    7: {
        imagen:
            "assets/mapa/mapa-07-castillo.png",

        numero: "07",

        titulo:
            "EL CASTILLO",

        descripcion:
            "El final... o el inicio"
    }

};


// ==================================================
// CALCULAR FASE
// ==================================================

function obtenerFaseMapa() {

    let fase = 1;

    // Starter Pack completado → mapa del desayuno
    if (estadoDesayuno !== "bloqueada") {
        fase = 2;
    }

    // Prueba de League of Legends superada → mapa OXO
    if (estadoMision1 !== "bloqueada") {
        fase = 3;
    }

    // Prueba de Nikkei superada → mapa Genko
    if (estadoMision2 !== "bloqueada") {
        fase = 4;
    }

    // Prueba de lava superada → mapa Suelo es lava
    if (estadoMision3 !== "bloqueada") {
        fase = 5;
    }

    // Llave comprada → mapa Cena
    if (llaveCenaComprada) {
        fase = 6;
    }

    // Cena completada → mapa Castillo
    if (estadoCena === "completada") {
        fase = 7;
    }

    return fase;
}


// ==================================================
// ABRIR MAPA
// ==================================================

function abrirMapa() {

    actualizarMapa();

    mostrarPantalla(
        "pantalla-mapa"
    );
}


// ==================================================
// ACTUALIZAR MAPA
// ==================================================

function actualizarMapa() {

    const fase = obtenerFaseMapa();
    const datos = mapasNivel23[fase];

    if (!datos) {
        return;
    }

    const imagen = document.getElementById("imagen-mapa");

    if (
        imagen &&
        imagen.getAttribute("src") !== datos.imagen
    ) {
        cambiarImagenMapa(imagen, datos.imagen);
    }

    actualizarPuntosMapa(fase);
}


// ==================================================
// CAMBIAR IMAGEN
// ==================================================

function cambiarImagenMapa(
    imagen,
    ruta
) {

    const niebla =
        document.getElementById(
            "niebla-mapa"
        );


    imagen.classList.add(
        "cambiando"
    );


    if (niebla) {

        niebla.classList.add(
            "activa"
        );
    }


    setTimeout(
        function () {

            imagen.src =
                ruta;


            setTimeout(
                function () {

                    imagen.classList.remove(
                        "cambiando"
                    );


                    if (niebla) {

                        niebla.classList.remove(
                            "activa"
                        );
                    }

                },

                300
            );

        },

        300
    );
}


// ==================================================
// PUNTOS DEL MAPA
// ==================================================

function actualizarPuntosMapa(
    fase
) {

    const puntos = {

        casa:
            document.getElementById(
                "punto-casa"
            ),

        desayuno:
            document.getElementById(
                "punto-desayuno"
            ),

        oxo:
            document.getElementById(
                "punto-oxo"
            ),

        genko:
            document.getElementById(
                "punto-genko"
            ),

        lava:
            document.getElementById(
                "punto-lava"
            ),

        cena:
            document.getElementById(
                "punto-cena"
            ),

        castillo:
            document.getElementById(
                "punto-castillo"
            )

    };


    Object.values(
        puntos
    ).forEach(
        function (punto) {

            if (punto) {

                punto.classList.add(
                    "zona-oculta"
                );
            }
        }
    );

    // Las ilustraciones no tienen exactamente la misma composición. Ajustar
    // los hotspots por fase hace que cada símbolo siga siendo pulsable sobre
    // su icono real en todos los mapas.
    const posiciones = {
        casa: {
            1: [22, 76],
            2: [20, 78],
            3: [20, 78],
            4: [20, 78],
            5: [20, 78],
            6: [20, 78],
            7: [20, 78]
        },
        desayuno: {
            2: [60, 61],
            3: [61, 61],
            4: [61, 61],
            5: [43, 58],
            6: [43, 58],
            7: [43, 58]
        },
        oxo: {
            3: [34, 46],
            4: [34, 46],
            5: [20, 52],
            6: [20, 52],
            7: [20, 52]
        },
        genko: {
            4: [77, 31],
            5: [80, 58],
            6: [80, 58],
            7: [77, 39]
        },
        lava: {
            5: [70, 39],
            6: [70, 39],
            7: [64, 72]
        },
        cena: {
            6: [76, 69],
            7: [86, 58]
        },
        castillo: {
            7: [79, 17]
        }
    };

    Object.keys(posiciones).forEach(function (nombre) {
        const punto = puntos[nombre];
        const coordenadas = posiciones[nombre][fase];

        if (punto && coordenadas) {
            punto.style.left = coordenadas[0] + "%";
            punto.style.top = coordenadas[1] + "%";
        }
    });


    mostrarPuntoMapa(
        puntos.casa
    );


    if (fase >= 2) {

        mostrarPuntoMapa(
            puntos.desayuno
        );
    }


    if (fase >= 3) {

        mostrarPuntoMapa(
            puntos.oxo
        );
    }


    if (fase >= 4) {

        mostrarPuntoMapa(
            puntos.genko
        );
    }


    if (fase >= 5) {

        mostrarPuntoMapa(
            puntos.lava
        );
    }


    if (fase >= 6) {

        mostrarPuntoMapa(
            puntos.cena
        );
    }


    if (fase >= 7) {

        mostrarPuntoMapa(
            puntos.castillo
        );
    }
}


function mostrarPuntoMapa(
    punto
) {

    if (!punto) {
        return;
    }


    punto.classList.remove(
        "zona-oculta"
    );
}


// ==================================================
// PULSAR SOBRE EL MAPA
// ==================================================

function abrirZonaMapa(
    zona
) {

    if (
        zona === "casa"
    ) {

        abrirCasaMapa();

        return;
    }


    if (
        zona === "desayuno"
    ) {

        abrirDesayunoMapa();

        return;
    }


    if (
        zona === "oxo"
    ) {

        abrirZona1();

        return;
    }


    if (
        zona === "genko"
    ) {

        abrirMision2();

        return;
    }


    if (
        zona === "lava"
    ) {

        abrirMision3();

        return;
    }


    if (
        zona === "cena"
    ) {

        abrirCenaMapa();

        return;
    }


    if (
        zona === "castillo"
    ) {

        abrirFinal();
    }
}


// ==================================================
// CASA
// ==================================================

function abrirCasaMapa() {

    if (
        estadoDesayuno ===
        "bloqueada"
    ) {

        mostrarPantalla(
            "pantalla-starter-pack"
        );

        return;
    }


    notificar(
        "🏠",
        "PUNTO DE INICIO",
        "Aquí comenzó la aventura."
    );
}

if (false) {
    // DESAYUNO

    if (
        estadoDesayuno ===
        "bloqueada"
    ) {

        cambiarZona(
            "desayuno",
            "❗",
            "MISIÓN SECUNDARIA",
            "Algo parece estar esperándote..."
        );

    }

    else if (
        estadoDesayuno ===
        "disponible"
    ) {

        cambiarZona(
            "desayuno",
            "☕",
            "DESAYUNO",
            "Nueva misión secundaria"
        );

    }

    else if (
        estadoDesayuno ===
        "enCurso"
    ) {

        cambiarZona(
            "desayuno",
            "☕",
            "DESAYUNO",
            "⚡ Recuperando energía..."
        );

    }

    else {

        cambiarZona(
            "desayuno",
            "✅",
            "DESAYUNO",
            "Misión secundaria completada"
        );

    }


    // OXO

    if (
        estadoMision1 ===
        "bloqueada"
    ) {

        cambiarZona(
            "1",
            "🔒",
            "???",
            "Supera la prueba de acceso"
        );

    }

    else if (
        estadoMision1 ===
        "disponible"
    ) {

        cambiarZona(
            "1",
            "❗",
            "MISIÓN 01",
            "Nueva misión disponible"
        );

    }

    else if (
        estadoMision1 ===
        "enCurso"
    ) {

        cambiarZona(
            "1",
            "🎮",
            "OXO",
            "Misión en curso"
        );

    }

    else {

        cambiarZona(
            "1",
            "✅",
            "OXO",
            "Misión completada"
        );

    }


    // GENKO

    if (
        estadoMision2 ===
        "bloqueada"
    ) {

        cambiarZona(
            "2",
            "🔒",
            "???",
            "Zona desconocida"
        );

    }

    else if (
        estadoMision2 ===
        "disponible"
    ) {

        cambiarZona(
            "2",
            "❗",
            "MISIÓN 02",
            "Nueva misión disponible"
        );

    }

    else if (
        estadoMision2 ===
        "enCurso"
    ) {

        cambiarZona(
            "2",
            "🍣",
            "GENKO",
            "Misión en curso"
        );

    }

    else {

        cambiarZona(
            "2",
            "✅",
            "GENKO",
            "Misión completada"
        );

    }


    // LAVA

    if (
        estadoMision3 ===
        "bloqueada"
    ) {

        cambiarZona(
            "3",
            "🔒",
            "???",
            "Zona desconocida"
        );

    }

    else if (
        estadoMision3 ===
        "disponible"
    ) {

        cambiarZona(
            "3",
            "❗",
            "MISIÓN 03",
            "Nueva misión disponible"
        );

    }

    else if (
        estadoMision3 ===
        "enCurso"
    ) {

        cambiarZona(
            "3",
            "🌋",
            "EL SUELO ES LAVA",
            "Misión en curso"
        );

    }

    else {

        cambiarZona(
            "3",
            "✅",
            "EL SUELO ES LAVA",
            "Misión completada"
        );

    }


    actualizarZonaCena();
}


// ==================================================
// STARTER PACK
// ==================================================

function abrirDesayunoMapa() {

    if (
        estadoDesayuno ===
        "bloqueada"
    ) {

        mostrarPantalla(
            "pantalla-starter-pack"
        );

        return;
    }


    if (
        estadoDesayuno ===
        "disponible"
    ) {

        mostrarPantalla(
            "pantalla-desayuno"
        );

        return;
    }


    if (
        estadoDesayuno ===
        "enCurso"
    ) {

        mostrarPantalla(
            "pantalla-desayuno-curso"
        );

        return;
    }


    mostrarPantalla(
        "pantalla-desayuno-completado"
    );
}


function prepararStarterPack() {

    objetosStarter = [];


    document
        .querySelectorAll(
            ".objeto-starter"
        )
        .forEach(function (boton) {

            boton.classList.remove(
                "seleccionado"
            );

        });


    actualizarObjetosStarter();


    mostrarPantalla(
        "pantalla-inventario-starter"
    );
}


function seleccionarObjetoStarter(
    boton
) {

    let objeto =
        boton.dataset.objeto;


    let posicion =
        objetosStarter.indexOf(
            objeto
        );


    if (
        posicion !== -1
    ) {

        objetosStarter.splice(
            posicion,
            1
        );

        boton.classList.remove(
            "seleccionado"
        );

    }

    else if (
        objetosStarter.length < 3
    ) {

        objetosStarter.push(
            objeto
        );

        boton.classList.add(
            "seleccionado"
        );

    }


    actualizarObjetosStarter();
}


function actualizarObjetosStarter() {

    let contador =
        document.getElementById(
            "contador-starter"
        );


    if (contador) {

        contador.textContent =
            objetosStarter.length +
            " / 3";
    }


    let boton =
        document.getElementById(
            "boton-confirmar-starter"
        );


    if (boton) {

        boton.disabled =
            objetosStarter.length !== 3;
    }
}


function confirmarStarterPack() {

    if (
        objetosStarter.length !== 3
    ) {
        return;
    }


    let textoObjetos = "";


    objetosStarter.forEach(
        function (objeto) {

            textoObjetos += `

                <div class="objeto-equipado">

                    <span>
                        ${objeto}
                    </span>

                    <small>
                        EQUIPADO ✓
                    </small>

                </div>

            `;

        }
    );


    document.getElementById(
        "objetos-equipados"
    ).innerHTML =
        textoObjetos;


    document.getElementById(
        "mensaje-starter"
    ).innerHTML =
        "<p>🔍 Comprobando inventario...</p>";


    mostrarPantalla(
        "pantalla-resultado-starter"
    );


    setTimeout(function () {

        document.getElementById(
            "mensaje-starter"
        ).innerHTML = `

            <p class="texto-correcto">
                ✓ 3/3 OBJETOS EQUIPADOS
            </p>

            <p>
                Analizando estado del jugador...
            </p>

        `;

    }, 1300);


    setTimeout(function () {

        document.getElementById(
            "mensaje-starter"
        ).innerHTML = `

            <p class="texto-alerta">
                ⚠️ ERROR
            </p>

            <p>
                OBJETO ESENCIAL NO DETECTADO
            </p>

            <p>
                ⚡ ENERGÍA INICIAL:
                <strong>0%</strong>
            </p>

        `;

    }, 2800);


    setTimeout(function () {

        document.getElementById(
            "mensaje-starter"
        ).innerHTML = `

            <p>
                📡 BUSCANDO FUENTE DE ENERGÍA...
            </p>

            <p>
                ████░░░░░░ 40%
            </p>

        `;

    }, 4300);


    setTimeout(function () {

        document.getElementById(
            "mensaje-starter"
        ).innerHTML = `

            <p>
                📡 UBICACIÓN DETECTADA
            </p>

            <p>
                ██████████ 100%
            </p>

            <p class="texto-correcto">
                ✨ MISIÓN SECUNDARIA DESBLOQUEADA
            </p>

        `;

    }, 5900);


    setTimeout(function () {

        estadoDesayuno =
            "disponible";


        guardarPartida();

        actualizarMapa();


        notificar(
            "☕",
            "MISIÓN SECUNDARIA DESBLOQUEADA",
            "Se ha localizado una fuente de energía."
        );


        mostrarPantalla(
            "pantalla-desayuno"
        );

    }, 7600);
}


// ==================================================
// DESAYUNO
// ==================================================

function aceptarDesayuno() {

    estadoDesayuno =
        "enCurso";

    guardarPartida();

    mostrarPantalla(
        "pantalla-desayuno-curso"
    );
}


function completarDesayuno() {

    estadoDesayuno =
        "completada";

    guardarPartida();

    mostrarPantalla(
        "pantalla-desayuno-completado"
    );
}

function recogerRecompensaDesayuno() {

    if (
        !recompensaDesayunoRecogida
    ) {

        experiencia += 25;

        darMonedas(10);

        recompensaDesayunoRecogida =
            true;

        desbloquearLogro(
            "desayuno"
        );

    }


    guardarPartida();

    mostrarPantalla("pantalla-reto-lol");
}


// ==================================================
// LOL
// ==================================================

function abrirZona1() {

    if (
        estadoMision1 ===
        "bloqueada"
    ) {

        mostrarPantalla(
            "pantalla-reto-lol"
        );

    }

    else if (
        estadoMision1 ===
        "disponible"
    ) {

        mostrarPantalla(
            "pantalla-mision-1"
        );

    }

    else if (
        estadoMision1 ===
        "enCurso"
    ) {

        mostrarPantalla(
            "pantalla-mision-1-curso"
        );

    }

    else {

        mostrarPantalla(
            "pantalla-mision-1-completada"
        );

    }
}


function iniciarRetoLol() {

    mostrarPantalla(
        "pantalla-lol-1"
    );
}


function respuestaLol1(correcta) {

    let resultado =
        document.getElementById(
            "resultado-lol-1"
        );


    if (!correcta) {

        resultado.innerHTML =
            "<p class='texto-alerta'>❌ Respuesta incorrecta. Inténtalo otra vez.</p>";

        registrarFallo();

        return;
    }


    resultado.innerHTML =
        "<p class='texto-correcto'>✓ RESPUESTA CORRECTA</p>";


    setTimeout(function () {

        mostrarPantalla(
            "pantalla-lol-2"
        );

    }, 700);
}


function respuestaLol2(correcta) {

    let resultado =
        document.getElementById(
            "resultado-lol-2"
        );


    if (!correcta) {

        resultado.innerHTML =
            "<p class='texto-alerta'>❌ Respuesta incorrecta. Inténtalo otra vez.</p>";

        registrarFallo();

        return;
    }


    resultado.innerHTML =
        "<p class='texto-correcto'>✓ RESPUESTA CORRECTA</p>";


    setTimeout(function () {

        mostrarPantalla(
            "pantalla-lol-3"
        );

    }, 700);
}


function respuestaLol3(correcta) {

    let resultado =
        document.getElementById(
            "resultado-lol-3"
        );


    if (!correcta) {

        resultado.innerHTML =
            "<p class='texto-alerta'>❌ Respuesta incorrecta. Inténtalo otra vez.</p>";

        registrarFallo();

        return;
    }


    resultado.innerHTML =
        "<p class='texto-correcto'>✓ RESPUESTA CORRECTA</p>";


    setTimeout(function () {

        mostrarPantalla(
            "pantalla-lol-completado"
        );

    }, 700);
}

function finalizarRetoLol() {

    estadoMision1 =
        "disponible";

    guardarPartida();

    actualizarMapa();

    mostrarPantalla(
        "pantalla-mision-1"
    );
}


// ==================================================
// OXO
// ==================================================

function comenzarMision1() {

    mostrarPantalla(
        "pantalla-destino-1"
    );
}


function aceptarMision1() {

    estadoMision1 =
        "enCurso";


    retos.juegoInfancia.desbloqueado =
        true;


    guardarPartida();


  notificar(
    "🕹️",
    "NUEVO RETO",
    "Se ha desbloqueado un nuevo reto secundario."
);

    mostrarPantalla(
        "pantalla-mision-1-curso"
    );
}


function completarMision1() {

    estadoMision1 =
        "completada";

    guardarPartida();

    mostrarPantalla(
        "pantalla-mision-1-completada"
    );
}


function recogerRecompensa1() {

    if (
        !recompensaMision1Recogida
    ) {

        experiencia += 100;

        darMonedas(25);

        recompensaMision1Recogida =
            true;
    }


    guardarPartida();


    mostrarPantalla(
        "pantalla-reto-nikkei"
    );
}


// ==================================================
// NIKKEI
// ==================================================

function comprobarNikkei() {

    let input =
        document.getElementById(
            "respuesta-nikkei"
        );


    let respuesta =
        input.value
            .trim()
            .toLowerCase();


    let resultado =
        document.getElementById(
            "resultado-nikkei"
        );


    if (
        respuesta ===
        "nikkei"
    ) {

        resultado.innerHTML = `

            <p class="texto-correcto">
                ✅ FUSIÓN IDENTIFICADA
            </p>

            <p>
                🇯🇵 + 🇵🇪 = NIKKEI
            </p>

            <p>
                🔓 MISIÓN 02 DESBLOQUEADA
            </p>

        `;


        estadoMision2 =
            "disponible";


        guardarPartida();

        actualizarMapa();


        setTimeout(function () {

            mostrarPantalla(
                "pantalla-mision-2"
            );

        }, 1300);

    }

    else {

        resultado.innerHTML =
            "<p class='texto-alerta'>❌ TRANSMISIÓN NO IDENTIFICADA</p>";

    }
}


// ==================================================
// GENKO
// ==================================================

function abrirMision2() {

    if (
        estadoMision2 ===
        "bloqueada"
    ) {
        return;
    }


    if (
        estadoMision2 ===
        "disponible"
    ) {

        mostrarPantalla(
            "pantalla-mision-2"
        );

    }

    else if (
        estadoMision2 ===
        "enCurso"
    ) {

        actualizarEleccionGenko();

        mostrarPantalla(
            "pantalla-mision-2-curso"
        );

    }

    else {

        mostrarPantalla(
            "pantalla-mision-2-completada"
        );

    }
}


function revelarGenko() {

    retos.japon.desbloqueado = true;

    retos.platoGenko.desbloqueado = true;


    guardarPartida();


    mostrarPantalla(
        "pantalla-destino-2"
    );
}
function aceptarMision2() {

    estadoMision2 =
        "enCurso";

    guardarPartida();

    actualizarEleccionGenko();

    mostrarPantalla(
        "pantalla-mision-2-curso"
    );
}


function actualizarEleccionGenko() {

    let zona =
        document.getElementById(
            "zona-eleccion-genko"
        );


    if (!zona) {
        return;
    }


    if (
        eleccionJugador > 0
    ) {

        zona.innerHTML = `

            <div class="archivo">

                <p>
                    👑 OBJETO DISPONIBLE
                </p>

                <strong>
                    ELECCIÓN DEL JUGADOR
                </strong>

                <p>
                    Puedes utilizarlo para elegir el postre.
                </p>

                <button onclick="usarEleccionJugador()">
                    👑 USAR OBJETO
                </button>

            </div>

        `;

    }

    else {

        zona.innerHTML = "";
    }
}


function usarEleccionJugador() {

    if (
        eleccionJugador <= 0
    ) {
        return;
    }


    eleccionJugador--;


    desbloquearLogro(
        "gameMaster"
    );


    notificar(
        "👑",
        "ELECCIÓN DEL JUGADOR",
        "El jugador ha tomado el control. Tú eliges el postre."
    );


    actualizarEleccionGenko();

    guardarPartida();
}


function completarMision2() {

    estadoMision2 =
        "completada";

    desbloquearLogro(
        "genko"
    );

    guardarPartida();

    mostrarPantalla(
        "pantalla-mision-2-completada"
    );
}


function recogerRecompensa2() {

    if (
        !recompensaMision2Recogida
    ) {

        experiencia += 75;

        darMonedas(50);

        recompensaMision2Recogida =
            true;


        // Nuevo reto secundario
        retos.peru.desbloqueado =
            true;
    }


    guardarPartida();


    mostrarPantalla(
        "pantalla-reto-lava"
    );
}
// ==================================================
// LAVA
// ==================================================

function iniciarRetoLava() {

    rutaJugadorLava = [];

    intentosLava = 1;

    bloqueoLava = false;


    limpiarTableroLava();

    actualizarIntentosLava();

    actualizarPasosLava();


    document.getElementById(
        "resultado-lava"
    ).innerHTML =
        "Analiza el terreno.";


    document.getElementById(
        "texto-pista-lava"
    ).innerHTML =
        "Selecciona una pista si necesitas ayuda.";


    mostrarPantalla(
        "pantalla-tablero-lava"
    );
}


function mostrarPistaLava(numero) {

    let pistas = {

        1:
            "📡 PISTA 01<br><br>El primer paso es amarillo.",

        2:
            "📡 PISTA 02<br><br>Después del amarillo inicial, la naturaleza aparece antes que el cielo.",

        3:
            "📡 PISTA 03<br><br>Solo dos plataformas verdes forman parte de la ruta.",

        4:
            "📡 PISTA 04<br><br>El morado aparece dos veces, pero nunca de forma consecutiva.",

        5:
            "📡 PISTA 05<br><br>La última plataforma antes de la salida es amarilla."

    };


    document.getElementById(
        "texto-pista-lava"
    ).innerHTML =
        pistas[numero];
}


function pulsarPlataformaLava(
    id,
    color
) {

    if (bloqueoLava) {
        return;
    }


    if (
        rutaJugadorLava.length === 0
    ) {

        if (
            id !==
            rutaCorrectaLava[0]
        ) {

            movimientoImposible();

            return;
        }

    }

    else {

        let anterior =
            rutaJugadorLava[
                rutaJugadorLava.length - 1
            ].id;


        if (
            !sonAdyacentes(
                anterior,
                id
            )
        ) {

            movimientoImposible();

            return;
        }


        if (
            rutaJugadorLava.some(
                paso =>
                    paso.id === id
            )
        ) {

            movimientoImposible();

            return;
        }
    }


    let esperado =
        rutaCorrectaLava[
            rutaJugadorLava.length
        ];


    if (
        id !== esperado
    ) {

        caerEnLava(id);

        return;
    }


    quitarPlataformaActual();


    rutaJugadorLava.push({
        id: id,
        color: color
    });


    let plataforma =
        document.getElementById(
            "lava-" + id
        );


    plataforma.classList.add(
        "plataforma-seleccionada",
        "plataforma-actual"
    );


    actualizarPasosLava();


    document.getElementById(
        "resultado-lava"
    ).innerHTML = `

        👣 MOVIMIENTO REGISTRADO
        <br><br>
        Analizando estabilidad...

    `;


    if (
        rutaJugadorLava.length ===
        rutaCorrectaLava.length
    ) {

        bloqueoLava =
            true;


        document.getElementById(
            "resultado-lava"
        ).innerHTML = `

            ✅ RUTA ESTABLE
            <br><br>
            🏁 SALIDA ALCANZADA

        `;


        setTimeout(function () {

            mostrarPantalla(
                "pantalla-lava-superada"
            );

        }, 1700);
    }
}


function sonAdyacentes(
    primera,
    segunda
) {

    let fila1 =
        primera.charCodeAt(0);

    let fila2 =
        segunda.charCodeAt(0);


    let columna1 =
        parseInt(
            primera.substring(1)
        );

    let columna2 =
        parseInt(
            segunda.substring(1)
        );


    return (
        Math.abs(
            fila1 - fila2
        ) +
        Math.abs(
            columna1 - columna2
        )
    ) === 1;
}


function movimientoImposible() {

    document.getElementById(
        "resultado-lava"
    ).innerHTML = `

        ⚠️ MOVIMIENTO IMPOSIBLE
        <br><br>
        Solo puedes saltar a una
        plataforma adyacente.

    `;
}


function caerEnLava(id) {

    bloqueoLava = true;


    let plataforma =
        document.getElementById(
            "lava-" + id
        );


    plataforma.classList.add(
        "plataforma-error"
    );


    document.getElementById(
        "resultado-lava"
    ).innerHTML = `

        🔥 PLATAFORMA INESTABLE
        <br><br>
        HAS CAÍDO EN LA LAVA

    `;


    // Aplicamos la penalización
    let resultadoFallo =
        registrarFallo();


    // Si se ha quedado sin vidas,
    // no reiniciamos automáticamente la ruta.
    if (
        resultadoFallo === "sinVidas"
    ) {

        rutaJugadorLava = [];

        limpiarTableroLava();

        actualizarPasosLava();

        bloqueoLava = false;

        return;
    }


    // Si todavía puede continuar,
    // reiniciamos la ruta normalmente.
    setTimeout(function () {

        intentosLava++;

        rutaJugadorLava = [];

        limpiarTableroLava();

        actualizarIntentosLava();

        actualizarPasosLava();


        document.getElementById(
            "resultado-lava"
        ).innerHTML =
            "⚠️ RUTA REINICIADA";


        bloqueoLava = false;

    }, 1600);
}

function reiniciarRutaLava() {

    if (bloqueoLava) {
        return;
    }


    if (
        rutaJugadorLava.length > 0
    ) {

        intentosLava++;
    }


    rutaJugadorLava = [];


    limpiarTableroLava();

    actualizarIntentosLava();

    actualizarPasosLava();


    document.getElementById(
        "resultado-lava"
    ).innerHTML =
        "🔄 RUTA REINICIADA";
}


function quitarPlataformaActual() {

    document
        .querySelectorAll(
            ".plataforma-lava"
        )
        .forEach(function (plataforma) {

            plataforma.classList.remove(
                "plataforma-actual"
            );

        });
}


function limpiarTableroLava() {

    document
        .querySelectorAll(
            ".plataforma-lava"
        )
        .forEach(function (plataforma) {

            plataforma.classList.remove(
                "plataforma-seleccionada",
                "plataforma-actual",
                "plataforma-error"
            );

        });
}


function actualizarIntentosLava() {

    let elemento =
        document.getElementById(
            "intentos-lava"
        );


    if (elemento) {

        elemento.textContent =
            intentosLava;
    }
}


function actualizarPasosLava() {

    let elemento =
        document.getElementById(
            "pasos-lava"
        );


    if (elemento) {

        elemento.textContent =
            rutaJugadorLava.length;
    }
}


// ==================================================
// MISIÓN 3
// ==================================================

function desbloquearMision3() {

    estadoMision3 =
        "disponible";


    retos.lavaSinAbandonar.desbloqueado =
        true;


    guardarPartida();

    actualizarMapa();


    notificar(
        "🌋",
        "MISIÓN 03 DESBLOQUEADA",
        "Una nueva ubicación ha aparecido en el mapa."
    );


    mostrarPantalla(
        "pantalla-mision-3"
    );
}


function abrirMision3() {

    if (
        estadoMision3 ===
        "bloqueada"
    ) {
        return;
    }


    if (
        estadoMision3 ===
        "disponible"
    ) {

        mostrarPantalla(
            "pantalla-mision-3"
        );

    }

    else if (
        estadoMision3 ===
        "enCurso"
    ) {

        mostrarPantalla(
            "pantalla-mision-3-curso"
        );

    }

    else {

        mostrarPantalla(
            "pantalla-mision-3-completada"
        );

    }
}


function aceptarMision3() {

    estadoMision3 =
        "enCurso";

    guardarPartida();

    mostrarPantalla(
        "pantalla-mision-3-curso"
    );
}


function completarMision3() {

    estadoMision3 =
        "completada";


    // Completar automáticamente el reto SUPERVIVIENTE
    if (
        retos.lavaSinAbandonar.desbloqueado &&
        !retos.lavaSinAbandonar.completado
    ) {

        retos.lavaSinAbandonar.completado =
            true;

        darMonedas(
            retos.lavaSinAbandonar.recompensa
        );

        desbloquearLogro(
            "superviviente"
        );


        notificar(
            "🌋",
            "SUPERVIVIENTE",
            "Has completado El Suelo es Lava. +200 monedas."
        );
    }


    guardarPartida();


    mostrarPantalla(
        "pantalla-mision-3-completada"
    );
}


function recogerRecompensa3() {

    if (
        !recompensaMision3Recogida
    ) {

        experiencia += 150;

        darMonedas(40);

        recompensaMision3Recogida =
            true;
    }


    guardarPartida();

    volverJuego();
}


// ==================================================
// RETOS SECUNDARIOS
// ==================================================

const iconosRetos = {

    fotoJuntos:
        "assets/retos/reto-recuerdo.png",

    videojuegoCalle:
        "assets/retos/reto-videojuego.png",

    objetoRosa:
        "assets/retos/reto-rosa.png",

    tripleA:
        "assets/retos/reto-triple-a.png",

    juegoInfancia:
        "assets/retos/reto-pasado.png",

    japon:
        "assets/retos/reto-japon.png",

    peru:
        "assets/retos/reto-peru.png",

    platoGenko:
        "assets/retos/reto-gastronomico.png",

    lavaSinAbandonar:
        "assets/retos/reto-superviviente.png"

};
function abrirRetos() {

    renderizarRetos();

    mostrarPantalla(
        "pantalla-retos"
    );
}


function renderizarRetos() {

    let lista =
        document.getElementById(
            "lista-retos"
        );


    if (!lista) {
        return;
    }


    lista.innerHTML = "";


    let retosVisibles = 0;


    Object.keys(retos)
        .forEach(function (id) {

            let reto =
                retos[id];


            // Los retos futuros no aparecen.
            // Así evitamos spoilers.
            if (
                !reto.desbloqueado
            ) {
                return;
            }


            retosVisibles++;


            let tarjeta =
                document.createElement(
                    "div"
                );


            tarjeta.className =
                "reto reto-rpg-lista";


            if (
                reto.completado
            ) {

                tarjeta.classList.add(
                    "reto-completado"
                );
            }


            tarjeta.innerHTML = `

              <div class="reto-lista-icono">
    <img
        src="${iconosRetos[id]}"
        alt="${reto.nombre}"
        class="imagen-icono-reto"
    >
</div>


                <div class="reto-lista-info">

                    <h3>
                        ${reto.nombre}
                    </h3>

                    <p>
                        ${reto.descripcion}
                    </p>

                    <div class="reto-lista-inferior">

                        <span class="recompensa-reto-lista">
                            🪙 +${reto.recompensa}
                        </span>

                        ${
                            reto.completado

                            ? `
                                <span class="estado-reto-lista completado">
                                    ✓ COMPLETADO
                                </span>
                            `

                            : `
                                <span class="estado-reto-lista disponible">
                                    DISPONIBLE
                                </span>
                            `
                        }

                    </div>

                </div>


                <div class="reto-lista-flecha">
                    ›
                </div>

            `;


            tarjeta.onclick =
                function () {

                    mostrarDetalleReto(
                        id
                    );
                };


            lista.appendChild(
                tarjeta
            );

        });


    // Si todavía no hay ningún reto disponible

    if (
        retosVisibles === 0
    ) {

        lista.innerHTML = `

            <div class="retos-vacios-rpg">

                <span>
                    ⚔️
                </span>

                <p>
                    Todavía no hay retos disponibles.
                </p>

                <small>
                    Sigue avanzando en la aventura.
                </small>

            </div>

        `;
    }


    let saldo =
        document.getElementById(
            "monedas-retos"
        );


    if (saldo) {

        saldo.textContent =
            monedas;
    }
}
function mostrarDetalleReto(id) {

    let reto =
        retos[id];


    let detalle =
        document.getElementById(
            "detalle-reto"
        );


    if (
        !reto ||
        !detalle
    ) {
        return;
    }


    let esLava =
        id === "lavaSinAbandonar";


    let zonaAccion = "";


    if (
        reto.completado
    ) {

        zonaAccion = `

            <div class="detalle-reto-estado completado">
                ✓ RETO COMPLETADO
            </div>

        `;

    }

    else if (
        esLava
    ) {

        zonaAccion = `

            <div class="detalle-reto-estado especial">
                🌋 RETO ESPECIAL
            </div>

            <p class="aviso-reto-especial">
                Este reto se completa automáticamente
                durante la aventura.
            </p>

        `;

    }

    else {

        zonaAccion = `

            <div class="detalle-reto-estado disponible">
                ⚔ RETO DISPONIBLE
            </div>

            <button
                class="boton-completar-reto-rpg"
                onclick="completarReto('${id}')"
            >
                ✓ COMPLETAR RETO
            </button>

        `;
    }


    detalle.innerHTML = `

        <div class="ficha-reto-rpg">

            <div class="detalle-reto-categoria">
                ✦ MISIÓN OPCIONAL ✦
            </div>


          <div class="detalle-reto-icono-grande">
    <img
        src="${iconosRetos[id]}"
        alt="${reto.nombre}"
        class="imagen-icono-reto-grande"
    >
</div>

            <h2>
                ${reto.nombre}
            </h2>


            <div class="separador-logro-rpg">
                ✦ ───────── ✦
            </div>


            <div class="detalle-reto-descripcion">

                <small>
                    OBJETIVO
                </small>

                <p>
                    ${reto.descripcion}
                </p>

            </div>


            <div class="recompensa-detalle-reto">

                <small>
                    RECOMPENSA
                </small>

                <strong>
                    🪙 +${reto.recompensa}
                </strong>

            </div>


            ${zonaAccion}


            <div class="detalle-logro-decoracion">
                ✧　✦　✧
            </div>

        </div>

    `;


    // En móvil bajamos hasta la ficha.

    if (
        window.innerWidth <= 700
    ) {

        setTimeout(function () {

            detalle.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);
    }
}

function completarReto(id) {

    let reto =
        retos[id];
    // SUPERVIVIENTE se consigue automáticamente
    // al completar El Suelo es Lava.
    if (id === "lavaSinAbandonar") {

        notificar(
            "🌋",
            "RETO ESPECIAL",
            "Este reto se completa automáticamente al superar El Suelo es Lava."
        );

        return;
    }

    if (
        !reto ||
        reto.completado
    ) {
        return;
    }


    let confirmar =
        confirm(
            "¿Confirmas que has completado este reto?"
        );


    if (!confirmar) {
        return;
    }


    reto.completado =
        true;


    darMonedas(
        reto.recompensa
    );


    if (
        id ===
        "fotoJuntos"
    ) {

        desbloquearLogro(
            "player2"
        );
    }


    if (
        id ===
        "juegoInfancia"
    ) {

        desbloquearLogro(
            "nostalgia"
        );
    }


    if (
        id ===
        "japon"
    ) {

        desbloquearLogro(
            "japon"
        );
    }


    if (
        id ===
        "lavaSinAbandonar"
    ) {

        desbloquearLogro(
            "superviviente"
        );
    }


    notificar(
        "🪙",
        "RETO COMPLETADO",
        "+" +
        reto.recompensa +
        " monedas"
    );


  guardarPartida();

renderizarRetos();

mostrarDetalleReto(id);

actualizarJugador();
}

// ==================================================
// TIENDA
// ==================================================

function abrirTienda() {

    actualizarTienda();

    mostrarPantalla(
        "pantalla-tienda"
    );
}


function actualizarTienda() {

    let saldo =
        document.getElementById(
            "monedas-tienda"
        );


    if (saldo) {

        saldo.textContent =
            monedas;
    }
// ==================================================
// OBJETOS SECRETOS DE LA TIENDA
// ==================================================

const productoLlaveCena =
    document.getElementById(
        "producto-llave-cena"
    );

const productoLlave23 =
    document.getElementById(
        "producto-llave-23"
    );


// LLAVE SECRETA
// Aparece después de completar la misión 3.

if (productoLlaveCena) {

    if (
        estadoMision3 === "completada" &&
        recompensaMision3Recogida
    ) {

        productoLlaveCena.classList.remove(
            "zona-oculta"
        );

    } else {

        productoLlaveCena.classList.add(
            "zona-oculta"
        );
    }
}


// LLAVE DEL NIVEL 23
// Aparece cuando se abre la parte secreta de la aventura.

if (productoLlave23) {

    if (llaveCenaUsada) {

        productoLlave23.classList.remove(
            "zona-oculta"
        );

    } else {

        productoLlave23.classList.add(
            "zona-oculta"
        );
    }
}

   desactivarSiComprado(
    "comprar-eleccion",
    eleccionJugadorComprada,
    eleccionJugador > 0
        ? "COMPRADO"
        : "UTILIZADO"
);


    desactivarSiComprado(
        "comprar-mensaje",
        mensajeSecretoComprado,
        "COMPRADO"
    );


    desactivarSiComprado(
        "comprar-llave-cena",
        llaveCenaComprada,
        "COMPRADO"
    );


    desactivarSiComprado(
        "comprar-llave-23",
        llave23Comprada,
        "COMPRADO"
    );
    const contadorRasca = document.getElementById("intentos-rasca");
    const botonRasca = document.getElementById("comprar-rasca");

    if (contadorRasca) {
        contadorRasca.textContent = intentosRasca + " / 3";
    }

    if (botonRasca) {
        const agotado = intentosRasca >= 3;
        botonRasca.disabled = agotado;
        botonRasca.textContent = agotado ? "AGOTADO" : "COMPRAR BOLETO";
    }

}


function desactivarSiComprado(
    id,
    comprado,
    texto
) {

    let boton =
        document.getElementById(id);


    if (!boton) {
        return;
    }


    boton.disabled =
        comprado;


    if (comprado) {

        boton.textContent =
            texto;
    }
}


function resultadoTienda(texto) {

    let resultado =
        document.getElementById(
            "resultado-tienda"
        );


    if (resultado) {

        resultado.innerHTML =
            "<p>" + texto + "</p>";
    }


    actualizarTienda();

    actualizarJugador();
}
function registrarFallo() {

    // Si tiene un segundo intento,
    // se consume antes de perder una vida.
    if (segundosIntentos > 0) {

        segundosIntentos--;

        guardarPartida();
        actualizarJugador();
        actualizarTienda();

        notificar(
            "🔄",
            "SEGUNDO INTENTO UTILIZADO",
            "Has evitado perder una vida."
        );

        return "segundoIntento";
    }


    // Si no tiene segundo intento,
    // pierde una vida.
    if (vidas > 0) {

        vidas--;

        guardarPartida();
        actualizarJugador();
        actualizarTienda();


        // Todavía le quedan vidas.
        if (vidas > 0) {

            notificar(
                "❤️",
                "HAS PERDIDO UNA VIDA",
                "Te quedan " + vidas + " vidas."
            );

            return "vida";
        }


        // Se ha quedado sin vidas.
        notificar(
            "💀",
            "SIN VIDAS",
            "Necesitas recuperar una vida para continuar."
        );

        setTimeout(function () {
            abrirTienda();
        }, 1200);

        return "sinVidas";
    }


    // Por seguridad, si ya estaba a 0.
    abrirTienda();

    return "sinVidas";
}

function comprarVida() {

    if (vidas >= 3) {

        resultadoTienda(
            "❤️ Ya tienes todas tus vidas."
        );

        return;
    }


    if (!gastarMonedas(15)) {

        resultadoTienda(
            "❌ No tienes suficientes monedas."
        );

        return;
    }


    vidas++;


    guardarPartida();

    actualizarJugador();
    actualizarTienda();


    resultadoTienda(
        "❤️ Has recuperado una vida."
    );
}

function comprarSegundoIntento() {

    if (
        !gastarMonedas(10)
    ) {

        resultadoTienda(
            "❌ No tienes suficientes monedas."
        );

        return;
    }


    segundosIntentos++;
    guardarPartida();
actualizarTienda();


    resultadoTienda(
        "🔄 Segundo intento guardado."
    );
}


function comprarEleccionJugador() {

    if (eleccionJugadorComprada) {

        resultadoTienda(
            "👑 Este objeto ya fue adquirido."
        );

        return;
    }


    if (!gastarMonedas(20)) {

        resultadoTienda(
            "❌ No tienes suficientes monedas."
        );

        return;
    }


    eleccionJugador = 1;
    eleccionJugadorComprada = true;


    guardarPartida();

    actualizarTienda();


    resultadoTienda(
        "👑 Elección del Jugador añadida al inventario."
    );
}


function comprarMensajeSecreto() {

    if (mensajeSecretoComprado) {

        resultadoTienda(
            "💌 Este archivo ya fue adquirido."
        );

        return;
    }


    if (!gastarMonedas(30)) {

        resultadoTienda(
            "❌ No tienes suficientes monedas."
        );

        return;
    }


    mensajeSecretoComprado = true;


    guardarPartida();

    actualizarTienda();


    resultadoTienda(
        "💌 Nuevo archivo desbloqueado."
    );
}

function comprarLlaveCena() {

    if (llaveCenaComprada) {

        resultadoTienda(
            "🔑 Ya tienes esta llave."
        );

        return;
    }


    if (!gastarMonedas(100)) {

        resultadoTienda(
            "❌ No tienes suficientes monedas."
        );

        return;
    }


    // Guardamos la llave

    llaveCenaComprada = true;


    // La cena deja de estar oculta

    estadoCena = "cerrada";


    desbloquearLogro(
        "llaveCena"
    );


    guardarPartida();

    actualizarMapa();
    actualizarTienda();


    notificar(
        "🔑",
        "NUEVA UBICACIÓN",
        "La llave ha reaccionado... algo nuevo ha aparecido en el mapa."
    );


    resultadoTienda(
        "🔑 Llave secreta conseguida."
    );
}


function comprarLlave23() {

    if (llave23Comprada) {

        resultadoTienda(
            "🗝️ Ya posees este objeto legendario."
        );

        return;
    }


    if (!gastarMonedas(200)) {

        resultadoTienda(
            "❌ No tienes suficientes monedas."
        );

        return;
    }


    llave23Comprada = true;


    desbloquearLogro(
        "nivel23"
    );


    guardarPartida();

    actualizarTienda();


    notificar(
        "🗝️",
        "OBJETO LEGENDARIO",
        "La Llave del Nivel 23 ha sido añadida a tu inventario."
    );


    resultadoTienda(
        "🗝️ Llave del Nivel 23 conseguida."
    );
}


    guardarPartida();

// ==================================================
// LOGROS
// ==================================================

function desbloquearLogro(id) {

    let logro =
        logros[id];


    if (
        !logro ||
        logro.desbloqueado
    ) {
        return;
    }


    logro.desbloqueado =
        true;


    notificar(
        logro.icono,
        "LOGRO DESBLOQUEADO",
        logro.nombre
    );


    guardarPartida();
}


function contarLogros() {

    return Object
        .values(logros)
        .filter(
            logro =>
                logro.desbloqueado
        )
        .length;
}


function comprobarLogrosAutomaticos() {

    if (
        monedasConseguidas > 0
    ) {

        desbloquearLogro(
            "insertCoin"
        );
    }


    if (
        monedas >= 100
    ) {

        desbloquearLogro(
            "ahorrador"
        );
    }
}


function abrirLogros() {

    let lista =
        document.getElementById(
            "lista-logros"
        );


    lista.innerHTML = "";


    Object.keys(logros)
        .forEach(function (id) {

            let logro =
                logros[id];


            let tarjeta =
                document.createElement(
                    "div"
                );


            tarjeta.className =
                "logro logro-rpg";


            // ==========================================
            // ¿SE PUEDE MOSTRAR SIN HACER SPOILER?
            // ==========================================

            let visible = true;


            if (
                id === "desayuno" &&
                estadoDesayuno === "bloqueada"
            ) {
                visible = false;
            }


            if (
                id === "nostalgia" &&
                estadoMision1 === "bloqueada"
            ) {
                visible = false;
            }


            if (
                (
                    id === "japon" ||
                    id === "genko"
                ) &&
                estadoMision2 === "bloqueada"
            ) {
                visible = false;
            }


            if (
                id === "gameMaster" &&
                eleccionJugador <= 0 &&
                !logro.desbloqueado
            ) {
                visible = false;
            }


            if (
                id === "superviviente" &&
                estadoMision3 === "bloqueada"
            ) {
                visible = false;
            }


            if (
                id === "llaveCena" &&
                !(
                    estadoMision3 === "completada" &&
                    recompensaMision3Recogida
                ) &&
                !logro.desbloqueado
            ) {
                visible = false;
            }


            if (
                id === "cena" &&
                !llaveCenaUsada &&
                !logro.desbloqueado
            ) {
                visible = false;
            }


            if (
                id === "nivel23" &&
                !llaveCenaUsada &&
                !logro.desbloqueado
            ) {
                visible = false;
            }


            if (
                id === "secreto" &&
                !logro.desbloqueado
            ) {
                visible = false;
            }


            // ==========================================
            // LOGRO DESBLOQUEADO
            // ==========================================

            if (
                logro.desbloqueado
            ) {

                tarjeta.classList.add(
                    "logro-desbloqueado"
                );


                tarjeta.innerHTML = `

                    <div class="logro-rpg-icono">
                        ${logro.icono}
                    </div>

                    <div class="logro-rpg-info">

                        <h3>
                            ${logro.nombre}
                        </h3>

                        <p>
                            ${logro.descripcion}
                        </p>

                        <span class="estado-logro-rpg conseguido">
                            ✓ DESBLOQUEADO
                        </span>

                    </div>

                    <div class="logro-rpg-flecha">
                        ›
                    </div>

                `;


                tarjeta.onclick =
                    function () {

                        mostrarDetalleLogro(
                            id,
                            true
                        );
                    };

            }


            // ==========================================
            // LOGRO OCULTO
            // ==========================================

            else if (
                !visible
            ) {

                tarjeta.classList.add(
                    "logro-bloqueado",
                    "logro-rpg-secreto"
                );


                tarjeta.innerHTML = `

                    <div class="logro-rpg-icono secreto">
                        ?
                    </div>

                    <div class="logro-rpg-info">

                        <h3>
                            ?????????
                        </h3>

                        <p>
                            Sigue avanzando para descubrir este logro.
                        </p>

                        <span class="estado-logro-rpg desconocido">
                            🔒 DESCONOCIDO
                        </span>

                    </div>

                `;

            }


            // ==========================================
            // CONOCIDO PERO NO CONSEGUIDO
            // ==========================================

            else {

                tarjeta.classList.add(
                    "logro-bloqueado"
                );


                tarjeta.innerHTML = `

                    <div class="logro-rpg-icono">
                        ${logro.icono}
                    </div>

                    <div class="logro-rpg-info">

                        <h3>
                            ${logro.nombre}
                        </h3>

                        <p>
                            ${logro.descripcion}
                        </p>

                        <span class="estado-logro-rpg bloqueado">
                            🔒 BLOQUEADO
                        </span>

                    </div>

                    <div class="logro-rpg-flecha">
                        ›
                    </div>

                `;


                tarjeta.onclick =
                    function () {

                        mostrarDetalleLogro(
                            id,
                            false
                        );
                    };
            }


            lista.appendChild(
                tarjeta
            );

        });


    // ==========================================
    // CONTADOR
    // ==========================================

    let cantidad =
        contarLogros();


    document.getElementById(
        "contador-logros"
    ).textContent =
        cantidad +
        " / 14";


    // ==========================================
    // BARRA DE PROGRESO
    // ==========================================

    let barra =
        document.getElementById(
            "barra-logros-relleno"
        );


    if (barra) {

        barra.style.width =
            (
                cantidad /
                14 *
                100
            ) +
            "%";
    }


    // ==========================================
    // DETALLE INICIAL
    // ==========================================

    mostrarDetalleInicialLogros();


    mostrarPantalla(
        "pantalla-logros"
    );
}
function mostrarDetalleInicialLogros() {

    let detalle =
        document.getElementById(
            "detalle-logro"
        );


    if (!detalle) {
        return;
    }


    detalle.innerHTML = `

        <div class="detalle-logro-vacio">

            <div class="detalle-logro-simbolo">
                🏆
            </div>

            <h2>
                ARCHIVO DE LOGROS
            </h2>

            <p>
                Selecciona un logro para consultar
                los detalles de este recuerdo.
            </p>

            <div class="detalle-logro-estrellas">
                ✦　✧　✦
            </div>

        </div>

    `;
}


function mostrarDetalleLogro(
    id,
    conseguido
) {

    let logro =
        logros[id];


    let detalle =
        document.getElementById(
            "detalle-logro"
        );


    if (
        !logro ||
        !detalle
    ) {
        return;
    }


    let estado;


    if (conseguido) {

        estado = `

            <div class="detalle-logro-estado conseguido">
                ✓ LOGRO DESBLOQUEADO
            </div>

        `;

    }

    else {

        estado = `

            <div class="detalle-logro-estado bloqueado">
                🔒 TODAVÍA NO CONSEGUIDO
            </div>

        `;
    }


    detalle.innerHTML = `

        <div class="ficha-logro-rpg">

            <div class="detalle-logro-categoria">
                ✦ RECUERDO DE LA AVENTURA ✦
            </div>


            <div class="detalle-logro-icono-grande">
                ${logro.icono}
            </div>


            <h2>
                ${logro.nombre}
            </h2>


            <div class="separador-logro-rpg">
                ✦ ───────── ✦
            </div>


            <div class="detalle-logro-texto">

                <p>
                    ${logro.descripcion}
                </p>

            </div>


            ${estado}


            <div class="detalle-logro-decoracion">
                ✧　✦　✧
            </div>

        </div>

    `;


    // En móvil bajamos automáticamente
    // hasta la ficha seleccionada.

    if (
        window.innerWidth <= 700
    ) {

        setTimeout(function () {

            detalle.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);
    }
}
// ==================================================
// ARCHIVOS
// ==================================================

function abrirArchivos() {

    let lista =
        document.getElementById(
            "lista-archivos"
        );

    let detalle =
        document.getElementById(
            "detalle-archivo"
        );

    let contador =
        document.getElementById(
            "contador-archivos"
        );


    if (!lista) {
        return;
    }


    lista.innerHTML = "";

    let archivosEncontrados = 0;


    // ==========================================
    // MENSAJE SECRETO
    // ==========================================

    if (
        mensajeSecretoComprado
    ) {

        archivosEncontrados++;

        lista.innerHTML += `

            <div
                class="archivo-rpg-lista"
                onclick="mostrarDetalleArchivo('mensaje')"
            >

                <div class="archivo-lista-icono">
                    💌
                </div>

                <div class="archivo-lista-info">

                    <h3>
                        MENSAJE SECRETO
                    </h3>

                    <p>
                        Archivo personal desbloqueado.
                    </p>

                    <span class="archivo-lista-estado">
                        ARCHIVO ENCONTRADO
                    </span>

                </div>

                <div class="archivo-lista-flecha">
                    ›
                </div>

            </div>

        `;
    }


    // ==========================================
    // ARCHIVO OXO
    // ==========================================

    if (
        estadoMision1 ===
        "completada"
    ) {

        archivosEncontrados++;

        lista.innerHTML += `

            <div
                class="archivo-rpg-lista"
                onclick="mostrarDetalleArchivo('oxo')"
            >

                <div class="archivo-lista-icono">
                    🎮
                </div>

                <div class="archivo-lista-info">

                    <h3>
                        ARCHIVO OXO
                    </h3>

                    <p>
                        Registro de una misión completada.
                    </p>

                    <span class="archivo-lista-estado">
                        REGISTRO
                    </span>

                </div>

                <div class="archivo-lista-flecha">
                    ›
                </div>

            </div>

        `;
    }


    // ==========================================
    // JAPÓN
    // ==========================================

    if (
        retos.japon.completado
    ) {

        archivosEncontrados++;

        lista.innerHTML += `

            <div
                class="archivo-rpg-lista"
                onclick="mostrarDetalleArchivo('japon')"
            >

                <div class="archivo-lista-icono">
                    🇯🇵
                </div>

                <div class="archivo-lista-info">

                    <h3>
                        CAMINO A JAPÓN
                    </h3>

                    <p>
                        Registro especial de la aventura.
                    </p>

                    <span class="archivo-lista-estado">
                        RECUERDO
                    </span>

                </div>

                <div class="archivo-lista-flecha">
                    ›
                </div>

            </div>

        `;
    }


    // ==========================================
    // NIVEL 23
    // ==========================================

    if (
        llave23Comprada
    ) {

        archivosEncontrados++;

        lista.innerHTML += `

            <div
                class="archivo-rpg-lista archivo-legendario-rpg"
                onclick="mostrarDetalleArchivo('nivel23')"
            >

                <div class="archivo-lista-icono">
                    🗝️
                </div>

                <div class="archivo-lista-info">

                    <h3>
                        ARCHIVO NIVEL 23
                    </h3>

                    <p>
                        Registro legendario desbloqueado.
                    </p>

                    <span class="archivo-lista-estado">
                        LEGENDARIO
                    </span>

                </div>

                <div class="archivo-lista-flecha">
                    ›
                </div>

            </div>

        `;
    }


    // ==========================================
    // EASTER EGG
    // ==========================================

    if (
        logros.secreto.desbloqueado
    ) {

        archivosEncontrados++;

        lista.innerHTML += `

            <div
                class="archivo-rpg-lista archivo-secreto-rpg"
                onclick="mostrarDetalleArchivo('easter')"
            >

                <div class="archivo-lista-icono">
                    🥚
                </div>

                <div class="archivo-lista-info">

                    <h3>
                        ARCHIVO 23
                    </h3>

                    <p>
                        Registro fuera de los límites.
                    </p>

                    <span class="archivo-lista-estado">
                        ???
                    </span>

                </div>

                <div class="archivo-lista-flecha">
                    ›
                </div>

            </div>

        `;
    }


    // ==========================================
    // SIN ARCHIVOS
    // ==========================================

    if (
        archivosEncontrados === 0
    ) {

        lista.innerHTML = `

            <div class="archivo-vacio-rpg">

                <span>
                    🔒
                </span>

                <h3>
                    SIN REGISTROS
                </h3>

                <p>
                    Todavía no has encontrado ningún archivo.
                </p>

                <small>
                    Sigue avanzando en la aventura.
                </small>

            </div>

        `;
    }


    // CONTADOR

    if (contador) {

        contador.textContent =
            archivosEncontrados;
    }


    // REINICIAMOS LA PÁGINA DERECHA

    if (detalle) {

        detalle.innerHTML = `

            <div class="detalle-archivo-vacio">

                <div class="detalle-archivo-icono">
                    📜
                </div>

                <p class="detalle-archivo-tipo">
                    ✦ ARCHIVO DE AVENTURA ✦
                </p>

                <h2>
                    REGISTROS ENCONTRADOS
                </h2>

                <p>
                    Selecciona un archivo para consultar
                    la información almacenada.
                </p>

                <div class="detalle-logro-estrellas">
                    ✦　✧　✦
                </div>

            </div>

        `;
    }


    mostrarPantalla(
        "pantalla-archivos"
    );
}
function mostrarDetalleArchivo(tipo) {

    let detalle =
        document.getElementById(
            "detalle-archivo"
        );


    if (!detalle) {
        return;
    }


    let contenido = "";


    // ==========================================
    // MENSAJE SECRETO
    // ==========================================

    if (
        tipo === "mensaje"
    ) {

        contenido = `

            <div class="ficha-archivo-rpg">

                <div class="detalle-archivo-icono">
                    💌
                </div>

                <p class="detalle-archivo-tipo">
                    ✦ ARCHIVO PERSONAL ✦
                </p>

                <h2>
                    MENSAJE SECRETO
                </h2>

                <div class="separador-logro-rpg">
                    ✦ ───────── ✦
                </div>

                <p>
                    Has desbloqueado un archivo
                    personal de la aventura.
                </p>

                <button
                    class="boton-abrir-archivo-rpg"
                    onclick="mostrarPantalla('pantalla-mensaje-secreto')"
                >
                    💌 ABRIR ARCHIVO
                </button>

            </div>

        `;
    }


    // ==========================================
    // OXO
    // ==========================================

    else if (
        tipo === "oxo"
    ) {

        contenido = `

            <div class="ficha-archivo-rpg">

                <div class="detalle-archivo-icono">
                    🎮
                </div>

                <p class="detalle-archivo-tipo">
                    ✦ REGISTRO DE MISIÓN ✦
                </p>

                <h2>
                    ARCHIVO OXO
                </h2>

                <div class="separador-logro-rpg">
                    ✦ ───────── ✦
                </div>

                <p>
                    Registro de la primera misión
                    completada durante la aventura.
                </p>

                <div class="archivo-sello-rpg">
                    ✓ REGISTRO COMPLETADO
                </div>

            </div>

        `;
    }


    // ==========================================
    // JAPÓN
    // ==========================================

    else if (
        tipo === "japon"
    ) {

        contenido = `

            <div class="ficha-archivo-rpg">

                <div class="detalle-archivo-icono">
                    🇯🇵
                </div>

                <p class="detalle-archivo-tipo">
                    ✦ RECUERDO DESBLOQUEADO ✦
                </p>

                <h2>
                    CAMINO A JAPÓN
                </h2>

                <div class="separador-logro-rpg">
                    ✦ ───────── ✦
                </div>

                <p>
                    Un pequeño paso hacia
                    una aventura futura.
                </p>

                <div class="archivo-sello-rpg">
                    ✓ RECUERDO ENCONTRADO
                </div>

            </div>

        `;
    }


    // ==========================================
    // NIVEL 23
    // ==========================================

    else if (
        tipo === "nivel23"
    ) {

        contenido = `

            <div class="ficha-archivo-rpg ficha-archivo-legendario">

                <div class="detalle-archivo-icono">
                    🗝️
                </div>

                <p class="detalle-archivo-tipo">
                    ✦ ARCHIVO LEGENDARIO ✦
                </p>

                <h2>
                    NIVEL 23
                </h2>

                <div class="separador-logro-rpg">
                    ✦ ───────── ✦
                </div>

                <p>
                    Has conseguido acceso
                    a un registro legendario.
                </p>

                <button
                    class="boton-abrir-archivo-rpg"
                    onclick="mostrarPantalla('pantalla-archivo-23')"
                >
                    🗝️ ABRIR ARCHIVO
                </button>

            </div>

        `;
    }


    // ==========================================
    // EASTER EGG
    // ==========================================

    else if (
        tipo === "easter"
    ) {

        contenido = `

            <div class="ficha-archivo-rpg">

                <div class="detalle-archivo-icono">
                    🥚
                </div>

                <p class="detalle-archivo-tipo">
                    ✦ ARCHIVO DESCONOCIDO ✦
                </p>

                <h2>
                    ARCHIVO 23
                </h2>

                <div class="separador-logro-rpg">
                    ✦ ───────── ✦
                </div>

                <p>
                    Este registro no debería estar aquí.
                </p>

                <button
                    class="boton-abrir-archivo-rpg"
                    onclick="mostrarPantalla('pantalla-easter-egg')"
                >
                    ??? ABRIR ARCHIVO
                </button>

            </div>

        `;
    }


    detalle.innerHTML =
        contenido;


    // En móvil bajamos automáticamente
    // hasta el detalle seleccionado.

    if (
        window.innerWidth <= 700
    ) {

        setTimeout(function () {

            detalle.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);
    }
}

// ==================================================
// EASTER EGG
// ==================================================

let pulsacionesTitulo = 0;


function secretoTitulo() {

    pulsacionesTitulo++;


    if (
        pulsacionesTitulo < 5
    ) {
        return;
    }


    pulsacionesTitulo = 0;


    desbloquearLogro(
        "secreto"
    );


    mostrarPantalla(
        "pantalla-easter-egg"
    );
}


// ==================================================
// CENA
// ==================================================

function actualizarZonaCena() {

    let zona =
        document.getElementById(
            "zona-cena"
        );


    if (!zona) {
        return;
    }


    if (
        estadoCena ===
        "oculta"
    ) {

        zona.classList.add(
            "zona-oculta"
        );

        return;
    }


    zona.classList.remove(
        "zona-oculta"
    );


    if (
        estadoCena ===
        "cerrada"
    ) {

        cambiarZona(
            "cena",
            "🔐",
            "UBICACIÓN SECRETA",
            "Se requiere una llave"
        );

    }

    else if (
        estadoCena ===
        "disponible"
    ) {

        cambiarZona(
            "cena",
            "❗",
            "MISIÓN SECRETA",
            "Nueva misión disponible"
        );

    }

    else if (
        estadoCena ===
        "enCurso"
    ) {

        cambiarZona(
            "cena",
            "🍽️",
            "RECARGA NOCTURNA",
            "Misión en curso"
        );

    }

    else {

        cambiarZona(
            "cena",
            "✅",
            "RECARGA NOCTURNA",
            "Misión completada"
        );
    }
}


function abrirCenaMapa() {

    if (
        estadoCena ===
        "cerrada"
    ) {

        mostrarPantalla(
            "pantalla-puerta-cena"
        );

    }

    else if (
        estadoCena ===
        "disponible"
    ) {

        mostrarPantalla(
            "pantalla-cena"
        );

    }

    else if (
        estadoCena ===
        "enCurso"
    ) {

        mostrarPantalla(
            "pantalla-cena-curso"
        );

    }

    else {

        mostrarPantalla(
            "pantalla-cena-completada"
        );

    }
}


function usarLlaveCena() {

    if (
        !llaveCenaComprada
    ) {
        return;
    }


    llaveCenaUsada =
        true;

    estadoCena =
        "disponible";


    guardarPartida();

    actualizarMapa();


    notificar(
        "🍽️",
        "MISIÓN SECRETA DESBLOQUEADA",
        "Una nueva aventura te espera."
    );


    mostrarPantalla(
        "pantalla-cena"
    );
}


function aceptarCena() {

    estadoCena =
        "enCurso";

    guardarPartida();

    mostrarPantalla(
        "pantalla-cena-curso"
    );
}


function completarCena() {

    estadoCena =
        "completada";


    desbloquearLogro(
        "cena"
    );


    guardarPartida();


    mostrarPantalla(
        "pantalla-cena-completada"
    );
}


function finalizarCena() {

    volverJuego();
}


// ==================================================
// PROGRESO
// ==================================================

function abrirProgreso() {

    let misiones =
        [
            estadoDesayuno,
            estadoMision1,
            estadoMision2,
            estadoMision3,
            estadoCena
        ]
        .filter(
            estado =>
                estado ===
                "completada"
        )
        .length;

    let retosCompletados =
        Object.values(retos)
            .filter(
                reto =>
                    reto.completado
            )
            .length;


    let logrosCompletados =
        contarLogros();


    document.getElementById(
        "progreso-xp"
    ).textContent =
        experiencia;


    document.getElementById(
        "progreso-misiones"
    ).textContent =
        misiones +
        " / 5";


    document.getElementById(
        "progreso-retos"
    ).textContent =
        retosCompletados +
        " / 9";


    document.getElementById(
        "progreso-logros"
    ).textContent =
        logrosCompletados +
        " / 14";


    document.getElementById(
        "progreso-monedas"
    ).textContent =
        monedasConseguidas;


    document.getElementById(
        "progreso-gastadas"
    ).textContent =
        monedasGastadas;


    let xpPorcentaje =
        Math.min(
            experiencia / 350 * 100,
            100
        );


    document.getElementById(
        "barra-xp-progreso"
    ).style.width =
        xpPorcentaje + "%";


    let total =
        Math.round(
            (
                xpPorcentaje +
                misiones / 5 * 100 +
                retosCompletados / 9 * 100 +
                logrosCompletados / 14 * 100
            ) / 4
        );


    document.getElementById(
        "porcentaje-total"
    ).textContent =
        total + "%";
let porcentajeTarjeta =
    document.getElementById(
        "porcentaje-total-tarjeta"
    );


if (porcentajeTarjeta) {

    porcentajeTarjeta.textContent =
        total + "%";
}
    mostrarPantalla(
        "pantalla-progreso"
    );
}


// ==================================================
// FINAL
// ==================================================

function puedeVerFinal() {

    return (
        llaveCenaUsada &&
        experiencia >= XP_MAXIMA &&
        estadoMision3 ===
        "completada"
    );
}
// ==================================================
// COMPROBAR SI EL FINAL ESTÁ DISPONIBLE
// ==================================================

function puedeVerFinal() {

    return (
        estadoCena === "completada" &&
        estadoMision3 === "completada" &&
        experiencia >= XP_MAXIMA
    );
}

function actualizarBotonFinal() {

    let boton =
        document.getElementById(
            "boton-final"
        );


    if (!boton) {
        return;
    }


    if (
        puedeVerFinal()
    ) {

        boton.classList.remove(
            "zona-oculta"
        );

    }

    else {

        boton.classList.add(
            "zona-oculta"
        );
    }
}


function abrirFinal() {

    if (
        !puedeVerFinal()
    ) {
        return;
    }


    let retosCompletados =
        Object.values(retos)
            .filter(
                reto =>
                    reto.completado
            )
            .length;


    document.getElementById(
        "final-xp"
    ).textContent =
        experiencia +
        " / 350";


    document.getElementById(
        "final-retos"
    ).textContent =
        retosCompletados +
        " / 9";


    document.getElementById(
        "final-logros"
    ).textContent =
        contarLogros() +
        " / 14";


    document.getElementById(
        "final-monedas"
    ).textContent =
        monedasConseguidas;


    let archivo =
        document.getElementById(
            "final-archivo"
        );


    if (
        llave23Comprada
    ) {

        archivo.innerHTML = `

            <div class="archivo-secreto">

                <h3>
                    🗝️ OBJETO LEGENDARIO DETECTADO
                </h3>

                <p>
                    ARCHIVO FINAL DISPONIBLE
                </p>

                <button onclick="mostrarPantalla('pantalla-archivo-23')">
                    🔓 DESBLOQUEAR ARCHIVO FINAL
                </button>

            </div>

        `;

    }

    else {

        archivo.innerHTML = `

            <div class="archivo archivo-bloqueado">

                <p>
                    🔒 ARCHIVO FINAL BLOQUEADO
                </p>

                <p>
                    Parece que existe una llave capaz de abrirlo...
                </p>

            </div>

        `;
    }


    mostrarPantalla(
        "pantalla-final"
    );
}


// ==================================================
// GUARDAR
// ==================================================

function guardarPartida() {

    let partida = {

        experiencia,
        monedas,
        vidas,

        monedasConseguidas,
        monedasGastadas,

        estadoDesayuno,

        estadoMision1,
        estadoMision2,
        estadoMision3,

        estadoCena,

        recompensaDesayunoRecogida,

        recompensaMision1Recogida,
        recompensaMision2Recogida,
        recompensaMision3Recogida,

       segundosIntentos,

eleccionJugador,
eleccionJugadorComprada,

mensajeSecretoComprado,

        llaveCenaComprada,
        llaveCenaUsada,

        llave23Comprada,

        retos,

        logros
    };


    localStorage.setItem(
        "nivel23Partida",
        JSON.stringify(partida)
    );
}


// ==================================================
// CARGAR
// ==================================================

function cargarPartida() {

    let guardada =
        localStorage.getItem(
            "nivel23Partida"
        );


    if (!guardada) {

        actualizarTodo();

        return;
    }


    try {

        let partida =
            JSON.parse(
                guardada
            );


        experiencia =
            partida.experiencia ?? 0;

        monedas =
            partida.monedas ?? 0;

        vidas =
            partida.vidas ?? 3;


        monedasConseguidas =
            partida.monedasConseguidas ?? 0;

        monedasGastadas =
            partida.monedasGastadas ?? 0;


        estadoDesayuno =
            partida.estadoDesayuno ??
            "bloqueada";


        estadoMision1 =
            partida.estadoMision1 ??
            "bloqueada";

        estadoMision2 =
            partida.estadoMision2 ??
            "bloqueada";

        estadoMision3 =
            partida.estadoMision3 ??
            "bloqueada";


        estadoCena =
            partida.estadoCena ??
            "oculta";


        recompensaDesayunoRecogida =
            partida.recompensaDesayunoRecogida ??
            false;


        recompensaMision1Recogida =
            partida.recompensaMision1Recogida ??
            false;

        recompensaMision2Recogida =
            partida.recompensaMision2Recogida ??
            false;

        recompensaMision3Recogida =
            partida.recompensaMision3Recogida ??
            false;


        segundosIntentos =
            partida.segundosIntentos ?? 0;


        eleccionJugador =
            partida.eleccionJugador ?? 0;
            eleccionJugadorComprada =
    partida.eleccionJugadorComprada ?? false;


        mensajeSecretoComprado =
            partida.mensajeSecretoComprado ??
            false;


        llaveCenaComprada =
            partida.llaveCenaComprada ??
            false;

        llaveCenaUsada =
            partida.llaveCenaUsada ??
            false;


        llave23Comprada =
            partida.llave23Comprada ??
            false;


        if (
            partida.retos
        ) {

            Object.keys(retos)
                .forEach(function (id) {

                    if (
                        partida.retos[id]
                    ) {

                        retos[id] = {
                            ...retos[id],
                            ...partida.retos[id]
                        };
                    }

                });
        }


        if (
            partida.logros
        ) {

            Object.keys(logros)
                .forEach(function (id) {

                    if (
                        partida.logros[id]
                    ) {

                        logros[id] = {
                            ...logros[id],
                            ...partida.logros[id]
                        };
                    }

                });
        }


        actualizarTodo();

    }

    catch (error) {

        console.error(
            "Error cargando partida:",
            error
        );
    }
    if (typeof datos !== "undefined") {
        if (typeof datos.intentosRasca === "number") {
            intentosRasca = datos.intentosRasca;
        }
        if (datos.rascaActivo) {
            rascaActivo = datos.rascaActivo;
        }
    }

}


// ==================================================
// REINICIAR PARTIDA
// ==================================================

function reiniciarPartida() {

    let confirmar =
        confirm(
            "¿Seguro que quieres reiniciar toda la partida? Se perderá el progreso guardado."
        );


    if (!confirmar) {
        return;
    }


    localStorage.removeItem(
        "nivel23Partida"
    );


    location.reload();
}

// ==================================================
// MENÚ MÁS · MÓVIL
// ==================================================

function abrirMenuMasMovil() {

    const menu =
        document.getElementById("menu-mas-movil");

    if (!menu) {
        return;
    }

    menu.classList.remove("zona-oculta");

    document.body.classList.add(
        "menu-movil-abierto"
    );
}


function cerrarMenuMasMovil() {

    const menu =
        document.getElementById("menu-mas-movil");

    if (!menu) {
        return;
    }

    menu.classList.add("zona-oculta");

    document.body.classList.remove(
        "menu-movil-abierto"
    );
}


function abrirDesdeMenuMas(seccion) {

    cerrarMenuMasMovil();

    if (seccion === "logros") {
        abrirLogros();
        return;
    }

    if (seccion === "archivos") {
        abrirArchivos();
        return;
    }

    if (seccion === "progreso") {
        abrirProgreso();
    }
}
// ==================================================
// INICIAR
// ==================================================

cargarPartida();

/*
    Al abrir o recargar la aplicación
    siempre mostramos la portada.

    La partida NO se borra:
    monedas, vidas, misiones, retos,
    rasca y gana, etc. siguen guardados.
*/

mostrarPantalla("pantalla-inicio");

// ==================================================
// AUTOGUARDADO DE LA PARTIDA
// ==================================================
function autoguardarPartida() {
    try {
        guardarPartida();
        console.log("Partida guardada automáticamente");
    } catch (error) {
        console.error("Error al guardar automáticamente:", error);
    }
}

document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") autoguardarPartida();
});
window.addEventListener("pagehide", autoguardarPartida);
window.addEventListener("beforeunload", autoguardarPartida);
setInterval(autoguardarPartida, 5000);
