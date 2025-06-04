<?php
    require "../Backend/tool_master.php";
    require "../Backend/tool_db.php";

    $usr = isset($_SESSION['usr']) ? $_SESSION['usr'] : -1;
    $avaId = isset($_GET['id']) ? $_GET['id'] : -1;
    if ($avaId == -1) {
        header("Location:no_perfil.php");
    }

    // obtener datos del avatar
    $sql = "SELECT nombre, genero, piel, emocion, pelo, tinte, torso,
        color, cadera, tela, rol, clase, mensaje, descripcion,
        link, musica FROM avatar WHERE id=?";
    $res = doQuery($sql, [$avaId]);
    $data = [];
    if ($res[0]) {
        $data = $res[1][0];
    }
    else {
        header("Location:no_perfil.php");
    }

    // obtener datos de sus reacciones
    $sql = "SELECT tipo, COUNT(id) AS total, (emisor=?) AS usr
        FROM reaccion WHERE receptor=? GROUP BY tipo";
    $res = doQuery($sql, [$usr, $avaId]);
    $caritas = ["🙂", "😍", "😆", "😮", "😢", "😡"];
    $reacts = [0, 0, 0, 0, 0, 0];
    $tipoUsr = -1;
    if ($res[0]) {
        for ($i = 0; $i < count($res[1]); $i++) {
            $t = $res[1][$i]['tipo'];
            if ($t >= count($reacts)) { continue; }
            $reacts[$t] = $res[1][$i]['total'];
            if ($res[1][$i]['usr'] != 0) {
                $tipoUsr = $t;
            }
        }
    }

    function setCarita($ind) {
        global $caritas, $reacts, $usr, $avaId, $tipoUsr;
        echo "<div>";
        if ($usr != -1 && $usr != $avaId) {
            $t = $tipoUsr == $ind ? " cariselect" : "";
            echo "<a class='carita$t' href='../Backend/reaccionar.php?".
                "usr=$usr&id=$avaId&tipo=$ind'>" .$caritas[$ind]. "</a>";
        }
        else {
            echo "<label>" .$caritas[$ind]. "</label>";
        }
        echo "<label>" .$reacts[$ind]. "</label></div>";
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
            <button onclick="window.open('mundo.php', '_blank')"
                >👁️ Ver Mundo</button>
            <label class="camutxt">............</label>
            <h3>Monigotines</h3>
            <label class="camutxt">............</label>
            <?php if ($usr != -1) {
                if ($usr == $avaId) { ?>
                    <button onclick="btnSalir()">❌ Salir</button>
                <?php } else {
                    echo "<button onclick=\"window.open('perfil.php?id=$usr',
                        '_blank')\">👤 ". $_SESSION['nombre']. "</button>";
            }} else { ?>
                <button onclick="window.location.href=
                    'login.php'">🔑 Entrar</button>
            <?php } ?>
        </div>
        <div class="precaja">
            <!-- campos que contienen toda la info del avatar -->
            <input type="hidden" id="usr" value=
                "<?php echo $usr; ?>">
            <input type="hidden" id="avaId" value=
                "<?php echo $avaId; ?>">
            <input type="hidden" id="nombre" value=
                "<?php echo $data['nombre']; ?>">
            <input type="hidden" id="genero" value=
                "<?php echo $data['genero']; ?>">
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
            <input type="hidden" id="clase" value=
                "<?php echo $data['clase']; ?>">
            <!-- dibujado del avatar y sus opciones de personalizacion -->
            <canvas id="lienzo" width="128" height="192"
                style="border:1px solid black;"></canvas>
            <!-- reacciones y botones para reaccionar -->
            <div class="larguicaja">
                <?php setCarita(0); ?>
                <?php setCarita(1); ?>
                <?php setCarita(2); ?>
                <?php setCarita(3); ?>
                <?php setCarita(4); ?>
                <?php setCarita(5); ?>
            </div>
            <!-- botones para interaccion -->
            <?php if($usr != -1 && $avaId == $usr) { ?>
                <div class="botonera">
                    <button>🎁<br>Más</button>
                    <button>📦<br>Construir</button>
                    <button>💌<br>Cartas</button>
                    <button>🚫<br>Bloqueos</button>
                    <button onclick="window.location.href=
                        'ideology.php'">📝<br>Test</button>
                    <button onclick="window.location.href=
                        'editor.php'">✏️<br>Editar</button>
                </div>
            <?php } else if ($usr != -1) { ?>
                <div class="botonera">
                    <button>🚫<br>Bloquear</button>
                    <button>🎲<br>Desafiar</button>
                    <button>💌<br>Escribir</button>
                </div>
            <?php } ?>
            <!-- en este contenedor se escribiran los textos y el boton submit -->
            <div class="caja">
                <div>
                    <label>🏷️ </label>
                    <label class="myname"><?php echo $data['nombre']; ?></label>
                </div>
                <?php if ($data['mensaje'] != "") { ?>
                    <p class="parrafon"><?php
                        echo $data['mensaje']; ?></p>
                    <?php if ($data['descripcion'] != "") { ?>
                        <label>....................................</label>
                    <?php } ?>
                <?php } if ($data['descripcion'] != "") { ?>
                    <p class="parrafon"><?php
                        echo $data['descripcion']; ?></p>
                <?php } ?>
                <?php if ($data['link'] != "" || $data['musica'] != "") { ?>
                    <div class="cabecera">
                        <?php if ($data['link'] != "") { ?>
                            <a href="<?php echo $data['link']; ?>" target="_blank"
                                >🌐 Link Social</a>
                        <?php } if ($data['link'] != "" && $data['musica'] != "") { ?>
                            <label class="subcamutxt">............</label>
                        <?php } if ($data['musica'] != "") { ?>
                            <a href="<?php echo $data['musica']; ?>" target="_blank"
                                >🎵 Link Musical</a>
                        <?php } ?>
                    </div>
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
