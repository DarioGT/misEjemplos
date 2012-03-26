
//  Forma de ejemplo 


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
            var individual = {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 10',
                items: [{
                    xtype: 'fieldset',
                    flex: 1,
                    title: 'Individual Checkboxes',
                    defaultType: 'checkbox', // each item will be a checkbox
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%',
                        hideEmptyLabel: false
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'txt-test1',
                        fieldLabel: 'Alignment Test'
                    }, {
                        fieldLabel: 'Favorite Animals',
                        boxLabel: 'Dog',
                        name: 'fav-animal-dog',
                        inputValue: 'dog'
                    }, {
                        boxLabel: 'Cat',
                        name: 'fav-animal-cat',
                        inputValue: 'cat'
                    }, {
                        checked: true,
                        boxLabel: 'Monkey',
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
                        fieldLabel: 'Alignment Test'
                    }, {
                        checked: true,
                        fieldLabel: 'Favorite Color',
                        boxLabel: 'Red',
                        name: 'fav-color',
                        inputValue: 'red'
                    }, {
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



            /*
             * ====================================================================
             * CheckGroup example
             * ====================================================================
             */
            var checkGroup = {
                xtype: 'fieldset',
                title: 'Checkbox Groups (initially collapsed)',
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    labelStyle: 'padding-left:4px;'
                },
                collapsible: true,
                collapsed: true,
                items: [{
                    xtype: 'textfield',
                    name: 'txt-test3',
                    fieldLabel: 'Alignment Test'
                },{
                    // Use the default, automatic layout to distribute the
                    // controls evenly
                    // across a single row
                    xtype: 'checkboxgroup',
                    fieldLabel: 'Auto Layout',
                    cls: 'x-check-group-alt',
                    items: [
                        {boxLabel: 'Item 1', name: 'cb-auto-1'},
                        {boxLabel: 'Item 2', name: 'cb-auto-2', checked: true},
                        {boxLabel: 'Item 3', name: 'cb-auto-3'},
                        {boxLabel: 'Item 4', name: 'cb-auto-4'},
                        {boxLabel: 'Item 5', name: 'cb-auto-5'}
                    ]
                },{
                    xtype: 'checkboxgroup',
                    fieldLabel: 'Single Column',
                    // Put all controls in a single column with width 100%
                    columns: 1,
                    items: [
                        {boxLabel: 'Item 1', name: 'cb-col-1'},
                        {boxLabel: 'Item 2', name: 'cb-col-2', checked: true},
                        {boxLabel: 'Item 3', name: 'cb-col-3'}
                    ]
                },{
                    xtype: 'checkboxgroup',
                    fieldLabel: 'Multi-Column (horizontal)',
                    cls: 'x-check-group-alt',
                    // Distribute controls across 3 even columns, filling each
                    // row
                    // from left to right before starting the next row
                    columns: 3,
                    items: [
                        {boxLabel: 'Item 1', name: 'cb-horiz-1'},
                        {boxLabel: 'Item 2', name: 'cb-horiz-2', checked: true},
                        {boxLabel: 'Item 3', name: 'cb-horiz-3'},
                        {boxLabel: 'Item 4', name: 'cb-horiz-4'},
                        {boxLabel: 'Item 5', name: 'cb-horiz-5'}
                    ]
                },{
                    xtype: 'checkboxgroup',
                    fieldLabel: 'Multi-Column (vertical)',
                    // Distribute controls across 3 even columns, filling each
                    // column
                    // from top to bottom before starting the next column
                    columns: 3,
                    vertical: true,
                    items: [
                        {boxLabel: 'Item 1', name: 'cb-vert-1'},
                        {boxLabel: 'Item 2', name: 'cb-vert-2', checked: true},
                        {boxLabel: 'Item 3', name: 'cb-vert-3'},
                        {boxLabel: 'Item 4', name: 'cb-vert-4'},
                        {boxLabel: 'Item 5', name: 'cb-vert-5'}
                    ]
                },{
                    xtype: 'checkboxgroup',
                    fieldLabel: 'Multi-Column<br />(custom widths)',
                    cls: 'x-check-group-alt',
                    // Specify exact column widths (could also include float
                    // values for %)
                    columns: [100, 100],
                    vertical: true,
                    items: [
                        {boxLabel: 'Item 1', name: 'cb-custwidth', inputValue: 1},
                        {boxLabel: 'Item 2', name: 'cb-custwidth', inputValue: 2, checked: true},
                        {boxLabel: 'Item 3', name: 'cb-custwidth', inputValue: 3},
                        {boxLabel: 'Item 4', name: 'cb-custwidth', inputValue: 4},
                        {boxLabel: 'Item 5', name: 'cb-custwidth', inputValue: 5}
                    ]
                },{
                    xtype: 'checkboxgroup',
                    fieldLabel: 'Custom Layout<br />(w/ validation)',
                    allowBlank: false,
                    msgTarget: 'side',
                    autoFitErrors: false,
                    anchor: '-18',
                    // You can change the 'layout' to anything you want, and
                    // include any nested
                    // container structure, for complete layout control. In this
                    // example we only
                    // want one item in the middle column, which would not be
                    // possible using the
                    // default 'checkboxgroup' layout's columns config. We also
                    // want to put
                    // headings at the top of each column.
                    layout: 'column',
                    defaultType: 'container',
                    items: [{
                        columnWidth: .25,
                        items: [
                            {xtype: 'component', html: 'Heading 1', cls:'x-form-check-group-label'},
                            {xtype: 'checkboxfield', boxLabel: 'Item 1', name: 'cb-cust-1'},
                            {xtype: 'checkboxfield', boxLabel: 'Item 2', name: 'cb-cust-2'}
                        ]
                    },{
                        columnWidth: .5,
                        items: [
                            {xtype: 'component', html: 'Heading 2', cls:'x-form-check-group-label'},
                            {xtype: 'checkboxfield', boxLabel: 'A long item just for fun', name: 'cb-cust-3'}
                        ]
                    },{
                        columnWidth: .25,
                        items: [
                            {xtype: 'component', html: 'Heading 3', cls:'x-form-check-group-label'},
                            {xtype: 'checkboxfield', boxLabel: 'Item 4', name: 'cb-cust-4'},
                            {xtype: 'checkboxfield', boxLabel: 'Item 5', name: 'cb-cust-5'}
                        ]
                    }]
                }]
            };

            /*
             * ====================================================================
             * RadioGroup examples
             * ====================================================================
             */
            // NOTE: These radio examples use the exact same options as the
            // checkbox ones
            // above, so the comments will not be repeated. Please see comments
            // above for
            // additional explanation on some config options.

            var radioGroup = {
                xtype: 'fieldset',
                title: 'Radio Groups',
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    labelStyle: 'padding-left:4px;'
                },
                collapsible: true,
                items: [{
                    xtype: 'textfield',
                    name: 'txt-test4',
                    fieldLabel: 'Alignment Test'
                },{
                    xtype: 'radiogroup',
                    fieldLabel: 'Auto Layout',
                    cls: 'x-check-group-alt',
                    items: [
                        {boxLabel: 'Item 1', name: 'rb-auto', inputValue: 1},
                        {boxLabel: 'Item 2', name: 'rb-auto', inputValue: 2, checked: true},
                        {boxLabel: 'Item 3', name: 'rb-auto', inputValue: 3},
                        {boxLabel: 'Item 4', name: 'rb-auto', inputValue: 4},
                        {boxLabel: 'Item 5', name: 'rb-auto', inputValue: 5}
                    ]
                },{
                    xtype: 'radiogroup',
                    fieldLabel: 'Single Column',
                    columns: 1,
                    items: [
                        {boxLabel: 'Item 1', name: 'rb-col', inputValue: 1},
                        {boxLabel: 'Item 2', name: 'rb-col', inputValue: 2, checked: true},
                        {boxLabel: 'Item 3', name: 'rb-col', inputValue: 3}
                    ]
                },{
                    xtype: 'radiogroup',
                    fieldLabel: 'Multi-Column (horizontal)',
                    cls: 'x-check-group-alt',
                    columns: 3,
                    items: [
                        {boxLabel: 'Item 1', name: 'rb-horiz-1', inputValue: 1},
                        {boxLabel: 'Item 2', name: 'rb-horiz-1', inputValue: 2, checked: true},
                        {boxLabel: 'Item 3', name: 'rb-horiz-1', inputValue: 3},
                        {boxLabel: 'Item 1', name: 'rb-horiz-2', inputValue: 1, checked: true},
                        {boxLabel: 'Item 2', name: 'rb-horiz-2', inputValue: 2}
                    ]
                },{
                    xtype: 'radiogroup',
                    fieldLabel: 'Multi-Column (vertical)',
                    columns: 3,
                    vertical: true,
                    items: [
                        {boxLabel: 'Item 1', name: 'rb-vert', inputValue: 1},
                        {boxLabel: 'Item 2', name: 'rb-vert', inputValue: 2, checked: true},
                        {boxLabel: 'Item 3', name: 'rb-vert', inputValue: 3},
                        {boxLabel: 'Item 4', name: 'rb-vert', inputValue: 4},
                        {boxLabel: 'Item 5', name: 'rb-vert', inputValue: 5}
                    ]
                },{
                    xtype: 'radiogroup',
                    fieldLabel: 'Multi-Column<br />(custom widths)',
                    cls: 'x-check-group-alt',
                    columns: [100, 100],
                    vertical: true,
                    items: [
                        {boxLabel: 'Item 1', name: 'rb-custwidth', inputValue: 1},
                        {boxLabel: 'Item 2', name: 'rb-custwidth', inputValue: 2, checked: true},
                        {boxLabel: 'Item 3', name: 'rb-custwidth', inputValue: 3},
                        {boxLabel: 'Item 4', name: 'rb-custwidth', inputValue: 4},
                        {boxLabel: 'Item 5', name: 'rb-custwidth', inputValue: 5}
                    ]
                },{
                    xtype: 'radiogroup',
                    fieldLabel: 'Custom Layout<br />(w/ validation)',
                    allowBlank: false,
                    msgTarget: 'side',
                    autoFitErrors: false,
                    anchor: '-18',
                    layout: 'column',
                    defaultType: 'container',
                    items: [{
                        columnWidth: .25,
                        items: [
                            {xtype: 'component', html: 'Heading 1', cls:'x-form-check-group-label'},
                            {xtype: 'radiofield', boxLabel: 'Item 1', name: 'rb-cust', inputValue: 1},
                            {xtype: 'radiofield', boxLabel: 'Item 2', name: 'rb-cust', inputValue: 2}
                        ]
                    },{
                        columnWidth: .5,
                        items: [
                            {xtype: 'component', html: 'Heading 2', cls:'x-form-check-group-label'},
                            {xtype: 'radiofield', boxLabel: 'A long item just for fun', name: 'rb-cust', inputValue: 3}
                        ]
                    },{
                        columnWidth: .25,
                        items: [
                            {xtype: 'component', html: 'Heading 3', cls:'x-form-check-group-label'},
                            {xtype: 'radiofield', boxLabel: 'Item 4', name: 'rb-cust', inputValue: 4},
                            {xtype: 'radiofield', boxLabel: 'Item 5', name: 'rb-cust', inputValue: 5}
                        ]
                    }]
                }]
            };
            

              	