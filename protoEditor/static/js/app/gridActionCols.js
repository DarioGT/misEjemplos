
/**
 * Can I show and hide icons based on a condition in the grid data?

Yes, you can switch icons and hide / show icons based on values in your grid. Inside the getClass function of the
action column you can set the the css that will be applied to the action item icon.

The getClass function that controls the locked and unlocked icons is below. There is a boolean value in the closed 
column that is evaluated for each row. The built in extjs class x-hide-display will remove the icon from a grid cell.

getClass: function(value,metadata,record){
var closed = record.get('closed');
if (closed == 0 ) {
   return 'x-hide-display';
} else {
   return 'x-grid-center-icon';
}
}

* Can I programmatically switch icons in the action column?

Sure just click on one of the locks above, you can easily change between unlocked and locked icons by 
committing the new value in closed to the store in your handler. Since you have placed the logic in the getClass function it acts as a renderer and the view is refreshed when the store is updated. The code to commit the new closed value to the store is below.

handler: function(grid, rowIndex, colIndex) {
   var rec = grid.getStore().getAt(rowIndex);
   grid.getSelectionModel().select(rowIndex);
   grid.removeRowCls(grid.getNode(rowIndex),'line-through');
  // This is the line that does the trick
   grid.getStore().getAt(rowIndex).set('closed', 0);
},

* When I click on the icon it fires the action item handler and not the row selection action?

I noticed that too, just add the following line in your action item handler to select the row:

grid.getSelectionModel().select(rowIndex);


* How do I center icons in the action column, and how can I change the cursor?.

Ok, first you will need to add a css class in your main css file so that you may apply it to the icon in the action column. 
The following class will center the icons and preserve the cursor. You can see from the answer to the first question that 
we applied the class below in the getClass function.


.x-grid-center-icon{
  display:block;
  margin:0 auto;
  text-align:center;
  cursor:hand;
}

This should get you started with the actioncolumn.
 
 */



Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*'
]);

