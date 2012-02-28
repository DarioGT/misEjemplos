
SM.SMZoom=Ext.extend(Ext.Window,{
    height:310,
    width:600,
    modal:true,
    constructor : function(config) {
        Ext.apply(this,config);
        var zoom=this;
        var filtro;
        if(this.filtro){
            filtro=this.filtro;
        }else{
            filtro='';
        }
        zoom.store=new Ext.data.JsonStore({
            url: 'archivos/Grid/datos.php',
            root:'rows',
            totalProperty:'total',
            baseParams:{
                nemonico:zoom.nemonico,
                filtro:filtro,
                aplicacion:aplicacion,
                usuario:usuario,
                tipo:'zoom',
                SMkey:sky,
                SMses:ses
            }
        });

        var zoomGrid=new SM.PCLGrid({
            store:zoom.store,
            padre:zoom,
            nemo:zoom.nemonico,
            rowCant:30,
            link:true,
            height:270,
            filtro:filtro,
            selEvento:null,
            tipo:'zoom',
            title:'basicas',
            bbar:new Ext.PagingToolbar({
                store:zoom.store,
                pageSize:30,
                displayInfo : true
            }),
            listeners:{
                rowdblclick:function(){
                    var registro=this.getSelectionModel().getSelected();
                    var registros=this.getSelectionModel().getSelections();
                    if(zoom.selectValue)zoom.selectValue(registro,zoom.store,registros);
                    zoom.close();
                },
                keydown:function(e){
                    if(e.getKey()==Ext.EventObject.ENTER){
                        var registro=this.getSelectionModel().getSelected();
                        var registros=this.getSelectionModel().getSelections();
                        if(zoom.selectValue)zoom.selectValue(registro,zoom.store,registros);
                        zoom.close();
                    }
                }
            }
        });

        Ext.apply(zoom,{
            items:[zoomGrid],
            bbar:new Ext.StatusBar({
                statusAlign: 'right',
                items:[
                {
                    icon:'images/accept.png',
                    cls:"x-btn-icon",
                    tooltip: {
                        text:'Aceptar'
                    },
                    handler:function(){
                        var registro=zoomGrid.getSelectionModel().getSelected();
                        var registros=zoomGrid.getSelectionModel().getSelections();
                        if(zoom.selectValue)zoom.selectValue(registro,zoom.store,registros);
                        zoom.close();
                    }
                }]
            })
        });
        SM.SMZoom.superclass.constructor.call(this, config);
    }
});