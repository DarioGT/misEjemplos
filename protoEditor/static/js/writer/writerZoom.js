
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
     
    onTriggerClick: function() {
    	this.showZoomForm( this );
    }, 
    
  
    showZoomForm: function( me ) {
        
        var protoFormLayout = {
                // Lo primero es definir la forma 
                title: 'Mi forma',
                modal: true,

                // Las diferentes secciones se definen como un arbol ( DOM ) 
                items: [{
                    style: 'Section',
                    labelAlign: 'left',
                    fields: ['f1', 'f2']
                
                }, {
                    title: '*',
                    style: 'Section',
                    labelAlign: 'left',
                    fields: ['f4', 'f5',{'name': 'f6','width': 20}]
                }, {
                    title: 'Con FSet',
                    style: 'Section',
                    collapsible: true,
                    collapsed: true,
                    fields: ['f3', [{'name': 'f1'}, 'f2'],['f4', 'f5']]
                }, {
                    title: 'Con FSet - FSet',
                    style: 'Section',
                    collapsible: true,
                    collapsed: true,
                    checkField: 'f1',
                    fields: [['f1', ['f2', 'f3']],['f4', 'f5']]
                }, {

                    style: 'Box',
//                    collapsible: true,
                    items: [{
                        title: 'Campos ',
                        collapsible: true,
                        style: 'Tab',
                        height: 200,
                        items: [{
                            style: 'Section',
                            title: 'Campos Base',
                            collapsible: true,
                            fields: ['f1', 'f2']
                        }, {
                            style: 'Section',
                            title: 'Otros Campos',
                            fields: ['f3', 'f4'],
                        }]
                    }, {
                        title: 'Tab',
                        style: 'Tab',
                        height: 200,
                        items: [{
                            title: 'Acc Campos ',
                            style: 'Section',
                            fields: ['f1', 'f2']
                        }, {

                          title: 'Accordion',
                          style: 'Accordion',
                          height: 100,
                          items: [{
                              title: 'Acc Campos ',
                              style: 'Section',
//                              fields: ['f1', 'f2']
                          }, {
                              title: 'Acc Otros',
                              style: 'Section',
//                              fields: ['f3', 'f4'],
                          }]
                        }]

//                        title: 'Accordion',
//                        style: 'Accordion',
//                        height: 100,
//                        items: [{
//                            title: 'Acc Campos ',
//                            style: 'Section',
////                            fields: ['f1', 'f2']
//                        }, {
//                            title: 'Acc Otros',
//                            style: 'Section',
////                            fields: ['f3', 'f4'],
//                        }]

                    }]
//                }, {
//
//                    style: 'Tab',
//                    items: [{
//                        title: 'Campos ',
//                        collapsible: true,
//                        style: 'Tab',
//                        height: 200,
//                        items: [{
//                            style: 'Section',
//                            title: 'Campos Base',
//                            collapsible: true,
//                            fields: ['f1', 'f2']
//                        }, {
//                            style: 'Section',
//                            title: 'Otros Campos',
//                            fields: ['f3', 'f4'],
//                        }]
//                    }, {
//                        title: 'Accordion',
//                        style: 'Accordion',
//                        height: 200,
//                        items: [{
//                            title: 'Acc Campos ',
//                            style: 'Section',
//                            fields: ['f1', 'f2']
//                        }, {
//                            title: 'Tab',
//                            style: 'Tab',
//                            height: 100,
//                            items: [{
//                                title: 'Acc Campos ',
//                                style: 'Section',
//                                fields: ['f1', 'f2']
//                            }, {
//                                title: 'Acc Otros',
//                                style: 'Section',
//                                fields: ['f3', 'f4'],
//                            }]
//                        }]
//                    }]
//                }, {
//
//                    style: 'Box',
//                    items: [{
//                        title: 'Accordion',
//                        style: 'Accordion',
//                        height: 100,
//                        items: [{
//                            style: 'Section',
//                            title: 'Campos Base',
//                            collapsible: true,
//                            fields: ['f1', 'f2']
//                        }, {
//                            style: 'Section',
//                            title: 'Otros Campos',
//                            fields: ['f3', 'f4'],
//                        }]
//                    }, {
//                        title: 'Accordion',
//                        style: 'Accordion',
//                        height: 100,
//                        items: [{
//                            title: 'Acc Campos ',
//                            style: 'Section',
////                            fields: ['f1', 'f2']
//                        }, {
//                            title: 'Acc Otros',
//                            style: 'Section',
////                            fields: ['f3', 'f4'],
//                        }]
//                    }]
                }
        ]}
        
        var form = defineProtoForm( protoFormLayout );
        
        
    //  -----------------------------------------------------------------------------
        
        
        win = Ext.widget('window', {
            title: 'Contact Us',
            closeAction: 'hide',
            width: 800, minWidth: 400,
            height: 600, minHeight: 400,
            layout: 'fit',
            resizable: true,
            modal: true,
            items: form
        });

        win.show();
        
        
    }
    
        
});





Ext.define('Ext.ux.field.protoZoomCont', {
    extend: 'Ext.container.Container',
    alias: 'widget.protozoomcont',

//        padding: '5 5 5 5',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
           itemId: 'form',
           xtype: 'writerform',
//           margins: '0 0 10 0',
           // listeners: {
               // create: function(form, data){
          		// data._ptStatus = 'NEW_ROW'
       			// record = Ext.create('Writer.Person');
       			// record.set(data);
       			// record.setId(0);
                // store.insert(0, record);
               // }}
//       }, {
//            itemId: 'grid',
//            xtype: 'writergrid',
//            title: 'User List',
//            flex: 1,
            // store: store,
            // listeners: {
                // selectionchange: function(selModel, selected) {
                   // main.child('#form').setActiveRecord(selected[0] || null);
                // }
            // }
        }]
    });

//


