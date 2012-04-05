/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class Ext.ux.form.HtmlEditor.IndentOutdent
 * @extends Ext.ux.form.HtmlEditor.MidasCommand
 * <p>A plugin that creates two buttons on the HtmlEditor for indenting and outdenting of selected text.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('Ext.ux.form.HtmlEditor.IndentOutdent', {
    extend: 'Ext.ux.form.HtmlEditor.MidasCommand',

    // private
    midasBtns: ['|', {
        cmd: 'indent',
        tooltip: {
            title: 'Indent Text'
        },
        overflowText: 'Indent Text'
    }, {
        cmd: 'outdent',
        tooltip: {
            title: 'Outdent Text'
        },
        overflowText: 'Outdent Text'
    }]
});
