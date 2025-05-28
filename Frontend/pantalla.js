const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

function resizeCanvas() {
    const scaleX = (window.innerWidth * 0.9) / width;
    const scaleY = ((window.innerHeight - 100) * 0.9) / height;
    const scale = Math.min(scaleX, scaleY);
    canvas.style.width = (width * scale) + "px";
    canvas.style.height = (height * scale) + "px";
    canvas.style.imageRendering = "pixelated";
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

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
