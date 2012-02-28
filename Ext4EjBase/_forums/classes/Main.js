Ext.define('ForumBrowser.Main', {
    extend: 'Ext.container.Viewport',
    
    initComponent: function(){
        Ext.apply(this, {
            layout: 'border',
            itemId: 'main',
            items: [{
                xtype: 'forumlist',
                region: 'west',
                width: 300,
                title: 'Forums',
                split: true,
                margins: '5 0 5 5'
            }, {
                region: 'center',
                xtype: 'tabpanel',
                margins: '5 5 5 0',
                minWidth: 400,
                border: false,
                tabBar: {
                    border: true
                },
                items: {
                    itemId: 'topic',
                    xtype: 'topiccontainer'
                }
            }]
        });
        this.callParent();
    },
    
    loadForum: function(rec){
        this.down('#topic').loadForum(rec);
    }  
});


Ext.define('ForumBrowser.Forum', {
    extend: 'Ext.data.Model',
    fields: ['id', 'text']
});

Ext.define('ForumBrowser.Topic', {
    extend: 'Ext.data.Model',
    idProperty: 'threadid',
    fields: ['title', 'forumtitle', 'forumid', 'author', {
        name: 'replycount',
        type: 'int'
    }, {
        name: 'lastpost',
        mapping: 'lastpost',
        type: 'date',
        dateFormat: 'timestamp'
    }, 'lastposter', 'excerpt']
});

