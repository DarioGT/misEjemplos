Ext.define('Ext.ux.field.protoZoom', {
    extend : 'Ext.form.field.Trigger',
    alias : 'widget.protoZoom',
    
    triggerCls : Ext.baseCSSPrefix + 'form-search-trigger',
    
    initComponent : function() {
        
        // referencia a la ventana modal
        var win;
        this.win = win;
        
        this.callParent(arguments);
        this.on('specialkey', function(f, e) {
            if (e.getKey() == e.ENTER) {
                this.onTriggerClick();
            }
        }, this);
    },
    
    onTriggerClick : function() {
        this.showZoomForm(this);
    },
    
    showZoomForm : function(me) {
        
        // Campos de base con o sin frame
        var sectionBase0 = {
            style : 'Section',
            // frame: true,
            fields : [
                    'f5', {
                        'name' : 'f6',
                        'width' : 20
                    }
            ]
        }

        // Campos de base con titulo
        var sectionBase1 = {
            style : 'Section',
            frame : true,
            title : 'Section base1',
            fields : [
                    'f1', 'f2'
            ]
        }

        // Campos de base con titulo
        var sectionBase2 = {
            style : 'Section',
            title : 'Section base2',
            autoScroll : true,
            fields : [
                    'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'fA'
            ]
        }

        // Campos de base collapsibles con fset
        var sectionBase3 = {
            title : 'Sectio tipo3',
            style : 'Section',
            collapsible : true,
            collapsed : true,
            fields : [
                    'f3', [
                            {
                                'name' : 'f1'
                            }, 'f2'
                    ], [
                            'f4', 'f5'
                    ]
            ]
        }

        // Campos de base collapsibles check con fset
        var sectionBase4 = {
            title : 'Con FSet - FSet',
            style : 'Section',
            collapsible : true,
            // collapsed: true,
            checkField : 'f1',
            fields : [
                    [
                            'f1', [
                                    'f2', 'f3'
                            ]
                    ], [
                            'f4', 'f5'
                    ]
            ]
        }

        var sectionBox3 = {
            style : 'HBox',
            collapsible : true,
            items : [
                    {
                        title : 'Campos ',
                        collapsible : true,
                        style : 'Tab',
                        height : 200,
                        items : [
                                sectionBase1, sectionBase2
                        ]
                    }, {
                        style : 'Tab',
                        height : 200,
                        items : [
                                sectionBase1, sectionAccordion1
                        ]
                    }, sectionAccordion1
            ]
        }

        // Caja vertica q puede meterse en tabs o acordeones
        var sectionVBox1 = {
            style : 'VBox',
            // title: 'VBox',
            // collapsible: true,
            items : [
                    sectionBase1, sectionBase3
            ]
        }

        // Caja con dos secciones diferente height
        var sectionBox1 = {
            style : 'HBox',
            collapsible : true,
            items : [
                    sectionBase1, sectionBase3, sectionVBox1
            ]
        }

        var sectionAccordion1 = {
            style : 'Accordion',
            height : 300,
            items : [
                    sectionBase1, sectionVBox1
            ]
        }

        // Tab simple con 2 secciones diferente tamnao
        var sectionTab2 = {
            style : 'Tab',
            items : [
                    {
                        title : 'Campos ',
                        collapsible : true,
                        style : 'Tab',
                        height : 200,
                        items : [
                                sectionBase1, sectionBase2
                        ]
                    }, {
                        title : 'Accordion',
                        style : 'Accordion',
                        height : 200,
                        items : [
                                {
                                    title : 'Acc Campos ',
                                    style : 'Section',
                                    fields : [
                                            'f1', 'f2'
                                    ]
                                }, {
                                    title : 'Tab',
                                    style : 'Tab',
                                    height : 100,
                                    items : [
                                            sectionBase1, sectionBase2
                                    ]
                                }
                        ]
                    }
            ]
        }

        // Tab simple con 2 secciones diferente tamnao
        var sectionTab1 = {
            style : 'Tab',
            title : 'Tab1',
            height : 200,
            items : [
                    sectionBase1, sectionBase2
            ]
        }

        // Dos acordeones en un HBox
        var sectionBox2 = {
            style : 'HBox',
            // height : 300,
            flex : 1,
            items : [
                    {
                        title : 'Accordion1',
                        style : 'Accordion',
                        items : [
                                sectionBase1, sectionBase2
                        ]
                    }, {
                        title : 'Accordion2',
                        style : 'Accordion',
                        items : [
                                sectionTab1, sectionBase2
                        ]
                    }
            ]
        }

        var protoFormLayout = {
            // Las diferentes secciones se definen como un arbol ( DOM )
            // title: 'Mi forma',
            modal : true,
            items : [
                    sectionTab1, sectionBox2
            ]
        }

        var form = defineProtoForm(protoFormLayout);
        
        // -----------------------------------------------------------------------------
        
        win = Ext.widget('window', {
            title : 'Contact Us',
            closeAction : 'hide',
            width : 800,
            minWidth : 400,
            height : 600,
            minHeight : 400,
            layout : 'fit',
            resizable : true,
            modal : true,
            items : form
        });
        
        win.show();
        
    }

});

Ext.define('Ext.ux.field.protoZoomCont', {
    extend : 'Ext.container.Container',
    alias : 'widget.protozoomcont',
    
    // padding: '5 5 5 5',
    layout : {
        type : 'vbox',
        align : 'stretch'
    },
    items : [
        {
            itemId : 'form',
            xtype : 'writerform',
        // margins: '0 0 10 0',
        // listeners: {
        // create: function(form, data){
        // data._ptStatus = 'NEW_ROW'
        // record = Ext.create('Writer.Person');
        // record.set(data);
        // record.setId(0);
        // store.insert(0, record);
        // }}
        // }, {
        // itemId: 'grid',
        // xtype: 'writergrid',
        // title: 'User List',
        // flex: 1,
        // store: store,
        // listeners: {
        // selectionchange: function(selModel, selected) {
        // main.child('#form').setActiveRecord(selected[0] || null);
        // }
        // }
        }
    ]
});

//