Ext.onReady(function() {
    Ext.QuickTips.init();
    
    // setup the state provider, all state information will be saved to a cookie
    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    // sample static data for the store
    var myData = [
        ['3m Co',                               71.72, 0.02,  0.03,  '9/1 12:00am',0],
        ['Alcoa Inc',                           29.01, 0.42,  1.47,  '9/1 12:00am',1],
        ['Altria Group Inc',                    83.81, 0.28,  0.34,  '9/1 12:00am',0],
        ['American Express Company',            52.55, 0.01,  0.02,  '9/1 12:00am',0],
        ['American International Group, Inc.',  64.13, 0.31,  0.49,  '9/1 12:00am',1],
        ['AT&T Inc.',                           31.61, -0.48, -1.54, '9/1 12:00am',1],
        ['Boeing Co.',                          75.43, 0.53,  0.71,  '9/1 12:00am',0],
        ['Caterpillar Inc.',                    67.27, 0.92,  1.39,  '9/1 12:00am',0],
        ['Citigroup, Inc.',                     49.37, 0.02,  0.04,  '9/1 12:00am',0],
        ['E.I. du Pont de Nemours and Company', 40.48, 0.51,  1.28,  '9/1 12:00am',0],
        ['Exxon Mobil Corp',                    68.1,  -0.43, -0.64, '9/1 12:00am',0],
        ['General Electric Company',            34.14, -0.08, -0.23, '9/1 12:00am',1],
        ['General Motors Corporation',          30.27, 1.09,  3.74,  '9/1 12:00am',1],
        ['Hewlett-Packard Co.',                 36.53, -0.03, -0.08, '9/1 12:00am',1],
        ['Honeywell Intl Inc',                  38.77, 0.05,  0.13,  '9/1 12:00am',1],
        ['Intel Corporation',                   19.88, 0.31,  1.58,  '9/1 12:00am',1],
        ['International Business Machines',     81.41, 0.44,  0.54,  '9/1 12:00am',1],
        ['Johnson & Johnson',                   64.72, 0.06,  0.09,  '9/1 12:00am',1],
        ['JP Morgan & Chase & Co',              45.73, 0.07,  0.15,  '9/1 12:00am',1],
        ['McDonald\'s Corporation',             36.76, 0.86,  2.40,  '9/1 12:00am',0],
        ['Merck & Co., Inc.',                   40.96, 0.41,  1.01,  '9/1 12:00am',0],
        ['Microsoft Corporation',               25.84, 0.14,  0.54,  '9/1 12:00am',0],
        ['Pfizer Inc',                          27.96, 0.4,   1.45,  '9/1 12:00am',0],
        ['The Coca-Cola Company',               45.07, 0.26,  0.58,  '9/1 12:00am',0],
        ['The Home Depot, Inc.',                34.64, 0.35,  1.02,  '9/1 12:00am',0],
        ['The Procter & Gamble Company',        61.91, 0.01,  0.02,  '9/1 12:00am',0],
        ['United Technologies Corporation',     63.26, 0.55,  0.88,  '9/1 12:00am',0],
        ['Verizon Communications',              35.57, 0.39,  1.11,  '9/1 12:00am',0],
        ['Wal-Mart Stores, Inc.',               45.45, 0.73,  1.63,  '9/1 12:00am',0]
    ];

    /**
     * Custom function used for column renderer
     * @param {Object} val
     */
    function change(val) {
        if (val > 0) {
            return '<span style="color:green;">' + val + '</span>';
        } else if (val < 0) {
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    }

    /**
     * Custom function used for column renderer
     * @param {Object} val
     */
    function pctChange(val) {
        if (val > 0) {
            return '<span style="color:green;">' + val + '%</span>';
        } else if (val < 0) {
            return '<span style="color:red;">' + val + '%</span>';
        }
        return val;
    }
    

    // create the data store
    var store = Ext.create('Ext.data.ArrayStore', {
        fields: [
           {name: 'company'},
           {name: 'price',      type: 'float'},
           {name: 'change',     type: 'float'},
           {name: 'pctChange',  type: 'float'},
           {name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'},
           {name: 'closed', type: 'int'}
        ],
        data: myData
    });

    // create the Grid
    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        stateful: true,
        stateId: 'stateGrid',
        columns: [
            {
                text     : 'Company',
                flex     : 1,
                sortable : false,
                dataIndex: 'company'
            },
            {
                text     : 'Price',
                width    : 75,
                sortable : true,
                renderer : 'usMoney',
                dataIndex: 'price'
            },
            {
                text     : 'Change',
                width    : 75,
                sortable : true,
                renderer : change,
                dataIndex: 'change'
            },
            {
                text     : '% Change',
                width    : 75,
                sortable : true,
                renderer : pctChange,
                dataIndex: 'pctChange'
            },
            {
                text     : 'Last Updated',
                width    : 85,
                sortable : true,
                renderer : Ext.util.Format.dateRenderer('m/d/Y'),
                dataIndex: 'lastChange'
            },
            {
                    xtype:'actioncolumn',
                    items: [{
                            icon:'locked.png',
                            tooltip:'<b>This order is CLOSED</b>, to reopen it please click on this icon.',
                            handler: function(grid, rowIndex, colIndex) {
                                    
                                    var rec = grid.getStore().getAt(rowIndex);
                                    
    
                                    grid.getSelectionModel().select(rowIndex);
                                
                                    
                                    grid.getStore().getAt(rowIndex).set('closed', 0);
                                    grid.removeRowCls(grid.getNode(rowIndex),'line-through');
                                },
                            style:'margin-left:5px',
                            getClass: function(value,metadata,record){
                                var closed = record.get('closed');
                                  if (closed == 0 ) {
                                    return 'x-hide-display';
                                    } else {
                                    return 'x-grid-center-icon';
                                    }
                                
                            }
                    },{
                            icon:'unlocked.png',
                            tooltip:'<b>This request is OPEN</b>. Please click the lock to close this request.',
                            handler: function(grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    
                                    
                                    
                                    grid.getStore().getAt(rowIndex).set('closed', 1);
                                    grid.addRowCls(grid.getNode(rowIndex),'line-through');
                                    
                                },
                            style:'margin-left:5px',
                            getClass: function(value,metadata,record){
                                var closed = record.get('closed');
                                  if (closed == 1 ) {
                                    return 'x-hide-display';
                                    } else {
                                    
                                    return 'x-grid-center-icon';
                                    }
                                    
                            }
                    }]},
        ],
        height: 450,
        width: 550,
        title: 'Acme Trading Partners Open and Closed Order Grid',
        renderTo: 'grid-example',
        scroll:true,
        viewConfig: {
            stripeRows: true
        }
    });
});
