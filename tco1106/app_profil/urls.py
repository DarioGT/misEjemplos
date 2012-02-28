#
#    Fichier captant les urls dans /tco/
#
#

from django.conf.urls.defaults import *
from tco.app_profil.views import *

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    (r'^$',main),
    (r'changepassword$',view_changepassword),
    (r'rights$',view_rights)
)



