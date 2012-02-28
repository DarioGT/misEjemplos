Ext.define('TDC2011.store.Contacts', {
    extend: 'Ext.data.Store',
    model: 'TDC2011.model.Contact',
    autoLoad: true,
    autoSync: false, 
    pageSize: 35,
    autoLoad: {start: 0, limit: 35},

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
 
		// Fires whenever the records in the Store have changed in some way - this could include adding or removing records, or ...
		datachanged: function( store,  eOpts ) {
			var msg = 'datachanged';
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
    	
    	// Fires whenever a successful write has been made via the configured Proxy 
        write: function(store, operation, eOpts ){
			var title =   'Event:';            	
			var msg = 'write ' + operation.action + ' ' + operation.resultSet.message ;   

            var record = operation.records[0]
            var op = Ext.String.capitalize(operation.action)
                
            msg = msg + ' - ' + Ext.String.format("{0} user: {1}", op, record.getId()); 
            Ext.outils.msg(title, msg );
        }
    },
    
    proxy: {
        type: 'ajax',
        batchActions : true, 
        batchOrder : "create,update,destroy", 
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
            writeAllFields: false,
            encode: false,
            root: 'data'
        },
        listeners: {
            exception: function(proxy, response, operation){
//				var msg = operation.request.scope.reader.jsonData["message"] ;
            	var msg = operation.getError();
				var title =   'REMOTE EXCEPTION'            	
            	Ext.outils.msg( title ,  msg ); 
            } 
             
        },

        afterRequest:function( request, success ){
			var title =   'afterRequest ' +  success.toString();             	
			var msg = request.method + '.' + request.action ;

    		var jsData = request.scope.reader.jsonData;
        	if ( jsData["message"] ) {
        		msg += '  :' + jsData["message"]
        	}
        	Ext.outils.msg( title ,  msg ); 
        } 

    }
});