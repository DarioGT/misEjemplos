/**
 * @class Ext.ux.grid.RecordForm
 * @extends Ext.util.Observable
 *
 * RecordForm plugin, form that edits grid's record
 *
 * @author    Ing. Jozef Sakáloš
 * @copyright (c) 2008, by Ing. Jozef Sakáloš
 * @date      5. September 2011
 * @version   1.1
 *
 * @description recordform 1.1, updated for extjs 4, by Dominique Lederer, http://return1.at/
 *
 * @license Ext.ux.grid.RecordForm.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the 
 * code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * <p>License details: <a href="http://www.gnu.org/licenses/lgpl.html"
 * target="_blank">http://www.gnu.org/licenses/lgpl.html</a></p>
 *
 * @forum     31341
 * @demo      http://recordform.extjs.eu
 * @download  
 * <ul>
 * <li><a href="http://recordform.extjs.eu/recordform.tar.bz2">recordform.tar.bz2</a></li>
 * <li><a href="http://recordform.extjs.eu/recordform.tar.gz">recordform.tar.gz</a></li>
 * <li><a href="http://recordform.extjs.eu/recordform.zip">recordform.zip</a></li>
 * </ul>
 *
 * @donate
 * <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
 * <input type="hidden" name="cmd" value="_s-xclick">
 * <input type="hidden" name="hosted_button_id" value="3430419">
 * <input type="image" src="https://www.paypal.com/en_US/i/btn/x-click-butcc-donate.gif" 
 * border="0" name="submit" alt="PayPal - The safer, easier way to pay online.">
 * <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">
 * </form>
 */
 
Ext.ns('Ext.ux.grid');


/**
 * Creates new RecordForm plugin
 * @constructor
 * @param {Object} config A config object
 */
Ext.ux.grid.RecordForm = function(config) {
    Ext.apply(this, config);


    // call parent
    Ext.ux.grid.RecordForm.superclass.constructor.call(this);
}; // eo constructor


