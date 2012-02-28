function SMIni(usu,app,ent,Nusu,Napp,sess,k,date,Ulogin){
    userInside=true;
    NombreAplicacion=Napp;
    document.title=NombreAplicacion+' -SoftMachine Web';
    NombreUsuario=Nusu;
    usuario=usu;
    aplicacion=app;
    entorno=ent;
    ses=sess;
    sky=k;
    fechaServidor=date;
    usrLogin=Ulogin;
    Ext.Ajax.request({
        url: 'Archivos/Utilitarios/credenciales.php',
        method: 'POST',
        success: function(response){
            try{
                var resp=Ext.util.JSON.decode(response.responseText);
            }catch (e) {
                userInside=false;
                window.location.replace('errorCredenciales.html');
            }
            if(!resp.validate){
                userInside=false;
                window.location.replace('errorCredenciales.html');
            }
        },
        failure: function(){
            userInside=false;
            window.location.replace('errorCredenciales.html');
        },
        timeout: 15000,
        params: {
            SMkey:sky,
            SMses:ses,
            aplicacion:aplicacion,
            entorno:entorno,
            usuario:usuario
        }
    });
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
    /*var pagingBar = new Ext.PagingToolbar({
        pageSize: 5,
        store: store2,
        displayInfo: true,
        displayMsg: 'Mostrando {0} - {1} de {2}',
        emptyMsg: "Nada que mostrar!"
    });*/
    Ext.BLANK_IMAGE_URL='ext/resources/images/default/s.gif'
    mascara = new Ext.LoadMask(Ext.getBody(), {
        msg:"Espere Por Favor..."
    });
    mascara.show();
		
    TreeLoader = new Ext.tree.TreeLoader({
        dataUrl   :"archivos/Tree/loader.php",
        baseParams : {
            idaplicacion : aplicacion,
            usuario : usuario,
            identorno: entorno
        }
    });

    TreeLoader.on('load',function(loader,node){
        if(node.getDepth()==0)mascara.hide()
    });
    sel= new Ext.tree.DefaultSelectionModel({});
    var Tree_Category = new Ext.tree.TreePanel({
        title            : 'Opciones',
        collapsible      : false,
        animCollapse     : false,
        border           : true,
        id               : "tree",
        autoScroll       : true,
        animate          : true,
        enableDD         : true,
        containerScroll  : true,
        width            : 200,
        loader           : TreeLoader,
        header 		     : false,
        rootVisible 	 : false,
        selModel : sel ,
        region:'west',
        split       : true
    });
		
    Tree_Category_Root = new Ext.tree.AsyncTreeNode({
        text		: 'el nodo grande',
        draggable	: false,
        id		: '/' ,
        visible	:false
    });

    Tree_Category.setRootNode(Tree_Category_Root); 
    Tree_Category_Root.expand();

    Tree_Category.on("click", function(node) {
        if(node.attributes.topcion != 'M'){
            opcion(node.attributes.nemonico);
        }else{
            if(node.isExpanded()){
                node.collapse();
            }else{
                node.expand();
            }
            this.focus();
        }
    //tabs.setActiveTab(tab);
    });
            
    sel.on('selectionchange',function(sm,node){
        navStatus.setStatus({
            text: '<center><b>'+node.attributes.nemonico+'</b></center>',
            iconCls: 'x-status-custom',
            clear: true
        });

    });
		
    tabs = new Ext.TabPanel({
        region    : 'center',
        margins   : '3 3 3 0',
        activeTab : 0,
        defaults  : {
            autoScroll : true
        },
        items     : [{
            title    : 'SM Web'
        }],
        enableTabScroll:true,
        //barra de herramientas
        tbar:[buscar,vimpresion]//fin de la barra de herramientas
    });
		
    tabs.on("beforeremove", function(node) {
        if(tabs.items.length==2){
            buscar.disable();
            vimpresion.disable();
            buscar.hide();
            vimpresion.hide();
        }
    });
	
	
    tabs.on("beforetabchange",function(TabPanel,newTab,currentTab){
        PclActiva=newTab;
    } );
    // Panel for the west
    var linkStore=new Ext.data.JsonStore({
        url: 'archivos/Link/getLinks.php',
        fields: ['link', 'caption','tooltip','secuencia','campoPadre','campoLink','tipo']
    });
	 
    var tpl = new Ext.XTemplate(
        '<tpl for=".">',
        '<div class="thumb-wrap" id="{link}">',
        '<div class="thumb"><center><a href="javascript:;" onClick=Ext.get(this).highlight("0000ff",{attr:"background-color",easing:"easeIn",duration:1});showLink("{link}","{campoPadre}","{campoLink}");><img src="images/link.gif"></center></div></a>',
        '<span class="x-editable"><center><font color="66666"  size=2><font size=3>{#}.</font>{caption}</font></center></span></div>',
        '</tpl>',
        '<div class="x-clear"></div>'
        );

    linkView=new Ext.DataView({
        store: linkStore,
        tpl: tpl,
        autoHeight:true,
        multiSelect: false,
        overClass:'x-view-over',
        itemSelector:'div.thumb-wrap',
        loadingText : 'Cargando Links'
    });
    linkPanel=new Ext.Panel({
        title:'links',
        id:'links',
        autoHeight:true,
        layout:'fit',
        items: linkView,
        tbar:[indep]
    });
	
    linkPanel.on('activate',function(){
        indep.hide();
        linkStore.removeAll();
        linkStore.load({
            params:{
                nemonico:PclActiva.id,
                aplicacion:aplicacion
            },
            callback:function(){
                if(this.getCount()>0){
                    indep.show();
                }else{
                    nav.setActiveTab('tree');
                }
            }
        });
        linkView.refresh();
    });

		
    nav = new Ext.TabPanel({
        region      : 'west',
        split       : true,
        width       : 200,
        collapsible : true,
        collapseMode:'mini',
        margins     : '3 0 3 3',
        cmargins    : '3 3 3 3',
        autoScroll       : true,
        items : [Tree_Category,linkPanel],
        tbar:[{
            icon:'images/comando.png',
            cls:"x-btn-icon",
            tooltip: {
                text:'Ejecuta un Comando Conocido',
                title:'Comando'
            },
            handler:comando
        },{
            icon:'images/reload.png',
            cls:'x-btn-icon',
            tooltip:{
                text:'recarga el arbol de opciones',
                title:'recargar menu'
            },
            handler:function(){
                TreeLoader.load(Tree_Category_Root);
            }
        },{
            icon:'images/apagar.gif',
            cls:"x-btn-icon",
            tooltip: {
                text:'Cierra la sesion de forma segura',
                title:'Salida Segura'
            },
            handler:function(){
                Ext.MessageBox.confirm('Cerrar Sesion', 'Desea cerrar la sesion actual', function(btn){
                    if(btn=='yes'){
                        userInside=false;
                        mascara.show();
                        Ext.Ajax.request({
                            url: 'Archivos/Utilitarios/cerrarSesion.php',
                            method: 'POST',
                            params: {
                                SMkey:sky,
                                SMses:ses
                            },
                            success:function(){
                                location.reload();
                            }
                        });
                    }
                })
            }
        }],
        bbar:navStatus,
        activeTab : 0,
        tabPosition : 'bottom'
    });
		
    var status=new Ext.StatusBar({
        region:'south',
        defaultText: '<b>Usuario :</b>'+NombreUsuario
    });
    View = new Ext.Viewport({
        title    : 'SmWeb',
        closable : false,
        //height   : 575,
        border : true,
        plain    : true,
        layout   : 'border',
        items    : [nav,tabs,status],
        renderTo: 'panel',
        autoWidth : true
    });
		
    var map = new Ext.KeyMap(document, {
        key: 'f',
        shift:true,
        fn: function(){
            if(!buscar.disabled)buscar.handler();
        },
        scope: this
    }
    );
		
    map.addBinding({
        key: Ext.EventObject.F2,
        shift:true,
        fn: comando,
        scope: this
    });
					
}///fin del onReady
