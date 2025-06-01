<?php
    require "tool_db.php";

    // atributos: "id,nombre,genero"
    $limite = isset($_GET['limite']) ? $_GET['limite'] : "30";
    $tabla = isset($_GET['tabla']) ? $_GET['tabla'] : "";
    $atributos = isset($_GET['atributos']) ? $_GET['atributos'] : "";
    $cursor = isset($_GET['cursor']) ? $_GET['cursor'] :
        "CURRENT_TIMESTAMP";
    $freno = isset($_GET['freno']) ? $_GET['freno'] :
        "'2010-01-01 00:00:00'";

    if ($tabla != "" && $atributos != "") {
        $sql = "SELECT actualiza,$atributos FROM $tabla
            WHERE actualiza < $cursor AND actualiza > $freno
            ORDER BY actualiza DESC
            LIMIT $limite";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute();

        echo json_encode($stmt -> fetchAll(PDO::FETCH_ASSOC));
    }
?>
