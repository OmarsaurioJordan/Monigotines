<?php
    require "tool_master.php";
    sacarlo();
    require "tool_db.php";

    $usr = $_GET['usr'];
    $id = $_GET['id'];
    $tipo = $_GET['tipo'];

    if ($usr != $_SESSION['usr']) {
        header("Location:../Frontend/perfil.php?id=$id");
    }

    $sql = "SELECT tipo FROM reaccion WHERE emisor=? AND receptor=?";
    $res = doQuery($sql, [$usr, $id]);
    if ($res[0]) {
        if (count($res[1]) == 0) {
            $sql = "INSERT INTO reaccion (emisor, receptor, tipo)
                VALUES (?, ?, ?)";
            doQuery($sql, [$usr, $id, $tipo]);
        }
        else if ($res[1][0]['tipo'] == $tipo) {
            $sql = "UPDATE reaccion SET tipo=? WHERE emisor=? AND receptor=?";
            doQuery($sql, ["100", $usr, $id]); // un numero X alto max 127
        }
        else {
            $sql = "UPDATE reaccion SET tipo=? WHERE emisor=? AND receptor=?";
            doQuery($sql, [$tipo, $usr, $id]);
        }
        header("Location:../Frontend/perfil.php?id=$id");
    }
    else {
        header("Location:../Frontend/perfil.php?id=$id&msj=error_db");
    }
?>
