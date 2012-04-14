Ext.define('Ext.ux.form', {
    extend: 'Ext.form.Panel',
    initComponent: function() {
      this.on('beforeadd', function(me, field){
        if (!field.allowBlank)
          field.labelSeparator += '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>';
      });
      this.callParent(arguments);
    }
    
});

Ext.create('Ext.ux.form', {
    title: 'Simple Form',
    bodyPadding: 5,
    width: 350,

    

    // Fields will be arranged vertically, stretched to full width
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },

    // The fields
    defaultType: 'textfield',
    items: [{
        fieldLabel: 'First Name',
        name: 'first',
        allowBlank: false
    },{
        fieldLabel: 'Last Name',
        name: 'last'
    }],
    renderTo: Ext.getBody()
});
​

//http://jsfiddle.net/molecule/2QjyZ/1/