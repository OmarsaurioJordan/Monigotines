// para pintar alert en diferentes interfaces
function alertaMsj() {
    let msj = document.getElementById("msj").value;
    if (msj != "") {
        alert(msj);
    }
}
alertaMsj();

// para prevenir salida por error cuando se edita
function btnCancelar() {
    let usr = parseInt(document.getElementById("usr").value);
    if (confirm("❗ Si sales perderás todos los cambios ¿Salir?")) {
        window.location.href = "perfil.php?id=" + usr;
    }
}

function btnBloquear() {
    let id = parseInt(document.getElementById("avaId").value);
    let usr = parseInt(document.getElementById("usr").value);
    if (confirm("❗ ¿Vas a bloquear o desbloquear a este usuario?")) {
        window.location.href = "../Backend/bloquear.php?usr=" +
            usr + "&id=" + id;
    }
}
