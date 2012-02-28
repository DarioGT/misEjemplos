<?php
 require_once '../conectar_bd.php';
 $datos=new bd();
class loader{
	
	function display_children($idPadre, $datos, $idaplicacion , $usuario, $identorno) {
            if($usuario!=1){
		$sql = "select v.descripcion, v.idmenu, v.topcion, v.opcion  
		from sg1RolesUsuarios b 
		inner join (select w.descripcion, w.idmenu  as idmenu, w.Topcion, opcion, idaplicacion ,secuencia
		from W0MENUS w where w.menupadre ='".$idPadre."' ) v on v.idaplicacion = ".$idaplicacion."
		inner join sg0Roles r on b.idrol = r.idrol and r.idaplicacion = ".$idaplicacion."
		and identorno = (select identorno from sg0entornos where codentorno='".$identorno."' and idaplicacion=".$idaplicacion.")
		inner join sg1RolesOpciones a on a.idrol = b.idrol 
		inner join sg1opcionesOpe o on a.idOpcionOp = o.idOpcionOp and v.opcion = o.opcion  
		and o.operacion = 'IN'   where idusuario = ".$usuario."
		group by v.descripcion, v.idmenu, v.topcion, v.opcion,secuencia
        order by secuencia";
            }else{
                $sql="select v.descripcion, v.idmenu, v.topcion, v.opcion
		from sg1RolesUsuarios b
		inner join (select w.descripcion, w.idmenu  as idmenu, w.Topcion, opcion, idaplicacion ,secuencia
		from W0MENUS w where w.menupadre ='".$idPadre."' ) v on v.idaplicacion = ".$idaplicacion."
		inner join sg0Roles r on b.idrol = r.idrol and r.idaplicacion = ".$idaplicacion."
		and identorno = (select identorno from sg0entornos where codentorno='".$identorno."' and idaplicacion=".$idaplicacion.")
		group by v.descripcion, v.idmenu, v.topcion, v.opcion,secuencia
                order by secuencia";
            }
		$result = $datos->consulta($sql);
	
		while ($row = odbc_fetch_array($result)) {
                        $path['text']= utf8_encode($row['descripcion']);
                        $path['qtip'] = utf8_encode($row['descripcion']);
                        if($idPadre!='/'){
                            $path['id']= $idPadre.".".$row['opcion'];
                        }else{
                           $path['id']= $row['opcion'];
                        }
			$path['nemonico'] = $row['opcion'];
			$path['topcion'] = $row['topcion'];
			if($row['topcion'] == 'M'){
				$path['leaf']	= false;
				$path['cls']	= 'folder';
			}else{
				$path['leaf']	= true;
				$path['cls']	= 'file';
			}
 
		
			$nodes[] = $path;
		}
		echo json_encode($nodes);
		$datos->close();
	}
}
$treeDataModel = new loader;
$node=$_POST['node'];
$idaplicacion = $_POST['idaplicacion'];
$usuario = $_POST['usuario'];
$identorno = $_POST['identorno'];
$treeDataModel ->display_children($node, $datos, $idaplicacion,$usuario, $identorno); 
?>