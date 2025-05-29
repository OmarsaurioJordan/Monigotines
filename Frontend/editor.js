function btnVolver() {
    if (confirm("❗ Si sales perderás todos los cambios ¿Salir?")) {
        window.location.href = 'mundo.php';
    }
}

// 256 x 192 = 32 opc + 128 ava + 64 obj + 32 col
const out = document.getElementById("output");
out.innerHTML = ""; // para ver debug
const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");
const sprites = new Sprites();
const avatar = new Avatar(
    0, "", 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, "", "", "", [96, 186]
);

setTimeout(arranque, 100);
function arranque() {
    if (sprites.getReady()) {
        avatar.draw(ctx, sprites);
    }
    else {
        setTimeout(arranque, 100);
    }
}
