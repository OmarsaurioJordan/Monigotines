<?php
    require "tool_master.php";
    meterlo();
    require "tool_db.php";

    $correo = $_POST['correo'];
    $nombre = okNombre($_POST['nombre']);
    $clave = setClave($_POST['clave']);
    $mailc = $_POST['mailc'];
    $genero = $_POST['genero'];
    $msjr = "&correo=$correo&nombre=$nombre&mailc=$mailc&genero=$genero";

    if ($nombre == "") {
        header("Location:../Frontend/registro.php?msj=mal_nombre". $msjr);
    }

    $sql = "SELECT id FROM preregistro WHERE correo=? AND clave=? AND
        clave!='' AND actualiza >= NOW() - INTERVAL 1 HOUR";
    $res = doQuery($sql, [$correo, $mailc]);
    if ($res[0]) {
        if (count($res[1]) == 0) {
            header("Location:../Frontend/registro.php?msj=mal_registro". $msjr);
        }
        else {
            $idr = $res[1][0]['id'];
            $sql = "SELECT id FROM avatar WHERE correo=?";
            $res = doQuery($sql, [$idr]);
            if ($res[0]) {
                if (count($res[1]) == 0) {
                    $sql = "INSERT INTO avatar (clave, nombre, genero, correo)
                        VALUES (?, ?, ?, ?)";
                }
                else {
                    $sql = "UPDATE avatar SET clave=?, nombre=?, genero=?
                        WHERE correo=?";
                }
                $res = doQuery($sql, [$clave, $nombre, $genero, $idr]);
                if ($res[0]) {
                    if ($res[1][0] == 0) {
                        header("Location:../Frontend/registro.php?msj=existe_nombre". $msjr);
                    }
                    else {
                        header("Location:../Frontend/login.php?msj=registrado");
                    }
                }
                else {
                    header("Location:../Frontend/registro.php?msj=error_db". $msjr);
                }
            }
            else {
                header("Location:../Frontend/registro.php?msj=error_db". $msjr);
            }
        }
    }
    else {
        header("Location:../Frontend/registro.php?msj=error_db". $msjr);
    }
?>
