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
    "cadera,tela,rol,clase,mensaje,descripcion,link,musica");

// variables para interaccion en el mundo
let estado = 0; // seleccion actual
let seleccionado = null; // avatar que ha sido clickeado

// posicion 3 botones para ver perfil
const threeBtn = [
    height * 0.75 + 35 * 2 - 5, // Y
    5 + Avatar.descripcionW / 6, // 0
    5 + Avatar.descripcionW / 2, // 1
    5 + (Avatar.descripcionW / 6) * 5 // 2
];

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
    if (mousPos.clic) {
        if (seleccionado != null) {
            for (let i = 0; i < 3; i++) {
                if (pointInCircle(
                        [mousPos.x, mousPos.y],
                        [threeBtn[1 + i], threeBtn[0]],
                        threeBtn[1] / 2)) {
                    switch (i) {
                        case 0:
                            window.open("perfil.php?id=" + seleccionado.id, "_blank");
                            mousPos.clic = false;
                            break;
                        case 1:
                            if (seleccionado.link == "") { break; }
                            window.open(seleccionado.link, "_blank");
                            mousPos.clic = false;
                            break;
                        case 2:
                            if (seleccionado.musica == "") { break; }
                            window.open(seleccionado.musica, "_blank");
                            mousPos.clic = false;
                            break;
                    }
                    break;
                }
            }
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
                ava.descripcion, ava.link, ava.musica
            );
        }
        else {
            objetos.push(new Avatar(
                ava.id, ava.nombre, ava.genero, ava.piel, ava.emocion,
                ava.pelo, ava.tinte, ava.torso, ava.color, ava.cadera,
                ava.tela, ava.rol, ava.clase, ava.mensaje, ava.descripcion,
                ava.link, ava.musica, [Math.random() * worldW, Math.random() * worldH]
            ));
        }
        ava = cargador.popData(indAvaCrg);
    }
    // ejecutar el loop de los objetos
    objetos.forEach(obj => obj.step(dlt, estado, usuario));
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
    objetos.forEach(obj => obj.draw(ctx, sprites, estado));
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
            threeBtn[1], threeBtn[0]);
        ctx.fillText(seleccionado.link != "" ? "🌐Soci" : "",
            threeBtn[2], threeBtn[0]);
        ctx.fillText(seleccionado.musica != "" ? "🎵Músi" : "",
            threeBtn[3], threeBtn[0]);
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
