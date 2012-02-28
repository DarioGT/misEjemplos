#
#    Fichier captant les urls dans /tco/
#
#

from django.conf.urls.defaults import *
from tco.app_aide.views import *

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    (r'^$',main)
)



