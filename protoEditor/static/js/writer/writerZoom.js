
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

        	var form = Ext.widget('writerform');  

            win = Ext.widget('window', {
                title: 'Contact Us',
                closeAction: 'hide',
                width: 400,
                height: 400,
                minHeight: 400,
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
