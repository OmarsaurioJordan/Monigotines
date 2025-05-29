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

// crear el avatar asignandole datos precargados
let usr = parseInt(document.getElementById("usr").value);
let genero = parseInt(document.getElementById("genero").value);
let piel = parseInt(document.getElementById("piel").value);
let emocion = parseInt(document.getElementById("emocion").value);
let pelo = parseInt(document.getElementById("pelo").value);
let tinte = parseInt(document.getElementById("tinte").value);
let torso = parseInt(document.getElementById("torso").value);
let color = parseInt(document.getElementById("color").value);
let cadera = parseInt(document.getElementById("cadera").value);
let tela = parseInt(document.getElementById("tela").value);
let rol = parseInt(document.getElementById("rol").value);
const avatar = new Avatar(
    usr, "", genero, piel, emocion, pelo, tinte,
    torso, color, cadera, tela, rol, "", "", "", [96, 186]
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
