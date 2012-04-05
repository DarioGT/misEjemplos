
//  Forma de ejemplo   NO SE CARGA EN EL PROYECTO 


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
                            // In a real application, this would submit the form
                            // to the configured url
                            // this.up('form').getForm().submit();
                            this.up('form').getForm().reset();
                            this.up('window').hide();
                            Ext.MessageBox.alert('Thank you!', 'Your inquiry has been sent. We will respond as soon as possible.');
                        }
                    }
                }]
            });

        	
        	
        	// Pruebas con formas
        	
        	
// var form = Ext.create('Ext.form.Panel', {
// title: 'Simple Form with FieldSets',
// labelWidth: 75, // label settings here cascade unless overridden
// frame: true,
// bodyStyle: 'padding:5px 5px 0',
// width: 550,
// layout: 'column', // arrange fieldsets side by side
// defaults: {
// bodyPadding: 4
// },
// items: [{
// // Fieldset in Column 1 - collapsible via toggle button
// xtype:'fieldset',
// columnWidth: 0.5,
// title: 'Fieldset 1',
// collapsible: true,
// defaultType: 'textfield',
// defaults: {anchor: '100%'},
// layout: 'anchor',
// items :[{
// fieldLabel: 'Field 1',
// name: 'field1'
// }, {
// fieldLabel: 'Field 2',
// name: 'field2'
// }]
// }, {
// // Fieldset in Column 2 - collapsible via checkbox, collapsed by default,
// contains a panel
// xtype:'fieldset',
// title: 'Show Panel', // title or checkboxToggle creates fieldset header
// columnWidth: 0.5,
// checkboxToggle: true,
// collapsed: true, // fieldset initially collapsed
// layout:'anchor',
// items :[{
// xtype: 'panel',
// anchor: '100%',
// title: 'Panel inside a fieldset',
// frame: true,
// height: 52
// }]
// }]
// });

// var form = Ext.create('Ext.form.Panel', {
// title: 'FieldContainer Example',
// width: 550,
// bodyPadding: 10,
// items: [{
// xtype: 'fieldcontainer',
// fieldLabel: 'Last Three Jobs',
// labelWidth: 100,
//
// // The body area will contain three text fields, arranged
// // horizontally, separated by draggable splitters.
// layout: 'hbox',
// items: [{
// xtype: 'textfield',
// flex: 1
// }, {
// xtype: 'splitter'
// }, {
// xtype: 'textfield',
// flex: 1
// }, {
// xtype: 'splitter'
// }, {
// xtype: 'textfield',
// flex: 1
// }]
// }]
// });


// var form = Ext.create('Ext.form.Panel', {
// title: 'FieldContainer Example',
// width: 350,
// bodyPadding: 10,
//
// items: [{
// xtype: 'fieldcontainer',
// fieldLabel: 'Your Name',
// labelWidth: 75,
// defaultType: 'textfield',
//
// // Arrange fields vertically, stretched to full width
// layout: 'anchor',
// defaults: {
// layout: '100%'
// },
//
// // These config values will be applied to both sub-fields, except
// // for Last Name which will use its own msgTarget.
// fieldDefaults: {
// msgTarget: 'under',
// labelAlign: 'top'
// },
//
// items: [{
// fieldLabel: 'First Name',
// name: 'firstName'
// }, {
// fieldLabel: 'Last Name',
// name: 'lastName',
// msgTarget: 'under'
// }]
// }],
// });
        	
        	
        // ` PARA :LA forma con zoom
