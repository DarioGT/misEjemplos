Ext.define('MY.fieldset', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.myfieldset',
    initComponent: function() {
        this.addEvents('beforeexpand', 'beforecollapse');
        this.callParent([arguments]);
    },
    setExpanded: function(expanded){
        var bContinue;
        if (expanded)
            bContinue = this.fireEvent('beforeexpand', this);
        else
            bContinue = this.fireEvent('beforecollapse', this);
        if (bContinue !== false)
            this.callParent([expanded]);
    }
});

// by Molecular Man 