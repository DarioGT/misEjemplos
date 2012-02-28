<?php 
$usuario=$_POST['usuario'];
//$usuario='dario';
require_once '../conectar_bd.php';
$datos=new bd();
$sql="select * from dbo.ListAplic('".$usuario."',1)";
$i=0;
$consulta = $datos->consulta($sql);
while($row = odbc_fetch_array($consulta)){
$app[$i]['id']=$row['idaplicacion'];
$app[$i]['app']=$row['Aplicacion'];
$i++;
}
echo json_encode($app);
$datos->close();
?>