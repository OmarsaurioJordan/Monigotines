<?php
    require "../Backend/tool_master.php";
    meterlo();

    $correo = isset($_GET['correo']) ? $_GET['correo'] : "";
    $nombre = isset($_GET['nombre']) ? $_GET['nombre'] : "";
    $mailc = isset($_GET['mailc']) ? $_GET['mailc'] : "";
    $genero = isset($_GET['genero']) ? $_GET['genero'] : "";
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
        <form class="caja" action="../Backend/registro.php" method="POST" autocomplete="off">
            <label>📝 Registro</label>
            <input type="mail" name="correo" placeholder="📧 Correo" maxlength="64"
                value="<?php echo $correo; ?>" required>
            <input type="text" name="nombre" placeholder="🏷️ Nombre" maxlength="24"
                value="<?php echo $nombre; ?>" required>
            <input type="password" name="clave" placeholder="🔒 Contraseña"
                maxlength="128" minlength="6" required>
            <input type="text" name="mailc" placeholder="💳 Clave Pre-Registro"
                value="<?php echo $mailc; ?>" maxlength="12" required>
            <div>
                <input type="radio" id="fem" name="genero" value="0"
                    <?php echo $genero == 0 ? "selected" : ""; ?> required>
                <label for="fem">Femenino</label>
                <input type="radio" id="mas" name="genero" value="1"
                    <?php echo $genero == 1 ? "selected" : ""; ?> required>
                <label for="mas">Masculino</label>
            </div>
            <button type="submit">✅ Registrarme</button>
        </form>
        <label class="camutxt">......</label>
        <div class="cabecera">
            <button onclick="window.location.href=
                'login.php'">👤 Tengo Cuenta</button>
            <label class="camutxt">...</label>
            <button onclick="window.location.href=
                'preregistro.php'">💳 Nueva Clave</button>
        </div>
    </body>
    <script src="../Backend/tool_master.js" defer></script>
</html>
