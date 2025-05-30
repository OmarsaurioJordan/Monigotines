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

// variables para interaccion con el canvas y avatar
let estado = 0; // seleccion actual

// pulsacion de mouse
let mousPos = [0, 0, false]; // x, y, recientemente_pulsado
canvas.addEventListener("mousedown", function(event) {
    if (event.button !== 0) { return null; }
    let rect = canvas.getBoundingClientRect();
    let scaleX = width / rect.width;
    let scaleY = height / rect.height;
    let x = Math.round((event.clientX - rect.left) * scaleX);
    let y = Math.round((event.clientY - rect.top) * scaleY);
    mousPos = [x, y, true];
});

function step(dlt) {
    // verificar pulsacion de mouse
    if (mousPos[2]) {
        mousPos[2] = false;
        // verificar si selecciono un estado
        for (let i = 0; i < 6; i++) {
            if (pointInCircle(mousPos, [16, 16 + i * 32], 14)) {
                estado = i;
                break;
            }
        }
        // verificar si selecciono un color
        if (estado == 0) {
            for (let i = 0; i < 12; i++) {
                if (pointInCircle(mousPos, [232, 8 + i * 16], 7)) {
                    document.getElementById("tinte").value = i;
                    avatar.tinte = i;
                    break;
                }
            }
        }
        else if (estado == 1) {
            for (let i = 0; i < 5; i++) {
                if (pointInCircle(mousPos, [232, 8 + i * 16], 7)) {
                    document.getElementById("piel").value = i;
                    avatar.piel = i;
                    break;
                }
            }
        }
        else if (estado == 2 || estado == 3) {
            for (let i = 0; i < 12; i++) {
                if (pointInCircle(mousPos, [232, 8 + i * 16], 7)) {
                    if (estado == 2) {
                        document.getElementById("color").value = i;
                        avatar.color = i;
                    }
                    else {
                        document.getElementById("tela").value = i;
                        avatar.tela = i;
                    }
                    break;
                }
            }
        }
    }
}

function pointInCircle(pos1, pos2, radio) {
    let dif = [
        Math.pow(pos1[0] - pos2[0], 2),
        Math.pow(pos1[1] - pos2[1], 2),
    ];
    return Math.sqrt(dif[0] + dif[1]) < radio;
}

function draw() {
    // limpiar lienzo
    ctx.fillStyle = "rgb(180, 180, 150)";
    ctx.fillRect(0, 0, width, height);
    // dibujar avatar
    avatar.draw(ctx, sprites);
    // dibujar los botones de la izquierda
    for (let i = 0; i < 6; i++) {
        sprites.drawSelect(ctx, [16, 16 + i * 32], i, estado == i);
    }
    // dibujar los colores
    if (estado == 0) {
        for (let i = 0; i < 12; i++) {
            sprites.drawColor(ctx, [232, 8 + i * 16], true, i);
        }
    }
    else if (estado == 1) {
        for (let i = 0; i < 5; i++) {
            sprites.drawPiel(ctx, [232, 8 + i * 16], i);
        }
    }
    else if (estado == 2 || estado == 3) {
        for (let i = 0; i < 12; i++) {
            sprites.drawColor(ctx, [232, 8 + i * 16], false, i);
        }
    }
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
