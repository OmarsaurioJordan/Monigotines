<?php
    require "../Backend/tool_master.php";
    sacarlo();
    require "../Backend/tool_db.php";

    $sql = "SELECT piel, emocion, pelo, tinte, torso,
        color, cadera, tela, rol, mensaje, descripcion,
        link FROM avatar WHERE id=?";
    $res = doQuery($sql, [$_SESSION['usr']]);
    $data = [];
    if ($res[0]) {
        $data = $res[1][0];
    }
    else {
        header("Location:postedicion.php?msjok=0");
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
            <label>✏️ Editar Avatar</label>
        </div>
        <form class="precaja" action="../Backend/editor.php" method="POST" autocomplete="off">
            <!-- campos que contienen toda la info del avatar -->
            <input type="hidden" name="usr" id="usr" value=
                "<?php echo $_SESSION['usr']; ?>">
            <input type="hidden" name="nombre" id="nombre" value=
                "<?php echo $_SESSION['nombre']; ?>">
            <input type="hidden" name="genero" id="genero" value=
                "<?php echo $_SESSION['genero']; ?>">
            <input type="hidden" name="piel" id="piel" value=
                "<?php echo $data['piel']; ?>">
            <input type="hidden" name="emocion" id="emocion" value=
                "<?php echo $data['emocion']; ?>">
            <input type="hidden" name="pelo" id="pelo" value=
                "<?php echo $data['pelo']; ?>">
            <input type="hidden" name="tinte" id="tinte" value=
                "<?php echo $data['tinte']; ?>">
            <input type="hidden" name="torso" id="torso" value=
                "<?php echo $data['torso']; ?>">
            <input type="hidden" name="color" id="color" value=
                "<?php echo $data['color']; ?>">
            <input type="hidden" name="cadera" id="cadera" value=
                "<?php echo $data['cadera']; ?>">
            <input type="hidden" name="tela" id="tela" value=
                "<?php echo $data['tela']; ?>">
            <input type="hidden" name="rol" id="rol" value=
                "<?php echo $data['rol']; ?>">
            <!-- dibujado del avatar y sus opciones de personalizacion -->
            <canvas id="lienzo" width="240" height="192"
                style="border:1px solid black;"></canvas>
            <!-- en este contenedor se escribiran los textos y el boton submit -->
            <div class="caja">
                <div>
                    <label>🏷️ </label>
                    <label class="myname"><?php echo $_SESSION['nombre']; ?></label>
                </div>
                <textarea name="mensaje" rows="4" cols="40"
                    placeholder="💬 Mensaje (opcional)" maxlength="200"><?php
                     echo $data['mensaje']; ?></textarea>
                <textarea name="descripcion" rows="10" cols="40"
                    placeholder="📙 Descripción (opcional)" maxlength="600"><?php
                    echo $data['descripcion']; ?></textarea>
                <input type="url" name="link" placeholder="🌐 Link (opcional)"
                    maxlength="128" value="<?php echo $data['link']; ?>">
                <button type="submit">💾 Guardar</button>
            </div>
        </form>
    </body>
    <script src="../Backend/tool_master.js" defer></script>
    <script src="../Objetos/tools.js" defer></script>
    <script src="../Objetos/Sprites.js" defer></script>
    <script src="../Objetos/Avatar.js" defer></script>
    <script src="editor.js" defer></script>
</html>
