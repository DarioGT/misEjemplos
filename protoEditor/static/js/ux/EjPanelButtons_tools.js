Ext.create('Ext.grid.Panel', {
    title: 'Simpsons',
    store: Ext.data.StoreManager.lookup('simpsonsStore'),
    columns: [
        { header: 'Name',  dataIndex: 'name' },
        { header: 'Email', dataIndex: 'email', flex: 1 },
        { header: 'Phone', dataIndex: 'phone' }
    ],
    height: 200,
    width: 400,

//  *********************
    tools:[
    {
        type:'help',
        tooltip: 'Get Help',
        handler: function(event, toolEl, panel){
            alert('Do you need help?');
            // show help here
        }
    }],
    renderTo: Ext.getBody()
});
​


//  

Ext.create('Ext.panel.Panel', {
    width: 200,
    height: 200,
    renderTo: document.body,
    title: 'A Panel',
    tools: [{
        type: 'help',
        handler: function(){
            // show help here
        }
    }, {
        itemId: 'refresh',
        type: 'refresh',
        hidden: true,
        handler: function(){
            // do refresh
        }
    }, {
        
        // Para ocultarlos o presentarlos 
        type: 'search',
        handler: function(event, target, owner, tool){
            // do search
            owner.child('#refresh').show();
        }
    }]
});

/*
The type of tool to render. The following types are available:
    close
    minimize
    maximize
    restore
    toggle
    gear
    prev
    next
    pin
    unpin
    right
    left
    down
    up
    refresh
    plus
    minus
    search
    save
    help
    print
    expand
    collapse
 */

    
    