<?php
    require "../Backend/tool_master.php";
    sacarlo();
    require "../Backend/tool_db.php";

    $usr = $_SESSION['usr'];
    
    $sql = "SELECT a.id AS id, a.nombre AS nombre
        FROM avatar a INNER JOIN bloqueo b ON a.id=b.bloqueado
        WHERE b.bloqueador=? AND b.estado=1
        ORDER BY b.actualiza DESC";
    $res = doQuery($sql, [$usr]);
    $data = [];
    if ($res[0]) {
        $data = $res[1];
    }
    else {
        header("Location:perfil.php?id=$usr&msj=error_db");
    }

    $volver = "window.location.href='perfil.php?id=$usr'";
    $avaId = count($data) == 0 ? -1 : $data[0]['id'];

    function listBloqueados() {
        global $data, $usr;
        if (count($data) == 0) {
            echo "<label>🏳️ No hay bloqueados...</label>";
            return null;
        }
        for ($i = 0; $i < count($data); $i++) {
            echo "<div>";
            echo "<button onclick='btnBloquear()'
                >🏳️ Desbloq</button>";
            echo "<label class='subcamutxt'>...</label>";
            echo "<label>" .$data[$i]['nombre']. "</label>";
            echo "</div>";
        }
    }
?>

<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>Monigotines</title>
    </head>
    <body>
        <input type="hidden" id="usr" value=
            "<?php echo $usr; ?>">
        <input type="hidden" id="avaId" value=
            "<?php echo $avaId; ?>">
        <div class="cabecera">
            <button onclick="<?php echo $volver; ?>">👤 Volver</button>
            <label class="camutxt">............</label>
            <h3>Monigotines</h3>
            <label class="camutxt">............</label>
            <label>🚫 Bloqueados</label>
        </div>
        <div class="caja">
            <?php listBloqueados(); ?>
        </div>
    </body>
    <script src="../Backend/tool_master.js" defer></script>
</html>
