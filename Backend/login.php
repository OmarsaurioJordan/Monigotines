<?php
    require "tool_master.php";
    require "tool_db.php";

    $correo = $_POST['correo'];
    $clave = setClave($_POST['clave']);
    $msjr = "&correo=$correo";

    $sql = "SELECT a.id AS id, a.nombre AS nombre, a.genero AS genero
        FROM avatar a JOIN preregistro p ON a.correo = p.id
        WHERE p.correo=? AND a.clave=?";
    $res = doQuery($sql, [$correo, $clave]);
    if ($res[0]) {
        if (count($res[1]) == 0) {
            header("Location:../Frontend/login.php?msj=mal_login". $msjr);
        }
        else {
            $_SESSION['usr'] = $res[1][0]['id'];
            $_SESSION['nombre'] = $res[1][0]['nombre'];
            $_SESSION['genero'] = $res[1][0]['genero'];
            header("Location:../Frontend/perfil.php?id=". $_SESSION['usr']);
        }
    }
    else {
        header("Location:../Frontend/login.php?msj=error_db". $msjr);
    }
?>
