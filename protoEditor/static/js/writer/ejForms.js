//
    


    


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
//                    anchor: '30%',
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
    
    
    individual = {
            xtype: 'container',
        layout:'anchor',
        items:[{
            title:'Item 1',
            html:'100% 20%',
            width: '50%',
            anchor:'40%'
        },{
            title:'Item 2',
            html:'50% 30%',
            width: '50%',
            anchor:'40%'
//        },{
//            title:'Item 3',
//            html:'-100 50%',
//            anchor:'-100 50%'
        }]
    };    
    
    
    individual = Ext.create('Ext.Panel', {
        width: 500,
        height: 400,
        title: "VBoxLayout Panel",
        layout: {
            type: 'vbox',
            align: 'center'
        },
        renderTo: document.body,
        items: [{
            xtype: 'panel',
            title: 'Inner Panel One',
//            width: 250,
            flex: 2
        },
        {
            xtype: 'panel',
            title: 'Inner Panel Two',
//            width: 250,
            flex: 4
        },
        {
            xtype: 'panel',
            title: 'Inner Panel Three',
//            width: '50%',
            flex: 4
        }]
    });

    
//  
//  items: [{
//      columnWidth:.3,
//      fieldLabel: 'E mail',
//      name: 'email',
//      allowBlank: true,
//      vtype: 'email',         // Validation 
//      vtypeText: 'formato de correo no valido'
//  }, {
////      columnWidth:.5,
//      fieldLabel: 'Nombre',
//      name: 'name',
//      xtype: 'protoZoom', 
//      allowBlank: false,
//      blankText : 'Este campo es requerido '
//  }, {
//      fieldLabel: 'Tel',
//      name: 'phone',
//      allowBlank: true
//  }]

