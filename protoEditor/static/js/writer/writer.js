//Dg  Este ejemplo maneja la actualizacion completa con varias configuraciones  ( batch,  auto,  ... ) 
// http://dev.sencha.com/deploy/ext-4.0.0/examples/writer/writer.js



Ext.define('Writer.Form', {
    extend: 'Ext.form.Panel',
    alias: 'widget.writerform',

    requires: ['Ext.form.field.Text', 
               'Ext.form.*'],
    
    initComponent: function(){
        this.addEvents('create');
        Ext.apply(this, {
            activeRecord: null,
            iconCls: 'icon-user',
            frame: true,
            title: 'User -- All fields are required',
            defaultType: 'textfield',
            bodyPadding: 5,
            fieldDefaults: {
                anchor: '100%',
                labelAlign: 'right'
            },
            items: [{
                fieldLabel: 'Email',
                name: 'email',
                allowBlank: true
                // vtype: 'email'
            }, {
                fieldLabel: 'Name',
                name: 'name',
                xtype: 'protoZoom', 
                allowBlank: false
            }, {
                fieldLabel: 'Phone',
                name: 'phone',
                allowBlank: true
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                    iconCls: 'icon-save',
                    itemId: 'save',
                    text: 'Save',
                    disabled: true,
                    scope: this,
                    handler: this.onSave
                }, {
                    iconCls: 'icon-user-add',
                    text: 'Create',
                    scope: this,
                    handler: this.onCreate
                }, {
                    iconCls: 'icon-reset',
                    text: 'Reset',
                    scope: this,
                    handler: this.onReset
                }]
            }]
        });
        this.callParent();
    },

    setActiveRecord: function(record){
        this.activeRecord = record;
        if (record) {
            this.down('#save').enable();
            this.getForm().loadRecord(record);
        } else {
            this.down('#save').disable();
            this.getForm().reset();
        }
    },

    onSave: function(){
        var active = this.activeRecord
        var form = this.getForm();

        if (!active) {
            return;
        }
        if (form.isValid()) {
            form.updateRecord(active);
            this.onReset();
        }
    },

    onCreate: function(){
        var form = this.getForm();

        if (form.isValid()) {
            this.fireEvent('create', this, form.getValues());
            form.reset();
        }

    },

    onReset: function(){
        this.setActiveRecord(null);
        this.getForm().reset();
    }
});

// --------------------------------------------------------------------------------------

ERR_EXIST = 'ERR_EXIST'
ERR_NOEXIST = 'ERR_NOEXIST'
ERR_ADD = 'ERR_ADD'
ERR_UPD = 'ERR_UPD'
ERR_DEL = 'ERR_DEL'
NEW_ROW = 'NEW_ROW'


