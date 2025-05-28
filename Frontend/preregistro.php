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
        <form class="caja" action="../Backend/preregistro.php" method="POST" autocomplete="off">
            <label>📝 Pre-Registro</label>
            <input type="mail" name="correo" placeholder="📧 Correo" maxlength="64"
                value="<?php echo $correo; ?>" required>
            <button type="submit">✅ Obtener Clave</button>
        </form>
        <label class="camutxt">......</label>
        <div class="cabecera">
            <button onclick="window.location.href=
                'login.php'">👤 Tengo Cuenta</button>
            <label class="camutxt">...</label>
            <button onclick="window.location.href=
                'registro.php'">💳 Tengo Clave</button>
        </div>
        <p class="parrafin">
            Recibirá en su correo una clave para registrarse en el sistema,
            esto también sirve para recuperar su contraseña, tenga en cuenta
            que la clave solo sirve durante 1 hora
        </p>
    </body>
    <script src="../Backend/tool_master.js" defer></script>
</html>
