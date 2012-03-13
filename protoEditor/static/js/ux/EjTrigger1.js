/* 
 *  Este ejemplo permite el mapeo del DblClick,  utiliza el 
 *  	bodyEl  para acceder al objeto padre 
 *  	y asocia los eventos para q sean ejecutados tambien localmente 
 *  
 * 	No lo utilizo pues se puede prestar a confusion al momento de disparar los eventos, 
 *  es mas facil poder controlarlos dentro del cuerpo del initComponent  
 *  
 *  
 *      initComponent: function(){
        this.callParent(arguments);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTriggerClick();
            }
        }, this);
    },

 */

Ext.define("pp.lib.TriggerFieldClick", {
    extend : "Ext.form.field.Trigger",
    alias : "widget.triggerfieldclick",

    enableKeyEvents : true,

    listeners : {
        keyup : function(f, e) {
            if (f.hideTrigger) {
                return;
            }
            var key = e.getKey();
            if (key == e.ENTER || key == e.SPACE) {
                f.fireEvent("triggerclick", f, e);
            }
        }
    },

    afterRender : function() {
        var me = this, body = me.bodyEl;
        me.callParent();
        me.mon(body, "dblclick", me.onDblClick, me);
    },

    onTriggerClick : function(e) {
        var me = this;
        me.fireEvent("triggerclick", me, e);
    },

    onDblClick : function(e) {
        var me = this;
        if (!me.hideTrigger) {
            me.fireEvent("triggerclick", me, e);
        }
    }
});  