Ext.define('Writer.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.writergrid',
    requires: [
//        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],
  	plugins: ['headertooltip'],

    listeners: {
        itemmouseenter: function(view, record, item) {
        	
        	// var msg = record.get('_ptRowMessage')

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
        	Ext.fly(item).set({'data-qtip': msg });
            
            // Dgt :  Este tooltip evita las actions columns 
	        // Ext.fly(item).select('.x-grid-cell:not(.x-action-col-cell)').set({'data-qtip': 'My tooltip: ' + record.get('name')});

        }
    },             

    initComponent: function(){

        // this.editing = Ext.create('Ext.grid.plugin.CellEditing');

        Ext.apply(this, {
            iconCls: 'icon-grid',
            frame: true,
//            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    iconCls: 'icon-add',
                    text: 'Add',
                    scope: this,
                    handler: this.onAddClick
                }, {
                    iconCls: 'icon-reload',
                    text: 'Reload',
                    disabled: false,
                    itemId: 'reload',
                    scope: this,
                    handler: this.onReloadClick
                }, {
                    iconCls: 'icon-delete',
                    text: 'Delete',
                    disabled: true,
                    itemId: 'delete',
                    scope: this,
                    handler: this.onDeleteClick
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
                // width: 25,
                // sortable: false,
                // dragable: false,
                // hideable: false, 
                // resizable: false,
                // dataIndex: '_ptStatus'  
            // }, {
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

Ext.define('Writer.Person', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, '_ptStatus', 
    	'email', 'name', 'phone'
    	
    ],

    validations: [{
        type: 'length',
        field: 'name',
        min: 1
        
//    DGT  Que hacer con esta validacion,  donde la verifico???          
//    }, {
//        type: 'length',
//        field: 'email',
//        min: 1
//    }, {
//        type: 'length',
//        field: 'phone',
//        min: 1
    }]
});

Ext.require([
    'Ext.data.*',
    'Ext.tip.QuickTipManager',
    'Ext.window.MessageBox'
]);



Ext.onReady(function(){
	
    Ext.tip.QuickTipManager.init();
    Ext.QuickTips.init();

    setCsRfToken(); 
    
    var store = Ext.create('Ext.data.Store', {
        model: 'Writer.Person',
        autoLoad: true,
        autoSync: true,
        proxy: {
            type: 'ajax',
            api: {
            	read : 'contact/view.action',
                create : 'contact/create.action/',
                update: 'contact/update.action/',
                destroy: 'contact/delete.action/'
            },
            reader: {
                type: 'json',
                root: 'data',
                successProperty: 'success',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: true,
                root: 'data'
            },
            listeners: {
                exception: function(proxy, response, operation){
                    Ext.MessageBox.show({
                        title: 'REMOTE EXCEPTION',
                        msg: operation.getError(),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        },
        listeners: {
        	
	 		// Fired when a Model instance has been added to this Store ...
			add: function ( store, records,  index,  eOpts ) {
				var msg = 'add';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			}, 
	 
			// Fires before a request is made for a new data object. ...
			beforeload: function(  store,  operation,  eOpts ) {
				var msg = 'beforeload';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
	 
			// Fired before a call to sync is executed. Return false from any listener to cancel the synv
			beforesync: function(  options,  eOpts ) {
				var msg = 'beforesync';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
	
			// Fired after the removeAll method is called. ...
			clear: function ( store,  eOpts ) {
				var msg = 'clear';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
	 
			 
			// Fires whenever the store reads data from a remote data source. ...
			load: function ( store, records,  successful,  eOpts ) {
				var msg = 'load';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
			 
			// Fired when a Model instance has been removed from this Store ...
			remove: function (  store,  record,  index,  eOpts ) {
				var msg = 'remove';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
			 
			// Fires when a Model instance has been updated ...\    	
			update: function ( store,  record,  sOperation,  eOpts ) {
				var msg = 'update';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},  

			// Fires whenever the records in the Store have changed in some way - this could include adding or removing records, or ...
			datachanged: function( store,  eOpts ) {
				var msg = 'datachanged';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
	    	
	    	// Fires whenever a successful write has been made via the configured Proxy 
	        write: function(store, operation, eOpts ){
				var title =   'Event:';            	
				var msg = 'write ' + operation.action + ' ' + operation.resultSet.message ;   

				for ( var ix in operation.resultSet.records ) {
					var record = operation.resultSet.records[ix]
					
					if ((operation.action == 'destroy') && ( record.data._ptStatus != '' )) {
	        			// record = Ext.create('Writer.Person');
	        			// record.set(record.data);
	                    store.insert(0, record);
					};
					
		            msg = msg + ' - ' + Ext.String.format("Reg: {0}", record.getId()); 
				}
	            Ext.outils.msg(title, msg );
	                
	        }
        	
        }
    });

    var main = Ext.create('Ext.container.Container', {
        padding: '0 0 0 20',
        width: 800,
        height: 600,
        renderTo: document.body,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            itemId: 'form',
            xtype: 'writerform',
            height: 150,
            margins: '0 0 10 0',

            listeners: {
                create: function(form, data){
               	
               		data._ptStatus = 'NEW_ROW'
        			record = Ext.create('Writer.Person');
        			record.set(data);
        			record.setId(0);
                	
                    store.insert(0, record);
                }
            }
        }, {
            itemId: 'grid',
            xtype: 'writergrid',
            title: 'User List',
            flex: 1,
            store: store,
            listeners: {
                selectionchange: function(selModel, selected) {
                    main.child('#form').setActiveRecord(selected[0] || null);
                }
            }
        }]
    });
});



/**
 * @class Ext.ux.grid.HeaderToolTip
 * @namespace Ext.ux.grid
 *
 *  Text tooltips should be stored in the grid column definition
 *  
 *  Sencha forum url: 
 *  http://www.sencha.com/forum/showthread.php?132637-Ext.ux.grid.HeaderToolTip
 */
Ext.define('Ext.ux.grid.HeaderToolTip', {
    alias: 'plugin.headertooltip',
    init : function(grid) {
        var headerCt = grid.headerCt;
        grid.headerCt.on("afterrender", function(g) {
            grid.tip = Ext.create('Ext.tip.ToolTip', {
                target: headerCt.el,
                delegate: ".x-column-header",
                trackMouse: true,
                renderTo: Ext.getBody(),
                listeners: {
                    beforeshow: function(tip) {
                        var c = headerCt.down('gridcolumn[id=' + tip.triggerElement.id  +']');
                        if (c  && c.tooltip)
                            tip.update(c.tooltip);
                        else
                            return false;
                    }
                }
            });
        });
    }
});


Ext.define('Ext.ux.field.protoZoom', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.protoZoom',

    triggerCls: Ext.baseCSSPrefix + 'form-search-trigger',
    
    
    initComponent: function(){

    	// referencia a la ventana modal 
    	var win;
    	this.win = win; 
    	
    	this.callParent(arguments);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTriggerClick();
            }
        }, this);
    },
     
    // override onTriggerClick
    onTriggerClick: function() {
        Ext.Msg.alert('Status', 'You clicked my trigger!');
    }, 
    
        
});

// ------------------------------------------------------------------

    function showContactForm() {
        if (!win) {

        	var form = Ext.widget('form', {
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                bodyPadding: 10,

                fieldDefaults: {
                    labelAlign: 'top',
                    labelWidth: 100,
                    labelStyle: 'font-weight:bold'
                },
                defaults: {
                    margins: '0 0 10 0'
                },

                items: [{
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Your Name',
                    labelStyle: 'font-weight:bold;padding:0',
                    layout: 'hbox',
                    defaultType: 'textfield',

                    fieldDefaults: {
                        labelAlign: 'top'
                    },

                    items: [{
                        flex: 1,
                        name: 'firstName',
                        fieldLabel: 'First',
                        allowBlank: false
                    }, {
                        width: 30,
                        name: 'middleInitial',
                        fieldLabel: 'MI',
                        margins: '0 0 0 5'
                    }, {
                        flex: 2,
                        name: 'lastName',
                        fieldLabel: 'Last',
                        allowBlank: false,
                        margins: '0 0 0 5'
                    }]
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Your Email Address',
                    vtype: 'email',
                    allowBlank: false
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Subject',
                    allowBlank: false
                }, {
                    xtype: 'textareafield',
                    fieldLabel: 'Message',
                    labelAlign: 'top',
                    flex: 1,
                    margins: '0',
                    allowBlank: false
                }],

                buttons: [{
                    text: 'Cancel',
                    handler: function() {
                        this.up('form').getForm().reset();
                        this.up('window').hide();
                    }
                }, {
                    text: 'Send',
                    handler: function() {
                        if (this.up('form').getForm().isValid()) {
                            // In a real application, this would submit the form to the configured url
                            // this.up('form').getForm().submit();
                            this.up('form').getForm().reset();
                            this.up('window').hide();
                            Ext.MessageBox.alert('Thank you!', 'Your inquiry has been sent. We will respond as soon as possible.');
                        }
                    }
                }]
            });

            win = Ext.widget('window', {
                title: 'Contact Us',
                closeAction: 'hide',
                width: 400,
                height: 400,
                minHeight: 400,
                layout: 'fit',
                resizable: true,
                modal: true,
                items: form
            });
        }
        win.show();
    }

    var mainPanel = Ext.widget('panel', {
        renderTo: Ext.getBody(),
        title: 'Welcome!',
        width: 500,
        bodyPadding: 20,

        items: [{
            xtype: 'component',
            html: 'Thank you for visiting our site! We welcome your feedback; please click the button below to ' +
                  'send us a message. We will respond to your inquiry as quickly as possible.',
            style: 'margin-bottom: 20px;'
        }, {
            xtype: 'container',
            style: 'text-align:center',
            items: [{
                xtype: 'button',
                cls: 'contactBtn',
                scale: 'large',
                text: 'Contact Us',
                handler: showContactForm
            }]
        }]
    });

});
