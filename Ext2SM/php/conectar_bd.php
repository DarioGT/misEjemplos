<?php
//Hecho por: Yulibeth
//odbc:israel
//xml:israel

class bd{
	private $con;
	function bd($bd="",$uid="",$pwd=""){
        if($bd==""){
            $config = simplexml_load_file("../config/web.config");
            $strings=$config->xpath("//configuration/connectionStrings/add");
            for($i=0;$i<count($strings);$i++){
                if($strings[$i]['name']=='SmSecure')$bd=$strings[$i]['value'];
            }
           //$config->close();
        }
        $bd=str_replace("ODBC;","",$bd);
        $bd=str_replace("odbc;","",$bd);
	$this->con = odbc_connect($bd,$uid,$pwd);
	}
	public function consulta($sql){
			$res=odbc_exec($this->con,$sql);
			return $res;
	}
	public function close(){
		odbc_close($this->con);
	}
}

?>