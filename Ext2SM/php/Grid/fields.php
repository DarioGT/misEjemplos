<?php
$nemonico = $_POST['nemonico'];
//$nemonico='PROY';
$tab=$_POST['tab'];
//$tab='BASICAS';
$aplicacion=$_POST['aplicacion'];
$appIni=$aplicacion;
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
FROM  W0Criterios WHERE (IdAplicacion = '".$appIni."') AND (Tcriterio = 'TABS')
 AND (CNombre ='".$tab."') AND (Qname = '".$criterio."') and usuariop='PUBLICO'";
$consulta = $datos->consulta($sql);
$i=0;
if($row = odbc_fetch_array($consulta)){
$tb=explode(";",$row['Criterio']);
foreach ($tb as $valor) {
   $va=explode(":",$valor);
    $sql="SELECT  DATAFIELD,COLTITLE
    FROM  SC1CAMPOSPCL WHERE (IDAPLICACION = '".$aplicacion."') AND
    (NEMONICO = '".$nemonico."') AND COLNUMBER=".trim($va[0]);
    $consulta = $datos->consulta($sql);
    if($row1 = odbc_fetch_array($consulta)){
        $campos[$i]['datafield']=utf8_encode(strtolower($row1['DATAFIELD']));
        $campos[$i]['field']= trim($va[0]);
        $campos[$i]['ancho']=intval($va[1]*.085);
        $i++;;
                }
	}
}
if($i==0){$campos[0]['field']=10000;}
echo json_encode($campos);
$datos->close();
?>
