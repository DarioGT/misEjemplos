Ext.ux.JsonWindow = Ext.extend(Ext.Window, {
    layout: 'fit',
    border: false,
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
        this.json = new Ext.ux.Json({
            scope: this.scope || this,
            nocache: this.nocache
        });
        this.addEvents({
            'beforejsonload': true,
            'afterjsonload': true,
            'failedjsonload': false
        });
        Ext.ux.JsonWindow.superclass.initComponent.call(this);
    },
    setX: function (x) {
        this.setPosition(x, this.y);
    },
    setY: function (y) {
        this.setPosition(this.x, y);
    },
    setAlignTo: function (arg) {
        if (this.rendered) this.alignTo(arg[0], arg[1], arg[2]);
    },
    setAnchorTo: function (arg) {
        this.anchorTo(arg[0], arg[1], arg[2], arg[3]);
    },
    setListeners: function (listeners) {
        this.on(listeners);
    },
    onRender: function (ct, position) {
        Ext.ux.JsonWindow.superclass.onRender.call(this, ct, position);
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
Ext.reg('jsonwindow', Ext.ux.JsonWindow);