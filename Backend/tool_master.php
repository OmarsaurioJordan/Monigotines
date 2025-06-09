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

    function getZodiaco() {
        return [
            "♈ Aries",
            "♉ Tauro",
            "♊ Géminis",
            "♋ Cáncer",
            "♌ Leo",
            "♍ Virgo",
            "♎ Libra",
            "♏ Escorpio",
            "♐ Sagitario",
            "♑ Capricornio",
            "♒ Acuario",
            "♓ Piscis"
        ];
    }

    function getElementos() {
        return [
            "🍀 Tierra",
            "💧 Agua",
            "🌪️ Aire",
            "🔥 Fuego"
        ];
    }

    function getIdeologias() {
        return [
            ["muj_hom", "🚺 Fem", "🚹 Masc"],
            ["ang_dem", "👽 Ángel", "😈 Demon"],
            ["izq_der", "⚒️ Comun", "💰 Capital"],
            ["pol_lad", "🔰 Poli", "🔪 Lacra"],
            ["rel_cie", "🔮 Alma", "📊 Ciencia"],
            ["mon_pol", "🌞 Dios", "🐍 Magia"],
            ["car_veg", "🍗 Carnív", "🍏 Hervív"],
            ["ext_int", "😁 Extrov", "😶 Introv"],
            ["art_ing", "🎨 Arte", "📐 Inge"],
            ["urb_cam", "⚙️ Ciudad", "🐴 Campo"],
            ["fie_est", "🍷 Fiesta", "📚 Cultura"],
            ["pas_fut", "🛕 Pasado", "🚀 Futuro"],
            ["azu_roj", "💙 Azul", "❤️ Rojo"]
        ];
    }

    function getClases() {
        return [
            "✊ Peón",
            "🗡️ Soldado",
            "🛡️ Guardián",
            "🦯 Monje",
            "🏹 Tirador",
            "⚒️ Demoledor",
            "🥁 Líder",
            "💎 Mago",
            "💊 Médico"
        ];
    }

    function girarEmoji($texto) {
        $partes = explode(" ", $texto);
        return $partes[1] ." ". $partes[0];
    }

    function textJump($texto) {
        return str_replace(" ", "<br>", $texto);
    }
?>
