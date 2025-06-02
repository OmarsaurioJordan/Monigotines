<?php
    require "../Backend/tool_master.php";
    require "../Backend/tool_db.php";

    $usr = isset($_SESSION['usr']) ? $_SESSION['usr'] : -1;
    $avaId = isset($_GET['id']) ? $_GET['id'] : -1;
    if ($avaId == -1) {
        header("Location:no_perfil.php");
    }

    $sql = "SELECT nombre, piel, emocion, pelo, tinte, torso,
        color, cadera, tela, rol, mensaje, descripcion,
        link FROM avatar WHERE id=?";
    $res = doQuery($sql, [$avaId]);
    $data = [];
    if ($res[0]) {
        $data = $res[1][0];
    }
    else {
        header("Location:no_perfil.php");
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
            <button onclick="btnVolver()">👁️ Ver Mundo</button>
            <label class="camutxt">............</label>
            <h3>Monigotines</h3>
            <label class="camutxt">............</label>
            <label>📋 Perfil Avatar</label>
        </div>
        <div class="precaja">
            <!-- campos que contienen toda la info del avatar -->
            <input type="hidden" id="usr" value="<?php echo $usr; ?>">
            <input type="hidden" id="avaId" value="<?php $avaId; ?>">
            <input type="hidden" id="nombre" value=
                "<?php echo $_SESSION['nombre']; ?>">
            <input type="hidden" id="genero" value=
                "<?php echo $_SESSION['genero']; ?>">
            <input type="hidden" id="piel" value=
                "<?php echo $data['piel']; ?>">
            <input type="hidden" id="emocion" value=
                "<?php echo $data['emocion']; ?>">
            <input type="hidden" id="pelo" value=
                "<?php echo $data['pelo']; ?>">
            <input type="hidden" id="tinte" value=
                "<?php echo $data['tinte']; ?>">
            <input type="hidden" id="torso" value=
                "<?php echo $data['torso']; ?>">
            <input type="hidden" id="color" value=
                "<?php echo $data['color']; ?>">
            <input type="hidden" id="cadera" value=
                "<?php echo $data['cadera']; ?>">
            <input type="hidden" id="tela" value=
                "<?php echo $data['tela']; ?>">
            <input type="hidden" id="rol" value=
                "<?php echo $data['rol']; ?>">
            <!-- dibujado del avatar y sus opciones de personalizacion -->
            <canvas id="lienzo" width="128" height="192"
                style="border:1px solid black;"></canvas>
            <!-- en este contenedor se escribiran los textos y el boton submit -->
            <div class="caja">
                <div>
                    <label>🏷️ </label>
                    <label class="myname"><?php echo $data['nombre']; ?></label>
                </div>
                <?php if ($data['mensaje'] != "") { ?>
                    <textarea rows="4" cols="40" readonly><?php
                        echo $data['mensaje']; ?></textarea>
                <?php } if ($data['descripcion'] != "") { ?>
                    <textarea rows="10" cols="40" readonly><?php
                        echo $data['descripcion']; ?></textarea>
                <?php } if ($data['link'] != "") { ?>
                    <a href="<?php echo $data['link']; ?>">🌐 Abrir Link</a>
                <?php } ?>
            </div>
        </div>
    </body>
    <script src="../Backend/tool_master.js" defer></script>
    <script src="../Objetos/tools.js" defer></script>
    <script src="../Objetos/Sprites.js" defer></script>
    <script src="../Objetos/Avatar.js" defer></script>
    <script src="perfil.js" defer></script>
</html>
