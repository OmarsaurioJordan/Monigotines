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
newMouseListener();
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

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
    "cadera,tela,rol,mensaje,descripcion,link");

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
    // cargar o actualizar avatares
    cargador.step(dlt);
    let oldAva = null;
    let ava = cargador.popData(indAvaCrg);
    while (ava) {
        oldAva = getObjId(ava.id);


        console.log("ava: " + oldAva);


        if (oldAva != -1) {
            objetos[oldAva].actualizar(
                ava.nombre, ava.genero, ava.piel, ava.emocion,
                ava.pelo, ava.tinte, ava.torso, ava.color, ava.cadera,
                ava.tela, ava.rol, ava.mensaje, ava.descripcion, ava.link
            );
        }
        else {
            objetos.push(new Avatar(
                ava.id, ava.nombre, ava.genero, ava.piel, ava.emocion,
                ava.pelo, ava.tinte, ava.torso, ava.color, ava.cadera,
                ava.tela, ava.rol, ava.mensaje, ava.descripcion,
                ava.link, [Math.random() * width, Math.random() * height]
            ));
        }
        ava = cargador.popData(indAvaCrg);
    }
    // ejecutar el loop de los objetos
    objetos.forEach(obj => obj.step(dlt));
}

// se dibuja todo
function draw() {
    // dibujar todo el suelo
    sprites.drawSuelo(ctx, worldW, worldH);
    // ordenar en Y todos los objetos
    objetos.sort((a, b) => a.pis[1] - b.pis[1]);
    // dibujar sombras
    objetos.forEach(obj => sprites.drawSombra(ctx, obj.pis));
    // dibujar todos los objetos
    objetos.forEach(obj => obj.draw(ctx, sprites));
    // dibujar la interfaz GUI
    
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
