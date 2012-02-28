<?php
$nemonico = $_POST['nemonico'];

//$nemonico='proy';
$aplicacion = $_POST['aplicacion'];

//$aplicacion=20015;
require_once '../conectar_bd.php';
$datos = new bd();
$sqlOp = "select TIPOOPCION from sg0opciones where idaplicacion='" . $aplicacion . "' and opcion='" . $nemonico . "'";
$consulta = $datos -> consulta($sqlOp);
if ($row = odbc_fetch_array($consulta)) {
	if (strtolower($row['TIPOOPCION']) == 'adm')
		$aplicacion = 1;
}

$sql = "select T1.NEMONICO,t1.LNKKEY,t1.LNKTOOLTIP,t1.LNKCAPTION,t1.Secuencia,
t2.FLDFILTER,T2.ALIASWHERE,T2.OPTYPE from SC1LINKR t1,SC2LINKDET t2 where
t1.IDAPLICACION=" . $aplicacion . " and t2.IDAPLICACION=T1.IDAPLICACION
AND T1.NEMONICO=T2.NEMONICO AND T1.LNKKEY=T2.LNKKEY AND T1.NEMONICO='" . $nemonico . "'
order by Secuencia";
$i = 0;

$consulta = $datos -> consulta($sql);
while ($row = odbc_fetch_array($consulta)) {
	$campos[$i]['link'] = $row['LNKKEY'];
	$campos[$i]['caption'] = utf8_encode(ucfirst(strtolower($row['LNKCAPTION'])));
	$campos[$i]['tooltip'] = utf8_encode($row['LNKTOOLTIP']);
	$campos[$i]['secuencia'] = $row['Secuencia'];
	$campos[$i]['campoPadre'] = utf8_encode(strtolower($row['FLDFILTER']));
	$campos[$i]['campoLink'] = utf8_encode(strtolower($row['ALIASWHERE']));
	$campos[$i]['tipo'] = $row['OPTYPE'];
	$i++;
}
if ($i == 0)
	$campos = null;
echo json_encode($campos);
$datos -> close();
?>