// xtype:'fieldset',
// checkboxToggle:true,
// title: 'User Information',
// defaultType: 'textfield',
// anchor: '100%',
// layout:'column',
//
// defaults : {
// labelAlign: 'top',
// },
//          
// items: [{
// columnWidth:.3,
// fieldLabel: 'E mail',
// name: 'email',
// allowBlank: true,
// vtype: 'email', // Validation
// vtypeText: 'formato de correo no valido'
// }, {
// // columnWidth:.5,
// fieldLabel: 'Nombre',
// name: 'name',
// xtype: 'protoZoom',
// allowBlank: false,
// blankText : 'Este campo es requerido '
// }, {
// fieldLabel: 'Tel',
// name: 'phone',
// allowBlank: true
// }]
        	
        	
// FILE SET
        	
            // The body area will contain three text fields, arranged
            // horizontally, separated by draggable splitters.
            xtype: 'fieldcontainer',
            fieldLabel: 'Last Three Jobs',
            labelWidth: 100,
            layout: 'hbox',
            items: [{
                xtype: 'textfield',
                allowBlank: false,
                flex: 1
            }, {
                xtype: 'splitter'
            }, {
                xtype: 'textfield',
                flex: 1
            }, {
                xtype: 'splitter'
            }, {
                xtype: 'textfield',
                flex: 1
            }]
        }, {                
            
        	

            // ---------------------------------

            showZoomForm1:  function( me ) {
            
                var win = me.win; 
                if (!win) {

                    // var form = Ext.widget('writerform');
                    var form = Ext.widget('protozoomcont');  

                    win = Ext.widget('window', {
                        title: 'Contact Us',
                        closeAction: 'hide',
                        width: 400,
                        height: 400,
                        minHeight: 400,
                        minWidth: 400,
                        layout: 'fit',
                        resizable: true,
                        modal: true,
                        items: form
                    });
                }
                
                me.win = win; 
                me.win.show();
            },

// ///
// =============================================================================================
            
            // / Checks y Radios
            
            
            // Using checkbox/radio groups will generally be more convenient and
            // flexible than
            // using individual checkbox and radio controls, but this shows that
            // you can
            // certainly do so if you only have a single control at a time.


            individual = [{
                    xtype: 'container',
                    layout:'anchor',
                    title   : 'FieldContainers',
//                    bodyPadding: 10,
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
//                            fieldLabel: 'Date Range',
                            fieldLabel: '',
                            combineErrors: true,
                            msgTarget : 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
//                                hideLabel: true
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
            
////
            
            


            var individual = {
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '0 0 10',
                    items: [{
                        xtype: 'container',
                        flex: 1,
                        title: 'Individual Checkboxes',
                        defaultType: 'textfield', // each item will be a checkbox
                        layout: 'anchor',
                        defaults: {
//                            anchor: '30%',
                            hideEmptyLabel: false
                        },
                        items: [{
                            anchor: '49%',
                            xtype: 'textfield',
                            name: 'txt-test1',
                            fieldLabel: 'Alignment Test'
                        }, {
                            anchor: '49%',
                            fieldLabel: 'Dog',
                            name: 'fav-animal-dog',
                            inputValue: 'dog'
                        }, {
                            anchor: '49%',
                            minWidth : 100, 
                            fieldLabel: 'Cat',
                            name: 'fav-animal-cat',
                            inputValue: 'cat'
                        }, {
                            anchor: '49%',
                            fieldLabel: 'Monkey',
                            name: 'fav-animal-monkey',
                            inputValue: 'monkey'
                        }]
                    }, {
                        xtype: 'component',
                        width: 10
                    }, {
                        xtype: 'fieldset',
                        flex: 1,
                        title: 'Individual Radios',
                        defaultType: 'radio', // each item will be a radio button
                        layout: 'anchor',
                        defaults: {
                            anchor: '100%',
                            hideEmptyLabel: false
                        },
                        items: [{
                            xtype: 'textfield',
                            name: 'txt-test2',
                            width: '50%',
                            fieldLabel: 'Alignment Test'
                        }, {
                            width: '50%',
                            fieldLabel: 'Favorite Color',
                            boxLabel: 'Red',
                            name: 'fav-color',
                            inputValue: 'red'
                        }, {
                            width: '50%',
                            boxLabel: 'Blue',
                            name: 'fav-color',
                            inputValue: 'blue'
                        }, {
                            boxLabel: 'Green',
                            name: 'fav-color',
                            inputValue: 'green'
                        }]
                    }]
                };
                        

            