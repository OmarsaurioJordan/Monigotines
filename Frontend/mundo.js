// para prevenir salida por error
function btnVolver() {
    if (confirm("❗ ¿Deseas cerrar la sesión?")) {
        window.location.href = '../Backend/salir.php';
    }
}

// obtener informacion del lienzo y el mundo
const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const worldW = width * document.getElementById("escalaMundo").value;
const worldH = height * document.getElementById("escalaMundo").value;
const usuario = parseInt(document.getElementById("usuario").value);
newMouseListener();
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
iniCamara();

// estructura que guarda todos los objetos del juego
let objetos = [];
function getObjId(id, isAvatar=true) {
    let myClass = isAvatar ? Avatar : Mobiliario;
    for (let i = 0; i < objetos.length; i++) {
        if (objetos[i].id == id && objetos[i] instanceof myClass) {
            return i;
        }
    }
    return -1;
}

// el sistema que descarga los avatares de la DB
const cargador = new Cargador("../Backend/get_avatares.php");
const indAvaCrg = cargador.newConsulta("avatar",
    "id,nombre,genero,piel,emocion,pelo,tinte,torso,color," +
    "cadera,tela,rol,clase,mensaje,descripcion,link,musica," +
    "registro=actualiza AS isNew");

// variables para interaccion en el mundo
let estado = 0; // seleccion actual
let seleccionado = null; // avatar que ha sido clickeado
let mundoIdea = 0; // modo de guerra

// obtener ideologias de HTML
let txtIdeas = document.getElementById("ideologys").value.split("|");

// posicion de los botones de la interfaz [x, y, estado]
let altBtnsPrf1 = height * 0.75 + 35 * 2 - 5;
const threeBtn = [
    [5 + Avatar.descripcionW / 6, altBtnsPrf1, -1], // 0 perfil
    [5 + Avatar.descripcionW / 2, altBtnsPrf1, -1], // 1 link social
    [5 + (Avatar.descripcionW / 6) * 5, altBtnsPrf1, -1], // 2 link musica
    [width - 128, 32, 2] // 3 cambio de ideologia en modo war
];
const radioBtn = threeBtn[0][0] / 2;

// cambiar estado con los radio botnes
document.querySelectorAll("input[name='estado']").forEach(radio => {
    radio.addEventListener("change", () => {
        let seleccionado = document.querySelector("input[name='estado']:checked");
        estado = parseInt(seleccionado.value);
    });
});

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
    // detectar clic sobre interfaz GUI
    canvas.style.cursor = "default";
    for (let i = 0; i < threeBtn.length; i++) {
        if (threeBtn[i][2] != -1 && threeBtn[i][2] != estado) {
            continue;
        }
        if (pointInCircle([mousPos.x, mousPos.y], threeBtn[i], radioBtn)) {
            switch (i) {
                case 0: // perfil
                    if (seleccionado != null) {
                        canvas.style.cursor = "pointer";
                        if (mousPos.clic) {
                            window.open("perfil.php?id=" + seleccionado.id, "_blank");
                            mousPos.clic = false;
                        }
                    }
                    break;
                case 1: // link social
                    if (seleccionado != null) {
                        if (seleccionado.link == "") { break; }
                        canvas.style.cursor = "pointer";
                        if (mousPos.clic) {
                            window.open(seleccionado.link, "_blank");
                            mousPos.clic = false;
                        }
                    }
                    break;
                case 2: // link musica
                    if (seleccionado != null) {
                        if (seleccionado.musica == "") { break; }
                        canvas.style.cursor = "pointer";
                        if (mousPos.clic) {
                            window.open(seleccionado.musica, "_blank");
                            mousPos.clic = false;
                        }
                    }
                    break;
                case 3: // cambio de ideologia en modo war
                    canvas.style.cursor = "pointer";
                    if (mousPos.clic) {
                        mundoIdea++;
                        if (mundoIdea >= txtIdeas.length) {
                            mundoIdea = 0;
                        }
                        mousPos.clic = false;
                    }
                    break;
            }
            break;
        }
    }
    // ajustar la camara
    stepCamara(dlt);
    // cargar o actualizar avatares
    cargador.step(dlt);
    let oldAva = null;
    let ava = cargador.popData(indAvaCrg);
    while (ava) {
        oldAva = getObjId(ava.id);
        if (oldAva != -1) {
            objetos[oldAva].actualizar(
                ava.nombre, ava.genero, ava.piel, ava.emocion,
                ava.pelo, ava.tinte, ava.torso, ava.color, ava.cadera,
                ava.tela, ava.rol, ava.clase, ava.mensaje,
                ava.descripcion, ava.link, ava.musica, ava.isNew
            );
        }
        else {
            objetos.push(new Avatar(
                ava.id, ava.nombre, ava.genero, ava.piel, ava.emocion,
                ava.pelo, ava.tinte, ava.torso, ava.color, ava.cadera,
                ava.tela, ava.rol, ava.clase, ava.mensaje, ava.descripcion,
                ava.link, ava.musica, ava.isNew,
                [Math.random() * worldW, Math.random() * worldH]
            ));
        }
        ava = cargador.popData(indAvaCrg);
    }
    // ejecutar el loop de los objetos
    objetos.forEach(obj => obj.step(dlt, estado, usuario, mundoIdea));
    // verificar si mouse dio clic a avatar
    if (mousPos.clic) {
        seleccionado = null;
        let obj = null;
        for (let i = objetos.length - 1; i >= 0; i--) {
            if (objetos[i] instanceof Avatar) {
                obj = objetos[i];
                if (pointInRectangle(
                        [mousPos.wX, mousPos.wY],
                        [obj.pis[0] - Avatar.radio, obj.pis[1] - 120],
                        [obj.pis[0] + Avatar.radio, obj.pis[1]])) {
                    seleccionado = obj;
                    break;
                }
            }
        }
    }
    // actualizar el mouse
    stepMouse(dlt);
}

