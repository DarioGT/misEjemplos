Ext.require([
    '*'
]);
Ext.onReady(function() {
            Ext.QuickTips.init();
            
            Ext.override(Ext.data.Store, {
                setExtraParams : function(params) {
                    this.proxy.extraParams = this.proxy.extraParams || {};
                    for ( var x in params) {
                        this.proxy.extraParams[x] = params[x];
                    }
                    this.proxy.applyEncoding(this.proxy.extraParams);
                },
                setExtraParam : function(name, value) {
                    this.proxy.extraParams = this.proxy.extraParams || {};
                    this.proxy.extraParams[name] = value;
                    this.proxy.applyEncoding(this.proxy.extraParams);
                }
            });
            
            Ext.override(Ext.grid.Panel, {
                // Returns row index of selected record or -1 if there is
                // no selection. To use call method like this:
                // var idx = grid.getSelectedRowIndex();
                getSelectedRowIndex : function() {
                    var r, s;
                    r = this.getView().getSelectionModel().getSelection();
                    s = this.getStore();
                    return s.indexOf(r[0]);
                    
                },
                // Returns currently selected record in a grid or -1 if there
                // is no selected record. To use call method like this:
                // var record = grid.getSelectedRecord();
                getSelectedRecord : function() {
                    var r;
                    if (this.getView().getSelectionModel().hasSelection()) {
                        var r = this.getView().getSelectionModel()
                                .getSelection();
                        return r[0];
                    } else {
                        return -1;
                    }
                },
                // Returns currently selected record as a parameter string which
                // will allow you to pass the row using an ajax call. If there
                // is
                // no slection this will return -1. To use call like this:
                // var params = grid.getSelectedRecordAsParameters();
                getSelectedRecordAsParameters : function() {
                    var r, params;
                    if (this.getView().getSelectionModel().hasSelection()) {
                        r = this.getView().getSelectionModel().getSelection();
                        params = '?1=1';
                        for (value in r[0].data) {
                            params = params + '&' + value + '='
                                    + r[0].get(value);
                        }
                    } else {
                        params = -1;
                    }
                    return params;
                }
            });
            /*
             * This text box connects to a store and sends an extraparam using
             * the delayed task so that all you have to do to set this up is to
             * place the id of the store in the spStoreObj field and the name of
             * the extraParam that you would like to set in the spParamName
             * field, the UX below will do the rest.
             */

            Ext.define('Ext.ux.ClearableSearchText', {
                extend : 'Ext.form.field.Trigger',
                alias : 'widget.xtext',
                triggerTip : 'Click to clear selection.',
                connectToStore : 'none',
                useExtraParam : 'none',
                triggerBaseCls : 'x-form-trigger',
                qtip : 'Clearable Text Box',
                triggerCls : 'x-form-clear-trigger',
                onRender : function(ct, position) {
                    Ext.ux.ClearableSearchText.superclass.onRender.call(this,
                            ct, position);
                    this.triggerEl.on('mouseover', function(t) {
                        this.showSpTip(this.triggerTip, this.triggerEl)
                    }, this);
                    this.inputEl.on('mouseover', function(t) {
                        this.showSpTip(this.qtip, this.inputEl)
                    }, this);
                },
                onTriggerClick : function() {
                    this.reset();
                    if (this.connectToStore !== 'none'
                            && this.useExtraParam !== 'none') {
                        Ext.getCmp(this.connectToStore).store.setExtraParam(
                                this.useExtraParam, '');
                        Ext.getCmp(this.connectToStore).store.load();
                    }
                },
                delayUtil : new Ext.util.DelayedTask(),
                delaytask : function() {
                    // alert(this.getValue());
                    Ext.getCmp(this.connectToStore).store.setExtraParam(
                            this.useExtraParam, this.getValue());
                    Ext.getCmp(this.connectToStore).store.load();
                },
                onKeyUp : function() {
                    if (this.connectToStore !== 'none'
                            && this.useExtraParam !== 'none') {
                        this.delayUtil.delay(500, this.delaytask, this);
                    }
                },
                enableKeyEvents : true,
                showSpTip : function(tip, target) {
                    Ext.QuickTips.register({
                        text : tip,
                        target : target,
                        dismissDelay : 6000
                    });
                }
            });
            
            /*
             * This is the clearable combobox UX
             */
            Ext.define(
                            'Ext.ux.ClearableCombo',
                            {
                                extend : 'Ext.form.field.ComboBox',
                                alias : 'widget.xcombo',
                                triggerTip : 'Click to clear selection.',
                                spObj : '',
                                spForm : '',
                                spExtraParam : '',
                                qtip : 'Clearable Combo Box',
                                trigger1Class : 'x-form-select-trigger',
                                trigger2Class : 'x-form-clear-trigger',
                                onRender : function(ct, position) {
                                    Ext.ux.ClearableCombo.superclass.onRender
                                            .call(this, ct, position);
                                    var id = this.getId();
                                    this.triggerConfig = {
                                        tag : 'div',
                                        cls : 'x-form-twin-triggers',
                                        style : 'display:block;width:46px;',
                                        cn : [
                                                {
                                                    tag : "img",
                                                    style : Ext.isIE ? 'margin-left:-3;height:19px'
                                                            : '',
                                                    src : Ext.BLANK_IMAGE_URL,
                                                    id : "trigger1" + id,
                                                    name : "trigger1" + id,
                                                    cls : "x-form-trigger "
                                                            + this.trigger1Class
                                                },
                                                {
                                                    tag : "img",
                                                    style : Ext.isIE ? 'margin-left:-6;height:19px'
                                                            : '',
                                                    src : Ext.BLANK_IMAGE_URL,
                                                    id : "trigger2" + id,
                                                    name : "trigger2" + id,
                                                    cls : "x-form-trigger "
                                                            + this.trigger2Class
                                                }
                                        ]
                                    };
                                    this.triggerEl
                                            .replaceWith(this.triggerConfig);
                                    this.triggerEl
                                            .on(
                                                    'mouseup',
                                                    function(e) {
                                                        
                                                        if (e.target.name == "trigger1"
                                                                + id) {
                                                            this
                                                                    .onTriggerClick();
                                                        } else if (e.target.name == "trigger2"
                                                                + id) {
                                                            this.reset();
                                                            if (this.spObj !== ''
                                                                    && this.spExtraParam !== '') {
                                                                Ext
                                                                        .getCmp(this.spObj).store
                                                                        .setExtraParam(
                                                                                this.spExtraParam,
                                                                                '');
                                                                Ext
                                                                        .getCmp(this.spObj).store
                                                                        .load()
                                                            }
                                                            if (this.spForm !== '') {
                                                                Ext
                                                                        .getCmp(
                                                                                this.spForm)
                                                                        .getForm()
                                                                        .reset();
                                                            }
                                                        }
                                                    }, this);
                                    var trigger1 = Ext.get("trigger1" + id);
                                    var trigger2 = Ext.get("trigger2" + id);
                                    trigger1
                                            .addClsOnOver('x-form-trigger-over');
                                    trigger2
                                            .addClsOnOver('x-form-trigger-over');
                                }
                            });
            
            styledMultiCombo_item_tpl = new Ext.XTemplate(
                    '<tpl for=".">',
                    '<div id="{id}-styled-input-item-2" class="x-item-styled-multiselect" >{value}</div>',
                    '</tpl>', {
                        compiled : true
                    });
            
            Ext.define(
                            'Ext.ux.styledMultiCombo',
                            {
                                extend : 'Ext.form.field.ComboBox',
                                alias : 'widget.smcbo',
                                spmaxGrow : '',
                                spmaxHeight : '',
                                multiSelect : true,
                                // Convert the input box back to the div so you
                                // can add div elements
                                // that keep their style
                                fieldSubTpl : [
                                        '<div class="{hiddenDataCls}" role="presentation"></div>',
                                        '<div id="{id}" ',
                                        '<tpl if="size">size="{size}" </tpl>',
                                        '<tpl if="tabIdx">tabIndex="{tabIdx}" </tpl>',
                                        'class="multi-sel-main {typeCls}" ><div id="input-display"></div></div>',
                                        '<div id="{cmpId}-triggerWrap" class="{triggerWrapCls}" role="presentation">',
                                        '{triggerEl}',
                                        '<div class="{clearCls}" role="presentation" ></div>',
                                        '</div>', {
                                            compiled : true,
                                            disableFormats : true
                                        }
                                ],
                                qtip : 'You may make multiple selections from the dropdown list.',
                                onRender : function(ct, position) {
                                    Ext.ux.styledMultiCombo.superclass.onRender
                                            .call(this, ct, position);
                                    this.box = Ext.get(this.getInputId());
                                    this.el_width = this.getEl().getWidth() + 10;
                                    
                                    // Set the default value or the selected
                                    // values
                                    if (this.getRawValue() == '') {

                                    } else {

                                    }
                                    
                                },
                                
                                afterRender : function(ct, position) {

                                },
                                listeners : {
                                    select : {
                                        fn : function() {
                                            var sel_text = this.getRawValue()
                                                    .split(',');
                                            styledMultiCombo_item_tpl
                                                    .overwrite('input-display',
                                                            '');
                                            Ext.Array
                                                    .each(
                                                            sel_text,
                                                            function(name,
                                                                    index) {
                                                                styledMultiCombo_item_tpl
                                                                        .insertFirst(
                                                                                'input-display',
                                                                                {
                                                                                    value : name,
                                                                                    id : index
                                                                                });
                                                            });
                                            // this.box.update(this.sel_text);
                                            var text_width = this.el
                                                    .getTextWidth(this
                                                            .getRawValue());
                                            if (this.el_width < text_width) {
                                                this.setSize(text_width + 30);
                                            } else {
                                                this
                                                        .setSize(this.el_width + 30);
                                            }
                                        }
                                    }
                                }
                            });
            
            // This is the data model for the check register application
            // data.
            Ext.define('check_data_model', {
                extend : 'Ext.data.Model',
                idProperty : 'cpkid',
                fields : [
                        {
                            name : 'cpkid',
                            type : 'int'
                        }, {
                            name : 'check_num',
                            type : 'int'
                        }, {
                            name : 'check_amount',
                            type : 'float'
                        }, {
                            name : 'check_date',
                            type : 'string'
                        }, {
                            name : 'check_pay_to',
                            type : 'string'
                        }, {
                            name : 'check_state',
                            type : 'string'
                        }, {
                            name : 'check_zip',
                            type : 'string'
                        }
                ]
            });
            // This is the data model for the check register application
            // data.
            Ext.define('state_data_model', {
                extend : 'Ext.data.Model',
                fields : [
                    {
                        name : 'check_state',
                        type : 'string'
                    }
                ]
            });
            
            var state_data_store = Ext.create('Ext.data.Store', {
                storeId : 'state_data_store',
                model : 'state_data_model',
                autoLoad : true,
                proxy : {
                    type : 'ajax',
                    url : 'data/st_data.php',
                    reader : {
                        type : 'json',
                        root : 'rows',
                        totalProperty : 'results'
                    }
                
                }
            });
            
            // This is the data store for the check register data
            var check_data_store = Ext.create('Ext.data.Store', {
                storeId : 'check_data_store',
                model : 'check_data_model',
                pageSize : 50,
                remoteSort : true,
                proxy : {
                    type : 'ajax',
                    simpleSortMode : true,
                    actionMethods : {
                        create : 'POST',
                        read : 'POST',
                        update : 'POST',
                        destroy : 'POST'
                    },
                    url : 'data/data.php',
                    
                    sortParam : 'sort',
                    directionParam : 'dir',
                    reader : {
                        type : 'json',
                        root : 'rows',
                        totalProperty : 'results'
                    }
                
                }
            });
            
            var search_check_state = Ext.create('Ext.ux.styledMultiCombo', {
                store : state_data_store,
                emptyText : 'State',
                spObj : 'check_register_grid',
                
                spExtraParam : 'check_state',
                queryMode : 'remote',
                displayField : 'check_state',
                valueField : 'check_state',
                listeners : {
                    select : {
                        fn : function(combo, record, index) {
                            check_register_grid.getStore().setExtraParam(
                                    'check_state', this.getValue());
                            check_register_grid.getStore().load();
                        }
                    }
                }
            });
            
            var search_check_pay_to = Ext.create('Ext.ux.ClearableSearchText',
                    {
                        emptyText : 'Pay to ..',
                        qtip : 'Search pay to field ... ',
                        width : 120,
                        height : 25,
                        style : 'text-align: left',
                        fieldStyle : 'padding:2px;',
                        connectToStore : 'check_register_grid',
                        useExtraParam : 'check_pay_to'
                    });
            
            var check_register_grid = Ext.create('Ext.grid.Panel', {
                region : 'center',
                id : 'check_register_grid',
                autoScroll : true,
                title : 'Check Register Data.',
                store : check_data_store,
                border : false,
                features : [
                    {
                        groupHeaderTpl : '{name}',
                        ftype : 'groupingsummary'
                    }
                ],
                columns : [
                        {
                            text : 'Number',
                            sortable : true,
                            width : 75,
                            dataIndex : 'check_num'
                        }, {
                            text : 'Amount',
                            sortable : true,
                            align : 'right',
                            renderer : Ext.util.Format.usMoney,
                            width : 75,
                            dataIndex : 'check_amount',
                            summaryType : 'sum',
                            summaryRenderer : Ext.util.Format.usMoney
                        }, {
                            text : 'Date',
                            sortable : true,
                            renderer : Ext.util.Format.dateRenderer('Y-m-d'),
                            dataIndex : 'check_date'
                        }, {
                            text : 'Pay To',
                            sortable : true,
                            flex : 1,
                            dataIndex : 'check_pay_to'
                        }, {
                            text : 'State',
                            sortable : true,
                            dataIndex : 'check_state'
                        }, {
                            text : 'Zip',
                            sortable : true,
                            dataIndex : 'check_zip'
                        }
                ],
                tbar : [
                        '-', search_check_pay_to, '-', search_check_state, '-'
                ],
                dockedItems : [
                    {
                        xtype : 'pagingtoolbar',
                        store : check_data_store, // same store GridPanel is
                                                    // using
                        dock : 'bottom',
                        displayInfo : true,
                        listeners : {
                            beforechange : function(a, b, c) {

                            }
                        }
                    }
                ]
            });
            
            // Main viewport
            var viewport = Ext
                    .create(
                            'Ext.Viewport',
                            {
                                id : 'main_viewport',
                                layout : 'border',
                                items : [
                                        Ext
                                                .create(
                                                        'Ext.Component',
                                                        {
                                                            region : 'north',
                                                            height : 25,
                                                            autoEl : {
                                                                tag : 'div',
                                                                html : '<h1 style="margin-left:10px; margin-top:6px; font-weight:bold; font-family:Arial, Helvetica, sans-serif">Frederick County MD, Public Schools Check Registers</h1>'
                                                            }
                                                        }), check_register_grid
                                ]
                            });
            check_register_grid.getStore()
                    .setExtraParam('sort', 'check_pay_to');
            check_register_grid.getStore().setExtraParam('dir', 'ASC');
            check_register_grid.store.loadPage(1);
        });