//  Dgt :   Ejemplo para la config de la grilla 


Ext.onReady(function () {

    Ext.BLANK_IMAGE_URL = '/images/extjs4/s.gif';
    Ext.tip.QuickTipManager.init();

    Ext.define('VendorError', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'id',
            type: 'int'
        }, {
            name: 'UnexpStatCode',
            type: 'string'
        }],
        proxy: {
            type: 'ajax',
            simpleSortMode: true,
            api: {
                read: '/internal/viewVERext_json.asp',
                create: '/internal/viewVERext_create.asp',
                update: '/internal/viewVERext_update.asp',
                destroy: '/internal/viewVERext_destroy.asp'
            },
            reader: {
                type: 'json',
                messageProperty: 'message',
                root: 'data'
            },
            writer: {
                type: 'json',
                writeAllFields: true,
                allowSingle: false,
                root: 'data'
            },
            listeners: {
                exception: function (proxy, response, operation) {
                    Ext.MessageBox.show({
                        title: 'ERROR',
                        msg: operation.getError(),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        }
    });

    var store = Ext.create('Ext.data.Store', {
        model: 'VendorError',
        autoLoad: true,
        autoSync: true,
        pageSize: 20,
        remoteSort: true
    });

    // create the Grid
    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        columns: [{
            text: 'Vendor',
            dataIndex: 'VendorName',
            flex: 1
        }, {
            text: 'Invoiced',
            dataIndex: 'InvDate',
            xtype: 'datecolumn',
            align: 'center'
        }, {
            text: 'Credit',
            dataIndex: 'UnexpCost',
            tdCls: 'colyellow',
            renderer: Ext.util.Format.usMoney,
            align: 'right',
            field: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            text: 'Recurrence',
            dataIndex: 'Recurrence',
            tdCls: 'colyellow',
            align: 'center',
            field: {
                xtype: 'combobox',
                typeAhead: true,
                triggerAction: 'all',
                selectOnTab: true,
                store: [
                    ['once', 'once'],
                    ['1st', '1st'],
                    ['2nd+', '2nd+']
                ],
                lazyRender: true
            }
        }, {
            text: 'CStatus',
            dataIndex: 'UnexpStatCode',
            tdCls: 'colyellow',
            align: 'center',
            field: {
                xtype: 'combobox',
                typeAhead: true,
                triggerAction: 'all',
                selectOnTab: true,
                store: [ <%= cstat_grid %> ],
                lazyRender: true
            }
        }],
        layout: 'fit',
        height: 500,
        renderTo: 'theGrid',
        selType: 'cellmodel',
        plugins: [
                  Ext.create('Ext.grid.plugin.CellEditing', {
                	  clicksToEdit: 1
                  })]	
        dockedItems: [{
            xtype: 'pagingtoolbar',
            store: store,
            dock: 'bottom',
            displayInfo: true
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'button',
                text: 'IsDirty()',
                handler: function () {
                    var report = "";
                    store.each(function (rec) {
                        report = report + rec.dirty + '/';
                    });
                    alert(report);
                }
            }]
        }],
        viewConfig: {
            stripeRows: true
        }
    });

    Ext.EventManager.onWindowResize(grid.doLayout, grid);
});