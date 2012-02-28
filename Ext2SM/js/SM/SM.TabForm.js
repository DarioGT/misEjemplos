
SM.TabForm=Ext.extend(Ext.form.FormPanel,{
    onEdit:false,
    constructor:function(config){
        Ext.apply(this,config);
        var def=this.definicion;
        var tabs=def.tabs;
        var fields=def.campos;
        var campos= new Ext.util.MixedCollection();
        this.defaults=new Array();
        this.mapp=new Array();
        this.mappValues=new Object();
        var tabForm=this;
        for (i = 0; i <fields.length; i++){
            var field=fields[i];
            var countV=0;
            var camp;
            var type;
            var per=true;
            var requerido=false;
            if(field.zoomRef!=''){
                type='zoomfield';
            }else{
                if(field.gtype=='DAT')type='datefield';
                if(field.gtype=='MEM')type='edicion';
                if(field.gtype=='TEX')type='textfield';
                if(field.gtype=='NUM')type='numberfield';
            }
            if(field.requerido==-1)requerido=true;
            if(!per)type='textfield';
            var listeners={};
            if(type!='zoomfield'){
                listeners.valid=function(){
                    if(this.getValue()!=tabForm.record.get(this.name)){
                        var cancel=false;
                        if(def.eventos.validateField)eval(def.eventos.validateField);
                        if(!cancel){
                            tabForm.record.set(this.name,this.getValue());
                        }else{
                            this.setValue(tabForm.record.get(this.name));
                        }
                    }
                };
            }else{
                listeners.validationComplete=function(record){
                    if(this.getValue()!=tabForm.record.get(this.name)){
                        var cancel=false;
                        if(def.eventos.validateField)eval(def.eventos.validateField);
                        if(!cancel){
                            tabForm.record.set(this.name,this.getValue());
                            if(this.heredados!=null){
                                for (var i = 0; i < this.heredados.length; i++) {
                                    tabForm.record.set(this.heredados[i].campoHeredado,record[this.heredados[i].campoZoom]);
                                }
                            }
                        }else{
                            this.setValue( tabForm.record.get(this.name));
                        }
                    }
                }
            }
            camp={
                inForm:false,
                validCount:countV,
                zoomKey:field.zoomKey,
                eventos:field.eventos,
                zoomFilter:field.zoomFilter,
                zoomRef:field.zoomRef,
                heredados:field.heredados,
                xtype: type,
                fieldLabel:field.label,
                name:field.name,
                width:200,
                disabled:true,
                number:field.number,
                allowBlank:!requerido,
                format:'d/m/Y',
                listeners:listeners,
                modifyFilter:function(filter){
                    return filter.replace(/\{(\S+)\}/g,
                        function(value){
                            var campo=value.substring(1, value.length-1);
                            var valor=tabForm.record.get(campo);
                            return valor;
                        }
                        );
                }
            };
            campos.add(camp.number,camp);
            if(Ext.util.Format.trim(field.vdefault)!='')tabForm.defaults.push({
                id:field.name,
                value:Ext.util.Format.trim(field.vdefault)
            });
            tabForm.mapp.push({
                name:field.name
            });
            tabForm.mappValues[field.name]=field.vdefault.trim();
        }
        var formTabs=new Array();
        for (i=0;i<tabs.length;i++) {
            var tabDef=tabs[i];
            var nombre=tabDef.nombre;
            var Fields=tabDef.definicion;
            var fldsR=new Array();
            var fldsL=new Array();
            for (j=0;j<Fields.length;j++) {
                if(j % 2){
                    fldsR.push(campos.get(Fields[j].numero));
                }else{
                    fldsL.push(campos.get(Fields[j].numero));
                }
                campos.get(Fields[j].numero).inForm=true;
            }
            var tab={
                title:nombre,
                autoScroll:true,
                setDisableFields:function(op){
                    this.items.items[0].setDisableFields(op);
                    this.items.items[1].setDisableFields(op);
                },
                //disable:true,
                items:[{
                    layout:'form',
                    columnWidth:.5,
                    items:fldsL,
                    setDisableFields:function(op){
                        var x=this.items.items.length;
                        var i;
                        for (i = 0; i < x; i++) {
                            this.items.items[i].setDisabled(op);
                        }
                    }
                },{
                    layout:'form',
                    columnWidth:.5,
                    items:fldsR,
                    setDisableFields:function(op){
                        var x=this.items.items.length;
                        var i;
                        for (i = 0; i < x; i++) {
                            this.items.items[i].setDisabled(op);
                        }
                    }
                }],
                labelWidth : 100,
                listeners:{
            /*show:function(){
                        this.items.items[0].setDisableFields(false);
                        this.items.items[1].setDisableFields(false);
                    }*/
            }
            };
            formTabs.push(tab);
        }

        campos.each(function(item){
            if(!item.inForm){
                item.xtype='hidden';
                item.disabled=false;
                formTabs[0].items.push(item)
            }
        });
        
        Ext.apply(this,{
            frame:true,
            items:[
            {
                setDisableFields:function(op){
                    var i;
                    for (i = 0; i < this.items.length; i++) {
                        this.items['items'][i].setDisableFields(op);
                    }
                },
                xtype:'tabpanel',
                activeItem:0,
                border:false,
                height:200,
                autoScroll:true,
                anchor:'100% 100%',
                deferredRender:false,
                listeners:{
                    render:function(){
                        this.items['items'][0].show();
                    },
                    tabchange:function(){
                        if(tabForm.isOnEdit())tabForm.getForm().loadRecord(tabForm.record);
                    }
                },
                defaults:{
                    layout:'column',
                    frame:true,
                    bodyStyle:'padding:5px'
                },
                items:formTabs
            }]
        });
        SM.TabForm.superclass.constructor.call(this, config);
        if(def.eventos.pclLoad)eval(def.eventos.pclLoad);
    },
    initComponent:function(){
        SM.TabForm.superclass.initComponent.apply(this, arguments);
    },
    setOnEdit:function(flag){
        this.onEdit=flag;
    },
    isOnEdit:function(){
        return this.onEdit;
    },
    setRawValues:function(name,value){
        this.getForm().items.each(function(f){
            if(f.isFormField && (f.dataIndex == name || f.id == name || f.getName() == name)){
                if(f.xtype=='datefield' && typeof value!='string'){
                    f.setRawValue(value.format('d/m/Y'));
                }else{
                    f.setRawValue(value);
                }
            }
        });
    }
});