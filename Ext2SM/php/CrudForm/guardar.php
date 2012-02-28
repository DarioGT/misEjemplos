<?php
session_start();
date_default_timezone_set("America/Bogota");
include("../conectar_bd.php");
$err=0;
function customError($errno, $errstr) {
    global $err;
    if($err==0) {
        echo '{success:false,razon:"'.utf8_encode($errstr).'"}';
    }
    $err++;
//die('{success:false,razon:"'.$errstr.'"}');
}

set_error_handler("customError");
$aplicacion=$_POST['SMAplicacion'];
//$aplicacion=10045;
$usuario=$_POST['SMUsuario'];
//$usuario=1;
$entorno=$_POST['SMEntorno'];
//$entorno='base';
$nemonico=$_POST['SMNemonico'];
//$nemonico='par';
$accion=$_POST['SMAction'];
//$accion=1;
$tabla=$_POST['SMTabla'];
//$tabla='parametros';
$cambios=trim($_POST['SMCambios']);
//$cambios='';
$keyc=$_POST['SMkey'];
//$keyc='ceb1TxbIHL';
$sesion=$_POST['SMses'];
//$sesion=13320;
if(isset ($_SESSION['conexion'])) {
    $conexion=$_SESSION['conexion'];
    $formatoFecha=$_SESSION['formatoFecha'];
    foreach($_POST as $nombre => $valor) {
        if(($nombre!='SMAplicacion') and ($nombre!='SMUsuario') and ($nombre!='SMEntorno') and ($nombre!='SMNemonico') and ($nombre!='SMTabla') and ($nombre!='SMCambios') and ($nombre!='SMkey') and ($nombre!='SMses'))
            $valores[utf8_decode($nombre)]=utf8_decode($valor);
    }
    $bdApli = new bd($conexion);
    $sql="select * from ".$tabla." where 1=2";
    $consulta=$bdApli->consulta($sql);
    for($i = 1; $i <= odbc_num_fields($consulta); ++$i) {
        $camposTabla[$i]= strtolower(odbc_field_name($consulta, $i));
    }
    odbc_free_result($consulta);

    $datos=new bd();
    $sql2="SELECT DATAFIELD, COLNUMBER, DBUPD, DBINS, DBKEY,GTYPE
FROM         SC1CAMPOSPCL
WHERE     (IDAPLICACION = ".$aplicacion.") AND (NEMONICO = '".$nemonico."')";
    $consulta=$datos->consulta($sql2);
    while($row = odbc_fetch_array($consulta)) {
        $permisos[strtolower($row['DATAFIELD'])]['in']=$row['DBINS'];
        $permisos[strtolower($row['DATAFIELD'])]['up']=$row['DBUPD'];
        $permisos[strtolower($row['DATAFIELD'])]['key']=$row['DBKEY'];
        $permisos[strtolower($row['DATAFIELD'])]['tipo']=$row['GTYPE'];
    }

    $sql2="select datafield
        from dbo.SC9LogCriterio
        where identorno=(select identorno from sg0entornos where idaplicacion=".$aplicacion." and codentorno='".$entorno."')
        and nemonico='".$nemonico."'";
    $consulta=$datos->consulta($sql2);
    $num_logs=0;
    while($row = odbc_fetch_array($consulta)) {
        $num_logs++;
        $logs[strtolower($row['datafield'])]=1;
    }
    $bdApli = new bd($conexion);

    if($accion==1) {
        $fields="";
        $values="";
        foreach ($camposTabla as $campo) {
            if($permisos[$campo]['key']==-1){
                $logRegistro[$campo]['data']=$valores[$campo];
                $logRegistro[$campo]['dataOld']='';
            }
            if(($permisos[$campo]['in']==-1) and (trim($valores[$campo])!='')) {
                $valorIns=$valores[$campo];
                if($permisos[$campo]['tipo']=='DAT') {
                    $fecha=explode("/",$valorIns);
                    $formatDate=$fecha[1]."/".$fecha[0]."/".$fecha[2];
                    $valorIns=date($formatoFecha,strtotime($formatDate));
                }
                if(isset ($logs[$campo])) {
                  $logRegistro[$campo]['data']=$valorIns;
                  $logRegistro[$campo]['dataOld']='';
                }
                $fields=$fields.$campo.",";
                $values=$values."'".$valorIns."',";
            }
        }

        $fields=substr($fields, 0, strlen($fields)-1);
        $values=substr($values, 0, strlen($values)-1);
        $sqlInsert="insert into ".$tabla."(".$fields.") values(".$values.")";
        if($bdApli->consulta($sqlInsert)) {
            echo "{success:true}";
            if($num_logs>0) {
                    $sqlLog="INSERT INTO [dbo].[SC9LogCambios]([IdSesion],[Nemonico],[TipoNov],[FechaNov])
                        VALUES(".$_SESSION['idSesion'].",'".$nemonico."','INS',getDate())
                        select scope_identity() as idlog";
                        $consulta=$datos->consulta($sqlLog);
                        odbc_next_result($consulta);
                        $row=odbc_fetch_array($consulta);
                        $idLog=$row['idlog'];
                    foreach($logRegistro as $nombre => $valor) {
                        $sqlLog="INSERT INTO [dbo].[SC9LogDetalle]([IdLog],[Campo],[Data],[DataOld])
                                 VALUES(".$idLog.",'".$nombre."','".$valor['data']."','".$valor['dataOld']."')";
                        $consulta=$datos->consulta($sqlLog);
                    }
                }
        }
    }else {
        if(trim($cambios)=='') {
            echo '{success:true}';
        }else {
            $where='';
            $changedValues=explode(',', $cambios);
            foreach ($permisos as $key=>$value) {
                if($value['key']==-1) {
                    $where=$where.$key."='".$valores[$key]."' and";
                    $logRegistro[$key]['data']=$valores[$key];
                    $logRegistro[$key]['dataOld']=$valores[$key];
                }
            }
            $where=substr($where, 0, strlen($where)-3);
            $values="";
            foreach ($changedValues as $campo) {
                if(in_array($campo, $camposTabla)) {
                    if($permisos[$campo]['up']==-1) {
                        $campo=utf8_decode($campo);
                        $valorUpd=$valores[$campo];
                        
                        if($permisos[$campo]['tipo']=='DAT') {
                            if($valorUpd!='') {
                                $fecha=explode("/",$valorUpd);
                                $formatDate=$fecha[1]."/".$fecha[0]."/".$fecha[2];
                                $valorUpd=date($formatoFecha,strtotime($formatDate));
                            }
                        }
                        if(isset ($logs[$campo])) {
                            $consLog="select ".$campo." from ".$tabla." where ".$where;
                            $consulta=$bdApli->consulta($consLog);
                            $fila=odbc_fetch_array($consulta);
                            $datoAnterior=$fila[$campo];
                            $logRegistro[$campo]['data']=$valorUpd;
                            $logRegistro[$campo]['dataOld']=$datoAnterior;
                        }
                        $values=$values.$campo."='".$valorUpd."',";
                    }
                }
            }
            $values=substr($values, 0, strlen($values)-1);
            $sqlUpd="update ".$tabla." set ".$values." where ".$where;
            if($bdApli->consulta($sqlUpd)) {
                echo "{success:true}";
                if($num_logs>0) {
                    $sqlLog="INSERT INTO [dbo].[SC9LogCambios]([IdSesion],[Nemonico],[TipoNov],[FechaNov])
                        VALUES(".$_SESSION['idSesion'].",'".$nemonico."','UPD',getDate())
                        select scope_identity() as idlog";
                        $consulta=$datos->consulta($sqlLog);
                        odbc_next_result($consulta);
                        $row=odbc_fetch_array($consulta);
                        $idLog=$row['idlog'];
                    foreach($logRegistro as $nombre => $valor) {
                        $sqlLog="INSERT INTO [dbo].[SC9LogDetalle]([IdLog],[Campo],[Data],[DataOld])
                                 VALUES(".$idLog.",'".$nombre."','".$valor['data']."','".$valor['dataOld']."')";
                        $consulta=$datos->consulta($sqlLog);
                    }
                }

            }
        }

    }
}else {
    echo"success:false,razon:'la sesion ha caducado'";
}

//echo $sql3;
?>
