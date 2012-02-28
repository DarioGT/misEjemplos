<?php
session_start();
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

if(isset ($_SESSION['conexion'])) {
    $conexion=$_SESSION['conexion'];
    include("../conectar_bd.php");
    $datos=new bd();
    $encabezado=json_decode($_POST['encabezado']);
    $detalle=json_decode($_POST['detalle']);
    $aplicacion=$_POST['aplicacion'];
    $nemonico=$_POST['nemonico'];
    $tipoDocumento=utf8_decode($_POST['fuente']);
    $periodoDocumento=utf8_decode($_POST['periodo']);
    $formatoFecha=$_SESSION['formatoFecha'];
    foreach ($encabezado as $key=>$value) {
        $datosEncabezado[utf8_decode($key)]=utf8_decode($value);
    }
    for ($i = 0 ; $i < count($detalle) ; $i++) {
        foreach ($detalle[$i] as $key=>$value) {
            $dato[utf8_decode($key)]=utf8_decode($value);
        }
        $datosDetalle[]=$dato;
    }

    $sql="select propiedad,valorb,valorh from
    dbo.SC1DocAutos where nemonico='".$nemonico."' and idaplicacion=".$aplicacion;
    $consulta=$datos->consulta($sql);
    while($row = odbc_fetch_array($consulta)) {
        $i++;
        $propiedad=strtoupper($row['propiedad']);
        switch ($propiedad) {
            case "PCL_C":
                $encabezado=$row['valorb'];
                break;
            case "PCL_M":
                $detalle=$row['valorb'];
                break;
            case "TBLMOVC":
                $tablaEnc=$row['valorb'];
                break;
            case "INCREMENTO":
                $tipoIncremento=$row['valorb'];
                break;
            case "CAMPOESTADO":
                $campoEstado=$row['valorb'];
                break;
            case "ESTADOINICIAL":
                $estadoInicial=$row['valorb'];
                break;
            case "CAMPONUMERO":
                $campoNumero=$row['valorb'];
                break;
            case "CAMPOTIPO";
                $campoTipo=$row['valorb'];
                break;
            case "CAMPOIDENTIDAD";
                $campoIdentidad=$row['valorb'];
                break;
            case "FORANEA";
                $llaveForanea=$row['valorb'];
                break;
        }
    }

    if(!isset ($tipoIncremento))$tipoIncremento='IDENTIDAD';
    if(!isset ($campoEstado))$campoEstado='ESTADO';
    if(!isset ($campoNumero))$campoNumero='NUMDOCU';
    if(!isset ($campoTipo))$campoTipo='TIPDOCU';
    if(!isset ($llaveForanea))$llaveForanea=$campoIdentidad;

    if(!isset ($campoIdentidad) or !isset ($estadoInicial)) {
        echo "{success:false,razon:'datos del objeto incompletos'}";
    }else {
        $bdApli = new bd($conexion);
        $sql="select * from ".$tablaEnc." where 1=2";
        $consulta=$bdApli->consulta($sql);
        for($i = 1; $i <= odbc_num_fields($consulta); ++$i) {
            $camposTabla[$i]= strtolower(odbc_field_name($consulta, $i));
        }
        odbc_free_result($consulta);

        $sql2="SELECT DATAFIELD, COLNUMBER, DBUPD, DBINS, DBKEY,GTYPE
FROM         SC1CAMPOSPCL
WHERE     (IDAPLICACION = ".$aplicacion.") AND (NEMONICO = '".$encabezado."')";
        $consulta=$datos->consulta($sql2);
        while($row = odbc_fetch_array($consulta)) {
            $permisos[strtolower($row['DATAFIELD'])]['in']=$row['DBINS'];
            $permisos[strtolower($row['DATAFIELD'])]['up']=$row['DBUPD'];
            $permisos[strtolower($row['DATAFIELD'])]['key']=$row['DBKEY'];
            $permisos[strtolower($row['DATAFIELD'])]['tipo']=$row['GTYPE'];
        }

        $sql="select tablabase from sc0pcls where idaplicacion=".$aplicacion." and nemonico='".$detalle."'";
        $consulta=$datos->consulta($sql);
        $row=odbc_fetch_array($consulta);
        $tablaDetalle=$row['tablabase'];


        $sql="select * from ".$tablaDetalle." where 1=2";
        $consulta=$bdApli->consulta($sql);
        for($i = 1; $i <= odbc_num_fields($consulta); ++$i) {
            $camposTablaDetalle[$i]= strtolower(odbc_field_name($consulta, $i));
        }
        odbc_free_result($consulta);

        $sql2="SELECT DATAFIELD, COLNUMBER, DBUPD, DBINS, DBKEY,GTYPE
FROM         SC1CAMPOSPCL
WHERE     (IDAPLICACION = ".$aplicacion.") AND (NEMONICO = '".$detalle."')";
        $consulta=$datos->consulta($sql2);
        while($row = odbc_fetch_array($consulta)) {
            $permisosDetalle[strtolower($row['DATAFIELD'])]['in']=$row['DBINS'];
            $permisosDetalle[strtolower($row['DATAFIELD'])]['up']=$row['DBUPD'];
            $permisosDetalle[strtolower($row['DATAFIELD'])]['key']=$row['DBKEY'];
            $permisosDetalle[strtolower($row['DATAFIELD'])]['tipo']=$row['GTYPE'];
        }


        if($_POST['accion']=='add') {
            if($tipoIncremento='PERIODO') {
                $sql="select isnull(max(".$campoNumero.")+1,1) as numero from c1movc
                where ".$campoTipo."='$tipoDocumento'";
            }else {
                $sql="select isnull(max(".$campoNumero.")+1,1) as numero from c1movc
                where ".$campoTipo."='$tipoDocumento' and periodo='$periodoDocumento'";
            }
            $consulta=$bdApli->consulta($sql);
            $row=odbc_fetch_array($consulta);
            $numeroDoc=$row['numero'];

            $fields="$campoTipo,$campoNumero,periodo,$campoEstado,";
            $values="'$tipoDocumento',$numeroDoc,'$periodoDocumento','$estadoInicial',";
            foreach ($camposTabla as $campo) {
                if(($permisos[$campo]['in']==-1) and (trim($datosEncabezado[$campo])!='')) {
                    $valorIns=$datosEncabezado[$campo];
                    if($permisos[$campo]['tipo']=='DAT') {
                        $valorIns=date($formatoFecha,strtotime($valorIns));
                    }
                    $fields=$fields.$campo.",";
                    $values=$values."'".$valorIns."',";
                }
            }

            $fields=substr($fields, 0, strlen($fields)-1);
            $values=substr($values, 0, strlen($values)-1);
            $sqlInsert="insert into ".$tablaEnc."(".$fields.") values(".$values.")
                        select scope_identity() as idDoc";
            //echo $sqlInsert;
            $consulta=$bdApli->consulta($sqlInsert);
            if($consulta) {
                odbc_next_result($consulta);
                $row=odbc_fetch_array($consulta);
                $idDoc=$row['idDoc'];
                echo "{success:true,numero:$numeroDoc,id:$idDoc}";
                foreach ($datosDetalle as $fila) {
                    $fields="$campoTipo,$campoNumero,$llaveForanea,";
                    $values="'$tipoDocumento',$numeroDoc,$idDoc,";
                    foreach ($camposTablaDetalle as $campo) {
                        if(isset ($fila[$campo])) {
                            if(($permisosDetalle[$campo]['in']==-1) and (trim($fila[$campo])!='')) {
                                $valorIns=$fila[$campo];
                                if($permisos[$campo]['tipo']=='DAT') {
                                    $valorIns=date($formatoFecha,strtotime($valorIns));
                                }
                                $fields=$fields.$campo.",";
                                $values=$values."'".$valorIns."',";
                            }
                        }
                    }

                    $fields=substr($fields, 0, strlen($fields)-1);
                    $values=substr($values, 0, strlen($values)-1);
                    $sqlInsert="insert into ".$tablaDetalle."(".$fields.") values(".$values.")";
                    $bdApli->consulta($sqlInsert);
                //echo $sqlInsert;
                }
            }
        }
    }
}else {
    echo "{valid:false,razon:'sesionOf'}";
}
?>