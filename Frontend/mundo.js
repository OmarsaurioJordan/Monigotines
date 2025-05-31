// para prevenir salida por error
function btnVolver() {
    if (confirm("❗ ¿Deseas cerrar la sesión?")) {
        window.location.href = '../Backend/salir.php';
    }
}

// obtener informacion del lienzo y el mundo
const out = document.getElementById("output");
out.innerHTML = ""; // para ver debug
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
let avatares = [];

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
    let ava = cargador.popData(indAvaCrg);
    while (ava) {
        avatares.push(new Avatar(
            ava.id, ava.nombre, ava.genero, ava.piel, ava.emocion,
            ava.pelo, ava.tinte, ava.torso, ava.color, ava.cadera,
            ava.tela, ava.rol, ava.mensaje, ava.descripcion,
            ava.link, [Math.random() * width, Math.random() * height]
        ));
        ava = cargador.popData(indAvaCrg);
    }

    for (let i = 0; i < avatares.length; i++) {
        //avatares[i].pis[0] += 100 * dlt;
    }
}

// se dibuja todo
function draw() {
    // dibujar todo el suelo
    sprites.drawSuelo(ctx, worldW, worldH);
    // dibujar sombras
    
    // dibujar todos los objetos
    for (let i = 0; i < avatares.length; i++) {
        avatares[i].drawAvatar(ctx, sprites);
    }
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
