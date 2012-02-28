<?php
session_start();
include("../conectar_bd.php");
$err=0;
function customError($errno, $errstr) {
    global $err;
    if($err==0) {
        echo '{commit:false,razon:"'.utf8_encode($errstr).'"}';
    }
    $err++;
//die('{success:false,razon:"'.$errstr.'"}');
}

set_error_handler("customError");

$query=utf8_decode($_POST['query']);
//$query="update Parametros set falsa='algo'";
$base=$_POST['base'];
//$base=0;
$keyc=$_POST['SMkey'];
//$keyc='ceb1TxbIHL';
$sesion=$_POST['SMses'];
//$sesion=13320;
if(isset ($_SESSION['conexion'])) {
    $conexion=$_SESSION['conexion'];
    if($base==0) {
        $datos=new bd($conexion);
    }else {
        $datos=new bd();
    }

    if($datos->consulta($query)) {
        echo "{commit:true}";
    }
}else {
    echo "{commit:false,razon:'ha caducado la sesion'}";
}
?>