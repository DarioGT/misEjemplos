from django.conf.urls.defaults import *

from extjs.views import query_to_grid
from test_project.apps.testapp.models import Author, Whatamess
from test_project.apps.testapp.models import AuthorGrid, WhatamessGrid
from test_project.apps.testapp.views import aview


urlpatterns = patterns('',
    url(r'^author/getjson$', query_to_grid,
        kwargs={'modelgrid': AuthorGrid, 'queryset': Author.objects.all()}),
    url(r'^decotest$', aview, name="test_decorator"),
    #url(r'^whatamess/getjson$', query_to_grid,
    #    kwargs={'modelgrid': WhatamessGrid, 'queryset': Whatamess.objects.all()}),
)


