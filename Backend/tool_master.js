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
