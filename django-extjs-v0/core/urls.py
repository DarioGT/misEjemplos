import os

from django.conf.urls.defaults import *
from django.conf import settings

from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template

# Uncomment the next two lines to enable the admin:
import django.contrib.admin
django.contrib.admin.autodiscover()


urlpatterns = patterns('',
)


#
# STATIC *MUST* BE SERVED BY APACHE
#


def statics_wrapper(request, **dict):
    from django.views import static
    return static.serve(request, dict['path'], document_root = os.path.join(settings.BASE_DIR, 'apps', dict['app'], 'static'), show_indexes=True)
    
urlpatterns += patterns('', (r'^apps/(?P<app>[^/]+)/static/(?P<path>.+)$', statics_wrapper))


# core statics

urlpatterns += patterns('',
    (r'^core/static/(?P<path>.*)/?$', 'django.views.static.serve', {'document_root':settings.MEDIA_ROOT, 'show_indexes':True}), 
)
 
# auto apps includes

urlpatterns += patterns('',    
    (r'^apps/(?P<app>[^/]+)/(?P<view>[^/]+)/?(?P<path>.+)?$', 'core.appdispatcher.dispatch' ),
    (r'^apps/(?P<app>[^/]+)/?$', 'core.appdispatcher.dispatch' ),
)


urlpatterns += patterns('',
   url(r'^admin/', include(django.contrib.admin.site.urls)) ,
     (r'^$', settings.DEFAULT_VIEW),
) 
