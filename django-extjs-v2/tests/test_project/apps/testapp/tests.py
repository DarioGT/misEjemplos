#-*- coding: utf-8 -*-
from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import simplejson
from django.conf import settings
from django.http import HttpRequest, QueryDict
from django.core.urlresolvers import reverse

from datetime import date

from test_project.apps.testapp.forms import ContactForm, AuthorForm, AuthorxcludeForm, WhatamessForm, WhatamessFormFK, I18nForm
from test_project.apps.testapp.models import Author, AuthorProxy, Whatamess
from test_project.apps.testapp.models import AuthorGrid, AuthorGrid_idsort, AuthorGrid_nofields, AuthorGridProxy, WhatamessGrid, WhatamessGridChoices
from extjs.utils import query_from_request, ExtJSONEncoder, get_object_or_404_json
import simplejson

class FormsTestCase(TestCase):
    def testFormbasic(self):
        """Test a simple Form
        """
        cf = ContactForm()
        expct = {"items":[
            {'fieldLabel': 'Subject', 'xtype': 'textfield', 'fieldHidden': False, 'name': 'subject', 'header': 'subject', 'helpText': '', 'maxLength': 100, 'allowBlank': False,},
            {'fieldLabel': 'Message', 'xtype': 'textfield', 'fieldHidden': False, 'value': 'pony', 'name': 'message', 'header': 'message', 'helpText': '', 'allowBlank': False},
            {'vtype': 'email', 'fieldLabel': 'Sender', 'allowBlank': False, 'fieldHidden': False, 'name': 'sender', 'header': 'sender', 'helpText': '', 'xtype': 'textfield'},
            {'fieldLabel': 'Cc myself', 'xtype': 'checkbox', 'fieldHidden': False, 'value': False, 'name': 'cc_myself', 'header': 'cc_myself', 'helpText': '', 'allowBlank': True, 'checked': False, 'boxLabel': 'Cc myself?', 'hideLabel': True,},
            ],
            'buttons': {'reset': 'Reset', 'submit': 'Submit'},
        }
        result = simplejson.loads(cf.as_extjs())
        self.assertEqual(expct, result)
        cf = ContactForm({'subject':'PONY', 'cc_myself':True})
        result = simplejson.loads(cf.as_extjs())
        self.assertEqual(result["items"][0]["value"], "PONY")
        self.assertEqual(result["items"][3]["value"], True)

        expct["items"][0]["value"] = "PONY"
        expct["items"][3]["value"] = True
        expct["items"][3]["checked"] = True
        self.assertEqual(expct, result)

    def testModelFormbasic(self):
        """Test a ModelForm
        """
        cf = AuthorForm()
        expct = {"items":[
            {"fieldLabel": "Name", "xtype": "textfield", "fieldHidden": False, "header": "name", "allowBlank": False, "helpText": "", "maxLength": 100, "name": "name", "value": "Platon",},
            {"xtype": "combo", "forceSelection": True, "editable": True, 'selectOnFocus': True, 'typeAhead': True, "triggerAction": 'all', "hiddenName": "title", "fieldLabel": "Title", "name": "title", "header": "title", "fieldHidden": False, "value": "", "width": 150, "allowBlank": False, "helpText": "", "mode": "local", "store": [["", "---------"], ["MR", "Mr."], ["MRS", "Mrs."], ["MS", "Ms."]], "listWidth": "auto"},
            {"fieldLabel": "Birth date", "allowBlank": True, "fieldHidden": False, "name": "birth_date", "header": "birth_date", "helpText": "", "xtype": "datefield"}
            ],
            'buttons': {'reset': 'Reset', 'submit': 'Save Author'},
        }
        self.assertEqual(expct, simplejson.loads(cf.as_extjs()))

        # With POST data
        cf = AuthorForm({"name":"PONNY"})
        expct["items"][0]["value"] = "PONNY"
        self.assertEqual(expct, simplejson.loads(cf.as_extjs()))

        # With an instance
        from datetime import date
        auth1 = Author.objects.create(name="toto", title="MR")
        expct["items"][0]["value"] = "toto"
        expct["items"][1]["value"] = "MR"
        cf = AuthorForm(instance=auth1)
        self.assertEqual(expct, simplejson.loads(cf.as_extjs()))

    def testModelFormcomplex(self):
        """Test a ModelForm with lot of fields
        """
        cf = WhatamessForm()
        expct = {"items":[
            {"fieldLabel": "Name", "xtype": "textfield", "fieldHidden": False, "header": "name", "allowBlank": False, "helpText": "", "maxLength": 100, "name": "name",},
            {"fieldLabel": "Number", "allowBlank": False, "fieldHidden": False, "name": "number", "header": "number", "helpText": "", "xtype": "numberfield"},
            {"fieldLabel": "Slug", "xtype": "textfield", "fieldHidden": False, "header": "slug", "allowBlank": False, "helpText": "", "maxLength": 50, "name": "slug",},
            {"fieldLabel": "Text", "allowBlank": False, "fieldHidden": False, "name": "text", "header": "text", "helpText": "", "xtype": "textarea"},
            {"xtype": "combo", "forceSelection": True, "editable": True, 'selectOnFocus': True, 'typeAhead': True, "triggerAction": 'all', "hiddenName": "author", "fieldLabel": "Author", "name": "author", "header": "author", "fieldHidden": False, "value": "", "allowBlank": True, "helpText": "", "mode": "local", "store": [["", "---------"]], "listWidth": "auto", 'width': 150,},
            {"xtype": "combo", "forceSelection": True, "editable": True, 'selectOnFocus': True, 'typeAhead': True, "triggerAction": 'all', "hiddenName": "title", "fieldLabel": "Title", "name": "title", "header": "title", "fieldHidden": False, "value": "", "allowBlank": False, "helpText": "", "mode": "local", "store": [["", "---------"], ["1", "Mr."], ["2", "Mrs."], ["3", "Ms."]], "listWidth": "auto", 'width': 150,},
            {"fieldLabel": "Birth date", "allowBlank": True, "fieldHidden": False, "name": "birth_date", "header": "birth_date", "helpText": "", "xtype": "datefield"},
            {"fieldLabel": "Yesno", "xtype": "checkbox", "fieldHidden": False, "value": False, "header": "yesno", "allowBlank": True, "helpText": "", "name": "yesno", 'checked': False, 'boxLabel': 'Yesno?', 'hideLabel': True,}
            ],
            'buttons': {'reset': 'Reset', 'submit': 'Save Whatamess'},
        }
        self.assertEqual(expct, simplejson.loads(cf.as_extjs()))

    def testModelFormcomplexFK(self):
        """Test a ModelForm with only one field
        """
        cf = WhatamessFormFK()
        expct = {"items":[
            {"xtype": "combo", "forceSelection": True, "editable": True, 'selectOnFocus': True, 'typeAhead': True, "triggerAction": 'all', "hiddenName": "author", "fieldLabel": "Author", "name": "author", "header": "author", "fieldHidden": False, "value": "", "width": 150, "allowBlank": True, "helpText": "", "mode": "local", "store": [["", "---------"]], "listWidth": "auto"},
            ],
            'buttons': {'reset': 'Reset', 'submit': 'Save Whatamess'},
            'layout': ['author']
        }
        self.assertEqual(expct, simplejson.loads(cf.as_extjs()))

    def testModelFormexcludebasic(self):
        """Test a ModelForm with lot of fields and excludes
        """
        cf = AuthorxcludeForm()
        expct = {"items":[
            {"fieldLabel": "Name", "xtype": "textfield", "fieldHidden": False, "header": "name", "allowBlank": False, "helpText": "", "maxLength": 100, "name": "name", "value": "Platon",},
            {"fieldLabel": "Birth date", "allowBlank": True, "fieldHidden": False, "name": "birth_date", "header": "birth_date", "helpText": "", "xtype": "datefield"}
            ],
            'buttons': {'reset': 'Reset', 'submit': 'Save Author'},
        }
        self.assertEqual(expct, simplejson.loads(cf.as_extjs()))

    def testModelFormComplexwithAuthor(self):
        """Test a ModelForm with lot of fields and an Author
        """
        from datetime import date
        auth1 = Author.objects.create(name="toto", title="ToTo", birth_date=date(2000,1,2))
        cf = WhatamessForm()
        expct = {"items":[
            {"fieldLabel": "Name", "xtype": "textfield", "fieldHidden": False, "header": "name", "allowBlank": False, "helpText": "", "maxLength": 100, "name": "name",},
            {"fieldLabel": "Number", "allowBlank": False, "fieldHidden": False, "name": "number", "header": "number", "helpText": "", "xtype": "numberfield"},
            {"fieldLabel": "Slug", "xtype": "textfield", "fieldHidden": False, "header": "slug", "allowBlank": False, "helpText": "", "maxLength": 50, "name": "slug",},
            {"fieldLabel": "Text", "allowBlank": False, "fieldHidden": False, "name": "text", "header": "text", "helpText": "", "xtype": "textarea"},
            {"xtype": "combo", "forceSelection": True, "editable": True, 'selectOnFocus': True, 'typeAhead': True, "triggerAction": 'all', "hiddenName": "author", "fieldLabel": "Author", "name": "author", "header": "author", "fieldHidden": False, "value": "", "width": 150, "allowBlank": True, "helpText": "", "mode": "local", "store": [["", "---------"], ['1', 'toto'],], "listWidth": "auto"},
            {"xtype": "combo", "forceSelection": True, "editable": True, 'selectOnFocus': True, 'typeAhead': True, "triggerAction": 'all', "hiddenName": "title", "fieldLabel": "Title", "name": "title", "header": "title", "fieldHidden": False, "value": "", "width": 150, "allowBlank": False, "helpText": "", "mode": "local", "store": [["", "---------"], ["1", "Mr."], ["2", "Mrs."], ["3", "Ms."]], "listWidth": "auto"},
            {"fieldLabel": "Birth date", "allowBlank": True, "fieldHidden": False, "name": "birth_date", "header": "birth_date", "helpText": "", "xtype": "datefield"},
            {"fieldLabel": "Yesno", "xtype": "checkbox", "fieldHidden": False, "value": False, "header": "yesno", "allowBlank": True, "helpText": "", "name": "yesno", 'checked': False, 'boxLabel': 'Yesno?', 'hideLabel': True,}
            ],
            'buttons': {'reset': 'Reset', 'submit': 'Save Whatamess'},
        }
        self.assertEqual(expct, simplejson.loads(cf.as_extjs()))

    def testFormI18N(self):
        """Test a I18N Form
        """
        cf = I18nForm()
        expct = {"items":[
            {'fieldLabel': 'Subject', 'xtype': 'textfield', 'fieldHidden': False, 'name': 'subject', 'header': 'subject', 'helpText': '', 'maxLength': 100, 'allowBlank': False,},
            ],
            'buttons': {'reset': 'Reset', 'submit': 'Submit'},
        }
        self.assertEqual(expct, simplejson.loads(cf.as_extjs()))

