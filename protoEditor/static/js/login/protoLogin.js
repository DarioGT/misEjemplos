
Ext.define('ProtoUL.ux.Login' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.protoLogin',

    iconCls:'icon-key', 
    width: 300,
    height: 135,
    frame: true,
    title: 'Identification',
    bodyStyle: "padding:5px 5px 5px 5px",
    labelWidth: 100,
    labelAlign: 'right',
    redirectUrl: false,
    username: '',
    
    defaults: {
        xtype: "textfield",
        anchor: "100%",
        enableKeyEvents : true  
    },
    
    initComponent: function() {

        this.submitButton = new Ext.Button({
            text: "v&eacute;rifier",
            iconCls: "icon-ok",
            scope: this,
            handler: this.submitLogin
        });

        this.resetButton = new Ext.Button({
            text: "mot de passe perdu",
            iconCls: "icon-question",
            scope: this,
            handler: this.resetPassword
        });

        this.buttons = [this.submitButton, this.resetButton];

        
        Ext.apply(this, {
            items: [{
                fieldLabel: "utilisateur",
                name: "login",
                value: this.username,
                listeners: {
                    scope: this,
		            keydown: this.onKeyEnter 
                }
            }, {
                fieldLabel: "mot de passe",
                inputType: "password",
                name: "password",
                listeners: {
                    scope: this,
		            keydown: this.onKeyEnter 
                }
            }]
        });

        this.callParent(arguments);
        
        this.on('afterlayout', function () {
            if (this.username == '') {
                this.getForm().findField('login').focus();
            } else {
                this.getForm().findField('password').focus();
            }
        })

    }, 
 
    onKeyEnter: function( me, e ) { 
        if (e.getKey() == e.ENTER ) {
        	this.submitLogin()
        	}
		},

    submitLogin: function (btn) {

//        btn.disable();
//        var next = window.location.search ? Ext.urlDecode(window.location.search.substring(1)).next : '';

        var form = this.getForm(); 
        if (form.isValid()){
//            btn.setIconCls("icon-loading");
        	form.submit({
	            method:'POST', 
//	            url:"/login?next=" + next,
	            url:"contact/login/",
	            scope: this,
	
	            success: this.submitLoginCallback,
	            failure: this.submitLoginCallback
	        });
//        } else {
//            this.submitButton.enable();
        }
    },
    
    submitLoginCallback: function (form, action) {
        var json = Ext.decode(action.response.responseText);
        json.redirect = 'writer'
        if (json.success === true) window.location = json.redirect;
        else this.error(form, json);
    },
    
    error: function (form, json) {
        Ext.Msg.show({
            buttons: Ext.Msg.OK,
            animEl: 'elId',
            title: 'erreur',
            msg: 'Mauvais utilisateur ou mot de passe',
            icon: Ext.MessageBox.ERROR

        });
        this.submitButton.enable();
        this.submitButton.setIconCls("icon-ok");
        this.getForm().findField('login').focus();
    }, 
    
    resetPassword: function (btn) {
        Ext.Msg.prompt("votre email", "Saisissez votre email", function (btn, email) {
            if (btn == 'ok') {
                Ext.Ajax.request({
                    url: '/apps/login/lostpassword',
                    params: {
                        email: email
                    },
                    scope: this,
                    success: function (response) {
                        json = Ext.decode(response.responseText)
                        if (json.success) {

                            Ext.Msg.show({
                                title: 'Succès',
                                msg: 'Un email contenant les instructions vous a été envoyé',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO
                            });
                        } else {

                            Ext.Msg.show({
                                title: 'Erreur',
                                msg: json.msg,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    },
                    failure: function () {
                        Ext.Msg.show({
                            title: 'Erreur',
                            msg: 'Impossible',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                    }
                })

            }

        }, this)
    }
    
    
});



