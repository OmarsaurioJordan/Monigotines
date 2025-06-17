// pulsacion de mouse

const mousPos = {
    x: 0, // posicion en el lienzo, sin afectarse por escalamiento ni mov
    y: 0,
    wX: 0, // posicion del mouse en el mundo, independiente de la camara
    wY: 0,
    rueda: 0, // -1 +1 cuando se mueve el scroll
    pulsado: false, // true el clic izquierdo esta apretado
    sostenido: 0, // segundos que lleva apretado el clic
    clic: false // si se solto rapido queda en true, asi pulsado este en false
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
        let camW = width / camara.zoom;
        let camH = height / camara.zoom;
        mousPos.wX = camara.x + camW * (mousPos.x / width - 0.5);
        mousPos.wY = camara.y + camH * (mousPos.y / height - 0.5);
	});
    canvas.addEventListener("mousedown", function(event) {
        if (event.button != 0) { return null; }
        mousPos.pulsado = true;
        mousPos.sostenido = 0;
        mousPos.clic = false;
    });
    canvas.addEventListener("mouseup", function(event) {
        if (event.button != 0) { return null; }
        if (mousPos.sostenido < 0.333) { // seg clic
            mousPos.clic = true;
        }
    });
    document.addEventListener("mouseup", function(event) {
        if (event.button != 0) { return null; }
        mousPos.pulsado = false;
    });
    canvas.addEventListener("wheel", function(event) {
        mousPos.rueda = Math.sign(event.deltaY);
        event.preventDefault(); // no contar navegador scroll
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

function pointDistance(pos1, pos2) {
    let dif = [
        Math.pow(pos1[0] - pos2[0], 2),
        Math.pow(pos1[1] - pos2[1], 2),
    ];
    return Math.sqrt(dif[0] + dif[1]);
}

// true si el punto esta en el circulo
function pointInCircle(pos1, pos2, radio) {
    let dist = pointDistance(pos1, pos2);
    return dist < radio;
}

// true si el punto esta en el rectangulo
function pointInRectangle(pos, rec1, rec2) {
    return pos[0] > rec1[0] && pos[0] < rec2[0] &&
        pos[1] > rec1[1] && pos[1] < rec2[1];
}

// comandos de teclado

const teclas = {
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

const camara = {
    x: 0, // centro de la camara
    y: 0,
    zoom: 1, // acercamiento, >1 cerca, <1 lejos
    pulsoX: -1, // donde el mouse hace clic para guardarlo al arrastrar
    pulsoY: -1
};

function iniCamara() {
    camara.x = worldW / 2;
    camara.y = worldH / 2;
    camara.zoom = 0.5;
}

function stepCamara(dlt) {
    // movimiento con teclas
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
    if (teclas['+'] || teclas['Home']) {
        camara.zoom *= 1 + 0.5 * dlt;
    }
    if (teclas['-'] || teclas['End']) {
        camara.zoom *= 1 - 0.5 * dlt;
    }
    // movimiento con mouse
    if (mousPos.pulsado) {
        if (camara.pulsoX == -1 && camara.pulsoY == -1) {
            camara.pulsoX = mousPos.wX;
            camara.pulsoY = mousPos.wY;
        }
        else {
            camara.x += camara.pulsoX - mousPos.wX;
            camara.y += camara.pulsoY - mousPos.wY;
        }
    }
    else if (camara.pulsoX != -1 || camara.pulsoY != -1) {
        camara.pulsoX = -1;
        camara.pulsoY = -1;
    }
    // hacer scroll con mouse
    if (mousPos.rueda != 0) {
        camara.zoom *= 1 - mousPos.rueda * 0.1;
        mousPos.rueda = 0;
        let cx = mousPos.x / camara.zoom;
        let cy = mousPos.y / camara.zoom;
        camara.x = mousPos.wX - cx + (width / camara.zoom) / 2;
        camara.y = mousPos.wY - cy + (height / camara.zoom) / 2;
    }
    // limites
    limitesCamara();
}

function limitesCamara() {
    camara.zoom = Math.max(width / worldW, Math.min(camara.zoom, 2));
    let talla = [(width / camara.zoom) / 2, (height / camara.zoom) / 2];
    camara.x = Math.max(talla[0], Math.min(camara.x, worldW - talla[0]));
    camara.y = Math.max(talla[1], Math.min(camara.y, worldH - talla[1]));
}
