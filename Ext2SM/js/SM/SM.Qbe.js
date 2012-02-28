
SM.QBE=Ext.extend(Ext.Window,{
    constructor:function(config){
        Ext.apply(this, config);
					  
        SM.QBE.superclass.constructor.call(this,config);
				 
    },
    initComponent: function(){
        // Before parent code
        //this.form=new Ext.form.BasicForm({});
        var win =this;
        this.title=this.nemo;
        var campos=this.campos;
						
        var form=new Ext.form.FormPanel({
            defaults:{
                width:300
            },
            items:campos,
            labelWidth :150,
            monitorValid : true,
            frame:true,
            bodyStyle:'padding:5px 10px 0',
            keys : [{
                key: Ext.EventObject.ENTER,
                fn: function(){
                    if(!form.buttons[0].disabled)form.buttons[0].handler();
                },
                scope: this
            }],
					
            ///botones
            buttons : [{//text:'aceptar',
                width:10,
                formBind:true,
                cls:"x-btn-icon",
                icon: 'images/chulo.gif',
                handler:function(){
                    var send='';
                    for(i=0; i<campos.length; i++){
                        if(campos[i].getValue().trim()!=''){
                            send+=campos[i].getName()+"$( "+campos[i].getValue()+" ),";
                        }
                    }
                    if(send!=''){
                        send=send.substring(0,send.length-1);
                    }
                    //alert(send);
                        
                    win.aceptar(send);
                    win.close();
                }
            },

            {
                cls:"x-btn-icon",
                icon: 'images/cancelar.gif',
                width:10,
                handler:function(){
                    win.cancelar();
                    win.close();
                }
            }]
        });
        if (!win.items) win.items = [form];
        if(this.campos.length<17)win.height=form.height;
        SM.QBE.superclass.initComponent.apply(this, arguments);// llamada al padre
        // Codigo Despues del la llamada al padre(para eventos o renderizado)
        this.show();
        form.items.items[0].focus(false,50);
    },
    autoScroll:true,
    nemo:null,
    defaultType: 'textfield',
    height:500,
    width:520,
    modal:true,
    aceptar:function(){},
    cancelar:function(){},
    plain: true
});

