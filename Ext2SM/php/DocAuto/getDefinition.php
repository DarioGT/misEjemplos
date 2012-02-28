<?php
include("../conectar_bd.php");

$nemonico=$_POST['nemonico'];
//$nemonico='ctdoc';
$aplicacion=$_POST['aplicacion'];
//$aplicacion=10;
$datos=new bd();
$i=0;
$sqlOp="select TIPOOPCION from sg0opciones where idaplicacion='".$aplicacion."' and opcion='".$nemonico."'";
$consulta=$datos->consulta($sqlOp);
if($row = odbc_fetch_array($consulta)) {
    if(strtolower($row['TIPOOPCION'])=='adm')$aplicacion=1;
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
        case "HEREDA";
            if(trim($row['valorh'])=='')$row['valorh']=$row['valorb'];
            $Dheredado['campoEnc']=utf8_encode(strtolower($row['valorb']));
            $Dheredado['campoDet']=utf8_encode(strtolower($row['valorh']));
            $DocHeredados[utf8_encode(strtolower($row['valorb']))]=$Dheredado;
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
        case "TIPDOCU";
            $tipDocu=$row['valorb'];
            break;
    }
}

if(!isset ($tipoIncremento))$tipoIncremento='IDENTIDAD';
if(!isset ($campoEstado))$campoEstado='ESTADO';
if(!isset ($campoNumero))$campoNumero='NUMDOCU';
if(!isset ($campoTipo))$campoTipo='TIPDOCU';
if(!isset ($llaveForanea))$llaveForanea=$campoIdentidad;
if(!isset ($tipDocu))$tipDocu='*';