class FormsDataTestCase(TestCase):
    """Tests to have form data
    """
    def testFormbasic(self):
        """Test a simple Form datas
        """
        # With error
        cf = ContactForm({'subject':'PONY', 'message': 'test', 'cc_myself': False})
        expct = {u'errors': {u'sender': [u'This field is required.']}, u'success': False}
        self.assertEqual(expct, simplejson.loads(cf.as_extjsdata()))
        # Without error
        expct_data = {
            'subject': 'PONY',
            'message': 'test',
            'sender': 'pony@wonder.land',
            'cc_myself': False,
        }
        cf = ContactForm({'subject':'PONY', 'message': 'test', 'sender': 'pony@wonder.land', 'cc_myself': False})
        expct = {u"success": True, u"data": expct_data}
        self.assertEqual(expct, simplejson.loads(cf.as_extjsdata()))

    def testModelFormbasic(self):
        """Test a ModelForm
        """
        # With an instance
        auth1 = Author.objects.create(name="toto", title="MR")
        cf = AuthorForm(instance=auth1)
        expct_data = {
            u"name" : u'toto',
            u"title" : u"MR",
            u"birth_date" : None,
            }
        expct = {u"success": True, u"data": expct_data}
        self.assertEqual(expct, simplejson.loads(cf.as_extjsdata()))

    def testFormComplex(self):
        """Test a simple Form datas
        """
        # Without error
        from datetime import date
        auth1 = Author.objects.create(name="toto", title="ToTo", birth_date=date(2000,1,2))
        data = {
            'name':'PONY',
            'number': 1,
            'slug': 'slug',
            'text': 'test',
            'author' : 1,
            'title': 1,
            'yesno':True
        }
        cf = WhatamessForm(data)
        expct_data = {
            'name':'PONY',
            'number': 1,
            'slug': 'slug',
            'text': 'test',
            'author': "toto",
            'title': 1,
            'yesno': True,
            'birth_date': None
        }
        expct_data["author"] = "toto"
        expct = {u"success": True, u"data": expct_data}
        self.assertEqual(expct, simplejson.loads(cf.as_extjsdata()))

    def testModelFormComplexwithAuthor(self):
        """Test a ModelForm with lot of fields and an Author filed with data
        """
        from datetime import date
        auth = Author.objects.create(name="toto", title="toto", birth_date=date(2000,1,2))
        wam1 = Whatamess.objects.create(name="toto", title=1, birth_date=date(2000,1,2), yesno=True, number=1)
        cf = WhatamessForm(instance=wam1)
        expct = {"items":[
            {"fieldLabel": "Name", "xtype": "textfield", "fieldHidden": False, "header": "name", "allowBlank": False, "helpText": "", "maxLength": 100, "name": "name", "value": "toto"},
            {"fieldLabel": "Number", "allowBlank": False, "fieldHidden": False, "name": "number", "header": "number", "helpText": "", "xtype": "numberfield", "value":1},
            {"fieldLabel": "Slug", "xtype": "textfield", "fieldHidden": False, "header": "slug", "allowBlank": False, "helpText": "", "maxLength": 50, "name": "slug", "value": ""},
            {"fieldLabel": "Text", "allowBlank": False, "fieldHidden": False, "name": "text", "header": "text", "helpText": "", "xtype": "textarea", "value": ""},
            {"xtype": "combo", "forceSelection": True, "editable": True, 'selectOnFocus': True, 'typeAhead': True, "triggerAction": 'all', "hiddenName": "author", "fieldLabel": "Author", "name": "author", "header": "author", "fieldHidden": False, "value": "", "width": 150, "allowBlank": True, "helpText": "", "mode": "local", "store": [["", "---------"], ['1', 'toto'],], "listWidth": "auto"},
            {"xtype": "combo", "forceSelection": True, "editable": True, 'selectOnFocus': True, 'typeAhead': True, "triggerAction": 'all', "hiddenName": "title", "fieldLabel": "Title", "name": "title", "header": "title", "fieldHidden": False, "value": 1, "width": 150, "allowBlank": False, "helpText": "", "mode": "local", "store": [["", "---------"], ["1", "Mr."], ["2", "Mrs."], ["3", "Ms."]], "listWidth": "auto"},
            {"fieldLabel": "Birth date", "allowBlank": True, "fieldHidden": False, "name": "birth_date", "header": "birth_date", "helpText": "", "xtype": "datefield", "value": "2000-01-02"},
            {"fieldLabel": "Yesno", "xtype": "checkbox", "fieldHidden": False, "value": True, "header": "yesno", "allowBlank": True, "helpText": "", "name": "yesno", "checked": True, 'boxLabel': 'Yesno?', 'hideLabel': True,}
            ],
            'buttons': {'reset': 'Reset', 'submit': 'Save Whatamess'},
        }
        self.assertEqual(expct, simplejson.loads(cf.as_extjs()))

    def testModelFormComplexwithAuthorOnlyFields(self):
        """Test a ModelForm with lot of fields and an Author filed with data, get only 3 fields
        """
        self.maxDiff = None
        from datetime import date
        auth = Author.objects.create(name="toto", title="toto", birth_date=date(2000,1,2))
        wam1 = Whatamess.objects.create(name="toto", title=1, birth_date=date(2000,1,2), yesno=True, number=1)
        cf = WhatamessForm(instance=wam1)
        expct = {"slug" : {"fieldLabel": "Slug", "xtype": "textfield", "fieldHidden": False, "header": "slug", "allowBlank": False, "helpText": "", "maxLength": 50, "name": "slug", "value": "",},
                 "text" : {"fieldLabel": "Text", "allowBlank": False, "fieldHidden": False, "name": "text", "header": "text", "helpText": "", "xtype": "textarea", "value": ""},
                 "yesno" : {"fieldLabel": "Yesno", "xtype": "checkbox", "fieldHidden": False, "value": True, "header": "yesno", "allowBlank": True, "helpText": "", "name": "yesno", "checked": True, 'boxLabel': 'Yesno?', 'hideLabel': True,}
                }
        self.assertEqual(expct, cf.as_extjsfields(["slug", "text", "yesno"]))

