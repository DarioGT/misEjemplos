<?php
include("../conectar_bd.php");
include("../QBE/consultaQBE.php");
$addRigth=0;
$updRigth=0;
$delRigth=0;
session_start();
date_default_timezone_set("America/Bogota");
$nemonico = $_POST['nemonico'];
//$nemonico='proy';
$filtro=$_POST['filtro'];
//$filtro="";
$inicio=$_POST['start'];
//$inicio=0;
$limite=$_POST['limit'];
//$limite=5;
$aplicacion=$_POST['aplicacion'];
//$aplicacion=10045;
$usuario=$_POST['usuario'];
//$usuario=1;
$keyc=$_POST['SMkey'];
//$keyc='ceb1TxbIHL';
$sesion=$_POST['SMses'];
//$sesion=13320;
$tipoPcl=$_POST['tipo'];
if(isset ($_POST['filtroQbe'])) {
    $filtroQbe=$_POST['filtroQbe'];
}else {
    $filtroQbe='';
}

if(isset ($_POST['criterioEventos'])) {
    $nemoEventos=$_POST['criterioEventos'];
}else {
    $nemoEventos=$nemonico;
}
if(isset ($_SESSION['conexion'])) {
    $conexion=$_SESSION['conexion'];
    $llave="";
    $datos = new bd();
    if($usuario==1) {
        $addRigth=-1;
        $updRigth=-1;
        $delRigth=-1;
    }else {
        $sqlRigth="SELECT     Opcion, operacion
                FROM         sg1OpcionesOpe
                WHERE     IdOpcionOp IN (SELECT     IdOpcionOp    FROM
			 sg1RolesOpciones U
			 WHERE  U.IdRol in(select R.idrol from dbo.sg1RolesUsuarios U,dbo.sg0Roles R
                 where u.idusuario=".$usuario." and R.idaplicacion=".$aplicacion." and r.idrol=U.idrol) )
             and opcion='".$nemonico."'
                group by opcion,operacion";
        $consulta=$datos->consulta($sqlRigth);
        while($row=odbc_fetch_array($consulta)) {
            if($row['operacion']=='ADD')$addRigth=-1;
            if($row['operacion']=='UPD')$updRigth=-1;
            if($row['operacion']=='DEL')$delRigth=-1;
        }
    }


    $sqlOp="select TIPOOPCION from sg0opciones where idaplicacion='".$aplicacion."' and opcion='".$nemonico."'";
    $consulta=$datos->consulta($sqlOp);
    if($row=odbc_fetch_array($consulta)) {
        if(strtolower($row['TIPOOPCION'])=='adm')$aplicacion=1;
    }

    $sql="select convert(text, p.SQLSTMT)  as  SQLSTMT ,
    p.TITULO,p.TABLABASE,p.PERMITEADD,p.PERMITEUPD,p.PERMITEDEL from sc0pcls p 
    where idaplicacion='".$aplicacion."' and nemonico='".$nemonico."'";
    $consulta=$datos->consulta($sql);
    $row=odbc_fetch_array($consulta);
    $sql2 = $row['SQLSTMT'];
    $titulo=utf8_encode(ucfirst(strtolower($row['TITULO'])));
    $tabla=utf8_encode($row['TABLABASE']);
    if($row['PERMITEADD']==-1) {$add=$addRigth;}else {$add=0;}
    if($row['PERMITEUPD']==-1) {$upd=$updRigth;}else {$upd=0;}
    if($row['PERMITEDEL']==-1) {$del=$delRigth;}else {$del=0;}

    $sql = "select c.ZOOMREF,c.ZOOMNAME,c.ZOOMKEY,c.ZOOMFILTER,c.DATAFIELD,c.COLTITLE,c.FLDLABEL,
    c.MICROHELP,c.VRREQUIRED,c.COLWIDTH,c.COLNUMBER,c.GTYPE,c.EDITALLOW,c.MAXLEN,c.DBKEY,c.VRDEFAULT,
    c.webEdit from SC1CAMPOSPCL c where c.idaplicacion = ".$aplicacion." and c.nemonico = '$nemonico'
    ORDER BY COLNUMBER";
    $consulta = $datos->consulta($sql);
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
        $sqlPer="SELECT [dbo].[getFieldAcces] (".$aplicacion.",'".$nemonico."','".$row['DATAFIELD']."',".$usuario.") as acceso";
        $resultPer=$datos->consulta($sqlPer);
        $nAcceso=odbc_fetch_array($resultPer);
        if($nAcceso['acceso']=='ALL') {
            if($row['webEdit']!='') {
                $name['permisos']=$row['webEdit'];
            }else {
                $name['permisos']=$row['EDITALLOW'];
            }
        }else {
            if($nAcceso['acceso']=='HI') {
                $row['MAXLEN']=-1;
            }
            $name['permisos']=$nAcceso['acceso'];
        }
        $name['vdefault']=trim(utf8_encode($row['VRDEFAULT']));
        if($row['DBKEY']==-1)$llave=$row['DATAFIELD'];
        if($row['MAXLEN']==-1) {$name['show']='false';}else {$name['show']='true';}
        if($row['GTYPE']=='NUM') {$name['type']='float';}
        else {if($row['GTYPE']=='DAT') {
                $name['type']='date';
                $name['dateFormat']='d/m/Y';
            }
            else {$name['type']='string';}}
        $name['heredados']=null;
        $consH="select CAMPOHEREDADO,CAMPOZOOM from SC1ZOOMSR where IDAPLICACION=".$aplicacion."
    and NEMONICO='".$nemonico."' and CAMPOGRILLA='".$row['DATAFIELD']."'";
        $resultH=$datos->consulta($consH);
        while($fila=odbc_fetch_array($resultH)) {
            $heredado['campoHeredado']=trim(utf8_encode(strtolower($fila['CAMPOHEREDADO'])));
            $heredado['campoZoom']=trim(utf8_encode(strtolower($fila['CAMPOZOOM'])));
            $name['heredados'][]=$heredado;
        }
        $Campo=$row['DATAFIELD'];
        $consEvent = "SELECT NOMBREEVENTO,CONVERT(TEXT,HANDLER) AS HANDLER FROM EVENTOSWEB E,MOVIEVENTOSWEB M
    WHERE M.APLICACION =$aplicacion and M.NEMONICO = '$nemoEventos' and E.ESTADO='A' and M.ESTADO='A'
    and E.IDTIPOEVENTO=1 and E.IDEVENTO=M.IDEVENTO and M.CAMPO='$Campo'";
        $resultEvent = $datos->consulta($consEvent);
        $eventosC=0;
        $name['eventos']=null;
        while($fil = odbc_fetch_array($resultEvent)) {
            $elim = array("\n","\r","\t");
            $name['eventos'][utf8_encode($fil['NOMBREEVENTO'])]=utf8_encode(str_replace($elim, ' ', $fil['HANDLER']));
            $eventosC++;
        }
        if($eventosC==0)$name['eventos']="{}";
        $vector[] = $name;
    }
    if($llave=="")$llave=utf8_decode($vector[0]['name']);
    $sql = "SELECT NOMBREEVENTO,CONVERT(TEXT,HANDLER) AS HANDLER FROM EVENTOSWEB E,MOVIEVENTOSWEB M
