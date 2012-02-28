#
#    Fichier captant les urls dans /tco/
#
#

from django.conf.urls.defaults import *
from tco.app_admin.views import *


# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    (r'^$',main),
    (r'^user/$',lst_user),
    (r'^user/add$',add_user),
    (r'^user/([0-9]+)/edit$',edit_user),
    (r'^user/([0-9]+)/delete$',delete_user),
    (r'^user_expert/$',lst_user_expert),
    (r'^user_expert/add$',add_user_expert),
    (r'^user_expert/([0-9]+)/edit$',edit_user_expert),
    (r'^user_expert/([0-9]+)/delete$',delete_user_expert)
)



