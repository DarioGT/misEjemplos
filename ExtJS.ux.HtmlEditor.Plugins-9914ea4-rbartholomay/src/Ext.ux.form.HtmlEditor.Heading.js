/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @contributor Somani - http://www.sencha.com/forum/member.php?51567-Somani
 * @class Ext.ux.form.HtmlEditor.HeadingButtons
 * @extends Ext.ux.form.HtmlEditor.MidasCommand
 * <p>A plugin that creates a button on the HtmlEditor that will have H1 and H2 options. This is used when you want to restrict users to just a few heading types.</p>
 * NOTE: while 'heading' should be the command used, it is not supported in IE, so 'formatblock' is used instead. Thank you IE.
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('Ext.ux.form.HtmlEditor.HeadingButtons', {
    extend: 'Ext.util.Observable',
    // private
    midasBtns: ['|', {
        enableOnSelection   : true,
        cmd                 : 'formatblock',
        value               : '<h1>',
        tooltip             : {
            title : '1st Heading'
        },
        overflowText        : '1st Heading'
    }, {
        enableOnSelection   : true,
        cmd                 : 'formatblock',
        value               : '<h2>',
        tooltip             : {
            title : '2nd Heading'
        },
        overflowText: '2nd Heading'
    }]
});

/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class Ext.ux.form.HtmlEditor.HeadingMenu
 * @extends Ext.util.Observable
 * <p>A plugin that creates a menu on the HtmlEditor for selecting a heading size. Takes up less room than the heading buttons if your going to have all six heading sizes available.</p>
 */
Ext.define('Ext.ux.form.HtmlEditor.HeadingMenu', {
    extend: 'Ext.util.Observable',

    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
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
        var btn = this.cmp.getToolbar().add({
            xtype           : 'combo',
            displayField    : 'display',
            valueField      : 'value',
            name            : 'headingsize',
            itemId          : 'headingsize',
            forceSelection  : true,
            mode            : 'local',
            triggerAction   : 'all',
            width           : 85,
            emptyText       : 'Heading',
            store           : Ext.create('Ext.data.ArrayStore', {
                autoDestroy     : true,
                fields          : ['value','display'],
                data            : [['H1','1st Heading'],['H2','2nd Heading'],['H3','3rd Heading'],['H4','4th Heading'],['H5','5th Heading'],['H6','6th Heading']]
            }),
            listeners: {
                'select': function(combo,rec){
                    var r = rec[0];
                    this.relayCmd('formatblock', '<'+r.get('value')+'>');
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
            doc, heading, headingSelect;

        doc = me.cmp.getDoc();

        headingSelect = me.cmp.getToolbar().down('#headingsize');
        heading = (doc.queryCommandValue('formatblock') || '').toUpperCase();

        if (heading !== headingSelect.getValue()) {
            headingSelect.setValue(heading);
        }
    }
});
