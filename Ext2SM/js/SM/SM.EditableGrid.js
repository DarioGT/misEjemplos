
SM.EditableGrid=Ext.extend(Ext.grid.EditorGridPanel,{
    constructor:function(config){
        SM.EditableGrid.superclass.constructor.call(this,config);
        this.camposCargados=false;
        var grid=this;
        var ne=this.nemo;
        var tab=this.title;
        this.heightInicial=this.height;
        this.suspendEvents();
        /*Ext.apply(this,{
            selModel:new Ext.grid.RowSelectionModel({
                singleSelect:true
            })
        });*/
        /*this.getView().on('refresh',function(){
            if(grid.padre){
                grid.getSelectionModel().selectRow(grid.padre.seleccion,false);
                grid.getView().focusRow(grid.padre.seleccion);
            }else{
                grid.getSelectionModel().selectFirstRow();
            }
        });*/
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
                var resp=Ext.util.JSON.decode(response.responseText);
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

        Ext.apply(this,{
            view: new Ext.grid.GridView({
                focusRow: Ext.emptyFn
            //ensureVisible: Ext.emptyFn
            })
        })

    },
    onRender: function(ct, position){
        SM.PCLGrid.superclass.onRender.call(this, ct, position);
        var grid=this;
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
        //var botonAdicion=new

        this.add=new Ext.Toolbar.Button({
            icon:'images/add.png',
            cls:"x-btn-icon",
            hidden:true,
            tooltip: {
                text:'Adiciona Un Registro',
                title:'Agregar'
            },
            handler:function(){
                grid.agregar();
            }
        });

        this.del=new Ext.Toolbar.Button({
            icon:'images/delete.png',
            cls:"x-btn-icon",
            hidden:true,
            tooltip: {
                text:'Borra Un Registro',
                title:'Eliminar'
            },
            handler:function(){
                if(grid.store.reader.meta.del!=0)grid.eliminar();
            }
        });

        this.getBottomToolbar().addButton(this.add);
        
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
                
                if(grid.tipo!='zoom')grid.padre.setTitle(this.reader.meta.titulo);
                //grid.add.hide();
                //grid.del.hide();

                if(!grid.camposCargados){
                    if(grid.padre){
                        if(grid.padre.afterLoad)grid.padre.afterLoad();
                        grid.padre.loadGridsFields();
                    }else{
                        grid.cargarCampos();
                    }
                }
            }
        });
    },
    
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
    makeEditable:function(){
        this.add.show();
        this.del.show();
    },
    makeNoEditable:function(){
        this.add.hide();
        this.del.hide();
    },
    agregar:function(values){
        var grid=this;
        var ds_model = Ext.data.Record.create(grid.store.fields);
        var defaults=new Object();
        for(j=0;j<grid.store.fields.items.length ;j++) {
            var campo=grid.store.fields.items[j];
            defaults[campo.name]=campo.vdefault.trim();
            if(values)if(values[campo.name])defaults[campo.name]=values[campo.name].trim();
            if(grid.padre){
                if(grid.padre.DocAut && grid.padre.DocAut.Enc.record){
                    var Doc=grid.padre.DocAut;
                    if(Doc.heredados!=null){
                        for (var v in Doc.heredados) {
                            if(Doc.heredados[v].campoDet==campo.name){
                                defaults[campo.name]=Doc.Enc.record.get(Doc.heredados[v].campoEnc);
                            }
                        }
                    }
                }
            }
        }
        var record=new ds_model(defaults);
        record.__NewRec = true;
        grid.store.insert(grid.store.getCount(),record);
        grid.startEditing(grid.store.getCount()-1,1);
    },
    eliminar:function(){
        var grid=this;
        Ext.MessageBox.confirm('Borrar', 'Desea eliminar los registros seleccionados?', function(btn){
            if(btn=='yes'){
                var str='';
                var seleccion=grid.getSelectionModel().getSelectedCell();
            //console.log(seleccion);
            }
        });

    },
    setDefaultHeight:function(){
        this.setHeight(this.heightInicial);
    },
    listeners:{
        keydown:function(e){
            if(e.getKey()==Ext.EventObject.INSERT){
                this.agregar();
            }
        },
        beforeedit :function( Object ){
            var grid=Object.grid;
            var record=Object.record;
            var campo=Object.field;
            var value=Object.value;
            var row=Object.row;
            var column=Object.column;
            var cancel=false;
            if(grid.store.reader.meta.eventos.beforeEdit)eval(grid.store.reader.meta.eventos.beforeEdit);
            return !cancel;
        },
        validateedit : function(Object){
            var grid=Object.grid;
            var record=Object.record;
            var campo=Object.field;
            var value=Object.value;
            var originalValue=Object.originalValue;
            var row=Object.row;
            var column=Object.column;
            var cancel=false;
            if(grid.store.reader.meta.eventos.validateField)eval(grid.store.reader.meta.eventos.validateField);
            return !cancel;
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
    link:false
});
