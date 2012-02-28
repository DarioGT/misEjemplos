<?php

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
$aplicacion=$_POST['aplicacion'];
$entorno=$_POST['entorno'];
$usuario=$_POST['usuario'];
session_start();
if(isset ($_SESSION['idSesion'])) {
    $keyc=$_POST['SMkey'];
    //$keyc='ceb1TxbIHL';
    $sesion=$_POST['SMses'];
    //$sesion=13320;

    if(($keyc==$_SESSION['keyCliente']) and ($sesion==$_SESSION['idSesion'])) {
        echo "{validate:true}";
        $falla=false;
    }else {
        echo "{validate:false}";
        $falla=true;
        $ip=$_SESSION['direccionCliente'];
    }
}else {
    echo "{validate:false}";
    $falla=true;
    $ip=getRealIP();
}
if($falla){
    require_once('../../PHPMailer/class.phpmailer.php');

    $config = simplexml_load_file("../config/web.config");
    $setings=$config->xpath("//configuration/appSettings/add");
    for($i=0;$i<count($setings);$i++){
        if($setings[$i]['name']=='admin_mail')$admin_mail=$setings[$i]['value'];
        if($setings[$i]['name']=='smtp_host')$smtp_host=$setings[$i]['value'];
        if($setings[$i]['name']=='smtp_user')$smtp_user=$setings[$i]['value'];
        if($setings[$i]['name']=='smtp_pwd')$smtp_pwd=$setings[$i]['value'];
        if($setings[$i]['name']=='smtp_port')$smtp_port=$setings[$i]['value'];
        if($setings[$i]['name']=='smtp_auth')$smtp_auth=$setings[$i]['value'];
       }
    $mail = new PHPMailer();
    $mail->IsSMTP(); // telling the class to use SMTP
    $mail->Host          = $smtp_host; // sets the SMTP server
    $mail->Port          = intval($smtp_port);                    // set the SMTP port for the GMAIL server
    if($smtp_auth=='auth'){
        $mail->SMTPAuth      = true;                  // enable SMTP authentication
        $mail->Username      = $smtp_user; // SMTP account username
        $mail->Password      = $smtp_pwd;        // SMTP account password
    }
    $mail->SetFrom($smtp_user, 'Soft Machine Web');
    $mail->Subject       = "Alerta de seguridad de SoftMachine Web";
    $mail->AltBody    = "Ha ocurrido un intento de violacion de seguridad desde ".$ip." su cliente de correo
     no admite html revise este correo con un cliente que lo admita"; // optional, comment out and test
    $msg='<h2>ha ocurrido un intento de violacion de seguridad desde la direccion</h2>
            <br><font color="red">'.$ip.'</font><br>
            <h2>los datos usados son los siguentes</h2><br>
            aplicacion:<font color="red">'.$aplicacion.'</font><br>
            entorno:<font color="red">'.$entorno.'</font><br>
            usuario:<font color="red">'.$usuario.'</font>';
    $mail->MsgHTML($msg);

    $mail->AddAddress($admin_mail);
    if($mail->Send()){
        echo "manda";
    }else{
        echo "no manda";
    }
}
?>
