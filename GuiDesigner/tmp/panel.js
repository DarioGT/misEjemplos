Ext.ux.JsonPanel = Ext.extend(Ext.Panel, {
    layout: 'fit',
    border: false,
    bodyBorder: false,
    single: true,
    json: null,
    nocache: false,
    initComponent: function () {
        if (this.autoLoad) {
            if (typeof this.autoLoad !== 'object') this.autoLoad = {
                url: this.autoLoad
            };
            if (typeof this.autoLoad['nocache'] == 'undefined') this.autoLoad['nocache'] = this.nocache;
        }
        Ext.ux.JsonPanel.superclass.initComponent.call(this);
        this.json = new Ext.ux.Json({
            scope: this.scope || this,
            nocache: this.nocache
        });
        this.addEvents({
            'beforejsonload': true,
            'afterjsonload': true,
            'failedjsonload': false
        });
    },
    setListeners: function (listeners) {
        this.on(listeners);
    },
    onRender: function (ct, position) {
        Ext.ux.JsonPanel.superclass.onRender.call(this, ct, position);
        var um = this.getUpdater();
        um.showLoadIndicator = false;
        um.on('failure', function (el, response) {
            if (this.ownerCt) this.ownerCt.el.unmask();
            if (this.json.fireEvent('error', 'failedjsonload', 'url in autoLoad not valid')) {
                this.fireEvent('failedjsonload', response);
            }
        }.createDelegate(this));
        um.on('beforeupdate', function (el, url, params) {
            if (this.loadMask && this.ownerCt) this.ownerCt.el.mask(this.loadMsg, this.msgCls);
        }.createDelegate(this));
        um.setRenderer({
            render: function (el, response, updater, callback) {
                this.apply(response.responseText, callback);
            }.createDelegate(this)
        });
    },
    apply: function (cfg, callback) {
        this.fireEvent('beforejsonload', cfg);
        try {
            this.json.apply(this, cfg);
            this.fireEvent('afterjsonload');
            if (callback) {
                callback();
            }
            return true;
        } catch (e) {
            if (this.json.fireEvent('error', 'failedjsonload', e) && this.fireEvent('failedjsonload', cfg, e)) Ext.Msg.alert('Failure', 'Failed to decode load Json:' + e.message) return false;
        }
    }
});
Ext.reg('jsonpanel', Ext.ux.JsonPanel);