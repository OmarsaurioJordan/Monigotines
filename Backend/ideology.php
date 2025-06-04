<?php
    require "tool_master.php";
    sacarlo();
    require "tool_db.php";

    $usr = $_POST['usr'];
    $nacimiento = $_POST['nacimiento'];
    $zodiaco = $_POST['zodiaco'];
    $elemento = $_POST['elemento'];
    $ang_dem = $_POST['ang_dem'];
    $izq_der = $_POST['izq_der'];
    $pol_lad = $_POST['pol_lad'];
    $rel_cie = $_POST['rel_cie'];
    $mon_pol = $_POST['mon_pol'];
    $car_veg = $_POST['car_veg'];
    $ext_int = $_POST['ext_int'];
    $azu_roj = $_POST['azu_roj'];
    $pas_fut = $_POST['pas_fut'];
    $urb_cam = $_POST['urb_cam'];
    $art_ing = $_POST['art_ing'];
    $fie_est = $_POST['fie_est'];

    if ($usr != $_SESSION['usr']) {
        header("Location:../Frontend/ideology.php");
    }

    $sql = "UPDATE ideologia SET nacimiento=?, zodiaco=?, elemento=?,
        ang_dem=?, izq_der=?, pol_lad=?, rel_cie=?, mon_pol=?, car_veg=?,
        ext_int=?, azu_roj=?, pas_fut=?, urb_cam=?, art_ing=?, fie_est=?
        WHERE avatar=?";
    $res = doQuery($sql, [$nacimiento, $zodiaco, $elemento,
        $ang_dem, $izq_der, $pol_lad, $rel_cie, $mon_pol, $car_veg,
        $ext_int, $azu_roj, $pas_fut, $urb_cam, $art_ing, $fie_est, $usr]);
    if ($res[0]) {
        header("Location:../Frontend/postedicion.php?msjok=1");
    }
    else {
        header("Location:../Frontend/ideology.php?msj=error_db");
    }
?>
