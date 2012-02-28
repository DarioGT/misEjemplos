<?php
include("../conectar_bd.php");
$datos=new bd();
$aplicacion=$_POST['aplicacion'];
$nemonico=$_POST['nemonico'];
$usuario=$_POST['usuario'];
$found=false;
$sql="select tipoopcion,webcontrol,origen,rutaarchivo from sg0opciones where idaplicacion=".$aplicacion." and opcion='".$nemonico."'";
$consulta=$datos->consulta($sql);
if($row=odbc_fetch_array($consulta)){
if($usuario!=1){
$sqlRigth="SELECT     Opcion, Operacion
                FROM         sg1OpcionesOpe
                WHERE     IdOpcionOp IN (SELECT     IdOpcionOp    FROM
			 sg1RolesOpciones U
			 WHERE  U.IdRol in(select R.idrol from dbo.sg1RolesUsuarios U,dbo.sg0Roles R
                 where u.idusuario=".$usuario." and R.idaplicacion=".$aplicacion." and r.idrol=U.idrol) )
             and opcion='".$nemonico."' and operacion='IN'
                group by opcion,operacion";
            $consulta2=$datos->consulta($sqlRigth);
            if($row2=odbc_fetch_array($consulta2)){
                $found=true;
            }else{
               echo "{found:false}";
            }
        }else{
            $found=true;
        }
 if($found){
    $tipo=strtoupper($row['tipoopcion']);
    switch ($tipo) {
        case "O":
            $sql="select filtroinicio from sc0pcls where idaplicacion=".$aplicacion." and nemonico='".$nemonico."'";
            $consulta=$datos->consulta($sql);
            $row=odbc_fetch_array($consulta);
            $filtro=$row['filtroinicio'];
            echo "{found:true,clase:'SM.PCL',filtroInicio:'".utf8_encode($filtro)."'}";
            break;
        case "DODOC":
            echo "{found:true,clase:'SM.DocAuto',origen:'".trim(utf8_encode($row['origen']))."'}";
            break;
        case "SMDOC":
            echo "{found:true,clase:'SM.DocAuto',origen:'".trim(utf8_encode($row['origen']))."'}";
            break;
        case "EXT":
            echo "{found:true,clase:'".$row['webcontrol']."',origen:'".trim(utf8_encode($row['origen']))."',rutaArchivo:'".$row['rutaarchivo']."'}";
            break;
        case "GROUP":
            $sql="select filtroinicio from sc0pcls where idaplicacion=".$aplicacion." and nemonico='".$nemonico."'";
            $consulta=$datos->consulta($sql);
            $row=odbc_fetch_array($consulta);
            $filtro=$row['filtroinicio'];
            echo "{found:true,clase:'Pcl-Group',filtroInicio:'".utf8_encode($filtro)."'}";
            break;
        default:
            echo "{found:false}";
            break;
    }
 }
}else{
    echo "{found:false}";
}


?>