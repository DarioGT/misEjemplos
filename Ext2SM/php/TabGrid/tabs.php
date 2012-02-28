<?php
$nemonico = $_POST['nemonico'];
//$nemonico='REQ';
$aplicacion=$_POST['aplicacion'];
//$aplicacion=20015;
$criterio=$_POST['criterio'];
//$aplicacion=20015;
require_once '../conectar_bd.php';
 $datos=new bd();
 $sqlOp="select TIPOOPCION from sg0opciones where idaplicacion='".$aplicacion."' and opcion='".$nemonico."'";
$consulta=$datos->consulta($sqlOp);
if($row=odbc_fetch_array($consulta)){
    if(strtolower($row['TIPOOPCION'])=='adm')$aplicacion=1;
}
 $sql="SELECT     Criterio
FROM         W0Criterios
WHERE     (IdAplicacion = '".$aplicacion."') AND (Qname = '".$criterio."')
AND (Tcriterio = 'TABS') AND (CNombre = 'TABCNF') and usuariop='publico'";
$consulta = $datos->consulta($sql);
if($row = odbc_fetch_array($consulta)){
$tb=explode(";",$row['Criterio']);
$i=0;
foreach ($tb as $valor) {
    $tabs[$i]['tab']= utf8_encode(ucfirst(strtolower(trim($valor))));
   $i++;
	} 
	
}else{
	$tabs[0]['tab']= "Basicas";
	}
echo json_encode($tabs);
$datos->close();
?>