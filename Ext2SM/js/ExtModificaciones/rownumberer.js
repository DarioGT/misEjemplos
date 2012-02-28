Ext.grid.PagedRowNumberer = function(config){

    Ext.apply(this, config);

    if(this.rowspan){

        this.renderer = this.renderer.createDelegate(this);

    }

};



Ext.grid.PagedRowNumberer.prototype = {

    header: "",

    width: 35,

    sortable: false,

    fixed:false,

    hideable: false,

    dataIndex: '',

    id: 'numberer',

    rowspan: undefined,

    

    renderer : function(v, p, record, rowIndex, colIndex, store){

        if(this.rowspan){

            p.cellAttr = 'rowspan="'+this.rowspan+'"';

        }

        var i = store.lastOptions.params.start;

        if (isNaN(i)) {

            i = 0;

        }

        i = i + rowIndex + 1;

        i = Number(i).toLocaleString(); //May not work in all browsers.

        return i;

    }

}; 
