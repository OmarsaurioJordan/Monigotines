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
const objetos = [];
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
const indIdeCrg = cargador.newConsulta("ideologia",
    "avatar AS id,zodiaco,elemento,ang_dem,izq_der,pol_lad,rel_cie," +
    "mon_pol,car_veg,ext_int,azu_roj,pas_fut,urb_cam,art_ing,fie_est");

// variables para interaccion en el mundo
var estado = 0; // seleccion actual
var seleccionado = null; // avatar que ha sido clickeado
var mundoIdea = 0; // modo de guerra
var mundoClases = true; // si activar la war por clases o no
var auxIdeas = null; // variable auxiliar para cargar ideologias

// obtener ideologias de HTML
const txtIdeas = document.getElementById("ideologys").value.split("|");

// posicion de los botones de la interfaz [x, y, estado]
const altBtnsPrf1 = height * 0.75 + 35 * 2 - 5;
const threeBtn = [
    {x: 5 + Avatar.DESCRIPCION_W / 6, y: altBtnsPrf1, est: -1}, // 0 perfil
    {x: 5 + Avatar.DESCRIPCION_W / 2, y: altBtnsPrf1, est: -1}, // 1 link social
    {x: 5 + (Avatar.DESCRIPCION_W / 6) * 5, y: altBtnsPrf1, est: -1}, // 2 link musica
    {x: width - 128, y: 32, est: 2}, // 3 cambio de ideologia en modo war
    {x: width - 128 * 2.5, y: 32, est: 2}, // 4 reiniciar la guerra en war
    {x: width - 128 * 3.5, y: 32, est: 2} // 5 cambio modo clases en war
];
const radioBtn = threeBtn[0].x / 2;

// cambiar estado con los radio botnes
document.querySelectorAll("input[name='estado']").forEach(radio => {
    radio.addEventListener("change", () => {
        let seleccionado = document.querySelector("input[name='estado']:checked");
        estado = parseInt(seleccionado.value);
    });
});

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
    // detectar clic sobre interfaz GUI
    canvas.style.cursor = "default";
    for (let i = 0; i < threeBtn.length; i++) {
        if (threeBtn[i].est != -1 && threeBtn[i].est != estado) {
            continue;
        }
        if (pointInCircle(mousPos, threeBtn[i], radioBtn)) {
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
                case 4: // reiniciar la guerra en war
                    canvas.style.cursor = "pointer";
                    if (mousPos.clic) {
                        objetos.forEach(obj => obj.restart());
                        mousPos.clic = false;
                    }
                    break;
                case 5: // cambio modo clases en war
                    canvas.style.cursor = "pointer";
                    if (mousPos.clic) {
                        mundoClases = !mundoClases;
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
    cargador.step(dlt, indAvaCrg);
    let ava = cargador.popData(indAvaCrg);
    if (ava) {
        let oldAva = getObjId(ava.id);
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
                {x: Math.random() * worldW, y: Math.random() * worldH}
            ));
        }
    }
    // cargar o actualizar ideologias
    cargador.step(dlt / 4, indIdeCrg);
    if (auxIdeas) {
        ava = auxIdeas;
        let oldAva = getObjId(ava.id);
        if (oldAva != -1) {
            objetos[oldAva].setIdeas(
                ava.zodiaco, ava.elemento,
                [ava.ang_dem, ava.izq_der, ava.pol_lad, ava.rel_cie,
                    ava.mon_pol, ava.car_veg, ava.ext_int, ava.art_ing,
                    ava.urb_cam, ava.fie_est, ava.pas_fut, ava.azu_roj]
            );
            auxIdeas = null;
        }
    }
    else {
        auxIdeas = cargador.popData(indIdeCrg);
    }
    // ejecutar el loop de los objetos
    objetos.forEach(obj => obj.step(dlt, estado));
    // verificar si mouse dio clic a avatar
    if (mousPos.clic) {
        seleccionado = null;
        let obj = null;
        for (let i = objetos.length - 1; i >= 0; i--) {
            if (objetos[i] instanceof Avatar) {
                obj = objetos[i];
                if (pointInRectangle(
                        {x: mousPos.wX, y: mousPos.wY},
                        {x: obj.pis.x - Avatar.RADIO, y: obj.pis.y - 120},
                        {x: obj.pis.x + Avatar.RADIO, y: obj.pis.y})) {
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
    objetos.sort((a, b) => a.pis.y - b.pis.y);
    // dibujar sombras
    objetos.forEach(obj => obj.drawSombra(ctx, sprites));
    // dibujar circulos de vision
    //objetos.forEach(obj => sprites.drawCircle(ctx, obj.pis, Avatar.VISION));
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
                {x: 5, y: height * 0.75}, Sprites.getMsjFont(), 20, 5,
                Avatar.DESCRIPCION_W);
        }
        Sprites.drawDescripcion(ctx, seleccionado.nombre,
            {x: 5, y: height * 0.75 + 35}, Sprites.getMsjFont(true), 20, 5,
            Avatar.DESCRIPCION_W);
        Sprites.drawDescripcion(ctx, "",
            {x: 5, y: height * 0.75 + 35 * 2}, Sprites.getMsjFont(true), 20, 5,
            Avatar.DESCRIPCION_W);
        ctx.fillText("👤Perf",
            threeBtn[0].x, threeBtn[0].y);
        ctx.fillText(seleccionado.link != "" ? "🌐Soci" : "",
            threeBtn[1].x, threeBtn[1].y);
        ctx.fillText(seleccionado.musica != "" ? "🎵Músi" : "",
            threeBtn[2].x, threeBtn[2].y);
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
            Sprites.drawMensaje(ctx, (mundoClases ? "🗡️ Clases" : "✊ Equal"),
                threeBtn[5], Sprites.getMsjFont(false), 20, 5);
            Sprites.drawMensaje(ctx, "♻️ Reiniciar",
                threeBtn[4], Sprites.getMsjFont(false), 20, 5);
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
