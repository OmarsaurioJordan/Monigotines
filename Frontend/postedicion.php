<?php
    require "../Backend/tool_master.php";
    sacarlo();

    $msjok = isset($_GET['msjok']) ? $_GET['msjok'] : "0";

    $btnPerfil = "window.location.href='perfil.php?id=". $_SESSION['usr']. "'";
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
        <h3>Monigotines</h3>
        <label class="camutxt">......</label>
        <?php if ($msjok == "1") { ?>
            <p class="parrafin">
                ✅ Los cambios en tu avatar han sido efectuados, puedes 
                regresar a la página del mundo donde verás todos los 
                avatares, recuerda que el sistema puede tardar un poco en 
                mostrar tu avatar actualizado
            </p>
        <?php } else { ?>
            <p class="parrafin">
                ⛔ Ha habido fallos conectando con la base de datos, 
                obteniendo o guardando la información del avatar
            </p>
        <?php } ?>
        <div class="cabecera">
            <button onclick="window.location.href=
                'mundo.php'">👁️ Ver Mundo</button>
            <label class="camutxt">...</label>
            <button onclick="<?php echo $btnPerfil; ?>">👤 Ver Perfil</button>
        </div>
    </body>
    <script src="../Backend/tool_master.js" defer></script>
</html>
