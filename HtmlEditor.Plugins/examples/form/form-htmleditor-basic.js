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
//            value           : 'The quick brown fox jumps over the fence<br/><img src="training.jpg" width="300" height="200"/>',
            anchor          : '100% 100%',
            xtype           : "htmleditor",
//            enableFont      : false,
            plugins         : Ext.ux.form.HtmlEditor.plugins()
        }],
        buttons     : [{
            text            : 'Save'
        }]
    });
    
 });