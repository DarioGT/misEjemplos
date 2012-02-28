<?php 
$nemonico=$_POST['nemonico'];
//$nemonico='zmnu';
$aplicacion=$_POST['aplicacion'];
//$aplicacion=20015;
$usuario=$_POST['usuario'];
$tipo=$_POST['tipo'];
require_once '../conectar_bd.php';
$datos=new bd();
$sqlOp="select TIPOOPCION from sg0opciones where idaplicacion='".$aplicacion."' and opcion='".$nemonico."'";
$consulta=$datos->consulta($sqlOp);
if($row=odbc_fetch_array($consulta)) {
    if(strtolower($row['TIPOOPCION'])=='adm')$aplicacion=1;
}

$sql="SELECT DEFAULTQBE FROM dbo.SC0PCLS WHERE idaplicacion=".$aplicacion." and nemonico='".$nemonico."'";
$consulta = $datos->consulta($sql);
if($fil=odbc_fetch_array($consulta)) {
    $defQbe=trim($fil['DEFAULTQBE']);
    if(trim($tipo)=='filtro')$defQbe='0';
    if($defQbe!='*') {
        $sql="SELECT     DATAFIELD, GTYPE, COLTITLE, COLWIDTH, COLNUMBER, FLDLABEL, VRDEFAULT, QBE, QUERYFLD, CAMPOTABLA, CAMPOBASE
FROM         SC1CAMPOSPCL
WHERE     (QBE <> 'NO') AND (IDAPLICACION = '".$aplicacion."') AND (NEMONICO = '".$nemonico."') AND (MAXLEN <> - 1) order by COLNUMBER";
        $i=0;
        $consulta = $datos->consulta($sql);
        while($row = odbc_fetch_array($consulta)) {
            $campos[$i]['qbe']=utf8_encode($row['QBE']);
            $campos[$i]['datafield']=utf8_encode($row['DATAFIELD']);
            $campos[$i]['numero']=$row['COLNUMBER'];
            $campos[$i]['label']=utf8_encode($row['COLTITLE']);
            $campos[$i]['query']=utf8_encode($row['QUERYFLD']);
            $campos[$i]['campoBase']=utf8_encode($row['CAMPOBASE']);
            $campos[$i]['tipo']=utf8_encode($row['GTYPE']);
            $i++;
        }
        if($i==0) { echo "{success: false,razon: 'QBE*' }";}
        else {
            echo "{success:true,campos:".json_encode($campos)."}";
        }
    }else {
        echo "{success: false,razon:'QBE*' }";
    }
}else {
    echo "{success: false,razon: 'NoPcl' }";
}

$datos->close();
?>