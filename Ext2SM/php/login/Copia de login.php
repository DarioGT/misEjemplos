<?php
$isecure=new SoapClient('../../ISecure3/ISecure3.wsdl');
$usuario=$_POST['usuario'];
//$usuario='edme115';
$aplicacion=$_POST['aplicacion'];
//$aplicacion=20015;
$entorno=$_POST['entorno'];
//$entorno='base';
$clave=$_POST['clave'];
//$clave='';
require_once '../conectar_bd.php';
$datos=new bd();
$sql="EXECUTE dbo.IS_AllowConect @KeyCliente='',@IdAplicaciON='".$aplicacion."',
@CodEntORno='".$entorno."',@Usuario='".$usuario."',@Clave='".$clave."',@Equipo=''";
$i=0;
$consulta = $datos->consulta($sql);
if($row = mssql_fetch_array($consulta)){
if($row['Autorizado']==1){
echo "{success:true, idusuario:'".$row['IdUsuario']."'}";
}else {
echo "{success:false , motivo:'".$row['Motivo']."' }";
	}
}
$datos->close();
?>