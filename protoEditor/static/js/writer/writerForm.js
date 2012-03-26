
Ext.define('Writer.Form', {
    extend: 'Ext.form.Panel',
    alias: 'widget.writerform',

    requires: ['Ext.form.field.Text', 
               'Ext.form.*' 
               ],
    
    initComponent: function(){
        this.addEvents('create' 
                );
        Ext.apply(this, {
            activeRecord: null,
            iconCls: 'icon-user',
            frame: true,           // Lo deja blanco o utiliza el theme.
//            title: 'User -- All fields are requiredxxx',
            defaultType: 'textfield',
//            bodyStyle: 'padding:5px 10px 0',
            maxHeight: 600, 
            autoScroll: true, 
            defaults: {
                bodyStyle: 'padding:5px 5px 0',                
                anchor: '100%'
            },
            fieldDefaults: {
                labelAlign: 'left',
                anchor: '100%',                
                autoFitErrors : true, 
                labelWidth: 80, 
                msgTarget: 'side' 
            },
            items: [{
                //
                xtype:'fieldset',
//              checkboxToggle:true,
                collapsible: true,
                title: 'User Information',
                defaultType: 'textfield',
//                collapsed: true,
                layout: 'anchor',
                
                items: [{
                    fieldLabel: 'E mail',
                    name: 'email',
                    allowBlank: true,
                    vtype: 'email',         // Validation 
                    vtypeText: 'formato de correo no valido'
                }, {
                    fieldLabel: 'Nombre',
                    name: 'name',
                    xtype: 'protoZoom', 
                    allowBlank: false,
                    blankText : 'Este campo es requerido '
                }, {
                    fieldLabel: 'Tel',
                    name: 'phone',
                    allowBlank: true
                }], 
                
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



