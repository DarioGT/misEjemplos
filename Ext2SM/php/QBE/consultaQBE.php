<?php

function devuelveQBE($cadena){
    $explode = explode(",",$cadena);
    // determinamos de que tipo es
    $where = "";
    foreach ($explode as $texto){
        $algo="";
        $tipoCampo = tipoCaracter($texto); // se obtiene el tipo de campo int, string, date
        $texto1 = explode($tipoCampo, $texto);
        $campo = $texto1[0];
        $texto2 = explode(' ', $texto1[1]);
        $texto3 = explode(';', $texto2[1]);
        foreach ($texto3 as $con) {
            if (substr_count($con,'*') > 0 || substr_count($con,'?') > 0){

                $where = $where.' '.$campo.consultaLike($con) ;
            }else{
                if (substr_count($con,':') > 0){
                    $where = $where.' '.$campo.consultaBetween($con,$tipoCampo) ;
                }else{

                    if (substr_count($con,'>=') > 0 or substr_count($con,'<=') > 0
                        or substr_count($con,'!=') > 0 or substr_count($con,'=') > 0
                        or substr_count($con,'>') > 0 or substr_count($con,'<') > 0  or substr_count($con,'<>') > 0){
                        $where = $where.' '.$campo.' '.$con ;
                    }else{
                        if($tipoCampo == '#'){
                            $where = $where.$campo.' = '.$con;
                        }else{
                            $where = $where.' '.$campo." = '".$con."'";
                        }
                    }
                }
            }
            $where = $where.' or';
        }
    }
    $where = substr($where,0, strlen($where) - 2);
    return $where;
}

function tipoCaracter($cadena){
    if( substr_count($cadena,'$') > 0){
        return '$';
    }else{
        if( substr_count($cadena,'#') > 0){
            return '#';
        }else{
            if( substr_count($cadena,'/') > 0){
                return '/';
            }
        }
    }
    return '';
}
function tipoConsulta(){

}

function consultaLike($condicion){
    $condicion = str_replace('*','%',$condicion);
    $condicion = str_replace('?','_',$condicion);
    $condicion = " Like '".$condicion."'";
    return $condicion;
}

function consultaBetween($condicion, $tipoCampo){// solo para enteros

    if($tipoCampo == '#'){
        $condicion = " Between ".$condicion;
        $condicion = str_replace(':',' and ',$condicion);
    }else{
        $condicion = " Between '".$condicion;
        $condicion = str_replace(':',"' and '",$condicion);
        $condicion = $condicion. "'";
    }
    return $condicion;
}

function consultaIn($condicion, $tipoCampo){
    if($tipoCampo == '#'){

    }else{
        $condicion = " In ( '".$condicion." ')";
    }
}

?>
