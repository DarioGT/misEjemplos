// DGT  ?? Mascara

SM.DocAuto = Ext.extend(Ext.Panel, {
    closable:true,
    iconCls : 'DocAuto-icon',
    plugins:new SM.BaseObject(),
    header: false,
    currentAction:'none',
    tabTip:'tab',
    onEdit:false,
    constructor:function(config){
        SM.DocAuto.superclass.constructor.call(this, config);
    },
    /*funcion initComponents,cualquier componenete agregado al panel debe ser agregado en el
	el metodo Ext.apply de esta funcion*/
    initComponent: function(){
        var ne=this.id;
        var DocAut=this;
        this.setTitle(ne);
        DocAut.origen=DocAut.parametrosOpciones.origen;
        Ext.Ajax.request({
            url:'Archivos/DocAuto/getDefinition.php',
            params:{
                nemonico:ne,
                aplicacion:aplicacion
            },
            success: function(response){
                var resp=Ext.util.JSON.decode(response.responseText);
                DocAut.setTitle(Ext.util.Format.ellipsis(resp.titulo, 15));
                if(resp.valid){
                    DocAut.Enc=new SM.TabForm({
                        region:'center',
                        heigth:300,
                        definicion:resp.defEncabezado
                    });
                    DocAut.heredados=resp.heredados;
                    DocAut.definicion=resp;
                    // Ext.fly(DocAut.getEl()).child('span.x-tab-strip-text', true).qtip = "New Tab tip text";
                    DocAut.barra=new Ext.Toolbar({
                        region:'north',
                        items:[{
                            icon:'images/page_add.png',
                            cls:"x-btn-icon",
                            tooltip: {
                                text:'Crea un nuevo Documento',
                                title:'Nuevo Documento'
                            },
                            handler:function(){
                                DocAut.Enc.items.items[0].setDisableFields(false);
                                var nr=SM.data.Record.create(DocAut.Enc.mapp);
                                DocAut.Enc.record=new nr(Ext.ux.clone(DocAut.Enc.mappValues));
                                DocAut.Enc.record.afterUpdate=function(name,value){
                                    DocAut.Enc.setRawValues(name,value);
                                    if(DocAut.heredados!=null){
                                        if(DocAut.heredados[name])DocAut.Det.setNewRecordsValue(DocAut.heredados[name].campoDet,value);
                                    }
                                }
                                DocAut.Enc.getForm().loadRecord(DocAut.Enc.record);
                                DocAut.Det.makeEditables();
                                DocAut.Enc.setOnEdit(true);
                                DocAut.Det.setFiltro("1=2");
                                DocAut.Det.loadData();
                                this.hide();
                                DocAut.barra.items.items[3].hide();
                                DocAut.barra.items.items[1].show();
                                DocAut.barra.items.items[2].show();
                                DocAut.currentAction='add';
                            }
                        },{
                            icon:'images/cancel.png',
                            cls:"x-btn-icon",
                            hidden:true,
                            handler:function(){
                                var cancelBtn=this;
                                Ext.MessageBox.confirm('Cancelar', 'Desea descartar los cambio del documento actual?',
                                    function(btn){
                                        if(btn=='yes'){
                                            DocAut.Enc.getForm().reset();
                                            DocAut.Enc.items.items[0].setDisableFields(true);
                                            DocAut.barra.items.items[0].show();
                                            DocAut.barra.items.items[3].show();
                                            DocAut.Det.makeNoEditables();
                                            DocAut.Det.store.rejectChanges();
                                            DocAut.Det.store.each(
                                                function(record){
                                                    if(record.__NewRec){
                                                        DocAut.Det.store.remove(record);
                                                    }
                                                });
                                            DocAut.Enc.setOnEdit(false);
                                            cancelBtn.hide();
                                            DocAut.barra.items.items[2].hide();
                                            DocAut.currentAction='none';
                                        }
                                    });
                            },
                            tooltip: {
                                text:'Cancela la Edicion Actual',
                                title:'Cancelar'
                            }
                        },{
                            icon:'images/database_save.png',
                            cls:"x-btn-icon",
                            hidden:true,
                            tooltip: {
                                text:'Guarda los cambios del documento Actual',
                                title:'Guardar'
                            },
                            handler:function(){
                                
                                if(DocAut.currentAction=='add'){
                                    var datosEnc=Ext.encode(DocAut.Enc.record.data);
                                    var farray=[];
                                    //var modif=DocAut.Det.store.getModifiedRecords();
                                    DocAut.Det.store.each(function(record) {
                                        farray.push(record.data);
                                    });
                                    var detalle=Ext.util.JSON.encode(farray);
                                    mascara.show();
                                    Ext.Ajax.request({
                                        url:'Archivos/DocAuto/guardar.php',
                                        params:{
                                            encabezado:datosEnc,
                                            detalle:detalle,
                                            nemonico:DocAut.id,
                                            accion:DocAut.currentAction,
                                            aplicacion:aplicacion,
                                            fuente:DocAut.tipDocu,
                                            periodo:DocAut.periodo
                                        },
                                        success:function(response){
                                            try{
                                                var resp=Ext.util.JSON.decode(response.responseText);
                                                var filtro=DocAut.definicion.campoIdentidad+"="+resp.id;
                                                if(resp.success){
                                                    Ext.Ajax.request({
                                                        url: 'Archivos/Zoom/validaZoom.php',
                                                        method: 'POST',
                                                        success: function(response){
                                                            var resp=Ext.util.JSON.decode(response.responseText);
                                                            if(eval(resp.found)){
                                                                mascara.hide();
                                                                var nr=SM.data.Record.create(DocAut.Enc.mapp);
                                                                DocAut.Enc.record=new nr(resp.registro);
                                                                DocAut.Enc.record.afterUpdate=function(name,value){
                                                                    DocAut.Enc.setRawValues(name,value);
                                                                    if(DocAut.heredados!=null){
                                                                        if(DocAut.heredados[name])DocAut.Det.setNewRecordsValue(DocAut.heredados[name].campoDet,value);
                                                                    }
                                                                }
                                                                DocAut.loadDoc(DocAut.Enc.record);
                                                                DocAut.currentAction='upd';
                                                            }
                                                        },
                                                        failure: function(){
                                                            mascara.hide();
                                                            Ext.MessageBox.alert('error','no se pudo cargar el registro');
                                                        },
                                                        timeout: 15000,
                                                        params: {
                                                            nemonico:DocAut.definicion.encabezado,
                                                            aplicacion:aplicacion,
                                                            filtro:filtro,
                                                            SMkey:sky,
                                                            SMses:ses
                                                        }
                                                    });
                                                }else{
                                                    mascara.hide();
                                                    Ext.Msg.alert('error',resp.razon);
                                                }
                                            }catch(e){
                                                mascara.hide();
                                                Ext.Msg.alert('error',e);
                                            }
                                           
                                        },
                                        failure:function(){
                                            mascara.hide();
                                            Ext.MessageBox.alert('Error','Error Al Guardar Documento')
                                        }
                                    });
                                }
                            }
                        },{
                            icon:'images/lupa.gif',
                            cls:"x-btn-icon",
                            tooltip: {
                                text:'Busca un Documento Existente',
                                title:'Filtrar'
                            },
                            handler:function(){
                                new SM.SMZoom({
                                    nemonico:resp.encabezado,
                                    filtro:resp.campoTipo+"='"+DocAut.tipDocu+"'",
                                    selectValue:function(record,store){
                                        var recType=SM.data.Record.create(store.fields);
                                        DocAut.Enc.record=new recType(record.data);
                                        DocAut.Enc.record.afterUpdate=function(name,value){
                                            DocAut.Enc.setRawValues(name,value);
                                            if(DocAut.heredados!=null){
                                                if(DocAut.heredados[name])DocAut.Det.setNewRecordsValue(DocAut.heredados[name].campoDet,value);
                                            }
                                        }
                                        DocAut.loadDoc(DocAut.Enc.record);
                                    }
                                }).show();
                            }
                        }
                        ]
                    });
                    DocAut.Det=new SM.EditableTabGrid({
                        nemo:resp.detalle,
                        DocAut:DocAut,
                        filtro:'1=2',
                        cantidadReg:30,
                        region:'south',
                        height:300,
                        criterio:ne+'_m',
                        criterioEventos:ne+'_m',
                        afterLoad:function(){
                            if(!DocAut.ready){
                                DocAut.doLayout();
                                DocAut.ready=true;
                            }
                        }
                    });
                    Ext.apply(DocAut,{
                        items:[DocAut.Enc,DocAut.Det,DocAut.barra]
                    });
                    DocAut.setLayout(new Ext.layout.BorderLayout());
                    SM.DocAuto.superclass.initComponent.apply(DocAut, arguments);
                    DocAut.doLayout();
                    var tipDocu;
                    var disableFuente;
                    if(resp.tipDocu=='*'){
                        tipDocu='';
                        disableFuente=false;
                    }else{
                        tipDocu=resp.tipDocu;
                        disableFuente=true;
                    }

                    var formParametros=new Ext.form.FormPanel(
                    {
                        frame:true,
                        buttonAlign:'left',
                        monitorValid:true,
                        items:[
                        new SM.ZoomField({
                            value:tipDocu,
                            fieldLabel:'Fuente',
                            zoomRef:'HCO_FUENTES',
                            name:'tipdocu',
                            zoomFilter:"origen='"+DocAut.origen+"'",
                            allowBlank:false,
                            disabled:disableFuente
                        }),
                        new SM.ZoomField({
                            fieldLabel:'Periodo',
                            name:'periodo',
                            zoomRef:'HCO_PERIODOS',
                            zoomFilter:"estado='0'",
                            allowBlank:false
                        })
                        ],
                        bbar:[
                        {
                            cls:"x-btn-icon",
                            icon: 'images/chulo.gif',
                            handler:function(){
                                if(formParametros.getForm().isValid()){
                                    DocAut.tipDocu=formParametros.getForm().findField('tipdocu').getValue();
                                    DocAut.periodo=formParametros.getForm().findField('periodo').getValue();
                                    winParametros.close();
                                }
                            }
                        },{
                            cls:"x-btn-icon",
                            icon: 'images/cancelar.gif',
                            width:10,
                            handler:function(){
                                //DocAut.destroy();
                                tabs.remove(DocAut);
                                winParametros.close();
                            }
                        }
                        ]
                    });

                    var winParametros=new Ext.Window({
                        height:120,
                        width:300,
                        modal:true,
                        closable:false,
                        items:[formParametros]
                    });
                    winParametros.show();
                    if(resp.botones!=null){
                        for (var i = 0; i < resp.botones.length; i++) {
                            var cls='';
                            var tTipTitle='';
                            var titulo=resp.botones[i].titulo;
                            if(resp.botones[i].imagen!=''){
                                cls="x-btn-icon";
                                tTipTitle=titulo;
                                titulo='';
                            }
                           

                            DocAut.barra.addButton({
                                text:titulo,
                                cls:cls,
                                handlerOnText:resp.botones[i].handler,
                                handler:function(){
                                    eval(this.handlerOnText)
                                },
                                icon:'images/'+resp.botones[i].imagen,
                                tooltip:{
                                    title:tTipTitle,
                                    text:resp.botones[i].toolTip
                                }
                            });
                           
                        }
                    }
                }else{
                    Ext.Msg.alert('error','El Objeto no pudo ser cargado');
                }
            }
        });     
        SM.DocAuto.superclass.initComponent.apply(this, arguments);
    },
    loadDoc:function(record){
        DocAut=this;
        DocAut.Enc.getForm().loadRecord(record);
        DocAut.Det.setFiltro(DocAut.definicion.foranea+"='"+record.get(DocAut.definicion.campoIdentidad)+"'");
        //console.log(DocAut.Det.store.baseParams.filtro);
        DocAut.Det.loadData();
    }
});
