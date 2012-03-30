// * margins TRBL, TB RL, T RL B

Ext.require([
        'Ext.form.*', 'Ext.data.*', 'Ext.tip.QuickTipManager'
]);

function defineProtoFormField(prVar) {
    
    var _labelWidth = 75;
    
    var prFld = {
        xtype : 'textfield',
        msgTarget : 'side'
    };
    
    // DGT traer la definicion del campo getFld
    
    // labelStyle: 'font-weight:bold;padding:0',
    // labelAlign: 'top'
    // hideLabel: true
    // margins: '0 10 0 0'
    
    if (typeof (prVar) == 'string') {
        prFld.name = prVar;
        prFld.fieldLabel = prVar;
        prFld.labelWidth = _labelWidth;
        
    } else if (typeOf(prVar) == 'object') {
        prFld.name = prVar.name;
        prFld.fieldLabel = prVar.name;
        prFld.labelWidth = _labelWidth;
        
        if (prVar.width) prFld.width = prVar.width;
        if (prVar.anchor) prFld.anchor = prVar.anchor;
        if (prVar.flex) prFld.flex = prVar.flex;
        if (prVar.labelWidth) prFld.labelWidth = pVar.labelWidth;
        
    } else if (typeOf(prVar) == 'array') {
        prFld.xtype = 'fieldcontainer';
        prFld.combineErrors = true;
        prFld.layout = 'hbox';
        prFld.margins = 0;
        prFld.pad = 0;
        prFld.frame = false;
        prFld.defaults = {
            flex : 1
        };
        prFld.items = [];
        
        for ( var ix in prVar) {
            var prVar2 = prVar[ix];
            var prFld2 = defineProtoFormField(prVar2)
            if (prFld2) {
                if (ix < (prVar.length - 1)) {
                    prFld2.margins = '0 10 0 0'
                } else prFld2.margins = '0 0 0 0'
                prFld2.frame = false;
                prFld.items.push(prFld2);
            }
        }
        
    } else {
        return
    }
    
    return prFld;
}

