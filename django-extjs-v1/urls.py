from django.conf.urls.defaults import *
from django.conf import settings
from core.urls import urlpatterns 

urlpatterns += patterns('',
     (r'^$', settings.DEFAULT_VIEW),
) 
