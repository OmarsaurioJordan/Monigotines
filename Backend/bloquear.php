<?php
    require "tool_master.php";
    sacarlo();
    require "tool_db.php";

    $usr = $_GET['usr'];
    $id = $_GET['id'];

    if ($usr != $_SESSION['usr']) {
        header("Location:../Frontend/perfil.php?id=$id");
    }

    $sql = "SELECT estado FROM bloqueo WHERE bloqueador=? AND bloqueado=?";
    $res = doQuery($sql, [$usr, $id]);
    if ($res[0]) {
        if (count($res[1]) == 0) {
            $sql = "INSERT INTO bloqueo (bloqueador, bloqueado)
                VALUES (?, ?)";
            doQuery($sql, [$usr, $id]);
        }
        else if ($res[1][0]['estado'] == 0) {
            $sql = "UPDATE bloqueo SET estado=1
                WHERE bloqueador=? AND bloqueado=?";
            doQuery($sql, [$usr, $id]);
        }
        else {
            $sql = "UPDATE bloqueo SET estado=0
                WHERE bloqueador=? AND bloqueado=?";
            doQuery($sql, [$usr, $id]);
        }
        header("Location:../Frontend/bloqueados.php");
    }
    else {
        header("Location:../Frontend/perfil.php?id=$id&msj=error_db");
    }
?>
