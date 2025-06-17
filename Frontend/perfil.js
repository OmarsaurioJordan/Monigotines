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
const avaId = parseInt(document.getElementById("avaId").value);
var genero = parseInt(document.getElementById("genero").value);
var piel = parseInt(document.getElementById("piel").value);
var emocion = parseInt(document.getElementById("emocion").value);
var pelo = parseInt(document.getElementById("pelo").value);
var tinte = parseInt(document.getElementById("tinte").value);
var torso = parseInt(document.getElementById("torso").value);
var color = parseInt(document.getElementById("color").value);
var cadera = parseInt(document.getElementById("cadera").value);
var tela = parseInt(document.getElementById("tela").value);
var rol = parseInt(document.getElementById("rol").value);
var clase = parseInt(document.getElementById("clase").value);
var isNew = parseInt(document.getElementById("isNew").value);
const avatar = new Avatar(
    avaId, "", genero, piel, emocion, pelo, tinte,
    torso, color, cadera, tela, rol, clase, "", "", "", "",
    isNew, [64, 186]
);

// el main loop del juego
var lastTime = 0;
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
    if (avatar.isNew) {
        avatar.drawFantasma(ctx, sprites, false);
    }
    else {
        avatar.drawAvatar(ctx, sprites, false);
    }
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