Ext.define('Ext.ux.grid.RecordForm', {
    extend: 'Ext.util.Observable',
    alias : 'widget.gridrecordform',


    // {{{
    // configuration options
     autoHide:true
    /**
     * @cfg {String} cancelIconCls Icon class for cancel button
     */
     ,cancelIconCls:'icon-cancel'


    /**
     * @cfg {String} cancelText Text for cancel button
     */
    ,cancelText:'Cancel'


    /**
     * @cfg {Number} columnCount Form fields are arranged into columns; 
     * this says how many columns you want
     */
    ,columnCount:1


    /**
     * @cfg {Object} defaultFormConfig Default configuration of form
     * @private
     */
    ,defaultFormConfig: {
         border:false
        ,frame:true
        ,autoHeight:true
        ,fieldDefaults:{
            labelWidth:100
        }
    }


    /**
     * @cfg {Object} defaultWindowConfig Default configuration of widnow
     * @private
     */
    ,defaultWindowConfig:{
         border:false
        ,width:480
        ,autoHeight:true
        ,layout:'fit'
        ,closeAction:'hide'
        ,modal:true
        //,plugins:[new Ext.ux.menu.IconMenu({defaultItems:[]})]
    }


    /** 
     * @cfg {String} dirtyRowCls class to apply to dirty (edited) row
     */
    ,dirtyRowCls:'ux-grid3-dirty-row'


    /**
     * @cfg {Number} focusDefer Time in ms before the first form field is focused
     * @private
     */
    ,focusDefer:200


    /**
     * @cfg {Object} formConfig Additional configuration options for form
     * Overrides defaultFormConfig
     */


    /**
     * @cfg {String} iconCls icon to use for title of the popup window
     */


    /**
     * @cfg {Object} ignoreFields Object {fieldName:true, fieldName2:true} with
     * fields to ignore. These fields are not displayed in the form.
     */


    /**
     * @cfg {Object} readonlyFields Object {fieldName:true, fieldName2:true} with
     * fields to set as read only.
     */


    /**
     * @cfg {Object} disabledFields Object {fieldName:true, fieldName2:true} with
     * fields to set as disabled.
     */


    /**
     * @cfg {Object} mapping Mapping of Record types to Field xtypes
     */
    ,mapping:{
         'auto':'textfield'
        ,'boolean':'checkbox'
        ,'date':'datefield'
        ,'float':'numberfield'
        ,'int':'numberfield'
        ,'string':'textfield'
    }


    /**
     * @cfg {String} newRowCls class to apply to new row
     */
    ,newRowCls:'ux-grid3-new-row'


    /**
     * @cfg {String} okIconCls Icon class for OK button
     */
    ,okIconCls:'icon-ok'


    /**
     * @cfg {String} okText Text for OK button
     */
    ,okText:'OK'


    /**
     * @cfg {String} title Title to use for popup window
     */
    
    /**
     * @cfg {Boolean} showButtons false to not show OK and Cancel buttons. (defaults to true)
     */
    ,showButtons:true


    /**
     * @cfg {Object} windowConfig Additional configuration options for window.
     * Overrides defaultWindowConfig.
     */
    // }}}
    // {{{
    /**
     * Main init function
     * @private
     */
    ,init:function(grid) {


        // install custom getRowClass to grid view
        Ext.Function.createSequence(grid.afterRender, function() {
            if ('function' === typeof grid.view.getRowClass) {
                Ext.Function.createSequence(grid.view.getRowClass, this.getRowClass, this);
            }
            else {
                grid.view.getRowClass = Ext.bind(this.getRowClass, this);
            }
            if (this.autoShow) {
                this.show({data:{}});
            }
        }, this);




        // save reference to grid
        this.grid = grid;


        // we need to reconfigure ourselves when grid reconfigures
        //grid.reconfigure = grid.reconfigure.createSequence(this.reconfigure, this);
        Ext.Function.createSequence(grid.reconfigure, this.reconfigure, this);


        // initial (re)configuration
        this.reconfigure();
    } // eo function init
    // }}}
    // {{{
    /**
     * Override this to add processing you need to run after the record update
     * @param {Ext.data.Record} record Record that has been updated
     */
    ,afterUpdateRecord:Ext.emptyFn
    // }}}
    // {{{
    /**
     * Creates form configuration. Form is created later in show function
     * @private
     */
    ,createFormConfig:function() {


        // run only once 
        if(this.form) {
            return;
        }


        // get vars
        var cm = this.grid.columns;
        var fields = this.grid.store.model.create({}).fields;
        var store = this.grid.store;


        // {{{
        // create form *config* object - it does NOT instantiate the form
        this.form = Ext.apply({
             xtype:'form'
            ,items:[{


                // column layout
                 layout:'column'
                ,anchor:'100%'
                ,border:false
                ,monitorValid:true
                ,autoHeight:true
                ,defaults:{
                     columnWidth:1/this.columnCount
                    ,autoHeight:true
                    ,border:false
                    ,layout:'anchor'
                    ,hideLabel:true
                }


                // columns
                ,items: Ext.bind(function() {
                    var items = [];
                    for (var i = 0; i < this.columnCount; i++) {
                        items.push({
                            defaults:{
                                anchor:'-25'
                            }
                            ,items:[]
                        });
                    }
                    return items;
                }, this)()
            }]


            // buttons
            ,buttons: Ext.bind(function() {
                if(this.showButtons) {
                    return [{
                         text:this.okText
                        ,iconCls:this.okIconCls
                        ,scope:this
                        ,handler:this.onOK
                        ,formBind:true
                    },{
                         text:this.cancelText
                        ,iconCls:this.cancelIconCls
                        ,scope:this
                        ,handler:this.onCancel
                    }];
                }
                else {
                    return [];
                }
            }, this)()


            // ok on enter
            ,keys:[{
                 key:[10,13] // enter
                ,scope:this
                ,stopEvent:true
                ,fn:this.onOK
            }]
        }, this.formConfig, this.defaultFormConfig); // eo form config
        // }}}
        // {{{
        // add form fields from store or column model. cm has priority
        var colIndex = 0;
        var tabIndex = 1;


        // store record fields loop
        fields.each(function(f, i) {
            // ignore some fields
            if(this.ignoreFields && this.ignoreFields[f.name]) {
                return;
            }


            // attempt to get config from column model
            var c = this.findConfig(cm, f.name);
            var o = {};
            var editor = c.getEditor();


            // use cm editor if we have one
            if(editor) {
                Ext.apply(o, {
                     xtype:editor.getXType()
                    ,fieldLabel:c.text
                }, editor.initialConfig);
            }                       


            // use this.mapping to get field xtype
            else {
                Ext.apply(o, {
                     fieldLabel:(c && c.text ? c.text : f.name)
                    ,xtype:this.mapping[f.type] || 'textfield'
                });
                if('date' === f.type && f.dateFormat) {
                    o.format = f.dateFormat;
                }
            }


            // read only and disabled fields
            if(this.readonlyFields && true === this.readonlyFields[f.name]) {
                o.readOnly = true;
            }
            if(this.disabledFields && true === this.disabledFields[f.name]) {
                o.disabled = true;
            }
            
            // field has to have name
            o.name = f.name;
            o.tabIndex = tabIndex++;


            // do not anchor date and time fields
            if('datefield' === o.xtype || 'timefield' === o.xtype || 'datetime' === o.xtype) {
                o.anchor = '';
            }
            if('textarea' === o.xtype) {
                o.grow = false;
                o.autoHeight = true;
            }


            // add field to a column on left-to-right top-to-bottom basis
            this.form.items[0].items[colIndex++].items.push(o);
            colIndex = colIndex === this.columnCount ? 0 : colIndex;
            
        }, this);
        // }}}


    } // eo function createFormConfig
    // }}}
    // {{{
    /**
     * Finds if a configuration exists for a given dataIndex in column model
     * @private
     * @param {Ext.grid.ColumnModel} cm
     * @param {String} dataIndex 
     */
    ,findConfig:function(cm, dataIndex) {
        var config = null;
        Ext.each(cm, function(c, i) {
            if(config) {
                return;
            }
            if(dataIndex === c.dataIndex) {
                config = c;
            }
        });


        return config;
    } // eo function findConfig
    // }}}
    // {{{
    /**
     * GridVew getRowClass sequence function - override it to get custom effects
     * @param {Ext.data.Record} record record we should return the class for
     */
    ,getRowClass:function(record) {
        if(record.get('newRecord')) {
            return this.newRowCls;
        }
        if(record.dirty) {
            return this.dirtyRowCls;
        }
        return '';
    } // eo function getRowClass
    // }}}
    // {{{
    /**
     * Destroys components we've created
     * @private
     */
    ,onDestroy:function() {
        if(this.window) {
            this.window.destroy();
            this.window = null;
            this.form = null;
        }
        else if(this.form) {
            if('function' === typeof this.form.destroy) {
                this.form.destroy();
            }
            this.form = null;
        }
    } // eo function onDestroy
    // }}}
    // {{{
    /**
     * OK button click handler
     */
    ,onOK:function() {
        this.updateRecord();
        if(this.autoHide) {
            this.window.hide(null);
        }
    } // eo function onOK
    // }}}
    // {{{
    /**
     * Cancel button handler, removes new record if it is not dirty
     */
    ,onCancel:function() {
        if(this.record.get('newRecord') && !this.record.dirty) {
            this.record.store.remove(this.record);
        }
        if(this.autoHide) {
            this.window.hide(null);
        }
    } // eo function onCancel
    // }}}
    // {{{
    /**
     * Reconfigures the plugin - deletes old form and creates new one
     * Runs also after grid reconfigure call
     * @private
     */
    ,reconfigure:function() {
        // destroy old window and form
        this.onDestroy();


        // create new form configuration
        // form will be instantiated and rendered in show function
        this.createFormConfig();
    } // eo function reconfigure
    // }}}


    ,getPanel:function() {      
        if(this.window) {
            return this.window;
        }
        if(this.formCt) {
            var panel = Ext.getCmp(this.formCt);
            if(panel) {
                panel.add(this.form);
                panel.doLayout();
            }
            else {
                panel = Ext.fly(this.formCt);
                if(panel) {
                    panel = new Ext.Panel({
                         renderTo:panel
                        ,items:this.form
                    });
                }
            }
        }
        else {
            var config = Ext.apply({}, this.defaultWindowConfig);
            config = Ext.apply(config, this.windowConfig);
            Ext.applyIf(config, {
                 title:this.title || this.grid.title
                ,iconCls:this.iconCls || this.grid.iconCls
                ,items:this.form
                ,listeners:{
                    show:{scope:this, delay:this.focusDefer, fn:function() {
                        this.form.startPolling();
                        var basicForm = this.form.getForm()


                        // focus first form field on window show
                        basicForm.getFields().getAt(0).focus();


                        // mark fields invalid if any
                        basicForm.isValid();
                    }}
                    ,hide:{scope:this, fn:function() {
                        this.form.stopPolling();
                    }}
                }
            });
            var window = new Ext.Window(config);
            this.form = window.items.getAt(0);
            return window;
        }
        panel.on({
            show:{scope:this, delay:this.focusDefer, fn:function() {
                this.form.startPolling();
                var basicForm = this.form.getForm()


                // focus first form field on window show
                basicForm.getFields().getAt(0).focus();


                // mark fields invalid if any
                basicForm.isValid();
            }}
            ,hide:{scope:this, fn:function() {
                this.form.stopPolling();
            }}
        });
        this.form = panel.items.getAt(0);
        return panel;


    } // eo function getPanel


    // {{{
    /**
     * Shows the record form in the window
     * @param {Ext.data.Record} record Record to bind to
     * @param {Ext.Element/DOMElement/String} animEl window show animation element
     */
    ,show:function(record, animEl) {




        // lazy create window
        if(!this.window) {
            this.window = this.getPanel();
        }


        // show window
        this.window.show(animEl);


        // populate fields with values
        var basicForm = this.form.getForm();
        basicForm.loadRecord(record);




        // save record we're currently editing
        this.record = record;
    } // eo function show
    // }}}
    // {{{
    /**
     * Updates record in store
     * @private
     */
    ,updateRecord:function() {
        // loop through form fields and update underlying record
        this.form.getForm().getFields().each(function(item, i) {
            this.record.set(item.name, item.getValue());            
        }, this);


        this.afterUpdateRecord(this.record);


    } // eo function updateRecord
    // }}}
 
}); // eo define


// 