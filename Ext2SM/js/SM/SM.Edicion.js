
SM.Edicion=Ext.extend(Ext.form.TriggerField,{
    initComponent : function(){
        SM.Edicion.superclass.initComponent.call(this);
        this.onTriggerClick=function(){
            if(!this.disabled)this.editar(this);
        }
    },
    setValue: function(text) {
        SM.Edicion.superclass.setValue.call(this, text);
    },
    editar:function(field){

        if(field.grid){
            field.grid.stopEditing();
        }

        var editWindow=new Ext.Window({
            heigth:200,
            width:300,
            modal:true,
            items:[{
                xtype:'textarea',
                height:200,
                width:300,
                value:field.getValue()
            }],
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
                        var value=editWindow.items.items[0].getValue();
                        field.setValue(value);
                        editWindow.close();
                        if(field.grid){
                            var cm = field.grid.getColumnModel();
                            var cel=field.grid.getSelectionModel().getSelectedCell();
                            var rec=field.grid.store.getAt(cel[0]);
                            rec.beginEdit();
                            rec.set(field.column,value);
                            rec.endEdit();
                        }
                    }
                }]
            })
        });
        field.editW=editWindow;
        editWindow.show();
        editWindow.items.items[0].focus(false,50);
    },
    triggerClass : "x-form-browse-trigger"
});

Ext.reg('edicion',SM.Edicion);