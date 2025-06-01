// pulsacion de mouse
let mousPos = [0, 0, false]; // x, y, fuepulsado
function newMouseListener() {
    canvas.addEventListener("mousemove", function(event) {
		let rect = canvas.getBoundingClientRect();
        let scaleX = width / rect.width;
        let scaleY = height / rect.height;
		mousPos[0] = Math.round((event.clientX - rect.left) * scaleX);
		mousPos[1] = Math.round((event.clientY - rect.top) * scaleY);
	});
    canvas.addEventListener("mousedown", function(event) {
        if (event.button != 0) { return null; }
        let rect = canvas.getBoundingClientRect();
        let scaleX = width / rect.width;
        let scaleY = height / rect.height;
        mousPos[0] = Math.round((event.clientX - rect.left) * scaleX);
        mousPos[1] = Math.round((event.clientY - rect.top) * scaleY);
        mousPos[2] = true;
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
