// para prevenir salida por error
function btnSalir() {
    if (confirm("❗ ¿Deseas cerrar la sesión?")) {
        window.location.href = '../Backend/salir.php';
    }
}

// obtener informacion del lienzo
// 240 x 192 = 32 opc + 128 ava + 64 obj + 16 col
const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
newMouseListener();
resizeCanvasEsc(1.3);

// crear el avatar asignandole datos precargados
let avaId = parseInt(document.getElementById("avaId").value);
let genero = parseInt(document.getElementById("genero").value);
let piel = parseInt(document.getElementById("piel").value);
let emocion = parseInt(document.getElementById("emocion").value);
let pelo = parseInt(document.getElementById("pelo").value);
let tinte = parseInt(document.getElementById("tinte").value);
let torso = parseInt(document.getElementById("torso").value);
let color = parseInt(document.getElementById("color").value);
let cadera = parseInt(document.getElementById("cadera").value);
let tela = parseInt(document.getElementById("tela").value);
let rol = parseInt(document.getElementById("rol").value);
let clase = parseInt(document.getElementById("clase").value);
const avatar = new Avatar(
    avaId, "", genero, piel, emocion, pelo, tinte,
    torso, color, cadera, tela, rol, clase, "", "", "", "", [64, 186]
);

// el main loop del juego
let lastTime = 0;
function loop(currentTime) {
    let dlt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    if (!Number.isFinite(dlt)) dlt = 0;
    // ejecutar todo usando el delta de tiempo
    step(dlt);
    draw();
    // pedir que se re ejecute de nuevo
    requestAnimationFrame(loop);
}

// se calcula la logica
function step(dlt) {
    // animar al avatar
    avatar.stepAnima(dlt);
    // verificar pulsacion de mouse
    if (mousPos.pulsado) {
        mousPos.pulsado = false;
    }
}

// se dibuja todo
const colorFondo = "rgb(180, 180, 150)";
function draw() {
    // limpiar lienzo
    ctx.fillStyle = colorFondo;
    ctx.fillRect(0, 0, width, height);
    // dibujar avatar
    avatar.drawAvatar(ctx, sprites, false);
}

// iniciar el loop cuando los sprites carguen
const sprites = new Sprites();
setTimeout(arranque, 100);
function arranque() {
    if (sprites.getReady()) {
        loop();
    }
    else {
        setTimeout(arranque, 100);
    }
}
