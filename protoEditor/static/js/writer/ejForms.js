//  Prueba de formas generadas en el protipador 
//  Se toma la variable en protoForm y se trae aqui 

var individual = [
                                   {
                                       "items" : [
                                               {
                                                   "xtype" : "fieldcontainer",
                                                   defaultType : 'textfield',

                                                   "combineErrors" : true,
                                                   "layout" : "hbox",
                                                   "margins" : 0,
                                                   "pad" : 0,
                                                   "frame" : false,
                                                   "defaults" : {
                                                       "flex" : 1
                                                   },
                                                   "items" : [
                                                           {
                                                               "allowBlank" : false,
                                                               "readOnly" : false,
                                                               "fieldLabel" : "Vues",
                                                               "name" : "code",
                                                               "margins" : "0 10 0 0",
                                                               "frame" : false,
                                                               "flex" : 1
                                                           }, {
                                                               "allowBlank" : false,
                                                               "readOnly" : false,
                                                               "fieldLabel" : "category",
                                                               "name" : "category",
                                                               "margins" : "0 10 0 0",
                                                               "frame" : false,
                                                               "flex" : 1
                                                           }, {
                                                               "name" : "domain",
                                                               "margins" : "0 0 0 0",
                                                               "frame" : false
                                                           }
                                                   ]
                                               }, {
                                                   "allowBlank" : false,
                                                   "readOnly" : false,
                                                   "fieldLabel" : "Descriptions",
                                                   "xtype" : "htmleditor",
                                                   "height" : 200,
                                                   "labelAlign" : "top",
                                                   "name" : "description",
                                                   "flex" : 1,
                                                   "anchor" : "100%",
                                                   "msgTarget" : "side",
                                                   "margins" : "10 10 0"
                                               }
                                       ],
                                       "xtype" : "panel",
                                       "frame" : true,
                                       "border" : 10,
                                       "margins" : "10 10 0",
                                       "layout" : "anchor",
                                       "defaultType" : "textfield",
                                       "anchor" : "100%",
                                       "defaults" : {
                                           "flex" : 1,
                                           "anchor" : "100%",
                                           "xtype" : "textfield",
                                           "msgTarget" : "side",
                                           "margins" : "10 10 0",
                                           "allowBlank" : false,
                                           "readOnly" : false
                                       },
                                       "fieldDefaults" : {},
                                       "autoScroll" : true
                                   }
                               ]

var individual2 = [
    // Contact info
    {
        "xtype" : 'fieldset',
        // title: 'Your Contact Information',
        defaultType : 'textfield',
        layout : 'anchor',
        defaults : {
            anchor : '100%'
        },
        items : [
                {
                    "xtype" : 'fieldcontainer',
                    fieldLabel : 'Name',
                    layout : 'hbox',
                    combineErrors : true,
//                    defaultType : 'textfield',
                    defaults : {
                        hideLabel : 'true'
                    },
                    items : [
                            {
                                name : 'firstName',
                                fieldLabel : 'First Name',
                                flex : 2,
                                emptyText : 'First',
                                allowBlank : false
                            }, {
                                name : 'lastName',
                                fieldLabel : 'Last Name',
                                flex : 3,
                                margins : '0 0 0 6',
                                emptyText : 'Last',
                                allowBlank : false
                            }
                    ]
                },
                {
                    "xtype" : 'container',
                    layout : 'hbox',
                    defaultType : 'textfield',
                    items : [
                            {
                                fieldLabel : 'Email Address',
                                name : 'email',
                                vtype : 'email',
                                flex : 1,
                                allowBlank : false
                            },
                            {
                                fieldLabel : 'Phone Number',
                                labelWidth : 100,
                                name : 'phone',
                                width : 190,
                                emptyText : 'xxx-xxx-xxxx',
                                maskRe : /[\d\-]/,
                                regex : /^\d{3}-\d{3}-\d{4}$/,
                                regexText : 'Must be in the format xxx-xxx-xxxx'
                            }
                    ]
                }
        ]
    }
]
