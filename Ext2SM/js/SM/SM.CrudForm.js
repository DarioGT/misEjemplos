SM.CrudForm=Ext.extend(Ext.Window,{
    constructor:function(config){
        Ext.apply(this, config);
        SM.CrudForm.superclass.constructor.call(this,config);
    },
    initComponent: function(){
        cf=this;
        var visible;
        if(this.Action==0)visible=true; else visible=false;
        var create=Ext.data.Record.create(this.store.fields);
        if(this.Action==1){
            this.record=new create()
        }
        else{
            this.dataRecord=this.record;
            this.record=this.record.copy();
        }
        this.bbar=new Ext.StatusBar({
            statusAlign: 'right',
            items: [{
                icon:'images/anterior.gif',
                cls:"x-btn-icon",
                hidden:!visible,
                tooltip: {
                    text:'Anterior'
                },
                handler:function(){
                    cf.moveRecord(-1)
                }
            },

            {
                icon:'images/siguiente.gif',
                cls:"x-btn-icon",
                hidden:!visible,
                tooltip: {
                    text:'Siguiente'
                },
                handler:function(){
                    cf.moveRecord(1)
                }
            } ]
        });
        var fm=new Ext.form.FormPanel({
            frame:true
            ,
            border:false,
            monitorValid :true,
            baseParams:{
                SMAplicacion:aplicacion,
                SMEntorno:entorno,
                SMUsuario:usuario,
                SMNemonico:this.nemo,
                SMAction:this.Action,
                SMTabla:this.tabla,
                SMkey:sky,
                SMses:ses
            }
            ,
            url:'Archivos/CrudForm/guardar.php'
            ,
            items:[tp=new Ext.TabPanel({
                xtype:'tabpanel'
                ,
                activeItem:0,
                border:false,
                height:400,
                autoScroll:true,
                anchor:'100% 100%',
                deferredRender:false,
                listeners:{
                    render:function(){
                        this.items['items'][0].show();
                    }
                },
                defaults:{
                    layout:'form',
                    frame:true,
                    labelWidth:80,
                    defaultType:'textfield',
                    bodyStyle:'padding:5px'
                },
                items:cf.tabs
            })
            ],
            buttons:[
            {
                text:'Guardar'
                ,
                formBind: true
                ,
                handler:function() {
                    var cancel=false;
                    if(cf.store.reader.meta.eventos.beforeSave){
                        eval(cf.store.reader.meta.eventos.beforeSave);
                    }
                    if(!cancel){
                        cf.save();
                    }
                }
            },{
                text:'Cancelar'
                ,
                handler:function() {
                    cf.close();
                }
            }
            ],
            listeners:{
                
            },
            bindHandler : function(){
                var tabs=tp.items.items;
                //Ext.Msg.alert(tp.items.items[0].items.length);
                if(!this.bound){
                    return false;
                }
                var valid = true;
                for (i = 0; i < tabs.length; i++) {
                    tabs[i].items.each(function(f){
                        if(f.el.hasClass(f.invalidClass)){
                            valid = false;
                            return false;
                        }else{
                            if((!f.allowBlank)&&(f.getValue()=='')){
                                valid=false;
                                return false;
                            }
                        }
                    });
                }
                if(this.buttons){
                    for(var i = 0, len = this.buttons.length; i < len; i++){
                        var btn = this.buttons[i];
                        if(btn.formBind === true && btn.disabled === valid){
                            btn.setDisabled(!valid);
                        }
                    }
                }
            //this.fireEvent('clientvalidation', this, valid);
            }
        });
        fm.startMonitoring();
        this.form=fm;
        this.tabP=tp;
        cf.items=[this.form];
        SM.CrudForm.superclass.initComponent.apply(this, arguments);
    },
    save:function(){
        var cambiados='';
        cf=this;
        if(cf.Action==0){
            ftabs=cf.getTabs().items['items'];
            for (i = 0; i < ftabs.length; i++) {
                for (j = 0; j < ftabs[i].items['items'].length; j++) {
                    fld=ftabs[i].items['items'][j];
                    //fld.enable();
                    cf.record.set(fld.name,fld.getValue());
                }
            }

            cambios=cf.record.getChanges();
            for (var a in cambios) {
                cambiados+=a+',';
            }
            cambiados=cambiados.substr(0,cambiados.length-1);
        }
        cf.getForm().getForm().submit({
            clientValidation:false,
            waitTitle:'Autenticando',
            waitMsg:'Enviando Datos...',
            params:{
                SMCambios:cambiados
            },
            success:function(form,action){
                //Ext.Msg.alert("Guardado","Cambios Realizados ");
                if(cf.store.reader.meta.eventos.afterSave){
                    eval(cf.store.reader.meta.eventos.afterSave);
                }
                cf.grilla.cargar(true);
                cf.close();
            },
            failure:function(form,action){
                Ext.Msg.alert("error",action.result.razon);
            }
        }
        );
    },
    onRender: function(ct, position){
        SM.CrudForm.superclass.onRender.call(this, ct, position);
    },
    moveRecord:function(inc){
        index=this.store.indexOf(this.dataRecord);
        newIndex=index+inc;
        if(newIndex>this.store.getCount()-1){
            newIndex=0;
        }else{
            if(newIndex<0)newIndex=this.store.getCount()-1;
        }
        this.dataRecord=this.store.getAt(newIndex);
        this.record=this.dataRecord.copy();
        this.form.getForm().loadRecord(this.record);
    },
    setField:function(field,value){
        var ftabs=this.getTabs().items.items;
        for (i = 0; i < ftabs.length; i++) {
            var tabsN=ftabs[i].items['items'].length;
            for (j = 0; j < tabsN; j++) {
                // alert(ftabs[i].items.items);
                fld=ftabs[i].items['items'][j];
                if(fld.name==field){
                    fld.setValue(value);
                    j=tabsN;
                    i=ftabs.length;
                }
            }
        }
    },
    getField:function(field){
        ftabs=this.getTabs().items['items'];
        for (i = 0; i < ftabs.length; i++) {
            for (j = 0; j < ftabs[i].items['items'].length; j++) {
                fld=ftabs[i].items['items'][j];
                if(fld.name==field)return fld.getValue();
            }
        }
        return null;
    },
    getForm:function(){
        return this.form
    },
    getTabs:function(){
        return this.tabP
    },
    autoScroll:true,
    height:500,
    width:400,
    modal:true,
    frame:true,
    aceptar:function(){},
    cancelar:function(){},
    plain: true
});
