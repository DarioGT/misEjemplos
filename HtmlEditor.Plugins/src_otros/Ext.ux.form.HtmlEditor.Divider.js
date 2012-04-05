/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class Ext.ux.form.HtmlEditor.Divider
 * @extends Ext.util.Observable
 * <p>A plugin that creates a divider on the HtmlEditor. Used for separating additional buttons.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('Ext.ux.form.HtmlEditor.Divider', {

    extend: 'Ext.util.Observable',

    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
    },

    // private
    onRender: function(){
        this.cmp.getToolbar().add(Ext.create('Ext.toolbar.Separator'));
    }
});