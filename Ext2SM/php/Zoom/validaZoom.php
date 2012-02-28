<?php
session_start();
$nemonico = $_POST['nemonico'];
//$nemonico='CTDOC';
$filtro=utf8_decode($_POST['filtro']);
//$filtro="idmovc=119455";
$aplicacion=$_POST['aplicacion'];
//$aplicacion=10;
$found="false";
include("../conectar_bd.php");
$datos = new bd();
$keyc=$_POST['SMkey'];
//$keyc='ceb1TxbIHL';
$sesion=$_POST['SMses'];
//$sesion=13320;
if(isset ($_SESSION['conexion'])) {
    $conexion=$_SESSION['conexion'];
    $sqlOp="select tipoopcion from sg0opciones where idaplicacion='".$aplicacion."' and opcion='".$nemonico."'";
    $consulta=$datos->consulta($sqlOp);
    if($row=odbc_fetch_array($consulta)) {
        if(strtolower($row['tipoopcion'])=='adm')$aplicacion=1;
    }

    $sql = "select DATAFIELD,GTYPE from SC1CAMPOSPCL  where idaplicacion = ".$aplicacion." and nemonico='".$nemonico."'";
    $consulta = $datos->consulta($sql);
    while($row = odbc_fetch_array($consulta)) {
    // print_r($row);
        $name['name'] = $row['DATAFIELD'];
        if($row['GTYPE']=='NUM') {$name['type']='float';}
        else {if($row['GTYPE']=='DAT') {
                $name['type']='date';
                $name['dateFormat']='d/m/Y';
            }else {$name['type']='string';}
        }
        $vector[] = $name;
    }

    $sql="select convert(text, SQLSTMT)  as  SQLSTMT from sc0pcls where idaplicacion = ".$aplicacion." and nemonico = '$nemonico'";
    $consulta = $datos->consulta($sql);
    $row=odbc_fetch_array($consulta);
    $sql2=$row['SQLSTMT'];
    $datos->close();
    if($aplicacion==1) {
        $planos=new bd();
    }else {
        $planos = new bd($conexion);
    }

    if($filtro!='') {
        if(strpos($sql2, " where ") or strpos($sql2, " WHERE ")) {
            $sql2=$sql2." and ".$filtro;
        }else {
            $sql2=$sql2." where ".$filtro;
        }
        $filtro='';
    }

    if($filtro=='') {$where='';}else {$where="where ".$filtro;}
    $sql2="select * from (".$sql2.") as t ".$where;
    $consulta2 = $planos->consulta($sql2);
    //$contenido=null;

    while($row1 = odbc_fetch_array($consulta2)) {
        $row1=array_change_key_case($row1);
        $found="true";
        foreach( $vector as $key => $value ) {
            $val=strtolower($value['name']);
            $utfVal=strtolower(utf8_encode($value['name']));
            if($value['type']=='date') {
                if(trim($row1[$val])!="") {
                    $contenido[$utfVal] = date("d/m/Y",strtotime($row1[$val]));
                }else {
                    $contenido[$utfVal] = $row1[$val];}

                    }
            else {
                $contenido[$utfVal] = utf8_encode($row1[$val]); // busca el valor para llenar las
            // filas del Store
            }
        }
        $registros[]=$contenido;
    }
    if(!isset($registros)){
        $contenido=null;
        $registros=null;
    }else{
        $contenido=$registros[0];
    }
    $planos->close();
    echo "{found:".$found.",registro:".json_encode($contenido).",
    total:".count($registros).",registros:".json_encode($registros)."}";
}else {
    echo "{found:false,razon:'ha caducado la sesion'}";
}
?>