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
$aplicacion=$_POST['aplicacion'];
$entorno=$_POST['entorno'];
$nemonico=$_POST['nemonico'];
$keys=utf8_decode($_POST['keys']);
$llave=utf8_decode($_POST['llave']);
$tabla=utf8_decode($_POST['tabla']);
$keyc=$_POST['SMkey'];
//$keyc='ceb1TxbIHL';
$sesion=$_POST['SMses'];
//$sesion=13320;
if(isset ($_SESSION['conexion'])) {
    $conexion=$_SESSION['conexion'];
    $datos=new bd();
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
    $bdApli=new bd($conexion);
    if($num_logs>0) {
        $vecKeys=explode(",",$keys);
        for ($i = 0 ; $i < count($vecKeys) ; $i++) {
            $logRegistro[$i][$llave]['data']='';
            $logRegistro[$i][$llave]['dataOld']=substr($vecKeys[$i],1,strlen($vecKeys[$i])-2);
            foreach ($logs as $campo => $number) {
                $sql="select ".$campo." from ".$tabla." where ".$llave."=".$vecKeys[$i];
                $consulta=$bdApli->consulta($sql);
                if($fila=odbc_fetch_array($consulta)) {
                    $datoAnterior=$fila[$campo];
                    $logRegistro[$i][$campo]['data']='';
                    $logRegistro[$i][$campo]['dataOld']=$datoAnterior;
                }
            }
        }
    }

    $query="delete from ".$tabla." where ".$llave." in(".$keys.")";
   if($bdApli->consulta($query)) {
   
        echo "{commit:true}";

        if($num_logs>0) {
        for ($i = 0 ; $i < count($logRegistro) ; $i++) {
                $sqlLog="INSERT INTO [dbo].[SC9LogCambios]([IdSesion],[Nemonico],[TipoNov],[FechaNov])
                        VALUES(".$_SESSION['idSesion'].",'".$nemonico."','DEL',getDate())
                        select scope_identity() as idlog";
                $consulta=$datos->consulta($sqlLog);
                odbc_next_result($consulta);
                $row=odbc_fetch_array($consulta);
                $idLog=$row['idlog'];
                foreach($logRegistro[$i] as $nombre => $valor) {
                    $sqlLog="INSERT INTO [dbo].[SC9LogDetalle]([IdLog],[Campo],[Data],[DataOld])
                                 VALUES(".$idLog.",'".$nombre."','".$valor['data']."','".$valor['dataOld']."')";
                    $consulta=$datos->consulta($sqlLog);
                 //   echo $sqlLog."     ";
                }
            }
        }
    }
}else {
    echo "{commit:false,razon:'ha caducado la sesion'}";
}
?>