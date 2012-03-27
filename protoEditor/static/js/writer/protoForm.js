// *  margins  TRBL,  TB RL, T RL B 

Ext.require([
    'Ext.form.*',
    'Ext.data.*',
    'Ext.tip.QuickTipManager'
]);

function defineProtoFormField ( prVar ){
    
    var prFld  =  {};
    //DGT  getFld 

    if ( typeof(prVar) == 'string') {
        prFld.name = prVar; 
        prFld.xtype = 'textfield'; 
        prFld.fieldLabel = prVar ; 
    } else if ( typeOf(prVar) == 'object' ) {
        prFld.name = prVar.name ; 
        prFld.fieldLabel = prVar.name ; 
        prFld.xtype = 'textfield'; 
        if (prVar.width ) prFld.width = prVar.width ;
        if (prVar.anchor ) prFld.anchor = prVar.anchor ;
        if (prVar.flex ) prFld.flex = prVar.flex ; 

    } else if ( typeOf(prVar) == 'array' ) {

        prFld = {
            xtype: 'fieldcontainer',
            // fieldLabel: '',
            // labelStyle: 'font-weight:bold;padding:0',
            combineErrors: true,
            msgTarget : 'side',
            layout: 'hbox',
            margins: 0, 
            pad: 0, 
            frame: false, 
            defaults: {
                flex: 1, 
                // labelAlign: 'top'
                // hideLabel: true
                // margins: '0 10 0 0'
            },
            items :[]
        }        

        for (var ix in prVar  ) {
            var prVar2  =  prVar[ix];
            var prFld2 = defineProtoFormField( prVar2 )
            if (prFld2) {
                if ( ix < (prVar.length-1) ) {
                    prFld2.margins = '0 10 0 0'
                } else prFld2.margins = '0 0 0 0'
                prFld2.frame = false; 
                prFld.items.push (  prFld2  );
            }
        }   

    } else { return  
    } ;

    return prFld; 
}

function defineProtoFormItem ( prSection ) {

    var prLayout = { items : [] };

    /*  ---------------------------------------------------------------
     * Se asegura de un tipo de section valida,
     * La section es la unica que tiene campos definidos
     * Las cajas solo pueden contener otras sectiones
     ----------------------------------------------------------------- */
    if (!(prSection.style  in oc(['Section', 'Box', 'Tab', 'Card', 'Accordion']))) {
        prSection.style = 'Section' 
        if (prSection.items) prSection.style = 'Box'
    }

    // Define los campos 
    if ( prSection.style == 'Section') {
        
        prLayout.xtype = 'container';
        prLayout.layout = 'anchor';
        prLayout.defaultType = 'textfield';
        prLayout.anchor = '100%';

        if ( prSection.title || prSection.collapsible ) {
            prLayout.xtype = 'fieldset';
            if (prSection.title) prLayout.title = prSection.title;
            if (prSection.collapsible)  prLayout.collapsible = prSection.collapsible;
            if (prSection.collaped) prLayout.collapsed = prSection.collapsed;

            if ( prSection.checkField ) {
                prLayout.checkboxToggle = true; 
            }
        } 


        prLayout.defaults = { flex : 1, anchor : '100%' }; 
        
//      margins  TRBL,  TB RL, T RL B
        if ( prSection.margins ) prLayout.defaults.margins = prSection.margins;
        // else prLayout.defaults.margins = '10 10 0';

        prLayout.fieldDefaults  = {};
        if ( prSection.labelAlign ) prLayout.fieldDefaults.labelAlign =prSection.labelAlign;
        if ( prSection.labelWidth ) prLayout.fieldDefaults.labelWidth =prSection.labelWidth;
        if ( prSection.labelStyle ) prLayout.fieldDefaults.labelStyle =prSection.labelStyle;

        for (var ix in prSection.fields  ) {
            var prVar  =  prSection.fields[ix];
            prFld = defineProtoFormField( prVar )
            if (prFld) prLayout.items.push (  prFld  );
        }   


    } else  if ( prSection.style == 'Box' ) {

        prLayout.xtype = 'container';
        prLayout.layout = 'hbox';
        prLayout.defaultType = 'textfield';
        prLayout.anchor = '100%';

        if ( prSection.title || prSection.collapsible ) {
            prLayout.xtype = 'fieldset';
            if (prSection.title) prLayout.title = prSection.title;
            if (prSection.collapsible)  prLayout.collapsible = prSection.collapsible;
            if (prSection.collaped) prLayout.collapsed = prSection.collapsed;
        } 

        for (var ix in prSection.items  ) {
            var section  =  prSection.items[ix];
            prBox = defineProtoFormItem( section ) ;
            if ( prBox ) {
                prBox.flex = 1; 
                if ( ix < (prSection.items.length-1) ) {
                    prBox.margins = '0 10 0 0'
                } else prBox.margins = '0 0 0 0'
                prLayout.items.push ( prBox ); 

            }
        }            

    } else  if ( prSection.style in  oc(['Tab', 'Card', 'Accordion'])) {

        if ( prSection.style == 'Tab' ) {
            prLayout.xtype = 'tabpanel';
            prLayout.activeTab = 0;
        }        
        if ( prSection.style == 'Card') {
            prLayout.xtype = 'card';
            prLayout.activeItem = 0;
            prLayout.bbar = ['->', {
                id: 'card-prev',
                text: '&laquo; Previous'
            },{
                id: 'card-next',
                text: 'Next &raquo;'
            }]
        }       
        if ( prSection.style == 'Accordion') {
            prLayout.xtype = 'accordion';
        }   
        
        prLayout.defaultType = 'textfield';

        for (var ix in prSection.items  ) {
            var section  =  prSection.items[ix];
            prBox = defineProtoFormItem( section ) ;
            if ( prBox ) {
                prBox.title = section.title ; 
                prLayout.items.push ( prBox ); 
            }
        }            


    };
    
    return prLayout;  
    
};
    

function defineProtoForm ( protoForm ) {

    
    var prFormLayout = []; 
    
    for (var ixV in protoForm.items  ) {
        var section  =  protoForm.items[ixV];
        prFormLayout.push ( defineProtoFormItem( section ) ); 
    }

    

    // combine all that into one huge form
    var form = Ext.create('Ext.FormPanel', {
        
        title: protoForm.title,  
        frame: true,
        autoScroll : true, 
        // bodyPadding: 10,
        xtype: 'container',
        layout:'anchor',
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },
        fieldDefaults: {
            labelWidth: 100
        },
        
        items: prFormLayout,
        // items: individual,
        
        buttons: [{
            text: 'Save',
            handler: function(){
               if(fp.getForm().isValid()){
                    Ext.Msg.alert('Submitted Values', 'The following will be sent to the server: <br />'+
                        fp.getForm().getValues(true).replace(/&/g,', '));
                }
            }
        },{
            text: 'Reset',
            handler: function(){
                fp.getForm().reset();
            }
        }]
    });        

    return form; 
}