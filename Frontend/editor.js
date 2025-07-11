// obtener informacion del lienzo
// 240 x 192 = 32 opc + 128 ava + 64 obj + 16 col
const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
newMouseListener();
resizeCanvasEsc(1.3);

// crear el avatar asignandole datos precargados
const usr = parseInt(document.getElementById("usr").value);
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
const avatar = new Avatar(
    usr, "", genero, piel, emocion, pelo, tinte,
    torso, color, cadera, tela, rol, clase, "", "", "", "",
    false, {x: 96, y: 186}
);

// variables para interaccion con el canvas y avatar
var estado = 0; // seleccion actual

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
        let mPos = {x: mousPos.x, y: mousPos.y};
        // verificar si selecciono un estado
        for (let i = 0; i < 6; i++) {
            if (pointInCircle(mPos, {x: 16, y: 16 + i * 32}, 14)) {
                estado = i;
                break;
            }
        }
        // verificar si selecciono un color
        if (estado == 0) {
            for (let i = 0; i < 12; i++) {
                if (pointInCircle(mPos, {x: 232, y: 8 + i * 16}, 7)) {
                    document.getElementById("tinte").value = i;
                    avatar.tinte = i;
                    break;
                }
            }
        }
        else if (estado == 1) {
            for (let i = 0; i < 5; i++) {
                if (pointInCircle(mPos, {x: 232, y: 8 + i * 16}, 7)) {
                    document.getElementById("piel").value = i;
                    avatar.piel = i;
                    break;
                }
            }
        }
        else if (estado == 2 || estado == 3) {
            for (let i = 0; i < 12; i++) {
                if (pointInCircle(mPos, {x: 232, y: 8 + i * 16}, 7)) {
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
        if (pointInRectangle(mPos, {x: 160, y: 192 - 16 * 5},
                {x: 224, y: 192})) {
            sum = 1;
        }
        else if (pointInRectangle(mPos, {x: 160, y: 0},
                {x: 224, y: 16 * 5})) {
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
                    avatar.clase = BarrelSprAva(
                        avatar.clase + sum, sprites.totClase());
                    document.getElementById("clase").value = avatar.clase;
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
    avatar.drawAvatar(ctx, sprites, false, estado == 5);
    // dibujar los botones de la izquierda
    for (let i = 0; i < 6; i++) {
        sprites.drawSelect(ctx, {x: 16, y: 16 + i * 32}, i, estado == i);
    }
    // dibujar los colores
    if (estado == 0) {
        for (let i = 0; i < 12; i++) {
            sprites.drawColor(ctx, {x: 232, y: 8 + i * 16}, true, i);
        }
    }
    else if (estado == 1) {
        for (let i = 0; i < 5; i++) {
            sprites.drawPiel(ctx, {x: 232, y: 8 + i * 16}, i);
        }
    }
    else if (estado == 2 || estado == 3) {
        for (let i = 0; i < 12; i++) {
            sprites.drawColor(ctx, {x: 232, y: 8 + i * 16}, false, i);
        }
    }
    // dibujar las cosas seleccionables
    let aux;
    switch (estado) {
        case 0: // pelo
            aux = BarrelSprAva(avatar.pelo - 2, sprites.totPelo());
            for (let i = 0; i < 5; i++) {
                sprites.drawPelambre(ctx, {x: 192, y: 142 - (i - 2) * 32},
                    avatar.genero, aux, avatar.tinte, 0.5);
                aux = BarrelSprAva(aux + 1, sprites.totPelo());
            }
            break;
        case 1: // emocion
            aux = BarrelSprAva(avatar.emocion - 2, sprites.totEmocion());
            for (let i = 0; i < 5; i++) {
                sprites.drawCarita(ctx, {x: 192, y: 142 - (i - 2) * 32},
                    avatar.genero, avatar.piel, aux, 0.5);
                aux = BarrelSprAva(aux + 1, sprites.totEmocion());
            }
            break;
        case 2: // torso
            aux = BarrelSprAva(avatar.torso - 2, sprites.totTorso());
            for (let i = 0; i < 5; i++) {
                sprites.drawTorsito(ctx, {x: 192, y: 124 - (i - 2) * 32},
                    avatar.genero, aux, avatar.color, 0.5);
                aux = BarrelSprAva(aux + 1, sprites.totTorso());
            }
            break;
        case 3: // cadera
            aux = BarrelSprAva(avatar.cadera - 2, sprites.totCadera());
            for (let i = 0; i < 5; i++) {
                sprites.drawCaderita(ctx, {x: 192, y: 110 - (i - 2) * 32},
                    avatar.genero, aux, avatar.tela, 0.5);
                aux = BarrelSprAva(aux + 1, sprites.totCadera());
            }
            break;
        case 4: // rol
            aux = BarrelSprAva(avatar.rol - 2, sprites.totRol());
            for (let i = 0; i < 5; i++) {
                sprites.drawRolsito(ctx, {x: 185, y: 120 - (i - 2) * 32},
                    aux, 0.5);
                aux = BarrelSprAva(aux + 1, sprites.totRol());
            }
            break;
        case 5: // clase
            aux = BarrelSprAva(avatar.clase - 2, sprites.totClase());
            for (let i = 0; i < 5; i++) {
                sprites.drawClasesita(ctx, {x: 185, y: 120 - (i - 2) * 32},
                    aux, 0.5);
                aux = BarrelSprAva(aux + 1, sprites.totClase());
            }
            break;
    }
    // dibujar scroll vertical
    ctx.fillStyle = colorFondo;
    ctx.fillRect(160, 176, 64, 16);
    ctx.fillRect(160, 0, 64, 16);
    sprites.drawScroll(ctx, {x: 192, y: 8}, true);
    sprites.drawScroll(ctx, {x: 192, y: 184}, false);
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
