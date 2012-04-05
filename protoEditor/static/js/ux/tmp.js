var individual = [
    {
        "items" : [
                {
                    "xtype" : "fieldcontainer",
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