SM.PCLGrid=Ext.extend(Ext.grid.GridPanel,{
	
	
    constructor:function(config){
        SM.PCLGrid.superclass.constructor.call(this,config);
        this.camposCargados=false;
        var grid=this;
        var ne=this.nemo;
        var tab=this.title;
        this.heightInicial=this.height;
        this.suspendEvents();
        this.sm=new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.getView().on('refresh',function(){
            if(grid.padre){
                grid.getSelectionModel().selectRow(grid.padre.seleccion,false);
                grid.getView().focusRow(grid.padre.seleccion);
            }else{
                grid.getSelectionModel().selectFirstRow();
            }
        });
        this.getSelectionModel().on('rowselect',function(SM,Number,record){
            if(grid.padre){
                grid.padre.seleccion=Number;
                if(!grid.link){
                    grid.selEvento(SM,Number,record);
                }
            }
        });
        var tabCri=ne;
        if(this.link){
            if(this.tabCr)tabCri=this.tabCr;
        }
        if(grid.padre){
            if(grid.padre.criterio){
                tabCri=grid.padre.criterio;
            }
        }
        Ext.Ajax.request({
            url: 'Archivos/Grid/fields.php',
            method: 'POST',
            success: function(response){
                var resp = Ext.util.JSON.decode(response.responseText);
                grid.campos=resp;
                if(grid.isVisible())grid.cargar();
                grid.resumeEvents();
            },
            failure: function(){
                alert('los campos no se han podido cargar');
            },
            timeout: 15000,
            params: {
                criterio:tabCri,
                nemonico:ne,
                tab:tab,
                aplicacion:aplicacion
            }
        });
	
        this.on('activate',function(panel){
            if(!this.camposCargados)this.cargarCampos();
        });
        this.on('deactivate',function(){

            });
        this.on('destroy',function(grid){
            Ext.ComponentMgr.unregister(grid)
        });

    },
    Crud:function(accion,ignoreCancel){
        var grid=this;
        var fields=this.store.fields.items;
        var tabla=this.store.reader.meta.tabla;
        var campos= new Ext.util.MixedCollection();
        var eventos=this.store.reader.meta.eventos;
        if(accion==1){
            countV=1
        }else{
            countV=0
        }
        var fm;
        var Crud;
        for (i = 0; i <fields.length; i++) {
            field=fields[i];
            var camp;
            var type;
            var per=true;
            var cls='';
            var requerido=false;
            var vDef=field.vdefault;
            vDef=vDef.replace(/\{(\S+)\}/g,
                function(value){
                    var campo=value.substring(1, value.length-1);
                    var valor=campo;
                    if(campo.charAt(0)=='@'){
                        if(campo=='@usuario')valor=NombreUsuario;
                        if(campo=='@idUsuario')valor=usuario;
                        if(campo=='@login')valor=usrLogin;
                    }/*else{
                        valor=form.getField(campo);
                        if(valor=='')filtFail=true;
                    }*/
                    return valor;
                }
                );
                
            if(this.link){
                for (var v in this.defaults) {
                    if(v==field.name)vDef=this.defaults[v];
                }
            }
            //if(eval(field.show)){
            //if(field.vdefault=='')field.vdefault=null;
            if(field.zoomRef!=''){
                type='zoom';
            }else{
                if(field.type=='date')type='datefield';
                if(field.gtype=='MEM')type='edicion';
                if(field.gtype=='TEX')type='textfield';
                if(field.gtype=='NUM')type='numberfield';
            }
            if(field.requerido==-1)requerido=true;
            if(field.permisos=='RO'){
                per=false;
                cls='x-item-disabled';
            }else {
                if(accion==1){
                    if(field.permisos=='UO'){
                        per=false; cls='x-item-disabled';
                    }
                }else{
                    if(field.permisos=='IO'){
                        per=false; cls='x-item-disabled';
                    }
                }
            }
            if(!per)type='textfield';
            camp={
                inForm:false,
                dValue :vDef,
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
                cls:cls,
                readOnly:!per,
                number:field.number,
                allowBlank:!requerido,
                format:'d/m/Y',
                listeners: {
                    valid: function(c) {
                        Ext.QuickTips.register({
                            target: c.getEl(),
                            text: Ext.util.Format.ellipsis(c.getValue(),1024),
                            title:c.fieldLabel,
                            dismissDelay: 900000
                        });
                        //Crud.record.set(c.name,c.getValue());
                        ftabs=Crud.getTabs().items['items'];
                        for (i = 0; i < ftabs.length; i++) {
                            for (j = 0; j < ftabs[i].items['items'].length; j++) {
                                fld=ftabs[i].items['items'][j];
                                if(c.name==fld.name){
                                    if(c!=fld){
                                        fld.setRawValue(c.getValue());
                                        Ext.QuickTips.register({
                                            target: fld.getEl(),
                                            text: Ext.util.Format.ellipsis(fld.getValue(),1024),
                                            title:fld.fieldLabel,
                                            dismissDelay: 900000
                                        });
                                    }
                                }
                            }
                        }
                        if(c.xtype!='zoom'){
                            if(c.validCount>0){
                                if(c.eventos.validateField)eval(c.eventos.validateField);
                            }
                            c.validCount++;
                        }
                                                        
                    },
                    render : function(){
                        this.form=Crud;
                        cf=Crud;
                        if(this.dValue!='')this.setRawValue(this.dValue);
                        if(this.eventos.blur){
                            this.on('blur',function(campo){
                                eval(this.eventos.blur);
                            });
                        }
                    }
                }
            };
            /* }else{
                       camp={name:field.name,xtype: 'hidden'};
                   }*/
            campos.add(camp.name,camp);
        }

        tabG=this.padre.items.items;
        var formTabs=new Array();
        for (i=1;i<tabG.length;i++) {
            var gr=tabG[i];
            var fields=new Array();
            if(gr.camposCargados){
                var columns=gr.getColumnModel().getColumnsBy(
                    function (columna, index)
                    {
                        if (columna.hidden)
                            return false;
                        else
                            return true;
                    } );
                for (j=1;j<columns.length;j++) {
                    fields.push(campos.get(columns[j].dataIndex));
                    campos.get(columns[j].dataIndex).inForm=true;
                }
            }else{
                fieldDef=gr.campos;
                for (j=0;j<fieldDef.length;j++) {
                    fields.push(campos.get(fieldDef[j].datafield));
                    campos.get(fieldDef[j].datafield).inForm=true;
                }
            }
            var tab={
                title:gr.title,
                items:fields,
                labelWidth : 100,
                autoScroll:true,
                listeners:{
                    show:function(){
                        this.items.items[0].focus(false,50);
                    }
                }
            };
            formTabs.push(tab);
        }
        campos.each(function(item,index,lenght){
            if(!item.inForm){
                item.xtype='hidden';
                formTabs[0].items.push(item);
            }
        });
        var seleccion=this.getSelectionModel().getSelected();
        var cancel=false;
        if(!ignoreCancel){
            var row=seleccion;
            //console.log(eventos.beforeEdit);
            if(eventos.beforeEdit)eval(eventos.beforeEdit);
        }
        if(!cancel){
            Crud=new SM.CrudForm({
                tabs:formTabs,
                nemo:this.nemo,
                store:this.store,
                record:seleccion,
                Action:accion,
                tabla:tabla,
                grilla:this
            });
            Crud.show();
            if(accion==0)Crud.getForm().getForm().loadRecord(seleccion);
        }
    },
    onRender: function(ct, position){
        SM.PCLGrid.superclass.onRender.call(this, ct, position);
        var grid=this;
         
        /*this.addEvents("beforetooltipshow");
          this.tooltip = new Ext.ToolTip({
	        	renderTo: Ext.getBody(),
	        	target: this.view.mainBody,
                dismissDelay: 0,
	        	listeners: {
	        		beforeshow: function(qt) {
	        			var v = this.getView();
			            var row = v.findRowIndex(qt.baseTarget);
			            var cell = v.findCellIndex(qt.baseTarget);
			            this.fireEvent("beforetooltipshow", this, row, cell);
	        		},
	        		scope: this
	        	}
	        })

          this.on("beforetooltipshow",function(grid, row, col){
              var record=grid.store.getAt(row);
              var index=grid.getColumnModel().getDataIndex(col);
              grid.tooltip.body.update(record.get(index));
          });*/
        this.getBottomToolbar().addSeparator();

        this.getBottomToolbar().addButton({
            icon:'images/arrow_up.png',
            cls:"x-btn-icon",
            tooltip: {
                text:'Sube Un Registro',
                title:'Registro Anterior'
            },
            handler:function(){
                grid.getSelectionModel().selectPrevious();
            }
        });

        this.getBottomToolbar().addButton({
            icon:'images/arrow_down.png',
            cls:"x-btn-icon",
            tooltip: {
                text:'Baja Un Registro',
                title:'Siguiente Registro'
            },
            handler:function(){
                grid.getSelectionModel().selectNext();
            }
        });

        this.getBottomToolbar().addSeparator();
       
        this.getBottomToolbar().addButton({
            icon:'images/lupa.gif',
            cls:"x-btn-icon",
            tooltip: {
                text:'Busca En La Tabla Actual',
                title:'Busqueda'
            },
            handler:function(){
                grid.showQbe();
            }
        });
        if(this.imprime){
            this.getBottomToolbar().addButton({
                icon:'images/printer.png',
                cls:"x-btn-icon",
                tooltip: {
                    text:'imprime los datos en pantalla a una salida html(Asegurese de tener habilitados los popups de su Explorador)',
                    title:'Imprimir Tablas'
                },
                handler:function(){
                    grid.impresion();
                }
            });
        }
        if(this.exporta){
            this.getBottomToolbar().addButton({
                icon:'images/page_lightning.png',
                cls:"x-btn-icon",
                tooltip: {
                    text:'Exportar la Tabla a diversos formatos',
                    title:'Exportar'
                },
                menu:[{
                    icon:'images/page_excel.png',
                    cls:"x-btn-icon",
                    text:'Excel',
                    tooltip: {
                        text:'Exporta la tabla Actual a un libro Microsoft Excel',
                        title:'Exportar a Excel'
                    },
                    handler:function(){
                        grid.exportaExcel();
                    }
                },{
                    icon:'images/page_word.png',
                    cls:"x-btn-icon",
                    text:'Word',
                    tooltip: {
                        text:'Exporta la tabla Actual a un documento Microsoft Word',
                        title:'Exportar a Excel'
                    },
                    handler:function(){
                        grid.exportaExcel('word');
                    }
                }]
            });
        }
        this.getBottomToolbar().addSeparator();
        //var botonAdicion=new

        this.add=new Ext.Toolbar.Button({
            icon:'images/add.png',
            cls:"x-btn-icon",
            tooltip: {
                text:'Adiciona Un Registro',
                title:'Agregar'
            },
            handler:function(){
                if(grid.store.reader.meta.add!=0)grid.Crud(1);
            }
        });

        this.upd=new Ext.Toolbar.Button({
            icon:'images/editar-formulario.png',
            cls:"x-btn-icon",
            tooltip: {
                text:'Edita El Registro Seleccionado',
                title:'Editar'
            },
            handler:function(){
                if(grid.store.reader.meta.upd!=0)grid.Crud(0);
            }
        });

        this.del=new Ext.Toolbar.Button({
            icon:'images/delete.png',
            cls:"x-btn-icon",
            tooltip: {
                text:'Borra Un Registro',
                title:'Eliminar'
            },
            handler:function(){
                if(grid.store.reader.meta.del!=0)grid.eliminar();
            }
        });
                               
        this.getBottomToolbar().addButton(this.add);

        this.getBottomToolbar().addButton(this.upd);

        this.getBottomToolbar().addButton(this.del);

    },
    cargar:function(keepPosition){
        var grid=this;
        var start=0;
        //if(keepPosition)start=this.store.lastOptions.start;
        if(keepPosition)if(this.store.lastOptions)start=this.store.lastOptions.params.start;
        this.store.removeAll();
        this.store.load({
            params:{
                start:start,
                limit:grid.rowCant
            },
            callback :function(){
                
                if(grid.tipo=='zoom'){
                    grid.add.hide();
                    grid.upd.hide();
                    grid.del.hide();
                }else{
                    grid.padre.setTitle(this.reader.meta.titulo);
                    if(this.reader.meta.add==0)grid.add.hide();
                    if(this.reader.meta.upd==0)grid.upd.hide();
                    if(this.reader.meta.del==0)grid.del.hide();
                }
                //grid.add.hide();
                //grid.del.hide();

                if(!grid.camposCargados){
                    if(grid.padre){
                        if(grid.padre.afterLoad)grid.padre.afterLoad();
                        if(grid.padre.loadGridsFields){
                            grid.padre.loadGridsFields();
                        }else{
                            grid.cargarCampos();
                        }
                    }else{
                        grid.cargarCampos();
                    }
                }
            }
        });
    },
    
    // DGT :  Esta es la funcion q monta la estructura de la grilla 
    
    cargarCampos:function(){
        var grid=this;
        if(grid.store.reader.meta.eventos.pclLoad)eval(grid.store.reader.meta.eventos.pclLoad);
        if(grid.store.reader.meta.eventos.rowRender){
            rowRender=grid.store.reader.meta.eventos.rowRender;
            grid.getView().getRowClass = function(row, index,rowParams,store) {
                clas='';
                eval(rowRender);
                //store.commitChanges();
                return clas;
            }
        }
        var fields  =   [];
        fields[0]=new Ext.grid.RowNumberer({
            header:'<b>N</b>',
            width:30
        });
        var index   =   0;
        var hide=true;
        var campo;
        var colRend;

        if(grid.campos[0].field!=10000){
            for(i=0; i<grid.campos.length; i++){
                for(j=0;j<grid.store.fields.items.length ;j++) {
                    campo=grid.store.fields.items[j];
                    hide=false;
                    if(campo.number==grid.campos[i].field){
                        campo.inside=true;
                        if(!eval(campo.show))hide=true;
                        if(campo.eventos.columnRender){
                            colRend=campo.eventos.columnRender;
                        }else{
                            colRend='';
                        }

                        var editor=new Ext.form.TextField({});;
                        if(campo.type=='date')editor=new Ext.form.DateField({});
                        if(campo.gtype=='MEM')editor=new SM.Edicion({
                            grid:grid,
                            column:campo.name
                        });
                        if(campo.gtype=='TEX')editor=new Ext.form.TextField({});
                        if(campo.gtype=='NUM')editor=new Ext.form.NumberField({});

                        fields[index+1]={
                            editor:editor,
                            colRend:colRend,
                            header: campo.title,
                            dataIndex: campo.name,
                            hidden : hide,
                            width: grid.campos[i].ancho,
                            tooltip:campo.tip.trim(),
                            sortable:true,
                            allowBlank:false,
                            hideable : eval(campo.show),
                            renderer:function(value,metaData,row,rowIndex,colIndex,store){
                                var idField = grid.getColumnModel().getColumnId(colIndex);
                                var column=grid.getColumnModel().getColumnById(idField);
                                eval(column.colRend);
                                return '<div qtip="' + '<span>'+Ext.util.Format.ellipsis(value,1200)+'</span>' +'">'+ value +'</div>';
                            }
                        };
                        if(campo.type=='date')fields[index+1].renderer=renderDate;
                        index++;
                    }
                }
            }
        }
        hide=true;

        for(j=0;j<grid.store.fields.items.length ;j++) {
            campo=grid.store.fields.items[j];
            if(!campo.inside){
                width=campo.width;
                for(i=0; i<grid.campos.length; i++){
                    if(campo.number==grid.campos[i].field) {
                        hide=false;
                        width=grid.campos[i].ancho;
                    }else{
                        if(grid.campos[0].field==10000)hide=false;
                    }
                }
                if(!eval(campo.show))hide=true;
                if(campo.eventos.columnRender){
                    colRend=campo.eventos.columnRender;
                }else{
                    colRend='';
                }

                var editor=new Ext.form.TextField({});
                if(campo.type=='date')editor=new Ext.form.DateField({});
                if(campo.gtype=='MEM')editor=new SM.Edicion({
                    grid:grid,
                    column:campo.name
                });
                if(campo.gtype=='TEX')editor=new Ext.form.TextField({});
                if(campo.gtype=='NUM')editor=new Ext.form.NumberField({});

                fields[index+1]={
                    editor:editor,
                    colRend:colRend,
                    header: campo.title,
                    dataIndex: campo.name,
                    hidden : hide,
                    width: width,
                    tooltip:campo.tip.trim(),
                    sortable:true,
                    hideable : eval(campo.show),
                    renderer:function(value,metaData,row,rowIndex,colIndex,store){
                        // alert(this.eventos);
                        var idField = grid.getColumnModel().getColumnId(colIndex);
                        var column=grid.getColumnModel().getColumnById(idField);
                        eval(column.colRend);
                        return value;
                    }
                };
                if(campo.type=='date')fields[index+1].renderer=renderDate;
                index++;
                hide=true;
            }
        }


        columnas  =   new Ext.grid.ColumnModel(fields);
        grid.reconfigure(grid.store,columnas);
        grid.camposCargados=true;
        grid.getView().refresh();
    },
    eliminar:function(){
        var grid=this;
        Ext.MessageBox.confirm('Borrar', 'Desea eliminar los registros seleccionados?', function(btn){
            if(btn=='yes'){
                var str='';
                var seleccion=grid.getSelectionModel().getSelections();
                var llave=grid.store.reader.meta.dbkey;
                var tabla=grid.store.reader.meta.tabla;
                for (i = 0; i < seleccion.length; i++) {
                    str+="'"+seleccion[i].get(llave)+"',";
                }
                str=str.substring(0,str.length-1);
                mascara.show();
                Ext.Ajax.request({
                    url:'Archivos/Utilitarios/delete.php',
                    params:{
                        keys:str,
                        llave:llave,
                        tabla:tabla,
                        nemonico:grid.nemo,
                        aplicacion:aplicacion,
                        entorno:entorno,
                        SMkey:sky,
                        SMses:ses
                    },
                    success:function(response){
                        mascara.hide();
                        var resp=Ext.util.JSON.decode(response.responseText);
                        if(resp.commit){
                            grid.cargar(true);
                        }else{
                            Ext.Msg.alert('error',resp.razon);
                        }
                    },
                    failure:function(){
                        mascara.hide();
                        Ext.Msg.alert('error','no se puede conectar al servidor');
                    }
                });
            }
        });
      
    },
    setDefaultHeight:function(){
        this.setHeight(this.heightInicial)
    },
    showQbe:function(){
        var grid=this;
        var fields=new Array();

        Ext.Ajax.request({
            url: 'Archivos/QBE/fields.php',
            method: 'POST',
            success: function(response){
                var resp=Ext.util.JSON.decode(response.responseText);
                var req=true;
                if(resp.success){
                    resp=resp.campos;
                    for (i=0; i<resp.length; i++)
                    {
                        if(resp[i].qbe=='REQ'){
                            req=false;
                            resp[i].label='<b>'+resp[i].label+'</b>'
                        }
                        fields.push(new Ext.form.TextField({
                            fieldLabel: Ext.util.Format.capitalize(resp[i].label),
                            name: resp[i].datafield,
                            allowBlank:req
                        }));
                        req=true;
                    }
                    new SM.QBE({
                        campos:fields,
                        nemo:grid.nemo,
                        aceptar:function(qbe){
                            grid.setFiltroQbe(qbe);
                            grid.cargar();
                        }
                    });
                }
            },
            failure: function(response){
                alert('los campos no se han podido cargar');
            },
            timeout: 15000,
            params: {
                nemonico:grid.nemo,
                aplicacion:aplicacion,
                usuario:usuario,
                tipo:'filtro'
            }
        });

    },
    exportaExcel:function(formato){
        var st=this.store.baseParams;
        if(!formato)formato='Excel';
        var columns=this.getColumnModel().getColumnsBy(
            function (columna, index)
            {
                if (columna.hidden)
                    return false;
                else
                    return true;
            } );
        var colArray=[];
        for (i = 1; i < columns.length; i++) {
            colArray.push(columns[i].dataIndex)
        }
        var strCol=Ext.encode(colArray);
        window.open('Archivos/impresion/'+formato+'.php?nemonico='+st.nemonico+'&aplicacion='+st.aplicacion+'&filtro='+st.filtro+'&filtroQbe='+st.filtroQbe+'&columnas='+strCol);
    },
    impresion:function(){
        var st=this.store.baseParams;
        var columns=this.getColumnModel().getColumnsBy(
            function (columna, index)
            {
                if (columna.hidden)
                    return false;
                else
                    return true;
            } );
        var colArray=[];
        for (i = 1; i < columns.length; i++) {
            colArray.push(columns[i].dataIndex)
        }
        var strCol=Ext.encode(colArray);
        window.open('Archivos/impresion/imprime.php?nemonico='+st.nemonico+'&aplicacion='+st.aplicacion+'&filtro='+st.filtro+'&filtroQbe='+st.filtroQbe+'&columnas='+strCol);
    },
    setFiltroQbe:function(fQbe){
        this.store.baseParams.filtroQbe=fQbe;
    },
    listeners:{
        rowdblclick:function(){
            if(this.store.reader.meta.upd!=0)this.Crud(0);
        },
        keydown :function(e){
            if(e.getKey()==Ext.EventObject.INSERT){
                if(this.store.reader.meta.add!=0)this.Crud(1);
            }

            if(e.getKey()==Ext.EventObject.ENTER){
                if(this.store.reader.meta.upd!=0)this.Crud(0);
            }

            if(e.getKey()==Ext.EventObject.DELETE){
                if(this.store.reader.meta.del!=0)this.eliminar();
            }
        }
    },
    nemo:null,
    stripeRows: true,
    autoWidth:true,
    //autoHeight:true,
    loadMask: true,
    border : true,
    columns: [],
    campos:[],
    link:false,
    imprime:true,
    exporta:true,
    filtra:true
});

