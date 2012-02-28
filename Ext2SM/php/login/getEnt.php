<?php 
$app=$_POST['aplicacion'];
//$app=20015;
require_once '../conectar_bd.php';
$datos=new bd();
$sql="select CodEntorno,Descripcion from sg0entornos where estado='A' and idaplicacion=".$app;
$i=0;
$consulta = $datos->consulta($sql);
while($row = odbc_fetch_array($consulta)){
$ent[$i]['id']=$row['CodEntorno'];
$ent[$i]['ent']=$row['Descripcion'];
$i++;
}
echo json_encode($ent);
$datos->close();
?>