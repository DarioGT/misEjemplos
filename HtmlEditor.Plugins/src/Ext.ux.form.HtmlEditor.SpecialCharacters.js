/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class Ext.ux.form.HtmlEditor.SpecialCharacters
 * @extends Ext.util.Observable
 * <p>A plugin that creates a button on the HtmlEditor for inserting special characters.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('Ext.ux.form.HtmlEditor.SpecialCharacters', {
    extend: 'Ext.util.Observable',

    // SpecialCharacters language text
    langTitle   : 'Insert Special Character',
    langInsert  : 'Insert',
    langCancel  : 'Cancel',

    /**
     * @cfg {Array} specialChars
     * An array of additional characters to display for user selection.  Uses numeric portion of the ASCII HTML Character Code only. For example, to use the Copyright symbol, which is &#169; we would just specify <tt>169</tt> (ie: <tt>specialChars:[169]</tt>).
     */
    specialChars: [153],

    /**
     * @cfg {Array} charRange
     * Two numbers specifying a range of ASCII HTML Characters to display for user selection. Defaults to <tt>[160, 256]</tt>.
     */
    charRange   : [160, 256],

    // private
    chars: [],

    // private
    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
    },

    // private
    onRender: function(){
        var cmp = this.cmp;
        var btn = this.cmp.getToolbar().add({
            iconCls: 'x-edit-char',
            handler: function(){
                if (!this.chars.length) {
                    if (this.specialChars.length) {
                        Ext.each(this.specialChars, function(c, i){
                            this.chars[i] = ['&#' + c + ';'];
                        }, this);
                    }
                    for (i = this.charRange[0]; i < this.charRange[1]; i++) {
                        this.chars.push(['&#' + i + ';']);
                    }
                }
                var charStore = Ext.create('Ext.data.ArrayStore',{
                    fields  : ['char'],
                    data    : this.chars
                });
                this.charWindow = Ext.create('Ext.window.Window',{
                    title       : this.langTitle,
                    width       : 436,
                    height      : 245,
                    layout      : 'fit',
                    plain       : true,
                    items       : [{
                        xtype       : 'dataview',
                        store       : charStore,
                        itemId      : 'charView',
                        autoHeight  : true,
                        multiSelect : true,
                        tpl         : new Ext.XTemplate('<tpl for="."><div class="char-item">{char}</div></tpl><div class="x-clear"></div>'),
                        overItemCls : 'char-over',
                        itemSelector: 'div.char-item',
                        trackOver   : true,
                        listeners: {
                            itemdblclick: function(view, record, item, index, e, ePpts){
                                this.insertChar(record.get('char'));
                                this.charWindow.close();
                            },
                            scope: this
                        }
                    }],
                    buttons: [{
                        text: this.langInsert,
                        handler: function(){
                            var dv = this.charWindow.down('#charView');
                            Ext.each(dv.getSelectedNodes(), function(node){
                                var c = dv.getRecord(node).get('char');
                                  this.insertChar(c);
                            }, this);
                            this.charWindow.close();
                        },
                        scope: this
                    }, {
                        text: this.langCancel,
                        handler: function(){
                            this.charWindow.close();
                        },
                        scope: this
                    }]
                });
                this.charWindow.show();
            },
            scope: this,
            tooltip: {
                title: this.langTitle
            },
            overflowText: this.langTitle
        });
    },
    /**
     * Insert a single special character into the document.
     * @param c String The special character to insert (not just the numeric code, but the entire ASCII HTML entity).
     */
    insertChar: function(c){
        if (c) {
            this.cmp.insertAtCursor(c);
        }
    }
});
