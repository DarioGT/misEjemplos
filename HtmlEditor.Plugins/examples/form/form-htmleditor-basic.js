/**
 * @author Shea
 */

Ext.onReady(function(){

    Ext.QuickTips.init();

    new Ext.form.Panel({
        title       : 'HtmlEditor Plugins Form',
        renderTo    : 'test',
        width       : 1250,
        height      : 500,
        border      : true,
        frame       : true,
        items       : [{
            hideLabel       : true,
            labelSeparator  : '',
            name            : 'description',
            anchor          : '100% 100%',
            xtype           : "htmleditor",
            plugins         : Ext.ux.form.HtmlEditor.plugins()
        }],
    });
    
 });