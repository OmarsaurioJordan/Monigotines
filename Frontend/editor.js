function btnVolver() {
    if (confirm("❗ Si sales perderás todos los cambios ¿Salir?")) {
        window.location.href = 'mundo.php';
    }
}

// 240 x 192 = 32 opc + 128 ava + 64 obj + 16 col
const out = document.getElementById("output");
out.innerHTML = ""; // para ver debug
const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const sprites = new Sprites();

// crear el avatar asignandole datos precargados
let usr = parseInt(document.getElementById("usr").value);
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
const avatar = new Avatar(
    usr, "", genero, piel, emocion, pelo, tinte,
    torso, color, cadera, tela, rol, "", "", "", [96, 186]
);

let lastTime = 0;
function loop(currentTime) {
    let dlt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    // ejecutar todo usando el delta de tiempo
    step(dlt);
    draw();
    // pedir que se re ejecute de nuevo
    requestAnimationFrame(loop);
}

function step(dlt) {
    // 
}

function draw() {
    // limpiar lienzo
    ctx.clearRect(0, 0, width, height);
    // dibujar avatar
    avatar.draw(ctx, sprites);
}

// dibujar todo e iniciar el loop cuando los sprites carguen
setTimeout(arranque, 100);
function arranque() {
    if (sprites.getReady()) {
        loop();
    }
    else {
        setTimeout(arranque, 100);
    }
}

// escalar el canvas
function resizeCanvas(scale) {
    canvas.style.width = (width * scale) + "px";
    canvas.style.height = (height * scale) + "px";
}
resizeCanvas(1.3);
