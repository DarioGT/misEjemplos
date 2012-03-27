
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
        
    /*

     
     */
        
        var protoFormLayout = {
                // Lo primero es definir la forma 
                title: 'Mi forma', 
                modal: true, 
                
                // Las diferentes secciones se definen como un arbol ( DOM ) 
                items: [{
                    title: 'Section Hor 2 Cols CheckCollapse', 
                    style: 'Section', 
                    labelAlign : 'left',
                    collapsible : true,
                    fields: [ 'f1', 'f2', 'f3', {'name': 'f4', 'width':20 } ]
                }, {
                    title: 'Con FSet', 
                    style: 'Section', 
                    collapsible : true, 
                    collapsed : true, 
                    checkField : 'f1',
                    fields: [ 'f3', [{'name': 'f1' }, 'f2'],  ['f4', 'f5']]

                }, {
                    title: 'Con FSet - FSet', 
                    style: 'Section', 
                    collapsible : true, 
                    collapsed : true, 
                    fields: [['f1', ['f2', 'f3']],  ['f4', 'f5']]
                }, {
                    title: 'Section con 2 cajas', 
//                    style: 'Box', 
//                    style: 'Accordion', 
                    style: 'Tab', 
                    collapsible : true,
                    minHeigth: 200,
                    items: [{
                        title: 'Campos ', 
                        style: 'Section', 
                        collapsible : true, 
                        fields: [ 'f1', 'f2'] 
                    }, {
                        title: 'Otros', 
                        collapsible : true, 
                        style: 'Section', 
//                        style : 'grid', 
                        fields: [ 'f1', 'f2'], 
                        gridView: 'view'
                    }]

//                }, {
//                    title: 'Section con tabs', 
//                    style: 'Tabs', 
//                    items: [{
//                        title: 'Hor1', 
//                        style: 'section', 
//                        collapsible : true, 
//                        fields: [ 'f1', 'f2']
//                    }, {
//                        title: 'Grilla', 
//                        collapsible : true, 
//                        grid : 'g1', 
//                        gridView: 'view'
//                    }],
                }],
                
        }; 

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


individual = [{
        xtype: 'container',
        layout:'anchor',
        title   : 'FieldContainers',
//        bodyPadding: 10,
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },
        items   : [
            {
                xtype     : 'textfield',
                name      : 'email',
                fieldLabel: 'Email Address',
                vtype: 'email',
                msgTarget: 'side',
                allowBlank: false
            },
            {
                xtype: 'fieldcontainer',
//                fieldLabel: 'Date Range',
                fieldLabel: '',
                combineErrors: true,
                msgTarget : 'side',
                layout: 'hbox',
                defaults: {
                    flex: 1,
//                    hideLabel: true
                },
                items: [
                    {
                        xtype     : 'datefield',
                        name      : 'startDate',
                        fieldLabel: 'Start',
                        margin: '0 5 0 0',
                        allowBlank: false
                    },
                    {
                        xtype     : 'datefield',
                        name      : 'endDate',
                        fieldLabel: 'End',
                        allowBlank: false
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Details',
                collapsible: true,
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                },
                items: [

                        {
                            xtype     : 'textfield',
                            name      : 'email',
                            fieldLabel: 'Email Address',
                            vtype: 'email',
                            msgTarget: 'side',
                            allowBlank: false, 
                            width : 30
                        },
                        
                        {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Phone',
                        combineErrors: true,
                        msgTarget: 'side',
                        defaults: {
                            hideLabel: true
                        },
                        items: [
                            {xtype: 'displayfield', value: '('},
                            {xtype: 'textfield',    fieldLabel: 'Phone 1', name: 'phone-1', width: 29, allowBlank: false},
                            {xtype: 'displayfield', value: ')'},
                            {xtype: 'textfield',    fieldLabel: 'Phone 2', name: 'phone-2', width: 29, allowBlank: false, margins: '0 5 0 0'},
                            {xtype: 'displayfield', value: '-'},
                            {xtype: 'textfield',    fieldLabel: 'Phone 3', name: 'phone-3', width: 48, allowBlank: false}
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Time worked',
                        combineErrors: true,
                        msgTarget: 'side',

                        defaults: {
                            hideLabel: true
                        },
                        items: [
                           {
                               name : 'hours',
                               xtype: 'numberfield',
                               width: 48,
                               allowBlank: false
                           },
                           {
                               xtype: 'displayfield',
                               value: 'hours'
                           },
                           {
                               name : 'minutes',
                               xtype: 'numberfield',
                               width: 48,
                               allowBlank: false
                           },
                           {
                               xtype: 'displayfield',
                               value: 'mins'
                           }
                        ]
                    },
                    {
                        xtype : 'fieldcontainer',
                        combineErrors: true,
                        msgTarget: 'side',
                        fieldLabel: 'Full Name',
                        defaults: {
                            hideLabel: true
                        },
                        items : [
                            {
                                width:          50,
                                xtype:          'combo',
                            },
                            {
                                xtype: 'textfield',
                                flex : 1,
                                name : 'firstName',
                                fieldLabel: 'First',
                                allowBlank: false
                            },
                            {
                                xtype: 'textfield',
                                flex : 1,
                                name : 'lastName',
                                fieldLabel: 'Last',
                                allowBlank: false,
                                margins: '0'
                            }
                        ]
                    }, 
                    
                    {
                        xtype     : 'textfield',
                        name      : 'email2',
                        fieldLabel: 'Email 2',
                        vtype: 'email',
                        msgTarget: 'side',
                        allowBlank: false, 
                        width : 30
                    }
                    
                ]
            }
        ],
    }];    