function defineProtoFormItem(parent, prSection) {
    
    var prLayout = {
        items : []
    };
    
    /*
     * --------------------------------------------------------------- Se
     * asegura de un tipo de section valida, La section es la unica que tiene
     * campos definidos Las cajas solo pueden contener otras sectiones
     * -----------------------------------------------------------------
     */
    if (!(prSection.style in oc([
            'Section', 'HBox', 'Tab', 'VBox', 'Accordion', 'Grid'
    ]))) {
        prSection.style = 'Section'
        if (prSection.items) prSection.style = 'HBox'
    }
    
    if (parent.style == 'HBox') {
        // Las cajas al interior de un box no pueden estar collapsadas
        if (prSection.collapsed) prSection.collapsed = undefined;
    };
    
    // Define los campos
    if (prSection.style == 'Section') {
        
        prLayout.xtype = 'container';
        prLayout.frame = true;
        prLayout.border = 10;
        prLayout.margins = '10 10 0';
        prLayout.layout = 'anchor';
        prLayout.defaultType = 'textfield';
        prLayout.anchor = '100%';
        prLayout.defaults = {
            flex : 1,
            anchor : '100%'
        };
        prLayout.defaults.margins = '10 10 0';
        
        if (prSection.title || prSection.collapsible || prSection.frame) {
            prLayout.xtype = 'fieldset';
            prLayout.padding = 5;
            
            if (prSection.title) prLayout.title = prSection.title;
            if (prSection.collapsible) prLayout.collapsible = prSection.collapsible;
            if (prSection.collapsed) prLayout.collapsed = prSection.collapsed;
            if (prSection.checkField) prLayout.checkboxToggle = true;
        }
        
        if (parent.style == 'Accordion') {
            prLayout.xtype = 'panel';
            prLayout.margins = '2';
            prLayout.frame = true;
            prLayout.bodyBorder = true;
        }
        
        if (prSection.autoScroll) {
            prLayout.autoScroll = true;
            prLayout.xtype = 'panel';
        }
        
        // TRBL, TB RL, T RL B
        if (prSection.margins) prLayout.defaults.margins = prSection.margins;
        if (prSection.padding) prLayout.defaults.padding = prSection.padding;
        
        prLayout.fieldDefaults = {};
        if (prSection.labelAlign) prLayout.fieldDefaults.labelAlign = prSection.labelAlign;
        if (prSection.labelWidth) prLayout.fieldDefaults.labelWidth = prSection.labelWidth;
        if (prSection.labelStyle) prLayout.fieldDefaults.labelStyle = prSection.labelStyle;
        
        for ( var ix in prSection.fields) {
            var prVar = prSection.fields[ix];
            prFld = defineProtoFormField(prVar)
            if (prFld) prLayout.items.push(prFld);
        }
        
    } else if (prSection.style == 'VBox') {
        
        // Es realmente un contenedor para poder incluir secciones en Tabs o
        // Accordions
        prLayout.xtype = 'container';
        prLayout.layout = 'anchor';
        prLayout.anchor = '100%';
        prLayout.defaults = {
            anchor : '100%'
        }

        if (prSection.height) prLayout.height = prSection.height;
        if (prSection.frame) prLayout.frame = prSection.frame;
        
        if (prSection.title || prSection.collapsible) {
            prLayout.xtype = 'panel';
            if (prSection.title) prLayout.title = prSection.title;
            if (prSection.collapsible) prLayout.collapsible = prSection.collapsible;
            if (prSection.collaped) prLayout.collapsed = prSection.collapsed;
        }
        
        for ( var ix in prSection.items) {
            var section = prSection.items[ix];
            prBox = defineProtoFormItem(prSection, section);
            if (prBox) {
                prLayout.items.push(prBox);
            }
        }
        if (parent.style in oc([
                'Tab', 'Accordion'
        ])) {
            prLayout.xtype = 'panel';
            prLayout.autoScroll = true;
        }
        
    } else if (prSection.style == 'HBox') {
        
        prLayout.xtype = 'container';
        prLayout.layout = 'hbox';
        prLayout.defaultType = 'textfield';
        prLayout.anchor = '100%';
        
        if (prSection.height) prLayout.height = prSection.height;
        
        if (prSection.title || prSection.collapsible) {
            prLayout.xtype = 'fieldset';
            if (prSection.title) prLayout.title = prSection.title;
            if (prSection.collapsible) prLayout.collapsible = prSection.collapsible;
            if (prSection.collaped) prLayout.collapsed = prSection.collapsed;
        }
        
        for ( var ix in prSection.items) {
            var section = prSection.items[ix];
            prBox = defineProtoFormItem(prSection, section);
            if (prBox) {
                prBox.flex = 1;
                if (ix < (prSection.items.length - 1)) {
                    prBox.margins = '0 5 0 0'
                } else prBox.margins = '0 0 0 0'
                prLayout.items.push(prBox);
                
            }
        }
        
    } else if (prSection.style in oc([
            'Tab', 'Accordion'
    ])) {
        
        if (prSection.height) prLayout.height = prSection.height;
        
        for ( var ix in prSection.items) {
            var section = prSection.items[ix];
            prBox = defineProtoFormItem(prSection, section);
            if (prBox) {
                prBox.title = section.title;
                if (prSection.style == 'Accordion') prBox.title = '<b>'
                        + section.title + '<b>';
                prBox.autoScroll = true;
                prLayout.items.push(prBox);
            }
        }
        
        if (prSection.style == 'Tab') {
            prLayout.xtype = 'tabpanel';
            prLayout.activeTab = 0;
        }
        if (prSection.style == 'Accordion') {
            prLayout.layout = 'accordion';
            if (!prSection.height) prLayout.height = 200;
            
            if (parent.style == 'HBox') {
                // Contenedor q soporte el box
                var prAux = {
                    xtype : 'panel',
                    margins : '0'
                }
                prAux.items = [
                    prLayout
                ];
                prLayout = prAux;
            }
        }
        
    }
    return prLayout;
    
};

function defineProtoForm(protoForm) {
    
    var prFormLayout = [];
    
    for ( var ixV in protoForm.items) {
        var section = protoForm.items[ixV];
        var prItem = defineProtoFormItem({
            style : 'panel'
        }, section)
        prFormLayout.push(prItem);
    }
    
    // combine all that into one huge form
    var form = Ext.create('Ext.FormPanel', {
        
        title : protoForm.title,
        frame : true,
        autoScroll : true,
        // bodyPadding: 10,
        xtype : 'container',
        layout : 'anchor',
        defaults : {
            anchor : '100%'
        },
        
        items : prFormLayout,
        // items: individual,
        
        buttons : [
                {
                    text : 'Save',
                    handler : function() {
                        if (fp.getForm().isValid()) {
                            Ext.Msg.alert('Submitted Values',
                                    'The following will be sent to the server: <br />'
                                            + fp.getForm().getValues(true)
                                                    .replace(/&/g, ', '));
                        }
                    }
                }, {
                    text : 'Reset',
                    handler : function() {
                        fp.getForm().reset();
                    }
                }
        ]
    });
    
    return form;
}