// se dibuja todo
function draw() {
    // efectuar transformada de camara
    ctx.translate(width / 2, height / 2); // centrar
    ctx.scale(camara.zoom, camara.zoom);
    ctx.translate(-camara.x, -camara.y);
    // dibujar todo el suelo
    sprites.drawSuelo(ctx, worldW, worldH);
    // ordenar en Y todos los objetos
    objetos.sort((a, b) => a.pis[1] - b.pis[1]);
    // dibujar sombras
    objetos.forEach(obj => obj.drawSombra(ctx, sprites));
    // dibujar aro seleccionado
    if (seleccionado != null) {
        sprites.drawAro(ctx, seleccionado.pis);
    }
    // dibujar todos los objetos
    objetos.forEach(obj => obj.draw(ctx, sprites, estado, mundoIdea));
    // dibujar la interfaz GUI, primero se reestablece la transformacion
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // dibujar datos del avatar seleccionado
    if (seleccionado != null) {
        if (seleccionado.descripcion != "") {
            Sprites.drawDescripcion(ctx, seleccionado.descripcion,
                [5, height * 0.75], Sprites.getMsjFont(), 20, 5,
                Avatar.descripcionW);
        }
        Sprites.drawDescripcion(ctx, seleccionado.nombre,
            [5, height * 0.75 + 35], Sprites.getMsjFont(true), 20, 5,
            Avatar.descripcionW);
        Sprites.drawDescripcion(ctx, "",
            [5, height * 0.75 + 35 * 2], Sprites.getMsjFont(true), 20, 5,
            Avatar.descripcionW);
        ctx.fillText("👤Perf",
            threeBtn[0][0], threeBtn[0][1]);
        ctx.fillText(seleccionado.link != "" ? "🌐Soci" : "",
            threeBtn[1][0], threeBtn[1][1]);
        ctx.fillText(seleccionado.musica != "" ? "🎵Músi" : "",
            threeBtn[2][0], threeBtn[2][1]);
    }
    // dibujar comandos segun estado de la simulacion
    switch (estado) {
        // Mundo
        case 0:

            break;
        // Explore
        case 1:

            break;
        // Guerra
        case 2:
            Sprites.drawMensaje(ctx, txtIdeas[mundoIdea],
                threeBtn[3], Sprites.getMsjFont(false), 20, 5);
            break;
        // Social
        case 3:

            break;
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
