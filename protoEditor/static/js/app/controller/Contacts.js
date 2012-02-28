Ext.define('TDC2011.controller.Contacts', {
    extend: 'Ext.app.Controller',
    stores: ['Contacts'],
    models: ['Contact'],
    views: ['contact.Edit', 'contact.List'],
    refs: [{
            ref: 'contactsPanel',
            selector: 'panel'
        },{
            ref: 'contactlist',
            selector: 'contactlist'
        }
    ],

    init: function() {
        this.control({
            'contactlist dataview': {
                itemdblclick: this.editUser
            },
            'contactlist button[action=add]': {
            	click: this.editUser
            },
            'contactlist button[action=delete]': {
                click: this.deleteUser
            },
            'contactedit button[action=save]': {
                click: this.updateUser
            }
        });
        
        // Global 
        myStore = this.getContactsStore()
    },

    editUser: function(grid, record) {
        var edit = Ext.create('TDC2011.view.contact.Edit').show();
        
        if(record){
        	edit.down('form').loadRecord(record);
        }
    },
    
    updateUser: function(button) {
        var win    = button.up('window'),
            form   = win.down('form'),
            record = form.getRecord(),
            values = form.getValues();
		
		if (values.id > 0) {
			record.set(values);
//			record.commit();
		} else {
			record = Ext.create('TDC2011.model.Contact');
			record.set(values);
			record.setId(0);
//			record.commit();
			this.getContactsStore().add(record);
		}
		
		win.close();
//        this.getContactsStore().sync();
    },
    
    deleteUser: function(button) {
    	
    	var grid = this.getContactlist(),
    	record = grid.getSelectionModel().getSelection(), 
        store = this.getContactsStore();

    	try {
    		store.remove(record);
    	} catch(err) {}; 
//		store.sync();
    }
});