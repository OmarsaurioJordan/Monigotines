<?php
    session_start();

    $msj = showMsj(isset($_GET['msj']) ? $_GET['msj'] : "");
    echo "<input type='hidden' id='msj' value='$msj'>";

    function showMsj($msj) {
        switch ($msj) {
            case "registrado": // OK
                return "✅ Se ha registrado con éxito!!!";
            case "error_db": // OK
                return "⛔ Falló el acceso a la DB...";
            case "mal_login": // OK
                return "⛔ El e-mail o la clave son incorrectos...";
            case "existe_mail": // OK
                return "⛔ Posiblemente el e-mail esté ya en el sistema...";
            case "existe_nombre": // OK
                return "⛔ Posiblemente el nombre esté ya en el sistema...";
            case "dominio_feo": //OK
                return "⛔ Debe usar un mail con otro dominio, uno válido...";
            case "mal_nombre": // OK
                return "⛔ Debe escribir un nombre con caracteres válidos...";
            case "mal_registro": // OK
                return "Problemas con el pre-registro, ingrese sus datos ".
                    "bien, pre-registrese, la clave sirve 1 hora...";
            case "void": //
                return "⛔ No se obtuvieron datos...";
            default:
                if (strlen($msj) > 4) {
                    switch (substr($msj, 0, 4)) {
                        case "msc:": // OK
                            return "✅ Clave enviada a: ". substr($msj, 4);
                        case "mtc:": // OK
                            return "✅ Modo test, clave: ". substr($msj, 4);
                        case "nsem": // OK
                            return "⛔ No se pudo enviar el mail...";
                    }
                }
                return "";
        }
    }

    function meterlo() {
        if (isset($_SESSION['usr'])) {
            header("Location:../Frontend/mundo.php");
        }
    }

    function sacarlo() {
        if (!isset($_SESSION['usr'])) {
            header("Location:../Frontend/mundo.php");
        }
    }

    function salir() {
        session_unset();
        header("Location:../Frontend/login.php");
    }
?>
