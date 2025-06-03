<?php
    require "tool_db.php";
    require "tool_mail.php";

    $correo = $_POST['correo'];
    $clave = newClave();
    $msjr = "&correo=$correo";

    if (!dominioValido($correo)) {
        header("Location:../Frontend/preregistro.php?msj=dominio_feo". $msjr);
    }

    $sql = "SELECT id FROM preregistro WHERE correo=?";
    $res = doQuery($sql, [$correo]);
    if ($res[0]) {
        if (count($res[1]) == 0) {
            $sql = "INSERT INTO preregistro (clave, correo) VALUES (?, ?)";
        }
        else {
            $sql = "UPDATE preregistro SET clave=? WHERE correo=?";
        }
        $res = doQuery($sql, [$clave, $correo]);
        if ($res[0]) {
            if ($res[1][0] == 0) {
                header("Location:../Frontend/preregistro.php?msj=existe_mail". $msjr);
            }
            else {
                $resMail = sendClave($correo, $clave);
                $msjr = $resMail[1]. $msjr;
                if ($resMail[0]) {
                    header("Location:../Frontend/registro.php?msj=". $msjr);
                }
                else {
                    header("Location:../Frontend/preregistro.php?msj=". $msjr);
                }
            }
        }
        else {
            header("Location:../Frontend/preregistro.php?msj=error_db". $msjr);
        }
    }
    else {
        header("Location:../Frontend/preregistro.php?msj=error_db". $msjr);
    }
?>
