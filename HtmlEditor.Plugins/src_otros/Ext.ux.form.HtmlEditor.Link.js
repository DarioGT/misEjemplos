/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class Ext.ux.form.HtmlEditor.Link
 * @extends Ext.util.Observable
 * <p>A plugin that creates a button on the HtmlEditor for inserting a link.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('Ext.ux.form.HtmlEditor.Link', {
    extend: 'Ext.util.Observable',

    // Link language text
    langTitle   : 'Insert Link',
    langInsert  : 'Insert',
    langCancel  : 'Cancel',
    langTarget  : 'Target',
    langURL     : 'URL',
    langText    : 'Text',

    // private
    linkTargetOptions: [['_self', 'Default'], ['_blank', 'New Window'], ['_parent', 'Parent Window'], ['_top', 'Entire Window']],

    init: function(cmp){
        cmp.enableLinks = false;
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
    },

    onRender: function(){
        var cmp = this.cmp;
        var btn = this.cmp.getToolbar().add({
            iconCls: 'x-edit-createlink',
            handler: function(){
                var sel = this.cmp.getSelectedText();

                if (!this.linkWindow) {
                    this.linkWindow = Ext.create('Ext.window.Window',{
                        title       : this.langTitle,
                        closeAction : 'hide',
                        width       : 350,
                        height      : 160,
                        items       : [{
                            xtype       : 'form',
                            itemId      : 'insert-link',
                            border      : false,
                            plain       : true,
                            bodyStyle   : 'padding: 10px;',
                            labelWidth  : 40,
                            labelAlign  : 'right',
                            items       : [{
                                xtype       : 'textfield',
                                fieldLabel  : this.langText,
                                name        : 'text',
                                anchor      : '100%',
                                value       : ''
                            }, {
                                xtype       : 'textfield',
                                fieldLabel  : this.langURL,
                                vtype       : 'url',
                                name        : 'url',
                                anchor      : '100%',
                                value       : 'http://'
                            }, {
                                xtype           : 'combo',
                                fieldLabel      : this.langTarget,
                                name            : 'target',
                                forceSelection  : true,
                                mode            : 'local',
                                store           : Ext.create('Ext.data.ArrayStore',{
                                    autoDestroy : true,
                                    fields      : ['spec', 'val'],
                                    data        : this.linkTargetOptions
                                }),
                                triggerAction   : 'all',
                                value           : '_self',
                                displayField    : 'val',
                                valueField      : 'spec',
                                anchor          : '100%'
                            }]
                        }],
                        buttons: [{
                            text    : this.langInsert,
                            handler : function(){
                                var frm = this.linkWindow.getComponent('insert-link').getForm();
                                if (frm.isValid()) {
                                    var afterSpace = '', sel = this.cmp.getSelectedText(true), text = frm.findField('text').getValue(), url = frm.findField('url').getValue(), target = frm.findField('target').getValue();
                                    if (text.length && text[text.length - 1] == ' ') {
                                        text = text.substr(0, text.length - 1);
                                        afterSpace = ' ';
                                    }
                                    if (sel.hasHTML) {
                                        text = sel.html;
                                    }
                                    var html = '<a href="' + url + '" target="' + target + '">' + text + '</a>' + afterSpace;
                                    this.cmp.insertAtCursor(html);
                                    this.linkWindow.hide();
                                } else {
                                    if (!frm.findField('url').isValid()) {
                                        frm.findField('url').getEl().frame();
                                    } else if (!frm.findField('target').isValid()) {
                                        frm.findField('target').getEl().frame();
                                    }
                                }

                            },
                            scope   : this
                        }, {
                            text    : this.langCancel,
                            handler : function(){
                                this.linkWindow.close();
                            },
                            scope   : this
                        }],
                        listeners   : {
                            show: {
                                fn: function(){
                                    var frm = this.linkWindow.getComponent('insert-link').getForm();
                                    frm.findField('text').setValue(sel.textContent).setDisabled(sel.hasHTML);
                                    frm.findField('url').reset();
                                    frm.findField('url').focus(true, 50);
                                },
                                scope: this,
                                defer: 350
                            }
                        }
                    });
                }
                this.linkWindow.show();
            },
            scope   : this,
            tooltip : this.langTitle
        });
    }
});


//Ext.ns('Ext.ux.form.HtmlEditor');

//if (!Ext.isObject) {
//    Ext.isObject = function(v){
//        return v && typeof v == "object";
//    };
//}

Ext.override(Ext.form.field.HtmlEditor, {
    getSelectedText: function(clip){
        var doc = this.getDoc(), selDocFrag;
        var txt = '', hasHTML = false, selNodes = [], ret, html = '';
        if (this.win.getSelection || doc.getSelection) {
            // FF, Chrome, Safari
            var sel = this.win.getSelection();
            if (!sel) {
                sel = doc.getSelection();
            }
            if (clip) {
                selDocFrag = sel.getRangeAt(0).extractContents();
            } else {
                selDocFrag = this.win.getSelection().getRangeAt(0).cloneContents();
            }
            Ext.each(selDocFrag.childNodes, function(n){
                if (n.nodeType !== 3) {
                    hasHTML = true;
                }
            });
            if (hasHTML) {
                var div = document.createElement('div');
                div.appendChild(selDocFrag);
                html = div.innerHTML;
                txt = this.win.getSelection() + '';
            } else {
                html = txt = selDocFrag.textContent;
            }
            ret = {
                textContent: txt,
                hasHTML: hasHTML,
                html: html
            };
        } else if (doc.selection) {
            // IE
            this.win.focus();
            txt = doc.selection.createRange();
            if (txt.text !== txt.htmlText) {
                hasHTML = true;
            }
            ret = {
                textContent: txt.text,
                hasHTML: hasHTML,
                html: txt.htmlText
            };
        } else {
            return {
                textContent: ''
            };
        }

        return ret;
    }
});

