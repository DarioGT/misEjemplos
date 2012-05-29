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

ExtComponents = {

	getComponents : function() {

		var data = [];

		// Form elements
		data.push(
			['Forms','Field Set',
				'A Fieldset, containing other form elements',
				{xtype:'fieldset' ,title:'Legend',autoHeight:true}],
			['Forms','Combo Box',
				'A combo box',
				{xtype:'combo',fieldLabel:'Text',name:'combovalue',hiddenName:'combovalue'}],
			['Forms','Text Field',
				'A Text Field',
				{xtype:'textfield',fieldLabel:'Text',name:'textvalue'}],
			['Forms','Number Field',
				'A Text Field where you can only enter numbers',
				{xtype:'numberfield',fieldLabel:'Number',name:'numbervalue'}],
			['Forms','Time Field',
				'A Text Field where you can only enter a time',
				{xtype:'timefield',fieldLabel:'Time',name:'timevalue'}],
			['Forms','Date Field',
				'A Text Field where you can only enter a date',
				{xtype:'datefield',fieldLabel:'Date',name:'datevalue'}],
			['Forms','Check Box',
				'A checkbox',
				{xtype:'checkbox',fieldLabel:'Label',boxLabel:'Box label',name:'checkbox',inputValue:'cbvalue'}],
			['Forms','Radio Box',
				'A radio form element',
				{xtype:'radio',fieldLabel:'Label',boxLabel:'Box label',name:'radio',inputValue:'radiovalue'}]
			);

		// Simple Panels
		data.push(
			['Panels','Panel',
				'A simple panel with default layout',
				{xtype:'panel',title:'Panel'}],
			['Forms,Panels','Form Panel',
				'A panel containing form elements',
				{xtype:'form',title:'Form'}]
			);

		// Tab Panel
		data.push(['Panels', 'Tab Panel', 'A panel with many tabs', function(add,parent) {
			var w = new Ext.Window({
        width:586,
        height:339,
        title:"New Tab Panel",
        items:[{
            xtype:"form",
            frame:true,
            items:[{
                layout:"table",
                layoutConfig:{
                  columns:2
                },
                defaults:{
                  style:"margin:1px;",
                  border:true
                },
                xtype:"fieldset",
                title:"Tabs",
                autoHeight:true,
                items:[{
                    title:"Title"
                  },{
                    title:"activeTab"
                  },{
                    xtype:"textfield",
                    name:"title_1",
                    width:200
                  },{
                    xtype:"radio",
                    fieldLabel:"Label",
                    boxLabel:"This tab is the default active one",
                    name:"active",
										inputValue:0
                  },{
                    xtype:"textfield",
                    name:"title_2",
                    width:200
                  },{
                    xtype:"radio",
                    fieldLabel:"Label",
                    boxLabel:"This tab is the default active one",
                    name:"active",
										inputValue:1
                  },{
                    xtype:"textfield",
                    name:"title_3",
                    width:200
                  },{
                    xtype:"radio",
                    fieldLabel:"Label",
                    boxLabel:"This tab is the default active one",
                    name:"active",
										inputValue:2
                  },{
                    xtype:"textfield",
                    name:"title_4",
                    width:200
                  },{
                    xtype:"radio",
                    fieldLabel:"Label",
                    boxLabel:"This tab is the default active one",
                    name:"active",
										inputValue:3
                  },{
                    xtype:"textfield",
                    name:"title_5",
                    width:200
                  },{
                    xtype:"radio",
                    fieldLabel:"Label",
                    boxLabel:"This tab is the default active one",
                    name:"active",
										inputValue:4
                  },{
                    xtype:"textfield",
                    name:"title_6",
                    width:200
                  },{
                    xtype:"radio",
                    fieldLabel:"Label",
                    boxLabel:"This tab is the default active one",
                    name:"active",
										inputValue:5
                  }]
              }]
          }],
					buttons:[{
						text:'Ok',
						scope:this,
						handler:function() {
							var values = w.items.first().form.getValues();
							w.close();
							var config = {xtype:'tabpanel',items:[]};
							var activeTab = 0;
							Ext.each([1,2,3,4,5,6], function(i) {
								if (values['title_'+i]) {
									config.items.push({xtype:'panel',title:values['title_'+i]});
									if (values.active == i) { activeTab = i; }
								}
							});
							config.activeTab = activeTab;
							add.call(this, config);
						}
					},{
						text:'Cancel',
						handler:function() {w.close();}
					}]
			});
			w.show();

		}]);

		// Simples Layouts
		data.push(
			['Layouts','Fit Layout',
			'Layout containing only one element, fitted to container',
			{layout:'fit',title:'FitLayout Container'}],
			['Layouts','Card Layout',
			'Layout containing many elements, only one can be displayed at a time',
			{layout:'card',title:'CardLayout Container'}],
			['Layouts','Anchor Layout',
			'Layout containing many elements, sized with "anchor" percentage values',
			{layout:'anchor',title:'AnchorLayout Container'}],
			['Layouts','Absolute Layout',
			'Layout containing many elements, absolutely positionned with x/y values',
			{layout:'absolute',title:'AbsoluteLayout Container'}]
		);

		// Accordion Layout
		data.push(['Layouts', 'Accordion Layout', 'Layout as accordion', function(add,parent) {
			var w = new Ext.Window({
				title:"New Accordion Layout",
				width:619,
				height:552,
				items:[{
						xtype:"form",
						labelWidth:120,
						items:[{
								border:false,
								hideLabels:true,
								layout:"form",
								items:[{
										xtype:"checkbox",
										boxLabel:"collapseFirst <span class=\"notice\">True to make sure the collapse/expand toggle button always renders first (to the left of) any other tools in the contained panels' title bars, false to render it last (defaults to false).</span>",
										name:"collapseFirst"
									},{
										xtype:"checkbox",
										boxLabel:"autoWidth <span class=\"notice\">True to set each contained item's width to 'auto', false to use the item's current width (defaults to true).</span>",
										name:"autoWidth",
										checked:true
									},{
										xtype:"checkbox",
										boxLabel:"animate <span class=\"notice\">True to swap the position of each panel as it is expanded so that it becomes the first item in the container, false to keep the panels in the rendered order. This is NOT compatible with \"animate:true\" (defaults to false).</span>",
										name:"animate"
									},{
										xtype:"checkbox",
										boxLabel:"activeOnTop <span class=\"notice\">True to swap the position of each panel as it is expanded so that it becomes the first item in the container, false to keep the panels in the rendered order. This is NOT compatible with \"animate:true\" (defaults to false).</span>",
										name:"activeOnTop"
									},{
										xtype:"checkbox",
										boxLabel:"fill <span class=\"notice\">True to adjust the active item's height to fill the available space in the container, false to use the item's current height, or auto height if not explicitly set (defaults to true).</span>",
										name:"fill",
										checked:true
									},{
										xtype:"checkbox",
										boxLabel:"hideCollapseTool <span class=\"notice\">True to hide the contained panels' collapse/expand toggle buttons, false to display them (defaults to false). When set to true, titleCollapse should be true also.</span>",
										name:"hideCollapseTool"
									},{
										xtype:"checkbox",
										boxLabel:"titleCollapse <span class=\"notice\">True to allow expand/collapse of each contained panel by clicking anywhere on the title bar, false to allow expand/collapse only when the toggle tool button is clicked (defaults to true). When set to false, hideCollapseTool should be false also.</span>",
										name:"titleCollapse",
										checked:true
									}]
							},{
								xtype:"textfield",
								fieldLabel:"extraCls",
								name:"extraCls"
							},{
								xtype:"checkbox",
								boxLabel:"<span class=\"notice\">Add dummy panels to help render layout (useful for debug)</span>",
								name:"adddummy",
								checked:true,
								fieldLabel:"Add dummy panels"
							}]
					}],
					buttons:[{
						text:'Ok',
						scope:this,
						handler:function() {
							var values = w.items.first().form.getValues();
							w.close();
							var config = {layout:'accordion',layoutConfig:{},items:[]};
							config.layoutConfig.activeOnTop = (values.activeOnTop ? true : false);
							config.layoutConfig.animate = (values.animate ? true : false);
							config.layoutConfig.autoWidth = (values.autoWidth ? true : false);
							config.layoutConfig.collapseFirst = (values.collapseFirst ? true : false);
							config.layoutConfig.fill = (values.fill ? true : false);
							config.layoutConfig.hideCollapseTool = (values.hideCollapseTool ? true : false);
							config.layoutConfig.titleCollapse = (values.titleCollapse ? true : false);
							if (values.extraCls) { config.layoutConfig.extraCls = values.extraCls; }
							if (values.adddummy) {
								config.items.push(
									{title:'Panel 1',html:'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed non risus.'},
									{title:'Panel 2',html:'Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.'},
									{title:'Panel 3',html:'Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.'},
									{title:'Panel 4',html:'Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.'});
							}
							add.call(this, config);
						}
					},{
						text:'Cancel',
						handler:function() {w.close();}
					}]
			});
			w.show();

		}]);

		// Table Layout
		data.push(['Layouts', 'Table Layout', 'Layout as a table', function(add,parent) {
			var w = new Ext.Window({
        width:300,
        height:300,
        layout:"fit",
        title:"New Table Layout",
        items:[{
            xtype:"form",
            frame:true,
            labelWidth:120,
            items:[{
                layout:"table",
                layoutConfig:{
                  columns:2
                },
                items:[{
                    layout:"form",
                    items:[{
                        xtype:"numberfield",
                        fieldLabel:"Columns x Rows",
                        width:48,
                        allowNegative:false,
                        allowDecimals:false,
                        name:"cols"
                      }]
                  },{
                    layout:"form",
                    labelWidth:10,
                    labelSeparator:" ",
                    style:"margin-left:5px",
                    items:[{
                        xtype:"numberfield",
                        fieldLabel:"x",
                        width:48,
                        allowNegative:false,
                        allowDecimals:false,
                        name:"rows"
                      }]
                  }]
              },{
                xtype:"textfield",
                fieldLabel:"Cells padding (px)",
                width:48,
                name:"cellpadding"
              },{
                xtype:"textfield",
                fieldLabel:"Cells margin (px)",
                width:48,
                name:"cellmargin"
              },{
                xtype:"checkbox",
								fieldLabel:"Borders",
								name:"borders",
								checked:true
              },{
                xtype:"checkbox",
								fieldLabel:"Add some content (useful for debug)",
								name:"addcontent",
								checked:true
              }]
          }],
					buttons:[{
						text:'Ok',
						scope:this,
						handler:function() {
							var values = w.items.first().form.getValues();
							var cols = parseInt(values.cols,10);
							var rows = parseInt(values.rows,10);
							if (isNaN(cols) || isNaN(rows)) {
								Ext.Msg.alert("Error", "Columns/Rows are incorrect");
								return;
							}
							w.close();
							var config = {layout:'table',layoutConfig:{columns:cols},items:[]};
							for (var i = 0; i < cols; i++) {
								for (var j = 0; j < rows; j++) {
									config.items.push({html:(values.addcontent?'col '+i+', row '+j:null)});
								}
							}
							var defaults = {};
							var pad = parseInt(values.cellpadding,10);
							if (!isNaN(pad)) { defaults.bodyStyle = 'padding:'+pad+'px;'; }
							var margin = parseInt(values.cellmargin,10);
							if (!isNaN(margin)) { defaults.style = 'margin:'+margin+'px;'; }
							if (!values.borders) { defaults.border = false; }
							if (defaults != {}) { config.defaults = defaults; }
							add.call(this, config);
						}
					},{
						text:'Cancel',
						handler:function() {w.close();}
					}]
			});
			w.show();

		}]);

		// Column Layout
		data.push(['Layouts', 'Column Layout', 'Layout of columns', function(add,parent) {
			var w = new Ext.Window({
        width:425,
        height:349,
        layout:"fit",
        title:"New Column Layout",
        items:[{
            xtype:"form",
            frame:true,
            items:[{
                columns:"3",
                layout:"table",
                layoutConfig:{
                  columns:3
                },
                defaults:{
                  style:"margin:2px"
                },
                items:[{
                    html:"Column"
                  },{
                    html:"Size *"
                  },{
                    html:"Title **"
                  },{
                    xtype:"checkbox",
										name:'active_1'
                  },{
                    xtype:"textfield",
                    maskRe:/[0-9%]/,
                    width:53,
										name:'size_1'
                  },{
                    xtype:"textfield",
										name:'title_1'
                  },{
                    xtype:"checkbox",
										name:'active_2'
                  },{
                    xtype:"textfield",
                    maskRe:/[0-9.%]/,
                    width:53,
										name:'size_2'
                  },{
                    xtype:"textfield",
										name:'title_2'
                  },{
                    xtype:"checkbox",
										name:'active_3'
                  },{
                    xtype:"textfield",
                    maskRe:/[0-9.%]/,
                    width:53,
										name:'size_3'
                  },{
                    xtype:"textfield",
										name:'title_3'
                  },{
                    xtype:"checkbox",
										name:'active_4'
                  },{
                    xtype:"textfield",
                    maskRe:/[0-9.%]/,
                    width:53,
										name:'size_4'
                  },{
                    xtype:"textfield",
										name:'title_4'
                  },{
                    xtype:"checkbox",
										name:'active_5'
                  },{
                    xtype:"textfield",
                    maskRe:/[0-9.%]/,
                    width:53,
										name:'size_5'
                  },{
                    xtype:"textfield",
										name:'title_5'
                  },{
                    xtype:"checkbox",
										name:'active_6'
                  },{
                    xtype:"textfield",
                    maskRe:/[0-9.%]/,
                    width:53,
										name:'size_6'
                  },{
                    xtype:"textfield",
										name:'title_6'
                  }]
              },{
								html:"* Size : can be a percentage of total width (i.e. 33%),"+
									"a fixed with (i.e. 120), or empty (autosize)<br/>"+
									"** Title : not set if empty"
							}]
          }],
					buttons:[{
						text:'Ok',
						scope:this,
						handler:function() {
							var values = w.items.first().form.getValues();
							w.close();
							var config = {layout:'column',items:[]};
							Ext.each([1,2,3,4,5,6], function(r) {
								if (values['active_'+r]) {
									var item = {title:values['title_'+r]||null};
									var widthVal = values['size_'+r];
									var width = parseInt(widthVal,10);
									if (!isNaN(width)) {
										if (widthVal[widthVal.length-1] == '%') {
											item.columnWidth = width/100;
										} else {
											item.width = width;
										}
									}
									config.items.push(item);
								}
							});
							add.call(this, config);
						}
					},{
						text:'Cancel',
						handler:function() {w.close();}
					}]
			});
			w.show();

		}]);

		// Border layout
		data.push(['Layouts','Border Layout', 'Layout with regions', function(add,parent) {
				var w = new Ext.Window({
					title:"Border Layout",
					width:550,
					height:400,
					layout:'fit',
					items:[{
						autoScroll:true,
						xtype:"form",
						frame:true,
						defaults:{
							style:"margin:10px"
						},
						items:[{
								xtype:"fieldset",
								title:"Center",
								autoHeight:true,
								items:[{
										xtype:"textfield",
										fieldLabel:"Title",
										name:"title_center",
										width:299
									}]
							},{
								xtype:"fieldset",
								title:"Add north region",
								autoHeight:true,
								checkboxToggle:true,
								collapsed:true,
								checkboxName:"active_north",
								items:[{
										xtype:"textfield",
										fieldLabel:"Title",
										name:"title_north",
										width:299
									},{
										layout:"table",
										items:[{
												layout:"form",
												items:[{
														xtype:"numberfield",
														fieldLabel:"Height (px)",
														name:"height_north",
														allowDecimals:false,
														allowNegative:false,
														width:66
													}]
											},{
												layout:"form",
												hideLabels:true,
												style:"margin-left:10px",
												items:[{
														xtype:"checkbox",
														name:"split_north",
														boxLabel:"Split"
													}]
											},{
												layout:"form",
												hideLabels:true,
												style:"margin-left:10px",
												items:[{
														xtype:"checkbox",
														name:"collapsible_north",
														boxLabel:"Collapsible"
													}]
											},{
												layout:"form",
												hideLabels:true,
												style:"margin-left:10px",
												items:[{
														xtype:"checkbox",
														name:"titleCollapse_north",
														boxLabel:"TitleCollapse"
													}]
											}]
									}]
							},{
								xtype:"fieldset",
								title:"Add south region",
								autoHeight:true,
								checkboxToggle:true,
								collapsed:true,
								checkboxName:"active_south",
								items:[{
										xtype:"textfield",
										fieldLabel:"Title",
										name:"title_south",
										width:299
									},{
										layout:"table",
										items:[{
												layout:"form",
												items:[{
														xtype:"numberfield",
														fieldLabel:"Height (px)",
														name:"height_south",
														allowDecimals:false,
														allowNegative:false,
														width:66
													}]
											},{
												layout:"form",
												hideLabels:true,
												style:"margin-left:10px",
												items:[{
														xtype:"checkbox",
														name:"split_south",
														boxLabel:"Split"
													}]
											},{
												layout:"form",
												hideLabels:true,
												style:"margin-left:10px",
												items:[{
														xtype:"checkbox",
														name:"collapsible_south",
														boxLabel:"Collapsible"
													}]
											},{
												layout:"form",
												hideLabels:true,
												style:"margin-left:10px",
												items:[{
														xtype:"checkbox",
														name:"titleCollapse_south",
														boxLabel:"TitleCollapse"
													}]
											}]
									}]
							},{
								xtype:"fieldset",
								title:"Add west region",
								autoHeight:true,
								checkboxToggle:true,
								collapsed:true,
								checkboxName:"active_west",
								items:[{
										xtype:"textfield",
										fieldLabel:"Title",
										name:"title_west",
										width:299
									},{
										layout:"table",
										items:[{
												layout:"form",
												items:[{
														xtype:"numberfield",
														fieldLabel:"Width (px)",
														name:"width_west",
														allowDecimals:false,
														allowNegative:false,
														width:66
													}]
											},{
												layout:"form",
												hideLabels:true,
												style:"margin-left:10px",
												items:[{
														xtype:"checkbox",
														name:"split_west",
														boxLabel:"Split"
													}]
											},{
												layout:"form",
												hideLabels:true,
												style:"margin-left:10px",
												items:[{
														xtype:"checkbox",
														name:"collapsible_west",
														boxLabel:"Collapsible"
													}]
											},{
												layout:"form",
												hideLabels:true,
												style:"margin-left:10px",
												items:[{
														xtype:"checkbox",
														name:"titleCollapse_west",
														boxLabel:"TitleCollapse"
													}]
											}]
									}]
							},{
								xtype:"fieldset",
								title:"Add east region",
								autoHeight:true,
								checkboxToggle:true,
								collapsed:true,
								checkboxName:"active_east",
								items:[{
										xtype:"textfield",
										fieldLabel:"Title",
										name:"title_east",
										width:299
									},{
										layout:"table",
										items:[{
												layout:"form",
												items:[{
														xtype:"numberfield",
														fieldLabel:"Width (px)",
														name:"width_east",
														allowDecimals:false,
														allowNegative:false,
														width:66
													}]
											},{
												layout:"form",
												hideLabels:true,
												style:"margin-left:10px",
												items:[{
														xtype:"checkbox",
														name:"split_east",
														boxLabel:"Split"
													}]
											},{
												layout:"form",
												hideLabels:true,
												style:"margin-left:10px",
												items:[{
														xtype:"checkbox",
														name:"collapsible_east",
														boxLabel:"Collapsible"
													}]
											},{
												layout:"form",
												hideLabels:true,
												style:"margin-left:10px",
												items:[{
														xtype:"checkbox",
														name:"titleCollapse_east",
														boxLabel:"TitleCollapse"
													}]
											}]
									}]
							}],
						buttons:[{
							text:'Ok',
							scope:this,
							handler:function() {
								var values = w.items.first().form.getValues();
								w.close();
								var config = {layout:'border',items:[]};
								config.items.push({region:'center',title:values.title_center||null});
								Ext.each(['north','south','west','east'], function(r) {
									if (values['active_'+r]) {
										config.items.push({
											region        : r,
											title         : values['title_'+r]||null,
											width         : parseInt(values['width_'+r], 10)||null,
											height        : parseInt(values['height_'+r], 10)||null,
											split         : (values['split_'+r]?true:null),
											collapsible   : (values['collapsible_'+r]?true:null),
											titleCollapse : (values['titleCollapse_'+r]?true:null)
										});
									}
								});
								if (parent) { parent.layout = 'fit'; }
								add.call(this, config);
							}
						},{
							text:'Cancel',
							handler:function() {w.close();}
						}]
					}]
				});
				w.show();
			}]);

		return data;

	}
};
