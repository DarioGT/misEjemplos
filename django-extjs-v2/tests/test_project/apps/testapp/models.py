from django.db import models
from django.utils.translation import ugettext_lazy as _

class Author(models.Model):
    TITLE_CHOICES = (
            ('MR', _('Mr.')),
            ('MRS', _('Mrs.')),
            ('MS', _('Ms.')),
    )
    name = models.CharField(_('Name'), max_length=100, default="Platon")
    title = models.CharField(max_length=3, choices=TITLE_CHOICES)
    birth_date = models.DateField(blank=True, null=True)

    def __unicode__(self):
        return self.name

class Whatamess(models.Model):
    TITLE_CHOICES = (
            (1, _('Mr.')),
            (2, _('Mrs.')),
            (3, _('Ms.')),
    )
    name = models.CharField(max_length=100)
    number = models.IntegerField()
    slug = models.SlugField()
    text = models.TextField()
    author = models.ForeignKey(Author, null=True, blank=True)
    title = models.PositiveSmallIntegerField(max_length=3, choices=TITLE_CHOICES)
    birth_date = models.DateTimeField(blank=True, null=True)
    yesno = models.BooleanField()

    def __unicode__(self):
        return self.name

    def yes(self):
        return True

class AuthorProxy(Author):
        class Meta:
            proxy = True

        @property
        def aprint(self):
            return "Proxy here : %s" % self.name

#### GRIDS


from extjs import grids

class AuthorGrid(grids.ModelGrid):
    model = Author
    list_mapping = ['title', 'birth_date',]
    mapping = {'his_name': 'name'}

class AuthorGrid_idsort(grids.ModelGrid):
    """In this grid we want to sort by id but we don't
    want to show id column by default
    """
    model = Author
    list_mapping = ['id', 'title', 'birth_date',]
    mapping = {'his_name': 'name'}

    fields = ['his_name', 'title', 'birth_date']

class AuthorGridProxy(grids.ModelGrid):
    model = AuthorProxy
    fields = ['uid', 'name', 'title', 'birth_date']
    list_mapping = ['name', 'title', 'birth_date', 'aprint']
    mapping = {'uid': 'id'}

class AuthorGrid_nofields(grids.ModelGrid):
    model = Author

class WhatamessGrid(grids.ModelGrid):
    model = Whatamess
    list_mapping = ['name', 'author']
    mapping = {
        'atitle': "author__title",
    }
    fields = ['name', 'author']

class WhatamessGridChoices(grids.ModelGrid):
    model = Whatamess
    list_mapping = ['name', 'author', 'title']
    mapping = {
        'atitle': "author__title",
    }
    fields = ['name', 'author', 'title']

