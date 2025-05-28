<?php
    require "../Backend/tool_master.php";
    sacarlo();
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
            <input type="hidden" name="piel" id="piel" value="0">
            <input type="hidden" name="emocion" id="emocion" value="0">
            <input type="hidden" name="pelo" id="pelo" value="0">
            <input type="hidden" name="tinte" id="tinte" value="0">
            <input type="hidden" name="torso" id="torso" value="0">
            <input type="hidden" name="color" id="color" value="0">
            <input type="hidden" name="cadera" id="cadera" value="0">
            <input type="hidden" name="tela" id="tela" value="0">
            <input type="hidden" name="rol" id="rol" value="0">
            <canvas id="lienzo" width="256" height="192"
                style="border:1px solid black;"></canvas>
            <div class="caja">
                <textarea name="mensaje" rows="4" cols="40"
                    placeholder="💬 Mensaje (opcional)" maxlength="200"></textarea>
                <textarea name="descripcion" rows="10" cols="40"
                    placeholder="📙 Descripción (opcional)" maxlength="600"></textarea>
                <input type="url" name="link" placeholder="🌐 Link (opcional)"
                    maxlength="128">
                <button type="submit">💾 Guardar</button>
            </div>
        </form>
		<label id="output"></label>
    </body>
    <script src="../Backend/tool_master.js" defer></script>
    <script src="editor.js" defer></script>
</html>
