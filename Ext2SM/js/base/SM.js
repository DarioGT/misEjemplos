var idTable=0;
var pest=0;
var opciones=new Array();
var tabs;
var PclActiva;
var TreeLoader;
var Tree_Category_Root;
var usuario;
var aplicacion;
var entorno;
var View;
var linkPanel;
var nav;
var ses;
var sky;
var NombreUsuario;
var NombreAplicacion;
var fechaServidor;
var userInside=false;
var mascara;
var UsrLogin;
var ValorPrompt='';


function beforeExit(){    
    if(userInside){
        alert('Su sesion se ha cerrado');
        Ext.Ajax.request({
            url: 'Archivos/Utilitarios/cerrarSesion.php',
            method: 'POST'
        });
    }
}
var buscar=new Ext.Button({
    icon:'images/lupa.gif',
    cls:"x-btn-icon",
    disabled:true,
    hidden:true,
    tooltip: {
        text:'Busca En La Tabla Actual',
        title:'Busqueda'
    },
    handler:function(){
        QBE(PclActiva.id,true,PclActiva.claseTab)
    }
});

var comando=function(){
    Ext.MessageBox.prompt('Comando', 'Digite El Comando',
        function(btn,nemo){
            if(btn=='ok'){
                ValorPrompt=nemo;
                opcion(nemo.toUpperCase());
            }
        },this,false,ValorPrompt);
}
var navStatus=new Ext.StatusBar({});


function abrePcl(nemonico,filtQbe,tabCls,filtro,opciones){
    if(!tabCls)tabCls=SM.PCLTabGrid;
    if(!filtro)filtro='';
    PclActiva=new SM.PCL({
        id: nemonico,
        title:nemonico,
        claseTab:tabCls,
        filtro:filtro,
        opciones:opciones,
        filtroQbe:filtQbe,
        height:View.getBox().height-115
    });
    tabs.add(PclActiva).show();
    pest++;
   /* buscar.enable();
    vimpresion.enable();
    buscar.show();
    vimpresion.show();*/
    nav.activate('links');
										
    PclActiva.on('activate',function(){
        nav.activate('links');
       /* buscar.enable();
        vimpresion.enable();
        buscar.show();
        vimpresion.show();*/
    });
										
    PclActiva.on('deactivate',function(){
        nav.activate('tree');
    });
										
    PclActiva.on('beforedestroy',function(){
        nav.activate('tree');
    });
										
}//fin de abre nemonico
								
function QBE(nemonico,PclFilt,tabCls,opciones){
    var fields=new Array();
    var ne=nemonico;
    if(!tabCls){
        tabCls=SM.PCLTabGrid;
    }
    var tipo='inicio';
    if(PclFilt)tipo='filtro';
    Ext.Ajax.request({
        url: 'Archivos/QBE/fields.php',
        method: 'POST',
        success: function(response){
            var resp=Ext.util.JSON.decode(response.responseText);
            var req=true;
            if(resp.success){
                resp=resp.campos;
                for (i=0; i<resp.length; i++)
                {
                    if(resp[i].qbe=='REQ'){
                        req=false;
                        resp[i].label='<b>'+resp[i].label+'</b>'
                    }
                    fields.push(new Ext.form.TextField({
                        fieldLabel: Ext.util.Format.capitalize(resp[i].label),
                        name: resp[i].datafield,
                        allowBlank:req
                    }));
                    req=true;
                }
                new SM.QBE({
                    campos:fields,
                    nemo:ne,
                    aceptar:function(qbe){
                        //console.log(qbe);
                        abrePcl(ne,qbe,tabCls,'',opciones);
                    }
                });
            }else{
                if(resp.razon=='QBE*')abrePcl(ne,'',tabCls,'',opciones);
            }
        },
        failure: function(response){
            alert('los campos no se han podido cargar');
        },
        timeout: 15000,
        params: {
            nemonico:ne,
            aplicacion:aplicacion,
            usuario:usuario,
            tipo:tipo
        }
    });
}//fin de QBE
	
var imprime=function (){
    var nemo=PclActiva.id;
    var filtro=PclActiva.filtro;
    var win = new Ext.Window({
        width:600,
        height:400,
        resizable: true,
        border: false,
        autoScroll:true,
        maximizable : true,
        minimizable:true,
        items:[{
            autoLoad:'Archivos/impresion/imprime.php?nemonico='+nemo+'&filtro='+filtro+'&aplicacion='+aplicacion
        }]
    });
    win.show();
}

var vimpresion=new Ext.Button({
    icon:'images/vista_previa.jpg',
    cls:"x-btn-icon",
    handler:imprime,
    tooltip: {
        text:'Vista De Impresion',
        title:'Vista Previa'
    },
    disabled:true,
    hidden:true
});
				
function showLink(nemo,campoPcl,campoLnk){
    PclActiva.addLink(nemo,campoPcl,campoLnk);
}

function independizar() {
    if(nav.items.length>1){
        if(PclActiva.link.items.length>0){
            var link=PclActiva.link.getActiveTab();
            abrePcl(link.nemo,'','',link.getFiltro())
        }
    }
}

var indep=new Ext.Button({
    cls:"x-btn-text-icon",
    text:'<b><font color="gray">independizar</font></b>',
    handler:independizar,
    icon:'images/ind.jpg',
    hidden:true
});

function opcion(nemonico){
    Ext.Ajax.request({
        url: 'Archivos/utilitarios/opciones.php',
        method: 'POST',
        success: function(response){
            //try{
            var resp=Ext.util.JSON.decode(response.responseText);
            
            if(resp.found){
                if(resp.clase=='SM.PCL'){
                    QBE(nemonico,false,false,resp);
                }else{
                    if(resp.clase=='Pcl-Group'){
                        QBE(nemonico,false,SM.TabGroupingGrid,resp);
                    }else{
                        var clase=eval(resp.clase);
                        var objeto=new clase({
                            id:nemonico,
                            parametrosOpciones:resp
                        });
                        objeto.SMRender();
                    }
                }
            }
        /*}catch (e) {
                Ext.Msg.alert('la opcion no se pudo cargar');
            }*/
        },
        failure: function(response){
            Ext.Msg.alert('la opcion no se pudo cargar');
        },
        timeout: 15000,
        params: {
            nemonico:nemonico,
            aplicacion:aplicacion,
            usuario:usuario
        }
    });
}
