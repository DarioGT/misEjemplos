
//PCLTabGrid ,clase que contiene grids tabeados y un store comun para todos estos
SM.PCLTabGrid=Ext.extend(Ext.TabPanel,{		
    constructor : function(config) {
        Ext.apply(this, config);
        SM.PCLTabGrid.superclass.constructor.apply(this, arguments);
        this.seleccion=0;
        if(!this.filtroQbe)this.filtroQbe='';
        this.store=new Ext.data.JsonStore({
            url: 'archivos/Grid/datos.php',
            root:'rows',
            totalProperty:'total',
            baseParams:{
                nemonico:this.nemo,
                filtro:this.filtro,
                filtroQbe:this.filtroQbe,
                aplicacion:aplicacion,
                usuario:usuario,
                SMkey:sky,
                SMses:ses,
                tipo:'pcl'
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
        Ext.Ajax.request({
            url: 'Archivos/TabGrid/tabs.php',
            method: 'POST',
            success: function(response){
                var resp=Ext.util.JSON.decode(response.responseText);
                var tb=tabGrid.add(new SM.PCLGrid({
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
                    tabGrid.add(new SM.PCLGrid({
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
        this.on('resize',function(Tg,newWidth,newHeight,oldWidth,oldHeight){
								
            });
    },
    initComponent: function(){
        this.title=this.nemo;
        // Before parent code
        SM.PCLTabGrid.superclass.initComponent.apply(this, arguments);// llamada al padre
    // Codigo Despues del la llamada al padre(para eventos o renderizado)
    },
    //activeTab : 0,
    width :600,
    autoHeight:true,
    region:'center',
    minSize: 200,
    deferredRender : false,
    maxSize: 300,
    link:false,
    defaults:null,
    selEvento:function(){},
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
    loadGridsFields:function(){
        for (i = 1; i < this.items.length; i++) {
            this.items['items'][i].cargarCampos();
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
    }

});//fin de la clase PCLTabGrid