class GridTestCase(TestCase):
    def setUp(self):
        """
        """
        self.auth1 = Author.objects.create(name="toto", title="MR", birth_date=date(2000,1,2))
        self.auth2 = Author.objects.create(name="tata", title="MR", birth_date=date(2001,2,3))
        self.auth3 = Author.objects.create(name="tutu", title="MRS", birth_date=date(2002,3,4))
        self.wam1 = Whatamess.objects.create(name="dodo", title=1, number=1, text="d o d o", author=self.auth1, yesno=True, birth_date=date(2000,1,2))
        self.wam2 = Whatamess.objects.create(name="dada", title=1, number=2, text="d a d a", author=self.auth2, yesno=True, birth_date=date(2001,2,3))
        self.wam3 = Whatamess.objects.create(name="dudu", title=2, number=3, text="d u d u", author=self.auth3, yesno=True, birth_date=date(2002,3,4))

    def testGridbasic(self):
        """Get a query from a GridModel
        """
        qry = Author.objects.all()
        import datetime
        expct_data = [
            {'his_name': u"toto", 'title': u"MR", 'title_display': "Mr.", 'birth_date': datetime.date(2000, 1, 2)},
            {'his_name': u"tata", 'title': u"MR", 'title_display': "Mr.", 'birth_date': datetime.date(2001, 2, 3)},
            {'his_name': u"tutu", 'title': u"MRS", 'title_display': "Mrs.", 'birth_date': datetime.date(2002, 3, 4)},
        ]
        ag = AuthorGrid()
        raw_result, length = ag.get_rows(qry,)
        self.assertEqual(expct_data, raw_result)
        self.assertEqual(length, 3)

        # And now get result in JSONResponse
        expct_data = [
            {'title': u"MR", 'title_display': "Mr.", 'birth_date': u"2000-01-02", 'his_name': u"toto"},
            {'title': u"MR", 'title_display': "Mr.", 'birth_date': u"2001-02-03", 'his_name': u"tata"},
            {'title': u"MRS", 'title_display': "Mrs.", 'birth_date': u"2002-03-04", 'his_name': u"tutu"},
        ]
        expct = {u"success": True, u"data": expct_data, u'results': 3}
        jsonresult = ag.get_rows_json(qry, fields=['title', 'birth_date', 'his_name'])
        result = simplejson.loads(jsonresult)
        self.assertEqual(expct, result)

        # use pre-configured View
        response = self.client.get("/api/author/getjson")
        result = simplejson.loads(response.content)
        expct_data = [
            {'his_name': "toto", 'title': "MR", 'title_display': "Mr.", 'birth_date': "2000-01-02"},
            {'his_name': "tata", 'title': "MR", 'title_display': "Mr.", 'birth_date': "2001-02-03"},
            {'his_name': "tutu", 'title': "MRS", 'title_display': "Mrs.", 'birth_date': "2002-03-04"},
        ]
        expct = {"success": True, "data": expct_data, 'results': 3}
        self.assertEqual(expct, result)

    def testGridbasic_nofields(self):
        """Get a query from a GridModel without fields
        """
        qry = Author.objects.all()
        import datetime
        expct_data = [
            {"id": 1, 'name': u"toto", 'title': u"MR", 'title_display': "Mr.", 'birth_date': datetime.date(2000, 1, 2)},
            {"id": 2, 'name': u"tata", 'title': u"MR", 'title_display': "Mr.", 'birth_date': datetime.date(2001, 2, 3)},
            {"id": 3, 'name': u"tutu", 'title': u"MRS", 'title_display': "Mrs.", 'birth_date': datetime.date(2002, 3, 4)},
        ]
        ag = AuthorGrid_nofields()
        raw_result, length = ag.get_rows(qry,)
        self.assertEqual(expct_data, raw_result)
        self.assertEqual(length, 3)

    def testGridbasic_nofields_noqueryset(self):
        """Get a query from a GridModel without fields
        try without queryset
        """
        qry = Author.objects.all()
        import datetime
        expct_data = [
            {"id": 1, 'name': u"toto", 'title': u"MR", 'title_display': "Mr.", 'birth_date': datetime.date(2000, 1, 2)},
            {"id": 2, 'name': u"tata", 'title': u"MR", 'title_display': "Mr.",  'birth_date': datetime.date(2001, 2, 3)},
            {"id": 3, 'name': u"tutu", 'title': u"MRS", 'title_display': "Mrs.",  'birth_date': datetime.date(2002, 3, 4)},
        ]
        ag = AuthorGrid_nofields()
        raw_result, length = ag.get_rows(list(qry),)
        self.assertEqual(expct_data, raw_result)
        self.assertEqual(length, 3)

    def testGridbasic_nofields_start(self):
        """Get a query from a GridModel without fields
        """
        qry = Author.objects.all()
        import datetime
        expct_data = [
            {"id": 2, 'name': u"tata", 'title': u"MR", 'title_display': "Mr.", 'birth_date': datetime.date(2001, 2, 3)},
            {"id": 3, 'name': u"tutu", 'title': u"MRS", 'title_display': "Mrs.", 'birth_date': datetime.date(2002, 3, 4)},
        ]
        ag = AuthorGrid_nofields()
        raw_result, length = ag.get_rows(qry, start=1)
        self.assertEqual(expct_data, raw_result)
        self.assertEqual(length, 3)

    def testGridbasic_nofields_limit(self):
        """Get a query from a GridModel without fields
        """
        qry = Author.objects.all()
        import datetime
        expct_data = [
            {"id": 2, 'name': u"tata", 'title': u"MR", 'title_display': "Mr.", 'birth_date': datetime.date(2001, 2, 3)},
        ]
        ag = AuthorGrid_nofields()
        raw_result, length = ag.get_rows(qry, start=1, limit=1)
        self.assertEqual(expct_data, raw_result)
        self.assertEqual(length, 3)

    def testGridbasic_utf8(self):
        """Get a query from a GridModel with utf8
        """
        # adds utf8 record
        from datetime import date
        self.auth4 = Author.objects.create(name="tété", title="TéTé", birth_date=date(2000,1,2))
        qry = Author.objects.all()

        # And now get result in JSONResponse
        expct_data = [
            {'title': u"MR", 'title_display': "Mr.", 'birth_date': u"2000-01-02", 'his_name': u"toto"},
            {'title': u"MR", 'title_display': "Mr.", 'birth_date': u"2001-02-03", 'his_name': u"tata"},
            {'title': u"MRS", 'title_display': "Mrs.", 'birth_date': u"2002-03-04", 'his_name': u"tutu"},
            {'title': u"TéTé", 'title_display': u"TéTé", 'birth_date': u"2000-01-02", 'his_name': u"tété"},
        ]
        ag = AuthorGrid()
        expct = {u"success": True, u"data": expct_data, u'results': 4}
        jsonresult = ag.get_rows_json(qry, fields=['title', 'birth_date', 'his_name'])
        result = simplejson.loads(jsonresult)
        self.assertEqual(expct, result)

    def testGridstore(self):
        """Get Store config from a grid
        """
        #expct = {'store': store,
        columns = [
            {'name': 'birth_date', 'dateFormat': 'Y-m-d', 'format': 'Y-m-d', 'tooltip': u'birth date', 'header': 'birth_date', 'type': 'date','xtype': 'datecolumn'},
            {'header': 'name', 'name': 'name', 'tooltip': u'Name'},
            {'header': 'title', 'name': 'title', 'tooltip': u'title'},
        ]
        ag = AuthorGrid()
        store = ag.to_store()
        expct = {'fields': columns}
        self.assertEqual(expct, store)
        store = ag.to_store(url="/test/blah")
        expct = {'fields': columns, 'url': '/test/blah'}
        self.assertEqual(expct, store)

    def testGridProxy(self):
        """Get a query from a GridModel with proxy and customs methods
        
        Test `fields`
        """
        qry = AuthorProxy.objects.all()
        import datetime
        expct_data = [
            {'uid': 1, 'name': u"toto", 'title': u"MR", 'title_display': "Mr.", 'birth_date': datetime.date(2000, 1, 2)},
            {'uid': 2, 'name': u"tata", 'title': u"MR", 'title_display': "Mr.", 'birth_date': datetime.date(2001, 2, 3)},
            {'uid': 3, 'name': u"tutu", 'title': u"MRS", 'title_display': "Mrs.", 'birth_date': datetime.date(2002, 3, 4)},
        ]
        ag = AuthorGridProxy()
        raw_result, length = ag.get_rows(qry,)
        self.assertEqual(expct_data, raw_result)
        self.assertEqual(length, 3)

        # Use method
        expct_data = [
            {'name': u"toto", 'title': u"MR", 'title_display': "Mr.", 'birth_date': datetime.date(2000, 1, 2), "aprint" : "Proxy here : toto"},
            {'name': u"tata", 'title': u"MR", 'title_display': "Mr.", 'birth_date': datetime.date(2001, 2, 3), "aprint" : "Proxy here : tata"},
            {'name': u"tutu", 'title': u"MRS", 'title_display': "Mrs.", 'birth_date': datetime.date(2002, 3, 4), "aprint" : "Proxy here : tutu"},
        ]
        ag = AuthorGridProxy()
        raw_result, length = ag.get_rows(qry, fields=['name', 'title', 'birth_date', 'aprint'])
        self.assertEqual(expct_data, raw_result)
        self.assertEqual(length, 3)

    def testGridComplex(self):
        """test FK resolutions in ExtJSONEncoder
        """
        qry = Whatamess.objects.all()
        import datetime
        # Use method
        expct_data = [
            {u'name': u"dodo", u'author': u'toto'},
            {u'name': u"dada", u'author': u'tata'},
            {u'name': u"dudu", u'author': u'tutu'},
        ]
        wg = WhatamessGrid()
        expct = {u"success": True, u"data": expct_data, u'results': 3}
        jsonresult = wg.get_rows_json(qry)
        result = simplejson.loads(jsonresult)
        self.assertEqual(expct, result)

    def testGridComplexChoices(self):
        """test FK resolutions in ExtJSONEncoder and
        choices resolution
        """
        qry = Whatamess.objects.all()
        import datetime
        # Use method
        expct_data = [
            {u'name': u"dodo", u'author': u'toto', u'title': 1, u'title_display': u'Mr.'},
            {u'name': u"dada", u'author': u'tata', u'title': 1, u'title_display': u'Mr.'},
            {u'name': u"dudu", u'author': u'tutu', u'title': 2, u'title_display': u'Mrs.'},
        ]
        wg = WhatamessGridChoices()
        expct = {u"success": True, u"data": expct_data, u'results': 3}
        jsonresult = wg.get_rows_json(qry)
        result = simplejson.loads(jsonresult)
        self.assertEqual(expct, result)

    def testGridComplexFK(self):
        """test FK resolutions in ExtJSONEncoder
        """
        # test FK
        qry = Whatamess.objects.all()
        wg = WhatamessGrid()
        expct_data = [
            {'atitle': 'MR', 'atitle_display': "Mr."},
            {'atitle': 'MR', 'atitle_display': "Mr."},
            {'atitle': 'MRS', 'atitle_display': "Mrs."},
        ]
        expct = (expct_data, 3)
        result = wg.get_rows(qry, fields=['atitle',])
        self.assertEqual(expct, result)

    def testGridconfig(self):
        """ expct = {
                    stripeRows: true,
                    autoExpandColumn: 'company',
                    height: 350,
                    width: 600,
                    title: 'Array Grid',
                    // config options for stateful behavior
                    stateful: true,
                    stateId: 'grid'
        }"""
        pass
        #jsonresult = ag.get_rows(qry)
        #result = simplejson.loads(jsonresult)
        #self.assertEqual(expct, result)

    def testGridError(self):
        """Get a error with a query from a GridModel
        """
        qry = Author.objects.all()
        ag = AuthorGrid()
        # And now get result in JSONResponse
        expct_data = [
            {'title': u"MR", 'title_display': "Mr.", 'birth_date': u"2000-01-02", 'name': u"toto"},
            {'title': u"MR", 'title_display': "Mr.", 'birth_date': u"2001-02-03", 'name': u"tata"},
            {'title': u"MRS", 'title_display': "Mrs.", 'birth_date': u"2002-03-04", 'name': u"tutu"},
        ]
        expct = {u"success": False, u"message": "Error : No mapped field 'titl'"}
        jsonresult = ag.get_rows_json(qry, fields=['titl', 'birth_date', 'name'], jsonerror=True)
        result = simplejson.loads(jsonresult)
        self.assertEqual(expct, result)
        # Without jsonerror we get normal Django's exception
        self.assertRaises(AttributeError, ag.get_rows_json, qry, fields=['titl', 'birth_date', 'name'])

    def testGridComplexFKnull(self):
        """test FK resolutions with FK null
        """
        # test FK
        self.wam3 = Whatamess.objects.create(name="didi", title=1, number=4, text="d i d i", yesno=True, birth_date=date(2003,4,5))
        qry = Whatamess.objects.all()
        wg = WhatamessGrid()
        expct_data = [
            {'atitle': 'MR', 'atitle_display': "Mr."},
            {'atitle': 'MR', 'atitle_display': "Mr."},
            {'atitle': 'MRS', 'atitle_display': "Mrs."},
            {'atitle': None},
        ]
        expct = (expct_data, 4)
        result = wg.get_rows(qry, fields=['atitle',])
        self.assertEqual(expct, result)

