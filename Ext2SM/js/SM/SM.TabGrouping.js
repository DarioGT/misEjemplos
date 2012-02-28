
SM.TabGroupingGrid=Ext.extend(Ext.TabPanel,{
    constructor : function(config) {
        Ext.apply(this, config)
        SM.PCLTabGrid.superclass.constructor.apply(this, arguments);
        var tabGrid=this;
        this.seleccion=0;
        var ne=tabGrid.nemo;
        var filt=tabGrid.filtro;
        var cant=tabGrid.cantidadReg;
        Ext.Ajax.request({
            params:{
                aplicacion:aplicacion,
                nemonico:ne
            },
            url:'Archivos/Grouping/groupDef.php',
            success:function(response){
                var respGroup=Ext.decode(response.responseText);

                if(!tabGrid.filtroQbe)tabGrid.filtroQbe='';
                tabGrid.store=new Ext.ux.MultiGroupingStore({
                    url: 'archivos/Grid/datos.php',
                    groupField :respGroup.campoGroup,
                    baseParams:{
                        nemonico:tabGrid.nemo,
                        filtro:tabGrid.filtro,
                        filtroQbe:tabGrid.filtroQbe,
                        aplicacion:aplicacion,
                        usuario:usuario,
                        SMkey:sky,
                        SMses:ses,
                        tipo:'pcl'
                    },
                    reader:new Ext.data.JsonReader()
                });
                tabGrid.add({
                    hiden:true
                });
                var gridColumns=[];
                var i;
                for (i = 0; i <respGroup.campoGroup.length; i++) {
                    gridColumns.push({
                        hidden:true,
                        dataIndex :respGroup.campoGroup[i],
                        header:respGroup.campoGroup[i]
                    });
                }
                var sto=tabGrid.store;
                tabGrid.on('titlechange',function(panel,newTitle){
                    if(tabGrid.padre)tabGrid.padre.setTitle(newTitle);
                });
                var tabNemo=tabGrid.nemo;
                if(tabGrid.criterio){
                    tabNemo=tabGrid.criterio;
                }else{
                    if(tabGrid.link)tabNemo=tabGrid.nemo+'.'+tabGrid.padreLink;
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
                            vista:'group',
                            view:new Ext.ux.MultiGroupingView({
                                forceFit:true,
                                groupTextTpl: '{text}',
                                hideGroupedColumn : true,
                                showGroupName : true,
                                startCollapsed : true
                            }),
                            columns:gridColumns,
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
                                view:new Ext.ux.MultiGroupingView({
                                    forceFit:true,
                                    groupTextTpl: '{text}',
                                    hideGroupedColumn : true,
                                    showGroupName : false
                                }),
                                columns:gridColumns,
                                vista:'group',
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

                tabGrid.on('beforedestroy',function(){
                    tabGrid.store.removeAll();
                    tabGrid.store.destroy();
                    Ext.StoreMgr.remove(tabGrid.store);
                //Ext.destroy(tabGrid.store);
                });
                tabGrid.on('resize',function(Tg,newWidth,newHeight,oldWidth,oldHeight){

                    });
            }
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

});

