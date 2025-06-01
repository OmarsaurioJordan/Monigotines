<link rel="stylesheet" href="Frontend/style.css">
<canvas id="gameCanvas" width="500" height="300"
    style="border:1px solid black;"></canvas>
<label id="output"></label>
<script src="Objetos/Sprites.js"></script>
<script>
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
/*
// Cámara
let cam = {
    x: 0, y: 0,
    zoom: 1
};

// Simulamos un mapa con objetos
const objetos = [
    { x: 100, y: 100, color: 'red' },
    { x: 300, y: 200, color: 'blue' },
    { x: 500, y: 400, color: 'green' }
];

function tintImage(originalImage, color) {
    const canvas = document.createElement('canvas');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    const ctxx = canvas.getContext('2d');
    // Dibuja el sprite original (blanco con transparencia)
    ctxx.drawImage(originalImage, 0, 0);
    // Cambia el modo de mezcla para aplicar color solo donde hay píxeles
    ctxx.globalCompositeOperation = 'multiply';
    ctxx.fillStyle = color; // Ej: "#ff0000"
    // Pinta encima con el color deseado
    ctxx.fillRect(0, 0, canvas.width, canvas.height);
    // resta fondo transparente
    ctxx.globalCompositeOperation = 'destination-in';
    ctxx.drawImage(originalImage, 0, 0);
    // retorna a modo normal
    ctxx.globalCompositeOperation = 'source-over';
    // Crear nueva imagen a partir del canvas tintado
    const tintedImage = new Image();
    tintedImage.src = canvas.toDataURL();
    return tintedImage;
}
let ready = false;
let rojo = null;
const blanco = new Image();
blanco.src = 'Sprites/d_monigotin_pelom_strip16.png';
blanco.onload = () => {
    rojo = tintImage(blanco, "#ff0000");
    rojo.onload = () => {
        ready = true;
    };
};

function draw() {
    // Limpiar canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Aplicar cámara
    ctx.translate(canvas.width / 2, canvas.height / 2); // Centrar la cámara
    ctx.scale(cam.zoom, cam.zoom);
    ctx.translate(-cam.x, -cam.y);

    // Dibujar objetos
    objetos.forEach(o => {
        ctx.fillStyle = o.color;
        ctx.fillRect(o.x - 25, o.y - 25, 50, 50); // cuadrados de 50x50
    });

    if (ready) {
        ctx.drawImage(rojo, 100, 100);
    }

    requestAnimationFrame(draw);
}

draw();

// Movimiento de cámara con teclado
window.addEventListener('keydown', e => {
    const speed = 10 / cam.zoom;
    if (e.key === 'ArrowRight') cam.x += speed;
    if (e.key === 'ArrowLeft') cam.x -= speed;
    if (e.key === 'ArrowDown') cam.y += speed;
    if (e.key === 'ArrowUp') cam.y -= speed;
    if (e.key === '+') cam.zoom *= 1.1;
    if (e.key === '-') cam.zoom /= 1.1;
});*/
const out = document.getElementById("output");
out.innerHTML = "";
// texto, anchoPx, altoPx, font, lineY, bordeX
const texto = "Un año antes, en 1147, se había producido la conquista de Lisboa por los cruzados. La operación se enmarcó en la bula de la cruzada promulgada por el pontífice Eugenio III.\n[1]" +
"Ramón IV contó con el apoyo de la República de Génova,[2] un contingente anglo-normando,[3] la Orden del Temple,[4] y los caballeros hospitalarios.\n[5] Durante el asedio a la ciudad tuvo lugar un bloqueo naval por parte de los genoveses que cerraba el río Ebro.[4]\n" +
"Tras la conquista, Ramón Berenguer IV restableció la sede de la diócesis de Tortosa.[6]";
const reTexto = Sprites.prepareTextMsj(
    texto, 400, 100, Sprites.getMsjFont(), 24, 40
);
out.innerHTML = "<br>" + reTexto + "<br><br>" + texto;
// ctx, texto, posicion, font, lineY, borde
Sprites.drawMensaje(ctx, reTexto, [250, 200],
    Sprites.getMsjFont(), 24, 5
);
</script>
