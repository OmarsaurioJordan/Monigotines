<?php
    require "../Backend/tool_master.php";

    $escalaMundo = 4; // mundo = lienzo x escala
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
        <input type="hidden" id="escalaMundo" value="<?php echo $escalaMundo; ?>">
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
        <div class="cabecera">
            <input type="radio" id="e_museo" name="estado" value="0" checked>
                <label for="e_museo">🕰️ Museo</label>
                <label class="camutxt">...</label>
            <input type="radio" id="e_war" name="estado" value="2">
                <label for="e_war">💥 Guerra</label>
                <label class="camutxt">...</label>
            <?php if (isset($_SESSION['usr'])) { ?>
                <input type="radio" id="e_explore" name="estado" value="1">
                    <label for="e_explore">🎁 Explore</label>
                    <label class="camutxt">...</label>
                <input type="radio" id="e_social" name="estado" value="3">
                    <label for="e_social">💞 Social</label>
            <?php } ?>
        </div>
		<canvas id="lienzo" width="1000" height="700"
			style="border:1px solid black;"></canvas>
		<label id="output"></label>
    </body>
    <script src="../Backend/tool_master.js" defer></script>
    <script src="../Objetos/tools.js" defer></script>
    <script src="../Objetos/Sprites.js" defer></script>
    <script src="../Objetos/Visible.js" defer></script>
    <script src="../Objetos/Objeto.js" defer></script>
    <script src="../Objetos/Movil.js" defer></script>
    <script src="../Objetos/Avatar.js" defer></script>
    <script src="../Objetos/Npc.js" defer></script>
    <script src="../Objetos/Player.js" defer></script>
    <script src="../Objetos/Otro.js" defer></script>
    <script src="mundo.js" defer></script>
</html>
