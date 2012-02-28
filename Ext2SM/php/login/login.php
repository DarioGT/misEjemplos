<?php
function RandomString($length=10,$uc=TRUE,$n=TRUE,$sc=FALSE) {
    $source = 'abcdefghijklmnopqrstuvwxyz';
    if($uc==1) $source .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if($n==1) $source .= '1234567890';
    if($sc==1) $source .= '|@#~$%()=^*+[]{}-_';
    if($length>0) {
        $rstr = "";
        $source = str_split($source,1);
        for($i=1; $i<=$length; $i++) {
            mt_srand((double)microtime() * 1000000);
            $num = mt_rand(1,count($source));
            $rstr .= $source[$num-1];
        }
    }
    return $rstr;
}


function getRealIP()
{

   if( isset($_SERVER['HTTP_X_FORWARDED_FOR']) )
   {
      $client_ip =
         ( !empty($_SERVER['REMOTE_ADDR']) ) ?
            $_SERVER['REMOTE_ADDR']
            :
            ( ( !empty($_ENV['REMOTE_ADDR']) ) ?
               $_ENV['REMOTE_ADDR']
               :
               "unknown" );

      // los proxys van añadiendo al final de esta cabecera
      // las direcciones ip que van "ocultando". Para localizar la ip real
      // del usuario se comienza a mirar por el principio hasta encontrar
      // una dirección ip que no sea del rango privado. En caso de no
      // encontrarse ninguna se toma como valor el REMOTE_ADDR

      $entries = split('[, ]', $_SERVER['HTTP_X_FORWARDED_FOR']);

      reset($entries);
      while (list(, $entry) = each($entries))
      {
         $entry = trim($entry);
         if ( preg_match("/^([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/", $entry, $ip_list) )
         {
            // http://www.faqs.org/rfcs/rfc1918.html
            $private_ip = array(
                  '/^0\./',
                  '/^127\.0\.0\.1/',
                  '/^192\.168\..*/',
                  '/^172\.((1[6-9])|(2[0-9])|(3[0-1]))\..*/',
                  '/^10\..*/');

            $found_ip = preg_replace($private_ip, $client_ip, $ip_list[1]);

            if ($client_ip != $found_ip)
            {
               $client_ip = $found_ip;
               break;
            }
         }
      }
   }
   else
   {
      $client_ip =
         ( !empty($_SERVER['REMOTE_ADDR']) ) ?
            $_SERVER['REMOTE_ADDR']
            :
            ( ( !empty($_ENV['REMOTE_ADDR']) ) ?
               $_ENV['REMOTE_ADDR']
               :
               "unknown" );
   }

   return $client_ip;

}


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
$key=RandomString();
$ip=getRealIP();
$params=array(
    'KeyCliente' =>$key,
    'IdApp'=>$aplicacion,
    'CodEntorno'=>$entorno,
    'Usuario'=>$usuario,
    'Clave'=>$clave,
    'Equipo'=>$ip);
$result = $isecure->AllowConnect($params);
if($result->AllowConnectResult>0) {
    $datos=new bd();
    $sesion=$result->AllowConnectResult;
    $sql="select idusuario,nombre,getDate() as fecha from dbo.sg0Usuarios where usuario='".$usuario."'";
    $consulta = $datos->consulta($sql);
    $row = odbc_fetch_array($consulta);
    $user=$row['idusuario'];
    $fecha=$row['fecha'];
    $nombreUsuario=$row['nombre'];
    $result = $isecure->GetAppConnect(array(
        'KeyCliente' =>$key,
        'IdSesion'=>$sesion
    ));
    $conexion=$result->GetAppConnectResult;
    $sql="select ValorParametro from dbo.w0parametros where parametro='FormatoFecha'";
    $consulta = $datos->consulta($sql);
    $row = odbc_fetch_array($consulta);
    $formatoFecha=$row['ValorParametro'];
    $formatoFecha=str_replace("DD","d",$formatoFecha);
    $formatoFecha=str_replace("dd","d",$formatoFecha);
    $formatoFecha=str_replace("MM","m",$formatoFecha);
    $formatoFecha=str_replace("MM","m",$formatoFecha);
    $formatoFecha=str_replace("YYYY","Y",$formatoFecha);
    $formatoFecha=str_replace("yyyy","Y",$formatoFecha);
    session_start();
    $_SESSION['conexion']=$conexion;
    $_SESSION['idSesion']=$sesion;
    $_SESSION['keyCliente']=$key;
    $_SESSION['formatoFecha']=$formatoFecha;
    $_SESSION['direccionCliente']=$ip;
    echo "{success:true, idusuario:'".$user."',nombreUsuario:'".$nombreUsuario."',fecha:'".date("m/d/Y",strtotime($fecha))."',sesion:".$sesion.",llave:'".$key."'}";
    $datos->close();
}else {
    echo "{success:false , motivo:'usuario o clave erroneos' }";
}
?>