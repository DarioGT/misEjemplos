/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* Ext.BLANK_IMAGE_URL */
Ext.BLANK_IMAGE_URL = '/images/s.gif';

/* Modify Field to have an prefix/suffix */

Ext.apply(Ext.layout.FormLayout.prototype, {

	renderItem : function(c, position, target){
			if(c && !c.rendered && c.isFormField && c.inputType != 'hidden'){
					var args = [
								 c.id, c.fieldLabel,
								 c.labelStyle||this.labelStyle||'',
								 this.elementStyle||'',
								 typeof c.labelSeparator == 'undefined' ? this.labelSeparator : c.labelSeparator,
								 (c.itemCls||this.container.itemCls||'') + (c.hideLabel ? ' x-hide-label' : ''),
								 c.clearCls || 'x-form-clear-left'
					];
					if(typeof position == 'number'){
							position = target.dom.childNodes[position] || null;
					}
					if(position){
							this.fieldTpl.insertBefore(position, args);
					}else{
							this.fieldTpl.append(target, args);
					}
					var fEl = Ext.get('x-form-el-'+c.id);
					c.render(fEl);
					if (c.prefix) { fEl.insertHtml('afterBegin',  c.prefix+'&nbsp;'); }
					if (c.suffix) { fEl.insertHtml('beforeEnd', '&nbsp;'+c.suffix); }
			}else {
					Ext.layout.FormLayout.superclass.renderItem.apply(this, arguments);
			}
	}

});


// some extensions
Ext.form.SimpleCombo = Ext.extend(Ext.form.ComboBox, {
    mode           : 'local',
    triggerAction  : 'all',
    typeAhead      : true,
    valueField     : 'value',
    displayField   : 'name',
    forceSelection : true,
    editable       : true,
		minChars       : 0,
    initComponent  : function(){
        Ext.form.ComboBox.superclass.initComponent.call(this);
        if(!this.store && this.data){
            this.store = new Ext.data.SimpleStore({
                fields: ['value','name','cls'],
                data : this.data
            });
        }
				this.tpl = '<tpl for="."><div class="x-combo-list-item {cls}">{' + this.displayField + '}</div></tpl>';
    }

});
Ext.reg('simplecombo', Ext.form.SimpleCombo);

Ext.form.PostalCodeField = Ext.extend(Ext.form.TextField, {
    maskRe         : /[0-9]/,
		acceptDep      : false,
		width          : 50,

		initComponent  : function() {
			if (this.acceptDep) {
				this.regex = /^\d{2}$|^\d{5}$/;
			} else {
				this.regex = /^\d{5}$/;
			}
		}
});
Ext.reg('postalcodefield', Ext.form.PostalCodeField);

Ext.form.YesNoField = Ext.extend(Ext.form.SimpleCombo, {
	data : [[null,' ',''],[1,'Oui','yes'],[2,'Non','no']],
	width: 50,
	cls:'yes-no-field'
});
Ext.reg('yesnofield', Ext.form.YesNoField);


Ext.form.MultiCheckbox = Ext.extend(Ext.form.Field, {
	data : [['a','Aaa'],['b','Bbb']],
	onRender : function(ct, position){

		this.el = ct.createChild({tag:'div',cls:'x-form-field x-form-multicheckbox',id:this.id||Ext.id()});

		for (var i=0;i<this.data.length;i++) {
			var id = Ext.id();
			this.el.createChild({tag:'div',cls:'x-form-check-wrap',children:[{
				tag: "input", type: 'checkbox', cls: 'x-form-checkbox', autocomplete: "off", id:id, value:this.data[i][0]
			},{
				tag: "label", cls: 'x-form-cb-label', htmlFor:id, html:this.data[i][1]
			}]});
		}
	},

	getValue : function() {
		var value = [];
		this.el.select('input').each(function(i) {
			if (i.dom.checked) {
				value.push(i.dom.value);
			}
		});
		return value;
	},

	getRawValue : function() {
		return this.getValue();
	},

	setValue : function(value) {
		if (!value || !(value instanceof Array)) {value = [];}
		this.el.select('input').each(function(i) {
				i.dom.checked = (value.indexOf(i.dom.value) != -1);
		});
	},

	setRawValue : function(value) {
		this.setValue(value);
	}

});
Ext.reg('multicheckbox', Ext.form.MultiCheckbox);
