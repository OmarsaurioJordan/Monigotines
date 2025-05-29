<canvas id="gameCanvas" width="1000" height="700"
    style="border:1px solid black;"></canvas>
<script>
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
});
</script>
