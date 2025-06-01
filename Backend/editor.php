<?php
    require "tool_master.php";
    require "tool_db.php";

    $usr = $_POST['usr'];
    $nombre = $_POST['nombre'];
    $genero = $_POST['genero'];
    $piel = $_POST['piel'];
    $emocion = $_POST['emocion'];
    $pelo = $_POST['pelo'];
    $tinte = $_POST['tinte'];
    $torso = $_POST['torso'];
    $color = $_POST['color'];
    $cadera = $_POST['cadera'];
    $tela = $_POST['tela'];
    $rol = $_POST['rol'];
    $mensaje = okMensaje($_POST['mensaje']);
    $descripcion = okMensaje($_POST['descripcion']);
    $link = $_POST['link'];

    $sql = "UPDATE avatar SET nombre=?, genero=?, piel=?, emocion=?,
        pelo=?, tinte=?, torso=?, color=?, cadera=?, tela=?, rol=?,
        mensaje=?, descripcion=?, link=? WHERE id=?";
    $res = doQuery($sql, [$nombre, $genero, $piel, $emocion,
        $pelo, $tinte, $torso, $color, $cadera, $tela, $rol,
        $mensaje, $descripcion, $link, $usr]);
    if ($res[0]) {
        header("Location:../Frontend/postedicion.php?msjok=1");
    }
    else {
        header("Location:../Frontend/editor.php?msj=error_db");
    }
?>