class QueryFromRequestTest(TestCase):
    """Test fonction query From request
    """
    def setUp(self):
        """
        """
        self.auth0 = Author.objects.create(name="to", title="MR")
        self.auth1 = Author.objects.create(name="tata", title="MR")
        self.auth2 = Author.objects.create(name="tototo", title="MR")
        self.auth3 = Author.objects.create(name="totototo", title="MR")
        self.auth4 = Author.objects.create(name="dototototo", title="DR")
        self.request = HttpRequest()

    def test_query_filter(self):
        """Test simples args
        """
        self.request = HttpRequest()
        qr = Author.objects.all()
        qrd = QueryDict('start=0&dir=ASC&name=tata')
        self.request.REQUEST = qrd
        fields = {"name": "name", "desc": "description", "id": "id"}
        result_qr = query_from_request(self.request, qr, fields=fields)
        self.assertEqual(list(result_qr), [self.auth1])

    def test_query_limit(self):
        """Test limit args
        """
        # test limit
        self.request = HttpRequest()
        qr = Author.objects.all()
        qrd = QueryDict('sort=id&dir=ASC&limit=2')
        self.request.REQUEST = qrd
        fields = {"name": "name", "desc": "description", "id": "id"}
        result_qr = query_from_request(self.request, qr, fields=fields)
        self.assertEqual(result_qr.count(), 2)

        # test start only
        qrd = QueryDict('start=2&sort=id&dir=ASC')
        self.request.REQUEST = qrd
        result_qr = query_from_request(self.request, qr, fields=fields)
        self.assertTrue(self.auth1 not in result_qr)
        self.assertEqual(result_qr.count(), 3)

        # test start & limit
        qrd = QueryDict('start=2&sort=id&dir=ASC&limit=2')
        self.request.REQUEST = qrd
        result_qr = query_from_request(self.request, qr, fields=fields)
        self.assertTrue(self.auth1 not in result_qr)
        self.assertEqual(result_qr.count(), 2)

        # test exception
        qrd = QueryDict('start=2&sort=id&dir=ASC&limit=abc')
        self.request.REQUEST = qrd
        result_qr = query_from_request(self.request, qr, fields=fields)
        self.assertEqual(result_qr.count(), 0)

        # test high limit
        qrd = QueryDict('start=4&sort=id&dir=ASC&limit=20')
        self.request.REQUEST = qrd
        result_qr = query_from_request(self.request, qr, fields=fields)
        self.assertEqual(result_qr.count(), 1)

        # test high start
        qrd = QueryDict('start=24&sort=id&dir=ASC&limit=20')
        self.request.REQUEST = qrd
        result_qr = query_from_request(self.request, qr, fields=fields)
        self.assertEqual(result_qr.count(), 0)

    def test_query_filter_unknowsort(self):
        """Test unknowsort arg
        """
        qr = Author.objects.all()
        qrd = QueryDict('start=0&sort=id&dir=ASC&group_id=1&name=test')
        self.request.REQUEST = qrd
        fields = {"name": "name", "desc": "description"}
        self.assertRaises(IndexError, query_from_request, self.request, qr, fields=fields)

    def test_query_order(self):
        """Test order
        """
        self.request = HttpRequest()
        qr = Author.objects.all()
        qrd = QueryDict('sort=dame&dir=ASC')
        self.request.REQUEST = qrd
        fields = {"dame": "name", "desc": "description", "pk": "id"}
        result_qr = query_from_request(self.request, qr, fields=fields)
        self.assertEqual(result_qr.count(), 5)
        self.assertEqual(result_qr[0], self.auth4)

    def test_query_order_reverse(self):
        """Test order DESC
        """
        self.request = HttpRequest()
        qr = Author.objects.all()
        qrd = QueryDict('sort=dame&dir=DESC')
        self.request.REQUEST = qrd
        fields = {"dame": "name", "desc": "description", "pk": "id"}
        result_qr = query_from_request(self.request, qr, fields=fields)
        self.assertEqual(result_qr.count(), 5)
        self.assertEqual(result_qr[4], self.auth4)

    def test_query_filter_on_model(self):
        """Test simples args
        """
        self.request = HttpRequest()
        qr = Author.objects.all()
        qrd = QueryDict('start=0&dir=ASC&his_name=tata')
        self.request.REQUEST = qrd
        ag = AuthorGrid_idsort()
        result_qr = ag.query_from_request(self.request, qr)
        self.assertEqual(list(result_qr), [self.auth1])

    def test_query_sort_on_model_with_fk(self):
        """
        """
        wam1 = Whatamess.objects.create(name="dodo", title=1, number=1, text="d o d o", author=self.auth1, yesno=True, birth_date=date(2000,1,2))
        wam2 = Whatamess.objects.create(name="dada", title=1, number=2, text="d a d a", author=self.auth2, yesno=True, birth_date=date(2001,2,3))
        wam3 = Whatamess.objects.create(name="dudu", title=1, number=3, text="d u d u", author=self.auth4, yesno=True, birth_date=date(2002,3,4))
        self.request = HttpRequest()
        qr = Whatamess.objects.all()
        qrd = QueryDict('start=0&dir=ASC&sort=atitle')
        self.request.REQUEST = qrd
        wg = WhatamessGrid()
        result_qr = wg.query_from_request(self.request, qr, fields=['atitle'])
        self.assertEqual(result_qr[0], wam3)

    def test_query_filter_on_model_with_fk(self):
        """
        """
        wam1 = Whatamess.objects.create(name="dodo", title=1, number=1, text="d o d o", author=self.auth1, yesno=True, birth_date=date(2000,1,2))
        wam2 = Whatamess.objects.create(name="dada", title=1, number=2, text="d a d a", author=self.auth2, yesno=True, birth_date=date(2001,2,3))
        wam3 = Whatamess.objects.create(name="dudu", title=1, number=3, text="d u d u", author=self.auth4, yesno=True, birth_date=date(2002,3,4))
        self.request = HttpRequest()
        qr = Whatamess.objects.all()
        qrd = QueryDict('start=0&dir=ASC&atitle=D')
        self.request.REQUEST = qrd
        wg = WhatamessGrid()
        result_qr = wg.query_from_request(self.request, qr, fields=['atitle'])
        self.assertEqual(list(result_qr), [wam3])

        result_qr = wg.query_from_request(self.request, qr, fields={'atitle':'author__title'})
        self.assertEqual(list(result_qr), [wam3])

