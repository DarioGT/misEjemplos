
Este poryecto maneja ( writer ) todas las posibilidades de edicion y control de errores del lado servidor 
y del lado cliente. 

manejar csrf  Ok
manejar errore de edicion Ok  
manejar login en forma independiente  Ok
 
manejar definicion de la forma de edicion 
manejar login como ventana  	
manejar autorizaciones por opciones 



-------------------------

Projeto apresentado na trilha de Javascript do TDC 2011
http://www.thedevelopersconference.com.br/tdc/2011/saopaulo/trilha-javascript#programacao
Sao Paulo - 07 de julho de 2011

Todas as dependencias estao incluidas:
Ext JS 4
Django 1.3

Antes de executar o projeto, execute o script sql/script.sql

----------------------------

La aplicacion corre directamente en js,  el template llama la aplicacion q esta en  static/js/app.js 
hay se contruye la forma y se hacen las llamadas a django para el manejo de los datos. 

En resumen 

	Django para el manejo de datos 
	Extjs para el cliente web 

Inicia directamente  en   

	http://127.0.0.1:8000/
	



--------------------------

MAnejar errores de retorno, 
Manejar csrf y verificar del lado servidor 
Manejar Login 