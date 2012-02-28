
SM.Zoom=Ext.extend(Ext.form.TriggerField,{
    initComponent : function(){
        SM.Zoom.superclass.initComponent.call(this);
        this.onTriggerClick=function(){
            if(!this.disabled)this.editar(this);
        }
        this.validateCount=0;
    },
    editar:function(field){
        var filtro=field.zoomFilter;
        var form=field.form;
        var filtFail=false;
        filtro=filtro.replace(/\{(\S+)\}/g,
            function(value){
                var campo=value.substring(1, value.length-1);
                var valor=form.getField(campo);
                if(valor=='')filtFail=true;
                return valor;
            }
            );
        
        if(!filtFail){
                    
            field.store=new Ext.data.JsonStore({
                url: 'archivos/Grid/datos.php',
                root:'rows',
                totalProperty:'total',
                baseParams:{
                    nemonico:field.zoomRef,
                    filtro:filtro,
                    aplicacion:aplicacion,
                    usuario:usuario,
                    tipo:'zoom',
                    SMkey:sky,
                    SMses:ses
                }
            });

            var zoomGrid=new SM.PCLGrid({
                store:field.store,
                padre:win,
                nemo:field.zoomRef,
                rowCant:30,
                link:true,
                height:270,
                width:487,
                imprime:false,
                exporta:false,
                filtro:filtro,
                selEvento:null,
                tipo:'zoom',
                bbar:new Ext.PagingToolbar({
                    store:field.store,
                    pageSize:30,
                    displayInfo : true
                }),
                listeners:{
                    rowdblclick:function(grid,index){
                        grid.selectValue();
                    },
                    keydown:function(e){
                        if(e.getKey()==Ext.EventObject.ENTER)this.selectValue();
                    }
                },
                selectValue:function(){
                    heredados=field.heredados;
                    var registro=this.getSelectionModel().getSelected();
                    var valor=registro.get(field.zoomKey);
                    field.setValue(valor);
                    win.close();
                }
            });

            var win=new Ext.Window({
                height:310,
                width:500,
                padre:null,
                modal:true,
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
                            win.items.items[0].selectValue()
                        }
                    }]
                })
            });
            win.show();
            zoomGrid.focus(100,false);
        }else{
            Ext.Msg.alert('Zoom','No se encontraron datos de ayuda');
        }
    },
    validate:function(){
       
        SM.Zoom.superclass.validate.call(this);
        if(this.getValue()!=''){
            var field=this;
            var form=field.form;
            var filt=this.zoomFilter;
            filt=filt.replace(/\{(\S+)\}/g,
                function(value){
                    var campo=value.substring(1, value.length-1);
                    ftabs=form.getTabs().items['items'];
                    return form.getField(campo);
                }
                );
            var filtro=this.zoomKey+"='"+this.getValue()+"'";
            if(filt!='')filtro=filtro+" and "+filt;
            if(this.validCount>0){
                this.markInvalid();
                Ext.Ajax.request({
                    url: 'Archivos/Zoom/validaZoom.php',
                    method: 'POST',
                    success: function(response){
                        var resp=Ext.util.JSON.decode(response.responseText);
                        if(eval(resp.found)){
                            field.clearInvalid();
                            registro=resp.registro;
                            if(field.heredados){
                                heredados=field.heredados;
                                for(k=0;k<heredados.length;k++){
                                    form.setField(heredados[k].campoHeredado,registro[heredados[k].campoZoom]);
                                }
                            }
                            if(field.eventos.validateField)eval(field.eventos.validateField);
                        }
                    },
                    failure: function(){
                        alert('No se ha podido Validar el campo')
                    },
                    timeout: 15000,
                    params: {
                        nemonico: field.zoomRef,
                        aplicacion:aplicacion,
                        filtro:filtro,
                        SMkey:sky,
                        SMses:ses
                    }
                });
            }
        }
        this.validCount++;
    }
});
Ext.reg('zoom',SM.Zoom);

