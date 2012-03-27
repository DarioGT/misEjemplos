//Dg  Este ejemplo maneja la actualizacion completa con varias configuraciones  ( batch,  auto,  ... ) 
// http://dev.sencha.com/deploy/ext-4.0.0/examples/writer/writer.js


// --------------------------------------------------------------------------------------

ERR_EXIST = 'ERR_EXIST'
ERR_NOEXIST = 'ERR_NOEXIST'
ERR_ADD = 'ERR_ADD'
ERR_UPD = 'ERR_UPD'
ERR_DEL = 'ERR_DEL'
NEW_ROW = 'NEW_ROW'

Ext.define('Writer.Person', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, '_ptStatus', 
    	'email', 'name', 'phone'
    	
    ],

    validations: [{
        type: 'length',
        field: 'name',
        min: 1
    }]
});

Ext.require([
    'Ext.data.*',
    'Ext.tip.QuickTipManager',
    'Ext.window.MessageBox'
]);



Ext.onReady(function(){
	
    // Otro sinonimo puede ser:  Ext.QuickTips.init();
    Ext.tip.QuickTipManager.init();

    setCsRfToken(); 
    
    var store = Ext.create('Ext.data.Store', {
        model: 'Writer.Person',
        autoLoad: true,
        autoSync: true,
        proxy: {
            type: 'ajax',
            api: {
            	read : 'contact/view.action',
                create : 'contact/create.action/',
                update: 'contact/update.action/',
                destroy: 'contact/delete.action/'
            },
            reader: {
                type: 'json',
                root: 'data',
                successProperty: 'success',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: true,
                root: 'data'
            },
            listeners: {
                exception: function(proxy, response, operation){
                    Ext.MessageBox.show({
                        title: 'REMOTE EXCEPTION',
                        msg: operation.getError(),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        },
        listeners: {
        	
	 		// Fired when a Model instance has been added to this Store ...
			add: function ( store, records,  index,  eOpts ) {
				var msg = 'add';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			}, 
	 
			// Fires before a request is made for a new data object. ...
			beforeload: function(  store,  operation,  eOpts ) {
				var msg = 'beforeload';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
	 
			// Fired before a call to sync is executed. Return false from any listener to cancel the synv
			beforesync: function(  options,  eOpts ) {
				var msg = 'beforesync';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
	
			// Fired after the removeAll method is called. ...
			clear: function ( store,  eOpts ) {
				var msg = 'clear';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
	 
			 
			// Fires whenever the store reads data from a remote data source. ...
			load: function ( store, records,  successful,  eOpts ) {
				var msg = 'load';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
			 
			// Fired when a Model instance has been removed from this Store ...
			remove: function (  store,  record,  index,  eOpts ) {
				var msg = 'remove';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
			 
			// Fires when a Model instance has been updated ...\    	
			update: function ( store,  record,  sOperation,  eOpts ) {
				var msg = 'update';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},  

			// Fires whenever the records in the Store have changed in some way - this could include adding or removing records, or ...
			datachanged: function( store,  eOpts ) {
				var msg = 'datachanged';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
	    	
	    	// Fires whenever a successful write has been made via the configured Proxy 
	        write: function(store, operation, eOpts ){
				var title =   'Event:';            	
				var msg = 'write ' + operation.action + ' ' + operation.resultSet.message ;   

				for ( var ix in operation.resultSet.records ) {
					var record = operation.resultSet.records[ix]
					
					if ((operation.action == 'destroy') && ( record.data._ptStatus != '' )) {
	        			// record = Ext.create('Writer.Person');
	        			// record.set(record.data);
	                    store.insert(0, record);
					};
					
		            msg = msg + ' - ' + Ext.String.format("Reg: {0}", record.getId()); 
				}
	            Ext.outils.msg(title, msg );
	                
	        }
        	
        }
    });

    var main = Ext.create('Ext.container.Container', {
//        padding: '0 0 0 20',
        width: 800,
        height: 600,
        renderTo: document.body,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
           itemId: 'form',
           xtype: 'writerform',
//           height: 150,
//           margins: '0 0 10 0',

           listeners: {
               create: function(form, data){
              	
              		data._ptStatus = 'NEW_ROW'
       			record = Ext.create('Writer.Person');
       			record.set(data);
       			record.setId(0);
               	
                   store.insert(0, record);
               }
           }
       }, {
            itemId: 'grid',
            xtype: 'writergrid',
            title: 'User List',
            flex: 1,
            store: store,
            listeners: {
                selectionchange: function(selModel, selected) {
                	
                   main.child('#form').setActiveRecord(selected[0] || null);
                	
                }
            }
        }]
    });
});

//Object converter: Para testear si un elto hace parte de un array se convierte el array en objeto 
function oc(a)
{
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}

function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (Object.prototype.toString.call(value) == '[object Array]') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}


// ------------------------------------------------------------------