WHERE M.APLICACION =$aplicacion and M.NEMONICO = '$nemoEventos' and E.ESTADO='A' and M.ESTADO='A'
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
    $datos->close();
    if($aplicacion==1) {
        $planos=new bd();
    }else {
        $planos = new bd($conexion);
    }
    if($tipoPcl=='zoom') {
        if($filtro!='') {
            if(strpos($sql2, " where ") or strpos($sql2, " WHERE ")) {
                $sql2=$sql2." and ".$filtro;
            }else {
                $sql2=$sql2." where ".$filtro;
            }
            $filtro='';
        }
    }
    if($filtro=='') {$where='';}else {$where="where ".$filtro;}
    if(trim($filtroQbe)!='') {
        $criterioQbe=devuelveQBE($filtroQbe);
        if($where=='') {
            $where="where ".$criterioQbe;
        }else {
            $where=$where." and ".$criterioQbe;
        }
    }
    $sql2="select * from (".$sql2.") as t ".$where;
    //echo $sql2;
    $consulta2 = $planos->consulta($sql2);
    $totalRows=odbc_num_rows($consulta2);
    $size=$inicio+$limite;
    if($size>$totalRows)$limite=$totalRows-$inicio;
    $sql3="
select * from (select top ".$limite." * from
(select top ".$size." * from (".$sql2.") as tableQ order by ".$llave." )
 as tabla order by ".$llave." desc) as tabla2 order by ".$llave;
    $consulta2 = $planos->consulta($sql3);
    $i = 1;
    while($row1 = odbc_fetch_array($consulta2)) {
    //$row1 = odbc_fetch_array($consulta2);//el problema sale aka
        $row1=array_change_key_case($row1);
        foreach( $vector as $key => $value ) {
            $val=$value['name'];
            if($value['type']=='date') {
                if(trim($row1[$val])!="") {
                    $contenido[$val] = date("d/m/Y",strtotime($row1[$val]));
                }else {
                    $contenido[$val] = $row1[$val];}}
            else {
                $contenido[$val] = utf8_encode($row1[$val]); // busca el valor para llenar las
            // filas del Store
            }
        }
        $total[] = $contenido;
        $i++;
    }
    if($i==1)$total=null;
    $planos->close();
    echo "{
	'metaData': {
    root: 'rows',
    totalProperty: 'total',
    add:'".$add."',
    upd:'".$upd."',
    del:'".$del."',
    titulo:'".$titulo."',
    tabla:'".$tabla."',
    dbkey:'".utf8_encode(strtolower($llave))."',
    eventos:".json_encode($eventos).",
    id: 'id',
    fields: ", json_encode($vector),"
   	},
    'total':'".$totalRows."',
   'rows': ",json_encode($total),"
	}";
}else {
    echo "{falla:'la sesion ha expirado'}";
}
  ?>