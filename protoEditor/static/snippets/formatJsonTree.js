/* 
 *  Este codigo lo hice para pasar la definicion de la meta a un treeStore a fin
 *  de editar la definicion directamente en la dB
 *  
 *  Pienso q es mejor generar directamente el objeto y no trabajar formateando texto 
 *  
 *  Mayo 15/2012  Dario Gomez 
 */ 

function FormatMETA( oData,  sIndent, pName, pType  ) {
    // FORMAT META for tree view  

    var sHTML = ''
    var sDataType = typeOf(oData);
    var sI2 = sIndent + '' ;

    // Solo deben entrar objetos o arrays 
    if (! (sDataType == "object"  ||  sDataType == "array")) return ''

    // El tipo solo viene cuando el padre es un array 
    if (! pType )  pType = pName 

    // formate la salida
    sHTML += sIndent + "{" 
    sHTML += sIndent + '"ptProperty": "' + pName + '",'
    sHTML += sIndent + '"ptType": "' +  pType  + '",'

    
    if ( sDataType == "object" ) {

        // Si es un objeto hay una propiedad q servira de titulo 
        var pTitle = pName ; 
        if ( oData['protoOption'] ) {
            pTitle = oData.protoOption  
        }

        sHTML += sIndent + '"ptTitle": "' +  pTitle + '",'
        // sHTML += sIndent + '"children": [' +  FormatMetaItem( oData, sI2 )  
        // sHTML += sIndent + "]," 
    } 


    // Verifica si tiene hijos 
    var bChilds = false 
    for (var sKey in oData) {
        var typeItem = typeOf(  oData[sKey] );
        if ( typeItem == "object"  || typeItem == "array" ) {
            bChilds = true;  
            break; 
        }
    }       

    // Genera los hijos o cierra el objeto 
    // Ya sean arrays u obejtos se deben manejar como hijos
    if ( ! bChilds ) { 

        // Es un array de eltos simples         oData.toString()  oData.join(',')
        if ( sDataType == "array" ) {
            sHTML += sIndent + '"ptValue": "' +  oData.toString() + '",'  
            sHTML += sIndent + '"children": []' 
            
        } else {
            // sHTML += sIndent + '"leaf": true'
        }       
        
    } else {

        sHTML += sIndent + '"children" : ['


        for (var sKey in oData) {
            var vValue = oData[ sKey  ]
            var typeItem = typeOf(vValue);

            // Solo procesa objetos o arrays 
            if (! (typeItem == "object"  ||  typeItem == "array")) continue 
            
            // PRegunta es por el objeto padre para enviar el tipo en los arrays    
            if ( sDataType == "object" ) {

                sHTML += FormatMETA(vValue, sI2, sKey  );

            } else if ( sDataType == "array" ) {
                
                var oTitle = pName + '.' + sKey 
                
                if ( pName == 'fields'  && vValue.name ) {
                    oTitle = vValue.name  
                } else if ( pName == 'protoFieldSet' ) {
                    oTitle = vValue.style
                }
                
                sHTML += FormatMETA(vValue, sI2, oTitle, pName   );

            }  
        }
    
        sHTML = VerifyColon( sHTML )
        sHTML += sIndent + "],"
        
    }

    sHTML = VerifyColon( sHTML )
    sHTML += sIndent + "}," 

    return sHTML;
}


function FormatMetaItem( oData , sIndent  ) {
    
    // Carga los valores de las propiedades basicas

    var sHTML = ''; 
    var sI2 = sIndent + '' ;
    
    for (var sKey in oData) {

        var vValue = oData[ sKey  ]
        var sDataType = typeOf(vValue);

        if (sDataType == "array"  || sDataType == "object" || sDataType == "null") continue 
        if ( sHTML )  { sHTML += ","; }

        sHTML += sIndent + "{"

        if (sDataType == "string" ) { 
            vValue = '"' + vValue.replace( '<', '&lt;').replace( '>', '&gt;') + '"'  
        }

        sHTML +=  sI2 + '"ptProperty" :"' + sKey + '",' 
        sHTML +=  sI2 + '"ptType" :"' + sDataType + '",'
        sHTML +=  sI2 + '"ptValue" :' + vValue.toString() + ',' 
        sHTML +=  sI2 + '"leaf": true'

        sHTML += sIndent + "}"

    };

    return sHTML 
}
    
