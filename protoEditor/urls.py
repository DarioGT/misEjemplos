
from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template

from django.contrib import admin
admin.autodiscover()


from contact.viewLogin import *
from contact.views  import *


urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),

    url(r'^contact/', include('contact.urls')),

#   url(r'^login/$', view_login), 
    url(r'^logout/$', view_logout),

    url(r'^writer$', main ),

)


#    url(r'^$', direct_to_template, { 'template': 'index.html' }),
