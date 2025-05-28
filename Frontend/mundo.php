<?php
    require "../Backend/tool_master.php";
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
            <div>
                <?php if (isset($_SESSION['usr'])) { ?>
                    <button onclick="window.open('editor.php', '_blank')">
                        👤 <?php echo $_SESSION['nombre']; ?>
                    </button>
                <?php } else { ?>
                    <label>👁️ Visitante</label>
                <?php } ?>
            </div>
            <label class="camutxt">............</label>
            <h3>Monigotines</h3>
            <label class="camutxt">............</label>
            <div>
                <?php if (isset($_SESSION['usr'])) { ?>
                    <button onclick="window.location.href=
                        '../Backend/salir.php'">❌ Salir</button>
                <?php } else { ?>
                    <button onclick="window.location.href=
                        'login.php'">👤 Entrar</button>
                <?php } ?>
                <button onclick="activarFullscreen()">📽️ Full</button>
            </div>
        </div>
		<canvas id="lienzo" width="1000" height="700"
			style="border:1px solid black;"></canvas>
		<label id="output"></label>
    </body>
    <script src="../Backend/tool_master.js" defer></script>
    <script src="pantalla.js" defer></script>
</html>
