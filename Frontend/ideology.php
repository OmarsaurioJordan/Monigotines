<?php
    require "../Backend/tool_master.php";
    sacarlo();
    require "../Backend/tool_db.php";

    $sql = "SELECT nacimiento, zodiaco, elemento,
        ang_dem, izq_der, pol_lad, rel_cie, mon_pol, car_veg,
        ext_int, azu_roj, pas_fut, urb_cam, art_ing, fie_est
        FROM ideologia WHERE avatar=?";
    $res = doQuery($sql, [$_SESSION['usr']]);
    $data = [];
    if ($res[0]) {
        $data = $res[1][0];
    }
    else {
        header("Location:postedicion.php?msjok=0");
    }

    function zodiacos() {
        global $data;
        echo "<select name='zodiaco'>";
        $zod = getZodiaco();
        for ($i = 1; $i <= 12; $i++) {
            $p = $data['zodiaco'] == $i ? " selected" : "";
            echo "<option value='$i'$p>" .$zod[$i - 1]. "</option>";
        }
        echo "</select>";
    }

    function elementos() {
        global $data;
        echo "<select name='elemento'>";
        $elem = getElementos();
        for ($i = 1; $i <= 4; $i++) {
            $p = $data['elemento'] == $i ? " selected" : "";
            echo "<option value='$i'$p>" .$elem[$i - 1]. "</option>";
        }
        echo "</select>";
    }

    function dualidad($ideas) {
        // $ideas: ["nombre", "cosa1", "cosa2"]
        global $data;
        $duali = [$ideas[1], $ideas[2]];
        $refName = $ideas[0];
        $turn = random_int(0, 1) == 0;
        echo "<div>";
        if ($turn) {
            echo "<label>". girarEmoji($duali[0]). "</label>";
            $p = $data[$refName] == -1 ? " checked" : "";
            echo "<input type='radio' name='$refName' value='-1'$p>";
        }
        else {
            echo "<label>". girarEmoji($duali[1]). "</label>";
            $p = $data[$refName] == 1 ? " checked" : "";
            echo "<input type='radio' name='$refName' value='1'$p>";
        }
        echo "<label>-</label>";
        $p = $data[$refName] == 0 ? " checked" : "";
        echo "<input type='radio' name='$refName' value='0'$p>";
        echo "<label>-</label>";
        if ($turn) {
            $p = $data[$refName] == 1 ? " checked" : "";
            echo "<input type='radio' name='$refName' value='1'$p>";
            echo "<label>". $duali[1]. "</label>";
        }
        else {
            $p = $data[$refName] == -1 ? " checked" : "";
            echo "<input type='radio' name='$refName' value='-1'$p>";
            echo "<label>". $duali[0]. "</label>";
        }
        echo "</div>";
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
        <div class="cabecera">
            <button onclick="btnCancelar()">❌ Cancelar</button>
            <label class="camutxt">............</label>
            <h3>Monigotines</h3>
            <label class="camutxt">............</label>
            <label>✏️ Ideologías</label>
        </div>
        <form class="caja" action="../Backend/ideology.php" method="POST" autocomplete="off">
            <input type="hidden" name="usr" id="usr" value=
                "<?php echo $_SESSION['usr']; ?>">
            <div>
                <label>🏷️ </label>
                <label class="myname"><?php echo $_SESSION['nombre']; ?></label>
            </div>
            <div>
                <label>📅 Año Nace </label>
                <input type="number" name="nacimiento" min="1900"
                    max="<?php echo date("Y") - 1; ?>"
                    step="1" value="<?php echo ($data['nacimiento'] == 0 ?
                    "" : $data['nacimiento']); ?>" required>
            </div>
            <?php
                zodiacos();
                elementos();
                $ideas = getIdeologias();
                shuffle($ideas);
                for ($i = 0; $i < count($ideas); $i++) {
                    dualidad($ideas[$i]);
                }
            ?>
            <button type="submit">💾 Guardar</button>
        </form>
    </body>
    <script src="../Backend/tool_master.js" defer></script>
</html>
