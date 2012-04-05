Ext.define('Writer.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.writergrid',
    requires: [
//        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
//        'Ext.selection.CheckboxModel'
    ],
  	plugins: ['headertooltip'],


    listeners: {
        // Esto maneja los tooltip en las las filas
        itemmouseenter: function(view, record, item) {
        	var msg = record.get('_ptStatus')
			switch (msg)
			{
			case ERR_EXIST:
			  break;
			case ERR_NOEXIST:
			  break;
			case ERR_ADD:
			  break;
			case ERR_UPD:
			  break;
			case ERR_DEL:
			  break;
			default:
			  msg = ''	
			}        	
        	// Asigna un tooltip a la fila, pero respeta los de cada celda y los de los Actiosn
        	Ext.fly(item).set({'data-qtip': msg });
            
            // Dgt :  Este tooltip evita las actions columns 
	        // Ext.fly(item).select('.x-grid-cell:not(.x-action-col-cell)').set({'data-qtip': 'My tooltip: ' + record.get('name')});
        }
    },             

    initComponent: function(){

        // this.editing = Ext.create('Ext.grid.plugin.CellEditing');
        
        var selModel = Ext.create('Ext.selection.CheckboxModel', {
            // listeners: {
                // selectionchange: function(sm, selections) {
                    // grid4.down('#removeButton').setDisabled(selections.length == 0);
                // }
            // }
        });
        

        Ext.apply(this, {
            iconCls: 'icon-grid',
            frame: true,
//            selModel: selModel,
//            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    iconCls: 'icon-add',
                    text: 'Add',
                    scope: this,
                    handler: this.onAddClick
                }, {
                    iconCls: 'icon-update',
                    text: 'Update',
                    disabled: true,
                    itemId: 'update',
                    scope: this,
                    handler: this.onUpdateClick
                }, {
                    iconCls: 'icon-delete',
                    text: 'Delete',
                    disabled: true,
                    itemId: 'delete',
                    scope: this,
                    handler: this.onDeleteClick
                }, {
                    iconCls: 'icon-reload',
                    text: 'Reload',
                    disabled: false,
                    itemId: 'reload',
                    scope: this,
                    handler: this.onReloadClick
                }]
            }, {
                weight: 2,
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    xtype: 'tbtext',
                    text: '<b>@cfg</b>'
                }, '|', {
                    text: 'autoSync',
                    enableToggle: true,
                    pressed: true,
                    tooltip: 'When enabled, Store will execute Ajax requests as soon as a Record becomes dirty.',
                    scope: this,
                    toggleHandler: function(btn, pressed){
                        this.store.autoSync = pressed;
                    }
                }, {
                    text: 'batch',
                    enableToggle: true,
                    pressed: true,
                    tooltip: 'When enabled, Store will batch all records for each type of CRUD verb into a single Ajax request.',
                    scope: this,
                    toggleHandler: function(btn, pressed){
                        this.store.getProxy().batchActions = pressed;
                    }
                }, {
                    text: 'writeAllFields',
                    enableToggle: true,
                    pressed: true,
                    tooltip: 'When enabled, Writer will write *all* fields to the server -- not just those that changed.',
                    scope: this,
                    toggleHandler: function(btn, pressed){
                        this.store.getProxy().getWriter().writeAllFields = pressed;
                    }
                }]
            }, {
                weight: 1,
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                    iconCls: 'icon-save',
                    text: 'Sync',
                    scope: this,
                    handler: this.onSync
                }]
            }],
            
		   viewConfig: {
			   
                listeners: {
                    
                    // Esto maneja los vinculos en los campos 
                    cellclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                        var linkClicked = (e.target.tagName == 'A');
                        var clickedDataIndex = view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
                        if (linkClicked && clickedDataIndex ) {
                            alert(record.get('id'));
                        }
                    }
                }, 			   
			   
			   
                //	Esto permite marcar los registros despues de la actualizacion 
		        getRowClass: function(record, rowIndex, rowParams, store){
		        	var stRec = record.get('_ptStatus');
		        	
					switch (stRec)
					{
					case ERR_EXIST:
					case ERR_ADD:
						record.dirty = true;
						if ( record.getId() == 0 ) {
							record.phantom = true;   		        		
						}
					  	break;
					  	
					case ERR_NOEXIST:
					  	break;

					case ERR_UPD:
						record.dirty = true;
					  	break;

					case ERR_DEL:
					case NEW_ROW:
					  	break;

					default:
						stRec = ''
					  	break;
					}        	
		        	
		            return stRec;
		        }
		   },
            
            columns: [{
                 width: 25,
                 sortable: false,
                 dragable: false,
                 hideable: false, 
                 resizable: false,
                 dataIndex: '_ptStatus'  
             }, {
                text: 'ID',
                width: 40,
                sortable: true,
                dataIndex: 'id' ,  
               	tooltip: 'Some tooltip'
            }, {
                header: 'Name',
                minWidth: 100,
                flex: 1,
                sortable: true,
                dataIndex: 'name',
                field: {
                    type: 'textfield'
                }, 
               	tooltip: 'Nombre - name - nom ',
  				renderer: addTooltip 

            }, {
                header: 'Email',
                minWidth: 150,
                flex: 1,
                sortable: true,
                dataIndex: 'email',
                field: {
                    type: 'textfield'
                }, 
                
                // Esto agrega un vinculo dinamico 
                renderer: function (value) {
                    return '<a href="#">'+value+'</a>';
                }
            }, {
                header: 'Phone',
                width: 100,
                sortable: true,
                dataIndex: 'phone',
                field: {
                    type: 'textfield'
                } 
            }, 

	        {
	            xtype:'actioncolumn',
	            width:50,
	            items: [{
                    // iconCls: 'icon-delete',
	                icon: '/static/images/delete.png',  // Use a URL in the icon config
	                tooltip: 'Edit  xxxxxxxxxxxxxxxxxxxxxxxxxxx',
	                handler: function(grid, rowIndex, colIndex) {
	                    var rec = grid.getStore().getAt(rowIndex);
	                    alert("Edit " + rec.get('name'));
	                }
	            }]
	        }
            ]
        });

		function addTooltip(value, metaData, record, rowIndex, colIndex, store, view ){
            // if(record.data.readonly === true)
            // {
		    	metaData.tdAttr = 'data-qtip="' + value + '"';
                return '<span style="color:grey;">' + value + '</span>';
                 
            // }
		}; 
        
        this.callParent();
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
    },

    
    onSelectChange: function(selModel, selections){
        this.down('#delete').setDisabled(selections.length === 0);
        this.down('#update').setDisabled(selections.length === 0);
    },

    onSync: function(){
        this.store.sync();
    },

    onReloadClick: function(){
        this.store.load()
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            this.store.remove(selection);
        }
    },

    onUpdateClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            this.store.remove(selection);
        }
    },


    onAddClick: function(){
        var rec = new Writer.Person({
            name: '',
            phone: '',
            email: ''
        }) 
        
//        edit = this.editing;
//        edit.cancelEdit();

        this.store.insert(0, rec);

//        edit.startEditByPosition({
//            row: 0,
//            column: 1
//        });

    }
});