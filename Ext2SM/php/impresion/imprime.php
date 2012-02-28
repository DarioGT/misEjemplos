<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Documento sin t&iacute;tulo</title>
        <link rel="stylesheet" type="text/css" href="tablas.css" />
    </head>

    <body>
        <div class="ver" id="imprimi">
            <?php
            date_default_timezone_set("America/Bogota");
            $nemonico = $_GET['nemonico'];
            //$nemonico='proy';
            $filtro=utf8_decode($_GET['filtro']);
            //$filtro="";
            $filtroQbe=utf8_decode($_GET['filtroQbe']);
            $aplicacion=$_GET['aplicacion'];
            //$aplicacion=10045;
            $columnas=utf8_decode($_GET['columnas']);
            $arrayColumnas=json_decode($columnas);
            if(isset ($_GET['filtroQbe'])) {
                $filtroQbe=$_GET['filtroQbe'];
            }else {
                $filtroQbe='';
            }
            $found="false";
            include("../conectar_bd.php");
            include("../QBE/consultaQBE.php");
            $datos = new bd();
            $sqlOp="select tipoopcion from sg0opciones where idaplicacion='".$aplicacion."' and opcion='".$nemonico."'";
            $consulta=$datos->consulta($sqlOp);
            if($row=odbc_fetch_array($consulta)) {
                if(strtolower($row['tipoopcion'])=='adm')$aplicacion=1;
            }

            $sql="SELECT ValorParametro from w0parametros where parametro='EMPRESA'";
            $consulta = $datos->consulta($sql);
            $row=odbc_fetch_array($consulta);
            $empresa=$row['ValorParametro'];

            $sql="select convert(text, SQLSTMT) as  SQLSTMT,TITULO from sc0pcls where idaplicacion = ".$aplicacion." and nemonico = '$nemonico'";
            $consulta = $datos->consulta($sql);
            $row=odbc_fetch_array($consulta);
            $sql2=$row['SQLSTMT'];
            $titulo=$row['TITULO'];
            session_start();
            if(isset ($_SESSION['conexion'])) {
                $conexion=$_SESSION['conexion'];
                echo "<h1>$empresa</h1>";
                echo "<h4><center width=500>$titulo</center></h4>";
                $sql = "select DATAFIELD,GTYPE,COLTITLE from SC1CAMPOSPCL  where idaplicacion = ".$aplicacion." and nemonico='".$nemonico."'";
                $consulta = $datos->consulta($sql);
                echo '<TABLE BORDER="1" style="border-collapse: collapse;" class="lista">';
                echo '<tr>';
                while($row = odbc_fetch_array($consulta)) {
                    $name['name'] = $row['DATAFIELD'];
                    $name['tipo']=$row['GTYPE'];
                    $name['titulo']=$row['COLTITLE'];
                    $vector[strtolower($row['DATAFIELD'])] = $name;
                }
                foreach ($arrayColumnas as $columna) {
                    echo "<TH><b>".utf8_encode(ucfirst(strtolower($vector[utf8_decode($columna)]['titulo'])))."</b></TH>";
                }
                echo '</tr>';
                $datos->close();
                if($aplicacion==1) {
                    $planos=new bd();
                }else {
                    $planos = new bd($conexion);
                }
                if($filtro!='') {
                    if(strpos($sql2, " where ") or strpos($sql2, " WHERE ")) {
                        $sql2=$sql2." and ".$filtro;
                    }else {
                        $sql2=$sql2." where ".$filtro;
                    }
                    $filtro='';
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
                $consulta2 = $planos->consulta($sql2);
                //$contenido=null;
                while($row1 = odbc_fetch_array($consulta2)) {
                    $row1=array_change_key_case($row1);
                    $found="true";
                    echo "<tr>";
                    foreach( $arrayColumnas as $value ) {
                    //$val=strtolower($value);
                    //$utfVal=strtolower(utf8_encode($value['name']));
                        if((strtoupper($vector[utf8_decode($value)]['tipo'])=='DAT') and (trim($row1[$value])!='')){
                            echo "<td>".date("d/m/Y",strtotime(utf8_encode($row1[$value])))."</td>"; // busca el valor para llenar las
                    // filas del Store
                        }else{
                            echo "<td>".utf8_encode($row1[$value])."</td>";
                        }

                    }
                    echo "</tr>";
                }
                $planos->close();
            }else {
                echo "{found:false,razon:'ha caducado la sesion'}";
            }
            ?>
        <input type="button" name="imprimir" value="Imprimir" align="center" onclick="window.print();"/>
        </div>

    </body>
</html>
