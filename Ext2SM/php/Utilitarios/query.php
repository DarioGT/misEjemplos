<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
session_start();
include("../conectar_bd.php");
$query=utf8_decode($_POST['query']);
$base=$_POST['base'];
$keyc=$_POST['SMkey'];
//$keyc='ceb1TxbIHL';
$sesion=$_POST['SMses'];
//$sesion=13320;
if(isset ($_SESSION['conexion'])){
    $conexion=$_SESSION['conexion'];
if($base==0){
    $datos=new bd($conexion);
}else{
    $datos=new bd();
}
//$query="select idparametro from parametros";
$consulta=$datos->consulta($query);
$i=0;
while($row=odbc_fetch_array($consulta)){
    foreach($row as $key=>$value){
        $fila[strtolower(utf8_encode($key))]=utf8_encode($value);
    }
  $response[]=$fila;
  $i++;
}
if($i==0)$response=null;
echo "
{cantidad:".$i.",
filas:".json_encode($response)."}";
}else{
    echo "cantidad:0,razon:'ha caducado la sesion'";
}
?>
