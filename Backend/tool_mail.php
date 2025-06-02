<?php
    /*
    $hostMail = ""; // ej: smtp.tu-dominio.com
    $puertoMail = ""; // ej: 587
    $securityMail = ""; // tls, ttl, ssl
    $passwordMail = ""; // clave asignada en hosting al mail
    */
    $usuarioMail = "ojorcio@omwekiatl.xyz"; // ej: noreply@tu-dominio.com
    $isDebug = true; // para pruebas sin mail

    $mensaje = "Hola, este e-mail proviene de:\n\n".
                "https://omwekiatl.xyz/Monigotines".
                "\n\nUna página web interactiva para crear avatares ".
                "con funciónes sociales y con un fín académico, creada por ".
                "Omwekiatl, ing. electrónico y desarrollador de videojuegos\n\n".
                "Aquí tiene su clave de acceso: $$$".
                "\n\nSi tiene inquietudes, comuníquese a: ojorcio@gmail.com";

    function sendClave($mail_to, $clave) {
        global $usuarioMail, $mensaje, $isDebug;
        if ($isDebug) {
            return [true, "mtc:". $clave];
        }
        if (mail($mail_to,
                "Clave Monigotines",
                str_replace("$$$", $clave, $mensaje),
                "From: Omwekiatl <$usuarioMail>"
                )) {
            return [true, "msc:". $mail_to];
        }
        else {
            return [false, "nsem..."];
        }
    }
    /*
    function sendClavePro($mail_to, $clave) {
        global $isDebug, $hostMail, $serverMail, $mensaje,
            $usuarioMail, $passwordMail, $securityMail;
        if ($isDebug) {
            return [true, "mtc:". $clave];
        }
        $mail = new PHPMailer(true);
        try {
            // preparar configuracion
            $mail -> isSMTP();
            $mail -> Host = $hostMail;
            $mail -> SMTPAuth = true;
            $mail -> Username = $usuarioMail;
            $mail -> Password = $passwordMail;
            $mail -> SMTPSecure = $securityMail;
            $mail -> Port = $puertoMail;
            // preparar informacion
            $mail -> setFrom($usuarioMail, "Omwekiatl");
            $mail -> addAddress($mail_to);
            $mail -> Subject = "Clave Monigotines";
            $mail -> Body = str_replace("$$$", $clave, $mensaje)
            // hacer el envio
            $mail -> send();
            return [true, "msc:". $mail_to];
        }
        catch (Exception $e) {
            return [false, "nsem..."];
        }
    }
    */
    $testMailMail = isset($_GET['testMail']) ? $_GET['testMail'] : "";
    if ($testMailMail != "") {
        echo sendClave($testMailMail, "*** Test Message ***")[1]. "<br>";
        //echo sendClavePro($testMailMail, "*** Test Message Pro ***")[1];
    }
?>