class OtherTests(TestCase):
    """Other tests
    """
    def setUp(self):
        """
        """
        # user
        user = User(email="extjs@extjs.tld", username="extjs")
        user.set_password('extjs')
        user.is_superuser = True
        user.is_staff = False
        user.save()
        self.user = User.objects.get(email="extjs@extjs.tld")

    def test_decorator(self):
        """Test extjs_login_required
        """
        response = self.client.get(reverse('test_decorator'))
        rsp = {"success" : False, 'errorMsg': 'not connected', 'notConnected': True}
        result = simplejson.dumps(rsp, cls=ExtJSONEncoder)
        self.assertTrue("Content-Type: application/json" in str(response))
        self.assertTrue(result in response.content)
        self.client.login(username="extjs", password="extjs")
        response = self.client.get(reverse('test_decorator'))
        self.assertTrue("I was here" in response.content)

    def testObjector404(self):
        """Test get object or 404 extj's util
        """
        self.auth1 = Author.objects.create(name="toto", title="ToTo", birth_date=date(2000,1,2))
        result = get_object_or_404_json(Author, name="toto")
        self.assertTrue(isinstance(result, Author))
        result = get_object_or_404_json(Author, name="nothing")
        self.assertEqual(result.status_code, 404)
        self.assertTrue("not found" in result.content)

