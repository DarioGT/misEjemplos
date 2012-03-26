/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class Ext.ux.form.HtmlEditor.Font
 * @extends Ext.util.Observable
 * <p>A plugin that creates a menu on the HtmlEditor for selecting a font. Uses the HtmlEditors default font settings which can be overriden on that component to change the list of fonts or default font.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('Ext.ux.form.HtmlEditor.Font', {
    extend: 'Ext.util.Observable',

    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
        this.cmp.on('initialize', this.initialize, this);
    },

    initialize: function () {
        Ext.EventManager.on(this.cmp.getDoc(), {
            'mousedown' : this.onEditorEvent,
            'dblclick'  : this.onEditorEvent,
            'click'     : this.onEditorEvent,
            'keyup'     : this.onEditorEvent,
            buffer      : 100,
            scope       : this
        });
    },

    // private
    onRender: function(){
        var cmp = this.cmp;

        var fonts = function(){
            var fnts = [];
            Ext.each(cmp.fontFamilies, function(itm){
                fnts.push([itm.toLowerCase(),itm]);
            });
            return fnts;
        }();

        var btn = this.cmp.getToolbar().add({
            xtype           : 'combo',
            displayField    : 'display',
            valueField      : 'value',
            name            : 'fontfamily',
            itemId          : 'fontfamily',
            forceSelection  : true,
            mode            : 'local',
            triggerAction   : 'all',
            width           : 120,
            emptyText       : 'Font',
            tpl             : '<tpl for="."><div class="x-boundlist-item" style="font-family:{value};">{display}</div></tpl>',
            value           : cmp.defaultFont,
            store           : Ext.create('Ext.data.ArrayStore', {
                autoDestroy : true,
                fields      : ['value','display'],
                data        : fonts
            }),
            listeners: {
                'select': function(combo,rec){
                    var r = rec[0];
                    this.relayCmd('fontname', r.get('value'));
                    this.deferFocus();
                    combo.reset();
                },
                scope: cmp
            }
        });
    },

    // private
    onEditorEvent: function(e) {
        this.updateToolbar();
    },

    /**
     * Triggers a toolbar update by reading the markup state of the current selection in the editor.
     * @protected
     */
    updateToolbar: function() {
        var me = this,
            doc, font, fontSelect;

        doc = me.cmp.getDoc();

        fontSelect = me.cmp.getToolbar().down('#fontfamily');
        font = (doc.queryCommandValue('FontName')  || me.cmp.defaultFont).toLowerCase();

        if (font !== fontSelect.getValue()) {
            fontSelect.setValue(font);
        }
    }
});