if(isset ($encabezado) and isset ($detalle) and isset ($tablaEnc)) {
    $sql="select descripcion from sg0opciones where idaplicacion='".$aplicacion."' and opcion='".$nemonico."'";
    $consulta=$datos->consulta($sql);
    $row = odbc_fetch_array($consulta);
    $titulo=$row['descripcion'];
    $sql="select convert(text, SQLSTMT)  as  SQLSTMT ,TITULO,TABLABASE,DESCRIPCION from dbo.SC0Pcls where
    nemonico='".$encabezado."' and idaplicacion=".$aplicacion;
    $consulta=$datos->consulta($sql);
    if($row = odbc_fetch_array($consulta)) {
        $criterioEvento=$nemonico."_c";
        $PclEncabezado['tablaBase']=$row['TABLABASE'];
        $PclEncabezado['titulo']=$row['TITULO'];
        $PclEncabezado['descripcion']=$row['TITULO'];
        $PclEncabezado['nemonico']=$encabezado;
        $PclEncabezado['DocAuto']=$nemonico;


        $sql = "SELECT NOMBREEVENTO,CONVERT(TEXT,HANDLER) AS HANDLER FROM EVENTOSWEB E,MOVIEVENTOSWEB M
WHERE M.APLICACION =$aplicacion and M.NEMONICO = '$criterioEvento' and E.ESTADO='A' and M.ESTADO='A'
and E.IDTIPOEVENTO=0 and E.IDEVENTO=M.IDEVENTO";
        $consulta = $datos->consulta($sql);
        $countEventos=0;
        while($row = odbc_fetch_array($consulta)) {
            $elim = array("\n","\r","\t");
            $eventos[utf8_encode($row['NOMBREEVENTO'])]=utf8_encode(str_replace($elim,' ', $row['HANDLER']));
            //echo $row['HANDLER'];
            $countEventos++;
        }
        if($countEventos==0)$eventos='{}';
        $PclEncabezado['eventos']=$eventos;

        $sql="select ZOOMREF,ZOOMNAME,ZOOMKEY,ZOOMFILTER,DATAFIELD,COLTITLE,FLDLABEL,
              MICROHELP,VRREQUIRED,COLWIDTH,COLNUMBER,GTYPE,EDITALLOW,MAXLEN,DBKEY,
              VRDEFAULT,webEdit from dbo.SC1CamposPcl where nemonico='".$encabezado."' and idaplicacion=".$aplicacion;
        $consulta=$datos->consulta($sql);
        while($row = odbc_fetch_array($consulta)) {
            $name['zoomRef'] = trim(utf8_encode(strtolower($row['ZOOMREF'])));
            $name['zoomName'] = trim(utf8_encode(strtolower($row['ZOOMNAME'])));
            $name['zoomKey'] = trim(utf8_encode(strtolower($row['ZOOMKEY'])));
            $name['zoomFilter'] = trim(utf8_encode(strtolower($row['ZOOMFILTER'])));
            $name['name'] = utf8_encode(strtolower($row['DATAFIELD']));
            $name['title'] = utf8_encode(ucfirst(strtolower($row['COLTITLE'])));
            $name['label'] = utf8_encode(ucfirst(strtolower($row['FLDLABEL'])));
            $name['tip'] = utf8_encode($row['MICROHELP']);
            $name['requerido']=$row['VRREQUIRED'];
            $name['width']=intval($row['COLWIDTH']*.085);
            $name['number']=$row['COLNUMBER'];
            $name['gtype']=$row['GTYPE'];
            $name['vdefault']=trim(utf8_encode($row['VRDEFAULT']));

            $name['heredados']=null;
            $consH="select CAMPOHEREDADO,CAMPOZOOM from SC1ZOOMSR where IDAPLICACION=".$aplicacion."
    and NEMONICO='".$encabezado."' and CAMPOGRILLA='".$row['DATAFIELD']."'";
            $resultH=$datos->consulta($consH);
            while($fila=odbc_fetch_array($resultH)) {
                $heredado['campoHeredado']=trim(utf8_encode(strtolower($fila['CAMPOHEREDADO'])));
                $heredado['campoZoom']=trim(utf8_encode(strtolower($fila['CAMPOZOOM'])));
                $name['heredados'][]=$heredado;
            }

            $campos[] = $name;
        }
        $PclEncabezado['campos']=$campos;
        $sql="SELECT     Criterio
            FROM         W0Criterios
            WHERE     (IdAplicacion = '".$aplicacion."') 
            AND (Qname = '".$nemonico."_c') AND (Tcriterio = 'TABS') AND (CNombre = 'TABCNF') and usuarioP='PUBLICO'";
        $consulta = $datos->consulta($sql);
        if($row = odbc_fetch_array($consulta)) {
            $tb=explode(";",$row['Criterio']);
            $i=0;
            foreach ($tb as $valor) {
                $tabs[$i]['nombre']= utf8_encode(ucfirst(strtolower(trim($valor))));
                $sql="select criterio from w0criterios where qname='".$nemonico."_c' and cnombre='".trim($valor)."' and usuariop='publico'";
                $consulta = $datos->consulta($sql);
                $row = odbc_fetch_array($consulta);
                $fields=explode(";", $row['criterio']);
                $fieldsArray=array ();
                foreach ($fields as $campo) {
                    $fieldFeatures=explode(":",$campo);
                    $cmp['numero']=trim($fieldFeatures[0]);
                    $cmp['ancho']=trim($fieldFeatures[1]);
                    $fieldsArray[]=$cmp;
                }
                $tabs[$i]['definicion']=$fieldsArray;
                $i++;
            }


        }else {
            $tabs[0]['nombre']= "Basicas";
            foreach ($campos as $campo) {
                $cmp['numero']=$campo['number'];
                $cmp['ancho']=0;
                $fieldsArray[]=$cmp;
            }
            $tabs[0]['definicion']=$fieldsArray;
        }
        $PclEncabezado['tabs']=$tabs;

        $sql="SELECT  titulo,tooltip,image,CONVERT(NTEXT,HANDLER) AS handler,CONVERT(NTEXT,condicion) AS condicion
            from botones WHERE     (IdAplicacion = '".$aplicacion."')
            AND (opcion = '".$nemonico."') AND estado='A'";
        $consulta = $datos->consulta($sql);
        $elim = array("\n","\r","\t");
        while($row = odbc_fetch_array($consulta)) {
            $boton['titulo']=trim(utf8_encode($row['titulo']));
            $boton['toolTip']=trim(utf8_encode($row['tooltip']));
            $boton['imagen']=trim(utf8_encode($row['image']));
            $boton['handler']=utf8_encode(str_replace($elim, ' ', $row['handler']));
            $boton['condicion']=utf8_encode(str_replace($elim, ' ', $row['condicion']));
            $botones[]=$boton;
        }
        if(!isset($DocHeredados))$DocHeredados=null;
        if(!isset($botones))$botones=null;
        echo "{valid:true,
              encabezado:'".$encabezado."',
              incremento:'".trim(utf8_encode($tipoIncremento))."',
              campoEstado:'".trim(utf8_encode(strtolower($campoEstado)))."',
              campoNumero:'".trim(utf8_encode(strtolower($campoNumero)))."',
              estadoInicial:'".trim(utf8_encode($estadoInicial))."',
              campoTipo:'".trim(utf8_encode(strtolower($campoTipo)))."',
              campoIdentidad:'".trim(utf8_encode(strtolower($campoIdentidad)))."',
              tipDocu:'".trim(utf8_encode($tipDocu))."',
              foranea:'".trim(utf8_encode(strtolower($llaveForanea)))."',
              heredados:".json_encode($DocHeredados).",
              botones:".json_encode($botones).",
              titulo:'".$titulo."',
              detalle:'".$detalle."',
              tablaEnc:'".$tablaEnc."',
              defEncabezado:".json_encode($PclEncabezado)."}";
    }else {
        echo "{valid:false}";
    }
}else {
    echo "{valid:false}";
}
?>
