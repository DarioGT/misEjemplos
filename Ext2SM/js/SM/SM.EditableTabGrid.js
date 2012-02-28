
SM.EditableTabGrid=Ext.extend(Ext.TabPanel,{
    constructor : function(config) {
        Ext.apply(this, config);
        SM.EditableTabGrid.superclass.constructor.apply(this, arguments);
        this.seleccion=0;
        var criterioEventos=this.nemo;
        if(this.criterioEventos)criterioEventos=this.criterioEventos;
        this.store=new Ext.data.JsonStore({
            url: 'archivos/Grid/datos.php',
            root:'rows',
            totalProperty:'total',
            baseParams:{
                nemonico:this.nemo,
                filtro:this.filtro,
                aplicacion:aplicacion,
                usuario:usuario,
                SMkey:sky,
                SMses:ses,
                tipo:'pcl',
                criterioEventos:criterioEventos
            }
        });
        this.add({
            hiden:true
        });
        var tabGrid=this;
        var ne=this.nemo;
        var sto=this.store;
        var filt=this.filtro;
        var cant=this.cantidadReg;
        this.on('titlechange',function(panel,newTitle){
            if(this.padre)this.padre.setTitle(newTitle);
        });
        var tabNemo=this.nemo;
        if(this.criterio){
            tabNemo=this.criterio;
        }else{
            if(this.link)tabNemo=this.nemo+'.'+this.padreLink;
        }
        
        // DGT: Manejo de tabs,  lo q hace es cargar una grlla independiente con la conf de cols 
        // esto es ineficiente,  lo mejor seria tener el objeto de tabs arriba sin nada en el contenedor 
        // y utilizar los eventos para cambiar la conf de columnas.  
        // GriTab TabGrid TabPanel 
        Ext.Ajax.request({
            url: 'Archivos/TabGrid/tabs.php',
            method: 'POST',
            success: function(response){
                var resp=Ext.util.JSON.decode(response.responseText);
                var tb=tabGrid.add(new SM.EditableGrid({
                    store:sto,
                    padre:tabGrid,
                    defaults:tabGrid.defaults,
                    nemo:ne,
                    tipo:'pcl',
                    rowCant:cant,
                    link:tabGrid.link,
                    tabCr:tabNemo,
                    height:tabGrid.height-50,
                    title:resp[0].tab,
                    id:tabGrid.id+resp[0].tab+idTable,
                    filtro:filt,
                    selEvento:tabGrid.selEvento,
                    bbar:new Ext.PagingToolbar({
                        store:sto,
                        pageSize : cant,
                        displayInfo : true
                    })
                })).show();
                tabGrid.setActiveTab(tb);
                for (i=1; i<resp.length; i++)
                {
                    tabGrid.add(new SM.EditableGrid({
                        store:sto,
                        padre:tabGrid,
                        defaults:tabGrid.defaults,
                        nemo:ne,
                        rowCant:cant,
                        tipo:'pcl',
                        link:tabGrid.link,
                        tabCr:tabNemo,
                        height:tabGrid.height-50,
                        title:resp[i].tab,
                        id:tabGrid.id+resp[i].tab+idTable,
                        filtro:filt,
                        selEvento:tabGrid.selEvento,
                        bbar:new Ext.PagingToolbar({
                            store:sto,
                            pageSize:cant,
                            displayInfo : true
                        })
                    }));
                }
                idTable++;
            },
            failure: function(){
                alert('los tabs no han podido ser cargados')
            },
            timeout: 15000,
            params: {
                nemonico: ne ,
                criterio:tabNemo,
                aplicacion:aplicacion
            }
        });

        this.on('beforedestroy',function(){
            this.store.removeAll();
            this.store.destroy();
            Ext.StoreMgr.remove(this.store);
        //Ext.destroy(this.store);
        });
    },
    initComponent: function(){
        this.title=this.nemo;
        // Before parent code
        SM.EditableTabGrid.superclass.initComponent.apply(this, arguments);// llamada al padre
    // Codigo Despues del la llamada al padre(para eventos o renderizado)
    },
    //activeTab : 0,
    width :600,
    onEdit:false,
    autoHeight:true,
    region:'center',
    minSize: 200,
    maxSize: 300,
    deferredRender : false,
    link:false,
    defaults:null,
    selEvento:function(){},
    loadData:function(keepPosition){
        var start;
        if(keepPosition && this.store.lastOptions){
            start=this.store.lastOptions.params.start();
        }else{
            start=0;
        }
        this.store.removeAll();
        this.store.load({
            params:{
                start:start,
                limit:this.cantidadReg
            }
        });
    },
    addRecord:function(values){
        if(values){
            this.items['items'][1].agregar(values);
        }else{
            this.items['items'][1].agregar();
        }
    },
    setFiltro:function(newFiltro){
        this.store.baseParams.filtro=newFiltro;
    },
    getFiltro:function(){
        return this.store.baseParams.filtro;
    },
    setDefaultGridsHeight:function(){
        for (i = 1; i < this.items.length; i++) {
            this.items['items'][i].setDefaultHeight();
        }
    },
    setGridsHeight:function(height){
        for (i = 1; i < this.items.length; i++) {
            this.items['items'][i].setHeight(height);
        }
    },
    setDefaultsValues:function(defaults){
        for (i = 1; i < this.items.length; i++) {
            this.items['items'][i].defaults=defaults;
        }
    },
    makeEditables:function(){
        for (i = 1; i < this.items.length; i++) {
            this.items['items'][i].makeEditable();
        }
    },
    makeNoEditables:function(){
        for (i = 1; i < this.items.length; i++) {
            this.items['items'][i].makeNoEditable();
        }
    },
    loadGridsFields:function(){
        for (i = 1; i < this.items.length; i++) {
            this.items['items'][i].cargarCampos();
        }
    },
    setNewRecordsValue:function(name,value){
        //console.log(name+'='+value);
        this.store.each(function(record){
            if(record.__NewRec)record.set(name,value);
        });
        this.refreshGrids();
    },
    refreshGrids:function(){
        for (i = 1; i < this.items.length; i++) {
            this.items['items'][i].getView().refresh();
        }
    }

});//fin de la clase EditableTabGrid
