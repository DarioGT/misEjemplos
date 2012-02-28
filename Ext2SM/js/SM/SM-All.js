// JavaScript Document
Ext.namespace('SM');
/*clase PCLGrid(la grilla para usar en pcls,zooms,etc..),la grilla contiene un Ext.data.JsonStore
que contiene el modelo y los datos*/


Ext.override(Ext.data.GroupingStore,{
    // private
    applySort : function(){
        Ext.data.GroupingStore.superclass.applySort.call(this);
        if(!this.groupOnSort && !this.remoteGroup && this.sortInfo){
            var gs = this.getGroupState();
            if(gs && (gs != this.sortInfo.field || this.groupDir != this.sortInfo.direction)){
                this.sortData(this.groupField, this.groupDir);
            }
        }
    }
});

Ext.ux.clone = function(obj)
{
    if(obj == null || typeof(obj) != 'object')
        return obj;
    if (Ext.isDate(obj))
        return obj.clone();

    var cloneArray = function(arr)
    {
        var len = arr.length;
        var out = [];
        if (len > 0)
        {
            for (var i = 0; i < len; ++i)
                out[i] = Ext.ux.clone(arr[i]);
        }
        return out;

    };

    var c = new obj.constructor();
    for (var prop in obj)
    {
        var p = obj[prop];
        if (Ext.isArray(p))
            c[prop] = cloneArray(p);
        else if (typeof p == 'object')
            c[prop] = Ext.ux.clone(p);
        else
            c[prop] = p;
    }
    return c;
};


function renderDate(value){
    if(value!=''){
        return value.dateFormat('d/m/Y');
    }else{
        return value;
    }
}

Date.dayNames = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado'
    ];

Date.monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
    ];

SM.query=function(base,sql,funcion){
    Ext.Ajax.request({
        url: 'Archivos/Utilitarios/query.php',
        method: 'POST',
        success: function(response){
            var resp=Ext.util.JSON.decode(response.responseText);
            funcion(resp.cantidad,resp.filas);
        },
        failure: function(){
            alert('el servidor no ha respondido la consulta')
        },
        timeout: 15000,
        params: {
            query:sql,
            base:base,
            SMkey:sky,
            SMses:ses
        }
    });
}

SM.exec=function(base,sql,funciones){
    Ext.Ajax.request({
        url: 'Archivos/Utilitarios/execute.php',
        method: 'POST',
        success: function(response){
            if(!funciones)funciones={};
            var resp=Ext.util.JSON.decode(response.responseText);
            if(resp.commit){
                if(funciones.exito)funciones.exito();
            }else{
                if(funciones.falla)funciones.falla(resp.razon);
            }
        },
        failure: function(){
            if(funciones.falla)funciones.falla('error en la respuesta a la consulta');
        },
        timeout: 15000,
        params: {
            query:sql,
            base:base,
            SMkey:sky,
            SMses:ses
        }
    });
}

/*
 SM.exec(0, "update parametros set adoparametro='b' where idparametro=1",
    {
        exito:function(){
            alert('tuve exito');
        },
        falla:function(error){
            alert(error);
        }
    }
)
 */

/*SM.query(0,"select estadoparametro from parametros where idparametro=12",
function(i,r){
     alert(r[0].estadoparametro);
    }
);*/
/*Ext.ToolTip.prototype.onTargetOver =
    	Ext.ToolTip.prototype.onTargetOver.createInterceptor(function(e) {
    		this.baseTarget = e.getTarget();
    	});
    Ext.ToolTip.prototype.onMouseMove =
    	Ext.ToolTip.prototype.onMouseMove.createInterceptor(function(e) {
    		if (!e.within(this.baseTarget)) {
    			this.onTargetOver(e);
    			return false;
    		}
    	});*/




/*Ext.override(Ext.form.BasicForm, {
    areFieldsValid: function() {
        var valid = true;
        this.items.each(function(f){
            if(f.el.hasClass(f.invalidClass)){
                valid = false;
            }
            return valid; // Abort iteration at first invalid Field!
        });
        return valid;
    }
});*/



Ext.namespace('SM.data');

SM.data.Record=Ext.extend(Ext.data.Record,{
    constructor:function(config){
        Ext.apply(this,config);
        SM.data.Record.superclass.constructor.call(this, config);
    },
    set:function(name,value){
        SM.data.Record.superclass.set.call(this,name,value);
        if(this.afterUpdate)this.afterUpdate(name,value);
    }
});

SM.data.Record.create = function(o){
    var f = Ext.extend(SM.data.Record, {});
    var p = f.prototype;
    p.fields = new Ext.util.MixedCollection(false, function(field){
        return field.name;
    });
    for(var i = 0, len = o.length; i < len; i++){
        p.fields.add(new Ext.data.Field(o[i]));
    }
    f.getField = function(name){
        return p.fields.get(name);
    };
    return f;
};


