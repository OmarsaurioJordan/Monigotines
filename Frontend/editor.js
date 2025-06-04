// obtener informacion del lienzo
// 240 x 192 = 32 opc + 128 ava + 64 obj + 16 col
const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
newMouseListener();
resizeCanvasEsc(1.3);

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
let clase = parseInt(document.getElementById("clase").value);
const avatar = new Avatar(
    usr, "", genero, piel, emocion, pelo, tinte,
    torso, color, cadera, tela, rol, clase, "", "", "", "", [96, 186]
);

// variables para interaccion con el canvas y avatar
let estado = 0; // seleccion actual

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
        let mPos = [mousPos.x, mousPos.y];
        // verificar si selecciono un estado
        for (let i = 0; i < 6; i++) {
            if (pointInCircle(mPos, [16, 16 + i * 32], 14)) {
                estado = i;
                break;
            }
        }
        // verificar si selecciono un color
        if (estado == 0) {
            for (let i = 0; i < 12; i++) {
                if (pointInCircle(mPos, [232, 8 + i * 16], 7)) {
                    document.getElementById("tinte").value = i;
                    avatar.tinte = i;
                    break;
                }
            }
        }
        else if (estado == 1) {
            for (let i = 0; i < 5; i++) {
                if (pointInCircle(mPos, [232, 8 + i * 16], 7)) {
                    document.getElementById("piel").value = i;
                    avatar.piel = i;
                    break;
                }
            }
        }
        else if (estado == 2 || estado == 3) {
            for (let i = 0; i < 12; i++) {
                if (pointInCircle(mPos, [232, 8 + i * 16], 7)) {
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
        // verificar si selecciono un scroll
        let sum = 0;
        if (pointInRectangle(mPos, [160, 176], [224, 192])) {
            sum = 1;
        }
        else if (pointInRectangle(mPos, [160, 0], [224, 16])) {
            sum = -1;
        }
        if (sum != 0) {
            switch (estado) {
                case 0: // pelo
                    avatar.pelo = BarrelSprAva(
                        avatar.pelo + sum, sprites.totPelo());
                    document.getElementById("pelo").value = avatar.pelo;
                    break;
                case 1: // emocion
                    avatar.emocion = BarrelSprAva(
                        avatar.emocion + sum, sprites.totEmocion());
                    document.getElementById("emocion").value = avatar.emocion;
                    break;
                case 2: // torso
                    avatar.torso = BarrelSprAva(
                        avatar.torso + sum, sprites.totTorso());
                    document.getElementById("torso").value = avatar.torso;
                    break;
                case 3: // cadera
                    avatar.cadera = BarrelSprAva(
                        avatar.cadera + sum, sprites.totCadera());
                    document.getElementById("cadera").value = avatar.cadera;
                    break;
                case 4: // rol
                    avatar.rol = BarrelSprAva(
                        avatar.rol + sum, sprites.totRol());
                    document.getElementById("rol").value = avatar.rol;
                    break;
                case 5: // clase
                    // Tarea clase
                    break;
            }
        }
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
    // dibujar las cosas seleccionables
    let aux;
    switch (estado) {
        case 0: // pelo
            aux = BarrelSprAva(avatar.pelo - 2, sprites.totPelo());
            for (let i = 0; i < 5; i++) {
                sprites.drawPelambre(ctx, [192, 142 - (i - 2) * 32],
                    avatar.genero, aux, avatar.tinte, 0.5);
                aux = BarrelSprAva(aux + 1, sprites.totPelo());
            }
            break;
        case 1: // emocion
            aux = BarrelSprAva(avatar.emocion - 2, sprites.totEmocion());
            for (let i = 0; i < 5; i++) {
                sprites.drawCarita(ctx, [192, 142 - (i - 2) * 32],
                    avatar.genero, avatar.piel, aux, 0.5);
                aux = BarrelSprAva(aux + 1, sprites.totEmocion());
            }
            break;
        case 2: // torso
            aux = BarrelSprAva(avatar.torso - 2, sprites.totTorso());
            for (let i = 0; i < 5; i++) {
                sprites.drawTorsito(ctx, [192, 124 - (i - 2) * 32],
                    avatar.genero, aux, avatar.color, 0.5);
                aux = BarrelSprAva(aux + 1, sprites.totTorso());
            }
            break;
        case 3: // cadera
            aux = BarrelSprAva(avatar.cadera - 2, sprites.totCadera());
            for (let i = 0; i < 5; i++) {
                sprites.drawCaderita(ctx, [192, 110 - (i - 2) * 32],
                    avatar.genero, aux, avatar.tela, 0.5);
                aux = BarrelSprAva(aux + 1, sprites.totCadera());
            }
            break;
        case 4: // rol
            aux = BarrelSprAva(avatar.rol - 2, sprites.totRol());
            for (let i = 0; i < 5; i++) {
                sprites.drawRolsito(ctx, [185, 120 - (i - 2) * 32],
                    aux, 0.5);
                aux = BarrelSprAva(aux + 1, sprites.totRol());
            }
            break;
        case 5: // clase
            // Tarea clase
            break;
    }
    // dibujar scroll vertical
    ctx.fillStyle = colorFondo;
    ctx.fillRect(160, 176, 64, 16);
    ctx.fillRect(160, 0, 64, 16);
    sprites.drawScroll(ctx, [192, 8], true);
    sprites.drawScroll(ctx, [192, 184], false);
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
