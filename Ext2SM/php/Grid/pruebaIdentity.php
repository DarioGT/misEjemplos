<?php
include("../conectar_bd.php");
$datos=new bd();
$consulta=$datos->consulta("INSERT INTO [dbo].[SC9LogCambios]([IdSesion],[Nemonico],[TipoNov],[FechaNov])
     VALUES(13380,'par','UPD',getDate())
select scope_identity() as idlog");
odbc_next_result($consulta);
$row=odbc_fetch_array($consulta);
echo $row['idlog'];
?>
