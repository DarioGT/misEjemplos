/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @contributor Ronald van Raaphorst - Twensoc
 * @class Ext.ux.form.HtmlEditor.FindReplace
 * @extends Ext.util.Observable
 * <p>A plugin that provides search and replace functionality in source edit mode. Incomplete.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('Ext.ux.form.HtmlEditor.FindAndReplace', {
    extend: 'Ext.util.Observable',

    // Find and Replace language text
    langTitle       : 'Find/Replace',
    langFind        : 'Find',
    langReplace     : 'Replace',
    langReplaceWith : 'Replace with',
    langClose       : 'Close',

    // private
    cmd             : 'findandreplace',

    /**
     *
     * @param cmp
     * @private
     */
    init: function(cmp){
        this.cmp = cmp;

        this.cmp.on({
            render          : this.onRender,
            editmodechange  : this.editModeChange,
            scope           : this
        });

        this.lastSelectionStart=-1;
    },

    /**
     *
     * @param t
     * @param m
     */
    editModeChange: function(t, m){
        if (this.btn && m){
            this.btn.setDisabled(false);
        }
    },

    /**
     * @private
     */
    onRender: function(){
        this.btn = this.cmp.getToolbar().add({
            iconCls             : 'x-edit-findandreplace',
            sourceEditEnabled   : true,
            handler             : function(){
                if (!this.farWindow){
                    this.farWindow = Ext.create('Ext.window.Window',{
                        title       : this.langTitle,
                        closeAction : 'hide',
                        width       : 270,
                        items       : [{
                            xtype       : 'form',
                            itemId      : 'findandreplace',
                            border      : false,
                            plain       : true,
                            bodyStyle   : 'padding: 10px;',
                            labelWidth  : 80,
                            labelAlign  : 'right',
                            defaults    : {
                                anchor  : '-20px'
                            },
                            items       : [{
                                xtype       : 'textfield',
                                allowBlank  : false,
                                fieldLabel  : this.langFind,
                                name        : 'find'
                            }, {
                                xtype       : 'textfield',
                                allowBlank  : true,
                                fieldLabel  : this.langReplaceWith,
                                name        : 'replace'
                            }]
                        }],
                        buttons: [{
                            text    : this.langFind,
                            handler : this.doFind,
                            scope   : this
                        }, {
                            text    : this.langReplace,
                            handler : this.doReplace,
                            scope   : this
                        }, {
                            text    : this.langClose,
                            handler : function(){
                                this.farWindow.hide();
                            },
                            scope   : this
                        }]
                    });
                }

                this.farWindow.show();

            },
            scope   : this,
            tooltip : {
                title   : this.langTitle,
                text    : this.langTitle
            },
            overflowText: this.langTitle
        });

    },
    doFind: function(){

        var frm = this.farWindow.getComponent('findandreplace').getForm();
        if (!frm.isValid()) {
            return '';
        }

        var findValue = frm.findField('find').getValue();
        var replaceValue = frm.findField('replace').getValue();

        if(this.cmp.sourceEditMode) {
            // source edit mode
            var textarea = this.cmp.el.dom;
            var startPos = textarea.selectionStart===this.lastSelectionStart ? textarea.selectionStart+1 : textarea.selectionStart;
            var txt = textarea.value.substring(startPos);

            var regexp = new RegExp(findValue);
            var r = txt.search(regexp);
            if(r==-1) {
                return;
            }
            this.lastSelectionStart = startPos + r;
            if(Ext.isGecko) {
                textarea.setSelectionRange(this.lastSelectionStart , this.lastSelectionStart + findValue.length);
                this.cmp.scrollIntoView(startPos);
                this.cmp.focus(false, true);
            }
            return;
        }
        // design mode
        //var doc = this.cmp.getEditorBody();
        //var txt = doc.innerHTML;
        // Should we search/replace in the source, and push the result back to the design?

    },
    doReplace: function(){

        var frm = this.farWindow.getComponent('findandreplace').getForm();
        if (!frm.isValid()) {
            return '';
        }

        var findValue   = frm.findField('find').getValue();
        var replaceValue= frm.findField('replace').getValue();

        if(this.cmp.sourceEditMode) {
            var textarea = this.cmp.el.dom;
            var startPos = textarea.selectionStart;
            var endPos = textarea.selectionEnd;
            var txt = textarea.value;

            //cmp.execCmd('delete', null);
            //cmp.focus(false, false);
            //cmp.insertAtCursor(replaceValue);

            if(Ext.isGecko) {
                // TODO: Scroll into view
                var scrollPosition = textarea.scrollTop;
                textarea.value = txt.substring(0,startPos) + replaceValue + txt.substring(endPos);
                textarea.setSelectionRange(startPos,startPos + replaceValue.length);
                textarea.scrollTop = scrollPosition;
                this.cmp.focus(false, true);
            }
            return;
        }
        return;
    }
});