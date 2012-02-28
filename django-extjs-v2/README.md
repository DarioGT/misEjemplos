django-extjs
============

Django [Form][1] and [ModelForm][2] power for your [ExtJs][3] apps.

Convert your forms.Form and forms.ModelForm to extjs and handles the form submission like any django form.

Generate custom ExtJs dynamic grids from django querysets. You can also set your grids as Editable.

**Grid example :**
    
    # django models 
    class Author(models.Model):
        TITLE_CHOICES = (
                ('MR', _('Mr.')),
                ('MRS', _('Mrs.')),
                ('MS', _('Ms.')),
        )
        name = models.CharField(max_length=100, default="Platon")
        title = models.CharField(max_length=3, choices=TITLE_CHOICES)
        birth_date = models.DateField(blank=True, null=True)

    from extjs import grids
    class AuthorGrid(grids.ModelGrid):
        model = Author
        list_mapping = ['title', 'birth_date']
        mapping = {'his_name': 'name'}

    # the django view
    from extjs import utils
    def users_grid(request):
        # return Json autogrid configuration
        grid = AuthorGrid()            # generic grid from model fields
        authors = Author.objects.all()     # use any queryset
        jsonrows = grid.get_rows_json(authors)
        # got `his_name` `title` and `birth_date` fields
        return utils.JsonResponse(jsonrows)

**Form example :**

    # the django view

    # the form definition (could also be a ModelForm)
    class ContactForm(forms.Form):
        name = forms.CharField(label='your name')
        phone = forms.CharField(label='phone number', required = False)
        mobile_type = forms.CharField(label='phone type', required = True)
        mobile_type.choices = [
             ('ANDROID','Android')
            ,('IPHONE','iPhone')
            ,('SYMBIAN','Symbian (nokia)')
            ,('OTHERS','Others')
        ]
        email = forms.EmailField(label='your email', initial='test@revolunet.com')
        message = forms.CharField(label='your message', widget = forms.widgets.Textarea(attrs={'cols':15, 'rows':5}))

    import extjs
    extjs.register(ContactForm)        # new methods added to the form
            
    # the form view
    from extjs import utils
    import simplejson as json
    def contact_form(request, path = None):
        if request.method == 'POST':
            # handle form submission
            form = ContactForm(request.POST)
            if not form.is_valid():
                return utils.JsonError(form.html_errorlist())
            else:
                # send your email
                print 'send a mail'
            return utils.JsonResponse(json.dumps({
                'success':True, 
                'messages': [{'icon':'/core/static/img/famfamfam/accept.png', 'message':'Enregistrement OK'}]
                }) )
        else:
            # handle form display
            form = ContactForm()
            return utils.JsonResponse(form.as_extjs())
            

**query_from_request example :**

    # request with start=2&limit=10&sort=id&dir=ASC&name=toto

    from extjs.utils import query_from_request
    fields = {"name": "group__name", "id": "id"}
    queryset = MyModel.objects.all()
    query_from_request(request, queryset, fields)

    Is equivalent to::

        queryset.filter(group__name__icontains="toto").order_by(['id'])[2:12]

**The lib provides :**

  - Django code to render your forms as extjs
  - ExtJs helpers to load/save your forms and models
  - Django code to generate full json to render ExtJS grids with paging (metaData + data)

**Features :**

  - Compatible with Form and ModelForm
  - Convert django form fields and widgets to Ext.form fields
  - Handles date formats, foreignkeys, choicefields
  - Ajax submits and django validations error messages
  - Forms can be ajax loaded or not

**Todo :** 

  - Radio groups
  - Fieldsets : using django  [formsets][6] and [model formsets][7]
  - Grids: gestion editors
  - Grids: auto renderer + editor from choices
  - New FK creation

**Tests :**

  - cd tests
  - python bootstrap.py
  - ./bin/buildout.py -v
  - ./bin/test-1.2

  
  [1]: http://docs.djangoproject.com/en/dev/topics/forms/
  [2]: http://docs.djangoproject.com/en/dev/topics/forms/modelforms/
  [3]: http://www.extjs.com
  [4]: http://www.extjs.com/forum/showthread.php?t=22661
  [5]: http://github.com/julienb/django-extjs/commit/3fbad2437db07adef645cbf132659932533e1e95#diff-2
  [6]: http://docs.djangoproject.com/en/dev/topics/forms/formsets/
  [7]: http://docs.djangoproject.com/en/dev/topics/forms/modelforms/
  [8]: http://github.com/revolunet/django-skeleton/tree/extjs
 
