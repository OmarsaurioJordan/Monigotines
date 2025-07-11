<?php
    require "../Backend/tool_master.php";

    $escalaMundo = 4; // mundo = lienzo x escala

    $btnPerfil = "window.open('perfil.php?id=$$$', '_blank')";
    if (isset($_SESSION['usr'])) {
        $btnPerfil = str_replace("$$$", $_SESSION['usr'], $btnPerfil);
    }

    // obtener todas las ideologias en formato
    $ideas = getIdeologias();
    $txtIdeas = "";
    for ($i = 0; $i < count($ideas); $i++) {
        $txtIdeas .= girarEmoji($ideas[$i][1]) ." vs ". $ideas[$i][2] ."|";
    }
    $txtIdeas = substr($txtIdeas, 0, -1);
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
        <input type="hidden" id="ideologys" value="<?php echo $txtIdeas; ?>">
        <input type="hidden" id="usuario" value=
            "<?php echo (isset($_SESSION['usr']) ? $_SESSION['usr'] : -1); ?>">
        <div class="cabecera">
            <div>
                <?php if (isset($_SESSION['usr'])) { ?>
                    <button onclick="<?php echo $btnPerfil; ?>"
                        >👤 <?php echo $_SESSION['nombre']; ?></button>
                <?php } else { ?>
                    <button onclick="window.location.href=
                        'login.php'">🔑 Entrar</button>
                <?php } ?>
            </div>
            <label class="camutxt">............</label>
            <h3>Monigotines</h3>
            <label class="camutxt">............</label>
            <div>
                <button onclick="window.open('estadisticas.php', '_blank')"
                    >📊 Info.</button>
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
    </body>
    <script src="../Backend/tool_master.js" defer></script>
    <script src="../Objetos/tools.js" defer></script>
    <script src="../Objetos/Sprites.js" defer></script>
    <script src="../Objetos/Cargador.js" defer></script>
    <script src="../Objetos/Avatar.js" defer></script>
    <script src="../Objetos/Mobiliario.js" defer></script>
    <script src="mundo.js" defer></script>
</html>
