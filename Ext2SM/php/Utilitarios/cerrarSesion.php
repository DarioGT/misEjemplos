<?php
session_start();
$sesion=$_SESSION['idSesion'];
$keyc=$_SESSION['keyCliente'];
session_destroy();
$isecure=new SoapClient('../../ISecure3/ISecure3.wsdl');
$isecure->XReset(array(
        'KeyCliente' =>$keyc,
        'IdSesion'=>$sesion
    ));
echo "conmit:true";
?>
