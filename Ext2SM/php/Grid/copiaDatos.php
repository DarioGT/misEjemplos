<?php
$nemonico = $_POST['nemonico'];
//$nemonico='estan';
$filtro=$_POST['filtro'];
//$filtro="";
$inicio=$_POST['start'];
//$inicio=0;
$limite=$_POST['limit'];
//$limite=5;
$aplicacion=$_POST['aplicacion'];
//$aplicacion=10045;

$llave="";
include("../conectar_bd.php");
$datos = new bd();
$sqlOp="select * from sg0opciones where idaplicacion='".$aplicacion."' and opcion='".$nemonico."'";
$consulta=$datos->consulta($sqlOp);
if($row=mssql_fetch_array($consulta)){
    if(strtolower($row['TIPOOPCION'])=='adm')$aplicacion=1;
}
$sql = "select convert(text, SQLSTMT)  as  SQLSTMT ,
TITULO,TABLABASE,PERMITEADD,PERMITEUPD,PERMITEDEL,c.* from sc0pcls p inner join SC1CAMPOSPCL c on c.idaplicacion = p.idaplicacion
and c.nemonico = p.nemonico where p.idaplicacion = ".$aplicacion." and p.nemonico = '$nemonico'
 ORDER BY COLNUMBER";//esta se ejecuta bien

$consulta = $datos->consulta($sql);
while($row = mssql_fetch_array($consulta)){
	$sql2 = $row['SQLSTMT'];
    $titulo=utf8_encode($row['TITULO']);
    $tabla=utf8_encode($row['TABLABASE']);
    $add=trim($row['PERMITEADD']);
    $upd=trim($row['PERMITEUPD']);
    $del=trim($row['PERMITEDEL']);
    $name['zoomRef'] = trim(utf8_encode(strtolower($row['ZOOMREF'])));
    $name['zoomName'] = trim(utf8_encode(strtolower($row['ZOOMNAME'])));
    $name['zoomKey'] = trim(utf8_encode(strtolower($row['ZOOMKEY'])));
    $name['zoomFilter'] = trim(utf8_encode(strtolower($row['ZOOMFILTER'])));
    $name['name'] = utf8_encode(strtolower($row['DATAFIELD']));
    $name['title'] = utf8_encode(ucfirst(strtolower($row['COLTITLE'])));
    $name['label'] = utf8_encode(ucfirst(strtolower($row['FLDLABEL'])));
    $name['tip'] = utf8_encode($row['MICROHELP']);
	$name['width']=intval($row['COLWIDTH']*.085);
	$name['number']=$row['COLNUMBER'];
    $name['gtype']=$row['GTYPE'];
    $name['permisos']=$row['EDITALLOW'];
    $name['vdefault']=trim(utf8_encode(strtolower($row['VRDEFAULT'])));
    if($row['DBKEY']==-1)$llave=$row['DATAFIELD'];
	if($row['MAXLEN']==-1){$name['show']='false';}else{$name['show']='true';}
	if($row['GTYPE']=='NUM'){$name['type']='float';}
	else{if($row['GTYPE']=='DAT'){
            $name['type']='date';
            $name['dateFormat']='d/m/Y';
            }
	else{$name['type']='string';}}
    $name['heredados']=null;
    $consH="select CAMPOHEREDADO,CAMPOZOOM from SC1ZOOMSR where IDAPLICACION=".$aplicacion."
    and NEMONICO='".$nemonico."' and CAMPOGRILLA='".$row['DATAFIELD']."'";
    $resultH=$datos->consulta($consH);
    while($fila=mssql_fetch_array($resultH)){
        $heredado['campoHeredado']=trim(utf8_encode(strtolower($fila['CAMPOHEREDADO'])));
        $heredado['campoZoom']=trim(utf8_encode(strtolower($fila['CAMPOZOOM'])));
        $name['heredados'][]=$heredado;
    }
	$vector[] = $name;
}
if($llave=="")$llave=utf8_decode($vector[0]['name']);
$sql = "SELECT CONVERT(TEXT,rowRender) AS rowRender FROM WEBDESIGNPCL
WHERE IDAPLICACION = ".$aplicacion." and NEMONICO = '$nemonico'";
$consulta = $datos->consulta($sql);
IF($row = mssql_fetch_array($consulta)){
    $rowRender=eregi_replace("[\n|\r|\n\r]", ' ', $row['rowRender']);
}else{
    $rowRender='';
}
$datos->close();
if($aplicacion==1){
    $planos=new bd();
}else{
    $planos = new bd("PgAmbiental");
}
if($filtro==''){$where='';}else{$where="where ".$filtro;}
$sql2="select * from (".$sql2.") as t ".$where;
$consulta2 = $planos->consulta($sql2);
$totalRows=mssql_num_rows($consulta2);
$size=$inicio+$limite;
if($size>$totalRows)$limite=$totalRows-$inicio;
$sql3="
select * from (select top ".$limite." * from
(select top ".$size." * from (".$sql2.") as tableQ order by ".$llave." )
 as tabla order by ".$llave." desc) as tabla2 order by ".$llave;
$consulta2 = $planos->consulta($sql3);
$i = 1;
	while($row1 = mssql_fetch_array($consulta2)){
		//$row1 = mssql_fetch_array($consulta2);//el problema sale aka
        $row1=array_change_key_case($row1);
		 foreach( $vector as $key => $value ) {
             $val=$value['name'];
             if($value['type']=='date'){
                 if(trim($row1[$val])!=""){
                 $contenido[$val] = date("d/m/Y",strtotime($row1[$val]));
                 }else{
                     $contenido[$val] = $row1[$val];}}
             else{
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
    titulo:'".ucfirst(strtolower($titulo))."',
    tabla:'".$tabla."',
    dbkey:'".utf8_encode(strtolower($llave))."',
    rowRender:\"".$rowRender."\",
    id: 'id',
    fields: ", json_encode($vector),"
   	},
    'total':'".$totalRows."',
   'rows': ",json_encode($total),"
	}";
  ?>