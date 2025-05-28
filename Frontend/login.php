<?php
    require "../Backend/tool_master.php";
    meterlo();

    $correo = isset($_GET['correo']) ? $_GET['correo'] : "";
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
        <form class="caja" action="../Backend/login.php" method="POST" autocomplete="off">
            <label>👤 Iniciar Sesión</label>
            <input type="mail" name="correo" placeholder="📧 Correo" maxlength="64"
                value="<?php echo $correo; ?>" required>
            <input type="password" name="clave" placeholder="🔒 Contraseña"
                maxlength="128" required>
            <button type="submit">✅ Entrar</button>
        </form>
        <label class="camutxt">......</label>
        <div class="cabecera">
            <button onclick="window.location.href=
                'mundo.php'">👁️ Ver Mundo</button>
            <label class="camutxt">......</label>
            <button onclick="window.location.href=
                'preregistro.php'">📝 Registrarme</button>
        </div>
    </body>
    <script src="../Backend/tool_master.js" defer></script>
</html>
