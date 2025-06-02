<?php
    $host = 'localhost';
    $user = 'root';
    $password = '';
    $dbname = 'monigotines';
    $claveMd5 = "unaCADENAsssekreta906090"; // algo random
    // nota: claveMd5 si es cambiada, todas las password de la DB quedan obsoletas

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
        $pdo -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch (PDOException $e) {
        die("Error de conexión: ". $e -> getMessage());
    }

    function doQuery($sql="", $values=[]) {
        // doQuery("SELECT id FROM gente WHERE nombre=? AND edad=?", [$nombre, $edad]);
        // return ante SELECT [exito, data[matrix_fetch_asoc] o []]
        // return ante UP, INS, DEL [exito, [num_row_afect]]
        global $pdo;
        $stmt = $pdo -> prepare($sql);
        try {
            if ($stmt -> execute($values)) {
                $tipo = strtoupper(strtok(trim($sql), " "));
                if ($tipo == "SELECT") {
                    return [true, $stmt -> fetchAll(PDO::FETCH_ASSOC)];
                }
                else {
                    return [true, [$stmt -> rowCount()]];
                }
            }
            else {
                return [false, []];
            }
        }
        catch (PDOException $e) {
            return [false, []];
        }
    }

    function getList($tabla) {
        $res = doQuery("SELECT nombre FROM $tabla");
        if ($res[0]) {
            $list = [];
            for ($i = 0; $i < count($res[1]); $i++) {
                $list[] = $res[1][$i]['nombre'];
            }
            return $list;
        }
        return [];
    }

    function setClave($clave) {
        global $claveMd5;
        return md5($clave. $claveMd5);
    }

    function newClave($tot=6) {
        $msk = "ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234567890";
        $clave = "";
        for ($i = 0; $i < $tot; $i++) {
            $clave .= $msk[random_int(0, strlen($msk) - 1)];
        }
        return $clave;
    }

    function okTexto($texto, $mascara) {
        $res = "";
        for ($i = 0; $i < mb_strlen($texto); $i++) {
            $c = mb_substr($texto, $i, 1);
            if (mb_strpos($mascara, $c) !== false) {
                $res .= $c;
            }
        }
        return $res;
    }

    function okNombre($nombre) {
        $msk = "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ".
            "0123456789áéíóúÁÉÍÓÚ";
        return okTexto($nombre, $msk);
    }

    function okMensaje($mensaje) {
        $msk = "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ".
            "0123456789áéíóúÁÉÍÓÚ _\n.:,;<>{}[]^+-*/~'\"¿?¡!\\=()&%$#|°";
        return okTexto($mensaje, $msk);
    }
?>
