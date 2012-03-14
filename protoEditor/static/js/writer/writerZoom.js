
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
     
    // override onTriggerClick
    onTriggerClick: function() {
//        Ext.Msg.alert('Status', 'You clicked my trigger!');
    	this.showZoomForm( this );
    }, 
    
    

    showZoomForm:  function( me ) {
    
    	var win = me.win; 
    	
        if (!win) {

        	// var form = Ext.widget('writerform');  
        	var form = Ext.widget('protozoomcont');  

            win = Ext.widget('window', {
                title: 'Contact Us',
                closeAction: 'hide',
                width: 600,
                height: 800,
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
    }

        
});

Ext.define('Ext.ux.field.protoZoomCont', {
    extend: 'Ext.container.Container',
    alias: 'widget.protozoomcont',

        padding: '0 0 0 20',
        width: 800,
        height: 600,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
           itemId: 'form',
           xtype: 'writerform',
           height: 150,
           margins: '0 0 10 0',

           // listeners: {
               // create: function(form, data){
          		// data._ptStatus = 'NEW_ROW'
       			// record = Ext.create('Writer.Person');
       			// record.set(data);
       			// record.setId(0);
                // store.insert(0, record);
               // }}
       }, {
            itemId: 'grid',
            xtype: 'writergrid',
            title: 'User List',
            flex: 1,
            // store: store,
            // listeners: {
                // selectionchange: function(selModel, selected) {
                   // main.child('#form').setActiveRecord(selected[0] || null);
                // }
            // }
        }]
    });

