
SM.ZoomField=Ext.extend(Ext.form.TriggerField,{
    validateCount:0,
    initComponent : function(){
        SM.Zoom.superclass.initComponent.call(this);
        this.addEvents('validationComplete')
        var zoom=this;
        if(!this.zoomKey)this.zoomKey=this.name;
        if(!this.zoomFilter)this.zoomFilter='';
        this.onTriggerClick=function(){
            if(!this.disabled){
                new SM.SMZoom({
                    nemonico:zoom.zoomRef,
                    filtro:zoom.modifyFilter(zoom.zoomFilter),
                    selectValue:function(record){
                        zoom.setRawValue(record.get(zoom.zoomKey));
                        zoom.clearInvalid(true);
                        zoom.fireEvent('validationComplete',record.data);
                    }
                }).show();
            }
        }
        this.on('valid',function(){
            if(this.getValue().trim()!=''&&this.validateCount>0){
                var zoom=this;
                var filt=this.modifyFilter(this.zoomFilter);
                var filtro=this.zoomKey+"='"+this.getValue()+"'";
                if(filt.trim()!='')filtro=filtro+" and "+filt;

                this.markInvalid();
                Ext.Ajax.request({
                    url: 'Archivos/Zoom/validaZoom.php',
                    method: 'POST',
                    success: function(response){
                        var resp=Ext.util.JSON.decode(response.responseText);
                        if(eval(resp.found)){
                            if(resp.total==1){
                                zoom.clearInvalid(true);
                                zoom.fireEvent('validationComplete',resp.registro);
                            }else{
                                if(resp.total>1){
                                    if(!zoom.window){
                                        zoom.window=new SM.SMZoom({
                                            nemonico:zoom.zoomRef,
                                            filtro:filtro,
                                            selectValue:function(record){
                                                zoom.setRawValue(record.get(zoom.zoomKey));
                                                zoom.clearInvalid(true);
                                                zoom.fireEvent('validationComplete',record.data);
                                            }
                                        });
                                        zoom.window.on('close',function(){
                                            zoom.window=false;
                                        });
                                        zoom.window.show();
                                    }
                                }
                            }
                        }
                    },
                    failure: function(){
                        alert('No se ha podido Validar el campo')
                    },
                    timeout: 15000,
                    params: {
                        nemonico: zoom.zoomRef,
                        aplicacion:aplicacion,
                        filtro:filtro,
                        SMkey:sky,
                        SMses:ses
                    }
                });

            }
            this.validateCount++;
        });
    },
    clearInvalid : function(noEvent){
        if(!this.rendered || this.preventMark){
            return;
        }
        this.el.removeClass(this.invalidClass);
        switch(this.msgTarget){
            case 'qtip':
                this.el.dom.qtip = '';
                break;
            case 'title':
                this.el.dom.title = '';
                break;
            case 'under':
                if(this.errorEl){
                    Ext.form.Field.msgFx[this.msgFx].hide(this.errorEl, this);
                }
                break;
            case 'side':
                if(this.errorIcon){
                    this.errorIcon.dom.qtip = '';
                    this.errorIcon.hide();
                    this.un('resize', this.alignErrorIcon, this);
                }
                break;
            default:
                var t = Ext.getDom(this.msgTarget);
                t.innerHTML = '';
                t.style.display = 'none';
                break;
        }
        if(!noEvent)this.fireEvent('valid', this);
    },
    //para sobreescribir por ejemplo para los zooms dependientes
    modifyFilter:function(filter){
        return filter;
    }
});
Ext.reg('zoomfield',SM.ZoomField);