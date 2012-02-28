SM.PCL = Ext.extend(Ext.Panel, {
    closable:true,
    layout:'border',
    header: false,
    iconCls : 'PCL-icon',
    plugins:new SM.BaseObject(),
    
    constructor:function(config){
        SM.PCL.superclass.constructor.call(this, config);
    },
    /*funcion initComponents,cualquier componenete agregado al panel debe ser agregado en el
	el metodo Ext.apply de esta funcion*/
    initComponent: function(){
        var ne=this.id;
        var Pcl=this;
        var tabCls;
        if(this.claseTab){
            tabCls=this.claseTab;
        }else{
            tabCls=SM.PCLTabGrid;
        }
        if(this.opciones){
            if(this.opciones.filtroInicio){
                var filt=this.opciones.filtroInicio;
                if((filt.trim()!='1=2')&&(filt.trim()!='')){
                    filt=filt.replace(/\{(\S+)\}/g,
                        function(value){
                            var campo=value.substring(1, value.length-1);
                            var valor=value;
                            if(campo.charAt(0)=='@'){
                                if(campo=='@usuario')valor=NombreUsuario;
                                if(campo=='@idUsuario')valor=usuario;
                                if(campo=='@login')valor=usrLogin;
                            }
                            return valor;
                        }
                        );
                    if(Pcl.filtro.trim()!=''){
                        Pcl.filtro=Pcl.filtro+' and '+filt;
                    }else{
                        Pcl.filtro=filt;
                    }
                }
            }
        }
        this.link=new Ext.TabPanel({
            height:(Pcl.height/2),
            region:'south',
            title:'Vinculos',
            collapsible :true,
            tabPosition : 'bottom',
            //split:true,
            //hidden:true,
            collapsed:true
        });

        this.link.on('beforeremove',function(ln){
            if(ln.items.length==1){
                ln.collapse();
            }
        });

        this.link.on('collapse',function(ln){
            Pcl.tg.setDefaultGridsHeight();
        });

        this.link.on('expand',function(ln){
            Pcl.tg.setGridsHeight((Pcl.height/2)-17);
            var index=Pcl.tg.getActiveTab().getStore().indexOf(Pcl.tg.getActiveTab().getSelectionModel().getSelected());
            Pcl.tg.getActiveTab().getView().focusRow(index);
        });

        var seleccion=function(SM,Number,record){
            if(Pcl.link.items.length>0){
                var ActLnk=Pcl.link.getActiveTab();
                var keyCamp=ActLnk.campoPcl;
                var fl=ActLnk.campoLnk+"='"+record.get(keyCamp)+"'";
                var campoLn=ActLnk.campoLnk;
                var value=record.get(keyCamp);
                ActLnk.setFiltro(fl);
                ActLnk.getActiveTab().cargar();
                var defaults=new Array();
                defaults[campoLn]=value;
                ActLnk.setDefaultsValues(defaults);
            }
        }
  
        this.tg=new tabCls({
            height:Pcl.height+43,
            nemo:this.id,
            id:this.id+'tg',
            filtro:Pcl.filtro,
            filtroQbe:Pcl.filtroQbe,
            split:true,
            selEvento:seleccion,
            cantidadReg:60,
            padre:Pcl
        });

        this.on('activate',function(EstaPcl){
            //EstaPcl.tg.show();
            });

        Ext.apply(this, {
            items: [Pcl.tg,Pcl.link]
        });
        // Before parent code
        SM.PCL.superclass.initComponent.apply(this, arguments);// llamada al padre
        // Codigo Despues del la llamada al padre(para eventos o renderizado)
        this.doLayout();
    },
    
    
    // DGT Agrega las pcl de detalles 
    addLink:function(nemo,campoPcl,campoLnk){
        var link=this.link;
        link.show();
        link.expand();
        var key=this.tg.getActiveTab().getSelectionModel().getSelected().get(campoPcl);
        /*var index=this.tg.getActiveTab().getStore().indexOf(this.tg.getActiveTab().getSelectionModel().getSelected());
        this.tg.getActiveTab().getView().focusRow(index);*/
        var fl=campoLnk+"='"+key+"'";
        var defaults=new Array();
        defaults[campoLnk]=key;
        link.add(new SM.PCLTabGrid({
            height:(this.height/2),
            nemo:nemo,
            defaults:defaults,
            id:this.id+'lnk'+nemo,
            filtro:fl,
            closable:true,
            padreLink:this.id,
            link:true,
            campoPcl:campoPcl,
            campoLnk:campoLnk,
            cantidadReg:40
        })).show();
    }
}); 