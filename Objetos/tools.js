// pulsacion de mouse

let mousPos = {
    x: 0,
    y: 0,
    pulsado: false,
    sostenido: 0,
    clic: false
};

function stepMouse(dlt) {
    // nota: este step debe ir al final de todos los eventos del loop
    if (mousPos.pulsado) {
        mousPos.sostenido += dlt;
    }
    if (mousPos.clic) {
        mousPos.clic = false;
    }
}

function newMouseListener() {
    canvas.addEventListener("mousemove", function(event) {
		let rect = canvas.getBoundingClientRect();
        let scaleX = width / rect.width;
        let scaleY = height / rect.height;
		mousPos.x = Math.round((event.clientX - rect.left) * scaleX);
		mousPos.y = Math.round((event.clientY - rect.top) * scaleY);
	});
    canvas.addEventListener("mousedown", function(event) {
        if (event.button != 0) { return null; }
        mousPos.pulsado = true;
        mousPos.sostenido = 0;
        mousPos.clic = false;
    });
    canvas.addEventListener("mouseup", function(event) {
        if (event.button != 0) { return null; }
        mousPos.pulsado = false;
        if (mousPos.sostenido < 0.333) { // seg clic
            mousPos.clic = true;
        }
    });
}

// escalar el canvas
function resizeCanvasEsc(scale) {
    canvas.style.width = (width * scale) + "px";
    canvas.style.height = (height * scale) + "px";
}

// escalar el canvas
function resizeCanvas() {
    const scaleX = (window.innerWidth * 0.9) / width;
    const scaleY = ((window.innerHeight - 100) * 0.9) / height;
    const scale = Math.min(scaleX, scaleY);
    canvas.style.width = (width * scale) + "px";
    canvas.style.height = (height * scale) + "px";
}

// pasar a modo pantalla completa
function activarFullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen(); // Chrome
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen(); // Safari
    } else if (canvas.mozRequestFullScreen) {
        canvas.mozRequestFullScreen(); // Firefox
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen(); // IE/Edge
    }
}

// mueve un valor haciendo que se mantenga en un rango
function BarrelSprAva(valor, valMax) {
    if (valor >= valMax) {
        return valor - valMax;
    }
    else if (valor < 0) {
        return valMax + valor;
    }
    return valor;
}

// true si el punto esta en el circulo
function pointInCircle(pos1, pos2, radio) {
    let dif = [
        Math.pow(pos1[0] - pos2[0], 2),
        Math.pow(pos1[1] - pos2[1], 2),
    ];
    return Math.sqrt(dif[0] + dif[1]) < radio;
}

// true si el punto esta en el rectangulo
function pointInRectangle(pos, rec1, rec2) {
    return pos[0] > rec1[0] && pos[0] < rec2[0] &&
        pos[1] > rec1[1] && pos[1] < rec2[1];
}

// comandos de teclado

let teclas = {
    'ArrowRight': false,
    'ArrowLeft': false,
    'ArrowDown': false,
    'ArrowUp': false,
    '+': false, 'Home': false,
    '-': false , 'End': false
}

window.addEventListener('keydown', e => {
    if (e.key in teclas) {
        teclas[e.key] = true;
    }
});

window.addEventListener('keyup', e => {
    if (e.key in teclas) {
        teclas[e.key] = false;
    }
});

// movimiento de camara

let camara = {
    x: 0,
    y: 0,
    zoom: 1
};

function iniCamara() {
    camara.x = worldW / 2;
    camara.y = worldH / 2;
    camara.zoom = 0.5;
}

function stepCamara(dlt) {
    let speed = (200 / camara.zoom) * dlt;
    let vel = [0, 0];
    if (teclas['ArrowRight']) { vel[0] += 1; }
    if (teclas['ArrowLeft']) { vel[0] -= 1; }
    if (teclas['ArrowUp']) { vel[1] -= 1; }
    if (teclas['ArrowDown']) { vel[1] += 1; }
    if (vel[0] != 0 && vel[1] != 0) {
        vel[0] *= 0.7; vel[1] *= 0.7;
    }
    camara.x += vel[0] * speed;
    camara.y += vel[1] * speed;
    if (teclas['+'] || teclas['Home']) { camara.zoom *= 1 + 0.5 * dlt; }
    if (teclas['-'] || teclas['End']) { camara.zoom /= 1 + 0.5 * dlt; }
    limitesCamara();
}

function limitesCamara() {
    camara.zoom = Math.max(width / worldW, Math.min(camara.zoom, 2));
    let talla = [(width / camara.zoom) / 2, (height / camara.zoom) / 2];
    camara.x = Math.max(talla[0], Math.min(camara.x, worldW - talla[0]));
    camara.y = Math.max(talla[1], Math.min(camara.y, worldH - talla[1]));
}
