<?php
$aplicacion=$_POST['aplicacion'];
//$aplicacion=10045;
$nemonico=$_POST['nemonico'];
//$nemonico='dresp1';
 include("../conectar_bd.php");
 $datos=new bd();

 $sql="select camposecuencia from sc0pcls where nemonico='".$nemonico."' and idaplicacion=".$aplicacion;
 $consulta=$datos->consulta($sql);
 if($row=odbc_fetch_array($consulta)){
     $campoGroup=trim(utf8_encode(strtolower($row['camposecuencia'])));
     $campos=explode(",",$campoGroup);
     foreach ($campos as $campo){
         $camposGroup[]=trim($campo);
     }
     echo "{found:true,campoGroup:".json_encode($camposGroup)."}";
 }else{
     echo "{found:false}";
 }

?>
